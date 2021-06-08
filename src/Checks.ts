import {
	HALF_FLOAT, FLOAT, UNSIGNED_BYTE, BYTE, UNSIGNED_SHORT, SHORT, UNSIGNED_INT, INT,
	LINEAR, NEAREST,
	REPEAT, CLAMP_TO_EDGE, MIRRORED_REPEAT, INT_1D_UNIFORM,
} from './Constants';

export function isValidDataType(type: string) {
	return (
		type === HALF_FLOAT ||
		type === FLOAT ||
		type === UNSIGNED_BYTE ||
		type === BYTE ||
		type === UNSIGNED_SHORT ||
		type === SHORT ||
		type === UNSIGNED_INT ||
		type === INT
	);
}

export function isValidFilterType(type: string) {
	return (
		type === LINEAR ||
		type === NEAREST
	);
}

export function isValidWrapType(type: string) {
	return (
		type === REPEAT ||
		type === CLAMP_TO_EDGE ||
		type === MIRRORED_REPEAT
	);
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