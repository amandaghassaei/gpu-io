import { isString } from './Checks';
import {
	CompileTimeVars,
	ErrorCallback,
	GLSL1,
	GLSL3,
	GLSLPrecision,
	GLSLVersion,
	PRECISION_HIGH_P,
	PRECISION_MEDIUM_P,
} from './Constants';
const precisionSource = require('./glsl/common/precision.glsl');

function intForPrecision(precision: GLSLPrecision) {
	if (precision === PRECISION_HIGH_P) return 2;
	if (precision === PRECISION_MEDIUM_P) return 1;
	return 0;
}

function convertDefinesToString(defines: CompileTimeVars) {
	let definesSource = '';
	const keys = Object.keys(defines);
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		// Check that define is passed in as a string.
		if (!isString(key) || !isString(defines[key])) {
			throw new Error(`GPUProgram defines must be passed in as key value pairs that are both strings, got key value pair of type [${typeof key} : ${typeof defines[key]}].`)
		}
		definesSource += `#define ${key} ${defines[key]}\n`;
	}
	return definesSource;
}

export function makeShaderHeader(
	glslVersion: GLSLVersion,
	intPrecision: GLSLPrecision,
	floatPrecision: GLSLPrecision,
	defines?: CompileTimeVars,
) {
	const versionSource = glslVersion === GLSL3 ? `#version ${GLSL3}\n` : '';
	const definesSource = defines ? convertDefinesToString(defines) : '';
	const precisionDefinesSource = convertDefinesToString({
		WEBGLCOMPUTE_INT_PRECISION: `${intForPrecision(intPrecision)}`,
		WEBGLCOMPUTE_FLOAT_PRECISION: `${intForPrecision(floatPrecision)}`,
	});
	return `${versionSource}${definesSource}${precisionDefinesSource}${precisionSource}\n`;
}

// Copied from http://webglfundamentals.org/webgl/lessons/webgl-boilerplate.html
export function compileShader(
	gl: WebGLRenderingContext | WebGL2RenderingContext,
	glslVersion: GLSLVersion,
	intPrecision: GLSLPrecision,
	floatPrecision: GLSLPrecision,
	shaderSource: string,
	shaderType: number,
	programName: string,
	_errorCallback: ErrorCallback,
	defines?: CompileTimeVars,
) {
	shaderSource = `${makeShaderHeader(
		glslVersion,
		intPrecision,
		floatPrecision,
		defines,
	)}${shaderSource}`;
	// Create the shader object
	const shader = gl.createShader(shaderType);
	if (!shader) {
		_errorCallback('Unable to init gl shader.');
		return null;
	}

	// Set the shader source code.
	gl.shaderSource(shader, shaderSource);

	// Compile the shader
	gl.compileShader(shader);

	// Check if it compiled
	const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if (!success) {
		// Something went wrong during compilation - print the error.
		_errorCallback(`Could not compile ${shaderType === gl.FRAGMENT_SHADER ? 'fragment' : 'vertex'}
			 shader for program "${programName}": ${gl.getShaderInfoLog(shader)}.`);
		return null;
	}
	return shader;
}

export function initGLProgram(
	gl: WebGLRenderingContext | WebGL2RenderingContext,
	fragmentShader: WebGLShader,
	vertexShader: WebGLShader,
	name: string,
	_errorCallback: ErrorCallback,
) {
	// Create a program.
	const program = gl.createProgram();
	if (!program) {
		_errorCallback(`Unable to init gl program for GPUProgram "${name}", gl.createProgram() has failed.`);
		return;
	}
	// Link the program.
	gl.attachShader(program, fragmentShader);
	gl.attachShader(program, vertexShader);
	gl.linkProgram(program);
	// Check if it linked.
	const success = gl.getProgramParameter(program, gl.LINK_STATUS);
	if (!success) {
		// Something went wrong with the link.
		_errorCallback(`GPUProgram "${name}" failed to link: ${gl.getProgramInfoLog(program)}`);
		return;
	}
	return program;
}

export function isWebGL2(gl: WebGLRenderingContext | WebGL2RenderingContext) {
	// This code is pulled from https://github.com/mrdoob/three.js/blob/master/src/renderers/webgl/WebGLCapabilities.js
	// @ts-ignore
	return (typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext) || (typeof WebGL2ComputeRenderingContext !== 'undefined' && gl instanceof WebGL2ComputeRenderingContext);
}

export function isWebGL2Supported() {
	const gl = document.createElement('canvas').getContext('webgl2');
	if (!gl) {
		return false;
	}
	// GL context and canvas will be garbage collected.
	return true;
}

// From https://webglfundamentals.org/webgl/lessons/webgl-precision-issues.html
export function getFragmentMediumpPrecision() {
	// This entire program is only needed because of a bug in Safari.
	// Safari doesn't correctly report precision from getShaderPrecisionFormat
	// at least as of April 2020
	// see: https://bugs.webkit.org/show_bug.cgi?id=211013

	const errorCallback = (msg: string) => { throw new Error(msg); };

	// Get A WebGL context
	const canvas = document.createElement("canvas");
	const gl = canvas.getContext("webgl");
	if (!gl) {
		throw new Error(`Unable to init webgl context.`);
	}

	const vs = compileShader(gl, GLSL1, PRECISION_MEDIUM_P, PRECISION_MEDIUM_P,`
attribute vec4 position;  // needed because of another bug in Safari
void main() {
	gl_Position = position;
	gl_PointSize = 1.0;
}
	`, gl.VERTEX_SHADER, 'mediumpPrecisionFragmentTest', errorCallback);
	if (!vs) {
		throw new Error(`Unable to init vertex shader.`);
	}

	const fs = compileShader(gl, GLSL1, PRECISION_MEDIUM_P, PRECISION_MEDIUM_P, `
uniform mediump vec3 v;
void main() {
	gl_FragColor = vec4(normalize(v) * 0.5 + 0.5, 1);
}
	`, gl.FRAGMENT_SHADER, 'mediumpPrecisionFragmentTest', errorCallback);
	if (!fs) {
		throw new Error(`Unable to init fragment shader.`);
	}

	const program = initGLProgram(gl, fs, vs, 'mediumpPrecisionFragmentTest', errorCallback);
	if (!program) {
		throw new Error(`Unable to init WebGLProgram.`);
	}
	const positionLocation = gl.getAttribLocation(program, 'position');
	const vLocation = gl.getUniformLocation(program, 'v');

	// create a buffer and setup an attribute
	// We wouldn't need this except for a bug in Safari.
	// See https://webglfundamentals.org/webgl/lessons/webgl-smallest-programs.html
	// and https://bugs.webkit.org/show_bug.cgi?id=197592
	const buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, 1, gl.STATIC_DRAW);
	gl.enableVertexAttribArray(positionLocation);
	gl.vertexAttribPointer(
		positionLocation,
		1,                // pull 1 value per vertex shader iteration from buffer
		gl.UNSIGNED_BYTE, // type of data in buffer,
		false,            // don't normalize
		0,                // bytes to advance per iteration (0 = compute from size and type)
		0,                // offset into buffer
	);

	gl.viewport(0, 0, 1, 1);
	gl.useProgram(program);

	// we're going to compute the normalize vector of
	// (sqrt(2^31-1), sqrt(2^31-1), sqrt(2^31-1))
	// which should be impossible on mediump
	const value = 2 ** 31 - 1;
	const input = Math.sqrt(value);
	const expected = ((input / Math.sqrt(input * input * 3)) * 0.5 + 0.5) * 255 | 0;

	gl.uniform3f(vLocation, input, input, input);
	gl.drawArrays(
		gl.POINTS,
		0, // offset
		1, // number of vertices to process
	);

	const pixel = new Uint8Array(4);
	gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);

	// Deallocate everything.
	gl.deleteProgram(program);
	gl.deleteShader(vs);
	gl.deleteShader(fs);
	gl.deleteBuffer(buffer);
	// GL context and canvas will be garbage collected.

	const mediumpPrecision = Math.abs(pixel[0] - expected) > 16;
	return mediumpPrecision ? PRECISION_MEDIUM_P : PRECISION_HIGH_P;
}

// From https://webglfundamentals.org/webgl/lessons/webgl-precision-issues.html
export function getVertexMediumpPrecision() {
	// This entire program is only needed because of a bug in Safari.
	// Safari doesn't correctly report precision from getShaderPrecisionFormat
	// at least as of April 2020
	// see: https://bugs.webkit.org/show_bug.cgi?id=211013

	const errorCallback = (msg: string) => { throw new Error(msg); };

	// Get A WebGL context
	/** @type {HTMLCanvasElement} */
	const canvas = document.createElement("canvas");
	const gl = canvas.getContext("webgl");
	if (!gl) {
		throw new Error(`Unable to init webgl context.`);
	}

	const vs = compileShader(gl, GLSL1, PRECISION_MEDIUM_P, PRECISION_MEDIUM_P, `
attribute vec4 position;  // needed because of another bug in Safari
uniform mediump vec3 v;
varying mediump vec4 v_result;
void main() {
	gl_Position = position;
	gl_PointSize = 1.0;
	v_result = vec4(normalize(v) * 0.5 + 0.5, 1);
}
	`, gl.VERTEX_SHADER, 'mediumpPrecisionVertexTest', errorCallback);
	if (!vs) {
		throw new Error(`Unable to init vertex shader.`);
	}

	const fs = compileShader(gl, GLSL1, PRECISION_MEDIUM_P, PRECISION_MEDIUM_P, `
varying mediump vec4 v_result;
void main() {
	gl_FragColor = v_result;
}
	`, gl.FRAGMENT_SHADER, 'mediumpPrecisionVertexTest', errorCallback);
	if (!fs) {
		throw new Error(`Unable to init fragment shader.`);
	}

	const program = initGLProgram(gl, fs, vs, 'mediumpPrecisionVertexTest', errorCallback);
	if (!program) {
		throw new Error(`Unable to init WebGLProgram.`);
	}
	const positionLocation = gl.getAttribLocation(program, 'position');
	const vLocation = gl.getUniformLocation(program, 'v');

	// create a buffer and setup an attribute
	// We wouldn't need this except for a bug in Safari.
	// See https://webglfundamentals.org/webgl/lessons/webgl-smallest-programs.html
	// and https://bugs.webkit.org/show_bug.cgi?id=197592
	{
		gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
		gl.bufferData(gl.ARRAY_BUFFER, 1, gl.STATIC_DRAW);
		gl.enableVertexAttribArray(positionLocation);
		gl.vertexAttribPointer(
		positionLocation,
		1,                // pull 1 value per vertex shader iteration from buffer
		gl.UNSIGNED_BYTE, // type of data in buffer,
		false,            // don't normalize
		0,                // bytes to advance per iteration (0 = compute from size and type)
		0,                // offset into buffer
		);
	}

	gl.viewport(0, 0, 1, 1);
	gl.useProgram(program);

	// we're going to compute the normalize vector of
	// (sqrt(2^31-1), sqrt(2^31-1), sqrt(2^31-1))
	// which should be impossible on mediump
	const value = 2 ** 31 - 1;
	const input = Math.sqrt(value);
	const expected = ((input / Math.sqrt(input * input * 3)) * 0.5 + 0.5) * 255 | 0;

	gl.uniform3f(vLocation, input, input, input);
	gl.drawArrays(
		gl.POINTS,
		0, // offset
		1, // number of vertices to process
	);

	const pixel = new Uint8Array(4);
	gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);

	const mediumpPrecision = Math.abs(pixel[0] - expected) > 16;
	return mediumpPrecision ? PRECISION_MEDIUM_P : PRECISION_HIGH_P;
}

export function isPowerOf2(value: number) {
	// Use bitwise operation to evaluate this.
	return value > 0 && (value & (value - 1)) == 0;
}

export function initSequentialFloatArray(length: number) {
	const array = new Float32Array(length);
	for (let i = 0; i < length; i++) {
		array[i] = i;
	}
	return array;
}

function preprocessShader(shaderSource: string) {
	// Strip out any version numbers.
	// https://github.com/Jam3/glsl-version-regex
	let origSrc = shaderSource.slice();
	shaderSource = shaderSource.replace(/^\s*\#version\s+([0-9]+(\s+[a-zA-Z]+)?)\s*/, '');
	if (shaderSource !== origSrc) {
		console.warn('WebGLCompute expects shader source that does not contain #version definitions, removing...');
	}
	// Strip out any precision declarations.
	origSrc = shaderSource.slice();
	shaderSource = shaderSource.replace(/\s*precision\s+[(highp)(mediump)(lowp)]+\s+[a-zA-Z0-9]+\s*;/g, '');
	if (shaderSource !== origSrc) {
		console.warn('WebGLCompute expects shader source that does not contain precision declarations, removing...');
	}
	return shaderSource;
}

function convertFragShaderToGLSL1(shaderSource: string) {
	// Convert in to varying.
	shaderSource = shaderSource.replace(/^\s*in\s+/g, 'varying '); // Beginning of line.
	shaderSource = shaderSource.replace(/;\s*in\s+/g, ';\nvarying '); // After semicolon (may not be linebreak).
	// Convert out to gl_FragColor.
	shaderSource = shaderSource.replace(/out \w+ out_fragOut;/g, '');
	shaderSource = shaderSource.replace(/out_fragOut\s+=/, 'gl_FragColor =');
	return shaderSource;
}

function convertVertShaderToGLSL1(shaderSource: string) {
	// Convert in to attribute.
	shaderSource = shaderSource.replace(/^\s*in\s+/, 'attribute '); // Beginning of line.
	shaderSource = shaderSource.replace(/;\s*in\s+/g, ';attribute '); // After semicolon (may not be linebreak).
	// Convert out to varying.
	shaderSource = shaderSource.replace(/^\s*out\s+/g, 'varying '); // Beginning of line.
	shaderSource = shaderSource.replace(/;\s*out\s+/g, ';\nvarying '); // After semicolon (may not be linebreak).
	return shaderSource;
}

export function preprocessFragShader(shaderSource: string, glslVersion: GLSLVersion) {
	shaderSource = preprocessShader(shaderSource);
	if (glslVersion === GLSL3) {
		return shaderSource;
	}
	return convertFragShaderToGLSL1(shaderSource);
}

export function preprocessVertShader(shaderSource: string, glslVersion: GLSLVersion) {
	shaderSource = preprocessShader(shaderSource);
	if (glslVersion === GLSL3) {
		return shaderSource;
	}
	return convertVertShaderToGLSL1(shaderSource);
}