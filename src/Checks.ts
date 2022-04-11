import {
	HALF_FLOAT, FLOAT, UNSIGNED_BYTE, BYTE, UNSIGNED_SHORT, SHORT, UNSIGNED_INT, INT,
	LINEAR, NEAREST,
	REPEAT, CLAMP_TO_EDGE, RGB, RGBA,
} from './Constants';

export const validArrayTypes = [Float32Array, Uint8Array, Int8Array, Uint16Array, Int16Array, Uint32Array, Int32Array, Array];

export const validDataTypes = [HALF_FLOAT, FLOAT, UNSIGNED_BYTE, BYTE, UNSIGNED_SHORT, SHORT, UNSIGNED_INT, INT];
export function isValidDataType(type: string) {
	return validDataTypes.indexOf(type) > -1;
}

export const validFilters = [LINEAR, NEAREST];
export function isValidFilter(type: string) {
	return validFilters.indexOf(type) > -1;
}

export const validWraps = [CLAMP_TO_EDGE, REPEAT]; // MIRRORED_REPEAT
export function isValidWrap(type: string) {
	return validWraps.indexOf(type) > -1;
}

// For image urls that are passed in and inited as textures.
export const validTextureFormats = [RGB, RGBA];
export function isValidTextureFormat(type: string) {
	return validTextureFormats.indexOf(type) > -1;
}
// For image urls that are passed in and inited as textures.
export const validTextureTypes = [UNSIGNED_BYTE];
export function isValidTextureType(type: string) {
	return validTextureTypes.indexOf(type) > -1;
}

export function isValidClearValue(clearValue: number | number[], numComponents: number) {
	if (isArray(clearValue)) {
		// Length of clearValue must match numComponents.
		if ((clearValue as number[]).length !== numComponents) {
			return false;
		}
		for (let i = 0; i < (clearValue as number[]).length; i++) {
			if (!isNumber((clearValue as number[])[i])) {
				return false;
			}
		}
	} else {
		if (!isNumber(clearValue)) {
			return false;
		}
	}
	return true;
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

export function isString(value: any){
	return typeof value === 'string';
}

export function isArray(value: any) {
	return Array.isArray(value);
}

export function isBoolean(value: any) {
	return typeof value === 'boolean';
}