const defaultVertexShader = `in vec2 a_internal_position;
#ifdef WEBGLCOMPUTE_UV_ATTRIBUTE
in vec2 a_internal_uv;
#endif
#ifdef WEBGLCOMPUTE_NORMAL_ATTRIBUTE
in vec2 a_internal_normal;
#endif

uniform vec2 u_internal_scale;
uniform vec2 u_internal_translation;

out vec2 v_UV;
out vec2 v_UV_local;
#ifdef WEBGLCOMPUTE_NORMAL_ATTRIBUTE
out vec2 v_normal;
#endif

void main() {
	// Optional varyings.
	#ifdef WEBGLCOMPUTE_UV_ATTRIBUTE
	v_UV_local = a_internal_uv;
	#else
	v_UV_local = a_internal_position;
	#endif
	#ifdef WEBGLCOMPUTE_NORMAL_ATTRIBUTE
	v_normal = a_internal_normal;
	#endif

	// Apply transformations.
	vec2 position = u_internal_scale * a_internal_position + u_internal_translation;

	// Calculate a global uv for the viewport.
	v_UV = 0.5 * (position + 1.0);

	// Calculate vertex position.
	gl_Position = vec4(position, 0, 1);
}`;