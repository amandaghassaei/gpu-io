// Fragment shader that draws a single color.
precision highp float;

uniform vec3 u_color;
varying vec2 v_lineWrapping;

void main() {
	// check if this line has wrapped.
	if (v_lineWrapping.x == 0.5 || v_lineWrapping.y == 0.5) {
		// Render nothing.
		discard;
		return;
	}
	gl_FragColor = vec4(u_color, 1);
}