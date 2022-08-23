/**
 * Half float data type.
 */
export declare const HALF_FLOAT = "HALF_FLOAT";
/**
 * Float data type.
 */
export declare const FLOAT = "FLOAT";
/**
 * Unsigned byte data type.
 */
export declare const UNSIGNED_BYTE = "UNSIGNED_BYTE";
/**
 * Byte data type.
 */
export declare const BYTE = "BYTE";
/**
 * Unsigned short data type.
 */
export declare const UNSIGNED_SHORT = "UNSIGNED_SHORT";
/**
 * Short data type.
 */
export declare const SHORT = "SHORT";
/**
 * Unsigned int data type.
 */
export declare const UNSIGNED_INT = "UNSIGNED_INT";
/**
 * Int data type.
 */
export declare const INT = "INT";
/**
 * Boolean data type (GPUProgram uniforms only).
 */
export declare const BOOL = "BOOL";
/**
 * Unsigned int data type (GPUProgram uniforms only).
 */
export declare const UINT = "UINT";
/**
 * Nearest texture filtering.
 */
export declare const NEAREST = "NEAREST";
/**
 * Linear texture filtering.
 */
export declare const LINEAR = "LINEAR";
/**
 * Clamp to edge wrapping (no wrapping).
 */
export declare const CLAMP_TO_EDGE = "CLAMP_TO_EDGE";
/**
 * Repeat/periodic wrapping.
 */
export declare const REPEAT = "REPEAT";
/**
 * GPULayer array types.
 */
export declare type GPULayerArray = Float32Array | Uint8Array | Int8Array | Uint16Array | Int16Array | Uint32Array | Int32Array;
/**
 * @private
 */
export declare const validArrayTypes: (Float32ArrayConstructor | Uint16ArrayConstructor | Uint8ArrayConstructor | Int8ArrayConstructor | Int16ArrayConstructor | Uint32ArrayConstructor | Int32ArrayConstructor | ArrayConstructor)[];
/**
 * GPULayer data types.
 */
export declare type GPULayerType = typeof HALF_FLOAT | typeof FLOAT | typeof UNSIGNED_BYTE | typeof BYTE | typeof UNSIGNED_SHORT | typeof SHORT | typeof UNSIGNED_INT | typeof INT;
/**
 * @private
 */
export declare const validDataTypes: string[];
/**
 * GPULayer numComponents options.
 */
export declare type GPULayerNumComponents = 1 | 2 | 3 | 4;
/**
 * GPULayer filter/interpolation types.
 */
export declare type GPULayerFilter = typeof LINEAR | typeof NEAREST;
/**
 * @private
 */
export declare const validFilters: string[];
/**
 * @private
 */
/**
 * GPULayer wrap types.
 */
export declare type GPULayerWrap = typeof REPEAT | typeof CLAMP_TO_EDGE;
/**
 * @private
 */
export declare const validWraps: string[];
/**
 * @private
 */
export declare const RGB = "RGB";
/**
 * @private
 */
export declare const RGBA = "RGBA";
/**
 * @private
 */
export declare type TextureFormat = typeof RGB | typeof RGBA;
/**
 * @private
 */
export declare const validTextureFormats: string[];
/**
 * @private
 */
export declare type TextureType = typeof UNSIGNED_BYTE;
/**
 * @private
 */
export declare const validTextureTypes: string[];
/**
 * GLSL version 300 (WebGL2 only).
 */
export declare const GLSL3 = "300 es";
/**
 * GLSL version 100 (WebGL1 and WebGL2).
 */
export declare const GLSL1 = "100";
/**
 * GLSL available versions.
 */
export declare type GLSLVersion = typeof GLSL1 | typeof GLSL3;
/**
 * WebGL2 context ID.
 */
export declare const WEBGL2 = "webgl2";
/**
 * WebGL1 context ID.
 */
export declare const WEBGL1 = "webgl";
/**
 * Experimental WebGL context ID.
 */
export declare const EXPERIMENTAL_WEBGL = "experimental-webgl";
/**
 * GLSL lowp precision declaration.
 */
export declare const PRECISION_LOW_P = "lowp";
/**
 * GLSL mediump precision declaration.
 */
export declare const PRECISION_MEDIUM_P = "mediump";
/**
 * GLSL highp precision declaration.
 */
export declare const PRECISION_HIGH_P = "highp";
/**
 * GLSL available precision declarations.
 */
export declare type GLSLPrecision = typeof PRECISION_LOW_P | typeof PRECISION_MEDIUM_P | typeof PRECISION_HIGH_P;
/**
 * @private
 */
export declare const FLOAT_1D_UNIFORM = "1f";
/**
 * @private
 */
export declare const FLOAT_2D_UNIFORM = "2f";
/**
 * @private
 */
export declare const FLOAT_3D_UNIFORM = "3f";
/**
 * @private
 */
export declare const FLOAT_4D_UNIFORM = "4f";
/**
 * @private
 */
export declare const INT_1D_UNIFORM = "1i";
/**
 * @private
 */
export declare const INT_2D_UNIFORM = "2i";
/**
 * @private
 */
export declare const INT_3D_UNIFORM = "3i";
/**
 * @private
 */
export declare const INT_4D_UNIFORM = "4i";
/**
 * @private
 */
export declare const UINT_1D_UNIFORM = "1ui";
/**
 * @private
 */
export declare const UINT_2D_UNIFORM = "2ui";
/**
 * @private
 */
export declare const UINT_3D_UNIFORM = "3ui";
/**
 * @private
 */
export declare const UINT_4D_UNIFORM = "4ui";
/**
 * GPUProgram uniform types.
 */
export declare type UniformType = typeof FLOAT | typeof INT | typeof UINT | typeof BOOL;
/**
 * @private
 */
export declare type UniformInternalType = typeof FLOAT_1D_UNIFORM | typeof FLOAT_2D_UNIFORM | typeof FLOAT_3D_UNIFORM | typeof FLOAT_4D_UNIFORM | typeof INT_1D_UNIFORM | typeof INT_2D_UNIFORM | typeof INT_3D_UNIFORM | typeof INT_4D_UNIFORM | typeof UINT_1D_UNIFORM | typeof UINT_2D_UNIFORM | typeof UINT_3D_UNIFORM | typeof UINT_4D_UNIFORM;
/**
 * GPUProgram uniform values.
 */
export declare type UniformValue = boolean | number | number[];
/**
 * @private
 */
export declare type Uniform = {
    location: {
        [key: string]: WebGLUniformLocation;
    };
    type: UniformInternalType;
    value: UniformValue;
};
/**
 * @private
 */
export declare const DEFAULT_PROGRAM_NAME = "DEFAULT";
/**
 * @private
 */
export declare const DEFAULT_W_UV_PROGRAM_NAME = "DEFAULT_W_UV";
/**
 * @private
 */
export declare const DEFAULT_W_NORMAL_PROGRAM_NAME = "DEFAULT_W_NORMAL";
/**
 * @private
 */
export declare const DEFAULT_W_UV_NORMAL_PROGRAM_NAME = "DEFAULT_W_UV_NORMAL";
/**
 * @private
 */
export declare const SEGMENT_PROGRAM_NAME = "SEGMENT";
/**
 * @private
 */
export declare const LAYER_POINTS_PROGRAM_NAME = "LAYER_POINTS";
/**
 * @private
 */
export declare const LAYER_LINES_PROGRAM_NAME = "LAYER_LINES";
/**
 * @private
 */
export declare const LAYER_VECTOR_FIELD_PROGRAM_NAME = "LAYER_VECTOR_FIELD";
/**
 * @private
 */
export declare type PROGRAM_NAME_INTERNAL = typeof DEFAULT_PROGRAM_NAME | typeof DEFAULT_W_UV_PROGRAM_NAME | typeof DEFAULT_W_NORMAL_PROGRAM_NAME | typeof DEFAULT_W_UV_NORMAL_PROGRAM_NAME | typeof SEGMENT_PROGRAM_NAME | typeof LAYER_POINTS_PROGRAM_NAME | typeof LAYER_LINES_PROGRAM_NAME | typeof LAYER_VECTOR_FIELD_PROGRAM_NAME;
/**
 * Object containing compile-time #define variables for GPUProgram fragment shader.
 */
export declare type CompileTimeVars = {
    [key: string]: string;
};
/**
 * @private
 */
export declare type GPULayerBuffer = {
    texture: WebGLTexture;
    framebuffer?: WebGLFramebuffer;
};
export declare type ErrorCallback = (message: string) => void;
/**
 * @private
 */
export declare const DEFAULT_ERROR_CALLBACK: (msg: string) => never;
/**
 * @private
 */
export declare const DEFAULT_CIRCLE_NUM_SEGMENTS = 18;
/**
 * @private
 */
export declare const MIN_UNSIGNED_BYTE = 0;
/**
 * @private
 */
export declare const MAX_UNSIGNED_BYTE: number;
/**
 * @private
 */
export declare const MIN_BYTE: number;
/**
 * @private
 */
export declare const MAX_BYTE: number;
/**
 * @private
 */
export declare const MIN_UNSIGNED_SHORT = 0;
/**
 * @private
 */
export declare const MAX_UNSIGNED_SHORT: number;
/**
 * @private
 */
export declare const MIN_SHORT: number;
/**
 * @private
 */
export declare const MAX_SHORT: number;
/**
 * @private
 */
export declare const MIN_UNSIGNED_INT = 0;
/**
 * @private
 */
export declare const MAX_UNSIGNED_INT: number;
/**
 * @private
 */
export declare const MIN_INT: number;
/**
 * @private
 */
export declare const MAX_INT: number;
/**
 * @private
 */
export declare const MIN_HALF_FLOAT_INT = -2048;
/**
 * @private
 */
export declare const MAX_HALF_FLOAT_INT = 2048;
/**
 * @private
 */
export declare const MIN_FLOAT_INT = -16777216;
/**
 * @private
 */
export declare const MAX_FLOAT_INT = 16777216;
