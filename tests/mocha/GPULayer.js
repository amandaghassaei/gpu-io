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
		_testing,
		isWebGL2,
	} = WebGLCompute;
	const {
		isNumber,
		isString,
		isBoolean,
		isFloatType,
		isUnsignedIntType,
	} = _testing;

	let composer1;

	describe('GPULayer', () => {
		beforeEach(() => {
			composer1 = new GPUComposer({ canvas: document.createElement('canvas') });
		});
		afterEach(() => {
			composer1.dispose();
			composer1 = undefined;
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
					'Required params key "name" was not passed to GPULayer(composer, params) with name "undefined".');
				assert.throws(() => { new GPULayer(composer1, { name: 'test-layer' }); },
					'Required params key "type" was not passed to GPULayer(composer, params) with name "test-layer".');
				assert.throws(() => { new GPULayer(composer1, { name: 'test-layer', type: FLOAT }); },
					'Required params key "numComponents" was not passed to GPULayer(composer, params) with name "test-layer".');
				assert.throws(() => { new GPULayer(composer1, { name: 'test-layer', type: FLOAT, numComponents: 3 }); },
					'Required params key "dimensions" was not passed to GPULayer(composer, params) with name "test-layer".');
			});
			it('should error if unknown params passed in', () => {
				assert.throws(() => { new GPULayer(composer1, { name: 'test-layer', type: FLOAT, numComponents: 3, dimensions: [34, 56], otherThing: 3 }); },
					'Invalid params key "otherThing" passed to GPULayer(composer, params) with name "test-layer".  Valid keys are ["name","type","numComponents","dimensions","filter","wrapS","wrapT","writable","numBuffers","clearValue","array"].');
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
				assert.throws(() => { new GPULayer(composer1, { name: 'test-layer', type: INT, numComponents: 3, dimensions: [34, 56], wrapS: 'test' }); },
					'Invalid wrapS: "test" for GPULayer "test-layer", must be one of ["CLAMP_TO_EDGE","REPEAT"].');
				assert.throws(() => { new GPULayer(composer1, { name: 'test-layer', type: INT, numComponents: 3, dimensions: [34, 56], wrapS: CLAMP_TO_EDGE, wrapT: 'test' }); },
					'Invalid wrapT: "test" for GPULayer "test-layer", must be one of ["CLAMP_TO_EDGE","REPEAT"].');
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
					wrapS: REPEAT,
					wrapT: REPEAT,
					writable: true,
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
				assert.equal(layer.wrapS, REPEAT);
				assert.equal(layer.wrapT, REPEAT);
				assert.equal(layer.writable, true);
				assert.equal(layer.numBuffers, 5);
				assert.deepEqual(layer.clearValue, clearValue.slice());
				assert.notEqual(layer.clearValue, clearValue); // Make deep copy.
				const values = layer.getValues();
				for (let i = 0; i < values.length; i++) {
					assert.equal(values[i], -5);
				}
				layer.dispose();
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
		describe('is1D', () => {
			it('should distinguish between 1D and 2D GPULayers', () => {
				const layer1 = new GPULayer(composer1, { name: 'test-layer', type: FLOAT, numComponents: 3, dimensions: 245});
				const layer2 = new GPULayer(composer1, { name: 'test-layer', type: FLOAT, numComponents: 3, dimensions: [34, 56]});
				assert.equal(layer1.is1D(), true);
				assert.equal(layer2.is1D(), false);
				layer1.dispose();
				layer2.dispose();
			});
		});
		describe('incrementBufferIndex', () => {
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
				layer.dispose();
			});
		});
		describe('getStateAtIndex, get currentState, and get lastState', () => {
			it('should return WebGLTextures', () => {
				const layer1 = new GPULayer(composer1, { name: 'test-layer', type: FLOAT, numComponents: 3, dimensions: [34, 56], numBuffers: 1});
				assert.typeOf(layer1.currentState, 'WebGLTexture');
				const layer2 = new GPULayer(composer1, { name: 'test-layer', type: FLOAT, numComponents: 3, dimensions: [34, 56], numBuffers: 2});
				assert.typeOf(layer2.currentState, 'WebGLTexture');
				assert.typeOf(layer2.lastState, 'WebGLTexture');
				assert.notEqual(layer2.currentState, layer2.lastState);
				assert.equal(layer2.getStateAtIndex(-2), layer2.currentState); // This will throw warning - likely user error.
				assert.equal(layer2.getStateAtIndex(-1), layer2.lastState);
				assert.equal(layer2.getStateAtIndex(0), layer2.currentState);
				assert.equal(layer2.getStateAtIndex(1), layer2.lastState);
				assert.equal(layer2.getStateAtIndex(2), layer2.currentState); // This will throw warning - likely user error.
				// After incrementing index, this logic should be reversed.
				layer2.incrementBufferIndex();
				assert.equal(layer2.getStateAtIndex(-2), layer2.lastState); // This will throw warning - likely user error.
				assert.equal(layer2.getStateAtIndex(-1), layer2.currentState);
				assert.equal(layer2.getStateAtIndex(0), layer2.lastState);
				assert.equal(layer2.getStateAtIndex(1), layer2.currentState);
				assert.equal(layer2.getStateAtIndex(2), layer2.lastState); // This will throw warning - likely user error.
				layer1.dispose();
				layer2.dispose();
			});
		});
		describe('_bindFramebuffer', () => {
			it('should bind GPULayer framebuffer for draw', () => {
				const layer1 = new GPULayer(composer1, { name: 'test-layer', type: FLOAT, numComponents: 3, dimensions: [34, 56], numBuffers: 3, writable: true});
				const { gl } = composer1;
				assert.equal(gl.getParameter(gl.FRAMEBUFFER_BINDING), null);
				layer1._bindFramebuffer();
				assert.equal(gl.getParameter(gl.FRAMEBUFFER_BINDING), layer1._buffers[layer1.bufferIndex].framebuffer);
				layer1.dispose();
			});
			it('should throw error for readonly GPULayer', () => {
				const layer1 = new GPULayer(composer1, { name: 'test-layer', type: FLOAT, numComponents: 3, dimensions: [34, 56], numBuffers: 1});
				assert.throws(() => { layer1._bindFramebuffer(); }, 'GPULayer "test-layer" is not writable.');
				layer1.dispose();
			});
		});
		describe('_prepareForWrite', () => {
			it('should increment index and bind framebuffer', () => {
				const layer1 = new GPULayer(composer1, { name: 'test-layer', type: FLOAT, numComponents: 3, dimensions: [34, 56], numBuffers: 3, writable: true});
				const { gl } = composer1;
				assert.equal(layer1.bufferIndex, 0);
				assert.equal(gl.getParameter(gl.FRAMEBUFFER_BINDING), null);
				layer1._prepareForWrite();
				assert.equal(layer1.bufferIndex, 0);
				assert.equal(gl.getParameter(gl.FRAMEBUFFER_BINDING), layer1._buffers[layer1.bufferIndex].framebuffer);
				layer1._prepareForWrite(true);
				assert.equal(layer1.bufferIndex, 1);
				assert.equal(gl.getParameter(gl.FRAMEBUFFER_BINDING), layer1._buffers[layer1.bufferIndex].framebuffer);
				layer1.dispose();
			});
			it('should remove texture overrides at current buffer index', () => {
				// TODO:
			});
		});
		describe('setFromArray', () => {
			it('should set values of GPULayer', () => {
				// TODO:
			});
		});
		describe('resize', () => {
			it('should ', () => {
				// TODO:
			});
		});
		describe('set clearValue, get clearValue, clear', () => {
			it('should set/get clear value and clear to value', () => {
				const layer1 = new GPULayer(composer1, { name: 'test-layer', type: FLOAT, numComponents: 3, dimensions: [34, 56], writable: true, numBuffers: 2 });
				assert.equal(layer1.clearValue, 0);
				layer1.clearValue = 10.4;
				assert.equal(layer1.clearValue, 10.4);
				layer1.clear();
				const values1 = layer1.getValues();
				for (let i = 0; i < values1.length; i++) {
					assert.closeTo(values1[i], 10.4, 1e-6); // There is some float precision delta with this value.
				}
				const vec = [-45, 0, 10.75];
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
				layer1.clear(true);
				const values4 = layer1.getValues();
				for (let i = 0; i < values4.length / vec.length; i++) {
					for (let j = 0; j < vec.length; j++) {
						assert.equal(values4[i * vec.length + j], vec[j]);
					}
				}
				layer1.incrementBufferIndex();
				const values5 = layer1.getValues();
				for (let i = 0; i < values5.length / vec.length; i++) {
					for (let j = 0; j < vec.length; j++) {
						assert.equal(values5[i * vec.length + j], vec[j]);
					}
				}
				layer1.dispose();
			});
			it('should throw errors for bad clear values', () => {
				const layer1 = new GPULayer(composer1, { name: 'test-layer', type: FLOAT, numComponents: 3, dimensions: [34, 56], writable: true });
				const layer2 = new GPULayer(composer1, { name: 'test-layer', type: UNSIGNED_BYTE, numComponents: 3, dimensions: [34, 56], writable: true });
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
			it('should throw error for non-writable GPULayer', () => {
				const layer1 = new GPULayer(composer1, { name: 'test-layer', type: FLOAT, numComponents: 3, dimensions: [34, 67], writable: false});
				assert.throws(() => { layer1.getValues(); }, 'GPULayer "test-layer" is not writable.');
				layer1.dispose();
			});
			it('should return TypedArray with correct length and type', () => {
				[HALF_FLOAT, FLOAT, UNSIGNED_BYTE, BYTE, UNSIGNED_SHORT, SHORT, UNSIGNED_INT, INT].forEach(type => {
					const layer1 = new GPULayer(composer1, { name: 'test-layer', type, numComponents: 3, dimensions: 245, writable: true});
					assert.notEqual(layer1.length, layer1.width * layer1.height);
					const values = layer1.getValues();
					// Due to some annoying browser things, this is currently returning one of Float32Array, Int32Array, or Uint32Array.
					assert.typeOf(values, isFloatType(type) ? 'Float32Array' : (isUnsignedIntType(type) ? 'UInt32Array' : 'Int32Array'));
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
					const layer1 = new GPULayer(composer, { name: 'test-layer', type: UNSIGNED_BYTE, numComponents: 3, dimensions: [30, 30], writable: true});
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
		describe('savePNG', () => {
			// TODO: this could be more thorough.
			it('should throw error for non-writable GPULayer', () => {
				const layer1 = new GPULayer(composer1, { name: 'test-layer', type: FLOAT, numComponents: 3, dimensions: [34, 67], writable: false});
				assert.throws(() => { layer1.savePNG({ filename: 'thing' }); }, 'GPULayer "test-layer" is not writable.');
				layer1.dispose();
			});
			it('should return Blob in callback', () => {
				const layer1 = new GPULayer(composer1, { name: 'test-layer', type: FLOAT, numComponents: 3, dimensions: [34, 67], writable: true});
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
			it('should ', () => {
				// TODO:
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
					wrapS: REPEAT,
					wrapT: REPEAT,
					writable: true,
					numBuffers: 5,
					clearValue,
					array: (new Float32Array(34 * 56 * 3)).fill(-5),
				});
				layer.incrementBufferIndex();
				const clone = layer.clone('clone')
				assert.equal(clone.name, 'clone');
				assert.equal(clone.type, FLOAT);
				assert.equal(clone.numComponents, 3);
				assert.equal(clone.width, 34);
				assert.equal(clone.height, 56);
				assert.equal(clone.filter, LINEAR);
				assert.equal(clone.wrapS, REPEAT);
				assert.equal(clone.wrapT, REPEAT);
				assert.equal(clone.writable, true);
				assert.equal(clone.numBuffers, 5);
				assert.deepEqual(clone.clearValue, clearValue.slice());
				assert.notEqual(clone.clearValue, layer.clearValue); // Make deep copy.
				const values = clone.getValues();
				for (let i = 0; i < values.length; i++) {
					assert.equal(values[i], -5);
				}
				// assert.equal(clone.bufferIndex, layer.bufferIndex);
				// TODO: check that all buffers were copied.
				layer.dispose();
				clone.dispose();
			});
		});
		describe('dispose', () => {
			it('should delete all object/array keys', () => {
				const layer1 = new GPULayer(composer1, { name: 'test-layer', type: FLOAT, numComponents: 3, dimensions: [34, 67], writable: false});
				layer1.dispose();
				// Filter out keys for simple objects (e.g. strings, number, boolean).
				const keys = Object.keys(layer1).filter(key => {
					return !isString(layer1[key]) && !isNumber(layer1[key]) && !isBoolean(layer1[key]) && layer1[key] !== undefined;
				});
				assert.equal(keys.length, 0, `remaining keys: ${JSON.stringify(keys)}.`);
				// We don't really have a way to test if WebGL things were actually deleted.
				// dispose() marks them for deletion, but they are garbage collected later.
			});
		});
	});
}