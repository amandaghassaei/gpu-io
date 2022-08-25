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
		isWebGL2,
	} = WebGLCompute;

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
					'Required params key "name" was not passed to GPUProgram(composer, params) with name "undefined".');
				assert.throws(() => { new GPUProgram(composer, { name: 'test-program' }); },
					'Required params key "fragmentShader" was not passed to GPUProgram(composer, params) with name "test-program".');
			});
			it('should error if unknown params passed in', () => {
				assert.throws(() => { new GPUProgram(composer, { name: 'test-program', fragmentShader: "", otherThing: 2 }); },
					'Invalid params key "otherThing" passed to GPUProgram(composer, params) with name "test-program".  Valid keys are ["name","fragmentShader","uniforms","defines"].');
			});
			it('should throw errors for bad fragment source code', () => {
				// Init a separate composer so the global one doesn't get into an error state.
				const testComposer = new GPUComposer({ canvas: document.createElement('canvas') });
				assert.throws(() => { new GPUProgram(testComposer, { name: 'test-program', fragmentShader: "" }); },
					'Could not compile fragment shader for program "test-program": ERROR: Missing main()');
				testComposer.dispose();
			});
			it('should set parameters', () => {
				const program = new GPUProgram(composer, { name: 'test-program', fragmentShader: setValueFragmentShader });
				assert.equal(program.name, 'test-program');
			});
		});
		describe('get _defaultProgram', () => {
			it('should return valid WebGLProgram', () => {
				assert.typeOf(program._defaultProgram, 'WebGLProgram');
			});
		});
		describe('get _defaultProgramWithUV', () => {
			it('should return valid WebGLProgram', () => {
				assert.typeOf(program._defaultProgramWithUV, 'WebGLProgram');
			});
		});
		describe('get _defaultProgramWithNormal', () => {
			it('should return valid WebGLProgram', () => {
				assert.typeOf(program._defaultProgramWithNormal, 'WebGLProgram');
			});
		});
		describe('get _defaultProgramWithUVNormal', () => {
			it('should return valid WebGLProgram', () => {
				assert.typeOf(program._defaultProgramWithUVNormal, 'WebGLProgram');
			});
		});
		describe('get _segmentProgram', () => {
			it('should return valid WebGLProgram', () => {
				assert.typeOf(program._segmentProgram, 'WebGLProgram');
			});
		});
		describe('get _layerPointsProgram', () => {
			it('should return valid WebGLProgram', () => {
				assert.typeOf(program._layerPointsProgram, 'WebGLProgram');
			});
		});
		describe('get _layerVectorFieldProgram', () => {
			it('should return valid WebGLProgram', () => {
				assert.typeOf(program._layerVectorFieldProgram, 'WebGLProgram');
			});
		});
		describe('get _layerLinesProgram', () => {
			it('should return valid WebGLProgram', () => {
				assert.typeOf(program._layerLinesProgram, 'WebGLProgram');
			});
		});
		
		describe('setUniform', () => {
			it('should set program uniform', () => {
				const setValueProgram = new GPUProgram(composer, {
					name: 'uniform-test',
					fragmentShader: setValueFragmentShader,
				});
				const value = [1, 2, 3, 4];
				setValueProgram.setUniform('u_value', value, FLOAT);
				const layer = new GPULayer(composer, { name: 'test-layer', type: FLOAT, numComponents: 4, writable: true, dimensions: [1, 1]});
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
				// TODO:
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
					const layer = new GPULayer(composer, { name: 'test-layer', type: UNSIGNED_BYTE, numComponents: 4, writable: true, dimensions: [1, 1]});
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
			it('should throw error for missing uniform', () => {
				const setValueProgram = new GPUProgram(composer, {
					name: 'uniform-test',
					fragmentShader: setValueFragmentShader,
				});
				const value = [1, 2, 3, 4];
				setValueProgram.setUniform('u_value_nonexist', value, FLOAT);
				const layer = new GPULayer(composer, { name: 'test-layer', type: FLOAT, numComponents: 4, writable: true, dimensions: [1, 1]});
				assert.throws(() => { composer.step({
					program: setValueProgram,
					output: layer,
				}); }, /Could not init uniform "u_value_nonexist" for program "uniform-test". Check that uniform is present in shader code, unused uniforms may be removed by compiler. Also check that uniform type in shader code matches type 4f. Error code: [0-9]+./);
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
				const layer = new GPULayer(composer, { name: 'test-layer', type: FLOAT, numComponents: 4, writable: true, dimensions: [1, 1]});
				assert.throws(() => { composer.step({
					program: setValueProgram,
					output: layer,
				}); }, 'Invalid uniform "u_value" for program "uniform-test". Check that uniform type in shader code matches type 4ui, gl.getUniform(program, location) returned type: Float32Array.');
				setValueProgram.dispose();
				layer.dispose();
			});
		});
		describe('_setVertexUniform', () => {
			it('should set program vertex uniform', () => {
				// Throw an error for uniforms that don't exist.
				assert.throws(() => { program._setVertexUniform(program._defaultProgram, 'u_testing', 3, FLOAT) },
/Could not init uniform "u_testing" for program "common-program". Check that uniform is present in shader code, unused uniforms may be removed by compiler. Also check that uniform type in shader code matches type 1f. Error code: [0-9]+./);
				// Test a case that works, shouldn't throw an error.
				program._setVertexUniform(program._defaultProgram, 'u_internal_scale', 3, FLOAT);
				// This function calls GPUProgram.setUniform, do more extensive testing there.
			});
		});
		describe('dispose', () => {
			it('should delete all keys', () => {
				const testProgram = new GPUProgram(composer, {name: 'dispose-program', fragmentShader: simpleFragmentShader});
				testProgram.dispose();
				assert.equal(Object.keys(testProgram).length, 0);
				// We don't really have a way to test if WebGL things were actually deleted.
				// dispose() marks them for deletion, but they are garbage collected later.
			});
		});
	});
}