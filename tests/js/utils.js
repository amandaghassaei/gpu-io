global.self = global.window; // Weird fix to get WebGLcompute import to work.
const {
	GLSL1,
	GLSL3,
	PRECISION_HIGH_P,
	PRECISION_MEDIUM_P,
	_testing,
} = require('../../dist/webgl-compute');
const {
	makeShaderHeader,
	isPowerOf2,
	initSequentialFloatArray,
} = _testing;
const assert = require('assert');

// Testing components of utils that DO NOT require WebGL with mocha + chai.

describe('utils', function () {
	describe('makeShaderHeader', () => {
		it('should create a valid shader header', () => {
			assert.equal(makeShaderHeader(
				GLSL3,
				PRECISION_HIGH_P,
				PRECISION_MEDIUM_P,
				{ test1: '1' }), `#version 300 es
#define test1 1
#define WEBGLCOMPUTE_INT_PRECISION 2
#define WEBGLCOMPUTE_FLOAT_PRECISION 1
#if (WEBGLCOMPUTE_INT_PRECISION == 2)
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp int;
#else
precision mediump int;
#endif
#endif
#if (WEBGLCOMPUTE_INT_PRECISION == 1)
precision mediump int;
#endif
#if (WEBGLCOMPUTE_INT_PRECISION == 0)
precision lowp int;
#endif
#if (WEBGLCOMPUTE_FLOAT_PRECISION == 2)
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
#endif
#if (WEBGLCOMPUTE_FLOAT_PRECISION == 1)
precision mediump float;
#endif
#if (WEBGLCOMPUTE_FLOAT_PRECISION == 0)
precision lowp float;
#endif
precision lowp sampler2D;
#if (__VERSION__ == 300)
precision lowp isampler2D;precision lowp usampler2D;
#endif
`);
			assert.equal(makeShaderHeader(
				GLSL1,
				PRECISION_HIGH_P,
				PRECISION_MEDIUM_P,
				{ test1: '1' }), `#define test1 1
#define WEBGLCOMPUTE_INT_PRECISION 2
#define WEBGLCOMPUTE_FLOAT_PRECISION 1
#if (WEBGLCOMPUTE_INT_PRECISION == 2)
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp int;
#else
precision mediump int;
#endif
#endif
#if (WEBGLCOMPUTE_INT_PRECISION == 1)
precision mediump int;
#endif
#if (WEBGLCOMPUTE_INT_PRECISION == 0)
precision lowp int;
#endif
#if (WEBGLCOMPUTE_FLOAT_PRECISION == 2)
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
#endif
#if (WEBGLCOMPUTE_FLOAT_PRECISION == 1)
precision mediump float;
#endif
#if (WEBGLCOMPUTE_FLOAT_PRECISION == 0)
precision lowp float;
#endif
precision lowp sampler2D;
#if (__VERSION__ == 300)
precision lowp isampler2D;precision lowp usampler2D;
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
});