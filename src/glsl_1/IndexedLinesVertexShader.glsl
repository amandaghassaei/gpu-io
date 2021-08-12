precision highp float;
precision highp int;

@import ./Utils;

// Cannot use int vertex attributes: https://stackoverflow.com/questions/27874983/webgl-how-to-use-integer-attributes-in-glsl
attribute float a_internal_index; // Index of point.

uniform sampler2D u_internal_positions; // Texture lookup with position data.
uniform vec2 u_internal_positionsDimensions;
uniform vec2 u_internal_scale;
uniform bool u_internal_positionWithAccumulation;
uniform bool u_internal_wrapX;
uniform bool u_internal_wrapY;

varying vec2 v_UV;
varying vec2 v_lineWrapping; // Use this to test if line is only half wrapped and should not be rendered.

void main() {
	// Calculate a uv based on the point's index attribute.
	vec2 particleUV = vec2(
		modI(a_internal_index, u_internal_positionsDimensions.x),
		floor(floor(a_internal_index + 0.5) / u_internal_positionsDimensions.x)
	) / u_internal_positionsDimensions;

	// Calculate a global uv for the viewport.
	// Lookup vertex position and scale to [0, 1] range.
	// We have packed a 2D displacement with the position.
	vec4 positionData = texture2D(u_internal_positions, particleUV);
	// position = first two components plus last two components (optional accumulation buffer).
	vec2 positionAbsolute = positionData.rg;
	if (u_internal_positionWithAccumulation) positionAbsolute += positionData.ba;
	v_UV = positionAbsolute * u_internal_scale;

	// Wrap if needed.
	v_lineWrapping = vec2(0.0);
	if (u_internal_wrapX) {
		if (v_UV.x < 0.0) {
			v_UV.x += 1.0;
			v_lineWrapping.x = 1.0;
		} else if (v_UV.x > 1.0) {
			v_UV.x -= 1.0;
			v_lineWrapping.x = 1.0;
		}
	}
	if (u_internal_wrapY) {
		if (v_UV.y < 0.0) {
			v_UV.y += 1.0;
			v_lineWrapping.y = 1.0;
		} else if (v_UV.y > 1.0) {
			v_UV.y -= 1.0;
			v_lineWrapping.y = 1.0;
		}
	}

	// Calculate position in [-1, 1] range.
	vec2 position = v_UV * 2.0 - 1.0;

	gl_Position = vec4(position, 0, 1);
}