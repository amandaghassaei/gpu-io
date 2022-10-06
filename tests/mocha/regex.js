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
		getFragmentOuts,
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
				assert.equal(glsl1VertexOut('out vec2 v_uv;'), 'varying vec2 v_uv;');
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
		describe('getFragmentOuts', () => {
			it('should throw error for bad out declarations', () => {
				// Handle case where no out_FragColor present.
				assert.equal(getFragmentOuts(glsl1FragmentShader, 'test').length, 0);
				assert.equal(getFragmentOuts('', 'test').length, 0);
				assert.equal(getFragmentOuts('out_FragColor = ', 'test').length, 0);
				assert.throws(() => { getFragmentOuts('out out_FragColor;', 'test'); }, 'No type found for out declaration "out out_FragColor;" for GPUProgram "test".');
			});
			it('should get type for fragment out declaration', () => {
				// Handle whitespace.
				assert.equal(getFragmentOuts('out vec4 out_FragColor;')[0].type, 'vec4');
				assert.equal(getFragmentOuts('out vec4 out_FragColor;')[0].name, 'out_FragColor');
				assert.equal(getFragmentOuts('out    vec4  testVar;')[0].type, 'vec4');
				assert.equal(getFragmentOuts('out    vec4  testVar;')[0].name, 'testVar');
				// Test all types.
				assert.equal(getFragmentOuts('out float out_FragColor;')[0].type, 'float');
				assert.equal(getFragmentOuts('out vec2 out_FragColor;')[0].type, 'vec2');
				assert.equal(getFragmentOuts('out vec3 out_FragColor;')[0].type, 'vec3');
				assert.equal(getFragmentOuts('out vec4 out_FragColor;')[0].type, 'vec4');
				assert.equal(getFragmentOuts('out int out_FragColor;')[0].type, 'int');
				assert.equal(getFragmentOuts('out ivec2 out_FragColor;')[0].type, 'ivec2');
				assert.equal(getFragmentOuts('out ivec3 out_FragColor;')[0].type, 'ivec3');
				assert.equal(getFragmentOuts('out ivec4 out_FragColor;')[0].type, 'ivec4');
				assert.equal(getFragmentOuts('out uvec2 out_FragColor;')[0].type, 'uvec2');
				assert.equal(getFragmentOuts('out uvec3 out_FragColor;')[0].type, 'uvec3');
				assert.equal(getFragmentOuts('out uvec4 out_FragColor;')[0].type, 'uvec4');
				// Handle lowp, mediump, highp.
				assert.equal(getFragmentOuts('out  lowp  vec4  out_FragColor;')[0].type, 'vec4');
				assert.equal(getFragmentOuts('out   mediump ivec2  out_FragColor;')[0].type, 'ivec2');
				assert.equal(getFragmentOuts('out highp  float  out_FragColor;')[0].type, 'float');
			});
			it('should get location for fragment out declaration', () => {
				// Get location
				assert.equal(getFragmentOuts('out  lowp  vec4  out_FragColor;')[0].name, 'out_FragColor');
				assert.equal(getFragmentOuts('layout(location=0)out ivec2  out_FragColor;')[0].name, 'out_FragColor');
				assert.equal(getFragmentOuts('  layout (  location   = 0 ) out ivec2  out_FragColor;')[0].name, 'out_FragColor');
				assert.equal(getFragmentOuts('layout(location=1) out ivec2  out_FragColor2;\nlayout(location=0) out uvec2 out_FragColor1;').length, 2);
				assert.equal(getFragmentOuts('layout(location=1) out ivec2  out_FragColor2;\nlayout(location=0) out uvec2 out_FragColor1;')[0].name, 'out_FragColor1');
				assert.equal(getFragmentOuts('layout(location=1) out ivec2  out_FragColor2;\nlayout(location=0) out uvec2 out_FragColor1;')[1].name, 'out_FragColor2');
				assert.equal(Object.keys(getFragmentOuts('layout(location=1) out ivec2  out_FragColor2;\nlayout(location=0) out uvec2 out_FragColor1;')).length, 2);
			});
			it('should throw error for overlapping variable names/locations', () => {
				assert.equal(Object.keys(getFragmentOuts('out ivec2  out_FragColor2;\nout uvec2 out_FragColor2;')).length, 1);
				assert.equal(Object.keys(getFragmentOuts('layout(location=0) out ivec2  out_FragColor2;\nlayout(location=0) out uvec2 out_FragColor2;')).length, 1);
				assert.throws(() => { getFragmentOuts('layout(location=1)out ivec2  out_FragColor;'); }, 'Must be exactly one out declaration per layout location in GPUProgram "undefined", layout locations must be sequential (no missing location numbers) starting from 0.');
				assert.throws(() => { getFragmentOuts('layout(location=1) out ivec2  out_FragColor2;\nlayout(location=1) out uvec2 out_FragColor1;'); }, 'Must be exactly one out declaration per layout location in GPUProgram "undefined", conflicting declarations found at location 1.');
				assert.throws(() => { getFragmentOuts('layout(location=1) out ivec2  out_FragColor1;\nlayout(location=0) out uvec2 out_FragColor1;'); }, 'All out declarations for variable "out_FragColor1" must have same location in GPUProgram "undefined"');
			});
		});
		describe('glsl1FragmentOut', () => {
			it('should remove out declaration and convert to gl_FragColor', () => {
				// Handle case where no out_FragColor present.
				assert.equal(glsl1FragmentOut(glsl1FragmentShader, 'test')[0], glsl1FragmentShader);
				assert.equal(glsl1FragmentOut('out vec4 out_FragColor;\noutVariable;\nout_FragColor = vec4(0);')[0], '\noutVariable;\ngl_FragColor = vec4(vec4(0));');
				// Handle lowp, mediump, highp.
				assert.equal(glsl1FragmentOut('out  lowp  vec4  out_FragColor;out_FragColor = vec4(0);')[0], 'gl_FragColor = vec4(vec4(0));');
				assert.equal(glsl1FragmentOut('out   mediump ivec2  out_FragColor;out_FragColor = ivec2(0);')[0], 'gl_FragColor = vec4(ivec2(0), 0, 0);');
				assert.equal(glsl1FragmentOut('out highp  float  out_FragColor;out_FragColor = 0.0;')[0], 'gl_FragColor = vec4(0.0, 0, 0, 0);');
				// Throw error if no assignment.
				assert.throws(() => { glsl1FragmentOut('out vec4 out_FragColor;', 'test'); }, 'No assignment found for out declaration in GPUProgram "test".');
			});
			it('should handle edge cases', () => {
				// Make sure regex is lazy.
				assert.equal(glsl1FragmentOut(`
				in vec2 v_uv;
				uniform sampler2D u_initialPositions;
				out vec4 out_FragColor;
				void main() {
					int age = 0;
					if (age < 1) {
						out_FragColor = texture(u_initialPositions, v_uv);
						return;
					}
					out_FragColor = texture(u_initialPositions, v_uv);
				}`)[0], `
				in vec2 v_uv;
				uniform sampler2D u_initialPositions;
				
				void main() {
					int age = 0;
					if (age < 1) {
						gl_FragColor = vec4(texture(u_initialPositions, v_uv));
						return;
					}
					gl_FragColor = vec4(texture(u_initialPositions, v_uv));
				}`);
			});
			it('should handle multiple outputs', () => {
				const sources = glsl1FragmentOut(`
				in vec2 v_uv;
				uniform sampler2D u_initialPositions;
				out vec4 out1;
				layout (location=1) out vec4 out2;
				void main() {
					int age = 0;
					out1 = vec4(0);
					if (age < 1) {
						out1 = texture(u_initialPositions, v_uv);
					}
					out2 = texture(u_initialPositions, v_uv);
				}`);
				assert.equal(sources.length, 2);
				assert.equal(sources[0], `
				in vec2 v_uv;
				uniform sampler2D u_initialPositions;
\t\t\t\t
				 vec4 out2;
				void main() {
					int age = 0;
					gl_FragColor = vec4(vec4(0));
					if (age < 1) {
						gl_FragColor = vec4(texture(u_initialPositions, v_uv));
					}
					out2 = texture(u_initialPositions, v_uv);
				}`);
				assert.equal(sources[1], `
				in vec2 v_uv;
				uniform sampler2D u_initialPositions;
				 vec4 out1;
\t\t\t\t
				void main() {
					int age = 0;
					out1 = vec4(0);
					if (age < 1) {
						out1 = texture(u_initialPositions, v_uv);
					}
					gl_FragColor = vec4(texture(u_initialPositions, v_uv));
				}`);
			});
			it('should handle cases of unknown type', () => {
				const sources = glsl1FragmentOut(`
				in vec2 v_uv;
				uniform vec2 u_offset;
				#ifdef GPUIO_INT
					uniform isampler2D u_input;
					out int out_FragColor;
				#endif
				#ifdef GPUIO_UINT
					uniform usampler2D u_input;
					out uint out_FragColor;
				#endif
				#ifdef GPUIO_FLOAT
					uniform sampler2D u_input;
					out float out_FragColor;
				#endif
				void main() {
					out_FragColor = texture(u_input, v_uv + offset).x;
				}`);
				assert.equal(sources.length, 1);
				assert.equal(sources[0], `
				in vec2 v_uv;
				uniform vec2 u_offset;
				#ifdef GPUIO_INT
					uniform isampler2D u_input;
\t\t\t\t\t
				#endif
				#ifdef GPUIO_UINT
					uniform usampler2D u_input;
\t\t\t\t\t
				#endif
				#ifdef GPUIO_FLOAT
					uniform sampler2D u_input;
\t\t\t\t\t
				#endif
				void main() {
					gl_FragColor = vec4(texture(u_input, v_uv + offset).x, 0, 0, 0);
				}`);
			});
		});
		describe('checkFragmentShaderForFragColor', () => {
			it('should allow gl_FragColor in GLSL1', () => {
				assert.equal(checkFragmentShaderForFragColor(glsl1FragmentShader, GLSL1, 'test'), undefined);
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
				assert.equal(stripComments('// comment\n int a = 40;  // comment\n float b = 5.0;\n'), ' int a = 40; float b = 5.0;\n');
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