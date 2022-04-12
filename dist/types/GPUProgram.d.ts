import { WebGLCompute } from './WebGLCompute';
import { UniformType, UniformValue, CompileTimeVars } from './Constants';
export declare class GPUProgram {
    private readonly glcompute;
    readonly name: string;
    private fragmentShader;
    private readonly fragmentShaderSource;
    private defines;
    private readonly uniforms;
    private programs;
    constructor(glcompute: WebGLCompute, params: {
        name: string;
        fragmentShader: string | string[];
        uniforms?: {
            name: string;
            value: UniformValue;
            type: UniformType;
        }[];
        defines?: CompileTimeVars;
    });
    recompile(defines: CompileTimeVars): void;
    private initProgram;
    private getProgramWithName;
    get _defaultProgram(): WebGLProgram | undefined;
    get _defaultProgramWithUV(): WebGLProgram | undefined;
    get _defaultProgramWithNormal(): WebGLProgram | undefined;
    get _defaultProgramWithUVNormal(): WebGLProgram | undefined;
    get _segmentProgram(): WebGLProgram | undefined;
    get _dataLayerPointsProgram(): WebGLProgram | undefined;
    get _dataLayerVectorFieldProgram(): WebGLProgram | undefined;
    get _dataLayerLinesProgram(): WebGLProgram | undefined;
    private uniformInternalTypeForValue;
    private setProgramUniform;
    setUniform(name: string, value: UniformValue, type?: UniformType): void;
    _setVertexUniform(program: WebGLProgram, uniformName: string, value: UniformValue, type: UniformType): void;
    dispose(): void;
}
