import {
	validDataTypes,
	validFilters,
	validWraps,
	validTextureFormats,
	validTextureTypes,
	DataLayerType,
	HALF_FLOAT,
	FLOAT,
	BYTE,
	SHORT,
	INT,
	UNSIGNED_BYTE,
	UNSIGNED_SHORT,
	UNSIGNED_INT,
} from './Constants';

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

export function isValidClearValue(clearValue: number | number[], numComponents: number, type: DataLayerType) {
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

export function isNumberOfType(value: any, type: DataLayerType) {
	switch (type) {
		case HALF_FLOAT:
		case FLOAT:
			return isNumber(value);
		case BYTE:
		case SHORT:
		case INT:
			return isInteger(value);
		case UNSIGNED_BYTE:
		case UNSIGNED_SHORT:
		case UNSIGNED_INT:
			return isNonNegativeInteger(value);
		default:
			throw new Error(`Unknown type ${type}`);
	}
}

export function isNumber(value: any) {
	return !isNaN(value);
}

export function isInteger(value: any) {
	return isNumber(value) && (value % 1 === 0);
}

export function isPositiveInteger(value: any) {
	return isInteger(value) &&  value > 0;
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

export function isBoolean(value: any) {
	return typeof value === 'boolean';
}