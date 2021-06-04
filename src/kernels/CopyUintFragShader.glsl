#version 300 es
precision highp float;
precision highp int;
precision highp usampler2D;

in vec2 v_UV;

uniform usampler2D u_state;

out uvec4 out_fragColor;

void main() {
	out_fragColor = texture(u_state, v_UV);
}