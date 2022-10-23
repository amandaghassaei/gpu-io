import type { Texture } from 'three';
import type { GPUComposer } from './GPUComposer';
import { GPULayerArray, GPULayerFilter, GPULayerNumComponents, GPULayerType, GPULayerWrap, GPULayerState, ImageFormat, ImageType } from './constants';
export declare class GPULayer {
    private readonly _composer;
    /**
     * Name of GPULayer, used for error logging.
     */
    readonly name: string;
    /**
     * Data type represented by GPULayer.
     */
    readonly type: GPULayerType;
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
    private _clearValue;
    private _bufferIndex;
    readonly numBuffers: number;
    private readonly _buffers;
    private _length?;
    private _width;
    private _height;
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
    private _textureOverrides?;
    private _values?;
    private _valuesRaw?;
    private _valuesBufferView?;
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
     */
    static initFromImageURL(composer: GPUComposer, params: {
        name: string;
        url: string;
        type?: ImageType;
        format?: ImageFormat;
        filter?: GPULayerFilter;
        wrapX?: GPULayerWrap;
        wrapY?: GPULayerWrap;
    }): Promise<GPULayer>;
    /**
     * Create a GPULayer.
     * @param composer - The current GPUComposer instance.
     * @param params  - GPULayer parameters.
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
    constructor(composer: GPUComposer, params: {
        name: string;
        type: GPULayerType;
        numComponents: GPULayerNumComponents;
        dimensions: number | number[];
        array?: GPULayerArray | number[];
        filter?: GPULayerFilter;
        wrapX?: GPULayerWrap;
        wrapY?: GPULayerWrap;
        numBuffers?: number;
        clearValue?: number | number[];
    });
    /**
     * The width of the GPULayer array.
     */
    get width(): number;
    /**
     * The height of the GPULayer array.
     */
    get height(): number;
    /**
     * The length of the GPULayer array (only available to 1D GPULayers).
     */
    get length(): number;
    /**
     * Returns whether the GPULayer was inited as a 1D array (rather than 2D).
     * @returns - true if GPULayer is 1D, else false.
     */
    is1D(): boolean;
    /**
     * Returns whether the GPULayer was inited as a 2D array (rather than 1D).
     * @returns - true if GPULayer is 2D, else false.
     */
    is2D(): boolean;
    /**
     * Test whether the current buffer index has override enabled.
     * @private
     */
    _usingTextureOverrideForCurrentBuffer(): boolean;
    /**
     * Copy contents of current state to another GPULayer.
     * TODO: Still testing this.
     * @private
     */
    copyCurrentStateToGPULayer(layer: GPULayer): void;
    /**
     * Init GLTexture/GLFramebuffer pairs for reading/writing GPULayer data.
     * @private
     */
    private _initBuffers;
    /**
     * Get buffer index of the current state.
     */
    get bufferIndex(): number;
    /**
     * Increment buffer index by 1.
     */
    incrementBufferIndex(): void;
    /**
     * Decrement buffer index by 1.
     */
    decrementBufferIndex(): void;
    /**
     * Get the current state as a GPULayerState object.
     */
    get currentState(): GPULayerState;
    /**
     * Get the current state as a WebGLTexture.
     * Used internally.
     * @private
     */
    get _currentTexture(): WebGLTexture;
    /**
     * Get the previous state as a GPULayerState object (only available for GPULayers with numBuffers > 1).
     */
    get lastState(): GPULayerState;
    /**
     * Get the state at a specified index as a GPULayerState object.
     */
    getStateAtIndex(index: number): GPULayerState;
    /**
     * Increments the buffer index (if needed).
     * @private
     */
    _prepareForWrite(incrementBufferIndex: boolean): void;
    setFromArray(array: GPULayerArray | number[]): void;
    resize(dimensions: number | number[], arrayOrImage?: HTMLImageElement | GPULayerArray | number[]): void;
    /**
     * Set the clearValue of the GPULayer, which is applied during GPULayer.clear().
     */
    set clearValue(clearValue: number | number[]);
    /**
     * Get the clearValue of the GPULayer.
     */
    get clearValue(): number | number[];
    /**
     * Clear all data in GPULayer to GPULayer.clearValue.
     * @param applyToAllBuffers - Flag to apply to all buffers of GPULayer, or just the current output buffer.
     */
    clear(applyToAllBuffers?: boolean): void;
    private _getValuesSetup;
    private _getValuesPost;
    /**
     * Returns the current values of the GPULayer as a TypedArray.
     * @returns - A TypedArray containing current state of GPULayer.
     */
    getValues(): GPULayerArray;
    /**
     * Non-blocking function to return the current values of the GPULayer as a TypedArray.
     * This only works for WebGL2 contexts, will fall back to getValues() if WebGL1 context.
     * @returns - A TypedArray containing current state of GPULayer.
     */
    getValuesAsync(): Promise<GPULayerArray>;
    /**
     * Save the current state of this GPULayer to png.
     * @param params - PNG parameters.
     * @param params.filename - PNG filename (no extension, defaults to the name of the GPULayer).
     * @param params.dpi - PNG dpi (defaults to 72dpi).
     * @param params.multiplier - Multiplier to apply to data before saving PNG (defaults to 255 for FLOAT and HALF_FLOAT types, else 1).
     * @param params.callback - Optional callback when Blob is ready, default behavior saves the PNG using file-saver.
    */
    savePNG(params?: {
        filename?: string;
        dpi?: number;
        multiplier?: number;
        callback?: (blob: Blob, filename: string) => void;
    }): void;
    /**
     * Attach the output buffer of this GPULayer to a Threejs Texture object.
     * @param {Texture} texture - Threejs texture object.
     */
    attachToThreeTexture(texture: Texture): void;
    /**
     * Delete this GPULayer's framebuffers and textures.
     * @private
     */
    private _destroyBuffers;
    /**
     * Create a deep copy of GPULayer with current state copied over.
     * @param name - Name of new GPULayer as string.
     * @returns - Deep copy of GPULayer.
     */
    clone(name?: string): GPULayer;
    /**
     * Deallocate GPULayer instance and associated WebGL properties.
     */
    dispose(): void;
    /**
     * These methods are defined in GPULayerHelpers.ts
     */
    /**
     * @private
     */
    static initArrayForType(type: GPULayerType, length: number, halfFloatsAsFloats?: boolean): GPULayerArray;
    /**
     * @private
     */
    static calcGPULayerSize(size: number | number[], name: string, verboseLogging: boolean): {
        width: number;
        height: number;
        length?: number;
    };
    /**
     * @private
     */
    static getGPULayerInternalWrap(params: {
        composer: GPUComposer;
        wrap: GPULayerWrap;
        internalFilter: GPULayerFilter;
        internalType: GPULayerType;
        name: string;
    }): GPULayerWrap;
    /**
     * @private
     */
    static getGPULayerInternalFilter(params: {
        composer: GPUComposer;
        filter: GPULayerFilter;
        wrapX: GPULayerWrap;
        wrapY: GPULayerWrap;
        internalType: GPULayerType;
        name: string;
    }): GPULayerFilter;
    /**
     * @private
     */
    static getGLTextureParameters(params: {
        composer: GPUComposer;
        name: string;
        numComponents: GPULayerNumComponents;
        internalType: GPULayerType;
    }): {
        glFormat: number;
        glInternalFormat: number;
        glType: number;
        glNumChannels: number;
    };
    /**
     * @private
     */
    static getGPULayerInternalType(params: {
        composer: GPUComposer;
        type: GPULayerType;
        name: string;
    }): GPULayerType;
    /**
     * @private
     */
    static validateGPULayerArray(array: GPULayerArray | number[], layer: GPULayer): GPULayerArray;
}
