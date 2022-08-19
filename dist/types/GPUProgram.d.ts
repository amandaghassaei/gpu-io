import { GPUComposer } from './GPUComposer';
import { UniformType, UniformValue, CompileTimeVars } from './constants';
export declare class GPUProgram {
    private readonly composer;
    readonly name: string;
    private fragmentShader;
    private readonly fragmentShaderSource;
    private readonly defines;
    private readonly uniforms;
    private readonly programs;
    /**
     * Create a GPUProgram.
     * @param {GPUComposer} composer - The current GPUComposer instance.
     * @param {Object} params - GPUProgram parameters.
     */
    constructor(composer: GPUComposer, params: {
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
    private getProgramWithName;
    get _defaultProgram(): WebGLProgram | undefined;
    get _defaultProgramWithUV(): WebGLProgram | undefined;
    get _defaultProgramWithNormal(): WebGLProgram | undefined;
    get _defaultProgramWithUVNormal(): WebGLProgram | undefined;
    get _segmentProgram(): WebGLProgram | undefined;
    get _GPULayerPointsProgram(): WebGLProgram | undefined;
    get _GPULayerVectorFieldProgram(): WebGLProgram | undefined;
    get _GPULayerLinesProgram(): WebGLProgram | undefined;
    private setProgramUniform;
    setUniform(name: string, value: UniformValue, type?: UniformType): void;
    _setVertexUniform(program: WebGLProgram, uniformName: string, value: UniformValue, type: UniformType): void;
    dispose(): void;
}
