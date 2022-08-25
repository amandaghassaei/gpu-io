import { GPUComposer } from './GPUComposer';
import {
	isArray,
	isBoolean,
	isInteger,
	isNonNegativeInteger,
	isNumber,
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
	UINT_1D_UNIFORM,
	UINT_2D_UNIFORM,
	UINT_3D_UNIFORM,
	UINT_4D_UNIFORM,
	UniformParams,
	BOOL_1D_UNIFORM,
	GLSL3,
} from './constants';
import {
	compileShader,
	preprocessFragmentShader,
	initGLProgram,
	uniformInternalTypeForValue,
} from './utils';

export class GPUProgram {
	// Keep a reference to GPUComposer.
	private readonly _composer: GPUComposer;

	/**
	 * Name of GPUProgram, used for error logging.
	 */
	readonly name: string;

	// Compiled fragment shader.
	private _fragmentShader!: WebGLShader;
	// Source code for fragment shader.
	// Hold onto this in case we need to recompile with different #defines.
	private readonly _fragmentShaderSource: string;
	// #define variables for fragment shader program.
	private readonly _defines: CompileTimeVars = {};
	// Uniform locations, values, and types.
	private readonly _uniforms: { [ key: string]: Uniform } = {};

	// Store WebGLProgram's - we need to compile several WebGLPrograms of GPUProgram.fragmentShader + various vertex shaders.
	// Each combination of vertex + fragment shader requires a separate WebGLProgram.
	// These programs are compiled on the fly as needed.
	private readonly _programs: {[key in PROGRAM_NAME_INTERNAL]?: WebGLProgram } = {};

	/**
     * Create a GPUProgram.
     * @param composer - The current GPUComposer instance.
     * @param params - GPUProgram parameters.
	 * @param params.name - Name of GPUProgram, used for error logging.
	 * @param params.fragmentShader - Fragment shader source or array of sources to be joined.
	 * @param params.uniforms - Array of uniforms to initialize with GPUProgram.  More uniforms can be added later with GPUProgram.setUniform().
	 * @param params.defines - Compile-time #define variables to include with fragment shader.
     */
	constructor(
		composer: GPUComposer,
		params: {
			name: string,
			// We may want to pass in an array of shader string sources, if split across several files.
			fragmentShader: string | string[],
			uniforms?: UniformParams[],
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
		// Check params keys.
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
		this._composer = composer;
		this.name = name;

		// Compile fragment shader.
		const fragmentShaderSource = isString(fragmentShader) ?
			fragmentShader as string :
			(fragmentShader as string[]).join('\n');
		this._fragmentShaderSource = preprocessFragmentShader(
			fragmentShaderSource, composer.glslVersion,
		);
		this._compile(defines); // Compiling also saves defines.

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
	private _compile(defines?: CompileTimeVars) {
		const { _composer, name, _fragmentShaderSource, _fragmentShader, _defines } = this;
		const {
			gl,
			_errorCallback,
			verboseLogging,
			glslVersion,
			floatPrecision,
			intPrecision,
		} = _composer;

		// Update this.defines if needed.
		// Passed in defines param may only be a partial list.
		let definesNeedUpdate = false;
		if (defines) {
			const keys = Object.keys(defines);
			for (let i = 0; i < keys.length; i++) {
				const key = keys[i];
				if (_defines[key] !== defines[key]) {
					definesNeedUpdate = true;
					_defines[key] = defines[key];
				}
			}
		}
		
		if (_fragmentShader && !definesNeedUpdate) {
			// No need to recompile.
			return;
		}

		if (verboseLogging) console.log(`Compiling fragment shader for GPUProgram "${name}" with defines: ${JSON.stringify(_defines)}`);
		const shader = compileShader(
			gl,
			glslVersion,
			intPrecision,
			floatPrecision,
			_fragmentShaderSource,
			gl.FRAGMENT_SHADER,
			name,
			_errorCallback,
			_defines,
		);
		if (!shader) {
			_errorCallback(`Unable to compile fragment shader for GPUProgram "${name}".`);
			return;
		}
		this._fragmentShader = shader;
		
		// If we decided to call this multiple times, we will need to attach the shader to all existing programs.
	}

	/**
	 * Get GLProgram associated with a specific vertex shader.
	 * @private
	 */
	private _getProgramWithName(name: PROGRAM_NAME_INTERNAL) {
		// Check if we've already compiled program.
		if (this._programs[name]) return this._programs[name];

		// Otherwise, we need to compile a new program on the fly.
		const { _composer, _uniforms, _fragmentShader, _programs } = this;
		const { gl, _errorCallback } = _composer;

		const vertexShader = _composer._getVertexShaderWithName(name, this.name);
		if (vertexShader === undefined) {
			_errorCallback(`Unable to init vertex shader "${name}" for GPUProgram "${this.name}".`);
			return;
		}

		const program = initGLProgram(gl, vertexShader, _fragmentShader, this.name, _errorCallback);
		if (program === undefined) {
			_errorCallback(`Unable to init program "${name}" for GPUProgram "${this.name}".`);
			return;
		}

		// If we have any uniforms set for this GPUProgram, add those to WebGLProgram we just inited.
		const uniformNames = Object.keys(_uniforms);
		for (let i = 0; i < uniformNames.length; i++) {
			const uniformName = uniformNames[i];
			const uniform = _uniforms[uniformName];
			const { value, type } = uniform;
			this._setProgramUniform(program, name, uniformName, value, type);
		}

		_programs[name] = program;
		return program;
	}
	/**
	 * @private
	 */
	get _defaultProgram() {
		return this._getProgramWithName(DEFAULT_PROGRAM_NAME);
	}
	/**
	 * @private
	 */
	get _defaultProgramWithUV() {
		return this._getProgramWithName(DEFAULT_W_UV_PROGRAM_NAME);
	}
	/**
	 * @private
	 */
	get _defaultProgramWithNormal() {
		return this._getProgramWithName(DEFAULT_W_NORMAL_PROGRAM_NAME);
	}
	/**
	 * @private
	 */
	get _defaultProgramWithUVNormal() {
		return this._getProgramWithName(DEFAULT_W_UV_NORMAL_PROGRAM_NAME);
	}
	/**
	 * @private
	 */
	get _segmentProgram() {
		return this._getProgramWithName(SEGMENT_PROGRAM_NAME);
	}
	/**
	 * @private
	 */
	get _layerPointsProgram() {
		return this._getProgramWithName(LAYER_POINTS_PROGRAM_NAME);
	}
	/**
	 * @private
	 */
	get _layerVectorFieldProgram() {
		return this._getProgramWithName(LAYER_VECTOR_FIELD_PROGRAM_NAME);
	}
	/**
	 * @private
	 */
	get _layerLinesProgram() {
		return this._getProgramWithName(LAYER_LINES_PROGRAM_NAME);
	}

	/**
	 * Set uniform for GLProgram.
	 * @private
	 */
	private _setProgramUniform(
		program: WebGLProgram,
		programName: string,
		uniformName: string,
		value: UniformValue,
		type: UniformInternalType,
	) {
		const { _composer, _uniforms } = this;
		const { gl, _errorCallback, glslVersion } = _composer;
		// Set active program.
		gl.useProgram(program);

		const isGLSL3 = glslVersion === GLSL3;

		let location = _uniforms[uniformName]?.location[programName];
		// Init a location for WebGLProgram if needed (only do this once).
		if (location === undefined) {
			const _location = gl.getUniformLocation(program, uniformName);
			if (!_location) {
				_errorCallback(`Could not init uniform "${uniformName}" for program "${this.name}". Check that uniform is present in shader code, unused uniforms may be removed by compiler. Also check that uniform type in shader code matches type ${type}. Error code: ${gl.getError()}.`);
				return;
			}
			location = _location;
			// Save location for future use.
			if (_uniforms[uniformName]) {
				_uniforms[uniformName].location[programName] = location;
			}

			// Since this is the first time we are initing the uniform, check that type is correct.
			// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getUniform
			const uniform = gl.getUniform(program, location);
			let badType = false;
			// TODO: check bool.
			// if (type === BOOL_1D_UNIFORM) {
			// 	if (!isBoolean(uniform)) {
			// 		badType = true;
			// 	}
			// } else 
			if (type === FLOAT_1D_UNIFORM || type === FLOAT_2D_UNIFORM || type === FLOAT_3D_UNIFORM || type === FLOAT_4D_UNIFORM) {
				if (!isNumber(uniform) && uniform.constructor !== Float32Array) {
					badType = true;
				}
			} else if (type === INT_1D_UNIFORM || type === INT_2D_UNIFORM || type === INT_3D_UNIFORM || type === INT_4D_UNIFORM) {
				if (!isInteger(uniform) && uniform.constructor !== Int32Array) {
					badType = true;
				}
			} else if (type === UINT_1D_UNIFORM || type === UINT_2D_UNIFORM || type === UINT_3D_UNIFORM || type === UINT_4D_UNIFORM) {
				if (!isGLSL3) {
					// GLSL1 does not have uint type, expect int instead.
					if (!isNonNegativeInteger(uniform) && uniform.constructor !== Int32Array) {
						badType = true;
					}
				} else if (!isNonNegativeInteger(uniform) && uniform.constructor !== Uint32Array) {
					badType = true;
				}
			}
			if (badType) {
				_errorCallback(`Invalid uniform "${uniformName}" for program "${this.name}". Check that uniform type in shader code matches type ${type}, gl.getUniform(program, location) returned type: ${uniform.constructor.name}.`);
				return;
			}
		}

		// Set uniform.
		// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/uniform
		switch (type) {
			case BOOL_1D_UNIFORM:
				// We are setting boolean uniforms with uniform1i.
				gl.uniform1i(location, value ? 1 : 0);
				break;
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
			// Uint not supported in GLSL1, use int instead.
			case UINT_1D_UNIFORM:
				if (isGLSL3) (gl as WebGL2RenderingContext).uniform1ui(location, value as number);
				else gl.uniform1i(location, value as number);
				break;
			case UINT_2D_UNIFORM:
				if (isGLSL3) (gl as WebGL2RenderingContext).uniform2uiv(location, value as number[]);
				else gl.uniform2iv(location, value as number[]);
				break;
			case UINT_3D_UNIFORM:
				if (isGLSL3) (gl as WebGL2RenderingContext).uniform3uiv(location, value as number[]);
				else gl.uniform3iv(location, value as number[]);
				break;
			case UINT_4D_UNIFORM:
				if (isGLSL3) (gl as WebGL2RenderingContext).uniform4uiv(location, value as number[]);
				else gl.uniform4iv(location, value as number[]);
				break;
			default:
				throw new Error(`Unknown uniform type ${type} for GPUProgram "${this.name}".`);
		}
	}

	/**
	 * Set fragment shader uniform for GPUProgram.
	 * @param name - Uniform name as it appears in fragment shader.
	 * @param value - Uniform value.
	 * @param type - Uniform type (this only needs to be set once).
	 */
	setUniform(
		name: string,
		value: UniformValue,
		type?: UniformType,
	) {
		const { _programs, _uniforms, _composer } = this;
		const { verboseLogging } = _composer;

		// Check that length of value is correct.
		if (isArray(value)) {
			const length = (value as number[]).length;
			if (length > 4) throw new Error(`Invalid uniform value: [${(value as number[]).join(', ')}] passed to GPUProgram "${this.name}, uniforms must be of type number[] with length <= 4, number, or boolean."`)
		}

		let currentType = _uniforms[name]?.type;
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

		if (!_uniforms[name]) {
			// Init uniform if needed.
			_uniforms[name] = { type: currentType, location: {}, value };
		} else {
			// Deep check is value has changed.
			if (isArray(value)) {
				let isChanged = true;
				for (let i = 0; i < (value as number[]).length; i++) {
					if (_uniforms[name].value !== value) {
						isChanged = true;
						break;
					}
				}
				if (!isChanged) return; // No change.
			} else if (_uniforms[name].value === value) {
				return; // No change.
			}
			// Update value.
			_uniforms[name].value = value;
		}

		if (verboseLogging) console.log(`Setting uniform "${name}" for program "${this.name}" to value ${JSON.stringify(value)} with type ${currentType}.`)

		// Update any active programs.
		const keys = Object.keys(_programs);
		for (let i = 0; i < keys.length; i++) {
			const programName = keys[i] as PROGRAM_NAME_INTERNAL;
			this._setProgramUniform(_programs[programName]!, programName, name, value, currentType);
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
		const programName = Object.keys(this._programs).find(key => this._programs[key as PROGRAM_NAME_INTERNAL] === program);
		if (!programName) {
			throw new Error(`Could not find valid vertex programName for WebGLProgram in GPUProgram "${this.name}".`);
		}
		const internalType = uniformInternalTypeForValue(value, type, uniformName, this.name);
		this._setProgramUniform(program, programName, uniformName, value, internalType);
	}

	/**
	 * Deallocate GPUProgram instance and associated WebGL properties.
	 */
	dispose() {
		const { _composer, _fragmentShader, _programs } = this;
		const { gl, verboseLogging } = _composer;

		if (verboseLogging) console.log(`Deallocating GPUProgram "${this.name}".`);
		if (!gl) throw new Error(`Must call dispose() on all GPUPrograms before calling dispose() on GPUComposer.`);

		// Unbind all gl data before deleting.
		Object.values(_programs).forEach(program => {
			if (program) gl.deleteProgram(program);
		});
		Object.keys(_programs).forEach(key => {
			delete this._programs[key as PROGRAM_NAME_INTERNAL];
		});

		// Delete fragment shader.
		gl.deleteShader(_fragmentShader);
		// @ts-ignore
		delete this._fragmentShader;
		// Vertex shaders are owned by GPUComposer and shared across many GPUPrograms.

		// Delete all references.
		// @ts-ignore
		delete this._composer;
		// @ts-ignore
		delete this.name;
		// @ts-ignore
		delete this._fragmentShaderSource;
		// @ts-ignore
		delete this._defines;
		// @ts-ignore
		delete this._uniforms;
		// @ts-ignore
		delete this._programs;
	}
}
