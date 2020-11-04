import { FLOAT_1D_UNIFORM, FLOAT_2D_UNIFORM, FLOAT_3D_UNIFORM, IMAGE_UNIFORM } from './constants';
declare type TextureType = 'float16' | 'uint8';
declare type TextureData = Uint8Array;
declare type TextureNumChannels = 1 | 2 | 3 | 4;
declare type ReadWrite = 'read' | 'write' | 'readwrite';
declare type UniformType = typeof FLOAT_1D_UNIFORM | typeof FLOAT_2D_UNIFORM | typeof FLOAT_3D_UNIFORM | typeof IMAGE_UNIFORM;
export declare class GPGPU {
    private readonly canvasEl;
    private readonly gl;
    private errorState;
    private readonly errorCallback;
    private readonly programs;
    private readonly textures;
    private readonly framebuffers;
    private readonly shaders;
    private readonly fsRectVertexShader;
    private readonly linearFilterEnabled;
    constructor(gl: WebGLRenderingContext | WebGL2RenderingContext | null, canvasEl: HTMLCanvasElement, errorCallback?: (message: string) => never);
    private loadExtension;
    private loadFSRectPositions;
    private compileShader;
    createProgram(programName: string, fragmentShaderSource: string, uniforms?: {
        name: string;
        type: UniformType;
        value: number;
    }[], vertexShaderSource?: string): void;
    private setUniformForProgram;
    private initFramebufferForTexture;
    private glTextureFormatForNumChannels;
    private glTextureTypeForType;
    initTexture(textureName: string, width: number, height: number, type: TextureType, numChannels: TextureNumChannels, readwrite: ReadWrite, data: TextureData): void;
    setSize(width: number, height: number): void;
    step(programName: string, inputTextures: string[], outputTexture: string | null, // Null renders to screen.
    time?: number): void;
    swapTextures(texture1Name: string, texture2Name: string): void;
    reset(): void;
}
export {};
