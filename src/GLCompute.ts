import defaultVertexShaderSource from './kernels/DefaultVertexShader';
import passThroughFragmentShaderSource from './kernels/PassThroughFragmentShader';
import { DataLayer, DataLayerArrayType, DataLayerFilterType, DataLayerNumComponents, DataLayerType, DataLayerWrapType } from './DataLayer';
import { GPUProgram, UniformValueType, UniformDataType } from './GPUProgram';
import { compileShader, isWebGL2 } from './utils';

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

export class GLCompute {
	private readonly gl!: WebGLRenderingContext | WebGL2RenderingContext;
	private width!: number;
	private height!: number;

	private errorState = false;
	private readonly errorCallback: (message: string) => void;
	
	// Some precomputed values.
	private readonly defaultVertexShader!: WebGLShader;
	private readonly quadPositionsBuffer!: WebGLBuffer;
	private readonly boundaryPositionsBuffer!: WebGLBuffer;
	private readonly circlePositionsBuffer!: WebGLBuffer;
	private pointIndexArray?: Float32Array;
	private pointIndexBuffer?: WebGLBuffer;
	private readonly passThroughProgram!: GPUProgram;

	constructor(
		gl: WebGLRenderingContext | WebGL2RenderingContext | null,
		canvasEl: HTMLCanvasElement,
		options?: {
			antialias?: boolean,
		},
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
		const defaultVertexShader = compileShader(gl, this.errorCallback, defaultVertexShaderSource, gl.VERTEX_SHADER);
		if (!defaultVertexShader) {
			this.errorCallback('Unable to initialize fullscreen quad vertex shader.');
			return;
		}
		this.defaultVertexShader = defaultVertexShader;

		// Init a program to pass values from one texture to another.
		this.passThroughProgram = this.initProgram(
			'passThrough',
			passThroughFragmentShaderSource,
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
		inputLayers: DataLayer[],
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
		const inputTextures = inputLayers.map(layer => layer.getCurrentStateTexture());

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

	private setOutputLayer(
		fullscreenRender: boolean,
		inputLayers: DataLayer[],
		outputLayer?: DataLayer, // Undefined renders to screen.
	) {
		const { gl, passThroughProgram } = this;

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
				this.step(passThroughProgram, [outputLayer], outputLayer);
				// Render to output without incrementing buffer.
				outputLayer.bindOutputBuffer(false);
			}
		} else {
			// Render to current buffer.
			outputLayer.bindOutputBuffer(false);
		}
		
		// Resize viewport.
		const { width, height } = outputLayer.getDimensions();
		gl.viewport(0, 0, width, height);
	};

	private setPositionAttribute(program: GPUProgram) {
		const { gl } = this;
		// Point attribute to the currently bound VBO.
		const location = gl.getAttribLocation(program.program!, 'aPosition');
		gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
		// Enable the attribute.
		gl.enableVertexAttribArray(location);
	}

	private setIndexAttribute(program: GPUProgram) {
		const { gl } = this;
		// Point attribute to the currently bound VBO.
		const location = gl.getAttribLocation(program.program!, 'aIndex');
		gl.vertexAttribPointer(location, 1, gl.FLOAT, false, 0, 0);
		// Enable the attribute.
		gl.enableVertexAttribArray(location);
	}

	// Step for entire fullscreen quad.
	step(
		program: GPUProgram,
		inputLayers: DataLayer[] = [],
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
		program.setUniform('u_scale', [1, 1], 'FLOAT');
		program.setUniform('u_translation', [0, 0], 'FLOAT');
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
		inputLayers: DataLayer[] = [],
		outputLayer?: DataLayer, // Undefined renders to screen.
		options?: {
			shouldBlendAlpha?: boolean,
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
		// @ts-ignore
		const { width, height } = outputLayer ? outputLayer.getDimensions() : this;
		const onePx = [ 1 / width, 1 / height] as [number, number];
		program.setUniform('u_scale', [1 - onePx[0], 1 - onePx[1]], 'FLOAT');
		program.setUniform('u_translation', onePx, 'FLOAT');
		gl.bindBuffer(gl.ARRAY_BUFFER, boundaryPositionsBuffer);
		this.setPositionAttribute(program);

		// Draw.
		if (options?.shouldBlendAlpha) {
			gl.enable(gl.BLEND);
			gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		}
		gl.drawArrays(gl.LINE_LOOP, 0, 4);
		gl.disable(gl.BLEND);
	}

	// Step program for all but a strip of px along the boundary.
	stepNonBoundary(
		program: GPUProgram,
		inputLayers: DataLayer[] = [],
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
		// @ts-ignore
		const { width, height } = outputLayer ? outputLayer.getDimensions() : this;
		const onePx = [ 1 / width, 1 / height] as [number, number];
		program.setUniform('u_scale', [1 - 2 * onePx[0], 1 - 2 * onePx[1]], 'FLOAT');
		program.setUniform('u_translation', onePx, 'FLOAT');
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
		inputLayers: DataLayer[] = [],
		outputLayer?: DataLayer, // Undefined renders to screen.
		options?: {
			shouldBlendAlpha?: boolean,
		},
	) {
		const { gl, errorState, circlePositionsBuffer, width, height } = this;

		// Ignore if we are in error state.
		if (errorState) {
			return;
		}

		// Do setup - this must come first.
		this.drawSetup(program, false, inputLayers, outputLayer);

		// Update uniforms and buffers.
		program.setUniform('u_scale', [radius / width, radius / height], 'FLOAT');
		program.setUniform('u_translation', [2 * position[0] / width - 1, 2 * position[1] / height - 1], 'FLOAT');
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
		inputLayers: DataLayer[],
		outputLayer: DataLayer,
		options?: {
			pointSize?: number,
			numPoints?: number,
			shouldBlendAlpha?: boolean,
		}
	) {
		const { gl, errorState, width, height, pointIndexArray } = this;

		// Ignore if we are in error state.
		if (errorState) {
			return;
		}

		if (inputLayers.length < 1) {
			throw new Error(`Invalid inputLayers for drawPoints on ${program.name}: must pass a positionDataLayer as first element of inputLayers.`);
		}
		const positionLayer = inputLayers[0];

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
		program.setUniform('u_scale', [1 / width, 1 / height], 'FLOAT');
		program.setUniform('u_pointSize', pointSize, 'FLOAT');
		const positionLayerDimensions = positionLayer.getDimensions();
		program.setUniform('u_positionDimensions', [positionLayerDimensions.width, positionLayerDimensions.height], 'FLOAT');
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
	
	destroy() {
		// TODO: Need to implement this.
	}
}