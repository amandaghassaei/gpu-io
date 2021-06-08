import { UniformDataType, UniformValueType } from './Constants';
export declare class GPUProgram {
    readonly name: string;
    private readonly gl;
    private readonly errorCallback;
    readonly glProgram?: WebGLProgram;
    private readonly uniforms;
    private readonly shaders;
    constructor(gl: WebGLRenderingContext | WebGL2RenderingContext, params: {
        name: string;
        fragmentShader: string | string[] | WebGLShader;
        vertexShader: string | WebGLShader;
        uniforms?: {
            name: string;
            value: UniformValueType;
            dataType: UniformDataType;
        }[];
        defines?: {
            [key: string]: string;
        };
    }, errorCallback: (message: string) => void);
    private uniformTypeForValue;
    setUniform(uniformName: string, value: UniformValueType, dataType: UniformDataType): void;
    destroy(): void;
}
