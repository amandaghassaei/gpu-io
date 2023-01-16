import { getFloat16 } from '@petamoriken/float16';
import type { Texture } from 'three';
import {
	isArray,
	isFiniteNumber,
	isObject,
	isPositiveInteger,
	isString,
} from '@amandaghassaei/type-checks';
// @ts-ignore
import { changeDpiBlob } from 'changedpi';
import { saveAs } from 'file-saver';
import type { GPUComposer } from './GPUComposer';
import {
	checkRequiredKeys,
	checkValidKeys,
	isValidClearValue,
	isValidDataType,
	isValidFilter,
	isValidImageFormat,
	isValidImageType,
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
	validFilters,
	validWraps,
	validDataTypes,
	GPULayerState,
	ImageFormat,
	ImageType,
	validImageFormats,
	validImageTypes,
 } from './constants';
import {
	readPixelsAsync,
	readyToRead,
} from './utils';
import { disposeFramebuffers, bindFrameBuffer } from './framebuffers';
import { arrayConstructorForType } from './conversions';

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
	readonly wrapX: GPULayerWrap;
	/**
	 * Vertical wrapping style for GPULayer, defaults to CLAMP_TO_EDGE.
	 */
	readonly wrapY: GPULayerWrap;

	// Value to set when clear() is called, defaults to zero.
	// Access with GPULayer.clearValue.
	private _clearValue: number | number[] = 0;
	private _clearValueVec4? : number[];

	// Each GPULayer may contain a number of buffers to store different instances of the state.
	// e.g [currentState, previousState]
	private _bufferIndex = 0;
	readonly numBuffers;
	private readonly _buffers: WebGLTexture[] = [];

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

	/**
	 * GPULayer._internalType corresponds to GPULayer.glType, but may be different from GPULayer.type.
	 * @private
	 */
	readonly _internalType: GPULayerType;
	/**
	 * @private
	 */
	readonly _glType: number;

	/**
	 * Internally, GPULayer._glNumChannels may represent a larger number of channels than GPULayer.numComponents.
	 * For example, writable RGB textures are not supported in WebGL2, must use RGBA instead.
	 * @private
	 */
	readonly _glNumChannels: number;

	/**
	 * GPULayer._internalFilter corresponds to GPULayer.glFilter, may be different from GPULayer.filter.
	 * @private
	 */
	readonly _internalFilter: GPULayerFilter;
	/**
	 * @private
	 */
	readonly _glFilter: number;

	/**
	 * GPULayer._internalWrapX corresponds to GPULayer.glWrapX, but may be different from GPULayer.wrapX.
	 * @private
	 */
	readonly _internalWrapX: GPULayerWrap;
	/**
	 * @private
	 */
	readonly _glWrapS: number;

	/**
	 * GPULayer._internalWrapY corresponds to GPULayer.glWrapY, but may be different from GPULayer.wrapY.
	 * @private
	 */
	readonly _internalWrapY: GPULayerWrap;
	/**
	 * @private
	 */
	readonly _glWrapT: number;
	
	// Optimization so that "copying" can happen without draw calls by simply swapping WebGL textures between GPULayers.
	// This functionality is not currently active right now, but will be added back in later.
	private _textureOverrides?: (WebGLTexture | undefined)[];

	// Optimizations so we don't allocate many large arrays if getValues()is called multiple times.
	private _values?: GPULayerArray;
	private _valuesRaw?: Float32Array | Uint16Array | Uint32Array | Int32Array;
	private _valuesBufferView?: DataView;

	/**
	 * Create a GPULayer from an image url.
	 * @param composer - The current GPUComposer instance.
	 * @param params  - GPULayer parameters.
	 * @param params.name - Name of GPULayer, used for error logging.
	 * @param params.url - URL of the image source.
	 * @param params.type - Data type represented by GPULayer.
	 * @param params.format - Image format, either RGB or RGBA.
	 * @param params.filter - Interpolation filter for GPULayer, defaults to LINEAR for FLOAT/HALF_FLOAT Images, otherwise defaults to NEAREST.
	 * @param params.wrapX - Horizontal wrapping style for GPULayer, defaults to CLAMP_TO_EDGE.
	 * @param params.wrapY - Vertical wrapping style for GPULayer, defaults to CLAMP_TO_EDGE.
	 * @param params.clearValue - Value to write to GPULayer when GPULayer.clear() is called.
	 */
	static async initFromImageURL(composer: GPUComposer,
		params: {
			name: string,
			url: string,
			type?: ImageType,
			format?: ImageFormat,
			filter?: GPULayerFilter,
			wrapX?: GPULayerWrap,
			wrapY?: GPULayerWrap,
			clearValue?: number | number[],
		},
	) {
		return new Promise<GPULayer>((resolve, reject) => {
			if (!params) {
				throw new Error('Error initing GPULayer: must pass params to GPULayer.initFromImageURL(composer, params).');
			}
			if (!isObject(params)) {
				throw new Error(`Error initing GPULayer: must pass valid params object to GPULayer.initFromImageURL(composer, params), got ${JSON.stringify(params)}.`);
			}
			// Check params.
			const validKeys = ['name', 'url', 'filter', 'wrapX', 'wrapY', 'format', 'type', 'clearValue'];
			const requiredKeys = ['name', 'url'];
			const keys = Object.keys(params);
			checkValidKeys(keys, validKeys, 'GPULayer.initFromImageURL(composer, params)', params.name);
			checkRequiredKeys(keys, requiredKeys, 'GPULayer.initFromImageURL(composer, params)', params.name);

			const { url, name, filter, wrapX, wrapY, type, format } = params;
			if (!isString(url)) {
				throw new Error(`Expected GPULayer.initFromImageURL params to have url of type string, got ${url} of type ${typeof url}.`)
			}
			if (type && !isValidImageType(type)) {
				throw new Error(`Invalid type: "${type}" for GPULayer.initFromImageURL "${name}", must be one of ${JSON.stringify(validImageTypes)}.`)
			}
			if (format && !isValidImageFormat(format)) {
				throw new Error(`Invalid format: "${format}" for GPULayer.initFromImageURL "${name}", must be one of ${JSON.stringify(validImageFormats)}.`)
			}

			// Init a layer to return, we will fill it when image has loaded.
			const layer = new GPULayer(composer, {
				name,
				type: type || FLOAT,
				numComponents: format ? format.length as GPULayerNumComponents : 4,
				dimensions: [1, 1], // Init as 1 px to start.
				filter,
				wrapX,
				wrapY,
				numBuffers: 1,
				clearValue: params.clearValue,
			});

			// Load image.
			const image = new Image();
			image.onload = () => {
				layer.resize([image.width, image.height], image);
				// Callback when texture has loaded.
				resolve(layer);
			};
			image.onerror = (e) => {
				reject(new Error(`Error loading image "${name}": ${e}`));
			}
			image.src = url;
		});
	}

	/**
	 * Create a GPULayer.
	 * @param composer - The current GPUComposer instance.
	 * @param params - GPULayer parameters.
	 * @param params.name - Name of GPULayer, used for error logging.
	 * @param params.type - Data type represented by GPULayer.
	 * @param params.numComponents - Number of RGBA elements represented by each pixel in the GPULayer (1-4).
	 * @param params.dimensions - Dimensions of 1D or 2D GPULayer.
	 * @param params.filter - Interpolation filter for GPULayer, defaults to LINEAR for 2D FLOAT/HALF_FLOAT GPULayers, otherwise defaults to NEAREST.
	 * @param params.wrapX - Horizontal wrapping style for GPULayer, defaults to CLAMP_TO_EDGE.
	 * @param params.wrapY - Vertical wrapping style for GPULayer, defaults to CLAMP_TO_EDGE.
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
			dimensions: number | number[],
			array?: GPULayerArray | number[],
			filter?: GPULayerFilter,
			wrapX?: GPULayerWrap,
			wrapY?: GPULayerWrap,
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
		const validKeys = ['name', 'type', 'numComponents', 'dimensions', 'filter', 'wrapX', 'wrapY', 'numBuffers', 'clearValue', 'array'];
		const requiredKeys = ['name', 'type', 'numComponents', 'dimensions'];
		const keys = Object.keys(params);
		checkValidKeys(keys, validKeys, 'GPULayer(composer, params)', params.name);
		checkRequiredKeys(keys, requiredKeys, 'GPULayer(composer, params)', params.name);

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

		// Set dimensions, may be 1D or 2D.
		const { length, width, height } = GPULayer.calcGPULayerSize(dimensions, name, composer.verboseLogging);
		// We already type checked length, width, and height in calcGPULayerSize.
		this._length = length;
		this._width = width;
		this._height = height;

		// Set filtering - if we are processing a 1D array, default to NEAREST filtering.
		// Else default to LINEAR (interpolation) filtering for float types and NEAREST for integer types.
		const defaultFilter = (length === undefined && (type === FLOAT || type == HALF_FLOAT)) ? LINEAR : NEAREST;
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
		const wrapX = params.wrapX !== undefined ? params.wrapX : CLAMP_TO_EDGE;
		if (!isValidWrap(wrapX)) {
			throw new Error(`Invalid wrapX: ${JSON.stringify(wrapX)} for GPULayer "${name}", must be one of ${JSON.stringify(validWraps)}.`);
		}
		this.wrapX = wrapX;
		const wrapY = params.wrapY !== undefined ? params.wrapY : CLAMP_TO_EDGE;
		if (!isValidWrap(wrapY)) {
			throw new Error(`Invalid wrapY: ${JSON.stringify(wrapY)} for GPULayer "${name}", must be one of ${JSON.stringify(validWraps)}.`);
		}
		this.wrapY = wrapY;

		// Set data type.
		if (!isValidDataType(type)) {
			throw new Error(`Invalid type: ${JSON.stringify(type)} for GPULayer "${name}", must be one of ${JSON.stringify(validDataTypes)}.`);
		}
		this.type = type;
		const internalType = GPULayer.getGPULayerInternalType({
			composer,
			type,
			name,
		});
		this._internalType = internalType;
		// Set gl texture parameters.
		const {
			glFormat,
			glInternalFormat,
			glType,
			glNumChannels,
		} = GPULayer.getGLTextureParameters({
			composer,
			name,
			numComponents,
			internalType,
		});
		this._glInternalFormat = glInternalFormat;
		this._glFormat = glFormat;
		this._glType = glType;
		this._glNumChannels = glNumChannels;

		// Set internal filtering/wrap types.
		// Make sure that we set filter BEFORE setting wrap.
		const internalFilter = GPULayer.getGPULayerInternalFilter({ composer, filter, wrapX, wrapY, internalType, name });
		this._internalFilter = internalFilter;
		this._glFilter = gl[internalFilter];
		this._internalWrapX = GPULayer.getGPULayerInternalWrap({ composer, wrap: wrapX, internalFilter, internalType, name });
		this._glWrapS = gl[this._internalWrapX];
		this._internalWrapY = GPULayer.getGPULayerInternalWrap({ composer, wrap: wrapY, internalFilter, internalType, name });
		this._glWrapT = gl[this._internalWrapY];

		// Num buffers is the number of states to store for this data.
		const numBuffers = params.numBuffers !== undefined ? params.numBuffers : 1;
		if (!isPositiveInteger(numBuffers)) {
			throw new Error(`Invalid numBuffers: ${JSON.stringify(numBuffers)} for GPULayer "${name}", must be positive integer.`);
		}
		this.numBuffers = numBuffers;

		// Wait until after type and numComponents has been set to set clearValue.
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
	 * Returns whether the GPULayer was inited as a 2D array (rather than 1D).
	 * @returns - true if GPULayer is 2D, else false.
	 */
	is2D() {
		return !this.is1D();
	}

	/**
	 * Test whether the current buffer index has override enabled.
	 * @private
	 */
	_usingTextureOverrideForCurrentBuffer() {
		return !!(this._textureOverrides && this._textureOverrides[this.bufferIndex]);
	}

	/**
	 * Copy contents of current state to another GPULayer.
	 * TODO: Still testing this.
	 * @private
	 */
	copyCurrentStateToGPULayer(layer: GPULayer) {
		const { _composer } = this;
		if (this === layer) throw new Error(`Can't call GPULayer.copyCurrentStateToGPULayer() on self.`);
		const copyProgram = _composer._copyProgramForType(this._internalType);
		_composer.step({
			program: copyProgram,
			input: this,
			output: layer,
		});
	}
	// saveCurrentStateToGPULayer(layer: GPULayer) {
	// 	// A method for saving a copy of the current state without a draw call.
	// 	// Draw calls are expensive, this optimization helps.
	// 	if (this.numBuffers < 2) {
	// 		throw new Error(`Can't call GPULayer.saveCurrentStateToGPULayer on GPULayer "${this.name}" with less than 2 buffers.`);
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
	// 	this.buffers[this.bufferIndex].texture = texture;
	// }

	/**	
	 * Init GLTexture/GLFramebuffer pairs for reading/writing GPULayer data.
	 * @private
	 */
	private _initBuffers(
		arrayOrImage?: GPULayerArray | number[] | HTMLImageElement,
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
			width,
			height,
		} = this;
		const { gl, _errorCallback } = _composer;

		let validatedArrayOrImage: GPULayerArray | HTMLImageElement | null = null;
		if (isArray(arrayOrImage)) validatedArrayOrImage = GPULayer.validateGPULayerArray(arrayOrImage as GPULayerArray | number[], this);
		else if (arrayOrImage?.constructor === HTMLImageElement) validatedArrayOrImage = arrayOrImage;
		// Init a texture for each buffer.
		for (let i = 0; i < numBuffers; i++) {
			const texture = gl.createTexture();
			if (!texture) {
				_errorCallback(`Could not init texture for GPULayer "${name}": ${gl.getError()}.`);
				return;
			}
			gl.bindTexture(gl.TEXTURE_2D, texture);

			// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, _glWrapS);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, _glWrapT);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, _glFilter);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, _glFilter);

			gl.texImage2D(gl.TEXTURE_2D, 0, _glInternalFormat, width, height, 0, _glFormat, _glType, validatedArrayOrImage as any as ArrayBufferView | null);
			
			// Save this buffer to the list.
			this._buffers.push(texture);
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
		const { numBuffers } = this;
		if (numBuffers === 1) return;
		// Increment bufferIndex.
		this._bufferIndex = (this.bufferIndex + 1) % numBuffers;
	}

	/**
	 * Decrement buffer index by 1.
	 */
	 decrementBufferIndex() {
		const { numBuffers } = this;
		if (numBuffers === 1) return;
		// Decrement bufferIndex.
		this._bufferIndex = (this.bufferIndex - 1 + numBuffers) % numBuffers;
	}

	/**
	 * Get the current state as a GPULayerState object.
	 */
	get currentState() {
		return this.getStateAtIndex(this.bufferIndex);
	}

	/**
	 * Get the current state as a WebGLTexture.
	 * Used internally.
	 * @private
	 */
	get _currentTexture() {
		const { _buffers, _bufferIndex, _textureOverrides } = this;
		if (_textureOverrides && _textureOverrides[_bufferIndex]) return _textureOverrides[_bufferIndex]!;
		return _buffers[_bufferIndex];
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
		let texture = _buffers[index];
		if (_textureOverrides && _textureOverrides[index]) texture = _textureOverrides[index]!;
		return {
			texture,
			layer: this,
		};
	}

	/**
	 * Increments the buffer index (if needed).
	 * @private
	 */
	_prepareForWrite(
		incrementBufferIndex: boolean,
	) {
		if (incrementBufferIndex) {
			this.incrementBufferIndex();
		}

		// We are going to do a data write, if we have overrides enabled, we can remove them.
		if (this._textureOverrides) {
			this._textureOverrides[this.bufferIndex] = undefined;
		}
	}

	setFromArray(array: GPULayerArray | number[]) {
		const {
			_composer,
			_glInternalFormat,
			_glFormat,
			_glType,
			width,
			height,
			_currentTexture,
		} = this;
		const { gl } = _composer;
		const validatedArray = GPULayer.validateGPULayerArray(array, this);
		gl.bindTexture(gl.TEXTURE_2D, _currentTexture);
		gl.texImage2D(gl.TEXTURE_2D, 0, _glInternalFormat, width, height, 0, _glFormat, _glType, validatedArray);
		// Unbind texture.
		gl.bindTexture(gl.TEXTURE_2D, null);
	}

	// setFromImage(image: HTMLImageElement) {
	// 	const { name, _composer, width, height, _currentTexture, _glInternalFormat, _glFormat, _glType, numComponents, type } = this;
	// 	const { gl } = _composer;
	// 	// Check compatibility.
	// 	if (!isValidImageType(type)) {
	// 		throw new Error(`GPULayer has invalid type ${type} for setFromImage(), valid types are: ${JSON.stringify(validImageTypes)}.`);
	// 	}
	// 	if (numComponents < 3) {
	// 		throw new Error(`GPULayer has invalid numComponents ${numComponents} for setFromImage(), must have either 3 (RGB) or 4 (RGBA) components.`);
	// 	}
	// 	if (image.width !== width || image.height !== height) {
	// 		throw new Error(`Invalid image dimensions [${image.width}, ${image.height}] for GPULayer "${name}" with dimensions [${width}, ${height}].  Call GPULayer.resize(width, height, image) instead.`);
	// 	}
	// 	gl.bindTexture(gl.TEXTURE_2D, _currentTexture);
	// 	gl.texImage2D(gl.TEXTURE_2D, 0, _glInternalFormat, width, height, 0, _glFormat, _glType, image as any);
	// 	// Unbind texture.
	// 	gl.bindTexture(gl.TEXTURE_2D, null);
	// }

	resize(
		dimensions: number | number[],
		arrayOrImage?: HTMLImageElement | GPULayerArray | number[],
	) {
		const { name, _composer } = this;
		const { verboseLogging } = _composer;
		if (verboseLogging) console.log(`Resizing GPULayer "${name}" to ${JSON.stringify(dimensions)}.`);
		const { length, width, height } = GPULayer.calcGPULayerSize(dimensions, name, verboseLogging);
		this._length = length;
		this._width = width;
		this._height = height;
		this._destroyBuffers();
		this._initBuffers(arrayOrImage);
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
		this._clearValueVec4 = undefined;
	}

	/**
	 * Get the clearValue of the GPULayer.
	 */
	get clearValue() {
		return this._clearValue;
	}

	/**
	 * Get the clearValue of the GPULayer as a vec4, pad with zeros as needed.
	 */
	private get clearValueVec4() {
		let { _clearValueVec4 } = this;
		if (!_clearValueVec4) {
			const { clearValue } = this;
			_clearValueVec4 = [];
			if (isFiniteNumber(clearValue)) {
				_clearValueVec4.push(clearValue as number, clearValue as number, clearValue as number, clearValue as number);
			} else {
				_clearValueVec4.push(...clearValue as number[]);
				for (let j = _clearValueVec4.length; j < 4; j++) {
					_clearValueVec4.push(0);
				}
			}
			this._clearValueVec4 = _clearValueVec4;
		}
		return _clearValueVec4;
	}

	/**
	 * Clear all data in GPULayer to GPULayer.clearValue.
	 * @param applyToAllBuffers - Flag to apply to all buffers of GPULayer, or just the current output buffer.
	 */
	clear(applyToAllBuffers = false) {
		const { name, _composer, clearValueVec4, numBuffers, type } = this;
		const { verboseLogging } = _composer;
		if (verboseLogging) console.log(`Clearing GPULayer "${name}".`);

		const program = _composer._setValueProgramForType(type);
		program.setUniform('u_value', clearValueVec4);
		this.decrementBufferIndex(); // step() wil increment buffer index before draw, this way we clear in place.
		const endIndex = applyToAllBuffers ? numBuffers : 1;
		for (let i = 0; i < endIndex; i++) {
			// Write clear value to buffers.
			_composer.step({
				program,
				output: this,
			});
		}
		if (applyToAllBuffers) this.incrementBufferIndex(); // Get us back to the starting index.
	}

	private _getValuesSetup() {
		const { width, height, _composer, _currentTexture } = this;
		let { _valuesRaw } = this;
		const { gl } = _composer;

		// In case GPULayer was not the last output written to.
		bindFrameBuffer(_composer, this, _currentTexture);

		let { _glNumChannels, _glType, _glFormat, _internalType } = this;
		switch (_internalType) {
			case HALF_FLOAT:
				if (gl.FLOAT !== undefined) {
					// Firefox requires that RGBA/FLOAT is used for readPixels of float16 types.
					_glNumChannels = 4;
					_glFormat = gl.RGBA;
					_glType = gl.FLOAT;
					_valuesRaw = _valuesRaw || new Float32Array(width * height * _glNumChannels);
				} else {
					_valuesRaw = _valuesRaw || new Uint16Array(width * height * _glNumChannels);
				}
				// // The following works in Chrome.
				// _valuesRaw = _valuesRaw || new Uint16Array(width * height * glNumChannels);
				break
			case FLOAT:
				// Chrome and Firefox require that RGBA/FLOAT is used for readPixels of float32 types.
				// https://github.com/KhronosGroup/WebGL/issues/2747
				_glNumChannels = 4;
				_glFormat = gl.RGBA;
				_valuesRaw = _valuesRaw || new Float32Array(width * height * _glNumChannels);
				break;
			case UNSIGNED_BYTE:
				// We never hit glslVersion === GLSL1 anymore, see GPULayerHelpers.shouldCastIntTypeAsFloat for more info.
				// if (glslVersion === GLSL1) {
				// 	// Firefox requires that RGBA/UNSIGNED_BYTE is used for readPixels of unsigned byte types.
				// 	_glNumChannels = 4;
				// 	_glFormat = gl.RGBA;
				// 	_valuesRaw = _valuesRaw || new Uint8Array(width * height * _glNumChannels);
				// 	break;
				// }
				// Firefox requires that RGBA_INTEGER/UNSIGNED_INT is used for readPixels of unsigned int types.
				_glNumChannels = 4;
				_glFormat = (gl as WebGL2RenderingContext).RGBA_INTEGER;
				_glType = gl.UNSIGNED_INT;
				_valuesRaw = _valuesRaw || new Uint32Array(width * height * _glNumChannels);
				// // The following works in Chrome.
				// _valuesRaw = _valuesRaw || new Uint8Array(width * height * glNumChannels);
				break;
			case UNSIGNED_SHORT:
				// Firefox requires that RGBA_INTEGER/UNSIGNED_INT is used for readPixels of unsigned int types.
				_glNumChannels = 4;
				_glFormat = (gl as WebGL2RenderingContext).RGBA_INTEGER;
				_glType = gl.UNSIGNED_INT;
				_valuesRaw = _valuesRaw || new Uint32Array(width * height * _glNumChannels);
				// // The following works in Chrome.
				// _valuesRaw = _valuesRaw || new Uint16Array(width * height * glNumChannels);
				break;
			case UNSIGNED_INT:
				// Firefox requires that RGBA_INTEGER/UNSIGNED_INT is used for readPixels of unsigned int types.
				_glNumChannels = 4;
				_glFormat = (gl as WebGL2RenderingContext).RGBA_INTEGER;
				_valuesRaw = _valuesRaw || new Uint32Array(width * height * _glNumChannels);
				// // The following works in Chrome.
				// _valuesRaw = _valuesRaw || new Uint32Array(width * height * glNumChannels);
				break;
			case BYTE:
				// Firefox requires that RGBA_INTEGER/INT is used for readPixels of int types.
				_glNumChannels = 4;
				_glFormat = (gl as WebGL2RenderingContext).RGBA_INTEGER;
				_glType = gl.INT;
				_valuesRaw = _valuesRaw || new Int32Array(width * height * _glNumChannels);
				// // The following works in Chrome.
				// _valuesRaw = _valuesRaw || new Int8Array(width * height * glNumChannels);
				break;
			case SHORT:
				// Firefox requires that RGBA_INTEGER/INT is used for readPixels of int types.
				_glNumChannels = 4;
				_glFormat = (gl as WebGL2RenderingContext).RGBA_INTEGER;
				_glType = gl.INT;
				_valuesRaw = _valuesRaw || new Int32Array(width * height * _glNumChannels);
				// // The following works in Chrome.
				// _valuesRaw = _valuesRaw || new Int16Array(width * height * glNumChannels);
				break;
			case INT:
				// Firefox requires that RGBA_INTEGER/INT is used for readPixels of int types.
				_glNumChannels = 4;
				_glFormat = (gl as WebGL2RenderingContext).RGBA_INTEGER;
				_valuesRaw = _valuesRaw || new Int32Array(width * height * _glNumChannels);
				// // The following works in Chrome.
				// _valuesRaw = _valuesRaw || new Int32Array(width * height * glNumChannels);
				break;
			default:
				throw new Error(`Unsupported internalType ${_internalType} for getValues().`);
		}
		this._valuesRaw = _valuesRaw;
		if (readyToRead(gl)) {
			return { _glFormat, _glType, _valuesRaw, _glNumChannels, _internalType };
		} else {
			throw new Error(`Unable to read values from Buffer with status: ${gl.checkFramebufferStatus(gl.FRAMEBUFFER)}.`);
		}
	}

	private _getValuesPost(
		_valuesRaw: Float32Array | Uint16Array | Uint32Array | Int32Array,
		_glNumChannels: number,
		_internalType: GPULayerType,
	) {
		const { width, height, numComponents, type } = this;
		
		const OUTPUT_LENGTH = (this._length ? this._length : width * height) * numComponents;

		// Convert uint16 to float32 if needed.
		const handleFloat16Conversion = _internalType === HALF_FLOAT && _valuesRaw.constructor === Uint16Array;
		let { _valuesBufferView } = this;
		if (handleFloat16Conversion && !_valuesBufferView) {
			_valuesBufferView = new DataView((_valuesRaw as Uint16Array).buffer);
			this._valuesBufferView = _valuesBufferView;
		}
		

		// We may use a different internal type than the assigned type of the GPULayer.
		if (_valuesRaw.length === OUTPUT_LENGTH && arrayConstructorForType(type, true) === _valuesRaw.constructor) {
			this._values = _valuesRaw;
		} else if (!this._values) this._values = GPULayer.initArrayForType(type, OUTPUT_LENGTH, true);
		const { _values } = this;

		// In some cases glNumChannels may be > numComponents.
		if (_valuesBufferView || _values !== _valuesRaw || numComponents !== _glNumChannels) {
			for (let i = 0, length = width * height; i < length; i++) {
				const index1 = i * _glNumChannels;
				const index2 = i * numComponents;
				if (index2 >= OUTPUT_LENGTH) break;
				for (let j = 0; j < numComponents; j++) {
					if (_valuesBufferView) {
						_values[index2 + j] = getFloat16(_valuesBufferView, 2 * (index1 + j), true);
					} else {
						_values[index2 + j] = _valuesRaw[index1 + j];
					}
				}
			}
		}
		return _values;
	}

	/**
	 * Returns the current values of the GPULayer as a TypedArray.
	 * @returns - A TypedArray containing current state of GPULayer.
	 */
	getValues() {
		const { width, height, _composer } = this;
		const { gl } = _composer;
		const { _glFormat, _glType, _valuesRaw, _glNumChannels, _internalType } = this._getValuesSetup();
		// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/readPixels
		gl.readPixels(0, 0, width, height, _glFormat, _glType, _valuesRaw);
		return this._getValuesPost(_valuesRaw, _glNumChannels, _internalType);
	}

	/**
	 * Non-blocking function to return the current values of the GPULayer as a TypedArray.
	 * This only works for WebGL2 contexts, will fall back to getValues() if WebGL1 context.
	 * @returns - A TypedArray containing current state of GPULayer.
	 */
	async getValuesAsync() {
		const { width, height, _composer } = this;
		const { gl, isWebGL2 } = _composer;
		if (!isWebGL2) {
			// Async method is not supported for WebGL1.
			return this.getValues();
		}
		const { _glFormat, _glType, _valuesRaw, _glNumChannels, _internalType } = this._getValuesSetup();
		// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/readPixels
		await readPixelsAsync(gl as WebGL2RenderingContext, 0, 0, width, height, _glFormat, _glType, _valuesRaw);
		return this._getValuesPost(_valuesRaw, _glNumChannels, _internalType);
	}

	private _getCanvasWithImageData(multiplier?: number) {
		const values = this.getValues();
		const { width, height, numComponents, type } = this;

		multiplier = multiplier ||
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
		return canvas;
	}

	/**
	 * Get the current state of this GPULayer as an Image.
	 * @param params - Image parameters.
	 * @param params.multiplier - Multiplier to apply to data (defaults to 255 for FLOAT and HALF_FLOAT types, else 1).
	*/
	getImage(params?: {
		multiplier?: number,
	}) {
		if (params) {
			const validKeys = ['multiplier'];
			const keys = Object.keys(params);
			checkValidKeys(keys, validKeys, 'GPULayer.getImage(params)');
		}
		const canvas = this._getCanvasWithImageData(params && params.multiplier);
		const image = new Image();
		image.src = canvas.toDataURL();
		return image;
	}

	/**
	 * Save the current state of this GPULayer to png.
	 * @param params - PNG parameters.
	 * @param params.filename - PNG filename (no extension, defaults to the name of the GPULayer).
	 * @param params.dpi - PNG dpi (defaults to 72dpi).
	 * @param params.multiplier - Multiplier to apply to data before saving PNG (defaults to 255 for FLOAT and HALF_FLOAT types, else 1).
	 * @param params.callback - Optional callback when Blob is ready, default behavior saves the PNG using file-saver.
	*/
	savePNG(params: {
		filename?: string,
		dpi?: number,
		multiplier?: number,
		callback?: (blob: Blob, filename: string) => void,
	} = {}) {
		const validKeys = ['filename', 'dpi', 'multiplier', 'callback'];
		const keys = Object.keys(params);
		checkValidKeys(keys, validKeys, 'GPULayer.savePNG(params)');
		
		const { name } = this;
		const callback = params.callback || saveAs; // Default to saving the image with file-saver.
		const filename = params.filename || name; // Default to the name of this layer.

		const canvas = this._getCanvasWithImageData(params.multiplier);
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
		const { _threeRenderer, gl } = _composer;
		if (!_threeRenderer) {
			throw new Error('GPUComposer was not inited with a renderer.');
		}
		// Link webgl texture to threejs object.
		// This is not officially supported by threejs.
		if (numBuffers > 1) {
			throw new Error(`GPULayer "${name}" contains multiple WebGL textures (one for each buffer) that are flip-flopped during compute cycles, please choose a GPULayer with one buffer.  You can copy the current state of this GPULayer to a single buffer GPULayer during your render loop.`);
		}
		const offsetTextureProperties = _threeRenderer.properties.get(texture);
		gl.deleteTexture(offsetTextureProperties.__webglTexture);
		offsetTextureProperties.__webglTexture = currentState.texture;
		offsetTextureProperties.__webglInit = true;
	}

	/**
	 * Delete this GPULayer's framebuffers and textures.
	 * @private
	 */
	private _destroyBuffers() {
		const { _composer, _buffers } = this;
		const { gl } = _composer;
		_buffers.forEach(texture => {
			gl.deleteTexture(texture);
			disposeFramebuffers(gl, texture);
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

		if (this._values) delete this._values;
		if (this._valuesRaw) delete this._valuesRaw;
	}

	/** 
	 * These methods are defined in GPULayerHelpers.ts
	 */
	/**
	 * @private
	 */
	// @ts-ignore
	static initArrayForType(
		type: GPULayerType,
		length: number,
		halfFloatsAsFloats?: boolean,
	): GPULayerArray;
	/**
	 * @private
	 */
	// @ts-ignore
	static calcGPULayerSize(
		size: number | number[],
		name: string,
		verboseLogging: boolean,
	): { width: number, height: number, length?: number };
	/**
	 * @private
	 */
	// @ts-ignore
	static getGPULayerInternalWrap(
		params: {
			composer: GPUComposer,
			wrap: GPULayerWrap,
			internalFilter: GPULayerFilter,
			internalType: GPULayerType,
			name: string,
		},
	): GPULayerWrap;
	/**
	 * @private
	 */
	// @ts-ignore
	static getGPULayerInternalFilter(
		params: {
			composer: GPUComposer,
			filter: GPULayerFilter,
			wrapX: GPULayerWrap,
			wrapY: GPULayerWrap,
			internalType: GPULayerType,
			name: string,
		},
	): GPULayerFilter;
	/**
	 * @private
	 */
	// @ts-ignore
	static getGLTextureParameters(
		params: {
			composer: GPUComposer,
			name: string,
			numComponents: GPULayerNumComponents,
			internalType: GPULayerType,
		}
	): {
		glFormat: number,
		glInternalFormat: number,
		glType: number,
		glNumChannels: number,
	};
	/**
	 * @private
	 */
	// @ts-ignore
	static getGPULayerInternalType(
		params: {
			composer: GPUComposer,
			type: GPULayerType,
			name: string,
		},
	): GPULayerType;
	/**
	 * @private
	 */
	// @ts-ignore	
	static validateGPULayerArray(
		array: GPULayerArray | number[],
		layer: GPULayer,
	): GPULayerArray;
}