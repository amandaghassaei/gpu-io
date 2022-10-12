const setUintValueFragmentShader = `uniform uvec4 u_value;
out uvec4 out_FragColor;
void main() {
	out_FragColor = u_value;
}`;