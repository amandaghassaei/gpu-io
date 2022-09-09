import { GLSLPrecision, GPULayerNumComponents, GPULayerType } from './constants';
import { GPUComposer } from './GPUComposer';
import { GPUProgram } from './GPUProgram';
/**
 * Copy contents of one GPULayer to another GPULayer.
 * @param params.composer - The current GPUComposer.
 * @param params.type - The type of the GPULayer to be copied.
 * @param params.precision - Optionally specify the precision of the input and output (must be the same).
 * @returns
 */
export declare function copyProgram(params: {
    composer: GPUComposer;
    type: GPULayerType;
    precision?: GLSLPrecision;
}): GPUProgram;
/**
 * Add several GPULayers together.
 * @param params.composer - The current GPUComposer.
 * @param params.type - The type of the GPULayers to be added (must all be the same).
 * @param params.numComponents - The number of components of the GPULayers to be added (must all be the same).
 * @param params.numInputs - The number of input GPULayers to add together, defaults to 2.
 * @param params.precision - Optionally specify the precision of the inputs and output (must all be the same).
 * @returns
 */
export declare function addLayersProgram(params: {
    composer: GPUComposer;
    type: GPULayerType;
    numComponents: GPULayerNumComponents;
    numInputs?: number;
    precision?: GLSLPrecision;
}): GPUProgram;
/**
 * Add uniform value to a GPULayer.
 * @param params.composer - The current GPUComposer.
 * @param params.type - The type of the GPULayer.
 * @param params.numComponents - The number of components of the GPULayer.
 * @param params.precision - Optionally specify the precision of the input and output.
 * @returns
 */
export declare function addValueProgram(params: {
    composer: GPUComposer;
    type: GPULayerType;
    numComponents: GPULayerNumComponents;
    precision?: GLSLPrecision;
}): GPUProgram;
/**
 * Set value of all elements in a GPULayer via a uniform "u_value".
 * @param params.composer - The current GPUComposer.
 * @param params.type - The type of the GPULayer to be set.
 * @param params.numComponents - The number of components in the uniform.
 * @param params.precision - Optionally specify the precision of the uniform and output (must be the same).
 * @returns
 */
export declare function setValueProgram(params: {
    composer: GPUComposer;
    type: GPULayerType;
    numComponents: GPULayerNumComponents;
    precision?: GLSLPrecision;
}): GPUProgram;
/**
 * Set value of all elements in a GPULayer via a uniform "u_value".
 * @param params.composer - The current GPUComposer.
 * @param params.type - The type of the GPULayer to be set.
 * @param params.numComponents - The number of components in the uniform.
 * @param params.precision - Optionally specify the precision of the uniform and output (must be the same).
 * @returns
 */
export declare function renderAmplitudeGrayscaleProgram(params: {
    composer: GPUComposer;
    type: GPULayerType;
    numComponents: GPULayerNumComponents;
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
