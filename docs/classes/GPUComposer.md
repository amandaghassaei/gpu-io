[webgl-compute](../README.md) / GPUComposer

# Class: GPUComposer

## Table of contents

### Properties

- [canvas](GPUComposer.md#canvas)
- [gl](GPUComposer.md#gl)
- [glslVersion](GPUComposer.md#glslversion)
- [intPrecision](GPUComposer.md#intprecision)
- [floatPrecision](GPUComposer.md#floatprecision)
- [errorCallback](GPUComposer.md#errorcallback)
- [renderer](GPUComposer.md#renderer)
- [extensions](GPUComposer.md#extensions)
- [\_vertexShaders](GPUComposer.md#_vertexshaders)
- [verboseLogging](GPUComposer.md#verboselogging)

### Methods

- [initWithThreeRenderer](GPUComposer.md#initwiththreerenderer)
- [isWebGL2](GPUComposer.md#iswebgl2)
- [\_setValueProgramForType](GPUComposer.md#_setvalueprogramfortype)
- [\_cloneGPULayer](GPUComposer.md#_clonegpulayer)
- [initTexture](GPUComposer.md#inittexture)
- [\_getVertexShaderWithName](GPUComposer.md#_getvertexshaderwithname)
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

### Constructors

- [constructor](GPUComposer.md#constructor)

## Properties

### canvas

• `Readonly` **canvas**: `HTMLCanvasElement`

#### Defined in

[GPUComposer.ts:73](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPUComposer.ts#L73)

___

### gl

• `Readonly` **gl**: `WebGLRenderingContext` \| `WebGL2RenderingContext`

#### Defined in

[GPUComposer.ts:74](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPUComposer.ts#L74)

___

### glslVersion

• `Readonly` **glslVersion**: [`GLSLVersion`](../README.md#glslversion)

#### Defined in

[GPUComposer.ts:75](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPUComposer.ts#L75)

___

### intPrecision

• `Readonly` **intPrecision**: [`GLSLPrecision`](../README.md#glslprecision)

#### Defined in

[GPUComposer.ts:76](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPUComposer.ts#L76)

___

### floatPrecision

• `Readonly` **floatPrecision**: [`GLSLPrecision`](../README.md#glslprecision)

#### Defined in

[GPUComposer.ts:77](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPUComposer.ts#L77)

___

### errorCallback

• `Readonly` **errorCallback**: [`ErrorCallback`](../README.md#errorcallback)

#### Defined in

[GPUComposer.ts:83](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPUComposer.ts#L83)

___

### renderer

• `Optional` `Readonly` **renderer**: `WebGLRenderer`

#### Defined in

[GPUComposer.ts:86](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPUComposer.ts#L86)

___

### extensions

• `Readonly` **extensions**: `Object` = `{}`

#### Index signature

▪ [key: `string`]: `any`

#### Defined in

[GPUComposer.ts:102](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPUComposer.ts#L102)

___

### \_vertexShaders

• `Readonly` **\_vertexShaders**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `DEFAULT` | { `src`: `string` ; `shader?`: `WebGLProgram` ; `defines?`: [`CompileTimeVars`](../README.md#compiletimevars)  } |
| `DEFAULT.src` | `string` |
| `DEFAULT.shader?` | `WebGLProgram` |
| `DEFAULT.defines?` | [`CompileTimeVars`](../README.md#compiletimevars) |
| `DEFAULT_W_UV` | { `src`: `string` ; `shader?`: `WebGLProgram` ; `defines?`: [`CompileTimeVars`](../README.md#compiletimevars)  } |
| `DEFAULT_W_UV.src` | `string` |
| `DEFAULT_W_UV.shader?` | `WebGLProgram` |
| `DEFAULT_W_UV.defines?` | [`CompileTimeVars`](../README.md#compiletimevars) |
| `DEFAULT_W_NORMAL` | { `src`: `string` ; `shader?`: `WebGLProgram` ; `defines?`: [`CompileTimeVars`](../README.md#compiletimevars)  } |
| `DEFAULT_W_NORMAL.src` | `string` |
| `DEFAULT_W_NORMAL.shader?` | `WebGLProgram` |
| `DEFAULT_W_NORMAL.defines?` | [`CompileTimeVars`](../README.md#compiletimevars) |
| `DEFAULT_W_UV_NORMAL` | { `src`: `string` ; `shader?`: `WebGLProgram` ; `defines?`: [`CompileTimeVars`](../README.md#compiletimevars)  } |
| `DEFAULT_W_UV_NORMAL.src` | `string` |
| `DEFAULT_W_UV_NORMAL.shader?` | `WebGLProgram` |
| `DEFAULT_W_UV_NORMAL.defines?` | [`CompileTimeVars`](../README.md#compiletimevars) |
| `SEGMENT` | { `src`: `string` ; `shader?`: `WebGLProgram` ; `defines?`: [`CompileTimeVars`](../README.md#compiletimevars)  } |
| `SEGMENT.src` | `string` |
| `SEGMENT.shader?` | `WebGLProgram` |
| `SEGMENT.defines?` | [`CompileTimeVars`](../README.md#compiletimevars) |
| `LAYER_POINTS` | { `src`: `string` ; `shader?`: `WebGLProgram` ; `defines?`: [`CompileTimeVars`](../README.md#compiletimevars)  } |
| `LAYER_POINTS.src` | `string` |
| `LAYER_POINTS.shader?` | `WebGLProgram` |
| `LAYER_POINTS.defines?` | [`CompileTimeVars`](../README.md#compiletimevars) |
| `LAYER_LINES` | { `src`: `string` ; `shader?`: `WebGLProgram` ; `defines?`: [`CompileTimeVars`](../README.md#compiletimevars)  } |
| `LAYER_LINES.src` | `string` |
| `LAYER_LINES.shader?` | `WebGLProgram` |
| `LAYER_LINES.defines?` | [`CompileTimeVars`](../README.md#compiletimevars) |
| `LAYER_VECTOR_FIELD` | { `src`: `string` ; `shader?`: `WebGLProgram` ; `defines?`: [`CompileTimeVars`](../README.md#compiletimevars)  } |
| `LAYER_VECTOR_FIELD.src` | `string` |
| `LAYER_VECTOR_FIELD.shader?` | `WebGLProgram` |
| `LAYER_VECTOR_FIELD.defines?` | [`CompileTimeVars`](../README.md#compiletimevars) |

#### Defined in

[GPUComposer.ts:134](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPUComposer.ts#L134)

___

### verboseLogging

• **verboseLogging**: `boolean` = `false`

#### Defined in

[GPUComposer.ts:175](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPUComposer.ts#L175)

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

#### Defined in

[GPUComposer.ts:177](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPUComposer.ts#L177)

___

### isWebGL2

▸ **isWebGL2**(): `boolean`

#### Returns

`boolean`

#### Defined in

[GPUComposer.ts:315](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPUComposer.ts#L315)

___

### \_setValueProgramForType

▸ **_setValueProgramForType**(`type`): [`GPUProgram`](GPUProgram.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | [`GPULayerType`](../README.md#gpulayertype) |

#### Returns

[`GPUProgram`](GPUProgram.md)

#### Defined in

[GPUComposer.ts:338](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPUComposer.ts#L338)

___

### \_cloneGPULayer

▸ **_cloneGPULayer**(`gpuLayer`, `name?`): [`GPULayer`](GPULayer.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `gpuLayer` | [`GPULayer`](GPULayer.md) |
| `name?` | `string` |

#### Returns

[`GPULayer`](GPULayer.md)

#### Defined in

[GPUComposer.ts:456](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPUComposer.ts#L456)

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

#### Defined in

[GPUComposer.ts:498](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPUComposer.ts#L498)

___

### \_getVertexShaderWithName

▸ **_getVertexShaderWithName**(`name`, `programName`): `undefined` \| `WebGLProgram`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `PROGRAM_NAME_INTERNAL` |
| `programName` | `string` |

#### Returns

`undefined` \| `WebGLProgram`

#### Defined in

[GPUComposer.ts:611](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPUComposer.ts#L611)

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

#### Defined in

[GPUComposer.ts:648](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPUComposer.ts#L648)

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

#### Defined in

[GPUComposer.ts:822](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPUComposer.ts#L822)

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

#### Defined in

[GPUComposer.ts:856](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPUComposer.ts#L856)

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

#### Defined in

[GPUComposer.ts:914](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPUComposer.ts#L914)

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

#### Defined in

[GPUComposer.ts:951](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPUComposer.ts#L951)

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

#### Defined in

[GPUComposer.ts:992](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPUComposer.ts#L992)

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

#### Defined in

[GPUComposer.ts:1059](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPUComposer.ts#L1059)

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

#### Defined in

[GPUComposer.ts:1252](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPUComposer.ts#L1252)

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

#### Defined in

[GPUComposer.ts:1306](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPUComposer.ts#L1306)

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

#### Defined in

[GPUComposer.ts:1381](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPUComposer.ts#L1381)

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

#### Defined in

[GPUComposer.ts:1454](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPUComposer.ts#L1454)

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

#### Defined in

[GPUComposer.ts:1548](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPUComposer.ts#L1548)

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

#### Defined in

[GPUComposer.ts:1616](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPUComposer.ts#L1616)

___

### resetThreeState

▸ **resetThreeState**(): `void`

#### Returns

`void`

#### Defined in

[GPUComposer.ts:1661](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPUComposer.ts#L1661)

___

### dispose

▸ **dispose**(): `void`

#### Returns

`void`

#### Defined in

[GPUComposer.ts:1675](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPUComposer.ts#L1675)

## Constructors

### constructor

• **new GPUComposer**(`params`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Object` |
| `params.canvas` | `HTMLCanvasElement` |
| `params.context?` | ``null`` \| `WebGLRenderingContext` \| `WebGL2RenderingContext` |
| `params.contextID?` | `string` |
| `params.contextOptions?` | `Object` |
| `params.contextOptions.antialias?` | `boolean` |
| `params.glslVersion?` | [`GLSLVersion`](../README.md#glslversion) |
| `params.intPrecision?` | [`GLSLPrecision`](../README.md#glslprecision) |
| `params.floatPrecision?` | [`GLSLPrecision`](../README.md#glslprecision) |
| `params.verboseLogging?` | `boolean` |
| `params.errorCallback?` | [`ErrorCallback`](../README.md#errorcallback) |

#### Defined in

[GPUComposer.ts:200](https://github.com/amandaghassaei/webgl-compute/blob/f957fec/src/GPUComposer.ts#L200)
