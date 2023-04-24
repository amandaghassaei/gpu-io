import { WebGLRenderer, WebGL1Renderer, Texture } from 'three';

declare class GPUProgram {
    private readonly _composer;
    /**
     * Name of GPUProgram, used for error logging.
     */
    readonly name: string;
    private _fragmentShaders;
    protected _fragmentShaderSource: string;
    private readonly _compileTimeConstants;
    private readonly _extensions?;
    private readonly _uniforms;
    private readonly _programs;
    private readonly _programsKeyLookup;
    protected readonly _samplerUniformsIndices: {
        name: string;
        inputIndex: number;
        shaderIndex: number;
    }[];
    /**
     * This is only used in cases where GLSL1 program has multiple outputs.
     * @private
     */
    _childPrograms?: GPUProgramChild[];
    /**
     * Create a GPUProgram.
     * @param composer - The current GPUComposer instance.
     * @param params - GPUProgram parameters.
     * @param params.name - Name of GPUProgram, used for error logging.
     * @param params.fragmentShader - Fragment shader source or array of sources to be joined.
     * @param params.uniforms - Array of uniforms to initialize with GPUProgram.  More uniforms can be added later with GPUProgram.setUniform().
     * @param params.compileTimeConstants - Compile time #define constants to include with fragment shader.
     */
    constructor(composer: GPUComposer, params: {
        name: string;
        fragmentShader: string | string[];
        uniforms?: UniformParams[];
        compileTimeConstants?: CompileTimeConstants;
    });
    /**
     * Force compilation of GPUProgram with new compileTimeConstants.
     * @param compileTimeConstants - Compile time #define constants to include with fragment shader.
     */
    recompile(compileTimeConstants: CompileTimeConstants): void;
    /**
     * Get fragment shader for GPUProgram, compile new one if needed.
     * Used internally.
     * @private
     */
    private _getFragmentShader;
    /**
     * Get GLProgram associated with a specific vertex shader.
     * @private
     */
    _getProgramWithName(name: PROGRAM_NAME_INTERNAL, vertexCompileConstants: CompileTimeConstants, input: GPULayerState[]): WebGLProgram | undefined;
    /**
     * Set uniform for GLProgram.
     * @private
     */
    private _setProgramUniform;
    /**
     * Cache uniform value and return whether the value has changed.
     * @private
     */
    private _cacheUniformValue;
    /**
     * Set fragment shader uniform for GPUProgram.
     * @param name - Uniform name as it appears in fragment shader.
     * @param value - Uniform value.
     * @param type - Uniform type.
     */
    setUniform(name: string, value: UniformValue, type?: UniformType): void;
    /**
     * Set internal fragment shader uniforms for GPUProgram.
     * @private
     */
    _setInternalFragmentUniforms(program: WebGLProgram, input: GPULayerState[]): void;
    /**
     * Set vertex shader uniform for GPUProgram.
     * @private
     */
    _setVertexUniform(program: WebGLProgram, uniformName: string, value: UniformValue, type: UniformType): void;
    /**
     * Deallocate GPUProgram instance and associated WebGL properties.
     */
    dispose(): void;
}
declare class GPUProgramChild extends GPUProgram {
    constructor(composer: GPUComposer, params: {
        name: string;
        fragmentShader: string | string[];
        uniforms?: UniformParams[];
        compileTimeConstants?: CompileTimeConstants;
    }, _gpuio_child_params: {
        fragmentShaderSource: string;
    });
}

declare class GPUIndexBuffer {
    private readonly _composer;
    /**
     * GL buffer.
     */
    readonly buffer: WebGLBuffer;
    /**
     * GL type.
     */
    readonly glType: number;
    /**
     * Index buffer count.
     */
    readonly count: number;
    /**
     * Init a GPUIndexBuffer to use with GPUComposer.drawLayerAsMesh().
     * @param composer - The current GPUComposer instance.
     * @param params - GPUIndexBuffer parameters.
     * @param params.indices - A 1D array containing indexed geometry.  For a mesh, this would be an array of triangle indices.
     * @param params.name - Name of GPUIndexBuffer, used for error logging.
     * @returns
     */
    constructor(composer: GPUComposer, params: {
        indices: number[] | Uint8Array | Uint16Array | Uint32Array;
        name?: string;
    });
    /**
     * Deallocate GPUIndexBuffer instance and associated WebGL properties.
     */
    dispose(): void;
}

declare class GPUComposer {
    /**
     * The WebGL context associated with this GPUComposer.
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
    private _meshIndexArray?;
    private _meshIndexBuffer?;
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
    private _clearValue;
    private _clearValueVec4?;
    /**
     * Cache some generic programs for copying data.
     * These are needed for rendering partial screen geometries.
     */
    private readonly _copyPrograms;
    /**
     * Cache some generic programs for setting value from uniform.
     * These are used by GOUComposer.clear() and GPULayer.clear(), among other things
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
     * Flag to set GPUComposer for verbose logging, defaults to false.
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
     * @param params.clearValue - Value to write to canvas when GPUComposer.clear() is called.
     * @param params.verboseLogging - Set the verbosity of GPUComposer logging (defaults to false).
     * @param params.errorCallback - Custom error handler, defaults to throwing an Error with message.
     * @returns
     */
    static initWithThreeRenderer(renderer: WebGLRenderer | WebGL1Renderer, params?: {
        glslVersion?: GLSLVersion;
        intPrecision?: GLSLPrecision;
        floatPrecision?: GLSLPrecision;
        clearValue?: number | number[];
        verboseLogging?: boolean;
        errorCallback?: ErrorCallback;
    }): GPUComposer;
    /**
     * Create a GPUComposer.
     * @param params - GPUComposer parameters.
     * @param params.canvas - HTMLCanvasElement associated with this GPUComposer (you must add to DOM yourself).
     * @param params.context - Pass in a WebGL context for the GPUComposer to user.
     * @param params.contextID - Set the contextID to use when initing a new WebGL context.
     * @param params.contextAttributes - Options to pass to WebGL context on initialization (see https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext for more information).
     * @param params.glslVersion - Set the GLSL version to use, defaults to GLSL3 for WebGL2 contexts.
     * @param params.intPrecision - Set the global integer precision in shader programs.
     * @param params.floatPrecision - Set the global float precision in shader programs.
     * @param params.clearValue - Value to write to canvas when GPUComposer.clear() is called.
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
        clearValue?: number | number[];
        verboseLogging?: boolean;
        errorCallback?: ErrorCallback;
    });
    get canvas(): HTMLCanvasElement;
    /**
     * Gets (and caches) generic set value programs for several input types.
     * Used for GPUComposer.clear() and GPULayer.clear(), among other things.
     * @private
     */
    _setValueProgramForType(type: GPULayerType): GPUProgram;
    /**
     * Gets (and caches) generic copy programs for several input types.
     * Used for partial rendering to output, among other things.
     * @private
     */
    _copyProgramForType(type: GPULayerType): GPUProgram;
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
     * @param params.useOutputScale - If true position and pointSize are scaled relative to the output dimensions, else they are scaled relative to the current canvas size, defaults to false.
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
        useOutputScale?: boolean;
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
     * Draw 2D mesh to screen.
     * @param params - Draw parameters.
     * @param params.layer - GPULayer containing vector data.
     * @param params.indices - GPUIndexBuffer containing mesh index data.
     * @param params.program - GPUProgram to run, defaults to drawing vector lines in red.
     * @param params.input - Input GPULayers for GPUProgram.
     * @param params.output - Output GPULayer, will draw to screen if undefined.
     * @param params.useOutputScale - If true positions are scaled relative to the output dimensions, else they are scaled relative to the current canvas size, defaults to false.
     * @param params.color - (If no program passed in) RGB color in range [0, 1] to draw points.
     * @param params.blendAlpha - Blend mode for draw, defaults to false.
     * @returns
     */
    drawLayerAsMesh(params: {
        layer: GPULayer;
        indices?: GPUIndexBuffer;
        program?: GPUProgram;
        input?: (GPULayer | GPULayerState)[] | GPULayer | GPULayerState;
        output?: GPULayer | GPULayer[];
        useOutputScale?: boolean;
        color?: number[];
        blendAlpha?: boolean;
    }): void;
    /**
     * Set the clearValue of the GPUComposer, which is applied during GPUComposer.clear().
     */
    set clearValue(clearValue: number | number[]);
    /**
     * Get the clearValue of the GPUComposer.
     */
    get clearValue(): number | number[];
    /**
     * Get the clearValue of the GPUComposer as a vec4, pad with zeros as needed.
     */
    private get clearValueVec4();
    /**
     * Clear all data in canvas to GPUComposer.clearValue.
     */
    clear(): void;
    /**
     * If this GPUComposer has been inited via GPUComposer.initWithThreeRenderer(), call undoThreeState() in render loop before performing any gpu-io step or draw functions.
     */
    undoThreeState(): void;
    /**
     * If this GPUComposer has been inited via GPUComposer.initWithThreeRenderer(), call resetThreeState() in render loop after performing any gpu-io step or draw functions.
     */
    resetThreeState(): void;
    /**
     * Save the current state of the canvas to png.
     * @param params - PNG parameters.
     * @param params.filename - PNG filename (no extension).
     * @param params.dpi - PNG dpi (defaults to 72dpi).
     * @param params.callback - Optional callback when Blob is ready, default behavior saves the PNG using file-saver.
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
     * Return the number of ticks of the simulation.
     * Use GPUComposer.tick() to increment this value on each animation cycle.
     */
    get numTicks(): number;
    /**
     * Deallocate GPUComposer instance and associated WebGL properties.
     */
    dispose(): void;
}

declare class GPULayer {
    private readonly _composer;
    /**
     * Name of GPULayer, used for error logging.
     */
    readonly name: string;
    /**
     * Data type represented by GPULayer.
     */
    readonly type: GPULayerType;
    /**
     * Number of RGBA elements represented by each pixel in the GPULayer (1-4).
     */
    readonly numComponents: GPULayerNumComponents;
    /**
     * Interpolation filter for GPULayer, defaults to LINEAR for 2D FLOAT/HALF_FLOAT GPULayers, otherwise defaults to NEAREST.
     */
    readonly filter: GPULayerFilter;
    /**
     * Horizontal wrapping style for GPULayer, defaults to CLAMP_TO_EDGE.
     */
    readonly wrapX: GPULayerWrap;
    /**
     * Vertical wrapping style for GPULayer, defaults to CLAMP_TO_EDGE.
     */
    readonly wrapY: GPULayerWrap;
    private _clearValue;
    private _clearValueVec4?;
    private _bufferIndex;
    readonly numBuffers: number;
    private readonly _buffers;
    private _length?;
    private _width;
    private _height;
    /**
     * @private
     */
    readonly _glInternalFormat: number;
    /**
     * @private
     */
    readonly _glFormat: number;
    /**
     * GPULayer._internalType corresponds to GPULayer.glType, but may be different from GPULayer.type.
     * @private
     */
    readonly _internalType: GPULayerType;
    /**
     * @private
     */
    readonly _glType: number;
    /**
     * Internally, GPULayer._glNumChannels may represent a larger number of channels than GPULayer.numComponents.
     * For example, writable RGB textures are not supported in WebGL2, must use RGBA instead.
     * @private
     */
    readonly _glNumChannels: number;
    /**
     * GPULayer._internalFilter corresponds to GPULayer.glFilter, may be different from GPULayer.filter.
     * @private
     */
    readonly _internalFilter: GPULayerFilter;
    /**
     * @private
     */
    readonly _glFilter: number;
    /**
     * GPULayer._internalWrapX corresponds to GPULayer.glWrapX, but may be different from GPULayer.wrapX.
     * @private
     */
    readonly _internalWrapX: GPULayerWrap;
    /**
     * @private
     */
    readonly _glWrapS: number;
    /**
     * GPULayer._internalWrapY corresponds to GPULayer.glWrapY, but may be different from GPULayer.wrapY.
     * @private
     */
    readonly _internalWrapY: GPULayerWrap;
    /**
     * @private
     */
    readonly _glWrapT: number;
    private _textureOverrides?;
    private _values?;
    private _valuesRaw?;
    private _valuesBufferView?;
    /**
     * Create a GPULayer from an image url.
     * @param composer - The current GPUComposer instance.
     * @param params  - GPULayer parameters.
     * @param params.name - Name of GPULayer, used for error logging.
     * @param params.url - URL of the image source.
     * @param params.type - Data type represented by GPULayer.
     * @param params.format - Image format, either RGB or RGBA.
     * @param params.filter - Interpolation filter for GPULayer, defaults to LINEAR for FLOAT/HALF_FLOAT Images, otherwise defaults to NEAREST.
     * @param params.wrapX - Horizontal wrapping style for GPULayer, defaults to CLAMP_TO_EDGE.
     * @param params.wrapY - Vertical wrapping style for GPULayer, defaults to CLAMP_TO_EDGE.
     * @param params.clearValue - Value to write to GPULayer when GPULayer.clear() is called.
     */
    static initFromImageURL(composer: GPUComposer, params: {
        name: string;
        url: string;
        type?: ImageType;
        format?: ImageFormat;
        filter?: GPULayerFilter;
        wrapX?: GPULayerWrap;
        wrapY?: GPULayerWrap;
        clearValue?: number | number[];
    }): Promise<GPULayer>;
    /**
     * Create a GPULayer.
     * @param composer - The current GPUComposer instance.
     * @param params - GPULayer parameters.
     * @param params.name - Name of GPULayer, used for error logging.
     * @param params.type - Data type represented by GPULayer.
     * @param params.numComponents - Number of RGBA elements represented by each pixel in the GPULayer (1-4).
     * @param params.dimensions - Dimensions of 1D or 2D GPULayer.
     * @param params.filter - Interpolation filter for GPULayer, defaults to LINEAR for 2D FLOAT/HALF_FLOAT GPULayers, otherwise defaults to NEAREST.
     * @param params.wrapX - Horizontal wrapping style for GPULayer, defaults to CLAMP_TO_EDGE.
     * @param params.wrapY - Vertical wrapping style for GPULayer, defaults to CLAMP_TO_EDGE.
     * @param params.numBuffers - How may buffers to allocate, defaults to 1.  If you intend to use the current state of this GPULayer as an input to generate a new state, you will need at least 2 buffers.
     * @param params.clearValue - Value to write to GPULayer when GPULayer.clear() is called.
     * @param params.array - Array to initialize GPULayer.
     */
    constructor(composer: GPUComposer, params: {
        name: string;
        type: GPULayerType;
        numComponents: GPULayerNumComponents;
        dimensions: number | number[];
        array?: GPULayerArray | number[];
        filter?: GPULayerFilter;
        wrapX?: GPULayerWrap;
        wrapY?: GPULayerWrap;
        numBuffers?: number;
        clearValue?: number | number[];
    });
    /**
     * The width of the GPULayer array.
     */
    get width(): number;
    /**
     * The height of the GPULayer array.
     */
    get height(): number;
    /**
     * The length of the GPULayer array (only available to 1D GPULayers).
     */
    get length(): number;
    /**
     * Returns whether the GPULayer was inited as a 1D array (rather than 2D).
     * @returns - true if GPULayer is 1D, else false.
     */
    is1D(): boolean;
    /**
     * Returns whether the GPULayer was inited as a 2D array (rather than 1D).
     * @returns - true if GPULayer is 2D, else false.
     */
    is2D(): boolean;
    /**
     * Test whether the current buffer index has override enabled.
     * @private
     */
    _usingTextureOverrideForCurrentBuffer(): boolean;
    /**
     * Copy contents of current state to another GPULayer.
     * TODO: Still testing this.
     * @private
     */
    copyCurrentStateToGPULayer(layer: GPULayer): void;
    /**
     * Init GLTexture/GLFramebuffer pairs for reading/writing GPULayer data.
     * @private
     */
    private _initBuffers;
    /**
     * Get buffer index of the current state.
     */
    get bufferIndex(): number;
    /**
     * Increment buffer index by 1.
     */
    incrementBufferIndex(): void;
    /**
     * Decrement buffer index by 1.
     */
    decrementBufferIndex(): void;
    /**
     * Get the current state as a GPULayerState object.
     */
    get currentState(): GPULayerState;
    /**
     * Get the current state as a WebGLTexture.
     * Used internally.
     * @private
     */
    get _currentTexture(): WebGLTexture;
    /**
     * Get the previous state as a GPULayerState object (only available for GPULayers with numBuffers > 1).
     */
    get lastState(): GPULayerState;
    /**
     * Get the state at a specified index as a GPULayerState object.
     */
    getStateAtIndex(index: number): GPULayerState;
    /**
     * Increments the buffer index (if needed).
     * @private
     */
    _prepareForWrite(incrementBufferIndex: boolean): void;
    setFromArray(array: GPULayerArray | number[]): void;
    resize(dimensions: number | number[], arrayOrImage?: HTMLImageElement | GPULayerArray | number[]): void;
    /**
     * Set the clearValue of the GPULayer, which is applied during GPULayer.clear().
     */
    set clearValue(clearValue: number | number[]);
    /**
     * Get the clearValue of the GPULayer.
     */
    get clearValue(): number | number[];
    /**
     * Get the clearValue of the GPULayer as a vec4, pad with zeros as needed.
     */
    private get clearValueVec4();
    /**
     * Clear all data in GPULayer to GPULayer.clearValue.
     * @param applyToAllBuffers - Flag to apply to all buffers of GPULayer, or just the current output buffer.
     */
    clear(applyToAllBuffers?: boolean): void;
    private _getValuesSetup;
    private _getValuesPost;
    /**
     * Returns the current values of the GPULayer as a TypedArray.
     * @returns - A TypedArray containing current state of GPULayer.
     */
    getValues(): GPULayerArray;
    /**
     * Non-blocking function to return the current values of the GPULayer as a TypedArray.
     * This only works for WebGL2 contexts, will fall back to getValues() if WebGL1 context.
     * @returns - A TypedArray containing current state of GPULayer.
     */
    getValuesAsync(): Promise<GPULayerArray>;
    private _getCanvasWithImageData;
    /**
     * Get the current state of this GPULayer as an Image.
     * @param params - Image parameters.
     * @param params.multiplier - Multiplier to apply to data (defaults to 255 for FLOAT and HALF_FLOAT types, else 1).
    */
    getImage(params?: {
        multiplier?: number;
    }): HTMLImageElement;
    /**
     * Save the current state of this GPULayer to png.
     * @param params - PNG parameters.
     * @param params.filename - PNG filename (no extension, defaults to the name of the GPULayer).
     * @param params.dpi - PNG dpi (defaults to 72dpi).
     * @param params.multiplier - Multiplier to apply to data before saving PNG (defaults to 255 for FLOAT and HALF_FLOAT types, else 1).
     * @param params.callback - Optional callback when Blob is ready, default behavior saves the PNG using file-saver.
    */
    savePNG(params?: {
        filename?: string;
        dpi?: number;
        multiplier?: number;
        callback?: (blob: Blob, filename: string) => void;
    }): void;
    /**
     * Attach the output buffer of this GPULayer to a Threejs Texture object.
     * @param {Texture} texture - Threejs texture object.
     */
    attachToThreeTexture(texture: Texture): void;
    /**
     * Delete this GPULayer's framebuffers and textures.
     * @private
     */
    private _destroyBuffers;
    /**
     * Create a deep copy of GPULayer with current state copied over.
     * @param name - Name of new GPULayer as string.
     * @returns - Deep copy of GPULayer.
     */
    clone(name?: string): GPULayer;
    /**
     * Deallocate GPULayer instance and associated WebGL properties.
     */
    dispose(): void;
    /**
     * These methods are defined in GPULayerHelpers.ts
     */
    /**
     * @private
     */
    static initArrayForType(type: GPULayerType, length: number, halfFloatsAsFloats?: boolean): GPULayerArray;
    /**
     * @private
     */
    static calcGPULayerSize(size: number | number[], name: string, verboseLogging: boolean): {
        width: number;
        height: number;
        length?: number;
    };
    /**
     * @private
     */
    static getGPULayerInternalWrap(params: {
        composer: GPUComposer;
        wrap: GPULayerWrap;
        internalFilter: GPULayerFilter;
        internalType: GPULayerType;
        name: string;
    }): GPULayerWrap;
    /**
     * @private
     */
    static getGPULayerInternalFilter(params: {
        composer: GPUComposer;
        filter: GPULayerFilter;
        wrapX: GPULayerWrap;
        wrapY: GPULayerWrap;
        internalType: GPULayerType;
        name: string;
    }): GPULayerFilter;
    /**
     * @private
     */
    static getGLTextureParameters(params: {
        composer: GPUComposer;
        name: string;
        numComponents: GPULayerNumComponents;
        internalType: GPULayerType;
    }): {
        glFormat: number;
        glInternalFormat: number;
        glType: number;
        glNumChannels: number;
    };
    /**
     * @private
     */
    static getGPULayerInternalType(params: {
        composer: GPUComposer;
        type: GPULayerType;
        name: string;
    }): GPULayerType;
    /**
     * @private
     */
    static validateGPULayerArray(array: GPULayerArray | number[], layer: GPULayer): GPULayerArray;
}

/**
 * Half float data type.
 */
declare const HALF_FLOAT = "HALF_FLOAT";
/**
 * Float data type.
 */
declare const FLOAT = "FLOAT";
/**
 * Unsigned byte data type.
 */
declare const UNSIGNED_BYTE = "UNSIGNED_BYTE";
/**
 * Byte data type.
 */
declare const BYTE = "BYTE";
/**
 * Unsigned short data type.
 */
declare const UNSIGNED_SHORT = "UNSIGNED_SHORT";
/**
 * Short data type.
 */
declare const SHORT = "SHORT";
/**
 * Unsigned int data type.
 */
declare const UNSIGNED_INT = "UNSIGNED_INT";
/**
 * Int data type.
 */
declare const INT = "INT";
/**
 * Boolean data type (GPUProgram uniforms only).
 */
declare const BOOL = "BOOL";
/**
 * Unsigned int data type (GPUProgram uniforms only).
 */
declare const UINT = "UINT";
/**
 * Nearest texture filtering.
 */
declare const NEAREST = "NEAREST";
/**
 * Linear texture filtering.
 */
declare const LINEAR = "LINEAR";
/**
 * Clamp to edge wrapping (no wrapping).
 */
declare const CLAMP_TO_EDGE = "CLAMP_TO_EDGE";
/**
 * Repeat/periodic wrapping.
 */
declare const REPEAT = "REPEAT";
/**
 * GPULayer array types.
 */
declare type GPULayerArray = Float32Array | Uint8Array | Int8Array | Uint16Array | Int16Array | Uint32Array | Int32Array;
/**
 * @private
 */
declare const validArrayTypes: (Float32ArrayConstructor | Uint8ArrayConstructor | Int8ArrayConstructor | Uint16ArrayConstructor | Int16ArrayConstructor | Uint32ArrayConstructor | Int32ArrayConstructor | ArrayConstructor)[];
/**
 * GPULayer data types.
 */
declare type GPULayerType = typeof HALF_FLOAT | typeof FLOAT | typeof UNSIGNED_BYTE | typeof BYTE | typeof UNSIGNED_SHORT | typeof SHORT | typeof UNSIGNED_INT | typeof INT;
/**
 * @private
 */
declare const validDataTypes: string[];
/**
 * GPULayer numComponents options.
 */
declare type GPULayerNumComponents = 1 | 2 | 3 | 4;
/**
 * GPULayer filter/interpolation types.
 */
declare type GPULayerFilter = typeof LINEAR | typeof NEAREST;
/**
 * @private
 */
declare const validFilters: string[];
/**
 * @private
 */
/**
 * GPULayer wrap types.
 */
declare type GPULayerWrap = typeof REPEAT | typeof CLAMP_TO_EDGE;
/**
 * @private
 */
declare const validWraps: string[];
/**
 * The WebGLTexture corresponding to a GPULayer buffer (e.g. currentState or lastState).
 * This data structure also includes a reference back to the GPULayer that it originated from.
 */
declare type GPULayerState = {
    texture: WebGLTexture;
    layer: GPULayer;
};
/**
 * RGB image format.
 */
declare const RGB = "RGB";
/**
 * RGBA image format.
 */
declare const RGBA = "RGBA";
/**
 * Image formats for GPULayer.initFromImage().
 */
declare type ImageFormat = typeof RGB | typeof RGBA;
/**
 * Image types for GPULayer.initFromImage().
 */
declare type ImageType = typeof UNSIGNED_BYTE | typeof FLOAT | typeof HALF_FLOAT;
/**
 * @private
 */
declare const validImageFormats: string[];
/**
 * @private
 */
declare const validImageTypes: string[];
/**
 * GLSL version 300 (WebGL2 only).
 */
declare const GLSL3 = "300 es";
/**
 * GLSL version 100 (WebGL1 and WebGL2).
 */
declare const GLSL1 = "100";
/**
 * GLSL available versions.
 */
declare type GLSLVersion = typeof GLSL1 | typeof GLSL3;
/**
 * WebGL2 context ID.
 */
declare const WEBGL2 = "webgl2";
/**
 * WebGL1 context ID.
 */
declare const WEBGL1 = "webgl";
/**
 * Experimental WebGL context ID.
 */
declare const EXPERIMENTAL_WEBGL = "experimental-webgl";
/**
 * Experimental WebGL context ID.
 */
declare const EXPERIMENTAL_WEBGL2 = "experimental-webgl2";
/**
 * GLSL lowp precision declaration.
 */
declare const PRECISION_LOW_P = "lowp";
/**
 * GLSL mediump precision declaration.
 */
declare const PRECISION_MEDIUM_P = "mediump";
/**
 * GLSL highp precision declaration.
 */
declare const PRECISION_HIGH_P = "highp";
/**
 * GLSL available precision declarations.
 */
declare type GLSLPrecision = typeof PRECISION_LOW_P | typeof PRECISION_MEDIUM_P | typeof PRECISION_HIGH_P;
/**
 * @private
 */
declare const FLOAT_1D_UNIFORM = "FLOAT_1D_UNIFORM";
/**
 * @private
 */
declare const FLOAT_2D_UNIFORM = "FLOAT_2D_UNIFORM";
/**
 * @private
 */
declare const FLOAT_3D_UNIFORM = "FLOAT_3D_UNIFORM";
/**
 * @private
 */
declare const FLOAT_4D_UNIFORM = "FLOAT_4D_UNIFORM";
/**
 * @private
 */
declare const INT_1D_UNIFORM = "INT_1D_UNIFORM";
/**
 * @private
 */
declare const INT_2D_UNIFORM = "INT_2D_UNIFORM";
/**
 * @private
 */
declare const INT_3D_UNIFORM = "INT_3D_UNIFORM";
/**
 * @private
 */
declare const INT_4D_UNIFORM = "INT_4D_UNIFORM";
/**
 * @private
 */
declare const UINT_1D_UNIFORM = "UINT_1D_UNIFORM";
/**
 * @private
 */
declare const UINT_2D_UNIFORM = "UINT_2D_UNIFORM";
/**
 * @private
 */
declare const UINT_3D_UNIFORM = "UINT_3D_UNIFORM";
/**
 * @private
 */
declare const UINT_4D_UNIFORM = "UINT_4D_UNIFORM";
/**
 * @private
 */
declare const BOOL_1D_UNIFORM = "BOOL_1D_UNIFORM";
/**
* @private
*/
declare const BOOL_2D_UNIFORM = "BOOL_2D_UNIFORM";
/**
* @private
*/
declare const BOOL_3D_UNIFORM = "BOOL_3D_UNIFORM";
/**
* @private
*/
declare const BOOL_4D_UNIFORM = "BOOL_4D_UNIFORM";
/**
 * GPUProgram uniform types.
 */
declare type UniformType = typeof FLOAT | typeof INT | typeof UINT | typeof BOOL;
/**
 * @private
 */
declare type UniformInternalType = typeof BOOL_1D_UNIFORM | typeof BOOL_2D_UNIFORM | typeof BOOL_3D_UNIFORM | typeof BOOL_4D_UNIFORM | typeof FLOAT_1D_UNIFORM | typeof FLOAT_2D_UNIFORM | typeof FLOAT_3D_UNIFORM | typeof FLOAT_4D_UNIFORM | typeof INT_1D_UNIFORM | typeof INT_2D_UNIFORM | typeof INT_3D_UNIFORM | typeof INT_4D_UNIFORM | typeof UINT_1D_UNIFORM | typeof UINT_2D_UNIFORM | typeof UINT_3D_UNIFORM | typeof UINT_4D_UNIFORM;
/**
 * GPUProgram uniform values.
 */
declare type UniformValue = boolean | boolean[] | number | number[];
/**
 * GPUProgram uniform parameters.
 */
declare type UniformParams = {
    name: string;
    value: UniformValue;
    type: UniformType;
};
/**
 * @private
 */
declare type Uniform = {
    location: WeakMap<WebGLProgram, WebGLUniformLocation>;
    value: UniformValue;
    type: UniformInternalType;
};
/**
 * @private
 */
declare const DEFAULT_PROGRAM_NAME = "DEFAULT";
/**
 * @private
 */
declare const SEGMENT_PROGRAM_NAME = "SEGMENT";
/**
 * @private
 */
declare const LAYER_POINTS_PROGRAM_NAME = "LAYER_POINTS";
/**
 * @private
 */
declare const LAYER_LINES_PROGRAM_NAME = "LAYER_LINES";
/**
 * @private
 */
declare const LAYER_VECTOR_FIELD_PROGRAM_NAME = "LAYER_VECTOR_FIELD";
/**
 * @private
 */
declare const LAYER_MESH_PROGRAM_NAME = "LAYER_MESH";
/**
 * @private
 */
declare const GPUIO_VS_WRAP_X = "GPUIO_VS_WRAP_X";
/**
 * @private
 */
declare const GPUIO_VS_WRAP_Y = "GPUIO_VS_WRAP_Y";
/**
 * @private
 */
declare const GPUIO_VS_INDEXED_POSITIONS = "GPUIO_VS_INDEXED_POSITIONS";
/**
 * @private
 */
declare const GPUIO_VS_UV_ATTRIBUTE = "GPUIO_VS_UV_ATTRIBUTE";
/**
* @private
*/
declare const GPUIO_VS_NORMAL_ATTRIBUTE = "GPUIO_VS_NORMAL_ATTRIBUTE";
/**
 * @private
 */
declare const GPUIO_VS_POSITION_W_ACCUM = "GPUIO_VS_POSITION_W_ACCUM";
/**
 * @private
 */
declare type PROGRAM_NAME_INTERNAL = typeof DEFAULT_PROGRAM_NAME | typeof SEGMENT_PROGRAM_NAME | typeof LAYER_POINTS_PROGRAM_NAME | typeof LAYER_LINES_PROGRAM_NAME | typeof LAYER_VECTOR_FIELD_PROGRAM_NAME | typeof LAYER_MESH_PROGRAM_NAME;
/**
 * Object containing compile time #define constants for GPUProgram fragment shader.
 */
declare type CompileTimeConstants = {
    [key: string]: string;
};
declare type ErrorCallback = (message: string) => void;
/**
 * @private
 */
declare const DEFAULT_ERROR_CALLBACK: (message: string) => never;
/**
 * @private
 */
declare const DEFAULT_CIRCLE_NUM_SEGMENTS = 18;
/**
 * @private
 */
declare const MIN_UNSIGNED_BYTE = 0;
/**
 * @private
 */
declare const MAX_UNSIGNED_BYTE: number;
/**
 * @private
 */
declare const MIN_BYTE: number;
/**
 * @private
 */
declare const MAX_BYTE: number;
/**
 * @private
 */
declare const MIN_UNSIGNED_SHORT = 0;
/**
 * @private
 */
declare const MAX_UNSIGNED_SHORT: number;
/**
 * @private
 */
declare const MIN_SHORT: number;
/**
 * @private
 */
declare const MAX_SHORT: number;
/**
 * @private
 */
declare const MIN_UNSIGNED_INT = 0;
/**
 * @private
 */
declare const MAX_UNSIGNED_INT: number;
/**
 * @private
 */
declare const MIN_INT: number;
/**
 * @private
 */
declare const MAX_INT: number;
/**
 * @private
 */
declare const MIN_HALF_FLOAT_INT = -2048;
/**
 * @private
 */
declare const MAX_HALF_FLOAT_INT = 2048;
/**
 * @private
 */
declare const MIN_FLOAT_INT = -16777216;
/**
 * @private
 */
declare const MAX_FLOAT_INT = 16777216;
/**
 * @private
 */
declare const GPUIO_INT_PRECISION = "GPUIO_INT_PRECISION";
/**
 * @private
 */
declare const GPUIO_FLOAT_PRECISION = "GPUIO_FLOAT_PRECISION";
declare const BOUNDARY_TOP = "BOUNDARY_TOP";
declare const BOUNDARY_BOTTOM = "BOUNDARY_BOTTOM";
declare const BOUNDARY_LEFT = "BOUNDARY_LEFT";
declare const BOUNDARY_RIGHT = "BOUNDARY_RIGHT";
declare type BoundaryEdge = typeof BOUNDARY_TOP | typeof BOUNDARY_BOTTOM | typeof BOUNDARY_LEFT | typeof BOUNDARY_RIGHT;

/**
 * Test whether a GPULayer type is a float type.
 * @private
 */
declare function isFloatType(type: GPULayerType): boolean;
/**
 * Test whether a GPULayer type is an unsigned int type.
 * @private
 */
declare function isUnsignedIntType(type: GPULayerType): boolean;
/**
 * Test whether a GPULayer type is a signed int type.
 * @private
 */
declare function isSignedIntType(type: GPULayerType): boolean;
/**
 * Test whether a GPULayer type is a int type.
 * @private
 */
declare function isIntType(type: GPULayerType): boolean;
/**
 * Create header string for fragment and vertex shaders.
 * Export this for testing purposes.
 * @private
 */
declare function makeShaderHeader(glslVersion: GLSLVersion, intPrecision: GLSLPrecision, floatPrecision: GLSLPrecision, compileTimeConstants?: CompileTimeConstants, extensions?: string): string;
/**
 * Compile vertex or fragment shaders.
 * Fragment shaders may be compiled on the fly, so keep this efficient.
 * Copied from http://webglfundamentals.org/webgl/lessons/webgl-boilerplate.html
 * @private
 */
declare function compileShader(gl: WebGLRenderingContext | WebGL2RenderingContext, glslVersion: GLSLVersion, intPrecision: GLSLPrecision, floatPrecision: GLSLPrecision, shaderSource: string, shaderType: number, programName: string, errorCallback: ErrorCallback, compileTimeConstants?: CompileTimeConstants, extensions?: string, checkCompileStatus?: boolean): WebGLShader | null;
/**
 * Init a WebGL program from vertex and fragment shaders.
 * GLPrograms may be inited on the fly, so keep this efficient.
 * @private
 */
declare function initGLProgram(gl: WebGLRenderingContext | WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader, name: string, errorCallback: ErrorCallback): WebGLProgram | undefined;
/**
 * Returns whether a WebGL context is WebGL2.
 * This code is pulled from https://github.com/mrdoob/three.js/blob/master/src/renderers/webgl/WebGLCapabilities.js
 * @param gl - WebGL context to test.
 * @returns - true if WebGL2 context, else false.
 */
declare function isWebGL2$1(gl: WebGLRenderingContext | WebGL2RenderingContext): boolean;
/**
 * Returns whether WebGL2 is supported by the current browser.
 * @returns - true if WebGL2 is supported, else false.
*/
declare function isWebGL2Supported$1(): boolean;
/**
 * Checks if the framebuffer is ready to read.
 * @private
 */
declare function readyToRead(gl: WebGLRenderingContext | WebGL2RenderingContext): boolean;
/**
 * Detects whether highp precision is supported in vertex shaders in the current browser.
 * @returns - true is highp is supported in vertex shaders, else false.
 */
declare function isHighpSupportedInVertexShader$1(): boolean;
/**
 * Detects whether highp precision is supported in fragment shaders in the current browser.
 * @returns - true is highp is supported in fragment shaders, else false.
 */
declare function isHighpSupportedInFragmentShader$1(): boolean;
/**
 * Returns the actual precision of mediump inside vertex shader.
 * From https://webglfundamentals.org/webgl/lessons/webgl-precision-issues.html
 * @returns - Vertex shader mediump precision.
 */
declare function getVertexShaderMediumpPrecision$1(): "mediump" | "highp";
/**
 * Returns the actual precision of mediump inside fragment shader.
 * From https://webglfundamentals.org/webgl/lessons/webgl-precision-issues.html
 * @returns - Fragment shader supported mediump precision.
 */
declare function getFragmentShaderMediumpPrecision$1(): "mediump" | "highp";
/**
 * Returns whether a number is a power of 2.
 * @private
 */
declare function isPowerOf2(value: number): boolean;
/**
 * Returns a Float32 array with sequential values [0, 1, 2, 3...].
 * @private
 */
declare function initSequentialFloatArray(length: number): Float32Array;
/**
 * Preprocess vertex shader for glslVersion and browser capabilities.
 * This is called once on initialization, so doesn't need to be extremely efficient.
 * @private
 */
declare function preprocessVertexShader(shaderSource: string, glslVersion: GLSLVersion): string;
/**
 * Preprocess fragment shader for glslVersion and browser capabilities.
 * This is called once on initialization of GPUProgram, so doesn't need to be extremely efficient.
 * @private
 */
declare function preprocessFragmentShader(shaderSource: string, glslVersion: GLSLVersion, name: string): {
    shaderSource: string;
    samplerUniforms: string[];
    additionalSources: string[];
} | {
    shaderSource: string;
    samplerUniforms: string[];
    additionalSources?: undefined;
};
/**
 * Check uniforms and return internal WebGL type (e.g. [1234][u]?[if])
 * @private
 */
declare function uniformInternalTypeForValue(value: UniformValue, type: UniformType, uniformName: string, programName: string): "FLOAT_1D_UNIFORM" | "FLOAT_2D_UNIFORM" | "FLOAT_3D_UNIFORM" | "FLOAT_4D_UNIFORM" | "INT_1D_UNIFORM" | "INT_2D_UNIFORM" | "INT_3D_UNIFORM" | "INT_4D_UNIFORM" | "UINT_1D_UNIFORM" | "UINT_2D_UNIFORM" | "UINT_3D_UNIFORM" | "UINT_4D_UNIFORM" | "BOOL_1D_UNIFORM" | "BOOL_2D_UNIFORM" | "BOOL_3D_UNIFORM" | "BOOL_4D_UNIFORM";
/**
 * Get index of GPULayer in array of inputs.
 * Used by GPUComposer.
 * @private
 */
declare function indexOfLayerInArray(layer: GPULayer, array: (GPULayer | GPULayerState)[]): number;
/**
 * Non-blocking version of gl.readPixels for WebGL2 only.
 * https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices#use_non-blocking_async_data_readback
 * @param gl - WebGL2 Rendering Context
 * @param x - The first horizontal pixel that is read from the lower left corner of a rectangular block of pixels.
 * @param y - The first vertical pixel that is read from the lower left corner of a rectangular block of pixels.
 * @param w - The width of the rectangle.
 * @param h - The height of the rectangle.
 * @param format - The GLenum format of the pixel data.
 * @param type - The GLenum data type of the pixel data.
 * @param dstBuffer - An object to read data into. The array type must match the type of the type parameter.
 * @returns
 */
declare function readPixelsAsync(gl: WebGL2RenderingContext, x: number, y: number, w: number, h: number, format: number, type: number, dstBuffer: ArrayBufferView): Promise<ArrayBufferView>;

/**
 * Init GPUProgram to copy contents of one GPULayer to another GPULayer.
 * @category GPUProgram Helper
 * @param composer - The current GPUComposer.
 * @param params - Program parameters.
 * @param params.type - The type of the input/output.
 * @param params.name - Optionally pass in a GPUProgram name, used for error logging.
 * @param params.precision - Optionally specify the precision of the input/output.
 * @returns
 */
declare function copyProgram$1(composer: GPUComposer, params: {
    type: GPULayerType;
    name?: string;
    precision?: GLSLPrecision;
}): GPUProgram;
/**
 * Init GPUProgram to add several GPULayers together.
 * @category GPUProgram Helper
 * @param composer - The current GPUComposer.
 * @param params - Program parameters.
 * @param params.type - The type of the inputs/output.
 * @param params.components - Component(s) of inputs to add, defaults to 'xyzw.
 * @param params.name - Optionally pass in a GPUProgram name, used for error logging.
 * @param params.numInputs - The number of inputs to add together, defaults to 2.
 * @param params.precision - Optionally specify the precision of the inputs/output.
 * @returns
 */
declare function addLayersProgram$1(composer: GPUComposer, params: {
    type: GPULayerType;
    components?: string;
    name?: string;
    numInputs?: number;
    precision?: GLSLPrecision;
}): GPUProgram;
/**
 * Init GPUProgram to add uniform "u_value" to a GPULayer.
 * @category GPUProgram Helper
 * @param composer - The current GPUComposer.
 * @param params - Program parameters.
 * @param params.type - The type of the input/output (we assume "u_value" has the same type).
 * @param params.value - Initial value to add, if value has length 1 it will be applied to all components of GPULayer.  Change this later using uniform "u_value".
 * @param params.name - Optionally pass in a GPUProgram name, used for error logging.
 * @param params.precision - Optionally specify the precision of the input/output/"u_value".
 * @returns
 */
declare function addValueProgram$1(composer: GPUComposer, params: {
    type: GPULayerType;
    value: number | number[];
    name?: string;
    precision?: GLSLPrecision;
}): GPUProgram;
/**
 * Init GPUProgram to multiply uniform "u_value" to a GPULayer.
 * @category GPUProgram Helper
 * @param composer - The current GPUComposer.
 * @param params - Program parameters.
 * @param params.type - The type of the input/output (we assume "u_value" has the same type).
 * @param params.value - Initial value to multiply, if value has length 1 it will be applied to all components of GPULayer.  Change this later using uniform "u_value".
 * @param params.name - Optionally pass in a GPUProgram name, used for error logging.
 * @param params.precision - Optionally specify the precision of the input/output/"u_value".
 * @returns
 */
declare function multiplyValueProgram$1(composer: GPUComposer, params: {
    type: GPULayerType;
    value: number | number[];
    name?: string;
    precision?: GLSLPrecision;
}): GPUProgram;
/**
 * Init GPUProgram to set all elements in a GPULayer to uniform "u_value".
 * @category GPUProgram Helper
 * @param composer - The current GPUComposer.
 * @param params - Program parameters.
 * @param params.type - The type of the output (we assume "u_value" has same type).
 * @param params.value - Initial value to set, if value has length 1 it will be applied to all components of GPULayer.  Change this later using uniform "u_value".
 * @param params.name - Optionally pass in a GPUProgram name, used for error logging.
 * @param params.precision - Optionally specify the precision of the output/"u_value".
 * @returns
 */
declare function setValueProgram$1(composer: GPUComposer, params: {
    type: GPULayerType;
    value: number | number[];
    name?: string;
    precision?: GLSLPrecision;
}): GPUProgram;
/**
 * Init GPUProgram to set all elements in a GPULayer to uniform "u_value".
 * @category GPUProgram Helper
 * @param composer - The current GPUComposer.
 * @param params - Program parameters.
 * @param params.type - The type of the output.
 * @param params.color - Initial color as RGB in range [0, 1], defaults to [0, 0, 0].  Change this later using uniform "u_color".
 * @param params.opacity - Initial opacity in range [0, 1], defaults to 1.  Change this later using uniform "u_opacity".
 * @param params.name - Optionally pass in a GPUProgram name, used for error logging.
 * @param params.precision - Optionally specify the precision of the output/uniforms.
 * @returns
 */
declare function setColorProgram$1(composer: GPUComposer, params: {
    type: GPULayerType;
    color?: number[];
    opacity?: number;
    name?: string;
    precision?: GLSLPrecision;
}): GPUProgram;
/**
 * Init GPUProgram to zero output GPULayer.
 * @category GPUProgram Helper
 * @param composer - The current GPUComposer.
 * @param params - Program parameters.
 * @param params.name - Optionally pass in a GPUProgram name, used for error logging.
 * @returns
 */
declare function zeroProgram$1(composer: GPUComposer, params: {
    name?: string;
}): GPUProgram;
/**
 * Init GPUProgram to render 3 component GPULayer as RGB.
 * @category GPUProgram Helper
 * @param composer - The current GPUComposer.
 * @param params - Program parameters.
 * @param params.type - The type of the input.
 * @param params.name - Optionally pass in a GPUProgram name, used for error logging.
 * @param params.scale - Scaling factor, defaults to 1.  Change this later using uniform "u_scale".
 * @param params.opacity - Opacity, defaults to 1.  Change this later using uniform "u_opacity".
 * @param params.precision - Optionally specify the precision of the input.
 * @returns
 */
declare function renderRGBProgram$1(composer: GPUComposer, params: {
    type: GPULayerType;
    name?: string;
    scale?: number;
    opacity?: number;
    precision?: GLSLPrecision;
}): GPUProgram;
/**
 * Init GPUProgram to render RGBA amplitude of an input GPULayer's components, defaults to grayscale rendering and works for scalar and vector fields.
 * @category GPUProgram Helper
 * @param composer - The current GPUComposer.
 * @param params - Program parameters.
 * @param params.type - The type of the input.
 * @param params.components - Component(s) of input GPULayer to render, defaults to 'xyzw'.
 * @param params.name - Optionally pass in a GPUProgram name, used for error logging.
 * @param params.scale - Scaling factor, defaults to 1.  Change this later using uniform "u_scale".
 * @param params.opacity - Opacity, defaults to 1.  Change this later using uniform "u_opacity".
 * @param params.colorMax - RGB color for amplitude === scale, scaled to [0,1] range, defaults to white.  Change this later using uniform "u_colorMax".
 * @param params.colorMin - RGB color for amplitude === 0, scaled to [0,1] range, defaults to black.  Change this later using uniform "u_colorMin".
 * @param params.precision - Optionally specify the precision of the input.
 * @returns
 */
declare function renderAmplitudeProgram$1(composer: GPUComposer, params: {
    type: GPULayerType;
    components?: string;
    name?: string;
    scale?: number;
    opacity?: number;
    colorMax?: number[];
    colorMin?: number[];
    precision?: GLSLPrecision;
}): GPUProgram;
/**
 * Init GPUProgram to render signed amplitude of an input GPULayer to linearly interpolated colors.
 * @category GPUProgram Helper
 * @param composer - The current GPUComposer.
 * @param params - Program parameters.
 * @param params.type - The type of the input.
 * @param params.name - Optionally pass in a GPUProgram name, used for error logging.
 * @param params.scale - Scaling factor, defaults to 1.  Change this later using uniform "u_scale".
 * @param params.bias - Bias for center point of color range, defaults to 0.  Change this later using uniform "u_bias".
 * @param params.opacity - Opacity, defaults to 1.  Change this later using uniform "u_opacity".
 * @param params.colorMax - RGB color for amplitude === bias + scale, scaled to [0,1] range, defaults to red.  Change this later using uniform "u_colorMax".
 * @param params.colorMin - RGB color for amplitude === bias + scale, scaled to [0,1] range, defaults to blue.  Change this later using uniform "u_colorMin".
 * @param params.colorCenter - RGB color for amplitude === bias, scaled to [0,1] range, defaults to white.  Change this later using uniform "u_colorCenter".
 * @param params.component - Component of input GPULayer to render, defaults to "x".
 * @param params.precision - Optionally specify the precision of the input.
 * @returns
 */
declare function renderSignedAmplitudeProgram$1(composer: GPUComposer, params: {
    type: GPULayerType;
    component?: 'x' | 'y' | 'z' | 'w';
    name?: string;
    scale?: number;
    bias?: number;
    opacity?: number;
    colorMax?: number[];
    colorMin?: number[];
    colorCenter?: number[];
    precision?: GLSLPrecision;
}): GPUProgram;

/**
 * @private
 */
declare const _testing: {
    intForPrecision(precision: GLSLPrecision): 1 | 2 | 0;
    uniformTypeForType(type: GPULayerType, glslVersion: GLSLVersion): "FLOAT" | "INT" | "UINT";
    arrayConstructorForType(type: GPULayerType, halfFloatsAsFloats?: boolean): Float32ArrayConstructor | Uint8ArrayConstructor | Int8ArrayConstructor | Uint16ArrayConstructor | Int16ArrayConstructor | Uint32ArrayConstructor | Int32ArrayConstructor;
    glslTypeForType(type: GPULayerType, numComponents: GPULayerNumComponents): string;
    glslPrefixForType(type: GPULayerType): "" | "u" | "i";
    glslComponentSelectionForNumComponents(numComponents: GPULayerNumComponents): "" | ".x" | ".xy" | ".xyz";
    texturePolyfill(shaderSource: string): {
        shaderSource: string;
        samplerUniforms: string[];
    };
    GLSL1Polyfills(shaderSource: string): string;
    fragmentShaderPolyfills(shaderSource: string, glslVersion: GLSLVersion): string;
    SAMPLER2D_WRAP_X: "GPUIO_WRAP_X";
    SAMPLER2D_WRAP_Y: "GPUIO_WRAP_Y";
    SAMPLER2D_CAST_INT: "GPUIO_CAST_INT";
    SAMPLER2D_FILTER: "GPUIO_FILTER";
    SAMPLER2D_HALF_PX_UNIFORM: "u_gpuio_half_px";
    SAMPLER2D_DIMENSIONS_UNIFORM: "u_gpuio_dimensions";
    shouldCastIntTypeAsFloat(composer: GPUComposer, type: GPULayerType): boolean;
    testWriteSupport(composer: GPUComposer, internalType: GPULayerType): boolean;
    testFilterWrap(composer: GPUComposer, internalType: GPULayerType, filter: GPULayerFilter, wrap: GPULayerWrap): boolean;
    minMaxValuesForType(type: GPULayerType): {
        min: number;
        max: number;
    };
    isValidDataType(type: string): boolean;
    isValidFilter(type: string): boolean;
    isValidWrap(type: string): boolean;
    isValidImageFormat(type: string): boolean;
    isValidImageType(type: string): boolean;
    isValidClearValue(clearValue: number | number[], numComponents: number, type: GPULayerType): boolean;
    isNumberOfType(value: any, type: GPULayerType): boolean;
    checkValidKeys(keys: string[], validKeys: string[], methodName: string, name?: string | undefined): void;
    checkRequiredKeys(keys: string[], requiredKeys: string[], methodName: string, name?: string | undefined): void;
    glsl1VertexIn(shaderSource: string): string;
    castVaryingToFloat(shaderSource: string): string;
    glsl1VertexOut(shaderSource: string): string;
    glsl1FragmentIn(shaderSource: string): string;
    getFragmentOuts(shaderSource: string, programName: string): {
        name: string;
        type: "float" | "uint" | "int" | "vec2" | "vec3" | "vec4" | "ivec2" | "ivec3" | "ivec4" | "uvec2" | "uvec3" | "uvec4";
    }[];
    glsl1FragmentOut(shaderSource: string, programName: string): string[];
    checkFragmentShaderForFragColor(shaderSource: string, glslVersion: GLSLVersion, name: string): void;
    glsl1Texture(shaderSource: string): string;
    glsl1Sampler2D(shaderSource: string): string;
    glsl1Uint(shaderSource: string): string;
    highpToMediump(shaderSource: string): string;
    stripVersion(shaderSource: string): string;
    stripPrecision(shaderSource: string): string;
    stripComments(shaderSource: string): string;
    getSampler2DsInProgram(shaderSource: string): string[];
    getExtension(composer: GPUComposer, extensionName: string, optional?: boolean): any;
    OES_TEXTURE_FLOAT: "OES_texture_float";
    OES_TEXTURE_HALF_FLOAT: "OES_texture_half_float";
    OES_TEXTURE_FLOAT_LINEAR: "OES_texture_float_linear";
    OES_TEXTURE_HAlF_FLOAT_LINEAR: "OES_texture_half_float_linear";
    WEBGL_DEPTH_TEXTURE: "WEBGL_depth_texture";
    EXT_COLOR_BUFFER_FLOAT: "EXT_color_buffer_float";
    EXT_COLOR_BUFFER_HALF_FLOAT: "EXT_color_buffer_half_float";
    OES_VERTEX_ARRAY_OBJECT: "OES_vertex_array_object";
    OES_ELEMENT_INDEX_UINT: "OES_element_index_uint";
    OES_STANDARD_DERIVATIVES: "OES_standard_derivatives";
    isFloatType: typeof isFloatType;
    isUnsignedIntType: typeof isUnsignedIntType;
    isSignedIntType: typeof isSignedIntType;
    isIntType: typeof isIntType;
    makeShaderHeader: typeof makeShaderHeader;
    compileShader: typeof compileShader;
    initGLProgram: typeof initGLProgram;
    readyToRead: typeof readyToRead;
    preprocessVertexShader: typeof preprocessVertexShader;
    preprocessFragmentShader: typeof preprocessFragmentShader;
    isPowerOf2: typeof isPowerOf2;
    initSequentialFloatArray: typeof initSequentialFloatArray;
    uniformInternalTypeForValue: typeof uniformInternalTypeForValue;
    indexOfLayerInArray: typeof indexOfLayerInArray;
    readPixelsAsync: typeof readPixelsAsync;
};
declare const isWebGL2: typeof isWebGL2$1;
declare const isWebGL2Supported: typeof isWebGL2Supported$1;
declare const isHighpSupportedInVertexShader: typeof isHighpSupportedInVertexShader$1;
declare const isHighpSupportedInFragmentShader: typeof isHighpSupportedInFragmentShader$1;
declare const getVertexShaderMediumpPrecision: typeof getVertexShaderMediumpPrecision$1;
declare const getFragmentShaderMediumpPrecision: typeof getFragmentShaderMediumpPrecision$1;
declare const copyProgram: typeof copyProgram$1;
declare const addLayersProgram: typeof addLayersProgram$1;
declare const addValueProgram: typeof addValueProgram$1;
declare const multiplyValueProgram: typeof multiplyValueProgram$1;
declare const setValueProgram: typeof setValueProgram$1;
declare const setColorProgram: typeof setColorProgram$1;
declare const zeroProgram: typeof zeroProgram$1;
declare const renderRGBProgram: typeof renderRGBProgram$1;
declare const renderAmplitudeProgram: typeof renderAmplitudeProgram$1;
declare const renderSignedAmplitudeProgram: typeof renderSignedAmplitudeProgram$1;

export { BOOL, BOOL_1D_UNIFORM, BOOL_2D_UNIFORM, BOOL_3D_UNIFORM, BOOL_4D_UNIFORM, BOUNDARY_BOTTOM, BOUNDARY_LEFT, BOUNDARY_RIGHT, BOUNDARY_TOP, BYTE, BoundaryEdge, CLAMP_TO_EDGE, CompileTimeConstants, DEFAULT_CIRCLE_NUM_SEGMENTS, DEFAULT_ERROR_CALLBACK, DEFAULT_PROGRAM_NAME, EXPERIMENTAL_WEBGL, EXPERIMENTAL_WEBGL2, ErrorCallback, FLOAT, FLOAT_1D_UNIFORM, FLOAT_2D_UNIFORM, FLOAT_3D_UNIFORM, FLOAT_4D_UNIFORM, GLSL1, GLSL3, GLSLPrecision, GLSLVersion, GPUComposer, GPUIO_FLOAT_PRECISION, GPUIO_INT_PRECISION, GPUIO_VS_INDEXED_POSITIONS, GPUIO_VS_NORMAL_ATTRIBUTE, GPUIO_VS_POSITION_W_ACCUM, GPUIO_VS_UV_ATTRIBUTE, GPUIO_VS_WRAP_X, GPUIO_VS_WRAP_Y, GPUIndexBuffer, GPULayer, GPULayerArray, GPULayerFilter, GPULayerNumComponents, GPULayerState, GPULayerType, GPULayerWrap, GPUProgram, HALF_FLOAT, INT, INT_1D_UNIFORM, INT_2D_UNIFORM, INT_3D_UNIFORM, INT_4D_UNIFORM, ImageFormat, ImageType, LAYER_LINES_PROGRAM_NAME, LAYER_MESH_PROGRAM_NAME, LAYER_POINTS_PROGRAM_NAME, LAYER_VECTOR_FIELD_PROGRAM_NAME, LINEAR, MAX_BYTE, MAX_FLOAT_INT, MAX_HALF_FLOAT_INT, MAX_INT, MAX_SHORT, MAX_UNSIGNED_BYTE, MAX_UNSIGNED_INT, MAX_UNSIGNED_SHORT, MIN_BYTE, MIN_FLOAT_INT, MIN_HALF_FLOAT_INT, MIN_INT, MIN_SHORT, MIN_UNSIGNED_BYTE, MIN_UNSIGNED_INT, MIN_UNSIGNED_SHORT, NEAREST, PRECISION_HIGH_P, PRECISION_LOW_P, PRECISION_MEDIUM_P, PROGRAM_NAME_INTERNAL, REPEAT, RGB, RGBA, SEGMENT_PROGRAM_NAME, SHORT, UINT, UINT_1D_UNIFORM, UINT_2D_UNIFORM, UINT_3D_UNIFORM, UINT_4D_UNIFORM, UNSIGNED_BYTE, UNSIGNED_INT, UNSIGNED_SHORT, Uniform, UniformInternalType, UniformParams, UniformType, UniformValue, WEBGL1, WEBGL2, _testing, addLayersProgram, addValueProgram, copyProgram, getFragmentShaderMediumpPrecision, getVertexShaderMediumpPrecision, isHighpSupportedInFragmentShader, isHighpSupportedInVertexShader, isWebGL2, isWebGL2Supported, multiplyValueProgram, renderAmplitudeProgram, renderRGBProgram, renderSignedAmplitudeProgram, setColorProgram, setValueProgram, validArrayTypes, validDataTypes, validFilters, validImageFormats, validImageTypes, validWraps, zeroProgram };
