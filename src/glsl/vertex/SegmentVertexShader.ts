export const SEGMENT_VERTEX_SHADER_SOURCE = `
in vec2 a_gpuio_position;

uniform float u_gpuio_halfThickness;
uniform vec2 u_gpuio_scale;
uniform float u_gpuio_length;
uniform float u_gpuio_rotation;
uniform vec2 u_gpuio_translation;

out vec2 v_uv_local;
out vec2 v_uv;

mat2 rotate2d(float _angle){
	return mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));
}

void main() {
	// Calculate UV coordinates of current rendered object.
	v_uv_local = 0.5 * (a_gpuio_position + 1.0);

	vec2 position = a_gpuio_position;
	// Apply thickness / radius.
	position *= u_gpuio_halfThickness;
	// Stretch center of shape to form a round-capped line segment.
	float signX = sign(position.x);
	position.x += signX * u_gpuio_length / 2.0;
	v_uv_local.x = (signX + 1.0) / 2.0;// Set entire cap uv.x to 1 or 0.
	// Apply transformations.
	position = u_gpuio_scale * (rotate2d(-u_gpuio_rotation) * position) + u_gpuio_translation;

	// Calculate a global uv for the viewport.
	v_uv = 0.5 * (position + 1.0);

	// Calculate vertex position.
	gl_Position = vec4(position, 0, 1);
}`;