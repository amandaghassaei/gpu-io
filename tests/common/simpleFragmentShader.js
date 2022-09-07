const simpleFragmentShader = `in vec2 v_uv;
out vec4 out_fragColor;
void main() {
	out_fragColor = vec4(v_uv.x, v_uv.y, 0, 1);
}`;