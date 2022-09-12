import {
	validDataTypes,
	validFilters,
	validWraps,
	GPULayerType,
	HALF_FLOAT,
	FLOAT,
	BYTE,
	SHORT,
	INT,
	UNSIGNED_BYTE,
	UNSIGNED_SHORT,
	UNSIGNED_INT,
	validImageFormats,
	validImageTypes,
} from './constants';

/**
 * Checks if type is valid GPULayer data type.
 * @private
 */
export function isValidDataType(type: string) {
	return validDataTypes.indexOf(type) > -1;
}

/**
 * Checks if filter is valid GPULayer filter type.
 * @private
 */
export function isValidFilter(type: string) {
	return validFilters.indexOf(type) > -1;
}

/**
 * Checks if wrap is valid GPULayer wrap type.
 * @private
 */
export function isValidWrap(type: string) {
	return validWraps.indexOf(type) > -1;
}

/**
 * For image urls that are passed in and inited as GPULayers.
 * @private
 */
export function isValidImageFormat(type: string) {
	return validImageFormats.indexOf(type) > -1;
}
/**
 * For image urls that are passed in and inited as GPULayers.
 * @private
 */
export function isValidImageType(type: string) {
	return validImageTypes.indexOf(type) > -1;
}

/**
 * Checks if value is valid GPULayer clear value for numComponents and type.
 * @private
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
 * @private
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
 * @private
 */
export function isNumber(value: any) {
	return !Number.isNaN(value) && typeof value === 'number' && Number.isFinite(value);
}

/**
 * Checks if value is finite integer.
 * @private
 */
export function isInteger(value: any) {
	return isNumber(value) && (value % 1 === 0);
}

/**
 * Checks if value is finite positive integer (> 0).
 * @private
 */
export function isPositiveInteger(value: any) {
	return isInteger(value) && value > 0;
}

/**
 * Checks if value is finite non-negative integer (>= 0).
 * @private
 */
export function isNonNegativeInteger(value: any) {
	return isInteger(value) &&  value >= 0;
}

/**
 * Checks if value is string.
 * @private
 */
export function isString(value: any){
	return typeof value === 'string';
}

/**
 * Checks if value is array.
 * @private
 */
export function isArray(value: any) {
	return Array.isArray(value) || (ArrayBuffer.isView(value) && !(value instanceof DataView));
}

/**
 * Checks if value is Javascript object.
 * @private
 */
export function isObject(value: any) {
	return typeof value === 'object' && !isArray(value) && value !== null;
}

/**
 * Checks if value is boolean.
 * @private
 */
export function isBoolean(value: any) {
	return typeof value === 'boolean';
}