[webgl-compute](../README.md) / [Exports](../modules.md) / GPUComposer

# Class: GPUComposer

## Table of contents

### Constructors

- [constructor](GPUComposer.md#constructor)

### Properties

- [\_boundaryPositionsBuffer](GPUComposer.md#_boundarypositionsbuffer)
- [\_circlePositionsBuffer](GPUComposer.md#_circlepositionsbuffer)
- [\_quadPositionsBuffer](GPUComposer.md#_quadpositionsbuffer)
- [\_vertexShaders](GPUComposer.md#_vertexshaders)
- [\_wrappedLineColorProgram](GPUComposer.md#_wrappedlinecolorprogram)
- [canvas](GPUComposer.md#canvas)
- [copyPrograms](GPUComposer.md#copyprograms)
- [errorCallback](GPUComposer.md#errorcallback)
- [errorState](GPUComposer.md#errorstate)
- [extensions](GPUComposer.md#extensions)
- [floatPrecision](GPUComposer.md#floatprecision)
- [gl](GPUComposer.md#gl)
- [glslVersion](GPUComposer.md#glslversion)
- [height](GPUComposer.md#height)
- [indexedLinesIndexBuffer](GPUComposer.md#indexedlinesindexbuffer)
- [intPrecision](GPUComposer.md#intprecision)
- [maxNumTextures](GPUComposer.md#maxnumtextures)
- [pointIndexArray](GPUComposer.md#pointindexarray)
- [pointIndexBuffer](GPUComposer.md#pointindexbuffer)
- [renderer](GPUComposer.md#renderer)
- [setValuePrograms](GPUComposer.md#setvalueprograms)
- [vectorFieldIndexArray](GPUComposer.md#vectorfieldindexarray)
- [vectorFieldIndexBuffer](GPUComposer.md#vectorfieldindexbuffer)
- [vectorMagnitudePrograms](GPUComposer.md#vectormagnitudeprograms)
- [verboseLogging](GPUComposer.md#verboselogging)
- [width](GPUComposer.md#width)

### Accessors

- [boundaryPositionsBuffer](GPUComposer.md#boundarypositionsbuffer)
- [quadPositionsBuffer](GPUComposer.md#quadpositionsbuffer)
- [wrappedLineColorProgram](GPUComposer.md#wrappedlinecolorprogram)

### Methods

- [\_cloneGPULayer](GPUComposer.md#_clonegpulayer)
- [\_getVertexShaderWithName](GPUComposer.md#_getvertexshaderwithname)
- [\_setValueProgramForType](GPUComposer.md#_setvalueprogramfortype)
- [addLayerToInputs](GPUComposer.md#addlayertoinputs)
- [copyProgramForType](GPUComposer.md#copyprogramfortype)
- [dispose](GPUComposer.md#dispose)
- [drawLayerAsLines](GPUComposer.md#drawlayeraslines)
- [drawLayerAsPoints](GPUComposer.md#drawlayeraspoints)
- [drawLayerAsVectorField](GPUComposer.md#drawlayerasvectorfield)
- [drawLayerMagnitude](GPUComposer.md#drawlayermagnitude)
- [drawSetup](GPUComposer.md#drawsetup)
- [getCirclePositionsBuffer](GPUComposer.md#getcirclepositionsbuffer)
- [glslKeyForType](GPUComposer.md#glslkeyfortype)
- [initTexture](GPUComposer.md#inittexture)
- [initVertexBuffer](GPUComposer.md#initvertexbuffer)
- [isWebGL2](GPUComposer.md#iswebgl2)
- [passThroughLayerDataFromInputToOutput](GPUComposer.md#passthroughlayerdatafrominputtooutput)
- [resetThreeState](GPUComposer.md#resetthreestate)
- [resize](GPUComposer.md#resize)
- [setBlendMode](GPUComposer.md#setblendmode)
- [setIndexAttribute](GPUComposer.md#setindexattribute)
- [setOutputLayer](GPUComposer.md#setoutputlayer)
- [setPositionAttribute](GPUComposer.md#setpositionattribute)
- [setUVAttribute](GPUComposer.md#setuvattribute)
- [setVertexAttribute](GPUComposer.md#setvertexattribute)
- [step](GPUComposer.md#step)
- [stepBoundary](GPUComposer.md#stepboundary)
- [stepCircle](GPUComposer.md#stepcircle)
- [stepLines](GPUComposer.md#steplines)
- [stepNonBoundary](GPUComposer.md#stepnonboundary)
- [stepPolyline](GPUComposer.md#steppolyline)
- [stepSegment](GPUComposer.md#stepsegment)
- [stepTriangleStrip](GPUComposer.md#steptrianglestrip)
- [vectorMagnitudeProgramForType](GPUComposer.md#vectormagnitudeprogramfortype)
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
| `params.errorCallback?` | [`ErrorCallback`](../modules.md#errorcallback) |
| `params.floatPrecision?` | [`GLSLPrecision`](../modules.md#glslprecision) |
| `params.glslVersion?` | [`GLSLVersion`](../modules.md#glslversion) |
| `params.intPrecision?` | [`GLSLPrecision`](../modules.md#glslprecision) |
| `params.verboseLogging?` | `boolean` |

#### Defined in

[GPUComposer.ts:200](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L200)

## Properties

### \_boundaryPositionsBuffer

• `Private` `Optional` **\_boundaryPositionsBuffer**: `WebGLBuffer`

#### Defined in

[GPUComposer.ts:91](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L91)

___

### \_circlePositionsBuffer

• `Private` **\_circlePositionsBuffer**: `Object` = `{}`

#### Index signature

▪ [key: `number`]: `WebGLBuffer`

#### Defined in

[GPUComposer.ts:93](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L93)

___

### \_quadPositionsBuffer

• `Private` `Optional` **\_quadPositionsBuffer**: `WebGLBuffer`

#### Defined in

[GPUComposer.ts:90](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L90)

___

### \_vertexShaders

• `Readonly` **\_vertexShaders**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `DEFAULT` | { `defines?`: [`CompileTimeVars`](../modules.md#compiletimevars) ; `shader?`: `WebGLProgram` ; `src`: `string`  } |
| `DEFAULT.defines?` | [`CompileTimeVars`](../modules.md#compiletimevars) |
| `DEFAULT.shader?` | `WebGLProgram` |
| `DEFAULT.src` | `string` |
| `DEFAULT_W_NORMAL` | { `defines?`: [`CompileTimeVars`](../modules.md#compiletimevars) ; `shader?`: `WebGLProgram` ; `src`: `string`  } |
| `DEFAULT_W_NORMAL.defines?` | [`CompileTimeVars`](../modules.md#compiletimevars) |
| `DEFAULT_W_NORMAL.shader?` | `WebGLProgram` |
| `DEFAULT_W_NORMAL.src` | `string` |
| `DEFAULT_W_UV` | { `defines?`: [`CompileTimeVars`](../modules.md#compiletimevars) ; `shader?`: `WebGLProgram` ; `src`: `string`  } |
| `DEFAULT_W_UV.defines?` | [`CompileTimeVars`](../modules.md#compiletimevars) |
| `DEFAULT_W_UV.shader?` | `WebGLProgram` |
| `DEFAULT_W_UV.src` | `string` |
| `DEFAULT_W_UV_NORMAL` | { `defines?`: [`CompileTimeVars`](../modules.md#compiletimevars) ; `shader?`: `WebGLProgram` ; `src`: `string`  } |
| `DEFAULT_W_UV_NORMAL.defines?` | [`CompileTimeVars`](../modules.md#compiletimevars) |
| `DEFAULT_W_UV_NORMAL.shader?` | `WebGLProgram` |
| `DEFAULT_W_UV_NORMAL.src` | `string` |
| `LAYER_LINES` | { `defines?`: [`CompileTimeVars`](../modules.md#compiletimevars) ; `shader?`: `WebGLProgram` ; `src`: `string`  } |
| `LAYER_LINES.defines?` | [`CompileTimeVars`](../modules.md#compiletimevars) |
| `LAYER_LINES.shader?` | `WebGLProgram` |
| `LAYER_LINES.src` | `string` |
| `LAYER_POINTS` | { `defines?`: [`CompileTimeVars`](../modules.md#compiletimevars) ; `shader?`: `WebGLProgram` ; `src`: `string`  } |
| `LAYER_POINTS.defines?` | [`CompileTimeVars`](../modules.md#compiletimevars) |
| `LAYER_POINTS.shader?` | `WebGLProgram` |
| `LAYER_POINTS.src` | `string` |
| `LAYER_VECTOR_FIELD` | { `defines?`: [`CompileTimeVars`](../modules.md#compiletimevars) ; `shader?`: `WebGLProgram` ; `src`: `string`  } |
| `LAYER_VECTOR_FIELD.defines?` | [`CompileTimeVars`](../modules.md#compiletimevars) |
| `LAYER_VECTOR_FIELD.shader?` | `WebGLProgram` |
| `LAYER_VECTOR_FIELD.src` | `string` |
| `SEGMENT` | { `defines?`: [`CompileTimeVars`](../modules.md#compiletimevars) ; `shader?`: `WebGLProgram` ; `src`: `string`  } |
| `SEGMENT.defines?` | [`CompileTimeVars`](../modules.md#compiletimevars) |
| `SEGMENT.shader?` | `WebGLProgram` |
| `SEGMENT.src` | `string` |

#### Defined in

[GPUComposer.ts:134](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L134)

___

### \_wrappedLineColorProgram

• `Private` `Optional` **\_wrappedLineColorProgram**: [`GPUProgram`](GPUProgram.md)

#### Defined in

[GPUComposer.ts:123](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L123)

___

### canvas

• `Readonly` **canvas**: `HTMLCanvasElement`

#### Defined in

[GPUComposer.ts:73](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L73)

___

### copyPrograms

• `Private` `Readonly` **copyPrograms**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `FLOAT?` | [`GPUProgram`](GPUProgram.md) |
| `INT?` | [`GPUProgram`](GPUProgram.md) |
| `UINT?` | [`GPUProgram`](GPUProgram.md) |
| `src` | `string` |

#### Defined in

[GPUComposer.ts:105](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L105)

___

### errorCallback

• `Readonly` **errorCallback**: [`ErrorCallback`](../modules.md#errorcallback)

#### Defined in

[GPUComposer.ts:83](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L83)

___

### errorState

• `Private` **errorState**: `boolean` = `false`

#### Defined in

[GPUComposer.ts:82](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L82)

___

### extensions

• `Readonly` **extensions**: `Object` = `{}`

#### Index signature

▪ [key: `string`]: `any`

#### Defined in

[GPUComposer.ts:102](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L102)

___

### floatPrecision

• `Readonly` **floatPrecision**: [`GLSLPrecision`](../modules.md#glslprecision)

#### Defined in

[GPUComposer.ts:77](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L77)

___

### gl

• `Readonly` **gl**: `WebGLRenderingContext` \| `WebGL2RenderingContext`

#### Defined in

[GPUComposer.ts:74](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L74)

___

### glslVersion

• `Readonly` **glslVersion**: [`GLSLVersion`](../modules.md#glslversion)

#### Defined in

[GPUComposer.ts:75](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L75)

___

### height

• `Private` **height**: `number`

#### Defined in

[GPUComposer.ts:80](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L80)

___

### indexedLinesIndexBuffer

• `Private` `Optional` **indexedLinesIndexBuffer**: `WebGLBuffer`

#### Defined in

[GPUComposer.ts:99](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L99)

___

### intPrecision

• `Readonly` **intPrecision**: [`GLSLPrecision`](../modules.md#glslprecision)

#### Defined in

[GPUComposer.ts:76](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L76)

___

### maxNumTextures

• `Private` `Readonly` **maxNumTextures**: `number`

#### Defined in

[GPUComposer.ts:87](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L87)

___

### pointIndexArray

• `Private` `Optional` **pointIndexArray**: `Float32Array`

#### Defined in

[GPUComposer.ts:95](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L95)

___

### pointIndexBuffer

• `Private` `Optional` **pointIndexBuffer**: `WebGLBuffer`

#### Defined in

[GPUComposer.ts:96](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L96)

___

### renderer

• `Optional` `Readonly` **renderer**: `WebGLRenderer`

#### Defined in

[GPUComposer.ts:86](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L86)

___

### setValuePrograms

• `Private` `Readonly` **setValuePrograms**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `FLOAT?` | [`GPUProgram`](GPUProgram.md) |
| `INT?` | [`GPUProgram`](GPUProgram.md) |
| `UINT?` | [`GPUProgram`](GPUProgram.md) |
| `src` | `string` |

#### Defined in

[GPUComposer.ts:115](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L115)

___

### vectorFieldIndexArray

• `Private` `Optional` **vectorFieldIndexArray**: `Float32Array`

#### Defined in

[GPUComposer.ts:97](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L97)

___

### vectorFieldIndexBuffer

• `Private` `Optional` **vectorFieldIndexBuffer**: `WebGLBuffer`

#### Defined in

[GPUComposer.ts:98](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L98)

___

### vectorMagnitudePrograms

• `Private` `Readonly` **vectorMagnitudePrograms**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `FLOAT?` | [`GPUProgram`](GPUProgram.md) |
| `INT?` | [`GPUProgram`](GPUProgram.md) |
| `UINT?` | [`GPUProgram`](GPUProgram.md) |
| `src` | `string` |

#### Defined in

[GPUComposer.ts:124](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L124)

___

### verboseLogging

• **verboseLogging**: `boolean` = `false`

#### Defined in

[GPUComposer.ts:175](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L175)

___

### width

• `Private` **width**: `number`

#### Defined in

[GPUComposer.ts:79](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L79)

## Accessors

### boundaryPositionsBuffer

• `Private` `get` **boundaryPositionsBuffer**(): `WebGLBuffer`

#### Returns

`WebGLBuffer`

#### Defined in

[GPUComposer.ts:416](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L416)

___

### quadPositionsBuffer

• `Private` `get` **quadPositionsBuffer**(): `WebGLBuffer`

#### Returns

`WebGLBuffer`

#### Defined in

[GPUComposer.ts:408](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L408)

___

### wrappedLineColorProgram

• `Private` `get` **wrappedLineColorProgram**(): [`GPUProgram`](GPUProgram.md)

#### Returns

[`GPUProgram`](GPUProgram.md)

#### Defined in

[GPUComposer.ts:382](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L382)

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

[GPUComposer.ts:456](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L456)

___

### \_getVertexShaderWithName

▸ **_getVertexShaderWithName**(`name`, `programName`): `undefined` \| `WebGLProgram`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | [`PROGRAM_NAME_INTERNAL`](../modules.md#program_name_internal) |
| `programName` | `string` |

#### Returns

`undefined` \| `WebGLProgram`

#### Defined in

[GPUComposer.ts:611](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L611)

___

### \_setValueProgramForType

▸ **_setValueProgramForType**(`type`): [`GPUProgram`](GPUProgram.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | [`GPULayerType`](../modules.md#gpulayertype) |

#### Returns

[`GPUProgram`](GPUProgram.md)

#### Defined in

[GPUComposer.ts:338](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L338)

___

### addLayerToInputs

▸ `Private` **addLayerToInputs**(`layer`, `input?`): (`WebGLTexture` \| [`GPULayer`](GPULayer.md))[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `layer` | [`GPULayer`](GPULayer.md) |
| `input?` | `WebGLTexture` \| [`GPULayer`](GPULayer.md) \| (`WebGLTexture` \| [`GPULayer`](GPULayer.md))[] |

#### Returns

(`WebGLTexture` \| [`GPULayer`](GPULayer.md))[]

#### Defined in

[GPUComposer.ts:711](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L711)

___

### copyProgramForType

▸ `Private` **copyProgramForType**(`type`): [`GPUProgram`](GPUProgram.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | [`GPULayerType`](../modules.md#gpulayertype) |

#### Returns

[`GPUProgram`](GPUProgram.md)

#### Defined in

[GPUComposer.ts:360](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L360)

___

### dispose

▸ **dispose**(): `void`

#### Returns

`void`

#### Defined in

[GPUComposer.ts:1675](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L1675)

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

[GPUComposer.ts:1454](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L1454)

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

[GPUComposer.ts:1381](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L1381)

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

[GPUComposer.ts:1548](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L1548)

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

[GPUComposer.ts:1616](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L1616)

___

### drawSetup

▸ `Private` **drawSetup**(`program`, `fullscreenRender`, `input?`, `output?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `program` | `WebGLProgram` |
| `fullscreenRender` | `boolean` |
| `input?` | `WebGLTexture` \| [`GPULayer`](GPULayer.md) \| (`WebGLTexture` \| [`GPULayer`](GPULayer.md))[] |
| `output?` | [`GPULayer`](GPULayer.md) |

#### Returns

`void`

#### Defined in

[GPUComposer.ts:659](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L659)

___

### getCirclePositionsBuffer

▸ `Private` **getCirclePositionsBuffer**(`numSegments`): `WebGLBuffer`

#### Parameters

| Name | Type |
| :------ | :------ |
| `numSegments` | `number` |

#### Returns

`WebGLBuffer`

#### Defined in

[GPUComposer.ts:424](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L424)

___

### glslKeyForType

▸ `Private` **glslKeyForType**(`type`): ``"FLOAT"`` \| ``"INT"`` \| ``"UINT"``

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | [`GPULayerType`](../modules.md#gpulayertype) |

#### Returns

``"FLOAT"`` \| ``"INT"`` \| ``"UINT"``

#### Defined in

[GPUComposer.ts:319](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L319)

___

### initTexture

▸ **initTexture**(`params`): `WebGLTexture`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Object` |
| `params.filter?` | [`GPULayerFilter`](../modules.md#gpulayerfilter) |
| `params.format?` | [`TextureFormat`](../modules.md#textureformat) |
| `params.name` | `string` |
| `params.onLoad?` | (`texture`: `WebGLTexture`) => `void` |
| `params.type?` | ``"UNSIGNED_BYTE"`` |
| `params.url` | `string` |
| `params.wrapS?` | [`GPULayerWrap`](../modules.md#gpulayerwrap) |
| `params.wrapT?` | [`GPULayerWrap`](../modules.md#gpulayerwrap) |

#### Returns

`WebGLTexture`

#### Defined in

[GPUComposer.ts:498](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L498)

___

### initVertexBuffer

▸ `Private` **initVertexBuffer**(`data`): `undefined` \| `WebGLBuffer`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Float32Array` |

#### Returns

`undefined` \| `WebGLBuffer`

#### Defined in

[GPUComposer.ts:440](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L440)

___

### isWebGL2

▸ **isWebGL2**(): `boolean`

#### Returns

`boolean`

#### Defined in

[GPUComposer.ts:315](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L315)

___

### passThroughLayerDataFromInputToOutput

▸ `Private` **passThroughLayerDataFromInputToOutput**(`state`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`GPULayer`](GPULayer.md) |

#### Returns

`void`

#### Defined in

[GPUComposer.ts:735](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L735)

___

### resetThreeState

▸ **resetThreeState**(): `void`

#### Returns

`void`

#### Defined in

[GPUComposer.ts:1661](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L1661)

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

[GPUComposer.ts:648](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L648)

___

### setBlendMode

▸ `Private` **setBlendMode**(`shouldBlendAlpha?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `shouldBlendAlpha?` | `boolean` |

#### Returns

`void`

#### Defined in

[GPUComposer.ts:703](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L703)

___

### setIndexAttribute

▸ `Private` **setIndexAttribute**(`program`, `programName`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `program` | `WebGLProgram` |
| `programName` | `string` |

#### Returns

`void`

#### Defined in

[GPUComposer.ts:813](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L813)

___

### setOutputLayer

▸ `Private` **setOutputLayer**(`fullscreenRender`, `input?`, `output?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `fullscreenRender` | `boolean` |
| `input?` | `WebGLTexture` \| [`GPULayer`](GPULayer.md) \| (`WebGLTexture` \| [`GPULayer`](GPULayer.md))[] |
| `output?` | [`GPULayer`](GPULayer.md) |

#### Returns

`void`

#### Defined in

[GPUComposer.ts:745](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L745)

___

### setPositionAttribute

▸ `Private` **setPositionAttribute**(`program`, `programName`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `program` | `WebGLProgram` |
| `programName` | `string` |

#### Returns

`void`

#### Defined in

[GPUComposer.ts:809](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L809)

___

### setUVAttribute

▸ `Private` **setUVAttribute**(`program`, `programName`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `program` | `WebGLProgram` |
| `programName` | `string` |

#### Returns

`void`

#### Defined in

[GPUComposer.ts:817](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L817)

___

### setVertexAttribute

▸ `Private` **setVertexAttribute**(`program`, `name`, `size`, `programName`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `program` | `WebGLProgram` |
| `name` | `string` |
| `size` | `number` |
| `programName` | `string` |

#### Returns

`void`

#### Defined in

[GPUComposer.ts:796](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L796)

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

[GPUComposer.ts:822](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L822)

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

[GPUComposer.ts:856](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L856)

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

[GPUComposer.ts:951](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L951)

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

[GPUComposer.ts:1306](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L1306)

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

[GPUComposer.ts:914](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L914)

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

[GPUComposer.ts:1059](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L1059)

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

[GPUComposer.ts:992](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L992)

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

[GPUComposer.ts:1252](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L1252)

___

### vectorMagnitudeProgramForType

▸ `Private` **vectorMagnitudeProgramForType**(`type`): [`GPUProgram`](GPUProgram.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | [`GPULayerType`](../modules.md#gpulayertype) |

#### Returns

[`GPUProgram`](GPUProgram.md)

#### Defined in

[GPUComposer.ts:393](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L393)

___

### initWithThreeRenderer

▸ `Static` **initWithThreeRenderer**(`renderer`, `params?`): [`GPUComposer`](GPUComposer.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `renderer` | `WebGLRenderer` |
| `params?` | `Object` |
| `params.errorCallback?` | [`ErrorCallback`](../modules.md#errorcallback) |
| `params.verboseLogging?` | `boolean` |

#### Returns

[`GPUComposer`](GPUComposer.md)

#### Defined in

[GPUComposer.ts:177](https://github.com/amandaghassaei/webgl-compute/blob/a45a425/src/GPUComposer.ts#L177)
