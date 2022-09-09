// Main is called from ../common/wrapper.js
function main({ gui, contextID, glslVersion}) {
	const {
		GPUComposer,
		GPUProgram,
		GPULayer,
		BYTE,
		INT,
		UINT,
		FLOAT,
		REPEAT,
		renderSignedAmplitudeProgram,
		setValueProgram,
		copyProgram,
		PRECISION_LOW_P,
	} = GPUIO;

	const PARAMS = {
		reset: onResize,
		savePNG: savePNG,
	}

	const canvas = document.createElement('canvas');
	document.body.appendChild(canvas);

	const composer = new GPUComposer({ canvas, contextID, glslVersion });

	const electricField = new GPULayer(composer, {
		name: 'electricField',
		dimensions: [canvas.width, canvas.height],
		type: FLOAT,
		numComponents: 1,
		numBuffers: 2,
		writable: true,
	});
	const magneticField = new GPULayer(composer, {
		name: 'magneticField',
		dimensions: [canvas.width, canvas.height],
		type: FLOAT,
		numComponents: 2,
		numBuffers: 2,
		writable: true,
	});
	const applySource = setValueProgram({
		name: 'applySource',
		composer,
		type: electricField.type,
		numComponents: electricField.numComponents,
	});
	const render = renderSignedAmplitudeProgram({
		name: 'render',
		composer,
		type: electricField.type,
		numComponents: electricField.numComponents,
	});

	let t = 0;

	// Render loop.
	function loop() {
		// Render point source.
		applySource.setUniform('u_value', Math.sin(t / 10));
		composer.stepCircle({
			position: [canvas.width / 2, canvas.height / 2],
			diameter: 10,
			program: applySource,
			output: electricField,
		});

		// Render to screen.
		composer.step({
			program: render,
			input: electricField,
		});

		t++;
	}


	// Touch events.
	const activeTouches = {};
	function onPointerMove(e) {
		if (activeTouches[e.pointerId]) {
			// composer.stepCircle({
			// 	program: touch,
			// 	input: noise,
			// 	output: state,
			// 	position: [e.clientX, canvas.height - e.clientY],
			// 	diameter: 30,
			// });
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
	const resetButton = gui.add(PARAMS, 'reset').name('Reset');
	const saveButton = gui.add(PARAMS, 'savePNG').name('Save PNG (p)');

	// Add 'p' hotkey to print screen.
	function savePNG() {
		composer.step({
			program: render,
			input: electricField,
		});
		composer.savePNG({ filename: 'fdtd' });
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
		electricField.dispose();
		magneticField.dispose();
		applySource.dispose();
		render.dispose();
		composer.dispose();
		gui.remove(resetButton);
		gui.remove(saveButton);
	}

	return {
		loop,
		dispose,
		composer,
		canvas,
	};
}