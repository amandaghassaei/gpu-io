// Fragment shader that draws a single color (for testing).
export default `
precision lowp float;
uniform vec3 u_color;
void main() {
	gl_Position = vec4(u_color, 1);
}`;