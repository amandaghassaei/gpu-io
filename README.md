# glcompute

GPGPU (General Purpose GPU) compute in the browser with WebGL.  This is mainly designed for running gpu fragment shader programs that operate on one or more layers of spatially-distributed state (such as 2D physics simulations or cellular automata).  It *will* also grow to include performing operations on large 1D arrays of data as well (via transform feedback with a fallback to a fragment shader implementation).

This library supports rendering directly to the screen.  It also has some built-in utilities for e.g. running a program only on the boundary of the screen or in a specified region (for handling mouse/touch events).  This library is designed for WebGL 2.0 if available, with fallbacks to support WebGL 1.0 - so it should run on most mobile or older browsers.

**This repo is under active development, really only posted here for internal use right now, but will have a more official release soon.  As it stands, the API may (and probably will) change at any moment and many features have not been fully tested.**

## Use
 
 To install:

`npm install github:amandaghassaei/glcompute`

Because this repo is under active development, you may also want to include a specific commit in your install:

`npm install github:amandaghassaei/glcompute#d6c75dd`

## Examples

- [Conway's Game of Life shader](https://github.com/amandaghassaei/ConwayShader)
- [Mass Spring shader](https://github.com/amandaghassaei/MassSpringShader)

## Compatibility with threejs

Currently, this library can run in a separate webgl context from threejs with no problems.  The advantage to sharing the webgl context is that both libraries will be able to access shared memory on the gpu.  Theoretically, a shared context should work like so:

```
const renderer = new WebGLRenderer();
// Use renderer.autoClear = false if you want to overlay threejs stuff on top
// of things rendered to the screen from glcompute.
renderer.autoClear = false;

const gl = renderer.getContext();
const canvas = renderer.domElement;

const glcompute = new GLCompute(gl, canvas);
```

I have noticed that there can be some issues due to threejs's caching system since it expects that nothing else is interacting with the context.  This is still being sorted out....  

## References

I used a few codebases as reference when writing this, thanks to their authors for making the repos available:

- [three.js](https://github.com/mrdoob/three.js/) Javascript 3D library
- [regl](https://github.com/regl-project/regl) - Fast, functional WebGL
- [WebGL Boilerplate](https://webglfundamentals.org/webgl/lessons/webgl-boilerplate.html)
- [GPU Accelerated Particles with WebGL 2](https://gpfault.net/posts/webgl2-particles.txt.html)

## Development

To build ts files from `src` to js in `dist` run:

`npm run build`

(be sure you have done an `npm install` first)
