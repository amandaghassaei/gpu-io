// Main is called from ../common/wrapper.js
function main({ pane, contextID, glslVersion }) {
	const {
		GPUComposer,
		GPUProgram,
		GPULayer,
		GPUIndexBuffer,
		FLOAT,
		INT,
		REPEAT,
		copyProgram,
		LINEAR,
		NEAREST,
		GLSL3,
	} = GPUIO;
	const {
		Scene,
		PerspectiveCamera,
		WebGLRenderer,
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

	// I've put the WebGL1 code in a separate file to reduce confusion.
	if (glslVersion !== GLSL3) return runWithOlderWebGLVersion({ pane, contextID, glslVersion });
	// The rest of this file assumes WebGL2 and GLSL3.

	const PARAMS = {
		separation: 50, // Separation between wave surface and caustics projection.
		c: 0.15, // Wave propagation speed.
	};

	// Size of the simulation.
	const TEXTURE_DIM = [100, 100];
	const CAUSTICS_TEXTURE_SCALE_FACTOR = 6; // Increase in resolution of caustics texture from TEXTURE_DIM.
	// Some simulation constants.
	// https://beltoforion.de/en/recreational_mathematics/2d-wave-equation.php
	const DT = 1;
	const DX = 1;
	const DECAY = 0.005;
	// Drop parameters.
	const NUM_FRAMES_BETWEEN_DROPS = 150;
	const DROP_DIAMETER = 10;
	// Grid mesh amplitude scale.
	const GRID_MESH_Y_SCALE = 3;
	// Colors.
	const BACKGROUND_COLOR = [54/255, 122/255, 149/255]; // Turquoise color.

	let paused = false;

	// Init threejs objects.
	const scene = new Scene();
	scene.background = new Color(0xdddddd);
	const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.zoom = 7;
	camera.position.set(7, 7, 7);

	const renderer = new WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	const canvas = renderer.domElement;
	document.body.appendChild(canvas);

	const controls = new OrbitControls(camera, canvas);
	controls.enablePan = false;

	// Init a plane with texture containing the caustics simulation rendered in color.
	const planeTexture = new Texture();
	const plane = new Mesh(new PlaneGeometry(1.1, 1.1), new MeshBasicMaterial({ map: planeTexture, side: DoubleSide, transparent: true }));
	plane.rotateX(-Math.PI / 2);
	plane.rotateZ(-Math.PI / 2);
	plane.position.y = -PARAMS.separation / TEXTURE_DIM[0] * 0.5;
	scene.add(plane);

	// Init 3D grid surface rendering simulation as height.
	const gridPositions = new Float32Array(3 * TEXTURE_DIM[0] * TEXTURE_DIM[1]);
	const gridSegmentsIndices = new Uint16Array(2 * ((TEXTURE_DIM[0] - 1) * TEXTURE_DIM[1] + (TEXTURE_DIM[1] - 1) * TEXTURE_DIM[0]));
	const gridMeshIndices = new Uint16Array(6 * (TEXTURE_DIM[0] - 1) * (TEXTURE_DIM[1] - 1));
	let gridSegmentIndex = 0;
	let gridMeshIndex = 0;
	for (let j = 0; j < TEXTURE_DIM[1]; j++) {
		for (let i = 0; i < TEXTURE_DIM[0]; i++){
			const index = TEXTURE_DIM[0] * i + j;
			// Set the x and z values of gridPositions array (y is up).
			gridPositions[3 * index] = (i - (TEXTURE_DIM[0] - 1) / 2) / TEXTURE_DIM[0];
			gridPositions[3 * index + 2] = (j - (TEXTURE_DIM[1] - 1) / 2) / TEXTURE_DIM[1];
			// Form line segments of the grid mesh.
			if (j < TEXTURE_DIM[1] - 1) {
				gridSegmentsIndices[2 * gridSegmentIndex] = index;
				gridSegmentsIndices[2 * gridSegmentIndex + 1] = index + 1;
				gridSegmentIndex += 1;
			}
			if (i < TEXTURE_DIM[0] - 1) {
				gridSegmentsIndices[2 * gridSegmentIndex] = index;
				gridSegmentsIndices[2 * gridSegmentIndex + 1] = index + TEXTURE_DIM[0];
				gridSegmentIndex += 1;
			}
			if (i < TEXTURE_DIM[0] - 1 && j < TEXTURE_DIM[1] - 1) {
				// Form triangles of grid mesh.
				gridMeshIndices[3 * gridMeshIndex] = index;
				gridMeshIndices[3 * gridMeshIndex + 1] = index + 1;
				gridMeshIndices[3 * gridMeshIndex + 2] = index + TEXTURE_DIM[0];
				gridMeshIndex += 1;
				gridMeshIndices[3 * gridMeshIndex] = index + 1;
				gridMeshIndices[3 * gridMeshIndex + 1] = index + TEXTURE_DIM[0] + 1;
				gridMeshIndices[3 * gridMeshIndex + 2] = index + TEXTURE_DIM[0];
				gridMeshIndex += 1;
			}
		}
	}
	// Vertex shader pulls info stored in u_height texture and uses this to update vertex height.
	const vertexShader = `
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

			vec2 uv = getTextureUV(gl_VertexID, u_heightDimensions);
			// Set height of grid mesh using data from gpu-io simulation.
			position.y += ${GRID_MESH_Y_SCALE.toFixed(6)} * texture(u_height, uv).x;

			gl_Position = position;
		}
	`;
	// Init black line segments to visualize grid.
	const gridSegmentsGeometry = new BufferGeometry();
	gridSegmentsGeometry.setAttribute('position', new BufferAttribute(gridPositions, 3));
	gridSegmentsGeometry.setIndex(new BufferAttribute(gridSegmentsIndices, 1));
	const gridTexture = new Texture();
	const gridSegmentsMaterial = new THREE.ShaderMaterial( {
		uniforms: {
			u_height: { value: gridTexture },
			u_heightDimensions: { value: TEXTURE_DIM },
		},
		vertexShader,
		fragmentShader: `
			out vec4 out_color;
			void main() {
				out_color = vec4(0, 0, 0, 1);
			}
			`,
		glslVersion: THREE.GLSL3,
	});
	const gridSegments = new LineSegments(gridSegmentsGeometry, gridSegmentsMaterial);
	gridSegments.position.y = PARAMS.separation / TEXTURE_DIM[0] * 0.5;
	scene.add(gridSegments);
	// Init white semi-transparent mesh under grid.
	const gridMeshGeometry = new BufferGeometry();
	gridMeshGeometry.setAttribute('position', gridSegmentsGeometry.getAttribute('position'));
	gridMeshGeometry.setIndex(new BufferAttribute(gridMeshIndices, 1));
	const gridMeshMaterial = new THREE.ShaderMaterial( {
		polygonOffset: true,
		polygonOffsetFactor: 1,
		polygonOffsetUnits: 1,
		uniforms: {
			u_height: { value: gridTexture },
			u_heightDimensions: { value: TEXTURE_DIM },
		},
		vertexShader,
		fragmentShader: `
			out vec4 out_color;
			void main() {
				out_color = vec4(1, 1, 1, 0.7);
			}
			`,
		glslVersion: THREE.GLSL3,
		transparent: true,
	});
	const gridMesh = new Mesh(gridMeshGeometry, gridMeshMaterial);
	gridMesh.position.y = PARAMS.separation / TEXTURE_DIM[0] * 0.5;
	scene.add(gridMesh);

	const composer = GPUComposer.initWithThreeRenderer(renderer);
	// Undo any changes threejs has made to WebGL state.
	composer.undoThreeState();

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

	// On each render cycle, compute caustics into an RGBA texture.
	const caustics = new GPULayer(composer, {
		name: 'caustics',
		dimensions: [TEXTURE_DIM[0] * CAUSTICS_TEXTURE_SCALE_FACTOR, TEXTURE_DIM[1] * CAUSTICS_TEXTURE_SCALE_FACTOR],
		numComponents: 4, // RGBA
		type: FLOAT,
		filter: LINEAR,
	});
	// Link caustics WebGLTexure to threejs Texture object.
	caustics.attachToThreeTexture(planeTexture);
	// In order to compute caustics intensity in realtime
	// we use a 2D mesh to push a wavefront of light through the water's surface
	// and measure the distortion in the mesh to compute the intensity of light hitting the bottom plane.
	// See https://medium.com/@evanwallace/rendering-realtime-caustics-in-webgl-2a99a29a0b2c
	const lightMeshPositions = new GPULayer(composer, {
		name: 'lightMeshPositions',
		dimensions: TEXTURE_DIM,
		numComponents: 2,
		type: FLOAT,
		filter: NEAREST,
	});
	// Init gpu-io buffer for triangle indices for this light wavefront mesh.
	// We can reuse the same mesh indices we used for our threejs mesh.
	const lightMeshIndices = new GPUIndexBuffer(composer, { indices: gridMeshIndices });

	// Init a program to solve wave function.
	const waveProgram = new GPUProgram(composer, {
		name: 'wave',
		fragmentShader: `
			in vec2 v_uv;

			uniform sampler2D u_height;
			uniform sampler2D u_lastHeight;
			uniform vec2 u_pxSize;
			uniform float u_alpha;

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
				out_result = ${(1 - DECAY).toFixed(6)} * (u_alpha * laplacian + 2.0 * current - last);
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
			{ // Constant that controls wave propagation speed.
				name: 'u_alpha',
				value: (PARAMS.c * DT / DX) ** 2,
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
				// Use dist from center (vec2(0.5)) to compute this.
				vec2 vector = v_uv_local - vec2(0.5);
				out_height = 1.0 - 2.0 * length(vector);
			}
		`,
	});

	const refractLight = new GPUProgram(composer, {
		name: 'refractLight',
		fragmentShader: `
			in vec2 v_uv;

			uniform sampler2D u_height;
			uniform vec2 u_dimensions;
			uniform float u_separation;
			uniform vec2 u_pxSize;

			out vec2 out_position;
			void main() {
				// Calculate a normal vector for height field.
				vec2 onePxX = vec2(u_pxSize.x, 0);
				vec2 onePxY = vec2(0, u_pxSize.y);
				float center = texture(u_height, v_uv).x;
				float n = texture(u_height, v_uv + onePxY).x;
				float s = texture(u_height, v_uv - onePxY).x;
				float e = texture(u_height, v_uv + onePxX).x;
				float w = texture(u_height, v_uv - onePxX).x;
				vec2 normalXY = vec2(w - e, s - n) / 2.0;
				// Clip normal amplitude to prevent triangle overlap / issues with triangle rendering order.
				normalXY *= min(0.0075 / length(normalXY), 1.0);
				vec3 normal = normalize(vec3(normalXY, 1.0));
				const vec3 incident = vec3(0, 0, -1);
				// 1 / 1.33 = Air refractive index / water refractive index.
				vec3 refractVector = refract(incident, normal, ${(1 / 1.33).toFixed(6)});
				refractVector.xy /= abs(refractVector.z);
				// Render this out slightly smaller so we can see raw edge of caustic pattern.
				// Also add a scaling factor of 0.15 to reduce caustic distortion.
				out_position = (0.9 * (v_uv + refractVector.xy * u_separation * 0.15) + 0.05) * u_dimensions;
			}
		`,
		uniforms: [
			{ // Index of sampler2D uniform to assign to value "u_height".
				name: 'u_height',
				value: 0,
				type: INT,
			},
			{ // Calculate the size of a 1 px step in UV coordinates of u_height.
				name: 'u_pxSize',
				value: [1 / TEXTURE_DIM[0], 1 / TEXTURE_DIM[1]],
				type: FLOAT,
			},
			{ // Dimensions of output GPULayer.
				name: 'u_dimensions',
				value: [caustics.width, caustics.height],
				type: FLOAT,
			},
			{ // Separation between water surface and caustics projection.
				name: 'u_separation',
				value: PARAMS.separation,
				type: FLOAT,
			},
		],
	});

	const computeCaustics = new GPUProgram(composer, {
		name: 'computeCaustics',
		fragmentShader: `
			in vec2 v_uv;
			in vec2 v_uv_position;

			uniform vec2 u_pxSize;

			out vec4 out_color;
			void main() {
				// Calculate change in area.
				// https://medium.com/@evanwallace/rendering-realtime-caustics-in-webgl-2a99a29a0b2c
				float oldArea = dFdx(v_uv_position.x) * dFdy(v_uv_position.y);
				float newArea = dFdx(v_uv.x) * dFdy(v_uv.y);
				float amplitude = oldArea / newArea * 0.75; /// 0.75 is a small scaling factor of light intensity.
				const vec3 background = vec3(${BACKGROUND_COLOR[0]}, ${BACKGROUND_COLOR[1]}, ${BACKGROUND_COLOR[2]});
				out_color = vec4(background * amplitude, 1);
			}
		`,
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
		// Update wave function simulation.
		if (!paused) {
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
			// Copy current height to heightMap.
			// heightMap is sampled by the threejs gridSegments and gridMesh vertex shaders.
			composer.step({
				program: copy,
				input: height,
				output: heightMap,
			});

			// Compute caustics.
			// Refract light wavefront mesh through water surface.
			composer.step({
				program: refractLight,
				input: height,
				output: lightMeshPositions,
			});
			caustics.clear();
			// Render light wavefront mesh to caustics.
			// caustics is already linked to threejs planeTexture.
			composer.drawLayerAsMesh({
				layer: lightMeshPositions,
				indices: lightMeshIndices,
				program: computeCaustics,
				output: caustics,
				useOutputScale: true, // Use the same px scale size as the output GPULayer (otherwise it uses screen px).
			});
		}

		// // Slowly rotate the sim.
		// const rotationSpeed = 0.0025;
		// plane.rotateZ(rotationSpeed);
		// gridMesh.rotateY(rotationSpeed);
		// gridSegments.rotateY(rotationSpeed);

		// Reset three state back to what threejs is expecting (otherwise we get WebGL errors).
		composer.resetThreeState();
		// Render threejs state.
		renderer.render(scene, camera);
		// Undo any changes threejs has made to WebGL state.
		composer.undoThreeState();
	}

	// Init simple GUI.
	const ui = [];
	ui.push(pane.addInput(PARAMS, 'c', { min: 0.1, max: 0.5, step: 0.01, label: 'Wave Speed' }).on('change', (e) => {
		waveProgram.setUniform('u_alpha', (PARAMS.c * DT / DX) ** 2);
	}));
	ui.push(pane.addInput(PARAMS, 'separation', { min: 10, max: 100, step: 1, label: 'Z Offset' }).on('change', (e) => {
		const val = PARAMS.separation;
		refractLight.setUniform('u_separation', val);
		plane.position.y = -val / TEXTURE_DIM[0] * 0.5;
		gridSegments.position.y = val / TEXTURE_DIM[0] * 0.5;
		gridMesh.position.y = val / TEXTURE_DIM[0] * 0.5;
	}));
	ui.push(pane.addButton({ title: 'Reset' }).on('click', reset));
	ui.push(pane.addButton({ title: 'Save PNG (p)' }).on('click', savePNG));
	ui.push(pane.addButton({ title: 'Save Caustics PNG' }).on('click', saveTexturePNG));

	// Add 'p' hotkey to print screen.
	function savePNG() {
		let _paused = paused;
		paused = true;
		loop(); // Refresh rendering.
		paused = _paused;
		composer.savePNG({ filename: `threejs_scene` });
	}
	function saveTexturePNG() {
		caustics.savePNG({ filename: 'caustics' });
	}
	window.addEventListener('keydown', onKeydown);
	function onKeydown(e) {
		if (e.key === 'p') {
			savePNG();
		}
		if (e.key === ' ') {
			paused = !paused;
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
		// Add some drops.
		for (let i = 0; i < 3; i++) {
			addDrop();
		}
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
		gridSegments.geometry.dispose();
		gridMesh.geometry.dispose();
		gridTexture.dispose();
		gridSegments.material.dispose();
		gridMesh.material.dispose();

		height.dispose();
		heightMap.dispose();

		lightMeshIndices.dispose();

		waveProgram.dispose();
		dropProgram.dispose();
		refractLight.dispose();
		computeCaustics.dispose();
		copy.dispose();
		
		composer.dispose();
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