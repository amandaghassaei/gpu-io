import * as utils from './utils';
import { GPUComposer } from './GPUComposer';
import { GPULayer } from './GPULayer';
import { GPUProgram } from './GPUProgram';
import * as checks from './checks';
import * as GPULayerHelpers from './GPULayerHelpers';
import * as regex from './regex';

// These exports are only used for testing.
/**
 * @private
 */
const _testing = {
	isFloatType: utils.isFloatType,
	isUnsignedIntType: utils.isUnsignedIntType,
	isSignedIntType: utils.isSignedIntType,
	isIntType: utils.isIntType,
	makeShaderHeader: utils.makeShaderHeader,
	compileShader: utils.compileShader,
	initGLProgram: utils.initGLProgram,
	readyToRead: utils.readyToRead,
	preprocessVertexShader: utils.preprocessVertexShader,
	preprocessFragmentShader: utils.preprocessFragmentShader,
	isPowerOf2: utils.isPowerOf2,
	initSequentialFloatArray: utils.initSequentialFloatArray,
	uniformInternalTypeForValue: utils.uniformInternalTypeForValue,
	...regex,
	...checks,
	...GPULayerHelpers,
}

// Named exports.
export * from './constants';
const {
	isWebGL2,
	isWebGL2Supported,
	isHighpSupportedInVertexShader,
	isHighpSupportedInFragmentShader,
	getVertexShaderMediumpPrecision,
	getFragmentShaderMediumpPrecision,
} = utils;
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