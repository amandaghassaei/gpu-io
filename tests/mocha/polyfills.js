{
	const {
		_testing,
	} = GPUIO;
	const {
		texturePolyfill,
	} = _testing;
	describe('polyfills', () => {
		describe('texturePolyfill', () => {
			it('should init texture() polyfills', () => {
				// This is tested more extensively in pipeline.js.
				const polyfill = texturePolyfill(`uniform sampler2D u_test1;uniform usampler2D  u_test2;uniform  lowp isampler2D u_test3;void main(){\nvec4 thing = texture(sampler2D, v_uv);}`);
				assert.deepEqual(polyfill.samplerUniforms, ['u_test1', 'u_test2', 'u_test3']);
			});
		});
	});
}