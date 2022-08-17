const {
	_testing,
	GLSL1,
	GLSL3,
	PRECISION_HIGH_P,
	PRECISION_MEDIUM_P,
	getVertexShaderMediumpPrecision,
	getFragmentShaderMediumpPrecision,
	isHighpSupportedInVertexShader,
	isHighpSupportedInFragmentShader,
	isWebGL2Supported,
	isWebGL2,
} = WebGLCompute;
const {
	compileShader,
	initGLProgram,
	makeShaderHeader,
	isPowerOf2,
	initSequentialFloatArray,
	preprocessVertexShader,
	preprocessFragmentShader,
} = _testing;

// Testing components of utils that require WebGL with headless chrome + karma + mocha + chai.

const defaultVertexShader = `in vec2 a_internal_position;
#ifdef WEBGLCOMPUTE_UV_ATTRIBUTE
in vec2 a_internal_uv;
#endif
#ifdef WEBGLCOMPUTE_NORMAL_ATTRIBUTE
in vec2 a_internal_normal;
#endif

uniform vec2 u_internal_scale;
uniform vec2 u_internal_translation;

out vec2 v_UV;
out vec2 v_UV_local;
#ifdef WEBGLCOMPUTE_NORMAL_ATTRIBUTE
out vec2 v_normal;
#endif

void main() {
	// Optional varyings.
	#ifdef WEBGLCOMPUTE_UV_ATTRIBUTE
	v_UV_local = a_internal_uv;
	#else
	v_UV_local = a_internal_position;
	#endif
	#ifdef WEBGLCOMPUTE_NORMAL_ATTRIBUTE
	v_normal = a_internal_normal;
	#endif

	// Apply transformations.
	vec2 position = u_internal_scale * a_internal_position + u_internal_translation;

	// Calculate a global uv for the viewport.
	v_UV = 0.5 * (position + 1.0);

	// Calculate vertex position.
	gl_Position = vec4(position, 0, 1);
}`;	

const copyFragmentShader = `in vec2 v_UV;

#ifdef WEBGLCOMPUTE_FLOAT
uniform sampler2D u_state;
#endif
#ifdef WEBGLCOMPUTE_INT
uniform isampler2D u_state;
#endif
#ifdef WEBGLCOMPUTE_UINT
uniform usampler2D u_state;
#endif

#ifdef WEBGLCOMPUTE_FLOAT
out vec4 out_fragColor;
#endif
#ifdef WEBGLCOMPUTE_INT
out ivec4 out_fragColor;
#endif
#ifdef WEBGLCOMPUTE_UINT
out uvec4 out_fragColor;
#endif

void main() {
	out_fragColor = texture(u_state, v_UV);
}`;

describe('utils', function () {
	describe('compileShader', () => {
		it('should compile WebGL2 vertex shaders', () => {
			const webgl2 = document.createElement('canvas').getContext('webgl2');
			assert.typeOf(compileShader(
				webgl2,
				GLSL3,
				PRECISION_HIGH_P,
				PRECISION_HIGH_P,
				preprocessVertexShader(defaultVertexShader, GLSL3),
				webgl2.VERTEX_SHADER,
				'vertex-shader-test',
				(message) => {console.log(message)},
			), 'WebGLShader');
			assert.typeOf(compileShader(
				webgl2,
				GLSL1,
				PRECISION_HIGH_P,
				PRECISION_HIGH_P,
				preprocessVertexShader(defaultVertexShader, GLSL1),
				webgl2.VERTEX_SHADER,
				'vertex-shader-test',
				(message) => {console.log(message)},
			), 'WebGLShader');
		});
		it('should compile WebGL1 vertex shaders', () => {
			const webgl1 = document.createElement('canvas').getContext('webgl');
			assert.typeOf(compileShader(
				webgl1,
				GLSL1,
				PRECISION_HIGH_P,
				PRECISION_HIGH_P,
				preprocessVertexShader(defaultVertexShader, GLSL1),
				webgl1.VERTEX_SHADER,
				'vertex-shader-test',
				(message) => {console.log(message)},
			), 'WebGLShader');
		});
		it('should compile WebGL2 fragment shaders', () => {
			const webgl2 = document.createElement('canvas').getContext('webgl2');
			assert.typeOf(compileShader(
				webgl2,
				GLSL3,
				PRECISION_HIGH_P,
				PRECISION_HIGH_P,
				preprocessFragmentShader(copyFragmentShader, GLSL3),
				webgl2.FRAGMENT_SHADER,
				'fragment-shader-test',
				(message) => {console.log(message)},
				{ 'WEBGLCOMPUTE_INT': '1' },
			), 'WebGLShader');
			assert.typeOf(compileShader(
				webgl2,
				GLSL1,
				PRECISION_HIGH_P,
				PRECISION_HIGH_P,
				preprocessFragmentShader(copyFragmentShader, GLSL1),
				webgl2.FRAGMENT_SHADER,
				'fragment-shader-test',
				(message) => {console.log(message)},
				{ 'WEBGLCOMPUTE_INT': '1' },
			), 'WebGLShader');
		});
		it('should compile WebGL1 fragment shaders', () => {
			const webgl1 = document.createElement('canvas').getContext('webgl');
			assert.typeOf(compileShader(
				webgl1,
				GLSL1,
				PRECISION_HIGH_P,
				PRECISION_HIGH_P,
				preprocessFragmentShader(copyFragmentShader, GLSL1),
				webgl1.FRAGMENT_SHADER,
				'fragment-shader-test',
				(message) => {console.log(message)},
				{ 'WEBGLCOMPUTE_INT': '1' },
			), 'WebGLShader');
		});
	});
	describe('initGLProgram', () => {
		it('should compile WebGL2 programs', () => {
			const webgl2 = document.createElement('canvas').getContext('webgl2');
			const vert3 = compileShader(
				webgl2,
				GLSL3,
				PRECISION_HIGH_P,
				PRECISION_HIGH_P,
				preprocessVertexShader(defaultVertexShader, GLSL3),
				webgl2.VERTEX_SHADER,
				'vertex-shader-test',
				(message) => {console.log(message)},
			);
			const frag3 = compileShader(
				webgl2,
				GLSL3,
				PRECISION_HIGH_P,
				PRECISION_HIGH_P,
				preprocessFragmentShader(copyFragmentShader, GLSL3),
				webgl2.FRAGMENT_SHADER,
				'fragment-shader-test',
				(message) => {console.log(message)},
				{ 'WEBGLCOMPUTE_INT': '1' },
			);
			assert.typeOf(initGLProgram(
				webgl2,
				frag3,
				vert3,
				'webgl1-test',
				(message) => {console.log(message)},
			), 'WebGLProgram');
			const vert1 = compileShader(
				webgl2,
				GLSL1,
				PRECISION_HIGH_P,
				PRECISION_HIGH_P,
				preprocessVertexShader(defaultVertexShader, GLSL1),
				webgl2.VERTEX_SHADER,
				'vertex-shader-test',
				(message) => {console.log(message)},
			);
			const frag1 = compileShader(
				webgl2,
				GLSL1,
				PRECISION_HIGH_P,
				PRECISION_HIGH_P,
				preprocessFragmentShader(copyFragmentShader, GLSL1),
				webgl2.FRAGMENT_SHADER,
				'fragment-shader-test',
				(message) => {console.log(message)},
				{ 'WEBGLCOMPUTE_INT': '1' },
			);
			assert.typeOf(initGLProgram(
				webgl2,
				frag1,
				vert1,
				'webgl1-test',
				(message) => {console.log(message)},
			), 'WebGLProgram');
		});
		it('should compile WebGL1 programs', () => {
			const webgl1 = document.createElement('canvas').getContext('webgl');
			const vert = compileShader(
				webgl1,
				GLSL1,
				PRECISION_HIGH_P,
				PRECISION_HIGH_P,
				preprocessVertexShader(defaultVertexShader, GLSL1),
				webgl1.VERTEX_SHADER,
				'vertex-shader-test',
				(message) => {console.log(message)},
			);
			const frag = compileShader(
				webgl1,
				GLSL1,
				PRECISION_HIGH_P,
				PRECISION_HIGH_P,
				preprocessFragmentShader(copyFragmentShader, GLSL1),
				webgl1.FRAGMENT_SHADER,
				'fragment-shader-test',
				(message) => {console.log(message)},
				{ 'WEBGLCOMPUTE_INT': '1' },
			);
			assert.typeOf(initGLProgram(
				webgl1,
				frag,
				vert,
				'webgl1-test',
				(message) => {console.log(message)},
			), 'WebGLProgram');
		});
	});
	describe('isWebGL2', () => {
		it('should detect WebGL2 context', () => {
			const context = document.createElement('canvas').getContext('webgl2');
			assert.equal(isWebGL2(context), true);
		});
		it('should detect non-WebGL2 context', () => {
			const context1 = document.createElement('canvas').getContext('webgl');
			assert.equal(isWebGL2(context1), false);
			const context2 = document.createElement('canvas').getContext('2d');
			assert.equal(isWebGL2(context2), false);
			assert.equal(isWebGL2(), false);
		});
	});
	describe('isWebGL2Supported', () => {
		it('should return that Chrome supports WebGL 2', () => {
			assert.equal(isWebGL2Supported(), true);
		});
	});
	describe('isHighpSupportedInVertexShader', () => {
		it('should return that Chrome supports highp in vertex shader', () => {
			assert.equal(isHighpSupportedInVertexShader(), true);
		});
	});
	describe('isHighpSupportedInFragmentShader', () => {
		it('should return that Chrome supports highp in fragment shader', () => {
			assert.equal(isHighpSupportedInFragmentShader(), true);
		});
	});
	describe('getVertexShaderMediumpPrecision', () => {
		it('should return that Chrome mediump has highp precision in vertex shader', () => {
			assert.equal(getVertexShaderMediumpPrecision(), PRECISION_HIGH_P);
		});
	});
	describe('getFragmentShaderMediumpPrecision', () => {
		it('should return that Chrome mediump has highp precision in fragment shader', () => {
			assert.equal(getFragmentShaderMediumpPrecision(), PRECISION_HIGH_P);
		});
	});

	describe('preprocessVertexShader', () => {
		const defaultVertexShaderCopy = defaultVertexShader.slice();
		it('should remove #version declarations', () => {
			assert.equal(preprocessVertexShader('#version 300 es', GLSL1), '');
			assert.equal(preprocessVertexShader('#version 300 es', GLSL3), '');
			assert.equal(preprocessVertexShader('#version 100', GLSL1), '');
			assert.equal(preprocessVertexShader('#version 100', GLSL3), '');
		});
		it('should remove precision declarations', () => {
			assert.equal(preprocessVertexShader('precision highp float; precision mediump int;', GLSL1), '');
			assert.equal(preprocessVertexShader('precision highp float; precision mediump int;', GLSL3), '');
			assert.equal(preprocessVertexShader('precision mediump float; precision lowp int;', GLSL1), '');
			assert.equal(preprocessVertexShader('precision mediump float; precision lowp int;', GLSL3), '');
			assert.equal(preprocessVertexShader('precision highp sampler2D; precision mediump usampler2D; precision lowp isampler2D;', GLSL1), '');
		});
		it('should pass valid glsl3 shaders through', () => {
			assert.equal(preprocessVertexShader(defaultVertexShader, GLSL3), defaultVertexShader);
			// No mutations.
			assert.equal(defaultVertexShader, defaultVertexShaderCopy);
		});
		it('should convert glsl3 shader to glsl1', () => {
			assert.equal(preprocessVertexShader(defaultVertexShader, GLSL1), `attribute vec2 a_internal_position;
#ifdef WEBGLCOMPUTE_UV_ATTRIBUTE
in vec2 a_internal_uv;
#endif
#ifdef WEBGLCOMPUTE_NORMAL_ATTRIBUTE
in vec2 a_internal_normal;
#endif

uniform vec2 u_internal_scale;
uniform vec2 u_internal_translation;

varying vec2 v_UV;
varying vec2 v_UV_local;
#ifdef WEBGLCOMPUTE_NORMAL_ATTRIBUTE
varying vec2 v_normal;
#endif

void main() {
	// Optional varyings.
	#ifdef WEBGLCOMPUTE_UV_ATTRIBUTE
	v_UV_local = a_internal_uv;
	#else
	v_UV_local = a_internal_position;
	#endif
	#ifdef WEBGLCOMPUTE_NORMAL_ATTRIBUTE
	v_normal = a_internal_normal;
	#endif

	// Apply transformations.
	vec2 position = u_internal_scale * a_internal_position + u_internal_translation;

	// Calculate a global uv for the viewport.
	v_UV = 0.5 * (position + 1.0);

	// Calculate vertex position.
	gl_Position = vec4(position, 0, 1);
}`);
			// No mutations.
			assert.equal(defaultVertexShader, defaultVertexShaderCopy);
		});
	});
	describe('preprocessFragmentShader', () => {
		const copyFragmentShaderCopy = copyFragmentShader.slice();
		it('should remove #version declarations', () => {
			assert.equal(preprocessFragmentShader('#version 300 es', GLSL1), '');
			assert.equal(preprocessFragmentShader('#version 300 es', GLSL3), '');
			assert.equal(preprocessFragmentShader('#version 100', GLSL1), '');
			assert.equal(preprocessFragmentShader('#version 100', GLSL3), '');
		});
		it('should remove precision declarations', () => {
			assert.equal(preprocessFragmentShader('precision highp float; precision mediump int;', GLSL1), '');
			assert.equal(preprocessFragmentShader('precision highp float; precision mediump int;', GLSL3), '');
			assert.equal(preprocessFragmentShader('precision mediump float; precision lowp int;', GLSL1), '');
			assert.equal(preprocessFragmentShader('precision mediump float; precision lowp int;', GLSL3), '');
			assert.equal(preprocessFragmentShader('precision highp sampler2D; precision mediump usampler2D; precision lowp isampler2D;', GLSL1), '');
		});
		it('should pass valid glsl3 shaders through', () => {
			assert.equal(preprocessFragmentShader(copyFragmentShader, GLSL3), copyFragmentShader);
			// No mutations.
			assert.equal(copyFragmentShader, copyFragmentShaderCopy);
		});
		it('should convert glsl3 shader to glsl1', () => {
			assert.equal(preprocessFragmentShader(copyFragmentShader, GLSL1), `varying vec2 v_UV;

#ifdef WEBGLCOMPUTE_FLOAT
uniform sampler2D u_state;
#endif
#ifdef WEBGLCOMPUTE_INT
uniform sampler2D u_state;
#endif
#ifdef WEBGLCOMPUTE_UINT
uniform sampler2D u_state;
#endif

#ifdef WEBGLCOMPUTE_FLOAT

#endif
#ifdef WEBGLCOMPUTE_INT

#endif
#ifdef WEBGLCOMPUTE_UINT

#endif

void main() {
	gl_FragColor = texture2D(u_state, v_UV);
}`);
			// No mutations.
			assert.equal(copyFragmentShader, copyFragmentShaderCopy);
		});
	});
});