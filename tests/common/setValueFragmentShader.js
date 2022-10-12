const setValueFragmentShader = `uniform vec4 u_value;
out vec4 out_FragColor;
void main() {
	out_FragColor = u_value;
}`;