precision highp float;

attribute vec2 a_internal_position;
#ifdef UV_ATTRIBUTE
attribute vec2 a_internal_uv;
#endif
#ifdef NORMAL_ATTRIBUTE
attribute vec2 a_internal_normal;
#endif

uniform vec2 u_internal_scale;
uniform vec2 u_internal_translation;

varying vec2 v_UV;
#ifdef UV_ATTRIBUTE
varying vec2 v_UV_local;
#endif
#ifdef NORMAL_ATTRIBUTE
varying vec2 v_normal;
#endif

void main() {
	// Optional varyings.
	#ifdef UV_ATTRIBUTE
	v_UV_local = a_internal_uv;
	#endif
	#ifdef NORMAL_ATTRIBUTE
	v_normal = a_internal_normal;
	#endif

	// Apply transformations.
	vec2 position = u_internal_scale * a_internal_position + u_internal_translation;

	// Calculate a global uv for the viewport.
	v_UV = 0.5 * (position + 1.0);

	// Calculate vertex position.
	gl_Position = vec4(position, 0, 1);
}