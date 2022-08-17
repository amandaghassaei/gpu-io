export const HALF_FLOAT = 'HALF_FLOAT';
export const FLOAT = 'FLOAT';
export const UNSIGNED_BYTE = 'UNSIGNED_BYTE';
export const BYTE = 'BYTE';
export const UNSIGNED_SHORT = 'UNSIGNED_SHORT';
export const SHORT = 'SHORT';
export const UNSIGNED_INT = 'UNSIGNED_INT';
export const INT = 'INT';
export const BOOL = 'BOOL';
export const UINT = 'UINT';

export const LINEAR = 'LINEAR';
export const NEAREST = 'NEAREST';

export const REPEAT = 'REPEAT';
export const CLAMP_TO_EDGE = 'CLAMP_TO_EDGE';
// export const MIRRORED_REPEAT = 'MIRRORED_REPEAT';

export const RGB = 'RGB';
export const RGBA = 'RGBA';

export type GPULayerArray =  Float32Array | Uint8Array | Int8Array | Uint16Array | Int16Array | Uint32Array | Int32Array;
export const validArrayTypes = [Float32Array, Uint8Array, Int8Array, Uint16Array, Int16Array, Uint32Array, Int32Array, Array];
export type GPULayerType = typeof HALF_FLOAT | typeof FLOAT | typeof UNSIGNED_BYTE | typeof BYTE | typeof UNSIGNED_SHORT | typeof SHORT | typeof UNSIGNED_INT | typeof INT;
export const validDataTypes = [HALF_FLOAT, FLOAT, UNSIGNED_BYTE, BYTE, UNSIGNED_SHORT, SHORT, UNSIGNED_INT, INT];
export type GPULayerNumComponents = 1 | 2 | 3 | 4;
export type GPULayerFilter = typeof LINEAR | typeof NEAREST;
export const validFilters = [LINEAR, NEAREST];
export const validWraps = [CLAMP_TO_EDGE, REPEAT]; // MIRRORED_REPEAT
export type GPULayerWrap = typeof REPEAT | typeof CLAMP_TO_EDGE;// | typeof MIRRORED_REPEAT;

// For image urls that are passed in and inited as textures.
export type TextureFormat = typeof RGB | typeof RGBA;
export const validTextureFormats = [RGB, RGBA];
export type TextureType = typeof UNSIGNED_BYTE;
export const validTextureTypes = [UNSIGNED_BYTE];

export const GLSL3 = '300 es';
export const GLSL1 = '100';
export type GLSLVersion = typeof GLSL1 | typeof GLSL3;

export const WEBGL2 = 'webgl2';
export const WEBGL1 = 'webgl';
export const EXPERIMENTAL_WEBGL = 'experimental-webgl';

export const PRECISION_LOW_P = 'lowp';
export const PRECISION_MEDIUM_P = 'mediump';
export const PRECISION_HIGH_P = 'highp';
export type GLSLPrecision = typeof PRECISION_LOW_P | typeof PRECISION_MEDIUM_P | typeof PRECISION_HIGH_P;

// Uniform types.
export const FLOAT_1D_UNIFORM = '1f';
export const FLOAT_2D_UNIFORM = '2f';
export const FLOAT_3D_UNIFORM = '3f';
export const FLOAT_4D_UNIFORM = '3f';
export const INT_1D_UNIFORM = '1i';
export const INT_2D_UNIFORM = '2i';
export const INT_3D_UNIFORM = '3i';
export const INT_4D_UNIFORM = '3i';

export type UniformType = typeof FLOAT | typeof INT |  typeof BOOL;
export type UniformInternalType = 
	typeof FLOAT_1D_UNIFORM |
	typeof FLOAT_2D_UNIFORM |
	typeof FLOAT_3D_UNIFORM |
	typeof FLOAT_4D_UNIFORM |
	typeof INT_1D_UNIFORM |
	typeof INT_2D_UNIFORM |
	typeof INT_3D_UNIFORM |
	typeof INT_4D_UNIFORM;
export type UniformValue = boolean | number | number[];
export type Uniform = { 
	location: { [key: string]: WebGLUniformLocation },
	type: UniformInternalType,
	value: UniformValue,
};

// Vertex shaders.
export const DEFAULT_PROGRAM_NAME = 'DEFAULT';
export const DEFAULT_W_UV_PROGRAM_NAME = 'DEFAULT_W_UV';
export const DEFAULT_W_NORMAL_PROGRAM_NAME = 'DEFAULT_W_NORMAL';
export const DEFAULT_W_UV_NORMAL_PROGRAM_NAME = 'DEFAULT_W_UV_NORMAL';
export const SEGMENT_PROGRAM_NAME = 'SEGMENT';
export const DATA_LAYER_POINTS_PROGRAM_NAME = 'DATA_LAYER_POINTS';
export const DATA_LAYER_LINES_PROGRAM_NAME = 'DATA_LAYER_LINES';
export const DATA_LAYER_VECTOR_FIELD_PROGRAM_NAME = 'DATA_LAYER_VECTOR_FIELD';
export type PROGRAM_NAME_INTERNAL =
	typeof DEFAULT_PROGRAM_NAME |
	typeof DEFAULT_W_UV_PROGRAM_NAME |
	typeof DEFAULT_W_NORMAL_PROGRAM_NAME |
	typeof DEFAULT_W_UV_NORMAL_PROGRAM_NAME |
	typeof SEGMENT_PROGRAM_NAME |
	typeof DATA_LAYER_POINTS_PROGRAM_NAME |
	typeof DATA_LAYER_LINES_PROGRAM_NAME |
	typeof DATA_LAYER_VECTOR_FIELD_PROGRAM_NAME;

// Pass in #defines as strings to make it easier to control float vs int.
export type CompileTimeVars = { [key: string]: string };

export type GPULayerBuffer = {
	texture: WebGLTexture,
	framebuffer?: WebGLFramebuffer,
}

export type ErrorCallback = (message: string) => void;
export const DEFAULT_ERROR_CALLBACK = (msg: string) => { throw new Error(msg); };

export const DEFAULT_CIRCLE_NUM_SEGMENTS = 18;// Must be divisible by 6 to work with stepSegment().