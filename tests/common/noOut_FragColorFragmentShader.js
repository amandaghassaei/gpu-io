const badOutputFragmentShader = `
out vec4 out_fragOut; // Should be out_fragColor.
void main() {
	out_fragOut = vec4(0);
}`;