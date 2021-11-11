import {
	HALF_FLOAT, FLOAT, UNSIGNED_BYTE, BYTE, UNSIGNED_SHORT, SHORT, UNSIGNED_INT, INT,
	LINEAR, NEAREST,
	REPEAT, CLAMP_TO_EDGE, RGB, RGBA,
} from './Constants';

export const validDataTypes = [HALF_FLOAT, FLOAT, UNSIGNED_BYTE, BYTE, UNSIGNED_SHORT, SHORT, UNSIGNED_INT, INT];
export function isValidDataType(type: string) {
	return validDataTypes.indexOf(type) > -1;
}

export const validFilterTypes = [LINEAR, NEAREST];
export function isValidFilterType(type: string) {
	return validFilterTypes.indexOf(type) > -1;
}

export const validWrapTypes = [CLAMP_TO_EDGE, REPEAT]; // MIRRORED_REPEAT
export function isValidWrapType(type: string) {
	return validWrapTypes.indexOf(type) > -1;
}

export const validTextureFormatTypes = [RGB, RGBA];
export function isValidTextureFormatType(type: string) {
	return validTextureFormatTypes.indexOf(type) > -1;
}

export const validTextureDataTypes = [UNSIGNED_BYTE];
export function isValidTextureDataType(type: string) {
	return validTextureDataTypes.indexOf(type) > -1;
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