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
- [glInternalFormat](GPULayer.md#glinternalformat)
- [glFormat](GPULayer.md#glformat)
- [internalType](GPULayer.md#internaltype)
- [glType](GPULayer.md#gltype)
- [glNumChannels](GPULayer.md#glnumchannels)
- [internalFilter](GPULayer.md#internalfilter)
- [glFilter](GPULayer.md#glfilter)
- [internalWrapS](GPULayer.md#internalwraps)
- [glWrapS](GPULayer.md#glwraps)
- [internalWrapT](GPULayer.md#internalwrapt)
- [glWrapT](GPULayer.md#glwrapt)

### Constructors

- [constructor](GPULayer.md#constructor)

### Methods

- [\_usingTextureOverrideForCurrentBuffer](GPULayer.md#_usingtextureoverrideforcurrentbuffer)
- [incrementBufferIndex](GPULayer.md#incrementbufferindex)
- [getStateAtIndex](GPULayer.md#getstateatindex)
- [\_bindOutputBuffer](GPULayer.md#_bindoutputbuffer)
- [\_bindOutputBufferForWrite](GPULayer.md#_bindoutputbufferforwrite)
- [setFromArray](GPULayer.md#setfromarray)
- [resize](GPULayer.md#resize)
- [clear](GPULayer.md#clear)
- [is1D](GPULayer.md#is1d)
- [getValues](GPULayer.md#getvalues)
- [savePNG](GPULayer.md#savepng)
- [attachToThreeTexture](GPULayer.md#attachtothreetexture)
- [dispose](GPULayer.md#dispose)
- [clone](GPULayer.md#clone)

### Accessors

- [bufferIndex](GPULayer.md#bufferindex)
- [currentState](GPULayer.md#currentstate)
- [lastState](GPULayer.md#laststate)
- [clearValue](GPULayer.md#clearvalue)
- [width](GPULayer.md#width)
- [height](GPULayer.md#height)
- [length](GPULayer.md#length)

## Properties

### name

• `Readonly` **name**: `string`

#### Defined in

[GPULayer.ts:55](https://github.com/amandaghassaei/webgl-compute/blob/d028d52/src/GPULayer.ts#L55)

___

### type

• `Readonly` **type**: [`GPULayerType`](../README.md#gpulayertype)

#### Defined in

[GPULayer.ts:56](https://github.com/amandaghassaei/webgl-compute/blob/d028d52/src/GPULayer.ts#L56)

___

### numComponents

• `Readonly` **numComponents**: [`GPULayerNumComponents`](../README.md#gpulayernumcomponents)

#### Defined in

[GPULayer.ts:57](https://github.com/amandaghassaei/webgl-compute/blob/d028d52/src/GPULayer.ts#L57)

___

### filter

• `Readonly` **filter**: [`GPULayerFilter`](../README.md#gpulayerfilter)

#### Defined in

[GPULayer.ts:58](https://github.com/amandaghassaei/webgl-compute/blob/d028d52/src/GPULayer.ts#L58)

___

### wrapS

• `Readonly` **wrapS**: [`GPULayerWrap`](../README.md#gpulayerwrap)

#### Defined in

[GPULayer.ts:59](https://github.com/amandaghassaei/webgl-compute/blob/d028d52/src/GPULayer.ts#L59)

___

### wrapT

• `Readonly` **wrapT**: [`GPULayerWrap`](../README.md#gpulayerwrap)

#### Defined in

[GPULayer.ts:60](https://github.com/amandaghassaei/webgl-compute/blob/d028d52/src/GPULayer.ts#L60)

___

### writable

• `Readonly` **writable**: `boolean`

#### Defined in

[GPULayer.ts:61](https://github.com/amandaghassaei/webgl-compute/blob/d028d52/src/GPULayer.ts#L61)

___

### numBuffers

• `Readonly` **numBuffers**: `number`

#### Defined in

[GPULayer.ts:67](https://github.com/amandaghassaei/webgl-compute/blob/d028d52/src/GPULayer.ts#L67)

___

### glInternalFormat

• `Readonly` **glInternalFormat**: `number`

#### Defined in

[GPULayer.ts:82](https://github.com/amandaghassaei/webgl-compute/blob/d028d52/src/GPULayer.ts#L82)

___

### glFormat

• `Readonly` **glFormat**: `number`

#### Defined in

[GPULayer.ts:83](https://github.com/amandaghassaei/webgl-compute/blob/d028d52/src/GPULayer.ts#L83)

___

### internalType

• `Readonly` **internalType**: [`GPULayerType`](../README.md#gpulayertype)

#### Defined in

[GPULayer.ts:85](https://github.com/amandaghassaei/webgl-compute/blob/d028d52/src/GPULayer.ts#L85)

___

### glType

• `Readonly` **glType**: `number`

#### Defined in

[GPULayer.ts:86](https://github.com/amandaghassaei/webgl-compute/blob/d028d52/src/GPULayer.ts#L86)

___

### glNumChannels

• `Readonly` **glNumChannels**: `number`

#### Defined in

[GPULayer.ts:89](https://github.com/amandaghassaei/webgl-compute/blob/d028d52/src/GPULayer.ts#L89)

___

### internalFilter

• `Readonly` **internalFilter**: [`GPULayerFilter`](../README.md#gpulayerfilter)

#### Defined in

[GPULayer.ts:91](https://github.com/amandaghassaei/webgl-compute/blob/d028d52/src/GPULayer.ts#L91)

___

### glFilter

• `Readonly` **glFilter**: `number`

#### Defined in

[GPULayer.ts:92](https://github.com/amandaghassaei/webgl-compute/blob/d028d52/src/GPULayer.ts#L92)

___

### internalWrapS

• `Readonly` **internalWrapS**: [`GPULayerWrap`](../README.md#gpulayerwrap)

#### Defined in

[GPULayer.ts:94](https://github.com/amandaghassaei/webgl-compute/blob/d028d52/src/GPULayer.ts#L94)

___

### glWrapS

• `Readonly` **glWrapS**: `number`

#### Defined in

[GPULayer.ts:95](https://github.com/amandaghassaei/webgl-compute/blob/d028d52/src/GPULayer.ts#L95)

___

### internalWrapT

• `Readonly` **internalWrapT**: [`GPULayerWrap`](../README.md#gpulayerwrap)

#### Defined in

[GPULayer.ts:97](https://github.com/amandaghassaei/webgl-compute/blob/d028d52/src/GPULayer.ts#L97)

___

### glWrapT

• `Readonly` **glWrapT**: `number`

#### Defined in

[GPULayer.ts:98](https://github.com/amandaghassaei/webgl-compute/blob/d028d52/src/GPULayer.ts#L98)

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

[GPULayer.ts:104](https://github.com/amandaghassaei/webgl-compute/blob/d028d52/src/GPULayer.ts#L104)

## Methods

### \_usingTextureOverrideForCurrentBuffer

▸ **_usingTextureOverrideForCurrentBuffer**(): `undefined` \| `WebGLTexture`

#### Returns

`undefined` \| `WebGLTexture`

#### Defined in

[GPULayer.ts:249](https://github.com/amandaghassaei/webgl-compute/blob/d028d52/src/GPULayer.ts#L249)

___

### incrementBufferIndex

▸ **incrementBufferIndex**(): `void`

#### Returns

`void`

#### Defined in

[GPULayer.ts:388](https://github.com/amandaghassaei/webgl-compute/blob/d028d52/src/GPULayer.ts#L388)

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

[GPULayer.ts:393](https://github.com/amandaghassaei/webgl-compute/blob/d028d52/src/GPULayer.ts#L393)

___

### \_bindOutputBuffer

▸ **_bindOutputBuffer**(): `void`

#### Returns

`void`

#### Defined in

[GPULayer.ts:413](https://github.com/amandaghassaei/webgl-compute/blob/d028d52/src/GPULayer.ts#L413)

___

### \_bindOutputBufferForWrite

▸ **_bindOutputBufferForWrite**(`incrementBufferIndex`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `incrementBufferIndex` | `boolean` |

#### Returns

`void`

#### Defined in

[GPULayer.ts:423](https://github.com/amandaghassaei/webgl-compute/blob/d028d52/src/GPULayer.ts#L423)

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

[GPULayer.ts:437](https://github.com/amandaghassaei/webgl-compute/blob/d028d52/src/GPULayer.ts#L437)

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

[GPULayer.ts:453](https://github.com/amandaghassaei/webgl-compute/blob/d028d52/src/GPULayer.ts#L453)

___

### clear

▸ **clear**(`applyToAllBuffers?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `applyToAllBuffers` | `boolean` | `false` |

#### Returns

`void`

#### Defined in

[GPULayer.ts:480](https://github.com/amandaghassaei/webgl-compute/blob/d028d52/src/GPULayer.ts#L480)

___

### is1D

▸ **is1D**(): `boolean`

#### Returns

`boolean`

#### Defined in

[GPULayer.ts:553](https://github.com/amandaghassaei/webgl-compute/blob/d028d52/src/GPULayer.ts#L553)

___

### getValues

▸ **getValues**(): [`GPULayerArray`](../README.md#gpulayerarray)

#### Returns

[`GPULayerArray`](../README.md#gpulayerarray)

#### Defined in

[GPULayer.ts:557](https://github.com/amandaghassaei/webgl-compute/blob/d028d52/src/GPULayer.ts#L557)

___

### savePNG

▸ **savePNG**(`params`): `void`

Save the current state of this GPULayer to png.

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Object` |
| `params.filename` | `string` |
| `params.dpi?` | `number` |
| `params.multiplier?` | `number` |
| `params.callback` | (`data`: `string` \| `Blob`, `filename?`: `string`) => `void` |

#### Returns

`void`

#### Defined in

[GPULayer.ts:692](https://github.com/amandaghassaei/webgl-compute/blob/d028d52/src/GPULayer.ts#L692)

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

[GPULayer.ts:752](https://github.com/amandaghassaei/webgl-compute/blob/d028d52/src/GPULayer.ts#L752)

___

### dispose

▸ **dispose**(): `void`

Deallocate GPULayer instance and associated WebGL properties.

#### Returns

`void`

#### Defined in

[GPULayer.ts:795](https://github.com/amandaghassaei/webgl-compute/blob/d028d52/src/GPULayer.ts#L795)

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

- Deep copy.

#### Defined in

[GPULayer.ts:813](https://github.com/amandaghassaei/webgl-compute/blob/d028d52/src/GPULayer.ts#L813)

## Accessors

### bufferIndex

• `get` **bufferIndex**(): `number`

#### Returns

`number`

#### Defined in

[GPULayer.ts:384](https://github.com/amandaghassaei/webgl-compute/blob/d028d52/src/GPULayer.ts#L384)

___

### currentState

• `get` **currentState**(): `WebGLTexture`

#### Returns

`WebGLTexture`

#### Defined in

[GPULayer.ts:401](https://github.com/amandaghassaei/webgl-compute/blob/d028d52/src/GPULayer.ts#L401)

___

### lastState

• `get` **lastState**(): `WebGLTexture`

#### Returns

`WebGLTexture`

#### Defined in

[GPULayer.ts:405](https://github.com/amandaghassaei/webgl-compute/blob/d028d52/src/GPULayer.ts#L405)

___

### clearValue

• `get` **clearValue**(): `number` \| `number`[]

#### Returns

`number` \| `number`[]

#### Defined in

[GPULayer.ts:468](https://github.com/amandaghassaei/webgl-compute/blob/d028d52/src/GPULayer.ts#L468)

• `set` **clearValue**(`clearValue`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `clearValue` | `number` \| `number`[] |

#### Returns

`void`

#### Defined in

[GPULayer.ts:472](https://github.com/amandaghassaei/webgl-compute/blob/d028d52/src/GPULayer.ts#L472)

___

### width

• `get` **width**(): `number`

#### Returns

`number`

#### Defined in

[GPULayer.ts:538](https://github.com/amandaghassaei/webgl-compute/blob/d028d52/src/GPULayer.ts#L538)

___

### height

• `get` **height**(): `number`

#### Returns

`number`

#### Defined in

[GPULayer.ts:542](https://github.com/amandaghassaei/webgl-compute/blob/d028d52/src/GPULayer.ts#L542)

___

### length

• `get` **length**(): `number`

#### Returns

`number`

#### Defined in

[GPULayer.ts:546](https://github.com/amandaghassaei/webgl-compute/blob/d028d52/src/GPULayer.ts#L546)
