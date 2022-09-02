import { GLSLVersion } from './constants';
/**
 * Typecast variable assignment.
 * This is used in cases when e.g. varyings have to be converted to float in GLSL1.
 * @private
 */
export declare function typecastVariable(shaderSource: string, variableName: string, type: string): string;
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
 * Get type (int, float, vec3, etc) of fragment out.
 * Only exported for testing.
 * @private
 */
export declare function getFragmentOutType(shaderSource: string, name: string): "float" | "int" | "vec2" | "vec3" | "vec4" | "ivec2" | "ivec3" | "ivec4" | "uvec2" | "uvec3" | "uvec4";
/**
 * Convert out_fragColor to gl_FragColor.
 * @private
 */
export declare function glsl1FragmentOut(shaderSource: string, name: string): string;
/**
 * Check that out_fragColor or gl_FragColor is present in fragment shader source.
 * @private
 */
export declare function checkFragmentShaderForFragColor(shaderSource: string, glslVersion: GLSLVersion, name: string): boolean;
export declare function glsl1Texture(shaderSource: string): string;
export declare function glsl1Sampler2D(shaderSource: string): string;
export declare function glsl1Uint(shaderSource: string): string;
export declare function highpToMediump(shaderSource: string): string;
export declare function stripVersion(shaderSource: string): string;
export declare function stripPrecision(shaderSource: string): string;
export declare function stripComments(shaderSource: string): string;
