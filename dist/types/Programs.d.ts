import { GLSLPrecision, GPULayerType } from './constants';
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
export declare function copyProgram(composer: GPUComposer, params: {
    type: GPULayerType;
    name?: string;
    precision?: GLSLPrecision;
}): GPUProgram;
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
export declare function addLayersProgram(composer: GPUComposer, params: {
    type: GPULayerType;
    components?: string;
    name?: string;
    numInputs?: number;
    precision?: GLSLPrecision;
}): GPUProgram;
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
export declare function addValueProgram(composer: GPUComposer, params: {
    type: GPULayerType;
    value: number | number[];
    name?: string;
    precision?: GLSLPrecision;
}): GPUProgram;
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
export declare function multiplyValueProgram(composer: GPUComposer, params: {
    type: GPULayerType;
    value: number | number[];
    name?: string;
    precision?: GLSLPrecision;
}): GPUProgram;
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
export declare function setValueProgram(composer: GPUComposer, params: {
    type: GPULayerType;
    value: number | number[];
    name?: string;
    precision?: GLSLPrecision;
}): GPUProgram;
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
export declare function setColorProgram(composer: GPUComposer, params: {
    type: GPULayerType;
    color?: number[];
    opacity?: number;
    name?: string;
    precision?: GLSLPrecision;
}): GPUProgram;
/**
 * Init GPUProgram to zero output GPULayer.
 * @category GPUProgram Helper
 * @param composer - The current GPUComposer.
 * @param params - Program parameters.
 * @param params.name - Optionally pass in a GPUProgram name, used for error logging.
 * @returns
 */
export declare function zeroProgram(composer: GPUComposer, params: {
    name?: string;
}): GPUProgram;
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
export declare function renderRGBProgram(composer: GPUComposer, params: {
    type: GPULayerType;
    name?: string;
    scale?: number;
    opacity?: number;
    precision?: GLSLPrecision;
}): GPUProgram;
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
export declare function renderAmplitudeProgram(composer: GPUComposer, params: {
    type: GPULayerType;
    components?: string;
    name?: string;
    scale?: number;
    opacity?: number;
    colorMax?: number[];
    colorMin: number[];
    precision?: GLSLPrecision;
}): GPUProgram;
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
export declare function renderSignedAmplitudeProgram(composer: GPUComposer, params: {
    type: GPULayerType;
    component?: 'x' | 'y' | 'z' | 'w';
    name?: string;
    scale?: number;
    bias?: number;
    opacity?: number;
    colorMax?: number[];
    colorMin?: number[];
    colorCenter?: number[];
    precision?: GLSLPrecision;
}): GPUProgram;
/**
 * @private
 */
export declare function wrappedLineColorProgram(composer: GPUComposer): GPUProgram;
