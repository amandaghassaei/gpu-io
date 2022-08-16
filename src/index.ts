import {
	isWebGL2Supported,
	isHighpSupportedInVertexShader,
	isHighpSupportedInFragmentShader,
	getVertexShaderMediumpPrecision,
	getFragmentShaderMediumpPrecision,
	preprocessFragmentShader,
	preprocessVertexShader,
	makeShaderHeader,
	isPowerOf2,
	initSequentialFloatArray,
} from './utils';
import { GPUComposer } from './GPUComposer';
import { GPULayer } from './GPULayer';
import { GPUProgram } from './GPUProgram';
import * as Constants from './Constants';

// These exports are only used for testing.
const _testing = {
	makeShaderHeader,
	preprocessVertexShader,
	preprocessFragmentShader,
	isPowerOf2,
	initSequentialFloatArray,
}

const WebGLCompute = {
	...Constants,
	GPUComposer,
	GPULayer,
	GPUProgram,
	isWebGL2Supported,
	isHighpSupportedInVertexShader,
	isHighpSupportedInFragmentShader,
	getVertexShaderMediumpPrecision,
	getFragmentShaderMediumpPrecision,
};

// TODO: there is probably a better way to do this.
// Default export.
export default WebGLCompute;
// Named exports.
export * from './Constants';
export {
	GPUComposer,
	GPULayer,
	GPUProgram,
	isWebGL2Supported,
	isHighpSupportedInVertexShader,
	isHighpSupportedInFragmentShader,
	getVertexShaderMediumpPrecision,
	getFragmentShaderMediumpPrecision,
	_testing,
}