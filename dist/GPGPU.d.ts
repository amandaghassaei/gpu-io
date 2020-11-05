declare type TextureType = 'float16' | 'uint8';
declare type TextureData = Uint8Array;
declare type TextureNumChannels = 1 | 2 | 3 | 4;
declare type ReadWrite = 'read' | 'write' | 'readwrite';
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
    constructor(gl: WebGLRenderingContext | WebGL2RenderingContext | null, canvasEl: HTMLCanvasElement, errorCallback?: (message: string) => void);
    private loadExtension;
    private loadFSRectPositions;
    private compileShader;
    initProgram(programName: string, fragmentShaderSource: string, uniforms?: {
        name: string;
        value: number | number[];
    }[], vertexShaderSource?: string): void;
    private uniformTypeForValue;
    setProgramUniform(programName: string, uniformName: string, value: number | number[]): void;
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
