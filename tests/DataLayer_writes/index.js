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
			let NUM_TYPE_EXTREMA = 0;
			let NUM_HALF_FLOAT_INT_EXTREMA = 0;
			let NUM_FLOAT_INT_EXTREMA = 0;

			const MIN_UNSIGNED_INT = 0;
			const MIN_BYTE = -(2 ** 7);
			const MAX_BYTE = 2 ** 8 - 1;
			const MIN_SHORT = -(2 ** 15);
			const MAX_SHORT = 2 ** 16 - 1;
			const MIN_INT = -(2 ** 31);
			const MAX_INT = 2 ** 31 - 1;
			const MIN_FLOAT_INT = -16777216;
			const MAX_FLOAT_INT = 16777216;
			const MIN_HALF_FLOAT_INT = -2048;
			const MAX_HALF_FLOAT_INT = -2048;

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
					// Test extrema values.
					NUM_TYPE_EXTREMA = 4;
					NUM_EXTREMA = NUM_TYPE_EXTREMA;
					// Minimum values.
					input[0] = MIN_UNSIGNED_INT;
					input[1] = input[0] + 1;
					// Maximum values.
					input[2] = MAX_BYTE;
					input[3] = input[2] - 1;

					const length = input.length - NUM_EXTREMA;
					for (let i = 0; i < length; i++) {
						input[i + NUM_EXTREMA] = i % (MAX_BYTE + 1);
					}
					break;
				}
				case UNSIGNED_SHORT: {
					input = new Uint16Array(DIM_X * DIM_Y * NUM_ELEMENTS);
					// Fill with uint16 data.					
					// Test extrema values.
					NUM_TYPE_EXTREMA = 4;
					NUM_HALF_FLOAT_INT_EXTREMA = 2;
					NUM_EXTREMA = NUM_TYPE_EXTREMA + NUM_HALF_FLOAT_INT_EXTREMA;
					// Minimum values.
					input[0] = MIN_UNSIGNED_INT;
					input[1] = input[0] + 1;
					// Maximum values.
					input[2] = MAX_SHORT;
					input[3] = input[2] - 1;
					// Check that at least half float values are supported.
					input[4] = MAX_HALF_FLOAT_INT;
					input[5] = input[4] - 1;

					const length = input.length - NUM_EXTREMA;
					for (let i = 0; i < length; i++) {
						input[i + NUM_EXTREMA] = i % (MAX_SHORT + 1);
					}
					break;
				}
				case UNSIGNED_INT: {
					input = new Uint32Array(DIM_X * DIM_Y * NUM_ELEMENTS);
					// Fill with uint32 data.
					// Test extrema values.
					NUM_TYPE_EXTREMA = 4;
					NUM_FLOAT_INT_EXTREMA = 2;
					NUM_HALF_FLOAT_INT_EXTREMA = 2;
					NUM_EXTREMA = NUM_TYPE_EXTREMA + NUM_HALF_FLOAT_INT_EXTREMA + NUM_FLOAT_INT_EXTREMA;
					// Minimum values.
					input[0] = MIN_UNSIGNED_INT;
					input[1] = input[0] + 1;
					// Maximum values.
					input[2] = MAX_INT;
					input[3] = input[2] - 1;
					// Check that at least float values are supported.
					input[4] = MAX_FLOAT_INT;
					input[5] = input[4] - 1;
					// Check that at least half float values are supported.
					input[6] = MAX_HALF_FLOAT_INT;
					input[7] = input[4] - 1;

					const length = input.length - NUM_EXTREMA;
					for (let i = 0; i < length; i++) {
						input[i + NUM_EXTREMA] = i % (MAX_INT + 1);
					}
					break;
				}
				case BYTE: {
					input = new Int8Array(DIM_X * DIM_Y * NUM_ELEMENTS);
					// Fill with int8 data.
					// Test extrema values.
					NUM_TYPE_EXTREMA = 4;
					NUM_EXTREMA = NUM_TYPE_EXTREMA;
					// Minimum values.
					input[0] = MIN_BYTE;
					input[1] = input[0] + 1;
					// Maximum values.
					input[2] = MAX_BYTE;
					input[3] = input[2] - 1;

					const length = input.length - NUM_EXTREMA;
					for (let i = 0; i < length; i++) {
						input[i + NUM_EXTREMA] = (i - Math.floor(length / 2));
					}
					break;
				}
				case SHORT: {
					input = new Int16Array(DIM_X * DIM_Y * NUM_ELEMENTS);
					// Fill with int16 data.
					// Test extrema values.
					NUM_TYPE_EXTREMA = 4;
					NUM_HALF_FLOAT_INT_EXTREMA = 4;
					NUM_EXTREMA = NUM_TYPE_EXTREMA + NUM_HALF_FLOAT_INT_EXTREMA;
					// Minimum values.
					input[0] = MIN_SHORT;
					input[1] = input[0] + 1;
					// Maximum values.
					input[2] = MAX_SHORT;
					input[3] = input[2] - 1;
					// Check that at least half float values are supported.
					input[4] = MIN_HALF_FLOAT_INT;
					input[5] = input[4] + 1;
					input[6] = MAX_HALF_FLOAT_INT;
					input[7] = input[6] - 1;

					const length = input.length - NUM_EXTREMA;
					for (let i = 0; i < length; i++) {
						input[i + NUM_EXTREMA] = (i - Math.floor(length / 2));
					}
					break;
				}
				case INT: {
					input = new Int32Array(DIM_X * DIM_Y * NUM_ELEMENTS);
					// Fill with int32 data.
					// Test extrema values.
					NUM_TYPE_EXTREMA = 4;
					NUM_FLOAT_INT_EXTREMA = 4;
					NUM_HALF_FLOAT_INT_EXTREMA = 4;
					NUM_EXTREMA = NUM_TYPE_EXTREMA + NUM_HALF_FLOAT_INT_EXTREMA + NUM_FLOAT_INT_EXTREMA;
					// Minimum values.
					input[0] = MIN_INT;
					input[1] = input[0] + 1;
					// Maximum values.
					input[2] = MAX_INT;
					input[3] = input[2] - 1;
					// Check that at least float values are supported.
					input[4] = MIN_FLOAT_INT;
					input[5] = input[4] + 1;
					input[6] = MAX_FLOAT_INT;
					input[7] = input[6] - 1;
					// Check that at least half float values are supported.
					input[8] = MIN_HALF_FLOAT_INT;
					input[9] = input[8] + 1;
					input[10] = MAX_HALF_FLOAT_INT;
					input[11] = input[10] - 1;

					const length = input.length - NUM_EXTREMA;
					for (let i = 0; i < length; i++) {
						input[i + NUM_EXTREMA] = (i - Math.floor(length / 2));
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
					status: ERROR,
					error: `Input and output arrays have unequal length: expected length ${input.length}, got length ${output.length}.`,
				};
			}
			let numMismatches = 0;
			let minMatch = Infinity;
			let maxMatch = -Infinity;
			let validRange = [0, 0];
			let extremaMismatches = '';
			for (let i = 0; i < input.length; i++) {
				if (input[i] !== output[i]) {
					if (i < NUM_EXTREMA) {
						extremaMismatches += `expected ${input[i]}, got ${output[i]}<br/>`;
					} else {
						numMismatches++;
						// Reset range calculation.
						if (maxMatch !== Infinity && maxMatch - minMatch > validRange[1] - validRange[0]) {
							validRange = [minMatch, maxMatch];
							minMatch = Infinity;
							maxMatch = -Infinity;
						}
					}
				} else if (i >= NUM_EXTREMA) {
					minMatch = Math.min(output[i], minMatch);
					maxMatch = Math.max(output[i], maxMatch);
				}
			}
			if (maxMatch !== Infinity && maxMatch - minMatch > validRange[1] - validRange[0]) {
				validRange = [minMatch, maxMatch];
			}
			if (numMismatches === input.length) {
				return {
					status: ERROR,
					error: `All elements of output array do not match input values.`,
				};
			}
			if (numMismatches) {
				return {
					status: WARNING,
					error: `Input and output arrays have ${numMismatches} mismatched elements, valid values found in range [${validRange[0]}, ${validRange[1]}].`,
				};
			}
			if (extremaMismatches !== '') {
				console.warn(extremaMismatches);
				return {
					status: WARNING,
					error: `Valid values found in range [${validRange[0]}, ${validRange[1]}], extrema not supported.`,
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

	const DIM_X = 1000;
	const DIM_Y = 1000;

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
