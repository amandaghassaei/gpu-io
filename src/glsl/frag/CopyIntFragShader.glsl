#version 300 es
@import ../common/precision;

in vec2 v_UV;

uniform isampler2D u_state;

out ivec4 out_fragOut;

void main() {
	out_fragOut = texture(u_state, v_UV);
}