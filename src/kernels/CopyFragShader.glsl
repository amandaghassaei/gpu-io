precision highp float;
precision highp int;

varying vec2 v_UV;

uniform sampler2D u_state;

void main() {
	gl_FragColor = texture2D(u_state, v_UV);
}