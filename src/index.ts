import {
	makeShaderHeader,
	compileShader,
	initGLProgram,
	isWebGL2,
	isWebGL2Supported,
	isHighpSupportedInVertexShader,
	isHighpSupportedInFragmentShader,
	getVertexShaderMediumpPrecision,
	getFragmentShaderMediumpPrecision,
	preprocessFragmentShader,
	preprocessVertexShader,
	isPowerOf2,
	initSequentialFloatArray,
	uniformInternalTypeForValue,
} from './utils';
import { GPUComposer } from './GPUComposer';
import { GPULayer } from './GPULayer';
import { GPUProgram } from './GPUProgram';
import * as checks from './checks';

// These exports are only used for testing.
const _testing = {
	makeShaderHeader,
	compileShader,
	initGLProgram,
	preprocessVertexShader,
	preprocessFragmentShader,
	isPowerOf2,
	initSequentialFloatArray,
	uniformInternalTypeForValue,
	...checks,
}

// Named exports.
export * from './constants';
export {
	GPUComposer,
	GPULayer,
	GPUProgram,
	isWebGL2,
	isWebGL2Supported,
	isHighpSupportedInVertexShader,
	isHighpSupportedInFragmentShader,
	getVertexShaderMediumpPrecision,
	getFragmentShaderMediumpPrecision,
	_testing,
}