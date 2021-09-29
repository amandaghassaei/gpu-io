// Fragment shader that draws the magnitude of a DataLayer.
precision highp float;

varying vec2 v_UV;

uniform vec3 u_color;
uniform vec3 u_scale;
uniform sampler2D u_internal_data;

void main() {
	vec4 value = texture2D(u_internal_data, v_UV);
	float mag = length(value);
	gl_FragColor = vec4(mag / u_scale * u_color, 1);
}