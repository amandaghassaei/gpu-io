import type { GPULayer } from './GPULayer';

// Data types and constants.

/**
 * Half float data type.
 */
export const HALF_FLOAT = 'HALF_FLOAT';
/**
 * Float data type.
 */
export const FLOAT = 'FLOAT';
/**
 * Unsigned byte data type.
 */
export const UNSIGNED_BYTE = 'UNSIGNED_BYTE';
/**
 * Byte data type.
 */
export const BYTE = 'BYTE';
/**
 * Unsigned short data type.
 */
export const UNSIGNED_SHORT = 'UNSIGNED_SHORT';
/**
 * Short data type.
 */
export const SHORT = 'SHORT';
/**
 * Unsigned int data type.
 */
export const UNSIGNED_INT = 'UNSIGNED_INT';
/**
 * Int data type.
 */
export const INT = 'INT';
/**
 * Boolean data type (GPUProgram uniforms only).
 */
export const BOOL = 'BOOL';
/**
 * Unsigned int data type (GPUProgram uniforms only).
 */
export const UINT = 'UINT';

// Filter types.
/**
 * Nearest texture filtering.
 */
export const NEAREST = 'NEAREST';
/**
 * Linear texture filtering.
 */
export const LINEAR = 'LINEAR';

// Wrap types.
/**
 * Clamp to edge wrapping (no wrapping).
 */
export const CLAMP_TO_EDGE = 'CLAMP_TO_EDGE';
/**
 * Repeat/periodic wrapping.
 */
export const REPEAT = 'REPEAT';
// export const MIRRORED_REPEAT = 'MIRRORED_REPEAT';

// GPULayer parameter types.
/**
 * GPULayer array types.
 */
export type GPULayerArray =  Float32Array | Uint8Array | Int8Array | Uint16Array | Int16Array | Uint32Array | Int32Array;
/**
 * @private
 */
export const validArrayTypes = [Float32Array, Uint8Array, Int8Array, Uint16Array, Int16Array, Uint32Array, Int32Array, Array];
/**
 * GPULayer data types.
 */
export type GPULayerType = typeof HALF_FLOAT | typeof FLOAT | typeof UNSIGNED_BYTE | typeof BYTE | typeof UNSIGNED_SHORT | typeof SHORT | typeof UNSIGNED_INT | typeof INT;
/**
 * @private
 */
export const validDataTypes = [HALF_FLOAT, FLOAT, UNSIGNED_BYTE, BYTE, UNSIGNED_SHORT, SHORT, UNSIGNED_INT, INT];
/**
 * GPULayer numComponents options.
 */
export type GPULayerNumComponents = 1 | 2 | 3 | 4;
/**
 * GPULayer filter/interpolation types.
 */
export type GPULayerFilter = typeof LINEAR | typeof NEAREST;
/**
 * @private
 */
export const validFilters = [NEAREST, LINEAR];
/**
 * @private
 */
/**
 * GPULayer wrap types.
 */
export type GPULayerWrap = typeof REPEAT | typeof CLAMP_TO_EDGE;// | typeof MIRRORED_REPEAT;
/**
 * @private
 */
export const validWraps = [CLAMP_TO_EDGE, REPEAT]; // MIRRORED_REPEAT
/**
 * The WebGLTexture corresponding to a GPULayer buffer (e.g. currentState or lastState).
 * This data structure also includes a reference back to the GPULayer that it originated from.
 */
export type GPULayerState = {
	texture: WebGLTexture,
	layer: GPULayer,
}

// For image urls that are passed in and inited as textures.
/**
 * RGB image format.
 */
export const RGB = 'RGB';
/**
 * RGBA image format.
 */
export const RGBA = 'RGBA';
/**
 * Image formats for GPULayer.initFromImage().
 */
export type ImageFormat = typeof RGB | typeof RGBA;
/**
 * Image types for GPULayer.initFromImage().
 */
 export type ImageType = typeof UNSIGNED_BYTE | typeof FLOAT | typeof HALF_FLOAT;
/**
 * @private
 */
export const validImageFormats = [RGB, RGBA];
/**
 * @private
 */
 export const validImageTypes = [UNSIGNED_BYTE, FLOAT, HALF_FLOAT];

// GLSL versions.
/**
 * GLSL version 300 (WebGL2 only).
 */
export const GLSL3 = '300 es';
/**
 * GLSL version 100 (WebGL1 and WebGL2).
 */
export const GLSL1 = '100';
/**
 * GLSL available versions.
 */
export type GLSLVersion = typeof GLSL1 | typeof GLSL3;

// WebGL versions.
/**
 * WebGL2 context ID.
 */
export const WEBGL2 = 'webgl2';
/**
 * WebGL1 context ID.
 */
export const WEBGL1 = 'webgl';
/**
 * Experimental WebGL context ID.
 */
export const EXPERIMENTAL_WEBGL = 'experimental-webgl';
/**
 * Experimental WebGL context ID.
 */
 export const EXPERIMENTAL_WEBGL2 = 'experimental-webgl2';

// Precision declarations.
/**
 * GLSL lowp precision declaration.
 */
export const PRECISION_LOW_P = 'lowp';
/**
 * GLSL mediump precision declaration.
 */
export const PRECISION_MEDIUM_P = 'mediump';
/**
 * GLSL highp precision declaration.
 */
export const PRECISION_HIGH_P = 'highp';
/**
 * GLSL available precision declarations.
 */
export type GLSLPrecision = typeof PRECISION_LOW_P | typeof PRECISION_MEDIUM_P | typeof PRECISION_HIGH_P;

// Uniform types.
/**
 * @private
 */
export const FLOAT_1D_UNIFORM = 'FLOAT_1D_UNIFORM';
/**
 * @private
 */
export const FLOAT_2D_UNIFORM = 'FLOAT_2D_UNIFORM';
/**
 * @private
 */
export const FLOAT_3D_UNIFORM = 'FLOAT_3D_UNIFORM';
/**
 * @private
 */
export const FLOAT_4D_UNIFORM = 'FLOAT_4D_UNIFORM';
/**
 * @private
 */
export const INT_1D_UNIFORM = 'INT_1D_UNIFORM';
/**
 * @private
 */
export const INT_2D_UNIFORM = 'INT_2D_UNIFORM';
/**
 * @private
 */
export const INT_3D_UNIFORM = 'INT_3D_UNIFORM';
/**
 * @private
 */
export const INT_4D_UNIFORM = 'INT_4D_UNIFORM';
/**
 * @private
 */
export const UINT_1D_UNIFORM = 'UINT_1D_UNIFORM';
/**
 * @private
 */
export const UINT_2D_UNIFORM = 'UINT_2D_UNIFORM';
/**
 * @private
 */
export const UINT_3D_UNIFORM = 'UINT_3D_UNIFORM';
/**
 * @private
 */
export const UINT_4D_UNIFORM = 'UINT_4D_UNIFORM';
/**
 * @private
 */
 export const BOOL_1D_UNIFORM = 'BOOL_1D_UNIFORM';
 /**
 * @private
 */
  export const BOOL_2D_UNIFORM = 'BOOL_2D_UNIFORM';
  /**
 * @private
 */
 export const BOOL_3D_UNIFORM = 'BOOL_3D_UNIFORM';
 /**
 * @private
 */
  export const BOOL_4D_UNIFORM = 'BOOL_4D_UNIFORM';

// Uniform types and values.
/**
 * GPUProgram uniform types.
 */
export type UniformType = typeof FLOAT | typeof INT | typeof UINT | typeof BOOL;
/**
 * @private
 */
export type UniformInternalType = 
	typeof BOOL_1D_UNIFORM |
	typeof BOOL_2D_UNIFORM |
	typeof BOOL_3D_UNIFORM |
	typeof BOOL_4D_UNIFORM |
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
/**
 * GPUProgram uniform values.
 */
export type UniformValue = boolean | boolean[] | number | number[];
/**
 * GPUProgram uniform parameters.
 */
export type UniformParams = {
	name: string,
	value: UniformValue,
	type: UniformType,
};
/**
 * @private
 */
export type Uniform = { 
	location: WeakMap<WebGLProgram, WebGLUniformLocation>,
	value: UniformValue,
	type: UniformInternalType,
};

// Vertex shader types.
/**
 * @private
 */
export const DEFAULT_PROGRAM_NAME = 'DEFAULT';
/**
 * @private
 */
export const SEGMENT_PROGRAM_NAME = 'SEGMENT';
/**
 * @private
 */
export const LAYER_POINTS_PROGRAM_NAME = 'LAYER_POINTS';
/**
 * @private
 */
export const LAYER_LINES_PROGRAM_NAME = 'LAYER_LINES';
/**
 * @private
 */
export const LAYER_VECTOR_FIELD_PROGRAM_NAME = 'LAYER_VECTOR_FIELD';
/**
 * @private
 */
 export const LAYER_MESH_PROGRAM_NAME = 'LAYER_MESH';
// Vertex shader compile time constants.
/**
 * @private
 */
export const GPUIO_VS_WRAP_X = 'GPUIO_VS_WRAP_X';
/**
 * @private
 */
export const GPUIO_VS_WRAP_Y = 'GPUIO_VS_WRAP_Y';
/**
 * @private
 */
 export const GPUIO_VS_INDEXED_POSITIONS = 'GPUIO_VS_INDEXED_POSITIONS';
/**
 * @private
 */
export const GPUIO_VS_UV_ATTRIBUTE = 'GPUIO_VS_UV_ATTRIBUTE';
 /**
 * @private
 */
export const GPUIO_VS_NORMAL_ATTRIBUTE = 'GPUIO_VS_NORMAL_ATTRIBUTE';
/**
 * @private
 */
export const GPUIO_VS_POSITION_W_ACCUM = 'GPUIO_VS_POSITION_W_ACCUM';

/**
 * @private
 */
export type PROGRAM_NAME_INTERNAL =
	typeof DEFAULT_PROGRAM_NAME |
	typeof SEGMENT_PROGRAM_NAME |
	typeof LAYER_POINTS_PROGRAM_NAME |
	typeof LAYER_LINES_PROGRAM_NAME |
	typeof LAYER_VECTOR_FIELD_PROGRAM_NAME |
	typeof LAYER_MESH_PROGRAM_NAME;

// Pass in #defines as strings to make it easier to control float vs int.
/**
 * Object containing compile time #define constants for GPUProgram fragment shader.
 */
export type CompileTimeConstants = { [key: string]: string };

// Error callback, defaults to throwing an error.
export type ErrorCallback = (message: string) => void;
/**
 * @private
 */
export const DEFAULT_ERROR_CALLBACK = (message: string) => { throw new Error(message); };

// For stepCircle() and stepSegment() (with end caps).
/**
 * @private
 */
export const DEFAULT_CIRCLE_NUM_SEGMENTS = 18;// Must be divisible by 6 to work with stepSegment().

// Extrema values.
/**
 * @private
 */
export const MIN_UNSIGNED_BYTE = 0;
/**
 * @private
 */
export const MAX_UNSIGNED_BYTE = 2 ** 8 - 1;
/**
 * @private
 */
export const MIN_BYTE = -(2 ** 7);
/**
 * @private
 */
export const MAX_BYTE = 2 ** 7 - 1;
/**
 * @private
 */
export const MIN_UNSIGNED_SHORT = 0;
/**
 * @private
 */
export const MAX_UNSIGNED_SHORT = 2 ** 16 - 1;
/**
 * @private
 */
export const MIN_SHORT = -(2 ** 15);
/**
 * @private
 */
export const MAX_SHORT = 2 ** 15 - 1;
/**
 * @private
 */
export const MIN_UNSIGNED_INT = 0;
/**
 * @private
 */
export const MAX_UNSIGNED_INT = 2 ** 32 - 1;
/**
 * @private
 */
export const MIN_INT = -(2 ** 31);
/**
 * @private
 */
export const MAX_INT = 2 ** 31 - 1;
// There are larger HALF_FLOAT and FLOAT ints, but they may be spaced out by > 1.
/**
 * @private
 */
export const MIN_HALF_FLOAT_INT = -2048;
/**
 * @private
 */
export const MAX_HALF_FLOAT_INT = 2048;
/**
 * @private
 */
export const MIN_FLOAT_INT = -16777216;
/**
 * @private
 */
export const MAX_FLOAT_INT = 16777216;

// Precision compile time constants
/**
 * @private
 */
export const GPUIO_INT_PRECISION = 'GPUIO_INT_PRECISION';
/**
 * @private
 */
export const GPUIO_FLOAT_PRECISION = 'GPUIO_FLOAT_PRECISION';

export const BOUNDARY_TOP = 'BOUNDARY_TOP';
export const BOUNDARY_BOTTOM = 'BOUNDARY_BOTTOM';
export const BOUNDARY_LEFT = 'BOUNDARY_LEFT';
export const BOUNDARY_RIGHT = 'BOUNDARY_RIGHT';
export type BoundaryEdge = typeof BOUNDARY_TOP | typeof BOUNDARY_BOTTOM | typeof BOUNDARY_LEFT | typeof BOUNDARY_RIGHT;
