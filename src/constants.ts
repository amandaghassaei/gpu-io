// Data types.
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

// Filter types.
export const LINEAR = 'LINEAR';
export const NEAREST = 'NEAREST';

// Wrap types.
export const REPEAT = 'REPEAT';
export const CLAMP_TO_EDGE = 'CLAMP_TO_EDGE';
// export const MIRRORED_REPEAT = 'MIRRORED_REPEAT';

// GPULayer parameter types.
export type GPULayerArray =  Float32Array | Uint8Array | Int8Array | Uint16Array | Int16Array | Uint32Array | Int32Array;
export const validArrayTypes = [Float32Array, Uint8Array, Int8Array, Uint16Array, Int16Array, Uint32Array, Int32Array, Array];
export type GPULayerType = typeof HALF_FLOAT | typeof FLOAT | typeof UNSIGNED_BYTE | typeof BYTE | typeof UNSIGNED_SHORT | typeof SHORT | typeof UNSIGNED_INT | typeof INT;
export const validDataTypes = [HALF_FLOAT, FLOAT, UNSIGNED_BYTE, BYTE, UNSIGNED_SHORT, SHORT, UNSIGNED_INT, INT];
export type GPULayerNumComponents = 1 | 2 | 3 | 4;
export type GPULayerFilter = typeof LINEAR | typeof NEAREST;
export const validFilters = [LINEAR, NEAREST];
export const validWraps = [CLAMP_TO_EDGE, REPEAT]; // MIRRORED_REPEAT
export type GPULayerWrap = typeof REPEAT | typeof CLAMP_TO_EDGE;// | typeof MIRRORED_REPEAT;

// TODO: change this?
// For image urls that are passed in and inited as textures.
export const RGB = 'RGB';
export const RGBA = 'RGBA';
export type TextureFormat = typeof RGB | typeof RGBA;
export const validTextureFormats = [RGB, RGBA];
export type TextureType = typeof UNSIGNED_BYTE;
export const validTextureTypes = [UNSIGNED_BYTE];

// GLSL versions.
export const GLSL3 = '300 es';
export const GLSL1 = '100';
export type GLSLVersion = typeof GLSL1 | typeof GLSL3;

// WebGL versions.
export const WEBGL2 = 'webgl2';
export const WEBGL1 = 'webgl';
export const EXPERIMENTAL_WEBGL = 'experimental-webgl';

// Precision declarations.
export const PRECISION_LOW_P = 'lowp';
export const PRECISION_MEDIUM_P = 'mediump';
export const PRECISION_HIGH_P = 'highp';
export type GLSLPrecision = typeof PRECISION_LOW_P | typeof PRECISION_MEDIUM_P | typeof PRECISION_HIGH_P;

// Uniform types.
export const FLOAT_1D_UNIFORM = '1f';
export const FLOAT_2D_UNIFORM = '2f';
export const FLOAT_3D_UNIFORM = '3f';
export const FLOAT_4D_UNIFORM = '4f';
export const INT_1D_UNIFORM = '1i';
export const INT_2D_UNIFORM = '2i';
export const INT_3D_UNIFORM = '3i';
export const INT_4D_UNIFORM = '4i';
export const UINT_1D_UNIFORM = '1ui';
export const UINT_2D_UNIFORM = '2ui';
export const UINT_3D_UNIFORM = '3ui';
export const UINT_4D_UNIFORM = '4ui';

// Uniform types and values.
export type UniformType = typeof FLOAT | typeof INT | typeof UINT | typeof BOOL;
export type UniformInternalType = 
	typeof FLOAT_1D_UNIFORM |
	typeof FLOAT_2D_UNIFORM |
	typeof FLOAT_3D_UNIFORM |
	typeof FLOAT_4D_UNIFORM |
	typeof INT_1D_UNIFORM |
	typeof INT_2D_UNIFORM |
	typeof INT_3D_UNIFORM |
	typeof INT_4D_UNIFORM |
	typeof UINT_1D_UNIFORM |
	typeof UINT_2D_UNIFORM |
	typeof UINT_3D_UNIFORM |
	typeof UINT_4D_UNIFORM;
export type UniformValue = boolean | number | number[];
export type Uniform = { 
	location: { [key: string]: WebGLUniformLocation },
	type: UniformInternalType,
	value: UniformValue,
};

// Vertex shader types.
export const DEFAULT_PROGRAM_NAME = 'DEFAULT';
export const DEFAULT_W_UV_PROGRAM_NAME = 'DEFAULT_W_UV';
export const DEFAULT_W_NORMAL_PROGRAM_NAME = 'DEFAULT_W_NORMAL';
export const DEFAULT_W_UV_NORMAL_PROGRAM_NAME = 'DEFAULT_W_UV_NORMAL';
export const SEGMENT_PROGRAM_NAME = 'SEGMENT';
export const LAYER_POINTS_PROGRAM_NAME = 'LAYER_POINTS';
export const LAYER_LINES_PROGRAM_NAME = 'LAYER_LINES';
export const LAYER_VECTOR_FIELD_PROGRAM_NAME = 'LAYER_VECTOR_FIELD';
export type PROGRAM_NAME_INTERNAL =
	typeof DEFAULT_PROGRAM_NAME |
	typeof DEFAULT_W_UV_PROGRAM_NAME |
	typeof DEFAULT_W_NORMAL_PROGRAM_NAME |
	typeof DEFAULT_W_UV_NORMAL_PROGRAM_NAME |
	typeof SEGMENT_PROGRAM_NAME |
	typeof LAYER_POINTS_PROGRAM_NAME |
	typeof LAYER_LINES_PROGRAM_NAME |
	typeof LAYER_VECTOR_FIELD_PROGRAM_NAME;

// Pass in #defines as strings to make it easier to control float vs int.
export type CompileTimeVars = { [key: string]: string };

// Each buffer in GPULayer contains a WebGLTexture and WebGLFramebuffer.
export type GPULayerBuffer = {
	texture: WebGLTexture,
	framebuffer?: WebGLFramebuffer,
}

// Error callback, defaults to throwing an error.
export type ErrorCallback = (message: string) => void;
export const DEFAULT_ERROR_CALLBACK = (msg: string) => { throw new Error(msg); };

// For stepCircle() and stepSegment() (with end caps).
export const DEFAULT_CIRCLE_NUM_SEGMENTS = 18;// Must be divisible by 6 to work with stepSegment().

// Extrema values.
export const MIN_UNSIGNED_BYTE = 0;
export const MAX_UNSIGNED_BYTE = 2 ** 8 - 1;
export const MIN_BYTE = -(2 ** 7);
export const MAX_BYTE = 2 ** 7 - 1;
export const MIN_UNSIGNED_SHORT = 0;
export const MAX_UNSIGNED_SHORT = 2 ** 16 - 1;
export const MIN_SHORT = -(2 ** 15);
export const MAX_SHORT = 2 ** 15 - 1;
export const MIN_UNSIGNED_INT = 0;
export const MAX_UNSIGNED_INT = 2 ** 32 - 1;
export const MIN_INT = -(2 ** 31);
export const MAX_INT = 2 ** 31 - 1;
// There are larger HALF_FLOAT and FLOAT ints, but they may be spaced out by > 1.
export const MIN_HALF_FLOAT_INT = -2048;
export const MAX_HALF_FLOAT_INT = 2048;
export const MIN_FLOAT_INT = -16777216;
export const MAX_FLOAT_INT = 16777216;