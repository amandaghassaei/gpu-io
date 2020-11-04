# webgl-gpgpu

This repo is under active development, really only posted here for internal use right now, but will have a more official release soon.

GPGPU compute in the browser with WebGL.  Unlike other libraries out there, this is designed with WebGL 1.0 support, so it should run on mobile.  Additionally, it should be compatible with threejs.

## Use
 
 To install:

`npm install git+https:github.com/amandaghassaei/webgl-gpgpu.git`

npm install --save-dev @types/git+https:github.com/amandaghassaei/webgl-gpgpu.git



## Examples

## Scripts

To build Typescript from `src` to Javascript in `dist` run:

`npm run build`

(be sure you have done an `npm install` so that you have typescript installed)

## References

I used a few codebases as reference when writing this, thanks to their authors for making the repos available:

- [three.js](https://github.com/mrdoob/three.js/) Javascript 3D library
- [regl](https://github.com/regl-project/regl) - Fast, functional WebGL
- [WebGL Boilerplate](https://webglfundamentals.org/webgl/lessons/webgl-boilerplate.html)