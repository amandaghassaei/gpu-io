export declare type DataLayerArrayType = Float32Array | Uint8Array | Int8Array | Uint16Array | Int16Array | Uint32Array | Int32Array;
export declare type DataLayerType = 'float32' | 'float16' | 'uint8' | 'int8' | 'uint16' | 'int16' | 'uint32' | 'int32';
export declare type DataLayerNumComponents = 1 | 2 | 3 | 4;
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
    private readonly numComponents;
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
        numComponents: DataLayerNumComponents;
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
    bindOutputBuffer(incrementBufferIndex: boolean): void;
    resize(width: number, height: number, data?: DataLayerArrayType): void;
    private destroyBuffers;
    destroy(): void;
}
