import { GLSLVersion, UniformDataType, UniformValueType } from './Constants';
export declare class GPUProgram {
    readonly name: string;
    private readonly gl;
    private readonly errorCallback;
    private readonly glslVersion;
    private readonly uniforms;
    private readonly fragmentShader;
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
        defines?: {
            [key: string]: string;
        };
    });
    private static convertDefinesToString;
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
