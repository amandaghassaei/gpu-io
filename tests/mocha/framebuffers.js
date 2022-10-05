// describe('_bindFramebuffer', () => {
// 	it('should bind GPULayer framebuffer for draw', () => {
// 		const layer1 = new GPULayer(composer1, { name: 'test-layer', type: FLOAT, numComponents: 3, dimensions: [34, 56], numBuffers: 3, writable: true});
// 		const { gl } = composer1;
// 		assert.equal(gl.getParameter(gl.FRAMEBUFFER_BINDING), null);
// 		layer1._bindFramebuffer();
// 		assert.equal(gl.getParameter(gl.FRAMEBUFFER_BINDING), layer1._buffers[layer1.bufferIndex].framebuffer);
// 		layer1.dispose();
// 	});
// 	it('should throw error for readonly GPULayer', () => {
// 		const layer1 = new GPULayer(composer1, { name: 'test-layer', type: FLOAT, numComponents: 3, dimensions: [34, 56], numBuffers: 1});
// 		assert.throws(() => { layer1._bindFramebuffer(); }, 'GPULayer "test-layer" is not writable.');
// 		layer1.dispose();
// 	});
// });