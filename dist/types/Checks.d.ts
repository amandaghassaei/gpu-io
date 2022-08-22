import { GPULayerType } from './constants';
/**
 * Checks if type is valid GPULayer data type.
 * Used internally.
 */
export declare function isValidDataType(type: string): boolean;
/**
 * Checks if filter is valid GPULayer filter type.
 * Used internally.
 */
export declare function isValidFilter(type: string): boolean;
/**
 * Checks if wrap is valid GPULayer wrap type.
 * Used internally.
 */
export declare function isValidWrap(type: string): boolean;
export declare function isValidTextureFormat(type: string): boolean;
export declare function isValidTextureType(type: string): boolean;
/**
 * Checks if value is valid GPULayer clear value for numComponents and type.
 * Used internally.
 */
export declare function isValidClearValue(clearValue: number | number[], numComponents: number, type: GPULayerType): boolean;
/**
 * Checks if value is valid number for a given GPULayer type.
 * Checks extrema values.
 * Used internally.
 */
export declare function isNumberOfType(value: any, type: GPULayerType): boolean;
/**
 * Checks if value is finite number.
 * Used internally.
 */
export declare function isNumber(value: any): boolean;
/**
 * Checks if value is finite integer.
 * Used internally.
 */
export declare function isInteger(value: any): boolean;
/**
 * Checks if value is finite positive integer (> 0).
 * Used internally.
 */
export declare function isPositiveInteger(value: any): boolean;
/**
 * Checks if value is finite non-negative integer (>= 0).
 * Used internally.
 */
export declare function isNonNegativeInteger(value: any): boolean;
/**
 * Checks if value is string.
 * Used internally.
 */
export declare function isString(value: any): boolean;
/**
 * Checks if value is array.
 * Used internally.
 */
export declare function isArray(value: any): boolean;
/**
 * Checks if value is JS object {}.
 * Used internally.
 */
export declare function isObject(value: any): boolean;
/**
 * Checks if value is boolean.
 * Used internally.
 */
export declare function isBoolean(value: any): boolean;
