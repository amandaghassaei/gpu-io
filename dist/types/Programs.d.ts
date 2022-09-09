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
 * @param params.precision - Optionally specify the precision of the input/output/"u_value".
 * @returns
 */
export declare function addValueProgram(params: {
    composer: GPUComposer;
    type: GPULayerType;
    numComponents: GPULayerNumComponents;
    name?: string;
    precision?: GLSLPrecision;
}): GPUProgram;
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
export declare function setValueProgram(params: {
    composer: GPUComposer;
    type: GPULayerType;
    numComponents: GPULayerNumComponents;
    name?: string;
    precision?: GLSLPrecision;
}): GPUProgram;
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
export declare function renderAmplitudeGrayscaleProgram(params: {
    composer: GPUComposer;
    type: GPULayerType;
    numComponents: GPULayerNumComponents;
    name?: string;
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
