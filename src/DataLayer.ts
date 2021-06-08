import { setFloat16 } from '@petamoriken/float16';
import { isPositiveInteger, isValidDataType, isValidFilterType } from './Checks';
import {
	HALF_FLOAT, FLOAT, UNSIGNED_BYTE, BYTE, UNSIGNED_SHORT, SHORT, UNSIGNED_INT, INT,
	NEAREST, LINEAR, CLAMP_TO_EDGE, REPEAT, MIRRORED_REPEAT,
	DataLayerArrayType, DataLayerFilterType, DataLayerNumComponents, DataLayerType, DataLayerWrapType, GLSLVersion, GLSL3, GLSL1,
 } from './Constants';
import {
	getExtension,
	EXT_COLOR_BUFFER_FLOAT,
	OES_TEXTURE_FLOAT,
	OES_TEXTURE_FLOAT_LINEAR,
	OES_TEXTURE_HALF_FLOAT,
	OES_TEXTURE_HAlF_FLOAT_LINEAR,
} from './extensions';
import { isWebGL2 } from './utils';

export type DataLayerBuffer = {
	texture: WebGLTexture,
	framebuffer?: WebGLFramebuffer,
}

type ErrorCallback = (message: string) => void;

export class DataLayer {
	readonly name: string;
	private readonly gl: WebGLRenderingContext | WebGL2RenderingContext;
	private readonly errorCallback: ErrorCallback;

	// Each DataLayer may contain a number of buffers to store different instances of the state.
	private bufferIndex = 0;
	readonly numBuffers;
	private readonly buffers: DataLayerBuffer[] = [];

	// Texture sizes.
	private length?: number; // This is only used for 1D data layers.
	private width: number;
	private height: number;

	// DataLayer settings.
	readonly type: DataLayerType; // Input type passed in during setup.
	readonly internalType: DataLayerType; // Type that corresponds to glType, may be different from type.
	readonly numComponents: DataLayerNumComponents; // Number of RGBA channels to use for this DataLayer.
	readonly filter: DataLayerFilterType; // Interpolation filter type of data.
	readonly writable: boolean;

	// GL variables (these may be different from their corresponding non-gl parameters).
	readonly glInternalFormat: number;
	readonly glFormat: number;
	readonly glType: number;
	readonly glNumChannels: number;
	readonly glFilter: number;
	readonly glWrapS: number;
	readonly glWrapT: number;

	constructor(
		params: {
			gl: WebGLRenderingContext | WebGL2RenderingContext,
			name: string,
			dimensions: number | [number, number],
			type: DataLayerType,
			numComponents: DataLayerNumComponents,
			glslVersion: GLSLVersion,
			data?: DataLayerArrayType,
			filter?: DataLayerFilterType,
			wrapS?: DataLayerWrapType,
			wrapT?: DataLayerWrapType,
			writable?: boolean,
			numBuffers?: number,
			errorCallback: ErrorCallback,
		},
	) {
		const { gl, errorCallback, name, dimensions, type, numComponents, data, glslVersion } = params;

		// Save params.
		this.name = name;
		this.gl = gl;
		this.errorCallback = errorCallback;

		// numComponents must be between 1 and 4.
		if (!isPositiveInteger(numComponents) || numComponents > 4) {
			throw new Error(`Invalid numComponents ${numComponents} for DataLayer "${name}".`);
		}
		this.numComponents = numComponents;

		// writable defaults to false.
		const writable = !!params.writable;
		this.writable = writable;

		// Set data type.
		if (!isValidDataType(type)) {
			const validTypes = [HALF_FLOAT, FLOAT, UNSIGNED_BYTE, BYTE, UNSIGNED_SHORT, SHORT, UNSIGNED_INT, INT];
			throw new Error(`Invalid type ${type} for DataLayer "${name}", must be one of ${validTypes.join(', ')}.`);
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
		const {
			glFormat,
			glInternalFormat,
			glType,
			glNumChannels,

		// Set gl texture parameters.
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

		// Set dimensions, may be 1D or 2D.
		const { length, width, height } = DataLayer.calcSize(dimensions, name);
		this.length = length;
		if (!isPositiveInteger(width)) {
			throw new Error(`Invalid width ${width} for DataLayer "${name}".`);
		}
		this.width = width;
		if (!isPositiveInteger(height)) {
			throw new Error(`Invalid length ${height} for DataLayer "${name}".`);
		}
		this.height = height;

		// Set filtering - if we are processing a 1D array, default to NEAREST filtering.
		// Else default to LINEAR (interpolation) filtering.
		const filter = params.filter !== undefined ? params.filter : (length ? NEAREST : LINEAR);
		if (!isValidFilterType(filter)) {
			throw new Error(`Invalid filter: ${filter} for DataLayer "${name}", must be ${LINEAR} or ${NEAREST}.`);
		}
		this.filter = filter;
		this.glFilter = DataLayer.getGLFilter({ gl, filter, internalType, name, errorCallback });

		// Get wrap types, default to clamp to edge.
		const wrapS = params.wrapS !== undefined ? params.wrapS : CLAMP_TO_EDGE;
		this.glWrapS = DataLayer.getGLWrap({ gl, wrap: wrapS, internalType, name });
		const wrapT = params.wrapT !== undefined ? params.wrapT : CLAMP_TO_EDGE;
		this.glWrapT = DataLayer.getGLWrap({ gl, wrap: wrapT, internalType, name });

		// Num buffers is the number of states to store for this data.
		const numBuffers = params.numBuffers !== undefined ? params.numBuffers : 1;
		if (!isPositiveInteger(numBuffers)) {
			throw new Error(`Invalid numBuffers: ${numBuffers} for DataLayer "${name}", must be positive integer.`);
		}
		this.numBuffers = numBuffers;

		this.initBuffers(data);
	}

	private static calcSize(dimensions: number | [number, number], name: string) {
		let length, width, height;
		if (!isNaN(dimensions as number)) {
			if (!isPositiveInteger(dimensions)) {
				throw new Error(`Invalid length ${dimensions} for DataLayer "${name}".`);
			}
			length = dimensions as number;
			// Calc power of two width and height for length.
			let exp = 1;
			let remainder = length;
			while (remainder > 2) {
				exp++;
				remainder /= 2;
			}
			width = Math.pow(2, Math.floor(exp / 2) + exp % 2);
			height = Math.pow(2, Math.floor(exp/2));
		} else {
			width = (dimensions as [number, number])[0];
			if (!isPositiveInteger(width)) {
				throw new Error(`Invalid width ${width} for DataLayer "${name}".`);
			}
			height = (dimensions as [number, number])[1];
			if (!isPositiveInteger(height)) {
				throw new Error(`Invalid height ${height} for DataLayer "${name}".`);
			}
		}
		return { width, height, length };
	}

	private static getGLWrap(
		params: {
			gl: WebGLRenderingContext | WebGL2RenderingContext,
			wrap: DataLayerWrapType,
			internalType: DataLayerType,
			name: string,
		},
	) {
		const { gl, wrap, internalType, name } = params;
		// Webgl2.0 supports all combinations of types and filtering.
		if (isWebGL2(gl)) {
			return gl[wrap];
		}
		// CLAMP_TO_EDGE is always supported.
		if (wrap === CLAMP_TO_EDGE) {
			return gl[wrap];
		}
		if (internalType === FLOAT || internalType === HALF_FLOAT) {
			// TODO: we may want to handle this in the frag shader.
			// REPEAT and MIRROR_REPEAT wrap not supported for non-power of 2 float textures in safari.
			// I've tested this and it seems that some power of 2 textures will work (512 x 512),
			// but not others (1024x1024), so let's just change all WebGL 1.0 to CLAMP.
			// TODO: test for this more thoroughly.
			// Without this, we currently get an error at drawArrays():
            // WebGL: drawArrays: texture bound to texture unit 0 is not renderable.
            // It maybe non-power-of-2 and have incompatible texture filtering or is not
            // 'texture complete', or it is a float/half-float type with linear filtering and
            // without the relevant float/half-float linear extension enabled.
			console.warn(`Falling back to CLAMP_TO_EDGE wrapping for DataLayer "${name}".`);
			return gl[CLAMP_TO_EDGE];
		}
		return gl[wrap];
	}

	private static getGLFilter(
		params: {
			gl: WebGLRenderingContext | WebGL2RenderingContext,
			filter: DataLayerFilterType,
			internalType: DataLayerType,
			name: string,
			errorCallback: ErrorCallback,
		},
	) {
		const { gl, errorCallback, internalType, name } = params;
		let { filter } = params;
		if (filter === NEAREST) {
			// NEAREST filtering is always supported.
			return gl[filter];
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
		return gl[filter];
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
		let { type } = params;
		// Check if int types are supported.
		if (DataLayer.shouldCastIntTypeAsFloat(params)) {
			// TODO: HALF_FLOAT would be sufficient for some of these int types.
			// console.warn(`Falling back ${type} type to FLOAT type for glsl1.x support for DataLayer "${name}".`);
			type = FLOAT;
		}
		// Check if float32 supported.
		if (!isWebGL2(gl)) {
			if (type === FLOAT) {
				const extension = getExtension(gl, OES_TEXTURE_FLOAT, errorCallback, true);
				if (!extension) {
					console.warn(`FLOAT not supported, falling back to HALF_FLOAT type for DataLayer "${name}".`);
					type = HALF_FLOAT;
				}
				// https://stackoverflow.com/questions/17476632/webgl-extension-support-across-browsers
				// Rendering to a floating-point texture may not be supported,
				// even if the OES_texture_float extension is supported.
				// Typically, this fails on current mobile hardware.
				// To check if this is supported, you have to call the WebGL
				// checkFramebufferStatus() function.
				if (writable) {
					const valid = DataLayer.testFramebufferWrite({ gl, type, glslVersion });
					if (!valid && type !== HALF_FLOAT) {
						console.warn(`FLOAT not supported for writing operations, falling back to HALF_FLOAT type for DataLayer "${name}".`);
						type = HALF_FLOAT;
					}
				}
			}
			// Must support at least half float if using a float type.
			if (type === HALF_FLOAT) {
				getExtension(gl, OES_TEXTURE_HALF_FLOAT, errorCallback);
				// TODO: https://stackoverflow.com/questions/54248633/cannot-create-half-float-oes-texture-from-uint16array-on-ipad
				if (writable) {
					const valid = DataLayer.testFramebufferWrite({ gl, type, glslVersion });
					if (!valid) {
						errorCallback(`This browser does not support rendering to HALF_FLOAT textures.`);
					}
				}
			}
		}
		
		// Load additional extensions if needed.
		if (writable && isWebGL2(gl) && (type === HALF_FLOAT || type === FLOAT)) {
			getExtension(gl, EXT_COLOR_BUFFER_FLOAT, errorCallback);
		}
		return type;
	}

	private static shouldCastIntTypeAsFloat(
		params: {
			gl: WebGLRenderingContext | WebGL2RenderingContext,
			type: DataLayerType,
			glslVersion: GLSLVersion,
		}
	) {
		const { gl, type, glslVersion } = params;
		if (glslVersion === GLSL3 && isWebGL2(gl)) return false;
		// Int textures (other than UNSIGNED_BYTE) are not supported by WebGL1.0 or glsl1.x.
		// https://stackoverflow.com/questions/55803017/how-to-select-webgl-glsl-sampler-type-from-texture-format-properties
		// Use float instead.
		// TODO: could use half float for some of these.
		// TODO: warn that this is happening, what are the precision limits?
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
						throw new Error(`Unsupported glNumChannels ${glNumChannels} for DataLayer "${name}".`);
				}
			} else if (glslVersion === GLSL1 && internalType === UNSIGNED_BYTE) {
				switch (glNumChannels) {
					// TODO: for read only textures in WebGL 1.0, we could use gl.ALPHA and gl.LUMINANCE_ALPHA here.
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
						throw new Error(`Unsupported glNumChannels ${glNumChannels} for DataLayer "${name}".`);
				}
			} else {
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
						throw new Error(`Unsupported glNumChannels ${glNumChannels} for DataLayer "${name}".`);
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
							throw new Error(`Unsupported glNumChannels ${glNumChannels} for DataLayer "${name}".`);
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
							throw new Error(`Unsupported glNumChannels ${glNumChannels} for DataLayer "${name}".`);
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
								throw new Error(`Unsupported glNumChannels ${glNumChannels} for DataLayer "${name}".`);
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
							throw new Error(`Unsupported glNumChannels ${glNumChannels} for DataLayer "${name}".`);
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
							throw new Error(`Unsupported glNumChannels ${glNumChannels} for DataLayer "${name}".`);
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
							throw new Error(`Unsupported glNumChannels ${glNumChannels} for DataLayer "${name}".`);
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
							throw new Error(`Unsupported glNumChannels ${glNumChannels} for DataLayer "${name}".`);
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
							throw new Error(`Unsupported glNumChannels ${glNumChannels} for DataLayer "${name}".`);
					}
					break;
				default:
					throw new Error(`Unsupported type ${internalType} for DataLayer "${name}".`);
			}
		} else {
			switch (numComponents) {
				// TODO: for read only textures in WebGL 1.0, we could use gl.ALPHA and gl.LUMINANCE_ALPHA here.
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
					throw new Error(`Unsupported numComponents ${numComponents} for DataLayer "${name}".`);
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
					throw new Error(`Unsupported type ${internalType} in WebGL 1.0 for DataLayer "${name}".`);
			}
		}

		// Check for missing params.
		if (glType === undefined || glFormat === undefined || glInternalFormat === undefined) {
			const missingParams = [];
			if (glType === undefined) missingParams.push('glType');
			if (glFormat === undefined) missingParams.push('glFormat');
			if (glInternalFormat === undefined) missingParams.push('glInternalFormat');
			throw new Error(`Invalid type: ${internalType} for numComponents ${numComponents}, unable to init parameter${missingParams.length > 1 ? 's' : ''} ${missingParams.join(', ')} for DataLayer "${name}".`);
		}
		if (glNumChannels === undefined || numComponents < 1 || numComponents > 4 || glNumChannels < numComponents) {
			throw new Error(`Invalid numChannels ${glNumChannels} for numComponents ${numComponents} for DataLayer "${name}".`);
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

	private validateDataArray(
		gl: WebGLRenderingContext | WebGL2RenderingContext,
		_data?: DataLayerArrayType,
	) {
		if (!_data){
			return;
		}
		const { width, height, length, numComponents, glNumChannels, type, internalType, name } = this;

		// Check that data is correct length (user error).
		if ((length && _data.length !== length * numComponents) || (!length && _data.length !== width * height * numComponents)) {
			throw new Error(`Invalid data length ${_data.length} for DataLayer "${name}" of size ${length ? length : `${width}x${height}`}x${numComponents}.`);
		}

		// Check that data is correct type (user error).
		let invalidTypeFound = false;
		switch (type) {
			case HALF_FLOAT:
				// Since there is no Float16Array, we must us Float32Arrays to init texture.
			case FLOAT:
				invalidTypeFound = invalidTypeFound || _data.constructor !== Float32Array;
				break;
			case UNSIGNED_BYTE:
				invalidTypeFound = invalidTypeFound || _data.constructor !== Uint8Array;
				break;
			case BYTE:
				invalidTypeFound = invalidTypeFound || _data.constructor !== Int8Array;
				break;
			case UNSIGNED_SHORT:
				invalidTypeFound = invalidTypeFound || _data.constructor !== Uint16Array;
				break;
			case SHORT:
				invalidTypeFound = invalidTypeFound || _data.constructor !== Int16Array;
				break;
			case UNSIGNED_INT:
				invalidTypeFound = invalidTypeFound || _data.constructor !== Uint32Array;
				break;
			case INT:
				invalidTypeFound = invalidTypeFound || _data.constructor !== Int32Array;
				break;
			default:
				throw new Error(`Error initing DataLayer "${name}".  Unsupported type "${type}" for GLCompute.initDataLayer.`);
		}
		if (invalidTypeFound) {
			throw new Error(`Invalid TypedArray of type ${(_data.constructor as any).name} supplied to DataLayer "${name}" of type "${type}".`);
		}

		let data = _data;
		const imageSize = width * height * glNumChannels;
		// Then check if array needs to be lengthened.
		// This could be because glNumChannels !== numComponents.
		// Or because length !== width * height.
		const incorrectSize = data.length < imageSize;
		// We have to handle the case of Float16 specially by converting data to Uint16Array.
		const handleFloat16 = internalType === HALF_FLOAT;
		// For webgl1.0 we may need to cast an int type to a FLOAT or HALF_FLOAT.
		const shouldTypeCast = type !== internalType;

		if (shouldTypeCast || incorrectSize || handleFloat16) {
			switch (internalType) {
				case FLOAT:
					data = new Float32Array(imageSize);
					break;
				case HALF_FLOAT:
					data = new Uint16Array(imageSize);
					break;
				case UNSIGNED_BYTE:
					data = new Uint8Array(imageSize);
					break;
				case BYTE:
					data = new Int8Array(imageSize);
					break;
				case UNSIGNED_SHORT:
					data = new Uint16Array(imageSize);
					break;
				case SHORT:
					data = new Int16Array(imageSize);
					break;
				case UNSIGNED_INT:
					data = new Uint32Array(imageSize);
					break;
				case INT:
					data = new Int32Array(imageSize);
					break;
			default:
					throw new Error(`Error initing ${name}.  Unsupported internalType ${internalType} for GLCompute.initDataLayer.`);
			}
			// Fill new data array with old data.
			const view = handleFloat16 ? new DataView(data.buffer) : null;
			for (let i = 0, _len = _data.length / numComponents; i < _len; i++) {
				for (let j = 0; j < numComponents; j++) {
					if (handleFloat16) {
						setFloat16(view!, 2 * (i * glNumChannels + j), _data[i * numComponents + j], true);
					} else {
						data[i * glNumChannels + j] = _data[i * numComponents + j];
					}
				}
			}
		}

		return data;
	}

	private initBuffers(
		_data?: DataLayerArrayType,
	) {
		const {
			name,
			numBuffers,
			gl,
			width,
			height,
			glInternalFormat,
			glFormat,
			glType,
			glFilter,
			glWrapS,
			glWrapT,
			writable,
			errorCallback,
		} = this;

		const data = this.validateDataArray(gl, _data);

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

			gl.texImage2D(gl.TEXTURE_2D, 0, glInternalFormat, width, height, 0, glFormat, glType, data ? data : null);
			
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
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	}

	getCurrentStateTexture() {
		return this.buffers[this.bufferIndex].texture;
	}

	getPreviousStateTexture(index = -1) {
		if (this.numBuffers === 1) {
			throw new Error(`Cannot call getPreviousStateTexture on DataLayer "${this.name}" with only one buffer.`);
		}
		const previousIndex = this.bufferIndex + index + this.numBuffers;
		if (previousIndex < 0 || previousIndex >= this.numBuffers) {
			throw new Error(`Invalid index ${index} passed to getPreviousStateTexture on DataLayer ${this.name} with ${this.numBuffers} buffers.`);
		}
		return this.buffers[previousIndex].texture;
	}

	bindOutputBuffer(
		incrementBufferIndex: boolean,
	) {
		const { gl } = this;
		if (incrementBufferIndex) {
			// Increment bufferIndex.
			this.bufferIndex = (this.bufferIndex + 1) % this.numBuffers;
		}
		const { framebuffer } = this.buffers[this.bufferIndex];
		if (!framebuffer) {
			throw new Error(`DataLayer "${this.name}" is not writable.`);
		}
		gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
	}

	resize(
		dimensions: number | [number, number],
		data?: DataLayerArrayType,
	) {
		const { length, width, height } = DataLayer.calcSize(dimensions, this.name);
		this.length = length;
		this.width = width;
		this.height = height;
		this.destroyBuffers();
		this.initBuffers(data);
	}

	clear() {
		// Reset everything to zero.
		// TODO: This is not the most efficient way to do this (reallocating all textures and framebuffers), but ok for now.
		this.destroyBuffers();
		this.initBuffers();
	}

	getDimensions() {
		return [
			this.width,
			this.height,
		] as [number, number];
	}

	getTextures() {
		return this.buffers.map(buffer => buffer.texture);
	}

	getLength() {
		if (!this.length) {
			throw new Error(`Cannot call getLength() on 2D DataLayer "${this.name}".`);
		}
		return this.length;
	}

	private destroyBuffers() {
		const { gl, buffers } = this;
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
	}

	destroy() {
		this.destroyBuffers();
		// @ts-ignore
		delete this.gl;
		// @ts-ignore
		delete this.errorCallback;
	}
}
