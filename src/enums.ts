import {
	GLSLPrecision,
	PRECISION_HIGH_P,
	PRECISION_LOW_P,
	PRECISION_MEDIUM_P,
} from './constants';

/**
 * Enum for precision values.
 * See src/glsl/common/precision.ts for more info.
 * @private
 */
 export function intForPrecision(precision: GLSLPrecision) {
	if (precision === PRECISION_HIGH_P) return 2;
	if (precision === PRECISION_MEDIUM_P) return 1;
	if (precision === PRECISION_LOW_P) return 0;
	throw new Error(`Unknown shader precision value: ${JSON.stringify(precision)}.`);
}