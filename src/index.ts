import {
	isWebGL2Supported,
	isHighpSupportedInVertexShader,
	isHighpSupportedInFragmentShader,
	getVertexShaderMediumpPrecision,
	getFragmentShaderMediumpPrecision,
	preprocessFragShader,
	preprocessVertShader,
	makeShaderHeader,
	isPowerOf2,
	initSequentialFloatArray,
} from './utils';
import { GPUComposer } from './GPUComposer';
import { GPULayer } from './GPULayer';
import { GPUProgram } from './GPUProgram';

const _testing = {
	makeShaderHeader,
	preprocessFragShader,
	preprocessVertShader,
	isPowerOf2,
	initSequentialFloatArray,
}

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
};