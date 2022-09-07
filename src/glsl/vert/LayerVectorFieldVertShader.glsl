@include "../common/VertexShaderHelpers.glsl"

// Cannot use int vertex attributes: https://stackoverflow.com/questions/27874983/webgl-how-to-use-integer-attributes-in-glsl
in float a_gpuio_index; // Index of point.

uniform sampler2D u_gpuio_vectors; // Texture lookup with vector data.
uniform vec2 u_gpuio_dimensions;
uniform vec2 u_gpuio_scale;

out vec2 v_uv;
out float v_index;

void main() {
	// Divide index by 2.
	const float index = floor((a_gpuio_index + 0.5) / 2.0);
	// Calculate a uv based on the vertex index attribute.
	vec2 positionUV = uvFromIndex(index, u_gpuio_dimensions);

	// Add vector displacement if needed.
	v_uv += step(0.0, modI(a_gpuio_index, 2.0)) * texture(u_gpuio_vectors, v_uv).xy * u_gpuio_scale;

	// Calculate position in [-1, 1] range.
	vec2 position = v_uv * 2.0 - 1.0;

	v_index = a_gpuio_index;
	gl_Position = vec4(position, 0, 1);
}