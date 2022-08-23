{
	const {
		_testing,
		FLOAT,
		INT,
		UINT,
		BOOL,
		GLSL1,
		GLSL3,
		WEBGL1,
		WEBGL2,
		PRECISION_HIGH_P,
		PRECISION_MEDIUM_P,
		getVertexShaderMediumpPrecision,
		getFragmentShaderMediumpPrecision,
		isHighpSupportedInVertexShader,
		isHighpSupportedInFragmentShader,
		isWebGL2Supported,
		isWebGL2,
		FLOAT_1D_UNIFORM,
		FLOAT_2D_UNIFORM,
		FLOAT_3D_UNIFORM,
		FLOAT_4D_UNIFORM,
		INT_1D_UNIFORM,
		INT_2D_UNIFORM,
		INT_3D_UNIFORM,
		INT_4D_UNIFORM,
		UINT_1D_UNIFORM,
		UINT_2D_UNIFORM,
		UINT_3D_UNIFORM,
		UINT_4D_UNIFORM,
	} = WebGLCompute;
	const {
		makeShaderHeader,
		compileShader,
		initGLProgram,
		readyToRead,
		isPowerOf2,
		initSequentialFloatArray,
		preprocessVertexShader,
		preprocessFragmentShader,
		uniformInternalTypeForValue,
	} = _testing;

	// Testing components of utils that require WebGL with headless chrome + karma + mocha + chai.

	describe('utils', () => {
		describe('makeShaderHeader', () => {
			it('should create a valid shader header', () => {
				assert.equal(makeShaderHeader(
					GLSL3,
					PRECISION_HIGH_P,
					PRECISION_MEDIUM_P,
					{ test1: '1', test2: '2' }), `#version 300 es
#define test1 1
#define test2 2
#define WEBGLCOMPUTE_INT_PRECISION 2
#define WEBGLCOMPUTE_FLOAT_PRECISION 1
#if (WEBGLCOMPUTE_INT_PRECISION == 2)
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp int;
#if (__VERSION__ == 300)
precision highp isampler2D;precision highp usampler2D;
#endif
#else
precision mediump int;
#if (__VERSION__ == 300)
precision mediump isampler2D;precision mediump usampler2D;
#endif
#endif
#endif
#if (WEBGLCOMPUTE_INT_PRECISION == 1)
precision mediump int;
#if (__VERSION__ == 300)
precision mediump isampler2D;precision mediump usampler2D;
#endif
#endif
#if (WEBGLCOMPUTE_INT_PRECISION == 0)
precision lowp int;
#if (__VERSION__ == 300)
precision lowp isampler2D;precision lowp usampler2D;
#endif
#endif
#if (WEBGLCOMPUTE_FLOAT_PRECISION == 2)
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;precision highp sampler2D;
#else
precision mediump float;precision mediump sampler2D;
#endif
#endif
#if (WEBGLCOMPUTE_FLOAT_PRECISION == 1)
precision mediump float;precision mediump sampler2D;
#endif
#if (WEBGLCOMPUTE_FLOAT_PRECISION == 0)
precision lowp float;precision lowp sampler2D;
#endif
`);
				assert.equal(makeShaderHeader(
					GLSL1,
					PRECISION_HIGH_P,
					PRECISION_MEDIUM_P,
					{ test1: '1', test2: '2' }), `#define test1 1
#define test2 2
#define WEBGLCOMPUTE_INT_PRECISION 2
#define WEBGLCOMPUTE_FLOAT_PRECISION 1
#if (WEBGLCOMPUTE_INT_PRECISION == 2)
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp int;
#if (__VERSION__ == 300)
precision highp isampler2D;precision highp usampler2D;
#endif
#else
precision mediump int;
#if (__VERSION__ == 300)
precision mediump isampler2D;precision mediump usampler2D;
#endif
#endif
#endif
#if (WEBGLCOMPUTE_INT_PRECISION == 1)
precision mediump int;
#if (__VERSION__ == 300)
precision mediump isampler2D;precision mediump usampler2D;
#endif
#endif
#if (WEBGLCOMPUTE_INT_PRECISION == 0)
precision lowp int;
#if (__VERSION__ == 300)
precision lowp isampler2D;precision lowp usampler2D;
#endif
#endif
#if (WEBGLCOMPUTE_FLOAT_PRECISION == 2)
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;precision highp sampler2D;
#else
precision mediump float;precision mediump sampler2D;
#endif
#endif
#if (WEBGLCOMPUTE_FLOAT_PRECISION == 1)
precision mediump float;precision mediump sampler2D;
#endif
#if (WEBGLCOMPUTE_FLOAT_PRECISION == 0)
precision lowp float;precision lowp sampler2D;
#endif
`);
			});
		});
		describe('compileShader', () => {
			it('should compile WebGL2 vertex shaders', () => {
				const webgl2 = document.createElement('canvas').getContext(WEBGL2);
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
				const webgl1 = document.createElement('canvas').getContext(WEBGL1);
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
				const webgl2 = document.createElement('canvas').getContext(WEBGL2);
				assert.typeOf(compileShader(
					webgl2,
					GLSL3,
					PRECISION_HIGH_P,
					PRECISION_HIGH_P,
					preprocessFragmentShader(copyFragmentShader, GLSL3),
					webgl2.FRAGMENT_SHADER,
					'fragment-shader-test',
					(message) => {console.log(message)},
					{ WEBGLCOMPUTE_INT: '1' },
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
					{ WEBGLCOMPUTE_INT: '1' },
				), 'WebGLShader');
			});
			it('should compile WebGL1 fragment shaders', () => {
				const webgl1 = document.createElement('canvas').getContext(WEBGL1);
				assert.typeOf(compileShader(
					webgl1,
					GLSL1,
					PRECISION_HIGH_P,
					PRECISION_HIGH_P,
					preprocessFragmentShader(copyFragmentShader, GLSL1),
					webgl1.FRAGMENT_SHADER,
					'fragment-shader-test',
					(message) => {console.log(message)},
					{ WEBGLCOMPUTE_INT: '1' },
				), 'WebGLShader');
			});
			it('should throw error if define is not a string', () => {
				const webgl1 = document.createElement('canvas').getContext(WEBGL1);
				assert.throws(() => { compileShader(
					webgl1,
					GLSL1,
					PRECISION_HIGH_P,
					PRECISION_HIGH_P,
					preprocessFragmentShader(copyFragmentShader, GLSL1),
					webgl1.FRAGMENT_SHADER,
					'fragment-shader-test',
					(message) => {console.log(message)},
					{ WEBGLCOMPUTE_INT: 1 },
				); }, 'GPUProgram defines must be passed in as key value pairs that are both strings, got key value pair of type [string : number] for key WEBGLCOMPUTE_INT');
			});
			it('should throw error if precision is not valid value', () => {
				const webgl1 = document.createElement('canvas').getContext(WEBGL1);
				assert.throws(() => { compileShader(
					webgl1,
					GLSL1,
					'thing1',
					PRECISION_HIGH_P,
					preprocessFragmentShader(copyFragmentShader, GLSL1),
					webgl1.FRAGMENT_SHADER,
					'fragment-shader-test',
					(message) => {console.log(message)},
					{ WEBGLCOMPUTE_INT: '1' },
				); }, 'Unknown shader precision value: "thing1".');
				assert.throws(() => { compileShader(
					webgl1,
					GLSL1,
					PRECISION_HIGH_P,
					'thing2',
					preprocessFragmentShader(copyFragmentShader, GLSL1),
					webgl1.FRAGMENT_SHADER,
					'fragment-shader-test',
					(message) => {console.log(message)},
					{ WEBGLCOMPUTE_INT: '1' },
				); }, 'Unknown shader precision value: "thing2".');
			});
		});
		describe('initGLProgram', () => {
			it('should compile WebGL2 programs', () => {
				const webgl2 = document.createElement('canvas').getContext(WEBGL2);
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
					{ WEBGLCOMPUTE_INT: '1' },
				);
				assert.typeOf(initGLProgram(
					webgl2,
					vert3,
					frag3,
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
					{ WEBGLCOMPUTE_INT: '1' },
				);
				assert.typeOf(initGLProgram(
					webgl2,
					vert1,
					frag1,
					'webgl1-test',
					(message) => {console.log(message)},
				), 'WebGLProgram');
			});
			it('should compile WebGL1 programs', () => {
				const webgl1 = document.createElement('canvas').getContext(WEBGL1);
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
					{ WEBGLCOMPUTE_INT: '1' },
				);
				assert.typeOf(initGLProgram(
					webgl1,
					vert,
					frag,
					'webgl1-test',
					(message) => {console.log(message)},
				), 'WebGLProgram');
			});
		});
		describe('isWebGL2', () => {
			it('should detect WebGL2 context', () => {
				const context = document.createElement('canvas').getContext(WEBGL2);
				assert.equal(isWebGL2(context), true);
			});
			it('should detect non-WebGL2 context', () => {
				const context1 = document.createElement('canvas').getContext(WEBGL1);
				assert.equal(isWebGL2(context1), false);
				const context2 = document.createElement('canvas').getContext('2d');
				assert.equal(isWebGL2(context2), false);
				assert.equal(isWebGL2(), false);
				assert.equal(isWebGL2(null), false);
			});
		});
		describe('readyToRead', () => {
			it('should determine if framebuffer is ready to read', () => {
				const context = document.createElement('canvas').getContext(WEBGL2);
				const framebuffer = context.createFramebuffer();
				assert.equal(readyToRead(context), true);
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
		describe('isPowerOf2', () => {
			it('should detect power of 2 numbers', () => {
				assert.equal(isPowerOf2(0), false);
				assert.equal(isPowerOf2(1), true);
				assert.equal(isPowerOf2(2), true);
				assert.equal(isPowerOf2(4), true);
				assert.equal(isPowerOf2(1024), true);
				assert.equal(isPowerOf2(23124), false);
				assert.equal(isPowerOf2(-64), false);
			});
		});
		describe('initSequentialFloatArray', () => {
			it('should init sequential Float32 array', () => {
				assert.equal(initSequentialFloatArray(0).toString(), '');
				assert.equal(initSequentialFloatArray(1).toString(), Float32Array.from([0]).toString());
				assert.equal(initSequentialFloatArray(2).toString(), Float32Array.from([0, 1]).toString());
				assert.equal(initSequentialFloatArray(12).toString(), Float32Array.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]).toString());
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
		describe('uniformInternalTypeForValue', () => {
			it('should throw error if value is wrong type', () => {
				assert.throws(() => { uniformInternalTypeForValue('test', FLOAT, 'u_myUniform', 'test-program'); },
					'Invalid value "test" for uniform "u_myUniform" in program "test-program", expected float or float[] of length 1-4.');
				assert.throws(() => { uniformInternalTypeForValue([2, 4, 6, 7, 8], FLOAT, 'u_myUniform', 'test-program'); },
					'Invalid value [2,4,6,7,8] for uniform "u_myUniform" in program "test-program", expected float or float[] of length 1-4.');
				assert.throws(() => { uniformInternalTypeForValue([2, 4, {}, 7], FLOAT, 'u_myUniform', 'test-program'); },
					'Invalid value [2,4,{},7] for uniform "u_myUniform" in program "test-program", expected float or float[] of length 1-4.');

				assert.throws(() => { uniformInternalTypeForValue('test', INT, 'u_myUniform', 'test-program'); },
					'Invalid value "test" for uniform "u_myUniform" in program "test-program", expected int or int[] of length 1-4.');
				assert.throws(() => { uniformInternalTypeForValue(4.5, INT, 'u_myUniform', 'test-program'); },
					'Invalid value 4.5 for uniform "u_myUniform" in program "test-program", expected int or int[] of length 1-4.');
				assert.throws(() => { uniformInternalTypeForValue([2, 4, 6, 7, 8], INT, 'u_myUniform', 'test-program'); },
					'Invalid value [2,4,6,7,8] for uniform "u_myUniform" in program "test-program", expected int or int[] of length 1-4.');
				assert.throws(() => { uniformInternalTypeForValue([2.4, 5.5], INT, 'u_myUniform', 'test-program'); },
					'Invalid value [2.4,5.5] for uniform "u_myUniform" in program "test-program", expected int or int[] of length 1-4.');

					assert.throws(() => { uniformInternalTypeForValue('test', UINT, 'u_myUniform', 'test-program'); },
					'Invalid value "test" for uniform "u_myUniform" in program "test-program", expected uint or uint[] of length 1-4.');
				assert.throws(() => { uniformInternalTypeForValue(4.5, UINT, 'u_myUniform', 'test-program'); },
					'Invalid value 4.5 for uniform "u_myUniform" in program "test-program", expected uint or uint[] of length 1-4.');
				assert.throws(() => { uniformInternalTypeForValue([2, 4, 6, 7, 8], UINT, 'u_myUniform', 'test-program'); },
					'Invalid value [2,4,6,7,8] for uniform "u_myUniform" in program "test-program", expected uint or uint[] of length 1-4.');
				assert.throws(() => { uniformInternalTypeForValue([2.4, 5.5], UINT, 'u_myUniform', 'test-program'); },
					'Invalid value [2.4,5.5] for uniform "u_myUniform" in program "test-program", expected uint or uint[] of length 1-4.');
				assert.throws(() => { uniformInternalTypeForValue([2, 4, -6, 8], UINT, 'u_myUniform', 'test-program'); },
					'Invalid value [2,4,-6,8] for uniform "u_myUniform" in program "test-program", expected uint or uint[] of length 1-4.');

				assert.throws(() => { uniformInternalTypeForValue('test', BOOL, 'u_myUniform', 'test-program'); },
					'Invalid value "test" for uniform "u_myUniform" in program "test-program", expected boolean.');
				assert.throws(() => { uniformInternalTypeForValue(3, BOOL, 'u_myUniform', 'test-program'); },
					'Invalid value 3 for uniform "u_myUniform" in program "test-program", expected boolean.');
				assert.throws(() => { uniformInternalTypeForValue(1, BOOL, 'u_myUniform', 'test-program'); },
					'Invalid value 1 for uniform "u_myUniform" in program "test-program", expected boolean.');
				assert.throws(() => { uniformInternalTypeForValue(0, BOOL, 'u_myUniform', 'test-program'); },
					'Invalid value 0 for uniform "u_myUniform" in program "test-program", expected boolean.');
				assert.throws(() => { uniformInternalTypeForValue([true, false], BOOL, 'u_myUniform', 'test-program'); },
					'Invalid value [true,false] for uniform "u_myUniform" in program "test-program", expected boolean.');
			});
			it('should throw error if type is invalid', () => {
				assert.throws(() => { uniformInternalTypeForValue(0, 'THING', 'u_myUniform', 'test-program'); },
					'Invalid type "THING" for uniform "u_myUniform" in program "test-program", expected FLOAT or INT of BOOL.');
			});
			it('should return valid uniform type', () => {
				assert.equal(uniformInternalTypeForValue(0, FLOAT, 'test-program'), FLOAT_1D_UNIFORM);
				assert.equal(uniformInternalTypeForValue([0], FLOAT, 'test-program'), FLOAT_1D_UNIFORM);
				assert.equal(uniformInternalTypeForValue([0, 1.3], FLOAT, 'test-program'), FLOAT_2D_UNIFORM);
				assert.equal(uniformInternalTypeForValue([0, -4.5, 6], FLOAT, 'test-program'), FLOAT_3D_UNIFORM);
				assert.equal(uniformInternalTypeForValue([4.6, 0, -4, 60000], FLOAT, 'test-program'), FLOAT_4D_UNIFORM);

				assert.equal(uniformInternalTypeForValue(0, INT, 'test-program'), INT_1D_UNIFORM);
				assert.equal(uniformInternalTypeForValue([0], INT, 'test-program'), INT_1D_UNIFORM);
				assert.equal(uniformInternalTypeForValue([0, 1], INT, 'test-program'), INT_2D_UNIFORM);
				assert.equal(uniformInternalTypeForValue([0, 4, 6], INT, 'test-program'), INT_3D_UNIFORM);
				assert.equal(uniformInternalTypeForValue([4, 0, -4, 60000], INT, 'test-program'), INT_4D_UNIFORM);

				assert.equal(uniformInternalTypeForValue(0, UINT, 'test-program'), UINT_1D_UNIFORM);
				assert.equal(uniformInternalTypeForValue([0], UINT, 'test-program'), UINT_1D_UNIFORM);
				assert.equal(uniformInternalTypeForValue([0, 1], UINT, 'test-program'), UINT_2D_UNIFORM);
				assert.equal(uniformInternalTypeForValue([0, 4, 6], UINT, 'test-program'), UINT_3D_UNIFORM);
				assert.equal(uniformInternalTypeForValue([4, 0, 40, 60000], UINT, 'test-program'), UINT_4D_UNIFORM);

				// Passing bools as ints.
				assert.equal(uniformInternalTypeForValue(true, BOOL, 'test-program'), INT_1D_UNIFORM);
				assert.equal(uniformInternalTypeForValue(false, BOOL, 'test-program'), INT_1D_UNIFORM);
			});
		});
	});
}