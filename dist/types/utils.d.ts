import { CompileTimeVars, ErrorCallback, GLSLPrecision, GLSLVersion, GPULayerType, UniformType, UniformValue } from './constants';
/**
 * Test whether a GPULayer type is a float type.
 * @private
 */
export declare function isFloatType(type: GPULayerType): boolean;
/**
 * Test whether a GPULayer type is an unsigned int type.
 * @private
 */
export declare function isUnsignedIntType(type: GPULayerType): boolean;
/**
 * Test whether a GPULayer type is a signed int type.
 * @private
 */
export declare function isSignedIntType(type: GPULayerType): boolean;
/**
 * Test whether a GPULayer type is a int type.
 * @private
 */
export declare function isIntType(type: GPULayerType): boolean;
/**
 * Create header string for fragment and vertex shaders.
 * Export this for testing purposes.
 * @private
 */
export declare function makeShaderHeader(glslVersion: GLSLVersion, intPrecision: GLSLPrecision, floatPrecision: GLSLPrecision, defines?: CompileTimeVars): string;
/**
 * Compile vertex or fragment shaders.
 * Fragment shaders may be compiled on the fly, so keep this efficient.
 * Copied from http://webglfundamentals.org/webgl/lessons/webgl-boilerplate.html
 * @private
 */
export declare function compileShader(gl: WebGLRenderingContext | WebGL2RenderingContext, glslVersion: GLSLVersion, intPrecision: GLSLPrecision, floatPrecision: GLSLPrecision, shaderSource: string, shaderType: number, programName: string, errorCallback: ErrorCallback, defines?: CompileTimeVars): WebGLShader | null;
/**
 * Init a WebGL program from vertex and fragment shaders.
 * GLPrograms may be inited on the fly, so keep this efficient.
 * @private
 */
export declare function initGLProgram(gl: WebGLRenderingContext | WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader, name: string, errorCallback: ErrorCallback): WebGLProgram | undefined;
/**
 * Returns whether a WebGL context is WebGL2.
 * This code is pulled from https://github.com/mrdoob/three.js/blob/master/src/renderers/webgl/WebGLCapabilities.js
 * @param gl - WebGL context to test.
 * @returns - true if WebGL2 context, else false.
 */
export declare function isWebGL2(gl: WebGLRenderingContext | WebGL2RenderingContext): boolean;
/**
 * Returns whether WebGL2 is supported by the current browser.
 * @returns - true if WebGL2 is supported, else false.
*/
export declare function isWebGL2Supported(): boolean;
/**
 * Checks if the framebuffer is ready to read.
 * @private
 */
export declare function readyToRead(gl: WebGLRenderingContext | WebGL2RenderingContext): boolean;
/**
 * Detects whether highp precision is supported in vertex shaders in the current browser.
 * @returns - true is highp is supported in vertex shaders, else false.
 */
export declare function isHighpSupportedInVertexShader(): boolean;
/**
 * Detects whether highp precision is supported in fragment shaders in the current browser.
 * @returns - true is highp is supported in fragment shaders, else false.
 */
export declare function isHighpSupportedInFragmentShader(): boolean;
/**
 * Returns the actual precision of mediump inside vertex shader.
 * From https://webglfundamentals.org/webgl/lessons/webgl-precision-issues.html
 * @returns - Vertex shader mediump precision.
 */
export declare function getVertexShaderMediumpPrecision(): "mediump" | "highp";
/**
 * Returns the actual precision of mediump inside fragment shader.
 * From https://webglfundamentals.org/webgl/lessons/webgl-precision-issues.html
 * @returns - Fragment shader supported mediump precision.
 */
export declare function getFragmentShaderMediumpPrecision(): "mediump" | "highp";
/**
 * Returns whether a number is a power of 2.
 * @private
 */
export declare function isPowerOf2(value: number): boolean;
/**
 * Returns a Float32 array with sequential values [0, 1, 2, 3...].
 * @private
 */
export declare function initSequentialFloatArray(length: number): Float32Array;
/**
 * Preprocess vertex shader for glslVersion and browser capabilities.
 * This is called once on initialization, so doesn't need to be extremely efficient.
 * @private
 */
export declare function preprocessVertexShader(shaderSource: string, glslVersion: GLSLVersion): string;
/**
 * Preprocess fragment shader for glslVersion and browser capabilities.
 * This is called once on initialization of GPUProgram, so doesn't need to be extremely efficient.
 * @private
 */
export declare function preprocessFragmentShader(shaderSource: string, glslVersion: GLSLVersion, name: string): {
    shaderSource: string;
    samplerUniforms: string[];
};
/**
 * Check uniforms and return internal WebGL type (e.g. [1234][u]?[if])
 * @private
 */
export declare function uniformInternalTypeForValue(value: UniformValue, type: UniformType, uniformName: string, programName: string): "FLOAT_1D_UNIFORM" | "FLOAT_2D_UNIFORM" | "FLOAT_3D_UNIFORM" | "FLOAT_4D_UNIFORM" | "INT_1D_UNIFORM" | "INT_2D_UNIFORM" | "INT_3D_UNIFORM" | "INT_4D_UNIFORM" | "UINT_1D_UNIFORM" | "UINT_2D_UNIFORM" | "UINT_3D_UNIFORM" | "UINT_4D_UNIFORM" | "BOOL_1D_UNIFORM" | "BOOL_2D_UNIFORM" | "BOOL_3D_UNIFORM" | "BOOL_4D_UNIFORM";
