[gpu-io](../README.md) / GPUProgram

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
| `params.uniforms?` | [`UniformParams`](../README.md#uniformparams)[] | Array of uniforms to initialize with GPUProgram.  More uniforms can be added later with GPUProgram.setUniform(). |
| `params.defines?` | [`CompileTimeVars`](../README.md#compiletimevars) | Compile-time #define variables to include with fragment shader. |

## Methods

### setUniform

▸ **setUniform**(`name`, `value`, `type?`): `void`

Set fragment shader uniform for GPUProgram.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | Uniform name as it appears in fragment shader. |
| `value` | [`UniformValue`](../README.md#uniformvalue) | Uniform value. |
| `type?` | [`UniformType`](../README.md#uniformtype) | Uniform type (this only needs to be set once). |

#### Returns

`void`

___

### dispose

▸ **dispose**(): `void`

Deallocate GPUProgram instance and associated WebGL properties.

#### Returns

`void`
