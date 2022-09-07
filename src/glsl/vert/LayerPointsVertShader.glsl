@include "../common/modI.glsl"

// Cannot use int vertex attributes: https://stackoverflow.com/questions/27874983/webgl-how-to-use-integer-attributes-in-glsl
// TODO: would this work in glsl3?
in float a_internal_index; // Index of point.

uniform sampler2D u_internal_positions; // Texture lookup with position data.
uniform vec2 u_internal_positionsDimensions;
uniform vec2 u_internal_scale;
uniform float u_internal_pointSize;

out vec2 v_UV;
flat out int v_index;

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
	#ifdef GPUIO_VS_WRAP_X
		v_UV.x = fract(v_UV.x + ceil(abs(v_UV.x)));
	#endif
	#ifdef GPUIO_VS_WRAP_Y
		v_UV.y = fract(v_UV.y + ceil(abs(v_UV.y)));
	#endif

	// Calculate position in [-1, 1] range.
	vec2 position = v_UV * 2.0 - 1.0;

	v_index = int(a_internal_index);
	gl_PointSize = u_internal_pointSize;
	gl_Position = vec4(position, 0, 1);
}