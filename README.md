# webgl-gpgpu

GPGPU compute in the browser with WebGL.  Unlike other libraries out there, this is designed with WebGL 1.0 support, so it should run on mobile.

**This repo is under active development, really only posted here for internal use right now, but will have a more official release soon.  As it stands, the API may change at any moment.**

## Use
 
 To install:

`npm install github:amandaghassaei/webgl-gpgpu`

Because this repo is under active development, you may also want to include a specific commit in your install:

`npm install github:amandaghassaei/webgl-gpgpu#d6c75dd`

## Examples

- [Conway's Game of Life shader](https://github.com/amandaghassaei/ConwayShader)
- [Mass Spring shader](https://github.com/amandaghassaei/MassSpringShader)

## Compatibility with threejs

Theoretically, this library should be compatible with threejs and even be able to share a GL context like so:

```
const renderer = new WebGLRenderer();
// Use renderer.autoClear = false if you want to overlay threejs stuff on top of things rendered to the screen from gpgpu.
renderer.autoClear = false;

const gl = renderer.getContext();
const canvas = renderer.domElement;

const gpgpu = new GPGPU(gl, canvas);
```

I have noticed that there can be some issues due to threejs's caching system since it expects that nothing else is interacting with the context.  This is still being sorted out....

## References

I used a few codebases as reference when writing this, thanks to their authors for making the repos available:

- [three.js](https://github.com/mrdoob/three.js/) Javascript 3D library
- [regl](https://github.com/regl-project/regl) - Fast, functional WebGL
- [WebGL Boilerplate](https://webglfundamentals.org/webgl/lessons/webgl-boilerplate.html)

## Development

To build ts files from `src` to js in `dist` run:

`npm run build`

(be sure you have done an `npm install` first)