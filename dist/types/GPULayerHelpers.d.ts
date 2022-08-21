import { GPULayerFilter, GPULayerType, GPULayerWrap, ErrorCallback, GLSLVersion, GPULayerNumComponents } from './constants';
export declare function initArrayForType(type: GPULayerType, length: number, halfFloatsAsFloats?: boolean): import("./constants").GPULayerArray;
export declare function calcGPULayerSize(size: number | [number, number], name: string, verboseLogging: boolean): {
    width: number;
    height: number;
    length: number | undefined;
};
export declare function getGPULayerInternalWrap(params: {
    gl: WebGLRenderingContext | WebGL2RenderingContext;
    wrap: GPULayerWrap;
    name: string;
}): GPULayerWrap;
export declare function getGPULayerInternalFilter(params: {
    gl: WebGLRenderingContext | WebGL2RenderingContext;
    filter: GPULayerFilter;
    internalType: GPULayerType;
    name: string;
    errorCallback: ErrorCallback;
}): GPULayerFilter;
export declare function getGLTextureParameters(params: {
    gl: WebGLRenderingContext | WebGL2RenderingContext;
    name: string;
    numComponents: GPULayerNumComponents;
    internalType: GPULayerType;
    writable: boolean;
    glslVersion: GLSLVersion;
    errorCallback: ErrorCallback;
}): {
    glFormat: number;
    glInternalFormat: number;
    glType: number;
    glNumChannels: number;
};
export declare function getGPULayerInternalType(params: {
    gl: WebGLRenderingContext | WebGL2RenderingContext;
    type: GPULayerType;
    glslVersion: GLSLVersion;
    writable: boolean;
    name: string;
    errorCallback: ErrorCallback;
}): GPULayerType;
