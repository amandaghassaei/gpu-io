# gpu-io

**Update 8/28/22: This has not been officially released, coming very soon.**

GPGPU (General Purpose GPU) compute in the browser with WebGL.  This is mainly designed for running gpu fragment shader programs that operate on one or more layers of 2D spatially-distributed state (such as 2D physics simulations or cellular automata).  It also includes an interface for performing operations on large 1D arrays of data (via a fragment shader implementation).

This library supports rendering directly to the screen.  It also has some built-in utilities for e.g. running a program only on the boundary of the screen or in a specified region (for handling mouse/touch events).  This library is designed for WebGL 2.0 if available, with fallbacks to support WebGL 1.0 - so it should run on almost any mobile or older browsers.

One of the main purposes of this library is to allow people to write GPGPU programs without worrying too much about available WebGL versions or spec inconsistencies across different browsers/hardware.  [As of Feb 2022, WebGL 2 has now been rolled out to all major platforms](https://www.khronos.org/blog/webgl-2-achieves-pervasive-support-from-all-major-web-browsers) (including mobile Safari and Microsoft Edge), but widespread adoption will take some time.  Even among WebGL2 implementations, there are differences in behavior across browsers.  Many WebGL1 implementations do not support rendering to Float32 or non-uint8 integer textures, or are inconsistent in how they implement the spec (see [The miserable state of affairs of floating point support](https://www.khronos.org/webgl/public-mailing-list/public_webgl/1703/msg00043.php)).  This library rigorously checks for many of these gotchas and uses software polyfills to patch any issues so *you* don't have to worry about it.  This library will also attempt to automatically convert your GLSL3 shader code into GLSL1 so that it can run on WebGL 1 if needed – this way, you don't have to manage two sets of shader programs depending on the browser's WebGL support.

- [Installation](#installation)
- [API](#api)
- [Examples](#examples)
- [Compatibility with Threejs](#compatibility-with-threejs)
- [Limitations/Caveats/Notes](#limitationscaveatsnotes)
- [Acknowledgements](#acknowledgements)
- [Development](#development)


## Installation

**This repo is under active development, really only posted here for internal use right now, but will have a more official release soon.  As it stands, the API may (and probably will) change at any moment and many features have not been fully tested.**

### Install via npm

`npm install github:amandaghassaei/gpu-io`

(Because this repo is under active development, you may also want to include a specific commit in your install):

`npm install github:amandaghassaei/gpu-io#d6c75dd`

And import into your project:

```js
import { GPUComposer, GPULayer, GPUProgram } from 'gpu-io';
```


### Import into HTML

*OR* you can add [gpu-io.js](./dist/gpu-io.js) to your html directly:

```html
<script src="gpu-io.js"></script>
```

GPUIO will be accessible globally:

```js
const { GPUComposer, GPULayer, GPUProgram } = GPUIO;
```

## API

Full API documentation can be found in the [docs/](./docs/)


## Examples

- [Conway's Game of Life](http://apps.amandaghassaei.com/gpu-io/examples/gol/) (simple)
- [Physarum Transport Network](http://apps.amandaghassaei.com/gpu-io/examples/physarum/) (particle + grid)


## Compatibility with Threejs

Currently, this library can run in a separate webgl context from threejs with no problems.  The advantage to sharing the webgl context is that both libraries will be able to access shared memory on the gpu.  Theoretically, a shared context should work like so, though I am still sorting out some lingering WebGL warnings:

```js
import THREE from 'three';
import * as GPUIO from 'gpu-io';

const renderer = new THREE.WebGLRenderer();
// Use renderer.autoClear = false if you want to overlay threejs stuff
// on top of things rendered to the screen from gpu-io.
renderer.autoClear = false;

const gl = renderer.getContext();
const canvas = renderer.domElement;

const composer = GPUIO.GPUComposer.initWithThreeRenderer(renderer);
```

To use the output from a gpu-io GPULayer to a Threejs Texture:

```js
const layer1 = new GPUIO.GPULayer({
	name: 'layer1',
	dimensions: [100, 100],
	type: GPUIO.UNSIGNED_BYTE,
	numComponents: 1,
	wrapS: GPUIO.CLAMP_TO_EDGE,
	wrapT: GPUIO.CLAMP_TO_EDGE,
	filter: GPUIO.NEAREST,
	writable: true,
	numBuffers: 1,
});

const texture = new THREE.Texture(
	renderer.domElement,
	undefined,
	THREE.ClampToEdgeWrapping,
	THREE.ClampToEdgeWrapping,
	THREE.NearestFilter,
	THREE.NearestFilter,
	THREE.RGBFormat,
	THREE.UnsignedByteType,
);
// Link webgl texture to threejs object.
layer1.attachToThreeTexture(texture);

const mesh = new THREE.Mesh(
	new PlaneBufferGeometry(1, 1),
	new MeshBasicMaterial({
		map: offsetTextureThree,
	}),
);

// Updates to layer1 will propagate to mesh map without any
// additional needsUpdate flags.
```

More info about using gpu-io to update mesh positions data is coming soon.


## Limitations/Caveats/Notes


### Limitations

- This library does not currently allow you to pass in your own vertex shaders.  Currently all computation is happening in user-specified fragment shaders and vertex shaders are managed internally.


### GLSL version

This library defaults to using WebGL2 (if available) with GLSL version 300 (GLSL3) but you can set it to use WebGL1 or GLSL version 100 (GLSL1) by passing `contextID` or `glslVersion` parameters to `GPUComposer`:

```js
import {
	GPUComposer,
	GLSL1,
	WEBGL1,
} from 'gpu-io';

// Init wtih WebGL2 (if available) with GLSL1.
const composer1 = new GPUComposer({
	canvas: document.createElement('canvas'),
	glslVersion: GLSL1,
});

// Init with WebGL1 with GLSL1 (GLSL3 is not supported in WebGL1).
const composer2 = new GPUComposer({
	canvas: document.createElement('canvas'),
	contextID: WEBGL1,
});
```

In either case, this library will fall back to using GLSL1 if GLSL3 is not supported by the current device.


See [docs>GPUComposer>constructor](https://github.com/amandaghassaei/gpu-io/blob/main/docs/classes/GPUComposer.md#constructor) for more information.

More info about the difference between GLSL and WebGL versions:

- [GLSL Versions](https://github.com/mattdesl/lwjgl-basics/wiki/GLSL-Versions) by Matt DesLauriers
- [WebGL1 Reference Card](https://www.khronos.org/files/webgl/webgl-reference-card-1_0.pdf) by Khronos
- [WebGL2 Reference Card](https://www.khronos.org/files/webgl20-reference-guide.pdf) by Khronos
- [WebGL2 from WebGL1](https://webgl2fundamentals.org/webgl/lessons/webgl1-to-webgl2.html) by [webgl2fundamentals.org](https://webgl2fundamentals.org/)
- [WebGL Report](https://webglreport.com/?v=2) by Cesium


### Transform Feedback

You might notice that this library does not use any transform feedback to e.g. handle computations on 1D GPULayers.  Transform feedback is great for things like particle simulations and other types of physics that is *not* computed at the pixel level.  It is totally possible to perform these types of simulations using this library, but currently they are all computed in a fragment shader (which I'll admit can be annoying and less efficient).  There are a few reasons for this:

- The main use case for this library is to compute 2D spatially-distributed state stored in textures using fragment shaders.  There is additional support for 1D arrays, but that is a secondary functionality.
- Transform feedback is only supported in WebGL 2.  At the time I first started writing this, WebGL 2 was not supported by mobile Safari.  Though that has changed recently, it will take some time for many people to update (for example, luddites like me who never update their apps), so for now I'd like to support all functionality in this library in WebGL 1.
- I played around with the idea of using transform feedback if WebGL 2 is available, then falling back to a fragment shader implementation if only WebGL 1 is available, but the APIs for each path are so different, it was not a workable option.  So, fragment shaders it is!

My current plan is to wait for [WebGPU](https://web.dev/gpu/) to officially launch, and then re-evaluate some of the design decisions made in this library.  WebGL puts a lot of artificial constraints on the current API, so I'd like to get away from it in the long term if possible.


### Precision

By default all shaders in this library are inited with highp precision floats and ints, but it falls back to mediump if not available (this is the same convention used by Threejs).  More info in [src/glsl/common/precision.glsl](./src/glsl/common/precision.glsl).

You can override these defaults by specifying `intPrecision` and `floatPrecision` in GPUComposer's constructor:
```js
import {
	GPUComposer,
	PRECISION_LOW_P,
	PRECISION_MEDIUM_P,
	PRECISION_HIGH_P,
} from 'gpu-io';

const composer = new GPUComposer({
	canvas: document.getElementById('webgl-canvas'),
	intPrecision: PRECISION_MEDIUM_P,
	floatPrecision: PRECISION_MEDIUM_P,
});
```

Of course, you can also always manually specify the precision of a particular variable in your shader code:

```glsl
in vec2 v_UV;

// u_state is a BYTE array, so we can set its precision to lowp.
uniform lowp isampler2D u_state;

out vec4 out_fragColor;

void main() {
	lowp int state = texture(u_state, v_UV).r;
	....
}
```

**Note: even if highp is specified in your shader code, this library will convert to mediump if the current browser does not support highp (the alternative would be to throw an error).**

I've also included the following helper functions to test the precision of mediump on your device and determine whether highp is supported:

```js
import {
	isHighpSupportedInVertexShader,
	isHighpSupportedInFragmentShader,
	getVertexShaderMediumpPrecision,
	getFragmentShaderMediumpPrecision,
} from 'gpu-io';

// Prints 'highp' or 'mediump' depending on returned precision of
// mediump (16+bit or 32+bit).
// On many devices (esp desktop) mediump defaults to 32bit.
// See https://webglfundamentals.org/webgl/lessons/webgl-precision-issues.html
// for more info.
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
- [gpu.js](https://github.com/gpujs/gpu.js/)
- [WebGL Boilerplate](https://webglfundamentals.org/webgl/lessons/webgl-boilerplate.html)
- [GPU Accelerated Particles with WebGL 2](https://gpfault.net/posts/webgl2-particles.txt.html)


## Development

Pull requests welcome! I hope this library is useful to others, but I also realize that I have some very specific needs that have influenced the direction of this code – so we'll see what happens.  Please [let me know](https://twitter.com/amandaghassaei) if you end up using this, I'd love to see what you're making!  

Some specific things that I think could be improved:

- 
- I'm sure there are some additional tricks that could be used to further speed up some of the underlying GLSL code and polyfills.


### Compiling with Webpack

Compiled with [webpack](https://www.npmjs.com/package/webpack).  To build ts files from `src` to js in `dist` run:

```
npm install
npm run build
```


### Testing

I'm using mocha + karma + chai + headless Chrome to test the WebGL components of this library, following the setup described in [Automated testing with Headless Chrome](https://developer.chrome.com/blog/headless-karma-mocha-chai/).  Those tests are located in [tests/mocha/](./tests/mocha/).  To run the automated tests, run:

```
npm run test
```

I've also included a few html pages (in the [tests/browser/](./tests/browser/) directory) for testing various functions of this library in a browser/hardware combo of your choice.  An index of these tests is current hosted at [apps.amandaghassaei.com/gpu-io/tests/](http://apps.amandaghassaei.com/gpu-io/tests/).

To run these tests locally:

```
npm install
npm run build
npm install http-server
node node_modules/http-server/bin/http-server
```

In a browser navigate to `http://127.0.0.1:8080/tests/` to view available tests.
