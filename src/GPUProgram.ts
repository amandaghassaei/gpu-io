import { GPUComposer } from './GPUComposer';
import {
	isArray,
	isBoolean,
	isObject,
	isString,
} from './checks';
import {
	FLOAT_1D_UNIFORM,
	FLOAT_2D_UNIFORM,
	FLOAT_3D_UNIFORM,
	FLOAT_4D_UNIFORM,
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
	LAYER_POINTS_PROGRAM_NAME,
	LAYER_VECTOR_FIELD_PROGRAM_NAME,
	LAYER_LINES_PROGRAM_NAME,
	INT,
	UINT,
	UINT_1D_UNIFORM,
	UINT_2D_UNIFORM,
	UINT_3D_UNIFORM,
	UINT_4D_UNIFORM,
} from './constants';
import {
	compileShader,
	preprocessFragmentShader,
	initGLProgram,
	uniformInternalTypeForValue,
	isWebGL2,
} from './utils';

export class GPUProgram {
	// Keep a reference to GPUComposer.
	private readonly composer: GPUComposer;

	/**
	 * Name of GPUProgram, used for error logging.
	 */
	readonly name: string;

	// Compiled fragment shader.
	private fragmentShader!: WebGLShader;
	// Source code for fragment shader.
	// Hold onto this in case we need to recompile with different #defines.
	private readonly fragmentShaderSource: string;
	// #define variables for fragment shader program.
	private readonly defines: CompileTimeVars = {};
	// Uniform locations, values, and types.
	private readonly uniforms: { [ key: string]: Uniform } = {};

	// Store WebGLProgram's - we need to compile several WebGLPrograms of GPUProgram.fragmentShader + various vertex shaders.
	// Each combination of vertex + fragment shader requires a separate WebGLProgram.
	// These programs are compiled on the fly as needed.
	private readonly programs: {[key in PROGRAM_NAME_INTERNAL]?: WebGLProgram } = {};

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
		if (!params) {
			throw new Error(`Error initing GPUProgram: must pass params to GPUProgram(composer, params).`);
		}
		if (!isObject(params)) {
			throw new Error(`Error initing GPUProgram: must pass valid params object to GPUProgram(composer, params), got ${JSON.stringify(params)}.`);
		}
		const validKeys = ['name', 'fragmentShader', 'uniforms', 'defines'];
		const requiredKeys = ['name', 'fragmentShader'];
		const keys = Object.keys(params);
		keys.forEach(key => {
			if (validKeys.indexOf(key) < 0) {
				throw new Error(`Invalid params key "${key}" passed to GPUProgram(composer, params) with name "${name}".  Valid keys are ${JSON.stringify(validKeys)}.`);
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
		const fragmentShaderSource = isString(fragmentShader) ?
			fragmentShader as string :
			(fragmentShader as string[]).join('\n');
		this.fragmentShaderSource = preprocessFragmentShader(
			fragmentShaderSource, composer.glslVersion,
		);
		this.compile(defines); // Compiling also saves defines.

		// Set program uniforms.
		if (uniforms) {
			for (let i = 0; i < uniforms.length; i++) {
				const { name, value, type } = uniforms[i];
				this.setUniform(name, value, type);
			}
		}
	}

	/**
	 * Compile fragment shader for GPUProgram.
	 * Used internally, called only one.
	 * @private
	 */
	private compile(defines?: CompileTimeVars) {
		const { composer, name, fragmentShaderSource } = this;
		const {
			gl,
			errorCallback,
			verboseLogging,
			glslVersion,
			floatPrecision,
			intPrecision,
		} = composer;

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

		if (verboseLogging) console.log(`Compiling fragment shader for GPUProgram "${name}" with defines: ${JSON.stringify(this.defines)}`);
		const shader = compileShader(
			gl,
			glslVersion,
			intPrecision,
			floatPrecision,
			fragmentShaderSource,
			gl.FRAGMENT_SHADER,
			name,
			errorCallback,
			this.defines,
		);
		if (!shader) {
			errorCallback(`Unable to compile fragment shader for GPUProgram "${name}".`);
			return;
		}
		this.fragmentShader = shader;
		
		// If we decided to call this multiple times, we will need to attach the shader to all existing programs.
	}

	/**
	 * Get GLProgram associated with a specific vertex shader.
	 * @private
	 */
	private getProgramWithName(name: PROGRAM_NAME_INTERNAL) {
		// Check if we've already compiled program.
		if (this.programs[name]) return this.programs[name];

		// Otherwise, we need to compile a new program on the fly.
		const { composer, uniforms, fragmentShader } = this;
		const { gl, errorCallback } = composer;

		const vertexShader = composer._getVertexShaderWithName(name, this.name);
		if (vertexShader === undefined) {
			errorCallback(`Unable to init vertex shader "${name}" for GPUProgram "${this.name}".`);
			return;
		}

		const program = initGLProgram(gl, vertexShader, fragmentShader, this.name, errorCallback);
		if (program === undefined) {
			errorCallback(`Unable to init program "${name}" for GPUProgram "${this.name}".`);
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
	/**
	 * @private
	 */
	get _defaultProgram() {
		return this.getProgramWithName(DEFAULT_PROGRAM_NAME);
	}
	/**
	 * @private
	 */
	get _defaultProgramWithUV() {
		return this.getProgramWithName(DEFAULT_W_UV_PROGRAM_NAME);
	}
	/**
	 * @private
	 */
	get _defaultProgramWithNormal() {
		return this.getProgramWithName(DEFAULT_W_NORMAL_PROGRAM_NAME);
	}
	/**
	 * @private
	 */
	get _defaultProgramWithUVNormal() {
		return this.getProgramWithName(DEFAULT_W_UV_NORMAL_PROGRAM_NAME);
	}
	/**
	 * @private
	 */
	get _segmentProgram() {
		return this.getProgramWithName(SEGMENT_PROGRAM_NAME);
	}
	/**
	 * @private
	 */
	get _layerPointsProgram() {
		return this.getProgramWithName(LAYER_POINTS_PROGRAM_NAME);
	}
	/**
	 * @private
	 */
	get _layerVectorFieldProgram() {
		return this.getProgramWithName(LAYER_VECTOR_FIELD_PROGRAM_NAME);
	}
	/**
	 * @private
	 */
	get _layerLinesProgram() {
		return this.getProgramWithName(LAYER_LINES_PROGRAM_NAME);
	}

	/**
	 * Set uniform for GLProgram.
	 * @private
	 */
	private setProgramUniform(
		program: WebGLProgram,
		programName: string,
		name: string,
		value: UniformValue,
		type: UniformInternalType,
	) {
		const { composer, uniforms } = this;
		const { gl, errorCallback } = composer;
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
			case UINT_1D_UNIFORM:
				(gl as WebGL2RenderingContext).uniform1ui(location, value as number);
				break;
			case UINT_2D_UNIFORM:
				(gl as WebGL2RenderingContext).uniform2uiv(location, value as number[]);
				break;
			case UINT_3D_UNIFORM:
				(gl as WebGL2RenderingContext).uniform3uiv(location, value as number[]);
				break;
			case UINT_4D_UNIFORM:
				(gl as WebGL2RenderingContext).uniform4uiv(location, value as number[]);
				break;
			default:
				throw new Error(`Unknown uniform type ${type} for GPUProgram "${this.name}".`);
		}
	}

	/**
	 * Set fragment shader uniform for GPUProgram.
	 * @param name - Uniform name as it appears in fragment shader.
	 * @param value - Uniform value.
	 * @param type - Uniform type.
	 */
	setUniform(
		name: string,
		value: UniformValue,
		type?: UniformType,
	) {
		const { programs, uniforms, composer } = this;
		const { verboseLogging } = composer;

		// Uint is not supported in webgl1.
		if (!isWebGL2(composer.gl) && type === UINT) {
			type = INT;
		}

		// Check that length of value is correct.
		if (isArray(value)) {
			const length = (value as number[]).length;
			if (length > 4) throw new Error(`Invalid uniform value: [${(value as number[]).join(', ')}] passed to GPUProgram "${this.name}, uniforms must be of type number[] with length <= 4, number, or boolean."`)
		}

		let currentType = uniforms[name]?.type;
		if (type) {
			const internalType = uniformInternalTypeForValue(value, type, name, this.name);
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

	/**
	 * Set vertex shader uniform for GPUProgram.
	 * @private
	 */
	_setVertexUniform(
		program: WebGLProgram,
		uniformName: string,
		value: UniformValue,
		type: UniformType,
	) {
		if (!program) {
			throw new Error('Must pass in valid WebGLProgram to setVertexUniform, got undefined.');
		}
		const programName = Object.keys(this.programs).find(key => this.programs[key as PROGRAM_NAME_INTERNAL] === program);
		if (!programName) {
			throw new Error(`Could not find valid vertex programName for WebGLProgram in GPUProgram "${this.name}".`);
		}
		const internalType = uniformInternalTypeForValue(value, type, uniformName, this.name);
		this.setProgramUniform(program, programName, uniformName, value, internalType);
	}

	/**
	 * Deallocate GPUProgram instance and associated WebGL properties.
	 */
	dispose() {
		const { composer, fragmentShader, programs } = this;
		const { gl, verboseLogging } = composer;

		if (verboseLogging) console.log(`Deallocating GPUProgram "${this.name}".`);
		if (!gl) throw new Error(`Must call dispose() on all GPUPrograms before calling dispose() on GPUComposer.`);

		// Unbind all gl data before deleting.
		Object.values(programs).forEach(program => {
			if (program) gl.deleteProgram(program);
		});
		Object.keys(this.programs).forEach(key => {
			delete this.programs[key as PROGRAM_NAME_INTERNAL];
		});

		// Delete fragment shader.
		gl.deleteShader(fragmentShader);
		// @ts-ignore
		delete this.fragmentShader;
		// Vertex shaders are owned by GPUComposer and shared across many GPUPrograms.

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
