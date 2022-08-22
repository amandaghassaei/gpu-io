{
	global.self = global.window; // Weird fix to get WebGLcompute import to work.
	const {
		HALF_FLOAT,
		FLOAT,
		UNSIGNED_BYTE,
		BYTE,
		UNSIGNED_SHORT,
		SHORT,
		UNSIGNED_INT,
		INT,
		_testing,
	} = require('../../dist/webgl-compute');
	const {
		initArrayForType,
		calcGPULayerSize,
	} = _testing;
	const { assert } = require('chai');

	describe('GPULayerHelpers', () => {
		describe('initArrayForType', () => {
			const length = 10;
			it('should init correct typed array', () => {
				const halfFloat1 = initArrayForType(HALF_FLOAT, length);
				assert.typeOf(halfFloat1, 'Uint16Array');
				assert.equal(halfFloat1.length, length);
				const halfFloat2 = initArrayForType(HALF_FLOAT, length, false);
				assert.typeOf(halfFloat2, 'Uint16Array');
				assert.equal(halfFloat2.length, length);
				const halfFloat3 = initArrayForType(HALF_FLOAT, length, true);
				assert.typeOf(halfFloat3, 'Float32Array');
				assert.equal(halfFloat3.length, length);

				const float = initArrayForType(FLOAT, length);
				assert.typeOf(float, 'Float32Array');
				assert.equal(float.length, length);

				const uint8 = initArrayForType(UNSIGNED_BYTE, length);
				assert.typeOf(uint8, 'Uint8Array');
				assert.equal(uint8.length, length);

				const int8 = initArrayForType(BYTE, length);
				assert.typeOf(int8, 'Int8Array');
				assert.equal(int8.length, length);

				const uint16 = initArrayForType(UNSIGNED_SHORT, length);
				assert.typeOf(uint16, 'Uint16Array');
				assert.equal(uint16.length, length);

				const int16 = initArrayForType(SHORT, length);
				assert.typeOf(int16, 'Int16Array');
				assert.equal(int16.length, length);

				const uint32 = initArrayForType(UNSIGNED_INT, length);
				assert.typeOf(uint32, 'Uint32Array');
				assert.equal(uint32.length, length);

				const int32 = initArrayForType(INT, length);
				assert.typeOf(int32, 'Int32Array');
				assert.equal(int32.length, length);
			});
			it('should throw error for bad type', () => {
				assert.throws(() => { initArrayForType('thing', length); }, 'Unsupported type: "thing".');
			});
		});
		describe('calcGPULayerSize', () => {
			it('should calc layer size for length', () => {
				assert.deepEqual(calcGPULayerSize(10, 'test', false), { length: 10, width: 4, height: 4 });
				assert.deepEqual(calcGPULayerSize(100, 'test', false), { length: 100, width: 16, height: 8 });
				assert.deepEqual(calcGPULayerSize(12534, 'test', false), { length: 12534, width: 128, height: 128 });
			});
			it('should pass through non-power of 2 width/height combinations', () => {
				assert.deepEqual(calcGPULayerSize([2345, 245], 'test', false), { width: 2345, height: 245 });
			});
			it('should throw error for bad size', () => {
				assert.throws(() => { calcGPULayerSize(0, 'test', false); }, 'Invalid length: 0 for GPULayer "test", must be positive integer.');
				assert.throws(() => { calcGPULayerSize([0, 100], 'test', false); }, 'Invalid width: 0 for GPULayer "test", must be positive integer.');
				assert.throws(() => { calcGPULayerSize([100, 0], 'test', false); }, 'Invalid height: 0 for GPULayer "test", must be positive integer.');
				assert.throws(() => { calcGPULayerSize(5.6, 'test', false); }, 'Invalid length: 5.6 for GPULayer "test", must be positive integer.');
			});
		});
	});
}