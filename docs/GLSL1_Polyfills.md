
## Overview

- All unsigned integer types (`uint`, `uvec2`, `uvec3`, `uvec4`, `usampler2D`) are converted to signed integer types (`int`, `ivec2`, `ivec3`, `ivec4`, `isampler2D`) in GLSL1
- 
- The only texture lookup function officially supported by this library is `[i|u]vec4 texture([i|u]sampler2D, vec2 uv)`.  Currently, the bias parameter is not supported.  Other built-in texture lookup functions may also work, but have not been tested.
- out_fragColor


## Types

The following type substitutions are made automatically when targeting GLSL1:

- `uint` is converted to `int`
- `uvec#` is converted to `ivec#` ( `#` = `2` | `3` | `4` )
- `isampler2D` and `usampler2D` are converted to `sampler2D`


## Operators

- `~`
- `%`
- `%=`
- `<<`
- `<<=`
- `>>`
- `>>=`
- `&`
- `&=`
- `^`
- `^=`
- `|`
- `|=`


## Built-In Functions

gpu-io contains GLSL1 polyfills for many GLSL3 built-in functions (pages 7-8 in the [WebGL2 Reference Card](chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/https://www.khronos.org/files/webgl20-reference-guide.pdf)).  The following functions are available to GLSL1 (note that any uint types will be cast as int within the fragment shader):

`T` = `float` | `vec2` | `vec3` | `vec4`  
`TI` = `int` | `ivec2` | `ivec3` | `ivec4`  
`TU` = `uint` | `uvec2` | `uvec3` | `uvec4`  

### Common Functions

- `TI abs(TI x)`
- `TI sign(TI x)`
- `T trunc(T x)`
- `T round(T x)`
- `T roundEven(T x)`
- `TI min(TI x, TI y)`
- `TI min(TI x, int y)`
- `TU min(TU x, TU y)`
- `TU min(TU x, uint y)`
- `TI clamp(TI x, TI min, TI max)`
- `TI clamp(TI x, int min, int max)`
- `TU clamp(TU x, TU min, TU max)`
- `TU clamp(TU x, uint min, uint max)`
- `TI mix(TI x, TI y, TI a)`
- `TI mix(TI x, TI y, int a)`
- `TU mix(TU x, TU y, TU a)`
- `TU mix(TU x, TU y, uint a)`

### Texture Lookup Functions

- `[i|u]vec4 texture([i|u]sampler2D, vec2 uv)` (no bias parameter)

All other built-in functions described in the WebGL1 spec are available to GLSL1 and GLSL3 shaders (page 4 in the [WebGL1 Reference Card](chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/https://www.khronos.org/files/webgl/webgl-reference-card-1_0.pdf)).

TODO: talk about type casting for u/i sampler2D.


# Unsupported

The following GLSL3 types and methods are not currently polyfilled by this gpu-io, and therefore are not accessible to GLSL1 shaders.  Using these in your shader code may throw an error in some browsers (typically mobile) that only support WebGL1.


## Types

The following types are NOT supported in GLSL1:

- `matNxM` (only `mat2`, `mat3`, `mat4` are allowed)
- `[i|u]sampler3D`
- `isamplerCube` and `usamplerCube`
- `samplerCubeShadow`
- `sampler2DShadow`
- `[i|u]sampler2DArray`
- `sampler2DArrayShadow`

## Built-In Functions

The following functions are currently NOT available to GLSL1 fragment shaders:

### Hyperbolic Trigonometric Functions

- `sinh`
- `cosh`
- `tanh`
- `asinh`
- `acosh`
- `atanh`

### Value Checks

- `isnan`
- `isinf`

### Float/Int Bit Conversions

- `floatBitsToInt`
- `floatBitsToUint`
- `intBitsToFloat`
- `uintBitsToFloat`

### Matrix Functions

- `outerProduct`
- `transpose`
- `determinant`
- `inverse`

### Texture Lookup Functions

- All texture lookup functions other than `[i|u]vec4 texture([i|u]sampler2D, vec2 uv)` are NOT officially supported by this library.  Many of them may still work, but none of have been tested.  See the [WebGL1 Reference Card](chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/https://www.khronos.org/files/webgl/webgl-reference-card-1_0.pdf) to find out what is supported in GLSL1.


### Fragment Processing Functions

The following functions are not polyfilled by this library, but the may still be available to GLSL1 via the [OES_standard_derivatives](https://developer.mozilla.org/en-US/docs/Web/API/OES_standard_derivatives) extension:

- `dFdx`
- `dFdy`
- `fwidth`


# Other Notes

- Uniforms can be used as for loop 