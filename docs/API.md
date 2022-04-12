## WebGLCompute

There are two ways to initialize WebGLCompute:

```js
const glcompute = new WebGLCompute(
	params: {
		canvas: HTMLCanvasElement,// Init with a canvas element.

		context?: WebGLRenderingContext | WebGL2RenderingContext | null, // Optionally pass in a WebGLContext.
		// contextID to pass to canvas.getContext(), ignored if a context is passed into constructor.
		// If not set, this library attempts to init a 'webgl2' context, then tries 'webgl', then 'experimental-webgl'.
		contextID?: 'webgl2' | 'webgl' | string,
		// Options to pass to canvas.getContext(), ignored if a context is passed into constructor.
		contextOptions?: {
			antialias?: boolean,
			[key: string]: any,
		},

		// GLSL shader version to use, defaults to GLSL1.
		// If set to GLSL3 and WebGL2 is not available, will attempt to fall back to GLSL1.
		glslVersion?: GLSL3 | GLSL1,

		verboseLogging?: boolean,
	},
	// Optionally pass in an error callback in case we want to handle errors related to webgl support.
	// e.g. throw up a modal telling user this will not work on their device.
	// Defaults to (message: string) => { throw new Error(message); }
	errorCallback: (message: string) => void,
);

// For interop with Threejs, init with a static function:
const glcompute = WebGLCompute.initWithThreeRenderer(
	// Pass in a copy of the Threejs WebGLRenderer.
	renderer: THREE.WebGLRenderer,
	params?: {
		glslVersion?: GLSL3 | GLSL1,
		verboseLogging?: boolean
	},
	errorCallback?: (message: string) => void,
);
```

WebGLCompute properties:

```js
readonly gl: WebGLRenderingContext | WebGL2RenderingContext;

// GLSL version may be different than value passed to constructor depending on browser support.
readonly glslVersion: GLSL3 | GLSL1;
```js

WebGLCompute methods:

```js
isWebGL2(): boolean; // Text if the inited context is WebGL2.
getContext(): WebGLRenderingContext | WebGL2RenderingContext;

initDataLayer(params): DataLayer; // See description in DataLayer section.
initProgram(params): GPUProgram; // See description in GPUProgram section.

initTexture(
	params: {
		name: string,
		url: string,
		filter?: DataLayerFilter,
		wrapS?: DataLayerWrap,
		wrapT?: DataLayerWrap,
		format?: TextureFormat,
		type?: TextureType,
		onLoad?: (texture: WebGLTexture) => void,
	},
): WebGLTexture;

// Let WebGLCompute know that canvas has resized.
// You will still need to call resize on DataLayers individual.
onResize(canvas: HTMLCanvasElement): void;

getValues(dataLayer: DataLayer): TypedArray; // Read current state of DataLayer.
savePNG( // Save an RGBA image from DataLayer.
	dataLayer: DataLayer,
	filename: string, // defaults to DataLayer.name.
	dpi?: number, // Defaults to 72 DPI.
	callback?: (blob: Blob, filename: string) => void, // Defaults to downloading image.
): void;


// Step for entire fullscreen quad.
step(
	params: {
		program: GPUProgram,
		input?:  (DataLayer | WebGLTexture)[] | DataLayer | WebGLTexture,
		output?: DataLayer, // Undefined renders to screen.
		shouldBlendAlpha?: boolean,
	},
): void;

// Step program only for a strip of px along the boundary.
stepBoundary(
	params: {
		program: GPUProgram,
		input?:  (DataLayer | WebGLTexture)[] | DataLayer | WebGLTexture,
		output?: DataLayer, // Undefined renders to screen.
		singleEdge?: 'LEFT' | 'RIGHT' | 'TOP' | 'BOTTOM';
		shouldBlendAlpha?: boolean,
	},
): void;

// Step program for all but a strip of px along the boundary.
stepNonBoundary(
	params: {
		program: GPUProgram,
		input?:  (DataLayer | WebGLTexture)[] | DataLayer | WebGLTexture,
		output?: DataLayer, // Undefined renders to screen.
		shouldBlendAlpha?: boolean,
	},
): void;

// Step program only for a circular spot.
stepCircle(
	params: {
		program: GPUProgram,
		position: [number, number], // Position is in units of pixels.
		radius: number, // Radius is in units of pixels.
		input?:  (DataLayer | WebGLTexture)[] | DataLayer | WebGLTexture,
		output?: DataLayer, // Undefined renders to screen.
		numSegments?: number,
		shouldBlendAlpha?: boolean,
	},
): void;

// Step program only for a thickened line segment (rounded end caps available).
stepSegment(
	params: {
		program: GPUProgram,
		position1: [number, number], // Position is in units of pixels.
		position2: [number, number], // Position is in units of pixels.
		thickness: number, // Thickness is in units of pixels.
		input?:  (DataLayer | WebGLTexture)[] | DataLayer | WebGLTexture,
		output?: DataLayer, // Undefined renders to screen.
		endCaps?: boolean,
		numCapSegments?: number,
		shouldBlendAlpha?: boolean,
	},
): void;

stepPolyline(
	params: {
		program: GPUProgram,
		positions: [number, number][], // Positions are in units of pixels.
		thickness: number, // Thickness of line is in units of pixels.
		input?: (DataLayer | WebGLTexture)[] | DataLayer | WebGLTexture,
		output?: DataLayer, // Undefined renders to screen.
		closeLoop?: boolean,
		includeUVs?: boolean,
		includeNormals?: boolean,
		shouldBlendAlpha?: boolean,
	},
): void;

stepTriangleStrip(
	params: {
		program: GPUProgram,
		positions: Float32Array, // Positions are in units of pixels.
		normals?: Float32Array,
		uvs?: Float32Array,
		input?: (DataLayer | WebGLTexture)[] | DataLayer | WebGLTexture,
		output?: DataLayer, // Undefined renders to screen.
		count?: number,
		shouldBlendAlpha?: boolean,
	},
): void;

stepLines(
params: {
	program: GPUProgram,
	positions: Float32Array, // Positions are in units of pixels.
	indices?: Uint16Array | Uint32Array | Int16Array | Int32Array,
	normals?: Float32Array,
	uvs?: Float32Array,
	input?: (DataLayer | WebGLTexture)[] | DataLayer | WebGLTexture,
	output?: DataLayer, // Undefined renders to screen.
	count?: number,
	closeLoop?: boolean,
	shouldBlendAlpha?: boolean,
}): void;

drawLayerAsPoints(
	params: {
		positions: DataLayer, // Positions are stored in DataLayer in units of pixels.
		program?: GPUProgram,
		input?: (DataLayer | WebGLTexture)[] | DataLayer | WebGLTexture,
		output?: DataLayer,
		pointSize?: number, // pointSize in units of pixels.
		count?: number,
		color?: [number, number, number],
		wrapX?: boolean,
		wrapY?: boolean,
		shouldBlendAlpha?: boolean,
	},
): void;


drawLayerAsLines(
	params: {
		positions: DataLayer, // Positions are stored in DataLayer in units of pixels.
		indices?: Float32Array | Uint16Array | Uint32Array | Int16Array | Int32Array,
		program?: GPUProgram,
		input?: (DataLayer | WebGLTexture)[] | DataLayer | WebGLTexture,
		output?: DataLayer,
		count?: number,
		color?: [number, number, number],
		wrapX?: boolean,
		wrapY?: boolean,
		closeLoop?: boolean,
		shouldBlendAlpha?: boolean,
	},
): void;

drawLayerAsVectorField(
	params: {
		data: DataLayer,
		program?: GPUProgram,
		input?: (DataLayer | WebGLTexture)[] | DataLayer | WebGLTexture,
		output?: DataLayer,
		vectorSpacing?: number,
		vectorScale?: number,
		color?: [number, number, number],
		shouldBlendAlpha?: boolean,
	},
): void;

drawLayerMagnitude(
	params: {
		data: DataLayer,
		input?: (DataLayer | WebGLTexture)[] | DataLayer | WebGLTexture,
		output?: DataLayer,
		scale?: number,
		color?: [number, number, number],
		shouldBlendAlpha?: boolean,
	},
): void;
```

Threejs specific methods:

```js
attachDataLayerToThreeTexture(dataLayer: DataLayer, texture: THREE.Texture) void;
resetThreeState(): void;
```

You are in charge of deallocating WebGLCompute instances when you are done:

```js
glcompute.dispose();
```


## DataLayer

DataLayers store state – they can be used as inputs and outputs in [GPUPrograms](#gpuprogram).

To initialize a DataLayer:

```js
const dataLayer = glcompute.initDataLayer({
	// Give the DataLayer a name (used for error logging).
	name: string,
	// DataLayers can represent 1D or 2D data, pass in dimensions.
	dimensions: number | [number, number], 
	// Data type represented by this DataLayer.  If this type is not supported by the browser,
	// a suitable fallback type will be used (e.g. if no FLOAT, will use HALF_FLOAT).
	// Any type fallbacks will be logged to console.
	type: HALF_FLOAT | FLOAT | UNSIGNED_BYTE | BYTE | UNSIGNED_SHORT | SHORT | UNSIGNED_INT | INT,
	// How many components does this DataLayer contain?
	// Scalar state has 1 component, 2D vector fields have 2.
	// Limited to 4 because WebGL textures only support up to RGBA channels.
	numComponents: 1 | 2 | 3 | 4,
	// Optionally pass in initial data array, otherwise DataLayer is allocated but not initialized with a value.
	// If you need to texture to be initialized to zero, you must manually write zero to it (see DataLayer.clear()).
	// For HALF_FLOAT types, pass in a Float32Array (there is no Float16Array in Javascript).
	// Length of array must correspond to dimensions and numComponents.
	array?: TypedArray | number[],
	// Filter to use when interpolating pixels during read operations.
	// For 1D arrays and 2D integer arrays this defaults to NEAREST.
	// For 2D float arrays this defaults to LINEAR.
	filter?: LINEAR | NEAREST,
	// Wrapping in X / Y, defaults to CLAMP_TO_EDGE.
	wrapS?: REPEAT | CLAMP_TO_EDGE,
	wrapT?: REPEAT | CLAMP_TO_EDGE,
	// All DataLayers are readonly by default, pass writable flag to enable readwrite.
	writable?: boolean,
	// The number of state buffers to store for this DataLayer, defaults to 1.
	// Set numBuffers to 2 if you want to e.g. keep track of the current and previous states
	// of a DataLayer (DataLayer automatically toggles writes across the available buffers),
	// or if you want to use the current state of a DataLayer as an input to a GPUProgram that
	// writes the next state of the same DataLayer (you can't use the same buffer as input and
	// output to a GPUProgram).
	numBuffers?: number,
	// clearValue is the value set when clear() is called, defaults to 0.
	// If number passed in, all components are set to this value.
	// If array passed in, the length of clearValue must match numComponents.
	clearValue?: number | number[]
});
```

DataLayer properties:

```js
// Options passed into the constructor are available as properties.

readonly name: string;
readonly type: HALF_FLOAT | FLOAT | UNSIGNED_BYTE | BYTE | UNSIGNED_SHORT | SHORT | UNSIGNED_INT | INT;
readonly numComponents: 1 | 2 | 3 | 4;
readonly filter: LINEAR | NEAREST;
readonly wrapS: REPEAT | CLAMP_TO_EDGE;
readonly wrapT: REPEAT | CLAMP_TO_EDGE;
readonly writable: boolean;
readonly numBuffers: number;
clearValue: number | number[]; // clearValue can be set at any time.

// DataLayer.width and DataLayer.height give the dimensions of the WebGLTexture used to perform fragment shader computations.
// for 2D DataLayers, this will be the same as the dimensions parameter passed to the constructor.
// 1D DataLayers will have a width and height satisfying: width * height >= length;
readonly width: number;
readonly height: number;
readonly length: number; // Length is only available to 1D DataLayers.

// Get the WebGLTexture corresponding to 
readonly currentState: WebGLTexture;
readonly lastState: WebGLTexture; // Only available to DataLayers with numBuffers > 1.
readonly bufferIndex: number; // Index of currently used buffer (incremented on each draw to DataLayer).

// Due to variable browser support of WebGL features, "internal" variables may be different
// from the parameter originally passed in.  These variables are set so that they match the original
// parameter as best as possible, but fragment shader polyfills may be required.
// All "gl" variables are used to initialize internal WebGLTexture.
// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D
// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter

readonly glInternalFormat: number;
readonly glFormat: number;

// DataLayer.internalType corresponds to DataLayer.glType, may be different from DataLayer.type.
readonly internalType: HALF_FLOAT | FLOAT | UNSIGNED_BYTE | BYTE | UNSIGNED_SHORT | SHORT | UNSIGNED_INT | INT; 
readonly glType: number;

// Internally, DataLayer.glNumChannels may represent a larger number of channels than DataLayer.numComponents.
// For example, writable RGB textures are not supported in WebGL2, must use RGBA instead.
readonly glNumChannels: number;

// DataLayer.internalFilter corresponds to DataLayer.glFilter, may be different from DataLayer.filter.
readonly internalFilter: LINEAR | NEAREST;
readonly glFilter: number;

// DataLayer.internalWrapS corresponds to DataLayer.glWrapS, may be different from DataLayer.wrapS.
readonly internalWrapS: REPEAT | CLAMP_TO_EDGE;
readonly glWrapS: number;
// DataLayer.internalWrapT corresponds to DataLayer.glWrapS, may be different from DataLayer.wrapT.
readonly internalWrapT: REPEAT | CLAMP_TO_EDGE;
readonly glWrapT: number;
```

DataLayer methods:

```js
// Set current state to DataLayer.clearValue
// applyToAllBuffers = true causes all available DataLayer buffers to clear.
// if false, only currentState is cleared.  Defaults to false.
clear(applyToAllBuffers = false): void;

// Set state from array.
// applyToAllBuffers = true causes the array to be copied into all available DataLayer buffers.
// if false, only currentState is updated.  Defaults to false.
// Best to pass in a typed array corresponding to DataLayer.internalType, otherwise it will be converted internally.
setFromArray(array: TypedArray | number[], applyToAllBuffers = false): void;

// Make a deep copy of this DataLayer.
// Unless specified, new DataLayer will have name: `${dataLayer.name}-clone`.
clone(name?: string): DataLayer;

// Resize DataLayer.  This operation will clear all existing state, so you can optionally pass in initialization array.
// Otherwise, new memory is allocated but not initialized.
// Best to pass in a typed array corresponding to DataLayer.internalType, otherwise it will be converted internally.
resize(dimensions: [number, number] | number, array?: TypedArray | number[]): void;

// Get WebGLTexture for buffer index.
// dataLayer.getStateAtIndex(dataLayer.bufferIndex) will return dataLayer.currentState.
getStateAtIndex(index: number): WebGLTexture;
```

You are in charge of deallocating DataLayers when you are done with them:

```js
dataLayer.dispose();
```

Advanced features:

```js
// TODO: document this.
saveCurrentStateToDataLayer(layer: DataLayer)

```

## GPUProgram

GPUProgram are programs that can be applied to [DataLayers](#datalayer).

To initialize a GPUProgram:

```js
const gpuProgram = glcompute.initProgram({
	// Give the GPUProgram a name (used for error logging).
	name: string,
	// Pass in a fragment shader as a source string (or array of source strings).
	fragmentShader: string | string[],
	// Array of uniform names, values, and types for fragment shader.
	// These can also be set or changed later with GPUProgram.setUniform().
	uniforms?: {
		name: string,
		value: boolean | number | number[],
		type: BOOL | FLOAT | INT,
	}[],
	// Key-value pairs of #define variables to use in fragment shader compilation.
	// Values must be passed in as strings.
	// These can be changed later with GPUProgram.recompile();
	defines?: {
		[key: string]: string,
	},
});
```

GPUProgram properties:

```js
readonly name: string;
```

GPUProgram methods:

```js
// Recompile with new compile-time variables.
// Passed in defines will merge with those previously declared for this GPUProgram.
// If no change in defines, this will do nothing.
recompile(defines: { [key: string]: string }): void;

// Set or change fragment shader uniform.
// If uniform has already been set, no need to pass in type.
setUniform(name: string, value: UniformValue, type?: UniformType): void;
```

You are in charge of deallocating GUPrograms when you are done with them:

```js
gpuProgram.dispose();
```