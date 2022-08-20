const setValueFragmentShader = `uniform vec4 u_value;
out vec4 out_fragColor;
void main() {
	out_fragColor = u_value;
}`;