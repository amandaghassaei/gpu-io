import { saveAs } from 'file-saver';
import { GPULayer } from './GPULayer';
import { GPULayerArray, GPULayerFilter, GPULayerType, GPULayerWrap, GLSLVersion, TextureFormat, TextureType, PROGRAM_NAME_INTERNAL, CompileTimeVars, ErrorCallback, GLSLPrecision } from './constants';
import { GPUProgram } from './GPUProgram';
import { WebGLRenderer, Texture } from 'three';
export declare class GPUComposer {
    readonly gl: WebGLRenderingContext | WebGL2RenderingContext;
    readonly glslVersion: GLSLVersion;
    readonly intPrecision: GLSLPrecision;
    readonly floatPrecision: GLSLPrecision;
    private width;
    private height;
    private errorState;
    readonly _errorCallback: ErrorCallback;
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
    private readonly copyPrograms;
    private readonly setValuePrograms;
    private _wrappedLineColorProgram?;
    private readonly vectorMagnitudePrograms;
    readonly _vertexShaders: {
        [key in PROGRAM_NAME_INTERNAL]: {
            src: string;
            shader?: WebGLProgram;
            defines?: CompileTimeVars;
        };
    };
    verboseLogging: boolean;
    static initWithThreeRenderer(renderer: WebGLRenderer, params?: {
        verboseLogging?: boolean;
        errorCallback?: ErrorCallback;
    }): GPUComposer;
    constructor(params: {
        canvas: HTMLCanvasElement;
        context?: WebGLRenderingContext | WebGL2RenderingContext | null;
        contextID?: 'webgl2' | 'webgl' | string;
        contextOptions?: {
            antialias?: boolean;
            [key: string]: any;
        };
        glslVersion?: GLSLVersion;
        intPrecision?: GLSLPrecision;
        floatPrecision?: GLSLPrecision;
        verboseLogging?: boolean;
        errorCallback?: ErrorCallback;
    });
    private glslKeyForType;
    _setValueProgramForType(type: GPULayerType): GPUProgram;
    private copyProgramForType;
    private get wrappedLineColorProgram();
    private vectorMagnitudeProgramForType;
    isWebGL2(): boolean;
    private get quadPositionsBuffer();
    private get boundaryPositionsBuffer();
    private getCirclePositionsBuffer;
    private initVertexBuffer;
    _cloneGPULayer(gpuLayer: GPULayer, name?: string): GPULayer;
    initTexture(params: {
        name: string;
        url: string;
        filter?: GPULayerFilter;
        wrapS?: GPULayerWrap;
        wrapT?: GPULayerWrap;
        format?: TextureFormat;
        type?: TextureType;
        onLoad?: (texture: WebGLTexture) => void;
    }): WebGLTexture;
    onResize(canvas: HTMLCanvasElement): void;
    private drawSetup;
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
        input?: (GPULayer | WebGLTexture)[] | GPULayer | WebGLTexture;
        output?: GPULayer;
        shouldBlendAlpha?: boolean;
    }): void;
    stepBoundary(params: {
        program: GPUProgram;
        input?: (GPULayer | WebGLTexture)[] | GPULayer | WebGLTexture;
        output?: GPULayer;
        singleEdge?: 'LEFT' | 'RIGHT' | 'TOP' | 'BOTTOM';
        shouldBlendAlpha?: boolean;
    }): void;
    stepNonBoundary(params: {
        program: GPUProgram;
        input?: (GPULayer | WebGLTexture)[] | GPULayer | WebGLTexture;
        output?: GPULayer;
        shouldBlendAlpha?: boolean;
    }): void;
    stepCircle(params: {
        program: GPUProgram;
        position: [number, number];
        radius: number;
        input?: (GPULayer | WebGLTexture)[] | GPULayer | WebGLTexture;
        output?: GPULayer;
        numSegments?: number;
        shouldBlendAlpha?: boolean;
    }): void;
    stepSegment(params: {
        program: GPUProgram;
        position1: [number, number];
        position2: [number, number];
        thickness: number;
        input?: (GPULayer | WebGLTexture)[] | GPULayer | WebGLTexture;
        output?: GPULayer;
        endCaps?: boolean;
        numCapSegments?: number;
        shouldBlendAlpha?: boolean;
    }): void;
    stepPolyline(params: {
        program: GPUProgram;
        positions: [number, number][];
        thickness: number;
        input?: (GPULayer | WebGLTexture)[] | GPULayer | WebGLTexture;
        output?: GPULayer;
        closeLoop?: boolean;
        includeUVs?: boolean;
        includeNormals?: boolean;
        shouldBlendAlpha?: boolean;
    }): void;
    stepTriangleStrip(params: {
        program: GPUProgram;
        positions: Float32Array;
        normals?: Float32Array;
        uvs?: Float32Array;
        input?: (GPULayer | WebGLTexture)[] | GPULayer | WebGLTexture;
        output?: GPULayer;
        count?: number;
        shouldBlendAlpha?: boolean;
    }): void;
    stepLines(params: {
        program: GPUProgram;
        positions: Float32Array;
        indices?: Uint16Array | Uint32Array | Int16Array | Int32Array;
        normals?: Float32Array;
        uvs?: Float32Array;
        input?: (GPULayer | WebGLTexture)[] | GPULayer | WebGLTexture;
        output?: GPULayer;
        count?: number;
        closeLoop?: boolean;
        shouldBlendAlpha?: boolean;
    }): void;
    drawLayerAsPoints(params: {
        positions: GPULayer;
        program?: GPUProgram;
        input?: (GPULayer | WebGLTexture)[] | GPULayer | WebGLTexture;
        output?: GPULayer;
        pointSize?: number;
        count?: number;
        color?: [number, number, number];
        wrapX?: boolean;
        wrapY?: boolean;
        shouldBlendAlpha?: boolean;
    }): void;
    drawLayerAsLines(params: {
        positions: GPULayer;
        indices?: Float32Array | Uint16Array | Uint32Array | Int16Array | Int32Array;
        program?: GPUProgram;
        input?: (GPULayer | WebGLTexture)[] | GPULayer | WebGLTexture;
        output?: GPULayer;
        count?: number;
        color?: [number, number, number];
        wrapX?: boolean;
        wrapY?: boolean;
        closeLoop?: boolean;
        shouldBlendAlpha?: boolean;
    }): void;
    drawLayerAsVectorField(params: {
        data: GPULayer;
        program?: GPUProgram;
        input?: (GPULayer | WebGLTexture)[] | GPULayer | WebGLTexture;
        output?: GPULayer;
        vectorSpacing?: number;
        vectorScale?: number;
        color?: [number, number, number];
        shouldBlendAlpha?: boolean;
    }): void;
    drawLayerMagnitude(params: {
        data: GPULayer;
        input?: (GPULayer | WebGLTexture)[] | GPULayer | WebGLTexture;
        output?: GPULayer;
        scale?: number;
        color?: [number, number, number];
        shouldBlendAlpha?: boolean;
    }): void;
    getValues(gpuLayer: GPULayer): GPULayerArray;
    private readyToRead;
    savePNG(GPULayer: GPULayer, filename?: string, dpi?: number, callback?: typeof saveAs): void;
    attachGPULayerToThreeTexture(GPULayer: GPULayer, texture: Texture): void;
    resetThreeState(): void;
    dispose(): void;
}
