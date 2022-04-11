import { WebGLCompute } from './WebGLCompute';
import { UniformType, UniformValue } from './Constants';
declare type CompileTimeVars = {
    [key: string]: string;
};
export declare class GPUProgram {
    readonly name: string;
    private readonly glcompute;
    private readonly uniforms;
    private fragmentShader;
    private readonly fragmentShaderSource?;
    private defines;
    private programs;
    constructor(glcompute: WebGLCompute, params: {
        name: string;
        fragmentShader: string | string[] | WebGLShader;
        uniforms?: {
            name: string;
            value: UniformValue;
            type: UniformType;
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
    private uniformInternalTypeForValue;
    private setProgramUniform;
    setUniform(name: string, value: UniformValue, type?: UniformType): void;
    setVertexUniform(program: WebGLProgram, uniformName: string, value: UniformValue, type: UniformType): void;
    destroy(): void;
}
export {};
