// @ts-ignore
import { changeDpiBlob } from 'changedpi';
import { isArray, isFiniteNumber, isNonNegativeInteger } from '@amandaghassaei/type-checks';
import { GPULayer } from './GPULayer';
import './GPULayerHelpers';
import {
	GPULayerType,
	FLOAT,
	INT,
	GLSLVersion,
	GLSL1,
	GLSL3,
	WEBGL2,
	WEBGL1,
	EXPERIMENTAL_WEBGL,
	PROGRAM_NAME_INTERNAL,
	CompileTimeConstants,
	DEFAULT_PROGRAM_NAME,
	SEGMENT_PROGRAM_NAME,
	LAYER_POINTS_PROGRAM_NAME,
	LAYER_VECTOR_FIELD_PROGRAM_NAME,
	LAYER_LINES_PROGRAM_NAME,
	ErrorCallback,
	DEFAULT_CIRCLE_NUM_SEGMENTS,
	UINT,
	GLSLPrecision,
	PRECISION_HIGH_P,
	DEFAULT_ERROR_CALLBACK,
	GPULayerState,
	GPUIO_VS_POSITION_W_ACCUM,
	GPUIO_VS_WRAP_X,
	GPUIO_VS_WRAP_Y,
	MAX_FLOAT_INT,
	EXPERIMENTAL_WEBGL2,
	BoundaryEdge,
	BOUNDARY_LEFT,
	BOUNDARY_RIGHT,
	BOUNDARY_TOP,
	BOUNDARY_BOTTOM,
	LAYER_MESH_PROGRAM_NAME,
} from './constants';
import { GPUProgram } from './GPUProgram';
// Just importing the types here.
// This repo does not depend on three, only @types/three is installed as dev dependency.
import type {
	WebGLRenderer,
	Vector4,
	WebGL1Renderer,
} from 'three';
import * as ThreejsUtils from './Vector4';
import {
	isWebGL2,
	initSequentialFloatArray,
	preprocessVertexShader,
	compileShader,
	indexOfLayerInArray,
} from './utils';
import { DEFAULT_VERT_SHADER_SOURCE } from './glsl/vertex/DefaultVertexShader';
import { LAYER_LINES_VERTEX_SHADER_SOURCE } from './glsl/vertex/LayerLinesVertexShader';
import { SEGMENT_VERTEX_SHADER_SOURCE } from './glsl/vertex/SegmentVertexShader';
import { LAYER_POINTS_VERTEX_SHADER_SOURCE } from './glsl/vertex/LayerPointsVertexShader';
import { LAYER_VECTOR_FIELD_VERTEX_SHADER_SOURCE } from './glsl/vertex/LayerVectorFieldVertexShader';
import { LAYER_MESH_VERTEX_SHADER_SOURCE } from './glsl/vertex/LayerMeshVertexShader';
import { uniformTypeForType } from './conversions';
import {
	copyProgram,
	setValueProgram,
} from './Programs';
import { checkRequiredKeys, checkValidKeys, isValidClearValue } from './checks';
import { bindFrameBuffer } from './framebuffers';
import { getExtension, OES_VERTEX_ARRAY_OBJECT } from './extensions';
import { GPUIndexBuffer } from './GPUIndexBuffer';

export class GPUComposer {
	/**
	 * The WebGL context associated with this GPUComposer.
	 */
	readonly gl!: WebGLRenderingContext | WebGL2RenderingContext;
	/**
	 * The GLSL version being used by the GPUComposer.
	 */
	readonly glslVersion!: GLSLVersion;
	/**
	 * Flag for WebGL version.
	 */
	readonly isWebGL2!: boolean;
	/**
	 * The global integer precision to apply to shader programs.
	 */
	readonly intPrecision!: GLSLPrecision;
	/**
	 * The global float precision to apply to shader programs.
	 */
	readonly floatPrecision!: GLSLPrecision;
	/**
	 * Store the width and height of the current canvas at full res.
	 */
	private _width!: number;
	private _height!: number;

	/**
	 * @private
	 */
	readonly _errorCallback: ErrorCallback;
	private _errorState = false;

	// Save threejs renderer if passed in.
	/**
	 * @private
	 */
	readonly _threeRenderer?: WebGLRenderer | WebGL1Renderer;
	
	/**
	 * Precomputed vertex buffers (inited as needed).
	 */
	private _quadPositionsBuffer?: WebGLBuffer;
	private _boundaryPositionsBuffer?: WebGLBuffer;
	// Cache multiple circle positions buffers for various num segments, use numSegments as key.
	private _circlePositionsBuffer: { [key: number]: WebGLBuffer } = {};
	private _pointIndexArray?: Float32Array;
	private _pointIndexBuffer?: WebGLBuffer;
	private _meshIndexArray?: Float32Array;
	private _meshIndexBuffer?: WebGLBuffer;
	private _vectorFieldIndexArray?: Float32Array;
	private _vectorFieldIndexBuffer?: WebGLBuffer;
	private _indexedLinesIndexBuffer?: WebGLBuffer;
	/**
	 * Cache vertex shader attribute locations.
	 */
	private _vertexAttributeLocations: {[key: string]: WeakMap<WebGLProgram, number>} = {};
	private _enabledVertexAttributes: {[key: number]: boolean} = {};;

	// Keep track of all GL extensions that have been loaded.
	/**
	 * @private
	 */
	readonly _extensions: { [key: string]: any } = {};

	// Value to set when clear() is called, defaults to zero.
	// Access with GPUComposer.clearValue.
	private _clearValue: number | number[] = 0;
	private _clearValueVec4? : number[];

	/**
	 * Cache some generic programs for copying data.
	 * These are needed for rendering partial screen geometries.
	 */
	private readonly _copyPrograms: {
		[FLOAT]?: GPUProgram,
		[INT]?: GPUProgram,
		[UINT]?: GPUProgram,
	} = {};

	// Other util programs.
	/**
	 * Cache some generic programs for setting value from uniform.
	 * These are used by GOUComposer.clear() and GPULayer.clear(), among other things
	 */
	private readonly _setValuePrograms: {
		[FLOAT]?: GPUProgram,
		[INT]?: GPUProgram,
		[UINT]?: GPUProgram,
	} = {};
	private _wrappedLineColorProgram?: GPUProgram; // We only need a FLOAT version of this.

	/**
	 * Vertex shaders are shared across all GPUProgram instances.
	 * @private
	 */
	readonly _vertexShaders: {[key in PROGRAM_NAME_INTERNAL]: {
		src: string,
		compiledShaders: { [key: string]: WebGLShader },
	}} = {
		[DEFAULT_PROGRAM_NAME]: {
			src: DEFAULT_VERT_SHADER_SOURCE,
			compiledShaders: {},
		},
		[SEGMENT_PROGRAM_NAME]: {
			src: SEGMENT_VERTEX_SHADER_SOURCE,
			compiledShaders: {},
		},
		[LAYER_POINTS_PROGRAM_NAME]: {
			src: LAYER_POINTS_VERTEX_SHADER_SOURCE,
			compiledShaders: {},
		},
		[LAYER_VECTOR_FIELD_PROGRAM_NAME]: {
			src: LAYER_VECTOR_FIELD_VERTEX_SHADER_SOURCE,
			compiledShaders: {},
		},
		[LAYER_LINES_PROGRAM_NAME]: {
			src: LAYER_LINES_VERTEX_SHADER_SOURCE,
			compiledShaders: {},
		},
		[LAYER_MESH_PROGRAM_NAME]: {
			src: LAYER_MESH_VERTEX_SHADER_SOURCE,
			compiledShaders: {},
		},
	};

	/**
	 * Flag to set GPUComposer for verbose logging, defaults to false.
	 */
	verboseLogging = false;

	/**
	 * Variables for tracking fps of GPUComposer with tick().
	 */
	private _lastTickTime?: number;
	private _lastTickFPS?: number
	private _numTicks = 0;

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
	 static initWithThreeRenderer(
		renderer: WebGLRenderer| WebGL1Renderer,
		params?: {
			glslVersion?: GLSLVersion,
			intPrecision?: GLSLPrecision,
			floatPrecision?: GLSLPrecision,
			clearValue?: number | number[],
			verboseLogging?: boolean,
			errorCallback?: ErrorCallback,
		},
	) {
		const composer = new GPUComposer(
			{
				floatPrecision: renderer.capabilities.precision as GLSLPrecision,
				intPrecision: renderer.capabilities.precision as GLSLPrecision,
				...params,
				canvas: renderer.domElement,
				context: renderer.getContext(),
			},
		);
		// Attach renderer.
		// @ts-ignore
		composer._threeRenderer = renderer;
		return composer;
	}

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
	constructor(
		params: {
			canvas: HTMLCanvasElement,
			context?: WebGLRenderingContext | WebGL2RenderingContext,
			contextID?: typeof WEBGL2 | typeof WEBGL1 | typeof EXPERIMENTAL_WEBGL | typeof EXPERIMENTAL_WEBGL2 | string,
			contextAttributes?: {
				[key: string]: any,
			},
			glslVersion?: GLSLVersion,
			intPrecision?: GLSLPrecision,
			floatPrecision?: GLSLPrecision,
			clearValue?: number | number[],
			verboseLogging?: boolean,
			// Optionally pass in an error callback in case we want to handle errors related to webgl support.
			// e.g. throw up a modal telling user this will not work on their device.
			errorCallback?: ErrorCallback,
		},
	) {
		// Check params.
		const validKeys = ['canvas', 'context', 'contextID', 'contextAttributes', 'glslVersion', 'intPrecision', 'floatPrecision', 'clearValue', 'verboseLogging', 'errorCallback'];
		const requiredKeys = ['canvas'];
		const keys = Object.keys(params);
		checkValidKeys(keys, validKeys, 'GPUComposer(params)');
		checkRequiredKeys(keys, requiredKeys, 'GPUComposer(params)');

		if (params.verboseLogging !== undefined) this.verboseLogging = params.verboseLogging;

		// Save callback in case we run into an error.
		const self = this;
		this._errorCallback = (message: string) => {
			if (self._errorState) {
				return;
			}
			self._errorState = true;
			params.errorCallback ? params.errorCallback(message) : DEFAULT_ERROR_CALLBACK(message);
		}

		const { canvas } = params;
		let gl = params.context;

		// Init GL.
		if (!gl) {
			// Init a gl context if not passed in.
			if (params.contextID) {
				const _gl = canvas.getContext(params.contextID, params.contextAttributes) as WebGLRenderingContext | null;
				if (!_gl) {
					console.warn(`Unable to initialize WebGL context with contextID: ${params.contextID}.`);
				} else {
					gl = _gl;
				}
			}
			if (!gl) {
				const _gl = canvas.getContext(WEBGL2, params.contextAttributes)  as WebGL2RenderingContext | null
					|| canvas.getContext(WEBGL1, params.contextAttributes)  as WebGLRenderingContext | null
					|| canvas.getContext(EXPERIMENTAL_WEBGL2, params.contextAttributes)  as WebGLRenderingContext | null
					|| canvas.getContext(EXPERIMENTAL_WEBGL, params.contextAttributes)  as WebGLRenderingContext | null;
				if (_gl) {
					gl = _gl;
				}
			}
			if (!gl) {
				this._errorCallback('Unable to initialize WebGL context.');
				return;
			}
		}
		this.isWebGL2 = isWebGL2(gl);
		if (this.isWebGL2) {
			if (this.verboseLogging) console.log('Using WebGL 2.0 context.');
		} else {
			if (this.verboseLogging) console.log('Using WebGL 1.0 context.');
		}
		this.gl = gl;

		// Save glsl version, default to 3 if using webgl2 context.
		let glslVersion = params.glslVersion || (this.isWebGL2 ? GLSL3 : GLSL1);
		if (!this.isWebGL2 && glslVersion === GLSL3) {
			console.warn('GLSL3.x is incompatible with WebGL1.0 contexts, falling back to GLSL1.');
			glslVersion = GLSL1; // Fall back to GLSL1 in these cases.
		}
		this.glslVersion = glslVersion;

		// Set default int/float precision.
		this.intPrecision = params.intPrecision || PRECISION_HIGH_P;
		this.floatPrecision = params.floatPrecision || PRECISION_HIGH_P;

		// GL setup.
		// Disable depth testing globally.
		gl.disable(gl.DEPTH_TEST);
		// Set unpack alignment to 1 so we can have textures of arbitrary dimensions.
		// https://stackoverflow.com/questions/51582282/error-when-creating-textures-in-webgl-with-the-rgb-format
		gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);

		// Unbind active buffer.
		if (this.isWebGL2) (gl as WebGL2RenderingContext).bindVertexArray(null);
		else {
			const ext = getExtension(this, OES_VERTEX_ARRAY_OBJECT, true);
			ext.bindVertexArrayOES(null)
		}
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		if (params.clearValue !== undefined) {
			this.clearValue = params.clearValue;
		}

		// Canvas setup.
		this.resize([canvas.clientWidth, canvas.clientHeight]);

		if (this.verboseLogging) {
			// Log number of textures available.
			console.log(`${this.gl.getParameter(this.gl.MAX_TEXTURE_IMAGE_UNITS)} textures max.`);
		}
	}

	get canvas() {
		return this.gl.canvas as HTMLCanvasElement;
	}

	/**
	 * Gets (and caches) generic set value programs for several input types.
	 * Used for GPUComposer.clear() and GPULayer.clear(), among other things.
	 * @private
	 */
	_setValueProgramForType(type: GPULayerType) {
		const { _setValuePrograms } = this;
		const key = uniformTypeForType(type, this.glslVersion);
		if (_setValuePrograms[key] === undefined) {
			_setValuePrograms[key] = setValueProgram(this, { type, value: [0, 0, 0, 0] });
		}
		return _setValuePrograms[key]!;
	}
	/**
	 * Gets (and caches) generic copy programs for several input types.
	 * Used for partial rendering to output, among other things.
	 * @private
	 */
	_copyProgramForType(type: GPULayerType) {
		const { _copyPrograms } = this;
		const key = uniformTypeForType(type, this.glslVersion);
		if (_copyPrograms[key] === undefined) {
			_copyPrograms[key] = copyProgram(this, { type });
		}
		return _copyPrograms[key]!;
	}
	// /**
	//  * Gets (and caches) a generic color program for wrapped line segment rendering.
	//  * @private
	//  */
	// private _getWrappedLineColorProgram() {
	// 	if (this._wrappedLineColorProgram === undefined) {
	// 		this._wrappedLineColorProgram = wrappedLineColorProgram({ composer: this });
	// 	}
	// 	return this._wrappedLineColorProgram;
	// }

	/**
	 * Init a buffer for vertex shader attributes.
	 * @private
	 */
	private _initVertexBuffer(
		data: Float32Array,
	) {
		const { _errorCallback, gl, isWebGL2 } = this;
		// Unbind any  VAOs.
		if (isWebGL2) (gl as WebGL2RenderingContext).bindVertexArray(null);
		else {
			const ext = getExtension(this, OES_VERTEX_ARRAY_OBJECT, true);
			ext.bindVertexArrayOES(null)
		}
		const buffer = gl.createBuffer();
		if (!buffer) {
			_errorCallback('Unable to allocate gl buffer.');
			return;
		}
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		// Add buffer data.
		gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
		return buffer;
	}
	/**
	 * Get (and cache) positions buffer for rendering full screen quads.
	 * @private
	 */
	_getQuadPositionsBuffer() {
		if (this._quadPositionsBuffer === undefined) {
			const fsQuadPositions = new Float32Array([ -1, -1, 1, -1, -1, 1, 1, 1 ]);
			this._quadPositionsBuffer = this._initVertexBuffer(fsQuadPositions)!;
		}
		return this._quadPositionsBuffer!;
	}
	/**
	 * Get (and cache) positions buffer for rendering lines on boundary.
	 * @private
	 */
	private _getBoundaryPositionsBuffer() {
		if (this._boundaryPositionsBuffer === undefined) {
			const boundaryPositions = new Float32Array([ -1, -1, 1, -1, 1, 1, -1, 1, -1, -1 ]);
			this._boundaryPositionsBuffer = this._initVertexBuffer(boundaryPositions)!;
		}
		return this._boundaryPositionsBuffer!;
	}
	/**
	 * Get (and cache) positions buffer for rendering circle with various numbers of segments.
	 * @private
	 */
	private _getCirclePositionsBuffer(numSegments: number) {
		const { _circlePositionsBuffer } = this;
		if (_circlePositionsBuffer[numSegments] == undefined) {
			const unitCirclePoints = [0, 0];
			for (let i = 0; i < numSegments; i++) {
				unitCirclePoints.push(
					Math.cos(2 * Math.PI * i / numSegments),
					Math.sin(2 * Math.PI * i / numSegments),
				);
			}
			// Add one more point to close the loop on the triangle fan.
			unitCirclePoints.push(
				Math.cos(0),
				Math.sin(0),
			);
			const circlePositions = new Float32Array(unitCirclePoints);
			const buffer = this._initVertexBuffer(circlePositions)!;
			_circlePositionsBuffer[numSegments] = buffer;
		}
		return _circlePositionsBuffer[numSegments];
	}

	/**
	 * Used internally, see GPULayer.clone() for public API.
	 * @private
	 */
	_cloneGPULayer(gpuLayer: GPULayer, name?: string) {
		const dimensions = gpuLayer.is1D() ? gpuLayer.length : [gpuLayer.width, gpuLayer.height];

		const clone = new GPULayer(this, {
			name: name || `${gpuLayer.name}-clone`,
			dimensions,
			type: gpuLayer.type,
			numComponents: gpuLayer.numComponents,
			filter: gpuLayer.filter,
			wrapX: gpuLayer.wrapX,
			wrapY: gpuLayer.wrapY,
			numBuffers: gpuLayer.numBuffers,
			clearValue: gpuLayer.clearValue,
		});

		// Copy current state with several draw calls.
		const copyProgram = this._copyProgramForType(gpuLayer.type);
		// Set bufferIndex = gpuLayer.numBuffers - 1.
		for (let i = 0; i < gpuLayer.numBuffers - 1; i++ ){
			clone.incrementBufferIndex();
		}
		for (let i = 0; i < gpuLayer.numBuffers; i++) {
			this.step({
				program: copyProgram,
				input: gpuLayer.getStateAtIndex(i),
				output: clone,
			});
		}
		// Increment clone's buffer index until it is identical to the original layer.
		for (let i = -1; i < gpuLayer.bufferIndex; i++ ){
			clone.incrementBufferIndex();
		}

		return clone;
	}

	/**
	 * Gets (and caches) vertex shaders based on shader source code and compile time constants.
	 * Tries to minimize the number of new vertex shaders that must be compiled.
	 * @private
	 */
	 _getVertexShader(
		name: PROGRAM_NAME_INTERNAL,
		vertexID: string,
		vertexCompileConstants: CompileTimeConstants,
		programName: string,
	) {
		const {
			_errorCallback,
			_vertexShaders,
			gl,
			glslVersion,
			intPrecision,
			floatPrecision,
		} = this;
		const { compiledShaders, src } = _vertexShaders[name];
		if (vertexID === '') vertexID = '_default';
		if (compiledShaders[vertexID] === undefined) {
			// Compile a vertex shader (this only happens once for each possible vertex shader across all GPUPrograms).
			if (src === '') {
				throw new Error(`Error compiling GPUProgram "${programName}": no source for vertex shader with name "${name}".`);
			}
			const preprocessedSrc = preprocessVertexShader(src, glslVersion);
			const shader = compileShader(
				gl,
				glslVersion,
				intPrecision,
				floatPrecision,
				preprocessedSrc,
				gl.VERTEX_SHADER,
				programName,
				_errorCallback,
				vertexCompileConstants,
				undefined,
				true,
			);
			if (!shader) {
				_errorCallback(`Unable to compile "${name}${vertexID}" vertex shader for GPUProgram "${programName}".`);
				return;
			}
			// Save the results so this does not have to be repeated.
			compiledShaders[vertexID] = shader;
		}
		return compiledShaders[vertexID];
	}

	/**
	 * Notify the GPUComposer that the canvas should change size.
	 * @param dimensions - The new [width, height] to resize to.
	 */
	resize(dimensions: [number, number]) {
		const { canvas } = this;
		const [width, height] = dimensions;
		if (!isNonNegativeInteger(width) || !isNonNegativeInteger(height)) {
			if (!isArray(dimensions)) throw new Error(`Invalid dimensions parameter supplied to GPUComposer.resize(), expected dimensions array of length 2, got: ${JSON.stringify(dimensions)}`);
			else throw new Error(`Invalid dimensions parameter supplied to GPUComposer.resize(), expected positive integers, got: ${width}, ${height}`);
		}
		// Set correct canvas pixel size.
		// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/By_example/Canvas_size_and_WebGL
		canvas.width = width;
		canvas.height = height;
		// Save dimensions.
		this._width = width;
		this._height = height;
	};

	/**
	 * Set inputs and outputs in preparation for draw call.
	 * @private
	 */
	private _drawSetup(
		gpuProgram: GPUProgram,
		programName: PROGRAM_NAME_INTERNAL,
		vertexCompileConstants: CompileTimeConstants,
		fullscreenRender: boolean,
		input?: (GPULayer | GPULayerState)[] | GPULayer | GPULayerState,
		output?: GPULayer | GPULayer[],
	) {
		const { gl } = this;

		// CAUTION: the order of these next few lines is important.

		// Get a shallow copy of current textures.
		// This line must come before this._setOutputLayer() as it depends on current internal state.
		const inputTextures: GPULayerState[] = [];
		if (input) {
			if ((input as GPULayerState).layer) {
				inputTextures.push(input as GPULayerState);
			} else if (input.constructor === GPULayer) {
				inputTextures.push((input as GPULayer).currentState);
			} else {
				for (let i = 0; i < (input as (GPULayer | GPULayerState)[]).length; i++) {
					const layer = (input as (GPULayer | GPULayerState)[])[i];
					inputTextures.push((layer as GPULayer).currentState ? (layer as GPULayer).currentState : layer as GPULayerState);
				}
			}
		}

		const program = gpuProgram._getProgramWithName(programName, vertexCompileConstants, inputTextures)!;

		// Set output framebuffer.
		// This may modify WebGL internal state.
		this._setOutputLayer(gpuProgram.name, fullscreenRender, input, output);

		// Set current program.
		// Must do this before calling gpuProgram._setInternalFragmentUniforms(program, inputTextures);
		gl.useProgram(program);

		// Set input textures.
		for (let i = 0; i < inputTextures.length; i++) {
			gl.activeTexture(gl.TEXTURE0 + i);
			gl.bindTexture(gl.TEXTURE_2D, inputTextures[i].texture);
		}
		gpuProgram._setInternalFragmentUniforms(program, inputTextures);
		return program;
	}
	/**
	 * Set blend mode for draw call.
	 * @private
	 */
	private _setBlendMode(blendAlpha?: boolean) {
		const { gl } = this;
		if (blendAlpha) {
			gl.enable(gl.BLEND);
			gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		}
	}
	/**
	 * Add GPULayer to inputs if needed.
	 * @private
	 */
	private _addLayerToInputs(
		layer: GPULayer,
		input?:  (GPULayer | GPULayerState)[] | GPULayer | GPULayerState,
	) {
		// Add layer to end of input if needed.
		// Do this with no mutations.
		if (input === undefined) {
			return [layer];
		}
		if (isArray(input)) {
			// Return input with layer added if needed.
			if (indexOfLayerInArray(layer, (input as (GPULayer | GPULayerState)[])) >= 0) {
				return input  as (GPULayer | GPULayerState)[];
			}
			return [...(input as (GPULayer | GPULayerState)[]), layer];
		}
		if (input === layer || (input as GPULayerState).layer === layer) {
			return [input as GPULayerState];
		}
		return [(input as GPULayer | GPULayerState), layer];
	}
	/**
	 * Copy data from input to output.
	 * This is used when rendering to part of output state (not fullscreen quad).
	 * @private
	 */
	private _passThroughLayerDataFromInputToOutput(state: GPULayer) {
		// TODO: figure out the fastest way to copy a texture.
		const copyProgram = this._copyProgramForType(state._internalType);
		this.step({
			program: copyProgram,
			input: state,
			output: state,
		});
	}
	/**
	 * Set output for draw command.
	 * @private
	 */
	private _setOutputLayer(
		programName: string,
		fullscreenRender: boolean,
		input?: (GPULayer | GPULayerState)[] | GPULayer | GPULayerState,
		output?: GPULayer | GPULayer[], // Undefined renders to screen.
	) {
		const { gl, isWebGL2 } = this;

		// Render to screen.
		if (!output) {
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			// Resize viewport.
			const { _width, _height } = this;
			gl.viewport(0, 0, _width, _height);
			return;
		}

		const outputArray = (isArray(output) ? output : [output]) as GPULayer[];

		for (let i = 0, numOutputs = outputArray.length; i < numOutputs; i++) {
			const outputLayer = outputArray[i];
			// Check if output is same as one of input layers.
			if (input && ((input === output || (input as GPULayerState).layer === output) ||
				(isArray(input) && indexOfLayerInArray(outputLayer, input as (GPULayer | GPULayerState)[]) >= 0))) {
				if (outputLayer.numBuffers === 1) {
					throw new Error(`Cannot use same buffer "${outputLayer.name}" for input and output of a program. Try increasing the number of buffers in your output layer to at least 2 so you can render to nextState using currentState as an input.`);
				}
				if (fullscreenRender) {
					// Render and increment buffer.
					outputLayer._prepareForWrite(true);
				} else {
					// Pass input texture through to output.
					this._passThroughLayerDataFromInputToOutput(outputLayer);
					// Render to output without incrementing buffer.
					outputLayer._prepareForWrite(false);
				}
			} else {
				if (fullscreenRender) {
					// Render and increment buffer.
					outputLayer._prepareForWrite(true);
				} else {
					// If we are doing a sneaky thing with a swapped texture and are
					// only rendering part of the screen, we may need to add a copy operation.
					if (outputLayer._usingTextureOverrideForCurrentBuffer()) {
						this._passThroughLayerDataFromInputToOutput(outputLayer);
					}
					outputLayer._prepareForWrite(false);
				}
			}
		}

		// Bind framebuffer.
		const layer0 = outputArray[0];
		let additionalTextures: WebGLTexture[] | undefined = undefined;
		const drawBuffers = [gl.COLOR_ATTACHMENT0];
		if (outputArray.length > 1) {
			additionalTextures = [];
			for (let i = 1, numOutputs = outputArray.length; i < numOutputs; i++) {
				additionalTextures.push(outputArray[i]._currentTexture);
				drawBuffers.push(gl.COLOR_ATTACHMENT0 + i);
			}
		}
		bindFrameBuffer(this, layer0, layer0._currentTexture, additionalTextures);
		// Tell WebGL to draw to output textures.
		if (isWebGL2) {
			(gl as WebGL2RenderingContext).drawBuffers(drawBuffers);
		}
		// Resize viewport.
		const { width, height } = this._widthHeightForOutput(programName, output);
		gl.viewport(0, 0, width, height);
	};
	/**
	 * Set vertex shader attribute.
	 * @private
	 */
	private _setVertexAttribute(program: WebGLProgram, name: string, size: number, programName: string) {
		const { gl, _vertexAttributeLocations, _enabledVertexAttributes } = this;
		// Enable vertex attribute array.
		let locations = _vertexAttributeLocations[name];
		let location;
		if (!locations) {
			locations = new WeakMap<WebGLProgram, number>();
			_vertexAttributeLocations[name] = locations;
		} else {
		// 	location = locations.get(program);
		}
		if (location === undefined) {
			location = gl.getAttribLocation(program, name);
			if (location < 0) {
				throw new Error(`Unable to find vertex attribute "${name}" in program "${programName}".`);
			}
			// Cache attribute location.
			locations.set(program, location);
		}

		// INT types not supported for attributes in WebGL1.
		// We're only really using INT vertex attributes for WebGL1 cases anyway,
		// because WebGL1 does not support gl_VertexID.
		// Use FLOAT rather than SHORT bc FLOAT covers more INT range.
		// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
		gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
		// Enable the attribute.
		gl.enableVertexAttribArray(location);
		_enabledVertexAttributes[location] = true;
	}
	private _disableVertexAttributes() {
		const { _enabledVertexAttributes, gl } = this;
		const locations = Object.keys(_enabledVertexAttributes) as any as number[];
		for (let i = 0, numAttributes = locations.length; i < numAttributes; i++) {
			const location = locations[i];
			if (_enabledVertexAttributes[location]) {
				gl.disableVertexAttribArray(location);
				delete _enabledVertexAttributes[location];
			}
		}
	}
	/**
	 * Set vertex shader position attribute.
	 * @private
	 */
	_setPositionAttribute(program: WebGLProgram, programName: string) {
		this._setVertexAttribute(program, 'a_gpuio_position', 2, programName);
	}
	/**
	 * Set vertex shader index attribute.
	 * @private
	 */
	private _setIndexAttribute(program: WebGLProgram, programName: string) {
		this._setVertexAttribute(program, 'a_gpuio_index', 1, programName);
	}
	/**
	 * Set vertex shader uv attribute.
	 * @private
	 */
	private _setUVAttribute(program: WebGLProgram, programName: string) {
		this._setVertexAttribute(program, 'a_gpuio_uv', 2, programName);
	}

	private _widthHeightForOutput(programName: string, output?: GPULayer | GPULayer[]) {
		if (isArray(output)) {
			// Check that all outputs have the same size.
			const firstOutput = (output as GPULayer[])[0];
			const width = firstOutput ? firstOutput.width : this._width;
			const height = firstOutput ? firstOutput.height : this._height;
			for (let i = 1, numOutputs = (output as GPULayer[]).length; i < numOutputs; i++) {
				const nextOutput = (output as GPULayer[])[i];
				if (nextOutput.width !== width || nextOutput.height !== height) {
					throw new Error(`Output GPULayers must have the same dimensions, got dimensions [${width}, ${height}] and [${nextOutput.width}, ${nextOutput.height}] for program "${programName}".`);
				}
			}
			return { width, height };
		}
		const width = output ? (output as GPULayer).width : this._width;
		const height = output ? (output as GPULayer).height : this._height;
		return { width, height};
	}

	/**
	 * Call stepping/drawing function once for each output.
	 * This is required when attempting to draw to multiple outputs using GLSL1.
	 */
	private _iterateOverOutputsIfNeeded(params: any, methodName: string) {
		if (params.output && isArray(params.output) && this.glslVersion === GLSL1) {
			for (let i = 0, numOutputs = (params.output as GPULayer[]).length; i < numOutputs; i++) {
				(this[methodName as keyof this] as any)({
					...params,
					program: i === 0 ? params.program : params.program._childPrograms![i - 1],
					output: (params.output as GPULayer[])[i],
				});
			}
			return true;
		}
		return false;
	}

	private _drawFinish(params: {
		blendAlpha?: boolean,
	}) {
		const { gl } = this;
		// Reset WebGL state.
		if (params.blendAlpha) gl.disable(gl.BLEND);
		// this._disableVertexAttributes();
	}

	/**
	 * Step GPUProgram entire fullscreen quad.
	 * @param params - Step parameters.
	 * @param params.program - GPUProgram to run.
	 * @param params.input - Input GPULayers to GPUProgram.
	 * @param params.output - Output GPULayer, will draw to screen if undefined.
	 * @param params.blendAlpha - Blend mode for draw, defaults to false.
	 * @returns 
	 */
	step(
		params: {
			program: GPUProgram,
			input?:  (GPULayer | GPULayerState)[] | GPULayer | GPULayerState,
			output?: GPULayer | GPULayer[], // Undefined renders to screen.
			blendAlpha?: boolean,
		},
	) {
		// Check params.
		const validKeys = ['program', 'input', 'output', 'blendAlpha'];
		const requiredKeys = ['program'];
		const keys = Object.keys(params);
		checkValidKeys(keys, validKeys, 'GPUComposer.step(params)');
		checkRequiredKeys(keys, requiredKeys, 'GPUComposer.step(params)');

		if (this._iterateOverOutputsIfNeeded(params, 'step')) return;
		const { gl, _errorState } = this;
		const { program, input, output } = params;

		if (_errorState) return;

		// Do setup - this must come first.
		const glProgram = this._drawSetup(program, DEFAULT_PROGRAM_NAME, {}, true, input, output);

		// Update uniforms and buffers.
		program._setVertexUniform(glProgram, 'u_gpuio_scale', [1, 1], FLOAT);
		program._setVertexUniform(glProgram, 'u_gpuio_translation', [0, 0], FLOAT);
		gl.bindBuffer(gl.ARRAY_BUFFER, this._getQuadPositionsBuffer());
		this._setPositionAttribute(glProgram, program.name);

		// Draw.
		this._setBlendMode(params.blendAlpha);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
		this._drawFinish(params)
	}

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
	stepBoundary(
		params: {
			program: GPUProgram,
			input?:  (GPULayer | GPULayerState)[] | GPULayer | GPULayerState,
			output?: GPULayer | GPULayer[], // Undefined renders to screen.
			edges?: BoundaryEdge | BoundaryEdge[];
			blendAlpha?: boolean,
		},
	) {
		// Check params.
		const validKeys = ['program', 'input', 'output', 'edges', 'blendAlpha'];
		const requiredKeys = ['program'];
		const keys = Object.keys(params);
		checkValidKeys(keys, validKeys, 'GPUComposer.stepBoundary(params)');
		checkRequiredKeys(keys, requiredKeys, 'GPUComposer.stepBoundary(params)');
	
		if (this._iterateOverOutputsIfNeeded(params, 'stepBoundary')) return;
		const { gl, _errorState } = this;
		const { program, input, output } = params;

		if (_errorState) return;

		const { width, height } = this._widthHeightForOutput(program.name, output);

		// Do setup - this must come first.
		const glProgram = this._drawSetup(program, DEFAULT_PROGRAM_NAME, {}, false, input, output);

		// Update uniforms and buffers.
		// Frame needs to be offset and scaled so that all four sides are in viewport.
		const onePx = [ 1 / width, 1 / height];
		program._setVertexUniform(glProgram, 'u_gpuio_scale', [1 - onePx[0], 1 - onePx[1]], FLOAT);
		program._setVertexUniform(glProgram, 'u_gpuio_translation', onePx, FLOAT);
		gl.bindBuffer(gl.ARRAY_BUFFER, this._getBoundaryPositionsBuffer());
		this._setPositionAttribute(glProgram, program.name);

		// Draw.
		this._setBlendMode(params.blendAlpha);
		if (params.edges) {
			let { edges } = params;
			if (!isArray(edges)) edges = [edges as BoundaryEdge];
			for (let i = 0, numEdges = edges.length; i < numEdges; i++) {
				// TODO: do this in one draw call.
				const edge = edges[i];
				if (edge === BOUNDARY_LEFT) {
					gl.drawArrays(gl.LINES, 3, 2);
				}
				if (edge === BOUNDARY_RIGHT) {
					gl.drawArrays(gl.LINES, 1, 2);
				}
				if (edge === BOUNDARY_TOP) {
					gl.drawArrays(gl.LINES, 2, 2);
				}
				if (edge === BOUNDARY_BOTTOM) {
					gl.drawArrays(gl.LINES, 0, 2);
				}
			}
		} else {
			gl.drawArrays(gl.LINE_LOOP, 0, 4);
		}
		this._drawFinish(params);
	}

	/**
	 * Step GPUProgram for all but a 1px strip of pixels along the boundary.
	 * @param params - Step parameters.
	 * @param params.program - GPUProgram to run.
	 * @param params.input - Input GPULayers to GPUProgram.
	 * @param params.output - Output GPULayer, will draw to screen if undefined.
	 * @param params.blendAlpha - Blend mode for draw, defaults to false.
	 * @returns 
	 */
	stepNonBoundary(
		params: {
			program: GPUProgram,
			input?:  (GPULayer | GPULayerState)[] | GPULayer | GPULayerState,
			output?: GPULayer | GPULayer[], // Undefined renders to screen.
			blendAlpha?: boolean,
		},
	) {
		// Check params.
		const validKeys = ['program', 'input', 'output', 'blendAlpha'];
		const requiredKeys = ['program'];
		const keys = Object.keys(params);
		checkValidKeys(keys, validKeys, 'GPUComposer.stepNonBoundary(params)');
		checkRequiredKeys(keys, requiredKeys, 'GPUComposer.stepNonBoundary(params)');

		if (this._iterateOverOutputsIfNeeded(params, 'stepNonBoundary')) return;
		const { gl, _errorState } = this;
		const { program, input, output } = params;

		if (_errorState) return;

		const { width, height } = this._widthHeightForOutput(program.name, output);

		// Do setup - this must come first.
		const glProgram = this._drawSetup(program, DEFAULT_PROGRAM_NAME, {}, false, input, output);

		// Update uniforms and buffers.
		const onePx = [ 1 / width, 1 / height];
		program._setVertexUniform(glProgram, 'u_gpuio_scale', [1 - 2 * onePx[0], 1 - 2 * onePx[1]], FLOAT);
		program._setVertexUniform(glProgram, 'u_gpuio_translation', onePx, FLOAT);
		gl.bindBuffer(gl.ARRAY_BUFFER, this._getQuadPositionsBuffer());
		this._setPositionAttribute(glProgram, program.name);
		
		// Draw.
		this._setBlendMode(params.blendAlpha);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
		this._drawFinish(params);
	}

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
	stepCircle(
		params: {
			program: GPUProgram,
			position: number[], // Position is in units of pixels.
			diameter: number, // Diameter is in units of pixels.
			useOutputScale?: boolean,
			input?:  (GPULayer | GPULayerState)[] | GPULayer | GPULayerState,
			output?: GPULayer | GPULayer[], // Undefined renders to screen.
			numSegments?: number,
			blendAlpha?: boolean,
		},
	) {
		// Check params.
		const validKeys = ['program', 'position', 'diameter', 'useOutputScale', 'input', 'output', 'numSegments', 'blendAlpha'];
		const requiredKeys = ['program', 'position', 'diameter'];
		const keys = Object.keys(params);
		checkValidKeys(keys, validKeys, 'GPUComposer.stepCircle(params)');
		checkRequiredKeys(keys, requiredKeys, 'GPUComposer.stepCircle(params)');

		if (this._iterateOverOutputsIfNeeded(params, 'stepCircle')) return;
		const { gl, _errorState } = this;
		const { program, position, diameter, input, output } = params;

		if (_errorState) return;

		let width = this._width;
		let height = this._height;
		if (params.useOutputScale) {
			({ width, height } = this._widthHeightForOutput(program.name, output));
		}

		// Do setup - this must come first.
		const glProgram = this._drawSetup(program, DEFAULT_PROGRAM_NAME, {}, false, input, output);

		// Update uniforms and buffers.
		program._setVertexUniform(glProgram, 'u_gpuio_scale', [diameter / width, diameter / height], FLOAT);
		program._setVertexUniform(glProgram, 'u_gpuio_translation', [2 * position[0] / width - 1, 2 * position[1] / height - 1], FLOAT);
		const numSegments = params.numSegments ? params.numSegments : DEFAULT_CIRCLE_NUM_SEGMENTS;
		if (numSegments < 3) {
			throw new Error(`numSegments for GPUComposer.stepCircle must be greater than 2, got ${numSegments}.`);
		}
		gl.bindBuffer(gl.ARRAY_BUFFER, this._getCirclePositionsBuffer(numSegments));
		this._setPositionAttribute(glProgram, program.name);
		
		// Draw.
		this._setBlendMode(params.blendAlpha);
		gl.drawArrays(gl.TRIANGLE_FAN, 0, numSegments + 2);	
		this._drawFinish(params);
	}

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
	stepSegment(
		params: {
			program: GPUProgram,
			position1: number[], 
			position2: number[],
			thickness: number,
			useOutputScale?: boolean,
			input?:  (GPULayer | GPULayerState)[] | GPULayer | GPULayerState,
			output?: GPULayer | GPULayer[],
			endCaps?: boolean,
			numCapSegments?: number,
			blendAlpha?: boolean,
		},
	) {
		// Check params.
		const validKeys = ['program', 'position1', 'position2', 'thickness', 'useOutputScale', 'input', 'output', 'endCaps', 'numCapSegments', 'blendAlpha'];
		const requiredKeys = ['program', 'position1', 'position2', 'thickness'];
		const keys = Object.keys(params);
		checkValidKeys(keys, validKeys, 'GPUComposer.stepSegment(params)');
		checkRequiredKeys(keys, requiredKeys, 'GPUComposer.stepSegment(params)');

		if (this._iterateOverOutputsIfNeeded(params, 'stepSegment')) return;
		const { gl, _errorState } = this;
		const { program, position1, position2, thickness, input, output } = params;

		if (_errorState) return;

		let width = this._width;
		let height = this._height;
		if (params.useOutputScale) {
			({ width, height } = this._widthHeightForOutput(program.name, output));
		}

		// Do setup - this must come first.
		const glProgram = this._drawSetup(program, SEGMENT_PROGRAM_NAME, {}, false, input, output);

		// Update uniforms and buffers.
		program._setVertexUniform(glProgram, 'u_gpuio_halfThickness', thickness / 2, FLOAT);
		program._setVertexUniform(glProgram, 'u_gpuio_scale', [2 / width, 2 / height], FLOAT);
		const diffX = position1[0] - position2[0];
		const diffY = position1[1] - position2[1];
		const angle = Math.atan2(diffY, diffX);
		program._setVertexUniform(glProgram, 'u_gpuio_rotation', angle, FLOAT);
		const centerX = (position1[0] + position2[0]) / 2;
		const centerY = (position1[1] + position2[1]) / 2;
		program._setVertexUniform(glProgram, 'u_gpuio_translation', [2 * centerX / width - 1, 2 * centerY / height - 1], FLOAT);
		const length = Math.sqrt(diffX * diffX + diffY * diffY);
		
		const numSegments = params.numCapSegments ? params.numCapSegments * 2 : DEFAULT_CIRCLE_NUM_SEGMENTS;
		if (params.endCaps) {
			if (numSegments < 6 || numSegments % 6 !== 0) {
				throw new Error(`numCapSegments for GPUComposer.stepSegment must be divisible by 3, got ${numSegments / 2}.`);
			}
			program._setVertexUniform(glProgram, 'u_gpuio_length', length, FLOAT);
			gl.bindBuffer(gl.ARRAY_BUFFER, this._getCirclePositionsBuffer(numSegments));
		} else {
			// u_gpuio_length + thickness = length, bc we are stretching a square of size thickness into a rectangle.
			program._setVertexUniform(glProgram, 'u_gpuio_length', length - thickness, FLOAT);
			// Use a rectangle in case of no caps.
			gl.bindBuffer(gl.ARRAY_BUFFER, this._getQuadPositionsBuffer());
		}
		this._setPositionAttribute(glProgram, program.name);
		
		// Draw.
		this._setBlendMode(params.blendAlpha);
		if (params.endCaps) {
			gl.drawArrays(gl.TRIANGLE_FAN, 0, numSegments + 2);
		} else {
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
		}
		this._drawFinish(params);
	}

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
	 stepRect(
		params: {
			program: GPUProgram,
			position: number[],
			size: number[],
			useOutputScale?: boolean,
			input?:  (GPULayer | GPULayerState)[] | GPULayer | GPULayerState,
			output?: GPULayer | GPULayer[],
			blendAlpha?: boolean,
		},
	) {
		// Check params.
		const validKeys = ['program', 'position', 'size', 'useOutputScale', 'input', 'output', 'blendAlpha'];
		const requiredKeys = ['program', 'position', 'size'];
		const keys = Object.keys(params);
		checkValidKeys(keys, validKeys, 'GPUComposer.stepRect(params)');
		checkRequiredKeys(keys, requiredKeys, 'GPUComposer.stepRect(params)');

		if (this._iterateOverOutputsIfNeeded(params, 'stepRect')) return;
		const position1 = [params.position[0], params.position[1] + params.size[1] / 2];
		const position2 = [params.position[0] + params.size[0], position1[1]];
		this.stepSegment({
			program: params.program,
			position1,
			position2,
			thickness: params.size[1],
			useOutputScale: params.useOutputScale,
			input: params.input,
			output: params.output,
			endCaps: false,
			blendAlpha: params.blendAlpha,
		});
	}

	// stepPolyline(
	// 	params: {
	// 		program: GPUProgram,
	// 		positions: number[][],
	// 		thickness: number, // Thickness of line is in units of pixels.
	// 		input?: (GPULayer | GPULayerState)[] | GPULayer | GPULayerState,
	// 		output?: GPULayer | GPULayer[], // Undefined renders to screen.
	// 		closeLoop?: boolean,
	// 		includeUVs?: boolean,
	// 		includeNormals?: boolean,
	// 		blendAlpha?: boolean,
	// 	},
	// ) {

	// // Check params.
	// const validKeys = ['program', 'positions', 'thickness', 'input', 'output', 'closeLoop', 'includeUVs', 'includeNormals', 'blendAlpha'];
	// const requiredKeys = ['program', 'positions', 'thickness'];
	// const keys = Object.keys(params);
	// checkValidKeys(keys, validKeys, 'GPUComposer.stepPolyline(params)');
	// checkRequiredKeys(keys, requiredKeys, 'GPUComposer.stepPolyline(params)');

	// 	if (this._iterateOverOutputsIfNeeded(params, 'stepPolyline')) return;
	// 	const { gl, _width, _height, _errorState } = this;
	// 	const { program, input, output } = params;

	// 	if (_errorState) return;

	// 	const vertices = params.positions;
	// 	const closeLoop = !!params.closeLoop;
		
	// 	// Offset vertices.
	// 	const halfThickness = params.thickness / 2;
	// 	const numPositions = closeLoop ? vertices.length * 4 + 2 : (vertices.length - 1) * 4;
	// 	const positions = new Float32Array(2 * numPositions);
	// 	const uvs = params.includeUVs ? new Float32Array(2 * numPositions) : undefined;
	// 	const normals = params.includeNormals ? new Float32Array(2 * numPositions) : undefined;

	// 	// tmp arrays.
	// 	const s1 = [0, 0];
	// 	const s2 = [0, 0];
	// 	const n1 = [0, 0];
	// 	const n2 = [0, 0];
	// 	const n3 = [0, 0];
	// 	for (let i = 0; i < vertices.length; i++) {
	// 		if (!closeLoop && i === vertices.length - 1) continue;
	// 		// Vertices on this segment.
	// 		const v1 = vertices[i];
	// 		const v2 = vertices[(i + 1) % vertices.length];
	// 		s1[0] = v2[0] - v1[0];
	// 		s1[1] = v2[1] - v1[1];
	// 		const length1 = Math.sqrt(s1[0] * s1[0] + s1[1] * s1[1]);
	// 		n1[0] = s1[1] / length1;
	// 		n1[1] = - s1[0] / length1;

	// 		const index = i * 4 + 2;

	// 		if (!closeLoop && i === 0) {
	// 			// Add starting points to positions array.
	// 			positions[0] = v1[0] + n1[0] * halfThickness;
	// 			positions[1] = v1[1] + n1[1] * halfThickness;
	// 			positions[2] = v1[0] - n1[0] * halfThickness;
	// 			positions[3] = v1[1] - n1[1] * halfThickness;
	// 			if (uvs) {
	// 				uvs[0] = 0;
	// 				uvs[1] = 1;
	// 				uvs[2] = 0;
	// 				uvs[3] = 0;
	// 			}
	// 			if (normals) {
	// 				normals[0] = n1[0];
	// 				normals[1] = n1[1];
	// 				normals[2] = n1[0];
	// 				normals[3] = n1[1];
	// 			}
	// 		}

	// 		const u = (i + 1) / (vertices.length - 1);

	// 		// Offset from v2.
	// 		positions[2 * index] = v2[0] + n1[0] * halfThickness;
	// 		positions[2 * index + 1] = v2[1] + n1[1] * halfThickness;
	// 		positions[2 * index + 2] = v2[0] - n1[0] * halfThickness;
	// 		positions[2 * index + 3] = v2[1] - n1[1] * halfThickness;
	// 		if (uvs) {
	// 			uvs[2 * index] = u;
	// 			uvs[2 * index + 1] = 1;
	// 			uvs[2 * index + 2] = u;
	// 			uvs[2 * index + 3] = 0;
	// 		}
	// 		if (normals) {
	// 			normals[2 * index] = n1[0];
	// 			normals[2 * index + 1] = n1[1];
	// 			normals[2 * index + 2] = n1[0];
	// 			normals[2 * index + 3] = n1[1];
	// 		}

	// 		if ((i < vertices.length - 2) || closeLoop) {
	// 			// Vertices on next segment.
	// 			const v3 = vertices[(i + 1) % vertices.length];
	// 			const v4 = vertices[(i + 2) % vertices.length];
	// 			s2[0] = v4[0] - v3[0];
	// 			s2[1] = v4[1] - v3[1];
	// 			const length2 = Math.sqrt(s2[0] * s2[0] + s2[1] * s2[1]);
	// 			n2[0] = s2[1] / length2;
	// 			n2[1] = - s2[0] / length2;

	// 			// Offset from v3
	// 			positions[2 * ((index + 2) % (4 * vertices.length))] = v3[0] + n2[0] * halfThickness;
	// 			positions[2 * ((index + 2) % (4 * vertices.length)) + 1] = v3[1] + n2[1] * halfThickness;
	// 			positions[2 * ((index + 2) % (4 * vertices.length)) + 2] = v3[0] - n2[0] * halfThickness;
	// 			positions[2 * ((index + 2) % (4 * vertices.length)) + 3] = v3[1] - n2[1] * halfThickness;
	// 			if (uvs) {
	// 				uvs[2 * ((index + 2) % (4 * vertices.length))] = u;
	// 				uvs[2 * ((index + 2) % (4 * vertices.length)) + 1] = 1;
	// 				uvs[2 * ((index + 2) % (4 * vertices.length)) + 2] = u;
	// 				uvs[2 * ((index + 2) % (4 * vertices.length)) + 3] = 0;
	// 			}
	// 			if (normals) {
	// 				normals[2 * ((index + 2) % (4 * vertices.length))] = n2[0];
	// 				normals[2 * ((index + 2) % (4 * vertices.length)) + 1] = n2[1];
	// 				normals[2 * ((index + 2) % (4 * vertices.length)) + 2] = n2[0];
	// 				normals[2 * ((index + 2) % (4 * vertices.length)) + 3] = n2[1];
	// 			}

	// 			// Check the angle between adjacent segments.
	// 			const cross = n1[0] * n2[1] - n1[1] * n2[0];
	// 			if (Math.abs(cross) < 1e-6) continue;
	// 			n3[0] = n1[0] + n2[0];
	// 			n3[1] = n1[1] + n2[1];
	// 			const length3 = Math.sqrt(n3[0] * n3[0] + n3[1] * n3[1]);
	// 			n3[0] /= length3;
	// 			n3[1] /= length3;
	// 			// Make adjustments to positions.
	// 			const angle = Math.acos(n1[0] * n2[0] + n1[1] * n2[1]);
	// 			const offset = halfThickness / Math.cos(angle / 2);
	// 			if (cross < 0) {
	// 				positions[2 * index] = v2[0] + n3[0] * offset;
	// 				positions[2 * index + 1] = v2[1] + n3[1] * offset;
	// 				positions[2 * ((index + 2) % (4 * vertices.length))] = positions[2 * index];
	// 				positions[2 * ((index + 2) % (4 * vertices.length)) + 1] = positions[2 * index + 1];
	// 			} else {
	// 				positions[2 * index + 2] = v2[0] - n3[0] * offset;
	// 				positions[2 * index + 3] = v2[1] - n3[1] * offset;
	// 				positions[2 * ((index + 2) % (4 * vertices.length)) + 2] = positions[2 * index + 2];
	// 				positions[2 * ((index + 2) % (4 * vertices.length)) + 3] = positions[2 * index + 3];
	// 			}
	// 		}
	// 	}
	// 	if (closeLoop) {
	// 		// Duplicate starting points to end of positions array.
	// 		positions[vertices.length * 8] = positions[0];
	// 		positions[vertices.length * 8 + 1] = positions[1];
	// 		positions[vertices.length * 8 + 2] = positions[2];
	// 		positions[vertices.length * 8 + 3] = positions[3];
	// 		if (uvs) {
	// 			uvs[vertices.length * 8] = uvs[0];
	// 			uvs[vertices.length * 8 + 1] = uvs[1];
	// 			uvs[vertices.length * 8 + 2] = uvs[2];
	// 			uvs[vertices.length * 8 + 3] = uvs[3];
	// 		}
	// 		if (normals) {
	// 			normals[vertices.length * 8] = normals[0];
	// 			normals[vertices.length * 8 + 1] = normals[1];
	// 			normals[vertices.length * 8 + 2] = normals[2];
	// 			normals[vertices.length * 8 + 3] = normals[3];
	// 		}
	// 	}

	// 	const vertexShaderOptions: CompileTimeConstants = {};
	// 	if (uvs) vertexShaderOptions[GPUIO_VS_UV_ATTRIBUTE] = '1';
	// 	if (normals) vertexShaderOptions[GPUIO_VS_NORMAL_ATTRIBUTE] = '1';

	// 	// Do setup - this must come first.
	// 	const glProgram = this._drawSetup(program, DEFAULT_PROGRAM_NAME, vertexShaderOptions, false, input, output);

	// 	// Update uniforms and buffers.
	// 	program._setVertexUniform(glProgram, 'u_gpuio_scale', [2 / _width, 2 / _height], FLOAT);
	// 	program._setVertexUniform(glProgram, 'u_gpuio_translation', [-1, -1], FLOAT);
	// 	// Init positions buffer.
	// 	gl.bindBuffer(gl.ARRAY_BUFFER, this._initVertexBuffer(positions)!);
	// 	this._setPositionAttribute(glProgram, program.name);
	// 	if (uvs) {
	// 		// Init uv buffer.
	// 		gl.bindBuffer(gl.ARRAY_BUFFER, this._initVertexBuffer(uvs)!);
	// 		this._setUVAttribute(glProgram, program.name);
	// 	}
	// 	if (normals) {
	// 		// Init normals buffer.
	// 		gl.bindBuffer(gl.ARRAY_BUFFER, this._initVertexBuffer(normals)!);
	// 		this._setVertexAttribute(glProgram, 'a_gpuio_normal', 2, program.name);
	// 	}

	// 	// Draw.
	// 	this._setBlendMode(params.blendAlpha);
	// 	gl.drawArrays(gl.TRIANGLE_STRIP, 0, numPositions);
	// 	this._drawFinish();
	// }

	// stepTriangleStrip(
	// 	params: {
	// 		program: GPUProgram,
	// 		positions: Float32Array,
	// 		normals?: Float32Array,
	// 		uvs?: Float32Array,
	// 		input?: (GPULayer | GPULayerState)[] | GPULayer | GPULayerState,
	// 		output?: GPULayer | GPULayer[], // Undefined renders to screen.
	// 		count?: number,
	// 		blendAlpha?: boolean,
	// 	},
	// ) {
	// 	if (this._iterateOverOutputsIfNeeded(params, 'stepTriangleStrip')) return;
	// 	const { gl, _width, _height, _errorState } = this;
	// 	const { program, input, output, positions, uvs, normals } = params;

	// 	if (_errorState) return;

	// 	const vertexShaderOptions: CompileTimeConstants = {};
	// 	if (uvs) vertexShaderOptions[GPUIO_VS_UV_ATTRIBUTE] = '1';
	// 	if (normals) vertexShaderOptions[GPUIO_VS_NORMAL_ATTRIBUTE] = '1';

	// 	// Do setup - this must come first.
	// 	const glProgram = this._drawSetup(program, DEFAULT_PROGRAM_NAME, vertexShaderOptions, false, input, output);

	// 	// Update uniforms and buffers.
	// 	program._setVertexUniform(glProgram, 'u_gpuio_scale', [2 / _width, 2 / _height], FLOAT);
	// 	program._setVertexUniform(glProgram, 'u_gpuio_translation', [-1, -1], FLOAT);
	// 	// Init positions buffer.
	// 	gl.bindBuffer(gl.ARRAY_BUFFER, this._initVertexBuffer(positions)!);
	// 	this._setPositionAttribute(glProgram, program.name);
	// 	if (uvs) {
	// 		// Init uv buffer.
	// 		gl.bindBuffer(gl.ARRAY_BUFFER, this._initVertexBuffer(uvs)!);
	// 		this._setUVAttribute(glProgram, program.name);
	// 	}
	// 	if (normals) {
	// 		// Init normals buffer.
	// 		gl.bindBuffer(gl.ARRAY_BUFFER, this._initVertexBuffer(normals)!);
	// 		this._setVertexAttribute(glProgram, 'a_gpuio_normal', 2, program.name);
	// 	}

	// 	const count = params.count ? params.count : positions.length / 2;

	// 	// Draw.
	// 	this._setBlendMode(params.blendAlpha);
	// 	gl.drawArrays(gl.TRIANGLE_STRIP, 0, count);
	// 	this._drawFinish();
	// }

	// stepLines(params: {
	// 	program: GPUProgram,
	// 	positions: Float32Array,
	// 	indices?: Uint16Array | Uint32Array | Int16Array | Int32Array,
	// 	normals?: Float32Array,
	// 	uvs?: Float32Array,
	// 	input?: (GPULayer | GPULayerState)[] | GPULayer | GPULayerState,
	// 	output?: GPULayer | GPULayer[], // Undefined renders to screen.
	// 	count?: number,
	// 	closeLoop?: boolean,
	// 	blendAlpha?: boolean,
	// }) {
	// 	const { gl, _width, _height, _errorState } = this;
	// 	const { indices, uvs, normals, input, output, program } = params;

	// 	if (_errorState) return;

	// 	// Check that params are valid.
	// 	if (params.closeLoop && indices) {
	// 		throw new Error(`GPUComposer.stepLines() can't be called with closeLoop == true and indices.`);
	// 	}

	// 	const vertexShaderOptions: CompileTimeConstants = {};
	// 	if (uvs) vertexShaderOptions[GPUIO_VS_UV_ATTRIBUTE] = '1';
	// 	if (normals) vertexShaderOptions[GPUIO_VS_NORMAL_ATTRIBUTE] = '1';

	// 	// Do setup - this must come first.
	// 	const glProgram = this._drawSetup(program, DEFAULT_PROGRAM_NAME, vertexShaderOptions, false, input, output);

	// 	const count = params.count ? params.count : (indices ? indices.length : (params.positions.length / 2));

	// 	// Update uniforms and buffers.
	// 	program._setVertexUniform(glProgram, 'u_gpuio_scale', [2 / _width, 2 / _height], FLOAT);
	// 	program._setVertexUniform(glProgram, 'u_gpuio_translation', [-1, -1], FLOAT);
	// 	if (indices) {
	// 		// Reorder positions array to match indices.
	// 		const positions = new Float32Array(2 * count);
	// 		for (let i = 0; i < count; i++) {
	// 			const index = indices[i];
	// 			positions[2 * i] = params.positions[2 * index];
	// 			positions[2 * i + 1] = params.positions[2 * index + 1];
	// 		}
	// 		gl.bindBuffer(gl.ARRAY_BUFFER, this._initVertexBuffer(positions)!);
	// 	} else {
	// 		gl.bindBuffer(gl.ARRAY_BUFFER, this._initVertexBuffer(params.positions)!);
	// 	}
	// 	this._setPositionAttribute(glProgram, program.name);
	// 	if (uvs) {
	// 		// Init uv buffer.
	// 		gl.bindBuffer(gl.ARRAY_BUFFER, this._initVertexBuffer(uvs)!);
	// 		this._setUVAttribute(glProgram, program.name);
	// 	}
	// 	if (normals) {
	// 		// Init normals buffer.
	// 		gl.bindBuffer(gl.ARRAY_BUFFER, this._initVertexBuffer(normals)!);
	// 		this._setVertexAttribute(glProgram, 'a_gpuio_normal', 2, program.name);
	// 	}

	// 	// Draw.
	// 	this._setBlendMode(params.blendAlpha);
	// 	if (params.indices) {
	// 		gl.drawArrays(gl.LINES, 0, count);
	// 	} else {
	// 		if (params.closeLoop) {
	// 			gl.drawArrays(gl.LINE_LOOP, 0, count);
	// 		} else {
	// 			gl.drawArrays(gl.LINE_STRIP, 0, count);
	// 		}
	// 	}
	// 	this._drawFinish(params);
	// }

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
	drawLayerAsPoints(
		params: {
			layer: GPULayer, // Positions in units of pixels.
			program?: GPUProgram,
			input?: (GPULayer | GPULayerState)[] | GPULayer | GPULayerState,
			output?: GPULayer | GPULayer[],
			pointSize?: number,
			useOutputScale?: boolean,
			count?: number,
			color?: number[],
			wrapX?: boolean,
			wrapY?: boolean,
			blendAlpha?: boolean,
		},
	) {
		const validKeys = ['layer', 'program', 'input', 'output', 'pointSize', 'useOutputScale', 'count', 'color', 'wrapX', 'wrapY', 'blendAlpha'];
		const requiredKeys = ['layer'];
		const keys = Object.keys(params);
		checkValidKeys(keys, validKeys, 'GPUComposer.drawLayerAsPoints(params)');
		checkRequiredKeys(keys, requiredKeys, 'GPUComposer.drawLayerAsPoints(params)');

		if (this._iterateOverOutputsIfNeeded(params, 'drawLayerAsPoints')) return;
		const { gl, _pointIndexArray, glslVersion, _errorState } = this;
		const { layer, output } = params;

		if (_errorState) return;

		// Check that numPoints is valid.
		if (layer.numComponents !== 2 && layer.numComponents !== 4) {
			throw new Error(`GPUComposer.drawLayerAsPoints() must be passed a layer parameter with either 2 or 4 components, got layer "${layer.name}" with ${layer.numComponents} components.`);
		}
		const { length } = layer;
		const count = params.count || length;
		if (count > length) {
			throw new Error(`Invalid count ${count} for layer parameter of length ${length}.`);
		}
		if (glslVersion === GLSL1 && count > MAX_FLOAT_INT) {
			console.warn(`Points positions array length: ${count} is longer than what is supported by GLSL1 : ${MAX_FLOAT_INT}.`);
		}

		let program = params.program;
		if (program === undefined) {
			program = this._setValueProgramForType(FLOAT);
			const color = params.color || [1, 0, 0]; // Default of red.
			if (color.length !== 3) throw new Error(`Color parameter must have length 3, got ${JSON.stringify(color)}.`);
			program.setUniform('u_value', [...color, 1], FLOAT);
		}

		// Add positions to end of input if needed.
		const input = this._addLayerToInputs(layer, params.input);

		const vertexShaderOptions: CompileTimeConstants = {};
		// Tell whether we are using an absolute position (2 components),
		// or position with accumulation buffer (4 components, better floating pt accuracy).
		if (layer.numComponents === 4) vertexShaderOptions[GPUIO_VS_POSITION_W_ACCUM] = '1';
		if (params.wrapX) vertexShaderOptions[GPUIO_VS_WRAP_X] = '1';
		if (params.wrapY) vertexShaderOptions[GPUIO_VS_WRAP_Y] = '1';

		// Do setup - this must come first.
		const glProgram = this._drawSetup(program, LAYER_POINTS_PROGRAM_NAME, vertexShaderOptions, false, input, output);

		// Update uniforms and buffers.
		program._setVertexUniform(glProgram, 'u_gpuio_positions', indexOfLayerInArray(layer, input), INT);
		let width = this._width;
		let height = this._height;
		if (params.useOutputScale) {
			({ width, height } = this._widthHeightForOutput(program.name, output));
		}
		program._setVertexUniform(glProgram, 'u_gpuio_scale', [1 / width, 1 / height], FLOAT);
		// Set default pointSize.
		const pointSize = params.pointSize || 1;
		program._setVertexUniform(glProgram, 'u_gpuio_pointSize', pointSize, FLOAT);
		const positionLayerDimensions = [layer.width, layer.height];
		program._setVertexUniform(glProgram, 'u_gpuio_positionsDimensions', positionLayerDimensions, FLOAT);
		// We get this for free in GLSL3 with gl_VertexID.
		if (glslVersion === GLSL1) {
			if (this._pointIndexBuffer === undefined || (_pointIndexArray && _pointIndexArray.length < count)) {
				// Have to use float32 array bc int is not supported as a vertex attribute type.
				const indices = initSequentialFloatArray(length);
				this._pointIndexArray = indices;
				this._pointIndexBuffer = this._initVertexBuffer(indices);
			}
			gl.bindBuffer(gl.ARRAY_BUFFER, this._pointIndexBuffer!);
			this._setIndexAttribute(glProgram, program.name);
		}

		// Draw.
		this._setBlendMode(params.blendAlpha);
		gl.drawArrays(gl.POINTS, 0, count);
		this._drawFinish(params);
	}

	// drawLayerAsLines(
	// 	params: {
	// 		positions: GPULayer,
	// 		indices?: Float32Array | Uint16Array | Uint32Array | Int16Array | Int32Array,
	// 		program?: GPUProgram,
	// 		input?: (GPULayer | GPULayerState)[] | GPULayer | GPULayerState,
	// 		output?: GPULayer | GPULayer[],
	// 		count?: number,
	// 		color?: number[]
	// 		wrapX?: boolean,
	// 		wrapY?: boolean,
	// 		closeLoop?: boolean,
	// 		blendAlpha?: boolean,
	// 	},
	// ) {
	// const validKeys = ['positions', 'indices', 'program', 'input', 'output', 'count', 'color', 'wrapX', 'wrapY', 'closeLoop', 'blendAlpha'];
	// const requiredKeys = ['positions'];
	// const keys = Object.keys(params);
	// checkValidKeys(keys, validKeys, 'GPUComposer.drawLayerAsLines(params)');
	// checkRequiredKeys(keys, requiredKeys, 'GPUComposer.drawLayerAsLines(params)');
	// 	if (this._iterateOverOutputsIfNeeded(params, 'drawLayerAsLines')) return;
	// 	const { gl, _width, _height, glslVersion, _errorState } = this;
	// 	const { positions, output } = params;

	// 	if (_errorState) return;

	// 	// Check that positions is valid.
	// 	if (positions.numComponents !== 2 && positions.numComponents !== 4) {
	// 		throw new Error(`GPUComposer.drawLayerAsLines() must be passed a position GPULayer with either 2 or 4 components, got position GPULayer "${positions.name}" with ${positions.numComponents} components.`)
	// 	}
	// 	// Check that params are valid.
	// 	if (params.closeLoop && params.indices) {
	// 		throw new Error(`GPUComposer.drawLayerAsLines() can't be called with closeLoop == true and indices.`);
	// 	}

	// 	let program = params.program;
	// 	if (program === undefined) {
	// 		program = params.wrapX || params.wrapY ? this._getWrappedLineColorProgram() : this._setValueProgramForType(FLOAT);;
	// 		const color = params.color || [1, 0, 0]; // Default to red.
	//		if (color.length !== 3) throw new Error(`color parameter must have length 3, got ${JSON.stringify(color)}.`);
	// 		program.setUniform('u_value', [...color, 1], FLOAT);
	// 	}

	// 	// Add positionLayer to end of input if needed.
	// 	const input = this._addLayerToInputs(positions, params.input);

	// 	const vertexShaderOptions: CompileTimeConstants = {};
	// 	// Tell whether we are using an absolute position (2 components),
	// 	// or position with accumulation buffer (4 components, better floating pt accuracy).
	// 	if (positions.numComponents === 4) vertexShaderOptions[GPUIO_VS_POSITION_W_ACCUM] = '1';
	// 	if (params.wrapX) vertexShaderOptions[GPUIO_VS_WRAP_X] = '1';
	// 	if (params.wrapY) vertexShaderOptions[GPUIO_VS_WRAP_Y] = '1';
	// 	vertexShaderOptions[GPUIO_VS_INDEXED_POSITIONS] = params.indices ? '1': '0';

	// 	// Do setup - this must come first.
	// 	const glProgram = this._drawSetup(program, LAYER_LINES_PROGRAM_NAME, vertexShaderOptions, false, input, output);

	// 	const count = params.count ? params.count : (params.indices ? params.indices.length : positions.length);

	// 	// Update uniforms and buffers.
	// 	program._setVertexUniform(glProgram, 'u_gpuio_positions', indexOfLayerInArray(positions, input), INT);
	// 	program._setVertexUniform(glProgram, 'u_gpuio_scale', [1 / _width, 1 / _height], FLOAT);
	// 	const positionLayerDimensions = [positions.width, positions.height];
	// 	program._setVertexUniform(glProgram, 'u_gpuio_positionsDimensions', positionLayerDimensions, FLOAT);
	// 	// Only pass in indices if we are using indexed pts or GLSL1, otherwise we get this for free from gl_VertexID.
	// 	if (params.indices || glslVersion === GLSL1) {
	// 		// TODO: cache indexArray if no indices passed in.
	// 		const indices = params.indices ? params.indices : initSequentialFloatArray(count);
	// 		if (this._indexedLinesIndexBuffer === undefined) {
	// 			// Have to use float32 array bc int is not supported as a vertex attribute type.
	// 			let floatArray: Float32Array;
	// 			if (indices.constructor !== Float32Array) {
	// 				// Have to use float32 array bc int is not supported as a vertex attribute type.
	// 				floatArray = new Float32Array(indices.length);
	// 				for (let i = 0; i < count; i++) {
	// 					floatArray[i] = indices[i];
	// 				}
	// 				console.warn(`Converting indices array of type ${indices.constructor} to Float32Array in GPUComposer.drawIndexedLines for WebGL compatibility, you may want to use a Float32Array to store this information so the conversion is not required.`);
	// 			} else {
	// 				floatArray = indices as Float32Array;
	// 			}
	// 			this._indexedLinesIndexBuffer = this._initVertexBuffer(floatArray);
	// 		} else {
	// 			gl.bindBuffer(gl.ARRAY_BUFFER, this._indexedLinesIndexBuffer!);
	// 			// Copy buffer data.
	// 			gl.bufferData(gl.ARRAY_BUFFER, indices, gl.STATIC_DRAW);
	// 		}
	// 		this._setIndexAttribute(glProgram, program.name);
	// 	}

	// 	// Draw.
	// 	this._setBlendMode(params.blendAlpha);
	// 	if (params.indices) {
	// 		gl.drawArrays(gl.LINES, 0, count);
	// 	} else {
	// 		if (params.closeLoop) {
	// 			gl.drawArrays(gl.LINE_LOOP, 0, count);
	// 		} else {
	// 			gl.drawArrays(gl.LINE_STRIP, 0, count);
	// 		}
	// 	}
	// 	this._drawFinish(params);
	// }

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
	drawLayerAsVectorField(
		params: {
			layer: GPULayer,
			program?: GPUProgram,
			input?: (GPULayer | GPULayerState)[] | GPULayer | GPULayerState,
			output?: GPULayer | GPULayer[],
			vectorSpacing?: number,
			vectorScale?: number,
			color?: number[],
			blendAlpha?: boolean,
		},
	) {
		const validKeys = ['layer', 'program', 'input', 'output', 'vectorSpacing', 'vectorScale', 'color', 'blendAlpha'];
		const requiredKeys = ['layer'];
		const keys = Object.keys(params);
		checkValidKeys(keys, validKeys, 'GPUComposer.drawLayerAsVectorField(params)');
		checkRequiredKeys(keys, requiredKeys, 'GPUComposer.drawLayerAsVectorField(params)');

		if (this._iterateOverOutputsIfNeeded(params, 'drawLayerAsVectorField')) return;
		const { gl, _vectorFieldIndexArray, _width, _height, glslVersion, _errorState } = this;
		const { layer, output } = params;

		if (_errorState) return;

		// Check that field is valid.
		if (layer.numComponents !== 2) {
			throw new Error(`GPUComposer.drawLayerAsVectorField() must be passed a fieldLayer with 2 components, got fieldLayer "${layer.name}" with ${layer.numComponents} components.`);
		}
		// Check aspect ratio.
		// const dimensions = [vectorLayer.width, vectorLayer.height];
		// if (Math.abs(dimensions[0] / dimensions[1] - width / height) > 0.01) {
		// 	throw new Error(`Invalid aspect ratio ${(dimensions[0] / dimensions[1]).toFixed(3)} vector GPULayer with dimensions [${dimensions[0]}, ${dimensions[1]}], expected ${(width / height).toFixed(3)}.`);
		// }

		let program = params.program;
		if (program === undefined) {
			program = this._setValueProgramForType(FLOAT);;
			const color = params.color || [1, 0, 0]; // Default to red.
			if (color.length !== 3) throw new Error(`color parameter must have length 3, got ${JSON.stringify(color)}.`);
			program.setUniform('u_value', [...color, 1], FLOAT);
		}

		// Add data to end of input if needed.
		const input = this._addLayerToInputs(layer, params.input);

		// Do setup - this must come first.
		const glProgram = this._drawSetup(program, LAYER_VECTOR_FIELD_PROGRAM_NAME, {}, false, input, output);

		// Update uniforms and buffers.
		program._setVertexUniform(glProgram, 'u_gpuio_vectors', indexOfLayerInArray(layer, input), INT);
		// Set default scale.
		const vectorScale = params.vectorScale || 1;
		program._setVertexUniform(glProgram, 'u_gpuio_scale', [vectorScale / _width, vectorScale / _height], FLOAT);
		const vectorSpacing = params.vectorSpacing || 10;
		const spacedDimensions = [Math.floor(_width / vectorSpacing), Math.floor(_height / vectorSpacing)];
		program._setVertexUniform(glProgram, 'u_gpuio_dimensions', spacedDimensions, FLOAT);
		const length = 2 * spacedDimensions[0] * spacedDimensions[1];
		// We get this for free in GLSL3 with gl_VertexID.
		if (glslVersion === GLSL1) {
			if (this._vectorFieldIndexBuffer === undefined || (_vectorFieldIndexArray && _vectorFieldIndexArray.length < length)) {
				// Have to use float32 array bc int is not supported as a vertex attribute type.
				const indices = initSequentialFloatArray(length);
				this._vectorFieldIndexArray = indices;
				this._vectorFieldIndexBuffer = this._initVertexBuffer(indices);
			}
			gl.bindBuffer(gl.ARRAY_BUFFER, this._vectorFieldIndexBuffer!);
			this._setIndexAttribute(glProgram, program.name);
		}

		// Draw.
		this._setBlendMode(params.blendAlpha);
		gl.drawArrays(gl.LINES, 0, length);
		this._drawFinish(params);
	}

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
	 drawLayerAsMesh(
		params: {
			layer: GPULayer,
			indices?: GPUIndexBuffer,
			program?: GPUProgram,
			input?: (GPULayer | GPULayerState)[] | GPULayer | GPULayerState,
			output?: GPULayer | GPULayer[],
			useOutputScale?: boolean,
			color?: number[],
			blendAlpha?: boolean,
		},
	) {
		const validKeys = ['layer', 'indices', 'program', 'input', 'output', 'useOutputScale', 'color', 'blendAlpha'];
		const requiredKeys = ['layer'];
		const keys = Object.keys(params);
		checkValidKeys(keys, validKeys, 'GPUComposer.drawLayerAsMesh(params)');
		checkRequiredKeys(keys, requiredKeys, 'GPUComposer.drawLayerAsMesh(params)');

		if (this._iterateOverOutputsIfNeeded(params, 'drawLayerAsMesh')) return;
		const { gl, _width, _height, glslVersion, _errorState, _meshIndexBuffer, _meshIndexArray } = this;
		const { layer, output } = params;

		if (_errorState) return;

		// Check that layer is valid.
		if (layer.numComponents !== 2 && layer.numComponents !== 4) {
			throw new Error(`GPUComposer.drawLayerAsMesh() must be passed a layer parameter with either 2 or 4 components, got position GPULayer "${layer.name}" with ${layer.numComponents} components.`);
		}

		const positionsCount = layer.is1D() ? layer.length : layer.width * layer.height;
		if (glslVersion === GLSL1 && positionsCount > MAX_FLOAT_INT) {
			console.warn(`Mesh positions array length: ${positionsCount} is longer than what is supported by GLSL1 : ${MAX_FLOAT_INT}.`);
		}

		let program = params.program;
		if (program === undefined) {
			program = this._setValueProgramForType(FLOAT);
			const color = params.color || [1, 0, 0]; // Default of red.
			if (color.length !== 3) throw new Error(`Color parameter must have length 3, got ${JSON.stringify(color)}.`);
			program.setUniform('u_value', [...color, 1], FLOAT);
		}

		// Add positions to end of input if needed.
		const input = this._addLayerToInputs(layer, params.input);

		const vertexShaderOptions: CompileTimeConstants = {};
		// Tell whether we are using an absolute position (2 components),
		// or position with accumulation buffer (4 components, better floating pt accuracy).
		if (layer.numComponents === 4) vertexShaderOptions[GPUIO_VS_POSITION_W_ACCUM] = '1';

		// Do setup - this must come first.
		const glProgram = this._drawSetup(program, LAYER_MESH_PROGRAM_NAME, vertexShaderOptions, false, input, output);

		// Update uniforms and buffers.
		program._setVertexUniform(glProgram, 'u_gpuio_positions', indexOfLayerInArray(layer, input), INT);
		let width = _width;
		let height = _height;
		if (params.useOutputScale) {
			({ width, height } = this._widthHeightForOutput(program.name, output));
		}
		program._setVertexUniform(glProgram, 'u_gpuio_scale', [1 / width, 1 / height], FLOAT);
		const positionLayerDimensions = [layer.width, layer.height];
		program._setVertexUniform(glProgram, 'u_gpuio_positionsDimensions', positionLayerDimensions, FLOAT);
		// We get this for free in GLSL3 with gl_VertexID.
		if (glslVersion === GLSL1) {
			if (_meshIndexBuffer === undefined || (_meshIndexArray && _meshIndexArray.length < positionsCount)) {
				// Have to use float32 array bc int is not supported as a vertex attribute type.
				const indices = initSequentialFloatArray(positionsCount);
				this._meshIndexArray = indices;
				this._meshIndexBuffer = this._initVertexBuffer(indices);
			}
			gl.bindBuffer(gl.ARRAY_BUFFER, this._meshIndexBuffer!);
			this._setIndexAttribute(glProgram, program.name);
		}

		// Draw.
		this._setBlendMode(params.blendAlpha);
		if (params.indices) {
			const { glType, count, buffer } = params.indices;
			// https://webglfundamentals.org/webgl/lessons/webgl-indexed-vertices.html
			// Make index buffer the current ELEMENT_ARRAY_BUFFER.
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
			const offset = 0;
			gl.drawElements(gl.TRIANGLES, count, glType, offset);
		} else {
			// We are assuming that positions are already grouped into triangles.
			gl.drawArrays(gl.TRIANGLES, 0, positionsCount);
		}
		this._drawFinish(params);
	}

	/**
	 * Set the clearValue of the GPUComposer, which is applied during GPUComposer.clear().
	 */
	set clearValue(clearValue: number | number[]) {
		const type = FLOAT;
		const numComponents = 4;
		if (!isValidClearValue(clearValue, numComponents, type)) {
			throw new Error(`Invalid clearValue: ${JSON.stringify(clearValue)} for GPUComposer, expected ${type} or array of ${type} of length ${numComponents}.`);
		}
		// Make deep copy if needed.
		this._clearValue = isArray(clearValue) ? (clearValue as number[]).slice() : clearValue;
		this._clearValueVec4 = undefined;
	}

	/**
	 * Get the clearValue of the GPUComposer.
	 */
	get clearValue() {
		return this._clearValue;
	}

	/**
	 * Get the clearValue of the GPUComposer as a vec4, pad with zeros as needed.
	 */
	private get clearValueVec4() {
		let { _clearValueVec4 } = this;
		if (!_clearValueVec4) {
			const { clearValue } = this;
			_clearValueVec4 = [];
			if (isFiniteNumber(clearValue)) {
				_clearValueVec4.push(clearValue as number, clearValue as number, clearValue as number, clearValue as number);
			} else {
				_clearValueVec4.push(...clearValue as number[]);
				for (let j = _clearValueVec4.length; j < 4; j++) {
					_clearValueVec4.push(0);
				}
			}
			this._clearValueVec4 = _clearValueVec4;
		}
		return _clearValueVec4;
	}

	/**
	 * Clear all data in canvas to GPUComposer.clearValue.
	 */
	clear() {
		const { verboseLogging, clearValueVec4 } = this;
		if (verboseLogging) console.log(`Clearing GPUComoser.`);
		const program = this._setValueProgramForType(FLOAT);
		program.setUniform('u_value', clearValueVec4);
		// Write clear value to canvas.
		this.step({
			program,
		});
	}

	/**
	 * If this GPUComposer has been inited via GPUComposer.initWithThreeRenderer(), call undoThreeState() in render loop before performing any gpu-io step or draw functions.
	 */
	undoThreeState() {
		const { gl, _threeRenderer, isWebGL2 } = this;
		if (!_threeRenderer) {
			throw new Error(`Can't call undoThreeState() on a GPUComposer that was not inited with GPUComposer.initWithThreeRenderer().`);
		}
		
		// Disable blend mode.
		gl.disable(gl.BLEND);

		// Unbind VAO for threejs compatibility.
		if (_threeRenderer) {
			if (isWebGL2) (gl as WebGL2RenderingContext).bindVertexArray(null);
			else {
				const ext = getExtension(this, OES_VERTEX_ARRAY_OBJECT, true);
				ext.bindVertexArrayOES(null);
			}
		}
	}

	/**
	 * If this GPUComposer has been inited via GPUComposer.initWithThreeRenderer(), call resetThreeState() in render loop after performing any gpu-io step or draw functions.
	 */
	resetThreeState() {
		const { gl, _threeRenderer } = this;
		if (!_threeRenderer) {
			throw new Error(`Can't call resetThreeState() on a GPUComposer that was not inited with GPUComposer.initWithThreeRenderer().`);
		}
		
		// Reset viewport.
		const viewport = _threeRenderer.getViewport(new ThreejsUtils.Vector4() as Vector4);
		gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height);
		// Unbind framebuffer (render to screen).
		// Reset threejs WebGL bindings and state, this also unbinds the framebuffer.
		_threeRenderer.resetState();
	}

	// TODO: params.callback is not generated in the docs.
	/**
	 * Save the current state of the canvas to png.
	 * @param params - PNG parameters.
	 * @param params.filename - PNG filename (no extension).
	 * @param params.dpi - PNG dpi (defaults to 72dpi).
	 * @param params.callback - Optional callback when Blob is ready, default behavior saves the PNG using file-saver.
	*/
	savePNG(params: {
		filename?: string,
		dpi?: number,
		callback?: (blob: Blob, filename: string) => void,
	} = {}) {
		const validKeys = ['filename', 'dpi', 'callback'];
		const keys = Object.keys(params);
		checkValidKeys(keys, validKeys, 'GPUComposer.savePNG(params)');

		const { canvas } = this;
		const filename = params.filename || 'output';
		const callback = params.callback || saveAs; // Default to saving the image with file-saver.
		// TODO: need to adjust the canvas size to get the correct px ratio from toBlob().
		// const ratio = window.devicePixelRatio || 1;
		canvas.toBlob((blob) => {
			if (!blob) {
				console.warn(`Problem saving PNG, unable to init blob from canvas.`);
				return;
			}
			if (params.dpi) {
				changeDpiBlob(blob, params.dpi).then((blob: Blob) => {
					callback(blob, `${filename}.png`);
				});
			} else {
				callback(blob, `${filename}.png`);
			}
		}, 'image/png');
	}

	/**
	 * Call tick() from your render loop to measure the FPS of your application.
	 * Internally, this does some low pass filtering to give consistent results.
	 * @returns An Object containing the current fps of your application and the number of times tick() has been called.
	 */
	tick(): { fps: number, numTicks: number} {
		this._numTicks += 1;
		let { _lastTickTime, _lastTickFPS } = this;
		const currentTime = performance.now();
		this._lastTickTime = currentTime;
		if (!_lastTickTime) {
			return { fps: 0, numTicks: this._numTicks };
		}
		const currentFPS = 1000 / (currentTime - _lastTickTime);
		if (!_lastTickFPS) _lastTickFPS = currentFPS;
		// Use a low pass filter to smooth out fps reading.
		const factor = 0.9;
		const fps =  Number.parseFloat((factor * _lastTickFPS + (1 - factor) * currentFPS).toFixed(1));
		this._lastTickFPS = fps;
		return {
			fps,
			numTicks: this._numTicks,
		};
	}

	/**
	 * Return the number of ticks of the simulation.
	 * Use GPUComposer.tick() to increment this value on each animation cycle.
	 */
	get numTicks() {
		return this._numTicks;
	}
	
	/**
	 * Deallocate GPUComposer instance and associated WebGL properties.
	 */
	dispose() {
		const { gl, verboseLogging } = this;

		if (verboseLogging) console.log(`Deallocating GPUComposer.`);

		// Delete buffers.
		if (this._quadPositionsBuffer) {
			gl.deleteBuffer(this._quadPositionsBuffer);
			delete this._quadPositionsBuffer;
		}
		if (this._boundaryPositionsBuffer) {
			gl.deleteBuffer(this._boundaryPositionsBuffer);
			delete this._boundaryPositionsBuffer;
		}
		(Object.keys(this._circlePositionsBuffer) as any as number[]).forEach(key => {
			gl.deleteBuffer(this._circlePositionsBuffer[key]);
		});
		// @ts-ignore
		delete this._circlePositionsBuffer;
		delete this._pointIndexArray;
		if (this._pointIndexBuffer) {
			gl.deleteBuffer(this._pointIndexBuffer);
			delete this._pointIndexBuffer;
		}
		delete this._vectorFieldIndexArray;
		if (this._vectorFieldIndexBuffer) {
			gl.deleteBuffer(this._vectorFieldIndexBuffer);
			delete this._vectorFieldIndexBuffer;
		}
		if (this._indexedLinesIndexBuffer) {
			gl.deleteBuffer(this._indexedLinesIndexBuffer);
			delete this._indexedLinesIndexBuffer;
		}

		// Delete vertex attribute locations.
		Object.keys(this._vertexAttributeLocations).forEach((key) => {
			delete this._vertexAttributeLocations[key];
		});
		// @ts-ignore
		delete this._vertexAttributeLocations;
		// @ts-ignore
		delete this._enabledVertexAttributes;

		// Delete vertex shaders.
		Object.values(this._vertexShaders).forEach(({ compiledShaders })=> {
			Object.keys(compiledShaders).forEach(key => {
				gl.deleteShader(compiledShaders[key]);
				delete compiledShaders[key];
			});
		});
		// @ts-ignore
		delete this._vertexShaders;
		
		// Delete fragment shaders.
		Object.values(this._copyPrograms).forEach(program => {
			program.dispose();
		});
		Object.keys(this._copyPrograms).forEach(key => {
			// @ts-ignore
			delete this._copyPrograms[key];
		});
		// @ts-ignore;
		delete this._copyPrograms;

		Object.values(this._setValuePrograms).forEach(program => {
			program.dispose();
		});
		Object.keys(this._setValuePrograms).forEach(key => {
			// @ts-ignore
			delete this._setValuePrograms[key];
		});
		// @ts-ignore;
		delete this._setValuePrograms;

		this._wrappedLineColorProgram?.dispose();
		delete this._wrappedLineColorProgram;

		// @ts-ignore
		delete this._threeRenderer;
		// @ts-ignore
		delete this.gl;
		// @ts-ignore;
		delete this.canvas;
		// GL context will be garbage collected by webgl.
		// @ts-ignore
		delete this._errorCallback;
		// @ts-ignore
		delete this._extensions;

		// Delete all other keys.
		// This is mostly for testing so we can be sure we've deallocated everything.
		// @ts-ignore;
		delete this._errorState;
		// @ts-ignore;
		delete this.verboseLogging;
		// @ts-ignore;
		delete this._numTicks;
		// @ts-ignore;
		delete this.isWebGL2;
		// @ts-ignore;
		delete this.glslVersion;
		// @ts-ignore;
		delete this.intPrecision;
		// @ts-ignore;
		delete this.floatPrecision;
		// @ts-ignore;
		delete this._width;
		// @ts-ignore;
		delete this._height;
		// @ts-ignore
		delete this._clearValue;
		delete this._clearValueVec4;
	}
}