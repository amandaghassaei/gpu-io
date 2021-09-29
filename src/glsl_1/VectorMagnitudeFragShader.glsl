// Fragment shader that draws the magnitude of a DataLayer.
precision highp float;

varying vec2 v_UV;

uniform vec3 u_color;
uniform float u_scale;
uniform int u_internal_numDimensions;
uniform sampler2D u_internal_data;

void main() {
	vec4 value = texture2D(u_internal_data, v_UV);
	if (u_internal_numDimensions < 4) value.a = 0;
	if (u_internal_numDimensions < 3) value.b = 0;
	if (u_internal_numDimensions < 2) value.g = 0;
	float mag = length(value);
	gl_FragColor = vec4(mag * u_scale * u_color, 1);
}