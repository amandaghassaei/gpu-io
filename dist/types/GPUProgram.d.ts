import { GLSLVersion, UniformDataType, UniformValueType } from './Constants';
declare type CompileTimeVars = {
    [key: string]: string;
};
export declare class GPUProgram {
    readonly name: string;
    private readonly gl;
    private readonly errorCallback;
    private readonly glslVersion;
    private readonly uniforms;
    private fragmentShader;
    private readonly fragmentShaderSource?;
    private definesSource?;
    private programs;
    constructor(params: {
        gl: WebGLRenderingContext | WebGL2RenderingContext;
        name: string;
        fragmentShader: string | string[] | WebGLShader;
        errorCallback: (message: string) => void;
        glslVersion: GLSLVersion;
        uniforms?: {
            name: string;
            value: UniformValueType;
            dataType: UniformDataType;
        }[];
        defines?: CompileTimeVars;
    });
    private static convertDefinesToString;
    recompile(defines?: CompileTimeVars): void;
    private initProgram;
    private getProgramWithName;
    get defaultProgram(): WebGLProgram | undefined;
    get defaultProgramWithUV(): WebGLProgram | undefined;
    get defaultProgramWithNormal(): WebGLProgram | undefined;
    get defaultProgramWithUVNormal(): WebGLProgram | undefined;
    get segmentProgram(): WebGLProgram | undefined;
    get dataLayerPointsProgram(): WebGLProgram | undefined;
    get dataLayerVectorFieldProgram(): WebGLProgram | undefined;
    get dataLayerLinesProgram(): WebGLProgram | undefined;
    private uniformTypeForValue;
    private setProgramUniform;
    setUniform(uniformName: string, value: UniformValueType, dataType?: UniformDataType): void;
    setVertexUniform(program: WebGLProgram, uniformName: string, value: UniformValueType, dataType: UniformDataType): void;
    destroy(): void;
}
export {};
