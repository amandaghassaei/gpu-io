{
	let composer, program;

	const {
		GPUProgram,
		GPUComposer,
		GPULayer,
		FLOAT,
		UNSIGNED_BYTE,
		WEBGL1,
		WEBGL2,
		GLSL1,
		GLSL3,
		UINT,
		INT,
		BOOL,
		isWebGL2,
		DEFAULT_PROGRAM_NAME,
		SEGMENT_PROGRAM_NAME,
		LAYER_POINTS_PROGRAM_NAME,
		LAYER_VECTOR_FIELD_PROGRAM_NAME,
		LAYER_LINES_PROGRAM_NAME,
		GPUIO_VS_UV_ATTRIBUTE,
		GPUIO_VS_NORMAL_ATTRIBUTE,
		GPUIO_VS_POSITION_W_ACCUM,
		GPUIO_VS_INDEXED_POSITIONS,
		FLOAT_4D_UNIFORM,
	} = GPUIO;

	describe('GPUProgram', () => {
		beforeEach(() => {
			composer = new GPUComposer({ canvas: document.createElement('canvas') });
			program = new GPUProgram(composer, {name: 'common-program', fragmentShader: simpleFragmentShader});
		});
		afterEach(() => {
			program.dispose();
			program = undefined;
			composer.dispose();
			composer = undefined;
		});
		describe('constructor', () => {
			it('should error if GPUComposer not passed in', () => {
				assert.throws(() => { new GPUProgram(undefined, { name: 'test-program'}); },
					'Error initing GPUProgram "test-program": must pass GPUComposer instance to GPUProgram(composer, params).');
			});
			it('should error if required params not passed in', () => {
				assert.throws(() => { new GPUProgram(composer); },
					'Error initing GPUProgram: must pass params to GPUProgram(composer, params).');
				assert.throws(() => { new GPUProgram(composer, []); },
					'Error initing GPUProgram: must pass valid params object to GPUProgram(composer, params), got [].');
				assert.throws(() => { new GPUProgram(composer, 'thing'); },
					'Error initing GPUProgram: must pass valid params object to GPUProgram(composer, params), got "thing".');
				assert.throws(() => { new GPUProgram(composer, {}); },
					'Required params key "name" was not passed to GPUProgram(composer, params).');
				assert.throws(() => { new GPUProgram(composer, { name: 'test-program' }); },
					'Required params key "fragmentShader" was not passed to GPUProgram(composer, params) with name "test-program".');
			});
			it('should error if unknown params passed in', () => {
				const warnings = [];
				console.warn = (message) => { warnings.push(message); }
				new GPUProgram(composer, { name: 'test-program', fragmentShader: "", otherThing: 2 });
				assert.equal(warnings.length, 1);
				assert.equal(warnings[0], 'Invalid params key "otherThing" passed to GPUProgram(composer, params) with name "test-program".  Valid keys are ["name","fragmentShader","uniforms","compileTimeConstants"].');
			});
			it('should set parameters', () => {
				const program = new GPUProgram(composer, { name: 'test-program', fragmentShader: setValueFragmentShader });
				assert.equal(program.name, 'test-program');
				program.dispose();
			});
			it('should support glsl1 fragment shaders with gl_FragColor = ', () => {
				const composer1 = new GPUComposer({ canvas: document.createElement('canvas'), glslVersion: GLSL1 });
				const program = new GPUProgram(composer1, { name: 'test-program', fragmentShader: glsl1FragmentShader });
				const layer = new GPULayer(composer1, { name: 'test-layer', numComponents: 4, dimensions: [1, 1], type: FLOAT });
				composer1.step({
					program,
					output: layer,
				});
				const values = layer.getValues();
				values.forEach(value => {
					assert.equal(value, 5);
				});
				layer.dispose();
				program.dispose();
			});
			it('should throw error for glsl1 fragment shaders with glslVersion 3', () => {
				assert.equal(composer.glslVersion, GLSL3);
				assert.throws(() => {
					new GPUProgram(composer, { name: 'test-program', fragmentShader: glsl1FragmentShader });
				}, `Found "gl_FragColor" declaration in fragment shader for GPUProgram "test-program": either init GPUComposer with glslVersion = GLSL1 or use GLSL3 syntax in your fragment shader.`);
			});
		});
		describe('recompile', () => {
			it('should recompile GPUProgram with new compile time variables', () => {
				let value = 4.4;
				const setValueProgram = new GPUProgram(composer, {
					name: 'recompile-test',
					fragmentShader: setValueWithDefineFragmentShader,
					compileTimeConstants: { VALUE: `${value}` },
				});
				const layer = new GPULayer(composer, { name: 'test-layer', type: FLOAT, numComponents: 1, dimensions: [1, 1]});
				composer.step({
					program: setValueProgram,
					output: layer,
				});
				let output = layer.getValues();
				assert.closeTo(output[0], value, 1e-6);
				value = -5.2;
				assert.notEqual(Object.keys(setValueProgram._fragmentShaders).length, 0);
				assert.notEqual(Object.keys(setValueProgram._programs).length, 0);
				setValueProgram.recompile({ VALUE: `${value}` });
				assert.equal(Object.keys(setValueProgram._fragmentShaders).length, 0);
				assert.equal(Object.keys(setValueProgram._programs).length, 0);
				Object.values(setValueProgram._uniforms).forEach(uniform => {
					assert.equal(Object.keys(uniform.location).length, 0);
				});
				composer.step({
					program: setValueProgram,
					output: layer,
				});
				output = layer.getValues();
				assert.closeTo(output[0], value, 1e-6);
			});
		});
		describe('_getProgramWithName', () => {
			it('should return valid WebGLProgram', () => {
				assert.typeOf(program._getProgramWithName(DEFAULT_PROGRAM_NAME, {}, []), 'WebGLProgram');
				assert.typeOf(program._getProgramWithName(DEFAULT_PROGRAM_NAME, {[GPUIO_VS_UV_ATTRIBUTE]: '1'}, []), 'WebGLProgram');
				assert.typeOf(program._getProgramWithName(DEFAULT_PROGRAM_NAME, {[GPUIO_VS_NORMAL_ATTRIBUTE]: '1'}, []), 'WebGLProgram');
				assert.typeOf(program._getProgramWithName(DEFAULT_PROGRAM_NAME, {[GPUIO_VS_UV_ATTRIBUTE]: '1',[GPUIO_VS_NORMAL_ATTRIBUTE]: '1'}, []), 'WebGLProgram');
				assert.typeOf(program._getProgramWithName(SEGMENT_PROGRAM_NAME, {}, []), 'WebGLProgram');
				assert.typeOf(program._getProgramWithName(LAYER_POINTS_PROGRAM_NAME, {}, []), 'WebGLProgram');
				assert.typeOf(program._getProgramWithName(LAYER_POINTS_PROGRAM_NAME, {[GPUIO_VS_POSITION_W_ACCUM]: '1'}, []), 'WebGLProgram');
				assert.typeOf(program._getProgramWithName(LAYER_LINES_PROGRAM_NAME, {[GPUIO_VS_INDEXED_POSITIONS]: '0'}, []), 'WebGLProgram');
				assert.typeOf(program._getProgramWithName(LAYER_LINES_PROGRAM_NAME, {[GPUIO_VS_POSITION_W_ACCUM]: '1', [GPUIO_VS_INDEXED_POSITIONS]: '1'}, []), 'WebGLProgram');
				assert.typeOf(program._getProgramWithName(LAYER_VECTOR_FIELD_PROGRAM_NAME, {}, []), 'WebGLProgram');
			});
		});
		describe('_cacheUniformValue', () => {
			it('should cache uniform values', () => {
				const setValueProgram = new GPUProgram(composer, {
					name: 'uniform-test',
					fragmentShader: setValueFragmentShader,
				});
				const value = [1, 2, 3, 4];
				assert.equal(setValueProgram._cacheUniformValue('u_value', value, FLOAT_4D_UNIFORM), true);
				assert.equal(setValueProgram._cacheUniformValue('u_value', value, FLOAT_4D_UNIFORM), false);
				value[3] = 0;
				assert.equal(setValueProgram._cacheUniformValue('u_value', value, FLOAT_4D_UNIFORM), true);
				value[2] = 5.2;
				setValueProgram.setUniform('u_value', value, FLOAT);
				assert.equal(setValueProgram._cacheUniformValue('u_value', value, FLOAT_4D_UNIFORM), false);
				setValueProgram.dispose();
			});
		}),
		describe('setUniform', () => {
			it('should set program uniform', () => {
				const setValueProgram = new GPUProgram(composer, {
					name: 'uniform-test',
					fragmentShader: setValueFragmentShader,
				});
				const value = [1, 2, 3, 4];
				setValueProgram.setUniform('u_value', value, FLOAT);
				const layer = new GPULayer(composer, { name: 'test-layer', type: FLOAT, numComponents: 4, dimensions: [1, 1]});
				composer.step({
					program: setValueProgram,
					output: layer,
				});
				const output = layer.getValues();
				output.forEach((out, i) => {
					assert.equal(out, value[i], output);
				});
				setValueProgram.dispose();
				layer.dispose();
			});
			it('should handle a variety of types and sizes', () => {
				const composer3 = new GPUComposer({ canvas: document.createElement('canvas'), contextID: WEBGL2, glslVersion: GLSL3 });
				assert.equal(isWebGL2(composer3.gl), true);
				assert.equal(composer3.glslVersion, GLSL3);
				const composer2 = new GPUComposer({ canvas: document.createElement('canvas'), contextID: WEBGL2, glslVersion: GLSL1 });
				assert.equal(isWebGL2(composer2.gl), true);
				assert.equal(composer2.glslVersion, GLSL1);
				const composer1 = new GPUComposer({ canvas: document.createElement('canvas'), contextID: WEBGL1 });
				assert.equal(isWebGL2(composer1.gl), false);
				assert.equal(composer1.glslVersion, GLSL1);

				[composer1, composer2, composer3].forEach(composer => {
					const setUniformProgram = new GPUProgram(composer, {
						name: 'uniform-test',
						fragmentShader: setUniformsValueFragmentShader,
					});
					const layer = new GPULayer(composer, { name: 'test-layer', type: FLOAT, numComponents: 4, dimensions: [1, 1]});
					composer.step({
						program: setUniformProgram,
						output: layer,
					});
					const output = layer.getValues();
					// Should equal zero by default.
					output.forEach((out) => {
						assert.equal(out, 0, `${output}, ${isWebGL2(composer.gl) ? 'WebGL2' : 'WebGL1'}, ${composer.glslVersion}`);
					});

					// Set uniforms.
					setUniformProgram.setUniform('u_uvalue1', 10, UINT);
					setUniformProgram.setUniform('u_uvalue2', [4, 3], UINT);
					setUniformProgram.setUniform('u_uvalue3', [27, 900, 3], UINT);
					setUniformProgram.setUniform('u_uvalue4', [4, 0, 36, 22], UINT);
					setUniformProgram.setUniform('u_ivalue1', 4, INT);
					setUniformProgram.setUniform('u_ivalue2', [-34, 78], INT);
					setUniformProgram.setUniform('u_ivalue3', [-56, 8, 9], INT);
					setUniformProgram.setUniform('u_ivalue4', [23, 0, 23, 5678], INT);
					setUniformProgram.setUniform('u_fvalue1', 3.5, FLOAT);
					setUniformProgram.setUniform('u_fvalue2', [-5.324, 45.8], FLOAT);
					setUniformProgram.setUniform('u_fvalue3', [-56, 4.5, 9], FLOAT);
					setUniformProgram.setUniform('u_fvalue4', [23, 0, 34.87777, -5678.0], FLOAT);
					setUniformProgram.setUniform('u_bvalue1', true, BOOL);
					setUniformProgram.setUniform('u_bvalue2', [false, true], BOOL);
					setUniformProgram.setUniform('u_bvalue3', [true, false, false], BOOL);
					setUniformProgram.setUniform('u_bvalue4', [false, false, true, true], BOOL);

					composer.step({
						program: setUniformProgram,
						output: layer,
					});
					const expected = [1009, 5733, -5618.64623, 5];
					const output2 = layer.getValues();
					output2.forEach((out, i) => {
						assert.closeTo(out, expected[i], 1e-3, `${output2}, ${isWebGL2(composer.gl) ? 'WebGL2' : 'WebGL1'}, ${composer.glslVersion}`);
					});
				});

				composer1.dispose();
				composer2.dispose();
				composer3.dispose();
			});
			it('should cast/handle uint uniforms for UNSIGNED_BYTE GPULayers', () => {
				// This seems to only work after I changed GPULayer to cast UNSIGNED_BYTE types to HALF_FLOAT for GLSL1.
				// Otherwise, I was seeing uniform values >= 1 coming out as 255 from the setValueProgram.
				// Technically read/write to UNSIGNED_BYTE type should work in WebGL1/2 + GLSL1, but in some cases it seemed to be breaking down.
				// See note in GPULayerHelpers.shouldCastIntTypeAsFloat for more info.
				// I don't think this is actually a uniform issue, but rather a UNSIGNED_BYTE GPULayer issue.
				// see tests/mocha/GPULayer/getValues>'should return correct values for UNSIGNED_BYTE GPULayer'
				const composer3 = new GPUComposer({ canvas: document.createElement('canvas'), contextID: WEBGL2, glslVersion: GLSL3 });
				assert.equal(isWebGL2(composer3.gl), true);
				assert.equal(composer3.glslVersion, GLSL3);
				const composer2 = new GPUComposer({ canvas: document.createElement('canvas'), contextID: WEBGL2, glslVersion: GLSL1 });
				assert.equal(isWebGL2(composer2.gl), true);
				assert.equal(composer2.glslVersion, GLSL1);
				const composer1 = new GPUComposer({ canvas: document.createElement('canvas'), contextID: WEBGL1 });
				assert.equal(isWebGL2(composer1.gl), false);
				assert.equal(composer1.glslVersion, GLSL1);

				[composer1, composer2, composer3].forEach(composer => {
					const setValueProgram = new GPUProgram(composer, {
						name: 'uniform-test',
						fragmentShader: setUintValueFragmentShader,
					});
					const value = [1, 2, 3, 4];
					setValueProgram.setUniform('u_value', value, UINT);
					const layer = new GPULayer(composer, { name: 'test-layer', type: UNSIGNED_BYTE, numComponents: 4, dimensions: [1, 1]});
					composer.step({
						program: setValueProgram,
						output: layer,
					});
					const output = layer.getValues();
					output.forEach((out, i) => {
						assert.equal(out, value[i], `${output}, ${isWebGL2(composer.gl) ? 'WebGL2' : 'WebGL1'}, ${composer.glslVersion}`);
					});
					setValueProgram.dispose();
					layer.dispose();
				});
				
				composer1.dispose();
				composer2.dispose();
				composer3.dispose();
			});
			it('should not throw error for missing uniform', () => {
				// I've changed this to only throw a warning.
				const setValueProgram = new GPUProgram(composer, {
					name: 'uniform-test',
					fragmentShader: setValueFragmentShader,
				});
				const value = [1, 2, 3, 4];
				setValueProgram.setUniform('u_value_nonexist', value, FLOAT);
				const layer = new GPULayer(composer, { name: 'test-layer', type: FLOAT, numComponents: 4, dimensions: [1, 1]});
				assert.doesNotThrow(() => { composer.step({
					program: setValueProgram,
					output: layer,
				}); }, Error);
				setValueProgram.dispose();
				layer.dispose();
			});
			it('should throw error for wrong type', () => {
				const setValueProgram = new GPUProgram(composer, {
					name: 'uniform-test',
					fragmentShader: setValueFragmentShader,
				});
				const value = [1, 2, 3, 4];
				setValueProgram.setUniform('u_value', value, UINT);// u_value should be type float.
				const layer = new GPULayer(composer, { name: 'test-layer', type: FLOAT, numComponents: 4, dimensions: [1, 1]});
				assert.throws(() => { composer.step({
					program: setValueProgram,
					output: layer,
				}); }, 'Invalid uniform "u_value" for program "uniform-test". Check that uniform type in shader code matches type UINT_4D_UNIFORM, gl.getUniform(program, location) returned type: Float32Array.');
				setValueProgram.dispose();
				layer.dispose();
			});
		});
		// describe('_setInternalFragmentUniforms', () => {
		// 	// This is tested by pipeline.js.
		// });
		describe('_setVertexUniform', () => {
			it('should set program vertex uniform', () => {
				// Don't throw an error for uniforms that don't exist (only warns).
				assert.doesNotThrow(() => { program._setVertexUniform(program._getProgramWithName(DEFAULT_PROGRAM_NAME, []), 'u_testing', 3, FLOAT); }, Error);
				// Test a case that works, shouldn't throw an error.
				program._setVertexUniform(program._getProgramWithName(DEFAULT_PROGRAM_NAME, []), 'u_internal_scale', 3, FLOAT);
				// This function calls GPUProgram.setUniform, do more extensive testing there.
			});
		});
		describe('dispose', () => {
			it('should delete all keys', () => {
				const testProgram = new GPUProgram(composer, {name: 'dispose-program', fragmentShader: simpleFragmentShader});
				testProgram.dispose();
				assert.equal(Object.keys(testProgram).length, 0, Object.keys(testProgram));
				// We don't really have a way to test if WebGL things were actually deleted.
				// dispose() marks them for deletion, but they are garbage collected later.
			});
		});
	});
}