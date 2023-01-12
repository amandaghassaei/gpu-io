// Main is called from ../common/wrapper.js
function main({ pane, contextID, glslVersion}) {
	const {
		GPUComposer,
		GPUProgram,
		GPULayer,
		SHORT,
		INT,
		FLOAT,
		REPEAT,
		NEAREST,
		LINEAR,
		renderSignedAmplitudeProgram,
	} = GPUIO;

	const PARAMS = {
		trailLength: 15,
		render: 'Fluid',
	};
	// Scaling factor for touch interactions.
	const TOUCH_FORCE_SCALE = 2;
	// Approx avg num particles per px.
	const PARTICLE_DENSITY = 0.1;
	const MAX_NUM_PARTICLES = 100000;
	// How long do the particles last before they are reset.
	// If we don't have then reset they tend to clump up.
	const PARTICLE_LIFETIME = 1000;
	// How many steps to compute the zero pressure field.
	const NUM_JACOBI_STEPS = 3;
	const PRESSURE_CALC_ALPHA = -1;
	const PRESSURE_CALC_BETA = 0.25;
	// How many steps to move particles between each step of the simulation.
	// This helps to make the trails look smoother in cases where the particles are moving >1 px per step.
	const NUM_RENDER_STEPS = 3;
	// Compute the velocity at a lower resolution to increase efficiency.
	const VELOCITY_SCALE_FACTOR = 8;
	// Put a speed limit on velocity, otherwise touch interactions get out of control.
	const MAX_VELOCITY = 30;
	// We are storing abs position (2 components) and displacements (2 components) in this buffer.
	// This decreases error when rendering to half float.
	const POSITION_NUM_COMPONENTS = 4;

	let shouldSavePNG = false;

	const canvas = document.createElement('canvas');
	document.body.appendChild(canvas);

	function calcNumParticles(width, height) {
		return Math.min(Math.ceil(width * height * ( PARTICLE_DENSITY)), MAX_NUM_PARTICLES);
	}
	let NUM_PARTICLES = calcNumParticles(canvas.width, canvas.height);

	const composer = new GPUComposer({ canvas, contextID, glslVersion });

	// Init state.
	const width = canvas.clientWidth;
	const height = canvas.clientHeight;
	const velocityState = new GPULayer(composer, {
		name: 'velocity',
		dimensions: [Math.ceil(width / VELOCITY_SCALE_FACTOR), Math.ceil(height / VELOCITY_SCALE_FACTOR)],
		type: FLOAT,
		filter: LINEAR,
		numComponents: 2,
		wrapX: REPEAT,
		wrapY: REPEAT,
		numBuffers: 2,
	});
	const divergenceState = new GPULayer(composer, {
		name: 'divergence',
		dimensions: [velocityState.width, velocityState.height],
		type: FLOAT,
		filter: NEAREST,
		numComponents: 1,
		wrapX: REPEAT,
		wrapY: REPEAT,
	});
	const pressureState = new GPULayer(composer, {
		name: 'pressure',
		dimensions: [velocityState.width, velocityState.height],
		type: FLOAT,
		filter: NEAREST,
		numComponents: 1,
		wrapX: REPEAT,
		wrapY: REPEAT,
		numBuffers: 2,
	});
	const particlePositionState = new GPULayer(composer, {
		name: 'position',
		dimensions: NUM_PARTICLES,
		type: FLOAT,
		numComponents: POSITION_NUM_COMPONENTS,
		numBuffers: 2,
	});
	// We can use the initial state to reset particles after they've died.
	const particleInitialState = new GPULayer(composer, {
		name: 'initialPosition',
		dimensions: NUM_PARTICLES,
		type: FLOAT,
		numComponents: POSITION_NUM_COMPONENTS,
		numBuffers: 1,
	});
	const particleAgeState = new GPULayer(composer, {
		name: 'age',
		dimensions: NUM_PARTICLES,
		type: SHORT,
		numComponents: 1,
		numBuffers: 2,
	});
	// Init a render target for trail effect.
	const trailState = new GPULayer(composer, {
		name: 'trails',
		dimensions: [canvas.width, canvas.height],
		type: FLOAT,
		filter: NEAREST,
		numComponents: 1,
		numBuffers: 2,
	});

	// Init programs.
	const advection = new GPUProgram(composer, {
		name: 'advection',
		fragmentShader: `
		in vec2 v_uv;

		uniform sampler2D u_state;
		uniform sampler2D u_velocity;
		uniform vec2 u_dimensions;

		out vec2 out_state;

		void main() {
			// Implicitly solve advection.
			out_state = texture(u_state, v_uv - texture(u_velocity, v_uv).xy / u_dimensions).xy;
		}`,
		uniforms: [
			{
				name: 'u_state',
				value: 0,
				type: INT,
			},
			{
				name: 'u_velocity',
				value: 1,
				type: INT,
			},
			{
				name: 'u_dimensions',
				value: [canvas.width, canvas.height],
				type: FLOAT,
			},
		],
	});
	const divergence2D = new GPUProgram(composer, {
		name: 'divergence2D',
		fragmentShader: `
		in vec2 v_uv;

		uniform sampler2D u_vectorField;
		uniform vec2 u_pxSize;

		out float out_divergence;

		void main() {
			float n = texture(u_vectorField, v_uv + vec2(0, u_pxSize.y)).y;
			float s = texture(u_vectorField, v_uv - vec2(0, u_pxSize.y)).y;
			float e = texture(u_vectorField, v_uv + vec2(u_pxSize.x, 0)).x;
			float w = texture(u_vectorField, v_uv - vec2(u_pxSize.x, 0)).x;
			out_divergence = 0.5 * ( e - w + n - s);
		}`,
		uniforms: [
			{
				name: 'u_vectorField',
				value: 0,
				type: INT,
			},
			{
				name: 'u_pxSize',
				value: [1 / velocityState.width, 1 / velocityState.height],
				type: FLOAT,
			}
		],
	});
	const jacobi = new GPUProgram(composer, {
		name: 'jacobi',
		fragmentShader: `
		in vec2 v_uv;

		uniform float u_alpha;
		uniform float u_beta;
		uniform vec2 u_pxSize;
		uniform sampler2D u_previousState;
		uniform sampler2D u_divergence;

		out vec4 out_jacobi;

		void main() {
			vec4 n = texture(u_previousState, v_uv + vec2(0, u_pxSize.y));
			vec4 s = texture(u_previousState, v_uv - vec2(0, u_pxSize.y));
			vec4 e = texture(u_previousState, v_uv + vec2(u_pxSize.x, 0));
			vec4 w = texture(u_previousState, v_uv - vec2(u_pxSize.x, 0));
			vec4 d = texture(u_divergence, v_uv);
			out_jacobi = (n + s + e + w + u_alpha * d) * u_beta;
		}`,
		uniforms: [
			{
				name: 'u_alpha',
				value: PRESSURE_CALC_ALPHA,
				type: FLOAT,
			},
			{
				name: 'u_beta',
				value: PRESSURE_CALC_BETA,
				type: FLOAT,
			},
			{
				name: 'u_pxSize',
				value: [1 / velocityState.width, 1 / velocityState.height],
				type: FLOAT,
			},
			{
				name: 'u_previousState',
				value: 0,
				type: INT,
			},
			{
				name: 'u_divergence',
				value: 1,
				type: INT,
			},
		],
	});
	const gradientSubtraction = new GPUProgram(composer, {
		name: 'gradientSubtraction',
		fragmentShader: `
		in vec2 v_uv;

		uniform vec2 u_pxSize;
		uniform sampler2D u_scalarField;
		uniform sampler2D u_vectorField;

		out vec2 out_result;

		void main() {
			float n = texture(u_scalarField, v_uv + vec2(0, u_pxSize.y)).r;
			float s = texture(u_scalarField, v_uv - vec2(0, u_pxSize.y)).r;
			float e = texture(u_scalarField, v_uv + vec2(u_pxSize.x, 0)).r;
			float w = texture(u_scalarField, v_uv - vec2(u_pxSize.x, 0)).r;

			out_result = texture2D(u_vectorField, v_uv).xy - 0.5 * vec2(e - w, n - s);
		}`,
		uniforms: [
			{
				name: 'u_pxSize',
				value: [1 / velocityState.width, 1 / velocityState.height],
				type: FLOAT,
			},
			{
				name: 'u_scalarField',
				value: 0,
				type: INT,
			},
			{
				name: 'u_vectorField',
				value: 1,
				type: INT,
			},
		],
	});
	const renderParticles = new GPUProgram(composer, {
		name: 'renderParticles',
		fragmentShader: `
		#define FADE_TIME 0.1

		in vec2 v_uv;
		in vec2 v_uv_position;

		uniform isampler2D u_ages;
		uniform sampler2D u_velocity;

		out float out_state;

		void main() {
			float ageFraction = float(texture(u_ages, v_uv_position).x) / ${PARTICLE_LIFETIME.toFixed(1)};
			// Fade first 10% and last 10%.
			float opacity = mix(0.0, 1.0, min(ageFraction * 10.0, 1.0)) * mix(1.0, 0.0, max(ageFraction * 10.0 - 90.0, 0.0));
			vec2 velocity = texture(u_velocity, v_uv).xy;
			// Show the fastest regions with darker color.
			float multiplier = clamp(dot(velocity, velocity) * 0.05 + 0.7, 0.0, 1.0);
			out_state = opacity * multiplier;
		}`,
		uniforms: [
			{
				name: 'u_ages',
				value: 0,
				type: INT,
			},
			{
				name: 'u_velocity',
				value: 1,
				type: INT,
			},
		],
	});
	const ageParticles = new GPUProgram(composer, {
		name: 'ageParticles',
		fragmentShader: `
		in vec2 v_uv;

		uniform isampler2D u_ages;

		out int out_age;

		void main() {
			int age = texture(u_ages, v_uv).x + 1;
			out_age = stepi(age, ${PARTICLE_LIFETIME}) * age;
		}`,
		uniforms: [
			{
				name: 'u_ages',
				value: 0,
				type: INT,
			},
		],
	});
	const advectParticles = new GPUProgram(composer, {
		name: 'advectParticles',
		fragmentShader: `
		in vec2 v_uv;

		uniform vec2 u_dimensions;
		uniform sampler2D u_positions;
		uniform sampler2D u_velocity;
		uniform isampler2D u_ages;
		uniform sampler2D u_initialPositions;

		out vec4 out_position;

		void main() {
			// Store small displacements as separate number until they accumulate sufficiently.
			// Then add them to the absolution position.
			// This prevents small offsets on large abs positions from being lost in float16 precision.
			vec4 positionData = texture(u_positions, v_uv);
			vec2 absolute = positionData.rg;
			vec2 displacement = positionData.ba;
			vec2 position = absolute + displacement;

			// Forward integrate via RK2.
			vec2 pxSize = 1.0 / u_dimensions;
			vec2 velocity1 = texture(u_velocity, position * pxSize).xy;
			vec2 halfStep = position + velocity1 * 0.5 * ${1 / NUM_RENDER_STEPS};
			vec2 velocity2 = texture(u_velocity, halfStep * pxSize).xy;
			displacement += velocity2 * ${1 / NUM_RENDER_STEPS};

			// Merge displacement with absolute if needed.
			float shouldMerge = step(20.0, dot(displacement, displacement));
			// Also wrap absolute position if needed.
			absolute = mod(absolute + shouldMerge * displacement + u_dimensions, u_dimensions);
			displacement *= (1.0 - shouldMerge);

			// If this particle is being reset, give it a random position.
			int shouldReset = stepi(texture(u_ages, v_uv).x, 1);
			out_position = mix(vec4(absolute, displacement), texture(u_initialPositions, v_uv), float(shouldReset));
		}`,
		uniforms: [
			{
				name: 'u_positions',
				value: 0,
				type: INT,
			},
			{
				name: 'u_velocity',
				value: 1,
				type: INT,
			},
			{
				name: 'u_ages',
				value: 2,
				type: INT,
			},
			{
				name: 'u_initialPositions',
				value: 3,
				type: INT,
			},
			{
				name: 'u_dimensions',
				value: [canvas.width, canvas.height],
				type: 'FLOAT',
			},
		],
	});
	const fadeTrails = new GPUProgram(composer, {
		name: 'fadeTrails',
		fragmentShader: `
		in vec2 v_uv;

		uniform sampler2D u_image;
		uniform float u_increment;

		out float out_color;

		void main() {
			out_color = max(texture(u_image, v_uv).x + u_increment, 0.0);
		}`,
		uniforms: [
			{
				name: 'u_image',
				value: 0,
				type: INT,
			},
			{
				name: 'u_increment',
				value: -1 / PARAMS.trailLength,
				type: 'FLOAT',
			},
		],
	});
	const renderTrails = new GPUProgram(composer, {
		name: 'renderTrails',
		fragmentShader: `
			in vec2 v_uv;
			uniform sampler2D u_trailState;
			out vec4 out_color;
			void main() {
				vec3 background = vec3(0.98, 0.922, 0.843);
				vec3 particle = vec3(0, 0, 0.2);
				out_color = vec4(mix(background, particle, texture(u_trailState, v_uv).x), 1);
			}
		`,
	});
	const renderPressure = renderSignedAmplitudeProgram(composer, {
		name: 'renderPressure',
		type: pressureState.type,
		scale: 0.5,
		component: 'x',
	});

	// Render loop.
	function loop() {
		// Advect the velocity vector field.
		composer.step({
			program: advection,
			input: [velocityState, velocityState],
			output: velocityState,
		});
		// Compute divergence of advected velocity field.
		composer.step({
			program: divergence2D,
			input: velocityState,
			output: divergenceState,
		});
		// Compute the pressure gradient of the advected velocity vector field (using jacobi iterations).
		for (let i = 0; i < NUM_JACOBI_STEPS; i++) {
			composer.step({
				program: jacobi,
				input: [pressureState, divergenceState],
				output: pressureState,
			});
		}
		// Subtract the pressure gradient from velocity to obtain a velocity vector field with zero divergence.
		composer.step({
			program: gradientSubtraction,
			input: [pressureState, velocityState],
			output: velocityState,
		});

		if (PARAMS.render === 'Pressure') {
			composer.step({
				program: renderPressure,
				input: pressureState,
			});
		} else if (PARAMS.render === 'Velocity') {
			composer.drawLayerAsVectorField({
				layer: velocityState,
				vectorSpacing: 10,
				vectorScale: 2.5,
				color: [0, 0, 0],
			});
		} else {
			// Increment particle age.
			composer.step({
				program: ageParticles,
				input: particleAgeState,
				output: particleAgeState,
			});
			// Fade current trails.
			composer.step({
				program: fadeTrails,
				input: trailState,
				output: trailState,
			});
			for (let i = 0; i < NUM_RENDER_STEPS; i++) {
				// Advect particles.
				composer.step({
					program: advectParticles,
					input: [particlePositionState, velocityState, particleAgeState, particleInitialState],
					output: particlePositionState,
				});
				// Render particles to texture for trail effect.
				composer.drawLayerAsPoints({
					layer: particlePositionState,
					program: renderParticles,
					input: [particleAgeState, velocityState],
					output: trailState,
					wrapX: true,
					wrapY: true,
				});
			}
			// Render particle trails to screen.
			composer.step({
				program: renderTrails,
				input: trailState,
			});
		}
		if (shouldSavePNG) {
			composer.savePNG({ filename: `fluid` });
			shouldSavePNG = false;
		}
	}

	// During touch, copy data from noise over to state.
	const touch = new GPUProgram(composer, {
		name: 'touch',
		fragmentShader: `
		in vec2 v_uv;
		in vec2 v_uv_local;

		uniform sampler2D u_velocity;
		uniform vec2 u_vector;

		out vec2 out_velocity;

		void main() {
			vec2 radialVec = (v_uv_local * 2.0 - 1.0);
			float radiusSq = dot(radialVec, radialVec);
			vec2 velocity = texture(u_velocity, v_uv).xy + (1.0 - radiusSq) * u_vector * ${TOUCH_FORCE_SCALE.toFixed(1)};
			float velocityMag = length(velocity);
			out_velocity = velocity / velocityMag * min(velocityMag, ${MAX_VELOCITY.toFixed(1)});
		}`,
		uniforms: [
			{
				name: 'u_velocity',
				value: 0,
				type: INT,
			},
			{
				name: 'u_vector',
				value: [0, 0],
				type: FLOAT,
			},
		],
	});

	// Touch events.
	const activeTouches = {};
	function onPointerMove(e) {
		const x = e.clientX;
		const y = e.clientY;
		if (activeTouches[e.pointerId] === undefined) {
			activeTouches[e.pointerId] = {
				current: [x, y],
			}
			return;
		}
		activeTouches[e.pointerId].last = activeTouches[e.pointerId].current;
		activeTouches[e.pointerId].current = [x, y];

		const { current, last } = activeTouches[e.pointerId];
		if (current[0] == last[0] && current[1] == last[1]) {
			return;
		}
		touch.setUniform('u_vector', [current[0] - last[0], - (current[1] - last[1])]);
		composer.stepSegment({
			program: touch,
			input: velocityState,
			output: velocityState,
			position1: [current[0], canvas.clientHeight - current[1]],
			position2: [last[0], canvas.clientHeight - last[1]],
			thickness: 30,
			endCaps: true,
		});
	}
	function onPointerStop(e) {
		delete activeTouches[e.pointerId];
	}
	canvas.addEventListener('pointermove', onPointerMove);
	canvas.addEventListener('pointerup', onPointerStop);
	canvas.addEventListener('pointerout', onPointerStop);
	canvas.addEventListener('pointercancel', onPointerStop);

	const ui = [];
	ui.push(pane.addInput(PARAMS, 'trailLength', { min: 0, max: 100, step: 1, label: 'Trail Length' }).on('change', () => {
		fadeTrails.setUniform('u_increment', -1 / PARAMS.trailLength);
	}));
	ui.push(pane.addInput(PARAMS, 'render', {
		options: {
			Fluid: 'Fluid',
			Pressure: 'Pressure',
			Velocity: 'Velocity',
		},
		label: 'Render',
	}));
	ui.push(pane.addButton({ title: 'Reset' }).on('click', onResize));
	ui.push(pane.addButton({ title: 'Save PNG (p)' }).on('click', savePNG));

	// Add 'p' hotkey to print screen.
	function savePNG() {
		shouldSavePNG = true;
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
		composer.resize([width, height]);

		// Re-init textures at new size.
		const velocityDimensions = [Math.ceil(width / VELOCITY_SCALE_FACTOR), Math.ceil(height / VELOCITY_SCALE_FACTOR)];
		velocityState.resize(velocityDimensions);
		divergenceState.resize(velocityDimensions);
		pressureState.resize(velocityDimensions);
		trailState.resize([width, height]);

		// Update uniforms.
		advection.setUniform('u_dimensions', [width, height]);
		advectParticles.setUniform('u_dimensions', [width, height]);
		const velocityPxSize = [1 / velocityDimensions[0], 1 / velocityDimensions[1]];
		divergence2D.setUniform('u_pxSize', velocityPxSize);
		jacobi.setUniform('u_pxSize', velocityPxSize);
		gradientSubtraction.setUniform('u_pxSize', velocityPxSize);
		
		// Re-init particles.
		NUM_PARTICLES = calcNumParticles(width, height);
		// Init new positions.
		const positions = new Float32Array(NUM_PARTICLES * 4);
		for (let i = 0; i < positions.length / 4; i++) {
			positions[POSITION_NUM_COMPONENTS * i] = Math.random() * width;
			positions[POSITION_NUM_COMPONENTS * i + 1] = Math.random() * height;
		}
		particlePositionState.resize(NUM_PARTICLES, positions);
		particleInitialState.resize(NUM_PARTICLES, positions);
		// Init new ages.
		const ages = new Int16Array(NUM_PARTICLES);
		for (let i = 0; i < NUM_PARTICLES; i++) {
			ages[i] = Math.round(Math.random() * PARTICLE_LIFETIME);
		}
		particleAgeState.resize(NUM_PARTICLES, ages);
	}
	onResize();

	function dispose() {
		document.body.removeChild(canvas);
		window.removeEventListener('keydown', onKeydown);
		window.removeEventListener('resize', onResize);
		canvas.removeEventListener('pointermove', onPointerMove);
		canvas.removeEventListener('pointerup', onPointerStop);
		canvas.removeEventListener('pointerout', onPointerStop);
		canvas.removeEventListener('pointercancel', onPointerStop);
		velocityState.dispose();
		divergenceState.dispose();
		pressureState.dispose();
		particlePositionState.dispose();
		particleInitialState.dispose();
		particleAgeState.dispose();
		trailState.dispose();
		advection.dispose();
		divergence2D.dispose();
		jacobi.dispose();
		gradientSubtraction.dispose();
		renderParticles.dispose();
		ageParticles.dispose();
		advectParticles.dispose();
		renderTrails.dispose();
		fadeTrails.dispose();
		renderPressure.dispose();
		touch.dispose();
		composer.dispose();
		ui.forEach(el => {
			pane.remove(el);
		});
		ui.length = 0;
	}

	return {
		loop,
		dispose,
		composer,
		canvas,
	};
}