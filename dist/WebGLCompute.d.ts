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
    private _circlePositionsBuffer;
    private pointIndexArray?;
    private pointIndexBuffer?;
    private vectorFieldIndexArray?;
    private vectorFieldIndexBuffer?;
    private indexedLinesIndexBuffer?;
    private readonly copyFloatProgram;
    private readonly copyIntProgram;
    private readonly copyUintProgram;
    private _singleColorProgram?;
    private _singleColorWithWrapCheckProgram?;
    static initWithThreeRenderer(renderer: WebGLRenderer, params: {
        glslVersion?: GLSLVersion;
    }, errorCallback?: ErrorCallback): WebGLCompute;
    constructor(params: {
        canvas: HTMLCanvasElement;
        context?: WebGLRenderingContext | WebGL2RenderingContext | null;
        antialias?: boolean;
        glslVersion?: GLSLVersion;
    }, errorCallback?: ErrorCallback, renderer?: WebGLRenderer);
    private get singleColorProgram();
    private get singleColorWithWrapCheckProgram();
    isWebGL2(): boolean;
    private get quadPositionsBuffer();
    private get boundaryPositionsBuffer();
    private getCirclePositionsBuffer;
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
        onLoad?: (texture: WebGLTexture) => void;
    }): WebGLTexture;
    onResize(canvas: HTMLCanvasElement): void;
    private drawSetup;
    copyProgramForType(type: DataLayerType): GPUProgram;
    private passThroughLayerDataFromInputToOutput;
    private setOutputLayer;
    private setPositionAttribute;
    private setIndexAttribute;
    step(program: GPUProgram, inputLayers?: DataLayer | (DataLayer | WebGLTexture)[], outputLayer?: DataLayer, // Undefined renders to screen.
    options?: {
        shouldBlendAlpha?: boolean;
    }): void;
    stepBoundary(program: GPUProgram, inputLayers?: DataLayer | (DataLayer | WebGLTexture)[], outputLayer?: DataLayer, // Undefined renders to screen.
    options?: {
        shouldBlendAlpha?: boolean;
        singleEdge?: 'LEFT' | 'RIGHT' | 'TOP' | 'BOTTOM';
    }): void;
    stepNonBoundary(program: GPUProgram, inputLayers?: DataLayer | (DataLayer | WebGLTexture)[], outputLayer?: DataLayer, // Undefined renders to screen.
    options?: {
        shouldBlendAlpha?: boolean;
    }): void;
    stepCircle(program: GPUProgram, position: [number, number], // position is in screen space coords.
    radius: number, // radius is in px.
    inputLayers?: DataLayer | (DataLayer | WebGLTexture)[], outputLayer?: DataLayer, // Undefined renders to screen.
    options?: {
        numSegments?: number;
        shouldBlendAlpha?: boolean;
    }): void;
    stepSegment(program: GPUProgram, position1: [number, number], // position is in screen space coords.
    position2: [number, number], // position is in screen space coords.
    thickness: number, // thickness is in px.
    inputLayers?: DataLayer | (DataLayer | WebGLTexture)[], outputLayer?: DataLayer, // Undefined renders to screen.
    options?: {
        endCaps?: boolean;
        numCapSegments?: number;
        shouldBlendAlpha?: boolean;
    }): void;
    stepPolyline(program: GPUProgram, vertices: [number, number][], thickness: number, // Thickness is in px.
    inputLayers?: DataLayer | (DataLayer | WebGLTexture)[], outputLayer?: DataLayer, // Undefined renders to screen.
    options?: {
        closeLoop: boolean;
        shouldBlendAlpha?: boolean;
    }): void;
    drawPoints(inputLayers: DataLayer | (DataLayer | WebGLTexture)[], options?: {
        pointSize?: number;
        count?: number;
        color?: [number, number, number];
        wrapX?: boolean;
        wrapY?: boolean;
        shouldBlendAlpha?: boolean;
    }, outputLayer?: DataLayer, program?: GPUProgram): void;
    drawVectorField(inputLayers: DataLayer | (DataLayer | WebGLTexture)[], options?: {
        vectorSpacing?: number;
        vectorScale?: number;
        color?: [number, number, number];
        shouldBlendAlpha?: boolean;
    }, outputLayer?: DataLayer, program?: GPUProgram): void;
    drawIndexedLines(inputLayers: DataLayer | (DataLayer | WebGLTexture)[], indices: Float32Array | Uint16Array | Uint32Array | Int16Array | Int32Array, options?: {
        count?: number;
        color?: [number, number, number];
        wrapX?: boolean;
        wrapY?: boolean;
        shouldBlendAlpha?: boolean;
    }, outputLayer?: DataLayer, program?: GPUProgram): void;
    getContext(): WebGLRenderingContext | WebGL2RenderingContext;
    getValues(dataLayer: DataLayer): DataLayerArrayType;
    private readyToRead;
    savePNG(dataLayer: DataLayer, filename?: string, dpi?: number): void;
    reset(): void;
    attachDataLayerToThreeTexture(dataLayer: DataLayer, texture: Texture): void;
    resetThreeState(): void;
    destroy(): void;
}
export {};
