// Main is called from ../common/wrapper.js
function main({ gui, contextID, glslVersion}) {
	const {
		GPUComposer,
		GPUProgram,
		GPULayer,
		FLOAT,
		REPEAT,
		renderAmplitudeProgram,
		copyProgram,
	} = GPUIO;

	const PARAMS = {
		reset: reset,
		savePNG: savePNG,
	}
	const TEXTURE_DIM = [100, 100];

	const canvas = document.createElement('canvas');
	document.body.appendChild(canvas);

	const composer = new GPUComposer({ canvas, contextID, glslVersion });
	composer.resize(TEXTURE_DIM);

	const uv = new GPULayer(composer, {
		name: 'uv_state',
		dimensions: TEXTURE_DIM,
		numComponents: 2,
		type: FLOAT,
		numBuffers: 2,
		wrapX: REPEAT,
		wrapY: REPEAT,
	});

	const renderU = renderAmplitudeProgram({
		name: 'renderU',
		composer,
		type: uv.type,
		components: 'x', // Render the u component of uv state.
	});

	// Render loop.
	function loop() {
		// composer.step({
		// 	program: golRules,
		// 	input: state,
		// 	output: state,
		// });
		// If no output, will draw to screen.
		composer.step({
			program: render,
			input: uv,
		});
	}

	// noise is used for touch interactions.
	const noise = new GPULayer(composer, {
		name: 'noise',
		dimensions: TEXTURE_DIM,
		numComponents: 2,
		type: FLOAT,
		numBuffers: 1,
		wrapX: REPEAT,
		wrapY: REPEAT,
	});
	// During touch, copy data from noise over to state.
	const touch = copyProgram({
		name: 'touch',
		composer,
		type: noise.type,
	});

	// Touch events.
	const activeTouches = {};
	function onPointerMove(e) {
		if (activeTouches[e.pointerId]) {
			composer.stepCircle({
				program: touch,
				input: noise,
				output: uv,
				position: [e.clientX, canvas.height - e.clientY],
				diameter: 30,
			});
		}
	}
	function onPointerStop(e) {
		delete activeTouches[e.pointerId];
	}
	function onPointerStart(e) {
		activeTouches[e.pointerId] = true;
	}
	canvas.addEventListener('pointermove', onPointerMove);
	canvas.addEventListener('pointerdown', onPointerStart);
	canvas.addEventListener('pointerup', onPointerStop);
	canvas.addEventListener('pointerout', onPointerStop);
	canvas.addEventListener('pointercancel', onPointerStop);

	// Init simple GUI.
	const ui = [];
	ui.push(gui.add(PARAMS, 'reset').name('Reset'));
	ui.push(gui.add(PARAMS, 'savePNG').name('Save Texture PNG (p)'));

	// Add 'p' hotkey to print screen.
	function savePNG() {
		composer.step({
			program: render,
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

	function reset() {
		const noiseArray = new Float32Array(TEXTURE_DIM[0] * TEXTURE_DIM[1] * 2);
		for (let i = 0; i < noiseArray.length / 2; i++) {
			rgba[2 * i] = 0.5 + Math.random() * 0.02 - 0.01;
			rgba[2 * i + 1] = 0.25 + Math.random() * 0.02 - 0.01;
		}
		noiseArray.setFromArray(noiseArray);
		uv.setFromArray(noiseArray);
	}
	reset();

	// Resize if needed.
	window.addEventListener('resize', onResize);
	function onResize() {
		const width = window.innerWidth;
		const height = window.innerHeight;
	}
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
		golRules.dispose();
		golRender.dispose();
		touch.dispose();
		state.dispose();
		composer.dispose();
		gui.removeFolder(survival);
		gui.removeFolder(birth);
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