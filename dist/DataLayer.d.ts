export declare type DataArrayType = Uint8Array;
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
    private readonly glInternalFormat;
    private readonly glFormat;
    private readonly glType;
    private readonly writable;
    constructor(name: string, gl: WebGLRenderingContext | WebGL2RenderingContext, options: {
        width: number;
        height: number;
        glInternalFormat: number;
        glFormat: number;
        glType: number;
        data?: DataArrayType;
    }, errorCallback: (message: string) => void, numBuffers: number, writable: boolean);
    private initBuffers;
    getCurrentStateTexture(): WebGLTexture;
    getLastStateTexture(): WebGLTexture;
    setAsRenderTarget(incrementBufferIndex: boolean): void;
    resize(width: number, height: number, data?: DataArrayType): void;
    private destroyBuffers;
    destroy(): void;
}
