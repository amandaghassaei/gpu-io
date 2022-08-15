import { GPUComposer } from './GPUComposer';
import {
	isArray,
	isBoolean,
	isInteger,
	isNumber,
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
	GLSL1,
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
	compileShader,
	preprocessFragShader,
	preprocessVertShader,
	initGLProgram,
} from './utils';

export class GPUProgram {
	// Keep a reference to GPUComposer.
	private readonly composer: GPUComposer;

	// Name of GPUProgram, used for error logging.
	readonly name: string;

	// Compiled fragment shader.
	private fragmentShader!: WebGLShader;
	// Source code for fragment shader.
	// Hold onto this in case we need to recompile with different #defines.
	private readonly fragmentShaderSource: string;
	// #define variables for fragment shader program.
	private defines: CompileTimeVars = {};
	// Uniform locations, values, and types.
	private readonly uniforms: { [ key: string]: Uniform } = {};

	// Store WebGLProgram's - we need to compile several WebGLPrograms of GPUProgram.fragmentShader + various vertex shaders.
	// Each combination of vertex + fragment shader requires a separate WebGLProgram.
	// These programs are compiled on the fly as needed.
	private programs: {[key in PROGRAM_NAME_INTERNAL]?: WebGLProgram } = {};

	/**
     * Create a GPUProgram.
     * @param {GPUComposer} composer - The current GPUComposer instance.
     * @param {Object} params - GPUProgram parameters.
     */
	constructor(
		composer: GPUComposer,
		params: {
			name: string,
			// We may want to pass in an array of shader string sources, if split across several files.
			fragmentShader: string | string[],
			uniforms?: {
				name: string,
				value: UniformValue,
				type: UniformType,
			}[],
			// We'll allow some compile-time variables to be passed in as #define to the preprocessor for the fragment shader.
			defines?: CompileTimeVars,
		},
	) {
		// Check constructor parameters.
		const { name } = (params || {});
		if (!composer) {
			throw new Error(`Error initing GPUProgram "${name}": must pass GPUComposer instance to GPUProgram(composer, params).`);
		}
		const validKeys = ['name', 'fragmentShader', 'uniforms', 'defines'];
		const requiredKeys = ['name', 'fragmentShader'];
		const keys = Object.keys(params);
		keys.forEach(key => {
			if (validKeys.indexOf(key) < 0) {
				throw new Error(`Invalid params key "${key}" passed to GPUProgram(composer, params) with name "${name}".  Valid keys are ${validKeys.join(', ')}.`);
			}
		});
		// Check for required keys.
		requiredKeys.forEach(key => {
			if (keys.indexOf(key) < 0) {
				throw new Error(`Required params key "${key}" was not passed to GPUProgram(composer, params) with name "${name}".`);
			}
		});

		const { fragmentShader, uniforms, defines } = params;
		

		// Save arguments.
		this.composer = composer;
		this.name = name;

		// Compile fragment shader.
		const fragmentShaderSource = typeof(fragmentShader) === 'string' ?
			fragmentShader :
			(fragmentShader as string[]).join('\n');
		this.fragmentShaderSource = preprocessFragShader(fragmentShaderSource, composer.glslVersion);
		this.recompile(defines || this.defines);

		if (uniforms) {
			for (let i = 0; i < uniforms.length; i++) {
				const { name, value, type } = uniforms[i];
				this.setUniform(name, value, type);
			}
		}
	}

	recompile(defines: CompileTimeVars) {
		const { composer, name, fragmentShaderSource } = this;
		const {
			gl,
			_errorCallback,
			verboseLogging,
			glslVersion,
			floatPrecision,
			intPrecision,
		} = composer;

		// Update this.defines if needed.
		// Passed in defines param may only be a partial list.
		let definesNeedUpdate = false;
		const keys = Object.keys(defines);
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			if (this.defines[key] !== defines[key]) {
				definesNeedUpdate = true;
				this.defines[key] = defines[key];
			}
		}
		
		if (this.fragmentShader && !definesNeedUpdate) {
			// No need to recompile.
			return;
		}

		if (verboseLogging) console.log(`Compiling fragment shader for GPUProgram "${name}" with defines: ${JSON.stringify(this.defines)}`);
		const shader = compileShader(
			gl,
			glslVersion,
			intPrecision,
			floatPrecision,
			fragmentShaderSource,
			gl.FRAGMENT_SHADER,
			name,
			_errorCallback,
			this.defines,
		);
		if (!shader) {
			_errorCallback(`Unable to compile fragment shader for GPUProgram "${name}".`);
			return;
		}
		this.fragmentShader = shader;
	}

	private getProgramWithName(name: PROGRAM_NAME_INTERNAL) {
		// Check if we've already compiled program.
		if (this.programs[name]) return this.programs[name];
		// Otherwise, we need to compile a new program on the fly.
		const { composer, uniforms, fragmentShader } = this;
		const {
			_errorCallback,
			_vertexShaders,
			gl,
			glslVersion,
			intPrecision,
			floatPrecision,
		} = composer;
		const vertexShader = _vertexShaders[name];
		if (vertexShader.shader === undefined) {
			const { composer } = this;
			const { gl } = composer;
			// Init a vertex shader.
			if (vertexShader.src === '') {
				throw new Error(`No source for vertex shader ${this.name} : ${name}`);
			}
			const vertexShaderSource = preprocessVertShader(vertexShader.src, glslVersion);
			const shader = compileShader(
				gl,
				glslVersion,
				intPrecision,
				floatPrecision,
				vertexShaderSource,
				gl.VERTEX_SHADER,
				this.name,
				_errorCallback,
				vertexShader.defines,
			);
			if (!shader) {
				_errorCallback(`Unable to compile "${name}" vertex shader for GPUProgram "${this.name}".`);
				return;
			}
			vertexShader.shader = shader;
		}
		const program = initGLProgram(gl, fragmentShader, vertexShader.shader, this.name, _errorCallback);
		if (program === undefined) {
			_errorCallback(`Unable to init program "${name}" for GPUProgram "${this.name}".`);
			return;
		}

		// If we have any uniforms set for this GPUProgram, add those to WebGLProgram we just inited.
		const uniformNames = Object.keys(uniforms);
		for (let i = 0; i < uniformNames.length; i++) {
			const uniformName = uniformNames[i];
			const uniform = uniforms[uniformName];
			const { value, type } = uniform;
			this.setProgramUniform(program, name, uniformName, value, type);
		}

		this.programs[name] = program;
		return program;
	}

	// These getters are used internally.
	get _defaultProgram() {
		return this.getProgramWithName(DEFAULT_PROGRAM_NAME);
	}
	get _defaultProgramWithUV() {
		return this.getProgramWithName(DEFAULT_W_UV_PROGRAM_NAME);
	}
	get _defaultProgramWithNormal() {
		return this.getProgramWithName(DEFAULT_W_NORMAL_PROGRAM_NAME);
	}
	get _defaultProgramWithUVNormal() {
		return this.getProgramWithName(DEFAULT_W_UV_NORMAL_PROGRAM_NAME);
	}
	get _segmentProgram() {
		return this.getProgramWithName(SEGMENT_PROGRAM_NAME);
	}
	get _GPULayerPointsProgram() {
		return this.getProgramWithName(DATA_LAYER_POINTS_PROGRAM_NAME);
	}
	get _GPULayerVectorFieldProgram() {
		return this.getProgramWithName(DATA_LAYER_VECTOR_FIELD_PROGRAM_NAME);
	}
	get _GPULayerLinesProgram() {
		return this.getProgramWithName(DATA_LAYER_LINES_PROGRAM_NAME);
	}

	private uniformInternalTypeForValue(
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
		const { composer, uniforms } = this;
		const { gl, _errorCallback } = composer;
		// Set active program.
		gl.useProgram(program);

		let location = uniforms[name]?.location[programName];
		// Init a location for WebGLProgram if needed.
		if (location === undefined) {
			const _location = gl.getUniformLocation(program, name);
			if (!_location) {
				_errorCallback(`Could not init uniform "${name}" for program "${this.name}".
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
		const { programs, uniforms, composer } = this;
		const { verboseLogging } = composer;

		// Check that length of value is correct.
		if (isArray(value)) {
			const length = (value as number[]).length;
			if (length > 4) throw new Error(`Invalid uniform value: [${(value as number[]).join(', ')}] passed to GPUProgram "${this.name}, uniforms must be of type number[] with length <= 4, number, or boolean."`)
		}

		let currentType = uniforms[name]?.type;
		if (type) {
			const internalType = this.uniformInternalTypeForValue(value, type);
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
			// Deep check is value has changed.
			if (isArray(value)) {
				let isChanged = true;
				for (let i = 0; i < (value as number[]).length; i++) {
					if (uniforms[name].value !== value) {
						isChanged = true;
						break;
					}
				}
				if (!isChanged) return; // No change.
			} else if (uniforms[name].value === value) {
				return; // No change.
			}
			// Update value.
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
		const internalType = this.uniformInternalTypeForValue(value, type);
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
		const { composer, fragmentShader, programs } = this;
		const { gl, verboseLogging } = composer;

		if (verboseLogging) console.log(`Deallocating GPUProgram "${this.name}".`);

		// Unbind all gl data before deleting.
		Object.values(programs).forEach(program => {
			gl.deleteProgram(program!);
		});
		Object.keys(this.programs).forEach(key => {
			delete this.programs[key as PROGRAM_NAME_INTERNAL];
		});

		// Delete fragment shader.
		gl.deleteShader(fragmentShader);
		// @ts-ignore
		delete this.fragmentShader;

		// Delete all references.
		// @ts-ignore
		delete this.composer;
		// @ts-ignore
		delete this.name;
		// @ts-ignore
		delete this.fragmentShaderSource;
		// @ts-ignore
		delete this.defines;
		// @ts-ignore
		delete this.uniforms;
		// @ts-ignore
		delete this.programs;
	}
}
