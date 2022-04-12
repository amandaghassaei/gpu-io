import { WebGLCompute } from './WebGLCompute';
import {
	isArray,
	isBoolean,
	isInteger,
	isNumber,
	isString,
} from './Checks';
import {
	FLOAT,
	FLOAT_1D_UNIFORM,
	FLOAT_2D_UNIFORM,
	FLOAT_3D_UNIFORM,
	FLOAT_4D_UNIFORM,
	INT,
	BOOL,
	INT_1D_UNIFORM,
	INT_2D_UNIFORM,
	INT_3D_UNIFORM,
	INT_4D_UNIFORM,
	Uniform,
	UniformType,
	UniformInternalType,
	UniformValue,
	CompileTimeVars,
	PROGRAM_NAME_INTERNAL,
	DEFAULT_PROGRAM_NAME,
	DEFAULT_W_UV_PROGRAM_NAME,
	DEFAULT_W_NORMAL_PROGRAM_NAME,
	DEFAULT_W_UV_NORMAL_PROGRAM_NAME,
	SEGMENT_PROGRAM_NAME,
	DATA_LAYER_POINTS_PROGRAM_NAME,
	DATA_LAYER_VECTOR_FIELD_PROGRAM_NAME,
	DATA_LAYER_LINES_PROGRAM_NAME,
} from './Constants';
import {
	compileShader, insertDefinesAfterVersionDeclaration,
} from './utils';

export class GPUProgram {
	readonly name: string;
	private readonly glcompute: WebGLCompute;
	private readonly uniforms: { [ key: string]: Uniform } = {};
	private fragmentShader!: WebGLShader; // Compiled fragment shader.
	private readonly fragmentShaderSource?: string; // Source code for fragment shader.
	private defines: CompileTimeVars = {};
	// Store gl programs.
	private programs: {[key in PROGRAM_NAME_INTERNAL]?: WebGLProgram } = {};

	constructor(
		glcompute: WebGLCompute,
		params: {
			name: string,
			// We may want to pass in an array of shader string sources, if split across several files.
			fragmentShader: string | string[] | WebGLShader,
			uniforms?: {
				name: string,
				value: UniformValue,
				type: UniformType,
			}[],
			// We'll allow some compile-time variables to be passed in as #define to the preprocessor for the fragment shader.
			defines?: CompileTimeVars,
		},
		
	) {
		const { name, fragmentShader, uniforms, defines } = params;

		// Save arguments.
		this.glcompute = glcompute;
		this.name = name;

		// Compile fragment shader.
		if (typeof(fragmentShader) === 'string' || typeof((fragmentShader as string[])[0]) === 'string') {
			let sourceString = typeof(fragmentShader) === 'string' ?
				fragmentShader :
				(fragmentShader as string[]).join('\n');
			this.fragmentShaderSource = sourceString;
		} else {
			this.fragmentShader = fragmentShader as WebGLShader;
		}
		this.recompile(defines);

		if (uniforms) {
			for (let i = 0; i < uniforms?.length; i++) {
				const { name, value, type } = uniforms[i];
				this.setUniform(name, value, type);
			}
		}
	}

	recompile(defines?: CompileTimeVars) {
		const { glcompute, name, fragmentShaderSource } = this;
		const { gl, errorCallback, verboseLogging } = glcompute;

		// Update this.defines if needed.
		// Passed in defines param may only be a partial list.
		let definesNeedUpdate = false;
		if (defines) {
			const keys = Object.keys(defines);
			for (let i = 0; i < keys.length; i++) {
				const key = keys[i];
				if (this.defines[key] !== defines[key]) {
					definesNeedUpdate = true;
					this.defines[key] = defines[key];
				}
			}
		}
		
		if (this.fragmentShader && !definesNeedUpdate) {
			// No need to recompile.
			return;
		}

		if (!fragmentShaderSource) {
			// No fragment shader source available.
			throw new Error(`Unable to recompile fragment shader for program "${name}" because fragment shader is already compiled, no source available.`);
		}
		if (verboseLogging) console.log(`Compiling fragment shader "${name}" with defines ${JSON.stringify(this.defines)}`);
		const shader = compileShader( glcompute, fragmentShaderSource, gl.FRAGMENT_SHADER, name, this.defines);
		if (!shader) {
			errorCallback(`Unable to compile fragment shader for program "${name}".`);
			return;
		}
		this.fragmentShader = shader;
	}

	private initProgram(vertexShader: WebGLShader, programName: PROGRAM_NAME_INTERNAL) {
		const { glcompute, fragmentShader, uniforms } = this;
		const { gl, errorCallback} = glcompute;
		// Create a program.
		const program = gl.createProgram();
		if (!program) {
			errorCallback(`Unable to init gl program: ${this.name}.`);
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
			errorCallback(`Program "${this.name}" failed to link: ${gl.getProgramInfoLog(program)}`);
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

	private getProgramWithName(name: PROGRAM_NAME_INTERNAL) {
		if (this.programs[name]) return this.programs[name];
		const { glcompute } = this;
		const { errorCallback, _vertexShaders } = glcompute;
		const vertexShader = _vertexShaders[name];
		if (vertexShader.shader === undefined) {
			const { glcompute, name } = this;
			const { gl } = glcompute;
			// Init a vertex shader.
			let vertexShaderSource = glcompute._preprocessVertShader(vertexShader.src);
			if (vertexShaderSource === '') {
				throw new Error(`No source for vertex shader ${this.name} : ${name}`)
			}
			const shader = compileShader(glcompute, vertexShaderSource, gl.VERTEX_SHADER, name, vertexShader.defines);
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

	private static uniformInternalTypeForValue(
		value: UniformValue,
		type: UniformType,
	) {
		if (type === FLOAT) {
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
		} else if (type === INT) {
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
		} else if (type === BOOL) {
			if (isBoolean(value)) {
				// Boolean types are passed in as ints.
				// This suggest floats work as well, but ints seem more natural:
				// https://github.com/KhronosGroup/WebGL/blob/main/sdk/tests/conformance/uniforms/gl-uniform-bool.html
				return INT_1D_UNIFORM;
			}
			throw new Error(`Invalid uniform value: ${value} for program "${this.name}", expected boolean.`);
		} else {
			throw new Error(`Invalid uniform type: ${type} for program "${this.name}", expected ${FLOAT} or ${INT} of ${BOOL}.`);
		}
	}

	private setProgramUniform(
		program: WebGLProgram,
		programName: string,
		name: string,
		value: UniformValue,
		type: UniformInternalType,
	) {
		const { glcompute, uniforms } = this;
		const { gl, errorCallback } = glcompute;
		// Set active program.
		gl.useProgram(program);

		let location = uniforms[name]?.location[programName];
		// Init a location for WebGLProgram if needed.
		if (location === undefined) {
			const _location = gl.getUniformLocation(program, name);
			if (!_location) {
				errorCallback(`Could not init uniform "${name}" for program "${this.name}".
Check that uniform is present in shader code, unused uniforms may be removed by compiler.
Also check that uniform type in shader code matches type ${type}.
Error code: ${gl.getError()}.`);
				return;
			}
			location = _location;
			// Save location for future use.
			if (uniforms[name]) {
				uniforms[name].location[programName] = location;
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
				if (isBoolean(value)) {
					// We are setting boolean uniforms with uniform1i.
					gl.uniform1i(location, value ? 1 : 0);
				} else {
					gl.uniform1i(location, value as number);
				}
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
		name: string,
		value: UniformValue,
		type?: UniformType,
	) {
		const { programs, uniforms, glcompute } = this;
		const { verboseLogging } = glcompute;

		let currentType = uniforms[name]?.type;
		if (type) {
			const internalType = GPUProgram.uniformInternalTypeForValue(value, type);
			if (currentType === undefined) currentType = internalType;
			else {
				// console.warn(`Don't need to pass in type to GPUProgram.setUniform for previously inited uniform "${uniformName}"`);
				// Check that types match previously set uniform.
				if (currentType !== internalType) {
					throw new Error(`Uniform "${name}" for GPUProgram "${this.name}" cannot change from type ${currentType} to type ${internalType}.`);
				}
			}
		}
		if (currentType === undefined) {
			throw new Error(`Unknown type for uniform "${name}", please pass in type to GPUProgram.setUniform(name, value, type) when initing a new uniform.`);
		}

		if (!uniforms[name]) {
			// Init uniform if needed.
			uniforms[name] = { type: currentType, location: {}, value };
		} else {
			// Update value.
			if (uniforms[name].value === value) {
				return; // No change.
			}
			uniforms[name].value = value;
		}

		if (verboseLogging) console.log(`Setting uniform "${name}" for program "${this.name}" to value ${JSON.stringify(value)} with type ${currentType}.`)

		// Update any active programs.
		const keys = Object.keys(programs);
		for (let i = 0; i < keys.length; i++) {
			const programName = keys[i] as PROGRAM_NAME_INTERNAL;
			this.setProgramUniform(programs[programName]!, programName, name, value, currentType);
		}
	};

	// This is used internally.
	_setVertexUniform(
		program: WebGLProgram,
		uniformName: string,
		value: UniformValue,
		type: UniformType,
	) {
		const internalType = GPUProgram.uniformInternalTypeForValue(value, type);
		if (program === undefined) {
			throw new Error('Must pass in valid WebGLProgram to setVertexUniform, got undefined.');
		}
		const programName = Object.keys(this.programs).find(key => this.programs[key as PROGRAM_NAME_INTERNAL] === program);
		if (!programName) {
			throw new Error(`Could not find valid vertex programName for WebGLProgram "${this.name}".`);
		}
		this.setProgramUniform(program, programName, uniformName, value, internalType);
	}

	dispose() {
		const { glcompute, fragmentShader, programs } = this;
		const { gl, verboseLogging } = glcompute;
		if (verboseLogging) console.log(`Destroying program "${this.name}".`);

		// Unbind all gl data before deleting.
		Object.values(programs).forEach(program => {
			gl.deleteProgram(program!);
		});
		Object.keys(this.programs).forEach(key => {
			delete this.programs[key as PROGRAM_NAME_INTERNAL];
		});

		// From https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/deleteShader
		// This method has no effect if the shader has already been deleted
		gl.deleteShader(fragmentShader);
		// @ts-ignore
		delete this.fragmentShader;

		// @ts-ignore
		delete this.glcompute;
	}
}
