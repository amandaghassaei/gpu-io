import { GLSLPrecision, GPULayerNumComponents, GPULayerType } from './constants';
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
export declare function copyProgram(params: {
    composer: GPUComposer;
    type: GPULayerType;
    name?: string;
    precision?: GLSLPrecision;
}): GPUProgram;
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
export declare function addLayersProgram(params: {
    composer: GPUComposer;
    type: GPULayerType;
    numComponents: GPULayerNumComponents;
    name: string;
    numInputs?: number;
    precision?: GLSLPrecision;
}): GPUProgram;
/**
 * Add uniform "u_value" to a GPULayer.
 * @param params - Program parameters.
 * @param params.composer - The current GPUComposer.
 * @param params.type - The type of the input/output (we assume "u_value" has the same type).
 * @param params.numComponents - The number of components of the input/output and "u_value".
 * @param params.name - Optionally pass in a GPUProgram name, used for error logging.
 * @param params.value - Initial value to add, defaults to 0 vector of length numComponents.  Change this later using uniform "u_value".
 * @param params.precision - Optionally specify the precision of the input/output/"u_value".
 * @returns
 */
export declare function addValueProgram(params: {
    composer: GPUComposer;
    type: GPULayerType;
    numComponents: GPULayerNumComponents;
    name?: string;
    value?: number | number[];
    precision?: GLSLPrecision;
}): GPUProgram;
/**
 * Set all elements in a GPULayer to uniform "u_value".
 * @param params - Program parameters.
 * @param params.composer - The current GPUComposer.
 * @param params.type - The type of the output (we assume "u_value" has same type).
 * @param params.numComponents - The number of components in the output/"u_value".
 * @param params.name - Optionally pass in a GPUProgram name, used for error logging.
 * @param params.value - Initial value to set, defaults to 0 vector of length numComponents.  Change this later using uniform "u_value".
 * @param params.precision - Optionally specify the precision of the output/"u_value".
 * @returns
 */
export declare function setValueProgram(params: {
    composer: GPUComposer;
    type: GPULayerType;
    numComponents: GPULayerNumComponents;
    name?: string;
    value?: number | number[];
    precision?: GLSLPrecision;
}): GPUProgram;
/**
 * Render RGBA amplitude of an input GPULayer's components, defaults to greyscale rendering and works for scalar and vector fields.
 * @param params - Program parameters.
 * @param params.composer - The current GPUComposer.
 * @param params.type - The type of the input.
 * @param params.components - Component(s) of input GPULayer to render.
 * @param params.name - Optionally pass in a GPUProgram name, used for error logging.
 * @param params.scale - Scaling factor, defaults to 1.  Change this later using uniform "u_scale".
 * @param params.opacity - Opacity, defaults to 1.  Change this later using uniform "u_opacity".
 * @param params.color - RGB color for non-zero amplitudes, scaled to [-0,1] range, defaults to white.  Change this later using uniform "u_color".
 * @param params.colorZero - RGB color for zero amplitudes, scaled to [-0,1] range, defaults to black.  Change this later using uniform "u_colorZero".
 * @param params.precision - Optionally specify the precision of the input.
 * @returns
 */
export declare function renderAmplitudeProgram(params: {
    composer: GPUComposer;
    type: GPULayerType;
    components: string;
    name?: string;
    scale?: number;
    opacity?: number;
    color?: number[];
    colorZero: number[];
    precision?: GLSLPrecision;
}): GPUProgram;
/**
 * Render signed amplitude of an input GPULayer to linearly interpolated colors.
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
export declare function renderSignedAmplitudeProgram(params: {
    composer: GPUComposer;
    type: GPULayerType;
    name?: string;
    scale?: number;
    opacity?: number;
    colorNegative?: number[];
    colorPositive?: number[];
    colorZero?: number[];
    component?: 'x' | 'y' | 'z' | 'w';
    precision?: GLSLPrecision;
}): GPUProgram;
/**
 * @private
 */
export declare function wrappedLineColorProgram(params: {
    composer: GPUComposer;
}): GPUProgram;
/**
 * Fragment shader that draws the magnitude of a GPULayer as a color.
 * @private
 */
export declare function vectorMagnitudeProgram(params: {
    composer: GPUComposer;
    type: GPULayerType;
}): GPUProgram;
