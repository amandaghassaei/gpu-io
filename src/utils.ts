import { isString } from './Checks';
import { CompileTimeVars, GLSL1 } from './Constants';
import { WebGLCompute } from './WebGLCompute';

// Copied from http://webglfundamentals.org/webgl/lessons/webgl-boilerplate.html
export function compileShader(
	glcompute: WebGLCompute,
	shaderSource: string,
	shaderType: number,
	programName: string,
	defines?: CompileTimeVars,
) {
	const { gl, errorCallback } = glcompute;
	if (defines) {
		shaderSource = insertDefinesAfterVersionDeclaration(glcompute, shaderSource, defines);
	}
	// Create the shader object
	const shader = gl.createShader(shaderType);
	if (!shader) {
		errorCallback('Unable to init gl shader.');
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
		errorCallback(`Could not compile ${shaderType === gl.FRAGMENT_SHADER ? 'fragment' : 'vertex'}
			 shader${programName ? ` for program "${programName}"` : ''}: ${gl.getShaderInfoLog(shader)}.`);
		return null;
	}
	return shader;
}

export function insertDefinesAfterVersionDeclaration(
	glcompute: WebGLCompute,
	shaderSource: string,
	defines: CompileTimeVars) {
		const definesSource = convertDefinesToString(defines);
		if (glcompute.glslVersion === GLSL1) {
			// GLSL version 1.
			shaderSource = `${definesSource}\n${shaderSource}`
		} else {
			// GLSL version 3.
			// Defines should come after version declaration.
			shaderSource = shaderSource.replace('\n', `\n${definesSource}\n`);
		}
		return shaderSource;
}

export function isWebGL2(gl: WebGLRenderingContext | WebGL2RenderingContext) {
	// This code is pulled from https://github.com/mrdoob/three.js/blob/master/src/renderers/webgl/WebGLCapabilities.js
	// @ts-ignore
	return (typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext) || (typeof WebGL2ComputeRenderingContext !== 'undefined' && gl instanceof WebGL2ComputeRenderingContext);
	// return !!(gl as WebGL2RenderingContext).HALF_FLOAT;
}

export function isWebGL2Supported() {
	const gl = document.createElement('canvas').getContext('webgl2');
	if (!gl) {
		return false;
	}
	return true;
}

export function isPowerOf2(value: number) {
	return (value & (value - 1)) == 0;
}

export function initSequentialFloatArray(length: number) {
	const array = new Float32Array(length);
	for (let i = 0; i < length; i++) {
		array[i] = i;
	}
	return array;
}

export function inDevMode() {
	return process.env.NODE_ENV === 'development';
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