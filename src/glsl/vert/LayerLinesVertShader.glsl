@include "../common/VertexShaderHelpers.glsl"

// Cannot use int vertex attributes: https://stackoverflow.com/questions/27874983/webgl-how-to-use-integer-attributes-in-glsl
in float a_gpuio_index; // Index of point.

uniform sampler2D u_gpuio_positions; // Texture lookup with position data.
uniform vec2 u_gpuio_positionsDimensions;
uniform vec2 u_gpuio_scale;

out vec2 v_uv;
out vec2 v_lineWrapping; // Use this to test if line is only half wrapped and should not be rendered.
out float v_index;

void main() {
	// Calculate a uv based on the point's index attribute.
	vec2 positionUV = uvFromIndex(a_gpuio_index, u_gpuio_positionsDimensions);

	// Calculate a global uv for the viewport.
	// Lookup vertex position and scale to [0, 1] range.
	#ifdef GPUIO_VS_POSITION_W_ACCUM
		// We have packed a 2D displacement with the position.
		vec4 positionData = texture(u_gpuio_positions, positionUV);
		// position = first two components plus last two components (optional accumulation buffer).
		v_uv = (positionData.rg + positionData.ba) * u_gpuio_scale;
	#else
		v_uv = texture(u_gpuio_positions, positionUV).rg  * u_gpuio_scale;
	#endif

	// Wrap if needed.
	v_lineWrapping = vec2(0.0);
	//TODO: remove branching
	#ifdef GPUIO_VS_WRAP_X
		if (v_uv.x < 0.0) {
			v_uv.x += 1.0;
			v_lineWrapping.x = 1.0;
		} else if (v_uv.x > 1.0) {
			v_uv.x -= 1.0;
			v_lineWrapping.x = 1.0;
		}
	#endif
	#ifdef GPUIO_VS_WRAP_Y
		if (v_uv.y < 0.0) {
			v_uv.y += 1.0;
			v_lineWrapping.y = 1.0;
		} else if (v_uv.y > 1.0) {
			v_uv.y -= 1.0;
			v_lineWrapping.y = 1.0;
		}
	#endif

	// Calculate position in [-1, 1] range.
	vec2 position = v_uv * 2.0 - 1.0;

	v_index = a_gpuio_index;
	gl_Position = vec4(position, 0, 1);
}