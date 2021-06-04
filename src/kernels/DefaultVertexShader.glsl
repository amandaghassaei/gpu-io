#version 300 es
precision highp float;

in vec2 a_internal_position;

uniform vec2 u_internal_scale;
uniform vec2 u_internal_translation;

out vec2 v_UV_local;
out vec2 v_UV;
out vec2 out_position;

void main() {
	// Calculate UV coordinates of current rendered object.
	v_UV_local = 0.5 * (a_internal_position + 1.0);

	// Apply transformations.
	vec2 position = u_internal_scale * a_internal_position + u_internal_translation;

	// Calculate a global uv for the viewport.
	v_UV = 0.5 * (position + 1.0);

	// Calculate vertex position.
	out_position = position;
}