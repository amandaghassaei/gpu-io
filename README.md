# glcompute

GPGPU (General Purpose GPU) compute in the browser with WebGL.  This is mainly designed for running gpu fragment shader programs that operate on one or more layers of spatially-distributed state (such as 2D physics simulations, differential equations, or cellular automata).  It also includes an interface for performing operations on large 1D arrays of data (via a fragment shader implementation).

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

Currently, this library can run in a separate webgl context from threejs with no problems.  The advantage to sharing the webgl context is that both libraries will be able to access shared memory on the gpu.  Theoretically, a shared context should work like so, though I am still sorting out some lingering WebGL warnings:

```
const renderer = new WebGLRenderer();
// Use renderer.autoClear = false if you want to overlay threejs stuff on top
// of things rendered to the screen from glcompute.
renderer.autoClear = false;

const gl = renderer.getContext();
const canvas = renderer.domElement;

const glcompute = GLCompute.initWithThreeRenderer(renderer);
```

To use the output from a glcompute DataLayer to a Threejs Texture:

```
const dataLayer = glcompute.initDataLayer({
	name: 'dataLayer-1',
	dimensions: [100, 100],
	type: 'uint8',
	numComponents: 1,
	wrapS: 'CLAMP_TO_EDGE',
	wrapT: 'CLAMP_TO_EDGE',
	filter: 'NEAREST',
	writable: true,
	numBuffers: 1,
});

const texture = new Texture(
	renderer.domElement,
	undefined,
	ClampToEdgeWrapping,
	ClampToEdgeWrapping,
	NearestFilter,
	NearestFilter,
	RGBFormat,
	UnsignedByteType,
);
// Link webgl texture to threejs object.
glcompute.attachDataLayerToThreeTexture(dataLayer, texture);

const mesh = new Mesh(
	new PlaneBufferGeometry(1, 1),
	new MeshBasicMaterial({
		map: offsetTextureThree,
	}),
);

// Updates to dataLayer will propagate to mesh map without any additional needsUpdate flags.
```

More info about using glcompute to update mesh positions data is coming soon.

## References

I used a few codebases as reference when writing this, thanks to their authors for making the repos available:

- [three.js](https://github.com/mrdoob/three.js/)
- [regl](https://github.com/regl-project/regl)
- [WebGL Boilerplate](https://webglfundamentals.org/webgl/lessons/webgl-boilerplate.html)
- [GPU Accelerated Particles with WebGL 2](https://gpfault.net/posts/webgl2-particles.txt.html)

## Development

Compiled with [webpack](https://www.npmjs.com/package/webpack).  To build ts files from `src` to js in `dist` run:

```sh
npm install
npm run build
```

## Testing

I've included a few html pages for testing various functions of this library in the browser.  An index of these tests can be found at [apps.amandaghassaei.com/glcompute/tests/](http://apps.amandaghassaei.com/glcompute/tests/).

To run these tests locally:

```sh
npm install
npm run build
npm install http-server
node node_modules/http-server/bin/http-server
```

In a browser navigate to `http://127.0.0.1:8080/tests/` to view available tests.