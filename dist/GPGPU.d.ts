import { DataLayer, DataLayerArrayType, DataLayerFilterType, DataLayerNumComponents, DataLayerType, DataLayerWrapType } from './DataLayer';
import { GPUProgram, UniformValueType, UniformDataType } from './GPUProgram';
import { DataArray, DataArrayArrayType, DataArrayNumComponents, DataArrayType } from './DataArray-Feedback';
export declare class GPGPU {
    private readonly gl;
    private width;
    private height;
    private errorState;
    private readonly errorCallback;
    private readonly defaultVertexShader;
    private readonly quadPositionsBuffer;
    private readonly boundaryPositionsBuffer;
    private readonly circlePositionsBuffer;
    private readonly passThroughProgram;
    constructor(gl: WebGLRenderingContext | WebGL2RenderingContext | null, canvasEl: HTMLCanvasElement, errorCallback?: (message: string) => void);
    private initVertexBuffer;
    initProgram(name: string, fragmentShaderSource: string, uniforms?: {
        name: string;
        value: UniformValueType;
        dataType: UniformDataType;
    }[], vertexShaderSource?: string): GPUProgram;
    initDataLayer(name: string, options: {
        width: number;
        height: number;
        type: DataLayerType;
        numComponents: DataLayerNumComponents;
        data?: DataLayerArrayType;
        filter?: DataLayerFilterType;
        wrapS?: DataLayerWrapType;
        wrapT?: DataLayerWrapType;
    }, writable?: boolean, numBuffers?: number): DataLayer;
    initDataArray(name: string, options: {
        length: number;
        type: DataArrayType;
        numComponents: DataArrayNumComponents;
        data?: DataArrayArrayType;
    }, writable?: boolean, numBuffers?: number): DataArray;
    onResize(canvasEl: HTMLCanvasElement): void;
    private setDrawInputsAndOutputs;
    private setOutputLayer;
    private setPositionAttribute;
    step(program: GPUProgram, inputLayers?: DataLayer[], outputLayer?: DataLayer): void;
    stepBoundary(program: GPUProgram, inputLayers?: DataLayer[], outputLayer?: DataLayer): void;
    stepNonBoundary(program: GPUProgram, inputLayers?: DataLayer[], outputLayer?: DataLayer): void;
    stepCircle(program: GPUProgram, position: [number, number], // position is in screen space coords.
    radius: number, // radius is in px.
    inputLayers?: DataLayer[], outputLayer?: DataLayer): void;
    reset(): void;
    destroy(): void;
}
