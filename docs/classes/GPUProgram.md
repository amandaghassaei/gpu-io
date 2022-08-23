[webgl-compute](../README.md) / GPUProgram

# Class: GPUProgram

## Table of contents

### Constructors

- [constructor](GPUProgram.md#constructor)

### Properties

- [name](GPUProgram.md#name)

### Methods

- [dispose](GPUProgram.md#dispose)
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
| `params.defines?` | [`CompileTimeVars`](../README.md#compiletimevars) | Compile-time #define variables to include with fragment shader. |
| `params.fragmentShader` | `string` \| `string`[] | Fragment shader source or array of sources to be joined. |
| `params.name` | `string` | Name of GPUProgram, used for error logging. |
| `params.uniforms?` | { `name`: `string` ; `type`: [`UniformType`](../README.md#uniformtype) ; `value`: [`UniformValue`](../README.md#uniformvalue)  }[] | Array of uniforms to initialize with GPUProgram.  Can also be added later with GPUProgram.setUniform(). |

#### Defined in

[GPUProgram.ts:79](https://github.com/amandaghassaei/webgl-compute/blob/f4996f0/src/GPUProgram.ts#L79)

## Properties

### name

• `Readonly` **name**: `string`

Name of GPUProgram, used for error logging.

#### Defined in

[GPUProgram.ts:53](https://github.com/amandaghassaei/webgl-compute/blob/f4996f0/src/GPUProgram.ts#L53)

## Methods

### dispose

▸ **dispose**(): `void`

Deallocate GPUProgram instance and associated WebGL properties.

#### Returns

`void`

#### Defined in

[GPUProgram.ts:464](https://github.com/amandaghassaei/webgl-compute/blob/f4996f0/src/GPUProgram.ts#L464)

___

### setUniform

▸ **setUniform**(`name`, `value`, `type?`): `void`

Set fragment shader uniform for GPUProgram.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | Uniform name as it appears in fragment shader. |
| `value` | [`UniformValue`](../README.md#uniformvalue) | Uniform value. |
| `type?` | [`UniformType`](../README.md#uniformtype) | Uniform type. |

#### Returns

`void`

#### Defined in

[GPUProgram.ts:374](https://github.com/amandaghassaei/webgl-compute/blob/f4996f0/src/GPUProgram.ts#L374)
