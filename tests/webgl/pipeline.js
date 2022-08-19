{
	const {
		GLSL1,
		GLSL3,
		WEBGL1,
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
	} = WebGLCompute;

	const DIM = 30;

	function checkResult(result) {
		if (result.status === ERROR) {
			console.log(result);
		}
		assert.equal(result.status, SUCCESS);
	}

	describe('pipeline', () => {
		// [testLayerReads, testLayerWrites].forEach(test => {
		// 	describe(test.name, () => {
		// 		[HALF_FLOAT, FLOAT].forEach(TYPE => {
		// 			it(`${TYPE} + WebGL2 + GLSL3`, () => {
		// 				// TODO: add LINEAR
		// 				[NEAREST].forEach(FILTER => {
		// 					[CLAMP_TO_EDGE, REPEAT].forEach(WRAP => {
		// 						[1, 2, 3, 4].forEach(NUM_ELEMENTS => {
		// 							[true, false].forEach(TEST_EXTREMA => {
		// 								const result = test({
		// 									TYPE,
		// 									DIM_X: DIM,
		// 									DIM_Y: DIM,
		// 									NUM_ELEMENTS,
		// 									WEBGL_VERSION: WEBGL2,
		// 									GLSL_VERSION: GLSL3,
		// 									WRAP,
		// 									FILTER,
		// 									TEST_EXTREMA,
		// 								});
		// 								checkResult(result);
		// 							});
		// 						});
		// 					});
		// 				});
		// 			});
		// 		});
		// 		[UNSIGNED_BYTE, BYTE, UNSIGNED_SHORT, SHORT, UNSIGNED_INT, INT].forEach(TYPE => {
		// 			it(`${TYPE} + WebGL2 + GLSL3`, () => {
		// 				[NEAREST].forEach(FILTER => {
		// 					[CLAMP_TO_EDGE, REPEAT].forEach(WRAP => {
		// 						[1, 2, 3, 4].forEach(NUM_ELEMENTS => {
		// 							[true, false].forEach(TEST_EXTREMA => {
		// 								const result = test({
		// 									TYPE,
		// 									DIM_X: DIM,
		// 									DIM_Y: DIM,
		// 									NUM_ELEMENTS,
		// 									WEBGL_VERSION: WEBGL2,
		// 									GLSL_VERSION: GLSL3,
		// 									WRAP,
		// 									FILTER,
		// 									TEST_EXTREMA,
		// 								});
		// 								checkResult(result);
		// 							});
		// 						});
		// 					});
		// 				});
		// 			});
		// 		});
		// 	});
		// });
	});
}