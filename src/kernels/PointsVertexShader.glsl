@import ./Utils;

// Vertex shader for points.
precision highp float;
precision highp int;

// Cannot use int vertex attributes: https://stackoverflow.com/questions/27874983/webgl-how-to-use-integer-attributes-in-glsl
attribute float a__index; // Index of point.

uniform sampler2D u__positions; // Texture lookup with position data.
uniform vec2 u__positionDimensions;
uniform vec2 u__scale;
uniform float u__pointSize;

varying vec2 v_UV;
varying vec2 vParticleUV;

void main() {
	// Calculate a uv based on the point's index attribute.
	vParticleUV = vec2(modI(a__index, u__positionDimensions.x), floor(floor(a__index + 0.5) / u__positionDimensions.x)) / u__positionDimensions;

	// Calculate a global uv for the viewport.
	// Lookup vertex position and scale to [0, 1] range.
	v_UV = texture2D(u__positions, vParticleUV).xy * u__scale;

	// Calculate position in [-1, 1] range.
	vec2 position = v_UV * 2.0 - 1.0;

	gl_PointSize = u__pointSize;
	gl_Position = vec4(position, 0, 1);
}