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
    /**
     * Compile fragment shader for GPUProgram.
     * Used internally, called only one.
     */
    private compile;
    /**
     * Get GLProgram associated with a specific vertex shader.
     * Used internally.
     */
    private getProgramWithName;
    get _defaultProgram(): WebGLProgram | undefined;
    get _defaultProgramWithUV(): WebGLProgram | undefined;
    get _defaultProgramWithNormal(): WebGLProgram | undefined;
    get _defaultProgramWithUVNormal(): WebGLProgram | undefined;
    get _segmentProgram(): WebGLProgram | undefined;
    get _layerPointsProgram(): WebGLProgram | undefined;
    get _layerVectorFieldProgram(): WebGLProgram | undefined;
    get _layerLinesProgram(): WebGLProgram | undefined;
    /**
     * Set uniform for GLProgram.
     * Used internally.
     */
    private setProgramUniform;
    /**
     * Set fragment shader uniform for GPUProgram.
     * @param name - Uniform name as string.
     * @param value - Uniform value as boolean, number, or number[].
     * @param type - (optional) Uniform type: INT, UINT, FLOAT, BOOL.
     * @returns
     */
    setUniform(name: string, value: UniformValue, type?: UniformType): void;
    /**
     * Set vertex shader uniform for GPUProgram.
     * Used internally.
     */
    _setVertexUniform(program: WebGLProgram, uniformName: string, value: UniformValue, type: UniformType): void;
    /**
     * Deallocate GPUProgram instance and associated WebGL properties.
     */
    dispose(): void;
}
