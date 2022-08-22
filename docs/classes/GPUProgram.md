[webgl-compute](../README.md) / [Exports](../modules.md) / GPUProgram

# Class: GPUProgram

## Table of contents

### Constructors

- [constructor](GPUProgram.md#constructor)

### Properties

- [composer](GPUProgram.md#composer)
- [defines](GPUProgram.md#defines)
- [fragmentShader](GPUProgram.md#fragmentshader)
- [fragmentShaderSource](GPUProgram.md#fragmentshadersource)
- [name](GPUProgram.md#name)
- [programs](GPUProgram.md#programs)
- [uniforms](GPUProgram.md#uniforms)

### Accessors

- [\_defaultProgram](GPUProgram.md#_defaultprogram)
- [\_defaultProgramWithNormal](GPUProgram.md#_defaultprogramwithnormal)
- [\_defaultProgramWithUV](GPUProgram.md#_defaultprogramwithuv)
- [\_defaultProgramWithUVNormal](GPUProgram.md#_defaultprogramwithuvnormal)
- [\_layerLinesProgram](GPUProgram.md#_layerlinesprogram)
- [\_layerPointsProgram](GPUProgram.md#_layerpointsprogram)
- [\_layerVectorFieldProgram](GPUProgram.md#_layervectorfieldprogram)
- [\_segmentProgram](GPUProgram.md#_segmentprogram)

### Methods

- [\_setVertexUniform](GPUProgram.md#_setvertexuniform)
- [compile](GPUProgram.md#compile)
- [dispose](GPUProgram.md#dispose)
- [getProgramWithName](GPUProgram.md#getprogramwithname)
- [setProgramUniform](GPUProgram.md#setprogramuniform)
- [setUniform](GPUProgram.md#setuniform)

## Constructors

### constructor

• **new GPUProgram**(`composer`, `params`)

Create a GPUProgram.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `composer` | [`GPUComposer`](GPUComposer.md) | The current GPUComposer instance. |
| `params` | `Object` | GPUProgram parameters. |
| `params.defines?` | [`CompileTimeVars`](../modules.md#compiletimevars) | - |
| `params.fragmentShader` | `string` \| `string`[] | - |
| `params.name` | `string` | - |
| `params.uniforms?` | { `name`: `string` ; `type`: [`UniformType`](../modules.md#uniformtype) ; `value`: [`UniformValue`](../modules.md#uniformvalue)  }[] | - |

#### Defined in

[GPUProgram.ts:73](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUProgram.ts#L73)

## Properties

### composer

• `Private` `Readonly` **composer**: [`GPUComposer`](GPUComposer.md)

#### Defined in

[GPUProgram.ts:48](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUProgram.ts#L48)

___

### defines

• `Private` `Readonly` **defines**: [`CompileTimeVars`](../modules.md#compiletimevars) = `{}`

#### Defined in

[GPUProgram.ts:59](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUProgram.ts#L59)

___

### fragmentShader

• `Private` **fragmentShader**: `WebGLShader`

#### Defined in

[GPUProgram.ts:54](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUProgram.ts#L54)

___

### fragmentShaderSource

• `Private` `Readonly` **fragmentShaderSource**: `string`

#### Defined in

[GPUProgram.ts:57](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUProgram.ts#L57)

___

### name

• `Readonly` **name**: `string`

#### Defined in

[GPUProgram.ts:51](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUProgram.ts#L51)

___

### programs

• `Private` `Readonly` **programs**: `Object` = `{}`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `DEFAULT` | `undefined` \| `WebGLProgram` |
| `DEFAULT_W_NORMAL` | `undefined` \| `WebGLProgram` |
| `DEFAULT_W_UV` | `undefined` \| `WebGLProgram` |
| `DEFAULT_W_UV_NORMAL` | `undefined` \| `WebGLProgram` |
| `LAYER_LINES` | `undefined` \| `WebGLProgram` |
| `LAYER_POINTS` | `undefined` \| `WebGLProgram` |
| `LAYER_VECTOR_FIELD` | `undefined` \| `WebGLProgram` |
| `SEGMENT` | `undefined` \| `WebGLProgram` |

#### Defined in

[GPUProgram.ts:66](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUProgram.ts#L66)

___

### uniforms

• `Private` `Readonly` **uniforms**: `Object` = `{}`

#### Index signature

▪ [key: `string`]: [`Uniform`](../modules.md#uniform)

#### Defined in

[GPUProgram.ts:61](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUProgram.ts#L61)

## Accessors

### \_defaultProgram

• `get` **_defaultProgram**(): `undefined` \| `WebGLProgram`

#### Returns

`undefined` \| `WebGLProgram`

#### Defined in

[GPUProgram.ts:233](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUProgram.ts#L233)

___

### \_defaultProgramWithNormal

• `get` **_defaultProgramWithNormal**(): `undefined` \| `WebGLProgram`

#### Returns

`undefined` \| `WebGLProgram`

#### Defined in

[GPUProgram.ts:245](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUProgram.ts#L245)

___

### \_defaultProgramWithUV

• `get` **_defaultProgramWithUV**(): `undefined` \| `WebGLProgram`

#### Returns

`undefined` \| `WebGLProgram`

#### Defined in

[GPUProgram.ts:239](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUProgram.ts#L239)

___

### \_defaultProgramWithUVNormal

• `get` **_defaultProgramWithUVNormal**(): `undefined` \| `WebGLProgram`

#### Returns

`undefined` \| `WebGLProgram`

#### Defined in

[GPUProgram.ts:251](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUProgram.ts#L251)

___

### \_layerLinesProgram

• `get` **_layerLinesProgram**(): `undefined` \| `WebGLProgram`

#### Returns

`undefined` \| `WebGLProgram`

#### Defined in

[GPUProgram.ts:275](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUProgram.ts#L275)

___

### \_layerPointsProgram

• `get` **_layerPointsProgram**(): `undefined` \| `WebGLProgram`

#### Returns

`undefined` \| `WebGLProgram`

#### Defined in

[GPUProgram.ts:263](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUProgram.ts#L263)

___

### \_layerVectorFieldProgram

• `get` **_layerVectorFieldProgram**(): `undefined` \| `WebGLProgram`

#### Returns

`undefined` \| `WebGLProgram`

#### Defined in

[GPUProgram.ts:269](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUProgram.ts#L269)

___

### \_segmentProgram

• `get` **_segmentProgram**(): `undefined` \| `WebGLProgram`

#### Returns

`undefined` \| `WebGLProgram`

#### Defined in

[GPUProgram.ts:257](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUProgram.ts#L257)

## Methods

### \_setVertexUniform

▸ `Private` **_setVertexUniform**(`program`, `uniformName`, `value`, `type`): `void`

Set vertex shader uniform for GPUProgram.

#### Parameters

| Name | Type |
| :------ | :------ |
| `program` | `WebGLProgram` |
| `uniformName` | `string` |
| `value` | [`UniformValue`](../modules.md#uniformvalue) |
| `type` | [`UniformType`](../modules.md#uniformtype) |

#### Returns

`void`

#### Defined in

[GPUProgram.ts:438](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUProgram.ts#L438)

___

### compile

▸ `Private` **compile**(`defines?`): `void`

Compile fragment shader for GPUProgram.
Used internally, called only one.

#### Parameters

| Name | Type |
| :------ | :------ |
| `defines?` | [`CompileTimeVars`](../modules.md#compiletimevars) |

#### Returns

`void`

#### Defined in

[GPUProgram.ts:143](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUProgram.ts#L143)

___

### dispose

▸ **dispose**(): `void`

Deallocate GPUProgram instance and associated WebGL properties.

#### Returns

`void`

#### Defined in

[GPUProgram.ts:458](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUProgram.ts#L458)

___

### getProgramWithName

▸ `Private` **getProgramWithName**(`name`): `undefined` \| `WebGLProgram`

Get GLProgram associated with a specific vertex shader.

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | [`PROGRAM_NAME_INTERNAL`](../modules.md#program_name_internal) |

#### Returns

`undefined` \| `WebGLProgram`

#### Defined in

[GPUProgram.ts:198](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUProgram.ts#L198)

___

### setProgramUniform

▸ `Private` **setProgramUniform**(`program`, `programName`, `name`, `value`, `type`): `void`

Set uniform for GLProgram.

#### Parameters

| Name | Type |
| :------ | :------ |
| `program` | `WebGLProgram` |
| `programName` | `string` |
| `name` | `string` |
| `value` | [`UniformValue`](../modules.md#uniformvalue) |
| `type` | [`UniformInternalType`](../modules.md#uniforminternaltype) |

#### Returns

`void`

#### Defined in

[GPUProgram.ts:283](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUProgram.ts#L283)

___

### setUniform

▸ **setUniform**(`name`, `value`, `type?`): `void`

Set fragment shader uniform for GPUProgram.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | Uniform name as it appears in fragment shader. |
| `value` | [`UniformValue`](../modules.md#uniformvalue) | Uniform value. |
| `type?` | [`UniformType`](../modules.md#uniformtype) | Uniform type. |

#### Returns

`void`

#### Defined in

[GPUProgram.ts:368](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUProgram.ts#L368)
