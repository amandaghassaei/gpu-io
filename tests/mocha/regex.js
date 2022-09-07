{
	const {
		_testing,
		GLSL1,
		GLSL3,
	} = GPUIO;
	const {
		glsl1VertexIn,
		castVaryingToFloat,
		glsl1VertexOut,
		glsl1FragmentIn,
		getFragmentOutType,
		glsl1FragmentOut,
		checkFragmentShaderForFragColor,
		glsl1Texture,
		glsl1Sampler2D,
		glsl1Uint,
		highpToMediump,
		stripVersion,
		stripPrecision,
		stripComments,
		getSampler2DsInProgram,
	} = _testing;

	describe('regex', () => {
		describe('glsl1VertexIn', () => {
			it('should convert vertex shader "in" to "attribute"', () => {
				assert.equal(glsl1VertexIn(''), '');
				assert.equal(glsl1VertexIn('inVariable'), 'inVariable');
				assert.equal(glsl1VertexIn('in vec2 a_internal_normal;'), 'attribute vec2 a_internal_normal;');
				assert.equal(glsl1VertexIn('in float a_internal_index; // Index of point.'), 'attribute float a_internal_index; // Index of point.');
				// Handle lowp, mediump, highp.
				assert.equal(glsl1VertexIn('in lowp float a_internal_index; // Index of point.'), 'attribute lowp float a_internal_index; // Index of point.');
				assert.equal(glsl1VertexIn('in highp vec2 a_internal_normal;'), 'attribute highp vec2 a_internal_normal;');
				assert.equal(glsl1VertexIn('in  mediump vec2 a_internal_normal;'), 'attribute  mediump vec2 a_internal_normal;');
			});
		});
		describe('castVaryingToFloat', () => {
			it('should convert int varyings to float types', () => {
				assert.equal(castVaryingToFloat(''), '');
				assert.equal(castVaryingToFloat('varying int test;'), 'varying float test;');
				assert.equal(castVaryingToFloat('varying ivec2 test;'), 'varying vec2 test;');
				assert.equal(castVaryingToFloat('varying ivec3 test;'), 'varying vec3 test;');
				assert.equal(castVaryingToFloat('varying ivec4 test;'), 'varying vec4 test;');
				assert.equal(castVaryingToFloat('varying uint test;'), 'varying float test;');
				assert.equal(castVaryingToFloat('varying uvec2  test;'), 'varying vec2  test;');
				assert.equal(castVaryingToFloat('varying uvec3 test;'), 'varying vec3 test;');
				assert.equal(castVaryingToFloat('varying   uvec4 test;'), 'varying vec4 test;');
				// Keeps float types the same.
				assert.equal(castVaryingToFloat('varying float test;'), 'varying float test;');
				assert.equal(castVaryingToFloat('varying vec2 test;'), 'varying vec2 test;');
				assert.equal(castVaryingToFloat('varying vec3 test;'), 'varying vec3 test;');
				assert.equal(castVaryingToFloat('varying vec4 test;'), 'varying vec4 test;');
			});
			it('should cast all assignments to float', () => {
				assert.equal(castVaryingToFloat('varying int test;\ntest = int(5);'), 'varying float test;\ntest = float(int(5));');
				assert.equal(castVaryingToFloat('varying uvec4 test;\ntest=uvec4(5);'), 'varying vec4 test;\ntest = vec4(uvec4(5));');
				// Doesn't do anything to float types.
				assert.equal(castVaryingToFloat('varying vec3 test;\ntest =  vec3(5);'), 'varying vec3 test;\ntest =  vec3(5);');
				assert.equal(castVaryingToFloat(`
varying int v_index;
void main() {
	v_index = int(a_internal_index);
}`), `
varying float v_index;
void main() {
	v_index = float(int(a_internal_index));
}`);
			});
		});
		describe('glsl1VertexOut', () => {
			it('should convert vertex shader "out" to "varying"', () => {
				assert.equal(glsl1VertexOut(''), '');
				assert.equal(glsl1VertexIn('outVariable'), 'outVariable');
				assert.equal(glsl1VertexIn('flatout'), 'flatout');
				assert.equal(glsl1VertexOut('out vec2 v_UV;'), 'varying vec2 v_UV;');
				// Must also remove "flat".
				assert.equal(glsl1VertexOut('flat out int v_index; // Index of point.'), 'varying float v_index; // Index of point.');
				assert.equal(glsl1VertexOut('flat  out int v_index; // Index of point.'), 'varying float v_index; // Index of point.');
				// Handle lowp, mediump, highp.
				assert.equal(glsl1VertexOut('flat out lowp float a_internal_index; // Index of point.'), 'varying lowp float a_internal_index; // Index of point.');
				assert.equal(glsl1VertexOut('out highp vec2 a_internal_normal;'), 'varying highp vec2 a_internal_normal;');
				assert.equal(glsl1VertexOut('out  mediump vec2 a_internal_normal;'), 'varying  mediump vec2 a_internal_normal;');
				assert.equal(glsl1VertexOut(`flat out int v_index;void main() {a=thing;v_index=int(a_internal_index);b=otherthing;}`),
					`varying float v_index;void main() {a=thing;v_index = float(int(a_internal_index));b=otherthing;}`);
			});
		});
		describe('glsl1FragmentIn', () => {
			it('should convert fragment shader "in" to "varying"', () => {
				assert.equal(glsl1FragmentIn(''), '');
				assert.equal(glsl1FragmentIn('inVariable'), 'inVariable');
				assert.equal(glsl1FragmentIn('in vec2 a_internal_normal;'), 'varying vec2 a_internal_normal;');
				// Must also remove "flat".
				assert.equal(glsl1FragmentIn('flat in float a_internal_index; // Index of point.'), 'varying float a_internal_index; // Index of point.');
				assert.equal(glsl1FragmentIn('flat  in float a_internal_index; // Index of point.'), 'varying float a_internal_index; // Index of point.');
				// Handle lowp, mediump, highp.
				assert.equal(glsl1FragmentIn('flat in lowp float a_internal_index; // Index of point.'), 'varying lowp float a_internal_index; // Index of point.');
				assert.equal(glsl1FragmentIn('in highp vec2 a_internal_normal;'), 'varying highp vec2 a_internal_normal;');
				assert.equal(glsl1FragmentIn('in  mediump vec2 a_internal_normal;'), 'varying  mediump vec2 a_internal_normal;');
			});
		});
		describe('getFragmentOutType', () => {
			it('should get type for fragment out declaration', () => {
				assert.throws(() => { getFragmentOutType('', 'test'); }, 'No type found in out_fragColor declaration for GPUProgram "test".');
				assert.throws(() => { getFragmentOutType('out_fragColor = ', 'test'); }, 'No type found in out_fragColor declaration for GPUProgram "test".');
				// Handle whitespace.
				assert.equal(getFragmentOutType('out vec4 out_fragColor;'), 'vec4');
				assert.equal(getFragmentOutType('out    vec4  out_fragColor;'), 'vec4');
				// Test all types.
				assert.equal(getFragmentOutType('out float out_fragColor;'), 'float');
				assert.equal(getFragmentOutType('out vec2 out_fragColor;'), 'vec2');
				assert.equal(getFragmentOutType('out vec3 out_fragColor;'), 'vec3');
				assert.equal(getFragmentOutType('out vec4 out_fragColor;'), 'vec4');
				assert.equal(getFragmentOutType('out int out_fragColor;'), 'int');
				assert.equal(getFragmentOutType('out ivec2 out_fragColor;'), 'ivec2');
				assert.equal(getFragmentOutType('out ivec3 out_fragColor;'), 'ivec3');
				assert.equal(getFragmentOutType('out ivec4 out_fragColor;'), 'ivec4');
				assert.equal(getFragmentOutType('out uvec2 out_fragColor;'), 'uvec2');
				assert.equal(getFragmentOutType('out uvec3 out_fragColor;'), 'uvec3');
				assert.equal(getFragmentOutType('out uvec4 out_fragColor;'), 'uvec4');
				// Handle lowp, mediump, highp.
				assert.equal(getFragmentOutType('out  lowp  vec4  out_fragColor;'), 'vec4');
				assert.equal(getFragmentOutType('out   mediump ivec2  out_fragColor;'), 'ivec2');
				assert.equal(getFragmentOutType('out highp  float  out_fragColor;'), 'float');
			});
		});
		describe('glsl1FragmentOut', () => {
			it('should remove out declaration and convert out_fragColor to gl_FragColor', () => {
				assert.equal(glsl1FragmentOut('out vec4 out_fragColor;\noutVariable;\nout_fragColor = vec4(0);'), '\noutVariable;\ngl_FragColor = vec4(vec4(0));');
				// Handle lowp, mediump, highp.
				assert.equal(glsl1FragmentOut('out  lowp  vec4  out_fragColor;out_fragColor = vec4(0);'), 'gl_FragColor = vec4(vec4(0));');
				assert.equal(glsl1FragmentOut('out   mediump ivec2  out_fragColor;out_fragColor = ivec2(0);'), 'gl_FragColor = vec4(ivec2(0), 0, 0);');
				assert.equal(glsl1FragmentOut('out highp  float  out_fragColor;out_fragColor = 0.0;'), 'gl_FragColor = vec4(0.0, 0, 0, 0);');
				// Handle case where no out_fragColor present.
				assert.equal(glsl1FragmentOut(glsl1FragmentShader), glsl1FragmentShader);
				// Throw error if no assignment.
				assert.throws(() => { glsl1FragmentOut('out vec4 out_fragColor;', 'test'); }, 'No assignment found for out_fragColor in GPUProgram "test".');
			});
		});
		describe('checkFragmentShaderForFragColor', () => {
			it('should check for out_fragColor in fragment source', () => {
				assert.throws(() => { checkFragmentShaderForFragColor('', GLSL3, 'test'); },
					'Found no "out_fragColor" (GLSL3) or "gl_FragColor" (GLSL1) declarations or  in fragment shader for GPUProgram "test".');
				assert.throws(() => { checkFragmentShaderForFragColor(glsl1FragmentShader, GLSL3, 'test'); },
					'Found "gl_FragColor" declaration in fragment shader for GPUProgram "test": either init GPUComposer with glslVersion = GLSL1 or use GLSL3 syntax in your fragment shader.');
				assert.throws(() => { checkFragmentShaderForFragColor('', GLSL1, 'test'); },
					'Found no "out_fragColor" (GLSL3) or "gl_FragColor" (GLSL1) declarations or  in fragment shader for GPUProgram "test".');
			});
			it('should allow gl_FragColor in GLSL1', () => {
				assert.equal(checkFragmentShaderForFragColor(glsl1FragmentShader, GLSL1, 'test'), true);
			});
		});
		describe('glsl1Texture', () => {
			it('should convert texture to texture2D', () => {
				assert.equal(glsl1Texture('texture(u_sampler, vUV);'), 'texture2D(u_sampler, vUV);');
			});
		});
		describe('glsl1Sampler2D', () => {
			it('should convert isampler2D and usampler2D to sampler2D', () => {
				assert.equal(glsl1Sampler2D('uniform isampler2D  u_test;'), 'uniform sampler2D  u_test;');
				assert.equal(glsl1Sampler2D('uniform usampler2D u_test;'), 'uniform sampler2D u_test;');
				assert.equal(glsl1Sampler2D('uniform sampler2D u_test;'), 'uniform sampler2D u_test;');
				// Handle lowp, mediump, highp.
				assert.equal(glsl1Sampler2D('uniform lowp isampler2D u_test;'), 'uniform lowp sampler2D u_test;');
				assert.equal(glsl1Sampler2D('uniform mediump isampler2D u_test;'), 'uniform mediump sampler2D u_test;');
				assert.equal(glsl1Sampler2D('uniform highp isampler2D u_test;'), 'uniform highp sampler2D u_test;');
			});
		});
		describe('glsl1Uint', () => {
			it('should convert unsigned int types to int', () => {
				assert.equal(glsl1Uint('uint a;'), 'int a;');
				assert.equal(glsl1Uint('uvec2 a;'), 'ivec2 a;');
				assert.equal(glsl1Uint('uvec3 a;'), 'ivec3 a;');
				assert.equal(glsl1Uint('uvec4 a;'), 'ivec4 a;');
				assert.equal(glsl1Uint('uint(4);'), 'int(4);');
				assert.equal(glsl1Uint('uvec2(4, 3);'), 'ivec2(4, 3);');
				assert.equal(glsl1Uint('uvec3(4);'), 'ivec3(4);');
				assert.equal(glsl1Uint('uvec4(4);'), 'ivec4(4);');
			});
		});
		describe('highpToMediump', () => {
			it('should convert highp to mediump', () => {
				assert.equal(highpToMediump('uniform highp int a;'), 'uniform mediump int a;');
				assert.equal(highpToMediump('highp  int a;'), 'mediump  int a;');
			});
		});
		describe('stripVersion', () => {
			it('should strip version numbers from shader', () => {
				assert.equal(stripVersion('#version 300 es'), '');
				assert.equal(stripVersion('#version 100\nint a = 7'), 'int a = 7');
			});
		});
		describe('stripPrecision', () => {
			it('should strip out any precision declarations', () => {
				assert.equal(stripPrecision(' precision mediump isampler2D;'), '');
				assert.equal(stripPrecision('precision   lowp sampler2D;'), '');
				assert.equal(stripPrecision('precision highp  usampler2D;'), '');
				assert.equal(stripPrecision('precision mediump uint;'), '');
				assert.equal(stripPrecision('precision lowp int;a=50'), 'a=50');
			});
		});
		describe('stripComments', () => {
			it('should strip out comments', () => {
				assert.equal(stripComments('// comment\n int a = 40;// comment\n float b = 5.0;\n'), ' int a = 40; float b = 5.0;\n');
				assert.equal(stripComments('/*\nmultiline\n comment\n*/\nint a = 40;/*another *comment*/\nfloat b = 5.0;// comment\n'), '\nint a = 40;\nfloat b = 5.0;');
			});
		});
		describe('getSampler2DsInProgram', () => {
			it('should return the number of sampler2Ds', () => {
				assert.equal(getSampler2DsInProgram(`uniform sampler2D u_test1;uniform usampler2D  u_test2;uniform  lowp isampler2D u_test3;`).length, 3);
				// Removes duplicate sampler declarations.
				assert.equal(getSampler2DsInProgram(copyFragmentShader).length, 1);
			});
		});
	});
}