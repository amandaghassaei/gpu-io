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
	} = WebGLCompute;
	const {
		getGPULayerInternalWrap,
		getGPULayerInternalFilter,
		shouldCastIntTypeAsFloat,
		getGLTextureParameters,
		testFramebufferWrite,
		getGPULayerInternalType,
		validateGPULayerArray,
		initArrayForType,
		initSequentialFloatArray,
	} = _testing;

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
		describe('testFramebufferWrite', () => {
			it('should succeed for all combinations', () => {
				[composer1, composer2, composer3].forEach(composer => {
					[FLOAT, HALF_FLOAT].forEach(type => {
						console.log(`${isWebGL2(composer.gl) ? 'WebGL2' : 'WebGL1'} + ${composer.glslVersion} + ${type}`)
						assert.equal(testFramebufferWrite({
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
			it('should validate 2D arrays', () => {
				const dimensions = [10, 12];
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
						const array1 = initArrayForType(type, dimensions[0] * dimensions[1] * numComponents);
						const validated1 = validateGPULayerArray(array1, layer);
						assert.typeOf(validated1, array1.constructor.name);
						assert.isAtLeast(validated1.length, array1.length);

						// Array2 is correct size and type, should pass through.
						const array2 = initArrayForType(type, dimensions[0] * dimensions[1] * layer.glNumChannels);
						const validated2 = validateGPULayerArray(array2, layer);
						assert.equal(validated2, array2);

						// Incorrect type (and possibly length) passed in, should type cast.
						const array3 = initSequentialFloatArray(dimensions[0] * dimensions[1] * numComponents);
						const validated3 = validateGPULayerArray(array3, layer);
						assert.typeOf(validated3, array1.constructor.name); // Intentionally comparing with array1 constructor here.
						assert.isAtLeast(validated3.length, array3.length);
						// Check that values are passed through.
						for (let i = 0; i < dimensions[0] * dimensions[1]; i++) {
							for (let j = 0; j < layer.glNumChannels; j++) {
								if (j < numComponents) {
									assert.equal(validated3[layer.glNumChannels * i + j], array3[numComponents * i + j]);
								} else {
									assert.equal(validated3[layer.glNumChannels * i + j], 0);
								}
							}
						}
					});
				});
			});
			it ('should handle HALF_FLOAT cases', () => {

			});
			it('should throw error in case of invalid array', () => {
				// Wrong length.
				// Wrong type.
			});
		});
	});
}