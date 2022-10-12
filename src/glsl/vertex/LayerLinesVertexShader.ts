import {
	GPUIO_VS_INDEXED_POSITIONS, GPUIO_VS_POSITION_W_ACCUM, GPUIO_VS_WRAP_X, GPUIO_VS_WRAP_Y,
} from '../../constants';
import { VERTEX_SHADER_HELPERS_SOURCE } from './VertexShaderHelpers';

export const LAYER_LINES_VERTEX_SHADER_SOURCE = `
${VERTEX_SHADER_HELPERS_SOURCE}

#if (__VERSION__ != 300 || ${GPUIO_VS_INDEXED_POSITIONS} == 1)
	// Cannot use int vertex attributes.
	// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
	in float a_gpuio_index;
#endif

uniform sampler2D u_gpuio_positions; // Texture lookup with position data.
uniform vec2 u_gpuio_positionsDimensions;
uniform vec2 u_gpuio_scale;

out vec2 v_uv;
out vec2 v_lineWrapping; // Use this to test if line is only half wrapped and should not be rendered.
flat out int v_index;

void main() {
	// Calculate a uv based on the point's index attribute.
	#if (__VERSION__ != 300 || ${GPUIO_VS_INDEXED_POSITIONS} == 1)
		vec2 positionUV = uvFromIndex(a_gpuio_index, u_gpuio_positionsDimensions);
		v_index = int(a_gpuio_index);
	#else
		vec2 positionUV = uvFromIndex(gl_VertexID, u_gpuio_positionsDimensions);
		v_index = gl_VertexID;
	#endif

	// Calculate a global uv for the viewport.
	// Lookup vertex position and scale to [0, 1] range.
	#ifdef ${GPUIO_VS_POSITION_W_ACCUM}
		// We have packed a 2D displacement with the position.
		vec4 positionData = texture(u_gpuio_positions, positionUV);
		// position = first two components plus last two components (optional accumulation buffer).
		v_uv = (positionData.rg + positionData.ba) * u_gpuio_scale;
	#else
		v_uv = texture(u_gpuio_positions, positionUV).rg  * u_gpuio_scale;
	#endif

	// Wrap if needed.
	v_lineWrapping = vec2(0.0);
	#ifdef ${GPUIO_VS_WRAP_X}
		v_lineWrapping.x = max(step(1.0, v_uv.x), step(v_uv.x, 0.0));
		v_ux.x = fract(v_uv.x + 1.0);
	#endif
	#ifdef ${GPUIO_VS_WRAP_Y}
		v_lineWrapping.y = max(step(1.0, v_uv.y), step(v_uv.y, 0.0));
		v_ux.y = fract(v_uv.y + 1.0);
	#endif

	// Calculate position in [-1, 1] range.
	vec2 position = v_uv * 2.0 - 1.0;

	gl_Position = vec4(position, 0, 1);
}`;