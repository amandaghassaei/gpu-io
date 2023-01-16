[gpu-io](../README.md) / GPULayer

# Class: GPULayer

## Table of contents

### Properties

- [name](GPULayer.md#name)
- [type](GPULayer.md#type)
- [numComponents](GPULayer.md#numcomponents)
- [filter](GPULayer.md#filter)
- [wrapX](GPULayer.md#wrapx)
- [wrapY](GPULayer.md#wrapy)
- [numBuffers](GPULayer.md#numbuffers)

### Methods

- [initFromImageURL](GPULayer.md#initfromimageurl)
- [is1D](GPULayer.md#is1d)
- [is2D](GPULayer.md#is2d)
- [incrementBufferIndex](GPULayer.md#incrementbufferindex)
- [decrementBufferIndex](GPULayer.md#decrementbufferindex)
- [getStateAtIndex](GPULayer.md#getstateatindex)
- [setFromArray](GPULayer.md#setfromarray)
- [resize](GPULayer.md#resize)
- [clear](GPULayer.md#clear)
- [getValues](GPULayer.md#getvalues)
- [getValuesAsync](GPULayer.md#getvaluesasync)
- [getImage](GPULayer.md#getimage)
- [savePNG](GPULayer.md#savepng)
- [attachToThreeTexture](GPULayer.md#attachtothreetexture)
- [clone](GPULayer.md#clone)
- [dispose](GPULayer.md#dispose)

### Constructors

- [constructor](GPULayer.md#constructor)

### Accessors

- [width](GPULayer.md#width)
- [height](GPULayer.md#height)
- [length](GPULayer.md#length)
- [bufferIndex](GPULayer.md#bufferindex)
- [currentState](GPULayer.md#currentstate)
- [lastState](GPULayer.md#laststate)
- [clearValue](GPULayer.md#clearvalue)

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

### wrapX

• `Readonly` **wrapX**: [`GPULayerWrap`](../README.md#gpulayerwrap)

Horizontal wrapping style for GPULayer, defaults to CLAMP_TO_EDGE.

___

### wrapY

• `Readonly` **wrapY**: [`GPULayerWrap`](../README.md#gpulayerwrap)

Vertical wrapping style for GPULayer, defaults to CLAMP_TO_EDGE.

___

### numBuffers

• `Readonly` **numBuffers**: `number`

## Methods

### initFromImageURL

▸ `Static` **initFromImageURL**(`composer`, `params`): `Promise`<[`GPULayer`](GPULayer.md)\>

Create a GPULayer from an image url.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `composer` | [`GPUComposer`](GPUComposer.md) | The current GPUComposer instance. |
| `params` | `Object` | GPULayer parameters. |
| `params.name` | `string` | Name of GPULayer, used for error logging. |
| `params.url` | `string` | URL of the image source. |
| `params.type?` | [`ImageType`](../README.md#imagetype) | Data type represented by GPULayer. |
| `params.format?` | [`ImageFormat`](../README.md#imageformat) | Image format, either RGB or RGBA. |
| `params.filter?` | [`GPULayerFilter`](../README.md#gpulayerfilter) | Interpolation filter for GPULayer, defaults to LINEAR for FLOAT/HALF_FLOAT Images, otherwise defaults to NEAREST. |
| `params.wrapX?` | [`GPULayerWrap`](../README.md#gpulayerwrap) | Horizontal wrapping style for GPULayer, defaults to CLAMP_TO_EDGE. |
| `params.wrapY?` | [`GPULayerWrap`](../README.md#gpulayerwrap) | Vertical wrapping style for GPULayer, defaults to CLAMP_TO_EDGE. |
| `params.clearValue?` | `number` \| `number`[] | Value to write to GPULayer when GPULayer.clear() is called. |

#### Returns

`Promise`<[`GPULayer`](GPULayer.md)\>

___

### is1D

▸ **is1D**(): `boolean`

Returns whether the GPULayer was inited as a 1D array (rather than 2D).

#### Returns

`boolean`

- true if GPULayer is 1D, else false.

___

### is2D

▸ **is2D**(): `boolean`

Returns whether the GPULayer was inited as a 2D array (rather than 1D).

#### Returns

`boolean`

- true if GPULayer is 2D, else false.

___

### incrementBufferIndex

▸ **incrementBufferIndex**(): `void`

Increment buffer index by 1.

#### Returns

`void`

___

### decrementBufferIndex

▸ **decrementBufferIndex**(): `void`

Decrement buffer index by 1.

#### Returns

`void`

___

### getStateAtIndex

▸ **getStateAtIndex**(`index`): [`GPULayerState`](../README.md#gpulayerstate)

Get the state at a specified index as a GPULayerState object.

#### Parameters

| Name | Type |
| :------ | :------ |
| `index` | `number` |

#### Returns

[`GPULayerState`](../README.md#gpulayerstate)

___

### setFromArray

▸ **setFromArray**(`array`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `array` | `number`[] \| [`GPULayerArray`](../README.md#gpulayerarray) |

#### Returns

`void`

___

### resize

▸ **resize**(`dimensions`, `arrayOrImage?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `dimensions` | `number` \| `number`[] |
| `arrayOrImage?` | `number`[] \| `HTMLImageElement` \| [`GPULayerArray`](../README.md#gpulayerarray) |

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

### getValues

▸ **getValues**(): [`GPULayerArray`](../README.md#gpulayerarray)

Returns the current values of the GPULayer as a TypedArray.

#### Returns

[`GPULayerArray`](../README.md#gpulayerarray)

- A TypedArray containing current state of GPULayer.

___

### getValuesAsync

▸ **getValuesAsync**(): `Promise`<[`GPULayerArray`](../README.md#gpulayerarray)\>

Non-blocking function to return the current values of the GPULayer as a TypedArray.
This only works for WebGL2 contexts, will fall back to getValues() if WebGL1 context.

#### Returns

`Promise`<[`GPULayerArray`](../README.md#gpulayerarray)\>

- A TypedArray containing current state of GPULayer.

___

### getImage

▸ **getImage**(`params?`): `HTMLImageElement`

Get the current state of this GPULayer as an Image.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params?` | `Object` | Image parameters. |
| `params.multiplier?` | `number` | Multiplier to apply to data (defaults to 255 for FLOAT and HALF_FLOAT types, else 1). |

#### Returns

`HTMLImageElement`

___

### savePNG

▸ **savePNG**(`params?`): `void`

Save the current state of this GPULayer to png.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | PNG parameters. |
| `params.filename?` | `string` | PNG filename (no extension, defaults to the name of the GPULayer). |
| `params.dpi?` | `number` | PNG dpi (defaults to 72dpi). |
| `params.multiplier?` | `number` | Multiplier to apply to data before saving PNG (defaults to 255 for FLOAT and HALF_FLOAT types, else 1). |
| `params.callback?` | (`blob`: `Blob`, `filename`: `string`) => `void` | Optional callback when Blob is ready, default behavior saves the PNG using file-saver. |

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

___

### dispose

▸ **dispose**(): `void`

Deallocate GPULayer instance and associated WebGL properties.

#### Returns

`void`

## Constructors

### constructor

• **new GPULayer**(`composer`, `params`)

Create a GPULayer.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `composer` | [`GPUComposer`](GPUComposer.md) | The current GPUComposer instance. |
| `params` | `Object` | GPULayer parameters. |
| `params.name` | `string` | Name of GPULayer, used for error logging. |
| `params.type` | [`GPULayerType`](../README.md#gpulayertype) | Data type represented by GPULayer. |
| `params.numComponents` | [`GPULayerNumComponents`](../README.md#gpulayernumcomponents) | Number of RGBA elements represented by each pixel in the GPULayer (1-4). |
| `params.dimensions` | `number` \| `number`[] | Dimensions of 1D or 2D GPULayer. |
| `params.array?` | `number`[] \| [`GPULayerArray`](../README.md#gpulayerarray) | Array to initialize GPULayer. |
| `params.filter?` | [`GPULayerFilter`](../README.md#gpulayerfilter) | Interpolation filter for GPULayer, defaults to LINEAR for 2D FLOAT/HALF_FLOAT GPULayers, otherwise defaults to NEAREST. |
| `params.wrapX?` | [`GPULayerWrap`](../README.md#gpulayerwrap) | Horizontal wrapping style for GPULayer, defaults to CLAMP_TO_EDGE. |
| `params.wrapY?` | [`GPULayerWrap`](../README.md#gpulayerwrap) | Vertical wrapping style for GPULayer, defaults to CLAMP_TO_EDGE. |
| `params.numBuffers?` | `number` | How may buffers to allocate, defaults to 1. If you intend to use the current state of this GPULayer as an input to generate a new state, you will need at least 2 buffers. |
| `params.clearValue?` | `number` \| `number`[] | Value to write to GPULayer when GPULayer.clear() is called. |

## Accessors

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

___

### bufferIndex

• `get` **bufferIndex**(): `number`

Get buffer index of the current state.

#### Returns

`number`

___

### currentState

• `get` **currentState**(): [`GPULayerState`](../README.md#gpulayerstate)

Get the current state as a GPULayerState object.

#### Returns

[`GPULayerState`](../README.md#gpulayerstate)

___

### lastState

• `get` **lastState**(): [`GPULayerState`](../README.md#gpulayerstate)

Get the previous state as a GPULayerState object (only available for GPULayers with numBuffers > 1).

#### Returns

[`GPULayerState`](../README.md#gpulayerstate)

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
