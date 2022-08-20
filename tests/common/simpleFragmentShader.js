const simpleFragmentShader = `in vec2 v_UV;
out vec4 out_fragColor;
void main() {
	out_fragColor = vec4(v_UV.x, v_UV.y, 0, 1);
}`;