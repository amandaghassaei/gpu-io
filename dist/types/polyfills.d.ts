/**
 * Wrap/filter type to use in polyfill.
 * (0) No polyfills.
 * (1) Filtering is NEAREST and wrap needs polyfill.
 * (2) Wrap is supported, but filtering needs polyfill.
 * (3) Wrap and filtering need polyfill.
 * (4) Filtering is LINEAR and supported, but wrap needs polyfill and filter needs polyfill at boundary.
 */
export declare const SAMPLER2D_WRAP_REPEAT_UNIFORM = "u_gpuio_wrap_repeat";
/**
 * Wrap type to use in polyfill.
 * (0) CLAMP_TO_EDGE filtering.
 * (1) REPEAT filtering.
 * @private
 */
export declare const SAMPLER2D_WRAP_X = "gpuio_wrap_x";
/**
 * Wrap type to use in polyfill.
 * (0) CLAMP_TO_EDGE filtering.
 * (1) REPEAT filtering.
 * @private
 */
export declare const SAMPLER2D_WRAP_Y = "gpuio_wrap_y";
/**
 * Filter type to use in polyfill.
 * For now we are not using this, but will be needed if more filters added later.
 * NEAREST is always supported, so we don't need to polyfill.
 * (0) LINEAR filtering.
 * @private
 */
export declare const SAMPLER2D_FILTER = "gpuio_filter";
/**
 * UV size of half a pixel for this texture.
 * @private
 */
export declare const SAMPLER2D_HALF_PX_UNIFORM = "u_gpuio_half_px";
/**
 * Dimensions of texture
 * @private
 */
export declare const SAMPLER2D_DIMENSIONS_UNIFORM = "u_gpuio_dimensions";
/**
 * Override texture function to perform repeat wrap.
 * Value of SAMPLER2D_WRAP_REPEAT_UNIFORM:
 * (0) No polyfills.
 * (1) GPUIO_TEXTURE_WRAP -> filtering is NEAREST and wrap needs polyfill.
 * (2) GPUIO_TEXTURE_FILTER -> wrap is supported, but filtering needs polyfill.
 * (3) GPUIO_TEXTURE_WRAP_FILTER -> wrap and filtering need polyfill.
 * https://www.codeproject.com/Articles/236394/Bi-Cubic-and-Bi-Linear-Interpolation-with-GLSL
 * @private
 */
export declare function texturePolyfill(shaderSource: string): string;
