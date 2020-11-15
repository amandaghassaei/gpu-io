export declare type UniformDataType = 'FLOAT' | 'INT';
export declare type UniformValueType = number | [
    number
] | [
    number,
    number
] | [
    number,
    number,
    number
] | [
    number,
    number,
    number,
    number
];
export declare type AttributeDataType = 'float32' | 'float16' | 'uint8' | 'int8' | 'uint16' | 'int16';
export declare class GPUProgram {
    readonly name: string;
    private readonly gl;
    private readonly errorCallback;
    readonly program?: WebGLProgram;
    private readonly uniforms;
    private readonly shaders;
    private readonly attributes;
    private readonly attributeNames;
    constructor(name: string, gl: WebGLRenderingContext | WebGL2RenderingContext, errorCallback: (message: string) => void, vertexShader: WebGLShader, fragmentShaderSource: string, uniforms?: {
        name: string;
        value: UniformValueType;
        dataType: UniformDataType;
    }[]);
    private uniformTypeForValue;
    setUniform(uniformName: string, value: UniformValueType, dataType: UniformDataType): void;
    setVertexAttribute(attributeName: string, dataType: AttributeDataType): void;
    getAttributeLocation(index: number): number;
    destroy(): void;
}
