import { DataLayer } from './DataLayer';
import { DataLayerArrayType, DataLayerFilterType, DataLayerNumComponents, DataLayerType, DataLayerWrapType, UniformDataType, UniformValueType, GLSLVersion, TextureFormatType, TextureDataType } from './Constants';
import { GPUProgram } from './GPUProgram';
import { WebGLRenderer, Texture } from 'three';
declare type ErrorCallback = (message: string) => void;
export declare class WebGLCompute {
    readonly gl: WebGLRenderingContext | WebGL2RenderingContext;
    readonly glslVersion: GLSLVersion;
    private width;
    private height;
    private errorState;
    private readonly errorCallback;
    private renderer?;
    private readonly maxNumTextures;
    private _quadPositionsBuffer?;
    private _boundaryPositionsBuffer?;
    private _circlePositionsBuffer?;
    private pointIndexArray?;
    private pointIndexBuffer?;
    private vectorFieldIndexArray?;
    private vectorFieldIndexBuffer?;
    readonly copyFloatProgram: GPUProgram;
    readonly copyIntProgram: GPUProgram;
    readonly copyUintProgram: GPUProgram;
    static initWithThreeRenderer(renderer: WebGLRenderer, params: {
        glslVersion?: GLSLVersion;
    }, errorCallback?: ErrorCallback): WebGLCompute;
    constructor(params: {
        canvas: HTMLCanvasElement;
        context?: WebGLRenderingContext | WebGL2RenderingContext | null;
        antialias?: boolean;
        glslVersion?: GLSLVersion;
    }, errorCallback?: ErrorCallback, renderer?: WebGLRenderer);
    isWebGL2(): boolean;
    private get quadPositionsBuffer();
    private get boundaryPositionsBuffer();
    private get circlePositionsBuffer();
    private initVertexBuffer;
    initProgram(params: {
        name: string;
        fragmentShader: string | WebGLShader;
        uniforms?: {
            name: string;
            value: UniformValueType;
            dataType: UniformDataType;
        }[];
        defines?: {
            [key: string]: string;
        };
    }): GPUProgram;
    initDataLayer(params: {
        name: string;
        dimensions: number | [number, number];
        type: DataLayerType;
        numComponents: DataLayerNumComponents;
        data?: DataLayerArrayType;
        filter?: DataLayerFilterType;
        wrapS?: DataLayerWrapType;
        wrapT?: DataLayerWrapType;
        writable?: boolean;
        numBuffers?: number;
    }): DataLayer;
    initTexture(params: {
        name: string;
        url: string;
        filter?: DataLayerFilterType;
        wrapS?: DataLayerWrapType;
        wrapT?: DataLayerWrapType;
        format?: TextureFormatType;
        type?: TextureDataType;
    }, callback: (texture: WebGLTexture) => void): WebGLTexture;
    onResize(canvas: HTMLCanvasElement): void;
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
    drawVectorField(program: GPUProgram, inputLayers: (DataLayer | WebGLTexture)[], outputLayer?: DataLayer, options?: {
        vectorScale?: number;
        shouldBlendAlpha?: boolean;
    }): void;
    getContext(): WebGLRenderingContext | WebGL2RenderingContext;
    getValues(dataLayer: DataLayer): DataLayerArrayType;
    private readyToRead;
    reset(): void;
    attachDataLayerToThreeTexture(dataLayer: DataLayer, texture: Texture): void;
    resetThreeState(): void;
    destroy(): void;
}
export {};
