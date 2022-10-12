// describe('_bindFramebuffer', () => {
// 	it('should bind GPULayer framebuffer for draw', () => {
// 		const layer1 = new GPULayer(composer1, { name: 'test-layer', type: FLOAT, numComponents: 3, dimensions: [34, 56], numBuffers: 3});
// 		const { gl } = composer1;
// 		assert.equal(gl.getParameter(gl.FRAMEBUFFER_BINDING), null);
// 		layer1._bindFramebuffer();
// 		assert.equal(gl.getParameter(gl.FRAMEBUFFER_BINDING), layer1._buffers[layer1.bufferIndex].framebuffer);
// 		layer1.dispose();
// 	});
// });