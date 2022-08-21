const {
	GPUComposer,
	GPUProgram,
	GPULayer,
	UNSIGNED_BYTE,
	INT,
	UINT,
	FLOAT,
	REPEAT,
} = WebGLCompute;

// Init info dialog.
MicroModal.init();

const PARAMS = {
	overPopulationLimit: 3,
	underPopulationLimit: 2,
	birthRateLow: 3,
	birthRateHigh: 3,
	seedRatio: 0.35,
	reset: onResize,
	shouldSavePNG: false,
}

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

const composer = new GPUComposer({ canvas });
const state = new GPULayer(composer, {
	name: 'state',
	dimensions: [canvas.width, canvas.height],
	numComponents: 1,
	type: UNSIGNED_BYTE,
	numBuffers: 2,
	wrapS: REPEAT,
	wrapT: REPEAT,
	writable: true,
});
const golRules = new GPUProgram(composer, {
	name: 'golRules',
	fragmentShader: `
in vec2 v_UV;

uniform vec2 u_pxSize;
uniform usampler2D u_state;

uniform uint u_overPopulationLimit;
uniform uint u_underPopulationLimit;
uniform uint u_birthRateLow;
uniform uint u_birthRateHigh;

out uint out_fragColor;

void main() {
	uint state = texture(u_state, v_UV).r;
	uint n = texture(u_state, v_UV + vec2(0, u_pxSize[1])).r;
	uint s = texture(u_state, v_UV + vec2(0, -u_pxSize[1])).r;
	uint e = texture(u_state, v_UV + vec2(u_pxSize[0], 0)).r;
	uint w = texture(u_state, v_UV + vec2(-u_pxSize[0], 0)).r;
	uint ne = texture(u_state, v_UV + vec2(u_pxSize[0], u_pxSize[1])).r;
	uint nw = texture(u_state, v_UV + vec2(-u_pxSize[0], u_pxSize[1])).r;
	uint se = texture(u_state, v_UV + vec2(u_pxSize[0], -u_pxSize[1])).r;
	uint sw = texture(u_state, v_UV + vec2(-u_pxSize[0], -u_pxSize[1])).r;
	uint numLiving = n + s + e + w + ne + nw + se + sw;
	if (state == uint(0) && numLiving >= u_birthRateLow && numLiving <= u_birthRateHigh) {
		state = uint(1);
	} else if (state == uint(1) && (numLiving < u_underPopulationLimit || numLiving > u_overPopulationLimit)) {
		state = uint(0);
	}
	out_fragColor = state;
}`,
	uniforms: [
		{
			name: 'u_state',
			value: 0, // We don't even really need to add this, bc all uniforms default to zero.
			type: INT,
		},
		{
			name: 'u_pxSize',
			value: [1/canvas.width, 1/canvas.height],
			type: FLOAT,
		},
		{
			name: 'u_overPopulationLimit',
			value: PARAMS.overPopulationLimit,
			type: UINT,
		},
		{
			name: 'u_underPopulationLimit',
			value: PARAMS.underPopulationLimit,
			type: UINT,
		},
		{
			name: 'u_birthRateLow',
			value: PARAMS.birthRateLow,
			type: UINT,
		},
		{
			name: 'u_birthRateHigh',
			value: PARAMS.birthRateHigh,
			type: UINT,
		},
	],
});
const golRender = new GPUProgram(composer, {
	name: 'golRender',
	fragmentShader: `
in vec2 v_UV;

uniform usampler2D u_state;
out vec4 out_fragColor;

void main() {
	uint state = texture(u_state, v_UV).r;
	out_fragColor = vec4(state, state, state, 1);
}`,
	uniforms: {
		name: 'u_state',
		value: 0, // We don't even really need to add this, bc all uniforms default to zero.
		type: INT,
	},
});

// Init simple GUI.
const gui = new dat.GUI();
gui.add(PARAMS, 'overPopulationLimit', 0, 8, 1).onChange((val) => {
	golRules.setUniform('u_overPopulationLimit', val);
});
gui.add(PARAMS, 'underPopulationLimit', 0, 8, 1).onChange((val) => {
	golRules.setUniform('u_underPopulationLimit', val);
});
gui.add(PARAMS, 'birthRateLow', 0, 8, 1).onChange((val) => {
	golRules.setUniform('u_birthRateLow', val);
});
gui.add(PARAMS, 'birthRateHigh', 0, 8, 1).onChange((val) => {
	golRules.setUniform('u_birthRateHigh', val);
});
gui.add(PARAMS, 'seedRatio', 0, 1, 0.01).onFinishChange(() => {
	onResize();
});
gui.add(PARAMS, 'reset', 0, 8, 1);

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

// Add p hotkey to print screen.
window.addEventListener('keydown', (e) => {
	if (e.key === 'p') {
		// TODO: this isn't working for UNSIGNED_BYTE types?
		state.savePNG({ filename: 'gol', multiplier: 255 });
	}
})

// Resize if needed.
window.addEventListener('resize', onResize);
function onResize() {
	const width = window.innerWidth;
	const height = window.innerHeight;

	composer.onResize(canvas);
	// Init new random state.
	const array = new Uint8Array(width * height);
	for (let i = 0; i < array.length; i++) {
		array[i] = Math.random() < PARAMS.seedRatio ? 0 : 1;
	}
	state.resize([width, height], array);
	// Update px size.
	golRules.setUniform('u_pxSize', [1 / width, 1 / height]);
}
onResize();