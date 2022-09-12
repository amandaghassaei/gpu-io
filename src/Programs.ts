import { isArray } from './checks';
import { FLOAT, GLSLPrecision, GPULayerNumComponents, GPULayerType, INT } from './constants';
import { glslComponentSelectionForNumComponents, glslPrefixForType, glslTypeForType, uniformTypeForType } from './conversions';
import { GPUComposer } from './GPUComposer';
import { GPUProgram } from './GPUProgram';

/**
 * Init GPUProgram to copy contents of one GPULayer to another GPULayer.
 * @category GPUProgram Helper
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
out ${precision} ${glslType} out_FragColor;
void main() {
	out_FragColor = texture(u_state, v_uv);
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
 * @param params - Program parameters.
 * @param params.composer - The current GPUComposer.
 * @param params.type - The type of the inputs/output.
 * @param params.components - Component(s) of inputs to add, defaults to 'xyzw.
 * @param params.name - Optionally pass in a GPUProgram name, used for error logging.
 * @param params.numInputs - The number of inputs to add together, defaults to 2.
 * @param params.precision - Optionally specify the precision of the inputs/output.
 * @returns
 */
 export function addLayersProgram(params: {
	composer: GPUComposer,
	type: GPULayerType,
	components?: string,
	name?: string,
	numInputs?: number,
	precision?: GLSLPrecision,
}) {
	const { composer, type } = params;
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
out ${precision} ${glslType} out_FragColor;
void main() {
	out_FragColor = ${ arrayOfLengthNumInputs.map((el, i) => `texture(u_state${i}, v_uv).${components}`).join(' + ') };
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
 * @param params - Program parameters.
 * @param params.composer - The current GPUComposer.
 * @param params.type - The type of the input/output (we assume "u_value" has the same type).
 * @param params.value - Initial value to add, if value has length 1 it will be applied to all components of GPULayer.  Change this later using uniform "u_value".
 * @param params.name - Optionally pass in a GPUProgram name, used for error logging.
 * @param params.precision - Optionally specify the precision of the input/output/"u_value".
 * @returns
 */
 export function addValueProgram(params: {
	composer: GPUComposer,
	type: GPULayerType,
	value: number | number[],
	name?: string,
	precision?: GLSLPrecision,
}) {
	const { composer, type, value } = params;
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
out ${precision} ${outputType} out_FragColor;
void main() {
	out_FragColor = ${valueType !== outputType ? outputType : ''}(u_value) + texture(u_state, v_uv)${componentSelection};
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
 * @param params - Program parameters.
 * @param params.composer - The current GPUComposer.
 * @param params.type - The type of the input/output (we assume "u_value" has the same type).
 * @param params.value - Initial value to multiply, if value has length 1 it will be applied to all components of GPULayer.  Change this later using uniform "u_value".
 * @param params.name - Optionally pass in a GPUProgram name, used for error logging.
 * @param params.precision - Optionally specify the precision of the input/output/"u_value".
 * @returns
 */
 export function multiplyValueProgram(params: {
	composer: GPUComposer,
	type: GPULayerType,
	value: number | number[],
	name?: string,
	precision?: GLSLPrecision,
}) {
	const { composer, type, value } = params;
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
out ${precision} ${outputType} out_FragColor;
void main() {
	out_FragColor = ${valueType !== outputType ? outputType : ''}(u_value) * texture(u_state, v_uv)${componentSelection};
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
 * @param params - Program parameters.
 * @param params.composer - The current GPUComposer.
 * @param params.type - The type of the output (we assume "u_value" has same type).
 * @param params.value - Initial value to set, if value has length 1 it will be applied to all components of GPULayer.  Change this later using uniform "u_value".
 * @param params.name - Optionally pass in a GPUProgram name, used for error logging.
 * @param params.precision - Optionally specify the precision of the output/"u_value".
 * @returns
 */
export function setValueProgram(params: {
	composer: GPUComposer,
	type: GPULayerType,
	value: number | number[],
	name?: string,
	precision?: GLSLPrecision,
}) {
	const { composer, type, value } = params;
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
out ${precision} ${outputType} out_FragColor;
void main() {
	out_FragColor = ${valueType !== outputType ? outputType : ''}(u_value);
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
 * @param params - Program parameters.
 * @param params.composer - The current GPUComposer.
 * @param params.type - The type of the output.
 * @param params.color - Initial color as RGB in range [0, 1], defaults to [0, 0, 0].  Change this later using uniform "u_color".
 * @param params.color - Initial opacity in range [0, 1], defaults to 1.  Change this later using uniform "u_opacity".
 * @param params.name - Optionally pass in a GPUProgram name, used for error logging.
 * @param params.precision - Optionally specify the precision of the output/uniforms.
 * @returns
 */
 export function setColorProgram(params: {
	composer: GPUComposer,
	type: GPULayerType,
	color?: number[],
	opacity?: number,
	name?: string,
	precision?: GLSLPrecision,
}) {
	const { composer, type } = params;
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
out ${precision} ${glslType} out_FragColor;
void main() {
	out_FragColor = ${glslType}(u_color, u_opacity);
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
 * @param params - Program parameters.
 * @param params.composer - The current GPUComposer.
 * @param params.name - Optionally pass in a GPUProgram name, used for error logging.
 * @returns
 */
 export function zeroProgram(params: {
	composer: GPUComposer,
	name?: string,
}) {
	return setValueProgram({
		composer: params.composer,
		type: FLOAT,
		value: 0,
		name: params.name,
	});
}

/**
 * Init GPUProgram to render RGBA amplitude of an input GPULayer's components, defaults to grayscale rendering and works for scalar and vector fields.
 * @category GPUProgram Helper
 * @param params - Program parameters.
 * @param params.composer - The current GPUComposer.
 * @param params.type - The type of the input.
 * @param params.components - Component(s) of input GPULayer to render, defaults to 'xyzw'.
 * @param params.name - Optionally pass in a GPUProgram name, used for error logging.
 * @param params.scale - Scaling factor, defaults to 1.  Change this later using uniform "u_scale".
 * @param params.opacity - Opacity, defaults to 1.  Change this later using uniform "u_opacity".
 * @param params.color - RGB color for non-zero amplitudes, scaled to [-0,1] range, defaults to white.  Change this later using uniform "u_color".
 * @param params.colorZero - RGB color for zero amplitudes, scaled to [-0,1] range, defaults to black.  Change this later using uniform "u_colorZero".
 * @param params.precision - Optionally specify the precision of the input.
 * @returns
 */
 export function renderAmplitudeProgram(params: {
	composer: GPUComposer,
	type: GPULayerType,
	components?: string,
	name?: string,
	scale?: number,
	opacity?: number,
	color?: number[],
	colorZero: number[],
	precision?: GLSLPrecision,
}) {
	const { composer, type } = params;
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
uniform vec3 u_color;
uniform vec3 u_colorZero;
uniform ${precision} ${glslPrefix}sampler2D u_state;
out vec4 out_FragColor;
void main() {
	float amplitude = u_scale * ${ numComponents === 1 ? 'abs' : 'length'}(${shouldCast ? '' : glslFloatType}(texture(u_state, v_uv)${components === 'xyzw' || components === 'rgba' || components === 'stpq' ? '' : `.${components}`}));
	vec3 color = mix(u_colorZero, u_color, amplitude);
	out_FragColor = vec4(color, u_opacity);
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
				name: 'u_color',
				value: params.color || [1, 1, 1],
				type: FLOAT,
			},
			{
				name: 'u_colorZero',
				value: params.colorZero || [0, 0, 0],
				type: FLOAT,
			},
		],
	});
}

/**
 * Init GPUProgram to render signed amplitude of an input GPULayer to linearly interpolated colors.
 * @category GPUProgram Helper
 * @param params - Program parameters.
 * @param params.composer - The current GPUComposer.
 * @param params.type - The type of the input.
 * @param params.name - Optionally pass in a GPUProgram name, used for error logging.
 * @param params.scale - Scaling factor, defaults to 1.  Change this later using uniform "u_scale".
 * @param params.opacity - Opacity, defaults to 1.  Change this later using uniform "u_opacity".
 * @param params.colorNegative - RGB color for negative amplitudes, scaled to [-0,1] range, defaults to blue.  Change this later using uniform "u_colorNegative".
 * @param params.colorPositive - RGB color for positive amplitudes, scaled to [-0,1] range, defaults to red.  Change this later using uniform "u_colorPositive".
 * @param params.colorZero - RGB color for zero amplitudes, scaled to [-0,1] range, defaults to white.  Change this later using uniform "u_colorZero".
 * @param params.component - Component of input GPULayer to render, defaults to "x".
 * @param params.precision - Optionally specify the precision of the input.
 * @returns
 */
 export function renderSignedAmplitudeProgram(params: {
	composer: GPUComposer,
	type: GPULayerType,
	component?: 'x' | 'y' | 'z' | 'w',
	name?: string,
	scale?: number,
	opacity?: number,
	colorNegative?: number[],
	colorPositive?: number[],
	colorZero?: number[],
	precision?: GLSLPrecision,
}) {
	const { composer, type } = params;
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
uniform vec3 u_colorNegative;
uniform vec3 u_colorPositive;
uniform vec3 u_colorZero;
uniform ${precision} ${glslPrefix}sampler2D u_state;
out vec4 out_FragColor;
void main() {
	float signedAmplitude = u_scale * ${castFloat ? '' : 'float'}(texture(u_state, v_uv).${component});
	float amplitudeSign = sign(signedAmplitude);
	vec3 interpColor = mix(u_colorNegative, u_colorPositive, amplitudeSign / 2.0 + 0.5);
	vec3 color = mix(u_colorZero, interpColor, signedAmplitude * amplitudeSign);
	out_FragColor = vec4(color, u_opacity);
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
				name: 'u_colorNegative',
				value: params.colorNegative || [0, 0, 1],
				type: FLOAT,
			},
			{
				name: 'u_colorPositive',
				value: params.colorPositive || [1, 0, 0],
				type: FLOAT,
			},
			{
				name: 'u_colorZero',
				value: params.colorZero || [1, 1, 1],
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
out vec4 out_FragColor;
void main() {
	// Check if this line has wrapped.
	if ((v_lineWrapping.x != 0.0 && v_lineWrapping.x != 1.0) || (v_lineWrapping.y != 0.0 && v_lineWrapping.y != 1.0)) {
		// Render nothing.
		discard;
		return;
	}
	out_FragColor = vec4(u_value);
}`,
	});
}

/**
 * Fragment shader that draws the magnitude of a GPULayer as a color.
 * TODO: this could be replaced with something else.
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
out vec4 out_FragColor;
void main() {
	uvec4 value = texture(u_gpuio_data, v_uv);
	float mag = length(value);
	out_FragColor = vec4(mag * u_scale * u_color, 1);
}`,
	});
}
