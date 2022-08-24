[webgl-compute](../README.md) / GPUComposer

# Class: GPUComposer

## Table of contents

### Properties

- [canvas](GPUComposer.md#canvas)
- [gl](GPUComposer.md#gl)
- [glslVersion](GPUComposer.md#glslversion)
- [intPrecision](GPUComposer.md#intprecision)
- [floatPrecision](GPUComposer.md#floatprecision)
- [verboseLogging](GPUComposer.md#verboselogging)

### Constructors

- [constructor](GPUComposer.md#constructor)

### Methods

- [initWithThreeRenderer](GPUComposer.md#initwiththreerenderer)
- [isWebGL2](GPUComposer.md#iswebgl2)
- [initTexture](GPUComposer.md#inittexture)
- [resize](GPUComposer.md#resize)
- [step](GPUComposer.md#step)
- [stepBoundary](GPUComposer.md#stepboundary)
- [stepNonBoundary](GPUComposer.md#stepnonboundary)
- [stepCircle](GPUComposer.md#stepcircle)
- [stepSegment](GPUComposer.md#stepsegment)
- [stepPolyline](GPUComposer.md#steppolyline)
- [stepTriangleStrip](GPUComposer.md#steptrianglestrip)
- [stepLines](GPUComposer.md#steplines)
- [drawLayerAsPoints](GPUComposer.md#drawlayeraspoints)
- [drawLayerAsLines](GPUComposer.md#drawlayeraslines)
- [drawLayerAsVectorField](GPUComposer.md#drawlayerasvectorfield)
- [drawLayerMagnitude](GPUComposer.md#drawlayermagnitude)
- [resetThreeState](GPUComposer.md#resetthreestate)
- [dispose](GPUComposer.md#dispose)

## Properties

### canvas

• `Readonly` **canvas**: `HTMLCanvasElement`

___

### gl

• `Readonly` **gl**: `WebGLRenderingContext` \| `WebGL2RenderingContext`

___

### glslVersion

• `Readonly` **glslVersion**: [`GLSLVersion`](../README.md#glslversion)

___

### intPrecision

• `Readonly` **intPrecision**: [`GLSLPrecision`](../README.md#glslprecision)

___

### floatPrecision

• `Readonly` **floatPrecision**: [`GLSLPrecision`](../README.md#glslprecision)

___

### verboseLogging

• **verboseLogging**: `boolean` = `false`

## Constructors

### constructor

• **new GPUComposer**(`params`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Object` |
| `params.canvas` | `HTMLCanvasElement` |
| `params.context?` | `WebGLRenderingContext` \| `WebGL2RenderingContext` |
| `params.contextID?` | `string` |
| `params.contextOptions?` | `Object` |
| `params.contextOptions.antialias?` | `boolean` |
| `params.glslVersion?` | [`GLSLVersion`](../README.md#glslversion) |
| `params.intPrecision?` | [`GLSLPrecision`](../README.md#glslprecision) |
| `params.floatPrecision?` | [`GLSLPrecision`](../README.md#glslprecision) |
| `params.verboseLogging?` | `boolean` |
| `params.errorCallback?` | [`ErrorCallback`](../README.md#errorcallback) |

## Methods

### initWithThreeRenderer

▸ `Static` **initWithThreeRenderer**(`renderer`, `params?`): [`GPUComposer`](GPUComposer.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `renderer` | `WebGLRenderer` |
| `params?` | `Object` |
| `params.verboseLogging?` | `boolean` |
| `params.errorCallback?` | [`ErrorCallback`](../README.md#errorcallback) |

#### Returns

[`GPUComposer`](GPUComposer.md)

___

### isWebGL2

▸ **isWebGL2**(): `boolean`

#### Returns

`boolean`

___

### initTexture

▸ **initTexture**(`params`): `WebGLTexture`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Object` |
| `params.name` | `string` |
| `params.url` | `string` |
| `params.filter?` | [`GPULayerFilter`](../README.md#gpulayerfilter) |
| `params.wrapS?` | [`GPULayerWrap`](../README.md#gpulayerwrap) |
| `params.wrapT?` | [`GPULayerWrap`](../README.md#gpulayerwrap) |
| `params.format?` | `TextureFormat` |
| `params.type?` | ``"UNSIGNED_BYTE"`` |
| `params.onLoad?` | (`texture`: `WebGLTexture`) => `void` |

#### Returns

`WebGLTexture`

___

### resize

▸ **resize**(`width`, `height`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `width` | `number` |
| `height` | `number` |

#### Returns

`void`

___

### step

▸ **step**(`params`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Object` |
| `params.program` | [`GPUProgram`](GPUProgram.md) |
| `params.input?` | `WebGLTexture` \| [`GPULayer`](GPULayer.md) \| (`WebGLTexture` \| [`GPULayer`](GPULayer.md))[] |
| `params.output?` | [`GPULayer`](GPULayer.md) |
| `params.shouldBlendAlpha?` | `boolean` |

#### Returns

`void`

___

### stepBoundary

▸ **stepBoundary**(`params`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Object` |
| `params.program` | [`GPUProgram`](GPUProgram.md) |
| `params.input?` | `WebGLTexture` \| [`GPULayer`](GPULayer.md) \| (`WebGLTexture` \| [`GPULayer`](GPULayer.md))[] |
| `params.output?` | [`GPULayer`](GPULayer.md) |
| `params.singleEdge?` | ``"LEFT"`` \| ``"RIGHT"`` \| ``"TOP"`` \| ``"BOTTOM"`` |
| `params.shouldBlendAlpha?` | `boolean` |

#### Returns

`void`

___

### stepNonBoundary

▸ **stepNonBoundary**(`params`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Object` |
| `params.program` | [`GPUProgram`](GPUProgram.md) |
| `params.input?` | `WebGLTexture` \| [`GPULayer`](GPULayer.md) \| (`WebGLTexture` \| [`GPULayer`](GPULayer.md))[] |
| `params.output?` | [`GPULayer`](GPULayer.md) |
| `params.shouldBlendAlpha?` | `boolean` |

#### Returns

`void`

___

### stepCircle

▸ **stepCircle**(`params`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Object` |
| `params.program` | [`GPUProgram`](GPUProgram.md) |
| `params.position` | [`number`, `number`] |
| `params.radius` | `number` |
| `params.input?` | `WebGLTexture` \| [`GPULayer`](GPULayer.md) \| (`WebGLTexture` \| [`GPULayer`](GPULayer.md))[] |
| `params.output?` | [`GPULayer`](GPULayer.md) |
| `params.numSegments?` | `number` |
| `params.shouldBlendAlpha?` | `boolean` |

#### Returns

`void`

___

### stepSegment

▸ **stepSegment**(`params`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Object` |
| `params.program` | [`GPUProgram`](GPUProgram.md) |
| `params.position1` | [`number`, `number`] |
| `params.position2` | [`number`, `number`] |
| `params.thickness` | `number` |
| `params.input?` | `WebGLTexture` \| [`GPULayer`](GPULayer.md) \| (`WebGLTexture` \| [`GPULayer`](GPULayer.md))[] |
| `params.output?` | [`GPULayer`](GPULayer.md) |
| `params.endCaps?` | `boolean` |
| `params.numCapSegments?` | `number` |
| `params.shouldBlendAlpha?` | `boolean` |

#### Returns

`void`

___

### stepPolyline

▸ **stepPolyline**(`params`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Object` |
| `params.program` | [`GPUProgram`](GPUProgram.md) |
| `params.positions` | [`number`, `number`][] |
| `params.thickness` | `number` |
| `params.input?` | `WebGLTexture` \| [`GPULayer`](GPULayer.md) \| (`WebGLTexture` \| [`GPULayer`](GPULayer.md))[] |
| `params.output?` | [`GPULayer`](GPULayer.md) |
| `params.closeLoop?` | `boolean` |
| `params.includeUVs?` | `boolean` |
| `params.includeNormals?` | `boolean` |
| `params.shouldBlendAlpha?` | `boolean` |

#### Returns

`void`

___

### stepTriangleStrip

▸ **stepTriangleStrip**(`params`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Object` |
| `params.program` | [`GPUProgram`](GPUProgram.md) |
| `params.positions` | `Float32Array` |
| `params.normals?` | `Float32Array` |
| `params.uvs?` | `Float32Array` |
| `params.input?` | `WebGLTexture` \| [`GPULayer`](GPULayer.md) \| (`WebGLTexture` \| [`GPULayer`](GPULayer.md))[] |
| `params.output?` | [`GPULayer`](GPULayer.md) |
| `params.count?` | `number` |
| `params.shouldBlendAlpha?` | `boolean` |

#### Returns

`void`

___

### stepLines

▸ **stepLines**(`params`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Object` |
| `params.program` | [`GPUProgram`](GPUProgram.md) |
| `params.positions` | `Float32Array` |
| `params.indices?` | `Int16Array` \| `Uint16Array` \| `Int32Array` \| `Uint32Array` |
| `params.normals?` | `Float32Array` |
| `params.uvs?` | `Float32Array` |
| `params.input?` | `WebGLTexture` \| [`GPULayer`](GPULayer.md) \| (`WebGLTexture` \| [`GPULayer`](GPULayer.md))[] |
| `params.output?` | [`GPULayer`](GPULayer.md) |
| `params.count?` | `number` |
| `params.closeLoop?` | `boolean` |
| `params.shouldBlendAlpha?` | `boolean` |

#### Returns

`void`

___

### drawLayerAsPoints

▸ **drawLayerAsPoints**(`params`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Object` |
| `params.positions` | [`GPULayer`](GPULayer.md) |
| `params.program?` | [`GPUProgram`](GPUProgram.md) |
| `params.input?` | `WebGLTexture` \| [`GPULayer`](GPULayer.md) \| (`WebGLTexture` \| [`GPULayer`](GPULayer.md))[] |
| `params.output?` | [`GPULayer`](GPULayer.md) |
| `params.pointSize?` | `number` |
| `params.count?` | `number` |
| `params.color?` | [`number`, `number`, `number`] |
| `params.wrapX?` | `boolean` |
| `params.wrapY?` | `boolean` |
| `params.shouldBlendAlpha?` | `boolean` |

#### Returns

`void`

___

### drawLayerAsLines

▸ **drawLayerAsLines**(`params`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Object` |
| `params.positions` | [`GPULayer`](GPULayer.md) |
| `params.indices?` | `Int16Array` \| `Uint16Array` \| `Int32Array` \| `Uint32Array` \| `Float32Array` |
| `params.program?` | [`GPUProgram`](GPUProgram.md) |
| `params.input?` | `WebGLTexture` \| [`GPULayer`](GPULayer.md) \| (`WebGLTexture` \| [`GPULayer`](GPULayer.md))[] |
| `params.output?` | [`GPULayer`](GPULayer.md) |
| `params.count?` | `number` |
| `params.color?` | [`number`, `number`, `number`] |
| `params.wrapX?` | `boolean` |
| `params.wrapY?` | `boolean` |
| `params.closeLoop?` | `boolean` |
| `params.shouldBlendAlpha?` | `boolean` |

#### Returns

`void`

___

### drawLayerAsVectorField

▸ **drawLayerAsVectorField**(`params`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Object` |
| `params.data` | [`GPULayer`](GPULayer.md) |
| `params.program?` | [`GPUProgram`](GPUProgram.md) |
| `params.input?` | `WebGLTexture` \| [`GPULayer`](GPULayer.md) \| (`WebGLTexture` \| [`GPULayer`](GPULayer.md))[] |
| `params.output?` | [`GPULayer`](GPULayer.md) |
| `params.vectorSpacing?` | `number` |
| `params.vectorScale?` | `number` |
| `params.color?` | [`number`, `number`, `number`] |
| `params.shouldBlendAlpha?` | `boolean` |

#### Returns

`void`

___

### drawLayerMagnitude

▸ **drawLayerMagnitude**(`params`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Object` |
| `params.data` | [`GPULayer`](GPULayer.md) |
| `params.input?` | `WebGLTexture` \| [`GPULayer`](GPULayer.md) \| (`WebGLTexture` \| [`GPULayer`](GPULayer.md))[] |
| `params.output?` | [`GPULayer`](GPULayer.md) |
| `params.scale?` | `number` |
| `params.color?` | [`number`, `number`, `number`] |
| `params.shouldBlendAlpha?` | `boolean` |

#### Returns

`void`

___

### resetThreeState

▸ **resetThreeState**(): `void`

#### Returns

`void`

___

### dispose

▸ **dispose**(): `void`

#### Returns

`void`
