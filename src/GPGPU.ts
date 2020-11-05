import fsRectVertexShaderSource from './kernels/FSRectVertexShader';
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
type UniformValueType = number | [number, number] | [number, number, number] | [number, number, number, number];
type Uniform = { 
	location: WebGLUniformLocation,
	type: UniformType,
};

type Program = {
	program: WebGLProgram,
	uniforms: { [ key: string]: Uniform },
};

// Store extensions as constants.
const OES_TEXTURE_HALF_FLOAT = 'OES_texture_half_float';
const OES_TEXTURE_HAlF_FLOAT_LINEAR = 'OES_texture_half_float_linear';

export class GPGPU {
	private readonly gl!: WebGLRenderingContext | WebGL2RenderingContext;

	private errorState = false;
	private readonly errorCallback: (message: string) => void;

	private readonly programs: { [ key: string ] : Program } = {}; // All current gl programs.
	private readonly textures: { [ key: string ] : WebGLTexture } = {}; // All current gl textures.
	private readonly framebuffers: { [ key: string ] : WebGLFramebuffer } = {}; // All current gl framebuffers.
	private readonly shaders: WebGLShader[] = []; // Keep track of all shaders inited so they can be properly deallocated.
	private readonly fsRectVertexShader!: WebGLShader;
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

		// Init a default vertex shader that just passes through screen coords.
		const fsRectVertexShader = this.compileShader(fsRectVertexShaderSource, gl.VERTEX_SHADER);
		if (!fsRectVertexShader) {
			errorCallback('Unable to initialize fullscreen rect vertex shader.');
			return;
		}
		this.fsRectVertexShader = fsRectVertexShader;

		// Canvas setup.
		this.onResize(canvasEl);

		// Log number of textures available.
		const maxTexturesInFragmentShader = this.gl.getParameter(this.gl.MAX_TEXTURE_IMAGE_UNITS);
		console.log(`${maxTexturesInFragmentShader} textures max.`);
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

	private loadFSRectPositions(program: WebGLProgram) {
		const { gl } = this;
		gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([ -1, -1, 1, -1, -1, 1, 1, 1 ]), gl.STATIC_DRAW);
	
		// Look up where the vertex data needs to go.
		const positionLocation = gl.getAttribLocation(program, 'position');
		gl.enableVertexAttribArray(positionLocation);
		gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
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
		vertexShaderSource?: string,
	) {
		const { programs, gl } = this;
		if (programs[programName]) {
			gl.useProgram(programs[programName].program);
			console.warn(`Already a program with the name ${programName}.`);
			return;
		}
		const fragmentShader = this.compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
		// Load fullscreen rect vertex shader by default.
		const vertexShader = vertexShaderSource ?
			this.compileShader(vertexShaderSource, gl.VERTEX_SHADER) :
			this.fsRectVertexShader;
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

		if (!vertexShaderSource) {
			// Load fullscreen rect vertex shader by default.
			this.loadFSRectPositions(program);
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

	// private setUniformForProgram(programName: string, uniformName: string, value: number, type: '1f'): void;
	// private setUniformForProgram(programName: string, uniformName: string, value: [number, number], type: '2f'): void;
	// private setUniformForProgram(programName: string, uniformName: string, value: [number, number, number], type: '3f'): void;
	// private setUniformForProgram(programName: string, uniformName: string, value: number, type: '1i'): void;
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
			if (!shouldOverwrite) console.warn(`Already a framebuffer with the name ${textureName}.`);
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
            if (!shouldOverwrite) console.warn(`Already a texture with the name ${textureName}.`);
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
		const filter = this.linearFilterEnabled ? gl.LINEAR : gl.NEAREST;
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
		this.initFramebufferForTexture(textureName);
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
	};

	step(
		programName: string,
		inputTextures: string[],
		outputTexture: string | null, // Null renders to screen.
		time?: number,
	) {
		// Ignore if we are in error state.
		if (this.errorState) {
			return;
		}
		const { gl, programs } = this;
		const program = programs[programName];
		if (program) gl.useProgram(program.program);
		else throw new Error(`Invalid program name: ${programName}.`);

		// // Optionally set time.
        // if (time) {
		// 	this.setUniformForProgram(programName, 'u_time', time, '1f');
		// }

		if (outputTexture) {
			gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffers[outputTexture]);
		} else {
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		}
        
        for (let i = 0; i < inputTextures.length; i++) {
            gl.activeTexture(gl.TEXTURE0 + i);
            gl.bindTexture(gl.TEXTURE_2D, this.textures[inputTextures[i]]);
        }
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);// Draw to framebuffer.
    };

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
		const { gl, programs, framebuffers, textures } = this;
		
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
		for (let i = this.shaders.length - 1; i >= 0; i--) {
			if (this.shaders[i] === this.fsRectVertexShader) {
				continue;
			}
			// From https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/deleteShader
			// This method has no effect if the shader has already been deleted
			gl.deleteShader(this.shaders[i]);
			this.shaders.splice(i, 1);
		}
    };
}