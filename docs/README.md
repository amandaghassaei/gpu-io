webgl-compute

# webgl-compute

## Table of contents

### Classes

- [GPUComposer](classes/GPUComposer.md)
- [GPULayer](classes/GPULayer.md)
- [GPUProgram](classes/GPUProgram.md)

### Type Aliases

- [CompileTimeVars](README.md#compiletimevars)
- [ErrorCallback](README.md#errorcallback)
- [GLSLPrecision](README.md#glslprecision)
- [GLSLVersion](README.md#glslversion)
- [GPULayerArray](README.md#gpulayerarray)
- [GPULayerBuffer](README.md#gpulayerbuffer)
- [GPULayerFilter](README.md#gpulayerfilter)
- [GPULayerNumComponents](README.md#gpulayernumcomponents)
- [GPULayerType](README.md#gpulayertype)
- [GPULayerWrap](README.md#gpulayerwrap)
- [PROGRAM\_NAME\_INTERNAL](README.md#program_name_internal)
- [TextureFormat](README.md#textureformat)
- [TextureType](README.md#texturetype)
- [Uniform](README.md#uniform)
- [UniformInternalType](README.md#uniforminternaltype)
- [UniformType](README.md#uniformtype)
- [UniformValue](README.md#uniformvalue)

### Variables

- [BOOL](README.md#bool)
- [BYTE](README.md#byte)
- [CLAMP\_TO\_EDGE](README.md#clamp_to_edge)
- [DEFAULT\_CIRCLE\_NUM\_SEGMENTS](README.md#default_circle_num_segments)
- [DEFAULT\_PROGRAM\_NAME](README.md#default_program_name)
- [DEFAULT\_W\_NORMAL\_PROGRAM\_NAME](README.md#default_w_normal_program_name)
- [DEFAULT\_W\_UV\_NORMAL\_PROGRAM\_NAME](README.md#default_w_uv_normal_program_name)
- [DEFAULT\_W\_UV\_PROGRAM\_NAME](README.md#default_w_uv_program_name)
- [EXPERIMENTAL\_WEBGL](README.md#experimental_webgl)
- [FLOAT](README.md#float)
- [FLOAT\_1D\_UNIFORM](README.md#float_1d_uniform)
- [FLOAT\_2D\_UNIFORM](README.md#float_2d_uniform)
- [FLOAT\_3D\_UNIFORM](README.md#float_3d_uniform)
- [FLOAT\_4D\_UNIFORM](README.md#float_4d_uniform)
- [GLSL1](README.md#glsl1)
- [GLSL3](README.md#glsl3)
- [HALF\_FLOAT](README.md#half_float)
- [INT](README.md#int)
- [INT\_1D\_UNIFORM](README.md#int_1d_uniform)
- [INT\_2D\_UNIFORM](README.md#int_2d_uniform)
- [INT\_3D\_UNIFORM](README.md#int_3d_uniform)
- [INT\_4D\_UNIFORM](README.md#int_4d_uniform)
- [LAYER\_LINES\_PROGRAM\_NAME](README.md#layer_lines_program_name)
- [LAYER\_POINTS\_PROGRAM\_NAME](README.md#layer_points_program_name)
- [LAYER\_VECTOR\_FIELD\_PROGRAM\_NAME](README.md#layer_vector_field_program_name)
- [LINEAR](README.md#linear)
- [MAX\_BYTE](README.md#max_byte)
- [MAX\_FLOAT\_INT](README.md#max_float_int)
- [MAX\_HALF\_FLOAT\_INT](README.md#max_half_float_int)
- [MAX\_INT](README.md#max_int)
- [MAX\_SHORT](README.md#max_short)
- [MAX\_UNSIGNED\_BYTE](README.md#max_unsigned_byte)
- [MAX\_UNSIGNED\_INT](README.md#max_unsigned_int)
- [MAX\_UNSIGNED\_SHORT](README.md#max_unsigned_short)
- [MIN\_BYTE](README.md#min_byte)
- [MIN\_FLOAT\_INT](README.md#min_float_int)
- [MIN\_HALF\_FLOAT\_INT](README.md#min_half_float_int)
- [MIN\_INT](README.md#min_int)
- [MIN\_SHORT](README.md#min_short)
- [MIN\_UNSIGNED\_BYTE](README.md#min_unsigned_byte)
- [MIN\_UNSIGNED\_INT](README.md#min_unsigned_int)
- [MIN\_UNSIGNED\_SHORT](README.md#min_unsigned_short)
- [NEAREST](README.md#nearest)
- [PRECISION\_HIGH\_P](README.md#precision_high_p)
- [PRECISION\_LOW\_P](README.md#precision_low_p)
- [PRECISION\_MEDIUM\_P](README.md#precision_medium_p)
- [REPEAT](README.md#repeat)
- [RGB](README.md#rgb)
- [RGBA](README.md#rgba)
- [SEGMENT\_PROGRAM\_NAME](README.md#segment_program_name)
- [SHORT](README.md#short)
- [UINT](README.md#uint)
- [UINT\_1D\_UNIFORM](README.md#uint_1d_uniform)
- [UINT\_2D\_UNIFORM](README.md#uint_2d_uniform)
- [UINT\_3D\_UNIFORM](README.md#uint_3d_uniform)
- [UINT\_4D\_UNIFORM](README.md#uint_4d_uniform)
- [UNSIGNED\_BYTE](README.md#unsigned_byte)
- [UNSIGNED\_INT](README.md#unsigned_int)
- [UNSIGNED\_SHORT](README.md#unsigned_short)
- [WEBGL1](README.md#webgl1)
- [WEBGL2](README.md#webgl2)
- [\_testing](README.md#_testing)
- [validArrayTypes](README.md#validarraytypes)
- [validDataTypes](README.md#validdatatypes)
- [validFilters](README.md#validfilters)
- [validTextureFormats](README.md#validtextureformats)
- [validTextureTypes](README.md#validtexturetypes)
- [validWraps](README.md#validwraps)

### Functions

- [DEFAULT\_ERROR\_CALLBACK](README.md#default_error_callback)
- [getFragmentShaderMediumpPrecision](README.md#getfragmentshadermediumpprecision)
- [getVertexShaderMediumpPrecision](README.md#getvertexshadermediumpprecision)
- [isHighpSupportedInFragmentShader](README.md#ishighpsupportedinfragmentshader)
- [isHighpSupportedInVertexShader](README.md#ishighpsupportedinvertexshader)
- [isWebGL2](README.md#iswebgl2)
- [isWebGL2Supported](README.md#iswebgl2supported)

## Type Aliases

### CompileTimeVars

Ƭ **CompileTimeVars**: `Object`

#### Index signature

▪ [key: `string`]: `string`

#### Defined in

[constants.ts:114](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L114)

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

#### Defined in

[constants.ts:123](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L123)

___

### GLSLPrecision

Ƭ **GLSLPrecision**: typeof [`PRECISION_LOW_P`](README.md#precision_low_p) \| typeof [`PRECISION_MEDIUM_P`](README.md#precision_medium_p) \| typeof [`PRECISION_HIGH_P`](README.md#precision_high_p)

#### Defined in

[constants.ts:56](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L56)

___

### GLSLVersion

Ƭ **GLSLVersion**: typeof [`GLSL1`](README.md#glsl1) \| typeof [`GLSL3`](README.md#glsl3)

#### Defined in

[constants.ts:45](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L45)

___

### GPULayerArray

Ƭ **GPULayerArray**: `Float32Array` \| `Uint8Array` \| `Int8Array` \| `Uint16Array` \| `Int16Array` \| `Uint32Array` \| `Int32Array`

#### Defined in

[constants.ts:23](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L23)

___

### GPULayerBuffer

Ƭ **GPULayerBuffer**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `framebuffer?` | `WebGLFramebuffer` |
| `texture` | `WebGLTexture` |

#### Defined in

[constants.ts:117](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L117)

___

### GPULayerFilter

Ƭ **GPULayerFilter**: typeof [`LINEAR`](README.md#linear) \| typeof [`NEAREST`](README.md#nearest)

#### Defined in

[constants.ts:28](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L28)

___

### GPULayerNumComponents

Ƭ **GPULayerNumComponents**: ``1`` \| ``2`` \| ``3`` \| ``4``

#### Defined in

[constants.ts:27](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L27)

___

### GPULayerType

Ƭ **GPULayerType**: typeof [`HALF_FLOAT`](README.md#half_float) \| typeof [`FLOAT`](README.md#float) \| typeof [`UNSIGNED_BYTE`](README.md#unsigned_byte) \| typeof [`BYTE`](README.md#byte) \| typeof [`UNSIGNED_SHORT`](README.md#unsigned_short) \| typeof [`SHORT`](README.md#short) \| typeof [`UNSIGNED_INT`](README.md#unsigned_int) \| typeof [`INT`](README.md#int)

#### Defined in

[constants.ts:25](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L25)

___

### GPULayerWrap

Ƭ **GPULayerWrap**: typeof [`REPEAT`](README.md#repeat) \| typeof [`CLAMP_TO_EDGE`](README.md#clamp_to_edge)

#### Defined in

[constants.ts:31](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L31)

___

### PROGRAM\_NAME\_INTERNAL

Ƭ **PROGRAM\_NAME\_INTERNAL**: typeof [`DEFAULT_PROGRAM_NAME`](README.md#default_program_name) \| typeof [`DEFAULT_W_UV_PROGRAM_NAME`](README.md#default_w_uv_program_name) \| typeof [`DEFAULT_W_NORMAL_PROGRAM_NAME`](README.md#default_w_normal_program_name) \| typeof [`DEFAULT_W_UV_NORMAL_PROGRAM_NAME`](README.md#default_w_uv_normal_program_name) \| typeof [`SEGMENT_PROGRAM_NAME`](README.md#segment_program_name) \| typeof [`LAYER_POINTS_PROGRAM_NAME`](README.md#layer_points_program_name) \| typeof [`LAYER_LINES_PROGRAM_NAME`](README.md#layer_lines_program_name) \| typeof [`LAYER_VECTOR_FIELD_PROGRAM_NAME`](README.md#layer_vector_field_program_name)

#### Defined in

[constants.ts:103](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L103)

___

### TextureFormat

Ƭ **TextureFormat**: typeof [`RGB`](README.md#rgb) \| typeof [`RGBA`](README.md#rgba)

#### Defined in

[constants.ts:37](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L37)

___

### TextureType

Ƭ **TextureType**: typeof [`UNSIGNED_BYTE`](README.md#unsigned_byte)

#### Defined in

[constants.ts:39](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L39)

___

### Uniform

Ƭ **Uniform**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `location` | { `[key: string]`: `WebGLUniformLocation`;  } |
| `type` | [`UniformInternalType`](README.md#uniforminternaltype) |
| `value` | [`UniformValue`](README.md#uniformvalue) |

#### Defined in

[constants.ts:88](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L88)

___

### UniformInternalType

Ƭ **UniformInternalType**: typeof [`FLOAT_1D_UNIFORM`](README.md#float_1d_uniform) \| typeof [`FLOAT_2D_UNIFORM`](README.md#float_2d_uniform) \| typeof [`FLOAT_3D_UNIFORM`](README.md#float_3d_uniform) \| typeof [`FLOAT_4D_UNIFORM`](README.md#float_4d_uniform) \| typeof [`INT_1D_UNIFORM`](README.md#int_1d_uniform) \| typeof [`INT_2D_UNIFORM`](README.md#int_2d_uniform) \| typeof [`INT_3D_UNIFORM`](README.md#int_3d_uniform) \| typeof [`INT_4D_UNIFORM`](README.md#int_4d_uniform) \| typeof [`UINT_1D_UNIFORM`](README.md#uint_1d_uniform) \| typeof [`UINT_2D_UNIFORM`](README.md#uint_2d_uniform) \| typeof [`UINT_3D_UNIFORM`](README.md#uint_3d_uniform) \| typeof [`UINT_4D_UNIFORM`](README.md#uint_4d_uniform)

#### Defined in

[constants.ts:74](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L74)

___

### UniformType

Ƭ **UniformType**: typeof [`FLOAT`](README.md#float) \| typeof [`INT`](README.md#int) \| typeof [`UINT`](README.md#uint) \| typeof [`BOOL`](README.md#bool)

#### Defined in

[constants.ts:73](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L73)

___

### UniformValue

Ƭ **UniformValue**: `boolean` \| `number` \| `number`[]

#### Defined in

[constants.ts:87](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L87)

## Variables

### BOOL

• `Const` **BOOL**: ``"BOOL"``

#### Defined in

[constants.ts:10](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L10)

___

### BYTE

• `Const` **BYTE**: ``"BYTE"``

#### Defined in

[constants.ts:5](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L5)

___

### CLAMP\_TO\_EDGE

• `Const` **CLAMP\_TO\_EDGE**: ``"CLAMP_TO_EDGE"``

#### Defined in

[constants.ts:19](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L19)

___

### DEFAULT\_CIRCLE\_NUM\_SEGMENTS

• `Const` **DEFAULT\_CIRCLE\_NUM\_SEGMENTS**: ``18``

#### Defined in

[constants.ts:127](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L127)

___

### DEFAULT\_PROGRAM\_NAME

• `Const` **DEFAULT\_PROGRAM\_NAME**: ``"DEFAULT"``

#### Defined in

[constants.ts:95](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L95)

___

### DEFAULT\_W\_NORMAL\_PROGRAM\_NAME

• `Const` **DEFAULT\_W\_NORMAL\_PROGRAM\_NAME**: ``"DEFAULT_W_NORMAL"``

#### Defined in

[constants.ts:97](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L97)

___

### DEFAULT\_W\_UV\_NORMAL\_PROGRAM\_NAME

• `Const` **DEFAULT\_W\_UV\_NORMAL\_PROGRAM\_NAME**: ``"DEFAULT_W_UV_NORMAL"``

#### Defined in

[constants.ts:98](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L98)

___

### DEFAULT\_W\_UV\_PROGRAM\_NAME

• `Const` **DEFAULT\_W\_UV\_PROGRAM\_NAME**: ``"DEFAULT_W_UV"``

#### Defined in

[constants.ts:96](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L96)

___

### EXPERIMENTAL\_WEBGL

• `Const` **EXPERIMENTAL\_WEBGL**: ``"experimental-webgl"``

#### Defined in

[constants.ts:50](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L50)

___

### FLOAT

• `Const` **FLOAT**: ``"FLOAT"``

#### Defined in

[constants.ts:3](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L3)

___

### FLOAT\_1D\_UNIFORM

• `Const` **FLOAT\_1D\_UNIFORM**: ``"1f"``

#### Defined in

[constants.ts:59](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L59)

___

### FLOAT\_2D\_UNIFORM

• `Const` **FLOAT\_2D\_UNIFORM**: ``"2f"``

#### Defined in

[constants.ts:60](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L60)

___

### FLOAT\_3D\_UNIFORM

• `Const` **FLOAT\_3D\_UNIFORM**: ``"3f"``

#### Defined in

[constants.ts:61](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L61)

___

### FLOAT\_4D\_UNIFORM

• `Const` **FLOAT\_4D\_UNIFORM**: ``"4f"``

#### Defined in

[constants.ts:62](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L62)

___

### GLSL1

• `Const` **GLSL1**: ``"100"``

#### Defined in

[constants.ts:44](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L44)

___

### GLSL3

• `Const` **GLSL3**: ``"300 es"``

#### Defined in

[constants.ts:43](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L43)

___

### HALF\_FLOAT

• `Const` **HALF\_FLOAT**: ``"HALF_FLOAT"``

#### Defined in

[constants.ts:2](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L2)

___

### INT

• `Const` **INT**: ``"INT"``

#### Defined in

[constants.ts:9](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L9)

___

### INT\_1D\_UNIFORM

• `Const` **INT\_1D\_UNIFORM**: ``"1i"``

#### Defined in

[constants.ts:63](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L63)

___

### INT\_2D\_UNIFORM

• `Const` **INT\_2D\_UNIFORM**: ``"2i"``

#### Defined in

[constants.ts:64](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L64)

___

### INT\_3D\_UNIFORM

• `Const` **INT\_3D\_UNIFORM**: ``"3i"``

#### Defined in

[constants.ts:65](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L65)

___

### INT\_4D\_UNIFORM

• `Const` **INT\_4D\_UNIFORM**: ``"4i"``

#### Defined in

[constants.ts:66](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L66)

___

### LAYER\_LINES\_PROGRAM\_NAME

• `Const` **LAYER\_LINES\_PROGRAM\_NAME**: ``"LAYER_LINES"``

#### Defined in

[constants.ts:101](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L101)

___

### LAYER\_POINTS\_PROGRAM\_NAME

• `Const` **LAYER\_POINTS\_PROGRAM\_NAME**: ``"LAYER_POINTS"``

#### Defined in

[constants.ts:100](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L100)

___

### LAYER\_VECTOR\_FIELD\_PROGRAM\_NAME

• `Const` **LAYER\_VECTOR\_FIELD\_PROGRAM\_NAME**: ``"LAYER_VECTOR_FIELD"``

#### Defined in

[constants.ts:102](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L102)

___

### LINEAR

• `Const` **LINEAR**: ``"LINEAR"``

#### Defined in

[constants.ts:14](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L14)

___

### MAX\_BYTE

• `Const` **MAX\_BYTE**: `number`

#### Defined in

[constants.ts:133](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L133)

___

### MAX\_FLOAT\_INT

• `Const` **MAX\_FLOAT\_INT**: ``16777216``

#### Defined in

[constants.ts:146](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L146)

___

### MAX\_HALF\_FLOAT\_INT

• `Const` **MAX\_HALF\_FLOAT\_INT**: ``2048``

#### Defined in

[constants.ts:144](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L144)

___

### MAX\_INT

• `Const` **MAX\_INT**: `number`

#### Defined in

[constants.ts:141](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L141)

___

### MAX\_SHORT

• `Const` **MAX\_SHORT**: `number`

#### Defined in

[constants.ts:137](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L137)

___

### MAX\_UNSIGNED\_BYTE

• `Const` **MAX\_UNSIGNED\_BYTE**: `number`

#### Defined in

[constants.ts:131](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L131)

___

### MAX\_UNSIGNED\_INT

• `Const` **MAX\_UNSIGNED\_INT**: `number`

#### Defined in

[constants.ts:139](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L139)

___

### MAX\_UNSIGNED\_SHORT

• `Const` **MAX\_UNSIGNED\_SHORT**: `number`

#### Defined in

[constants.ts:135](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L135)

___

### MIN\_BYTE

• `Const` **MIN\_BYTE**: `number` = `-(2 ** 7)`

#### Defined in

[constants.ts:132](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L132)

___

### MIN\_FLOAT\_INT

• `Const` **MIN\_FLOAT\_INT**: ``-16777216``

#### Defined in

[constants.ts:145](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L145)

___

### MIN\_HALF\_FLOAT\_INT

• `Const` **MIN\_HALF\_FLOAT\_INT**: ``-2048``

#### Defined in

[constants.ts:143](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L143)

___

### MIN\_INT

• `Const` **MIN\_INT**: `number` = `-(2 ** 31)`

#### Defined in

[constants.ts:140](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L140)

___

### MIN\_SHORT

• `Const` **MIN\_SHORT**: `number` = `-(2 ** 15)`

#### Defined in

[constants.ts:136](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L136)

___

### MIN\_UNSIGNED\_BYTE

• `Const` **MIN\_UNSIGNED\_BYTE**: ``0``

#### Defined in

[constants.ts:130](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L130)

___

### MIN\_UNSIGNED\_INT

• `Const` **MIN\_UNSIGNED\_INT**: ``0``

#### Defined in

[constants.ts:138](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L138)

___

### MIN\_UNSIGNED\_SHORT

• `Const` **MIN\_UNSIGNED\_SHORT**: ``0``

#### Defined in

[constants.ts:134](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L134)

___

### NEAREST

• `Const` **NEAREST**: ``"NEAREST"``

#### Defined in

[constants.ts:15](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L15)

___

### PRECISION\_HIGH\_P

• `Const` **PRECISION\_HIGH\_P**: ``"highp"``

#### Defined in

[constants.ts:55](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L55)

___

### PRECISION\_LOW\_P

• `Const` **PRECISION\_LOW\_P**: ``"lowp"``

#### Defined in

[constants.ts:53](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L53)

___

### PRECISION\_MEDIUM\_P

• `Const` **PRECISION\_MEDIUM\_P**: ``"mediump"``

#### Defined in

[constants.ts:54](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L54)

___

### REPEAT

• `Const` **REPEAT**: ``"REPEAT"``

#### Defined in

[constants.ts:18](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L18)

___

### RGB

• `Const` **RGB**: ``"RGB"``

#### Defined in

[constants.ts:35](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L35)

___

### RGBA

• `Const` **RGBA**: ``"RGBA"``

#### Defined in

[constants.ts:36](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L36)

___

### SEGMENT\_PROGRAM\_NAME

• `Const` **SEGMENT\_PROGRAM\_NAME**: ``"SEGMENT"``

#### Defined in

[constants.ts:99](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L99)

___

### SHORT

• `Const` **SHORT**: ``"SHORT"``

#### Defined in

[constants.ts:7](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L7)

___

### UINT

• `Const` **UINT**: ``"UINT"``

#### Defined in

[constants.ts:11](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L11)

___

### UINT\_1D\_UNIFORM

• `Const` **UINT\_1D\_UNIFORM**: ``"1ui"``

#### Defined in

[constants.ts:67](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L67)

___

### UINT\_2D\_UNIFORM

• `Const` **UINT\_2D\_UNIFORM**: ``"2ui"``

#### Defined in

[constants.ts:68](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L68)

___

### UINT\_3D\_UNIFORM

• `Const` **UINT\_3D\_UNIFORM**: ``"3ui"``

#### Defined in

[constants.ts:69](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L69)

___

### UINT\_4D\_UNIFORM

• `Const` **UINT\_4D\_UNIFORM**: ``"4ui"``

#### Defined in

[constants.ts:70](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L70)

___

### UNSIGNED\_BYTE

• `Const` **UNSIGNED\_BYTE**: ``"UNSIGNED_BYTE"``

#### Defined in

[constants.ts:4](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L4)

___

### UNSIGNED\_INT

• `Const` **UNSIGNED\_INT**: ``"UNSIGNED_INT"``

#### Defined in

[constants.ts:8](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L8)

___

### UNSIGNED\_SHORT

• `Const` **UNSIGNED\_SHORT**: ``"UNSIGNED_SHORT"``

#### Defined in

[constants.ts:6](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L6)

___

### WEBGL1

• `Const` **WEBGL1**: ``"webgl"``

#### Defined in

[constants.ts:49](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L49)

___

### WEBGL2

• `Const` **WEBGL2**: ``"webgl2"``

#### Defined in

[constants.ts:48](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L48)

___

### \_testing

• `Const` **\_testing**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `compileShader` |  |
| `initGLProgram` |  |
| `initSequentialFloatArray` |  |
| `isPowerOf2` |  |
| `makeShaderHeader` |  |
| `preprocessFragmentShader` |  |
| `preprocessVertexShader` |  |
| `readyToRead` |  |
| `uniformInternalTypeForValue` |  |
| `isValidTextureFormat` | (`type`: `string`) => `boolean` |
| `isValidTextureType` | (`type`: `string`) => `boolean` |

#### Defined in

[index.ts:25](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/index.ts#L25)

___

### validArrayTypes

• `Const` **validArrayTypes**: (`ArrayConstructor` \| `Int8ArrayConstructor` \| `Uint8ArrayConstructor` \| `Int16ArrayConstructor` \| `Uint16ArrayConstructor` \| `Int32ArrayConstructor` \| `Uint32ArrayConstructor` \| `Float32ArrayConstructor`)[]

#### Defined in

[constants.ts:24](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L24)

___

### validDataTypes

• `Const` **validDataTypes**: `string`[]

#### Defined in

[constants.ts:26](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L26)

___

### validFilters

• `Const` **validFilters**: `string`[]

#### Defined in

[constants.ts:29](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L29)

___

### validTextureFormats

• `Const` **validTextureFormats**: `string`[]

#### Defined in

[constants.ts:38](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L38)

___

### validTextureTypes

• `Const` **validTextureTypes**: `string`[]

#### Defined in

[constants.ts:40](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L40)

___

### validWraps

• `Const` **validWraps**: `string`[]

#### Defined in

[constants.ts:30](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L30)

## Functions

### DEFAULT\_ERROR\_CALLBACK

▸ **DEFAULT_ERROR_CALLBACK**(`msg`): `never`

#### Parameters

| Name | Type |
| :------ | :------ |
| `msg` | `string` |

#### Returns

`never`

#### Defined in

[constants.ts:124](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/constants.ts#L124)

___

### getFragmentShaderMediumpPrecision

▸ **getFragmentShaderMediumpPrecision**(): ``"mediump"`` \| ``"highp"``

Returns the actual precision of mediump inside fragment shader.
From https://webglfundamentals.org/webgl/lessons/webgl-precision-issues.html

#### Returns

``"mediump"`` \| ``"highp"``

- Fragment shader supported mediump precision.

#### Defined in

[utils.ts:425](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/utils.ts#L425)

___

### getVertexShaderMediumpPrecision

▸ **getVertexShaderMediumpPrecision**(): ``"mediump"`` \| ``"highp"``

Returns the actual precision of mediump inside vertex shader.
From https://webglfundamentals.org/webgl/lessons/webgl-precision-issues.html

#### Returns

``"mediump"`` \| ``"highp"``

- Vertex shader supported mediump precision.

#### Defined in

[utils.ts:357](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/utils.ts#L357)

___

### isHighpSupportedInFragmentShader

▸ **isHighpSupportedInFragmentShader**(): `boolean`

Detects whether highp precision is supported in fragment shaders in the current browser.

#### Returns

`boolean`

#### Defined in

[utils.ts:282](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/utils.ts#L282)

___

### isHighpSupportedInVertexShader

▸ **isHighpSupportedInVertexShader**(): `boolean`

Detects whether highp precision is supported in vertex shaders in the current browser.

#### Returns

`boolean`

#### Defined in

[utils.ts:267](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/utils.ts#L267)

___

### isWebGL2

▸ **isWebGL2**(`gl`): `boolean`

Returns whether a WebGL context is WebGL1 or WebGL2.
This code is pulled from https://github.com/mrdoob/three.js/blob/master/src/renderers/webgl/WebGLCapabilities.js

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `gl` | `WebGLRenderingContext` \| `WebGL2RenderingContext` | WebGL context to test. |

#### Returns

`boolean`

#### Defined in

[utils.ts:189](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/utils.ts#L189)

___

### isWebGL2Supported

▸ **isWebGL2Supported**(): `boolean`

Returns whether WebGL2 is supported by the current browser.

#### Returns

`boolean`

#### Defined in

[utils.ts:198](https://github.com/amandaghassaei/webgl-compute/blob/f0fc5cd/src/utils.ts#L198)
