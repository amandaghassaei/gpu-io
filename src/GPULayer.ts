import { setFloat16, getFloat16 } from '@petamoriken/float16';
// @ts-ignore
import { changeDpiBlob } from 'changedpi';
import { saveAs } from 'file-saver';
import { GPUComposer } from './GPUComposer';
import {
	isNumber,
	isPositiveInteger,
	isValidClearValue,
	isValidDataType,
	isValidFilter,
	isValidWrap,
} from './checks';
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
	GPULayerArray,
	GPULayerFilter,
	GPULayerNumComponents,
	GPULayerType,
	GPULayerWrap,
	GLSL1,
	GPULayerBuffer,
	validArrayTypes,
	validFilters,
	validWraps,
	validDataTypes,
 } from './constants';
import {
	readyToRead,
} from './utils';
import {
	calcGPULayerSize,
	getGLTextureParameters,
	getGPULayerInternalFilter,
	getGPULayerInternalType,
	getGPULayerInternalWrap,
	initArrayForType,
} from './GPULayerHelpers';
import { Texture } from 'three';

export class GPULayer {
	// Keep a reference to GPUComposer.
	private readonly composer: GPUComposer;

	readonly name: string; // Name of GPULayer, used for error logging.
	readonly type: GPULayerType; // Input type passed in during setup.
	readonly numComponents: GPULayerNumComponents; // Number of RGBA channels to use for this GPULayer.
	readonly filter: GPULayerFilter; // Interpolation filter for pixel read operations.
	readonly wrapS: GPULayerWrap; // Input wrap type passed in during setup.
	readonly wrapT: GPULayerWrap; // Input wrap type passed in during setup.
	readonly writable: boolean;
	private _clearValue!: number | number[]; // Value to set when clear() is called.

	// Each GPULayer may contain a number of buffers to store different instances of the state.
	// e.g [currentState, previousState]
	private _bufferIndex = 0;
	readonly numBuffers;
	private readonly buffers: GPULayerBuffer[] = [];

	// Texture sizes.
	_length?: number; // This is only used for 1D data layers, _length is used internally, access with GPULayer.length.
	private _width: number; // Access with GPULayer.width.
	private _height: number; // Access with GPULayer.height.

	// GPULayer settings.
	// Due to variable browser support of WebGL features, "internal" variables may be different
	// from the parameter originally passed in.  These variables are set so that they match the original
	// parameter as best as possible, but fragment shader polyfills may be required.
	// All "gl" variables are used to initialize internal WebGLTexture.
	// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D
	// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter
	readonly glInternalFormat: number;
	readonly glFormat: number;
	// GPULayer.internalType corresponds to GPULayer.glType, may be different from GPULayer.type.
	readonly internalType: GPULayerType; 
	readonly glType: number;
	// Internally, GPULayer.glNumChannels may represent a larger number of channels than GPULayer.numComponents.
	// For example, writable RGB textures are not supported in WebGL2, must use RGBA instead.
	readonly glNumChannels: number;
	// GPULayer.internalFilter corresponds to GPULayer.glFilter, may be different from GPULayer.filter.
	readonly internalFilter: GPULayerFilter;
	readonly glFilter: number;
	// GPULayer.internalWrapS corresponds to GPULayer.glWrapS, may be different from GPULayer.wrapS.
	readonly internalWrapS: GPULayerWrap;
	readonly glWrapS: number;
	// GPULayer.internalWrapT corresponds to GPULayer.glWrapS, may be different from GPULayer.wrapT.
	readonly internalWrapT: GPULayerWrap;
	readonly glWrapT: number;
	
	// Optimizations so that "copying" can happen without draw calls.
	private textureOverrides?: (WebGLTexture | undefined)[];

	constructor(
		composer: GPUComposer,
		params: {
			name: string,
			dimensions: number | [number, number],
			type: GPULayerType,
			numComponents: GPULayerNumComponents,
			array?: GPULayerArray | number[],
			filter?: GPULayerFilter,
			wrapS?: GPULayerWrap,
			wrapT?: GPULayerWrap,
			writable?: boolean,
			numBuffers?: number,
			clearValue?: number | number[],
		},
	) {
		// Check constructor parameters.
		const { name } = (params || {});
		if (!composer) {
			throw new Error(`Error initing GPULayer "${name}": must pass GPUComposer instance to GPULayer(composer, params).`);
		}
		// Check params.
		const validKeys = ['name', 'dimensions', 'type', 'numComponents', 'array', 'filter', 'wrapS', 'wrapT', 'writable', 'numBuffers', 'clearValue'];
		const requiredKeys = ['name', 'dimensions', 'type', 'numComponents'];
		const keys = Object.keys(params);
		keys.forEach(key => {
			if (validKeys.indexOf(key) < 0) {
				throw new Error(`Invalid params key "${key}" passed to GPULayer(composer, params) with name "${params.name}".  Valid keys are ${validKeys.join(', ')}.`);
			}
		});
		// Check for required keys.
		requiredKeys.forEach(key => {
			if (keys.indexOf(key) < 0) {
				throw new Error(`Required params key "${key}" was not passed to GPUProgram(composer, params) with name "${name}".`);
			}
		});

		const { dimensions, type, numComponents, array } = params;
		const { gl, _errorCallback, glslVersion } = composer;

		// Save params.
		this.composer = composer;
		this.name = name;

		// numComponents must be between 1 and 4.
		if (!isPositiveInteger(numComponents) || numComponents > 4) {
			throw new Error(`Invalid numComponents: ${numComponents} for GPULayer "${name}".`);
		}
		this.numComponents = numComponents;

		// Writable defaults to false.
		const writable = !!params.writable;
		this.writable = writable;

		// Set dimensions, may be 1D or 2D.
		const { length, width, height } = calcGPULayerSize(dimensions, name, composer.verboseLogging);
		this._length = length;
		if (!isPositiveInteger(width)) {
			throw new Error(`Invalid width: ${width} for GPULayer "${name}".`);
		}
		this._width = width;
		if (!isPositiveInteger(height)) {
			throw new Error(`Invalid length: ${height} for GPULayer "${name}".`);
		}
		this._height = height;

		// Set filtering - if we are processing a 1D array, default to NEAREST filtering.
		// Else default to LINEAR (interpolation) filtering for float types and NEAREST for integer types.
		const defaultFilter = length ? NEAREST : ((type === FLOAT || type == HALF_FLOAT) ? LINEAR : NEAREST);
		const filter = params.filter !== undefined ? params.filter : defaultFilter;
		if (!isValidFilter(filter)) {
			throw new Error(`Invalid filter: ${filter} for GPULayer "${name}", must be one of [${validFilters.join(', ')}].`);
		}
		// Don't allow LINEAR filtering on integer types, it is not supported.
		if (filter === LINEAR && !(type === FLOAT || type == HALF_FLOAT)) {
			throw new Error(`LINEAR filtering is not supported on integer types, please use NEAREST filtering for GPULayer "${name}" with type: ${type}.`);
		}
		this.filter = filter;

		// Get wrap types, default to clamp to edge.
		const wrapS = params.wrapS !== undefined ? params.wrapS : CLAMP_TO_EDGE;
		if (!isValidWrap(wrapS)) {
			throw new Error(`Invalid wrapS: ${wrapS} for GPULayer "${name}", must be one of [${validWraps.join(', ')}].`);
		}
		this.wrapS = wrapS;
		const wrapT = params.wrapT !== undefined ? params.wrapT : CLAMP_TO_EDGE;
		if (!isValidWrap(wrapT)) {
			throw new Error(`Invalid wrapT: ${wrapT} for GPULayer "${name}", must be one of [${validWraps.join(', ')}].`);
		}
		this.wrapT = wrapT;

		// Set data type.
		if (!isValidDataType(type)) {
			throw new Error(`Invalid type: ${type} for GPULayer "${name}", must be one of [${validDataTypes.join(', ')}].`);
		}
		this.type = type;
		const internalType = getGPULayerInternalType({
			composer,
			type,
			writable,
			name,
		});
		this.internalType = internalType;
		// Set gl texture parameters.
		const {
			glFormat,
			glInternalFormat,
			glType,
			glNumChannels,
		} = getGLTextureParameters({
			composer,
			name,
			numComponents,
			writable,
			internalType,
		});
		this.glInternalFormat = glInternalFormat;
		this.glFormat = glFormat;
		this.glType = glType;
		this.glNumChannels = glNumChannels;

		// Set internal filtering/wrap types.
		this.internalFilter = getGPULayerInternalFilter({ composer, filter, internalType, name });
		this.glFilter = gl[this.internalFilter];
		this.internalWrapS = getGPULayerInternalWrap({ composer, wrap: wrapS, name });
		this.glWrapS = gl[this.internalWrapS];
		this.internalWrapT = getGPULayerInternalWrap({ composer, wrap: wrapT, name });
		this.glWrapT = gl[this.internalWrapT];

		// Num buffers is the number of states to store for this data.
		const numBuffers = params.numBuffers !== undefined ? params.numBuffers : 1;
		if (!isPositiveInteger(numBuffers)) {
			throw new Error(`Invalid numBuffers: ${numBuffers} for GPULayer "${name}", must be positive integer.`);
		}
		this.numBuffers = numBuffers;

		// clearValue defaults to zero.
		// Wait until after type has been set to set clearValue.
		const clearValue = params.clearValue !== undefined ? params.clearValue : 0;
		this.clearValue = clearValue; // Setter can only be called after this.numComponents has been set.

		this.initBuffers(array);
	}

	get bufferIndex() {
		return this._bufferIndex;
	}

	saveCurrentStateToGPULayer(layer: GPULayer) {
		// A method for saving a copy of the current state without a draw call.
		// Draw calls are expensive, this optimization helps.
		if (this.numBuffers < 2) {
			throw new Error(`Can't call GPULayer.saveCurrentStateToGPULayer on GPULayer "${this.name}" with less than 2 buffers.`);
		}
		if (!this.writable) {
			throw new Error(`Can't call GPULayer.saveCurrentStateToGPULayer on read-only GPULayer "${this.name}".`);
		}
		if (layer.writable) {
			throw new Error(`Can't call GPULayer.saveCurrentStateToGPULayer on GPULayer "${this.name}" using writable GPULayer "${layer.name}".`)
		}
		// Check that texture params are the same.
		if (layer.glWrapS !== this.glWrapS || layer.glWrapT !== this.glWrapT ||
			layer.wrapS !== this.wrapS || layer.wrapT !== this.wrapT ||
			layer.width !== this.width || layer.height !== this.height ||
			layer.glFilter !== this.glFilter || layer.filter !== this.filter ||
			layer.glNumChannels !== this.glNumChannels || layer.numComponents !== this.numComponents ||
			layer.glType !== this.glType || layer.type !== this.type ||
			layer.glFormat !== this.glFormat || layer.glInternalFormat !== this.glInternalFormat) {
				throw new Error(`Incompatible texture params between GPULayers "${layer.name}" and "${this.name}".`);
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
			throw new Error(`Can't call GPULayer.saveCurrentStateToGPULayer on GPULayer "${this.name}", this GPULayer has not written new state since last call to GPULayer.saveCurrentStateToGPULayer.`);
		}
		const { currentState } = this;
		this.textureOverrides[this.bufferIndex] = currentState;
		// Swap textures.
		this.buffers[this.bufferIndex].texture = layer.currentState;
		layer._setCurrentStateTexture(currentState);

		// Bind swapped texture to framebuffer.
		const { gl } = this.composer;
		const { framebuffer, texture } = this.buffers[this.bufferIndex];
		if (!framebuffer) throw new Error(`No framebuffer for writable GPULayer "${this.name}".`);
		gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
		// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/framebufferTexture2D
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
		// Unbind.
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	}

	// This is used internally.
	_setCurrentStateTexture(texture: WebGLTexture) {
		if (this.writable) {
			throw new Error(`Can't call GPULayer._setCurrentStateTexture on writable texture "${this.name}".`);
		}
		this.buffers[this.bufferIndex].texture = texture;
	}

	private validateDataArray(array: GPULayerArray | number[]) {
		const { numComponents, glNumChannels, internalType, width, height } = this;
		const length = this._length;

		// Check that data is correct length (user error).
		if (array.length !== width * height * numComponents) { // Either the correct length for WebGLTexture size
			if (!length || (length &&  array.length !== length * numComponents)) { // Of the correct length for 1D array.
				throw new Error(`Invalid data length: ${array.length} for GPULayer "${this.name}" of ${length ? `length ${length} and ` : ''}dimensions: [${width}, ${height}] and numComponents: ${numComponents}.`);
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
				throw new Error(`Invalid array type: ${array.constructor.name} for GPULayer "${this.name}", please use one of [${validArrayTypes.map(constructor => constructor.name).join(', ')}].`);
		}

		const imageSize = width * height * glNumChannels;
		// Then check if array needs to be lengthened.
		// This could be because glNumChannels !== numComponents.
		// Or because length !== width * height.
		const incorrectSize = array.length !== imageSize;
		// We have to handle the case of Float16 specially by converting data to Uint16Array.
		const handleFloat16 = internalType === HALF_FLOAT;
		
		let validatedArray = array as GPULayerArray;
		if (shouldTypeCast || incorrectSize || handleFloat16) {
			validatedArray = initArrayForType(internalType, imageSize);
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
		array?: GPULayerArray | number[],
	) {
		const {
			name,
			numBuffers,
			composer,
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
		const { gl, _errorCallback } = composer;

		const validatedArray = array ? this.validateDataArray(array) : undefined;

		// Init a texture for each buffer.
		for (let i = 0; i < numBuffers; i++) {
			const texture = gl.createTexture();
			if (!texture) {
				_errorCallback(`Could not init texture for GPULayer "${name}": ${gl.getError()}.`);
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
			
			const buffer: GPULayerBuffer = {
				texture,
			};

			if (writable) {
				// Init a framebuffer for this texture so we can write to it.
				const framebuffer = gl.createFramebuffer();
				if (!framebuffer) {
					_errorCallback(`Could not init framebuffer for GPULayer "${name}": ${gl.getError()}.`);
					return;
				}
				gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
				// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/framebufferTexture2D
				gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

				const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
				if(status != gl.FRAMEBUFFER_COMPLETE){
					_errorCallback(`Invalid status for framebuffer for GPULayer "${name}": ${status}.`);
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
			throw new Error(`Invalid buffer index: ${index} for GPULayer "${this.name}" with ${this.numBuffers} buffer${this.numBuffers > 1 ? 's' : ''}.`)
		}
		if (this.textureOverrides && this.textureOverrides[index]) return this.textureOverrides[index]!;
		return this.buffers[index].texture;
	}

	get currentState() {
		return this.getStateAtIndex(this.bufferIndex);
	}

	get lastState() {
		if (this.numBuffers === 1) {
			throw new Error(`Cannot access lastState on GPULayer "${this.name}" with only one buffer.`);
		}
		return this.getStateAtIndex((this.bufferIndex - 1 + this.numBuffers) % this.numBuffers);
	}

	// This is used internally.
	_usingTextureOverrideForCurrentBuffer() {
		return this.textureOverrides && this.textureOverrides[this.bufferIndex];
	}

	incrementBufferIndex() {
		// Increment bufferIndex.
		this._bufferIndex = (this.bufferIndex + 1) % this.numBuffers;
	}

	// This is used internally.
	_bindOutputBufferForWrite(
		incrementBufferIndex: boolean,
	) {
		if (incrementBufferIndex) {
			this.incrementBufferIndex();
		}
		this._bindOutputBuffer();

		// We are going to do a data write, if we have overrides enabled, we can remove them.
		if (this.textureOverrides) {
			this.textureOverrides[this.bufferIndex] = undefined;
		}
	}

	// This is used internally.
	_bindOutputBuffer() {
		const { gl } = this.composer;
		const { framebuffer } = this.buffers[this.bufferIndex];
		if (!framebuffer) {
			throw new Error(`GPULayer "${this.name}" is not writable.`);
		}
		gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
	}

	setFromArray(array: GPULayerArray | number[], applyToAllBuffers = false) {
		const { composer, glInternalFormat, glFormat, glType, numBuffers, width, height, bufferIndex } = this;
		const { gl } = composer;
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
		array?: GPULayerArray | number[],
	) {
		const { name, composer } = this;
		const { verboseLogging } = composer;
		if (verboseLogging) console.log(`Resizing GPULayer "${name}" to ${JSON.stringify(dimensions)}.`);
		const { length, width, height } = calcGPULayerSize(dimensions, name, verboseLogging);
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
			throw new Error(`Invalid clearValue: ${JSON.stringify(clearValue)} for GPULayer "${this.name}", expected ${type} or array of ${type} of length ${numComponents}.`);
		}
		this._clearValue = clearValue;
	}

	clear(applyToAllBuffers = false) {
		const { name, composer, clearValue, numBuffers, bufferIndex, type } = this;
		const { verboseLogging } = composer;
		if (verboseLogging) console.log(`Clearing GPULayer "${name}".`);

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
			const program = composer._setValueProgramForType(type);
			program.setUniform('u_value', value as [number, number, number, number]);
			for (let i = startIndex; i < endIndex; i++) {
				// Write clear value to buffers.
				composer.step({
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
			const { gl } = composer;
			const fillLength = this._length ? this._length : width * height;
			const array = initArrayForType(internalType, width * height * glNumChannels);
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
			throw new Error(`Cannot access length on 2D GPULayer "${this.name}".`);
		}
		return this._length;
	}

	getValues() {
		const { width, height, composer, numComponents, type } = this;
		const { gl, glslVersion } = composer;

		// In case GPULayer was not the last output written to.
		this._bindOutputBuffer();

		let { glNumChannels, glType, glFormat, internalType } = this;
		let values;
		switch (internalType) {
			case HALF_FLOAT:
				if (gl.FLOAT !== undefined) {
					// Firefox requires that RGBA/FLOAT is used for readPixels of float16 types.
					glNumChannels = 4;
					glFormat = gl.RGBA;
					glType = gl.FLOAT;
					values = new Float32Array(width * height * glNumChannels);
				} else {
					values = new Uint16Array(width * height * glNumChannels);
				}
				// // The following works in Chrome.
				// values = new Uint16Array(width * height * glNumChannels);
				break
			case FLOAT:
				// Chrome and Firefox require that RGBA/FLOAT is used for readPixels of float32 types.
				// https://github.com/KhronosGroup/WebGL/issues/2747
				glNumChannels = 4;
				glFormat = gl.RGBA;
				values = new Float32Array(width * height * glNumChannels);
				break;
			case UNSIGNED_BYTE:
				if (glslVersion === GLSL1) {
					// Firefox requires that RGBA/UNSIGNED_BYTE is used for readPixels of unsigned byte types.
					glNumChannels = 4;
					glFormat = gl.RGBA;
					values = new Uint8Array(width * height * glNumChannels);
					break;
				}
				// Firefox requires that RGBA_INTEGER/UNSIGNED_INT is used for readPixels of unsigned int types.
				glNumChannels = 4;
				glFormat = (gl as WebGL2RenderingContext).RGBA_INTEGER;
				glType = gl.UNSIGNED_INT;
				values = new Uint32Array(width * height * glNumChannels);
				// // The following works in Chrome.
				// values = new Uint8Array(width * height * glNumChannels);
				break;
			case UNSIGNED_SHORT:
				// Firefox requires that RGBA_INTEGER/UNSIGNED_INT is used for readPixels of unsigned int types.
				glNumChannels = 4;
				glFormat = (gl as WebGL2RenderingContext).RGBA_INTEGER;
				glType = gl.UNSIGNED_INT;
				values = new Uint32Array(width * height * glNumChannels);
				// // The following works in Chrome.
				// values = new Uint16Array(width * height * glNumChannels);
				break;
			case UNSIGNED_INT:
				// Firefox requires that RGBA_INTEGER/UNSIGNED_INT is used for readPixels of unsigned int types.
				glNumChannels = 4;
				glFormat = (gl as WebGL2RenderingContext).RGBA_INTEGER;
				values = new Uint32Array(width * height * glNumChannels);
				// // The following works in Chrome.
				// values = new Uint32Array(width * height * glNumChannels);
				break;
			case BYTE:
				// Firefox requires that RGBA_INTEGER/INT is used for readPixels of int types.
				glNumChannels = 4;
				glFormat = (gl as WebGL2RenderingContext).RGBA_INTEGER;
				glType = gl.INT;
				values = new Int32Array(width * height * glNumChannels);
				// // The following works in Chrome.
				// values = new Int8Array(width * height * glNumChannels);
				break;
			case SHORT:
				// Firefox requires that RGBA_INTEGER/INT is used for readPixels of int types.
				glNumChannels = 4;
				glFormat = (gl as WebGL2RenderingContext).RGBA_INTEGER;
				glType = gl.INT;
				values = new Int32Array(width * height * glNumChannels);
				// // The following works in Chrome.
				// values = new Int16Array(width * height * glNumChannels);
				break;
			case INT:
				// Firefox requires that RGBA_INTEGER/INT is used for readPixels of int types.
				glNumChannels = 4;
				glFormat = (gl as WebGL2RenderingContext).RGBA_INTEGER;
				values = new Int32Array(width * height * glNumChannels);
				// // The following works in Chrome.
				// values = new Int32Array(width * height * glNumChannels);
				break;
			default:
				throw new Error(`Unsupported internalType ${internalType} for getValues().`);
		}

		if (readyToRead(gl)) {
			// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/readPixels
			gl.readPixels(0, 0, width, height, glFormat, glType, values);
			const OUTPUT_LENGTH = (this._length ? this._length : width * height) * numComponents;

			// Convert uint16 to float32 if needed.
			const handleFloat16Conversion = internalType === HALF_FLOAT && values.constructor === Uint16Array;
			// @ts-ignore
			const view = handleFloat16Conversion ? new DataView((values as Uint16Array).buffer) : undefined;

			// We may use a different internal type than the assigned type of the GPULayer.
			let output: GPULayerArray = internalType === type ? values : initArrayForType(type, OUTPUT_LENGTH, true);

			// In some cases glNumChannels may be > numComponents.
			if (handleFloat16Conversion || output !== values || numComponents !== glNumChannels) {
				for (let i = 0, length = width * height; i < length; i++) {
					const index1 = i * glNumChannels;
					const index2 = i * numComponents;
					if (index2 >= OUTPUT_LENGTH) break;
					for (let j = 0; j < numComponents; j++) {
						if (handleFloat16Conversion) {
							output[index2 + j] = getFloat16(view!, 2 * (index1 + j), true);
						} else {
							output[index2 + j] = values[index1 + j];
						}
					}
				}
			}

			if (output.length !== OUTPUT_LENGTH) {
				output = output.slice(0, OUTPUT_LENGTH);
			}
			return output;
		} else {
			throw new Error(`Unable to read values from Buffer with status: ${gl.checkFramebufferStatus(gl.FRAMEBUFFER)}.`);
		}
	}

	savePNG(params: {
		filename: string,
		dpi?: number,
		multiplier?: number,
		callback: (data: string | Blob, filename?: string) => void,
	}) {
		const values = this.getValues();
		const { width, height, type, name, numComponents } = this;
		let { dpi } = params;
		const callback = params.callback || saveAs;
		const filename = params.filename || name;
		const multiplier = params.multiplier ||
			(type === FLOAT || type === HALF_FLOAT) ? 255 : 1;

		const canvas = document.createElement('canvas');
		canvas.width = width;
    	canvas.height = height;
		const context = canvas.getContext('2d')!;
		const imageData = context.getImageData(0, 0, width, height);
		const buffer = imageData.data;
		// Have to flip the y axis since PNGs are written top to bottom.
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				const index = y * width + x;
				const indexFlipped = (height - 1 - y) * width + x;
				for (let i = 0; i < numComponents; i++) {
					buffer[4 * indexFlipped + i] = values[numComponents * index + i] * multiplier;
				}
				if (numComponents === 1) {
					// Make monochrome.
					buffer[4 * indexFlipped + 1] = buffer[4 * indexFlipped];
					buffer[4 * indexFlipped + 2] = buffer[4 * indexFlipped];
				}
				if (numComponents < 4) {
					buffer[4 * indexFlipped + 3] = 255; // Set alpha channel to 255.
				}
			}
		}
		context.putImageData(imageData, 0, 0);

		canvas!.toBlob((blob) => {
			if (!blob) {
				console.warn(`Problem saving PNG from GPULayer "${name}", unable to init blob.`);
				return;
			}
			if (dpi) {
				changeDpiBlob(blob, dpi).then((blob: Blob) =>{
					callback(blob, `${filename}.png`);
				});
			} else {
				callback(blob, `${filename}.png`);
			}
			
		}, 'image/png');
	}

	attachToThreeTexture(texture: Texture) {
		const { composer, numBuffers, currentState, name } = this;
		const { renderer } = composer;
		if (!renderer) {
			throw new Error('GPUComposer was not inited with a renderer.');
		}
		// Link webgl texture to threejs object.
		// This is not officially supported.
		if (numBuffers > 1) {
			throw new Error(`GPULayer "${name}" contains multiple WebGL textures (one for each buffer) that are flip-flopped during compute cycles, please choose a GPULayer with one buffer.`);
		}
		const offsetTextureProperties = renderer.properties.get(texture);
		offsetTextureProperties.__webglTexture = currentState;
		offsetTextureProperties.__webglInit = true;
	}

	private destroyBuffers() {
		const { composer, buffers } = this;
		const { gl } = composer;
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

		// These are technically owned by another GPULayer,
		// so we are not responsible for deleting them from gl context.
		delete this.textureOverrides;
	}

	dispose() {
		const { name, composer } = this;
		const { gl, verboseLogging } = composer;

		if (verboseLogging) console.log(`Deallocating GPULayer "${name}".`);

		if (!gl) throw new Error(`Must call dispose() on all GPULayers before calling dispose() on GPUComposer.`);
	
		this.destroyBuffers();
		// @ts-ignore
		delete this.composer;
	}

	clone(name?: string) {
		// Make a deep copy.
		return this.composer._cloneGPULayer(this, name);
	}
}