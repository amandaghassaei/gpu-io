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
		setColorProgram,
		setValueProgram,
	} = GPUIO;

	const DIFFUSION_A_DEFAULT = 0.2097;
	const DIFFUSION_B_DEFAULT = 0.105;
	const PARAMS = {
		diffusionA: DIFFUSION_A_DEFAULT,
		diffusionB: DIFFUSION_B_DEFAULT,
		renderLayer: 'Chemical B',
		feedRateMin: 0.016,
		feedRateMax: 0.044,
		killRateMin: 0.05,
		killRateMax: 0.066,
		reset: onResize,
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
			uniform vec2 u_killRateBounds;
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
				float killRate = mix(u_killRateBounds.x, u_killRateBounds.y, v_uv.x);
				float feedRate = mix(u_feedRateBounds.x, u_feedRateBounds.y, v_uv.y);
				out_state = clamp(state + vec2(
					u_diffusionA * laplacian.x - reaction + feedRate * (1.0 - state.x),
					u_diffusionB * laplacian.y + reaction - (killRate + feedRate) * state.y
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
				name: 'u_killRateBounds',
				value: [PARAMS.killRateMin, PARAMS.killRateMax],
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

	const initialize = new GPUProgram(composer, {
		name: 'initialize',
		fragmentShader: `
		in vec2 v_uv;
		uniform vec2 u_pxSize;
		out vec2 out_state;
		void main() {
			// Init a checkerboard pattern.
			vec2 scale = 20.0 * u_pxSize;
			vec2 subPosition = abs(mod(v_uv, scale) / scale - vec2(0.5));
			float mask = 0.0;
			if (dot(subPosition, subPosition) < 0.05) mask = 1.0;
			out_state = vec2(1.0, 0.5 * mask);
		}
		`,
		uniforms: [
			{
				name: 'u_pxSize',
				value: [SIM_SCALE / canvas.width, SIM_SCALE / canvas.height],
				type: FLOAT,
			},
		],
	});

	const renderA = renderAmplitudeProgram({
		name: 'renderA',
		composer,
		type: state.type,
		scale: 1,
		components: 'x',
	});
	const renderB = renderAmplitudeProgram({
		name: 'renderB',
		composer,
		type: state.type,
		scale: 3,
		components: 'y',
	});
	const selection = setColorProgram({
		composer,
		type: state.type,
		color: [0, 0, 1],
		opacity: 0.5,
		name: 'selection',
	});

	// Touch/hover events.
	const selectionRect = {
		min: [0, 0],
		max: [0, 0],
	};
	let activeTouches = {};

	// Render loop.
	function loop() {
		for (let i = 0; i < 10; i++) {
			composer.step({
				program: rxnDiffusion,
				input: state,
				output: state,
			});
		}
		// If no output, will draw to screen.
		composer.step({
			program: PARAMS.renderLayer === 'Chemical A' ? renderA : renderB,
			input: state,
		});
		if (Object.keys(activeTouches).length) {
			// Draw a selection rectangle on top of vis.
			composer.stepRect({
				program: selection,
				position: selectionRect.min,
				size: [selectionRect.max[0] - selectionRect.min[0], selectionRect.max[1] - selectionRect.min[1]],
				blendAlpha: true,
			});
		}
	}

	// During hover, set chemical values to 0.5, 0.5.
	const hover = setValueProgram({
		name: 'hover',
		composer,
		type: state.type,
		value: [0.5, 0.5],
	});

	
	function onPointerMove(e) {
		if (activeTouches[e.pointerId]) {
			if (e.pointerId === selectionRect.id) {
				selectionRect.min[0] = Math.min(selectionRect.start[0], e.clientX);
				selectionRect.min[1] = Math.min(selectionRect.start[1], canvas.height - e.clientY);
				selectionRect.max[0] = Math.max(selectionRect.start[0], e.clientX);
				selectionRect.max[1] = Math.max(selectionRect.start[1], canvas.height - e.clientY);
			}
		} else {
			// For hover events.
			composer.stepCircle({
				program: hover,
				output: state,
				position: [e.clientX, canvas.height - e.clientY],
				diameter: 30,
			});
		}
	}
	function onPointerUp(e) {
		if (e.pointerId === selectionRect.id) {
			// Calculate a new bounds on feedRate and killRate.
			PARAMS.killRateMin = selectionRect.min[0] / canvas.width * (PARAMS.killRateMax - PARAMS.killRateMin) + PARAMS.killRateMin;
			PARAMS.killRateMax = selectionRect.max[0] / canvas.width * (PARAMS.killRateMax - PARAMS.killRateMin) + PARAMS.killRateMin;
			rxnDiffusion.setUniform('u_killRateBounds', [PARAMS.killRateMin, PARAMS.killRateMax]);
			PARAMS.feedRateMin = selectionRect.min[1] / canvas.height * (PARAMS.feedRateMax - PARAMS.feedRateMin) + PARAMS.feedRateMin;
			PARAMS.feedRateMax = selectionRect.max[1] / canvas.height * (PARAMS.feedRateMax - PARAMS.feedRateMin) + PARAMS.feedRateMin;
			rxnDiffusion.setUniform('u_feedRateBounds', [PARAMS.feedRateMin, PARAMS.feedRateMax]);
			updateGUI();
		}
		onPointerStop(e);
	}
	function onPointerStop(e) {
		delete activeTouches[e.pointerId];
	}
	function onPointerStart(e) {
		if (Object.keys(activeTouches).length === 0) {
			selectionRect.start = [e.clientX, canvas.height - e.clientY];
			selectionRect.min = selectionRect.start.slice();
			selectionRect.max = selectionRect.start.slice();
			selectionRect.id = e.pointerId;
		}
		activeTouches[e.pointerId] = true;
	}
	canvas.addEventListener('pointermove', onPointerMove);
	canvas.addEventListener('pointerdown', onPointerStart);
	canvas.addEventListener('pointerup', onPointerUp);
	canvas.addEventListener('pointerout', onPointerStop);
	canvas.addEventListener('pointercancel', onPointerStop);

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
		if (e.key === 'Escape') {
			activeTouches = {};
			selectionRect.id = '';
		}
	}

	// Resize if needed.
	window.addEventListener('resize', onResize);
	function onResize() {
		const width = window.innerWidth;
		const height = window.innerHeight;

		// Resize composer.
		composer.resize(width, height);

		// Update px size uniform.
		rxnDiffusion.setUniform('u_pxSize', [SIM_SCALE / width, SIM_SCALE / height]);
		initialize.setUniform('u_pxSize', [SIM_SCALE / width, SIM_SCALE / height]);

		// Resize state.
		state.resize([Math.round(width / SIM_SCALE), Math.round(height / SIM_SCALE)]);
		composer.step({
			program: initialize,
			output: state,
		});

		zoomOut();
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
	ui.push(gui.add(PARAMS, 'renderLayer', ['Chemical A', 'Chemical B']).name('Render Layer'));
	const range = gui.addFolder('Parameter Ranges');
	range.add(PARAMS, 'feedRateMin', 0, 0.1, 0.001).name('Feed Rate Min').onChange(() => {
		rxnDiffusion.setUniform('u_feedRateBounds', [PARAMS.feedRateMin, PARAMS.feedRateMax]);
	});
	range.add(PARAMS, 'feedRateMax', 0, 0.1, 0.001).name('Feed Rate Max').onChange(() => {
		rxnDiffusion.setUniform('u_feedRateBounds', [PARAMS.feedRateMin, PARAMS.feedRateMax]);
	});
	range.add(PARAMS, 'killRateMin', 0, 0.1, 0.001).name('Kill Rate Min').onChange(() => {
		rxnDiffusion.setUniform('u_killRateBounds', [PARAMS.killRateMin, PARAMS.killRateMax]);
	});
	range.add(PARAMS, 'killRateMax', 0, 0.1, 0.001).name('Kill Rate Max').onChange(() => {
		rxnDiffusion.setUniform('u_killRateBounds', [PARAMS.killRateMin, PARAMS.killRateMax]);
	});
	range.open();
	ui.push(gui.add(PARAMS, 'reset').name('Reset'));
	ui.push(gui.add(PARAMS, 'savePNG').name('Save PNG (p)'));

	function zoomOut() {
		PARAMS.feedRateMin = 0.016;
		PARAMS.feedRateMax = 0.044;
		rxnDiffusion.setUniform('u_feedRateBounds', [PARAMS.feedRateMin, PARAMS.feedRateMax]);
		PARAMS.killRateMin = 0.05;
		PARAMS.killRateMax = 0.066;
		rxnDiffusion.setUniform('u_killRateBounds', [PARAMS.killRateMin, PARAMS.killRateMax]);
		updateGUI();
	}

	function updateGUI() {
		for (let i in range.__controllers) {
			range.__controllers[i].updateDisplay();
		}
	}

	// TouchEmulator();
	// // Pinch/scroll to zoom
	// const hammer = new Hammer(document.body);
	// hammer.get('pinch').set({ enable: true });
	// hammer.on('pinch', (ev) => {
	// 	console.log(ev);
	// });
	// hammer.on('pinchstart', (ev) => {
	// 	console.log(ev);
	// });

	window.addEventListener('wheelstart', (e) => {
		console.log(start, e);
	});
	window.addEventListener('wheel', (e) => {
		let scaleF = PARAMS.feedRateMax - PARAMS.feedRateMin;
		let scaleK = PARAMS.killRateMax - PARAMS.killRateMin;
		const fractionF = (canvas.height - e.clientY) / canvas.height;
		const fractionK = e.clientX / canvas.width;
		const centerF = fractionF * scaleF + PARAMS.feedRateMin;
		const centerK = fractionK * scaleK + PARAMS.killRateMin;
		scaleF *= 1.0 + e.deltaY * 0.001;
		scaleK *= 1.0 + e.deltaY * 0.001;
		PARAMS.feedRateMin = centerF - scaleF * fractionF;
		PARAMS.feedRateMax = centerF + scaleF * (1 - fractionF);
		PARAMS.killRateMin = centerK - scaleK * fractionK;
		PARAMS.killRateMax = centerK + scaleK * (1 - fractionK);
		rxnDiffusion.setUniform('u_feedRateBounds', [PARAMS.feedRateMin, PARAMS.feedRateMax]);
		rxnDiffusion.setUniform('u_killRateBounds', [PARAMS.killRateMin, PARAMS.killRateMax]);
		updateGUI();
	});

	onResize();

	function dispose() {
		document.body.removeChild(canvas);
		window.removeEventListener('keydown', onKeydown);
		window.removeEventListener('resize', onResize);
		canvas.removeEventListener('pointermove', onPointerMove);
		canvas.removeEventListener('pointerdown', onPointerStart);
		canvas.removeEventListener('pointerup', onPointerStop);
		canvas.removeEventListener('pointerout', onPointerStop);
		canvas.removeEventListener('pointercancel', onPointerStop);
		rxnDiffusion.dispose();
		initialize.dispose();
		renderA.dispose();
		renderB.dispose();
		hover.dispose();
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