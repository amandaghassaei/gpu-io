import { CompileTimeVars } from './Constants';
import { WebGLCompute } from './WebGLCompute';
export declare function compileShader(glcompute: WebGLCompute, shaderSource: string, shaderType: number, programName: string, defines?: CompileTimeVars): WebGLShader | null;
export declare function insertDefinesAfterVersionDeclaration(glcompute: WebGLCompute, shaderSource: string, defines: CompileTimeVars): string;
export declare function isWebGL2(gl: WebGLRenderingContext | WebGL2RenderingContext): boolean;
export declare function isWebGL2Supported(): boolean;
export declare function isPowerOf2(value: number): boolean;
export declare function initSequentialFloatArray(length: number): Float32Array;
export declare function inDevMode(): boolean;
