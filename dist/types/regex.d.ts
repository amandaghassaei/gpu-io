import { GLSLVersion } from './constants';
/**
 * Helper functions for converting GLSL3 to GLSL1 and checking for valid shader code.
 */
export declare function glsl1VertexIn(shaderSource: string): string;
export declare function glsl1VertexOut(shaderSource: string): string;
export declare function glsl1FragmentIn(shaderSource: string): string;
export declare function glsl1FragmentOut(shaderSource: string): string;
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
