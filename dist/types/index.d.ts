import { makeShaderHeader, compileShader, initGLProgram, isWebGL2, isWebGL2Supported, isHighpSupportedInVertexShader, isHighpSupportedInFragmentShader, getVertexShaderMediumpPrecision, getFragmentShaderMediumpPrecision, preprocessFragmentShader, preprocessVertexShader, isPowerOf2, initSequentialFloatArray } from './utils';
import { GPUComposer } from './GPUComposer';
import { GPULayer } from './GPULayer';
import { GPUProgram } from './GPUProgram';
declare const _testing: {
    makeShaderHeader: typeof makeShaderHeader;
    compileShader: typeof compileShader;
    initGLProgram: typeof initGLProgram;
    preprocessVertexShader: typeof preprocessVertexShader;
    preprocessFragmentShader: typeof preprocessFragmentShader;
    isPowerOf2: typeof isPowerOf2;
    initSequentialFloatArray: typeof initSequentialFloatArray;
};
export * from './constants';
export { GPUComposer, GPULayer, GPUProgram, isWebGL2, isWebGL2Supported, isHighpSupportedInVertexShader, isHighpSupportedInFragmentShader, getVertexShaderMediumpPrecision, getFragmentShaderMediumpPrecision, _testing, };
