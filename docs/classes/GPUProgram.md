[gpu-io](../README.md) / GPUProgram

# Class: GPUProgram

## Table of contents

### Properties

- [name](GPUProgram.md#name)
- [\_fragmentShaderSource](GPUProgram.md#_fragmentshadersource)
- [\_samplerUniformsIndices](GPUProgram.md#_sampleruniformsindices)

### Constructors

- [constructor](GPUProgram.md#constructor)

### Methods

- [recompile](GPUProgram.md#recompile)
- [setUniform](GPUProgram.md#setuniform)
- [dispose](GPUProgram.md#dispose)

## Properties

### name

• `Readonly` **name**: `string`

Name of GPUProgram, used for error logging.

___

### \_fragmentShaderSource

• `Protected` **\_fragmentShaderSource**: `string`

___

### \_samplerUniformsIndices

• `Protected` `Readonly` **\_samplerUniformsIndices**: { `name`: `string` ; `inputIndex`: `number` ; `shaderIndex`: `number`  }[] = `[]`

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
| `params.uniforms?` | [`UniformParams`](../README.md#uniformparams)[] | Array of uniforms to initialize with GPUProgram. More uniforms can be added later with GPUProgram.setUniform(). |
| `params.compileTimeConstants?` | [`CompileTimeConstants`](../README.md#compiletimeconstants) | Compile time #define constants to include with fragment shader. |

## Methods

### recompile

▸ **recompile**(`compileTimeConstants`): `void`

Force compilation of GPUProgram with new compileTimeConstants.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `compileTimeConstants` | [`CompileTimeConstants`](../README.md#compiletimeconstants) | Compile time #define constants to include with fragment shader. |

#### Returns

`void`

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

___

### dispose

▸ **dispose**(): `void`

Deallocate GPUProgram instance and associated WebGL properties.

#### Returns

`void`
