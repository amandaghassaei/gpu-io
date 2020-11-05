// Vertex shader for fullscreen quad.
export default `
precision mediump float;
attribute vec2 aPosition;
varying vec2 uv;
void main() {
	// Calculate UV coordinates [0, 1] of canvas bounds.
	uv = 0.5 * (aPosition + 1.0);
	// Calculate vertex position.
	gl_Position = vec4(aPosition, 0, 1);
}
`;
