import defaultVertexShaderSource from './kernels/DefaultVertexShader';
import passThroughShaderSource from './kernels/PassThroughShader';
import { DataLayer, DataArrayType } from './DataLayer';
import { GPUProgram, UniformValueType, UniformDataType } from './GPUProgram';
import { compileShader } from './utils';

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

// Store extension names as constants.
const OES_TEXTURE_HALF_FLOAT = 'OES_texture_half_float';
const OES_TEXTURE_HAlF_FLOAT_LINEAR = 'OES_texture_half_float_linear';
const EXT_COLOR_BUFFER_FLOAT = 'EXT_color_buffer_float';

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
		this.isWebGL2 = !!(gl as WebGL2RenderingContext).HALF_FLOAT;
		if (this.isWebGL2) {
			console.log('Using WebGL 2.0 context.');
		} else {
			console.log('Using WebGL 1.0 context.');
		}
		this.gl = gl;

		// GL setup.
		// Load extensions.
		// TODO: load these extensions as needed.
		if (this.isWebGL2) {
			// EXT_COLOR_BUFFER_FLOAT adds ability to render to a variety of floating pt textures.
			// https://developer.mozilla.org/en-US/docs/Web/API/EXT_color_buffer_float
			// https://stackoverflow.com/questions/34262493/framebuffer-incomplete-attachment-for-texture-with-internal-format
			// https://stackoverflow.com/questions/36109347/framebuffer-incomplete-attachment-only-happens-on-android-w-firefox
			this.loadExtension(EXT_COLOR_BUFFER_FLOAT);
		} else {
			// https://developer.mozilla.org/en-US/docs/Web/API/OES_texture_half_float
			// Half float is supported by modern mobile browsers, float not yet supported.
			// Half float is provided by default for Webgl2 contexts.
			// This extension implicitly enables the EXT_color_buffer_half_float extension (if supported), which allows rendering to 16-bit floating point formats.
			this.loadExtension(OES_TEXTURE_HALF_FLOAT);
		}
		// Load optional extensions.
		// TODO: need this for webgl2?
		this.linearFilterEnabled = this.loadExtension(OES_TEXTURE_HAlF_FLOAT_LINEAR, true);
	
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

	private loadExtension(
		extension: string,
		optional = false,
	) {
		const { extensions, gl, errorCallback } = this;
		let ext;
		try {
			ext = gl.getExtension(extension);
		} catch (e) {}
		if (ext) {
			extensions[extension] = ext;
			console.log(`Loaded extension: ${extension}.`);
		} else {
			console.warn(`Unsupported ${optional ? 'optional ' : ''}extension: ${extension}.`);
		}
		// If the extension is not optional, throw error.
		if (!ext && !optional) {
			errorCallback(`Required extension unsupported by this device / browser: ${extension}.`);
		}
		return !!ext;
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
		const vertexShader = this.defaultVertexShader;
		
		return new GPUProgram(name, gl, errorCallback, this.defaultVertexShader, fragmentShaderSource, uniforms);
	};

	private glTextureParameters(
		numChannels: TextureNumChannels,
		type: TextureType,
		writable: boolean,
	) {
		// https://www.khronos.org/registry/webgl/specs/latest/2.0/#TEXTURE_TYPES_FORMATS_FROM_DOM_ELEMENTS_TABLE
		const { gl, isWebGL2, extensions } = this;
		let glType: number | undefined, glFormat: number | undefined, glInternalFormat: number | undefined, glNumChannels: number | undefined;
		if (isWebGL2) {
			glNumChannels = numChannels;
			// https://www.khronos.org/registry/webgl/extensions/EXT_color_buffer_float/
			// The sized internal format RGB16F is not color-renderable for some reason.
			// If numChannels == 3 for a writable texture, use RGBA instead.
			if (numChannels === 3 && writable) {
				glNumChannels = 4;
			}
			switch (glNumChannels) {
				case 1:
					glFormat = (gl as WebGL2RenderingContext).RED;
					break;
				case 2:
					glFormat = (gl as WebGL2RenderingContext).RG;
					break;
				case 3:
					glFormat = gl.RGB;
					break;
				case 4:
					glFormat = gl.RGBA;
					break;
			}
			switch (type) {
				case 'float16':
					glType = (gl as WebGL2RenderingContext).HALF_FLOAT;
					switch (glNumChannels) {
						case 1:
							glInternalFormat = (gl as WebGL2RenderingContext).R16F;
							break;
						case 2:
							glInternalFormat = (gl as WebGL2RenderingContext).RG16F;
							break;
						case 3:
							glInternalFormat = (gl as WebGL2RenderingContext).RGB16F;
							break;
						case 4:
							glInternalFormat = (gl as WebGL2RenderingContext).RGBA16F;
							break;
					}
					break;
				case 'uint8':
					glType = gl.UNSIGNED_BYTE;
					switch (glNumChannels) {
						case 1:
							glInternalFormat = (gl as WebGL2RenderingContext).R8;
							break;
						case 2:
							glInternalFormat = (gl as WebGL2RenderingContext).RG8;
							break;
						case 3:
							glInternalFormat = (gl as WebGL2RenderingContext).RGB8;
							break;
						case 4:
							glInternalFormat = (gl as WebGL2RenderingContext).RGBA8;
							break;
					}
					break;
			}
		} else {
			switch (numChannels) {
				// TODO: for read only textures in WebGL 1.0, we could use gl.ALPHA and gl.LUMINANCE_ALPHA here.
				case 1:
				case 2:
				case 3:
					glFormat = gl.RGB;
					glInternalFormat = gl.RGB;
					glNumChannels = 3;
					break;
				case 4:
					glFormat = gl.RGBA;
					glInternalFormat = gl.RGBA;
					glNumChannels = 4;
					break;
			}
			switch (type) {
				case 'float16':
					glType = extensions[OES_TEXTURE_HALF_FLOAT].HALF_FLOAT_OES as number;
					break;
				case 'uint8':
					glType = gl.UNSIGNED_BYTE;
					break;
			}
		}

		// Check for missing params.
		if (glType === undefined || glFormat === undefined || glInternalFormat === undefined) {
			throw new Error(`Invalid type: ${type} or numChannels ${numChannels}.`);
		}
		if (glNumChannels === undefined || numChannels < 1 || numChannels > 4) {
			throw new Error(`Invalid numChannels: ${numChannels}.`);
		}

		return {
			glFormat,
			glInternalFormat,
			glType,
			glNumChannels,
		};
	}

	initDataLayer(
		name: string,
		options:{
			width: number,
			height: number,
			type: TextureType,
			numChannels: TextureNumChannels,
			data?: DataArrayType,
		},
		writable = false,
		numBuffers = 1,
	) {
		const { gl, errorCallback } = this;
		const { data, width, height, type, numChannels } = options;
		
		// Check that data is correct length.
		if (data && data.length !== width * height * numChannels) {
			throw new Error(`Invalid data array of size ${data.length} for DataLayer ${name} of dimensions ${width} x ${height} x ${numChannels}.`);
		}

		// TODO: Check that data is correct type.
		// if (data && type === 'float16') {
		// 	// // Since there is no Float16TypedArray, we must us Uint16TypedArray
		// 	// const float16Array = new Int16Array(data.length);
		// 	// for (let i = 0; i < data.length; i++) {
		// 	// }
		// }

		// Get texture params.
		// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D
		const { glFormat, glInternalFormat, glNumChannels, glType } = this.glTextureParameters(numChannels, type, writable);

		// Check that data is correct length.
		// This only happens for webgl 1.0 contexts.
		let dataResized = data;
		if (data && numChannels !== glNumChannels) {
			const imageSize = width * height;
			let newArray: DataArrayType;
			switch (type) {
				case 'uint8':
					newArray = new Uint8Array(width * height * glNumChannels);
					break;
				default:
					throw new Error(`Error initing ${name}.  Unsupported type ${type} for GPGPU.initDataLayer.`);
			}
			// Fill new data array with old data.
			for (let i = 0; i < imageSize; i++) {
				for (let j = 0; j < numChannels; j++) {
					newArray[glNumChannels * i + j] = data[i * numChannels + j];
				}
			}
			dataResized = newArray;
		}

		const dataLayer = new DataLayer(name, gl, {
			width,
			height,
			glInternalFormat,
			glFormat,
			glType,
			data: dataResized,
		}, errorCallback, numBuffers, writable);

		return dataLayer;
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

		// CAUTION: the order of these next few lines in important.

		// Get textures before we have set the render target (this can modify some internal state).
		const inputTextures = inputLayers.map(layer => layer.getCurrentStateTexture());

		// Set output framebuffer.
		this.setOutput(fullscreenRender, inputLayers, outputLayer);

		// Set current program.
		gl.useProgram(program.program);

		// Set input textures.
		for (let i = 0; i < inputLayers.length; i++) {
			gl.activeTexture(gl.TEXTURE0 + i);
			gl.bindTexture(gl.TEXTURE_2D, inputTextures[i]);
		}

		// Point attribute to the currently bound VBO.
		const positionLocation = gl.getAttribLocation(program.program, 'aPosition');
		gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
		// Enable the attribute.
		gl.enableVertexAttribArray(positionLocation);
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
		this.drawSetup(program, true, inputLayers, outputLayer);

		// Update uniforms and buffers.
		program.setUniform('u_scale', [1, 1], 'FLOAT');
		program.setUniform('u_translation', [0, 0], 'FLOAT');
		gl.bindBuffer(gl.ARRAY_BUFFER, quadPositionsBuffer);

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
		this.drawSetup(program, false, inputLayers, outputLayer);

		// Update uniforms and buffers.
		// Frame needs to be offset and scaled so that all four sides are in viewport.
		const onePx = [ 1 / width, 1 / height] as [number, number];
		program.setUniform('u_scale', [1 - onePx[0], 1 - onePx[1]], 'FLOAT');
		program.setUniform('u_translation', onePx, 'FLOAT');
		gl.bindBuffer(gl.ARRAY_BUFFER, boundaryPositionsBuffer);

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
		this.drawSetup(program, false, inputLayers, outputLayer);

		// Update uniforms and buffers.
		const onePx = [ 1 / width, 1 / height] as [number, number];
		program.setUniform('u_scale', [1 - 2 * onePx[0], 1 - 2 * onePx[1]], 'FLOAT');
		program.setUniform('u_translation', onePx, 'FLOAT');
		gl.bindBuffer(gl.ARRAY_BUFFER, quadPositionsBuffer);
		
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
		this.drawSetup(program, false, inputLayers, outputLayer);

		// Update uniforms and buffers.
		program.setUniform('u_scale', [radius / width, radius / height], 'FLOAT');
		// Flip y axis.
		program.setUniform('u_translation', [2 * position[0] / width - 1, - 2 * position[1] / height + 1], 'FLOAT');
		gl.bindBuffer(gl.ARRAY_BUFFER, circlePositionsBuffer);
		
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