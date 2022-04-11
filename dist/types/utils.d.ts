export declare function compileShader(gl: WebGLRenderingContext | WebGL2RenderingContext, errorCallback: (message: string) => void, shaderSource: string, shaderType: number, programName?: string): WebGLShader | null;
export declare function isWebGL2(gl: WebGLRenderingContext | WebGL2RenderingContext): boolean;
export declare function isWebGL2Supported(): boolean;
export declare function isPowerOf2(value: number): boolean;
export declare function initSequentialFloatArray(length: number): Float32Array;
export declare function inDevMode(): boolean;
