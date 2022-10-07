import { GLSLVersion } from './constants';
/**
 * Helper functions for converting GLSL3 to GLSL1 and checking for valid shader code.
 * Note: there is no positive lookbehind support in some browsers, use capturing parens instead.
 * https://stackoverflow.com/questions/3569104/positive-look-behind-in-javascript-regular-expression/3569116#3569116
 */
declare type GLSLType = 'float' | 'int' | 'uint' | 'vec2' | 'vec3' | 'vec4' | 'ivec2' | 'ivec3' | 'ivec4' | 'uvec2' | 'uvec3' | 'uvec4';
/**
 * Convert vertex shader "in" to "attribute".
 * @private
 */
export declare function glsl1VertexIn(shaderSource: string): string;
/**
 * Convert int varyings to float types.
 * Only exported for testing.
 * @private
 */
export declare function castVaryingToFloat(shaderSource: string): string;
/**
 * Convert vertex shader "out" to "varying".
 * Also remove "flat" if necessary.
 * Also cast as float if necessary.
 * @private
 */
export declare function glsl1VertexOut(shaderSource: string): string;
/**
 * Convert fragment shader "in" to "varying".
 * Also remove "flat" if necessary.
 * Also cast as float if necessary.
 * @private
 */
export declare function glsl1FragmentIn(shaderSource: string): string;
/**
 * Get variable name, type, and layout number for out variables.
 * Only exported for testing.
 * @private
 */
export declare function getFragmentOuts(shaderSource: string, programName: string): {
    name: string;
    type: GLSLType;
}[];
/**
 * Convert out variables to gl_FragColor.
 * @private
 */
export declare function glsl1FragmentOut(shaderSource: string, programName: string): string[];
/**
 * Check for presence of gl_FragColor in fragment shader source.
 * @private
 */
export declare function checkFragmentShaderForFragColor(shaderSource: string, glslVersion: GLSLVersion, name: string): void;
/**
 * Convert texture to texture2D.
 * @private
 */
export declare function glsl1Texture(shaderSource: string): string;
/**
 * Convert isampler2D and usampler2D to sampler2D.
 * @private
 */
export declare function glsl1Sampler2D(shaderSource: string): string;
/**
 * Unsigned int types are not supported, use int types instead.
 * @private
 */
export declare function glsl1Uint(shaderSource: string): string;
/**
 * Replace all highp with mediump.
 * @private
 */
export declare function highpToMediump(shaderSource: string): string;
/**
 * Strip out any version numbers.
 * https://github.com/Jam3/glsl-version-regex
 * @private
 */
export declare function stripVersion(shaderSource: string): string;
/**
 * Strip out any precision declarations.
 * @private
 */
export declare function stripPrecision(shaderSource: string): string;
/**
 * Strip out comments from shader code.
 * @private
 */
export declare function stripComments(shaderSource: string): string;
/**
 * Get the number of sampler2D's in a fragment shader program.
 * @private
 */
export declare function getSampler2DsInProgram(shaderSource: string): string[];
export {};
