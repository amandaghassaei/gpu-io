function main({ gui, glslVersion, contextID }) {
	const {
		GPUComposer,
		GPUProgram,
		GPULayer,
		INT,
		BOOL,
		FLOAT,
		REPEAT,
		LINEAR,
	} = GPUIO;

	// More info about these parameters given in Jones 2010:
	// "Characteristics of pattern formation and evolution in approximations of Physarum transport networks."
	// Nice overview and examples at https://cargocollective.com/sagejenson/physarum
	const PARAMS = {
		decayFactor: 0.9,
		depositAmount: 4,
		particleDensity: 0.35,
		sensorDistance: 18,
		sensorAngle: 90,
		stepSize: 2,
		rotationAngle: -16,
		renderAmplitude: 0.03,
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
			for (let key in settings) {
				PARAMS[key] = settings[key];
			}
			reset();
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
			for (let key in settings) {
				PARAMS[key] = settings[key];
			}
			reset();
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
			for (let key in settings) {
				PARAMS[key] = settings[key];
			}
			reset();
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
			for (let key in settings) {
				PARAMS[key] = settings[key];
			}
			reset();
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
			for (let key in settings) {
				PARAMS[key] = settings[key];
			}
			reset();
		},
		reset,
		savePNG: savePNG,
	};
	let shouldSavePNG = false;

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
	 * Note: it would be slightly more efficient to store particlesHeading and particlesPositions
	 * in the same GPULayer and update both at the same time in one GPUProgram (i.e. one GL.draw pass).
	 * They have been separated here for code clarity, but in general you want to minimize
	 * the number of times you call composer.step() in your render loop.
	 */
	const { positions, heading, numParticles } = initParticlesArrays();
	// Init particles position data on GPU.
	const particlesPositions = new GPULayer(composer, {
		name: 'particlesPositions',
		dimensions: numParticles,
		numComponents: PARTICLES_NUM_COMPONENTS,
		type: FLOAT,
		numBuffers: 2,
		writable: true,
		array: positions,
	});
	// Init particles heading (orientation) data on GPU.
	const particlesHeading = new GPULayer(composer, {
		name: 'particlesHeading',
		dimensions: numParticles,
		numComponents: 1,
		type: FLOAT,
		numBuffers: 2,
		writable: true,
		array: heading,
	});
	// Fragment shader program for updating particles heading.
	const rotateParticles = new GPUProgram(composer, {
		name: 'rotateParticles',
		fragmentShader: `
			in vec2 v_UV;

			#define TWO_PI 6.28318530718

			uniform sampler2D u_particlesHeading;
			uniform sampler2D u_particlesPositions;
			uniform sampler2D u_trail;
			uniform vec2 u_dimensions;
			uniform float u_sensorAngle;
			uniform float u_sensorDistance;
			uniform float u_rotationAngle;
			uniform bool u_randomDir;

			out float out_fragColor;

			float sense(vec2 position, float angle) {
				vec2 sensePosition = position + u_sensorDistance * vec2(cos(angle), sin(angle));
				return texture(u_trail, sensePosition / u_dimensions).x;
			}

			void main() {
				float heading = texture(u_particlesHeading, v_UV).r;

				// Add absolute position plus displacement to get position.
				vec4 positionInfo = texture(u_particlesPositions, v_UV);
				vec2 position = positionInfo.xy + positionInfo.zw;
				// Get location of particle in trail state (different that v_UV, which is UV coordinate in particles arrays).
				vec2 trailUV = position / u_dimensions;

				// Sense and rotate.
				float middleState = sense(position, heading);
				float leftState = sense(position, heading + u_sensorAngle);
				float rightState = sense(position, heading - u_sensorAngle);
				if (middleState > rightState && middleState < leftState) {
					// Rotate left.
					heading += u_rotationAngle;
				} else if (middleState < rightState && middleState > leftState) {
					// Rotate right.
					heading -= u_rotationAngle;
				} else if (middleState < rightState && middleState < leftState) {
					// Choose randomly.
					heading += u_rotationAngle * (u_randomDir ? 1.0 : -1.0);
				} // else do nothing.

				// Wrap heading around 2PI.
				if (heading < 0.0) heading += TWO_PI;
				else if (heading > TWO_PI) heading -= TWO_PI;

				out_fragColor = heading;
			}`,
		uniforms: [
			{
				name: 'u_particlesHeading',
				value: 0,
				type: INT,
			},
			{
				name: 'u_particlesPositions',
				value: 1,
				type: INT,
			},
			{
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
			}
		],
	});
	// Fragment shader program for updating particles positions.
	const moveParticles = new GPUProgram(composer, {
		name: 'moveParticles',
		fragmentShader: `
			in vec2 v_UV;

			uniform sampler2D u_particlesPositions;
			uniform sampler2D u_particlesHeading;
			uniform vec2 u_dimensions;
			uniform float u_stepSize;

			out vec4 out_fragColor;

			void main() {
				// Add absolute position plus displacement to get position.
				vec4 positionInfo = texture(u_particlesPositions, v_UV);
				vec2 absolute = positionInfo.xy;
				vec2 displacement = positionInfo.zw;
				vec2 position = absolute + displacement;

				// Step in direction of heading.
				float heading = texture(u_particlesHeading, v_UV).r;
				vec2 step = u_stepSize * vec2(cos(heading), sin(heading));
				
				// If displacement is large enough, merge with abs position.
				// This method reduces floating point error in position.
				vec2 nextDisplacement = displacement + step;
				if (dot(nextDisplacement, nextDisplacement) > 30.0) {
					absolute += nextDisplacement;
					nextDisplacement = vec2(0);
					// Also check if we've wrapped.
					if (absolute.x < 0.0) {
						absolute.x = absolute.x + u_dimensions.x;
					} else if (absolute.x >= u_dimensions.x) {
						absolute.x = absolute.x - u_dimensions.x;
					}
					if (absolute.y < 0.0) {
						absolute.y = absolute.y + u_dimensions.y;
					} else if (absolute.y >= u_dimensions.y) {
						absolute.y = absolute.y - u_dimensions.y;
					}
				}
				out_fragColor = vec4(absolute, nextDisplacement);
			}`,
		uniforms: [
			{
				name: 'u_particlesPositions',
				value: 0,
				type: INT,
			},
			{
				name: 'u_particlesHeading',
				value: 1,
				type: INT,
			},
			{
				name: 'u_dimensions',
				value: [canvas.width, canvas.height],
				type: FLOAT,
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
		wrapS: REPEAT,
		wrapT: REPEAT,
		writable: true,
	});
	// Fragment shader program for adding chemical attractant from particles to trail layer.
	const deposit = new GPUProgram(composer, {
		name: 'deposit',
		fragmentShader: `
			in vec2 v_UV;

			uniform sampler2D u_trail;
			uniform float u_depositAmount;

			out float out_fragColor;

			void main() {
				float prevState = texture(u_trail, v_UV).x;
				// Add new state on top of previous.
				out_fragColor = prevState + u_depositAmount;
			}`,
		uniforms: [
			{
				name: 'u_trail',
				value: 0, // We don't even really need to declare this uniform, bc all uniforms default to zero.
				type: INT,
			},
			{
				name: 'u_depositAmount',
				value: PARAMS.depositAmount,
				type: FLOAT,
			},
		],
	});
	// Fragment shader program for diffusing trail state.
	const diffuseAndDecay = new GPUProgram(composer, {
		name: 'diffuseAndDecay',
		fragmentShader: `
			in vec2 v_UV;

			uniform sampler2D u_trail;
			uniform float u_decayFactor;
			uniform vec2 u_pxSize;
			uniform int u_numParticles;

			out float out_fragColor;

			void main() {
				vec2 halfPx = u_pxSize / 2.0;
				// Use built-in interpolation to reduce 9 samples to 4.
				float prevStateNE = texture(u_trail, v_UV + halfPx).x;
				float prevStateNW = texture(u_trail, v_UV + vec2(-halfPx.x, halfPx.y)).x;
				float prevStateSE = texture(u_trail, v_UV + vec2(halfPx.x, -halfPx.y)).x;
				float prevStateSW = texture(u_trail, v_UV - halfPx).x;
				float diffusedState = (prevStateNE + prevStateNW + prevStateSE + prevStateSW) / 4.0;
				out_fragColor = u_decayFactor * diffusedState;
			}`,
		uniforms: [
			{
				name: 'u_trail',
				value: 0, // We don't even really need to declare this uniform, bc all uniforms default to zero.
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
	// Fragment shader program for touch interactions.
	const touch = new GPUProgram(composer, {
		name: 'touch',
		fragmentShader: `
			in vec2 v_UV;
			in vec2 v_UV_local;

			uniform sampler2D u_trail;
			uniform float u_depositAmount;

			out float out_fragColor;

			void main() {
				float distSq = 1.0 - dot(v_UV_local, v_UV_local); // Calc dist from center of touch.
				out_fragColor = texture(u_trail, v_UV).x + distSq * u_depositAmount;
			}`,
		uniforms: [
			{
				name: 'u_trail',
				value: 0, // We don't even really need to declare this uniform, bc all uniforms default to zero.
				type: INT,
			},
			{
				name: 'u_depositAmount',
				value: PARAMS.depositAmount,
				type: FLOAT,
			},
		],
	});
	// Fragment shader program for rendering trail state to screen (with a scaling factor).
	const render = new GPUProgram(composer, {
		name: 'render',
		fragmentShader: `
			in vec2 v_UV;

			uniform sampler2D u_trail;
			uniform float u_renderAmplitude;

			out vec4 out_fragColor;

			void main() {
				float amp = u_renderAmplitude * texture(u_trail, v_UV).x;
				out_fragColor = vec4(amp, amp, amp, 1);
			}`,
		uniforms: [
			{
				name: 'u_trail',
				value: 0, // We don't even really need to declare this uniform, bc all uniforms default to zero.
				type: INT,
			},
			{
				name: 'u_renderAmplitude',
				value: PARAMS.renderAmplitude,
				type: FLOAT,
			}
		],
	});

	/**
	 * Init a simple GUI.
	 */
	function getParticlesFolderTitle() {
		return `Particles (${particlesPositions.length.toLocaleString("en-US")})`;
	}
	const particlesGUI = gui.addFolder(getParticlesFolderTitle());
	particlesGUI.add(PARAMS, 'particleDensity', 0.01, 1, 0.01).listen().onFinishChange(() => {
		// Init new particles when particle density changes.
		const { positions, heading, numParticles } = initParticlesArrays();
		particlesPositions.resize(numParticles, positions);
		particlesHeading.resize(numParticles, heading);
		particlesGUI.name = getParticlesFolderTitle();
	}).name('Particle Density');
	particlesGUI.add(PARAMS, 'sensorAngle', 0, 180, 0.01).listen().onChange((value) => {
		rotateParticles.setUniform('u_sensorAngle', value * Math.PI / 180);
	}).name('Sensor Angle');
	particlesGUI.add(PARAMS, 'sensorDistance', 1, 30, 0.01).listen().onChange((value) => {
		rotateParticles.setUniform('u_sensorDistance', value);
	}).name('Sensor Distance');
	particlesGUI.add(PARAMS, 'rotationAngle', -90, 90, 0.01).listen().onChange((value) => {
		rotateParticles.setUniform('u_rotationAngle', value * Math.PI / 180);
	}).name('Rotation Angle');
	particlesGUI.add(PARAMS, 'stepSize', 0.01, 3, 0.01).listen().onChange((value) => {
		moveParticles.setUniform('u_stepSize', value);
	}).name('Step Size');
	particlesGUI.open();
	const trailsGUI = gui.addFolder('Trails');
	trailsGUI.add(PARAMS, 'depositAmount', 0, 10, 0.01).listen().onChange((value) => {
		deposit.setUniform('u_depositAmount', value);
		touch.setUniform('u_depositAmount', value);
	}).name('Deposit Amount');
	trailsGUI.add(PARAMS, 'decayFactor', 0, 1, 0.01).listen().onChange((value) => {
		diffuseAndDecay.setUniform('u_decayFactor', value);
	}).name('Decay Factor');
	const renderGUI = gui.addFolder('Render Settings');
	renderGUI.add(PARAMS, 'renderAmplitude', 0, 1, 0.01).listen().onChange((value) => {
		render.setUniform('u_renderAmplitude', value);
	}).name('Amplitude');
	// Interesting presets to try out.
	const presetsGUI = gui.addFolder('Presets');
	presetsGUI.add(PARAMS, 'setFibers').name('Fibers');
	presetsGUI.add(PARAMS, 'setDots').name('Dots');
	presetsGUI.add(PARAMS, 'setHoneycomb').name('Honeycomb');
	presetsGUI.add(PARAMS, 'setFingerprint').name('Fingerprint');	
	presetsGUI.add(PARAMS, 'setNet').name('Net');
	presetsGUI.open();
	const resetButton = gui.add(PARAMS, 'reset').name('Reset');
	const saveButton = gui.add(PARAMS, 'savePNG').name('Save PNG (p)');

	/**
	 * This loop is where all the action happens.
	 */
	function loop() {
		// Update randomDir uniform by coin flip - the same value will be applied to all particles
		// in the system, which is a bit of an oversimplification, but seems to work fine.
		// Would be more realistic to pick randomDir within each fragment shader kernel,
		// but this is easier.
		rotateParticles.setUniform('u_randomDir', Math.random() < 0.5);
		// Update each particle's heading.
		composer.step({
			program: rotateParticles,
			input: [particlesHeading, particlesPositions, trail],
			output: particlesHeading,
		});

		// Move each particle.
		composer.step({
			program: moveParticles,
			input: [particlesPositions, particlesHeading],
			output: particlesPositions,
		});

		// Render particles' positions on top of trail layer to apply chemical
		// attractant to trail.  Technically this is still not quite right bc overlapping
		// particles will get merged together and only count once,
		// but it seems to work fine anyway.
		// Jones 2010 described a collision detection scheme that could avoid this overlap issue,
		// but none of that is implemented in this code for simplicity.
		composer.drawLayerAsPoints({
			positions: particlesPositions,
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

		// Be sure to call this after we've rendered things.
		if (shouldSavePNG) {
			composer.savePNG({ filename: 'physarum' });
			shouldSavePNG = false;
		}
	}

	// Touch events.
	const activeTouches = {};
	function onPointerMove(e) {
		if (activeTouches[e.pointerId]) {
			composer.stepCircle({
				program: touch,
				input: trail,
				output: trail,
				position: [e.clientX, canvas.height - e.clientY],
				radius: 15,
			});
		}
		
	}
	function onPointerStop(e) {
		delete activeTouches[e.pointerId];
	}
	function onPointerStart(e) {
		activeTouches[e.pointerId] = true;
	}
	window.addEventListener('pointermove', onPointerMove);
	window.addEventListener('pointerdown', onPointerStart);
	window.addEventListener('pointerup', onPointerStop);
	window.addEventListener('pointerout', onPointerStop);
	window.addEventListener('pointercancel', onPointerStop);

	// Add 'p' hotkey to print screen.
	function savePNG() {
		// Save png on next render loop.
		shouldSavePNG = true;
	}
	function onKeydown(e) {
		if (e.key === 'p') {
			savePNG();
		}
	}
	window.addEventListener('keydown', onKeydown);

	// Resize if needed.
	window.addEventListener('resize', onResize);
	function onResize() {
		const width = window.innerWidth;
		const height = window.innerHeight;

		// Resize composer.
		composer.resize(width, height);

		// Init new particles.
		const { positions, heading, numParticles } = initParticlesArrays();
		particlesPositions.resize(numParticles, positions);
		particlesHeading.resize(numParticles, heading);

		// Update trail dimensions.
		trail.resize([width, height]);

		// Update px size and dimensions uniforms.
		diffuseAndDecay.setUniform('u_pxSize', [1 / width, 1 / height]);
		moveParticles.setUniform('u_dimensions', [width, height]);
		rotateParticles.setUniform('u_dimensions', [width, height]);
	}
	onResize();

	// Reset the system.
	function reset() {
		rotateParticles.setUniform('u_sensorAngle', PARAMS.sensorAngle * Math.PI / 180);
		rotateParticles.setUniform('u_sensorDistance', PARAMS.sensorDistance);
		rotateParticles.setUniform('u_rotationAngle', PARAMS.rotationAngle * Math.PI / 180);
		moveParticles.setUniform('u_stepSize', PARAMS.stepSize);
		deposit.setUniform('u_depositAmount', PARAMS.depositAmount);
		diffuseAndDecay.setUniform('u_decayFactor', PARAMS.decayFactor);
		render.setUniform('u_renderAmplitude', PARAMS.renderAmplitude);
		trail.clear();
		onResize();
	}

	// Garbage collection.
	function dispose() {
		document.body.removeChild(canvas);
		window.removeEventListener('keydown', onKeydown);
		window.removeEventListener('resize', onResize);
		window.removeEventListener('pointermove', onPointerMove);
		window.removeEventListener('pointerdown', onPointerStart);
		window.removeEventListener('pointerup', onPointerStop);
		window.removeEventListener('pointerout', onPointerStop);
		window.removeEventListener('pointercancel', onPointerStop);
		particlesPositions.dispose();
		particlesHeading.dispose();
		rotateParticles.dispose();
		moveParticles.dispose();
		trail.dispose();
		deposit.dispose();
		diffuseAndDecay.dispose();
		touch.dispose();
		render.dispose();
		composer.dispose();
		gui.removeFolder(particlesGUI);
		gui.removeFolder(trailsGUI);
		gui.removeFolder(presetsGUI);
		gui.removeFolder(renderGUI);
		gui.remove(resetButton);
		gui.remove(saveButton);
	}
	return {
		loop,
		dispose,
		composer,
	};
}