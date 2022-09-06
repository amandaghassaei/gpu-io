import { GPULayer } from './GPULayer';
import { GPULayerFilter, GPULayerType, GPULayerWrap, GLSLVersion, WEBGL2, WEBGL1, EXPERIMENTAL_WEBGL, TextureFormat, TextureType, PROGRAM_NAME_INTERNAL, CompileTimeVars, ErrorCallback, GLSLPrecision, GPULayerState } from './constants';
import { GPUProgram } from './GPUProgram';
import { WebGLRenderer } from 'three';
export declare class GPUComposer {
    readonly canvas: HTMLCanvasElement;
    readonly gl: WebGLRenderingContext | WebGL2RenderingContext;
    readonly glslVersion: GLSLVersion;
    readonly intPrecision: GLSLPrecision;
    readonly floatPrecision: GLSLPrecision;
    private _width;
    private _height;
    private _errorThrown;
    /**
     * @private
     */
    readonly _errorCallback: ErrorCallback;
    /**
     * @private
     */
    readonly _renderer?: WebGLRenderer;
    private readonly _maxNumTextures;
    private _quadPositionsBuffer?;
    private _boundaryPositionsBuffer?;
    private _circlePositionsBuffer;
    private _pointIndexArray?;
    private _pointIndexBuffer?;
    private _vectorFieldIndexArray?;
    private _vectorFieldIndexBuffer?;
    private _indexedLinesIndexBuffer?;
    /**
     * @private
     */
    readonly _extensions: {
        [key: string]: any;
    };
    private readonly _copyPrograms;
    private readonly _setValuePrograms;
    private _wrappedLineColorProgram?;
    private readonly _vectorMagnitudePrograms;
    /**
     * Vertex shaders are shared across all GPUProgram instances.
     * @private
     */
    readonly _vertexShaders: {
        [key in PROGRAM_NAME_INTERNAL]: {
            src: string;
            shader?: WebGLProgram;
            defines?: CompileTimeVars;
        };
    };
    verboseLogging: boolean;
    private _lastTickTime?;
    private _lastTickFPS?;
    private _numTicks;
    constructor(params: {
        canvas: HTMLCanvasElement;
        context?: WebGLRenderingContext | WebGL2RenderingContext;
        contextID?: typeof WEBGL2 | typeof WEBGL1 | typeof EXPERIMENTAL_WEBGL | string;
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
    static initWithThreeRenderer(renderer: WebGLRenderer, params?: {
        verboseLogging?: boolean;
        errorCallback?: ErrorCallback;
    }): GPUComposer;
    isWebGL2(): boolean;
    private _glslKeyForType;
    /**
     *
     * @private
     */
    _setValueProgramForType(type: GPULayerType): GPUProgram;
    private _copyProgramForType;
    private _getWrappedLineColorProgram;
    private _vectorMagnitudeProgramForType;
    private _getQuadPositionsBuffer;
    private _getBoundaryPositionsBuffer;
    private _getCirclePositionsBuffer;
    private _initVertexBuffer;
    /**
     * Used internally, see GPULayer.clone() for public API.
     * @private
     */
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
    /**
     *
     * @private
     */
    _getVertexShaderWithName(name: PROGRAM_NAME_INTERNAL, programName: string): WebGLProgram | undefined;
    resize(width: number, height: number): void;
    private _drawSetup;
    private _setBlendMode;
    private _indexOfLayerInArray;
    private _addLayerToInputs;
    private _passThroughLayerDataFromInputToOutput;
    private _setOutputLayer;
    private _setVertexAttribute;
    private _setPositionAttribute;
    private _setIndexAttribute;
    private _setUVAttribute;
    step(params: {
        program: GPUProgram;
        input?: (GPULayer | GPULayerState)[] | GPULayer | GPULayerState;
        output?: GPULayer;
        shouldBlendAlpha?: boolean;
    }): void;
    stepBoundary(params: {
        program: GPUProgram;
        input?: (GPULayer | GPULayerState)[] | GPULayer | GPULayerState;
        output?: GPULayer;
        singleEdge?: 'LEFT' | 'RIGHT' | 'TOP' | 'BOTTOM';
        shouldBlendAlpha?: boolean;
    }): void;
    stepNonBoundary(params: {
        program: GPUProgram;
        input?: (GPULayer | GPULayerState)[] | GPULayer | GPULayerState;
        output?: GPULayer;
        shouldBlendAlpha?: boolean;
    }): void;
    stepCircle(params: {
        program: GPUProgram;
        position: [number, number];
        radius: number;
        input?: (GPULayer | GPULayerState)[] | GPULayer | GPULayerState;
        output?: GPULayer;
        numSegments?: number;
        shouldBlendAlpha?: boolean;
    }): void;
    stepSegment(params: {
        program: GPUProgram;
        position1: [number, number];
        position2: [number, number];
        thickness: number;
        input?: (GPULayer | GPULayerState)[] | GPULayer | GPULayerState;
        output?: GPULayer;
        endCaps?: boolean;
        numCapSegments?: number;
        shouldBlendAlpha?: boolean;
    }): void;
    stepPolyline(params: {
        program: GPUProgram;
        positions: [number, number][];
        thickness: number;
        input?: (GPULayer | GPULayerState)[] | GPULayer | GPULayerState;
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
        input?: (GPULayer | GPULayerState)[] | GPULayer | GPULayerState;
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
        input?: (GPULayer | GPULayerState)[] | GPULayer | GPULayerState;
        output?: GPULayer;
        count?: number;
        closeLoop?: boolean;
        shouldBlendAlpha?: boolean;
    }): void;
    drawLayerAsPoints(params: {
        positions: GPULayer;
        program?: GPUProgram;
        input?: (GPULayer | GPULayerState)[] | GPULayer | GPULayerState;
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
        input?: (GPULayer | GPULayerState)[] | GPULayer | GPULayerState;
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
        input?: (GPULayer | GPULayerState)[] | GPULayer | GPULayerState;
        output?: GPULayer;
        vectorSpacing?: number;
        vectorScale?: number;
        color?: [number, number, number];
        shouldBlendAlpha?: boolean;
    }): void;
    drawLayerMagnitude(params: {
        data: GPULayer;
        input?: (GPULayer | GPULayerState)[] | GPULayer | GPULayerState;
        output?: GPULayer;
        scale?: number;
        color?: [number, number, number];
        shouldBlendAlpha?: boolean;
    }): void;
    resetThreeState(): void;
    /**
     * Save the current state of the canvas to png.
     * @param params - PNG parameters.
     * @param params.filename - PNG filename (no extension).
     * @param params.dpi - PNG dpi (defaults to 72dpi).
     * @param params.callback - Optional callback when Blob is ready, default behavior saves the PNG using FileSaver.js.
    */
    savePNG(params?: {
        filename?: string;
        dpi?: number;
        multiplier?: number;
        callback?: (blob: Blob, filename: string) => void;
    }): void;
    tick(): {
        fps: number;
        milliseconds: number;
        numTicks?: undefined;
    } | {
        fps: number;
        numTicks: number;
        milliseconds?: undefined;
    };
    dispose(): void;
}
