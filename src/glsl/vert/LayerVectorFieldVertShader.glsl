@include "../common/modI.glsl"

// Cannot use int vertex attributes: https://stackoverflow.com/questions/27874983/webgl-how-to-use-integer-attributes-in-glsl
in float a_internal_index; // Index of point.

uniform sampler2D u_internal_vectors; // Texture lookup with vector data.
uniform vec2 u_internal_dimensions;
uniform vec2 u_internal_scale;

out vec2 v_UV;
out float v_index;

void main() {
	// Divide index by 2.
	float index = floor((a_internal_index + 0.5) / 2.0);
	// Calculate a uv based on the vertex index attribute.
	v_UV = vec2(
		modI(index, u_internal_dimensions.x),
		floor(floor(index + 0.5) / u_internal_dimensions.x)
	) / u_internal_dimensions;

	// Add vector displacement if needed.
	//TODO: remove branching
	if (modI(a_internal_index, 2.0) > 0.0) {
		// Lookup vectorData at current UV.
		vec2 vectorData = texture(u_internal_vectors, v_UV).xy;
		v_UV += vectorData * u_internal_scale;
	}

	// Calculate position in [-1, 1] range.
	vec2 position = v_UV * 2.0 - 1.0;

	v_index = a_internal_index;
	gl_Position = vec4(position, 0, 1);
}