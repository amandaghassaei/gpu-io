precision highp float;
precision highp int;

@import ./Utils;

// Cannot use int vertex attributes: https://stackoverflow.com/questions/27874983/webgl-how-to-use-integer-attributes-in-glsl
attribute float a_internal_index; // Index of point.

uniform sampler2D u_internal_vectorData; // Texture lookup with vector data.
uniform vec2 u_internal_dimensions;
uniform vec2 u_internal_scale;

varying vec2 v_UV;

void main() {
	// Divide index by 2.
	float index = floor((a_internal_index + 0.5) / 2.0);
	// Calculate a uv based on the vertex index attribute.
	v_UV = vec2(
		modI(index, u_internal_dimensions.x),
		floor(floor(index + 0.5) / u_internal_dimensions.x)
	) / u_internal_dimensions;

	// Add vector displacement if needed.
	if (modI(a_internal_index, 2)) {
		// Lookup vectorData at current UV.
		vec2 vectorData = texture2D(u_internal_vectorData, v_UV).xy;
		v_UV += vectorData * u_internal_scale;
	}

	// Calculate position in [-1, 1] range.
	vec2 position = v_UV * 2.0 - 1.0;

	gl_Position = vec4(position, 0, 1);
}