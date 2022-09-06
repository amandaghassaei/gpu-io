import { setFloat16, getFloat16 } from '@petamoriken/float16';
// @ts-ignore
import { changeDpiBlob } from 'changedpi';
import { saveAs } from 'file-saver';
import { GPUComposer } from './GPUComposer';
import {
	isArray,
	isNumber,
	isObject,
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
	GPULayerBuffer,
	validFilters,
	validWraps,
	validDataTypes,
	GPULayerState,
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
	validateGPULayerArray,
} from './GPULayerHelpers';
import { Texture } from 'three';

export class GPULayer {
	// Keep a reference to GPUComposer.
	private readonly _composer: GPUComposer;

	/**
	 * Name of GPULayer, used for error logging.
	 */
	readonly name: string;
	/**
	 * Data type represented by GPULayer.
	 */
	readonly type: GPULayerType; // Input type passed in during setup.
	/**
	 * Number of RGBA elements represented by each pixel in the GPULayer (1-4).
	 */
	readonly numComponents: GPULayerNumComponents;
	/**
	 * Interpolation filter for GPULayer, defaults to LINEAR for 2D FLOAT/HALF_FLOAT GPULayers, otherwise defaults to NEAREST.
	 */
	readonly filter: GPULayerFilter;
	/**
	 * Horizontal wrapping style for GPULayer, defaults to CLAMP_TO_EDGE.
	 */
	readonly wrapS: GPULayerWrap;
	/**
	 * Vertical wrapping style for GPULayer, defaults to CLAMP_TO_EDGE.
	 */
	readonly wrapT: GPULayerWrap;
	/**
	 * Sets GPULayer as readonly or readwrite, defaults to false.
	 */
	readonly writable: boolean;
	// Value to set when clear() is called, defaults to zero.
	// Access with GPULayer.clearValue.
	private _clearValue: number | number[] = 0;

	// Each GPULayer may contain a number of buffers to store different instances of the state.
	// e.g [currentState, previousState]
	private _bufferIndex = 0;
	readonly numBuffers;
	private readonly _buffers: GPULayerBuffer[] = [];

	// Texture sizes.
	private _length?: number; // This is only used for 1D data layers, access with GPULayer.length.
	private _width: number; // Access with GPULayer.width.
	private _height: number; // Access with GPULayer.height.

	// GPULayer settings.
	// Due to variable browser support of WebGL features, "internal" variables may be different
	// from the parameter originally passed in.  These variables are set so that they match the original
	// parameter as best as possible, but fragment shader polyfills may be required.
	// All "gl" variables are used to initialize internal WebGLTexture.
	// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D
	// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter
	/**
	 * @private
	 */
	readonly _glInternalFormat: number;
	/**
	 * @private
	 */
	readonly _glFormat: number;

	// GPULayer.internalType corresponds to GPULayer.glType, may be different from GPULayer.type.
	/**
	 * @private
	 */
	readonly _internalType: GPULayerType;
	/**
	 * @private
	 */
	readonly _glType: number;

	// Internally, GPULayer.glNumChannels may represent a larger number of channels than GPULayer.numComponents.
	// For example, writable RGB textures are not supported in WebGL2, must use RGBA instead.
	/**
	 * @private
	 */
	readonly _glNumChannels: number;

	// GPULayer.internalFilter corresponds to GPULayer.glFilter, may be different from GPULayer.filter.
	/**
	 * @private
	 */
	readonly _internalFilter: GPULayerFilter;
	/**
	 * @private
	 */
	readonly _glFilter: number;

	// GPULayer.internalWrapS corresponds to GPULayer.glWrapS, may be different from GPULayer.wrapS.
	/**
	 * @private
	 */
	readonly _internalWrapS: GPULayerWrap;
	/**
	 * @private
	 */
	readonly _glWrapS: number;

	// GPULayer.internalWrapT corresponds to GPULayer.glWrapS, may be different from GPULayer.wrapT.
	/**
	 * @private
	 */
	readonly _internalWrapT: GPULayerWrap;
	/**
	 * @private
	 */
	readonly _glWrapT: number;
	
	// Optimizations so that "copying" can happen without draw calls.
	// TODO: take a second look at this.
	private _textureOverrides?: (WebGLTexture | undefined)[];

	/**
	 * Create a GPULayer.
	 * @param composer - The current GPUComposer instance.
	 * @param params  - GPULayer parameters.
	 * @param params.name - Name of GPULayer, used for error logging.
 	 * @param params.type - Data type represented by GPULayer.
	 * @param params.numComponents - Number of RGBA elements represented by each pixel in the GPULayer (1-4).
	 * @param params.dimensions - Dimensions of 1D or 2D GPULayer.
	 * @param params.filter - Interpolation filter for GPULayer, defaults to LINEAR for 2D FLOAT/HALF_FLOAT GPULayers, otherwise defaults to NEAREST.
	 * @param params.wrapS - Horizontal wrapping style for GPULayer, defaults to CLAMP_TO_EDGE.
	 * @param params.wrapT - Vertical wrapping style for GPULayer, defaults to CLAMP_TO_EDGE.
	 * @param params.writable - Sets GPULayer as readonly or readwrite, defaults to false.
	 * @param params.numBuffers - How may buffers to allocate, defaults to 1.  If you intend to use the current state of this GPULayer as an input to generate a new state, you will need at least 2 buffers.
	 * @param params.clearValue - Value to write to GPULayer when GPULayer.clear() is called.
	 * @param params.array - Array to initialize GPULayer.
	 */
	constructor(
		composer: GPUComposer,
		params: {
			name: string,
			type: GPULayerType,
			numComponents: GPULayerNumComponents,
			dimensions: number | [number, number],
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
		if (!params) {
			throw new Error('Error initing GPULayer: must pass params to GPULayer(composer, params).');
		}
		if (!isObject(params)) {
			throw new Error(`Error initing GPULayer: must pass valid params object to GPULayer(composer, params), got ${JSON.stringify(params)}.`);
		}
		// Check params keys.
		const validKeys = ['name', 'type', 'numComponents', 'dimensions', 'filter', 'wrapS', 'wrapT', 'writable', 'numBuffers', 'clearValue', 'array'];
		const requiredKeys = ['name', 'type', 'numComponents', 'dimensions'];
		const keys = Object.keys(params);
		keys.forEach(key => {
			if (validKeys.indexOf(key) < 0) {
				throw new Error(`Invalid params key "${key}" passed to GPULayer(composer, params) with name "${params.name}".  Valid keys are ${JSON.stringify(validKeys)}.`);
			}
		});
		// Check for required keys.
		requiredKeys.forEach(key => {
			if (keys.indexOf(key) < 0) {
				throw new Error(`Required params key "${key}" was not passed to GPULayer(composer, params) with name "${name}".`);
			}
		});

		const { dimensions, type, numComponents } = params;
		const { gl } = composer;

		// Save params.
		this._composer = composer;
		this.name = name;

		// numComponents must be between 1 and 4.
		if (!isPositiveInteger(numComponents) || numComponents > 4) {
			throw new Error(`Invalid numComponents: ${JSON.stringify(numComponents)} for GPULayer "${name}", must be number in range [1-4].`);
		}
		this.numComponents = numComponents;

		// Writable defaults to false.
		const writable = !!params.writable;
		this.writable = writable;

		// Set dimensions, may be 1D or 2D.
		const { length, width, height } = calcGPULayerSize(dimensions, name, composer.verboseLogging);
		// We already type checked length, width, and height in calcGPULayerSize.
		this._length = length;
		this._width = width;
		this._height = height;

		// Set filtering - if we are processing a 1D array, default to NEAREST filtering.
		// Else default to LINEAR (interpolation) filtering for float types and NEAREST for integer types.
		const defaultFilter = length ? NEAREST : ((type === FLOAT || type == HALF_FLOAT) ? LINEAR : NEAREST);
		const filter = params.filter !== undefined ? params.filter : defaultFilter;
		if (!isValidFilter(filter)) {
			throw new Error(`Invalid filter: ${JSON.stringify(filter)} for GPULayer "${name}", must be one of ${JSON.stringify(validFilters)}.`);
		}
		// Don't allow LINEAR filtering on integer types, it is not supported.
		if (filter === LINEAR && !(type === FLOAT || type == HALF_FLOAT)) {
			throw new Error(`LINEAR filtering is not supported on integer types, please use NEAREST filtering for GPULayer "${name}" with type: ${type}.`);
		}
		this.filter = filter;

		// Get wrap types, default to clamp to edge.
		const wrapS = params.wrapS !== undefined ? params.wrapS : CLAMP_TO_EDGE;
		if (!isValidWrap(wrapS)) {
			throw new Error(`Invalid wrapS: ${JSON.stringify(wrapS)} for GPULayer "${name}", must be one of ${JSON.stringify(validWraps)}.`);
		}
		this.wrapS = wrapS;
		const wrapT = params.wrapT !== undefined ? params.wrapT : CLAMP_TO_EDGE;
		if (!isValidWrap(wrapT)) {
			throw new Error(`Invalid wrapT: ${JSON.stringify(wrapT)} for GPULayer "${name}", must be one of ${JSON.stringify(validWraps)}.`);
		}
		this.wrapT = wrapT;

		// Set data type.
		if (!isValidDataType(type)) {
			throw new Error(`Invalid type: ${JSON.stringify(type)} for GPULayer "${name}", must be one of ${JSON.stringify(validDataTypes)}.`);
		}
		this.type = type;
		const internalType = getGPULayerInternalType({
			composer,
			type,
			writable,
			name,
		});
		this._internalType = internalType;
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
		this._glInternalFormat = glInternalFormat;
		this._glFormat = glFormat;
		this._glType = glType;
		this._glNumChannels = glNumChannels;

		// Set internal filtering/wrap types.
		// Make sure that we set filter BEFORE setting wrap.
		const internalFilter = getGPULayerInternalFilter({ composer, filter, wrapS, wrapT, internalType, name });
		this._internalFilter = internalFilter;
		this._glFilter = gl[internalFilter];
		this._internalWrapS = getGPULayerInternalWrap({ composer, wrap: wrapS, internalFilter, internalType, name });
		this._glWrapS = gl[this._internalWrapS];
		this._internalWrapT = getGPULayerInternalWrap({ composer, wrap: wrapT, internalFilter, internalType, name });
		this._glWrapT = gl[this._internalWrapT];
		

		// Num buffers is the number of states to store for this data.
		const numBuffers = params.numBuffers !== undefined ? params.numBuffers : 1;
		if (!isPositiveInteger(numBuffers)) {
			throw new Error(`Invalid numBuffers: ${JSON.stringify(numBuffers)} for GPULayer "${name}", must be positive integer.`);
		}
		this.numBuffers = numBuffers;

		// Wait until after type has been set to set clearValue.
		if (params.clearValue !== undefined) {
			this.clearValue = params.clearValue; // Setter can only be called after this.numComponents has been set.
		}

		this._initBuffers(params.array);
	}

	/**
	 * The width of the GPULayer array.
	 */
	 get width() {
		return this._width;
	}

	/**
	 * The height of the GPULayer array.
	 */
	get height() {
		return this._height;
	}

	/**
	 * The length of the GPULayer array (only available to 1D GPULayers).
	 */
	get length() {
		if (!this._length) {
			throw new Error(`Cannot access length on 2D GPULayer "${this.name}".`);
		}
		return this._length;
	}

	/**
	 * Returns whether the GPULayer was inited as a 1D array (rather than 2D).
	 * @returns - true if GPULayer is 1D, else false.
	 */
	is1D() {
		return this._length !== undefined;
	}

	/**
	 * 
	 * @private
	 */
	_usingTextureOverrideForCurrentBuffer() {
		return this._textureOverrides && this._textureOverrides[this.bufferIndex];
	}

	// saveCurrentStateToGPULayer(layer: GPULayer) {
	// 	// A method for saving a copy of the current state without a draw call.
	// 	// Draw calls are expensive, this optimization helps.
	// 	if (this.numBuffers < 2) {
	// 		throw new Error(`Can't call GPULayer.saveCurrentStateToGPULayer on GPULayer "${this.name}" with less than 2 buffers.`);
	// 	}
	// 	if (!this.writable) {
	// 		throw new Error(`Can't call GPULayer.saveCurrentStateToGPULayer on read-only GPULayer "${this.name}".`);
	// 	}
	// 	if (layer.writable) {
	// 		throw new Error(`Can't call GPULayer.saveCurrentStateToGPULayer on GPULayer "${this.name}" using writable GPULayer "${layer.name}".`)
	// 	}
	// 	// Check that texture params are the same.
	// 	if (layer.glWrapS !== this.glWrapS || layer.glWrapT !== this.glWrapT ||
	// 		layer.wrapS !== this.wrapS || layer.wrapT !== this.wrapT ||
	// 		layer.width !== this.width || layer.height !== this.height ||
	// 		layer.glFilter !== this.glFilter || layer.filter !== this.filter ||
	// 		layer.glNumChannels !== this.glNumChannels || layer.numComponents !== this.numComponents ||
	// 		layer.glType !== this.glType || layer.type !== this.type ||
	// 		layer.glFormat !== this.glFormat || layer.glInternalFormat !== this.glInternalFormat) {
	// 			throw new Error(`Incompatible texture params between GPULayers "${layer.name}" and "${this.name}".`);
	// 	}

	// 	// If we have not already inited overrides array, do so now.
	// 	if (!this.textureOverrides) {
	// 		this.textureOverrides = [];
	// 		for (let i = 0; i < this.numBuffers; i++) {
	// 			this.textureOverrides.push(undefined);
	// 		}
	// 	}

	// 	// Check if we already have an override in place.
	// 	if (this.textureOverrides[this.bufferIndex]) {
	// 		throw new Error(`Can't call GPULayer.saveCurrentStateToGPULayer on GPULayer "${this.name}", this GPULayer has not written new state since last call to GPULayer.saveCurrentStateToGPULayer.`);
	// 	}
	// 	const { currentState } = this;
	// 	this.textureOverrides[this.bufferIndex] = currentState;
	// 	// Swap textures.
	// 	this.buffers[this.bufferIndex].texture = layer.currentState;
	// 	layer._setCurrentStateTexture(currentState);

	// 	// Bind swapped texture to framebuffer.
	// 	const { gl } = this.composer;
	// 	const { framebuffer, texture } = this.buffers[this.bufferIndex];
	// 	if (!framebuffer) throw new Error(`No framebuffer for writable GPULayer "${this.name}".`);
	// 	gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
	// 	// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/framebufferTexture2D
	// 	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
	// 	// Unbind.
	// 	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	// }

	// // This is used internally.
	// _setCurrentStateTexture(texture: WebGLTexture) {
	// 	if (this.writable) {
	// 		throw new Error(`Can't call GPULayer._setCurrentStateTexture on writable texture "${this.name}".`);
	// 	}
	// 	this.buffers[this.bufferIndex].texture = texture;
	// }

	/**
	 * Init GLTexture/GLFramebuffer pairs for reading/writing GPULayer data.
	 * @private
	 */
	private _initBuffers(
		array?: GPULayerArray | number[],
	) {
		const {
			name,
			numBuffers,
			_composer,
			_glInternalFormat,
			_glFormat,
			_glType,
			_glFilter,
			_glWrapS,
			_glWrapT,
			writable,
			width,
			height,
		} = this;
		const { gl, _errorCallback } = _composer;

		const validatedArray = array ? validateGPULayerArray(array, this) : undefined;

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
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, _glWrapS);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, _glWrapT);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, _glFilter);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, _glFilter);

			gl.texImage2D(gl.TEXTURE_2D, 0, _glInternalFormat, width, height, 0, _glFormat, _glType, validatedArray ? validatedArray : null);
			
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
				if(status !== gl.FRAMEBUFFER_COMPLETE){
					_errorCallback(`Invalid status for framebuffer for GPULayer "${name}": ${status}.`);
				}

				// Add framebuffer.
				buffer.framebuffer = framebuffer;
			}
			
			// Save this buffer to the list.
			this._buffers.push(buffer);
		}
		// Unbind.
		gl.bindTexture(gl.TEXTURE_2D, null);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	}
	
	/**
	 * Get buffer index of the current state.
	 */
	get bufferIndex() {
		return this._bufferIndex;
	}

	/**
	 * Increment buffer index by 1.
	 */
	incrementBufferIndex() {
		// Increment bufferIndex.
		this._bufferIndex = (this.bufferIndex + 1) % this.numBuffers;
	}

	/**
	 * Get the current state as a GPULayerState object.
	 */
	get currentState() {
		return this.getStateAtIndex(this.bufferIndex);
	}

	/**
	 * Get the previous state as a GPULayerState object (only available for GPULayers with numBuffers > 1).
	 */
	get lastState() {
		if (this.numBuffers === 1) {
			throw new Error(`Cannot access lastState on GPULayer "${this.name}" with only one buffer.`);
		}
		return this.getStateAtIndex((this.bufferIndex - 1 + this.numBuffers) % this.numBuffers);
	}

	/**
	 * Get the state at a specified index as a GPULayerState object.
	 */
	getStateAtIndex(index: number): GPULayerState {
		const { numBuffers, _textureOverrides, _buffers } = this;
		if (index < 0 && index > -numBuffers) {
			index += numBuffers; // Slightly negative numbers are ok.
		}
		if (index < 0 || index >= numBuffers) {
			// We will allow this number to overflow with warning - likely user error.
			console.warn(`Out of range buffer index: ${index} for GPULayer "${this.name}" with $.numBuffers} buffer${numBuffers > 1 ? 's' : ''}.  Was this intentional?`);
			if (index < 0) {
				index += numBuffers * Math.ceil(Math.abs(index) / numBuffers);
			} else {
				index = index % numBuffers;
			}
		}
		// if (_textureOverrides && _textureOverrides[index]) return _textureOverrides[index]!;
		return {
			texture: _buffers[index].texture,
			layer: this,
		};
	}

	/**
	 * Binds this GPULayer's current framebuffer as the draw target.
	 */
	private _bindFramebuffer() {
		const { gl } = this._composer;
		const { framebuffer } = this._buffers[this.bufferIndex];
		if (!framebuffer) {
			throw new Error(`GPULayer "${this.name}" is not writable.`);
		}
		gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
	}

	/**
	 * Increments the buffer index (if needed) and binds next framebuffer as draw target.
	 * @private
	 */
	_prepareForWrite(
		incrementBufferIndex: boolean,
	) {
		if (incrementBufferIndex) {
			this.incrementBufferIndex();
		}
		this._bindFramebuffer();

		// We are going to do a data write, if we have overrides enabled, we can remove them.
		if (this._textureOverrides) {
			this._textureOverrides[this.bufferIndex] = undefined;
		}
	}

	setFromArray(array: GPULayerArray | number[], applyToAllBuffers = false) {
		const { _composer, _glInternalFormat, _glFormat, _glType, numBuffers, width, height, bufferIndex } = this;
		const { gl } = _composer;
		const validatedArray = validateGPULayerArray(array, this);
		// TODO: check that this is working.
		const startIndex = applyToAllBuffers ? 0 : bufferIndex;
		const endIndex = applyToAllBuffers ? numBuffers : bufferIndex + 1;
		for (let i = startIndex; i < endIndex; i++) {
			const { texture } = this.getStateAtIndex(i);
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, _glInternalFormat, width, height, 0, _glFormat, _glType, validatedArray);
		}
		// Unbind texture.
		gl.bindTexture(gl.TEXTURE_2D, null);
	}

	resize(
		dimensions: number | [number, number],
		array?: GPULayerArray | number[],
	) {
		const { name, _composer } = this;
		const { verboseLogging } = _composer;
		if (verboseLogging) console.log(`Resizing GPULayer "${name}" to ${JSON.stringify(dimensions)}.`);
		const { length, width, height } = calcGPULayerSize(dimensions, name, verboseLogging);
		this._length = length;
		this._width = width;
		this._height = height;
		this._destroyBuffers();
		this._initBuffers(array);
	}

	/**
	 * Set the clearValue of the GPULayer, which is applied during GPULayer.clear().
	 */
	set clearValue(clearValue: number | number[]) {
		const { numComponents, type } = this;
		if (!isValidClearValue(clearValue, numComponents, type)) {
			throw new Error(`Invalid clearValue: ${JSON.stringify(clearValue)} for GPULayer "${this.name}", expected ${type} or array of ${type} of length ${numComponents}.`);
		}
		// Make deep copy if needed.
		this._clearValue = isArray(clearValue) ? (clearValue as number[]).slice() : clearValue;
	}

	/**
	 * Get the clearValue of the GPULayer.
	 */
	get clearValue() {
		return this._clearValue;
	}

	/**
	 * Clear all data in GPULayer to GPULayer.clearValue.
	 * @param applyToAllBuffers - Flag to apply to all buffers of GPULayer, or just the current output buffer.
	 */
	clear(applyToAllBuffers = false) {
		const { name, _composer, clearValue, numBuffers, bufferIndex, type } = this;
		const { verboseLogging } = _composer;
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
			const program = _composer._setValueProgramForType(type);
			program.setUniform('u_value', value as [number, number, number, number]);
			for (let i = startIndex; i < endIndex; i++) {
				// Write clear value to buffers.
				_composer.step({
					program,
					output: this,
				});
			}
		} else {
			// Init a typed array containing clearValue and pass to buffers.
			const {
				width, height, _glNumChannels, _internalType,
				_glInternalFormat, _glFormat, _glType,
			} = this;
			const { gl } = _composer;
			const fillLength = this._length ? this._length : width * height;
			const array = initArrayForType(_internalType, width * height * _glNumChannels);
			const float16View = _internalType === HALF_FLOAT ? new DataView(array.buffer) : null;
			for (let j = 0; j < fillLength; j++) {
				for (let k = 0; k < _glNumChannels; k++) {
					const index = j * _glNumChannels + k;
					if (_internalType === HALF_FLOAT) {
						// Float16 needs to be handled separately.
						setFloat16(float16View!, 2 * index, value[k], true);
					} else {
						array[index] = value[k];
					}
				}
			}
			for (let i = startIndex; i < endIndex; i++) {
				const { texture } = this.getStateAtIndex(i);
				gl.bindTexture(gl.TEXTURE_2D, texture);
				gl.texImage2D(gl.TEXTURE_2D, 0, _glInternalFormat, width, height, 0, _glFormat, _glType, array);
			}
			// Unbind texture.
			gl.bindTexture(gl.TEXTURE_2D, null);
		}
	}

	// TODO: this does not work on non-writable GPULayers, change this?
	/**
	 * Returns the current values of the GPULayer as a TypedArray.
	 * @returns - A TypedArray containing current state of GPULayer.
	 */
	getValues() {
		const { width, height, _composer, numComponents, type } = this;
		const { gl } = _composer;

		// In case GPULayer was not the last output written to.
		this._bindFramebuffer();

		let { _glNumChannels, _glType, _glFormat, _internalType } = this;
		let values;
		switch (_internalType) {
			case HALF_FLOAT:
				if (gl.FLOAT !== undefined) {
					// Firefox requires that RGBA/FLOAT is used for readPixels of float16 types.
					_glNumChannels = 4;
					_glFormat = gl.RGBA;
					_glType = gl.FLOAT;
					values = new Float32Array(width * height * _glNumChannels);
				} else {
					values = new Uint16Array(width * height * _glNumChannels);
				}
				// // The following works in Chrome.
				// values = new Uint16Array(width * height * glNumChannels);
				break
			case FLOAT:
				// Chrome and Firefox require that RGBA/FLOAT is used for readPixels of float32 types.
				// https://github.com/KhronosGroup/WebGL/issues/2747
				_glNumChannels = 4;
				_glFormat = gl.RGBA;
				values = new Float32Array(width * height * _glNumChannels);
				break;
			case UNSIGNED_BYTE:
				// We never hit glslVersion === GLSL1 anymore, see GPULayerHelpers.shouldCastIntTypeAsFloat for more info.
				// if (glslVersion === GLSL1) {
				// 	// Firefox requires that RGBA/UNSIGNED_BYTE is used for readPixels of unsigned byte types.
				// 	_glNumChannels = 4;
				// 	_glFormat = gl.RGBA;
				// 	values = new Uint8Array(width * height * _glNumChannels);
				// 	break;
				// }
				// Firefox requires that RGBA_INTEGER/UNSIGNED_INT is used for readPixels of unsigned int types.
				_glNumChannels = 4;
				_glFormat = (gl as WebGL2RenderingContext).RGBA_INTEGER;
				_glType = gl.UNSIGNED_INT;
				values = new Uint32Array(width * height * _glNumChannels);
				// // The following works in Chrome.
				// values = new Uint8Array(width * height * glNumChannels);
				break;
			case UNSIGNED_SHORT:
				// Firefox requires that RGBA_INTEGER/UNSIGNED_INT is used for readPixels of unsigned int types.
				_glNumChannels = 4;
				_glFormat = (gl as WebGL2RenderingContext).RGBA_INTEGER;
				_glType = gl.UNSIGNED_INT;
				values = new Uint32Array(width * height * _glNumChannels);
				// // The following works in Chrome.
				// values = new Uint16Array(width * height * glNumChannels);
				break;
			case UNSIGNED_INT:
				// Firefox requires that RGBA_INTEGER/UNSIGNED_INT is used for readPixels of unsigned int types.
				_glNumChannels = 4;
				_glFormat = (gl as WebGL2RenderingContext).RGBA_INTEGER;
				values = new Uint32Array(width * height * _glNumChannels);
				// // The following works in Chrome.
				// values = new Uint32Array(width * height * glNumChannels);
				break;
			case BYTE:
				// Firefox requires that RGBA_INTEGER/INT is used for readPixels of int types.
				_glNumChannels = 4;
				_glFormat = (gl as WebGL2RenderingContext).RGBA_INTEGER;
				_glType = gl.INT;
				values = new Int32Array(width * height * _glNumChannels);
				// // The following works in Chrome.
				// values = new Int8Array(width * height * glNumChannels);
				break;
			case SHORT:
				// Firefox requires that RGBA_INTEGER/INT is used for readPixels of int types.
				_glNumChannels = 4;
				_glFormat = (gl as WebGL2RenderingContext).RGBA_INTEGER;
				_glType = gl.INT;
				values = new Int32Array(width * height * _glNumChannels);
				// // The following works in Chrome.
				// values = new Int16Array(width * height * glNumChannels);
				break;
			case INT:
				// Firefox requires that RGBA_INTEGER/INT is used for readPixels of int types.
				_glNumChannels = 4;
				_glFormat = (gl as WebGL2RenderingContext).RGBA_INTEGER;
				values = new Int32Array(width * height * _glNumChannels);
				// // The following works in Chrome.
				// values = new Int32Array(width * height * glNumChannels);
				break;
			default:
				throw new Error(`Unsupported internalType ${_internalType} for getValues().`);
		}

		if (readyToRead(gl)) {
			// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/readPixels
			gl.readPixels(0, 0, width, height, _glFormat, _glType, values);
			const OUTPUT_LENGTH = (this._length ? this._length : width * height) * numComponents;

			// Convert uint16 to float32 if needed.
			const handleFloat16Conversion = _internalType === HALF_FLOAT && values.constructor === Uint16Array;
			// @ts-ignore
			const view = handleFloat16Conversion ? new DataView((values as Uint16Array).buffer) : undefined;

			// We may use a different internal type than the assigned type of the GPULayer.
			let output: GPULayerArray = _internalType === type ? values : initArrayForType(type, OUTPUT_LENGTH, true);

			// In some cases glNumChannels may be > numComponents.
			if (view || output !== values || numComponents !== _glNumChannels) {
				for (let i = 0, length = width * height; i < length; i++) {
					const index1 = i * _glNumChannels;
					const index2 = i * numComponents;
					if (index2 >= OUTPUT_LENGTH) break;
					for (let j = 0; j < numComponents; j++) {
						if (view) {
							output[index2 + j] = getFloat16(view, 2 * (index1 + j), true);
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

	// TODO: this does not work on non-writable GPULayers, change this?
	/**
	 * Save the current state of this GPULayer to png.
	 * @param params - PNG parameters.
	 * @param params.filename - PNG filename (no extension, defaults to the name of the GPULayer).
	 * @param params.dpi - PNG dpi (defaults to 72dpi).
	 * @param params.multiplier - Multiplier to apply to data before saving PNG (defaults to 255 for FLOAT and HALF_FLOAT types, else 1).
	 * @param params.callback - Optional callback when Blob is ready, default behavior saves the PNG using FileSaver.js. 
	*/
	savePNG(params: {
		filename?: string,
		dpi?: number,
		multiplier?: number,
		callback?: (blob: Blob, filename: string) => void,
	} = {}) {
		const values = this.getValues();
		const { width, height, type, name, numComponents } = this;
		const callback = params.callback || saveAs; // Default to saving the image with FileSaver.
		const filename = params.filename || name; // Default to the name of this layer.
		const multiplier = params.multiplier ||
			((type === FLOAT || type === HALF_FLOAT) ? 255 : 1);

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

		canvas.toBlob((blob) => {
			if (!blob) {
				console.warn(`Problem saving PNG from GPULayer "${name}", unable to init blob.`);
				return;
			}
			if (params.dpi) {
				changeDpiBlob(blob, params.dpi).then((blob: Blob) =>{
					callback(blob, `${filename}.png`);
				});
			} else {
				callback(blob, `${filename}.png`);
			}
		}, 'image/png');
	}

	/**
	 * Attach the output buffer of this GPULayer to a Threejs Texture object.
	 * @param {Texture} texture - Threejs texture object.
	 */
	attachToThreeTexture(texture: Texture) {
		const { _composer, numBuffers, currentState, name } = this;
		const { _renderer } = _composer;
		if (!_renderer) {
			throw new Error('GPUComposer was not inited with a renderer.');
		}
		// Link webgl texture to threejs object.
		// This is not officially supported.
		if (numBuffers > 1) {
			throw new Error(`GPULayer "${name}" contains multiple WebGL textures (one for each buffer) that are flip-flopped during compute cycles, please choose a GPULayer with one buffer.`);
		}
		const offsetTextureProperties = _renderer.properties.get(texture);
		offsetTextureProperties.__webglTexture = currentState;
		offsetTextureProperties.__webglInit = true;
	}

	/**
	 * Delete this GPULayer's framebuffers and textures.
	 * @private
	 */
	private _destroyBuffers() {
		const { _composer, _buffers } = this;
		const { gl } = _composer;
		_buffers.forEach(buffer => {
			const { framebuffer, texture } = buffer;
			gl.deleteTexture(texture);
			if (framebuffer) {
				gl.deleteFramebuffer(framebuffer);
			}
			// @ts-ignore
			delete buffer.texture;
			delete buffer.framebuffer;
		});
		_buffers.length = 0;

		// These are technically owned by another GPULayer,
		// so we are not responsible for deleting them from gl context.
		delete this._textureOverrides;
	}

	/**
	 * Create a deep copy of GPULayer with current state copied over.
	 * @param name - Name of new GPULayer as string.
	 * @returns - Deep copy of GPULayer.
	 */
	clone(name?: string) {
		// Make a deep copy.
		return this._composer._cloneGPULayer(this, name);
	}

	/**
	 * Deallocate GPULayer instance and associated WebGL properties.
	 */
	dispose() {
		const { name, _composer } = this;
		const { gl, verboseLogging } = _composer;

		if (verboseLogging) console.log(`Deallocating GPULayer "${name}".`);

		if (!gl) throw new Error(`Must call dispose() on all GPULayers before calling dispose() on GPUComposer.`);
	
		this._destroyBuffers();
		// @ts-ignore
		delete this._buffers;
		// @ts-ignore
		delete this._composer;
	}
}