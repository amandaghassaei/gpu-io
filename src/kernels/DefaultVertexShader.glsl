// Vertex shader for fullscreen quad.
precision highp float;

attribute vec2 aPosition;

uniform vec2 u__scale;
uniform vec2 u__translation;

varying vec2 v_UV_local;
varying vec2 v_UV;

void main() {
	// Calculate UV coordinates of current rendered object.
	v_UV_local = 0.5 * (aPosition + 1.0);

	// Apply transformations.
	vec2 position = u__scale * aPosition + u__translation;

	// Calculate a global uv for the viewport.
	v_UV = 0.5 * (position + 1.0);

	// Calculate vertex position.
	gl_Position = vec4(position, 0, 1);
}