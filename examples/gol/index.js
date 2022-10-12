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
		renderAmplitudeProgram,
		copyProgram,
		PRECISION_LOW_P,
	} = GPUIO;

	const PARAMS = {
		survivalRules: Number.parseInt('00000110', 2),
		s1: false,
		s2: true,
		s3: true,
		s4: false,
		s5: false,
		s6: false,
		s7: false,
		s8: false,
		birthRules: Number.parseInt('00000100', 2),
		b1: false,
		b2: false,
		b3: true,
		b4: false,
		b5: false,
		b6: false,
		b7: false,
		b8: false,
		seedRatio: 0.12,
		reset: onResize,
		savePNG: savePNG,
	}

	const canvas = document.createElement('canvas');
	document.body.appendChild(canvas);

	const composer = new GPUComposer({ canvas, contextID, glslVersion });
	const state = new GPULayer(composer, {
		name: 'state',
		dimensions: [canvas.width, canvas.height],
		numComponents: 1,
		type: BYTE,
		numBuffers: 2,// Use 2 buffers so we can toggle read/write from one to the other.
		wrapX: REPEAT,
		wrapY: REPEAT,
	});
	const golRules = new GPUProgram(composer, {
		name: 'golRules',
		fragmentShader: `
			in vec2 v_uv;

			uniform vec2 u_pxSize;
			uniform lowp isampler2D u_state;

			uniform lowp uint u_survivalRules;
			uniform lowp uint u_birthRules;

			out lowp int out_state;

			void main() {
				lowp int state = int(texture(u_state, v_uv).r);
				lowp int n = int(texture(u_state, v_uv + vec2(0, u_pxSize[1])).r);
				lowp int s = int(texture(u_state, v_uv + vec2(0, -u_pxSize[1])).r);
				lowp int e = int(texture(u_state, v_uv + vec2(u_pxSize[0], 0)).r);
				lowp int w = int(texture(u_state, v_uv + vec2(-u_pxSize[0], 0)).r);
				lowp int ne = int(texture(u_state, v_uv + vec2(u_pxSize[0], u_pxSize[1])).r);
				lowp int nw = int(texture(u_state, v_uv + vec2(-u_pxSize[0], u_pxSize[1])).r);
				lowp int se = int(texture(u_state, v_uv + vec2(u_pxSize[0], -u_pxSize[1])).r);
				lowp int sw = int(texture(u_state, v_uv + vec2(-u_pxSize[0], -u_pxSize[1])).r);
				lowp int numLiving = n + s + e + w + ne + nw + se + sw;
				
				// Using some tricks here to remove conditionals (they cause significant slowdowns).
				// Leaving the old code here for clarity, replaced by the lines below.
				// if (state == 0){
				// 	lowp uint mask = bitwiseAnd8(u_birthRules, uint(1 << (numLiving - 1)));
				// 	if (mask > uint(0)) {
				// 		state = 1;
				// 	}
				// } else {
				// 	lowp uint mask = bitwiseAnd8(u_survivalRules, uint(1 << (numLiving - 1)));
				// 	if (mask == uint(0)) {
				// 		state = 0;
				// 	}
				// }
				// The following lines give the same result without conditionals.
				// Using bitwiseAnd8() rather than & operator for GLSL1 support:
				// https://github.com/amandaghassaei/gpu-io/blob/main/docs/GLSL1_Support.md#operators
				lowp uint mask = bitwiseAnd8((u_survivalRules * uint(state) + u_birthRules * uint(1 - state)), uint(bitshiftLeft(1, numLiving - 1)));
				state = min(int(mask), 1);

				out_state = state;
			}`,
		uniforms: [
			{
				name: 'u_state',
				value: 0, // We don't even really need to set this, bc all uniforms default to zero.
				type: INT,
			},
			{
				name: 'u_pxSize',
				value: [1 / canvas.width, 1 / canvas.height],
				type: FLOAT,
			},
			{
				name: 'u_survivalRules',
				value: PARAMS.survivalRules,
				type: UINT,
			},
			{
				name: 'u_birthRules',
				value: PARAMS.birthRules,
				type: UINT,
			},
		],
	});
	const golRender = renderAmplitudeProgram(composer, {
		name: 'render',
		type: state.type,
		components: 'x',
		precision: PRECISION_LOW_P,
	});

	// Render loop.
	function loop() {
		composer.step({
			program: golRules,
			input: state,
			output: state,
		});
		// If no output, will draw to screen.
		composer.step({
			program: golRender,
			input: state,
		});
	}

	// noise is used for touch interactions.
	const noise = new GPULayer(composer, {
		name: 'noise',
		dimensions: [canvas.width, canvas.height],
		numComponents: 1,
		type: BYTE,
		numBuffers: 1,
		wrapX: REPEAT,
		wrapY: REPEAT,
	});
	// During touch, copy data from noise over to state.
	const touch = copyProgram(composer, {
		name: 'touch',
		type: noise.type,
		precision: PRECISION_LOW_P,
	});

	// Touch events.
	const activeTouches = {};
	function onPointerMove(e) {
		if (activeTouches[e.pointerId]) {
			composer.stepCircle({
				program: touch,
				input: noise,
				output: state,
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


	function changeBit(key, bit, index) {
		const mask = 1 << index;
		if (bit) {
			PARAMS[key] |= mask;
		} else {
			PARAMS[key] &= ((~mask) & 255);
		}
		// Update uniform.
		golRules.setUniform(`u_${key}`, PARAMS[key]);
	}

	// Init simple GUI.
	const survival = gui.addFolder('Survival Rules');
	survival.add(PARAMS, 's1').onChange((val) => {
		changeBit('survivalRules', val, 0);
	});
	survival.add(PARAMS, 's2').onChange((val) => {
		changeBit('survivalRules', val, 1);
	});
	survival.add(PARAMS, 's3').onChange((val) => {
		changeBit('survivalRules', val, 2);
	});
	survival.add(PARAMS, 's4').onChange((val) => {
		changeBit('survivalRules', val, 3);
	});
	survival.add(PARAMS, 's5').onChange((val) => {
		changeBit('survivalRules', val, 4);
	});
	survival.add(PARAMS, 's6').onChange((val) => {
		changeBit('survivalRules', val, 5);
	});
	survival.add(PARAMS, 's7').onChange((val) => {
		changeBit('survivalRules', val, 6);
	});
	survival.add(PARAMS, 's8').onChange((val) => {
		changeBit('survivalRules', val, 7);
	});
	// survival.open();
	const birth = gui.addFolder('Birth Rules');
	birth.add(PARAMS, 'b1').onChange((val) => {
		changeBit('birthRules', val, 0);
	});
	birth.add(PARAMS, 'b2').onChange((val) => {
		changeBit('birthRules', val, 1);
	});
	birth.add(PARAMS, 'b3').onChange((val) => {
		changeBit('birthRules', val, 2);
	});
	birth.add(PARAMS, 'b4').onChange((val) => {
		changeBit('birthRules', val, 3);
	});
	birth.add(PARAMS, 'b5').onChange((val) => {
		changeBit('birthRules', val, 4);
	});
	birth.add(PARAMS, 'b6').onChange((val) => {
		changeBit('birthRules', val, 5);
	});
	birth.add(PARAMS, 'b7').onChange((val) => {
		changeBit('birthRules', val, 6);
	});
	birth.add(PARAMS, 'b8').onChange((val) => {
		changeBit('birthRules', val, 7);
	});
	// birth.open();
	const ui = [];
	ui.push(gui.add(PARAMS, 'seedRatio', 0, 1, 0.01).onFinishChange(() => {
		onResize();
	}).name('Seed Ratio'));
	ui.push(gui.add(PARAMS, 'reset').name('Reset'));
	ui.push(gui.add(PARAMS, 'savePNG').name('Save PNG (p)'));

	function getRulesString(rule) {
		let rules = `_${rule.toUpperCase()}`;
		for (let i = 0; i < 8; i++) {
			if (PARAMS[`${rule}${i}`]) rules += i;
		}
		return rules;
	}
	// Add 'p' hotkey to print screen.
	function savePNG() {
		composer.step({
			program: golRender,
			input: state,
		});
		composer.savePNG({ filename: `gol${getRulesString('s')}${getRulesString('b')}` });
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

		// Init new random state.
		const array = new Uint8Array(width * height);
		for (let i = 0; i < array.length; i++) {
			array[i] = Math.random() < PARAMS.seedRatio ? 1 : 0;
		}
		// Copy noise into noise and state layers.
		noise.resize([width, height], array);
		state.resize([width, height], array);

		// Update px size uniform.
		golRules.setUniform('u_pxSize', [1 / width, 1 / height]);
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
		noise.dispose();
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