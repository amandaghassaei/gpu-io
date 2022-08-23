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
		MIN_UNSIGNED_BYTE,
		MAX_UNSIGNED_BYTE,
		MIN_BYTE,
		MAX_BYTE,
		MIN_UNSIGNED_SHORT,
		MAX_UNSIGNED_SHORT,
		MIN_SHORT,
		MAX_SHORT,
		MIN_UNSIGNED_INT,
		MAX_UNSIGNED_INT,
		MIN_INT,
		MAX_INT,
		isWebGL2,
		_testing,
	} = WebGLCompute;
	const {
		initArrayForType,
		calcGPULayerSize,
		getGPULayerInternalWrap,
		getGPULayerInternalFilter,
		shouldCastIntTypeAsFloat,
		getGLTextureParameters,
		testFramebufferAttachment,
		getGPULayerInternalType,
		validateGPULayerArray,
		initSequentialFloatArray,
		isArray,
		isPowerOf2
	} = _testing;
	const { getFloat16 } = float16;

	let composer1, composer2, composer3;

	describe('GPULayerHelpers', () => {
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
				assert.throws(() => { calcGPULayerSize(-70, 'test', false); }, 'Invalid length: -70 for GPULayer "test", must be positive integer.');
			});
		});
		describe('getGPULayerInternalWrap', () => {
			it('should always support CLAMP_TO_EDGE wrapping', () => {
				assert.equal(getGPULayerInternalWrap({ composer: composer1, wrap: CLAMP_TO_EDGE, name: 'test' }), CLAMP_TO_EDGE);
				assert.equal(getGPULayerInternalWrap({ composer: composer2, wrap: CLAMP_TO_EDGE, name: 'test' }), CLAMP_TO_EDGE);
				assert.equal(getGPULayerInternalWrap({ composer: composer3, wrap: CLAMP_TO_EDGE, name: 'test' }), CLAMP_TO_EDGE);
			});
			it('should support CLAMP_TO_EDGE wrapping in WebGL2', () => {
				assert.equal(getGPULayerInternalWrap({ composer: composer1, wrap: REPEAT, name: 'test' }), CLAMP_TO_EDGE);
				assert.equal(getGPULayerInternalWrap({ composer: composer2, wrap: REPEAT, name: 'test' }), REPEAT);
				assert.equal(getGPULayerInternalWrap({ composer: composer3, wrap: REPEAT, name: 'test' }), REPEAT);
			});
		});
		describe('getGPULayerInternalFilter', () => {
			it('should always support NEAREST filtering', () => {
				[FLOAT, HALF_FLOAT, UNSIGNED_BYTE, BYTE, UNSIGNED_SHORT, SHORT, UNSIGNED_INT, INT].forEach(type => {
					assert.equal(getGPULayerInternalFilter({ composer: composer1, filter: NEAREST, internalType: type, name: 'test' }), NEAREST);
					assert.equal(getGPULayerInternalFilter({ composer: composer2, filter: NEAREST, internalType: type, name: 'test' }), NEAREST);
					assert.equal(getGPULayerInternalFilter({ composer: composer3, filter: NEAREST, internalType: type, name: 'test' }), NEAREST);
				});
			});
			it('should support LINEAR float filtering with extensions', () => {
				[FLOAT, HALF_FLOAT].forEach(type => {
					assert.equal(getGPULayerInternalFilter({ composer: composer1, filter: LINEAR, internalType: type, name: 'test' }), LINEAR);
					assert.equal(getGPULayerInternalFilter({ composer: composer2, filter: LINEAR, internalType: type, name: 'test' }), LINEAR);
					assert.equal(getGPULayerInternalFilter({ composer: composer3, filter: LINEAR, internalType: type, name: 'test' }), LINEAR);
				});
			});
		});
		describe('shouldCastIntTypeAsFloat', () => {
			it('should never cast glsl3 ints to float', () => {
				assert.equal(shouldCastIntTypeAsFloat({ composer: composer3, type: HALF_FLOAT }), false);
				assert.equal(shouldCastIntTypeAsFloat({ composer: composer3, type: FLOAT }), false);
				assert.equal(shouldCastIntTypeAsFloat({ composer: composer3, type: UNSIGNED_BYTE }), false);
				assert.equal(shouldCastIntTypeAsFloat({ composer: composer3, type: BYTE }), false);
				assert.equal(shouldCastIntTypeAsFloat({ composer: composer3, type: UNSIGNED_SHORT }), false);
				assert.equal(shouldCastIntTypeAsFloat({ composer: composer3, type: SHORT }), false);
				assert.equal(shouldCastIntTypeAsFloat({ composer: composer3, type: UNSIGNED_INT }), false);
				assert.equal(shouldCastIntTypeAsFloat({ composer: composer3, type: INT }), false);
			});
			it('should cast non-glsl3 ints to float (except USIGNED_BYTE)', () => {
				assert.equal(shouldCastIntTypeAsFloat({ composer: composer1, type: HALF_FLOAT }), false);
				assert.equal(shouldCastIntTypeAsFloat({ composer: composer1, type: FLOAT }), false);
				assert.equal(shouldCastIntTypeAsFloat({ composer: composer1, type: UNSIGNED_BYTE }), false);
				assert.equal(shouldCastIntTypeAsFloat({ composer: composer1, type: BYTE }), true);
				assert.equal(shouldCastIntTypeAsFloat({ composer: composer1, type: UNSIGNED_SHORT }), true);
				assert.equal(shouldCastIntTypeAsFloat({ composer: composer1, type: SHORT }), true);
				assert.equal(shouldCastIntTypeAsFloat({ composer: composer1, type: UNSIGNED_INT }), true);
				assert.equal(shouldCastIntTypeAsFloat({ composer: composer1, type: INT }), true);

				assert.equal(shouldCastIntTypeAsFloat({ composer: composer2, type: HALF_FLOAT }), false);
				assert.equal(shouldCastIntTypeAsFloat({ composer: composer2, type: FLOAT }), false);
				assert.equal(shouldCastIntTypeAsFloat({ composer: composer2, type: UNSIGNED_BYTE }), false);
				assert.equal(shouldCastIntTypeAsFloat({ composer: composer2, type: BYTE }), true);
				assert.equal(shouldCastIntTypeAsFloat({ composer: composer2, type: UNSIGNED_SHORT }), true);
				assert.equal(shouldCastIntTypeAsFloat({ composer: composer2, type: SHORT }), true);
				assert.equal(shouldCastIntTypeAsFloat({ composer: composer2, type: UNSIGNED_INT }), true);
				assert.equal(shouldCastIntTypeAsFloat({ composer: composer2, type: INT }), true);
			});
		});
		describe('getGLTextureParameters', () => {
			it('should return valid texture parameters', () => {
				// There are a lot of combos to test, so let's just make sure that no valid input throws an error.
				// This is tested more robustly in pipeline.js.
				[1, 2, 3, 4].forEach(numComponents => {
					[FLOAT, HALF_FLOAT, UNSIGNED_BYTE, BYTE, UNSIGNED_SHORT, SHORT, UNSIGNED_INT, INT].forEach(type => {
						[true, false].forEach(writable => {
							[composer1, composer2, composer3].forEach(composer => {
								const result = getGLTextureParameters({
									composer: composer,
									name: 'test',
									numComponents,
									writable,
									internalType: getGPULayerInternalType({
										composer: composer,
										type,
										writable,
										name: 'test',
									}),
								});
								assert.hasAllKeys(result, ['glFormat', 'glInternalFormat', 'glType', 'glNumChannels']);
							});
						});
					});
				});
			});
			it('should throw error for bad inputs', () => {
				assert.equal(isWebGL2(composer1.gl), false);
				assert.throws(() => { getGLTextureParameters({
					composer: composer1,
					name: 'test',
					numComponents: 3,
					internalType: INT,
					writable: true,
				}); },
				'Unsupported type: "INT" in WebGL 1.0 for GPULayer "test".');
				assert.throws(() => { getGLTextureParameters({
					composer: composer1,
					name: 'test',
					numComponents: 5,
					internalType: INT,
					writable: true,
				}); },
				'Unsupported numComponents: 5 for GPULayer "test".');
				assert.throws(() => { getGLTextureParameters({
					composer: composer3,
					name: 'test',
					numComponents: 2,
					internalType: 'bad',
					writable: true,
				}); },
				'Unsupported type: "bad" for GPULayer "test".');
				assert.throws(() => { getGLTextureParameters({
					composer: composer2,
					name: 'test',
					numComponents: 5,
					internalType: INT,
					writable: true,
				}); },
				'Unsupported glNumChannels: 5 for GPULayer "test".');
			});
		});
		describe('testFramebufferAttachment', () => {
			it('should succeed for all combinations', () => {
				[composer1, composer2, composer3].forEach(composer => {
					[FLOAT, HALF_FLOAT].forEach(type => {
						console.log(`${isWebGL2(composer.gl) ? 'WebGL2' : 'WebGL1'} + ${composer.glslVersion} + ${type}`)
						assert.equal(testFramebufferAttachment({
							composer: composer,
							internalType: getGPULayerInternalType({
								composer: composer,
								type,
								writable: true,
								name: 'test',
							}),
						}), true, `${isWebGL2(composer.gl) ? 'WebGL2' : 'WebGL1'} + ${composer.glslVersion} + ${type}`);
					});
				});
			});
		});
		describe('getGPULayerInternalType', () => {
			it('should return internal type === type for GLSL3', () => {
				[FLOAT, HALF_FLOAT, UNSIGNED_BYTE, BYTE, UNSIGNED_SHORT, SHORT, UNSIGNED_INT, INT].forEach(type => {
					[true, false].forEach(writable => {
						assert.equal(getGPULayerInternalType({
							composer: composer3,
							type,
							writable,
							name: 'test',
						}), type);
					});
				});
			});
			it('should return valid internal type for GLSL1', () => {
				const results = [FLOAT, HALF_FLOAT, UNSIGNED_BYTE, HALF_FLOAT, FLOAT, FLOAT, FLOAT, FLOAT];
				[composer1, composer2].forEach(composer => {
					[FLOAT, HALF_FLOAT, UNSIGNED_BYTE, BYTE, UNSIGNED_SHORT, SHORT, UNSIGNED_INT, INT].forEach((type, i) => {
						[true, false].forEach(writable => {
							assert.equal(getGPULayerInternalType({
								composer,
								type,
								writable,
								name: 'test',
							}), results[i]);
						});
					});
				});
			});
		});
		describe('validateGPULayerArray', () => {
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
								writable: false,
								numComponents,
							});
							// Array1 may be undersized if numComponents < layer.glNumChannels.
							const array1 = initArrayForType(type, (isArray(dimensions) ? dimensions[0] * dimensions[1] : dimensions) * numComponents);
							const validated1 = validateGPULayerArray(array1, layer);
							assert.typeOf(validated1, array1.constructor.name);
							assert.isAtLeast(validated1.length, array1.length);

							// Array2 is correct size and type, should pass through for 2D and 1D power of 2 cases.
							const array2 = initArrayForType(type, (isArray(dimensions) ? dimensions[0] * dimensions[1] : dimensions) * layer.glNumChannels);
							const validated2 = validateGPULayerArray(array2, layer);
							if (isArray(dimensions) || isPowerOf2(dimensions)) assert.equal(validated2, array2);
							else assert.isAtLeast(validated2.length, array2.length);

							// Incorrect type (and possibly length) passed in, should type cast.
							const array3 = initSequentialFloatArray((isArray(dimensions) ? dimensions[0] * dimensions[1] : dimensions) * numComponents);
							const validated3 = validateGPULayerArray(array3, layer);
							assert.typeOf(validated3, array1.constructor.name); // Intentionally comparing with array1 constructor here.
							assert.isAtLeast(validated3.length, array3.length);
							// Get min and max values for int types.
							let min = -Infinity;
							let max = Infinity;
							switch(type) {
								case UNSIGNED_BYTE:
									min = MIN_UNSIGNED_BYTE;
									max = MAX_UNSIGNED_BYTE;
									break;
								case BYTE:
									min = MIN_BYTE;
									max = MAX_BYTE;
									break;
								case UNSIGNED_SHORT:
									min = MIN_UNSIGNED_SHORT;
									max = MAX_UNSIGNED_SHORT;
									break;
								case SHORT:
									min = MIN_SHORT;
									max = MAX_SHORT;
									break;
								case UNSIGNED_INT:
									min = MIN_UNSIGNED_INT;
									max = MAX_UNSIGNED_INT;
									break;
								case INT:
									min = MIN_INT;
									max = MAX_INT;
									break;
							}
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
							writable: false,
							numComponents,
						});
						// Array1 may be undersized if numComponents < layer.glNumChannels.
						const array1 = initArrayForType(HALF_FLOAT, (isArray(dimensions) ? dimensions[0] * dimensions[1] : dimensions) * numComponents, true);
						assert.typeOf(array1, 'Float32Array');
						const validated1 = validateGPULayerArray(array1, layer);
						assert.typeOf(validated1, 'Uint16Array');
						assert.isAtLeast(validated1.length, array1.length);

						// Array2 is correct size and type, should still type cast.
						const array2 = initArrayForType(HALF_FLOAT, (isArray(dimensions) ? dimensions[0] * dimensions[1] : dimensions) * layer.glNumChannels, true);
						assert.typeOf(array2, 'Float32Array');
						const validated2 = validateGPULayerArray(array2, layer);
						assert.typeOf(validated2, 'Uint16Array');

						// Incorrect type (and possibly length) passed in, should type cast.
						const array3 = initSequentialFloatArray((isArray(dimensions) ? dimensions[0] * dimensions[1] : dimensions) * numComponents);
						const validated3 = validateGPULayerArray(array3, layer);
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
					writable: false,
					numComponents,
				});
				const layer2 = new GPULayer(composer3, {
					name: 'test',
					type: UNSIGNED_BYTE,
					dimensions: size,
					writable: false,
					numComponents,
				});
				// Wrong length.
				const array1 = new Array(length * numComponents + 10);
				assert.throws(() => { validateGPULayerArray(array1, layer1); },	
					'Invalid data length: 310 for GPULayer "test" of length 100 and dimensions: [16, 8] and numComponents: 3.');
				const array2 = new Array(size[0] * size[1] * numComponents + 10);
				assert.throws(() => { validateGPULayerArray(array2, layer2); },
					'Invalid data length: 370 for GPULayer "test" of dimensions: [10, 12] and numComponents: 3.');
				// Wrong type.
				assert.throws(() => { validateGPULayerArray(new Array(length * numComponents).fill(0).join(''), layer1); },
					'Invalid array type: String for GPULayer "test", please use one of [Float32Array, Uint8Array, Int8Array, Uint16Array, Int16Array, Uint32Array, Int32Array, Array].');
			});
		});
	});
}