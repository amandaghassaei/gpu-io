import { isWebGL2Supported, getFragmentMediumpPrecision, getVertexMediumpPrecision, preprocessFragShader, preprocessVertShader, makeShaderHeader, isPowerOf2, initSequentialFloatArray } from './utils';
import { GPUComposer } from './GPUComposer';
import { GPULayer } from './GPULayer';
import { GPUProgram } from './GPUProgram';
declare const _testing: {
    makeShaderHeader: typeof makeShaderHeader;
    preprocessFragShader: typeof preprocessFragShader;
    preprocessVertShader: typeof preprocessVertShader;
    isPowerOf2: typeof isPowerOf2;
    initSequentialFloatArray: typeof initSequentialFloatArray;
};
export * from './Constants';
export { GPUComposer, GPULayer, GPUProgram, isWebGL2Supported, getFragmentMediumpPrecision, getVertexMediumpPrecision, _testing, };
