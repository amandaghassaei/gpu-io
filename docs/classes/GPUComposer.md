[gpu-io](../README.md) / GPUComposer

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
- [savePNG](GPUComposer.md#savepng)
- [tick](GPUComposer.md#tick)
- [dispose](GPUComposer.md#dispose)

## Properties

### canvas

• `Readonly` **canvas**: `HTMLCanvasElement`

The canvas element associated with this GPUcomposer.

___

### gl

• `Readonly` **gl**: `WebGLRenderingContext` \| `WebGL2RenderingContext`

The WebGL context associated with this GPUcomposer.

___

### glslVersion

• `Readonly` **glslVersion**: [`GLSLVersion`](../README.md#glslversion)

The GLSL version being used by the GPUComposer.

___

### intPrecision

• `Readonly` **intPrecision**: [`GLSLPrecision`](../README.md#glslprecision)

The global integer precision to apply to shader programs.

___

### floatPrecision

• `Readonly` **floatPrecision**: [`GLSLPrecision`](../README.md#glslprecision)

The global float precision to apply to shader programs.

___

### verboseLogging

• **verboseLogging**: `boolean` = `false`

Flag to set GPUcomposer for verbose logging, defaults to false.

## Constructors

### constructor

• **new GPUComposer**(`params`)

Create a GPUComposer.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | GPUComposer parameters. |
| `params.canvas` | `HTMLCanvasElement` | HTMLCanvasElement associated with this GPUComposer (you must add to DOM yourself). |
| `params.context?` | `WebGLRenderingContext` \| `WebGL2RenderingContext` | Pass in a WebGL context for the GPUcomposer to user. |
| `params.contextID?` | `string` | Set the contextID to use when initing a new WebGL context. |
| `params.contextOptions?` | `Object` | Options to pass to WebGL context on initialization. |
| `params.contextOptions.antialias?` | `boolean` | - |
| `params.glslVersion?` | [`GLSLVersion`](../README.md#glslversion) | Set the GLSL version to use, defaults to GLSL3 for WebGL2 contexts. |
| `params.intPrecision?` | [`GLSLPrecision`](../README.md#glslprecision) | Set the global integer precision in shader programs. |
| `params.floatPrecision?` | [`GLSLPrecision`](../README.md#glslprecision) | Set the global float precision in shader programs. |
| `params.verboseLogging?` | `boolean` | Set the verbosity of GPUComposer logging (defaults to false). |
| `params.errorCallback?` | [`ErrorCallback`](../README.md#errorcallback) | Custom error handler, defaults to throwing an Error with message. |

## Methods

### initWithThreeRenderer

▸ `Static` **initWithThreeRenderer**(`renderer`, `params?`): [`GPUComposer`](GPUComposer.md)

Create a GPUComposer from an existing THREE.WebGLRenderer that shares a single WebGL context.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `renderer` | `WebGLRenderer` | Threejs WebGLRenderer. |
| `params?` | `Object` | GPUComposer parameters. |
| `params.intPrecision?` | [`GLSLPrecision`](../README.md#glslprecision) | Set the global integer precision in shader programs. |
| `params.floatPrecision?` | [`GLSLPrecision`](../README.md#glslprecision) | Set the global float precision in shader programs. |
| `params.verboseLogging?` | `boolean` | Set the verbosity of GPUComposer logging (defaults to false). |
| `params.errorCallback?` | [`ErrorCallback`](../README.md#errorcallback) | Custom error handler, defaults to throwing an Error with message. |

#### Returns

[`GPUComposer`](GPUComposer.md)

___

### isWebGL2

▸ **isWebGL2**(): `boolean`

Test whether this GPUComposer is using WebGL2 (may depend on browser support).

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

Notify the GPUComposer that the canvas should change size.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `width` | `number` | The width of the canvas element. |
| `height` | `number` | The height of the canvas element. |

#### Returns

`void`

___

### step

▸ **step**(`params`): `void`

Step GPUProgram entire fullscreen quad.

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Object` |
| `params.program` | [`GPUProgram`](GPUProgram.md) |
| `params.input?` | [`GPULayer`](GPULayer.md) \| [`GPULayerState`](../README.md#gpulayerstate) \| ([`GPULayer`](GPULayer.md) \| [`GPULayerState`](../README.md#gpulayerstate))[] |
| `params.output?` | [`GPULayer`](GPULayer.md) |
| `params.shouldBlendAlpha?` | `boolean` |

#### Returns

`void`

___

### stepBoundary

▸ **stepBoundary**(`params`): `void`

Step GPUProgram only for a 1px strip of pixels along the boundary.

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Object` |
| `params.program` | [`GPUProgram`](GPUProgram.md) |
| `params.input?` | [`GPULayer`](GPULayer.md) \| [`GPULayerState`](../README.md#gpulayerstate) \| ([`GPULayer`](GPULayer.md) \| [`GPULayerState`](../README.md#gpulayerstate))[] |
| `params.output?` | [`GPULayer`](GPULayer.md) |
| `params.edges?` | [`BOUNDARY_EDGE`](../README.md#boundary_edge) \| [`BOUNDARY_EDGE`](../README.md#boundary_edge)[] |
| `params.shouldBlendAlpha?` | `boolean` |

#### Returns

`void`

___

### stepNonBoundary

▸ **stepNonBoundary**(`params`): `void`

Step GPUProgram for all but a 1px strip of pixels along the boundary.

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Object` |
| `params.program` | [`GPUProgram`](GPUProgram.md) |
| `params.input?` | [`GPULayer`](GPULayer.md) \| [`GPULayerState`](../README.md#gpulayerstate) \| ([`GPULayer`](GPULayer.md) \| [`GPULayerState`](../README.md#gpulayerstate))[] |
| `params.output?` | [`GPULayer`](GPULayer.md) |
| `params.shouldBlendAlpha?` | `boolean` |

#### Returns

`void`

___

### stepCircle

▸ **stepCircle**(`params`): `void`

Step GPUProgram inside a circular spot.
This is useful for touch interactions.

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Object` |
| `params.program` | [`GPUProgram`](GPUProgram.md) |
| `params.position` | [`number`, `number`] |
| `params.diameter` | `number` |
| `params.input?` | [`GPULayer`](GPULayer.md) \| [`GPULayerState`](../README.md#gpulayerstate) \| ([`GPULayer`](GPULayer.md) \| [`GPULayerState`](../README.md#gpulayerstate))[] |
| `params.output?` | [`GPULayer`](GPULayer.md) |
| `params.numSegments?` | `number` |
| `params.shouldBlendAlpha?` | `boolean` |

#### Returns

`void`

___

### stepSegment

▸ **stepSegment**(`params`): `void`

Step GPUProgram inside a line segment (rounded end caps available).
This is useful for touch interactions during pointermove.

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Object` |
| `params.program` | [`GPUProgram`](GPUProgram.md) |
| `params.position1` | [`number`, `number`] |
| `params.position2` | [`number`, `number`] |
| `params.thickness` | `number` |
| `params.input?` | [`GPULayer`](GPULayer.md) \| [`GPULayerState`](../README.md#gpulayerstate) \| ([`GPULayer`](GPULayer.md) \| [`GPULayerState`](../README.md#gpulayerstate))[] |
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
| `params.input?` | [`GPULayer`](GPULayer.md) \| [`GPULayerState`](../README.md#gpulayerstate) \| ([`GPULayer`](GPULayer.md) \| [`GPULayerState`](../README.md#gpulayerstate))[] |
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
| `params.input?` | [`GPULayer`](GPULayer.md) \| [`GPULayerState`](../README.md#gpulayerstate) \| ([`GPULayer`](GPULayer.md) \| [`GPULayerState`](../README.md#gpulayerstate))[] |
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
| `params.input?` | [`GPULayer`](GPULayer.md) \| [`GPULayerState`](../README.md#gpulayerstate) \| ([`GPULayer`](GPULayer.md) \| [`GPULayerState`](../README.md#gpulayerstate))[] |
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
| `params.input?` | [`GPULayer`](GPULayer.md) \| [`GPULayerState`](../README.md#gpulayerstate) \| ([`GPULayer`](GPULayer.md) \| [`GPULayerState`](../README.md#gpulayerstate))[] |
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
| `params.input?` | [`GPULayer`](GPULayer.md) \| [`GPULayerState`](../README.md#gpulayerstate) \| ([`GPULayer`](GPULayer.md) \| [`GPULayerState`](../README.md#gpulayerstate))[] |
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
| `params.input?` | [`GPULayer`](GPULayer.md) \| [`GPULayerState`](../README.md#gpulayerstate) \| ([`GPULayer`](GPULayer.md) \| [`GPULayerState`](../README.md#gpulayerstate))[] |
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
| `params.input?` | [`GPULayer`](GPULayer.md) \| [`GPULayerState`](../README.md#gpulayerstate) \| ([`GPULayer`](GPULayer.md) \| [`GPULayerState`](../README.md#gpulayerstate))[] |
| `params.output?` | [`GPULayer`](GPULayer.md) |
| `params.scale?` | `number` |
| `params.color?` | [`number`, `number`, `number`] |
| `params.shouldBlendAlpha?` | `boolean` |

#### Returns

`void`

___

### resetThreeState

▸ **resetThreeState**(): `void`

If this GPUComposer has been inited via GPUComposer.initWithThreeRenderer(), call resetThreeState() in render loop after performing any step or draw functions.

#### Returns

`void`

___

### savePNG

▸ **savePNG**(`params?`): `void`

Save the current state of the canvas to png.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | PNG parameters. |
| `params.filename?` | `string` | PNG filename (no extension). |
| `params.dpi?` | `number` | PNG dpi (defaults to 72dpi). |
| `params.multiplier?` | `number` | - |
| `params.callback?` | (`blob`: `Blob`, `filename`: `string`) => `void` | - |

#### Returns

`void`

___

### tick

▸ **tick**(): { `fps`: `number` = 0; `milliseconds`: `number` = 0; `numTicks`: `undefined`  } \| { `milliseconds`: `undefined` = 0; `fps`: `number` ; `numTicks`: `number`  }

Call tick() from your render loop to measure the FPS of your application.
Internally, this does some low pass filtering to give consistent results.

#### Returns

{ `fps`: `number` = 0; `milliseconds`: `number` = 0; `numTicks`: `undefined`  } \| { `milliseconds`: `undefined` = 0; `fps`: `number` ; `numTicks`: `number`  }

___

### dispose

▸ **dispose**(): `void`

Deallocate GPUComposer instance and associated WebGL properties.

#### Returns

`void`
