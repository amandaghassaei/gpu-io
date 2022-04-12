import { saveAs } from 'file-saver';
import { DataLayer } from './DataLayer';
import { DataLayerArray, DataLayerFilter, DataLayerNumComponents, DataLayerType, DataLayerWrap, UniformType, UniformValue, GLSLVersion, TextureFormat, TextureType, PROGRAM_NAME_INTERNAL, CompileTimeVars, ErrorCallback } from './Constants';
import { GPUProgram } from './GPUProgram';
import { WebGLRenderer, Texture } from 'three';
export declare class WebGLCompute {
    readonly gl: WebGLRenderingContext | WebGL2RenderingContext;
    readonly glslVersion: GLSLVersion;
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
        glslVersion?: GLSLVersion;
        verboseLogging?: boolean;
    }, errorCallback?: ErrorCallback): WebGLCompute;
    constructor(params: {
        canvas: HTMLCanvasElement;
        context?: WebGLRenderingContext | WebGL2RenderingContext | null;
        contextID?: 'webgl2' | 'webgl' | string;
        contextOptions?: {
            antialias?: boolean;
            [key: string]: any;
        };
        glslVersion?: GLSLVersion;
        verboseLogging?: boolean;
    }, errorCallback?: ErrorCallback, renderer?: WebGLRenderer);
    private preprocessShader;
    _preprocessFragShader(shaderSource: string): string;
    _preprocessVertShader(shaderSource: string): string;
    private glslKeyForType;
    _setValueProgramForType(type: DataLayerType): GPUProgram;
    private copyProgramForType;
    private get wrappedLineColorProgram();
    private vectorMagnitudeProgramForType;
    isWebGL2(): boolean;
    private get quadPositionsBuffer();
    private get boundaryPositionsBuffer();
    private getCirclePositionsBuffer;
    private initVertexBuffer;
    initDataLayer(params: {
        name: string;
        dimensions: number | [number, number];
        type: DataLayerType;
        numComponents: DataLayerNumComponents;
        array?: DataLayerArray | number[];
        filter?: DataLayerFilter;
        wrapS?: DataLayerWrap;
        wrapT?: DataLayerWrap;
        writable?: boolean;
        numBuffers?: number;
        clearValue?: number | number[];
    }): DataLayer;
    initProgram(params: {
        name: string;
        fragmentShader: string | string[];
        uniforms?: {
            name: string;
            value: UniformValue;
            type: UniformType;
        }[];
        defines?: {
            [key: string]: string;
        };
    }): GPUProgram;
    _cloneDataLayer(dataLayer: DataLayer, name?: string): DataLayer;
    initTexture(params: {
        name: string;
        url: string;
        filter?: DataLayerFilter;
        wrapS?: DataLayerWrap;
        wrapT?: DataLayerWrap;
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
    stepTriangleStrip(params: {
        program: GPUProgram;
        positions: Float32Array;
        normals?: Float32Array;
        uvs?: Float32Array;
        input?: (DataLayer | WebGLTexture)[] | DataLayer | WebGLTexture;
        output?: DataLayer;
        count?: number;
        shouldBlendAlpha?: boolean;
    }): void;
    stepLines(params: {
        program: GPUProgram;
        positions: Float32Array;
        indices?: Uint16Array | Uint32Array | Int16Array | Int32Array;
        normals?: Float32Array;
        uvs?: Float32Array;
        input?: (DataLayer | WebGLTexture)[] | DataLayer | WebGLTexture;
        output?: DataLayer;
        count?: number;
        closeLoop?: boolean;
        shouldBlendAlpha?: boolean;
    }): void;
    drawLayerAsPoints(params: {
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
    drawLayerAsLines(params: {
        positions: DataLayer;
        indices?: Float32Array | Uint16Array | Uint32Array | Int16Array | Int32Array;
        program?: GPUProgram;
        input?: (DataLayer | WebGLTexture)[] | DataLayer | WebGLTexture;
        output?: DataLayer;
        count?: number;
        color?: [number, number, number];
        wrapX?: boolean;
        wrapY?: boolean;
        closeLoop?: boolean;
        shouldBlendAlpha?: boolean;
    }): void;
    drawLayerAsVectorField(params: {
        data: DataLayer;
        program?: GPUProgram;
        input?: (DataLayer | WebGLTexture)[] | DataLayer | WebGLTexture;
        output?: DataLayer;
        vectorSpacing?: number;
        vectorScale?: number;
        color?: [number, number, number];
        shouldBlendAlpha?: boolean;
    }): void;
    drawLayerMagnitude(params: {
        data: DataLayer;
        input?: (DataLayer | WebGLTexture)[] | DataLayer | WebGLTexture;
        output?: DataLayer;
        scale?: number;
        color?: [number, number, number];
        shouldBlendAlpha?: boolean;
    }): void;
    getValues(dataLayer: DataLayer): DataLayerArray;
    private readyToRead;
    savePNG(dataLayer: DataLayer, filename?: string, dpi?: number, callback?: typeof saveAs): void;
    attachDataLayerToThreeTexture(dataLayer: DataLayer, texture: Texture): void;
    resetThreeState(): void;
    dispose(): void;
}
