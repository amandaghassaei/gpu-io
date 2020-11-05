// Vertex shader for fullscreen rect.
export default `
precision highp float;
attribute vec2 position;
varying vec2 uv;
void main() {
	// Calculate UV coordinates [0, 1] of canvas bounds.
	uv = 0.5 * (position + 1.0);
	// Calculate vertex position.
	gl_Position = vec4(position, 0, 1);
}
`;
