import { FLOAT, GLSLPrecision, GPULayerNumComponents, GPULayerType, INT } from './constants';
import { glslComponentSelectionForNumComponents, glslPrefixForType, glslTypeForType, uniformTypeForType } from './conversions';
import { GPUComposer } from './GPUComposer';
import { GPUProgram } from './GPUProgram';

/**
 * Copy contents of one GPULayer to another GPULayer.
 * @param params - Program parameters.
 * @param params.composer - The current GPUComposer.
 * @param params.type - The type of the input/output.
 * @param params.name - Optionally pass in a GPUProgram name, used for error logging.
 * @param params.precision - Optionally specify the precision of the input/output.
 * @returns
 */
export function copyProgram(params: {
	composer: GPUComposer,
	type: GPULayerType,
	name?: string,
	precision?: GLSLPrecision,
}) {
	const { composer, type } = params;
	const precision = params.precision || '';
	const glslType = glslTypeForType(type, 4);
	const name = params.name ||`copy_${uniformTypeForType(type, composer.glslVersion)}_layer`;
	return new GPUProgram(composer, {
		name,
		fragmentShader: `
in vec2 v_uv;
uniform ${precision} ${glslPrefixForType(type)}sampler2D u_state;
out ${precision} ${glslType} out_fragColor;
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
 * Add several GPULayers together.
 * @param params - Program parameters.
 * @param params.composer - The current GPUComposer.
 * @param params.type - The type of the inputs/output.
 * @param params.numComponents - The number of components of the inputs/output.
 * @param params.name - Optionally pass in a GPUProgram name, used for error logging.
 * @param params.numInputs - The number of inputs to add together, defaults to 2.
 * @param params.precision - Optionally specify the precision of the inputs/output.
 * @returns
 */
 export function addLayersProgram(params: {
	composer: GPUComposer,
	type: GPULayerType,
	numComponents: GPULayerNumComponents,
	name: string,
	numInputs?: number,
	precision?: GLSLPrecision,
}) {
	const { composer, type, numComponents } = params;
	const numInputs = params.numInputs || 2;
	const precision = params.precision || '';
	const glslType = glslTypeForType(type, numComponents);
	const arrayOfLengthNumInputs = new Array(numInputs);
	const componentSelection = glslComponentSelectionForNumComponents(numComponents);
	const name = params.name || `${numInputs}-way_add_${uniformTypeForType(type, composer.glslVersion)}_w_${numComponents}_components`;
	return new GPUProgram(composer, {
		name,
		fragmentShader: `
in vec2 v_uv;
${ arrayOfLengthNumInputs.map((el, i) => `uniform ${precision} ${glslPrefixForType(type)}sampler2D u_state${i};`).join('\n') }
out ${precision} ${glslType} out_fragColor;
void main() {
	out_fragColor = ${ arrayOfLengthNumInputs.map((el, i) => `texture(u_state${i}, v_uv)${componentSelection}`).join(' + ') };
}`,
		uniforms: arrayOfLengthNumInputs.map((el, i) => {
			return {
				name: `u_state${i}`,
				value: i,
				type: INT,
			};
		}),
	});
}

/**
 * Add uniform "u_value" to a GPULayer.
 * @param params - Program parameters.
 * @param params.composer - The current GPUComposer.
 * @param params.type - The type of the input/output (we assume "u_value" has the same type).
 * @param params.numComponents - The number of components of the input/output and "u_value".
 * @param params.name - Optionally pass in a GPUProgram name, used for error logging.
 * @param params.precision - Optionally specify the precision of the input/output/"u_value".
 * @returns
 */
 export function addValueProgram(params: {
	composer: GPUComposer,
	type: GPULayerType,
	numComponents: GPULayerNumComponents,
	name?: string,
	precision?: GLSLPrecision,
}) {
	const { composer, type, numComponents } = params;
	const precision = params.precision || '';
	const glslType = glslTypeForType(type, numComponents);
	const componentSelection = glslComponentSelectionForNumComponents(numComponents);
	const name = params.name || `addValue_${glslType}_w_${numComponents}_components`;
	return new GPUProgram(composer, {
		name,
		fragmentShader: `
in vec2 v_uv;
uniform ${precision} ${glslType} u_value;
uniform ${precision} ${glslPrefixForType(type)}sampler2D u_state;
out ${precision} ${glslType} out_fragColor;
void main() {
	out_fragColor = u_value + texture(u_state, v_uv)${componentSelection};
}`,
		uniforms: [
			{
				name: 'u_state',
				value: 0,
				type: INT,
			},
			{
				name: 'u_value',
				value: (new Array(numComponents)).fill(0),
				type: uniformTypeForType(type, composer.glslVersion),
			},
		],
	});
}

/**
 * Set all elements in a GPULayer to uniform "u_value".
 * @param params - Program parameters.
 * @param params.composer - The current GPUComposer.
 * @param params.type - The type of the output (we assume "u_value" has same type).
 * @param params.numComponents - The number of components in the output/"u_value".
 * @param params.name - Optionally pass in a GPUProgram name, used for error logging.
 * @param params.precision - Optionally specify the precision of the output/"u_value".
 * @returns
 */
export function setValueProgram(params: {
	composer: GPUComposer,
	type: GPULayerType,
	numComponents: GPULayerNumComponents,
	name?: string,
	precision?: GLSLPrecision,
}) {
	const { composer, type, numComponents } = params;
	const precision = params.precision || '';
	const glslType = glslTypeForType(type, numComponents);
	const name = params.name || `setValue_${glslType}_w_${numComponents}_components`;
	return new GPUProgram(composer, {
		name,
		fragmentShader: `
uniform ${precision} ${glslType} u_value;
out ${precision} ${glslType} out_fragColor;
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
 * Render RGBA greyscale color corresponding to the amplitude of an input GPULayer.
 * @param params - Program parameters.
 * @param params.composer - The current GPUComposer.
 * @param params.type - The type of the input.
 * @param params.numComponents - The number of components in the input.
 * @param params.name - Optionally pass in a GPUProgram name, used for error logging.
 * @param params.precision - Optionally specify the precision of the input.
 * @returns
 */
 export function renderAmplitudeGrayscaleProgram(params: {
	composer: GPUComposer,
	type: GPULayerType,
	numComponents: GPULayerNumComponents,
	name?: string,
	precision?: GLSLPrecision,
}) {
	const { composer, type, numComponents } = params;
	const precision = params.precision || '';
	const glslType = glslTypeForType(type, numComponents);
	const glslFloatType = glslTypeForType(FLOAT, numComponents);
	const glslPrefix = glslPrefixForType(type);
	const shouldCast = glslFloatType === glslType;
	const componentSelection = glslComponentSelectionForNumComponents(numComponents);
	const name = params.name || `renderAmplitude_${glslType}_w_${numComponents}_components`;
	return new GPUProgram(composer, {
		name,
		fragmentShader: `
in vec2 v_uv;
uniform float u_opacity;
uniform float u_scale;
uniform ${precision} ${glslPrefix}sampler2D u_state;
out vec4 out_fragColor;
void main() {
	${glslFloatType} amplitude = u_scale * ${shouldCast ? '' : glslFloatType}(texture(u_state, v_uv)${componentSelection});
	out_fragColor = vec4(amplitude, amplitude, amplitude, u_opacity);
}`,
		uniforms: [
			{
				name: 'u_state',
				value: 0,
				type: INT,
			},
			{
				name: 'u_scale',
				value: 1,
				type: FLOAT,
			},
			{
				name: 'u_opacity',
				value: 1,
				type: FLOAT,
			},
		],
	});
}

/**
 * @private
 */
export function wrappedLineColorProgram(params: { composer: GPUComposer }) {
	const { composer } = params;
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
 export function vectorMagnitudeProgram(params: {
	composer: GPUComposer,
	type: GPULayerType,
 }) {
	const { composer, type } = params;
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
