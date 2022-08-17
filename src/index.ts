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
} from './utils';
import { GPUComposer } from './GPUComposer';
import { GPULayer } from './GPULayer';
import { GPUProgram } from './GPUProgram';
import * as Constants from './constants';

// These exports are only used for testing.
const _testing = {
	makeShaderHeader,
	compileShader,
	initGLProgram,
	preprocessVertexShader,
	preprocessFragmentShader,
	isPowerOf2,
	initSequentialFloatArray,
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