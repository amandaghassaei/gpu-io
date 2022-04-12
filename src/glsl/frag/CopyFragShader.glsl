#version 300 es
@import ../common/precision;

in vec2 v_UV;

#ifdef FLOAT
uniform sampler2D u_state;
#endif
#ifdef INT
uniform isampler2D u_state;
#endif
#ifdef UINT
uniform usampler2D u_state;
#endif

#ifdef FLOAT
out vec4 out_fragOut;
#endif
#ifdef INT
out ivec4 out_fragOut;
#endif
#ifdef UINT
out uvec4 out_fragOut;
#endif

void main() {
	out_fragOut = texture(u_state, v_UV);
}