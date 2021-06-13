const { setFloat16, getFloat16 } = float16;

const SUCCESS = 'success';
const ERROR = 'error';
const WARNING = 'warning';

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
				// glslVersion: GLSL3,
			});

			const { 
				TYPE,
				DIM_X,
				DIM_Y,
				NUM_ELEMENTS,
			} = options;
			let input;
			let NUM_EXTREMA = 0;
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
					// Test extrema values.
					NUM_EXTREMA = 4;
					// https://en.wikipedia.org/wiki/Half-precision_floating-point_format
					// Minimum positive value.
					input[0] = 2 ** -24;
					// Minimum negative value.
					input[1] = -input[0];
					// Maximum positive value.
					input[2] = (2 - 2 ** -10) * 2 ** 15;
					// Maximum negative value.
					input[3] = -input[2];
					break;
				}
				case FLOAT: {
					input = new Float32Array(DIM_X * DIM_Y * NUM_ELEMENTS);
					// Fill with float data.
					for (let i = 0; i < input.length; i++) {
						input[i] = (i - input.length / 2) * 0.1;
					}
					// Test extrema values.
					NUM_EXTREMA = 4;
					// https://en.wikipedia.org/wiki/Single-precision_floating-point_format
					// Minimum positive value.
					input[0] = 2 ** -126;
					// Minimum negative value.
					input[1] = -input[0];
					// Maximum positive value.
					input[2] = (2 - 2 ** -23) * 2 ** 127;
					// Maximum negative value.
					input[3] = -input[2];
					break;
				}
				case UNSIGNED_BYTE: {
					input = new Uint8Array(DIM_X * DIM_Y * NUM_ELEMENTS);
					// Fill with uint8 data.
					const MIN = 0;
					const MAX = 2 ** 8 - 1;
					for (let i = 0; i < input.length; i++) {
						input[i] = i % (MAX + 1);
					}
					// Test extrema values.
					NUM_EXTREMA = 4;
					// Minimum values.
					input[0] = MIN;
					input[1] = input[0] + 1;
					// Maximum values.
					input[2] = MAX;
					input[3] = input[2] - 1;
					break;
				}
				case UNSIGNED_SHORT: {
					input = new Uint16Array(DIM_X * DIM_Y * NUM_ELEMENTS);
					// Fill with uint16 data.
					const MIN = 0;
					const MAX = 2 ** 16 - 1;
					for (let i = 0; i < input.length; i++) {
						input[i] = i % (MAX + 1);
					}
					// Test extrema values.
					NUM_EXTREMA = 4;
					// Minimum values.
					input[0] = MIN;
					input[1] = input[0] + 1;
					// Maximum values.
					input[2] = MAX;
					input[3] = input[2] - 1;
					break;
				}
				case UNSIGNED_INT: {
					input = new Uint32Array(DIM_X * DIM_Y * NUM_ELEMENTS);
					// Fill with uint32 data.
					const MIN = 0;
					const MAX = 2 ** 32 - 1;
					for (let i = 0; i < input.length; i++) {
						input[i] = i % (MAX + 1);
					}
					// Test extrema values.
					NUM_EXTREMA = 4;
					// Minimum values.
					input[0] = MIN;
					input[1] = input[0] + 1;
					// Maximum values.
					input[2] = MAX;
					input[3] = input[2] - 1;
					break;
				}
				case BYTE: {
					input = new Int8Array(DIM_X * DIM_Y * NUM_ELEMENTS);
					// Fill with int8 data.
					const MIN = -(2 ** 7);
					const MAX = 2 ** 7 - 1;
					for (let i = 0; i < input.length; i++) {
						input[i] = (i - Math.floor(input.length / 2))
					}
					// Test extrema values.
					NUM_EXTREMA = 4;
					// Minimum values.
					input[0] = MIN;
					input[1] = input[0] + 1;
					// Maximum values.
					input[2] = MAX;
					input[3] = input[2] - 1;
					break;
				}
				case SHORT: {
					input = new Int16Array(DIM_X * DIM_Y * NUM_ELEMENTS);
					// Fill with int16 data.
					const MIN = -(2 ** 15);
					const MAX = 2 ** 15 - 1;
					for (let i = 0; i < input.length; i++) {
						input[i] = (i - Math.floor(input.length / 2));
					}
					// Test extrema values.
					NUM_EXTREMA = 4;
					// Minimum values.
					input[0] = MIN;
					input[1] = input[0] + 1;
					// Maximum values.
					input[2] = MAX;
					input[3] = input[2] - 1;
					break;
				}
				case INT: {
					input = new Int32Array(DIM_X * DIM_Y * NUM_ELEMENTS);
					// Fill with int32 data.
					const MIN = -(2 ** 31);
					const MAX = 2 ** 31 - 1;
					for (let i = 0; i < input.length; i++) {
						input[i] = (i - Math.floor(input.length / 2));
					}
					// Test extrema values.
					NUM_EXTREMA = 4;
					// Minimum values.
					input[0] = MIN;
					input[1] = input[0] + 1;
					// Maximum values.
					input[2] = MAX;
					input[3] = input[2] - 1;
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
					status: ERROR,
					error: `Input and output arrays have unequal length: ${input.length}, ${output.length}.`,
				};
			}
			let numMismatches = 0;
			let numExtremaMismatches = 0;
			for (let i = 0; i < input.length; i++) {
				if (input[i] !== output[i]) {
					if (i < NUM_EXTREMA) {
						numExtremaMismatches++;
					} else numMismatches++;
				}
			}
			if (numMismatches) {
				return {
					status: ERROR,
					error: `Input and output arrays have ${numMismatches} mismatched elements.`,
				};
			}
			if (numExtremaMismatches) {
				return {
					status: WARNING,
					error: `Large values not supported.`,
				};
			}
			return {
				status: SUCCESS,
			};
		} catch (error) {
			return {
				status: ERROR,
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
			resultDiv.className = `result ${result.status}`;
			resultDiv.innerHTML = result.status === SUCCESS ? 'Passed' : result.error;
			container.appendChild(resultDiv);
		}
	});
});
