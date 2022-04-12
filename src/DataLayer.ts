import { setFloat16 } from '@petamoriken/float16';
import { WebGLCompute } from '.';
import {
	isNumber,
	isPositiveInteger,
	isValidClearValue,
	isValidDataType,
	isValidFilter,
	isValidWrap,
} from './Checks';
import {
	HALF_FLOAT,
	FLOAT,
	UNSIGNED_BYTE,
	BYTE,
	UNSIGNED_SHORT,
	SHORT,
	UNSIGNED_INT,
	INT,
	NEAREST,
	LINEAR,
	CLAMP_TO_EDGE,
	DataLayerArray,
	DataLayerFilter,
	DataLayerNumComponents,
	DataLayerType,
	DataLayerWrap,
	GLSLVersion,
	GLSL3,
	GLSL1,
	DataLayerBuffer,
	ErrorCallback,
	validArrayTypes,
	validFilters,
	validWraps,
	validDataTypes,
 } from './Constants';
import {
	getExtension,
	EXT_COLOR_BUFFER_FLOAT,
	OES_TEXTURE_FLOAT,
	OES_TEXTURE_FLOAT_LINEAR,
	OES_TEXTURE_HALF_FLOAT,
	OES_TEXTURE_HAlF_FLOAT_LINEAR,
} from './extensions';
import {
	inDevMode,
	isWebGL2,
} from './utils';

export class DataLayer {
	// Keep a reference to WebGLCompute.
	private readonly glcompute: WebGLCompute;

	readonly name: string; // Name of DataLayer, used for error logging.
	readonly type: DataLayerType; // Input type passed in during setup.
	readonly numComponents: DataLayerNumComponents; // Number of RGBA channels to use for this DataLayer.
	readonly filter: DataLayerFilter; // Interpolation filter for pixel read operations.
	readonly wrapS: DataLayerWrap; // Input wrap type passed in during setup.
	readonly wrapT: DataLayerWrap; // Input wrap type passed in during setup.
	readonly writable: boolean;
	private _clearValue!: number | number[]; // Value to set when clear() is called.

	// Each DataLayer may contain a number of buffers to store different instances of the state.
	// e.g [currentState, previousState]
	private _bufferIndex = 0;
	readonly numBuffers;
	private readonly buffers: DataLayerBuffer[] = [];

	// Texture sizes.
	private _length?: number; // This is only used for 1D data layers.
	private _width: number;
	private _height: number;

	// DataLayer settings.
	// Due to variable browser support of WebGL features, "internal" variables may be different
	// from the parameter originally passed in.  These variables are set so that they match the original
	// parameter as best as possible, but fragment shader polyfills may be required.
	// All "gl" variables are used to initialize internal WebGLTexture.
	// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D
	// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter
	readonly glInternalFormat: number;
	readonly glFormat: number;
	// DataLayer.internalType corresponds to DataLayer.glType, may be different from DataLayer.type.
	readonly internalType: DataLayerType; 
	readonly glType: number;
	// Internally, DataLayer.glNumChannels may represent a larger number of channels than DataLayer.numComponents.
	// For example, writable RGB textures are not supported in WebGL2, must use RGBA instead.
	readonly glNumChannels: number;
	// DataLayer.internalFilter corresponds to DataLayer.glFilter, may be different from DataLayer.filter.
	readonly internalFilter: DataLayerFilter;
	readonly glFilter: number;
	// DataLayer.internalWrapS corresponds to DataLayer.glWrapS, may be different from DataLayer.wrapS.
	readonly internalWrapS: DataLayerWrap;
	readonly glWrapS: number;
	// DataLayer.internalWrapT corresponds to DataLayer.glWrapS, may be different from DataLayer.wrapT.
	readonly internalWrapT: DataLayerWrap;
	readonly glWrapT: number;
	
	// Optimizations so that "copying" can happen without draw calls.
	private textureOverrides?: (WebGLTexture | undefined)[];

	constructor(
		glcompute: WebGLCompute,
		params: {
			name: string,
			dimensions: number | [number, number],
			type: DataLayerType,
			numComponents: DataLayerNumComponents,
			array?: DataLayerArray | number[],
			filter?: DataLayerFilter,
			wrapS?: DataLayerWrap,
			wrapT?: DataLayerWrap,
			writable?: boolean,
			numBuffers?: number,
			clearValue?: number | number[],
		},
	) {
		const { name, dimensions, type, numComponents, array } = params;
		const { gl, errorCallback, glslVersion } = glcompute;

		// Save params.
		this.glcompute = glcompute;
		this.name = name;

		// numComponents must be between 1 and 4.
		if (!isPositiveInteger(numComponents) || numComponents > 4) {
			throw new Error(`Invalid numComponents: ${numComponents} for DataLayer "${name}".`);
		}
		this.numComponents = numComponents;

		// Writable defaults to false.
		const writable = !!params.writable;
		this.writable = writable;

		// Set dimensions, may be 1D or 2D.
		const { length, width, height } = DataLayer.calcSize(dimensions, name);
		this._length = length;
		if (!isPositiveInteger(width)) {
			throw new Error(`Invalid width: ${width} for DataLayer "${name}".`);
		}
		this._width = width;
		if (!isPositiveInteger(height)) {
			throw new Error(`Invalid length: ${height} for DataLayer "${name}".`);
		}
		this._height = height;

		// Set filtering - if we are processing a 1D array, default to NEAREST filtering.
		// Else default to LINEAR (interpolation) filtering for float types and NEAREST for integer types.
		const defaultFilter = length ? NEAREST : ((type === FLOAT || type == HALF_FLOAT) ? LINEAR : NEAREST);
		const filter = params.filter !== undefined ? params.filter : defaultFilter;
		if (!isValidFilter(filter)) {
			throw new Error(`Invalid filter: ${filter} for DataLayer "${name}", must be one of [${validFilters.join(', ')}].`);
		}
		// Don't allow LINEAR filtering on integer types, it is not supported.
		if (filter === LINEAR && !(type === FLOAT || type == HALF_FLOAT)) {
			throw new Error(`LINEAR filtering is not supported on integer types, please use NEAREST filtering for DataLayer "${name}" with type: ${type}.`);
		}
		this.filter = filter;

		// Get wrap types, default to clamp to edge.
		const wrapS = params.wrapS !== undefined ? params.wrapS : CLAMP_TO_EDGE;
		if (!isValidWrap(wrapS)) {
			throw new Error(`Invalid wrapS: ${wrapS} for DataLayer "${name}", must be one of [${validWraps.join(', ')}].`);
		}
		this.wrapS = wrapS;
		const wrapT = params.wrapT !== undefined ? params.wrapT : CLAMP_TO_EDGE;
		if (!isValidWrap(wrapT)) {
			throw new Error(`Invalid wrapT: ${wrapT} for DataLayer "${name}", must be one of [${validWraps.join(', ')}].`);
		}
		this.wrapT = wrapT;

		// Set data type.
		if (!isValidDataType(type)) {
			throw new Error(`Invalid type: ${type} for DataLayer "${name}", must be one of [${validDataTypes.join(', ')}].`);
		}
		this.type = type;
		const internalType = DataLayer.getInternalType({
			gl,
			type,
			glslVersion,
			writable,
			name,
			errorCallback,
		});
		this.internalType = internalType;
		// Set gl texture parameters.
		const {
			glFormat,
			glInternalFormat,
			glType,
			glNumChannels,
		} = DataLayer.getGLTextureParameters({
			gl,
			name,
			numComponents,
			writable,
			internalType,
			glslVersion,
			errorCallback,
		});
		this.glInternalFormat = glInternalFormat;
		this.glFormat = glFormat;
		this.glType = glType;
		this.glNumChannels = glNumChannels;

		// Set internal filtering/wrap types.
		this.internalFilter = DataLayer.getInternalFilter({ gl, filter, internalType, name, errorCallback });
		this.glFilter = gl[this.internalFilter];
		this.internalWrapS = DataLayer.getInternalWrap({ gl, wrap: wrapS, name });
		this.glWrapS = gl[this.internalWrapS];
		this.internalWrapT = DataLayer.getInternalWrap({ gl, wrap: wrapT, name });
		this.glWrapT = gl[this.internalWrapT];

		// Num buffers is the number of states to store for this data.
		const numBuffers = params.numBuffers !== undefined ? params.numBuffers : 1;
		if (!isPositiveInteger(numBuffers)) {
			throw new Error(`Invalid numBuffers: ${numBuffers} for DataLayer "${name}", must be positive integer.`);
		}
		this.numBuffers = numBuffers;

		// clearValue defaults to zero.
		// Wait until after type has been set to set clearValue.
		const clearValue = params.clearValue !== undefined ? params.clearValue : 0;
		this.clearValue = clearValue; // Setter can only be called after this.numComponents has been set.

		this.initBuffers(array);
	}

	private static calcSize(size: number | [number, number], name: string) {
		let length, width, height;
		if (!isNaN(size as number)) {
			if (!isPositiveInteger(size)) {
				throw new Error(`Invalid length: ${size} for DataLayer "${name}", must be positive integer.`);
			}
			length = size as number;
			// Calc power of two width and height for length.
			let exp = 1;
			let remainder = length;
			while (remainder > 2) {
				exp++;
				remainder /= 2;
			}
			width = Math.pow(2, Math.floor(exp / 2) + exp % 2);
			height = Math.pow(2, Math.floor(exp/2));
			if (inDevMode()) {
				console.log(`Using [${width}, ${height}] for 1D array of length ${size} in DataLayer "${name}".`);
			}
		} else {
			width = (size as [number, number])[0];
			if (!isPositiveInteger(width)) {
				throw new Error(`Invalid width: ${width} for DataLayer "${name}", must be positive integer.`);
			}
			height = (size as [number, number])[1];
			if (!isPositiveInteger(height)) {
				throw new Error(`Invalid height: ${height} for DataLayer "${name}", must be positive integer.`);
			}
		}
		return { width, height, length };
	}

	private static getInternalWrap(
		params: {
			gl: WebGLRenderingContext | WebGL2RenderingContext,
			wrap: DataLayerWrap,
			name: string,
		},
	) {
		const { gl, wrap, name } = params;
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
			console.warn(`Falling back to CLAMP_TO_EDGE wrapping for DataLayer "${name}" for WebGL 1.`);
			return CLAMP_TO_EDGE;
		}
		return wrap;
	}

	private static getInternalFilter(
		params: {
			gl: WebGLRenderingContext | WebGL2RenderingContext,
			filter: DataLayerFilter,
			internalType: DataLayerType,
			name: string,
			errorCallback: ErrorCallback,
		},
	) {
		const { gl, errorCallback, internalType, name } = params;
		let { filter } = params;
		if (filter === NEAREST) {
			// NEAREST filtering is always supported.
			return filter;
		}

		if (internalType === HALF_FLOAT) {
			// TODO: test if float linear extension is actually working.
			const extension = getExtension(gl, OES_TEXTURE_HAlF_FLOAT_LINEAR, errorCallback, true)
				|| getExtension(gl, OES_TEXTURE_FLOAT_LINEAR, errorCallback, true);
			if (!extension) {
				console.warn(`Falling back to NEAREST filter for DataLayer "${name}".`);
				//TODO: add a fallback that does this filtering in the frag shader?.
				filter = NEAREST;
			}
		} if (internalType === FLOAT) {
			const extension = getExtension(gl, OES_TEXTURE_FLOAT_LINEAR, errorCallback, true);
			if (!extension) {
				console.warn(`Falling back to NEAREST filter for DataLayer "${name}".`);
				//TODO: add a fallback that does this filtering in the frag shader?.
				filter = NEAREST;
			}
		}
		return filter;
	}

	private static getInternalType(
		params: {
			gl: WebGLRenderingContext | WebGL2RenderingContext,
			type: DataLayerType,
			glslVersion: GLSLVersion,
			writable: boolean,
			name: string,
			errorCallback: ErrorCallback,
		},
	) {
		const { gl, errorCallback, writable, name, glslVersion } = params;
		const { type } = params;
		let internalType = type;
		// Check if int types are supported.
		const intCast = DataLayer.shouldCastIntTypeAsFloat(params);
		if (intCast) {
			if (internalType === UNSIGNED_BYTE || internalType === BYTE) {
				// Integers between 0 and 2048 can be exactly represented by half float (and also between −2048 and 0)
				internalType = HALF_FLOAT;
			} else {
				// Integers between 0 and 16777216 can be exactly represented by float32 (also applies for negative integers between −16777216 and 0)
				// This is sufficient for UNSIGNED_SHORT and SHORT types.
				// Large UNSIGNED_INT and INT cannot be represented by FLOAT type.
				console.warn(`Falling back ${internalType} type to FLOAT type for glsl1.x support for DataLayer "${name}".
Large UNSIGNED_INT or INT with absolute value > 16,777,216 are not supported, on mobile UNSIGNED_INT, INT, UNSIGNED_SHORT, and SHORT with absolute value > 2,048 may not be supported.`);
				internalType = FLOAT;
			}
		}
		// Check if float32 supported.
		if (!isWebGL2(gl)) {
			if (internalType === FLOAT) {
				const extension = getExtension(gl, OES_TEXTURE_FLOAT, errorCallback, true);
				if (!extension) {
					console.warn(`FLOAT not supported, falling back to HALF_FLOAT type for DataLayer "${name}".`);
					internalType = HALF_FLOAT;
				}
				// https://stackoverflow.com/questions/17476632/webgl-extension-support-across-browsers
				// Rendering to a floating-point texture may not be supported,
				// even if the OES_texture_float extension is supported.
				// Typically, this fails on current mobile hardware.
				// To check if this is supported, you have to call the WebGL
				// checkFramebufferStatus() function.
				if (writable) {
					const valid = DataLayer.testFramebufferWrite({ gl, type: internalType, glslVersion });
					if (!valid && internalType !== HALF_FLOAT) {
						console.warn(`FLOAT not supported for writing operations, falling back to HALF_FLOAT type for DataLayer "${name}".`);
						internalType = HALF_FLOAT;
					}
				}
			}
			// Must support at least half float if using a float type.
			if (internalType === HALF_FLOAT) {
				getExtension(gl, OES_TEXTURE_HALF_FLOAT, errorCallback);
				// TODO: https://stackoverflow.com/questions/54248633/cannot-create-half-float-oes-texture-from-uint16array-on-ipad
				if (writable) {
					const valid = DataLayer.testFramebufferWrite({ gl, type: internalType, glslVersion });
					if (!valid) {
						errorCallback(`This browser does not support rendering to HALF_FLOAT textures.`);
					}
				}
			}
		}
		
		// Load additional extensions if needed.
		if (writable && isWebGL2(gl) && (internalType === HALF_FLOAT || internalType === FLOAT)) {
			getExtension(gl, EXT_COLOR_BUFFER_FLOAT, errorCallback);
		}
		return internalType;
	}

	private static shouldCastIntTypeAsFloat(
		params: {
			gl: WebGLRenderingContext | WebGL2RenderingContext,
			type: DataLayerType,
			glslVersion: GLSLVersion,
		}
	) {
		const { gl, type, glslVersion } = params;
		// All types are supported by WebGL2 + glsl3.
		if (glslVersion === GLSL3 && isWebGL2(gl)) return false;
		// Int textures (other than UNSIGNED_BYTE) are not supported by WebGL1.0 or glsl1.x.
		// https://stackoverflow.com/questions/55803017/how-to-select-webgl-glsl-sampler-type-from-texture-format-properties
		// Use HALF_FLOAT/FLOAT instead.
		// Some large values of INT and UNSIGNED_INT are not supported unfortunately.
		// See tests for more information.
		return type === BYTE || type === SHORT || type === INT || type === UNSIGNED_SHORT || type === UNSIGNED_INT;
	}

	private static getGLTextureParameters(
		params: {
			gl: WebGLRenderingContext | WebGL2RenderingContext,
			name: string,
			numComponents: DataLayerNumComponents,
			internalType: DataLayerType,
			writable: boolean,
			glslVersion: GLSLVersion,
			errorCallback: ErrorCallback,
		}
	) {
		const { gl, errorCallback, name, numComponents, internalType, writable, glslVersion } = params;
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
						throw new Error(`Unsupported glNumChannels: ${glNumChannels} for DataLayer "${name}".`);
				}
			} else if (glslVersion === GLSL1 && internalType === UNSIGNED_BYTE) {
				switch (glNumChannels) {
					// For read only UNSIGNED_BYTE textures in GLSL 1, use gl.ALPHA and gl.LUMINANCE_ALPHA.
					// Otherwise use RGB/RGBA.
					case 1:
						if (!writable) {
							glFormat = gl.ALPHA;
							break;
						}
						// Purposely falling to next case here.
					case 2:
						if (!writable) {
							glFormat = gl.LUMINANCE_ALPHA;
							break;
						}
						// Purposely falling to next case here.
					case 3:
						glFormat = gl.RGB;
						glNumChannels = 3;
						break;
					case 4:
						glFormat = gl.RGBA;
						glNumChannels = 4;
						break;
					default:
						throw new Error(`Unsupported glNumChannels: ${glNumChannels} for DataLayer "${name}".`);
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
						throw new Error(`Unsupported glNumChannels: ${glNumChannels} for DataLayer "${name}".`);
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
							throw new Error(`Unsupported glNumChannels: ${glNumChannels} for DataLayer "${name}".`);
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
							throw new Error(`Unsupported glNumChannels: ${glNumChannels} for DataLayer "${name}".`);
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
								throw new Error(`Unsupported glNumChannels: ${glNumChannels} for DataLayer "${name}".`);
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
							throw new Error(`Unsupported glNumChannels: ${glNumChannels} for DataLayer "${name}".`);
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
							throw new Error(`Unsupported glNumChannels: ${glNumChannels} for DataLayer "${name}".`);
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
							throw new Error(`Unsupported glNumChannels: ${glNumChannels} for DataLayer "${name}".`);
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
							throw new Error(`Unsupported glNumChannels: ${glNumChannels} for DataLayer "${name}".`);
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
							throw new Error(`Unsupported glNumChannels: ${glNumChannels} for DataLayer "${name}".`);
					}
					break;
				default:
					throw new Error(`Unsupported type: ${internalType} for DataLayer "${name}".`);
			}
		} else {
			switch (numComponents) {
				// For read only textures WebGL 1, use gl.ALPHA and gl.LUMINANCE_ALPHA.
				// Otherwise use RGB/RGBA.
				case 1:
					if (!writable) {
						glFormat = gl.ALPHA;
						// TODO: check these:
						glInternalFormat = gl.ALPHA;
						glNumChannels = 1;
						break;
					}
					// Purposely falling to next case here.
				case 2:
					if (!writable) {
						glFormat = gl.LUMINANCE_ALPHA;
						// TODO: check these:
						glInternalFormat = gl.LUMINANCE_ALPHA;
						glNumChannels = 2;
						break;
					}
					// Purposely falling to next case here.
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
					throw new Error(`Unsupported numComponents: ${numComponents} for DataLayer "${name}".`);
			}
			switch (internalType) {
				case FLOAT:
					glType = gl.FLOAT;
					break;
				case HALF_FLOAT:
					glType = (gl as WebGL2RenderingContext).HALF_FLOAT || getExtension(gl, OES_TEXTURE_HALF_FLOAT, errorCallback).HALF_FLOAT_OES as number;
					break;
				case UNSIGNED_BYTE:
					glType = gl.UNSIGNED_BYTE;
					break;
				// No other types are supported in glsl1.x
				default:
					throw new Error(`Unsupported type: ${internalType} in WebGL 1.0 for DataLayer "${name}".`);
			}
		}

		// Check for missing params.
		if (glType === undefined || glFormat === undefined || glInternalFormat === undefined) {
			const missingParams = [];
			if (glType === undefined) missingParams.push('glType');
			if (glFormat === undefined) missingParams.push('glFormat');
			if (glInternalFormat === undefined) missingParams.push('glInternalFormat');
			throw new Error(`Invalid type: ${internalType} for numComponents: ${numComponents}, unable to init parameter${missingParams.length > 1 ? 's' : ''} ${missingParams.join(', ')} for DataLayer "${name}".`);
		}
		if (glNumChannels === undefined || numComponents < 1 || numComponents > 4 || glNumChannels < numComponents) {
			throw new Error(`Invalid numChannels: ${glNumChannels} for numComponents: ${numComponents} for DataLayer "${name}".`);
		}

		return {
			glFormat,
			glInternalFormat,
			glType,
			glNumChannels,
		};
	}

	private static testFramebufferWrite(
		params: {
			gl: WebGLRenderingContext | WebGL2RenderingContext,
			type: DataLayerType,
			glslVersion: GLSLVersion,
		},
	) {
		const { gl, type, glslVersion } = params;
		const texture = gl.createTexture();
		if (!texture) {
			return false;
		}
		gl.bindTexture(gl.TEXTURE_2D, texture);

		// Default to most widely supported settings.
		const wrapS = gl[CLAMP_TO_EDGE];
		const wrapT = gl[CLAMP_TO_EDGE];
		const filter = gl[NEAREST];
		// Use non-power of two dimensions to check for more universal support.
		// (In case size of DataLayer is changed at a later point).
		const width = 100;
		const height = 100;
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);

		const { glInternalFormat, glFormat, glType } = DataLayer.getGLTextureParameters({
			gl,
			name: 'testFramebufferWrite',
			numComponents: 1,
			writable: true,
			internalType: type,
			glslVersion,
			errorCallback: () => {},
		});
		gl.texImage2D(gl.TEXTURE_2D, 0, glInternalFormat, width, height, 0, glFormat, glType, null);

		// Init a framebuffer for this texture so we can write to it.
		const framebuffer = gl.createFramebuffer();
		if (!framebuffer) {
			// Clear out allocated memory.
			gl.deleteTexture(texture);
			return false;
		}
		gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
		// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/framebufferTexture2D
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

		const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
		const validStatus = status === gl.FRAMEBUFFER_COMPLETE;

		// Clear out allocated memory.
		gl.deleteTexture(texture);
		gl.deleteFramebuffer(framebuffer);

		return validStatus;
	}

	get bufferIndex() {
		return this._bufferIndex;
	}

	saveCurrentStateToDataLayer(layer: DataLayer) {
		// A method for saving a copy of the current state without a draw call.
		// Draw calls are expensive, this optimization helps.
		if (this.numBuffers < 2) {
			throw new Error(`Can't call DataLayer.saveCurrentStateToDataLayer on DataLayer "${this.name}" with less than 2 buffers.`);
		}
		if (!this.writable) {
			throw new Error(`Can't call DataLayer.saveCurrentStateToDataLayer on read-only DataLayer "${this.name}".`);
		}
		if (layer.writable) {
			throw new Error(`Can't call DataLayer.saveCurrentStateToDataLayer on DataLayer "${this.name}" using writable DataLayer "${layer.name}".`)
		}
		// Check that texture params are the same.
		if (layer.glWrapS !== this.glWrapS || layer.glWrapT !== this.glWrapT ||
			layer.wrapS !== this.wrapS || layer.wrapT !== this.wrapT ||
			layer.width !== this.width || layer.height !== this.height ||
			layer.glFilter !== this.glFilter || layer.filter !== this.filter ||
			layer.glNumChannels !== this.glNumChannels || layer.numComponents !== this.numComponents ||
			layer.glType !== this.glType || layer.type !== this.type ||
			layer.glFormat !== this.glFormat || layer.glInternalFormat !== this.glInternalFormat) {
				throw new Error(`Incompatible texture params between DataLayers "${layer.name}" and "${this.name}".`);
		}

		// If we have not already inited overrides array, do so now.
		if (!this.textureOverrides) {
			this.textureOverrides = [];
			for (let i = 0; i < this.numBuffers; i++) {
				this.textureOverrides.push(undefined);
			}
		}

		// Check if we already have an override in place.
		if (this.textureOverrides[this.bufferIndex]) {
			throw new Error(`Can't call DataLayer.saveCurrentStateToDataLayer on DataLayer "${this.name}", this DataLayer has not written new state since last call to DataLayer.saveCurrentStateToDataLayer.`);
		}
		const { currentState } = this;
		this.textureOverrides[this.bufferIndex] = currentState;
		// Swap textures.
		this.buffers[this.bufferIndex].texture = layer.currentState;
		layer._setCurrentStateTexture(currentState);

		// Bind swapped texture to framebuffer.
		const { gl } = this.glcompute;
		const { framebuffer, texture } = this.buffers[this.bufferIndex];
		if (!framebuffer) throw new Error(`No framebuffer for writable DataLayer "${this.name}".`);
		gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
		// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/framebufferTexture2D
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
		// Unbind.
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	}

	// This is used internally.
	_setCurrentStateTexture(texture: WebGLTexture) {
		if (this.writable) {
			throw new Error(`Can't call DataLayer._setCurrentStateTexture on writable texture "${this.name}".`);
		}
		this.buffers[this.bufferIndex].texture = texture;
	}

	private static initArrayForInternalType(internalType: DataLayerType, length: number) {
		switch (internalType) {
			case HALF_FLOAT:
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
				throw new Error(`Unsupported internalType: ${internalType}.`);
		}
	}

	private validateDataArray(array: DataLayerArray | number[]) {
		const { numComponents, glNumChannels, type, internalType, width, height } = this;
		const length = this._length;

		// Check that data is correct length (user error).
		if (array.length !== width * height * numComponents) { // Either the correct length for WebGLTexture size
			if (!length || (length &&  array.length !== length * numComponents)) { // Of the correct length for 1D array.
				throw new Error(`Invalid data length: ${array.length} for DataLayer "${this.name}" of ${length ? `length ${length} and ` : ''}dimensions: [${width}, ${height}] and numComponents: ${numComponents}.`);
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
				shouldTypeCast = internalType !== UNSIGNED_SHORT;
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
				throw new Error(`Invalid array type: ${array.constructor.name} for DataLayer "${this.name}", please use one of [${validArrayTypes.map(constructor => constructor.name).join(', ')}].`);
		}

		const imageSize = width * height * glNumChannels;
		// Then check if array needs to be lengthened.
		// This could be because glNumChannels !== numComponents.
		// Or because length !== width * height.
		const incorrectSize = array.length !== imageSize;
		// We have to handle the case of Float16 specially by converting data to Uint16Array.
		const handleFloat16 = internalType === HALF_FLOAT;
		
		let validatedArray = array as DataLayerArray;
		if (shouldTypeCast || incorrectSize || handleFloat16) {
			validatedArray = DataLayer.initArrayForInternalType(internalType, imageSize);
			// Fill new data array with old data.
			const view = handleFloat16 ? new DataView(validatedArray.buffer) : null;
			for (let i = 0, _len = array.length / numComponents; i < _len; i++) {
				for (let j = 0; j < numComponents; j++) {
					const value = array[i * numComponents + j];
					const index = i * glNumChannels + j;
					if (handleFloat16) {
						setFloat16(view!, 2 * index, value, true);
					} else {
						validatedArray[index] = value;
					}
				}
			}
		}

		return validatedArray;
	}

	private initBuffers(
		array?: DataLayerArray | number[],
	) {
		const {
			name,
			numBuffers,
			glcompute,
			glInternalFormat,
			glFormat,
			glType,
			glFilter,
			glWrapS,
			glWrapT,
			writable,
			width,
			height,
		} = this;
		const { gl, errorCallback } = glcompute;

		const validatedArray = array ? this.validateDataArray(array) : undefined;

		// Init a texture for each buffer.
		for (let i = 0; i < numBuffers; i++) {
			const texture = gl.createTexture();
			if (!texture) {
				errorCallback(`Could not init texture for DataLayer "${name}": ${gl.getError()}.`);
				return;
			}
			gl.bindTexture(gl.TEXTURE_2D, texture);

			// TODO: are there other params to look into:
			// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, glWrapS);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, glWrapT);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, glFilter);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, glFilter);

			gl.texImage2D(gl.TEXTURE_2D, 0, glInternalFormat, width, height, 0, glFormat, glType, validatedArray ? validatedArray : null);
			
			const buffer: DataLayerBuffer = {
				texture,
			};

			if (writable) {
				// Init a framebuffer for this texture so we can write to it.
				const framebuffer = gl.createFramebuffer();
				if (!framebuffer) {
					errorCallback(`Could not init framebuffer for DataLayer "${name}": ${gl.getError()}.`);
					return;
				}
				gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
				// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/framebufferTexture2D
				gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

				const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
				if(status != gl.FRAMEBUFFER_COMPLETE){
					errorCallback(`Invalid status for framebuffer for DataLayer "${name}": ${status}.`);
				}

				// Add framebuffer.
				buffer.framebuffer = framebuffer;
			}
			
			// Save this buffer to the list.
			this.buffers.push(buffer);
		}
		// Unbind.
		gl.bindTexture(gl.TEXTURE_2D, null);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	}

	getStateAtIndex(index: number) {
		if (index < 0 || index >= this.numBuffers) {
			throw new Error(`Invalid buffer index: ${index} for DataLayer "${this.name}" with ${this.numBuffers} buffer${this.numBuffers > 1 ? 's' : ''}.`)
		}
		if (this.textureOverrides && this.textureOverrides[index]) return this.textureOverrides[index]!;
		return this.buffers[index].texture;
	}

	get currentState() {
		return this.getStateAtIndex(this.bufferIndex);
	}

	get lastState() {
		if (this.numBuffers === 1) {
			throw new Error(`Cannot access lastState on DataLayer "${this.name}" with only one buffer.`);
		}
		return this.getStateAtIndex((this.bufferIndex - 1 + this.numBuffers) % this.numBuffers);
	}

	// This is used internally.
	_usingTextureOverrideForCurrentBuffer() {
		return this.textureOverrides && this.textureOverrides[this.bufferIndex];
	}

	// This is used internally.
	_bindOutputBufferForWrite(
		incrementBufferIndex: boolean,
	) {
		if (incrementBufferIndex) {
			// Increment bufferIndex.
			this._bufferIndex = (this.bufferIndex + 1) % this.numBuffers;
		}
		this._bindOutputBuffer();

		// We are going to do a data write, if we have overrides enabled, we can remove them.
		if (this.textureOverrides) {
			this.textureOverrides[this.bufferIndex] = undefined;
		}
	}

	// This is used internally.
	_bindOutputBuffer() {
		const { gl } = this.glcompute;
		const { framebuffer } = this.buffers[this.bufferIndex];
		if (!framebuffer) {
			throw new Error(`DataLayer "${this.name}" is not writable.`);
		}
		gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
	}

	setFromArray(array: DataLayerArray | number[], applyToAllBuffers = false) {
		const { glcompute, glInternalFormat, glFormat, glType, numBuffers, width, height, bufferIndex } = this;
		const { gl } = glcompute;
		const validatedArray = this.validateDataArray(array);
		// TODO: check that this is working.
		const startIndex = applyToAllBuffers ? 0 : bufferIndex;
		const endIndex = applyToAllBuffers ? numBuffers : bufferIndex + 1;
		for (let i = startIndex; i < endIndex; i++) {
			const texture = this.getStateAtIndex(i);
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, glInternalFormat, width, height, 0, glFormat, glType, validatedArray);
		}
		// Unbind texture.
		gl.bindTexture(gl.TEXTURE_2D, null);
	}

	resize(
		dimensions: number | [number, number],
		array?: DataLayerArray | number[],
	) {
		const { name, glcompute } = this;
		const { verboseLogging } = glcompute;
		if (verboseLogging) console.log(`Resizing DataLayer "${name}" to ${JSON.stringify(dimensions)}.`);
		const { length, width, height } = DataLayer.calcSize(dimensions, name);
		this._length = length;
		this._width = width;
		this._height = height;
		this.destroyBuffers();
		this.initBuffers(array);
	}

	get clearValue() {
		return this._clearValue;
	}

	set clearValue(clearValue: number | number[]) {
		const { numComponents, type } = this;
		if (!isValidClearValue(clearValue, numComponents, type)) {
			throw new Error(`Invalid clearValue: ${JSON.stringify(clearValue)} for DataLayer "${this.name}", expected ${type} or array of ${type} of length ${numComponents}.`);
		}
		this._clearValue = clearValue;
	}

	clear(applyToAllBuffers = false) {
		const { name, glcompute, clearValue, numBuffers, bufferIndex, type } = this;
		const { verboseLogging } = glcompute;
		if (verboseLogging) console.log(`Clearing DataLayer "${name}".`);

		const value: number[] = [];
		if (isNumber(clearValue)) {
			value.push(clearValue as number, clearValue as number, clearValue as number, clearValue as number);
		} else {
			value.push(...clearValue as number[]);
			for (let j = value.length; j < 4; j++) {
				value.push(0);
			}
		}
	
		const startIndex = applyToAllBuffers ? 0 : bufferIndex;
		const endIndex = applyToAllBuffers ? numBuffers : bufferIndex + 1;
		if (this.writable) {
			const program = glcompute.setValueProgramForType(type);
			program.setUniform('u_value', value as [number, number, number, number]);
			for (let i = startIndex; i < endIndex; i++) {
				// Write clear value to buffers.
				glcompute.step({
					program,
					output: this,
				});
			}
		} else {
			// Init a typed array containing clearValue and pass to buffers.
			const {
				width, height, glNumChannels, internalType,
				glInternalFormat, glFormat, glType,
			} = this;
			const { gl } = glcompute;
			const fillLength = this._length ? this._length : width * height;
			const array = DataLayer.initArrayForInternalType(internalType, width * height * glNumChannels);
			const float16View = internalType === HALF_FLOAT ? new DataView(array.buffer) : null;
			for (let j = 0; j < fillLength; j++) {
				for (let k = 0; k < glNumChannels; k++) {
					const index = j * glNumChannels + k;
					if (internalType === HALF_FLOAT) {
						// Float16s need to be handled separately.
						setFloat16(float16View!, 2 * index, value[k], true);
					} else {
						array[index] = value[k];
					}
				}
			}
			for (let i = startIndex; i < endIndex; i++) {
				const texture = this.getStateAtIndex(i);
				gl.bindTexture(gl.TEXTURE_2D, texture);
				gl.texImage2D(gl.TEXTURE_2D, 0, glInternalFormat, width, height, 0, glFormat, glType, array);
			}
			// Unbind texture.
			gl.bindTexture(gl.TEXTURE_2D, null);
		}
	}

	get width() {
		return this._width;
	}

	get height() {
		return this._height;
	}

	get length() {
		if (!this._length) {
			throw new Error(`Cannot access length on 2D DataLayer "${this.name}".`);
		}
		return this._length;
	}

	private destroyBuffers() {
		const { glcompute, buffers } = this;
		const { gl } = glcompute;
		buffers.forEach(buffer => {
			const { framebuffer, texture } = buffer;
			gl.deleteTexture(texture);
			if (framebuffer) {
				gl.deleteFramebuffer(framebuffer);
			}
			// @ts-ignore
			delete buffer.texture;
			delete buffer.framebuffer;
		});
		buffers.length = 0;

		// These are technically owned by another DataLayer,
		// so we are not responsible for deleting them from gl context.
		delete this.textureOverrides;
	}

	dispose() {
		const { name, glcompute } = this;
		const { verboseLogging } = glcompute;
		if (verboseLogging) console.log(`Deallocating DataLayer "${name}".`);
	
		this.destroyBuffers();
		// @ts-ignore
		delete this.glcompute;
	}

	clone() {
		// Make a deep copy.
		return this.glcompute.cloneDataLayer(this);
	}
}
