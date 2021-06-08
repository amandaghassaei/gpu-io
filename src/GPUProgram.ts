import { isArray, isInteger, isNumber, isString } from './Checks';
import {
	FLOAT,
	FLOAT_1D_UNIFORM, FLOAT_2D_UNIFORM, FLOAT_3D_UNIFORM, FLOAT_4D_UNIFORM,
	INT,
	INT_1D_UNIFORM, INT_2D_UNIFORM, INT_3D_UNIFORM, INT_4D_UNIFORM,
	Uniform, UniformDataType, UniformValueType,
} from './Constants';
import { compileShader } from './utils';



export class GPUProgram {
	readonly name: string;
	private readonly gl: WebGLRenderingContext | WebGL2RenderingContext;
	private readonly errorCallback: (message: string) => void;
	readonly glProgram?: WebGLProgram;
	private readonly uniforms: { [ key: string]: Uniform } = {};
	private readonly shaders: WebGLShader[] = []; // Save ref to shaders so we can deallocate.

	constructor(
		params: {
			gl: WebGLRenderingContext | WebGL2RenderingContext,
			name: string,
			fragmentShader: string | string[] | WebGLShader,// We may want to pass in an array of shader string sources, if split across several files.
			vertexShader: string |  WebGLShader,
			errorCallback: (message: string) => void,
			uniforms?: {
				name: string,
				value: UniformValueType,
				dataType: UniformDataType,
			}[],
			defines?: {// We'll allow some variables to be passed in as #define to the preprocessor for the fragment shader.
				[key: string]: string, // We'll do these as strings to make it easier to control float vs int.
			},
		},
		
	) {
		const { gl, errorCallback, name, fragmentShader, vertexShader, uniforms, defines } = params;

		// Save arguments.
		this.gl = gl;
		this.errorCallback = errorCallback;
		this.name = name;

		// Create a program.
		const glProgram = gl.createProgram();
		if (!glProgram) {
			errorCallback(`Unable to init gl program: ${name}.`);
			return;
		}

		// Compile shaders.
		// TODO: check that attachShader worked.
		if (typeof(fragmentShader) === 'string' || typeof((fragmentShader as string[])[0]) === 'string') {
			let sourceString = typeof(fragmentShader) === 'string' ?
				fragmentShader :
				(fragmentShader as string[]).join('\n');
			if (defines) {
				// First convert defines to a string.
				const definesSource = Object.keys(defines).map(key => {
					// Check that define is passed in as a string.
					if (!isString(key) || !isString(defines[key])) {
						throw new Error(`GPUProgram defines must be passed in as key value pairs that are both strings, got key value pair of type ${typeof key} : ${typeof defines[key]}.`)
					}
					return `#define ${key} ${defines[key]}\n`;
				}).join('\n');
				sourceString = definesSource + sourceString;
			}
			const shader = compileShader(gl, errorCallback, sourceString, gl.FRAGMENT_SHADER, name);
			if (!shader) {
				errorCallback(`Unable to compile fragment shader for program "${name}".`);
				return;
			}
			this.shaders.push(shader);
			gl.attachShader(glProgram, shader);
		} else {
			if (defines) {
				throw new Error(`Unable to attach defines to program "${name}" because fragment shader is already compiled.`);
			}
			gl.attachShader(glProgram, fragmentShader);
		}
		if (typeof(vertexShader) === 'string') {
			const shader = compileShader(gl, errorCallback, vertexShader, gl.VERTEX_SHADER, name);
			if (!shader) {
				errorCallback(`Unable to compile vertex shader for program "${name}".`);
				return;
			}
			this.shaders.push(shader);
			gl.attachShader(glProgram, shader);
		} else {
			gl.attachShader(glProgram, vertexShader);
		}

		// Link the program.
		gl.linkProgram(glProgram);
		// Check if it linked.
		const success = gl.getProgramParameter(glProgram, gl.LINK_STATUS);
		if (!success) {
			// Something went wrong with the link.
			errorCallback(`Program "${name}" failed to link: ${gl.getProgramInfoLog(glProgram)}`);
			return;
		}

		// Program has been successfully inited.
		this.glProgram = glProgram;

		uniforms?.forEach(uniform => {
			const { name, value, dataType } = uniform;
			this.setUniform(name, value, dataType);
		});
	}

	private uniformTypeForValue(
		value: number | number[],
		dataType: UniformDataType,
	) {
		if (dataType === FLOAT) {
			// Check that we are dealing with a number.
			if (isArray(value)) {
				(value as number[]).forEach(element => {
					if (!isNumber(element)) {
						throw new Error(`Invalid uniform value: ${value} for program "${this.name}", expected float or float[] of length 1-4.`);
					}
				});
			} else {
				if (!isNumber(value)) {
					throw new Error(`Invalid uniform value: ${value} for program "${this.name}", expected float or float[] of length 1-4.`);
				}
			}
			if (!isArray(value) || (value as number[]).length === 1) {
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
			throw new Error(`Invalid uniform value: ${value} for program "${this.name}", expected float or float[] of length 1-4.`);
		} else if (dataType === INT) {
			// Check that we are dealing with an int.
			if (isArray(value)) {
				(value as number[]).forEach(element => {
					if (!isInteger(element)) {
						throw new Error(`Invalid uniform value: ${value} for program "${this.name}", expected int or int[] of length 1-4.`);
					}
				});
			} else {
				if (!isInteger(value)) {
					throw new Error(`Invalid uniform value: ${value} for program "${this.name}", expected int or int[] of length 1-4.`);
				}
			}
			if (!isArray(value) || (value as number[]).length === 1) {
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
			throw new Error(`Invalid uniform value: ${value} for program "${this.name}", expected int or int[] of length 1-4.`);
		} else {
			throw new Error(`Invalid uniform data type: ${dataType} for program "${this.name}", expected ${FLOAT} or ${INT}.`);
		}
	}

	setUniform(
		uniformName: string,
		value: UniformValueType,
		dataType: UniformDataType,
	) {
		const { gl, errorCallback, glProgram, uniforms } = this;

		if (!glProgram) {
			errorCallback(`GLProgram for GPUProgram "${this.name}" not inited.`);
			return;
		}

		// Set active program.
		gl.useProgram(glProgram);
	
		const type = this.uniformTypeForValue(value, dataType);
		if (!uniforms[uniformName]) {
			// Init uniform if needed.
			const location = gl.getUniformLocation(glProgram, uniformName);
			if (!location) {
				errorCallback(`Could not init uniform "${uniformName}" for program "${this.name}".
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
			throw new Error(`Uniform "${uniformName}" for GPUProgram "${this.name}" cannot change from type ${uniform.type} to type ${type}.`);
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
				throw new Error(`Unknown uniform type ${type} for GPUProgram "${this.name}".`);
		}
	};

	destroy() {
		const { gl, glProgram, shaders } = this;
		if (glProgram) gl.deleteProgram(glProgram);
		// Unbind all data before deleting.
		for (let i = 0; i < shaders.length; i++) {
			// From https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/deleteShader
			// This method has no effect if the shader has already been deleted
			gl.deleteShader(shaders[i]);
		}
		shaders.length = 0;
		// @ts-ignore
		delete this.gl;
		// @ts-ignore
		delete this.errorCallback;
		// @ts-ignore
		delete this.program;
	}
}
