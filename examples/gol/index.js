const {
	GPUComposer,
	GPUProgram,
	GPULayer,
	BYTE,
	INT,
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
}

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

const composer = new GPUComposer({ canvas });
const state = new GPULayer(composer, {
	name: 'state',
	dimensions: [canvas.width, canvas.height],
	numComponents: 1,
	type: BYTE,
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
uniform isampler2D u_state;
uniform int u_overPopulationLimit;
uniform int u_underPopulationLimit;
uniform int u_birthRateLow;
uniform int u_birthRateHigh;
out ivec4 out_fragColor;
void main() {
	int state = texture(u_state, v_UV).r;
	int n = texture(u_state, v_UV + vec2(0, u_pxSize[1])).r;
	int s = texture(u_state, v_UV + vec2(0, -u_pxSize[1])).r;
	int e = texture(u_state, v_UV + vec2(u_pxSize[0], 0)).r;
	int w = texture(u_state, v_UV + vec2(-u_pxSize[0], 0)).r;
	int ne = texture(u_state, v_UV + vec2(u_pxSize[0], u_pxSize[1])).r;
	int nw = texture(u_state, v_UV + vec2(-u_pxSize[0], u_pxSize[1])).r;
	int se = texture(u_state, v_UV + vec2(u_pxSize[0], -u_pxSize[1])).r;
	int sw = texture(u_state, v_UV + vec2(-u_pxSize[0], -u_pxSize[1])).r;
	int numLiving = n + s + e + w + ne + nw + se + sw;
	if (state == 0 && numLiving >= u_birthRateLow && numLiving <= u_birthRateHigh) {
		state = 1;
	} else if (state == 1 && (numLiving < u_underPopulationLimit || numLiving > u_overPopulationLimit)) {
		state = 0;
	}
	out_fragColor = ivec4(state);
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
			type: INT,
		},
		{
			name: 'u_underPopulationLimit',
			value: PARAMS.underPopulationLimit,
			type: INT,
		},
		{
			name: 'u_birthRateLow',
			value: PARAMS.birthRateLow,
			type: INT,
		},
		{
			name: 'u_birthRateHigh',
			value: PARAMS.birthRateHigh,
			type: INT,
		},
	],
});
const golRender = new GPUProgram(composer, {
	name: 'golRender',
	fragmentShader: `
in vec2 v_UV;
uniform isampler2D u_state;
out vec4 out_fragColor;
void main() {
	int state = texture(u_state, v_UV).r;
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
gui.add(PARAMS, 'seedRatio', 0, 1, 0.1).onFinishChange(() => {
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