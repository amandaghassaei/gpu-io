import { saveAs } from 'file-saver';
// @ts-ignore
import { changeDpiBlob } from 'changedpi';
import { DataLayer } from './DataLayer';
import {
	DataLayerArrayType, DataLayerFilterType, DataLayerNumComponents, DataLayerType, DataLayerWrapType,
	FLOAT, HALF_FLOAT, UNSIGNED_BYTE, BYTE, UNSIGNED_SHORT, SHORT, UNSIGNED_INT, INT,
	UniformDataType, UniformValueType, GLSLVersion, GLSL1, GLSL3, CLAMP_TO_EDGE, TextureFormatType, NEAREST, RGBA, TextureDataType,
} from './Constants';
import { GPUProgram } from './GPUProgram';
import { WebGLRenderer, Texture, Vector4 } from 'three';// Just importing the types here.
import * as utils from './utils/Vector4';
import { isWebGL2, isPowerOf2 } from './utils';
import { getFloat16 } from '@petamoriken/float16';
import {
	isArray,
	isString, isValidFilterType, isValidTextureDataType, isValidTextureFormatType, isValidWrapType,
	validFilterTypes, validTextureDataTypes, validTextureFormatTypes, validWrapTypes } from './Checks';

const DEFAULT_CIRCLE_NUM_SEGMENTS = 18;// Must be divisible by 6 to work with stepSegment().

type ErrorCallback = (message: string) => void;

export class WebGLCompute {
	readonly gl!: WebGLRenderingContext | WebGL2RenderingContext;
	readonly glslVersion!: GLSLVersion;
	// These width and height are the current canvas at full res.
	private width!: number;
	private height!: number;

	private errorState = false;
	private readonly errorCallback: ErrorCallback;

	// Save threejs renderer if passed in.
	private renderer?: WebGLRenderer;
	private readonly maxNumTextures!: number;
	
	// Precomputed buffers (inited as needed).
	private _quadPositionsBuffer?: WebGLBuffer;
	private _boundaryPositionsBuffer?: WebGLBuffer;
	// Store multiple circle positions buffers for various num segments, use numSegments as key.
	private _circlePositionsBuffer: { [key: number]: WebGLBuffer } = {};

	private pointIndexArray?: Float32Array;
	private pointIndexBuffer?: WebGLBuffer;
	private vectorFieldIndexArray?: Float32Array;
	private vectorFieldIndexBuffer?: WebGLBuffer;
	private indexedLinesIndexBuffer?: WebGLBuffer;

	// Programs for copying data (these are needed for rendering partial screen geometries).
	private readonly copyFloatProgram!: GPUProgram;
	private readonly copyIntProgram!: GPUProgram;
	private readonly copyUintProgram!: GPUProgram;

	// Other util programs.
	private _singleColorProgram?: GPUProgram;
	private _singleColorWithWrapCheckProgram?: GPUProgram;

	static initWithThreeRenderer(
		renderer: WebGLRenderer,
		params: {
			glslVersion?: GLSLVersion,
		},
		errorCallback?: ErrorCallback,
	) {
		return new WebGLCompute(
			{
				canvas: renderer.domElement,
				context: renderer.getContext(),
				...params,
			},
			errorCallback,
			renderer,
		);
	}

	constructor(
		params: {
			canvas: HTMLCanvasElement,
			context?: WebGLRenderingContext | WebGL2RenderingContext | null,
			antialias?: boolean,
			glslVersion?: GLSLVersion,
		},
		// Optionally pass in an error callback in case we want to handle errors related to webgl support.
		// e.g. throw up a modal telling user this will not work on their device.
		errorCallback: ErrorCallback = (message: string) => { throw new Error(message) },
		renderer?: WebGLRenderer,
	) {
		// Check params.
		const validKeys = ['canvas', 'context', 'antialias', 'glslVersion'];
		Object.keys(params).forEach(key => {
			if (validKeys.indexOf(key) < 0) {
				throw new Error(`Invalid key ${key} passed to WebGLCompute.constructor.  Valid keys are ${validKeys.join(', ')}.`);
			}
		});
		// Save callback in case we run into an error.
		const self = this;
		this.errorCallback = (message: string) => {
			if (self.errorState) {
				return;
			}
			self.errorState = true;
			errorCallback(message);
		}

		const { canvas } = params;
		let gl = params.context;

		// Init GL.
		if (!gl) {
			const options: any = {};
			if (params.antialias !== undefined) options.antialias = params.antialias;
			// Init a gl context if not passed in.
			gl = canvas.getContext('webgl2', options)  as WebGL2RenderingContext | null
				|| canvas.getContext('webgl', options)  as WebGLRenderingContext | null
				|| canvas.getContext('experimental-webgl', options)  as WebGLRenderingContext | null;
			if (gl === null) {
				this.errorCallback('Unable to initialize WebGL context.');
				return;
			}
		}
		if (isWebGL2(gl)) {
			console.log('Using WebGL 2.0 context.');
		} else {
			console.log('Using WebGL 1.0 context.');
		}
		this.gl = gl;
		this.renderer = renderer;

		// Save glsl version, default to 1.x.
		const glslVersion = params.glslVersion === undefined ? GLSL1 : params.glslVersion;
		this.glslVersion = glslVersion;
		if (!isWebGL2(gl) && glslVersion === GLSL3) {
			console.warn('GLSL3.x is incompatible with WebGL1.0 contexts.');
		}

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

		// Init programs to pass values from one texture to another.
		this.copyFloatProgram = this.initProgram({
			name: 'copyFloat',
			fragmentShader: glslVersion === GLSL3 ? require('./glsl_3/CopyFloatFragShader.glsl') : require('./glsl_1/CopyFragShader.glsl'),
			uniforms: [
					{
						name: 'u_state',
						value: 0,
						dataType: INT,
					},
				],
			},
		);
		if (glslVersion === GLSL3) {
			this.copyIntProgram = this.initProgram({
				name: 'copyInt',
				fragmentShader: require('./glsl_3/CopyIntFragShader.glsl'),
				uniforms: [
						{
							name: 'u_state',
							value: 0,
							dataType: INT,
						},
					],
				},
			);
			this.copyUintProgram = this.initProgram({
				name: 'copyUint',
				fragmentShader: require('./glsl_3/CopyUintFragShader.glsl'),
				uniforms: [
						{
							name: 'u_state',
							value: 0,
							dataType: INT,
						},
					],
				},
			);
		} else {
			this.copyIntProgram = this.copyFloatProgram;
			this.copyUintProgram = this.copyFloatProgram;
		}

		// Unbind active buffer.
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		// Canvas setup.
		this.onResize(canvas);

		// Log number of textures available.
		this.maxNumTextures = this.gl.getParameter(this.gl.MAX_TEXTURE_IMAGE_UNITS);
		console.log(`${this.maxNumTextures} textures max.`);
	}

	private get singleColorProgram() {
		if (this._singleColorProgram === undefined) {
			const program = this.initProgram({
				name: 'singleColor',
				fragmentShader: this.glslVersion === GLSL3 ? require('./glsl_3/SingleColorFragShader.glsl') : require('./glsl_1/SingleColorFragShader.glsl'),
			});
			this._singleColorProgram = program;
		}
		return this._singleColorProgram;
	}

	private get singleColorWithWrapCheckProgram() {
		if (this._singleColorWithWrapCheckProgram === undefined) {
			const program = this.initProgram({
				name: 'singleColorWithWrapCheck',
				fragmentShader: this.glslVersion === GLSL3 ? require('./glsl_3/SingleColorWithWrapCheckFragShader.glsl') : require('./glsl_1/SingleColorWithWrapCheckFragShader.glsl'),
			});
			this._singleColorWithWrapCheckProgram = program;
		}
		return this._singleColorWithWrapCheckProgram;
	}

	isWebGL2() {
		return isWebGL2(this.gl);
	}

	private get quadPositionsBuffer() {
		if (this._quadPositionsBuffer === undefined) {
			const fsQuadPositions = new Float32Array([ -1, -1, 1, -1, -1, 1, 1, 1 ]);
			this._quadPositionsBuffer = this.initVertexBuffer(fsQuadPositions)!;
		}
		return this._quadPositionsBuffer!;
	}

	private get boundaryPositionsBuffer() {
		if (this._boundaryPositionsBuffer === undefined) {
			const boundaryPositions = new Float32Array([ -1, -1, 1, -1, 1, 1, -1, 1, -1, -1 ]);
			this._boundaryPositionsBuffer = this.initVertexBuffer(boundaryPositions)!;
		}
		return this._boundaryPositionsBuffer!;
	}

	private getCirclePositionsBuffer(numSegments: number) {
		if (this._circlePositionsBuffer[numSegments] == undefined) {
			const unitCirclePoints = [0, 0];
			for (let i = 0; i <= numSegments; i++) {
				unitCirclePoints.push(
					Math.cos(2 * Math.PI * i / numSegments),
					Math.sin(2 * Math.PI * i / numSegments),
				);
			}
			const circlePositions = new Float32Array(unitCirclePoints);
			const buffer = this.initVertexBuffer(circlePositions)!;
			this._circlePositionsBuffer[numSegments] = buffer;
		}
		return this._circlePositionsBuffer[numSegments];
	}

	private initVertexBuffer(
		data: Float32Array,
	) {
		const { errorCallback, gl } = this;
		const buffer = gl.createBuffer();
		if (!buffer) {
			errorCallback('Unable to allocate gl buffer.');
			return;
		}
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		// Add buffer data.
		gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
		return buffer;
	}

	initProgram(
		params: {
			name: string,
			fragmentShader: string | WebGLShader,
			uniforms?: {
				name: string,
				value: UniformValueType,
				dataType: UniformDataType,
			}[],
			defines?: {
				[key : string]: string,
			},
		},
	) {
		// Check params.
		const validKeys = ['name', 'fragmentShader', 'uniforms', 'defines'];
		Object.keys(params).forEach(key => {
			if (validKeys.indexOf(key) < 0) {
				throw new Error(`Invalid key ${key} passed to WebGLCompute.initProgram with name "${params.name}".  Valid keys are ${validKeys.join(', ')}.`);
			}
		});
		const { gl, errorCallback, glslVersion } = this;
		return new GPUProgram(
			{
				...params,
				gl,
				errorCallback,
				glslVersion,
			},
		);
	};

	initDataLayer(
		params: {
			name: string,
			dimensions: number | [number, number],
			type: DataLayerType,
			numComponents: DataLayerNumComponents,
			data?: DataLayerArrayType,
			filter?: DataLayerFilterType,
			wrapS?: DataLayerWrapType,
			wrapT?: DataLayerWrapType,
			writable?: boolean,
			numBuffers?: number,
		},
	) {
		// Check params.
		const validKeys = ['name', 'dimensions', 'type', 'numComponents', 'data', 'filter', 'wrapS', 'wrapT', 'writable', 'numBuffers'];
		Object.keys(params).forEach(key => {
			if (validKeys.indexOf(key) < 0) {
				throw new Error(`Invalid key ${key} passed to WebGLCompute.initDataLayer with name "${params.name}".  Valid keys are ${validKeys.join(', ')}.`);
			}
		});
		const { gl, errorCallback, glslVersion } = this;
		return new DataLayer({
			...params,
			gl,
			glslVersion,
			errorCallback,
		});
	};

	initTexture(
		params: {
			name: string,
			url: string,
			filter?: DataLayerFilterType,
			wrapS?: DataLayerWrapType,
			wrapT?: DataLayerWrapType,
			format?: TextureFormatType,
			type?: TextureDataType,
			onLoad?: (texture: WebGLTexture) => void,
		},
	) {
		// Check params.
		const validKeys = ['name', 'url', 'filter', 'wrapS', 'wrapT', 'format', 'type', 'onLoad'];
		Object.keys(params).forEach(key => {
			if (validKeys.indexOf(key) < 0) {
				throw new Error(`Invalid key ${key} passed to WebGLCompute.initTexture with name "${params.name}".  Valid keys are ${validKeys.join(', ')}.`);
			}
		});
		const { url, name } = params;
		if (!isString(url)) {
			throw new Error(`Expected WebGLCompute.initTexture params to have url of type string, got ${url} of type ${typeof url}.`)
		}
		if (!isString(name)) {
			throw new Error(`Expected WebGLCompute.initTexture params to have name of type string, got ${name} of type ${typeof name}.`)
		}

		// Get filter type, default to nearest.
		const filter = params.filter !== undefined ? params.filter : NEAREST;
		if (!isValidFilterType(filter)) {
			throw new Error(`Invalid filter: ${filter} for DataLayer "${name}", must be ${validFilterTypes.join(', ')}.`);
		}

		// Get wrap types, default to clamp to edge.
		const wrapS = params.wrapS !== undefined ? params.wrapS : CLAMP_TO_EDGE;
		if (!isValidWrapType(wrapS)) {
			throw new Error(`Invalid wrapS: ${wrapS} for DataLayer "${name}", must be ${validWrapTypes.join(', ')}.`);
		}
		const wrapT = params.wrapT !== undefined ? params.wrapT : CLAMP_TO_EDGE;
		if (!isValidWrapType(wrapT)) {
			throw new Error(`Invalid wrapT: ${wrapT} for DataLayer "${name}", must be ${validWrapTypes.join(', ')}.`);
		}

		// Get image format type, default to rgba.
		const format = params.format !== undefined ? params.format : RGBA;
		if (!isValidTextureFormatType(format)) {
			throw new Error(`Invalid format: ${format} for DataLayer "${name}", must be ${validTextureFormatTypes.join(', ')}.`);
		}

		// Get image data type, default to unsigned byte.
		const type = params.type !== undefined ? params.type : UNSIGNED_BYTE;
		if (!isValidTextureDataType(type)) {
			throw new Error(`Invalid type: ${type} for DataLayer "${name}", must be ${validTextureDataTypes.join(', ')}.`);
		}

		const { gl, errorCallback } = this;
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
			errorCallback(`Error loading image ${name}: ${e}`);
		}
		image.src = url;

		return texture;
	}

	onResize(canvas: HTMLCanvasElement) {
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		// Set correct canvas pixel size.
		// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/By_example/Canvas_size_and_WebGL
		canvas.width = width;
		canvas.height = height;
		// Save dimensions.
		this.width = width;
		this.height = height;
	};

	private drawSetup(
		program: WebGLProgram,
		fullscreenRender: boolean,
		input?: (DataLayer | WebGLTexture)[] | DataLayer | WebGLTexture,
		output?: DataLayer,
	) {
		const { gl } = this;
		// Check if we are in an error state.
		if (!program) {
			return;
		}

		// CAUTION: the order of these next few lines is important.

		// Get a shallow copy of current textures.
		// This line must come before this.setOutput() as it depends on current internal state.
		const inputTextures: WebGLTexture[] = [];
		if (input) {
			if (input.constructor === WebGLTexture) {
				inputTextures.push(input as WebGLTexture);
			} else if (input.constructor === DataLayer) {
				inputTextures.push((input as DataLayer).getCurrentStateTexture());
			} else {
				for (let i = 0; i < (input as (DataLayer | WebGLTexture)[]).length; i++) {
					const layer = (input as (DataLayer | WebGLTexture)[])[i];
					// @ts-ignore
					inputTextures.push((layer as DataLayer).getCurrentStateTexture ? (layer as DataLayer).getCurrentStateTexture() : layer as WebGLTexture)
				}
			}
		}

		// Set output framebuffer.
		// This may modify WebGL internal state.
		this.setOutputLayer(fullscreenRender, input, output);

		// Set current program.
		gl.useProgram(program);

		// Set input textures.
		for (let i = 0; i < inputTextures.length; i++) {
			gl.activeTexture(gl.TEXTURE0 + i);
			gl.bindTexture(gl.TEXTURE_2D, inputTextures[i]);
		}
	}

	copyProgramForType(type: DataLayerType) {
		switch (type) {
			case HALF_FLOAT:
			case FLOAT:
				return this.copyFloatProgram;
			case UNSIGNED_BYTE:
			case UNSIGNED_SHORT:
			case UNSIGNED_INT:
				return this.copyUintProgram;
			case BYTE:
			case SHORT:
			case INT:
				return this.copyIntProgram;
			default:
				throw new Error(`Invalid type: ${type} passed to WebGLCompute.copyProgramForType.`);
		}
	}

	private setBlendMode(shouldBlendAlpha?: boolean) {
		const { gl } = this;
		if (shouldBlendAlpha) {
			gl.enable(gl.BLEND);
			gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		}
	}

	private addLayerToInputs(
		layer: DataLayer,
		input?:  (DataLayer | WebGLTexture)[] | DataLayer | WebGLTexture,
	) {
		// Add layer to end of input if needed.
		let _inputLayers = input;
		if (isArray(_inputLayers)) {
			const index = (_inputLayers as (DataLayer | WebGLTexture)[]).indexOf(layer);
			if (index < 0) {
				(_inputLayers as (DataLayer | WebGLTexture)[]).push(layer);
			} 
		} else {
			if (_inputLayers !== layer) {
				const previous = _inputLayers;
				_inputLayers = [];
				if (previous) (_inputLayers as (DataLayer | WebGLTexture)[]).push(previous);
				(_inputLayers as (DataLayer | WebGLTexture)[]).push(layer);
			} else {
				_inputLayers = [_inputLayers];
			}
		}
		return _inputLayers as (DataLayer | WebGLTexture)[];
	}

	private passThroughLayerDataFromInputToOutput(state: DataLayer) {
		// TODO: figure out the fastest way to copy a texture.
		const copyProgram = this.copyProgramForType(state.internalType);
		this.step({
			program: copyProgram,
			input: state,
			output: state,
		});
	}

	private setOutputLayer(
		fullscreenRender: boolean,
		input?: (DataLayer | WebGLTexture)[] | DataLayer | WebGLTexture,
		output?: DataLayer, // Undefined renders to screen.
	) {
		const { gl } = this;

		// Render to screen.
		if (!output) {
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			// Resize viewport.
			const { width, height } = this;
			gl.viewport(0, 0, width, height);
			return;
		}

		// Check if output is same as one of input layers.
		if (input && ((input === output) || (isArray(input) && (input as (DataLayer | WebGLTexture)[]).indexOf(output) > -1))) {
			if (output.numBuffers === 1) {
				throw new Error('Cannot use same buffer for input and output of a program. Try increasing the number of buffers in your output layer to at least 2 so you can render to nextState using currentState as an input.');
			}
			if (fullscreenRender) {
				// Render and increment buffer so we are rendering to a different target
				// than the input texture.
				output._bindOutputBufferForWrite(true);
			} else {
				// Pass input texture through to output.
				this.passThroughLayerDataFromInputToOutput(output);
				// Render to output without incrementing buffer.
				output._bindOutputBufferForWrite(false);
			}
		} else {
			if (fullscreenRender) {
				// Render to current buffer.
				output._bindOutputBufferForWrite(false);
			} else {
				// If we are doing a sneaky thing with a swapped texture and are
				// only rendering part of the screen, we may need to add a copy operation.
				if (output._usingTextureOverrideForCurrentBuffer()) {
					this.passThroughLayerDataFromInputToOutput(output);
				}
				output._bindOutputBufferForWrite(false);
			}
		}
		
		// Resize viewport.
		const [ width, height ] = output.getDimensions();
		gl.viewport(0, 0, width, height);
	};

	private setPositionAttribute(program: WebGLProgram, programName: string) {
		this.setVertexAttribute(program, 'a_internal_position', 2, programName);
	}

	private setIndexAttribute(program: WebGLProgram, programName: string) {
		this.setVertexAttribute(program, 'a_internal_index', 1, programName);
	}

	private setUVAttribute(program: WebGLProgram, programName: string) {
		this.setVertexAttribute(program, 'a_internal_uv', 2, programName);
	}

	private setVertexAttribute(program: WebGLProgram, name: string, size: number, programName: string) {
		const { gl } = this;
		// Point attribute to the currently bound VBO.
		const location = gl.getAttribLocation(program, name);
		if (location < 0) {
			throw new Error(`Unable to find vertex attribute "${name}" in program "${programName}".`);
		}
		// TODO: only float is supported for vertex attributes.
		gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
		// Enable the attribute.
		gl.enableVertexAttribArray(location);
	}

	// Step for entire fullscreen quad.
	step(
		params: {
			program: GPUProgram,
			input?:  (DataLayer | WebGLTexture)[] | DataLayer | WebGLTexture,
			output?: DataLayer, // Undefined renders to screen.
			shouldBlendAlpha?: boolean,
		},
	) {
		const { gl, errorState, quadPositionsBuffer } = this;
		const { program, input, output } = params;

		// Ignore if we are in error state.
		if (errorState) {
			return;
		}

		const glProgram = program.defaultProgram!;

		// Do setup - this must come first.
		this.drawSetup(program.defaultProgram!, true, input, output);

		// Update uniforms and buffers.
		program.setVertexUniform(glProgram, 'u_internal_scale', [1, 1], FLOAT);
		program.setVertexUniform(glProgram, 'u_internal_translation', [0, 0], FLOAT);
		gl.bindBuffer(gl.ARRAY_BUFFER, quadPositionsBuffer);
		this.setPositionAttribute(glProgram, program.name);

		// Draw.
		this.setBlendMode(params.shouldBlendAlpha);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
		gl.disable(gl.BLEND);
	}

	// Step program only for a strip of px along the boundary.
	stepBoundary(
		params: {
			program: GPUProgram,
			input?:  (DataLayer | WebGLTexture)[] | DataLayer | WebGLTexture,
			output?: DataLayer, // Undefined renders to screen.
			singleEdge?: 'LEFT' | 'RIGHT' | 'TOP' | 'BOTTOM';
			shouldBlendAlpha?: boolean,
		},
	) {
		const { gl, errorState, boundaryPositionsBuffer} = this;
		const { program, input, output } = params;
		const [ width, height ] = output ? output.getDimensions() : [ this.width, this.height ];

		// Ignore if we are in error state.
		if (errorState) {
			return;
		}

		const glProgram = program.defaultProgram!;

		// Do setup - this must come first.
		this.drawSetup(glProgram, false, input, output);

		// Update uniforms and buffers.
		// Frame needs to be offset and scaled so that all four sides are in viewport.
		const onePx = [ 1 / width, 1 / height] as [number, number];
		program.setVertexUniform(glProgram, 'u_internal_scale', [1 - onePx[0], 1 - onePx[1]], FLOAT);
		program.setVertexUniform(glProgram, 'u_internal_translation', onePx, FLOAT);
		gl.bindBuffer(gl.ARRAY_BUFFER, boundaryPositionsBuffer);
		this.setPositionAttribute(glProgram, program.name);

		// Draw.
		this.setBlendMode(params.shouldBlendAlpha);
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
			input?:  (DataLayer | WebGLTexture)[] | DataLayer | WebGLTexture,
			output?: DataLayer, // Undefined renders to screen.
			shouldBlendAlpha?: boolean,
		},
	) {
		const { gl, errorState, quadPositionsBuffer } = this;
		const { program, input, output } = params;
		const [ width, height ] = output ? output.getDimensions() : [ this.width, this.height ];

		// Ignore if we are in error state.
		if (errorState) {
			return;
		}

		const glProgram = program.defaultProgram!;

		// Do setup - this must come first.
		this.drawSetup(glProgram, false, input, output);

		// Update uniforms and buffers.
		const onePx = [ 1 / width, 1 / height] as [number, number];
		program.setVertexUniform(glProgram, 'u_internal_scale', [1 - 2 * onePx[0], 1 - 2 * onePx[1]], FLOAT);
		program.setVertexUniform(glProgram, 'u_internal_translation', onePx, FLOAT);
		gl.bindBuffer(gl.ARRAY_BUFFER, quadPositionsBuffer);
		this.setPositionAttribute(glProgram, program.name);
		
		// Draw.
		this.setBlendMode(params.shouldBlendAlpha);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
		gl.disable(gl.BLEND);
	}

	// Step program only for a circular spot.
	stepCircle(
		params: {
			program: GPUProgram,
			position: [number, number], // Position is in screen space coords.
			radius: number, // Radius is in screen space units.
			input?:  (DataLayer | WebGLTexture)[] | DataLayer | WebGLTexture,
			output?: DataLayer, // Undefined renders to screen.
			numSegments?: number,
			shouldBlendAlpha?: boolean,
		},
	) {
		const { gl, errorState, width, height } = this;
		const { program, position, radius, input, output } = params;

		// Ignore if we are in error state.
		if (errorState) {
			return;
		}

		const glProgram = program.defaultProgram!;

		// Do setup - this must come first.
		this.drawSetup(glProgram, false, input, output);

		// Update uniforms and buffers.
		program.setVertexUniform(glProgram, 'u_internal_scale', [radius * 2 / width, radius * 2 / height], FLOAT);
		program.setVertexUniform(glProgram, 'u_internal_translation', [2 * position[0] / width - 1, 2 * position[1] / height - 1], FLOAT);
		const numSegments = params.numSegments ? params.numSegments : DEFAULT_CIRCLE_NUM_SEGMENTS;
		if (numSegments < 3) {
			throw new Error(`numSegments for WebGLCompute.stepCircle must be greater than 2, got ${numSegments}.`);
		}
		gl.bindBuffer(gl.ARRAY_BUFFER, this.getCirclePositionsBuffer(numSegments));
		this.setPositionAttribute(glProgram, program.name);
		
		// Draw.
		this.setBlendMode(params.shouldBlendAlpha);
		gl.drawArrays(gl.TRIANGLE_FAN, 0, numSegments + 2);	
		gl.disable(gl.BLEND);
	}

	// Step program only for a thickened line segment (rounded end caps available).
	stepSegment(
		params: {
			program: GPUProgram,
			position1: [number, number], // Position is in screen space coords.
			position2: [number, number], // Position is in screen space coords.
			thickness: number, // Thickness is in px.
			input?:  (DataLayer | WebGLTexture)[] | DataLayer | WebGLTexture,
			output?: DataLayer, // Undefined renders to screen.
			endCaps?: boolean,
			numCapSegments?: number,
			shouldBlendAlpha?: boolean,
		},
	) {
		const { gl, errorState } = this;
		const { program, position1, position2, thickness, input, output } = params;
		const [ width, height ] = output ? output.getDimensions() : [ this.width, this.height ];

		// Ignore if we are in error state.
		if (errorState) {
			return;
		}

		const glProgram = program.segmentProgram!;

		// Do setup - this must come first.
		this.drawSetup(glProgram, false, input, output);

		// Update uniforms and buffers.
		program.setVertexUniform(glProgram, 'u_internal_halfThickness', thickness / 2, FLOAT);
		program.setVertexUniform(glProgram, 'u_internal_scale', [2 / width, 2 / height], FLOAT);
		const diffX = position1[0] - position2[0];
		const diffY = position1[1] - position2[1];
		const angle = Math.atan2(diffY, diffX);
		program.setVertexUniform(glProgram, 'u_internal_rotation', angle, FLOAT);
		const centerX = (position1[0] + position2[0]) / 2;
		const centerY = (position1[1] + position2[1]) / 2;
		program.setVertexUniform(glProgram, 'u_internal_translation', [2 * centerX / this.width - 1, 2 * centerY / this.height - 1], FLOAT);
		const length = Math.sqrt(diffX * diffX + diffY * diffY);
		
		const numSegments = params.numCapSegments ? params.numCapSegments * 2 : DEFAULT_CIRCLE_NUM_SEGMENTS;
		if (params.endCaps) {
			if (numSegments < 6 || numSegments % 6 !== 0) {
				throw new Error(`numSegments for WebGLCompute.stepSegment must be divisible by 6, got ${numSegments}.`);
			}
			// Have to subtract a small offset from length.
			program.setVertexUniform(glProgram, 'u_internal_length', length - thickness * Math.sin(Math.PI / numSegments), FLOAT);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.getCirclePositionsBuffer(numSegments));
		} else {
			// Have to subtract a small offset from length.
			program.setVertexUniform(glProgram, 'u_internal_length', length - thickness, FLOAT);
			// Use a rectangle in case of no caps.
			gl.bindBuffer(gl.ARRAY_BUFFER, this.quadPositionsBuffer);
		}

		this.setPositionAttribute(glProgram, program.name);
		
		// Draw.
		this.setBlendMode(params.shouldBlendAlpha);
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
			thickness: number, // Thickness of line is in px.
			input?: (DataLayer | WebGLTexture)[] | DataLayer | WebGLTexture,
			output?: DataLayer, // Undefined renders to screen.
			closeLoop?: boolean,
			// includeUVs?: boolean,
			// includeNormals?: boolean,
			shouldBlendAlpha?: boolean,
		},
	) {
		const { program, input, output } = params;
		const vertices = params.positions;
		const closeLoop = !!params.closeLoop;
		const halfThickness = params.thickness / 2;
		const { gl, width, height, errorState } = this;

		// Ignore if we are in error state.
		if (errorState) {
			return;
		}

		// Offset vertices.
		const numPositions = closeLoop ? vertices.length * 4 + 2 : (vertices.length - 1) * 4;
		const positions = new Float32Array(2 * numPositions);
		// const uvs = params.includeUVs ? new Float32Array(2 * numPositions) : undefined;
		// const normals = params.includeNormals ? new Float32Array(2 * numPositions) : undefined;
		const uvs = new Float32Array(2 * numPositions);
		const normals = new Float32Array(2 * numPositions);

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

		const glProgram = program.polylineProgram!;

		// Do setup - this must come first.
		this.drawSetup(glProgram, false, input, output);

		// Update uniforms and buffers.
		program.setVertexUniform(glProgram, 'u_internal_scale', [2 / width, 2 / height], FLOAT);
		program.setVertexUniform(glProgram, 'u_internal_translation', [-1, -1], FLOAT);
		// Init positions buffer.
		gl.bindBuffer(gl.ARRAY_BUFFER, this.initVertexBuffer(positions)!);
		this.setPositionAttribute(glProgram, program.name);
		if (uvs) {
			// Init uv buffer.
			gl.bindBuffer(gl.ARRAY_BUFFER, this.initVertexBuffer(uvs)!);
			this.setUVAttribute(glProgram, program.name);
		}
		if (normals) {
			// Init normals buffer.
			gl.bindBuffer(gl.ARRAY_BUFFER, this.initVertexBuffer(normals)!);
			this.setVertexAttribute(glProgram, 'a_internal_normal', 2, program.name);
		}

		// Draw.
		this.setBlendMode(params.shouldBlendAlpha);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, numPositions);
		gl.disable(gl.BLEND);
	}

	stepStrip(
		params: {
			program: GPUProgram,
			positions: Float32Array,
			normals: Float32Array,
			uvs: Float32Array,
			input?: (DataLayer | WebGLTexture)[] | DataLayer | WebGLTexture,
			output?: DataLayer, // Undefined renders to screen.
			count?: number,
			shouldBlendAlpha?: boolean,
		},
	) {

		const { program, input, output, positions, uvs, normals } = params;
		const { gl, width, height, errorState } = this;

		// Ignore if we are in error state.
		if (errorState) {
			return;
		}

		const glProgram = program.polylineProgram!;

		// Do setup - this must come first.
		this.drawSetup(glProgram, false, input, output);

		// Update uniforms and buffers.
		program.setVertexUniform(glProgram, 'u_internal_scale', [2 / width, 2 / height], FLOAT);
		program.setVertexUniform(glProgram, 'u_internal_translation', [-1, -1], FLOAT);
		// Init positions buffer.
		gl.bindBuffer(gl.ARRAY_BUFFER, this.initVertexBuffer(positions)!);
		this.setPositionAttribute(glProgram, program.name);
		if (uvs) {
			// Init uv buffer.
			gl.bindBuffer(gl.ARRAY_BUFFER, this.initVertexBuffer(uvs)!);
			this.setUVAttribute(glProgram, program.name);
		}
		if (normals) {
			// Init normals buffer.
			gl.bindBuffer(gl.ARRAY_BUFFER, this.initVertexBuffer(normals)!);
			this.setVertexAttribute(glProgram, 'a_internal_normal', 2, program.name);
		}

		const count = params.count ? params.count : positions.length / 2;

		// Draw.
		this.setBlendMode(params.shouldBlendAlpha);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, count);
		gl.disable(gl.BLEND);
	}

	stepPoints(
		params: {
			positions: DataLayer, // Positions in canvas px.
			program?: GPUProgram,
			input?: (DataLayer | WebGLTexture)[] | DataLayer | WebGLTexture,
			output?: DataLayer,
			pointSize?: number,
			count?: number,
			color?: [number, number, number],
			wrapX?: boolean,
			wrapY?: boolean,
			shouldBlendAlpha?: boolean,
		},
	) {
		const { gl, errorState, pointIndexArray, width, height } = this;
		const { positions, output } = params;

		// Ignore if we are in error state.
		if (errorState) {
			return;
		}

		// Check that numPoints is valid.
		if (positions.numComponents !== 2 && positions.numComponents !== 4) {
			throw new Error(`WebGLCompute.drawPoints() must be passed a position DataLayer with either 2 or 4 components, got position DataLayer "${positions.name}" with ${positions.numComponents} components.`)
		}
		const length = positions.getLength();
		const count = params.count || length;
		if (count > length) {
			throw new Error(`Invalid count ${count} for position DataLayer of length ${length}.`);
		}

		let program = params.program;
		if (program === undefined) {
			program = this.singleColorProgram;
			const color = params.color || [1, 0, 0]; // Default of red.
			program.setUniform('u_color', color, FLOAT);
		}
		const glProgram = program.pointsProgram!;

		// Add positions to end of input if needed.
		const input = this.addLayerToInputs(positions, params.input);

		// Do setup - this must come first.
		this.drawSetup(glProgram, false, input, output);

		// Update uniforms and buffers.
		program.setVertexUniform(glProgram, 'u_internal_positions', input.indexOf(positions), INT);
		program.setVertexUniform(glProgram, 'u_internal_scale', [1 / width, 1 / height], FLOAT);
		// Tell whether we are using an absolute position (2 components), or position with accumulation buffer (4 components, better floating pt accuracy).
		program.setVertexUniform(glProgram, 'u_internal_positionWithAccumulation', positions.numComponents === 4 ? 1 : 0, INT);
		// Set default pointSize.
		const pointSize = params.pointSize || 1;
		program.setVertexUniform(glProgram, 'u_internal_pointSize', pointSize, FLOAT);
		const positionLayerDimensions = positions.getDimensions();
		program.setVertexUniform(glProgram, 'u_internal_positionsDimensions', positionLayerDimensions, FLOAT);
		program.setVertexUniform(glProgram, 'u_internal_wrapX', params.wrapX ? 1 : 0, INT);
		program.setVertexUniform(glProgram, 'u_internal_wrapY', params.wrapY ? 1 : 0, INT);
		if (this.pointIndexBuffer === undefined || (pointIndexArray && pointIndexArray.length < count)) {
			// Have to use float32 array bc int is not supported as a vertex attribute type.
			const indices = new Float32Array(length);
			for (let i = 0; i < length; i++) {
				indices[i] = i;
			}
			this.pointIndexArray = indices;
			this.pointIndexBuffer = this.initVertexBuffer(indices);
		}
		gl.bindBuffer(gl.ARRAY_BUFFER, this.pointIndexBuffer!);
		this.setIndexAttribute(glProgram, program.name);

		// Draw.
		this.setBlendMode(params.shouldBlendAlpha);
		gl.drawArrays(gl.POINTS, 0, count);
		gl.disable(gl.BLEND);
	}

	drawVectorField(
		params: {
			field: DataLayer,
			program?: GPUProgram,
			input?: (DataLayer | WebGLTexture)[] | DataLayer | WebGLTexture,
			output?: DataLayer,
			vectorSpacing?: number,
			vectorScale?: number,
			color?: [number, number, number],
			shouldBlendAlpha?: boolean,
		},
	) {
		const { gl, errorState, vectorFieldIndexArray, width, height } = this;
		const { field, output } = params;

		// Ignore if we are in error state.
		if (errorState) {
			return;
		}

		// Check that field is valid.
		if (field.numComponents !== 2) {
			throw new Error(`WebGLCompute.drawVectorField() must be passed a fieldLayer with 2 components, got fieldLayer "${field.name}" with ${field.numComponents} components.`)
		}
		// Check aspect ratio.
		// const dimensions = vectorLayer.getDimensions();
		// if (Math.abs(dimensions[0] / dimensions[1] - width / height) > 0.01) {
		// 	throw new Error(`Invalid aspect ratio ${(dimensions[0] / dimensions[1]).toFixed(3)} vector DataLayer with dimensions [${dimensions[0]}, ${dimensions[1]}], expected ${(width / height).toFixed(3)}.`);
		// }

		let program = params.program;
		if (program === undefined) {
			program = this.singleColorProgram;
			const color = params.color || [1, 0, 0]; // Default to red.
			program.setUniform('u_color', color, FLOAT);
		}
		const glProgram = program.vectorFieldProgram!;

		// Add field to end of input if needed.
		const input = this.addLayerToInputs(field, params.input);

		// Do setup - this must come first.
		this.drawSetup(glProgram, false, input, output);

		// Update uniforms and buffers.
		program.setVertexUniform(glProgram, 'u_internal_vectors', input.indexOf(field), INT);
		// Set default scale.
		const vectorScale = params.vectorScale || 1;
		program.setVertexUniform(glProgram, 'u_internal_scale', [vectorScale / width, vectorScale / height], FLOAT);
		const vectorSpacing = params.vectorSpacing || 10;
		const spacedDimensions = [Math.floor(width / vectorSpacing), Math.floor(height / vectorSpacing)] as [number, number];
		program.setVertexUniform(glProgram, 'u_internal_dimensions', spacedDimensions, FLOAT);
		const length = 2 * spacedDimensions[0] * spacedDimensions[1];
		if (this.vectorFieldIndexBuffer === undefined || (vectorFieldIndexArray && vectorFieldIndexArray.length < length)) {
			// Have to use float32 array bc int is not supported as a vertex attribute type.
			const indices = new Float32Array(length);
			for (let i = 0; i < length; i++) {
				indices[i] = i;
			}
			this.vectorFieldIndexArray = indices;
			this.vectorFieldIndexBuffer = this.initVertexBuffer(indices);
		}
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vectorFieldIndexBuffer!);
		this.setIndexAttribute(glProgram, program.name);

		// Draw.
		this.setBlendMode(params.shouldBlendAlpha);
		gl.drawArrays(gl.LINES, 0, length);
		gl.disable(gl.BLEND);
	}

	drawLines(
		params: {
			positions: DataLayer,
			// TODO: add option for no indices.
			indices: Float32Array | Uint16Array | Uint32Array | Int16Array | Int32Array,
			program?: GPUProgram,
			input?: (DataLayer | WebGLTexture)[] | DataLayer | WebGLTexture,
			output?: DataLayer,
			count?: number,
			color?: [number, number, number],
			wrapX?: boolean,
			wrapY?: boolean,
			shouldBlendAlpha?: boolean,
		},
	) {
		const { gl, errorState, width, height } = this;
		const { positions, indices, output } = params;

		// Ignore if we are in error state.
		if (errorState) {
			return;
		}

		// Check that positions is valid.
		if (positions.numComponents !== 2 && positions.numComponents !== 4) {
			throw new Error(`WebGLCompute.drawIndexedLines() must be passed a position DataLayer with either 2 or 4 components, got position DataLayer "${positions.name}" with ${positions.numComponents} components.`)
		}

		let program = params.program;
		if (program === undefined) {
			program = params.wrapX || params.wrapY ? this.singleColorWithWrapCheckProgram : this.singleColorProgram;
			const color = params.color || [1, 0, 0]; // Default to red.
			program.setUniform('u_color', color, FLOAT);
		}
		const glProgram = program.indexedLinesProgram!;

		// Add positionLayer to end of input if needed.
		const input = this.addLayerToInputs(positions, params.input);

		// Do setup - this must come first.
		this.drawSetup(glProgram, false, input, output);

		const count = params.count ? params.count : indices.length;

		// Update uniforms and buffers.
		program.setVertexUniform(glProgram, 'u_internal_positions', input.indexOf(positions), INT);
		program.setVertexUniform(glProgram, 'u_internal_scale', [1 / width, 1 / height], FLOAT);
		// Tell whether we are using an absolute position (2 components), or position with accumulation buffer (4 components, better floating pt accuracy).
		program.setVertexUniform(glProgram, 'u_internal_positionWithAccumulation', positions.numComponents === 4 ? 1 : 0, INT);
		const positionLayerDimensions = positions.getDimensions();
		program.setVertexUniform(glProgram, 'u_internal_positionsDimensions', positionLayerDimensions, FLOAT);
		program.setVertexUniform(glProgram, 'u_internal_wrapX', params.wrapX ? 1 : 0, INT);
		program.setVertexUniform(glProgram, 'u_internal_wrapY', params.wrapY ? 1 : 0, INT);
		if (this.indexedLinesIndexBuffer === undefined) {
			// Have to use float32 array bc int is not supported as a vertex attribute type.
			let floatArray: Float32Array;
			if (indices.constructor !== Float32Array) {
				// Have to use float32 array bc int is not supported as a vertex attribute type.
				floatArray = new Float32Array(indices.length);
				for (let i = 0; i < count; i++) {
					floatArray[i] = indices[i];
				}
				console.warn(`Converting indices array of type ${indices.constructor} to Float32Array in WebGLCompute.drawIndexedLines for WebGL compatibility, you may want to use a Float32Array to store this information so the conversion is not required.`);
			} else {
				floatArray = indices as Float32Array;
			}
			this.indexedLinesIndexBuffer = this.initVertexBuffer(floatArray);
		} else {
			gl.bindBuffer(gl.ARRAY_BUFFER, this.indexedLinesIndexBuffer!);
			// Copy buffer data.
			gl.bufferData(gl.ARRAY_BUFFER, indices, gl.STATIC_DRAW);
		}
		this.setIndexAttribute(glProgram, program.name);

		// Draw.
		this.setBlendMode(params.shouldBlendAlpha);
		gl.drawArrays(gl.LINES, 0, count);
		gl.disable(gl.BLEND);
	}
	
	getContext() {
		return this.gl;
	}

	getValues(dataLayer: DataLayer) {
		const { gl, glslVersion } = this;

		// In case dataLayer was not the last output written to.
		dataLayer._bindOutputBuffer();

		const [ width, height ] = dataLayer.getDimensions();
		let { glNumChannels, glType, glFormat, internalType } = dataLayer;
		let values;
		switch (internalType) {
			case HALF_FLOAT:
				if (gl.FLOAT !== undefined) {
					// Firefox requires that RGBA/FLOAT is used for readPixels of float16 types.
					glNumChannels = 4;
					glFormat = gl.RGBA;
					glType = gl.FLOAT;
					values = new Float32Array(width * height * glNumChannels);
				} else {
					values = new Uint16Array(width * height * glNumChannels);
				}
				// // The following works in Chrome.
				// values = new Uint16Array(width * height * glNumChannels);
				break
			case FLOAT:
				// Chrome and Firefox require that RGBA/FLOAT is used for readPixels of float32 types.
				// https://github.com/KhronosGroup/WebGL/issues/2747
				glNumChannels = 4;
				glFormat = gl.RGBA;
				values = new Float32Array(width * height * glNumChannels);
				break;
			case UNSIGNED_BYTE:
				if (glslVersion === GLSL1) {
					// Firefox requires that RGBA/UNSIGNED_BYTE is used for readPixels of unsigned byte types.
					glNumChannels = 4;
					glFormat = gl.RGBA;
					values = new Uint8Array(width * height * glNumChannels);
					break;
				}
				// Firefox requires that RGBA_INTEGER/UNSIGNED_INT is used for readPixels of unsigned int types.
				glNumChannels = 4;
				glFormat = (gl as WebGL2RenderingContext).RGBA_INTEGER;
				glType = gl.UNSIGNED_INT;
				values = new Uint32Array(width * height * glNumChannels);
				// // The following works in Chrome.
				// values = new Uint8Array(width * height * glNumChannels);
				break;
			case UNSIGNED_SHORT:
				// Firefox requires that RGBA_INTEGER/UNSIGNED_INT is used for readPixels of unsigned int types.
				glNumChannels = 4;
				glFormat = (gl as WebGL2RenderingContext).RGBA_INTEGER;
				glType = gl.UNSIGNED_INT;
				values = new Uint32Array(width * height * glNumChannels);
				// // The following works in Chrome.
				// values = new Uint16Array(width * height * glNumChannels);
				break;
			case UNSIGNED_INT:
				// Firefox requires that RGBA_INTEGER/UNSIGNED_INT is used for readPixels of unsigned int types.
				glNumChannels = 4;
				glFormat = (gl as WebGL2RenderingContext).RGBA_INTEGER;
				values = new Uint32Array(width * height * glNumChannels);
				// // The following works in Chrome.
				// values = new Uint32Array(width * height * glNumChannels);
				break;
			case BYTE:
				// Firefox requires that RGBA_INTEGER/INT is used for readPixels of int types.
				glNumChannels = 4;
				glFormat = (gl as WebGL2RenderingContext).RGBA_INTEGER;
				glType = gl.INT;
				values = new Int32Array(width * height * glNumChannels);
				// // The following works in Chrome.
				// values = new Int8Array(width * height * glNumChannels);
				break;
			case SHORT:
				// Firefox requires that RGBA_INTEGER/INT is used for readPixels of int types.
				glNumChannels = 4;
				glFormat = (gl as WebGL2RenderingContext).RGBA_INTEGER;
				glType = gl.INT;
				values = new Int32Array(width * height * glNumChannels);
				// // The following works in Chrome.
				// values = new Int16Array(width * height * glNumChannels);
				break;
			case INT:
				// Firefox requires that RGBA_INTEGER/INT is used for readPixels of int types.
				glNumChannels = 4;
				glFormat = (gl as WebGL2RenderingContext).RGBA_INTEGER;
				values = new Int32Array(width * height * glNumChannels);
				// // The following works in Chrome.
				// values = new Int32Array(width * height * glNumChannels);
				break;
			default:
				throw new Error(`Unsupported internalType ${internalType} for getValues().`);
		}

		if (this.readyToRead()) {
			// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/readPixels
			gl.readPixels(0, 0, width, height, glFormat, glType, values);
			const { numComponents, type } = dataLayer;
			const OUTPUT_LENGTH = width * height * numComponents;

			// Convert uint16 to float32 if needed.
			const handleFloat16Conversion = internalType === HALF_FLOAT && values.constructor === Uint16Array;
			// @ts-ignore
			const view = handleFloat16Conversion ? new DataView((values as Uint16Array).buffer) : undefined;

			let output: DataLayerArrayType = values;
			
			// We may use a different internal type than the assigned type of the DataLayer.
			if (internalType !== type) {
				switch (type) {
					case HALF_FLOAT:
					case FLOAT:
						output = new Float32Array(OUTPUT_LENGTH);
						break;
					case UNSIGNED_BYTE:
						output = new Uint8Array(OUTPUT_LENGTH);
						break;
					case BYTE:
						output = new Int8Array(OUTPUT_LENGTH);
						break;
					case UNSIGNED_SHORT:
						output = new Uint16Array(OUTPUT_LENGTH);
						break;
					case SHORT:
						output = new Int16Array(OUTPUT_LENGTH);
						break;
					case UNSIGNED_INT:
						output = new Uint32Array(OUTPUT_LENGTH);
						break;
					case INT:
						output = new Int32Array(OUTPUT_LENGTH);
						break;
					default:
						throw new Error(`Unsupported type ${type} for getValues().`);
				}
			}

			// In some cases glNumChannels may be > numComponents.
			if (handleFloat16Conversion || output !== values || numComponents !== glNumChannels) {
				for (let i = 0, length = width * height; i < length; i++) {
					const index1 = i * glNumChannels;
					const index2 = i * numComponents;
					for (let j = 0; j < numComponents; j++) {
						if (handleFloat16Conversion) {
							output[index2 + j] = getFloat16(view!, 2 * (index1 + j), true);
						} else {
							output[index2 + j] = values[index1 + j];
						}
					}
				}
			}

			if (output.length !== OUTPUT_LENGTH) {
				output = output.slice(0, OUTPUT_LENGTH);
			}
			return output;
		} else {
			throw new Error(`Unable to read values from Buffer with status: ${gl.checkFramebufferStatus(gl.FRAMEBUFFER)}.`);
		}
	}

	private readyToRead() {
		const { gl } = this;
		return gl.checkFramebufferStatus(gl.FRAMEBUFFER) == gl.FRAMEBUFFER_COMPLETE;
	};

	savePNG(dataLayer: DataLayer, filename = dataLayer.name, dpi?: number) {
		const values = this.getValues(dataLayer);
		const [width, height] = dataLayer.getDimensions();

		const canvas = document.createElement('canvas');
		canvas.width = width;
    	canvas.height = height;
		const context = canvas.getContext('2d')!;
		const imageData = context.getImageData(0, 0, width, height);
		const buffer = imageData.data;
		// TODO: this isn't working for UNSIGNED_BYTE types?
		const isFloat = dataLayer.type === FLOAT || dataLayer.type === HALF_FLOAT;
		// Have to flip the y axis since PNGs are written top to bottom.
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				const index = y * width + x;
				const indexFlipped = (height - 1 - y) * width + x;
				for (let i = 0; i < dataLayer.numComponents; i++) {
					buffer[4 * indexFlipped + i] = values[dataLayer.numComponents * index + i] * (isFloat ? 255 : 1);
				}
				if (dataLayer.numComponents < 4) {
					buffer[4 * indexFlipped + 3] = 255;
				}
			}
		}
		// console.log(values, buffer);
		context.putImageData(imageData, 0, 0);

		canvas!.toBlob((blob) => {
			if (!blob) {
				console.warn('Problem saving PNG, unable to init blob.');
				return;
			}
			if (dpi) {
				changeDpiBlob(blob, dpi).then((blob: Blob) =>{
					saveAs(blob, `${filename}.png`);
				});
			} else {
				saveAs(blob, `${filename}.png`);
			}
			
		}, 'image/png');
	}

    reset() {
		// TODO: implement this.
		throw new Error('WebGLCompute.reset() not implemented.');
	};

	attachDataLayerToThreeTexture(dataLayer: DataLayer, texture: Texture) {
		if (!this.renderer) {
			throw new Error('WebGLCompute was not inited with a renderer.');
		}
		// Link webgl texture to threejs object.
		// This is not officially supported.
		if (dataLayer.numBuffers > 1) {
			throw new Error(`DataLayer "${dataLayer.name}" contains multiple WebGL textures (one for each buffer) that are flip-flopped during compute cycles, please choose a DataLayer with one buffer.`);
		}
		const offsetTextureProperties = this.renderer.properties.get(texture);
		offsetTextureProperties.__webglTexture = dataLayer.getCurrentStateTexture();
		offsetTextureProperties.__webglInit = true;
	}

	resetThreeState() {
		if (!this.renderer) {
			throw new Error('WebGLCompute was not inited with a renderer.');
		}
		const { gl } = this;
		// Reset viewport.
		const viewport = this.renderer.getViewport(new utils.Vector4() as Vector4);
		gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height);
		// Unbind framebuffer (render to screen).
		this.renderer.setRenderTarget(null);
		// Reset texture bindings.
		this.renderer.resetState();
	}
	
	destroy() {
		// TODO: Need to implement this.
		delete this.renderer;
	}
}