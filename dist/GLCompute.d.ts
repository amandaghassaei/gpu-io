import { DataLayer, DataLayerArrayType, DataLayerFilterType, DataLayerNumComponents, DataLayerType, DataLayerWrapType } from './DataLayer';
import { GPUProgram, UniformValueType, UniformDataType } from './GPUProgram';
export declare class GLCompute {
    private readonly gl;
    private width;
    private height;
    private errorState;
    private readonly errorCallback;
    private readonly defaultVertexShader;
    private readonly quadPositionsBuffer;
    private readonly boundaryPositionsBuffer;
    private readonly circlePositionsBuffer;
    private pointIndexArray?;
    private pointIndexBuffer?;
    private readonly passThroughProgram;
    constructor(gl: WebGLRenderingContext | WebGL2RenderingContext | null, canvasEl: HTMLCanvasElement, options?: {
        antialias?: boolean;
    }, errorCallback?: (message: string) => void);
    private initVertexBuffer;
    initProgram(name: string, fragmentShaderOrSource: string | WebGLShader, uniforms?: {
        name: string;
        value: UniformValueType;
        dataType: UniformDataType;
    }[], vertexShaderOrSource?: string | WebGLShader): GPUProgram;
    initDataLayer(name: string, options: {
        dimensions: number | [number, number];
        type: DataLayerType;
        numComponents: DataLayerNumComponents;
        data?: DataLayerArrayType;
        filter?: DataLayerFilterType;
        wrapS?: DataLayerWrapType;
        wrapT?: DataLayerWrapType;
    }, writable?: boolean, numBuffers?: number): DataLayer;
    onResize(canvasEl: HTMLCanvasElement): void;
    private drawSetup;
    private setOutputLayer;
    private setPositionAttribute;
    private setIndexAttribute;
    step(program: GPUProgram, inputLayers?: DataLayer[], outputLayer?: DataLayer, // Undefined renders to screen.
    options?: {
        shouldBlendAlpha?: boolean;
    }): void;
    stepBoundary(program: GPUProgram, inputLayers?: DataLayer[], outputLayer?: DataLayer, // Undefined renders to screen.
    options?: {
        shouldBlendAlpha?: boolean;
    }): void;
    stepNonBoundary(program: GPUProgram, inputLayers?: DataLayer[], outputLayer?: DataLayer, // Undefined renders to screen.
    options?: {
        shouldBlendAlpha?: boolean;
    }): void;
    stepCircle(program: GPUProgram, position: [number, number], // position is in screen space coords.
    radius: number, // radius is in px.
    inputLayers?: DataLayer[], outputLayer?: DataLayer, // Undefined renders to screen.
    options?: {
        shouldBlendAlpha?: boolean;
    }): void;
    drawPoints(program: GPUProgram, inputLayers: DataLayer[], outputLayer?: DataLayer, options?: {
        pointSize?: number;
        numPoints?: number;
        shouldBlendAlpha?: boolean;
    }): void;
    reset(): void;
    destroy(): void;
}
