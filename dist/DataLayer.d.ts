export declare type DataArrayType = Uint8Array;
export declare type DataLayerBuffer = {
    texture: WebGLTexture;
    framebuffer?: WebGLFramebuffer;
};
export declare class DataLayer {
    private bufferIndex;
    private numBuffers;
    private buffers;
    constructor(gl: WebGLRenderingContext | WebGL2RenderingContext, options: {
        width: number;
        height: number;
        glInternalFormat: number;
        glFormat: number;
        glType: number;
        data?: DataArrayType;
    }, errorCallback: (message: string) => void, numBuffers: number, writable: boolean);
    getCurrentStateTexture(): WebGLTexture;
    getLastStateTexture(): WebGLTexture;
    renderTo(gl: WebGLRenderingContext | WebGL2RenderingContext): void;
    destroy(): void;
}
