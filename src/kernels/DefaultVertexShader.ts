// Vertex shader for fullscreen quad.
export default `
precision highp float;
attribute vec2 aPosition;
uniform vec2 u_scale;
uniform vec2 u_translation;
varying vec2 uv_viewport;
varying vec2 uv;
void main() {
	// Calculate UV coordinates [0, 1].
	uv = 0.5 * (aPosition + 1.0);
	// Apply transformations.
	vec2 position = u_scale * aPosition + u_translation;
	// Calculate a global uv for the viewport.
	uv_viewport = 0.5 * (position + 1.0);
	// Calculate vertex position.
	gl_Position = vec4(position, 0, 1);
}
`;