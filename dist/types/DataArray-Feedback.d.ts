export declare type DataArrayArrayType = Float32Array | Uint8Array | Int8Array | Uint16Array | Int16Array;
export declare type DataArrayType = 'float32' | 'float16' | 'uint8' | 'int8' | 'uint16' | 'int16';
export declare type DataArrayNumComponents = 1 | 2 | 3 | 4;
export declare type DataArrayBuffer = {
    vertexArray: WebGLVertexArrayObject;
    buffer: WebGLBuffer;
};
export declare class DataArray {
    private readonly name;
    private readonly gl;
    private readonly errorCallback;
    private bufferIndex;
    readonly numBuffers: number;
    private readonly buffers;
    readonly length: number;
    private readonly type;
    private readonly numComponents;
    private readonly writable;
    private readonly glType;
    constructor(name: string, gl: WebGLRenderingContext | WebGL2RenderingContext, options: {
        length: number;
        type: DataArrayType;
        numComponents: DataArrayNumComponents;
        data?: DataArrayArrayType;
    }, errorCallback: (message: string) => void, writable: boolean, numBuffers: number);
    private checkType;
    private glTypeForType;
    private checkDataArray;
    private initBuffers;
    getCurrentStateArray(): WebGLVertexArrayObject;
    bindInputArray(location: number): void;
    bindOutputBuffer(index: number): void;
    private destroyBuffers;
    destroy(): void;
}
