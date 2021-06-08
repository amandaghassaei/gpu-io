import { UniformDataType, UniformValueType } from './Constants';
export declare class GPUProgram {
    readonly name: string;
    private readonly gl;
    private readonly errorCallback;
    readonly glProgram?: WebGLProgram;
    private readonly uniforms;
    private readonly shaders;
    constructor(params: {
        gl: WebGLRenderingContext | WebGL2RenderingContext;
        name: string;
        fragmentShader: string | string[] | WebGLShader;
        vertexShader: string | WebGLShader;
        errorCallback: (message: string) => void;
        uniforms?: {
            name: string;
            value: UniformValueType;
            dataType: UniformDataType;
        }[];
        defines?: {
            [key: string]: string;
        };
    });
    private uniformTypeForValue;
    setUniform(uniformName: string, value: UniformValueType, dataType: UniformDataType): void;
    destroy(): void;
}
