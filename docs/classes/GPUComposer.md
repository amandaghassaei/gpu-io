[gpu-io](../README.md) / GPUComposer

# Class: GPUComposer

## Table of contents

### Properties

- [gl](GPUComposer.md#gl)
- [glslVersion](GPUComposer.md#glslversion)
- [isWebGL2](GPUComposer.md#iswebgl2)
- [intPrecision](GPUComposer.md#intprecision)
- [floatPrecision](GPUComposer.md#floatprecision)
- [verboseLogging](GPUComposer.md#verboselogging)

### Methods

- [initWithThreeRenderer](GPUComposer.md#initwiththreerenderer)
- [resize](GPUComposer.md#resize)
- [step](GPUComposer.md#step)
- [stepBoundary](GPUComposer.md#stepboundary)
- [stepNonBoundary](GPUComposer.md#stepnonboundary)
- [stepCircle](GPUComposer.md#stepcircle)
- [stepSegment](GPUComposer.md#stepsegment)
- [stepRect](GPUComposer.md#steprect)
- [drawLayerAsPoints](GPUComposer.md#drawlayeraspoints)
- [drawLayerAsVectorField](GPUComposer.md#drawlayerasvectorfield)
- [drawLayerAsMesh](GPUComposer.md#drawlayerasmesh)
- [clear](GPUComposer.md#clear)
- [undoThreeState](GPUComposer.md#undothreestate)
- [resetThreeState](GPUComposer.md#resetthreestate)
- [savePNG](GPUComposer.md#savepng)
- [tick](GPUComposer.md#tick)
- [dispose](GPUComposer.md#dispose)

### Constructors

- [constructor](GPUComposer.md#constructor)

### Accessors

- [canvas](GPUComposer.md#canvas)
- [clearValue](GPUComposer.md#clearvalue)
- [numTicks](GPUComposer.md#numticks)

## Properties

### gl

• `Readonly` **gl**: `WebGLRenderingContext` \| `WebGL2RenderingContext`

The WebGL context associated with this GPUComposer.

___

### glslVersion

• `Readonly` **glslVersion**: [`GLSLVersion`](../README.md#glslversion)

The GLSL version being used by the GPUComposer.

___

### isWebGL2

• `Readonly` **isWebGL2**: `boolean`

Flag for WebGL version.

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

Flag to set GPUComposer for verbose logging, defaults to false.

## Methods

### initWithThreeRenderer

▸ `Static` **initWithThreeRenderer**(`renderer`, `params?`): [`GPUComposer`](GPUComposer.md)

Create a GPUComposer from an existing THREE.WebGLRenderer that shares a single WebGL context.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `renderer` | `WebGLRenderer` \| `WebGL1Renderer` | Threejs WebGLRenderer. |
| `params?` | `Object` | GPUComposer parameters. |
| `params.glslVersion?` | [`GLSLVersion`](../README.md#glslversion) | Set the GLSL version to use, defaults to GLSL3 for WebGL2 contexts. |
| `params.intPrecision?` | [`GLSLPrecision`](../README.md#glslprecision) | Set the global integer precision in shader programs. |
| `params.floatPrecision?` | [`GLSLPrecision`](../README.md#glslprecision) | Set the global float precision in shader programs. |
| `params.clearValue?` | `number` \| `number`[] | Value to write to canvas when GPUComposer.clear() is called. |
| `params.verboseLogging?` | `boolean` | Set the verbosity of GPUComposer logging (defaults to false). |
| `params.errorCallback?` | [`ErrorCallback`](../README.md#errorcallback) | Custom error handler, defaults to throwing an Error with message. |

#### Returns

[`GPUComposer`](GPUComposer.md)

___

### resize

▸ **resize**(`dimensions`): `void`

Notify the GPUComposer that the canvas should change size.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `dimensions` | [`number`, `number`] | The new [width, height] to resize to. |

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
| `params.output?` | [`GPULayer`](GPULayer.md) \| [`GPULayer`](GPULayer.md)[] | Output GPULayer, will draw to screen if undefined. |
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
| `params.output?` | [`GPULayer`](GPULayer.md) \| [`GPULayer`](GPULayer.md)[] | Output GPULayer, will draw to screen if undefined. |
| `params.edges?` | [`BoundaryEdge`](../README.md#boundaryedge) \| [`BoundaryEdge`](../README.md#boundaryedge)[] | Specify which edges to step, defaults to stepping entire boundary. |
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
| `params.output?` | [`GPULayer`](GPULayer.md) \| [`GPULayer`](GPULayer.md)[] | Output GPULayer, will draw to screen if undefined. |
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
| `params.position` | `number`[] | Position of center of circle. |
| `params.diameter` | `number` | Circle diameter in pixels. |
| `params.useOutputScale?` | `boolean` | If true position and diameter are scaled relative to the output dimensions, else they are scaled relative to the current canvas size, defaults to false. |
| `params.input?` | [`GPULayer`](GPULayer.md) \| [`GPULayerState`](../README.md#gpulayerstate) \| ([`GPULayer`](GPULayer.md) \| [`GPULayerState`](../README.md#gpulayerstate))[] | Input GPULayers to GPUProgram. |
| `params.output?` | [`GPULayer`](GPULayer.md) \| [`GPULayer`](GPULayer.md)[] | Output GPULayer, will draw to screen if undefined. |
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
| `params.position1` | `number`[] | Position of one end of segment. |
| `params.position2` | `number`[] | Position of the other end of segment. |
| `params.thickness` | `number` | Thickness in pixels. |
| `params.useOutputScale?` | `boolean` | If true position and thickness are scaled relative to the output dimensions, else they are scaled relative to the current canvas size, defaults to false. |
| `params.input?` | [`GPULayer`](GPULayer.md) \| [`GPULayerState`](../README.md#gpulayerstate) \| ([`GPULayer`](GPULayer.md) \| [`GPULayerState`](../README.md#gpulayerstate))[] | Input GPULayers to GPUProgram. |
| `params.output?` | [`GPULayer`](GPULayer.md) \| [`GPULayer`](GPULayer.md)[] | Output GPULayer, will draw to screen if undefined. |
| `params.endCaps?` | `boolean` | Flag to draw with rounded end caps, defaults to false. |
| `params.numCapSegments?` | `number` | Number of segments in rounded end caps, defaults to 9, must be divisible by 3. |
| `params.blendAlpha?` | `boolean` | Blend mode for draw, defaults to false. |

#### Returns

`void`

___

### stepRect

▸ **stepRect**(`params`): `void`

Step GPUProgram inside a rectangle.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | Step parameters. |
| `params.program` | [`GPUProgram`](GPUProgram.md) | GPUProgram to run. |
| `params.position` | `number`[] | Position of one top corner of rectangle. |
| `params.size` | `number`[] | Width and height of rectangle. |
| `params.useOutputScale?` | `boolean` | If true position and size are scaled relative to the output dimensions, else they are scaled relative to the current canvas size, defaults to false. |
| `params.input?` | [`GPULayer`](GPULayer.md) \| [`GPULayerState`](../README.md#gpulayerstate) \| ([`GPULayer`](GPULayer.md) \| [`GPULayerState`](../README.md#gpulayerstate))[] | Input GPULayers to GPUProgram. |
| `params.output?` | [`GPULayer`](GPULayer.md) \| [`GPULayer`](GPULayer.md)[] | Output GPULayer, will draw to screen if undefined. |
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
| `params.layer` | [`GPULayer`](GPULayer.md) | GPULayer containing position data. |
| `params.program?` | [`GPUProgram`](GPUProgram.md) | GPUProgram to run, defaults to drawing points in red. |
| `params.input?` | [`GPULayer`](GPULayer.md) \| [`GPULayerState`](../README.md#gpulayerstate) \| ([`GPULayer`](GPULayer.md) \| [`GPULayerState`](../README.md#gpulayerstate))[] | Input GPULayers for GPUProgram. |
| `params.output?` | [`GPULayer`](GPULayer.md) \| [`GPULayer`](GPULayer.md)[] | Output GPULayer, will draw to screen if undefined. |
| `params.pointSize?` | `number` | Pixel size of points. |
| `params.useOutputScale?` | `boolean` | If true position and pointSize are scaled relative to the output dimensions, else they are scaled relative to the current canvas size, defaults to false. |
| `params.count?` | `number` | How many points to draw, defaults to positions.length. |
| `params.color?` | `number`[] | (If no program passed in) RGB color in range [0, 1] to draw points. |
| `params.wrapX?` | `boolean` | Wrap points positions in X, defaults to false. |
| `params.wrapY?` | `boolean` | Wrap points positions in Y, defaults to false. |
| `params.blendAlpha?` | `boolean` | Blend mode for draw, defaults to false. |

#### Returns

`void`

___

### drawLayerAsVectorField

▸ **drawLayerAsVectorField**(`params`): `void`

Draw the contents of a 2 component GPULayer as a vector field.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | Draw parameters. |
| `params.layer` | [`GPULayer`](GPULayer.md) | GPULayer containing vector data. |
| `params.program?` | [`GPUProgram`](GPUProgram.md) | GPUProgram to run, defaults to drawing vector lines in red. |
| `params.input?` | [`GPULayer`](GPULayer.md) \| [`GPULayerState`](../README.md#gpulayerstate) \| ([`GPULayer`](GPULayer.md) \| [`GPULayerState`](../README.md#gpulayerstate))[] | Input GPULayers for GPUProgram. |
| `params.output?` | [`GPULayer`](GPULayer.md) \| [`GPULayer`](GPULayer.md)[] | Output GPULayer, will draw to screen if undefined. |
| `params.vectorSpacing?` | `number` | Spacing between vectors, defaults to drawing a vector every 10 pixels. |
| `params.vectorScale?` | `number` | Scale factor to apply to vector lengths. |
| `params.color?` | `number`[] | (If no program passed in) RGB color in range [0, 1] to draw points. |
| `params.blendAlpha?` | `boolean` | Blend mode for draw, defaults to false. |

#### Returns

`void`

___

### drawLayerAsMesh

▸ **drawLayerAsMesh**(`params`): `void`

Draw 2D mesh to screen.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | Draw parameters. |
| `params.layer` | [`GPULayer`](GPULayer.md) | GPULayer containing vector data. |
| `params.indices?` | [`GPUIndexBuffer`](GPUIndexBuffer.md) | GPUIndexBuffer containing mesh index data. |
| `params.program?` | [`GPUProgram`](GPUProgram.md) | GPUProgram to run, defaults to drawing vector lines in red. |
| `params.input?` | [`GPULayer`](GPULayer.md) \| [`GPULayerState`](../README.md#gpulayerstate) \| ([`GPULayer`](GPULayer.md) \| [`GPULayerState`](../README.md#gpulayerstate))[] | Input GPULayers for GPUProgram. |
| `params.output?` | [`GPULayer`](GPULayer.md) \| [`GPULayer`](GPULayer.md)[] | Output GPULayer, will draw to screen if undefined. |
| `params.useOutputScale?` | `boolean` | If true positions are scaled relative to the output dimensions, else they are scaled relative to the current canvas size, defaults to false. |
| `params.color?` | `number`[] | (If no program passed in) RGB color in range [0, 1] to draw points. |
| `params.blendAlpha?` | `boolean` | Blend mode for draw, defaults to false. |

#### Returns

`void`

___

### clear

▸ **clear**(): `void`

Clear all data in canvas to GPUComposer.clearValue.

#### Returns

`void`

___

### undoThreeState

▸ **undoThreeState**(): `void`

If this GPUComposer has been inited via GPUComposer.initWithThreeRenderer(), call undoThreeState() in render loop before performing any gpu-io step or draw functions.

#### Returns

`void`

___

### resetThreeState

▸ **resetThreeState**(): `void`

If this GPUComposer has been inited via GPUComposer.initWithThreeRenderer(), call resetThreeState() in render loop after performing any gpu-io step or draw functions.

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
| `params.callback?` | (`blob`: `Blob`, `filename`: `string`) => `void` | Optional callback when Blob is ready, default behavior saves the PNG using file-saver. |

#### Returns

`void`

___

### tick

▸ **tick**(): `Object`

Call tick() from your render loop to measure the FPS of your application.
Internally, this does some low pass filtering to give consistent results.

#### Returns

`Object`

An Object containing the current fps of your application and the number of times tick() has been called.

| Name | Type |
| :------ | :------ |
| `fps` | `number` |
| `numTicks` | `number` |

___

### dispose

▸ **dispose**(): `void`

Deallocate GPUComposer instance and associated WebGL properties.

#### Returns

`void`

## Constructors

### constructor

• **new GPUComposer**(`params`)

Create a GPUComposer.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | GPUComposer parameters. |
| `params.canvas` | `HTMLCanvasElement` | HTMLCanvasElement associated with this GPUComposer (you must add to DOM yourself). |
| `params.context?` | `WebGLRenderingContext` \| `WebGL2RenderingContext` | Pass in a WebGL context for the GPUComposer to user. |
| `params.contextID?` | `string` | Set the contextID to use when initing a new WebGL context. |
| `params.contextAttributes?` | `Object` | Options to pass to WebGL context on initialization (see https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext for more information). |
| `params.glslVersion?` | [`GLSLVersion`](../README.md#glslversion) | Set the GLSL version to use, defaults to GLSL3 for WebGL2 contexts. |
| `params.intPrecision?` | [`GLSLPrecision`](../README.md#glslprecision) | Set the global integer precision in shader programs. |
| `params.floatPrecision?` | [`GLSLPrecision`](../README.md#glslprecision) | Set the global float precision in shader programs. |
| `params.clearValue?` | `number` \| `number`[] | Value to write to canvas when GPUComposer.clear() is called. |
| `params.verboseLogging?` | `boolean` | Set the verbosity of GPUComposer logging (defaults to false). |
| `params.errorCallback?` | [`ErrorCallback`](../README.md#errorcallback) | Custom error handler, defaults to throwing an Error with message. |

## Accessors

### canvas

• `get` **canvas**(): `HTMLCanvasElement`

#### Returns

`HTMLCanvasElement`

___

### clearValue

• `get` **clearValue**(): `number` \| `number`[]

Get the clearValue of the GPUComposer.

#### Returns

`number` \| `number`[]

• `set` **clearValue**(`clearValue`): `void`

Set the clearValue of the GPUComposer, which is applied during GPUComposer.clear().

#### Parameters

| Name | Type |
| :------ | :------ |
| `clearValue` | `number` \| `number`[] |

#### Returns

`void`

___

### numTicks

• `get` **numTicks**(): `number`

Return the number of ticks of the simulation.
Use GPUComposer.tick() to increment this value on each animation cycle.

#### Returns

`number`
