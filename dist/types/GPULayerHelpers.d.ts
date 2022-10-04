import { GPULayerFilter, GPULayerType, GPULayerWrap } from './constants';
import type { GPUComposer } from './GPUComposer';
/**
 * Returns whether to cast int type as floats, as needed by browser.
 * @private
 */
export declare function shouldCastIntTypeAsFloat(composer: GPUComposer, type: GPULayerType): boolean;
/**
 * Rigorous method for testing FLOAT and HALF_FLOAT write support by attaching texture to framebuffer.
 * @private
 */
export declare function testWriteSupport(composer: GPUComposer, internalType: GPULayerType): boolean;
/**
 * Rigorous method for testing whether a filter/wrap combination is supported
 * by the current browser.  I found that some versions of WebGL2 mobile safari
 * may support the OES_texture_float_linear and EXT_color_buffer_float, but still
 * do not linearly interpolate float textures or wrap only for power-of-two textures.
 * @private
 */
export declare function testFilterWrap(composer: GPUComposer, internalType: GPULayerType, filter: GPULayerFilter, wrap: GPULayerWrap): boolean;
/**
 * Min and max values for types.
 * @private
 */
export declare function minMaxValuesForType(type: GPULayerType): {
    min: number;
    max: number;
};
