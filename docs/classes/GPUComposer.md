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
- [drawLayerAsPoints](GPUComposer.md#drawlayeraspoints)
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
| `params.contextAttributes?` | `Object` | Options to pass to WebGL context on initialization (see https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext for ore information). |
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

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | Step parameters. |
| `params.program` | [`GPUProgram`](GPUProgram.md) | GPUProgram to run. |
| `params.input?` | [`GPULayer`](GPULayer.md) \| [`GPULayerState`](../README.md#gpulayerstate) \| ([`GPULayer`](GPULayer.md) \| [`GPULayerState`](../README.md#gpulayerstate))[] | Input GPULayers to GPUProgram. |
| `params.output?` | [`GPULayer`](GPULayer.md) | Output GPULayer, will draw to screen if undefined. |
| `params.blendAlpha?` | `boolean` | Blend mode for draw, defaults to false. |

#### Returns

`void`

___

### stepBoundary

▸ **stepBoundary**(`params`): `void`

Step GPUProgram only for a 1px strip of pixels along the boundary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | Step parameters. |
| `params.program` | [`GPUProgram`](GPUProgram.md) | GPUProgram to run. |
| `params.input?` | [`GPULayer`](GPULayer.md) \| [`GPULayerState`](../README.md#gpulayerstate) \| ([`GPULayer`](GPULayer.md) \| [`GPULayerState`](../README.md#gpulayerstate))[] | Input GPULayers to GPUProgram. |
| `params.output?` | [`GPULayer`](GPULayer.md) | Output GPULayer, will draw to screen if undefined. |
| `params.edges?` | [`BOUNDARY_EDGE`](../README.md#boundary_edge) \| [`BOUNDARY_EDGE`](../README.md#boundary_edge)[] | Specify which edges to step, defaults to stepping entire boundary. |
| `params.blendAlpha?` | `boolean` | Blend mode for draw, defaults to false. |

#### Returns

`void`

___

### stepNonBoundary

▸ **stepNonBoundary**(`params`): `void`

Step GPUProgram for all but a 1px strip of pixels along the boundary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | Step parameters. |
| `params.program` | [`GPUProgram`](GPUProgram.md) | GPUProgram to run. |
| `params.input?` | [`GPULayer`](GPULayer.md) \| [`GPULayerState`](../README.md#gpulayerstate) \| ([`GPULayer`](GPULayer.md) \| [`GPULayerState`](../README.md#gpulayerstate))[] | Input GPULayers to GPUProgram. |
| `params.output?` | [`GPULayer`](GPULayer.md) | Output GPULayer, will draw to screen if undefined. |
| `params.blendAlpha?` | `boolean` | Blend mode for draw, defaults to false. |

#### Returns

`void`

___

### stepCircle

▸ **stepCircle**(`params`): `void`

Step GPUProgram inside a circular spot.  This is useful for touch interactions.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | Step parameters. |
| `params.program` | [`GPUProgram`](GPUProgram.md) | GPUProgram to run. |
| `params.position` | [`number`, `number`] | Position of center of circle. |
| `params.diameter` | `number` | Circle diameter in pixels. |
| `params.input?` | [`GPULayer`](GPULayer.md) \| [`GPULayerState`](../README.md#gpulayerstate) \| ([`GPULayer`](GPULayer.md) \| [`GPULayerState`](../README.md#gpulayerstate))[] | Input GPULayers to GPUProgram. |
| `params.output?` | [`GPULayer`](GPULayer.md) | Output GPULayer, will draw to screen if undefined. |
| `params.numSegments?` | `number` | Number of segments in circle, defaults to 18. |
| `params.blendAlpha?` | `boolean` | Blend mode for draw, defaults to false. |

#### Returns

`void`

___

### stepSegment

▸ **stepSegment**(`params`): `void`

Step GPUProgram inside a line segment (rounded end caps available).
This is useful for touch interactions during pointermove.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | Step parameters. |
| `params.program` | [`GPUProgram`](GPUProgram.md) | GPUProgram to run. |
| `params.position1` | [`number`, `number`] | Position of one end of segment. |
| `params.position2` | [`number`, `number`] | Position of the other end of segment. |
| `params.thickness` | `number` | Thickness in pixels. |
| `params.input?` | [`GPULayer`](GPULayer.md) \| [`GPULayerState`](../README.md#gpulayerstate) \| ([`GPULayer`](GPULayer.md) \| [`GPULayerState`](../README.md#gpulayerstate))[] | Input GPULayers to GPUProgram. |
| `params.output?` | [`GPULayer`](GPULayer.md) | Output GPULayer, will draw to screen if undefined. |
| `params.endCaps?` | `boolean` | Flag to draw with rounded end caps, defaults to false. |
| `params.numCapSegments?` | `number` | - |
| `params.blendAlpha?` | `boolean` | Blend mode for draw, defaults to false. |

#### Returns

`void`

___

### drawLayerAsPoints

▸ **drawLayerAsPoints**(`params`): `void`

Draw the contents of a GPULayer as points.  This assumes the components of the GPULayer have the form [xPosition, yPosition] or [xPosition, yPosition, xOffset, yOffset].

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | Draw parameters. |
| `params.positions` | [`GPULayer`](GPULayer.md) | GPULayer containing position data. |
| `params.program?` | [`GPUProgram`](GPUProgram.md) | GPUProgram to run, defaults to drawing points in red. |
| `params.input?` | [`GPULayer`](GPULayer.md) \| [`GPULayerState`](../README.md#gpulayerstate) \| ([`GPULayer`](GPULayer.md) \| [`GPULayerState`](../README.md#gpulayerstate))[] | Input GPULayers to GPUProgram. |
| `params.output?` | [`GPULayer`](GPULayer.md) | Output GPULayer, will draw to screen if undefined. |
| `params.pointSize?` | `number` | Pixel size of points. |
| `params.count?` | `number` | How many point sto draw, defaults to positions.length. |
| `params.color?` | [`number`, `number`, `number`] | (If no program passed in) RGB color in range [0, 1] to draw points. |
| `params.wrapX?` | `boolean` | Wrap points positions in X, defaults to false. |
| `params.wrapY?` | `boolean` | Wrap points positions in Y, defaults to false. |
| `params.blendAlpha?` | `boolean` | Blend mode for draw, defaults to false. |

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
