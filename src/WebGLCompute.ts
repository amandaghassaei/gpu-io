import { DataLayer } from './DataLayer';
import {
	DataLayerArrayType, DataLayerFilterType, DataLayerNumComponents, DataLayerType, DataLayerWrapType,
	FLOAT, HALF_FLOAT, UNSIGNED_BYTE, BYTE, UNSIGNED_SHORT, SHORT, UNSIGNED_INT, INT,
	UniformDataType, UniformValueType, GLSLVersion, GLSL1, GLSL3,
} from './Constants';
import { GPUProgram } from './GPUProgram';
import { WebGLRenderer, Texture, Vector4 } from 'three';// Just importing the types here.
import * as utils from './utils/Vector4';
import { compileShader, isWebGL2, isPowerOf2 } from './utils';
import { getFloat16 } from '@petamoriken/float16';
import { isString } from './Checks';
const defaultVertexShaderSource_glsl3 = require('./glsl_3/DefaultVertexShader.glsl');
const defaultVertexShaderSource_glsl1 = require('./glsl_1/DefaultVertexShader.glsl');
const copyFloatFragmentShaderSource_glsl3 = require('./glsl_3/CopyFloatFragShader.glsl');
const copyIntFragmentShaderSource_glsl3 = require('./glsl_3/CopyIntFragShader.glsl');
const copyUintFragmentShaderSource_glsl3 = require('./glsl_3/CopyUintFragShader.glsl');
const copyFragmentShaderSource_glsl1 = require('./glsl_1/CopyFragShader.glsl');

const fsQuadPositions = new Float32Array([ -1, -1, 1, -1, -1, 1, 1, 1 ]);
const boundaryPositions = new Float32Array([ -1, -1, 1, -1, 1, 1, -1, 1, -1, -1 ]);
const unitCirclePoints = [0, 0];
const NUM_SEGMENTS_CIRCLE = 18;// Must be divisible by 6 to work with stepSegment().
for (let i = 0; i <= NUM_SEGMENTS_CIRCLE; i++) {
	unitCirclePoints.push(
		Math.cos(2 * Math.PI * i / NUM_SEGMENTS_CIRCLE),
		Math.sin(2 * Math.PI * i / NUM_SEGMENTS_CIRCLE),
	);
}
const circlePositions = new Float32Array(unitCirclePoints);

type errorCallback = (message: string) => void;

export class WebGLCompute {
	readonly gl!: WebGLRenderingContext | WebGL2RenderingContext;
	readonly glslVersion!: GLSLVersion;
	// These width and height are the current canvas at full res.
	private width!: number;
	private height!: number;

	private errorState = false;
	private readonly errorCallback: (message: string) => void;

	// Save threejs renderer if passed in.
	private renderer?: WebGLRenderer;
	private readonly maxNumTextures!: number;
	
	// Some precomputed values.
	private readonly defaultVertexShader!: WebGLShader;
	private readonly quadPositionsBuffer!: WebGLBuffer;
	private readonly boundaryPositionsBuffer!: WebGLBuffer;
	private readonly circlePositionsBuffer!: WebGLBuffer;
	private pointIndexArray?: Float32Array;
	private pointIndexBuffer?: WebGLBuffer;
	readonly copyFloatProgram!: GPUProgram;
	readonly copyIntProgram!: GPUProgram;
	readonly copyUintProgram!: GPUProgram;

	static initWithThreeRenderer(
		renderer: WebGLRenderer,
		params: {
			glslVersion?: GLSLVersion,
		},
		errorCallback?: errorCallback,
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
		errorCallback: errorCallback = (message: string) => { throw new Error(message) },
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

		// Init a default vertex shader that just passes through screen coords.
		const vertexShaderSource = glslVersion === GLSL3 ? defaultVertexShaderSource_glsl3 : defaultVertexShaderSource_glsl1;
		const defaultVertexShader = compileShader(gl, this.errorCallback, vertexShaderSource, gl.VERTEX_SHADER);
		if (!defaultVertexShader) {
			this.errorCallback('Unable to initialize fullscreen quad vertex shader.');
			return;
		}
		this.defaultVertexShader = defaultVertexShader;

		// Init programs to pass values from one texture to another.
		this.copyFloatProgram = this.initProgram({
			name: 'copyFloat',
			fragmentShader: glslVersion === GLSL3 ? copyFloatFragmentShaderSource_glsl3 : copyFragmentShaderSource_glsl1,
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
				fragmentShader: copyIntFragmentShaderSource_glsl3,
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
				fragmentShader: copyUintFragmentShaderSource_glsl3,
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

		// Create vertex buffers.
		this.quadPositionsBuffer = this.initVertexBuffer(fsQuadPositions)!;
		this.boundaryPositionsBuffer = this.initVertexBuffer(boundaryPositions)!;
		this.circlePositionsBuffer = this.initVertexBuffer(circlePositions)!;
		// Unbind active buffer.
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		// Canvas setup.
		this.onResize(canvas);

		// Log number of textures available.
		this.maxNumTextures = this.gl.getParameter(this.gl.MAX_TEXTURE_IMAGE_UNITS);
		console.log(`${this.maxNumTextures} textures max.`);
	}

	isWebGL2() {
		return isWebGL2(this.gl);
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
			vertexShader?: string | WebGLShader,
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
		const validKeys = ['name', 'fragmentShader', 'vertexShader', 'uniforms', 'defines'];
		Object.keys(params).forEach(key => {
			if (validKeys.indexOf(key) < 0) {
				throw new Error(`Invalid key ${key} passed to WebGLCompute.initProgram.  Valid keys are ${validKeys.join(', ')}.`);
			}
		});
		const { gl, errorCallback, defaultVertexShader } = this;
		return new GPUProgram(
			{
				vertexShader: defaultVertexShader,
				...params,
				gl,
				errorCallback,
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
				throw new Error(`Invalid key ${key} passed to WebGLCompute.initDataLayer.  Valid keys are ${validKeys.join(', ')}.`);
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
		url: string,
	) {
		if (!isString(url)) {
			throw new Error(`Expected WebGLCompute.initTexture to have argument of type string, got ${url} of type ${typeof url}.`)
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
		const srcFormat = gl.RGBA;
		const srcType = gl.UNSIGNED_BYTE;
		const pixel = new Uint8Array([0, 0, 0, 255]);
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
				console.warn(`Texture ${url} dimensions [${image.width}, ${image.height}] are not power of 2.`);
				// // No, it's not a power of 2. Turn off mips and set
				// // wrapping to clamp to edge
				// gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
				// gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
				// gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			}
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		};
		image.onerror = (e) => {
			errorCallback(`Error loading image ${url}: ${e}`);
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
		program: GPUProgram,
		fullscreenRender: boolean,
		inputLayers: (DataLayer | WebGLTexture)[],
		outputLayer?: DataLayer,
	) {
		const { gl } = this;
		// Check if we are in an error state.
		if (!program.glProgram) {
			return;
		}

		// CAUTION: the order of these next few lines is important.

		// Get a shallow copy of current textures.
		// This line must come before this.setOutput() as it depends on current internal state.
		// @ts-ignore
		const inputTextures = inputLayers.map(layer => layer.getCurrentStateTexture ? (layer as DataLayer).getCurrentStateTexture() : layer);

		// Set output framebuffer.
		// This may modify WebGL internal state.
		this.setOutputLayer(fullscreenRender, inputLayers, outputLayer);

		// Set current program.
		gl.useProgram(program.glProgram);

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

	private setOutputLayer(
		fullscreenRender: boolean,
		inputLayers: (DataLayer | WebGLTexture)[],
		outputLayer?: DataLayer, // Undefined renders to screen.
	) {
		const { gl } = this;

		// Render to screen.
		if (!outputLayer) {
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			// Resize viewport.
			const { width, height } = this;
			gl.viewport(0, 0, width, height);
			return;
		}

		// Check if output is same as one of input layers.
		if (inputLayers.indexOf(outputLayer) > -1) {
			if (outputLayer.numBuffers === 1) {
				throw new Error(`
Cannot use same buffer for input and output of a program.
Try increasing the number of buffers in your output layer to at least 2 so you
can render to nextState using currentState as an input.`);
			}
			if (fullscreenRender) {
				// Render and increment buffer so we are rendering to a different target
				// than the input texture.
				outputLayer.bindOutputBuffer(true);
			} else {
				// Pass input texture through to output.
				const copyProgram = this.copyProgramForType(outputLayer.internalType);
				this.step(copyProgram, [outputLayer], outputLayer);
				// Render to output without incrementing buffer.
				outputLayer.bindOutputBuffer(false);
			}
		} else {
			// Render to current buffer.
			outputLayer.bindOutputBuffer(false);
		}
		
		// Resize viewport.
		const [ width, height ] = outputLayer.getDimensions();
		gl.viewport(0, 0, width, height);
	};

	private setPositionAttribute(program: GPUProgram) {
		const { gl } = this;
		// Point attribute to the currently bound VBO.
		const location = gl.getAttribLocation(program.glProgram!, 'a_internal_position');
		gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
		// Enable the attribute.
		gl.enableVertexAttribArray(location);
	}

	private setIndexAttribute(program: GPUProgram) {
		const { gl } = this;
		// Point attribute to the currently bound VBO.
		const location = gl.getAttribLocation(program.glProgram!, 'a_internal_index');
		gl.vertexAttribPointer(location, 1, gl.FLOAT, false, 0, 0);
		// Enable the attribute.
		gl.enableVertexAttribArray(location);
	}

	// Step for entire fullscreen quad.
	step(
		program: GPUProgram,
		inputLayers: (DataLayer | WebGLTexture)[] = [],
		outputLayer?: DataLayer, // Undefined renders to screen.
		options?: {
			shouldBlendAlpha?: boolean,
		},
	) {
		const { gl, errorState, quadPositionsBuffer } = this;

		// Ignore if we are in error state.
		if (errorState) {
			return;
		}

		// Do setup - this must come first.
		this.drawSetup(program, true, inputLayers, outputLayer);

		// Update uniforms and buffers.
		program.setUniform('u_internal_scale', [1, 1], 'FLOAT');
		program.setUniform('u_internal_translation', [0, 0], 'FLOAT');
		gl.bindBuffer(gl.ARRAY_BUFFER, quadPositionsBuffer);
		this.setPositionAttribute(program);

		// Draw.
		if (options?.shouldBlendAlpha) {
			gl.enable(gl.BLEND);
			gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		}
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
		gl.disable(gl.BLEND);
	}

	// Step program only for a strip of px along the boundary.
	stepBoundary(
		program: GPUProgram,
		inputLayers: (DataLayer | WebGLTexture)[] = [],
		outputLayer?: DataLayer, // Undefined renders to screen.
		options?: {
			shouldBlendAlpha?: boolean,
			singleEdge?: 'LEFT' | 'RIGHT' | 'TOP' | 'BOTTOM';
		},
	) {
		const { gl, errorState, boundaryPositionsBuffer} = this;

		// Ignore if we are in error state.
		if (errorState) {
			return;
		}

		// Do setup - this must come first.
		this.drawSetup(program, false, inputLayers, outputLayer);

		// Update uniforms and buffers.
		// Frame needs to be offset and scaled so that all four sides are in viewport.
		const [ width, height ] = outputLayer ? outputLayer.getDimensions() : [ this.width, this.height ];
		const onePx = [ 1 / width, 1 / height] as [number, number];
		program.setUniform('u_internal_scale', [1 - onePx[0], 1 - onePx[1]], 'FLOAT');
		program.setUniform('u_internal_translation', onePx, 'FLOAT');
		gl.bindBuffer(gl.ARRAY_BUFFER, boundaryPositionsBuffer);
		this.setPositionAttribute(program);

		// Draw.
		if (options?.shouldBlendAlpha) {
			gl.enable(gl.BLEND);
			gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		}
		if (options?.singleEdge) {
			switch(options?.singleEdge) {
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
					throw new Error(`Unknown boundary edge type: ${options?.singleEdge}.`);
			}
		} else {
			gl.drawArrays(gl.LINE_LOOP, 0, 4);
		}
		
		gl.disable(gl.BLEND);
	}

	// Step program for all but a strip of px along the boundary.
	stepNonBoundary(
		program: GPUProgram,
		inputLayers: (DataLayer | WebGLTexture)[] = [],
		outputLayer?: DataLayer, // Undefined renders to screen.
		options?: {
			shouldBlendAlpha?: boolean,
		},
	) {
		const { gl, errorState, quadPositionsBuffer } = this;

		// Ignore if we are in error state.
		if (errorState) {
			return;
		}

		// Do setup - this must come first.
		this.drawSetup(program, false, inputLayers, outputLayer);

		// Update uniforms and buffers.
		const [ width, height ] = outputLayer ? outputLayer.getDimensions() : [ this.width, this.height ];
		const onePx = [ 1 / width, 1 / height] as [number, number];
		program.setUniform('u_internal_scale', [1 - 2 * onePx[0], 1 - 2 * onePx[1]], 'FLOAT');
		program.setUniform('u_internal_translation', onePx, 'FLOAT');
		gl.bindBuffer(gl.ARRAY_BUFFER, quadPositionsBuffer);
		this.setPositionAttribute(program);
		
		// Draw.
		if (options?.shouldBlendAlpha) {
			gl.enable(gl.BLEND);
			gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		}
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
		gl.disable(gl.BLEND);
	}

	// Step program only for a circular spot.
	stepCircle(
		program: GPUProgram,
		position: [number, number], // position is in screen space coords.
		radius: number, // radius is in px.
		inputLayers: (DataLayer | WebGLTexture)[] = [],
		outputLayer?: DataLayer, // Undefined renders to screen.
		options?: {
			shouldBlendAlpha?: boolean,
		},
	) {
		const { gl, errorState, circlePositionsBuffer } = this;
		const [ width, height ] = outputLayer ? outputLayer.getDimensions() : [ this.width, this.height ];

		// Ignore if we are in error state.
		if (errorState) {
			return;
		}

		// Do setup - this must come first.
		this.drawSetup(program, false, inputLayers, outputLayer);

		// Update uniforms and buffers.
		program.setUniform('u_internal_radius', radius, 'FLOAT');
		program.setUniform('u_internal_scale', [2 / width, 2 / height], 'FLOAT');
		program.setUniform('u_internal_length', 0, 'FLOAT'); // In case we are using the segment vertex shader (TODO: fix this, we should only use the default vertex shader for step circle).
		program.setUniform('u_internal_translation', [2 * position[0] / width - 1, 2 * position[1] / height - 1], 'FLOAT');
		gl.bindBuffer(gl.ARRAY_BUFFER, circlePositionsBuffer);
		this.setPositionAttribute(program);
		
		// Draw.
		if (options?.shouldBlendAlpha) {
			gl.enable(gl.BLEND);
			gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		}
		gl.drawArrays(gl.TRIANGLE_FAN, 0, NUM_SEGMENTS_CIRCLE + 2);
		gl.disable(gl.BLEND);
	}

	// Step program only for a thickened line segments (rounded end caps).
	stepSegment(
		program: GPUProgram,
		position1: [number, number], // position is in screen space coords.
		position2: [number, number], // position is in screen space coords.
		radius: number, // radius is in px.
		inputLayers: (DataLayer | WebGLTexture)[] = [],
		outputLayer?: DataLayer, // Undefined renders to screen.
		options?: {
			shouldBlendAlpha?: boolean,
		},
	) {
		const { gl, errorState, circlePositionsBuffer } = this;
		const [ width, height ] = outputLayer ? outputLayer.getDimensions() : [ this.width, this.height ];

		// Ignore if we are in error state.
		if (errorState) {
			return;
		}

		// Do setup - this must come first.
		this.drawSetup(program, false, inputLayers, outputLayer);

		// Update uniforms and buffers.
		program.setUniform('u_internal_radius', radius, 'FLOAT');
		program.setUniform('u_internal_scale', [2 / width, 2 / height], 'FLOAT');
		const diffX = position1[0] - position2[0];
		const diffY = position1[1] - position2[1];
		const angle = Math.atan2(diffY, diffX);
		program.setUniform('u_internal_rotation', angle, 'FLOAT');
		const length = Math.sqrt(diffX * diffX + diffY * diffY);
		program.setUniform('u_internal_length', length, 'FLOAT');
		const positionX = (position1[0] + position2[0]) / 2;
		const positionY = (position1[1] + position2[1]) / 2;
		program.setUniform('u_internal_translation', [2 * positionX / width - 1, 2 * positionY / height - 1], 'FLOAT');
		gl.bindBuffer(gl.ARRAY_BUFFER, circlePositionsBuffer);
		this.setPositionAttribute(program);
		
		// Draw.
		if (options?.shouldBlendAlpha) {
			gl.enable(gl.BLEND);
			gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		}
		gl.drawArrays(gl.TRIANGLE_FAN, 0, NUM_SEGMENTS_CIRCLE + 2);
		gl.disable(gl.BLEND);
	}

	drawPoints(
		program: GPUProgram,
		inputLayers: (DataLayer | WebGLTexture)[],
		outputLayer?: DataLayer,
		options?: {
			pointSize?: number,
			numPoints?: number,
			shouldBlendAlpha?: boolean,
		}
	) {
		const { gl, errorState, pointIndexArray } = this;
		const [ width, height ] = outputLayer ? outputLayer.getDimensions() : [ this.width, this.height ];

		// Ignore if we are in error state.
		if (errorState) {
			return;
		}

		if (inputLayers.length < 1) {
			throw new Error(`Invalid inputLayers for drawPoints on program "${program.name}": must pass a positionDataLayer as first element of inputLayers.`);
		}
		const positionLayer = inputLayers[0] as DataLayer;

		// Check that numPoints is valid.
		const length = positionLayer.getLength();
		const numPoints = options?.numPoints || length;
		if (numPoints > length) {
			throw new Error(`Invalid numPoint ${numPoints} for positionDataLayer of length ${length}.`);
		}

		// Set default pointSize.
		const pointSize = options?.pointSize || 1;

		// Do setup - this must come first.
		this.drawSetup(program, false, inputLayers, outputLayer);

		// Update uniforms and buffers.
		program.setUniform('u_internal_scale', [1 / width, 1 / height], 'FLOAT');
		program.setUniform('u_internal_pointSize', pointSize, 'FLOAT');
		const positionLayerDimensions = positionLayer.getDimensions();
		program.setUniform('u_internal_positionDimensions', positionLayerDimensions, 'FLOAT');
		if (this.pointIndexBuffer === undefined || (pointIndexArray && pointIndexArray.length < numPoints)) {
			// Have to use float32 array bc int is not supported as a vertex attribute type.
			const indices = new Float32Array(length);
			for (let i = 0; i < length; i++) {
				indices[i] = i;
			}
			this.pointIndexArray = indices;
			this.pointIndexBuffer = this.initVertexBuffer(indices);
		}
		gl.bindBuffer(gl.ARRAY_BUFFER, this.pointIndexBuffer!);
		this.setIndexAttribute(program);

		// Draw.
		// Default to blend === true.
		const shouldBlendAlpha = options?.shouldBlendAlpha === false ? false : true;
		if (shouldBlendAlpha) {
			gl.enable(gl.BLEND);
			gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		}
		gl.drawArrays(gl.POINTS, 0, numPoints);
		gl.disable(gl.BLEND);
	}
	
	getContext() {
		return this.gl;
	}

	getValues(dataLayer: DataLayer) {
		const { gl, glslVersion } = this;

		// TODO: in case dataLayer was not the last output written to.
		// dataLayer.bindOutputBuffer(false);

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

    reset() {
		// TODO: implement this.
	};

	attachDataLayerToThreeTexture(dataLayer: DataLayer, texture: Texture) {
		if (!this.renderer) {
			throw new Error('WebGLCompute was not inited with a renderer.');
		}
		// Link webgl texture to threejs object.
		// This is not officially supported.
		const textures = dataLayer.getTextures();
		if (textures.length > 1) {
			throw new Error(`DataLayer "${dataLayer.name}" contains multiple WebGL textures (one for each buffer) that are flip-flopped during compute cycles, please choose a DataLayer with one buffer.`);
		}
		const offsetTextureProperties = this.renderer.properties.get(texture);
		offsetTextureProperties.__webglTexture = textures[0];
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