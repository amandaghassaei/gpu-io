import {
	isArray,
	isBoolean,
	isInteger,
	isNonNegativeInteger,
	isNumber,
	isString,
} from './checks';
import {
	BOOL,
	BOOL_1D_UNIFORM,
	BOOL_2D_UNIFORM,
	BOOL_3D_UNIFORM,
	BOOL_4D_UNIFORM,
	BYTE,
	CompileTimeVars,
	DEFAULT_ERROR_CALLBACK,
	ErrorCallback,
	FLOAT,
	FLOAT_1D_UNIFORM,
	FLOAT_2D_UNIFORM,
	FLOAT_3D_UNIFORM,
	FLOAT_4D_UNIFORM,
	GLSL1,
	GLSL3,
	GLSLPrecision,
	GLSLVersion,
	GPULayerType,
	HALF_FLOAT,
	INT,
	INT_1D_UNIFORM,
	INT_2D_UNIFORM,
	INT_3D_UNIFORM,
	INT_4D_UNIFORM,
	PRECISION_HIGH_P,
	PRECISION_LOW_P,
	PRECISION_MEDIUM_P,
	SHORT,
	UINT,
	UINT_1D_UNIFORM,
	UINT_2D_UNIFORM,
	UINT_3D_UNIFORM,
	UINT_4D_UNIFORM,
	UniformType,
	UniformValue,
	UNSIGNED_BYTE,
	UNSIGNED_INT,
	UNSIGNED_SHORT,
	WEBGL1,
	WEBGL2,
} from './constants';
import { texturePolyfill } from './polyfills';
import {
	checkFragmentShaderForFragColor,
	glsl1FragmentIn,
	glsl1FragmentOut,
	glsl1Sampler2D,
	glsl1Texture,
	glsl1Uint,
	glsl1VertexIn,
	glsl1VertexOut,
	highpToMediump,
	stripComments,
	stripPrecision,
	stripVersion,
} from './regex';
const precisionSource = require('./glsl/common/precision.glsl');

/**
 * Memoize results of more complex WebGL tests (that require allocations/deallocations).
 * @private
 */
const results = {
	supportsWebGL2: undefined as undefined | boolean,
	supportsHighpVertex: undefined as  undefined | boolean,
	supportsHighpFragment: undefined as undefined | boolean,
	mediumpVertexPrecision: undefined as undefined | typeof PRECISION_HIGH_P | typeof PRECISION_MEDIUM_P,
	mediumpFragmentPrecision: undefined as undefined | typeof PRECISION_HIGH_P | typeof PRECISION_MEDIUM_P,
}

/**
 * Test whether a GPULayer type is a float type.
 * @private
 */
export function isFloatType(type: GPULayerType) {
	return type === FLOAT || type === HALF_FLOAT;
}

/**
 * Test whether a GPULayer type is an unsigned int type.
 * @private
 */
 export function isUnsignedIntType(type: GPULayerType) {
	return type === UNSIGNED_BYTE || type === UNSIGNED_SHORT || type === UNSIGNED_INT;
}

/**
 * Test whether a GPULayer type is a signed int type.
 * @private
 */
 export function isSignedIntType(type: GPULayerType) {
	return type === BYTE || type === SHORT || type === INT;
}

/**
 * Test whether a GPULayer type is a int type.
 * @private
 */
 export function isIntType(type: GPULayerType) {
	return isUnsignedIntType(type) || isSignedIntType(type);
}

/**
 * Enum for precision values.
 * See src/glsl/common/precision.glsl for more info.
 * @private
 */
function intForPrecision(precision: GLSLPrecision) {
	if (precision === PRECISION_HIGH_P) return 2;
	if (precision === PRECISION_MEDIUM_P) return 1;
	if (precision === PRECISION_LOW_P) return 0;
	throw new Error(`Unknown shader precision value: ${JSON.stringify(precision)}.`);
}

/**
 * Create a string to pass defines into shader.
 * @private
 */
function convertDefinesToString(defines: CompileTimeVars) {
	let definesSource = '';
	const keys = Object.keys(defines);
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		// Check that define is passed in as a string.
		if (!isString(key) || !isString(defines[key])) {
			throw new Error(`GPUProgram defines must be passed in as key value pairs that are both strings, got key value pair of type [${typeof key} : ${typeof defines[key]}] for key ${key}.`)
		}
		definesSource += `#define ${key} ${defines[key]}\n`;
	}
	return definesSource;
}

/**
 * Create header string for fragment and vertex shaders.
 * Export this for testing purposes.
 * @private
 */
export function makeShaderHeader(
	glslVersion: GLSLVersion,
	intPrecision: GLSLPrecision,
	floatPrecision: GLSLPrecision,
	defines?: CompileTimeVars,
) {
	const versionSource = glslVersion === GLSL3 ? `#version ${GLSL3}\n` : '';
	const definesSource = defines ? convertDefinesToString(defines) : '';
	const precisionDefinesSource = convertDefinesToString({
		GPUIO_INT_PRECISION: `${intForPrecision(intPrecision)}`,
		GPUIO_FLOAT_PRECISION: `${intForPrecision(floatPrecision)}`,
	});
	return `${versionSource}${definesSource}${precisionDefinesSource}${precisionSource}`;
}

/**
 * Compile vertex or fragment shaders.
 * Fragment shaders may be compiled on the fly, so keep this efficient.
 * Copied from http://webglfundamentals.org/webgl/lessons/webgl-boilerplate.html
 * @private
 */
export function compileShader(
	gl: WebGLRenderingContext | WebGL2RenderingContext,
	glslVersion: GLSLVersion,
	intPrecision: GLSLPrecision,
	floatPrecision: GLSLPrecision,
	shaderSource: string,
	shaderType: number,
	programName: string,
	errorCallback: ErrorCallback,
	defines?: CompileTimeVars,
) {
	// Create the shader object
	const shader = gl.createShader(shaderType);
	if (!shader) {
		errorCallback('Unable to init gl shader.');
		return null;
	}

	// Set the shader source code.
	const shaderHeader = makeShaderHeader(
		glslVersion,
		intPrecision,
		floatPrecision,
		defines,
	);
	const fullShaderSource = `${shaderHeader}${shaderSource}`;
	gl.shaderSource(shader, fullShaderSource);

	// Compile the shader
	gl.compileShader(shader);

	// TODO: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices#dont_check_shader_compile_status_unless_linking_fails
	// Check if it compiled.
	const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if (!success) {
		// Something went wrong during compilation - print shader source (with line number) and the error.
		console.log(fullShaderSource.split('\n').map((line, i) => `${i}\t${line}`).join('\n'));
		errorCallback(`Could not compile ${shaderType === gl.FRAGMENT_SHADER ? 'fragment' : 'vertex'} shader for program "${programName}": ${gl.getShaderInfoLog(shader)}.`);
		return null;
	}
	return shader;
}

/**
 * Init a WebGL program from vertex and fragment shaders.
 * GLPrograms may be inited on the fly, so keep this efficient.
 * @private
 */
export function initGLProgram(
	gl: WebGLRenderingContext | WebGL2RenderingContext,
	vertexShader: WebGLShader,
	fragmentShader: WebGLShader,
	name: string,
	errorCallback: ErrorCallback,
) {
	// Create a program.
	const program = gl.createProgram();
	if (!program) {
		errorCallback(`Unable to init GL program for GPUProgram "${name}", gl.createProgram() has failed.`);
		return;
	}
	// Link the program.
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	// Check if it linked.
	const success = gl.getProgramParameter(program, gl.LINK_STATUS);
	if (!success) {
		// Something went wrong with the link.
		errorCallback(`GPUProgram "${name}" failed to link: ${gl.getProgramInfoLog(program)}`);
		return;
	}
	return program;
}

/**
 * Returns whether a WebGL context is WebGL2.
 * This code is pulled from https://github.com/mrdoob/three.js/blob/master/src/renderers/webgl/WebGLCapabilities.js
 * @param gl - WebGL context to test.
 * @returns - true if WebGL2 context, else false.
 */
export function isWebGL2(gl: WebGLRenderingContext | WebGL2RenderingContext) {
	// @ts-ignore
	return (typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext) || (typeof WebGL2ComputeRenderingContext !== 'undefined' && gl instanceof WebGL2ComputeRenderingContext);
}

/**
 * Returns whether WebGL2 is supported by the current browser.
 * @returns - true if WebGL2 is supported, else false.
*/
export function isWebGL2Supported() {
	if (results.supportsWebGL2 === undefined) {
		const gl = document.createElement('canvas').getContext(WEBGL2);
		// GL context and canvas will be garbage collected.
		results.supportsWebGL2 = isWebGL2(gl!); // Will return false in case of gl = null.
	}
	return results.supportsWebGL2;
}

/**
 * Checks if the framebuffer is ready to read.
 * @private
 */
export function readyToRead(gl: WebGLRenderingContext | WebGL2RenderingContext) {
	return gl.checkFramebufferStatus(gl.FRAMEBUFFER) == gl.FRAMEBUFFER_COMPLETE;
};

/**
 * Detects whether highp is supported by this browser.
 * This is supposed to be relatively easy. You call gl.getShaderPrecisionFormat, you pass in the shader type,
 * VERTEX_SHADER or FRAGMENT_SHADER and you pass in one of LOW_FLOAT, MEDIUM_FLOAT, HIGH_FLOAT, LOW_INT, MEDIUM_INT, HIGH_INT,
 * and it returns the precision info.
 * Unfortunately Safari has a bug here which means checking this way will fail on iPhone, at least as of April 2020.
 * https://webglfundamentals.org/webgl/webgl-precision-lowp-mediump-highp.html
 * @private
 */
function isHighpSupported(vsSource: string, fsSource: string) {
	const gl = document.createElement('canvas').getContext(WEBGL1);
	if (!gl) {
		throw new Error(`Unable to init webgl context.`);
	}
	try {
		const vs = compileShader(
			gl,
			GLSL1,
			PRECISION_HIGH_P,
			PRECISION_HIGH_P,
			vsSource,
			gl.VERTEX_SHADER,
			'highpFragmentTest',
			DEFAULT_ERROR_CALLBACK,
		)!;
		const fs = compileShader(
			gl,
			GLSL1,
			PRECISION_HIGH_P,
			PRECISION_HIGH_P,
			fsSource,
			gl.FRAGMENT_SHADER,
			'highpFragmentTest',
			DEFAULT_ERROR_CALLBACK,
		)!;
		const program = initGLProgram(gl, vs, fs, 'highpFragmentTest', DEFAULT_ERROR_CALLBACK)!;
		// Deallocate everything.
		gl.deleteProgram(program);
		gl.deleteShader(vs);
		gl.deleteShader(fs);
		// GL context and canvas will be garbage collected.
	} catch {
		return false;
	}
	return true;
}

/**
 * Detects whether highp precision is supported in vertex shaders in the current browser.
 * @returns - true is highp is supported in vertex shaders, else false.
 */
export function isHighpSupportedInVertexShader() {
	if (results.supportsHighpVertex === undefined) {
		const vertexSupport = isHighpSupported(
			'void main() { highp float test = 0.524; gl_Position = vec4(test, test, 0, 1); }',
			'void main() { gl_FragColor = vec4(0); }',
		);
		results.supportsHighpVertex = vertexSupport;
	}
	return results.supportsHighpVertex;
}

/**
 * Detects whether highp precision is supported in fragment shaders in the current browser.
 * @returns - true is highp is supported in fragment shaders, else false.
 */
export function isHighpSupportedInFragmentShader() {
	if (results.supportsHighpFragment === undefined) {
		const fragmentSupport = isHighpSupported(
			'void main() { gl_Position = vec4(0.5, 0.5, 0, 1); }',
			'void main() { highp float test = 1.35; gl_FragColor = vec4(test); }',
		);
		results.supportsHighpFragment = fragmentSupport;
	}
	return results.supportsHighpFragment;
}

/**
 * Helper function to perform a 1px math calculation in order to determine WebGL capabilities.
 * From https://webglfundamentals.org/
 * @private
 */
function test1PxCalc(
	name: string,
	gl: WebGL2RenderingContext | WebGLRenderingContext,
	fs: WebGLShader,
	vs: WebGLShader,
	addUniforms: (program: WebGLProgram) => void,
) {
	const program = initGLProgram(gl, vs, fs, name, DEFAULT_ERROR_CALLBACK);
	if (!program) {
		throw new Error(`Unable to init WebGLProgram.`);
	}
	const positionLocation = gl.getAttribLocation(program, 'position');

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

	addUniforms(program);
	
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

	return pixel;
}

/**
 * Returns the actual precision of mediump inside vertex shader.
 * From https://webglfundamentals.org/webgl/lessons/webgl-precision-issues.html
 * @returns - Vertex shader mediump precision.
 */
export function getVertexShaderMediumpPrecision() {
	if (results.mediumpVertexPrecision === undefined) {
		// This entire program is only needed because of a bug in Safari.
		// Safari doesn't correctly report precision from getShaderPrecisionFormat
		// at least as of April 2020
		// see: https://bugs.webkit.org/show_bug.cgi?id=211013

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
		`, gl.VERTEX_SHADER, 'mediumpPrecisionVertexTest', DEFAULT_ERROR_CALLBACK);
		if (!vs) {
			throw new Error(`Unable to init vertex shader.`);
		}

		const fs = compileShader(gl, GLSL1, PRECISION_MEDIUM_P, PRECISION_MEDIUM_P, `
	varying mediump vec4 v_result;
	void main() {
		gl_FragColor = v_result;
	}
		`, gl.FRAGMENT_SHADER, 'mediumpPrecisionVertexTest', DEFAULT_ERROR_CALLBACK);
		if (!fs) {
			throw new Error(`Unable to init fragment shader.`);
		}

		// we're going to compute the normalize vector of
		// (sqrt(2^31-1), sqrt(2^31-1), sqrt(2^31-1))
		// which should be impossible on mediump
		const value = 2 ** 31 - 1;
		const input = Math.sqrt(value);
		const expected = ((input / Math.sqrt(input * input * 3)) * 0.5 + 0.5) * 255 | 0;

		const pixel = test1PxCalc(
			'mediumpPrecisionVertexTest',
			gl,
			fs,
			vs,
			(program: WebGLProgram) => {
				const vLocation = gl.getUniformLocation(program, 'v');
				gl.uniform3f(vLocation, input, input, input);
			},
		);

		const mediumpPrecision = Math.abs(pixel[0] - expected) > 16;
		results.mediumpVertexPrecision = mediumpPrecision ? PRECISION_MEDIUM_P : PRECISION_HIGH_P;
	}
	return results.mediumpVertexPrecision;
}

/**
 * Returns the actual precision of mediump inside fragment shader.
 * From https://webglfundamentals.org/webgl/lessons/webgl-precision-issues.html
 * @returns - Fragment shader supported mediump precision.
 */
export function getFragmentShaderMediumpPrecision() {
	if (results.mediumpFragmentPrecision === undefined) {
		// This entire program is only needed because of a bug in Safari.
		// Safari doesn't correctly report precision from getShaderPrecisionFormat
		// at least as of April 2020
		// see: https://bugs.webkit.org/show_bug.cgi?id=211013

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
		`, gl.VERTEX_SHADER, 'mediumpPrecisionFragmentTest', DEFAULT_ERROR_CALLBACK);
		if (!vs) {
			throw new Error(`Unable to init vertex shader.`);
		}

		const fs = compileShader(gl, GLSL1, PRECISION_MEDIUM_P, PRECISION_MEDIUM_P, `
	uniform mediump vec3 v;
	void main() {
		gl_FragColor = vec4(normalize(v) * 0.5 + 0.5, 1);
	}
		`, gl.FRAGMENT_SHADER, 'mediumpPrecisionFragmentTest', DEFAULT_ERROR_CALLBACK);
		if (!fs) {
			throw new Error(`Unable to init fragment shader.`);
		}

		// we're going to compute the normalize vector of
		// (sqrt(2^31-1), sqrt(2^31-1), sqrt(2^31-1))
		// which should be impossible on mediump
		const value = 2 ** 31 - 1;
		const input = Math.sqrt(value);
		const expected = ((input / Math.sqrt(input * input * 3)) * 0.5 + 0.5) * 255 | 0;

		const pixel = test1PxCalc(
			'mediumpPrecisionFragmentTest',
			gl,
			fs,
			vs,
			(program: WebGLProgram) => {
				const vLocation = gl.getUniformLocation(program, 'v');
				gl.uniform3f(vLocation, input, input, input);
			},
		);

		const mediumpPrecision = Math.abs(pixel[0] - expected) > 16;
		results.mediumpFragmentPrecision =  mediumpPrecision ? PRECISION_MEDIUM_P : PRECISION_HIGH_P;
	}
	return results.mediumpFragmentPrecision;
}

/**
 * Returns whether a number is a power of 2.
 * @private
 */
export function isPowerOf2(value: number) {
	// Use bitwise operation to evaluate this.
	return value > 0 && (value & (value - 1)) == 0;
}

/**
 * Returns a Float32 array with sequential values [0, 1, 2, 3...].
 * @private
 */
export function initSequentialFloatArray(length: number) {
	const array = new Float32Array(length);
	for (let i = 0; i < length; i++) {
		array[i] = i;
	}
	return array;
}

/**
 * Strip out any unnecessary elements in shader source, e.g. #version and precision declarations.
 * This is called once on initialization, so doesn't need to be extremely efficient.
 * @private
 */
function preprocessShader(shaderSource: string) {
	// Strip out any version numbers.
	shaderSource = stripVersion(shaderSource);
	// Strip out any precision declarations.
	shaderSource = stripPrecision(shaderSource);
	// Strip out comments.
	shaderSource = stripComments(shaderSource);
	return shaderSource;
}

/**
 * Common code for converting vertex/fragment shader source to GLSL1.
 * This is called once on initialization, so doesn't need to be extremely efficient.
 * @private
 */
function convertShaderToGLSL1(shaderSource: string) {
	// TODO: there are probably more to add here.
	// No isampler2D or usampler2D.
	shaderSource = glsl1Sampler2D(shaderSource);
	// Unsigned int types are not supported, use int types instead.
	shaderSource = glsl1Uint(shaderSource);
	// Convert texture to texture2D.
	shaderSource = glsl1Texture(shaderSource);
	return shaderSource;
}

/**
 * Convert vertex shader source to GLSL1.
 * This is called once on initialization, so doesn't need to be extremely efficient.
 * @private
 */
function convertVertexShaderToGLSL1(shaderSource: string) {
	shaderSource = convertShaderToGLSL1(shaderSource);
	// Convert in to attribute.
	shaderSource = glsl1VertexIn(shaderSource);
	// Convert out to varying.
	shaderSource = glsl1VertexOut(shaderSource);
	return shaderSource;
}

/**
 * Convert fragment shader source to GLSL1.
 * This is called once on initialization, so doesn't need to be extremely efficient.
 * @private
 */
function convertFragmentShaderToGLSL1(shaderSource: string, name: string) {
	shaderSource = convertShaderToGLSL1(shaderSource);
	// Convert in to varying.
	shaderSource = glsl1FragmentIn(shaderSource);
	// Convert out_fragColor to gl_FragColor.
	shaderSource = glsl1FragmentOut(shaderSource, name);
	return shaderSource;
}

/**
 * Preprocess vertex shader for glslVersion and browser capabilities.
 * This is called once on initialization, so doesn't need to be extremely efficient.
 * @private
 */
export function preprocessVertexShader(shaderSource: string, glslVersion: GLSLVersion) {
	shaderSource = preprocessShader(shaderSource);
	// Check if highp supported in vertex shaders.
	if (!isHighpSupportedInVertexShader()) {
		console.warn('highp not supported in vertex shader, falling back to mediump.');
		// Replace all highp with mediump.
		shaderSource = highpToMediump(shaderSource);
	}
	if (glslVersion === GLSL3) {
		return shaderSource;
	}
	return convertVertexShaderToGLSL1(shaderSource);
}



/**
 * Preprocess fragment shader for glslVersion and browser capabilities.
 * This is called once on initialization of GPUProgram, so doesn't need to be extremely efficient.
 * @private
 */
export function preprocessFragmentShader(shaderSource: string, glslVersion: GLSLVersion, name: string) {
	shaderSource = preprocessShader(shaderSource);
	checkFragmentShaderForFragColor(shaderSource, glslVersion, name);
	// Check if highp supported in fragment shaders.
	if (!isHighpSupportedInFragmentShader()) {
		console.warn('highp not supported in fragment shader, falling back to mediump.');
		// Replace all highp with mediump.
		shaderSource = highpToMediump(shaderSource);
	}
	// Add texture() polyfills if needed.
	let samplerUniforms: string[];
	({ shaderSource, samplerUniforms } = texturePolyfill(shaderSource));
	if (glslVersion !== GLSL3) {
		shaderSource = convertFragmentShaderToGLSL1(shaderSource, name);
	}
	return { shaderSource, samplerUniforms };
}

/**
 * Check uniforms and return internal WebGL type (e.g. [1234][u]?[if])
 * @private
 */
export function uniformInternalTypeForValue(
	value: UniformValue,
	type: UniformType,
	uniformName: string,
	programName: string,
) {
	if (type === FLOAT) {
		// Check that we are dealing with a number.
		if (isArray(value)) {
			for (let i = 0; i < (value as number[]).length; i++) {
				if (!isNumber((value as number[])[i])) {
					throw new Error(`Invalid value ${JSON.stringify(value)} for uniform "${uniformName}" in program "${programName}", expected float or float[] of length 1-4.`);
				}
			}
		} else {
			if (!isNumber(value)) {
				throw new Error(`Invalid value ${JSON.stringify(value)} for uniform "${uniformName}" in program "${programName}", expected float or float[] of length 1-4.`);
			}
		}
		if (!isArray(value) || (value as number[]).length === 1) {
			return FLOAT_1D_UNIFORM;
		}
		if ((value as number[]).length === 2) {
			return FLOAT_2D_UNIFORM;
		}
		if ((value as number[]).length === 3) {
			return FLOAT_3D_UNIFORM;
		}
		if ((value as number[]).length === 4) {
			return FLOAT_4D_UNIFORM;
		}
		throw new Error(`Invalid value ${JSON.stringify(value)} for uniform "${uniformName}" in program "${programName}", expected float or float[] of length 1-4.`);
	} else if (type === INT) {
		// Check that we are dealing with an int.
		if (isArray(value)) {
			for (let i = 0; i < (value as number[]).length; i++) {
				if (!isInteger((value as number[])[i])) {
					throw new Error(`Invalid value ${JSON.stringify(value)} for uniform "${uniformName}" in program "${programName}", expected int or int[] of length 1-4.`);
				}
			}
		} else {
			if (!isInteger(value)) {
				throw new Error(`Invalid value ${JSON.stringify(value)} for uniform "${uniformName}" in program "${programName}", expected int or int[] of length 1-4.`);
			}
		}
		if (!isArray(value) || (value as number[]).length === 1) {
			return INT_1D_UNIFORM;
		}
		if ((value as number[]).length === 2) {
			return INT_2D_UNIFORM;
		}
		if ((value as number[]).length === 3) {
			return INT_3D_UNIFORM;
		}
		if ((value as number[]).length === 4) {
			return INT_4D_UNIFORM;
		}
		throw new Error(`Invalid value ${JSON.stringify(value)} for uniform "${uniformName}" in program "${programName}", expected int or int[] of length 1-4.`);
	} else if (type === UINT) {
		// Check that we are dealing with a uint.
		if (isArray(value)) {
			for (let i = 0; i < (value as number[]).length; i++) {
				if (!isNonNegativeInteger((value as number[])[i])) {
					throw new Error(`Invalid value ${JSON.stringify(value)} for uniform "${uniformName}" in program "${programName}", expected uint or uint[] of length 1-4.`);
				}
			}
		} else {
			if (!isNonNegativeInteger(value)) {
				throw new Error(`Invalid value ${JSON.stringify(value)} for uniform "${uniformName}" in program "${programName}", expected uint or uint[] of length 1-4.`);
			}
		}
		if (!isArray(value) || (value as number[]).length === 1) {
			return UINT_1D_UNIFORM;
		}
		if ((value as number[]).length === 2) {
			return UINT_2D_UNIFORM;
		}
		if ((value as number[]).length === 3) {
			return UINT_3D_UNIFORM;
		}
		if ((value as number[]).length === 4) {
			return UINT_4D_UNIFORM;
		}
		throw new Error(`Invalid value ${JSON.stringify(value)} for uniform "${uniformName}" in program "${programName}", expected uint or uint[] of length 1-4.`);
	} else if (type === BOOL) {
		// Check that we are dealing with a boolean.
		if (isArray(value)) {
			for (let i = 0; i < (value as boolean[]).length; i++) {
				if (!isBoolean((value as boolean[])[i])) {
					throw new Error(`Invalid value ${JSON.stringify(value)} for uniform "${uniformName}" in program "${programName}", expected bool or bool[] of length 1-4.`);
				}
			}
		} else {
			if (!isBoolean(value)) {
				throw new Error(`Invalid value ${JSON.stringify(value)} for uniform "${uniformName}" in program "${programName}", expected bool or bool[] of length 1-4.`);
			}
		}
		if (!isArray(value) || (value as number[]).length === 1) {
			return BOOL_1D_UNIFORM;
		}
		if ((value as number[]).length === 2) {
			return BOOL_2D_UNIFORM;
		}
		if ((value as number[]).length === 3) {
			return BOOL_3D_UNIFORM;
		}
		if ((value as number[]).length === 4) {
			return BOOL_4D_UNIFORM;
		}
		throw new Error(`Invalid value ${JSON.stringify(value)} for uniform "${uniformName}" in program "${programName}", expected boolean.`);
	} else {
		throw new Error(`Invalid type "${type}" for uniform "${uniformName}" in program "${programName}", expected ${FLOAT} or ${INT} or ${BOOL}.`);
	}
}