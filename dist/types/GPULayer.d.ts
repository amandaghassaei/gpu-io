import { GPUComposer } from './GPUComposer';
import { GPULayerArray, GPULayerFilter, GPULayerNumComponents, GPULayerType, GPULayerWrap } from './constants';
import { Texture } from 'three';
export declare class GPULayer {
    private readonly composer;
    readonly name: string;
    readonly type: GPULayerType;
    readonly numComponents: GPULayerNumComponents;
    readonly filter: GPULayerFilter;
    readonly wrapS: GPULayerWrap;
    readonly wrapT: GPULayerWrap;
    readonly writable: boolean;
    private _clearValue;
    private _bufferIndex;
    readonly numBuffers: number;
    private readonly buffers;
    private _length?;
    private _width;
    private _height;
    readonly glInternalFormat: number;
    readonly glFormat: number;
    readonly internalType: GPULayerType;
    readonly glType: number;
    readonly glNumChannels: number;
    readonly internalFilter: GPULayerFilter;
    readonly glFilter: number;
    readonly internalWrapS: GPULayerWrap;
    readonly glWrapS: number;
    readonly internalWrapT: GPULayerWrap;
    readonly glWrapT: number;
    private textureOverrides?;
    constructor(composer: GPUComposer, params: {
        name: string;
        dimensions: number | [number, number];
        type: GPULayerType;
        numComponents: GPULayerNumComponents;
        array?: GPULayerArray | number[];
        filter?: GPULayerFilter;
        wrapS?: GPULayerWrap;
        wrapT?: GPULayerWrap;
        writable?: boolean;
        numBuffers?: number;
        clearValue?: number | number[];
    });
    _usingTextureOverrideForCurrentBuffer(): WebGLTexture | undefined;
    private initBuffers;
    get bufferIndex(): number;
    incrementBufferIndex(): void;
    getStateAtIndex(index: number): WebGLTexture;
    get currentState(): WebGLTexture;
    get lastState(): WebGLTexture;
    _bindOutputBuffer(): void;
    _bindOutputBufferForWrite(incrementBufferIndex: boolean): void;
    setFromArray(array: GPULayerArray | number[], applyToAllBuffers?: boolean): void;
    resize(dimensions: number | [number, number], array?: GPULayerArray | number[]): void;
    get clearValue(): number | number[];
    set clearValue(clearValue: number | number[]);
    clear(applyToAllBuffers?: boolean): void;
    get width(): number;
    get height(): number;
    get length(): number;
    is1D(): boolean;
    getValues(): GPULayerArray;
    /**
     * Save the current state of this GPULayer to png.
     * @param {Object} params
     */
    savePNG(params: {
        filename: string;
        dpi?: number;
        multiplier?: number;
        callback: (data: string | Blob, filename?: string) => void;
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
    private destroyBuffers;
    /**
     * Deallocate GPULayer instance and associated WebGL properties.
     */
    dispose(): void;
    /**
     * Create a deep copy of GPULayer with current state copied over.
     * @param {string} [name] - Name of new GPULayer as string.
     * @returns {GPULayer} - Deep copy.
     */
    clone(name?: string): GPULayer;
}
