function runWithOlderWebGLVersion({ gui, contextID, glslVersion }) {
	const {
		GPUComposer,
		GPUProgram,
		GPULayer,
		FLOAT,
		INT,
		REPEAT,
		renderSignedAmplitudeProgram,
		copyProgram,
		LINEAR,
		NEAREST,
		WEBGL2,
		GLSL1,
	} = GPUIO;
	const {
		Scene,
		PerspectiveCamera,
		WebGLRenderer,
		WebGL1Renderer,
		BufferGeometry,
		MeshBasicMaterial,
		Mesh,
		Texture,
		BufferAttribute,
		OrbitControls,
		DoubleSide,
		Color,
		LineSegments,
		PlaneGeometry,
	} = THREE;

	const PARAMS = {
		reset,
		savePNG,
		saveTexturePNG,
	};

	// Size of the simulation.
	const TEXTURE_DIM = [100, 100];
	// Some simulation constants.
	// https://beltoforion.de/en/recreational_mathematics/2d-wave-equation.php
	const DT = 1;
	const DX = 1;
	const C = 0.25; // Wave propagation speed.
	const ALPHA = (C * DT / DX) ** 2;
	const DECAY = 0.99;
	// Drop parameters.
	const NUM_FRAMES_BETWEEN_DROPS = 75;
	const DROP_DIAMETER = 10;
	// Grid mesh amplitude scale.
	const GRID_MESH_Y_SCALE = 3;

	// Init threejs objects.
	const scene = new Scene();
	scene.background = new Color(0xececec);
	const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.zoom = 7;
	camera.position.set(5, 5, 5);

	const canvas = document.createElement('canvas');
	const context = canvas.getContext(contextID);
	const renderer = contextID === WEBGL2 ? new WebGLRenderer({ context, context, antialias: true }) : new WebGL1Renderer({ canvas, context, antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(canvas);

	const controls = new OrbitControls(camera, canvas);
	controls.panSpeed = 1 / camera.zoom;

	// Init a plane with texture containing the simulation rendered in color.
	const planeTexture = new Texture();
	const plane = new Mesh(new PlaneGeometry(1, 1), new MeshBasicMaterial({ map: planeTexture, side: DoubleSide }));
	plane.rotateX(-Math.PI / 2);
	plane.rotateZ(-Math.PI / 2);
	plane.position.y = -0.15;
	scene.add(plane);

	// Init 3D grid surface rendering simulation as height.
	const gridGeometry = new BufferGeometry();
	const gridPositions = new Float32Array(3 * TEXTURE_DIM[0] * TEXTURE_DIM[1]);
	// WebGL1 does not support gl_VertexID, so we need to pass in an extra attribute.
	// This attribute has to be of type float bc WebGL1 does not support int attributes.
	const gridVertexID = new Float32Array(TEXTURE_DIM[0] * TEXTURE_DIM[1]);
	const gridIndices = new Uint32Array(2 * ((TEXTURE_DIM[0] - 1) * TEXTURE_DIM[1] + (TEXTURE_DIM[1] - 1) * TEXTURE_DIM[0]));
	let gridSegmentIndex = 0;
	for (let j = 0; j < TEXTURE_DIM[1]; j++) {
		for (let i = 0; i < TEXTURE_DIM[0]; i++){
			const index = TEXTURE_DIM[0] * i + j;
			// Set the x and z values of gridPositions array (y is up).
			gridPositions[3 * index] = (i - (TEXTURE_DIM[0] - 1) / 2) / TEXTURE_DIM[0];
			gridPositions[3 * index + 2] = (j - (TEXTURE_DIM[1] - 1) / 2) / TEXTURE_DIM[1];
			gridVertexID[index] = index;
			// Form line segments of the grid mesh.
			if (j < TEXTURE_DIM[1] - 1) {
				gridIndices[2 * gridSegmentIndex] = index;
				gridIndices[2 * gridSegmentIndex + 1] = index + 1;
				gridSegmentIndex += 1;
			}
			if (i < TEXTURE_DIM[0] - 1) {
				gridIndices[2 * gridSegmentIndex] = index;
				gridIndices[2 * gridSegmentIndex + 1] = index + TEXTURE_DIM[0];
				gridSegmentIndex += 1;
			}
		}
	}
	gridGeometry.setAttribute('position', new BufferAttribute(gridPositions, 3));
	gridGeometry.setAttribute('vertexID', new BufferAttribute(gridVertexID, 1));
	gridGeometry.setIndex(new BufferAttribute(gridIndices, 1));
	const gridTexture = new Texture();
	const gridMaterial = new THREE.ShaderMaterial( {
		uniforms: {
			u_height: { value: gridTexture },
			u_heightDimensions: { value: TEXTURE_DIM },
		},
		vertexShader: `
			attribute float vertexID;
			uniform sampler2D u_height;
			uniform ivec2 u_heightDimensions;

			vec2 getTextureUV(const int vertexIndex, const ivec2 dimensions) {
				int y = vertexIndex / dimensions.x;
				int x = vertexIndex - dimensions.x * y;
				float u = (float(x) + 0.5) / float(dimensions.x);
				float v = (float(y) + 0.5) / float(dimensions.y);
				return vec2(u, v);
			}

			void main() 
			{
				vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
				vec4 position = projectionMatrix * modelViewPosition;

				vec2 uv = getTextureUV(${contextID === WEBGL2 ? 'gl_VertexID' : 'int(vertexID)'}, u_heightDimensions);
				// Set height of grid mesh using data from simulation.
				position.y += ${GRID_MESH_Y_SCALE.toFixed(6)} * texture2D(u_height, uv).x;

				gl_Position = position;
			}
			`,
		fragmentShader: `
			void main() {
				gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
			}
			`,
		glslVersion: THREE.GLSL1,
	});
	grid = new LineSegments(gridGeometry, gridMaterial);
	grid.scale.set(1, 1, 1);
	grid.position.y = 0.15;
	scene.add(grid);

	const composer = GPUComposer.initWithThreeRenderer(renderer, { glslVersion });

	// Init a layer of float data to store height.
	// I'm using a trick to use both the currentState and lastState of this GPULayer
	// as inputs to the wave function GPUProgram.  You could also store these as separate
	// GPULayers if you wanted.
	const height = new GPULayer(composer, {
		name: 'height',
		dimensions: TEXTURE_DIM,
		numComponents: 1, // x component is height.
		type: FLOAT,
		filter: NEAREST, // Prefer NEAREST filtering if you do not need to measure subpixel values.
		numBuffers: 3, // Use 3 buffers so we can pass currentState + lastState as inputs and write to the third buffer.
		wrapX: REPEAT,
		wrapY: REPEAT,
	});
	
	// On each render cycle, we will render a colored image based on height into this RGB object.
	// This is what we will bind to a threejs texture mapped to the plane.
	const colorMap = new GPULayer(composer, {
		name: 'colorMap',
		dimensions: TEXTURE_DIM,
		numComponents: 3, // RGB
		type: FLOAT,
		// Use linear filtering for colorMap to avoid aliasing when textured object is small/far from threejs camera.
		filter: LINEAR,
	});
	// Link colorMap's WebGLTexure to threejs Texture object.
	colorMap.attachToThreeTexture(planeTexture);

	// On each render cycle, we will render the height into a single channel texture.
	// This is what we will bind to a threejs texture mapped to the mesh.
	const heightMap = new GPULayer(composer, {
		name: 'heightMap',
		dimensions: TEXTURE_DIM,
		numComponents: 1,
		type: FLOAT,
		filter: NEAREST,
	});
	// Link heightMap's WebGLTexure to threejs Texture object.
	heightMap.attachToThreeTexture(gridTexture);

	// Init a program to apply wave function.
	const waveProgram = new GPUProgram(composer, {
		name: 'wave',
		fragmentShader: `
			in vec2 v_uv;

			uniform sampler2D u_height;
			uniform sampler2D u_lastHeight;
			uniform vec2 u_pxSize;

			out float out_result;

			void main() {
				// Compute the discrete Laplacian on the height.
				// https://en.wikipedia.org/wiki/Discrete_Laplace_operator
				float current = texture(u_height, v_uv).x;
				float last = texture(u_lastHeight, v_uv).x;
				vec2 onePxX = vec2(u_pxSize.x, 0);
				vec2 onePxY = vec2(0, u_pxSize.y);
				float n = texture(u_height, v_uv + onePxY).x;
				float s = texture(u_height, v_uv - onePxY).x;
				float e = texture(u_height, v_uv + onePxX).x;
				float w = texture(u_height, v_uv - onePxX).x;
				// Solve discrete wave equation.
				float laplacian = n + s + e + w - 4.0 * current;
				// Add a decay factor slightly less than 1 to dampen.
				out_result = ${DECAY.toFixed(6)} * (${ALPHA.toFixed(6)} * laplacian + 2.0 * current - last);
			}
		`,
		uniforms: [
			{ // Index of sampler2D uniform to assign to value "u_height".
				name: 'u_height',
				value: 0,
				type: INT,
			},
			{ // Index of sampler2D uniform to assign to value "u_lastHeight".
				name: 'u_lastHeight',
				value: 1,
				type: INT,
			},
			{ // Calculate the size of a 1 px step in UV coordinates.
				name: 'u_pxSize',
				value: [1 / TEXTURE_DIM[0], 1 / TEXTURE_DIM[1]],
				type: FLOAT,
			},
		],
	});

	// Init a program to initialize height state in a small drop area.
	const dropProgram = new GPUProgram(composer, {
		name: 'drop',
		fragmentShader: `
			// We get v_uv_local when calling programs via stepCircle().
			// It gives the uv coordinates in the local reference frame of the circle.
			// See https://github.com/amandaghassaei/gpu-io/blob/main/docs/GLSL.md#fragment-shader-inputs
			in vec2 v_uv_local;
			out float out_height;
			void main() {
				// Calculate height so that it's tallest in the center and
				// tapers down toward the outside of the circle.
				// Use dist from center (0.5, 0.5) to compute this.
				vec2 vector = v_uv_local - vec2(0.5);
				out_height = 1.0 - 2.0 * length(vector);
			}
		`,
	});

	// Init a program to render height to colorMap.
	// See https://github.com/amandaghassaei/gpu-io/tree/main/docs#gpuprogram-helper-functions
	// for more built-in GPUPrograms to use.
	const renderColorMap = renderSignedAmplitudeProgram(composer, {
		name: 'renderColorMap',
		type: height.type,
		components: 'x',
		scale: 5,
	});

	// Init a program to render height to heightMap.
	// We can just use a simple copy operation for this.
	const copy = copyProgram(composer, {
		name: 'copy',
		type: height.type,
		components: 'x',
	});

	let numFramesUntilNextDrop = NUM_FRAMES_BETWEEN_DROPS;

	function addDrop() {
		// Initialize a circular region with a drop of height > 0 at a random position.
		const position = [
			(TEXTURE_DIM[0] - 2 * DROP_DIAMETER) * Math.random() + DROP_DIAMETER,
			(TEXTURE_DIM[1] - 2 * DROP_DIAMETER) * Math.random() + DROP_DIAMETER,
		];
		// We need to be sure to write drop height to both lastState and currentState.
		// Write drop to lastState.
		height.decrementBufferIndex();
		composer.stepCircle({
			program: dropProgram,
			position,
			diameter: DROP_DIAMETER,
			output: height,
			useOutputScale: true, // Use the same px scale size as the output GPULayer (otherwise it uses screen px).
		});
		// Write drop to currentState.
		height.incrementBufferIndex();
		composer.stepCircle({
			program: dropProgram,
			position,
			diameter: DROP_DIAMETER,
			output: height,
			useOutputScale: true, // Use the same px scale size as the output GPULayer (otherwise it uses screen px).
		});
		// Reset drop counter.
		numFramesUntilNextDrop = NUM_FRAMES_BETWEEN_DROPS;
	}

	// Simulation/render loop.
	function loop() {
		// Add a drop.
		if (--numFramesUntilNextDrop <= 0) {
			addDrop();
		}

		// Propagate wave and write result to height.
		composer.step({
			program: waveProgram,
			input: [height.currentState, height.lastState],
			output: height,
		});

		// Render current height to colorMap.
		composer.step({
			program: renderColorMap,
			input: height,
			output: colorMap,
		});
		// Copy current height to heightMap.
		composer.step({
			program: copy,
			input: height,
			output: heightMap,
		});

		// Reset three state back to what threejs is expecting (otherwise we get WebGL errors).
		composer.resetThreeState();
		// Render threejs state.
		renderer.render(scene, camera);
	}

	// Init simple GUI.
	const ui = [];
	ui.push(gui.add(PARAMS, 'reset').name('Reset'));
	ui.push(gui.add(PARAMS, 'savePNG').name('Save PNG (p)'));
	ui.push(gui.add(PARAMS, 'saveTexturePNG').name('Save Texture PNG'));

	// Add 'p' hotkey to print screen.
	function savePNG() {
		composer.resetThreeState();
		renderer.render(scene, camera);
		composer.savePNG({ filename: `threejs_scene` });
	}
	function saveTexturePNG() {
		colorMap.savePNG({ filename: `wave_colormap` });
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

		// Resize gpu-io.
		composer.resize([width, height]);

		// Resize threejs.
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
		renderer.setSize(width, height);

		reset();
	}
	onResize();

	function reset() {
		controls.reset();
		// Reset height to zero everywhere.
		// Be sure to call clear twice to clear currentState and lastState.
		height.clear();
		height.incrementBufferIndex();
		height.clear();
		// Add a drop.
		addDrop();
	}

	function dispose() {
		document.body.removeChild(canvas);
		window.removeEventListener('keydown', onKeydown);
		window.removeEventListener('resize', onResize);

		renderer.dispose();
		controls.dispose();

		plane.geometry.dispose();
		planeTexture.dispose();
		plane.material.dispose();
		grid.geometry.dispose();
		gridTexture.dispose();
		grid.material.dispose();

		height.dispose();
		colorMap.dispose();
		heightMap.dispose();

		waveProgram.dispose();
		dropProgram.dispose();
		renderColorMap.dispose();
		copy.dispose();
		
		composer.dispose();
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