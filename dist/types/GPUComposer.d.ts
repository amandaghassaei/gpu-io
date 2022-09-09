import { GPULayer } from './GPULayer';
import { GPULayerFilter, GPULayerType, GPULayerWrap, GLSLVersion, WEBGL2, WEBGL1, EXPERIMENTAL_WEBGL, TextureFormat, TextureType, PROGRAM_NAME_INTERNAL, CompileTimeConstants, ErrorCallback, GLSLPrecision, GPULayerState, EXPERIMENTAL_WEBGL2 } from './constants';
import { GPUProgram } from './GPUProgram';
import { WebGLRenderer } from 'three';
export declare class GPUComposer {
    /**
     * The canvas element associated with this GPUcomposer.
     */
    readonly canvas: HTMLCanvasElement;
    /**
     * The WebGL context associated with this GPUcomposer.
     */
    readonly gl: WebGLRenderingContext | WebGL2RenderingContext;
    /**
     * The GLSL version being used by the GPUComposer.
     */
    readonly glslVersion: GLSLVersion;
    /**
     * The global integer precision to apply to shader programs.
     */
    readonly intPrecision: GLSLPrecision;
    /**
     * The global float precision to apply to shader programs.
     */
    readonly floatPrecision: GLSLPrecision;
    /**
     * Store the width and height of the current canvas at full res.
     */
    private _width;
    private _height;
    /**
     * @private
     */
    readonly _errorCallback: ErrorCallback;
    private _errorThrown;
    /**
     * @private
     */
    readonly _renderer?: WebGLRenderer;
    private readonly _maxNumTextures;
    /**
     * Precomputed vertex buffers (inited as needed).
     */
    private _quadPositionsBuffer?;
    private _boundaryPositionsBuffer?;
    private _circlePositionsBuffer;
    private _pointIndexArray?;
    private _pointIndexBuffer?;
    private _vectorFieldIndexArray?;
    private _vectorFieldIndexBuffer?;
    private _indexedLinesIndexBuffer?;
    /**
     * Cache vertex shader attribute locations.
     */
    private _vertexAttributeLocations;
    /**
     * @private
     */
    readonly _extensions: {
        [key: string]: any;
    };
    /**
     * Cache some generic programs for copying data.
     * These are needed for rendering partial screen geometries.
     */
    private readonly _copyPrograms;
    /**
     * Cache some generic programs for setting value from uniform.
     * These are used by GPULayer.clear(), among other things
     */
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
            compiledShaders: {
                [key: string]: WebGLShader;
            };
        };
    };
    /**
     * Flag to set GPUcomposer for verbose logging, defaults to false.
     */
    verboseLogging: boolean;
    /**
     * Variables for tracking fps of GPUComposer with tick().
     */
    private _lastTickTime?;
    private _lastTickFPS?;
    private _numTicks;
    /**
     * Create a GPUComposer.
     * @param params - GPUComposer parameters.
     * @param params.canvas - HTMLCanvasElement associated with this GPUComposer (you must add to DOM yourself).
     * @param params.context - Pass in a WebGL context for the GPUcomposer to user.
     * @param params.contextID - Set the contextID to use when initing a new WebGL context.
     * @param params.contextOptions - Options to pass to WebGL context on initialization.
     * @param params.glslVersion - Set the GLSL version to use, defaults to GLSL3 for WebGL2 contexts.
     * @param params.intPrecision - Set the global integer precision in shader programs.
     * @param params.floatPrecision - Set the global float precision in shader programs.
     * @param params.verboseLogging - Set the verbosity of GPUComposer logging (defaults to false).
     * @param params.errorCallback - Custom error handler, defaults to throwing an Error with message.
     */
    constructor(params: {
        canvas: HTMLCanvasElement;
        context?: WebGLRenderingContext | WebGL2RenderingContext;
        contextID?: typeof WEBGL2 | typeof WEBGL1 | typeof EXPERIMENTAL_WEBGL | typeof EXPERIMENTAL_WEBGL2 | string;
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
    /**
     * Create a GPUComposer from an existing THREE.WebGLRenderer that shares a single WebGL context.
     * @param renderer - Threejs WebGLRenderer.
     * @param params - GPUComposer parameters.
     * @param params.intPrecision - Set the global integer precision in shader programs.
     * @param params.floatPrecision - Set the global float precision in shader programs.
     * @param params.verboseLogging - Set the verbosity of GPUComposer logging (defaults to false).
     * @param params.errorCallback - Custom error handler, defaults to throwing an Error with message.
     * @returns
     */
    static initWithThreeRenderer(renderer: WebGLRenderer, params?: {
        intPrecision?: GLSLPrecision;
        floatPrecision?: GLSLPrecision;
        verboseLogging?: boolean;
        errorCallback?: ErrorCallback;
    }): GPUComposer;
    /**
     * Test whether this GPUComposer is using WebGL2 (may depend on browser support).
     * @returns
     */
    isWebGL2(): boolean;
    /**
     * Gets (and caches) generic set value programs for several input types.
     * Used for GPULayer.clear(), among other things.
     * @private
     */
    _setValueProgramForType(type: GPULayerType): GPUProgram;
    /**
     * Gets (and caches) generic copy programs for several input types.
     * Used for partial rendering to output, among other things.
     * @private
     */
    private _copyProgramForType;
    /**
     * Gets (and caches) a generic color program for wrapped line segment rendering.
     * @private
     */
    private _getWrappedLineColorProgram;
    /**
     * Gets (and caches) generic programs for rending vector magnitudes for several input types.
     * @private
     */
    private _vectorMagnitudeProgramForType;
    /**
     * Init a buffer for vertex shader attributes.
     * @private
     */
    private _initVertexBuffer;
    /**
     * Get (and cache) positions buffer for rendering full screen quads.
     * @private
     */
    _getQuadPositionsBuffer(): WebGLBuffer;
    /**
     * Get (and cache) positions buffer for rendering lines on boundary.
     * @private
     */
    private _getBoundaryPositionsBuffer;
    /**
     * Get (and cache) positions buffer for rendering circle with various numbers of segments.
     * @private
     */
    private _getCirclePositionsBuffer;
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
     * Gets (and caches) vertex shaders based on shader source code and compile time constants.
     * Tries to minimize the number of new vertex shaders that must be compiled.
     * @private
     */
    _getVertexShader(name: PROGRAM_NAME_INTERNAL, vertexID: string, vertexCompileConstants: CompileTimeConstants, programName: string): WebGLShader | undefined;
    /**
     * Notify the GPUComposer that the canvas should change size.
     * @param width - The width of the canvas element.
     * @param height - The height of the canvas element.
     */
    resize(width: number, height: number): void;
    /**
     * Set inputs and outputs in preparation for draw call.
     * @private
     */
    private _drawSetup;
    /**
     * Set blend mode for draw call.
     * @private
     */
    private _setBlendMode;
    /**
     * Add GPULayer to inputs if needed.
     * @private
     */
    private _addLayerToInputs;
    /**
     * Copy data from input to output.
     * This is used when rendering to part of output state (not fullscreen quad).
     * @private
     */
    private _passThroughLayerDataFromInputToOutput;
    /**
     * Set output for draw command.
     * @private
     */
    private _setOutputLayer;
    /**
     * Set vertex shader attribute.
     * @private
     */
    private _setVertexAttribute;
    /**
     * Set vertex shader position attribute.
     * @private
     */
    _setPositionAttribute(program: WebGLProgram, programName: string): void;
    /**
     * Set vertex shader index attribute.
     * @private
     */
    private _setIndexAttribute;
    /**
     * Set vertex shader uv attribute.
     * @private
     */
    private _setUVAttribute;
    /**
     * Step GPUProgram entire fullscreen quad.
     * @param params
     */
    step(params: {
        program: GPUProgram;
        input?: (GPULayer | GPULayerState)[] | GPULayer | GPULayerState;
        output?: GPULayer;
        shouldBlendAlpha?: boolean;
    }): void;
    /**
     * Step GPUProgram only for a 1px strip of pixels along the boundary.
     * @param params
     */
    stepBoundary(params: {
        program: GPUProgram;
        input?: (GPULayer | GPULayerState)[] | GPULayer | GPULayerState;
        output?: GPULayer;
        singleEdge?: 'LEFT' | 'RIGHT' | 'TOP' | 'BOTTOM';
        shouldBlendAlpha?: boolean;
    }): void;
    /**
     * Step GPUProgram for all but a 1px strip of pixels along the boundary.
     * @param params
     */
    stepNonBoundary(params: {
        program: GPUProgram;
        input?: (GPULayer | GPULayerState)[] | GPULayer | GPULayerState;
        output?: GPULayer;
        shouldBlendAlpha?: boolean;
    }): void;
    /**
     * Step GPUProgram inside a circular spot.
     * This is useful for touch interactions.
     * @param params
     */
    stepCircle(params: {
        program: GPUProgram;
        position: [number, number];
        diameter: number;
        input?: (GPULayer | GPULayerState)[] | GPULayer | GPULayerState;
        output?: GPULayer;
        numSegments?: number;
        shouldBlendAlpha?: boolean;
    }): void;
    /**
     * Step GPUProgram inside a line segment (rounded end caps available).
     * This is useful for touch interactions during pointermove.
     * @param params
     */
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
    /**
     * If this GPUComposer has been inited via GPUComposer.initWithThreeRenderer(), call resetThreeState() in render loop after performing any step or draw functions.
     */
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
    /**
     * Call tick() from your render loop to measure the FPS of your application.
     * Internally, this does some low pass filtering to give consistent results.
     */
    tick(): {
        fps: number;
        milliseconds: number;
        numTicks?: undefined;
    } | {
        fps: number;
        numTicks: number;
        milliseconds?: undefined;
    };
    /**
     * Deallocate GPUComposer instance and associated WebGL properties.
     */
    dispose(): void;
}
