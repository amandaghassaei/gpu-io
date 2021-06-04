#version 300 es
precision highp float;
precision highp sampler2D;

in vec2 v_UV;

uniform sampler2D u_state;

out vec4 out_fragColor;

void main() {
	out_fragColor = texture(u_state, v_UV);
}