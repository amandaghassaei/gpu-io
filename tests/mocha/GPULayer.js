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
		LINEAR,
		NEAREST,
		GLSL1,
		GLSL3,
		RGB,
		_testing,
		isWebGL2,
	} = GPUIO;
	const {
		isFloatType,
		isUnsignedIntType,
	} = _testing;
	const {
		isFiniteNumber,
		isString,
		isBoolean,
	} = TypeChecks;

	let composer1;

	describe('GPULayer', () => {
		beforeEach(() => {
			composer1 = new GPUComposer({ canvas: document.createElement('canvas') });
		});
		afterEach(() => {
			composer1.dispose();
			composer1 = undefined;
		});
		describe('initFromImageURL', () => {
			it('should error if required params not passed in', async () => {
				await (GPULayer.initFromImageURL(composer1).then(() => { throw new Error(`Promise should reject.`); }).catch(result => {
					assert.equal(result.message, 'Error initing GPULayer: must pass params to GPULayer.initFromImageURL(composer, params).');
				}));
				await (GPULayer.initFromImageURL(composer1, []).then(() => { throw new Error(`Promise should reject.`); }).catch(result => {
					assert.equal(result.message, 'Error initing GPULayer: must pass valid params object to GPULayer.initFromImageURL(composer, params), got [].');
				}));
				await (GPULayer.initFromImageURL(composer1, 'thing').then(() => { throw new Error(`Promise should reject.`); }).catch(result => {
					assert.equal(result.message, 'Error initing GPULayer: must pass valid params object to GPULayer.initFromImageURL(composer, params), got "thing".');
				}));
				await (GPULayer.initFromImageURL(composer1, {}).then(() => { throw new Error(`Promise should reject.`); }).catch(result => {
					assert.equal(result.message, 'Required params key "name" was not passed to GPULayer.initFromImageURL(composer, params).');
				}));
				await (GPULayer.initFromImageURL(composer1, { name: 'test-layer' }).then(() => { throw new Error(`Promise should reject.`); }).catch(result => {
					assert.equal(result.message, 'Required params key "url" was not passed to GPULayer.initFromImageURL(composer, params) with name "test-layer".');
				}));
			});
			it('should warn if unknown params passed in', async () => {
				const warnings = [];
				console.warn = (message) => { warnings.push(message); }
				await GPULayer.initFromImageURL(composer1, { name: 'test-layer', url: 'base/tests/common/test_img.png', otherThing: 4 });
				assert.equal(warnings.length, 1);
				assert.equal(warnings[0], 'Invalid params key "otherThing" passed to GPULayer.initFromImageURL(composer, params) with name "test-layer".  Valid keys are ["name","url","filter","wrapX","wrapY","format","type","clearValue"].');
			});
			it('should error if invalid params passed in', async () => {
				// Url.
				await (GPULayer.initFromImageURL(composer1, { name: 'test-layer', url: 56 }).then(() => { throw new Error(`Promise should reject.`); }).catch(result => {
					assert.equal(result.message, 'Expected GPULayer.initFromImageURL params to have url of type string, got 56 of type number.');
				}));
				// Filter.
				await (GPULayer.initFromImageURL(composer1, { name: 'test-layer', url: 'base/tests/common/test_img.png', filter: 'test' }).then(() => { throw new Error(`Promise should reject.`); }).catch(result => {
					assert.equal(result.message, 'Invalid filter: "test" for GPULayer "test-layer", must be one of ["NEAREST","LINEAR"].');
				}));
				await (GPULayer.initFromImageURL(composer1, { name: 'test-layer', url: 'base/tests/common/test_img.png', type: UNSIGNED_BYTE, filter: LINEAR }).then(() => { throw new Error(`Promise should reject.`); }).catch(result => {
					assert.equal(result.message, 'LINEAR filtering is not supported on integer types, please use NEAREST filtering for GPULayer "test-layer" with type: UNSIGNED_BYTE.');
				}));
				// Wrap.
				await (GPULayer.initFromImageURL(composer1, { name: 'test-layer', url: 'base/tests/common/test_img.png', wrapX: 'test' }).then(() => { throw new Error(`Promise should reject.`); }).catch(result => {
					assert.equal(result.message, 'Invalid wrapX: "test" for GPULayer "test-layer", must be one of ["CLAMP_TO_EDGE","REPEAT"].');
				}));
				await (GPULayer.initFromImageURL(composer1, { name: 'test-layer', url: 'base/tests/common/test_img.png', wrapX: CLAMP_TO_EDGE, wrapY: 'test' }).then(() => { throw new Error(`Promise should reject.`); }).catch(result => {
					assert.equal(result.message, 'Invalid wrapY: "test" for GPULayer "test-layer", must be one of ["CLAMP_TO_EDGE","REPEAT"].');
				}));
				// Format.
				await (GPULayer.initFromImageURL(composer1, { name: 'test-layer', url: 'base/tests/common/test_img.png', format: 'test' }).then(() => { throw new Error(`Promise should reject.`); }).catch(result => {
					assert.equal(result.message, 'Invalid format: "test" for GPULayer.initFromImageURL "test-layer", must be one of ["RGB","RGBA"].');
				}));
				// Type.
				await (GPULayer.initFromImageURL(composer1, { name: 'test-layer', url: 'base/tests/common/test_img.png', type: 'test' }).then(() => { throw new Error(`Promise should reject.`); }).catch(result => {
					assert.equal(result.message, 'Invalid type: "test" for GPULayer.initFromImageURL "test-layer", must be one of ["UNSIGNED_BYTE","FLOAT","HALF_FLOAT"].');
				}));
			});
			it('should error if image doesn\'t load', async () => {
				await (GPULayer.initFromImageURL(composer1, { name: 'test-layer', url: './common/test_img' }).then(() => { throw new Error(`Promise should reject.`); }).catch(result => {
					assert.include(result.message, 'Error loading image "test-layer":');
				}));
			});
			it('should load png image', async () => {
				const layer = await GPULayer.initFromImageURL(composer1, { name: 'test-layer', url: 'base/tests/common/test_img.png' });
				assert.equal(layer.width, 2);
				assert.equal(layer.height, 2);
				const values = layer.getValues();
				const expected = [
					0, 0, 0, 0.501960813999176,
					1, 0, 0, 1,
					0, 0.19607844948768616, 1, 1,
					0, 1, 0, 1,
				];
				assert.deepEqual(Array.from(values), expected);
			});
			it('should load jpg image', async () => {
				const layer = await GPULayer.initFromImageURL(composer1, { name: 'test-layer', url: 'base/tests/common/test_img.jpg' });
				assert.equal(layer.width, 2);
				assert.equal(layer.height, 2);
				const values = layer.getValues();
				const expected = [
					0.49803924560546875, 0.49803924560546875, 0.49803924560546875, 1,
					0.9960784912109375, 0, 0, 1,
					0, 0.20000001788139343, 1, 1,
					0, 1, 0, 1,
				];
				assert.deepEqual(Array.from(values), expected);

				const layer2 = await GPULayer.initFromImageURL(composer1, { name: 'test-layer', url: 'base/tests/common/test_img.jpg', type: UNSIGNED_BYTE, format: RGB });
				assert.equal(layer2.width, 2);
				assert.equal(layer2.height, 2);
				const values2 = layer2.getValues();
				const expected2 = [
					127, 127, 127,
					254, 0, 0,
					0, 51, 255,
					0, 255, 0,
				];
				assert.deepEqual(Array.from(values2), expected2);
			});
		});
		describe('constructor', () => {
			it('should error if GPUComposer not passed in', () => {
				assert.throws(() => { new GPULayer(undefined, { name: 'test-layer'}); },
					'Error initing GPULayer "test-layer": must pass GPUComposer instance to GPULayer(composer, params).');
			});
			it('should error if required params not passed in', () => {
				assert.throws(() => { new GPULayer(composer1); },
					'Error initing GPULayer: must pass params to GPULayer(composer, params).');
				assert.throws(() => { new GPULayer(composer1, []); },
					'Error initing GPULayer: must pass valid params object to GPULayer(composer, params), got [].');
				assert.throws(() => { new GPULayer(composer1, 'thing'); },
					'Error initing GPULayer: must pass valid params object to GPULayer(composer, params), got "thing".');
				assert.throws(() => { new GPULayer(composer1, {}); },
					'Required params key "name" was not passed to GPULayer(composer, params).');
				assert.throws(() => { new GPULayer(composer1, { name: 'test-layer' }); },
					'Required params key "type" was not passed to GPULayer(composer, params) with name "test-layer".');
				assert.throws(() => { new GPULayer(composer1, { name: 'test-layer', type: FLOAT }); },
					'Required params key "numComponents" was not passed to GPULayer(composer, params) with name "test-layer".');
				assert.throws(() => { new GPULayer(composer1, { name: 'test-layer', type: FLOAT, numComponents: 3 }); },
					'Required params key "dimensions" was not passed to GPULayer(composer, params) with name "test-layer".');
			});
			it('should warn if unknown params passed in', () => {
				const warnings = [];
				console.warn = (message) => { warnings.push(message); }
				new GPULayer(composer1, { name: 'test-layer', type: FLOAT, numComponents: 3, dimensions: [34, 56], otherThing: 3 });
				assert.equal(warnings.length, 1);
				assert.equal(warnings[0], 'Invalid params key "otherThing" passed to GPULayer(composer, params) with name "test-layer".  Valid keys are ["name","type","numComponents","dimensions","filter","wrapX","wrapY","numBuffers","clearValue","array"].');
			});
			it('should error if invalid params passed in', () => {
				// Num components.
				assert.throws(() => { new GPULayer(composer1, { name: 'test-layer', type: FLOAT, numComponents: 7, dimensions: [34, 56] }); },
					'Invalid numComponents: 7 for GPULayer "test-layer", must be number in range [1-4].');
				assert.throws(() => { new GPULayer(composer1, { name: 'test-layer', type: FLOAT, numComponents: 'thing', dimensions: [34, 56] }); },
					'Invalid numComponents: "thing" for GPULayer "test-layer", must be number in range [1-4].');
				// Dimensions.
				assert.throws(() => { new GPULayer(composer1, { name: 'test-layer', type: FLOAT, numComponents: 2, dimensions: [-5, 5] }); },
					'Invalid width: -5 for GPULayer "test-layer", must be positive integer.');
				assert.throws(() => { new GPULayer(composer1, { name: 'test-layer', type: FLOAT, numComponents: 2, dimensions: ['test', 5] }); },
					'Invalid width: "test" for GPULayer "test-layer", must be positive integer.');
				assert.throws(() => { new GPULayer(composer1, { name: 'test-layer', type: FLOAT, numComponents: 2, dimensions: [20, 0] }); },
					'Invalid height: 0 for GPULayer "test-layer", must be positive integer.');
				assert.throws(() => { new GPULayer(composer1, { name: 'test-layer', type: FLOAT, numComponents: 2, dimensions: [34, 'test'] }); },
					'Invalid height: "test" for GPULayer "test-layer", must be positive integer.');
				assert.throws(() => { new GPULayer(composer1, { name: 'test-layer', type: FLOAT, numComponents: 2, dimensions: -4 }); },
					'Invalid length: -4 for GPULayer "test-layer", must be positive integer.');
				assert.throws(() => { new GPULayer(composer1, { name: 'test-layer', type: FLOAT, numComponents: 2, dimensions: []}); },
					'Invalid width: undefined for GPULayer "test-layer", must be positive integer.');
				// Filter.
				assert.throws(() => { new GPULayer(composer1, { name: 'test-layer', type: INT, numComponents: 3, dimensions: [34, 56], filter: 'test' }); },
					'Invalid filter: "test" for GPULayer "test-layer", must be one of ["NEAREST","LINEAR"].');
				assert.throws(() => { new GPULayer(composer1, { name: 'test-layer', type: INT, numComponents: 3, dimensions: [34, 56], filter: LINEAR }); },
					'LINEAR filtering is not supported on integer types, please use NEAREST filtering for GPULayer "test-layer" with type: INT.');
				// Wrap.
				assert.throws(() => { new GPULayer(composer1, { name: 'test-layer', type: INT, numComponents: 3, dimensions: [34, 56], wrapX: 'test' }); },
					'Invalid wrapX: "test" for GPULayer "test-layer", must be one of ["CLAMP_TO_EDGE","REPEAT"].');
				assert.throws(() => { new GPULayer(composer1, { name: 'test-layer', type: INT, numComponents: 3, dimensions: [34, 56], wrapX: CLAMP_TO_EDGE, wrapY: 'test' }); },
					'Invalid wrapY: "test" for GPULayer "test-layer", must be one of ["CLAMP_TO_EDGE","REPEAT"].');
				// Data type.
				assert.throws(() => { new GPULayer(composer1, { name: 'test-layer', type: 'test', numComponents: 3, dimensions: [34, 56] }); },
					'Invalid type: "test" for GPULayer "test-layer", must be one of ["HALF_FLOAT","FLOAT","UNSIGNED_BYTE","BYTE","UNSIGNED_SHORT","SHORT","UNSIGNED_INT","INT"].');
				// Num buffers.
				assert.throws(() => { new GPULayer(composer1, { name: 'test-layer', type: FLOAT, numComponents: 3, dimensions: [34, 56], numBuffers: 3.4 }); },
					'Invalid numBuffers: 3.4 for GPULayer "test-layer", must be positive integer.');
				assert.throws(() => { new GPULayer(composer1, { name: 'test-layer', type: FLOAT, numComponents: 3, dimensions: [34, 56], numBuffers: 0 }); },
					'Invalid numBuffers: 0 for GPULayer "test-layer", must be positive integer.');
				assert.throws(() => { new GPULayer(composer1, { name: 'test-layer', type: FLOAT, numComponents: 3, dimensions: [34, 56], numBuffers: 'test' }); },
					'Invalid numBuffers: "test" for GPULayer "test-layer", must be positive integer.');
			});
			it('should set parameters', () => {
				const clearValue = [0, 4, 2];
				const layer = new GPULayer(composer1, {
					name: 'test-layer',
					type: FLOAT,
					numComponents: 3,
					dimensions: [34, 56],
					filter: LINEAR,
					wrapX: REPEAT,
					wrapY: REPEAT,
					numBuffers: 5,
					clearValue,
					array: (new Float32Array(34 * 56 * 3)).fill(-5),
				});
				assert.equal(layer.name, 'test-layer');
				assert.equal(layer.type, FLOAT);
				assert.equal(layer.numComponents, 3);
				assert.equal(layer.width, 34);
				assert.equal(layer.height, 56);
				assert.equal(layer.filter, LINEAR);
				assert.equal(layer.wrapX, REPEAT);
				assert.equal(layer.wrapY, REPEAT);
				assert.equal(layer.numBuffers, 5);
				assert.deepEqual(layer.clearValue, clearValue.slice());
				assert.notEqual(layer.clearValue, clearValue); // Make deep copy.
				const values = layer.getValues();
				for (let i = 0; i < values.length; i++) {
					assert.equal(values[i], -5);
				}
				layer.dispose();
			})
			it('should init 1D FLOAT and HALF_FLOAT GPULayers with NEAREST filtering and CLAMP_TO_EDGE wrapping', () => {
				const layerFloat = new GPULayer(composer1, {
					name: 'test-layer',
					type: FLOAT,
					numComponents: 3,
					dimensions: 100,
				});
				assert.equal(layerFloat.type, FLOAT);
				assert.equal(layerFloat._internalType, FLOAT);
				assert.equal(layerFloat.filter, NEAREST);
				assert.equal(layerFloat.wrapX, CLAMP_TO_EDGE);
				assert.equal(layerFloat.wrapY, CLAMP_TO_EDGE);
				layerFloat.dispose();
				const layerHalfFloat = new GPULayer(composer1, {
					name: 'test-layer',
					type: HALF_FLOAT,
					numComponents: 3,
					dimensions: 100,
				});
				assert.equal(layerHalfFloat.type, HALF_FLOAT);
				assert.equal(layerHalfFloat._internalType, HALF_FLOAT);
				assert.equal(layerHalfFloat.filter, NEAREST);
				assert.equal(layerHalfFloat.wrapX, CLAMP_TO_EDGE);
				assert.equal(layerHalfFloat.wrapY, CLAMP_TO_EDGE);
				layerHalfFloat.dispose();
			});
			it('should init 2D FLOAT and HALF_FLOAT GPULayers with LINEAR filtering and CLAMP_TO_EDGE wrapping', () => {
				const layerFloat = new GPULayer(composer1, {
					name: 'test-layer',
					type: FLOAT,
					numComponents: 3,
					dimensions: [100, 100],
				});
				assert.equal(layerFloat.type, FLOAT);
				assert.equal(layerFloat._internalType, FLOAT);
				assert.equal(layerFloat.filter, LINEAR);
				assert.equal(layerFloat.wrapX, CLAMP_TO_EDGE);
				assert.equal(layerFloat.wrapY, CLAMP_TO_EDGE);
				layerFloat.dispose();
				const layerHalfFloat = new GPULayer(composer1, {
					name: 'test-layer',
					type: HALF_FLOAT,
					numComponents: 3,
					dimensions: [100, 100],
				});
				assert.equal(layerHalfFloat.type, HALF_FLOAT);
				assert.equal(layerHalfFloat._internalType, HALF_FLOAT);
				assert.equal(layerHalfFloat.filter, LINEAR);
				assert.equal(layerHalfFloat.wrapX, CLAMP_TO_EDGE);
				assert.equal(layerHalfFloat.wrapY, CLAMP_TO_EDGE);
				layerHalfFloat.dispose();
			});
		});
		describe('get width, height, length', () => {
			it('should return correct dimensions', () => {
				const layer1 = new GPULayer(composer1, { name: 'test-layer', type: FLOAT, numComponents: 3, dimensions: 245});
				const layer2 = new GPULayer(composer1, { name: 'test-layer', type: FLOAT, numComponents: 3, dimensions: [34, 56]});
				assert.equal(layer2.width, 34);
				assert.equal(layer2.height, 56);
				assert.throws(() => { layer2.length; }, 'Cannot access length on 2D GPULayer "test-layer".');
				assert.equal(layer1.length, 245);
				assert.equal(layer1.width, 16);
				assert.equal(layer1.height, 16);
				assert.isAtLeast(layer1.width * layer1.height, layer1.length);
				layer1.dispose();
				layer2.dispose();
			});
		});
		describe('is1D, is2D', () => {
			it('should distinguish between 1D and 2D GPULayers', () => {
				const layer1 = new GPULayer(composer1, { name: 'test-layer', type: FLOAT, numComponents: 3, dimensions: 245});
				const layer2 = new GPULayer(composer1, { name: 'test-layer', type: FLOAT, numComponents: 3, dimensions: [34, 56]});
				assert.equal(layer1.is1D(), true);
				assert.equal(layer2.is1D(), false);
				assert.equal(layer1.is2D(), false);
				assert.equal(layer2.is2D(), true);
				layer1.dispose();
				layer2.dispose();
			});
		});
		describe('get bufferIndex, incrementBufferIndex, decrementBufferIndex', () => {
			it('should increment bufferIndex', () => {
				const layer = new GPULayer(composer1, { name: 'test-layer', type: FLOAT, numComponents: 3, dimensions: [34, 56], numBuffers: 4});
				assert.equal(layer.bufferIndex, 0);
				layer.incrementBufferIndex();
				assert.equal(layer.bufferIndex, 1);
				layer.incrementBufferIndex();
				assert.equal(layer.bufferIndex, 2);
				layer.incrementBufferIndex();
				assert.equal(layer.bufferIndex, 3);
				layer.incrementBufferIndex();
				assert.equal(layer.bufferIndex, 0);
				layer.decrementBufferIndex();
				assert.equal(layer.bufferIndex, 3);
				layer.decrementBufferIndex();
				assert.equal(layer.bufferIndex, 2);
				layer.decrementBufferIndex();
				assert.equal(layer.bufferIndex, 1);
				layer.decrementBufferIndex();
				assert.equal(layer.bufferIndex, 0);
				layer.dispose();
			});
		});
		describe('getStateAtIndex, get currentState, and get lastState', () => {
			it('should return WebGLTextures', () => {
				const layer1 = new GPULayer(composer1, { name: 'test-layer', type: FLOAT, numComponents: 3, dimensions: [34, 56], numBuffers: 1});
				assert.typeOf(layer1.currentState.texture, 'WebGLTexture');
				const layer2 = new GPULayer(composer1, { name: 'test-layer', type: FLOAT, numComponents: 3, dimensions: [34, 56], numBuffers: 2});
				assert.typeOf(layer2.currentState.texture, 'WebGLTexture');
				assert.typeOf(layer2.lastState.texture, 'WebGLTexture');
				assert.notEqual(layer2.currentState.texture, layer2.lastState.texture);
				assert.equal(layer2.getStateAtIndex(-2).texture, layer2.currentState.texture); // This will throw warning - likely user error.
				assert.equal(layer2.getStateAtIndex(-1).texture, layer2.lastState.texture);
				assert.equal(layer2.getStateAtIndex(0).texture, layer2.currentState.texture);
				assert.equal(layer2.getStateAtIndex(1).texture, layer2.lastState.texture);
				assert.equal(layer2.getStateAtIndex(2).texture, layer2.currentState.texture); // This will throw warning - likely user error.
				// After incrementing index, this logic should be reversed.
				layer2.incrementBufferIndex();
				assert.equal(layer2.getStateAtIndex(-2).texture, layer2.lastState.texture); // This will throw warning - likely user error.
				assert.equal(layer2.getStateAtIndex(-1).texture, layer2.currentState.texture);
				assert.equal(layer2.getStateAtIndex(0).texture, layer2.lastState.texture);
				assert.equal(layer2.getStateAtIndex(1).texture, layer2.currentState.texture);
				assert.equal(layer2.getStateAtIndex(2).texture, layer2.lastState.texture); // This will throw warning - likely user error.
				layer1.dispose();
				layer2.dispose();
			});
		});
		describe('_prepareForWrite', () => {
			it('should increment index', () => {
				const layer1 = new GPULayer(composer1, { name: 'test-layer', type: FLOAT, numComponents: 3, dimensions: [34, 56], numBuffers: 3});
				assert.equal(layer1.bufferIndex, 0);
				layer1._prepareForWrite();
				assert.equal(layer1.bufferIndex, 0);
				layer1._prepareForWrite(true);
				assert.equal(layer1.bufferIndex, 1);
				layer1.dispose();
			});
			it('should remove texture overrides at current buffer index', () => {
				// TODO:
			});
		});
		describe('setFromArray', () => {
			it('should set values of GPULayer', () => {
				const layer = new GPULayer(composer1, {
					name: 'test-layer',
					type: FLOAT,
					numComponents: 3,
					dimensions: [34, 56],
					filter: LINEAR,
					wrapX: REPEAT,
					wrapY: REPEAT,
					numBuffers: 5,
				});
				layer.setFromArray((new Float32Array(34 * 56 * 3)).fill(-5));
				let values = layer.getValues();
				for (let i = 0; i < values.length; i++) {
					assert.equal(values[i], -5);
				}
				layer.setFromArray((new Array(34 * 56 * 3)).fill(43));
				values = layer.getValues();
				for (let i = 0; i < values.length; i++) {
					assert.equal(values[i], 43);
				}
				// Wrong dimensions.
				assert.throws(() => { layer.setFromArray((new Float32Array(34 * 50 * 3)).fill(-5)); },
					'Invalid data length: 5100 for GPULayer "test-layer" of dimensions: [34, 56] and numComponents: 3.');
				layer.dispose();
			});
		});
		describe('resize', () => {
			it('should resize GPULayer and set data if provided', () => {
				const layer = new GPULayer(composer1, {
					name: 'test-layer',
					type: FLOAT,
					numComponents: 3,
					dimensions: [34, 56],
					filter: LINEAR,
					wrapX: REPEAT,
					wrapY: REPEAT,
					numBuffers: 5,
				});
				assert.equal(layer.width, 34);
				assert.equal(layer.height, 56);
				layer.resize([23, 5]);
				assert.equal(layer.width, 23);
				assert.equal(layer.height, 5);
				layer.resize([34, 56], (new Float32Array(34 * 56 * 3)).fill(-5));
				assert.equal(layer.width, 34);
				assert.equal(layer.height, 56);
				let values = layer.getValues();
				for (let i = 0; i < values.length; i++) {
					assert.equal(values[i], -5);
				}
				layer.dispose();
			});
			it('should resize 1D GPULayers', () => {
				const layer = new GPULayer(composer1, {
					name: 'test-layer',
					type: FLOAT,
					numComponents: 3,
					dimensions: 100,
					filter: LINEAR,
					wrapX: REPEAT,
					wrapY: REPEAT,
					numBuffers: 5,
				});
				assert.equal(layer.width, 10);
				assert.equal(layer.height, 10);
				assert.equal(layer.length, 100);
				assert.equal(layer.is1D(), true);
				layer.resize([23, 5]);
				assert.equal(layer.is1D(), false);
				assert.equal(layer.width, 23);
				assert.equal(layer.height, 5);
				layer.resize([34, 56], (new Float32Array(34 * 56 * 3)).fill(-5));
				assert.equal(layer.width, 34);
				assert.equal(layer.height, 56);
				let values = layer.getValues();
				for (let i = 0; i < values.length; i++) {
					assert.equal(values[i], -5);
				}
				layer.dispose();
			});
		});
		describe('set clearValue, get clearValue, clear', () => {
			it('should set/get clear value and clear to value', () => {
				const layer1 = new GPULayer(composer1, { name: 'test-layer', type: FLOAT, numComponents: 3, dimensions: [34, 56], numBuffers: 2 });
				assert.equal(layer1.clearValue, 0);
				layer1.clearValue = 10.4;
				assert.equal(layer1.clearValue, 10.4);
				assert.equal(layer1.bufferIndex, 0);
				layer1.clear();
				assert.equal(layer1.bufferIndex, 0);
				const values1 = layer1.getValues();
				for (let i = 0; i < values1.length; i++) {
					assert.closeTo(values1[i], 10.4, 1e-6); // There is some float precision delta with this value.
				}
				let vec = [-45, 0, 10.75];
				layer1.clearValue = vec;
				assert.deepEqual(layer1.clearValue, vec.slice());
				assert.notEqual(layer1.clearValue, vec); // Check that it makes a copy.
				layer1.clear();
				const values2 = layer1.getValues();
				for (let i = 0; i < values2.length / vec.length; i++) {
					for (let j = 0; j < vec.length; j++) {
						assert.equal(values2[i * vec.length + j], vec[j]);
					}
				}
				// Clear with no argument will not clear all layers.
				layer1.incrementBufferIndex();
				const values3 = layer1.getValues();
				for (let i = 0; i < values3.length / vec.length; i++) {
					for (let j = 0; j < vec.length; j++) {
						assert.equal(values3[i * vec.length + j], 0);
					}
				}
				// Test clear all layers.
				vec = [-6, 39, 4];
				layer1.clearValue = vec;
				assert.equal(layer1.bufferIndex, 1);
				layer1.clear(true);
				assert.equal(layer1.bufferIndex, 1);
				for (let a = 0; a < layer1.numBuffers; a ++) {
					layer1.incrementBufferIndex();
					const values4 = layer1.getValues();
					for (let i = 0; i < values4.length / vec.length; i++) {
						for (let j = 0; j < vec.length; j++) {
							assert.equal(values4[i * vec.length + j], vec[j]);
						}
					}
				}
				layer1.dispose();
			});
			it('should throw errors for bad clear values', () => {
				const layer1 = new GPULayer(composer1, { name: 'test-layer', type: FLOAT, numComponents: 3, dimensions: [34, 56]});
				const layer2 = new GPULayer(composer1, { name: 'test-layer', type: UNSIGNED_BYTE, numComponents: 3, dimensions: [34, 56]});
				// Wrong length.
				assert.throws(() => { layer1.clearValue = [4, -97.5]; },
					'Invalid clearValue: [4,-97.5] for GPULayer "test-layer", expected FLOAT or array of FLOAT of length 3.');
				assert.throws(() => { layer1.clearValue = [4, -97.5, 0, 3.4]; },
					'Invalid clearValue: [4,-97.5,0,3.4] for GPULayer "test-layer", expected FLOAT or array of FLOAT of length 3.');
				// Wrong type.
				assert.throws(() => { layer2.clearValue = [4, -97.5, 0]; },
					'Invalid clearValue: [4,-97.5,0] for GPULayer "test-layer", expected UNSIGNED_BYTE or array of UNSIGNED_BYTE of length 3.');
				assert.throws(() => { layer2.clearValue = [4, -97, 0]; },
					'Invalid clearValue: [4,-97,0] for GPULayer "test-layer", expected UNSIGNED_BYTE or array of UNSIGNED_BYTE of length 3.');
				assert.throws(() => { layer2.clearValue = [4, 4000, 0]; },
					'Invalid clearValue: [4,4000,0] for GPULayer "test-layer", expected UNSIGNED_BYTE or array of UNSIGNED_BYTE of length 3.');
				layer1.dispose();
				layer2.dispose();
			});
		});
		describe('getValues', () => {
			it('should return TypedArray with correct length and type', () => {
				[HALF_FLOAT, FLOAT, UNSIGNED_BYTE, BYTE, UNSIGNED_SHORT, SHORT, UNSIGNED_INT, INT].forEach(type => {
					const layer1 = new GPULayer(composer1, { name: 'test-layer', type, numComponents: 3, dimensions: 245});
					assert.notEqual(layer1.length, layer1.width * layer1.height);
					const values = layer1.getValues();
					if (isFloatType(type)) assert.typeOf(values, 'Float32Array');
					if (type === UNSIGNED_BYTE) assert.typeOf(values, 'Uint8Array');
					if (type === BYTE) assert.typeOf(values, 'Int8Array');
					if (type === UNSIGNED_SHORT) assert.typeOf(values, 'Uint16Array');
					if (type === SHORT) assert.typeOf(values, 'Int16Array');
					if (type === UNSIGNED_INT) assert.typeOf(values, 'Uint32Array');
					if (type === INT) assert.typeOf(values, 'Int32Array');
					assert.equal(values.length, layer1.length * layer1.numComponents);
					layer1.dispose();
				});
			});
			it('should return correct values for UNSIGNED_BYTE GPULayer', () => {
				// This seems to only work after I changed GPULayer to cast UNSIGNED_BYTE types to HALF_FLOAT for GLSL1.
				// Otherwise, I was seeing uniform values >= 1 coming out as 255 from the getValues().
				// Technically read/write to UNSIGNED_BYTE type should work in WebGL1/2 + GLSL1, but in some cases it seemed to be breaking down.
				// See note in GPULayerHelpers.shouldCastIntTypeAsFloat for more info.
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
					const layer1 = new GPULayer(composer, { name: 'test-layer', type: UNSIGNED_BYTE, numComponents: 3, dimensions: [30, 30]});
					layer1.clearValue = [1, 0, 3];
					layer1.clear();
					const values = layer1.getValues();
					for (let i = 0; i < values.length / 3; i++) {
						for (let j = 0; j < 3; j++) {
							assert.equal(values[3 * i + j], layer1.clearValue[j], values);
						}
					}
					layer1.dispose();
				});
				composer1.dispose();
				composer2.dispose();
				composer3.dispose();
			});
			// This is tested extensively in pipeline.js.
		});
		describe('getValuesAsync', () => {
			it('should return TypedArray with correct length and type', async () => {
				[HALF_FLOAT, FLOAT, UNSIGNED_BYTE, BYTE, UNSIGNED_SHORT, SHORT, UNSIGNED_INT, INT].forEach(async (type) => {
					const layer1 = new GPULayer(composer1, { name: 'test-layer', type, numComponents: 3, dimensions: 245});
					assert.notEqual(layer1.length, layer1.width * layer1.height);
					const values = await layer1.getValuesAsync();
					// Due to some annoying browser things, this is currently returning one of Float32Array, Int32Array, or Uint32Array.
					assert.typeOf(values, isFloatType(type) ? 'Float32Array' : (isUnsignedIntType(type) ? 'UInt32Array' : 'Int32Array'));
					assert.equal(values.length, layer1.length * layer1.numComponents);
					layer1.dispose();
				});
			});
		});
		describe('savePNG', () => {
			it ('should warn for invalid parameter', () => {
				const layer1 = new GPULayer(composer1, { name: 'test-layer', type: FLOAT, numComponents: 3, dimensions: [34, 67]});
				const warnings = [];
				console.warn = (message) => { warnings.push(message); }
				layer1.savePNG({
					filename: 'thing',
					test: 'bad param',
				});
				assert.equal(warnings.length, 1);
				assert.equal(warnings[0], 'Invalid params key "test" passed to GPULayer.savePNG(params).  Valid keys are ["filename","dpi","multiplier","callback"].');
				layer1.dispose();
			});
			it('should return Blob in callback', () => {
				const layer1 = new GPULayer(composer1, { name: 'test-layer', type: FLOAT, numComponents: 3, dimensions: [34, 67]});
				layer1.savePNG({
					filename: 'thing',
					callback: (blob, filename) => {
						assert.typeOf(blob, 'Blob');
						assert.equal(filename, 'thing.png');
					}
				});
				layer1.dispose();
			});
		});
		describe('attachToThreeTexture', () => {
			it ('should throw error in invalid cases', () => {
				const texture = new THREE.Texture();
				const layer1 = new GPULayer(composer1, {
					name: 'test-layer',
					type: FLOAT,
					numComponents: 3,
					dimensions: [34, 56],
					filter: LINEAR,
					wrapX: REPEAT,
					wrapY: REPEAT,
				});
				assert.throws(() => { layer1.attachToThreeTexture(texture); },
					'GPUComposer was not inited with a renderer.');
				const renderer = new THREE.WebGLRenderer();
				const composer = new GPUComposer.initWithThreeRenderer(renderer);
				const layer2 = new GPULayer(composer, {
					name: 'test-layer',
					type: FLOAT,
					numComponents: 3,
					dimensions: [34, 56],
					filter: LINEAR,
					wrapX: REPEAT,
					wrapY: REPEAT,
					numBuffers: 2,
				});
				assert.throws(() => { layer2.attachToThreeTexture(texture); },
					'GPULayer "test-layer" contains multiple WebGL textures (one for each buffer) that are flip-flopped during compute cycles, please choose a GPULayer with one buffer.');
				layer1.dispose();
				layer2.dispose();
				composer.dispose();
			});
			it('should attach webgl texture to three texture', () => {
				// TODO:
				const renderer = new THREE.WebGLRenderer();
				const composer = new GPUComposer.initWithThreeRenderer(renderer);
				const layer1 = new GPULayer(composer, {
					name: 'test-layer',
					type: FLOAT,
					numComponents: 3,
					dimensions: [34, 56],
					filter: LINEAR,
					wrapX: REPEAT,
					wrapY: REPEAT,
				});
				const texture = new THREE.Texture();
				layer1.attachToThreeTexture(texture);
				assert.equal(renderer.properties.get(texture).__webglTexture, layer1.currentState.texture);
				assert.equal(renderer.properties.get(texture).__webglInit, true);
			});
		});
		describe('clone', () => {
			it('should deep copy all properties to clone', () => {
				const clearValue = [0, 4, 2];
				const layer = new GPULayer(composer1, {
					name: 'test-layer',
					type: FLOAT,
					numComponents: 3,
					dimensions: [34, 56],
					filter: LINEAR,
					wrapX: REPEAT,
					wrapY: REPEAT,
					numBuffers: 5,
					clearValue,
					array: (new Float32Array(34 * 56 * 3)).fill(-5),
				});
				layer.incrementBufferIndex();
				layer.clear();
				const clone = layer.clone('clone')
				assert.equal(clone.name, 'clone');
				assert.equal(clone.type, FLOAT);
				assert.equal(clone.numComponents, 3);
				assert.equal(clone.width, 34);
				assert.equal(clone.height, 56);
				assert.equal(clone.filter, LINEAR);
				assert.equal(clone.wrapX, REPEAT);
				assert.equal(clone.wrapY, REPEAT);
				assert.equal(clone.numBuffers, 5);
				assert.deepEqual(clone.clearValue, clearValue.slice());
				assert.notEqual(clone.clearValue, layer.clearValue); // Make deep copy.
				assert.equal(layer.bufferIndex, 1);
				assert.equal(clone.bufferIndex, layer.bufferIndex);

				// Check that values for all buffers have been copied over.
				for (let j = 0; j < clone.numBuffers; j++) {
					const values = clone.getValues();
					const expected = layer.getValues();
					for (let i = 0; i < values.length; i++) {
						assert.equal(values[i], expected[i]);
					}
					clone.incrementBufferIndex();
					layer.incrementBufferIndex();
				}
				
				layer.dispose();
				clone.dispose();
			});
		});
		describe('dispose', () => {
			it('should delete all object/array keys', () => {
				const layer1 = new GPULayer(composer1, { name: 'test-layer', type: FLOAT, numComponents: 3, dimensions: [34, 67]});
				layer1.getValues(); // This will init some cached arrays.	
				layer1.dispose();
				// Filter out keys for simple objects (e.g. strings, number, boolean).
				const keys = Object.keys(layer1).filter(key => {
					return !isString(layer1[key]) && !isFiniteNumber(layer1[key]) && !isBoolean(layer1[key]) && layer1[key] !== undefined;
				});
				assert.equal(keys.length, 0, `remaining keys: ${JSON.stringify(keys)}.`);
				// We don't really have a way to test if WebGL things were actually deleted.
				// dispose() marks them for deletion, but they are garbage collected later.
			});
		});
	});
}