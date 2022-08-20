{

	let composer, program;

	const {
		GPUProgram,
		GPUComposer,
		GPULayer,
		FLOAT,
	} = WebGLCompute;
	describe('GPUProgram', () => {
		before(() => {
			composer = new GPUComposer({ canvas: document.createElement('canvas') });
			program = new GPUProgram(composer, {name: 'common-program', fragmentShader: simpleFragmentShader});
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
		});
		describe('recompile', () => {
			it('should recompile fragment shader with new defines', () => {
				// { WEBGLCOMPUTE_INT: '1' }
				// TODO:
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
		// TODO:
		// describe('get _GPULayerPointsProgram', () => {
		// 	it('should return valid WebGLProgram', () => {
		// 		assert.typeOf(program._GPULayerPointsProgram, 'WebGLProgram');
		// 	});
		// });
		// describe('get _GPULayerVectorFieldProgram', () => {
		// 	it('should return valid WebGLProgram', () => {
		// 		assert.typeOf(program._GPULayerVectorFieldProgram, 'WebGLProgram');
		// 	});
		// });
		// describe('get _GPULayerLinesProgram', () => {
		// 	it('should return valid WebGLProgram', () => {
		// 		assert.typeOf(program._GPULayerLinesProgram, 'WebGLProgram');
		// 	});
		// });
		
		describe('setUniform', () => {
			it('should set program uniform', () => {
				// TODO: fix this.
				// const setValueProgram = new GPUProgram(composer, {
				// 	name: 'uniform-test',
				// 	fragmentShader: setValueFragmentShader,
				// });
				// const value = [1, 2, 3, 4];
				// setValueProgram.setUniform('u_value', value, FLOAT);
				// const layer = new GPULayer(composer, { name: 'test-layer', type: FLOAT, numComponents: 4, writable: true, dimensions: [1, 1]});
				// composer.step({
				// 	program: setValueProgram,
				// 	output: layer,
				// });
				// const output = layer.getValues();
				// console.log(output)
				// output.forEach((out, i) => {
				// 	assert.equal(out, value[i]);
				// });
			});
			it('should handle a variety of types and sizes', () => {

			});
		});
		describe('_setVertexUniform', () => {
			it('should set program vertex uniform', () => {
				// Throw an error for uniforms that don't exist.
				assert.throws(() => { program._setVertexUniform(program._defaultProgram, 'u_testing', 3, FLOAT) },
/Could not init uniform "u_testing" for program "common-program".\nCheck that uniform is present in shader code, unused uniforms may be removed by compiler.\nAlso check that uniform type in shader code matches type 1f.\nError code: [0-9]+./);
				// Test a case that works, shouldn't throw an error.
				program._setVertexUniform(program._defaultProgram, 'u_internal_scale', 3, FLOAT);
				// This function calls GPUProgram.setUniform, do more extensive testing there.
			});
		});
		describe('dispose', () => {
			it('should delete all keys', () => {
				program.dispose();
				assert.equal(Object.keys(program).length, 0);
				// We don't really have a way to test if WebGL things were actually deleted.
				// dispose() marks them for deletion, but they are garbage collected later.
			});
		});
	});
}