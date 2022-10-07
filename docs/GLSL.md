# GLSL

## Fragment Shader Inputs

gpu-io makes following inputs available to all fragment shader programs:

- `in vec2 v_uv` - The global UV coordinates of the current kernel.

There may be additional inputs available depending on how the fragment shader program is applied.

- For programs run by `step()`, `stepNonBoundary()`, `stepCircle()`, `stepSegment()`:

    - `in vec2 v_uv_local` - The local UV coordinates of of the patch being stepped.  This value is identical to `v_uv` when calling `step()`.  For `stepSegment()` with rounded endcaps enabled, `v_uv_local.x` equals 0.5 for the entirety of the middle section.

- For programs run by `drawLayerAsPoints()`:

    - `in int v_index` - The index of the current point.
    - `in vec2 v_uv_1d` - The UV coordinates of this point within the 1D GPULayer containing    point position data.  This may be helpful if there are other point attributes stored in 1D     GPULayers that you would like to access.
    - `in vec2 v_position` - Position of the current point.

- For programs run by `drawLayerAsVectorField()`:

    - `in int v_index` - The index of the current vector.  Both the head and tail vertices of   each vector segment have the same `v_index`.


## Fragment Shader Outputs

gpu-io supports rendering to multiple GPULayers from a single GPUProgram using the `layout` and `location` declarations.  This functionality will continue to work when gpu-io converts your GLSL3 code to GLSL1 for WebGL1.


## Helper Functions

gpu-io makes the following helper functions available to fragment shaders:

- `TI|TU modi(TI|TU x, TI|TU y)` - Integer version of `mod()`.
- `TI|TU modi(TI|TU x, int|uint y)` - Integer version of `mod()`.
- `TI|TU stepi(TI|TU x, TI|TU y)` - Integer version of `step()`.
- `TI|TU stepi(int|uint x, TI|TU y)` - Integer version of `step()`.

Type annotations used in function descriptions:

`T` = `float` | `vec2` | `vec3` | `vec4`  
`TI` = `int` | `ivec2` | `ivec3` | `ivec4`  
`TU` = `uint` | `uvec2` | `uvec3` | `uvec4`  