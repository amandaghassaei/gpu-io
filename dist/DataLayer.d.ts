export declare type DataLayerArrayType = Float32Array | Uint8Array;
export declare type DataLayerType = 'float32' | 'float16' | 'uint8';
export declare type DataLayerNumChannels = 1 | 2 | 3 | 4;
export declare type DataLayerFilterType = 'LINEAR' | 'NEAREST';
export declare type DataLayerWrapType = 'REPEAT' | 'CLAMP_TO_EDGE' | 'MIRRORED_REPEAT';
export declare type DataLayerBuffer = {
    texture: WebGLTexture;
    framebuffer?: WebGLFramebuffer;
};
export declare class DataLayer {
    private readonly name;
    private readonly gl;
    private readonly errorCallback;
    private bufferIndex;
    readonly numBuffers: number;
    private readonly buffers;
    private width;
    private height;
    private readonly type;
    private readonly numChannels;
    private readonly glInternalFormat;
    private readonly glFormat;
    private readonly glType;
    private readonly glNumChannels;
    private readonly filter;
    private readonly wrapS;
    private readonly wrapT;
    private readonly writable;
    constructor(name: string, gl: WebGLRenderingContext | WebGL2RenderingContext, options: {
        width: number;
        height: number;
        type: DataLayerType;
        numChannels: DataLayerNumChannels;
        data?: DataLayerArrayType;
        filter?: DataLayerFilterType;
        wrapS?: DataLayerWrapType;
        wrapT?: DataLayerWrapType;
    }, errorCallback: (message: string) => void, writable: boolean, numBuffers: number);
    private checkFilter;
    private checkType;
    private checkDataArray;
    private getGLTextureParameters;
    private initBuffers;
    getCurrentStateTexture(): WebGLTexture;
    setAsRenderTarget(incrementBufferIndex: boolean): void;
    resize(width: number, height: number, data?: DataLayerArrayType): void;
    private destroyBuffers;
    destroy(): void;
}
