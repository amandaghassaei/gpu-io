import { GPULayerFilter, GPULayerType, GPULayerWrap, GPULayerNumComponents, GPULayerArray } from './constants';
import { GPUComposer } from './GPUComposer';
import { GPULayer } from './GPULayer';
/**
 * Init empty typed array for type, optionally use Float32Array for HALF_FLOAT.
 * @private
 */
export declare function initArrayForType(type: GPULayerType, length: number, halfFloatsAsFloats?: boolean): Float32Array | Uint16Array | Uint8Array | Int8Array | Int16Array | Uint32Array | Int32Array;
/**
 * Calc 2D size [width, height] for GPU layer given a 1D or 2D size parameter.
 * If 1D size supplied, nearest power of 2 width/height is generated.
 * Also checks that size elements are valid.
 * @private
 */
export declare function calcGPULayerSize(size: number | [number, number], name: string, verboseLogging: boolean): {
    width: number;
    height: number;
    length: number;
} | {
    width: number;
    height: number;
    length?: undefined;
};
/**
 * Get the GL wrap type to use internally in GPULayer, based on browser support.
 * @private
 */
export declare function getGPULayerInternalWrap(params: {
    composer: GPUComposer;
    wrap: GPULayerWrap;
    name: string;
}): GPULayerWrap;
/**
 * Get the GL filter type to use internally in GPULayer, based on browser support.
 * @private
 */
export declare function getGPULayerInternalFilter(params: {
    composer: GPUComposer;
    filter: GPULayerFilter;
    internalType: GPULayerType;
    name: string;
}): GPULayerFilter;
/**
 * Returns whether to cast int type as floats, as needed by browser.
 * @private
 */
export declare function shouldCastIntTypeAsFloat(params: {
    composer: GPUComposer;
    type: GPULayerType;
}): boolean;
/**
 * Returns GLTexture parameters for GPULayer, based on browser support.
 * @private
 */
export declare function getGLTextureParameters(params: {
    composer: GPUComposer;
    name: string;
    numComponents: GPULayerNumComponents;
    internalType: GPULayerType;
    writable: boolean;
}): {
    glFormat: number;
    glInternalFormat: number;
    glType: number;
    glNumChannels: number;
};
/**
 * Rigorous method for testing FLOAT and HALF_FLOAT texture support by attaching texture to framebuffer.
 * @private
 */
export declare function testFramebufferAttachment(params: {
    composer: GPUComposer;
    internalType: GPULayerType;
}): boolean;
/**
 * Get the GL type to use internally in GPULayer, based on browser support.
 * @private
 * Exported here for testing purposes.
 */
export declare function getGPULayerInternalType(params: {
    composer: GPUComposer;
    type: GPULayerType;
    writable: boolean;
    name: string;
}): GPULayerType;
/**
 * Min and max values for types.
 * @private
 */
export declare function minMaxValuesForType(type: GPULayerType): {
    min: number;
    max: number;
};
/**
 * Recasts typed array to match GPULayer.internalType.
 * @private
 */
export declare function validateGPULayerArray(array: GPULayerArray | number[], layer: GPULayer): GPULayerArray;
