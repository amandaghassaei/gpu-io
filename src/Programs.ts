import { isArray } from '@amandaghassaei/type-checks';
import {
	FLOAT,
	GLSLPrecision,
	GPULayerNumComponents,
	GPULayerType,
	INT,
} from './constants';
import {
	glslComponentSelectionForNumComponents,
	glslPrefixForType,
	glslTypeForType,
	uniformTypeForType,
} from './conversions';
import type { GPUComposer } from './GPUComposer';
import { GPUProgram } from './GPUProgram';

/**
 * Init GPUProgram to copy contents of one GPULayer to another GPULayer.
 * @category GPUProgram Helper
 * @param composer - The current GPUComposer.
 * @param params - Program parameters.
 * @param params.type - The type of the input/output.
 * @param params.name - Optionally pass in a GPUProgram name, used for error logging.
 * @param params.precision - Optionally specify the precision of the input/output.
 * @returns
 */
export function copyProgram(composer: GPUComposer, params: {
	type: GPULayerType,
	name?: string,
	precision?: GLSLPrecision,
}) {
	const { type } = params;
	const precision = params.precision || '';
	const glslType = glslTypeForType(type, 4);
	const name = params.name ||`copy_${uniformTypeForType(type, composer.glslVersion)}_layer`;
	return new GPUProgram(composer, {
		name,
		fragmentShader: `
in vec2 v_uv;
uniform ${precision} ${glslPrefixForType(type)}sampler2D u_state;
out ${precision} ${glslType} out_result;
void main() {
	out_result = texture(u_state, v_uv);
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
 * Init GPUProgram to add several GPULayers together.
 * @category GPUProgram Helper
 * @param composer - The current GPUComposer.
 * @param params - Program parameters.
 * @param params.type - The type of the inputs/output.
 * @param params.components - Component(s) of inputs to add, defaults to 'xyzw.
 * @param params.name - Optionally pass in a GPUProgram name, used for error logging.
 * @param params.numInputs - The number of inputs to add together, defaults to 2.
 * @param params.precision - Optionally specify the precision of the inputs/output.
 * @returns
 */
 export function addLayersProgram(composer: GPUComposer, params: {
	type: GPULayerType,
	components?: string,
	name?: string,
	numInputs?: number,
	precision?: GLSLPrecision,
}) {
	const { type } = params;
	const numInputs = params.numInputs || 2;
	const precision = params.precision || '';
	const components = params.components || 'xyzw';
	const glslType = glslTypeForType(type, components.length as GPULayerNumComponents);
	const arrayOfLengthNumInputs = new Array(numInputs);
	const name = params.name || `${numInputs}-way_add_${uniformTypeForType(type, composer.glslVersion)}_${components}`;
	return new GPUProgram(composer, {
		name,
		fragmentShader: `
in vec2 v_uv;
${ arrayOfLengthNumInputs.map((el, i) => `uniform ${precision} ${glslPrefixForType(type)}sampler2D u_state${i};`).join('\n') }
out ${precision} ${glslType} out_result;
void main() {
	out_result = ${ arrayOfLengthNumInputs.map((el, i) => `texture(u_state${i}, v_uv).${components}`).join(' + ') };
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
 * Init GPUProgram to add uniform "u_value" to a GPULayer.
 * @category GPUProgram Helper
 * @param composer - The current GPUComposer.
 * @param params - Program parameters.
 * @param params.type - The type of the input/output (we assume "u_value" has the same type).
 * @param params.value - Initial value to add, if value has length 1 it will be applied to all components of GPULayer.  Change this later using uniform "u_value".
 * @param params.name - Optionally pass in a GPUProgram name, used for error logging.
 * @param params.precision - Optionally specify the precision of the input/output/"u_value".
 * @returns
 */
 export function addValueProgram(composer: GPUComposer, params: {
	type: GPULayerType,
	value: number | number[],
	name?: string,
	precision?: GLSLPrecision,
}) {
	const { type, value } = params;
	const precision = params.precision || '';
	const valueLength = isArray(value) ? (value as number[]).length : 1;
	const valueType = glslTypeForType(type, valueLength as GPULayerNumComponents);
	const numComponents = valueLength === 1 ? 4 : valueLength;
	const outputType = glslTypeForType(type, numComponents as GPULayerNumComponents);
	const componentSelection = glslComponentSelectionForNumComponents(numComponents as GPULayerNumComponents);
	const name = params.name || `addValue_${valueType}_w_length_${valueLength}`;
	return new GPUProgram(composer, {
		name,
		fragmentShader: `
in vec2 v_uv;
uniform ${precision} ${valueType} u_value;
uniform ${precision} ${glslPrefixForType(type)}sampler2D u_state;
out ${precision} ${outputType} out_result;
void main() {
	out_result = ${valueType !== outputType ? outputType : ''}(u_value) + texture(u_state, v_uv)${componentSelection};
}`,
		uniforms: [
			{
				name: 'u_state',
				value: 0,
				type: INT,
			},
			{
				name: 'u_value',
				value,
				type: uniformTypeForType(type, composer.glslVersion),
			},
		],
	});
}

/**
 * Init GPUProgram to multiply uniform "u_value" to a GPULayer.
 * @category GPUProgram Helper
 * @param composer - The current GPUComposer.
 * @param params - Program parameters.
 * @param params.type - The type of the input/output (we assume "u_value" has the same type).
 * @param params.value - Initial value to multiply, if value has length 1 it will be applied to all components of GPULayer.  Change this later using uniform "u_value".
 * @param params.name - Optionally pass in a GPUProgram name, used for error logging.
 * @param params.precision - Optionally specify the precision of the input/output/"u_value".
 * @returns
 */
 export function multiplyValueProgram(composer: GPUComposer, params: {
	type: GPULayerType,
	value: number | number[],
	name?: string,
	precision?: GLSLPrecision,
}) {
	const { type, value } = params;
	const precision = params.precision || '';
	const valueLength = isArray(value) ? (value as number[]).length : 1;
	const valueType = glslTypeForType(type, valueLength as GPULayerNumComponents);
	const numComponents = valueLength === 1 ? 4 : valueLength;
	const outputType = glslTypeForType(type, numComponents as GPULayerNumComponents);
	const componentSelection = glslComponentSelectionForNumComponents(numComponents as GPULayerNumComponents);
	const name = params.name || `addValue_${valueType}_w_length_${valueLength}`;
	return new GPUProgram(composer, {
		name,
		fragmentShader: `
in vec2 v_uv;
uniform ${precision} ${valueType} u_value;
uniform ${precision} ${glslPrefixForType(type)}sampler2D u_state;
out ${precision} ${outputType} out_result;
void main() {
	out_result = ${valueType !== outputType ? outputType : ''}(u_value) * texture(u_state, v_uv)${componentSelection};
}`,
		uniforms: [
			{
				name: 'u_state',
				value: 0,
				type: INT,
			},
			{
				name: 'u_value',
				value,
				type: uniformTypeForType(type, composer.glslVersion),
			},
		],
	});
}

/**
 * Init GPUProgram to set all elements in a GPULayer to uniform "u_value".
 * @category GPUProgram Helper
 * @param composer - The current GPUComposer.
 * @param params - Program parameters.
 * @param params.type - The type of the output (we assume "u_value" has same type).
 * @param params.value - Initial value to set, if value has length 1 it will be applied to all components of GPULayer.  Change this later using uniform "u_value".
 * @param params.name - Optionally pass in a GPUProgram name, used for error logging.
 * @param params.precision - Optionally specify the precision of the output/"u_value".
 * @returns
 */
export function setValueProgram(composer: GPUComposer, params: {
	type: GPULayerType,
	value: number | number[],
	name?: string,
	precision?: GLSLPrecision,
}) {
	const { type, value } = params;
	const precision = params.precision || '';
	const valueLength = isArray(value) ? (value as number[]).length : 1;
	const valueType = glslTypeForType(type, valueLength as GPULayerNumComponents);
	const numComponents = valueLength === 1 ? 4 : valueLength;
	const outputType = glslTypeForType(type, numComponents as GPULayerNumComponents);
	const name = params.name || `setValue_${valueType}_w_length_${valueLength}`;
	return new GPUProgram(composer, {
		name,
		fragmentShader: `
uniform ${precision} ${valueType} u_value;
out ${precision} ${outputType} out_result;
void main() {
	out_result = ${valueType !== outputType ? outputType : ''}(u_value);
}`,
		uniforms: [
			{
				name: 'u_value',
				value,
				type: uniformTypeForType(type, composer.glslVersion),
			},
		],
	});
}

/**
 * Init GPUProgram to set all elements in a GPULayer to uniform "u_value".
 * @category GPUProgram Helper
 * @param composer - The current GPUComposer.
 * @param params - Program parameters.
 * @param params.type - The type of the output.
 * @param params.color - Initial color as RGB in range [0, 1], defaults to [0, 0, 0].  Change this later using uniform "u_color".
 * @param params.opacity - Initial opacity in range [0, 1], defaults to 1.  Change this later using uniform "u_opacity".
 * @param params.name - Optionally pass in a GPUProgram name, used for error logging.
 * @param params.precision - Optionally specify the precision of the output/uniforms.
 * @returns
 */
 export function setColorProgram(composer: GPUComposer, params: {
	type: GPULayerType,
	color?: number[],
	opacity?: number,
	name?: string,
	precision?: GLSLPrecision,
}) {
	const { type } = params;
	const precision = params.precision || '';
	const opacity = params.opacity === undefined ? 1 : params.opacity;
	const color = params.color || [0, 0, 0];
	const name = params.name || `setColor`;
	const glslType = glslTypeForType(type, 4);
	return new GPUProgram(composer, {
		name,
		fragmentShader: `
uniform ${precision} vec3 u_color;
uniform ${precision} float u_opacity;
out ${precision} ${glslType} out_result;
void main() {
	out_result = ${glslType}(u_color, u_opacity);
}`,
		uniforms: [
			{
				name: 'u_color',
				value: color,
				type: FLOAT,
			},
			{
				name: 'u_opacity',
				value: opacity,
				type: FLOAT,
			},
		],
	});
}

/**
 * Init GPUProgram to zero output GPULayer.
 * @category GPUProgram Helper
 * @param composer - The current GPUComposer.
 * @param params - Program parameters.
 * @param params.name - Optionally pass in a GPUProgram name, used for error logging.
 * @returns
 */
 export function zeroProgram(composer: GPUComposer, params: {
	name?: string,
}) {
	return setValueProgram(composer, {
		type: FLOAT,
		value: 0,
		name: params.name,
	});
}


/**
 * Init GPUProgram to render 3 component GPULayer as RGB.
 * @category GPUProgram Helper
 * @param composer - The current GPUComposer.
 * @param params - Program parameters.
 * @param params.type - The type of the input.
 * @param params.name - Optionally pass in a GPUProgram name, used for error logging.
 * @param params.scale - Scaling factor, defaults to 1.  Change this later using uniform "u_scale".
 * @param params.opacity - Opacity, defaults to 1.  Change this later using uniform "u_opacity".
 * @param params.precision - Optionally specify the precision of the input.
 * @returns
 */
 export function renderRGBProgram(composer: GPUComposer, params: {
	type: GPULayerType,
	name?: string,
	scale?: number,
	opacity?: number,
	precision?: GLSLPrecision,
}) {
	const { type } = params;
	const precision = params.precision || '';
	const numComponents = 3;
	const glslType = glslTypeForType(type, numComponents);
	const glslFloatType = glslTypeForType(FLOAT, numComponents);
	const glslPrefix = glslPrefixForType(type);
	const shouldCast = glslFloatType === glslType;
	const name = params.name || `renderRGB_${glslType}`;
	return new GPUProgram(composer, {
		name,
		fragmentShader: `
in vec2 v_uv;
uniform float u_opacity;
uniform float u_scale;
uniform ${precision} ${glslPrefix}sampler2D u_state;
out vec4 out_result;
void main() {
	vec3 color = u_scale * (${shouldCast ? '' : glslFloatType}(texture(u_state, v_uv).rgb));
	out_result = vec4(color, u_opacity);
}`,
		uniforms: [
			{
				name: 'u_state',
				value: 0,
				type: INT,
			},
			{
				name: 'u_scale',
				value: params.scale !== undefined ? params.scale : 1,
				type: FLOAT,
			},
			{
				name: 'u_opacity',
				value: params.opacity !== undefined ? params.opacity : 1,
				type: FLOAT,
			},
		],
	});
}

/**
 * Init GPUProgram to render RGBA amplitude of an input GPULayer's components, defaults to grayscale rendering and works for scalar and vector fields.
 * @category GPUProgram Helper
 * @param composer - The current GPUComposer.
 * @param params - Program parameters.
 * @param params.type - The type of the input.
 * @param params.components - Component(s) of input GPULayer to render, defaults to 'xyzw'.
 * @param params.name - Optionally pass in a GPUProgram name, used for error logging.
 * @param params.scale - Scaling factor, defaults to 1.  Change this later using uniform "u_scale".
 * @param params.opacity - Opacity, defaults to 1.  Change this later using uniform "u_opacity".
 * @param params.colorMax - RGB color for amplitude === scale, scaled to [0,1] range, defaults to white.  Change this later using uniform "u_colorMax".
 * @param params.colorMin - RGB color for amplitude === 0, scaled to [0,1] range, defaults to black.  Change this later using uniform "u_colorMin".
 * @param params.precision - Optionally specify the precision of the input.
 * @returns
 */
 export function renderAmplitudeProgram(composer: GPUComposer, params: {
	type: GPULayerType,
	components?: string,
	name?: string,
	scale?: number,
	opacity?: number,
	colorMax?: number[],
	colorMin?: number[],
	precision?: GLSLPrecision,
}) {
	const { type } = params;
	const precision = params.precision || '';
	const components = params.components || 'xyzw';
	const numComponents = components.length as GPULayerNumComponents;
	const glslType = glslTypeForType(type, numComponents);
	const glslFloatType = glslTypeForType(FLOAT, numComponents);
	const glslPrefix = glslPrefixForType(type);
	const shouldCast = glslFloatType === glslType;
	const name = params.name || `renderAmplitude_${glslType}_w_${numComponents}_components`;
	return new GPUProgram(composer, {
		name,
		fragmentShader: `
in vec2 v_uv;
uniform float u_opacity;
uniform float u_scale;
uniform vec3 u_colorMax;
uniform vec3 u_colorMin;
uniform ${precision} ${glslPrefix}sampler2D u_state;
out vec4 out_result;
void main() {
	float amplitude = u_scale * ${ numComponents === 1 ? 'abs' : 'length'}(${shouldCast ? '' : glslFloatType}(texture(u_state, v_uv)${components === 'xyzw' || components === 'rgba' || components === 'stpq' ? '' : `.${components}`}));
	vec3 color = mix(u_colorMin, u_colorMax, amplitude);
	out_result = vec4(color, u_opacity);
}`,
		uniforms: [
			{
				name: 'u_state',
				value: 0,
				type: INT,
			},
			{
				name: 'u_scale',
				value: params.scale !== undefined ? params.scale : 1,
				type: FLOAT,
			},
			{
				name: 'u_opacity',
				value: params.opacity !== undefined ? params.opacity : 1,
				type: FLOAT,
			},
			{
				name: 'u_colorMax',
				value: params.colorMax || [1, 1, 1],
				type: FLOAT,
			},
			{
				name: 'u_colorMin',
				value: params.colorMin || [0, 0, 0],
				type: FLOAT,
			},
		],
	});
}

/**
 * Init GPUProgram to render signed amplitude of an input GPULayer to linearly interpolated colors.
 * @category GPUProgram Helper
 * @param composer - The current GPUComposer.
 * @param params - Program parameters.
 * @param params.type - The type of the input.
 * @param params.name - Optionally pass in a GPUProgram name, used for error logging.
 * @param params.scale - Scaling factor, defaults to 1.  Change this later using uniform "u_scale".
 * @param params.bias - Bias for center point of color range, defaults to 0.  Change this later using uniform "u_bias".
 * @param params.opacity - Opacity, defaults to 1.  Change this later using uniform "u_opacity".
 * @param params.colorMax - RGB color for amplitude === bias + scale, scaled to [0,1] range, defaults to red.  Change this later using uniform "u_colorMax".
 * @param params.colorMin - RGB color for amplitude === bias + scale, scaled to [0,1] range, defaults to blue.  Change this later using uniform "u_colorMin".
 * @param params.colorCenter - RGB color for amplitude === bias, scaled to [0,1] range, defaults to white.  Change this later using uniform "u_colorCenter".
 * @param params.component - Component of input GPULayer to render, defaults to "x".
 * @param params.precision - Optionally specify the precision of the input.
 * @returns
 */
 export function renderSignedAmplitudeProgram(composer: GPUComposer, params: {
	type: GPULayerType,
	component?: 'x' | 'y' | 'z' | 'w',
	name?: string,
	scale?: number,
	bias?: number,
	opacity?: number,
	colorMax?: number[],
	colorMin?: number[],
	colorCenter?: number[],
	precision?: GLSLPrecision,
}) {
	const { type } = params;
	const precision = params.precision || '';
	const glslType = glslTypeForType(type, 1);
	const glslPrefix = glslPrefixForType(type);
	const castFloat = glslType === 'float';
	const component = params.component || 'x';
	const name = params.name || `renderAmplitude_${glslType}_${component}`;
	return new GPUProgram(composer, {
		name,
		fragmentShader: `
in vec2 v_uv;
uniform float u_opacity;
uniform float u_scale;
uniform float u_bias;
uniform vec3 u_colorMin;
uniform vec3 u_colorMax;
uniform vec3 u_colorCenter;
uniform ${precision} ${glslPrefix}sampler2D u_state;
out vec4 out_result;
void main() {
	float signedAmplitude = u_scale * (${castFloat ? '' : 'float'}(texture(u_state, v_uv).${component}) - u_bias);
	float amplitudeSign = sign(signedAmplitude);
	vec3 interpColor = mix(u_colorMin, u_colorMax, amplitudeSign / 2.0 + 0.5);
	vec3 color = mix(u_colorCenter, interpColor, signedAmplitude * amplitudeSign);
	out_result = vec4(color, u_opacity);
}`,
		uniforms: [
			{
				name: 'u_state',
				value: 0,
				type: INT,
			},
			{
				name: 'u_scale',
				value: params.scale !== undefined ? params.scale : 1,
				type: FLOAT,
			},
			{
				name: 'u_bias',
				value: params.bias || 0,
				type: FLOAT,
			},
			{
				name: 'u_opacity',
				value: params.opacity !== undefined ? params.opacity : 1,
				type: FLOAT,
			},
			{
				name: 'u_colorMin',
				value: params.colorMin || [0, 0, 1],
				type: FLOAT,
			},
			{
				name: 'u_colorMax',
				value: params.colorMax || [1, 0, 0],
				type: FLOAT,
			},
			{
				name: 'u_colorCenter',
				value: params.colorCenter || [1, 1, 1],
				type: FLOAT,
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
out vec4 out_result;
void main() {
	// Check if this line has wrapped.
	if ((v_lineWrapping.x != 0.0 && v_lineWrapping.x != 1.0) || (v_lineWrapping.y != 0.0 && v_lineWrapping.y != 1.0)) {
		// Render nothing.
		discard;
		return;
	}
	out_result = vec4(u_value);
}`,
	});
}
