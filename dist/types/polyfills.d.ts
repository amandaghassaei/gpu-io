import { GLSLVersion } from './constants';
/**
 * Wrap type to use in polyfill.
 * (0) Default behavior (no polyfill).
 * (1) REPEAT polyfill.
 * @private
 */
export declare const SAMPLER2D_WRAP_X = "GPUIO_WRAP_X";
/**
 * Wrap type to use in polyfill.
 * (0) Default behavior (no polyfill).
 * (1) REPEAT polyfill.
 * @private
 */
export declare const SAMPLER2D_WRAP_Y = "GPUIO_WRAP_Y";
/**
 * Flag to cast texture() result to int type (needed for GLSL1).
 * @private
 */
export declare const SAMPLER2D_CAST_INT = "GPUIO_CAST_INT";
/**
 * Filter type to use in polyfill.
 * (0) Default behavior (no polyfill).
 * (0) LINEAR polyfill.
 * @private
 */
export declare const SAMPLER2D_FILTER = "GPUIO_FILTER";
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
 * Override texture function to perform polyfill filter/wrap.
 * https://www.codeproject.com/Articles/236394/Bi-Cubic-and-Bi-Linear-Interpolation-with-GLSL
 * @private
 */
export declare function texturePolyfill(shaderSource: string): {
    shaderSource: string;
    samplerUniforms: string[];
};
/**
 * Polyfill common functions/operators that GLSL1 lacks.
 * @private
 */
export declare function GLSL1Polyfills(shaderSource: string): string;
/**
 * Polyfills to be make available for both GLSL1 and GLSL3 fragment shaders.
 * @private
 */
export declare function fragmentShaderPolyfills(shaderSource: string, glslVersion: GLSLVersion): string;
