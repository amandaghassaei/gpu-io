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
		isWebGL2,
		_testing,
	} = GPUIO;
	const {
		shouldCastIntTypeAsFloat,
		minMaxValuesForType,
		initSequentialFloatArray,
		isPowerOf2,
		getExtension,
		testWriteSupport,
		testFilterWrap,
		OES_TEXTURE_FLOAT,
		OES_TEXTURE_HALF_FLOAT,
		isIntType,
	} = _testing;
	const { getFloat16 } = float16;
	const { isArray } = TypeChecks;

	let composer1, composer2, composer3;

	describe('GPULayerHelpers', () => {
		beforeEach(() => {
			composer1 = new GPUComposer({ canvas: document.createElement('canvas'), contextID: WEBGL1 });
			composer2 = new GPUComposer({ canvas: document.createElement('canvas'), contextID: WEBGL2, glslVersion: GLSL1 });
			composer3 = new GPUComposer({ canvas: document.createElement('canvas'), contextID: WEBGL2, glslVersion: GLSL3 });
		});
		afterEach(() => {
			composer1.dispose();
			composer2.dispose();
			composer3.dispose();
			composer1 = undefined;
			composer2 = undefined;
			composer3 = undefined;
		});
		describe('GPULayer.initArrayForType', () => {
			const length = 10;
			it('should init correct typed array', () => {
				const halfFloat1 = GPULayer.initArrayForType(HALF_FLOAT, length);
				assert.typeOf(halfFloat1, 'Uint16Array');
				assert.equal(halfFloat1.length, length);
				const halfFloat2 = GPULayer.initArrayForType(HALF_FLOAT, length, false);
				assert.typeOf(halfFloat2, 'Uint16Array');
				assert.equal(halfFloat2.length, length);
				const halfFloat3 = GPULayer.initArrayForType(HALF_FLOAT, length, true);
				assert.typeOf(halfFloat3, 'Float32Array');
				assert.equal(halfFloat3.length, length);

				const float = GPULayer.initArrayForType(FLOAT, length);
				assert.typeOf(float, 'Float32Array');
				assert.equal(float.length, length);

				const uint8 = GPULayer.initArrayForType(UNSIGNED_BYTE, length);
				assert.typeOf(uint8, 'Uint8Array');
				assert.equal(uint8.length, length);

				const int8 = GPULayer.initArrayForType(BYTE, length);
				assert.typeOf(int8, 'Int8Array');
				assert.equal(int8.length, length);

				const uint16 = GPULayer.initArrayForType(UNSIGNED_SHORT, length);
				assert.typeOf(uint16, 'Uint16Array');
				assert.equal(uint16.length, length);

				const int16 = GPULayer.initArrayForType(SHORT, length);
				assert.typeOf(int16, 'Int16Array');
				assert.equal(int16.length, length);

				const uint32 = GPULayer.initArrayForType(UNSIGNED_INT, length);
				assert.typeOf(uint32, 'Uint32Array');
				assert.equal(uint32.length, length);

				const int32 = GPULayer.initArrayForType(INT, length);
				assert.typeOf(int32, 'Int32Array');
				assert.equal(int32.length, length);
			});
			it('should throw error for bad type', () => {
				assert.throws(() => { GPULayer.initArrayForType('thing', length); }, 'Unsupported type: "thing".');
			});
		});
		describe('GPULayer.calcGPULayerSize', () => {
			it('should calc layer size for length', () => {
				assert.deepEqual(GPULayer.calcGPULayerSize(10, 'test', false), { length: 10, width: 4, height: 3 });
				assert.deepEqual(GPULayer.calcGPULayerSize(100, 'test', false), { length: 100, width: 10, height: 10 });
				assert.deepEqual(GPULayer.calcGPULayerSize(12534, 'test', false), { length: 12534, width: 112, height: 112 });
			});
			it('should pass through non-power of 2 width/height combinations', () => {
				assert.deepEqual(GPULayer.calcGPULayerSize([2345, 245], 'test', false), { width: 2345, height: 245 });
			});
			it('should throw error for bad size', () => {
				assert.throws(() => { GPULayer.calcGPULayerSize(0, 'test', false); }, 'Invalid length: 0 for GPULayer "test", must be positive integer.');
				assert.throws(() => { GPULayer.calcGPULayerSize([0, 100], 'test', false); }, 'Invalid width: 0 for GPULayer "test", must be positive integer.');
				assert.throws(() => { GPULayer.calcGPULayerSize([100, 0], 'test', false); }, 'Invalid height: 0 for GPULayer "test", must be positive integer.');
				assert.throws(() => { GPULayer.calcGPULayerSize(5.6, 'test', false); }, 'Invalid length: 5.6 for GPULayer "test", must be positive integer.');
				assert.throws(() => { GPULayer.calcGPULayerSize(-70, 'test', false); }, 'Invalid length: -70 for GPULayer "test", must be positive integer.');
			});
		});
		describe('GPULayer.getGPULayerInternalWrap', () => {
			it('should always support CLAMP_TO_EDGE wrapping', () => {
				assert.equal(GPULayer.getGPULayerInternalWrap({ composer: composer1, wrap: CLAMP_TO_EDGE, name: 'test', internalFilter: NEAREST, internalType: HALF_FLOAT }), CLAMP_TO_EDGE);
				assert.equal(GPULayer.getGPULayerInternalWrap({ composer: composer2, wrap: CLAMP_TO_EDGE, name: 'test', internalFilter: NEAREST, internalType: HALF_FLOAT }), CLAMP_TO_EDGE);
				assert.equal(GPULayer.getGPULayerInternalWrap({ composer: composer3, wrap: CLAMP_TO_EDGE, name: 'test', internalFilter: NEAREST, internalType: HALF_FLOAT }), CLAMP_TO_EDGE);
			});
			it('should support REPEAT wrapping in WebGL2', () => {
				assert.equal(GPULayer.getGPULayerInternalWrap({ composer: composer1, wrap: REPEAT, name: 'test', internalFilter: NEAREST, internalType: HALF_FLOAT }), CLAMP_TO_EDGE);
				assert.equal(GPULayer.getGPULayerInternalWrap({ composer: composer2, wrap: REPEAT, name: 'test', internalFilter: NEAREST, internalType: HALF_FLOAT }), REPEAT);
				assert.equal(GPULayer.getGPULayerInternalWrap({ composer: composer3, wrap: REPEAT, name: 'test', internalFilter: NEAREST, internalType: HALF_FLOAT }), REPEAT);
			});
		});
		describe('GPULayer.getGPULayerInternalFilter', () => {
			it('should always support NEAREST filtering', () => {
				getExtension(composer1, OES_TEXTURE_FLOAT, true);
				getExtension(composer1, OES_TEXTURE_HALF_FLOAT, true);
				[FLOAT, HALF_FLOAT, UNSIGNED_BYTE, BYTE, UNSIGNED_SHORT, SHORT, UNSIGNED_INT, INT].forEach(type => {
					assert.equal(GPULayer.getGPULayerInternalFilter({ composer: composer1, filter: NEAREST, wrapX: CLAMP_TO_EDGE, wrapY: CLAMP_TO_EDGE, internalType: type, name: 'test' }), NEAREST);
					assert.equal(GPULayer.getGPULayerInternalFilter({ composer: composer2, filter: NEAREST, wrapX: CLAMP_TO_EDGE, wrapY: CLAMP_TO_EDGE, internalType: type, name: 'test' }), NEAREST);
					assert.equal(GPULayer.getGPULayerInternalFilter({ composer: composer3, filter: NEAREST, wrapX: CLAMP_TO_EDGE, wrapY: CLAMP_TO_EDGE, internalType: type, name: 'test' }), NEAREST);
				});
			});
			it('should support LINEAR float filtering with extensions', () => {
				getExtension(composer1, OES_TEXTURE_FLOAT, true);
				getExtension(composer1, OES_TEXTURE_HALF_FLOAT, true);
				[FLOAT, HALF_FLOAT].forEach(type => {
					assert.equal(GPULayer.getGPULayerInternalFilter({ composer: composer1, filter: LINEAR, wrapX: CLAMP_TO_EDGE, wrapY: CLAMP_TO_EDGE, internalType: type, name: 'test' }), LINEAR);
					assert.equal(GPULayer.getGPULayerInternalFilter({ composer: composer2, filter: LINEAR, wrapX: CLAMP_TO_EDGE, wrapY: CLAMP_TO_EDGE, internalType: type, name: 'test' }), LINEAR);
					assert.equal(GPULayer.getGPULayerInternalFilter({ composer: composer3, filter: LINEAR, wrapX: CLAMP_TO_EDGE, wrapY: CLAMP_TO_EDGE, internalType: type, name: 'test' }), LINEAR);
				});
			});
		});
		describe('shouldCastIntTypeAsFloat', () => {
			it('should never cast glsl3 ints to float', () => {
				assert.equal(shouldCastIntTypeAsFloat(composer3, HALF_FLOAT), false);
				assert.equal(shouldCastIntTypeAsFloat(composer3, FLOAT), false);
				assert.equal(shouldCastIntTypeAsFloat(composer3, UNSIGNED_BYTE), false);
				assert.equal(shouldCastIntTypeAsFloat(composer3, BYTE), false);
				assert.equal(shouldCastIntTypeAsFloat(composer3, UNSIGNED_SHORT), false);
				assert.equal(shouldCastIntTypeAsFloat(composer3, SHORT), false);
				assert.equal(shouldCastIntTypeAsFloat(composer3, UNSIGNED_INT), false);
				assert.equal(shouldCastIntTypeAsFloat(composer3, INT), false);
			});
			it('should cast non-glsl3 ints to float (even UNSIGNED_BYTE)', () => {
				// See note in GPULayerHelpers.shouldCastIntTypeAsFloat for more info.
				assert.equal(shouldCastIntTypeAsFloat(composer1, HALF_FLOAT), false);
				assert.equal(shouldCastIntTypeAsFloat(composer1, FLOAT), false);
				assert.equal(shouldCastIntTypeAsFloat(composer1, UNSIGNED_BYTE), true);
				assert.equal(shouldCastIntTypeAsFloat(composer1, BYTE), true);
				assert.equal(shouldCastIntTypeAsFloat(composer1, UNSIGNED_SHORT), true);
				assert.equal(shouldCastIntTypeAsFloat(composer1, SHORT), true);
				assert.equal(shouldCastIntTypeAsFloat(composer1, UNSIGNED_INT), true);
				assert.equal(shouldCastIntTypeAsFloat(composer1, INT), true);

				assert.equal(shouldCastIntTypeAsFloat(composer2, HALF_FLOAT), false);
				assert.equal(shouldCastIntTypeAsFloat(composer2, FLOAT), false);
				assert.equal(shouldCastIntTypeAsFloat(composer2, UNSIGNED_BYTE), true);
				assert.equal(shouldCastIntTypeAsFloat(composer2, BYTE), true);
				assert.equal(shouldCastIntTypeAsFloat(composer2, UNSIGNED_SHORT), true);
				assert.equal(shouldCastIntTypeAsFloat(composer2, SHORT), true);
				assert.equal(shouldCastIntTypeAsFloat(composer2, UNSIGNED_INT), true);
				assert.equal(shouldCastIntTypeAsFloat(composer2, INT), true);
			});
		});
		describe('GPULayer.getGLTextureParameters', () => {
			it('should return valid texture parameters', () => {
				// There are a lot of combos to test, so let's just make sure that no valid input throws an error.
				// This is tested more robustly in pipeline.js.
				[1, 2, 3, 4].forEach(numComponents => {
					[FLOAT, HALF_FLOAT, UNSIGNED_BYTE, BYTE, UNSIGNED_SHORT, SHORT, UNSIGNED_INT, INT].forEach(type => {
						[composer1, composer2, composer3].forEach(composer => {
							const result = GPULayer.getGLTextureParameters({
								composer: composer,
								name: 'test',
								numComponents,
								internalType: GPULayer.getGPULayerInternalType({
									composer: composer,
									type,
									name: 'test',
								}),
							});
							assert.hasAllKeys(result, ['glFormat', 'glInternalFormat', 'glType', 'glNumChannels']);
						});
					});
				});
			});
			it('should throw error for bad inputs', () => {
				assert.equal(isWebGL2(composer1.gl), false);
				assert.throws(() => { GPULayer.getGLTextureParameters({
					composer: composer1,
					name: 'test',
					numComponents: 3,
					internalType: INT,
				}); },
				'Unsupported type: "INT" in WebGL 1.0 for GPULayer "test".');
				assert.throws(() => { GPULayer.getGLTextureParameters({
					composer: composer1,
					name: 'test',
					numComponents: 5,
					internalType: INT,
				}); },
				'Unsupported numComponents: 5 for GPULayer "test".');
				assert.throws(() => { GPULayer.getGLTextureParameters({
					composer: composer3,
					name: 'test',
					numComponents: 2,
					internalType: 'bad',
				}); },
				'Unsupported type: "bad" for GPULayer "test".');
				assert.throws(() => { GPULayer.getGLTextureParameters({
					composer: composer2,
					name: 'test',
					numComponents: 5,
					internalType: INT,
				}); },
				'Unsupported glNumChannels: 5 for GPULayer "test".');
			});
		});
		describe('GPULayer.testWriteSupport', () => {
			it('should succeed for all combinations', () => {
				[composer1, composer2, composer3].forEach(composer => {
					[FLOAT, HALF_FLOAT].forEach(type => {
						assert.equal(testWriteSupport(
							composer,
							GPULayer.getGPULayerInternalType({
								composer: composer,
								type,
								name: 'test',
							}),
						), true, `${isWebGL2(composer.gl) ? 'WebGL2' : 'WebGL1'} + ${composer.glslVersion} + ${type}`);
					});
				});
			});
		});
		describe('GPULayer.testFilterWrap', () => {
			it('should succeed for most combinations', () => {
				[composer1, composer2, composer3].forEach(composer => {
					[FLOAT, HALF_FLOAT, UNSIGNED_BYTE, BYTE, UNSIGNED_SHORT, SHORT, UNSIGNED_INT, INT].forEach(type => {
						[LINEAR, NEAREST].forEach(filter => {
							// Don't test int types with LINEAR filtering.
							if (filter === LINEAR && isIntType(type)) return;
							[REPEAT, CLAMP_TO_EDGE].forEach(wrap => {
								const internalType = GPULayer.getGPULayerInternalType({
									composer,
									type,
									name: 'testFilterWrap',
								});
								const internalFilter = GPULayer.getGPULayerInternalFilter({ composer, filter, internalType, wrapX: wrap, wrapY: wrap, name: 'testFilterWrap', });
								let expected = true;
								// We do not expect this to succeed for WebGL1 + REPEAT + FLOAT/HALF_FLOAT
								if (composer === composer1 && wrap === REPEAT && !isIntType(internalType)) expected = false;
								assert.equal(testFilterWrap(composer, internalType, internalFilter, wrap), expected,
									`${isWebGL2(composer.gl) ? 'WebGL2' : 'WebGL1'} + ${composer.glslVersion} + ${internalType} + ${internalFilter} + ${wrap}`);
							});
						});
					});
				});
			});
		});
		describe('GPULayer.getGPULayerInternalType', () => {
			it('should return internal type === type for GLSL3', () => {
				[FLOAT, HALF_FLOAT, UNSIGNED_BYTE, BYTE, UNSIGNED_SHORT, SHORT, UNSIGNED_INT, INT].forEach(type => {
					assert.equal(GPULayer.getGPULayerInternalType({
						composer: composer3,
						type,
						name: 'test',
					}), type);
				});
			});
			it('should return valid internal type for GLSL1', () => {
				const results = [FLOAT, HALF_FLOAT, HALF_FLOAT, HALF_FLOAT, FLOAT, FLOAT, FLOAT, FLOAT];
				[composer1, composer2].forEach(composer => {
					[FLOAT, HALF_FLOAT, UNSIGNED_BYTE, BYTE, UNSIGNED_SHORT, SHORT, UNSIGNED_INT, INT].forEach((type, i) => {
						assert.equal(GPULayer.getGPULayerInternalType({
							composer,
							type,
							name: 'test',
						}), results[i]);
					});
				});
			});
		});
		describe('minMaxValuesForType', () => {
			it('should return valid min/max values for int types', () => {
				assert.equal(minMaxValuesForType(UNSIGNED_BYTE).min, 0);
				assert.equal(minMaxValuesForType(UNSIGNED_SHORT).min, 0);
				assert.equal(minMaxValuesForType(UNSIGNED_INT).min, 0);
				assert.equal(minMaxValuesForType(UNSIGNED_BYTE).max, 2**8 - 1);
				assert.equal(minMaxValuesForType(UNSIGNED_SHORT).max, 2**16 - 1);
				assert.equal(minMaxValuesForType(UNSIGNED_INT).max, 2**32 - 1);
				assert.equal(minMaxValuesForType(BYTE).min, -(2 ** 7));
				assert.equal(minMaxValuesForType(SHORT).min, -(2 ** 15));
				assert.equal(minMaxValuesForType(INT).min, -(2 ** 31));
				assert.equal(minMaxValuesForType(BYTE).max, 2**7 - 1);
				assert.equal(minMaxValuesForType(SHORT).max, 2**15 - 1);
				assert.equal(minMaxValuesForType(INT).max, 2**31 - 1);
			});
		});
		describe('GPULayer.validateGPULayerArray', () => {
			const size = [10, 12];
			const length = 100;
			it('should validate 1D and 2D arrays', () => {
				// 2D, 1D and 1D power of 2.
				[size, length, 256].forEach(dimensions => {
					[1, 2, 3, 4].forEach(numComponents => {
						[FLOAT, UNSIGNED_BYTE, BYTE, UNSIGNED_SHORT, SHORT, UNSIGNED_INT, INT].forEach(type => {
							const layer = new GPULayer(composer3, {
								name: 'test',
								type,
								dimensions,
								numComponents,
							});
							// Array1 may be undersized if numComponents < layer.glNumChannels.
							const array1 = GPULayer.initArrayForType(type, (isArray(dimensions) ? dimensions[0] * dimensions[1] : dimensions) * numComponents);
							const validated1 = GPULayer.validateGPULayerArray(array1, layer);
							assert.typeOf(validated1, array1.constructor.name);
							assert.isAtLeast(validated1.length, array1.length);

							// Incorrect type (and possibly length) passed in, should type cast.
							const array3 = initSequentialFloatArray((isArray(dimensions) ? dimensions[0] * dimensions[1] : dimensions) * numComponents);
							const validated3 = GPULayer.validateGPULayerArray(array3, layer);
							assert.typeOf(validated3, array1.constructor.name); // Intentionally comparing with array1 constructor here.
							assert.isAtLeast(validated3.length, array3.length);
							// Get min and max values for type.
							const { min, max } = minMaxValuesForType(type);

							// Check that values are passed through.
							for (let i = 0; i < (isArray(dimensions) ? dimensions[0] * dimensions[1] : dimensions); i++) {
								for (let j = 0; j < layer.glNumChannels; j++) {
									if (j < numComponents) {
										// Values are clipped if needed.
										assert.equal(validated3[layer.glNumChannels * i + j], Math.max(Math.min(array3[numComponents * i + j], max), min));
									} else {
										assert.equal(validated3[layer.glNumChannels * i + j], 0);
									}
								}
							}
						});
					});
				});
			});
			it ('should handle HALF_FLOAT cases', () => {
				// 2D, 1D and 1D power of 2.
				[size, length, 256].forEach(dimensions => {
					[1, 2, 3, 4].forEach(numComponents => {
						const layer = new GPULayer(composer3, {
							name: 'test',
							type: HALF_FLOAT,
							dimensions,
							numComponents,
						});
						// Array1 may be undersized if numComponents < layer.glNumChannels.
						const array1 = GPULayer.initArrayForType(HALF_FLOAT, (isArray(dimensions) ? dimensions[0] * dimensions[1] : dimensions) * numComponents, true);
						assert.typeOf(array1, 'Float32Array');
						const validated1 = GPULayer.validateGPULayerArray(array1, layer);
						assert.typeOf(validated1, 'Uint16Array');
						assert.isAtLeast(validated1.length, array1.length);

						// Incorrect type (and possibly length) passed in, should type cast.
						const array3 = initSequentialFloatArray((isArray(dimensions) ? dimensions[0] * dimensions[1] : dimensions) * numComponents);
						const validated3 = GPULayer.validateGPULayerArray(array3, layer);
						assert.typeOf(validated3, 'Uint16Array');
						assert.isAtLeast(validated3.length, array3.length);
						
						// Check that values are passed through.
						const view = new DataView((validated3).buffer);
						for (let i = 0; i < (isArray(dimensions) ? dimensions[0] * dimensions[1] : dimensions); i++) {
							for (let j = 0; j < layer.glNumChannels; j++) {
								if (j < numComponents) {
									assert.equal(getFloat16(view, 2 * (layer.glNumChannels * i + j), true), array3[numComponents * i + j]);
								} else {
									assert.equal(validated3[layer.glNumChannels * i + j], 0);
								}
							}
						}
					});
				});
			});
			it('should throw error in case of invalid array', () => {
				const numComponents = 3;
				const layer1 = new GPULayer(composer3, {
					name: 'test',
					type: UNSIGNED_BYTE,
					dimensions: length,
					numComponents,
				});
				const layer2 = new GPULayer(composer3, {
					name: 'test',
					type: UNSIGNED_BYTE,
					dimensions: size,
					numComponents,
				});
				// Wrong length.
				const array1 = new Array(length * numComponents + 10);
				assert.throws(() => { GPULayer.validateGPULayerArray(array1, layer1); },	
					'Invalid data length: 310 for GPULayer "test" of length 100 and dimensions: [10, 10] and numComponents: 3.');
				const array2 = new Array(size[0] * size[1] * numComponents + 10);
				assert.throws(() => { GPULayer.validateGPULayerArray(array2, layer2); },
					'Invalid data length: 370 for GPULayer "test" of dimensions: [10, 12] and numComponents: 3.');
				// Wrong type.
				assert.throws(() => { GPULayer.validateGPULayerArray(new Array(length * numComponents).fill(0).join(''), layer1); },
					'Invalid array type: String for GPULayer "test", please use one of [Float32Array, Uint8Array, Int8Array, Uint16Array, Int16Array, Uint32Array, Int32Array, Array].');
			});
		});
	});
}