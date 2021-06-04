import { DataLayer, DataLayerArrayType, DataLayerFilterType, DataLayerNumComponents, DataLayerType, DataLayerWrapType } from './DataLayer';
import { GPUProgram, UniformValueType, UniformDataType } from './GPUProgram';
import { WebGLRenderer, Texture } from 'three';
declare type errorCallback = (message: string) => void;
export declare class GLCompute {
    private readonly gl;
    private width;
    private height;
    private errorState;
    private readonly errorCallback;
    private renderer?;
    private readonly maxNumTextures;
    private readonly defaultVertexShader;
    private readonly quadPositionsBuffer;
    private readonly boundaryPositionsBuffer;
    private readonly circlePositionsBuffer;
    private pointIndexArray?;
    private pointIndexBuffer?;
    readonly copyFloatProgram: GPUProgram;
    readonly copyIntProgram: GPUProgram;
    readonly copyUintProgram: GPUProgram;
    static initWithThreeRenderer(renderer: WebGLRenderer, errorCallback?: errorCallback): GLCompute;
    constructor(gl: WebGLRenderingContext | WebGL2RenderingContext | null, canvasEl: HTMLCanvasElement, options?: {
        antialias?: boolean;
    }, errorCallback?: errorCallback, renderer?: WebGLRenderer);
    private initVertexBuffer;
    initProgram(name: string, fragmentShaderOrSource: string | WebGLShader, uniforms?: {
        name: string;
        value: UniformValueType;
        dataType: UniformDataType;
    }[], defines?: {
        [key: string]: string;
    }, vertexShaderOrSource?: string | WebGLShader): GPUProgram;
    initDataLayer(name: string, options: {
        dimensions: number | [number, number];
        type: DataLayerType;
        numComponents: DataLayerNumComponents;
        data?: DataLayerArrayType;
        filter?: DataLayerFilterType;
        wrapS?: DataLayerWrapType;
        wrapT?: DataLayerWrapType;
    }, writable?: boolean, numBuffers?: number): DataLayer;
    initTexture(url: string): WebGLTexture;
    onResize(canvasEl: HTMLCanvasElement): void;
    private drawSetup;
    copyProgramForType(type: DataLayerType): GPUProgram;
    private setOutputLayer;
    private setPositionAttribute;
    private setIndexAttribute;
    step(program: GPUProgram, inputLayers?: (DataLayer | WebGLTexture)[], outputLayer?: DataLayer, // Undefined renders to screen.
    options?: {
        shouldBlendAlpha?: boolean;
    }): void;
    stepBoundary(program: GPUProgram, inputLayers?: (DataLayer | WebGLTexture)[], outputLayer?: DataLayer, // Undefined renders to screen.
    options?: {
        shouldBlendAlpha?: boolean;
        singleEdge?: 'LEFT' | 'RIGHT' | 'TOP' | 'BOTTOM';
    }): void;
    stepNonBoundary(program: GPUProgram, inputLayers?: (DataLayer | WebGLTexture)[], outputLayer?: DataLayer, // Undefined renders to screen.
    options?: {
        shouldBlendAlpha?: boolean;
    }): void;
    stepCircle(program: GPUProgram, position: [number, number], // position is in screen space coords.
    radius: number, // radius is in px.
    inputLayers?: (DataLayer | WebGLTexture)[], outputLayer?: DataLayer, // Undefined renders to screen.
    options?: {
        shouldBlendAlpha?: boolean;
    }): void;
    stepSegment(program: GPUProgram, position1: [number, number], // position is in screen space coords.
    position2: [number, number], // position is in screen space coords.
    radius: number, // radius is in px.
    inputLayers?: (DataLayer | WebGLTexture)[], outputLayer?: DataLayer, // Undefined renders to screen.
    options?: {
        shouldBlendAlpha?: boolean;
    }): void;
    drawPoints(program: GPUProgram, inputLayers: (DataLayer | WebGLTexture)[], outputLayer?: DataLayer, options?: {
        pointSize?: number;
        numPoints?: number;
        shouldBlendAlpha?: boolean;
    }): void;
    getContext(): WebGLRenderingContext | WebGL2RenderingContext;
    getValues(dataLayer: DataLayer): Float32Array | Uint32Array | Int32Array;
    readyToRead(): boolean;
    reset(): void;
    attachDataLayerToThreeTexture(dataLayer: DataLayer, texture: Texture): void;
    resetThreeState(): void;
    destroy(): void;
}
export {};
