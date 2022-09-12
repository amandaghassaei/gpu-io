# GLSL

## Fragment Shader Inputs

gpu-io makes following inputs available to fragment shaders:

- `in vec2 v_uv` - The UV coordinates of the current kernel.

For `step()`, `stepNonBoundary()`, `stepCircle()`, `stepSegment()`:

- `in vec2 v_uv_local` - The local UV coordinates of of the patch being stepped.  This value is identical to `v_uv` when calling `step()`.  For `stepSegment()` with rounded endcaps enabled, `v_uv_local.x` equals 0.5 for the entirety of the middle section.

For `drawLayerAsPoints()`:

- `in int v_index` - The index of the current point.


## Helper Functions

gpu-io makes the following helper functions available to fragment shaders:

Type annotations used in function descriptions:

`T` = `float` | `vec2` | `vec3` | `vec4`  
`TI` = `int` | `ivec2` | `ivec3` | `ivec4`  
`TU` = `uint` | `uvec2` | `uvec3` | `uvec4`  

- `TI|TU modi(TI|TU x, TI|TU y)`
- `TI|TU modi(TI|TU x, int|uint y)`

