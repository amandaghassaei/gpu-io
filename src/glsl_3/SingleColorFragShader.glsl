// Fragment shader that draws a single color.
precision highp float;

uniform vec3 u_color;

void main() {
	gl_FragColor = vec4(u_color, 1);
}