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
    private setBlendMode;
    private addLayerToInputs;
    private passThroughLayerDataFromInputToOutput;
    private setOutputLayer;
    private setPositionAttribute;
    private setIndexAttribute;
    private setUVAttribute;
    private setVertexAttribute;
    step(params: {
        program: GPUProgram;
        input?: (DataLayer | WebGLTexture)[] | DataLayer | WebGLTexture;
        output?: DataLayer;
        shouldBlendAlpha?: boolean;
    }): void;
    stepBoundary(params: {
        program: GPUProgram;
        input?: (DataLayer | WebGLTexture)[] | DataLayer | WebGLTexture;
        output?: DataLayer;
        singleEdge?: 'LEFT' | 'RIGHT' | 'TOP' | 'BOTTOM';
        shouldBlendAlpha?: boolean;
    }): void;
    stepNonBoundary(params: {
        program: GPUProgram;
        input?: (DataLayer | WebGLTexture)[] | DataLayer | WebGLTexture;
        output?: DataLayer;
        shouldBlendAlpha?: boolean;
    }): void;
    stepCircle(params: {
        program: GPUProgram;
        position: [number, number];
        radius: number;
        input?: (DataLayer | WebGLTexture)[] | DataLayer | WebGLTexture;
        output?: DataLayer;
        numSegments?: number;
        shouldBlendAlpha?: boolean;
    }): void;
    stepSegment(params: {
        program: GPUProgram;
        position1: [number, number];
        position2: [number, number];
        thickness: number;
        input?: (DataLayer | WebGLTexture)[] | DataLayer | WebGLTexture;
        output?: DataLayer;
        endCaps?: boolean;
        numCapSegments?: number;
        shouldBlendAlpha?: boolean;
    }): void;
    stepPolyline(params: {
        program: GPUProgram;
        positions: [number, number][];
        thickness: number;
        input?: (DataLayer | WebGLTexture)[] | DataLayer | WebGLTexture;
        output?: DataLayer;
        closeLoop?: boolean;
        includeUVs?: boolean;
        includeNormals?: boolean;
        shouldBlendAlpha?: boolean;
    }): void;
    stepPoints(params: {
        positions: DataLayer;
        program?: GPUProgram;
        input?: (DataLayer | WebGLTexture)[] | DataLayer | WebGLTexture;
        output?: DataLayer;
        pointSize?: number;
        count?: number;
        color?: [number, number, number];
        wrapX?: boolean;
        wrapY?: boolean;
        shouldBlendAlpha?: boolean;
    }): void;
    drawVectorField(params: {
        field: DataLayer;
        program?: GPUProgram;
        input?: (DataLayer | WebGLTexture)[] | DataLayer | WebGLTexture;
        output?: DataLayer;
        vectorSpacing?: number;
        vectorScale?: number;
        color?: [number, number, number];
        shouldBlendAlpha?: boolean;
    }): void;
    drawLines(params: {
        positions: DataLayer;
        indices: Float32Array | Uint16Array | Uint32Array | Int16Array | Int32Array;
        program?: GPUProgram;
        input?: (DataLayer | WebGLTexture)[] | DataLayer | WebGLTexture;
        output?: DataLayer;
        count?: number;
        color?: [number, number, number];
        wrapX?: boolean;
        wrapY?: boolean;
        shouldBlendAlpha?: boolean;
    }): void;
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
