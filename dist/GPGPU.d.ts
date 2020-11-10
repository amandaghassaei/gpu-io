import { FLOAT_TYPE, INT_TYPE } from './constants';
import { DataLayer, DataArrayType } from './DataLayer';
declare type TextureType = 'float16' | 'uint8';
declare type TextureNumChannels = 1 | 2 | 3 | 4;
declare type UniformDataType = typeof FLOAT_TYPE | typeof INT_TYPE;
declare type UniformValueType = number | [number] | [number, number] | [number, number, number] | [number, number, number, number];
export declare class GPGPU {
    private readonly gl;
    private readonly isWebGL2;
    private readonly extensions;
    private width;
    private height;
    private errorState;
    private readonly errorCallback;
    private readonly programs;
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
    }[]): void;
    private uniformTypeForValue;
    setProgramUniform(programName: string, uniformName: string, value: UniformValueType, dataType: UniformDataType): void;
    private glTextureParameters;
    initDataLayer(options: {
        width: number;
        height: number;
        type: TextureType;
        numChannels: TextureNumChannels;
        data?: DataArrayType;
    }, writable?: boolean, numBuffers?: number): DataLayer;
    onResize(canvasEl: HTMLCanvasElement): void;
    private _step;
    step(programName: string, inputTextures?: WebGLTexture[], outputLayer?: DataLayer): void;
    stepBoundary(programName: string, inputTextures?: WebGLTexture[], outputLayer?: DataLayer): void;
    stepNonBoundary(programName: string, inputTextures?: WebGLTexture[], outputLayer?: DataLayer): void;
    stepCircle(programName: string, position: [number, number], // position is in screen space coords.
    radius: number, // radius is in px.
    inputTextures?: WebGLTexture[], outputLayer?: DataLayer): void;
    reset(): void;
}
export {};
