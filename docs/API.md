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
	// Limited to 4 here because  WebGL textures only support up to RGBA channels.
	numComponents: 1 | 2 | 3 | 4,
	// Optionally pass in initial data array, otherwise DataLayer is allocated but not initialized with a value.
	// If you need to texture to be initialized to zero, you will need to manually write zero to it.
	// For HALF_FLOAT types, pass in a Float32Array (there is no Float16Array in Javascript).
	// Length of array must correspond to dimensions and numComponents.
	array?: TypedArray | number[],
	// Filter to use when interpolating pixels during read operations.
	// For 1D arrays this defaults to NEAREST, and for 2D arrays this defaults to LINEAR.
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
// New DataLayer will have name: `${dataLayer.name}-clone`.
clone(): DataLayer;

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
