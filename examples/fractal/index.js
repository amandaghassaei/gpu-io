// Main is called from ../common/wrapper.js
function main({ gui, contextID, glslVersion}) {
	const {
		GPUComposer,
		GPULayer,
		GPUProgram,
		FLOAT,
		INT,
		renderAmplitudeProgram,
	} = GPUIO;

	let aspectRatio = window.innerWidth / window.innerHeight;
	const radius = 1.25;

	const PARAMS = {
		bounds: {
			min: aspectRatio > 1 ? [-radius * aspectRatio, -radius] : [-radius, -radius / aspectRatio],
			max: aspectRatio > 1 ? [radius * aspectRatio, radius] : [radius, radius / aspectRatio],
		},
		cReal: -0.8,
		cImaginary: 0.16,
		maxIters: 150,
		reset: onResize,
		savePNG: savePNG,
	};
	const MAX_ITERS_MAX = 500;
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
			uniform int u_maxIters;
			uniform float u_cReal;
			uniform float u_cImaginary;

			out float out_fragColor;

			void main() {
				// https://en.wikipedia.org/wiki/Julia_set#Pseudocode
				vec2 z = v_uv * u_boundsMax + (1.0 - v_uv) * u_boundsMin;
				int value = 0;
				float radius = (max(u_boundsMax.x - u_boundsMin.x, u_boundsMax.y - u_boundsMin.y)) / 2.0;
				for (int i = 0; i < ${MAX_ITERS_MAX}; i++) {
					// We can't use u_maxIters as loop length directly in GLSL1.
					// See https://github.com/amandaghassaei/gpu-io/blob/main/docs/GLSL1_Support.md
					if (i == u_maxIters) break;
					if (z.x * z.x + z.y * z.y > radius * radius) break;
					float xTemp = z.x * z.x - z.y * z.y;
					z.y = 2.0 * z.x * z.y + u_cImaginary;
					z.x = xTemp + u_cReal;
					value += 1;
				}
				out_fragColor = float(value) / float(u_maxIters);
			}`,
		uniforms: [
			{
				name: 'u_boundsMin',
				value: PARAMS.bounds.min,
				type: FLOAT,
			},
			{
				name: 'u_boundsMax',
				value: PARAMS.bounds.max,
				type: FLOAT,
			},
			{
				name: 'u_maxIters',
				value: PARAMS.maxIters,
				type: INT,
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
	gui.add(PARAMS, 'cReal', -2, 2, 0.01).onChange((val) => {
		fractalCompute.setUniform('u_cReal', val);
		needsCompute = true;
	});
	gui.add(PARAMS, 'cImaginary', -2, 2, 0.01).onChange((val) => {
		fractalCompute.setUniform('u_cImaginary', val);
		needsCompute = true;
	});
	gui.add(PARAMS, 'maxIters', 1, MAX_ITERS_MAX, 1).onChange((val) => {
		fractalCompute.setUniform('u_maxIters', val);
		needsCompute = true;
	});
	gui.add(PARAMS, 'reset').name('Reset');
	gui.add(PARAMS, 'savePNG').name('Save PNG (p)');

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

		aspectRatio = width / height;
		const lastWidth = composer.width;
		const lastHeight = composer.height;
		// TODO: resize at same aspect ratio.

		// Resize composer.
		composer.resize(width, height);
		// Resize state.
		state.resize([width, height]);
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
	}

	return {
		loop,
		dispose,
		composer,
		canvas,
	};
}