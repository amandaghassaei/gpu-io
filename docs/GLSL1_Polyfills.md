
## Overview

- All unsigned integer types (`uint`, `uvec2`, `uvec3`, `uvec4`, `usampler2D`) are converted to signed integer types (`int`, `ivec2`, `ivec3`, `ivec4`, `isampler2D`) in GLSL1
- The only texture lookup function officially supported by this library is `[i|u]vec4 texture([i|u]sampler2D, vec2 uv)`.  Currently, the bias parameter is not supported.  Other built-in texture lookup functions may also work, but have not been tested.
- out_fragColor is required.

More information about the implementation can be found in [regex.ts](../src/regex.ts) and [polyfills.ts](../src/polyfills.ts).  Pull requests welcome, I'm sure there are ways to speed some of these functions up.

Type annotations used in function descriptions:

`T` = `float` | `vec2` | `vec3` | `vec4`  
`TI` = `int` | `ivec2` | `ivec3` | `ivec4`  
`TU` = `uint` | `uvec2` | `uvec3` | `uvec4`  

(note that any uint types will be cast as int within the fragment shader)


## Types

The following type substitutions are made automatically when targeting GLSL1:

- `uint` is converted to `int`
- `uvec#` is converted to `ivec#` ( `#` = `2` | `3` | `4` )
- `isampler2D` and `usampler2D` are converted to `sampler2D`


## Operators

Because operator overloading does not seem to be supported through GLSL1, I've created operator functions that will work in both GLSL3 and GLSL1.


- `%` replaced by:
	- `T|TI|TU mod(T|TI|TU x, T|TI|TU y)`
	- `T|TI|TU mod(T|TI|TU x, float|int|uint y)`
- `<<` replaced by:
	- `TI|TU bitshiftLeft(TI|TU x, T1|TU shift)`
	- `TI|TU bitshiftLeft(TI|TU x, int|uint shift)`
- `>>` replaced by:
	- `TI|TU bitshiftRight(TI|TU x, TI|TU shift)`
	- `TI|TU bitshiftRight(TI|TU x, int|uint shift)`
- `&` replaced by:
	- `int bitwiseAnd(int x, int y)`
	- `uint bitwiseAnd(uint x, uint y)`
- `^`
	- `int bitwiseXOR(int x, int y)`
	- `uint bitwiseXOR(uint x, uint y)`
- `|`
	- `int bitwiseOr(int x, int y)`
	- `uint bitwiseOr(uint x, uint y)`
- `~` replaced by:
	- `int bitwiseNot(int x)`
	- `uint bitwiseNot(uint x)`

Eventually, operator overloading could be handled in JavaScript by preprocessing the shader source code, but this will require a more sophisticated approach to ensure robustness (currently using simple [string substitution with regex](../src/regex.ts)).


## Built-In Functions

gpu-io contains GLSL1 polyfills for many GLSL3 built-in functions (pages 7-8 in the [WebGL2 Reference Card](chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/https://www.khronos.org/files/webgl20-reference-guide.pdf)).  Along with the built-in functions described the in the WebGL1 spec (page 4 in the [WebGL1 Reference Card](chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/https://www.khronos.org/files/webgl/webgl-reference-card-1_0.pdf)), gpu-io makes the following functions are available to GLSL1:


### Common Functions

- `TI abs(TI x)`
- `TI sign(TI x)`
- `T trunc(T x)`
- `T round(T x)`
- `T roundEven(T x)`
- `TI|TU min(TI|TU x, TI|TU y)`
- `TI|TU min(TI|TU x, int|uint y)`
- `TI|TU clamp(TI|TU x, TI|TU min, TI|TU max)`
- `TI|TU clamp(TI|TU x, int|uint min, int|uint max)`
- `TI|TU mix(TI|TU x, TI|TU y, TI|TU a)`
- `TI|TU mix(TI|TU x, TI|TU y, int|uint a)`


### Texture Lookup Functions

- `[i|u]vec4 texture([i|u]sampler2D, vec2 uv)` (no bias parameter)

TODO: talk about type casting for u/i sampler2D.


# Unsupported GLSL3 Features

The following GLSL3 types and methods are not currently polyfilled by gpu-io, and therefore are not accessible to GLSL1 shaders.  Using these types and methods in your shader code may throw an error in some browsers (typically mobile) that only support WebGL1.


## Unsupported Types

The following types are currently NOT supported in GLSL1:

- `matNxM` (only `mat2`, `mat3`, `mat4` are allowed)
- `[i|u]sampler3D`
- `isamplerCube` and `usamplerCube`
- `samplerCubeShadow`
- `sampler2DShadow`
- `[i|u]sampler2DArray`
- `sampler2DArrayShadow`


## Unsupported Operators

Until I'm able to handle operator overloads through a JavaScript preprocessor, the following assignment operators are NOT currently supported in GLSL1.  See [Operators](#operators) for info about how to get around this using operator polyfill functions.

- `%=`
- `<<=`
- `>>=`
- `&=`
- `^=`
- `|=`


## Unsupported Built-In Functions

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

The following functions are not polyfilled by this library, but they may still be available to GLSL1 via the [OES_standard_derivatives](https://developer.mozilla.org/en-US/docs/Web/API/OES_standard_derivatives) extension:

- `dFdx`
- `dFdy`
- `fwidth`


# Other Notes

- Uniforms can be used as for loop 