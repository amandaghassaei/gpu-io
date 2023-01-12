gpu-io

# gpu-io

## Table of contents

### Classes

- [GPUComposer](classes/GPUComposer.md)
- [GPUIndexBuffer](classes/GPUIndexBuffer.md)
- [GPULayer](classes/GPULayer.md)
- [GPUProgram](classes/GPUProgram.md)

### Variables

- [HALF\_FLOAT](README.md#half_float)
- [FLOAT](README.md#float)
- [UNSIGNED\_BYTE](README.md#unsigned_byte)
- [BYTE](README.md#byte)
- [UNSIGNED\_SHORT](README.md#unsigned_short)
- [SHORT](README.md#short)
- [UNSIGNED\_INT](README.md#unsigned_int)
- [INT](README.md#int)
- [BOOL](README.md#bool)
- [UINT](README.md#uint)
- [NEAREST](README.md#nearest)
- [LINEAR](README.md#linear)
- [CLAMP\_TO\_EDGE](README.md#clamp_to_edge)
- [REPEAT](README.md#repeat)
- [RGB](README.md#rgb)
- [RGBA](README.md#rgba)
- [GLSL3](README.md#glsl3)
- [GLSL1](README.md#glsl1)
- [WEBGL2](README.md#webgl2)
- [WEBGL1](README.md#webgl1)
- [EXPERIMENTAL\_WEBGL](README.md#experimental_webgl)
- [EXPERIMENTAL\_WEBGL2](README.md#experimental_webgl2)
- [PRECISION\_LOW\_P](README.md#precision_low_p)
- [PRECISION\_MEDIUM\_P](README.md#precision_medium_p)
- [PRECISION\_HIGH\_P](README.md#precision_high_p)
- [BOUNDARY\_TOP](README.md#boundary_top)
- [BOUNDARY\_BOTTOM](README.md#boundary_bottom)
- [BOUNDARY\_LEFT](README.md#boundary_left)
- [BOUNDARY\_RIGHT](README.md#boundary_right)

### Type Aliases

- [GPULayerArray](README.md#gpulayerarray)
- [GPULayerType](README.md#gpulayertype)
- [GPULayerNumComponents](README.md#gpulayernumcomponents)
- [GPULayerFilter](README.md#gpulayerfilter)
- [GPULayerWrap](README.md#gpulayerwrap)
- [GPULayerState](README.md#gpulayerstate)
- [ImageFormat](README.md#imageformat)
- [ImageType](README.md#imagetype)
- [GLSLVersion](README.md#glslversion)
- [GLSLPrecision](README.md#glslprecision)
- [UniformType](README.md#uniformtype)
- [UniformValue](README.md#uniformvalue)
- [UniformParams](README.md#uniformparams)
- [CompileTimeConstants](README.md#compiletimeconstants)
- [ErrorCallback](README.md#errorcallback)
- [BoundaryEdge](README.md#boundaryedge)

### GPUProgram Helper Functions

- [copyProgram](README.md#copyprogram)
- [addLayersProgram](README.md#addlayersprogram)
- [addValueProgram](README.md#addvalueprogram)
- [multiplyValueProgram](README.md#multiplyvalueprogram)
- [setValueProgram](README.md#setvalueprogram)
- [setColorProgram](README.md#setcolorprogram)
- [zeroProgram](README.md#zeroprogram)
- [renderRGBProgram](README.md#renderrgbprogram)
- [renderAmplitudeProgram](README.md#renderamplitudeprogram)
- [renderSignedAmplitudeProgram](README.md#rendersignedamplitudeprogram)

### Other Functions

- [isWebGL2](README.md#iswebgl2)
- [isWebGL2Supported](README.md#iswebgl2supported)
- [isHighpSupportedInVertexShader](README.md#ishighpsupportedinvertexshader)
- [isHighpSupportedInFragmentShader](README.md#ishighpsupportedinfragmentshader)
- [getVertexShaderMediumpPrecision](README.md#getvertexshadermediumpprecision)
- [getFragmentShaderMediumpPrecision](README.md#getfragmentshadermediumpprecision)

## Variables

### HALF\_FLOAT

• `Const` **HALF\_FLOAT**: ``"HALF_FLOAT"``

Half float data type.

___

### FLOAT

• `Const` **FLOAT**: ``"FLOAT"``

Float data type.

___

### UNSIGNED\_BYTE

• `Const` **UNSIGNED\_BYTE**: ``"UNSIGNED_BYTE"``

Unsigned byte data type.

___

### BYTE

• `Const` **BYTE**: ``"BYTE"``

Byte data type.

___

### UNSIGNED\_SHORT

• `Const` **UNSIGNED\_SHORT**: ``"UNSIGNED_SHORT"``

Unsigned short data type.

___

### SHORT

• `Const` **SHORT**: ``"SHORT"``

Short data type.

___

### UNSIGNED\_INT

• `Const` **UNSIGNED\_INT**: ``"UNSIGNED_INT"``

Unsigned int data type.

___

### INT

• `Const` **INT**: ``"INT"``

Int data type.

___

### BOOL

• `Const` **BOOL**: ``"BOOL"``

Boolean data type (GPUProgram uniforms only).

___

### UINT

• `Const` **UINT**: ``"UINT"``

Unsigned int data type (GPUProgram uniforms only).

___

### NEAREST

• `Const` **NEAREST**: ``"NEAREST"``

Nearest texture filtering.

___

### LINEAR

• `Const` **LINEAR**: ``"LINEAR"``

Linear texture filtering.

___

### CLAMP\_TO\_EDGE

• `Const` **CLAMP\_TO\_EDGE**: ``"CLAMP_TO_EDGE"``

Clamp to edge wrapping (no wrapping).

___

### REPEAT

• `Const` **REPEAT**: ``"REPEAT"``

Repeat/periodic wrapping.

___

### RGB

• `Const` **RGB**: ``"RGB"``

RGB image format.

___

### RGBA

• `Const` **RGBA**: ``"RGBA"``

RGBA image format.

___

### GLSL3

• `Const` **GLSL3**: ``"300 es"``

GLSL version 300 (WebGL2 only).

___

### GLSL1

• `Const` **GLSL1**: ``"100"``

GLSL version 100 (WebGL1 and WebGL2).

___

### WEBGL2

• `Const` **WEBGL2**: ``"webgl2"``

WebGL2 context ID.

___

### WEBGL1

• `Const` **WEBGL1**: ``"webgl"``

WebGL1 context ID.

___

### EXPERIMENTAL\_WEBGL

• `Const` **EXPERIMENTAL\_WEBGL**: ``"experimental-webgl"``

Experimental WebGL context ID.

___

### EXPERIMENTAL\_WEBGL2

• `Const` **EXPERIMENTAL\_WEBGL2**: ``"experimental-webgl2"``

Experimental WebGL context ID.

___

### PRECISION\_LOW\_P

• `Const` **PRECISION\_LOW\_P**: ``"lowp"``

GLSL lowp precision declaration.

___

### PRECISION\_MEDIUM\_P

• `Const` **PRECISION\_MEDIUM\_P**: ``"mediump"``

GLSL mediump precision declaration.

___

### PRECISION\_HIGH\_P

• `Const` **PRECISION\_HIGH\_P**: ``"highp"``

GLSL highp precision declaration.

___

### BOUNDARY\_TOP

• `Const` **BOUNDARY\_TOP**: ``"BOUNDARY_TOP"``

___

### BOUNDARY\_BOTTOM

• `Const` **BOUNDARY\_BOTTOM**: ``"BOUNDARY_BOTTOM"``

___

### BOUNDARY\_LEFT

• `Const` **BOUNDARY\_LEFT**: ``"BOUNDARY_LEFT"``

___

### BOUNDARY\_RIGHT

• `Const` **BOUNDARY\_RIGHT**: ``"BOUNDARY_RIGHT"``

## Type Aliases

### GPULayerArray

Ƭ **GPULayerArray**: `Float32Array` \| `Uint8Array` \| `Int8Array` \| `Uint16Array` \| `Int16Array` \| `Uint32Array` \| `Int32Array`

GPULayer array types.

___

### GPULayerType

Ƭ **GPULayerType**: typeof [`HALF_FLOAT`](README.md#half_float) \| typeof [`FLOAT`](README.md#float) \| typeof [`UNSIGNED_BYTE`](README.md#unsigned_byte) \| typeof [`BYTE`](README.md#byte) \| typeof [`UNSIGNED_SHORT`](README.md#unsigned_short) \| typeof [`SHORT`](README.md#short) \| typeof [`UNSIGNED_INT`](README.md#unsigned_int) \| typeof [`INT`](README.md#int)

GPULayer data types.

___

### GPULayerNumComponents

Ƭ **GPULayerNumComponents**: ``1`` \| ``2`` \| ``3`` \| ``4``

GPULayer numComponents options.

___

### GPULayerFilter

Ƭ **GPULayerFilter**: typeof [`LINEAR`](README.md#linear) \| typeof [`NEAREST`](README.md#nearest)

GPULayer filter/interpolation types.

___

### GPULayerWrap

Ƭ **GPULayerWrap**: typeof [`REPEAT`](README.md#repeat) \| typeof [`CLAMP_TO_EDGE`](README.md#clamp_to_edge)

GPULayer wrap types.

___

### GPULayerState

Ƭ **GPULayerState**: `Object`

The WebGLTexture corresponding to a GPULayer buffer (e.g. currentState or lastState).
This data structure also includes a reference back to the GPULayer that it originated from.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `texture` | `WebGLTexture` |
| `layer` | [`GPULayer`](classes/GPULayer.md) |

___

### ImageFormat

Ƭ **ImageFormat**: typeof [`RGB`](README.md#rgb) \| typeof [`RGBA`](README.md#rgba)

Image formats for GPULayer.initFromImage().

___

### ImageType

Ƭ **ImageType**: typeof [`UNSIGNED_BYTE`](README.md#unsigned_byte) \| typeof [`FLOAT`](README.md#float) \| typeof [`HALF_FLOAT`](README.md#half_float)

Image types for GPULayer.initFromImage().

___

### GLSLVersion

Ƭ **GLSLVersion**: typeof [`GLSL1`](README.md#glsl1) \| typeof [`GLSL3`](README.md#glsl3)

GLSL available versions.

___

### GLSLPrecision

Ƭ **GLSLPrecision**: typeof [`PRECISION_LOW_P`](README.md#precision_low_p) \| typeof [`PRECISION_MEDIUM_P`](README.md#precision_medium_p) \| typeof [`PRECISION_HIGH_P`](README.md#precision_high_p)

GLSL available precision declarations.

___

### UniformType

Ƭ **UniformType**: typeof [`FLOAT`](README.md#float) \| typeof [`INT`](README.md#int) \| typeof [`UINT`](README.md#uint) \| typeof [`BOOL`](README.md#bool)

GPUProgram uniform types.

___

### UniformValue

Ƭ **UniformValue**: `boolean` \| `boolean`[] \| `number` \| `number`[]

GPUProgram uniform values.

___

### UniformParams

Ƭ **UniformParams**: `Object`

GPUProgram uniform parameters.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `value` | [`UniformValue`](README.md#uniformvalue) |
| `type` | [`UniformType`](README.md#uniformtype) |

___

### CompileTimeConstants

Ƭ **CompileTimeConstants**: `Object`

Object containing compile time #define constants for GPUProgram fragment shader.

#### Index signature

▪ [key: `string`]: `string`

___

### ErrorCallback

Ƭ **ErrorCallback**: (`message`: `string`) => `void`

#### Type declaration

▸ (`message`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |

##### Returns

`void`

___

### BoundaryEdge

Ƭ **BoundaryEdge**: typeof [`BOUNDARY_TOP`](README.md#boundary_top) \| typeof [`BOUNDARY_BOTTOM`](README.md#boundary_bottom) \| typeof [`BOUNDARY_LEFT`](README.md#boundary_left) \| typeof [`BOUNDARY_RIGHT`](README.md#boundary_right)

## GPUProgram Helper Functions

### copyProgram

▸ **copyProgram**(`composer`, `params`): [`GPUProgram`](classes/GPUProgram.md)

Init GPUProgram to copy contents of one GPULayer to another GPULayer.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `composer` | [`GPUComposer`](classes/GPUComposer.md) | The current GPUComposer. |
| `params` | `Object` | Program parameters. |
| `params.type` | [`GPULayerType`](README.md#gpulayertype) | The type of the input/output. |
| `params.name?` | `string` | Optionally pass in a GPUProgram name, used for error logging. |
| `params.precision?` | [`GLSLPrecision`](README.md#glslprecision) | Optionally specify the precision of the input/output. |

#### Returns

[`GPUProgram`](classes/GPUProgram.md)

___

### addLayersProgram

▸ **addLayersProgram**(`composer`, `params`): [`GPUProgram`](classes/GPUProgram.md)

Init GPUProgram to add several GPULayers together.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `composer` | [`GPUComposer`](classes/GPUComposer.md) | The current GPUComposer. |
| `params` | `Object` | Program parameters. |
| `params.type` | [`GPULayerType`](README.md#gpulayertype) | The type of the inputs/output. |
| `params.components?` | `string` | Component(s) of inputs to add, defaults to 'xyzw. |
| `params.name?` | `string` | Optionally pass in a GPUProgram name, used for error logging. |
| `params.numInputs?` | `number` | The number of inputs to add together, defaults to 2. |
| `params.precision?` | [`GLSLPrecision`](README.md#glslprecision) | Optionally specify the precision of the inputs/output. |

#### Returns

[`GPUProgram`](classes/GPUProgram.md)

___

### addValueProgram

▸ **addValueProgram**(`composer`, `params`): [`GPUProgram`](classes/GPUProgram.md)

Init GPUProgram to add uniform "u_value" to a GPULayer.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `composer` | [`GPUComposer`](classes/GPUComposer.md) | The current GPUComposer. |
| `params` | `Object` | Program parameters. |
| `params.type` | [`GPULayerType`](README.md#gpulayertype) | The type of the input/output (we assume "u_value" has the same type). |
| `params.value` | `number` \| `number`[] | Initial value to add, if value has length 1 it will be applied to all components of GPULayer. Change this later using uniform "u_value". |
| `params.name?` | `string` | Optionally pass in a GPUProgram name, used for error logging. |
| `params.precision?` | [`GLSLPrecision`](README.md#glslprecision) | Optionally specify the precision of the input/output/"u_value". |

#### Returns

[`GPUProgram`](classes/GPUProgram.md)

___

### multiplyValueProgram

▸ **multiplyValueProgram**(`composer`, `params`): [`GPUProgram`](classes/GPUProgram.md)

Init GPUProgram to multiply uniform "u_value" to a GPULayer.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `composer` | [`GPUComposer`](classes/GPUComposer.md) | The current GPUComposer. |
| `params` | `Object` | Program parameters. |
| `params.type` | [`GPULayerType`](README.md#gpulayertype) | The type of the input/output (we assume "u_value" has the same type). |
| `params.value` | `number` \| `number`[] | Initial value to multiply, if value has length 1 it will be applied to all components of GPULayer. Change this later using uniform "u_value". |
| `params.name?` | `string` | Optionally pass in a GPUProgram name, used for error logging. |
| `params.precision?` | [`GLSLPrecision`](README.md#glslprecision) | Optionally specify the precision of the input/output/"u_value". |

#### Returns

[`GPUProgram`](classes/GPUProgram.md)

___

### setValueProgram

▸ **setValueProgram**(`composer`, `params`): [`GPUProgram`](classes/GPUProgram.md)

Init GPUProgram to set all elements in a GPULayer to uniform "u_value".

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `composer` | [`GPUComposer`](classes/GPUComposer.md) | The current GPUComposer. |
| `params` | `Object` | Program parameters. |
| `params.type` | [`GPULayerType`](README.md#gpulayertype) | The type of the output (we assume "u_value" has same type). |
| `params.value` | `number` \| `number`[] | Initial value to set, if value has length 1 it will be applied to all components of GPULayer. Change this later using uniform "u_value". |
| `params.name?` | `string` | Optionally pass in a GPUProgram name, used for error logging. |
| `params.precision?` | [`GLSLPrecision`](README.md#glslprecision) | Optionally specify the precision of the output/"u_value". |

#### Returns

[`GPUProgram`](classes/GPUProgram.md)

___

### setColorProgram

▸ **setColorProgram**(`composer`, `params`): [`GPUProgram`](classes/GPUProgram.md)

Init GPUProgram to set all elements in a GPULayer to uniform "u_value".

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `composer` | [`GPUComposer`](classes/GPUComposer.md) | The current GPUComposer. |
| `params` | `Object` | Program parameters. |
| `params.type` | [`GPULayerType`](README.md#gpulayertype) | The type of the output. |
| `params.color?` | `number`[] | Initial color as RGB in range [0, 1], defaults to [0, 0, 0]. Change this later using uniform "u_color". |
| `params.opacity?` | `number` | Initial opacity in range [0, 1], defaults to 1. Change this later using uniform "u_opacity". |
| `params.name?` | `string` | Optionally pass in a GPUProgram name, used for error logging. |
| `params.precision?` | [`GLSLPrecision`](README.md#glslprecision) | Optionally specify the precision of the output/uniforms. |

#### Returns

[`GPUProgram`](classes/GPUProgram.md)

___

### zeroProgram

▸ **zeroProgram**(`composer`, `params`): [`GPUProgram`](classes/GPUProgram.md)

Init GPUProgram to zero output GPULayer.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `composer` | [`GPUComposer`](classes/GPUComposer.md) | The current GPUComposer. |
| `params` | `Object` | Program parameters. |
| `params.name?` | `string` | Optionally pass in a GPUProgram name, used for error logging. |

#### Returns

[`GPUProgram`](classes/GPUProgram.md)

___

### renderRGBProgram

▸ **renderRGBProgram**(`composer`, `params`): [`GPUProgram`](classes/GPUProgram.md)

Init GPUProgram to render 3 component GPULayer as RGB.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `composer` | [`GPUComposer`](classes/GPUComposer.md) | The current GPUComposer. |
| `params` | `Object` | Program parameters. |
| `params.type` | [`GPULayerType`](README.md#gpulayertype) | The type of the input. |
| `params.name?` | `string` | Optionally pass in a GPUProgram name, used for error logging. |
| `params.scale?` | `number` | Scaling factor, defaults to 1. Change this later using uniform "u_scale". |
| `params.opacity?` | `number` | Opacity, defaults to 1. Change this later using uniform "u_opacity". |
| `params.precision?` | [`GLSLPrecision`](README.md#glslprecision) | Optionally specify the precision of the input. |

#### Returns

[`GPUProgram`](classes/GPUProgram.md)

___

### renderAmplitudeProgram

▸ **renderAmplitudeProgram**(`composer`, `params`): [`GPUProgram`](classes/GPUProgram.md)

Init GPUProgram to render RGBA amplitude of an input GPULayer's components, defaults to grayscale rendering and works for scalar and vector fields.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `composer` | [`GPUComposer`](classes/GPUComposer.md) | The current GPUComposer. |
| `params` | `Object` | Program parameters. |
| `params.type` | [`GPULayerType`](README.md#gpulayertype) | The type of the input. |
| `params.components?` | `string` | Component(s) of input GPULayer to render, defaults to 'xyzw'. |
| `params.name?` | `string` | Optionally pass in a GPUProgram name, used for error logging. |
| `params.scale?` | `number` | Scaling factor, defaults to 1. Change this later using uniform "u_scale". |
| `params.opacity?` | `number` | Opacity, defaults to 1. Change this later using uniform "u_opacity". |
| `params.colorMax?` | `number`[] | RGB color for amplitude === scale, scaled to [0,1] range, defaults to white. Change this later using uniform "u_colorMax". |
| `params.colorMin?` | `number`[] | RGB color for amplitude === 0, scaled to [0,1] range, defaults to black. Change this later using uniform "u_colorMin". |
| `params.precision?` | [`GLSLPrecision`](README.md#glslprecision) | Optionally specify the precision of the input. |

#### Returns

[`GPUProgram`](classes/GPUProgram.md)

___

### renderSignedAmplitudeProgram

▸ **renderSignedAmplitudeProgram**(`composer`, `params`): [`GPUProgram`](classes/GPUProgram.md)

Init GPUProgram to render signed amplitude of an input GPULayer to linearly interpolated colors.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `composer` | [`GPUComposer`](classes/GPUComposer.md) | The current GPUComposer. |
| `params` | `Object` | Program parameters. |
| `params.type` | [`GPULayerType`](README.md#gpulayertype) | The type of the input. |
| `params.component?` | ``"x"`` \| ``"y"`` \| ``"z"`` \| ``"w"`` | Component of input GPULayer to render, defaults to "x". |
| `params.name?` | `string` | Optionally pass in a GPUProgram name, used for error logging. |
| `params.scale?` | `number` | Scaling factor, defaults to 1. Change this later using uniform "u_scale". |
| `params.bias?` | `number` | Bias for center point of color range, defaults to 0. Change this later using uniform "u_bias". |
| `params.opacity?` | `number` | Opacity, defaults to 1. Change this later using uniform "u_opacity". |
| `params.colorMax?` | `number`[] | RGB color for amplitude === bias + scale, scaled to [0,1] range, defaults to red. Change this later using uniform "u_colorMax". |
| `params.colorMin?` | `number`[] | RGB color for amplitude === bias + scale, scaled to [0,1] range, defaults to blue. Change this later using uniform "u_colorMin". |
| `params.colorCenter?` | `number`[] | RGB color for amplitude === bias, scaled to [0,1] range, defaults to white. Change this later using uniform "u_colorCenter". |
| `params.precision?` | [`GLSLPrecision`](README.md#glslprecision) | Optionally specify the precision of the input. |

#### Returns

[`GPUProgram`](classes/GPUProgram.md)

___

## Other Functions

### isWebGL2

▸ **isWebGL2**(`gl`): `boolean`

Returns whether a WebGL context is WebGL2.
This code is pulled from https://github.com/mrdoob/three.js/blob/master/src/renderers/webgl/WebGLCapabilities.js

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `gl` | `WebGLRenderingContext` \| `WebGL2RenderingContext` | WebGL context to test. |

#### Returns

`boolean`

- true if WebGL2 context, else false.

___

### isWebGL2Supported

▸ **isWebGL2Supported**(): `boolean`

Returns whether WebGL2 is supported by the current browser.

#### Returns

`boolean`

- true if WebGL2 is supported, else false.

___

### isHighpSupportedInVertexShader

▸ **isHighpSupportedInVertexShader**(): `boolean`

Detects whether highp precision is supported in vertex shaders in the current browser.

#### Returns

`boolean`

- true is highp is supported in vertex shaders, else false.

___

### isHighpSupportedInFragmentShader

▸ **isHighpSupportedInFragmentShader**(): `boolean`

Detects whether highp precision is supported in fragment shaders in the current browser.

#### Returns

`boolean`

- true is highp is supported in fragment shaders, else false.

___

### getVertexShaderMediumpPrecision

▸ **getVertexShaderMediumpPrecision**(): ``"highp"`` \| ``"mediump"``

Returns the actual precision of mediump inside vertex shader.
From https://webglfundamentals.org/webgl/lessons/webgl-precision-issues.html

#### Returns

``"highp"`` \| ``"mediump"``

- Vertex shader mediump precision.

___

### getFragmentShaderMediumpPrecision

▸ **getFragmentShaderMediumpPrecision**(): ``"highp"`` \| ``"mediump"``

Returns the actual precision of mediump inside fragment shader.
From https://webglfundamentals.org/webgl/lessons/webgl-precision-issues.html

#### Returns

``"highp"`` \| ``"mediump"``

- Fragment shader supported mediump precision.
