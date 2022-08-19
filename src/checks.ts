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

export function isValidDataType(type: string) {
	return validDataTypes.indexOf(type) > -1;
}

export function isValidFilter(type: string) {
	return validFilters.indexOf(type) > -1;
}

export function isValidWrap(type: string) {
	return validWraps.indexOf(type) > -1;
}

// For image urls that are passed in and inited as textures.
export function isValidTextureFormat(type: string) {
	return validTextureFormats.indexOf(type) > -1;
}
export function isValidTextureType(type: string) {
	return validTextureTypes.indexOf(type) > -1;
}

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

export function isNumber(value: any) {
	return !Number.isNaN(value) && typeof value === 'number' && Number.isFinite(value);
}

export function isInteger(value: any) {
	return isNumber(value) && (value % 1 === 0);
}

export function isPositiveInteger(value: any) {
	return isInteger(value) && value > 0;
}

export function isNonNegativeInteger(value: any) {
	return isInteger(value) &&  value >= 0;
}

export function isString(value: any){
	return typeof value === 'string';
}

export function isArray(value: any) {
	return Array.isArray(value);
}

export function isObject(value: any) {
	return typeof value === 'object' && !isArray(value) && value !== null;
}

export function isBoolean(value: any) {
	return typeof value === 'boolean';
}