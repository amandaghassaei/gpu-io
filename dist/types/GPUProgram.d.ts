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
     * @private
     */
    private compile;
    /**
     * Get GLProgram associated with a specific vertex shader.
     * @private
     */
    private getProgramWithName;
    /**
     * @private
     */
    get _defaultProgram(): WebGLProgram | undefined;
    /**
     * @private
     */
    get _defaultProgramWithUV(): WebGLProgram | undefined;
    /**
     * @private
     */
    get _defaultProgramWithNormal(): WebGLProgram | undefined;
    /**
     * @private
     */
    get _defaultProgramWithUVNormal(): WebGLProgram | undefined;
    /**
     * @private
     */
    get _segmentProgram(): WebGLProgram | undefined;
    /**
     * @private
     */
    get _layerPointsProgram(): WebGLProgram | undefined;
    /**
     * @private
     */
    get _layerVectorFieldProgram(): WebGLProgram | undefined;
    /**
     * @private
     */
    get _layerLinesProgram(): WebGLProgram | undefined;
    /**
     * Set uniform for GLProgram.
     * @private
     */
    private setProgramUniform;
    /**
     * Set fragment shader uniform for GPUProgram.
     * @param {string} name - Uniform name as it appears in fragment shader.
     * @param {boolean|number|number[]} value - Uniform value.
     * @param {BOOL|INT|UINT|FLOAT} [type] - Uniform type.
     */
    setUniform(name: string, value: UniformValue, type?: UniformType): void;
    /**
     * Set vertex shader uniform for GPUProgram.
     * @private
     */
    _setVertexUniform(program: WebGLProgram, uniformName: string, value: UniformValue, type: UniformType): void;
    /**
     * Deallocate GPUProgram instance and associated WebGL properties.
     */
    dispose(): void;
}
