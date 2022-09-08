
## Overview

- The only texture lookup function supported by this library is `[i|u]vec4 texture([i|u]sampler2D, vec2 uv)`.  Currently, the bias parameter is not supported.  Other built-in texture lookup functions may also work, but these have not been tested.

## Inputs, Output

## Built-In Functions

This library contains GLSL1 polyfills for many GLSL3 built-in functions (pages 7-8 in the [WebGL2 Reference Card](chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/https://www.khronos.org/files/webgl20-reference-guide.pdf)).  The following functions are available to GLSL1 (note that any uint types will be cast as int within the fragment shader):

T = [float|vec2|vec3|vec4]  
TI = [int|ivec2|ivec3|ivec4]  
TU = [uint|uvec2|uvec3|uvec4]

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

All other built-in functions decribed in the WebGL1 spec are available to GLSL1 shaders (page 4 in the [WebGL1 Reference Card](chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/https://www.khronos.org/files/webgl/webgl-reference-card-1_0.pdf)).

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

- All texture lookup functions other than `[i|u]vec4 texture([i|u]sampler2D, vec2 uv)` are not supported/polyfilled by this library.  Many of them may still work, but none of this has been tested.

### Fragment Processing Functions

(these may be available to GLSL1 via the [OES_standard_derivatives](https://developer.mozilla.org/en-US/docs/Web/API/OES_standard_derivatives) extension)

- `dFdx`
- `dFdy`
- `fwidth`