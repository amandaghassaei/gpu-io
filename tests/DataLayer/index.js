requirejs([
	'../../dist/index',
], ({ GLCompute, CopyFragmentShader }) => {

	const canvas = document.getElementById('glcanvas');

	// General code for testing array writes.
	function testArrayWrites(options) {
		try {
			const glcompute = new GLCompute(null, canvas, {antialias: true});

			const { 
				TYPE,
				DIM_X,
				DIM_Y,
				NUM_ELEMENTS,
			} = options;
			let input;
			switch (TYPE) {
				case 'float16':
				case 'float32': {
					input = new Float32Array(DIM_X * DIM_Y * NUM_ELEMENTS);
					// Fill with float data.
					for (let i = 0; i < input.length; i++) {
						input[i] = (i - input.length / 2) * 0.1;
					}
					break;
				}
				case 'uint8': {
					input = new Uint8Array(DIM_X * DIM_Y * NUM_ELEMENTS);
					// Fill with uint8 data.
					for (let i = 0; i < input.length; i++) {
						input[i] = i % 256;
					}
					break;
				}
				case 'uint16': {
					input = new Uint16Array(DIM_X * DIM_Y * NUM_ELEMENTS);
					// Fill with uint16 data.
					const MAX = 2 ** 16;
					for (let i = 0; i < input.length; i++) {
						input[i] = i % MAX;
					}
					break;
				}
				case 'uint32': {
					input = new Uint32Array(DIM_X * DIM_Y * NUM_ELEMENTS);
					// Fill with uint32 data.
					const MAX = 2 ** 32;
					for (let i = 0; i < input.length; i++) {
						input[i] = i % MAX;
					}
					break;
				}
				case 'int16': {
					input = new Int16Array(DIM_X * DIM_Y * NUM_ELEMENTS);
					// Fill with int16 data.
					const MAX = 2 ** 15;
					for (let i = 0; i < input.length; i++) {
						input[i] = i % MAX;
					}
					break;
				}
				case 'int32': {
					input = new Int32Array(DIM_X * DIM_Y * NUM_ELEMENTS);
					// Fill with int32 data.
					const MAX = 2 ** 31;
					for (let i = 0; i < input.length; i++) {
						input[i] = i % MAX;
					}
					break;
				}
				default:
					throw new Error(`Invalid type ${TYPE}.`);
			}

			const dataLayer = glcompute.initDataLayer(
				`test-${TYPE}`,
				{
					dimensions: [DIM_X, DIM_Y],
					type: TYPE,
					numComponents: NUM_ELEMENTS,
					data: input,
				},
				true,
				2,
			);

			const copyProgram = glcompute.initProgram(
				'copy',
				CopyFragmentShader,
				[
					{
						name: 'u_state',
						value: 0,
						dataType: 'INT',
					},
				],
			);

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
				if (TYPE === 'uint8') {
					console.log(input, output);
				}
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
		'float16',
		'float32',
		'uint8',
		'uint16',
		'uint32',
		'int8',
		'int16',
		'int32',
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
