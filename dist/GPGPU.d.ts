import { DataLayer, DataArrayType } from './DataLayer';
import { GPUProgram, UniformValueType, UniformDataType } from './GPUProgram';
declare type TextureType = 'float16' | 'uint8';
declare type TextureNumChannels = 1 | 2 | 3 | 4;
export declare class GPGPU {
    private readonly gl;
    private readonly isWebGL2;
    private readonly extensions;
    private width;
    private height;
    private errorState;
    private readonly errorCallback;
    private readonly shaders;
    private readonly defaultVertexShader;
    private readonly quadPositionsBuffer;
    private readonly boundaryPositionsBuffer;
    private readonly circlePositionsBuffer;
    private readonly linearFilterEnabled;
    constructor(gl: WebGLRenderingContext | WebGL2RenderingContext | null, canvasEl: HTMLCanvasElement, errorCallback?: (message: string) => void);
    private initVertexBuffer;
    private loadExtension;
    private compileShader;
    initProgram(programName: string, fragmentShaderSource: string, uniforms?: {
        name: string;
        value: UniformValueType;
        dataType: UniformDataType;
    }[]): GPUProgram | undefined;
    private glTextureParameters;
    initDataLayer(options: {
        width: number;
        height: number;
        type: TextureType;
        numChannels: TextureNumChannels;
        data?: DataArrayType;
    }, writable?: boolean, numBuffers?: number): DataLayer;
    onResize(canvasEl: HTMLCanvasElement): void;
    _step(program: GPUProgram, inputLayers: DataLayer[], outputLayer?: DataLayer): void;
    step(program: GPUProgram, inputLayers?: DataLayer[], outputLayer?: DataLayer): void;
    stepBoundary(program: GPUProgram, inputLayers?: DataLayer[], outputLayer?: DataLayer): void;
    stepNonBoundary(program: GPUProgram, inputLayers?: DataLayer[], outputLayer?: DataLayer): void;
    stepCircle(program: GPUProgram, position: [number, number], // position is in screen space coords.
    radius: number, // radius is in px.
    inputLayers?: DataLayer[], outputLayer?: DataLayer): void;
    reset(): void;
}
export {};
