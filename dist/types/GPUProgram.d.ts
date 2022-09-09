import { GPUComposer } from './GPUComposer';
import { UniformType, UniformValue, CompileTimeConstants, PROGRAM_NAME_INTERNAL, UniformParams, GPULayerState } from './constants';
export declare class GPUProgram {
    private readonly _composer;
    /**
     * Name of GPUProgram, used for error logging.
     */
    readonly name: string;
    private _fragmentShaders;
    private readonly _fragmentShaderSource;
    private readonly _compileTimeConstants;
    private readonly _uniforms;
    private readonly _programs;
    private readonly _programsKeyLookup;
    private readonly _samplerUniformsIndices;
    /**
     * Create a GPUProgram.
     * @param composer - The current GPUComposer instance.
     * @param params - GPUProgram parameters.
     * @param params.name - Name of GPUProgram, used for error logging.
     * @param params.fragmentShader - Fragment shader source or array of sources to be joined.
     * @param params.uniforms - Array of uniforms to initialize with GPUProgram.  More uniforms can be added later with GPUProgram.setUniform().
     * @param params.compileTimeConstants - Compile time #define constants to include with fragment shader.
     */
    constructor(composer: GPUComposer, params: {
        name: string;
        fragmentShader: string | string[];
        uniforms?: UniformParams[];
        compileTimeConstants?: CompileTimeConstants;
    });
    /**
     * Get fragment shader for GPUProgram, compile new onw if needed.
     * Used internally.
     * @private
     */
    private _getFragmentShader;
    /**
     * Get GLProgram associated with a specific vertex shader.
     * @private
     */
    _getProgramWithName(name: PROGRAM_NAME_INTERNAL, vertexCompileConstants: CompileTimeConstants, input: GPULayerState[]): WebGLProgram | undefined;
    /**
     * Set uniform for GLProgram.
     * @private
     */
    private _setProgramUniform;
    /**
     * Set fragment shader uniform for GPUProgram.
     * @param name - Uniform name as it appears in fragment shader.
     * @param value - Uniform value.
     * @param type - Uniform type (this only needs to be set once).
     */
    setUniform(name: string, value: UniformValue, type?: UniformType): void;
    /**
     * Set internal fragment shader uniforms for GPUProgram.
     * @private
     */
    _setInternalFragmentUniforms(program: WebGLProgram, input: GPULayerState[]): void;
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
