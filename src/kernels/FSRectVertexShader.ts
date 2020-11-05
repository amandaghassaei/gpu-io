// Vertex shader for fullscreen rect.
export default `
precision highp float;
attribute vec2 a_position;
varying vec2 uv;
void main() {
	uv = 0.5 * (a_position + 1.0);
	gl_Position = vec4(a_position, 0, 1);
}
`;
