// Main is called from ../common/wrapper.js
function main({ gui, contextID, glslVersion}) {
	const {
		GPUComposer,
		GPUProgram,
		GPULayer,
		FLOAT,
		INT,
		CLAMP_TO_EDGE,
		LINEAR,
		renderAmplitudeProgram,
		setValueProgram,
	} = GPUIO;

	const PARAMS = {
		diffusionA: 0.2097,
		diffusionB: 0.105,
		renderLayer: 'Chemical B',
		feedRateMin: 0.016,
		feedRateMax: 0.044,
		removalRateMin: 0.05,
		removalRateMax: 0.066,
		reset: reset,
		savePNG: savePNG,
	}

	const canvas = document.createElement('canvas');
	document.body.appendChild(canvas);

	const composer = new GPUComposer({ canvas, contextID, glslVersion });
	const SIM_SCALE = 1.5; // Run sim at a lower scale.

	const state = new GPULayer(composer, {
		name: 'state',
		dimensions: [Math.round(canvas.width / SIM_SCALE), Math.round(canvas.height / SIM_SCALE)],
		numComponents: 2,
		type: FLOAT,
		filter: LINEAR,
		numBuffers: 2,
		wrapX: CLAMP_TO_EDGE,
		wrapY: CLAMP_TO_EDGE,
	});

	const rxnDiffusion = new GPUProgram(composer, {
		name: 'rxnDiffusion',
		fragmentShader: `
			in vec2 v_uv;

			uniform sampler2D u_state;
			uniform vec2 u_pxSize;
			uniform vec2 u_feedRateBounds;
			uniform vec2 u_removalRateBounds;
			uniform float u_diffusionA;
			uniform float u_diffusionB;

			out vec2 out_state;

			void main() {
				// Calculate the laplacian of u_state.
				vec2 state = texture(u_state, v_uv).xy;
				vec2 n = texture(u_state, v_uv + vec2(u_pxSize.x, 0)).xy;
				vec2 s = texture(u_state, v_uv + vec2(-u_pxSize.x, 0)).xy;
				vec2 e = texture(u_state, v_uv + vec2(0, u_pxSize.y)).xy;
				vec2 w = texture(u_state, v_uv + vec2(0, -u_pxSize.y)).xy;
				vec2 laplacian = (n + s + e + w) - 4.0 * state;

				float reaction = state.x * state.y * state.y;
				float removalRate = mix(u_removalRateBounds.x, u_removalRateBounds.y, v_uv.x);
				float feedRate = mix(u_feedRateBounds.x, u_feedRateBounds.y, v_uv.y);
				out_state = clamp(state + vec2(
					u_diffusionA * laplacian.x - reaction + feedRate * (1.0 - state.x),
					u_diffusionB * laplacian.y + reaction - (removalRate + feedRate) * state.y
				), 0.0, 1.0);
			}
		`,
		uniforms: [
			{ // Index of state GPULayer in "input" array.
				name: 'u_state',
				value: 0, // We don't even really need to set this uniform, bc all uniforms default to zero.
				type: INT,
			},
			{
				name: 'u_pxSize',
				value: [SIM_SCALE / canvas.width, SIM_SCALE / canvas.height],
				type: FLOAT,
			},
			{
				name: 'u_feedRateBounds',
				value: [PARAMS.feedRateMin, PARAMS.feedRateMax],
				type: FLOAT,
			},
			{
				name: 'u_removalRateBounds',
				value: [PARAMS.removalRateMin, PARAMS.removalRateMax],
				type: FLOAT,
			},
			{
				name: 'u_diffusionA',
				value: PARAMS.diffusionA,
				type: FLOAT,
			},
			{
				name: 'u_diffusionB',
				value: PARAMS.diffusionB,
				type: FLOAT,
			},
		]
	});

	const renderA = renderAmplitudeProgram({
		name: 'renderA',
		composer,
		type: state.type,
		scale: 1,
		components: 'x', // Chemical A is stored in x component of state.
	});

	const renderB = renderAmplitudeProgram({
		name: 'renderB',
		composer,
		type: state.type,
		scale: 3,
		components: 'y', // Chemical B is stored in y component of state.
	});

	// Render loop.
	function loop() {
		for (let i = 0; i < 10; i++) {
			composer.step({
				program: rxnDiffusion,
				input: state,
				output: state,
			});
		}
		// No "output" will draw to screen.
		composer.step({
			program: PARAMS.renderLayer === 'Chemical A' ? renderA : renderB,
			input: state,
		});
	}

	// Add 'p' hotkey to print screen.
	function savePNG() {
		composer.step({
			program: PARAMS.renderLayer === 'Chemical A' ? renderA : renderB,
			input: state,
		});
		composer.savePNG({ filename: `reaction_diffusion` });
	}
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

		// Resize state with random initial values.
		const initialState = new Float32Array(Math.round(width / SIM_SCALE) * Math.round(height / SIM_SCALE) * 2);
		for (let i = 0; i < initialState.length / 2; i++) {
			initialState[2 * i] = 0.5 + Math.random() * 0.5;
			initialState[2 * i + 1] = 0.5 + Math.random() * 0.5;
		}
		state.resize([Math.round(width / SIM_SCALE), Math.round(height / SIM_SCALE)], initialState);

		// Update px size uniform.
		rxnDiffusion.setUniform('u_pxSize', [SIM_SCALE / width, SIM_SCALE / height]);
	}
	onResize();

	function reset() {
		// Zoom back to original settings.
		PARAMS.feedRateMin = 0.016;
		PARAMS.feedRateMax = 0.044;
		rxnDiffusion.setUniform('u_feedRateBounds', [PARAMS.feedRateMin, PARAMS.feedRateMax]);
		PARAMS.removalRateMin = 0.05;
		PARAMS.removalRateMax = 0.066;
		rxnDiffusion.setUniform('u_removalRateBounds', [PARAMS.removalRateMin, PARAMS.removalRateMax]);
		updateGUI();
		onResize(); // Re-init state.
	}

	// Init simple GUI.
	const ui = [];
	const diffusion = gui.addFolder('Diffusion Rates');
	diffusion.add(PARAMS, 'diffusionA', 0.05, 0.22, 0.01).name('Diffusion A').onChange((val) => {
		rxnDiffusion.setUniform('u_diffusionA', val);
	});
	diffusion.add(PARAMS, 'diffusionB', 0.05, 0.2, 0.01).name('Diffusion B').onChange((val) => {
		rxnDiffusion.setUniform('u_diffusionB', val);
	});
	const range = gui.addFolder('Parameter Ranges');
	range.add(PARAMS, 'removalRateMin', 0, 0.1, 0.001).name('K Min').onChange(() => {
		rxnDiffusion.setUniform('u_removalRateBounds', [PARAMS.removalRateMin, PARAMS.removalRateMax]);
	});
	range.add(PARAMS, 'removalRateMax', 0, 0.1, 0.001).name('K Max').onChange(() => {
		rxnDiffusion.setUniform('u_removalRateBounds', [PARAMS.removalRateMin, PARAMS.removalRateMax]);
	});
	range.add(PARAMS, 'feedRateMin', 0, 0.1, 0.001).name('F Min').onChange(() => {
		rxnDiffusion.setUniform('u_feedRateBounds', [PARAMS.feedRateMin, PARAMS.feedRateMax]);
	});
	range.add(PARAMS, 'feedRateMax', 0, 0.1, 0.001).name('F Max').onChange(() => {
		rxnDiffusion.setUniform('u_feedRateBounds', [PARAMS.feedRateMin, PARAMS.feedRateMax]);
	});
	// range.open();
	ui.push(gui.add(PARAMS, 'renderLayer', ['Chemical A', 'Chemical B']).name('Render Layer'));
	ui.push(gui.add(PARAMS, 'reset').name('Reset'));
	ui.push(gui.add(PARAMS, 'savePNG').name('Save PNG (p)'));

	function updateGUI() {
		for (let i in range.__controllers) {
			range.__controllers[i].updateDisplay();
		}
	}

	const applyTransform = new GPUProgram(composer, {
		name: 'applyTransform',
		fragmentShader: `
		in vec2 v_uv;

		uniform sampler2D u_state;
		uniform vec2 u_offset;
		uniform float u_scale;

		out vec2 out_state;

		void main() {
			vec2 uv = u_offset + u_scale * v_uv;
			if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) out_state = vec2(0);
			else out_state = texture(u_state, uv).xy;
		}
		`,
		uniforms: [
			{ // Index of state GPULayer in "input" array.
				name: 'u_state',
				value: 0, // We don't even really need to set this uniform, bc all uniforms default to zero.
				type: INT,
			},
			{
				name: 'u_scale',
				value: 1,
				type: FLOAT,
			},
			{
				name: 'u_offset',
				value: [0, 0],
				type: FLOAT,
			},
		],
	});

	// Touch events.
	const activeTouches = {};
	let pinchPan;

	function onPinchZoom(e) {
		if (e.preventDefault) e.preventDefault();
		// Calculate new bounds for feed/removal rate.
		const factor = e.ctrlKey ? 0.005 : 0.001;
		let scaleF = PARAMS.feedRateMax - PARAMS.feedRateMin;
		let scaleK = PARAMS.removalRateMax - PARAMS.removalRateMin;
		const fractionF = (canvas.height - e.clientY) / canvas.height;
		const fractionK = e.clientX / canvas.width;
		const centerF = fractionF * scaleF + PARAMS.feedRateMin;
		const centerK = fractionK * scaleK + PARAMS.removalRateMin;
		const scale = 1.0 + e.deltaY * factor;
		const scaleLimit = 1e-6;
		scaleF = Math.max(scaleF * scale, scaleLimit);
		scaleK = Math.max(scaleK * scale, scaleLimit);
		PARAMS.feedRateMin = centerF - scaleF * fractionF;
		PARAMS.feedRateMax = centerF + scaleF * (1 - fractionF);
		PARAMS.removalRateMin = centerK - scaleK * fractionK;
		PARAMS.removalRateMax = centerK + scaleK * (1 - fractionK);
		rxnDiffusion.setUniform('u_feedRateBounds', [PARAMS.feedRateMin, PARAMS.feedRateMax]);
		rxnDiffusion.setUniform('u_removalRateBounds', [PARAMS.removalRateMin, PARAMS.removalRateMax]);
		applyTransform.setUniform('u_scale', scale);
		applyTransform.setUniform('u_offset', [(1 - scale) * fractionK, (1 - scale) * fractionF]);
		composer.step({
			program: applyTransform,
			input: state,
			output: state,
		});
		updateGUI();
	}
	window.addEventListener('wheel', onPinchZoom, {
		"passive": false
	});

	function onPan(e) {
		const { deltaX, deltaY } = e;
		const scaleF = PARAMS.feedRateMax - PARAMS.feedRateMin;
		const scaleK = PARAMS.removalRateMax - PARAMS.removalRateMin;
		const scaledDeltaX = deltaX / canvas.width;
		const scaledDeltaY = -deltaY / canvas.height;
		PARAMS.feedRateMin -= scaleF * scaledDeltaY;
		PARAMS.feedRateMax -= scaleF * scaledDeltaY;
		PARAMS.removalRateMin -= scaleK * scaledDeltaX;
		PARAMS.removalRateMax -= scaleK * scaledDeltaX;
		rxnDiffusion.setUniform('u_feedRateBounds', [PARAMS.feedRateMin, PARAMS.feedRateMax]);
		rxnDiffusion.setUniform('u_removalRateBounds', [PARAMS.removalRateMin, PARAMS.removalRateMax]);
		applyTransform.setUniform('u_scale', 1);
		applyTransform.setUniform('u_offset', [-scaledDeltaX, -scaledDeltaY]);
		composer.step({
			program: applyTransform,
			input: state,
			output: state,
		});
		updateGUI();
	}

	// During touch, set chemical values to 0.5, 0.5 within a small circle.
	const touch = setValueProgram({
		name: 'touch',
		composer,
		type: state.type,
		value: [0.5, 0.5],
	});
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
			} else {
				composer.stepCircle({
					program: touch,
					output: state,
					position: [e.clientX, canvas.height - e.clientY],
					diameter: 30,
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
		window.removeEventListener('wheel', onPinchZoom);
		canvas.removeEventListener('pointermove', onPointerMove);
		canvas.removeEventListener('pointerdown', onPointerStart);
		canvas.removeEventListener('pointerup', onPointerStop);
		canvas.removeEventListener('pointerout', onPointerStop);
		canvas.removeEventListener('pointercancel', onPointerStop);
		canvas.removeEventListener('contextmenu', onContextMenu);
		rxnDiffusion.dispose();
		renderA.dispose();
		renderB.dispose();
		touch.dispose();
		applyTransform.dispose();
		state.dispose();
		composer.dispose();
		gui.removeFolder(diffusion);
		gui.removeFolder(range);
		ui.forEach(el => {
			gui.remove(el);
		});
	}

	return {
		loop,
		dispose,
		composer,
		canvas,
	};
}