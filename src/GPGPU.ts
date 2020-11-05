import defaultVertexShaderSource from './kernels/DefaultVertexShader';
import {
	FLOAT_1D_UNIFORM,
	FLOAT_2D_UNIFORM,
	FLOAT_3D_UNIFORM,
	FLOAT_4D_UNIFORM,
	INT_1D_UNIFORM,
	INT_2D_UNIFORM,
	INT_3D_UNIFORM,
	INT_4D_UNIFORM,
	FLOAT_TYPE,
	INT_TYPE,
} from './constants';

type TextureType = 'float16' | 'uint8'; // 'float32'
type TextureData =  Uint8Array;
type TextureNumChannels = 1 | 2 | 3 | 4;

type UniformType = 
	typeof FLOAT_1D_UNIFORM |
	typeof FLOAT_2D_UNIFORM |
	typeof FLOAT_3D_UNIFORM |
	typeof FLOAT_4D_UNIFORM |
	typeof INT_1D_UNIFORM |
	typeof INT_2D_UNIFORM |
	typeof INT_3D_UNIFORM |
	typeof INT_4D_UNIFORM;
type UniformDataType = typeof FLOAT_TYPE | typeof INT_TYPE;
type UniformValueType = number | [number] | [number, number] | [number, number, number] | [number, number, number, number];
type Uniform = { 
	location: WebGLUniformLocation,
	type: UniformType,
};

type Program = {
	program: WebGLProgram,
	uniforms: { [ key: string]: Uniform },
};

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

// Store extensions as constants.
const OES_TEXTURE_HALF_FLOAT = 'OES_texture_half_float';
const OES_TEXTURE_HAlF_FLOAT_LINEAR = 'OES_texture_half_float_linear';

export class GPGPU {
	private readonly gl!: WebGLRenderingContext | WebGL2RenderingContext;
	private width!: number;
	private height!: number;

	private errorState = false;
	private readonly errorCallback: (message: string) => void;

	private readonly programs: { [ key: string ] : Program } = {}; // All current gl programs.
	private readonly textures: { [ key: string ] : WebGLTexture } = {}; // All current gl textures.
	private readonly framebuffers: { [ key: string ] : WebGLFramebuffer } = {}; // All current gl framebuffers.
	private readonly shaders: WebGLShader[] = []; // Keep track of all shaders inited so they can be properly deallocated.
	
	// Some precomputed values.
	private readonly defaultVertexShader!: WebGLShader;
	private readonly quadPositionsBuffer!: WebGLBuffer;
	private readonly boundaryPositionsBuffer!: WebGLBuffer;
	private readonly circlePositionsBuffer!: WebGLBuffer;

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
			errorCallback('Unable to initialize WebGL context.');
				return;
			}
		}
		this.gl = gl;

		// GL setup.
		// Load extensions.
		// https://developer.mozilla.org/en-US/docs/Web/API/OES_texture_half_float
		// Half float is supported by modern mobile browsers, float not yet supported.
		// Half float is provided by default for Webgl2 contexts.
		// This extension implicitly enables the EXT_color_buffer_half_float extension (if supported), which allows rendering to 16-bit floating point formats.
		if (!(gl as WebGL2RenderingContext).HALF_FLOAT) this.loadExtension(OES_TEXTURE_HALF_FLOAT);
		// Load optional extensions.
		this.linearFilterEnabled = this.loadExtension(OES_TEXTURE_HAlF_FLOAT_LINEAR, true);
	
		// Disable depth testing globally.
		gl.disable(gl.DEPTH_TEST);

		// Set unpack alignment to 1 so we can have textures of arbitrary dimensions.
		// https://stackoverflow.com/questions/51582282/error-when-creating-textures-in-webgl-with-the-rgb-format
		gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);

		// Init a default vertex shader that just passes through screen coords.
		const defaultVertexShader = this.compileShader(defaultVertexShaderSource, gl.VERTEX_SHADER);
		if (!defaultVertexShader) {
			errorCallback('Unable to initialize fullscreen quad vertex shader.');
			return;
		}
		this.defaultVertexShader = defaultVertexShader;

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

	private initVertexBuffer(data: Float32Array) {
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

	private loadExtension(extension: string, optional = false) {
		let ext;
		try {
			ext = this.gl.getExtension(extension);
		} catch (e) {}
		if (!ext) {
			console.warn(`Unsupported ${optional ? 'optional ' : ''}extension: ${extension}.`);
		}
		// If the extension is not optional, throw error.
		if (!ext && !optional) {
			this.errorCallback(`Required extension unsupported by this device / browser: ${extension}.`);
		}
		return !!ext;
	}

	// Copied from http://webglfundamentals.org/webgl/lessons/webgl-boilerplate.html
	private compileShader(shaderSource: string, shaderType: number) {
		const { gl } = this;

		// Create the shader object
		const shader = gl.createShader(shaderType);
		if (!shader) {
			this.errorCallback('Unable to init gl shader.');
			return null;
		}

		// Set the shader source code.
		gl.shaderSource(shader, shaderSource);

		// Compile the shader
		gl.compileShader(shader);

		// Check if it compiled
		const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
		if (!success) {
			// Something went wrong during compilation - print the error.
			this.errorCallback(`Could not compile ${shaderType === gl.FRAGMENT_SHADER ? 'fragment' : 'vertex'}
				 shader: ${gl.getShaderInfoLog(shader)}`);
			return null;
		}
		this.shaders.push(shader);
		return shader;
	}

	initProgram(
		programName: string,
		fragmentShaderSource: string,
		uniforms?: {
			name: string,
			value: UniformValueType,
			dataType: UniformDataType,
		}[],
		// vertexShaderSource?: string,
	) {
		const { programs, gl } = this;
		if (programs[programName]) {
			gl.useProgram(programs[programName].program);
			console.warn(`Already a program with the name ${programName}.`);
			return;
		}
		const fragmentShader = this.compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
		// Load fullscreen quad vertex shader by default.
		// const vertexShader = vertexShaderSource ?
		// 	this.compileShader(vertexShaderSource, gl.VERTEX_SHADER) :
		// 	this.fsQuadVertexShader;
		const vertexShader = this.defaultVertexShader;
		if (!fragmentShader || !vertexShader) {
			this.errorCallback(`Unable to init shaders for program ${programName}.`);
			return;
		}
		
		// Create a program.
		const program = gl.createProgram();
		if (!program) {
			this.errorCallback('Unable to init gl program.');
			return;
		}

		// Attach the shaders.
		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);

		// Link the program.
		gl.linkProgram(program);
		// Check if it linked.
		const success = gl.getProgramParameter(program, gl.LINK_STATUS);
		if (!success) {
			// Something went wrong with the link.
			this.errorCallback(`Program ${programName} filed to link: ${gl.getProgramInfoLog(program)}`);
		}

		// Add new program.
        programs[programName] = {
            program: program,
			uniforms: {},
		};
		
		uniforms?.forEach(uniform => {
			const { name, value, dataType } = uniform;
			this.setProgramUniform(programName, name, value, dataType);
		});
	};

	private uniformTypeForValue(value: number | number[], dataType: UniformDataType) {
		if (dataType === FLOAT_TYPE) {
			if (!isNaN(value as number) || (value as number[]).length === 1) {
				return FLOAT_1D_UNIFORM;
			}
			if ((value as number[]).length === 2) {
				return FLOAT_2D_UNIFORM;
			}
			if ((value as number[]).length === 3) {
				return FLOAT_3D_UNIFORM;
			}
			if ((value as number[]).length === 4) {
				return FLOAT_4D_UNIFORM;
			}
			throw new Error(`Invalid uniform value: ${value}`);
		} else if (dataType === INT_TYPE) {
			if (!isNaN(value as number) || (value as number[]).length === 1) {
				return INT_1D_UNIFORM;
			}
			if ((value as number[]).length === 2) {
				return INT_2D_UNIFORM;
			}
			if ((value as number[]).length === 3) {
				return INT_3D_UNIFORM;
			}
			if ((value as number[]).length === 4) {
				return INT_4D_UNIFORM;
			}
			throw new Error(`Invalid uniform value: ${value}`);
		} else {
			throw new Error(`Invalid uniform data type: ${dataType}`);
		}
	}

	setProgramUniform(
		programName: string,
		uniformName: string,
		value: UniformValueType,
		dataType: UniformDataType,
	) {
		const { gl, programs } = this;

		const program = programs[programName];
		if (!program) {
			throw new Error(`Count not set uniform, no program of name: ${programName}.`);
		}

		// Set active program.
		gl.useProgram(program.program);
	
		const { uniforms } = program;
		const type = this.uniformTypeForValue(value, dataType);
		if (!uniforms[uniformName]) {
			// Init uniform if needed.
			const location = gl.getUniformLocation(program.program, uniformName);
			if (!location) {
				this.errorCallback(`Could not init uniform ${uniformName} for program ${programName}.
Check that uniform is present in shader code, unused uniforms may be removed by compiler.
Also check that uniform type in shader code matches type ${type}.
Error code: ${gl.getError()}.`);
				return;
			}
			uniforms[uniformName] = {
				location,
				type: type,
			}
		}

		const uniform = uniforms[uniformName];
		// Check that types match previously set uniform.
		if (uniform.type != type) {
			throw new Error(`Uniform ${uniformName} cannot change from type ${uniform.type} to type ${type}.`);
		}
		const { location } = uniform;

		// Set uniform.
		// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/uniform
		switch (type) {
			case FLOAT_1D_UNIFORM:
				gl.uniform1f(location, value as number);
				break;
			case FLOAT_2D_UNIFORM:
				gl.uniform2fv(location, value as number[]);
				break;
			case FLOAT_3D_UNIFORM:
				gl.uniform3fv(location, value as number[]);
				break;
			case FLOAT_4D_UNIFORM:
				gl.uniform4fv(location, value as number[]);
				break;
			case INT_1D_UNIFORM:
				gl.uniform1i(location, value as number);
				break;
			case INT_2D_UNIFORM:
				gl.uniform2iv(location, value as number[]);
				break;
			case INT_3D_UNIFORM:
				gl.uniform3iv(location, value as number[]);
				break;
			case INT_4D_UNIFORM:
				gl.uniform4iv(location, value as number[]);
				break;
			default:
				throw new Error(`Unknown uniform type: ${type}.`);
		}
    };

	private initFramebufferForTexture(
		textureName: string,
		shouldOverwrite = false,
	) {
		const { gl, framebuffers } = this;

		if (framebuffers[textureName]){
			if (!shouldOverwrite) console.warn(`Already a framebuffer with the name ${textureName}, use shouldOverwrite flag in initTexture() to ignore.`);
			gl.deleteFramebuffer(framebuffers[textureName]);
		}
		
		const texture = this.textures[textureName];
		if (!texture) {
			throw new Error(`Cannot init framebuffer, texture ${textureName} does not exist.`);
		}

		const framebuffer = gl.createFramebuffer();
		if (!framebuffer) {
			this.errorCallback(`Could not init ${textureName} framebuffer: ${gl.getError()}.`);
			return;
		}
		gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
		// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/framebufferTexture2D
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

		const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
		if(status != gl.FRAMEBUFFER_COMPLETE){
			this.errorCallback(`Invalid status for ${textureName} framebuffer: ${status}.`);
		}

		this.framebuffers[textureName] = framebuffer;
	};

	private glTextureFormatForNumChannels(
		numChannels: TextureNumChannels,
	) {
		// TODO: for read only textures in WebGL 1.0, we could use gl.ALPHA and gl.LUMINANCE_ALPHA here.
		const { gl } = this;
		switch (numChannels) {
			case 1:
				return {
					glFormat: gl.RGB,
					glNumChannels: 3,
				}
			case 2:
				return {
					glFormat: gl.RGB,
					glNumChannels: 3,
				}
			case 3:
				return {
					glFormat: gl.RGB,
					glNumChannels: 3,
				}
			case 4:
				return {
					glFormat: gl.RGBA,
					glNumChannels: 4,
				}
		}
	}
	
	private glTextureTypeForType(
		type: TextureType,
	) {
		const { gl } = this;
		switch (type) {
			case 'float16':
				if ((gl as WebGL2RenderingContext).HALF_FLOAT) return (gl as WebGL2RenderingContext).HALF_FLOAT;
				return (gl as any).HALF_FLOAT_OES as number;
			case 'uint8':
				return gl.UNSIGNED_BYTE;
		}
	}
	
	initTexture(
		textureName: string,
		width: number,
		height: number,
		type: TextureType,
		numChannels: TextureNumChannels,
		writable = false,
		data?: TextureData,
		shouldOverwrite = false,
	) {
		const { gl, textures, framebuffers } = this;
		
        if (textures[textureName]){
            if (!shouldOverwrite) console.warn(`Already a texture with the name ${textureName}, use shouldOverwrite flag to ignore.`);
            gl.deleteTexture(textures[textureName]);
		}
		
		// Check that data is correct length.
		if (data && data.length !== width * height * numChannels) {
			throw new Error(`Invalid data array of size ${data.length} for texture of dimensions ${width} x ${height} x ${numChannels}.`);
		}

		const texture = gl.createTexture();
		if (!texture) {
			this.errorCallback(`Could not init ${textureName} texture: ${gl.getError()}.`);
			return;
		}
		gl.bindTexture(gl.TEXTURE_2D, texture);

		// TODO: dig into this.
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		const filter = gl.NEAREST;//this.linearFilterEnabled ? gl.LINEAR : gl.NEAREST;
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);

		// TODO: Check that data is correct type.
		// if (data && type === 'float16') {
		// 	// // Since there is no Float16TypedArray, we must convert Float32
		// 	// // to Float16 and pass in as an Int16TypedArray.
		// 	// const float16Array = new Int16Array(data.length);
		// 	// for (let i = 0; i < data.length; i++) {
		// 	// }
		// }

		// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D
		const { glFormat, glNumChannels } = this.glTextureFormatForNumChannels(numChannels);
		const glType = this.glTextureTypeForType(type);
		// Check that data is correct length.
		if (data && numChannels !== glNumChannels) {
			const imageSize = width * height;
			let newArray: TextureData;
			switch (type) {
				case 'uint8':
					newArray = new Uint8Array(width * height * glNumChannels);
					break;
				default:
					throw new Error(`Unsupported type ${type} for initTexture.`);
			}
			// Fill new data array with old data.
			for (let i = 0; i < imageSize; i++) {
				for (let j = 0; j < numChannels; j++) {
					newArray[glNumChannels * i + j] = data[i * numChannels + j];
				}
			}
			data = newArray;
		}
		gl.texImage2D(gl.TEXTURE_2D, 0, glFormat, width, height, 0, glFormat, glType, data ? data : null);

		textures[textureName] = texture;

		if (!writable) {
			// Delete unused framebuffer if needed.
			if (shouldOverwrite && framebuffers[textureName]){
				gl.deleteFramebuffer(framebuffers[textureName]);
				delete framebuffers[textureName];
			}
			return;
		}

		// Init a framebuffer for this texture so we can write to it.
		this.initFramebufferForTexture(textureName, shouldOverwrite);
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

	private _step(
		programName: string,
		inputTextures: string[],
		outputTexture?: string, // Undefined renders to screen.
	) {
		const { gl, programs, framebuffers } = this;
		const program = programs[programName];
		if (!program) {
			throw new Error(`Invalid program name: ${programName}.`);
		}
		gl.useProgram(program.program);

		const framebuffer = outputTexture ? framebuffers[outputTexture] : null;
		if (framebuffer === undefined) {
			throw new Error(`Invalid output texture: ${outputTexture}.`);
		}
		gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
		
		for (let i = 0; i < inputTextures.length; i++) {
			gl.activeTexture(gl.TEXTURE0 + i);
			gl.bindTexture(gl.TEXTURE_2D, this.textures[inputTextures[i]]);
		}

		// Point attribute to the currently bound VBO.
		const positionLocation = gl.getAttribLocation(program.program, 'aPosition');
		gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
		// Enable the attribute.
		gl.enableVertexAttribArray(positionLocation);
	};
	
	// Step for entire fullscreen quad.
	step(
		programName: string,
		inputTextures: string[] = [],
		outputTexture?: string, // Undefined renders to screen.
	) {
		const { gl, errorState, quadPositionsBuffer } = this;

		// Ignore if we are in error state.
		if (errorState) {
			return;
		}
		// Update uniforms and buffers.
		this.setProgramUniform(programName, 'u_scale', [1, 1], 'FLOAT');
		gl.bindBuffer(gl.ARRAY_BUFFER, quadPositionsBuffer);
		this._step(programName, inputTextures, outputTexture);
		// Draw.
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	}

	// Step program only for a strip of px along the boundary.
	stepBoundary(
		programName: string,
		inputTextures: string[] = [],
		outputTexture?: string, // Undefined renders to screen.
	) {
		const { gl, errorState, boundaryPositionsBuffer } = this;

		// Ignore if we are in error state.
		if (errorState) {
			return;
		}
		// Update uniforms and buffers.
		this.setProgramUniform(programName, 'u_scale', [1, 1], 'FLOAT');
		gl.bindBuffer(gl.ARRAY_BUFFER, boundaryPositionsBuffer);
		this._step(programName, inputTextures, outputTexture);
		// Draw.
		gl.drawArrays(gl.LINE_LOOP, 0, 4);// Draw to framebuffer.
	}

	// // Step program for all but a strip of px along the boundary.
	// stepNonBoundary(
	// 	programName: string,
	// 	inputTextures: string[] = [],
	// 	outputTexture?: string, // Undefined renders to screen.
	// ) {
	// 	const { gl, errorState } = this;

	// 	// Ignore if we are in error state.
	// 	if (errorState) {
	// 		return;
	// 	}

	// 	this._step(programName, inputTextures, outputTexture);
	// 	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);// Draw to framebuffer.
	// }

	// Step program only for a circular spot.
	stepCircle(
		programName: string,
		position: [number, number], // position is in screen space coords.
		radius: number, // radius is in px.
		inputTextures: string[] = [],
		outputTexture?: string, // Undefined renders to screen.
	) {
		const { gl, errorState, circlePositionsBuffer, width, height } = this;

		// Ignore if we are in error state.
		if (errorState) {
			return;
		}

		// Update uniforms and buffers.
		this.setProgramUniform(programName, 'u_scale', [radius / width, radius / height], 'FLOAT');
		this.setProgramUniform(programName, 'u_translation', [2 * position[0] / width - 1, 2 * position[1] / height - 1], 'FLOAT');
		gl.bindBuffer(gl.ARRAY_BUFFER, circlePositionsBuffer);
		this._step(programName, inputTextures, outputTexture);
		// Draw.
		gl.drawArrays(gl.TRIANGLE_FAN, 0, NUM_SEGMENTS_CIRCLE + 2);// Draw to framebuffer.
	}

    swapTextures(
		texture1Name: string,
		texture2Name: string,
	) {
        let temp = this.textures[texture1Name];
        this.textures[texture1Name] = this.textures[texture2Name];
        this.textures[texture2Name] = temp;
        temp = this.framebuffers[texture1Name];
        this.framebuffers[texture1Name] = this.framebuffers[texture2Name];
        this.framebuffers[texture2Name] = temp;
    };

    // swap3Textures(
	// 	texture1Name: string,
	// 	texture2Name: string,
	// 	texture3Name: string,
	// ) {
    //     let temp = this.textures[texture3Name];
    //     this.textures[texture3Name] = this.textures[texture2Name];
    //     this.textures[texture2Name] = this.textures[texture1Name];
    //     this.textures[texture1Name] = temp;
    //     temp = this.framebuffers[texture3Name];
    //     this.framebuffers[texture3Name] = this.framebuffers[texture2Name];
    //     this.framebuffers[texture2Name] = this.framebuffers[texture1Name];
    //     this.framebuffers[texture1Name] = temp;
    // };

    // readyToRead() {
	// 	const { gl } = this;
    //     return gl.checkFramebufferStatus(gl.FRAMEBUFFER) == gl.FRAMEBUFFER_COMPLETE;
    // };

    // readPixels(xMin: number, yMin: number, width: number, height: number, array: TextureDataType) {
	// 	const { gl } = this;
	// 	gl.readPixels(xMin, yMin, width, height, gl.RGBA, gl.UNSIGNED_BYTE, array);
    // };

    reset() {
		// TODO: make sure we are actually deallocating resources here.
		const { gl, programs, framebuffers, textures, shaders, defaultVertexShader } = this;
		
		// Unbind all data before deleting.
		Object.keys(programs).forEach(key => {
			const program = programs[key].program;
			gl.deleteProgram(program);
			delete programs[key];
		});
		Object.keys(framebuffers).forEach(key => {
			const framebuffer = framebuffers[key];
			gl.deleteFramebuffer(framebuffer);
			delete framebuffers[key];
		});
        Object.keys(textures).forEach(key => {
			const texture = textures[key];
			gl.deleteTexture(texture);
			delete textures[key];
		});
		for (let i = shaders.length - 1; i >= 0; i--) {
			if (shaders[i] === defaultVertexShader) {
				continue;
			}
			// From https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/deleteShader
			// This method has no effect if the shader has already been deleted
			gl.deleteShader(shaders[i]);
			shaders.splice(i, 1);
		}
    };
}