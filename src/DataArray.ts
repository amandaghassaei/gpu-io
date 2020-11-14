import { GPUProgram } from './GPUProgram';
import { isWebGL2 } from './utils';

export type DataArrayArrayType =  Float32Array | Uint8Array | Int8Array | Uint16Array | Int16Array;
// TODO: support for int32?
export type DataArrayType = 'float32' | 'float16' | 'uint8' | 'int8' | 'uint16' | 'int16';
export type DataArrayNumComponents = 1 | 2 | 3 | 4;

export type DataArrayBuffer = {
	vertexArray: WebGLVertexArrayObject,
	buffer: WebGLBuffer,
}

// TODO: handle wegbl1
// https://developer.mozilla.org/en-US/docs/Web/API/OES_vertex_array_object

export class DataArray {
	private readonly name: string;
	private readonly gl: WebGLRenderingContext | WebGL2RenderingContext;
	private readonly errorCallback: (message: string) => void;
	private bufferIndex = 0;
	readonly numBuffers;
	private readonly buffers: DataArrayBuffer[] = [];
	readonly length: number;
	private readonly type: DataArrayType;
	private readonly numComponents: DataArrayNumComponents;
	private readonly writable: boolean;
	private readonly glType: number;

	constructor(
		name: string,
		gl: WebGLRenderingContext | WebGL2RenderingContext,
		options: {
			length: number,
			type: DataArrayType,
			numComponents: DataArrayNumComponents,
			data?: DataArrayArrayType,
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
			throw new Error(`Invalid numBuffers: ${numBuffers} for DataArray ${this.name}, must be positive integer.`);
		}
		this.numBuffers = numBuffers;
		// Save options.
		this.length = options.length;
		// Check that gl will support the datatype.
		this.type = this.checkType(options.type);
		this.numComponents = options.numComponents;
		this.writable = writable;
		this.glType = this.glTypeForType(this.type);

		this.initBuffers(options.data);
	}

	private checkType(
		type: DataArrayType,
	) {
		return type;
	}

	private glTypeForType(
		type: DataArrayType,
	) {
		const { gl, name } = this;
		// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
		if (type === 'float16') {
			if (isWebGL2(gl)) {
				return (gl as WebGL2RenderingContext).HALF_FLOAT;
			}
			throw new Error(`Invalid type ${type} for DataArray ${name}.  Half float not supported in WebGL 1.0.`);
		}
		if (type === 'float32') {
			return gl.FLOAT;
		}
		if (type === 'uint8') {
			return gl.UNSIGNED_BYTE;
		}
		if (type === 'int8') {
			return gl.BYTE;
		}
		if (type === 'uint16') {
			return gl.UNSIGNED_SHORT;
		}
		if (type === 'int16') {
			return gl.SHORT;
		}
		throw new Error(`Invalid type ${type} for DataArray ${name}.`);
	}

	private checkDataArray(data?: DataArrayArrayType) {
		if (!data){
			return;
		}
		// Check that data is correct length.
		const { length, type, numComponents, name } = this;
		// First check for a user error.
		if (data.length !== length * numComponents) {
			throw new Error(`Invalid data length ${data.length} for DataLayer ${name} of length ${length}x${numComponents}.`);
		}

		// TODO: Check that data is correct type.
		// if (type === 'float16') {
		// 	// // Since there is no Float16TypedArray, we must us Uint16TypedArray
		// 	// const float16Array = new Int16Array(data.length);
		// 	// for (let i = 0; i < data.length; i++) {
		// 	// }
		// }

		return data;
	}

	private initBuffers(_data?: DataArrayArrayType) {
		const { numBuffers, gl, glType, numComponents, errorCallback } = this;
		
		const data = this.checkDataArray(_data);

		// Init a vertexArray for each buffer.
		for (let i = 0; i < numBuffers; i++) {
			// Init a vertexArray.
			const vertexArray = (gl as WebGL2RenderingContext).createVertexArray();
			if (!vertexArray) {
				errorCallback(`Could not init vertexArray for DataArray ${this.name}: ${gl.getError()}.`);
				return;
			}
			(gl as WebGL2RenderingContext).bindVertexArray(vertexArray);

			// Init a gl buffer.
			const glBuffer = gl.createBuffer();
			if (!glBuffer) {
				errorCallback(`Could not init buffer for DataArray ${this.name}: ${gl.getError()}.`);
				return;
			}
			gl.bindBuffer(gl.ARRAY_BUFFER, glBuffer);
			// Copy data to buffer if needed.
			// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData
			if (data) gl.bufferData(gl.ARRAY_BUFFER, data, gl.STREAM_DRAW);

			const buffer: DataArrayBuffer = {
				vertexArray,
				buffer: glBuffer,
			};

			// Save this buffer to the list.
			this.buffers.push(buffer);
		}
		// Unbind.
		(gl as WebGL2RenderingContext).bindVertexArray(null);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
	}

	getCurrentStateArray() {
		return this.buffers[this.bufferIndex].vertexArray;
	}

	bindInputArray(location: number) {
		const { gl, numComponents, glType } = this;
		const { vertexArray, buffer } = this.buffers[this.bufferIndex];
		(gl as WebGL2RenderingContext).bindVertexArray(vertexArray);
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		// Then init a vertex attribute pointer.
		gl.vertexAttribPointer(location, numComponents, glType, false, 0, 0);
		gl.enableVertexAttribArray(location);
	}

	bindOutputBuffer(index: number) {
		const { gl } = this;
		// Increment bufferIndex.
		this.bufferIndex = (this.bufferIndex + 1) % this.numBuffers;
		const { buffer } = this.buffers[this.bufferIndex];
		if (!buffer) {
			throw new Error(`DataArray ${this.name} is not writable.`);
		}
		(gl as WebGL2RenderingContext).bindBufferBase(
			(gl as WebGL2RenderingContext).TRANSFORM_FEEDBACK_BUFFER,
			index,
			buffer,
		);
	}

	// resize(length: number, data?: DataArrayArrayType) {
	// 	this.destroyBuffers();
	// 	this.length = length;
	// 	this.initBuffers(data);
	// }

	private destroyBuffers() {
		const { gl, buffers } = this;
		buffers.forEach(_buffer => {
			const { buffer, vertexArray } = _buffer;
			(gl as WebGL2RenderingContext).deleteVertexArray(vertexArray);
			if (buffer) {
				gl.deleteBuffer(buffer);
			}
			// @ts-ignore
			delete _buffer.texture;
			// @ts-ignore
			delete _buffer.buffer;
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
