import { GPULayerType } from './constants';
/**
 * Checks if type is valid GPULayer data type.
 * @private
 */
export declare function isValidDataType(type: string): boolean;
/**
 * Checks if filter is valid GPULayer filter type.
 * @private
 */
export declare function isValidFilter(type: string): boolean;
/**
 * Checks if wrap is valid GPULayer wrap type.
 * @private
 */
export declare function isValidWrap(type: string): boolean;
/**
 * For image urls that are passed in and inited as GPULayers.
 * @private
 */
export declare function isValidImageFormat(type: string): boolean;
/**
 * For image urls that are passed in and inited as GPULayers.
 * @private
 */
export declare function isValidImageType(type: string): boolean;
/**
 * Checks if value is valid GPULayer clear value for numComponents and type.
 * @private
 */
export declare function isValidClearValue(clearValue: number | number[], numComponents: number, type: GPULayerType): boolean;
/**
 * Checks if value is valid number for a given GPULayer type.
 * Checks extrema values.
 * @private
 */
export declare function isNumberOfType(value: any, type: GPULayerType): boolean;
export declare function checkValidKeys(keys: string[], validKeys: string[], methodName: string, name?: string): void;
export declare function checkRequiredKeys(keys: string[], requiredKeys: string[], methodName: string, name?: string): void;
