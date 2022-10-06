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
 * Convert out variables to gl_FragColor.
 * @private
 */
export declare function glsl1FragmentOut(shaderSource: string, name: string): string;
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
