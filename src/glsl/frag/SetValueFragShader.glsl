#ifdef GPUIO_FLOAT
uniform vec4 u_value;
#endif
#ifdef GPUIO_INT
uniform ivec4 u_value;
#endif
#ifdef GPUIO_UINT
uniform uvec4 u_value;
#endif

#ifdef GPUIO_FLOAT
out vec4 out_fragColor;
#endif
#ifdef GPUIO_INT
out ivec4 out_fragColor;
#endif
#ifdef GPUIO_UINT
out uvec4 out_fragColor;
#endif

void main() {
	out_fragColor = u_value;
}