import { isObject } from '@amandaghassaei/type-checks';
import { isTypedArray } from '@petamoriken/float16';
import { checkRequiredKeys, checkValidKeys } from './checks';
import { getExtension, OES_ELEMENT_INDEX_UINT } from './extensions';
import type { GPUComposer } from './GPUComposer';

export class GPUIndexBuffer {
	// Keep a reference to GPUComposer.
	private readonly _composer: GPUComposer;

	/**
	 * GL buffer.
	 */
	readonly buffer: WebGLBuffer;
	/**
	 * GL type.
	 */
	readonly glType: number;
	/**
	 * Index buffer count.
	 */
	readonly count: number;
	
	/**
	 * Init a GPUIndexBuffer to use with GPUComposer.drawLayerAsMesh().
	 * @param composer - The current GPUComposer instance.
	 * @param params - GPUIndexBuffer parameters.
	 * @param params.indices - A 1D array containing indexed geometry.  For a mesh, this would be an array of triangle indices.
	 * @param params.name - Name of GPUIndexBuffer, used for error logging.
	 * @returns 
	 */
	constructor(
		composer: GPUComposer,
		params: {
			indices: number[] | Uint8Array | Uint16Array | Uint32Array,
			name?: string,
		},
	) {
		this._composer = composer;

		if (!params) {
			throw new Error('Error initing GPUIndexBuffer: must pass params to GPUIndexBuffer(composer, params).');
		}
		if (!isObject(params)) {
			throw new Error(`Error initing GPUIndexBuffer: must pass valid params object to GPUIndexBuffer(composer, params), got ${JSON.stringify(params)}.`);
		}
		// Check params.
		const validKeys = ['indices', 'name'];
		const requiredKeys = ['indices'];
		const keys = Object.keys(params);
		checkValidKeys(keys, validKeys, 'GPUIndexBuffer(composer, params)', params.name);
		checkRequiredKeys(keys, requiredKeys, 'GPUIndexBuffer(composer, params)', params.name);

		let { indices } = params;

		const { gl, isWebGL2 } = composer;
		
		const indexBuffer = gl.createBuffer()!;
		// Make index buffer the current ELEMENT_ARRAY_BUFFER.
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

		// Cast indices to correct type.
		if (!isTypedArray(indices)) {
			indices = new Uint32Array(indices);
		}
		let glType;
		switch(indices.constructor) {
			case Uint8Array:
				glType = gl.UNSIGNED_BYTE;
				break;
			case Uint16Array:
				glType = gl.UNSIGNED_SHORT;
				break;
			case Uint32Array:
				if (!isWebGL2) {
					const ext = getExtension(composer, OES_ELEMENT_INDEX_UINT, true);
					if (!ext) {
						// Fall back to using gl.UNSIGNED_SHORT.
						glType = gl.UNSIGNED_SHORT;
						indices = Uint16Array.from(indices);
						break;
					}
				}
				glType = gl.UNSIGNED_INT;
				break;
		}
		// Fill the current element array buffer with data.
		gl.bufferData(
			gl.ELEMENT_ARRAY_BUFFER,
			indices,
			gl.STATIC_DRAW
		);

		this.buffer = indexBuffer;
		this.glType = glType as number;
		this.count = indices.length;
	}

	/**
	 * Deallocate GPUIndexBuffer instance and associated WebGL properties.
	 */
	dispose() {
		const { _composer, buffer } = this;
		_composer.gl.deleteBuffer(buffer);

		// Delete all references.
		// @ts-ignore
		delete this._composer;
		// @ts-ignore
		delete this.buffer;

		// Delete these too (for easier testing of deallocations).
		// @ts-ignore
		delete this.glType;
		// @ts-ignore
		delete this.count;
	}
}