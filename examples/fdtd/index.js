// Main is called from ../common/wrapper.js
function main({ gui, contextID, glslVersion}) {
	const {
		GPUComposer,
		GPUProgram,
		GPULayer,
		NEAREST,
		INT,
		UINT,
		FLOAT,
		REPEAT,
		CLAMP_TO_EDGE,
		renderSignedAmplitudeProgram,
		setValueProgram,
		copyProgram,
		PRECISION_LOW_P,
	} = GPUIO;

	const PARAMS = {
		// dx is measured in nm.
		// "at least 10 cells per wavelength are necessary to ensure an adequate representation"
		dx: 380 / 10,
		reset: onResize,
		savePNG: savePNG,
	};
	const PML_WIDTH = 20;
	const PULSE_DELAY_TIME = 100;

	const DT_OVER_DX = 0.5 * 3e8; // Half the speed of light.
	const C = 0.5;
	const WRAP_X = CLAMP_TO_EDGE;
	const WRAP_Y = CLAMP_TO_EDGE;

	const canvas = document.createElement('canvas');
	document.body.appendChild(canvas);

	const composer = new GPUComposer({ canvas, contextID, glslVersion });

	const electricField = new GPULayer(composer, {
		name: 'electricField',
		dimensions: [canvas.width, canvas.height],
		type: FLOAT,
		numComponents: 2,
		numBuffers: 2,
		filter: NEAREST,
		wrapS: WRAP_X,
		wrapT: WRAP_Y,
		writable: true,
	});
	const magneticField = new GPULayer(composer, {
		name: 'magneticField',
		dimensions: [canvas.width, canvas.height],
		type: FLOAT,
		numComponents: 2,
		numBuffers: 2,
		filter: NEAREST,
		wrapS: WRAP_X,
		wrapT: WRAP_Y,
		writable: true,
	});
	const permittivityFactor  = new GPULayer(composer, {
		name: 'permittivityFactor',
		dimensions: [canvas.width, canvas.height],
		type: FLOAT,
		numComponents: 1,
		numBuffers: 1,
		filter: NEAREST,
		wrapS: WRAP_X,
		wrapT: WRAP_Y,
		writable: true,
		clearValue: 1,
	});
	permittivityFactor.clear(); // Set to 1.
	const pml  = new GPULayer(composer, {
		name: 'permittivityFactor',
		dimensions: [canvas.width, canvas.height],
		type: FLOAT,
		numComponents: 2,
		numBuffers: 1,
		filter: NEAREST,
		wrapS: WRAP_X,
		wrapT: WRAP_Y,
		writable: true,
		clearValue: [1, 1],
	});
	pml.clear(); // Set to [1,1].
	const setValue1D = setValueProgram({
		name: 'setValue1D',
		composer,
		type: FLOAT,
		value: 0,
	});
	const setValue2D = setValueProgram({
		name: 'setValue2D',
		composer,
		type: FLOAT,
		value: [0, 0],
	});
	const stepMagnetic = new GPUProgram(composer, {
		name: 'stepMagnetic',
		fragmentShader: `
		in vec2 v_uv;

		uniform vec2 u_onePx;
		uniform sampler2D u_magneticField;
		uniform sampler2D u_electricField;
		uniform sampler2D u_permittivityFactor;
		uniform sampler2D u_pml;

		out vec2 out_fragColor;

		void main() {
			vec2 Ez_minus_2comp = texture(u_electricField, v_uv).xy;
			vec2 Ez_plusX_2comp = texture(u_electricField, v_uv + vec2(u_onePx.x, 0)).xy;
			vec2 Ez_plusY_2comp = texture(u_electricField, v_uv + vec2(0, u_onePx.y)).xy;
			float Ez_minus = Ez_minus_2comp.x + Ez_minus_2comp.y;
			float Ez_plusX = Ez_plusX_2comp.x + Ez_plusX_2comp.y;
			float Ez_plusY = Ez_plusY_2comp.x + Ez_plusY_2comp.y;
			vec2 pml = texture(u_pml, v_uv).xy;
			vec2 Hxy = texture(u_magneticField, v_uv).xy;
			out_fragColor = pml * (Hxy + texture(u_permittivityFactor, v_uv).x * ${C} * vec2(Ez_minus - Ez_plusY, Ez_minus - Ez_plusX));
		}`,
		uniforms: [
			{
				name: 'u_magneticField',
				value: 0,
				type: INT,
			},
			{
				name: 'u_electricField',
				value: 1,
				type: INT,
			},
			{
				name: 'u_permittivityFactor',
				value: 2,
				type: INT,
			},
			{
				name: 'u_pml',
				value: 3,
				type: INT,
			},
			{
				name: 'u_onePx',
				value: [1 / canvas.width, 1 / canvas.height],
				type: FLOAT,
			},
		],
	});
	const stepElectric = new GPUProgram(composer, {
		name: 'stepElectric',
		fragmentShader: `
		in vec2 v_uv;

		uniform vec2 u_onePx;
		uniform sampler2D u_magneticField;
		uniform sampler2D u_electricField;
		uniform sampler2D u_permittivityFactor;
		uniform sampler2D u_pml;

		out vec2 out_fragColor;

		void main() {
			vec2 H_plus = texture(u_magneticField, v_uv).xy;
			float H_minusX = texture(u_magneticField, v_uv + vec2(0, -u_onePx.y)).x;
			float H_minusY = texture(u_magneticField, v_uv + vec2(-u_onePx.x, 0)).y;
			vec2 pml = texture(u_pml, v_uv).xy;
			vec2 Ez = texture(u_electricField, v_uv).xy;
			out_fragColor = pml* (Ez + texture(u_permittivityFactor, v_uv).x * ${C} * vec2(H_minusY - H_plus.y, H_minusX - H_plus.x));
		}`,
		uniforms: [
			{
				name: 'u_magneticField',
				value: 0,
				type: INT,
			},
			{
				name: 'u_electricField',
				value: 1,
				type: INT,
			},
			{
				name: 'u_permittivityFactor',
				value: 2,
				type: INT,
			},
			{
				name: 'u_pml',
				value: 3,
				type: INT,
			},
			{
				name: 'u_onePx',
				value: [1 / canvas.width, 1 / canvas.height],
				type: FLOAT,
			},
		],
	});
	const stepPML = new GPUProgram(composer, {
		name: 'stepPML',
		fragmentShader: `
		in vec2 v_uv;

		uniform vec2 u_dimensions;
		uniform float u_pmlWidth;

		out vec2 out_fragColor;

		void main() {
			float pmlFactorX = 1.0;
			float pmlFactorY = 1.0;
			if (gl_FragCoord.x < u_pmlWidth || gl_FragCoord.x > u_dimensions.x - u_pmlWidth) pmlFactorX = clamp(1.0 - (abs(u_dimensions.x / 2.0 - gl_FragCoord.x) - u_dimensions.x / 2.0 + u_pmlWidth) / u_pmlWidth, 0.0, 1.0);
			if (gl_FragCoord.y < u_pmlWidth || gl_FragCoord.y > u_dimensions.y - u_pmlWidth) pmlFactorY = clamp(1.0 - (abs(u_dimensions.y / 2.0 - gl_FragCoord.y) - u_dimensions.y / 2.0 + u_pmlWidth) / u_pmlWidth, 0.0, 1.0);
			out_fragColor = vec2(pmlFactorX, pmlFactorY);
		}`,
		uniforms: [
			{
				name: 'u_dimensions',
				value: [canvas.width, canvas.height],
				type: FLOAT,
			},
			{
				name: 'u_pmlWidth',
				value: PML_WIDTH,
				type: FLOAT,
			},
		],
	});
	// const render = renderSignedAmplitudeProgram({
	// 	name: 'render',
	// 	composer,
	// 	type: electricField.type,
	// 	component: 'x',
	// });
	const render = new GPUProgram(composer, {
		name: 'render',
		fragmentShader: `
		in vec2 v_uv;

		uniform sampler2D u_electricField;
		uniform sampler2D u_permittivityFactor;
		uniform sampler2D u_pml;

		out vec4 out_fragColor;

		void main() {
			float permittivity = texture(u_permittivityFactor, v_uv).x;
			vec2 pml = texture(u_pml, v_uv).xy;
			vec2 Ez = texture(u_electricField, v_uv).xy;
			float signedAmplitude = Ez.x + Ez.y;
			float amplitudeSign = sign(signedAmplitude);
			vec3 interpColor = mix(vec3(0, 0, 1), vec3(1, 0, 0), amplitudeSign / 2.0 + 0.5);
			vec3 color = mix(vec3(1, 1, 1), interpColor, signedAmplitude * amplitudeSign);
			out_fragColor = vec4(pml.x * pml.y * permittivity * color, 1);
		}
`,
		uniforms: [
			{
				name: 'u_electricField',
				value: 0,
				type: INT,
			},
			{
				name:'u_permittivityFactor',
				value: 1,
				type: INT,
			},
			{
				name:'u_pml',
				value: 2,
				type: INT,
			},
		],
	});

	let t = 0;

	setValue1D.setUniform('u_value', 0.5);
	// const NUM_PILLARS = 40;
	// for (let i = 0; i < NUM_PILLARS; i++) {
	// 	const xStart = 150;
	// 	const xEnd = 250;
	// 	const y = canvas.height * i / NUM_PILLARS;
	// 	composer.stepSegment({
	// 		position1: [xStart, y],
	// 		position2: [xEnd, y],
	// 		thickness: 10 - Math.abs(canvas.height / 2 - y) / 20,
	// 		program: setValue1D,
	// 		output: permittivityFactor,
	// 	});
	// }
	composer.stepCircle({
		position: [400, canvas.height / 2],
		diameter: 300,
		program: setValue1D,
		numSegments: 100,
		output: permittivityFactor,
	});
	composer.step({
		program: stepPML,
		output: pml,
	});

	// Render loop.
	function loop() {
		// Apply source.
		setValue2D.setUniform('u_value',[ Math.sin(t / 7),  Math.sin(t / 7)]);
		composer.stepCircle({
			position: [150, canvas.height / 2],
			// position2: [50, canvas.height - 50],
			diameter: 10,
			program: setValue2D,
			output: electricField,
		});

		composer.step({
			program: stepMagnetic,
			input: [magneticField, electricField, permittivityFactor, pml],
			output: magneticField,
		});

		composer.step({
			program: stepElectric,
			input: [magneticField, electricField, permittivityFactor, pml],
			output: electricField,
		});

		// Render to screen.
		composer.step({
			program: render,
			input: [electricField, permittivityFactor, pml],
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
		setValue1D.dispose();
		stepMagnetic.dispose();
		stepElectric.dispose();
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