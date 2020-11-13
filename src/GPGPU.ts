import defaultVertexShaderSource from './kernels/DefaultVertexShader';
import passThroughShaderSource from './kernels/PassThroughShader';
import { DataLayer, DataLayerArrayType, DataLayerFilterType, DataLayerWrapType } from './DataLayer';
import { GPUProgram, UniformValueType, UniformDataType } from './GPUProgram';
import { compileShader, isWebGL2 } from './utils';

type TextureType = 'float16' | 'uint8'; // 'float32'
type TextureNumChannels = 1 | 2 | 3 | 4;

const fsQuadPositions = new Float32Array([ -1, -1, 1, -1, -1, 1, 1, 1 ]);
const boundaryPositions = new Float32Array([ -1, -1, 1, -1, 1, 1, -1, 1 ]);
const unitCirclePoints = [0, 0];
const NUM_SEGMENTS_CIRCLE = 20;
for (let i = 0; i <= NUM_SEGMENTS_CIRCLE; i++) {
	unitCirclePoints.push(
		Math.cos(2 * Math.PI * i / NUM_SEGMENTS_CIRCLE),
		Math.sin(2 * Math.PI * i / NUM_SEGMENTS_CIRCLE),
	);
}
const circlePositions = new Float32Array(unitCirclePoints);



export class GPGPU {
	private readonly gl!: WebGLRenderingContext | WebGL2RenderingContext;
	private readonly isWebGL2!: boolean;
	private readonly extensions: { [ key: string ]: any } = {};
	private width!: number;
	private height!: number;

	private errorState = false;
	private readonly errorCallback: (message: string) => void;

	private readonly shaders: WebGLShader[] = []; // Keep track of all shaders inited so they can be properly deallocated.
	
	// Some precomputed values.
	private readonly defaultVertexShader!: WebGLShader;
	private readonly quadPositionsBuffer!: WebGLBuffer;
	private readonly boundaryPositionsBuffer!: WebGLBuffer;
	private readonly circlePositionsBuffer!: WebGLBuffer;
	private readonly passThroughProgram!: GPUProgram;

	// GL state.
	private readonly linearFilterEnabled!: boolean;

	constructor(
		gl: WebGLRenderingContext | WebGL2RenderingContext | null,
		canvasEl: HTMLCanvasElement,
		// Optionally pass in an error callback in case we want to handle errors related to webgl support.
		// e.g. throw up a modal telling user this will not work on their device.
		errorCallback: (message: string) => void = (message: string) => { throw new Error(message) }, 
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
			gl = canvasEl.getContext('webgl2', {antialias:false})  as WebGL2RenderingContext | null
				|| canvasEl.getContext('webgl', {antialias:false})  as WebGLRenderingContext | null;
			// || canvasEl.getContext('experimental-webgl', {antialias:false}) as RenderingContext;
			if (gl === null) {
			this.errorCallback('Unable to initialize WebGL context.');
				return;
			}
		}
		this.isWebGL2 = isWebGL2(gl);
		if (this.isWebGL2) {
			console.log('Using WebGL 2.0 context.');
		} else {
			console.log('Using WebGL 1.0 context.');
		}
		this.gl = gl;

		// GL setup.
		// Disable depth testing globally.
		gl.disable(gl.DEPTH_TEST);
		// Set unpack alignment to 1 so we can have textures of arbitrary dimensions.
		// https://stackoverflow.com/questions/51582282/error-when-creating-textures-in-webgl-with-the-rgb-format
		gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);

		// Init a default vertex shader that just passes through screen coords.
		const defaultVertexShader = compileShader(gl, this.errorCallback, defaultVertexShaderSource, gl.VERTEX_SHADER);
		if (!defaultVertexShader) {
			this.errorCallback('Unable to initialize fullscreen quad vertex shader.');
			return;
		}
		this.defaultVertexShader = defaultVertexShader;

		// Init a program to pass values from one texture to another.
		this.passThroughProgram = this.initProgram('passThrough', passThroughShaderSource, [
			{
				name: 'u_state',
				value: 0,
				dataType: 'INT',
			}
		]);

		// Create vertex buffers.
		this.quadPositionsBuffer = this.initVertexBuffer(fsQuadPositions)!;
		this.boundaryPositionsBuffer = this.initVertexBuffer(boundaryPositions)!;
		this.circlePositionsBuffer = this.initVertexBuffer(circlePositions)!;
		// Unbind active buffer.
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		// Canvas setup.
		this.onResize(canvasEl);

		// Log number of textures available.
		const maxTexturesInFragmentShader = this.gl.getParameter(this.gl.MAX_TEXTURE_IMAGE_UNITS);
		console.log(`${maxTexturesInFragmentShader} textures max.`);
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
		// Add vertex data for drawing full screen quad via triangle strip.
		gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
		return buffer;
	}

	initProgram(
		name: string,
		fragmentShaderSource: string,
		uniforms?: {
			name: string,
			value: UniformValueType,
			dataType: UniformDataType,
		}[],
		// vertexShaderSource?: string,
	) {
		const { gl, errorCallback } = this;

		// Load fullscreen quad vertex shader by default.
		// const vertexShader = vertexShaderSource ?
		// 	this.compileShader(vertexShaderSource, gl.VERTEX_SHADER) :
		// 	this.fsQuadVertexShader;		
		return new GPUProgram(name, gl, errorCallback, this.defaultVertexShader, fragmentShaderSource, uniforms);
	};

	initDataLayer(
		name: string,
		options:{
			width: number,
			height: number,
			type: TextureType,
			numChannels: TextureNumChannels,
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

	onResize(canvasEl: HTMLCanvasElement) {
		const { gl } = this;
		const width = canvasEl.clientWidth;
		const height = canvasEl.clientHeight;
        gl.viewport(0, 0, width, height);
		// Set correct canvas pixel size.
		// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/By_example/Canvas_size_and_WebGL
		canvasEl.width = width;
		canvasEl.height = height;
		// Save dimensions.
		this.width = width;
		this.height = height;
	};

	private setDrawInputsAndOutputs(
		program: GPUProgram,
		fullscreenRender: boolean,
		inputLayers: DataLayer[],
		outputLayer?: DataLayer,
	) {
		const { gl } = this;
		// Check if we are in an error state.
		if (!program.program) {
			return;
		}

		// CAUTION: the order of these next few lines in important.

		// Get a shallow copy of current textures.
		// This line must come before this.setOutput() as it can modify some internal state.
		const inputTextures = inputLayers.map(layer => layer.getCurrentStateTexture());

		// Set output framebuffer.
		this.setOutput(fullscreenRender, inputLayers, outputLayer);

		// Set current program.
		gl.useProgram(program.program);

		// Set input textures.
		for (let i = 0; i < inputTextures.length; i++) {
			gl.activeTexture(gl.TEXTURE0 + i);
			gl.bindTexture(gl.TEXTURE_2D, inputTextures[i]);
		}
	}

	private setOutput(
		fullscreenRender: boolean,
		inputLayers: DataLayer[],
		outputLayer?: DataLayer, // Undefined renders to screen.
	) {
		const { gl, passThroughProgram } = this;

		if (!outputLayer) {
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
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
				outputLayer.setAsRenderTarget(true);
				return;
			}
			// Pass input texture through to output.
			this.step(passThroughProgram, [outputLayer], outputLayer);
			// Render to output without incrementing buffer.
			outputLayer.setAsRenderTarget(false);
			return;
		}
		// Render to current buffer.
		outputLayer.setAsRenderTarget(false);
	};

	private setPositionAttribute(program: GPUProgram) {
		const { gl } = this;
		// Point attribute to the currently bound VBO.
		const positionLocation = gl.getAttribLocation(program.program!, 'aPosition');
		gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
		// Enable the attribute.
		gl.enableVertexAttribArray(positionLocation);

	}

	// Step for entire fullscreen quad.
	step(
		program: GPUProgram,
		inputLayers: DataLayer[] = [],
		outputLayer?: DataLayer, // Undefined renders to screen.
	) {
		const { gl, errorState, quadPositionsBuffer } = this;

		// Ignore if we are in error state.
		if (errorState) {
			return;
		}

		// Do setup - this must come first.
		this.setDrawInputsAndOutputs(program, true, inputLayers, outputLayer);

		// Update uniforms and buffers.
		program.setUniform('u_scale', [1, 1], 'FLOAT');
		program.setUniform('u_translation', [0, 0], 'FLOAT');
		gl.bindBuffer(gl.ARRAY_BUFFER, quadPositionsBuffer);
		this.setPositionAttribute(program);

		// Draw.
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	}

	// Step program only for a strip of px along the boundary.
	stepBoundary(
		program: GPUProgram,
		inputLayers: DataLayer[] = [],
		outputLayer?: DataLayer, // Undefined renders to screen.
	) {
		const { gl, errorState, boundaryPositionsBuffer, width, height } = this;

		// Ignore if we are in error state.
		if (errorState) {
			return;
		}

		// Do setup - this must come first.
		this.setDrawInputsAndOutputs(program, false, inputLayers, outputLayer);

		// Update uniforms and buffers.
		// Frame needs to be offset and scaled so that all four sides are in viewport.
		const onePx = [ 1 / width, 1 / height] as [number, number];
		program.setUniform('u_scale', [1 - onePx[0], 1 - onePx[1]], 'FLOAT');
		program.setUniform('u_translation', onePx, 'FLOAT');
		gl.bindBuffer(gl.ARRAY_BUFFER, boundaryPositionsBuffer);
		this.setPositionAttribute(program);

		// Draw.
		gl.drawArrays(gl.LINE_LOOP, 0, 4);// Draw to framebuffer.
	}

	// Step program for all but a strip of px along the boundary.
	stepNonBoundary(
		program: GPUProgram,
		inputLayers: DataLayer[] = [],
		outputLayer?: DataLayer, // Undefined renders to screen.
	) {
		const { gl, errorState, quadPositionsBuffer, width, height } = this;

		// Ignore if we are in error state.
		if (errorState) {
			return;
		}

		// Do setup - this must come first.
		this.setDrawInputsAndOutputs(program, false, inputLayers, outputLayer);

		// Update uniforms and buffers.
		const onePx = [ 1 / width, 1 / height] as [number, number];
		program.setUniform('u_scale', [1 - 2 * onePx[0], 1 - 2 * onePx[1]], 'FLOAT');
		program.setUniform('u_translation', onePx, 'FLOAT');
		gl.bindBuffer(gl.ARRAY_BUFFER, quadPositionsBuffer);
		this.setPositionAttribute(program);
		
		// Draw.
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	}

	// Step program only for a circular spot.
	stepCircle(
		program: GPUProgram,
		position: [number, number], // position is in screen space coords.
		radius: number, // radius is in px.
		inputLayers: DataLayer[] = [],
		outputLayer?: DataLayer, // Undefined renders to screen.
	) {
		const { gl, errorState, circlePositionsBuffer, width, height } = this;

		// Ignore if we are in error state.
		if (errorState) {
			return;
		}

		// Do setup - this must come first.
		this.setDrawInputsAndOutputs(program, false, inputLayers, outputLayer);

		// Update uniforms and buffers.
		program.setUniform('u_scale', [radius / width, radius / height], 'FLOAT');
		program.setUniform('u_translation', [2 * position[0] / width - 1, 2 * position[1] / height - 1], 'FLOAT');
		gl.bindBuffer(gl.ARRAY_BUFFER, circlePositionsBuffer);
		this.setPositionAttribute(program);
		
		// Draw.
		gl.drawArrays(gl.TRIANGLE_FAN, 0, NUM_SEGMENTS_CIRCLE + 2);// Draw to framebuffer.
	}

    // readyToRead() {
	// 	const { gl } = this;
    //     return gl.checkFramebufferStatus(gl.FRAMEBUFFER) == gl.FRAMEBUFFER_COMPLETE;
    // };

    // readPixels(xMin: number, yMin: number, width: number, height: number, array: TextureDataType) {
	// 	const { gl } = this;
	// 	gl.readPixels(xMin, yMin, width, height, gl.RGBA, gl.UNSIGNED_BYTE, array);
    // };

    reset() {
    };
}