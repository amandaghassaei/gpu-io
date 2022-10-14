{
	let composer;
	const {
		GPUProgram,
		GPUComposer,
		GPULayer,
		_testing,
	} = GPUIO;

	describe('GPUComposer', () => {
		beforeEach(() => {
			composer = new GPUComposer({ canvas: document.createElement('canvas') });
		});
		afterEach(() => {
			composer.dispose();
			composer = undefined;
		});
		describe('initWithThreeRenderer', () => {
			it('should ', () => {
			});
		});
		describe('constructor', () => {
			it('should ', () => {
			});
		});
		describe('get canvas', () => {
			it('should return canvas', () => {
				const canvas = document.createElement('canvas');
				const testComposer = new GPUComposer({ canvas });
				assert.equal(testComposer.canvas, canvas);
			});
		});
		describe('resize', () => {
			it('should ', () => {
			});
		});
		describe('_widthHeightForOutput', () => {
			it('should ', () => {
			});
		});
		// describe('step', () => {
		// 	it('should ', () => {
		// 	});
		// });
		// describe('stepBoundary', () => {
		// 	it('should ', () => {
		// 	});
		// });
		// describe('stepNonBoundary', () => {
		// 	it('should ', () => {
		// 	});
		// });
		// describe('stepCircle', () => {
		// 	it('should ', () => {
		// 	});
		// });
		// describe('stepSegment', () => {
		// 	it('should ', () => {
		// 	});
		// });
		// describe('stepRect', () => {
		// 	it('should ', () => {
		// 	});
		// });
		// describe('drawLayerAsPoints', () => {
		// 	it('should ', () => {
		// 	});
		// });
		// describe('drawLayerAsVectorField', () => {
		// 	it('should ', () => {
		// 	});
		// });
		describe('resetThreeState', () => {
			it('should throw an error for GPUComposers not inited with three renderer', () => {
				assert.throws(() => { composer.resetThreeState(); },
					`Can't call resetThreeState() on a GPUComposer that was not inited with GPUComposer.initWithThreeRenderer().`);
			});
			it('should not throw an error if threejs renderer present', () => {
				const renderer = new THREE.WebGLRenderer();
				const threeGPU = new GPUComposer.initWithThreeRenderer(renderer);
				assert.equal(threeGPU.resetThreeState(), undefined);
			});
		});
		describe('savePNG', () => {
			it('should return Blob in callback', () => {
				composer.savePNG({
					filename: 'thing',
					callback: (blob, filename) => {
						assert.typeOf(blob, 'Blob');
						assert.equal(filename, 'thing.png');
					}
				});
			});
		});
		describe('tick', () => {
			it('should increment numTicks and return an fps', () => {
				let { fps, numTicks } = composer.tick();
				assert.equal(fps, 0);
				assert.equal(numTicks, 1);
				({ fps, numTicks } = composer.tick());
				assert.equal(Number.isNaN(fps), false);
				assert.equal(numTicks, 2);
			});
		});
		describe('dispose', () => {
			it('should delete all keys', () => {
				const testComposer = new GPUComposer({ canvas: document.createElement('canvas') });
				testComposer.dispose();
				assert.equal(Object.keys(testComposer).length, 0, Object.keys(testComposer));
				// We don't really have a way to test if WebGL things were actually deleted.
				// dispose() marks them for deletion, but they are garbage collected later.
			});
		});
	});
}