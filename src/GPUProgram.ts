import { compileShader, isWebGL2 } from './utils';

// Uniform types.
const FLOAT_1D_UNIFORM = '1f';
const FLOAT_2D_UNIFORM = '2f';
const FLOAT_3D_UNIFORM = '3f';
const FLOAT_4D_UNIFORM = '3f';
const INT_1D_UNIFORM = '1i';
const INT_2D_UNIFORM = '2i';
const INT_3D_UNIFORM = '3i';
const INT_4D_UNIFORM = '3i';

export type UniformDataType = 'FLOAT' | 'INT';
export type UniformValueType = 
	number |
	[number] |
	[number, number] |
	[number, number, number] |
	[number, number, number, number];
type UniformType = 
	typeof FLOAT_1D_UNIFORM |
	typeof FLOAT_2D_UNIFORM |
	typeof FLOAT_3D_UNIFORM |
	typeof FLOAT_4D_UNIFORM |
	typeof INT_1D_UNIFORM |
	typeof INT_2D_UNIFORM |
	typeof INT_3D_UNIFORM |
	typeof INT_4D_UNIFORM;
type Uniform = { 
	location: WebGLUniformLocation,
	type: UniformType,
};

export type AttributeDataType = 'float32' | 'float16' | 'uint8' | 'int8' | 'uint16' | 'int16';
type Attribute = { 
	location: number,
	type: AttributeDataType,
};

export class GPUProgram {
	readonly name: string;
	private readonly gl: WebGLRenderingContext | WebGL2RenderingContext;
	private readonly errorCallback: (message: string) => void;
	readonly program?: WebGLProgram;
	private readonly uniforms: { [ key: string]: Uniform } = {};
	private readonly shaders: WebGLShader[] = []; // Save ref to shaders so we can deallocate.
	private readonly attributes: { [ key: string]: Attribute } = {};
	private readonly attributeNames: string[] = [];

	constructor(
		name: string,
		gl: WebGLRenderingContext | WebGL2RenderingContext,
		errorCallback: (message: string) => void,
		vertexShaderOrSource: string |  WebGLShader,
		fragmentShaderOrSource: string | string[] | WebGLShader,// We may want to pass in an array of shader string sources, if split across several files.
		uniforms?: {
			name: string,
			value: UniformValueType,
			dataType: UniformDataType,
		}[],
		defines?: {// For now, we'll allow some variables to be passed in as #define to the preprocessor.
			[key: string]: string, // We'll do these as strings to make it easier to control float vs int.
		},
	) {
		// Save params.
		this.name = name;
		this.gl = gl;
		this.errorCallback = errorCallback;

		// Create a program.
		const program = gl.createProgram();
		if (!program) {
			errorCallback(`Unable to init gl program: ${name}.`);
			return;
		}

		// Compile shaders.
		if (typeof(fragmentShaderOrSource) === 'string' || typeof((fragmentShaderOrSource as string[])[0]) === 'string') {
			let sourceString = typeof(fragmentShaderOrSource) === 'string' ?
				fragmentShaderOrSource :
				(fragmentShaderOrSource as string[]).join('\n');
			if (defines) {
				// First convert defines to a string.
				const definesSource = Object.keys(defines).map(key => {
					return `#define ${key} ${defines[key]}\n`;
				}).join('\n');
				sourceString = definesSource + sourceString;
			}
			const fragmentShader = compileShader(gl, errorCallback, sourceString, gl.FRAGMENT_SHADER, name);
			if (!fragmentShader) {
				errorCallback(`Unable to compile fragment shader for program ${name}.`);
				return;
			}
			this.shaders.push(fragmentShader);
			gl.attachShader(program, fragmentShader);
		} else {
			if (defines) {
				throw new Error(`Unable to attach defines to program ${name} because it is already compiled.`);
			}
			gl.attachShader(program, fragmentShaderOrSource);
		}
		if (typeof(vertexShaderOrSource) === 'string') {
			const vertexShader = compileShader(gl, errorCallback, vertexShaderOrSource, gl.VERTEX_SHADER, name);
			if (!vertexShader) {
				errorCallback(`Unable to compile vertex shader for program ${name}.`);
				return;
			}
			this.shaders.push(vertexShader);
			gl.attachShader(program, vertexShader);
		} else {
			gl.attachShader(program, vertexShaderOrSource);
		}

		// Link the program.
		gl.linkProgram(program);
		// Check if it linked.
		const success = gl.getProgramParameter(program, gl.LINK_STATUS);
		if (!success) {
			// Something went wrong with the link.
			errorCallback(`Program ${name} failed to link: ${gl.getProgramInfoLog(program)}`);
			return;
		}

		// Program has been successfully inited.
		this.program = program;

		uniforms?.forEach(uniform => {
			const { name, value, dataType } = uniform;
			this.setUniform(name, value, dataType);
		});
	}

	private uniformTypeForValue(
		value: number | number[],
		dataType: UniformDataType,
	) {
		if (dataType === 'FLOAT') {
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
		} else if (dataType === 'INT') {
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

	setUniform(
		uniformName: string,
		value: UniformValueType,
		dataType: UniformDataType,
	) {
		const { gl, errorCallback, program, uniforms } = this;

		if (!program) {
			errorCallback(`Program not inited.`);
			return;
		}

		// Set active program.
		gl.useProgram(program);
	
		const type = this.uniformTypeForValue(value, dataType);
		if (!uniforms[uniformName]) {
			// Init uniform if needed.
			const location = gl.getUniformLocation(program, uniformName);
			if (!location) {
				errorCallback(`Could not init uniform ${uniformName} for program ${this.name}.
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

	setVertexAttribute(
		attributeName: string,
		dataType: AttributeDataType,
	) {
		const { gl, errorCallback, program, attributes, attributeNames } = this;

		if (!program) {
			errorCallback(`Program not inited.`);
			return;
		}

		if (!isWebGL2(gl)) {
			// TODO: provide a fallback here.
			throw new Error('Must use a webgl2 context for transform feedback.');
		}

		// Set active program.
		gl.useProgram(program);
	
		if (!attributes[attributeName]) {
			// Init uniform if needed.
			const location = gl.getAttribLocation(program, attributeName);
			if (!location) {
				errorCallback(`Could not init vertexAttribute ${attributeName}. Error code: ${gl.getError()}.`);
				return;
			}
			attributes[attributeName] = {
				location,
				type: dataType,
			}
			attributeNames.push(attributeName);
		}

		const attribute = attributes[attributeName];
		// Check that types match previously set uniform.
		if (attribute.type != dataType) {
			throw new Error(`Vertex attribute ${attributeName} cannot change from type ${attribute.type} to type ${dataType}.`);
		}
	}

	getAttributeLocation(index: number) {
		const { attributes, attributeNames, name } = this;
		const attributeName = attributeNames[index];
		if (!attributeName) {
			throw new Error(`Invalid attribute index ${index} for program ${name}, current attributes: ${attributeNames.join(', ')}.`);
		}
		const attribute = attributes[attributeName];
		if (!attribute) {
			throw new Error(`Invalid attribute ${attributeName} for program ${name}.`);
		}
		return attribute.location;
	}

	destroy() {
		const { gl, program, shaders } = this;
		if (program) gl.deleteProgram(program);
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
