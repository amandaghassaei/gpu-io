import { DataLayer, DataLayerArrayType, DataLayerFilterType, DataLayerNumComponents, DataLayerType, DataLayerWrapType } from './DataLayer';
import { GPUProgram, UniformValueType, UniformDataType } from './GPUProgram';
import { WebGLRenderer, Texture, Vector4 } from 'three';// Just importing the types here.
import * as utils from './utils/Vector4';
import { compileShader, isWebGL2, isPowerOf2 } from './utils';
import { getFloat16 } from '@petamoriken/float16';
const defaultVertexShaderSource = require('./kernels/DefaultVertexShader.glsl');
const defaultVertexShaderSource_gl1 = require('./kernels1.0/DefaultVertexShader.glsl');
const copyFloatFragmentShaderSource = require('./kernels/CopyFloatFragShader.glsl');
const copyIntFragmentShaderSource = require('./kernels/CopyIntFragShader.glsl');
const copyUintFragmentShaderSource = require('./kernels/CopyUintFragShader.glsl');
const copyFragmentShaderSource_gl1 = require('./kernels1.0/CopyFragShader.glsl');

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

export class GLCompute {
	private readonly gl!: WebGLRenderingContext | WebGL2RenderingContext;
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
	private packFloat32ToRGBA8Program?: GPUProgram;
	private packToRGBA8OutputBuffer?: DataLayer;

	static initWithThreeRenderer(
		renderer: WebGLRenderer,
		errorCallback?: errorCallback,
	) {
		return new GLCompute(
			renderer.getContext(),
			renderer.domElement,
			undefined,
			errorCallback,
			renderer,
		);
	}

	constructor(
		gl: WebGLRenderingContext | WebGL2RenderingContext | null,
		canvasEl: HTMLCanvasElement,
		options?: {
			antialias?: boolean,
		},
		// Optionally pass in an error callback in case we want to handle errors related to webgl support.
		// e.g. throw up a modal telling user this will not work on their device.
		errorCallback: errorCallback = (message: string) => { throw new Error(message) },
		renderer?: WebGLRenderer,
	) {
		// Save callback in case we run into an error.
		const self = this;
		this.errorCallback = (message: string) => {
			if (self.errorState) {
				return;
			}
			self.errorState = true;
			if (errorCallback) errorCallback(message);
		}

		// Init GL.
		if (!gl) {
			// Init a gl context if not passed in.
			gl = canvasEl.getContext('webgl2', options)  as WebGL2RenderingContext | null
				|| canvasEl.getContext('webgl', options)  as WebGLRenderingContext | null
				|| canvasEl.getContext('experimental-webgl', options)  as WebGLRenderingContext | null;
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
		const vertexShaderSource = isWebGL2(gl) ? defaultVertexShaderSource : defaultVertexShaderSource_gl1;
		const defaultVertexShader = compileShader(gl, this.errorCallback, vertexShaderSource, gl.VERTEX_SHADER);
		if (!defaultVertexShader) {
			this.errorCallback('Unable to initialize fullscreen quad vertex shader.');
			return;
		}
		this.defaultVertexShader = defaultVertexShader;

		// Init programs to pass values from one texture to another.
		this.copyFloatProgram = this.initProgram(
			'copyFloat',
			isWebGL2(gl) ? copyFloatFragmentShaderSource : copyFragmentShaderSource_gl1,
			[
				{
					name: 'u_state',
					value: 0,
					dataType: 'INT',
				},
			],
		);
		this.copyIntProgram = this.initProgram(
			'copyInt',
			isWebGL2(gl) ? copyIntFragmentShaderSource : copyFragmentShaderSource_gl1,
			[
				{
					name: 'u_state',
					value: 0,
					dataType: 'INT',
				},
			],
		);
		this.copyUintProgram = this.initProgram(
			'copyUint',
			isWebGL2(gl) ? copyUintFragmentShaderSource : copyFragmentShaderSource_gl1,
			[
				{
					name: 'u_state',
					value: 0,
					dataType: 'INT',
				},
			],
		);

		// Create vertex buffers.
		this.quadPositionsBuffer = this.initVertexBuffer(fsQuadPositions)!;
		this.boundaryPositionsBuffer = this.initVertexBuffer(boundaryPositions)!;
		this.circlePositionsBuffer = this.initVertexBuffer(circlePositions)!;
		// Unbind active buffer.
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		// Canvas setup.
		this.onResize(canvasEl);

		// Log number of textures available.
		this.maxNumTextures = this.gl.getParameter(this.gl.MAX_TEXTURE_IMAGE_UNITS);
		console.log(`${this.maxNumTextures} textures max.`);
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
		name: string,
		fragmentShaderOrSource: string | WebGLShader,
		uniforms?: {
			name: string,
			value: UniformValueType,
			dataType: UniformDataType,
		}[],
		defines?: {
			[key : string]: string,
		},
		vertexShaderOrSource?: string | WebGLShader,
	) {
		const { gl, errorCallback } = this;	
		return new GPUProgram(
			name,
			gl,
			errorCallback,
			vertexShaderOrSource ? vertexShaderOrSource : this.defaultVertexShader,
			fragmentShaderOrSource,
			uniforms,
			defines,
		);
	};

	initDataLayer(
		name: string,
		options:{
			dimensions: number | [number, number],
			type: DataLayerType,
			numComponents: DataLayerNumComponents,
			data?: DataLayerArrayType,
			filter?: DataLayerFilterType,
			wrapS?: DataLayerWrapType,
			wrapT?: DataLayerWrapType,
		},
		writable = false,
		numBuffers = 1,
	) {
		const { gl, errorCallback } = this;
		return new DataLayer(name, gl, options, errorCallback, writable, numBuffers);
	};

	initTexture(
		url: string,
	) {
		const { gl, errorCallback } = this;
		const texture = gl.createTexture();
		if (texture === null) {
			throw new Error('Unable to init texture.');
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
		const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
		gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
						width, height, border, srcFormat, srcType,
						pixel);

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

	onResize(canvasEl: HTMLCanvasElement) {
		const { gl } = this;
		const width = canvasEl.clientWidth;
		const height = canvasEl.clientHeight;
		// Set correct canvas pixel size.
		// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/By_example/Canvas_size_and_WebGL
		canvasEl.width = width;
		canvasEl.height = height;
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
		if (!program.program) {
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
		gl.useProgram(program.program);

		// Set input textures.
		for (let i = 0; i < inputTextures.length; i++) {
			gl.activeTexture(gl.TEXTURE0 + i);
			gl.bindTexture(gl.TEXTURE_2D, inputTextures[i]);
		}
	}

	copyProgramForType(type: DataLayerType) {
		switch (type) {
			case 'float16':
			case 'float32':
				return this.copyFloatProgram;
			case 'uint8':
			case 'uint16':
			case 'uint32':
				return this.copyUintProgram;
			case 'int8':
			case 'int16':
			case 'int32':
				return this.copyIntProgram;
			default:
				throw new Error(`Invalid type: ${type}.`);
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
				const copyProgram = this.copyProgramForType(outputLayer.type);
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
		const location = gl.getAttribLocation(program.program!, 'a_internal_position');
		gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
		// Enable the attribute.
		gl.enableVertexAttribArray(location);
	}

	private setIndexAttribute(program: GPUProgram) {
		const { gl } = this;
		// Point attribute to the currently bound VBO.
		const location = gl.getAttribLocation(program.program!, 'a_internal_index');
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
		// TODO: this is not compatible with webgl1.
		// let { packFloat32ToRGBA8Program, packToRGBA8OutputBuffer } = this;
		// // Init program if needed.
		// if (!packFloat32ToRGBA8Program) {
		// 	packFloat32ToRGBA8Program = new GPUProgram(
		// 		'packFloat32ToRGBA8',
		// 		gl,
		// 		errorCallback,
		// 		defaultVertexShader,
		// 		packFloat32ToRGBA8ShaderSource, [
		// 			{ 
		// 				name: 'u_floatTexture',
		// 				value: 0,
		// 				dataType: 'INT',
		// 			},
		// 		]);
		// 	this.packFloat32ToRGBA8Program = packFloat32ToRGBA8Program;
		// }

		// const [width, height] = dataLayer.getDimensions();
		// const numComponents = dataLayer.getNumComponents();
		// const outputWidth = width * numComponents;
		// const outputHeight = height;

		// // Init output buffer if needed.
		// if (!packToRGBA8OutputBuffer) {
		// 	packToRGBA8OutputBuffer = new DataLayer('packToRGBA8Output', gl, {
		// 		dimensions: [outputWidth, outputHeight],
		// 		type: 'uint8',
		// 		numComponents: 4,
		// 	}, errorCallback, true, 1);
		// } else {
		// 	// Resize if needed.
		// 	const outputDimensions = packToRGBA8OutputBuffer.getDimensions();
		// 	if (outputDimensions[0] !== outputWidth || outputDimensions[1] !== outputHeight) {
		// 		packToRGBA8OutputBuffer.resize([outputWidth, outputHeight]);
		// 	}
		// }

		// // Pack to bytes.
		// packFloat32ToRGBA8Program.setUniform('u_floatTextureDim', [width, height], 'FLOAT');
		// packFloat32ToRGBA8Program.setUniform('u_numFloatComponents', numComponents, 'FLOAT');
		// this.step(packFloat32ToRGBA8Program, [dataLayer], packToRGBA8OutputBuffer);

		// // Read result.
		// if (this.readyToRead()) {
		// 	const pixels = new Uint8Array(outputWidth * outputHeight * 4);
		// 	gl.readPixels(0, 0, outputWidth, outputHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
		// 	return new Float32Array(pixels.buffer);
		// } else {
			// throw new Error(`Unable to read values from Buffer with status: ${gl.checkFramebufferStatus(gl.FRAMEBUFFER)}.`);
		// }

		const { gl } = this;

		const [ width, height ] = dataLayer.getDimensions();
		const { glNumChannels, glType, glFormat, type } = dataLayer;
		let values;
		switch (type) {
			// Both float types are output as float32 arrays.
			case 'float16':
				values = new Uint16Array(width * height * glNumChannels);
				break
			case 'float32':
				values = new Float32Array(width * height * glNumChannels);
				break;
			case 'uint8': 
				values = new Uint8Array(width * height * glNumChannels);
				break;
			case 'uint16': 
				values = new Uint16Array(width * height * glNumChannels);
				break;
			case 'uint32':
				values = new Uint32Array(width * height * glNumChannels);
				break;
			case 'int8':
				values = new Int8Array(width * height * glNumChannels);
				break;
			case 'int16':
				values = new Int16Array(width * height * glNumChannels);
				break;
			case 'int32':
				values = new Int32Array(width * height * glNumChannels);
				break;
			default:
				throw new Error(`Unsupported type ${type} for getValues().`);
		}

		if (this.readyToRead()) {
			gl.readPixels(0, 0, width, height, glFormat, glType, values);
			const numComponents = dataLayer.getNumComponents();

			if (type === 'float16') {
				// Convert uint16 to float32.
				const floatValues = new Float32Array(width * height * numComponents);
				const view = new DataView(values.buffer);
				// In some cases glNumChannels may be > numComponents.
				for (let i = 0, length = width * height; i < length; i++) {
					const index1 = i * glNumChannels;
					const index2 = i * numComponents;
					for (let j = 0; j < numComponents; j++) {
						floatValues[index2 + j] = getFloat16(view, 2 * (index1 + j), true);
					}
				}
				return floatValues;
			}

			if (numComponents === glNumChannels) return values;
			// In some cases glNumChannels may be > numComponents.
			for (let i = 0, length = width * height; i < length; i++) {
				const index1 = i * glNumChannels;
				const index2 = i * numComponents;
				for (let j = 0; j < numComponents; j++) {
					values[index2 + j] = values[index1 + j];
				}
			}
			return values.slice(0, width * height * numComponents);
		} else {
			throw new Error(`Unable to read values from Buffer with status: ${gl.checkFramebufferStatus(gl.FRAMEBUFFER)}.`);
		}
	}

	readyToRead() {
		const { gl } = this;
		return gl.checkFramebufferStatus(gl.FRAMEBUFFER) == gl.FRAMEBUFFER_COMPLETE;
	};

    reset() {
	};

	attachDataLayerToThreeTexture(dataLayer: DataLayer, texture: Texture) {
		if (!this.renderer) {
			throw new Error('GLCompute was not inited with a renderer.');
		}
		// Link webgl texture to threejs object.
		// This is not officially supported.
		const textures = dataLayer.getTextures();
		if (textures.length > 1) {
			throw new Error('This dataLayer contains multiple WebGL textures (one for each buffer) that are flip-flopped during compute cycles, please choose a DataLayer with one buffer.');
		}
		const offsetTextureProperties = this.renderer.properties.get(texture);
		offsetTextureProperties.__webglTexture = textures[0];
		offsetTextureProperties.__webglInit = true;
	}

	resetThreeState() {
		if (!this.renderer) {
			throw new Error('GLCompute was not inited with a renderer.');
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