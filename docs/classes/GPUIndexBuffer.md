[gpu-io](../README.md) / GPUIndexBuffer

# Class: GPUIndexBuffer

## Table of contents

### Properties

- [buffer](GPUIndexBuffer.md#buffer)
- [glType](GPUIndexBuffer.md#gltype)
- [count](GPUIndexBuffer.md#count)

### Constructors

- [constructor](GPUIndexBuffer.md#constructor)

### Methods

- [dispose](GPUIndexBuffer.md#dispose)

## Properties

### buffer

• `Readonly` **buffer**: `WebGLBuffer`

GL buffer.

___

### glType

• `Readonly` **glType**: `number`

GL type.

___

### count

• `Readonly` **count**: `number`

Index buffer count.

## Constructors

### constructor

• **new GPUIndexBuffer**(`composer`, `params`)

Init a GPUIndexBuffer to use with GPUComposer.drawLayerAsMesh().

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `composer` | [`GPUComposer`](GPUComposer.md) | The current GPUComposer instance. |
| `params` | `Object` | GPUIndexBuffer parameters. |
| `params.indices` | `number`[] \| `Uint8Array` \| `Uint16Array` \| `Uint32Array` | A 1D array containing indexed geometry. For a mesh, this would be an array of triangle indices. |
| `params.name?` | `string` | Name of GPUIndexBuffer, used for error logging. |

## Methods

### dispose

▸ **dispose**(): `void`

Deallocate GPUIndexBuffer instance and associated WebGL properties.

#### Returns

`void`
