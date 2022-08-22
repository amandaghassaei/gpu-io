{
	global.self = global.window; // Weird fix to get WebGLcompute import to work.
	const {
		GLSL1,
		GLSL3,
		FLOAT,
		INT,
		BOOL,
		PRECISION_HIGH_P,
		PRECISION_MEDIUM_P,
		_testing,
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
		UINT,
	} = require('../../dist/webgl-compute');
	const {
		makeShaderHeader,
		isPowerOf2,
		initSequentialFloatArray,
		uniformInternalTypeForValue,
	} = _testing;
	const assert = require('assert');// TODO: use chai

	// Testing components of utils that DO NOT require WebGL with mocha + chai.

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
		describe('uniformInternalTypeForValue', () => {
			it('should throw error if value is wrong type', () => {
				assert.throws(() => { uniformInternalTypeForValue('test', FLOAT, 'u_myUniform', 'test-program'); },
					new Error('Invalid value "test" for uniform "u_myUniform" in program "test-program", expected float or float[] of length 1-4.'));
				assert.throws(() => { uniformInternalTypeForValue([2, 4, 6, 7, 8], FLOAT, 'u_myUniform', 'test-program'); },
					new Error('Invalid value [2,4,6,7,8] for uniform "u_myUniform" in program "test-program", expected float or float[] of length 1-4.'));
				assert.throws(() => { uniformInternalTypeForValue([2, 4, {}, 7], FLOAT, 'u_myUniform', 'test-program'); },
					new Error('Invalid value [2,4,{},7] for uniform "u_myUniform" in program "test-program", expected float or float[] of length 1-4.'));

				assert.throws(() => { uniformInternalTypeForValue('test', INT, 'u_myUniform', 'test-program'); },
					new Error('Invalid value "test" for uniform "u_myUniform" in program "test-program", expected int or int[] of length 1-4.'));
				assert.throws(() => { uniformInternalTypeForValue(4.5, INT, 'u_myUniform', 'test-program'); },
					new Error('Invalid value 4.5 for uniform "u_myUniform" in program "test-program", expected int or int[] of length 1-4.'));
				assert.throws(() => { uniformInternalTypeForValue([2, 4, 6, 7, 8], INT, 'u_myUniform', 'test-program'); },
					new Error('Invalid value [2,4,6,7,8] for uniform "u_myUniform" in program "test-program", expected int or int[] of length 1-4.'));
				assert.throws(() => { uniformInternalTypeForValue([2.4, 5.5], INT, 'u_myUniform', 'test-program'); },
					new Error('Invalid value [2.4,5.5] for uniform "u_myUniform" in program "test-program", expected int or int[] of length 1-4.'));

					assert.throws(() => { uniformInternalTypeForValue('test', UINT, 'u_myUniform', 'test-program'); },
					new Error('Invalid value "test" for uniform "u_myUniform" in program "test-program", expected uint or uint[] of length 1-4.'));
				assert.throws(() => { uniformInternalTypeForValue(4.5, UINT, 'u_myUniform', 'test-program'); },
					new Error('Invalid value 4.5 for uniform "u_myUniform" in program "test-program", expected uint or uint[] of length 1-4.'));
				assert.throws(() => { uniformInternalTypeForValue([2, 4, 6, 7, 8], UINT, 'u_myUniform', 'test-program'); },
					new Error('Invalid value [2,4,6,7,8] for uniform "u_myUniform" in program "test-program", expected uint or uint[] of length 1-4.'));
				assert.throws(() => { uniformInternalTypeForValue([2.4, 5.5], UINT, 'u_myUniform', 'test-program'); },
					new Error('Invalid value [2.4,5.5] for uniform "u_myUniform" in program "test-program", expected uint or uint[] of length 1-4.'));
				assert.throws(() => { uniformInternalTypeForValue([2, 4, -6, 8], UINT, 'u_myUniform', 'test-program'); },
					new Error('Invalid value [2,4,-6,8] for uniform "u_myUniform" in program "test-program", expected uint or uint[] of length 1-4.'));

				assert.throws(() => { uniformInternalTypeForValue('test', BOOL, 'u_myUniform', 'test-program'); },
					new Error('Invalid value "test" for uniform "u_myUniform" in program "test-program", expected boolean.'));
				assert.throws(() => { uniformInternalTypeForValue(3, BOOL, 'u_myUniform', 'test-program'); },
					new Error('Invalid value 3 for uniform "u_myUniform" in program "test-program", expected boolean.'));
				assert.throws(() => { uniformInternalTypeForValue(1, BOOL, 'u_myUniform', 'test-program'); },
					new Error('Invalid value 1 for uniform "u_myUniform" in program "test-program", expected boolean.'));
				assert.throws(() => { uniformInternalTypeForValue(0, BOOL, 'u_myUniform', 'test-program'); },
					new Error('Invalid value 0 for uniform "u_myUniform" in program "test-program", expected boolean.'));
				assert.throws(() => { uniformInternalTypeForValue([true, false], BOOL, 'u_myUniform', 'test-program'); },
					new Error('Invalid value [true,false] for uniform "u_myUniform" in program "test-program", expected boolean.'));
			});
			it('should throw error if type is invalid', () => {
				assert.throws(() => { uniformInternalTypeForValue(0, 'THING', 'u_myUniform', 'test-program'); },
					new Error('Invalid type "THING" for uniform "u_myUniform" in program "test-program", expected FLOAT or INT of BOOL.'));
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