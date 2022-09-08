import {
	GPUIO_VS_UV_ATTRIBUTE,
	GPUIO_VS_NORMAL_ATTRIBUTE,
} from '../../constants';

export const DEFAULT_VERT_SHADER_SOURCE = `
in vec2 a_gpuio_position;
#ifdef ${GPUIO_VS_UV_ATTRIBUTE}
	in vec2 a_gpuio_uv;
#endif
#ifdef ${GPUIO_VS_NORMAL_ATTRIBUTE}
	in vec2 a_gpuio_normal;
#endif

uniform vec2 u_gpuio_scale;
uniform vec2 u_gpuio_translation;

out vec2 v_uv;
out vec2 v_uv_local;
#ifdef ${GPUIO_VS_NORMAL_ATTRIBUTE}
	out vec2 v_normal;
#endif

void main() {
	// Optional varyings.
	#ifdef ${GPUIO_VS_UV_ATTRIBUTE}
		v_uv_local = a_gpuio_uv;
	#else
		v_uv_local = 0.5 * (a_gpuio_position + 1.0);
	#endif
	#ifdef ${GPUIO_VS_NORMAL_ATTRIBUTE}
		v_normal = a_gpuio_normal;
	#endif

	// Apply transformations.
	vec2 position = u_gpuio_scale * a_gpuio_position + u_gpuio_translation;

	// Calculate a global uv for the viewport.
	v_uv = 0.5 * (position + 1.0);

	// Calculate vertex position.
	gl_Position = vec4(position, 0, 1);
}`;