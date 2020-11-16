export default `
precision highp float;

varying vec2 vUV;
uniform sampler2D u_state;

void main() {
	gl_FragColor = texture2D(u_state, vUV);
}`;