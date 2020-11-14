import { DataLayer, DataLayerArrayType, DataLayerFilterType, DataLayerNumComponents, DataLayerType, DataLayerWrapType } from './DataLayer';
import { GPUProgram, UniformValueType, UniformDataType } from './GPUProgram';
import { DataArray } from './DataArray';
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
    }[]): GPUProgram;
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
    stepFeedback(program: GPUProgram, inputArrays: DataArray[] | undefined, outputArrays: DataArray[]): void;
    reset(): void;
    destroy(): void;
}
