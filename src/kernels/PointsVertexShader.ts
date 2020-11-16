// Vertex shader for points.
export default `
precision highp float;

attribute int aIndex; // Index of point.

uniform sampler2D u_position; // Texture lookup with position data.
uniform vec2 u_positionDimensions;
uniform vec2 u_scale;
uniform float u_pointSize;

varying vec2 vUV;

void main() {
	// Calculate a uv based on the point's index attribute.
	vec2 positionUV = vec2(aIndex % u_positionDimensions, floor(aIndex / u_positionDimensions)) / u_positionDimensions;

	// Lookup vertex position.
	vec2 position = texture2D(u_position, positionUV) * u_scale;

	// Calculate a global uv for the viewport.
	vUV = 0.5 * (position + 1.0);

	gl_PointSize = u_pointSize;
	gl_Position = vec4(position, 0, 1);
}
`;