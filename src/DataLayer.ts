export type DataArrayType =  Uint8Array; // Uint16Array

export type DataLayerBuffer = {
	texture: WebGLTexture,
	framebuffer?: WebGLFramebuffer,
	
}

export class DataLayer {
	private bufferIndex = 0;
	private readonly numBuffers;
	private readonly buffers: DataLayerBuffer[] = [];
	private readonly gl: WebGLRenderingContext | WebGL2RenderingContext;
	private readonly errorCallback: (message: string) => void;
	private width: number;
	private height: number;
	private readonly glInternalFormat: number;
	private readonly glFormat: number;
	private readonly glType: number;
	private readonly writable: boolean;

	constructor(
		gl: WebGLRenderingContext | WebGL2RenderingContext,
		options: {
			width: number,
			height: number,
			glInternalFormat: number,
			glFormat: number,
			glType: number,
			data?: DataArrayType,
		},
		errorCallback: (message: string) => void,
		numBuffers: number,
		writable: boolean,
	) {
		// check input parameters.
		if (numBuffers < 0 || numBuffers % 1 !== 0) {
			throw new Error(`Invalid numBuffers: ${numBuffers}, must be positive integer.`);
		}
		this.numBuffers = numBuffers;

		// Save options.
		this.width = options.width;
		this.height = options.height;
		this.glInternalFormat = options.glInternalFormat;
		this.glFormat = options.glFormat;
		this.glType = options.glType;
		this.writable = writable;

		// Save ref to gl for later.
		this.gl = gl;
		this.errorCallback = errorCallback;

		this.initBuffers(options.data)
	}

	private initBuffers(data?: DataArrayType) {
		const { numBuffers, gl, width, height, glInternalFormat, glFormat, glType, writable, errorCallback } = this;
		// Init a texture for each buffer.
		for (let i = 0; i < numBuffers; i++) {
			const texture = gl.createTexture();
			if (!texture) {
				errorCallback(`Could not init texture: ${gl.getError()}.`);
				return;
			}
			gl.bindTexture(gl.TEXTURE_2D, texture);

			// TODO: dig into this.
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			const filter = gl.NEAREST;//this.linearFilterEnabled ? gl.LINEAR : gl.NEAREST;
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
					errorCallback(`Could not init framebuffer: ${gl.getError()}.`);
					return;
				}
				gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
				// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/framebufferTexture2D
				gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

				const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
				if(status != gl.FRAMEBUFFER_COMPLETE){
					errorCallback(`Invalid status for framebuffer: ${status}.`);
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
			throw new Error('Calling getLastState on DataLayer with 1 buffer, no last state available.');
		}
		return this.buffers[this.bufferIndex].texture;
	}

	setAsRenderTarget() {
		const { gl } = this;
		// Increment bufferIndex.
		this.bufferIndex = (++this.bufferIndex) % this.numBuffers;
		const { framebuffer } = this.buffers[this.bufferIndex];
		if (!framebuffer) {
			throw new Error('This DataLayer is not writable.');
		}
		gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
	}

	resize(width: number, height: number, data?: DataArrayType) {
		this.destroyBuffers();
		this.width = width;
		this.height = height;
		this.initBuffers();
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
