in vec2 v_lineWrapping;

uniform vec4 u_value;

out vec4 out_fragOut;

void main() {
	// Check if this line has wrapped.
	if ((v_lineWrapping.x != 0.0 && v_lineWrapping.x != 1.0) || (v_lineWrapping.y != 0.0 && v_lineWrapping.y != 1.0)) {
		// Render nothing.
		discard;
		return;
	}
	out_fragOut = vec4(u_value);
}