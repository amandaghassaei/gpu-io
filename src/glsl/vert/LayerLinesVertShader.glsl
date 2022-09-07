@include "../common/modI.glsl"

// Cannot use int vertex attributes: https://stackoverflow.com/questions/27874983/webgl-how-to-use-integer-attributes-in-glsl
in float a_internal_index; // Index of point.

uniform sampler2D u_internal_positions; // Texture lookup with position data.
uniform vec2 u_internal_positionsDimensions;
uniform vec2 u_internal_scale;

out vec2 v_UV;
out vec2 v_lineWrapping; // Use this to test if line is only half wrapped and should not be rendered.
out float v_index;

void main() {
	// Calculate a uv based on the point's index attribute.
	vec2 particleUV = vec2(
		modI(a_internal_index, u_internal_positionsDimensions.x),
		floor(floor(a_internal_index + 0.5) / u_internal_positionsDimensions.x)
	) / u_internal_positionsDimensions;

	// Calculate a global uv for the viewport.
	// Lookup vertex position and scale to [0, 1] range.
	#ifdef GPUIO_VS_POSITION_W_ACCUM
		// We have packed a 2D displacement with the position.
		vec4 positionData = texture(u_internal_positions, particleUV);
		// position = first two components plus last two components (optional accumulation buffer).
		v_UV = (positionData.rg + positionData.ba) * u_internal_scale;
	#else
		v_UV = texture(u_internal_positions, particleUV).rg  * u_internal_scale;
	#endif

	// Wrap if needed.
	v_lineWrapping = vec2(0.0);
	//TODO: remove branching
	#ifdef GPUIO_VS_WRAP_X
		if (v_UV.x < 0.0) {
			v_UV.x += 1.0;
			v_lineWrapping.x = 1.0;
		} else if (v_UV.x > 1.0) {
			v_UV.x -= 1.0;
			v_lineWrapping.x = 1.0;
		}
	#endif
	#ifdef GPUIO_VS_WRAP_Y
		if (v_UV.y < 0.0) {
			v_UV.y += 1.0;
			v_lineWrapping.y = 1.0;
		} else if (v_UV.y > 1.0) {
			v_UV.y -= 1.0;
			v_lineWrapping.y = 1.0;
		}
	#endif

	// Calculate position in [-1, 1] range.
	vec2 position = v_UV * 2.0 - 1.0;

	v_index = a_internal_index;
	gl_Position = vec4(position, 0, 1);
}