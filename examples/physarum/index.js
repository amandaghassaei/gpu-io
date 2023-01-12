function main({ pane, glslVersion, contextID }) {
	const {
		GPUComposer,
		GPUProgram,
		GPULayer,
		INT,
		BOOL,
		FLOAT,
		REPEAT,
		LINEAR,
		renderAmplitudeProgram,
		addValueProgram,
	} = GPUIO;

	// More info about these parameters given in Jones 2010:
	// "Characteristics of pattern formation and evolution in approximations of Physarum transport networks."
	// Nice overview and examples at https://cargocollective.com/sagejenson/physarum
	const PARAMS = {
		decayFactor: 0.9,
		depositAmount: 4,
		particleDensity: 0.35,
		sensorDistance: 18, 
		sensorAngle: 5.5,
		stepSize: 2,
		rotationAngle: 45,
		renderAmplitude: 0.03,
		currentPreset: 'Fibers',
		setFibers: () => {
			const settings = {
				decayFactor: 0.9,
				depositAmount: 4,
				particleDensity: 0.35,
				sensorDistance: 18, 
				sensorAngle: 5.5,
				stepSize: 2,
				rotationAngle: 45,
				renderAmplitude: 0.03,
			};
			setPreset(settings);
		},
		setFingerprint: () => {
			const settings = {
				decayFactor: 0.9,
				depositAmount: 4,
				particleDensity: 0.35,
				sensorDistance: 14,
				sensorAngle: 70,
				stepSize: 1.5,
				rotationAngle: -25,
				renderAmplitude: 0.03,
			};
			setPreset(settings);
		},
		setHoneycomb: () => {
			const settings = {
				decayFactor: 0.9,
				depositAmount: 4,
				particleDensity: 0.35,
				sensorDistance: 7.5,
				sensorAngle: 90,
				stepSize: 2,
				rotationAngle: -45,
				renderAmplitude: 0.03,
			};
			setPreset(settings);
		},
		setNet: () => {
			const settings = {
				decayFactor: 0.9,
				depositAmount: 4,
				particleDensity: 0.35,
				sensorDistance: 18,
				sensorAngle: 90,
				stepSize: 2,
				rotationAngle: -16,
				renderAmplitude: 0.03,
			};
			setPreset(settings);
		},
		setDots: () => {
			const settings = {
				decayFactor: 0.9,
				depositAmount: 4,
				particleDensity: 0.35,
				sensorDistance: 26,
				sensorAngle: 5.5,
				stepSize: 1.5,
				rotationAngle: -70,
				renderAmplitude: 0.03,
			};
			setPreset(settings);
		},
	};

	const canvas = document.createElement('canvas');
	document.body.appendChild(canvas);

	// For better floating point accuracy, break position data into absolute
	// position (xy) plus accumulated displacement (zw).
	// This way small numbers are added together in the accumulated displacement
	// until they are large enough to be combined with the absolute position.
	// This isn't strictly necessary but can help in cases where the code falls
	// back to HALF_FLOAT (if FLOAT is not supported by the device).
	const PARTICLES_NUM_COMPONENTS = 4;

	// Calculate the number of particles and init with random positions and headings.
	function initParticlesArrays() {
		const { width, height } = canvas;
		const numParticles = Math.round(width * height * PARAMS.particleDensity);
		const positions = new Float32Array(numParticles * PARTICLES_NUM_COMPONENTS);
		const heading = new Float32Array(numParticles);
		for (let i = 0; i < numParticles; i++) {
			positions[PARTICLES_NUM_COMPONENTS * i] = Math.random() * width;
			positions[PARTICLES_NUM_COMPONENTS * i + 1] = Math.random() * height;
			positions[PARTICLES_NUM_COMPONENTS * i + 2] = 0;
			positions[PARTICLES_NUM_COMPONENTS * i + 3] = 0;
			heading[i] = Math.random() * Math.PI * 2;
		}
		return { positions, heading, numParticles };
	}

	// The composer orchestrates all of the GPU operations.
	const composer = new GPUComposer({ canvas, glslVersion, contextID });
	
	/**
	 * Init particles state and programs.
	 */
	const { positions, heading, numParticles } = initParticlesArrays();
	// Init particles position data on GPU.
	const particlesPositions = new GPULayer(composer, {
		name: 'particlesPositions',
		dimensions: numParticles,
		numComponents: PARTICLES_NUM_COMPONENTS,
		type: FLOAT,
		numBuffers: 2,
		array: positions,
	});
	// Init particles heading (orientation) data on GPU.
	const particlesHeading = new GPULayer(composer, {
		name: 'particlesHeading',
		dimensions: numParticles,
		numComponents: 1,
		type: FLOAT,
		numBuffers: 2,
		array: heading,
	});
	// Fragment shader program for updating particles position and heading.
	const updateParticles = new GPUProgram(composer, {
		name: 'updateParticles',
		fragmentShader: `
			in vec2 v_uv;

			#define TWO_PI 6.28318530718

			uniform sampler2D u_particlesHeading;
			uniform sampler2D u_particlesPositions;
			uniform sampler2D u_trail;
			uniform vec2 u_dimensions;
			uniform float u_sensorAngle;
			uniform float u_sensorDistance;
			uniform float u_rotationAngle;
			uniform bool u_randomDir;
			uniform float u_stepSize;

			layout (location = 0) out float out_heading; // Output at index 0.
			layout (location = 1) out vec4 out_position; // Output at index 1.

			float sense(vec2 position, float angle) {
				vec2 sensePosition = position + u_sensorDistance * vec2(cos(angle), sin(angle));
				return texture(u_trail, sensePosition / u_dimensions).x;
			}

			void main() {
				float heading = texture(u_particlesHeading, v_uv).r;

				// Add absolute position plus displacement to get position.
				vec4 positionInfo = texture(u_particlesPositions, v_uv);
				// Add absolute position plus displacement to get position.
				vec2 absolute = positionInfo.xy;
				vec2 displacement = positionInfo.zw;
				vec2 position = absolute + displacement;
				// Get location of particle in trail state (different that v_uv, which is UV coordinate in particles arrays).
				vec2 trailUV = position / u_dimensions;

				// Sense and rotate.
				float middleState = sense(position, heading);
				float leftState = sense(position, heading + u_sensorAngle);
				float rightState = sense(position, heading - u_sensorAngle);
				// Using some tricks here to remove conditionals (they cause significant slowdowns).
				// Leaving the old code here for clarity, replaced by the lines below.
					// if (middleState > rightState && middleState < leftState) {
					// 	// Rotate left.
					// 	heading += u_rotationAngle;
					// } else if (middleState < rightState && middleState > leftState) {
					// 	// Rotate right.
					// 	heading -= u_rotationAngle;
					// } else if (middleState < rightState && middleState < leftState) {
					// 	// Choose randomly.
					// 	heading += u_rotationAngle * (u_randomDir ? 1.0 : -1.0);
					// } // else do nothing.
				// The following lines give the same result without conditionals.
				float rightWeight = step(middleState, rightState);
				float leftWeight = step(middleState, leftState);
				heading += mix(
					rightWeight * mix(u_rotationAngle, -u_rotationAngle, float(u_randomDir)),
					mix(u_rotationAngle, -u_rotationAngle, rightWeight),
					abs(leftWeight - rightWeight)
				);

				// Wrap heading around 2PI.
				heading = mod(heading + TWO_PI, TWO_PI);
				out_heading = heading;

				// Move in direction of heading.
				vec2 move = u_stepSize * vec2(cos(heading), sin(heading));
				vec2 nextDisplacement = displacement + move;
				
				// If displacement is large enough, merge with abs position.
				// This method reduces floating point error in position.
				// Using some tricks here to remove conditionals (they cause significant slowdowns).
				// Leaving the old code here for clarity, replaced by the lines below.
					// if (dot(nextDisplacement, nextDisplacement) > 30.0) {
					// 	absolute += nextDisplacement;
					// 	nextDisplacement = vec2(0);
					// 	// Also check if we've wrapped.
					// 	if (absolute.x < 0.0) {
					// 		absolute.x = absolute.x + u_dimensions.x;
					// 	} else if (absolute.x >= u_dimensions.x) {
					// 		absolute.x = absolute.x - u_dimensions.x;
					// 	}
					// 	if (absolute.y < 0.0) {
					// 		absolute.y = absolute.y + u_dimensions.y;
					// 	} else if (absolute.y >= u_dimensions.y) {
					// 		absolute.y = absolute.y - u_dimensions.y;
					// 	}
					// }
				// The following lines give the same result without conditionals.
				float shouldMerge = step(30.0, dot(nextDisplacement, nextDisplacement));
				absolute = mod(absolute + shouldMerge * nextDisplacement + u_dimensions, u_dimensions);
				nextDisplacement *= (1.0 - shouldMerge);

				out_position = vec4(absolute, nextDisplacement);
			}`,
		uniforms: [
			{ // Index of particlesHeading GPULayer in "input" array.
				name: 'u_particlesHeading',
				value: 0,
				type: INT,
			},
			{ // Index of particlesPositions GPULayer in "input" array.
				name: 'u_particlesPositions',
				value: 1,
				type: INT,
			},
			{ // Index of trail GPULayer in "input" array.
				name: 'u_trail',
				value: 2,
				type: INT,
			},
			{
				name: 'u_dimensions',
				value: [canvas.width, canvas.height],
				type: FLOAT,
			},
			{
				name: 'u_sensorAngle',
				value: PARAMS.sensorAngle * Math.PI / 180,
				type: FLOAT,
			},
			{
				name: 'u_sensorDistance',
				value: PARAMS.sensorDistance,
				type: FLOAT,
			},
			{
				name: 'u_rotationAngle',
				value: PARAMS.rotationAngle * Math.PI / 180,
				type: FLOAT,
			},
			{
				name: 'u_randomDir',
				value: false,
				type: BOOL,
			},
			{
				name: 'u_stepSize',
				value: PARAMS.stepSize,
				type: FLOAT,
			},
		],
	});

	/**
	 * Init chemical trail state and programs.
	 */
	// Init a GPULayer to contain trail data at full size of screen.
	const trail = new GPULayer(composer, {
		name: 'trail',
		dimensions: [canvas.width, canvas.height],
		numComponents: 1,
		type: FLOAT,
		filter: LINEAR,
		numBuffers: 2,
		wrapX: REPEAT,
		wrapY: REPEAT,
	});
	// Fragment shader program for adding chemical attractant from particles to trail layer.
	const deposit = addValueProgram(composer, {
		name: 'deposit',
		type: trail.type,
		value: PARAMS.depositAmount,
	});
	// Fragment shader program for diffusing trail state.
	const diffuseAndDecay = new GPUProgram(composer, {
		name: 'diffuseAndDecay',
		fragmentShader: `
			in vec2 v_uv;

			uniform sampler2D u_trail;
			uniform float u_decayFactor;
			uniform vec2 u_pxSize;
			uniform int u_numParticles;

			out float out_state;

			void main() {
				vec2 halfPx = u_pxSize / 2.0;
				// Use built-in linear interpolation to reduce 9 samples to 4.
				// This is not the same as the flat kernel described in Jones 2010.
				// This kernel has weighting:
				// 1/16 1/8 1/16
				// 1/8  1/4  1/8
				// 1/16 1/8 1/16
				float prevStateNE = texture(u_trail, v_uv + halfPx).x;
				float prevStateNW = texture(u_trail, v_uv + vec2(-halfPx.x, halfPx.y)).x;
				float prevStateSE = texture(u_trail, v_uv + vec2(halfPx.x, -halfPx.y)).x;
				float prevStateSW = texture(u_trail, v_uv - halfPx).x;
				float diffusedState = (prevStateNE + prevStateNW + prevStateSE + prevStateSW) / 4.0;
				out_state = u_decayFactor * diffusedState;
			}`,
		uniforms: [
			{ // Index of trail GPULayer in "input" array.
				name: 'u_trail',
				value: 0, // We don't even really need to set this uniform, bc all uniforms default to zero.
				type: INT,
			},
			{
				name: 'u_decayFactor',
				value: PARAMS.decayFactor,
				type: FLOAT,
			},
			{
				name: 'u_pxSize',
				value: [1 / canvas.width, 1 / canvas.height],
				type: FLOAT,
			},
		],
	});
	// Fragment shader program for rendering trail state to screen (with a scaling factor).
	const render = renderAmplitudeProgram(composer, {
		name: 'render',
		type: trail.type,
		components: 'x',
		scale: PARAMS.renderAmplitude,
	});

	/**
	 * This loop is where all the action happens.
	 */
	function loop() {
		// Update randomDir uniform by coin flip - the same value will be applied to all particles
		// in the system, which is a bit of an oversimplification, but seems to work fine.
		// Would be more realistic to pick randomDir within each fragment shader kernel,
		// but this is easier + faster.
		updateParticles.setUniform('u_randomDir', Math.random() < 0.5);
		// Update each particle's heading and position.
		composer.step({
			program: updateParticles,
			input: [particlesHeading, particlesPositions, trail],
			output: [particlesHeading, particlesPositions],
		});

		// Render particles' positions on top of trail layer to apply chemical
		// attractant to trail.  Technically this is still not quite right bc overlapping
		// particles will get merged together and only count once, but it seems to work fine anyway.
		// Jones 2010 described a collision detection scheme that could avoid this overlap issue,
		// but none of that is implemented in this code for simplicity.
		composer.drawLayerAsPoints({
			layer: particlesPositions,
			program: deposit,
			input: trail,
			output: trail,
			pointSize: 1,
			wrapX: true,
			wrapY: true,
		});

		// Diffuse trail state and apply decay factor.
		composer.step({
			program: diffuseAndDecay,
			input: trail,
			output: trail,
		});

		// Draw to screen.
		composer.step({
			program: render,
			input: trail,
		});
	}

	// Touch events.
	const activeTouches = {};
	const TOUCH_DIAMETER = 25;
	function onPointerMove(e) {
		const lastPosition = activeTouches[e.pointerId];
		if (lastPosition) {
			const currentPosition = [e.clientX, canvas.height - e.clientY];
			composer.stepSegment({
				program: deposit,
				input: trail,
				output: trail,
				position1: currentPosition,
				position2: lastPosition,
				thickness: TOUCH_DIAMETER,
				endCaps: true,
			});
			activeTouches[e.pointerId] = currentPosition;
		}
		
	}
	function onPointerStop(e) {
		delete activeTouches[e.pointerId];
	}
	function onPointerStart(e) {
		const currentPosition = [e.clientX, canvas.height - e.clientY];
		composer.stepCircle({
			program: deposit,
			input: trail,
			output: trail,
			position: currentPosition,
			diameter: TOUCH_DIAMETER,
		});
		activeTouches[e.pointerId] = currentPosition;
	}
	canvas.addEventListener('pointermove', onPointerMove);
	canvas.addEventListener('pointerdown', onPointerStart);
	canvas.addEventListener('pointerup', onPointerStop);
	canvas.addEventListener('pointerout', onPointerStop);
	canvas.addEventListener('pointercancel', onPointerStop);

	// Add 'p' hotkey to print screen.
	function savePNG() {
		composer.step({
			program: render,
			input: trail,
		});
		composer.savePNG({ filename: 'physarum' });
	}
	function onKeydown(e) {
		if (e.key === 'p') {
			savePNG();
		}
	}
	window.addEventListener('keydown', onKeydown);

	/**
	 * Init a simple GUI.
	 */
	 function getParticlesFolderTitle() {
		return `Particles (${particlesPositions.length.toLocaleString("en-US")})`;
	}
	const ui = [];
	const particlesGUI = pane.addFolder({
		expanded: true,
 		title: getParticlesFolderTitle(),
	});
	particlesGUI.addInput(PARAMS, 'sensorAngle', { min: 0, max: 180, step: 0.01, label: 'Sensor Angle' }).on('change', (e) => {
		updateParticles.setUniform('u_sensorAngle', PARAMS.sensorAngle * Math.PI / 180);
	});
	particlesGUI.addInput(PARAMS, 'sensorDistance', { min: 1, max: 30, step: 0.01, label: 'Sensor Distance' }).on('change', (e) => {
		updateParticles.setUniform('u_sensorDistance', PARAMS.sensorDistance);
	});
	particlesGUI.addInput(PARAMS, 'rotationAngle', { min: -90, max: 90, step: 0.01, label: 'Rotation Angle' }).on('change', (e) => {
		updateParticles.setUniform('u_rotationAngle', PARAMS.rotationAngle * Math.PI / 180);
	});
	particlesGUI.addInput(PARAMS, 'stepSize', { min: 0.01, max: 3, step: 0.01, label: 'Step Size' }).on('change', (e) => {
		updateParticles.setUniform('u_stepSize', PARAMS.stepSize);
	});
	particlesGUI.addInput(PARAMS, 'particleDensity', { min: 0.01, max: 1, step: 0.01, label: 'Particle Density' }).on('change', (e) => {
		// Init new particles when particle density changes.
		const { positions, heading, numParticles } = initParticlesArrays();
		particlesPositions.resize(numParticles, positions);
		particlesHeading.resize(numParticles, heading);
		particlesGUI.title = getParticlesFolderTitle();
	});
	const trailsGUI = pane.addFolder({
		expanded: false,
 		title: 'Trails',
	});
	trailsGUI.addInput(PARAMS, 'stepSize', { min: 0, max: 10, step: 0.01, label: 'Deposit Amount' }).on('change', (e) => {
		deposit.setUniform('u_value', PARAMS.stepSize);
	});
	trailsGUI.addInput(PARAMS, 'decayFactor', { min: 0, max: 1, step: 0.01, label: 'Decay Factor' }).on('change', (e) => {
		diffuseAndDecay.setUniform('u_decayFactor', PARAMS.decayFactor);
	});
	const renderGUI = pane.addFolder({
		expanded: false,
 		title: 'Render Settings',
	});
	renderGUI.addInput(PARAMS, 'renderAmplitude', { min: 0, max: 1, step: 0.01, label: 'Amplitude' }).on('change', (e) => {
		render.setUniform('u_scale', PARAMS.renderAmplitude);
	});
	// Interesting presets to try out.
	ui.push(pane.addInput(PARAMS, 'currentPreset', {
		options: {
			Net: 'Net',
			Dots: 'Dots',
			Honeycomb: 'Honeycomb',
			Fingerprint: 'Fingerprint',
			Fibers: 'Fibers',
		},
		label: 'Presets',
	}).on('change', () => {
		PARAMS[`set${PARAMS.currentPreset}`]();
	}));
	function setPreset(settings) {
		for (let key in settings) {
			PARAMS[key] = settings[key];
		}
		particlesGUI.children.forEach(child => child.refresh());
		reset();
	}
	ui.push(pane.addButton({ title: 'Reset' }).on('click', reset));
	ui.push(pane.addButton({ title: 'Save PNG (p)' }).on('click', savePNG));

	// Resize if needed.
	window.addEventListener('resize', onResize);
	function onResize() {
		const width = window.innerWidth;
		const height = window.innerHeight;

		// Resize composer.
		composer.resize([width, height]);

		// Init new particles.
		const { positions, heading, numParticles } = initParticlesArrays();
		particlesPositions.resize(numParticles, positions);
		particlesHeading.resize(numParticles, heading);

		// Update trail dimensions.
		trail.resize([width, height]);

		// Update px size and dimensions uniforms.
		diffuseAndDecay.setUniform('u_pxSize', [1 / width, 1 / height]);
		updateParticles.setUniform('u_dimensions', [width, height]);
	}

	// Reset the system.
	function reset() {
		updateParticles.setUniform('u_sensorAngle', PARAMS.sensorAngle * Math.PI / 180);
		updateParticles.setUniform('u_sensorDistance', PARAMS.sensorDistance);
		updateParticles.setUniform('u_rotationAngle', PARAMS.rotationAngle * Math.PI / 180);
		updateParticles.setUniform('u_stepSize', PARAMS.stepSize);
		deposit.setUniform('u_value', PARAMS.depositAmount);
		diffuseAndDecay.setUniform('u_decayFactor', PARAMS.decayFactor);
		render.setUniform('u_scale', PARAMS.renderAmplitude);
		trail.clear();
		onResize();
	}

	setPreset(); // Kick things off.

	// Garbage collection.
	function dispose() {
		document.body.removeChild(canvas);
		window.removeEventListener('keydown', onKeydown);
		window.removeEventListener('resize', onResize);
		canvas.removeEventListener('pointermove', onPointerMove);
		canvas.removeEventListener('pointerdown', onPointerStart);
		canvas.removeEventListener('pointerup', onPointerStop);
		canvas.removeEventListener('pointerout', onPointerStop);
		canvas.removeEventListener('pointercancel', onPointerStop);
		particlesPositions.dispose();
		particlesHeading.dispose();
		updateParticles.dispose();
		trail.dispose();
		deposit.dispose();
		diffuseAndDecay.dispose();
		render.dispose();
		composer.dispose();
		pane.remove(particlesGUI);
		pane.remove(trailsGUI);
		pane.remove(renderGUI);
		ui.forEach(el => {
			pane.remove(el);
		});
	}
	return {
		loop,
		dispose,
		composer,
		canvas,
	};
}