import {
	isNumber,
	isPositiveInteger,
} from './checks';
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
	ErrorCallback,
	GLSLVersion,
	GLSL3,
	GPULayerNumComponents,
	GLSL1,
} from './constants';
import {
	EXT_COLOR_BUFFER_FLOAT,
	getExtension,
	OES_TEXTURE_FLOAT,
	OES_TEXTURE_FLOAT_LINEAR,
	OES_TEXTURE_HALF_FLOAT,
	OES_TEXTURE_HAlF_FLOAT_LINEAR,
} from './extensions';
import { GPUComposer } from './GPUComposer';
import { isWebGL2 } from './utils';

// Memoize results.
const results = {
	framebufferWriteSupport: {} as { [key: string]: boolean },
}

/**
 * Init empty typed array for type, optionally use Float32Array for HALF_FLOAT.
 * Used internally.
 */
export function initArrayForType(
	type: GPULayerType,
	length: number,
	halfFloatsAsFloats = false,
) {
	switch (type) {
		case HALF_FLOAT:
			if (halfFloatsAsFloats) return new Float32Array(length);
			return new Uint16Array(length);
		case FLOAT:
			return new Float32Array(length);
		case UNSIGNED_BYTE:
			return new Uint8Array(length);
		case BYTE:
			return new Int8Array(length);
		case UNSIGNED_SHORT:
			return new Uint16Array(length);
		case SHORT:
			return new Int16Array(length);
		case UNSIGNED_INT:
			return new Uint32Array(length);
		case INT:
			return new Int32Array(length);
		default:
			throw new Error(`Unsupported type: "${type}".`);
	}
}

/**
 * Calc 2D size [width, height] for GPU layer given a 1D or 2D size parameter.
 * If 1D size supplied, nearest power of 2 width/height is generated.
 * Also checks that size elements are valid.
 * Used internally.
 */
// TODO: should we relax adherence to power of 2.
export function calcGPULayerSize(
	size: number | [number, number],
	name: string,
	verboseLogging: boolean,
) {
	if (isNumber(size as number)) {
		if (!isPositiveInteger(size)) {
			throw new Error(`Invalid length: ${size} for GPULayer "${name}", must be positive integer.`);
		}
		const length = size as number;
		// Calc power of two width and height for length.
		let exp = 1;
		let remainder = length;
		while (remainder > 2) {
			exp++;
			remainder /= 2;
		}
		const width = Math.pow(2, Math.floor(exp / 2) + exp % 2);
		const height = Math.pow(2, Math.floor(exp/2));
		if (verboseLogging) {
			console.log(`Using [${width}, ${height}] for 1D array of length ${size} in GPULayer "${name}".`);
		}
		return { width, height, length };
	}
	const width = (size as [number, number])[0];
	if (!isPositiveInteger(width)) {
		throw new Error(`Invalid width: ${width} for GPULayer "${name}", must be positive integer.`);
	}
	const height = (size as [number, number])[1];
	if (!isPositiveInteger(height)) {
		throw new Error(`Invalid height: ${height} for GPULayer "${name}", must be positive integer.`);
	}
	return { width, height };
}

/**
 * Get the GL wrap type to use internally in GPULayer, based on browser support.
 * Used internally.
 */
export function getGPULayerInternalWrap(
	params: {
		composer: GPUComposer,
		wrap: GPULayerWrap,
		name: string,
	},
) {
	const { composer, wrap, name } = params;
	const { gl } = composer;
	// Webgl2.0 supports all combinations of types and filtering.
	if (isWebGL2(gl)) {
		return wrap;
	}
	// CLAMP_TO_EDGE is always supported.
	if (wrap === CLAMP_TO_EDGE) {
		return wrap;
	}
	if (!isWebGL2(gl)) {
		// TODO: we may want to handle this in the frag shader.
		// REPEAT and MIRROR_REPEAT wrap not supported for non-power of 2 textures in safari.
		// I've tested this and it seems that some power of 2 textures will work (512 x 512),
		// but not others (1024x1024), so let's just change all WebGL 1.0 to CLAMP.
		// Without this, we currently get an error at drawArrays():
		// "WebGL: drawArrays: texture bound to texture unit 0 is not renderable.
		// It maybe non-power-of-2 and have incompatible texture filtering or is not
		// 'texture complete', or it is a float/half-float type with linear filtering and
		// without the relevant float/half-float linear extension enabled."
		console.warn(`Falling back to CLAMP_TO_EDGE wrapping for GPULayer "${name}" for WebGL 1.`);
		return CLAMP_TO_EDGE;
	}
	return wrap;
}

/**
 * Get the GL filter type to use internally in GPULayer, based on browser support.
 * Used internally.
 */
export function getGPULayerInternalFilter(
	params: {
		composer: GPUComposer,
		filter: GPULayerFilter,
		internalType: GPULayerType,
		name: string,
	},
) {
	const { composer, internalType, name } = params;
	let { filter } = params;
	if (filter === NEAREST) {
		// NEAREST filtering is always supported.
		return filter;
	}

	if (internalType === HALF_FLOAT) {
		// TODO: test if float linear extension is actually working.
		const extension = getExtension(composer, OES_TEXTURE_HAlF_FLOAT_LINEAR, true)
			|| getExtension(composer, OES_TEXTURE_FLOAT_LINEAR, true);
		if (!extension) {
			console.warn(`Falling back to NEAREST filter for GPULayer "${name}".`);
			//TODO: add a fallback that does this filtering in the frag shader.
			filter = NEAREST;
		}
	} if (internalType === FLOAT) {
		const extension = getExtension(composer, OES_TEXTURE_FLOAT_LINEAR, true);
		if (!extension) {
			console.warn(`Falling back to NEAREST filter for GPULayer "${name}".`);
			//TODO: add a fallback that does this filtering in the frag shader.
			filter = NEAREST;
		}
	}
	return filter;
}

/**
 * Returns whether to cast int type as floats, as needed by browser.
 * Used internally.
 */
export function shouldCastIntTypeAsFloat(
	params: {
		composer: GPUComposer,
		type: GPULayerType,
	}
) {
	const { type, composer } = params;
	const { gl, glslVersion } = composer;
	// All types are supported by WebGL2 + glsl3.
	if (glslVersion === GLSL3 && isWebGL2(gl)) return false;
	// Int textures (other than UNSIGNED_BYTE) are not supported by WebGL1.0 or glsl1.x.
	// https://stackoverflow.com/questions/55803017/how-to-select-webgl-glsl-sampler-type-from-texture-format-properties
	// Use HALF_FLOAT/FLOAT instead.
	// Some large values of INT and UNSIGNED_INT are not supported unfortunately.
	// See tests for more information.
	return type === BYTE || type === SHORT || type === INT || type === UNSIGNED_SHORT || type === UNSIGNED_INT;
}

/**
 * Returns GLTexture parameters for GPULayer, based on browser support.
 * Used internally.
 */
export function getGLTextureParameters(
	params: {
		composer: GPUComposer,
		name: string,
		numComponents: GPULayerNumComponents,
		internalType: GPULayerType,
		writable: boolean,
	}
) {
	const { composer, name, numComponents, internalType, writable } = params;
	const { gl, glslVersion } = composer;
	// https://www.khronos.org/registry/webgl/specs/latest/2.0/#TEXTURE_TYPES_FORMATS_FROM_DOM_ELEMENTS_TABLE
	let glType: number | undefined,
		glFormat: number | undefined,
		glInternalFormat: number | undefined,
		glNumChannels: number | undefined;

	if (isWebGL2(gl)) {
		glNumChannels = numComponents;
		// https://www.khronos.org/registry/webgl/extensions/EXT_color_buffer_float/
		// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D
		// The sized internal format RGBxxx are not color-renderable for some reason.
		// If numComponents == 3 for a writable texture, use RGBA instead.
		// Page 5 of https://www.khronos.org/files/webgl20-reference-guide.pdf
		if (numComponents === 3 && writable) {
			glNumChannels = 4;
		}
		if (internalType === FLOAT || internalType === HALF_FLOAT) {
			switch (glNumChannels) {
				case 1:
					glFormat = (gl as WebGL2RenderingContext).RED;
					break;
				case 2:
					glFormat = (gl as WebGL2RenderingContext).RG;
					break;
				case 3:
					glFormat = gl.RGB;
					break;
				case 4:
					glFormat = gl.RGBA;
					break;
				default:
					throw new Error(`Unsupported glNumChannels: ${glNumChannels} for GPULayer "${name}".`);
			}
		} else if (glslVersion === GLSL1 && internalType === UNSIGNED_BYTE) {
			// Don't use gl.ALPHA or gl.LUMINANCE_ALPHA here bc we should expect the values in the R and RG channels.
			if (writable) {
				// For read only UNSIGNED_BYTE textures in GLSL 1, use RGBA.
				glNumChannels = 4;
			}
			// For read only UNSIGNED_BYTE textures in GLSL 1, use RGB/RGBA.
			switch (glNumChannels) {
				case 1:
				case 2:
				case 3:
					glFormat = gl.RGB;
					glNumChannels = 3;
					break;
				case 4:
					glFormat = gl.RGBA;
					glNumChannels = 4;
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
				case 3:
					glFormat = (gl as WebGL2RenderingContext).RGB_INTEGER;
					break;
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
					case 3:
						glInternalFormat = (gl as WebGL2RenderingContext).RGB16F;
						break;
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
					case 3:
						glInternalFormat = (gl as WebGL2RenderingContext).RGB32F;
						break;
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
						case 3:
							glInternalFormat = (gl as WebGL2RenderingContext).RGB8UI;
							break;
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
					case 3:
						glInternalFormat = (gl as WebGL2RenderingContext).RGB8I;
						break;
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
					case 3:
						glInternalFormat = (gl as WebGL2RenderingContext).RGB16I;
						break;
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
					case 3:
						glInternalFormat = (gl as WebGL2RenderingContext).RGB16UI;
						break;
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
					case 3:
						glInternalFormat = (gl as WebGL2RenderingContext).RGB32I;
						break;
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
					case 3:
						glInternalFormat = (gl as WebGL2RenderingContext).RGB32UI;
						break;
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
		// Don't use gl.ALPHA or gl.LUMINANCE_ALPHA here bc we should expect the values in the R and RG channels.
		if (writable) {
			// For read only textures in WebGL 1, use RGBA.
			glNumChannels = 4;
		}
		// For read only textures in WebGL 1, use RGB/RGBA.
		switch (numComponents) {
			case 1:
			case 2:
			case 3:
				glFormat = gl.RGB;
				glInternalFormat = gl.RGB;
				glNumChannels = 3;
				break;
			case 4:
				glFormat = gl.RGBA;
				glInternalFormat = gl.RGBA;
				glNumChannels = 4;
				break;
			default:
				throw new Error(`Unsupported numComponents: ${numComponents} for GPULayer "${name}".`);
		}
		switch (internalType) {
			case FLOAT:
				glType = gl.FLOAT;
				break;
			case HALF_FLOAT:
				glType = (gl as WebGL2RenderingContext).HALF_FLOAT || getExtension(composer, OES_TEXTURE_HALF_FLOAT).HALF_FLOAT_OES as number;
				break;
			case UNSIGNED_BYTE:
				glType = gl.UNSIGNED_BYTE;
				break;
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
 * 
 * @param params 
 * @returns 
 */
export function testFramebufferWrite(
	params: {
		composer: GPUComposer,
		internalType: GPULayerType,
	},
) {
	const { composer, internalType } = params;
	const { gl, glslVersion } = composer;

	const key = `${isWebGL2(gl),internalType,glslVersion}`;
	if (results.framebufferWriteSupport[key] !== undefined) {
		return results.framebufferWriteSupport[key];
	}

	const texture = gl.createTexture();
	if (!texture) {
		results.framebufferWriteSupport[key] = false;
		return results.framebufferWriteSupport[key];
	}
	gl.bindTexture(gl.TEXTURE_2D, texture);

	// Default to most widely supported settings.
	const wrapS = gl[CLAMP_TO_EDGE];
	const wrapT = gl[CLAMP_TO_EDGE];
	const filter = gl[NEAREST];
	// Use non-power of two dimensions to check for more universal support.
	// (In case size of GPULayer is changed at a later point).
	const width = 100;
	const height = 100;
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);

	const { glInternalFormat, glFormat, glType } = getGLTextureParameters({
		composer,
		name: 'testFramebufferWrite',
		numComponents: 1,
		writable: true,
		internalType,
	});
	gl.texImage2D(gl.TEXTURE_2D, 0, glInternalFormat, width, height, 0, glFormat, glType, null);

	// Init a framebuffer for this texture so we can write to it.
	const framebuffer = gl.createFramebuffer();
	if (!framebuffer) {
		// Clear out allocated memory.
		gl.deleteTexture(texture);
		results.framebufferWriteSupport[key] = false;
		return results.framebufferWriteSupport[key];
	}
	gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
	// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/framebufferTexture2D
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

	const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
	const validStatus = status === gl.FRAMEBUFFER_COMPLETE;

	// Clear out allocated memory.
	gl.deleteTexture(texture);
	gl.deleteFramebuffer(framebuffer);

	results.framebufferWriteSupport[key] = validStatus;
	return results.framebufferWriteSupport[key];
}

/**
 * Get the GL type to use internally in GPULayer, based on browser support.
 * Used internally, only exported for testing purposes.
 */
export function getGPULayerInternalType(
	params: {
		composer: GPUComposer,
		type: GPULayerType,
		writable: boolean,
		name: string,
	},
) {
	const { composer, writable, name } = params;
	const { gl, _errorCallback } = composer;
	const { type } = params;
	let internalType = type;
	// Check if int types are supported.
	const intCast = shouldCastIntTypeAsFloat(params);
	if (intCast) {
		if (internalType === UNSIGNED_BYTE || internalType === BYTE) {
			// Integers between 0 and 2048 can be exactly represented by half float (and also between −2048 and 0)
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
	// Check if float32 supported.
	if (!isWebGL2(gl)) {
		if (internalType === FLOAT) {
			const extension = getExtension(composer, OES_TEXTURE_FLOAT, true);
			if (!extension) {
				console.warn(`FLOAT not supported, falling back to HALF_FLOAT type for GPULayer "${name}".`);
				internalType = HALF_FLOAT;
			}
			// https://stackoverflow.com/questions/17476632/webgl-extension-support-across-browsers
			// Rendering to a floating-point texture may not be supported,
			// even if the OES_texture_float extension is supported.
			// Typically, this fails on current mobile hardware.
			// To check if this is supported, you have to call the WebGL
			// checkFramebufferStatus() function.
			if (writable) {
				const valid = testFramebufferWrite({ composer, internalType: internalType });
				if (!valid && internalType !== HALF_FLOAT) {
					console.warn(`FLOAT not supported for writing operations, falling back to HALF_FLOAT type for GPULayer "${name}".`);
					internalType = HALF_FLOAT;
				}
			}
		}
		// Must support at least half float if using a float type.
		if (internalType === HALF_FLOAT) {
			getExtension(composer, OES_TEXTURE_HALF_FLOAT);
			// TODO: https://stackoverflow.com/questions/54248633/cannot-create-half-float-oes-texture-from-uint16array-on-ipad
			if (writable) {
				const valid = testFramebufferWrite({ composer, internalType: internalType });
				if (!valid) {
					_errorCallback(`This browser does not support rendering to HALF_FLOAT textures.`);
				}
			}
		}
	}
	
	// Load additional extensions if needed.
	if (writable && isWebGL2(gl) && (internalType === HALF_FLOAT || internalType === FLOAT)) {
		getExtension(composer, EXT_COLOR_BUFFER_FLOAT);
	}
	return internalType;
}
