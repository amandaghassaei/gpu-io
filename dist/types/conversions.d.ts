import { GLSLPrecision, GLSLVersion, GPULayerNumComponents, GPULayerType } from './constants';
/**
 * Enum for precision values.
 * See src/glsl/common/precision.ts for more info.
 * @private
 */
export declare function intForPrecision(precision: GLSLPrecision): 2 | 1 | 0;
/**
 * @private
 */
export declare function uniformTypeForType(type: GPULayerType, glslVersion: GLSLVersion): "FLOAT" | "INT" | "UINT";
/**
 * @private
 */
export declare function arrayConstructorForType(type: GPULayerType, halfFloatsAsFloats?: boolean): Float32ArrayConstructor | Uint16ArrayConstructor | Uint8ArrayConstructor | Int8ArrayConstructor | Int16ArrayConstructor | Uint32ArrayConstructor | Int32ArrayConstructor;
/**
 * @private
 */
export declare function glslTypeForType(type: GPULayerType, numComponents: GPULayerNumComponents): string;
/**
 * @private
 */
export declare function glslPrefixForType(type: GPULayerType): "" | "u" | "i";
/**
 * @private
 */
export declare function glslComponentSelectionForNumComponents(numComponents: GPULayerNumComponents): "" | ".x" | ".xy" | ".xyz";
