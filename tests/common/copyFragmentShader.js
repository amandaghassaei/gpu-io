const copyFragmentShader = `in vec2 v_UV;

#ifdef WEBGLCOMPUTE_FLOAT
uniform sampler2D u_state;
#endif
#ifdef WEBGLCOMPUTE_INT
uniform isampler2D u_state;
#endif
#ifdef WEBGLCOMPUTE_UINT
uniform usampler2D u_state;
#endif

#ifdef WEBGLCOMPUTE_FLOAT
out highp vec4 out_fragColor;
#endif
#ifdef WEBGLCOMPUTE_INT
out highp ivec4 out_fragColor;
#endif
#ifdef WEBGLCOMPUTE_UINT
out highp uvec4 out_fragColor;
#endif

void main() {
	out_fragColor = texture(u_state, v_UV);
}`;