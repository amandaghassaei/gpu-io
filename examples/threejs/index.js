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
		composer.dispose();
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