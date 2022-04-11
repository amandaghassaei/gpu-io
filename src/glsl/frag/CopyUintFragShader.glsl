#version 300 es
@import ../common/precision;

in vec2 v_UV;

uniform usampler2D u_state;

out uvec4 out_fragOut;

void main() {
	out_fragOut = texture(u_state, v_UV);
}