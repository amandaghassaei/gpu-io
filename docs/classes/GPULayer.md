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

#### Defined in

[GPULayer.ts:55](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPULayer.ts#L55)

___

### type

• `Readonly` **type**: [`GPULayerType`](../README.md#gpulayertype)

#### Defined in

[GPULayer.ts:56](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPULayer.ts#L56)

___

### numComponents

• `Readonly` **numComponents**: [`GPULayerNumComponents`](../README.md#gpulayernumcomponents)

#### Defined in

[GPULayer.ts:57](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPULayer.ts#L57)

___

### filter

• `Readonly` **filter**: [`GPULayerFilter`](../README.md#gpulayerfilter)

#### Defined in

[GPULayer.ts:58](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPULayer.ts#L58)

___

### wrapS

• `Readonly` **wrapS**: [`GPULayerWrap`](../README.md#gpulayerwrap)

#### Defined in

[GPULayer.ts:59](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPULayer.ts#L59)

___

### wrapT

• `Readonly` **wrapT**: [`GPULayerWrap`](../README.md#gpulayerwrap)

#### Defined in

[GPULayer.ts:60](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPULayer.ts#L60)

___

### writable

• `Readonly` **writable**: `boolean`

#### Defined in

[GPULayer.ts:61](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPULayer.ts#L61)

___

### numBuffers

• `Readonly` **numBuffers**: `number`

#### Defined in

[GPULayer.ts:67](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPULayer.ts#L67)

## Constructors

### constructor

• **new GPULayer**(`composer`, `params`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `composer` | [`GPUComposer`](GPUComposer.md) |
| `params` | `Object` |
| `params.name` | `string` |
| `params.dimensions` | `number` \| [`number`, `number`] |
| `params.type` | [`GPULayerType`](../README.md#gpulayertype) |
| `params.numComponents` | [`GPULayerNumComponents`](../README.md#gpulayernumcomponents) |
| `params.array?` | `number`[] \| [`GPULayerArray`](../README.md#gpulayerarray) |
| `params.filter?` | [`GPULayerFilter`](../README.md#gpulayerfilter) |
| `params.wrapS?` | [`GPULayerWrap`](../README.md#gpulayerwrap) |
| `params.wrapT?` | [`GPULayerWrap`](../README.md#gpulayerwrap) |
| `params.writable?` | `boolean` |
| `params.numBuffers?` | `number` |
| `params.clearValue?` | `number` \| `number`[] |

#### Defined in

[GPULayer.ts:137](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPULayer.ts#L137)

## Accessors

### bufferIndex

• `get` **bufferIndex**(): `number`

#### Returns

`number`

#### Defined in

[GPULayer.ts:424](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPULayer.ts#L424)

___

### currentState

• `get` **currentState**(): `WebGLTexture`

#### Returns

`WebGLTexture`

#### Defined in

[GPULayer.ts:441](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPULayer.ts#L441)

___

### lastState

• `get` **lastState**(): `WebGLTexture`

#### Returns

`WebGLTexture`

#### Defined in

[GPULayer.ts:445](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPULayer.ts#L445)

___

### clearValue

• `get` **clearValue**(): `number` \| `number`[]

Get the clearValue of the GPULayer.

#### Returns

`number` \| `number`[]

#### Defined in

[GPULayer.ts:528](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPULayer.ts#L528)

• `set` **clearValue**(`clearValue`): `void`

Set the clearValue of the GPULayer, which is applied during GPULayer.clear().

#### Parameters

| Name | Type |
| :------ | :------ |
| `clearValue` | `number` \| `number`[] |

#### Returns

`void`

#### Defined in

[GPULayer.ts:517](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPULayer.ts#L517)

___

### width

• `get` **width**(): `number`

The width of the GPULayer array.

#### Returns

`number`

#### Defined in

[GPULayer.ts:599](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPULayer.ts#L599)

___

### height

• `get` **height**(): `number`

The height of the GPULayer array.

#### Returns

`number`

#### Defined in

[GPULayer.ts:606](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPULayer.ts#L606)

___

### length

• `get` **length**(): `number`

The length of the GPULayer array (only available to 1D GPULayers).

#### Returns

`number`

#### Defined in

[GPULayer.ts:613](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPULayer.ts#L613)

## Methods

### incrementBufferIndex

▸ **incrementBufferIndex**(): `void`

#### Returns

`void`

#### Defined in

[GPULayer.ts:428](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPULayer.ts#L428)

___

### getStateAtIndex

▸ **getStateAtIndex**(`index`): `WebGLTexture`

#### Parameters

| Name | Type |
| :------ | :------ |
| `index` | `number` |

#### Returns

`WebGLTexture`

#### Defined in

[GPULayer.ts:433](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPULayer.ts#L433)

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

#### Defined in

[GPULayer.ts:483](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPULayer.ts#L483)

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

#### Defined in

[GPULayer.ts:499](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPULayer.ts#L499)

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

#### Defined in

[GPULayer.ts:538](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPULayer.ts#L538)

___

### is1D

▸ **is1D**(): `boolean`

Returns whether the GPULayer was inited as a 1D array (rather than 2D).

#### Returns

`boolean`

- true if GPULayer is 1D, else false.

#### Defined in

[GPULayer.ts:624](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPULayer.ts#L624)

___

### getValues

▸ **getValues**(): [`GPULayerArray`](../README.md#gpulayerarray)

Returns the current values of the GPULayer as a TypedArray.

#### Returns

[`GPULayerArray`](../README.md#gpulayerarray)

- A TypedArray containing current state of GPULayer.

#### Defined in

[GPULayer.ts:632](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPULayer.ts#L632)

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
| `params.callback` | (`data`: `string` \| `Blob`, `filename?`: `string`) => `void` | - |

#### Returns

`void`

#### Defined in

[GPULayer.ts:771](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPULayer.ts#L771)

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

#### Defined in

[GPULayer.ts:831](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPULayer.ts#L831)

___

### dispose

▸ **dispose**(): `void`

Deallocate GPULayer instance and associated WebGL properties.

#### Returns

`void`

#### Defined in

[GPULayer.ts:874](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPULayer.ts#L874)

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

#### Defined in

[GPULayer.ts:892](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPULayer.ts#L892)
