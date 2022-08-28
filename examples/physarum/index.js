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
	} = WebGLCompute;

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
	}

	const canvas = document.createElement('canvas');
	document.body.appendChild(canvas);

	// For better floating point accuracy, break position data into absolute
	// position (xy) plus accumulated displacement (zw).
	// This way small numbers are added together in the accumulated displacement
	// until they are large enough to be combined with the absolute position.
	const PARTICLES_NUM_COMPONENTS = 4;

	function initParticlesArrays() {
		const { width, height } = canvas;
		// Init new random state.
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

	const composer = new GPUComposer({ canvas, glslVersion, contextID });
	const { positions, heading, numParticles } = initParticlesArrays();
	const particlesPositions = new GPULayer(composer, {
		name: 'particlesPositions',
		dimensions: numParticles,
		numComponents: PARTICLES_NUM_COMPONENTS,
		type: FLOAT,
		numBuffers: 2,
		writable: true,
		array: positions,
	});
	const particlesHeading = new GPULayer(composer, {
		name: 'particlesHeading',
		dimensions: numParticles,
		numComponents: 1,
		type: FLOAT,
		numBuffers: 2,
		writable: true,
		array: heading,
	});
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
				if (dot(nextDisplacement, nextDisplacement) > 10.0) {
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
				value: 0, // We don't even really need to declare this, bc all uniforms default to zero.
				type: INT,
			},
			{
				name: 'u_depositAmount',
				value: PARAMS.depositAmount,
				type: FLOAT,
			},
		],
	});
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
				value: 0, // We don't even really need to declare this, bc all uniforms default to zero.
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
				value: 0, // We don't even really need to declare this, bc all uniforms default to zero.
				type: INT,
			},
			{
				name: 'u_renderAmplitude',
				value: PARAMS.renderAmplitude,
				type: FLOAT,
			}
		],
	});

	// Init simple GUI.
	function getParticlesFolderTitle() {
		return `Particles (${particlesPositions.length.toLocaleString("en-US")})`;
	}
	const particlesGUI = gui.addFolder(getParticlesFolderTitle());
	particlesGUI.add(PARAMS, 'particleDensity', 0.01, 1, 0.01).listen().onFinishChange(() => {
		// Init new particles.
		const { positions, heading, numParticles } = initParticlesArrays();
		particlesPositions.resize(numParticles, positions);
		particlesHeading.resize(numParticles, heading);
		particlesGUI.name = getParticlesFolderTitle();
	}).name('Particle Density');
	particlesGUI.add(PARAMS, 'sensorAngle', 0, 180, 0.01).listen().onChange((value) => {
		rotateParticles.setUniform('u_sensorAngle', value * Math.PI / 180);
	}).name('Sensor Angle');
	// From Jones 2010: "minimum distance of 3 pixels offset is necessary for the complex behaviors to emerge"
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
	}).name('Deposit Amount');
	trailsGUI.add(PARAMS, 'decayFactor', 0, 1, 0.01).listen().onChange((value) => {
		diffuseAndDecay.setUniform('u_decayFactor', value);
	}).name('Decay Factor');
	const renderGUI = gui.addFolder('Render Settings');
	renderGUI.add(PARAMS, 'renderAmplitude', 0, 1, 0.01).listen().onChange((value) => {
		render.setUniform('u_renderAmplitude', value);
	}).name('Amplitude');
	const presetsGUI = gui.addFolder('Presets');
	presetsGUI.add(PARAMS, 'setFibers').name('Fibers');
	presetsGUI.add(PARAMS, 'setDots').name('Dots');
	presetsGUI.add(PARAMS, 'setHoneycomb').name('Honeycomb');
	presetsGUI.add(PARAMS, 'setFingerprint').name('Fingerprint');	
	presetsGUI.add(PARAMS, 'setNet').name('Net');
	presetsGUI.open();
	gui.add(PARAMS, 'reset').name('Reset');
	gui.add(PARAMS, 'savePNG').name('Save PNG (p)');

	function loop() {
		// Update randomDir uniform by coin flip.
		rotateParticles.setUniform('u_randomDir', Math.random() < 0.5);
		composer.step({
			program: rotateParticles,
			input: [particlesHeading, particlesPositions, trail],
			output: particlesHeading,
		});
		composer.step({
			program: moveParticles,
			input: [particlesPositions, particlesHeading],
			output: particlesPositions,
		});

		composer.drawLayerAsPoints({
			positions: particlesPositions,
			program: deposit,
			input: trail,
			output: trail,
			pointSize: 1,
			wrapX: true,
			wrapY: true,
		});

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

	function savePNG() {
		trail.savePNG({ filename: 'physarum', multiplier: 255 * PARAMS.renderAmplitude });
	}

	// Add 'p' hotkey to print screen.
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

	function dispose() {
		document.body.removeChild(canvas);
		window.removeEventListener('keydown', onKeydown);
		window.removeEventListener('resize', onResize);
		particlesPositions.dispose();
		particlesHeading.dispose();
		rotateParticles.dispose();
		moveParticles.dispose();
		trail.dispose();
		deposit.dispose();
		diffuseAndDecay.dispose();
		render.dispose();
		composer.dispose();
		gui.removeFolder(particlesGUI);
		gui.removeFolder(trailsGUI);
		gui.removeFolder(presetsGUI);
		gui.removeFolder(renderGUI);
	}
	return {
		loop,
		dispose,
		composer,
	};
}