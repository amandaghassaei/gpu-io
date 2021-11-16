// Copied from http://webglfundamentals.org/webgl/lessons/webgl-boilerplate.html
export function compileShader(
	gl: WebGLRenderingContext | WebGL2RenderingContext,
	errorCallback: (message: string) => void,
	shaderSource: string,
	shaderType: number,
	programName?: string,
) {
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

export function isWebGL2(gl: WebGLRenderingContext | WebGL2RenderingContext) {
	// This code is pulled from https://github.com/mrdoob/three.js/blob/master/src/renderers/webgl/WebGLCapabilities.js
	// @ts-ignore
	return (typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext) || (typeof WebGL2ComputeRenderingContext !== 'undefined' && gl instanceof WebGL2ComputeRenderingContext);
	// return !!(gl as WebGL2RenderingContext).HALF_FLOAT;
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
