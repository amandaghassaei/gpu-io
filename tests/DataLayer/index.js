const { setFloat16, getFloat16 } = float16;

requirejs([
	'../../dist/index',
], ({ GLCompute, HALF_FLOAT, FLOAT, UNSIGNED_BYTE, BYTE, UNSIGNED_SHORT, SHORT, UNSIGNED_INT, INT, GLSL3 }) => {
	const canvas = document.getElementById('glcanvas');

	// General code for testing array writes.
	function testArrayWrites(options) {
		try {
			const glcompute = new GLCompute({
				canvas,
				antialias: true,
				glslVersion: GLSL3,
			});

			const { 
				TYPE,
				DIM_X,
				DIM_Y,
				NUM_ELEMENTS,
			} = options;
			let input;
			switch (TYPE) {
				case HALF_FLOAT: {
					input = new Float32Array(DIM_X * DIM_Y * NUM_ELEMENTS);
					// Fill with float data.
					const uint16Array = new Uint16Array(1);
					const view = new DataView(uint16Array.buffer);
					for (let i = 0; i < input.length; i++) {
						const float32Value = (i - input.length / 2) * 0.1;
						// We need to make sure we use a valid float16 value.
						setFloat16(view, 0, float32Value, true);
						input[i] = getFloat16(view, 0, true);
					}
					break;
				}
				case FLOAT: {
					input = new Float32Array(DIM_X * DIM_Y * NUM_ELEMENTS);
					// Fill with float data.
					for (let i = 0; i < input.length; i++) {
						input[i] = (i - input.length / 2) * 0.1;
					}
					break;
				}
				case UNSIGNED_BYTE: {
					input = new Uint8Array(DIM_X * DIM_Y * NUM_ELEMENTS);
					// Fill with uint8 data.
					for (let i = 0; i < input.length; i++) {
						input[i] = i % 256;
					}
					break;
				}
				case UNSIGNED_SHORT: {
					input = new Uint16Array(DIM_X * DIM_Y * NUM_ELEMENTS);
					// Fill with uint16 data.
					const MAX = 2 ** 16;
					for (let i = 0; i < input.length; i++) {
						input[i] = i % MAX;
					}
					break;
				}
				case UNSIGNED_INT: {
					input = new Uint32Array(DIM_X * DIM_Y * NUM_ELEMENTS);
					// Fill with uint32 data.
					const MAX = 2 ** 32;
					for (let i = 0; i < input.length; i++) {
						input[i] = i % MAX;
					}
					break;
				}
				case BYTE: {
					input = new Int8Array(DIM_X * DIM_Y * NUM_ELEMENTS);
					// Fill with int8 data.
					for (let i = 0; i < input.length; i++) {
						input[i] = i % 256 - 128;
					}
					break;
				}
				case SHORT: {
					input = new Int16Array(DIM_X * DIM_Y * NUM_ELEMENTS);
					// Fill with int16 data.
					const MAX = 2 ** 16;
					const HALF = MAX / 2;
					for (let i = 0; i < input.length; i++) {
						input[i] = i % MAX - HALF;
					}
					break;
				}
				case INT: {
					input = new Int32Array(DIM_X * DIM_Y * NUM_ELEMENTS);
					// Fill with int32 data.
					const MAX = 2 ** 32;
					const HALF = MAX / 2;
					for (let i = 0; i < input.length; i++) {
						input[i] = i % MAX - HALF;
					}
					break;
				}
				default:
					throw new Error(`Invalid type ${TYPE}.`);
			}

			const dataLayer = glcompute.initDataLayer(
				{
					name: `test-${TYPE}`,
					dimensions: [DIM_X, DIM_Y],
					type: TYPE,
					numComponents: NUM_ELEMENTS,
					data: input,
					filter: 'NEAREST',
					writable: true,
					numBuffers: 2,
				},
			);

			const copyProgram = glcompute.copyProgramForType(TYPE);

			glcompute.step(copyProgram, [dataLayer], dataLayer);
			const output = glcompute.getValues(dataLayer);
			
			glcompute.destroy();

			// Compare input and output.
			if (input.length !== output.length) {
				return {
					passed: false,
					error: 'Input and output arrays have unequal length.',
				};
			}
			let numMismatches = 0;
			for (let i = 0; i < input.length; i++) {
				if (input[i] !== output[i]) numMismatches++;
			}
			if (numMismatches) {
				return {
					passed: false,
					error: `Input and output arrays have ${numMismatches} mismatched elements.`,
				};
			}
			return {
				passed: true,
			};
		} catch (error) {
			return {
				passed: false,
				error: error.message,
			};
		}
	}

	const DIM_X = 100;
	const DIM_Y = 100;

	const output = document.getElementById('output');

	const types = [
		HALF_FLOAT,
		FLOAT,
		UNSIGNED_BYTE,
		BYTE,
		UNSIGNED_SHORT,
		SHORT,
		UNSIGNED_INT,
		INT,
	];
	types.forEach((TYPE) => {
		// Create place to show results.
		const container = document.createElement('div');
		container.className = 'type-container';
		output.appendChild(container);
		const title = document.createElement('div');
		title.innerHTML = TYPE;
		container.appendChild(title);

		for (let NUM_ELEMENTS = 1; NUM_ELEMENTS <= 4; NUM_ELEMENTS++) {
			// Test array writes for type.
			const result = testArrayWrites( {
				TYPE,
				DIM_X,
				DIM_Y,
				NUM_ELEMENTS,
			});

			// Display result on screen.
			const resultDiv = document.createElement('div');
			resultDiv.className = `result ${result.passed ? 'success' : 'error'}`;
			resultDiv.innerHTML = result.passed ? 'Passed' : result.error;
			container.appendChild(resultDiv);
		}
	});
});
