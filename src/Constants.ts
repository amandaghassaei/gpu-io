export const HALF_FLOAT = 'HALF_FLOAT';
export const FLOAT = 'FLOAT';
export const UNSIGNED_BYTE = 'UNSIGNED_BYTE';
export const BYTE = 'BYTE';
export const UNSIGNED_SHORT = 'UNSIGNED_SHORT';
export const SHORT = 'SHORT';
export const UNSIGNED_INT = 'UNSIGNED_INT';
export const INT = 'INT';

export const LINEAR = 'LINEAR';
export const NEAREST = 'NEAREST';

export const REPEAT = 'REPEAT';
export const CLAMP_TO_EDGE = 'CLAMP_TO_EDGE';
export const MIRRORED_REPEAT = 'MIRRORED_REPEAT';

export type DataLayerArrayType =  Float32Array | Uint8Array | Int8Array | Uint16Array | Int16Array | Uint32Array | Int32Array;
export type DataLayerType = typeof HALF_FLOAT | typeof FLOAT | typeof UNSIGNED_BYTE | typeof BYTE | typeof UNSIGNED_SHORT | typeof SHORT | typeof UNSIGNED_INT | typeof INT;
export type DataLayerNumComponents = 1 | 2 | 3 | 4;
export type DataLayerFilterType = typeof LINEAR | typeof NEAREST;
export type DataLayerWrapType = typeof REPEAT | typeof CLAMP_TO_EDGE | typeof MIRRORED_REPEAT;

// Uniform types.
export const FLOAT_1D_UNIFORM = '1f';
export const FLOAT_2D_UNIFORM = '2f';
export const FLOAT_3D_UNIFORM = '3f';
export const FLOAT_4D_UNIFORM = '3f';
export const INT_1D_UNIFORM = '1i';
export const INT_2D_UNIFORM = '2i';
export const INT_3D_UNIFORM = '3i';
export const INT_4D_UNIFORM = '3i';

export type UniformDataType = typeof FLOAT | typeof INT;
export type UniformValueType = 
	number |
	[number] |
	[number, number] |
	[number, number, number] |
	[number, number, number, number];
export type UniformType = 
	typeof FLOAT_1D_UNIFORM |
	typeof FLOAT_2D_UNIFORM |
	typeof FLOAT_3D_UNIFORM |
	typeof FLOAT_4D_UNIFORM |
	typeof INT_1D_UNIFORM |
	typeof INT_2D_UNIFORM |
	typeof INT_3D_UNIFORM |
	typeof INT_4D_UNIFORM;
export type Uniform = { 
	location: WebGLUniformLocation,
	type: UniformType,
};