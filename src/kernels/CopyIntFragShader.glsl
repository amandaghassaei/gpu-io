#version 300 es
precision highp float;
precision highp int;
precision highp isampler2D;

in vec2 v_UV;

uniform isampler2D u_state;

out ivec4 out_fragColor;

void main() {
	out_fragColor = texture(u_state, v_UV);
}