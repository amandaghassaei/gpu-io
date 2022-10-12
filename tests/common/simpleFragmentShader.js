const simpleFragmentShader = `in vec2 v_uv;
out vec4 out_FragColor;
void main() {
	out_FragColor = vec4(v_uv.x, v_uv.y, 0, 1);
}`;