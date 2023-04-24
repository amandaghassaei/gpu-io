(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.GPUIO = {}));
})(this, (function (exports) { 'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
    }

    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    var typeChecks = {exports: {}};

    (function (module, exports) {
    	(function (global, factory) {
    		factory(exports) ;
    	})(commonjsGlobal, (function (exports) {
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
    	
    } (typeChecks, typeChecks.exports));

    var typeChecksExports = typeChecks.exports;

    // Data types and constants.
    /**
     * Half float data type.
     */
    var HALF_FLOAT = 'HALF_FLOAT';
    /**
     * Float data type.
     */
    var FLOAT = 'FLOAT';
    /**
     * Unsigned byte data type.
     */
    var UNSIGNED_BYTE = 'UNSIGNED_BYTE';
    /**
     * Byte data type.
     */
    var BYTE = 'BYTE';
    /**
     * Unsigned short data type.
     */
    var UNSIGNED_SHORT = 'UNSIGNED_SHORT';
    /**
     * Short data type.
     */
    var SHORT = 'SHORT';
    /**
     * Unsigned int data type.
     */
    var UNSIGNED_INT = 'UNSIGNED_INT';
    /**
     * Int data type.
     */
    var INT = 'INT';
    /**
     * Boolean data type (GPUProgram uniforms only).
     */
    var BOOL = 'BOOL';
    /**
     * Unsigned int data type (GPUProgram uniforms only).
     */
    var UINT = 'UINT';
    // Filter types.
    /**
     * Nearest texture filtering.
     */
    var NEAREST = 'NEAREST';
    /**
     * Linear texture filtering.
     */
    var LINEAR = 'LINEAR';
    // Wrap types.
    /**
     * Clamp to edge wrapping (no wrapping).
     */
    var CLAMP_TO_EDGE = 'CLAMP_TO_EDGE';
    /**
     * Repeat/periodic wrapping.
     */
    var REPEAT = 'REPEAT';
    /**
     * @private
     */
    var validArrayTypes = [Float32Array, Uint8Array, Int8Array, Uint16Array, Int16Array, Uint32Array, Int32Array, Array];
    /**
     * @private
     */
    var validDataTypes = [HALF_FLOAT, FLOAT, UNSIGNED_BYTE, BYTE, UNSIGNED_SHORT, SHORT, UNSIGNED_INT, INT];
    /**
     * @private
     */
    var validFilters = [NEAREST, LINEAR];
    /**
     * @private
     */
    var validWraps = [CLAMP_TO_EDGE, REPEAT]; // MIRRORED_REPEAT
    // For image urls that are passed in and inited as textures.
    /**
     * RGB image format.
     */
    var RGB = 'RGB';
    /**
     * RGBA image format.
     */
    var RGBA = 'RGBA';
    /**
     * @private
     */
    var validImageFormats = [RGB, RGBA];
    /**
     * @private
     */
    var validImageTypes = [UNSIGNED_BYTE, FLOAT, HALF_FLOAT];
    // GLSL versions.
    /**
     * GLSL version 300 (WebGL2 only).
     */
    var GLSL3 = '300 es';
    /**
     * GLSL version 100 (WebGL1 and WebGL2).
     */
    var GLSL1 = '100';
    // WebGL versions.
    /**
     * WebGL2 context ID.
     */
    var WEBGL2 = 'webgl2';
    /**
     * WebGL1 context ID.
     */
    var WEBGL1 = 'webgl';
    /**
     * Experimental WebGL context ID.
     */
    var EXPERIMENTAL_WEBGL = 'experimental-webgl';
    /**
     * Experimental WebGL context ID.
     */
    var EXPERIMENTAL_WEBGL2 = 'experimental-webgl2';
    // Precision declarations.
    /**
     * GLSL lowp precision declaration.
     */
    var PRECISION_LOW_P = 'lowp';
    /**
     * GLSL mediump precision declaration.
     */
    var PRECISION_MEDIUM_P = 'mediump';
    /**
     * GLSL highp precision declaration.
     */
    var PRECISION_HIGH_P = 'highp';
    // Uniform types.
    /**
     * @private
     */
    var FLOAT_1D_UNIFORM = 'FLOAT_1D_UNIFORM';
    /**
     * @private
     */
    var FLOAT_2D_UNIFORM = 'FLOAT_2D_UNIFORM';
    /**
     * @private
     */
    var FLOAT_3D_UNIFORM = 'FLOAT_3D_UNIFORM';
    /**
     * @private
     */
    var FLOAT_4D_UNIFORM = 'FLOAT_4D_UNIFORM';
    /**
     * @private
     */
    var INT_1D_UNIFORM = 'INT_1D_UNIFORM';
    /**
     * @private
     */
    var INT_2D_UNIFORM = 'INT_2D_UNIFORM';
    /**
     * @private
     */
    var INT_3D_UNIFORM = 'INT_3D_UNIFORM';
    /**
     * @private
     */
    var INT_4D_UNIFORM = 'INT_4D_UNIFORM';
    /**
     * @private
     */
    var UINT_1D_UNIFORM = 'UINT_1D_UNIFORM';
    /**
     * @private
     */
    var UINT_2D_UNIFORM = 'UINT_2D_UNIFORM';
    /**
     * @private
     */
    var UINT_3D_UNIFORM = 'UINT_3D_UNIFORM';
    /**
     * @private
     */
    var UINT_4D_UNIFORM = 'UINT_4D_UNIFORM';
    /**
     * @private
     */
    var BOOL_1D_UNIFORM = 'BOOL_1D_UNIFORM';
    /**
    * @private
    */
    var BOOL_2D_UNIFORM = 'BOOL_2D_UNIFORM';
    /**
    * @private
    */
    var BOOL_3D_UNIFORM = 'BOOL_3D_UNIFORM';
    /**
    * @private
    */
    var BOOL_4D_UNIFORM = 'BOOL_4D_UNIFORM';
    // Vertex shader types.
    /**
     * @private
     */
    var DEFAULT_PROGRAM_NAME = 'DEFAULT';
    /**
     * @private
     */
    var SEGMENT_PROGRAM_NAME = 'SEGMENT';
    /**
     * @private
     */
    var LAYER_POINTS_PROGRAM_NAME = 'LAYER_POINTS';
    /**
     * @private
     */
    var LAYER_LINES_PROGRAM_NAME = 'LAYER_LINES';
    /**
     * @private
     */
    var LAYER_VECTOR_FIELD_PROGRAM_NAME = 'LAYER_VECTOR_FIELD';
    /**
     * @private
     */
    var LAYER_MESH_PROGRAM_NAME = 'LAYER_MESH';
    // Vertex shader compile time constants.
    /**
     * @private
     */
    var GPUIO_VS_WRAP_X = 'GPUIO_VS_WRAP_X';
    /**
     * @private
     */
    var GPUIO_VS_WRAP_Y = 'GPUIO_VS_WRAP_Y';
    /**
     * @private
     */
    var GPUIO_VS_INDEXED_POSITIONS = 'GPUIO_VS_INDEXED_POSITIONS';
    /**
     * @private
     */
    var GPUIO_VS_UV_ATTRIBUTE = 'GPUIO_VS_UV_ATTRIBUTE';
    /**
    * @private
    */
    var GPUIO_VS_NORMAL_ATTRIBUTE = 'GPUIO_VS_NORMAL_ATTRIBUTE';
    /**
     * @private
     */
    var GPUIO_VS_POSITION_W_ACCUM = 'GPUIO_VS_POSITION_W_ACCUM';
    /**
     * @private
     */
    var DEFAULT_ERROR_CALLBACK = function (message) { throw new Error(message); };
    // For stepCircle() and stepSegment() (with end caps).
    /**
     * @private
     */
    var DEFAULT_CIRCLE_NUM_SEGMENTS = 18; // Must be divisible by 6 to work with stepSegment().
    // Extrema values.
    /**
     * @private
     */
    var MIN_UNSIGNED_BYTE = 0;
    /**
     * @private
     */
    var MAX_UNSIGNED_BYTE = Math.pow(2, 8) - 1;
    /**
     * @private
     */
    var MIN_BYTE = -(Math.pow(2, 7));
    /**
     * @private
     */
    var MAX_BYTE = Math.pow(2, 7) - 1;
    /**
     * @private
     */
    var MIN_UNSIGNED_SHORT = 0;
    /**
     * @private
     */
    var MAX_UNSIGNED_SHORT = Math.pow(2, 16) - 1;
    /**
     * @private
     */
    var MIN_SHORT = -(Math.pow(2, 15));
    /**
     * @private
     */
    var MAX_SHORT = Math.pow(2, 15) - 1;
    /**
     * @private
     */
    var MIN_UNSIGNED_INT = 0;
    /**
     * @private
     */
    var MAX_UNSIGNED_INT = Math.pow(2, 32) - 1;
    /**
     * @private
     */
    var MIN_INT = -(Math.pow(2, 31));
    /**
     * @private
     */
    var MAX_INT = Math.pow(2, 31) - 1;
    // There are larger HALF_FLOAT and FLOAT ints, but they may be spaced out by > 1.
    /**
     * @private
     */
    var MIN_HALF_FLOAT_INT = -2048;
    /**
     * @private
     */
    var MAX_HALF_FLOAT_INT = 2048;
    /**
     * @private
     */
    var MIN_FLOAT_INT = -16777216;
    /**
     * @private
     */
    var MAX_FLOAT_INT = 16777216;
    // Precision compile time constants
    /**
     * @private
     */
    var GPUIO_INT_PRECISION = 'GPUIO_INT_PRECISION';
    /**
     * @private
     */
    var GPUIO_FLOAT_PRECISION = 'GPUIO_FLOAT_PRECISION';
    var BOUNDARY_TOP = 'BOUNDARY_TOP';
    var BOUNDARY_BOTTOM = 'BOUNDARY_BOTTOM';
    var BOUNDARY_LEFT = 'BOUNDARY_LEFT';
    var BOUNDARY_RIGHT = 'BOUNDARY_RIGHT';

    /**
     * Enum for precision values.
     * See src/glsl/common/precision.ts for more info.
     * @private
     */
    function intForPrecision(precision) {
        if (precision === PRECISION_HIGH_P)
            return 2;
        if (precision === PRECISION_MEDIUM_P)
            return 1;
        if (precision === PRECISION_LOW_P)
            return 0;
        throw new Error("Unknown shader precision value: ".concat(JSON.stringify(precision), "."));
    }
    /**
     * @private
     */
    function uniformTypeForType(type, glslVersion) {
        switch (type) {
            case HALF_FLOAT:
            case FLOAT:
                return FLOAT;
            case UNSIGNED_BYTE:
            case UNSIGNED_SHORT:
            case UNSIGNED_INT:
                if (glslVersion === GLSL1)
                    return INT;
                return UINT;
            case BYTE:
            case SHORT:
            case INT:
                return INT;
            default:
                throw new Error("Invalid type: ".concat(type, " passed to glslKeyForType."));
        }
    }
    /**
     * @private
     */
    function arrayConstructorForType(type, halfFloatsAsFloats) {
        if (halfFloatsAsFloats === void 0) { halfFloatsAsFloats = false; }
        switch (type) {
            case HALF_FLOAT:
                if (halfFloatsAsFloats)
                    return Float32Array;
                return Uint16Array;
            case FLOAT:
                return Float32Array;
            case UNSIGNED_BYTE:
                return Uint8Array;
            case BYTE:
                return Int8Array;
            case UNSIGNED_SHORT:
                return Uint16Array;
            case SHORT:
                return Int16Array;
            case UNSIGNED_INT:
                return Uint32Array;
            case INT:
                return Int32Array;
            default:
                throw new Error("Unsupported type: \"".concat(type, "\"."));
        }
    }
    /**
     * @private
     */
    function glslTypeForType(type, numComponents) {
        switch (type) {
            case HALF_FLOAT:
            case FLOAT:
                if (numComponents === 1)
                    return 'float';
                return "vec".concat(numComponents);
            case UNSIGNED_BYTE:
            case UNSIGNED_SHORT:
            case UNSIGNED_INT:
                if (numComponents === 1)
                    return 'uint';
                return "uvec".concat(numComponents);
            case BYTE:
            case SHORT:
            case INT:
                if (numComponents === 1)
                    return 'int';
                return "ivec".concat(numComponents);
        }
        throw new Error("Invalid type: ".concat(type, " passed to glslTypeForType."));
    }
    /**
     * @private
     */
    function glslPrefixForType(type) {
        switch (type) {
            case HALF_FLOAT:
            case FLOAT:
                return '';
            case UNSIGNED_BYTE:
            case UNSIGNED_SHORT:
            case UNSIGNED_INT:
                return 'u';
            case BYTE:
            case SHORT:
            case INT:
                return 'i';
        }
        throw new Error("Invalid type: ".concat(type, " passed to glslPrefixForType."));
    }
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

    var conversions = /*#__PURE__*/Object.freeze({
        __proto__: null,
        arrayConstructorForType: arrayConstructorForType,
        glslComponentSelectionForNumComponents: glslComponentSelectionForNumComponents,
        glslPrefixForType: glslPrefixForType,
        glslTypeForType: glslTypeForType,
        intForPrecision: intForPrecision,
        uniformTypeForType: uniformTypeForType
    });

    // These precision definitions are applied to all vertex and fragment shaders.
    // Default to highp, but fallback to mediump if highp not available.
    // These defaults can be set in GPUComposer constructor as intPrecision and floatPrecision parameters.
    // https://webglfundamentals.org/webgl/lessons/webgl-precision-issues.html
    var PRECISION_SOURCE = "\n#if (".concat(GPUIO_INT_PRECISION, " == ").concat(intForPrecision(PRECISION_LOW_P), ")\n\tprecision lowp int;\n\t#if (__VERSION__ == 300)\n\t\tprecision lowp isampler2D;\n\t\tprecision lowp usampler2D;\n\t#endif\n#elif (").concat(GPUIO_INT_PRECISION, " == ").concat(intForPrecision(PRECISION_MEDIUM_P), ")\n\tprecision mediump int;\n\t#if (__VERSION__ == 300)\n\t\tprecision mediump isampler2D;\n\t\tprecision mediump usampler2D;\n\t#endif\n#else \n\t#ifdef GL_FRAGMENT_PRECISION_HIGH\n\t\tprecision highp int;\n\t\t#if (__VERSION__ == 300)\n\t\t\tprecision highp isampler2D;\n\t\t\tprecision highp usampler2D;\n\t\t#endif\n\t#else\n\t\tprecision mediump int;\n\t\t#if (__VERSION__ == 300)\n\t\t\tprecision mediump isampler2D;\n\t\t\tprecision mediump usampler2D;\n\t\t#endif\n\t#endif\n#endif\n#if (").concat(GPUIO_FLOAT_PRECISION, " == ").concat(intForPrecision(PRECISION_LOW_P), ")\n\tprecision lowp float;\n\tprecision lowp sampler2D;\n#elif (").concat(GPUIO_FLOAT_PRECISION, " == ").concat(intForPrecision(PRECISION_MEDIUM_P), ")\n\tprecision mediump float;\n\tprecision mediump sampler2D;\n#else\n\t#ifdef GL_FRAGMENT_PRECISION_HIGH\n\t\tprecision highp float;\n\t\tprecision highp sampler2D;\n\t#else\n\t\tprecision mediump float;\n\t\tprecision mediump sampler2D;\n\t#endif\n#endif\n");

    /**
     * Convert vertex shader "in" to "attribute".
     * @private
     */
    function glsl1VertexIn(shaderSource) {
        return shaderSource.replace(/\bin\b/g, 'attribute');
    }
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
        if (glslVersion === GLSL3) {
            // Check that fragment shader source DOES NOT contain gl_FragColor
            if (gl_FragColor) {
                throw new Error("Found \"gl_FragColor\" declaration in fragment shader for GPUProgram \"".concat(name, "\": either init GPUComposer with glslVersion = GLSL1 or use GLSL3 syntax in your fragment shader."));
            }
        }
    }
    /**
     * Convert texture to texture2D.
     * @private
     */
    function glsl1Texture(shaderSource) {
        return shaderSource.replace(/\btexture\(/g, 'texture2D(');
    }
    /**
     * Convert isampler2D and usampler2D to sampler2D.
     * @private
     */
    function glsl1Sampler2D(shaderSource) {
        return shaderSource.replace(/\b(i|u)sampler2D\b/g, 'sampler2D');
    }
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
    /**
     * Replace all highp with mediump.
     * @private
     */
    function highpToMediump(shaderSource) {
        return shaderSource.replace(/\bhighp\b/, 'mediump');
    }
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

    var regex = /*#__PURE__*/Object.freeze({
        __proto__: null,
        castVaryingToFloat: castVaryingToFloat,
        checkFragmentShaderForFragColor: checkFragmentShaderForFragColor,
        getFragmentOuts: getFragmentOuts,
        getSampler2DsInProgram: getSampler2DsInProgram,
        glsl1FragmentIn: glsl1FragmentIn,
        glsl1FragmentOut: glsl1FragmentOut,
        glsl1Sampler2D: glsl1Sampler2D,
        glsl1Texture: glsl1Texture,
        glsl1Uint: glsl1Uint,
        glsl1VertexIn: glsl1VertexIn,
        glsl1VertexOut: glsl1VertexOut,
        highpToMediump: highpToMediump,
        stripComments: stripComments,
        stripPrecision: stripPrecision,
        stripVersion: stripVersion
    });

    /**
     * Wrap type to use in polyfill.
     * (0) Default behavior (no polyfill).
     * (1) REPEAT polyfill.
     * @private
     */
    var SAMPLER2D_WRAP_X = 'GPUIO_WRAP_X';
    /**
     * Wrap type to use in polyfill.
     * (0) Default behavior (no polyfill).
     * (1) REPEAT polyfill.
     * @private
     */
    var SAMPLER2D_WRAP_Y = 'GPUIO_WRAP_Y';
    /**
     * Flag to cast texture() result to int type (needed for GLSL1).
     * @private
     */
    var SAMPLER2D_CAST_INT = 'GPUIO_CAST_INT';
    /**
     * Filter type to use in polyfill.
     * (0) Default behavior (no polyfill).
     * (0) LINEAR polyfill.
     * @private
     */
    var SAMPLER2D_FILTER = 'GPUIO_FILTER';
    /**
     * UV size of half a pixel for this texture.
     * @private
     */
    var SAMPLER2D_HALF_PX_UNIFORM = 'u_gpuio_half_px';
    /**
     * Dimensions of texture
     * @private
     */
    var SAMPLER2D_DIMENSIONS_UNIFORM = 'u_gpuio_dimensions';
    /**
     * Override texture function to perform polyfill filter/wrap.
     * https://www.codeproject.com/Articles/236394/Bi-Cubic-and-Bi-Linear-Interpolation-with-GLSL
     * @private
     */
    function texturePolyfill(shaderSource) {
        var textureCalls = shaderSource.match(/\btexture\(/g);
        if (!textureCalls || textureCalls.length === 0)
            return { shaderSource: shaderSource, samplerUniforms: [] };
        var samplerUniforms = getSampler2DsInProgram(shaderSource);
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
            polyfillUniforms["".concat(SAMPLER2D_HALF_PX_UNIFORM).concat(i)] = 'vec2';
            polyfillUniforms["".concat(SAMPLER2D_DIMENSIONS_UNIFORM).concat(i)] = 'vec2';
        }
        function make_GPUIO_TEXTURE_POLYFILL(i, prefix, castOpening) {
            if (castOpening === void 0) { castOpening = ''; }
            var castEnding = castOpening === '' ? '' : ')';
            var returnPrefix = castOpening === '' ? prefix : 'i';
            return "\n".concat(returnPrefix, "vec4 GPUIO_TEXTURE_POLYFILL").concat(i, "(const ").concat(prefix, "sampler2D sampler, const vec2 uv) {\n\t").concat(prefix === '' ? "#if (".concat(SAMPLER2D_FILTER).concat(i, " == 0)") : '', "\n\t\t#if (").concat(SAMPLER2D_WRAP_X).concat(i, " == 0)\n\t\t\t#if (").concat(SAMPLER2D_WRAP_Y).concat(i, " == 0)\n\t\t\t\treturn ").concat(castOpening, "texture(sampler, uv)").concat(castEnding, ";\n\t\t\t#else\n\t\t\t\treturn ").concat(castOpening, "GPUIO_TEXTURE_WRAP_CLAMP_REPEAT(sampler, uv, ").concat(SAMPLER2D_HALF_PX_UNIFORM).concat(i, ")").concat(castEnding, ";\n\t\t\t#endif\n\t\t#else\n\t\t\t#if (").concat(SAMPLER2D_WRAP_Y).concat(i, " == 0)\n\t\t\t\treturn ").concat(castOpening, "GPUIO_TEXTURE_WRAP_REPEAT_CLAMP(sampler, uv, ").concat(SAMPLER2D_HALF_PX_UNIFORM).concat(i, ")").concat(castEnding, ";\n\t\t\t#else\n\t\t\t\treturn ").concat(castOpening, "GPUIO_TEXTURE_WRAP_REPEAT_REPEAT(sampler, uv, ").concat(SAMPLER2D_HALF_PX_UNIFORM).concat(i, ")").concat(castEnding, ";\n\t\t\t#endif\n\t\t#endif\n\t").concat(prefix === '' ? "#else\n\t\t#if (".concat(SAMPLER2D_WRAP_X).concat(i, " == 0)\n\t\t\t#if (").concat(SAMPLER2D_WRAP_Y).concat(i, " == 0)\n\t\t\t\treturn ").concat(castOpening, "GPUIO_TEXTURE_BILINEAR_INTERP(sampler, uv, ").concat(SAMPLER2D_HALF_PX_UNIFORM).concat(i, ", ").concat(SAMPLER2D_DIMENSIONS_UNIFORM).concat(i, ")").concat(castEnding, ";\n\t\t\t#else\n\t\t\t\treturn ").concat(castOpening, "GPUIO_TEXTURE_BILINEAR_INTERP_WRAP_CLAMP_REPEAT(sampler, uv, ").concat(SAMPLER2D_HALF_PX_UNIFORM).concat(i, ", ").concat(SAMPLER2D_DIMENSIONS_UNIFORM).concat(i, ")").concat(castEnding, ";\n\t\t\t#endif\n\t\t#else\n\t\t\t#if (").concat(SAMPLER2D_WRAP_Y).concat(i, " == 0)\n\t\t\t\treturn ").concat(castOpening, "GPUIO_TEXTURE_BILINEAR_INTERP_WRAP_REPEAT_CLAMP(sampler, uv, ").concat(SAMPLER2D_HALF_PX_UNIFORM).concat(i, ", ").concat(SAMPLER2D_DIMENSIONS_UNIFORM).concat(i, ")").concat(castEnding, ";\n\t\t\t#else\n\t\t\t\treturn ").concat(castOpening, "GPUIO_TEXTURE_BILINEAR_INTERP_WRAP_REPEAT_REPEAT(sampler, uv, ").concat(SAMPLER2D_HALF_PX_UNIFORM).concat(i, ", ").concat(SAMPLER2D_DIMENSIONS_UNIFORM).concat(i, ")").concat(castEnding, ";\n\t\t\t#endif\n\t\t#endif\n\t#endif") : '', "\n}\n");
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
            return "#ifndef ".concat(SAMPLER2D_CAST_INT).concat(index, "\n\t").concat(make_GPUIO_TEXTURE_POLYFILL(index, ''), "\n#endif");
        }).join('\n'), "\n#if (__VERSION__ == 300)\n").concat(['u', 'i'].map(function (prefix) {
            return samplerUniforms.map(function (uniform, index) {
                return make_GPUIO_TEXTURE_POLYFILL(index, prefix);
            }).join('\n');
        }).join('\n'), "\n#else\n\t").concat(samplerUniforms.map(function (uniform, index) {
            return "#ifdef ".concat(SAMPLER2D_CAST_INT).concat(index, "\n\t").concat(make_GPUIO_TEXTURE_POLYFILL(index, '', 'ivec4('), "\n#endif");
        }).join('\n'), "\n#endif\n\n").concat(shaderSource);
        return {
            shaderSource: shaderSource,
            samplerUniforms: samplerUniforms,
        };
    }
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
    function abs(type) { return "".concat(type, " abs(const ").concat(type, " a) { return ").concat(type, "(abs(").concat(floatTypeForIntType(type), "(a))); }"); }
    function sign(type) { return "".concat(type, " sign(const ").concat(type, " a) { return ").concat(type, "(sign(").concat(floatTypeForIntType(type), "(a))); }"); }
    function trunc(type) { return "".concat(type, " trunc(const ").concat(type, " a) { return round(a - fract(a) * sign(a)); }"); }
    function round(type) { return "".concat(type, " round(const ").concat(type, " a) { return floor(a + 0.5); }"); }
    function roundEven(type) { return "".concat(type, " roundEven(const ").concat(type, " a) { return 2.0 * round(a / 2.0); }"); }
    function min(type1, type2) { return "".concat(type1, " min(const ").concat(type1, " a, const ").concat(type2, " b) { return ").concat(type1, "(min(").concat(floatTypeForIntType(type1), "(a), ").concat(floatTypeForIntType(type2), "(b))); }"); }
    function max(type1, type2) { return "".concat(type1, " max(const ").concat(type1, " a, const ").concat(type2, " b) { return ").concat(type1, "(max(").concat(floatTypeForIntType(type1), "(a), ").concat(floatTypeForIntType(type2), "(b))); }"); }
    function clamp(type1, type2) { return "".concat(type1, " clamp(const ").concat(type1, " a, const ").concat(type2, " min, const ").concat(type2, " max) { return ").concat(type1, "(clamp(").concat(floatTypeForIntType(type1), "(a), ").concat(floatTypeForIntType(type2), "(min), ").concat(floatTypeForIntType(type2), "(max))); }"); }
    function mix(type1, type2) { return "".concat(type1, " mix(const ").concat(type1, " a, const ").concat(type1, " b, const ").concat(type2, " c) { return mix(a, b, ").concat(floatTypeForBoolType(type2), "(c)); }"); }
    function det2(n, m, size) { return "a[".concat(n, "][").concat(m, "] * a[").concat((n + 1) % size, "][").concat((m + 1) % size, "] - a[").concat((n + 1) % size, "][").concat(m, "] * a[").concat(n, "][").concat((m + 1) % size, "]"); }
    // TODO: I don't think these are quite right yet.
    function det3(n, m, size) { return [0, 1, 2].map(function (offset) { return "a[".concat(n, "][").concat((m + offset) % size, "] * (").concat(det2((n + 1) % size, (m + 1 + offset) % size, size), ")"); }).join(' + '); }
    function det4(n, m, size) { return [0, 1, 2, 3].map(function (offset) { return "a[".concat(n, "][").concat((m + offset) % size, "] * (").concat(det3((n + 1) % size, (m + 1 + offset) % size, size), ")"); }).join(' + '); }
    /**
     * Polyfill common functions/operators that GLSL1 lacks.
     * @private
     */
    function GLSL1Polyfills(shaderSource) {
        // We'll attempt to just add in what we need, but no worries if we add extraneous functions.
        // They will be removed by compiler.
        var GLSL1_POLYFILLS = '';
        // We don't need to create unsigned int polyfills, bc unsigned int is not a supported type in GLSL1.
        // All unsigned int variables will be cast as int and be caught by the signed int polyfills.
        if (shaderSource.includes('abs')) {
            GLSL1_POLYFILLS += "\n\n\n".concat(abs('int'), "\n").concat(abs('ivec2'), "\n").concat(abs('ivec3'), "\n").concat(abs('ivec4'), "\n");
        }
        if (shaderSource.includes('sign')) {
            GLSL1_POLYFILLS += "\n\n\n".concat(sign('int'), "\n").concat(sign('ivec2'), "\n").concat(sign('ivec3'), "\n").concat(sign('ivec4'), "\n");
        }
        if (shaderSource.includes('round')) {
            GLSL1_POLYFILLS += "\n\n\n".concat(round('float'), "\n").concat(round('vec2'), "\n").concat(round('vec3'), "\n").concat(round('vec4'), "\n");
        }
        if (shaderSource.includes('trunc')) {
            GLSL1_POLYFILLS += "\n\n\n".concat(trunc('float'), "\n").concat(trunc('vec2'), "\n").concat(trunc('vec3'), "\n").concat(trunc('vec4'), "\n");
        }
        if (shaderSource.includes('roundEven')) {
            GLSL1_POLYFILLS += "\n\n\n".concat(roundEven('float'), "\n").concat(roundEven('vec2'), "\n").concat(roundEven('vec3'), "\n").concat(roundEven('vec4'), "\n");
        }
        if (shaderSource.includes('min')) {
            GLSL1_POLYFILLS += "\n\n\n".concat(min('int', 'int'), "\n").concat(min('ivec2', 'ivec2'), "\n").concat(min('ivec3', 'ivec3'), "\n").concat(min('ivec4', 'ivec4'), "\n").concat(min('ivec2', 'int'), "\n").concat(min('ivec3', 'int'), "\n").concat(min('ivec4', 'int'), "\n");
        }
        if (shaderSource.includes('max')) {
            GLSL1_POLYFILLS += "\n\n\n".concat(max('int', 'int'), "\n").concat(max('ivec2', 'ivec2'), "\n").concat(max('ivec3', 'ivec3'), "\n").concat(max('ivec4', 'ivec4'), "\n").concat(max('ivec2', 'int'), "\n").concat(max('ivec3', 'int'), "\n").concat(max('ivec4', 'int'), "\n");
        }
        if (shaderSource.includes('clamp')) {
            GLSL1_POLYFILLS += "\n\n\n".concat(clamp('int', 'int'), "\n").concat(clamp('ivec2', 'ivec2'), "\n").concat(clamp('ivec3', 'ivec3'), "\n").concat(clamp('ivec4', 'ivec4'), "\n").concat(clamp('ivec2', 'int'), "\n").concat(clamp('ivec3', 'int'), "\n").concat(clamp('ivec4', 'int'), "\n");
        }
        if (shaderSource.includes('mix')) {
            GLSL1_POLYFILLS += "\n\n\n".concat(mix('float', 'bool'), "\n").concat(mix('vec2', 'bvec2'), "\n").concat(mix('vec3', 'bvec3'), "\n").concat(mix('vec4', 'bvec4'), "\n");
        }
        if (shaderSource.includes('outerProduct')) {
            GLSL1_POLYFILLS += "\n\n\nmat2 outerProduct(const vec2 a, const vec2 b) {\n\treturn mat2(\n\t\ta.x * b.x, a.x * b.y,\n\t\ta.y * b.x, a.y * b.y\n\t);\n}\nmat3 outerProduct(const vec3 a, const vec3 b) {\n\treturn mat3(\n\t\ta.x * b.x, a.x * b.y, a.x * b.z,\n\t\ta.y * b.x, a.y * b.y, a.y * b.z,\n\t\ta.z * b.x, a.z * b.y, a.z * b.z\n\t);\n}\nmat4 outerProduct(const vec4 a, const vec4 b) {\n\treturn mat4(\n\t\ta.x * b.x, a.x * b.y, a.x * b.z, a.x * b.w,\n\t\ta.y * b.x, a.y * b.y, a.y * b.z, a.y * b.w,\n\t\ta.z * b.x, a.z * b.y, a.z * b.z, a.z * b.w,\n\t\ta.w * b.x, a.w * b.y, a.w * b.z, a.w * b.w\n\t);\n}\n";
        }
        if (shaderSource.includes('transpose')) {
            GLSL1_POLYFILLS += "\n\n\nmat2 transpose(mat2 a) {\n\tfloat temp = a[0][1];\n\ta[0][1] = a[1][0];\n\ta[1][0] = temp;\n\treturn a;\n}\nmat3 transpose(mat3 a) {\n\tfloat temp = a[0][2];\n\ta[0][2] = a[2][0];\n\ta[2][0] = temp;\n\ttemp = a[0][1];\n\ta[0][1] = a[1][0];\n\ta[1][0] = temp;\n\ttemp = a[1][2];\n\ta[1][2] = a[2][1];\n\ta[2][1] = temp;\n\treturn a;\n}\nmat4 transpose(mat4 a) {\n\tfloat temp = a[0][3];\n\ta[0][3] = a[3][0];\n\ta[3][0] = temp;\n\ttemp = a[0][2];\n\ta[0][2] = a[2][0];\n\ta[2][0] = temp;\n\ttemp = a[2][3];\n\ta[2][3] = a[3][2];\n\ta[3][2] = temp;\n\ttemp = a[0][1];\n\ta[0][1] = a[1][0];\n\ta[1][0] = temp;\n\ttemp = a[1][2];\n\ta[1][2] = a[2][1];\n\ta[2][1] = temp;\n\ttemp = a[2][3];\n\ta[2][3] = a[3][2];\n\ta[3][2] = temp;\n\treturn a;\n}\n";
        }
        if (shaderSource.includes('determinant')) {
            GLSL1_POLYFILLS += "\n\n\nfloat determinant(const mat2 a) {\n\treturn ".concat(det2(0, 0, 2), ";\n}\nfloat determinant(const mat3 a) {\n\treturn ").concat(det3(0, 0, 3), ";\n}\nfloat determinant(const mat4 a) {\n\treturn ").concat(det4(0, 0, 4), ";\n}\n");
        }
        // Copied from https://github.com/gpujs/gpu.js/blob/master/src/backend/web-gl/fragment-shader.js
        if (shaderSource.includes('sinh')) {
            GLSL1_POLYFILLS += "\n\n\nfloat sinh(const float x) {\n\treturn (pow(".concat(Math.E, ", x) - pow(").concat(Math.E, ", -x)) / 2.0;\n}\n");
        }
        if (shaderSource.includes('cosh')) {
            GLSL1_POLYFILLS += "\n\n\nfloat cosh(const float x) {\n\treturn (pow(".concat(Math.E, ", x) + pow(").concat(Math.E, ", -x)) / 2.0; \n}\n");
        }
        if (shaderSource.includes('tanh')) {
            GLSL1_POLYFILLS += "\n\n\nfloat tanh(const float x) {\n\tfloat e = exp(2.0 * x);\n\treturn (e - 1.0) / (e + 1.0);\n}\n";
        }
        if (shaderSource.includes('asinh')) {
            GLSL1_POLYFILLS += "\n\n\nfloat asinh(const float x) {\n\treturn log(x + sqrt(x * x + 1.0));\n}\n";
        }
        if (shaderSource.includes('asinh')) {
            GLSL1_POLYFILLS += "\n\n\nfloat acosh(const float x) {\n\treturn log(x + sqrt(x * x - 1.0));\n}\n";
        }
        if (shaderSource.includes('asinh')) {
            GLSL1_POLYFILLS += "\n\n\nfloat atanh(float x) {\n\tx = (x + 1.0) / (x - 1.0);\n\treturn 0.5 * log(x * sign(x));\n}\n";
        }
        return GLSL1_POLYFILLS;
    }
    function index1DToUV(type1, type2) {
        return "vec2 index1DToUV(const ".concat(type1, " index1D, const ").concat(type2, " dimensions) {\n\t").concat(type1, " width = ").concat(type1, "(dimensions.x);\n\t").concat(type1, " y = index1D / width;\n\t").concat(type1, " x = index1D - width * y;\n\tfloat u = (float(x) + 0.5) / float(dimensions.x);\n\tfloat v = (float(y) + 0.5) / float(dimensions.y);\n\treturn vec2(u, v);\n}");
    }
    function modi(type1, type2) { return "".concat(type1, " modi(const ").concat(type1, " x, const ").concat(type2, " y) { return x - y * (x / y); }"); }
    function stepi(type1, type2) { return "".concat(type2, " stepi(const ").concat(type1, " x, const ").concat(type2, " y) { return ").concat(type2, "(step(").concat(floatTypeForIntType(type1), "(x), ").concat(floatTypeForIntType(type2), "(y))); }"); }
    function bitshiftLeft(type1, type2) {
        return "".concat(type1, " bitshiftLeft(const ").concat(type1, " a, const ").concat(type2, " b) {\n\t#if (__VERSION__ == 300)\n\t\treturn a << b;\n\t#else\n\t\treturn a * ").concat(type1, "(pow(").concat(floatTypeForIntType(type2), "(2.0), ").concat(floatTypeForIntType(type2), "(b)));\n\t#endif\n}");
    }
    function bitshiftRight(type1, type2) {
        return "".concat(type1, " bitshiftRight(const ").concat(type1, " a, const ").concat(type2, " b) {\n\t#if (__VERSION__ == 300)\n\t\treturn a >> b;\n\t#else\n\t\treturn ").concat(type1, "(round(").concat(floatTypeForIntType(type1), "(a) / pow(").concat(floatTypeForIntType(type2), "(2.0), ").concat(floatTypeForIntType(type2), "(b))));\n\t#endif\n}");
    }
    // Copied from https://github.com/gpujs/gpu.js/blob/master/src/backend/web-gl/fragment-shader.js
    // Seems like these could be optimized.
    function bitwiseOr(numBits) {
        return "int bitwiseOr".concat(numBits === 32 ? '' : numBits, "(int a, int b) {\n\t#if (__VERSION__ == 300)\n\t\treturn a | b;\n\t#else\n\t\tint result = 0;\n\t\tint n = 1;\n\t\t\n\t\tfor (int i = 0; i < ").concat(numBits, "; i++) {\n\t\t\tif ((modi(a, 2) == 1) || (modi(b, 2) == 1)) {\n\t\t\t\tresult += n;\n\t\t\t}\n\t\t\ta = a / 2;\n\t\t\tb = b / 2;\n\t\t\tn = n * 2;\n\t\t\tif(!(a > 0 || b > 0)) {\n\t\t\t\tbreak;\n\t\t\t}\n\t\t}\n\t\treturn result;\n\t#endif\n}");
    }
    function bitwiseXOR(numBits) {
        return "int bitwiseXOR".concat(numBits === 32 ? '' : numBits, "(int a, int b) {\n\t#if (__VERSION__ == 300)\n\t\treturn a ^ b;\n\t#else\n\t\tint result = 0;\n\t\tint n = 1;\n\t\t\n\t\tfor (int i = 0; i < ").concat(numBits, "; i++) {\n\t\t\tif ((modi(a, 2) == 1) != (modi(b, 2) == 1)) {\n\t\t\t\tresult += n;\n\t\t\t}\n\t\t\ta = a / 2;\n\t\t\tb = b / 2;\n\t\t\tn = n * 2;\n\t\t\tif(!(a > 0 || b > 0)) {\n\t\t\t\tbreak;\n\t\t\t}\n\t\t}\n\t\treturn result;\n\t#endif\n}");
    }
    function bitwiseAnd(numBits) {
        return "int bitwiseAnd".concat(numBits === 32 ? '' : numBits, "(int a, int b) {\n\t#if (__VERSION__ == 300)\n\t\treturn a & b;\n\t#else\n\t\tint result = 0;\n\t\tint n = 1;\n\t\tfor (int i = 0; i < ").concat(numBits, "; i++) {\n\t\t\tif ((modi(a, 2) == 1) && (modi(b, 2) == 1)) {\n\t\t\t\tresult += n;\n\t\t\t}\n\t\t\ta = a / 2;\n\t\t\tb = b / 2;\n\t\t\tn = n * 2;\n\t\t\tif(!(a > 0 && b > 0)) {\n\t\t\t\tbreak;\n\t\t\t}\n\t\t}\n\t\treturn result;\n\t#endif\n}");
    }
    function bitwiseNot(numBits) {
        return "int bitwiseNot".concat(numBits === 32 ? '' : numBits, "(int a) {\n\t#if (__VERSION__ == 300)\n\t\treturn ~a;\n\t#else\n\t\tint result = 0;\n\t\tint n = 1;\n\n\t\tfor (int i = 0; i < ").concat(numBits, "; i++) {\n\t\t\tif (modi(a, 2) == 0) {\n\t\t\t\tresult += n;\n\t\t\t}\n\t\t\ta = a / 2;\n\t\t\tn = n * 2;\n\t\t}\n\t\treturn result;\n\t#endif\n}");
    }
    /**
     * Polyfills to be make available for both GLSL1 and GLSL3 fragment shaders.
     * @private
     */
    function fragmentShaderPolyfills(shaderSource, glslVersion) {
        // We'll attempt to just add in what we need, but no worries if we add extraneous functions.
        // They will be removed by compiler.
        var FRAGMENT_SHADER_POLYFILLS = '';
        // index1DToUV gives UV coords for 1D indices (for 1D GPULayers).
        if (shaderSource.includes('index1DToUV')) {
            FRAGMENT_SHADER_POLYFILLS += "\n\n".concat(index1DToUV('int', 'ivec2'), "\n").concat(index1DToUV('int', 'vec2'), "\n#if (__VERSION__ == 300)\n").concat(index1DToUV('int', 'uvec2'), "\n").concat(index1DToUV('uint', 'uvec2'), "\n").concat(index1DToUV('uint', 'ivec2'), "\n").concat(index1DToUV('uint', 'vec2'), "\n#endif\n");
        }
        // modi is called from GLSL1 bitwise polyfills.
        if (shaderSource.includes('modi') || (glslVersion === GLSL1 && shaderSource.includes('bitwise'))) {
            FRAGMENT_SHADER_POLYFILLS += "\n\n".concat(modi('int', 'int'), "\n").concat(modi('ivec2', 'ivec2'), "\n").concat(modi('ivec3', 'ivec3'), "\n").concat(modi('ivec4', 'ivec4'), "\n").concat(modi('ivec2', 'int'), "\n").concat(modi('ivec3', 'int'), "\n").concat(modi('ivec4', 'int'), "\n#if (__VERSION__ == 300)\n").concat(modi('uint', 'uint'), "\n").concat(modi('uvec2', 'uvec2'), "\n").concat(modi('uvec3', 'uvec3'), "\n").concat(modi('uvec4', 'uvec4'), "\n").concat(modi('uvec2', 'uint'), "\n").concat(modi('uvec3', 'uint'), "\n").concat(modi('uvec4', 'uint'), "\n#endif\n");
        }
        if (shaderSource.includes('stepi')) {
            FRAGMENT_SHADER_POLYFILLS += "\n\n".concat(stepi('int', 'int'), "\n").concat(stepi('ivec2', 'ivec2'), "\n").concat(stepi('ivec3', 'ivec3'), "\n").concat(stepi('ivec4', 'ivec4'), "\n").concat(stepi('int', 'ivec2'), "\n").concat(stepi('int', 'ivec3'), "\n").concat(stepi('int', 'ivec4'), "\n#if (__VERSION__ == 300)\n").concat(stepi('uint', 'uint'), "\n").concat(stepi('uvec2', 'uvec2'), "\n").concat(stepi('uvec3', 'uvec3'), "\n").concat(stepi('uvec4', 'uvec4'), "\n").concat(stepi('uint', 'uvec2'), "\n").concat(stepi('uint', 'uvec3'), "\n").concat(stepi('uint', 'uvec4'), "\n#endif\n");
        }
        if (shaderSource.includes('bitshiftLeft')) {
            FRAGMENT_SHADER_POLYFILLS += "\n\n".concat(bitshiftLeft('int', 'int'), "\n").concat(bitshiftLeft('ivec2', 'ivec2'), "\n").concat(bitshiftLeft('ivec3', 'ivec3'), "\n").concat(bitshiftLeft('ivec4', 'ivec4'), "\n").concat(bitshiftLeft('ivec2', 'int'), "\n").concat(bitshiftLeft('ivec3', 'int'), "\n").concat(bitshiftLeft('ivec4', 'int'), "\n#if (__VERSION__ == 300)\n").concat(bitshiftLeft('uint', 'uint'), "\n").concat(bitshiftLeft('uvec2', 'uvec2'), "\n").concat(bitshiftLeft('uvec3', 'uvec3'), "\n").concat(bitshiftLeft('uvec4', 'uvec4'), "\n").concat(bitshiftLeft('uvec2', 'uint'), "\n").concat(bitshiftLeft('uvec3', 'uint'), "\n").concat(bitshiftLeft('uvec4', 'uint'), "\n#endif\n");
        }
        if (shaderSource.includes('bitshiftRight')) {
            FRAGMENT_SHADER_POLYFILLS += "\n\n".concat(bitshiftRight('int', 'int'), "\n").concat(bitshiftRight('ivec2', 'ivec2'), "\n").concat(bitshiftRight('ivec3', 'ivec3'), "\n").concat(bitshiftRight('ivec4', 'ivec4'), "\n").concat(bitshiftRight('ivec2', 'int'), "\n").concat(bitshiftRight('ivec3', 'int'), "\n").concat(bitshiftRight('ivec4', 'int'), "\n#if (__VERSION__ == 300)\n").concat(bitshiftRight('uint', 'uint'), "\n").concat(bitshiftRight('uvec2', 'uvec2'), "\n").concat(bitshiftRight('uvec3', 'uvec3'), "\n").concat(bitshiftRight('uvec4', 'uvec4'), "\n").concat(bitshiftRight('uvec2', 'uint'), "\n").concat(bitshiftRight('uvec3', 'uint'), "\n").concat(bitshiftRight('uvec4', 'uint'), "\n#endif\n");
        }
        if (shaderSource.includes('bitwiseOr')) {
            FRAGMENT_SHADER_POLYFILLS += "\n\n".concat(bitwiseOr(8), "\n").concat(bitwiseOr(16), "\n").concat(bitwiseOr(32), "\n#if (__VERSION__ == 300)\n").concat([8, 16, ''].map(function (suffix) {
                return "\nuint bitwiseOr".concat(suffix, "(uint a, uint b) {\n\treturn uint(bitwiseOr").concat(suffix, "(int(a), int(b)));\n}");
            }).join('\n'), "\n#endif\n");
        }
        if (shaderSource.includes('bitwiseXOR')) {
            FRAGMENT_SHADER_POLYFILLS += "\n\n".concat(bitwiseXOR(8), "\n").concat(bitwiseXOR(16), "\n").concat(bitwiseXOR(32), "\n#if (__VERSION__ == 300)\n").concat([8, 16, ''].map(function (suffix) {
                return "\nuint bitwiseXOR".concat(suffix, "(uint a, uint b) {\n\treturn uint(bitwiseXOR").concat(suffix, "(int(a), int(b)));\n}");
            }).join('\n'), "\n#endif\n");
        }
        if (shaderSource.includes('bitwiseAnd')) {
            FRAGMENT_SHADER_POLYFILLS += "\n\n".concat(bitwiseAnd(8), "\n").concat(bitwiseAnd(16), "\n").concat(bitwiseAnd(32), "\n#if (__VERSION__ == 300)\n").concat([8, 16, ''].map(function (suffix) {
                return "\nuint bitwiseAnd".concat(suffix, "(uint a, uint b) {\n\treturn uint(bitwiseAnd").concat(suffix, "(int(a), int(b)));\n}");
            }).join('\n'), "\n#endif\n");
        }
        if (shaderSource.includes('bitwiseNot')) {
            FRAGMENT_SHADER_POLYFILLS += "\n\n".concat(bitwiseNot(8), "\n").concat(bitwiseNot(16), "\n").concat(bitwiseNot(32), "\n#if (__VERSION__ == 300)\n").concat([8, 16, ''].map(function (suffix) {
                return "\nuint bitwiseNot".concat(suffix, "(uint a) {\n\treturn uint(bitwiseNot").concat(suffix, "(int(a)));\n}");
            }).join('\n'), "\n#endif\n");
        }
        return FRAGMENT_SHADER_POLYFILLS;
    }

    var polyfills = /*#__PURE__*/Object.freeze({
        __proto__: null,
        GLSL1Polyfills: GLSL1Polyfills,
        SAMPLER2D_CAST_INT: SAMPLER2D_CAST_INT,
        SAMPLER2D_DIMENSIONS_UNIFORM: SAMPLER2D_DIMENSIONS_UNIFORM,
        SAMPLER2D_FILTER: SAMPLER2D_FILTER,
        SAMPLER2D_HALF_PX_UNIFORM: SAMPLER2D_HALF_PX_UNIFORM,
        SAMPLER2D_WRAP_X: SAMPLER2D_WRAP_X,
        SAMPLER2D_WRAP_Y: SAMPLER2D_WRAP_Y,
        fragmentShaderPolyfills: fragmentShaderPolyfills,
        texturePolyfill: texturePolyfill
    });

    /**
     * Memoize results of more complex WebGL tests (that require allocations/deallocations).
     * @private
     */
    var results$1 = {
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
        return type === FLOAT || type === HALF_FLOAT;
    }
    /**
     * Test whether a GPULayer type is an unsigned int type.
     * @private
     */
    function isUnsignedIntType(type) {
        return type === UNSIGNED_BYTE || type === UNSIGNED_SHORT || type === UNSIGNED_INT;
    }
    /**
     * Test whether a GPULayer type is a signed int type.
     * @private
     */
    function isSignedIntType(type) {
        return type === BYTE || type === SHORT || type === INT;
    }
    /**
     * Test whether a GPULayer type is a int type.
     * @private
     */
    function isIntType(type) {
        return isUnsignedIntType(type) || isSignedIntType(type);
    }
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
            if (!typeChecksExports.isString(key) || !typeChecksExports.isString(compileTimeConstants[key])) {
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
    function makeShaderHeader(glslVersion, intPrecision, floatPrecision, compileTimeConstants, extensions) {
        var _a;
        var versionSource = glslVersion === GLSL3 ? "#version ".concat(GLSL3, "\n") : '';
        var compileTimeConstantsSource = compileTimeConstants ? convertCompileTimeConstantsToString(compileTimeConstants) : '';
        var precisionConstantsSource = convertCompileTimeConstantsToString((_a = {},
            _a[GPUIO_INT_PRECISION] = "".concat(intForPrecision(intPrecision)),
            _a[GPUIO_FLOAT_PRECISION] = "".concat(intForPrecision(floatPrecision)),
            _a));
        return "".concat(versionSource).concat(extensions ? extensions : '').concat(compileTimeConstantsSource).concat(precisionConstantsSource).concat(PRECISION_SOURCE);
    }
    /**
     * Compile vertex or fragment shaders.
     * Fragment shaders may be compiled on the fly, so keep this efficient.
     * Copied from http://webglfundamentals.org/webgl/lessons/webgl-boilerplate.html
     * @private
     */
    function compileShader(gl, glslVersion, intPrecision, floatPrecision, shaderSource, shaderType, programName, errorCallback, compileTimeConstants, extensions, checkCompileStatus) {
        if (checkCompileStatus === void 0) { checkCompileStatus = false; }
        // Create the shader object
        var shader = gl.createShader(shaderType);
        if (!shader) {
            errorCallback('Unable to init gl shader.');
            return null;
        }
        // Set the shader source code.
        var shaderHeader = makeShaderHeader(glslVersion, intPrecision, floatPrecision, compileTimeConstants, extensions);
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
    /**
     * Returns whether a WebGL context is WebGL2.
     * This code is pulled from https://github.com/mrdoob/three.js/blob/master/src/renderers/webgl/WebGLCapabilities.js
     * @param gl - WebGL context to test.
     * @returns - true if WebGL2 context, else false.
     */
    function isWebGL2$1(gl) {
        // @ts-ignore
        return (typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext) || (typeof WebGL2ComputeRenderingContext !== 'undefined' && gl instanceof WebGL2ComputeRenderingContext);
    }
    /**
     * Returns whether WebGL2 is supported by the current browser.
     * @returns - true if WebGL2 is supported, else false.
    */
    function isWebGL2Supported$1() {
        if (results$1.supportsWebGL2 === undefined) {
            var gl = document.createElement('canvas').getContext(WEBGL2);
            // GL context and canvas will be garbage collected.
            results$1.supportsWebGL2 = isWebGL2$1(gl); // Will return false in case of gl = null.
        }
        return results$1.supportsWebGL2;
    }
    /**
     * Checks if the framebuffer is ready to read.
     * @private
     */
    function readyToRead(gl) {
        return gl.checkFramebufferStatus(gl.FRAMEBUFFER) == gl.FRAMEBUFFER_COMPLETE;
    }
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
        var gl = document.createElement('canvas').getContext(WEBGL1);
        if (!gl) {
            throw new Error("Unable to init webgl context.");
        }
        try {
            var vs = compileShader(gl, GLSL1, PRECISION_HIGH_P, PRECISION_HIGH_P, vsSource, gl.VERTEX_SHADER, 'highpFragmentTest', DEFAULT_ERROR_CALLBACK);
            var fs = compileShader(gl, GLSL1, PRECISION_HIGH_P, PRECISION_HIGH_P, fsSource, gl.FRAGMENT_SHADER, 'highpFragmentTest', DEFAULT_ERROR_CALLBACK);
            var program = initGLProgram(gl, vs, fs, 'highpFragmentTest', DEFAULT_ERROR_CALLBACK);
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
    function isHighpSupportedInVertexShader$1() {
        if (results$1.supportsHighpVertex === undefined) {
            var vertexSupport = isHighpSupported('void main() { highp float test = 0.524; gl_Position = vec4(test, test, 0, 1); }', 'void main() { gl_FragColor = vec4(0); }');
            results$1.supportsHighpVertex = vertexSupport;
        }
        return results$1.supportsHighpVertex;
    }
    /**
     * Detects whether highp precision is supported in fragment shaders in the current browser.
     * @returns - true is highp is supported in fragment shaders, else false.
     */
    function isHighpSupportedInFragmentShader$1() {
        if (results$1.supportsHighpFragment === undefined) {
            var fragmentSupport = isHighpSupported('void main() { gl_Position = vec4(0.5, 0.5, 0, 1); }', 'void main() { highp float test = 1.35; gl_FragColor = vec4(test); }');
            results$1.supportsHighpFragment = fragmentSupport;
        }
        return results$1.supportsHighpFragment;
    }
    /**
     * Helper function to perform a 1px math calculation in order to determine WebGL capabilities.
     * From https://webglfundamentals.org/
     * @private
     */
    function test1PxCalc(name, gl, fs, vs, addUniforms) {
        var program = initGLProgram(gl, vs, fs, name, DEFAULT_ERROR_CALLBACK);
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
    function getVertexShaderMediumpPrecision$1() {
        if (results$1.mediumpVertexPrecision === undefined) {
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
            var vs = compileShader(gl_1, GLSL1, PRECISION_MEDIUM_P, PRECISION_MEDIUM_P, "\n\tattribute vec4 position;  // needed because of another bug in Safari\n\tuniform mediump vec3 v;\n\tvarying mediump vec4 v_result;\n\tvoid main() {\n\t\tgl_Position = position;\n\t\tgl_PointSize = 1.0;\n\t\tv_result = vec4(normalize(v) * 0.5 + 0.5, 1);\n\t}\n\t\t", gl_1.VERTEX_SHADER, 'mediumpPrecisionVertexTest', DEFAULT_ERROR_CALLBACK);
            if (!vs) {
                throw new Error("Unable to init vertex shader.");
            }
            var fs = compileShader(gl_1, GLSL1, PRECISION_MEDIUM_P, PRECISION_MEDIUM_P, "\n\tvarying mediump vec4 v_result;\n\tvoid main() {\n\t\tgl_FragColor = v_result;\n\t}\n\t\t", gl_1.FRAGMENT_SHADER, 'mediumpPrecisionVertexTest', DEFAULT_ERROR_CALLBACK);
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
            results$1.mediumpVertexPrecision = mediumpPrecision ? PRECISION_MEDIUM_P : PRECISION_HIGH_P;
        }
        return results$1.mediumpVertexPrecision;
    }
    /**
     * Returns the actual precision of mediump inside fragment shader.
     * From https://webglfundamentals.org/webgl/lessons/webgl-precision-issues.html
     * @returns - Fragment shader supported mediump precision.
     */
    function getFragmentShaderMediumpPrecision$1() {
        if (results$1.mediumpFragmentPrecision === undefined) {
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
            var vs = compileShader(gl_2, GLSL1, PRECISION_MEDIUM_P, PRECISION_MEDIUM_P, "\n\tattribute vec4 position;  // needed because of another bug in Safari\n\tvoid main() {\n\t\tgl_Position = position;\n\t\tgl_PointSize = 1.0;\n\t}\n\t\t", gl_2.VERTEX_SHADER, 'mediumpPrecisionFragmentTest', DEFAULT_ERROR_CALLBACK);
            if (!vs) {
                throw new Error("Unable to init vertex shader.");
            }
            var fs = compileShader(gl_2, GLSL1, PRECISION_MEDIUM_P, PRECISION_MEDIUM_P, "\n\tuniform mediump vec3 v;\n\tvoid main() {\n\t\tgl_FragColor = vec4(normalize(v) * 0.5 + 0.5, 1);\n\t}\n\t\t", gl_2.FRAGMENT_SHADER, 'mediumpPrecisionFragmentTest', DEFAULT_ERROR_CALLBACK);
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
            results$1.mediumpFragmentPrecision = mediumpPrecision ? PRECISION_MEDIUM_P : PRECISION_HIGH_P;
        }
        return results$1.mediumpFragmentPrecision;
    }
    /**
     * Returns whether a number is a power of 2.
     * @private
     */
    function isPowerOf2(value) {
        // Use bitwise operation to evaluate this.
        return value > 0 && (value & (value - 1)) == 0;
    }
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
    /**
     * Strip out any unnecessary elements in shader source, e.g. #version and precision declarations.
     * This is called once on initialization, so doesn't need to be extremely efficient.
     * @private
     */
    function preprocessShader(shaderSource) {
        // Strip out any version numbers.
        shaderSource = stripVersion(shaderSource);
        // Strip out any precision declarations.
        shaderSource = stripPrecision(shaderSource);
        // Strip out comments.
        shaderSource = stripComments(shaderSource);
        return shaderSource;
    }
    /**
     * Common code for converting vertex/fragment shader source to GLSL1.
     * This is called once on initialization, so doesn't need to be extremely efficient.
     * @private
     */
    function convertShaderToGLSL1(shaderSource) {
        // No isampler2D or usampler2D.
        shaderSource = glsl1Sampler2D(shaderSource);
        // Unsigned int types are not supported, use int types instead.
        shaderSource = glsl1Uint(shaderSource);
        // Convert texture to texture2D.
        shaderSource = glsl1Texture(shaderSource);
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
        shaderSource = glsl1VertexIn(shaderSource);
        // Convert out to varying.
        shaderSource = glsl1VertexOut(shaderSource);
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
        shaderSource = glsl1FragmentIn(shaderSource);
        // Convert out to gl_FragColor.
        return glsl1FragmentOut(shaderSource, name);
    }
    /**
     * Preprocess vertex shader for glslVersion and browser capabilities.
     * This is called once on initialization, so doesn't need to be extremely efficient.
     * @private
     */
    function preprocessVertexShader(shaderSource, glslVersion) {
        shaderSource = preprocessShader(shaderSource);
        // Check if highp supported in vertex shaders.
        if (!isHighpSupportedInVertexShader$1()) {
            console.warn('highp not supported in vertex shader in this browser, falling back to mediump.');
            // Replace all highp with mediump.
            shaderSource = highpToMediump(shaderSource);
        }
        if (glslVersion === GLSL3) {
            return shaderSource;
        }
        return convertVertexShaderToGLSL1(shaderSource);
    }
    /**
     * Preprocess fragment shader for glslVersion and browser capabilities.
     * This is called once on initialization of GPUProgram, so doesn't need to be extremely efficient.
     * @private
     */
    function preprocessFragmentShader(shaderSource, glslVersion, name) {
        var _a;
        shaderSource = preprocessShader(shaderSource);
        checkFragmentShaderForFragColor(shaderSource, glslVersion, name);
        // Check if highp supported in fragment shaders.
        if (!isHighpSupportedInFragmentShader$1()) {
            console.warn('highp not supported in fragment shader in this browser, falling back to mediump.');
            // Replace all highp with mediump.
            shaderSource = highpToMediump(shaderSource);
        }
        // Add function/operator polyfills.
        shaderSource = fragmentShaderPolyfills(shaderSource, glslVersion) + shaderSource;
        // Add texture() polyfills.
        var samplerUniforms;
        (_a = texturePolyfill(shaderSource), shaderSource = _a.shaderSource, samplerUniforms = _a.samplerUniforms);
        if (glslVersion !== GLSL3) {
            var sources = convertFragmentShaderToGLSL1(shaderSource, name);
            // If this shader has multiple outputs, it is split into multiple sources.
            for (var i = 0, numSources = sources.length; i < numSources; i++) {
                // Add glsl1 specific polyfills.
                sources[i] = GLSL1Polyfills(sources[i]) + sources[i];
            }
            shaderSource = sources.shift();
            if (sources.length) {
                return { shaderSource: shaderSource, samplerUniforms: samplerUniforms, additionalSources: sources };
            }
        }
        return { shaderSource: shaderSource, samplerUniforms: samplerUniforms };
    }
    /**
     * Check uniforms and return internal WebGL type (e.g. [1234][u]?[if])
     * @private
     */
    function uniformInternalTypeForValue(value, type, uniformName, programName) {
        if (type === FLOAT) {
            // Check that we are dealing with a number.
            if (typeChecksExports.isArray(value)) {
                for (var i = 0; i < value.length; i++) {
                    if (!typeChecksExports.isFiniteNumber(value[i])) {
                        throw new Error("Invalid value ".concat(JSON.stringify(value), " for uniform \"").concat(uniformName, "\" in program \"").concat(programName, "\", expected float or float[] of length 1-4."));
                    }
                }
            }
            else {
                if (!typeChecksExports.isFiniteNumber(value)) {
                    throw new Error("Invalid value ".concat(JSON.stringify(value), " for uniform \"").concat(uniformName, "\" in program \"").concat(programName, "\", expected float or float[] of length 1-4."));
                }
            }
            if (!typeChecksExports.isArray(value) || value.length === 1) {
                return FLOAT_1D_UNIFORM;
            }
            if (value.length === 2) {
                return FLOAT_2D_UNIFORM;
            }
            if (value.length === 3) {
                return FLOAT_3D_UNIFORM;
            }
            if (value.length === 4) {
                return FLOAT_4D_UNIFORM;
            }
            throw new Error("Invalid value ".concat(JSON.stringify(value), " for uniform \"").concat(uniformName, "\" in program \"").concat(programName, "\", expected float or float[] of length 1-4."));
        }
        else if (type === INT) {
            // Check that we are dealing with an int.
            if (typeChecksExports.isArray(value)) {
                for (var i = 0; i < value.length; i++) {
                    if (!typeChecksExports.isInteger(value[i])) {
                        throw new Error("Invalid value ".concat(JSON.stringify(value), " for uniform \"").concat(uniformName, "\" in program \"").concat(programName, "\", expected int or int[] of length 1-4."));
                    }
                }
            }
            else {
                if (!typeChecksExports.isInteger(value)) {
                    throw new Error("Invalid value ".concat(JSON.stringify(value), " for uniform \"").concat(uniformName, "\" in program \"").concat(programName, "\", expected int or int[] of length 1-4."));
                }
            }
            if (!typeChecksExports.isArray(value) || value.length === 1) {
                return INT_1D_UNIFORM;
            }
            if (value.length === 2) {
                return INT_2D_UNIFORM;
            }
            if (value.length === 3) {
                return INT_3D_UNIFORM;
            }
            if (value.length === 4) {
                return INT_4D_UNIFORM;
            }
            throw new Error("Invalid value ".concat(JSON.stringify(value), " for uniform \"").concat(uniformName, "\" in program \"").concat(programName, "\", expected int or int[] of length 1-4."));
        }
        else if (type === UINT) {
            // Check that we are dealing with a uint.
            if (typeChecksExports.isArray(value)) {
                for (var i = 0; i < value.length; i++) {
                    if (!typeChecksExports.isNonNegativeInteger(value[i])) {
                        throw new Error("Invalid value ".concat(JSON.stringify(value), " for uniform \"").concat(uniformName, "\" in program \"").concat(programName, "\", expected uint or uint[] of length 1-4."));
                    }
                }
            }
            else {
                if (!typeChecksExports.isNonNegativeInteger(value)) {
                    throw new Error("Invalid value ".concat(JSON.stringify(value), " for uniform \"").concat(uniformName, "\" in program \"").concat(programName, "\", expected uint or uint[] of length 1-4."));
                }
            }
            if (!typeChecksExports.isArray(value) || value.length === 1) {
                return UINT_1D_UNIFORM;
            }
            if (value.length === 2) {
                return UINT_2D_UNIFORM;
            }
            if (value.length === 3) {
                return UINT_3D_UNIFORM;
            }
            if (value.length === 4) {
                return UINT_4D_UNIFORM;
            }
            throw new Error("Invalid value ".concat(JSON.stringify(value), " for uniform \"").concat(uniformName, "\" in program \"").concat(programName, "\", expected uint or uint[] of length 1-4."));
        }
        else if (type === BOOL) {
            // Check that we are dealing with a boolean.
            if (typeChecksExports.isArray(value)) {
                for (var i = 0; i < value.length; i++) {
                    if (!typeChecksExports.isBoolean(value[i])) {
                        throw new Error("Invalid value ".concat(JSON.stringify(value), " for uniform \"").concat(uniformName, "\" in program \"").concat(programName, "\", expected bool or bool[] of length 1-4."));
                    }
                }
            }
            else {
                if (!typeChecksExports.isBoolean(value)) {
                    throw new Error("Invalid value ".concat(JSON.stringify(value), " for uniform \"").concat(uniformName, "\" in program \"").concat(programName, "\", expected bool or bool[] of length 1-4."));
                }
            }
            if (!typeChecksExports.isArray(value) || value.length === 1) {
                return BOOL_1D_UNIFORM;
            }
            if (value.length === 2) {
                return BOOL_2D_UNIFORM;
            }
            if (value.length === 3) {
                return BOOL_3D_UNIFORM;
            }
            if (value.length === 4) {
                return BOOL_4D_UNIFORM;
            }
            throw new Error("Invalid value ".concat(JSON.stringify(value), " for uniform \"").concat(uniformName, "\" in program \"").concat(programName, "\", expected boolean."));
        }
        else {
            throw new Error("Invalid type \"".concat(type, "\" for uniform \"").concat(uniformName, "\" in program \"").concat(programName, "\", expected ").concat(FLOAT, " or ").concat(INT, " or ").concat(BOOL, "."));
        }
    }
    /**
     * Get index of GPULayer in array of inputs.
     * Used by GPUComposer.
     * @private
     */
    function indexOfLayerInArray(layer, array) {
        return array.findIndex(function (item) { return item === layer || item.layer === layer; });
    }
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

    var dist = {};

    Object.defineProperty(dist, "__esModule", {
      value: true
    });
    var changeDpiBlob_1 = dist.changeDpiBlob = changeDpiBlob;
    dist.changeDpiDataUrl = changeDpiDataUrl;

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

    const THIS_IS_NOT_AN_OBJECT = "This is not an object";
    const THIS_IS_NOT_A_FLOAT16ARRAY_OBJECT = "This is not a Float16Array object";
    const THIS_CONSTRUCTOR_IS_NOT_A_SUBCLASS_OF_FLOAT16ARRAY =
      "This constructor is not a subclass of Float16Array";
    const THE_CONSTRUCTOR_PROPERTY_VALUE_IS_NOT_AN_OBJECT =
      "The constructor property value is not an object";
    const SPECIES_CONSTRUCTOR_DIDNT_RETURN_TYPEDARRAY_OBJECT =
      "Species constructor didn't return TypedArray object";
    const DERIVED_CONSTRUCTOR_CREATED_TYPEDARRAY_OBJECT_WHICH_WAS_TOO_SMALL_LENGTH =
      "Derived constructor created TypedArray object which was too small length";
    const ATTEMPTING_TO_ACCESS_DETACHED_ARRAYBUFFER =
      "Attempting to access detached ArrayBuffer";
    const CANNOT_CONVERT_UNDEFINED_OR_NULL_TO_OBJECT =
      "Cannot convert undefined or null to object";
    const CANNOT_MIX_BIGINT_AND_OTHER_TYPES =
      "Cannot mix BigInt and other types, use explicit conversions";
    const ITERATOR_PROPERTY_IS_NOT_CALLABLE = "@@iterator property is not callable";
    const REDUCE_OF_EMPTY_ARRAY_WITH_NO_INITIAL_VALUE =
      "Reduce of empty array with no initial value";
    const OFFSET_IS_OUT_OF_BOUNDS = "Offset is out of bounds";

    /* eslint-disable no-restricted-globals, no-restricted-syntax */

    /** @type {<T extends (...args: any) => any>(target: T) => (thisArg: ThisType<T>, ...args: any[]) => any} */
    function uncurryThis(target) {
      return (thisArg, ...args) => {
        return ReflectApply(target, thisArg, args);
      };
    }

    /** @type {(target: any, key: string | symbol) => (thisArg: any, ...args: any[]) => any} */
    function uncurryThisGetter(target, key) {
      return uncurryThis(
        ReflectGetOwnPropertyDescriptor(
          target,
          key
        ).get
      );
    }

    // Reflect
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
      setPrototypeOf: ReflectSetPrototypeOf,
    } = Reflect;

    // Proxy
    const NativeProxy = Proxy;

    // Number
    const {
      MAX_SAFE_INTEGER: MAX_SAFE_INTEGER,
      isFinite: NumberIsFinite,
      isNaN: NumberIsNaN,
    } = Number;

    // Symbol
    const {
      iterator: SymbolIterator,
      species: SymbolSpecies,
      toStringTag: SymbolToStringTag,
      for: SymbolFor,
    } = Symbol;

    // Object
    const NativeObject = Object;
    const {
      create: ObjectCreate,
      defineProperty: ObjectDefineProperty,
      freeze: ObjectFreeze,
      is: ObjectIs,
    } = NativeObject;
    const ObjectPrototype = NativeObject.prototype;
    /** @type {(object: object, key: PropertyKey) => Function | undefined} */
    const ObjectPrototype__lookupGetter__ = /** @type {any} */ (ObjectPrototype).__lookupGetter__
      ? uncurryThis(/** @type {any} */ (ObjectPrototype).__lookupGetter__)
      : (object, key) => {
        if (object == null) {
          throw NativeTypeError(
            CANNOT_CONVERT_UNDEFINED_OR_NULL_TO_OBJECT
          );
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
    /** @type {(object: object, key: PropertyKey) => boolean} */
    const ObjectHasOwn = /** @type {any} */ (NativeObject).hasOwn ||
      uncurryThis(ObjectPrototype.hasOwnProperty);

    // Array
    const NativeArray = Array;
    const ArrayIsArray = NativeArray.isArray;
    const ArrayPrototype = NativeArray.prototype;
    /** @type {(array: ArrayLike<unknown>, separator?: string) => string} */
    const ArrayPrototypeJoin = uncurryThis(ArrayPrototype.join);
    /** @type {<T>(array: T[], ...items: T[]) => number} */
    const ArrayPrototypePush = uncurryThis(ArrayPrototype.push);
    /** @type {(array: ArrayLike<unknown>, ...opts: any[]) => string} */
    const ArrayPrototypeToLocaleString = uncurryThis(
      ArrayPrototype.toLocaleString
    );
    const NativeArrayPrototypeSymbolIterator = ArrayPrototype[SymbolIterator];
    /** @type {<T>(array: T[]) => IterableIterator<T>} */
    const ArrayPrototypeSymbolIterator = uncurryThis(NativeArrayPrototypeSymbolIterator);

    // Math
    const MathTrunc = Math.trunc;

    // ArrayBuffer
    const NativeArrayBuffer = ArrayBuffer;
    const ArrayBufferIsView = NativeArrayBuffer.isView;
    const ArrayBufferPrototype = NativeArrayBuffer.prototype;
    /** @type {(buffer: ArrayBuffer, begin?: number, end?: number) => number} */
    const ArrayBufferPrototypeSlice = uncurryThis(ArrayBufferPrototype.slice);
    /** @type {(buffer: ArrayBuffer) => ArrayBuffer} */
    const ArrayBufferPrototypeGetByteLength = uncurryThisGetter(ArrayBufferPrototype, "byteLength");

    // SharedArrayBuffer
    const NativeSharedArrayBuffer = typeof SharedArrayBuffer !== "undefined" ? SharedArrayBuffer : null;
    /** @type {(buffer: SharedArrayBuffer) => SharedArrayBuffer} */
    const SharedArrayBufferPrototypeGetByteLength = NativeSharedArrayBuffer
      && uncurryThisGetter(NativeSharedArrayBuffer.prototype, "byteLength");

    // TypedArray
    /** @typedef {Uint8Array|Uint8ClampedArray|Uint16Array|Uint32Array|Int8Array|Int16Array|Int32Array|Float32Array|Float64Array|BigUint64Array|BigInt64Array} TypedArray */
    /** @type {any} */
    const TypedArray = ReflectGetPrototypeOf(Uint8Array);
    const TypedArrayFrom = TypedArray.from;
    const TypedArrayPrototype = TypedArray.prototype;
    const NativeTypedArrayPrototypeSymbolIterator = TypedArrayPrototype[SymbolIterator];
    /** @type {(typedArray: TypedArray) => IterableIterator<number>} */
    const TypedArrayPrototypeKeys = uncurryThis(TypedArrayPrototype.keys);
    /** @type {(typedArray: TypedArray) => IterableIterator<number>} */
    const TypedArrayPrototypeValues = uncurryThis(
      TypedArrayPrototype.values
    );
    /** @type {(typedArray: TypedArray) => IterableIterator<[number, number]>} */
    const TypedArrayPrototypeEntries = uncurryThis(
      TypedArrayPrototype.entries
    );
    /** @type {(typedArray: TypedArray, array: ArrayLike<number>, offset?: number) => void} */
    const TypedArrayPrototypeSet = uncurryThis(TypedArrayPrototype.set);
    /** @type {<T extends TypedArray>(typedArray: T) => T} */
    const TypedArrayPrototypeReverse = uncurryThis(
      TypedArrayPrototype.reverse
    );
    /** @type {<T extends TypedArray>(typedArray: T, value: number, start?: number, end?: number) => T} */
    const TypedArrayPrototypeFill = uncurryThis(TypedArrayPrototype.fill);
    /** @type {<T extends TypedArray>(typedArray: T, target: number, start: number, end?: number) => T} */
    const TypedArrayPrototypeCopyWithin = uncurryThis(
      TypedArrayPrototype.copyWithin
    );
    /** @type {<T extends TypedArray>(typedArray: T, compareFn?: (a: number, b: number) => number) => T} */
    const TypedArrayPrototypeSort = uncurryThis(TypedArrayPrototype.sort);
    /** @type {<T extends TypedArray>(typedArray: T, start?: number, end?: number) => T} */
    const TypedArrayPrototypeSlice = uncurryThis(TypedArrayPrototype.slice);
    /** @type {<T extends TypedArray>(typedArray: T, start?: number, end?: number) => T} */
    const TypedArrayPrototypeSubarray = uncurryThis(
      TypedArrayPrototype.subarray
    );
    /** @type {((typedArray: TypedArray) => ArrayBuffer)} */
    const TypedArrayPrototypeGetBuffer = uncurryThisGetter(
      TypedArrayPrototype,
      "buffer"
    );
    /** @type {((typedArray: TypedArray) => number)} */
    const TypedArrayPrototypeGetByteOffset = uncurryThisGetter(
      TypedArrayPrototype,
      "byteOffset"
    );
    /** @type {((typedArray: TypedArray) => number)} */
    const TypedArrayPrototypeGetLength = uncurryThisGetter(
      TypedArrayPrototype,
      "length"
    );
    /** @type {(target: unknown) => string} */
    const TypedArrayPrototypeGetSymbolToStringTag = uncurryThisGetter(
      TypedArrayPrototype,
      SymbolToStringTag
    );

    // Uint16Array
    const NativeUint16Array = Uint16Array;
    /** @type {Uint16ArrayConstructor["from"]} */
    const Uint16ArrayFrom = (...args) => {
      return ReflectApply(TypedArrayFrom, NativeUint16Array, args);
    };

    // Uint32Array
    const NativeUint32Array = Uint32Array;

    // Float32Array
    const NativeFloat32Array = Float32Array;

    // ArrayIterator
    /** @type {any} */
    const ArrayIteratorPrototype = ReflectGetPrototypeOf([][SymbolIterator]());
    /** @type {<T>(arrayIterator: IterableIterator<T>) => IteratorResult<T>} */
    const ArrayIteratorPrototypeNext = uncurryThis(ArrayIteratorPrototype.next);

    // Generator
    /** @type {<T = unknown, TReturn = any, TNext = unknown>(generator: Generator<T, TReturn, TNext>, value?: TNext) => T} */
    const GeneratorPrototypeNext = uncurryThis((function* () {})().next);

    // Iterator
    const IteratorPrototype = ReflectGetPrototypeOf(ArrayIteratorPrototype);

    // DataView
    const DataViewPrototype = DataView.prototype;
    /** @type {(dataView: DataView, byteOffset: number, littleEndian?: boolean) => number} */
    const DataViewPrototypeGetUint16 = uncurryThis(
      DataViewPrototype.getUint16
    );
    /** @type {(dataView: DataView, byteOffset: number, value: number, littleEndian?: boolean) => void} */
    const DataViewPrototypeSetUint16 = uncurryThis(
      DataViewPrototype.setUint16
    );

    // Error
    const NativeTypeError = TypeError;
    const NativeRangeError = RangeError;

    // WeakSet
    /**
     * Do not construct with arguments to avoid calling the "add" method
     *
     * @type {{new <T extends {}>(): WeakSet<T>}}
     */
    const NativeWeakSet = WeakSet;
    const WeakSetPrototype = NativeWeakSet.prototype;
    /** @type {<T extends {}>(set: WeakSet<T>, value: T) => Set<T>} */
    const WeakSetPrototypeAdd = uncurryThis(WeakSetPrototype.add);
    /** @type {<T extends {}>(set: WeakSet<T>, value: T) => boolean} */
    const WeakSetPrototypeHas = uncurryThis(WeakSetPrototype.has);

    // WeakMap
    /**
     * Do not construct with arguments to avoid calling the "set" method
     *
     * @type {{new <K extends {}, V>(): WeakMap<K, V>}}
     */
    const NativeWeakMap = WeakMap;
    const WeakMapPrototype = NativeWeakMap.prototype;
    /** @type {<K extends {}, V>(weakMap: WeakMap<K, V>, key: K) => V} */
    const WeakMapPrototypeGet = uncurryThis(WeakMapPrototype.get);
    /** @type {<K extends {}, V>(weakMap: WeakMap<K, V>, key: K) => boolean} */
    const WeakMapPrototypeHas = uncurryThis(WeakMapPrototype.has);
    /** @type {<K extends {}, V>(weakMap: WeakMap<K, V>, key: K, value: V) => WeakMap} */
    const WeakMapPrototypeSet = uncurryThis(WeakMapPrototype.set);

    /** @type {WeakMap<{}, IterableIterator<any>>} */
    const arrayIterators = new NativeWeakMap();

    const SafeIteratorPrototype = ObjectCreate(null, {
      next: {
        value: function next() {
          const arrayIterator = WeakMapPrototypeGet(arrayIterators, this);
          return ArrayIteratorPrototypeNext(arrayIterator);
        },
      },

      [SymbolIterator]: {
        value: function values() {
          return this;
        },
      },
    });

    /**
     * Wrap the Array around the SafeIterator If Array.prototype [@@iterator] has been modified
     *
     * @type {<T>(array: T[]) => Iterable<T>}
     */
    function safeIfNeeded(array) {
      if (array[SymbolIterator] === NativeArrayPrototypeSymbolIterator) {
        return array;
      }

      const safe = ObjectCreate(SafeIteratorPrototype);
      WeakMapPrototypeSet(arrayIterators, safe, ArrayPrototypeSymbolIterator(array));
      return safe;
    }

    /** @type {WeakMap<{}, Generator<any>>} */
    const generators = new NativeWeakMap();

    /** @see https://tc39.es/ecma262/#sec-%arrayiteratorprototype%-object */
    const DummyArrayIteratorPrototype = ObjectCreate(IteratorPrototype, {
      next: {
        value: function next() {
          const generator = WeakMapPrototypeGet(generators, this);
          return GeneratorPrototypeNext(generator);
        },
        writable: true,
        configurable: true,
      },
    });

    for (const key of ReflectOwnKeys(ArrayIteratorPrototype)) {
      // next method has already defined
      if (key === "next") {
        continue;
      }

      // Copy ArrayIteratorPrototype descriptors to DummyArrayIteratorPrototype
      ObjectDefineProperty(DummyArrayIteratorPrototype, key, ReflectGetOwnPropertyDescriptor(ArrayIteratorPrototype, key));
    }

    /**
     * Wrap the Generator around the dummy ArrayIterator
     *
     * @type {<T>(generator: Generator<T>) => IterableIterator<T>}
     */
    function wrap(generator) {
      const dummy = ObjectCreate(DummyArrayIteratorPrototype);
      WeakMapPrototypeSet(generators, dummy, generator);
      return dummy;
    }

    /**
     * @param {unknown} value
     * @returns {value is {}}
     */
    function isObject(value) {
      return (value !== null && typeof value === "object") ||
        typeof value === "function";
    }

    /**
     * @param {unknown} value
     * @returns {value is {}}
     */
    function isObjectLike(value) {
      return value !== null && typeof value === "object";
    }

    // Inspired by util.types implementation of Node.js
    /** @typedef {Uint8Array|Uint8ClampedArray|Uint16Array|Uint32Array|Int8Array|Int16Array|Int32Array|Float32Array|Float64Array|BigUint64Array|BigInt64Array} TypedArray */

    /**
     * @param {unknown} value
     * @returns {value is TypedArray}
     */
    function isNativeTypedArray(value) {
      return TypedArrayPrototypeGetSymbolToStringTag(value) !== undefined;
    }

    /**
     * @param {unknown} value
     * @returns {value is BigInt64Array|BigUint64Array}
     */
    function isNativeBigIntTypedArray(value) {
      const typedArrayName = TypedArrayPrototypeGetSymbolToStringTag(value);
      return typedArrayName === "BigInt64Array" ||
        typedArrayName === "BigUint64Array";
    }

    /**
     * @param {unknown} value
     * @returns {value is ArrayBuffer}
     */
    function isArrayBuffer(value) {
      try {
        ArrayBufferPrototypeGetByteLength(/** @type {any} */ (value));
        return true;
      } catch (e) {
        return false;
      }
    }

    /**
     * @param {unknown} value
     * @returns {value is SharedArrayBuffer}
     */
    function isSharedArrayBuffer(value) {
      if (NativeSharedArrayBuffer === null) {
        return false;
      }

      try {
        SharedArrayBufferPrototypeGetByteLength(/** @type {any} */ (value));
        return true;
      } catch (e) {
        return false;
      }
    }

    /**
     * @param {unknown} value
     * @returns {value is unknown[]}
     */
    function isOrdinaryArray(value) {
      if (!ArrayIsArray(value)) {
        return false;
      }

      if (value[SymbolIterator] === NativeArrayPrototypeSymbolIterator) {
        return true;
      }

      // for other realms
      // eslint-disable-next-line no-restricted-syntax
      const iterator = value[SymbolIterator]();
      return iterator[SymbolToStringTag] === "Array Iterator";
    }

    /**
     * @param {unknown} value
     * @returns {value is TypedArray}
     */
    function isOrdinaryNativeTypedArray(value) {
      if (!isNativeTypedArray(value)) {
        return false;
      }

      if (value[SymbolIterator] === NativeTypedArrayPrototypeSymbolIterator) {
        return true;
      }

      // for other realms
      // eslint-disable-next-line no-restricted-syntax
      const iterator = value[SymbolIterator]();
      return iterator[SymbolToStringTag] === "Array Iterator";
    }

    /**
     * @param {unknown} value
     * @returns {value is string}
     */
    function isCanonicalIntegerIndexString(value) {
      if (typeof value !== "string") {
        return false;
      }

      const number = +value;
      if (value !== number + "") {
        return false;
      }

      if (!NumberIsFinite(number)) {
        return false;
      }

      return number === MathTrunc(number);
    }

    const brand = SymbolFor("__Float16Array__");

    /**
     * @param {unknown} target
     * @throws {TypeError}
     * @returns {boolean}
     */
    function hasFloat16ArrayBrand(target) {
      if (!isObjectLike(target)) {
        return false;
      }

      const prototype = ReflectGetPrototypeOf(target);
      if (!isObjectLike(prototype)) {
        return false;
      }

      const constructor = prototype.constructor;
      if (constructor === undefined) {
        return false;
      }
      if (!isObject(constructor)) {
        throw NativeTypeError(THE_CONSTRUCTOR_PROPERTY_VALUE_IS_NOT_AN_OBJECT);
      }

      return ReflectHas(constructor, brand);
    }

    // algorithm: http://fox-toolkit.org/ftp/fasthalffloatconversion.pdf

    const buffer = new NativeArrayBuffer(4);
    const floatView = new NativeFloat32Array(buffer);
    const uint32View = new NativeUint32Array(buffer);

    const baseTable = new NativeUint32Array(512);
    const shiftTable = new NativeUint32Array(512);

    for (let i = 0; i < 256; ++i) {
      const e = i - 127;

      // very small number (0, -0)
      if (e < -27) {
        baseTable[i]         = 0x0000;
        baseTable[i | 0x100] = 0x8000;
        shiftTable[i]         = 24;
        shiftTable[i | 0x100] = 24;

      // small number (denorm)
      } else if (e < -14) {
        baseTable[i]         =  0x0400 >> (-e - 14);
        baseTable[i | 0x100] = (0x0400 >> (-e - 14)) | 0x8000;
        shiftTable[i]         = -e - 1;
        shiftTable[i | 0x100] = -e - 1;

      // normal number
      } else if (e <= 15) {
        baseTable[i]         =  (e + 15) << 10;
        baseTable[i | 0x100] = ((e + 15) << 10) | 0x8000;
        shiftTable[i]         = 13;
        shiftTable[i | 0x100] = 13;

      // large number (Infinity, -Infinity)
      } else if (e < 128) {
        baseTable[i]         = 0x7c00;
        baseTable[i | 0x100] = 0xfc00;
        shiftTable[i]         = 24;
        shiftTable[i | 0x100] = 24;

      // stay (NaN, Infinity, -Infinity)
      } else {
        baseTable[i]         = 0x7c00;
        baseTable[i | 0x100] = 0xfc00;
        shiftTable[i]         = 13;
        shiftTable[i | 0x100] = 13;
      }
    }

    /**
     * round a number to a half float number bits
     *
     * @param {unknown} num - double float
     * @returns {number} half float number bits
     */
    function roundToFloat16Bits(num) {
      floatView[0] = /** @type {any} */ (num);
      const f = uint32View[0];
      const e = (f >> 23) & 0x1ff;
      return baseTable[e] + ((f & 0x007fffff) >> shiftTable[e]);
    }

    const mantissaTable = new NativeUint32Array(2048);
    const exponentTable = new NativeUint32Array(64);
    const offsetTable = new NativeUint32Array(64);

    for (let i = 1; i < 1024; ++i) {
      let m = i << 13;    // zero pad mantissa bits
      let e = 0;          // zero exponent

      // normalized
      while((m & 0x00800000) === 0) {
        m <<= 1;
        e -= 0x00800000;  // decrement exponent
      }

      m &= ~0x00800000;   // clear leading 1 bit
      e += 0x38800000;    // adjust bias

      mantissaTable[i] = m | e;
    }
    for (let i = 1024; i < 2048; ++i) {
      mantissaTable[i] = 0x38000000 + ((i - 1024) << 13);
    }

    for (let i = 1; i < 31; ++i) {
      exponentTable[i] = i << 23;
    }
    exponentTable[31] = 0x47800000;
    exponentTable[32] = 0x80000000;
    for (let i = 33; i < 63; ++i) {
      exponentTable[i] = 0x80000000 + ((i - 32) << 23);
    }
    exponentTable[63] = 0xc7800000;

    for (let i = 1; i < 64; ++i) {
      if (i !== 32) {
        offsetTable[i] = 1024;
      }
    }

    /**
     * convert a half float number bits to a number
     *
     * @param {number} float16bits - half float number bits
     * @returns {number} double float
     */
    function convertToNumber(float16bits) {
      const m = float16bits >> 10;
      uint32View[0] = mantissaTable[offsetTable[m] + (float16bits & 0x3ff)] + exponentTable[m];
      return floatView[0];
    }

    /**
     * @see https://tc39.es/ecma262/#sec-tointegerorinfinity
     * @param {unknown} target
     * @returns {number}
     */
    function ToIntegerOrInfinity(target) {
      const number = +target;

      if (NumberIsNaN(number) || number === 0) {
        return 0;
      }

      return MathTrunc(number);
    }

    /**
     * @see https://tc39.es/ecma262/#sec-tolength
     * @param {unknown} target
     * @returns {number}
     */
    function ToLength(target) {
      const length = ToIntegerOrInfinity(target);
      if (length < 0) {
        return 0;
      }

      return length < MAX_SAFE_INTEGER
        ? length
        : MAX_SAFE_INTEGER;
    }

    /**
     * @see https://tc39.es/ecma262/#sec-speciesconstructor
     * @param {object} target
     * @param {{ new(...args: any[]): any; }} defaultConstructor
     * @returns {{ new(...args: any[]): any; }}
     */
    function SpeciesConstructor(target, defaultConstructor) {
      if (!isObject(target)) {
        throw NativeTypeError(THIS_IS_NOT_AN_OBJECT);
      }

      const constructor = target.constructor;
      if (constructor === undefined) {
        return defaultConstructor;
      }
      if (!isObject(constructor)) {
        throw NativeTypeError(THE_CONSTRUCTOR_PROPERTY_VALUE_IS_NOT_AN_OBJECT);
      }

      const species = constructor[SymbolSpecies];
      if (species == null) {
        return defaultConstructor;
      }

      return species;
    }

    /**
     * @see https://tc39.es/ecma262/#sec-isdetachedbuffer
     * @param {ArrayBufferLike} buffer
     * @returns {boolean}
     */
    function IsDetachedBuffer(buffer) {
      if (isSharedArrayBuffer(buffer)) {
        return false;
      }

      try {
        ArrayBufferPrototypeSlice(buffer, 0, 0);
        return false;
      } catch (e) {/* empty */}

      return true;
    }

    /**
     * bigint comparisons are not supported
     *
     * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.sort
     * @param {number} x
     * @param {number} y
     * @returns {-1 | 0 | 1}
     */
    function defaultCompare(x, y) {
      const isXNaN = NumberIsNaN(x);
      const isYNaN = NumberIsNaN(y);

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
        const isXPlusZero = ObjectIs(x, 0);
        const isYPlusZero = ObjectIs(y, 0);

        if (!isXPlusZero && isYPlusZero) {
          return -1;
        }

        if (isXPlusZero && !isYPlusZero) {
          return 1;
        }
      }

      return 0;
    }

    const BYTES_PER_ELEMENT = 2;

    /** @typedef {Uint16Array & { __float16bits: never }} Float16BitsArray */

    /** @type {WeakMap<Float16Array, Float16BitsArray>} */
    const float16bitsArrays = new NativeWeakMap();

    /**
     * @param {unknown} target
     * @returns {target is Float16Array}
     */
    function isFloat16Array(target) {
      return WeakMapPrototypeHas(float16bitsArrays, target) ||
        (!ArrayBufferIsView(target) && hasFloat16ArrayBrand(target));
    }

    /**
     * @param {unknown} target
     * @throws {TypeError}
     * @returns {asserts target is Float16Array}
     */
    function assertFloat16Array(target) {
      if (!isFloat16Array(target)) {
        throw NativeTypeError(THIS_IS_NOT_A_FLOAT16ARRAY_OBJECT);
      }
    }

    /**
     * @param {unknown} target
     * @param {number=} count
     * @throws {TypeError}
     * @returns {asserts target is Uint8Array|Uint8ClampedArray|Uint16Array|Uint32Array|Int8Array|Int16Array|Int32Array|Float16Array|Float32Array|Float64Array}
     */
    function assertSpeciesTypedArray(target, count) {
      const isTargetFloat16Array = isFloat16Array(target);
      const isTargetTypedArray = isNativeTypedArray(target);

      if (!isTargetFloat16Array && !isTargetTypedArray) {
        throw NativeTypeError(SPECIES_CONSTRUCTOR_DIDNT_RETURN_TYPEDARRAY_OBJECT);
      }

      if (typeof count === "number") {
        let length;
        if (isTargetFloat16Array) {
          const float16bitsArray = getFloat16BitsArray(target);
          length = TypedArrayPrototypeGetLength(float16bitsArray);
        } else {
          length = TypedArrayPrototypeGetLength(target);
        }

        if (length < count) {
          throw NativeTypeError(
            DERIVED_CONSTRUCTOR_CREATED_TYPEDARRAY_OBJECT_WHICH_WAS_TOO_SMALL_LENGTH
          );
        }
      }

      if (isNativeBigIntTypedArray(target)) {
        throw NativeTypeError(CANNOT_MIX_BIGINT_AND_OTHER_TYPES);
      }
    }

    /**
     * @param {Float16Array} float16
     * @throws {TypeError}
     * @returns {Float16BitsArray}
     */
    function getFloat16BitsArray(float16) {
      const float16bitsArray = WeakMapPrototypeGet(float16bitsArrays, float16);
      if (float16bitsArray !== undefined) {
        const buffer = TypedArrayPrototypeGetBuffer(float16bitsArray);

        if (IsDetachedBuffer(buffer)) {
          throw NativeTypeError(ATTEMPTING_TO_ACCESS_DETACHED_ARRAYBUFFER);
        }

        return float16bitsArray;
      }

      // from another Float16Array instance (a different version?)
      const buffer = /** @type {any} */ (float16).buffer;

      if (IsDetachedBuffer(buffer)) {
        throw NativeTypeError(ATTEMPTING_TO_ACCESS_DETACHED_ARRAYBUFFER);
      }

      const cloned = ReflectConstruct(Float16Array, [
        buffer,
        /** @type {any} */ (float16).byteOffset,
        /** @type {any} */ (float16).length,
      ], float16.constructor);
      return WeakMapPrototypeGet(float16bitsArrays, cloned);
    }

    /**
     * @param {Float16BitsArray} float16bitsArray
     * @returns {number[]}
     */
    function copyToArray(float16bitsArray) {
      const length = TypedArrayPrototypeGetLength(float16bitsArray);

      const array = [];
      for (let i = 0; i < length; ++i) {
        array[i] = convertToNumber(float16bitsArray[i]);
      }

      return array;
    }

    /** @type {WeakSet<Function>} */
    const TypedArrayPrototypeGetters = new NativeWeakSet();
    for (const key of ReflectOwnKeys(TypedArrayPrototype)) {
      // @@toStringTag getter property is defined in Float16Array.prototype
      if (key === SymbolToStringTag) {
        continue;
      }

      const descriptor = ReflectGetOwnPropertyDescriptor(TypedArrayPrototype, key);
      if (ObjectHasOwn(descriptor, "get") && typeof descriptor.get === "function") {
        WeakSetPrototypeAdd(TypedArrayPrototypeGetters, descriptor.get);
      }
    }

    const handler = ObjectFreeze(/** @type {ProxyHandler<Float16BitsArray>} */ ({
      get(target, key, receiver) {
        if (isCanonicalIntegerIndexString(key) && ObjectHasOwn(target, key)) {
          return convertToNumber(ReflectGet(target, key));
        }

        // %TypedArray%.prototype getter properties cannot called by Proxy receiver
        if (WeakSetPrototypeHas(TypedArrayPrototypeGetters, ObjectPrototype__lookupGetter__(target, key))) {
          return ReflectGet(target, key);
        }

        return ReflectGet(target, key, receiver);
      },

      set(target, key, value, receiver) {
        if (isCanonicalIntegerIndexString(key) && ObjectHasOwn(target, key)) {
          return ReflectSet(target, key, roundToFloat16Bits(value));
        }

        return ReflectSet(target, key, value, receiver);
      },

      getOwnPropertyDescriptor(target, key) {
        if (isCanonicalIntegerIndexString(key) && ObjectHasOwn(target, key)) {
          const descriptor = ReflectGetOwnPropertyDescriptor(target, key);
          descriptor.value = convertToNumber(descriptor.value);
          return descriptor;
        }

        return ReflectGetOwnPropertyDescriptor(target, key);
      },

      defineProperty(target, key, descriptor) {
        if (
          isCanonicalIntegerIndexString(key) &&
          ObjectHasOwn(target, key) &&
          ObjectHasOwn(descriptor, "value")
        ) {
          descriptor.value = roundToFloat16Bits(descriptor.value);
          return ReflectDefineProperty(target, key, descriptor);
        }

        return ReflectDefineProperty(target, key, descriptor);
      },
    }));

    class Float16Array {
      /** @see https://tc39.es/ecma262/#sec-typedarray */
      constructor(input, _byteOffset, _length) {
        /** @type {Float16BitsArray} */
        let float16bitsArray;

        if (isFloat16Array(input)) {
          float16bitsArray = ReflectConstruct(NativeUint16Array, [getFloat16BitsArray(input)], new.target);
        } else if (isObject(input) && !isArrayBuffer(input)) { // object without ArrayBuffer
          /** @type {ArrayLike<unknown>} */
          let list;
          /** @type {number} */
          let length;

          if (isNativeTypedArray(input)) { // TypedArray
            list = input;
            length = TypedArrayPrototypeGetLength(input);

            const buffer = TypedArrayPrototypeGetBuffer(input);
            const BufferConstructor = !isSharedArrayBuffer(buffer)
              ? /** @type {ArrayBufferConstructor} */ (SpeciesConstructor(
                buffer,
                NativeArrayBuffer
              ))
              : NativeArrayBuffer;

            if (IsDetachedBuffer(buffer)) {
              throw NativeTypeError(ATTEMPTING_TO_ACCESS_DETACHED_ARRAYBUFFER);
            }

            if (isNativeBigIntTypedArray(input)) {
              throw NativeTypeError(CANNOT_MIX_BIGINT_AND_OTHER_TYPES);
            }

            const data = new BufferConstructor(
              length * BYTES_PER_ELEMENT
            );
            float16bitsArray = ReflectConstruct(NativeUint16Array, [data], new.target);
          } else {
            const iterator = input[SymbolIterator];
            if (iterator != null && typeof iterator !== "function") {
              throw NativeTypeError(ITERATOR_PROPERTY_IS_NOT_CALLABLE);
            }

            if (iterator != null) { // Iterable (Array)
              // for optimization
              if (isOrdinaryArray(input)) {
                list = input;
                length = input.length;
              } else {
                // eslint-disable-next-line no-restricted-syntax
                list = [... /** @type {Iterable<unknown>} */ (input)];
                length = list.length;
              }
            } else { // ArrayLike
              list = /** @type {ArrayLike<unknown>} */ (input);
              length = ToLength(list.length);
            }
            float16bitsArray = ReflectConstruct(NativeUint16Array, [length], new.target);
          }

          // set values
          for (let i = 0; i < length; ++i) {
            float16bitsArray[i] = roundToFloat16Bits(list[i]);
          }
        } else { // primitive, ArrayBuffer
          float16bitsArray = ReflectConstruct(NativeUint16Array, arguments, new.target);
        }

        /** @type {Float16Array} */
        const proxy = /** @type {any} */ (new NativeProxy(float16bitsArray, handler));

        // proxy private storage
        WeakMapPrototypeSet(float16bitsArrays, proxy, float16bitsArray);

        return proxy;
      }

      /**
       * limitation: `Object.getOwnPropertyNames(Float16Array)` or `Reflect.ownKeys(Float16Array)` include this key
       *
       * @see https://tc39.es/ecma262/#sec-%typedarray%.from
       */
      static from(src, ...opts) {
        const Constructor = this;

        if (!ReflectHas(Constructor, brand)) {
          throw NativeTypeError(
            THIS_CONSTRUCTOR_IS_NOT_A_SUBCLASS_OF_FLOAT16ARRAY
          );
        }

        // for optimization
        if (Constructor === Float16Array) {
          if (isFloat16Array(src) && opts.length === 0) {
            const float16bitsArray = getFloat16BitsArray(src);
            const uint16 = new NativeUint16Array(
              TypedArrayPrototypeGetBuffer(float16bitsArray),
              TypedArrayPrototypeGetByteOffset(float16bitsArray),
              TypedArrayPrototypeGetLength(float16bitsArray)
            );
            return new Float16Array(
              TypedArrayPrototypeGetBuffer(TypedArrayPrototypeSlice(uint16))
            );
          }

          if (opts.length === 0) {
            return new Float16Array(
              TypedArrayPrototypeGetBuffer(
                Uint16ArrayFrom(src, roundToFloat16Bits)
              )
            );
          }

          const mapFunc = opts[0];
          const thisArg = opts[1];

          return new Float16Array(
            TypedArrayPrototypeGetBuffer(
              Uint16ArrayFrom(src, function (val, ...args) {
                return roundToFloat16Bits(
                  ReflectApply(mapFunc, this, [val, ...safeIfNeeded(args)])
                );
              }, thisArg)
            )
          );
        }

        /** @type {ArrayLike<unknown>} */
        let list;
        /** @type {number} */
        let length;

        const iterator = src[SymbolIterator];
        if (iterator != null && typeof iterator !== "function") {
          throw NativeTypeError(ITERATOR_PROPERTY_IS_NOT_CALLABLE);
        }

        if (iterator != null) { // Iterable (TypedArray, Array)
          // for optimization
          if (isOrdinaryArray(src)) {
            list = src;
            length = src.length;
          } else if (isOrdinaryNativeTypedArray(src)) {
            list = src;
            length = TypedArrayPrototypeGetLength(src);
          } else {
            // eslint-disable-next-line no-restricted-syntax
            list = [...src];
            length = list.length;
          }
        } else { // ArrayLike
          if (src == null) {
            throw NativeTypeError(
              CANNOT_CONVERT_UNDEFINED_OR_NULL_TO_OBJECT
            );
          }
          list = NativeObject(src);
          length = ToLength(list.length);
        }

        const array = new Constructor(length);

        if (opts.length === 0) {
          for (let i = 0; i < length; ++i) {
            array[i] = /** @type {number} */ (list[i]);
          }
        } else {
          const mapFunc = opts[0];
          const thisArg = opts[1];
          for (let i = 0; i < length; ++i) {
            array[i] = ReflectApply(mapFunc, thisArg, [list[i], i]);
          }
        }

        return array;
      }

      /**
       * limitation: `Object.getOwnPropertyNames(Float16Array)` or `Reflect.ownKeys(Float16Array)` include this key
       *
       * @see https://tc39.es/ecma262/#sec-%typedarray%.of
       */
      static of(...items) {
        const Constructor = this;

        if (!ReflectHas(Constructor, brand)) {
          throw NativeTypeError(
            THIS_CONSTRUCTOR_IS_NOT_A_SUBCLASS_OF_FLOAT16ARRAY
          );
        }

        const length = items.length;

        // for optimization
        if (Constructor === Float16Array) {
          const proxy = new Float16Array(length);
          const float16bitsArray = getFloat16BitsArray(proxy);

          for (let i = 0; i < length; ++i) {
            float16bitsArray[i] = roundToFloat16Bits(items[i]);
          }

          return proxy;
        }

        const array = new Constructor(length);

        for (let i = 0; i < length; ++i) {
          array[i] = items[i];
        }

        return array;
      }

      /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.keys */
      keys() {
        assertFloat16Array(this);
        const float16bitsArray = getFloat16BitsArray(this);

        return TypedArrayPrototypeKeys(float16bitsArray);
      }

      /**
       * limitation: returns a object whose prototype is not `%ArrayIteratorPrototype%`
       *
       * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.values
       */
      values() {
        assertFloat16Array(this);
        const float16bitsArray = getFloat16BitsArray(this);

        return wrap((function* () {
          // eslint-disable-next-line no-restricted-syntax
          for (const val of TypedArrayPrototypeValues(float16bitsArray)) {
            yield convertToNumber(val);
          }
        })());
      }

      /**
       * limitation: returns a object whose prototype is not `%ArrayIteratorPrototype%`
       *
       * @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.entries
       */
      entries() {
        assertFloat16Array(this);
        const float16bitsArray = getFloat16BitsArray(this);

        return wrap((function* () {
          // eslint-disable-next-line no-restricted-syntax
          for (const [i, val] of TypedArrayPrototypeEntries(float16bitsArray)) {
            yield /** @type {[Number, number]} */ ([i, convertToNumber(val)]);
          }
        })());
      }

      /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.at */
      at(index) {
        assertFloat16Array(this);
        const float16bitsArray = getFloat16BitsArray(this);

        const length = TypedArrayPrototypeGetLength(float16bitsArray);
        const relativeIndex = ToIntegerOrInfinity(index);
        const k = relativeIndex >= 0 ? relativeIndex : length + relativeIndex;

        if (k < 0 || k >= length) {
          return;
        }

        return convertToNumber(float16bitsArray[k]);
      }

      /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.map */
      map(callback, ...opts) {
        assertFloat16Array(this);
        const float16bitsArray = getFloat16BitsArray(this);

        const length = TypedArrayPrototypeGetLength(float16bitsArray);
        const thisArg = opts[0];

        const Constructor = SpeciesConstructor(float16bitsArray, Float16Array);

        // for optimization
        if (Constructor === Float16Array) {
          const proxy = new Float16Array(length);
          const array = getFloat16BitsArray(proxy);

          for (let i = 0; i < length; ++i) {
            const val = convertToNumber(float16bitsArray[i]);
            array[i] = roundToFloat16Bits(
              ReflectApply(callback, thisArg, [val, i, this])
            );
          }

          return proxy;
        }

        const array = new Constructor(length);
        assertSpeciesTypedArray(array, length);

        for (let i = 0; i < length; ++i) {
          const val = convertToNumber(float16bitsArray[i]);
          array[i] = ReflectApply(callback, thisArg, [val, i, this]);
        }

        return /** @type {any} */ (array);
      }

      /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.filter */
      filter(callback, ...opts) {
        assertFloat16Array(this);
        const float16bitsArray = getFloat16BitsArray(this);

        const length = TypedArrayPrototypeGetLength(float16bitsArray);
        const thisArg = opts[0];

        const kept = [];
        for (let i = 0; i < length; ++i) {
          const val = convertToNumber(float16bitsArray[i]);
          if (ReflectApply(callback, thisArg, [val, i, this])) {
            ArrayPrototypePush(kept, val);
          }
        }

        const Constructor = SpeciesConstructor(float16bitsArray, Float16Array);
        const array = new Constructor(kept);
        assertSpeciesTypedArray(array);

        return /** @type {any} */ (array);
      }

      /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.reduce */
      reduce(callback, ...opts) {
        assertFloat16Array(this);
        const float16bitsArray = getFloat16BitsArray(this);

        const length = TypedArrayPrototypeGetLength(float16bitsArray);
        if (length === 0 && opts.length === 0) {
          throw NativeTypeError(REDUCE_OF_EMPTY_ARRAY_WITH_NO_INITIAL_VALUE);
        }

        let accumulator, start;
        if (opts.length === 0) {
          accumulator = convertToNumber(float16bitsArray[0]);
          start = 1;
        } else {
          accumulator = opts[0];
          start = 0;
        }

        for (let i = start; i < length; ++i) {
          accumulator = callback(
            accumulator,
            convertToNumber(float16bitsArray[i]),
            i,
            this
          );
        }

        return accumulator;
      }

      /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.reduceright */
      reduceRight(callback, ...opts) {
        assertFloat16Array(this);
        const float16bitsArray = getFloat16BitsArray(this);

        const length = TypedArrayPrototypeGetLength(float16bitsArray);
        if (length === 0 && opts.length === 0) {
          throw NativeTypeError(REDUCE_OF_EMPTY_ARRAY_WITH_NO_INITIAL_VALUE);
        }

        let accumulator, start;
        if (opts.length === 0) {
          accumulator = convertToNumber(float16bitsArray[length - 1]);
          start = length - 2;
        } else {
          accumulator = opts[0];
          start = length - 1;
        }

        for (let i = start; i >= 0; --i) {
          accumulator = callback(
            accumulator,
            convertToNumber(float16bitsArray[i]),
            i,
            this
          );
        }

        return accumulator;
      }

      /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.foreach */
      forEach(callback, ...opts) {
        assertFloat16Array(this);
        const float16bitsArray = getFloat16BitsArray(this);

        const length = TypedArrayPrototypeGetLength(float16bitsArray);
        const thisArg = opts[0];

        for (let i = 0; i < length; ++i) {
          ReflectApply(callback, thisArg, [
            convertToNumber(float16bitsArray[i]),
            i,
            this,
          ]);
        }
      }

      /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.find */
      find(callback, ...opts) {
        assertFloat16Array(this);
        const float16bitsArray = getFloat16BitsArray(this);

        const length = TypedArrayPrototypeGetLength(float16bitsArray);
        const thisArg = opts[0];

        for (let i = 0; i < length; ++i) {
          const value = convertToNumber(float16bitsArray[i]);
          if (ReflectApply(callback, thisArg, [value, i, this])) {
            return value;
          }
        }
      }

      /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.findindex */
      findIndex(callback, ...opts) {
        assertFloat16Array(this);
        const float16bitsArray = getFloat16BitsArray(this);

        const length = TypedArrayPrototypeGetLength(float16bitsArray);
        const thisArg = opts[0];

        for (let i = 0; i < length; ++i) {
          const value = convertToNumber(float16bitsArray[i]);
          if (ReflectApply(callback, thisArg, [value, i, this])) {
            return i;
          }
        }

        return -1;
      }

      /** @see https://tc39.es/proposal-array-find-from-last/index.html#sec-%typedarray%.prototype.findlast */
      findLast(callback, ...opts) {
        assertFloat16Array(this);
        const float16bitsArray = getFloat16BitsArray(this);

        const length = TypedArrayPrototypeGetLength(float16bitsArray);
        const thisArg = opts[0];

        for (let i = length - 1; i >= 0; --i) {
          const value = convertToNumber(float16bitsArray[i]);
          if (ReflectApply(callback, thisArg, [value, i, this])) {
            return value;
          }
        }
      }

      /** @see https://tc39.es/proposal-array-find-from-last/index.html#sec-%typedarray%.prototype.findlastindex */
      findLastIndex(callback, ...opts) {
        assertFloat16Array(this);
        const float16bitsArray = getFloat16BitsArray(this);

        const length = TypedArrayPrototypeGetLength(float16bitsArray);
        const thisArg = opts[0];

        for (let i = length - 1; i >= 0; --i) {
          const value = convertToNumber(float16bitsArray[i]);
          if (ReflectApply(callback, thisArg, [value, i, this])) {
            return i;
          }
        }

        return -1;
      }

      /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.every */
      every(callback, ...opts) {
        assertFloat16Array(this);
        const float16bitsArray = getFloat16BitsArray(this);

        const length = TypedArrayPrototypeGetLength(float16bitsArray);
        const thisArg = opts[0];

        for (let i = 0; i < length; ++i) {
          if (
            !ReflectApply(callback, thisArg, [
              convertToNumber(float16bitsArray[i]),
              i,
              this,
            ])
          ) {
            return false;
          }
        }

        return true;
      }

      /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.some */
      some(callback, ...opts) {
        assertFloat16Array(this);
        const float16bitsArray = getFloat16BitsArray(this);

        const length = TypedArrayPrototypeGetLength(float16bitsArray);
        const thisArg = opts[0];

        for (let i = 0; i < length; ++i) {
          if (
            ReflectApply(callback, thisArg, [
              convertToNumber(float16bitsArray[i]),
              i,
              this,
            ])
          ) {
            return true;
          }
        }

        return false;
      }

      /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.set */
      set(input, ...opts) {
        assertFloat16Array(this);
        const float16bitsArray = getFloat16BitsArray(this);

        const targetOffset = ToIntegerOrInfinity(opts[0]);
        if (targetOffset < 0) {
          throw NativeRangeError(OFFSET_IS_OUT_OF_BOUNDS);
        }

        if (input == null) {
          throw NativeTypeError(
            CANNOT_CONVERT_UNDEFINED_OR_NULL_TO_OBJECT
          );
        }

        if (isNativeBigIntTypedArray(input)) {
          throw NativeTypeError(
            CANNOT_MIX_BIGINT_AND_OTHER_TYPES
          );
        }

        // for optimization
        if (isFloat16Array(input)) {
          // peel off Proxy
          return TypedArrayPrototypeSet(
            getFloat16BitsArray(this),
            getFloat16BitsArray(input),
            targetOffset
          );
        }

        if (isNativeTypedArray(input)) {
          const buffer = TypedArrayPrototypeGetBuffer(input);
          if (IsDetachedBuffer(buffer)) {
            throw NativeTypeError(ATTEMPTING_TO_ACCESS_DETACHED_ARRAYBUFFER);
          }
        }

        const targetLength = TypedArrayPrototypeGetLength(float16bitsArray);

        const src = NativeObject(input);
        const srcLength = ToLength(src.length);

        if (targetOffset === Infinity || srcLength + targetOffset > targetLength) {
          throw NativeRangeError(OFFSET_IS_OUT_OF_BOUNDS);
        }

        for (let i = 0; i < srcLength; ++i) {
          float16bitsArray[i + targetOffset] = roundToFloat16Bits(src[i]);
        }
      }

      /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.reverse */
      reverse() {
        assertFloat16Array(this);
        const float16bitsArray = getFloat16BitsArray(this);

        TypedArrayPrototypeReverse(float16bitsArray);

        return this;
      }

      /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.fill */
      fill(value, ...opts) {
        assertFloat16Array(this);
        const float16bitsArray = getFloat16BitsArray(this);

        TypedArrayPrototypeFill(
          float16bitsArray,
          roundToFloat16Bits(value),
          ...safeIfNeeded(opts)
        );

        return this;
      }

      /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.copywithin */
      copyWithin(target, start, ...opts) {
        assertFloat16Array(this);
        const float16bitsArray = getFloat16BitsArray(this);

        TypedArrayPrototypeCopyWithin(float16bitsArray, target, start, ...safeIfNeeded(opts));

        return this;
      }

      /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.sort */
      sort(compareFn) {
        assertFloat16Array(this);
        const float16bitsArray = getFloat16BitsArray(this);

        const sortCompare = compareFn !== undefined ? compareFn : defaultCompare;
        TypedArrayPrototypeSort(float16bitsArray, (x, y) => {
          return sortCompare(convertToNumber(x), convertToNumber(y));
        });

        return this;
      }

      /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.slice */
      slice(start, end) {
        assertFloat16Array(this);
        const float16bitsArray = getFloat16BitsArray(this);

        const Constructor = SpeciesConstructor(float16bitsArray, Float16Array);

        // for optimization
        if (Constructor === Float16Array) {
          const uint16 = new NativeUint16Array(
            TypedArrayPrototypeGetBuffer(float16bitsArray),
            TypedArrayPrototypeGetByteOffset(float16bitsArray),
            TypedArrayPrototypeGetLength(float16bitsArray)
          );
          return new Float16Array(
            TypedArrayPrototypeGetBuffer(
              TypedArrayPrototypeSlice(uint16, start, end)
            )
          );
        }

        const length = TypedArrayPrototypeGetLength(float16bitsArray);
        const relativeStart = ToIntegerOrInfinity(start);
        const relativeEnd = end === undefined ? length : ToIntegerOrInfinity(end);

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

        const buffer = TypedArrayPrototypeGetBuffer(float16bitsArray);
        if (IsDetachedBuffer(buffer)) {
          throw NativeTypeError(ATTEMPTING_TO_ACCESS_DETACHED_ARRAYBUFFER);
        }

        let n = 0;
        while (k < final) {
          array[n] = convertToNumber(float16bitsArray[k]);
          ++k;
          ++n;
        }

        return /** @type {any} */ (array);
      }

      /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.subarray */
      subarray(begin, end) {
        assertFloat16Array(this);
        const float16bitsArray = getFloat16BitsArray(this);

        const Constructor = SpeciesConstructor(float16bitsArray, Float16Array);

        const uint16 = new NativeUint16Array(
          TypedArrayPrototypeGetBuffer(float16bitsArray),
          TypedArrayPrototypeGetByteOffset(float16bitsArray),
          TypedArrayPrototypeGetLength(float16bitsArray)
        );
        const uint16Subarray = TypedArrayPrototypeSubarray(uint16, begin, end);

        const array = new Constructor(
          TypedArrayPrototypeGetBuffer(uint16Subarray),
          TypedArrayPrototypeGetByteOffset(uint16Subarray),
          TypedArrayPrototypeGetLength(uint16Subarray)
        );
        assertSpeciesTypedArray(array);

        return /** @type {any} */ (array);
      }

      /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.indexof */
      indexOf(element, ...opts) {
        assertFloat16Array(this);
        const float16bitsArray = getFloat16BitsArray(this);

        const length = TypedArrayPrototypeGetLength(float16bitsArray);

        let from = ToIntegerOrInfinity(opts[0]);
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
          if (
            ObjectHasOwn(float16bitsArray, i) &&
            convertToNumber(float16bitsArray[i]) === element
          ) {
            return i;
          }
        }

        return -1;
      }

      /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.lastindexof */
      lastIndexOf(element, ...opts) {
        assertFloat16Array(this);
        const float16bitsArray = getFloat16BitsArray(this);

        const length = TypedArrayPrototypeGetLength(float16bitsArray);

        let from = opts.length >= 1 ? ToIntegerOrInfinity(opts[0]) : length - 1;
        if (from === -Infinity) {
          return -1;
        }

        if (from >= 0) {
          from = from < length - 1 ? from : length - 1;
        } else {
          from += length;
        }

        for (let i = from; i >= 0; --i) {
          if (
            ObjectHasOwn(float16bitsArray, i) &&
            convertToNumber(float16bitsArray[i]) === element
          ) {
            return i;
          }
        }

        return -1;
      }

      /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.includes */
      includes(element, ...opts) {
        assertFloat16Array(this);
        const float16bitsArray = getFloat16BitsArray(this);

        const length = TypedArrayPrototypeGetLength(float16bitsArray);

        let from = ToIntegerOrInfinity(opts[0]);
        if (from === Infinity) {
          return false;
        }

        if (from < 0) {
          from += length;
          if (from < 0) {
            from = 0;
          }
        }

        const isNaN = NumberIsNaN(element);
        for (let i = from; i < length; ++i) {
          const value = convertToNumber(float16bitsArray[i]);

          if (isNaN && NumberIsNaN(value)) {
            return true;
          }

          if (value === element) {
            return true;
          }
        }

        return false;
      }

      /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.join */
      join(separator) {
        assertFloat16Array(this);
        const float16bitsArray = getFloat16BitsArray(this);

        const array = copyToArray(float16bitsArray);

        return ArrayPrototypeJoin(array, separator);
      }

      /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype.tolocalestring */
      toLocaleString(...opts) {
        assertFloat16Array(this);
        const float16bitsArray = getFloat16BitsArray(this);

        const array = copyToArray(float16bitsArray);

        return ArrayPrototypeToLocaleString(array, ...safeIfNeeded(opts));
      }

      /** @see https://tc39.es/ecma262/#sec-get-%typedarray%.prototype-@@tostringtag */
      get [SymbolToStringTag]() {
        if (isFloat16Array(this)) {
          return /** @type {any} */ ("Float16Array");
        }
      }
    }

    /** @see https://tc39.es/ecma262/#sec-typedarray.bytes_per_element */
    ObjectDefineProperty(Float16Array, "BYTES_PER_ELEMENT", {
      value: BYTES_PER_ELEMENT,
    });

    // limitation: It is peaked by `Object.getOwnPropertySymbols(Float16Array)` and `Reflect.ownKeys(Float16Array)`
    ObjectDefineProperty(Float16Array, brand, {});

    /** @see https://tc39.es/ecma262/#sec-properties-of-the-typedarray-constructors */
    ReflectSetPrototypeOf(Float16Array, TypedArray);

    const Float16ArrayPrototype = Float16Array.prototype;

    /** @see https://tc39.es/ecma262/#sec-typedarray.prototype.bytes_per_element */
    ObjectDefineProperty(Float16ArrayPrototype, "BYTES_PER_ELEMENT", {
      value: BYTES_PER_ELEMENT,
    });

    /** @see https://tc39.es/ecma262/#sec-%typedarray%.prototype-@@iterator */
    ObjectDefineProperty(Float16ArrayPrototype, SymbolIterator, {
      value: Float16ArrayPrototype.values,
      writable: true,
      configurable: true,
    });

    // To make `new Float16Array() instanceof Uint16Array` returns `false`
    ReflectSetPrototypeOf(Float16ArrayPrototype, TypedArrayPrototype);

    /**
     * @param {unknown} target
     * @returns {value is Uint8Array|Uint8ClampedArray|Uint16Array|Uint32Array|Int8Array|Int16Array|Int32Array|Float16Array|Float32Array|Float64Array|BigUint64Array|BigInt64Array}
     */
    function isTypedArray(target) {
      return isNativeTypedArray(target) || isFloat16Array(target);
    }

    /**
     * returns an unsigned 16-bit float at the specified byte offset from the start of the DataView
     *
     * @param {DataView} dataView
     * @param {number} byteOffset
     * @param {[boolean]} opts
     * @returns {number}
     */
    function getFloat16(dataView, byteOffset, ...opts) {
      return convertToNumber(
        DataViewPrototypeGetUint16(dataView, byteOffset, ...safeIfNeeded(opts))
      );
    }

    /**
     * stores an unsigned 16-bit float value at the specified byte offset from the start of the DataView
     *
     * @param {DataView} dataView
     * @param {number} byteOffset
     * @param {number} value
     * @param {[boolean]} opts
     */
    function setFloat16(dataView, byteOffset, value, ...opts) {
      return DataViewPrototypeSetUint16(
        dataView,
        byteOffset,
        roundToFloat16Bits(value),
        ...safeIfNeeded(opts)
      );
    }

    var FileSaver_min = {exports: {}};

    (function (module, exports) {
    	(function(a,b){b();})(commonjsGlobal,function(){function b(a,b){return "undefined"==typeof b?b={autoBom:!1}:"object"!=typeof b&&(console.warn("Deprecated: Expected third argument to be a object"),b={autoBom:!b}),b.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(a.type)?new Blob(["\uFEFF",a],{type:a.type}):a}function c(a,b,c){var d=new XMLHttpRequest;d.open("GET",a),d.responseType="blob",d.onload=function(){g(d.response,b,c);},d.onerror=function(){console.error("could not download file");},d.send();}function d(a){var b=new XMLHttpRequest;b.open("HEAD",a,!1);try{b.send();}catch(a){}return 200<=b.status&&299>=b.status}function e(a){try{a.dispatchEvent(new MouseEvent("click"));}catch(c){var b=document.createEvent("MouseEvents");b.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),a.dispatchEvent(b);}}var f="object"==typeof window&&window.window===window?window:"object"==typeof self&&self.self===self?self:"object"==typeof commonjsGlobal&&commonjsGlobal.global===commonjsGlobal?commonjsGlobal:void 0,a=f.navigator&&/Macintosh/.test(navigator.userAgent)&&/AppleWebKit/.test(navigator.userAgent)&&!/Safari/.test(navigator.userAgent),g=f.saveAs||("object"!=typeof window||window!==f?function(){}:"download"in HTMLAnchorElement.prototype&&!a?function(b,g,h){var i=f.URL||f.webkitURL,j=document.createElement("a");g=g||b.name||"download",j.download=g,j.rel="noopener","string"==typeof b?(j.href=b,j.origin===location.origin?e(j):d(j.href)?c(b,g,h):e(j,j.target="_blank")):(j.href=i.createObjectURL(b),setTimeout(function(){i.revokeObjectURL(j.href);},4E4),setTimeout(function(){e(j);},0));}:"msSaveOrOpenBlob"in navigator?function(f,g,h){if(g=g||f.name||"download","string"!=typeof f)navigator.msSaveOrOpenBlob(b(f,h),g);else if(d(f))c(f,g,h);else {var i=document.createElement("a");i.href=f,i.target="_blank",setTimeout(function(){e(i);});}}:function(b,d,e,g){if(g=g||open("","_blank"),g&&(g.document.title=g.document.body.innerText="downloading..."),"string"==typeof b)return c(b,d,e);var h="application/octet-stream"===b.type,i=/constructor/i.test(f.HTMLElement)||f.safari,j=/CriOS\/[\d]+/.test(navigator.userAgent);if((j||h&&i||a)&&"undefined"!=typeof FileReader){var k=new FileReader;k.onloadend=function(){var a=k.result;a=j?a:a.replace(/^data:[^;]*;/,"data:attachment/file;"),g?g.location.href=a:location=a,g=null;},k.readAsDataURL(b);}else {var l=f.URL||f.webkitURL,m=l.createObjectURL(b);g?g.location=m:location.href=m,g=null,setTimeout(function(){l.revokeObjectURL(m);},4E4);}});f.saveAs=g.saveAs=g,(module.exports=g);});

    	
    } (FileSaver_min));

    var FileSaver_minExports = FileSaver_min.exports;

    /**
     * Checks if type is valid GPULayer data type.
     * @private
     */
    function isValidDataType(type) {
        return validDataTypes.indexOf(type) > -1;
    }
    /**
     * Checks if filter is valid GPULayer filter type.
     * @private
     */
    function isValidFilter(type) {
        return validFilters.indexOf(type) > -1;
    }
    /**
     * Checks if wrap is valid GPULayer wrap type.
     * @private
     */
    function isValidWrap(type) {
        return validWraps.indexOf(type) > -1;
    }
    /**
     * For image urls that are passed in and inited as GPULayers.
     * @private
     */
    function isValidImageFormat(type) {
        return validImageFormats.indexOf(type) > -1;
    }
    /**
     * For image urls that are passed in and inited as GPULayers.
     * @private
     */
    function isValidImageType(type) {
        return validImageTypes.indexOf(type) > -1;
    }
    /**
     * Checks if value is valid GPULayer clear value for numComponents and type.
     * @private
     */
    function isValidClearValue(clearValue, numComponents, type) {
        if (typeChecksExports.isArray(clearValue)) {
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
    /**
     * Checks if value is valid number for a given GPULayer type.
     * Checks extrema values.
     * @private
     */
    function isNumberOfType(value, type) {
        switch (type) {
            case HALF_FLOAT:
            case FLOAT:
                return typeChecksExports.isFiniteNumber(value);
            case BYTE:
                // -(2 ** 7)
                if (value < -128)
                    return false;
                // 2 ** 7 - 1
                if (value > 127)
                    return false;
                return typeChecksExports.isInteger(value);
            case SHORT:
                // -(2 ** 15)
                if (value < -32768)
                    return false;
                // 2 ** 15 - 1
                if (value > 32767)
                    return false;
                return typeChecksExports.isInteger(value);
            case INT:
                // -(2 ** 31)
                if (value < -2147483648)
                    return false;
                // 2 ** 31 - 1
                if (value > 2147483647)
                    return false;
                return typeChecksExports.isInteger(value);
            case UNSIGNED_BYTE:
                // 2 ** 8 - 1
                if (value > 255)
                    return false;
                return typeChecksExports.isNonNegativeInteger(value);
            case UNSIGNED_SHORT:
                // 2 ** 16 - 1
                if (value > 65535)
                    return false;
                return typeChecksExports.isNonNegativeInteger(value);
            case UNSIGNED_INT:
                // 2 ** 32 - 1
                if (value > 4294967295)
                    return false;
                return typeChecksExports.isNonNegativeInteger(value);
            default:
                throw new Error("Unknown type ".concat(type));
        }
    }
    function checkValidKeys(keys, validKeys, methodName, name) {
        keys.forEach(function (key) {
            if (validKeys.indexOf(key) < 0) {
                console.warn("Invalid params key \"".concat(key, "\" passed to ").concat(methodName).concat(name ? " with name \"".concat(name, "\"") : '', ".  Valid keys are ").concat(JSON.stringify(validKeys), "."));
            }
        });
    }
    function checkRequiredKeys(keys, requiredKeys, methodName, name) {
        requiredKeys.forEach(function (key) {
            if (keys.indexOf(key) < 0) {
                throw new Error("Required params key \"".concat(key, "\" was not passed to ").concat(methodName).concat(name ? " with name \"".concat(name, "\"") : '', "."));
            }
        });
    }

    var checks = /*#__PURE__*/Object.freeze({
        __proto__: null,
        checkRequiredKeys: checkRequiredKeys,
        checkValidKeys: checkValidKeys,
        isNumberOfType: isNumberOfType,
        isValidClearValue: isValidClearValue,
        isValidDataType: isValidDataType,
        isValidFilter: isValidFilter,
        isValidImageFormat: isValidImageFormat,
        isValidImageType: isValidImageType,
        isValidWrap: isValidWrap
    });

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

    var GPULayer = /** @class */ (function () {
        /**
         * Create a GPULayer.
         * @param composer - The current GPUComposer instance.
         * @param params - GPULayer parameters.
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
            if (!typeChecksExports.isObject(params)) {
                throw new Error("Error initing GPULayer: must pass valid params object to GPULayer(composer, params), got ".concat(JSON.stringify(params), "."));
            }
            // Check params keys.
            var validKeys = ['name', 'type', 'numComponents', 'dimensions', 'filter', 'wrapX', 'wrapY', 'numBuffers', 'clearValue', 'array'];
            var requiredKeys = ['name', 'type', 'numComponents', 'dimensions'];
            var keys = Object.keys(params);
            checkValidKeys(keys, validKeys, 'GPULayer(composer, params)', params.name);
            checkRequiredKeys(keys, requiredKeys, 'GPULayer(composer, params)', params.name);
            var dimensions = params.dimensions, type = params.type, numComponents = params.numComponents;
            var gl = composer.gl;
            // Save params.
            this._composer = composer;
            this.name = name;
            // numComponents must be between 1 and 4.
            if (!typeChecksExports.isPositiveInteger(numComponents) || numComponents > 4) {
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
            var defaultFilter = (length === undefined && (type === FLOAT || type == HALF_FLOAT)) ? LINEAR : NEAREST;
            var filter = params.filter !== undefined ? params.filter : defaultFilter;
            if (!isValidFilter(filter)) {
                throw new Error("Invalid filter: ".concat(JSON.stringify(filter), " for GPULayer \"").concat(name, "\", must be one of ").concat(JSON.stringify(validFilters), "."));
            }
            // Don't allow LINEAR filtering on integer types, it is not supported.
            if (filter === LINEAR && !(type === FLOAT || type == HALF_FLOAT)) {
                throw new Error("LINEAR filtering is not supported on integer types, please use NEAREST filtering for GPULayer \"".concat(name, "\" with type: ").concat(type, "."));
            }
            this.filter = filter;
            // Get wrap types, default to clamp to edge.
            var wrapX = params.wrapX !== undefined ? params.wrapX : CLAMP_TO_EDGE;
            if (!isValidWrap(wrapX)) {
                throw new Error("Invalid wrapX: ".concat(JSON.stringify(wrapX), " for GPULayer \"").concat(name, "\", must be one of ").concat(JSON.stringify(validWraps), "."));
            }
            this.wrapX = wrapX;
            var wrapY = params.wrapY !== undefined ? params.wrapY : CLAMP_TO_EDGE;
            if (!isValidWrap(wrapY)) {
                throw new Error("Invalid wrapY: ".concat(JSON.stringify(wrapY), " for GPULayer \"").concat(name, "\", must be one of ").concat(JSON.stringify(validWraps), "."));
            }
            this.wrapY = wrapY;
            // Set data type.
            if (!isValidDataType(type)) {
                throw new Error("Invalid type: ".concat(JSON.stringify(type), " for GPULayer \"").concat(name, "\", must be one of ").concat(JSON.stringify(validDataTypes), "."));
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
            if (!typeChecksExports.isPositiveInteger(numBuffers)) {
                throw new Error("Invalid numBuffers: ".concat(JSON.stringify(numBuffers), " for GPULayer \"").concat(name, "\", must be positive integer."));
            }
            this.numBuffers = numBuffers;
            // Wait until after type and numComponents has been set to set clearValue.
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
         * @param params.clearValue - Value to write to GPULayer when GPULayer.clear() is called.
         */
        GPULayer.initFromImageURL = function (composer, params) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            if (!params) {
                                throw new Error('Error initing GPULayer: must pass params to GPULayer.initFromImageURL(composer, params).');
                            }
                            if (!typeChecksExports.isObject(params)) {
                                throw new Error("Error initing GPULayer: must pass valid params object to GPULayer.initFromImageURL(composer, params), got ".concat(JSON.stringify(params), "."));
                            }
                            // Check params.
                            var validKeys = ['name', 'url', 'filter', 'wrapX', 'wrapY', 'format', 'type', 'clearValue'];
                            var requiredKeys = ['name', 'url'];
                            var keys = Object.keys(params);
                            checkValidKeys(keys, validKeys, 'GPULayer.initFromImageURL(composer, params)', params.name);
                            checkRequiredKeys(keys, requiredKeys, 'GPULayer.initFromImageURL(composer, params)', params.name);
                            var url = params.url, name = params.name, filter = params.filter, wrapX = params.wrapX, wrapY = params.wrapY, type = params.type, format = params.format;
                            if (!typeChecksExports.isString(url)) {
                                throw new Error("Expected GPULayer.initFromImageURL params to have url of type string, got ".concat(url, " of type ").concat(typeof url, "."));
                            }
                            if (type && !isValidImageType(type)) {
                                throw new Error("Invalid type: \"".concat(type, "\" for GPULayer.initFromImageURL \"").concat(name, "\", must be one of ").concat(JSON.stringify(validImageTypes), "."));
                            }
                            if (format && !isValidImageFormat(format)) {
                                throw new Error("Invalid format: \"".concat(format, "\" for GPULayer.initFromImageURL \"").concat(name, "\", must be one of ").concat(JSON.stringify(validImageFormats), "."));
                            }
                            // Init a layer to return, we will fill it when image has loaded.
                            var layer = new GPULayer(composer, {
                                name: name,
                                type: type || FLOAT,
                                numComponents: format ? format.length : 4,
                                dimensions: [1, 1],
                                filter: filter,
                                wrapX: wrapX,
                                wrapY: wrapY,
                                numBuffers: 1,
                                clearValue: params.clearValue,
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
         * Returns whether the GPULayer was inited as a 2D array (rather than 1D).
         * @returns - true if GPULayer is 2D, else false.
         */
        GPULayer.prototype.is2D = function () {
            return !this.is1D();
        };
        /**
         * Test whether the current buffer index has override enabled.
         * @private
         */
        GPULayer.prototype._usingTextureOverrideForCurrentBuffer = function () {
            return !!(this._textureOverrides && this._textureOverrides[this.bufferIndex]);
        };
        /**
         * Copy contents of current state to another GPULayer.
         * TODO: Still testing this.
         * @private
         */
        GPULayer.prototype.copyCurrentStateToGPULayer = function (layer) {
            var _composer = this._composer;
            if (this === layer)
                throw new Error("Can't call GPULayer.copyCurrentStateToGPULayer() on self.");
            var copyProgram = _composer._copyProgramForType(this._internalType);
            _composer.step({
                program: copyProgram,
                input: this,
                output: layer,
            });
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
            if (typeChecksExports.isArray(arrayOrImage))
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
            var numBuffers = this.numBuffers;
            if (numBuffers === 1)
                return;
            // Increment bufferIndex.
            this._bufferIndex = (this.bufferIndex + 1) % numBuffers;
        };
        /**
         * Decrement buffer index by 1.
         */
        GPULayer.prototype.decrementBufferIndex = function () {
            var numBuffers = this.numBuffers;
            if (numBuffers === 1)
                return;
            // Decrement bufferIndex.
            this._bufferIndex = (this.bufferIndex - 1 + numBuffers) % numBuffers;
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
                if (!isValidClearValue(clearValue, numComponents, type)) {
                    throw new Error("Invalid clearValue: ".concat(JSON.stringify(clearValue), " for GPULayer \"").concat(this.name, "\", expected ").concat(type, " or array of ").concat(type, " of length ").concat(numComponents, "."));
                }
                // Make deep copy if needed.
                this._clearValue = typeChecksExports.isArray(clearValue) ? clearValue.slice() : clearValue;
                this._clearValueVec4 = undefined;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GPULayer.prototype, "clearValueVec4", {
            /**
             * Get the clearValue of the GPULayer as a vec4, pad with zeros as needed.
             */
            get: function () {
                var _clearValueVec4 = this._clearValueVec4;
                if (!_clearValueVec4) {
                    var clearValue = this.clearValue;
                    _clearValueVec4 = [];
                    if (typeChecksExports.isFiniteNumber(clearValue)) {
                        _clearValueVec4.push(clearValue, clearValue, clearValue, clearValue);
                    }
                    else {
                        _clearValueVec4.push.apply(_clearValueVec4, clearValue);
                        for (var j = _clearValueVec4.length; j < 4; j++) {
                            _clearValueVec4.push(0);
                        }
                    }
                    this._clearValueVec4 = _clearValueVec4;
                }
                return _clearValueVec4;
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
            var _a = this, name = _a.name, _composer = _a._composer, clearValueVec4 = _a.clearValueVec4, numBuffers = _a.numBuffers, type = _a.type;
            var verboseLogging = _composer.verboseLogging;
            if (verboseLogging)
                console.log("Clearing GPULayer \"".concat(name, "\"."));
            var program = _composer._setValueProgramForType(type);
            program.setUniform('u_value', clearValueVec4);
            this.decrementBufferIndex(); // step() wil increment buffer index before draw, this way we clear in place.
            var endIndex = applyToAllBuffers ? numBuffers : 1;
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
            bindFrameBuffer(_composer, this, _currentTexture);
            var _b = this, _glNumChannels = _b._glNumChannels, _glType = _b._glType, _glFormat = _b._glFormat, _internalType = _b._internalType;
            switch (_internalType) {
                case HALF_FLOAT:
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
                case FLOAT:
                    // Chrome and Firefox require that RGBA/FLOAT is used for readPixels of float32 types.
                    // https://github.com/KhronosGroup/WebGL/issues/2747
                    _glNumChannels = 4;
                    _glFormat = gl.RGBA;
                    _valuesRaw = _valuesRaw || new Float32Array(width * height * _glNumChannels);
                    break;
                case UNSIGNED_BYTE:
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
                case UNSIGNED_SHORT:
                    // Firefox requires that RGBA_INTEGER/UNSIGNED_INT is used for readPixels of unsigned int types.
                    _glNumChannels = 4;
                    _glFormat = gl.RGBA_INTEGER;
                    _glType = gl.UNSIGNED_INT;
                    _valuesRaw = _valuesRaw || new Uint32Array(width * height * _glNumChannels);
                    // // The following works in Chrome.
                    // _valuesRaw = _valuesRaw || new Uint16Array(width * height * glNumChannels);
                    break;
                case UNSIGNED_INT:
                    // Firefox requires that RGBA_INTEGER/UNSIGNED_INT is used for readPixels of unsigned int types.
                    _glNumChannels = 4;
                    _glFormat = gl.RGBA_INTEGER;
                    _valuesRaw = _valuesRaw || new Uint32Array(width * height * _glNumChannels);
                    // // The following works in Chrome.
                    // _valuesRaw = _valuesRaw || new Uint32Array(width * height * glNumChannels);
                    break;
                case BYTE:
                    // Firefox requires that RGBA_INTEGER/INT is used for readPixels of int types.
                    _glNumChannels = 4;
                    _glFormat = gl.RGBA_INTEGER;
                    _glType = gl.INT;
                    _valuesRaw = _valuesRaw || new Int32Array(width * height * _glNumChannels);
                    // // The following works in Chrome.
                    // _valuesRaw = _valuesRaw || new Int8Array(width * height * glNumChannels);
                    break;
                case SHORT:
                    // Firefox requires that RGBA_INTEGER/INT is used for readPixels of int types.
                    _glNumChannels = 4;
                    _glFormat = gl.RGBA_INTEGER;
                    _glType = gl.INT;
                    _valuesRaw = _valuesRaw || new Int32Array(width * height * _glNumChannels);
                    // // The following works in Chrome.
                    // _valuesRaw = _valuesRaw || new Int16Array(width * height * glNumChannels);
                    break;
                case INT:
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
            if (readyToRead(gl)) {
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
            var handleFloat16Conversion = _internalType === HALF_FLOAT && _valuesRaw.constructor === Uint16Array;
            var _valuesBufferView = this._valuesBufferView;
            if (handleFloat16Conversion && !_valuesBufferView) {
                _valuesBufferView = new DataView(_valuesRaw.buffer);
                this._valuesBufferView = _valuesBufferView;
            }
            // We may use a different internal type than the assigned type of the GPULayer.
            if (_valuesRaw.length === OUTPUT_LENGTH && arrayConstructorForType(type, true) === _valuesRaw.constructor) {
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
                            _values[index2 + j] = getFloat16(_valuesBufferView, 2 * (index1 + j), true);
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
                            return [4 /*yield*/, readPixelsAsync(gl, 0, 0, width, height, _glFormat, _glType, _valuesRaw)];
                        case 1:
                            // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/readPixels
                            _c.sent();
                            return [2 /*return*/, this._getValuesPost(_valuesRaw, _glNumChannels, _internalType)];
                    }
                });
            });
        };
        GPULayer.prototype._getCanvasWithImageData = function (multiplier) {
            var values = this.getValues();
            var _a = this, width = _a.width, height = _a.height, numComponents = _a.numComponents, type = _a.type;
            multiplier = multiplier ||
                ((type === FLOAT || type === HALF_FLOAT) ? 255 : 1);
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
            return canvas;
        };
        /**
         * Get the current state of this GPULayer as an Image.
         * @param params - Image parameters.
         * @param params.multiplier - Multiplier to apply to data (defaults to 255 for FLOAT and HALF_FLOAT types, else 1).
        */
        GPULayer.prototype.getImage = function (params) {
            if (params) {
                var validKeys = ['multiplier'];
                var keys = Object.keys(params);
                checkValidKeys(keys, validKeys, 'GPULayer.getImage(params)');
            }
            var canvas = this._getCanvasWithImageData(params && params.multiplier);
            var image = new Image();
            image.src = canvas.toDataURL();
            return image;
        };
        /**
         * Save the current state of this GPULayer to png.
         * @param params - PNG parameters.
         * @param params.filename - PNG filename (no extension, defaults to the name of the GPULayer).
         * @param params.dpi - PNG dpi (defaults to 72dpi).
         * @param params.multiplier - Multiplier to apply to data before saving PNG (defaults to 255 for FLOAT and HALF_FLOAT types, else 1).
         * @param params.callback - Optional callback when Blob is ready, default behavior saves the PNG using file-saver.
        */
        GPULayer.prototype.savePNG = function (params) {
            if (params === void 0) { params = {}; }
            var validKeys = ['filename', 'dpi', 'multiplier', 'callback'];
            var keys = Object.keys(params);
            checkValidKeys(keys, validKeys, 'GPULayer.savePNG(params)');
            var name = this.name;
            var callback = params.callback || FileSaver_minExports.saveAs; // Default to saving the image with file-saver.
            var filename = params.filename || name; // Default to the name of this layer.
            var canvas = this._getCanvasWithImageData(params.multiplier);
            canvas.toBlob(function (blob) {
                if (!blob) {
                    console.warn("Problem saving PNG from GPULayer \"".concat(name, "\", unable to init blob."));
                    return;
                }
                if (params.dpi) {
                    changeDpiBlob_1(blob, params.dpi).then(function (blob) {
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
                throw new Error("GPULayer \"".concat(name, "\" contains multiple WebGL textures (one for each buffer) that are flip-flopped during compute cycles, please choose a GPULayer with one buffer.  You can copy the current state of this GPULayer to a single buffer GPULayer during your render loop."));
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
                disposeFramebuffers(gl, texture);
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

    // https://developer.mozilla.org/en-US/docs/Web/API/OES_texture_float
    // Float is provided by default in WebGL2 contexts.
    // This extension implicitly enables the WEBGL_color_buffer_float extension (if supported), which allows rendering to 32-bit floating-point color buffers.
    var OES_TEXTURE_FLOAT = 'OES_texture_float';
    // https://developer.mozilla.org/en-US/docs/Web/API/OES_texture_half_float
    // Half float is supported by modern mobile browsers, float not yet supported.
    // Half float is provided by default for Webgl2 contexts.
    // This extension implicitly enables the EXT_color_buffer_half_float extension (if supported), which allows rendering to 16-bit floating point formats.
    var OES_TEXTURE_HALF_FLOAT = 'OES_texture_half_float';
    // https://www.khronos.org/registry/OpenGL/extensions/OES/OES_texture_float_linear.txt
    var OES_TEXTURE_FLOAT_LINEAR = 'OES_texture_float_linear';
    var OES_TEXTURE_HAlF_FLOAT_LINEAR = 'OES_texture_half_float_linear';
    // https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_depth_texture
    // Adds gl.UNSIGNED_SHORT, gl.UNSIGNED_INT types to textImage2D in WebGL1.0
    var WEBGL_DEPTH_TEXTURE = 'WEBGL_depth_texture';
    // EXT_COLOR_BUFFER_FLOAT adds ability to render to a variety of floating pt textures.
    // This is needed for the WebGL2 contexts that do not support OES_TEXTURE_FLOAT / OES_TEXTURE_HALF_FLOAT extensions.
    // https://developer.mozilla.org/en-US/docs/Web/API/EXT_color_buffer_float
    // https://stackoverflow.com/questions/34262493/framebuffer-incomplete-attachment-for-texture-with-internal-format
    // https://stackoverflow.com/questions/36109347/framebuffer-incomplete-attachment-only-happens-on-android-w-firefox
    var EXT_COLOR_BUFFER_FLOAT = 'EXT_color_buffer_float';
    // On WebGL 2, EXT_COLOR_BUFFER_HALF_FLOAT is an alternative to using the EXT_color_buffer_float extension on platforms
    // that support 16-bit floating point render targets but not 32-bit floating point render targets.
    var EXT_COLOR_BUFFER_HALF_FLOAT = 'EXT_color_buffer_half_float';
    // Vertex array extension is used by threejs.
    var OES_VERTEX_ARRAY_OBJECT = 'OES_vertex_array_object';
    // Extension to use int32 for indexed geometry for WebGL1.
    // According to WebGLStats nearly all devices support this extension.
    // Fallback to gl.UNSIGNED_SHORT if not available.
    var OES_ELEMENT_INDEX_UINT = 'OES_element_index_uint';
    // Derivatives extensions.
    var OES_STANDARD_DERIVATIVES = 'OES_standard_derivatives';
    function getExtension(composer, extensionName, optional) {
        if (optional === void 0) { optional = false; }
        // Check if we've already loaded the extension.
        if (composer._extensions[extensionName] !== undefined)
            return composer._extensions[extensionName];
        var gl = composer.gl, _errorCallback = composer._errorCallback, _extensions = composer._extensions; composer.verboseLogging;
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

    var extensions = /*#__PURE__*/Object.freeze({
        __proto__: null,
        EXT_COLOR_BUFFER_FLOAT: EXT_COLOR_BUFFER_FLOAT,
        EXT_COLOR_BUFFER_HALF_FLOAT: EXT_COLOR_BUFFER_HALF_FLOAT,
        OES_ELEMENT_INDEX_UINT: OES_ELEMENT_INDEX_UINT,
        OES_STANDARD_DERIVATIVES: OES_STANDARD_DERIVATIVES,
        OES_TEXTURE_FLOAT: OES_TEXTURE_FLOAT,
        OES_TEXTURE_FLOAT_LINEAR: OES_TEXTURE_FLOAT_LINEAR,
        OES_TEXTURE_HALF_FLOAT: OES_TEXTURE_HALF_FLOAT,
        OES_TEXTURE_HAlF_FLOAT_LINEAR: OES_TEXTURE_HAlF_FLOAT_LINEAR,
        OES_VERTEX_ARRAY_OBJECT: OES_VERTEX_ARRAY_OBJECT,
        WEBGL_DEPTH_TEXTURE: WEBGL_DEPTH_TEXTURE,
        getExtension: getExtension
    });

    // Memoize results.
    var results = {
        writeSupport: {},
        filterWrapSupport: {},
    };
    /**
     * Init empty typed array for type, optionally use Float32Array for HALF_FLOAT.
     * @private
     */
    GPULayer.initArrayForType = function (type, length, halfFloatsAsFloats) {
        if (halfFloatsAsFloats === void 0) { halfFloatsAsFloats = false; }
        return new (arrayConstructorForType(type, halfFloatsAsFloats))(length);
    };
    /**
     * Calc 2D size [width, height] for GPU layer given a 1D or 2D size parameter.
     * If 1D size supplied, nearest power of 2 width/height is generated.
     * Also checks that size elements are valid.
     * @private
     */
    GPULayer.calcGPULayerSize = function (size, name, verboseLogging) {
        if (typeChecksExports.isNumber(size)) {
            if (!typeChecksExports.isPositiveInteger(size)) {
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
        if (!typeChecksExports.isPositiveInteger(width)) {
            throw new Error("Invalid width: ".concat(JSON.stringify(width), " for GPULayer \"").concat(name, "\", must be positive integer."));
        }
        var height = size[1];
        if (!typeChecksExports.isPositiveInteger(height)) {
            throw new Error("Invalid height: ".concat(JSON.stringify(height), " for GPULayer \"").concat(name, "\", must be positive integer."));
        }
        return { width: width, height: height };
    };
    /**
     * Get the GL wrap type to use internally in GPULayer, based on browser support.
     * @private
     */
    GPULayer.getGPULayerInternalWrap = function (params) {
        var composer = params.composer, wrap = params.wrap, internalFilter = params.internalFilter, internalType = params.internalType;
        // CLAMP_TO_EDGE is always supported.
        if (wrap === CLAMP_TO_EDGE) {
            return wrap;
        }
        // Test if wrap/filter combo is actually supported by running some numbers through.
        if (testFilterWrap(composer, internalType, internalFilter, wrap)) {
            return wrap;
        }
        // If not, convert to CLAMP_TO_EDGE and polyfill in fragment shader.
        return CLAMP_TO_EDGE;
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
    GPULayer.getGPULayerInternalFilter = function (params) {
        var filter = params.filter;
        if (filter === NEAREST) {
            // NEAREST filtering is always supported.
            return filter;
        }
        var composer = params.composer, internalType = params.internalType, wrapX = params.wrapX, wrapY = params.wrapY, name = params.name;
        if (internalType === HALF_FLOAT) {
            var extension = getExtension(composer, OES_TEXTURE_HAlF_FLOAT_LINEAR, true)
                || getExtension(composer, OES_TEXTURE_FLOAT_LINEAR, true);
            if (!extension || !testFilterWrap(composer, internalType, filter, wrapX) || !testFilterWrap(composer, internalType, filter, wrapY)) {
                console.warn("This browser does not support ".concat(filter, " filtering for type ").concat(internalType, " and wrap [").concat(wrapX, ", ").concat(wrapY, "].  Falling back to NEAREST filter for GPULayer \"").concat(name, "\" with ").concat(filter, " polyfill in fragment shader."));
                filter = NEAREST; // Polyfill in fragment shader.
            }
        }
        if (internalType === FLOAT) {
            var extension = getExtension(composer, OES_TEXTURE_FLOAT_LINEAR, true);
            if (!extension || !testFilterWrap(composer, internalType, filter, wrapX) || !testFilterWrap(composer, internalType, filter, wrapY)) {
                console.warn("This browser does not support ".concat(filter, " filtering for type ").concat(internalType, " and wrap [").concat(wrapX, ", ").concat(wrapY, "].  Falling back to NEAREST filter for GPULayer \"").concat(name, "\" with ").concat(filter, " polyfill in fragment shader."));
                filter = NEAREST; // Polyfill in fragment shader.
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
        if (glslVersion === GLSL3 && isWebGL2)
            return false;
        // Int textures (other than UNSIGNED_BYTE) are not supported by WebGL1.0 or glsl1.x.
        // https://stackoverflow.com/questions/55803017/how-to-select-webgl-glsl-sampler-type-from-texture-format-properties
        // Use HALF_FLOAT/FLOAT instead.
        // Some large values of INT and UNSIGNED_INT are not supported unfortunately.
        // See tests for more information.
        // Update: Even UNSIGNED_BYTE should be cast as float in GLSL1.  I noticed some strange behavior in test:
        // setUniform>'should cast/handle uint uniforms for UNSIGNED_BYTE GPULayers' in tests/mocha/GPUProgram and 
        // getValues>'should return correct values for UNSIGNED_BYTE GPULayer' in tests/mocha/GPULayer
        return type === UNSIGNED_BYTE || type === BYTE || type === SHORT || type === INT || type === UNSIGNED_SHORT || type === UNSIGNED_INT;
    }
    /**
     * Returns GLTexture parameters for GPULayer, based on browser support.
     * @private
     */
    GPULayer.getGLTextureParameters = function (params) {
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
            if (internalType === FLOAT || internalType === HALF_FLOAT) {
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
                case HALF_FLOAT:
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
                case FLOAT:
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
                case UNSIGNED_BYTE:
                    glType = gl.UNSIGNED_BYTE;
                    if (glslVersion === GLSL1 && internalType === UNSIGNED_BYTE) {
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
                case BYTE:
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
                case SHORT:
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
                case UNSIGNED_SHORT:
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
                case INT:
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
                case UNSIGNED_INT:
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
                case FLOAT:
                    glType = gl.FLOAT;
                    break;
                case HALF_FLOAT:
                    glType = gl.HALF_FLOAT || getExtension(composer, OES_TEXTURE_HALF_FLOAT).HALF_FLOAT_OES;
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
        var key = "".concat(isWebGL2, ",").concat(internalType, ",").concat(glslVersion === GLSL3 ? '3' : '1');
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
        var wrap = gl[CLAMP_TO_EDGE];
        var filter = gl[NEAREST];
        // Use non-power of two dimensions to check for more universal support.
        // (In case size of GPULayer is changed at a later point).
        var width = 10;
        var height = 10;
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
        var _a = GPULayer.getGLTextureParameters({
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
        var key = "".concat(isWebGL2, ",").concat(internalType, ",").concat(filter, ",").concat(wrap, ",").concat(glslVersion === GLSL3 ? '3' : '1');
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
        var _b = GPULayer.getGLTextureParameters({
            composer: composer,
            name: 'testFilterWrap',
            numComponents: numComponents,
            internalType: internalType,
        }), glInternalFormat = _b.glInternalFormat, glFormat = _b.glFormat, glType = _b.glType, glNumChannels = _b.glNumChannels;
        // Init texture with values.
        var values = [3, 56.5, 834, -53.6, 0.003, 96.2, 23, 90.2, 32];
        var valuesTyped = GPULayer.initArrayForType(internalType, values.length * glNumChannels, true);
        for (var i = 0; i < values.length; i++) {
            valuesTyped[i * glNumChannels] = values[i];
            values[i] = valuesTyped[i * glNumChannels]; // Cast as int/uint if needed.
        }
        if (internalType === HALF_FLOAT) {
            // Cast values as Uint16Array for HALF_FLOAT.
            var valuesTyped16 = new Uint16Array(valuesTyped.length);
            var float16View = new DataView(valuesTyped16.buffer);
            for (var i = 0; i < valuesTyped.length; i++) {
                setFloat16(float16View, 2 * i, valuesTyped[i], true);
            }
            valuesTyped = valuesTyped16;
        }
        gl.texImage2D(gl.TEXTURE_2D, 0, glInternalFormat, width, height, 0, glFormat, glType, valuesTyped);
        // Init a GPULayer to write to.
        // Must use CLAMP_TO_EDGE/NEAREST on this GPULayer to avoid infinite loop.
        var output = new GPULayer(composer, {
            name: 'testFloatLinearFiltering-output',
            type: internalType,
            numComponents: numComponents,
            dimensions: [width, height],
            wrapX: CLAMP_TO_EDGE,
            wrapY: CLAMP_TO_EDGE,
            filter: NEAREST,
        });
        var offset = filter === LINEAR ? 0.5 : 1;
        // Run program to perform linear filter.
        var programName = 'testFilterWrap-program';
        var fragmentShaderSource = "\nin vec2 v_uv;\nuniform vec2 u_offset;\n#ifdef GPUIO_INT\n\tuniform isampler2D u_input;\n\tout int out_result;\n#endif\n#ifdef GPUIO_UINT\n\tuniform usampler2D u_input;\n\tout uint out_result;\n#endif\n#ifdef GPUIO_FLOAT\n\tuniform sampler2D u_input;\n\tout float out_result;\n#endif\nvoid main() {\n\tout_result = texture(u_input, v_uv + offset).x;\n}";
        if (glslVersion !== GLSL3) {
            fragmentShaderSource = convertFragmentShaderToGLSL1(fragmentShaderSource, programName)[0];
        }
        var fragmentShader = compileShader(gl, glslVersion, intPrecision, floatPrecision, fragmentShaderSource, gl.FRAGMENT_SHADER, programName, _errorCallback, (_a = {
                offset: "vec2(".concat(offset / width, ", ").concat(offset / height, ")")
            },
            _a[isUnsignedIntType(internalType) ? 'GPUIO_UINT' : (isIntType(internalType) ? 'GPUIO_INT' : 'GPUIO_FLOAT')] = '1',
            _a), undefined, true);
        function wrapValue(val, max) {
            if (wrap === CLAMP_TO_EDGE)
                return Math.max(0, Math.min(max - 1, val));
            return (val + max) % max;
        }
        var vertexShader = composer._getVertexShader(DEFAULT_PROGRAM_NAME, '', {}, programName);
        if (vertexShader && fragmentShader) {
            var program = initGLProgram(gl, vertexShader, fragmentShader, programName, _errorCallback);
            if (program) {
                // Draw setup.
                output._prepareForWrite(false);
                bindFrameBuffer(composer, output, output._currentTexture);
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
                var tol = isIntType(internalType) ? 0 : (internalType === HALF_FLOAT ? 1e-2 : 1e-4);
                for (var x = 0; x < width; x++) {
                    for (var y = 0; y < height; y++) {
                        var expected = void 0;
                        if (filter === LINEAR) {
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
    /**
     * Get the GL type to use internally in GPULayer, based on browser support.
     * @private
     * Exported here for testing purposes.
     */
    GPULayer.getGPULayerInternalType = function (params) {
        var composer = params.composer, name = params.name;
        var _errorCallback = composer._errorCallback, isWebGL2 = composer.isWebGL2;
        var type = params.type;
        var internalType = type;
        // Check if int types are supported.
        var intCast = shouldCastIntTypeAsFloat(composer, type);
        if (intCast) {
            if (internalType === UNSIGNED_BYTE || internalType === BYTE) {
                // Integers between -2048 and +2048 can be exactly represented by half float.
                internalType = HALF_FLOAT;
            }
            else {
                // Integers between 0 and 16777216 can be exactly represented by float32 (also applies for negative integers between −16777216 and 0)
                // This is sufficient for UNSIGNED_SHORT and SHORT types.
                // Large UNSIGNED_INT and INT cannot be represented by FLOAT type.
                console.warn("Falling back ".concat(internalType, " type to FLOAT type for glsl1.x support for GPULayer \"").concat(name, "\".\nLarge UNSIGNED_INT or INT with absolute value > 16,777,216 are not supported, on mobile UNSIGNED_INT, INT, UNSIGNED_SHORT, and SHORT with absolute value > 2,048 may not be supported."));
                internalType = FLOAT;
            }
        }
        // Check if float textures supported.
        if (!isWebGL2) {
            if (internalType === FLOAT) {
                // The OES_texture_float extension implicitly enables WEBGL_color_buffer_float extension (for writing).
                var extension = getExtension(composer, OES_TEXTURE_FLOAT, true);
                if (extension) {
                    // https://stackoverflow.com/questions/17476632/webgl-extension-support-across-browsers
                    // Rendering to a floating-point texture may not be supported, even if the OES_texture_float extension
                    // is supported. Typically, this fails on mobile hardware. To check if this is supported, you have to
                    // call the WebGL checkFramebufferStatus() function after attempting to attach texture to framebuffer.
                    var valid = testWriteSupport(composer, internalType);
                    if (!valid) {
                        console.warn("FLOAT not supported for writing operations in this browser, falling back to HALF_FLOAT type for GPULayer \"".concat(name, "\"."));
                        internalType = HALF_FLOAT;
                    }
                }
                else {
                    console.warn("FLOAT not supported in this browser, falling back to HALF_FLOAT type for GPULayer \"".concat(name, "\"."));
                    internalType = HALF_FLOAT;
                }
            }
            // Must support at least half float if using a float type.
            if (internalType === HALF_FLOAT) {
                // The OES_texture_half_float extension implicitly enables EXT_color_buffer_half_float extension (for writing).
                getExtension(composer, OES_TEXTURE_HALF_FLOAT, true);
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
            if (internalType === FLOAT) {
                var extension = getExtension(composer, EXT_COLOR_BUFFER_FLOAT, true);
                if (!extension) {
                    console.warn("FLOAT not supported in this browser, falling back to HALF_FLOAT type for GPULayer \"".concat(name, "\"."));
                    internalType = HALF_FLOAT;
                }
                else {
                    // Test attaching texture to framebuffer to be sure float writing is supported.
                    var valid = testWriteSupport(composer, internalType);
                    if (!valid) {
                        console.warn("FLOAT not supported for writing operations in this browser, falling back to HALF_FLOAT type for GPULayer \"".concat(name, "\"."));
                        internalType = HALF_FLOAT;
                    }
                }
            }
            if (internalType === HALF_FLOAT) {
                // On WebGL 2, EXT_color_buffer_half_float is an alternative to using the EXT_color_buffer_float extension
                // on platforms that support 16-bit floating point render targets but not 32-bit floating point render targets.
                var halfFloatExt = getExtension(composer, EXT_COLOR_BUFFER_HALF_FLOAT, true);
                if (!halfFloatExt) {
                    // Some versions of Firefox (e.g. Firefox v104 on Mac) do not support EXT_COLOR_BUFFER_HALF_FLOAT,
                    // but EXT_COLOR_BUFFER_FLOAT will work instead.
                    getExtension(composer, EXT_COLOR_BUFFER_FLOAT, true);
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
            case UNSIGNED_BYTE:
                min = MIN_UNSIGNED_BYTE;
                max = MAX_UNSIGNED_BYTE;
                break;
            case BYTE:
                min = MIN_BYTE;
                max = MAX_BYTE;
                break;
            case UNSIGNED_SHORT:
                min = MIN_UNSIGNED_SHORT;
                max = MAX_UNSIGNED_SHORT;
                break;
            case SHORT:
                min = MIN_SHORT;
                max = MAX_SHORT;
                break;
            case UNSIGNED_INT:
                min = MIN_UNSIGNED_INT;
                max = MAX_UNSIGNED_INT;
                break;
            case INT:
                min = MIN_INT;
                max = MAX_INT;
                break;
        }
        return {
            min: min,
            max: max,
        };
    }
    /**
     * Recasts typed array to match GPULayer.internalType.
     * @private
     */
    GPULayer.validateGPULayerArray = function (array, layer) {
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
                shouldTypeCast = internalType !== FLOAT;
                break;
            case Uint8Array:
                shouldTypeCast = internalType !== UNSIGNED_BYTE;
                break;
            case Int8Array:
                shouldTypeCast = internalType !== BYTE;
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
                shouldTypeCast = internalType !== UNSIGNED_SHORT;
                // }
                break;
            case Int16Array:
                shouldTypeCast = internalType !== SHORT;
                break;
            case Uint32Array:
                shouldTypeCast = internalType !== UNSIGNED_INT;
                break;
            case Int32Array:
                shouldTypeCast = internalType !== INT;
                break;
            default:
                throw new Error("Invalid array type: ".concat(array.constructor.name, " for GPULayer \"").concat(name, "\", please use one of [").concat(validArrayTypes.map(function (constructor) { return constructor.name; }).join(', '), "]."));
        }
        // Get min and max values for internalType.
        var _a = minMaxValuesForType(internalType), min = _a.min, max = _a.max;
        // Then check if array needs to be lengthened.
        // This could be because glNumChannels !== numComponents or because length !== width * height.
        var arrayLength = width * height * glNumChannels;
        var shouldResize = array.length !== arrayLength;
        var validatedArray = array;
        if (shouldTypeCast || shouldResize) {
            validatedArray = GPULayer.initArrayForType(internalType, arrayLength);
            // Fill new data array with old data.
            // We have to handle the case of Float16 specially by converting data to Uint16Array.
            var view = (internalType === HALF_FLOAT && shouldTypeCast) ? new DataView(validatedArray.buffer) : null;
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
                        setFloat16(view, 2 * index, value, true);
                    }
                    else {
                        validatedArray[index] = value;
                    }
                }
            }
        }
        return validatedArray;
    };

    var GPULayerHelpers = /*#__PURE__*/Object.freeze({
        __proto__: null,
        minMaxValuesForType: minMaxValuesForType,
        shouldCastIntTypeAsFloat: shouldCastIntTypeAsFloat,
        testFilterWrap: testFilterWrap,
        testWriteSupport: testWriteSupport
    });

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

    var DEFAULT_VERT_SHADER_SOURCE = "\nin vec2 a_gpuio_position;\n#ifdef ".concat(GPUIO_VS_UV_ATTRIBUTE, "\n\tin vec2 a_gpuio_uv;\n#endif\n#ifdef ").concat(GPUIO_VS_NORMAL_ATTRIBUTE, "\n\tin vec2 a_gpuio_normal;\n#endif\n\nuniform vec2 u_gpuio_scale;\nuniform vec2 u_gpuio_translation;\n\nout vec2 v_uv;\nout vec2 v_uv_local;\n#ifdef ").concat(GPUIO_VS_NORMAL_ATTRIBUTE, "\n\tout vec2 v_normal;\n#endif\n\nvoid main() {\n\t// Optional varyings.\n\t#ifdef ").concat(GPUIO_VS_UV_ATTRIBUTE, "\n\t\tv_uv_local = a_gpuio_uv;\n\t#else\n\t\tv_uv_local = 0.5 * (a_gpuio_position + 1.0);\n\t#endif\n\t#ifdef ").concat(GPUIO_VS_NORMAL_ATTRIBUTE, "\n\t\tv_normal = a_gpuio_normal;\n\t#endif\n\n\t// Apply transformations.\n\tvec2 position = u_gpuio_scale * a_gpuio_position + u_gpuio_translation;\n\n\t// Calculate a global uv for the viewport.\n\tv_uv = 0.5 * (position + 1.0);\n\n\t// Calculate vertex position.\n\tgl_Position = vec4(position, 0, 1);\n}");

    var VERTEX_SHADER_HELPERS_SOURCE = "\n/**\n * Create UV coordinates from a 1D index for data stored in a texture of size \"dimensions\".\n */\nvec2 uvFromIndex(const float index, const vec2 dimensions) {\n\tfloat y = floor((index + 0.5) / dimensions.x);\n\tfloat x = floor(index - y * dimensions.x + 0.5);\n\treturn vec2(x + 0.5, y + 0.5) / dimensions;\n}\nvec2 uvFromIndex(const int index, const vec2 dimensions) {\n\tint width = int(dimensions.x);\n\tint y = index / width;\n\tint x = index - y * width;\n\treturn vec2(float(x) + 0.5, float(y) + 0.5) / dimensions;\n}\nvec2 uvFromIndex(const float index, const ivec2 dimensions) {\n\tfloat width = float(dimensions.x);\n\tfloat y = floor((index + 0.5) / width);\n\tfloat x = floor(index - y * width + 0.5);\n\treturn vec2(x + 0.5, y + 0.5) / vec2(dimensions);\n}\nvec2 uvFromIndex(const int index, const ivec2 dimensions) {\n\tint y = index / dimensions.x;\n\tint x = index - y * dimensions.x;\n\treturn vec2(float(x) + 0.5, float(y) + 0.5) / vec2(dimensions);\n}";

    var LAYER_LINES_VERTEX_SHADER_SOURCE = "\n".concat(VERTEX_SHADER_HELPERS_SOURCE, "\n\n#if (__VERSION__ != 300 || ").concat(GPUIO_VS_INDEXED_POSITIONS, " == 1)\n\t// Cannot use int vertex attributes.\n\t// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer\n\tin float a_gpuio_index;\n#endif\n\nuniform sampler2D u_gpuio_positions; // Texture lookup with position data.\nuniform vec2 u_gpuio_positionsDimensions;\nuniform vec2 u_gpuio_scale;\n\nout vec2 v_uv;\nout vec2 v_lineWrapping; // Use this to test if line is only half wrapped and should not be rendered.\nflat out int v_index;\n\nvoid main() {\n\t// Calculate a uv based on the point's index attribute.\n\t#if (__VERSION__ != 300 || ").concat(GPUIO_VS_INDEXED_POSITIONS, " == 1)\n\t\tvec2 positionUV = uvFromIndex(a_gpuio_index, u_gpuio_positionsDimensions);\n\t\tv_index = int(a_gpuio_index);\n\t#else\n\t\tvec2 positionUV = uvFromIndex(gl_VertexID, u_gpuio_positionsDimensions);\n\t\tv_index = gl_VertexID;\n\t#endif\n\n\t// Calculate a global uv for the viewport.\n\t// Lookup vertex position and scale to [0, 1] range.\n\t#ifdef ").concat(GPUIO_VS_POSITION_W_ACCUM, "\n\t\t// We have packed a 2D displacement with the position.\n\t\tvec4 positionData = texture(u_gpuio_positions, positionUV);\n\t\t// position = first two components plus last two components (optional accumulation buffer).\n\t\tv_uv = (positionData.rg + positionData.ba) * u_gpuio_scale;\n\t#else\n\t\tv_uv = texture(u_gpuio_positions, positionUV).rg  * u_gpuio_scale;\n\t#endif\n\n\t// Wrap if needed.\n\tv_lineWrapping = vec2(0.0);\n\t#ifdef ").concat(GPUIO_VS_WRAP_X, "\n\t\tv_lineWrapping.x = max(step(1.0, v_uv.x), step(v_uv.x, 0.0));\n\t\tv_ux.x = fract(v_uv.x + 1.0);\n\t#endif\n\t#ifdef ").concat(GPUIO_VS_WRAP_Y, "\n\t\tv_lineWrapping.y = max(step(1.0, v_uv.y), step(v_uv.y, 0.0));\n\t\tv_ux.y = fract(v_uv.y + 1.0);\n\t#endif\n\n\t// Calculate position in [-1, 1] range.\n\tvec2 position = v_uv * 2.0 - 1.0;\n\n\tgl_Position = vec4(position, 0, 1);\n}");

    var SEGMENT_VERTEX_SHADER_SOURCE = "\nin vec2 a_gpuio_position;\n\nuniform float u_gpuio_halfThickness;\nuniform vec2 u_gpuio_scale;\nuniform float u_gpuio_length;\nuniform float u_gpuio_rotation;\nuniform vec2 u_gpuio_translation;\n\nout vec2 v_uv_local;\nout vec2 v_uv;\n\nmat2 rotate2d(float _angle){\n\treturn mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));\n}\n\nvoid main() {\n\t// Calculate UV coordinates of current rendered object.\n\tv_uv_local = 0.5 * (a_gpuio_position + 1.0);\n\n\tvec2 position = a_gpuio_position;\n\t// Apply thickness / radius.\n\tposition *= u_gpuio_halfThickness;\n\t// Stretch center of shape to form a round-capped line segment.\n\tfloat signX = sign(position.x);\n\tposition.x += signX * u_gpuio_length / 2.0;\n\tv_uv_local.x = (signX + 1.0) / 2.0;// Set entire cap uv.x to 1 or 0.\n\t// Apply transformations.\n\tposition = u_gpuio_scale * (rotate2d(-u_gpuio_rotation) * position) + u_gpuio_translation;\n\n\t// Calculate a global uv for the viewport.\n\tv_uv = 0.5 * (position + 1.0);\n\n\t// Calculate vertex position.\n\tgl_Position = vec4(position, 0, 1);\n}";

    var LAYER_POINTS_VERTEX_SHADER_SOURCE = "\n".concat(VERTEX_SHADER_HELPERS_SOURCE, "\n\n#if (__VERSION__ != 300)\n\t// Cannot use int vertex attributes.\n\t// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer\n\tin float a_gpuio_index;\n#endif\n\nuniform sampler2D u_gpuio_positions; // Texture lookup with position data.\nuniform vec2 u_gpuio_positionsDimensions;\nuniform vec2 u_gpuio_scale;\nuniform float u_gpuio_pointSize;\n\nout vec2 v_uv;\nout vec2 v_uv_position;\nout vec2 v_position;\nflat out int v_index;\n\nvoid main() {\n\t// Calculate a uv based on the point's index attribute.\n\t#if (__VERSION__ == 300)\n\t\tv_uv_position = uvFromIndex(gl_VertexID, u_gpuio_positionsDimensions);\n\t\tv_index = gl_VertexID;\n\t#else\n\t\tv_uv_position = uvFromIndex(a_gpuio_index, u_gpuio_positionsDimensions);\n\t\tv_index = int(a_gpuio_index);\n\t#endif\n\n\t// Calculate a global uv for the viewport.\n\t// Lookup vertex position and scale to [0, 1] range.\n\t#ifdef ").concat(GPUIO_VS_POSITION_W_ACCUM, "\n\t\t// We have packed a 2D displacement with the position.\n\t\tvec4 positionData = texture(u_gpuio_positions, v_uv_position);\n\t\t// position = first two components plus last two components (optional accumulation buffer).\n\t\tv_position = positionData.rg + positionData.ba;\n\t\tv_uv = v_position * u_gpuio_scale;\n\t#else\n\t\tv_position = texture(u_gpuio_positions, v_uv_position).rg;\n\t\tv_uv = v_position * u_gpuio_scale;\n\t#endif\n\n\t// Wrap if needed.\n\t#ifdef ").concat(GPUIO_VS_WRAP_X, "\n\t\tv_uv.x = fract(v_uv.x + ceil(abs(v_uv.x)));\n\t#endif\n\t#ifdef ").concat(GPUIO_VS_WRAP_Y, "\n\t\tv_uv.y = fract(v_uv.y + ceil(abs(v_uv.y)));\n\t#endif\n\n\t// Calculate position in [-1, 1] range.\n\tvec2 position = v_uv * 2.0 - 1.0;\n\n\tgl_PointSize = u_gpuio_pointSize;\n\tgl_Position = vec4(position, 0, 1);\n}");

    var LAYER_VECTOR_FIELD_VERTEX_SHADER_SOURCE = "\n".concat(VERTEX_SHADER_HELPERS_SOURCE, "\n\n#if (__VERSION__ != 300)\n\t// Cannot use int vertex attributes.\n\t// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer\n\tin float a_gpuio_index;\n#endif\n\nuniform sampler2D u_gpuio_vectors; // Texture lookup with vector data.\nuniform vec2 u_gpuio_dimensions;\nuniform vec2 u_gpuio_scale;\n\nout vec2 v_uv;\nflat out int v_index;\n\nvoid main() {\n\t#if (__VERSION__ == 300)\n\t\t// Divide index by 2.\n\t\tint index = gl_VertexID / 2;\n\t\tv_index = index;\n\t#else\n\t\t// Divide index by 2.\n\t\tfloat index = floor((a_gpuio_index + 0.5) / 2.0);\n\t\tv_index = int(index);\n\t#endif\n\n\t// Calculate a uv based on the vertex index attribute.\n\tv_uv = uvFromIndex(index, u_gpuio_dimensions);\n\t#if (__VERSION__ == 300)\n\t\t// Add vector displacement if needed.\n\t\tv_uv += float(gl_VertexID - 2 * index) * texture(u_gpuio_vectors, v_uv).xy * u_gpuio_scale;\n\t#else\n\t\t// Add vector displacement if needed.\n\t\tv_uv += (a_gpuio_index - 2.0 * index) * texture(u_gpuio_vectors, v_uv).xy * u_gpuio_scale;\n\t#endif\n\n\n\t// Calculate position in [-1, 1] range.\n\tvec2 position = v_uv * 2.0 - 1.0;\n\n\tgl_Position = vec4(position, 0, 1);\n}");

    var LAYER_MESH_VERTEX_SHADER_SOURCE = "\n".concat(VERTEX_SHADER_HELPERS_SOURCE, "\n\n#if (__VERSION__ != 300)\n\t// Cannot use int vertex attributes.\n\t// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer\n\tin float a_gpuio_index;\n#endif\n\nuniform sampler2D u_gpuio_positions; // Texture lookup with position data.\nuniform vec2 u_gpuio_positionsDimensions;\nuniform vec2 u_gpuio_scale;\n\nout vec2 v_uv;\nout vec2 v_uv_position;\nout vec2 v_position;\nflat out int v_index;\n\nvoid main() {\n\t// Calculate a uv based on the point's index attribute.\n\t#if (__VERSION__ == 300)\n\t\tv_uv_position = uvFromIndex(gl_VertexID, u_gpuio_positionsDimensions);\n\t\tv_index = gl_VertexID;\n\t#else\n\t\tv_uv_position = uvFromIndex(a_gpuio_index, u_gpuio_positionsDimensions);\n\t\tv_index = int(a_gpuio_index);\n\t#endif\n\n\t// Calculate a global uv for the viewport.\n\t// Lookup vertex position and scale to [0, 1] range.\n\t#ifdef ").concat(GPUIO_VS_POSITION_W_ACCUM, "\n\t\t// We have packed a 2D displacement with the position.\n\t\tvec4 positionData = texture(u_gpuio_positions, v_uv_position);\n\t\t// position = first two components plus last two components (optional accumulation buffer).\n\t\tv_position = positionData.rg + positionData.ba;\n\t\tv_uv = v_position * u_gpuio_scale;\n\t#else\n\t\tv_position = texture(u_gpuio_positions, v_uv_position).rg;\n\t\tv_uv = v_position * u_gpuio_scale;\n\t#endif\n\n\t// Calculate position in [-1, 1] range.\n\tvec2 position = v_uv * 2.0 - 1.0;\n\n\tgl_Position = vec4(position, 0, 1);\n}");

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
            if (!typeChecksExports.isObject(params)) {
                throw new Error("Error initing GPUProgram: must pass valid params object to GPUProgram(composer, params), got ".concat(JSON.stringify(params), "."));
            }
            // Check params keys.
            var validKeys = ['name', 'fragmentShader', 'uniforms', 'compileTimeConstants'];
            var requiredKeys = ['name', 'fragmentShader'];
            var keys = Object.keys(params);
            checkValidKeys(keys, validKeys, 'GPUProgram(composer, params)', params.name);
            checkRequiredKeys(keys, requiredKeys, 'GPUProgram(composer, params)', params.name);
            var fragmentShader = params.fragmentShader, uniforms = params.uniforms, compileTimeConstants = params.compileTimeConstants;
            // Save arguments.
            this._composer = composer;
            this.name = name;
            // Preprocess fragment shader source.
            var fragmentShaderSource = typeChecksExports.isString(fragmentShader) ?
                fragmentShader :
                fragmentShader.join('\n');
            var _a = preprocessFragmentShader(fragmentShaderSource, composer.glslVersion, name), shaderSource = _a.shaderSource, samplerUniforms = _a.samplerUniforms, additionalSources = _a.additionalSources;
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
            // Save extension declarations.
            if (composer.glslVersion === GLSL1 && (shaderSource.includes('dFdx') || shaderSource.includes('dFdy') || shaderSource.includes('fwidth'))) {
                var ext = getExtension(composer, OES_STANDARD_DERIVATIVES, true);
                if (ext)
                    this._extensions = '#extension GL_OES_standard_derivatives : enable\n';
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
            var _a = this, _composer = _a._composer, name = _a.name, _fragmentShaderSource = _a._fragmentShaderSource, _compileTimeConstants = _a._compileTimeConstants, _extensions = _a._extensions;
            var gl = _composer.gl, _errorCallback = _composer._errorCallback, verboseLogging = _composer.verboseLogging, glslVersion = _composer.glslVersion, floatPrecision = _composer.floatPrecision, intPrecision = _composer.intPrecision;
            // Update compile time constants.
            var keys = Object.keys(internalCompileTimeConstants);
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                _compileTimeConstants[key] = internalCompileTimeConstants[key];
            }
            if (verboseLogging)
                console.log("Compiling fragment shader for GPUProgram \"".concat(name, "\" with compile time constants: ").concat(JSON.stringify(_compileTimeConstants)));
            var shader = compileShader(gl, glslVersion, intPrecision, floatPrecision, _fragmentShaderSource, gl.FRAGMENT_SHADER, name, _errorCallback, _compileTimeConstants, _extensions, Object.keys(_fragmentShaders).length === 0);
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
                var wrapXVal = wrapX === _internalWrapX ? 0 : (wrapX === REPEAT ? 1 : 0);
                var wrapYVal = wrapY === _internalWrapY ? 0 : (wrapY === REPEAT ? 1 : 0);
                var filterVal = filter === _internalFilter ? 0 : (filter === LINEAR ? 1 : 0);
                fragmentID += "_IN".concat(i, "_").concat(wrapXVal, "_").concat(wrapYVal, "_").concat(filterVal);
                fragmentCompileConstants["".concat(SAMPLER2D_WRAP_X).concat(i)] = "".concat(wrapXVal);
                fragmentCompileConstants["".concat(SAMPLER2D_WRAP_Y).concat(i)] = "".concat(wrapYVal);
                fragmentCompileConstants["".concat(SAMPLER2D_FILTER).concat(i)] = "".concat(filterVal);
                if (_composer.glslVersion === GLSL1 && isIntType(type)) {
                    fragmentCompileConstants["".concat(SAMPLER2D_CAST_INT).concat(i)] = '1';
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
            var program = initGLProgram(gl, vertexShader, fragmentShader, this.name, _errorCallback);
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
            var isGLSL3 = glslVersion === GLSL3;
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
                if (type === BOOL_1D_UNIFORM || type === BOOL_2D_UNIFORM || type === BOOL_3D_UNIFORM || type === BOOL_4D_UNIFORM) {
                    if (!typeChecksExports.isBoolean(uniform) && uniform.constructor !== Array) {
                        badType = true;
                    }
                }
                else if (type === FLOAT_1D_UNIFORM || type === FLOAT_2D_UNIFORM || type === FLOAT_3D_UNIFORM || type === FLOAT_4D_UNIFORM) {
                    if (!typeChecksExports.isFiniteNumber(uniform) && uniform.constructor !== Float32Array) {
                        badType = true;
                    }
                }
                else if (type === INT_1D_UNIFORM || type === INT_2D_UNIFORM || type === INT_3D_UNIFORM || type === INT_4D_UNIFORM) {
                    if (!typeChecksExports.isInteger(uniform) && uniform.constructor !== Int32Array) {
                        badType = true;
                    }
                }
                else if (type === UINT_1D_UNIFORM || type === UINT_2D_UNIFORM || type === UINT_3D_UNIFORM || type === UINT_4D_UNIFORM) {
                    if (!isGLSL3) {
                        // GLSL1 does not have uint type, expect int instead.
                        if (!typeChecksExports.isNonNegativeInteger(uniform) && uniform.constructor !== Int32Array) {
                            badType = true;
                        }
                    }
                    else if (!typeChecksExports.isNonNegativeInteger(uniform) && uniform.constructor !== Uint32Array) {
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
                case BOOL_1D_UNIFORM:
                    gl.uniform1i(location, value ? 1 : 0);
                    break;
                case BOOL_2D_UNIFORM:
                    gl.uniform2i(location, value[0] ? 1 : 0, value[1] ? 1 : 0);
                    break;
                case BOOL_3D_UNIFORM:
                    gl.uniform3i(location, value[0] ? 1 : 0, value[1] ? 1 : 0, value[2] ? 1 : 0);
                    break;
                case BOOL_4D_UNIFORM:
                    gl.uniform4i(location, value[0] ? 1 : 0, value[1] ? 1 : 0, value[2] ? 1 : 0, value[3] ? 1 : 0);
                    break;
                case FLOAT_1D_UNIFORM:
                    gl.uniform1f(location, value);
                    break;
                case FLOAT_2D_UNIFORM:
                    gl.uniform2fv(location, value);
                    break;
                case FLOAT_3D_UNIFORM:
                    gl.uniform3fv(location, value);
                    break;
                case FLOAT_4D_UNIFORM:
                    gl.uniform4fv(location, value);
                    break;
                case INT_1D_UNIFORM:
                    gl.uniform1i(location, value);
                    break;
                case INT_2D_UNIFORM:
                    gl.uniform2iv(location, value);
                    break;
                case INT_3D_UNIFORM:
                    gl.uniform3iv(location, value);
                    break;
                case INT_4D_UNIFORM:
                    gl.uniform4iv(location, value);
                    break;
                // Uint not supported in GLSL1, use int instead.
                case UINT_1D_UNIFORM:
                    if (isGLSL3)
                        gl.uniform1ui(location, value);
                    else
                        gl.uniform1i(location, value);
                    break;
                case UINT_2D_UNIFORM:
                    if (isGLSL3)
                        gl.uniform2uiv(location, value);
                    else
                        gl.uniform2iv(location, value);
                    break;
                case UINT_3D_UNIFORM:
                    if (isGLSL3)
                        gl.uniform3uiv(location, value);
                    else
                        gl.uniform3iv(location, value);
                    break;
                case UINT_4D_UNIFORM:
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
                _uniforms[name] = { location: new WeakMap(), value: typeChecksExports.isArray(value) ? value.slice() : value, type: type };
                return true;
            }
            var oldValue = uniform.value;
            // Update value with a deep copy of input.
            uniform.value = typeChecksExports.isArray(value) ? value.slice() : value;
            // Deep check if value has changed.
            if (typeChecksExports.isArray(value)) {
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
         * @param type - Uniform type.
         */
        GPUProgram.prototype.setUniform = function (name, value, type) {
            var _a;
            var _b = this, _programs = _b._programs, _uniforms = _b._uniforms, _composer = _b._composer, _samplerUniformsIndices = _b._samplerUniformsIndices;
            var verboseLogging = _composer.verboseLogging, gl = _composer.gl;
            // Check that length of value is correct.
            if (typeChecksExports.isArray(value)) {
                var length_3 = value.length;
                if (length_3 > 4)
                    throw new Error("Invalid uniform value: [".concat(value.join(', '), "] passed to GPUProgram \"").concat(this.name, ", uniforms must be of type number[] with length <= 4, number, or boolean.\""));
            }
            // Get uniform internal type.
            var currentType = (_a = _uniforms[name]) === null || _a === void 0 ? void 0 : _a.type;
            if (type) {
                var internalType = uniformInternalTypeForValue(value, type, name, this.name);
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
            // Cache user-defined sampler uniform values.
            var samplerUniform = _samplerUniformsIndices.find(function (uniform) { return uniform.name === name; });
            if (samplerUniform && typeChecksExports.isInteger(value)) {
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
            var indexLookup = new Array(Math.max(input.length, _samplerUniformsIndices.length)).fill(-1);
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
                    var halfPxUniform = "".concat(SAMPLER2D_HALF_PX_UNIFORM).concat(index);
                    var halfPxUniformChanged = this._cacheUniformValue(halfPxUniform, halfPxSize, FLOAT_2D_UNIFORM);
                    if (halfPxUniformChanged) {
                        this._setProgramUniform(program, halfPxUniform, halfPxSize, FLOAT_2D_UNIFORM);
                    }
                    if (filterMismatch) {
                        var dimensions = [width, height];
                        var dimensionsUniform = "".concat(SAMPLER2D_DIMENSIONS_UNIFORM).concat(index);
                        var dimensionsUniformChanged = this._cacheUniformValue(dimensionsUniform, dimensions, FLOAT_2D_UNIFORM);
                        if (dimensionsUniformChanged) {
                            this._setProgramUniform(program, dimensionsUniform, dimensions, FLOAT_2D_UNIFORM);
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
            var internalType = uniformInternalTypeForValue(value, type, uniformName, this.name);
            // const changed = this._cacheUniformValue(uniformName, value, internalType);
            // Don't cache vertex uniforms for now.
            // TODO: cached vertex uniforms need to be stored per WebGLProgram.
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
            delete this._extensions;
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
    function copyProgram$1(composer, params) {
        var type = params.type;
        var precision = params.precision || '';
        var glslType = glslTypeForType(type, 4);
        var name = params.name || "copy_".concat(uniformTypeForType(type, composer.glslVersion), "_layer");
        return new GPUProgram(composer, {
            name: name,
            fragmentShader: "\nin vec2 v_uv;\nuniform ".concat(precision, " ").concat(glslPrefixForType(type), "sampler2D u_state;\nout ").concat(precision, " ").concat(glslType, " out_result;\nvoid main() {\n\tout_result = texture(u_state, v_uv);\n}"),
            uniforms: [
                {
                    name: 'u_state',
                    value: 0,
                    type: INT,
                },
            ],
        });
    }
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
    function addLayersProgram$1(composer, params) {
        var type = params.type;
        var numInputs = params.numInputs || 2;
        var precision = params.precision || '';
        var components = params.components || 'xyzw';
        var glslType = glslTypeForType(type, components.length);
        var arrayOfLengthNumInputs = new Array(numInputs);
        var name = params.name || "".concat(numInputs, "-way_add_").concat(uniformTypeForType(type, composer.glslVersion), "_").concat(components);
        return new GPUProgram(composer, {
            name: name,
            fragmentShader: "\nin vec2 v_uv;\n".concat(arrayOfLengthNumInputs.map(function (el, i) { return "uniform ".concat(precision, " ").concat(glslPrefixForType(type), "sampler2D u_state").concat(i, ";"); }).join('\n'), "\nout ").concat(precision, " ").concat(glslType, " out_result;\nvoid main() {\n\tout_result = ").concat(arrayOfLengthNumInputs.map(function (el, i) { return "texture(u_state".concat(i, ", v_uv).").concat(components); }).join(' + '), ";\n}"),
            uniforms: arrayOfLengthNumInputs.map(function (el, i) {
                return {
                    name: "u_state".concat(i),
                    value: i,
                    type: INT,
                };
            }),
        });
    }
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
    function addValueProgram$1(composer, params) {
        var type = params.type, value = params.value;
        var precision = params.precision || '';
        var valueLength = typeChecksExports.isArray(value) ? value.length : 1;
        var valueType = glslTypeForType(type, valueLength);
        var numComponents = valueLength === 1 ? 4 : valueLength;
        var outputType = glslTypeForType(type, numComponents);
        var componentSelection = glslComponentSelectionForNumComponents(numComponents);
        var name = params.name || "addValue_".concat(valueType, "_w_length_").concat(valueLength);
        return new GPUProgram(composer, {
            name: name,
            fragmentShader: "\nin vec2 v_uv;\nuniform ".concat(precision, " ").concat(valueType, " u_value;\nuniform ").concat(precision, " ").concat(glslPrefixForType(type), "sampler2D u_state;\nout ").concat(precision, " ").concat(outputType, " out_result;\nvoid main() {\n\tout_result = ").concat(valueType !== outputType ? outputType : '', "(u_value) + texture(u_state, v_uv)").concat(componentSelection, ";\n}"),
            uniforms: [
                {
                    name: 'u_state',
                    value: 0,
                    type: INT,
                },
                {
                    name: 'u_value',
                    value: value,
                    type: uniformTypeForType(type, composer.glslVersion),
                },
            ],
        });
    }
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
    function multiplyValueProgram$1(composer, params) {
        var type = params.type, value = params.value;
        var precision = params.precision || '';
        var valueLength = typeChecksExports.isArray(value) ? value.length : 1;
        var valueType = glslTypeForType(type, valueLength);
        var numComponents = valueLength === 1 ? 4 : valueLength;
        var outputType = glslTypeForType(type, numComponents);
        var componentSelection = glslComponentSelectionForNumComponents(numComponents);
        var name = params.name || "addValue_".concat(valueType, "_w_length_").concat(valueLength);
        return new GPUProgram(composer, {
            name: name,
            fragmentShader: "\nin vec2 v_uv;\nuniform ".concat(precision, " ").concat(valueType, " u_value;\nuniform ").concat(precision, " ").concat(glslPrefixForType(type), "sampler2D u_state;\nout ").concat(precision, " ").concat(outputType, " out_result;\nvoid main() {\n\tout_result = ").concat(valueType !== outputType ? outputType : '', "(u_value) * texture(u_state, v_uv)").concat(componentSelection, ";\n}"),
            uniforms: [
                {
                    name: 'u_state',
                    value: 0,
                    type: INT,
                },
                {
                    name: 'u_value',
                    value: value,
                    type: uniformTypeForType(type, composer.glslVersion),
                },
            ],
        });
    }
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
    function setValueProgram$1(composer, params) {
        var type = params.type, value = params.value;
        var precision = params.precision || '';
        var valueLength = typeChecksExports.isArray(value) ? value.length : 1;
        var valueType = glslTypeForType(type, valueLength);
        var numComponents = valueLength === 1 ? 4 : valueLength;
        var outputType = glslTypeForType(type, numComponents);
        var name = params.name || "setValue_".concat(valueType, "_w_length_").concat(valueLength);
        return new GPUProgram(composer, {
            name: name,
            fragmentShader: "\nuniform ".concat(precision, " ").concat(valueType, " u_value;\nout ").concat(precision, " ").concat(outputType, " out_result;\nvoid main() {\n\tout_result = ").concat(valueType !== outputType ? outputType : '', "(u_value);\n}"),
            uniforms: [
                {
                    name: 'u_value',
                    value: value,
                    type: uniformTypeForType(type, composer.glslVersion),
                },
            ],
        });
    }
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
    function setColorProgram$1(composer, params) {
        var type = params.type;
        var precision = params.precision || '';
        var opacity = params.opacity === undefined ? 1 : params.opacity;
        var color = params.color || [0, 0, 0];
        var name = params.name || "setColor";
        var glslType = glslTypeForType(type, 4);
        return new GPUProgram(composer, {
            name: name,
            fragmentShader: "\nuniform ".concat(precision, " vec3 u_color;\nuniform ").concat(precision, " float u_opacity;\nout ").concat(precision, " ").concat(glslType, " out_result;\nvoid main() {\n\tout_result = ").concat(glslType, "(u_color, u_opacity);\n}"),
            uniforms: [
                {
                    name: 'u_color',
                    value: color,
                    type: FLOAT,
                },
                {
                    name: 'u_opacity',
                    value: opacity,
                    type: FLOAT,
                },
            ],
        });
    }
    /**
     * Init GPUProgram to zero output GPULayer.
     * @category GPUProgram Helper
     * @param composer - The current GPUComposer.
     * @param params - Program parameters.
     * @param params.name - Optionally pass in a GPUProgram name, used for error logging.
     * @returns
     */
    function zeroProgram$1(composer, params) {
        return setValueProgram$1(composer, {
            type: FLOAT,
            value: 0,
            name: params.name,
        });
    }
    /**
     * Init GPUProgram to render 3 component GPULayer as RGB.
     * @category GPUProgram Helper
     * @param composer - The current GPUComposer.
     * @param params - Program parameters.
     * @param params.type - The type of the input.
     * @param params.name - Optionally pass in a GPUProgram name, used for error logging.
     * @param params.scale - Scaling factor, defaults to 1.  Change this later using uniform "u_scale".
     * @param params.opacity - Opacity, defaults to 1.  Change this later using uniform "u_opacity".
     * @param params.precision - Optionally specify the precision of the input.
     * @returns
     */
    function renderRGBProgram$1(composer, params) {
        var type = params.type;
        var precision = params.precision || '';
        var numComponents = 3;
        var glslType = glslTypeForType(type, numComponents);
        var glslFloatType = glslTypeForType(FLOAT, numComponents);
        var glslPrefix = glslPrefixForType(type);
        var shouldCast = glslFloatType === glslType;
        var name = params.name || "renderRGB_".concat(glslType);
        return new GPUProgram(composer, {
            name: name,
            fragmentShader: "\nin vec2 v_uv;\nuniform float u_opacity;\nuniform float u_scale;\nuniform ".concat(precision, " ").concat(glslPrefix, "sampler2D u_state;\nout vec4 out_result;\nvoid main() {\n\tvec3 color = u_scale * (").concat(shouldCast ? '' : glslFloatType, "(texture(u_state, v_uv).rgb));\n\tout_result = vec4(color, u_opacity);\n}"),
            uniforms: [
                {
                    name: 'u_state',
                    value: 0,
                    type: INT,
                },
                {
                    name: 'u_scale',
                    value: params.scale !== undefined ? params.scale : 1,
                    type: FLOAT,
                },
                {
                    name: 'u_opacity',
                    value: params.opacity !== undefined ? params.opacity : 1,
                    type: FLOAT,
                },
            ],
        });
    }
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
     * @param params.colorMax - RGB color for amplitude === scale, scaled to [0,1] range, defaults to white.  Change this later using uniform "u_colorMax".
     * @param params.colorMin - RGB color for amplitude === 0, scaled to [0,1] range, defaults to black.  Change this later using uniform "u_colorMin".
     * @param params.precision - Optionally specify the precision of the input.
     * @returns
     */
    function renderAmplitudeProgram$1(composer, params) {
        var type = params.type;
        var precision = params.precision || '';
        var components = params.components || 'xyzw';
        var numComponents = components.length;
        var glslType = glslTypeForType(type, numComponents);
        var glslFloatType = glslTypeForType(FLOAT, numComponents);
        var glslPrefix = glslPrefixForType(type);
        var shouldCast = glslFloatType === glslType;
        var name = params.name || "renderAmplitude_".concat(glslType, "_w_").concat(numComponents, "_components");
        return new GPUProgram(composer, {
            name: name,
            fragmentShader: "\nin vec2 v_uv;\nuniform float u_opacity;\nuniform float u_scale;\nuniform vec3 u_colorMax;\nuniform vec3 u_colorMin;\nuniform ".concat(precision, " ").concat(glslPrefix, "sampler2D u_state;\nout vec4 out_result;\nvoid main() {\n\tfloat amplitude = u_scale * ").concat(numComponents === 1 ? 'abs' : 'length', "(").concat(shouldCast ? '' : glslFloatType, "(texture(u_state, v_uv)").concat(components === 'xyzw' || components === 'rgba' || components === 'stpq' ? '' : ".".concat(components), "));\n\tvec3 color = mix(u_colorMin, u_colorMax, amplitude);\n\tout_result = vec4(color, u_opacity);\n}"),
            uniforms: [
                {
                    name: 'u_state',
                    value: 0,
                    type: INT,
                },
                {
                    name: 'u_scale',
                    value: params.scale !== undefined ? params.scale : 1,
                    type: FLOAT,
                },
                {
                    name: 'u_opacity',
                    value: params.opacity !== undefined ? params.opacity : 1,
                    type: FLOAT,
                },
                {
                    name: 'u_colorMax',
                    value: params.colorMax || [1, 1, 1],
                    type: FLOAT,
                },
                {
                    name: 'u_colorMin',
                    value: params.colorMin || [0, 0, 0],
                    type: FLOAT,
                },
            ],
        });
    }
    /**
     * Init GPUProgram to render signed amplitude of an input GPULayer to linearly interpolated colors.
     * @category GPUProgram Helper
     * @param composer - The current GPUComposer.
     * @param params - Program parameters.
     * @param params.type - The type of the input.
     * @param params.name - Optionally pass in a GPUProgram name, used for error logging.
     * @param params.scale - Scaling factor, defaults to 1.  Change this later using uniform "u_scale".
     * @param params.bias - Bias for center point of color range, defaults to 0.  Change this later using uniform "u_bias".
     * @param params.opacity - Opacity, defaults to 1.  Change this later using uniform "u_opacity".
     * @param params.colorMax - RGB color for amplitude === bias + scale, scaled to [0,1] range, defaults to red.  Change this later using uniform "u_colorMax".
     * @param params.colorMin - RGB color for amplitude === bias + scale, scaled to [0,1] range, defaults to blue.  Change this later using uniform "u_colorMin".
     * @param params.colorCenter - RGB color for amplitude === bias, scaled to [0,1] range, defaults to white.  Change this later using uniform "u_colorCenter".
     * @param params.component - Component of input GPULayer to render, defaults to "x".
     * @param params.precision - Optionally specify the precision of the input.
     * @returns
     */
    function renderSignedAmplitudeProgram$1(composer, params) {
        var type = params.type;
        var precision = params.precision || '';
        var glslType = glslTypeForType(type, 1);
        var glslPrefix = glslPrefixForType(type);
        var castFloat = glslType === 'float';
        var component = params.component || 'x';
        var name = params.name || "renderAmplitude_".concat(glslType, "_").concat(component);
        return new GPUProgram(composer, {
            name: name,
            fragmentShader: "\nin vec2 v_uv;\nuniform float u_opacity;\nuniform float u_scale;\nuniform float u_bias;\nuniform vec3 u_colorMin;\nuniform vec3 u_colorMax;\nuniform vec3 u_colorCenter;\nuniform ".concat(precision, " ").concat(glslPrefix, "sampler2D u_state;\nout vec4 out_result;\nvoid main() {\n\tfloat signedAmplitude = u_scale * (").concat(castFloat ? '' : 'float', "(texture(u_state, v_uv).").concat(component, ") - u_bias);\n\tfloat amplitudeSign = sign(signedAmplitude);\n\tvec3 interpColor = mix(u_colorMin, u_colorMax, amplitudeSign / 2.0 + 0.5);\n\tvec3 color = mix(u_colorCenter, interpColor, signedAmplitude * amplitudeSign);\n\tout_result = vec4(color, u_opacity);\n}"),
            uniforms: [
                {
                    name: 'u_state',
                    value: 0,
                    type: INT,
                },
                {
                    name: 'u_scale',
                    value: params.scale !== undefined ? params.scale : 1,
                    type: FLOAT,
                },
                {
                    name: 'u_bias',
                    value: params.bias || 0,
                    type: FLOAT,
                },
                {
                    name: 'u_opacity',
                    value: params.opacity !== undefined ? params.opacity : 1,
                    type: FLOAT,
                },
                {
                    name: 'u_colorMin',
                    value: params.colorMin || [0, 0, 1],
                    type: FLOAT,
                },
                {
                    name: 'u_colorMax',
                    value: params.colorMax || [1, 0, 0],
                    type: FLOAT,
                },
                {
                    name: 'u_colorCenter',
                    value: params.colorCenter || [1, 1, 1],
                    type: FLOAT,
                },
            ],
        });
    }

    var GPUComposer = /** @class */ (function () {
        /**
         * Create a GPUComposer.
         * @param params - GPUComposer parameters.
         * @param params.canvas - HTMLCanvasElement associated with this GPUComposer (you must add to DOM yourself).
         * @param params.context - Pass in a WebGL context for the GPUComposer to user.
         * @param params.contextID - Set the contextID to use when initing a new WebGL context.
         * @param params.contextAttributes - Options to pass to WebGL context on initialization (see https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext for more information).
         * @param params.glslVersion - Set the GLSL version to use, defaults to GLSL3 for WebGL2 contexts.
         * @param params.intPrecision - Set the global integer precision in shader programs.
         * @param params.floatPrecision - Set the global float precision in shader programs.
         * @param params.clearValue - Value to write to canvas when GPUComposer.clear() is called.
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
            // Value to set when clear() is called, defaults to zero.
            // Access with GPUComposer.clearValue.
            this._clearValue = 0;
            /**
             * Cache some generic programs for copying data.
             * These are needed for rendering partial screen geometries.
             */
            this._copyPrograms = {};
            // Other util programs.
            /**
             * Cache some generic programs for setting value from uniform.
             * These are used by GOUComposer.clear() and GPULayer.clear(), among other things
             */
            this._setValuePrograms = {};
            /**
             * Vertex shaders are shared across all GPUProgram instances.
             * @private
             */
            this._vertexShaders = (_a = {},
                _a[DEFAULT_PROGRAM_NAME] = {
                    src: DEFAULT_VERT_SHADER_SOURCE,
                    compiledShaders: {},
                },
                _a[SEGMENT_PROGRAM_NAME] = {
                    src: SEGMENT_VERTEX_SHADER_SOURCE,
                    compiledShaders: {},
                },
                _a[LAYER_POINTS_PROGRAM_NAME] = {
                    src: LAYER_POINTS_VERTEX_SHADER_SOURCE,
                    compiledShaders: {},
                },
                _a[LAYER_VECTOR_FIELD_PROGRAM_NAME] = {
                    src: LAYER_VECTOR_FIELD_VERTEX_SHADER_SOURCE,
                    compiledShaders: {},
                },
                _a[LAYER_LINES_PROGRAM_NAME] = {
                    src: LAYER_LINES_VERTEX_SHADER_SOURCE,
                    compiledShaders: {},
                },
                _a[LAYER_MESH_PROGRAM_NAME] = {
                    src: LAYER_MESH_VERTEX_SHADER_SOURCE,
                    compiledShaders: {},
                },
                _a);
            /**
             * Flag to set GPUComposer for verbose logging, defaults to false.
             */
            this.verboseLogging = false;
            this._numTicks = 0;
            // Check params.
            var validKeys = ['canvas', 'context', 'contextID', 'contextAttributes', 'glslVersion', 'intPrecision', 'floatPrecision', 'clearValue', 'verboseLogging', 'errorCallback'];
            var requiredKeys = ['canvas'];
            var keys = Object.keys(params);
            checkValidKeys(keys, validKeys, 'GPUComposer(params)');
            checkRequiredKeys(keys, requiredKeys, 'GPUComposer(params)');
            if (params.verboseLogging !== undefined)
                this.verboseLogging = params.verboseLogging;
            // Save callback in case we run into an error.
            var self = this;
            this._errorCallback = function (message) {
                if (self._errorState) {
                    return;
                }
                self._errorState = true;
                params.errorCallback ? params.errorCallback(message) : DEFAULT_ERROR_CALLBACK(message);
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
                    var _gl = canvas.getContext(WEBGL2, params.contextAttributes)
                        || canvas.getContext(WEBGL1, params.contextAttributes)
                        || canvas.getContext(EXPERIMENTAL_WEBGL2, params.contextAttributes)
                        || canvas.getContext(EXPERIMENTAL_WEBGL, params.contextAttributes);
                    if (_gl) {
                        gl = _gl;
                    }
                }
                if (!gl) {
                    this._errorCallback('Unable to initialize WebGL context.');
                    return;
                }
            }
            this.isWebGL2 = isWebGL2$1(gl);
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
            var glslVersion = params.glslVersion || (this.isWebGL2 ? GLSL3 : GLSL1);
            if (!this.isWebGL2 && glslVersion === GLSL3) {
                console.warn('GLSL3.x is incompatible with WebGL1.0 contexts, falling back to GLSL1.');
                glslVersion = GLSL1; // Fall back to GLSL1 in these cases.
            }
            this.glslVersion = glslVersion;
            // Set default int/float precision.
            this.intPrecision = params.intPrecision || PRECISION_HIGH_P;
            this.floatPrecision = params.floatPrecision || PRECISION_HIGH_P;
            // GL setup.
            // Disable depth testing globally.
            gl.disable(gl.DEPTH_TEST);
            // Set unpack alignment to 1 so we can have textures of arbitrary dimensions.
            // https://stackoverflow.com/questions/51582282/error-when-creating-textures-in-webgl-with-the-rgb-format
            gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
            // Unbind active buffer.
            if (this.isWebGL2)
                gl.bindVertexArray(null);
            else {
                var ext = getExtension(this, OES_VERTEX_ARRAY_OBJECT, true);
                ext.bindVertexArrayOES(null);
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            if (params.clearValue !== undefined) {
                this.clearValue = params.clearValue;
            }
            // Canvas setup.
            this.resize([canvas.clientWidth, canvas.clientHeight]);
            if (this.verboseLogging) {
                // Log number of textures available.
                console.log("".concat(this.gl.getParameter(this.gl.MAX_TEXTURE_IMAGE_UNITS), " textures max."));
            }
        }
        /**
         * Create a GPUComposer from an existing THREE.WebGLRenderer that shares a single WebGL context.
         * @param renderer - Threejs WebGLRenderer.
         * @param params - GPUComposer parameters.
         * @param params.glslVersion - Set the GLSL version to use, defaults to GLSL3 for WebGL2 contexts.
         * @param params.intPrecision - Set the global integer precision in shader programs.
         * @param params.floatPrecision - Set the global float precision in shader programs.
         * @param params.clearValue - Value to write to canvas when GPUComposer.clear() is called.
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
         * Used for GPUComposer.clear() and GPULayer.clear(), among other things.
         * @private
         */
        GPUComposer.prototype._setValueProgramForType = function (type) {
            var _setValuePrograms = this._setValuePrograms;
            var key = uniformTypeForType(type, this.glslVersion);
            if (_setValuePrograms[key] === undefined) {
                _setValuePrograms[key] = setValueProgram$1(this, { type: type, value: [0, 0, 0, 0] });
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
            var key = uniformTypeForType(type, this.glslVersion);
            if (_copyPrograms[key] === undefined) {
                _copyPrograms[key] = copyProgram$1(this, { type: type });
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
            else {
                var ext = getExtension(this, OES_VERTEX_ARRAY_OBJECT, true);
                ext.bindVertexArrayOES(null);
            }
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
            var clone = new GPULayer(this, {
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
                var preprocessedSrc = preprocessVertexShader(src, glslVersion);
                var shader = compileShader(gl, glslVersion, intPrecision, floatPrecision, preprocessedSrc, gl.VERTEX_SHADER, programName, _errorCallback, vertexCompileConstants, undefined, true);
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
            if (!typeChecksExports.isNonNegativeInteger(width) || !typeChecksExports.isNonNegativeInteger(height)) {
                if (!typeChecksExports.isArray(dimensions))
                    throw new Error("Invalid dimensions parameter supplied to GPUComposer.resize(), expected dimensions array of length 2, got: ".concat(JSON.stringify(dimensions)));
                else
                    throw new Error("Invalid dimensions parameter supplied to GPUComposer.resize(), expected positive integers, got: ".concat(width, ", ").concat(height));
            }
            // Set correct canvas pixel size.
            // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/By_example/Canvas_size_and_WebGL
            canvas.width = width;
            canvas.height = height;
            // Save dimensions.
            this._width = width;
            this._height = height;
        };
        /**
         * Set inputs and outputs in preparation for draw call.
         * @private
         */
        GPUComposer.prototype._drawSetup = function (gpuProgram, programName, vertexCompileConstants, fullscreenRender, input, output) {
            var gl = this.gl;
            // CAUTION: the order of these next few lines is important.
            // Get a shallow copy of current textures.
            // This line must come before this._setOutputLayer() as it depends on current internal state.
            var inputTextures = [];
            if (input) {
                if (input.layer) {
                    inputTextures.push(input);
                }
                else if (input.constructor === GPULayer) {
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
            if (typeChecksExports.isArray(input)) {
                // Return input with layer added if needed.
                if (indexOfLayerInArray(layer, input) >= 0) {
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
            var outputArray = (typeChecksExports.isArray(output) ? output : [output]);
            for (var i = 0, numOutputs = outputArray.length; i < numOutputs; i++) {
                var outputLayer = outputArray[i];
                // Check if output is same as one of input layers.
                if (input && ((input === output || input.layer === output) ||
                    (typeChecksExports.isArray(input) && indexOfLayerInArray(outputLayer, input) >= 0))) {
                    if (outputLayer.numBuffers === 1) {
                        throw new Error("Cannot use same buffer \"".concat(outputLayer.name, "\" for input and output of a program. Try increasing the number of buffers in your output layer to at least 2 so you can render to nextState using currentState as an input."));
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
            bindFrameBuffer(this, layer0, layer0._currentTexture, additionalTextures);
            // Tell WebGL to draw to output textures.
            if (isWebGL2) {
                gl.drawBuffers(drawBuffers);
            }
            // Resize viewport.
            var _c = this._widthHeightForOutput(programName, output), width = _c.width, height = _c.height;
            gl.viewport(0, 0, width, height);
        };
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
            if (typeChecksExports.isArray(output)) {
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
            if (params.output && typeChecksExports.isArray(params.output) && this.glslVersion === GLSL1) {
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
            // Check params.
            var validKeys = ['program', 'input', 'output', 'blendAlpha'];
            var requiredKeys = ['program'];
            var keys = Object.keys(params);
            checkValidKeys(keys, validKeys, 'GPUComposer.step(params)');
            checkRequiredKeys(keys, requiredKeys, 'GPUComposer.step(params)');
            if (this._iterateOverOutputsIfNeeded(params, 'step'))
                return;
            var _a = this, gl = _a.gl, _errorState = _a._errorState;
            var program = params.program, input = params.input, output = params.output;
            if (_errorState)
                return;
            // Do setup - this must come first.
            var glProgram = this._drawSetup(program, DEFAULT_PROGRAM_NAME, {}, true, input, output);
            // Update uniforms and buffers.
            program._setVertexUniform(glProgram, 'u_gpuio_scale', [1, 1], FLOAT);
            program._setVertexUniform(glProgram, 'u_gpuio_translation', [0, 0], FLOAT);
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
            // Check params.
            var validKeys = ['program', 'input', 'output', 'edges', 'blendAlpha'];
            var requiredKeys = ['program'];
            var keys = Object.keys(params);
            checkValidKeys(keys, validKeys, 'GPUComposer.stepBoundary(params)');
            checkRequiredKeys(keys, requiredKeys, 'GPUComposer.stepBoundary(params)');
            if (this._iterateOverOutputsIfNeeded(params, 'stepBoundary'))
                return;
            var _a = this, gl = _a.gl, _errorState = _a._errorState;
            var program = params.program, input = params.input, output = params.output;
            if (_errorState)
                return;
            var _b = this._widthHeightForOutput(program.name, output), width = _b.width, height = _b.height;
            // Do setup - this must come first.
            var glProgram = this._drawSetup(program, DEFAULT_PROGRAM_NAME, {}, false, input, output);
            // Update uniforms and buffers.
            // Frame needs to be offset and scaled so that all four sides are in viewport.
            var onePx = [1 / width, 1 / height];
            program._setVertexUniform(glProgram, 'u_gpuio_scale', [1 - onePx[0], 1 - onePx[1]], FLOAT);
            program._setVertexUniform(glProgram, 'u_gpuio_translation', onePx, FLOAT);
            gl.bindBuffer(gl.ARRAY_BUFFER, this._getBoundaryPositionsBuffer());
            this._setPositionAttribute(glProgram, program.name);
            // Draw.
            this._setBlendMode(params.blendAlpha);
            if (params.edges) {
                var edges = params.edges;
                if (!typeChecksExports.isArray(edges))
                    edges = [edges];
                for (var i = 0, numEdges = edges.length; i < numEdges; i++) {
                    // TODO: do this in one draw call.
                    var edge = edges[i];
                    if (edge === BOUNDARY_LEFT) {
                        gl.drawArrays(gl.LINES, 3, 2);
                    }
                    if (edge === BOUNDARY_RIGHT) {
                        gl.drawArrays(gl.LINES, 1, 2);
                    }
                    if (edge === BOUNDARY_TOP) {
                        gl.drawArrays(gl.LINES, 2, 2);
                    }
                    if (edge === BOUNDARY_BOTTOM) {
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
            // Check params.
            var validKeys = ['program', 'input', 'output', 'blendAlpha'];
            var requiredKeys = ['program'];
            var keys = Object.keys(params);
            checkValidKeys(keys, validKeys, 'GPUComposer.stepNonBoundary(params)');
            checkRequiredKeys(keys, requiredKeys, 'GPUComposer.stepNonBoundary(params)');
            if (this._iterateOverOutputsIfNeeded(params, 'stepNonBoundary'))
                return;
            var _a = this, gl = _a.gl, _errorState = _a._errorState;
            var program = params.program, input = params.input, output = params.output;
            if (_errorState)
                return;
            var _b = this._widthHeightForOutput(program.name, output), width = _b.width, height = _b.height;
            // Do setup - this must come first.
            var glProgram = this._drawSetup(program, DEFAULT_PROGRAM_NAME, {}, false, input, output);
            // Update uniforms and buffers.
            var onePx = [1 / width, 1 / height];
            program._setVertexUniform(glProgram, 'u_gpuio_scale', [1 - 2 * onePx[0], 1 - 2 * onePx[1]], FLOAT);
            program._setVertexUniform(glProgram, 'u_gpuio_translation', onePx, FLOAT);
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
            // Check params.
            var validKeys = ['program', 'position', 'diameter', 'useOutputScale', 'input', 'output', 'numSegments', 'blendAlpha'];
            var requiredKeys = ['program', 'position', 'diameter'];
            var keys = Object.keys(params);
            checkValidKeys(keys, validKeys, 'GPUComposer.stepCircle(params)');
            checkRequiredKeys(keys, requiredKeys, 'GPUComposer.stepCircle(params)');
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
            var glProgram = this._drawSetup(program, DEFAULT_PROGRAM_NAME, {}, false, input, output);
            // Update uniforms and buffers.
            program._setVertexUniform(glProgram, 'u_gpuio_scale', [diameter / width, diameter / height], FLOAT);
            program._setVertexUniform(glProgram, 'u_gpuio_translation', [2 * position[0] / width - 1, 2 * position[1] / height - 1], FLOAT);
            var numSegments = params.numSegments ? params.numSegments : DEFAULT_CIRCLE_NUM_SEGMENTS;
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
            // Check params.
            var validKeys = ['program', 'position1', 'position2', 'thickness', 'useOutputScale', 'input', 'output', 'endCaps', 'numCapSegments', 'blendAlpha'];
            var requiredKeys = ['program', 'position1', 'position2', 'thickness'];
            var keys = Object.keys(params);
            checkValidKeys(keys, validKeys, 'GPUComposer.stepSegment(params)');
            checkRequiredKeys(keys, requiredKeys, 'GPUComposer.stepSegment(params)');
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
            var glProgram = this._drawSetup(program, SEGMENT_PROGRAM_NAME, {}, false, input, output);
            // Update uniforms and buffers.
            program._setVertexUniform(glProgram, 'u_gpuio_halfThickness', thickness / 2, FLOAT);
            program._setVertexUniform(glProgram, 'u_gpuio_scale', [2 / width, 2 / height], FLOAT);
            var diffX = position1[0] - position2[0];
            var diffY = position1[1] - position2[1];
            var angle = Math.atan2(diffY, diffX);
            program._setVertexUniform(glProgram, 'u_gpuio_rotation', angle, FLOAT);
            var centerX = (position1[0] + position2[0]) / 2;
            var centerY = (position1[1] + position2[1]) / 2;
            program._setVertexUniform(glProgram, 'u_gpuio_translation', [2 * centerX / width - 1, 2 * centerY / height - 1], FLOAT);
            var length = Math.sqrt(diffX * diffX + diffY * diffY);
            var numSegments = params.numCapSegments ? params.numCapSegments * 2 : DEFAULT_CIRCLE_NUM_SEGMENTS;
            if (params.endCaps) {
                if (numSegments < 6 || numSegments % 6 !== 0) {
                    throw new Error("numCapSegments for GPUComposer.stepSegment must be divisible by 3, got ".concat(numSegments / 2, "."));
                }
                program._setVertexUniform(glProgram, 'u_gpuio_length', length, FLOAT);
                gl.bindBuffer(gl.ARRAY_BUFFER, this._getCirclePositionsBuffer(numSegments));
            }
            else {
                // u_gpuio_length + thickness = length, bc we are stretching a square of size thickness into a rectangle.
                program._setVertexUniform(glProgram, 'u_gpuio_length', length - thickness, FLOAT);
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
            // Check params.
            var validKeys = ['program', 'position', 'size', 'useOutputScale', 'input', 'output', 'blendAlpha'];
            var requiredKeys = ['program', 'position', 'size'];
            var keys = Object.keys(params);
            checkValidKeys(keys, validKeys, 'GPUComposer.stepRect(params)');
            checkRequiredKeys(keys, requiredKeys, 'GPUComposer.stepRect(params)');
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
        // // Check params.
        // const validKeys = ['program', 'positions', 'thickness', 'input', 'output', 'closeLoop', 'includeUVs', 'includeNormals', 'blendAlpha'];
        // const requiredKeys = ['program', 'positions', 'thickness'];
        // const keys = Object.keys(params);
        // checkValidKeys(keys, validKeys, 'GPUComposer.stepPolyline(params)');
        // checkRequiredKeys(keys, requiredKeys, 'GPUComposer.stepPolyline(params)');
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
         * @param params.useOutputScale - If true position and pointSize are scaled relative to the output dimensions, else they are scaled relative to the current canvas size, defaults to false.
         * @param params.count - How many points to draw, defaults to positions.length.
         * @param params.color - (If no program passed in) RGB color in range [0, 1] to draw points.
         * @param params.wrapX - Wrap points positions in X, defaults to false.
         * @param params.wrapY - Wrap points positions in Y, defaults to false.
         * @param params.blendAlpha - Blend mode for draw, defaults to false.
         * @returns
         */
        GPUComposer.prototype.drawLayerAsPoints = function (params) {
            var _a;
            var validKeys = ['layer', 'program', 'input', 'output', 'pointSize', 'useOutputScale', 'count', 'color', 'wrapX', 'wrapY', 'blendAlpha'];
            var requiredKeys = ['layer'];
            var keys = Object.keys(params);
            checkValidKeys(keys, validKeys, 'GPUComposer.drawLayerAsPoints(params)');
            checkRequiredKeys(keys, requiredKeys, 'GPUComposer.drawLayerAsPoints(params)');
            if (this._iterateOverOutputsIfNeeded(params, 'drawLayerAsPoints'))
                return;
            var _b = this, gl = _b.gl, _pointIndexArray = _b._pointIndexArray, glslVersion = _b.glslVersion, _errorState = _b._errorState;
            var layer = params.layer, output = params.output;
            if (_errorState)
                return;
            // Check that numPoints is valid.
            if (layer.numComponents !== 2 && layer.numComponents !== 4) {
                throw new Error("GPUComposer.drawLayerAsPoints() must be passed a layer parameter with either 2 or 4 components, got layer \"".concat(layer.name, "\" with ").concat(layer.numComponents, " components."));
            }
            var length = layer.length;
            var count = params.count || length;
            if (count > length) {
                throw new Error("Invalid count ".concat(count, " for layer parameter of length ").concat(length, "."));
            }
            if (glslVersion === GLSL1 && count > MAX_FLOAT_INT) {
                console.warn("Points positions array length: ".concat(count, " is longer than what is supported by GLSL1 : ").concat(MAX_FLOAT_INT, "."));
            }
            var program = params.program;
            if (program === undefined) {
                program = this._setValueProgramForType(FLOAT);
                var color = params.color || [1, 0, 0]; // Default of red.
                if (color.length !== 3)
                    throw new Error("Color parameter must have length 3, got ".concat(JSON.stringify(color), "."));
                program.setUniform('u_value', __spreadArray(__spreadArray([], color, true), [1], false), FLOAT);
            }
            // Add positions to end of input if needed.
            var input = this._addLayerToInputs(layer, params.input);
            var vertexShaderOptions = {};
            // Tell whether we are using an absolute position (2 components),
            // or position with accumulation buffer (4 components, better floating pt accuracy).
            if (layer.numComponents === 4)
                vertexShaderOptions[GPUIO_VS_POSITION_W_ACCUM] = '1';
            if (params.wrapX)
                vertexShaderOptions[GPUIO_VS_WRAP_X] = '1';
            if (params.wrapY)
                vertexShaderOptions[GPUIO_VS_WRAP_Y] = '1';
            // Do setup - this must come first.
            var glProgram = this._drawSetup(program, LAYER_POINTS_PROGRAM_NAME, vertexShaderOptions, false, input, output);
            // Update uniforms and buffers.
            program._setVertexUniform(glProgram, 'u_gpuio_positions', indexOfLayerInArray(layer, input), INT);
            var width = this._width;
            var height = this._height;
            if (params.useOutputScale) {
                (_a = this._widthHeightForOutput(program.name, output), width = _a.width, height = _a.height);
            }
            program._setVertexUniform(glProgram, 'u_gpuio_scale', [1 / width, 1 / height], FLOAT);
            // Set default pointSize.
            var pointSize = params.pointSize || 1;
            program._setVertexUniform(glProgram, 'u_gpuio_pointSize', pointSize, FLOAT);
            var positionLayerDimensions = [layer.width, layer.height];
            program._setVertexUniform(glProgram, 'u_gpuio_positionsDimensions', positionLayerDimensions, FLOAT);
            // We get this for free in GLSL3 with gl_VertexID.
            if (glslVersion === GLSL1) {
                if (this._pointIndexBuffer === undefined || (_pointIndexArray && _pointIndexArray.length < count)) {
                    // Have to use float32 array bc int is not supported as a vertex attribute type.
                    var indices = initSequentialFloatArray(length);
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
        // const validKeys = ['positions', 'indices', 'program', 'input', 'output', 'count', 'color', 'wrapX', 'wrapY', 'closeLoop', 'blendAlpha'];
        // const requiredKeys = ['positions'];
        // const keys = Object.keys(params);
        // checkValidKeys(keys, validKeys, 'GPUComposer.drawLayerAsLines(params)');
        // checkRequiredKeys(keys, requiredKeys, 'GPUComposer.drawLayerAsLines(params)');
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
            var validKeys = ['layer', 'program', 'input', 'output', 'vectorSpacing', 'vectorScale', 'color', 'blendAlpha'];
            var requiredKeys = ['layer'];
            var keys = Object.keys(params);
            checkValidKeys(keys, validKeys, 'GPUComposer.drawLayerAsVectorField(params)');
            checkRequiredKeys(keys, requiredKeys, 'GPUComposer.drawLayerAsVectorField(params)');
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
                program = this._setValueProgramForType(FLOAT);
                var color = params.color || [1, 0, 0]; // Default to red.
                if (color.length !== 3)
                    throw new Error("color parameter must have length 3, got ".concat(JSON.stringify(color), "."));
                program.setUniform('u_value', __spreadArray(__spreadArray([], color, true), [1], false), FLOAT);
            }
            // Add data to end of input if needed.
            var input = this._addLayerToInputs(layer, params.input);
            // Do setup - this must come first.
            var glProgram = this._drawSetup(program, LAYER_VECTOR_FIELD_PROGRAM_NAME, {}, false, input, output);
            // Update uniforms and buffers.
            program._setVertexUniform(glProgram, 'u_gpuio_vectors', indexOfLayerInArray(layer, input), INT);
            // Set default scale.
            var vectorScale = params.vectorScale || 1;
            program._setVertexUniform(glProgram, 'u_gpuio_scale', [vectorScale / _width, vectorScale / _height], FLOAT);
            var vectorSpacing = params.vectorSpacing || 10;
            var spacedDimensions = [Math.floor(_width / vectorSpacing), Math.floor(_height / vectorSpacing)];
            program._setVertexUniform(glProgram, 'u_gpuio_dimensions', spacedDimensions, FLOAT);
            var length = 2 * spacedDimensions[0] * spacedDimensions[1];
            // We get this for free in GLSL3 with gl_VertexID.
            if (glslVersion === GLSL1) {
                if (this._vectorFieldIndexBuffer === undefined || (_vectorFieldIndexArray && _vectorFieldIndexArray.length < length)) {
                    // Have to use float32 array bc int is not supported as a vertex attribute type.
                    var indices = initSequentialFloatArray(length);
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
         * Draw 2D mesh to screen.
         * @param params - Draw parameters.
         * @param params.layer - GPULayer containing vector data.
         * @param params.indices - GPUIndexBuffer containing mesh index data.
         * @param params.program - GPUProgram to run, defaults to drawing vector lines in red.
         * @param params.input - Input GPULayers for GPUProgram.
         * @param params.output - Output GPULayer, will draw to screen if undefined.
         * @param params.useOutputScale - If true positions are scaled relative to the output dimensions, else they are scaled relative to the current canvas size, defaults to false.
         * @param params.color - (If no program passed in) RGB color in range [0, 1] to draw points.
         * @param params.blendAlpha - Blend mode for draw, defaults to false.
         * @returns
         */
        GPUComposer.prototype.drawLayerAsMesh = function (params) {
            var _a;
            var validKeys = ['layer', 'indices', 'program', 'input', 'output', 'useOutputScale', 'color', 'blendAlpha'];
            var requiredKeys = ['layer'];
            var keys = Object.keys(params);
            checkValidKeys(keys, validKeys, 'GPUComposer.drawLayerAsMesh(params)');
            checkRequiredKeys(keys, requiredKeys, 'GPUComposer.drawLayerAsMesh(params)');
            if (this._iterateOverOutputsIfNeeded(params, 'drawLayerAsMesh'))
                return;
            var _b = this, gl = _b.gl, _width = _b._width, _height = _b._height, glslVersion = _b.glslVersion, _errorState = _b._errorState, _meshIndexBuffer = _b._meshIndexBuffer, _meshIndexArray = _b._meshIndexArray;
            var layer = params.layer, output = params.output;
            if (_errorState)
                return;
            // Check that layer is valid.
            if (layer.numComponents !== 2 && layer.numComponents !== 4) {
                throw new Error("GPUComposer.drawLayerAsMesh() must be passed a layer parameter with either 2 or 4 components, got position GPULayer \"".concat(layer.name, "\" with ").concat(layer.numComponents, " components."));
            }
            var positionsCount = layer.is1D() ? layer.length : layer.width * layer.height;
            if (glslVersion === GLSL1 && positionsCount > MAX_FLOAT_INT) {
                console.warn("Mesh positions array length: ".concat(positionsCount, " is longer than what is supported by GLSL1 : ").concat(MAX_FLOAT_INT, "."));
            }
            var program = params.program;
            if (program === undefined) {
                program = this._setValueProgramForType(FLOAT);
                var color = params.color || [1, 0, 0]; // Default of red.
                if (color.length !== 3)
                    throw new Error("Color parameter must have length 3, got ".concat(JSON.stringify(color), "."));
                program.setUniform('u_value', __spreadArray(__spreadArray([], color, true), [1], false), FLOAT);
            }
            // Add positions to end of input if needed.
            var input = this._addLayerToInputs(layer, params.input);
            var vertexShaderOptions = {};
            // Tell whether we are using an absolute position (2 components),
            // or position with accumulation buffer (4 components, better floating pt accuracy).
            if (layer.numComponents === 4)
                vertexShaderOptions[GPUIO_VS_POSITION_W_ACCUM] = '1';
            // Do setup - this must come first.
            var glProgram = this._drawSetup(program, LAYER_MESH_PROGRAM_NAME, vertexShaderOptions, false, input, output);
            // Update uniforms and buffers.
            program._setVertexUniform(glProgram, 'u_gpuio_positions', indexOfLayerInArray(layer, input), INT);
            var width = _width;
            var height = _height;
            if (params.useOutputScale) {
                (_a = this._widthHeightForOutput(program.name, output), width = _a.width, height = _a.height);
            }
            program._setVertexUniform(glProgram, 'u_gpuio_scale', [1 / width, 1 / height], FLOAT);
            var positionLayerDimensions = [layer.width, layer.height];
            program._setVertexUniform(glProgram, 'u_gpuio_positionsDimensions', positionLayerDimensions, FLOAT);
            // We get this for free in GLSL3 with gl_VertexID.
            if (glslVersion === GLSL1) {
                if (_meshIndexBuffer === undefined || (_meshIndexArray && _meshIndexArray.length < positionsCount)) {
                    // Have to use float32 array bc int is not supported as a vertex attribute type.
                    var indices = initSequentialFloatArray(positionsCount);
                    this._meshIndexArray = indices;
                    this._meshIndexBuffer = this._initVertexBuffer(indices);
                }
                gl.bindBuffer(gl.ARRAY_BUFFER, this._meshIndexBuffer);
                this._setIndexAttribute(glProgram, program.name);
            }
            // Draw.
            this._setBlendMode(params.blendAlpha);
            if (params.indices) {
                var _c = params.indices, glType = _c.glType, count = _c.count, buffer = _c.buffer;
                // https://webglfundamentals.org/webgl/lessons/webgl-indexed-vertices.html
                // Make index buffer the current ELEMENT_ARRAY_BUFFER.
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
                var offset = 0;
                gl.drawElements(gl.TRIANGLES, count, glType, offset);
            }
            else {
                // We are assuming that positions are already grouped into triangles.
                gl.drawArrays(gl.TRIANGLES, 0, positionsCount);
            }
            this._drawFinish(params);
        };
        Object.defineProperty(GPUComposer.prototype, "clearValue", {
            /**
             * Get the clearValue of the GPUComposer.
             */
            get: function () {
                return this._clearValue;
            },
            /**
             * Set the clearValue of the GPUComposer, which is applied during GPUComposer.clear().
             */
            set: function (clearValue) {
                var type = FLOAT;
                var numComponents = 4;
                if (!isValidClearValue(clearValue, numComponents, type)) {
                    throw new Error("Invalid clearValue: ".concat(JSON.stringify(clearValue), " for GPUComposer, expected ").concat(type, " or array of ").concat(type, " of length ").concat(numComponents, "."));
                }
                // Make deep copy if needed.
                this._clearValue = typeChecksExports.isArray(clearValue) ? clearValue.slice() : clearValue;
                this._clearValueVec4 = undefined;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GPUComposer.prototype, "clearValueVec4", {
            /**
             * Get the clearValue of the GPUComposer as a vec4, pad with zeros as needed.
             */
            get: function () {
                var _clearValueVec4 = this._clearValueVec4;
                if (!_clearValueVec4) {
                    var clearValue = this.clearValue;
                    _clearValueVec4 = [];
                    if (typeChecksExports.isFiniteNumber(clearValue)) {
                        _clearValueVec4.push(clearValue, clearValue, clearValue, clearValue);
                    }
                    else {
                        _clearValueVec4.push.apply(_clearValueVec4, clearValue);
                        for (var j = _clearValueVec4.length; j < 4; j++) {
                            _clearValueVec4.push(0);
                        }
                    }
                    this._clearValueVec4 = _clearValueVec4;
                }
                return _clearValueVec4;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Clear all data in canvas to GPUComposer.clearValue.
         */
        GPUComposer.prototype.clear = function () {
            var _a = this, verboseLogging = _a.verboseLogging, clearValueVec4 = _a.clearValueVec4;
            if (verboseLogging)
                console.log("Clearing GPUComoser.");
            var program = this._setValueProgramForType(FLOAT);
            program.setUniform('u_value', clearValueVec4);
            // Write clear value to canvas.
            this.step({
                program: program,
            });
        };
        /**
         * If this GPUComposer has been inited via GPUComposer.initWithThreeRenderer(), call undoThreeState() in render loop before performing any gpu-io step or draw functions.
         */
        GPUComposer.prototype.undoThreeState = function () {
            var _a = this, gl = _a.gl, _threeRenderer = _a._threeRenderer, isWebGL2 = _a.isWebGL2;
            if (!_threeRenderer) {
                throw new Error("Can't call undoThreeState() on a GPUComposer that was not inited with GPUComposer.initWithThreeRenderer().");
            }
            // Disable blend mode.
            gl.disable(gl.BLEND);
            // Unbind VAO for threejs compatibility.
            if (_threeRenderer) {
                if (isWebGL2)
                    gl.bindVertexArray(null);
                else {
                    var ext = getExtension(this, OES_VERTEX_ARRAY_OBJECT, true);
                    ext.bindVertexArrayOES(null);
                }
            }
        };
        /**
         * If this GPUComposer has been inited via GPUComposer.initWithThreeRenderer(), call resetThreeState() in render loop after performing any gpu-io step or draw functions.
         */
        GPUComposer.prototype.resetThreeState = function () {
            var _a = this, gl = _a.gl, _threeRenderer = _a._threeRenderer;
            if (!_threeRenderer) {
                throw new Error("Can't call resetThreeState() on a GPUComposer that was not inited with GPUComposer.initWithThreeRenderer().");
            }
            // Reset viewport.
            var viewport = _threeRenderer.getViewport(new Vector4());
            gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height);
            // Unbind framebuffer (render to screen).
            // Reset threejs WebGL bindings and state, this also unbinds the framebuffer.
            _threeRenderer.resetState();
        };
        // TODO: params.callback is not generated in the docs.
        /**
         * Save the current state of the canvas to png.
         * @param params - PNG parameters.
         * @param params.filename - PNG filename (no extension).
         * @param params.dpi - PNG dpi (defaults to 72dpi).
         * @param params.callback - Optional callback when Blob is ready, default behavior saves the PNG using file-saver.
        */
        GPUComposer.prototype.savePNG = function (params) {
            if (params === void 0) { params = {}; }
            var validKeys = ['filename', 'dpi', 'callback'];
            var keys = Object.keys(params);
            checkValidKeys(keys, validKeys, 'GPUComposer.savePNG(params)');
            var canvas = this.canvas;
            var filename = params.filename || 'output';
            var callback = params.callback || saveAs; // Default to saving the image with file-saver.
            // TODO: need to adjust the canvas size to get the correct px ratio from toBlob().
            // const ratio = window.devicePixelRatio || 1;
            canvas.toBlob(function (blob) {
                if (!blob) {
                    console.warn("Problem saving PNG, unable to init blob from canvas.");
                    return;
                }
                if (params.dpi) {
                    changeDpiBlob_1(blob, params.dpi).then(function (blob) {
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
        Object.defineProperty(GPUComposer.prototype, "numTicks", {
            /**
             * Return the number of ticks of the simulation.
             * Use GPUComposer.tick() to increment this value on each animation cycle.
             */
            get: function () {
                return this._numTicks;
            },
            enumerable: false,
            configurable: true
        });
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
            // @ts-ignore
            delete this._clearValue;
            delete this._clearValueVec4;
        };
        return GPUComposer;
    }());

    var GPUIndexBuffer = /** @class */ (function () {
        /**
         * Init a GPUIndexBuffer to use with GPUComposer.drawLayerAsMesh().
         * @param composer - The current GPUComposer instance.
         * @param params - GPUIndexBuffer parameters.
         * @param params.indices - A 1D array containing indexed geometry.  For a mesh, this would be an array of triangle indices.
         * @param params.name - Name of GPUIndexBuffer, used for error logging.
         * @returns
         */
        function GPUIndexBuffer(composer, params) {
            this._composer = composer;
            if (!params) {
                throw new Error('Error initing GPUIndexBuffer: must pass params to GPUIndexBuffer(composer, params).');
            }
            if (!typeChecksExports.isObject(params)) {
                throw new Error("Error initing GPUIndexBuffer: must pass valid params object to GPUIndexBuffer(composer, params), got ".concat(JSON.stringify(params), "."));
            }
            // Check params.
            var validKeys = ['indices', 'name'];
            var requiredKeys = ['indices'];
            var keys = Object.keys(params);
            checkValidKeys(keys, validKeys, 'GPUIndexBuffer(composer, params)', params.name);
            checkRequiredKeys(keys, requiredKeys, 'GPUIndexBuffer(composer, params)', params.name);
            var indices = params.indices;
            var gl = composer.gl, isWebGL2 = composer.isWebGL2;
            var indexBuffer = gl.createBuffer();
            // Make index buffer the current ELEMENT_ARRAY_BUFFER.
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            // Cast indices to correct type.
            if (!isTypedArray(indices)) {
                indices = new Uint32Array(indices);
            }
            var glType;
            switch (indices.constructor) {
                case Uint8Array:
                    glType = gl.UNSIGNED_BYTE;
                    break;
                case Uint16Array:
                    glType = gl.UNSIGNED_SHORT;
                    break;
                case Uint32Array:
                    if (!isWebGL2) {
                        var ext = getExtension(composer, OES_ELEMENT_INDEX_UINT, true);
                        if (!ext) {
                            // Fall back to using gl.UNSIGNED_SHORT.
                            glType = gl.UNSIGNED_SHORT;
                            indices = Uint16Array.from(indices);
                            break;
                        }
                    }
                    glType = gl.UNSIGNED_INT;
                    break;
            }
            // Fill the current element array buffer with data.
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
            this.buffer = indexBuffer;
            this.glType = glType;
            this.count = indices.length;
        }
        /**
         * Deallocate GPUIndexBuffer instance and associated WebGL properties.
         */
        GPUIndexBuffer.prototype.dispose = function () {
            var _a = this, _composer = _a._composer, buffer = _a.buffer;
            _composer.gl.deleteBuffer(buffer);
            // Delete all references.
            // @ts-ignore
            delete this._composer;
            // @ts-ignore
            delete this.buffer;
            // Delete these too (for easier testing of deallocations).
            // @ts-ignore
            delete this.glType;
            // @ts-ignore
            delete this.count;
        };
        return GPUIndexBuffer;
    }());

    // These exports are only used for testing.
    /**
     * @private
     */
    var _testing = __assign(__assign(__assign(__assign(__assign(__assign({ isFloatType: isFloatType, isUnsignedIntType: isUnsignedIntType, isSignedIntType: isSignedIntType, isIntType: isIntType, makeShaderHeader: makeShaderHeader, compileShader: compileShader, initGLProgram: initGLProgram, readyToRead: readyToRead, preprocessVertexShader: preprocessVertexShader, preprocessFragmentShader: preprocessFragmentShader, isPowerOf2: isPowerOf2, initSequentialFloatArray: initSequentialFloatArray, uniformInternalTypeForValue: uniformInternalTypeForValue, indexOfLayerInArray: indexOfLayerInArray, readPixelsAsync: readPixelsAsync }, extensions), regex), checks), GPULayerHelpers), polyfills), conversions);
    // Named exports.
    var isWebGL2 = isWebGL2$1, isWebGL2Supported = isWebGL2Supported$1, isHighpSupportedInVertexShader = isHighpSupportedInVertexShader$1, isHighpSupportedInFragmentShader = isHighpSupportedInFragmentShader$1, getVertexShaderMediumpPrecision = getVertexShaderMediumpPrecision$1, getFragmentShaderMediumpPrecision = getFragmentShaderMediumpPrecision$1;
    var copyProgram = copyProgram$1, addLayersProgram = addLayersProgram$1, addValueProgram = addValueProgram$1, multiplyValueProgram = multiplyValueProgram$1, setValueProgram = setValueProgram$1, setColorProgram = setColorProgram$1, zeroProgram = zeroProgram$1, renderRGBProgram = renderRGBProgram$1, renderAmplitudeProgram = renderAmplitudeProgram$1, renderSignedAmplitudeProgram = renderSignedAmplitudeProgram$1;

    exports.BOOL = BOOL;
    exports.BOOL_1D_UNIFORM = BOOL_1D_UNIFORM;
    exports.BOOL_2D_UNIFORM = BOOL_2D_UNIFORM;
    exports.BOOL_3D_UNIFORM = BOOL_3D_UNIFORM;
    exports.BOOL_4D_UNIFORM = BOOL_4D_UNIFORM;
    exports.BOUNDARY_BOTTOM = BOUNDARY_BOTTOM;
    exports.BOUNDARY_LEFT = BOUNDARY_LEFT;
    exports.BOUNDARY_RIGHT = BOUNDARY_RIGHT;
    exports.BOUNDARY_TOP = BOUNDARY_TOP;
    exports.BYTE = BYTE;
    exports.CLAMP_TO_EDGE = CLAMP_TO_EDGE;
    exports.DEFAULT_CIRCLE_NUM_SEGMENTS = DEFAULT_CIRCLE_NUM_SEGMENTS;
    exports.DEFAULT_ERROR_CALLBACK = DEFAULT_ERROR_CALLBACK;
    exports.DEFAULT_PROGRAM_NAME = DEFAULT_PROGRAM_NAME;
    exports.EXPERIMENTAL_WEBGL = EXPERIMENTAL_WEBGL;
    exports.EXPERIMENTAL_WEBGL2 = EXPERIMENTAL_WEBGL2;
    exports.FLOAT = FLOAT;
    exports.FLOAT_1D_UNIFORM = FLOAT_1D_UNIFORM;
    exports.FLOAT_2D_UNIFORM = FLOAT_2D_UNIFORM;
    exports.FLOAT_3D_UNIFORM = FLOAT_3D_UNIFORM;
    exports.FLOAT_4D_UNIFORM = FLOAT_4D_UNIFORM;
    exports.GLSL1 = GLSL1;
    exports.GLSL3 = GLSL3;
    exports.GPUComposer = GPUComposer;
    exports.GPUIO_FLOAT_PRECISION = GPUIO_FLOAT_PRECISION;
    exports.GPUIO_INT_PRECISION = GPUIO_INT_PRECISION;
    exports.GPUIO_VS_INDEXED_POSITIONS = GPUIO_VS_INDEXED_POSITIONS;
    exports.GPUIO_VS_NORMAL_ATTRIBUTE = GPUIO_VS_NORMAL_ATTRIBUTE;
    exports.GPUIO_VS_POSITION_W_ACCUM = GPUIO_VS_POSITION_W_ACCUM;
    exports.GPUIO_VS_UV_ATTRIBUTE = GPUIO_VS_UV_ATTRIBUTE;
    exports.GPUIO_VS_WRAP_X = GPUIO_VS_WRAP_X;
    exports.GPUIO_VS_WRAP_Y = GPUIO_VS_WRAP_Y;
    exports.GPUIndexBuffer = GPUIndexBuffer;
    exports.GPULayer = GPULayer;
    exports.GPUProgram = GPUProgram;
    exports.HALF_FLOAT = HALF_FLOAT;
    exports.INT = INT;
    exports.INT_1D_UNIFORM = INT_1D_UNIFORM;
    exports.INT_2D_UNIFORM = INT_2D_UNIFORM;
    exports.INT_3D_UNIFORM = INT_3D_UNIFORM;
    exports.INT_4D_UNIFORM = INT_4D_UNIFORM;
    exports.LAYER_LINES_PROGRAM_NAME = LAYER_LINES_PROGRAM_NAME;
    exports.LAYER_MESH_PROGRAM_NAME = LAYER_MESH_PROGRAM_NAME;
    exports.LAYER_POINTS_PROGRAM_NAME = LAYER_POINTS_PROGRAM_NAME;
    exports.LAYER_VECTOR_FIELD_PROGRAM_NAME = LAYER_VECTOR_FIELD_PROGRAM_NAME;
    exports.LINEAR = LINEAR;
    exports.MAX_BYTE = MAX_BYTE;
    exports.MAX_FLOAT_INT = MAX_FLOAT_INT;
    exports.MAX_HALF_FLOAT_INT = MAX_HALF_FLOAT_INT;
    exports.MAX_INT = MAX_INT;
    exports.MAX_SHORT = MAX_SHORT;
    exports.MAX_UNSIGNED_BYTE = MAX_UNSIGNED_BYTE;
    exports.MAX_UNSIGNED_INT = MAX_UNSIGNED_INT;
    exports.MAX_UNSIGNED_SHORT = MAX_UNSIGNED_SHORT;
    exports.MIN_BYTE = MIN_BYTE;
    exports.MIN_FLOAT_INT = MIN_FLOAT_INT;
    exports.MIN_HALF_FLOAT_INT = MIN_HALF_FLOAT_INT;
    exports.MIN_INT = MIN_INT;
    exports.MIN_SHORT = MIN_SHORT;
    exports.MIN_UNSIGNED_BYTE = MIN_UNSIGNED_BYTE;
    exports.MIN_UNSIGNED_INT = MIN_UNSIGNED_INT;
    exports.MIN_UNSIGNED_SHORT = MIN_UNSIGNED_SHORT;
    exports.NEAREST = NEAREST;
    exports.PRECISION_HIGH_P = PRECISION_HIGH_P;
    exports.PRECISION_LOW_P = PRECISION_LOW_P;
    exports.PRECISION_MEDIUM_P = PRECISION_MEDIUM_P;
    exports.REPEAT = REPEAT;
    exports.RGB = RGB;
    exports.RGBA = RGBA;
    exports.SEGMENT_PROGRAM_NAME = SEGMENT_PROGRAM_NAME;
    exports.SHORT = SHORT;
    exports.UINT = UINT;
    exports.UINT_1D_UNIFORM = UINT_1D_UNIFORM;
    exports.UINT_2D_UNIFORM = UINT_2D_UNIFORM;
    exports.UINT_3D_UNIFORM = UINT_3D_UNIFORM;
    exports.UINT_4D_UNIFORM = UINT_4D_UNIFORM;
    exports.UNSIGNED_BYTE = UNSIGNED_BYTE;
    exports.UNSIGNED_INT = UNSIGNED_INT;
    exports.UNSIGNED_SHORT = UNSIGNED_SHORT;
    exports.WEBGL1 = WEBGL1;
    exports.WEBGL2 = WEBGL2;
    exports._testing = _testing;
    exports.addLayersProgram = addLayersProgram;
    exports.addValueProgram = addValueProgram;
    exports.copyProgram = copyProgram;
    exports.getFragmentShaderMediumpPrecision = getFragmentShaderMediumpPrecision;
    exports.getVertexShaderMediumpPrecision = getVertexShaderMediumpPrecision;
    exports.isHighpSupportedInFragmentShader = isHighpSupportedInFragmentShader;
    exports.isHighpSupportedInVertexShader = isHighpSupportedInVertexShader;
    exports.isWebGL2 = isWebGL2;
    exports.isWebGL2Supported = isWebGL2Supported;
    exports.multiplyValueProgram = multiplyValueProgram;
    exports.renderAmplitudeProgram = renderAmplitudeProgram;
    exports.renderRGBProgram = renderRGBProgram;
    exports.renderSignedAmplitudeProgram = renderSignedAmplitudeProgram;
    exports.setColorProgram = setColorProgram;
    exports.setValueProgram = setValueProgram;
    exports.validArrayTypes = validArrayTypes;
    exports.validDataTypes = validDataTypes;
    exports.validFilters = validFilters;
    exports.validImageFormats = validImageFormats;
    exports.validImageTypes = validImageTypes;
    exports.validWraps = validWraps;
    exports.zeroProgram = zeroProgram;

}));
//# sourceMappingURL=gpu-io.js.map
