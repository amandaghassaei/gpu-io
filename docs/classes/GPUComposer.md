[webgl-compute](../README.md) / GPUComposer

# Class: GPUComposer

## Table of contents

### Constructors

- [constructor](GPUComposer.md#constructor)

### Properties

- [\_vertexShaders](GPUComposer.md#_vertexshaders)
- [canvas](GPUComposer.md#canvas)
- [errorCallback](GPUComposer.md#errorcallback)
- [extensions](GPUComposer.md#extensions)
- [floatPrecision](GPUComposer.md#floatprecision)
- [gl](GPUComposer.md#gl)
- [glslVersion](GPUComposer.md#glslversion)
- [intPrecision](GPUComposer.md#intprecision)
- [renderer](GPUComposer.md#renderer)
- [verboseLogging](GPUComposer.md#verboselogging)

### Methods

- [\_cloneGPULayer](GPUComposer.md#_clonegpulayer)
- [\_getVertexShaderWithName](GPUComposer.md#_getvertexshaderwithname)
- [\_setValueProgramForType](GPUComposer.md#_setvalueprogramfortype)
- [dispose](GPUComposer.md#dispose)
- [drawLayerAsLines](GPUComposer.md#drawlayeraslines)
- [drawLayerAsPoints](GPUComposer.md#drawlayeraspoints)
- [drawLayerAsVectorField](GPUComposer.md#drawlayerasvectorfield)
- [drawLayerMagnitude](GPUComposer.md#drawlayermagnitude)
- [initTexture](GPUComposer.md#inittexture)
- [isWebGL2](GPUComposer.md#iswebgl2)
- [resetThreeState](GPUComposer.md#resetthreestate)
- [resize](GPUComposer.md#resize)
- [step](GPUComposer.md#step)
- [stepBoundary](GPUComposer.md#stepboundary)
- [stepCircle](GPUComposer.md#stepcircle)
- [stepLines](GPUComposer.md#steplines)
- [stepNonBoundary](GPUComposer.md#stepnonboundary)
- [stepPolyline](GPUComposer.md#steppolyline)
- [stepSegment](GPUComposer.md#stepsegment)
- [stepTriangleStrip](GPUComposer.md#steptrianglestrip)
- [initWithThreeRenderer](GPUComposer.md#initwiththreerenderer)

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
| `params.errorCallback?` | [`ErrorCallback`](../README.md#errorcallback) |
| `params.floatPrecision?` | [`GLSLPrecision`](../README.md#glslprecision) |
| `params.glslVersion?` | [`GLSLVersion`](../README.md#glslversion) |
| `params.intPrecision?` | [`GLSLPrecision`](../README.md#glslprecision) |
| `params.verboseLogging?` | `boolean` |

#### Defined in

[GPUComposer.ts:200](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/GPUComposer.ts#L200)

## Properties

### \_vertexShaders

• `Readonly` **\_vertexShaders**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `DEFAULT` | { `defines?`: [`CompileTimeVars`](../README.md#compiletimevars) ; `shader?`: `WebGLProgram` ; `src`: `string`  } |
| `DEFAULT.defines?` | [`CompileTimeVars`](../README.md#compiletimevars) |
| `DEFAULT.shader?` | `WebGLProgram` |
| `DEFAULT.src` | `string` |
| `DEFAULT_W_NORMAL` | { `defines?`: [`CompileTimeVars`](../README.md#compiletimevars) ; `shader?`: `WebGLProgram` ; `src`: `string`  } |
| `DEFAULT_W_NORMAL.defines?` | [`CompileTimeVars`](../README.md#compiletimevars) |
| `DEFAULT_W_NORMAL.shader?` | `WebGLProgram` |
| `DEFAULT_W_NORMAL.src` | `string` |
| `DEFAULT_W_UV` | { `defines?`: [`CompileTimeVars`](../README.md#compiletimevars) ; `shader?`: `WebGLProgram` ; `src`: `string`  } |
| `DEFAULT_W_UV.defines?` | [`CompileTimeVars`](../README.md#compiletimevars) |
| `DEFAULT_W_UV.shader?` | `WebGLProgram` |
| `DEFAULT_W_UV.src` | `string` |
| `DEFAULT_W_UV_NORMAL` | { `defines?`: [`CompileTimeVars`](../README.md#compiletimevars) ; `shader?`: `WebGLProgram` ; `src`: `string`  } |
| `DEFAULT_W_UV_NORMAL.defines?` | [`CompileTimeVars`](../README.md#compiletimevars) |
| `DEFAULT_W_UV_NORMAL.shader?` | `WebGLProgram` |
| `DEFAULT_W_UV_NORMAL.src` | `string` |
| `LAYER_LINES` | { `defines?`: [`CompileTimeVars`](../README.md#compiletimevars) ; `shader?`: `WebGLProgram` ; `src`: `string`  } |
| `LAYER_LINES.defines?` | [`CompileTimeVars`](../README.md#compiletimevars) |
| `LAYER_LINES.shader?` | `WebGLProgram` |
| `LAYER_LINES.src` | `string` |
| `LAYER_POINTS` | { `defines?`: [`CompileTimeVars`](../README.md#compiletimevars) ; `shader?`: `WebGLProgram` ; `src`: `string`  } |
| `LAYER_POINTS.defines?` | [`CompileTimeVars`](../README.md#compiletimevars) |
| `LAYER_POINTS.shader?` | `WebGLProgram` |
| `LAYER_POINTS.src` | `string` |
| `LAYER_VECTOR_FIELD` | { `defines?`: [`CompileTimeVars`](../README.md#compiletimevars) ; `shader?`: `WebGLProgram` ; `src`: `string`  } |
| `LAYER_VECTOR_FIELD.defines?` | [`CompileTimeVars`](../README.md#compiletimevars) |
| `LAYER_VECTOR_FIELD.shader?` | `WebGLProgram` |
| `LAYER_VECTOR_FIELD.src` | `string` |
| `SEGMENT` | { `defines?`: [`CompileTimeVars`](../README.md#compiletimevars) ; `shader?`: `WebGLProgram` ; `src`: `string`  } |
| `SEGMENT.defines?` | [`CompileTimeVars`](../README.md#compiletimevars) |
| `SEGMENT.shader?` | `WebGLProgram` |
| `SEGMENT.src` | `string` |

#### Defined in

[GPUComposer.ts:134](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/GPUComposer.ts#L134)

___

### canvas

• `Readonly` **canvas**: `HTMLCanvasElement`

#### Defined in

[GPUComposer.ts:73](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/GPUComposer.ts#L73)

___

### errorCallback

• `Readonly` **errorCallback**: [`ErrorCallback`](../README.md#errorcallback)

#### Defined in

[GPUComposer.ts:83](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/GPUComposer.ts#L83)

___

### extensions

• `Readonly` **extensions**: `Object` = `{}`

#### Index signature

▪ [key: `string`]: `any`

#### Defined in

[GPUComposer.ts:102](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/GPUComposer.ts#L102)

___

### floatPrecision

• `Readonly` **floatPrecision**: [`GLSLPrecision`](../README.md#glslprecision)

#### Defined in

[GPUComposer.ts:77](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/GPUComposer.ts#L77)

___

### gl

• `Readonly` **gl**: `WebGLRenderingContext` \| `WebGL2RenderingContext`

#### Defined in

[GPUComposer.ts:74](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/GPUComposer.ts#L74)

___

### glslVersion

• `Readonly` **glslVersion**: [`GLSLVersion`](../README.md#glslversion)

#### Defined in

[GPUComposer.ts:75](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/GPUComposer.ts#L75)

___

### intPrecision

• `Readonly` **intPrecision**: [`GLSLPrecision`](../README.md#glslprecision)

#### Defined in

[GPUComposer.ts:76](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/GPUComposer.ts#L76)

___

### renderer

• `Optional` `Readonly` **renderer**: `WebGLRenderer`

#### Defined in

[GPUComposer.ts:86](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/GPUComposer.ts#L86)

___

### verboseLogging

• **verboseLogging**: `boolean` = `false`

#### Defined in

[GPUComposer.ts:175](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/GPUComposer.ts#L175)

## Methods

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

[GPUComposer.ts:456](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/GPUComposer.ts#L456)

___

### \_getVertexShaderWithName

▸ **_getVertexShaderWithName**(`name`, `programName`): `undefined` \| `WebGLProgram`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | [`PROGRAM_NAME_INTERNAL`](../README.md#program_name_internal) |
| `programName` | `string` |

#### Returns

`undefined` \| `WebGLProgram`

#### Defined in

[GPUComposer.ts:611](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/GPUComposer.ts#L611)

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

[GPUComposer.ts:338](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/GPUComposer.ts#L338)

___

### dispose

▸ **dispose**(): `void`

#### Returns

`void`

#### Defined in

[GPUComposer.ts:1675](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/GPUComposer.ts#L1675)

___

### drawLayerAsLines

▸ **drawLayerAsLines**(`params`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Object` |
| `params.closeLoop?` | `boolean` |
| `params.color?` | [`number`, `number`, `number`] |
| `params.count?` | `number` |
| `params.indices?` | `Int16Array` \| `Uint16Array` \| `Int32Array` \| `Uint32Array` \| `Float32Array` |
| `params.input?` | `WebGLTexture` \| [`GPULayer`](GPULayer.md) \| (`WebGLTexture` \| [`GPULayer`](GPULayer.md))[] |
| `params.output?` | [`GPULayer`](GPULayer.md) |
| `params.positions` | [`GPULayer`](GPULayer.md) |
| `params.program?` | [`GPUProgram`](GPUProgram.md) |
| `params.shouldBlendAlpha?` | `boolean` |
| `params.wrapX?` | `boolean` |
| `params.wrapY?` | `boolean` |

#### Returns

`void`

#### Defined in

[GPUComposer.ts:1454](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/GPUComposer.ts#L1454)

___

### drawLayerAsPoints

▸ **drawLayerAsPoints**(`params`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Object` |
| `params.color?` | [`number`, `number`, `number`] |
| `params.count?` | `number` |
| `params.input?` | `WebGLTexture` \| [`GPULayer`](GPULayer.md) \| (`WebGLTexture` \| [`GPULayer`](GPULayer.md))[] |
| `params.output?` | [`GPULayer`](GPULayer.md) |
| `params.pointSize?` | `number` |
| `params.positions` | [`GPULayer`](GPULayer.md) |
| `params.program?` | [`GPUProgram`](GPUProgram.md) |
| `params.shouldBlendAlpha?` | `boolean` |
| `params.wrapX?` | `boolean` |
| `params.wrapY?` | `boolean` |

#### Returns

`void`

#### Defined in

[GPUComposer.ts:1381](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/GPUComposer.ts#L1381)

___

### drawLayerAsVectorField

▸ **drawLayerAsVectorField**(`params`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Object` |
| `params.color?` | [`number`, `number`, `number`] |
| `params.data` | [`GPULayer`](GPULayer.md) |
| `params.input?` | `WebGLTexture` \| [`GPULayer`](GPULayer.md) \| (`WebGLTexture` \| [`GPULayer`](GPULayer.md))[] |
| `params.output?` | [`GPULayer`](GPULayer.md) |
| `params.program?` | [`GPUProgram`](GPUProgram.md) |
| `params.shouldBlendAlpha?` | `boolean` |
| `params.vectorScale?` | `number` |
| `params.vectorSpacing?` | `number` |

#### Returns

`void`

#### Defined in

[GPUComposer.ts:1548](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/GPUComposer.ts#L1548)

___

### drawLayerMagnitude

▸ **drawLayerMagnitude**(`params`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Object` |
| `params.color?` | [`number`, `number`, `number`] |
| `params.data` | [`GPULayer`](GPULayer.md) |
| `params.input?` | `WebGLTexture` \| [`GPULayer`](GPULayer.md) \| (`WebGLTexture` \| [`GPULayer`](GPULayer.md))[] |
| `params.output?` | [`GPULayer`](GPULayer.md) |
| `params.scale?` | `number` |
| `params.shouldBlendAlpha?` | `boolean` |

#### Returns

`void`

#### Defined in

[GPUComposer.ts:1616](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/GPUComposer.ts#L1616)

___

### initTexture

▸ **initTexture**(`params`): `WebGLTexture`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Object` |
| `params.filter?` | [`GPULayerFilter`](../README.md#gpulayerfilter) |
| `params.format?` | [`TextureFormat`](../README.md#textureformat) |
| `params.name` | `string` |
| `params.onLoad?` | (`texture`: `WebGLTexture`) => `void` |
| `params.type?` | ``"UNSIGNED_BYTE"`` |
| `params.url` | `string` |
| `params.wrapS?` | [`GPULayerWrap`](../README.md#gpulayerwrap) |
| `params.wrapT?` | [`GPULayerWrap`](../README.md#gpulayerwrap) |

#### Returns

`WebGLTexture`

#### Defined in

[GPUComposer.ts:498](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/GPUComposer.ts#L498)

___

### isWebGL2

▸ **isWebGL2**(): `boolean`

#### Returns

`boolean`

#### Defined in

[GPUComposer.ts:315](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/GPUComposer.ts#L315)

___

### resetThreeState

▸ **resetThreeState**(): `void`

#### Returns

`void`

#### Defined in

[GPUComposer.ts:1661](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/GPUComposer.ts#L1661)

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

[GPUComposer.ts:648](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/GPUComposer.ts#L648)

___

### step

▸ **step**(`params`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Object` |
| `params.input?` | `WebGLTexture` \| [`GPULayer`](GPULayer.md) \| (`WebGLTexture` \| [`GPULayer`](GPULayer.md))[] |
| `params.output?` | [`GPULayer`](GPULayer.md) |
| `params.program` | [`GPUProgram`](GPUProgram.md) |
| `params.shouldBlendAlpha?` | `boolean` |

#### Returns

`void`

#### Defined in

[GPUComposer.ts:822](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/GPUComposer.ts#L822)

___

### stepBoundary

▸ **stepBoundary**(`params`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Object` |
| `params.input?` | `WebGLTexture` \| [`GPULayer`](GPULayer.md) \| (`WebGLTexture` \| [`GPULayer`](GPULayer.md))[] |
| `params.output?` | [`GPULayer`](GPULayer.md) |
| `params.program` | [`GPUProgram`](GPUProgram.md) |
| `params.shouldBlendAlpha?` | `boolean` |
| `params.singleEdge?` | ``"LEFT"`` \| ``"RIGHT"`` \| ``"TOP"`` \| ``"BOTTOM"`` |

#### Returns

`void`

#### Defined in

[GPUComposer.ts:856](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/GPUComposer.ts#L856)

___

### stepCircle

▸ **stepCircle**(`params`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Object` |
| `params.input?` | `WebGLTexture` \| [`GPULayer`](GPULayer.md) \| (`WebGLTexture` \| [`GPULayer`](GPULayer.md))[] |
| `params.numSegments?` | `number` |
| `params.output?` | [`GPULayer`](GPULayer.md) |
| `params.position` | [`number`, `number`] |
| `params.program` | [`GPUProgram`](GPUProgram.md) |
| `params.radius` | `number` |
| `params.shouldBlendAlpha?` | `boolean` |

#### Returns

`void`

#### Defined in

[GPUComposer.ts:951](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/GPUComposer.ts#L951)

___

### stepLines

▸ **stepLines**(`params`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Object` |
| `params.closeLoop?` | `boolean` |
| `params.count?` | `number` |
| `params.indices?` | `Int16Array` \| `Uint16Array` \| `Int32Array` \| `Uint32Array` |
| `params.input?` | `WebGLTexture` \| [`GPULayer`](GPULayer.md) \| (`WebGLTexture` \| [`GPULayer`](GPULayer.md))[] |
| `params.normals?` | `Float32Array` |
| `params.output?` | [`GPULayer`](GPULayer.md) |
| `params.positions` | `Float32Array` |
| `params.program` | [`GPUProgram`](GPUProgram.md) |
| `params.shouldBlendAlpha?` | `boolean` |
| `params.uvs?` | `Float32Array` |

#### Returns

`void`

#### Defined in

[GPUComposer.ts:1306](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/GPUComposer.ts#L1306)

___

### stepNonBoundary

▸ **stepNonBoundary**(`params`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Object` |
| `params.input?` | `WebGLTexture` \| [`GPULayer`](GPULayer.md) \| (`WebGLTexture` \| [`GPULayer`](GPULayer.md))[] |
| `params.output?` | [`GPULayer`](GPULayer.md) |
| `params.program` | [`GPUProgram`](GPUProgram.md) |
| `params.shouldBlendAlpha?` | `boolean` |

#### Returns

`void`

#### Defined in

[GPUComposer.ts:914](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/GPUComposer.ts#L914)

___

### stepPolyline

▸ **stepPolyline**(`params`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Object` |
| `params.closeLoop?` | `boolean` |
| `params.includeNormals?` | `boolean` |
| `params.includeUVs?` | `boolean` |
| `params.input?` | `WebGLTexture` \| [`GPULayer`](GPULayer.md) \| (`WebGLTexture` \| [`GPULayer`](GPULayer.md))[] |
| `params.output?` | [`GPULayer`](GPULayer.md) |
| `params.positions` | [`number`, `number`][] |
| `params.program` | [`GPUProgram`](GPUProgram.md) |
| `params.shouldBlendAlpha?` | `boolean` |
| `params.thickness` | `number` |

#### Returns

`void`

#### Defined in

[GPUComposer.ts:1059](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/GPUComposer.ts#L1059)

___

### stepSegment

▸ **stepSegment**(`params`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Object` |
| `params.endCaps?` | `boolean` |
| `params.input?` | `WebGLTexture` \| [`GPULayer`](GPULayer.md) \| (`WebGLTexture` \| [`GPULayer`](GPULayer.md))[] |
| `params.numCapSegments?` | `number` |
| `params.output?` | [`GPULayer`](GPULayer.md) |
| `params.position1` | [`number`, `number`] |
| `params.position2` | [`number`, `number`] |
| `params.program` | [`GPUProgram`](GPUProgram.md) |
| `params.shouldBlendAlpha?` | `boolean` |
| `params.thickness` | `number` |

#### Returns

`void`

#### Defined in

[GPUComposer.ts:992](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/GPUComposer.ts#L992)

___

### stepTriangleStrip

▸ **stepTriangleStrip**(`params`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Object` |
| `params.count?` | `number` |
| `params.input?` | `WebGLTexture` \| [`GPULayer`](GPULayer.md) \| (`WebGLTexture` \| [`GPULayer`](GPULayer.md))[] |
| `params.normals?` | `Float32Array` |
| `params.output?` | [`GPULayer`](GPULayer.md) |
| `params.positions` | `Float32Array` |
| `params.program` | [`GPUProgram`](GPUProgram.md) |
| `params.shouldBlendAlpha?` | `boolean` |
| `params.uvs?` | `Float32Array` |

#### Returns

`void`

#### Defined in

[GPUComposer.ts:1252](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/GPUComposer.ts#L1252)

___

### initWithThreeRenderer

▸ `Static` **initWithThreeRenderer**(`renderer`, `params?`): [`GPUComposer`](GPUComposer.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `renderer` | `WebGLRenderer` |
| `params?` | `Object` |
| `params.errorCallback?` | [`ErrorCallback`](../README.md#errorcallback) |
| `params.verboseLogging?` | `boolean` |

#### Returns

[`GPUComposer`](GPUComposer.md)

#### Defined in

[GPUComposer.ts:177](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/GPUComposer.ts#L177)
