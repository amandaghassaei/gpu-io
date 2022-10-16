import { GPULayer } from './GPULayer';
import './GPULayerHelpers';
import { GPULayerType, GLSLVersion, WEBGL2, WEBGL1, EXPERIMENTAL_WEBGL, PROGRAM_NAME_INTERNAL, CompileTimeConstants, ErrorCallback, GLSLPrecision, GPULayerState, EXPERIMENTAL_WEBGL2, BoundaryEdge } from './constants';
import { GPUProgram } from './GPUProgram';
import type { WebGLRenderer, WebGL1Renderer } from 'three';
export declare class GPUComposer {
    /**
     * The WebGL context associated with this GPUcomposer.
     */
    readonly gl: WebGLRenderingContext | WebGL2RenderingContext;
    /**
     * The GLSL version being used by the GPUComposer.
     */
    readonly glslVersion: GLSLVersion;
    /**
     * Flag for WebGL version.
     */
    readonly isWebGL2: boolean;
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
    private _errorState;
    /**
     * @private
     */
    readonly _threeRenderer?: WebGLRenderer | WebGL1Renderer;
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
    private _enabledVertexAttributes;
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
     * Create a GPUComposer from an existing THREE.WebGLRenderer that shares a single WebGL context.
     * @param renderer - Threejs WebGLRenderer.
     * @param params - GPUComposer parameters.
     * @param params.glslVersion - Set the GLSL version to use, defaults to GLSL3 for WebGL2 contexts.
     * @param params.intPrecision - Set the global integer precision in shader programs.
     * @param params.floatPrecision - Set the global float precision in shader programs.
     * @param params.verboseLogging - Set the verbosity of GPUComposer logging (defaults to false).
     * @param params.errorCallback - Custom error handler, defaults to throwing an Error with message.
     * @returns
     */
    static initWithThreeRenderer(renderer: WebGLRenderer | WebGL1Renderer, params?: {
        glslVersion?: GLSLVersion;
        intPrecision?: GLSLPrecision;
        floatPrecision?: GLSLPrecision;
        verboseLogging?: boolean;
        errorCallback?: ErrorCallback;
    }): GPUComposer;
    /**
     * Create a GPUComposer.
     * @param params - GPUComposer parameters.
     * @param params.canvas - HTMLCanvasElement associated with this GPUComposer (you must add to DOM yourself).
     * @param params.context - Pass in a WebGL context for the GPUcomposer to user.
     * @param params.contextID - Set the contextID to use when initing a new WebGL context.
     * @param params.contextAttributes - Options to pass to WebGL context on initialization (see https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext for more information).
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
        contextAttributes?: {
            [key: string]: any;
        };
        glslVersion?: GLSLVersion;
        intPrecision?: GLSLPrecision;
        floatPrecision?: GLSLPrecision;
        verboseLogging?: boolean;
        errorCallback?: ErrorCallback;
    });
    get canvas(): HTMLCanvasElement;
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
    /**
     * Gets (and caches) vertex shaders based on shader source code and compile time constants.
     * Tries to minimize the number of new vertex shaders that must be compiled.
     * @private
     */
    _getVertexShader(name: PROGRAM_NAME_INTERNAL, vertexID: string, vertexCompileConstants: CompileTimeConstants, programName: string): WebGLShader | undefined;
    /**
     * Notify the GPUComposer that the canvas should change size.
     * @param dimensions - The new [width, height] to resize to.
     */
    resize(dimensions: [number, number]): void;
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
    private _disableVertexAttributes;
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
    private _widthHeightForOutput;
    /**
     * Call stepping/drawing function once for each output.
     * This is required when attempting to draw to multiple outputs using GLSL1.
     */
    private _iterateOverOutputsIfNeeded;
    private _drawFinish;
    /**
     * Step GPUProgram entire fullscreen quad.
     * @param params - Step parameters.
     * @param params.program - GPUProgram to run.
     * @param params.input - Input GPULayers to GPUProgram.
     * @param params.output - Output GPULayer, will draw to screen if undefined.
     * @param params.blendAlpha - Blend mode for draw, defaults to false.
     * @returns
     */
    step(params: {
        program: GPUProgram;
        input?: (GPULayer | GPULayerState)[] | GPULayer | GPULayerState;
        output?: GPULayer | GPULayer[];
        blendAlpha?: boolean;
    }): void;
    /**
     * Step GPUProgram only for a 1px strip of pixels along the boundary.
     * @param params - Step parameters.
     * @param params.program - GPUProgram to run.
     * @param params.input - Input GPULayers to GPUProgram.
     * @param params.output - Output GPULayer, will draw to screen if undefined.
     * @param params.edges - Specify which edges to step, defaults to stepping entire boundary.
     * @param params.blendAlpha - Blend mode for draw, defaults to false.
     * @returns
     */
    stepBoundary(params: {
        program: GPUProgram;
        input?: (GPULayer | GPULayerState)[] | GPULayer | GPULayerState;
        output?: GPULayer | GPULayer[];
        edges?: BoundaryEdge | BoundaryEdge[];
        blendAlpha?: boolean;
    }): void;
    /**
     * Step GPUProgram for all but a 1px strip of pixels along the boundary.
     * @param params - Step parameters.
     * @param params.program - GPUProgram to run.
     * @param params.input - Input GPULayers to GPUProgram.
     * @param params.output - Output GPULayer, will draw to screen if undefined.
     * @param params.blendAlpha - Blend mode for draw, defaults to false.
     * @returns
     */
    stepNonBoundary(params: {
        program: GPUProgram;
        input?: (GPULayer | GPULayerState)[] | GPULayer | GPULayerState;
        output?: GPULayer | GPULayer[];
        blendAlpha?: boolean;
    }): void;
    /**
     * Step GPUProgram inside a circular spot.  This is useful for touch interactions.
     * @param params - Step parameters.
     * @param params.program - GPUProgram to run.
     * @param params.position - Position of center of circle.
     * @param params.diameter - Circle diameter in pixels.
     * @param params.useOutputScale - If true position and diameter are scaled relative to the output dimensions, else they are scaled relative to the current canvas size, defaults to false.
     * @param params.input - Input GPULayers to GPUProgram.
     * @param params.output - Output GPULayer, will draw to screen if undefined.
     * @param params.numSegments - Number of segments in circle, defaults to 18.
     * @param params.blendAlpha - Blend mode for draw, defaults to false.
     * @returns
     */
    stepCircle(params: {
        program: GPUProgram;
        position: number[];
        diameter: number;
        useOutputScale?: boolean;
        input?: (GPULayer | GPULayerState)[] | GPULayer | GPULayerState;
        output?: GPULayer | GPULayer[];
        numSegments?: number;
        blendAlpha?: boolean;
    }): void;
    /**
     * Step GPUProgram inside a line segment (rounded end caps available).
     * This is useful for touch interactions during pointermove.
     * @param params - Step parameters.
     * @param params.program - GPUProgram to run.
     * @param params.position1 - Position of one end of segment.
     * @param params.position2 - Position of the other end of segment.
     * @param params.thickness - Thickness in pixels.
     * @param params.useOutputScale - If true position and thickness are scaled relative to the output dimensions, else they are scaled relative to the current canvas size, defaults to false.
     * @param params.input - Input GPULayers to GPUProgram.
     * @param params.output - Output GPULayer, will draw to screen if undefined.
     * @param params.endCaps - Flag to draw with rounded end caps, defaults to false.
     * @param params.numCapSegments - Number of segments in rounded end caps, defaults to 9, must be divisible by 3.
     * @param params.blendAlpha - Blend mode for draw, defaults to false.
     * @returns
     */
    stepSegment(params: {
        program: GPUProgram;
        position1: number[];
        position2: number[];
        thickness: number;
        useOutputScale?: boolean;
        input?: (GPULayer | GPULayerState)[] | GPULayer | GPULayerState;
        output?: GPULayer | GPULayer[];
        endCaps?: boolean;
        numCapSegments?: number;
        blendAlpha?: boolean;
    }): void;
    /**
     * Step GPUProgram inside a rectangle.
     * @param params - Step parameters.
     * @param params.program - GPUProgram to run.
     * @param params.position - Position of one top corner of rectangle.
     * @param params.size - Width and height of rectangle.
     * @param params.useOutputScale - If true position and size are scaled relative to the output dimensions, else they are scaled relative to the current canvas size, defaults to false.
     * @param params.input - Input GPULayers to GPUProgram.
     * @param params.output - Output GPULayer, will draw to screen if undefined.
     * @param params.blendAlpha - Blend mode for draw, defaults to false.
     * @returns
     */
    stepRect(params: {
        program: GPUProgram;
        position: number[];
        size: number[];
        useOutputScale?: boolean;
        input?: (GPULayer | GPULayerState)[] | GPULayer | GPULayerState;
        output?: GPULayer | GPULayer[];
        blendAlpha?: boolean;
    }): void;
    /**
     * Draw the contents of a GPULayer as points.  This assumes the components of the GPULayer have the form [xPosition, yPosition] or [xPosition, yPosition, xOffset, yOffset].
     * @param params - Draw parameters.
     * @param params.layer - GPULayer containing position data.
     * @param params.program - GPUProgram to run, defaults to drawing points in red.
     * @param params.input - Input GPULayers for GPUProgram.
     * @param params.output - Output GPULayer, will draw to screen if undefined.
     * @param params.pointSize - Pixel size of points.
     * @param params.count - How many points to draw, defaults to positions.length.
     * @param params.color - (If no program passed in) RGB color in range [0, 1] to draw points.
     * @param params.wrapX - Wrap points positions in X, defaults to false.
     * @param params.wrapY - Wrap points positions in Y, defaults to false.
     * @param params.blendAlpha - Blend mode for draw, defaults to false.
     * @returns
     */
    drawLayerAsPoints(params: {
        layer: GPULayer;
        program?: GPUProgram;
        input?: (GPULayer | GPULayerState)[] | GPULayer | GPULayerState;
        output?: GPULayer | GPULayer[];
        pointSize?: number;
        count?: number;
        color?: number[];
        wrapX?: boolean;
        wrapY?: boolean;
        blendAlpha?: boolean;
    }): void;
    /**
     * Draw the contents of a 2 component GPULayer as a vector field.
     * @param params - Draw parameters.
     * @param params.layer - GPULayer containing vector data.
     * @param params.program - GPUProgram to run, defaults to drawing vector lines in red.
     * @param params.input - Input GPULayers for GPUProgram.
     * @param params.output - Output GPULayer, will draw to screen if undefined.
     * @param params.vectorSpacing - Spacing between vectors, defaults to drawing a vector every 10 pixels.
     * @param params.vectorScale - Scale factor to apply to vector lengths.
     * @param params.color - (If no program passed in) RGB color in range [0, 1] to draw points.
     * @param params.blendAlpha - Blend mode for draw, defaults to false.
     * @returns
     */
    drawLayerAsVectorField(params: {
        layer: GPULayer;
        program?: GPUProgram;
        input?: (GPULayer | GPULayerState)[] | GPULayer | GPULayerState;
        output?: GPULayer | GPULayer[];
        vectorSpacing?: number;
        vectorScale?: number;
        color?: number[];
        blendAlpha?: boolean;
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
        callback?: (blob: Blob, filename: string) => void;
    }): void;
    /**
     * Call tick() from your render loop to measure the FPS of your application.
     * Internally, this does some low pass filtering to give consistent results.
     * @returns An Object containing the current fps of your application and the number of times tick() has been called.
     */
    tick(): {
        fps: number;
        numTicks: number;
    };
    /**
     * Deallocate GPUComposer instance and associated WebGL properties.
     */
    dispose(): void;
}
