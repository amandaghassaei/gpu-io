import { GPULayerNumComponents, GPULayerType, INT } from './constants';
import { glslPrefixForType, glslTypeForType, uniformTypeForType } from './conversions';
import { GPUComposer } from './GPUComposer';
import { GPUProgram } from './GPUProgram';

/**
 * 
 * @param composer 
 * @param type 
 * @returns 
 */
export function copyProgramForType(composer: GPUComposer, type: GPULayerType) {
	const glslType = glslTypeForType(type, 4);
	return new GPUProgram(composer, {
		name: `copy-${glslType}`,
		fragmentShader: `
in vec2 v_uv;
uniform ${glslPrefixForType(type)}sampler2D u_state;
out ${glslType} out_fragColor;
void main() {
	out_fragColor = texture(u_state, v_uv);
}`,
		uniforms: [
			{
				name: 'u_state',
				value: 0,
				type: INT,
			},
		],
	});
}

/**
 * 
 */
export function setValueProgramForTypeAndNumComponents(
	composer: GPUComposer,
	type: GPULayerType,
	numComponents: GPULayerNumComponents,
) {
	const glslType = glslTypeForType(type, numComponents);
	return new GPUProgram(composer, {
		name: `setValue-${glslType},${numComponents}`,
		fragmentShader: `
uniform ${glslType} u_value;
out ${glslType} out_fragColor;
void main() {
	out_fragColor = u_value;
}`,
		uniforms: [
			{
				name: 'u_value',
				value: (new Array(numComponents)).fill(0),
				type: uniformTypeForType(type, composer.glslVersion),
			},
		],
	});
}

/**
 * @private
 */
export function wrappedLineColorProgram(composer: GPUComposer) {
	return new GPUProgram(composer, {
		name: `wrappedLineColor`,
		fragmentShader: `
in vec2 v_lineWrapping;
uniform vec4 u_value;
out vec4 out_fragColor;
void main() {
	// Check if this line has wrapped.
	if ((v_lineWrapping.x != 0.0 && v_lineWrapping.x != 1.0) || (v_lineWrapping.y != 0.0 && v_lineWrapping.y != 1.0)) {
		// Render nothing.
		discard;
		return;
	}
	out_fragColor = vec4(u_value);
}`,
	});
}

/**
 * Fragment shader that draws the magnitude of a GPULayer as a color.
 * @private
 */
 export function vectorMagnitudeProgramForType(composer: GPUComposer, type: GPULayerType) {
	const glslPrefix = glslPrefixForType(type);
	return new GPUProgram(composer, {
		name: `vectorMagnitude`,
		fragmentShader: `
in vec2 v_uv;
uniform vec3 u_color;
uniform float u_scale;
uniform ${glslPrefix}sampler2D u_gpuio_data;
out vec4 out_fragColor;
void main() {
	uvec4 value = texture(u_gpuio_data, v_uv);
	float mag = length(value);
	out_fragColor = vec4(mag * u_scale * u_color, 1);
}`,
	});
}
