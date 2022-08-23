[webgl-compute](../README.md) / GPULayer

# Class: GPULayer

## Table of contents

### Properties

- [name](GPULayer.md#name)
- [type](GPULayer.md#type)
- [numComponents](GPULayer.md#numcomponents)
- [filter](GPULayer.md#filter)
- [wrapS](GPULayer.md#wraps)
- [wrapT](GPULayer.md#wrapt)
- [writable](GPULayer.md#writable)
- [numBuffers](GPULayer.md#numbuffers)

### Constructors

- [constructor](GPULayer.md#constructor)

### Accessors

- [bufferIndex](GPULayer.md#bufferindex)
- [currentState](GPULayer.md#currentstate)
- [lastState](GPULayer.md#laststate)
- [clearValue](GPULayer.md#clearvalue)
- [width](GPULayer.md#width)
- [height](GPULayer.md#height)
- [length](GPULayer.md#length)

### Methods

- [incrementBufferIndex](GPULayer.md#incrementbufferindex)
- [getStateAtIndex](GPULayer.md#getstateatindex)
- [setFromArray](GPULayer.md#setfromarray)
- [resize](GPULayer.md#resize)
- [clear](GPULayer.md#clear)
- [is1D](GPULayer.md#is1d)
- [getValues](GPULayer.md#getvalues)
- [savePNG](GPULayer.md#savepng)
- [attachToThreeTexture](GPULayer.md#attachtothreetexture)
- [dispose](GPULayer.md#dispose)
- [clone](GPULayer.md#clone)

## Properties

### name

• `Readonly` **name**: `string`

Name of GPULayer, used for error logging.

___

### type

• `Readonly` **type**: [`GPULayerType`](../README.md#gpulayertype)

Data type represented by GPULayer.

___

### numComponents

• `Readonly` **numComponents**: [`GPULayerNumComponents`](../README.md#gpulayernumcomponents)

Number of RGBA elements represented by each pixel in the GPULayer (1-4).

___

### filter

• `Readonly` **filter**: [`GPULayerFilter`](../README.md#gpulayerfilter)

Interpolation filter for GPULayer, defaults to LINEAR for 2D FLOAT/HALF_FLOAT GPULayers, otherwise defaults to NEAREST.

___

### wrapS

• `Readonly` **wrapS**: [`GPULayerWrap`](../README.md#gpulayerwrap)

Horizontal wrapping style for GPULayer, defaults to CLAMP_TO_EDGE.

___

### wrapT

• `Readonly` **wrapT**: [`GPULayerWrap`](../README.md#gpulayerwrap)

Vertical wrapping style for GPULayer, defaults to CLAMP_TO_EDGE.

___

### writable

• `Readonly` **writable**: `boolean`

Sets GPULayer as readonly or readwrite, defaults to false.

___

### numBuffers

• `Readonly` **numBuffers**: `number`

## Constructors

### constructor

• **new GPULayer**(`composer`, `params`)

Create a GPULayer.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `composer` | [`GPUComposer`](GPUComposer.md) | The current GPUComposer instance. |
| `params` | `Object` | GPULayer parameters. |
| `params.name` | `string` | Name of GPULayer, used for error logging.  * |
| `params.type` | [`GPULayerType`](../README.md#gpulayertype) | Data type represented by GPULayer. |
| `params.numComponents` | [`GPULayerNumComponents`](../README.md#gpulayernumcomponents) | Number of RGBA elements represented by each pixel in the GPULayer (1-4). |
| `params.dimensions` | `number` \| [`number`, `number`] | Dimensions of 1D or 2D GPULayer. |
| `params.array?` | `number`[] \| [`GPULayerArray`](../README.md#gpulayerarray) | Array to initialize GPULayer. |
| `params.filter?` | [`GPULayerFilter`](../README.md#gpulayerfilter) | Interpolation filter for GPULayer, defaults to LINEAR for 2D FLOAT/HALF_FLOAT GPULayers, otherwise defaults to NEAREST. |
| `params.wrapS?` | [`GPULayerWrap`](../README.md#gpulayerwrap) | Horizontal wrapping style for GPULayer, defaults to CLAMP_TO_EDGE. |
| `params.wrapT?` | [`GPULayerWrap`](../README.md#gpulayerwrap) | Vertical wrapping style for GPULayer, defaults to CLAMP_TO_EDGE. |
| `params.writable?` | `boolean` | Sets GPULayer as readonly or readwrite, defaults to false. |
| `params.numBuffers?` | `number` | How may buffers to allocate, defaults to 1.  If you intend to use the current state of this GPULayer as an input to generate a new state, you will need at least 2 buffers. |
| `params.clearValue?` | `number` \| `number`[] | Value to write to GPULayer when GPULayer.clear() is called. |

## Accessors

### bufferIndex

• `get` **bufferIndex**(): `number`

#### Returns

`number`

___

### currentState

• `get` **currentState**(): `WebGLTexture`

#### Returns

`WebGLTexture`

___

### lastState

• `get` **lastState**(): `WebGLTexture`

#### Returns

`WebGLTexture`

___

### clearValue

• `get` **clearValue**(): `number` \| `number`[]

Get the clearValue of the GPULayer.

#### Returns

`number` \| `number`[]

• `set` **clearValue**(`clearValue`): `void`

Set the clearValue of the GPULayer, which is applied during GPULayer.clear().

#### Parameters

| Name | Type |
| :------ | :------ |
| `clearValue` | `number` \| `number`[] |

#### Returns

`void`

___

### width

• `get` **width**(): `number`

The width of the GPULayer array.

#### Returns

`number`

___

### height

• `get` **height**(): `number`

The height of the GPULayer array.

#### Returns

`number`

___

### length

• `get` **length**(): `number`

The length of the GPULayer array (only available to 1D GPULayers).

#### Returns

`number`

## Methods

### incrementBufferIndex

▸ **incrementBufferIndex**(): `void`

#### Returns

`void`

___

### getStateAtIndex

▸ **getStateAtIndex**(`index`): `WebGLTexture`

#### Parameters

| Name | Type |
| :------ | :------ |
| `index` | `number` |

#### Returns

`WebGLTexture`

___

### setFromArray

▸ **setFromArray**(`array`, `applyToAllBuffers?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `array` | `number`[] \| [`GPULayerArray`](../README.md#gpulayerarray) | `undefined` |
| `applyToAllBuffers` | `boolean` | `false` |

#### Returns

`void`

___

### resize

▸ **resize**(`dimensions`, `array?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `dimensions` | `number` \| [`number`, `number`] |
| `array?` | `number`[] \| [`GPULayerArray`](../README.md#gpulayerarray) |

#### Returns

`void`

___

### clear

▸ **clear**(`applyToAllBuffers?`): `void`

Clear all data in GPULayer to GPULayer.clearValue.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `applyToAllBuffers` | `boolean` | `false` | Flag to apply to all buffers of GPULayer, or just the current output buffer. |

#### Returns

`void`

___

### is1D

▸ **is1D**(): `boolean`

Returns whether the GPULayer was inited as a 1D array (rather than 2D).

#### Returns

`boolean`

- true if GPULayer is 1D, else false.

___

### getValues

▸ **getValues**(): [`GPULayerArray`](../README.md#gpulayerarray)

Returns the current values of the GPULayer as a TypedArray.

#### Returns

[`GPULayerArray`](../README.md#gpulayerarray)

- A TypedArray containing current state of GPULayer.

___

### savePNG

▸ **savePNG**(`params`): `void`

Save the current state of this GPULayer to png.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | PNG parameters. |
| `params.filename` | `string` | PNG filename (no extension). |
| `params.dpi?` | `number` | PNG dpi (defaults to 72dpi). |
| `params.multiplier?` | `number` | Multiplier to apply to data before saving PNG (defaults to 255 for FLOAT and HALF_FLOAT types). |
| `params.callback` | (`blob`: `Blob`, `filename`: `string`) => `void` | - |

#### Returns

`void`

___

### attachToThreeTexture

▸ **attachToThreeTexture**(`texture`): `void`

Attach the output buffer of this GPULayer to a Threejs Texture object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `texture` | `Texture` | Threejs texture object. |

#### Returns

`void`

___

### dispose

▸ **dispose**(): `void`

Deallocate GPULayer instance and associated WebGL properties.

#### Returns

`void`

___

### clone

▸ **clone**(`name?`): [`GPULayer`](GPULayer.md)

Create a deep copy of GPULayer with current state copied over.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name?` | `string` | Name of new GPULayer as string. |

#### Returns

[`GPULayer`](GPULayer.md)

- Deep copy of GPULayer.
