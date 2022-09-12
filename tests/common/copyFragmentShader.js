const copyFragmentShader = `in vec2 v_uv;

#ifdef GPUIO_FLOAT
uniform sampler2D u_state;
#endif
#ifdef GPUIO_INT
uniform isampler2D u_state;
#endif
#ifdef GPUIO_UINT
uniform usampler2D u_state;
#endif

#ifdef GPUIO_FLOAT
out highp vec4 out_FragColor;
#endif
#ifdef GPUIO_INT
out highp ivec4 out_FragColor;
#endif
#ifdef GPUIO_UINT
out highp uvec4 out_FragColor;
#endif

void main() {
	out_FragColor = texture(u_state, v_uv);
}`;