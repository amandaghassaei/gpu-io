import { isWebGL2Supported, isHighpSupportedInVertexShader, isHighpSupportedInFragmentShader, getVertexShaderMediumpPrecision, getFragmentShaderMediumpPrecision, preprocessFragmentShader, preprocessVertexShader, makeShaderHeader, isPowerOf2, initSequentialFloatArray } from './utils';
import { GPUComposer } from './GPUComposer';
import { GPULayer } from './GPULayer';
import { GPUProgram } from './GPUProgram';
declare const _testing: {
    makeShaderHeader: typeof makeShaderHeader;
    preprocessVertexShader: typeof preprocessVertexShader;
    preprocessFragmentShader: typeof preprocessFragmentShader;
    isPowerOf2: typeof isPowerOf2;
    initSequentialFloatArray: typeof initSequentialFloatArray;
};
export * from './Constants';
export { GPUComposer, GPULayer, GPUProgram, isWebGL2Supported, isHighpSupportedInVertexShader, isHighpSupportedInFragmentShader, getVertexShaderMediumpPrecision, getFragmentShaderMediumpPrecision, _testing, };
