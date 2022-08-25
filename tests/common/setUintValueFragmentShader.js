const setUintValueFragmentShader = `uniform uvec4 u_value;
out uvec4 out_fragColor;
void main() {
	out_fragColor = u_value;
}`;