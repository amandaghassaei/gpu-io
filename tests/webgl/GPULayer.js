{
	const {
		GPUComposer,
		GPULayer,
		HALF_FLOAT,
		FLOAT,
		UNSIGNED_BYTE,
		BYTE,
		UNSIGNED_SHORT,
		SHORT,
		UNSIGNED_INT,
		INT,
		WEBGL1,
		WEBGL2,
		CLAMP_TO_EDGE,
		REPEAT,
		NEAREST,
		LINEAR,
		GLSL1,
		GLSL3,
	} = WebGLCompute;

	let composer1, composer2, composer3;

	describe('GPULayer', () => {
		before(() => {
			composer1 = new GPUComposer({ canvas: document.createElement('canvas'), contextID: WEBGL1 });
			composer2 = new GPUComposer({ canvas: document.createElement('canvas'), contextID: WEBGL2, glslVersion: GLSL1 });
			composer3 = new GPUComposer({ canvas: document.createElement('canvas'), contextID: WEBGL2, glslVersion: GLSL3 });
		});
		after(() => {
			composer1.dispose();
			composer2.dispose();
			composer3.dispose();
		});
		describe('constructor', () => {
			it('should ', () => {
			});
		});
		describe('constructor', () => {
			it('should ', () => {
			});
		});
		describe('constructor', () => {
			it('should ', () => {
			});
		});
		describe('constructor', () => {
			it('should ', () => {
			});
		});
		describe('constructor', () => {
			it('should ', () => {
			});
		});
		describe('constructor', () => {
			it('should ', () => {
			});
		});
		describe('constructor', () => {
			it('should ', () => {
			});
		});
		describe('constructor', () => {
			it('should ', () => {
			});
		});
		describe('constructor', () => {
			it('should ', () => {
			});
		});
	});
}