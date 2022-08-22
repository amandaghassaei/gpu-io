import {
	validDataTypes,
	validFilters,
	validWraps,
	validTextureFormats,
	validTextureTypes,
	GPULayerType,
	HALF_FLOAT,
	FLOAT,
	BYTE,
	SHORT,
	INT,
	UNSIGNED_BYTE,
	UNSIGNED_SHORT,
	UNSIGNED_INT,
} from './constants';

/**
 * Checks if type is valid GPULayer data type.
 * Used internally.
 */
export function isValidDataType(type: string) {
	return validDataTypes.indexOf(type) > -1;
}

/**
 * Checks if filter is valid GPULayer filter type.
 * Used internally.
 */
export function isValidFilter(type: string) {
	return validFilters.indexOf(type) > -1;
}

/**
 * Checks if wrap is valid GPULayer wrap type.
 * Used internally.
 */
export function isValidWrap(type: string) {
	return validWraps.indexOf(type) > -1;
}

// For image urls that are passed in and inited as textures.
// TODO: add docs
export function isValidTextureFormat(type: string) {
	return validTextureFormats.indexOf(type) > -1;
}
// TODO: add docs
export function isValidTextureType(type: string) {
	return validTextureTypes.indexOf(type) > -1;
}

/**
 * Checks if value is valid GPULayer clear value for numComponents and type.
 * Used internally.
 */
export function isValidClearValue(clearValue: number | number[], numComponents: number, type: GPULayerType) {
	if (isArray(clearValue)) {
		// Length of clearValue must match numComponents.
		if ((clearValue as number[]).length !== numComponents) {
			return false;
		}
		for (let i = 0; i < (clearValue as number[]).length; i++) {
			if (!isNumberOfType((clearValue as number[])[i], type)) {
				return false;
			}
		}
	} else {
		if (!isNumberOfType(clearValue, type)) {
			return false;
		}
	}
	return true;
}

/**
 * Checks if value is valid number for a given GPULayer type.
 * Checks extrema values.
 * Used internally.
 */
export function isNumberOfType(value: any, type: GPULayerType) {
	switch (type) {
		case HALF_FLOAT:
		case FLOAT:
			return isNumber(value);
		case BYTE:
			// -(2 ** 7)
			if (value < -128) return false;
			// 2 ** 7 - 1
			if (value > 127) return false;
			return isInteger(value);
		case SHORT:
			// -(2 ** 15)
			if (value < -32768) return false;
			// 2 ** 15 - 1
			if (value > 32767) return false;
			return isInteger(value);
		case INT:
			// -(2 ** 31)
			if (value < -2147483648) return false;
			// 2 ** 31 - 1
			if (value > 2147483647) return false;
			return isInteger(value);
		case UNSIGNED_BYTE:
			// 2 ** 8 - 1
			if (value > 255) return false;
			return isNonNegativeInteger(value);
		case UNSIGNED_SHORT:
			// 2 ** 16 - 1
			if (value > 65535) return false;
			return isNonNegativeInteger(value);
		case UNSIGNED_INT:
			// 2 ** 32 - 1
			if (value > 4294967295) return false;
			return isNonNegativeInteger(value);
		default:
			throw new Error(`Unknown type ${type}`);
	}
}

/**
 * Checks if value is finite number.
 * Used internally.
 */
export function isNumber(value: any) {
	return !Number.isNaN(value) && typeof value === 'number' && Number.isFinite(value);
}

/**
 * Checks if value is finite integer.
 * Used internally.
 */
export function isInteger(value: any) {
	return isNumber(value) && (value % 1 === 0);
}

/**
 * Checks if value is finite positive integer (> 0).
 * Used internally.
 */
export function isPositiveInteger(value: any) {
	return isInteger(value) && value > 0;
}

/**
 * Checks if value is finite non-negative integer (>= 0).
 * Used internally.
 */
export function isNonNegativeInteger(value: any) {
	return isInteger(value) &&  value >= 0;
}

/**
 * Checks if value is string.
 * Used internally.
 */
export function isString(value: any){
	return typeof value === 'string';
}

/**
 * Checks if value is array.
 * Used internally.
 */
export function isArray(value: any) {
	return Array.isArray(value);
}

/**
 * Checks if value is JS object {}.
 * Used internally.
 */
export function isObject(value: any) {
	return typeof value === 'object' && !isArray(value) && value !== null;
}

/**
 * Checks if value is boolean.
 * Used internally.
 */
export function isBoolean(value: any) {
	return typeof value === 'boolean';
}