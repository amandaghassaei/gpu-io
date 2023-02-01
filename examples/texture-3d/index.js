const {
	GPUComposer,
	GPULayer,
	GPUProgram,
	renderRGBProgram,
	FLOAT,
	INT,
	REPEAT,
	NEAREST,
} = GPUIO;

// Init a canvas element.
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// Init a composer.
const composer = new GPUComposer({ canvas });

// Create a texture of size [width, height * depth], this will be the 3D texture cube.
// Draw a sphere inside the texture cube, sliced through the z-axis and vertically stacked
const width = height = depth = 32
const data = new Float32Array(width * height * depth * 3) // 1D array to store 3D texture data
const sphereSDF = (x, y, z, radius) => Math.sqrt(x ** 2 + y ** 2 + z ** 2) - radius
const step = (edge, x) => edge > x ? 0 : 1
for (let z = 0; z < depth; z++) {
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const index = (y * width + x + (z * height * width)) * 3 // 3D texture coordinates to 1D array index
			const xPos = x / width - 0.5 // put the sphere in the center
			const yPos = y / height - 0.5
			const zPos = z / depth - 0.5
			const pct = step(sphereSDF(xPos, yPos, zPos, 0.5), 0) // 1 = inside sphere, 0 = outside sphere
			data[index + 0] = pct * x / width // color the sphere slices
			data[index + 1] = pct * y / height
			data[index + 2] = pct * z / depth
		}
	}
}

const state = new GPULayer(composer, {
	name: 'state',
	dimensions: [width, height * depth],
	numComponents: 3, // state data has three components.
	type: FLOAT,
	filter: NEAREST,
	numBuffers: 2, // Use 2 buffers so we can toggle read/write from one to the other.
	wrapX: REPEAT,
	wrapY: REPEAT,
	array: data,
});

// Init a program to move the sphere through the texture.
// Demonstrates how to access texture cube using x, y, z coordinates.
const textureCubeProgram = new GPUProgram(composer, {
	name: 'render',
	fragmentShader: `
		in vec2 v_uv;

		uniform sampler2D u_state;
		uniform vec3 u_size;

		out vec3 out_result;

		// assumes cube texture is size [width, height * depth]
		vec3 uvToCube (vec2 uv, vec3 cubeSize) {
			return vec3(
				uv.x,
				mod(uv.y, 1.0 / cubeSize.y) * cubeSize.y,
				floor(uv.y / (1.0 / cubeSize.y)) / cubeSize.z
			);
		}

		// cubeCoord components are [0..1]
		vec2 cubeToUv (vec3 cubeCoord, vec3 cubeSize) {
			return vec2(
				cubeCoord.x,
				cubeCoord.z + cubeCoord.y / cubeSize.z
			);
		}

		void main() {
			vec3 cubeCoord = uvToCube(v_uv, u_size);
			cubeCoord.z += 1.0 / u_size.z; // sphere rolls through
			vec2 uv = cubeToUv(cubeCoord, u_size);
			out_result = texture(u_state, uv).xyz;
		}
	`,
	uniforms: [
		{ // Index of sampler2D uniform to assign to value "u_state".
			name: 'u_state',
			value: 0,
			type: INT,
		},
		{ // Need dimensions for projecting coordinates between cube and plane.
			name: 'u_size',
			value: [width, height ,depth],
			type: FLOAT,
		},
	],
});

// Init a program to render state to canvas.
// See https://github.com/amandaghassaei/gpu-io/tree/main/docs#gpuprogram-helper-functions for more built-in GPUPrograms to use.
const renderProgram = renderRGBProgram(composer, {
	name: 'render',
	type: state.type,
});

// Simulation/render loop.
function loop() {
	window.requestAnimationFrame(loop);

	// Compute state and write result to state.
	composer.step({
		program: textureCubeProgram,
		input: state,
		output: state,
	});

	// If no "output", will draw to canvas.
	composer.step({
		program: renderProgram,
		input: state,
	});
}
loop(); // Start animation loop.
