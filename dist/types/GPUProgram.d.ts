import { WebGLCompute } from './WebGLCompute';
import { UniformType, UniformValue, CompileTimeVars } from './Constants';
export declare class GPUProgram {
    private readonly glcompute;
    readonly name: string;
    private fragmentShader;
    private readonly fragmentShaderSource?;
    private defines;
    private readonly uniforms;
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
    private static uniformInternalTypeForValue;
    private setProgramUniform;
    setUniform(name: string, value: UniformValue, type?: UniformType): void;
    _setVertexUniform(program: WebGLProgram, uniformName: string, value: UniformValue, type: UniformType): void;
    dispose(): void;
}
