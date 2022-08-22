import { makeShaderHeader, compileShader, initGLProgram, isWebGL2, isWebGL2Supported, readyToRead, isHighpSupportedInVertexShader, isHighpSupportedInFragmentShader, getVertexShaderMediumpPrecision, getFragmentShaderMediumpPrecision, preprocessFragmentShader, preprocessVertexShader, isPowerOf2, initSequentialFloatArray, uniformInternalTypeForValue } from './utils';
import { GPUComposer } from './GPUComposer';
import { GPULayer } from './GPULayer';
import { GPUProgram } from './GPUProgram';
declare const _testing: {
    initArrayForType(type: import("./constants").GPULayerType, length: number, halfFloatsAsFloats?: boolean): Float32Array | Uint16Array | Uint8Array | Int8Array | Int16Array | Uint32Array | Int32Array;
    calcGPULayerSize(size: number | [number, number], name: string, verboseLogging: boolean): {
        width: number;
        height: number;
        length: number;
    } | {
        width: number;
        height: number;
        length?: undefined;
    };
    getGPULayerInternalWrap(params: {
        composer: GPUComposer;
        wrap: import("./constants").GPULayerWrap;
        name: string;
    }): import("./constants").GPULayerWrap;
    getGPULayerInternalFilter(params: {
        composer: GPUComposer;
        filter: import("./constants").GPULayerFilter;
        internalType: import("./constants").GPULayerType;
        name: string;
    }): import("./constants").GPULayerFilter;
    shouldCastIntTypeAsFloat(params: {
        composer: GPUComposer;
        type: import("./constants").GPULayerType;
    }): boolean;
    getGLTextureParameters(params: {
        composer: GPUComposer;
        name: string;
        numComponents: import("./constants").GPULayerNumComponents;
        internalType: import("./constants").GPULayerType;
        writable: boolean;
    }): {
        glFormat: number;
        glInternalFormat: number;
        glType: number;
        glNumChannels: number;
    };
    testFramebufferWrite(params: {
        composer: GPUComposer;
        internalType: import("./constants").GPULayerType;
    }): boolean;
    getGPULayerInternalType(params: {
        composer: GPUComposer;
        type: import("./constants").GPULayerType;
        writable: boolean;
        name: string;
    }): import("./constants").GPULayerType;
    isValidDataType(type: string): boolean;
    isValidFilter(type: string): boolean;
    isValidWrap(type: string): boolean;
    isValidTextureFormat(type: string): boolean;
    isValidTextureType(type: string): boolean;
    isValidClearValue(clearValue: number | number[], numComponents: number, type: import("./constants").GPULayerType): boolean;
    isNumberOfType(value: any, type: import("./constants").GPULayerType): boolean;
    isNumber(value: any): boolean;
    isInteger(value: any): boolean;
    isPositiveInteger(value: any): boolean;
    isNonNegativeInteger(value: any): boolean;
    isString(value: any): boolean;
    isArray(value: any): boolean;
    isObject(value: any): boolean;
    isBoolean(value: any): boolean;
    makeShaderHeader: typeof makeShaderHeader;
    compileShader: typeof compileShader;
    initGLProgram: typeof initGLProgram;
    readyToRead: typeof readyToRead;
    preprocessVertexShader: typeof preprocessVertexShader;
    preprocessFragmentShader: typeof preprocessFragmentShader;
    isPowerOf2: typeof isPowerOf2;
    initSequentialFloatArray: typeof initSequentialFloatArray;
    uniformInternalTypeForValue: typeof uniformInternalTypeForValue;
};
export * from './constants';
export { GPUComposer, GPULayer, GPUProgram, isWebGL2, isWebGL2Supported, isHighpSupportedInVertexShader, isHighpSupportedInFragmentShader, getVertexShaderMediumpPrecision, getFragmentShaderMediumpPrecision, _testing, };
