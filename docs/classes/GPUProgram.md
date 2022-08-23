[webgl-compute](../README.md) / GPUProgram

# Class: GPUProgram

## Table of contents

### Properties

- [name](GPUProgram.md#name)

### Constructors

- [constructor](GPUProgram.md#constructor)

### Methods

- [setUniform](GPUProgram.md#setuniform)
- [dispose](GPUProgram.md#dispose)

## Properties

### name

• `Readonly` **name**: `string`

Name of GPUProgram, used for error logging.

#### Defined in

[GPUProgram.ts:53](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPUProgram.ts#L53)

## Constructors

### constructor

• **new GPUProgram**(`composer`, `params`)

Create a GPUProgram.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `composer` | [`GPUComposer`](GPUComposer.md) | The current GPUComposer instance. |
| `params` | `Object` | GPUProgram parameters. |
| `params.name` | `string` | Name of GPUProgram, used for error logging. |
| `params.fragmentShader` | `string` \| `string`[] | Fragment shader source or array of sources to be joined. |
| `params.uniforms?` | { `name`: `string` ; `value`: [`UniformValue`](../README.md#uniformvalue) ; `type`: [`UniformType`](../README.md#uniformtype)  }[] | Array of uniforms to initialize with GPUProgram.  More uniforms can be added later with GPUProgram.setUniform(). |
| `params.defines?` | [`CompileTimeVars`](../README.md#compiletimevars) | Compile-time #define variables to include with fragment shader. |

#### Defined in

[GPUProgram.ts:79](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPUProgram.ts#L79)

## Methods

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

[GPUProgram.ts:374](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPUProgram.ts#L374)

___

### dispose

▸ **dispose**(): `void`

Deallocate GPUProgram instance and associated WebGL properties.

#### Returns

`void`

#### Defined in

[GPUProgram.ts:464](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPUProgram.ts#L464)
