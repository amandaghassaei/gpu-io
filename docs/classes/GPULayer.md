[webgl-compute](../README.md) / [Exports](../modules.md) / GPULayer

# Class: GPULayer

## Table of contents

### Constructors

- [constructor](GPULayer.md#constructor)

### Properties

- [\_bufferIndex](GPULayer.md#_bufferindex)
- [\_clearValue](GPULayer.md#_clearvalue)
- [\_height](GPULayer.md#_height)
- [\_length](GPULayer.md#_length)
- [\_width](GPULayer.md#_width)
- [buffers](GPULayer.md#buffers)
- [composer](GPULayer.md#composer)
- [filter](GPULayer.md#filter)
- [glFilter](GPULayer.md#glfilter)
- [glFormat](GPULayer.md#glformat)
- [glInternalFormat](GPULayer.md#glinternalformat)
- [glNumChannels](GPULayer.md#glnumchannels)
- [glType](GPULayer.md#gltype)
- [glWrapS](GPULayer.md#glwraps)
- [glWrapT](GPULayer.md#glwrapt)
- [internalFilter](GPULayer.md#internalfilter)
- [internalType](GPULayer.md#internaltype)
- [internalWrapS](GPULayer.md#internalwraps)
- [internalWrapT](GPULayer.md#internalwrapt)
- [name](GPULayer.md#name)
- [numBuffers](GPULayer.md#numbuffers)
- [numComponents](GPULayer.md#numcomponents)
- [textureOverrides](GPULayer.md#textureoverrides)
- [type](GPULayer.md#type)
- [wrapS](GPULayer.md#wraps)
- [wrapT](GPULayer.md#wrapt)
- [writable](GPULayer.md#writable)

### Accessors

- [bufferIndex](GPULayer.md#bufferindex)
- [clearValue](GPULayer.md#clearvalue)
- [currentState](GPULayer.md#currentstate)
- [height](GPULayer.md#height)
- [lastState](GPULayer.md#laststate)
- [length](GPULayer.md#length)
- [width](GPULayer.md#width)

### Methods

- [\_bindOutputBuffer](GPULayer.md#_bindoutputbuffer)
- [\_bindOutputBufferForWrite](GPULayer.md#_bindoutputbufferforwrite)
- [\_usingTextureOverrideForCurrentBuffer](GPULayer.md#_usingtextureoverrideforcurrentbuffer)
- [attachToThreeTexture](GPULayer.md#attachtothreetexture)
- [clear](GPULayer.md#clear)
- [clone](GPULayer.md#clone)
- [destroyBuffers](GPULayer.md#destroybuffers)
- [dispose](GPULayer.md#dispose)
- [getStateAtIndex](GPULayer.md#getstateatindex)
- [getValues](GPULayer.md#getvalues)
- [incrementBufferIndex](GPULayer.md#incrementbufferindex)
- [initBuffers](GPULayer.md#initbuffers)
- [is1D](GPULayer.md#is1d)
- [resize](GPULayer.md#resize)
- [savePNG](GPULayer.md#savepng)
- [setFromArray](GPULayer.md#setfromarray)

## Constructors

### constructor

• **new GPULayer**(`composer`, `params`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `composer` | [`GPUComposer`](GPUComposer.md) |
| `params` | `Object` |
| `params.array?` | `number`[] \| [`GPULayerArray`](../modules.md#gpulayerarray) |
| `params.clearValue?` | `number` \| `number`[] |
| `params.dimensions` | `number` \| [`number`, `number`] |
| `params.filter?` | [`GPULayerFilter`](../modules.md#gpulayerfilter) |
| `params.name` | `string` |
| `params.numBuffers?` | `number` |
| `params.numComponents` | [`GPULayerNumComponents`](../modules.md#gpulayernumcomponents) |
| `params.type` | [`GPULayerType`](../modules.md#gpulayertype) |
| `params.wrapS?` | [`GPULayerWrap`](../modules.md#gpulayerwrap) |
| `params.wrapT?` | [`GPULayerWrap`](../modules.md#gpulayerwrap) |
| `params.writable?` | `boolean` |

#### Defined in

[GPULayer.ts:104](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPULayer.ts#L104)

## Properties

### \_bufferIndex

• `Private` **\_bufferIndex**: `number` = `0`

#### Defined in

[GPULayer.ts:66](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPULayer.ts#L66)

___

### \_clearValue

• `Private` **\_clearValue**: `number` \| `number`[] = `0`

#### Defined in

[GPULayer.ts:62](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPULayer.ts#L62)

___

### \_height

• `Private` **\_height**: `number`

#### Defined in

[GPULayer.ts:73](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPULayer.ts#L73)

___

### \_length

• `Private` `Optional` **\_length**: `number`

#### Defined in

[GPULayer.ts:71](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPULayer.ts#L71)

___

### \_width

• `Private` **\_width**: `number`

#### Defined in

[GPULayer.ts:72](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPULayer.ts#L72)

___

### buffers

• `Private` `Readonly` **buffers**: [`GPULayerBuffer`](../modules.md#gpulayerbuffer)[] = `[]`

#### Defined in

[GPULayer.ts:68](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPULayer.ts#L68)

___

### composer

• `Private` `Readonly` **composer**: [`GPUComposer`](GPUComposer.md)

#### Defined in

[GPULayer.ts:53](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPULayer.ts#L53)

___

### filter

• `Readonly` **filter**: [`GPULayerFilter`](../modules.md#gpulayerfilter)

#### Defined in

[GPULayer.ts:58](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPULayer.ts#L58)

___

### glFilter

• `Readonly` **glFilter**: `number`

#### Defined in

[GPULayer.ts:92](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPULayer.ts#L92)

___

### glFormat

• `Readonly` **glFormat**: `number`

#### Defined in

[GPULayer.ts:83](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPULayer.ts#L83)

___

### glInternalFormat

• `Readonly` **glInternalFormat**: `number`

#### Defined in

[GPULayer.ts:82](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPULayer.ts#L82)

___

### glNumChannels

• `Readonly` **glNumChannels**: `number`

#### Defined in

[GPULayer.ts:89](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPULayer.ts#L89)

___

### glType

• `Readonly` **glType**: `number`

#### Defined in

[GPULayer.ts:86](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPULayer.ts#L86)

___

### glWrapS

• `Readonly` **glWrapS**: `number`

#### Defined in

[GPULayer.ts:95](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPULayer.ts#L95)

___

### glWrapT

• `Readonly` **glWrapT**: `number`

#### Defined in

[GPULayer.ts:98](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPULayer.ts#L98)

___

### internalFilter

• `Readonly` **internalFilter**: [`GPULayerFilter`](../modules.md#gpulayerfilter)

#### Defined in

[GPULayer.ts:91](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPULayer.ts#L91)

___

### internalType

• `Readonly` **internalType**: [`GPULayerType`](../modules.md#gpulayertype)

#### Defined in

[GPULayer.ts:85](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPULayer.ts#L85)

___

### internalWrapS

• `Readonly` **internalWrapS**: [`GPULayerWrap`](../modules.md#gpulayerwrap)

#### Defined in

[GPULayer.ts:94](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPULayer.ts#L94)

___

### internalWrapT

• `Readonly` **internalWrapT**: [`GPULayerWrap`](../modules.md#gpulayerwrap)

#### Defined in

[GPULayer.ts:97](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPULayer.ts#L97)

___

### name

• `Readonly` **name**: `string`

#### Defined in

[GPULayer.ts:55](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPULayer.ts#L55)

___

### numBuffers

• `Readonly` **numBuffers**: `number`

#### Defined in

[GPULayer.ts:67](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPULayer.ts#L67)

___

### numComponents

• `Readonly` **numComponents**: [`GPULayerNumComponents`](../modules.md#gpulayernumcomponents)

#### Defined in

[GPULayer.ts:57](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPULayer.ts#L57)

___

### textureOverrides

• `Private` `Optional` **textureOverrides**: (`undefined` \| `WebGLTexture`)[]

#### Defined in

[GPULayer.ts:102](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPULayer.ts#L102)

___

### type

• `Readonly` **type**: [`GPULayerType`](../modules.md#gpulayertype)

#### Defined in

[GPULayer.ts:56](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPULayer.ts#L56)

___

### wrapS

• `Readonly` **wrapS**: [`GPULayerWrap`](../modules.md#gpulayerwrap)

#### Defined in

[GPULayer.ts:59](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPULayer.ts#L59)

___

### wrapT

• `Readonly` **wrapT**: [`GPULayerWrap`](../modules.md#gpulayerwrap)

#### Defined in

[GPULayer.ts:60](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPULayer.ts#L60)

___

### writable

• `Readonly` **writable**: `boolean`

#### Defined in

[GPULayer.ts:61](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPULayer.ts#L61)

## Accessors

### bufferIndex

• `get` **bufferIndex**(): `number`

#### Returns

`number`

#### Defined in

[GPULayer.ts:384](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPULayer.ts#L384)

___

### clearValue

• `get` **clearValue**(): `number` \| `number`[]

#### Returns

`number` \| `number`[]

#### Defined in

[GPULayer.ts:468](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPULayer.ts#L468)

• `set` **clearValue**(`clearValue`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `clearValue` | `number` \| `number`[] |

#### Returns

`void`

#### Defined in

[GPULayer.ts:472](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPULayer.ts#L472)

___

### currentState

• `get` **currentState**(): `WebGLTexture`

#### Returns

`WebGLTexture`

#### Defined in

[GPULayer.ts:401](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPULayer.ts#L401)

___

### height

• `get` **height**(): `number`

#### Returns

`number`

#### Defined in

[GPULayer.ts:542](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPULayer.ts#L542)

___

### lastState

• `get` **lastState**(): `WebGLTexture`

#### Returns

`WebGLTexture`

#### Defined in

[GPULayer.ts:405](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPULayer.ts#L405)

___

### length

• `get` **length**(): `number`

#### Returns

`number`

#### Defined in

[GPULayer.ts:546](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPULayer.ts#L546)

___

### width

• `get` **width**(): `number`

#### Returns

`number`

#### Defined in

[GPULayer.ts:538](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPULayer.ts#L538)

## Methods

### \_bindOutputBuffer

▸ **_bindOutputBuffer**(): `void`

#### Returns

`void`

#### Defined in

[GPULayer.ts:413](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPULayer.ts#L413)

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

[GPULayer.ts:423](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPULayer.ts#L423)

___

### \_usingTextureOverrideForCurrentBuffer

▸ **_usingTextureOverrideForCurrentBuffer**(): `undefined` \| `WebGLTexture`

#### Returns

`undefined` \| `WebGLTexture`

#### Defined in

[GPULayer.ts:249](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPULayer.ts#L249)

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

[GPULayer.ts:752](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPULayer.ts#L752)

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

[GPULayer.ts:480](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPULayer.ts#L480)

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

[GPULayer.ts:813](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPULayer.ts#L813)

___

### destroyBuffers

▸ `Private` **destroyBuffers**(): `void`

Delete this GPULayer's framebuffers and textures.

#### Returns

`void`

#### Defined in

[GPULayer.ts:772](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPULayer.ts#L772)

___

### dispose

▸ **dispose**(): `void`

Deallocate GPULayer instance and associated WebGL properties.

#### Returns

`void`

#### Defined in

[GPULayer.ts:795](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPULayer.ts#L795)

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

[GPULayer.ts:393](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPULayer.ts#L393)

___

### getValues

▸ **getValues**(): [`GPULayerArray`](../modules.md#gpulayerarray)

#### Returns

[`GPULayerArray`](../modules.md#gpulayerarray)

#### Defined in

[GPULayer.ts:557](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPULayer.ts#L557)

___

### incrementBufferIndex

▸ **incrementBufferIndex**(): `void`

#### Returns

`void`

#### Defined in

[GPULayer.ts:388](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPULayer.ts#L388)

___

### initBuffers

▸ `Private` **initBuffers**(`array?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `array?` | `number`[] \| [`GPULayerArray`](../modules.md#gpulayerarray) |

#### Returns

`void`

#### Defined in

[GPULayer.ts:313](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPULayer.ts#L313)

___

### is1D

▸ **is1D**(): `boolean`

#### Returns

`boolean`

#### Defined in

[GPULayer.ts:553](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPULayer.ts#L553)

___

### resize

▸ **resize**(`dimensions`, `array?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `dimensions` | `number` \| [`number`, `number`] |
| `array?` | `number`[] \| [`GPULayerArray`](../modules.md#gpulayerarray) |

#### Returns

`void`

#### Defined in

[GPULayer.ts:453](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPULayer.ts#L453)

___

### savePNG

▸ **savePNG**(`params`): `void`

Save the current state of this GPULayer to png.

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Object` |
| `params.callback` | (`data`: `string` \| `Blob`, `filename?`: `string`) => `void` |
| `params.dpi?` | `number` |
| `params.filename` | `string` |
| `params.multiplier?` | `number` |

#### Returns

`void`

#### Defined in

[GPULayer.ts:692](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPULayer.ts#L692)

___

### setFromArray

▸ **setFromArray**(`array`, `applyToAllBuffers?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `array` | `number`[] \| [`GPULayerArray`](../modules.md#gpulayerarray) | `undefined` |
| `applyToAllBuffers` | `boolean` | `false` |

#### Returns

`void`

#### Defined in

[GPULayer.ts:437](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPULayer.ts#L437)
