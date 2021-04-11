// Vertex shader for fullscreen quad.
precision highp float;

attribute vec2 a__position;

uniform vec2 u__scale;
uniform float u__length;
uniform float u__rotation;
uniform vec2 u__translation;

varying vec2 v_UV_local;
varying vec2 v_UV;

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

void main() {
	// Calculate UV coordinates of current rendered object.
	v_UV_local = 0.5 * (a__position + 1.0);

	// Stretch center of shape to form a round-capped line segment.
	if (a__position.x < 0.0) {
		a__position.x -= u__length / 2.0;
	} else if (a__position.x > 0.0) {
		a__position.x += u__length / 2.0;
	}

	// Apply transformations.
	vec2 position = rotate2d(u__rotation) * (u__scale * a__position) + u__translation;

	// Calculate a global uv for the viewport.
	v_UV = 0.5 * (position + 1.0);

	// Calculate vertex position.
	gl_Position = vec4(position, 0, 1);
}