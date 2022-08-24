import { GPUComposer } from './GPUComposer';
import { GPULayerArray, GPULayerFilter, GPULayerNumComponents, GPULayerType, GPULayerWrap } from './constants';
import { Texture } from 'three';
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
    readonly wrapS: GPULayerWrap;
    /**
     * Vertical wrapping style for GPULayer, defaults to CLAMP_TO_EDGE.
     */
    readonly wrapT: GPULayerWrap;
    /**
     * Sets GPULayer as readonly or readwrite, defaults to false.
     */
    readonly writable: boolean;
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
     * @private
     */
    readonly _internalType: GPULayerType;
    /**
     * @private
     */
    readonly _glType: number;
    /**
     * @private
     */
    readonly _glNumChannels: number;
    /**
     * @private
     */
    readonly _internalFilter: GPULayerFilter;
    /**
     * @private
     */
    readonly _glFilter: number;
    /**
     * @private
     */
    readonly _internalWrapS: GPULayerWrap;
    /**
     * @private
     */
    readonly _glWrapS: number;
    /**
     * @private
     */
    readonly _internalWrapT: GPULayerWrap;
    /**
     * @private
     */
    readonly _glWrapT: number;
    private _textureOverrides?;
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
    constructor(composer: GPUComposer, params: {
        name: string;
        type: GPULayerType;
        numComponents: GPULayerNumComponents;
        dimensions: number | [number, number];
        array?: GPULayerArray | number[];
        filter?: GPULayerFilter;
        wrapS?: GPULayerWrap;
        wrapT?: GPULayerWrap;
        writable?: boolean;
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
     *
     * @private
     */
    _usingTextureOverrideForCurrentBuffer(): WebGLTexture | undefined;
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
     * Get the current state as a GLTexture.
     */
    get currentState(): WebGLTexture;
    /**
     * Get the previous state as a GLTexture (only available for GPULayers with numBuffers > 1).
     */
    get lastState(): WebGLTexture;
    /**
     * Get the state at a specified index as a GLTexture.
     */
    getStateAtIndex(index: number): WebGLTexture;
    /**
     * Binds this GPULayer's current framebuffer as the draw target.
     */
    private _bindFramebuffer;
    /**
     * Increments the buffer index (if needed) and binds next framebuffer as draw target.
     * @private
     */
    _prepareForWrite(incrementBufferIndex: boolean): void;
    setFromArray(array: GPULayerArray | number[], applyToAllBuffers?: boolean): void;
    resize(dimensions: number | [number, number], array?: GPULayerArray | number[]): void;
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
    /**
     * Returns the current values of the GPULayer as a TypedArray.
     * @returns - A TypedArray containing current state of GPULayer.
     */
    getValues(): GPULayerArray;
    /**
     * Save the current state of this GPULayer to png.
     * @param params - PNG parameters.
     * @param params.filename - PNG filename (no extension).
     * @param params.dpi - PNG dpi (defaults to 72dpi).
     * @param params.multiplier - Multiplier to apply to data before saving PNG (defaults to 255 for FLOAT and HALF_FLOAT types).
     * @param params.callback - Optional callback when Blob is ready, default behavior saves the PNG using FileSaver.js.
    */
    savePNG(params: {
        filename: string;
        dpi?: number;
        multiplier?: number;
        callback: (blob: Blob, filename: string) => void;
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
}
