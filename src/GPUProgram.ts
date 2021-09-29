import { isArray, isInteger, isNumber, isString } from './Checks';
import {
	FLOAT,
	FLOAT_1D_UNIFORM, FLOAT_2D_UNIFORM, FLOAT_3D_UNIFORM, FLOAT_4D_UNIFORM,
	GLSL3,
	GLSLVersion,
	INT,
	INT_1D_UNIFORM, INT_2D_UNIFORM, INT_3D_UNIFORM, INT_4D_UNIFORM,
	Uniform, UniformDataType, UniformType, UniformValueType,
} from './Constants';
import { compileShader } from './utils';

const DEFAULT_PROGRAM_NAME = 'DEFAULT';
const DEFAULT_W_UV_PROGRAM_NAME = 'DEFAULT_W_UV';
const DEFAULT_W_NORMAL_PROGRAM_NAME = 'DEFAULT_W_NORMAL';
const DEFAULT_W_UV_NORMAL_PROGRAM_NAME = 'DEFAULT_W_UV_NORMAL';
const SEGMENT_PROGRAM_NAME = 'SEGMENT';
const DATA_LAYER_POINTS_PROGRAM_NAME = 'DATA_LAYER_POINTS';
const DATA_LAYER_LINES_PROGRAM_NAME = 'DATA_LAYER_LINES';
const DATA_LAYER_VECTOR_FIELD_PROGRAM_NAME = 'DATA_LAYER_VECTOR_FIELD';
type PROGRAM_NAMES =
	typeof DEFAULT_PROGRAM_NAME |
	typeof DEFAULT_W_UV_PROGRAM_NAME |
	typeof DEFAULT_W_NORMAL_PROGRAM_NAME |
	typeof DEFAULT_W_UV_NORMAL_PROGRAM_NAME |
	typeof SEGMENT_PROGRAM_NAME |
	typeof DATA_LAYER_POINTS_PROGRAM_NAME |
	typeof DATA_LAYER_LINES_PROGRAM_NAME |
	typeof DATA_LAYER_VECTOR_FIELD_PROGRAM_NAME;

const vertexShaders: {[key in PROGRAM_NAMES]: {
	src_1: string,
	src_3: string,
	shader?: WebGLProgram,
	defines?: {[key: string]: string},
}} = {
	[DEFAULT_PROGRAM_NAME]: {
		src_1: './glsl_1/DefaultVertexShader.glsl',
		src_3: './glsl_3/DefaultVertexShader.glsl',
	},
	[DEFAULT_W_UV_PROGRAM_NAME]: {
		src_1: './glsl_1/DefaultVertexShader.glsl',
		src_3: './glsl_3/DefaultVertexShader.glsl',
		defines: {
			'UV_ATTRIBUTE': '1',
		},
	},
	[DEFAULT_W_NORMAL_PROGRAM_NAME]: {
		src_1: './glsl_1/DefaultVertexShader.glsl',
		src_3: './glsl_3/DefaultVertexShader.glsl',
		defines: {
			'NORMAL_ATTRIBUTE': '1',
		},
	},
	[DEFAULT_W_UV_NORMAL_PROGRAM_NAME]: {
		src_1: './glsl_1/DefaultVertexShader.glsl',
		src_3: './glsl_3/DefaultVertexShader.glsl',
		defines: {
			'UV_ATTRIBUTE': '1',
			'NORMAL_ATTRIBUTE': '1',
		},
	},
	[SEGMENT_PROGRAM_NAME]: {
		src_1: './glsl_1/SegmentVertexShader.glsl',
		src_3: './glsl_3/SegmentVertexShader.glsl',
	},
	[DATA_LAYER_POINTS_PROGRAM_NAME]: {
		src_1: './glsl_1/DataLayerPointsVertexShader.glsl',
		src_3: './glsl_3/DataLayerPointsVertexShader.glsl',
	},
	[DATA_LAYER_VECTOR_FIELD_PROGRAM_NAME]: {
		src_1: './glsl_1/DataLayerVectorFieldVertexShader.glsl',
		src_3: './glsl_3/DataLayerVectorFieldVertexShader.glsl',
	},
	[DATA_LAYER_LINES_PROGRAM_NAME]: {
		src_1: './glsl_1/DataLayerLinesVertexShader.glsl',
		src_3: './glsl_3/DataLayerLinesVertexShader.glsl',
	},
};

export class GPUProgram {
	readonly name: string;
	private readonly gl: WebGLRenderingContext | WebGL2RenderingContext;
	private readonly errorCallback: (message: string) => void;
	private readonly glslVersion: GLSLVersion;
	private readonly uniforms: { [ key: string]: Uniform } = {};
	private readonly fragmentShader!: WebGLShader;
	// Store gl programs.
	private programs: {[key in PROGRAM_NAMES]?: WebGLProgram } = {};

	constructor(
		params: {
			gl: WebGLRenderingContext | WebGL2RenderingContext,
			name: string,
			fragmentShader: string | string[] | WebGLShader,// We may want to pass in an array of shader string sources, if split across several files.
			errorCallback: (message: string) => void,
			glslVersion: GLSLVersion,
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
		const { gl, errorCallback, name, fragmentShader, glslVersion, uniforms, defines } = params;

		// Save arguments.
		this.gl = gl;
		this.errorCallback = errorCallback;
		this.name = name;
		this.glslVersion = glslVersion;

		// Compile fragment shader.
		if (typeof(fragmentShader) === 'string' || typeof((fragmentShader as string[])[0]) === 'string') {
			let sourceString = typeof(fragmentShader) === 'string' ?
				fragmentShader :
				(fragmentShader as string[]).join('\n');
			if (defines) {
				sourceString = GPUProgram.convertDefinesToString(defines) + sourceString;
			}
			const shader = compileShader(gl, errorCallback, sourceString, gl.FRAGMENT_SHADER, name);
			if (!shader) {
				errorCallback(`Unable to compile fragment shader for program "${name}".`);
				return;
			}
			this.fragmentShader = shader;
		} else {
			if (defines) {
				throw new Error(`Unable to attach defines to program "${name}" because fragment shader is already compiled.`);
			}
		}

		if (uniforms) {
			for (let i = 0; i < uniforms?.length; i++) {
				const { name, value, dataType } = uniforms[i];
				this.setUniform(name, value, dataType);
			}
		}
	}

	private static convertDefinesToString(defines: {[key: string]: string}) {
		let definesSource = '';
		const keys = Object.keys(defines);
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			// Check that define is passed in as a string.
			if (!isString(key) || !isString(defines[key])) {
				throw new Error(`GPUProgram defines must be passed in as key value pairs that are both strings, got key value pair of type ${typeof key} : ${typeof defines[key]}.`)
			}
			definesSource += `#define ${key} ${defines[key]}\n`;
		}
		return definesSource;
	}

	private initProgram(vertexShader: WebGLShader, programName: string) {
		const { gl, fragmentShader, errorCallback, uniforms } = this;
		// Create a program.
		const program = gl.createProgram();
		if (!program) {
			errorCallback(`Unable to init gl program: ${name}.`);
			return;
		}
		// TODO: check that attachShader worked.
		gl.attachShader(program, fragmentShader);
		gl.attachShader(program, vertexShader);
		// Link the program.
		gl.linkProgram(program);
		// Check if it linked.
		const success = gl.getProgramParameter(program, gl.LINK_STATUS);
		if (!success) {
			// Something went wrong with the link.
			errorCallback(`Program "${name}" failed to link: ${gl.getProgramInfoLog(program)}`);
			return;
		}
		// If we have any uniforms set for this GPUProgram, add those to WebGLProgram we just inited.
		const uniformNames = Object.keys(uniforms);
		for (let i = 0; i < uniformNames.length; i++) {
			const uniformName = uniformNames[i];
			const uniform = uniforms[uniformName];
			const { value, type } = uniform;
			this.setProgramUniform(program, programName, uniformName, value, type);
		}
		return program;
	}

	private getProgramWithName(name: PROGRAM_NAMES) {
		if (this.programs[name]) return this.programs[name];
		const { errorCallback } = this;
		const vertexShader = vertexShaders[name];
		if (vertexShader.shader === undefined) {
			const { gl, name, glslVersion } = this;
			// Init a vertex shader.
			let vertexShaderSource = require(glslVersion === GLSL3 ? vertexShader.src_3 : vertexShader.src_1);
			if (vertexShader.defines) {
				vertexShaderSource = GPUProgram.convertDefinesToString(vertexShader.defines) + vertexShaderSource;
			}
			const shader = compileShader(gl, errorCallback, vertexShaderSource, gl.VERTEX_SHADER, name);
			if (!shader) {
				errorCallback(`Unable to compile default vertex shader for program "${name}".`);
				return;
			}
			vertexShader.shader = shader;
		}
		const program = this.initProgram(vertexShader.shader, DEFAULT_PROGRAM_NAME);
		if (program === undefined) {
			errorCallback(`Unable to init program "${name}".`);
			return;
		}
		this.programs[name] = program;
		return program;
	}

	get defaultProgram() {
		return this.getProgramWithName(DEFAULT_PROGRAM_NAME);
	}

	get defaultProgramWithUV() {
		return this.getProgramWithName(DEFAULT_W_UV_PROGRAM_NAME);
	}

	get defaultProgramWithNormal() {
		return this.getProgramWithName(DEFAULT_W_NORMAL_PROGRAM_NAME);
	}

	get defaultProgramWithUVNormal() {
		return this.getProgramWithName(DEFAULT_W_UV_NORMAL_PROGRAM_NAME);
	}

	get segmentProgram() {
		return this.getProgramWithName(SEGMENT_PROGRAM_NAME);
	}

	get dataLayerPointsProgram() {
		return this.getProgramWithName(DATA_LAYER_POINTS_PROGRAM_NAME);
	}

	get dataLayerVectorFieldProgram() {
		return this.getProgramWithName(DATA_LAYER_VECTOR_FIELD_PROGRAM_NAME);
	}

	get dataLayerLinesProgram() {
		return this.getProgramWithName(DATA_LAYER_LINES_PROGRAM_NAME);
	}

	private uniformTypeForValue(
		value: number | number[],
		dataType: UniformDataType,
	) {
		if (dataType === FLOAT) {
			// Check that we are dealing with a number.
			if (isArray(value)) {
				for (let i = 0; i < (value as number[]).length; i++) {
					if (!isNumber((value as number[])[i])) {
						throw new Error(`Invalid uniform value: ${value} for program "${this.name}", expected float or float[] of length 1-4.`);
					}
				}
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
				for (let i = 0; i < (value as number[]).length; i++) {
					if (!isInteger((value as number[])[i])) {
						throw new Error(`Invalid uniform value: ${value} for program "${this.name}", expected int or int[] of length 1-4.`);
					}
				}
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

	private setProgramUniform(
		program: WebGLProgram,
		programName: string,
		uniformName: string,
		value: UniformValueType,
		type: UniformType,
	) {
		const { gl, uniforms, errorCallback } = this;
		// Set active program.
		gl.useProgram(program);

		let location = uniforms[uniformName]?.location[programName];
		// Init a location for WebGLProgram if needed.
		if (location === undefined) {
			const _location = gl.getUniformLocation(program, uniformName);
			if (!_location) {
				errorCallback(`Could not init uniform "${uniformName}" for program "${this.name}".
Check that uniform is present in shader code, unused uniforms may be removed by compiler.
Also check that uniform type in shader code matches type ${type}.
Error code: ${gl.getError()}.`);
				return;
			}
			location = _location;
			// Save location for future use.
			if (uniforms[uniformName]) {
				uniforms[uniformName].location[programName] = location;
			}
		}

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
	}

	setUniform(
		uniformName: string,
		value: UniformValueType,
		dataType?: UniformDataType,
	) {
		const { programs, uniforms } = this;

		let type = uniforms[uniformName]?.type;
		if (dataType) {
			const typeParam = this.uniformTypeForValue(value, dataType);
			if (type === undefined) type = typeParam;
			else {
				// console.warn(`Don't need to pass in dataType to GPUProgram.setUniform for previously inited uniform "${uniformName}"`);
				// Check that types match previously set uniform.
				if (type !== typeParam) {
					throw new Error(`Uniform "${uniformName}" for GPUProgram "${this.name}" cannot change from type ${type} to type ${typeParam}.`);
				}
			}
		}
		if (type === undefined) {
			throw new Error(`Unknown type for uniform "${uniformName}", please pass in dataType to GPUProgram.setUniform when initing a new uniform.`);
		}

		if (!uniforms[uniformName]) {
			// Init uniform if needed.
			uniforms[uniformName] = { type, location: {}, value };
		} else {
			// Update value.
			uniforms[uniformName].value = value;
		}

		// Update any active programs.
		const keys = Object.keys(programs);
		for (let i = 0; i < keys.length; i++) {
			const programName = keys[i] as PROGRAM_NAMES;
			this.setProgramUniform(programs[programName]!, programName, uniformName, value, type);
		}
	};

	setVertexUniform(
		program: WebGLProgram,
		uniformName: string,
		value: UniformValueType,
		dataType: UniformDataType,
	) {
		const type = this.uniformTypeForValue(value, dataType);
		if (program === undefined) {
			throw new Error('Must pass in valid WebGLProgram to setVertexUniform, got undefined.');
		}
		const programName = Object.keys(this.programs).find(key => this.programs[key as PROGRAM_NAMES] === program);
		if (!programName) {
			throw new Error(`Could not find valid vertex programName for WebGLProgram "${this.name}".`);
		}
		this.setProgramUniform(program, programName, uniformName, value, type);
	}

	destroy() {
		const { gl, fragmentShader, programs } = this;
		// Unbind all gl data before deleting.
		Object.values(programs).forEach(program => {
			gl.deleteProgram(program!);
		});
		Object.keys(this.programs).forEach(key => {
			delete this.programs[key as PROGRAM_NAMES];
		});

		// From https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/deleteShader
		// This method has no effect if the shader has already been deleted
		gl.deleteShader(fragmentShader);
		// @ts-ignore
		delete this.fragmentShader;

		// @ts-ignore
		delete this.gl;
		// @ts-ignore
		delete this.errorCallback;
	}
}
