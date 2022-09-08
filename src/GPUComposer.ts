// @ts-ignore
import { changeDpiBlob } from 'changedpi';
import { GPULayer } from './GPULayer';
import {
	GPULayerFilter,
	GPULayerType,
	GPULayerWrap,
	FLOAT,
	UNSIGNED_BYTE,
	INT,
	GLSLVersion,
	GLSL1,
	GLSL3,
	WEBGL2,
	WEBGL1,
	EXPERIMENTAL_WEBGL,
	CLAMP_TO_EDGE,
	TextureFormat,
	NEAREST,
	RGBA,
	TextureType,
	PROGRAM_NAME_INTERNAL,
	CompileTimeVars,
	DEFAULT_PROGRAM_NAME,
	SEGMENT_PROGRAM_NAME,
	LAYER_POINTS_PROGRAM_NAME,
	LAYER_VECTOR_FIELD_PROGRAM_NAME,
	LAYER_LINES_PROGRAM_NAME,
	ErrorCallback,
	DEFAULT_CIRCLE_NUM_SEGMENTS,
	validFilters,
	validWraps,
	validTextureFormats,
	validTextureTypes,
	UINT,
	GLSLPrecision,
	PRECISION_HIGH_P,
	DEFAULT_ERROR_CALLBACK,
	BOOL,
	GPULayerState,
	GPUIO_VS_UV_ATTRIBUTE,
	GPUIO_VS_NORMAL_ATTRIBUTE,
	GPUIO_VS_POSITION_W_ACCUM,
	GPUIO_VS_WRAP_X,
	GPUIO_VS_WRAP_Y,
	MAX_FLOAT_INT,
	GPUIO_VS_INDEXED_POSITIONS,
} from './constants';
import { GPUProgram } from './GPUProgram';
// Just importing the types here.
// Only @types/three is installed as dev dependency.
import {
	WebGLRenderer,
	Vector4,
} from 'three';
import * as utils from './Vector4';
import {
	isWebGL2,
	isPowerOf2,
	initSequentialFloatArray,
	preprocessVertexShader,
	compileShader,
} from './utils';
import {
	isArray,
	isString,
	isValidFilter,
	isValidTextureType,
	isValidTextureFormat,
	isValidWrap,
} from './checks';
import { DEFAULT_VERT_SHADER_SOURCE } from './glsl/vertex/DefaultVertexShader';
import { LAYER_LINES_VERTEX_SHADER_SOURCE } from './glsl/vertex/LayerLinesVertexShader';
import { SEGMENT_VERTEX_SHADER_SOURCE } from './glsl/vertex/SegmentVertexShader';
import { LAYER_POINTS_VERTEX_SHADER_SOURCE } from './glsl/vertex/LayerPointsVertexShader';
import { LAYER_VECTOR_FIELD_VERTEX_SHADER_SOURCE } from './glsl/vertex/LayerVectorFieldVertexShader';
import { uniformTypeForType } from './conversions';
import { copyProgramForType, setValueProgramForTypeAndNumComponents, vectorMagnitudeProgramForType, wrappedLineColorProgram } from './Programs';

export class GPUComposer {
	readonly canvas: HTMLCanvasElement;
	readonly gl!: WebGLRenderingContext | WebGL2RenderingContext;
	readonly glslVersion!: GLSLVersion;
	readonly intPrecision!: GLSLPrecision;
	readonly floatPrecision!: GLSLPrecision;
	// These width and height are the current canvas at full res.
	private _width!: number;
	private _height!: number;

	private _errorThrown = false;
	/**
	 * @private
	 */
	readonly _errorCallback: ErrorCallback;

	// Save threejs renderer if passed in.
	/**
	 * @private
	 */
	readonly _renderer?: WebGLRenderer;
	private readonly _maxNumTextures!: number;
	
	// Precomputed buffers (inited as needed).
	private _quadPositionsBuffer?: WebGLBuffer;
	private _boundaryPositionsBuffer?: WebGLBuffer;
	// Store multiple circle positions buffers for various num segments, use numSegments as key.
	private _circlePositionsBuffer: { [key: number]: WebGLBuffer } = {};

	private _pointIndexArray?: Float32Array;
	private _pointIndexBuffer?: WebGLBuffer;
	private _vectorFieldIndexArray?: Float32Array;
	private _vectorFieldIndexBuffer?: WebGLBuffer;
	private _indexedLinesIndexBuffer?: WebGLBuffer;

	// Keep track of all GL extensions that have been loaded.
	/**
	 * @private
	 */
	readonly _extensions: { [key: string]: any } = {};

	// Programs for copying data (these are needed for rendering partial screen geometries).
	private readonly _copyPrograms: {
		[FLOAT]?: GPUProgram,
		[INT]?: GPUProgram,
		[UINT]?: GPUProgram,
	} = {};

	// Other util programs.
	private readonly _setValuePrograms: {
		[FLOAT]?: GPUProgram,
		[INT]?: GPUProgram,
		[UINT]?: GPUProgram,
	} = {};
	private _wrappedLineColorProgram?: GPUProgram; // We only need a FLOAT version of this.
	private readonly _vectorMagnitudePrograms: {
		[FLOAT]?: GPUProgram,
		[INT]?: GPUProgram,
		[UINT]?: GPUProgram,
	} = {};

	/**
	 * Vertex shaders are shared across all GPUProgram instances.
	 * @private
	 */
	readonly _vertexShaders: {[key in PROGRAM_NAME_INTERNAL]: {
		src: string,
		compiledShaders: { [key: string] : WebGLShader },
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
	};

	verboseLogging = false;

	private _lastTickTime?: number;
	private _lastTickFPS?: number
	private _numTicks = 0;

	constructor(
		params: {
			canvas: HTMLCanvasElement,
			context?: WebGLRenderingContext | WebGL2RenderingContext,
			contextID?: typeof WEBGL2 | typeof WEBGL1 | typeof EXPERIMENTAL_WEBGL | string,
			contextOptions?: {
				antialias?: boolean,
				[key: string]: any,
			},
			glslVersion?: GLSLVersion,
			intPrecision?: GLSLPrecision,
			floatPrecision?: GLSLPrecision,
			verboseLogging?: boolean,
			// Optionally pass in an error callback in case we want to handle errors related to webgl support.
			// e.g. throw up a modal telling user this will not work on their device.
			errorCallback?: ErrorCallback,
		},
	) {
		// Check params.
		const validKeys = ['canvas', 'context', 'contextID', 'contextOptions', 'glslVersion', 'verboseLogging', 'errorCallback'];
		const requiredKeys = ['canvas'];
		const keys = Object.keys(params);
		keys.forEach(key => {
			if (validKeys.indexOf(key) < 0) {
				throw new Error(`Invalid key "${key}" passed to new GPUComposer(params).  Valid keys are ${validKeys.join(', ')}.`);
			}
		});
		// Check for required keys.
		requiredKeys.forEach(key => {
			if (keys.indexOf(key) < 0) {
				throw new Error(`Required params key "${key}" was not passed to new GPUComposer(params).`);
			}
		});

		if (params.verboseLogging !== undefined) this.verboseLogging = params.verboseLogging;

		// Save callback in case we run into an error.
		const self = this;
		this._errorCallback = (message: string) => {
			if (self._errorThrown) {
				return;
			}
			self._errorThrown = true;
			params.errorCallback ? params.errorCallback(message) : DEFAULT_ERROR_CALLBACK(message);
		}

		const { canvas } = params;
		this.canvas = canvas;
		let gl = params.context;

		// Init GL.
		if (!gl) {
			// Init a gl context if not passed in.
			if (params.contextID) {
				const _gl = canvas.getContext(params.contextID, params.contextOptions) as WebGLRenderingContext | null;
				if (!_gl) {
					console.warn(`Unable to initialize WebGL context with contextID: ${params.contextID}.`);
				} else {
					gl = _gl;
				}
			}
			if (!gl) {
				const _gl = canvas.getContext(WEBGL2, params.contextOptions)  as WebGL2RenderingContext | null
					|| canvas.getContext(WEBGL1, params.contextOptions)  as WebGLRenderingContext | null
					|| canvas.getContext(EXPERIMENTAL_WEBGL, params.contextOptions)  as WebGLRenderingContext | null;
				if (_gl) {
					gl = _gl;
				}
			}
			if (!gl) {
				this._errorCallback('Unable to initialize WebGL context.');
				return;
			}
		}
		if (isWebGL2(gl)) {
			if (this.verboseLogging) console.log('Using WebGL 2.0 context.');
		} else {
			if (this.verboseLogging) console.log('Using WebGL 1.0 context.');
		}
		this.gl = gl;

		// Save glsl version, default to 3 if using webgl2 context.
		let glslVersion = params.glslVersion || (isWebGL2(gl) ? GLSL3 : GLSL1);
		if (!isWebGL2(gl) && glslVersion === GLSL3) {
			console.warn('GLSL3.x is incompatible with WebGL1.0 contexts, falling back to GLSL1.');
			glslVersion = GLSL1; // Fall back to GLSL1 in these cases.
		}
		// TODO: check that this is valid.
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
		// TODO: look into more of these: https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/pixelStorei
		// // Some implementations of HTMLCanvasElement's or OffscreenCanvas's CanvasRenderingContext2D store color values
		// // internally in premultiplied form. If such a canvas is uploaded to a WebGL texture with the
		// // UNPACK_PREMULTIPLY_ALPHA_WEBGL pixel storage parameter set to false, the color channels will have to be un-multiplied
		// // by the alpha channel, which is a lossy operation. The WebGL implementation therefore can not guarantee that colors
		// // with alpha < 1.0 will be preserved losslessly when first drawn to a canvas via CanvasRenderingContext2D and then
		// // uploaded to a WebGL texture when the UNPACK_PREMULTIPLY_ALPHA_WEBGL pixel storage parameter is set to false.
		// gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

		// Unbind active buffer.
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		// Canvas setup.
		this.resize(canvas.clientWidth, canvas.clientHeight);

		// Log number of textures available.
		this._maxNumTextures = this.gl.getParameter(this.gl.MAX_TEXTURE_IMAGE_UNITS);
		if (this.verboseLogging) console.log(`${this._maxNumTextures} textures max.`);
	}

	static initWithThreeRenderer(
		renderer: WebGLRenderer,
		params?: {
			verboseLogging?: boolean,
			errorCallback?: ErrorCallback,
		},
	) {
		const composer = new GPUComposer(
			{
				floatPrecision: renderer.capabilities.precision as GLSLPrecision || PRECISION_HIGH_P,
				intPrecision: renderer.capabilities.precision as GLSLPrecision || PRECISION_HIGH_P,
				...params,
				canvas: renderer.domElement,
				context: renderer.getContext(),
				glslVersion: renderer.capabilities.isWebGL2 ? GLSL3 : GLSL1,
			},
		);
		// Attach renderer.
		// @ts-ignore
		composer.renderer = renderer;
		return composer;
	}

	isWebGL2() {
		return isWebGL2(this.gl);
	}

	/**
	 * 
	 * @private
	 */
	_setValueProgramForType(type: GPULayerType) {
		const { _setValuePrograms } = this;
		const key = uniformTypeForType(type, this.glslVersion);
		if (_setValuePrograms[key] === undefined) {
			_setValuePrograms[key] = setValueProgramForTypeAndNumComponents(this, type, 4);
		}
		return _setValuePrograms[key]!;
	}

	private _copyProgramForType(type: GPULayerType) {
		const { _copyPrograms } = this;
		const key = uniformTypeForType(type, this.glslVersion);
		if (_copyPrograms[key] === undefined) {
			_copyPrograms[key] = copyProgramForType(this, type);
		}
		return _copyPrograms[key]!;
	}

	private _getWrappedLineColorProgram() {
		if (this._wrappedLineColorProgram === undefined) {
			this._wrappedLineColorProgram = wrappedLineColorProgram(this);
		}
		return this._wrappedLineColorProgram;
	}

	private _vectorMagnitudeProgramForType(type: GPULayerType) {
		const { _vectorMagnitudePrograms } = this;
		const key = uniformTypeForType(type, this.glslVersion);
		if (_vectorMagnitudePrograms[key] === undefined) {
			_vectorMagnitudePrograms[key] = vectorMagnitudeProgramForType(this, type);
		}
		return _vectorMagnitudePrograms[key]!;
	}

	_getQuadPositionsBuffer() {
		if (this._quadPositionsBuffer === undefined) {
			const fsQuadPositions = new Float32Array([ -1, -1, 1, -1, -1, 1, 1, 1 ]);
			this._quadPositionsBuffer = this._initVertexBuffer(fsQuadPositions)!;
		}
		return this._quadPositionsBuffer!;
	}

	private _getBoundaryPositionsBuffer() {
		if (this._boundaryPositionsBuffer === undefined) {
			const boundaryPositions = new Float32Array([ -1, -1, 1, -1, 1, 1, -1, 1, -1, -1 ]);
			this._boundaryPositionsBuffer = this._initVertexBuffer(boundaryPositions)!;
		}
		return this._boundaryPositionsBuffer!;
	}

	private _getCirclePositionsBuffer(numSegments: number) {
		const { _circlePositionsBuffer } = this;
		if (_circlePositionsBuffer[numSegments] == undefined) {
			const unitCirclePoints = [0, 0];
			for (let i = 0; i <= numSegments; i++) { // TODO: should this be just less than?
				unitCirclePoints.push(
					Math.cos(2 * Math.PI * i / numSegments),
					Math.sin(2 * Math.PI * i / numSegments),
				);
			}
			const circlePositions = new Float32Array(unitCirclePoints);
			const buffer = this._initVertexBuffer(circlePositions)!;
			_circlePositionsBuffer[numSegments] = buffer;
		}
		return _circlePositionsBuffer[numSegments];
	}

	private _initVertexBuffer(
		data: Float32Array,
	) {
		const { _errorCallback, gl } = this;
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
	 * Used internally, see GPULayer.clone() for public API.
	 * @private
	 */
	_cloneGPULayer(gpuLayer: GPULayer, name?: string) {
		let dimensions: number | [number, number] = 0;
		try {
			dimensions = gpuLayer.length;
		} catch {
			dimensions = [gpuLayer.width, gpuLayer.height];
		}

		// If read only, get state by reading to GPU.
		const array = gpuLayer.writable ? undefined : gpuLayer.getValues();

		const clone = new GPULayer(this, {
			name: name || `${gpuLayer.name}-clone`,
			dimensions,
			type: gpuLayer.type,
			numComponents: gpuLayer.numComponents,
			filter: gpuLayer.filter,
			wrapS: gpuLayer.wrapS,
			wrapT: gpuLayer.wrapT,
			writable: gpuLayer.writable,
			numBuffers: gpuLayer.numBuffers,
			clearValue: gpuLayer.clearValue,
			array,
		});

		// TODO: check this.
		// If writable, copy current state with a draw call.
		if (gpuLayer.writable) {
			for (let i = 0; i < gpuLayer.numBuffers - 1; i++) {
				this.step({
					program: this._copyProgramForType(gpuLayer.type),
					input: gpuLayer.getStateAtIndex((gpuLayer.bufferIndex + i + 1) % gpuLayer.numBuffers),
					output: clone,
				});
			}
			this.step({
				program: this._copyProgramForType(gpuLayer.type),
				input: gpuLayer.currentState,
				output: clone,
			});
		}

		// TODO: Increment clone's buffer index until it is identical to the original layer.


		return clone;
	}

	initTexture(
		params: {
			name: string,
			url: string,
			filter?: GPULayerFilter,
			wrapS?: GPULayerWrap,
			wrapT?: GPULayerWrap,
			format?: TextureFormat,
			type?: TextureType,
			onLoad?: (texture: WebGLTexture) => void,
		},
	) {
		// Check params.
		const validKeys = ['name', 'url', 'filter', 'wrapS', 'wrapT', 'format', 'type', 'onLoad'];
		Object.keys(params).forEach(key => {
			if (validKeys.indexOf(key) < 0) {
				throw new Error(`Invalid key "${key}" passed to GPUComposer.initTexture with name "${params.name}".  Valid keys are ${validKeys.join(', ')}.`);
			}
		});
		const { url, name } = params;
		if (!isString(url)) {
			throw new Error(`Expected GPUComposer.initTexture params to have url of type string, got ${url} of type ${typeof url}.`)
		}
		if (!isString(name)) {
			throw new Error(`Expected GPUComposer.initTexture params to have name of type string, got ${name} of type ${typeof name}.`)
		}

		// Get filter type, default to nearest.
		const filter = params.filter !== undefined ? params.filter : NEAREST;
		if (!isValidFilter(filter)) {
			throw new Error(`Invalid filter: ${filter} for GPULayer "${name}", must be ${validFilters.join(', ')}.`);
		}

		// Get wrap types, default to clamp to edge.
		const wrapS = params.wrapS !== undefined ? params.wrapS : CLAMP_TO_EDGE;
		if (!isValidWrap(wrapS)) {
			throw new Error(`Invalid wrapS: ${wrapS} for GPULayer "${name}", must be ${validWraps.join(', ')}.`);
		}
		const wrapT = params.wrapT !== undefined ? params.wrapT : CLAMP_TO_EDGE;
		if (!isValidWrap(wrapT)) {
			throw new Error(`Invalid wrapT: ${wrapT} for GPULayer "${name}", must be ${validWraps.join(', ')}.`);
		}

		// Get image format type, default to rgba.
		const format = params.format !== undefined ? params.format : RGBA;
		if (!isValidTextureFormat(format)) {
			throw new Error(`Invalid format: ${format} for GPULayer "${name}", must be ${validTextureFormats.join(', ')}.`);
		}

		// Get image data type, default to unsigned byte.
		const type = params.type !== undefined ? params.type : UNSIGNED_BYTE;
		if (!isValidTextureType(type)) {
			throw new Error(`Invalid type: ${type} for GPULayer "${name}", must be ${validTextureTypes.join(', ')}.`);
		}

		const { gl, _errorCallback } = this;
		const texture = gl.createTexture();
		if (texture === null) {
			throw new Error(`Unable to init glTexture.`);
		}
		gl.bindTexture(gl.TEXTURE_2D, texture);
		// Because images have to be downloaded over the internet
		// they might take a moment until they are ready.
		// Until then put a single pixel in the texture so we can
		// use it immediately. When the image has finished downloading
		// we'll update the texture with the contents of the image.
		const level = 0;
		const internalFormat = gl.RGBA;
		const width = 1;
		const height = 1;
		const border = 0;
		const srcFormat = gl[format];
		const srcType = gl[type];
		const pixel = new Uint8Array([0, 0, 0, 0]);
		gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
			width, height, border, srcFormat, srcType, pixel);

		const image = new Image();
		image.onload = () => {
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
				srcFormat, srcType, image);

			// WebGL1 has different requirements for power of 2 images
			// vs non power of 2 images so check if the image is a
			// power of 2 in both dimensions.
			if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
				// // Yes, it's a power of 2. Generate mips.
				// gl.generateMipmap(gl.TEXTURE_2D);
			} else {
				// TODO: finish implementing this.
				console.warn(`Texture ${name} dimensions [${image.width}, ${image.height}] are not power of 2.`);
				// // No, it's not a power of 2. Turn off mips and set
				// // wrapping to clamp to edge
				// gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
				// gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			}
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl[wrapS]);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl[wrapT]);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl[filter]);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl[filter]);

			// Callback when texture has loaded.
			if (params.onLoad) params.onLoad(texture);
		};
		image.onerror = (e) => {
			_errorCallback(`Error loading image ${name}: ${e}`);
		}
		image.src = url;

		return texture;
	}

	/**
	 * 
	 * @private
	 */
	 _getVertexShader(
		name: PROGRAM_NAME_INTERNAL,
		vertexID: string,
		vertexDefines: CompileTimeVars,
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
				vertexDefines,
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

	resize(width: number, height: number) {
		const { canvas } = this;
		// Set correct canvas pixel size.
		// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/By_example/Canvas_size_and_WebGL
		canvas.width = width;
		canvas.height = height;
		// Save dimensions.
		this._width = width;
		this._height = height;
	};

	private _drawSetup(
		gpuProgram: GPUProgram,
		programName: PROGRAM_NAME_INTERNAL,
		vertexDefines: CompileTimeVars,
		fullscreenRender: boolean,
		input?: (GPULayer | GPULayerState)[] | GPULayer | GPULayerState,
		output?: GPULayer,
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

		const program = gpuProgram._getProgramWithName(programName, vertexDefines, inputTextures)!;

		// Set output framebuffer.
		// This may modify WebGL internal state.
		this._setOutputLayer(fullscreenRender, input, output);

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

	private _setBlendMode(shouldBlendAlpha?: boolean) {
		const { gl } = this;
		if (shouldBlendAlpha) {
			gl.enable(gl.BLEND);
			gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		}
	}

	private _indexOfLayerInArray(layer: GPULayer, array: (GPULayer | GPULayerState)[]) {
		return array.findIndex(item => item === layer || (item as GPULayerState).layer === layer);
	}

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
			if (this._indexOfLayerInArray(layer, (input as (GPULayer | GPULayerState)[])) >= 0) {
				return input  as (GPULayer | GPULayerState)[];
			}
			return [...(input as (GPULayer | GPULayerState)[]), layer];
		}
		if (input === layer || (input as GPULayerState).layer === layer) {
			return [input as GPULayerState];
		}
		return [(input as GPULayer | GPULayerState), layer];
	}

	private _passThroughLayerDataFromInputToOutput(state: GPULayer) {
		// TODO: figure out the fastest way to copy a texture.
		const copyProgram = this._copyProgramForType(state._internalType);
		this.step({
			program: copyProgram,
			input: state,
			output: state,
		});
	}

	private _setOutputLayer(
		fullscreenRender: boolean,
		input?: (GPULayer | GPULayerState)[] | GPULayer | GPULayerState,
		output?: GPULayer, // Undefined renders to screen.
	) {
		const { gl } = this;

		// Render to screen.
		if (!output) {
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			// Resize viewport.
			const { _width, _height } = this;
			gl.viewport(0, 0, _width, _height);
			return;
		}

		// Check if output is same as one of input layers.
		if (input && ((input === output || (input as GPULayerState).layer === output) ||
			(isArray(input) && this._indexOfLayerInArray(output, input as (GPULayer | GPULayerState)[]) >= 0))) {
			if (output.numBuffers === 1) {
				throw new Error('Cannot use same buffer for input and output of a program. Try increasing the number of buffers in your output layer to at least 2 so you can render to nextState using currentState as an input.');
			}
			if (fullscreenRender) {
				// Render and increment buffer so we are rendering to a different target
				// than the input texture.
				output._prepareForWrite(true);
			} else {
				// Pass input texture through to output.
				this._passThroughLayerDataFromInputToOutput(output);
				// Render to output without incrementing buffer.
				output._prepareForWrite(false);
			}
		} else {
			if (fullscreenRender) {
				// Render to current buffer.
				output._prepareForWrite(false);
			} else {
				// If we are doing a sneaky thing with a swapped texture and are
				// only rendering part of the screen, we may need to add a copy operation.
				if (output._usingTextureOverrideForCurrentBuffer()) {
					this._passThroughLayerDataFromInputToOutput(output);
				}
				output._prepareForWrite(false);
			}
		}
		
		// Resize viewport.
		const { width, height } = output;
		gl.viewport(0, 0, width, height);
	};

	private _setVertexAttribute(program: WebGLProgram, name: string, size: number, programName: string) {
		const { gl } = this;
		// Point attribute to the currently bound VBO.
		const location = gl.getAttribLocation(program, name);
		if (location < 0) {
			throw new Error(`Unable to find vertex attribute "${name}" in program "${programName}".`);
		}
		// INT types not supported for attributes.
		// Use FLOAT rather than SHORT bc FLOAT covers more INT range.
		// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
		gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
		// Enable the attribute.
		gl.enableVertexAttribArray(location);
	}

	_setPositionAttribute(program: WebGLProgram, programName: string) {
		this._setVertexAttribute(program, 'a_gpuio_position', 2, programName);
	}

	private _setIndexAttribute(program: WebGLProgram, programName: string) {
		this._setVertexAttribute(program, 'a_gpuio_index', 1, programName);
	}

	private _setUVAttribute(program: WebGLProgram, programName: string) {
		this._setVertexAttribute(program, 'a_gpuio_uv', 2, programName);
	}

	// Step for entire fullscreen quad.
	step(
		params: {
			program: GPUProgram,
			input?:  (GPULayer | GPULayerState)[] | GPULayer | GPULayerState,
			output?: GPULayer, // Undefined renders to screen.
			shouldBlendAlpha?: boolean,
		},
	) {
		const { gl } = this;
		const { program, input, output } = params;

		// Do setup - this must come first.
		const glProgram = this._drawSetup(program, DEFAULT_PROGRAM_NAME, {}, true, input, output);

		// Update uniforms and buffers.
		program._setVertexUniform(glProgram, 'u_gpuio_scale', [1, 1], FLOAT);
		program._setVertexUniform(glProgram, 'u_gpuio_translation', [0, 0], FLOAT);
		gl.bindBuffer(gl.ARRAY_BUFFER, this._getQuadPositionsBuffer());
		this._setPositionAttribute(glProgram, program.name);

		// Draw.
		this._setBlendMode(params.shouldBlendAlpha);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
		gl.disable(gl.BLEND);
	}

	// Step program only for a strip of px along the boundary.
	stepBoundary(
		params: {
			program: GPUProgram,
			input?:  (GPULayer | GPULayerState)[] | GPULayer | GPULayerState,
			output?: GPULayer, // Undefined renders to screen.
			singleEdge?: 'LEFT' | 'RIGHT' | 'TOP' | 'BOTTOM';
			shouldBlendAlpha?: boolean,
		},
	) {
		const { gl } = this;
		const { program, input, output } = params;
		const width = output ? output.width : this._width;
		const height = output ? output.height : this._height;

		// Do setup - this must come first.
		const glProgram = this._drawSetup(program, DEFAULT_PROGRAM_NAME, {}, false, input, output);

		// Update uniforms and buffers.
		// Frame needs to be offset and scaled so that all four sides are in viewport.
		const onePx = [ 1 / width, 1 / height] as [number, number];
		program._setVertexUniform(glProgram, 'u_gpuio_scale', [1 - onePx[0], 1 - onePx[1]], FLOAT);
		program._setVertexUniform(glProgram, 'u_gpuio_translation', onePx, FLOAT);
		gl.bindBuffer(gl.ARRAY_BUFFER, this._getBoundaryPositionsBuffer());
		this._setPositionAttribute(glProgram, program.name);

		// Draw.
		this._setBlendMode(params.shouldBlendAlpha);
		if (params.singleEdge) {
			switch(params.singleEdge) {
				case 'LEFT':
					gl.drawArrays(gl.LINES, 3, 2);
					break;
				case 'RIGHT':
					gl.drawArrays(gl.LINES, 1, 2);
					break;
				case 'TOP':
					gl.drawArrays(gl.LINES, 2, 2);
					break;
				case 'BOTTOM':
					gl.drawArrays(gl.LINES, 0, 2);
					break;
				default:
					throw new Error(`Unknown boundary edge type: ${params.singleEdge}.`);
			}
		} else {
			gl.drawArrays(gl.LINE_LOOP, 0, 4);
		}
		gl.disable(gl.BLEND);
	}

	// Step program for all but a strip of px along the boundary.
	stepNonBoundary(
		params: {
			program: GPUProgram,
			input?:  (GPULayer | GPULayerState)[] | GPULayer | GPULayerState,
			output?: GPULayer, // Undefined renders to screen.
			shouldBlendAlpha?: boolean,
		},
	) {
		const { gl } = this;
		const { program, input, output } = params;
		const width = output ? output.width : this._width;
		const height = output ? output.height : this._height;

		// Do setup - this must come first.
		const glProgram = this._drawSetup(program, DEFAULT_PROGRAM_NAME, {}, false, input, output);

		// Update uniforms and buffers.
		const onePx = [ 1 / width, 1 / height] as [number, number];
		program._setVertexUniform(glProgram, 'u_gpuio_scale', [1 - 2 * onePx[0], 1 - 2 * onePx[1]], FLOAT);
		program._setVertexUniform(glProgram, 'u_gpuio_translation', onePx, FLOAT);
		gl.bindBuffer(gl.ARRAY_BUFFER, this._getQuadPositionsBuffer);
		this._setPositionAttribute(glProgram, program.name);
		
		// Draw.
		this._setBlendMode(params.shouldBlendAlpha);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
		gl.disable(gl.BLEND);
	}

	// Step program inside a circular spot.
	stepCircle(
		params: {
			program: GPUProgram,
			position: [number, number], // Position is in units of pixels.
			diameter: number, // Diameter is in units of pixels.
			input?:  (GPULayer | GPULayerState)[] | GPULayer | GPULayerState,
			output?: GPULayer, // Undefined renders to screen.
			numSegments?: number,
			shouldBlendAlpha?: boolean,
		},
	) {
		const { gl, _width, _height } = this;
		const { program, position, diameter, input, output } = params;

		// Do setup - this must come first.
		const glProgram = this._drawSetup(program, DEFAULT_PROGRAM_NAME, {}, false, input, output);

		// Update uniforms and buffers.
		program._setVertexUniform(glProgram, 'u_gpuio_scale', [diameter / _width, diameter / _height], FLOAT);
		program._setVertexUniform(glProgram, 'u_gpuio_translation', [2 * position[0] / _width - 1, 2 * position[1] / _height - 1], FLOAT);
		const numSegments = params.numSegments ? params.numSegments : DEFAULT_CIRCLE_NUM_SEGMENTS;
		if (numSegments < 3) {
			throw new Error(`numSegments for GPUComposer.stepCircle must be greater than 2, got ${numSegments}.`);
		}
		gl.bindBuffer(gl.ARRAY_BUFFER, this._getCirclePositionsBuffer(numSegments));
		this._setPositionAttribute(glProgram, program.name);
		
		// Draw.
		this._setBlendMode(params.shouldBlendAlpha);
		gl.drawArrays(gl.TRIANGLE_FAN, 0, numSegments + 2);	
		gl.disable(gl.BLEND);
	}

	// Step program only for a thickened line segment (rounded end caps available).
	stepSegment(
		params: {
			program: GPUProgram,
			position1: [number, number], // Position is in units of pixels.
			position2: [number, number], // Position is in units of pixels.
			thickness: number, // Thickness is in units of pixels.
			input?:  (GPULayer | GPULayerState)[] | GPULayer | GPULayerState,
			output?: GPULayer, // Undefined renders to screen.
			endCaps?: boolean,
			numCapSegments?: number,
			shouldBlendAlpha?: boolean,
		},
	) {
		const { gl } = this;
		const { program, position1, position2, thickness, input, output } = params;
		const width = output ? output.width : this._width;
		const height = output ? output.height : this._height;

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
		program._setVertexUniform(glProgram, 'u_gpuio_translation', [2 * centerX / this._width - 1, 2 * centerY / this._height - 1], FLOAT);
		const length = Math.sqrt(diffX * diffX + diffY * diffY);
		
		const numSegments = params.numCapSegments ? params.numCapSegments * 2 : DEFAULT_CIRCLE_NUM_SEGMENTS;
		if (params.endCaps) {
			if (numSegments < 6 || numSegments % 6 !== 0) {
				throw new Error(`numSegments for GPUComposer.stepSegment must be divisible by 6, got ${numSegments}.`);
			}
			// Have to subtract a small offset from length.
			program._setVertexUniform(glProgram, 'u_gpuio_length', length - thickness * Math.sin(Math.PI / numSegments), FLOAT);
			gl.bindBuffer(gl.ARRAY_BUFFER, this._getCirclePositionsBuffer(numSegments));
		} else {
			// Have to subtract a small offset from length.
			program._setVertexUniform(glProgram, 'u_gpuio_length', length - thickness, FLOAT);
			// Use a rectangle in case of no caps.
			gl.bindBuffer(gl.ARRAY_BUFFER, this._getQuadPositionsBuffer());
		}

		this._setPositionAttribute(glProgram, program.name);
		
		// Draw.
		this._setBlendMode(params.shouldBlendAlpha);
		if (params.endCaps) {
			gl.drawArrays(gl.TRIANGLE_FAN, 0, numSegments + 2);
		} else {
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
		}
		gl.disable(gl.BLEND);
	}

	stepPolyline(
		params: {
			program: GPUProgram,
			positions: [number, number][],
			thickness: number, // Thickness of line is in units of pixels.
			input?: (GPULayer | GPULayerState)[] | GPULayer | GPULayerState,
			output?: GPULayer, // Undefined renders to screen.
			closeLoop?: boolean,
			includeUVs?: boolean,
			includeNormals?: boolean,
			shouldBlendAlpha?: boolean,
		},
	) {
		const { program, input, output } = params;
		const vertices = params.positions;
		const closeLoop = !!params.closeLoop;
		
		const { gl, _width, _height } = this

		// Offset vertices.
		const halfThickness = params.thickness / 2;
		const numPositions = closeLoop ? vertices.length * 4 + 2 : (vertices.length - 1) * 4;
		const positions = new Float32Array(2 * numPositions);
		const uvs = params.includeUVs ? new Float32Array(2 * numPositions) : undefined;
		const normals = params.includeNormals ? new Float32Array(2 * numPositions) : undefined;

		// tmp arrays.
		const s1 = [0, 0];
		const s2 = [0, 0];
		const n1 = [0, 0];
		const n2 = [0, 0];
		const n3 = [0, 0];
		for (let i = 0; i < vertices.length; i++) {
			if (!closeLoop && i === vertices.length - 1) continue;
			// Vertices on this segment.
			const v1 = vertices[i];
			const v2 = vertices[(i + 1) % vertices.length];
			s1[0] = v2[0] - v1[0];
			s1[1] = v2[1] - v1[1];
			const length1 = Math.sqrt(s1[0] * s1[0] + s1[1] * s1[1]);
			n1[0] = s1[1] / length1;
			n1[1] = - s1[0] / length1;

			const index = i * 4 + 2;

			if (!closeLoop && i === 0) {
				// Add starting points to positions array.
				positions[0] = v1[0] + n1[0] * halfThickness;
				positions[1] = v1[1] + n1[1] * halfThickness;
				positions[2] = v1[0] - n1[0] * halfThickness;
				positions[3] = v1[1] - n1[1] * halfThickness;
				if (uvs) {
					uvs[0] = 0;
					uvs[1] = 1;
					uvs[2] = 0;
					uvs[3] = 0;
				}
				if (normals) {
					normals[0] = n1[0];
					normals[1] = n1[1];
					normals[2] = n1[0];
					normals[3] = n1[1];
				}
			}

			const u = (i + 1) / (vertices.length - 1);

			// Offset from v2.
			positions[2 * index] = v2[0] + n1[0] * halfThickness;
			positions[2 * index + 1] = v2[1] + n1[1] * halfThickness;
			positions[2 * index + 2] = v2[0] - n1[0] * halfThickness;
			positions[2 * index + 3] = v2[1] - n1[1] * halfThickness;
			if (uvs) {
				uvs[2 * index] = u;
				uvs[2 * index + 1] = 1;
				uvs[2 * index + 2] = u;
				uvs[2 * index + 3] = 0;
			}
			if (normals) {
				normals[2 * index] = n1[0];
				normals[2 * index + 1] = n1[1];
				normals[2 * index + 2] = n1[0];
				normals[2 * index + 3] = n1[1];
			}

			if ((i < vertices.length - 2) || closeLoop) {
				// Vertices on next segment.
				const v3 = vertices[(i + 1) % vertices.length];
				const v4 = vertices[(i + 2) % vertices.length];
				s2[0] = v4[0] - v3[0];
				s2[1] = v4[1] - v3[1];
				const length2 = Math.sqrt(s2[0] * s2[0] + s2[1] * s2[1]);
				n2[0] = s2[1] / length2;
				n2[1] = - s2[0] / length2;

				// Offset from v3
				positions[2 * ((index + 2) % (4 * vertices.length))] = v3[0] + n2[0] * halfThickness;
				positions[2 * ((index + 2) % (4 * vertices.length)) + 1] = v3[1] + n2[1] * halfThickness;
				positions[2 * ((index + 2) % (4 * vertices.length)) + 2] = v3[0] - n2[0] * halfThickness;
				positions[2 * ((index + 2) % (4 * vertices.length)) + 3] = v3[1] - n2[1] * halfThickness;
				if (uvs) {
					uvs[2 * ((index + 2) % (4 * vertices.length))] = u;
					uvs[2 * ((index + 2) % (4 * vertices.length)) + 1] = 1;
					uvs[2 * ((index + 2) % (4 * vertices.length)) + 2] = u;
					uvs[2 * ((index + 2) % (4 * vertices.length)) + 3] = 0;
				}
				if (normals) {
					normals[2 * ((index + 2) % (4 * vertices.length))] = n2[0];
					normals[2 * ((index + 2) % (4 * vertices.length)) + 1] = n2[1];
					normals[2 * ((index + 2) % (4 * vertices.length)) + 2] = n2[0];
					normals[2 * ((index + 2) % (4 * vertices.length)) + 3] = n2[1];
				}

				// Check the angle between adjacent segments.
				const cross = n1[0] * n2[1] - n1[1] * n2[0];
				if (Math.abs(cross) < 1e-6) continue;
				n3[0] = n1[0] + n2[0];
				n3[1] = n1[1] + n2[1];
				const length3 = Math.sqrt(n3[0] * n3[0] + n3[1] * n3[1]);
				n3[0] /= length3;
				n3[1] /= length3;
				// Make adjustments to positions.
				const angle = Math.acos(n1[0] * n2[0] + n1[1] * n2[1]);
				const offset = halfThickness / Math.cos(angle / 2);
				if (cross < 0) {
					positions[2 * index] = v2[0] + n3[0] * offset;
					positions[2 * index + 1] = v2[1] + n3[1] * offset;
					positions[2 * ((index + 2) % (4 * vertices.length))] = positions[2 * index];
					positions[2 * ((index + 2) % (4 * vertices.length)) + 1] = positions[2 * index + 1];
				} else {
					positions[2 * index + 2] = v2[0] - n3[0] * offset;
					positions[2 * index + 3] = v2[1] - n3[1] * offset;
					positions[2 * ((index + 2) % (4 * vertices.length)) + 2] = positions[2 * index + 2];
					positions[2 * ((index + 2) % (4 * vertices.length)) + 3] = positions[2 * index + 3];
				}
			}
		}
		if (closeLoop) {
			// Duplicate starting points to end of positions array.
			positions[vertices.length * 8] = positions[0];
			positions[vertices.length * 8 + 1] = positions[1];
			positions[vertices.length * 8 + 2] = positions[2];
			positions[vertices.length * 8 + 3] = positions[3];
			if (uvs) {
				uvs[vertices.length * 8] = uvs[0];
				uvs[vertices.length * 8 + 1] = uvs[1];
				uvs[vertices.length * 8 + 2] = uvs[2];
				uvs[vertices.length * 8 + 3] = uvs[3];
			}
			if (normals) {
				normals[vertices.length * 8] = normals[0];
				normals[vertices.length * 8 + 1] = normals[1];
				normals[vertices.length * 8 + 2] = normals[2];
				normals[vertices.length * 8 + 3] = normals[3];
			}
		}

		const vertexShaderOptions: CompileTimeVars = {};
		if (uvs) vertexShaderOptions[GPUIO_VS_UV_ATTRIBUTE] = '1';
		if (normals) vertexShaderOptions[GPUIO_VS_NORMAL_ATTRIBUTE] = '1';

		// Do setup - this must come first.
		const glProgram = this._drawSetup(program, DEFAULT_PROGRAM_NAME, vertexShaderOptions, false, input, output);

		// Update uniforms and buffers.
		program._setVertexUniform(glProgram, 'u_gpuio_scale', [2 / _width, 2 / _height], FLOAT);
		program._setVertexUniform(glProgram, 'u_gpuio_translation', [-1, -1], FLOAT);
		// Init positions buffer.
		gl.bindBuffer(gl.ARRAY_BUFFER, this._initVertexBuffer(positions)!);
		this._setPositionAttribute(glProgram, program.name);
		if (uvs) {
			// Init uv buffer.
			gl.bindBuffer(gl.ARRAY_BUFFER, this._initVertexBuffer(uvs)!);
			this._setUVAttribute(glProgram, program.name);
		}
		if (normals) {
			// Init normals buffer.
			gl.bindBuffer(gl.ARRAY_BUFFER, this._initVertexBuffer(normals)!);
			this._setVertexAttribute(glProgram, 'a_gpuio_normal', 2, program.name);
		}

		// Draw.
		this._setBlendMode(params.shouldBlendAlpha);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, numPositions);
		gl.disable(gl.BLEND);
	}

	stepTriangleStrip(
		params: {
			program: GPUProgram,
			positions: Float32Array,
			normals?: Float32Array,
			uvs?: Float32Array,
			input?: (GPULayer | GPULayerState)[] | GPULayer | GPULayerState,
			output?: GPULayer, // Undefined renders to screen.
			count?: number,
			shouldBlendAlpha?: boolean,
		},
	) {

		const { program, input, output, positions, uvs, normals } = params;
		const { gl, _width, _height } = this;

		const vertexShaderOptions: CompileTimeVars = {};
		if (uvs) vertexShaderOptions[GPUIO_VS_UV_ATTRIBUTE] = '1';
		if (normals) vertexShaderOptions[GPUIO_VS_NORMAL_ATTRIBUTE] = '1';

		// Do setup - this must come first.
		const glProgram = this._drawSetup(program, DEFAULT_PROGRAM_NAME, vertexShaderOptions, false, input, output);

		// Update uniforms and buffers.
		program._setVertexUniform(glProgram, 'u_gpuio_scale', [2 / _width, 2 / _height], FLOAT);
		program._setVertexUniform(glProgram, 'u_gpuio_translation', [-1, -1], FLOAT);
		// Init positions buffer.
		gl.bindBuffer(gl.ARRAY_BUFFER, this._initVertexBuffer(positions)!);
		this._setPositionAttribute(glProgram, program.name);
		if (uvs) {
			// Init uv buffer.
			gl.bindBuffer(gl.ARRAY_BUFFER, this._initVertexBuffer(uvs)!);
			this._setUVAttribute(glProgram, program.name);
		}
		if (normals) {
			// Init normals buffer.
			gl.bindBuffer(gl.ARRAY_BUFFER, this._initVertexBuffer(normals)!);
			this._setVertexAttribute(glProgram, 'a_gpuio_normal', 2, program.name);
		}

		const count = params.count ? params.count : positions.length / 2;

		// Draw.
		this._setBlendMode(params.shouldBlendAlpha);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, count);
		gl.disable(gl.BLEND);
	}

	stepLines(params: {
		program: GPUProgram,
		positions: Float32Array,
		indices?: Uint16Array | Uint32Array | Int16Array | Int32Array,
		normals?: Float32Array,
		uvs?: Float32Array,
		input?: (GPULayer | GPULayerState)[] | GPULayer | GPULayerState,
		output?: GPULayer, // Undefined renders to screen.
		count?: number,
		closeLoop?: boolean,
		shouldBlendAlpha?: boolean,
	}) {
		const { gl, _width, _height } = this;
		const { indices, uvs, normals, input, output, program } = params;

		// Check that params are valid.
		if (params.closeLoop && indices) {
			throw new Error(`GPUComposer.stepLines() can't be called with closeLoop == true and indices.`);
		}

		const vertexShaderOptions: CompileTimeVars = {};
		if (uvs) vertexShaderOptions[GPUIO_VS_UV_ATTRIBUTE] = '1';
		if (normals) vertexShaderOptions[GPUIO_VS_NORMAL_ATTRIBUTE] = '1';

		// Do setup - this must come first.
		const glProgram = this._drawSetup(program, DEFAULT_PROGRAM_NAME, vertexShaderOptions, false, input, output);

		const count = params.count ? params.count : (indices ? indices.length : (params.positions.length / 2));

		// Update uniforms and buffers.
		program._setVertexUniform(glProgram, 'u_gpuio_scale', [2 / _width, 2 / _height], FLOAT);
		program._setVertexUniform(glProgram, 'u_gpuio_translation', [-1, -1], FLOAT);
		if (indices) {
			// Reorder positions array to match indices.
			const positions = new Float32Array(2 * count);
			for (let i = 0; i < count; i++) {
				const index = indices[i];
				positions[2 * i] = params.positions[2 * index];
				positions[2 * i + 1] = params.positions[2 * index + 1];
			}
			gl.bindBuffer(gl.ARRAY_BUFFER, this._initVertexBuffer(positions)!);
		} else {
			gl.bindBuffer(gl.ARRAY_BUFFER, this._initVertexBuffer(params.positions)!);
		}
		this._setPositionAttribute(glProgram, program.name);
		if (uvs) {
			// Init uv buffer.
			gl.bindBuffer(gl.ARRAY_BUFFER, this._initVertexBuffer(uvs)!);
			this._setUVAttribute(glProgram, program.name);
		}
		if (normals) {
			// Init normals buffer.
			gl.bindBuffer(gl.ARRAY_BUFFER, this._initVertexBuffer(normals)!);
			this._setVertexAttribute(glProgram, 'a_gpuio_normal', 2, program.name);
		}

		// Draw.
		this._setBlendMode(params.shouldBlendAlpha);
		if (params.indices) {
			gl.drawArrays(gl.LINES, 0, count);
		} else {
			if (params.closeLoop) {
				gl.drawArrays(gl.LINE_LOOP, 0, count);
			} else {
				gl.drawArrays(gl.LINE_STRIP, 0, count);
			}
		}
		gl.disable(gl.BLEND);
	}

	drawLayerAsPoints(
		params: {
			positions: GPULayer, // Positions in units of pixels.
			program?: GPUProgram,
			input?: (GPULayer | GPULayerState)[] | GPULayer | GPULayerState,
			output?: GPULayer,
			pointSize?: number,
			count?: number,
			color?: [number, number, number],
			wrapX?: boolean,
			wrapY?: boolean,
			shouldBlendAlpha?: boolean,
		},
	) {
		const { gl, _pointIndexArray, _width, _height, glslVersion } = this;
		const { positions, output } = params;

		// Check that numPoints is valid.
		if (positions.numComponents !== 2 && positions.numComponents !== 4) {
			throw new Error(`GPUComposer.drawLayerAsPoints() must be passed a position GPULayer with either 2 or 4 components, got position GPULayer "${positions.name}" with ${positions.numComponents} components.`)
		}
		if (glslVersion === GLSL1 && positions.width * positions.height > MAX_FLOAT_INT) {
			console.warn(`Points positions array length: ${positions.width * positions.height} is longer than what is supported by GLSL1 : ${MAX_FLOAT_INT}, expect index overflow.`);
		}
		const { length } = positions;
		const count = params.count || length;
		if (count > length) {
			throw new Error(`Invalid count ${count} for position GPULayer of length ${length}.`);
		}

		let program = params.program;
		if (program === undefined) {
			program = this._setValueProgramForType(FLOAT);
			const color = params.color || [1, 0, 0]; // Default of red.
			program.setUniform('u_value', [...color, 1], FLOAT);
		}

		// Add positions to end of input if needed.
		const input = this._addLayerToInputs(positions, params.input);

		const vertexShaderOptions: CompileTimeVars = {};
		// Tell whether we are using an absolute position (2 components),
		// or position with accumulation buffer (4 components, better floating pt accuracy).
		if (positions.numComponents === 4) vertexShaderOptions[GPUIO_VS_POSITION_W_ACCUM] = '1';
		if (params.wrapX) vertexShaderOptions[GPUIO_VS_WRAP_X] = '1';
		if (params.wrapY) vertexShaderOptions[GPUIO_VS_WRAP_Y] = '1';

		// Do setup - this must come first.
		const glProgram = this._drawSetup(program, LAYER_POINTS_PROGRAM_NAME, vertexShaderOptions, false, input, output);

		// Update uniforms and buffers.
		program._setVertexUniform(glProgram, 'u_gpuio_positions', this._indexOfLayerInArray(positions, input), INT);
		program._setVertexUniform(glProgram, 'u_gpuio_scale', [1 / _width, 1 / _height], FLOAT);
		// Set default pointSize.
		const pointSize = params.pointSize || 1;
		program._setVertexUniform(glProgram, 'u_gpuio_pointSize', pointSize, FLOAT);
		const positionLayerDimensions = [positions.width, positions.height] as [number, number];
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
		this._setBlendMode(params.shouldBlendAlpha);
		gl.drawArrays(gl.POINTS, 0, count);
		gl.disable(gl.BLEND);
	}

	drawLayerAsLines(
		params: {
			positions: GPULayer,
			indices?: Float32Array | Uint16Array | Uint32Array | Int16Array | Int32Array,
			program?: GPUProgram,
			input?: (GPULayer | GPULayerState)[] | GPULayer | GPULayerState,
			output?: GPULayer,
			count?: number,
			color?: [number, number, number],
			wrapX?: boolean,
			wrapY?: boolean,
			closeLoop?: boolean,
			shouldBlendAlpha?: boolean,
		},
	) {
		const { gl, _width, _height, glslVersion } = this;
		const { positions, output } = params;

		// Check that positions is valid.
		if (positions.numComponents !== 2 && positions.numComponents !== 4) {
			throw new Error(`GPUComposer.drawLayerAsLines() must be passed a position GPULayer with either 2 or 4 components, got position GPULayer "${positions.name}" with ${positions.numComponents} components.`)
		}
		// Check that params are valid.
		if (params.closeLoop && params.indices) {
			throw new Error(`GPUComposer.drawLayerAsLines() can't be called with closeLoop == true and indices.`);
		}

		let program = params.program;
		if (program === undefined) {
			program = params.wrapX || params.wrapY ? this._getWrappedLineColorProgram() : this._setValueProgramForType(FLOAT);;
			const color = params.color || [1, 0, 0]; // Default to red.
			program.setUniform('u_value', [...color, 1], FLOAT);
		}

		// Add positionLayer to end of input if needed.
		const input = this._addLayerToInputs(positions, params.input);

		const vertexShaderOptions: CompileTimeVars = {};
		// Tell whether we are using an absolute position (2 components),
		// or position with accumulation buffer (4 components, better floating pt accuracy).
		if (positions.numComponents === 4) vertexShaderOptions[GPUIO_VS_POSITION_W_ACCUM] = '1';
		if (params.wrapX) vertexShaderOptions[GPUIO_VS_WRAP_X] = '1';
		if (params.wrapY) vertexShaderOptions[GPUIO_VS_WRAP_Y] = '1';
		vertexShaderOptions[GPUIO_VS_INDEXED_POSITIONS] = params.indices ? '1': '0';

		// Do setup - this must come first.
		const glProgram = this._drawSetup(program, LAYER_LINES_PROGRAM_NAME, vertexShaderOptions, false, input, output);

		const count = params.count ? params.count : (params.indices ? params.indices.length : positions.length);

		// Update uniforms and buffers.
		program._setVertexUniform(glProgram, 'u_gpuio_positions', this._indexOfLayerInArray(positions, input), INT);
		program._setVertexUniform(glProgram, 'u_gpuio_scale', [1 / _width, 1 / _height], FLOAT);
		const positionLayerDimensions = [positions.width, positions.height] as [number, number];
		program._setVertexUniform(glProgram, 'u_gpuio_positionsDimensions', positionLayerDimensions, FLOAT);
		// Only pass in indices if we are using indexed pts or GLSL1, otherwise we get this for free from gl_VertexID.
		if (params.indices || glslVersion === GLSL1) {
			// TODO: cache indexArray if no indices passed in.
			const indices = params.indices ? params.indices : initSequentialFloatArray(count);
			if (this._indexedLinesIndexBuffer === undefined) {
				// Have to use float32 array bc int is not supported as a vertex attribute type.
				let floatArray: Float32Array;
				if (indices.constructor !== Float32Array) {
					// Have to use float32 array bc int is not supported as a vertex attribute type.
					floatArray = new Float32Array(indices.length);
					for (let i = 0; i < count; i++) {
						floatArray[i] = indices[i];
					}
					console.warn(`Converting indices array of type ${indices.constructor} to Float32Array in GPUComposer.drawIndexedLines for WebGL compatibility, you may want to use a Float32Array to store this information so the conversion is not required.`);
				} else {
					floatArray = indices as Float32Array;
				}
				this._indexedLinesIndexBuffer = this._initVertexBuffer(floatArray);
			} else {
				gl.bindBuffer(gl.ARRAY_BUFFER, this._indexedLinesIndexBuffer!);
				// Copy buffer data.
				gl.bufferData(gl.ARRAY_BUFFER, indices, gl.STATIC_DRAW);
			}
			this._setIndexAttribute(glProgram, program.name);
		}

		// Draw.
		this._setBlendMode(params.shouldBlendAlpha);
		if (params.indices) {
			gl.drawArrays(gl.LINES, 0, count);
		} else {
			if (params.closeLoop) {
				gl.drawArrays(gl.LINE_LOOP, 0, count);
			} else {
				gl.drawArrays(gl.LINE_STRIP, 0, count);
			}
		}
		gl.disable(gl.BLEND);
	}

	drawLayerAsVectorField(
		params: {
			data: GPULayer,
			program?: GPUProgram,
			input?: (GPULayer | GPULayerState)[] | GPULayer | GPULayerState,
			output?: GPULayer,
			vectorSpacing?: number,
			vectorScale?: number,
			color?: [number, number, number],
			shouldBlendAlpha?: boolean,
		},
	) {
		const { gl, _vectorFieldIndexArray, _width, _height, glslVersion } = this;
		const { data, output } = params;

		// Check that field is valid.
		if (data.numComponents !== 2) {
			throw new Error(`GPUComposer.drawLayerAsVectorField() must be passed a fieldLayer with 2 components, got fieldLayer "${data.name}" with ${data.numComponents} components.`)
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
			program.setUniform('u_value', [...color, 1], FLOAT);
		}

		// Add data to end of input if needed.
		const input = this._addLayerToInputs(data, params.input);

		// Do setup - this must come first.
		const glProgram = this._drawSetup(program, LAYER_VECTOR_FIELD_PROGRAM_NAME, {}, false, input, output);

		// Update uniforms and buffers.
		program._setVertexUniform(glProgram, 'u_gpuio_vectors', this._indexOfLayerInArray(data, input), INT);
		// Set default scale.
		const vectorScale = params.vectorScale || 1;
		program._setVertexUniform(glProgram, 'u_gpuio_scale', [vectorScale / _width, vectorScale / _height], FLOAT);
		const vectorSpacing = params.vectorSpacing || 10;
		const spacedDimensions = [Math.floor(_width / vectorSpacing), Math.floor(_height / vectorSpacing)] as [number, number];
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
		this._setBlendMode(params.shouldBlendAlpha);
		gl.drawArrays(gl.LINES, 0, length);
		gl.disable(gl.BLEND);
	}

	drawLayerMagnitude(
		params: {
			data: GPULayer,
			input?: (GPULayer | GPULayerState)[] | GPULayer | GPULayerState,
			output?: GPULayer,
			scale?: number,
			color?: [number, number, number],
			shouldBlendAlpha?: boolean,
		},
	) {
		const { gl } = this;
		const { data, output } = params;

		const program = this._vectorMagnitudeProgramForType(data.type);
		const color = params.color || [1, 0, 0]; // Default to red.
		program.setUniform('u_color', color, FLOAT);
		const scale = params.scale || 1;
		program.setUniform('u_scale', scale, FLOAT);
		program.setUniform('u_gpuio_numDimensions', data.numComponents, INT);

		// Add data to end of input if needed.
		const input = this._addLayerToInputs(data, params.input);
		// Do setup - this must come first.
		const glProgram = this._drawSetup(program, DEFAULT_PROGRAM_NAME, {}, true, input, output);

		// Update uniforms and buffers.
		program._setVertexUniform(glProgram, 'u_gpuio_data', this._indexOfLayerInArray(data, input), INT);
		program._setVertexUniform(glProgram, 'u_gpuio_scale', [1, 1], FLOAT);
		program._setVertexUniform(glProgram, 'u_gpuio_translation', [0, 0], FLOAT);
		gl.bindBuffer(gl.ARRAY_BUFFER, this._getQuadPositionsBuffer());
		this._setPositionAttribute(glProgram, program.name);

		// Draw.
		this._setBlendMode(params.shouldBlendAlpha);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
		gl.disable(gl.BLEND);
	}

	resetThreeState() {
		if (!this._renderer) {
			throw new Error('GPUComposer was not inited with a renderer, use GPUComposer.initWithThreeRenderer() to initialize GPUComposer instead.');
		}
		const { gl } = this;
		// Reset viewport.
		const viewport = this._renderer.getViewport(new utils.Vector4() as Vector4);
		gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height);
		// Unbind framebuffer (render to screen).
		this._renderer.setRenderTarget(null);
		// Reset texture bindings.
		this._renderer.resetState();
	}

	/**
	 * Save the current state of the canvas to png.
	 * @param params - PNG parameters.
	 * @param params.filename - PNG filename (no extension).
	 * @param params.dpi - PNG dpi (defaults to 72dpi).
	 * @param params.callback - Optional callback when Blob is ready, default behavior saves the PNG using FileSaver.js. 
	*/
	savePNG(params: {
		filename?: string,
		dpi?: number,
		multiplier?: number,
		callback?: (blob: Blob, filename: string) => void,
	} = {}) {
		const { canvas } = this;
		const filename = params.filename || 'output';
		const callback = params.callback || saveAs; // Default to saving the image with FileSaver.
		canvas.toBlob((blob) => {
			if (!blob) {
				console.warn(`Problem saving PNG from GPULayer "${name}", unable to init blob.`);
				return;
			}
			if (params.dpi) {
				changeDpiBlob(blob, params.dpi).then((blob: Blob) =>{
					callback(blob, `${filename}.png`);
				});
			} else {
				callback(blob, `${filename}.png`);
			}
		}, 'image/png');
	}

	tick() {
		let { _lastTickTime, _lastTickFPS } = this;
		const currentTime = performance.now();
		this._lastTickTime = currentTime;
		if (!_lastTickTime) {
			return { fps: 0, milliseconds: 0 };
		}
		const currentFPS = 1000 / (currentTime - _lastTickTime);
		if (!_lastTickFPS) _lastTickFPS = currentFPS;
		// Use a low pass filter to smooth out fps reading.
		const factor = 0.9;
		const fps =  Number.parseFloat((factor * _lastTickFPS + (1 - factor) * currentFPS).toFixed(1));
		this._lastTickFPS = fps;
		this._numTicks += 1;
		return {
			fps,
			numTicks: this._numTicks,
		}
	}
	
	dispose() {
		const {
			gl, verboseLogging,
			_vertexShaders,
			_copyPrograms, _setValuePrograms, _vectorMagnitudePrograms,
		} = this;

		if (verboseLogging) console.log(`Deallocating GPUComposer.`);

		// TODO: delete buffers.

		// Delete vertex shaders.
		Object.values(_vertexShaders).forEach(({ compiledShaders })=> {
			Object.keys(compiledShaders).forEach(key => {
				gl.deleteShader(compiledShaders[key]);
				delete compiledShaders[key];
			});
		});
		
		// Delete fragment shaders.
		Object.values(_copyPrograms).forEach(program => {
			// @ts-ignore
			if ((program as GPUProgram).dispose) (program as GPUProgram).dispose();
		});
		Object.keys(_copyPrograms).forEach(key => {
			// @ts-ignore
			delete _copyPrograms[key];
		});
		Object.values(_setValuePrograms).forEach(program => {
			// @ts-ignore
			if ((program as GPUProgram).dispose) (program as GPUProgram).dispose();
		});
		Object.keys(_setValuePrograms).forEach(key => {
			// @ts-ignore
			delete _setValuePrograms[key];
		});
		Object.values(_vectorMagnitudePrograms).forEach(program => {
			// @ts-ignore
			if ((program as GPUProgram).dispose) (program as GPUProgram).dispose();
		});
		Object.keys(_vectorMagnitudePrograms).forEach(key => {
			// @ts-ignore
			delete _vectorMagnitudePrograms[key];
		});
		this._wrappedLineColorProgram?.dispose();
		delete this._wrappedLineColorProgram;

		// @ts-ignore
		delete this._renderer;
		// @ts-ignore
		delete this.gl;
		// @ts-ignore;
		delete this.canvas;
		// GL context will be garbage collected by webgl.
	}
}