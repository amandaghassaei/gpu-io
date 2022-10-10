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

	// Calc initial bounds, which scale the entire fractal to fit inside the current window.
	function calcInitialBounds() {
		const aspectRatio = window.innerWidth / window.innerHeight;
		return {
			min: aspectRatio > 1 ? [-RADIUS * aspectRatio, -RADIUS] : [-RADIUS, -RADIUS / aspectRatio],
			max: aspectRatio > 1 ? [RADIUS * aspectRatio, RADIUS] : [RADIUS, RADIUS / aspectRatio],
		};
	}
	let bounds = calcInitialBounds();

	const PARAMS = {
		cReal: -0.8,
		cImaginary: 0.16,
		maxIters: 150,
		reset,
		savePNG,
		pngScaleFactor: 10,
	};
	// Flag to trigger recompute.
	let needsCompute = true;

	const canvas = document.createElement('canvas');
	document.body.appendChild(canvas);

	const composer = new GPUComposer({ canvas, contextID, glslVersion });
	const state = new GPULayer(composer, {
		name: 'state',
		dimensions: [canvas.width, canvas.height],
		type: FLOAT,
		numComponents: 1,
	});
	const fractalCompute = new GPUProgram(composer, {
		name: 'fractalCompute',
		fragmentShader: `
			// Sub-sampling for anti-aliasing.
			#define SUBSAMPLE_RES 2.0

			in vec2 v_uv;

			uniform vec2 u_boundsMin;
			uniform vec2 u_boundsMax;
			uniform float u_cReal;
			uniform float u_cImaginary;
			uniform float u_radius;
			uniform vec2 u_pxSize;

			out float out_value;

			void main() {
				// https://en.wikipedia.org/wiki/Julia_set#Pseudocode
				int value = 0;
				for (float u = 0.0; u < SUBSAMPLE_RES; u++) {
					for (float v = 0.0; v < SUBSAMPLE_RES; v++) {
						vec2 uvOffset = vec2(u, v) / (SUBSAMPLE_RES + 1.0) + 0.5;
						vec2 uv = v_uv + uvOffset * u_pxSize;
						vec2 z = uv * u_boundsMax + (1.0 - uv) * u_boundsMin;
						for (int i = 0; i < MAX_ITERS; i++) {
							if (z.x * z.x + z.y * z.y > u_radius * u_radius) break;
							float xTemp = z.x * z.x - z.y * z.y;
							z.y = 2.0 * z.x * z.y + u_cImaginary;
							z.x = xTemp + u_cReal;
							value += 1;
						}
					}
				}
				out_value = (float(value) / (SUBSAMPLE_RES * SUBSAMPLE_RES)) / float(MAX_ITERS);
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
			{
				name: 'u_radius',
				value: Math.max(bounds.max[0] - bounds.min[0], bounds.max[1] - bounds.min[1]) / 2,
				type: FLOAT,
			},
			{
				name: 'u_pxSize',
				value: [1 / canvas.width, 1 / canvas.height],
				type: FLOAT,
			},
		],
		// Use compile-time variables to set loop parameter so this will work in WebGL1 as well.
		// See https://github.com/amandaghassaei/gpu-io/blob/main/docs/GLSL1_Support.md#other-glsl1-gotchas
		compileTimeConstants: { MAX_ITERS: `${PARAMS.maxIters}` },
	});
	const fractalRender = renderAmplitudeProgram(composer, {
		name: 'render',
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
		// reset();
	}).name('C Real'));
	ui.push(gui.add(PARAMS, 'cImaginary', -2, 2, 0.01).onChange((val) => {
		fractalCompute.setUniform('u_cImaginary', val);
		needsCompute = true;
		// reset();
	}).name('C Imaginary'));
	ui.push(gui.add(PARAMS, 'maxIters', 1, 1000, 1).onChange((val) => {
		// Use compile-time variables to set loop parameter.
		// See https://github.com/amandaghassaei/gpu-io/blob/main/docs/GLSL1_Support.md#other-glsl1-gotchas
		fractalCompute.recompile({ MAX_ITERS: `${val}` });
		needsCompute = true;
	}).name('Max Iters'));
	ui.push(gui.add(PARAMS, 'reset').name('Reset'));
	const pngScaleFactorUI = gui.add(PARAMS, 'pngScaleFactor', 1, 20, 1).name('PNG Scale Factor');
	ui.push(pngScaleFactorUI);
	ui.push(gui.add(PARAMS, 'savePNG').name('Save HD PNG (p)'));

	function savePNG() {
		// Save an HD png.
		const scaleFactor = PARAMS.pngScaleFactor;
		const width = window.innerWidth;
		const height = window.innerHeight;
		state.resize([scaleFactor * width, scaleFactor * height]);
		fractalCompute.setUniform('u_pxSize', [1 / (scaleFactor * width), 1 / (scaleFactor * height)]);
		composer.step({
			program: fractalCompute,
			output: state,
		});
		state.savePNG({ filename: `julia-set_${PARAMS.cReal}_${PARAMS.cImaginary}i`, dpi: 600 });
		state.resize([width, height]);
		fractalCompute.setUniform('u_pxSize', [1 / width, 1 / height]);
		needsCompute = true;
	}
	// Add 'p' hotkey to print screen.
	window.addEventListener('keydown', onKeydown);
	function onKeydown(e) {
		if (e.key === 'p') {
			savePNG();
		}
	}

	function reset() {
		bounds = calcInitialBounds();
		fractalCompute.setUniform('u_boundsMin', bounds.min);
		fractalCompute.setUniform('u_boundsMax', bounds.max);
		needsCompute = true;
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
		// Update uniforms.
		fractalCompute.setUniform('u_pxSize', [1 / width, 1 / height]);
		// Reset bounds and recompute.
		reset();

		// Check the max texture size and set an upper bound to the PNG export.
		// Subtract 1 from the abs max value to create headroom bc there have been buffer allocation issues.
		const maxPNGScale = Math.floor(composer.gl.getParameter(composer.gl.MAX_TEXTURE_SIZE) / Math.max(width, height)) - 1;
		pngScaleFactorUI.max(maxPNGScale);
		if (PARAMS.pngScaleFactor > maxPNGScale) PARAMS.pngScaleFactor = maxPNGScale;
		pngScaleFactorUI.updateDisplay();
	}
	onResize();

	// Touch events.
	const activeTouches = {};
	let pinchPan;

	function onPinchZoom(e) {
		if (e.preventDefault) e.preventDefault();
		// Calculate new bounds.
		const factor = e.ctrlKey ? 0.005 : 0.001;
		let [ minX, minY ] = bounds.min;
		let [ maxX, maxY ] = bounds.max;
		let scaleX = maxY - minY;
		let scaleY = maxX - minX;
		const fractionF = (canvas.height - e.clientY) / canvas.height;
		const fractionK = e.clientX / canvas.width;
		const centerF = fractionF * scaleX + minY;
		const centerK = fractionK * scaleY + minX;
		const scale = 1.0 + e.deltaY * factor;
		const scaleLimit = 1e-4;
		if (Math.min(scaleX * scale, scaleY * scale) < scaleLimit) return;
		scaleX = scaleX * scale;
		scaleY = scaleY * scale;
		bounds.min[1] = centerF - scaleX * fractionF;
		bounds.max[1] = centerF + scaleX * (1 - fractionF);
		bounds.min[0] = centerK - scaleY * fractionK;
		bounds.max[0] = centerK + scaleY * (1 - fractionK);
		fractalCompute.setUniform('u_boundsMin', bounds.min);
		fractalCompute.setUniform('u_boundsMax', bounds.max);
		needsCompute = true;
	}
	window.addEventListener('wheel', onPinchZoom, {
		"passive": false
	});

	function onPan(e) {
		const { deltaX, deltaY } = e;
		const [ minX, minY ] = bounds.min;
		const [ maxX, maxY ] = bounds.max;
		const scaleX = maxY - minY;
		const scaleY = maxX - minX;
		const scaledDeltaX = deltaX / canvas.width;
		const scaledDeltaY = -deltaY / canvas.height;
		bounds.min[1] -= scaleX * scaledDeltaY;
		bounds.max[1] -= scaleX * scaledDeltaY;
		bounds.min[0] -= scaleY * scaledDeltaX;
		bounds.max[0] -= scaleY * scaledDeltaX;
		fractalCompute.setUniform('u_boundsMin', bounds.min);
		fractalCompute.setUniform('u_boundsMax', bounds.max);
		needsCompute = true;
	}

	function getAvgAndDeltaBetweenPoints(id1, id2) {
		const diffX = activeTouches[id1][0] - activeTouches[id2][0];
		const diffY = activeTouches[id1][1] - activeTouches[id2][1];
		const delta = Math.sqrt(diffX * diffX + diffY * diffY);
		const avg = [
			(activeTouches[id1][0] + activeTouches[id2][0]) / 2,
			(activeTouches[id1][1] + activeTouches[id2][1]) / 2,
		];
		return { avg, delta };
	}
	function onPointerMove(e) {
		if (!activeTouches[e.pointerId]) return;
		e.preventDefault();
		const pointers = Object.keys(activeTouches);
		if (pointers.length === 1) {
			if (e.which === 3 || e.button === 2 || e.buttons === 2) {
				onPan({
					deltaX: e.clientX - activeTouches[e.pointerId][0],
					deltaY: e.clientY - activeTouches[e.pointerId][1],
				});
			}
			activeTouches[e.pointerId] = [e.clientX, e.clientY];
		} else if (pinchPan && pointers.length === 2) {
			const { id1, id2, lastDelta, lastAvg } = pinchPan;
			activeTouches[e.pointerId] = [e.clientX, e.clientY];
			const { delta, avg } = getAvgAndDeltaBetweenPoints(id1, id2);
			onPinchZoom({
				pointerId: e.pointerId,
				clientX: avg[0],
				clientY: avg[1],
				deltaY: lastDelta - delta,
				ctrlKey: true,
			});
			onPan({
				pointerId: e.pointerId,
				deltaX: avg[0] - lastAvg[0],
				deltaY: avg[1] - lastAvg[1],
			});
			pinchPan.lastDelta = delta;
			pinchPan.lastAvg = avg;
		}
	}
	function onPointerStop(e) {
		delete activeTouches[e.pointerId];
	}
	function onPointerStart(e) {
		e.preventDefault();
		activeTouches[e.pointerId] = [e.clientX, e.clientY];
		const pointers = Object.keys(activeTouches);
		if (pointers.length === 2) {
			pinchPan = {};
			pinchPan.id1 = pointers[0];
			pinchPan.id2 = pointers[1];
			const { delta, avg } = getAvgAndDeltaBetweenPoints(pointers[0], pointers[1]);
			pinchPan.lastDelta = delta;
			pinchPan.lastAvg = avg;
		}
		if (pointers.length > 2) {
			pinchPan = undefined;
		}
	}
	function onContextMenu(e) {
		e.preventDefault();
		return false;
	}
	canvas.addEventListener('pointermove', onPointerMove);
	canvas.addEventListener('pointerdown', onPointerStart);
	canvas.addEventListener('pointerup', onPointerStop);
	canvas.addEventListener('pointerout', onPointerStop);
	canvas.addEventListener('pointercancel', onPointerStop);
	canvas.addEventListener('contextmenu', onContextMenu);


	function dispose() {
		document.body.removeChild(canvas);
		window.removeEventListener('keydown', onKeydown);
		window.removeEventListener('resize', onResize);
		canvas.removeEventListener('pointermove', onPointerMove);
		canvas.removeEventListener('pointerdown', onPointerStart);
		canvas.removeEventListener('pointerup', onPointerStop);
		canvas.removeEventListener('pointerout', onPointerStop);
		canvas.removeEventListener('pointercancel', onPointerStop);
		canvas.removeEventListener('contextmenu', onContextMenu);
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