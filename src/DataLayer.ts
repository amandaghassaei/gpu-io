import { EXT_COLOR_BUFFER_FLOAT, getExtension, OES_TEXTURE_FLOAT, OES_TEXTURE_FLOAT_LINEAR, OES_TEXTURE_HALF_FLOAT, OES_TEXTURE_HAlF_FLOAT_LINEAR } from './extensions';
import { isWebGL2 } from './utils';

export type DataLayerArrayType =  Uint8Array; // Uint16Array
export type DataLayerType = 'float32' | 'float16' | 'uint8';
export type DataLayerNumChannels = 1 | 2 | 3 | 4;

export type DataLayerBuffer = {
	texture: WebGLTexture,
	framebuffer?: WebGLFramebuffer,
}

export type DataLayerFilterType = 'LINEAR' | 'NEAREST';
export type DataLayerWrapType = 'REPEAT' | 'CLAMP_TO_EDGE' | 'MIRRORED_REPEAT';

export class DataLayer {
	private readonly name: string;
	private readonly gl: WebGLRenderingContext | WebGL2RenderingContext;
	private readonly errorCallback: (message: string) => void;
	private bufferIndex = 0;
	readonly numBuffers;
	private readonly buffers: DataLayerBuffer[] = [];
	private width: number;
	private height: number;
	private readonly type: DataLayerType;
	private readonly numChannels: DataLayerNumChannels;
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
			width: number,
			height: number,
			type: DataLayerType,
			numChannels: DataLayerNumChannels,
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
		this.width = options.width;
		this.height = options.height;
		// Check that gl will support the datatype.
		this.type = this.checkType(options.type);
		this.numChannels = options.numChannels;
		this.writable = writable;
		this.filter = this.checkFilter(options.filter ? options.filter : 'LINEAR', this.type);
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

	private checkFilter(
		filter: DataLayerFilterType,
		type: DataLayerType,
	) {
		const { gl, errorCallback } = this;

		// TODO: need this for modern browsers?
		if (type === 'float16') {
			const extension = 
				getExtension(gl, OES_TEXTURE_FLOAT_LINEAR, errorCallback, true) ||
				getExtension(gl, OES_TEXTURE_HAlF_FLOAT_LINEAR, errorCallback, true);
			if (!extension) {
				//TODO: add a fallback that does this filtering in the frag shader.
				filter = 'NEAREST';
			}
		} if (type === 'float32') {
			const extension = getExtension(gl, OES_TEXTURE_FLOAT_LINEAR, errorCallback, true);
			if (!extension) {
				//TODO: add a fallback that does this filtering in the frag shader.
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
		if (!isWebGL2(gl) && type === 'float32') {
			const extension = getExtension(gl, OES_TEXTURE_FLOAT, errorCallback, true);
			if (!extension) {
				type = 'float16';
			}
		}
		// Must support at least half float if using a float type.
		if (!isWebGL2(gl) && type === 'float16') {
			getExtension(gl, OES_TEXTURE_HALF_FLOAT, errorCallback);
		}
		// Load additional extensions if needed.
		if (isWebGL2(gl) && (type === 'float16' || type === 'float32')) {
			getExtension(gl, EXT_COLOR_BUFFER_FLOAT, errorCallback);
		}
		return type;
	}

	private checkDataArray(data?: DataLayerArrayType) {
		if (!data){
			return;
		}
		// Check that data is correct length.
		const { width, height, numChannels, glNumChannels, type, name } = this;
		// First check for a user error.
		if (data.length !== width * height * numChannels) {
			throw new Error(`Invalid data length ${data.length} for DataLayer ${name} of size ${width}x${height}x${numChannels}.`);
		}
		// Then check if we are using glNumChannels !== numChannels.
		let dataResized = data;
		if (data.length !==  width * height * glNumChannels) {
			const imageSize = width * height;
			let newArray: DataLayerArrayType;
			switch (type) {
				case 'uint8':
					newArray = new Uint8Array(width * height * glNumChannels);
					break;
				case 'float32':
					newArray = new Float32Array(width * height * glNumChannels);
					break;
				default:
					throw new Error(`Error initing ${name}.  Unsupported type ${type} for GPGPU.initDataLayer.`);
			}
			// Fill new data array with old data.
			for (let i = 0; i < imageSize; i++) {
				for (let j = 0; j < numChannels; j++) {
					newArray[glNumChannels * i + j] = data[i * numChannels + j];
				}
			}
			dataResized = newArray;
		}

		// TODO: Check that data is correct type.
		// if (data && type === 'float16') {
		// 	// // Since there is no Float16TypedArray, we must us Uint16TypedArray
		// 	// const float16Array = new Int16Array(data.length);
		// 	// for (let i = 0; i < data.length; i++) {
		// 	// }
		// }

		return dataResized;
	}

	private getGLTextureParameters() {
		const { gl, numChannels, type, writable, errorCallback } = this;
		// https://www.khronos.org/registry/webgl/specs/latest/2.0/#TEXTURE_TYPES_FORMATS_FROM_DOM_ELEMENTS_TABLE
		let glType: number | undefined,
			glFormat: number | undefined,
			glInternalFormat: number | undefined,
			glNumChannels: number | undefined;

		if (isWebGL2(gl)) {
			glNumChannels = numChannels;
			// https://www.khronos.org/registry/webgl/extensions/EXT_color_buffer_float/
			// The sized internal format RGB16F is not color-renderable for some reason.
			// If numChannels == 3 for a writable texture, use RGBA instead.
			if (numChannels === 3 && writable) {
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
					}
					break;
				case 'uint8':
					glType = gl.UNSIGNED_BYTE;
					switch (glNumChannels) {
						case 1:
							glInternalFormat = (gl as WebGL2RenderingContext).R8;
							break;
						case 2:
							glInternalFormat = (gl as WebGL2RenderingContext).RG8;
							break;
						case 3:
							glInternalFormat = (gl as WebGL2RenderingContext).RGB8;
							break;
						case 4:
							glInternalFormat = (gl as WebGL2RenderingContext).RGBA8;
							break;
					}
					break;
			}
		} else {
			switch (numChannels) {
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
			}
			switch (type) {
				case 'float16':
					glType = getExtension(gl, OES_TEXTURE_HALF_FLOAT, errorCallback).HALF_FLOAT_OES as number;
					break;
				case 'uint8':
					glType = gl.UNSIGNED_BYTE;
					break;
			}
		}

		// Check for missing params.
		if (glType === undefined || glFormat === undefined || glInternalFormat === undefined) {
			throw new Error(`Invalid type: ${type} or numChannels ${numChannels}.`);
		}
		if (glNumChannels === undefined || numChannels < 1 || numChannels > 4) {
			throw new Error(`Invalid numChannels: ${numChannels}.`);
		}

		return {
			glFormat,
			glInternalFormat,
			glType,
			glNumChannels,
		};
	}

	private initBuffers(_data?: DataLayerArrayType) {
		const { numBuffers, gl, width, height, glInternalFormat, glFormat, glType, filter, wrapS, wrapT, writable, errorCallback } = this;
		
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
	}

	getCurrentStateTexture() {
		return this.buffers[this.bufferIndex].texture;
	}

	getLastStateTexture() {
		if (this.numBuffers === 1) {
			throw new Error(`Calling getLastState on DataLayer ${this.name} with 1 buffer, no last state available.`);
		}
		return this.buffers[this.bufferIndex].texture;
	}

	setAsRenderTarget(incrementBufferIndex: boolean) {
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

	resize(width: number, height: number, data?: DataLayerArrayType) {
		this.destroyBuffers();
		this.width = width;
		this.height = height;
		this.initBuffers(data);
	}

	private destroyBuffers() {
		const { gl, buffers } = this;
		buffers.forEach(buffer => {
			const { framebuffer, texture } = buffer;
			gl.deleteTexture(texture);
			if (framebuffer) {
				gl.deleteFramebuffer(framebuffer);
			}
			// @ts-ignore;
			delete buffer.texture;
			delete buffer.framebuffer;
		});
		buffers.length = 0;
	}

	destroy() {
		this.destroyBuffers();
		// @ts-ignore;
		delete this.gl;
	}
}
