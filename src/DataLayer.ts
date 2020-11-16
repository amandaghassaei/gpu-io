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

export class DataLayer {
	private readonly name: string;
	private readonly gl: WebGLRenderingContext | WebGL2RenderingContext;
	private readonly errorCallback: (message: string) => void;
	private bufferIndex = 0;
	readonly numBuffers;
	private readonly buffers: DataLayerBuffer[] = [];
	private length?: number; // This is only used for 1D data layers.
	private width: number;
	private height: number;
	private readonly type: DataLayerType;
	private readonly numComponents: DataLayerNumComponents;
	private readonly glInternalFormat: number;
	private readonly glFormat: number;
	private readonly glType: number;
	private readonly glNumChannels: number;
	private readonly filter: number;
	private readonly wrapS: number;
	private readonly wrapT: number;
	private readonly writable: boolean;

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
		errorCallback: (message: string) => void,
		writable: boolean,
		numBuffers: number,
	) {
		// Save params.
		this.name = name;
		this.gl = gl;
		this.errorCallback = errorCallback;
		if (numBuffers < 0 || numBuffers % 1 !== 0) {
			throw new Error(`Invalid numBuffers: ${numBuffers} for DataLayer ${this.name}, must be positive integer.`);
		}
		this.numBuffers = numBuffers;
		// Save options.
		if (!isNaN(options.dimensions as number)) {
			if (options.dimensions < 1) {
				throw new Error(`Invalid length ${options.dimensions} for DataLayer ${name}.`);
			}
			this.length = options.dimensions as number;
			const [width, height] = this.calcWidthHeight(options.dimensions as number);
			this.width = width;
			this.height = height;
			console.log(this.length, this.width, this.height);
		} else {
			this.width = (options.dimensions as [number, number])[0];
			this.height = (options.dimensions as [number, number])[1];
		}
		
		// Check that gl will support the datatype.
		this.type = this.checkType(options.type);
		this.numComponents = options.numComponents;
		this.writable = writable;
		// Get current filter setting.
		// If we are processing a 1D array, default to nearest filtering.
		// Else default to linear filtering.
		const filter = options.filter ? options.filter : (this.length ? 'NEAREST' : 'LINEAR');
		this.filter = this.checkFilter(filter, this.type);
		this.wrapS = gl[options.wrapS ? options.wrapS : 'CLAMP_TO_EDGE'];
		this.wrapT = gl[options.wrapT ? options.wrapT : 'CLAMP_TO_EDGE'];

		const {
			glFormat,
			glInternalFormat,
			glType,
			glNumChannels,
		} = this.getGLTextureParameters();
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

	private checkFilter(
		filter: DataLayerFilterType,
		type: DataLayerType,
	) {
		const { gl, errorCallback } = this;

		if (filter === 'NEAREST') {
			return gl[filter];
		}

		if (type === 'float16') {
			const extension = 
				getExtension(gl, OES_TEXTURE_FLOAT_LINEAR, errorCallback, true) ||
				getExtension(gl, OES_TEXTURE_HAlF_FLOAT_LINEAR, errorCallback, true);
			if (!extension) {
				//TODO: add a fallback that does this filtering in the frag shader?.
				filter = 'NEAREST';
			}
		} if (type === 'float32') {
			const extension = getExtension(gl, OES_TEXTURE_FLOAT_LINEAR, errorCallback, true);
			if (!extension) {
				//TODO: add a fallback that does this filtering in the frag shader?.
				filter = 'NEAREST';
			}
		}

		return gl[filter];
	}

	private checkType(
		type: DataLayerType,
	) {
		const { gl, errorCallback } = this;

		// Check if float32 supported.
		if (!isWebGL2(gl)) {
			if (type === 'float32') {
				const extension = getExtension(gl, OES_TEXTURE_FLOAT, errorCallback, true);
				if (!extension) {
					type = 'float16';
				}
			}
			// Must support at least half float if using a float type.
			if (type === 'float16') {
				getExtension(gl, OES_TEXTURE_HALF_FLOAT, errorCallback);
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
			throw new Error(`Invalid data length ${_data.length} for DataLayer ${name} of size ${length ? length : `${width}x${height}`}x${numComponents}.`);
		}

		// Check that data is correct type.
		let invalidTypeFound = false;
		switch (type) {
			case 'float32':
				invalidTypeFound = invalidTypeFound || _data.constructor !== Float32Array;
				break;
			case 'float16':
				// Since there is no Float16TypedArray, we must us Uint16TypedArray
				// TODO: how to cast as Int16Array.
				throw new Error('setting float16 from data not supported yet.');
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
				throw new Error(`Error initing ${name}.  Unsupported type ${type} for GLCompute.initDataLayer.`);
		}
		if (invalidTypeFound) {
			throw new Error(`Invalid TypedArray of type ${(_data.constructor as any).name} supplied to DataLayer ${name} of type ${type}.`);
		}

		// Then check if array needs to be lengthened.
		// This could be because glNumChannels !== numComponents.
		// Or because length !== width * height.
		let data = _data;
		const imageSize = width * height * glNumChannels;
		if (data.length < imageSize) {
			switch (type) {
				case 'float32':
					data = new Float32Array(imageSize);
					break;
				// case 'float16':
				// 	// 	newArray = new Int16Array(imageSize * glNumChannels);
				// 	throw new Error('setting float16 from data not supported yet.');
				// 	break;
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
			for (let i = 0, _len = _data.length / numComponents; i < _len; i++) {
				for (let j = 0; j < numComponents; j++) {
					data[i * glNumChannels + j] = _data[i * numComponents + j];
				}
			}
		}

		return data;
	}

	private getGLTextureParameters() {
		const { gl, numComponents, type, writable, name, errorCallback } = this;
		// https://www.khronos.org/registry/webgl/specs/latest/2.0/#TEXTURE_TYPES_FORMATS_FROM_DOM_ELEMENTS_TABLE
		let glType: number | undefined,
			glFormat: number | undefined,
			glInternalFormat: number | undefined,
			glNumChannels: number | undefined;

		if (isWebGL2(gl)) {
			glNumChannels = numComponents;
			// https://www.khronos.org/registry/webgl/extensions/EXT_color_buffer_float/
			// The sized internal format RGB16F and RGB32F is not color-renderable for some reason.
			// If numComponents == 3 for a writable texture, use RGBA instead.
			if (numComponents === 3 && writable && (type === 'float32' || type === 'float16')) {
				glNumChannels = 4;
			}
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
					throw new Error(`Unsupported glNumChannels ${glNumChannels} for DataLayer ${name}.`);
			}
			switch (type) {
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
							throw new Error(`Unsupported glNumChannels ${glNumChannels} for DataLayer ${name}.`);
					}
					break;
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
							throw new Error(`Unsupported glNumChannels ${glNumChannels} for DataLayer ${name}.`);
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
							throw new Error(`Unsupported glNumChannels ${glNumChannels} for DataLayer ${name}.`);
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
							throw new Error(`Unsupported glNumChannels ${glNumChannels} for DataLayer ${name}.`);
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
							throw new Error(`Unsupported glNumChannels ${glNumChannels} for DataLayer ${name}.`);
					}
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
							throw new Error(`Unsupported glNumChannels ${glNumChannels} for DataLayer ${name}.`);
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
							throw new Error(`Unsupported glNumChannels ${glNumChannels} for DataLayer ${name}.`);
					}
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
							throw new Error(`Unsupported glNumChannels ${glNumChannels} for DataLayer ${name}.`);
					}
					break;
				default:
					throw new Error(`Unsupported type ${type} for DataLayer ${name}.`);
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
					throw new Error(`Unsupported numComponents ${numComponents} for DataLayer ${name}.`);
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
				case 'uint16':
					getExtension(gl, WEBGL_DEPTH_TEXTURE, errorCallback);
					glType = gl.UNSIGNED_SHORT;
					break;
				// case 'int16':
				// 	glType = gl.SHORT;
				// 	break;
				case 'uint32':
					getExtension(gl, WEBGL_DEPTH_TEXTURE, errorCallback);
					glType = gl.UNSIGNED_INT;
					break;
				// case 'int32':
				// 	glType = gl.INT;
				// 	break;
				default:
					throw new Error(`Unsupported type ${type} for DataLayer ${name}.`);
			}
		}

		// Check for missing params.
		if (glType === undefined || glFormat === undefined || glInternalFormat === undefined) {
			throw new Error(`Invalid type: ${type} or numComponents ${numComponents}.`);
		}
		if (glNumChannels === undefined || numComponents < 1 || numComponents > 4) {
			throw new Error(`Invalid numChannels: ${numComponents}.`);
		}

		return {
			glFormat,
			glInternalFormat,
			glType,
			glNumChannels,
		};
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
				errorCallback(`Could not init texture for DataLayer ${this.name}: ${gl.getError()}.`);
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
					errorCallback(`Could not init framebuffer for DataLayer ${this.name}: ${gl.getError()}.`);
					return;
				}
				gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
				// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/framebufferTexture2D
				gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

				const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
				if(status != gl.FRAMEBUFFER_COMPLETE){
					errorCallback(`Invalid status for framebuffer for DataLayer ${this.name}: ${status}.`);
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
			throw new Error(`DataLayer ${this.name} is not writable.`);
		}
		gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
	}

	resize(
		dimensions: number | [number, number],
		data?: DataLayerArrayType,
	) {
		if (!isNaN(dimensions as number)) {
			if (!this.length) {
				throw new Error(`Invalid dimensions ${dimensions} for 2D DataLayer ${this.name}, please specify a width and height as an array.`)
			}
			this.length = dimensions as number;
			const [ width, height ] = this.calcWidthHeight(this.length);
			this.width = width;
			this.height = height;
		} else {
			if (this.length) {
				throw new Error(`Invalid dimensions ${dimensions} for 1D DataLayer ${this.name}, please specify a length as a number.`)
			}
			this.width = (dimensions as [number, number])[0];
			this.height = (dimensions as [number, number])[1];
		}
		this.destroyBuffers();
		this.initBuffers(data);
	}

	getDimensions() {
		return {
			width: this.width,
			height: this.height,
		};
	}

	getLength() {
		if (!this.length) {
			throw new Error(`Cannot call getLength() on 2D DataLayer ${this.name}.`);
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
