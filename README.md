# webgl-compute

GPGPU (General Purpose GPU) compute in the browser with WebGL.  This is mainly designed for running gpu fragment shader programs that operate on one or more layers of 2D spatially-distributed state (such as 2D physics simulations or cellular automata).  It also includes an interface for performing operations on large 1D arrays of data (via a fragment shader implementation).

This library supports rendering directly to the screen.  It also has some built-in utilities for e.g. running a program only on the boundary of the screen or in a specified region (for handling mouse/touch events).  This library is designed for WebGL 2.0 if available, with fallbacks to support WebGL 1.0 - so it should run on almost any mobile or older browsers.

**This repo is under active development, really only posted here for internal use right now, but will have a more official release soon.  As it stands, the API may (and probably will) change at any moment and many features have not been fully tested.**


## Use


### Install via npm

`npm install github:amandaghassaei/webgl-compute`

(Because this repo is under active development, you may also want to include a specific commit in your install):

`npm install github:amandaghassaei/webgl-compute#d6c75dd`

And import into your project:

```js
import { GPUComposer, GPULayer, GPUProgram } from 'webgl-compute';
```

## Import into HTML

*OR* you can add [webgl-compute.js](./dist/webgl-compute.js) to your html directly:

```html
<script src="webgl-compute.js"></script>
```

WebGLCompute will be accessible globally.

```js
const { GPUComposer, GPULayer, GPUProgram } = WebGLCompute;
```

## Examples

Note: these are stale examples at this point, will be updated soon.  
- [Conway's Game of Life shader](https://github.com/amandaghassaei/ConwayShader)
- [Mass Spring shader](https://github.com/amandaghassaei/MassSpringShader)


## Compatibility with Threejs

Currently, this library can run in a separate webgl context from threejs with no problems.  The advantage to sharing the webgl context is that both libraries will be able to access shared memory on the gpu.  Theoretically, a shared context should work like so, though I am still sorting out some lingering WebGL warnings:

```js
import THREE from 'three';
import * as WebGLCompute from 'webgl-compute';

const renderer = new THREE.WebGLRenderer();
// Use renderer.autoClear = false if you want to overlay threejs stuff on top
// of things rendered to the screen from webgl-compute.
renderer.autoClear = false;

const gl = renderer.getContext();
const canvas = renderer.domElement;

const composer = WebGLCompute.GPUComposer.initWithThreeRenderer(renderer);
```

To use the output from a webgl-compute GPULayer to a Threejs Texture:

```js
const layer1 = new WebGLCompute.GPULayer({
	name: 'layer-1',
	dimensions: [100, 100],
	type: 'uint8',
	numComponents: 1,
	wrapS: 'CLAMP_TO_EDGE',
	wrapT: 'CLAMP_TO_EDGE',
	filter: 'NEAREST',
	writable: true,
	numBuffers: 1,
});

const texture = new THREE.Texture(
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
composer.attachGPULayerToThreeTexture(layer1, texture);

const mesh = new THREE.Mesh(
	new PlaneBufferGeometry(1, 1),
	new MeshBasicMaterial({
		map: offsetTextureThree,
	}),
);

// Updates to layer1 will propagate to mesh map without any additional needsUpdate flags.
```

More info about using webgl-compute to update mesh positions data is coming soon.


## GLSL Version Support


## Limitations

- This library does not currently allow you to pass in your own vertex shaders.  Currently all computation is happening in user-specified fragment shaders and vertex shaders are managed internally.
- This library defaults to using GLSL1.0 
- 

## Other Notes

### Transform Feedback

You might notice that this library does not use any transform feedback to e.g. handle computations on arbitrary 1D lists.  Transform feedback is great for things like particle simulations and other types of physics that is *not* computed at the pixel level.  It is totally possible to perform these types of simulations using this library, but currently they are all computed in a fragment shader (which I'll admit can be annoying and less efficient).  There are a few reasons for this:

- The main use case for this library is to compute 2D spatially-distributed state stored in textures using fragment shaders.  There is additional support for 1D arrays, but that is a secondary functionality.
- Transform feedback is only supported in WebGL 2.  At the time I first started writing this, WebGL 2 was not supported by mobile Safari.  Though that has changed recently, it will take some time for many people to update (for example, luddites like me who never update their apps), so for now I'd like to support all functionality in this library in WebGL 1.
- I played around with the idea of using transform feedback if WebGL 2 is available, then falling back to a fragment shader implementation if only WebGL 1 is available, but the APIs for each path are so different, it was not a workable option.  So, fragment shaders it is!

My current plan is to wait for [WebGPU](https://web.dev/gpu/) to officially launch, and then re-evaluate some of the design decisions made in this library.  WebGL puts a lot of artificial constraints on the current API (e.g. only allowing up to four channels per texture), so I'd like to get away from it in the long term if possible.

### Precision

By default all shaders in this library are inited with highp precision floats and ints, but it falls back to mediump if not available (this is the same convention used by Threejs):
```glsl
#ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
  precision highp int;
#else
  precision mediump float;
  precision mediump int;
#endif
precision lowp sampler2D;
#if (__VERSION__ == 300)
  precision lowp isampler2D;
  precision lowp usampler2D;
#endif
```

You can override these defaults by specifying `intPrecision` and `floatPrecision` in GPUComposer's constructor:
```js
import {
	GPUComposer,
	PRECISION_LOW_P,
	PRECISION_MEDIUM_P,
	PRECISION_HIGH_P,
} from 'webgl-compute';

const composer = new GPUComposer({
	canvas: document.getElementById('webgl-canvas'),
	intPrecision: PRECISION_MEDIUM_P,
	floatPrecision: PRECISION_MEDIUM_P,
});
```

**Note: even if highp is specified in your shader code, this library will convert to mediump if the current browser does not support highp (the alternative would be to throw an error).**

I've also included the following helper functions to test the precision of mediump on your device and determine whether highp is supported:

```js
const {
	isHighpSupportedInVertexShader,
	isHighpSupportedInFragmentShader,
	getVertexShaderMediumpPrecision,
	getFragmentShaderMediumpPrecision,
} = WebGLCompute;

// Prints 'highp' or 'mediump' depending on returned precision of mediump (16+bit or 32+bit).
// On many devices (esp desktop) mediump defaults to 32bit.
// See https://webglfundamentals.org/webgl/lessons/webgl-precision-issues.html for more info.
console.log(getVertexShaderMediumpPrecision());
console.log(getFragmentShaderMediumpPrecision());

// Print true or false depending on highp support of browser/device.
console.log(isHighpSupportedInVertexShader());
console.log(isHighpSupportedInFragmentShader());
```


## Acknowledgements

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

I've included a few html pages for testing various functions of this library in the browser.  An index of these tests is current hosted at [apps.amandaghassaei.com/webgl-compute/tests/](http://apps.amandaghassaei.com/webgl-compute/tests/).

To run these tests locally:

```sh
npm install
npm run build
npm install http-server
node node_modules/http-server/bin/http-server
```

In a browser navigate to `http://127.0.0.1:8080/tests/` to view available tests.