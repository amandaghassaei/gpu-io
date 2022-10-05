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
		_testing,
	} = GPUIO;
	const {
		isIntType,
	} = _testing;

	const DIM = 30;

	function checkResult(result, expected = SUCCESS) {
		if (result.status === ERROR) {
			console.log(result);
		}
		assert.equal(result.status, expected);
	}

	describe('pipeline', () => {
		describe(testLayerWrites.name, () => {
			[WEBGL2, WEBGL1].forEach(WEBGL_VERSION => {
				[GLSL1, GLSL3].forEach(GLSL_VERSION => {
					if (WEBGL_VERSION === WEBGL1 && GLSL_VERSION === GLSL3) return;
					[HALF_FLOAT, FLOAT, UNSIGNED_BYTE, BYTE, UNSIGNED_SHORT, SHORT, UNSIGNED_INT, INT].forEach(TYPE => {
						it(`${TYPE} + ${WEBGL_VERSION === WEBGL1 ? 'webgl1' : 'webgl2'} + ${GLSL_VERSION}`, () => {
							[1, 2, 3, 4].forEach(NUM_ELEMENTS => {
								const extremaResult = testLayerWrites({
									TYPE,
									DIM_X: DIM,
									DIM_Y: DIM,
									NUM_ELEMENTS,
									WEBGL_VERSION,
									GLSL_VERSION,
									WRAP: CLAMP_TO_EDGE,
									FILTER: NEAREST,
									TEST_EXTREMA: true,
								});
								if (GLSL_VERSION === GLSL1 && (TYPE === UNSIGNED_INT || TYPE === INT)) {
									// UNSIGNED_INT and INT are not fully supported in GLSL1.
									checkResult(extremaResult, WARNING);
								} else {
									checkResult(extremaResult);
								}
								[NEAREST, LINEAR].forEach(FILTER => {
									if (FILTER === LINEAR && isIntType(TYPE)) return; // Don't test LINEAR filtering on int types.
									[CLAMP_TO_EDGE, REPEAT].forEach(WRAP => {
										const result = testLayerWrites({
											TYPE,
											DIM_X: DIM,
											DIM_Y: DIM,
											NUM_ELEMENTS,
											WEBGL_VERSION,
											GLSL_VERSION,
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
	});
}