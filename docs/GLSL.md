# GLSL

## Fragment Shader Inputs

gpu-io makes following inputs available to all fragment shader programs:

- `in vec2 v_uv` - The global UV coordinates of the current kernel.

There may be additional inputs available depending on how the fragment shader program is applied.

- For programs run by `step()`, `stepNonBoundary()`, `stepCircle()`, `stepSegment()`:

  - `in vec2 v_uv_local` - The local UV coordinates of of the patch being stepped.  This value is identical to `v_uv` when calling `step()`.  For `stepSegment()` with rounded endcaps enabled, `v_uv_local.x` equals 0.5 for the entirety of the middle section.

- For programs run by `drawLayerAsPoints()` and `drawLayerAsMesh()`:

  - `in int v_index` - The index of the current point.
  - `in vec2 v_uv_position` - The UV coordinates of this point within the 1D GPULayer containing point position data.  This may be helpful if there are other point attributes stored in 1D GPULayers that you would like to access.
  - `in vec2 v_position` - Position of the current point.

- For programs run by `drawLayerAsVectorField()`:
  - `in int v_index` - The index of the current vector.  Both the head and tail vertices of   each vector segment have the same `v_index`.


## Fragment Shader Outputs

gpu-io supports rendering to multiple GPULayers from a single GPUProgram using the `layout` and `location` declarations.  This functionality will continue to work when gpu-io converts your GLSL3 code to GLSL1 for WebGL1.  You can test this by running the [Physarum Example](https://apps.amandaghassaei.com/gpu-io/examples/physarum/) in GLSL1, which uses multiple outputs in one of its simulation steps.


## Helper Functions

gpu-io makes the following helper functions available to GLSL1 and GLSL3 fragment shaders:

- `TI|TU modi(TI|TU x, TI|TU y)` - Integer version of `mod()`.
- `TI|TU modi(TI|TU x, int|uint y)` - Integer version of `mod()`.
- `TI|TU stepi(TI|TU x, TI|TU y)` - Integer version of `step()`.
- `TI|TU stepi(int|uint x, TI|TU y)` - Integer version of `step()`.
- `vec2 index1DToUV(int|uint index1D, ivec2|uvec2|vec2 dimensions)` - Lookup uv coordinates of 1D GPULayer given a 1D index and the [width, height] of the GPULayer.  Even though GPULayers can be inited as flat lists, internally they are represented as 2D textures in WebGL, so this helper function is necessary for translating 1D -> 2D.

Type annotations used in function descriptions:

`T` = `float` | `vec2` | `vec3` | `vec4`  
`TI` = `int` | `ivec2` | `ivec3` | `ivec4`  
`TU` = `uint` | `uvec2` | `uvec3` | `uvec4`  