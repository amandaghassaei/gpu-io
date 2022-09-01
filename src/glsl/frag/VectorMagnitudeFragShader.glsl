// Fragment shader that draws the magnitude of a GPULayer as a color.

in vec2 v_UV;

uniform vec3 u_color;
uniform float u_scale;
#ifdef GPUIO_FLOAT
uniform sampler2D u_internal_data;
#endif
#ifdef GPUIO_INT
uniform isampler2D u_internal_data;
#endif
#ifdef GPUIO_UINT
uniform usampler2D u_internal_data;
#endif

out vec4 out_fragColor;

void main() {
	uvec4 value = texture(u_internal_data, v_UV);
	float mag = length(value);
	out_fragColor = vec4(mag * u_scale * u_color, 1);
}