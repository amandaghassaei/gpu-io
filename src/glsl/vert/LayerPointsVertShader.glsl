@include "../common/VertexShaderHelpers.glsl"

#if (__VERSION__ != 300)
	// Cannot use int vertex attributes.
	// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
	in float a_gpuio_index;
#endif

uniform sampler2D u_gpuio_positions; // Texture lookup with position data.
uniform vec2 u_gpuio_positionsDimensions;
uniform vec2 u_gpuio_scale;
uniform float u_gpuio_pointSize;

out vec2 v_uv;
flat out int v_index;

void main() {
	// Calculate a uv based on the point's index attribute.
	#if (__VERSION__ == 300)
		vec2 positionUV = uvFromIndex(gl_VertexID, u_gpuio_positionsDimensions);
		v_index = gl_VertexID;
	#else
		vec2 positionUV = uvFromIndex(a_gpuio_index, u_gpuio_positionsDimensions);
		v_index = int(a_gpuio_index);
	#endif

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
	#ifdef GPUIO_VS_WRAP_X
		v_uv.x = fract(v_uv.x + ceil(abs(v_uv.x)));
	#endif
	#ifdef GPUIO_VS_WRAP_Y
		v_uv.y = fract(v_uv.y + ceil(abs(v_uv.y)));
	#endif

	// Calculate position in [-1, 1] range.
	vec2 position = v_uv * 2.0 - 1.0;

	gl_PointSize = u_gpuio_pointSize;
	gl_Position = vec4(position, 0, 1);
}