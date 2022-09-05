/**
 * Override texture function to perform repeat wrap.
 * Value of u_gpuio_wrap_repeat:
 * (0) No polyfills.
 * (1) GPUIO_TEXTURE_WRAP -> filtering is NEAREST and wrap needs polyfill.
 * (2) GPUIO_TEXTURE_FILTER -> wrap is supported, but filtering needs polyfill.
 * (3) GPUIO_TEXTURE_WRAP_FILTER -> wrap and filtering need polyfill.
 * (4) GPUIO_TEXTURE_WRAP_FILTER_BOUNDARY -> filtering is LINEAR and supported, but wrap needs polyfill and filter needs polyfill at boundary.
 * https://www.codeproject.com/Articles/236394/Bi-Cubic-and-Bi-Linear-Interpolation-with-GLSL
 * @private
 */
export declare function texturePolyfill(shaderSource: string): string;
