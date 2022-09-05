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
				// console.log(texturePolyfill(copyFragmentShader));
				console.log(texturePolyfill(`uniform sampler2D u_test1;uniform usampler2D  u_test2;uniform  lowp isampler2D u_test3;`));
			});
		});
	});
}