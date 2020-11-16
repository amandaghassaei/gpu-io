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
			 shader${programName ? ` for program ${programName}` : ''}: ${gl.getShaderInfoLog(shader)}.`);
		return null;
	}
	return shader;
}

export function isWebGL2(gl: WebGLRenderingContext | WebGL2RenderingContext) {
	// TODO: I'm sure there is a better way to check this.
	return !!(gl as WebGL2RenderingContext).HALF_FLOAT;
}