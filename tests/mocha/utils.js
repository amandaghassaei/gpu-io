global.self = global.window; // Weird fix to get WebGLcompute import to work.
const {
	_testing,
	GLSL1,
	GLSL3,
	PRECISION_HIGH_P,
	PRECISION_MEDIUM_P,
	getVertexMediumpPrecision,
	getFragmentMediumpPrecision
} = require('../../');
const {
	makeShaderHeader,
	isPowerOf2,
	initSequentialFloatArray,
	preprocessVertShader,
	preprocessFragShader,
} = _testing;
const fs = require('fs');
const defaultVertexShader = fs.readFileSync('./src/glsl/vert/DefaultVertShader.glsl', 'utf-8');
const copyFragmentShader = fs.readFileSync('./src/glsl/frag/CopyFragShader.glsl', 'utf-8');
const assert = require('assert');

describe('utils', function () {
	describe('makeShaderHeader', () => {
		it('should create a valid shader header', () => {
			// TODO: finish tests.
		});
	}),
	// TODO: can't get webgl context for testing.
	// jsdom({
	// 	url: 'https://example.org/',
	// });
	// describe('compileShader', () => {
	// }),
	// describe('initGLProgram', () => {
	// }),
	// describe('isWebGL2', () => {
	// }),
	// describe('isWebGL2Supported', () => {
	// }),
	// describe('isHighpSupportedInVertexShader', () => {
	// }),
	// describe('isHighpSupportedInFragmentShader', () => {
	// }),
	// describe('getVertexMediumpPrecision', () => {
	// 	it('should return valid response', () => {
	// 		assert.equal([PRECISION_HIGH_P, PRECISION_MEDIUM_P].indexOf(getVertexMediumpPrecision() > -1), true);
	// 	});
	// }),
	// describe('getFragmentMediumpPrecision', () => {
	// 	it('should return valid response', () => {
	// 		assert.equal([PRECISION_HIGH_P, PRECISION_MEDIUM_P].indexOf(getFragmentMediumpPrecision() > -1), true);
	// 	});
	// }),
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
	}),
	describe('initSequentialFloatArray', () => {
		it('should init sequential Float32 array', () => {
			assert.equal(initSequentialFloatArray(0).toString(), '');
			assert.equal(initSequentialFloatArray(1).toString(), Float32Array.from([0]).toString());
			assert.equal(initSequentialFloatArray(2).toString(), Float32Array.from([0, 1]).toString());
			assert.equal(initSequentialFloatArray(12).toString(), Float32Array.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]).toString());
		});
	}),
	describe('preprocessVertShader', () => {
		it('should remove #version declarations', () => {
			assert.equal(preprocessVertShader('#version 300 es', GLSL1), '');
			assert.equal(preprocessVertShader('#version 300 es', GLSL3), '');
			assert.equal(preprocessVertShader('#version 100', GLSL1), '');
			assert.equal(preprocessVertShader('#version 100', GLSL3), '');
		});
		it('should remove precision declarations', () => {
			assert.equal(preprocessVertShader('precision highp float; precision mediump int;', GLSL1), '');
			assert.equal(preprocessVertShader('precision highp float; precision mediump int;', GLSL3), '');
			assert.equal(preprocessVertShader('precision mediump float; precision lowp int;', GLSL1), '');
			assert.equal(preprocessVertShader('precision mediump float; precision lowp int;', GLSL3), '');
			assert.equal(preprocessVertShader('precision highp sampler2D; precision mediump usampler2D; precision lowp isampler2D;', GLSL1), '');
		});
		it('should pass valid glsl3 shaders through', () => {
			assert.equal(preprocessVertShader(defaultVertexShader, GLSL3), defaultVertexShader);
		});
		it('should convert glsl3 shader to glsl1', () => {
			assert.equal(preprocessVertShader(defaultVertexShader, GLSL1), `attribute vec2 a_internal_position;
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
		});
	});
	describe('preprocessFragShader', () => {
		it('should remove #version declarations', () => {
			assert.equal(preprocessFragShader('#version 300 es', GLSL1), '');
			assert.equal(preprocessFragShader('#version 300 es', GLSL3), '');
			assert.equal(preprocessFragShader('#version 100', GLSL1), '');
			assert.equal(preprocessFragShader('#version 100', GLSL3), '');
		});
		it('should remove precision declarations', () => {
			assert.equal(preprocessFragShader('precision highp float; precision mediump int;', GLSL1), '');
			assert.equal(preprocessFragShader('precision highp float; precision mediump int;', GLSL3), '');
			assert.equal(preprocessFragShader('precision mediump float; precision lowp int;', GLSL1), '');
			assert.equal(preprocessFragShader('precision mediump float; precision lowp int;', GLSL3), '');
			assert.equal(preprocessFragShader('precision highp sampler2D; precision mediump usampler2D; precision lowp isampler2D;', GLSL1), '');
		});
		it('should pass valid glsl3 shaders through', () => {
			assert.equal(preprocessFragShader(copyFragmentShader, GLSL3), copyFragmentShader);
		});
		it('should convert glsl3 shader to glsl1', () => {
			assert.equal(preprocessFragShader(copyFragmentShader, GLSL1), `varying vec2 v_UV;

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
	gl_FragColor = texture(u_state, v_UV);
}`);
		});
	});
});