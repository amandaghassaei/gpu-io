#version 300 es
@import ../common/precision;

#ifdef FLOAT
uniform vec4 u_value;
#endif
#ifdef INT
uniform ivec4 u_value;
#endif
#ifdef UINT
uniform uvec4 u_value;
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
	out_fragOut = u_value;
}