{
	const {
		GLSL3,
		WEBGL2,
		HALF_FLOAT,
		FLOAT,
		UNSIGNED_BYTE,
		BYTE,
		UNSIGNED_SHORT,
		SHORT,
		UNSIGNED_INT,
		INT,
		NEAREST,
		LINEAR,
		REPEAT,
		CLAMP_TO_EDGE,
		isWebGL2Supported,
	} = GPUIO;

	const DIM = 30;

	function checkResult(result) {
		if (result.status === ERROR) {
			console.log(result);
		}
		assert.equal(result.status, SUCCESS);
	}

	describe('pipeline', () => {
		[testLayerReads, testLayerWrites].forEach(test => {
			describe(test.name, () => {
				[HALF_FLOAT, FLOAT].forEach(TYPE => {
					it(`${TYPE} + ${isWebGL2Supported() ? 'WebGL2' : 'WebGL1'} + ${isWebGL2Supported() ? 'GLSL3' : 'GLSL1'}`, () => {
						[1, 2, 3, 4].forEach(NUM_ELEMENTS => {
							const result = test({
								TYPE,
								DIM_X: DIM,
								DIM_Y: DIM,
								NUM_ELEMENTS,
								WEBGL_VERSION: WEBGL2,
								GLSL_VERSION: GLSL3,
								WRAP: CLAMP_TO_EDGE,
								FILTER: NEAREST,
								TEST_EXTREMA: true,
							});
							checkResult(result);
							[NEAREST, LINEAR].forEach(FILTER => {
								[CLAMP_TO_EDGE, REPEAT].forEach(WRAP => {
									const result = test({
										TYPE,
										DIM_X: DIM,
										DIM_Y: DIM,
										NUM_ELEMENTS,
										WEBGL_VERSION: WEBGL2,
										GLSL_VERSION: GLSL3,
										WRAP,
										FILTER,
									});
									checkResult(result);
								});
							});
						});
					});
				});
				[UNSIGNED_BYTE, BYTE, UNSIGNED_SHORT, SHORT, UNSIGNED_INT, INT].forEach(TYPE => {
					it(`${TYPE} + WebGL2 + GLSL3`, () => {
						[1, 2, 3, 4].forEach(NUM_ELEMENTS => {
							const result = test({
								TYPE,
								DIM_X: DIM,
								DIM_Y: DIM,
								NUM_ELEMENTS,
								WEBGL_VERSION: WEBGL2,
								GLSL_VERSION: GLSL3,
								WRAP: CLAMP_TO_EDGE,
								FILTER: NEAREST,
								TEST_EXTREMA: true,
							});
							checkResult(result);
							[NEAREST].forEach(FILTER => {
								[CLAMP_TO_EDGE, REPEAT].forEach(WRAP => {
									const result = test({
										TYPE,
										DIM_X: DIM,
										DIM_Y: DIM,
										NUM_ELEMENTS,
										WEBGL_VERSION: WEBGL2,
										GLSL_VERSION: GLSL3,
										WRAP,
										FILTER,
									});
									checkResult(result);
								});
							});
						});
					});
				});
			});
		});
	});
}