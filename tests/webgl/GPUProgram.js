{

	let composer, program;

	const {
		GPUProgram,
		GPUComposer,
	} = WebGLCompute;
	describe('GPUProgram', () => {
		before(() => {
			composer = new GPUComposer({ canvas: document.createElement('canvas') });
			// program = new GPUProgram(composer, {name: 'common-program', fragmentShader: copyFragmentShader});
		});
		describe('constructor', () => {
			it('should error if GPUComposer not passed in', () => {
				assert.throws(() => { new GPUProgram(undefined, { name: 'test-program'}); }, 'Error initing GPUProgram "test-program": must pass GPUComposer instance to GPUProgram(composer, params).');
			});
			it('should error if required params not passed in', () => {
				assert.throws(() => { new GPUProgram(composer); }, 'Error initing GPUProgram: must pass params to GPUProgram(composer, params).');
				assert.throws(() => { new GPUProgram(composer, []); }, 'Error initing GPUProgram: must pass valid params object to GPUProgram(composer, params), got [].');
				assert.throws(() => { new GPUProgram(composer, 'thing'); }, 'Error initing GPUProgram: must pass valid params object to GPUProgram(composer, params), got "thing".');
				assert.throws(() => { new GPUProgram(composer, {}); }, 'Required params key "name" was not passed to GPUProgram(composer, params) with name "undefined".');
				assert.throws(() => { new GPUProgram(composer, { name: 'test-program' }); }, 'Required params key "fragmentShader" was not passed to GPUProgram(composer, params) with name "test-program".');
			});
			it('should error if unknown params passed in', () => {
				assert.throws(() => { new GPUProgram(composer, { name: 'test-program', fragmentShader: "", otherThing: 2 }); }, 'Invalid params key "otherThing" passed to GPUProgram(composer, params) with name "test-program".  Valid keys are ["name","fragmentShader","uniforms","defines"].');
			});
		});
		describe('recompile', () => {
			it('should set program uniform', () => {
				// TODO: 
			});
		});
		describe('get _defaultProgram', () => {
			it('should return valid WebGLProgram', () => {
				// assert.typeOf()
			});
		});
		describe('setUniform', () => {
			it('should set program uniform', () => {

			});
		});
		describe('dispose', () => {
			it('should not throw error', () => {

			});
		});
	});
}