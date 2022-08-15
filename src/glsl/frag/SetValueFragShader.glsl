#ifdef WEBGLCOMPUTE_FLOAT
uniform vec4 u_value;
#endif
#ifdef WEBGLCOMPUTE_INT
uniform ivec4 u_value;
#endif
#ifdef WEBGLCOMPUTE_UINT
uniform uvec4 u_value;
#endif

#ifdef WEBGLCOMPUTE_FLOAT
out vec4 out_fragOut;
#endif
#ifdef WEBGLCOMPUTE_INT
out ivec4 out_fragOut;
#endif
#ifdef WEBGLCOMPUTE_UINT
out uvec4 out_fragOut;
#endif

void main() {
	out_fragOut = u_value;
}