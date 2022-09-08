import { GPULayerNumComponents, GPULayerType } from './constants';
import { GPUComposer } from './GPUComposer';
import { GPUProgram } from './GPUProgram';
/**
 *
 * @param composer
 * @param type
 * @returns
 */
export declare function copyProgramForType(composer: GPUComposer, type: GPULayerType): GPUProgram;
/**
 *
 */
export declare function setValueProgramForTypeAndNumComponents(composer: GPUComposer, type: GPULayerType, numComponents: GPULayerNumComponents): GPUProgram;
/**
 * @private
 */
export declare function wrappedLineColorProgram(composer: GPUComposer): GPUProgram;
/**
 * Fragment shader that draws the magnitude of a GPULayer as a color.
 * @private
 */
export declare function vectorMagnitudeProgramForType(composer: GPUComposer, type: GPULayerType): GPUProgram;
