import { setFloat16 } from '@petamoriken/float16';
import {
	getExtension,
	EXT_COLOR_BUFFER_FLOAT,
	OES_TEXTURE_FLOAT,
	OES_TEXTURE_FLOAT_LINEAR,
	OES_TEXTURE_HALF_FLOAT,
	OES_TEXTURE_HAlF_FLOAT_LINEAR,
	WEBGL_DEPTH_TEXTURE,
} from './extensions';
import { isWebGL2 } from './utils';

export type DataLayerArrayType =  Float32Array | Uint8Array | Int8Array | Uint16Array | Int16Array | Uint32Array | Int32Array;
export type DataLayerType = 'float32' | 'float16' | 'uint8' | 'int8' | 'uint16' | 'int16' | 'uint32' | 'int32';
export type DataLayerNumComponents = 1 | 2 | 3 | 4;
export type DataLayerFilterType = 'LINEAR' | 'NEAREST';
export type DataLayerWrapType = 'REPEAT' | 'CLAMP_TO_EDGE' | 'MIRRORED_REPEAT';

export type DataLayerBuffer = {
	texture: WebGLTexture,
	framebuffer?: WebGLFramebuffer,
}

type ErrorCallback = (message: string) => void;

export class DataLayer {
	readonly name: string;
	private readonly gl: WebGLRenderingContext | WebGL2RenderingContext;
	private readonly errorCallback: ErrorCallback;
	private bufferIndex = 0;
	readonly numBuffers;
	private readonly buffers: DataLayerBuffer[] = [];
	private length?: number; // This is only used for 1D data layers.
	private width: number;
	private height: number;
	readonly type: DataLayerType;
	readonly numComponents: DataLayerNumComponents;
	private readonly glInternalFormat: number;
	readonly glFormat: number;
	readonly glType: number;
	readonly glNumChannels: number;
	readonly filter: number;
	readonly wrapS: number;
	readonly wrapT: number;
	readonly writable: boolean;

	constructor(
		name: string,
		gl: WebGLRenderingContext | WebGL2RenderingContext,
		options: {
			dimensions: number | [number, number],
			type: DataLayerType,
			numComponents: DataLayerNumComponents,
			data?: DataLayerArrayType,
			filter?: DataLayerFilterType,
			wrapS?: DataLayerWrapType,
			wrapT?: DataLayerWrapType,
		},
		errorCallback: ErrorCallback,
		writable: boolean,
		numBuffers: number,
	) {
		// Save params.
		this.name = name;
		this.gl = gl;
		this.errorCallback = errorCallback;
		if (numBuffers < 0 || numBuffers % 1 !== 0) {
			throw new Error(`Invalid numBuffers: ${numBuffers} for DataLayer "${this.name}", must be positive integer.`);
		}
		this.numBuffers = numBuffers;
		// Save options.
		if (!isNaN(options.dimensions as number)) {
			if (options.dimensions < 1) {
				throw new Error(`Invalid length ${options.dimensions} for DataLayer "${name}".`);
			}
			this.length = options.dimensions as number;
			const [width, height] = this.calcWidthHeight(options.dimensions as number);
			this.width = width;
			this.height = height;
		} else {
			this.width = (options.dimensions as [number, number])[0];
			this.height = (options.dimensions as [number, number])[1];
		}
		
		this.numComponents = options.numComponents;
		this.writable = writable;
		// Check that gl will support the datatype.
		this.type = DataLayer.checkType(this.gl, options.type, this.writable, this.errorCallback);
		// Get current filter setting.
		// If we are processing a 1D array, default to nearest filtering.
		// Else default to linear filtering.
		const filter = options.filter ? options.filter : (this.length ? 'NEAREST' : 'LINEAR');
		this.filter = gl[DataLayer.checkFilter(this.gl, filter, this.type, this.errorCallback)];
		this.wrapS = gl[DataLayer.checkWrap(this.gl, options.wrapS ? options.wrapS : 'CLAMP_TO_EDGE', this.type)];
		this.wrapT = gl[DataLayer.checkWrap(this.gl, options.wrapT ? options.wrapT : 'CLAMP_TO_EDGE', this.type)];

		const {
			glFormat,
			glInternalFormat,
			glType,
			glNumChannels,
		} = DataLayer.getGLTextureParameters(this.gl, this.name, {
			numComponents: this.numComponents,
			writable: this.writable,
			type: this.type,
		}, this.errorCallback);
		this.glInternalFormat = glInternalFormat;
		this.glFormat = glFormat;
		this.glType = glType;
		this.glNumChannels = glNumChannels;

		this.initBuffers(options.data);
	}

	private calcWidthHeight(length: number) {
		// Calc power of two width and height for length.
		let exp = 1;
		let remainder = length;
		while (remainder > 2) {
			exp++;
			remainder /= 2;
		}
		return [
			Math.pow(2, Math.floor(exp / 2) + exp % 2),
			Math.pow(2, Math.floor(exp/2)),
		];
	}

	private static checkWrap(
		gl: WebGLRenderingContext | WebGL2RenderingContext,
		wrap: DataLayerWrapType,
		type: DataLayerType,
	) {
		if (isWebGL2(gl)) {
			return wrap;
		}
		if (wrap === 'CLAMP_TO_EDGE') {
			return wrap;
		}
		if (type === 'float32' || type === 'float16') {
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
			console.warn('Falling back to CLAMP_TO_EDGE wrapping.');
			return 'CLAMP_TO_EDGE';
		}
		return wrap;
	}

	private static checkFilter(
		gl: WebGLRenderingContext | WebGL2RenderingContext,
		filter: DataLayerFilterType,
		type: DataLayerType,
		errorCallback: ErrorCallback,
	) {
		if (filter === 'NEAREST') {
			return filter;
		}

		if (type === 'float16') {
			// TODO: test if float linear extension is actually working.
			const extension = getExtension(gl, OES_TEXTURE_HAlF_FLOAT_LINEAR, errorCallback, true)
				|| getExtension(gl, OES_TEXTURE_FLOAT_LINEAR, errorCallback, true);
			if (!extension) {
				console.warn('Falling back to NEAREST filter.');
				//TODO: add a fallback that does this filtering in the frag shader?.
				filter = 'NEAREST';
			}
		} if (type === 'float32') {
			const extension = getExtension(gl, OES_TEXTURE_FLOAT_LINEAR, errorCallback, true);
			if (!extension) {
				console.warn('Falling back to NEAREST filter.');
				//TODO: add a fallback that does this filtering in the frag shader?.
				filter = 'NEAREST';
			}
		}

		return filter;
	}

	private static checkType(
		gl: WebGLRenderingContext | WebGL2RenderingContext,
		type: DataLayerType,
		writable: boolean,
		errorCallback: ErrorCallback,
	) {
		// Check if float32 supported.
		if (!isWebGL2(gl)) {
			if (type === 'float32') {
				const extension = getExtension(gl, OES_TEXTURE_FLOAT, errorCallback, true);
				if (!extension) {
					console.warn('Falling back to HALF FLOAT type.');
					type = 'float16';
				}
				// https://stackoverflow.com/questions/17476632/webgl-extension-support-across-browsers
				// Rendering to a floating-point texture may not be supported,
				// even if the OES_texture_float extension is supported.
				// Typically, this fails on current mobile hardware.
				// To check if this is supported, you have to call the WebGL
				// checkFramebufferStatus() function.
				if (writable) {
					const valid = DataLayer.testFramebufferWrite(gl, type);
					if (!valid) {
						console.warn('Falling back to HALF FLOAT type.');
						type = 'float16';
					}
				}
			}
			// Must support at least half float if using a float type.
			if (type === 'float16') {
				getExtension(gl, OES_TEXTURE_HALF_FLOAT, errorCallback);
				// TODO: https://stackoverflow.com/questions/54248633/cannot-create-half-float-oes-texture-from-uint16array-on-ipad
				if (writable) {
					const valid = DataLayer.testFramebufferWrite(gl, type);
					if (!valid) {
						errorCallback(`This browser does not support rendering to half-float textures.`);
					}
				}
			}
		}
		
		// Load additional extensions if needed.
		if (isWebGL2(gl) && (type === 'float16' || type === 'float32')) {
			getExtension(gl, EXT_COLOR_BUFFER_FLOAT, errorCallback);
		}
		return type;
	}

	private checkDataArray(_data?: DataLayerArrayType) {
		if (!_data){
			return;
		}
		const { width, height, length, numComponents, glNumChannels, type, name } = this;

		// Check that data is correct length.
		// First check for a user error.
		if ((length && _data.length !== length * numComponents) || (!length && _data.length !== width * height * numComponents)) {
			throw new Error(`Invalid data length ${_data.length} for DataLayer "${name}" of size ${length ? length : `${width}x${height}`}x${numComponents}.`);
		}

		// Check that data is correct type.
		let invalidTypeFound = false;
		switch (type) {
			case 'float16':
				// Since there is no Float16Array, we must us Uint16Array to init texture.
				// We will allow Float32Arrays to be passed in as well and do the conversion automatically.
				invalidTypeFound = invalidTypeFound || (_data.constructor !== Float32Array && _data.constructor !== Uint16Array);
				break;
			case 'float32':
				invalidTypeFound = invalidTypeFound || _data.constructor !== Float32Array;
				break;
			case 'uint8':
				invalidTypeFound = invalidTypeFound || _data.constructor !== Uint8Array;
				break;
			case 'int8':
				invalidTypeFound = invalidTypeFound || _data.constructor !== Int8Array;
				break;
			case 'uint16':
				invalidTypeFound = invalidTypeFound || _data.constructor !== Uint16Array;
				break;
			case 'int16':
				invalidTypeFound = invalidTypeFound || _data.constructor !== Int16Array;
				break;
			case 'uint32':
				invalidTypeFound = invalidTypeFound || _data.constructor !== Uint32Array;
				break;
			case 'int32':
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
		// We have to handle the case of Float16 specially by converting Float32Array to Uint16Array.
		const handleFloat16 = type === 'float16' && _data.constructor === Float32Array;
		if (incorrectSize || handleFloat16) {
			switch (type) {
				case 'float32':
					data = new Float32Array(imageSize);
					break;
				case 'float16':
					data = new Uint16Array(imageSize);
					break;
				case 'uint8':
					data = new Uint8Array(imageSize);
					break;
				case 'int8':
					data = new Int8Array(imageSize);
					break;
				case 'uint16':
					data = new Uint16Array(imageSize);
					break;
				case 'int16':
					data = new Int16Array(imageSize);
					break;
				case 'uint32':
					data = new Uint32Array(imageSize);
					break;
				case 'int32':
					data = new Int32Array(imageSize);
					break;
			default:
					throw new Error(`Error initing ${name}.  Unsupported type ${type} for GLCompute.initDataLayer.`);
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

	private static getGLTextureParameters(
		gl: WebGLRenderingContext | WebGL2RenderingContext,
		name: string,
		params: {
			numComponents: DataLayerNumComponents,
			type: DataLayerType,
			writable: boolean,
		},
		errorCallback: ErrorCallback,
	) {
		// TODO: we may not want to support int and unsigned int textures
		// because they require modifications to the shader code:
		// https://stackoverflow.com/questions/55803017/how-to-select-webgl-glsl-sampler-type-from-texture-format-properties
		const { numComponents, type, writable } = params;
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
			if (type === 'float32' || type === 'float16') {
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
			switch (type) {
				case 'float16':
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
				case 'float32':
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
				case 'uint8':
					glType = gl.UNSIGNED_BYTE;
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
					break;
				case 'int8':
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
				case 'int16':
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
				case 'uint16':
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
				case 'int32':
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
				case 'uint32':
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
					throw new Error(`Unsupported type ${type} for DataLayer "${name}".`);
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
			// TODO: how to support signed ints, maybe cast as floats instead?
			switch (type) {
				case 'float32':
					glType = gl.FLOAT;
					break;
				case 'float16':
					glType = getExtension(gl, OES_TEXTURE_HALF_FLOAT, errorCallback).HALF_FLOAT_OES as number;
					break;
				case 'uint8':
					glType = gl.UNSIGNED_BYTE;
					break;
				// case 'int8':
				// 	glType = gl.BYTE;
				// 	break;
				// case 'uint16':
				// 	getExtension(gl, WEBGL_DEPTH_TEXTURE, errorCallback);
				// 	glFormat = gl.DEPTH_COMPONENT;
				// 	glInternalFormat = gl.DEPTH_STENCIL;
				// 	glType = gl.UNSIGNED_SHORT;
				// 	break;
				// case 'int16':
				// 	glType = gl.SHORT;
				// 	break;
				// case 'uint32':
				// 	getExtension(gl, WEBGL_DEPTH_TEXTURE, errorCallback);
				// 	glNumChannels = 1;
				// 	glFormat = gl.DEPTH_COMPONENT;
				// 	glInternalFormat = gl.DEPTH_STENCIL;
				// 	glType = gl.UNSIGNED_INT;
				// 	break;
				// case 'int32':
				// 	glType = gl.INT;
				// 	break;
				default:
					throw new Error(`Unsupported type ${type} in WebGL 1.0 for DataLayer "${name}".`);
			}
		}

		// Check for missing params.
		if (glType === undefined || glFormat === undefined || glInternalFormat === undefined) {
			throw new Error(`Invalid type: ${type} for numComponents ${numComponents}.`);
		}
		if (glNumChannels === undefined || numComponents < 1 || numComponents > 4 || glNumChannels < numComponents) {
			throw new Error(`Invalid numChannels: ${numComponents}.`);
		}

		return {
			glFormat,
			glInternalFormat,
			glType,
			glNumChannels,
		};
	}

	private static testFramebufferWrite(
		gl: WebGLRenderingContext | WebGL2RenderingContext, type: DataLayerType,
		options: {
			numComponents?: DataLayerNumComponents,
			wrapS?: DataLayerWrapType,
			wrapT?: DataLayerWrapType,
			filter?: DataLayerFilterType,
			width?: number
			height?: number,
	} = {}) {
		const texture = gl.createTexture();
		if (!texture) {
			return false;
		}
		gl.bindTexture(gl.TEXTURE_2D, texture);

		const wrapS = gl[options.wrapS || 'CLAMP_TO_EDGE'];
		const wrapT = gl[options.wrapT || 'CLAMP_TO_EDGE'];
		const filter = gl[options.filter || 'NEAREST'];
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);

		const { glInternalFormat, glFormat, glType } = DataLayer.getGLTextureParameters(gl, 'test', {
			numComponents: options.numComponents || 1,
			writable: true,
			type: type,
		}, () => {});
		gl.texImage2D(gl.TEXTURE_2D, 0, glInternalFormat, options.width || 100, options.height || 100, 0, glFormat, glType, null);

		// Init a framebuffer for this texture so we can write to it.
		const framebuffer = gl.createFramebuffer();
		if (!framebuffer) {
			return false;
		}
		gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
		// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/framebufferTexture2D
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

		const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
		return status === gl.FRAMEBUFFER_COMPLETE;
	}

	private initBuffers(
		_data?: DataLayerArrayType,
	) {
		const { 
			numBuffers,
			gl,
			width,
			height,
			glInternalFormat,
			glFormat,
			glType,
			filter,
			wrapS,
			wrapT,
			writable,
			errorCallback,
		} = this;

		const data = this.checkDataArray(_data);

		// Init a texture for each buffer.
		for (let i = 0; i < numBuffers; i++) {
			const texture = gl.createTexture();
			if (!texture) {
				errorCallback(`Could not init texture for DataLayer "${this.name}": ${gl.getError()}.`);
				return;
			}
			gl.bindTexture(gl.TEXTURE_2D, texture);

			// TODO: are there other params to look into:
			// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);

			gl.texImage2D(gl.TEXTURE_2D, 0, glInternalFormat, width, height, 0, glFormat, glType, data ? data : null);
			
			const buffer: DataLayerBuffer = {
				texture,
			};

			if (writable) {
				// Init a framebuffer for this texture so we can write to it.
				const framebuffer = gl.createFramebuffer();
				if (!framebuffer) {
					errorCallback(`Could not init framebuffer for DataLayer "${this.name}": ${gl.getError()}.`);
					return;
				}
				gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
				// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/framebufferTexture2D
				gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

				const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
				if(status != gl.FRAMEBUFFER_COMPLETE){
					errorCallback(`Invalid status for framebuffer for DataLayer "${this.name}": ${status}.`);
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
		if (!isNaN(dimensions as number)) {
			if (!this.length) {
				throw new Error(`Invalid dimensions ${dimensions} for 2D DataLayer "${this.name}", please specify a width and height as an array.`)
			}
			this.length = dimensions as number;
			const [ width, height ] = this.calcWidthHeight(this.length);
			this.width = width;
			this.height = height;
		} else {
			if (this.length) {
				throw new Error(`Invalid dimensions ${dimensions} for 1D DataLayer "${this.name}", please specify a length as a number.`)
			}
			this.width = (dimensions as [number, number])[0];
			this.height = (dimensions as [number, number])[1];
		}
		this.destroyBuffers();
		this.initBuffers(data);
	}

	clear() {
		// Reset everything to zero.
		// This is not the most efficient way to do this (reallocating all textures and framebuffers).
		// but ok for now.
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

	getNumComponents() {
		return this.numComponents;
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
