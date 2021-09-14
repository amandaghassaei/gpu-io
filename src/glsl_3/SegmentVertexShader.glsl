#version 300 es
precision highp float;

attribute vec2 a_internal_position;

uniform float u_internal_halfThickness;
uniform vec2 u_internal_scale;
uniform float u_internal_length;
uniform float u_internal_rotation;
uniform vec2 u_internal_translation;

varying vec2 v_UV_local;
varying vec2 v_UV;

mat2 rotate2d(float _angle){
	return mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));
}

void main() {
	// Calculate UV coordinates of current rendered object.
	v_UV_local = 0.5 * (a_internal_position + 1.0);

	vec2 position = a_internal_position;

	// Apply radius.
	position *= u_internal_radius;

	// Stretch center of shape to form a round-capped line segment.
	if (position.x < 0.0) {
		position.x -= u_internal_length / 2.0;
		v_UV_local.x = 0.0; // Set entire cap UV.x to 0.
	} else if (position.x > 0.0) {
		position.x += u_internal_length / 2.0;
		v_UV_local.x = 1.0; // Set entire cap UV.x to 1.
	}

	// Apply transformations.
	position = u_internal_scale * (rotate2d(-u_internal_rotation) * position) + u_internal_translation;

	// Calculate a global uv for the viewport.
	v_UV = 0.5 * (position + 1.0);

	// Calculate vertex position.
	gl_Position = vec4(position, 0, 1);
}