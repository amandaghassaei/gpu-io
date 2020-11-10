import { FLOAT_TYPE, INT_TYPE } from './constants';
export declare type UniformDataType = typeof FLOAT_TYPE | typeof INT_TYPE;
export declare type UniformValueType = number | [number] | [number, number] | [number, number, number] | [number, number, number, number];
export declare class GPUProgram {
    private readonly name;
    private readonly gl;
    private readonly errorCallback;
    readonly program?: WebGLProgram;
    private readonly uniforms;
    private readonly shaders;
    constructor(name: string, gl: WebGLRenderingContext | WebGL2RenderingContext, errorCallback: (message: string) => void, vertexShader: WebGLShader, fragmentShaderSource: string, uniforms?: {
        name: string;
        value: UniformValueType;
        dataType: UniformDataType;
    }[]);
    private uniformTypeForValue;
    setUniform(uniformName: string, value: UniformValueType, dataType: UniformDataType): void;
    destroy(): void;
}
