import type { GPUComposer } from './GPUComposer';
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
	CompileTimeConstants,
	PROGRAM_NAME_INTERNAL,
	UINT_1D_UNIFORM,
	UINT_2D_UNIFORM,
	UINT_3D_UNIFORM,
	UINT_4D_UNIFORM,
	UniformParams,
	BOOL_1D_UNIFORM,
	BOOL_2D_UNIFORM,
	BOOL_3D_UNIFORM,
	BOOL_4D_UNIFORM,
	GLSL3,
	GPULayerState,
	REPEAT,
	LINEAR,
	GLSL1,
} from './constants';
import {
	compileShader,
	preprocessFragmentShader,
	initGLProgram,
	uniformInternalTypeForValue,
	isIntType,
} from './utils';
import {
	SAMPLER2D_CAST_INT,
	SAMPLER2D_DIMENSIONS_UNIFORM,
	SAMPLER2D_FILTER,
	SAMPLER2D_HALF_PX_UNIFORM,
	SAMPLER2D_WRAP_X,
	SAMPLER2D_WRAP_Y,
} from './polyfills';
import {
	isArray,
	isBoolean,
	isFiniteNumber,
	isInteger,
	isNonNegativeInteger,
	isObject,
	isString,
} from '@amandaghassaei/type-checks';
import { checkRequiredKeys, checkValidKeys } from './checks';
import { getExtension, OES_STANDARD_DERIVATIVES } from './extensions';

export class GPUProgram {
	// Keep a reference to GPUComposer.
	private readonly _composer: GPUComposer;

	/**
	 * Name of GPUProgram, used for error logging.
	 */
	readonly name: string;

	// Compiled fragment shaders (we hang onto different versions depending on compile time constants).
	private _fragmentShaders: {[key: string]: WebGLShader} = {};
	// Source code for fragment shader.
	// Hold onto this in case we need to recompile with different #defines.
	protected _fragmentShaderSource!: string;
	// #define variables for fragment shader program.
	private readonly _compileTimeConstants: CompileTimeConstants = {};
	// #extension declarations for fragment shader program.
	private readonly _extensions?: string;
	// Uniform locations, values, and types.
	private readonly _uniforms: { [ key: string]: Uniform } = {};

	// Store WebGLProgram's - we need to compile several WebGLPrograms of GPUProgram.fragmentShader + various vertex shaders.
	// Each combination of vertex + fragment shader requires a separate WebGLProgram.
	// These programs are compiled on the fly as needed.
	private readonly _programs: {[key: string]: WebGLProgram } = {};
	// Reverse lookup for above.
	private readonly _programsKeyLookup = new WeakMap<WebGLProgram, string>();

	// Store the index of input sampler2D in input array.
	protected readonly _samplerUniformsIndices: { name: string, inputIndex: number, shaderIndex: number }[] = [];

	/**
	 * This is only used in cases where GLSL1 program has multiple outputs.
	 * @private
	 */
	_childPrograms?: GPUProgramChild[];

	/**
	 * Create a GPUProgram.
	 * @param composer - The current GPUComposer instance.
	 * @param params - GPUProgram parameters.
	 * @param params.name - Name of GPUProgram, used for error logging.
	 * @param params.fragmentShader - Fragment shader source or array of sources to be joined.
	 * @param params.uniforms - Array of uniforms to initialize with GPUProgram.  More uniforms can be added later with GPUProgram.setUniform().
	 * @param params.compileTimeConstants - Compile time #define constants to include with fragment shader.
	 */
	constructor(
		composer: GPUComposer,
		params: {
			name: string,
			// We may want to pass in an array of shader string sources, if split across several files.
			fragmentShader: string | string[],
			uniforms?: UniformParams[],
			// We'll allow some compile time constants to be passed in as #define to the preprocessor for the fragment shader.
			compileTimeConstants?: CompileTimeConstants,
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
		const validKeys = ['name', 'fragmentShader', 'uniforms', 'compileTimeConstants'];
		const requiredKeys = ['name', 'fragmentShader'];
		const keys = Object.keys(params);
		checkValidKeys(keys, validKeys, 'GPUProgram(composer, params)', params.name);
		checkRequiredKeys(keys, requiredKeys, 'GPUProgram(composer, params)', params.name);

		const { fragmentShader, uniforms, compileTimeConstants } = params;

		// Save arguments.
		this._composer = composer;
		this.name = name;

		// Preprocess fragment shader source.
		const fragmentShaderSource = isString(fragmentShader) ?
				fragmentShader as string :
				(fragmentShader as string[]).join('\n');
		const { shaderSource, samplerUniforms, additionalSources } = preprocessFragmentShader(
			fragmentShaderSource, composer.glslVersion, name,
		);
		this._fragmentShaderSource = shaderSource;

		samplerUniforms.forEach((name, i) => {
			this._samplerUniformsIndices.push({
				name,
				inputIndex: 0, // All uniforms default to 0.
				shaderIndex: i,
			});
		});
		if (this.constructor === GPUProgram) { // This is not a child program.
			if (additionalSources) {
				this._childPrograms = [];
				for (let i = 0, numChildren = additionalSources.length; i < numChildren; i++) {
					this._childPrograms.push(new GPUProgramChild(composer, params, { fragmentShaderSource: additionalSources[i] }));
				}
			}
		}

		// Save compile time constants.
		if (compileTimeConstants) {
			this._compileTimeConstants = { ...compileTimeConstants };
		}
		// Save extension declarations.
		if (composer.glslVersion === GLSL1 && (shaderSource.includes('dFdx') ||shaderSource.includes('dFdy') || shaderSource.includes('fwidth'))) {
			const ext = getExtension(composer, OES_STANDARD_DERIVATIVES, true);
			if (ext) this._extensions = '#extension GL_OES_standard_derivatives : enable\n';
		}

		// Set program uniforms.
		if (uniforms) {
			for (let i = 0; i < uniforms.length; i++) {
				const { name, value, type } = uniforms[i];
				this.setUniform(name, value, type);
			}
		}
	}

	/**
	 * Force compilation of GPUProgram with new compileTimeConstants.
	 * @param compileTimeConstants - Compile time #define constants to include with fragment shader.
	 */
	recompile(compileTimeConstants: CompileTimeConstants) {
		const { _compileTimeConstants } = this;
		// Check if we have changed the compile-time constants.
		// compileTimeConstants may be a partial list.
		let needsRecompile = false;
		Object.keys(compileTimeConstants).forEach(key => {
			if (_compileTimeConstants[key] !== compileTimeConstants[key]) {
				needsRecompile = true;
				_compileTimeConstants[key] = compileTimeConstants[key];
			}
		});
		if (!needsRecompile) return;
		const { 
			_fragmentShaders,
			_programs,
			_programsKeyLookup,
			_composer,
			_uniforms,
		} = this;
		const { gl } = _composer;
		// Delete cached compiled shaders and programs.
		const programKeys = Object.keys(_programs);
		for (let i = 0, numPrograms = programKeys.length; i < numPrograms; i++) {
			const key = programKeys[i];
			const program = _programs[key];
			gl.deleteProgram(program);
			_programsKeyLookup.delete(program);
			delete _programs[key];
		}
		const fragmentShaderKeys = Object.keys(_fragmentShaders);
		for (let i = 0, numFragmentShaders = fragmentShaderKeys.length; i < numFragmentShaders; i++) {
			const key = fragmentShaderKeys[i];
			gl.deleteShader(_fragmentShaders[key]);
			delete _fragmentShaders[key];
		}
		// Delete all cached uniform locations.
		const uniforms = Object.values(_uniforms);
		for (let i = 0, numUniforms = uniforms.length; i < numUniforms; i++) {
			uniforms[i].location = new WeakMap();
		}

		if (this._childPrograms) {
			for (let i = 0, numChildren = this._childPrograms.length; i < numChildren; i++) {
				this._childPrograms[i].recompile(compileTimeConstants);
			}
		}
	}

	/**
	 * Get fragment shader for GPUProgram, compile new one if needed.
	 * Used internally.
	 * @private
	 */
	private _getFragmentShader(fragmentId: string, internalCompileTimeConstants: CompileTimeConstants, ) {
		const { _fragmentShaders } = this;
		if (_fragmentShaders[fragmentId]) {
			// No need to recompile.
			return _fragmentShaders[fragmentId];
		}

		const { _composer, name, _fragmentShaderSource, _compileTimeConstants, _extensions } = this;
		const {
			gl,
			_errorCallback,
			verboseLogging,
			glslVersion,
			floatPrecision,
			intPrecision,
		} = _composer;
		
		// Update compile time constants.
		const keys = Object.keys(internalCompileTimeConstants);
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			_compileTimeConstants[key] = internalCompileTimeConstants[key];
		}

		if (verboseLogging) console.log(`Compiling fragment shader for GPUProgram "${name}" with compile time constants: ${JSON.stringify(_compileTimeConstants)}`);
		const shader = compileShader(
			gl,
			glslVersion,
			intPrecision,
			floatPrecision,
			_fragmentShaderSource,
			gl.FRAGMENT_SHADER,
			name,
			_errorCallback,
			_compileTimeConstants,
			_extensions,
			Object.keys(_fragmentShaders).length === 0,
		);
		if (!shader) {
			_errorCallback(`Unable to compile fragment shader for GPUProgram "${name}".`);
			return;
		}
		_fragmentShaders[fragmentId] = shader;
		return _fragmentShaders[fragmentId];
	}

	/**
	 * Get GLProgram associated with a specific vertex shader.
	 * @private
	 */
	_getProgramWithName(name: PROGRAM_NAME_INTERNAL, vertexCompileConstants: CompileTimeConstants, input: GPULayerState[]) {
		const { _samplerUniformsIndices, _composer } = this;

		let fragmentID = '';
		const fragmentCompileConstants: CompileTimeConstants = {};
		for (let i = 0, length = _samplerUniformsIndices.length; i < length; i++) {
			const { inputIndex } = _samplerUniformsIndices[i];
			const { layer } = input[inputIndex];
			const {
				filter, wrapX, wrapY, type,
				_internalFilter, _internalWrapX, _internalWrapY,
			} = layer;
			const wrapXVal = wrapX === _internalWrapX ? 0 : (wrapX === REPEAT ? 1 : 0);
			const wrapYVal = wrapY === _internalWrapY ? 0 : (wrapY === REPEAT ? 1 : 0);
			const filterVal = filter === _internalFilter ? 0 : (filter === LINEAR ? 1 : 0);
			fragmentID += `_IN${i}_${wrapXVal}_${wrapYVal}_${filterVal}`;
			fragmentCompileConstants[`${SAMPLER2D_WRAP_X}${i}`] = `${wrapXVal}`;
			fragmentCompileConstants[`${SAMPLER2D_WRAP_Y}${i}`] = `${wrapYVal}`;
			fragmentCompileConstants[`${SAMPLER2D_FILTER}${i}`] = `${filterVal}`;
			if (_composer.glslVersion === GLSL1 && isIntType(type)) {
				fragmentCompileConstants[`${SAMPLER2D_CAST_INT}${i}`] = '1';
			}
		}
		const vertexID = Object.keys(vertexCompileConstants).map(key => `_${key}_${vertexCompileConstants[key]}`).join();
		const key = `${name}${vertexID}${fragmentID}`;

		// Check if we've already compiled program.
		if (this._programs[key]) return this._programs[key];

		// Otherwise, we need to compile a new program on the fly.
		const { _uniforms, _programs, _programsKeyLookup } = this;
		const { gl, _errorCallback } = _composer;

		const vertexShader = _composer._getVertexShader(name, vertexID, vertexCompileConstants, this.name);
		if (vertexShader === undefined) {
			_errorCallback(`Unable to init vertex shader "${name}${vertexID}" for GPUProgram "${this.name}".`);
			return;
		}

		const fragmentShader = this._getFragmentShader(fragmentID, fragmentCompileConstants);
		if (fragmentShader === undefined) {
			_errorCallback(`Unable to init fragment shader "${fragmentID}" for GPUProgram "${this.name}".`);
			return;
		}

		const program = initGLProgram(gl, vertexShader, fragmentShader, this.name, _errorCallback);
		if (program === undefined) {
			gl.deleteShader(fragmentShader);
			_errorCallback(`Unable to init program "${key}" for GPUProgram "${this.name}".`);
			return;
		}

		// If we have any uniforms set for this GPUProgram, add those to WebGLProgram we just inited.
		// Set active program.
		gl.useProgram(program);
		const uniformNames = Object.keys(_uniforms);
		for (let i = 0, numUniforms = uniformNames.length; i < numUniforms; i++) {
			const uniformName = uniformNames[i];
			const uniform = _uniforms[uniformName];
			const { value, type } = uniform;
			this._setProgramUniform(program, uniformName, value, type);
		}

		_programs[key] = program;
		_programsKeyLookup.set(program, key);
		return program;
	}

	/**
	 * Set uniform for GLProgram.
	 * @private
	 */
	private _setProgramUniform(
		program: WebGLProgram,
		uniformName: string,
		value: UniformValue,
		type: UniformInternalType,
	) {
		const { _composer, _uniforms } = this;
		const { gl, _errorCallback, glslVersion } = _composer;

		// We have already set gl.useProgram(program) outside this function.

		const isGLSL3 = glslVersion === GLSL3;

		let location = _uniforms[uniformName]?.location.get(program);
		// Init a location for WebGLProgram if needed (only do this once).
		if (location === undefined) {
			const _location = gl.getUniformLocation(program, uniformName);
			if (_location === null) {
				console.warn(`Could not init uniform "${uniformName}" for program "${this.name}". Check that uniform is present in shader code, unused uniforms may be removed by compiler. Also check that uniform type in shader code matches type ${type}. Error code: ${gl.getError()}.`);
				return;
			}
			location = _location;

			// Save location for future use.
			if (_uniforms[uniformName]) {
				_uniforms[uniformName].location.set(program, location);
			}

			// Since this is the first time we are initing the uniform, check that type is correct.
			// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getUniform
			const uniform = gl.getUniform(program, location);
			let badType = false;
			if (type === BOOL_1D_UNIFORM || type === BOOL_2D_UNIFORM || type === BOOL_3D_UNIFORM || type === BOOL_4D_UNIFORM) {
				if (!isBoolean(uniform) && uniform.constructor !== Array) {
					badType = true;
				}
			} else if (type === FLOAT_1D_UNIFORM || type === FLOAT_2D_UNIFORM || type === FLOAT_3D_UNIFORM || type === FLOAT_4D_UNIFORM) {
				if (!isFiniteNumber(uniform) && uniform.constructor !== Float32Array) {
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
			// We are setting boolean uniforms with uniform[1234]i.
			// This suggest floats work as well, but ints seem more natural:
			// https://github.com/KhronosGroup/WebGL/blob/main/sdk/tests/conformance/uniforms/gl-uniform-bool.html
			case BOOL_1D_UNIFORM:
				gl.uniform1i(location, value ? 1 : 0);
				break;
			case BOOL_2D_UNIFORM:
				gl.uniform2i(location, (value as number[])[0] ? 1 : 0, (value as number[])[1] ? 1 : 0);
				break;
			case BOOL_3D_UNIFORM:
				gl.uniform3i(location, (value as number[])[0] ? 1 : 0, (value as number[])[1] ? 1 : 0, (value as number[])[2] ? 1 : 0);
				break;
			case BOOL_4D_UNIFORM:
				gl.uniform4i(location, (value as number[])[0] ? 1 : 0, (value as number[])[1] ? 1 : 0, (value as number[])[2] ? 1 : 0, (value as number[])[3] ? 1 : 0);
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
	 * Cache uniform value and return whether the value has changed.
	 * @private
	 */
	private _cacheUniformValue(name: string, value: UniformValue, type: UniformInternalType) {
		const { _uniforms } = this;
		// Cache uniform values.
		const uniform = _uniforms[name];
		if (!uniform) {
			// Init uniform if needed.
			_uniforms[name] = { location: new WeakMap(), value: isArray(value) ? (value as number[]).slice() : value, type };
			return true;
		}
		const oldValue = uniform.value;
		// Update value with a deep copy of input.
		uniform.value = isArray(value) ? (value as number[]).slice() : value;
		// Deep check if value has changed.
		if (isArray(value)) {
			for (let i = 0, length = (value as number[]).length; i < length; i++) {
				if ((value as number[])[i] !== (oldValue as number[])[i]) {
					return true;
				}
			}
			return false; // No change.
		}
		return value !== oldValue;
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
		const { _programs, _uniforms, _composer, _samplerUniformsIndices } = this;
		const { verboseLogging, gl } = _composer;

		// Check that length of value is correct.
		if (isArray(value)) {
			const length = (value as number[]).length;
			if (length > 4) throw new Error(`Invalid uniform value: [${(value as number[]).join(', ')}] passed to GPUProgram "${this.name}, uniforms must be of type number[] with length <= 4, number, or boolean."`)
		}

		// Get uniform internal type.
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

		const changed = this._cacheUniformValue(name, value, currentType);
		if (!changed) return;

		// Cache user-defined sampler uniform values.
		const samplerUniform = _samplerUniformsIndices.find((uniform) => uniform.name === name);
		if (samplerUniform && isInteger(value)) {
			samplerUniform.inputIndex = value as number;
		}

		if (verboseLogging) console.log(`Setting uniform "${name}" for program "${this.name}" to value ${JSON.stringify(value)}.`)

		// Update any active programs.
		const programNames = Object.keys(_programs);
		for (let i = 0, numPrograms = programNames.length; i < numPrograms; i++) {
			const programName = programNames[i];
			// Set active program.
			const program = _programs[programName]!;
			gl.useProgram(program);
			this._setProgramUniform(program, name, value, currentType);
		}

		// this code is only executed in cases where we have a shader program with multiple outputs in a WebGL1 context.
		// Notify all child programs of the setUniform.
		if (this._childPrograms) {
			for (let i = 0, numChildren = this._childPrograms.length; i < numChildren; i++) {
				this._childPrograms[i].setUniform(name, value, type);
			}
		}
	};

	/**
	 * Set internal fragment shader uniforms for GPUProgram.
	 * @private
	 */
	_setInternalFragmentUniforms(
		program: WebGLProgram,
		input: GPULayerState[],
	) {
		if (input.length === 0) return;
		if (!program) {
			throw new Error('Must pass in valid WebGLProgram to GPUProgram._setInternalFragmentUniforms, got undefined.');
		}
		const { _programsKeyLookup, _samplerUniformsIndices } = this;
		const programName = _programsKeyLookup.get(program);
		if (!programName) {
			throw new Error(`Could not find valid programName for WebGLProgram in GPUProgram "${this.name}".`);
		}

		const indexLookup = new Array(Math.max(input.length, _samplerUniformsIndices.length)).fill(-1);
		for (let i = 0, length = _samplerUniformsIndices.length; i < length; i++) {
			const { inputIndex, shaderIndex } = _samplerUniformsIndices[i];
			if (indexLookup[inputIndex] >= 0) {
				// There is an index collision, this should not happen.
				console.warn(`Found > 1 sampler2D uniforms at texture index ${inputIndex} for GPUProgram "${this.name}".`);
			} else {
				indexLookup[inputIndex] = shaderIndex;
			}
		}

		for (let i = 0, length = input.length; i < length; i++) {
			const { layer } = input[i];
			const { width, height } = layer;
			const index = indexLookup[i];
			if (index < 0) continue;
			const { filter, wrapX, wrapY, _internalFilter, _internalWrapX, _internalWrapY } = layer;
			const filterMismatch = filter !== _internalFilter;
			if (filterMismatch || wrapX !== _internalWrapX || wrapY !== _internalWrapY) {
				const halfPxSize = [0.5 / width, 0.5 / height];
				const halfPxUniform = `${SAMPLER2D_HALF_PX_UNIFORM}${index}`;
				const halfPxUniformChanged = this._cacheUniformValue(halfPxUniform, halfPxSize, FLOAT_2D_UNIFORM);
				if (halfPxUniformChanged) {
					this._setProgramUniform(
						program,
						halfPxUniform,
						halfPxSize,
						FLOAT_2D_UNIFORM,
					);
				}
				if (filterMismatch) {
					const dimensions = [width, height];
					const dimensionsUniform = `${SAMPLER2D_DIMENSIONS_UNIFORM}${index}`;
					const dimensionsUniformChanged = this._cacheUniformValue(dimensionsUniform, dimensions, FLOAT_2D_UNIFORM);
					if (dimensionsUniformChanged) {
						this._setProgramUniform(
							program,
							dimensionsUniform,
							dimensions,
							FLOAT_2D_UNIFORM,
						);
					}
				}
			}
		}
	}

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
			throw new Error('Must pass in valid WebGLProgram to GPUProgram._setVertexUniform, got undefined.');
		}
		const { _programsKeyLookup } = this;
		const programName = _programsKeyLookup.get(program);
		if (!programName) {
			throw new Error(`Could not find valid programName for WebGLProgram in GPUProgram "${this.name}".`);
		}
		const internalType = uniformInternalTypeForValue(value, type, uniformName, this.name);
		// const changed = this._cacheUniformValue(uniformName, value, internalType);
		// Don't cache vertex uniforms for now.
		// TODO: cached vertex uniforms need to be stored per WebGLProgram.
		this._setProgramUniform(program, uniformName, value, internalType);
	}

	/**
	 * Deallocate GPUProgram instance and associated WebGL properties.
	 */
	dispose() {
		const { _composer, _fragmentShaders, _programs, _programsKeyLookup } = this;
		const { gl, verboseLogging } = _composer;

		if (verboseLogging) console.log(`Deallocating GPUProgram "${this.name}".`);
		if (!gl) throw new Error(`Must call dispose() on all GPUPrograms before calling dispose() on GPUComposer.`);

		// Unbind all gl data before deleting.
		Object.values(_programs).forEach(program => {
			if (program) {
				gl.deleteProgram(program);
				_programsKeyLookup.delete(program);
			}
		});
		Object.keys(_programs).forEach(key => {
			delete _programs[key as PROGRAM_NAME_INTERNAL];
		});

		// Delete fragment shaders.
		Object.values(_fragmentShaders).forEach(shader => {
			gl.deleteShader(shader);
		});
		Object.keys(_fragmentShaders).forEach(key => {
			delete _fragmentShaders[key];
		});

		if (this._childPrograms) {
			for (let i = 0, numChildren = this._childPrograms.length; i < numChildren; i++) {
				this._childPrograms[i].dispose();
			}
			this._childPrograms.length;
		}
		delete this._childPrograms;
		
		// Vertex shaders are owned by GPUComposer and shared across many GPUPrograms.

		// Delete all references.
		// @ts-ignore
		delete this._composer;
		// @ts-ignore
		delete this.name;
		// @ts-ignore
		delete this._fragmentShaderSource;
		// @ts-ignore
		delete this._compileTimeConstants;
		// @ts-ignore
		delete this._extensions;
		// @ts-ignore
		delete this._uniforms;
		// @ts-ignore
		delete this._programs;
		// @ts-ignore
		delete this._programsKeyLookup;
		// @ts-ignore
		delete this._fragmentShaders;
		// @ts-ignore
		delete this._samplerUniformsIndices;
	}
}

class GPUProgramChild extends GPUProgram {
	constructor(
		composer: GPUComposer,
		params: {
			name: string,
			// We may want to pass in an array of shader string sources, if split across several files.
			fragmentShader: string | string[],
			uniforms?: UniformParams[],
			// We'll allow some compile time constants to be passed in as #define to the preprocessor for the fragment shader.
			compileTimeConstants?: CompileTimeConstants,
		},
		_gpuio_child_params: {
			fragmentShaderSource: string,
		},
	) {
		super(composer, params);

		const { fragmentShaderSource } = _gpuio_child_params;
		// fragmentShader has already been pre-processed.
		this._fragmentShaderSource = fragmentShaderSource;
	}
}