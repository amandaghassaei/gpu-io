(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["GPUIO"] = factory();
	else
		root["GPUIO"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 566:
/***/ (function(__unused_webpack_module, exports) {

(function (global, factory) {
	 true ? factory(exports) :
	0;
})(this, (function (exports) { 'use strict';

	/**
	 * Checks if value is a number (including Infinity).
	 */
	function isNumber(value) {
	    return !Number.isNaN(value) && typeof value === 'number';
	}
	/**
	 * Checks if value is finite number.
	 */
	function isFiniteNumber(value) {
	    return isNumber(value) && Number.isFinite(value);
	}
	/**
	 * Checks if value is integer.
	 */
	function isInteger(value) {
	    return isFiniteNumber(value) && (value % 1 === 0);
	}
	/**
	 * Checks if value is positive number (> 0).
	 */
	function isPositiveNumber(value) {
	    return isNumber(value) && value > 0;
	}
	/**
	 * Checks if value is positive integer (> 0).
	 */
	function isPositiveInteger(value) {
	    return isInteger(value) && value > 0;
	}
	/**
	 * Checks if value is negative number (< 0).
	 */
	function isNegativeNumber(value) {
	    return isNumber(value) && value < 0;
	}
	/**
	 * Checks if value is negative integer (< 0).
	 */
	function isNegativeInteger(value) {
	    return isInteger(value) && value < 0;
	}
	/**
	 * Checks if value is non-negative number (>= 0).
	 */
	function isNonNegativeNumber(value) {
	    return isNumber(value) && value >= 0;
	}
	/**
	 * Checks if value is non-negative integer (>= 0).
	 */
	function isNonNegativeInteger(value) {
	    return isInteger(value) && value >= 0;
	}
	/**
	 * Checks if value is non-positive number (<= 0).
	 */
	function isNonPositiveNumber(value) {
	    return isNumber(value) && value <= 0;
	}
	/**
	 * Checks if value is non-positive integer (<= 0).
	 */
	function isNonPositiveInteger(value) {
	    return isInteger(value) && value <= 0;
	}
	/**
	 * Checks if value is number in range [min, max].
	 */
	function isNumberInRange(value, min, max) {
	    return isNumber(value) && value >= min && value <= max;
	}
	/**
	 * Checks if value is integer in range [min, max].
	 */
	function isIntegerInRange(value, min, max) {
	    return isInteger(value) && value >= min && value <= max;
	}
	/**
	 * Checks if value is string.
	 */
	function isString(value) {
	    return typeof value === 'string';
	}
	/**
	 * Checks if value is TypedArray.
	 */
	function isTypedArray(value) {
	    return ArrayBuffer.isView(value) && !(value instanceof DataView);
	}
	/**
	 * Checks if value is Array or TypedArray.
	 */
	function isArray(value) {
	    return Array.isArray(value) || isTypedArray(value);
	}
	/**
	 * Checks if value is Javascript object.
	 */
	function isObject(value) {
	    return typeof value === 'object' && !isArray(value) && value !== null && !(value instanceof ArrayBuffer) && !(value instanceof DataView);
	}
	/**
	 * Checks if value is boolean.
	 */
	function isBoolean(value) {
	    return typeof value === 'boolean';
	}

	exports.isArray = isArray;
	exports.isBoolean = isBoolean;
	exports.isFiniteNumber = isFiniteNumber;
	exports.isInteger = isInteger;
	exports.isIntegerInRange = isIntegerInRange;
	exports.isNegativeInteger = isNegativeInteger;
	exports.isNegativeNumber = isNegativeNumber;
	exports.isNonNegativeInteger = isNonNegativeInteger;
	exports.isNonNegativeNumber = isNonNegativeNumber;
	exports.isNonPositiveInteger = isNonPositiveInteger;
	exports.isNonPositiveNumber = isNonPositiveNumber;
	exports.isNumber = isNumber;
	exports.isNumberInRange = isNumberInRange;
	exports.isObject = isObject;
	exports.isPositiveInteger = isPositiveInteger;
	exports.isPositiveNumber = isPositiveNumber;
	exports.isString = isString;
	exports.isTypedArray = isTypedArray;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=type-checks.js.map


/***/ }),

/***/ 809:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.changeDpiBlob = changeDpiBlob;
exports.changeDpiDataUrl = changeDpiDataUrl;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function createPngDataTable() {
  /* Table of CRCs of all 8-bit messages. */
  var crcTable = new Int32Array(256);
  for (var n = 0; n < 256; n++) {
    var c = n;
    for (var k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ c >>> 1 : c >>> 1;
    }
    crcTable[n] = c;
  }
  return crcTable;
}

function calcCrc(buf) {
  var c = -1;
  if (!pngDataTable) pngDataTable = createPngDataTable();
  for (var n = 0; n < buf.length; n++) {
    c = pngDataTable[(c ^ buf[n]) & 0xFF] ^ c >>> 8;
  }
  return c ^ -1;
}

var pngDataTable = void 0;

var PNG = 'image/png';
var JPEG = 'image/jpeg';

// those are 3 possible signature of the physBlock in base64.
// the pHYs signature block is preceed by the 4 bytes of lenght. The length of
// the block is always 9 bytes. So a phys block has always this signature:
// 0 0 0 9 p H Y s.
// However the data64 encoding aligns we will always find one of those 3 strings.
// this allow us to find this particular occurence of the pHYs block without
// converting from b64 back to string
var b64PhysSignature1 = 'AAlwSFlz';
var b64PhysSignature2 = 'AAAJcEhZ';
var b64PhysSignature3 = 'AAAACXBI';

var _P = 'p'.charCodeAt(0);
var _H = 'H'.charCodeAt(0);
var _Y = 'Y'.charCodeAt(0);
var _S = 's'.charCodeAt(0);

function changeDpiBlob(blob, dpi) {
  // 33 bytes are ok for pngs and jpegs
  // to contain the information.
  var headerChunk = blob.slice(0, 33);
  return new Promise(function (resolve, reject) {
    var fileReader = new FileReader();
    fileReader.onload = function () {
      var dataArray = new Uint8Array(fileReader.result);
      var tail = blob.slice(33);
      var changedArray = changeDpiOnArray(dataArray, dpi, blob.type);
      resolve(new Blob([changedArray, tail], { type: blob.type }));
    };
    fileReader.readAsArrayBuffer(headerChunk);
  });
}

function changeDpiDataUrl(base64Image, dpi) {
  var dataSplitted = base64Image.split(',');
  var format = dataSplitted[0];
  var body = dataSplitted[1];
  var type = void 0;
  var headerLength = void 0;
  var overwritepHYs = false;
  if (format.indexOf(PNG) !== -1) {
    type = PNG;
    var b64Index = detectPhysChunkFromDataUrl(body);
    // 28 bytes in dataUrl are 21bytes, length of phys chunk with everything inside.
    if (b64Index >= 0) {
      headerLength = Math.ceil((b64Index + 28) / 3) * 4;
      overwritepHYs = true;
    } else {
      headerLength = 33 / 3 * 4;
    }
  }
  if (format.indexOf(JPEG) !== -1) {
    type = JPEG;
    headerLength = 18 / 3 * 4;
  }
  // 33 bytes are ok for pngs and jpegs
  // to contain the information.
  var stringHeader = body.substring(0, headerLength);
  var restOfData = body.substring(headerLength);
  var headerBytes = atob(stringHeader);
  var dataArray = new Uint8Array(headerBytes.length);
  for (var i = 0; i < dataArray.length; i++) {
    dataArray[i] = headerBytes.charCodeAt(i);
  }
  var finalArray = changeDpiOnArray(dataArray, dpi, type, overwritepHYs);
  var base64Header = btoa(String.fromCharCode.apply(String, _toConsumableArray(finalArray)));
  return [format, ',', base64Header, restOfData].join('');
}

function detectPhysChunkFromDataUrl(data) {
  var b64index = data.indexOf(b64PhysSignature1);
  if (b64index === -1) {
    b64index = data.indexOf(b64PhysSignature2);
  }
  if (b64index === -1) {
    b64index = data.indexOf(b64PhysSignature3);
  }
  // if b64index === -1 chunk is not found
  return b64index;
}

function searchStartOfPhys(data) {
  var length = data.length - 1;
  // we check from the end since we cut the string in proximity of the header
  // the header is within 21 bytes from the end.
  for (var i = length; i >= 4; i--) {
    if (data[i - 4] === 9 && data[i - 3] === _P && data[i - 2] === _H && data[i - 1] === _Y && data[i] === _S) {
      return i - 3;
    }
  }
}

function changeDpiOnArray(dataArray, dpi, format, overwritepHYs) {
  if (format === JPEG) {
    dataArray[13] = 1; // 1 pixel per inch or 2 pixel per cm
    dataArray[14] = dpi >> 8; // dpiX high byte
    dataArray[15] = dpi & 0xff; // dpiX low byte
    dataArray[16] = dpi >> 8; // dpiY high byte
    dataArray[17] = dpi & 0xff; // dpiY low byte
    return dataArray;
  }
  if (format === PNG) {
    var physChunk = new Uint8Array(13);
    // chunk header pHYs
    // 9 bytes of data
    // 4 bytes of crc
    // this multiplication is because the standard is dpi per meter.
    dpi *= 39.3701;
    physChunk[0] = _P;
    physChunk[1] = _H;
    physChunk[2] = _Y;
    physChunk[3] = _S;
    physChunk[4] = dpi >>> 24; // dpiX highest byte
    physChunk[5] = dpi >>> 16; // dpiX veryhigh byte
    physChunk[6] = dpi >>> 8; // dpiX high byte
    physChunk[7] = dpi & 0xff; // dpiX low byte
    physChunk[8] = physChunk[4]; // dpiY highest byte
    physChunk[9] = physChunk[5]; // dpiY veryhigh byte
    physChunk[10] = physChunk[6]; // dpiY high byte
    physChunk[11] = physChunk[7]; // dpiY low byte
    physChunk[12] = 1; // dot per meter....

    var crc = calcCrc(physChunk);

    var crcChunk = new Uint8Array(4);
    crcChunk[0] = crc >>> 24;
    crcChunk[1] = crc >>> 16;
    crcChunk[2] = crc >>> 8;
    crcChunk[3] = crc & 0xff;

    if (overwritepHYs) {
      var startingIndex = searchStartOfPhys(dataArray);
      dataArray.set(physChunk, startingIndex);
      dataArray.set(crcChunk, startingIndex + 13);
      return dataArray;
    } else {
      // i need to give back an array of data that is divisible by 3 so that
      // dataurl encoding gives me integers, for luck this chunk is 17 + 4 = 21
      // if it was we could add a text chunk contaning some info, untill desired
      // length is met.

      // chunk structur 4 bytes for length is 9
      var chunkLength = new Uint8Array(4);
      chunkLength[0] = 0;
      chunkLength[1] = 0;
      chunkLength[2] = 0;
      chunkLength[3] = 9;

      var finalHeader = new Uint8Array(54);
      finalHeader.set(dataArray, 0);
      finalHeader.set(chunkLength, 33);
      finalHeader.set(physChunk, 37);
      finalHeader.set(crcChunk, 50);
      return finalHeader;
    }
  }
}

/***/ }),

/***/ 162:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function(a,b){if(true)!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (b),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else {}})(this,function(){"use strict";function b(a,b){return"undefined"==typeof b?b={autoBom:!1}:"object"!=typeof b&&(console.warn("Deprecated: Expected third argument to be a object"),b={autoBom:!b}),b.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(a.type)?new Blob(["\uFEFF",a],{type:a.type}):a}function c(a,b,c){var d=new XMLHttpRequest;d.open("GET",a),d.responseType="blob",d.onload=function(){g(d.response,b,c)},d.onerror=function(){console.error("could not download file")},d.send()}function d(a){var b=new XMLHttpRequest;b.open("HEAD",a,!1);try{b.send()}catch(a){}return 200<=b.status&&299>=b.status}function e(a){try{a.dispatchEvent(new MouseEvent("click"))}catch(c){var b=document.createEvent("MouseEvents");b.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),a.dispatchEvent(b)}}var f="object"==typeof window&&window.window===window?window:"object"==typeof self&&self.self===self?self:"object"==typeof __webpack_require__.g&&__webpack_require__.g.global===__webpack_require__.g?__webpack_require__.g:void 0,a=f.navigator&&/Macintosh/.test(navigator.userAgent)&&/AppleWebKit/.test(navigator.userAgent)&&!/Safari/.test(navigator.userAgent),g=f.saveAs||("object"!=typeof window||window!==f?function(){}:"download"in HTMLAnchorElement.prototype&&!a?function(b,g,h){var i=f.URL||f.webkitURL,j=document.createElement("a");g=g||b.name||"download",j.download=g,j.rel="noopener","string"==typeof b?(j.href=b,j.origin===location.origin?e(j):d(j.href)?c(b,g,h):e(j,j.target="_blank")):(j.href=i.createObjectURL(b),setTimeout(function(){i.revokeObjectURL(j.href)},4E4),setTimeout(function(){e(j)},0))}:"msSaveOrOpenBlob"in navigator?function(f,g,h){if(g=g||f.name||"download","string"!=typeof f)navigator.msSaveOrOpenBlob(b(f,h),g);else if(d(f))c(f,g,h);else{var i=document.createElement("a");i.href=f,i.target="_blank",setTimeout(function(){e(i)})}}:function(b,d,e,g){if(g=g||open("","_blank"),g&&(g.document.title=g.document.body.innerText="downloading..."),"string"==typeof b)return c(b,d,e);var h="application/octet-stream"===b.type,i=/constructor/i.test(f.HTMLElement)||f.safari,j=/CriOS\/[\d]+/.test(navigator.userAgent);if((j||h&&i||a)&&"undefined"!=typeof FileReader){var k=new FileReader;k.onloadend=function(){var a=k.result;a=j?a:a.replace(/^data:[^;]*;/,"data:attachment/file;"),g?g.location.href=a:location=a,g=null},k.readAsDataURL(b)}else{var l=f.URL||f.webkitURL,m=l.createObjectURL(b);g?g.location=m:location.href=m,g=null,setTimeout(function(){l.revokeObjectURL(m)},4E4)}});f.saveAs=g.saveAs=g, true&&(module.exports=g)});

//# sourceMappingURL=FileSaver.min.js.map

/***/ }),

/***/ 484:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GPUComposer = void 0;
// @ts-ignore
var changedpi_1 = __webpack_require__(809);
var type_checks_1 = __webpack_require__(566);
var GPULayer_1 = __webpack_require__(355);
__webpack_require__(191);
var constants_1 = __webpack_require__(601);
var ThreejsUtils = __webpack_require__(404);
var utils_1 = __webpack_require__(593);
var DefaultVertexShader_1 = __webpack_require__(651);
var LayerLinesVertexShader_1 = __webpack_require__(567);
var SegmentVertexShader_1 = __webpack_require__(946);
var LayerPointsVertexShader_1 = __webpack_require__(929);
var LayerVectorFieldVertexShader_1 = __webpack_require__(634);
var conversions_1 = __webpack_require__(690);
var Programs_1 = __webpack_require__(579);
var checks_1 = __webpack_require__(707);
var framebuffers_1 = __webpack_require__(798);
var GPUComposer = /** @class */ (function () {
    /**
     * Create a GPUComposer.
     * @param params - GPUComposer parameters.
     * @param params.canvas - HTMLCanvasElement associated with this GPUComposer (you must add to DOM yourself).
     * @param params.context - Pass in a WebGL context for the GPUcomposer to user.
     * @param params.contextID - Set the contextID to use when initing a new WebGL context.
     * @param params.contextAttributes - Options to pass to WebGL context on initialization (see https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext for more information).
     * @param params.glslVersion - Set the GLSL version to use, defaults to GLSL3 for WebGL2 contexts.
     * @param params.intPrecision - Set the global integer precision in shader programs.
     * @param params.floatPrecision - Set the global float precision in shader programs.
     * @param params.verboseLogging - Set the verbosity of GPUComposer logging (defaults to false).
     * @param params.errorCallback - Custom error handler, defaults to throwing an Error with message.
     */
    function GPUComposer(params) {
        var _a;
        this._errorState = false;
        // Cache multiple circle positions buffers for various num segments, use numSegments as key.
        this._circlePositionsBuffer = {};
        /**
         * Cache vertex shader attribute locations.
         */
        this._vertexAttributeLocations = {};
        this._enabledVertexAttributes = {};
        // Keep track of all GL extensions that have been loaded.
        /**
         * @private
         */
        this._extensions = {};
        /**
         * Cache some generic programs for copying data.
         * These are needed for rendering partial screen geometries.
         */
        this._copyPrograms = {};
        // Other util programs.
        /**
         * Cache some generic programs for setting value from uniform.
         * These are used by GPULayer.clear(), among other things
         */
        this._setValuePrograms = {};
        /**
         * Vertex shaders are shared across all GPUProgram instances.
         * @private
         */
        this._vertexShaders = (_a = {},
            _a[constants_1.DEFAULT_PROGRAM_NAME] = {
                src: DefaultVertexShader_1.DEFAULT_VERT_SHADER_SOURCE,
                compiledShaders: {},
            },
            _a[constants_1.SEGMENT_PROGRAM_NAME] = {
                src: SegmentVertexShader_1.SEGMENT_VERTEX_SHADER_SOURCE,
                compiledShaders: {},
            },
            _a[constants_1.LAYER_POINTS_PROGRAM_NAME] = {
                src: LayerPointsVertexShader_1.LAYER_POINTS_VERTEX_SHADER_SOURCE,
                compiledShaders: {},
            },
            _a[constants_1.LAYER_VECTOR_FIELD_PROGRAM_NAME] = {
                src: LayerVectorFieldVertexShader_1.LAYER_VECTOR_FIELD_VERTEX_SHADER_SOURCE,
                compiledShaders: {},
            },
            _a[constants_1.LAYER_LINES_PROGRAM_NAME] = {
                src: LayerLinesVertexShader_1.LAYER_LINES_VERTEX_SHADER_SOURCE,
                compiledShaders: {},
            },
            _a);
        /**
         * Flag to set GPUcomposer for verbose logging, defaults to false.
         */
        this.verboseLogging = false;
        this._numTicks = 0;
        // Check params.
        var validKeys = ['canvas', 'context', 'contextID', 'contextAttributes', 'glslVersion', 'intPrecision', 'floatPrecision', 'verboseLogging', 'errorCallback'];
        var requiredKeys = ['canvas'];
        var keys = Object.keys(params);
        (0, checks_1.checkValidKeys)(keys, validKeys, 'GPUComposer(params)');
        (0, checks_1.checkRequiredKeys)(keys, requiredKeys, 'GPUComposer(params)');
        if (params.verboseLogging !== undefined)
            this.verboseLogging = params.verboseLogging;
        // Save callback in case we run into an error.
        var self = this;
        this._errorCallback = function (message) {
            if (self._errorState) {
                return;
            }
            self._errorState = true;
            params.errorCallback ? params.errorCallback(message) : (0, constants_1.DEFAULT_ERROR_CALLBACK)(message);
        };
        var canvas = params.canvas;
        var gl = params.context;
        // Init GL.
        if (!gl) {
            // Init a gl context if not passed in.
            if (params.contextID) {
                var _gl = canvas.getContext(params.contextID, params.contextAttributes);
                if (!_gl) {
                    console.warn("Unable to initialize WebGL context with contextID: ".concat(params.contextID, "."));
                }
                else {
                    gl = _gl;
                }
            }
            if (!gl) {
                var _gl = canvas.getContext(constants_1.WEBGL2, params.contextAttributes)
                    || canvas.getContext(constants_1.WEBGL1, params.contextAttributes)
                    || canvas.getContext(constants_1.EXPERIMENTAL_WEBGL2, params.contextAttributes)
                    || canvas.getContext(constants_1.EXPERIMENTAL_WEBGL, params.contextAttributes);
                if (_gl) {
                    gl = _gl;
                }
            }
            if (!gl) {
                this._errorCallback('Unable to initialize WebGL context.');
                return;
            }
        }
        this.isWebGL2 = (0, utils_1.isWebGL2)(gl);
        if (this.isWebGL2) {
            if (this.verboseLogging)
                console.log('Using WebGL 2.0 context.');
        }
        else {
            if (this.verboseLogging)
                console.log('Using WebGL 1.0 context.');
        }
        this.gl = gl;
        // Save glsl version, default to 3 if using webgl2 context.
        var glslVersion = params.glslVersion || (this.isWebGL2 ? constants_1.GLSL3 : constants_1.GLSL1);
        if (!this.isWebGL2 && glslVersion === constants_1.GLSL3) {
            console.warn('GLSL3.x is incompatible with WebGL1.0 contexts, falling back to GLSL1.');
            glslVersion = constants_1.GLSL1; // Fall back to GLSL1 in these cases.
        }
        this.glslVersion = glslVersion;
        // Set default int/float precision.
        this.intPrecision = params.intPrecision || constants_1.PRECISION_HIGH_P;
        this.floatPrecision = params.floatPrecision || constants_1.PRECISION_HIGH_P;
        // GL setup.
        // Disable depth testing globally.
        gl.disable(gl.DEPTH_TEST);
        // Set unpack alignment to 1 so we can have textures of arbitrary dimensions.
        // https://stackoverflow.com/questions/51582282/error-when-creating-textures-in-webgl-with-the-rgb-format
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
        // Unbind active buffer.
        if (this.isWebGL2)
            gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        // Canvas setup.
        this.resize([canvas.clientWidth, canvas.clientHeight]);
        if (this.verboseLogging) {
            // Log number of textures available.
            console.log("".concat(this.gl.getParameter(this.gl.MAX_TEXTURE_IMAGE_UNITS), " textures max."));
        }
    }
    ;
    /**
     * Create a GPUComposer from an existing THREE.WebGLRenderer that shares a single WebGL context.
     * @param renderer - Threejs WebGLRenderer.
     * @param params - GPUComposer parameters.
     * @param params.glslVersion - Set the GLSL version to use, defaults to GLSL3 for WebGL2 contexts.
     * @param params.intPrecision - Set the global integer precision in shader programs.
     * @param params.floatPrecision - Set the global float precision in shader programs.
     * @param params.verboseLogging - Set the verbosity of GPUComposer logging (defaults to false).
     * @param params.errorCallback - Custom error handler, defaults to throwing an Error with message.
     * @returns
     */
    GPUComposer.initWithThreeRenderer = function (renderer, params) {
        var composer = new GPUComposer(__assign(__assign({ floatPrecision: renderer.capabilities.precision, intPrecision: renderer.capabilities.precision }, params), { canvas: renderer.domElement, context: renderer.getContext() }));
        // Attach renderer.
        // @ts-ignore
        composer._threeRenderer = renderer;
        return composer;
    };
    Object.defineProperty(GPUComposer.prototype, "canvas", {
        get: function () {
            return this.gl.canvas;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Gets (and caches) generic set value programs for several input types.
     * Used for GPULayer.clear(), among other things.
     * @private
     */
    GPUComposer.prototype._setValueProgramForType = function (type) {
        var _setValuePrograms = this._setValuePrograms;
        var key = (0, conversions_1.uniformTypeForType)(type, this.glslVersion);
        if (_setValuePrograms[key] === undefined) {
            _setValuePrograms[key] = (0, Programs_1.setValueProgram)(this, { type: type, value: [0, 0, 0, 0] });
        }
        return _setValuePrograms[key];
    };
    /**
     * Gets (and caches) generic copy programs for several input types.
     * Used for partial rendering to output, among other things.
     * @private
     */
    GPUComposer.prototype._copyProgramForType = function (type) {
        var _copyPrograms = this._copyPrograms;
        var key = (0, conversions_1.uniformTypeForType)(type, this.glslVersion);
        if (_copyPrograms[key] === undefined) {
            _copyPrograms[key] = (0, Programs_1.copyProgram)(this, { type: type });
        }
        return _copyPrograms[key];
    };
    // /**
    //  * Gets (and caches) a generic color program for wrapped line segment rendering.
    //  * @private
    //  */
    // private _getWrappedLineColorProgram() {
    // 	if (this._wrappedLineColorProgram === undefined) {
    // 		this._wrappedLineColorProgram = wrappedLineColorProgram({ composer: this });
    // 	}
    // 	return this._wrappedLineColorProgram;
    // }
    /**
     * Init a buffer for vertex shader attributes.
     * @private
     */
    GPUComposer.prototype._initVertexBuffer = function (data) {
        var _a = this, _errorCallback = _a._errorCallback, gl = _a.gl, isWebGL2 = _a.isWebGL2;
        // Unbind any  VAOs.
        if (isWebGL2)
            gl.bindVertexArray(null);
        var buffer = gl.createBuffer();
        if (!buffer) {
            _errorCallback('Unable to allocate gl buffer.');
            return;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        // Add buffer data.
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        return buffer;
    };
    /**
     * Get (and cache) positions buffer for rendering full screen quads.
     * @private
     */
    GPUComposer.prototype._getQuadPositionsBuffer = function () {
        if (this._quadPositionsBuffer === undefined) {
            var fsQuadPositions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
            this._quadPositionsBuffer = this._initVertexBuffer(fsQuadPositions);
        }
        return this._quadPositionsBuffer;
    };
    /**
     * Get (and cache) positions buffer for rendering lines on boundary.
     * @private
     */
    GPUComposer.prototype._getBoundaryPositionsBuffer = function () {
        if (this._boundaryPositionsBuffer === undefined) {
            var boundaryPositions = new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1, -1, -1]);
            this._boundaryPositionsBuffer = this._initVertexBuffer(boundaryPositions);
        }
        return this._boundaryPositionsBuffer;
    };
    /**
     * Get (and cache) positions buffer for rendering circle with various numbers of segments.
     * @private
     */
    GPUComposer.prototype._getCirclePositionsBuffer = function (numSegments) {
        var _circlePositionsBuffer = this._circlePositionsBuffer;
        if (_circlePositionsBuffer[numSegments] == undefined) {
            var unitCirclePoints = [0, 0];
            for (var i = 0; i < numSegments; i++) {
                unitCirclePoints.push(Math.cos(2 * Math.PI * i / numSegments), Math.sin(2 * Math.PI * i / numSegments));
            }
            // Add one more point to close the loop on the triangle fan.
            unitCirclePoints.push(Math.cos(0), Math.sin(0));
            var circlePositions = new Float32Array(unitCirclePoints);
            var buffer = this._initVertexBuffer(circlePositions);
            _circlePositionsBuffer[numSegments] = buffer;
        }
        return _circlePositionsBuffer[numSegments];
    };
    /**
     * Used internally, see GPULayer.clone() for public API.
     * @private
     */
    GPUComposer.prototype._cloneGPULayer = function (gpuLayer, name) {
        var dimensions = gpuLayer.is1D() ? gpuLayer.length : [gpuLayer.width, gpuLayer.height];
        var clone = new GPULayer_1.GPULayer(this, {
            name: name || "".concat(gpuLayer.name, "-clone"),
            dimensions: dimensions,
            type: gpuLayer.type,
            numComponents: gpuLayer.numComponents,
            filter: gpuLayer.filter,
            wrapX: gpuLayer.wrapX,
            wrapY: gpuLayer.wrapY,
            numBuffers: gpuLayer.numBuffers,
            clearValue: gpuLayer.clearValue,
        });
        // Copy current state with several draw calls.
        var copyProgram = this._copyProgramForType(gpuLayer.type);
        // Set bufferIndex = gpuLayer.numBuffers - 1.
        for (var i = 0; i < gpuLayer.numBuffers - 1; i++) {
            clone.incrementBufferIndex();
        }
        for (var i = 0; i < gpuLayer.numBuffers; i++) {
            this.step({
                program: copyProgram,
                input: gpuLayer.getStateAtIndex(i),
                output: clone,
            });
        }
        // Increment clone's buffer index until it is identical to the original layer.
        for (var i = -1; i < gpuLayer.bufferIndex; i++) {
            clone.incrementBufferIndex();
        }
        return clone;
    };
    /**
     * Gets (and caches) vertex shaders based on shader source code and compile time constants.
     * Tries to minimize the number of new vertex shaders that must be compiled.
     * @private
     */
    GPUComposer.prototype._getVertexShader = function (name, vertexID, vertexCompileConstants, programName) {
        var _a = this, _errorCallback = _a._errorCallback, _vertexShaders = _a._vertexShaders, gl = _a.gl, glslVersion = _a.glslVersion, intPrecision = _a.intPrecision, floatPrecision = _a.floatPrecision;
        var _b = _vertexShaders[name], compiledShaders = _b.compiledShaders, src = _b.src;
        if (vertexID === '')
            vertexID = '_default';
        if (compiledShaders[vertexID] === undefined) {
            // Compile a vertex shader (this only happens once for each possible vertex shader across all GPUPrograms).
            if (src === '') {
                throw new Error("Error compiling GPUProgram \"".concat(programName, "\": no source for vertex shader with name \"").concat(name, "\"."));
            }
            var preprocessedSrc = (0, utils_1.preprocessVertexShader)(src, glslVersion);
            var shader = (0, utils_1.compileShader)(gl, glslVersion, intPrecision, floatPrecision, preprocessedSrc, gl.VERTEX_SHADER, programName, _errorCallback, vertexCompileConstants, true);
            if (!shader) {
                _errorCallback("Unable to compile \"".concat(name).concat(vertexID, "\" vertex shader for GPUProgram \"").concat(programName, "\"."));
                return;
            }
            // Save the results so this does not have to be repeated.
            compiledShaders[vertexID] = shader;
        }
        return compiledShaders[vertexID];
    };
    /**
     * Notify the GPUComposer that the canvas should change size.
     * @param dimensions - The new [width, height] to resize to.
     */
    GPUComposer.prototype.resize = function (dimensions) {
        var canvas = this.canvas;
        var width = dimensions[0], height = dimensions[1];
        // Set correct canvas pixel size.
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/By_example/Canvas_size_and_WebGL
        canvas.width = width;
        canvas.height = height;
        // Save dimensions.
        this._width = width;
        this._height = height;
    };
    ;
    /**
     * Set inputs and outputs in preparation for draw call.
     * @private
     */
    GPUComposer.prototype._drawSetup = function (gpuProgram, programName, vertexCompileConstants, fullscreenRender, input, output) {
        var _a = this, gl = _a.gl, _threeRenderer = _a._threeRenderer, isWebGL2 = _a.isWebGL2;
        // Unbind VAO for threejs compatibility.
        if (_threeRenderer && isWebGL2)
            gl.bindVertexArray(null);
        // CAUTION: the order of these next few lines is important.
        // Get a shallow copy of current textures.
        // This line must come before this._setOutputLayer() as it depends on current internal state.
        var inputTextures = [];
        if (input) {
            if (input.layer) {
                inputTextures.push(input);
            }
            else if (input.constructor === GPULayer_1.GPULayer) {
                inputTextures.push(input.currentState);
            }
            else {
                for (var i = 0; i < input.length; i++) {
                    var layer = input[i];
                    inputTextures.push(layer.currentState ? layer.currentState : layer);
                }
            }
        }
        var program = gpuProgram._getProgramWithName(programName, vertexCompileConstants, inputTextures);
        // Set output framebuffer.
        // This may modify WebGL internal state.
        this._setOutputLayer(gpuProgram.name, fullscreenRender, input, output);
        // Set current program.
        // Must do this before calling gpuProgram._setInternalFragmentUniforms(program, inputTextures);
        gl.useProgram(program);
        // Set input textures.
        for (var i = 0; i < inputTextures.length; i++) {
            gl.activeTexture(gl.TEXTURE0 + i);
            gl.bindTexture(gl.TEXTURE_2D, inputTextures[i].texture);
        }
        gpuProgram._setInternalFragmentUniforms(program, inputTextures);
        return program;
    };
    /**
     * Set blend mode for draw call.
     * @private
     */
    GPUComposer.prototype._setBlendMode = function (blendAlpha) {
        var gl = this.gl;
        if (blendAlpha) {
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        }
    };
    /**
     * Add GPULayer to inputs if needed.
     * @private
     */
    GPUComposer.prototype._addLayerToInputs = function (layer, input) {
        // Add layer to end of input if needed.
        // Do this with no mutations.
        if (input === undefined) {
            return [layer];
        }
        if ((0, type_checks_1.isArray)(input)) {
            // Return input with layer added if needed.
            if ((0, utils_1.indexOfLayerInArray)(layer, input) >= 0) {
                return input;
            }
            return __spreadArray(__spreadArray([], input, true), [layer], false);
        }
        if (input === layer || input.layer === layer) {
            return [input];
        }
        return [input, layer];
    };
    /**
     * Copy data from input to output.
     * This is used when rendering to part of output state (not fullscreen quad).
     * @private
     */
    GPUComposer.prototype._passThroughLayerDataFromInputToOutput = function (state) {
        // TODO: figure out the fastest way to copy a texture.
        var copyProgram = this._copyProgramForType(state._internalType);
        this.step({
            program: copyProgram,
            input: state,
            output: state,
        });
    };
    /**
     * Set output for draw command.
     * @private
     */
    GPUComposer.prototype._setOutputLayer = function (programName, fullscreenRender, input, output) {
        var _a = this, gl = _a.gl, isWebGL2 = _a.isWebGL2;
        // Render to screen.
        if (!output) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            // Resize viewport.
            var _b = this, _width = _b._width, _height = _b._height;
            gl.viewport(0, 0, _width, _height);
            return;
        }
        var outputArray = ((0, type_checks_1.isArray)(output) ? output : [output]);
        for (var i = 0, numOutputs = outputArray.length; i < numOutputs; i++) {
            var outputLayer = outputArray[i];
            // Check if output is same as one of input layers.
            if (input && ((input === output || input.layer === output) ||
                ((0, type_checks_1.isArray)(input) && (0, utils_1.indexOfLayerInArray)(outputLayer, input) >= 0))) {
                if (outputLayer.numBuffers === 1) {
                    throw new Error('Cannot use same buffer for input and output of a program. Try increasing the number of buffers in your output layer to at least 2 so you can render to nextState using currentState as an input.');
                }
                if (fullscreenRender) {
                    // Render and increment buffer.
                    outputLayer._prepareForWrite(true);
                }
                else {
                    // Pass input texture through to output.
                    this._passThroughLayerDataFromInputToOutput(outputLayer);
                    // Render to output without incrementing buffer.
                    outputLayer._prepareForWrite(false);
                }
            }
            else {
                if (fullscreenRender) {
                    // Render and increment buffer.
                    outputLayer._prepareForWrite(true);
                }
                else {
                    // If we are doing a sneaky thing with a swapped texture and are
                    // only rendering part of the screen, we may need to add a copy operation.
                    if (outputLayer._usingTextureOverrideForCurrentBuffer()) {
                        this._passThroughLayerDataFromInputToOutput(outputLayer);
                    }
                    outputLayer._prepareForWrite(false);
                }
            }
        }
        // Bind framebuffer.
        var layer0 = outputArray[0];
        var additionalTextures = undefined;
        var drawBuffers = [gl.COLOR_ATTACHMENT0];
        if (outputArray.length > 1) {
            additionalTextures = [];
            for (var i = 1, numOutputs = outputArray.length; i < numOutputs; i++) {
                additionalTextures.push(outputArray[i]._currentTexture);
                drawBuffers.push(gl.COLOR_ATTACHMENT0 + i);
            }
        }
        (0, framebuffers_1.bindFrameBuffer)(this, layer0, layer0._currentTexture, additionalTextures);
        // Tell WebGL to draw to output textures.
        if (isWebGL2) {
            gl.drawBuffers(drawBuffers);
        }
        // Resize viewport.
        var _c = this._widthHeightForOutput(programName, output), width = _c.width, height = _c.height;
        gl.viewport(0, 0, width, height);
    };
    ;
    /**
     * Set vertex shader attribute.
     * @private
     */
    GPUComposer.prototype._setVertexAttribute = function (program, name, size, programName) {
        var _a = this, gl = _a.gl, _vertexAttributeLocations = _a._vertexAttributeLocations, _enabledVertexAttributes = _a._enabledVertexAttributes;
        // Enable vertex attribute array.
        var locations = _vertexAttributeLocations[name];
        var location;
        if (!locations) {
            locations = new WeakMap();
            _vertexAttributeLocations[name] = locations;
        }
        else {
            // 	location = locations.get(program);
        }
        if (location === undefined) {
            location = gl.getAttribLocation(program, name);
            if (location < 0) {
                throw new Error("Unable to find vertex attribute \"".concat(name, "\" in program \"").concat(programName, "\"."));
            }
            // Cache attribute location.
            locations.set(program, location);
        }
        // INT types not supported for attributes in WebGL1.
        // We're only really using INT vertex attributes for WebGL1 cases anyway,
        // because WebGL1 does not support gl_VertexID.
        // Use FLOAT rather than SHORT bc FLOAT covers more INT range.
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
        gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
        // Enable the attribute.
        gl.enableVertexAttribArray(location);
        _enabledVertexAttributes[location] = true;
    };
    GPUComposer.prototype._disableVertexAttributes = function () {
        var _a = this, _enabledVertexAttributes = _a._enabledVertexAttributes, gl = _a.gl;
        var locations = Object.keys(_enabledVertexAttributes);
        for (var i = 0, numAttributes = locations.length; i < numAttributes; i++) {
            var location_1 = locations[i];
            if (_enabledVertexAttributes[location_1]) {
                gl.disableVertexAttribArray(location_1);
                delete _enabledVertexAttributes[location_1];
            }
        }
    };
    /**
     * Set vertex shader position attribute.
     * @private
     */
    GPUComposer.prototype._setPositionAttribute = function (program, programName) {
        this._setVertexAttribute(program, 'a_gpuio_position', 2, programName);
    };
    /**
     * Set vertex shader index attribute.
     * @private
     */
    GPUComposer.prototype._setIndexAttribute = function (program, programName) {
        this._setVertexAttribute(program, 'a_gpuio_index', 1, programName);
    };
    /**
     * Set vertex shader uv attribute.
     * @private
     */
    GPUComposer.prototype._setUVAttribute = function (program, programName) {
        this._setVertexAttribute(program, 'a_gpuio_uv', 2, programName);
    };
    GPUComposer.prototype._widthHeightForOutput = function (programName, output) {
        if ((0, type_checks_1.isArray)(output)) {
            // Check that all outputs have the same size.
            var firstOutput = output[0];
            var width_1 = firstOutput ? firstOutput.width : this._width;
            var height_1 = firstOutput ? firstOutput.height : this._height;
            for (var i = 1, numOutputs = output.length; i < numOutputs; i++) {
                var nextOutput = output[i];
                if (nextOutput.width !== width_1 || nextOutput.height !== height_1) {
                    throw new Error("Output GPULayers must have the same dimensions, got dimensions [".concat(width_1, ", ").concat(height_1, "] and [").concat(nextOutput.width, ", ").concat(nextOutput.height, "] for program \"").concat(programName, "\"."));
                }
            }
            return { width: width_1, height: height_1 };
        }
        var width = output ? output.width : this._width;
        var height = output ? output.height : this._height;
        return { width: width, height: height };
    };
    /**
     * Call stepping/drawing function once for each output.
     * This is required when attempting to draw to multiple outputs using GLSL1.
     */
    GPUComposer.prototype._iterateOverOutputsIfNeeded = function (params, methodName) {
        if (params.output && (0, type_checks_1.isArray)(params.output) && this.glslVersion === constants_1.GLSL1) {
            for (var i = 0, numOutputs = params.output.length; i < numOutputs; i++) {
                this[methodName](__assign(__assign({}, params), { program: i === 0 ? params.program : params.program._childPrograms[i - 1], output: params.output[i] }));
            }
            return true;
        }
        return false;
    };
    GPUComposer.prototype._drawFinish = function (params) {
        var gl = this.gl;
        // Reset WebGL state.
        if (params.blendAlpha)
            gl.disable(gl.BLEND);
        // this._disableVertexAttributes();
    };
    /**
     * Step GPUProgram entire fullscreen quad.
     * @param params - Step parameters.
     * @param params.program - GPUProgram to run.
     * @param params.input - Input GPULayers to GPUProgram.
     * @param params.output - Output GPULayer, will draw to screen if undefined.
     * @param params.blendAlpha - Blend mode for draw, defaults to false.
     * @returns
     */
    GPUComposer.prototype.step = function (params) {
        if (this._iterateOverOutputsIfNeeded(params, 'step'))
            return;
        var _a = this, gl = _a.gl, _errorState = _a._errorState;
        var program = params.program, input = params.input, output = params.output;
        if (_errorState)
            return;
        // Do setup - this must come first.
        var glProgram = this._drawSetup(program, constants_1.DEFAULT_PROGRAM_NAME, {}, true, input, output);
        // Update uniforms and buffers.
        program._setVertexUniform(glProgram, 'u_gpuio_scale', [1, 1], constants_1.FLOAT);
        program._setVertexUniform(glProgram, 'u_gpuio_translation', [0, 0], constants_1.FLOAT);
        gl.bindBuffer(gl.ARRAY_BUFFER, this._getQuadPositionsBuffer());
        this._setPositionAttribute(glProgram, program.name);
        // Draw.
        this._setBlendMode(params.blendAlpha);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        this._drawFinish(params);
    };
    /**
     * Step GPUProgram only for a 1px strip of pixels along the boundary.
     * @param params - Step parameters.
     * @param params.program - GPUProgram to run.
     * @param params.input - Input GPULayers to GPUProgram.
     * @param params.output - Output GPULayer, will draw to screen if undefined.
     * @param params.edges - Specify which edges to step, defaults to stepping entire boundary.
     * @param params.blendAlpha - Blend mode for draw, defaults to false.
     * @returns
     */
    GPUComposer.prototype.stepBoundary = function (params) {
        if (this._iterateOverOutputsIfNeeded(params, 'stepBoundary'))
            return;
        var _a = this, gl = _a.gl, _errorState = _a._errorState;
        var program = params.program, input = params.input, output = params.output;
        if (_errorState)
            return;
        var _b = this._widthHeightForOutput(program.name, output), width = _b.width, height = _b.height;
        // Do setup - this must come first.
        var glProgram = this._drawSetup(program, constants_1.DEFAULT_PROGRAM_NAME, {}, false, input, output);
        // Update uniforms and buffers.
        // Frame needs to be offset and scaled so that all four sides are in viewport.
        var onePx = [1 / width, 1 / height];
        program._setVertexUniform(glProgram, 'u_gpuio_scale', [1 - onePx[0], 1 - onePx[1]], constants_1.FLOAT);
        program._setVertexUniform(glProgram, 'u_gpuio_translation', onePx, constants_1.FLOAT);
        gl.bindBuffer(gl.ARRAY_BUFFER, this._getBoundaryPositionsBuffer());
        this._setPositionAttribute(glProgram, program.name);
        // Draw.
        this._setBlendMode(params.blendAlpha);
        if (params.edges) {
            var edges = params.edges;
            if (!(0, type_checks_1.isArray)(edges))
                edges = [edges];
            for (var i = 0, numEdges = edges.length; i < numEdges; i++) {
                // TODO: do this in one draw call.
                var edge = edges[i];
                if (edge === constants_1.BOUNDARY_LEFT) {
                    gl.drawArrays(gl.LINES, 3, 2);
                }
                if (edge === constants_1.BOUNDARY_RIGHT) {
                    gl.drawArrays(gl.LINES, 1, 2);
                }
                if (edge === constants_1.BOUNDARY_TOP) {
                    gl.drawArrays(gl.LINES, 2, 2);
                }
                if (edge === constants_1.BOUNDARY_BOTTOM) {
                    gl.drawArrays(gl.LINES, 0, 2);
                }
            }
        }
        else {
            gl.drawArrays(gl.LINE_LOOP, 0, 4);
        }
        this._drawFinish(params);
    };
    /**
     * Step GPUProgram for all but a 1px strip of pixels along the boundary.
     * @param params - Step parameters.
     * @param params.program - GPUProgram to run.
     * @param params.input - Input GPULayers to GPUProgram.
     * @param params.output - Output GPULayer, will draw to screen if undefined.
     * @param params.blendAlpha - Blend mode for draw, defaults to false.
     * @returns
     */
    GPUComposer.prototype.stepNonBoundary = function (params) {
        if (this._iterateOverOutputsIfNeeded(params, 'stepNonBoundary'))
            return;
        var _a = this, gl = _a.gl, _errorState = _a._errorState;
        var program = params.program, input = params.input, output = params.output;
        if (_errorState)
            return;
        var _b = this._widthHeightForOutput(program.name, output), width = _b.width, height = _b.height;
        // Do setup - this must come first.
        var glProgram = this._drawSetup(program, constants_1.DEFAULT_PROGRAM_NAME, {}, false, input, output);
        // Update uniforms and buffers.
        var onePx = [1 / width, 1 / height];
        program._setVertexUniform(glProgram, 'u_gpuio_scale', [1 - 2 * onePx[0], 1 - 2 * onePx[1]], constants_1.FLOAT);
        program._setVertexUniform(glProgram, 'u_gpuio_translation', onePx, constants_1.FLOAT);
        gl.bindBuffer(gl.ARRAY_BUFFER, this._getQuadPositionsBuffer());
        this._setPositionAttribute(glProgram, program.name);
        // Draw.
        this._setBlendMode(params.blendAlpha);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        this._drawFinish(params);
    };
    /**
     * Step GPUProgram inside a circular spot.  This is useful for touch interactions.
     * @param params - Step parameters.
     * @param params.program - GPUProgram to run.
     * @param params.position - Position of center of circle.
     * @param params.diameter - Circle diameter in pixels.
     * @param params.useOutputScale - If true position and diameter are scaled relative to the output dimensions, else they are scaled relative to the current canvas size, defaults to false.
     * @param params.input - Input GPULayers to GPUProgram.
     * @param params.output - Output GPULayer, will draw to screen if undefined.
     * @param params.numSegments - Number of segments in circle, defaults to 18.
     * @param params.blendAlpha - Blend mode for draw, defaults to false.
     * @returns
     */
    GPUComposer.prototype.stepCircle = function (params) {
        var _a;
        if (this._iterateOverOutputsIfNeeded(params, 'stepCircle'))
            return;
        var _b = this, gl = _b.gl, _errorState = _b._errorState;
        var program = params.program, position = params.position, diameter = params.diameter, input = params.input, output = params.output;
        if (_errorState)
            return;
        var width = this._width;
        var height = this._height;
        if (params.useOutputScale) {
            (_a = this._widthHeightForOutput(program.name, output), width = _a.width, height = _a.height);
        }
        // Do setup - this must come first.
        var glProgram = this._drawSetup(program, constants_1.DEFAULT_PROGRAM_NAME, {}, false, input, output);
        // Update uniforms and buffers.
        program._setVertexUniform(glProgram, 'u_gpuio_scale', [diameter / width, diameter / height], constants_1.FLOAT);
        program._setVertexUniform(glProgram, 'u_gpuio_translation', [2 * position[0] / width - 1, 2 * position[1] / height - 1], constants_1.FLOAT);
        var numSegments = params.numSegments ? params.numSegments : constants_1.DEFAULT_CIRCLE_NUM_SEGMENTS;
        if (numSegments < 3) {
            throw new Error("numSegments for GPUComposer.stepCircle must be greater than 2, got ".concat(numSegments, "."));
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, this._getCirclePositionsBuffer(numSegments));
        this._setPositionAttribute(glProgram, program.name);
        // Draw.
        this._setBlendMode(params.blendAlpha);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, numSegments + 2);
        this._drawFinish(params);
    };
    /**
     * Step GPUProgram inside a line segment (rounded end caps available).
     * This is useful for touch interactions during pointermove.
     * @param params - Step parameters.
     * @param params.program - GPUProgram to run.
     * @param params.position1 - Position of one end of segment.
     * @param params.position2 - Position of the other end of segment.
     * @param params.thickness - Thickness in pixels.
     * @param params.useOutputScale - If true position and thickness are scaled relative to the output dimensions, else they are scaled relative to the current canvas size, defaults to false.
     * @param params.input - Input GPULayers to GPUProgram.
     * @param params.output - Output GPULayer, will draw to screen if undefined.
     * @param params.endCaps - Flag to draw with rounded end caps, defaults to false.
     * @param params.numCapSegments - Number of segments in rounded end caps, defaults to 9, must be divisible by 3.
     * @param params.blendAlpha - Blend mode for draw, defaults to false.
     * @returns
     */
    GPUComposer.prototype.stepSegment = function (params) {
        var _a;
        if (this._iterateOverOutputsIfNeeded(params, 'stepSegment'))
            return;
        var _b = this, gl = _b.gl, _errorState = _b._errorState;
        var program = params.program, position1 = params.position1, position2 = params.position2, thickness = params.thickness, input = params.input, output = params.output;
        if (_errorState)
            return;
        var width = this._width;
        var height = this._height;
        if (params.useOutputScale) {
            (_a = this._widthHeightForOutput(program.name, output), width = _a.width, height = _a.height);
        }
        // Do setup - this must come first.
        var glProgram = this._drawSetup(program, constants_1.SEGMENT_PROGRAM_NAME, {}, false, input, output);
        // Update uniforms and buffers.
        program._setVertexUniform(glProgram, 'u_gpuio_halfThickness', thickness / 2, constants_1.FLOAT);
        program._setVertexUniform(glProgram, 'u_gpuio_scale', [2 / width, 2 / height], constants_1.FLOAT);
        var diffX = position1[0] - position2[0];
        var diffY = position1[1] - position2[1];
        var angle = Math.atan2(diffY, diffX);
        program._setVertexUniform(glProgram, 'u_gpuio_rotation', angle, constants_1.FLOAT);
        var centerX = (position1[0] + position2[0]) / 2;
        var centerY = (position1[1] + position2[1]) / 2;
        program._setVertexUniform(glProgram, 'u_gpuio_translation', [2 * centerX / width - 1, 2 * centerY / height - 1], constants_1.FLOAT);
        var length = Math.sqrt(diffX * diffX + diffY * diffY);
        var numSegments = params.numCapSegments ? params.numCapSegments * 2 : constants_1.DEFAULT_CIRCLE_NUM_SEGMENTS;
        if (params.endCaps) {
            if (numSegments < 6 || numSegments % 6 !== 0) {
                throw new Error("numCapSegments for GPUComposer.stepSegment must be divisible by 3, got ".concat(numSegments / 2, "."));
            }
            program._setVertexUniform(glProgram, 'u_gpuio_length', length, constants_1.FLOAT);
            gl.bindBuffer(gl.ARRAY_BUFFER, this._getCirclePositionsBuffer(numSegments));
        }
        else {
            // u_gpuio_length + thickness = length, bc we are stretching a square of size thickness into a rectangle.
            program._setVertexUniform(glProgram, 'u_gpuio_length', length - thickness, constants_1.FLOAT);
            // Use a rectangle in case of no caps.
            gl.bindBuffer(gl.ARRAY_BUFFER, this._getQuadPositionsBuffer());
        }
        this._setPositionAttribute(glProgram, program.name);
        // Draw.
        this._setBlendMode(params.blendAlpha);
        if (params.endCaps) {
            gl.drawArrays(gl.TRIANGLE_FAN, 0, numSegments + 2);
        }
        else {
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }
        this._drawFinish(params);
    };
    /**
     * Step GPUProgram inside a rectangle.
     * @param params - Step parameters.
     * @param params.program - GPUProgram to run.
     * @param params.position - Position of one top corner of rectangle.
     * @param params.size - Width and height of rectangle.
     * @param params.useOutputScale - If true position and size are scaled relative to the output dimensions, else they are scaled relative to the current canvas size, defaults to false.
     * @param params.input - Input GPULayers to GPUProgram.
     * @param params.output - Output GPULayer, will draw to screen if undefined.
     * @param params.blendAlpha - Blend mode for draw, defaults to false.
     * @returns
     */
    GPUComposer.prototype.stepRect = function (params) {
        if (this._iterateOverOutputsIfNeeded(params, 'stepRect'))
            return;
        var position1 = [params.position[0], params.position[1] + params.size[1] / 2];
        var position2 = [params.position[0] + params.size[0], position1[1]];
        this.stepSegment({
            program: params.program,
            position1: position1,
            position2: position2,
            thickness: params.size[1],
            useOutputScale: params.useOutputScale,
            input: params.input,
            output: params.output,
            endCaps: false,
            blendAlpha: params.blendAlpha,
        });
    };
    // stepPolyline(
    // 	params: {
    // 		program: GPUProgram,
    // 		positions: number[][],
    // 		thickness: number, // Thickness of line is in units of pixels.
    // 		input?: (GPULayer | GPULayerState)[] | GPULayer | GPULayerState,
    // 		output?: GPULayer | GPULayer[], // Undefined renders to screen.
    // 		closeLoop?: boolean,
    // 		includeUVs?: boolean,
    // 		includeNormals?: boolean,
    // 		blendAlpha?: boolean,
    // 	},
    // ) {
    // 	if (this._iterateOverOutputsIfNeeded(params, 'stepPolyline')) return;
    // 	const { gl, _width, _height, _errorState } = this;
    // 	const { program, input, output } = params;
    // 	if (_errorState) return;
    // 	const vertices = params.positions;
    // 	const closeLoop = !!params.closeLoop;
    // 	// Offset vertices.
    // 	const halfThickness = params.thickness / 2;
    // 	const numPositions = closeLoop ? vertices.length * 4 + 2 : (vertices.length - 1) * 4;
    // 	const positions = new Float32Array(2 * numPositions);
    // 	const uvs = params.includeUVs ? new Float32Array(2 * numPositions) : undefined;
    // 	const normals = params.includeNormals ? new Float32Array(2 * numPositions) : undefined;
    // 	// tmp arrays.
    // 	const s1 = [0, 0];
    // 	const s2 = [0, 0];
    // 	const n1 = [0, 0];
    // 	const n2 = [0, 0];
    // 	const n3 = [0, 0];
    // 	for (let i = 0; i < vertices.length; i++) {
    // 		if (!closeLoop && i === vertices.length - 1) continue;
    // 		// Vertices on this segment.
    // 		const v1 = vertices[i];
    // 		const v2 = vertices[(i + 1) % vertices.length];
    // 		s1[0] = v2[0] - v1[0];
    // 		s1[1] = v2[1] - v1[1];
    // 		const length1 = Math.sqrt(s1[0] * s1[0] + s1[1] * s1[1]);
    // 		n1[0] = s1[1] / length1;
    // 		n1[1] = - s1[0] / length1;
    // 		const index = i * 4 + 2;
    // 		if (!closeLoop && i === 0) {
    // 			// Add starting points to positions array.
    // 			positions[0] = v1[0] + n1[0] * halfThickness;
    // 			positions[1] = v1[1] + n1[1] * halfThickness;
    // 			positions[2] = v1[0] - n1[0] * halfThickness;
    // 			positions[3] = v1[1] - n1[1] * halfThickness;
    // 			if (uvs) {
    // 				uvs[0] = 0;
    // 				uvs[1] = 1;
    // 				uvs[2] = 0;
    // 				uvs[3] = 0;
    // 			}
    // 			if (normals) {
    // 				normals[0] = n1[0];
    // 				normals[1] = n1[1];
    // 				normals[2] = n1[0];
    // 				normals[3] = n1[1];
    // 			}
    // 		}
    // 		const u = (i + 1) / (vertices.length - 1);
    // 		// Offset from v2.
    // 		positions[2 * index] = v2[0] + n1[0] * halfThickness;
    // 		positions[2 * index + 1] = v2[1] + n1[1] * halfThickness;
    // 		positions[2 * index + 2] = v2[0] - n1[0] * halfThickness;
    // 		positions[2 * index + 3] = v2[1] - n1[1] * halfThickness;
    // 		if (uvs) {
    // 			uvs[2 * index] = u;
    // 			uvs[2 * index + 1] = 1;
    // 			uvs[2 * index + 2] = u;
    // 			uvs[2 * index + 3] = 0;
    // 		}
    // 		if (normals) {
    // 			normals[2 * index] = n1[0];
    // 			normals[2 * index + 1] = n1[1];
    // 			normals[2 * index + 2] = n1[0];
    // 			normals[2 * index + 3] = n1[1];
    // 		}
    // 		if ((i < vertices.length - 2) || closeLoop) {
    // 			// Vertices on next segment.
    // 			const v3 = vertices[(i + 1) % vertices.length];
    // 			const v4 = vertices[(i + 2) % vertices.length];
    // 			s2[0] = v4[0] - v3[0];
    // 			s2[1] = v4[1] - v3[1];
    // 			const length2 = Math.sqrt(s2[0] * s2[0] + s2[1] * s2[1]);
    // 			n2[0] = s2[1] / length2;
    // 			n2[1] = - s2[0] / length2;
    // 			// Offset from v3
    // 			positions[2 * ((index + 2) % (4 * vertices.length))] = v3[0] + n2[0] * halfThickness;
    // 			positions[2 * ((index + 2) % (4 * vertices.length)) + 1] = v3[1] + n2[1] * halfThickness;
    // 			positions[2 * ((index + 2) % (4 * vertices.length)) + 2] = v3[0] - n2[0] * halfThickness;
    // 			positions[2 * ((index + 2) % (4 * vertices.length)) + 3] = v3[1] - n2[1] * halfThickness;
    // 			if (uvs) {
    // 				uvs[2 * ((index + 2) % (4 * vertices.length))] = u;
    // 				uvs[2 * ((index + 2) % (4 * vertices.length)) + 1] = 1;
    // 				uvs[2 * ((index + 2) % (4 * vertices.length)) + 2] = u;
    // 				uvs[2 * ((index + 2) % (4 * vertices.length)) + 3] = 0;
    // 			}
    // 			if (normals) {
    // 				normals[2 * ((index + 2) % (4 * vertices.length))] = n2[0];
    // 				normals[2 * ((index + 2) % (4 * vertices.length)) + 1] = n2[1];
    // 				normals[2 * ((index + 2) % (4 * vertices.length)) + 2] = n2[0];
    // 				normals[2 * ((index + 2) % (4 * vertices.length)) + 3] = n2[1];
    // 			}
    // 			// Check the angle between adjacent segments.
    // 			const cross = n1[0] * n2[1] - n1[1] * n2[0];
    // 			if (Math.abs(cross) < 1e-6) continue;
    // 			n3[0] = n1[0] + n2[0];
    // 			n3[1] = n1[1] + n2[1];
    // 			const length3 = Math.sqrt(n3[0] * n3[0] + n3[1] * n3[1]);
    // 			n3[0] /= length3;
    // 			n3[1] /= length3;
    // 			// Make adjustments to positions.
    // 			const angle = Math.acos(n1[0] * n2[0] + n1[1] * n2[1]);
    // 			const offset = halfThickness / Math.cos(angle / 2);
    // 			if (cross < 0) {
    // 				positions[2 * index] = v2[0] + n3[0] * offset;
    // 				positions[2 * index + 1] = v2[1] + n3[1] * offset;
    // 				positions[2 * ((index + 2) % (4 * vertices.length))] = positions[2 * index];
    // 				positions[2 * ((index + 2) % (4 * vertices.length)) + 1] = positions[2 * index + 1];
    // 			} else {
    // 				positions[2 * index + 2] = v2[0] - n3[0] * offset;
    // 				positions[2 * index + 3] = v2[1] - n3[1] * offset;
    // 				positions[2 * ((index + 2) % (4 * vertices.length)) + 2] = positions[2 * index + 2];
    // 				positions[2 * ((index + 2) % (4 * vertices.length)) + 3] = positions[2 * index + 3];
    // 			}
    // 		}
    // 	}
    // 	if (closeLoop) {
    // 		// Duplicate starting points to end of positions array.
    // 		positions[vertices.length * 8] = positions[0];
    // 		positions[vertices.length * 8 + 1] = positions[1];
    // 		positions[vertices.length * 8 + 2] = positions[2];
    // 		positions[vertices.length * 8 + 3] = positions[3];
    // 		if (uvs) {
    // 			uvs[vertices.length * 8] = uvs[0];
    // 			uvs[vertices.length * 8 + 1] = uvs[1];
    // 			uvs[vertices.length * 8 + 2] = uvs[2];
    // 			uvs[vertices.length * 8 + 3] = uvs[3];
    // 		}
    // 		if (normals) {
    // 			normals[vertices.length * 8] = normals[0];
    // 			normals[vertices.length * 8 + 1] = normals[1];
    // 			normals[vertices.length * 8 + 2] = normals[2];
    // 			normals[vertices.length * 8 + 3] = normals[3];
    // 		}
    // 	}
    // 	const vertexShaderOptions: CompileTimeConstants = {};
    // 	if (uvs) vertexShaderOptions[GPUIO_VS_UV_ATTRIBUTE] = '1';
    // 	if (normals) vertexShaderOptions[GPUIO_VS_NORMAL_ATTRIBUTE] = '1';
    // 	// Do setup - this must come first.
    // 	const glProgram = this._drawSetup(program, DEFAULT_PROGRAM_NAME, vertexShaderOptions, false, input, output);
    // 	// Update uniforms and buffers.
    // 	program._setVertexUniform(glProgram, 'u_gpuio_scale', [2 / _width, 2 / _height], FLOAT);
    // 	program._setVertexUniform(glProgram, 'u_gpuio_translation', [-1, -1], FLOAT);
    // 	// Init positions buffer.
    // 	gl.bindBuffer(gl.ARRAY_BUFFER, this._initVertexBuffer(positions)!);
    // 	this._setPositionAttribute(glProgram, program.name);
    // 	if (uvs) {
    // 		// Init uv buffer.
    // 		gl.bindBuffer(gl.ARRAY_BUFFER, this._initVertexBuffer(uvs)!);
    // 		this._setUVAttribute(glProgram, program.name);
    // 	}
    // 	if (normals) {
    // 		// Init normals buffer.
    // 		gl.bindBuffer(gl.ARRAY_BUFFER, this._initVertexBuffer(normals)!);
    // 		this._setVertexAttribute(glProgram, 'a_gpuio_normal', 2, program.name);
    // 	}
    // 	// Draw.
    // 	this._setBlendMode(params.blendAlpha);
    // 	gl.drawArrays(gl.TRIANGLE_STRIP, 0, numPositions);
    // 	this._drawFinish();
    // }
    // stepTriangleStrip(
    // 	params: {
    // 		program: GPUProgram,
    // 		positions: Float32Array,
    // 		normals?: Float32Array,
    // 		uvs?: Float32Array,
    // 		input?: (GPULayer | GPULayerState)[] | GPULayer | GPULayerState,
    // 		output?: GPULayer | GPULayer[], // Undefined renders to screen.
    // 		count?: number,
    // 		blendAlpha?: boolean,
    // 	},
    // ) {
    // 	if (this._iterateOverOutputsIfNeeded(params, 'stepTriangleStrip')) return;
    // 	const { gl, _width, _height, _errorState } = this;
    // 	const { program, input, output, positions, uvs, normals } = params;
    // 	if (_errorState) return;
    // 	const vertexShaderOptions: CompileTimeConstants = {};
    // 	if (uvs) vertexShaderOptions[GPUIO_VS_UV_ATTRIBUTE] = '1';
    // 	if (normals) vertexShaderOptions[GPUIO_VS_NORMAL_ATTRIBUTE] = '1';
    // 	// Do setup - this must come first.
    // 	const glProgram = this._drawSetup(program, DEFAULT_PROGRAM_NAME, vertexShaderOptions, false, input, output);
    // 	// Update uniforms and buffers.
    // 	program._setVertexUniform(glProgram, 'u_gpuio_scale', [2 / _width, 2 / _height], FLOAT);
    // 	program._setVertexUniform(glProgram, 'u_gpuio_translation', [-1, -1], FLOAT);
    // 	// Init positions buffer.
    // 	gl.bindBuffer(gl.ARRAY_BUFFER, this._initVertexBuffer(positions)!);
    // 	this._setPositionAttribute(glProgram, program.name);
    // 	if (uvs) {
    // 		// Init uv buffer.
    // 		gl.bindBuffer(gl.ARRAY_BUFFER, this._initVertexBuffer(uvs)!);
    // 		this._setUVAttribute(glProgram, program.name);
    // 	}
    // 	if (normals) {
    // 		// Init normals buffer.
    // 		gl.bindBuffer(gl.ARRAY_BUFFER, this._initVertexBuffer(normals)!);
    // 		this._setVertexAttribute(glProgram, 'a_gpuio_normal', 2, program.name);
    // 	}
    // 	const count = params.count ? params.count : positions.length / 2;
    // 	// Draw.
    // 	this._setBlendMode(params.blendAlpha);
    // 	gl.drawArrays(gl.TRIANGLE_STRIP, 0, count);
    // 	this._drawFinish();
    // }
    // stepLines(params: {
    // 	program: GPUProgram,
    // 	positions: Float32Array,
    // 	indices?: Uint16Array | Uint32Array | Int16Array | Int32Array,
    // 	normals?: Float32Array,
    // 	uvs?: Float32Array,
    // 	input?: (GPULayer | GPULayerState)[] | GPULayer | GPULayerState,
    // 	output?: GPULayer | GPULayer[], // Undefined renders to screen.
    // 	count?: number,
    // 	closeLoop?: boolean,
    // 	blendAlpha?: boolean,
    // }) {
    // 	const { gl, _width, _height, _errorState } = this;
    // 	const { indices, uvs, normals, input, output, program } = params;
    // 	if (_errorState) return;
    // 	// Check that params are valid.
    // 	if (params.closeLoop && indices) {
    // 		throw new Error(`GPUComposer.stepLines() can't be called with closeLoop == true and indices.`);
    // 	}
    // 	const vertexShaderOptions: CompileTimeConstants = {};
    // 	if (uvs) vertexShaderOptions[GPUIO_VS_UV_ATTRIBUTE] = '1';
    // 	if (normals) vertexShaderOptions[GPUIO_VS_NORMAL_ATTRIBUTE] = '1';
    // 	// Do setup - this must come first.
    // 	const glProgram = this._drawSetup(program, DEFAULT_PROGRAM_NAME, vertexShaderOptions, false, input, output);
    // 	const count = params.count ? params.count : (indices ? indices.length : (params.positions.length / 2));
    // 	// Update uniforms and buffers.
    // 	program._setVertexUniform(glProgram, 'u_gpuio_scale', [2 / _width, 2 / _height], FLOAT);
    // 	program._setVertexUniform(glProgram, 'u_gpuio_translation', [-1, -1], FLOAT);
    // 	if (indices) {
    // 		// Reorder positions array to match indices.
    // 		const positions = new Float32Array(2 * count);
    // 		for (let i = 0; i < count; i++) {
    // 			const index = indices[i];
    // 			positions[2 * i] = params.positions[2 * index];
    // 			positions[2 * i + 1] = params.positions[2 * index + 1];
    // 		}
    // 		gl.bindBuffer(gl.ARRAY_BUFFER, this._initVertexBuffer(positions)!);
    // 	} else {
    // 		gl.bindBuffer(gl.ARRAY_BUFFER, this._initVertexBuffer(params.positions)!);
    // 	}
    // 	this._setPositionAttribute(glProgram, program.name);
    // 	if (uvs) {
    // 		// Init uv buffer.
    // 		gl.bindBuffer(gl.ARRAY_BUFFER, this._initVertexBuffer(uvs)!);
    // 		this._setUVAttribute(glProgram, program.name);
    // 	}
    // 	if (normals) {
    // 		// Init normals buffer.
    // 		gl.bindBuffer(gl.ARRAY_BUFFER, this._initVertexBuffer(normals)!);
    // 		this._setVertexAttribute(glProgram, 'a_gpuio_normal', 2, program.name);
    // 	}
    // 	// Draw.
    // 	this._setBlendMode(params.blendAlpha);
    // 	if (params.indices) {
    // 		gl.drawArrays(gl.LINES, 0, count);
    // 	} else {
    // 		if (params.closeLoop) {
    // 			gl.drawArrays(gl.LINE_LOOP, 0, count);
    // 		} else {
    // 			gl.drawArrays(gl.LINE_STRIP, 0, count);
    // 		}
    // 	}
    // 	this._drawFinish(params);
    // }
    /**
     * Draw the contents of a GPULayer as points.  This assumes the components of the GPULayer have the form [xPosition, yPosition] or [xPosition, yPosition, xOffset, yOffset].
     * @param params - Draw parameters.
     * @param params.layer - GPULayer containing position data.
     * @param params.program - GPUProgram to run, defaults to drawing points in red.
     * @param params.input - Input GPULayers for GPUProgram.
     * @param params.output - Output GPULayer, will draw to screen if undefined.
     * @param params.pointSize - Pixel size of points.
     * @param params.count - How many points to draw, defaults to positions.length.
     * @param params.color - (If no program passed in) RGB color in range [0, 1] to draw points.
     * @param params.wrapX - Wrap points positions in X, defaults to false.
     * @param params.wrapY - Wrap points positions in Y, defaults to false.
     * @param params.blendAlpha - Blend mode for draw, defaults to false.
     * @returns
     */
    GPUComposer.prototype.drawLayerAsPoints = function (params) {
        if (this._iterateOverOutputsIfNeeded(params, 'drawLayerAsPoints'))
            return;
        var _a = this, gl = _a.gl, _pointIndexArray = _a._pointIndexArray, _width = _a._width, _height = _a._height, glslVersion = _a.glslVersion, _errorState = _a._errorState;
        var layer = params.layer, output = params.output;
        if (_errorState)
            return;
        // Check that numPoints is valid.
        if (layer.numComponents !== 2 && layer.numComponents !== 4) {
            throw new Error("GPUComposer.drawLayerAsPoints() must be passed a position GPULayer with either 2 or 4 components, got position GPULayer \"".concat(layer.name, "\" with ").concat(layer.numComponents, " components."));
        }
        if (glslVersion === constants_1.GLSL1 && layer.width * layer.height > constants_1.MAX_FLOAT_INT) {
            console.warn("Points positions array length: ".concat(layer.width * layer.height, " is longer than what is supported by GLSL1 : ").concat(constants_1.MAX_FLOAT_INT, ", expect index overflow."));
        }
        var length = layer.length;
        var count = params.count || length;
        if (count > length) {
            throw new Error("Invalid count ".concat(count, " for position GPULayer of length ").concat(length, "."));
        }
        var program = params.program;
        if (program === undefined) {
            program = this._setValueProgramForType(constants_1.FLOAT);
            var color = params.color || [1, 0, 0]; // Default of red.
            if (color.length !== 3)
                throw new Error("color parameter must have length 3, got ".concat(JSON.stringify(color), "."));
            program.setUniform('u_value', __spreadArray(__spreadArray([], color, true), [1], false), constants_1.FLOAT);
        }
        // Add positions to end of input if needed.
        var input = this._addLayerToInputs(layer, params.input);
        var vertexShaderOptions = {};
        // Tell whether we are using an absolute position (2 components),
        // or position with accumulation buffer (4 components, better floating pt accuracy).
        if (layer.numComponents === 4)
            vertexShaderOptions[constants_1.GPUIO_VS_POSITION_W_ACCUM] = '1';
        if (params.wrapX)
            vertexShaderOptions[constants_1.GPUIO_VS_WRAP_X] = '1';
        if (params.wrapY)
            vertexShaderOptions[constants_1.GPUIO_VS_WRAP_Y] = '1';
        // Do setup - this must come first.
        var glProgram = this._drawSetup(program, constants_1.LAYER_POINTS_PROGRAM_NAME, vertexShaderOptions, false, input, output);
        // Update uniforms and buffers.
        program._setVertexUniform(glProgram, 'u_gpuio_positions', (0, utils_1.indexOfLayerInArray)(layer, input), constants_1.INT);
        program._setVertexUniform(glProgram, 'u_gpuio_scale', [1 / _width, 1 / _height], constants_1.FLOAT);
        // Set default pointSize.
        var pointSize = params.pointSize || 1;
        program._setVertexUniform(glProgram, 'u_gpuio_pointSize', pointSize, constants_1.FLOAT);
        var positionLayerDimensions = [layer.width, layer.height];
        program._setVertexUniform(glProgram, 'u_gpuio_positionsDimensions', positionLayerDimensions, constants_1.FLOAT);
        // We get this for free in GLSL3 with gl_VertexID.
        if (glslVersion === constants_1.GLSL1) {
            if (this._pointIndexBuffer === undefined || (_pointIndexArray && _pointIndexArray.length < count)) {
                // Have to use float32 array bc int is not supported as a vertex attribute type.
                var indices = (0, utils_1.initSequentialFloatArray)(length);
                this._pointIndexArray = indices;
                this._pointIndexBuffer = this._initVertexBuffer(indices);
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, this._pointIndexBuffer);
            this._setIndexAttribute(glProgram, program.name);
        }
        // Draw.
        this._setBlendMode(params.blendAlpha);
        gl.drawArrays(gl.POINTS, 0, count);
        this._drawFinish(params);
    };
    // drawLayerAsLines(
    // 	params: {
    // 		positions: GPULayer,
    // 		indices?: Float32Array | Uint16Array | Uint32Array | Int16Array | Int32Array,
    // 		program?: GPUProgram,
    // 		input?: (GPULayer | GPULayerState)[] | GPULayer | GPULayerState,
    // 		output?: GPULayer | GPULayer[],
    // 		count?: number,
    // 		color?: number[]
    // 		wrapX?: boolean,
    // 		wrapY?: boolean,
    // 		closeLoop?: boolean,
    // 		blendAlpha?: boolean,
    // 	},
    // ) {
    // 	if (this._iterateOverOutputsIfNeeded(params, 'drawLayerAsLines')) return;
    // 	const { gl, _width, _height, glslVersion, _errorState } = this;
    // 	const { positions, output } = params;
    // 	if (_errorState) return;
    // 	// Check that positions is valid.
    // 	if (positions.numComponents !== 2 && positions.numComponents !== 4) {
    // 		throw new Error(`GPUComposer.drawLayerAsLines() must be passed a position GPULayer with either 2 or 4 components, got position GPULayer "${positions.name}" with ${positions.numComponents} components.`)
    // 	}
    // 	// Check that params are valid.
    // 	if (params.closeLoop && params.indices) {
    // 		throw new Error(`GPUComposer.drawLayerAsLines() can't be called with closeLoop == true and indices.`);
    // 	}
    // 	let program = params.program;
    // 	if (program === undefined) {
    // 		program = params.wrapX || params.wrapY ? this._getWrappedLineColorProgram() : this._setValueProgramForType(FLOAT);;
    // 		const color = params.color || [1, 0, 0]; // Default to red.
    //		if (color.length !== 3) throw new Error(`color parameter must have length 3, got ${JSON.stringify(color)}.`);
    // 		program.setUniform('u_value', [...color, 1], FLOAT);
    // 	}
    // 	// Add positionLayer to end of input if needed.
    // 	const input = this._addLayerToInputs(positions, params.input);
    // 	const vertexShaderOptions: CompileTimeConstants = {};
    // 	// Tell whether we are using an absolute position (2 components),
    // 	// or position with accumulation buffer (4 components, better floating pt accuracy).
    // 	if (positions.numComponents === 4) vertexShaderOptions[GPUIO_VS_POSITION_W_ACCUM] = '1';
    // 	if (params.wrapX) vertexShaderOptions[GPUIO_VS_WRAP_X] = '1';
    // 	if (params.wrapY) vertexShaderOptions[GPUIO_VS_WRAP_Y] = '1';
    // 	vertexShaderOptions[GPUIO_VS_INDEXED_POSITIONS] = params.indices ? '1': '0';
    // 	// Do setup - this must come first.
    // 	const glProgram = this._drawSetup(program, LAYER_LINES_PROGRAM_NAME, vertexShaderOptions, false, input, output);
    // 	const count = params.count ? params.count : (params.indices ? params.indices.length : positions.length);
    // 	// Update uniforms and buffers.
    // 	program._setVertexUniform(glProgram, 'u_gpuio_positions', indexOfLayerInArray(positions, input), INT);
    // 	program._setVertexUniform(glProgram, 'u_gpuio_scale', [1 / _width, 1 / _height], FLOAT);
    // 	const positionLayerDimensions = [positions.width, positions.height];
    // 	program._setVertexUniform(glProgram, 'u_gpuio_positionsDimensions', positionLayerDimensions, FLOAT);
    // 	// Only pass in indices if we are using indexed pts or GLSL1, otherwise we get this for free from gl_VertexID.
    // 	if (params.indices || glslVersion === GLSL1) {
    // 		// TODO: cache indexArray if no indices passed in.
    // 		const indices = params.indices ? params.indices : initSequentialFloatArray(count);
    // 		if (this._indexedLinesIndexBuffer === undefined) {
    // 			// Have to use float32 array bc int is not supported as a vertex attribute type.
    // 			let floatArray: Float32Array;
    // 			if (indices.constructor !== Float32Array) {
    // 				// Have to use float32 array bc int is not supported as a vertex attribute type.
    // 				floatArray = new Float32Array(indices.length);
    // 				for (let i = 0; i < count; i++) {
    // 					floatArray[i] = indices[i];
    // 				}
    // 				console.warn(`Converting indices array of type ${indices.constructor} to Float32Array in GPUComposer.drawIndexedLines for WebGL compatibility, you may want to use a Float32Array to store this information so the conversion is not required.`);
    // 			} else {
    // 				floatArray = indices as Float32Array;
    // 			}
    // 			this._indexedLinesIndexBuffer = this._initVertexBuffer(floatArray);
    // 		} else {
    // 			gl.bindBuffer(gl.ARRAY_BUFFER, this._indexedLinesIndexBuffer!);
    // 			// Copy buffer data.
    // 			gl.bufferData(gl.ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    // 		}
    // 		this._setIndexAttribute(glProgram, program.name);
    // 	}
    // 	// Draw.
    // 	this._setBlendMode(params.blendAlpha);
    // 	if (params.indices) {
    // 		gl.drawArrays(gl.LINES, 0, count);
    // 	} else {
    // 		if (params.closeLoop) {
    // 			gl.drawArrays(gl.LINE_LOOP, 0, count);
    // 		} else {
    // 			gl.drawArrays(gl.LINE_STRIP, 0, count);
    // 		}
    // 	}
    // 	this._drawFinish(params);
    // }
    /**
     * Draw the contents of a 2 component GPULayer as a vector field.
     * @param params - Draw parameters.
     * @param params.layer - GPULayer containing vector data.
     * @param params.program - GPUProgram to run, defaults to drawing vector lines in red.
     * @param params.input - Input GPULayers for GPUProgram.
     * @param params.output - Output GPULayer, will draw to screen if undefined.
     * @param params.vectorSpacing - Spacing between vectors, defaults to drawing a vector every 10 pixels.
     * @param params.vectorScale - Scale factor to apply to vector lengths.
     * @param params.color - (If no program passed in) RGB color in range [0, 1] to draw points.
     * @param params.blendAlpha - Blend mode for draw, defaults to false.
     * @returns
     */
    GPUComposer.prototype.drawLayerAsVectorField = function (params) {
        if (this._iterateOverOutputsIfNeeded(params, 'drawLayerAsVectorField'))
            return;
        var _a = this, gl = _a.gl, _vectorFieldIndexArray = _a._vectorFieldIndexArray, _width = _a._width, _height = _a._height, glslVersion = _a.glslVersion, _errorState = _a._errorState;
        var layer = params.layer, output = params.output;
        if (_errorState)
            return;
        // Check that field is valid.
        if (layer.numComponents !== 2) {
            throw new Error("GPUComposer.drawLayerAsVectorField() must be passed a fieldLayer with 2 components, got fieldLayer \"".concat(layer.name, "\" with ").concat(layer.numComponents, " components."));
        }
        // Check aspect ratio.
        // const dimensions = [vectorLayer.width, vectorLayer.height];
        // if (Math.abs(dimensions[0] / dimensions[1] - width / height) > 0.01) {
        // 	throw new Error(`Invalid aspect ratio ${(dimensions[0] / dimensions[1]).toFixed(3)} vector GPULayer with dimensions [${dimensions[0]}, ${dimensions[1]}], expected ${(width / height).toFixed(3)}.`);
        // }
        var program = params.program;
        if (program === undefined) {
            program = this._setValueProgramForType(constants_1.FLOAT);
            ;
            var color = params.color || [1, 0, 0]; // Default to red.
            if (color.length !== 3)
                throw new Error("color parameter must have length 3, got ".concat(JSON.stringify(color), "."));
            program.setUniform('u_value', __spreadArray(__spreadArray([], color, true), [1], false), constants_1.FLOAT);
        }
        // Add data to end of input if needed.
        var input = this._addLayerToInputs(layer, params.input);
        // Do setup - this must come first.
        var glProgram = this._drawSetup(program, constants_1.LAYER_VECTOR_FIELD_PROGRAM_NAME, {}, false, input, output);
        // Update uniforms and buffers.
        program._setVertexUniform(glProgram, 'u_gpuio_vectors', (0, utils_1.indexOfLayerInArray)(layer, input), constants_1.INT);
        // Set default scale.
        var vectorScale = params.vectorScale || 1;
        program._setVertexUniform(glProgram, 'u_gpuio_scale', [vectorScale / _width, vectorScale / _height], constants_1.FLOAT);
        var vectorSpacing = params.vectorSpacing || 10;
        var spacedDimensions = [Math.floor(_width / vectorSpacing), Math.floor(_height / vectorSpacing)];
        program._setVertexUniform(glProgram, 'u_gpuio_dimensions', spacedDimensions, constants_1.FLOAT);
        var length = 2 * spacedDimensions[0] * spacedDimensions[1];
        // We get this for free in GLSL3 with gl_VertexID.
        if (glslVersion === constants_1.GLSL1) {
            if (this._vectorFieldIndexBuffer === undefined || (_vectorFieldIndexArray && _vectorFieldIndexArray.length < length)) {
                // Have to use float32 array bc int is not supported as a vertex attribute type.
                var indices = (0, utils_1.initSequentialFloatArray)(length);
                this._vectorFieldIndexArray = indices;
                this._vectorFieldIndexBuffer = this._initVertexBuffer(indices);
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, this._vectorFieldIndexBuffer);
            this._setIndexAttribute(glProgram, program.name);
        }
        // Draw.
        this._setBlendMode(params.blendAlpha);
        gl.drawArrays(gl.LINES, 0, length);
        this._drawFinish(params);
    };
    /**
     * If this GPUComposer has been inited via GPUComposer.initWithThreeRenderer(), call resetThreeState() in render loop after performing any step or draw functions.
     */
    GPUComposer.prototype.resetThreeState = function () {
        if (!this._threeRenderer) {
            throw new Error("Can't call resetThreeState() on a GPUComposer that was not inited with GPUComposer.initWithThreeRenderer().");
        }
        var gl = this.gl;
        // Reset viewport.
        var viewport = this._threeRenderer.getViewport(new ThreejsUtils.Vector4());
        gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height);
        // Unbind framebuffer (render to screen).
        // Reset threejs WebGL bindings and state, this also unbinds the framebuffer.
        this._threeRenderer.resetState();
    };
    // TODO: params.callback is not generated in the docs.
    /**
     * Save the current state of the canvas to png.
     * @param params - PNG parameters.
     * @param params.filename - PNG filename (no extension).
     * @param params.dpi - PNG dpi (defaults to 72dpi).
     * @param params.callback - Optional callback when Blob is ready, default behavior saves the PNG using FileSaver.js.
    */
    GPUComposer.prototype.savePNG = function (params) {
        if (params === void 0) { params = {}; }
        var canvas = this.canvas;
        var filename = params.filename || 'output';
        var callback = params.callback || saveAs; // Default to saving the image with FileSaver.
        // TODO: need to adjust the canvas size to get the correct px ratio from toBlob().
        // const ratio = window.devicePixelRatio || 1;
        canvas.toBlob(function (blob) {
            if (!blob) {
                console.warn("Problem saving PNG, unable to init blob from canvas.");
                return;
            }
            if (params.dpi) {
                (0, changedpi_1.changeDpiBlob)(blob, params.dpi).then(function (blob) {
                    callback(blob, "".concat(filename, ".png"));
                });
            }
            else {
                callback(blob, "".concat(filename, ".png"));
            }
        }, 'image/png');
    };
    /**
     * Call tick() from your render loop to measure the FPS of your application.
     * Internally, this does some low pass filtering to give consistent results.
     * @returns An Object containing the current fps of your application and the number of times tick() has been called.
     */
    GPUComposer.prototype.tick = function () {
        this._numTicks += 1;
        var _a = this, _lastTickTime = _a._lastTickTime, _lastTickFPS = _a._lastTickFPS;
        var currentTime = performance.now();
        this._lastTickTime = currentTime;
        if (!_lastTickTime) {
            return { fps: 0, numTicks: this._numTicks };
        }
        var currentFPS = 1000 / (currentTime - _lastTickTime);
        if (!_lastTickFPS)
            _lastTickFPS = currentFPS;
        // Use a low pass filter to smooth out fps reading.
        var factor = 0.9;
        var fps = Number.parseFloat((factor * _lastTickFPS + (1 - factor) * currentFPS).toFixed(1));
        this._lastTickFPS = fps;
        return {
            fps: fps,
            numTicks: this._numTicks,
        };
    };
    /**
     * Deallocate GPUComposer instance and associated WebGL properties.
     */
    GPUComposer.prototype.dispose = function () {
        var _this = this;
        var _a;
        var _b = this, gl = _b.gl, verboseLogging = _b.verboseLogging;
        if (verboseLogging)
            console.log("Deallocating GPUComposer.");
        // Delete buffers.
        if (this._quadPositionsBuffer) {
            gl.deleteBuffer(this._quadPositionsBuffer);
            delete this._quadPositionsBuffer;
        }
        if (this._boundaryPositionsBuffer) {
            gl.deleteBuffer(this._boundaryPositionsBuffer);
            delete this._boundaryPositionsBuffer;
        }
        Object.keys(this._circlePositionsBuffer).forEach(function (key) {
            gl.deleteBuffer(_this._circlePositionsBuffer[key]);
        });
        // @ts-ignore
        delete this._circlePositionsBuffer;
        delete this._pointIndexArray;
        if (this._pointIndexBuffer) {
            gl.deleteBuffer(this._pointIndexBuffer);
            delete this._pointIndexBuffer;
        }
        delete this._vectorFieldIndexArray;
        if (this._vectorFieldIndexBuffer) {
            gl.deleteBuffer(this._vectorFieldIndexBuffer);
            delete this._vectorFieldIndexBuffer;
        }
        if (this._indexedLinesIndexBuffer) {
            gl.deleteBuffer(this._indexedLinesIndexBuffer);
            delete this._indexedLinesIndexBuffer;
        }
        // Delete vertex attribute locations.
        Object.keys(this._vertexAttributeLocations).forEach(function (key) {
            delete _this._vertexAttributeLocations[key];
        });
        // @ts-ignore
        delete this._vertexAttributeLocations;
        // @ts-ignore
        delete this._enabledVertexAttributes;
        // Delete vertex shaders.
        Object.values(this._vertexShaders).forEach(function (_a) {
            var compiledShaders = _a.compiledShaders;
            Object.keys(compiledShaders).forEach(function (key) {
                gl.deleteShader(compiledShaders[key]);
                delete compiledShaders[key];
            });
        });
        // @ts-ignore
        delete this._vertexShaders;
        // Delete fragment shaders.
        Object.values(this._copyPrograms).forEach(function (program) {
            program.dispose();
        });
        Object.keys(this._copyPrograms).forEach(function (key) {
            // @ts-ignore
            delete _this._copyPrograms[key];
        });
        // @ts-ignore;
        delete this._copyPrograms;
        Object.values(this._setValuePrograms).forEach(function (program) {
            program.dispose();
        });
        Object.keys(this._setValuePrograms).forEach(function (key) {
            // @ts-ignore
            delete _this._setValuePrograms[key];
        });
        // @ts-ignore;
        delete this._setValuePrograms;
        (_a = this._wrappedLineColorProgram) === null || _a === void 0 ? void 0 : _a.dispose();
        delete this._wrappedLineColorProgram;
        // @ts-ignore
        delete this._threeRenderer;
        // @ts-ignore
        delete this.gl;
        // @ts-ignore;
        delete this.canvas;
        // GL context will be garbage collected by webgl.
        // @ts-ignore
        delete this._errorCallback;
        // @ts-ignore
        delete this._extensions;
        // Delete all other keys.
        // This is mostly for testing so we can be sure we've deallocated everything.
        // @ts-ignore;
        delete this._errorState;
        // @ts-ignore;
        delete this.verboseLogging;
        // @ts-ignore;
        delete this._numTicks;
        // @ts-ignore;
        delete this.isWebGL2;
        // @ts-ignore;
        delete this.glslVersion;
        // @ts-ignore;
        delete this.intPrecision;
        // @ts-ignore;
        delete this.floatPrecision;
        // @ts-ignore;
        delete this._width;
        // @ts-ignore;
        delete this._height;
    };
    return GPUComposer;
}());
exports.GPUComposer = GPUComposer;


/***/ }),

/***/ 355:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GPULayer = void 0;
var float16_1 = __webpack_require__(650);
var type_checks_1 = __webpack_require__(566);
// @ts-ignore
var changedpi_1 = __webpack_require__(809);
var file_saver_1 = __webpack_require__(162);
var checks_1 = __webpack_require__(707);
var constants_1 = __webpack_require__(601);
var utils_1 = __webpack_require__(593);
var framebuffers_1 = __webpack_require__(798);
var conversions_1 = __webpack_require__(690);
var GPULayer = /** @class */ (function () {
    /**
     * Create a GPULayer.
     * @param composer - The current GPUComposer instance.
     * @param params  - GPULayer parameters.
     * @param params.name - Name of GPULayer, used for error logging.
     * @param params.type - Data type represented by GPULayer.
     * @param params.numComponents - Number of RGBA elements represented by each pixel in the GPULayer (1-4).
     * @param params.dimensions - Dimensions of 1D or 2D GPULayer.
     * @param params.filter - Interpolation filter for GPULayer, defaults to LINEAR for 2D FLOAT/HALF_FLOAT GPULayers, otherwise defaults to NEAREST.
     * @param params.wrapX - Horizontal wrapping style for GPULayer, defaults to CLAMP_TO_EDGE.
     * @param params.wrapY - Vertical wrapping style for GPULayer, defaults to CLAMP_TO_EDGE.
     * @param params.numBuffers - How may buffers to allocate, defaults to 1.  If you intend to use the current state of this GPULayer as an input to generate a new state, you will need at least 2 buffers.
     * @param params.clearValue - Value to write to GPULayer when GPULayer.clear() is called.
     * @param params.array - Array to initialize GPULayer.
     */
    function GPULayer(composer, params) {
        // Value to set when clear() is called, defaults to zero.
        // Access with GPULayer.clearValue.
        this._clearValue = 0;
        // Each GPULayer may contain a number of buffers to store different instances of the state.
        // e.g [currentState, previousState]
        this._bufferIndex = 0;
        this._buffers = [];
        // Check constructor parameters.
        var name = (params || {}).name;
        if (!composer) {
            throw new Error("Error initing GPULayer \"".concat(name, "\": must pass GPUComposer instance to GPULayer(composer, params)."));
        }
        if (!params) {
            throw new Error('Error initing GPULayer: must pass params to GPULayer(composer, params).');
        }
        if (!(0, type_checks_1.isObject)(params)) {
            throw new Error("Error initing GPULayer: must pass valid params object to GPULayer(composer, params), got ".concat(JSON.stringify(params), "."));
        }
        // Check params keys.
        var validKeys = ['name', 'type', 'numComponents', 'dimensions', 'filter', 'wrapX', 'wrapY', 'numBuffers', 'clearValue', 'array'];
        var requiredKeys = ['name', 'type', 'numComponents', 'dimensions'];
        var keys = Object.keys(params);
        (0, checks_1.checkValidKeys)(keys, validKeys, 'GPULayer(composer, params)', params.name);
        (0, checks_1.checkRequiredKeys)(keys, requiredKeys, 'GPULayer(composer, params)', params.name);
        var dimensions = params.dimensions, type = params.type, numComponents = params.numComponents;
        var gl = composer.gl;
        // Save params.
        this._composer = composer;
        this.name = name;
        // numComponents must be between 1 and 4.
        if (!(0, type_checks_1.isPositiveInteger)(numComponents) || numComponents > 4) {
            throw new Error("Invalid numComponents: ".concat(JSON.stringify(numComponents), " for GPULayer \"").concat(name, "\", must be number in range [1-4]."));
        }
        this.numComponents = numComponents;
        // Set dimensions, may be 1D or 2D.
        var _a = GPULayer.calcGPULayerSize(dimensions, name, composer.verboseLogging), length = _a.length, width = _a.width, height = _a.height;
        // We already type checked length, width, and height in calcGPULayerSize.
        this._length = length;
        this._width = width;
        this._height = height;
        // Set filtering - if we are processing a 1D array, default to NEAREST filtering.
        // Else default to LINEAR (interpolation) filtering for float types and NEAREST for integer types.
        var defaultFilter = (length === undefined && (type === constants_1.FLOAT || type == constants_1.HALF_FLOAT)) ? constants_1.LINEAR : constants_1.NEAREST;
        var filter = params.filter !== undefined ? params.filter : defaultFilter;
        if (!(0, checks_1.isValidFilter)(filter)) {
            throw new Error("Invalid filter: ".concat(JSON.stringify(filter), " for GPULayer \"").concat(name, "\", must be one of ").concat(JSON.stringify(constants_1.validFilters), "."));
        }
        // Don't allow LINEAR filtering on integer types, it is not supported.
        if (filter === constants_1.LINEAR && !(type === constants_1.FLOAT || type == constants_1.HALF_FLOAT)) {
            throw new Error("LINEAR filtering is not supported on integer types, please use NEAREST filtering for GPULayer \"".concat(name, "\" with type: ").concat(type, "."));
        }
        this.filter = filter;
        // Get wrap types, default to clamp to edge.
        var wrapX = params.wrapX !== undefined ? params.wrapX : constants_1.CLAMP_TO_EDGE;
        if (!(0, checks_1.isValidWrap)(wrapX)) {
            throw new Error("Invalid wrapX: ".concat(JSON.stringify(wrapX), " for GPULayer \"").concat(name, "\", must be one of ").concat(JSON.stringify(constants_1.validWraps), "."));
        }
        this.wrapX = wrapX;
        var wrapY = params.wrapY !== undefined ? params.wrapY : constants_1.CLAMP_TO_EDGE;
        if (!(0, checks_1.isValidWrap)(wrapY)) {
            throw new Error("Invalid wrapY: ".concat(JSON.stringify(wrapY), " for GPULayer \"").concat(name, "\", must be one of ").concat(JSON.stringify(constants_1.validWraps), "."));
        }
        this.wrapY = wrapY;
        // Set data type.
        if (!(0, checks_1.isValidDataType)(type)) {
            throw new Error("Invalid type: ".concat(JSON.stringify(type), " for GPULayer \"").concat(name, "\", must be one of ").concat(JSON.stringify(constants_1.validDataTypes), "."));
        }
        this.type = type;
        var internalType = GPULayer.getGPULayerInternalType({
            composer: composer,
            type: type,
            name: name,
        });
        this._internalType = internalType;
        // Set gl texture parameters.
        var _b = GPULayer.getGLTextureParameters({
            composer: composer,
            name: name,
            numComponents: numComponents,
            internalType: internalType,
        }), glFormat = _b.glFormat, glInternalFormat = _b.glInternalFormat, glType = _b.glType, glNumChannels = _b.glNumChannels;
        this._glInternalFormat = glInternalFormat;
        this._glFormat = glFormat;
        this._glType = glType;
        this._glNumChannels = glNumChannels;
        // Set internal filtering/wrap types.
        // Make sure that we set filter BEFORE setting wrap.
        var internalFilter = GPULayer.getGPULayerInternalFilter({ composer: composer, filter: filter, wrapX: wrapX, wrapY: wrapY, internalType: internalType, name: name });
        this._internalFilter = internalFilter;
        this._glFilter = gl[internalFilter];
        this._internalWrapX = GPULayer.getGPULayerInternalWrap({ composer: composer, wrap: wrapX, internalFilter: internalFilter, internalType: internalType, name: name });
        this._glWrapS = gl[this._internalWrapX];
        this._internalWrapY = GPULayer.getGPULayerInternalWrap({ composer: composer, wrap: wrapY, internalFilter: internalFilter, internalType: internalType, name: name });
        this._glWrapT = gl[this._internalWrapY];
        // Num buffers is the number of states to store for this data.
        var numBuffers = params.numBuffers !== undefined ? params.numBuffers : 1;
        if (!(0, type_checks_1.isPositiveInteger)(numBuffers)) {
            throw new Error("Invalid numBuffers: ".concat(JSON.stringify(numBuffers), " for GPULayer \"").concat(name, "\", must be positive integer."));
        }
        this.numBuffers = numBuffers;
        // Wait until after type has been set to set clearValue.
        if (params.clearValue !== undefined) {
            this.clearValue = params.clearValue; // Setter can only be called after this.numComponents has been set.
        }
        this._initBuffers(params.array);
    }
    /**
     * Create a GPULayer from an image url.
     * @param composer - The current GPUComposer instance.
     * @param params  - GPULayer parameters.
     * @param params.name - Name of GPULayer, used for error logging.
     * @param params.url - URL of the image source.
     * @param params.type - Data type represented by GPULayer.
     * @param params.format - Image format, either RGB or RGBA.
     * @param params.filter - Interpolation filter for GPULayer, defaults to LINEAR for FLOAT/HALF_FLOAT Images, otherwise defaults to NEAREST.
     * @param params.wrapX - Horizontal wrapping style for GPULayer, defaults to CLAMP_TO_EDGE.
     * @param params.wrapY - Vertical wrapping style for GPULayer, defaults to CLAMP_TO_EDGE.
     */
    GPULayer.initFromImageURL = function (composer, params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        if (!params) {
                            throw new Error('Error initing GPULayer: must pass params to GPULayer.initFromImageURL(composer, params).');
                        }
                        if (!(0, type_checks_1.isObject)(params)) {
                            throw new Error("Error initing GPULayer: must pass valid params object to GPULayer.initFromImageURL(composer, params), got ".concat(JSON.stringify(params), "."));
                        }
                        // Check params.
                        var validKeys = ['name', 'url', 'filter', 'wrapX', 'wrapY', 'format', 'type'];
                        var requiredKeys = ['name', 'url'];
                        var keys = Object.keys(params);
                        (0, checks_1.checkValidKeys)(keys, validKeys, 'GPULayer.initFromImageURL(composer, params)', params.name);
                        (0, checks_1.checkRequiredKeys)(keys, requiredKeys, 'GPULayer.initFromImageURL(composer, params)', params.name);
                        var url = params.url, name = params.name, filter = params.filter, wrapX = params.wrapX, wrapY = params.wrapY, type = params.type, format = params.format;
                        if (!(0, type_checks_1.isString)(url)) {
                            throw new Error("Expected GPULayer.initFromImageURL params to have url of type string, got ".concat(url, " of type ").concat(typeof url, "."));
                        }
                        if (type && !(0, checks_1.isValidImageType)(type)) {
                            throw new Error("Invalid type: \"".concat(type, "\" for GPULayer.initFromImageURL \"").concat(name, "\", must be one of ").concat(JSON.stringify(constants_1.validImageTypes), "."));
                        }
                        if (format && !(0, checks_1.isValidImageFormat)(format)) {
                            throw new Error("Invalid format: \"".concat(format, "\" for GPULayer.initFromImageURL \"").concat(name, "\", must be one of ").concat(JSON.stringify(constants_1.validImageFormats), "."));
                        }
                        // Init a layer to return, we will fill it when image has loaded.
                        var layer = new GPULayer(composer, {
                            name: name,
                            type: type || constants_1.FLOAT,
                            filter: filter,
                            wrapX: wrapX,
                            wrapY: wrapY,
                            numComponents: format ? format.length : 4,
                            dimensions: [1, 1],
                            numBuffers: 1,
                        });
                        // Load image.
                        var image = new Image();
                        image.onload = function () {
                            layer.resize([image.width, image.height], image);
                            // Callback when texture has loaded.
                            resolve(layer);
                        };
                        image.onerror = function (e) {
                            reject(new Error("Error loading image \"".concat(name, "\": ").concat(e)));
                        };
                        image.src = url;
                    })];
            });
        });
    };
    Object.defineProperty(GPULayer.prototype, "width", {
        /**
         * The width of the GPULayer array.
         */
        get: function () {
            return this._width;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GPULayer.prototype, "height", {
        /**
         * The height of the GPULayer array.
         */
        get: function () {
            return this._height;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GPULayer.prototype, "length", {
        /**
         * The length of the GPULayer array (only available to 1D GPULayers).
         */
        get: function () {
            if (!this._length) {
                throw new Error("Cannot access length on 2D GPULayer \"".concat(this.name, "\"."));
            }
            return this._length;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns whether the GPULayer was inited as a 1D array (rather than 2D).
     * @returns - true if GPULayer is 1D, else false.
     */
    GPULayer.prototype.is1D = function () {
        return this._length !== undefined;
    };
    /**
     * Test whether the current buffer index has override enabled.
     * @private
     */
    GPULayer.prototype._usingTextureOverrideForCurrentBuffer = function () {
        return !!(this._textureOverrides && this._textureOverrides[this.bufferIndex]);
    };
    // saveCurrentStateToGPULayer(layer: GPULayer) {
    // 	// A method for saving a copy of the current state without a draw call.
    // 	// Draw calls are expensive, this optimization helps.
    // 	if (this.numBuffers < 2) {
    // 		throw new Error(`Can't call GPULayer.saveCurrentStateToGPULayer on GPULayer "${this.name}" with less than 2 buffers.`);
    // 	}
    // 	// Check that texture params are the same.
    // 	if (layer.glWrapS !== this.glWrapS || layer.glWrapT !== this.glWrapT ||
    // 		layer.wrapS !== this.wrapS || layer.wrapT !== this.wrapT ||
    // 		layer.width !== this.width || layer.height !== this.height ||
    // 		layer.glFilter !== this.glFilter || layer.filter !== this.filter ||
    // 		layer.glNumChannels !== this.glNumChannels || layer.numComponents !== this.numComponents ||
    // 		layer.glType !== this.glType || layer.type !== this.type ||
    // 		layer.glFormat !== this.glFormat || layer.glInternalFormat !== this.glInternalFormat) {
    // 			throw new Error(`Incompatible texture params between GPULayers "${layer.name}" and "${this.name}".`);
    // 	}
    // 	// If we have not already inited overrides array, do so now.
    // 	if (!this.textureOverrides) {
    // 		this.textureOverrides = [];
    // 		for (let i = 0; i < this.numBuffers; i++) {
    // 			this.textureOverrides.push(undefined);
    // 		}
    // 	}
    // 	// Check if we already have an override in place.
    // 	if (this.textureOverrides[this.bufferIndex]) {
    // 		throw new Error(`Can't call GPULayer.saveCurrentStateToGPULayer on GPULayer "${this.name}", this GPULayer has not written new state since last call to GPULayer.saveCurrentStateToGPULayer.`);
    // 	}
    // 	const { currentState } = this;
    // 	this.textureOverrides[this.bufferIndex] = currentState;
    // 	// Swap textures.
    // 	this.buffers[this.bufferIndex].texture = layer.currentState;
    // 	layer._setCurrentStateTexture(currentState);
    // 	// Bind swapped texture to framebuffer.
    // 	const { gl } = this.composer;
    // 	const { framebuffer, texture } = this.buffers[this.bufferIndex];
    // 	if (!framebuffer) throw new Error(`No framebuffer for writable GPULayer "${this.name}".`);
    // 	gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    // 	// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/framebufferTexture2D
    // 	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    // 	// Unbind.
    // 	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    // }
    // // This is used internally.
    // _setCurrentStateTexture(texture: WebGLTexture) {
    // 	this.buffers[this.bufferIndex].texture = texture;
    // }
    /**
     * Init GLTexture/GLFramebuffer pairs for reading/writing GPULayer data.
     * @private
     */
    GPULayer.prototype._initBuffers = function (arrayOrImage) {
        var _a = this, name = _a.name, numBuffers = _a.numBuffers, _composer = _a._composer, _glInternalFormat = _a._glInternalFormat, _glFormat = _a._glFormat, _glType = _a._glType, _glFilter = _a._glFilter, _glWrapS = _a._glWrapS, _glWrapT = _a._glWrapT, width = _a.width, height = _a.height;
        var gl = _composer.gl, _errorCallback = _composer._errorCallback;
        var validatedArrayOrImage = null;
        if ((0, type_checks_1.isArray)(arrayOrImage))
            validatedArrayOrImage = GPULayer.validateGPULayerArray(arrayOrImage, this);
        else if ((arrayOrImage === null || arrayOrImage === void 0 ? void 0 : arrayOrImage.constructor) === HTMLImageElement)
            validatedArrayOrImage = arrayOrImage;
        // Init a texture for each buffer.
        for (var i = 0; i < numBuffers; i++) {
            var texture = gl.createTexture();
            if (!texture) {
                _errorCallback("Could not init texture for GPULayer \"".concat(name, "\": ").concat(gl.getError(), "."));
                return;
            }
            gl.bindTexture(gl.TEXTURE_2D, texture);
            // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, _glWrapS);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, _glWrapT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, _glFilter);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, _glFilter);
            gl.texImage2D(gl.TEXTURE_2D, 0, _glInternalFormat, width, height, 0, _glFormat, _glType, validatedArrayOrImage);
            // Save this buffer to the list.
            this._buffers.push(texture);
        }
        // Unbind.
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    };
    Object.defineProperty(GPULayer.prototype, "bufferIndex", {
        /**
         * Get buffer index of the current state.
         */
        get: function () {
            return this._bufferIndex;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Increment buffer index by 1.
     */
    GPULayer.prototype.incrementBufferIndex = function () {
        // Increment bufferIndex.
        this._bufferIndex = (this.bufferIndex + 1) % this.numBuffers;
    };
    /**
     * Decrement buffer index by 1.
     */
    GPULayer.prototype.decrementBufferIndex = function () {
        // Decrement bufferIndex.
        this._bufferIndex = (this.bufferIndex - 1 + this.numBuffers) % this.numBuffers;
    };
    Object.defineProperty(GPULayer.prototype, "currentState", {
        /**
         * Get the current state as a GPULayerState object.
         */
        get: function () {
            return this.getStateAtIndex(this.bufferIndex);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GPULayer.prototype, "_currentTexture", {
        /**
         * Get the current state as a WebGLTexture.
         * Used internally.
         * @private
         */
        get: function () {
            var _a = this, _buffers = _a._buffers, _bufferIndex = _a._bufferIndex, _textureOverrides = _a._textureOverrides;
            if (_textureOverrides && _textureOverrides[_bufferIndex])
                return _textureOverrides[_bufferIndex];
            return _buffers[_bufferIndex];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GPULayer.prototype, "lastState", {
        /**
         * Get the previous state as a GPULayerState object (only available for GPULayers with numBuffers > 1).
         */
        get: function () {
            if (this.numBuffers === 1) {
                throw new Error("Cannot access lastState on GPULayer \"".concat(this.name, "\" with only one buffer."));
            }
            return this.getStateAtIndex((this.bufferIndex - 1 + this.numBuffers) % this.numBuffers);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Get the state at a specified index as a GPULayerState object.
     */
    GPULayer.prototype.getStateAtIndex = function (index) {
        var _a = this, numBuffers = _a.numBuffers, _textureOverrides = _a._textureOverrides, _buffers = _a._buffers;
        if (index < 0 && index > -numBuffers) {
            index += numBuffers; // Slightly negative numbers are ok.
        }
        if (index < 0 || index >= numBuffers) {
            // We will allow this number to overflow with warning - likely user error.
            console.warn("Out of range buffer index: ".concat(index, " for GPULayer \"").concat(this.name, "\" with $.numBuffers} buffer").concat(numBuffers > 1 ? 's' : '', ".  Was this intentional?"));
            if (index < 0) {
                index += numBuffers * Math.ceil(Math.abs(index) / numBuffers);
            }
            else {
                index = index % numBuffers;
            }
        }
        var texture = _buffers[index];
        if (_textureOverrides && _textureOverrides[index])
            texture = _textureOverrides[index];
        return {
            texture: texture,
            layer: this,
        };
    };
    /**
     * Increments the buffer index (if needed).
     * @private
     */
    GPULayer.prototype._prepareForWrite = function (incrementBufferIndex) {
        if (incrementBufferIndex) {
            this.incrementBufferIndex();
        }
        // We are going to do a data write, if we have overrides enabled, we can remove them.
        if (this._textureOverrides) {
            this._textureOverrides[this.bufferIndex] = undefined;
        }
    };
    GPULayer.prototype.setFromArray = function (array) {
        var _a = this, _composer = _a._composer, _glInternalFormat = _a._glInternalFormat, _glFormat = _a._glFormat, _glType = _a._glType, width = _a.width, height = _a.height, _currentTexture = _a._currentTexture;
        var gl = _composer.gl;
        var validatedArray = GPULayer.validateGPULayerArray(array, this);
        gl.bindTexture(gl.TEXTURE_2D, _currentTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, _glInternalFormat, width, height, 0, _glFormat, _glType, validatedArray);
        // Unbind texture.
        gl.bindTexture(gl.TEXTURE_2D, null);
    };
    // setFromImage(image: HTMLImageElement) {
    // 	const { name, _composer, width, height, _currentTexture, _glInternalFormat, _glFormat, _glType, numComponents, type } = this;
    // 	const { gl } = _composer;
    // 	// Check compatibility.
    // 	if (!isValidImageType(type)) {
    // 		throw new Error(`GPULayer has invalid type ${type} for setFromImage(), valid types are: ${JSON.stringify(validImageTypes)}.`);
    // 	}
    // 	if (numComponents < 3) {
    // 		throw new Error(`GPULayer has invalid numComponents ${numComponents} for setFromImage(), must have either 3 (RGB) or 4 (RGBA) components.`);
    // 	}
    // 	if (image.width !== width || image.height !== height) {
    // 		throw new Error(`Invalid image dimensions [${image.width}, ${image.height}] for GPULayer "${name}" with dimensions [${width}, ${height}].  Call GPULayer.resize(width, height, image) instead.`);
    // 	}
    // 	gl.bindTexture(gl.TEXTURE_2D, _currentTexture);
    // 	gl.texImage2D(gl.TEXTURE_2D, 0, _glInternalFormat, width, height, 0, _glFormat, _glType, image as any);
    // 	// Unbind texture.
    // 	gl.bindTexture(gl.TEXTURE_2D, null);
    // }
    GPULayer.prototype.resize = function (dimensions, arrayOrImage) {
        var _a = this, name = _a.name, _composer = _a._composer;
        var verboseLogging = _composer.verboseLogging;
        if (verboseLogging)
            console.log("Resizing GPULayer \"".concat(name, "\" to ").concat(JSON.stringify(dimensions), "."));
        var _b = GPULayer.calcGPULayerSize(dimensions, name, verboseLogging), length = _b.length, width = _b.width, height = _b.height;
        this._length = length;
        this._width = width;
        this._height = height;
        this._destroyBuffers();
        this._initBuffers(arrayOrImage);
    };
    Object.defineProperty(GPULayer.prototype, "clearValue", {
        /**
         * Get the clearValue of the GPULayer.
         */
        get: function () {
            return this._clearValue;
        },
        /**
         * Set the clearValue of the GPULayer, which is applied during GPULayer.clear().
         */
        set: function (clearValue) {
            var _a = this, numComponents = _a.numComponents, type = _a.type;
            if (!(0, checks_1.isValidClearValue)(clearValue, numComponents, type)) {
                throw new Error("Invalid clearValue: ".concat(JSON.stringify(clearValue), " for GPULayer \"").concat(this.name, "\", expected ").concat(type, " or array of ").concat(type, " of length ").concat(numComponents, "."));
            }
            // Make deep copy if needed.
            this._clearValue = (0, type_checks_1.isArray)(clearValue) ? clearValue.slice() : clearValue;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Clear all data in GPULayer to GPULayer.clearValue.
     * @param applyToAllBuffers - Flag to apply to all buffers of GPULayer, or just the current output buffer.
     */
    GPULayer.prototype.clear = function (applyToAllBuffers) {
        if (applyToAllBuffers === void 0) { applyToAllBuffers = false; }
        var _a = this, name = _a.name, _composer = _a._composer, clearValue = _a.clearValue, numBuffers = _a.numBuffers, type = _a.type;
        var verboseLogging = _composer.verboseLogging;
        if (verboseLogging)
            console.log("Clearing GPULayer \"".concat(name, "\"."));
        var value = [];
        if ((0, type_checks_1.isFiniteNumber)(clearValue)) {
            value.push(clearValue, clearValue, clearValue, clearValue);
        }
        else {
            value.push.apply(value, clearValue);
            for (var j = value.length; j < 4; j++) {
                value.push(0);
            }
        }
        var endIndex = applyToAllBuffers ? numBuffers : 1;
        var program = _composer._setValueProgramForType(type);
        program.setUniform('u_value', value);
        this.decrementBufferIndex(); // step() wil increment buffer index before draw, this way we clear in place.
        for (var i = 0; i < endIndex; i++) {
            // Write clear value to buffers.
            _composer.step({
                program: program,
                output: this,
            });
        }
        if (applyToAllBuffers)
            this.incrementBufferIndex(); // Get us back to the starting index.
    };
    GPULayer.prototype._getValuesSetup = function () {
        var _a = this, width = _a.width, height = _a.height, _composer = _a._composer, _currentTexture = _a._currentTexture;
        var _valuesRaw = this._valuesRaw;
        var gl = _composer.gl;
        // In case GPULayer was not the last output written to.
        (0, framebuffers_1.bindFrameBuffer)(_composer, this, _currentTexture);
        var _b = this, _glNumChannels = _b._glNumChannels, _glType = _b._glType, _glFormat = _b._glFormat, _internalType = _b._internalType;
        switch (_internalType) {
            case constants_1.HALF_FLOAT:
                if (gl.FLOAT !== undefined) {
                    // Firefox requires that RGBA/FLOAT is used for readPixels of float16 types.
                    _glNumChannels = 4;
                    _glFormat = gl.RGBA;
                    _glType = gl.FLOAT;
                    _valuesRaw = _valuesRaw || new Float32Array(width * height * _glNumChannels);
                }
                else {
                    _valuesRaw = _valuesRaw || new Uint16Array(width * height * _glNumChannels);
                }
                // // The following works in Chrome.
                // _valuesRaw = _valuesRaw || new Uint16Array(width * height * glNumChannels);
                break;
            case constants_1.FLOAT:
                // Chrome and Firefox require that RGBA/FLOAT is used for readPixels of float32 types.
                // https://github.com/KhronosGroup/WebGL/issues/2747
                _glNumChannels = 4;
                _glFormat = gl.RGBA;
                _valuesRaw = _valuesRaw || new Float32Array(width * height * _glNumChannels);
                break;
            case constants_1.UNSIGNED_BYTE:
                // We never hit glslVersion === GLSL1 anymore, see GPULayerHelpers.shouldCastIntTypeAsFloat for more info.
                // if (glslVersion === GLSL1) {
                // 	// Firefox requires that RGBA/UNSIGNED_BYTE is used for readPixels of unsigned byte types.
                // 	_glNumChannels = 4;
                // 	_glFormat = gl.RGBA;
                // 	_valuesRaw = _valuesRaw || new Uint8Array(width * height * _glNumChannels);
                // 	break;
                // }
                // Firefox requires that RGBA_INTEGER/UNSIGNED_INT is used for readPixels of unsigned int types.
                _glNumChannels = 4;
                _glFormat = gl.RGBA_INTEGER;
                _glType = gl.UNSIGNED_INT;
                _valuesRaw = _valuesRaw || new Uint32Array(width * height * _glNumChannels);
                // // The following works in Chrome.
                // _valuesRaw = _valuesRaw || new Uint8Array(width * height * glNumChannels);
                break;
            case constants_1.UNSIGNED_SHORT:
                // Firefox requires that RGBA_INTEGER/UNSIGNED_INT is used for readPixels of unsigned int types.
                _glNumChannels = 4;
                _glFormat = gl.RGBA_INTEGER;
                _glType = gl.UNSIGNED_INT;
                _valuesRaw = _valuesRaw || new Uint32Array(width * height * _glNumChannels);
                // // The following works in Chrome.
                // _valuesRaw = _valuesRaw || new Uint16Array(width * height * glNumChannels);
                break;
            case constants_1.UNSIGNED_INT:
                // Firefox requires that RGBA_INTEGER/UNSIGNED_INT is used for readPixels of unsigned int types.
                _glNumChannels = 4;
                _glFormat = gl.RGBA_INTEGER;
                _valuesRaw = _valuesRaw || new Uint32Array(width * height * _glNumChannels);
                // // The following works in Chrome.
                // _valuesRaw = _valuesRaw || new Uint32Array(width * height * glNumChannels);
                break;
            case constants_1.BYTE:
                // Firefox requires that RGBA_INTEGER/INT is used for readPixels of int types.
                _glNumChannels = 4;
                _glFormat = gl.RGBA_INTEGER;
                _glType = gl.INT;
                _valuesRaw = _valuesRaw || new Int32Array(width * height * _glNumChannels);
                // // The following works in Chrome.
                // _valuesRaw = _valuesRaw || new Int8Array(width * height * glNumChannels);
                break;
            case constants_1.SHORT:
                // Firefox requires that RGBA_INTEGER/INT is used for readPixels of int types.
                _glNumChannels = 4;
                _glFormat = gl.RGBA_INTEGER;
                _glType = gl.INT;
                _valuesRaw = _valuesRaw || new Int32Array(width * height * _glNumChannels);
                // // The following works in Chrome.
                // _valuesRaw = _valuesRaw || new Int16Array(width * height * glNumChannels);
                break;
            case constants_1.INT:
                // Firefox requires that RGBA_INTEGER/INT is used for readPixels of int types.
                _glNumChannels = 4;
                _glFormat = gl.RGBA_INTEGER;
                _valuesRaw = _valuesRaw || new Int32Array(width * height * _glNumChannels);
                // // The following works in Chrome.
                // _valuesRaw = _valuesRaw || new Int32Array(width * height * glNumChannels);
                break;
            default:
                throw new Error("Unsupported internalType ".concat(_internalType, " for getValues()."));
        }
        this._valuesRaw = _valuesRaw;
        if ((0, utils_1.readyToRead)(gl)) {
            return { _glFormat: _glFormat, _glType: _glType, _valuesRaw: _valuesRaw, _glNumChannels: _glNumChannels, _internalType: _internalType };
        }
        else {
            throw new Error("Unable to read values from Buffer with status: ".concat(gl.checkFramebufferStatus(gl.FRAMEBUFFER), "."));
        }
    };
    GPULayer.prototype._getValuesPost = function (_valuesRaw, _glNumChannels, _internalType) {
        var _a = this, width = _a.width, height = _a.height, numComponents = _a.numComponents, type = _a.type;
        var OUTPUT_LENGTH = (this._length ? this._length : width * height) * numComponents;
        // Convert uint16 to float32 if needed.
        var handleFloat16Conversion = _internalType === constants_1.HALF_FLOAT && _valuesRaw.constructor === Uint16Array;
        var _valuesBufferView = this._valuesBufferView;
        if (handleFloat16Conversion && !_valuesBufferView) {
            _valuesBufferView = new DataView(_valuesRaw.buffer);
            this._valuesBufferView = _valuesBufferView;
        }
        // We may use a different internal type than the assigned type of the GPULayer.
        if (_valuesRaw.length === OUTPUT_LENGTH && (0, conversions_1.arrayConstructorForType)(type, true) === _valuesRaw.constructor) {
            this._values = _valuesRaw;
        }
        else if (!this._values)
            this._values = GPULayer.initArrayForType(type, OUTPUT_LENGTH, true);
        var _values = this._values;
        // In some cases glNumChannels may be > numComponents.
        if (_valuesBufferView || _values !== _valuesRaw || numComponents !== _glNumChannels) {
            for (var i = 0, length_1 = width * height; i < length_1; i++) {
                var index1 = i * _glNumChannels;
                var index2 = i * numComponents;
                if (index2 >= OUTPUT_LENGTH)
                    break;
                for (var j = 0; j < numComponents; j++) {
                    if (_valuesBufferView) {
                        _values[index2 + j] = (0, float16_1.getFloat16)(_valuesBufferView, 2 * (index1 + j), true);
                    }
                    else {
                        _values[index2 + j] = _valuesRaw[index1 + j];
                    }
                }
            }
        }
        return _values;
    };
    /**
     * Returns the current values of the GPULayer as a TypedArray.
     * @returns - A TypedArray containing current state of GPULayer.
     */
    GPULayer.prototype.getValues = function () {
        var _a = this, width = _a.width, height = _a.height, _composer = _a._composer;
        var gl = _composer.gl;
        var _b = this._getValuesSetup(), _glFormat = _b._glFormat, _glType = _b._glType, _valuesRaw = _b._valuesRaw, _glNumChannels = _b._glNumChannels, _internalType = _b._internalType;
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/readPixels
        gl.readPixels(0, 0, width, height, _glFormat, _glType, _valuesRaw);
        return this._getValuesPost(_valuesRaw, _glNumChannels, _internalType);
    };
    /**
     * Non-blocking function to return the current values of the GPULayer as a TypedArray.
     * This only works for WebGL2 contexts, will fall back to getValues() if WebGL1 context.
     * @returns - A TypedArray containing current state of GPULayer.
     */
    GPULayer.prototype.getValuesAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, width, height, _composer, gl, isWebGL2, _b, _glFormat, _glType, _valuesRaw, _glNumChannels, _internalType;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this, width = _a.width, height = _a.height, _composer = _a._composer;
                        gl = _composer.gl, isWebGL2 = _composer.isWebGL2;
                        if (!isWebGL2) {
                            // Async method is not supported for WebGL1.
                            return [2 /*return*/, this.getValues()];
                        }
                        _b = this._getValuesSetup(), _glFormat = _b._glFormat, _glType = _b._glType, _valuesRaw = _b._valuesRaw, _glNumChannels = _b._glNumChannels, _internalType = _b._internalType;
                        // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/readPixels
                        return [4 /*yield*/, (0, utils_1.readPixelsAsync)(gl, 0, 0, width, height, _glFormat, _glType, _valuesRaw)];
                    case 1:
                        // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/readPixels
                        _c.sent();
                        return [2 /*return*/, this._getValuesPost(_valuesRaw, _glNumChannels, _internalType)];
                }
            });
        });
    };
    // TODO: params.callback is not generated in the docs.
    /**
     * Save the current state of this GPULayer to png.
     * @param params - PNG parameters.
     * @param params.filename - PNG filename (no extension, defaults to the name of the GPULayer).
     * @param params.dpi - PNG dpi (defaults to 72dpi).
     * @param params.multiplier - Multiplier to apply to data before saving PNG (defaults to 255 for FLOAT and HALF_FLOAT types, else 1).
     * @param params.callback - Optional callback when Blob is ready, default behavior saves the PNG using FileSaver.js.
    */
    GPULayer.prototype.savePNG = function (params) {
        if (params === void 0) { params = {}; }
        var values = this.getValues();
        var _a = this, width = _a.width, height = _a.height, type = _a.type, name = _a.name, numComponents = _a.numComponents;
        var callback = params.callback || file_saver_1.saveAs; // Default to saving the image with FileSaver.
        var filename = params.filename || name; // Default to the name of this layer.
        var multiplier = params.multiplier ||
            ((type === constants_1.FLOAT || type === constants_1.HALF_FLOAT) ? 255 : 1);
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var context = canvas.getContext('2d');
        var imageData = context.getImageData(0, 0, width, height);
        var buffer = imageData.data;
        // Have to flip the y axis since PNGs are written top to bottom.
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                var index = y * width + x;
                var indexFlipped = (height - 1 - y) * width + x;
                for (var i = 0; i < numComponents; i++) {
                    buffer[4 * indexFlipped + i] = values[numComponents * index + i] * multiplier;
                }
                if (numComponents === 1) {
                    // Make monochrome.
                    buffer[4 * indexFlipped + 1] = buffer[4 * indexFlipped];
                    buffer[4 * indexFlipped + 2] = buffer[4 * indexFlipped];
                }
                if (numComponents < 4) {
                    buffer[4 * indexFlipped + 3] = 255; // Set alpha channel to 255.
                }
            }
        }
        context.putImageData(imageData, 0, 0);
        canvas.toBlob(function (blob) {
            if (!blob) {
                console.warn("Problem saving PNG from GPULayer \"".concat(name, "\", unable to init blob."));
                return;
            }
            if (params.dpi) {
                (0, changedpi_1.changeDpiBlob)(blob, params.dpi).then(function (blob) {
                    callback(blob, "".concat(filename, ".png"));
                });
            }
            else {
                callback(blob, "".concat(filename, ".png"));
            }
        }, 'image/png');
    };
    /**
     * Attach the output buffer of this GPULayer to a Threejs Texture object.
     * @param {Texture} texture - Threejs texture object.
     */
    GPULayer.prototype.attachToThreeTexture = function (texture) {
        var _a = this, _composer = _a._composer, numBuffers = _a.numBuffers, currentState = _a.currentState, name = _a.name;
        var _threeRenderer = _composer._threeRenderer, gl = _composer.gl;
        if (!_threeRenderer) {
            throw new Error('GPUComposer was not inited with a renderer.');
        }
        // Link webgl texture to threejs object.
        // This is not officially supported by threejs.
        if (numBuffers > 1) {
            throw new Error("GPULayer \"".concat(name, "\" contains multiple WebGL textures (one for each buffer) that are flip-flopped during compute cycles, please choose a GPULayer with one buffer."));
        }
        var offsetTextureProperties = _threeRenderer.properties.get(texture);
        gl.deleteTexture(offsetTextureProperties.__webglTexture);
        offsetTextureProperties.__webglTexture = currentState.texture;
        offsetTextureProperties.__webglInit = true;
    };
    /**
     * Delete this GPULayer's framebuffers and textures.
     * @private
     */
    GPULayer.prototype._destroyBuffers = function () {
        var _a = this, _composer = _a._composer, _buffers = _a._buffers;
        var gl = _composer.gl;
        _buffers.forEach(function (texture) {
            gl.deleteTexture(texture);
            (0, framebuffers_1.disposeFramebuffers)(gl, texture);
        });
        _buffers.length = 0;
        // These are technically owned by another GPULayer,
        // so we are not responsible for deleting them from gl context.
        delete this._textureOverrides;
    };
    /**
     * Create a deep copy of GPULayer with current state copied over.
     * @param name - Name of new GPULayer as string.
     * @returns - Deep copy of GPULayer.
     */
    GPULayer.prototype.clone = function (name) {
        // Make a deep copy.
        return this._composer._cloneGPULayer(this, name);
    };
    /**
     * Deallocate GPULayer instance and associated WebGL properties.
     */
    GPULayer.prototype.dispose = function () {
        var _a = this, name = _a.name, _composer = _a._composer;
        var gl = _composer.gl, verboseLogging = _composer.verboseLogging;
        if (verboseLogging)
            console.log("Deallocating GPULayer \"".concat(name, "\"."));
        if (!gl)
            throw new Error("Must call dispose() on all GPULayers before calling dispose() on GPUComposer.");
        this._destroyBuffers();
        // @ts-ignore
        delete this._buffers;
        // @ts-ignore
        delete this._composer;
        if (this._values)
            delete this._values;
        if (this._valuesRaw)
            delete this._valuesRaw;
    };
    return GPULayer;
}());
exports.GPULayer = GPULayer;


/***/ }),

/***/ 191:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.minMaxValuesForType = exports.testFilterWrap = exports.testWriteSupport = exports.shouldCastIntTypeAsFloat = void 0;
var type_checks_1 = __webpack_require__(566);
var float16_1 = __webpack_require__(650);
var constants_1 = __webpack_require__(601);
var conversions_1 = __webpack_require__(690);
var extensions_1 = __webpack_require__(581);
var framebuffers_1 = __webpack_require__(798);
var GPULayer_1 = __webpack_require__(355);
var utils_1 = __webpack_require__(593);
// Memoize results.
var results = {
    writeSupport: {},
    filterWrapSupport: {},
};
/**
 * Init empty typed array for type, optionally use Float32Array for HALF_FLOAT.
 * @private
 */
GPULayer_1.GPULayer.initArrayForType = function (type, length, halfFloatsAsFloats) {
    if (halfFloatsAsFloats === void 0) { halfFloatsAsFloats = false; }
    return new ((0, conversions_1.arrayConstructorForType)(type, halfFloatsAsFloats))(length);
};
/**
 * Calc 2D size [width, height] for GPU layer given a 1D or 2D size parameter.
 * If 1D size supplied, nearest power of 2 width/height is generated.
 * Also checks that size elements are valid.
 * @private
 */
GPULayer_1.GPULayer.calcGPULayerSize = function (size, name, verboseLogging) {
    if ((0, type_checks_1.isNumber)(size)) {
        if (!(0, type_checks_1.isPositiveInteger)(size)) {
            throw new Error("Invalid length: ".concat(JSON.stringify(size), " for GPULayer \"").concat(name, "\", must be positive integer."));
        }
        var length_1 = size;
        // Relaxing adherence to power of 2.
        // // Calc power of two width and height for length.
        // let exp = 1;
        // let remainder = length;
        // while (remainder > 2) {
        // 	exp++;
        // 	remainder /= 2;
        // }
        // const width = Math.pow(2, Math.floor(exp / 2) + exp % 2);
        // const height = Math.pow(2, Math.floor(exp/2));
        var width_1 = Math.ceil(Math.sqrt(length_1));
        var height_1 = Math.ceil(length_1 / width_1);
        if (verboseLogging)
            console.log("Using [".concat(width_1, ", ").concat(height_1, "] for 1D array of length ").concat(size, " in GPULayer \"").concat(name, "\"."));
        return { width: width_1, height: height_1, length: length_1 };
    }
    var width = size[0];
    if (!(0, type_checks_1.isPositiveInteger)(width)) {
        throw new Error("Invalid width: ".concat(JSON.stringify(width), " for GPULayer \"").concat(name, "\", must be positive integer."));
    }
    var height = size[1];
    if (!(0, type_checks_1.isPositiveInteger)(height)) {
        throw new Error("Invalid height: ".concat(JSON.stringify(height), " for GPULayer \"").concat(name, "\", must be positive integer."));
    }
    return { width: width, height: height };
};
/**
 * Get the GL wrap type to use internally in GPULayer, based on browser support.
 * @private
 */
GPULayer_1.GPULayer.getGPULayerInternalWrap = function (params) {
    var composer = params.composer, wrap = params.wrap, internalFilter = params.internalFilter, internalType = params.internalType;
    // CLAMP_TO_EDGE is always supported.
    if (wrap === constants_1.CLAMP_TO_EDGE) {
        return wrap;
    }
    // Test if wrap/filter combo is actually supported by running some numbers through.
    if (testFilterWrap(composer, internalType, internalFilter, wrap)) {
        return wrap;
    }
    // If not, convert to CLAMP_TO_EDGE and polyfill in fragment shader.
    return constants_1.CLAMP_TO_EDGE;
    // REPEAT and MIRROR_REPEAT wrap not supported for non-power of 2 textures in safari.
    // I've tested this and it seems that some power of 2 textures will work (512 x 512),
    // but not others (1024x1024), so let's just change all WebGL 1.0 to CLAMP.
    // Without this, we currently get an error at drawArrays():
    // "WebGL: drawArrays: texture bound to texture unit 0 is not renderable.
    // It maybe non-power-of-2 and have incompatible texture filtering or is not
    // 'texture complete', or it is a float/half-float type with linear filtering and
    // without the relevant float/half-float linear extension enabled."
};
/**
 * Get the GL filter type to use internally in GPULayer, based on browser support.
 * @private
 */
GPULayer_1.GPULayer.getGPULayerInternalFilter = function (params) {
    var filter = params.filter;
    if (filter === constants_1.NEAREST) {
        // NEAREST filtering is always supported.
        return filter;
    }
    var composer = params.composer, internalType = params.internalType, wrapX = params.wrapX, wrapY = params.wrapY, name = params.name;
    if (internalType === constants_1.HALF_FLOAT) {
        var extension = (0, extensions_1.getExtension)(composer, extensions_1.OES_TEXTURE_HAlF_FLOAT_LINEAR, true)
            || (0, extensions_1.getExtension)(composer, extensions_1.OES_TEXTURE_FLOAT_LINEAR, true);
        if (!extension || !testFilterWrap(composer, internalType, filter, wrapX) || !testFilterWrap(composer, internalType, filter, wrapY)) {
            console.warn("This browser does not support ".concat(filter, " filtering for type ").concat(internalType, " and wrap [").concat(wrapX, ", ").concat(wrapY, "].  Falling back to NEAREST filter for GPULayer \"").concat(name, "\" with ").concat(filter, " polyfill in fragment shader."));
            filter = constants_1.NEAREST; // Polyfill in fragment shader.
        }
    }
    if (internalType === constants_1.FLOAT) {
        var extension = (0, extensions_1.getExtension)(composer, extensions_1.OES_TEXTURE_FLOAT_LINEAR, true);
        if (!extension || !testFilterWrap(composer, internalType, filter, wrapX) || !testFilterWrap(composer, internalType, filter, wrapY)) {
            console.warn("This browser does not support ".concat(filter, " filtering for type ").concat(internalType, " and wrap [").concat(wrapX, ", ").concat(wrapY, "].  Falling back to NEAREST filter for GPULayer \"").concat(name, "\" with ").concat(filter, " polyfill in fragment shader."));
            filter = constants_1.NEAREST; // Polyfill in fragment shader.
        }
    }
    return filter;
};
/**
 * Returns whether to cast int type as floats, as needed by browser.
 * @private
 */
function shouldCastIntTypeAsFloat(composer, type) {
    var glslVersion = composer.glslVersion, isWebGL2 = composer.isWebGL2;
    // All types are supported by WebGL2 + glsl3.
    if (glslVersion === constants_1.GLSL3 && isWebGL2)
        return false;
    // Int textures (other than UNSIGNED_BYTE) are not supported by WebGL1.0 or glsl1.x.
    // https://stackoverflow.com/questions/55803017/how-to-select-webgl-glsl-sampler-type-from-texture-format-properties
    // Use HALF_FLOAT/FLOAT instead.
    // Some large values of INT and UNSIGNED_INT are not supported unfortunately.
    // See tests for more information.
    // Update: Even UNSIGNED_BYTE should be cast as float in GLSL1.  I noticed some strange behavior in test:
    // setUniform>'should cast/handle uint uniforms for UNSIGNED_BYTE GPULayers' in tests/mocha/GPUProgram and 
    // getValues>'should return correct values for UNSIGNED_BYTE GPULayer' in tests/mocha/GPULayer
    return type === constants_1.UNSIGNED_BYTE || type === constants_1.BYTE || type === constants_1.SHORT || type === constants_1.INT || type === constants_1.UNSIGNED_SHORT || type === constants_1.UNSIGNED_INT;
}
exports.shouldCastIntTypeAsFloat = shouldCastIntTypeAsFloat;
/**
 * Returns GLTexture parameters for GPULayer, based on browser support.
 * @private
 */
GPULayer_1.GPULayer.getGLTextureParameters = function (params) {
    var composer = params.composer, name = params.name, numComponents = params.numComponents, internalType = params.internalType;
    var gl = composer.gl, glslVersion = composer.glslVersion, isWebGL2 = composer.isWebGL2;
    // https://www.khronos.org/registry/webgl/specs/latest/2.0/#TEXTURE_TYPES_FORMATS_FROM_DOM_ELEMENTS_TABLE
    var glType, glFormat, glInternalFormat, glNumChannels;
    if (isWebGL2) {
        glNumChannels = numComponents;
        // https://www.khronos.org/registry/webgl/extensions/EXT_color_buffer_float/
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D
        // The sized internal format RGBxxx are not color-renderable.
        // If numComponents == 3 for a writable texture, use RGBA instead.
        // Page 5 of https://www.khronos.org/files/webgl20-reference-guide.pdf
        // Update: Some formats (e.g. RGB) may be emulated, causing a performance hit:
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices#some_formats_e.g._rgb_may_be_emulated
        // Prefer to use rgba instead of rgb for all cases (WebGL1 and WebGL2).
        if (numComponents === 3) {
            glNumChannels = 4;
        }
        if (internalType === constants_1.FLOAT || internalType === constants_1.HALF_FLOAT) {
            // This will be hit in all cases for GLSL1, now that we have cast UNSIGNED_BYTE types to HALF_FLOAT for GLSL1.
            // See comments in shouldCastIntTypeAsFloat for more information.
            switch (glNumChannels) {
                case 1:
                    glFormat = gl.RED;
                    break;
                case 2:
                    glFormat = gl.RG;
                    break;
                // case 3:
                // 	glFormat = gl.RGB; // We never hit this.
                // 	break;
                case 4:
                    glFormat = gl.RGBA;
                    break;
                default:
                    throw new Error("Unsupported glNumChannels: ".concat(glNumChannels, " for GPULayer \"").concat(name, "\"."));
            }
        }
        else {
            // This case will only be hit by GLSL 3.
            // Int textures are not supported in GLSL1.
            switch (glNumChannels) {
                case 1:
                    glFormat = gl.RED_INTEGER;
                    break;
                case 2:
                    glFormat = gl.RG_INTEGER;
                    break;
                // case 3:
                // 	glFormat = (gl as WebGL2RenderingContext).RGB_INTEGER; // We never hit this.
                // 	break;
                case 4:
                    glFormat = gl.RGBA_INTEGER;
                    break;
                default:
                    throw new Error("Unsupported glNumChannels: ".concat(glNumChannels, " for GPULayer \"").concat(name, "\"."));
            }
        }
        switch (internalType) {
            case constants_1.HALF_FLOAT:
                glType = gl.HALF_FLOAT;
                switch (glNumChannels) {
                    case 1:
                        glInternalFormat = gl.R16F;
                        break;
                    case 2:
                        glInternalFormat = gl.RG16F;
                        break;
                    // case 3:
                    // 	glInternalFormat = (gl as WebGL2RenderingContext).RGB16F; // We never hit this.
                    // 	break;
                    case 4:
                        glInternalFormat = gl.RGBA16F;
                        break;
                    default:
                        throw new Error("Unsupported glNumChannels: ".concat(glNumChannels, " for GPULayer \"").concat(name, "\"."));
                }
                break;
            case constants_1.FLOAT:
                glType = gl.FLOAT;
                switch (glNumChannels) {
                    case 1:
                        glInternalFormat = gl.R32F;
                        break;
                    case 2:
                        glInternalFormat = gl.RG32F;
                        break;
                    // case 3:
                    // 	glInternalFormat = (gl as WebGL2RenderingContext).RGB32F; // We never hit this.
                    // 	break;
                    case 4:
                        glInternalFormat = gl.RGBA32F;
                        break;
                    default:
                        throw new Error("Unsupported glNumChannels: ".concat(glNumChannels, " for GPULayer \"").concat(name, "\"."));
                }
                break;
            case constants_1.UNSIGNED_BYTE:
                glType = gl.UNSIGNED_BYTE;
                if (glslVersion === constants_1.GLSL1 && internalType === constants_1.UNSIGNED_BYTE) {
                    glInternalFormat = glFormat;
                }
                else {
                    switch (glNumChannels) {
                        case 1:
                            glInternalFormat = gl.R8UI;
                            break;
                        case 2:
                            glInternalFormat = gl.RG8UI;
                            break;
                        // case 3:
                        // 	glInternalFormat = (gl as WebGL2RenderingContext).RGB8UI; // We never hit this.
                        // 	break;
                        case 4:
                            glInternalFormat = gl.RGBA8UI;
                            break;
                        default:
                            throw new Error("Unsupported glNumChannels: ".concat(glNumChannels, " for GPULayer \"").concat(name, "\"."));
                    }
                }
                break;
            case constants_1.BYTE:
                glType = gl.BYTE;
                switch (glNumChannels) {
                    case 1:
                        glInternalFormat = gl.R8I;
                        break;
                    case 2:
                        glInternalFormat = gl.RG8I;
                        break;
                    // case 3:
                    // 	glInternalFormat = (gl as WebGL2RenderingContext).RGB8I; // We never hit this.
                    // 	break;
                    case 4:
                        glInternalFormat = gl.RGBA8I;
                        break;
                    default:
                        throw new Error("Unsupported glNumChannels: ".concat(glNumChannels, " for GPULayer \"").concat(name, "\"."));
                }
                break;
            case constants_1.SHORT:
                glType = gl.SHORT;
                switch (glNumChannels) {
                    case 1:
                        glInternalFormat = gl.R16I;
                        break;
                    case 2:
                        glInternalFormat = gl.RG16I;
                        break;
                    // case 3:
                    // 	glInternalFormat = (gl as WebGL2RenderingContext).RGB16I; // We never hit this.
                    // 	break;
                    case 4:
                        glInternalFormat = gl.RGBA16I;
                        break;
                    default:
                        throw new Error("Unsupported glNumChannels: ".concat(glNumChannels, " for GPULayer \"").concat(name, "\"."));
                }
                break;
            case constants_1.UNSIGNED_SHORT:
                glType = gl.UNSIGNED_SHORT;
                switch (glNumChannels) {
                    case 1:
                        glInternalFormat = gl.R16UI;
                        break;
                    case 2:
                        glInternalFormat = gl.RG16UI;
                        break;
                    // case 3:
                    // 	glInternalFormat = (gl as WebGL2RenderingContext).RGB16UI; // We never hit this.
                    // 	break;
                    case 4:
                        glInternalFormat = gl.RGBA16UI;
                        break;
                    default:
                        throw new Error("Unsupported glNumChannels: ".concat(glNumChannels, " for GPULayer \"").concat(name, "\"."));
                }
                break;
            case constants_1.INT:
                glType = gl.INT;
                switch (glNumChannels) {
                    case 1:
                        glInternalFormat = gl.R32I;
                        break;
                    case 2:
                        glInternalFormat = gl.RG32I;
                        break;
                    // case 3:
                    // 	glInternalFormat = (gl as WebGL2RenderingContext).RGB32I; // We never hit this.
                    // 	break;
                    case 4:
                        glInternalFormat = gl.RGBA32I;
                        break;
                    default:
                        throw new Error("Unsupported glNumChannels: ".concat(glNumChannels, " for GPULayer \"").concat(name, "\"."));
                }
                break;
            case constants_1.UNSIGNED_INT:
                glType = gl.UNSIGNED_INT;
                switch (glNumChannels) {
                    case 1:
                        glInternalFormat = gl.R32UI;
                        break;
                    case 2:
                        glInternalFormat = gl.RG32UI;
                        break;
                    // case 3:
                    // 	glInternalFormat = (gl as WebGL2RenderingContext).RGB32UI; // We never hit this.
                    // 	break;
                    case 4:
                        glInternalFormat = gl.RGBA32UI;
                        break;
                    default:
                        throw new Error("Unsupported glNumChannels: ".concat(glNumChannels, " for GPULayer \"").concat(name, "\"."));
                }
                break;
            default:
                throw new Error("Unsupported type: \"".concat(internalType, "\" for GPULayer \"").concat(name, "\"."));
        }
    }
    else {
        // WebGL1 case.
        if (numComponents < 1 || numComponents > 4) {
            throw new Error("Unsupported numComponents: ".concat(numComponents, " for GPULayer \"").concat(name, "\"."));
        }
        // Always use 4 channel textures for WebGL1.
        // Some formats (e.g. RGB) may be emulated, causing a performance hit:
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices#some_formats_e.g._rgb_may_be_emulated
        glNumChannels = 4;
        glFormat = gl.RGBA;
        glInternalFormat = gl.RGBA;
        switch (internalType) {
            case constants_1.FLOAT:
                glType = gl.FLOAT;
                break;
            case constants_1.HALF_FLOAT:
                glType = gl.HALF_FLOAT || (0, extensions_1.getExtension)(composer, extensions_1.OES_TEXTURE_HALF_FLOAT).HALF_FLOAT_OES;
                break;
            // case UNSIGNED_BYTE:
            // 	// This will never be hit, now that we have cast UNSIGNED_BYTE types to HALF_FLOAT for GLSL1.
            // 	// See comments in shouldCastIntTypeAsFloat for more information.
            // 	glType = gl.UNSIGNED_BYTE;
            // 	break;
            // No other types are supported in WebGL1.
            default:
                throw new Error("Unsupported type: \"".concat(internalType, "\" in WebGL 1.0 for GPULayer \"").concat(name, "\"."));
        }
    }
    // Check for missing params.
    if (glType === undefined || glFormat === undefined || glInternalFormat === undefined) {
        var missingParams = [];
        if (glType === undefined)
            missingParams.push('glType');
        if (glFormat === undefined)
            missingParams.push('glFormat');
        if (glInternalFormat === undefined)
            missingParams.push('glInternalFormat');
        throw new Error("Invalid type: ".concat(internalType, " for numComponents: ").concat(numComponents, ", unable to init parameter").concat(missingParams.length > 1 ? 's' : '', " ").concat(missingParams.join(', '), " for GPULayer \"").concat(name, "\"."));
    }
    if (glNumChannels === undefined || numComponents < 1 || numComponents > 4 || glNumChannels < numComponents) {
        throw new Error("Invalid numChannels: ".concat(glNumChannels, " for numComponents: ").concat(numComponents, " for GPULayer \"").concat(name, "\"."));
    }
    return {
        glFormat: glFormat,
        glInternalFormat: glInternalFormat,
        glType: glType,
        glNumChannels: glNumChannels,
    };
};
/**
 * Rigorous method for testing FLOAT and HALF_FLOAT write support by attaching texture to framebuffer.
 * @private
 */
function testWriteSupport(composer, internalType) {
    var gl = composer.gl, glslVersion = composer.glslVersion, isWebGL2 = composer.isWebGL2;
    // Memoize results for a given set of inputs.
    var key = "".concat(isWebGL2, ",").concat(internalType, ",").concat(glslVersion === constants_1.GLSL3 ? '3' : '1');
    if (results.writeSupport[key] !== undefined) {
        return results.writeSupport[key];
    }
    var texture = gl.createTexture();
    if (!texture) {
        results.writeSupport[key] = false;
        return results.writeSupport[key];
    }
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // Default to most widely supported settings.
    var wrap = gl[constants_1.CLAMP_TO_EDGE];
    var filter = gl[constants_1.NEAREST];
    // Use non-power of two dimensions to check for more universal support.
    // (In case size of GPULayer is changed at a later point).
    var width = 10;
    var height = 10;
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    var _a = GPULayer_1.GPULayer.getGLTextureParameters({
        composer: composer,
        name: 'testWriteSupport',
        numComponents: 1,
        internalType: internalType,
    }), glInternalFormat = _a.glInternalFormat, glFormat = _a.glFormat, glType = _a.glType;
    gl.texImage2D(gl.TEXTURE_2D, 0, glInternalFormat, width, height, 0, glFormat, glType, null);
    // Init a framebuffer for this texture so we can write to it.
    var framebuffer = gl.createFramebuffer();
    if (!framebuffer) {
        // Clear out allocated memory.
        gl.deleteTexture(texture);
        results.writeSupport[key] = false;
        return results.writeSupport[key];
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/framebufferTexture2D
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    var validStatus = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
    // Clear out allocated memory.
    gl.deleteTexture(texture);
    gl.deleteFramebuffer(framebuffer);
    results.writeSupport[key] = validStatus;
    return results.writeSupport[key];
}
exports.testWriteSupport = testWriteSupport;
/**
 * Rigorous method for testing whether a filter/wrap combination is supported
 * by the current browser.  I found that some versions of WebGL2 mobile safari
 * may support the OES_texture_float_linear and EXT_color_buffer_float, but still
 * do not linearly interpolate float textures or wrap only for power-of-two textures.
 * @private
 */
function testFilterWrap(composer, internalType, filter, wrap) {
    var _a;
    var gl = composer.gl, glslVersion = composer.glslVersion, intPrecision = composer.intPrecision, floatPrecision = composer.floatPrecision, _errorCallback = composer._errorCallback, isWebGL2 = composer.isWebGL2;
    // Memoize results for a given set of inputs.
    var key = "".concat(isWebGL2, ",").concat(internalType, ",").concat(filter, ",").concat(wrap, ",").concat(glslVersion === constants_1.GLSL3 ? '3' : '1');
    if (results.filterWrapSupport[key] !== undefined) {
        return results.filterWrapSupport[key];
    }
    var texture = gl.createTexture();
    if (!texture) {
        results.filterWrapSupport[key] = false;
        return results.filterWrapSupport[key];
    }
    gl.bindTexture(gl.TEXTURE_2D, texture);
    var glWrap = gl[wrap];
    var glFilter = gl[filter];
    // Use non power of two dimensions to check for more universal support.
    var width = 3;
    var height = 3;
    var numComponents = 1;
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, glWrap);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, glWrap);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, glFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, glFilter);
    var _b = GPULayer_1.GPULayer.getGLTextureParameters({
        composer: composer,
        name: 'testFilterWrap',
        numComponents: numComponents,
        internalType: internalType,
    }), glInternalFormat = _b.glInternalFormat, glFormat = _b.glFormat, glType = _b.glType, glNumChannels = _b.glNumChannels;
    // Init texture with values.
    var values = [3, 56.5, 834, -53.6, 0.003, 96.2, 23, 90.2, 32];
    var valuesTyped = GPULayer_1.GPULayer.initArrayForType(internalType, values.length * glNumChannels, true);
    for (var i = 0; i < values.length; i++) {
        valuesTyped[i * glNumChannels] = values[i];
        values[i] = valuesTyped[i * glNumChannels]; // Cast as int/uint if needed.
    }
    if (internalType === constants_1.HALF_FLOAT) {
        // Cast values as Uint16Array for HALF_FLOAT.
        var valuesTyped16 = new Uint16Array(valuesTyped.length);
        var float16View = new DataView(valuesTyped16.buffer);
        for (var i = 0; i < valuesTyped.length; i++) {
            (0, float16_1.setFloat16)(float16View, 2 * i, valuesTyped[i], true);
        }
        valuesTyped = valuesTyped16;
    }
    gl.texImage2D(gl.TEXTURE_2D, 0, glInternalFormat, width, height, 0, glFormat, glType, valuesTyped);
    // Init a GPULayer to write to.
    // Must use CLAMP_TO_EDGE/NEAREST on this GPULayer to avoid infinite loop.
    var output = new GPULayer_1.GPULayer(composer, {
        name: 'testFloatLinearFiltering-output',
        type: internalType,
        numComponents: numComponents,
        dimensions: [width, height],
        wrapX: constants_1.CLAMP_TO_EDGE,
        wrapY: constants_1.CLAMP_TO_EDGE,
        filter: constants_1.NEAREST,
    });
    var offset = filter === constants_1.LINEAR ? 0.5 : 1;
    // Run program to perform linear filter.
    var programName = 'testFilterWrap-program';
    var fragmentShaderSource = "\nin vec2 v_uv;\nuniform vec2 u_offset;\n#ifdef GPUIO_INT\n\tuniform isampler2D u_input;\n\tout int out_result;\n#endif\n#ifdef GPUIO_UINT\n\tuniform usampler2D u_input;\n\tout uint out_result;\n#endif\n#ifdef GPUIO_FLOAT\n\tuniform sampler2D u_input;\n\tout float out_result;\n#endif\nvoid main() {\n\tout_result = texture(u_input, v_uv + offset).x;\n}";
    if (glslVersion !== constants_1.GLSL3) {
        fragmentShaderSource = (0, utils_1.convertFragmentShaderToGLSL1)(fragmentShaderSource, programName)[0];
    }
    var fragmentShader = (0, utils_1.compileShader)(gl, glslVersion, intPrecision, floatPrecision, fragmentShaderSource, gl.FRAGMENT_SHADER, programName, _errorCallback, (_a = {
            offset: "vec2(".concat(offset / width, ", ").concat(offset / height, ")")
        },
        _a[(0, utils_1.isUnsignedIntType)(internalType) ? 'GPUIO_UINT' : ((0, utils_1.isIntType)(internalType) ? 'GPUIO_INT' : 'GPUIO_FLOAT')] = '1',
        _a), true);
    function wrapValue(val, max) {
        if (wrap === constants_1.CLAMP_TO_EDGE)
            return Math.max(0, Math.min(max - 1, val));
        return (val + max) % max;
    }
    var vertexShader = composer._getVertexShader(constants_1.DEFAULT_PROGRAM_NAME, '', {}, programName);
    if (vertexShader && fragmentShader) {
        var program = (0, utils_1.initGLProgram)(gl, vertexShader, fragmentShader, programName, _errorCallback);
        if (program) {
            // Draw setup.
            output._prepareForWrite(false);
            (0, framebuffers_1.bindFrameBuffer)(composer, output, output._currentTexture);
            gl.viewport(0, 0, width, height);
            gl.useProgram(program);
            // Bind texture.
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            // Set uniforms.
            gl.uniform2fv(gl.getUniformLocation(program, 'u_gpuio_scale'), [1, 1]);
            gl.uniform2fv(gl.getUniformLocation(program, 'u_gpuio_translation'), [0, 0]);
            gl.bindBuffer(gl.ARRAY_BUFFER, composer._getQuadPositionsBuffer());
            composer._setPositionAttribute(program, programName);
            // Draw.
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            gl.disable(gl.BLEND);
            var filtered = output.getValues();
            var supported = true;
            var tol = (0, utils_1.isIntType)(internalType) ? 0 : (internalType === constants_1.HALF_FLOAT ? 1e-2 : 1e-4);
            for (var x = 0; x < width; x++) {
                for (var y = 0; y < height; y++) {
                    var expected = void 0;
                    if (filter === constants_1.LINEAR) {
                        expected = (values[y * width + x] +
                            values[y * width + wrapValue(x + 1, width)] +
                            values[wrapValue(y + 1, height) * width + x] +
                            values[wrapValue(y + 1, height) * width + wrapValue(x + 1, width)]) / 4;
                    }
                    else {
                        var _x = wrapValue(x + offset, width);
                        var _y = wrapValue(y + offset, height);
                        expected = values[_y * width + _x];
                    }
                    var i = y * width + x;
                    if (Math.abs((expected - filtered[i]) / expected) > tol) {
                        supported = false;
                        break;
                    }
                }
            }
            results.filterWrapSupport[key] = supported;
            // Clear out allocated memory.
            gl.deleteProgram(program);
        }
        else {
            results.filterWrapSupport[key] = false;
        }
        // Clear out allocated memory.
        // vertexShader belongs to composer, don't delete it.
        gl.deleteShader(fragmentShader);
    }
    else {
        results.filterWrapSupport[key] = false;
    }
    // Clear out allocated memory.
    output.dispose();
    gl.deleteTexture(texture);
    return results.filterWrapSupport[key];
}
exports.testFilterWrap = testFilterWrap;
/**
 * Get the GL type to use internally in GPULayer, based on browser support.
 * @private
 * Exported here for testing purposes.
 */
GPULayer_1.GPULayer.getGPULayerInternalType = function (params) {
    var composer = params.composer, name = params.name;
    var _errorCallback = composer._errorCallback, isWebGL2 = composer.isWebGL2;
    var type = params.type;
    var internalType = type;
    // Check if int types are supported.
    var intCast = shouldCastIntTypeAsFloat(composer, type);
    if (intCast) {
        if (internalType === constants_1.UNSIGNED_BYTE || internalType === constants_1.BYTE) {
            // Integers between -2048 and +2048 can be exactly represented by half float.
            internalType = constants_1.HALF_FLOAT;
        }
        else {
            // Integers between 0 and 16777216 can be exactly represented by float32 (also applies for negative integers between −16777216 and 0)
            // This is sufficient for UNSIGNED_SHORT and SHORT types.
            // Large UNSIGNED_INT and INT cannot be represented by FLOAT type.
            console.warn("Falling back ".concat(internalType, " type to FLOAT type for glsl1.x support for GPULayer \"").concat(name, "\".\nLarge UNSIGNED_INT or INT with absolute value > 16,777,216 are not supported, on mobile UNSIGNED_INT, INT, UNSIGNED_SHORT, and SHORT with absolute value > 2,048 may not be supported."));
            internalType = constants_1.FLOAT;
        }
    }
    // Check if float textures supported.
    if (!isWebGL2) {
        if (internalType === constants_1.FLOAT) {
            // The OES_texture_float extension implicitly enables WEBGL_color_buffer_float extension (for writing).
            var extension = (0, extensions_1.getExtension)(composer, extensions_1.OES_TEXTURE_FLOAT, true);
            if (extension) {
                // https://stackoverflow.com/questions/17476632/webgl-extension-support-across-browsers
                // Rendering to a floating-point texture may not be supported, even if the OES_texture_float extension
                // is supported. Typically, this fails on mobile hardware. To check if this is supported, you have to
                // call the WebGL checkFramebufferStatus() function after attempting to attach texture to framebuffer.
                var valid = testWriteSupport(composer, internalType);
                if (!valid) {
                    console.warn("FLOAT not supported for writing operations in this browser, falling back to HALF_FLOAT type for GPULayer \"".concat(name, "\"."));
                    internalType = constants_1.HALF_FLOAT;
                }
            }
            else {
                console.warn("FLOAT not supported in this browser, falling back to HALF_FLOAT type for GPULayer \"".concat(name, "\"."));
                internalType = constants_1.HALF_FLOAT;
            }
        }
        // Must support at least half float if using a float type.
        if (internalType === constants_1.HALF_FLOAT) {
            // The OES_texture_half_float extension implicitly enables EXT_color_buffer_half_float extension (for writing).
            (0, extensions_1.getExtension)(composer, extensions_1.OES_TEXTURE_HALF_FLOAT, true);
            // FYI, very old safari issues: https://stackoverflow.com/questions/54248633/cannot-create-half-float-oes-texture-from-uint16array-on-ipad
            var valid = testWriteSupport(composer, internalType);
            // May still be ok for read-only, but this will affect the ability to call getValues() and savePNG().
            // We'll let it pass for now.
            if (!valid) {
                console.warn("This browser does not support writing to HALF_FLOAT textures.");
                // _errorCallback(`This browser does not support writing to HALF_FLOAT textures.`);
            }
        }
    }
    else {
        // For writable webGL2 contexts, load EXT_color_buffer_float/EXT_color_buffer_half_float extension.
        if (internalType === constants_1.FLOAT) {
            var extension = (0, extensions_1.getExtension)(composer, extensions_1.EXT_COLOR_BUFFER_FLOAT, true);
            if (!extension) {
                console.warn("FLOAT not supported in this browser, falling back to HALF_FLOAT type for GPULayer \"".concat(name, "\"."));
                internalType = constants_1.HALF_FLOAT;
            }
            else {
                // Test attaching texture to framebuffer to be sure float writing is supported.
                var valid = testWriteSupport(composer, internalType);
                if (!valid) {
                    console.warn("FLOAT not supported for writing operations in this browser, falling back to HALF_FLOAT type for GPULayer \"".concat(name, "\"."));
                    internalType = constants_1.HALF_FLOAT;
                }
            }
        }
        if (internalType === constants_1.HALF_FLOAT) {
            // On WebGL 2, EXT_color_buffer_half_float is an alternative to using the EXT_color_buffer_float extension
            // on platforms that support 16-bit floating point render targets but not 32-bit floating point render targets.
            var halfFloatExt = (0, extensions_1.getExtension)(composer, extensions_1.EXT_COLOR_BUFFER_HALF_FLOAT, true);
            if (!halfFloatExt) {
                // Some versions of Firefox (e.g. Firefox v104 on Mac) do not support EXT_COLOR_BUFFER_HALF_FLOAT,
                // but EXT_COLOR_BUFFER_FLOAT will work instead.
                (0, extensions_1.getExtension)(composer, extensions_1.EXT_COLOR_BUFFER_FLOAT, true);
            }
            // Test attaching texture to framebuffer to be sure half float writing is supported.
            var valid = testWriteSupport(composer, internalType);
            // May still be ok for read-only, but this will affect the ability to call getValues() and savePNG().
            // We'll let it pass for now.
            if (!valid) {
                console.warn("This browser does not support writing to HALF_FLOAT textures.");
                _errorCallback("This browser does not support writing to HALF_FLOAT textures.");
            }
        }
    }
    return internalType;
};
/**
 * Min and max values for types.
 * @private
 */
function minMaxValuesForType(type) {
    // Get min and max values for int types.
    var min = -Infinity;
    var max = Infinity;
    switch (type) {
        case constants_1.UNSIGNED_BYTE:
            min = constants_1.MIN_UNSIGNED_BYTE;
            max = constants_1.MAX_UNSIGNED_BYTE;
            break;
        case constants_1.BYTE:
            min = constants_1.MIN_BYTE;
            max = constants_1.MAX_BYTE;
            break;
        case constants_1.UNSIGNED_SHORT:
            min = constants_1.MIN_UNSIGNED_SHORT;
            max = constants_1.MAX_UNSIGNED_SHORT;
            break;
        case constants_1.SHORT:
            min = constants_1.MIN_SHORT;
            max = constants_1.MAX_SHORT;
            break;
        case constants_1.UNSIGNED_INT:
            min = constants_1.MIN_UNSIGNED_INT;
            max = constants_1.MAX_UNSIGNED_INT;
            break;
        case constants_1.INT:
            min = constants_1.MIN_INT;
            max = constants_1.MAX_INT;
            break;
    }
    return {
        min: min,
        max: max,
    };
}
exports.minMaxValuesForType = minMaxValuesForType;
/**
 * Recasts typed array to match GPULayer.internalType.
 * @private
 */
GPULayer_1.GPULayer.validateGPULayerArray = function (array, layer) {
    var numComponents = layer.numComponents, width = layer.width, height = layer.height, name = layer.name;
    var glNumChannels = layer._glNumChannels;
    var internalType = layer._internalType;
    var length = layer.is1D() ? layer.length : null;
    // Check that data is correct length (user error).
    if (array.length !== width * height * numComponents) { // Either the correct length for WebGLTexture size
        if (!length || (length && array.length !== length * numComponents)) { // Of the correct length for 1D array.
            throw new Error("Invalid data length: ".concat(array.length, " for GPULayer \"").concat(name, "\" of ").concat(length ? "length ".concat(length, " and ") : '', "dimensions: [").concat(width, ", ").concat(height, "] and numComponents: ").concat(numComponents, "."));
        }
    }
    // Get array type to figure out if we need to type cast.
    // For webgl1.0 we may need to cast an int type to a FLOAT or HALF_FLOAT.
    var shouldTypeCast = false;
    switch (array.constructor) {
        case Array:
            shouldTypeCast = true;
            break;
        case Float32Array:
            shouldTypeCast = internalType !== constants_1.FLOAT;
            break;
        case Uint8Array:
            shouldTypeCast = internalType !== constants_1.UNSIGNED_BYTE;
            break;
        case Int8Array:
            shouldTypeCast = internalType !== constants_1.BYTE;
            break;
        case Uint16Array:
            // User may have converted to HALF_FLOAT already.
            // We need to add this check in case type is UNSIGNED_SHORT and internal type is HALF_FLOAT.
            // (This can happen for some WebGL1 contexts.)
            // if (type === HALF_FLOAT) {
            // 	shouldTypeCast = internalType !== HALF_FLOAT;
            // 	// In order to complete this, we will also need to handle converting from Uint16Array to some other type.
            // 	// Are there cases where HALF_FLOAT is not supported?
            // } else {
            shouldTypeCast = internalType !== constants_1.UNSIGNED_SHORT;
            // }
            break;
        case Int16Array:
            shouldTypeCast = internalType !== constants_1.SHORT;
            break;
        case Uint32Array:
            shouldTypeCast = internalType !== constants_1.UNSIGNED_INT;
            break;
        case Int32Array:
            shouldTypeCast = internalType !== constants_1.INT;
            break;
        default:
            throw new Error("Invalid array type: ".concat(array.constructor.name, " for GPULayer \"").concat(name, "\", please use one of [").concat(constants_1.validArrayTypes.map(function (constructor) { return constructor.name; }).join(', '), "]."));
    }
    // Get min and max values for internalType.
    var _a = minMaxValuesForType(internalType), min = _a.min, max = _a.max;
    // Then check if array needs to be lengthened.
    // This could be because glNumChannels !== numComponents or because length !== width * height.
    var arrayLength = width * height * glNumChannels;
    var shouldResize = array.length !== arrayLength;
    var validatedArray = array;
    if (shouldTypeCast || shouldResize) {
        validatedArray = GPULayer_1.GPULayer.initArrayForType(internalType, arrayLength);
        // Fill new data array with old data.
        // We have to handle the case of Float16 specially by converting data to Uint16Array.
        var view = (internalType === constants_1.HALF_FLOAT && shouldTypeCast) ? new DataView(validatedArray.buffer) : null;
        for (var i = 0, _len = array.length / numComponents; i < _len; i++) {
            for (var j = 0; j < numComponents; j++) {
                var origValue = array[i * numComponents + j];
                var value = origValue;
                var clipped = false;
                if (value < min) {
                    value = min;
                    clipped = true;
                }
                else if (value > max) {
                    value = max;
                    clipped = true;
                }
                if (clipped) {
                    console.warn("Clipping out of range value ".concat(origValue, " to ").concat(value, " for GPULayer \"").concat(name, "\" with internal type ").concat(internalType, "."));
                }
                var index = i * glNumChannels + j;
                if (view) {
                    (0, float16_1.setFloat16)(view, 2 * index, value, true);
                }
                else {
                    validatedArray[index] = value;
                }
            }
        }
    }
    return validatedArray;
};


/***/ }),

/***/ 664:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GPUProgram = void 0;
var constants_1 = __webpack_require__(601);
var utils_1 = __webpack_require__(593);
var polyfills_1 = __webpack_require__(360);
var type_checks_1 = __webpack_require__(566);
var checks_1 = __webpack_require__(707);
var GPUProgram = /** @class */ (function () {
    /**
     * Create a GPUProgram.
     * @param composer - The current GPUComposer instance.
     * @param params - GPUProgram parameters.
     * @param params.name - Name of GPUProgram, used for error logging.
     * @param params.fragmentShader - Fragment shader source or array of sources to be joined.
     * @param params.uniforms - Array of uniforms to initialize with GPUProgram.  More uniforms can be added later with GPUProgram.setUniform().
     * @param params.compileTimeConstants - Compile time #define constants to include with fragment shader.
     */
    function GPUProgram(composer, params) {
        var _this = this;
        // Compiled fragment shaders (we hang onto different versions depending on compile time constants).
        this._fragmentShaders = {};
        // #define variables for fragment shader program.
        this._compileTimeConstants = {};
        // Uniform locations, values, and types.
        this._uniforms = {};
        // Store WebGLProgram's - we need to compile several WebGLPrograms of GPUProgram.fragmentShader + various vertex shaders.
        // Each combination of vertex + fragment shader requires a separate WebGLProgram.
        // These programs are compiled on the fly as needed.
        this._programs = {};
        // Reverse lookup for above.
        this._programsKeyLookup = new WeakMap();
        // Store the index of input sampler2D in input array.
        this._samplerUniformsIndices = [];
        // Check constructor parameters.
        var name = (params || {}).name;
        if (!composer) {
            throw new Error("Error initing GPUProgram \"".concat(name, "\": must pass GPUComposer instance to GPUProgram(composer, params)."));
        }
        if (!params) {
            throw new Error("Error initing GPUProgram: must pass params to GPUProgram(composer, params).");
        }
        if (!(0, type_checks_1.isObject)(params)) {
            throw new Error("Error initing GPUProgram: must pass valid params object to GPUProgram(composer, params), got ".concat(JSON.stringify(params), "."));
        }
        // Check params keys.
        var validKeys = ['name', 'fragmentShader', 'uniforms', 'compileTimeConstants'];
        var requiredKeys = ['name', 'fragmentShader'];
        var keys = Object.keys(params);
        (0, checks_1.checkValidKeys)(keys, validKeys, 'GPUProgram(composer, params)', params.name);
        (0, checks_1.checkRequiredKeys)(keys, requiredKeys, 'GPUProgram(composer, params)', params.name);
        var fragmentShader = params.fragmentShader, uniforms = params.uniforms, compileTimeConstants = params.compileTimeConstants;
        // Save arguments.
        this._composer = composer;
        this.name = name;
        // Preprocess fragment shader source.
        var fragmentShaderSource = (0, type_checks_1.isString)(fragmentShader) ?
            fragmentShader :
            fragmentShader.join('\n');
        var _a = (0, utils_1.preprocessFragmentShader)(fragmentShaderSource, composer.glslVersion, name), shaderSource = _a.shaderSource, samplerUniforms = _a.samplerUniforms, additionalSources = _a.additionalSources;
        this._fragmentShaderSource = shaderSource;
        samplerUniforms.forEach(function (name, i) {
            _this._samplerUniformsIndices.push({
                name: name,
                inputIndex: 0,
                shaderIndex: i,
            });
        });
        if (this.constructor === GPUProgram) { // This is not a child program.
            if (additionalSources) {
                this._childPrograms = [];
                for (var i = 0, numChildren = additionalSources.length; i < numChildren; i++) {
                    this._childPrograms.push(new GPUProgramChild(composer, params, { fragmentShaderSource: additionalSources[i] }));
                }
            }
        }
        // Save compile time constants.
        if (compileTimeConstants) {
            this._compileTimeConstants = __assign({}, compileTimeConstants);
        }
        // Set program uniforms.
        if (uniforms) {
            for (var i = 0; i < uniforms.length; i++) {
                var _b = uniforms[i], name_1 = _b.name, value = _b.value, type = _b.type;
                this.setUniform(name_1, value, type);
            }
        }
    }
    /**
     * Force compilation of GPUProgram with new compileTimeConstants.
     * @param compileTimeConstants - Compile time #define constants to include with fragment shader.
     */
    GPUProgram.prototype.recompile = function (compileTimeConstants) {
        var _compileTimeConstants = this._compileTimeConstants;
        // Check if we have changed the compile-time constants.
        // compileTimeConstants may be a partial list.
        var needsRecompile = false;
        Object.keys(compileTimeConstants).forEach(function (key) {
            if (_compileTimeConstants[key] !== compileTimeConstants[key]) {
                needsRecompile = true;
                _compileTimeConstants[key] = compileTimeConstants[key];
            }
        });
        if (!needsRecompile)
            return;
        var _a = this, _fragmentShaders = _a._fragmentShaders, _programs = _a._programs, _programsKeyLookup = _a._programsKeyLookup, _composer = _a._composer, _uniforms = _a._uniforms;
        var gl = _composer.gl;
        // Delete cached compiled shaders and programs.
        var programKeys = Object.keys(_programs);
        for (var i = 0, numPrograms = programKeys.length; i < numPrograms; i++) {
            var key = programKeys[i];
            var program = _programs[key];
            gl.deleteProgram(program);
            _programsKeyLookup.delete(program);
            delete _programs[key];
        }
        var fragmentShaderKeys = Object.keys(_fragmentShaders);
        for (var i = 0, numFragmentShaders = fragmentShaderKeys.length; i < numFragmentShaders; i++) {
            var key = fragmentShaderKeys[i];
            gl.deleteShader(_fragmentShaders[key]);
            delete _fragmentShaders[key];
        }
        // Delete all cached uniform locations.
        var uniforms = Object.values(_uniforms);
        for (var i = 0, numUniforms = uniforms.length; i < numUniforms; i++) {
            uniforms[i].location = new WeakMap();
        }
        if (this._childPrograms) {
            for (var i = 0, numChildren = this._childPrograms.length; i < numChildren; i++) {
                this._childPrograms[i].recompile(compileTimeConstants);
            }
        }
    };
    /**
     * Get fragment shader for GPUProgram, compile new one if needed.
     * Used internally.
     * @private
     */
    GPUProgram.prototype._getFragmentShader = function (fragmentId, internalCompileTimeConstants) {
        var _fragmentShaders = this._fragmentShaders;
        if (_fragmentShaders[fragmentId]) {
            // No need to recompile.
            return _fragmentShaders[fragmentId];
        }
        var _a = this, _composer = _a._composer, name = _a.name, _fragmentShaderSource = _a._fragmentShaderSource, _compileTimeConstants = _a._compileTimeConstants;
        var gl = _composer.gl, _errorCallback = _composer._errorCallback, verboseLogging = _composer.verboseLogging, glslVersion = _composer.glslVersion, floatPrecision = _composer.floatPrecision, intPrecision = _composer.intPrecision;
        // Update compile time constants.
        var keys = Object.keys(internalCompileTimeConstants);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            _compileTimeConstants[key] = internalCompileTimeConstants[key];
        }
        if (verboseLogging)
            console.log("Compiling fragment shader for GPUProgram \"".concat(name, "\" with compile time constants: ").concat(JSON.stringify(_compileTimeConstants)));
        var shader = (0, utils_1.compileShader)(gl, glslVersion, intPrecision, floatPrecision, _fragmentShaderSource, gl.FRAGMENT_SHADER, name, _errorCallback, _compileTimeConstants, Object.keys(_fragmentShaders).length === 0);
        if (!shader) {
            _errorCallback("Unable to compile fragment shader for GPUProgram \"".concat(name, "\"."));
            return;
        }
        _fragmentShaders[fragmentId] = shader;
        return _fragmentShaders[fragmentId];
    };
    /**
     * Get GLProgram associated with a specific vertex shader.
     * @private
     */
    GPUProgram.prototype._getProgramWithName = function (name, vertexCompileConstants, input) {
        var _a = this, _samplerUniformsIndices = _a._samplerUniformsIndices, _composer = _a._composer;
        var fragmentID = '';
        var fragmentCompileConstants = {};
        for (var i = 0, length_1 = _samplerUniformsIndices.length; i < length_1; i++) {
            var inputIndex = _samplerUniformsIndices[i].inputIndex;
            var layer = input[inputIndex].layer;
            var filter = layer.filter, wrapX = layer.wrapX, wrapY = layer.wrapY, type = layer.type, _internalFilter = layer._internalFilter, _internalWrapX = layer._internalWrapX, _internalWrapY = layer._internalWrapY;
            var wrapXVal = wrapX === _internalWrapX ? 0 : (wrapX === constants_1.REPEAT ? 1 : 0);
            var wrapYVal = wrapY === _internalWrapY ? 0 : (wrapY === constants_1.REPEAT ? 1 : 0);
            var filterVal = filter === _internalFilter ? 0 : (filter === constants_1.LINEAR ? 1 : 0);
            fragmentID += "_IN".concat(i, "_").concat(wrapXVal, "_").concat(wrapYVal, "_").concat(filterVal);
            fragmentCompileConstants["".concat(polyfills_1.SAMPLER2D_WRAP_X).concat(i)] = "".concat(wrapXVal);
            fragmentCompileConstants["".concat(polyfills_1.SAMPLER2D_WRAP_Y).concat(i)] = "".concat(wrapYVal);
            fragmentCompileConstants["".concat(polyfills_1.SAMPLER2D_FILTER).concat(i)] = "".concat(filterVal);
            if (_composer.glslVersion === constants_1.GLSL1 && (0, utils_1.isIntType)(type)) {
                fragmentCompileConstants["".concat(polyfills_1.SAMPLER2D_CAST_INT).concat(i)] = '1';
            }
        }
        var vertexID = Object.keys(vertexCompileConstants).map(function (key) { return "_".concat(key, "_").concat(vertexCompileConstants[key]); }).join();
        var key = "".concat(name).concat(vertexID).concat(fragmentID);
        // Check if we've already compiled program.
        if (this._programs[key])
            return this._programs[key];
        // Otherwise, we need to compile a new program on the fly.
        var _b = this, _uniforms = _b._uniforms, _programs = _b._programs, _programsKeyLookup = _b._programsKeyLookup;
        var gl = _composer.gl, _errorCallback = _composer._errorCallback;
        var vertexShader = _composer._getVertexShader(name, vertexID, vertexCompileConstants, this.name);
        if (vertexShader === undefined) {
            _errorCallback("Unable to init vertex shader \"".concat(name).concat(vertexID, "\" for GPUProgram \"").concat(this.name, "\"."));
            return;
        }
        var fragmentShader = this._getFragmentShader(fragmentID, fragmentCompileConstants);
        if (fragmentShader === undefined) {
            _errorCallback("Unable to init fragment shader \"".concat(fragmentID, "\" for GPUProgram \"").concat(this.name, "\"."));
            return;
        }
        var program = (0, utils_1.initGLProgram)(gl, vertexShader, fragmentShader, this.name, _errorCallback);
        if (program === undefined) {
            gl.deleteShader(fragmentShader);
            _errorCallback("Unable to init program \"".concat(key, "\" for GPUProgram \"").concat(this.name, "\"."));
            return;
        }
        // If we have any uniforms set for this GPUProgram, add those to WebGLProgram we just inited.
        // Set active program.
        gl.useProgram(program);
        var uniformNames = Object.keys(_uniforms);
        for (var i = 0, numUniforms = uniformNames.length; i < numUniforms; i++) {
            var uniformName = uniformNames[i];
            var uniform = _uniforms[uniformName];
            var value = uniform.value, type = uniform.type;
            this._setProgramUniform(program, uniformName, value, type);
        }
        _programs[key] = program;
        _programsKeyLookup.set(program, key);
        return program;
    };
    /**
     * Set uniform for GLProgram.
     * @private
     */
    GPUProgram.prototype._setProgramUniform = function (program, uniformName, value, type) {
        var _a;
        var _b = this, _composer = _b._composer, _uniforms = _b._uniforms;
        var gl = _composer.gl, _errorCallback = _composer._errorCallback, glslVersion = _composer.glslVersion;
        // We have already set gl.useProgram(program) outside this function.
        var isGLSL3 = glslVersion === constants_1.GLSL3;
        var location = (_a = _uniforms[uniformName]) === null || _a === void 0 ? void 0 : _a.location.get(program);
        // Init a location for WebGLProgram if needed (only do this once).
        if (location === undefined) {
            var _location = gl.getUniformLocation(program, uniformName);
            if (_location === null) {
                console.warn("Could not init uniform \"".concat(uniformName, "\" for program \"").concat(this.name, "\". Check that uniform is present in shader code, unused uniforms may be removed by compiler. Also check that uniform type in shader code matches type ").concat(type, ". Error code: ").concat(gl.getError(), "."));
                return;
            }
            location = _location;
            // Save location for future use.
            if (_uniforms[uniformName]) {
                _uniforms[uniformName].location.set(program, location);
            }
            // Since this is the first time we are initing the uniform, check that type is correct.
            // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getUniform
            var uniform = gl.getUniform(program, location);
            var badType = false;
            if (type === constants_1.BOOL_1D_UNIFORM || type === constants_1.BOOL_2D_UNIFORM || type === constants_1.BOOL_3D_UNIFORM || type === constants_1.BOOL_4D_UNIFORM) {
                if (!(0, type_checks_1.isBoolean)(uniform) && uniform.constructor !== Array) {
                    badType = true;
                }
            }
            else if (type === constants_1.FLOAT_1D_UNIFORM || type === constants_1.FLOAT_2D_UNIFORM || type === constants_1.FLOAT_3D_UNIFORM || type === constants_1.FLOAT_4D_UNIFORM) {
                if (!(0, type_checks_1.isFiniteNumber)(uniform) && uniform.constructor !== Float32Array) {
                    badType = true;
                }
            }
            else if (type === constants_1.INT_1D_UNIFORM || type === constants_1.INT_2D_UNIFORM || type === constants_1.INT_3D_UNIFORM || type === constants_1.INT_4D_UNIFORM) {
                if (!(0, type_checks_1.isInteger)(uniform) && uniform.constructor !== Int32Array) {
                    badType = true;
                }
            }
            else if (type === constants_1.UINT_1D_UNIFORM || type === constants_1.UINT_2D_UNIFORM || type === constants_1.UINT_3D_UNIFORM || type === constants_1.UINT_4D_UNIFORM) {
                if (!isGLSL3) {
                    // GLSL1 does not have uint type, expect int instead.
                    if (!(0, type_checks_1.isNonNegativeInteger)(uniform) && uniform.constructor !== Int32Array) {
                        badType = true;
                    }
                }
                else if (!(0, type_checks_1.isNonNegativeInteger)(uniform) && uniform.constructor !== Uint32Array) {
                    badType = true;
                }
            }
            if (badType) {
                _errorCallback("Invalid uniform \"".concat(uniformName, "\" for program \"").concat(this.name, "\". Check that uniform type in shader code matches type ").concat(type, ", gl.getUniform(program, location) returned type: ").concat(uniform.constructor.name, "."));
                return;
            }
        }
        // Set uniform.
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/uniform
        switch (type) {
            // We are setting boolean uniforms with uniform[1234]i.
            // This suggest floats work as well, but ints seem more natural:
            // https://github.com/KhronosGroup/WebGL/blob/main/sdk/tests/conformance/uniforms/gl-uniform-bool.html
            case constants_1.BOOL_1D_UNIFORM:
                gl.uniform1i(location, value ? 1 : 0);
                break;
            case constants_1.BOOL_2D_UNIFORM:
                gl.uniform2i(location, value[0] ? 1 : 0, value[1] ? 1 : 0);
                break;
            case constants_1.BOOL_3D_UNIFORM:
                gl.uniform3i(location, value[0] ? 1 : 0, value[1] ? 1 : 0, value[2] ? 1 : 0);
                break;
            case constants_1.BOOL_4D_UNIFORM:
                gl.uniform4i(location, value[0] ? 1 : 0, value[1] ? 1 : 0, value[2] ? 1 : 0, value[3] ? 1 : 0);
                break;
            case constants_1.FLOAT_1D_UNIFORM:
                gl.uniform1f(location, value);
                break;
            case constants_1.FLOAT_2D_UNIFORM:
                gl.uniform2fv(location, value);
                break;
            case constants_1.FLOAT_3D_UNIFORM:
                gl.uniform3fv(location, value);
                break;
            case constants_1.FLOAT_4D_UNIFORM:
                gl.uniform4fv(location, value);
                break;
            case constants_1.INT_1D_UNIFORM:
                gl.uniform1i(location, value);
                break;
            case constants_1.INT_2D_UNIFORM:
                gl.uniform2iv(location, value);
                break;
            case constants_1.INT_3D_UNIFORM:
                gl.uniform3iv(location, value);
                break;
            case constants_1.INT_4D_UNIFORM:
                gl.uniform4iv(location, value);
                break;
            // Uint not supported in GLSL1, use int instead.
            case constants_1.UINT_1D_UNIFORM:
                if (isGLSL3)
                    gl.uniform1ui(location, value);
                else
                    gl.uniform1i(location, value);
                break;
            case constants_1.UINT_2D_UNIFORM:
                if (isGLSL3)
                    gl.uniform2uiv(location, value);
                else
                    gl.uniform2iv(location, value);
                break;
            case constants_1.UINT_3D_UNIFORM:
                if (isGLSL3)
                    gl.uniform3uiv(location, value);
                else
                    gl.uniform3iv(location, value);
                break;
            case constants_1.UINT_4D_UNIFORM:
                if (isGLSL3)
                    gl.uniform4uiv(location, value);
                else
                    gl.uniform4iv(location, value);
                break;
            default:
                throw new Error("Unknown uniform type ".concat(type, " for GPUProgram \"").concat(this.name, "\"."));
        }
    };
    /**
     * Cache uniform value and return whether the value has changed.
     * @private
     */
    GPUProgram.prototype._cacheUniformValue = function (name, value, type) {
        var _uniforms = this._uniforms;
        // Cache uniform values.
        var uniform = _uniforms[name];
        if (!uniform) {
            // Init uniform if needed.
            _uniforms[name] = { location: new WeakMap(), value: (0, type_checks_1.isArray)(value) ? value.slice() : value, type: type };
            return true;
        }
        var oldValue = uniform.value;
        // Update value with a deep copy of input.
        uniform.value = (0, type_checks_1.isArray)(value) ? value.slice() : value;
        // Deep check if value has changed.
        if ((0, type_checks_1.isArray)(value)) {
            for (var i = 0, length_2 = value.length; i < length_2; i++) {
                if (value[i] !== oldValue[i]) {
                    return true;
                }
            }
            return false; // No change.
        }
        return value !== oldValue;
    };
    /**
     * Set fragment shader uniform for GPUProgram.
     * @param name - Uniform name as it appears in fragment shader.
     * @param value - Uniform value.
     */
    GPUProgram.prototype.setUniform = function (name, value, type) {
        var _a;
        var _b = this, _programs = _b._programs, _uniforms = _b._uniforms, _composer = _b._composer, _samplerUniformsIndices = _b._samplerUniformsIndices;
        var verboseLogging = _composer.verboseLogging, gl = _composer.gl;
        // Check that length of value is correct.
        if ((0, type_checks_1.isArray)(value)) {
            var length_3 = value.length;
            if (length_3 > 4)
                throw new Error("Invalid uniform value: [".concat(value.join(', '), "] passed to GPUProgram \"").concat(this.name, ", uniforms must be of type number[] with length <= 4, number, or boolean.\""));
        }
        // Get uniform internal type.
        var currentType = (_a = _uniforms[name]) === null || _a === void 0 ? void 0 : _a.type;
        if (type) {
            var internalType = (0, utils_1.uniformInternalTypeForValue)(value, type, name, this.name);
            if (currentType === undefined)
                currentType = internalType;
            else {
                // console.warn(`Don't need to pass in type to GPUProgram.setUniform for previously inited uniform "${uniformName}"`);
                // Check that types match previously set uniform.
                if (currentType !== internalType) {
                    throw new Error("Uniform \"".concat(name, "\" for GPUProgram \"").concat(this.name, "\" cannot change from type ").concat(currentType, " to type ").concat(internalType, "."));
                }
            }
        }
        if (currentType === undefined) {
            throw new Error("Unknown type for uniform \"".concat(name, "\", please pass in type to GPUProgram.setUniform(name, value, type) when initing a new uniform."));
        }
        var changed = this._cacheUniformValue(name, value, currentType);
        if (!changed)
            return;
        // TODO: look at this.
        var samplerUniform = _samplerUniformsIndices.find(function (uniform) { return uniform.name === name; });
        if (samplerUniform && (0, type_checks_1.isInteger)(value)) {
            samplerUniform.inputIndex = value;
        }
        if (verboseLogging)
            console.log("Setting uniform \"".concat(name, "\" for program \"").concat(this.name, "\" to value ").concat(JSON.stringify(value), "."));
        // Update any active programs.
        var programNames = Object.keys(_programs);
        for (var i = 0, numPrograms = programNames.length; i < numPrograms; i++) {
            var programName = programNames[i];
            // Set active program.
            var program = _programs[programName];
            gl.useProgram(program);
            this._setProgramUniform(program, name, value, currentType);
        }
        // this code is only executed in cases where we have a shader program with multiple outputs in a WebGL1 context.
        // Notify all child programs of the setUniform.
        if (this._childPrograms) {
            for (var i = 0, numChildren = this._childPrograms.length; i < numChildren; i++) {
                this._childPrograms[i].setUniform(name, value, type);
            }
        }
    };
    ;
    /**
     * Set internal fragment shader uniforms for GPUProgram.
     * @private
     */
    GPUProgram.prototype._setInternalFragmentUniforms = function (program, input) {
        if (input.length === 0)
            return;
        if (!program) {
            throw new Error('Must pass in valid WebGLProgram to GPUProgram._setInternalFragmentUniforms, got undefined.');
        }
        var _a = this, _programsKeyLookup = _a._programsKeyLookup, _samplerUniformsIndices = _a._samplerUniformsIndices;
        var programName = _programsKeyLookup.get(program);
        if (!programName) {
            throw new Error("Could not find valid programName for WebGLProgram in GPUProgram \"".concat(this.name, "\"."));
        }
        var indexLookup = new Array(_samplerUniformsIndices.length).fill(-1);
        for (var i = 0, length_4 = _samplerUniformsIndices.length; i < length_4; i++) {
            var _b = _samplerUniformsIndices[i], inputIndex = _b.inputIndex, shaderIndex = _b.shaderIndex;
            if (indexLookup[inputIndex] >= 0) {
                // There is an index collision, this should not happen.
                console.warn("Found > 1 sampler2D uniforms at texture index ".concat(inputIndex, " for GPUProgram \"").concat(this.name, "\"."));
            }
            else {
                indexLookup[inputIndex] = shaderIndex;
            }
        }
        for (var i = 0, length_5 = input.length; i < length_5; i++) {
            var layer = input[i].layer;
            var width = layer.width, height = layer.height;
            var index = indexLookup[i];
            if (index < 0)
                continue;
            var filter = layer.filter, wrapX = layer.wrapX, wrapY = layer.wrapY, _internalFilter = layer._internalFilter, _internalWrapX = layer._internalWrapX, _internalWrapY = layer._internalWrapY;
            var filterMismatch = filter !== _internalFilter;
            if (filterMismatch || wrapX !== _internalWrapX || wrapY !== _internalWrapY) {
                var halfPxSize = [0.5 / width, 0.5 / height];
                var halfPxUniform = "".concat(polyfills_1.SAMPLER2D_HALF_PX_UNIFORM).concat(index);
                var halfPxUniformChanged = this._cacheUniformValue(halfPxUniform, halfPxSize, constants_1.FLOAT_2D_UNIFORM);
                if (halfPxUniformChanged) {
                    this._setProgramUniform(program, halfPxUniform, halfPxSize, constants_1.FLOAT_2D_UNIFORM);
                }
                if (filterMismatch) {
                    var dimensions = [width, height];
                    var dimensionsUniform = "".concat(polyfills_1.SAMPLER2D_DIMENSIONS_UNIFORM).concat(index);
                    var dimensionsUniformChanged = this._cacheUniformValue(dimensionsUniform, dimensions, constants_1.FLOAT_2D_UNIFORM);
                    if (dimensionsUniformChanged) {
                        this._setProgramUniform(program, dimensionsUniform, dimensions, constants_1.FLOAT_2D_UNIFORM);
                    }
                }
            }
        }
    };
    /**
     * Set vertex shader uniform for GPUProgram.
     * @private
     */
    GPUProgram.prototype._setVertexUniform = function (program, uniformName, value, type) {
        if (!program) {
            throw new Error('Must pass in valid WebGLProgram to GPUProgram._setVertexUniform, got undefined.');
        }
        var _programsKeyLookup = this._programsKeyLookup;
        var programName = _programsKeyLookup.get(program);
        if (!programName) {
            throw new Error("Could not find valid programName for WebGLProgram in GPUProgram \"".concat(this.name, "\"."));
        }
        var internalType = (0, utils_1.uniformInternalTypeForValue)(value, type, uniformName, this.name);
        var changed = this._cacheUniformValue(uniformName, value, internalType);
        if (changed)
            this._setProgramUniform(program, uniformName, value, internalType);
    };
    /**
     * Deallocate GPUProgram instance and associated WebGL properties.
     */
    GPUProgram.prototype.dispose = function () {
        var _a = this, _composer = _a._composer, _fragmentShaders = _a._fragmentShaders, _programs = _a._programs, _programsKeyLookup = _a._programsKeyLookup;
        var gl = _composer.gl, verboseLogging = _composer.verboseLogging;
        if (verboseLogging)
            console.log("Deallocating GPUProgram \"".concat(this.name, "\"."));
        if (!gl)
            throw new Error("Must call dispose() on all GPUPrograms before calling dispose() on GPUComposer.");
        // Unbind all gl data before deleting.
        Object.values(_programs).forEach(function (program) {
            if (program) {
                gl.deleteProgram(program);
                _programsKeyLookup.delete(program);
            }
        });
        Object.keys(_programs).forEach(function (key) {
            delete _programs[key];
        });
        // Delete fragment shaders.
        Object.values(_fragmentShaders).forEach(function (shader) {
            gl.deleteShader(shader);
        });
        Object.keys(_fragmentShaders).forEach(function (key) {
            delete _fragmentShaders[key];
        });
        if (this._childPrograms) {
            for (var i = 0, numChildren = this._childPrograms.length; i < numChildren; i++) {
                this._childPrograms[i].dispose();
            }
            this._childPrograms.length;
        }
        delete this._childPrograms;
        // Vertex shaders are owned by GPUComposer and shared across many GPUPrograms.
        // Delete all references.
        // @ts-ignore
        delete this._composer;
        // @ts-ignore
        delete this.name;
        // @ts-ignore
        delete this._fragmentShaderSource;
        // @ts-ignore
        delete this._compileTimeConstants;
        // @ts-ignore
        delete this._uniforms;
        // @ts-ignore
        delete this._programs;
        // @ts-ignore
        delete this._programsKeyLookup;
        // @ts-ignore
        delete this._fragmentShaders;
        // @ts-ignore
        delete this._samplerUniformsIndices;
    };
    return GPUProgram;
}());
exports.GPUProgram = GPUProgram;
var GPUProgramChild = /** @class */ (function (_super) {
    __extends(GPUProgramChild, _super);
    function GPUProgramChild(composer, params, _gpuio_child_params) {
        var _this = _super.call(this, composer, params) || this;
        var fragmentShaderSource = _gpuio_child_params.fragmentShaderSource;
        // fragmentShader has already been pre-processed.
        _this._fragmentShaderSource = fragmentShaderSource;
        return _this;
    }
    return GPUProgramChild;
}(GPUProgram));


/***/ }),

/***/ 579:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.wrappedLineColorProgram = exports.renderSignedAmplitudeProgram = exports.renderAmplitudeProgram = exports.zeroProgram = exports.setColorProgram = exports.setValueProgram = exports.multiplyValueProgram = exports.addValueProgram = exports.addLayersProgram = exports.copyProgram = void 0;
var type_checks_1 = __webpack_require__(566);
var constants_1 = __webpack_require__(601);
var conversions_1 = __webpack_require__(690);
var GPUProgram_1 = __webpack_require__(664);
/**
 * Init GPUProgram to copy contents of one GPULayer to another GPULayer.
 * @category GPUProgram Helper
 * @param composer - The current GPUComposer.
 * @param params - Program parameters.
 * @param params.type - The type of the input/output.
 * @param params.name - Optionally pass in a GPUProgram name, used for error logging.
 * @param params.precision - Optionally specify the precision of the input/output.
 * @returns
 */
function copyProgram(composer, params) {
    var type = params.type;
    var precision = params.precision || '';
    var glslType = (0, conversions_1.glslTypeForType)(type, 4);
    var name = params.name || "copy_".concat((0, conversions_1.uniformTypeForType)(type, composer.glslVersion), "_layer");
    return new GPUProgram_1.GPUProgram(composer, {
        name: name,
        fragmentShader: "\nin vec2 v_uv;\nuniform ".concat(precision, " ").concat((0, conversions_1.glslPrefixForType)(type), "sampler2D u_state;\nout ").concat(precision, " ").concat(glslType, " out_result;\nvoid main() {\n\tout_result = texture(u_state, v_uv);\n}"),
        uniforms: [
            {
                name: 'u_state',
                value: 0,
                type: constants_1.INT,
            },
        ],
    });
}
exports.copyProgram = copyProgram;
/**
 * Init GPUProgram to add several GPULayers together.
 * @category GPUProgram Helper
 * @param composer - The current GPUComposer.
 * @param params - Program parameters.
 * @param params.type - The type of the inputs/output.
 * @param params.components - Component(s) of inputs to add, defaults to 'xyzw.
 * @param params.name - Optionally pass in a GPUProgram name, used for error logging.
 * @param params.numInputs - The number of inputs to add together, defaults to 2.
 * @param params.precision - Optionally specify the precision of the inputs/output.
 * @returns
 */
function addLayersProgram(composer, params) {
    var type = params.type;
    var numInputs = params.numInputs || 2;
    var precision = params.precision || '';
    var components = params.components || 'xyzw';
    var glslType = (0, conversions_1.glslTypeForType)(type, components.length);
    var arrayOfLengthNumInputs = new Array(numInputs);
    var name = params.name || "".concat(numInputs, "-way_add_").concat((0, conversions_1.uniformTypeForType)(type, composer.glslVersion), "_").concat(components);
    return new GPUProgram_1.GPUProgram(composer, {
        name: name,
        fragmentShader: "\nin vec2 v_uv;\n".concat(arrayOfLengthNumInputs.map(function (el, i) { return "uniform ".concat(precision, " ").concat((0, conversions_1.glslPrefixForType)(type), "sampler2D u_state").concat(i, ";"); }).join('\n'), "\nout ").concat(precision, " ").concat(glslType, " out_result;\nvoid main() {\n\tout_result = ").concat(arrayOfLengthNumInputs.map(function (el, i) { return "texture(u_state".concat(i, ", v_uv).").concat(components); }).join(' + '), ";\n}"),
        uniforms: arrayOfLengthNumInputs.map(function (el, i) {
            return {
                name: "u_state".concat(i),
                value: i,
                type: constants_1.INT,
            };
        }),
    });
}
exports.addLayersProgram = addLayersProgram;
/**
 * Init GPUProgram to add uniform "u_value" to a GPULayer.
 * @category GPUProgram Helper
 * @param composer - The current GPUComposer.
 * @param params - Program parameters.
 * @param params.type - The type of the input/output (we assume "u_value" has the same type).
 * @param params.value - Initial value to add, if value has length 1 it will be applied to all components of GPULayer.  Change this later using uniform "u_value".
 * @param params.name - Optionally pass in a GPUProgram name, used for error logging.
 * @param params.precision - Optionally specify the precision of the input/output/"u_value".
 * @returns
 */
function addValueProgram(composer, params) {
    var type = params.type, value = params.value;
    var precision = params.precision || '';
    var valueLength = (0, type_checks_1.isArray)(value) ? value.length : 1;
    var valueType = (0, conversions_1.glslTypeForType)(type, valueLength);
    var numComponents = valueLength === 1 ? 4 : valueLength;
    var outputType = (0, conversions_1.glslTypeForType)(type, numComponents);
    var componentSelection = (0, conversions_1.glslComponentSelectionForNumComponents)(numComponents);
    var name = params.name || "addValue_".concat(valueType, "_w_length_").concat(valueLength);
    return new GPUProgram_1.GPUProgram(composer, {
        name: name,
        fragmentShader: "\nin vec2 v_uv;\nuniform ".concat(precision, " ").concat(valueType, " u_value;\nuniform ").concat(precision, " ").concat((0, conversions_1.glslPrefixForType)(type), "sampler2D u_state;\nout ").concat(precision, " ").concat(outputType, " out_result;\nvoid main() {\n\tout_result = ").concat(valueType !== outputType ? outputType : '', "(u_value) + texture(u_state, v_uv)").concat(componentSelection, ";\n}"),
        uniforms: [
            {
                name: 'u_state',
                value: 0,
                type: constants_1.INT,
            },
            {
                name: 'u_value',
                value: value,
                type: (0, conversions_1.uniformTypeForType)(type, composer.glslVersion),
            },
        ],
    });
}
exports.addValueProgram = addValueProgram;
/**
 * Init GPUProgram to multiply uniform "u_value" to a GPULayer.
 * @category GPUProgram Helper
 * @param composer - The current GPUComposer.
 * @param params - Program parameters.
 * @param params.type - The type of the input/output (we assume "u_value" has the same type).
 * @param params.value - Initial value to multiply, if value has length 1 it will be applied to all components of GPULayer.  Change this later using uniform "u_value".
 * @param params.name - Optionally pass in a GPUProgram name, used for error logging.
 * @param params.precision - Optionally specify the precision of the input/output/"u_value".
 * @returns
 */
function multiplyValueProgram(composer, params) {
    var type = params.type, value = params.value;
    var precision = params.precision || '';
    var valueLength = (0, type_checks_1.isArray)(value) ? value.length : 1;
    var valueType = (0, conversions_1.glslTypeForType)(type, valueLength);
    var numComponents = valueLength === 1 ? 4 : valueLength;
    var outputType = (0, conversions_1.glslTypeForType)(type, numComponents);
    var componentSelection = (0, conversions_1.glslComponentSelectionForNumComponents)(numComponents);
    var name = params.name || "addValue_".concat(valueType, "_w_length_").concat(valueLength);
    return new GPUProgram_1.GPUProgram(composer, {
        name: name,
        fragmentShader: "\nin vec2 v_uv;\nuniform ".concat(precision, " ").concat(valueType, " u_value;\nuniform ").concat(precision, " ").concat((0, conversions_1.glslPrefixForType)(type), "sampler2D u_state;\nout ").concat(precision, " ").concat(outputType, " out_result;\nvoid main() {\n\tout_result = ").concat(valueType !== outputType ? outputType : '', "(u_value) * texture(u_state, v_uv)").concat(componentSelection, ";\n}"),
        uniforms: [
            {
                name: 'u_state',
                value: 0,
                type: constants_1.INT,
            },
            {
                name: 'u_value',
                value: value,
                type: (0, conversions_1.uniformTypeForType)(type, composer.glslVersion),
            },
        ],
    });
}
exports.multiplyValueProgram = multiplyValueProgram;
/**
 * Init GPUProgram to set all elements in a GPULayer to uniform "u_value".
 * @category GPUProgram Helper
 * @param composer - The current GPUComposer.
 * @param params - Program parameters.
 * @param params.type - The type of the output (we assume "u_value" has same type).
 * @param params.value - Initial value to set, if value has length 1 it will be applied to all components of GPULayer.  Change this later using uniform "u_value".
 * @param params.name - Optionally pass in a GPUProgram name, used for error logging.
 * @param params.precision - Optionally specify the precision of the output/"u_value".
 * @returns
 */
function setValueProgram(composer, params) {
    var type = params.type, value = params.value;
    var precision = params.precision || '';
    var valueLength = (0, type_checks_1.isArray)(value) ? value.length : 1;
    var valueType = (0, conversions_1.glslTypeForType)(type, valueLength);
    var numComponents = valueLength === 1 ? 4 : valueLength;
    var outputType = (0, conversions_1.glslTypeForType)(type, numComponents);
    var name = params.name || "setValue_".concat(valueType, "_w_length_").concat(valueLength);
    return new GPUProgram_1.GPUProgram(composer, {
        name: name,
        fragmentShader: "\nuniform ".concat(precision, " ").concat(valueType, " u_value;\nout ").concat(precision, " ").concat(outputType, " out_result;\nvoid main() {\n\tout_result = ").concat(valueType !== outputType ? outputType : '', "(u_value);\n}"),
        uniforms: [
            {
                name: 'u_value',
                value: value,
                type: (0, conversions_1.uniformTypeForType)(type, composer.glslVersion),
            },
        ],
    });
}
exports.setValueProgram = setValueProgram;
/**
 * Init GPUProgram to set all elements in a GPULayer to uniform "u_value".
 * @category GPUProgram Helper
 * @param composer - The current GPUComposer.
 * @param params - Program parameters.
 * @param params.type - The type of the output.
 * @param params.color - Initial color as RGB in range [0, 1], defaults to [0, 0, 0].  Change this later using uniform "u_color".
 * @param params.opacity - Initial opacity in range [0, 1], defaults to 1.  Change this later using uniform "u_opacity".
 * @param params.name - Optionally pass in a GPUProgram name, used for error logging.
 * @param params.precision - Optionally specify the precision of the output/uniforms.
 * @returns
 */
function setColorProgram(composer, params) {
    var type = params.type;
    var precision = params.precision || '';
    var opacity = params.opacity === undefined ? 1 : params.opacity;
    var color = params.color || [0, 0, 0];
    var name = params.name || "setColor";
    var glslType = (0, conversions_1.glslTypeForType)(type, 4);
    return new GPUProgram_1.GPUProgram(composer, {
        name: name,
        fragmentShader: "\nuniform ".concat(precision, " vec3 u_color;\nuniform ").concat(precision, " float u_opacity;\nout ").concat(precision, " ").concat(glslType, " out_result;\nvoid main() {\n\tout_result = ").concat(glslType, "(u_color, u_opacity);\n}"),
        uniforms: [
            {
                name: 'u_color',
                value: color,
                type: constants_1.FLOAT,
            },
            {
                name: 'u_opacity',
                value: opacity,
                type: constants_1.FLOAT,
            },
        ],
    });
}
exports.setColorProgram = setColorProgram;
/**
 * Init GPUProgram to zero output GPULayer.
 * @category GPUProgram Helper
 * @param composer - The current GPUComposer.
 * @param params - Program parameters.
 * @param params.name - Optionally pass in a GPUProgram name, used for error logging.
 * @returns
 */
function zeroProgram(composer, params) {
    return setValueProgram(composer, {
        type: constants_1.FLOAT,
        value: 0,
        name: params.name,
    });
}
exports.zeroProgram = zeroProgram;
/**
 * Init GPUProgram to render RGBA amplitude of an input GPULayer's components, defaults to grayscale rendering and works for scalar and vector fields.
 * @category GPUProgram Helper
 * @param composer - The current GPUComposer.
 * @param params - Program parameters.
 * @param params.type - The type of the input.
 * @param params.components - Component(s) of input GPULayer to render, defaults to 'xyzw'.
 * @param params.name - Optionally pass in a GPUProgram name, used for error logging.
 * @param params.scale - Scaling factor, defaults to 1.  Change this later using uniform "u_scale".
 * @param params.opacity - Opacity, defaults to 1.  Change this later using uniform "u_opacity".
 * @param params.color - RGB color for non-zero amplitudes, scaled to [-0,1] range, defaults to white.  Change this later using uniform "u_color".
 * @param params.colorZero - RGB color for zero amplitudes, scaled to [-0,1] range, defaults to black.  Change this later using uniform "u_colorZero".
 * @param params.precision - Optionally specify the precision of the input.
 * @returns
 */
function renderAmplitudeProgram(composer, params) {
    var type = params.type;
    var precision = params.precision || '';
    var components = params.components || 'xyzw';
    var numComponents = components.length;
    var glslType = (0, conversions_1.glslTypeForType)(type, numComponents);
    var glslFloatType = (0, conversions_1.glslTypeForType)(constants_1.FLOAT, numComponents);
    var glslPrefix = (0, conversions_1.glslPrefixForType)(type);
    var shouldCast = glslFloatType === glslType;
    var name = params.name || "renderAmplitude_".concat(glslType, "_w_").concat(numComponents, "_components");
    return new GPUProgram_1.GPUProgram(composer, {
        name: name,
        fragmentShader: "\nin vec2 v_uv;\nuniform float u_opacity;\nuniform float u_scale;\nuniform vec3 u_color;\nuniform vec3 u_colorZero;\nuniform ".concat(precision, " ").concat(glslPrefix, "sampler2D u_state;\nout vec4 out_result;\nvoid main() {\n\tfloat amplitude = u_scale * ").concat(numComponents === 1 ? 'abs' : 'length', "(").concat(shouldCast ? '' : glslFloatType, "(texture(u_state, v_uv)").concat(components === 'xyzw' || components === 'rgba' || components === 'stpq' ? '' : ".".concat(components), "));\n\tvec3 color = mix(u_colorZero, u_color, amplitude);\n\tout_result = vec4(color, u_opacity);\n}"),
        uniforms: [
            {
                name: 'u_state',
                value: 0,
                type: constants_1.INT,
            },
            {
                name: 'u_scale',
                value: params.scale !== undefined ? params.scale : 1,
                type: constants_1.FLOAT,
            },
            {
                name: 'u_opacity',
                value: params.opacity !== undefined ? params.opacity : 1,
                type: constants_1.FLOAT,
            },
            {
                name: 'u_color',
                value: params.color || [1, 1, 1],
                type: constants_1.FLOAT,
            },
            {
                name: 'u_colorZero',
                value: params.colorZero || [0, 0, 0],
                type: constants_1.FLOAT,
            },
        ],
    });
}
exports.renderAmplitudeProgram = renderAmplitudeProgram;
/**
 * Init GPUProgram to render signed amplitude of an input GPULayer to linearly interpolated colors.
 * @category GPUProgram Helper
 * @param composer - The current GPUComposer.
 * @param params - Program parameters.
 * @param params.type - The type of the input.
 * @param params.name - Optionally pass in a GPUProgram name, used for error logging.
 * @param params.scale - Scaling factor, defaults to 1.  Change this later using uniform "u_scale".
 * @param params.opacity - Opacity, defaults to 1.  Change this later using uniform "u_opacity".
 * @param params.colorNegative - RGB color for negative amplitudes, scaled to [-0,1] range, defaults to blue.  Change this later using uniform "u_colorNegative".
 * @param params.colorPositive - RGB color for positive amplitudes, scaled to [-0,1] range, defaults to red.  Change this later using uniform "u_colorPositive".
 * @param params.colorZero - RGB color for zero amplitudes, scaled to [-0,1] range, defaults to white.  Change this later using uniform "u_colorZero".
 * @param params.component - Component of input GPULayer to render, defaults to "x".
 * @param params.precision - Optionally specify the precision of the input.
 * @returns
 */
function renderSignedAmplitudeProgram(composer, params) {
    var type = params.type;
    var precision = params.precision || '';
    var glslType = (0, conversions_1.glslTypeForType)(type, 1);
    var glslPrefix = (0, conversions_1.glslPrefixForType)(type);
    var castFloat = glslType === 'float';
    var component = params.component || 'x';
    var name = params.name || "renderAmplitude_".concat(glslType, "_").concat(component);
    return new GPUProgram_1.GPUProgram(composer, {
        name: name,
        fragmentShader: "\nin vec2 v_uv;\nuniform float u_opacity;\nuniform float u_scale;\nuniform vec3 u_colorNegative;\nuniform vec3 u_colorPositive;\nuniform vec3 u_colorZero;\nuniform ".concat(precision, " ").concat(glslPrefix, "sampler2D u_state;\nout vec4 out_result;\nvoid main() {\n\tfloat signedAmplitude = u_scale * ").concat(castFloat ? '' : 'float', "(texture(u_state, v_uv).").concat(component, ");\n\tfloat amplitudeSign = sign(signedAmplitude);\n\tvec3 interpColor = mix(u_colorNegative, u_colorPositive, amplitudeSign / 2.0 + 0.5);\n\tvec3 color = mix(u_colorZero, interpColor, signedAmplitude * amplitudeSign);\n\tout_result = vec4(color, u_opacity);\n}"),
        uniforms: [
            {
                name: 'u_state',
                value: 0,
                type: constants_1.INT,
            },
            {
                name: 'u_scale',
                value: params.scale !== undefined ? params.scale : 1,
                type: constants_1.FLOAT,
            },
            {
                name: 'u_opacity',
                value: params.opacity !== undefined ? params.opacity : 1,
                type: constants_1.FLOAT,
            },
            {
                name: 'u_colorNegative',
                value: params.colorNegative || [0, 0, 1],
                type: constants_1.FLOAT,
            },
            {
                name: 'u_colorPositive',
                value: params.colorPositive || [1, 0, 0],
                type: constants_1.FLOAT,
            },
            {
                name: 'u_colorZero',
                value: params.colorZero || [1, 1, 1],
                type: constants_1.FLOAT,
            },
        ],
    });
}
exports.renderSignedAmplitudeProgram = renderSignedAmplitudeProgram;
/**
 * @private
 */
function wrappedLineColorProgram(composer) {
    return new GPUProgram_1.GPUProgram(composer, {
        name: "wrappedLineColor",
        fragmentShader: "\nin vec2 v_lineWrapping;\nuniform vec4 u_value;\nout vec4 out_result;\nvoid main() {\n\t// Check if this line has wrapped.\n\tif ((v_lineWrapping.x != 0.0 && v_lineWrapping.x != 1.0) || (v_lineWrapping.y != 0.0 && v_lineWrapping.y != 1.0)) {\n\t\t// Render nothing.\n\t\tdiscard;\n\t\treturn;\n\t}\n\tout_result = vec4(u_value);\n}",
    });
}
exports.wrappedLineColorProgram = wrappedLineColorProgram;


/***/ }),

/***/ 404:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Vector4 = void 0;
/**
 * These are the parts of threejs Vector4 that we need.
 * Used internally.
 * @private
 */
var Vector4 = /** @class */ (function () {
    function Vector4(x, y, z, w) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (z === void 0) { z = 0; }
        if (w === void 0) { w = 1; }
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    Object.defineProperty(Vector4.prototype, "width", {
        get: function () {
            return this.z;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector4.prototype, "height", {
        get: function () {
            return this.w;
        },
        enumerable: false,
        configurable: true
    });
    Vector4.prototype.copy = function (v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        this.w = v.w;
        return this;
    };
    return Vector4;
}());
exports.Vector4 = Vector4;


/***/ }),

/***/ 707:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkRequiredKeys = exports.checkValidKeys = exports.isNumberOfType = exports.isValidClearValue = exports.isValidImageType = exports.isValidImageFormat = exports.isValidWrap = exports.isValidFilter = exports.isValidDataType = void 0;
var type_checks_1 = __webpack_require__(566);
var constants_1 = __webpack_require__(601);
/**
 * Checks if type is valid GPULayer data type.
 * @private
 */
function isValidDataType(type) {
    return constants_1.validDataTypes.indexOf(type) > -1;
}
exports.isValidDataType = isValidDataType;
/**
 * Checks if filter is valid GPULayer filter type.
 * @private
 */
function isValidFilter(type) {
    return constants_1.validFilters.indexOf(type) > -1;
}
exports.isValidFilter = isValidFilter;
/**
 * Checks if wrap is valid GPULayer wrap type.
 * @private
 */
function isValidWrap(type) {
    return constants_1.validWraps.indexOf(type) > -1;
}
exports.isValidWrap = isValidWrap;
/**
 * For image urls that are passed in and inited as GPULayers.
 * @private
 */
function isValidImageFormat(type) {
    return constants_1.validImageFormats.indexOf(type) > -1;
}
exports.isValidImageFormat = isValidImageFormat;
/**
 * For image urls that are passed in and inited as GPULayers.
 * @private
 */
function isValidImageType(type) {
    return constants_1.validImageTypes.indexOf(type) > -1;
}
exports.isValidImageType = isValidImageType;
/**
 * Checks if value is valid GPULayer clear value for numComponents and type.
 * @private
 */
function isValidClearValue(clearValue, numComponents, type) {
    if ((0, type_checks_1.isArray)(clearValue)) {
        // Length of clearValue must match numComponents.
        if (clearValue.length !== numComponents) {
            return false;
        }
        for (var i = 0; i < clearValue.length; i++) {
            if (!isNumberOfType(clearValue[i], type)) {
                return false;
            }
        }
    }
    else {
        if (!isNumberOfType(clearValue, type)) {
            return false;
        }
    }
    return true;
}
exports.isValidClearValue = isValidClearValue;
/**
 * Checks if value is valid number for a given GPULayer type.
 * Checks extrema values.
 * @private
 */
function isNumberOfType(value, type) {
    switch (type) {
        case constants_1.HALF_FLOAT:
        case constants_1.FLOAT:
            return (0, type_checks_1.isFiniteNumber)(value);
        case constants_1.BYTE:
            // -(2 ** 7)
            if (value < -128)
                return false;
            // 2 ** 7 - 1
            if (value > 127)
                return false;
            return (0, type_checks_1.isInteger)(value);
        case constants_1.SHORT:
            // -(2 ** 15)
            if (value < -32768)
                return false;
            // 2 ** 15 - 1
            if (value > 32767)
                return false;
            return (0, type_checks_1.isInteger)(value);
        case constants_1.INT:
            // -(2 ** 31)
            if (value < -2147483648)
                return false;
            // 2 ** 31 - 1
            if (value > 2147483647)
                return false;
            return (0, type_checks_1.isInteger)(value);
        case constants_1.UNSIGNED_BYTE:
            // 2 ** 8 - 1
            if (value > 255)
                return false;
            return (0, type_checks_1.isNonNegativeInteger)(value);
        case constants_1.UNSIGNED_SHORT:
            // 2 ** 16 - 1
            if (value > 65535)
                return false;
            return (0, type_checks_1.isNonNegativeInteger)(value);
        case constants_1.UNSIGNED_INT:
            // 2 ** 32 - 1
            if (value > 4294967295)
                return false;
            return (0, type_checks_1.isNonNegativeInteger)(value);
        default:
            throw new Error("Unknown type ".concat(type));
    }
}
exports.isNumberOfType = isNumberOfType;
function checkValidKeys(keys, validKeys, methodName, name) {
    keys.forEach(function (key) {
        if (validKeys.indexOf(key) < 0) {
            throw new Error("Invalid params key \"".concat(key, "\" passed to ").concat(methodName).concat(name ? " with name \"".concat(name, "\"") : '', ".  Valid keys are ").concat(JSON.stringify(validKeys), "."));
        }
    });
}
exports.checkValidKeys = checkValidKeys;
function checkRequiredKeys(keys, requiredKeys, methodName, name) {
    requiredKeys.forEach(function (key) {
        if (keys.indexOf(key) < 0) {
            throw new Error("Required params key \"".concat(key, "\" was not passed to ").concat(methodName).concat(name ? " with name \"".concat(name, "\"") : '', "."));
        }
    });
}
exports.checkRequiredKeys = checkRequiredKeys;


/***/ }),

/***/ 601:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LAYER_POINTS_PROGRAM_NAME = exports.SEGMENT_PROGRAM_NAME = exports.DEFAULT_PROGRAM_NAME = exports.BOOL_4D_UNIFORM = exports.BOOL_3D_UNIFORM = exports.BOOL_2D_UNIFORM = exports.BOOL_1D_UNIFORM = exports.UINT_4D_UNIFORM = exports.UINT_3D_UNIFORM = exports.UINT_2D_UNIFORM = exports.UINT_1D_UNIFORM = exports.INT_4D_UNIFORM = exports.INT_3D_UNIFORM = exports.INT_2D_UNIFORM = exports.INT_1D_UNIFORM = exports.FLOAT_4D_UNIFORM = exports.FLOAT_3D_UNIFORM = exports.FLOAT_2D_UNIFORM = exports.FLOAT_1D_UNIFORM = exports.PRECISION_HIGH_P = exports.PRECISION_MEDIUM_P = exports.PRECISION_LOW_P = exports.EXPERIMENTAL_WEBGL2 = exports.EXPERIMENTAL_WEBGL = exports.WEBGL1 = exports.WEBGL2 = exports.GLSL1 = exports.GLSL3 = exports.validImageTypes = exports.validImageFormats = exports.RGBA = exports.RGB = exports.validWraps = exports.validFilters = exports.validDataTypes = exports.validArrayTypes = exports.REPEAT = exports.CLAMP_TO_EDGE = exports.LINEAR = exports.NEAREST = exports.UINT = exports.BOOL = exports.INT = exports.UNSIGNED_INT = exports.SHORT = exports.UNSIGNED_SHORT = exports.BYTE = exports.UNSIGNED_BYTE = exports.FLOAT = exports.HALF_FLOAT = void 0;
exports.BOUNDARY_RIGHT = exports.BOUNDARY_LEFT = exports.BOUNDARY_BOTTOM = exports.BOUNDARY_TOP = exports.GPUIO_FLOAT_PRECISION = exports.GPUIO_INT_PRECISION = exports.MAX_FLOAT_INT = exports.MIN_FLOAT_INT = exports.MAX_HALF_FLOAT_INT = exports.MIN_HALF_FLOAT_INT = exports.MAX_INT = exports.MIN_INT = exports.MAX_UNSIGNED_INT = exports.MIN_UNSIGNED_INT = exports.MAX_SHORT = exports.MIN_SHORT = exports.MAX_UNSIGNED_SHORT = exports.MIN_UNSIGNED_SHORT = exports.MAX_BYTE = exports.MIN_BYTE = exports.MAX_UNSIGNED_BYTE = exports.MIN_UNSIGNED_BYTE = exports.DEFAULT_CIRCLE_NUM_SEGMENTS = exports.DEFAULT_ERROR_CALLBACK = exports.GPUIO_VS_POSITION_W_ACCUM = exports.GPUIO_VS_NORMAL_ATTRIBUTE = exports.GPUIO_VS_UV_ATTRIBUTE = exports.GPUIO_VS_INDEXED_POSITIONS = exports.GPUIO_VS_WRAP_Y = exports.GPUIO_VS_WRAP_X = exports.LAYER_VECTOR_FIELD_PROGRAM_NAME = exports.LAYER_LINES_PROGRAM_NAME = void 0;
// Data types and constants.
/**
 * Half float data type.
 */
exports.HALF_FLOAT = 'HALF_FLOAT';
/**
 * Float data type.
 */
exports.FLOAT = 'FLOAT';
/**
 * Unsigned byte data type.
 */
exports.UNSIGNED_BYTE = 'UNSIGNED_BYTE';
/**
 * Byte data type.
 */
exports.BYTE = 'BYTE';
/**
 * Unsigned short data type.
 */
exports.UNSIGNED_SHORT = 'UNSIGNED_SHORT';
/**
 * Short data type.
 */
exports.SHORT = 'SHORT';
/**
 * Unsigned int data type.
 */
exports.UNSIGNED_INT = 'UNSIGNED_INT';
/**
 * Int data type.
 */
exports.INT = 'INT';
/**
 * Boolean data type (GPUProgram uniforms only).
 */
exports.BOOL = 'BOOL';
/**
 * Unsigned int data type (GPUProgram uniforms only).
 */
exports.UINT = 'UINT';
// Filter types.
/**
 * Nearest texture filtering.
 */
exports.NEAREST = 'NEAREST';
/**
 * Linear texture filtering.
 */
exports.LINEAR = 'LINEAR';
// Wrap types.
/**
 * Clamp to edge wrapping (no wrapping).
 */
exports.CLAMP_TO_EDGE = 'CLAMP_TO_EDGE';
/**
 * Repeat/periodic wrapping.
 */
exports.REPEAT = 'REPEAT';
/**
 * @private
 */
exports.validArrayTypes = [Float32Array, Uint8Array, Int8Array, Uint16Array, Int16Array, Uint32Array, Int32Array, Array];
/**
 * @private
 */
exports.validDataTypes = [exports.HALF_FLOAT, exports.FLOAT, exports.UNSIGNED_BYTE, exports.BYTE, exports.UNSIGNED_SHORT, exports.SHORT, exports.UNSIGNED_INT, exports.INT];
/**
 * @private
 */
exports.validFilters = [exports.NEAREST, exports.LINEAR];
/**
 * @private
 */
exports.validWraps = [exports.CLAMP_TO_EDGE, exports.REPEAT]; // MIRRORED_REPEAT
// For image urls that are passed in and inited as textures.
/**
 * RGB image format.
 */
exports.RGB = 'RGB';
/**
 * RGBA image format.
 */
exports.RGBA = 'RGBA';
/**
 * @private
 */
exports.validImageFormats = [exports.RGB, exports.RGBA];
/**
 * @private
 */
exports.validImageTypes = [exports.UNSIGNED_BYTE, exports.FLOAT, exports.HALF_FLOAT];
// GLSL versions.
/**
 * GLSL version 300 (WebGL2 only).
 */
exports.GLSL3 = '300 es';
/**
 * GLSL version 100 (WebGL1 and WebGL2).
 */
exports.GLSL1 = '100';
// WebGL versions.
/**
 * WebGL2 context ID.
 */
exports.WEBGL2 = 'webgl2';
/**
 * WebGL1 context ID.
 */
exports.WEBGL1 = 'webgl';
/**
 * Experimental WebGL context ID.
 */
exports.EXPERIMENTAL_WEBGL = 'experimental-webgl';
/**
 * Experimental WebGL context ID.
 */
exports.EXPERIMENTAL_WEBGL2 = 'experimental-webgl2';
// Precision declarations.
/**
 * GLSL lowp precision declaration.
 */
exports.PRECISION_LOW_P = 'lowp';
/**
 * GLSL mediump precision declaration.
 */
exports.PRECISION_MEDIUM_P = 'mediump';
/**
 * GLSL highp precision declaration.
 */
exports.PRECISION_HIGH_P = 'highp';
// Uniform types.
/**
 * @private
 */
exports.FLOAT_1D_UNIFORM = 'FLOAT_1D_UNIFORM';
/**
 * @private
 */
exports.FLOAT_2D_UNIFORM = 'FLOAT_2D_UNIFORM';
/**
 * @private
 */
exports.FLOAT_3D_UNIFORM = 'FLOAT_3D_UNIFORM';
/**
 * @private
 */
exports.FLOAT_4D_UNIFORM = 'FLOAT_4D_UNIFORM';
/**
 * @private
 */
exports.INT_1D_UNIFORM = 'INT_1D_UNIFORM';
/**
 * @private
 */
exports.INT_2D_UNIFORM = 'INT_2D_UNIFORM';
/**
 * @private
 */
exports.INT_3D_UNIFORM = 'INT_3D_UNIFORM';
/**
 * @private
 */
exports.INT_4D_UNIFORM = 'INT_4D_UNIFORM';
/**
 * @private
 */
exports.UINT_1D_UNIFORM = 'UINT_1D_UNIFORM';
/**
 * @private
 */
exports.UINT_2D_UNIFORM = 'UINT_2D_UNIFORM';
/**
 * @private
 */
exports.UINT_3D_UNIFORM = 'UINT_3D_UNIFORM';
/**
 * @private
 */
exports.UINT_4D_UNIFORM = 'UINT_4D_UNIFORM';
/**
 * @private
 */
exports.BOOL_1D_UNIFORM = 'BOOL_1D_UNIFORM';
/**
* @private
*/
exports.BOOL_2D_UNIFORM = 'BOOL_2D_UNIFORM';
/**
* @private
*/
exports.BOOL_3D_UNIFORM = 'BOOL_3D_UNIFORM';
/**
* @private
*/
exports.BOOL_4D_UNIFORM = 'BOOL_4D_UNIFORM';
// Vertex shader types.
/**
 * @private
 */
exports.DEFAULT_PROGRAM_NAME = 'DEFAULT';
/**
 * @private
 */
exports.SEGMENT_PROGRAM_NAME = 'SEGMENT';
/**
 * @private
 */
exports.LAYER_POINTS_PROGRAM_NAME = 'LAYER_POINTS';
/**
 * @private
 */
exports.LAYER_LINES_PROGRAM_NAME = 'LAYER_LINES';
/**
 * @private
 */
exports.LAYER_VECTOR_FIELD_PROGRAM_NAME = 'LAYER_VECTOR_FIELD';
// Vertex shader compile time constants.
/**
 * @private
 */
exports.GPUIO_VS_WRAP_X = 'GPUIO_VS_WRAP_X';
/**
 * @private
 */
exports.GPUIO_VS_WRAP_Y = 'GPUIO_VS_WRAP_Y';
/**
 * @private
 */
exports.GPUIO_VS_INDEXED_POSITIONS = 'GPUIO_VS_INDEXED_POSITIONS';
/**
 * @private
 */
exports.GPUIO_VS_UV_ATTRIBUTE = 'GPUIO_VS_UV_ATTRIBUTE';
/**
* @private
*/
exports.GPUIO_VS_NORMAL_ATTRIBUTE = 'GPUIO_VS_NORMAL_ATTRIBUTE';
/**
 * @private
 */
exports.GPUIO_VS_POSITION_W_ACCUM = 'GPUIO_VS_POSITION_W_ACCUM';
/**
 * @private
 */
var DEFAULT_ERROR_CALLBACK = function (message) { throw new Error(message); };
exports.DEFAULT_ERROR_CALLBACK = DEFAULT_ERROR_CALLBACK;
// For stepCircle() and stepSegment() (with end caps).
/**
 * @private
 */
exports.DEFAULT_CIRCLE_NUM_SEGMENTS = 18; // Must be divisible by 6 to work with stepSegment().
// Extrema values.
/**
 * @private
 */
exports.MIN_UNSIGNED_BYTE = 0;
/**
 * @private
 */
exports.MAX_UNSIGNED_BYTE = Math.pow(2, 8) - 1;
/**
 * @private
 */
exports.MIN_BYTE = -(Math.pow(2, 7));
/**
 * @private
 */
exports.MAX_BYTE = Math.pow(2, 7) - 1;
/**
 * @private
 */
exports.MIN_UNSIGNED_SHORT = 0;
/**
 * @private
 */
exports.MAX_UNSIGNED_SHORT = Math.pow(2, 16) - 1;
/**
 * @private
 */
exports.MIN_SHORT = -(Math.pow(2, 15));
/**
 * @private
 */
exports.MAX_SHORT = Math.pow(2, 15) - 1;
/**
 * @private
 */
exports.MIN_UNSIGNED_INT = 0;
/**
 * @private
 */
exports.MAX_UNSIGNED_INT = Math.pow(2, 32) - 1;
/**
 * @private
 */
exports.MIN_INT = -(Math.pow(2, 31));
/**
 * @private
 */
exports.MAX_INT = Math.pow(2, 31) - 1;
// There are larger HALF_FLOAT and FLOAT ints, but they may be spaced out by > 1.
/**
 * @private
 */
exports.MIN_HALF_FLOAT_INT = -2048;
/**
 * @private
 */
exports.MAX_HALF_FLOAT_INT = 2048;
/**
 * @private
 */
exports.MIN_FLOAT_INT = -16777216;
/**
 * @private
 */
exports.MAX_FLOAT_INT = 16777216;
// Precision compile time constants
/**
 * @private
 */
exports.GPUIO_INT_PRECISION = 'GPUIO_INT_PRECISION';
/**
 * @private
 */
exports.GPUIO_FLOAT_PRECISION = 'GPUIO_FLOAT_PRECISION';
exports.BOUNDARY_TOP = 'BOUNDARY_TOP';
exports.BOUNDARY_BOTTOM = 'BOUNDARY_BOTTOM';
exports.BOUNDARY_LEFT = 'BOUNDARY_LEFT';
exports.BOUNDARY_RIGHT = 'BOUNDARY_RIGHT';


/***/ }),

/***/ 690:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.glslComponentSelectionForNumComponents = exports.glslPrefixForType = exports.glslTypeForType = exports.arrayConstructorForType = exports.uniformTypeForType = exports.intForPrecision = void 0;
var constants_1 = __webpack_require__(601);
/**
 * Enum for precision values.
 * See src/glsl/common/precision.ts for more info.
 * @private
 */
function intForPrecision(precision) {
    if (precision === constants_1.PRECISION_HIGH_P)
        return 2;
    if (precision === constants_1.PRECISION_MEDIUM_P)
        return 1;
    if (precision === constants_1.PRECISION_LOW_P)
        return 0;
    throw new Error("Unknown shader precision value: ".concat(JSON.stringify(precision), "."));
}
exports.intForPrecision = intForPrecision;
/**
 * @private
 */
function uniformTypeForType(type, glslVersion) {
    switch (type) {
        case constants_1.HALF_FLOAT:
        case constants_1.FLOAT:
            return constants_1.FLOAT;
        case constants_1.UNSIGNED_BYTE:
        case constants_1.UNSIGNED_SHORT:
        case constants_1.UNSIGNED_INT:
            if (glslVersion === constants_1.GLSL1)
                return constants_1.INT;
            return constants_1.UINT;
        case constants_1.BYTE:
        case constants_1.SHORT:
        case constants_1.INT:
            return constants_1.INT;
        default:
            throw new Error("Invalid type: ".concat(type, " passed to glslKeyForType."));
    }
}
exports.uniformTypeForType = uniformTypeForType;
/**
 * @private
 */
function arrayConstructorForType(type, halfFloatsAsFloats) {
    if (halfFloatsAsFloats === void 0) { halfFloatsAsFloats = false; }
    switch (type) {
        case constants_1.HALF_FLOAT:
            if (halfFloatsAsFloats)
                return Float32Array;
            return Uint16Array;
        case constants_1.FLOAT:
            return Float32Array;
        case constants_1.UNSIGNED_BYTE:
            return Uint8Array;
        case constants_1.BYTE:
            return Int8Array;
        case constants_1.UNSIGNED_SHORT:
            return Uint16Array;
        case constants_1.SHORT:
            return Int16Array;
        case constants_1.UNSIGNED_INT:
            return Uint32Array;
        case constants_1.INT:
            return Int32Array;
        default:
            throw new Error("Unsupported type: \"".concat(type, "\"."));
    }
}
exports.arrayConstructorForType = arrayConstructorForType;
/**
 * @private
 */
function glslTypeForType(type, numComponents) {
    switch (type) {
        case constants_1.HALF_FLOAT:
        case constants_1.FLOAT:
            if (numComponents === 1)
                return 'float';
            return "vec".concat(numComponents);
        case constants_1.UNSIGNED_BYTE:
        case constants_1.UNSIGNED_SHORT:
        case constants_1.UNSIGNED_INT:
            if (numComponents === 1)
                return 'uint';
            return "uvec".concat(numComponents);
        case constants_1.BYTE:
        case constants_1.SHORT:
        case constants_1.INT:
            if (numComponents === 1)
                return 'int';
            return "ivec".concat(numComponents);
    }
    throw new Error("Invalid type: ".concat(type, " passed to glslTypeForType."));
}
exports.glslTypeForType = glslTypeForType;
/**
 * @private
 */
function glslPrefixForType(type) {
    switch (type) {
        case constants_1.HALF_FLOAT:
        case constants_1.FLOAT:
            return '';
        case constants_1.UNSIGNED_BYTE:
        case constants_1.UNSIGNED_SHORT:
        case constants_1.UNSIGNED_INT:
            return 'u';
        case constants_1.BYTE:
        case constants_1.SHORT:
        case constants_1.INT:
            return 'i';
    }
    throw new Error("Invalid type: ".concat(type, " passed to glslPrefixForType."));
}
exports.glslPrefixForType = glslPrefixForType;
/**
 * @private
 */
function glslComponentSelectionForNumComponents(numComponents) {
    switch (numComponents) {
        case 1:
            return '.x';
        case 2:
            return '.xy';
        case 3:
            return '.xyz';
        case 4:
            return '';
    }
    throw new Error("Invalid numComponents: ".concat(numComponents, " passed to glslComponentSelectionForNumComponents."));
}
exports.glslComponentSelectionForNumComponents = glslComponentSelectionForNumComponents;


/***/ }),

/***/ 581:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getExtension = exports.EXT_COLOR_BUFFER_HALF_FLOAT = exports.EXT_COLOR_BUFFER_FLOAT = exports.WEBGL_DEPTH_TEXTURE = exports.OES_TEXTURE_HAlF_FLOAT_LINEAR = exports.OES_TEXTURE_FLOAT_LINEAR = exports.OES_TEXTURE_HALF_FLOAT = exports.OES_TEXTURE_FLOAT = void 0;
// https://developer.mozilla.org/en-US/docs/Web/API/OES_texture_float
// Float is provided by default in WebGL2 contexts.
// This extension implicitly enables the WEBGL_color_buffer_float extension (if supported), which allows rendering to 32-bit floating-point color buffers.
exports.OES_TEXTURE_FLOAT = 'OES_texture_float';
// https://developer.mozilla.org/en-US/docs/Web/API/OES_texture_half_float
// Half float is supported by modern mobile browsers, float not yet supported.
// Half float is provided by default for Webgl2 contexts.
// This extension implicitly enables the EXT_color_buffer_half_float extension (if supported), which allows rendering to 16-bit floating point formats.
exports.OES_TEXTURE_HALF_FLOAT = 'OES_texture_half_float';
// https://www.khronos.org/registry/OpenGL/extensions/OES/OES_texture_float_linear.txt
exports.OES_TEXTURE_FLOAT_LINEAR = 'OES_texture_float_linear';
exports.OES_TEXTURE_HAlF_FLOAT_LINEAR = 'OES_texture_half_float_linear';
// https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_depth_texture
// Adds gl.UNSIGNED_SHORT, gl.UNSIGNED_INT types to textImage2D in WebGL1.0
exports.WEBGL_DEPTH_TEXTURE = 'WEBGL_depth_texture';
// EXT_COLOR_BUFFER_FLOAT adds ability to render to a variety of floating pt textures.
// This is needed for the WebGL2 contexts that do not support OES_TEXTURE_FLOAT / OES_TEXTURE_HALF_FLOAT extensions.
// https://developer.mozilla.org/en-US/docs/Web/API/EXT_color_buffer_float
// https://stackoverflow.com/questions/34262493/framebuffer-incomplete-attachment-for-texture-with-internal-format
// https://stackoverflow.com/questions/36109347/framebuffer-incomplete-attachment-only-happens-on-android-w-firefox
exports.EXT_COLOR_BUFFER_FLOAT = 'EXT_color_buffer_float';
// On WebGL 2, EXT_COLOR_BUFFER_HALF_FLOAT is an alternative to using the EXT_color_buffer_float extension on platforms
// that support 16-bit floating point render targets but not 32-bit floating point render targets.
exports.EXT_COLOR_BUFFER_HALF_FLOAT = 'EXT_color_buffer_half_float';
function getExtension(composer, extensionName, optional) {
    if (optional === void 0) { optional = false; }
    // Check if we've already loaded the extension.
    if (composer._extensions[extensionName] !== undefined)
        return composer._extensions[extensionName];
    var gl = composer.gl, _errorCallback = composer._errorCallback, _extensions = composer._extensions, verboseLogging = composer.verboseLogging;
    var extension;
    try {
        extension = gl.getExtension(extensionName);
    }
    catch (e) { }
    if (extension) {
        // Cache this extension.
        _extensions[extensionName] = extension;
        if (composer.verboseLogging)
            console.log("Loaded extension: ".concat(extensionName, "."));
    }
    else {
        _extensions[extensionName] = false; // Cache the bad extension lookup.
        if (composer.verboseLogging)
            console.log("Unsupported ".concat(optional ? 'optional ' : '', "extension: ").concat(extensionName, "."));
    }
    // If the extension is not optional, throw error.
    if (!extension && !optional) {
        _errorCallback("Required extension unsupported by this device / browser: ".concat(extensionName, "."));
    }
    return extension;
}
exports.getExtension = getExtension;


/***/ }),

/***/ 798:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.disposeFramebuffers = exports.bindFrameBuffer = void 0;
// Cache framebuffers to minimize invalidating FBO attachment bindings:
// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices#avoid_invalidating_fbo_attachment_bindings
var framebufferMap = new WeakMap();
var allTextureFramebuffersMap = new WeakMap();
function initFrameBuffer(composer, layer0, texture0, additionalTextures) {
    var gl = composer.gl, _errorCallback = composer._errorCallback, isWebGL2 = composer.isWebGL2;
    // Init a framebuffer for this texture so we can write to it.
    var framebuffer = gl.createFramebuffer();
    if (!framebuffer) {
        _errorCallback("Could not init framebuffer for GPULayer \"".concat(layer0.name, "\": ").concat(gl.getError(), "."));
        return;
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/framebufferTexture2D
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture0, 0);
    if (additionalTextures) {
        // Check if length additional textures exceeds a max.
        if (!isWebGL2) {
            throw new Error('WebGL1 does not support drawing to multiple outputs.');
        }
        if (additionalTextures.length > 15) {
            throw new Error("Can't draw to more than 16 outputs.");
        }
        for (var i = 0, numTextures = additionalTextures.length; i < numTextures; i++) {
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i + 1, gl.TEXTURE_2D, additionalTextures[i], 0);
        }
    }
    var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (status !== gl.FRAMEBUFFER_COMPLETE) {
        _errorCallback("Invalid status for framebuffer for GPULayer \"".concat(layer0.name, "\": ").concat(status, "."));
    }
    return framebuffer;
}
/**
 * Bind framebuffer for write operation.
 * @private
 */
function bindFrameBuffer(composer, layer0, texture0, additionalTextures) {
    var gl = composer.gl;
    var key = additionalTextures ? __spreadArray([texture0], additionalTextures, true) : texture0;
    var framebuffer = framebufferMap.get(key);
    if (!framebuffer) {
        framebuffer = initFrameBuffer(composer, layer0, texture0, additionalTextures);
        if (!framebuffer)
            return;
        framebufferMap.set(key, framebuffer);
        var allFramebuffers = allTextureFramebuffersMap.get(texture0) || [];
        allFramebuffers.push(framebuffer);
        allTextureFramebuffersMap.set(texture0, allFramebuffers);
        if (additionalTextures) {
            for (var i = 0, numTextures = additionalTextures.length; i < numTextures; i++) {
                var texture = additionalTextures[i];
                var allFramebuffers_1 = allTextureFramebuffersMap.get(texture) || [];
                allFramebuffers_1.push(framebuffer);
                allTextureFramebuffersMap.set(texture, allFramebuffers_1);
            }
        }
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
}
exports.bindFrameBuffer = bindFrameBuffer;
/**
 * Delete framebuffers when no longer needed.
 * @private
 */
function disposeFramebuffers(gl, texture) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    // Delete all framebuffers associated with this texture.
    var allFramebuffers = allTextureFramebuffersMap.get(texture);
    if (allFramebuffers) {
        for (var i = 0, numFramebuffers = allFramebuffers.length; i < numFramebuffers; i++) {
            gl.deleteFramebuffer(allFramebuffers[i]);
        }
    }
    allTextureFramebuffersMap.delete(texture);
}
exports.disposeFramebuffers = disposeFramebuffers;


/***/ }),

/***/ 724:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PRECISION_SOURCE = void 0;
var constants_1 = __webpack_require__(601);
var conversions_1 = __webpack_require__(690);
// These precision definitions are applied to all vertex and fragment shaders.
// Default to highp, but fallback to mediump if highp not available.
// These defaults can be set in GPUComposer constructor as intPrecision and floatPrecision parameters.
// https://webglfundamentals.org/webgl/lessons/webgl-precision-issues.html
exports.PRECISION_SOURCE = "\n#if (".concat(constants_1.GPUIO_INT_PRECISION, " == ").concat((0, conversions_1.intForPrecision)(constants_1.PRECISION_LOW_P), ")\n\tprecision lowp int;\n\t#if (__VERSION__ == 300)\n\t\tprecision lowp isampler2D;\n\t\tprecision lowp usampler2D;\n\t#endif\n#elif (").concat(constants_1.GPUIO_INT_PRECISION, " == ").concat((0, conversions_1.intForPrecision)(constants_1.PRECISION_MEDIUM_P), ")\n\tprecision mediump int;\n\t#if (__VERSION__ == 300)\n\t\tprecision mediump isampler2D;\n\t\tprecision mediump usampler2D;\n\t#endif\n#else \n\t#ifdef GL_FRAGMENT_PRECISION_HIGH\n\t\tprecision highp int;\n\t\t#if (__VERSION__ == 300)\n\t\t\tprecision highp isampler2D;\n\t\t\tprecision highp usampler2D;\n\t\t#endif\n\t#else\n\t\tprecision mediump int;\n\t\t#if (__VERSION__ == 300)\n\t\t\tprecision mediump isampler2D;\n\t\t\tprecision mediump usampler2D;\n\t\t#endif\n\t#endif\n#endif\n#if (").concat(constants_1.GPUIO_FLOAT_PRECISION, " == ").concat((0, conversions_1.intForPrecision)(constants_1.PRECISION_LOW_P), ")\n\tprecision lowp float;\n\tprecision lowp sampler2D;\n#elif (").concat(constants_1.GPUIO_FLOAT_PRECISION, " == ").concat((0, conversions_1.intForPrecision)(constants_1.PRECISION_MEDIUM_P), ")\n\tprecision mediump float;\n\tprecision mediump sampler2D;\n#else\n\t#ifdef GL_FRAGMENT_PRECISION_HIGH\n\t\tprecision highp float;\n\t\tprecision highp sampler2D;\n\t#else\n\t\tprecision mediump float;\n\t\tprecision mediump sampler2D;\n\t#endif\n#endif\n");


/***/ }),

/***/ 651:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DEFAULT_VERT_SHADER_SOURCE = void 0;
var constants_1 = __webpack_require__(601);
exports.DEFAULT_VERT_SHADER_SOURCE = "\nin vec2 a_gpuio_position;\n#ifdef ".concat(constants_1.GPUIO_VS_UV_ATTRIBUTE, "\n\tin vec2 a_gpuio_uv;\n#endif\n#ifdef ").concat(constants_1.GPUIO_VS_NORMAL_ATTRIBUTE, "\n\tin vec2 a_gpuio_normal;\n#endif\n\nuniform vec2 u_gpuio_scale;\nuniform vec2 u_gpuio_translation;\n\nout vec2 v_uv;\nout vec2 v_uv_local;\n#ifdef ").concat(constants_1.GPUIO_VS_NORMAL_ATTRIBUTE, "\n\tout vec2 v_normal;\n#endif\n\nvoid main() {\n\t// Optional varyings.\n\t#ifdef ").concat(constants_1.GPUIO_VS_UV_ATTRIBUTE, "\n\t\tv_uv_local = a_gpuio_uv;\n\t#else\n\t\tv_uv_local = 0.5 * (a_gpuio_position + 1.0);\n\t#endif\n\t#ifdef ").concat(constants_1.GPUIO_VS_NORMAL_ATTRIBUTE, "\n\t\tv_normal = a_gpuio_normal;\n\t#endif\n\n\t// Apply transformations.\n\tvec2 position = u_gpuio_scale * a_gpuio_position + u_gpuio_translation;\n\n\t// Calculate a global uv for the viewport.\n\tv_uv = 0.5 * (position + 1.0);\n\n\t// Calculate vertex position.\n\tgl_Position = vec4(position, 0, 1);\n}");


/***/ }),

/***/ 567:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LAYER_LINES_VERTEX_SHADER_SOURCE = void 0;
var constants_1 = __webpack_require__(601);
var VertexShaderHelpers_1 = __webpack_require__(324);
exports.LAYER_LINES_VERTEX_SHADER_SOURCE = "\n".concat(VertexShaderHelpers_1.VERTEX_SHADER_HELPERS_SOURCE, "\n\n#if (__VERSION__ != 300 || ").concat(constants_1.GPUIO_VS_INDEXED_POSITIONS, " == 1)\n\t// Cannot use int vertex attributes.\n\t// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer\n\tin float a_gpuio_index;\n#endif\n\nuniform sampler2D u_gpuio_positions; // Texture lookup with position data.\nuniform vec2 u_gpuio_positionsDimensions;\nuniform vec2 u_gpuio_scale;\n\nout vec2 v_uv;\nout vec2 v_lineWrapping; // Use this to test if line is only half wrapped and should not be rendered.\nflat out int v_index;\n\nvoid main() {\n\t// Calculate a uv based on the point's index attribute.\n\t#if (__VERSION__ != 300 || ").concat(constants_1.GPUIO_VS_INDEXED_POSITIONS, " == 1)\n\t\tvec2 positionUV = uvFromIndex(a_gpuio_index, u_gpuio_positionsDimensions);\n\t\tv_index = int(a_gpuio_index);\n\t#else\n\t\tvec2 positionUV = uvFromIndex(gl_VertexID, u_gpuio_positionsDimensions);\n\t\tv_index = gl_VertexID;\n\t#endif\n\n\t// Calculate a global uv for the viewport.\n\t// Lookup vertex position and scale to [0, 1] range.\n\t#ifdef ").concat(constants_1.GPUIO_VS_POSITION_W_ACCUM, "\n\t\t// We have packed a 2D displacement with the position.\n\t\tvec4 positionData = texture(u_gpuio_positions, positionUV);\n\t\t// position = first two components plus last two components (optional accumulation buffer).\n\t\tv_uv = (positionData.rg + positionData.ba) * u_gpuio_scale;\n\t#else\n\t\tv_uv = texture(u_gpuio_positions, positionUV).rg  * u_gpuio_scale;\n\t#endif\n\n\t// Wrap if needed.\n\tv_lineWrapping = vec2(0.0);\n\t#ifdef ").concat(constants_1.GPUIO_VS_WRAP_X, "\n\t\tv_lineWrapping.x = max(step(1.0, v_uv.x), step(v_uv.x, 0.0));\n\t\tv_ux.x = fract(v_uv.x + 1.0);\n\t#endif\n\t#ifdef ").concat(constants_1.GPUIO_VS_WRAP_Y, "\n\t\tv_lineWrapping.y = max(step(1.0, v_uv.y), step(v_uv.y, 0.0));\n\t\tv_ux.y = fract(v_uv.y + 1.0);\n\t#endif\n\n\t// Calculate position in [-1, 1] range.\n\tvec2 position = v_uv * 2.0 - 1.0;\n\n\tgl_Position = vec4(position, 0, 1);\n}");


/***/ }),

/***/ 929:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LAYER_POINTS_VERTEX_SHADER_SOURCE = void 0;
var constants_1 = __webpack_require__(601);
var VertexShaderHelpers_1 = __webpack_require__(324);
exports.LAYER_POINTS_VERTEX_SHADER_SOURCE = "\n".concat(VertexShaderHelpers_1.VERTEX_SHADER_HELPERS_SOURCE, "\n\n#if (__VERSION__ != 300)\n\t// Cannot use int vertex attributes.\n\t// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer\n\tin float a_gpuio_index;\n#endif\n\nuniform sampler2D u_gpuio_positions; // Texture lookup with position data.\nuniform vec2 u_gpuio_positionsDimensions;\nuniform vec2 u_gpuio_scale;\nuniform float u_gpuio_pointSize;\n\nout vec2 v_uv;\nout vec2 v_uv_1d;\nout vec2 v_position;\nflat out int v_index;\n\nvoid main() {\n\t// Calculate a uv based on the point's index attribute.\n\t#if (__VERSION__ == 300)\n\t\tv_uv_1d = uvFromIndex(gl_VertexID, u_gpuio_positionsDimensions);\n\t\tv_index = gl_VertexID;\n\t#else\n\t\tv_uv_1d = uvFromIndex(a_gpuio_index, u_gpuio_positionsDimensions);\n\t\tv_index = int(a_gpuio_index);\n\t#endif\n\n\t// Calculate a global uv for the viewport.\n\t// Lookup vertex position and scale to [0, 1] range.\n\t#ifdef ").concat(constants_1.GPUIO_VS_POSITION_W_ACCUM, "\n\t\t// We have packed a 2D displacement with the position.\n\t\tvec4 positionData = texture(u_gpuio_positions, v_uv_1d);\n\t\t// position = first two components plus last two components (optional accumulation buffer).\n\t\tv_position = positionData.rg + positionData.ba;\n\t\tv_uv = v_position * u_gpuio_scale;\n\t#else\n\t\tv_position = texture(u_gpuio_positions, v_uv_1d).rg;\n\t\tv_uv = v_position * u_gpuio_scale;\n\t#endif\n\n\t// Wrap if needed.\n\t#ifdef ").concat(constants_1.GPUIO_VS_WRAP_X, "\n\t\tv_uv.x = fract(v_uv.x + ceil(abs(v_uv.x)));\n\t#endif\n\t#ifdef ").concat(constants_1.GPUIO_VS_WRAP_Y, "\n\t\tv_uv.y = fract(v_uv.y + ceil(abs(v_uv.y)));\n\t#endif\n\n\t// Calculate position in [-1, 1] range.\n\tvec2 position = v_uv * 2.0 - 1.0;\n\n\tgl_PointSize = u_gpuio_pointSize;\n\tgl_Position = vec4(position, 0, 1);\n}");


/***/ }),

/***/ 634:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LAYER_VECTOR_FIELD_VERTEX_SHADER_SOURCE = void 0;
var VertexShaderHelpers_1 = __webpack_require__(324);
exports.LAYER_VECTOR_FIELD_VERTEX_SHADER_SOURCE = "\n".concat(VertexShaderHelpers_1.VERTEX_SHADER_HELPERS_SOURCE, "\n\n#if (__VERSION__ != 300)\n\t// Cannot use int vertex attributes.\n\t// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer\n\tin float a_gpuio_index;\n#endif\n\nuniform sampler2D u_gpuio_vectors; // Texture lookup with vector data.\nuniform vec2 u_gpuio_dimensions;\nuniform vec2 u_gpuio_scale;\n\nout vec2 v_uv;\nflat out int v_index;\n\nvoid main() {\n\t#if (__VERSION__ == 300)\n\t\t// Divide index by 2.\n\t\tint index = gl_VertexID / 2;\n\t\tv_index = index;\n\t#else\n\t\t// Divide index by 2.\n\t\tfloat index = floor((a_gpuio_index + 0.5) / 2.0);\n\t\tv_index = int(index);\n\t#endif\n\n\t// Calculate a uv based on the vertex index attribute.\n\tv_uv = uvFromIndex(index, u_gpuio_dimensions);\n\t#if (__VERSION__ == 300)\n\t\t// Add vector displacement if needed.\n\t\tv_uv += float(gl_VertexID - 2 * index) * texture(u_gpuio_vectors, v_uv).xy * u_gpuio_scale;\n\t#else\n\t\t// Add vector displacement if needed.\n\t\tv_uv += (a_gpuio_index - 2.0 * index) * texture(u_gpuio_vectors, v_uv).xy * u_gpuio_scale;\n\t#endif\n\n\n\t// Calculate position in [-1, 1] range.\n\tvec2 position = v_uv * 2.0 - 1.0;\n\n\tgl_Position = vec4(position, 0, 1);\n}");


/***/ }),

/***/ 946:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SEGMENT_VERTEX_SHADER_SOURCE = void 0;
exports.SEGMENT_VERTEX_SHADER_SOURCE = "\nin vec2 a_gpuio_position;\n\nuniform float u_gpuio_halfThickness;\nuniform vec2 u_gpuio_scale;\nuniform float u_gpuio_length;\nuniform float u_gpuio_rotation;\nuniform vec2 u_gpuio_translation;\n\nout vec2 v_uv_local;\nout vec2 v_uv;\n\nmat2 rotate2d(float _angle){\n\treturn mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));\n}\n\nvoid main() {\n\t// Calculate UV coordinates of current rendered object.\n\tv_uv_local = 0.5 * (a_gpuio_position + 1.0);\n\n\tvec2 position = a_gpuio_position;\n\t// Apply thickness / radius.\n\tposition *= u_gpuio_halfThickness;\n\t// Stretch center of shape to form a round-capped line segment.\n\tfloat signX = sign(position.x);\n\tposition.x += signX * u_gpuio_length / 2.0;\n\tv_uv_local.x = (signX + 1.0) / 2.0;// Set entire cap uv.x to 1 or 0.\n\t// Apply transformations.\n\tposition = u_gpuio_scale * (rotate2d(-u_gpuio_rotation) * position) + u_gpuio_translation;\n\n\t// Calculate a global uv for the viewport.\n\tv_uv = 0.5 * (position + 1.0);\n\n\t// Calculate vertex position.\n\tgl_Position = vec4(position, 0, 1);\n}";


/***/ }),

/***/ 324:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VERTEX_SHADER_HELPERS_SOURCE = void 0;
exports.VERTEX_SHADER_HELPERS_SOURCE = "\n/**\n * Create UV coordinates from a 1D index for data stored in a texture of size \"dimensions\".\n */\nvec2 uvFromIndex(const float index, const vec2 dimensions) {\n\tfloat y = floor((index + 0.5) / dimensions.x);\n\tfloat x = floor(index - y * dimensions.x + 0.5);\n\treturn vec2(x + 0.5, y + 0.5) / dimensions;\n}\nvec2 uvFromIndex(const int index, const vec2 dimensions) {\n    int width = int(dimensions.x);\n    int y = index / width;\n\tint x = index - y * width;\n    return vec2(float(x) + 0.5, float(y) + 0.5) / dimensions;\n}\nvec2 uvFromIndex(const float index, const ivec2 dimensions) {\n\tfloat width = float(dimensions.x);\n    float y = floor((index + 0.5) / width);\n\tfloat x = floor(index - y * width + 0.5);\n    return vec2(x + 0.5, y + 0.5) / vec2(dimensions);\n}\nvec2 uvFromIndex(const int index, const ivec2 dimensions) {\n    int y = index / dimensions.x;\n\tint x = index - y * dimensions.x;\n    return vec2(float(x) + 0.5, float(y) + 0.5) / vec2(dimensions);\n}";


/***/ }),

/***/ 607:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports._testing = exports.setColorProgram = exports.setValueProgram = exports.renderSignedAmplitudeProgram = exports.renderAmplitudeProgram = exports.multiplyValueProgram = exports.addValueProgram = exports.addLayersProgram = exports.copyProgram = exports.getFragmentShaderMediumpPrecision = exports.getVertexShaderMediumpPrecision = exports.isHighpSupportedInFragmentShader = exports.isHighpSupportedInVertexShader = exports.isWebGL2Supported = exports.isWebGL2 = exports.GPUProgram = exports.GPULayer = exports.GPUComposer = void 0;
var utils = __webpack_require__(593);
var GPUComposer_1 = __webpack_require__(484);
Object.defineProperty(exports, "GPUComposer", ({ enumerable: true, get: function () { return GPUComposer_1.GPUComposer; } }));
var GPULayer_1 = __webpack_require__(355);
Object.defineProperty(exports, "GPULayer", ({ enumerable: true, get: function () { return GPULayer_1.GPULayer; } }));
var GPULayerHelpers = __webpack_require__(191);
var GPUProgram_1 = __webpack_require__(664);
Object.defineProperty(exports, "GPUProgram", ({ enumerable: true, get: function () { return GPUProgram_1.GPUProgram; } }));
var checks = __webpack_require__(707);
var regex = __webpack_require__(126);
var extensions = __webpack_require__(581);
var polyfills = __webpack_require__(360);
var conversions = __webpack_require__(690);
var Programs = __webpack_require__(579);
// These exports are only used for testing.
/**
 * @private
 */
var _testing = __assign(__assign(__assign(__assign(__assign(__assign({ isFloatType: utils.isFloatType, isUnsignedIntType: utils.isUnsignedIntType, isSignedIntType: utils.isSignedIntType, isIntType: utils.isIntType, makeShaderHeader: utils.makeShaderHeader, compileShader: utils.compileShader, initGLProgram: utils.initGLProgram, readyToRead: utils.readyToRead, preprocessVertexShader: utils.preprocessVertexShader, preprocessFragmentShader: utils.preprocessFragmentShader, isPowerOf2: utils.isPowerOf2, initSequentialFloatArray: utils.initSequentialFloatArray, uniformInternalTypeForValue: utils.uniformInternalTypeForValue, indexOfLayerInArray: utils.indexOfLayerInArray, readPixelsAsync: utils.readPixelsAsync }, extensions), regex), checks), GPULayerHelpers), polyfills), conversions);
exports._testing = _testing;
// Named exports.
var isWebGL2 = utils.isWebGL2, isWebGL2Supported = utils.isWebGL2Supported, isHighpSupportedInVertexShader = utils.isHighpSupportedInVertexShader, isHighpSupportedInFragmentShader = utils.isHighpSupportedInFragmentShader, getVertexShaderMediumpPrecision = utils.getVertexShaderMediumpPrecision, getFragmentShaderMediumpPrecision = utils.getFragmentShaderMediumpPrecision;
exports.isWebGL2 = isWebGL2;
exports.isWebGL2Supported = isWebGL2Supported;
exports.isHighpSupportedInVertexShader = isHighpSupportedInVertexShader;
exports.isHighpSupportedInFragmentShader = isHighpSupportedInFragmentShader;
exports.getVertexShaderMediumpPrecision = getVertexShaderMediumpPrecision;
exports.getFragmentShaderMediumpPrecision = getFragmentShaderMediumpPrecision;
var copyProgram = Programs.copyProgram, addLayersProgram = Programs.addLayersProgram, addValueProgram = Programs.addValueProgram, multiplyValueProgram = Programs.multiplyValueProgram, renderAmplitudeProgram = Programs.renderAmplitudeProgram, renderSignedAmplitudeProgram = Programs.renderSignedAmplitudeProgram, setValueProgram = Programs.setValueProgram, setColorProgram = Programs.setColorProgram;
exports.copyProgram = copyProgram;
exports.addLayersProgram = addLayersProgram;
exports.addValueProgram = addValueProgram;
exports.multiplyValueProgram = multiplyValueProgram;
exports.renderAmplitudeProgram = renderAmplitudeProgram;
exports.renderSignedAmplitudeProgram = renderSignedAmplitudeProgram;
exports.setValueProgram = setValueProgram;
exports.setColorProgram = setColorProgram;
__exportStar(__webpack_require__(601), exports);


/***/ }),

/***/ 360:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fragmentShaderPolyfills = exports.GLSL1Polyfills = exports.texturePolyfill = exports.SAMPLER2D_DIMENSIONS_UNIFORM = exports.SAMPLER2D_HALF_PX_UNIFORM = exports.SAMPLER2D_FILTER = exports.SAMPLER2D_CAST_INT = exports.SAMPLER2D_WRAP_Y = exports.SAMPLER2D_WRAP_X = void 0;
var regex_1 = __webpack_require__(126);
/**
 * Wrap type to use in polyfill.
 * (0) Default behavior (no polyfill).
 * (1) REPEAT polyfill.
 * @private
 */
exports.SAMPLER2D_WRAP_X = 'GPUIO_WRAP_X';
/**
 * Wrap type to use in polyfill.
 * (0) Default behavior (no polyfill).
 * (1) REPEAT polyfill.
 * @private
 */
exports.SAMPLER2D_WRAP_Y = 'GPUIO_WRAP_Y';
/**
 * Flag to cast texture() result to int type (needed for GLSL1).
 * @private
 */
exports.SAMPLER2D_CAST_INT = 'GPUIO_CAST_INT';
/**
 * Filter type to use in polyfill.
 * (0) Default behavior (no polyfill).
 * (0) LINEAR polyfill.
 * @private
 */
exports.SAMPLER2D_FILTER = 'GPUIO_FILTER';
/**
 * UV size of half a pixel for this texture.
 * @private
 */
exports.SAMPLER2D_HALF_PX_UNIFORM = 'u_gpuio_half_px';
/**
 * Dimensions of texture
 * @private
 */
exports.SAMPLER2D_DIMENSIONS_UNIFORM = 'u_gpuio_dimensions';
/**
 * Override texture function to perform polyfill filter/wrap.
 * https://www.codeproject.com/Articles/236394/Bi-Cubic-and-Bi-Linear-Interpolation-with-GLSL
 * @private
 */
function texturePolyfill(shaderSource) {
    var textureCalls = shaderSource.match(/\btexture\(/g);
    if (!textureCalls || textureCalls.length === 0)
        return { shaderSource: shaderSource, samplerUniforms: [] };
    var samplerUniforms = (0, regex_1.getSampler2DsInProgram)(shaderSource);
    if (samplerUniforms.length === 0)
        return { shaderSource: shaderSource, samplerUniforms: samplerUniforms };
    samplerUniforms.forEach(function (name, i) {
        var regex = new RegExp("\\btexture(2D)?\\(\\s?".concat(name, "\\b"), 'gs');
        shaderSource = shaderSource.replace(regex, "GPUIO_TEXTURE_POLYFILL".concat(i, "(").concat(name));
    });
    var remainingTextureCalls = shaderSource.match(/\btexture(2D)?\(/g);
    if (remainingTextureCalls === null || remainingTextureCalls === void 0 ? void 0 : remainingTextureCalls.length) {
        console.warn('Fragment shader polyfill has missed some calls to texture().', shaderSource);
    }
    var polyfillUniforms = {};
    for (var i = 0; i < samplerUniforms.length; i++) {
        // Init uniforms with a type.
        polyfillUniforms["".concat(exports.SAMPLER2D_HALF_PX_UNIFORM).concat(i)] = 'vec2';
        polyfillUniforms["".concat(exports.SAMPLER2D_DIMENSIONS_UNIFORM).concat(i)] = 'vec2';
    }
    function make_GPUIO_TEXTURE_POLYFILL(i, prefix, castOpening) {
        if (castOpening === void 0) { castOpening = ''; }
        var castEnding = castOpening === '' ? '' : ')';
        var returnPrefix = castOpening === '' ? prefix : 'i';
        return "\n".concat(returnPrefix, "vec4 GPUIO_TEXTURE_POLYFILL").concat(i, "(const ").concat(prefix, "sampler2D sampler, const vec2 uv) {\n\t").concat(prefix === '' ? "#if (".concat(exports.SAMPLER2D_FILTER).concat(i, " == 0)") : '', "\n\t\t#if (").concat(exports.SAMPLER2D_WRAP_X).concat(i, " == 0)\n\t\t\t#if (").concat(exports.SAMPLER2D_WRAP_Y).concat(i, " == 0)\n\t\t\t\treturn ").concat(castOpening, "texture(sampler, uv)").concat(castEnding, ";\n\t\t\t#else\n\t\t\t\treturn ").concat(castOpening, "GPUIO_TEXTURE_WRAP_CLAMP_REPEAT(sampler, uv, ").concat(exports.SAMPLER2D_HALF_PX_UNIFORM).concat(i, ")").concat(castEnding, ";\n\t\t\t#endif\n\t\t#else\n\t\t\t#if (").concat(exports.SAMPLER2D_WRAP_Y).concat(i, " == 0)\n\t\t\t\treturn ").concat(castOpening, "GPUIO_TEXTURE_WRAP_REPEAT_CLAMP(sampler, uv, ").concat(exports.SAMPLER2D_HALF_PX_UNIFORM).concat(i, ")").concat(castEnding, ";\n\t\t\t#else\n\t\t\t\treturn ").concat(castOpening, "GPUIO_TEXTURE_WRAP_REPEAT_REPEAT(sampler, uv, ").concat(exports.SAMPLER2D_HALF_PX_UNIFORM).concat(i, ")").concat(castEnding, ";\n\t\t\t#endif\n\t\t#endif\n\t").concat(prefix === '' ? "#else\n\t\t#if (".concat(exports.SAMPLER2D_WRAP_X).concat(i, " == 0)\n\t\t\t#if (").concat(exports.SAMPLER2D_WRAP_Y).concat(i, " == 0)\n\t\t\t\treturn ").concat(castOpening, "GPUIO_TEXTURE_BILINEAR_INTERP(sampler, uv, ").concat(exports.SAMPLER2D_HALF_PX_UNIFORM).concat(i, ", ").concat(exports.SAMPLER2D_DIMENSIONS_UNIFORM).concat(i, ")").concat(castEnding, ";\n\t\t\t#else\n\t\t\t\treturn ").concat(castOpening, "GPUIO_TEXTURE_BILINEAR_INTERP_WRAP_CLAMP_REPEAT(sampler, uv, ").concat(exports.SAMPLER2D_HALF_PX_UNIFORM).concat(i, ", ").concat(exports.SAMPLER2D_DIMENSIONS_UNIFORM).concat(i, ")").concat(castEnding, ";\n\t\t\t#endif\n\t\t#else\n\t\t\t#if (").concat(exports.SAMPLER2D_WRAP_Y).concat(i, " == 0)\n\t\t\t\treturn ").concat(castOpening, "GPUIO_TEXTURE_BILINEAR_INTERP_WRAP_REPEAT_CLAMP(sampler, uv, ").concat(exports.SAMPLER2D_HALF_PX_UNIFORM).concat(i, ", ").concat(exports.SAMPLER2D_DIMENSIONS_UNIFORM).concat(i, ")").concat(castEnding, ";\n\t\t\t#else\n\t\t\t\treturn ").concat(castOpening, "GPUIO_TEXTURE_BILINEAR_INTERP_WRAP_REPEAT_REPEAT(sampler, uv, ").concat(exports.SAMPLER2D_HALF_PX_UNIFORM).concat(i, ", ").concat(exports.SAMPLER2D_DIMENSIONS_UNIFORM).concat(i, ")").concat(castEnding, ";\n\t\t\t#endif\n\t\t#endif\n\t#endif") : '', "\n}\n");
    }
    function make_GPUIO_TEXTURE_WRAP(prefix) {
        return "\n".concat(prefix, "vec4 GPUIO_TEXTURE_WRAP_REPEAT_REPEAT(const ").concat(prefix, "sampler2D sampler, const vec2 uv, const vec2 halfPx) {\n\treturn texture(sampler, GPUIO_WRAP_REPEAT_UV(uv));\n}\n").concat(prefix, "vec4 GPUIO_TEXTURE_WRAP_REPEAT_CLAMP(const ").concat(prefix, "sampler2D sampler, vec2 uv, const vec2 halfPx) {\n\tuv.x = GPUIO_WRAP_REPEAT_UV_COORD(uv.x);\n\t// uv.y = GPUIO_WRAP_CLAMP_UV_COORD(uv.y, halfPx.y);\n\treturn texture(sampler, uv);\n}\n").concat(prefix, "vec4 GPUIO_TEXTURE_WRAP_CLAMP_REPEAT(const ").concat(prefix, "sampler2D sampler, vec2 uv, const vec2 halfPx) {\n\t// uv.x = GPUIO_WRAP_CLAMP_UV_COORD(uv.x, halfPx.x);\n\tuv.y = GPUIO_WRAP_REPEAT_UV_COORD(uv.y);\n\treturn texture(sampler, uv);\n}\n");
    }
    function make_GPUIO_BILINEAR_INTERP(wrapType) {
        var lookupFunction = wrapType ? "GPUIO_TEXTURE_WRAP_".concat(wrapType) : 'texture';
        var extraParams = wrapType ? ", halfPx" : '';
        return "\nvec4 GPUIO_TEXTURE_BILINEAR_INTERP".concat(wrapType ? "_WRAP_".concat(wrapType) : '', "(const sampler2D sampler, const vec2 uv, const vec2 halfPx, const vec2 dimensions) {\n\tvec2 pxFraction = fract(uv * dimensions);\n\tvec2 offset = halfPx - vec2(0.00001, 0.00001) * max(\n\t\t\tstep(abs(pxFraction.x - 0.5), 0.001),\n\t\t\tstep(abs(pxFraction.y - 0.5), 0.001)\n\t\t);\n\tvec2 baseUV = uv - offset;\n\tvec2 diagOffset = vec2(offset.x, -offset.y);\n\tvec4 minmin = ").concat(lookupFunction, "(sampler, baseUV").concat(extraParams, ");\n\tvec4 maxmin = ").concat(lookupFunction, "(sampler, uv + diagOffset").concat(extraParams, ");\n\tvec4 minmax = ").concat(lookupFunction, "(sampler, uv - diagOffset").concat(extraParams, ");\n\tvec4 maxmax = ").concat(lookupFunction, "(sampler, uv + offset").concat(extraParams, ");\n\tvec2 t = fract(baseUV * dimensions);\n\tvec4 yMin = mix(minmin, maxmin, t.x);\n\tvec4 yMax = mix(minmax, maxmax, t.x);\n\treturn mix(yMin, yMax, t.y);\n}\n");
    }
    shaderSource = "\n".concat(Object.keys(polyfillUniforms).map(function (key) { return "uniform ".concat(polyfillUniforms[key], " ").concat(key, ";"); }).join('\n'), "\n\nfloat GPUIO_WRAP_REPEAT_UV_COORD(const float coord) {\n\treturn fract(coord + ceil(abs(coord)));\n}\nvec2 GPUIO_WRAP_REPEAT_UV(const vec2 uv) {\n\treturn fract(uv + ceil(abs(uv)));\n}\n// float GPUIO_WRAP_CLAMP_UV_COORD(const float coord, const float halfPx) {\n// \treturn clamp(coord, halfPx, 1.0 - halfPx);\n// }\n\n").concat(make_GPUIO_TEXTURE_WRAP(''), "\n#if (__VERSION__ == 300)\n").concat(['u', 'i'].map(function (prefix) { return make_GPUIO_TEXTURE_WRAP(prefix); }).join('\n'), "\n#endif\n\n").concat([null,
        'REPEAT_REPEAT',
        'REPEAT_CLAMP',
        'CLAMP_REPEAT',
    ].map(function (wrap) { return make_GPUIO_BILINEAR_INTERP(wrap); }).join('\n'), "\n\n").concat(samplerUniforms.map(function (uniform, index) {
        return "#ifndef ".concat(exports.SAMPLER2D_CAST_INT).concat(index, "\n\t").concat(make_GPUIO_TEXTURE_POLYFILL(index, ''), "\n#endif");
    }).join('\n'), "\n#if (__VERSION__ == 300)\n").concat(['u', 'i'].map(function (prefix) {
        return samplerUniforms.map(function (uniform, index) {
            return make_GPUIO_TEXTURE_POLYFILL(index, prefix);
        }).join('\n');
    }).join('\n'), "\n#else\n\t").concat(samplerUniforms.map(function (uniform, index) {
        return "#ifdef ".concat(exports.SAMPLER2D_CAST_INT).concat(index, "\n\t").concat(make_GPUIO_TEXTURE_POLYFILL(index, '', 'ivec4('), "\n#endif");
    }).join('\n'), "\n#endif\n\n").concat(shaderSource);
    return {
        shaderSource: shaderSource,
        samplerUniforms: samplerUniforms,
    };
}
exports.texturePolyfill = texturePolyfill;
function floatTypeForIntType(type) {
    switch (type) {
        case 'int':
        case 'uint':
            return 'float';
        case 'ivec2':
        case 'uvec2':
            return 'vec2';
        case 'ivec3':
        case 'uvec3':
            return 'vec3';
        case 'ivec4':
        case 'uvec4':
            return 'vec4';
    }
    throw new Error("Unknown type ".concat(type, "."));
}
function floatTypeForBoolType(type) {
    switch (type) {
        case 'bool':
            return 'float';
        case 'bvec2':
            return 'vec2';
        case 'bvec3':
            return 'vec3';
        case 'bvec4':
            return 'vec4';
    }
    throw new Error("Unknown type ".concat(type, "."));
}
var GLSL1_POLYFILLS;
/**
 * Polyfill common functions/operators that GLSL1 lacks.
 * @private
 */
function GLSL1Polyfills() {
    if (GLSL1_POLYFILLS)
        return GLSL1_POLYFILLS;
    var abs = function (type) { return "".concat(type, " abs(const ").concat(type, " a) { return ").concat(type, "(abs(").concat(floatTypeForIntType(type), "(a))); }"); };
    var sign = function (type) { return "".concat(type, " sign(const ").concat(type, " a) { return ").concat(type, "(sign(").concat(floatTypeForIntType(type), "(a))); }"); };
    var trunc = function (type) { return "".concat(type, " trunc(const ").concat(type, " a) { return round(a - fract(a) * sign(a)); }"); };
    var round = function (type) { return "".concat(type, " round(const ").concat(type, " a) { return floor(a + 0.5); }"); };
    var roundEven = function (type) { return "".concat(type, " roundEven(const ").concat(type, " a) { return 2.0 * round(a / 2.0); }"); };
    var min = function (type1, type2) { return "".concat(type1, " min(const ").concat(type1, " a, const ").concat(type2, " b) { return ").concat(type1, "(min(").concat(floatTypeForIntType(type1), "(a), ").concat(floatTypeForIntType(type2), "(b))); }"); };
    var max = function (type1, type2) { return "".concat(type1, " max(const ").concat(type1, " a, const ").concat(type2, " b) { return ").concat(type1, "(max(").concat(floatTypeForIntType(type1), "(a), ").concat(floatTypeForIntType(type2), "(b))); }"); };
    var clamp = function (type1, type2) { return "".concat(type1, " clamp(const ").concat(type1, " a, const ").concat(type2, " min, const ").concat(type2, " max) { return ").concat(type1, "(clamp(").concat(floatTypeForIntType(type1), "(a), ").concat(floatTypeForIntType(type2), "(min), ").concat(floatTypeForIntType(type2), "(max))); }"); };
    var mix = function (type1, type2) { return "".concat(type1, " mix(const ").concat(type1, " a, const ").concat(type1, " b, const ").concat(type2, " c) { return mix(a, b, ").concat(floatTypeForBoolType(type2), "(c)); }"); };
    var det2 = function (n, m, size) { return "a[".concat(n, "][").concat(m, "] * a[").concat((n + 1) % size, "][").concat((m + 1) % size, "] - a[").concat((n + 1) % size, "][").concat(m, "] * a[").concat(n, "][").concat((m + 1) % size, "]"); };
    // TODO: I don't think these are quite right yet.
    var det3 = function (n, m, size) { return [0, 1, 2].map(function (offset) { return "a[".concat(n, "][").concat((m + offset) % size, "] * (").concat(det2((n + 1) % size, (m + 1 + offset) % size, size), ")"); }).join(' + '); };
    var det4 = function (n, m, size) { return [0, 1, 2, 3].map(function (offset) { return "a[".concat(n, "][").concat((m + offset) % size, "] * (").concat(det3((n + 1) % size, (m + 1 + offset) % size, size), ")"); }).join(' + '); };
    // We don't need to create unsigned int polyfills, bc unsigned int is not a supported type in GLSL1.
    // All unsigned int variables will be cast as int and be caught by the signed int polyfills.
    GLSL1_POLYFILLS = "\n".concat(abs('int'), "\n").concat(abs('ivec2'), "\n").concat(abs('ivec3'), "\n").concat(abs('ivec4'), "\n\n").concat(sign('int'), "\n").concat(sign('ivec2'), "\n").concat(sign('ivec3'), "\n").concat(sign('ivec4'), "\n\n").concat(round('float'), "\n").concat(round('vec2'), "\n").concat(round('vec3'), "\n").concat(round('vec4'), "\n\n").concat(trunc('float'), "\n").concat(trunc('vec2'), "\n").concat(trunc('vec3'), "\n").concat(trunc('vec4'), "\n\n").concat(roundEven('float'), "\n").concat(roundEven('vec2'), "\n").concat(roundEven('vec3'), "\n").concat(roundEven('vec4'), "\n\n").concat(min('int', 'int'), "\n").concat(min('ivec2', 'ivec2'), "\n").concat(min('ivec3', 'ivec3'), "\n").concat(min('ivec4', 'ivec4'), "\n").concat(min('ivec2', 'int'), "\n").concat(min('ivec3', 'int'), "\n").concat(min('ivec4', 'int'), "\n\n").concat(max('int', 'int'), "\n").concat(max('ivec2', 'ivec2'), "\n").concat(max('ivec3', 'ivec3'), "\n").concat(max('ivec4', 'ivec4'), "\n").concat(max('ivec2', 'int'), "\n").concat(max('ivec3', 'int'), "\n").concat(max('ivec4', 'int'), "\n\n").concat(clamp('int', 'int'), "\n").concat(clamp('ivec2', 'ivec2'), "\n").concat(clamp('ivec3', 'ivec3'), "\n").concat(clamp('ivec4', 'ivec4'), "\n").concat(clamp('ivec2', 'int'), "\n").concat(clamp('ivec3', 'int'), "\n").concat(clamp('ivec4', 'int'), "\n\n").concat(mix('float', 'bool'), "\n").concat(mix('vec2', 'bvec2'), "\n").concat(mix('vec3', 'bvec3'), "\n").concat(mix('vec4', 'bvec4'), "\n\nmat2 outerProduct(const vec2 a, const vec2 b) {\n\treturn mat2(\n\t\ta.x * b.x, a.x * b.y,\n\t\ta.y * b.x, a.y * b.y\n\t);\n}\nmat3 outerProduct(const vec3 a, const vec3 b) {\n\treturn mat3(\n\t\ta.x * b.x, a.x * b.y, a.x * b.z,\n\t\ta.y * b.x, a.y * b.y, a.y * b.z,\n\t\ta.z * b.x, a.z * b.y, a.z * b.z\n\t);\n}\nmat4 outerProduct(const vec4 a, const vec4 b) {\n\treturn mat4(\n\t\ta.x * b.x, a.x * b.y, a.x * b.z, a.x * b.w,\n\t\ta.y * b.x, a.y * b.y, a.y * b.z, a.y * b.w,\n\t\ta.z * b.x, a.z * b.y, a.z * b.z, a.z * b.w,\n\t\ta.w * b.x, a.w * b.y, a.w * b.z, a.w * b.w\n\t);\n}\nmat2 transpose(mat2 a) {\n\tfloat temp = a[0][1];\n\ta[0][1] = a[1][0];\n\ta[1][0] = temp;\n\treturn a;\n}\nmat3 transpose(mat3 a) {\n\tfloat temp = a[0][2];\n\ta[0][2] = a[2][0];\n\ta[2][0] = temp;\n\ttemp = a[0][1];\n\ta[0][1] = a[1][0];\n\ta[1][0] = temp;\n\ttemp = a[1][2];\n\ta[1][2] = a[2][1];\n\ta[2][1] = temp;\n\treturn a;\n}\nmat4 transpose(mat4 a) {\n\tfloat temp = a[0][3];\n\ta[0][3] = a[3][0];\n\ta[3][0] = temp;\n\ttemp = a[0][2];\n\ta[0][2] = a[2][0];\n\ta[2][0] = temp;\n\ttemp = a[2][3];\n\ta[2][3] = a[3][2];\n\ta[3][2] = temp;\n\ttemp = a[0][1];\n\ta[0][1] = a[1][0];\n\ta[1][0] = temp;\n\ttemp = a[1][2];\n\ta[1][2] = a[2][1];\n\ta[2][1] = temp;\n\ttemp = a[2][3];\n\ta[2][3] = a[3][2];\n\ta[3][2] = temp;\n\treturn a;\n}\n\nfloat determinant(const mat2 a) {\n\treturn ").concat(det2(0, 0, 2), ";\n}\nfloat determinant(const mat3 a) {\n\treturn ").concat(det3(0, 0, 3), ";\n}\nfloat determinant(const mat4 a) {\n\treturn ").concat(det4(0, 0, 4), ";\n}\n") +
        // Copied from https://github.com/gpujs/gpu.js/blob/master/src/backend/web-gl/fragment-shader.js
        "\nfloat cosh(const float x) {\n\treturn (pow(".concat(Math.E, ", x) + pow(").concat(Math.E, ", -x)) / 2.0; \n}\nfloat sinh(const float x) {\n\treturn (pow(").concat(Math.E, ", x) - pow(").concat(Math.E, ", -x)) / 2.0;\n}\nfloat tanh(const float x) {\n\tfloat e = exp(2.0 * x);\n\treturn (e - 1.0) / (e + 1.0);\n}\nfloat asinh(const float x) {\n\treturn log(x + sqrt(x * x + 1.0));\n}\nfloat acosh(const float x) {\n\treturn log(x + sqrt(x * x - 1.0));\n}\nfloat atanh(float x) {\n\tx = (x + 1.0) / (x - 1.0);\n\treturn 0.5 * log(x * sign(x));\n}");
    return GLSL1_POLYFILLS;
}
exports.GLSL1Polyfills = GLSL1Polyfills;
var FRAGMENT_SHADER_POLYFILLS;
/**
 * Polyfills to be make available for both GLSL1 and GLSL3 fragment shaders.
 * @private
 */
function fragmentShaderPolyfills() {
    if (FRAGMENT_SHADER_POLYFILLS)
        return FRAGMENT_SHADER_POLYFILLS;
    var modi = function (type1, type2) { return "".concat(type1, " modi(const ").concat(type1, " x, const ").concat(type2, " y) { return x - y * (x / y); }"); };
    var stepi = function (type1, type2) { return "".concat(type2, " stepi(const ").concat(type1, " x, const ").concat(type2, " y) { return ").concat(type2, "(step(").concat(floatTypeForIntType(type1), "(x), ").concat(floatTypeForIntType(type2), "(y))); }"); };
    var bitshiftLeft = function (type1, type2) {
        return "".concat(type1, " bitshiftLeft(const ").concat(type1, " a, const ").concat(type2, " b) {\n\t#if (__VERSION__ == 300)\n\t\treturn a << b;\n\t#else\n\t\treturn a * ").concat(type1, "(pow(").concat(floatTypeForIntType(type2), "(2.0), ").concat(floatTypeForIntType(type2), "(b)));\n\t#endif\n}");
    };
    var bitshiftRight = function (type1, type2) {
        return "".concat(type1, " bitshiftRight(const ").concat(type1, " a, const ").concat(type2, " b) {\n\t#if (__VERSION__ == 300)\n\t\treturn a >> b;\n\t#else\n\t\treturn ").concat(type1, "(round(").concat(floatTypeForIntType(type1), "(a) / pow(").concat(floatTypeForIntType(type2), "(2.0), ").concat(floatTypeForIntType(type2), "(b))));\n\t#endif\n}");
    };
    // Copied from https://github.com/gpujs/gpu.js/blob/master/src/backend/web-gl/fragment-shader.js
    // Seems like these could be optimized.
    var bitwiseOr = function (numBits) {
        return "int bitwiseOr".concat(numBits === 32 ? '' : numBits, "(int a, int b) {\n\t#if (__VERSION__ == 300)\n\t\treturn a | b;\n\t#else\n\t\tint result = 0;\n\t\tint n = 1;\n\t\t\n\t\tfor (int i = 0; i < ").concat(numBits, "; i++) {\n\t\t\tif ((modi(a, 2) == 1) || (modi(b, 2) == 1)) {\n\t\t\t\tresult += n;\n\t\t\t}\n\t\t\ta = a / 2;\n\t\t\tb = b / 2;\n\t\t\tn = n * 2;\n\t\t\tif(!(a > 0 || b > 0)) {\n\t\t\t\tbreak;\n\t\t\t}\n\t\t}\n\t\treturn result;\n\t#endif\n}");
    };
    var bitwiseXOR = function (numBits) {
        return "int bitwiseXOR".concat(numBits === 32 ? '' : numBits, "(int a, int b) {\n\t#if (__VERSION__ == 300)\n\t\treturn a ^ b;\n\t#else\n\t\tint result = 0;\n\t\tint n = 1;\n\t\t\n\t\tfor (int i = 0; i < ").concat(numBits, "; i++) {\n\t\t\tif ((modi(a, 2) == 1) != (modi(b, 2) == 1)) {\n\t\t\t\tresult += n;\n\t\t\t}\n\t\t\ta = a / 2;\n\t\t\tb = b / 2;\n\t\t\tn = n * 2;\n\t\t\tif(!(a > 0 || b > 0)) {\n\t\t\t\tbreak;\n\t\t\t}\n\t\t}\n\t\treturn result;\n\t#endif\n}");
    };
    var bitwiseAnd = function (numBits) {
        return "int bitwiseAnd".concat(numBits === 32 ? '' : numBits, "(int a, int b) {\n\t#if (__VERSION__ == 300)\n\t\treturn a & b;\n\t#else\n\t\tint result = 0;\n\t\tint n = 1;\n\t\tfor (int i = 0; i < ").concat(numBits, "; i++) {\n\t\t\tif ((modi(a, 2) == 1) && (modi(b, 2) == 1)) {\n\t\t\t\tresult += n;\n\t\t\t}\n\t\t\ta = a / 2;\n\t\t\tb = b / 2;\n\t\t\tn = n * 2;\n\t\t\tif(!(a > 0 && b > 0)) {\n\t\t\t\tbreak;\n\t\t\t}\n\t\t}\n\t\treturn result;\n\t#endif\n}");
    };
    var bitwiseNot = function (numBits) {
        return "int bitwiseNot".concat(numBits === 32 ? '' : numBits, "(int a) {\n\t#if (__VERSION__ == 300)\n\t\treturn ~a;\n\t#else\n\t\tint result = 0;\n\t\tint n = 1;\n\n\t\tfor (int i = 0; i < ").concat(numBits, "; i++) {\n\t\t\tif (modi(a, 2) == 0) {\n\t\t\t\tresult += n;\n\t\t\t}\n\t\t\ta = a / 2;\n\t\t\tn = n * 2;\n\t\t}\n\t\treturn result;\n\t#endif\n}");
    };
    FRAGMENT_SHADER_POLYFILLS = "\n".concat(modi('int', 'int'), "\n").concat(modi('ivec2', 'ivec2'), "\n").concat(modi('ivec3', 'ivec3'), "\n").concat(modi('ivec4', 'ivec4'), "\n").concat(modi('ivec2', 'int'), "\n").concat(modi('ivec3', 'int'), "\n").concat(modi('ivec4', 'int'), "\n#if (__VERSION__ == 300)\n").concat(modi('uint', 'uint'), "\n").concat(modi('uvec2', 'uvec2'), "\n").concat(modi('uvec3', 'uvec3'), "\n").concat(modi('uvec4', 'uvec4'), "\n").concat(modi('uvec2', 'uint'), "\n").concat(modi('uvec3', 'uint'), "\n").concat(modi('uvec4', 'uint'), "\n#endif\n\n").concat(stepi('int', 'int'), "\n").concat(stepi('ivec2', 'ivec2'), "\n").concat(stepi('ivec3', 'ivec3'), "\n").concat(stepi('ivec4', 'ivec4'), "\n").concat(stepi('int', 'ivec2'), "\n").concat(stepi('int', 'ivec3'), "\n").concat(stepi('int', 'ivec4'), "\n#if (__VERSION__ == 300)\n").concat(stepi('uint', 'uint'), "\n").concat(stepi('uvec2', 'uvec2'), "\n").concat(stepi('uvec3', 'uvec3'), "\n").concat(stepi('uvec4', 'uvec4'), "\n").concat(stepi('uint', 'uvec2'), "\n").concat(stepi('uint', 'uvec3'), "\n").concat(stepi('uint', 'uvec4'), "\n#endif\n\n").concat(bitshiftLeft('int', 'int'), "\n").concat(bitshiftLeft('ivec2', 'ivec2'), "\n").concat(bitshiftLeft('ivec3', 'ivec3'), "\n").concat(bitshiftLeft('ivec4', 'ivec4'), "\n").concat(bitshiftLeft('ivec2', 'int'), "\n").concat(bitshiftLeft('ivec3', 'int'), "\n").concat(bitshiftLeft('ivec4', 'int'), "\n#if (__VERSION__ == 300)\n").concat(bitshiftLeft('uint', 'uint'), "\n").concat(bitshiftLeft('uvec2', 'uvec2'), "\n").concat(bitshiftLeft('uvec3', 'uvec3'), "\n").concat(bitshiftLeft('uvec4', 'uvec4'), "\n").concat(bitshiftLeft('uvec2', 'uint'), "\n").concat(bitshiftLeft('uvec3', 'uint'), "\n").concat(bitshiftLeft('uvec4', 'uint'), "\n#endif\n\n").concat(bitshiftRight('int', 'int'), "\n").concat(bitshiftRight('ivec2', 'ivec2'), "\n").concat(bitshiftRight('ivec3', 'ivec3'), "\n").concat(bitshiftRight('ivec4', 'ivec4'), "\n").concat(bitshiftRight('ivec2', 'int'), "\n").concat(bitshiftRight('ivec3', 'int'), "\n").concat(bitshiftRight('ivec4', 'int'), "\n#if (__VERSION__ == 300)\n").concat(bitshiftRight('uint', 'uint'), "\n").concat(bitshiftRight('uvec2', 'uvec2'), "\n").concat(bitshiftRight('uvec3', 'uvec3'), "\n").concat(bitshiftRight('uvec4', 'uvec4'), "\n").concat(bitshiftRight('uvec2', 'uint'), "\n").concat(bitshiftRight('uvec3', 'uint'), "\n").concat(bitshiftRight('uvec4', 'uint'), "\n#endif\n\n").concat(bitwiseOr(8), "\n").concat(bitwiseOr(16), "\n").concat(bitwiseOr(32), "\n\n").concat(bitwiseXOR(8), "\n").concat(bitwiseXOR(16), "\n").concat(bitwiseXOR(32), "\n\n").concat(bitwiseAnd(8), "\n").concat(bitwiseAnd(16), "\n").concat(bitwiseAnd(32), "\n\n").concat(bitwiseNot(8), "\n").concat(bitwiseNot(16), "\n").concat(bitwiseNot(32), "\n\n#if (__VERSION__ == 300)\n").concat([8, 16, ''].map(function (suffix) {
        return "\nuint bitwiseOr".concat(suffix, "(uint a, uint b) {\n\treturn uint(bitwiseOr").concat(suffix, "(int(a), int(b)));\n}\nuint bitwiseXOR").concat(suffix, "(uint a, uint b) {\n\treturn uint(bitwiseXOR").concat(suffix, "(int(a), int(b)));\n}\nuint bitwiseAnd").concat(suffix, "(uint a, uint b) {\n\treturn uint(bitwiseAnd").concat(suffix, "(int(a), int(b)));\n}\nuint bitwiseNot").concat(suffix, "(uint a) {\n\treturn uint(bitwiseNot").concat(suffix, "(int(a)));\n}");
    }).join('\n'), "\n\n#endif\n");
    return FRAGMENT_SHADER_POLYFILLS;
}
exports.fragmentShaderPolyfills = fragmentShaderPolyfills;


/***/ }),

/***/ 126:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getSampler2DsInProgram = exports.stripComments = exports.stripPrecision = exports.stripVersion = exports.highpToMediump = exports.glsl1Uint = exports.glsl1Sampler2D = exports.glsl1Texture = exports.checkFragmentShaderForFragColor = exports.glsl1FragmentOut = exports.getFragmentOuts = exports.glsl1FragmentIn = exports.glsl1VertexOut = exports.castVaryingToFloat = exports.glsl1VertexIn = void 0;
var constants_1 = __webpack_require__(601);
/**
 * Convert vertex shader "in" to "attribute".
 * @private
 */
function glsl1VertexIn(shaderSource) {
    return shaderSource.replace(/\bin\b/g, 'attribute');
}
exports.glsl1VertexIn = glsl1VertexIn;
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
/**
 * Typecast variable assignment.
 * This is used in cases when e.g. varyings have to be converted to float in GLSL1.
 */
function typecastVariable(shaderSource, variableName, type) {
    // "s" makes this work for multiline values.
    // Do this without lookbehind to support older browsers.
    // const regexMatch = new RegExp(`(?<=\\b${escapeRegExp(variableName)}\\s*=\\s*)\\S[^;]*(?=;)`, 'sg');
    var regexMatch = new RegExp("\\b".concat(escapeRegExp(variableName), "\\s*=\\s*\\S[^;]*;"), 'sg');
    var assignmentExpressions = shaderSource.match(regexMatch);
    if (assignmentExpressions) {
        // Loop through all places where variable is assigned and typecast.
        for (var i = 0; i < assignmentExpressions.length; i++) {
            var regexValueMatch = new RegExp("\\b".concat(escapeRegExp(variableName), "\\s*=\\s*(\\S[^;]*);"), 's');
            var value = assignmentExpressions[i].match(regexValueMatch);
            if (value && value[1]) {
                var regexReplace = new RegExp("\\b".concat(escapeRegExp(variableName), "\\s*=\\s*").concat(escapeRegExp(value[1]), "\\s*;"), 's');
                shaderSource = shaderSource.replace(regexReplace, "".concat(variableName, " = ").concat(type, "(").concat(value[1], ");"));
            }
            else {
                console.warn("Could not find value in expression: \"".concat(assignmentExpressions[i], "\""));
            }
        }
    }
    else {
        console.warn("No assignment found for shader variable ".concat(variableName, "."));
    }
    return shaderSource;
}
/**
 * Convert int varyings to float types.
 * Also update any variable assignments so that they are cast to float.
 * @private
 */
function _castVaryingToFloat(shaderSource, regexString, type) {
    // Do this without lookbehind to support older browsers.
    // const regexMatch = new RegExp(`(?<=${regexString}\\s+)\\S[^;]*(?=;)`, 'g');
    var regexMatch = new RegExp("".concat(regexString, "\\s+\\S[^;]*;"), 'g');
    var castToFloatExpressions = shaderSource.match(regexMatch);
    if (castToFloatExpressions) {
        // Replace all with new type.
        var regexReplace = new RegExp("".concat(regexString, "\\b"), 'g');
        shaderSource = shaderSource.replace(regexReplace, "varying ".concat(type));
        // Loop through each expression, grab variable name, and cast all assignments.
        for (var i = 0; i < castToFloatExpressions.length; i++) {
            var regexVariableMatch = new RegExp("".concat(regexString, "\\s+(\\S[^;]*);"));
            var variable = castToFloatExpressions[i].match(regexVariableMatch);
            if (variable && variable[2]) {
                shaderSource = typecastVariable(shaderSource, variable[2], type);
            }
            else {
                console.warn("Could not find variable name in expression: \"".concat(castToFloatExpressions[i], "\""));
            }
        }
    }
    return shaderSource;
}
/**
 * Convert int varyings to float types.
 * Only exported for testing.
 * @private
 */
function castVaryingToFloat(shaderSource) {
    // Need to init all expressions with the same number of capturing groups
    // so that this will work in _castVaryingToFloat.
    shaderSource = _castVaryingToFloat(shaderSource, '\\bvarying\\s+(u)?int', 'float');
    shaderSource = _castVaryingToFloat(shaderSource, '\\bvarying\\s+(i|u)vec2', 'vec2');
    shaderSource = _castVaryingToFloat(shaderSource, '\\bvarying\\s+(i|u)vec3', 'vec3');
    shaderSource = _castVaryingToFloat(shaderSource, '\\bvarying\\s+(i|u)vec4', 'vec4');
    return shaderSource;
}
exports.castVaryingToFloat = castVaryingToFloat;
/**
 * Convert vertex shader "out" to "varying".
 * Also remove "flat" if necessary.
 * Also cast as float if necessary.
 * @private
 */
function glsl1VertexOut(shaderSource) {
    shaderSource = shaderSource.replace(/(\bflat\s+)?\bout\b/g, 'varying');
    shaderSource = castVaryingToFloat(shaderSource);
    return shaderSource;
}
exports.glsl1VertexOut = glsl1VertexOut;
/**
 * Convert fragment shader "in" to "varying".
 * Also remove "flat" if necessary.
 * Also cast as float if necessary.
 * @private
 */
function glsl1FragmentIn(shaderSource) {
    shaderSource = shaderSource.replace(/(\bflat\s+)?\bin\b/g, 'varying');
    shaderSource = castVaryingToFloat(shaderSource);
    return shaderSource;
}
exports.glsl1FragmentIn = glsl1FragmentIn;
/**
 * Get variable name, type, and layout number for out variables.
 * Only exported for testing.
 * @private
 */
function getFragmentOuts(shaderSource, programName) {
    var outs = {};
    var maxLocation = 0;
    while (true) {
        // Do this without lookbehind to support older browsers.
        var match = shaderSource.match(/\b(layout\s*\(\s*location\s*=\s*([0-9]+)\s*\)\s*)?out\s+((lowp|mediump|highp)\s+)?((float|int|uint|([iu]?vec[234]))\s+)?([_$a-zA-Z0-9]+)\s*;/);
        if (!match) {
            if (Object.keys(outs).length === 0) {
                return [];
            }
            // Sort by location.
            var variableNames = Object.keys(outs);
            var numVariables = variableNames.length;
            var outsSorted = new Array(maxLocation).fill(undefined);
            for (var i = 0; i < numVariables; i++) {
                var name_1 = variableNames[i];
                var _a = outs[name_1], location_1 = _a.location, type_1 = _a.type;
                if (outsSorted[location_1] !== undefined) {
                    throw new Error("Must be exactly one out declaration per layout location in GPUProgram \"".concat(programName, "\", conflicting declarations found at location ").concat(location_1, "."));
                }
                outsSorted[location_1] = { name: name_1, type: type_1 };
            }
            if (variableNames.length !== maxLocation + 1) {
                throw new Error("Must be exactly one out declaration per layout location in GPUProgram \"".concat(programName, "\", layout locations must be sequential (no missing location numbers) starting from 0."));
            }
            for (var i = 0; i <= maxLocation; i++) {
                if (outsSorted[i] === undefined) {
                    throw new Error("Missing out declaration at location ".concat(i, " in GPUProgram \"").concat(programName, "\", layout locations must be sequential (no missing location numbers) starting from 0."));
                }
            }
            return outsSorted;
        }
        // Save out parameters.
        var name_2 = match[8];
        var location_2 = parseInt(match[2] || '0');
        var type = match[6];
        if (!type) {
            throw new Error("No type found for out declaration \"".concat(match[0], "\" for GPUProgram \"").concat(programName, "\"."));
        }
        if (!name_2) {
            throw new Error("No variable name found for out declaration \"".concat(match[0], "\" for GPUProgram \"").concat(programName, "\"."));
        }
        if (outs[name_2]) {
            if (outs[name_2].location !== location_2) {
                throw new Error("All out declarations for variable \"".concat(name_2, "\" must have same location in GPUProgram \"").concat(programName, "\"."));
            }
        }
        else {
            if (location_2 > maxLocation)
                maxLocation = location_2;
            outs[name_2] = {
                location: location_2,
                type: type,
            };
        }
        // Remove out definition so we can match to the next one.
        shaderSource = shaderSource.replace(match[0], '');
    }
}
exports.getFragmentOuts = getFragmentOuts;
/**
 * Convert out variables to gl_FragColor.
 * @private
 */
function glsl1FragmentOut(shaderSource, programName) {
    var outs = getFragmentOuts(shaderSource, programName);
    if (outs.length === 0) {
        return [shaderSource];
    }
    // Remove layout declarations.
    shaderSource = shaderSource.replace(/\blayout\s*\(\s*location\s*=\s*([0-9]+)\s*\)\s*/g, '');
    // If we detect multiple out declarations, we need to split the shader source.
    var shaderSources = [];
    for (var i = 0, numOuts = outs.length; i < numOuts; i++) {
        var _a = outs[i], type = _a.type, name_3 = _a.name;
        // Remove out declaration for this variable.
        var outRegex = new RegExp("\\bout\\s+((lowp|mediump|highp)\\s+)?(float|int|uint|([iu]?vec[234]))\\s+".concat(name_3, "\\s*;"), 'g');
        var outShaderSource = shaderSource.replace(outRegex, '');
        // Remove any other out declarations.
        outShaderSource = outShaderSource.replace(/\bout\b/g, '');
        var assignmentFound = false;
        // Replace each instance of "name =" with gl_FragColor = and cast to vec4.
        // Do this without lookbehind to support older browsers.
        // const output = outShaderSource.match(/(?<=\b${name}\s*=\s*)\S.*(?=;)/s); // /s makes this work for multiline.
        // ? puts this in lazy mode (match shortest strings).
        var regex = new RegExp("\\b".concat(name_3, "\\s*=\\s*(\\S.*?);"), 's'); // 's' makes this work for multiline.
        while (true) {
            var output = outShaderSource.match(regex);
            if (output && output[1]) {
                assignmentFound = true;
                var filler = '';
                switch (type) {
                    case 'float':
                    case 'int':
                    case 'uint':
                        filler = ', 0, 0, 0';
                        break;
                    case 'vec2':
                    case 'ivec2':
                    case 'uvec2':
                        filler = ', 0, 0';
                        break;
                    case 'vec3':
                    case 'ivec3':
                    case 'uvec3':
                        filler = ', 0';
                        break;
                }
                outShaderSource = outShaderSource.replace(regex, "gl_FragColor = vec4(".concat(output[1]).concat(filler, ");"));
            }
            else {
                if (!assignmentFound)
                    throw new Error("No assignment found for out declaration in GPUProgram \"".concat(programName, "\"."));
                break;
            }
        }
        shaderSources.push(outShaderSource);
    }
    return shaderSources;
}
exports.glsl1FragmentOut = glsl1FragmentOut;
/**
 * Contains gl_FragColor.
 * @private
 */
function containsGLFragColor(shaderSource) {
    return !!shaderSource.match(/\bgl_FragColor\b/);
}
/**
 * Check for presence of gl_FragColor in fragment shader source.
 * @private
 */
function checkFragmentShaderForFragColor(shaderSource, glslVersion, name) {
    var gl_FragColor = containsGLFragColor(shaderSource);
    if (glslVersion === constants_1.GLSL3) {
        // Check that fragment shader source DOES NOT contain gl_FragColor
        if (gl_FragColor) {
            throw new Error("Found \"gl_FragColor\" declaration in fragment shader for GPUProgram \"".concat(name, "\": either init GPUComposer with glslVersion = GLSL1 or use GLSL3 syntax in your fragment shader."));
        }
    }
}
exports.checkFragmentShaderForFragColor = checkFragmentShaderForFragColor;
/**
 * Convert texture to texture2D.
 * @private
 */
function glsl1Texture(shaderSource) {
    return shaderSource.replace(/\btexture\(/g, 'texture2D(');
}
exports.glsl1Texture = glsl1Texture;
/**
 * Convert isampler2D and usampler2D to sampler2D.
 * @private
 */
function glsl1Sampler2D(shaderSource) {
    return shaderSource.replace(/\b(i|u)sampler2D\b/g, 'sampler2D');
}
exports.glsl1Sampler2D = glsl1Sampler2D;
/**
 * Unsigned int types are not supported, use int types instead.
 * @private
 */
function glsl1Uint(shaderSource) {
    shaderSource = shaderSource.replace(/\buint\b/g, 'int');
    shaderSource = shaderSource.replace(/\buvec2\b/g, 'ivec2');
    shaderSource = shaderSource.replace(/\buvec3\b/g, 'ivec3');
    shaderSource = shaderSource.replace(/\buvec4\b/g, 'ivec4');
    shaderSource = shaderSource.replace(/\buint\(/g, 'int(');
    shaderSource = shaderSource.replace(/\buvec2\(/g, 'ivec2(');
    shaderSource = shaderSource.replace(/\buvec3\(/g, 'ivec3(');
    shaderSource = shaderSource.replace(/\buvec4\(/g, 'ivec4(');
    return shaderSource;
}
exports.glsl1Uint = glsl1Uint;
/**
 * Replace all highp with mediump.
 * @private
 */
function highpToMediump(shaderSource) {
    return shaderSource.replace(/\bhighp\b/, 'mediump');
}
exports.highpToMediump = highpToMediump;
/**
 * Strip out any version numbers.
 * https://github.com/Jam3/glsl-version-regex
 * @private
 */
function stripVersion(shaderSource) {
    var origLength = shaderSource.length;
    shaderSource = shaderSource.replace(/^\s*\#version\s+([0-9]+(\s+(es)+)?)\s*/, '');
    if (shaderSource.length !== origLength) {
        console.warn('GPUIO expects shader source that does not contain #version declarations, removing....');
    }
    return shaderSource;
}
exports.stripVersion = stripVersion;
/**
 * Strip out any precision declarations.
 * @private
 */
function stripPrecision(shaderSource) {
    var origLength = shaderSource.length;
    shaderSource = shaderSource.replace(/\s*precision\s+((highp)|(mediump)|(lowp))\s+[a-zA-Z0-9]+\s*;/g, '');
    if (shaderSource.length !== origLength) {
        console.warn('GPUIO expects shader source that does not contain precision declarations, removing....');
    }
    return shaderSource;
}
exports.stripPrecision = stripPrecision;
/**
 * Strip out comments from shader code.
 * @private
 */
function stripComments(shaderSource) {
    shaderSource = shaderSource.replace(/[\t ]*\/\/.*\n/g, ''); // Remove single-line comments.
    // ? puts this in lazy mode (match shortest strings).
    shaderSource = shaderSource.replace(/\/\*.*?\*\//gs, ''); /* Remove multi-line comments */
    return shaderSource;
}
exports.stripComments = stripComments;
/**
 * Get the number of sampler2D's in a fragment shader program.
 * @private
 */
function getSampler2DsInProgram(shaderSource) {
    // Do this without lookbehind to support older browsers.
    // const samplers = shaderSource.match(/(?<=\buniform\s+(((highp)|(mediump)|(lowp))\s+)?(i|u)?sampler2D\s+)\w+(?=\s?;)/g);
    var samplersNoDuplicates = {};
    var regex = '\\buniform\\s+(((highp)|(mediump)|(lowp))\\s+)?(i|u)?sampler2D\\s+(\\w+)\\s*;';
    var samplers = shaderSource.match(new RegExp(regex, 'g'));
    if (!samplers || samplers.length === 0)
        return [];
    // We need to be a bit careful as same sampler could be declared multiple times if compile time conditionals are used.
    // Extract uniform name.
    var uniformMatch = new RegExp(regex);
    samplers.forEach(function (sampler) {
        var uniform = sampler.match(uniformMatch);
        if (!uniform || !uniform[7]) {
            console.warn("Could not find sampler2D uniform name in string \"".concat(sampler, "\"."));
            return;
        }
        samplersNoDuplicates[uniform[7]] = true;
    });
    return Object.keys(samplersNoDuplicates);
}
exports.getSampler2DsInProgram = getSampler2DsInProgram;


/***/ }),

/***/ 593:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.readPixelsAsync = exports.indexOfLayerInArray = exports.uniformInternalTypeForValue = exports.preprocessFragmentShader = exports.preprocessVertexShader = exports.convertFragmentShaderToGLSL1 = exports.initSequentialFloatArray = exports.isPowerOf2 = exports.getFragmentShaderMediumpPrecision = exports.getVertexShaderMediumpPrecision = exports.isHighpSupportedInFragmentShader = exports.isHighpSupportedInVertexShader = exports.readyToRead = exports.isWebGL2Supported = exports.isWebGL2 = exports.initGLProgram = exports.compileShader = exports.makeShaderHeader = exports.isIntType = exports.isSignedIntType = exports.isUnsignedIntType = exports.isFloatType = void 0;
var type_checks_1 = __webpack_require__(566);
var constants_1 = __webpack_require__(601);
var conversions_1 = __webpack_require__(690);
var precision_1 = __webpack_require__(724);
var polyfills_1 = __webpack_require__(360);
var regex_1 = __webpack_require__(126);
/**
 * Memoize results of more complex WebGL tests (that require allocations/deallocations).
 * @private
 */
var results = {
    supportsWebGL2: undefined,
    supportsHighpVertex: undefined,
    supportsHighpFragment: undefined,
    mediumpVertexPrecision: undefined,
    mediumpFragmentPrecision: undefined,
};
/**
 * Test whether a GPULayer type is a float type.
 * @private
 */
function isFloatType(type) {
    return type === constants_1.FLOAT || type === constants_1.HALF_FLOAT;
}
exports.isFloatType = isFloatType;
/**
 * Test whether a GPULayer type is an unsigned int type.
 * @private
 */
function isUnsignedIntType(type) {
    return type === constants_1.UNSIGNED_BYTE || type === constants_1.UNSIGNED_SHORT || type === constants_1.UNSIGNED_INT;
}
exports.isUnsignedIntType = isUnsignedIntType;
/**
 * Test whether a GPULayer type is a signed int type.
 * @private
 */
function isSignedIntType(type) {
    return type === constants_1.BYTE || type === constants_1.SHORT || type === constants_1.INT;
}
exports.isSignedIntType = isSignedIntType;
/**
 * Test whether a GPULayer type is a int type.
 * @private
 */
function isIntType(type) {
    return isUnsignedIntType(type) || isSignedIntType(type);
}
exports.isIntType = isIntType;
/**
 * Create a string to pass compile time constants into shader.
 * @private
 */
function convertCompileTimeConstantsToString(compileTimeConstants) {
    var CTCSource = '';
    var keys = Object.keys(compileTimeConstants);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        // Check that define is passed in as a string.
        if (!(0, type_checks_1.isString)(key) || !(0, type_checks_1.isString)(compileTimeConstants[key])) {
            throw new Error("GPUProgram compile time constants must be passed in as key value pairs that are both strings, got key value pair of type [".concat(typeof key, " : ").concat(typeof compileTimeConstants[key], "] for key ").concat(key, "."));
        }
        CTCSource += "#define ".concat(key, " ").concat(compileTimeConstants[key], "\n");
    }
    return CTCSource;
}
/**
 * Create header string for fragment and vertex shaders.
 * Export this for testing purposes.
 * @private
 */
function makeShaderHeader(glslVersion, intPrecision, floatPrecision, compileTimeConstants) {
    var _a;
    var versionSource = glslVersion === constants_1.GLSL3 ? "#version ".concat(constants_1.GLSL3, "\n") : '';
    var compileTimeConstantsSource = compileTimeConstants ? convertCompileTimeConstantsToString(compileTimeConstants) : '';
    var precisionConstantsSource = convertCompileTimeConstantsToString((_a = {},
        _a[constants_1.GPUIO_INT_PRECISION] = "".concat((0, conversions_1.intForPrecision)(intPrecision)),
        _a[constants_1.GPUIO_FLOAT_PRECISION] = "".concat((0, conversions_1.intForPrecision)(floatPrecision)),
        _a));
    return "".concat(versionSource).concat(compileTimeConstantsSource).concat(precisionConstantsSource).concat(precision_1.PRECISION_SOURCE);
}
exports.makeShaderHeader = makeShaderHeader;
/**
 * Compile vertex or fragment shaders.
 * Fragment shaders may be compiled on the fly, so keep this efficient.
 * Copied from http://webglfundamentals.org/webgl/lessons/webgl-boilerplate.html
 * @private
 */
function compileShader(gl, glslVersion, intPrecision, floatPrecision, shaderSource, shaderType, programName, errorCallback, compileTimeConstants, checkCompileStatus) {
    if (checkCompileStatus === void 0) { checkCompileStatus = false; }
    // Create the shader object
    var shader = gl.createShader(shaderType);
    if (!shader) {
        errorCallback('Unable to init gl shader.');
        return null;
    }
    // Set the shader source code.
    var shaderHeader = makeShaderHeader(glslVersion, intPrecision, floatPrecision, compileTimeConstants);
    var fullShaderSource = "".concat(shaderHeader).concat(shaderSource);
    gl.shaderSource(shader, fullShaderSource);
    // Compile the shader
    gl.compileShader(shader);
    if (checkCompileStatus) {
        // Check if shaders compiled - do this only on the first compilation bc of:
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices#dont_check_shader_compile_status_unless_linking_fails
        var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!success) {
            // Something went wrong during compilation - print shader source (with line number) and the error.
            console.log(fullShaderSource.split('\n').map(function (line, i) { return "".concat(i, "\t").concat(line); }).join('\n'));
            errorCallback("Could not compile ".concat(shaderType === gl.FRAGMENT_SHADER ? 'fragment' : 'vertex', " shader for program \"").concat(programName, "\": ").concat(gl.getShaderInfoLog(shader), "."));
            return null;
        }
    }
    return shader;
}
exports.compileShader = compileShader;
/**
 * Init a WebGL program from vertex and fragment shaders.
 * GLPrograms may be inited on the fly, so keep this efficient.
 * @private
 */
function initGLProgram(gl, vertexShader, fragmentShader, name, errorCallback) {
    // Create a program.
    var program = gl.createProgram();
    if (!program) {
        errorCallback("Unable to init GL program for GPUProgram \"".concat(name, "\", gl.createProgram() has failed."));
        return;
    }
    // Link the program.
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    // Check if it linked.
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) {
        // Something went wrong with the link.
        errorCallback("GPUProgram \"".concat(name, "\" failed to link: ").concat(gl.getProgramInfoLog(program)));
        return;
    }
    return program;
}
exports.initGLProgram = initGLProgram;
/**
 * Returns whether a WebGL context is WebGL2.
 * This code is pulled from https://github.com/mrdoob/three.js/blob/master/src/renderers/webgl/WebGLCapabilities.js
 * @param gl - WebGL context to test.
 * @returns - true if WebGL2 context, else false.
 */
function isWebGL2(gl) {
    // @ts-ignore
    return (typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext) || (typeof WebGL2ComputeRenderingContext !== 'undefined' && gl instanceof WebGL2ComputeRenderingContext);
}
exports.isWebGL2 = isWebGL2;
/**
 * Returns whether WebGL2 is supported by the current browser.
 * @returns - true if WebGL2 is supported, else false.
*/
function isWebGL2Supported() {
    if (results.supportsWebGL2 === undefined) {
        var gl = document.createElement('canvas').getContext(constants_1.WEBGL2);
        // GL context and canvas will be garbage collected.
        results.supportsWebGL2 = isWebGL2(gl); // Will return false in case of gl = null.
    }
    return results.supportsWebGL2;
}
exports.isWebGL2Supported = isWebGL2Supported;
/**
 * Checks if the framebuffer is ready to read.
 * @private
 */
function readyToRead(gl) {
    return gl.checkFramebufferStatus(gl.FRAMEBUFFER) == gl.FRAMEBUFFER_COMPLETE;
}
exports.readyToRead = readyToRead;
;
/**
 * Detects whether highp is supported by this browser.
 * This is supposed to be relatively easy. You call gl.getShaderPrecisionFormat, you pass in the shader type,
 * VERTEX_SHADER or FRAGMENT_SHADER and you pass in one of LOW_FLOAT, MEDIUM_FLOAT, HIGH_FLOAT, LOW_INT, MEDIUM_INT, HIGH_INT,
 * and it returns the precision info.
 * Unfortunately Safari has a bug here which means checking this way will fail on iPhone, at least as of April 2020.
 * https://webglfundamentals.org/webgl/webgl-precision-lowp-mediump-highp.html
 * @private
 */
function isHighpSupported(vsSource, fsSource) {
    var gl = document.createElement('canvas').getContext(constants_1.WEBGL1);
    if (!gl) {
        throw new Error("Unable to init webgl context.");
    }
    try {
        var vs = compileShader(gl, constants_1.GLSL1, constants_1.PRECISION_HIGH_P, constants_1.PRECISION_HIGH_P, vsSource, gl.VERTEX_SHADER, 'highpFragmentTest', constants_1.DEFAULT_ERROR_CALLBACK);
        var fs = compileShader(gl, constants_1.GLSL1, constants_1.PRECISION_HIGH_P, constants_1.PRECISION_HIGH_P, fsSource, gl.FRAGMENT_SHADER, 'highpFragmentTest', constants_1.DEFAULT_ERROR_CALLBACK);
        var program = initGLProgram(gl, vs, fs, 'highpFragmentTest', constants_1.DEFAULT_ERROR_CALLBACK);
        // Deallocate everything.
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        // GL context and canvas will be garbage collected.
    }
    catch (_a) {
        return false;
    }
    return true;
}
/**
 * Detects whether highp precision is supported in vertex shaders in the current browser.
 * @returns - true is highp is supported in vertex shaders, else false.
 */
function isHighpSupportedInVertexShader() {
    if (results.supportsHighpVertex === undefined) {
        var vertexSupport = isHighpSupported('void main() { highp float test = 0.524; gl_Position = vec4(test, test, 0, 1); }', 'void main() { gl_FragColor = vec4(0); }');
        results.supportsHighpVertex = vertexSupport;
    }
    return results.supportsHighpVertex;
}
exports.isHighpSupportedInVertexShader = isHighpSupportedInVertexShader;
/**
 * Detects whether highp precision is supported in fragment shaders in the current browser.
 * @returns - true is highp is supported in fragment shaders, else false.
 */
function isHighpSupportedInFragmentShader() {
    if (results.supportsHighpFragment === undefined) {
        var fragmentSupport = isHighpSupported('void main() { gl_Position = vec4(0.5, 0.5, 0, 1); }', 'void main() { highp float test = 1.35; gl_FragColor = vec4(test); }');
        results.supportsHighpFragment = fragmentSupport;
    }
    return results.supportsHighpFragment;
}
exports.isHighpSupportedInFragmentShader = isHighpSupportedInFragmentShader;
/**
 * Helper function to perform a 1px math calculation in order to determine WebGL capabilities.
 * From https://webglfundamentals.org/
 * @private
 */
function test1PxCalc(name, gl, fs, vs, addUniforms) {
    var program = initGLProgram(gl, vs, fs, name, constants_1.DEFAULT_ERROR_CALLBACK);
    if (!program) {
        throw new Error("Unable to init WebGLProgram.");
    }
    var positionLocation = gl.getAttribLocation(program, 'position');
    // create a buffer and setup an attribute
    // We wouldn't need this except for a bug in Safari.
    // See https://webglfundamentals.org/webgl/lessons/webgl-smallest-programs.html
    // and https://bugs.webkit.org/show_bug.cgi?id=197592
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, 1, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 1, // pull 1 value per vertex shader iteration from buffer
    gl.UNSIGNED_BYTE, // type of data in buffer,
    false, // don't normalize
    0, // bytes to advance per iteration (0 = compute from size and type)
    0);
    gl.viewport(0, 0, 1, 1);
    gl.useProgram(program);
    addUniforms(program);
    gl.drawArrays(gl.POINTS, 0, // offset
    1);
    var pixel = new Uint8Array(4);
    gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
    // Deallocate everything.
    gl.disableVertexAttribArray(positionLocation);
    gl.deleteProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    gl.deleteBuffer(buffer);
    // GL context and canvas will be garbage collected.
    return pixel;
}
/**
 * Returns the actual precision of mediump inside vertex shader.
 * From https://webglfundamentals.org/webgl/lessons/webgl-precision-issues.html
 * @returns - Vertex shader mediump precision.
 */
function getVertexShaderMediumpPrecision() {
    if (results.mediumpVertexPrecision === undefined) {
        // This entire program is only needed because of a bug in Safari.
        // Safari doesn't correctly report precision from getShaderPrecisionFormat
        // at least as of April 2020
        // see: https://bugs.webkit.org/show_bug.cgi?id=211013
        // Get A WebGL context
        /** @type {HTMLCanvasElement} */
        var canvas = document.createElement("canvas");
        var gl_1 = canvas.getContext("webgl");
        if (!gl_1) {
            throw new Error("Unable to init webgl context.");
        }
        var vs = compileShader(gl_1, constants_1.GLSL1, constants_1.PRECISION_MEDIUM_P, constants_1.PRECISION_MEDIUM_P, "\n\tattribute vec4 position;  // needed because of another bug in Safari\n\tuniform mediump vec3 v;\n\tvarying mediump vec4 v_result;\n\tvoid main() {\n\t\tgl_Position = position;\n\t\tgl_PointSize = 1.0;\n\t\tv_result = vec4(normalize(v) * 0.5 + 0.5, 1);\n\t}\n\t\t", gl_1.VERTEX_SHADER, 'mediumpPrecisionVertexTest', constants_1.DEFAULT_ERROR_CALLBACK);
        if (!vs) {
            throw new Error("Unable to init vertex shader.");
        }
        var fs = compileShader(gl_1, constants_1.GLSL1, constants_1.PRECISION_MEDIUM_P, constants_1.PRECISION_MEDIUM_P, "\n\tvarying mediump vec4 v_result;\n\tvoid main() {\n\t\tgl_FragColor = v_result;\n\t}\n\t\t", gl_1.FRAGMENT_SHADER, 'mediumpPrecisionVertexTest', constants_1.DEFAULT_ERROR_CALLBACK);
        if (!fs) {
            throw new Error("Unable to init fragment shader.");
        }
        // we're going to compute the normalize vector of
        // (sqrt(2^31-1), sqrt(2^31-1), sqrt(2^31-1))
        // which should be impossible on mediump
        var value = Math.pow(2, 31) - 1;
        var input_1 = Math.sqrt(value);
        var expected = ((input_1 / Math.sqrt(input_1 * input_1 * 3)) * 0.5 + 0.5) * 255 | 0;
        var pixel = test1PxCalc('mediumpPrecisionVertexTest', gl_1, fs, vs, function (program) {
            var vLocation = gl_1.getUniformLocation(program, 'v');
            gl_1.uniform3f(vLocation, input_1, input_1, input_1);
        });
        var mediumpPrecision = Math.abs(pixel[0] - expected) > 16;
        results.mediumpVertexPrecision = mediumpPrecision ? constants_1.PRECISION_MEDIUM_P : constants_1.PRECISION_HIGH_P;
    }
    return results.mediumpVertexPrecision;
}
exports.getVertexShaderMediumpPrecision = getVertexShaderMediumpPrecision;
/**
 * Returns the actual precision of mediump inside fragment shader.
 * From https://webglfundamentals.org/webgl/lessons/webgl-precision-issues.html
 * @returns - Fragment shader supported mediump precision.
 */
function getFragmentShaderMediumpPrecision() {
    if (results.mediumpFragmentPrecision === undefined) {
        // This entire program is only needed because of a bug in Safari.
        // Safari doesn't correctly report precision from getShaderPrecisionFormat
        // at least as of April 2020
        // see: https://bugs.webkit.org/show_bug.cgi?id=211013
        // Get A WebGL context
        var canvas = document.createElement("canvas");
        var gl_2 = canvas.getContext("webgl");
        if (!gl_2) {
            throw new Error("Unable to init webgl context.");
        }
        var vs = compileShader(gl_2, constants_1.GLSL1, constants_1.PRECISION_MEDIUM_P, constants_1.PRECISION_MEDIUM_P, "\n\tattribute vec4 position;  // needed because of another bug in Safari\n\tvoid main() {\n\t\tgl_Position = position;\n\t\tgl_PointSize = 1.0;\n\t}\n\t\t", gl_2.VERTEX_SHADER, 'mediumpPrecisionFragmentTest', constants_1.DEFAULT_ERROR_CALLBACK);
        if (!vs) {
            throw new Error("Unable to init vertex shader.");
        }
        var fs = compileShader(gl_2, constants_1.GLSL1, constants_1.PRECISION_MEDIUM_P, constants_1.PRECISION_MEDIUM_P, "\n\tuniform mediump vec3 v;\n\tvoid main() {\n\t\tgl_FragColor = vec4(normalize(v) * 0.5 + 0.5, 1);\n\t}\n\t\t", gl_2.FRAGMENT_SHADER, 'mediumpPrecisionFragmentTest', constants_1.DEFAULT_ERROR_CALLBACK);
        if (!fs) {
            throw new Error("Unable to init fragment shader.");
        }
        // we're going to compute the normalize vector of
        // (sqrt(2^31-1), sqrt(2^31-1), sqrt(2^31-1))
        // which should be impossible on mediump
        var value = Math.pow(2, 31) - 1;
        var input_2 = Math.sqrt(value);
        var expected = ((input_2 / Math.sqrt(input_2 * input_2 * 3)) * 0.5 + 0.5) * 255 | 0;
        var pixel = test1PxCalc('mediumpPrecisionFragmentTest', gl_2, fs, vs, function (program) {
            var vLocation = gl_2.getUniformLocation(program, 'v');
            gl_2.uniform3f(vLocation, input_2, input_2, input_2);
        });
        var mediumpPrecision = Math.abs(pixel[0] - expected) > 16;
        results.mediumpFragmentPrecision = mediumpPrecision ? constants_1.PRECISION_MEDIUM_P : constants_1.PRECISION_HIGH_P;
    }
    return results.mediumpFragmentPrecision;
}
exports.getFragmentShaderMediumpPrecision = getFragmentShaderMediumpPrecision;
/**
 * Returns whether a number is a power of 2.
 * @private
 */
function isPowerOf2(value) {
    // Use bitwise operation to evaluate this.
    return value > 0 && (value & (value - 1)) == 0;
}
exports.isPowerOf2 = isPowerOf2;
/**
 * Returns a Float32 array with sequential values [0, 1, 2, 3...].
 * @private
 */
function initSequentialFloatArray(length) {
    var array = new Float32Array(length);
    for (var i = 0; i < length; i++) {
        array[i] = i;
    }
    return array;
}
exports.initSequentialFloatArray = initSequentialFloatArray;
/**
 * Strip out any unnecessary elements in shader source, e.g. #version and precision declarations.
 * This is called once on initialization, so doesn't need to be extremely efficient.
 * @private
 */
function preprocessShader(shaderSource) {
    // Strip out any version numbers.
    shaderSource = (0, regex_1.stripVersion)(shaderSource);
    // Strip out any precision declarations.
    shaderSource = (0, regex_1.stripPrecision)(shaderSource);
    // Strip out comments.
    shaderSource = (0, regex_1.stripComments)(shaderSource);
    return shaderSource;
}
/**
 * Common code for converting vertex/fragment shader source to GLSL1.
 * This is called once on initialization, so doesn't need to be extremely efficient.
 * @private
 */
function convertShaderToGLSL1(shaderSource) {
    // No isampler2D or usampler2D.
    shaderSource = (0, regex_1.glsl1Sampler2D)(shaderSource);
    // Unsigned int types are not supported, use int types instead.
    shaderSource = (0, regex_1.glsl1Uint)(shaderSource);
    // Convert texture to texture2D.
    shaderSource = (0, regex_1.glsl1Texture)(shaderSource);
    return shaderSource;
}
/**
 * Convert vertex shader source to GLSL1.
 * This is called once on initialization, so doesn't need to be extremely efficient.
 * @private
 */
function convertVertexShaderToGLSL1(shaderSource) {
    shaderSource = convertShaderToGLSL1(shaderSource);
    // Convert in to attribute.
    shaderSource = (0, regex_1.glsl1VertexIn)(shaderSource);
    // Convert out to varying.
    shaderSource = (0, regex_1.glsl1VertexOut)(shaderSource);
    return shaderSource;
}
/**
 * Convert fragment shader source to GLSL1.
 * This is called once on initialization, so doesn't need to be extremely efficient.
 * @private
 */
function convertFragmentShaderToGLSL1(shaderSource, name) {
    shaderSource = convertShaderToGLSL1(shaderSource);
    // Convert in to varying.
    shaderSource = (0, regex_1.glsl1FragmentIn)(shaderSource);
    // Convert out to gl_FragColor.
    return (0, regex_1.glsl1FragmentOut)(shaderSource, name);
}
exports.convertFragmentShaderToGLSL1 = convertFragmentShaderToGLSL1;
/**
 * Preprocess vertex shader for glslVersion and browser capabilities.
 * This is called once on initialization, so doesn't need to be extremely efficient.
 * @private
 */
function preprocessVertexShader(shaderSource, glslVersion) {
    shaderSource = preprocessShader(shaderSource);
    // Check if highp supported in vertex shaders.
    if (!isHighpSupportedInVertexShader()) {
        console.warn('highp not supported in vertex shader in this browser, falling back to mediump.');
        // Replace all highp with mediump.
        shaderSource = (0, regex_1.highpToMediump)(shaderSource);
    }
    if (glslVersion === constants_1.GLSL3) {
        return shaderSource;
    }
    return convertVertexShaderToGLSL1(shaderSource);
}
exports.preprocessVertexShader = preprocessVertexShader;
/**
 * Preprocess fragment shader for glslVersion and browser capabilities.
 * This is called once on initialization of GPUProgram, so doesn't need to be extremely efficient.
 * @private
 */
function preprocessFragmentShader(shaderSource, glslVersion, name) {
    var _a;
    shaderSource = preprocessShader(shaderSource);
    (0, regex_1.checkFragmentShaderForFragColor)(shaderSource, glslVersion, name);
    // Check if highp supported in fragment shaders.
    if (!isHighpSupportedInFragmentShader()) {
        console.warn('highp not supported in fragment shader in this browser, falling back to mediump.');
        // Replace all highp with mediump.
        shaderSource = (0, regex_1.highpToMediump)(shaderSource);
    }
    // Add function/operator polyfills.
    shaderSource = (0, polyfills_1.fragmentShaderPolyfills)() + shaderSource;
    // Add texture() polyfills.
    var samplerUniforms;
    (_a = (0, polyfills_1.texturePolyfill)(shaderSource), shaderSource = _a.shaderSource, samplerUniforms = _a.samplerUniforms);
    if (glslVersion !== constants_1.GLSL3) {
        var sources = convertFragmentShaderToGLSL1(shaderSource, name);
        // If this shader has multiple outputs, it is split into multiple sources.
        for (var i = 0, numSources = sources.length; i < numSources; i++) {
            // Add glsl1 specific polyfills.
            sources[i] = (0, polyfills_1.GLSL1Polyfills)() + sources[i];
        }
        shaderSource = sources.shift();
        if (sources.length) {
            return { shaderSource: shaderSource, samplerUniforms: samplerUniforms, additionalSources: sources };
        }
    }
    return { shaderSource: shaderSource, samplerUniforms: samplerUniforms };
}
exports.preprocessFragmentShader = preprocessFragmentShader;
/**
 * Check uniforms and return internal WebGL type (e.g. [1234][u]?[if])
 * @private
 */
function uniformInternalTypeForValue(value, type, uniformName, programName) {
    if (type === constants_1.FLOAT) {
        // Check that we are dealing with a number.
        if ((0, type_checks_1.isArray)(value)) {
            for (var i = 0; i < value.length; i++) {
                if (!(0, type_checks_1.isFiniteNumber)(value[i])) {
                    throw new Error("Invalid value ".concat(JSON.stringify(value), " for uniform \"").concat(uniformName, "\" in program \"").concat(programName, "\", expected float or float[] of length 1-4."));
                }
            }
        }
        else {
            if (!(0, type_checks_1.isFiniteNumber)(value)) {
                throw new Error("Invalid value ".concat(JSON.stringify(value), " for uniform \"").concat(uniformName, "\" in program \"").concat(programName, "\", expected float or float[] of length 1-4."));
            }
        }
        if (!(0, type_checks_1.isArray)(value) || value.length === 1) {
            return constants_1.FLOAT_1D_UNIFORM;
        }
        if (value.length === 2) {
            return constants_1.FLOAT_2D_UNIFORM;
        }
        if (value.length === 3) {
            return constants_1.FLOAT_3D_UNIFORM;
        }
        if (value.length === 4) {
            return constants_1.FLOAT_4D_UNIFORM;
        }
        throw new Error("Invalid value ".concat(JSON.stringify(value), " for uniform \"").concat(uniformName, "\" in program \"").concat(programName, "\", expected float or float[] of length 1-4."));
    }
    else if (type === constants_1.INT) {
        // Check that we are dealing with an int.
        if ((0, type_checks_1.isArray)(value)) {
            for (var i = 0; i < value.length; i++) {
                if (!(0, type_checks_1.isInteger)(value[i])) {
                    throw new Error("Invalid value ".concat(JSON.stringify(value), " for uniform \"").concat(uniformName, "\" in program \"").concat(programName, "\", expected int or int[] of length 1-4."));
                }
            }
        }
        else {
            if (!(0, type_checks_1.isInteger)(value)) {
                throw new Error("Invalid value ".concat(JSON.stringify(value), " for uniform \"").concat(uniformName, "\" in program \"").concat(programName, "\", expected int or int[] of length 1-4."));
            }
        }
        if (!(0, type_checks_1.isArray)(value) || value.length === 1) {
            return constants_1.INT_1D_UNIFORM;
        }
        if (value.length === 2) {
            return constants_1.INT_2D_UNIFORM;
        }
        if (value.length === 3) {
            return constants_1.INT_3D_UNIFORM;
        }
        if (value.length === 4) {
            return constants_1.INT_4D_UNIFORM;
        }
        throw new Error("Invalid value ".concat(JSON.stringify(value), " for uniform \"").concat(uniformName, "\" in program \"").concat(programName, "\", expected int or int[] of length 1-4."));
    }
    else if (type === constants_1.UINT) {
        // Check that we are dealing with a uint.
        if ((0, type_checks_1.isArray)(value)) {
            for (var i = 0; i < value.length; i++) {
                if (!(0, type_checks_1.isNonNegativeInteger)(value[i])) {
                    throw new Error("Invalid value ".concat(JSON.stringify(value), " for uniform \"").concat(uniformName, "\" in program \"").concat(programName, "\", expected uint or uint[] of length 1-4."));
                }
            }
        }
        else {
            if (!(0, type_checks_1.isNonNegativeInteger)(value)) {
                throw new Error("Invalid value ".concat(JSON.stringify(value), " for uniform \"").concat(uniformName, "\" in program \"").concat(programName, "\", expected uint or uint[] of length 1-4."));
            }
        }
        if (!(0, type_checks_1.isArray)(value) || value.length === 1) {
            return constants_1.UINT_1D_UNIFORM;
        }
        if (value.length === 2) {
            return constants_1.UINT_2D_UNIFORM;
        }
        if (value.length === 3) {
            return constants_1.UINT_3D_UNIFORM;
        }
        if (value.length === 4) {
            return constants_1.UINT_4D_UNIFORM;
        }
        throw new Error("Invalid value ".concat(JSON.stringify(value), " for uniform \"").concat(uniformName, "\" in program \"").concat(programName, "\", expected uint or uint[] of length 1-4."));
    }
    else if (type === constants_1.BOOL) {
        // Check that we are dealing with a boolean.
        if ((0, type_checks_1.isArray)(value)) {
            for (var i = 0; i < value.length; i++) {
                if (!(0, type_checks_1.isBoolean)(value[i])) {
                    throw new Error("Invalid value ".concat(JSON.stringify(value), " for uniform \"").concat(uniformName, "\" in program \"").concat(programName, "\", expected bool or bool[] of length 1-4."));
                }
            }
        }
        else {
            if (!(0, type_checks_1.isBoolean)(value)) {
                throw new Error("Invalid value ".concat(JSON.stringify(value), " for uniform \"").concat(uniformName, "\" in program \"").concat(programName, "\", expected bool or bool[] of length 1-4."));
            }
        }
        if (!(0, type_checks_1.isArray)(value) || value.length === 1) {
            return constants_1.BOOL_1D_UNIFORM;
        }
        if (value.length === 2) {
            return constants_1.BOOL_2D_UNIFORM;
        }
        if (value.length === 3) {
            return constants_1.BOOL_3D_UNIFORM;
        }
        if (value.length === 4) {
            return constants_1.BOOL_4D_UNIFORM;
        }
        throw new Error("Invalid value ".concat(JSON.stringify(value), " for uniform \"").concat(uniformName, "\" in program \"").concat(programName, "\", expected boolean."));
    }
    else {
        throw new Error("Invalid type \"".concat(type, "\" for uniform \"").concat(uniformName, "\" in program \"").concat(programName, "\", expected ").concat(constants_1.FLOAT, " or ").concat(constants_1.INT, " or ").concat(constants_1.BOOL, "."));
    }
}
exports.uniformInternalTypeForValue = uniformInternalTypeForValue;
/**
 * Get index of GPULayer in array of inputs.
 * Used by GPUComposer.
 * @private
 */
function indexOfLayerInArray(layer, array) {
    return array.findIndex(function (item) { return item === layer || item.layer === layer; });
}
exports.indexOfLayerInArray = indexOfLayerInArray;
function clientWaitAsync(gl, sync, flags, interval_ms) {
    return new Promise(function (resolve, reject) {
        function test() {
            var res = gl.clientWaitSync(sync, flags, 0);
            if (res === gl.WAIT_FAILED) {
                reject();
                return;
            }
            if (res === gl.TIMEOUT_EXPIRED) {
                setTimeout(test, interval_ms);
                return;
            }
            resolve();
        }
        test();
    });
}
function getBufferSubDataAsync(gl, target, buffer, srcByteOffset, dstBuffer) {
    return __awaiter(this, void 0, void 0, function () {
        var sync;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
                    gl.flush();
                    return [4 /*yield*/, clientWaitAsync(gl, sync, 0, 10)];
                case 1:
                    _a.sent();
                    gl.deleteSync(sync);
                    gl.bindBuffer(target, buffer);
                    gl.getBufferSubData(target, srcByteOffset, dstBuffer);
                    gl.bindBuffer(target, null);
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Non-blocking version of gl.readPixels for WebGL2 only.
 * https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices#use_non-blocking_async_data_readback
 * @param gl - WebGL2 Rendering Context
 * @param x - The first horizontal pixel that is read from the lower left corner of a rectangular block of pixels.
 * @param y - The first vertical pixel that is read from the lower left corner of a rectangular block of pixels.
 * @param w - The width of the rectangle.
 * @param h - The height of the rectangle.
 * @param format - The GLenum format of the pixel data.
 * @param type - The GLenum data type of the pixel data.
 * @param dstBuffer - An object to read data into. The array type must match the type of the type parameter.
 * @returns
 */
function readPixelsAsync(gl, x, y, w, h, format, type, dstBuffer) {
    return __awaiter(this, void 0, void 0, function () {
        var buf;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    buf = gl.createBuffer();
                    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, buf);
                    gl.bufferData(gl.PIXEL_PACK_BUFFER, dstBuffer.byteLength, gl.STREAM_READ);
                    gl.readPixels(x, y, w, h, format, type, 0);
                    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);
                    return [4 /*yield*/, getBufferSubDataAsync(gl, gl.PIXEL_PACK_BUFFER, buf, 0, dstBuffer)];
                case 1:
                    _a.sent();
                    gl.deleteBuffer(buf);
                    return [2 /*return*/, dstBuffer];
            }
        });
    });
}
exports.readPixelsAsync = readPixelsAsync;


/***/ }),

/***/ 557:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.getFloat16 = getFloat16;
exports.setFloat16 = setFloat16;

var _arrayIterator = __webpack_require__(802);

var _converter = __webpack_require__(605);

var _primordials = __webpack_require__(983);

function getFloat16(dataView, byteOffset, ...opts) {
  return (0, _converter.convertToNumber)((0, _primordials.DataViewPrototypeGetUint16)(dataView, byteOffset, ...(0, _arrayIterator.safeIfNeeded)(opts)));
}

function setFloat16(dataView, byteOffset, value, ...opts) {
  return (0, _primordials.DataViewPrototypeSetUint16)(dataView, byteOffset, (0, _converter.roundToFloat16Bits)(value), ...(0, _arrayIterator.safeIfNeeded)(opts));
}

/***/ }),

/***/ 310:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.isFloat16Array = isFloat16Array;

var _arrayIterator = __webpack_require__(802);

var _brand = __webpack_require__(299);

var _converter = __webpack_require__(605);

var _is = __webpack_require__(554);

var _messages = __webpack_require__(930);

var _primordials = __webpack_require__(983);

var _spec = __webpack_require__(700);

const BYTES_PER_ELEMENT = 2;
const float16bitsArrays = new _primordials.NativeWeakMap();

function isFloat16Array(target) {
  return (0, _primordials.WeakMapPrototypeHas)(float16bitsArrays, target) || !(0, _primordials.ArrayBufferIsView)(target) && (0, _brand.hasFloat16ArrayBrand)(target);
}

function assertFloat16Array(target) {
  if (!isFloat16Array(target)) {
    throw (0, _primordials.NativeTypeError)(_messages.THIS_IS_NOT_A_FLOAT16ARRAY_OBJECT);
  }
}

function assertSpeciesTypedArray(target, count) {
  const isTargetFloat16Array = isFloat16Array(target);
  const isTargetTypedArray = (0, _is.isNativeTypedArray)(target);

  if (!isTargetFloat16Array && !isTargetTypedArray) {
    throw (0, _primordials.NativeTypeError)(_messages.SPECIES_CONSTRUCTOR_DIDNT_RETURN_TYPEDARRAY_OBJECT);
  }

  if (typeof count === "number") {
    let length;

    if (isTargetFloat16Array) {
      const float16bitsArray = getFloat16BitsArray(target);
      length = (0, _primordials.TypedArrayPrototypeGetLength)(float16bitsArray);
    } else {
      length = (0, _primordials.TypedArrayPrototypeGetLength)(target);
    }

    if (length < count) {
      throw (0, _primordials.NativeTypeError)(_messages.DERIVED_CONSTRUCTOR_CREATED_TYPEDARRAY_OBJECT_WHICH_WAS_TOO_SMALL_LENGTH);
    }
  }

  if ((0, _is.isNativeBigIntTypedArray)(target)) {
    throw (0, _primordials.NativeTypeError)(_messages.CANNOT_MIX_BIGINT_AND_OTHER_TYPES);
  }
}

function getFloat16BitsArray(float16) {
  const float16bitsArray = (0, _primordials.WeakMapPrototypeGet)(float16bitsArrays, float16);

  if (float16bitsArray !== undefined) {
    const buffer = (0, _primordials.TypedArrayPrototypeGetBuffer)(float16bitsArray);

    if ((0, _spec.IsDetachedBuffer)(buffer)) {
      throw (0, _primordials.NativeTypeError)(_messages.ATTEMPTING_TO_ACCESS_DETACHED_ARRAYBUFFER);
    }

    return float16bitsArray;
  }

  const buffer = float16.buffer;

  if ((0, _spec.IsDetachedBuffer)(buffer)) {
    throw (0, _primordials.NativeTypeError)(_messages.ATTEMPTING_TO_ACCESS_DETACHED_ARRAYBUFFER);
  }

  const cloned = (0, _primordials.ReflectConstruct)(Float16Array, [buffer, float16.byteOffset, float16.length], float16.constructor);
  return (0, _primordials.WeakMapPrototypeGet)(float16bitsArrays, cloned);
}

function copyToArray(float16bitsArray) {
  const length = (0, _primordials.TypedArrayPrototypeGetLength)(float16bitsArray);
  const array = [];

  for (let i = 0; i < length; ++i) {
    array[i] = (0, _converter.convertToNumber)(float16bitsArray[i]);
  }

  return array;
}

const TypedArrayPrototypeGetters = new _primordials.NativeWeakSet();

for (const key of (0, _primordials.ReflectOwnKeys)(_primordials.TypedArrayPrototype)) {
  if (key === _primordials.SymbolToStringTag) {
    continue;
  }

  const descriptor = (0, _primordials.ReflectGetOwnPropertyDescriptor)(_primordials.TypedArrayPrototype, key);

  if ((0, _primordials.ObjectHasOwn)(descriptor, "get") && typeof descriptor.get === "function") {
    (0, _primordials.WeakSetPrototypeAdd)(TypedArrayPrototypeGetters, descriptor.get);
  }
}

const handler = (0, _primordials.ObjectFreeze)({
  get(target, key, receiver) {
    if ((0, _is.isCanonicalIntegerIndexString)(key) && (0, _primordials.ObjectHasOwn)(target, key)) {
      return (0, _converter.convertToNumber)((0, _primordials.ReflectGet)(target, key));
    }

    if ((0, _primordials.WeakSetPrototypeHas)(TypedArrayPrototypeGetters, (0, _primordials.ObjectPrototype__lookupGetter__)(target, key))) {
      return (0, _primordials.ReflectGet)(target, key);
    }

    return (0, _primordials.ReflectGet)(target, key, receiver);
  },

  set(target, key, value, receiver) {
    if ((0, _is.isCanonicalIntegerIndexString)(key) && (0, _primordials.ObjectHasOwn)(target, key)) {
      return (0, _primordials.ReflectSet)(target, key, (0, _converter.roundToFloat16Bits)(value));
    }

    return (0, _primordials.ReflectSet)(target, key, value, receiver);
  },

  getOwnPropertyDescriptor(target, key) {
    if ((0, _is.isCanonicalIntegerIndexString)(key) && (0, _primordials.ObjectHasOwn)(target, key)) {
      const descriptor = (0, _primordials.ReflectGetOwnPropertyDescriptor)(target, key);
      descriptor.value = (0, _converter.convertToNumber)(descriptor.value);
      return descriptor;
    }

    return (0, _primordials.ReflectGetOwnPropertyDescriptor)(target, key);
  },

  defineProperty(target, key, descriptor) {
    if ((0, _is.isCanonicalIntegerIndexString)(key) && (0, _primordials.ObjectHasOwn)(target, key) && (0, _primordials.ObjectHasOwn)(descriptor, "value")) {
      descriptor.value = (0, _converter.roundToFloat16Bits)(descriptor.value);
      return (0, _primordials.ReflectDefineProperty)(target, key, descriptor);
    }

    return (0, _primordials.ReflectDefineProperty)(target, key, descriptor);
  }

});

class Float16Array {
  constructor(input, _byteOffset, _length) {
    let float16bitsArray;

    if (isFloat16Array(input)) {
      float16bitsArray = (0, _primordials.ReflectConstruct)(_primordials.NativeUint16Array, [getFloat16BitsArray(input)], new.target);
    } else if ((0, _is.isObject)(input) && !(0, _is.isArrayBuffer)(input)) {
      let list;
      let length;

      if ((0, _is.isNativeTypedArray)(input)) {
        list = input;
        length = (0, _primordials.TypedArrayPrototypeGetLength)(input);
        const buffer = (0, _primordials.TypedArrayPrototypeGetBuffer)(input);
        const BufferConstructor = !(0, _is.isSharedArrayBuffer)(buffer) ? (0, _spec.SpeciesConstructor)(buffer, _primordials.NativeArrayBuffer) : _primordials.NativeArrayBuffer;

        if ((0, _spec.IsDetachedBuffer)(buffer)) {
          throw (0, _primordials.NativeTypeError)(_messages.ATTEMPTING_TO_ACCESS_DETACHED_ARRAYBUFFER);
        }

        if ((0, _is.isNativeBigIntTypedArray)(input)) {
          throw (0, _primordials.NativeTypeError)(_messages.CANNOT_MIX_BIGINT_AND_OTHER_TYPES);
        }

        const data = new BufferConstructor(length * BYTES_PER_ELEMENT);
        float16bitsArray = (0, _primordials.ReflectConstruct)(_primordials.NativeUint16Array, [data], new.target);
      } else {
        const iterator = input[_primordials.SymbolIterator];

        if (iterator != null && typeof iterator !== "function") {
          throw (0, _primordials.NativeTypeError)(_messages.ITERATOR_PROPERTY_IS_NOT_CALLABLE);
        }

        if (iterator != null) {
          if ((0, _is.isOrdinaryArray)(input)) {
            list = input;
            length = input.length;
          } else {
            list = [...input];
            length = list.length;
          }
        } else {
          list = input;
          length = (0, _spec.ToLength)(list.length);
        }

        float16bitsArray = (0, _primordials.ReflectConstruct)(_primordials.NativeUint16Array, [length], new.target);
      }

      for (let i = 0; i < length; ++i) {
        float16bitsArray[i] = (0, _converter.roundToFloat16Bits)(list[i]);
      }
    } else {
      float16bitsArray = (0, _primordials.ReflectConstruct)(_primordials.NativeUint16Array, arguments, new.target);
    }

    const proxy = new _primordials.NativeProxy(float16bitsArray, handler);
    (0, _primordials.WeakMapPrototypeSet)(float16bitsArrays, proxy, float16bitsArray);
    return proxy;
  }

  static from(src, ...opts) {
    const Constructor = this;

    if (!(0, _primordials.ReflectHas)(Constructor, _brand.brand)) {
      throw (0, _primordials.NativeTypeError)(_messages.THIS_CONSTRUCTOR_IS_NOT_A_SUBCLASS_OF_FLOAT16ARRAY);
    }

    if (Constructor === Float16Array) {
      if (isFloat16Array(src) && opts.length === 0) {
        const float16bitsArray = getFloat16BitsArray(src);
        const uint16 = new _primordials.NativeUint16Array((0, _primordials.TypedArrayPrototypeGetBuffer)(float16bitsArray), (0, _primordials.TypedArrayPrototypeGetByteOffset)(float16bitsArray), (0, _primordials.TypedArrayPrototypeGetLength)(float16bitsArray));
        return new Float16Array((0, _primordials.TypedArrayPrototypeGetBuffer)((0, _primordials.TypedArrayPrototypeSlice)(uint16)));
      }

      if (opts.length === 0) {
        return new Float16Array((0, _primordials.TypedArrayPrototypeGetBuffer)((0, _primordials.Uint16ArrayFrom)(src, _converter.roundToFloat16Bits)));
      }

      const mapFunc = opts[0];
      const thisArg = opts[1];
      return new Float16Array((0, _primordials.TypedArrayPrototypeGetBuffer)((0, _primordials.Uint16ArrayFrom)(src, function (val, ...args) {
        return (0, _converter.roundToFloat16Bits)((0, _primordials.ReflectApply)(mapFunc, this, [val, ...(0, _arrayIterator.safeIfNeeded)(args)]));
      }, thisArg)));
    }

    let list;
    let length;
    const iterator = src[_primordials.SymbolIterator];

    if (iterator != null && typeof iterator !== "function") {
      throw (0, _primordials.NativeTypeError)(_messages.ITERATOR_PROPERTY_IS_NOT_CALLABLE);
    }

    if (iterator != null) {
      if ((0, _is.isOrdinaryArray)(src)) {
        list = src;
        length = src.length;
      } else if ((0, _is.isOrdinaryNativeTypedArray)(src)) {
        list = src;
        length = (0, _primordials.TypedArrayPrototypeGetLength)(src);
      } else {
        list = [...src];
        length = list.length;
      }
    } else {
      if (src == null) {
        throw (0, _primordials.NativeTypeError)(_messages.CANNOT_CONVERT_UNDEFINED_OR_NULL_TO_OBJECT);
      }

      list = (0, _primordials.NativeObject)(src);
      length = (0, _spec.ToLength)(list.length);
    }

    const array = new Constructor(length);

    if (opts.length === 0) {
      for (let i = 0; i < length; ++i) {
        array[i] = list[i];
      }
    } else {
      const mapFunc = opts[0];
      const thisArg = opts[1];

      for (let i = 0; i < length; ++i) {
        array[i] = (0, _primordials.ReflectApply)(mapFunc, thisArg, [list[i], i]);
      }
    }

    return array;
  }

  static of(...items) {
    const Constructor = this;

    if (!(0, _primordials.ReflectHas)(Constructor, _brand.brand)) {
      throw (0, _primordials.NativeTypeError)(_messages.THIS_CONSTRUCTOR_IS_NOT_A_SUBCLASS_OF_FLOAT16ARRAY);
    }

    const length = items.length;

    if (Constructor === Float16Array) {
      const proxy = new Float16Array(length);
      const float16bitsArray = getFloat16BitsArray(proxy);

      for (let i = 0; i < length; ++i) {
        float16bitsArray[i] = (0, _converter.roundToFloat16Bits)(items[i]);
      }

      return proxy;
    }

    const array = new Constructor(length);

    for (let i = 0; i < length; ++i) {
      array[i] = items[i];
    }

    return array;
  }

  keys() {
    assertFloat16Array(this);
    const float16bitsArray = getFloat16BitsArray(this);
    return (0, _primordials.TypedArrayPrototypeKeys)(float16bitsArray);
  }

  values() {
    assertFloat16Array(this);
    const float16bitsArray = getFloat16BitsArray(this);
    return (0, _arrayIterator.wrap)(function* () {
      for (const val of (0, _primordials.TypedArrayPrototypeValues)(float16bitsArray)) {
        yield (0, _converter.convertToNumber)(val);
      }
    }());
  }

  entries() {
    assertFloat16Array(this);
    const float16bitsArray = getFloat16BitsArray(this);
    return (0, _arrayIterator.wrap)(function* () {
      for (const [i, val] of (0, _primordials.TypedArrayPrototypeEntries)(float16bitsArray)) {
        yield [i, (0, _converter.convertToNumber)(val)];
      }
    }());
  }

  at(index) {
    assertFloat16Array(this);
    const float16bitsArray = getFloat16BitsArray(this);
    const length = (0, _primordials.TypedArrayPrototypeGetLength)(float16bitsArray);
    const relativeIndex = (0, _spec.ToIntegerOrInfinity)(index);
    const k = relativeIndex >= 0 ? relativeIndex : length + relativeIndex;

    if (k < 0 || k >= length) {
      return;
    }

    return (0, _converter.convertToNumber)(float16bitsArray[k]);
  }

  map(callback, ...opts) {
    assertFloat16Array(this);
    const float16bitsArray = getFloat16BitsArray(this);
    const length = (0, _primordials.TypedArrayPrototypeGetLength)(float16bitsArray);
    const thisArg = opts[0];
    const Constructor = (0, _spec.SpeciesConstructor)(float16bitsArray, Float16Array);

    if (Constructor === Float16Array) {
      const proxy = new Float16Array(length);
      const array = getFloat16BitsArray(proxy);

      for (let i = 0; i < length; ++i) {
        const val = (0, _converter.convertToNumber)(float16bitsArray[i]);
        array[i] = (0, _converter.roundToFloat16Bits)((0, _primordials.ReflectApply)(callback, thisArg, [val, i, this]));
      }

      return proxy;
    }

    const array = new Constructor(length);
    assertSpeciesTypedArray(array, length);

    for (let i = 0; i < length; ++i) {
      const val = (0, _converter.convertToNumber)(float16bitsArray[i]);
      array[i] = (0, _primordials.ReflectApply)(callback, thisArg, [val, i, this]);
    }

    return array;
  }

  filter(callback, ...opts) {
    assertFloat16Array(this);
    const float16bitsArray = getFloat16BitsArray(this);
    const length = (0, _primordials.TypedArrayPrototypeGetLength)(float16bitsArray);
    const thisArg = opts[0];
    const kept = [];

    for (let i = 0; i < length; ++i) {
      const val = (0, _converter.convertToNumber)(float16bitsArray[i]);

      if ((0, _primordials.ReflectApply)(callback, thisArg, [val, i, this])) {
        (0, _primordials.ArrayPrototypePush)(kept, val);
      }
    }

    const Constructor = (0, _spec.SpeciesConstructor)(float16bitsArray, Float16Array);
    const array = new Constructor(kept);
    assertSpeciesTypedArray(array);
    return array;
  }

  reduce(callback, ...opts) {
    assertFloat16Array(this);
    const float16bitsArray = getFloat16BitsArray(this);
    const length = (0, _primordials.TypedArrayPrototypeGetLength)(float16bitsArray);

    if (length === 0 && opts.length === 0) {
      throw (0, _primordials.NativeTypeError)(_messages.REDUCE_OF_EMPTY_ARRAY_WITH_NO_INITIAL_VALUE);
    }

    let accumulator, start;

    if (opts.length === 0) {
      accumulator = (0, _converter.convertToNumber)(float16bitsArray[0]);
      start = 1;
    } else {
      accumulator = opts[0];
      start = 0;
    }

    for (let i = start; i < length; ++i) {
      accumulator = callback(accumulator, (0, _converter.convertToNumber)(float16bitsArray[i]), i, this);
    }

    return accumulator;
  }

  reduceRight(callback, ...opts) {
    assertFloat16Array(this);
    const float16bitsArray = getFloat16BitsArray(this);
    const length = (0, _primordials.TypedArrayPrototypeGetLength)(float16bitsArray);

    if (length === 0 && opts.length === 0) {
      throw (0, _primordials.NativeTypeError)(_messages.REDUCE_OF_EMPTY_ARRAY_WITH_NO_INITIAL_VALUE);
    }

    let accumulator, start;

    if (opts.length === 0) {
      accumulator = (0, _converter.convertToNumber)(float16bitsArray[length - 1]);
      start = length - 2;
    } else {
      accumulator = opts[0];
      start = length - 1;
    }

    for (let i = start; i >= 0; --i) {
      accumulator = callback(accumulator, (0, _converter.convertToNumber)(float16bitsArray[i]), i, this);
    }

    return accumulator;
  }

  forEach(callback, ...opts) {
    assertFloat16Array(this);
    const float16bitsArray = getFloat16BitsArray(this);
    const length = (0, _primordials.TypedArrayPrototypeGetLength)(float16bitsArray);
    const thisArg = opts[0];

    for (let i = 0; i < length; ++i) {
      (0, _primordials.ReflectApply)(callback, thisArg, [(0, _converter.convertToNumber)(float16bitsArray[i]), i, this]);
    }
  }

  find(callback, ...opts) {
    assertFloat16Array(this);
    const float16bitsArray = getFloat16BitsArray(this);
    const length = (0, _primordials.TypedArrayPrototypeGetLength)(float16bitsArray);
    const thisArg = opts[0];

    for (let i = 0; i < length; ++i) {
      const value = (0, _converter.convertToNumber)(float16bitsArray[i]);

      if ((0, _primordials.ReflectApply)(callback, thisArg, [value, i, this])) {
        return value;
      }
    }
  }

  findIndex(callback, ...opts) {
    assertFloat16Array(this);
    const float16bitsArray = getFloat16BitsArray(this);
    const length = (0, _primordials.TypedArrayPrototypeGetLength)(float16bitsArray);
    const thisArg = opts[0];

    for (let i = 0; i < length; ++i) {
      const value = (0, _converter.convertToNumber)(float16bitsArray[i]);

      if ((0, _primordials.ReflectApply)(callback, thisArg, [value, i, this])) {
        return i;
      }
    }

    return -1;
  }

  findLast(callback, ...opts) {
    assertFloat16Array(this);
    const float16bitsArray = getFloat16BitsArray(this);
    const length = (0, _primordials.TypedArrayPrototypeGetLength)(float16bitsArray);
    const thisArg = opts[0];

    for (let i = length - 1; i >= 0; --i) {
      const value = (0, _converter.convertToNumber)(float16bitsArray[i]);

      if ((0, _primordials.ReflectApply)(callback, thisArg, [value, i, this])) {
        return value;
      }
    }
  }

  findLastIndex(callback, ...opts) {
    assertFloat16Array(this);
    const float16bitsArray = getFloat16BitsArray(this);
    const length = (0, _primordials.TypedArrayPrototypeGetLength)(float16bitsArray);
    const thisArg = opts[0];

    for (let i = length - 1; i >= 0; --i) {
      const value = (0, _converter.convertToNumber)(float16bitsArray[i]);

      if ((0, _primordials.ReflectApply)(callback, thisArg, [value, i, this])) {
        return i;
      }
    }

    return -1;
  }

  every(callback, ...opts) {
    assertFloat16Array(this);
    const float16bitsArray = getFloat16BitsArray(this);
    const length = (0, _primordials.TypedArrayPrototypeGetLength)(float16bitsArray);
    const thisArg = opts[0];

    for (let i = 0; i < length; ++i) {
      if (!(0, _primordials.ReflectApply)(callback, thisArg, [(0, _converter.convertToNumber)(float16bitsArray[i]), i, this])) {
        return false;
      }
    }

    return true;
  }

  some(callback, ...opts) {
    assertFloat16Array(this);
    const float16bitsArray = getFloat16BitsArray(this);
    const length = (0, _primordials.TypedArrayPrototypeGetLength)(float16bitsArray);
    const thisArg = opts[0];

    for (let i = 0; i < length; ++i) {
      if ((0, _primordials.ReflectApply)(callback, thisArg, [(0, _converter.convertToNumber)(float16bitsArray[i]), i, this])) {
        return true;
      }
    }

    return false;
  }

  set(input, ...opts) {
    assertFloat16Array(this);
    const float16bitsArray = getFloat16BitsArray(this);
    const targetOffset = (0, _spec.ToIntegerOrInfinity)(opts[0]);

    if (targetOffset < 0) {
      throw (0, _primordials.NativeRangeError)(_messages.OFFSET_IS_OUT_OF_BOUNDS);
    }

    if (input == null) {
      throw (0, _primordials.NativeTypeError)(_messages.CANNOT_CONVERT_UNDEFINED_OR_NULL_TO_OBJECT);
    }

    if ((0, _is.isNativeBigIntTypedArray)(input)) {
      throw (0, _primordials.NativeTypeError)(_messages.CANNOT_MIX_BIGINT_AND_OTHER_TYPES);
    }

    if (isFloat16Array(input)) {
      return (0, _primordials.TypedArrayPrototypeSet)(getFloat16BitsArray(this), getFloat16BitsArray(input), targetOffset);
    }

    if ((0, _is.isNativeTypedArray)(input)) {
      const buffer = (0, _primordials.TypedArrayPrototypeGetBuffer)(input);

      if ((0, _spec.IsDetachedBuffer)(buffer)) {
        throw (0, _primordials.NativeTypeError)(_messages.ATTEMPTING_TO_ACCESS_DETACHED_ARRAYBUFFER);
      }
    }

    const targetLength = (0, _primordials.TypedArrayPrototypeGetLength)(float16bitsArray);
    const src = (0, _primordials.NativeObject)(input);
    const srcLength = (0, _spec.ToLength)(src.length);

    if (targetOffset === Infinity || srcLength + targetOffset > targetLength) {
      throw (0, _primordials.NativeRangeError)(_messages.OFFSET_IS_OUT_OF_BOUNDS);
    }

    for (let i = 0; i < srcLength; ++i) {
      float16bitsArray[i + targetOffset] = (0, _converter.roundToFloat16Bits)(src[i]);
    }
  }

  reverse() {
    assertFloat16Array(this);
    const float16bitsArray = getFloat16BitsArray(this);
    (0, _primordials.TypedArrayPrototypeReverse)(float16bitsArray);
    return this;
  }

  fill(value, ...opts) {
    assertFloat16Array(this);
    const float16bitsArray = getFloat16BitsArray(this);
    (0, _primordials.TypedArrayPrototypeFill)(float16bitsArray, (0, _converter.roundToFloat16Bits)(value), ...(0, _arrayIterator.safeIfNeeded)(opts));
    return this;
  }

  copyWithin(target, start, ...opts) {
    assertFloat16Array(this);
    const float16bitsArray = getFloat16BitsArray(this);
    (0, _primordials.TypedArrayPrototypeCopyWithin)(float16bitsArray, target, start, ...(0, _arrayIterator.safeIfNeeded)(opts));
    return this;
  }

  sort(compareFn) {
    assertFloat16Array(this);
    const float16bitsArray = getFloat16BitsArray(this);
    const sortCompare = compareFn !== undefined ? compareFn : _spec.defaultCompare;
    (0, _primordials.TypedArrayPrototypeSort)(float16bitsArray, (x, y) => {
      return sortCompare((0, _converter.convertToNumber)(x), (0, _converter.convertToNumber)(y));
    });
    return this;
  }

  slice(start, end) {
    assertFloat16Array(this);
    const float16bitsArray = getFloat16BitsArray(this);
    const Constructor = (0, _spec.SpeciesConstructor)(float16bitsArray, Float16Array);

    if (Constructor === Float16Array) {
      const uint16 = new _primordials.NativeUint16Array((0, _primordials.TypedArrayPrototypeGetBuffer)(float16bitsArray), (0, _primordials.TypedArrayPrototypeGetByteOffset)(float16bitsArray), (0, _primordials.TypedArrayPrototypeGetLength)(float16bitsArray));
      return new Float16Array((0, _primordials.TypedArrayPrototypeGetBuffer)((0, _primordials.TypedArrayPrototypeSlice)(uint16, start, end)));
    }

    const length = (0, _primordials.TypedArrayPrototypeGetLength)(float16bitsArray);
    const relativeStart = (0, _spec.ToIntegerOrInfinity)(start);
    const relativeEnd = end === undefined ? length : (0, _spec.ToIntegerOrInfinity)(end);
    let k;

    if (relativeStart === -Infinity) {
      k = 0;
    } else if (relativeStart < 0) {
      k = length + relativeStart > 0 ? length + relativeStart : 0;
    } else {
      k = length < relativeStart ? length : relativeStart;
    }

    let final;

    if (relativeEnd === -Infinity) {
      final = 0;
    } else if (relativeEnd < 0) {
      final = length + relativeEnd > 0 ? length + relativeEnd : 0;
    } else {
      final = length < relativeEnd ? length : relativeEnd;
    }

    const count = final - k > 0 ? final - k : 0;
    const array = new Constructor(count);
    assertSpeciesTypedArray(array, count);

    if (count === 0) {
      return array;
    }

    const buffer = (0, _primordials.TypedArrayPrototypeGetBuffer)(float16bitsArray);

    if ((0, _spec.IsDetachedBuffer)(buffer)) {
      throw (0, _primordials.NativeTypeError)(_messages.ATTEMPTING_TO_ACCESS_DETACHED_ARRAYBUFFER);
    }

    let n = 0;

    while (k < final) {
      array[n] = (0, _converter.convertToNumber)(float16bitsArray[k]);
      ++k;
      ++n;
    }

    return array;
  }

  subarray(begin, end) {
    assertFloat16Array(this);
    const float16bitsArray = getFloat16BitsArray(this);
    const Constructor = (0, _spec.SpeciesConstructor)(float16bitsArray, Float16Array);
    const uint16 = new _primordials.NativeUint16Array((0, _primordials.TypedArrayPrototypeGetBuffer)(float16bitsArray), (0, _primordials.TypedArrayPrototypeGetByteOffset)(float16bitsArray), (0, _primordials.TypedArrayPrototypeGetLength)(float16bitsArray));
    const uint16Subarray = (0, _primordials.TypedArrayPrototypeSubarray)(uint16, begin, end);
    const array = new Constructor((0, _primordials.TypedArrayPrototypeGetBuffer)(uint16Subarray), (0, _primordials.TypedArrayPrototypeGetByteOffset)(uint16Subarray), (0, _primordials.TypedArrayPrototypeGetLength)(uint16Subarray));
    assertSpeciesTypedArray(array);
    return array;
  }

  indexOf(element, ...opts) {
    assertFloat16Array(this);
    const float16bitsArray = getFloat16BitsArray(this);
    const length = (0, _primordials.TypedArrayPrototypeGetLength)(float16bitsArray);
    let from = (0, _spec.ToIntegerOrInfinity)(opts[0]);

    if (from === Infinity) {
      return -1;
    }

    if (from < 0) {
      from += length;

      if (from < 0) {
        from = 0;
      }
    }

    for (let i = from; i < length; ++i) {
      if ((0, _primordials.ObjectHasOwn)(float16bitsArray, i) && (0, _converter.convertToNumber)(float16bitsArray[i]) === element) {
        return i;
      }
    }

    return -1;
  }

  lastIndexOf(element, ...opts) {
    assertFloat16Array(this);
    const float16bitsArray = getFloat16BitsArray(this);
    const length = (0, _primordials.TypedArrayPrototypeGetLength)(float16bitsArray);
    let from = opts.length >= 1 ? (0, _spec.ToIntegerOrInfinity)(opts[0]) : length - 1;

    if (from === -Infinity) {
      return -1;
    }

    if (from >= 0) {
      from = from < length - 1 ? from : length - 1;
    } else {
      from += length;
    }

    for (let i = from; i >= 0; --i) {
      if ((0, _primordials.ObjectHasOwn)(float16bitsArray, i) && (0, _converter.convertToNumber)(float16bitsArray[i]) === element) {
        return i;
      }
    }

    return -1;
  }

  includes(element, ...opts) {
    assertFloat16Array(this);
    const float16bitsArray = getFloat16BitsArray(this);
    const length = (0, _primordials.TypedArrayPrototypeGetLength)(float16bitsArray);
    let from = (0, _spec.ToIntegerOrInfinity)(opts[0]);

    if (from === Infinity) {
      return false;
    }

    if (from < 0) {
      from += length;

      if (from < 0) {
        from = 0;
      }
    }

    const isNaN = (0, _primordials.NumberIsNaN)(element);

    for (let i = from; i < length; ++i) {
      const value = (0, _converter.convertToNumber)(float16bitsArray[i]);

      if (isNaN && (0, _primordials.NumberIsNaN)(value)) {
        return true;
      }

      if (value === element) {
        return true;
      }
    }

    return false;
  }

  join(separator) {
    assertFloat16Array(this);
    const float16bitsArray = getFloat16BitsArray(this);
    const array = copyToArray(float16bitsArray);
    return (0, _primordials.ArrayPrototypeJoin)(array, separator);
  }

  toLocaleString(...opts) {
    assertFloat16Array(this);
    const float16bitsArray = getFloat16BitsArray(this);
    const array = copyToArray(float16bitsArray);
    return (0, _primordials.ArrayPrototypeToLocaleString)(array, ...(0, _arrayIterator.safeIfNeeded)(opts));
  }

  get [_primordials.SymbolToStringTag]() {
    if (isFloat16Array(this)) {
      return "Float16Array";
    }
  }

}

exports.Float16Array = Float16Array;
(0, _primordials.ObjectDefineProperty)(Float16Array, "BYTES_PER_ELEMENT", {
  value: BYTES_PER_ELEMENT
});
(0, _primordials.ObjectDefineProperty)(Float16Array, _brand.brand, {});
(0, _primordials.ReflectSetPrototypeOf)(Float16Array, _primordials.TypedArray);
const Float16ArrayPrototype = Float16Array.prototype;
(0, _primordials.ObjectDefineProperty)(Float16ArrayPrototype, "BYTES_PER_ELEMENT", {
  value: BYTES_PER_ELEMENT
});
(0, _primordials.ObjectDefineProperty)(Float16ArrayPrototype, _primordials.SymbolIterator, {
  value: Float16ArrayPrototype.values,
  writable: true,
  configurable: true
});
(0, _primordials.ReflectSetPrototypeOf)(Float16ArrayPrototype, _primordials.TypedArrayPrototype);

/***/ }),

/***/ 802:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.safeIfNeeded = safeIfNeeded;
exports.wrap = wrap;

var _primordials = __webpack_require__(983);

const arrayIterators = new _primordials.NativeWeakMap();
const SafeIteratorPrototype = (0, _primordials.ObjectCreate)(null, {
  next: {
    value: function next() {
      const arrayIterator = (0, _primordials.WeakMapPrototypeGet)(arrayIterators, this);
      return (0, _primordials.ArrayIteratorPrototypeNext)(arrayIterator);
    }
  },
  [_primordials.SymbolIterator]: {
    value: function values() {
      return this;
    }
  }
});

function safeIfNeeded(array) {
  if (array[_primordials.SymbolIterator] === _primordials.NativeArrayPrototypeSymbolIterator) {
    return array;
  }

  const safe = (0, _primordials.ObjectCreate)(SafeIteratorPrototype);
  (0, _primordials.WeakMapPrototypeSet)(arrayIterators, safe, (0, _primordials.ArrayPrototypeSymbolIterator)(array));
  return safe;
}

const generators = new _primordials.NativeWeakMap();
const DummyArrayIteratorPrototype = (0, _primordials.ObjectCreate)(_primordials.IteratorPrototype, {
  next: {
    value: function next() {
      const generator = (0, _primordials.WeakMapPrototypeGet)(generators, this);
      return (0, _primordials.GeneratorPrototypeNext)(generator);
    },
    writable: true,
    configurable: true
  }
});

for (const key of (0, _primordials.ReflectOwnKeys)(_primordials.ArrayIteratorPrototype)) {
  if (key === "next") {
    continue;
  }

  (0, _primordials.ObjectDefineProperty)(DummyArrayIteratorPrototype, key, (0, _primordials.ReflectGetOwnPropertyDescriptor)(_primordials.ArrayIteratorPrototype, key));
}

function wrap(generator) {
  const dummy = (0, _primordials.ObjectCreate)(DummyArrayIteratorPrototype);
  (0, _primordials.WeakMapPrototypeSet)(generators, dummy, generator);
  return dummy;
}

/***/ }),

/***/ 299:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.hasFloat16ArrayBrand = hasFloat16ArrayBrand;

var _is = __webpack_require__(554);

var _messages = __webpack_require__(930);

var _primordials = __webpack_require__(983);

const brand = (0, _primordials.SymbolFor)("__Float16Array__");
exports.brand = brand;

function hasFloat16ArrayBrand(target) {
  if (!(0, _is.isObjectLike)(target)) {
    return false;
  }

  const prototype = (0, _primordials.ReflectGetPrototypeOf)(target);

  if (!(0, _is.isObjectLike)(prototype)) {
    return false;
  }

  const constructor = prototype.constructor;

  if (constructor === undefined) {
    return false;
  }

  if (!(0, _is.isObject)(constructor)) {
    throw (0, _primordials.NativeTypeError)(_messages.THE_CONSTRUCTOR_PROPERTY_VALUE_IS_NOT_AN_OBJECT);
  }

  return (0, _primordials.ReflectHas)(constructor, brand);
}

/***/ }),

/***/ 605:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.convertToNumber = convertToNumber;
exports.roundToFloat16Bits = roundToFloat16Bits;

var _primordials = __webpack_require__(983);

const buffer = new _primordials.NativeArrayBuffer(4);
const floatView = new _primordials.NativeFloat32Array(buffer);
const uint32View = new _primordials.NativeUint32Array(buffer);
const baseTable = new _primordials.NativeUint32Array(512);
const shiftTable = new _primordials.NativeUint32Array(512);

for (let i = 0; i < 256; ++i) {
  const e = i - 127;

  if (e < -27) {
    baseTable[i] = 0x0000;
    baseTable[i | 0x100] = 0x8000;
    shiftTable[i] = 24;
    shiftTable[i | 0x100] = 24;
  } else if (e < -14) {
    baseTable[i] = 0x0400 >> -e - 14;
    baseTable[i | 0x100] = 0x0400 >> -e - 14 | 0x8000;
    shiftTable[i] = -e - 1;
    shiftTable[i | 0x100] = -e - 1;
  } else if (e <= 15) {
    baseTable[i] = e + 15 << 10;
    baseTable[i | 0x100] = e + 15 << 10 | 0x8000;
    shiftTable[i] = 13;
    shiftTable[i | 0x100] = 13;
  } else if (e < 128) {
    baseTable[i] = 0x7c00;
    baseTable[i | 0x100] = 0xfc00;
    shiftTable[i] = 24;
    shiftTable[i | 0x100] = 24;
  } else {
    baseTable[i] = 0x7c00;
    baseTable[i | 0x100] = 0xfc00;
    shiftTable[i] = 13;
    shiftTable[i | 0x100] = 13;
  }
}

function roundToFloat16Bits(num) {
  floatView[0] = num;
  const f = uint32View[0];
  const e = f >> 23 & 0x1ff;
  return baseTable[e] + ((f & 0x007fffff) >> shiftTable[e]);
}

const mantissaTable = new _primordials.NativeUint32Array(2048);
const exponentTable = new _primordials.NativeUint32Array(64);
const offsetTable = new _primordials.NativeUint32Array(64);

for (let i = 1; i < 1024; ++i) {
  let m = i << 13;
  let e = 0;

  while ((m & 0x00800000) === 0) {
    m <<= 1;
    e -= 0x00800000;
  }

  m &= ~0x00800000;
  e += 0x38800000;
  mantissaTable[i] = m | e;
}

for (let i = 1024; i < 2048; ++i) {
  mantissaTable[i] = 0x38000000 + (i - 1024 << 13);
}

for (let i = 1; i < 31; ++i) {
  exponentTable[i] = i << 23;
}

exponentTable[31] = 0x47800000;
exponentTable[32] = 0x80000000;

for (let i = 33; i < 63; ++i) {
  exponentTable[i] = 0x80000000 + (i - 32 << 23);
}

exponentTable[63] = 0xc7800000;

for (let i = 1; i < 64; ++i) {
  if (i !== 32) {
    offsetTable[i] = 1024;
  }
}

function convertToNumber(float16bits) {
  const m = float16bits >> 10;
  uint32View[0] = mantissaTable[offsetTable[m] + (float16bits & 0x3ff)] + exponentTable[m];
  return floatView[0];
}

/***/ }),

/***/ 554:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.isArrayBuffer = isArrayBuffer;
exports.isCanonicalIntegerIndexString = isCanonicalIntegerIndexString;
exports.isNativeBigIntTypedArray = isNativeBigIntTypedArray;
exports.isNativeTypedArray = isNativeTypedArray;
exports.isObject = isObject;
exports.isObjectLike = isObjectLike;
exports.isOrdinaryArray = isOrdinaryArray;
exports.isOrdinaryNativeTypedArray = isOrdinaryNativeTypedArray;
exports.isSharedArrayBuffer = isSharedArrayBuffer;

var _primordials = __webpack_require__(983);

function isObject(value) {
  return value !== null && typeof value === "object" || typeof value === "function";
}

function isObjectLike(value) {
  return value !== null && typeof value === "object";
}

function isNativeTypedArray(value) {
  return (0, _primordials.TypedArrayPrototypeGetSymbolToStringTag)(value) !== undefined;
}

function isNativeBigIntTypedArray(value) {
  const typedArrayName = (0, _primordials.TypedArrayPrototypeGetSymbolToStringTag)(value);
  return typedArrayName === "BigInt64Array" || typedArrayName === "BigUint64Array";
}

function isArrayBuffer(value) {
  try {
    (0, _primordials.ArrayBufferPrototypeGetByteLength)(value);
    return true;
  } catch (e) {
    return false;
  }
}

function isSharedArrayBuffer(value) {
  if (_primordials.NativeSharedArrayBuffer === null) {
    return false;
  }

  try {
    (0, _primordials.SharedArrayBufferPrototypeGetByteLength)(value);
    return true;
  } catch (e) {
    return false;
  }
}

function isOrdinaryArray(value) {
  if (!(0, _primordials.ArrayIsArray)(value)) {
    return false;
  }

  if (value[_primordials.SymbolIterator] === _primordials.NativeArrayPrototypeSymbolIterator) {
    return true;
  }

  const iterator = value[_primordials.SymbolIterator]();

  return iterator[_primordials.SymbolToStringTag] === "Array Iterator";
}

function isOrdinaryNativeTypedArray(value) {
  if (!isNativeTypedArray(value)) {
    return false;
  }

  if (value[_primordials.SymbolIterator] === _primordials.NativeTypedArrayPrototypeSymbolIterator) {
    return true;
  }

  const iterator = value[_primordials.SymbolIterator]();

  return iterator[_primordials.SymbolToStringTag] === "Array Iterator";
}

function isCanonicalIntegerIndexString(value) {
  if (typeof value !== "string") {
    return false;
  }

  const number = +value;

  if (value !== number + "") {
    return false;
  }

  if (!(0, _primordials.NumberIsFinite)(number)) {
    return false;
  }

  return number === (0, _primordials.MathTrunc)(number);
}

/***/ }),

/***/ 930:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
const THIS_IS_NOT_AN_OBJECT = "This is not an object";
exports.THIS_IS_NOT_AN_OBJECT = THIS_IS_NOT_AN_OBJECT;
const THIS_IS_NOT_A_FLOAT16ARRAY_OBJECT = "This is not a Float16Array object";
exports.THIS_IS_NOT_A_FLOAT16ARRAY_OBJECT = THIS_IS_NOT_A_FLOAT16ARRAY_OBJECT;
const THIS_CONSTRUCTOR_IS_NOT_A_SUBCLASS_OF_FLOAT16ARRAY = "This constructor is not a subclass of Float16Array";
exports.THIS_CONSTRUCTOR_IS_NOT_A_SUBCLASS_OF_FLOAT16ARRAY = THIS_CONSTRUCTOR_IS_NOT_A_SUBCLASS_OF_FLOAT16ARRAY;
const THE_CONSTRUCTOR_PROPERTY_VALUE_IS_NOT_AN_OBJECT = "The constructor property value is not an object";
exports.THE_CONSTRUCTOR_PROPERTY_VALUE_IS_NOT_AN_OBJECT = THE_CONSTRUCTOR_PROPERTY_VALUE_IS_NOT_AN_OBJECT;
const SPECIES_CONSTRUCTOR_DIDNT_RETURN_TYPEDARRAY_OBJECT = "Species constructor didn't return TypedArray object";
exports.SPECIES_CONSTRUCTOR_DIDNT_RETURN_TYPEDARRAY_OBJECT = SPECIES_CONSTRUCTOR_DIDNT_RETURN_TYPEDARRAY_OBJECT;
const DERIVED_CONSTRUCTOR_CREATED_TYPEDARRAY_OBJECT_WHICH_WAS_TOO_SMALL_LENGTH = "Derived constructor created TypedArray object which was too small length";
exports.DERIVED_CONSTRUCTOR_CREATED_TYPEDARRAY_OBJECT_WHICH_WAS_TOO_SMALL_LENGTH = DERIVED_CONSTRUCTOR_CREATED_TYPEDARRAY_OBJECT_WHICH_WAS_TOO_SMALL_LENGTH;
const ATTEMPTING_TO_ACCESS_DETACHED_ARRAYBUFFER = "Attempting to access detached ArrayBuffer";
exports.ATTEMPTING_TO_ACCESS_DETACHED_ARRAYBUFFER = ATTEMPTING_TO_ACCESS_DETACHED_ARRAYBUFFER;
const CANNOT_CONVERT_UNDEFINED_OR_NULL_TO_OBJECT = "Cannot convert undefined or null to object";
exports.CANNOT_CONVERT_UNDEFINED_OR_NULL_TO_OBJECT = CANNOT_CONVERT_UNDEFINED_OR_NULL_TO_OBJECT;
const CANNOT_MIX_BIGINT_AND_OTHER_TYPES = "Cannot mix BigInt and other types, use explicit conversions";
exports.CANNOT_MIX_BIGINT_AND_OTHER_TYPES = CANNOT_MIX_BIGINT_AND_OTHER_TYPES;
const ITERATOR_PROPERTY_IS_NOT_CALLABLE = "@@iterator property is not callable";
exports.ITERATOR_PROPERTY_IS_NOT_CALLABLE = ITERATOR_PROPERTY_IS_NOT_CALLABLE;
const REDUCE_OF_EMPTY_ARRAY_WITH_NO_INITIAL_VALUE = "Reduce of empty array with no initial value";
exports.REDUCE_OF_EMPTY_ARRAY_WITH_NO_INITIAL_VALUE = REDUCE_OF_EMPTY_ARRAY_WITH_NO_INITIAL_VALUE;
const OFFSET_IS_OUT_OF_BOUNDS = "Offset is out of bounds";
exports.OFFSET_IS_OUT_OF_BOUNDS = OFFSET_IS_OUT_OF_BOUNDS;

/***/ }),

/***/ 983:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));

var _messages = __webpack_require__(930);

function uncurryThis(target) {
  return (thisArg, ...args) => {
    return ReflectApply(target, thisArg, args);
  };
}

function uncurryThisGetter(target, key) {
  return uncurryThis(ReflectGetOwnPropertyDescriptor(target, key).get);
}

const {
  apply: ReflectApply,
  construct: ReflectConstruct,
  defineProperty: ReflectDefineProperty,
  get: ReflectGet,
  getOwnPropertyDescriptor: ReflectGetOwnPropertyDescriptor,
  getPrototypeOf: ReflectGetPrototypeOf,
  has: ReflectHas,
  ownKeys: ReflectOwnKeys,
  set: ReflectSet,
  setPrototypeOf: ReflectSetPrototypeOf
} = Reflect;
exports.ReflectSetPrototypeOf = ReflectSetPrototypeOf;
exports.ReflectSet = ReflectSet;
exports.ReflectOwnKeys = ReflectOwnKeys;
exports.ReflectHas = ReflectHas;
exports.ReflectGetPrototypeOf = ReflectGetPrototypeOf;
exports.ReflectGetOwnPropertyDescriptor = ReflectGetOwnPropertyDescriptor;
exports.ReflectGet = ReflectGet;
exports.ReflectDefineProperty = ReflectDefineProperty;
exports.ReflectConstruct = ReflectConstruct;
exports.ReflectApply = ReflectApply;
const NativeProxy = Proxy;
exports.NativeProxy = NativeProxy;
const {
  MAX_SAFE_INTEGER: MAX_SAFE_INTEGER,
  isFinite: NumberIsFinite,
  isNaN: NumberIsNaN
} = Number;
exports.NumberIsNaN = NumberIsNaN;
exports.NumberIsFinite = NumberIsFinite;
exports.MAX_SAFE_INTEGER = MAX_SAFE_INTEGER;
const {
  iterator: SymbolIterator,
  species: SymbolSpecies,
  toStringTag: SymbolToStringTag,
  for: SymbolFor
} = Symbol;
exports.SymbolFor = SymbolFor;
exports.SymbolToStringTag = SymbolToStringTag;
exports.SymbolSpecies = SymbolSpecies;
exports.SymbolIterator = SymbolIterator;
const NativeObject = Object;
exports.NativeObject = NativeObject;
const {
  create: ObjectCreate,
  defineProperty: ObjectDefineProperty,
  freeze: ObjectFreeze,
  is: ObjectIs
} = NativeObject;
exports.ObjectIs = ObjectIs;
exports.ObjectFreeze = ObjectFreeze;
exports.ObjectDefineProperty = ObjectDefineProperty;
exports.ObjectCreate = ObjectCreate;
const ObjectPrototype = NativeObject.prototype;
const ObjectPrototype__lookupGetter__ = ObjectPrototype.__lookupGetter__ ? uncurryThis(ObjectPrototype.__lookupGetter__) : (object, key) => {
  if (object == null) {
    throw NativeTypeError(_messages.CANNOT_CONVERT_UNDEFINED_OR_NULL_TO_OBJECT);
  }

  let target = NativeObject(object);

  do {
    const descriptor = ReflectGetOwnPropertyDescriptor(target, key);

    if (descriptor !== undefined) {
      if (ObjectHasOwn(descriptor, "get")) {
        return descriptor.get;
      }

      return;
    }
  } while ((target = ReflectGetPrototypeOf(target)) !== null);
};
exports.ObjectPrototype__lookupGetter__ = ObjectPrototype__lookupGetter__;
const ObjectHasOwn = NativeObject.hasOwn || uncurryThis(ObjectPrototype.hasOwnProperty);
exports.ObjectHasOwn = ObjectHasOwn;
const NativeArray = Array;
const ArrayIsArray = NativeArray.isArray;
exports.ArrayIsArray = ArrayIsArray;
const ArrayPrototype = NativeArray.prototype;
const ArrayPrototypeJoin = uncurryThis(ArrayPrototype.join);
exports.ArrayPrototypeJoin = ArrayPrototypeJoin;
const ArrayPrototypePush = uncurryThis(ArrayPrototype.push);
exports.ArrayPrototypePush = ArrayPrototypePush;
const ArrayPrototypeToLocaleString = uncurryThis(ArrayPrototype.toLocaleString);
exports.ArrayPrototypeToLocaleString = ArrayPrototypeToLocaleString;
const NativeArrayPrototypeSymbolIterator = ArrayPrototype[SymbolIterator];
exports.NativeArrayPrototypeSymbolIterator = NativeArrayPrototypeSymbolIterator;
const ArrayPrototypeSymbolIterator = uncurryThis(NativeArrayPrototypeSymbolIterator);
exports.ArrayPrototypeSymbolIterator = ArrayPrototypeSymbolIterator;
const MathTrunc = Math.trunc;
exports.MathTrunc = MathTrunc;
const NativeArrayBuffer = ArrayBuffer;
exports.NativeArrayBuffer = NativeArrayBuffer;
const ArrayBufferIsView = NativeArrayBuffer.isView;
exports.ArrayBufferIsView = ArrayBufferIsView;
const ArrayBufferPrototype = NativeArrayBuffer.prototype;
const ArrayBufferPrototypeSlice = uncurryThis(ArrayBufferPrototype.slice);
exports.ArrayBufferPrototypeSlice = ArrayBufferPrototypeSlice;
const ArrayBufferPrototypeGetByteLength = uncurryThisGetter(ArrayBufferPrototype, "byteLength");
exports.ArrayBufferPrototypeGetByteLength = ArrayBufferPrototypeGetByteLength;
const NativeSharedArrayBuffer = typeof SharedArrayBuffer !== "undefined" ? SharedArrayBuffer : null;
exports.NativeSharedArrayBuffer = NativeSharedArrayBuffer;
const SharedArrayBufferPrototypeGetByteLength = NativeSharedArrayBuffer && uncurryThisGetter(NativeSharedArrayBuffer.prototype, "byteLength");
exports.SharedArrayBufferPrototypeGetByteLength = SharedArrayBufferPrototypeGetByteLength;
const TypedArray = ReflectGetPrototypeOf(Uint8Array);
exports.TypedArray = TypedArray;
const TypedArrayFrom = TypedArray.from;
const TypedArrayPrototype = TypedArray.prototype;
exports.TypedArrayPrototype = TypedArrayPrototype;
const NativeTypedArrayPrototypeSymbolIterator = TypedArrayPrototype[SymbolIterator];
exports.NativeTypedArrayPrototypeSymbolIterator = NativeTypedArrayPrototypeSymbolIterator;
const TypedArrayPrototypeKeys = uncurryThis(TypedArrayPrototype.keys);
exports.TypedArrayPrototypeKeys = TypedArrayPrototypeKeys;
const TypedArrayPrototypeValues = uncurryThis(TypedArrayPrototype.values);
exports.TypedArrayPrototypeValues = TypedArrayPrototypeValues;
const TypedArrayPrototypeEntries = uncurryThis(TypedArrayPrototype.entries);
exports.TypedArrayPrototypeEntries = TypedArrayPrototypeEntries;
const TypedArrayPrototypeSet = uncurryThis(TypedArrayPrototype.set);
exports.TypedArrayPrototypeSet = TypedArrayPrototypeSet;
const TypedArrayPrototypeReverse = uncurryThis(TypedArrayPrototype.reverse);
exports.TypedArrayPrototypeReverse = TypedArrayPrototypeReverse;
const TypedArrayPrototypeFill = uncurryThis(TypedArrayPrototype.fill);
exports.TypedArrayPrototypeFill = TypedArrayPrototypeFill;
const TypedArrayPrototypeCopyWithin = uncurryThis(TypedArrayPrototype.copyWithin);
exports.TypedArrayPrototypeCopyWithin = TypedArrayPrototypeCopyWithin;
const TypedArrayPrototypeSort = uncurryThis(TypedArrayPrototype.sort);
exports.TypedArrayPrototypeSort = TypedArrayPrototypeSort;
const TypedArrayPrototypeSlice = uncurryThis(TypedArrayPrototype.slice);
exports.TypedArrayPrototypeSlice = TypedArrayPrototypeSlice;
const TypedArrayPrototypeSubarray = uncurryThis(TypedArrayPrototype.subarray);
exports.TypedArrayPrototypeSubarray = TypedArrayPrototypeSubarray;
const TypedArrayPrototypeGetBuffer = uncurryThisGetter(TypedArrayPrototype, "buffer");
exports.TypedArrayPrototypeGetBuffer = TypedArrayPrototypeGetBuffer;
const TypedArrayPrototypeGetByteOffset = uncurryThisGetter(TypedArrayPrototype, "byteOffset");
exports.TypedArrayPrototypeGetByteOffset = TypedArrayPrototypeGetByteOffset;
const TypedArrayPrototypeGetLength = uncurryThisGetter(TypedArrayPrototype, "length");
exports.TypedArrayPrototypeGetLength = TypedArrayPrototypeGetLength;
const TypedArrayPrototypeGetSymbolToStringTag = uncurryThisGetter(TypedArrayPrototype, SymbolToStringTag);
exports.TypedArrayPrototypeGetSymbolToStringTag = TypedArrayPrototypeGetSymbolToStringTag;
const NativeUint16Array = Uint16Array;
exports.NativeUint16Array = NativeUint16Array;

const Uint16ArrayFrom = (...args) => {
  return ReflectApply(TypedArrayFrom, NativeUint16Array, args);
};

exports.Uint16ArrayFrom = Uint16ArrayFrom;
const NativeUint32Array = Uint32Array;
exports.NativeUint32Array = NativeUint32Array;
const NativeFloat32Array = Float32Array;
exports.NativeFloat32Array = NativeFloat32Array;
const ArrayIteratorPrototype = ReflectGetPrototypeOf([][SymbolIterator]());
exports.ArrayIteratorPrototype = ArrayIteratorPrototype;
const ArrayIteratorPrototypeNext = uncurryThis(ArrayIteratorPrototype.next);
exports.ArrayIteratorPrototypeNext = ArrayIteratorPrototypeNext;
const GeneratorPrototypeNext = uncurryThis(function* () {}().next);
exports.GeneratorPrototypeNext = GeneratorPrototypeNext;
const IteratorPrototype = ReflectGetPrototypeOf(ArrayIteratorPrototype);
exports.IteratorPrototype = IteratorPrototype;
const DataViewPrototype = DataView.prototype;
const DataViewPrototypeGetUint16 = uncurryThis(DataViewPrototype.getUint16);
exports.DataViewPrototypeGetUint16 = DataViewPrototypeGetUint16;
const DataViewPrototypeSetUint16 = uncurryThis(DataViewPrototype.setUint16);
exports.DataViewPrototypeSetUint16 = DataViewPrototypeSetUint16;
const NativeTypeError = TypeError;
exports.NativeTypeError = NativeTypeError;
const NativeRangeError = RangeError;
exports.NativeRangeError = NativeRangeError;
const NativeWeakSet = WeakSet;
exports.NativeWeakSet = NativeWeakSet;
const WeakSetPrototype = NativeWeakSet.prototype;
const WeakSetPrototypeAdd = uncurryThis(WeakSetPrototype.add);
exports.WeakSetPrototypeAdd = WeakSetPrototypeAdd;
const WeakSetPrototypeHas = uncurryThis(WeakSetPrototype.has);
exports.WeakSetPrototypeHas = WeakSetPrototypeHas;
const NativeWeakMap = WeakMap;
exports.NativeWeakMap = NativeWeakMap;
const WeakMapPrototype = NativeWeakMap.prototype;
const WeakMapPrototypeGet = uncurryThis(WeakMapPrototype.get);
exports.WeakMapPrototypeGet = WeakMapPrototypeGet;
const WeakMapPrototypeHas = uncurryThis(WeakMapPrototype.has);
exports.WeakMapPrototypeHas = WeakMapPrototypeHas;
const WeakMapPrototypeSet = uncurryThis(WeakMapPrototype.set);
exports.WeakMapPrototypeSet = WeakMapPrototypeSet;

/***/ }),

/***/ 700:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.IsDetachedBuffer = IsDetachedBuffer;
exports.SpeciesConstructor = SpeciesConstructor;
exports.ToIntegerOrInfinity = ToIntegerOrInfinity;
exports.ToLength = ToLength;
exports.defaultCompare = defaultCompare;

var _is = __webpack_require__(554);

var _messages = __webpack_require__(930);

var _primordials = __webpack_require__(983);

function ToIntegerOrInfinity(target) {
  const number = +target;

  if ((0, _primordials.NumberIsNaN)(number) || number === 0) {
    return 0;
  }

  return (0, _primordials.MathTrunc)(number);
}

function ToLength(target) {
  const length = ToIntegerOrInfinity(target);

  if (length < 0) {
    return 0;
  }

  return length < _primordials.MAX_SAFE_INTEGER ? length : _primordials.MAX_SAFE_INTEGER;
}

function SpeciesConstructor(target, defaultConstructor) {
  if (!(0, _is.isObject)(target)) {
    throw (0, _primordials.NativeTypeError)(_messages.THIS_IS_NOT_AN_OBJECT);
  }

  const constructor = target.constructor;

  if (constructor === undefined) {
    return defaultConstructor;
  }

  if (!(0, _is.isObject)(constructor)) {
    throw (0, _primordials.NativeTypeError)(_messages.THE_CONSTRUCTOR_PROPERTY_VALUE_IS_NOT_AN_OBJECT);
  }

  const species = constructor[_primordials.SymbolSpecies];

  if (species == null) {
    return defaultConstructor;
  }

  return species;
}

function IsDetachedBuffer(buffer) {
  if ((0, _is.isSharedArrayBuffer)(buffer)) {
    return false;
  }

  try {
    (0, _primordials.ArrayBufferPrototypeSlice)(buffer, 0, 0);
    return false;
  } catch (e) {}

  return true;
}

function defaultCompare(x, y) {
  const isXNaN = (0, _primordials.NumberIsNaN)(x);
  const isYNaN = (0, _primordials.NumberIsNaN)(y);

  if (isXNaN && isYNaN) {
    return 0;
  }

  if (isXNaN) {
    return 1;
  }

  if (isYNaN) {
    return -1;
  }

  if (x < y) {
    return -1;
  }

  if (x > y) {
    return 1;
  }

  if (x === 0 && y === 0) {
    const isXPlusZero = (0, _primordials.ObjectIs)(x, 0);
    const isYPlusZero = (0, _primordials.ObjectIs)(y, 0);

    if (!isXPlusZero && isYPlusZero) {
      return -1;
    }

    if (isXPlusZero && !isYPlusZero) {
      return 1;
    }
  }

  return 0;
}

/***/ }),

/***/ 216:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.hfround = hfround;

var _converter = __webpack_require__(605);

var _primordials = __webpack_require__(983);

function hfround(x) {
  const number = +x;

  if (!(0, _primordials.NumberIsFinite)(number) || number === 0) {
    return number;
  }

  const x16 = (0, _converter.roundToFloat16Bits)(number);
  return (0, _converter.convertToNumber)(x16);
}

/***/ }),

/***/ 650:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));

var _Float16Array = __webpack_require__(310);

exports.Float16Array = _Float16Array.Float16Array;
exports.isFloat16Array = _Float16Array.isFloat16Array;

var _isTypedArray = __webpack_require__(146);

exports.isTypedArray = _isTypedArray.isTypedArray;

var _DataView = __webpack_require__(557);

exports.getFloat16 = _DataView.getFloat16;
exports.setFloat16 = _DataView.setFloat16;

var _hfround = __webpack_require__(216);

exports.hfround = _hfround.hfround;

/***/ }),

/***/ 146:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.isTypedArray = isTypedArray;

var _Float16Array = __webpack_require__(310);

var _is = __webpack_require__(554);

function isTypedArray(target) {
  return (0, _is.isNativeTypedArray)(target) || (0, _Float16Array.isFloat16Array)(target);
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(607);
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=gpu-io.js.map