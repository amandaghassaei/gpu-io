import { isNumber, isPositiveInteger } from '@amandaghassaei/type-checks';
import { setFloat16 } from '@petamoriken/float16';
import {
	BYTE,
	CLAMP_TO_EDGE,
	FLOAT,
	GPULayerFilter,
	GPULayerType,
	GPULayerWrap,
	HALF_FLOAT,
	INT,
	NEAREST,
	SHORT,
	UNSIGNED_BYTE,
	UNSIGNED_INT,
	UNSIGNED_SHORT,
	GLSL3,
	GPULayerNumComponents,
	GLSL1,
	GPULayerArray,
	validArrayTypes,
	MIN_UNSIGNED_BYTE,
	MAX_UNSIGNED_BYTE,
	MIN_BYTE,
	MAX_BYTE,
	MIN_UNSIGNED_SHORT,
	MAX_UNSIGNED_SHORT,
	MIN_SHORT,
	MAX_SHORT,
	MIN_UNSIGNED_INT,
	MAX_UNSIGNED_INT,
	MIN_INT,
	MAX_INT,
	LINEAR,
	DEFAULT_PROGRAM_NAME,
} from './constants';
import { arrayConstructorForType } from './conversions';
import {
	EXT_COLOR_BUFFER_FLOAT,
	EXT_COLOR_BUFFER_HALF_FLOAT,
	getExtension,
	OES_TEXTURE_FLOAT,
	OES_TEXTURE_FLOAT_LINEAR,
	OES_TEXTURE_HALF_FLOAT,
	OES_TEXTURE_HAlF_FLOAT_LINEAR,
} from './extensions';
import { bindFrameBuffer } from './framebuffers';
import type { GPUComposer } from './GPUComposer';
import { GPULayer } from './GPULayer';
import {
	compileShader,
	convertFragmentShaderToGLSL1,
	initGLProgram,
	isIntType,
	isUnsignedIntType,
} from './utils';

// Memoize results.
const results = {
	writeSupport: {} as { [key: string]: boolean },
	filterWrapSupport: {} as { [key: string]: boolean },
}

/**
 * Init empty typed array for type, optionally use Float32Array for HALF_FLOAT.
 * @private
 */
GPULayer.initArrayForType = (
	type: GPULayerType,
	length: number,
	halfFloatsAsFloats = false,
) => {
	return new (arrayConstructorForType(type, halfFloatsAsFloats))(length);
}

/**
 * Calc 2D size [width, height] for GPU layer given a 1D or 2D size parameter.
 * If 1D size supplied, nearest power of 2 width/height is generated.
 * Also checks that size elements are valid.
 * @private
 */

GPULayer.calcGPULayerSize = (
	size: number | number[],
	name: string,
	verboseLogging: boolean,
) => {
	if (isNumber(size as number)) {
		if (!isPositiveInteger(size)) {
			throw new Error(`Invalid length: ${JSON.stringify(size)} for GPULayer "${name}", must be positive integer.`);
		}
		const length = size as number;
		// Relaxing adherence to power of 2.
		// // Calc power of two width and height for length.
		// let exp = 1;
		// let remainder = length;
		// while (remainder > 2) {
		// 	exp++;
		// 	remainder /= 2;
		// }
		// const width = Math.pow(2, Math.floor(exp / 2) + exp % 2);
		// const height = Math.pow(2, Math.floor(exp/2));
		const width = Math.ceil(Math.sqrt(length));
		const height = Math.ceil(length / width);
		if (verboseLogging) console.log(`Using [${width}, ${height}] for 1D array of length ${size} in GPULayer "${name}".`);
		return { width, height, length };
	}
	const width = (size as number[])[0];
	if (!isPositiveInteger(width)) {
		throw new Error(`Invalid width: ${JSON.stringify(width)} for GPULayer "${name}", must be positive integer.`);
	}
	const height = (size as number[])[1];
	if (!isPositiveInteger(height)) {
		throw new Error(`Invalid height: ${JSON.stringify(height)} for GPULayer "${name}", must be positive integer.`);
	}
	return { width, height };
}

/**
 * Get the GL wrap type to use internally in GPULayer, based on browser support.
 * @private
 */
GPULayer.getGPULayerInternalWrap = (
	params: {
		composer: GPUComposer,
		wrap: GPULayerWrap,
		internalFilter: GPULayerFilter,
		internalType: GPULayerType,
		name: string,
	},
) => {
	const { composer, wrap, internalFilter, internalType } = params;

	// CLAMP_TO_EDGE is always supported.
	if (wrap === CLAMP_TO_EDGE) {
		return wrap;
	}

	// Test if wrap/filter combo is actually supported by running some numbers through.
	if (testFilterWrap(composer, internalType, internalFilter, wrap)) {
		return wrap;
	}
	// If not, convert to CLAMP_TO_EDGE and polyfill in fragment shader.
	return CLAMP_TO_EDGE;
	// REPEAT and MIRROR_REPEAT wrap not supported for non-power of 2 textures in safari.
	// I've tested this and it seems that some power of 2 textures will work (512 x 512),
	// but not others (1024x1024), so let's just change all WebGL 1.0 to CLAMP.
	// Without this, we currently get an error at drawArrays():
	// "WebGL: drawArrays: texture bound to texture unit 0 is not renderable.
	// It maybe non-power-of-2 and have incompatible texture filtering or is not
	// 'texture complete', or it is a float/half-float type with linear filtering and
	// without the relevant float/half-float linear extension enabled."
}

/**
 * Get the GL filter type to use internally in GPULayer, based on browser support.
 * @private
 */
 GPULayer.getGPULayerInternalFilter = (
	params: {
		composer: GPUComposer,
		filter: GPULayerFilter,
		wrapX: GPULayerWrap,
		wrapY: GPULayerWrap,
		internalType: GPULayerType,
		name: string,
	},
) => {
	let { filter } = params;
	if (filter === NEAREST) {
		// NEAREST filtering is always supported.
		return filter;
	}

	const { composer, internalType, wrapX, wrapY, name } = params;

	if (internalType === HALF_FLOAT) {
		const extension = getExtension(composer, OES_TEXTURE_HAlF_FLOAT_LINEAR, true)
			|| getExtension(composer, OES_TEXTURE_FLOAT_LINEAR, true);
		if (!extension || !testFilterWrap(composer, internalType, filter, wrapX) || !testFilterWrap(composer, internalType, filter, wrapY)) {
			console.warn(`This browser does not support ${filter} filtering for type ${internalType} and wrap [${wrapX}, ${wrapY}].  Falling back to NEAREST filter for GPULayer "${name}" with ${filter} polyfill in fragment shader.`);
			filter = NEAREST; // Polyfill in fragment shader.
		}
	} if (internalType === FLOAT) {
		const extension = getExtension(composer, OES_TEXTURE_FLOAT_LINEAR, true);
		if (!extension || !testFilterWrap(composer, internalType, filter, wrapX) || !testFilterWrap(composer, internalType, filter, wrapY)) {
			console.warn(`This browser does not support ${filter} filtering for type ${internalType} and wrap [${wrapX}, ${wrapY}].  Falling back to NEAREST filter for GPULayer "${name}" with ${filter} polyfill in fragment shader.`);
			filter = NEAREST; // Polyfill in fragment shader.
		}
	}
	return filter;
}

/**
 * Returns whether to cast int type as floats, as needed by browser.
 * @private
 */
export function shouldCastIntTypeAsFloat(
	composer: GPUComposer,
	type: GPULayerType,
) {
	const { glslVersion, isWebGL2 } = composer;
	// All types are supported by WebGL2 + glsl3.
	if (glslVersion === GLSL3 && isWebGL2) return false;
	// Int textures (other than UNSIGNED_BYTE) are not supported by WebGL1.0 or glsl1.x.
	// https://stackoverflow.com/questions/55803017/how-to-select-webgl-glsl-sampler-type-from-texture-format-properties
	// Use HALF_FLOAT/FLOAT instead.
	// Some large values of INT and UNSIGNED_INT are not supported unfortunately.
	// See tests for more information.
	// Update: Even UNSIGNED_BYTE should be cast as float in GLSL1.  I noticed some strange behavior in test:
	// setUniform>'should cast/handle uint uniforms for UNSIGNED_BYTE GPULayers' in tests/mocha/GPUProgram and 
	// getValues>'should return correct values for UNSIGNED_BYTE GPULayer' in tests/mocha/GPULayer
	return type === UNSIGNED_BYTE || type === BYTE || type === SHORT || type === INT || type === UNSIGNED_SHORT || type === UNSIGNED_INT;
}

/**
 * Returns GLTexture parameters for GPULayer, based on browser support.
 * @private
 */
GPULayer.getGLTextureParameters = (
	params: {
		composer: GPUComposer,
		name: string,
		numComponents: GPULayerNumComponents,
		internalType: GPULayerType,
	}
) => {
	const { composer, name, numComponents, internalType } = params;
	const { gl, glslVersion, isWebGL2 } = composer;
	// https://www.khronos.org/registry/webgl/specs/latest/2.0/#TEXTURE_TYPES_FORMATS_FROM_DOM_ELEMENTS_TABLE
	let glType: number | undefined,
		glFormat: number | undefined,
		glInternalFormat: number | undefined,
		glNumChannels: number | undefined;

	if (isWebGL2) {
		glNumChannels = numComponents;
		// https://www.khronos.org/registry/webgl/extensions/EXT_color_buffer_float/
		// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D
		// The sized internal format RGBxxx are not color-renderable.
		// If numComponents == 3 for a writable texture, use RGBA instead.
		// Page 5 of https://www.khronos.org/files/webgl20-reference-guide.pdf
		// Update: Some formats (e.g. RGB) may be emulated, causing a performance hit:
		// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices#some_formats_e.g._rgb_may_be_emulated
		// Prefer to use rgba instead of rgb for all cases (WebGL1 and WebGL2).
		if (numComponents === 3) {
			glNumChannels = 4;
		}
		if (internalType === FLOAT || internalType === HALF_FLOAT) {
			// This will be hit in all cases for GLSL1, now that we have cast UNSIGNED_BYTE types to HALF_FLOAT for GLSL1.
			// See comments in shouldCastIntTypeAsFloat for more information.
			switch (glNumChannels) {
				case 1:
					glFormat = (gl as WebGL2RenderingContext).RED;
					break;
				case 2:
					glFormat = (gl as WebGL2RenderingContext).RG;
					break;
				// case 3:
				// 	glFormat = gl.RGB; // We never hit this.
				// 	break;
				case 4:
					glFormat = gl.RGBA;
					break;
				default:
					throw new Error(`Unsupported glNumChannels: ${glNumChannels} for GPULayer "${name}".`);
			}
		} else {
			// This case will only be hit by GLSL 3.
			// Int textures are not supported in GLSL1.
			switch (glNumChannels) {
				case 1:
					glFormat = (gl as WebGL2RenderingContext).RED_INTEGER;
					break;
				case 2:
					glFormat = (gl as WebGL2RenderingContext).RG_INTEGER;
					break;
				// case 3:
				// 	glFormat = (gl as WebGL2RenderingContext).RGB_INTEGER; // We never hit this.
				// 	break;
				case 4:
					glFormat = (gl as WebGL2RenderingContext).RGBA_INTEGER;
					break;
				default:
					throw new Error(`Unsupported glNumChannels: ${glNumChannels} for GPULayer "${name}".`);
			}
		}
		switch (internalType) {
			case HALF_FLOAT:
				glType = (gl as WebGL2RenderingContext).HALF_FLOAT;
				switch (glNumChannels) {
					case 1:
						glInternalFormat = (gl as WebGL2RenderingContext).R16F;
						break;
					case 2:
						glInternalFormat = (gl as WebGL2RenderingContext).RG16F;
						break;
					// case 3:
					// 	glInternalFormat = (gl as WebGL2RenderingContext).RGB16F; // We never hit this.
					// 	break;
					case 4:
						glInternalFormat = (gl as WebGL2RenderingContext).RGBA16F;
						break;
					default:
						throw new Error(`Unsupported glNumChannels: ${glNumChannels} for GPULayer "${name}".`);
				}
				break;
			case FLOAT:
				glType = (gl as WebGL2RenderingContext).FLOAT;
				switch (glNumChannels) {
					case 1:
						glInternalFormat = (gl as WebGL2RenderingContext).R32F;
						break;
					case 2:
						glInternalFormat = (gl as WebGL2RenderingContext).RG32F;
						break;
					// case 3:
					// 	glInternalFormat = (gl as WebGL2RenderingContext).RGB32F; // We never hit this.
					// 	break;
					case 4:
						glInternalFormat = (gl as WebGL2RenderingContext).RGBA32F;
						break;
					default:
						throw new Error(`Unsupported glNumChannels: ${glNumChannels} for GPULayer "${name}".`);
				}
				break;
			case UNSIGNED_BYTE:
				glType = gl.UNSIGNED_BYTE;
				if (glslVersion === GLSL1 && internalType === UNSIGNED_BYTE) {
					glInternalFormat = glFormat;
				} else {
					switch (glNumChannels) {
						case 1:
							glInternalFormat = (gl as WebGL2RenderingContext).R8UI;
							break;
						case 2:
							glInternalFormat = (gl as WebGL2RenderingContext).RG8UI;
							break;
						// case 3:
						// 	glInternalFormat = (gl as WebGL2RenderingContext).RGB8UI; // We never hit this.
						// 	break;
						case 4:
							glInternalFormat = (gl as WebGL2RenderingContext).RGBA8UI;
							break;
						default:
							throw new Error(`Unsupported glNumChannels: ${glNumChannels} for GPULayer "${name}".`);
					}
				}
				break;
			case BYTE:
				glType = gl.BYTE;
				switch (glNumChannels) {
					case 1:
						glInternalFormat = (gl as WebGL2RenderingContext).R8I;
						break;
					case 2:
						glInternalFormat = (gl as WebGL2RenderingContext).RG8I;
						break;
					// case 3:
					// 	glInternalFormat = (gl as WebGL2RenderingContext).RGB8I; // We never hit this.
					// 	break;
					case 4:
						glInternalFormat = (gl as WebGL2RenderingContext).RGBA8I;
						break;
					default:
						throw new Error(`Unsupported glNumChannels: ${glNumChannels} for GPULayer "${name}".`);
				}
				break;
			case SHORT:
				glType = gl.SHORT;
				switch (glNumChannels) {
					case 1:
						glInternalFormat = (gl as WebGL2RenderingContext).R16I;
						break;
					case 2:
						glInternalFormat = (gl as WebGL2RenderingContext).RG16I;
						break;
					// case 3:
					// 	glInternalFormat = (gl as WebGL2RenderingContext).RGB16I; // We never hit this.
					// 	break;
					case 4:
						glInternalFormat = (gl as WebGL2RenderingContext).RGBA16I;
						break;
					default:
						throw new Error(`Unsupported glNumChannels: ${glNumChannels} for GPULayer "${name}".`);
				}
				break;
			case UNSIGNED_SHORT:
				glType = gl.UNSIGNED_SHORT;
				switch (glNumChannels) {
					case 1:
						glInternalFormat = (gl as WebGL2RenderingContext).R16UI;
						break;
					case 2:
						glInternalFormat = (gl as WebGL2RenderingContext).RG16UI;
						break;
					// case 3:
					// 	glInternalFormat = (gl as WebGL2RenderingContext).RGB16UI; // We never hit this.
					// 	break;
					case 4:
						glInternalFormat = (gl as WebGL2RenderingContext).RGBA16UI;
						break;
					default:
						throw new Error(`Unsupported glNumChannels: ${glNumChannels} for GPULayer "${name}".`);
				}
				break;
			case INT:
				glType = gl.INT;
				switch (glNumChannels) {
					case 1:
						glInternalFormat = (gl as WebGL2RenderingContext).R32I;
						break;
					case 2:
						glInternalFormat = (gl as WebGL2RenderingContext).RG32I;
						break;
					// case 3:
					// 	glInternalFormat = (gl as WebGL2RenderingContext).RGB32I; // We never hit this.
					// 	break;
					case 4:
						glInternalFormat = (gl as WebGL2RenderingContext).RGBA32I;
						break;
					default:
						throw new Error(`Unsupported glNumChannels: ${glNumChannels} for GPULayer "${name}".`);
				}
				break;
			case UNSIGNED_INT:
				glType = gl.UNSIGNED_INT;
				switch (glNumChannels) {
					case 1:
						glInternalFormat = (gl as WebGL2RenderingContext).R32UI;
						break;
					case 2:
						glInternalFormat = (gl as WebGL2RenderingContext).RG32UI;
						break;
					// case 3:
					// 	glInternalFormat = (gl as WebGL2RenderingContext).RGB32UI; // We never hit this.
					// 	break;
					case 4:
						glInternalFormat = (gl as WebGL2RenderingContext).RGBA32UI;
						break;
					default:
						throw new Error(`Unsupported glNumChannels: ${glNumChannels} for GPULayer "${name}".`);
				}
				break;
			default:
				throw new Error(`Unsupported type: "${internalType}" for GPULayer "${name}".`);
		}
	} else {
		// WebGL1 case.
		if (numComponents < 1 || numComponents > 4) {
			throw new Error(`Unsupported numComponents: ${numComponents} for GPULayer "${name}".`);
		}
		// Always use 4 channel textures for WebGL1.
		// Some formats (e.g. RGB) may be emulated, causing a performance hit:
		// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices#some_formats_e.g._rgb_may_be_emulated
		glNumChannels = 4;
		glFormat = gl.RGBA;
		glInternalFormat = gl.RGBA;
		switch (internalType) {
			case FLOAT:
				glType = gl.FLOAT;
				break;
			case HALF_FLOAT:
				glType = (gl as WebGL2RenderingContext).HALF_FLOAT || getExtension(composer, OES_TEXTURE_HALF_FLOAT).HALF_FLOAT_OES as number;
				break;
			// case UNSIGNED_BYTE:
			// 	// This will never be hit, now that we have cast UNSIGNED_BYTE types to HALF_FLOAT for GLSL1.
			// 	// See comments in shouldCastIntTypeAsFloat for more information.
			// 	glType = gl.UNSIGNED_BYTE;
			// 	break;
			// No other types are supported in WebGL1.
			default:
				throw new Error(`Unsupported type: "${internalType}" in WebGL 1.0 for GPULayer "${name}".`);
		}
	}

	// Check for missing params.
	if (glType === undefined || glFormat === undefined || glInternalFormat === undefined) {
		const missingParams = [];
		if (glType === undefined) missingParams.push('glType');
		if (glFormat === undefined) missingParams.push('glFormat');
		if (glInternalFormat === undefined) missingParams.push('glInternalFormat');
		throw new Error(`Invalid type: ${internalType} for numComponents: ${numComponents}, unable to init parameter${missingParams.length > 1 ? 's' : ''} ${missingParams.join(', ')} for GPULayer "${name}".`);
	}
	if (glNumChannels === undefined || numComponents < 1 || numComponents > 4 || glNumChannels < numComponents) {
		throw new Error(`Invalid numChannels: ${glNumChannels} for numComponents: ${numComponents} for GPULayer "${name}".`);
	}

	return {
		glFormat,
		glInternalFormat,
		glType,
		glNumChannels,
	};
}

/**
 * Rigorous method for testing FLOAT and HALF_FLOAT write support by attaching texture to framebuffer.
 * @private
 */
export function testWriteSupport(
	composer: GPUComposer,
	internalType: GPULayerType,
) {
	const { gl, glslVersion, isWebGL2 } = composer;

	// Memoize results for a given set of inputs.
	const key = `${isWebGL2},${internalType},${glslVersion === GLSL3 ? '3' : '1'}`;
	if (results.writeSupport[key] !== undefined) {
		return results.writeSupport[key];
	}

	const texture = gl.createTexture();
	if (!texture) {
		results.writeSupport[key] = false;
		return results.writeSupport[key];
	}
	gl.bindTexture(gl.TEXTURE_2D, texture);

	// Default to most widely supported settings.
	const wrap = gl[CLAMP_TO_EDGE];
	const filter = gl[NEAREST];
	// Use non-power of two dimensions to check for more universal support.
	// (In case size of GPULayer is changed at a later point).
	const width = 10;
	const height = 10;
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);

	const { glInternalFormat, glFormat, glType } = GPULayer.getGLTextureParameters({
		composer,
		name: 'testWriteSupport',
		numComponents: 1,
		internalType,
	});
	gl.texImage2D(gl.TEXTURE_2D, 0, glInternalFormat, width, height, 0, glFormat, glType, null);

	// Init a framebuffer for this texture so we can write to it.
	const framebuffer = gl.createFramebuffer();
	if (!framebuffer) {
		// Clear out allocated memory.
		gl.deleteTexture(texture);
		results.writeSupport[key] = false;
		return results.writeSupport[key];
	}
	gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
	// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/framebufferTexture2D
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

	const validStatus = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;

	// Clear out allocated memory.
	gl.deleteTexture(texture);
	gl.deleteFramebuffer(framebuffer);

	results.writeSupport[key] = validStatus;
	return results.writeSupport[key];
}

/**
 * Rigorous method for testing whether a filter/wrap combination is supported
 * by the current browser.  I found that some versions of WebGL2 mobile safari
 * may support the OES_texture_float_linear and EXT_color_buffer_float, but still
 * do not linearly interpolate float textures or wrap only for power-of-two textures.
 * @private
 */
export function testFilterWrap(
	composer: GPUComposer,
	internalType: GPULayerType,
	filter: GPULayerFilter,
	wrap: GPULayerWrap,
) {
	const { gl, glslVersion, intPrecision, floatPrecision, _errorCallback, isWebGL2 } = composer;

	// Memoize results for a given set of inputs.
	const key = `${isWebGL2},${internalType},${filter},${wrap},${glslVersion === GLSL3 ? '3' : '1'}`;
	if (results.filterWrapSupport[key] !== undefined) {
		return results.filterWrapSupport[key];
	}

	const texture = gl.createTexture();
	if (!texture) {
		results.filterWrapSupport[key] = false;
		return results.filterWrapSupport[key];
	}
	gl.bindTexture(gl.TEXTURE_2D, texture);

	const glWrap = gl[wrap];
	const glFilter = gl[filter];
	// Use non power of two dimensions to check for more universal support.
	const width = 3;
	const height = 3;
	const numComponents = 1;
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, glWrap);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, glWrap);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, glFilter);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, glFilter);

	const { glInternalFormat, glFormat, glType, glNumChannels } = GPULayer.getGLTextureParameters({
		composer,
		name: 'testFilterWrap',
		numComponents,
		internalType,
	});
	// Init texture with values.
	const values = [3, 56.5, 834, -53.6, 0.003, 96.2, 23, 90.2, 32];
	let valuesTyped = GPULayer.initArrayForType(internalType, values.length * glNumChannels, true);
	for (let i = 0; i < values.length; i++) {
		valuesTyped[i * glNumChannels] = values[i];
		values[i] = valuesTyped[i * glNumChannels]; // Cast as int/uint if needed.
	}
	if (internalType === HALF_FLOAT) {
		// Cast values as Uint16Array for HALF_FLOAT.
		const valuesTyped16 = new Uint16Array(valuesTyped.length);
		const float16View =  new DataView(valuesTyped16.buffer);
		for (let i = 0; i < valuesTyped.length; i++) {
			setFloat16(float16View, 2 * i, valuesTyped[i], true);
		}
		valuesTyped = valuesTyped16;
	}
	gl.texImage2D(gl.TEXTURE_2D, 0, glInternalFormat, width, height, 0, glFormat, glType, valuesTyped);

	// Init a GPULayer to write to.
	// Must use CLAMP_TO_EDGE/NEAREST on this GPULayer to avoid infinite loop.
	const output = new GPULayer(composer, {
		name: 'testFloatLinearFiltering-output',
		type: internalType,
		numComponents,
		dimensions: [width, height],
		wrapX: CLAMP_TO_EDGE,
		wrapY: CLAMP_TO_EDGE,
		filter: NEAREST,
	});

	const offset = filter === LINEAR ? 0.5 : 1;
	// Run program to perform linear filter.
	const programName = 'testFilterWrap-program';
	let fragmentShaderSource = `
in vec2 v_uv;
uniform vec2 u_offset;
#ifdef GPUIO_INT
	uniform isampler2D u_input;
	out int out_result;
#endif
#ifdef GPUIO_UINT
	uniform usampler2D u_input;
	out uint out_result;
#endif
#ifdef GPUIO_FLOAT
	uniform sampler2D u_input;
	out float out_result;
#endif
void main() {
	out_result = texture(u_input, v_uv + offset).x;
}`;
	if (glslVersion !== GLSL3) {
		fragmentShaderSource = convertFragmentShaderToGLSL1(fragmentShaderSource, programName)[0];
	}
	const fragmentShader = compileShader(
		gl,
		glslVersion,
		intPrecision,
		floatPrecision,
		fragmentShaderSource,
		gl.FRAGMENT_SHADER,
		programName,
		_errorCallback,
		{
			offset: `vec2(${offset / width}, ${offset / height})`,
			[isUnsignedIntType(internalType) ? 'GPUIO_UINT' : (isIntType(internalType) ? 'GPUIO_INT': 'GPUIO_FLOAT')]: '1',
		},
		undefined,
		true,
	);

	function wrapValue(val: number, max: number) {
		if (wrap === CLAMP_TO_EDGE) return Math.max(0, Math.min(max - 1, val));
		return (val + max) % max;
	}

	const vertexShader = composer._getVertexShader(DEFAULT_PROGRAM_NAME, '', {}, programName);
	if (vertexShader && fragmentShader) {
		const program = initGLProgram(gl, vertexShader, fragmentShader, programName, _errorCallback);
		if (program) {
			// Draw setup.
			output._prepareForWrite(false);
			bindFrameBuffer(composer, output, output._currentTexture);
			gl.viewport(0, 0, width, height);
			gl.useProgram(program);
			// Bind texture.
			gl.activeTexture(gl.TEXTURE0 );
			gl.bindTexture(gl.TEXTURE_2D, texture);
			// Set uniforms.
			gl.uniform2fv(gl.getUniformLocation(program, 'u_gpuio_scale'), [1, 1]);
			gl.uniform2fv(gl.getUniformLocation(program, 'u_gpuio_translation'), [0, 0]);
			gl.bindBuffer(gl.ARRAY_BUFFER, composer._getQuadPositionsBuffer());
			composer._setPositionAttribute(program, programName);

			// Draw.
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
			gl.disable(gl.BLEND);

			const filtered = output.getValues();
			let supported = true;
			const tol = isIntType(internalType) ? 0 : (internalType === HALF_FLOAT ? 1e-2 : 1e-4);
			for (let x = 0; x < width; x++) {
				for (let y = 0; y < height; y++) {
					let expected;
					if (filter === LINEAR) {
						expected = (values[y * width + x] +
							values[y * width + wrapValue(x + 1, width)] +
							values[wrapValue(y + 1, height) * width + x] +
							values[wrapValue(y + 1, height) * width + wrapValue(x + 1, width)]) / 4;
					} else {
						const _x = wrapValue(x + offset, width);
						const _y = wrapValue(y + offset, height);
						expected = values[_y * width + _x];
					}
					const i = y * width + x;
					if (Math.abs((expected - filtered[i]) / expected) > tol) {
						supported = false;
						break;
					}
				}
			}
			results.filterWrapSupport[key] = supported;
			// Clear out allocated memory.
			gl.deleteProgram(program);
		} else {
			results.filterWrapSupport[key] = false;
		}
		// Clear out allocated memory.
		// vertexShader belongs to composer, don't delete it.
		gl.deleteShader(fragmentShader);
	} else {
		results.filterWrapSupport[key] = false;
	}
	// Clear out allocated memory.
	output.dispose();
	gl.deleteTexture(texture);
	return results.filterWrapSupport[key];
}

/**
 * Get the GL type to use internally in GPULayer, based on browser support.
 * @private
 * Exported here for testing purposes.
 */
GPULayer.getGPULayerInternalType = (
	params: {
		composer: GPUComposer,
		type: GPULayerType,
		name: string,
	},
) => {
	const { composer, name } = params;
	const { _errorCallback, isWebGL2 } = composer;
	const { type } = params;
	let internalType = type;
	// Check if int types are supported.
	const intCast = shouldCastIntTypeAsFloat(composer, type);
	if (intCast) {
		if (internalType === UNSIGNED_BYTE || internalType === BYTE) {
			// Integers between -2048 and +2048 can be exactly represented by half float.
			internalType = HALF_FLOAT;
		} else {
			// Integers between 0 and 16777216 can be exactly represented by float32 (also applies for negative integers between −16777216 and 0)
			// This is sufficient for UNSIGNED_SHORT and SHORT types.
			// Large UNSIGNED_INT and INT cannot be represented by FLOAT type.
			console.warn(`Falling back ${internalType} type to FLOAT type for glsl1.x support for GPULayer "${name}".
Large UNSIGNED_INT or INT with absolute value > 16,777,216 are not supported, on mobile UNSIGNED_INT, INT, UNSIGNED_SHORT, and SHORT with absolute value > 2,048 may not be supported.`);
			internalType = FLOAT;
		}
	}

	// Check if float textures supported.
	if (!isWebGL2) {
		if (internalType === FLOAT) {
			// The OES_texture_float extension implicitly enables WEBGL_color_buffer_float extension (for writing).
			const extension = getExtension(composer, OES_TEXTURE_FLOAT, true);
			if (extension) {
				// https://stackoverflow.com/questions/17476632/webgl-extension-support-across-browsers
				// Rendering to a floating-point texture may not be supported, even if the OES_texture_float extension
				// is supported. Typically, this fails on mobile hardware. To check if this is supported, you have to
				// call the WebGL checkFramebufferStatus() function after attempting to attach texture to framebuffer.
				const valid = testWriteSupport(composer, internalType);
				if (!valid) {
					console.warn(`FLOAT not supported for writing operations in this browser, falling back to HALF_FLOAT type for GPULayer "${name}".`);
					internalType = HALF_FLOAT;
				}
			} else {
				console.warn(`FLOAT not supported in this browser, falling back to HALF_FLOAT type for GPULayer "${name}".`);
				internalType = HALF_FLOAT;
			}
		}
		// Must support at least half float if using a float type.
		if (internalType === HALF_FLOAT) {
			// The OES_texture_half_float extension implicitly enables EXT_color_buffer_half_float extension (for writing).
			getExtension(composer, OES_TEXTURE_HALF_FLOAT, true);
			// FYI, very old safari issues: https://stackoverflow.com/questions/54248633/cannot-create-half-float-oes-texture-from-uint16array-on-ipad
			const valid = testWriteSupport(composer, internalType);
			// May still be ok for read-only, but this will affect the ability to call getValues() and savePNG().
			// We'll let it pass for now.
			if (!valid) {
				console.warn(`This browser does not support writing to HALF_FLOAT textures.`);
				// _errorCallback(`This browser does not support writing to HALF_FLOAT textures.`);
			}
		}
	} else {
		// For writable webGL2 contexts, load EXT_color_buffer_float/EXT_color_buffer_half_float extension.
		if (internalType === FLOAT) {
			const extension = getExtension(composer, EXT_COLOR_BUFFER_FLOAT, true);
			if (!extension) {
				console.warn(`FLOAT not supported in this browser, falling back to HALF_FLOAT type for GPULayer "${name}".`);
				internalType = HALF_FLOAT;
			} else {
				// Test attaching texture to framebuffer to be sure float writing is supported.
				const valid = testWriteSupport(composer, internalType);
				if (!valid) {
					console.warn(`FLOAT not supported for writing operations in this browser, falling back to HALF_FLOAT type for GPULayer "${name}".`);
					internalType = HALF_FLOAT;
				}
			}
		}
		if (internalType === HALF_FLOAT) {
			// On WebGL 2, EXT_color_buffer_half_float is an alternative to using the EXT_color_buffer_float extension
			// on platforms that support 16-bit floating point render targets but not 32-bit floating point render targets.
			const halfFloatExt = getExtension(composer, EXT_COLOR_BUFFER_HALF_FLOAT, true);
			if (!halfFloatExt) {
				// Some versions of Firefox (e.g. Firefox v104 on Mac) do not support EXT_COLOR_BUFFER_HALF_FLOAT,
				// but EXT_COLOR_BUFFER_FLOAT will work instead.
				getExtension(composer, EXT_COLOR_BUFFER_FLOAT, true);
			}
			// Test attaching texture to framebuffer to be sure half float writing is supported.
			const valid = testWriteSupport(composer, internalType);
			// May still be ok for read-only, but this will affect the ability to call getValues() and savePNG().
			// We'll let it pass for now.
			if (!valid) {
				console.warn(`This browser does not support writing to HALF_FLOAT textures.`);
				_errorCallback(`This browser does not support writing to HALF_FLOAT textures.`);
			}
		}
	}
	return internalType;
}

/**
 * Min and max values for types.
 * @private
 */
export function minMaxValuesForType(type: GPULayerType) {
	// Get min and max values for int types.
	let min = -Infinity;
	let max = Infinity;
	switch(type) {
		case UNSIGNED_BYTE:
			min = MIN_UNSIGNED_BYTE;
			max = MAX_UNSIGNED_BYTE;
			break;
		case BYTE:
			min = MIN_BYTE;
			max = MAX_BYTE;
			break;
		case UNSIGNED_SHORT:
			min = MIN_UNSIGNED_SHORT;
			max = MAX_UNSIGNED_SHORT;
			break;
		case SHORT:
			min = MIN_SHORT;
			max = MAX_SHORT;
			break;
		case UNSIGNED_INT:
			min = MIN_UNSIGNED_INT;
			max = MAX_UNSIGNED_INT;
			break;
		case INT:
			min = MIN_INT;
			max = MAX_INT;
			break;
	}
	return {
		min, max,
	};
}

/**
 * Recasts typed array to match GPULayer.internalType.
 * @private
 */
GPULayer.validateGPULayerArray = (array: GPULayerArray | number[], layer: GPULayer) => {
	const { numComponents, width, height, name } = layer;
	const glNumChannels = layer._glNumChannels;
	const internalType = layer._internalType;
	const length = layer.is1D() ? layer.length : null;

	// Check that data is correct length (user error).
	if (array.length !== width * height * numComponents) { // Either the correct length for WebGLTexture size
		if (!length || (length &&  array.length !== length * numComponents)) { // Of the correct length for 1D array.
			throw new Error(`Invalid data length: ${array.length} for GPULayer "${name}" of ${length ? `length ${length} and ` : ''}dimensions: [${width}, ${height}] and numComponents: ${numComponents}.`);
		}
	}

	// Get array type to figure out if we need to type cast.
	// For webgl1.0 we may need to cast an int type to a FLOAT or HALF_FLOAT.
	let shouldTypeCast = false;
	switch(array.constructor) {
		case Array:
			shouldTypeCast = true;
			break;
		case Float32Array:
			shouldTypeCast = internalType !== FLOAT;
			break;
		case Uint8Array:
			shouldTypeCast = internalType !== UNSIGNED_BYTE;
			break;
		case Int8Array:
			shouldTypeCast = internalType !== BYTE;
			break;
		case Uint16Array:
			// User may have converted to HALF_FLOAT already.
			// We need to add this check in case type is UNSIGNED_SHORT and internal type is HALF_FLOAT.
			// (This can happen for some WebGL1 contexts.)
			// if (type === HALF_FLOAT) {
			// 	shouldTypeCast = internalType !== HALF_FLOAT;
			// 	// In order to complete this, we will also need to handle converting from Uint16Array to some other type.
			// 	// Are there cases where HALF_FLOAT is not supported?
			// } else {
				shouldTypeCast = internalType !== UNSIGNED_SHORT
			// }
			break;
		case Int16Array:
			shouldTypeCast = internalType !== SHORT;
			break;
		case Uint32Array:
			shouldTypeCast = internalType !== UNSIGNED_INT;
			break;
		case Int32Array:
			shouldTypeCast = internalType !== INT;
			break;
		default:
			throw new Error(`Invalid array type: ${array.constructor.name} for GPULayer "${name}", please use one of [${validArrayTypes.map(constructor => constructor.name).join(', ')}].`);
	}

	// Get min and max values for internalType.
	const { min, max } = minMaxValuesForType(internalType);

	// Then check if array needs to be lengthened.
	// This could be because glNumChannels !== numComponents or because length !== width * height.
	const arrayLength = width * height * glNumChannels;
	const shouldResize = array.length !== arrayLength;
		
	let validatedArray = array as GPULayerArray;
	if (shouldTypeCast || shouldResize) {
		validatedArray = GPULayer.initArrayForType(internalType, arrayLength);
		// Fill new data array with old data.
		// We have to handle the case of Float16 specially by converting data to Uint16Array.
		const view = (internalType === HALF_FLOAT && shouldTypeCast) ? new DataView(validatedArray.buffer) : null;
		for (let i = 0, _len = array.length / numComponents; i < _len; i++) {
			for (let j = 0; j < numComponents; j++) {
				const origValue = array[i * numComponents + j];
				let value = origValue;
				let clipped = false;
				if (value < min) {
					value = min;
					clipped = true;
				} else if (value > max) {
					value = max;
					clipped = true;
				}
				if (clipped) {
					console.warn(`Clipping out of range value ${origValue} to ${value} for GPULayer "${name}" with internal type ${internalType}.`);
				}
				const index = i * glNumChannels + j;
				if (view) {
					setFloat16(view, 2 * index, value, true);
				} else {
					validatedArray[index] = value;
				}
			}
		}
	}

	return validatedArray;
}