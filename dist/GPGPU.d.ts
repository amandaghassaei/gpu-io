import { FLOAT_TYPE, INT_TYPE } from './constants';
declare type TextureType = 'float16' | 'uint8';
declare type TextureData = Uint8Array;
declare type TextureNumChannels = 1 | 2 | 3 | 4;
declare type UniformDataType = typeof FLOAT_TYPE | typeof INT_TYPE;
declare type UniformValueType = number | [number] | [number, number] | [number, number, number] | [number, number, number, number];
export declare class GPGPU {
    private readonly gl;
    private readonly isWebGL2;
    private width;
    private height;
    private errorState;
    private readonly errorCallback;
    private readonly programs;
    private readonly textures;
    private readonly framebuffers;
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
    private initFramebufferForTexture;
    private glTextureParameters;
    initTexture(textureName: string, width: number, height: number, type: TextureType, numChannels: TextureNumChannels, writable?: boolean, data?: TextureData, shouldOverwrite?: boolean): void;
    onResize(canvasEl: HTMLCanvasElement): void;
    private _step;
    step(programName: string, inputTextures?: string[], outputTexture?: string): void;
    stepBoundary(programName: string, inputTextures?: string[], outputTexture?: string): void;
    stepCircle(programName: string, position: [number, number], // position is in screen space coords.
    radius: number, // radius is in px.
    inputTextures?: string[], outputTexture?: string): void;
    swapTextures(texture1Name: string, texture2Name: string): void;
    reset(): void;
}
export {};
