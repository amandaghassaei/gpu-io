const {
	GPUComposer,
	GPUProgram,
	GPULayer,
	BYTE,
	INT,
	UINT,
	FLOAT,
	REPEAT,
} = WebGLCompute;

// Init info dialog.
MicroModal.init();

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

const composer = new GPUComposer({ canvas });
const state = new GPULayer(composer, {
	name: 'state',
	dimensions: [canvas.width, canvas.height],
	numComponents: 1,
	type: BYTE,
	numBuffers: 2,// Use 2 buffers so we can toggle read/write from one to the other.
	wrapS: REPEAT,
	wrapT: REPEAT,
	writable: true,
});
const golRules = new GPUProgram(composer, {
	name: 'golRules',
	fragmentShader: `
in vec2 v_UV;

uniform vec2 u_pxSize;
uniform lowp isampler2D u_state;

uniform lowp uint u_survivalRules;
uniform lowp uint u_birthRules;

out lowp int out_fragColor;

void main() {
	lowp int state = texture(u_state, v_UV).r;
	lowp int n = texture(u_state, v_UV + vec2(0, u_pxSize[1])).r;
	lowp int s = texture(u_state, v_UV + vec2(0, -u_pxSize[1])).r;
	lowp int e = texture(u_state, v_UV + vec2(u_pxSize[0], 0)).r;
	lowp int w = texture(u_state, v_UV + vec2(-u_pxSize[0], 0)).r;
	lowp int ne = texture(u_state, v_UV + vec2(u_pxSize[0], u_pxSize[1])).r;
	lowp int nw = texture(u_state, v_UV + vec2(-u_pxSize[0], u_pxSize[1])).r;
	lowp int se = texture(u_state, v_UV + vec2(u_pxSize[0], -u_pxSize[1])).r;
	lowp int sw = texture(u_state, v_UV + vec2(-u_pxSize[0], -u_pxSize[1])).r;
	lowp int numLiving = n + s + e + w + ne + nw + se + sw;
	if (state == 0){
		lowp uint mask = u_birthRules & uint(1 << (numLiving - 1));
		if (mask > uint(0)) {
			state = 1;
		}
	} else {
		lowp uint mask = u_survivalRules & uint(1 << (numLiving - 1));
		if (mask == uint(0)) {
			state = 0;
		}
	}
	out_fragColor = state;
}`,
	uniforms: [
		{
			name: 'u_state',
			value: 0, // We don't even really need to declare this, bc all uniforms default to zero.
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
const golRender = new GPUProgram(composer, {
	name: 'golRender',
	fragmentShader: `
in vec2 v_UV;

uniform lowp isampler2D u_state;

out vec4 out_fragColor;

void main() {
	lowp int state = texture(u_state, v_UV).r;
	out_fragColor = vec4(state, state, state, 1);
}`,
	uniforms: {
		name: 'u_state',
		value: 0, // We don't even really need to declare this, bc all uniforms default to zero.
		type: INT,
	},
});

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
const gui = new dat.GUI();
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
survival.open();
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
birth.open();
gui.add(PARAMS, 'seedRatio', 0, 1, 0.01).onFinishChange(() => {
	onResize();
}).name('Seed Ratio');
gui.add(PARAMS, 'reset').name('Reset');
gui.add(PARAMS, 'savePNG').name('Save PNG');

// Start loop.
function loop() {
	window.requestAnimationFrame(loop);
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
loop();

function savePNG() {
	state.savePNG({ filename: 'gol', multiplier: 255 });
}
// Add 'p' hotkey to print screen.
window.addEventListener('keydown', (e) => {
	if (e.key === 'p') {
		savePNG();
	}
})

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
	state.resize([width, height], array);

	// Update px size uniform.
	golRules.setUniform('u_pxSize', [1 / width, 1 / height]);
}
onResize();