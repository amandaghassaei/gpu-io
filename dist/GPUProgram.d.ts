import { GLSLVersion, UniformDataType, UniformValueType } from './Constants';
export declare class GPUProgram {
    readonly name: string;
    private readonly gl;
    private readonly errorCallback;
    private readonly glslVersion;
    private readonly uniforms;
    private readonly fragmentShader;
    private _defaultProgram?;
    private _segmentProgram?;
    private _pointsProgram?;
    private _vectorFieldProgram?;
    private _indexedLinesProgram?;
    private _polylineProgram?;
    private static defaultVertexShader?;
    private static segmentVertexShader?;
    private static pointsVertexShader?;
    private static vectorFieldVertexShader?;
    private static indexedLinesVertexShader?;
    private static polylineVertexShader?;
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
    private initProgram;
    get defaultProgram(): WebGLProgram | undefined;
    get segmentProgram(): WebGLProgram | undefined;
    get pointsProgram(): WebGLProgram | undefined;
    get vectorFieldProgram(): WebGLProgram | undefined;
    get indexedLinesProgram(): WebGLProgram | undefined;
    get polylineProgram(): WebGLProgram | undefined;
    private get activePrograms();
    private uniformTypeForValue;
    private setProgramUniform;
    setUniform(uniformName: string, value: UniformValueType, dataType?: UniformDataType): void;
    setVertexUniform(program: WebGLProgram, uniformName: string, value: UniformValueType, dataType: UniformDataType): void;
    destroy(): void;
}
