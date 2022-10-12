import { VERTEX_SHADER_HELPERS_SOURCE } from './VertexShaderHelpers';

export const LAYER_VECTOR_FIELD_VERTEX_SHADER_SOURCE = `
${VERTEX_SHADER_HELPERS_SOURCE}

#if (__VERSION__ != 300)
	// Cannot use int vertex attributes.
	// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
	in float a_gpuio_index;
#endif

uniform sampler2D u_gpuio_vectors; // Texture lookup with vector data.
uniform vec2 u_gpuio_dimensions;
uniform vec2 u_gpuio_scale;

out vec2 v_uv;
flat out int v_index;

void main() {
	#if (__VERSION__ == 300)
		// Divide index by 2.
		int index = gl_VertexID / 2;
		v_index = index;
	#else
		// Divide index by 2.
		float index = floor((a_gpuio_index + 0.5) / 2.0);
		v_index = int(index);
	#endif

	// Calculate a uv based on the vertex index attribute.
	v_uv = uvFromIndex(index, u_gpuio_dimensions);
	#if (__VERSION__ == 300)
		// Add vector displacement if needed.
		v_uv += float(gl_VertexID - 2 * index) * texture(u_gpuio_vectors, v_uv).xy * u_gpuio_scale;
	#else
		// Add vector displacement if needed.
		v_uv += (a_gpuio_index - 2.0 * index) * texture(u_gpuio_vectors, v_uv).xy * u_gpuio_scale;
	#endif


	// Calculate position in [-1, 1] range.
	vec2 position = v_uv * 2.0 - 1.0;

	gl_Position = vec4(position, 0, 1);
}`;