// Main is called from ../common/wrapper.js
function main({ gui, contextID, glslVersion}) {
	const {
		GPUComposer,
		GPULayer,
		GPUProgram,
		FLOAT,
		renderAmplitudeProgram,
	} = GPUIO;

	const RADIUS = 1.25;

	function calcBounds() {
		const aspectRatio = window.innerWidth / window.innerHeight;
		return {
			min: aspectRatio > 1 ? [-RADIUS * aspectRatio, -RADIUS] : [-RADIUS, -RADIUS / aspectRatio],
			max: aspectRatio > 1 ? [RADIUS * aspectRatio, RADIUS] : [RADIUS, RADIUS / aspectRatio],
		};
	}
	let bounds = calcBounds();

	const PARAMS = {
		cReal: -0.8,
		cImaginary: 0.16,
		maxIters: 150,
		savePNG: savePNG,
	};
	let needsCompute = true;

	const canvas = document.createElement('canvas');
	document.body.appendChild(canvas);

	const composer = new GPUComposer({ canvas, contextID, glslVersion });
	const state = new GPULayer(composer, {
		name: 'state',
		dimensions: [canvas.width, canvas.height],
		type: FLOAT,
		numComponents: 1,
		writable: true,
	});
	const fractalCompute = new GPUProgram(composer, {
		name: 'fractalCompute',
		fragmentShader: `
			in vec2 v_uv;

			uniform vec2 u_boundsMin;
			uniform vec2 u_boundsMax;
			uniform float u_cReal;
			uniform float u_cImaginary;

			out float out_FragColor;

			void main() {
				// https://en.wikipedia.org/wiki/Julia_set#Pseudocode
				vec2 z = v_uv * u_boundsMax + (1.0 - v_uv) * u_boundsMin;
				int value = 0;
				float radius = (max(u_boundsMax.x - u_boundsMin.x, u_boundsMax.y - u_boundsMin.y)) / 2.0;
				for (int i = 0; i < MAX_ITERS; i++) {
					if (z.x * z.x + z.y * z.y > radius * radius) break;
					float xTemp = z.x * z.x - z.y * z.y;
					z.y = 2.0 * z.x * z.y + u_cImaginary;
					z.x = xTemp + u_cReal;
					value += 1;
				}
				out_FragColor = float(value) / float(MAX_ITERS);
			}`,
		uniforms: [
			{
				name: 'u_boundsMin',
				value: bounds.min,
				type: FLOAT,
			},
			{
				name: 'u_boundsMax',
				value: bounds.max,
				type: FLOAT,
			},
			{
				name: 'u_cReal',
				value: PARAMS.cReal,
				type: FLOAT,
			},
			{
				name: 'u_cImaginary',
				value: PARAMS.cImaginary,
				type: FLOAT,
			},
		],
		// Use compile-time variables to set loop parameter.
		// See https://github.com/amandaghassaei/gpu-io/blob/main/docs/GLSL1_Support.md#other-glsl1-gotchas
		compileTimeConstants: { MAX_ITERS: `${PARAMS.maxIters}` },
	});
	const fractalRender = renderAmplitudeProgram({
		name: 'render',
		composer,
		type: state.type,
		components: 'x',
	});

	// Render loop.
	function loop() {
		if (needsCompute) {
			// Only recompute if something has changed.
			composer.step({
				program: fractalCompute,
				output: state,
			});
			needsCompute = false;

			// Draw to screen.
			composer.step({
				program: fractalRender,
				input: state,
			});
		}
	}

	// Init simple GUI.
	const ui = [];
	ui.push(gui.add(PARAMS, 'cReal', -2, 2, 0.01).onChange((val) => {
		fractalCompute.setUniform('u_cReal', val);
		needsCompute = true;
	}));
	ui.push(gui.add(PARAMS, 'cImaginary', -2, 2, 0.01).onChange((val) => {
		fractalCompute.setUniform('u_cImaginary', val);
		needsCompute = true;
	}));
	ui.push(gui.add(PARAMS, 'maxIters', 1, 500, 1).onChange((val) => {
		// Use compile-time variables to set loop parameter.
		// See https://github.com/amandaghassaei/gpu-io/blob/main/docs/GLSL1_Support.md#other-glsl1-gotchas
		fractalCompute.recompile({ MAX_ITERS: `${val}` });
		needsCompute = true;
	}));
	ui.push(gui.add(PARAMS, 'savePNG').name('Save PNG (p)'));

	function savePNG() {
		composer.step({
			program: fractalRender,
			input: state,
		});
		composer.savePNG({ filename: `julia-set_${PARAMS.cReal}_${PARAMS.cImaginary}i` });
	}
	// Add 'p' hotkey to print screen.
	window.addEventListener('keydown', onKeydown);
	function onKeydown(e) {
		if (e.key === 'p') {
			savePNG();
		}
	}

	// Resize if needed.
	window.addEventListener('resize', onResize);
	function onResize() {
		const width = window.innerWidth;
		const height = window.innerHeight;

		// Resize composer.
		composer.resize(width, height);
		// Resize state.
		state.resize([width, height]);
		bounds = calcBounds();
		fractalCompute.setUniform('u_boundsMin', bounds.min);
		fractalCompute.setUniform('u_boundsMax', bounds.max);
		needsCompute = true;
	}
	onResize();

	// Add mouse events.
	canvas.addEventListener('pointermove', onMove);
	function onMove() {
		// TODO: 
	}


	function dispose() {
		document.body.removeChild(canvas);
		window.removeEventListener('keydown', onKeydown);
		window.removeEventListener('resize', onResize);
		canvas.removeEventListener('pointermove', onMove);
		fractalCompute.dispose();
		fractalRender.dispose();
		state.dispose();
		composer.dispose();
		ui.forEach(el => gui.remove(el));
		ui.length = 0;
	}

	return {
		loop,
		dispose,
		composer,
		canvas,
	};
}