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
const defaultVertexShaderSource_glsl3 = require('./glsl_3/DefaultVertexShader.glsl');
const defaultVertexShaderSource_glsl1 = require('./glsl_1/DefaultVertexShader.glsl');
const segmentVertexShaderSource_glsl3 = require('./glsl_3/SegmentVertexShader.glsl');
const segmentVertexShaderSource_glsl1 = require('./glsl_1/SegmentVertexShader.glsl');
const pointsVertexShaderSource_glsl1 = require('./glsl_1/PointsVertexShader.glsl');
const vectorFieldVertexShaderSource_glsl1 = require('./glsl_1/VectorFieldVertexShader.glsl');

const DEFAULT_PROGRAM_NAME = 'DEFAULT';
const SEGMENT_PROGRAM_NAME = 'SEGMENT';
const POINTS_PROGRAM_NAME = 'POINTS';
const VECTOR_FIELD_PROGRAM_NAME = 'VECTOR_FIELD';

export class GPUProgram {
	readonly name: string;
	private readonly gl: WebGLRenderingContext | WebGL2RenderingContext;
	private readonly errorCallback: (message: string) => void;
	private readonly glslVersion: GLSLVersion;
	private readonly uniforms: { [ key: string]: Uniform } = {};
	private readonly fragmentShader!: WebGLShader;
	// Store gl programs.
	private _defaultProgram?: WebGLProgram;
	private _segmentProgram?: WebGLProgram;
	private _pointsProgram?: WebGLProgram;
	private _vectorFieldProgram?: WebGLProgram;
	// Store vertexShaders as class properties (for sharing).
	private static defaultVertexShader?: WebGLShader;
	private static segmentVertexShader?: WebGLShader;
	private static pointsVertexShader?: WebGLShader;
	private static vectorFieldVertexShader?: WebGLShader;

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
			this.fragmentShader = shader;
		} else {
			if (defines) {
				throw new Error(`Unable to attach defines to program "${name}" because fragment shader is already compiled.`);
			}
		}

		uniforms?.forEach(uniform => {
			const { name, value, dataType } = uniform;
			this.setUniform(name, value, dataType);
		});
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

	get defaultProgram() {
		if (this._defaultProgram) return this._defaultProgram;
		if (GPUProgram.defaultVertexShader === undefined) {
			const { gl, name, errorCallback, glslVersion } = this;
			// Init a default vertex shader that just passes through screen coords.
			const vertexShaderSource = glslVersion === GLSL3 ? defaultVertexShaderSource_glsl3 : defaultVertexShaderSource_glsl1;
			const shader = compileShader(gl, errorCallback, vertexShaderSource, gl.VERTEX_SHADER, name);
			if (!shader) {
				errorCallback(`Unable to compile default vertex shader for program "${name}".`);
				return;
			}
			GPUProgram.defaultVertexShader = shader;
		}
		const program = this.initProgram(GPUProgram.defaultVertexShader, DEFAULT_PROGRAM_NAME);
		this._defaultProgram = program;
		return this._defaultProgram;
	}

	get segmentProgram() {
		if (this._segmentProgram) return this._segmentProgram;
		if (GPUProgram.segmentVertexShader === undefined) {
			const { gl, name, errorCallback, glslVersion } = this;
			// Init a default vertex shader that just passes through screen coords.
			const vertexShaderSource = glslVersion === GLSL3 ? segmentVertexShaderSource_glsl3 : segmentVertexShaderSource_glsl1;
			const shader = compileShader(gl, errorCallback, vertexShaderSource, gl.VERTEX_SHADER, name);
			if (!shader) {
				errorCallback(`Unable to compile segment vertex shader for program "${name}".`);
				return;
			}
			GPUProgram.segmentVertexShader = shader;
		}
		const program = this.initProgram(GPUProgram.segmentVertexShader, SEGMENT_PROGRAM_NAME);
		this._segmentProgram = program;
		return this._segmentProgram;
	}

	get pointsProgram() {
		if (this._pointsProgram) return this._pointsProgram;
		if (GPUProgram.pointsVertexShader === undefined) {
			const { gl, name, errorCallback, glslVersion } = this;
			// Init a default vertex shader that just passes through screen coords.
			// @ts-ignore
			const vertexShaderSource = glslVersion === GLSL3 ? pointsVertexShaderSource_glsl3 : pointsVertexShaderSource_glsl1;
			if (vertexShaderSource === undefined) {
				throw new Error('Need to write glsl3 version of pointsVertexShader.');
			}
			const shader = compileShader(gl, errorCallback, vertexShaderSource, gl.VERTEX_SHADER, name);
			if (!shader) {
				errorCallback(`Unable to compile points vertex shader for program "${name}".`);
				return;
			}
			GPUProgram.pointsVertexShader = shader;
		}
		const program = this.initProgram(GPUProgram.pointsVertexShader, POINTS_PROGRAM_NAME);
		this._pointsProgram = program;
		return this._pointsProgram;
	}

	get vectorFieldProgram() {
		if (this._vectorFieldProgram) return this._vectorFieldProgram;
		if (GPUProgram.vectorFieldVertexShader === undefined) {
			const { gl, name, errorCallback, glslVersion } = this;
			// Init a default vertex shader that just passes through screen coords.
			// @ts-ignore
			const vertexShaderSource = glslVersion === GLSL3 ? vectorFieldVertexShaderSource_glsl3 : vectorFieldVertexShaderSource_glsl1;
			if (vertexShaderSource === undefined) {
				throw new Error('Need to write glsl3 version of vectorFieldVertexShader.');
			}
			const shader = compileShader(gl, errorCallback, vertexShaderSource, gl.VERTEX_SHADER, name);
			if (!shader) {
				errorCallback(`Unable to compile vector field vertex shader for program "${name}".`);
				return;
			}
			GPUProgram.vectorFieldVertexShader = shader;
		}
		const program = this.initProgram(GPUProgram.vectorFieldVertexShader, VECTOR_FIELD_PROGRAM_NAME);
		this._vectorFieldProgram = program;
		return this._vectorFieldProgram;
	}

	private get activePrograms() {
		const programs = [];
		if (this._defaultProgram) programs.push({
			program: this._defaultProgram,
			programName: DEFAULT_PROGRAM_NAME,
		});
		if (this._segmentProgram) programs.push({
			program: this._segmentProgram,
			programName: SEGMENT_PROGRAM_NAME,
		});
		if (this._pointsProgram) programs.push({
			program: this._pointsProgram,
			programName: POINTS_PROGRAM_NAME,
		});
		if (this._vectorFieldProgram) programs.push({
			program: this._vectorFieldProgram,
			programName: VECTOR_FIELD_PROGRAM_NAME,
		});
		return programs;
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
		saveUniform = true,
	) {
		const { activePrograms, uniforms } = this;

		let type = uniforms[uniformName] ? uniforms[uniformName].type : undefined;
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

		if (saveUniform && !uniforms[uniformName]) {
			// Init uniform if needed.
			uniforms[uniformName] = { type, location: {}, value };
		}

		// Update any active programs.
		for (let i = 0; i < activePrograms.length; i++) {
			const { program, programName } = activePrograms[i];
			this.setProgramUniform(program, programName, uniformName, value, type);
		}
	};

	destroy() {
		const { gl, fragmentShader, activePrograms } = this;
		// Unbind all gl data before deleting.
		activePrograms.forEach(({ program }) => {
			gl.deleteProgram(program);
		});
		// From https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/deleteShader
		// This method has no effect if the shader has already been deleted
		gl.deleteShader(fragmentShader);

		delete this._defaultProgram;
		delete this._segmentProgram;
		delete this._pointsProgram;
		delete this._vectorFieldProgram;
		// @ts-ignore
		delete this.fragmentShader;

		// @ts-ignore
		delete this.gl;
		// @ts-ignore
		delete this.errorCallback;
		// @ts-ignore
		delete this.program;
	}
}
