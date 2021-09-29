(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["WebGLCompute"] = factory();
	else
		root["WebGLCompute"] = factory();
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@petamoriken/float16/src/Float16Array.js":
/*!***************************************************************!*\
  !*** ./node_modules/@petamoriken/float16/src/Float16Array.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Float16Array)
/* harmony export */ });
/* harmony import */ var lodash_es_memoize__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lodash-es/memoize */ "./node_modules/lodash-es/memoize.js");
/* harmony import */ var _bug__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./bug */ "./node_modules/@petamoriken/float16/src/bug.js");
/* harmony import */ var _is__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./is */ "./node_modules/@petamoriken/float16/src/is.js");
/* harmony import */ var _is__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./is */ "./node_modules/lodash-es/isArrayBuffer.js");
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib */ "./node_modules/@petamoriken/float16/src/lib.js");
/* harmony import */ var _private__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./private */ "./node_modules/@petamoriken/float16/src/private.js");
/* harmony import */ var _spec__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./spec */ "./node_modules/@petamoriken/float16/src/spec.js");







const _ = (0,_private__WEBPACK_IMPORTED_MODULE_0__.createPrivateStorage)();

/**
 * @param {unknown} target
 * @returns {boolean}
 */
function isFloat16Array(target) {
    return target instanceof Float16Array;
}

/**
 * @param {unknown} target
 * @throws {TypeError}
 */
function assertFloat16Array(target) {
    if (!isFloat16Array(target)) {
        throw new TypeError("This is not a Float16Array");
    }
}

/**
 * @param {unknown} target
 * @returns {boolean}
 */
function isDefaultFloat16ArrayMethods(target) {
    return typeof target === "function" && defaultFloat16ArrayMethods.has(target);
}

/**
 * @param {Float16Array} float16bits
 * @return {number[]}
 */
function copyToArray(float16bits) {
    const length = float16bits.length;

    const array = new Array(length);
    for(let i = 0; i < length; ++i) {
        array[i] = (0,_lib__WEBPACK_IMPORTED_MODULE_1__.convertToNumber)(float16bits[i]);
    }

    return array;
}

/** @type {ProxyHandler<Function>} */
const applyHandler = {
    apply(func, thisArg, args) {
        // peel off proxy
        if (isFloat16Array(thisArg) && isDefaultFloat16ArrayMethods(func)) {
            return Reflect.apply(func, _(thisArg).target ,args);
        }

        return Reflect.apply(func, thisArg, args);
    },
};

/** @type {ProxyHandler<Float16Array>} */
const handler = {
    get(target, key) {
        let wrapper = null;
        if (!_bug__WEBPACK_IMPORTED_MODULE_2__.isTypedArrayIndexedPropertyWritable) {
            wrapper = target;
            target = _(wrapper).target;
        }

        if ((0,_is__WEBPACK_IMPORTED_MODULE_3__.isStringNumberKey)(key)) {
            return Reflect.has(target, key) ? (0,_lib__WEBPACK_IMPORTED_MODULE_1__.convertToNumber)(Reflect.get(target, key)) : undefined;
        } else {
            const ret = wrapper !== null && Reflect.has(wrapper, key) ? Reflect.get(wrapper, key) : Reflect.get(target, key);

            if (typeof ret !== "function") {
                return ret;
            }

            // TypedArray methods can't be called by Proxy Object
            let proxy = _(ret).proxy;

            if (proxy === undefined) {
                proxy = _(ret).proxy = new Proxy(ret, applyHandler);
            }

            return proxy;
        }
    },

    set(target, key, value) {
        let wrapper = null;
        if (!_bug__WEBPACK_IMPORTED_MODULE_2__.isTypedArrayIndexedPropertyWritable) {
            wrapper = target;
            target = _(wrapper).target;
        }

        if ((0,_is__WEBPACK_IMPORTED_MODULE_3__.isStringNumberKey)(key)) {
            return Reflect.set(target, key, (0,_lib__WEBPACK_IMPORTED_MODULE_1__.roundToFloat16Bits)(value));
        } else {
            // frozen object can't change prototype property
            if (wrapper !== null && (!Reflect.has(target, key) || Object.isFrozen(wrapper))) {
                return Reflect.set(wrapper, key, value);
            } else {
                return Reflect.set(target, key, value);
            }
        }
    },
};

if (!_bug__WEBPACK_IMPORTED_MODULE_2__.isTypedArrayIndexedPropertyWritable) {
    handler.getPrototypeOf = (wrapper) => { return Reflect.getPrototypeOf(_(wrapper).target); };
    handler.setPrototypeOf = (wrapper, prototype) => { return Reflect.setPrototypeOf(_(wrapper).target, prototype); };

    handler.defineProperty = (wrapper, key, descriptor) => {
        const target = _(wrapper).target;
        return !Reflect.has(target, key) || Object.isFrozen(wrapper) ? Reflect.defineProperty(wrapper, key, descriptor) : Reflect.defineProperty(target, key, descriptor);
    };
    handler.deleteProperty = (wrapper, key) => {
        const target = _(wrapper).target;
        return Reflect.has(wrapper, key) ? Reflect.deleteProperty(wrapper, key) : Reflect.deleteProperty(target, key);
    };

    handler.has = (wrapper, key) => { return Reflect.has(wrapper, key) || Reflect.has(_(wrapper).target, key); };

    handler.isExtensible = (wrapper) => { return Reflect.isExtensible(wrapper); };
    handler.preventExtensions = (wrapper) => { return Reflect.preventExtensions(wrapper); };

    handler.getOwnPropertyDescriptor = (wrapper, key) => { return Reflect.getOwnPropertyDescriptor(wrapper, key); };
    handler.ownKeys = (wrapper) => { return Reflect.ownKeys(wrapper); };
}

class Float16Array extends Uint16Array {

    constructor(input, byteOffset, length) {
        // input Float16Array
        if (isFloat16Array(input)) {
            super(_(input).target);

        // 22.2.1.3, 22.2.1.4 TypedArray, Array, ArrayLike, Iterable
        } else if (input !== null && typeof input === "object" && !(0,_is__WEBPACK_IMPORTED_MODULE_4__.default)(input)) {
            // if input is not ArrayLike and Iterable, get Array
            const arrayLike = !Reflect.has(input, "length") && input[Symbol.iterator] !== undefined ? [...input] : input;

            const length = arrayLike.length;
            super(length);

            for(let i = 0; i < length; ++i) {
                // super (Uint16Array)
                this[i] = (0,_lib__WEBPACK_IMPORTED_MODULE_1__.roundToFloat16Bits)(arrayLike[i]);
            }

        // 22.2.1.2, 22.2.1.5 primitive, ArrayBuffer
        } else {
            switch(arguments.length) {
                case 0:
                    super();
                    break;

                case 1:
                    super(input);
                    break;

                case 2:
                    super(input, byteOffset);
                    break;

                case 3:
                    super(input, byteOffset, length);
                    break;

                default:
                    // @ts-ignore
                    super(...arguments);
            }
        }

        let proxy;

        if (_bug__WEBPACK_IMPORTED_MODULE_2__.isTypedArrayIndexedPropertyWritable) {
            proxy = new Proxy(this, handler);
        } else {
            const wrapper = Object.create(null);
            _(wrapper).target = this;
            proxy = new Proxy(wrapper, handler);
        }

        // proxy private storage
        _(proxy).target = this;

        // this private storage
        _(this).proxy = proxy;

        return proxy;
    }

    // static methods
    static from(src, ...opts) {
        if (opts.length === 0) {
            return new Float16Array(Uint16Array.from(src, _lib__WEBPACK_IMPORTED_MODULE_1__.roundToFloat16Bits).buffer);
        }

        const mapFunc = opts[0];
        const thisArg = opts[1];

        return new Float16Array(Uint16Array.from(src, function (val, ...args) {
            return (0,_lib__WEBPACK_IMPORTED_MODULE_1__.roundToFloat16Bits)(mapFunc.call(this, val, ...args));
        }, thisArg).buffer);
    }

    static of(...args) {
        return new Float16Array(args);
    }

    // iterate methods
    * [Symbol.iterator]() {
        for(const val of super[Symbol.iterator]()) {
            yield (0,_lib__WEBPACK_IMPORTED_MODULE_1__.convertToNumber)(val);
        }
    }

    keys() {
        return super.keys();
    }

    * values() {
        for(const val of super.values()) {
            yield (0,_lib__WEBPACK_IMPORTED_MODULE_1__.convertToNumber)(val);
        }
    }

    /** @type {() => IterableIterator<[number, number]>} */
    * entries() {
        for(const [i, val] of super.entries()) {
            yield [i, (0,_lib__WEBPACK_IMPORTED_MODULE_1__.convertToNumber)(val)];
        }
    }

    // functional methods
    // @ts-ignore
    map(callback, ...opts) {
        assertFloat16Array(this);

        const thisArg = opts[0];

        const array = [];
        for(let i = 0, l = this.length; i < l; ++i) {
            const val = (0,_lib__WEBPACK_IMPORTED_MODULE_1__.convertToNumber)(this[i]);
            array.push(callback.call(thisArg, val, i, _(this).proxy));
        }

        return new Float16Array(array);
    }

    // @ts-ignore
    filter(callback, ...opts) {
        assertFloat16Array(this);

        const thisArg = opts[0];

        const array = [];
        for(let i = 0, l = this.length; i < l; ++i) {
            const val = (0,_lib__WEBPACK_IMPORTED_MODULE_1__.convertToNumber)(this[i]);
            if (callback.call(thisArg, val, i, _(this).proxy)) {
                array.push(val);
            }
        }

        return new Float16Array(array);
    }

    reduce(callback, ...opts) {
        assertFloat16Array(this);

        let val, start;

        if (opts.length === 0) {
            val = (0,_lib__WEBPACK_IMPORTED_MODULE_1__.convertToNumber)(this[0]);
            start = 1;
        } else {
            val = opts[0];
            start = 0;
        }

        for(let i = start, l = this.length; i < l; ++i) {
            val = callback(val, (0,_lib__WEBPACK_IMPORTED_MODULE_1__.convertToNumber)(this[i]), i, _(this).proxy);
        }

        return val;
    }

    reduceRight(callback, ...opts) {
        assertFloat16Array(this);

        let val, start;

        const length = this.length;
        if (opts.length === 0) {
            val = (0,_lib__WEBPACK_IMPORTED_MODULE_1__.convertToNumber)(this[length - 1]);
            start = length - 1;
        } else {
            val = opts[0];
            start = length;
        }

        for(let i = start; i--;) {
            val = callback(val, (0,_lib__WEBPACK_IMPORTED_MODULE_1__.convertToNumber)(this[i]), i, _(this).proxy);
        }

        return val;
    }

    forEach(callback, ...opts) {
        assertFloat16Array(this);

        const thisArg = opts[0];

        for(let i = 0, l = this.length; i < l; ++i) {
            callback.call(thisArg, (0,_lib__WEBPACK_IMPORTED_MODULE_1__.convertToNumber)(this[i]), i, _(this).proxy);
        }
    }

    find(callback, ...opts) {
        assertFloat16Array(this);

        const thisArg = opts[0];

        for(let i = 0, l = this.length; i < l; ++i) {
            const value = (0,_lib__WEBPACK_IMPORTED_MODULE_1__.convertToNumber)(this[i]);
            if (callback.call(thisArg, value, i, _(this).proxy)) {
                return value;
            }
        }
    }

    findIndex(callback, ...opts) {
        assertFloat16Array(this);

        const thisArg = opts[0];

        for(let i = 0, l = this.length; i < l; ++i) {
            const value = (0,_lib__WEBPACK_IMPORTED_MODULE_1__.convertToNumber)(this[i]);
            if (callback.call(thisArg, value, i, _(this).proxy)) {
                return i;
            }
        }

        return -1;
    }

    every(callback, ...opts) {
        assertFloat16Array(this);

        const thisArg = opts[0];

        for(let i = 0, l = this.length; i < l; ++i) {
            if (!callback.call(thisArg, (0,_lib__WEBPACK_IMPORTED_MODULE_1__.convertToNumber)(this[i]), i, _(this).proxy)) {
                return false;
            }
        }

        return true;
    }

    some(callback, ...opts) {
        assertFloat16Array(this);

        const thisArg = opts[0];

        for(let i = 0, l = this.length; i < l; ++i) {
            if (callback.call(thisArg, (0,_lib__WEBPACK_IMPORTED_MODULE_1__.convertToNumber)(this[i]), i, _(this).proxy)) {
                return true;
            }
        }

        return false;
    }

    // change element methods
    set(input, ...opts) {
        assertFloat16Array(this);

        const offset = opts[0];

        let float16bits;

        // input Float16Array
        if (isFloat16Array(input)) {
            float16bits = _(input).target;

        // input others
        } else {
            const arrayLike = !Reflect.has(input, "length") && input[Symbol.iterator] !== undefined ? [...input] : input;
            const length = arrayLike.length;

            float16bits = new Uint16Array(length);
            for(let i = 0, l = arrayLike.length; i < l; ++i) {
                float16bits[i] = (0,_lib__WEBPACK_IMPORTED_MODULE_1__.roundToFloat16Bits)(arrayLike[i]);
            }
        }

        super.set(float16bits, offset);
    }

    reverse() {
        assertFloat16Array(this);

        super.reverse();

        return _(this).proxy;
    }

    fill(value, ...opts) {
        assertFloat16Array(this);

        super.fill((0,_lib__WEBPACK_IMPORTED_MODULE_1__.roundToFloat16Bits)(value), ...opts);

        return _(this).proxy;
    }

    copyWithin(target, start, ...opts) {
        assertFloat16Array(this);

        super.copyWithin(target, start, ...opts);

        return _(this).proxy;
    }

    sort(...opts) {
        assertFloat16Array(this);

        let compareFunction = opts[0];

        if (compareFunction === undefined) {
            compareFunction = _spec__WEBPACK_IMPORTED_MODULE_5__.defaultCompareFunction;
        }

        const _convertToNumber = (0,lodash_es_memoize__WEBPACK_IMPORTED_MODULE_6__.default)(_lib__WEBPACK_IMPORTED_MODULE_1__.convertToNumber);

        super.sort((x, y) => { return compareFunction(_convertToNumber(x), _convertToNumber(y)); });

        return _(this).proxy;
    }

    // copy element methods
    // @ts-ignore
    slice(...opts) {
        assertFloat16Array(this);

        let float16bits;

        // V8, SpiderMonkey, JavaScriptCore, Chakra throw TypeError
        try {
            float16bits = super.slice(...opts);
        } catch(e) {
            if (e instanceof TypeError) {
                const uint16 = new Uint16Array(this.buffer, this.byteOffset, this.length);
                float16bits = uint16.slice(...opts);
            } else {
                throw e;
            }
        }

        return new Float16Array(float16bits.buffer);
    }

    // @ts-ignore
    subarray(...opts) {
        assertFloat16Array(this);

        let float16bits;

        // V8, SpiderMonkey, JavaScriptCore, Chakra throw TypeError
        try {
            float16bits = super.subarray(...opts);
        } catch(e) {
            if (e instanceof TypeError) {
                const uint16 = new Uint16Array(this.buffer, this.byteOffset, this.length);
                float16bits = uint16.subarray(...opts);
            } else {
                throw e;
            }
        }

        return new Float16Array(float16bits.buffer, float16bits.byteOffset, float16bits.length);
    }

    // contains methods
    indexOf(element, ...opts) {
        assertFloat16Array(this);

        const length = this.length;

        let from = (0,_spec__WEBPACK_IMPORTED_MODULE_5__.ToInteger)(opts[0]);

        if (from < 0) {
            from += length;
            if (from < 0) {
                from = 0;
            }
        }

        for(let i = from, l = length; i < l; ++i) {
            if ((0,_lib__WEBPACK_IMPORTED_MODULE_1__.convertToNumber)(this[i]) === element) {
                return i;
            }
        }

        return -1;
    }

    lastIndexOf(element, ...opts) {
        assertFloat16Array(this);

        const length = this.length;

        let from = (0,_spec__WEBPACK_IMPORTED_MODULE_5__.ToInteger)(opts[0]);

        from = from === 0 ? length : from + 1;

        if (from >= 0) {
            from = from < length ? from : length;
        } else {
            from += length;
        }

        for(let i = from; i--;) {
            if ((0,_lib__WEBPACK_IMPORTED_MODULE_1__.convertToNumber)(this[i]) === element) {
                return i;
            }
        }

        return -1;
    }

    includes(element, ...opts) {
        assertFloat16Array(this);

        const length = this.length;

        let from = (0,_spec__WEBPACK_IMPORTED_MODULE_5__.ToInteger)(opts[0]);

        if (from < 0) {
            from += length;
            if (from < 0) {
                from = 0;
            }
        }

        const isNaN = Number.isNaN(element);
        for(let i = from, l = length; i < l; ++i) {
            const value = (0,_lib__WEBPACK_IMPORTED_MODULE_1__.convertToNumber)(this[i]);

            if (isNaN && Number.isNaN(value)) {
                return true;
            }

            if (value === element) {
                return true;
            }
        }

        return false;
    }

    // string methods
    join(...opts) {
        assertFloat16Array(this);

        const array = copyToArray(this);

        return array.join(...opts);
    }

    toLocaleString(...opts) {
        assertFloat16Array(this);

        const array = copyToArray(this);

        // @ts-ignore
        return array.toLocaleString(...opts);
    }

    // @ts-ignore
    get [Symbol.toStringTag]() {
        if (isFloat16Array(this)) {
            return "Float16Array";
        }
    }
}

const Float16Array$prototype = Float16Array.prototype;

const defaultFloat16ArrayMethods = new WeakSet();
for(const key of Reflect.ownKeys(Float16Array$prototype)) {
    const val = Float16Array$prototype[key];
    if (typeof val === "function") {
        defaultFloat16ArrayMethods.add(val);
    }
}


/***/ }),

/***/ "./node_modules/@petamoriken/float16/src/bug.js":
/*!******************************************************!*\
  !*** ./node_modules/@petamoriken/float16/src/bug.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isTypedArrayIndexedPropertyWritable": () => (/* binding */ isTypedArrayIndexedPropertyWritable)
/* harmony export */ });
/**
 * JavaScriptCore <= 12 bug
 * @see https://bugs.webkit.org/show_bug.cgi?id=171606
 */
const isTypedArrayIndexedPropertyWritable = Object.getOwnPropertyDescriptor(new Uint8Array(1), 0).writable;


/***/ }),

/***/ "./node_modules/@petamoriken/float16/src/dataView.js":
/*!***********************************************************!*\
  !*** ./node_modules/@petamoriken/float16/src/dataView.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getFloat16": () => (/* binding */ getFloat16),
/* harmony export */   "setFloat16": () => (/* binding */ setFloat16)
/* harmony export */ });
/* harmony import */ var _is__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./is */ "./node_modules/@petamoriken/float16/src/is.js");
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib */ "./node_modules/@petamoriken/float16/src/lib.js");



/**
 * returns an unsigned 16-bit float at the specified byte offset from the start of the DataView.
 * @param {DataView} dataView
 * @param {number} byteOffset
 * @param {[boolean]} opts
 * @returns {number}
 */
function getFloat16(dataView, byteOffset, ...opts) {
    if (!(0,_is__WEBPACK_IMPORTED_MODULE_0__.isDataView)(dataView)) {
        throw new TypeError("First argument to getFloat16 function must be a DataView");
    }

    return (0,_lib__WEBPACK_IMPORTED_MODULE_1__.convertToNumber)( dataView.getUint16(byteOffset, ...opts) );
}

/**
 * stores an unsigned 16-bit float value at the specified byte offset from the start of the DataView.
 * @param {DataView} dataView
 * @param {number} byteOffset
 * @param {number} value
 * @param {[boolean]} opts
 */
function setFloat16(dataView, byteOffset, value, ...opts) {
    if (!(0,_is__WEBPACK_IMPORTED_MODULE_0__.isDataView)(dataView)) {
        throw new TypeError("First argument to setFloat16 function must be a DataView");
    }

    dataView.setUint16(byteOffset, (0,_lib__WEBPACK_IMPORTED_MODULE_1__.roundToFloat16Bits)(value), ...opts);
}


/***/ }),

/***/ "./node_modules/@petamoriken/float16/src/hfround.js":
/*!**********************************************************!*\
  !*** ./node_modules/@petamoriken/float16/src/hfround.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ hfround)
/* harmony export */ });
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib */ "./node_modules/@petamoriken/float16/src/lib.js");


/**
 * returns the nearest half precision float representation of a number.
 * @param {number} num
 * @returns {number}
 */
function hfround(num) {
    num = Number(num);

    // for optimization
    if (!Number.isFinite(num) || num === 0) {
        return num;
    }

    const x16 = (0,_lib__WEBPACK_IMPORTED_MODULE_0__.roundToFloat16Bits)(num);
    return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.convertToNumber)(x16);
}


/***/ }),

/***/ "./node_modules/@petamoriken/float16/src/index.js":
/*!********************************************************!*\
  !*** ./node_modules/@petamoriken/float16/src/index.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "hfround": () => (/* reexport safe */ _hfround__WEBPACK_IMPORTED_MODULE_0__.default),
/* harmony export */   "Float16Array": () => (/* reexport safe */ _Float16Array__WEBPACK_IMPORTED_MODULE_1__.default),
/* harmony export */   "getFloat16": () => (/* reexport safe */ _dataView_js__WEBPACK_IMPORTED_MODULE_2__.getFloat16),
/* harmony export */   "setFloat16": () => (/* reexport safe */ _dataView_js__WEBPACK_IMPORTED_MODULE_2__.setFloat16)
/* harmony export */ });
/* harmony import */ var _hfround__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hfround */ "./node_modules/@petamoriken/float16/src/hfround.js");
/* harmony import */ var _Float16Array__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Float16Array */ "./node_modules/@petamoriken/float16/src/Float16Array.js");
/* harmony import */ var _dataView_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dataView.js */ "./node_modules/@petamoriken/float16/src/dataView.js");





/***/ }),

/***/ "./node_modules/@petamoriken/float16/src/is.js":
/*!*****************************************************!*\
  !*** ./node_modules/@petamoriken/float16/src/is.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isArrayBuffer": () => (/* reexport safe */ lodash_es_isArrayBuffer__WEBPACK_IMPORTED_MODULE_0__.default),
/* harmony export */   "isDataView": () => (/* binding */ isDataView),
/* harmony export */   "isStringNumberKey": () => (/* binding */ isStringNumberKey)
/* harmony export */ });
/* harmony import */ var _spec__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./spec */ "./node_modules/@petamoriken/float16/src/spec.js");
/* harmony import */ var lodash_es_isArrayBuffer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash-es/isArrayBuffer */ "./node_modules/lodash-es/isArrayBuffer.js");




/**
 * @param {unknown} view
 * @returns {boolean}
 */
function isDataView(view) {
    return view instanceof DataView;
}

/**
 * @param {unknown} key
 * @returns {boolean}
 */
function isStringNumberKey(key) {
    return typeof key === "string" && key === (0,_spec__WEBPACK_IMPORTED_MODULE_1__.ToInteger)(key) + "";
}


/***/ }),

/***/ "./node_modules/@petamoriken/float16/src/lib.js":
/*!******************************************************!*\
  !*** ./node_modules/@petamoriken/float16/src/lib.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "roundToFloat16Bits": () => (/* binding */ roundToFloat16Bits),
/* harmony export */   "convertToNumber": () => (/* binding */ convertToNumber)
/* harmony export */ });
// algorithm: ftp://ftp.fox-toolkit.org/pub/fasthalffloatconversion.pdf

const buffer = new ArrayBuffer(4);
const floatView = new Float32Array(buffer);
const uint32View = new Uint32Array(buffer);


const baseTable = new Uint32Array(512);
const shiftTable = new Uint32Array(512);

for(let i = 0; i < 256; ++i) {
    const e = i - 127;

    // very small number (0, -0)
    if (e < -27) {
        baseTable[i | 0x000] = 0x0000;
        baseTable[i | 0x100] = 0x8000;
        shiftTable[i | 0x000] = 24;
        shiftTable[i | 0x100] = 24;

    // small number (denorm)
    } else if (e < -14) {
        baseTable[i | 0x000] =  0x0400 >> (-e - 14);
        baseTable[i | 0x100] = (0x0400 >> (-e - 14)) | 0x8000;
        shiftTable[i | 0x000] = -e - 1;
        shiftTable[i | 0x100] = -e - 1;

    // normal number
    } else if (e <= 15) {
        baseTable[i | 0x000] =  (e + 15) << 10;
        baseTable[i | 0x100] = ((e + 15) << 10) | 0x8000;
        shiftTable[i | 0x000] = 13;
        shiftTable[i | 0x100] = 13;

    // large number (Infinity, -Infinity)
    } else if (e < 128) {
        baseTable[i | 0x000] = 0x7c00;
        baseTable[i | 0x100] = 0xfc00;
        shiftTable[i | 0x000] = 24;
        shiftTable[i | 0x100] = 24;

    // stay (NaN, Infinity, -Infinity)
    } else {
        baseTable[i | 0x000] = 0x7c00;
        baseTable[i | 0x100] = 0xfc00;
        shiftTable[i | 0x000] = 13;
        shiftTable[i | 0x100] = 13;
    }
}

/**
 * round a number to a half float number bits.
 * @param {number} num - double float
 * @returns {number} half float number bits
 */
function roundToFloat16Bits(num) {
    floatView[0] = num;

    const f = uint32View[0];
    const e = (f >> 23) & 0x1ff;
    return baseTable[e] + ((f & 0x007fffff) >> shiftTable[e]);
}


const mantissaTable = new Uint32Array(2048);
const exponentTable = new Uint32Array(64);
const offsetTable = new Uint32Array(64);

mantissaTable[0] = 0;
for(let i = 1; i < 1024; ++i) {
    let m = i << 13;    // zero pad mantissa bits
    let e = 0;          // zero exponent

    // normalized
    while((m & 0x00800000) === 0) {
        e -= 0x00800000;    // decrement exponent
        m <<= 1;
    }

    m &= ~0x00800000;   // clear leading 1 bit
    e += 0x38800000;    // adjust bias

    mantissaTable[i] = m | e;
}
for(let i = 1024; i < 2048; ++i) {
    mantissaTable[i] = 0x38000000 + ((i - 1024) << 13);
}

exponentTable[0] = 0;
for(let i = 1; i < 31; ++i) {
    exponentTable[i] = i << 23;
}
exponentTable[31] = 0x47800000;
exponentTable[32] = 0x80000000;
for(let i = 33; i < 63; ++i) {
    exponentTable[i] = 0x80000000 + ((i - 32) << 23);
}
exponentTable[63] = 0xc7800000;

offsetTable[0] = 0;
for(let i = 1; i < 64; ++i) {
    if (i === 32) {
        offsetTable[i] = 0;
    } else {
        offsetTable[i] = 1024;
    }
}

/**
 * convert a half float number bits to a number.
 * @param {number} float16bits - half float number bits
 * @returns {number} double float
 */
function convertToNumber(float16bits) {
    const m = float16bits >> 10;
    uint32View[0] = mantissaTable[offsetTable[m] + (float16bits & 0x3ff)] + exponentTable[m];
    return floatView[0];
}


/***/ }),

/***/ "./node_modules/@petamoriken/float16/src/private.js":
/*!**********************************************************!*\
  !*** ./node_modules/@petamoriken/float16/src/private.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createPrivateStorage": () => (/* binding */ createPrivateStorage)
/* harmony export */ });
/**
 * @returns {(self:object) => object}
 */
function createPrivateStorage() {
	const wm = new WeakMap();
	return (self) => {
		let obj = wm.get(self);
		if (obj) {
			return obj;
		} else {
			obj = Object.create(null);
			wm.set(self, obj);
			return obj;
		}
	};
}


/***/ }),

/***/ "./node_modules/@petamoriken/float16/src/spec.js":
/*!*******************************************************!*\
  !*** ./node_modules/@petamoriken/float16/src/spec.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ToInteger": () => (/* binding */ ToInteger),
/* harmony export */   "defaultCompareFunction": () => (/* binding */ defaultCompareFunction)
/* harmony export */ });
/**
 * @param {unknown} target
 * @returns {number}
 */
function ToInteger(target) {
    let number = typeof target !== "number" ? Number(target) : target;
    if (Number.isNaN(number)) {
        number = 0;
    }
    return Math.trunc(number);
}

/**
 * @param {number} x
 * @param {number} y
 * @returns {-1 | 0 | 1}
 */
function defaultCompareFunction(x, y) {
    const [isNaN_x, isNaN_y] = [Number.isNaN(x), Number.isNaN(y)];

    if (isNaN_x && isNaN_y) {
        return 0;
    }

    if (isNaN_x) {
        return 1;
    }

    if (isNaN_y) {
        return -1;
    }

    if (x < y) {
        return -1;
    }

    if (x > y) {
        return 1;
    }

    if (x === 0 && y === 0) {
        const [isPlusZero_x, isPlusZero_y] = [Object.is(x, 0), Object.is(y, 0)];

        if (!isPlusZero_x && isPlusZero_y) {
            return -1;
        }

        if (isPlusZero_x && !isPlusZero_y) {
            return 1;
        }
    }

    return 0;
}


/***/ }),

/***/ "./node_modules/changedpi/dist/index.js":
/*!**********************************************!*\
  !*** ./node_modules/changedpi/dist/index.js ***!
  \**********************************************/
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

/***/ "./node_modules/file-saver/dist/FileSaver.min.js":
/*!*******************************************************!*\
  !*** ./node_modules/file-saver/dist/FileSaver.min.js ***!
  \*******************************************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function(a,b){if(true)!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (b),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else {}})(this,function(){"use strict";function b(a,b){return"undefined"==typeof b?b={autoBom:!1}:"object"!=typeof b&&(console.warn("Deprecated: Expected third argument to be a object"),b={autoBom:!b}),b.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(a.type)?new Blob(["\uFEFF",a],{type:a.type}):a}function c(a,b,c){var d=new XMLHttpRequest;d.open("GET",a),d.responseType="blob",d.onload=function(){g(d.response,b,c)},d.onerror=function(){console.error("could not download file")},d.send()}function d(a){var b=new XMLHttpRequest;b.open("HEAD",a,!1);try{b.send()}catch(a){}return 200<=b.status&&299>=b.status}function e(a){try{a.dispatchEvent(new MouseEvent("click"))}catch(c){var b=document.createEvent("MouseEvents");b.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),a.dispatchEvent(b)}}var f="object"==typeof window&&window.window===window?window:"object"==typeof self&&self.self===self?self:"object"==typeof __webpack_require__.g&&__webpack_require__.g.global===__webpack_require__.g?__webpack_require__.g:void 0,a=f.navigator&&/Macintosh/.test(navigator.userAgent)&&/AppleWebKit/.test(navigator.userAgent)&&!/Safari/.test(navigator.userAgent),g=f.saveAs||("object"!=typeof window||window!==f?function(){}:"download"in HTMLAnchorElement.prototype&&!a?function(b,g,h){var i=f.URL||f.webkitURL,j=document.createElement("a");g=g||b.name||"download",j.download=g,j.rel="noopener","string"==typeof b?(j.href=b,j.origin===location.origin?e(j):d(j.href)?c(b,g,h):e(j,j.target="_blank")):(j.href=i.createObjectURL(b),setTimeout(function(){i.revokeObjectURL(j.href)},4E4),setTimeout(function(){e(j)},0))}:"msSaveOrOpenBlob"in navigator?function(f,g,h){if(g=g||f.name||"download","string"!=typeof f)navigator.msSaveOrOpenBlob(b(f,h),g);else if(d(f))c(f,g,h);else{var i=document.createElement("a");i.href=f,i.target="_blank",setTimeout(function(){e(i)})}}:function(b,d,e,g){if(g=g||open("","_blank"),g&&(g.document.title=g.document.body.innerText="downloading..."),"string"==typeof b)return c(b,d,e);var h="application/octet-stream"===b.type,i=/constructor/i.test(f.HTMLElement)||f.safari,j=/CriOS\/[\d]+/.test(navigator.userAgent);if((j||h&&i||a)&&"undefined"!=typeof FileReader){var k=new FileReader;k.onloadend=function(){var a=k.result;a=j?a:a.replace(/^data:[^;]*;/,"data:attachment/file;"),g?g.location.href=a:location=a,g=null},k.readAsDataURL(b)}else{var l=f.URL||f.webkitURL,m=l.createObjectURL(b);g?g.location=m:location.href=m,g=null,setTimeout(function(){l.revokeObjectURL(m)},4E4)}});f.saveAs=g.saveAs=g, true&&(module.exports=g)});

//# sourceMappingURL=FileSaver.min.js.map

/***/ }),

/***/ "./node_modules/lodash-es/_Hash.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash-es/_Hash.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _hashClear_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_hashClear.js */ "./node_modules/lodash-es/_hashClear.js");
/* harmony import */ var _hashDelete_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_hashDelete.js */ "./node_modules/lodash-es/_hashDelete.js");
/* harmony import */ var _hashGet_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_hashGet.js */ "./node_modules/lodash-es/_hashGet.js");
/* harmony import */ var _hashHas_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_hashHas.js */ "./node_modules/lodash-es/_hashHas.js");
/* harmony import */ var _hashSet_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./_hashSet.js */ "./node_modules/lodash-es/_hashSet.js");






/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = _hashClear_js__WEBPACK_IMPORTED_MODULE_0__.default;
Hash.prototype['delete'] = _hashDelete_js__WEBPACK_IMPORTED_MODULE_1__.default;
Hash.prototype.get = _hashGet_js__WEBPACK_IMPORTED_MODULE_2__.default;
Hash.prototype.has = _hashHas_js__WEBPACK_IMPORTED_MODULE_3__.default;
Hash.prototype.set = _hashSet_js__WEBPACK_IMPORTED_MODULE_4__.default;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Hash);


/***/ }),

/***/ "./node_modules/lodash-es/_ListCache.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash-es/_ListCache.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _listCacheClear_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_listCacheClear.js */ "./node_modules/lodash-es/_listCacheClear.js");
/* harmony import */ var _listCacheDelete_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_listCacheDelete.js */ "./node_modules/lodash-es/_listCacheDelete.js");
/* harmony import */ var _listCacheGet_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_listCacheGet.js */ "./node_modules/lodash-es/_listCacheGet.js");
/* harmony import */ var _listCacheHas_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_listCacheHas.js */ "./node_modules/lodash-es/_listCacheHas.js");
/* harmony import */ var _listCacheSet_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./_listCacheSet.js */ "./node_modules/lodash-es/_listCacheSet.js");






/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = _listCacheClear_js__WEBPACK_IMPORTED_MODULE_0__.default;
ListCache.prototype['delete'] = _listCacheDelete_js__WEBPACK_IMPORTED_MODULE_1__.default;
ListCache.prototype.get = _listCacheGet_js__WEBPACK_IMPORTED_MODULE_2__.default;
ListCache.prototype.has = _listCacheHas_js__WEBPACK_IMPORTED_MODULE_3__.default;
ListCache.prototype.set = _listCacheSet_js__WEBPACK_IMPORTED_MODULE_4__.default;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ListCache);


/***/ }),

/***/ "./node_modules/lodash-es/_Map.js":
/*!****************************************!*\
  !*** ./node_modules/lodash-es/_Map.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _getNative_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_getNative.js */ "./node_modules/lodash-es/_getNative.js");
/* harmony import */ var _root_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_root.js */ "./node_modules/lodash-es/_root.js");



/* Built-in method references that are verified to be native. */
var Map = (0,_getNative_js__WEBPACK_IMPORTED_MODULE_0__.default)(_root_js__WEBPACK_IMPORTED_MODULE_1__.default, 'Map');

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Map);


/***/ }),

/***/ "./node_modules/lodash-es/_MapCache.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/_MapCache.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _mapCacheClear_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_mapCacheClear.js */ "./node_modules/lodash-es/_mapCacheClear.js");
/* harmony import */ var _mapCacheDelete_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_mapCacheDelete.js */ "./node_modules/lodash-es/_mapCacheDelete.js");
/* harmony import */ var _mapCacheGet_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_mapCacheGet.js */ "./node_modules/lodash-es/_mapCacheGet.js");
/* harmony import */ var _mapCacheHas_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_mapCacheHas.js */ "./node_modules/lodash-es/_mapCacheHas.js");
/* harmony import */ var _mapCacheSet_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./_mapCacheSet.js */ "./node_modules/lodash-es/_mapCacheSet.js");






/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = _mapCacheClear_js__WEBPACK_IMPORTED_MODULE_0__.default;
MapCache.prototype['delete'] = _mapCacheDelete_js__WEBPACK_IMPORTED_MODULE_1__.default;
MapCache.prototype.get = _mapCacheGet_js__WEBPACK_IMPORTED_MODULE_2__.default;
MapCache.prototype.has = _mapCacheHas_js__WEBPACK_IMPORTED_MODULE_3__.default;
MapCache.prototype.set = _mapCacheSet_js__WEBPACK_IMPORTED_MODULE_4__.default;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MapCache);


/***/ }),

/***/ "./node_modules/lodash-es/_Symbol.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash-es/_Symbol.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _root_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_root.js */ "./node_modules/lodash-es/_root.js");


/** Built-in value references. */
var Symbol = _root_js__WEBPACK_IMPORTED_MODULE_0__.default.Symbol;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Symbol);


/***/ }),

/***/ "./node_modules/lodash-es/_assocIndexOf.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash-es/_assocIndexOf.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _eq_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./eq.js */ "./node_modules/lodash-es/eq.js");


/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if ((0,_eq_js__WEBPACK_IMPORTED_MODULE_0__.default)(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (assocIndexOf);


/***/ }),

/***/ "./node_modules/lodash-es/_baseGetTag.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_baseGetTag.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_Symbol.js */ "./node_modules/lodash-es/_Symbol.js");
/* harmony import */ var _getRawTag_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_getRawTag.js */ "./node_modules/lodash-es/_getRawTag.js");
/* harmony import */ var _objectToString_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_objectToString.js */ "./node_modules/lodash-es/_objectToString.js");




/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = _Symbol_js__WEBPACK_IMPORTED_MODULE_0__.default ? _Symbol_js__WEBPACK_IMPORTED_MODULE_0__.default.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? (0,_getRawTag_js__WEBPACK_IMPORTED_MODULE_1__.default)(value)
    : (0,_objectToString_js__WEBPACK_IMPORTED_MODULE_2__.default)(value);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseGetTag);


/***/ }),

/***/ "./node_modules/lodash-es/_baseIsArrayBuffer.js":
/*!******************************************************!*\
  !*** ./node_modules/lodash-es/_baseIsArrayBuffer.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _baseGetTag_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseGetTag.js */ "./node_modules/lodash-es/_baseGetTag.js");
/* harmony import */ var _isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isObjectLike.js */ "./node_modules/lodash-es/isObjectLike.js");



var arrayBufferTag = '[object ArrayBuffer]';

/**
 * The base implementation of `_.isArrayBuffer` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array buffer, else `false`.
 */
function baseIsArrayBuffer(value) {
  return (0,_isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__.default)(value) && (0,_baseGetTag_js__WEBPACK_IMPORTED_MODULE_1__.default)(value) == arrayBufferTag;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseIsArrayBuffer);


/***/ }),

/***/ "./node_modules/lodash-es/_baseIsNative.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash-es/_baseIsNative.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _isFunction_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isFunction.js */ "./node_modules/lodash-es/isFunction.js");
/* harmony import */ var _isMasked_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_isMasked.js */ "./node_modules/lodash-es/_isMasked.js");
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isObject.js */ "./node_modules/lodash-es/isObject.js");
/* harmony import */ var _toSource_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_toSource.js */ "./node_modules/lodash-es/_toSource.js");





/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!(0,_isObject_js__WEBPACK_IMPORTED_MODULE_0__.default)(value) || (0,_isMasked_js__WEBPACK_IMPORTED_MODULE_1__.default)(value)) {
    return false;
  }
  var pattern = (0,_isFunction_js__WEBPACK_IMPORTED_MODULE_2__.default)(value) ? reIsNative : reIsHostCtor;
  return pattern.test((0,_toSource_js__WEBPACK_IMPORTED_MODULE_3__.default)(value));
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseIsNative);


/***/ }),

/***/ "./node_modules/lodash-es/_baseUnary.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash-es/_baseUnary.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseUnary);


/***/ }),

/***/ "./node_modules/lodash-es/_coreJsData.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_coreJsData.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _root_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_root.js */ "./node_modules/lodash-es/_root.js");


/** Used to detect overreaching core-js shims. */
var coreJsData = _root_js__WEBPACK_IMPORTED_MODULE_0__.default["__core-js_shared__"];

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (coreJsData);


/***/ }),

/***/ "./node_modules/lodash-es/_freeGlobal.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_freeGlobal.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof __webpack_require__.g == 'object' && __webpack_require__.g && __webpack_require__.g.Object === Object && __webpack_require__.g;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (freeGlobal);


/***/ }),

/***/ "./node_modules/lodash-es/_getMapData.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_getMapData.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _isKeyable_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_isKeyable.js */ "./node_modules/lodash-es/_isKeyable.js");


/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return (0,_isKeyable_js__WEBPACK_IMPORTED_MODULE_0__.default)(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getMapData);


/***/ }),

/***/ "./node_modules/lodash-es/_getNative.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash-es/_getNative.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _baseIsNative_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseIsNative.js */ "./node_modules/lodash-es/_baseIsNative.js");
/* harmony import */ var _getValue_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_getValue.js */ "./node_modules/lodash-es/_getValue.js");



/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = (0,_getValue_js__WEBPACK_IMPORTED_MODULE_0__.default)(object, key);
  return (0,_baseIsNative_js__WEBPACK_IMPORTED_MODULE_1__.default)(value) ? value : undefined;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getNative);


/***/ }),

/***/ "./node_modules/lodash-es/_getRawTag.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash-es/_getRawTag.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_Symbol.js */ "./node_modules/lodash-es/_Symbol.js");


/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = _Symbol_js__WEBPACK_IMPORTED_MODULE_0__.default ? _Symbol_js__WEBPACK_IMPORTED_MODULE_0__.default.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getRawTag);


/***/ }),

/***/ "./node_modules/lodash-es/_getValue.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/_getValue.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getValue);


/***/ }),

/***/ "./node_modules/lodash-es/_hashClear.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash-es/_hashClear.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _nativeCreate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_nativeCreate.js */ "./node_modules/lodash-es/_nativeCreate.js");


/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = _nativeCreate_js__WEBPACK_IMPORTED_MODULE_0__.default ? (0,_nativeCreate_js__WEBPACK_IMPORTED_MODULE_0__.default)(null) : {};
  this.size = 0;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (hashClear);


/***/ }),

/***/ "./node_modules/lodash-es/_hashDelete.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_hashDelete.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (hashDelete);


/***/ }),

/***/ "./node_modules/lodash-es/_hashGet.js":
/*!********************************************!*\
  !*** ./node_modules/lodash-es/_hashGet.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _nativeCreate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_nativeCreate.js */ "./node_modules/lodash-es/_nativeCreate.js");


/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (_nativeCreate_js__WEBPACK_IMPORTED_MODULE_0__.default) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (hashGet);


/***/ }),

/***/ "./node_modules/lodash-es/_hashHas.js":
/*!********************************************!*\
  !*** ./node_modules/lodash-es/_hashHas.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _nativeCreate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_nativeCreate.js */ "./node_modules/lodash-es/_nativeCreate.js");


/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return _nativeCreate_js__WEBPACK_IMPORTED_MODULE_0__.default ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (hashHas);


/***/ }),

/***/ "./node_modules/lodash-es/_hashSet.js":
/*!********************************************!*\
  !*** ./node_modules/lodash-es/_hashSet.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _nativeCreate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_nativeCreate.js */ "./node_modules/lodash-es/_nativeCreate.js");


/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (_nativeCreate_js__WEBPACK_IMPORTED_MODULE_0__.default && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (hashSet);


/***/ }),

/***/ "./node_modules/lodash-es/_isKeyable.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash-es/_isKeyable.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isKeyable);


/***/ }),

/***/ "./node_modules/lodash-es/_isMasked.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/_isMasked.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _coreJsData_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_coreJsData.js */ "./node_modules/lodash-es/_coreJsData.js");


/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(_coreJsData_js__WEBPACK_IMPORTED_MODULE_0__.default && _coreJsData_js__WEBPACK_IMPORTED_MODULE_0__.default.keys && _coreJsData_js__WEBPACK_IMPORTED_MODULE_0__.default.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isMasked);


/***/ }),

/***/ "./node_modules/lodash-es/_listCacheClear.js":
/*!***************************************************!*\
  !*** ./node_modules/lodash-es/_listCacheClear.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (listCacheClear);


/***/ }),

/***/ "./node_modules/lodash-es/_listCacheDelete.js":
/*!****************************************************!*\
  !*** ./node_modules/lodash-es/_listCacheDelete.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _assocIndexOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_assocIndexOf.js */ "./node_modules/lodash-es/_assocIndexOf.js");


/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = (0,_assocIndexOf_js__WEBPACK_IMPORTED_MODULE_0__.default)(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (listCacheDelete);


/***/ }),

/***/ "./node_modules/lodash-es/_listCacheGet.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash-es/_listCacheGet.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _assocIndexOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_assocIndexOf.js */ "./node_modules/lodash-es/_assocIndexOf.js");


/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = (0,_assocIndexOf_js__WEBPACK_IMPORTED_MODULE_0__.default)(data, key);

  return index < 0 ? undefined : data[index][1];
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (listCacheGet);


/***/ }),

/***/ "./node_modules/lodash-es/_listCacheHas.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash-es/_listCacheHas.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _assocIndexOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_assocIndexOf.js */ "./node_modules/lodash-es/_assocIndexOf.js");


/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return (0,_assocIndexOf_js__WEBPACK_IMPORTED_MODULE_0__.default)(this.__data__, key) > -1;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (listCacheHas);


/***/ }),

/***/ "./node_modules/lodash-es/_listCacheSet.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash-es/_listCacheSet.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _assocIndexOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_assocIndexOf.js */ "./node_modules/lodash-es/_assocIndexOf.js");


/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = (0,_assocIndexOf_js__WEBPACK_IMPORTED_MODULE_0__.default)(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (listCacheSet);


/***/ }),

/***/ "./node_modules/lodash-es/_mapCacheClear.js":
/*!**************************************************!*\
  !*** ./node_modules/lodash-es/_mapCacheClear.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Hash_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_Hash.js */ "./node_modules/lodash-es/_Hash.js");
/* harmony import */ var _ListCache_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_ListCache.js */ "./node_modules/lodash-es/_ListCache.js");
/* harmony import */ var _Map_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_Map.js */ "./node_modules/lodash-es/_Map.js");




/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new _Hash_js__WEBPACK_IMPORTED_MODULE_0__.default,
    'map': new (_Map_js__WEBPACK_IMPORTED_MODULE_1__.default || _ListCache_js__WEBPACK_IMPORTED_MODULE_2__.default),
    'string': new _Hash_js__WEBPACK_IMPORTED_MODULE_0__.default
  };
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (mapCacheClear);


/***/ }),

/***/ "./node_modules/lodash-es/_mapCacheDelete.js":
/*!***************************************************!*\
  !*** ./node_modules/lodash-es/_mapCacheDelete.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _getMapData_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_getMapData.js */ "./node_modules/lodash-es/_getMapData.js");


/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = (0,_getMapData_js__WEBPACK_IMPORTED_MODULE_0__.default)(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (mapCacheDelete);


/***/ }),

/***/ "./node_modules/lodash-es/_mapCacheGet.js":
/*!************************************************!*\
  !*** ./node_modules/lodash-es/_mapCacheGet.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _getMapData_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_getMapData.js */ "./node_modules/lodash-es/_getMapData.js");


/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return (0,_getMapData_js__WEBPACK_IMPORTED_MODULE_0__.default)(this, key).get(key);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (mapCacheGet);


/***/ }),

/***/ "./node_modules/lodash-es/_mapCacheHas.js":
/*!************************************************!*\
  !*** ./node_modules/lodash-es/_mapCacheHas.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _getMapData_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_getMapData.js */ "./node_modules/lodash-es/_getMapData.js");


/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return (0,_getMapData_js__WEBPACK_IMPORTED_MODULE_0__.default)(this, key).has(key);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (mapCacheHas);


/***/ }),

/***/ "./node_modules/lodash-es/_mapCacheSet.js":
/*!************************************************!*\
  !*** ./node_modules/lodash-es/_mapCacheSet.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _getMapData_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_getMapData.js */ "./node_modules/lodash-es/_getMapData.js");


/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = (0,_getMapData_js__WEBPACK_IMPORTED_MODULE_0__.default)(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (mapCacheSet);


/***/ }),

/***/ "./node_modules/lodash-es/_nativeCreate.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash-es/_nativeCreate.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _getNative_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_getNative.js */ "./node_modules/lodash-es/_getNative.js");


/* Built-in method references that are verified to be native. */
var nativeCreate = (0,_getNative_js__WEBPACK_IMPORTED_MODULE_0__.default)(Object, 'create');

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (nativeCreate);


/***/ }),

/***/ "./node_modules/lodash-es/_nodeUtil.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/_nodeUtil.js ***!
  \*********************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _freeGlobal_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_freeGlobal.js */ "./node_modules/lodash-es/_freeGlobal.js");
/* module decorator */ module = __webpack_require__.hmd(module);


/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && "object" == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && _freeGlobal_js__WEBPACK_IMPORTED_MODULE_0__.default.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule && freeModule.require && freeModule.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (nodeUtil);


/***/ }),

/***/ "./node_modules/lodash-es/_objectToString.js":
/*!***************************************************!*\
  !*** ./node_modules/lodash-es/_objectToString.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (objectToString);


/***/ }),

/***/ "./node_modules/lodash-es/_root.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash-es/_root.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _freeGlobal_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_freeGlobal.js */ "./node_modules/lodash-es/_freeGlobal.js");


/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = _freeGlobal_js__WEBPACK_IMPORTED_MODULE_0__.default || freeSelf || Function('return this')();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (root);


/***/ }),

/***/ "./node_modules/lodash-es/_toSource.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/_toSource.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (toSource);


/***/ }),

/***/ "./node_modules/lodash-es/eq.js":
/*!**************************************!*\
  !*** ./node_modules/lodash-es/eq.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (eq);


/***/ }),

/***/ "./node_modules/lodash-es/isArrayBuffer.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash-es/isArrayBuffer.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _baseIsArrayBuffer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_baseIsArrayBuffer.js */ "./node_modules/lodash-es/_baseIsArrayBuffer.js");
/* harmony import */ var _baseUnary_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseUnary.js */ "./node_modules/lodash-es/_baseUnary.js");
/* harmony import */ var _nodeUtil_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_nodeUtil.js */ "./node_modules/lodash-es/_nodeUtil.js");




/* Node.js helper references. */
var nodeIsArrayBuffer = _nodeUtil_js__WEBPACK_IMPORTED_MODULE_0__.default && _nodeUtil_js__WEBPACK_IMPORTED_MODULE_0__.default.isArrayBuffer;

/**
 * Checks if `value` is classified as an `ArrayBuffer` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array buffer, else `false`.
 * @example
 *
 * _.isArrayBuffer(new ArrayBuffer(2));
 * // => true
 *
 * _.isArrayBuffer(new Array(2));
 * // => false
 */
var isArrayBuffer = nodeIsArrayBuffer ? (0,_baseUnary_js__WEBPACK_IMPORTED_MODULE_1__.default)(nodeIsArrayBuffer) : _baseIsArrayBuffer_js__WEBPACK_IMPORTED_MODULE_2__.default;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isArrayBuffer);


/***/ }),

/***/ "./node_modules/lodash-es/isFunction.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash-es/isFunction.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _baseGetTag_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseGetTag.js */ "./node_modules/lodash-es/_baseGetTag.js");
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isObject.js */ "./node_modules/lodash-es/isObject.js");



/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!(0,_isObject_js__WEBPACK_IMPORTED_MODULE_0__.default)(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = (0,_baseGetTag_js__WEBPACK_IMPORTED_MODULE_1__.default)(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isFunction);


/***/ }),

/***/ "./node_modules/lodash-es/isObject.js":
/*!********************************************!*\
  !*** ./node_modules/lodash-es/isObject.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isObject);


/***/ }),

/***/ "./node_modules/lodash-es/isObjectLike.js":
/*!************************************************!*\
  !*** ./node_modules/lodash-es/isObjectLike.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isObjectLike);


/***/ }),

/***/ "./node_modules/lodash-es/memoize.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash-es/memoize.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _MapCache_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_MapCache.js */ "./node_modules/lodash-es/_MapCache.js");


/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || _MapCache_js__WEBPACK_IMPORTED_MODULE_0__.default);
  return memoized;
}

// Expose `MapCache`.
memoize.Cache = _MapCache_js__WEBPACK_IMPORTED_MODULE_0__.default;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (memoize);


/***/ }),

/***/ "./src/Checks.ts":
/*!***********************!*\
  !*** ./src/Checks.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isArray = exports.isString = exports.isPositiveInteger = exports.isInteger = exports.isNumber = exports.isValidTextureDataType = exports.validTextureDataTypes = exports.isValidTextureFormatType = exports.validTextureFormatTypes = exports.isValidWrapType = exports.validWrapTypes = exports.isValidFilterType = exports.validFilterTypes = exports.isValidDataType = exports.validDataTypes = void 0;
var Constants_1 = __webpack_require__(/*! ./Constants */ "./src/Constants.ts");
exports.validDataTypes = [Constants_1.HALF_FLOAT, Constants_1.FLOAT, Constants_1.UNSIGNED_BYTE, Constants_1.BYTE, Constants_1.UNSIGNED_SHORT, Constants_1.SHORT, Constants_1.UNSIGNED_INT, Constants_1.INT];
function isValidDataType(type) {
    return exports.validDataTypes.indexOf(type) > -1;
}
exports.isValidDataType = isValidDataType;
exports.validFilterTypes = [Constants_1.LINEAR, Constants_1.NEAREST];
function isValidFilterType(type) {
    return exports.validFilterTypes.indexOf(type) > -1;
}
exports.isValidFilterType = isValidFilterType;
exports.validWrapTypes = [Constants_1.CLAMP_TO_EDGE, Constants_1.REPEAT]; // MIRRORED_REPEAT
function isValidWrapType(type) {
    return exports.validWrapTypes.indexOf(type) > -1;
}
exports.isValidWrapType = isValidWrapType;
exports.validTextureFormatTypes = [Constants_1.RGB, Constants_1.RGBA];
function isValidTextureFormatType(type) {
    return exports.validTextureFormatTypes.indexOf(type) > -1;
}
exports.isValidTextureFormatType = isValidTextureFormatType;
exports.validTextureDataTypes = [Constants_1.UNSIGNED_BYTE];
function isValidTextureDataType(type) {
    return exports.validTextureDataTypes.indexOf(type) > -1;
}
exports.isValidTextureDataType = isValidTextureDataType;
function isNumber(value) {
    return !isNaN(value);
}
exports.isNumber = isNumber;
function isInteger(value) {
    return isNumber(value) && (value % 1 === 0);
}
exports.isInteger = isInteger;
function isPositiveInteger(value) {
    return isInteger(value) && value > 0;
}
exports.isPositiveInteger = isPositiveInteger;
function isString(value) {
    return typeof value === 'string';
}
exports.isString = isString;
function isArray(value) {
    return Array.isArray(value);
}
exports.isArray = isArray;


/***/ }),

/***/ "./src/Constants.ts":
/*!**************************!*\
  !*** ./src/Constants.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.INT_4D_UNIFORM = exports.INT_3D_UNIFORM = exports.INT_2D_UNIFORM = exports.INT_1D_UNIFORM = exports.FLOAT_4D_UNIFORM = exports.FLOAT_3D_UNIFORM = exports.FLOAT_2D_UNIFORM = exports.FLOAT_1D_UNIFORM = exports.GLSL1 = exports.GLSL3 = exports.RGBA = exports.RGB = exports.CLAMP_TO_EDGE = exports.REPEAT = exports.NEAREST = exports.LINEAR = exports.INT = exports.UNSIGNED_INT = exports.SHORT = exports.UNSIGNED_SHORT = exports.BYTE = exports.UNSIGNED_BYTE = exports.FLOAT = exports.HALF_FLOAT = void 0;
exports.HALF_FLOAT = 'HALF_FLOAT';
exports.FLOAT = 'FLOAT';
exports.UNSIGNED_BYTE = 'UNSIGNED_BYTE';
exports.BYTE = 'BYTE';
exports.UNSIGNED_SHORT = 'UNSIGNED_SHORT';
exports.SHORT = 'SHORT';
exports.UNSIGNED_INT = 'UNSIGNED_INT';
exports.INT = 'INT';
exports.LINEAR = 'LINEAR';
exports.NEAREST = 'NEAREST';
exports.REPEAT = 'REPEAT';
exports.CLAMP_TO_EDGE = 'CLAMP_TO_EDGE';
// export const MIRRORED_REPEAT = 'MIRRORED_REPEAT';
exports.RGB = 'RGB';
exports.RGBA = 'RGBA';
exports.GLSL3 = '300 es';
exports.GLSL1 = '100';
// Uniform types.
exports.FLOAT_1D_UNIFORM = '1f';
exports.FLOAT_2D_UNIFORM = '2f';
exports.FLOAT_3D_UNIFORM = '3f';
exports.FLOAT_4D_UNIFORM = '3f';
exports.INT_1D_UNIFORM = '1i';
exports.INT_2D_UNIFORM = '2i';
exports.INT_3D_UNIFORM = '3i';
exports.INT_4D_UNIFORM = '3i';


/***/ }),

/***/ "./src/DataLayer.ts":
/*!**************************!*\
  !*** ./src/DataLayer.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DataLayer = void 0;
var float16_1 = __webpack_require__(/*! @petamoriken/float16 */ "./node_modules/@petamoriken/float16/src/index.js");
var Checks_1 = __webpack_require__(/*! ./Checks */ "./src/Checks.ts");
var Constants_1 = __webpack_require__(/*! ./Constants */ "./src/Constants.ts");
var extensions_1 = __webpack_require__(/*! ./extensions */ "./src/extensions.ts");
var utils_1 = __webpack_require__(/*! ./utils */ "./src/utils.ts");
var DataLayer = /** @class */ (function () {
    function DataLayer(params) {
        // Each DataLayer may contain a number of buffers to store different instances of the state.
        this._bufferIndex = 0;
        this.buffers = [];
        var gl = params.gl, errorCallback = params.errorCallback, name = params.name, dimensions = params.dimensions, type = params.type, numComponents = params.numComponents, data = params.data, glslVersion = params.glslVersion;
        // Save params.
        this.name = name;
        this.gl = gl;
        this.errorCallback = errorCallback;
        // numComponents must be between 1 and 4.
        if (!Checks_1.isPositiveInteger(numComponents) || numComponents > 4) {
            throw new Error("Invalid numComponents " + numComponents + " for DataLayer \"" + name + "\".");
        }
        this.numComponents = numComponents;
        // writable defaults to false.
        var writable = !!params.writable;
        this.writable = writable;
        // Set dimensions, may be 1D or 2D.
        var _a = DataLayer.calcSize(dimensions, name), length = _a.length, width = _a.width, height = _a.height;
        this.length = length;
        if (!Checks_1.isPositiveInteger(width)) {
            throw new Error("Invalid width " + width + " for DataLayer \"" + name + "\".");
        }
        this.width = width;
        if (!Checks_1.isPositiveInteger(height)) {
            throw new Error("Invalid length " + height + " for DataLayer \"" + name + "\".");
        }
        this.height = height;
        // Set filtering - if we are processing a 1D array, default to NEAREST filtering.
        // Else default to LINEAR (interpolation) filtering.
        var filter = params.filter !== undefined ? params.filter : (length ? Constants_1.NEAREST : Constants_1.LINEAR);
        if (!Checks_1.isValidFilterType(filter)) {
            throw new Error("Invalid filter: " + filter + " for DataLayer \"" + name + "\", must be " + Checks_1.validFilterTypes.join(', ') + ".");
        }
        this.filter = filter;
        // Get wrap types, default to clamp to edge.
        var wrapS = params.wrapS !== undefined ? params.wrapS : Constants_1.CLAMP_TO_EDGE;
        if (!Checks_1.isValidWrapType(wrapS)) {
            throw new Error("Invalid wrapS: " + wrapS + " for DataLayer \"" + name + "\", must be " + Checks_1.validWrapTypes.join(', ') + ".");
        }
        this.wrapS = wrapS;
        var wrapT = params.wrapT !== undefined ? params.wrapT : Constants_1.CLAMP_TO_EDGE;
        if (!Checks_1.isValidWrapType(wrapT)) {
            throw new Error("Invalid wrapT: " + wrapT + " for DataLayer \"" + name + "\", must be " + Checks_1.validWrapTypes.join(', ') + ".");
        }
        this.wrapT = wrapT;
        // Set data type.
        if (!Checks_1.isValidDataType(type)) {
            throw new Error("Invalid type " + type + " for DataLayer \"" + name + "\", must be one of " + Checks_1.validDataTypes.join(', ') + ".");
        }
        this.type = type;
        var internalType = DataLayer.getInternalType({
            gl: gl,
            type: type,
            glslVersion: glslVersion,
            writable: writable,
            filter: filter,
            name: name,
            errorCallback: errorCallback,
        });
        this.internalType = internalType;
        // Set gl texture parameters.
        var _b = DataLayer.getGLTextureParameters({
            gl: gl,
            name: name,
            numComponents: numComponents,
            writable: writable,
            internalType: internalType,
            glslVersion: glslVersion,
            errorCallback: errorCallback,
        }), glFormat = _b.glFormat, glInternalFormat = _b.glInternalFormat, glType = _b.glType, glNumChannels = _b.glNumChannels;
        this.glInternalFormat = glInternalFormat;
        this.glFormat = glFormat;
        this.glType = glType;
        this.glNumChannels = glNumChannels;
        // Set internal filtering/wrap types.
        this.internalFilter = DataLayer.getInternalFilter({ gl: gl, filter: filter, internalType: internalType, name: name, errorCallback: errorCallback });
        this.glFilter = gl[this.internalFilter];
        this.internalWrapS = DataLayer.getInternalWrap({ gl: gl, wrap: wrapS, name: name });
        this.glWrapS = gl[this.internalWrapS];
        this.internalWrapT = DataLayer.getInternalWrap({ gl: gl, wrap: wrapT, name: name });
        this.glWrapT = gl[this.internalWrapT];
        // Num buffers is the number of states to store for this data.
        var numBuffers = params.numBuffers !== undefined ? params.numBuffers : 1;
        if (!Checks_1.isPositiveInteger(numBuffers)) {
            throw new Error("Invalid numBuffers: " + numBuffers + " for DataLayer \"" + name + "\", must be positive integer.");
        }
        this.numBuffers = numBuffers;
        this.initBuffers(data);
    }
    DataLayer.calcSize = function (dimensions, name) {
        var length, width, height;
        if (!isNaN(dimensions)) {
            if (!Checks_1.isPositiveInteger(dimensions)) {
                throw new Error("Invalid length " + dimensions + " for DataLayer \"" + name + "\".");
            }
            length = dimensions;
            // Calc power of two width and height for length.
            var exp = 1;
            var remainder = length;
            while (remainder > 2) {
                exp++;
                remainder /= 2;
            }
            width = Math.pow(2, Math.floor(exp / 2) + exp % 2);
            height = Math.pow(2, Math.floor(exp / 2));
        }
        else {
            width = dimensions[0];
            if (!Checks_1.isPositiveInteger(width)) {
                throw new Error("Invalid width " + width + " for DataLayer \"" + name + "\".");
            }
            height = dimensions[1];
            if (!Checks_1.isPositiveInteger(height)) {
                throw new Error("Invalid height " + height + " for DataLayer \"" + name + "\".");
            }
        }
        return { width: width, height: height, length: length };
    };
    DataLayer.getInternalWrap = function (params) {
        var gl = params.gl, wrap = params.wrap, name = params.name;
        // Webgl2.0 supports all combinations of types and filtering.
        if (utils_1.isWebGL2(gl)) {
            return wrap;
        }
        // CLAMP_TO_EDGE is always supported.
        if (wrap === Constants_1.CLAMP_TO_EDGE) {
            return wrap;
        }
        if (!utils_1.isWebGL2(gl)) {
            // TODO: we may want to handle this in the frag shader.
            // REPEAT and MIRROR_REPEAT wrap not supported for non-power of 2 textures in safari.
            // I've tested this and it seems that some power of 2 textures will work (512 x 512),
            // but not others (1024x1024), so let's just change all WebGL 1.0 to CLAMP.
            // Without this, we currently get an error at drawArrays():
            // "WebGL: drawArrays: texture bound to texture unit 0 is not renderable.
            // It maybe non-power-of-2 and have incompatible texture filtering or is not
            // 'texture complete', or it is a float/half-float type with linear filtering and
            // without the relevant float/half-float linear extension enabled."
            console.warn("Falling back to CLAMP_TO_EDGE wrapping for DataLayer \"" + name + "\" for WebGL 1.");
            return Constants_1.CLAMP_TO_EDGE;
        }
        return wrap;
    };
    DataLayer.getInternalFilter = function (params) {
        var gl = params.gl, errorCallback = params.errorCallback, internalType = params.internalType, name = params.name;
        var filter = params.filter;
        if (filter === Constants_1.NEAREST) {
            // NEAREST filtering is always supported.
            return filter;
        }
        if (internalType === Constants_1.HALF_FLOAT) {
            // TODO: test if float linear extension is actually working.
            var extension = extensions_1.getExtension(gl, extensions_1.OES_TEXTURE_HAlF_FLOAT_LINEAR, errorCallback, true)
                || extensions_1.getExtension(gl, extensions_1.OES_TEXTURE_FLOAT_LINEAR, errorCallback, true);
            if (!extension) {
                console.warn("Falling back to NEAREST filter for DataLayer \"" + name + "\".");
                //TODO: add a fallback that does this filtering in the frag shader?.
                filter = Constants_1.NEAREST;
            }
        }
        if (internalType === Constants_1.FLOAT) {
            var extension = extensions_1.getExtension(gl, extensions_1.OES_TEXTURE_FLOAT_LINEAR, errorCallback, true);
            if (!extension) {
                console.warn("Falling back to NEAREST filter for DataLayer \"" + name + "\".");
                //TODO: add a fallback that does this filtering in the frag shader?.
                filter = Constants_1.NEAREST;
            }
        }
        return filter;
    };
    DataLayer.getInternalType = function (params) {
        var gl = params.gl, errorCallback = params.errorCallback, writable = params.writable, name = params.name, glslVersion = params.glslVersion;
        var type = params.type;
        var internalType = type;
        // Check if int types are supported.
        var intCast = DataLayer.shouldCastIntTypeAsFloat(params);
        if (intCast) {
            if (internalType === Constants_1.UNSIGNED_BYTE || internalType === Constants_1.BYTE) {
                // Integers between 0 and 2048 can be exactly represented by half float (and also between −2048 and 0)
                internalType = Constants_1.HALF_FLOAT;
            }
            else {
                // Integers between 0 and 16777216 can be exactly represented by float32 (also applies for negative integers between −16777216 and 0)
                // This is sufficient for UNSIGNED_SHORT and SHORT types.
                // Large UNSIGNED_INT and INT cannot be represented by FLOAT type.
                if (internalType === Constants_1.INT || internalType === Constants_1.UNSIGNED_INT) {
                }
                console.warn("Falling back " + internalType + " type to FLOAT type for glsl1.x support for DataLayer \"" + name + "\".\nLarge UNSIGNED_INT or INT with absolute value > 16,777,216 are not supported, on mobile UNSIGNED_INT, INT, UNSIGNED_SHORT, and SHORT with absolute value > 2,048 may not be supported.");
                internalType = Constants_1.FLOAT;
            }
        }
        // Check if float32 supported.
        if (!utils_1.isWebGL2(gl)) {
            if (internalType === Constants_1.FLOAT) {
                var extension = extensions_1.getExtension(gl, extensions_1.OES_TEXTURE_FLOAT, errorCallback, true);
                if (!extension) {
                    console.warn("FLOAT not supported, falling back to HALF_FLOAT type for DataLayer \"" + name + "\".");
                    internalType = Constants_1.HALF_FLOAT;
                }
                // https://stackoverflow.com/questions/17476632/webgl-extension-support-across-browsers
                // Rendering to a floating-point texture may not be supported,
                // even if the OES_texture_float extension is supported.
                // Typically, this fails on current mobile hardware.
                // To check if this is supported, you have to call the WebGL
                // checkFramebufferStatus() function.
                if (writable) {
                    var valid = DataLayer.testFramebufferWrite({ gl: gl, type: internalType, glslVersion: glslVersion });
                    if (!valid && internalType !== Constants_1.HALF_FLOAT) {
                        console.warn("FLOAT not supported for writing operations, falling back to HALF_FLOAT type for DataLayer \"" + name + "\".");
                        internalType = Constants_1.HALF_FLOAT;
                    }
                }
            }
            // Must support at least half float if using a float type.
            if (internalType === Constants_1.HALF_FLOAT) {
                extensions_1.getExtension(gl, extensions_1.OES_TEXTURE_HALF_FLOAT, errorCallback);
                // TODO: https://stackoverflow.com/questions/54248633/cannot-create-half-float-oes-texture-from-uint16array-on-ipad
                if (writable) {
                    var valid = DataLayer.testFramebufferWrite({ gl: gl, type: internalType, glslVersion: glslVersion });
                    if (!valid) {
                        errorCallback("This browser does not support rendering to HALF_FLOAT textures.");
                    }
                }
            }
        }
        // Load additional extensions if needed.
        if (writable && utils_1.isWebGL2(gl) && (internalType === Constants_1.HALF_FLOAT || internalType === Constants_1.FLOAT)) {
            extensions_1.getExtension(gl, extensions_1.EXT_COLOR_BUFFER_FLOAT, errorCallback);
        }
        return internalType;
    };
    DataLayer.shouldCastIntTypeAsFloat = function (params) {
        var gl = params.gl, type = params.type, filter = params.filter, glslVersion = params.glslVersion;
        if (glslVersion === Constants_1.GLSL3 && utils_1.isWebGL2(gl))
            return false;
        // UNSIGNED_BYTE and LINEAR filtering is not supported, cast as float.
        if (type === Constants_1.UNSIGNED_BYTE && filter === Constants_1.LINEAR) {
            return true;
        }
        // Int textures (other than UNSIGNED_BYTE) are not supported by WebGL1.0 or glsl1.x.
        // https://stackoverflow.com/questions/55803017/how-to-select-webgl-glsl-sampler-type-from-texture-format-properties
        // Use HALF_FLOAT/FLOAT instead.
        return type === Constants_1.BYTE || type === Constants_1.SHORT || type === Constants_1.INT || type === Constants_1.UNSIGNED_SHORT || type === Constants_1.UNSIGNED_INT;
    };
    DataLayer.getGLTextureParameters = function (params) {
        var gl = params.gl, errorCallback = params.errorCallback, name = params.name, numComponents = params.numComponents, internalType = params.internalType, writable = params.writable, glslVersion = params.glslVersion;
        // https://www.khronos.org/registry/webgl/specs/latest/2.0/#TEXTURE_TYPES_FORMATS_FROM_DOM_ELEMENTS_TABLE
        var glType, glFormat, glInternalFormat, glNumChannels;
        if (utils_1.isWebGL2(gl)) {
            glNumChannels = numComponents;
            // https://www.khronos.org/registry/webgl/extensions/EXT_color_buffer_float/
            // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D
            // The sized internal format RGBxxx are not color-renderable for some reason.
            // If numComponents == 3 for a writable texture, use RGBA instead.
            // Page 5 of https://www.khronos.org/files/webgl20-reference-guide.pdf
            if (numComponents === 3 && writable) {
                glNumChannels = 4;
            }
            if (internalType === Constants_1.FLOAT || internalType === Constants_1.HALF_FLOAT) {
                switch (glNumChannels) {
                    case 1:
                        glFormat = gl.RED;
                        break;
                    case 2:
                        glFormat = gl.RG;
                        break;
                    case 3:
                        glFormat = gl.RGB;
                        break;
                    case 4:
                        glFormat = gl.RGBA;
                        break;
                    default:
                        throw new Error("Unsupported glNumChannels " + glNumChannels + " for DataLayer \"" + name + "\".");
                }
            }
            else if (glslVersion === Constants_1.GLSL1 && internalType === Constants_1.UNSIGNED_BYTE) {
                switch (glNumChannels) {
                    // For read only textures in WebGL 1.0, use gl.ALPHA and gl.LUMINANCE_ALPHA.
                    // Otherwise use RGB/RGBA.
                    case 1:
                        if (!writable) {
                            glFormat = gl.ALPHA;
                            break;
                        }
                    case 2:
                        if (!writable) {
                            glFormat = gl.LUMINANCE_ALPHA;
                            break;
                        }
                    case 3:
                        glFormat = gl.RGB;
                        glNumChannels = 3;
                        break;
                    case 4:
                        glFormat = gl.RGBA;
                        glNumChannels = 4;
                        break;
                    default:
                        throw new Error("Unsupported glNumChannels " + glNumChannels + " for DataLayer \"" + name + "\".");
                }
            }
            else {
                switch (glNumChannels) {
                    case 1:
                        glFormat = gl.RED_INTEGER;
                        break;
                    case 2:
                        glFormat = gl.RG_INTEGER;
                        break;
                    case 3:
                        glFormat = gl.RGB_INTEGER;
                        break;
                    case 4:
                        glFormat = gl.RGBA_INTEGER;
                        break;
                    default:
                        throw new Error("Unsupported glNumChannels " + glNumChannels + " for DataLayer \"" + name + "\".");
                }
            }
            switch (internalType) {
                case Constants_1.HALF_FLOAT:
                    glType = gl.HALF_FLOAT;
                    switch (glNumChannels) {
                        case 1:
                            glInternalFormat = gl.R16F;
                            break;
                        case 2:
                            glInternalFormat = gl.RG16F;
                            break;
                        case 3:
                            glInternalFormat = gl.RGB16F;
                            break;
                        case 4:
                            glInternalFormat = gl.RGBA16F;
                            break;
                        default:
                            throw new Error("Unsupported glNumChannels " + glNumChannels + " for DataLayer \"" + name + "\".");
                    }
                    break;
                case Constants_1.FLOAT:
                    glType = gl.FLOAT;
                    switch (glNumChannels) {
                        case 1:
                            glInternalFormat = gl.R32F;
                            break;
                        case 2:
                            glInternalFormat = gl.RG32F;
                            break;
                        case 3:
                            glInternalFormat = gl.RGB32F;
                            break;
                        case 4:
                            glInternalFormat = gl.RGBA32F;
                            break;
                        default:
                            throw new Error("Unsupported glNumChannels " + glNumChannels + " for DataLayer \"" + name + "\".");
                    }
                    break;
                case Constants_1.UNSIGNED_BYTE:
                    glType = gl.UNSIGNED_BYTE;
                    if (glslVersion === Constants_1.GLSL1 && internalType === Constants_1.UNSIGNED_BYTE) {
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
                            case 3:
                                glInternalFormat = gl.RGB8UI;
                                break;
                            case 4:
                                glInternalFormat = gl.RGBA8UI;
                                break;
                            default:
                                throw new Error("Unsupported glNumChannels " + glNumChannels + " for DataLayer \"" + name + "\".");
                        }
                    }
                    break;
                case Constants_1.BYTE:
                    glType = gl.BYTE;
                    switch (glNumChannels) {
                        case 1:
                            glInternalFormat = gl.R8I;
                            break;
                        case 2:
                            glInternalFormat = gl.RG8I;
                            break;
                        case 3:
                            glInternalFormat = gl.RGB8I;
                            break;
                        case 4:
                            glInternalFormat = gl.RGBA8I;
                            break;
                        default:
                            throw new Error("Unsupported glNumChannels " + glNumChannels + " for DataLayer \"" + name + "\".");
                    }
                    break;
                case Constants_1.SHORT:
                    glType = gl.SHORT;
                    switch (glNumChannels) {
                        case 1:
                            glInternalFormat = gl.R16I;
                            break;
                        case 2:
                            glInternalFormat = gl.RG16I;
                            break;
                        case 3:
                            glInternalFormat = gl.RGB16I;
                            break;
                        case 4:
                            glInternalFormat = gl.RGBA16I;
                            break;
                        default:
                            throw new Error("Unsupported glNumChannels " + glNumChannels + " for DataLayer \"" + name + "\".");
                    }
                    break;
                case Constants_1.UNSIGNED_SHORT:
                    glType = gl.UNSIGNED_SHORT;
                    switch (glNumChannels) {
                        case 1:
                            glInternalFormat = gl.R16UI;
                            break;
                        case 2:
                            glInternalFormat = gl.RG16UI;
                            break;
                        case 3:
                            glInternalFormat = gl.RGB16UI;
                            break;
                        case 4:
                            glInternalFormat = gl.RGBA16UI;
                            break;
                        default:
                            throw new Error("Unsupported glNumChannels " + glNumChannels + " for DataLayer \"" + name + "\".");
                    }
                    break;
                case Constants_1.INT:
                    glType = gl.INT;
                    switch (glNumChannels) {
                        case 1:
                            glInternalFormat = gl.R32I;
                            break;
                        case 2:
                            glInternalFormat = gl.RG32I;
                            break;
                        case 3:
                            glInternalFormat = gl.RGB32I;
                            break;
                        case 4:
                            glInternalFormat = gl.RGBA32I;
                            break;
                        default:
                            throw new Error("Unsupported glNumChannels " + glNumChannels + " for DataLayer \"" + name + "\".");
                    }
                    break;
                case Constants_1.UNSIGNED_INT:
                    glType = gl.UNSIGNED_INT;
                    switch (glNumChannels) {
                        case 1:
                            glInternalFormat = gl.R32UI;
                            break;
                        case 2:
                            glInternalFormat = gl.RG32UI;
                            break;
                        case 3:
                            glInternalFormat = gl.RGB32UI;
                            break;
                        case 4:
                            glInternalFormat = gl.RGBA32UI;
                            break;
                        default:
                            throw new Error("Unsupported glNumChannels " + glNumChannels + " for DataLayer \"" + name + "\".");
                    }
                    break;
                default:
                    throw new Error("Unsupported type " + internalType + " for DataLayer \"" + name + "\".");
            }
        }
        else {
            switch (numComponents) {
                // TODO: for read only textures in WebGL 1.0, we could use gl.ALPHA and gl.LUMINANCE_ALPHA here.
                case 1:
                    if (!writable) {
                        glFormat = gl.ALPHA;
                        break;
                    }
                case 2:
                    if (!writable) {
                        glFormat = gl.LUMINANCE_ALPHA;
                        break;
                    }
                case 3:
                    glFormat = gl.RGB;
                    glInternalFormat = gl.RGB;
                    glNumChannels = 3;
                    break;
                case 4:
                    glFormat = gl.RGBA;
                    glInternalFormat = gl.RGBA;
                    glNumChannels = 4;
                    break;
                default:
                    throw new Error("Unsupported numComponents " + numComponents + " for DataLayer \"" + name + "\".");
            }
            switch (internalType) {
                case Constants_1.FLOAT:
                    glType = gl.FLOAT;
                    break;
                case Constants_1.HALF_FLOAT:
                    glType = gl.HALF_FLOAT || extensions_1.getExtension(gl, extensions_1.OES_TEXTURE_HALF_FLOAT, errorCallback).HALF_FLOAT_OES;
                    break;
                case Constants_1.UNSIGNED_BYTE:
                    glType = gl.UNSIGNED_BYTE;
                    break;
                // No other types are supported in glsl1.x
                default:
                    throw new Error("Unsupported type " + internalType + " in WebGL 1.0 for DataLayer \"" + name + "\".");
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
            throw new Error("Invalid type: " + internalType + " for numComponents " + numComponents + ", unable to init parameter" + (missingParams.length > 1 ? 's' : '') + " " + missingParams.join(', ') + " for DataLayer \"" + name + "\".");
        }
        if (glNumChannels === undefined || numComponents < 1 || numComponents > 4 || glNumChannels < numComponents) {
            throw new Error("Invalid numChannels " + glNumChannels + " for numComponents " + numComponents + " for DataLayer \"" + name + "\".");
        }
        return {
            glFormat: glFormat,
            glInternalFormat: glInternalFormat,
            glType: glType,
            glNumChannels: glNumChannels,
        };
    };
    DataLayer.testFramebufferWrite = function (params) {
        var gl = params.gl, type = params.type, glslVersion = params.glslVersion;
        var texture = gl.createTexture();
        if (!texture) {
            return false;
        }
        gl.bindTexture(gl.TEXTURE_2D, texture);
        // Default to most widely supported settings.
        var wrapS = gl[Constants_1.CLAMP_TO_EDGE];
        var wrapT = gl[Constants_1.CLAMP_TO_EDGE];
        var filter = gl[Constants_1.NEAREST];
        // Use non-power of two dimensions to check for more universal support.
        // (In case size of DataLayer is changed at a later point).
        var width = 100;
        var height = 100;
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
        var _a = DataLayer.getGLTextureParameters({
            gl: gl,
            name: 'testFramebufferWrite',
            numComponents: 1,
            writable: true,
            internalType: type,
            glslVersion: glslVersion,
            errorCallback: function () { },
        }), glInternalFormat = _a.glInternalFormat, glFormat = _a.glFormat, glType = _a.glType;
        gl.texImage2D(gl.TEXTURE_2D, 0, glInternalFormat, width, height, 0, glFormat, glType, null);
        // Init a framebuffer for this texture so we can write to it.
        var framebuffer = gl.createFramebuffer();
        if (!framebuffer) {
            // Clear out allocated memory.
            gl.deleteTexture(texture);
            return false;
        }
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/framebufferTexture2D
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        var validStatus = status === gl.FRAMEBUFFER_COMPLETE;
        // Clear out allocated memory.
        gl.deleteTexture(texture);
        gl.deleteFramebuffer(framebuffer);
        return validStatus;
    };
    Object.defineProperty(DataLayer.prototype, "bufferIndex", {
        get: function () {
            return this._bufferIndex;
        },
        enumerable: false,
        configurable: true
    });
    DataLayer.prototype.saveCurrentStateToDataLayer = function (layer) {
        // A method for saving a copy of the current state without a draw call.
        // Draw calls are expensive, this optimization helps.
        if (this.numBuffers < 2) {
            throw new Error("Can't call DataLayer.saveCurrentStateToDataLayer on DataLayer " + this.name + " with less than 2 buffers.");
        }
        if (!this.writable) {
            throw new Error("Can't call DataLayer.saveCurrentStateToDataLayer on read-only DataLayer " + this.name + ".");
        }
        if (layer.writable) {
            throw new Error("Can't call DataLayer.saveCurrentStateToDataLayer on DataLayer " + this.name + " using writable DataLayer " + layer.name + ".");
        }
        // Check that texture params are the same.
        if (layer.glWrapS !== this.glWrapS || layer.glWrapT !== this.glWrapT ||
            layer.wrapS !== this.wrapS || layer.wrapT !== this.wrapT ||
            layer.width !== this.width || layer.height !== this.height ||
            layer.glFilter !== this.glFilter || layer.filter !== this.filter ||
            layer.glNumChannels !== this.glNumChannels || layer.numComponents !== this.numComponents ||
            layer.glType !== this.glType || layer.type !== this.type ||
            layer.glFormat !== this.glFormat || layer.glInternalFormat !== this.glInternalFormat) {
            throw new Error("Incompatible texture params between DataLayers " + layer.name + " and " + this.name + ".");
        }
        // If we have not already inited overrides array, do so now.
        if (!this.textureOverrides) {
            this.textureOverrides = [];
            for (var i = 0; i < this.numBuffers; i++) {
                this.textureOverrides.push(undefined);
            }
        }
        // Check if we already have an override in place.
        if (this.textureOverrides[this._bufferIndex]) {
            throw new Error("Can't call DataLayer.saveCurrentStateToDataLayer on DataLayer " + this.name + ", this DataLayer has not written new state since last call to DataLayer.saveCurrentStateToDataLayer.");
        }
        var currentState = this.getCurrentStateTexture();
        this.textureOverrides[this._bufferIndex] = currentState;
        // Swap textures.
        this.buffers[this._bufferIndex].texture = layer.getCurrentStateTexture();
        layer._setCurrentStateTexture(currentState);
        // Bind swapped texture to framebuffer.
        var gl = this.gl;
        var _a = this.buffers[this._bufferIndex], framebuffer = _a.framebuffer, texture = _a.texture;
        if (!framebuffer)
            throw new Error("No framebuffer for writable DataLayer " + this.name + ".");
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/framebufferTexture2D
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        // Unbind.
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    };
    DataLayer.prototype._setCurrentStateTexture = function (texture) {
        if (this.writable) {
            throw new Error("Can't call DataLayer._setCurrentStateTexture on writable texture " + this.name + ".");
        }
        this.buffers[this._bufferIndex].texture = texture;
    };
    DataLayer.prototype.validateDataArray = function (_data) {
        if (!_data) {
            return;
        }
        var _a = this, width = _a.width, height = _a.height, length = _a.length, numComponents = _a.numComponents, glNumChannels = _a.glNumChannels, type = _a.type, internalType = _a.internalType, name = _a.name;
        // Check that data is correct length (user error).
        if ((length && _data.length !== length * numComponents) || (!length && _data.length !== width * height * numComponents)) {
            throw new Error("Invalid data length " + _data.length + " for DataLayer \"" + name + "\" of size " + (length ? length : width + "x" + height) + "x" + numComponents + ".");
        }
        // Check that data is correct type (user error).
        var invalidTypeFound = false;
        switch (type) {
            case Constants_1.HALF_FLOAT:
            // Since there is no Float16Array, we must use Float32Arrays to init texture.
            // Continue to next case.
            case Constants_1.FLOAT:
                invalidTypeFound = invalidTypeFound || _data.constructor !== Float32Array;
                break;
            case Constants_1.UNSIGNED_BYTE:
                invalidTypeFound = invalidTypeFound || _data.constructor !== Uint8Array;
                break;
            case Constants_1.BYTE:
                invalidTypeFound = invalidTypeFound || _data.constructor !== Int8Array;
                break;
            case Constants_1.UNSIGNED_SHORT:
                invalidTypeFound = invalidTypeFound || _data.constructor !== Uint16Array;
                break;
            case Constants_1.SHORT:
                invalidTypeFound = invalidTypeFound || _data.constructor !== Int16Array;
                break;
            case Constants_1.UNSIGNED_INT:
                invalidTypeFound = invalidTypeFound || _data.constructor !== Uint32Array;
                break;
            case Constants_1.INT:
                invalidTypeFound = invalidTypeFound || _data.constructor !== Int32Array;
                break;
            default:
                throw new Error("Error initing DataLayer \"" + name + "\".  Unsupported type \"" + type + "\" for WebGLCompute.initDataLayer.");
        }
        if (invalidTypeFound) {
            throw new Error("Invalid TypedArray of type " + _data.constructor.name + " supplied to DataLayer \"" + name + "\" of type \"" + type + "\".");
        }
        var data = _data;
        var imageSize = width * height * glNumChannels;
        // Then check if array needs to be lengthened.
        // This could be because glNumChannels !== numComponents.
        // Or because length !== width * height.
        var incorrectSize = data.length !== imageSize;
        // We have to handle the case of Float16 specially by converting data to Uint16Array.
        var handleFloat16 = internalType === Constants_1.HALF_FLOAT;
        // For webgl1.0 we may need to cast an int type to a FLOAT or HALF_FLOAT.
        var shouldTypeCast = type !== internalType;
        if (shouldTypeCast || incorrectSize || handleFloat16) {
            switch (internalType) {
                case Constants_1.HALF_FLOAT:
                    data = new Uint16Array(imageSize);
                    break;
                case Constants_1.FLOAT:
                    data = new Float32Array(imageSize);
                    break;
                case Constants_1.UNSIGNED_BYTE:
                    data = new Uint8Array(imageSize);
                    break;
                case Constants_1.BYTE:
                    data = new Int8Array(imageSize);
                    break;
                case Constants_1.UNSIGNED_SHORT:
                    data = new Uint16Array(imageSize);
                    break;
                case Constants_1.SHORT:
                    data = new Int16Array(imageSize);
                    break;
                case Constants_1.UNSIGNED_INT:
                    data = new Uint32Array(imageSize);
                    break;
                case Constants_1.INT:
                    data = new Int32Array(imageSize);
                    break;
                default:
                    throw new Error("Error initing " + name + ".  Unsupported internalType " + internalType + " for WebGLCompute.initDataLayer.");
            }
            // Fill new data array with old data.
            var view = handleFloat16 ? new DataView(data.buffer) : null;
            for (var i = 0, _len = _data.length / numComponents; i < _len; i++) {
                for (var j = 0; j < numComponents; j++) {
                    var value = _data[i * numComponents + j];
                    var index = i * glNumChannels + j;
                    if (handleFloat16) {
                        float16_1.setFloat16(view, 2 * index, value, true);
                    }
                    else {
                        data[index] = value;
                    }
                }
            }
        }
        return data;
    };
    DataLayer.prototype.initBuffers = function (_data) {
        var _a = this, name = _a.name, numBuffers = _a.numBuffers, gl = _a.gl, width = _a.width, height = _a.height, glInternalFormat = _a.glInternalFormat, glFormat = _a.glFormat, glType = _a.glType, glFilter = _a.glFilter, glWrapS = _a.glWrapS, glWrapT = _a.glWrapT, writable = _a.writable, errorCallback = _a.errorCallback;
        var data = this.validateDataArray(_data);
        // Init a texture for each buffer.
        for (var i = 0; i < numBuffers; i++) {
            var texture = gl.createTexture();
            if (!texture) {
                errorCallback("Could not init texture for DataLayer \"" + name + "\": " + gl.getError() + ".");
                return;
            }
            gl.bindTexture(gl.TEXTURE_2D, texture);
            // TODO: are there other params to look into:
            // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, glWrapS);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, glWrapT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, glFilter);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, glFilter);
            gl.texImage2D(gl.TEXTURE_2D, 0, glInternalFormat, width, height, 0, glFormat, glType, data ? data : null);
            var buffer = {
                texture: texture,
            };
            if (writable) {
                // Init a framebuffer for this texture so we can write to it.
                var framebuffer = gl.createFramebuffer();
                if (!framebuffer) {
                    errorCallback("Could not init framebuffer for DataLayer \"" + name + "\": " + gl.getError() + ".");
                    return;
                }
                gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
                // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/framebufferTexture2D
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
                var status_1 = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
                if (status_1 != gl.FRAMEBUFFER_COMPLETE) {
                    errorCallback("Invalid status for framebuffer for DataLayer \"" + name + "\": " + status_1 + ".");
                }
                // Add framebuffer.
                buffer.framebuffer = framebuffer;
            }
            // Save this buffer to the list.
            this.buffers.push(buffer);
        }
        // Unbind.
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    };
    DataLayer.prototype.getCurrentStateTexture = function () {
        if (this.textureOverrides && this.textureOverrides[this._bufferIndex])
            return this.textureOverrides[this._bufferIndex];
        return this.buffers[this._bufferIndex].texture;
    };
    DataLayer.prototype.getPreviousStateTexture = function (index) {
        if (index === void 0) { index = -1; }
        if (this.numBuffers === 1) {
            throw new Error("Cannot call getPreviousStateTexture on DataLayer \"" + this.name + "\" with only one buffer.");
        }
        var previousIndex = this._bufferIndex + index + this.numBuffers;
        if (previousIndex < 0 || previousIndex >= this.numBuffers) {
            throw new Error("Invalid index " + index + " passed to getPreviousStateTexture on DataLayer " + this.name + " with " + this.numBuffers + " buffers.");
        }
        if (this.textureOverrides && this.textureOverrides[previousIndex])
            return this.textureOverrides[previousIndex];
        return this.buffers[previousIndex].texture;
    };
    DataLayer.prototype._usingTextureOverrideForCurrentBuffer = function () {
        return this.textureOverrides && this.textureOverrides[this.bufferIndex];
    };
    DataLayer.prototype._bindOutputBufferForWrite = function (incrementBufferIndex) {
        var gl = this.gl;
        if (incrementBufferIndex) {
            // Increment bufferIndex.
            this._bufferIndex = (this._bufferIndex + 1) % this.numBuffers;
        }
        this._bindOutputBuffer();
        // We are going to do a data write, if we have overrides enabled, we can remove them.
        if (this.textureOverrides) {
            this.textureOverrides[this._bufferIndex] = undefined;
        }
    };
    DataLayer.prototype._bindOutputBuffer = function () {
        var gl = this.gl;
        var framebuffer = this.buffers[this._bufferIndex].framebuffer;
        if (!framebuffer) {
            throw new Error("DataLayer \"" + this.name + "\" is not writable.");
        }
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    };
    DataLayer.prototype.setData = function (data) {
        // TODO: Rather than destroying buffers, we could write to certain window.
        this.destroyBuffers();
        this.initBuffers(data);
    };
    DataLayer.prototype.resize = function (dimensions, data) {
        var _a = DataLayer.calcSize(dimensions, this.name), length = _a.length, width = _a.width, height = _a.height;
        this.length = length;
        this.width = width;
        this.height = height;
        this.destroyBuffers();
        this.initBuffers(data);
    };
    DataLayer.prototype.clear = function () {
        // Reset everything to zero.
        // TODO: This is not the most efficient way to do this (reallocating all textures and framebuffers), but ok for now.
        this.destroyBuffers();
        this.initBuffers();
    };
    DataLayer.prototype.getDimensions = function () {
        return [
            this.width,
            this.height,
        ];
    };
    DataLayer.prototype.getLength = function () {
        if (!this.length) {
            throw new Error("Cannot call getLength() on 2D DataLayer \"" + this.name + "\".");
        }
        return this.length;
    };
    DataLayer.prototype.destroyBuffers = function () {
        var _a = this, gl = _a.gl, buffers = _a.buffers;
        buffers.forEach(function (buffer) {
            var framebuffer = buffer.framebuffer, texture = buffer.texture;
            gl.deleteTexture(texture);
            if (framebuffer) {
                gl.deleteFramebuffer(framebuffer);
            }
            // @ts-ignore
            delete buffer.texture;
            delete buffer.framebuffer;
        });
        buffers.length = 0;
        // These are technically owned by another DataLayer,
        // so we are not responsible for deleting them from gl context.
        delete this.textureOverrides;
    };
    DataLayer.prototype.destroy = function () {
        this.destroyBuffers();
        // @ts-ignore
        delete this.gl;
        // @ts-ignore
        delete this.errorCallback;
    };
    return DataLayer;
}());
exports.DataLayer = DataLayer;


/***/ }),

/***/ "./src/GPUProgram.ts":
/*!***************************!*\
  !*** ./src/GPUProgram.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GPUProgram = void 0;
var Checks_1 = __webpack_require__(/*! ./Checks */ "./src/Checks.ts");
var Constants_1 = __webpack_require__(/*! ./Constants */ "./src/Constants.ts");
var utils_1 = __webpack_require__(/*! ./utils */ "./src/utils.ts");
var DEFAULT_PROGRAM_NAME = 'DEFAULT';
var DEFAULT_W_UV_PROGRAM_NAME = 'DEFAULT_W_UV';
var DEFAULT_W_NORMAL_PROGRAM_NAME = 'DEFAULT_W_NORMAL';
var DEFAULT_W_UV_NORMAL_PROGRAM_NAME = 'DEFAULT_W_UV_NORMAL';
var SEGMENT_PROGRAM_NAME = 'SEGMENT';
var DATA_LAYER_POINTS_PROGRAM_NAME = 'DATA_LAYER_POINTS';
var DATA_LAYER_LINES_PROGRAM_NAME = 'DATA_LAYER_LINES';
var DATA_LAYER_VECTOR_FIELD_PROGRAM_NAME = 'DATA_LAYER_VECTOR_FIELD';
var vertexShaders = (_a = {},
    _a[DEFAULT_PROGRAM_NAME] = {
        src_1: './glsl_1/DefaultVertexShader.glsl',
        src_3: './glsl_3/DefaultVertexShader.glsl',
    },
    _a[DEFAULT_W_UV_PROGRAM_NAME] = {
        src_1: './glsl_1/DefaultVertexShader.glsl',
        src_3: './glsl_3/DefaultVertexShader.glsl',
        defines: {
            'UV_ATTRIBUTE': '1',
        },
    },
    _a[DEFAULT_W_NORMAL_PROGRAM_NAME] = {
        src_1: './glsl_1/DefaultVertexShader.glsl',
        src_3: './glsl_3/DefaultVertexShader.glsl',
        defines: {
            'NORMAL_ATTRIBUTE': '1',
        },
    },
    _a[DEFAULT_W_UV_NORMAL_PROGRAM_NAME] = {
        src_1: './glsl_1/DefaultVertexShader.glsl',
        src_3: './glsl_3/DefaultVertexShader.glsl',
        defines: {
            'UV_ATTRIBUTE': '1',
            'NORMAL_ATTRIBUTE': '1',
        },
    },
    _a[SEGMENT_PROGRAM_NAME] = {
        src_1: './glsl_1/SegmentVertexShader.glsl',
        src_3: './glsl_3/SegmentVertexShader.glsl',
    },
    _a[DATA_LAYER_POINTS_PROGRAM_NAME] = {
        src_1: './glsl_1/DataLayerPointsVertexShader.glsl',
        src_3: './glsl_3/DataLayerPointsVertexShader.glsl',
    },
    _a[DATA_LAYER_VECTOR_FIELD_PROGRAM_NAME] = {
        src_1: './glsl_1/DataLayerVectorFieldVertexShader.glsl',
        src_3: './glsl_3/DataLayerVectorFieldVertexShader.glsl',
    },
    _a[DATA_LAYER_LINES_PROGRAM_NAME] = {
        src_1: './glsl_1/DataLayerLinesVertexShader.glsl',
        src_3: './glsl_3/DataLayerLinesVertexShader.glsl',
    },
    _a);
var GPUProgram = /** @class */ (function () {
    function GPUProgram(params) {
        this.uniforms = {};
        // Store gl programs.
        this.programs = {};
        var gl = params.gl, errorCallback = params.errorCallback, name = params.name, fragmentShader = params.fragmentShader, glslVersion = params.glslVersion, uniforms = params.uniforms, defines = params.defines;
        // Save arguments.
        this.gl = gl;
        this.errorCallback = errorCallback;
        this.name = name;
        this.glslVersion = glslVersion;
        // Compile fragment shader.
        if (typeof (fragmentShader) === 'string' || typeof (fragmentShader[0]) === 'string') {
            var sourceString = typeof (fragmentShader) === 'string' ?
                fragmentShader :
                fragmentShader.join('\n');
            if (defines) {
                sourceString = GPUProgram.convertDefinesToString(defines) + sourceString;
            }
            var shader = utils_1.compileShader(gl, errorCallback, sourceString, gl.FRAGMENT_SHADER, name);
            if (!shader) {
                errorCallback("Unable to compile fragment shader for program \"" + name + "\".");
                return;
            }
            this.fragmentShader = shader;
        }
        else {
            if (defines) {
                throw new Error("Unable to attach defines to program \"" + name + "\" because fragment shader is already compiled.");
            }
        }
        if (uniforms) {
            for (var i = 0; i < (uniforms === null || uniforms === void 0 ? void 0 : uniforms.length); i++) {
                var _a = uniforms[i], name_1 = _a.name, value = _a.value, dataType = _a.dataType;
                this.setUniform(name_1, value, dataType);
            }
        }
    }
    GPUProgram.convertDefinesToString = function (defines) {
        var definesSource = '';
        var keys = Object.keys(defines);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            // Check that define is passed in as a string.
            if (!Checks_1.isString(key) || !Checks_1.isString(defines[key])) {
                throw new Error("GPUProgram defines must be passed in as key value pairs that are both strings, got key value pair of type " + typeof key + " : " + typeof defines[key] + ".");
            }
            definesSource += "#define " + key + " " + defines[key] + "\n";
        }
        return definesSource;
    };
    GPUProgram.prototype.initProgram = function (vertexShader, programName) {
        var _a = this, gl = _a.gl, fragmentShader = _a.fragmentShader, errorCallback = _a.errorCallback, uniforms = _a.uniforms;
        // Create a program.
        var program = gl.createProgram();
        if (!program) {
            errorCallback("Unable to init gl program: " + name + ".");
            return;
        }
        // TODO: check that attachShader worked.
        gl.attachShader(program, fragmentShader);
        gl.attachShader(program, vertexShader);
        // Link the program.
        gl.linkProgram(program);
        // Check if it linked.
        var success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!success) {
            // Something went wrong with the link.
            errorCallback("Program \"" + name + "\" failed to link: " + gl.getProgramInfoLog(program));
            return;
        }
        // If we have any uniforms set for this GPUProgram, add those to WebGLProgram we just inited.
        var uniformNames = Object.keys(uniforms);
        for (var i = 0; i < uniformNames.length; i++) {
            var uniformName = uniformNames[i];
            var uniform = uniforms[uniformName];
            var value = uniform.value, type = uniform.type;
            this.setProgramUniform(program, programName, uniformName, value, type);
        }
        return program;
    };
    GPUProgram.prototype.getProgramWithName = function (name) {
        if (this.programs[name])
            return this.programs[name];
        var errorCallback = this.errorCallback;
        var vertexShader = vertexShaders[name];
        if (vertexShader.shader === undefined) {
            var _a = this, gl = _a.gl, name_2 = _a.name, glslVersion = _a.glslVersion;
            // Init a vertex shader.
            var vertexShaderSource = __webpack_require__("./src sync recursive")(glslVersion === Constants_1.GLSL3 ? vertexShader.src_3 : vertexShader.src_1);
            if (vertexShader.defines) {
                vertexShaderSource = GPUProgram.convertDefinesToString(vertexShader.defines) + vertexShaderSource;
            }
            var shader = utils_1.compileShader(gl, errorCallback, vertexShaderSource, gl.VERTEX_SHADER, name_2);
            if (!shader) {
                errorCallback("Unable to compile default vertex shader for program \"" + name_2 + "\".");
                return;
            }
            vertexShader.shader = shader;
        }
        var program = this.initProgram(vertexShader.shader, DEFAULT_PROGRAM_NAME);
        if (program === undefined) {
            errorCallback("Unable to init program \"" + name + "\".");
            return;
        }
        this.programs[name] = program;
        return program;
    };
    Object.defineProperty(GPUProgram.prototype, "defaultProgram", {
        get: function () {
            return this.getProgramWithName(DEFAULT_PROGRAM_NAME);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GPUProgram.prototype, "defaultProgramWithUV", {
        get: function () {
            return this.getProgramWithName(DEFAULT_W_UV_PROGRAM_NAME);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GPUProgram.prototype, "defaultProgramWithNormal", {
        get: function () {
            return this.getProgramWithName(DEFAULT_W_NORMAL_PROGRAM_NAME);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GPUProgram.prototype, "defaultProgramWithUVNormal", {
        get: function () {
            return this.getProgramWithName(DEFAULT_W_UV_NORMAL_PROGRAM_NAME);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GPUProgram.prototype, "segmentProgram", {
        get: function () {
            return this.getProgramWithName(SEGMENT_PROGRAM_NAME);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GPUProgram.prototype, "dataLayerPointsProgram", {
        get: function () {
            return this.getProgramWithName(DATA_LAYER_POINTS_PROGRAM_NAME);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GPUProgram.prototype, "dataLayerVectorFieldProgram", {
        get: function () {
            return this.getProgramWithName(DATA_LAYER_VECTOR_FIELD_PROGRAM_NAME);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GPUProgram.prototype, "dataLayerLinesProgram", {
        get: function () {
            return this.getProgramWithName(DATA_LAYER_LINES_PROGRAM_NAME);
        },
        enumerable: false,
        configurable: true
    });
    GPUProgram.prototype.uniformTypeForValue = function (value, dataType) {
        if (dataType === Constants_1.FLOAT) {
            // Check that we are dealing with a number.
            if (Checks_1.isArray(value)) {
                for (var i = 0; i < value.length; i++) {
                    if (!Checks_1.isNumber(value[i])) {
                        throw new Error("Invalid uniform value: " + value + " for program \"" + this.name + "\", expected float or float[] of length 1-4.");
                    }
                }
            }
            else {
                if (!Checks_1.isNumber(value)) {
                    throw new Error("Invalid uniform value: " + value + " for program \"" + this.name + "\", expected float or float[] of length 1-4.");
                }
            }
            if (!Checks_1.isArray(value) || value.length === 1) {
                return Constants_1.FLOAT_1D_UNIFORM;
            }
            if (value.length === 2) {
                return Constants_1.FLOAT_2D_UNIFORM;
            }
            if (value.length === 3) {
                return Constants_1.FLOAT_3D_UNIFORM;
            }
            if (value.length === 4) {
                return Constants_1.FLOAT_4D_UNIFORM;
            }
            throw new Error("Invalid uniform value: " + value + " for program \"" + this.name + "\", expected float or float[] of length 1-4.");
        }
        else if (dataType === Constants_1.INT) {
            // Check that we are dealing with an int.
            if (Checks_1.isArray(value)) {
                for (var i = 0; i < value.length; i++) {
                    if (!Checks_1.isInteger(value[i])) {
                        throw new Error("Invalid uniform value: " + value + " for program \"" + this.name + "\", expected int or int[] of length 1-4.");
                    }
                }
            }
            else {
                if (!Checks_1.isInteger(value)) {
                    throw new Error("Invalid uniform value: " + value + " for program \"" + this.name + "\", expected int or int[] of length 1-4.");
                }
            }
            if (!Checks_1.isArray(value) || value.length === 1) {
                return Constants_1.INT_1D_UNIFORM;
            }
            if (value.length === 2) {
                return Constants_1.INT_2D_UNIFORM;
            }
            if (value.length === 3) {
                return Constants_1.INT_3D_UNIFORM;
            }
            if (value.length === 4) {
                return Constants_1.INT_4D_UNIFORM;
            }
            throw new Error("Invalid uniform value: " + value + " for program \"" + this.name + "\", expected int or int[] of length 1-4.");
        }
        else {
            throw new Error("Invalid uniform data type: " + dataType + " for program \"" + this.name + "\", expected " + Constants_1.FLOAT + " or " + Constants_1.INT + ".");
        }
    };
    GPUProgram.prototype.setProgramUniform = function (program, programName, uniformName, value, type) {
        var _a;
        var _b = this, gl = _b.gl, uniforms = _b.uniforms, errorCallback = _b.errorCallback;
        // Set active program.
        gl.useProgram(program);
        var location = (_a = uniforms[uniformName]) === null || _a === void 0 ? void 0 : _a.location[programName];
        // Init a location for WebGLProgram if needed.
        if (location === undefined) {
            var _location = gl.getUniformLocation(program, uniformName);
            if (!_location) {
                errorCallback("Could not init uniform \"" + uniformName + "\" for program \"" + this.name + "\".\nCheck that uniform is present in shader code, unused uniforms may be removed by compiler.\nAlso check that uniform type in shader code matches type " + type + ".\nError code: " + gl.getError() + ".");
                return;
            }
            location = _location;
            // Save location for future use.
            if (uniforms[uniformName]) {
                uniforms[uniformName].location[programName] = location;
            }
        }
        // Set uniform.
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/uniform
        switch (type) {
            case Constants_1.FLOAT_1D_UNIFORM:
                gl.uniform1f(location, value);
                break;
            case Constants_1.FLOAT_2D_UNIFORM:
                gl.uniform2fv(location, value);
                break;
            case Constants_1.FLOAT_3D_UNIFORM:
                gl.uniform3fv(location, value);
                break;
            case Constants_1.FLOAT_4D_UNIFORM:
                gl.uniform4fv(location, value);
                break;
            case Constants_1.INT_1D_UNIFORM:
                gl.uniform1i(location, value);
                break;
            case Constants_1.INT_2D_UNIFORM:
                gl.uniform2iv(location, value);
                break;
            case Constants_1.INT_3D_UNIFORM:
                gl.uniform3iv(location, value);
                break;
            case Constants_1.INT_4D_UNIFORM:
                gl.uniform4iv(location, value);
                break;
            default:
                throw new Error("Unknown uniform type " + type + " for GPUProgram \"" + this.name + "\".");
        }
    };
    GPUProgram.prototype.setUniform = function (uniformName, value, dataType) {
        var _a;
        var _b = this, programs = _b.programs, uniforms = _b.uniforms;
        var type = (_a = uniforms[uniformName]) === null || _a === void 0 ? void 0 : _a.type;
        if (dataType) {
            var typeParam = this.uniformTypeForValue(value, dataType);
            if (type === undefined)
                type = typeParam;
            else {
                // console.warn(`Don't need to pass in dataType to GPUProgram.setUniform for previously inited uniform "${uniformName}"`);
                // Check that types match previously set uniform.
                if (type !== typeParam) {
                    throw new Error("Uniform \"" + uniformName + "\" for GPUProgram \"" + this.name + "\" cannot change from type " + type + " to type " + typeParam + ".");
                }
            }
        }
        if (type === undefined) {
            throw new Error("Unknown type for uniform \"" + uniformName + "\", please pass in dataType to GPUProgram.setUniform when initing a new uniform.");
        }
        if (!uniforms[uniformName]) {
            // Init uniform if needed.
            uniforms[uniformName] = { type: type, location: {}, value: value };
        }
        else {
            // Update value.
            uniforms[uniformName].value = value;
        }
        // Update any active programs.
        var keys = Object.keys(programs);
        for (var i = 0; i < keys.length; i++) {
            var programName = keys[i];
            this.setProgramUniform(programs[programName], programName, uniformName, value, type);
        }
    };
    ;
    GPUProgram.prototype.setVertexUniform = function (program, uniformName, value, dataType) {
        var _this = this;
        var type = this.uniformTypeForValue(value, dataType);
        if (program === undefined) {
            throw new Error('Must pass in valid WebGLProgram to setVertexUniform, got undefined.');
        }
        var programName = Object.keys(this.programs).find(function (key) { return _this.programs[key] === program; });
        if (!programName) {
            throw new Error("Could not find valid vertex programName for WebGLProgram \"" + this.name + "\".");
        }
        this.setProgramUniform(program, programName, uniformName, value, type);
    };
    GPUProgram.prototype.destroy = function () {
        var _this = this;
        var _a = this, gl = _a.gl, fragmentShader = _a.fragmentShader, programs = _a.programs;
        // Unbind all gl data before deleting.
        Object.values(programs).forEach(function (program) {
            gl.deleteProgram(program);
        });
        Object.keys(this.programs).forEach(function (key) {
            delete _this.programs[key];
        });
        // From https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/deleteShader
        // This method has no effect if the shader has already been deleted
        gl.deleteShader(fragmentShader);
        // @ts-ignore
        delete this.fragmentShader;
        // @ts-ignore
        delete this.gl;
        // @ts-ignore
        delete this.errorCallback;
    };
    return GPUProgram;
}());
exports.GPUProgram = GPUProgram;


/***/ }),

/***/ "./src/WebGLCompute.ts":
/*!*****************************!*\
  !*** ./src/WebGLCompute.ts ***!
  \*****************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WebGLCompute = void 0;
var file_saver_1 = __webpack_require__(/*! file-saver */ "./node_modules/file-saver/dist/FileSaver.min.js");
// @ts-ignore
var changedpi_1 = __webpack_require__(/*! changedpi */ "./node_modules/changedpi/dist/index.js");
var DataLayer_1 = __webpack_require__(/*! ./DataLayer */ "./src/DataLayer.ts");
var Constants_1 = __webpack_require__(/*! ./Constants */ "./src/Constants.ts");
var GPUProgram_1 = __webpack_require__(/*! ./GPUProgram */ "./src/GPUProgram.ts");
var utils = __webpack_require__(/*! ./utils/Vector4 */ "./src/utils/Vector4.ts");
var utils_1 = __webpack_require__(/*! ./utils */ "./src/utils.ts");
var float16_1 = __webpack_require__(/*! @petamoriken/float16 */ "./node_modules/@petamoriken/float16/src/index.js");
var Checks_1 = __webpack_require__(/*! ./Checks */ "./src/Checks.ts");
var DEFAULT_CIRCLE_NUM_SEGMENTS = 18; // Must be divisible by 6 to work with stepSegment().
var WebGLCompute = /** @class */ (function () {
    function WebGLCompute(params, 
    // Optionally pass in an error callback in case we want to handle errors related to webgl support.
    // e.g. throw up a modal telling user this will not work on their device.
    errorCallback, renderer) {
        if (errorCallback === void 0) { errorCallback = function (message) { throw new Error(message); }; }
        this.errorState = false;
        // Store multiple circle positions buffers for various num segments, use numSegments as key.
        this._circlePositionsBuffer = {};
        // Check params.
        var validKeys = ['canvas', 'context', 'antialias', 'glslVersion'];
        Object.keys(params).forEach(function (key) {
            if (validKeys.indexOf(key) < 0) {
                throw new Error("Invalid key " + key + " passed to WebGLCompute.constructor.  Valid keys are " + validKeys.join(', ') + ".");
            }
        });
        // Save callback in case we run into an error.
        var self = this;
        this.errorCallback = function (message) {
            if (self.errorState) {
                return;
            }
            self.errorState = true;
            errorCallback(message);
        };
        var canvas = params.canvas;
        var gl = params.context;
        // Init GL.
        if (!gl) {
            var options = {};
            if (params.antialias !== undefined)
                options.antialias = params.antialias;
            // Init a gl context if not passed in.
            gl = canvas.getContext('webgl2', options)
                || canvas.getContext('webgl', options)
                || canvas.getContext('experimental-webgl', options);
            if (gl === null) {
                this.errorCallback('Unable to initialize WebGL context.');
                return;
            }
        }
        if (utils_1.isWebGL2(gl)) {
            console.log('Using WebGL 2.0 context.');
        }
        else {
            console.log('Using WebGL 1.0 context.');
        }
        this.gl = gl;
        this.renderer = renderer;
        // Save glsl version, default to 1.x.
        var glslVersion = params.glslVersion === undefined ? Constants_1.GLSL1 : params.glslVersion;
        this.glslVersion = glslVersion;
        if (!utils_1.isWebGL2(gl) && glslVersion === Constants_1.GLSL3) {
            console.warn('GLSL3.x is incompatible with WebGL1.0 contexts.');
        }
        // GL setup.
        // Disable depth testing globally.
        gl.disable(gl.DEPTH_TEST);
        // Set unpack alignment to 1 so we can have textures of arbitrary dimensions.
        // https://stackoverflow.com/questions/51582282/error-when-creating-textures-in-webgl-with-the-rgb-format
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
        // TODO: look into more of these: https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/pixelStorei
        // // Some implementations of HTMLCanvasElement's or OffscreenCanvas's CanvasRenderingContext2D store color values
        // // internally in premultiplied form. If such a canvas is uploaded to a WebGL texture with the
        // // UNPACK_PREMULTIPLY_ALPHA_WEBGL pixel storage parameter set to false, the color channels will have to be un-multiplied
        // // by the alpha channel, which is a lossy operation. The WebGL implementation therefore can not guarantee that colors
        // // with alpha < 1.0 will be preserved losslessly when first drawn to a canvas via CanvasRenderingContext2D and then
        // // uploaded to a WebGL texture when the UNPACK_PREMULTIPLY_ALPHA_WEBGL pixel storage parameter is set to false.
        // gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        // Init programs to pass values from one texture to another.
        this.copyFloatProgram = this.initProgram({
            name: 'copyFloat',
            fragmentShader: glslVersion === Constants_1.GLSL3 ? __webpack_require__(/*! ./glsl_3/CopyFloatFragShader.glsl */ "./src/glsl_3/CopyFloatFragShader.glsl") : __webpack_require__(/*! ./glsl_1/CopyFragShader.glsl */ "./src/glsl_1/CopyFragShader.glsl"),
            uniforms: [
                {
                    name: 'u_state',
                    value: 0,
                    dataType: Constants_1.INT,
                },
            ],
        });
        if (glslVersion === Constants_1.GLSL3) {
            this.copyIntProgram = this.initProgram({
                name: 'copyInt',
                fragmentShader: __webpack_require__(/*! ./glsl_3/CopyIntFragShader.glsl */ "./src/glsl_3/CopyIntFragShader.glsl"),
                uniforms: [
                    {
                        name: 'u_state',
                        value: 0,
                        dataType: Constants_1.INT,
                    },
                ],
            });
            this.copyUintProgram = this.initProgram({
                name: 'copyUint',
                fragmentShader: __webpack_require__(/*! ./glsl_3/CopyUintFragShader.glsl */ "./src/glsl_3/CopyUintFragShader.glsl"),
                uniforms: [
                    {
                        name: 'u_state',
                        value: 0,
                        dataType: Constants_1.INT,
                    },
                ],
            });
        }
        else {
            this.copyIntProgram = this.copyFloatProgram;
            this.copyUintProgram = this.copyFloatProgram;
        }
        // Unbind active buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        // Canvas setup.
        this.onResize(canvas);
        // Log number of textures available.
        this.maxNumTextures = this.gl.getParameter(this.gl.MAX_TEXTURE_IMAGE_UNITS);
        console.log(this.maxNumTextures + " textures max.");
    }
    WebGLCompute.initWithThreeRenderer = function (renderer, params, errorCallback) {
        return new WebGLCompute(__assign({ canvas: renderer.domElement, context: renderer.getContext() }, params), errorCallback, renderer);
    };
    Object.defineProperty(WebGLCompute.prototype, "singleColorProgram", {
        get: function () {
            if (this._singleColorProgram === undefined) {
                var program = this.initProgram({
                    name: 'singleColor',
                    fragmentShader: this.glslVersion === Constants_1.GLSL3 ? __webpack_require__(/*! ./glsl_3/SingleColorFragShader.glsl */ "./src/glsl_3/SingleColorFragShader.glsl") : __webpack_require__(/*! ./glsl_1/SingleColorFragShader.glsl */ "./src/glsl_1/SingleColorFragShader.glsl"),
                });
                this._singleColorProgram = program;
            }
            return this._singleColorProgram;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WebGLCompute.prototype, "singleColorWithWrapCheckProgram", {
        get: function () {
            if (this._singleColorWithWrapCheckProgram === undefined) {
                var program = this.initProgram({
                    name: 'singleColorWithWrapCheck',
                    fragmentShader: this.glslVersion === Constants_1.GLSL3 ? __webpack_require__(/*! ./glsl_3/SingleColorWithWrapCheckFragShader.glsl */ "./src/glsl_3/SingleColorWithWrapCheckFragShader.glsl") : __webpack_require__(/*! ./glsl_1/SingleColorWithWrapCheckFragShader.glsl */ "./src/glsl_1/SingleColorWithWrapCheckFragShader.glsl"),
                });
                this._singleColorWithWrapCheckProgram = program;
            }
            return this._singleColorWithWrapCheckProgram;
        },
        enumerable: false,
        configurable: true
    });
    WebGLCompute.prototype.isWebGL2 = function () {
        return utils_1.isWebGL2(this.gl);
    };
    Object.defineProperty(WebGLCompute.prototype, "quadPositionsBuffer", {
        get: function () {
            if (this._quadPositionsBuffer === undefined) {
                var fsQuadPositions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
                this._quadPositionsBuffer = this.initVertexBuffer(fsQuadPositions);
            }
            return this._quadPositionsBuffer;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WebGLCompute.prototype, "boundaryPositionsBuffer", {
        get: function () {
            if (this._boundaryPositionsBuffer === undefined) {
                var boundaryPositions = new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1, -1, -1]);
                this._boundaryPositionsBuffer = this.initVertexBuffer(boundaryPositions);
            }
            return this._boundaryPositionsBuffer;
        },
        enumerable: false,
        configurable: true
    });
    WebGLCompute.prototype.getCirclePositionsBuffer = function (numSegments) {
        if (this._circlePositionsBuffer[numSegments] == undefined) {
            var unitCirclePoints = [0, 0];
            for (var i = 0; i <= numSegments; i++) {
                unitCirclePoints.push(Math.cos(2 * Math.PI * i / numSegments), Math.sin(2 * Math.PI * i / numSegments));
            }
            var circlePositions = new Float32Array(unitCirclePoints);
            var buffer = this.initVertexBuffer(circlePositions);
            this._circlePositionsBuffer[numSegments] = buffer;
        }
        return this._circlePositionsBuffer[numSegments];
    };
    WebGLCompute.prototype.initVertexBuffer = function (data) {
        var _a = this, errorCallback = _a.errorCallback, gl = _a.gl;
        var buffer = gl.createBuffer();
        if (!buffer) {
            errorCallback('Unable to allocate gl buffer.');
            return;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        // Add buffer data.
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        return buffer;
    };
    WebGLCompute.prototype.initProgram = function (params) {
        // Check params.
        var validKeys = ['name', 'fragmentShader', 'uniforms', 'defines'];
        Object.keys(params).forEach(function (key) {
            if (validKeys.indexOf(key) < 0) {
                throw new Error("Invalid key " + key + " passed to WebGLCompute.initProgram with name \"" + params.name + "\".  Valid keys are " + validKeys.join(', ') + ".");
            }
        });
        var _a = this, gl = _a.gl, errorCallback = _a.errorCallback, glslVersion = _a.glslVersion;
        return new GPUProgram_1.GPUProgram(__assign(__assign({}, params), { gl: gl,
            errorCallback: errorCallback,
            glslVersion: glslVersion }));
    };
    ;
    WebGLCompute.prototype.initDataLayer = function (params) {
        // Check params.
        var validKeys = ['name', 'dimensions', 'type', 'numComponents', 'data', 'filter', 'wrapS', 'wrapT', 'writable', 'numBuffers'];
        Object.keys(params).forEach(function (key) {
            if (validKeys.indexOf(key) < 0) {
                throw new Error("Invalid key " + key + " passed to WebGLCompute.initDataLayer with name \"" + params.name + "\".  Valid keys are " + validKeys.join(', ') + ".");
            }
        });
        var _a = this, gl = _a.gl, errorCallback = _a.errorCallback, glslVersion = _a.glslVersion;
        return new DataLayer_1.DataLayer(__assign(__assign({}, params), { gl: gl,
            glslVersion: glslVersion,
            errorCallback: errorCallback }));
    };
    ;
    WebGLCompute.prototype.initTexture = function (params) {
        // Check params.
        var validKeys = ['name', 'url', 'filter', 'wrapS', 'wrapT', 'format', 'type', 'onLoad'];
        Object.keys(params).forEach(function (key) {
            if (validKeys.indexOf(key) < 0) {
                throw new Error("Invalid key " + key + " passed to WebGLCompute.initTexture with name \"" + params.name + "\".  Valid keys are " + validKeys.join(', ') + ".");
            }
        });
        var url = params.url, name = params.name;
        if (!Checks_1.isString(url)) {
            throw new Error("Expected WebGLCompute.initTexture params to have url of type string, got " + url + " of type " + typeof url + ".");
        }
        if (!Checks_1.isString(name)) {
            throw new Error("Expected WebGLCompute.initTexture params to have name of type string, got " + name + " of type " + typeof name + ".");
        }
        // Get filter type, default to nearest.
        var filter = params.filter !== undefined ? params.filter : Constants_1.NEAREST;
        if (!Checks_1.isValidFilterType(filter)) {
            throw new Error("Invalid filter: " + filter + " for DataLayer \"" + name + "\", must be " + Checks_1.validFilterTypes.join(', ') + ".");
        }
        // Get wrap types, default to clamp to edge.
        var wrapS = params.wrapS !== undefined ? params.wrapS : Constants_1.CLAMP_TO_EDGE;
        if (!Checks_1.isValidWrapType(wrapS)) {
            throw new Error("Invalid wrapS: " + wrapS + " for DataLayer \"" + name + "\", must be " + Checks_1.validWrapTypes.join(', ') + ".");
        }
        var wrapT = params.wrapT !== undefined ? params.wrapT : Constants_1.CLAMP_TO_EDGE;
        if (!Checks_1.isValidWrapType(wrapT)) {
            throw new Error("Invalid wrapT: " + wrapT + " for DataLayer \"" + name + "\", must be " + Checks_1.validWrapTypes.join(', ') + ".");
        }
        // Get image format type, default to rgba.
        var format = params.format !== undefined ? params.format : Constants_1.RGBA;
        if (!Checks_1.isValidTextureFormatType(format)) {
            throw new Error("Invalid format: " + format + " for DataLayer \"" + name + "\", must be " + Checks_1.validTextureFormatTypes.join(', ') + ".");
        }
        // Get image data type, default to unsigned byte.
        var type = params.type !== undefined ? params.type : Constants_1.UNSIGNED_BYTE;
        if (!Checks_1.isValidTextureDataType(type)) {
            throw new Error("Invalid type: " + type + " for DataLayer \"" + name + "\", must be " + Checks_1.validTextureDataTypes.join(', ') + ".");
        }
        var _a = this, gl = _a.gl, errorCallback = _a.errorCallback;
        var texture = gl.createTexture();
        if (texture === null) {
            throw new Error("Unable to init glTexture.");
        }
        gl.bindTexture(gl.TEXTURE_2D, texture);
        // Because images have to be downloaded over the internet
        // they might take a moment until they are ready.
        // Until then put a single pixel in the texture so we can
        // use it immediately. When the image has finished downloading
        // we'll update the texture with the contents of the image.
        var level = 0;
        var internalFormat = gl.RGBA;
        var width = 1;
        var height = 1;
        var border = 0;
        var srcFormat = gl[format];
        var srcType = gl[type];
        var pixel = new Uint8Array([0, 0, 0, 0]);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);
        var image = new Image();
        image.onload = function () {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
            // WebGL1 has different requirements for power of 2 images
            // vs non power of 2 images so check if the image is a
            // power of 2 in both dimensions.
            if (utils_1.isPowerOf2(image.width) && utils_1.isPowerOf2(image.height)) {
                // // Yes, it's a power of 2. Generate mips.
                // gl.generateMipmap(gl.TEXTURE_2D);
            }
            else {
                // TODO: finish implementing this.
                console.warn("Texture " + name + " dimensions [" + image.width + ", " + image.height + "] are not power of 2.");
                // // No, it's not a power of 2. Turn off mips and set
                // // wrapping to clamp to edge
                // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            }
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl[wrapS]);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl[wrapT]);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl[filter]);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl[filter]);
            // Callback when texture has loaded.
            if (params.onLoad)
                params.onLoad(texture);
        };
        image.onerror = function (e) {
            errorCallback("Error loading image " + name + ": " + e);
        };
        image.src = url;
        return texture;
    };
    WebGLCompute.prototype.onResize = function (canvas) {
        var width = canvas.clientWidth;
        var height = canvas.clientHeight;
        // Set correct canvas pixel size.
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/By_example/Canvas_size_and_WebGL
        canvas.width = width;
        canvas.height = height;
        // Save dimensions.
        this.width = width;
        this.height = height;
    };
    ;
    WebGLCompute.prototype.drawSetup = function (program, fullscreenRender, input, output) {
        var gl = this.gl;
        // Check if we are in an error state.
        if (!program) {
            return;
        }
        // CAUTION: the order of these next few lines is important.
        // Get a shallow copy of current textures.
        // This line must come before this.setOutput() as it depends on current internal state.
        var inputTextures = [];
        if (input) {
            if (input.constructor === WebGLTexture) {
                inputTextures.push(input);
            }
            else if (input.constructor === DataLayer_1.DataLayer) {
                inputTextures.push(input.getCurrentStateTexture());
            }
            else {
                for (var i = 0; i < input.length; i++) {
                    var layer = input[i];
                    // @ts-ignore
                    inputTextures.push(layer.getCurrentStateTexture ? layer.getCurrentStateTexture() : layer);
                }
            }
        }
        // Set output framebuffer.
        // This may modify WebGL internal state.
        this.setOutputLayer(fullscreenRender, input, output);
        // Set current program.
        gl.useProgram(program);
        // Set input textures.
        for (var i = 0; i < inputTextures.length; i++) {
            gl.activeTexture(gl.TEXTURE0 + i);
            gl.bindTexture(gl.TEXTURE_2D, inputTextures[i]);
        }
    };
    WebGLCompute.prototype.copyProgramForType = function (type) {
        switch (type) {
            case Constants_1.HALF_FLOAT:
            case Constants_1.FLOAT:
                return this.copyFloatProgram;
            case Constants_1.UNSIGNED_BYTE:
            case Constants_1.UNSIGNED_SHORT:
            case Constants_1.UNSIGNED_INT:
                return this.copyUintProgram;
            case Constants_1.BYTE:
            case Constants_1.SHORT:
            case Constants_1.INT:
                return this.copyIntProgram;
            default:
                throw new Error("Invalid type: " + type + " passed to WebGLCompute.copyProgramForType.");
        }
    };
    WebGLCompute.prototype.setBlendMode = function (shouldBlendAlpha) {
        var gl = this.gl;
        if (shouldBlendAlpha) {
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        }
    };
    WebGLCompute.prototype.addLayerToInputs = function (layer, input) {
        // Add layer to end of input if needed.
        var _inputLayers = input;
        if (Checks_1.isArray(_inputLayers)) {
            var index = _inputLayers.indexOf(layer);
            if (index < 0) {
                _inputLayers.push(layer);
            }
        }
        else {
            if (_inputLayers !== layer) {
                var previous = _inputLayers;
                _inputLayers = [];
                if (previous)
                    _inputLayers.push(previous);
                _inputLayers.push(layer);
            }
            else {
                _inputLayers = [_inputLayers];
            }
        }
        return _inputLayers;
    };
    WebGLCompute.prototype.passThroughLayerDataFromInputToOutput = function (state) {
        // TODO: figure out the fastest way to copy a texture.
        var copyProgram = this.copyProgramForType(state.internalType);
        this.step({
            program: copyProgram,
            input: state,
            output: state,
        });
    };
    WebGLCompute.prototype.setOutputLayer = function (fullscreenRender, input, output) {
        var gl = this.gl;
        // Render to screen.
        if (!output) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            // Resize viewport.
            var _a = this, width_1 = _a.width, height_1 = _a.height;
            gl.viewport(0, 0, width_1, height_1);
            return;
        }
        // Check if output is same as one of input layers.
        if (input && ((input === output) || (Checks_1.isArray(input) && input.indexOf(output) > -1))) {
            if (output.numBuffers === 1) {
                throw new Error('Cannot use same buffer for input and output of a program. Try increasing the number of buffers in your output layer to at least 2 so you can render to nextState using currentState as an input.');
            }
            if (fullscreenRender) {
                // Render and increment buffer so we are rendering to a different target
                // than the input texture.
                output._bindOutputBufferForWrite(true);
            }
            else {
                // Pass input texture through to output.
                this.passThroughLayerDataFromInputToOutput(output);
                // Render to output without incrementing buffer.
                output._bindOutputBufferForWrite(false);
            }
        }
        else {
            if (fullscreenRender) {
                // Render to current buffer.
                output._bindOutputBufferForWrite(false);
            }
            else {
                // If we are doing a sneaky thing with a swapped texture and are
                // only rendering part of the screen, we may need to add a copy operation.
                if (output._usingTextureOverrideForCurrentBuffer()) {
                    this.passThroughLayerDataFromInputToOutput(output);
                }
                output._bindOutputBufferForWrite(false);
            }
        }
        // Resize viewport.
        var _b = output.getDimensions(), width = _b[0], height = _b[1];
        gl.viewport(0, 0, width, height);
    };
    ;
    WebGLCompute.prototype.setPositionAttribute = function (program, programName) {
        this.setVertexAttribute(program, 'a_internal_position', 2, programName);
    };
    WebGLCompute.prototype.setIndexAttribute = function (program, programName) {
        this.setVertexAttribute(program, 'a_internal_index', 1, programName);
    };
    WebGLCompute.prototype.setUVAttribute = function (program, programName) {
        this.setVertexAttribute(program, 'a_internal_uv', 2, programName);
    };
    WebGLCompute.prototype.setVertexAttribute = function (program, name, size, programName) {
        var gl = this.gl;
        // Point attribute to the currently bound VBO.
        var location = gl.getAttribLocation(program, name);
        if (location < 0) {
            throw new Error("Unable to find vertex attribute \"" + name + "\" in program \"" + programName + "\".");
        }
        // TODO: only float is supported for vertex attributes.
        gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
        // Enable the attribute.
        gl.enableVertexAttribArray(location);
    };
    // Step for entire fullscreen quad.
    WebGLCompute.prototype.step = function (params) {
        var _a = this, gl = _a.gl, errorState = _a.errorState, quadPositionsBuffer = _a.quadPositionsBuffer;
        var program = params.program, input = params.input, output = params.output;
        // Ignore if we are in error state.
        if (errorState) {
            return;
        }
        var glProgram = program.defaultProgram;
        // Do setup - this must come first.
        this.drawSetup(glProgram, true, input, output);
        // Update uniforms and buffers.
        program.setVertexUniform(glProgram, 'u_internal_scale', [1, 1], Constants_1.FLOAT);
        program.setVertexUniform(glProgram, 'u_internal_translation', [0, 0], Constants_1.FLOAT);
        gl.bindBuffer(gl.ARRAY_BUFFER, quadPositionsBuffer);
        this.setPositionAttribute(glProgram, program.name);
        // Draw.
        this.setBlendMode(params.shouldBlendAlpha);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.disable(gl.BLEND);
    };
    // Step program only for a strip of px along the boundary.
    WebGLCompute.prototype.stepBoundary = function (params) {
        var _a = this, gl = _a.gl, errorState = _a.errorState, boundaryPositionsBuffer = _a.boundaryPositionsBuffer;
        var program = params.program, input = params.input, output = params.output;
        var _b = output ? output.getDimensions() : [this.width, this.height], width = _b[0], height = _b[1];
        // Ignore if we are in error state.
        if (errorState) {
            return;
        }
        var glProgram = program.defaultProgram;
        // Do setup - this must come first.
        this.drawSetup(glProgram, false, input, output);
        // Update uniforms and buffers.
        // Frame needs to be offset and scaled so that all four sides are in viewport.
        var onePx = [1 / width, 1 / height];
        program.setVertexUniform(glProgram, 'u_internal_scale', [1 - onePx[0], 1 - onePx[1]], Constants_1.FLOAT);
        program.setVertexUniform(glProgram, 'u_internal_translation', onePx, Constants_1.FLOAT);
        gl.bindBuffer(gl.ARRAY_BUFFER, boundaryPositionsBuffer);
        this.setPositionAttribute(glProgram, program.name);
        // Draw.
        this.setBlendMode(params.shouldBlendAlpha);
        if (params.singleEdge) {
            switch (params.singleEdge) {
                case 'LEFT':
                    gl.drawArrays(gl.LINES, 3, 2);
                    break;
                case 'RIGHT':
                    gl.drawArrays(gl.LINES, 1, 2);
                    break;
                case 'TOP':
                    gl.drawArrays(gl.LINES, 2, 2);
                    break;
                case 'BOTTOM':
                    gl.drawArrays(gl.LINES, 0, 2);
                    break;
                default:
                    throw new Error("Unknown boundary edge type: " + params.singleEdge + ".");
            }
        }
        else {
            gl.drawArrays(gl.LINE_LOOP, 0, 4);
        }
        gl.disable(gl.BLEND);
    };
    // Step program for all but a strip of px along the boundary.
    WebGLCompute.prototype.stepNonBoundary = function (params) {
        var _a = this, gl = _a.gl, errorState = _a.errorState, quadPositionsBuffer = _a.quadPositionsBuffer;
        var program = params.program, input = params.input, output = params.output;
        var _b = output ? output.getDimensions() : [this.width, this.height], width = _b[0], height = _b[1];
        // Ignore if we are in error state.
        if (errorState) {
            return;
        }
        var glProgram = program.defaultProgram;
        // Do setup - this must come first.
        this.drawSetup(glProgram, false, input, output);
        // Update uniforms and buffers.
        var onePx = [1 / width, 1 / height];
        program.setVertexUniform(glProgram, 'u_internal_scale', [1 - 2 * onePx[0], 1 - 2 * onePx[1]], Constants_1.FLOAT);
        program.setVertexUniform(glProgram, 'u_internal_translation', onePx, Constants_1.FLOAT);
        gl.bindBuffer(gl.ARRAY_BUFFER, quadPositionsBuffer);
        this.setPositionAttribute(glProgram, program.name);
        // Draw.
        this.setBlendMode(params.shouldBlendAlpha);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.disable(gl.BLEND);
    };
    // Step program only for a circular spot.
    WebGLCompute.prototype.stepCircle = function (params) {
        var _a = this, gl = _a.gl, errorState = _a.errorState, width = _a.width, height = _a.height;
        var program = params.program, position = params.position, radius = params.radius, input = params.input, output = params.output;
        // Ignore if we are in error state.
        if (errorState) {
            return;
        }
        var glProgram = program.defaultProgram;
        // Do setup - this must come first.
        this.drawSetup(glProgram, false, input, output);
        // Update uniforms and buffers.
        program.setVertexUniform(glProgram, 'u_internal_scale', [radius * 2 / width, radius * 2 / height], Constants_1.FLOAT);
        program.setVertexUniform(glProgram, 'u_internal_translation', [2 * position[0] / width - 1, 2 * position[1] / height - 1], Constants_1.FLOAT);
        var numSegments = params.numSegments ? params.numSegments : DEFAULT_CIRCLE_NUM_SEGMENTS;
        if (numSegments < 3) {
            throw new Error("numSegments for WebGLCompute.stepCircle must be greater than 2, got " + numSegments + ".");
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, this.getCirclePositionsBuffer(numSegments));
        this.setPositionAttribute(glProgram, program.name);
        // Draw.
        this.setBlendMode(params.shouldBlendAlpha);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, numSegments + 2);
        gl.disable(gl.BLEND);
    };
    // Step program only for a thickened line segment (rounded end caps available).
    WebGLCompute.prototype.stepSegment = function (params) {
        var _a = this, gl = _a.gl, errorState = _a.errorState;
        var program = params.program, position1 = params.position1, position2 = params.position2, thickness = params.thickness, input = params.input, output = params.output;
        var _b = output ? output.getDimensions() : [this.width, this.height], width = _b[0], height = _b[1];
        // Ignore if we are in error state.
        if (errorState) {
            return;
        }
        var glProgram = program.segmentProgram;
        // Do setup - this must come first.
        this.drawSetup(glProgram, false, input, output);
        // Update uniforms and buffers.
        program.setVertexUniform(glProgram, 'u_internal_halfThickness', thickness / 2, Constants_1.FLOAT);
        program.setVertexUniform(glProgram, 'u_internal_scale', [2 / width, 2 / height], Constants_1.FLOAT);
        var diffX = position1[0] - position2[0];
        var diffY = position1[1] - position2[1];
        var angle = Math.atan2(diffY, diffX);
        program.setVertexUniform(glProgram, 'u_internal_rotation', angle, Constants_1.FLOAT);
        var centerX = (position1[0] + position2[0]) / 2;
        var centerY = (position1[1] + position2[1]) / 2;
        program.setVertexUniform(glProgram, 'u_internal_translation', [2 * centerX / this.width - 1, 2 * centerY / this.height - 1], Constants_1.FLOAT);
        var length = Math.sqrt(diffX * diffX + diffY * diffY);
        var numSegments = params.numCapSegments ? params.numCapSegments * 2 : DEFAULT_CIRCLE_NUM_SEGMENTS;
        if (params.endCaps) {
            if (numSegments < 6 || numSegments % 6 !== 0) {
                throw new Error("numSegments for WebGLCompute.stepSegment must be divisible by 6, got " + numSegments + ".");
            }
            // Have to subtract a small offset from length.
            program.setVertexUniform(glProgram, 'u_internal_length', length - thickness * Math.sin(Math.PI / numSegments), Constants_1.FLOAT);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.getCirclePositionsBuffer(numSegments));
        }
        else {
            // Have to subtract a small offset from length.
            program.setVertexUniform(glProgram, 'u_internal_length', length - thickness, Constants_1.FLOAT);
            // Use a rectangle in case of no caps.
            gl.bindBuffer(gl.ARRAY_BUFFER, this.quadPositionsBuffer);
        }
        this.setPositionAttribute(glProgram, program.name);
        // Draw.
        this.setBlendMode(params.shouldBlendAlpha);
        if (params.endCaps) {
            gl.drawArrays(gl.TRIANGLE_FAN, 0, numSegments + 2);
        }
        else {
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }
        gl.disable(gl.BLEND);
    };
    WebGLCompute.prototype.stepPolyline = function (params) {
        var program = params.program, input = params.input, output = params.output;
        var vertices = params.positions;
        var closeLoop = !!params.closeLoop;
        var _a = this, gl = _a.gl, width = _a.width, height = _a.height, errorState = _a.errorState;
        // Ignore if we are in error state.
        if (errorState) {
            return;
        }
        // Offset vertices.
        var halfThickness = params.thickness / 2;
        var numPositions = closeLoop ? vertices.length * 4 + 2 : (vertices.length - 1) * 4;
        var positions = new Float32Array(2 * numPositions);
        var uvs = params.includeUVs ? new Float32Array(2 * numPositions) : undefined;
        var normals = params.includeNormals ? new Float32Array(2 * numPositions) : undefined;
        // tmp arrays.
        var s1 = [0, 0];
        var s2 = [0, 0];
        var n1 = [0, 0];
        var n2 = [0, 0];
        var n3 = [0, 0];
        for (var i = 0; i < vertices.length; i++) {
            if (!closeLoop && i === vertices.length - 1)
                continue;
            // Vertices on this segment.
            var v1 = vertices[i];
            var v2 = vertices[(i + 1) % vertices.length];
            s1[0] = v2[0] - v1[0];
            s1[1] = v2[1] - v1[1];
            var length1 = Math.sqrt(s1[0] * s1[0] + s1[1] * s1[1]);
            n1[0] = s1[1] / length1;
            n1[1] = -s1[0] / length1;
            var index = i * 4 + 2;
            if (!closeLoop && i === 0) {
                // Add starting points to positions array.
                positions[0] = v1[0] + n1[0] * halfThickness;
                positions[1] = v1[1] + n1[1] * halfThickness;
                positions[2] = v1[0] - n1[0] * halfThickness;
                positions[3] = v1[1] - n1[1] * halfThickness;
                if (uvs) {
                    uvs[0] = 0;
                    uvs[1] = 1;
                    uvs[2] = 0;
                    uvs[3] = 0;
                }
                if (normals) {
                    normals[0] = n1[0];
                    normals[1] = n1[1];
                    normals[2] = n1[0];
                    normals[3] = n1[1];
                }
            }
            var u = (i + 1) / (vertices.length - 1);
            // Offset from v2.
            positions[2 * index] = v2[0] + n1[0] * halfThickness;
            positions[2 * index + 1] = v2[1] + n1[1] * halfThickness;
            positions[2 * index + 2] = v2[0] - n1[0] * halfThickness;
            positions[2 * index + 3] = v2[1] - n1[1] * halfThickness;
            if (uvs) {
                uvs[2 * index] = u;
                uvs[2 * index + 1] = 1;
                uvs[2 * index + 2] = u;
                uvs[2 * index + 3] = 0;
            }
            if (normals) {
                normals[2 * index] = n1[0];
                normals[2 * index + 1] = n1[1];
                normals[2 * index + 2] = n1[0];
                normals[2 * index + 3] = n1[1];
            }
            if ((i < vertices.length - 2) || closeLoop) {
                // Vertices on next segment.
                var v3 = vertices[(i + 1) % vertices.length];
                var v4 = vertices[(i + 2) % vertices.length];
                s2[0] = v4[0] - v3[0];
                s2[1] = v4[1] - v3[1];
                var length2 = Math.sqrt(s2[0] * s2[0] + s2[1] * s2[1]);
                n2[0] = s2[1] / length2;
                n2[1] = -s2[0] / length2;
                // Offset from v3
                positions[2 * ((index + 2) % (4 * vertices.length))] = v3[0] + n2[0] * halfThickness;
                positions[2 * ((index + 2) % (4 * vertices.length)) + 1] = v3[1] + n2[1] * halfThickness;
                positions[2 * ((index + 2) % (4 * vertices.length)) + 2] = v3[0] - n2[0] * halfThickness;
                positions[2 * ((index + 2) % (4 * vertices.length)) + 3] = v3[1] - n2[1] * halfThickness;
                if (uvs) {
                    uvs[2 * ((index + 2) % (4 * vertices.length))] = u;
                    uvs[2 * ((index + 2) % (4 * vertices.length)) + 1] = 1;
                    uvs[2 * ((index + 2) % (4 * vertices.length)) + 2] = u;
                    uvs[2 * ((index + 2) % (4 * vertices.length)) + 3] = 0;
                }
                if (normals) {
                    normals[2 * ((index + 2) % (4 * vertices.length))] = n2[0];
                    normals[2 * ((index + 2) % (4 * vertices.length)) + 1] = n2[1];
                    normals[2 * ((index + 2) % (4 * vertices.length)) + 2] = n2[0];
                    normals[2 * ((index + 2) % (4 * vertices.length)) + 3] = n2[1];
                }
                // Check the angle between adjacent segments.
                var cross = n1[0] * n2[1] - n1[1] * n2[0];
                if (Math.abs(cross) < 1e-6)
                    continue;
                n3[0] = n1[0] + n2[0];
                n3[1] = n1[1] + n2[1];
                var length3 = Math.sqrt(n3[0] * n3[0] + n3[1] * n3[1]);
                n3[0] /= length3;
                n3[1] /= length3;
                // Make adjustments to positions.
                var angle = Math.acos(n1[0] * n2[0] + n1[1] * n2[1]);
                var offset = halfThickness / Math.cos(angle / 2);
                if (cross < 0) {
                    positions[2 * index] = v2[0] + n3[0] * offset;
                    positions[2 * index + 1] = v2[1] + n3[1] * offset;
                    positions[2 * ((index + 2) % (4 * vertices.length))] = positions[2 * index];
                    positions[2 * ((index + 2) % (4 * vertices.length)) + 1] = positions[2 * index + 1];
                }
                else {
                    positions[2 * index + 2] = v2[0] - n3[0] * offset;
                    positions[2 * index + 3] = v2[1] - n3[1] * offset;
                    positions[2 * ((index + 2) % (4 * vertices.length)) + 2] = positions[2 * index + 2];
                    positions[2 * ((index + 2) % (4 * vertices.length)) + 3] = positions[2 * index + 3];
                }
            }
        }
        if (closeLoop) {
            // Duplicate starting points to end of positions array.
            positions[vertices.length * 8] = positions[0];
            positions[vertices.length * 8 + 1] = positions[1];
            positions[vertices.length * 8 + 2] = positions[2];
            positions[vertices.length * 8 + 3] = positions[3];
            if (uvs) {
                uvs[vertices.length * 8] = uvs[0];
                uvs[vertices.length * 8 + 1] = uvs[1];
                uvs[vertices.length * 8 + 2] = uvs[2];
                uvs[vertices.length * 8 + 3] = uvs[3];
            }
            if (normals) {
                normals[vertices.length * 8] = normals[0];
                normals[vertices.length * 8 + 1] = normals[1];
                normals[vertices.length * 8 + 2] = normals[2];
                normals[vertices.length * 8 + 3] = normals[3];
            }
        }
        var glProgram = (uvs ?
            (normals ? program.defaultProgramWithUVNormal : program.defaultProgramWithUV) :
            (normals ? program.defaultProgramWithNormal : program.defaultProgram));
        // Do setup - this must come first.
        this.drawSetup(glProgram, false, input, output);
        // Update uniforms and buffers.
        program.setVertexUniform(glProgram, 'u_internal_scale', [2 / width, 2 / height], Constants_1.FLOAT);
        program.setVertexUniform(glProgram, 'u_internal_translation', [-1, -1], Constants_1.FLOAT);
        // Init positions buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, this.initVertexBuffer(positions));
        this.setPositionAttribute(glProgram, program.name);
        if (uvs) {
            // Init uv buffer.
            gl.bindBuffer(gl.ARRAY_BUFFER, this.initVertexBuffer(uvs));
            this.setUVAttribute(glProgram, program.name);
        }
        if (normals) {
            // Init normals buffer.
            gl.bindBuffer(gl.ARRAY_BUFFER, this.initVertexBuffer(normals));
            this.setVertexAttribute(glProgram, 'a_internal_normal', 2, program.name);
        }
        // Draw.
        this.setBlendMode(params.shouldBlendAlpha);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, numPositions);
        gl.disable(gl.BLEND);
    };
    WebGLCompute.prototype.stepTriangleStrip = function (params) {
        var program = params.program, input = params.input, output = params.output, positions = params.positions, uvs = params.uvs, normals = params.normals;
        var _a = this, gl = _a.gl, width = _a.width, height = _a.height, errorState = _a.errorState;
        // Ignore if we are in error state.
        if (errorState) {
            return;
        }
        var glProgram = (uvs ?
            (normals ? program.defaultProgramWithUVNormal : program.defaultProgramWithUV) :
            (normals ? program.defaultProgramWithNormal : program.defaultProgram));
        // Do setup - this must come first.
        this.drawSetup(glProgram, false, input, output);
        // Update uniforms and buffers.
        program.setVertexUniform(glProgram, 'u_internal_scale', [2 / width, 2 / height], Constants_1.FLOAT);
        program.setVertexUniform(glProgram, 'u_internal_translation', [-1, -1], Constants_1.FLOAT);
        // Init positions buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, this.initVertexBuffer(positions));
        this.setPositionAttribute(glProgram, program.name);
        if (uvs) {
            // Init uv buffer.
            gl.bindBuffer(gl.ARRAY_BUFFER, this.initVertexBuffer(uvs));
            this.setUVAttribute(glProgram, program.name);
        }
        if (normals) {
            // Init normals buffer.
            gl.bindBuffer(gl.ARRAY_BUFFER, this.initVertexBuffer(normals));
            this.setVertexAttribute(glProgram, 'a_internal_normal', 2, program.name);
        }
        var count = params.count ? params.count : positions.length / 2;
        // Draw.
        this.setBlendMode(params.shouldBlendAlpha);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, count);
        gl.disable(gl.BLEND);
    };
    WebGLCompute.prototype.stepLines = function (params) {
        var _a = this, gl = _a.gl, errorState = _a.errorState, width = _a.width, height = _a.height;
        var indices = params.indices, uvs = params.uvs, normals = params.normals, input = params.input, output = params.output, program = params.program;
        // Ignore if we are in error state.
        if (errorState) {
            return;
        }
        // Check that params are valid.
        if (params.closeLoop && indices) {
            throw new Error("WebGLCompute.stepLines() can't be called with closeLoop == true and indices.");
        }
        var glProgram = (uvs ?
            (normals ? program.defaultProgramWithUVNormal : program.defaultProgramWithUV) :
            (normals ? program.defaultProgramWithNormal : program.defaultProgram));
        // Do setup - this must come first.
        this.drawSetup(glProgram, false, input, output);
        var count = params.count ? params.count : (indices ? indices.length : params.positions.length / 2);
        // Update uniforms and buffers.
        program.setVertexUniform(glProgram, 'u_internal_scale', [2 / width, 2 / height], Constants_1.FLOAT);
        program.setVertexUniform(glProgram, 'u_internal_translation', [-1, -1], Constants_1.FLOAT);
        if (indices) {
            // Reorder positions array to match indices.
            var positions = new Float32Array(2 * indices.length);
            for (var i = 0; i < count; i++) {
                var index = indices[i];
                positions[2 * i] = params.positions[2 * index];
                positions[2 * i + 1] = params.positions[2 * index + 1];
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, this.initVertexBuffer(positions));
        }
        else {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.initVertexBuffer(params.positions));
        }
        this.setPositionAttribute(glProgram, program.name);
        // Draw.
        this.setBlendMode(params.shouldBlendAlpha);
        if (params.indices) {
            gl.drawArrays(gl.LINES, 0, count);
        }
        else {
            if (params.closeLoop) {
                gl.drawArrays(gl.LINE_LOOP, 0, count);
            }
            else {
                gl.drawArrays(gl.LINE_STRIP, 0, count);
            }
        }
        gl.disable(gl.BLEND);
    };
    WebGLCompute.prototype.drawLayerAsPoints = function (params) {
        var _a = this, gl = _a.gl, errorState = _a.errorState, pointIndexArray = _a.pointIndexArray, width = _a.width, height = _a.height;
        var positions = params.positions, output = params.output;
        // Ignore if we are in error state.
        if (errorState) {
            return;
        }
        // Check that numPoints is valid.
        if (positions.numComponents !== 2 && positions.numComponents !== 4) {
            throw new Error("WebGLCompute.drawPoints() must be passed a position DataLayer with either 2 or 4 components, got position DataLayer \"" + positions.name + "\" with " + positions.numComponents + " components.");
        }
        var length = positions.getLength();
        var count = params.count || length;
        if (count > length) {
            throw new Error("Invalid count " + count + " for position DataLayer of length " + length + ".");
        }
        var program = params.program;
        if (program === undefined) {
            program = this.singleColorProgram;
            var color = params.color || [1, 0, 0]; // Default of red.
            program.setUniform('u_color', color, Constants_1.FLOAT);
        }
        var glProgram = program.dataLayerPointsProgram;
        // Add positions to end of input if needed.
        var input = this.addLayerToInputs(positions, params.input);
        // Do setup - this must come first.
        this.drawSetup(glProgram, false, input, output);
        // Update uniforms and buffers.
        program.setVertexUniform(glProgram, 'u_internal_positions', input.indexOf(positions), Constants_1.INT);
        program.setVertexUniform(glProgram, 'u_internal_scale', [1 / width, 1 / height], Constants_1.FLOAT);
        // Tell whether we are using an absolute position (2 components), or position with accumulation buffer (4 components, better floating pt accuracy).
        program.setVertexUniform(glProgram, 'u_internal_positionWithAccumulation', positions.numComponents === 4 ? 1 : 0, Constants_1.INT);
        // Set default pointSize.
        var pointSize = params.pointSize || 1;
        program.setVertexUniform(glProgram, 'u_internal_pointSize', pointSize, Constants_1.FLOAT);
        var positionLayerDimensions = positions.getDimensions();
        program.setVertexUniform(glProgram, 'u_internal_positionsDimensions', positionLayerDimensions, Constants_1.FLOAT);
        program.setVertexUniform(glProgram, 'u_internal_wrapX', params.wrapX ? 1 : 0, Constants_1.INT);
        program.setVertexUniform(glProgram, 'u_internal_wrapY', params.wrapY ? 1 : 0, Constants_1.INT);
        if (this.pointIndexBuffer === undefined || (pointIndexArray && pointIndexArray.length < count)) {
            // Have to use float32 array bc int is not supported as a vertex attribute type.
            var indices = utils_1.initSequentialFloatArray(length);
            this.pointIndexArray = indices;
            this.pointIndexBuffer = this.initVertexBuffer(indices);
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, this.pointIndexBuffer);
        this.setIndexAttribute(glProgram, program.name);
        // Draw.
        this.setBlendMode(params.shouldBlendAlpha);
        gl.drawArrays(gl.POINTS, 0, count);
        gl.disable(gl.BLEND);
    };
    WebGLCompute.prototype.drawLayerAsLines = function (params) {
        var _a = this, gl = _a.gl, errorState = _a.errorState, width = _a.width, height = _a.height;
        var positions = params.positions, output = params.output;
        // Ignore if we are in error state.
        if (errorState) {
            return;
        }
        // Check that positions is valid.
        if (positions.numComponents !== 2 && positions.numComponents !== 4) {
            throw new Error("WebGLCompute.drawLayerAsLines() must be passed a position DataLayer with either 2 or 4 components, got position DataLayer \"" + positions.name + "\" with " + positions.numComponents + " components.");
        }
        // Check that params are valid.
        if (params.closeLoop && params.indices) {
            throw new Error("WebGLCompute.drawLayerAsLines() can't be called with closeLoop == true and indices.");
        }
        var program = params.program;
        if (program === undefined) {
            program = params.wrapX || params.wrapY ? this.singleColorWithWrapCheckProgram : this.singleColorProgram;
            var color = params.color || [1, 0, 0]; // Default to red.
            program.setUniform('u_color', color, Constants_1.FLOAT);
        }
        var glProgram = program.dataLayerLinesProgram;
        // Add positionLayer to end of input if needed.
        var input = this.addLayerToInputs(positions, params.input);
        // Do setup - this must come first.
        this.drawSetup(glProgram, false, input, output);
        // TODO: cache indexArray if no indices passed in.
        var indices = params.indices ? params.indices : utils_1.initSequentialFloatArray(params.count || positions.getLength());
        var count = params.count ? params.count : indices.length;
        // Update uniforms and buffers.
        program.setVertexUniform(glProgram, 'u_internal_positions', input.indexOf(positions), Constants_1.INT);
        program.setVertexUniform(glProgram, 'u_internal_scale', [1 / width, 1 / height], Constants_1.FLOAT);
        // Tell whether we are using an absolute position (2 components), or position with accumulation buffer (4 components, better floating pt accuracy).
        program.setVertexUniform(glProgram, 'u_internal_positionWithAccumulation', positions.numComponents === 4 ? 1 : 0, Constants_1.INT);
        var positionLayerDimensions = positions.getDimensions();
        program.setVertexUniform(glProgram, 'u_internal_positionsDimensions', positionLayerDimensions, Constants_1.FLOAT);
        program.setVertexUniform(glProgram, 'u_internal_wrapX', params.wrapX ? 1 : 0, Constants_1.INT);
        program.setVertexUniform(glProgram, 'u_internal_wrapY', params.wrapY ? 1 : 0, Constants_1.INT);
        if (this.indexedLinesIndexBuffer === undefined) {
            // Have to use float32 array bc int is not supported as a vertex attribute type.
            var floatArray = void 0;
            if (indices.constructor !== Float32Array) {
                // Have to use float32 array bc int is not supported as a vertex attribute type.
                floatArray = new Float32Array(indices.length);
                for (var i = 0; i < count; i++) {
                    floatArray[i] = indices[i];
                }
                console.warn("Converting indices array of type " + indices.constructor + " to Float32Array in WebGLCompute.drawIndexedLines for WebGL compatibility, you may want to use a Float32Array to store this information so the conversion is not required.");
            }
            else {
                floatArray = indices;
            }
            this.indexedLinesIndexBuffer = this.initVertexBuffer(floatArray);
        }
        else {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.indexedLinesIndexBuffer);
            // Copy buffer data.
            gl.bufferData(gl.ARRAY_BUFFER, indices, gl.STATIC_DRAW);
        }
        this.setIndexAttribute(glProgram, program.name);
        // Draw.
        this.setBlendMode(params.shouldBlendAlpha);
        if (params.indices) {
            gl.drawArrays(gl.LINES, 0, count);
        }
        else {
            if (params.closeLoop) {
                gl.drawArrays(gl.LINE_LOOP, 0, count);
            }
            else {
                gl.drawArrays(gl.LINE_STRIP, 0, count);
            }
        }
        gl.disable(gl.BLEND);
    };
    WebGLCompute.prototype.drawLayerAsVectorField = function (params) {
        var _a = this, gl = _a.gl, errorState = _a.errorState, vectorFieldIndexArray = _a.vectorFieldIndexArray, width = _a.width, height = _a.height;
        var field = params.field, output = params.output;
        // Ignore if we are in error state.
        if (errorState) {
            return;
        }
        // Check that field is valid.
        if (field.numComponents !== 2) {
            throw new Error("WebGLCompute.drawVectorField() must be passed a fieldLayer with 2 components, got fieldLayer \"" + field.name + "\" with " + field.numComponents + " components.");
        }
        // Check aspect ratio.
        // const dimensions = vectorLayer.getDimensions();
        // if (Math.abs(dimensions[0] / dimensions[1] - width / height) > 0.01) {
        // 	throw new Error(`Invalid aspect ratio ${(dimensions[0] / dimensions[1]).toFixed(3)} vector DataLayer with dimensions [${dimensions[0]}, ${dimensions[1]}], expected ${(width / height).toFixed(3)}.`);
        // }
        var program = params.program;
        if (program === undefined) {
            program = this.singleColorProgram;
            var color = params.color || [1, 0, 0]; // Default to red.
            program.setUniform('u_color', color, Constants_1.FLOAT);
        }
        var glProgram = program.dataLayerVectorFieldProgram;
        // Add field to end of input if needed.
        var input = this.addLayerToInputs(field, params.input);
        // Do setup - this must come first.
        this.drawSetup(glProgram, false, input, output);
        // Update uniforms and buffers.
        program.setVertexUniform(glProgram, 'u_internal_vectors', input.indexOf(field), Constants_1.INT);
        // Set default scale.
        var vectorScale = params.vectorScale || 1;
        program.setVertexUniform(glProgram, 'u_internal_scale', [vectorScale / width, vectorScale / height], Constants_1.FLOAT);
        var vectorSpacing = params.vectorSpacing || 10;
        var spacedDimensions = [Math.floor(width / vectorSpacing), Math.floor(height / vectorSpacing)];
        program.setVertexUniform(glProgram, 'u_internal_dimensions', spacedDimensions, Constants_1.FLOAT);
        var length = 2 * spacedDimensions[0] * spacedDimensions[1];
        if (this.vectorFieldIndexBuffer === undefined || (vectorFieldIndexArray && vectorFieldIndexArray.length < length)) {
            // Have to use float32 array bc int is not supported as a vertex attribute type.
            var indices = utils_1.initSequentialFloatArray(length);
            this.vectorFieldIndexArray = indices;
            this.vectorFieldIndexBuffer = this.initVertexBuffer(indices);
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vectorFieldIndexBuffer);
        this.setIndexAttribute(glProgram, program.name);
        // Draw.
        this.setBlendMode(params.shouldBlendAlpha);
        gl.drawArrays(gl.LINES, 0, length);
        gl.disable(gl.BLEND);
    };
    WebGLCompute.prototype.getContext = function () {
        return this.gl;
    };
    WebGLCompute.prototype.getValues = function (dataLayer) {
        var _a = this, gl = _a.gl, glslVersion = _a.glslVersion;
        // In case dataLayer was not the last output written to.
        dataLayer._bindOutputBuffer();
        var _b = dataLayer.getDimensions(), width = _b[0], height = _b[1];
        var glNumChannels = dataLayer.glNumChannels, glType = dataLayer.glType, glFormat = dataLayer.glFormat, internalType = dataLayer.internalType;
        var values;
        switch (internalType) {
            case Constants_1.HALF_FLOAT:
                if (gl.FLOAT !== undefined) {
                    // Firefox requires that RGBA/FLOAT is used for readPixels of float16 types.
                    glNumChannels = 4;
                    glFormat = gl.RGBA;
                    glType = gl.FLOAT;
                    values = new Float32Array(width * height * glNumChannels);
                }
                else {
                    values = new Uint16Array(width * height * glNumChannels);
                }
                // // The following works in Chrome.
                // values = new Uint16Array(width * height * glNumChannels);
                break;
            case Constants_1.FLOAT:
                // Chrome and Firefox require that RGBA/FLOAT is used for readPixels of float32 types.
                // https://github.com/KhronosGroup/WebGL/issues/2747
                glNumChannels = 4;
                glFormat = gl.RGBA;
                values = new Float32Array(width * height * glNumChannels);
                break;
            case Constants_1.UNSIGNED_BYTE:
                if (glslVersion === Constants_1.GLSL1) {
                    // Firefox requires that RGBA/UNSIGNED_BYTE is used for readPixels of unsigned byte types.
                    glNumChannels = 4;
                    glFormat = gl.RGBA;
                    values = new Uint8Array(width * height * glNumChannels);
                    break;
                }
                // Firefox requires that RGBA_INTEGER/UNSIGNED_INT is used for readPixels of unsigned int types.
                glNumChannels = 4;
                glFormat = gl.RGBA_INTEGER;
                glType = gl.UNSIGNED_INT;
                values = new Uint32Array(width * height * glNumChannels);
                // // The following works in Chrome.
                // values = new Uint8Array(width * height * glNumChannels);
                break;
            case Constants_1.UNSIGNED_SHORT:
                // Firefox requires that RGBA_INTEGER/UNSIGNED_INT is used for readPixels of unsigned int types.
                glNumChannels = 4;
                glFormat = gl.RGBA_INTEGER;
                glType = gl.UNSIGNED_INT;
                values = new Uint32Array(width * height * glNumChannels);
                // // The following works in Chrome.
                // values = new Uint16Array(width * height * glNumChannels);
                break;
            case Constants_1.UNSIGNED_INT:
                // Firefox requires that RGBA_INTEGER/UNSIGNED_INT is used for readPixels of unsigned int types.
                glNumChannels = 4;
                glFormat = gl.RGBA_INTEGER;
                values = new Uint32Array(width * height * glNumChannels);
                // // The following works in Chrome.
                // values = new Uint32Array(width * height * glNumChannels);
                break;
            case Constants_1.BYTE:
                // Firefox requires that RGBA_INTEGER/INT is used for readPixels of int types.
                glNumChannels = 4;
                glFormat = gl.RGBA_INTEGER;
                glType = gl.INT;
                values = new Int32Array(width * height * glNumChannels);
                // // The following works in Chrome.
                // values = new Int8Array(width * height * glNumChannels);
                break;
            case Constants_1.SHORT:
                // Firefox requires that RGBA_INTEGER/INT is used for readPixels of int types.
                glNumChannels = 4;
                glFormat = gl.RGBA_INTEGER;
                glType = gl.INT;
                values = new Int32Array(width * height * glNumChannels);
                // // The following works in Chrome.
                // values = new Int16Array(width * height * glNumChannels);
                break;
            case Constants_1.INT:
                // Firefox requires that RGBA_INTEGER/INT is used for readPixels of int types.
                glNumChannels = 4;
                glFormat = gl.RGBA_INTEGER;
                values = new Int32Array(width * height * glNumChannels);
                // // The following works in Chrome.
                // values = new Int32Array(width * height * glNumChannels);
                break;
            default:
                throw new Error("Unsupported internalType " + internalType + " for getValues().");
        }
        if (this.readyToRead()) {
            // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/readPixels
            gl.readPixels(0, 0, width, height, glFormat, glType, values);
            var numComponents = dataLayer.numComponents, type = dataLayer.type;
            var OUTPUT_LENGTH = width * height * numComponents;
            // Convert uint16 to float32 if needed.
            var handleFloat16Conversion = internalType === Constants_1.HALF_FLOAT && values.constructor === Uint16Array;
            // @ts-ignore
            var view = handleFloat16Conversion ? new DataView(values.buffer) : undefined;
            var output = values;
            // We may use a different internal type than the assigned type of the DataLayer.
            if (internalType !== type) {
                switch (type) {
                    case Constants_1.HALF_FLOAT:
                    case Constants_1.FLOAT:
                        output = new Float32Array(OUTPUT_LENGTH);
                        break;
                    case Constants_1.UNSIGNED_BYTE:
                        output = new Uint8Array(OUTPUT_LENGTH);
                        break;
                    case Constants_1.BYTE:
                        output = new Int8Array(OUTPUT_LENGTH);
                        break;
                    case Constants_1.UNSIGNED_SHORT:
                        output = new Uint16Array(OUTPUT_LENGTH);
                        break;
                    case Constants_1.SHORT:
                        output = new Int16Array(OUTPUT_LENGTH);
                        break;
                    case Constants_1.UNSIGNED_INT:
                        output = new Uint32Array(OUTPUT_LENGTH);
                        break;
                    case Constants_1.INT:
                        output = new Int32Array(OUTPUT_LENGTH);
                        break;
                    default:
                        throw new Error("Unsupported type " + type + " for getValues().");
                }
            }
            // In some cases glNumChannels may be > numComponents.
            if (handleFloat16Conversion || output !== values || numComponents !== glNumChannels) {
                for (var i = 0, length_1 = width * height; i < length_1; i++) {
                    var index1 = i * glNumChannels;
                    var index2 = i * numComponents;
                    for (var j = 0; j < numComponents; j++) {
                        if (handleFloat16Conversion) {
                            output[index2 + j] = float16_1.getFloat16(view, 2 * (index1 + j), true);
                        }
                        else {
                            output[index2 + j] = values[index1 + j];
                        }
                    }
                }
            }
            if (output.length !== OUTPUT_LENGTH) {
                output = output.slice(0, OUTPUT_LENGTH);
            }
            return output;
        }
        else {
            throw new Error("Unable to read values from Buffer with status: " + gl.checkFramebufferStatus(gl.FRAMEBUFFER) + ".");
        }
    };
    WebGLCompute.prototype.readyToRead = function () {
        var gl = this.gl;
        return gl.checkFramebufferStatus(gl.FRAMEBUFFER) == gl.FRAMEBUFFER_COMPLETE;
    };
    ;
    WebGLCompute.prototype.savePNG = function (dataLayer, filename, dpi) {
        if (filename === void 0) { filename = dataLayer.name; }
        var values = this.getValues(dataLayer);
        var _a = dataLayer.getDimensions(), width = _a[0], height = _a[1];
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var context = canvas.getContext('2d');
        var imageData = context.getImageData(0, 0, width, height);
        var buffer = imageData.data;
        // TODO: this isn't working for UNSIGNED_BYTE types?
        var isFloat = dataLayer.type === Constants_1.FLOAT || dataLayer.type === Constants_1.HALF_FLOAT;
        // Have to flip the y axis since PNGs are written top to bottom.
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                var index = y * width + x;
                var indexFlipped = (height - 1 - y) * width + x;
                for (var i = 0; i < dataLayer.numComponents; i++) {
                    buffer[4 * indexFlipped + i] = values[dataLayer.numComponents * index + i] * (isFloat ? 255 : 1);
                }
                if (dataLayer.numComponents < 4) {
                    buffer[4 * indexFlipped + 3] = 255;
                }
            }
        }
        // console.log(values, buffer);
        context.putImageData(imageData, 0, 0);
        canvas.toBlob(function (blob) {
            if (!blob) {
                console.warn('Problem saving PNG, unable to init blob.');
                return;
            }
            if (dpi) {
                changedpi_1.changeDpiBlob(blob, dpi).then(function (blob) {
                    file_saver_1.saveAs(blob, filename + ".png");
                });
            }
            else {
                file_saver_1.saveAs(blob, filename + ".png");
            }
        }, 'image/png');
    };
    WebGLCompute.prototype.reset = function () {
        // TODO: implement this.
        throw new Error('WebGLCompute.reset() not implemented.');
    };
    ;
    WebGLCompute.prototype.attachDataLayerToThreeTexture = function (dataLayer, texture) {
        if (!this.renderer) {
            throw new Error('WebGLCompute was not inited with a renderer.');
        }
        // Link webgl texture to threejs object.
        // This is not officially supported.
        if (dataLayer.numBuffers > 1) {
            throw new Error("DataLayer \"" + dataLayer.name + "\" contains multiple WebGL textures (one for each buffer) that are flip-flopped during compute cycles, please choose a DataLayer with one buffer.");
        }
        var offsetTextureProperties = this.renderer.properties.get(texture);
        offsetTextureProperties.__webglTexture = dataLayer.getCurrentStateTexture();
        offsetTextureProperties.__webglInit = true;
    };
    WebGLCompute.prototype.resetThreeState = function () {
        if (!this.renderer) {
            throw new Error('WebGLCompute was not inited with a renderer.');
        }
        var gl = this.gl;
        // Reset viewport.
        var viewport = this.renderer.getViewport(new utils.Vector4());
        gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height);
        // Unbind framebuffer (render to screen).
        this.renderer.setRenderTarget(null);
        // Reset texture bindings.
        this.renderer.resetState();
    };
    WebGLCompute.prototype.destroy = function () {
        // TODO: Need to implement this.
        delete this.renderer;
    };
    return WebGLCompute;
}());
exports.WebGLCompute = WebGLCompute;


/***/ }),

/***/ "./src/extensions.ts":
/*!***************************!*\
  !*** ./src/extensions.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getExtension = exports.EXT_COLOR_BUFFER_FLOAT = exports.WEBGL_DEPTH_TEXTURE = exports.OES_TEXTURE_HAlF_FLOAT_LINEAR = exports.OES_TEXTURE_FLOAT_LINEAR = exports.OES_TEXTURE_HALF_FLOAT = exports.OES_TEXTURE_FLOAT = void 0;
var extensions = {};
// https://developer.mozilla.org/en-US/docs/Web/API/OES_texture_float
// Float is provided by default in WebGL2 contexts.
// This extension implicitly enables the WEBGL_color_buffer_float extension (if supported), which allows rendering to 32-bit floating-point color buffers.
exports.OES_TEXTURE_FLOAT = 'OES_texture_float';
// https://developer.mozilla.org/en-US/docs/Web/API/OES_texture_half_float
// Half float is supported by modern mobile browsers, float not yet supported.
// Half float is provided by default for Webgl2 contexts.
// This extension implicitly enables the EXT_color_buffer_half_float extension (if supported), which allows rendering to 16-bit floating point formats.
exports.OES_TEXTURE_HALF_FLOAT = 'OES_texture_half_float';
// TODO: Seems like linear filtering of floats may be supported in some browsers without these extensions?
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
function getExtension(gl, extensionName, errorCallback, optional) {
    if (optional === void 0) { optional = false; }
    // Check if we've already loaded the extension.
    if (extensions[extensionName] !== undefined)
        return extensions[extensionName];
    var extension;
    try {
        extension = gl.getExtension(extensionName);
    }
    catch (e) { }
    if (extension) {
        // Cache this extension.
        extensions[extensionName] = extension;
        console.log("Loaded extension: " + extensionName + ".");
    }
    else {
        extensions[extensionName] = false; // Cache the bad extension lookup.
        console.warn("Unsupported " + (optional ? 'optional ' : '') + "extension: " + extensionName + ".");
    }
    // If the extension is not optional, throw error.
    if (!extension && !optional) {
        errorCallback("Required extension unsupported by this device / browser: " + extensionName + ".");
    }
    return extension;
}
exports.getExtension = getExtension;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WebGLCompute = void 0;
var WebGLCompute_1 = __webpack_require__(/*! ./WebGLCompute */ "./src/WebGLCompute.ts");
Object.defineProperty(exports, "WebGLCompute", ({ enumerable: true, get: function () { return WebGLCompute_1.WebGLCompute; } }));
__exportStar(__webpack_require__(/*! ./Constants */ "./src/Constants.ts"), exports);


/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.initSequentialFloatArray = exports.isPowerOf2 = exports.isWebGL2 = exports.compileShader = void 0;
// Copied from http://webglfundamentals.org/webgl/lessons/webgl-boilerplate.html
function compileShader(gl, errorCallback, shaderSource, shaderType, programName) {
    // Create the shader object
    var shader = gl.createShader(shaderType);
    if (!shader) {
        errorCallback('Unable to init gl shader.');
        return null;
    }
    // Set the shader source code.
    gl.shaderSource(shader, shaderSource);
    // Compile the shader
    gl.compileShader(shader);
    // Check if it compiled
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
        // Something went wrong during compilation - print the error.
        errorCallback("Could not compile " + (shaderType === gl.FRAGMENT_SHADER ? 'fragment' : 'vertex') + "\n\t\t\t shader" + (programName ? " for program \"" + programName + "\"" : '') + ": " + gl.getShaderInfoLog(shader) + ".");
        return null;
    }
    return shader;
}
exports.compileShader = compileShader;
function isWebGL2(gl) {
    // This code is pulled from https://github.com/mrdoob/three.js/blob/master/src/renderers/webgl/WebGLCapabilities.js
    // @ts-ignore
    return (typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext) || (typeof WebGL2ComputeRenderingContext !== 'undefined' && gl instanceof WebGL2ComputeRenderingContext);
    // return !!(gl as WebGL2RenderingContext).HALF_FLOAT;
}
exports.isWebGL2 = isWebGL2;
function isPowerOf2(value) {
    return (value & (value - 1)) == 0;
}
exports.isPowerOf2 = isPowerOf2;
function initSequentialFloatArray(length) {
    var array = new Float32Array(length);
    for (var i = 0; i < length; i++) {
        array[i] = i;
    }
    return array;
}
exports.initSequentialFloatArray = initSequentialFloatArray;


/***/ }),

/***/ "./src/utils/Vector4.ts":
/*!******************************!*\
  !*** ./src/utils/Vector4.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Vector4 = void 0;
// These are the parts of threejs Vector4 that we need.
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

/***/ "./src/glsl_1/CopyFragShader.glsl":
/*!****************************************!*\
  !*** ./src/glsl_1/CopyFragShader.glsl ***!
  \****************************************/
/***/ ((module) => {

module.exports = "precision highp float;\n\nvarying vec2 v_UV;\n\nuniform sampler2D u_state;\n\nvoid main() {\n\tgl_FragColor = texture2D(u_state, v_UV);\n}"

/***/ }),

/***/ "./src/glsl_1/SingleColorFragShader.glsl":
/*!***********************************************!*\
  !*** ./src/glsl_1/SingleColorFragShader.glsl ***!
  \***********************************************/
/***/ ((module) => {

module.exports = "// Fragment shader that draws a single color.\nprecision highp float;\n\nuniform vec3 u_color;\n\nvoid main() {\n\tgl_FragColor = vec4(u_color, 1);\n}"

/***/ }),

/***/ "./src/glsl_1/SingleColorWithWrapCheckFragShader.glsl":
/*!************************************************************!*\
  !*** ./src/glsl_1/SingleColorWithWrapCheckFragShader.glsl ***!
  \************************************************************/
/***/ ((module) => {

module.exports = "// Fragment shader that draws a single color.\nprecision highp float;\n\nuniform vec3 u_color;\nvarying vec2 v_lineWrapping;\n\nvoid main() {\n\t// check if this line has wrapped.\n\tif ((v_lineWrapping.x != 0.0 && v_lineWrapping.x != 1.0) || (v_lineWrapping.y != 0.0 && v_lineWrapping.y != 1.0)) {\n\t\t// Render nothing.\n\t\tdiscard;\n\t\treturn;\n\t}\n\tgl_FragColor = vec4(u_color, 1);\n}"

/***/ }),

/***/ "./src/glsl_3/CopyFloatFragShader.glsl":
/*!*********************************************!*\
  !*** ./src/glsl_3/CopyFloatFragShader.glsl ***!
  \*********************************************/
/***/ ((module) => {

module.exports = "#version 300 es\nprecision highp float;\nprecision highp sampler2D;\n\nin vec2 v_UV;\n\nuniform sampler2D u_state;\n\nout vec4 out_fragColor;\n\nvoid main() {\n\tout_fragColor = texture(u_state, v_UV);\n}"

/***/ }),

/***/ "./src/glsl_3/CopyIntFragShader.glsl":
/*!*******************************************!*\
  !*** ./src/glsl_3/CopyIntFragShader.glsl ***!
  \*******************************************/
/***/ ((module) => {

module.exports = "#version 300 es\nprecision highp float;\nprecision highp int;\nprecision highp isampler2D;\n\nin vec2 v_UV;\n\nuniform isampler2D u_state;\n\nout ivec4 out_fragColor;\n\nvoid main() {\n\tout_fragColor = texture(u_state, v_UV);\n}"

/***/ }),

/***/ "./src/glsl_3/CopyUintFragShader.glsl":
/*!********************************************!*\
  !*** ./src/glsl_3/CopyUintFragShader.glsl ***!
  \********************************************/
/***/ ((module) => {

module.exports = "#version 300 es\nprecision highp float;\nprecision highp int;\nprecision highp usampler2D;\n\nin vec2 v_UV;\n\nuniform usampler2D u_state;\n\nout uvec4 out_fragColor;\n\nvoid main() {\n\tout_fragColor = texture(u_state, v_UV);\n}"

/***/ }),

/***/ "./src/glsl_3/SingleColorFragShader.glsl":
/*!***********************************************!*\
  !*** ./src/glsl_3/SingleColorFragShader.glsl ***!
  \***********************************************/
/***/ ((module) => {

module.exports = "// Fragment shader that draws a single color.\nprecision highp float;\n\nuniform vec3 u_color;\n\nvoid main() {\n\tgl_FragColor = vec4(u_color, 1);\n}"

/***/ }),

/***/ "./src/glsl_3/SingleColorWithWrapCheckFragShader.glsl":
/*!************************************************************!*\
  !*** ./src/glsl_3/SingleColorWithWrapCheckFragShader.glsl ***!
  \************************************************************/
/***/ ((module) => {

module.exports = "// Fragment shader that draws a single color.\nprecision highp float;\n\nuniform vec3 u_color;\nvarying vec2 v_lineWrapping;\n\nvoid main() {\n\t// check if this line has wrapped.\n\tif ((v_lineWrapping.x != 0.0 && v_lineWrapping.x != 1.0) || (v_lineWrapping.y != 0.0 && v_lineWrapping.y != 1.0)) {\n\t\t// Render nothing.\n\t\tdiscard;\n\t\treturn;\n\t}\n\tgl_FragColor = vec4(u_color, 1);\n}"

/***/ }),

/***/ "./src sync recursive":
/*!*******************!*\
  !*** ./src/ sync ***!
  \*******************/
/***/ ((module) => {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = () => ([]);
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = "./src sync recursive";
module.exports = webpackEmptyContext;

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
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
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
/******/ 	/* webpack/runtime/harmony module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.hmd = (module) => {
/******/ 			module = Object.create(module);
/******/ 			if (!module.children) module.children = [];
/******/ 			Object.defineProperty(module, 'exports', {
/******/ 				enumerable: true,
/******/ 				set: () => {
/******/ 					throw new Error('ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: ' + module.id);
/******/ 				}
/******/ 			});
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9AcGV0YW1vcmlrZW4vZmxvYXQxNi9zcmMvRmxvYXQxNkFycmF5LmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9AcGV0YW1vcmlrZW4vZmxvYXQxNi9zcmMvYnVnLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9AcGV0YW1vcmlrZW4vZmxvYXQxNi9zcmMvZGF0YVZpZXcuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL0BwZXRhbW9yaWtlbi9mbG9hdDE2L3NyYy9oZnJvdW5kLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9AcGV0YW1vcmlrZW4vZmxvYXQxNi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL0BwZXRhbW9yaWtlbi9mbG9hdDE2L3NyYy9pcy5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvQHBldGFtb3Jpa2VuL2Zsb2F0MTYvc3JjL2xpYi5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvQHBldGFtb3Jpa2VuL2Zsb2F0MTYvc3JjL3ByaXZhdGUuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL0BwZXRhbW9yaWtlbi9mbG9hdDE2L3NyYy9zcGVjLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9jaGFuZ2VkcGkvZGlzdC9pbmRleC5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvZmlsZS1zYXZlci9kaXN0L0ZpbGVTYXZlci5taW4uanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fSGFzaC5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19MaXN0Q2FjaGUuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fTWFwLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX01hcENhY2hlLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX1N5bWJvbC5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19hc3NvY0luZGV4T2YuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fYmFzZUdldFRhZy5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19iYXNlSXNBcnJheUJ1ZmZlci5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19iYXNlSXNOYXRpdmUuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fYmFzZVVuYXJ5LmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2NvcmVKc0RhdGEuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fZnJlZUdsb2JhbC5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19nZXRNYXBEYXRhLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2dldE5hdGl2ZS5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19nZXRSYXdUYWcuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fZ2V0VmFsdWUuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9faGFzaENsZWFyLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2hhc2hEZWxldGUuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9faGFzaEdldC5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19oYXNoSGFzLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2hhc2hTZXQuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9faXNLZXlhYmxlLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2lzTWFza2VkLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2xpc3RDYWNoZUNsZWFyLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2xpc3RDYWNoZURlbGV0ZS5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19saXN0Q2FjaGVHZXQuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fbGlzdENhY2hlSGFzLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2xpc3RDYWNoZVNldC5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19tYXBDYWNoZUNsZWFyLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX21hcENhY2hlRGVsZXRlLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX21hcENhY2hlR2V0LmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX21hcENhY2hlSGFzLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX21hcENhY2hlU2V0LmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX25hdGl2ZUNyZWF0ZS5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19ub2RlVXRpbC5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19vYmplY3RUb1N0cmluZy5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19yb290LmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX3RvU291cmNlLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvZXEuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9pc0FycmF5QnVmZmVyLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvaXNGdW5jdGlvbi5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL2lzT2JqZWN0LmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvaXNPYmplY3RMaWtlLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvbWVtb2l6ZS5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9zcmMvQ2hlY2tzLnRzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL3NyYy9Db25zdGFudHMudHMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vc3JjL0RhdGFMYXllci50cyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9zcmMvR1BVUHJvZ3JhbS50cyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9zcmMvV2ViR0xDb21wdXRlLnRzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL3NyYy9leHRlbnNpb25zLnRzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9zcmMvdXRpbHMudHMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vc3JjL3V0aWxzL1ZlY3RvcjQudHMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vc3JjL2dsc2xfMS9Db3B5RnJhZ1NoYWRlci5nbHNsIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL3NyYy9nbHNsXzEvU2luZ2xlQ29sb3JGcmFnU2hhZGVyLmdsc2wiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vc3JjL2dsc2xfMS9TaW5nbGVDb2xvcldpdGhXcmFwQ2hlY2tGcmFnU2hhZGVyLmdsc2wiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vc3JjL2dsc2xfMy9Db3B5RmxvYXRGcmFnU2hhZGVyLmdsc2wiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vc3JjL2dsc2xfMy9Db3B5SW50RnJhZ1NoYWRlci5nbHNsIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL3NyYy9nbHNsXzMvQ29weVVpbnRGcmFnU2hhZGVyLmdsc2wiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vc3JjL2dsc2xfMy9TaW5nbGVDb2xvckZyYWdTaGFkZXIuZ2xzbCIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9zcmMvZ2xzbF8zL1NpbmdsZUNvbG9yV2l0aFdyYXBDaGVja0ZyYWdTaGFkZXIuZ2xzbCIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9zcmN8c3luYyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvd2VicGFjay9ydW50aW1lL2hhcm1vbnkgbW9kdWxlIGRlY29yYXRvciIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvd2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNWd0M7QUFDb0I7QUFDSjtBQUNJO0FBQ1g7QUFDVTs7QUFFM0QsVUFBVSw4REFBb0I7O0FBRTlCO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLGFBQWE7QUFDYjtBQUNBO0FB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QUMsQ0FBQztvQkFDM0QsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDL0QsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDL0QsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDL0Q7Z0JBRUQsNkNBQTZDO2dCQUM3QyxJQUFNLEtBQUssR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVDLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJO29CQUFFLFNBQVM7Z0JBQ3JDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN0QixFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdEIsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDekQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLE9BQU8sQ0FBQztnQkFDakIsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLE9BQU8sQ0FBQztnQkFDakIsaUNBQWlDO2dCQUNqQyxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN2RCxJQUFNLE1BQU0sR0FBRyxhQUFhLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ25ELElBQUksS0FBSyxHQUFHLENBQUMsRUFBRTtvQkFDZCxTQUFTLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO29CQUM5QyxTQUFTLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztvQkFDbEQsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQztvQkFDNUUsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO2lCQUNwRjtxQkFBTTtvQkFDTixTQUFTLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztvQkFDbEQsU0FBUyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7b0JBQ2xELFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDcEYsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO2lCQUNwRjthQUNEO1NBQ0Q7UUFDRCxJQUFJLFNBQVMsRUFBRTtZQUNkLHVEQUF1RDtZQUN2RCxTQUFTLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsRCxTQUFTLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xELFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEQsSUFBSSxHQUFHLEVBQUU7Z0JBQ1IsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsQyxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN0QyxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN0QyxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3RDO1lBQ0QsSUFBSSxPQUFPLEVBQUU7Z0JBQ1osT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMxQyxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM5QyxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM5QyxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQzlDO1NBQ0Q7UUFFRCxJQUFNLFNBQVMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FB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O0FDQXZQLHlEQUF5RCxzQkFBc0IsNkJBQTZCLGlCQUFpQiwrQkFBK0IsNEJBQTRCLGlCQUFpQiwyQ0FBMkMsR0FBRyxDOzs7Ozs7Ozs7O0FDQXZQLHVGQUF1Rix5QkFBeUIsaUJBQWlCLG9DQUFvQyxHQUFHLEM7Ozs7Ozs7Ozs7QUNBeEssdUZBQXVGLHlCQUF5Qiw4QkFBOEIsaUJBQWlCLDZKQUE2SixzQ0FBc0MsYUFBYSxLQUFLLG9DQUFvQyxHQUFHLEM7Ozs7Ozs7Ozs7QUNBM1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDOzs7Ozs7VUNSQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDekJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0Esd0NBQXdDLHlDQUF5QztXQUNqRjtXQUNBO1dBQ0EsRTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEVBQUU7V0FDRjtXQUNBO1dBQ0EsQ0FBQyxJOzs7OztXQ1BEO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxFQUFFO1dBQ0Y7V0FDQSxFOzs7OztXQ1ZBLHdGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7OztVQ05BO1VBQ0E7VUFDQTtVQUNBIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiV2ViR0xDb21wdXRlXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIldlYkdMQ29tcHV0ZVwiXSA9IGZhY3RvcnkoKTtcbn0pKHNlbGYsIGZ1bmN0aW9uKCkge1xucmV0dXJuICIsImltcG9ydCBtZW1vaXplIGZyb20gXCJsb2Rhc2gtZXMvbWVtb2l6ZVwiO1xuaW1wb3J0IHsgaXNUeXBlZEFycmF5SW5kZXhlZFByb3BlcnR5V3JpdGFibGUgfSBmcm9tIFwiLi9idWdcIjtcbmltcG9ydCB7IGlzQXJyYXlCdWZmZXIsIGlzU3RyaW5nTnVtYmVyS2V5IH0gZnJvbSBcIi4vaXNcIjtcbmltcG9ydCB7IGNvbnZlcnRUb051bWJlciwgcm91bmRUb0Zsb2F0MTZCaXRzIH0gZnJvbSBcIi4vbGliXCI7XG5pbXBvcnQgeyBjcmVhdGVQcml2YXRlU3RvcmFnZSB9IGZyb20gXCIuL3ByaXZhdGVcIjtcbmltcG9ydCB7IFRvSW50ZWdlciwgZGVmYXVsdENvbXBhcmVGdW5jdGlvbiB9IGZyb20gXCIuL3NwZWNcIjtcblxuY29uc3QgXyA9IGNyZWF0ZVByaXZhdGVTdG9yYWdlKCk7XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB0YXJnZXRcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBpc0Zsb2F0MTZBcnJheSh0YXJnZXQpIHtcbiAgICByZXR1cm4gdGFyZ2V0IGluc3RhbmNlb2YgRmxvYXQxNkFycmF5O1xufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdGFyZ2V0XG4gKiBAdGhyb3dzIHtUeXBlRXJyb3J9XG4gKi9cbmZ1bmN0aW9uIGFzc2VydEZsb2F0MTZBcnJheSh0YXJnZXQpIHtcbiAgICBpZiAoIWlzRmxvYXQxNkFycmF5KHRhcmdldCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlRoaXMgaXMgbm90IGEgRmxvYXQxNkFycmF5XCIpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHRhcmdldFxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzRGVmYXVsdEZsb2F0MTZBcnJheU1ldGhvZHModGFyZ2V0KSB7XG4gICAgcmV0dXJuIHR5cGVvZiB0YXJnZXQgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZhdWx0RmxvYXQxNkFycmF5TWV0aG9kcy5oYXModGFyZ2V0KTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge0Zsb2F0MTZBcnJheX0gZmxvYXQxNmJpdHNcbiAqIEByZXR1cm4ge251bWJlcltdfVxuICovXG5mdW5jdGlvbiBjb3B5VG9BcnJheShmbG9hdDE2Yml0cykge1xuICAgIGNvbnN0IGxlbmd0aCA9IGZsb2F0MTZiaXRzLmxlbmd0aDtcblxuICAgIGNvbnN0IGFycmF5ID0gbmV3IEFycmF5KGxlbmd0aCk7XG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICAgIGFycmF5W2ldID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzW2ldKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXJyYXk7XG59XG5cbi8qKiBAdHlwZSB7UHJveHlIYW5kbGVyPEZ1bmN0aW9uPn0gKi9cbmNvbnN0IGFwcGx5SGFuZGxlciA9IHtcbiAgICBhcHBseShmdW5jLCB0aGlzQXJnLCBhcmdzKSB7XG4gICAgICAgIC8vIHBlZWwgb2ZmIHByb3h5XG4gICAgICAgIGlmIChpc0Zsb2F0MTZBcnJheSh0aGlzQXJnKSAmJiBpc0RlZmF1bHRGbG9hdDE2QXJyYXlNZXRob2RzKGZ1bmMpKSB7XG4gICAgICAgICAgICByZXR1cm4gUmVmbGVjdC5hcHBseShmdW5jLCBfKHRoaXNBcmcpLnRhcmdldCAsYXJncyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUmVmbGVjdC5hcHBseShmdW5jLCB0aGlzQXJnLCBhcmdzKTtcbiAgICB9LFxufTtcblxuLyoqIEB0eXBlIHtQcm94eUhhbmRsZXI8RmxvYXQxNkFycmF5Pn0gKi9cbmNvbnN0IGhhbmRsZXIgPSB7XG4gICAgZ2V0KHRhcmdldCwga2V5KSB7XG4gICAgICAgIGxldCB3cmFwcGVyID0gbnVsbDtcbiAgICAgICAgaWYgKCFpc1R5cGVkQXJyYXlJbmRleGVkUHJvcGVydHlXcml0YWJsZSkge1xuICAgICAgICAgICAgd3JhcHBlciA9IHRhcmdldDtcbiAgICAgICAgICAgIHRhcmdldCA9IF8od3JhcHBlcikudGFyZ2V0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzU3RyaW5nTnVtYmVyS2V5KGtleSkpIHtcbiAgICAgICAgICAgIHJldHVybiBSZWZsZWN0Lmhhcyh0YXJnZXQsIGtleSkgPyBjb252ZXJ0VG9OdW1iZXIoUmVmbGVjdC5nZXQodGFyZ2V0LCBrZXkpKSA6IHVuZGVmaW5lZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IHdyYXBwZXIgIT09IG51bGwgJiYgUmVmbGVjdC5oYXMod3JhcHBlciwga2V5KSA/IFJlZmxlY3QuZ2V0KHdyYXBwZXIsIGtleSkgOiBSZWZsZWN0LmdldCh0YXJnZXQsIGtleSk7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgcmV0ICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBUeXBlZEFycmF5IG1ldGhvZHMgY2FuJ3QgYmUgY2FsbGVkIGJ5IFByb3h5IE9iamVjdFxuICAgICAgICAgICAgbGV0IHByb3h5ID0gXyhyZXQpLnByb3h5O1xuXG4gICAgICAgICAgICBpZiAocHJveHkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHByb3h5ID0gXyhyZXQpLnByb3h5ID0gbmV3IFByb3h5KHJldCwgYXBwbHlIYW5kbGVyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHByb3h5O1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHNldCh0YXJnZXQsIGtleSwgdmFsdWUpIHtcbiAgICAgICAgbGV0IHdyYXBwZXIgPSBudWxsO1xuICAgICAgICBpZiAoIWlzVHlwZWRBcnJheUluZGV4ZWRQcm9wZXJ0eVdyaXRhYmxlKSB7XG4gICAgICAgICAgICB3cmFwcGVyID0gdGFyZ2V0O1xuICAgICAgICAgICAgdGFyZ2V0ID0gXyh3cmFwcGVyKS50YXJnZXQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNTdHJpbmdOdW1iZXJLZXkoa2V5KSkge1xuICAgICAgICAgICAgcmV0dXJuIFJlZmxlY3Quc2V0KHRhcmdldCwga2V5LCByb3VuZFRvRmxvYXQxNkJpdHModmFsdWUpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGZyb3plbiBvYmplY3QgY2FuJ3QgY2hhbmdlIHByb3RvdHlwZSBwcm9wZXJ0eVxuICAgICAgICAgICAgaWYgKHdyYXBwZXIgIT09IG51bGwgJiYgKCFSZWZsZWN0Lmhhcyh0YXJnZXQsIGtleSkgfHwgT2JqZWN0LmlzRnJvemVuKHdyYXBwZXIpKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBSZWZsZWN0LnNldCh3cmFwcGVyLCBrZXksIHZhbHVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFJlZmxlY3Quc2V0KHRhcmdldCwga2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxufTtcblxuaWYgKCFpc1R5cGVkQXJyYXlJbmRleGVkUHJvcGVydHlXcml0YWJsZSkge1xuICAgIGhhbmRsZXIuZ2V0UHJvdG90eXBlT2YgPSAod3JhcHBlcikgPT4geyByZXR1cm4gUmVmbGVjdC5nZXRQcm90b3R5cGVPZihfKHdyYXBwZXIpLnRhcmdldCk7IH07XG4gICAgaGFuZGxlci5zZXRQcm90b3R5cGVPZiA9ICh3cmFwcGVyLCBwcm90b3R5cGUpID0+IHsgcmV0dXJuIFJlZmxlY3Quc2V0UHJvdG90eXBlT2YoXyh3cmFwcGVyKS50YXJnZXQsIHByb3RvdHlwZSk7IH07XG5cbiAgICBoYW5kbGVyLmRlZmluZVByb3BlcnR5ID0gKHdyYXBwZXIsIGtleSwgZGVzY3JpcHRvcikgPT4ge1xuICAgICAgICBjb25zdCB0YXJnZXQgPSBfKHdyYXBwZXIpLnRhcmdldDtcbiAgICAgICAgcmV0dXJuICFSZWZsZWN0Lmhhcyh0YXJnZXQsIGtleSkgfHwgT2JqZWN0LmlzRnJvemVuKHdyYXBwZXIpID8gUmVmbGVjdC5kZWZpbmVQcm9wZXJ0eSh3cmFwcGVyLCBrZXksIGRlc2NyaXB0b3IpIDogUmVmbGVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgZGVzY3JpcHRvcik7XG4gICAgfTtcbiAgICBoYW5kbGVyLmRlbGV0ZVByb3BlcnR5ID0gKHdyYXBwZXIsIGtleSkgPT4ge1xuICAgICAgICBjb25zdCB0YXJnZXQgPSBfKHdyYXBwZXIpLnRhcmdldDtcbiAgICAgICAgcmV0dXJuIFJlZmxlY3QuaGFzKHdyYXBwZXIsIGtleSkgPyBSZWZsZWN0LmRlbGV0ZVByb3BlcnR5KHdyYXBwZXIsIGtleSkgOiBSZWZsZWN0LmRlbGV0ZVByb3BlcnR5KHRhcmdldCwga2V5KTtcbiAgICB9O1xuXG4gICAgaGFuZGxlci5oYXMgPSAod3JhcHBlciwga2V5KSA9PiB7IHJldHVybiBSZWZsZWN0Lmhhcyh3cmFwcGVyLCBrZXkpIHx8IFJlZmxlY3QuaGFzKF8od3JhcHBlcikudGFyZ2V0LCBrZXkpOyB9O1xuXG4gICAgaGFuZGxlci5pc0V4dGVuc2libGUgPSAod3JhcHBlcikgPT4geyByZXR1cm4gUmVmbGVjdC5pc0V4dGVuc2libGUod3JhcHBlcik7IH07XG4gICAgaGFuZGxlci5wcmV2ZW50RXh0ZW5zaW9ucyA9ICh3cmFwcGVyKSA9PiB7IHJldHVybiBSZWZsZWN0LnByZXZlbnRFeHRlbnNpb25zKHdyYXBwZXIpOyB9O1xuXG4gICAgaGFuZGxlci5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSAod3JhcHBlciwga2V5KSA9PiB7IHJldHVybiBSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih3cmFwcGVyLCBrZXkpOyB9O1xuICAgIGhhbmRsZXIub3duS2V5cyA9ICh3cmFwcGVyKSA9PiB7IHJldHVybiBSZWZsZWN0Lm93bktleXMod3JhcHBlcik7IH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZsb2F0MTZBcnJheSBleHRlbmRzIFVpbnQxNkFycmF5IHtcblxuICAgIGNvbnN0cnVjdG9yKGlucHV0LCBieXRlT2Zmc2V0LCBsZW5ndGgpIHtcbiAgICAgICAgLy8gaW5wdXQgRmxvYXQxNkFycmF5XG4gICAgICAgIGlmIChpc0Zsb2F0MTZBcnJheShpbnB1dCkpIHtcbiAgICAgICAgICAgIHN1cGVyKF8oaW5wdXQpLnRhcmdldCk7XG5cbiAgICAgICAgLy8gMjIuMi4xLjMsIDIyLjIuMS40IFR5cGVkQXJyYXksIEFycmF5LCBBcnJheUxpa2UsIEl0ZXJhYmxlXG4gICAgICAgIH0gZWxzZSBpZiAoaW5wdXQgIT09IG51bGwgJiYgdHlwZW9mIGlucHV0ID09PSBcIm9iamVjdFwiICYmICFpc0FycmF5QnVmZmVyKGlucHV0KSkge1xuICAgICAgICAgICAgLy8gaWYgaW5wdXQgaXMgbm90IEFycmF5TGlrZSBhbmQgSXRlcmFibGUsIGdldCBBcnJheVxuICAgICAgICAgICAgY29uc3QgYXJyYXlMaWtlID0gIVJlZmxlY3QuaGFzKGlucHV0LCBcImxlbmd0aFwiKSAmJiBpbnB1dFtTeW1ib2wuaXRlcmF0b3JdICE9PSB1bmRlZmluZWQgPyBbLi4uaW5wdXRdIDogaW5wdXQ7XG5cbiAgICAgICAgICAgIGNvbnN0IGxlbmd0aCA9IGFycmF5TGlrZS5sZW5ndGg7XG4gICAgICAgICAgICBzdXBlcihsZW5ndGgpO1xuXG4gICAgICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICAvLyBzdXBlciAoVWludDE2QXJyYXkpXG4gICAgICAgICAgICAgICAgdGhpc1tpXSA9IHJvdW5kVG9GbG9hdDE2Qml0cyhhcnJheUxpa2VbaV0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIC8vIDIyLjIuMS4yLCAyMi4yLjEuNSBwcmltaXRpdmUsIEFycmF5QnVmZmVyXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgIHN1cGVyKGlucHV0KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgIHN1cGVyKGlucHV0LCBieXRlT2Zmc2V0KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgIHN1cGVyKGlucHV0LCBieXRlT2Zmc2V0LCBsZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBwcm94eTtcblxuICAgICAgICBpZiAoaXNUeXBlZEFycmF5SW5kZXhlZFByb3BlcnR5V3JpdGFibGUpIHtcbiAgICAgICAgICAgIHByb3h5ID0gbmV3IFByb3h5KHRoaXMsIGhhbmRsZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3Qgd3JhcHBlciA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgICAgICBfKHdyYXBwZXIpLnRhcmdldCA9IHRoaXM7XG4gICAgICAgICAgICBwcm94eSA9IG5ldyBQcm94eSh3cmFwcGVyLCBoYW5kbGVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHByb3h5IHByaXZhdGUgc3RvcmFnZVxuICAgICAgICBfKHByb3h5KS50YXJnZXQgPSB0aGlzO1xuXG4gICAgICAgIC8vIHRoaXMgcHJpdmF0ZSBzdG9yYWdlXG4gICAgICAgIF8odGhpcykucHJveHkgPSBwcm94eTtcblxuICAgICAgICByZXR1cm4gcHJveHk7XG4gICAgfVxuXG4gICAgLy8gc3RhdGljIG1ldGhvZHNcbiAgICBzdGF0aWMgZnJvbShzcmMsIC4uLm9wdHMpIHtcbiAgICAgICAgaWYgKG9wdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEZsb2F0MTZBcnJheShVaW50MTZBcnJheS5mcm9tKHNyYywgcm91bmRUb0Zsb2F0MTZCaXRzKS5idWZmZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbWFwRnVuYyA9IG9wdHNbMF07XG4gICAgICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzFdO1xuXG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQxNkFycmF5KFVpbnQxNkFycmF5LmZyb20oc3JjLCBmdW5jdGlvbiAodmFsLCAuLi5hcmdzKSB7XG4gICAgICAgICAgICByZXR1cm4gcm91bmRUb0Zsb2F0MTZCaXRzKG1hcEZ1bmMuY2FsbCh0aGlzLCB2YWwsIC4uLmFyZ3MpKTtcbiAgICAgICAgfSwgdGhpc0FyZykuYnVmZmVyKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgb2YoLi4uYXJncykge1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MTZBcnJheShhcmdzKTtcbiAgICB9XG5cbiAgICAvLyBpdGVyYXRlIG1ldGhvZHNcbiAgICAqIFtTeW1ib2wuaXRlcmF0b3JdKCkge1xuICAgICAgICBmb3IoY29uc3QgdmFsIG9mIHN1cGVyW1N5bWJvbC5pdGVyYXRvcl0oKSkge1xuICAgICAgICAgICAgeWllbGQgY29udmVydFRvTnVtYmVyKHZhbCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBrZXlzKCkge1xuICAgICAgICByZXR1cm4gc3VwZXIua2V5cygpO1xuICAgIH1cblxuICAgICogdmFsdWVzKCkge1xuICAgICAgICBmb3IoY29uc3QgdmFsIG9mIHN1cGVyLnZhbHVlcygpKSB7XG4gICAgICAgICAgICB5aWVsZCBjb252ZXJ0VG9OdW1iZXIodmFsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKiBAdHlwZSB7KCkgPT4gSXRlcmFibGVJdGVyYXRvcjxbbnVtYmVyLCBudW1iZXJdPn0gKi9cbiAgICAqIGVudHJpZXMoKSB7XG4gICAgICAgIGZvcihjb25zdCBbaSwgdmFsXSBvZiBzdXBlci5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgIHlpZWxkIFtpLCBjb252ZXJ0VG9OdW1iZXIodmFsKV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBmdW5jdGlvbmFsIG1ldGhvZHNcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgbWFwKGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcblxuICAgICAgICBjb25zdCB0aGlzQXJnID0gb3B0c1swXTtcblxuICAgICAgICBjb25zdCBhcnJheSA9IFtdO1xuICAgICAgICBmb3IobGV0IGkgPSAwLCBsID0gdGhpcy5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbCA9IGNvbnZlcnRUb051bWJlcih0aGlzW2ldKTtcbiAgICAgICAgICAgIGFycmF5LnB1c2goY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB2YWwsIGksIF8odGhpcykucHJveHkpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQxNkFycmF5KGFycmF5KTtcbiAgICB9XG5cbiAgICAvLyBAdHMtaWdub3JlXG4gICAgZmlsdGVyKGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcblxuICAgICAgICBjb25zdCB0aGlzQXJnID0gb3B0c1swXTtcblxuICAgICAgICBjb25zdCBhcnJheSA9IFtdO1xuICAgICAgICBmb3IobGV0IGkgPSAwLCBsID0gdGhpcy5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbCA9IGNvbnZlcnRUb051bWJlcih0aGlzW2ldKTtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHZhbCwgaSwgXyh0aGlzKS5wcm94eSkpIHtcbiAgICAgICAgICAgICAgICBhcnJheS5wdXNoKHZhbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MTZBcnJheShhcnJheSk7XG4gICAgfVxuXG4gICAgcmVkdWNlKGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcblxuICAgICAgICBsZXQgdmFsLCBzdGFydDtcblxuICAgICAgICBpZiAob3B0cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHZhbCA9IGNvbnZlcnRUb051bWJlcih0aGlzWzBdKTtcbiAgICAgICAgICAgIHN0YXJ0ID0gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhbCA9IG9wdHNbMF07XG4gICAgICAgICAgICBzdGFydCA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IobGV0IGkgPSBzdGFydCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgICAgICAgICB2YWwgPSBjYWxsYmFjayh2YWwsIGNvbnZlcnRUb051bWJlcih0aGlzW2ldKSwgaSwgXyh0aGlzKS5wcm94eSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdmFsO1xuICAgIH1cblxuICAgIHJlZHVjZVJpZ2h0KGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcblxuICAgICAgICBsZXQgdmFsLCBzdGFydDtcblxuICAgICAgICBjb25zdCBsZW5ndGggPSB0aGlzLmxlbmd0aDtcbiAgICAgICAgaWYgKG9wdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICB2YWwgPSBjb252ZXJ0VG9OdW1iZXIodGhpc1tsZW5ndGggLSAxXSk7XG4gICAgICAgICAgICBzdGFydCA9IGxlbmd0aCAtIDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YWwgPSBvcHRzWzBdO1xuICAgICAgICAgICAgc3RhcnQgPSBsZW5ndGg7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IobGV0IGkgPSBzdGFydDsgaS0tOykge1xuICAgICAgICAgICAgdmFsID0gY2FsbGJhY2sodmFsLCBjb252ZXJ0VG9OdW1iZXIodGhpc1tpXSksIGksIF8odGhpcykucHJveHkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbDtcbiAgICB9XG5cbiAgICBmb3JFYWNoKGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcblxuICAgICAgICBjb25zdCB0aGlzQXJnID0gb3B0c1swXTtcblxuICAgICAgICBmb3IobGV0IGkgPSAwLCBsID0gdGhpcy5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwodGhpc0FyZywgY29udmVydFRvTnVtYmVyKHRoaXNbaV0pLCBpLCBfKHRoaXMpLnByb3h5KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbmQoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICAgICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgICAgIGZvcihsZXQgaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBjb252ZXJ0VG9OdW1iZXIodGhpc1tpXSk7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB2YWx1ZSwgaSwgXyh0aGlzKS5wcm94eSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmaW5kSW5kZXgoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICAgICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgICAgIGZvcihsZXQgaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBjb252ZXJ0VG9OdW1iZXIodGhpc1tpXSk7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB2YWx1ZSwgaSwgXyh0aGlzKS5wcm94eSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICBldmVyeShjYWxsYmFjaywgLi4ub3B0cykge1xuICAgICAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG5cbiAgICAgICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMF07XG5cbiAgICAgICAgZm9yKGxldCBpID0gMCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgICAgICAgICBpZiAoIWNhbGxiYWNrLmNhbGwodGhpc0FyZywgY29udmVydFRvTnVtYmVyKHRoaXNbaV0pLCBpLCBfKHRoaXMpLnByb3h5KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHNvbWUoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICAgICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgICAgIGZvcihsZXQgaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrLmNhbGwodGhpc0FyZywgY29udmVydFRvTnVtYmVyKHRoaXNbaV0pLCBpLCBfKHRoaXMpLnByb3h5KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIGNoYW5nZSBlbGVtZW50IG1ldGhvZHNcbiAgICBzZXQoaW5wdXQsIC4uLm9wdHMpIHtcbiAgICAgICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgICAgIGNvbnN0IG9mZnNldCA9IG9wdHNbMF07XG5cbiAgICAgICAgbGV0IGZsb2F0MTZiaXRzO1xuXG4gICAgICAgIC8vIGlucHV0IEZsb2F0MTZBcnJheVxuICAgICAgICBpZiAoaXNGbG9hdDE2QXJyYXkoaW5wdXQpKSB7XG4gICAgICAgICAgICBmbG9hdDE2Yml0cyA9IF8oaW5wdXQpLnRhcmdldDtcblxuICAgICAgICAvLyBpbnB1dCBvdGhlcnNcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGFycmF5TGlrZSA9ICFSZWZsZWN0LmhhcyhpbnB1dCwgXCJsZW5ndGhcIikgJiYgaW5wdXRbU3ltYm9sLml0ZXJhdG9yXSAhPT0gdW5kZWZpbmVkID8gWy4uLmlucHV0XSA6IGlucHV0O1xuICAgICAgICAgICAgY29uc3QgbGVuZ3RoID0gYXJyYXlMaWtlLmxlbmd0aDtcblxuICAgICAgICAgICAgZmxvYXQxNmJpdHMgPSBuZXcgVWludDE2QXJyYXkobGVuZ3RoKTtcbiAgICAgICAgICAgIGZvcihsZXQgaSA9IDAsIGwgPSBhcnJheUxpa2UubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgICAgICAgICAgICAgZmxvYXQxNmJpdHNbaV0gPSByb3VuZFRvRmxvYXQxNkJpdHMoYXJyYXlMaWtlW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHN1cGVyLnNldChmbG9hdDE2Yml0cywgb2Zmc2V0KTtcbiAgICB9XG5cbiAgICByZXZlcnNlKCkge1xuICAgICAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG5cbiAgICAgICAgc3VwZXIucmV2ZXJzZSgpO1xuXG4gICAgICAgIHJldHVybiBfKHRoaXMpLnByb3h5O1xuICAgIH1cblxuICAgIGZpbGwodmFsdWUsIC4uLm9wdHMpIHtcbiAgICAgICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgICAgIHN1cGVyLmZpbGwocm91bmRUb0Zsb2F0MTZCaXRzKHZhbHVlKSwgLi4ub3B0cyk7XG5cbiAgICAgICAgcmV0dXJuIF8odGhpcykucHJveHk7XG4gICAgfVxuXG4gICAgY29weVdpdGhpbih0YXJnZXQsIHN0YXJ0LCAuLi5vcHRzKSB7XG4gICAgICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcblxuICAgICAgICBzdXBlci5jb3B5V2l0aGluKHRhcmdldCwgc3RhcnQsIC4uLm9wdHMpO1xuXG4gICAgICAgIHJldHVybiBfKHRoaXMpLnByb3h5O1xuICAgIH1cblxuICAgIHNvcnQoLi4ub3B0cykge1xuICAgICAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG5cbiAgICAgICAgbGV0IGNvbXBhcmVGdW5jdGlvbiA9IG9wdHNbMF07XG5cbiAgICAgICAgaWYgKGNvbXBhcmVGdW5jdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb21wYXJlRnVuY3Rpb24gPSBkZWZhdWx0Q29tcGFyZUZ1bmN0aW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgX2NvbnZlcnRUb051bWJlciA9IG1lbW9pemUoY29udmVydFRvTnVtYmVyKTtcblxuICAgICAgICBzdXBlci5zb3J0KCh4LCB5KSA9PiB7IHJldHVybiBjb21wYXJlRnVuY3Rpb24oX2NvbnZlcnRUb051bWJlcih4KSwgX2NvbnZlcnRUb051bWJlcih5KSk7IH0pO1xuXG4gICAgICAgIHJldHVybiBfKHRoaXMpLnByb3h5O1xuICAgIH1cblxuICAgIC8vIGNvcHkgZWxlbWVudCBtZXRob2RzXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHNsaWNlKC4uLm9wdHMpIHtcbiAgICAgICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgICAgIGxldCBmbG9hdDE2Yml0cztcblxuICAgICAgICAvLyBWOCwgU3BpZGVyTW9ua2V5LCBKYXZhU2NyaXB0Q29yZSwgQ2hha3JhIHRocm93IFR5cGVFcnJvclxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZmxvYXQxNmJpdHMgPSBzdXBlci5zbGljZSguLi5vcHRzKTtcbiAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICBpZiAoZSBpbnN0YW5jZW9mIFR5cGVFcnJvcikge1xuICAgICAgICAgICAgICAgIGNvbnN0IHVpbnQxNiA9IG5ldyBVaW50MTZBcnJheSh0aGlzLmJ1ZmZlciwgdGhpcy5ieXRlT2Zmc2V0LCB0aGlzLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgZmxvYXQxNmJpdHMgPSB1aW50MTYuc2xpY2UoLi4ub3B0cyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MTZBcnJheShmbG9hdDE2Yml0cy5idWZmZXIpO1xuICAgIH1cblxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBzdWJhcnJheSguLi5vcHRzKSB7XG4gICAgICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcblxuICAgICAgICBsZXQgZmxvYXQxNmJpdHM7XG5cbiAgICAgICAgLy8gVjgsIFNwaWRlck1vbmtleSwgSmF2YVNjcmlwdENvcmUsIENoYWtyYSB0aHJvdyBUeXBlRXJyb3JcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZsb2F0MTZiaXRzID0gc3VwZXIuc3ViYXJyYXkoLi4ub3B0cyk7XG4gICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBUeXBlRXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB1aW50MTYgPSBuZXcgVWludDE2QXJyYXkodGhpcy5idWZmZXIsIHRoaXMuYnl0ZU9mZnNldCwgdGhpcy5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIGZsb2F0MTZiaXRzID0gdWludDE2LnN1YmFycmF5KC4uLm9wdHMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDE2QXJyYXkoZmxvYXQxNmJpdHMuYnVmZmVyLCBmbG9hdDE2Yml0cy5ieXRlT2Zmc2V0LCBmbG9hdDE2Yml0cy5sZW5ndGgpO1xuICAgIH1cblxuICAgIC8vIGNvbnRhaW5zIG1ldGhvZHNcbiAgICBpbmRleE9mKGVsZW1lbnQsIC4uLm9wdHMpIHtcbiAgICAgICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMubGVuZ3RoO1xuXG4gICAgICAgIGxldCBmcm9tID0gVG9JbnRlZ2VyKG9wdHNbMF0pO1xuXG4gICAgICAgIGlmIChmcm9tIDwgMCkge1xuICAgICAgICAgICAgZnJvbSArPSBsZW5ndGg7XG4gICAgICAgICAgICBpZiAoZnJvbSA8IDApIHtcbiAgICAgICAgICAgICAgICBmcm9tID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvcihsZXQgaSA9IGZyb20sIGwgPSBsZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICAgICAgICAgIGlmIChjb252ZXJ0VG9OdW1iZXIodGhpc1tpXSkgPT09IGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICBsYXN0SW5kZXhPZihlbGVtZW50LCAuLi5vcHRzKSB7XG4gICAgICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcblxuICAgICAgICBjb25zdCBsZW5ndGggPSB0aGlzLmxlbmd0aDtcblxuICAgICAgICBsZXQgZnJvbSA9IFRvSW50ZWdlcihvcHRzWzBdKTtcblxuICAgICAgICBmcm9tID0gZnJvbSA9PT0gMCA/IGxlbmd0aCA6IGZyb20gKyAxO1xuXG4gICAgICAgIGlmIChmcm9tID49IDApIHtcbiAgICAgICAgICAgIGZyb20gPSBmcm9tIDwgbGVuZ3RoID8gZnJvbSA6IGxlbmd0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZyb20gKz0gbGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yKGxldCBpID0gZnJvbTsgaS0tOykge1xuICAgICAgICAgICAgaWYgKGNvbnZlcnRUb051bWJlcih0aGlzW2ldKSA9PT0gZWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIGluY2x1ZGVzKGVsZW1lbnQsIC4uLm9wdHMpIHtcbiAgICAgICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMubGVuZ3RoO1xuXG4gICAgICAgIGxldCBmcm9tID0gVG9JbnRlZ2VyKG9wdHNbMF0pO1xuXG4gICAgICAgIGlmIChmcm9tIDwgMCkge1xuICAgICAgICAgICAgZnJvbSArPSBsZW5ndGg7XG4gICAgICAgICAgICBpZiAoZnJvbSA8IDApIHtcbiAgICAgICAgICAgICAgICBmcm9tID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGlzTmFOID0gTnVtYmVyLmlzTmFOKGVsZW1lbnQpO1xuICAgICAgICBmb3IobGV0IGkgPSBmcm9tLCBsID0gbGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGNvbnZlcnRUb051bWJlcih0aGlzW2ldKTtcblxuICAgICAgICAgICAgaWYgKGlzTmFOICYmIE51bWJlci5pc05hTih2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHZhbHVlID09PSBlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gc3RyaW5nIG1ldGhvZHNcbiAgICBqb2luKC4uLm9wdHMpIHtcbiAgICAgICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgICAgIGNvbnN0IGFycmF5ID0gY29weVRvQXJyYXkodGhpcyk7XG5cbiAgICAgICAgcmV0dXJuIGFycmF5LmpvaW4oLi4ub3B0cyk7XG4gICAgfVxuXG4gICAgdG9Mb2NhbGVTdHJpbmcoLi4ub3B0cykge1xuICAgICAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG5cbiAgICAgICAgY29uc3QgYXJyYXkgPSBjb3B5VG9BcnJheSh0aGlzKTtcblxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIHJldHVybiBhcnJheS50b0xvY2FsZVN0cmluZyguLi5vcHRzKTtcbiAgICB9XG5cbiAgICAvLyBAdHMtaWdub3JlXG4gICAgZ2V0IFtTeW1ib2wudG9TdHJpbmdUYWddKCkge1xuICAgICAgICBpZiAoaXNGbG9hdDE2QXJyYXkodGhpcykpIHtcbiAgICAgICAgICAgIHJldHVybiBcIkZsb2F0MTZBcnJheVwiO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5jb25zdCBGbG9hdDE2QXJyYXkkcHJvdG90eXBlID0gRmxvYXQxNkFycmF5LnByb3RvdHlwZTtcblxuY29uc3QgZGVmYXVsdEZsb2F0MTZBcnJheU1ldGhvZHMgPSBuZXcgV2Vha1NldCgpO1xuZm9yKGNvbnN0IGtleSBvZiBSZWZsZWN0Lm93bktleXMoRmxvYXQxNkFycmF5JHByb3RvdHlwZSkpIHtcbiAgICBjb25zdCB2YWwgPSBGbG9hdDE2QXJyYXkkcHJvdG90eXBlW2tleV07XG4gICAgaWYgKHR5cGVvZiB2YWwgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBkZWZhdWx0RmxvYXQxNkFycmF5TWV0aG9kcy5hZGQodmFsKTtcbiAgICB9XG59XG4iLCIvKipcbiAqIEphdmFTY3JpcHRDb3JlIDw9IDEyIGJ1Z1xuICogQHNlZSBodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTcxNjA2XG4gKi9cbmV4cG9ydCBjb25zdCBpc1R5cGVkQXJyYXlJbmRleGVkUHJvcGVydHlXcml0YWJsZSA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobmV3IFVpbnQ4QXJyYXkoMSksIDApLndyaXRhYmxlO1xuIiwiaW1wb3J0IHsgaXNEYXRhVmlldyB9IGZyb20gXCIuL2lzXCI7XG5pbXBvcnQgeyBjb252ZXJ0VG9OdW1iZXIsIHJvdW5kVG9GbG9hdDE2Qml0cyB9IGZyb20gXCIuL2xpYlwiO1xuXG4vKipcbiAqIHJldHVybnMgYW4gdW5zaWduZWQgMTYtYml0IGZsb2F0IGF0IHRoZSBzcGVjaWZpZWQgYnl0ZSBvZmZzZXQgZnJvbSB0aGUgc3RhcnQgb2YgdGhlIERhdGFWaWV3LlxuICogQHBhcmFtIHtEYXRhVmlld30gZGF0YVZpZXdcbiAqIEBwYXJhbSB7bnVtYmVyfSBieXRlT2Zmc2V0XG4gKiBAcGFyYW0ge1tib29sZWFuXX0gb3B0c1xuICogQHJldHVybnMge251bWJlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEZsb2F0MTYoZGF0YVZpZXcsIGJ5dGVPZmZzZXQsIC4uLm9wdHMpIHtcbiAgICBpZiAoIWlzRGF0YVZpZXcoZGF0YVZpZXcpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJGaXJzdCBhcmd1bWVudCB0byBnZXRGbG9hdDE2IGZ1bmN0aW9uIG11c3QgYmUgYSBEYXRhVmlld1wiKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29udmVydFRvTnVtYmVyKCBkYXRhVmlldy5nZXRVaW50MTYoYnl0ZU9mZnNldCwgLi4ub3B0cykgKTtcbn1cblxuLyoqXG4gKiBzdG9yZXMgYW4gdW5zaWduZWQgMTYtYml0IGZsb2F0IHZhbHVlIGF0IHRoZSBzcGVjaWZpZWQgYnl0ZSBvZmZzZXQgZnJvbSB0aGUgc3RhcnQgb2YgdGhlIERhdGFWaWV3LlxuICogQHBhcmFtIHtEYXRhVmlld30gZGF0YVZpZXdcbiAqIEBwYXJhbSB7bnVtYmVyfSBieXRlT2Zmc2V0XG4gKiBAcGFyYW0ge251bWJlcn0gdmFsdWVcbiAqIEBwYXJhbSB7W2Jvb2xlYW5dfSBvcHRzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRGbG9hdDE2KGRhdGFWaWV3LCBieXRlT2Zmc2V0LCB2YWx1ZSwgLi4ub3B0cykge1xuICAgIGlmICghaXNEYXRhVmlldyhkYXRhVmlldykpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkZpcnN0IGFyZ3VtZW50IHRvIHNldEZsb2F0MTYgZnVuY3Rpb24gbXVzdCBiZSBhIERhdGFWaWV3XCIpO1xuICAgIH1cblxuICAgIGRhdGFWaWV3LnNldFVpbnQxNihieXRlT2Zmc2V0LCByb3VuZFRvRmxvYXQxNkJpdHModmFsdWUpLCAuLi5vcHRzKTtcbn1cbiIsImltcG9ydCB7IGNvbnZlcnRUb051bWJlciwgcm91bmRUb0Zsb2F0MTZCaXRzIH0gZnJvbSBcIi4vbGliXCI7XG5cbi8qKlxuICogcmV0dXJucyB0aGUgbmVhcmVzdCBoYWxmIHByZWNpc2lvbiBmbG9hdCByZXByZXNlbnRhdGlvbiBvZiBhIG51bWJlci5cbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1cbiAqIEByZXR1cm5zIHtudW1iZXJ9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGhmcm91bmQobnVtKSB7XG4gICAgbnVtID0gTnVtYmVyKG51bSk7XG5cbiAgICAvLyBmb3Igb3B0aW1pemF0aW9uXG4gICAgaWYgKCFOdW1iZXIuaXNGaW5pdGUobnVtKSB8fCBudW0gPT09IDApIHtcbiAgICAgICAgcmV0dXJuIG51bTtcbiAgICB9XG5cbiAgICBjb25zdCB4MTYgPSByb3VuZFRvRmxvYXQxNkJpdHMobnVtKTtcbiAgICByZXR1cm4gY29udmVydFRvTnVtYmVyKHgxNik7XG59XG4iLCJleHBvcnQgeyBkZWZhdWx0IGFzIGhmcm91bmQgfSBmcm9tIFwiLi9oZnJvdW5kXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEZsb2F0MTZBcnJheSB9IGZyb20gXCIuL0Zsb2F0MTZBcnJheVwiO1xuZXhwb3J0IHsgZ2V0RmxvYXQxNiwgc2V0RmxvYXQxNiB9IGZyb20gXCIuL2RhdGFWaWV3LmpzXCI7XG4iLCJpbXBvcnQgeyBUb0ludGVnZXIgfSBmcm9tIFwiLi9zcGVjXCI7XG5cbmV4cG9ydCB7IGRlZmF1bHQgYXMgaXNBcnJheUJ1ZmZlciB9IGZyb20gXCJsb2Rhc2gtZXMvaXNBcnJheUJ1ZmZlclwiO1xuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdmlld1xuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0RhdGFWaWV3KHZpZXcpIHtcbiAgICByZXR1cm4gdmlldyBpbnN0YW5jZW9mIERhdGFWaWV3O1xufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0ga2V5XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzU3RyaW5nTnVtYmVyS2V5KGtleSkge1xuICAgIHJldHVybiB0eXBlb2Yga2V5ID09PSBcInN0cmluZ1wiICYmIGtleSA9PT0gVG9JbnRlZ2VyKGtleSkgKyBcIlwiO1xufVxuIiwiLy8gYWxnb3JpdGhtOiBmdHA6Ly9mdHAuZm94LXRvb2xraXQub3JnL3B1Yi9mYXN0aGFsZmZsb2F0Y29udmVyc2lvbi5wZGZcblxuY29uc3QgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuY29uc3QgZmxvYXRWaWV3ID0gbmV3IEZsb2F0MzJBcnJheShidWZmZXIpO1xuY29uc3QgdWludDMyVmlldyA9IG5ldyBVaW50MzJBcnJheShidWZmZXIpO1xuXG5cbmNvbnN0IGJhc2VUYWJsZSA9IG5ldyBVaW50MzJBcnJheSg1MTIpO1xuY29uc3Qgc2hpZnRUYWJsZSA9IG5ldyBVaW50MzJBcnJheSg1MTIpO1xuXG5mb3IobGV0IGkgPSAwOyBpIDwgMjU2OyArK2kpIHtcbiAgICBjb25zdCBlID0gaSAtIDEyNztcblxuICAgIC8vIHZlcnkgc21hbGwgbnVtYmVyICgwLCAtMClcbiAgICBpZiAoZSA8IC0yNykge1xuICAgICAgICBiYXNlVGFibGVbaSB8IDB4MDAwXSA9IDB4MDAwMDtcbiAgICAgICAgYmFzZVRhYmxlW2kgfCAweDEwMF0gPSAweDgwMDA7XG4gICAgICAgIHNoaWZ0VGFibGVbaSB8IDB4MDAwXSA9IDI0O1xuICAgICAgICBzaGlmdFRhYmxlW2kgfCAweDEwMF0gPSAyNDtcblxuICAgIC8vIHNtYWxsIG51bWJlciAoZGVub3JtKVxuICAgIH0gZWxzZSBpZiAoZSA8IC0xNCkge1xuICAgICAgICBiYXNlVGFibGVbaSB8IDB4MDAwXSA9ICAweDA0MDAgPj4gKC1lIC0gMTQpO1xuICAgICAgICBiYXNlVGFibGVbaSB8IDB4MTAwXSA9ICgweDA0MDAgPj4gKC1lIC0gMTQpKSB8IDB4ODAwMDtcbiAgICAgICAgc2hpZnRUYWJsZVtpIHwgMHgwMDBdID0gLWUgLSAxO1xuICAgICAgICBzaGlmdFRhYmxlW2kgfCAweDEwMF0gPSAtZSAtIDE7XG5cbiAgICAvLyBub3JtYWwgbnVtYmVyXG4gICAgfSBlbHNlIGlmIChlIDw9IDE1KSB7XG4gICAgICAgIGJhc2VUYWJsZVtpIHwgMHgwMDBdID0gIChlICsgMTUpIDw8IDEwO1xuICAgICAgICBiYXNlVGFibGVbaSB8IDB4MTAwXSA9ICgoZSArIDE1KSA8PCAxMCkgfCAweDgwMDA7XG4gICAgICAgIHNoaWZ0VGFibGVbaSB8IDB4MDAwXSA9IDEzO1xuICAgICAgICBzaGlmdFRhYmxlW2kgfCAweDEwMF0gPSAxMztcblxuICAgIC8vIGxhcmdlIG51bWJlciAoSW5maW5pdHksIC1JbmZpbml0eSlcbiAgICB9IGVsc2UgaWYgKGUgPCAxMjgpIHtcbiAgICAgICAgYmFzZVRhYmxlW2kgfCAweDAwMF0gPSAweDdjMDA7XG4gICAgICAgIGJhc2VUYWJsZVtpIHwgMHgxMDBdID0gMHhmYzAwO1xuICAgICAgICBzaGlmdFRhYmxlW2kgfCAweDAwMF0gPSAyNDtcbiAgICAgICAgc2hpZnRUYWJsZVtpIHwgMHgxMDBdID0gMjQ7XG5cbiAgICAvLyBzdGF5IChOYU4sIEluZmluaXR5LCAtSW5maW5pdHkpXG4gICAgfSBlbHNlIHtcbiAgICAgICAgYmFzZVRhYmxlW2kgfCAweDAwMF0gPSAweDdjMDA7XG4gICAgICAgIGJhc2VUYWJsZVtpIHwgMHgxMDBdID0gMHhmYzAwO1xuICAgICAgICBzaGlmdFRhYmxlW2kgfCAweDAwMF0gPSAxMztcbiAgICAgICAgc2hpZnRUYWJsZVtpIHwgMHgxMDBdID0gMTM7XG4gICAgfVxufVxuXG4vKipcbiAqIHJvdW5kIGEgbnVtYmVyIHRvIGEgaGFsZiBmbG9hdCBudW1iZXIgYml0cy5cbiAqIEBwYXJhbSB7bnVtYmVyfSBudW0gLSBkb3VibGUgZmxvYXRcbiAqIEByZXR1cm5zIHtudW1iZXJ9IGhhbGYgZmxvYXQgbnVtYmVyIGJpdHNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJvdW5kVG9GbG9hdDE2Qml0cyhudW0pIHtcbiAgICBmbG9hdFZpZXdbMF0gPSBudW07XG5cbiAgICBjb25zdCBmID0gdWludDMyVmlld1swXTtcbiAgICBjb25zdCBlID0gKGYgPj4gMjMpICYgMHgxZmY7XG4gICAgcmV0dXJuIGJhc2VUYWJsZVtlXSArICgoZiAmIDB4MDA3ZmZmZmYpID4+IHNoaWZ0VGFibGVbZV0pO1xufVxuXG5cbmNvbnN0IG1hbnRpc3NhVGFibGUgPSBuZXcgVWludDMyQXJyYXkoMjA0OCk7XG5jb25zdCBleHBvbmVudFRhYmxlID0gbmV3IFVpbnQzMkFycmF5KDY0KTtcbmNvbnN0IG9mZnNldFRhYmxlID0gbmV3IFVpbnQzMkFycmF5KDY0KTtcblxubWFudGlzc2FUYWJsZVswXSA9IDA7XG5mb3IobGV0IGkgPSAxOyBpIDwgMTAyNDsgKytpKSB7XG4gICAgbGV0IG0gPSBpIDw8IDEzOyAgICAvLyB6ZXJvIHBhZCBtYW50aXNzYSBiaXRzXG4gICAgbGV0IGUgPSAwOyAgICAgICAgICAvLyB6ZXJvIGV4cG9uZW50XG5cbiAgICAvLyBub3JtYWxpemVkXG4gICAgd2hpbGUoKG0gJiAweDAwODAwMDAwKSA9PT0gMCkge1xuICAgICAgICBlIC09IDB4MDA4MDAwMDA7ICAgIC8vIGRlY3JlbWVudCBleHBvbmVudFxuICAgICAgICBtIDw8PSAxO1xuICAgIH1cblxuICAgIG0gJj0gfjB4MDA4MDAwMDA7ICAgLy8gY2xlYXIgbGVhZGluZyAxIGJpdFxuICAgIGUgKz0gMHgzODgwMDAwMDsgICAgLy8gYWRqdXN0IGJpYXNcblxuICAgIG1hbnRpc3NhVGFibGVbaV0gPSBtIHwgZTtcbn1cbmZvcihsZXQgaSA9IDEwMjQ7IGkgPCAyMDQ4OyArK2kpIHtcbiAgICBtYW50aXNzYVRhYmxlW2ldID0gMHgzODAwMDAwMCArICgoaSAtIDEwMjQpIDw8IDEzKTtcbn1cblxuZXhwb25lbnRUYWJsZVswXSA9IDA7XG5mb3IobGV0IGkgPSAxOyBpIDwgMzE7ICsraSkge1xuICAgIGV4cG9uZW50VGFibGVbaV0gPSBpIDw8IDIzO1xufVxuZXhwb25lbnRUYWJsZVszMV0gPSAweDQ3ODAwMDAwO1xuZXhwb25lbnRUYWJsZVszMl0gPSAweDgwMDAwMDAwO1xuZm9yKGxldCBpID0gMzM7IGkgPCA2MzsgKytpKSB7XG4gICAgZXhwb25lbnRUYWJsZVtpXSA9IDB4ODAwMDAwMDAgKyAoKGkgLSAzMikgPDwgMjMpO1xufVxuZXhwb25lbnRUYWJsZVs2M10gPSAweGM3ODAwMDAwO1xuXG5vZmZzZXRUYWJsZVswXSA9IDA7XG5mb3IobGV0IGkgPSAxOyBpIDwgNjQ7ICsraSkge1xuICAgIGlmIChpID09PSAzMikge1xuICAgICAgICBvZmZzZXRUYWJsZVtpXSA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgb2Zmc2V0VGFibGVbaV0gPSAxMDI0O1xuICAgIH1cbn1cblxuLyoqXG4gKiBjb252ZXJ0IGEgaGFsZiBmbG9hdCBudW1iZXIgYml0cyB0byBhIG51bWJlci5cbiAqIEBwYXJhbSB7bnVtYmVyfSBmbG9hdDE2Yml0cyAtIGhhbGYgZmxvYXQgbnVtYmVyIGJpdHNcbiAqIEByZXR1cm5zIHtudW1iZXJ9IGRvdWJsZSBmbG9hdFxuICovXG5leHBvcnQgZnVuY3Rpb24gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzKSB7XG4gICAgY29uc3QgbSA9IGZsb2F0MTZiaXRzID4+IDEwO1xuICAgIHVpbnQzMlZpZXdbMF0gPSBtYW50aXNzYVRhYmxlW29mZnNldFRhYmxlW21dICsgKGZsb2F0MTZiaXRzICYgMHgzZmYpXSArIGV4cG9uZW50VGFibGVbbV07XG4gICAgcmV0dXJuIGZsb2F0Vmlld1swXTtcbn1cbiIsIi8qKlxuICogQHJldHVybnMgeyhzZWxmOm9iamVjdCkgPT4gb2JqZWN0fVxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUHJpdmF0ZVN0b3JhZ2UoKSB7XG5cdGNvbnN0IHdtID0gbmV3IFdlYWtNYXAoKTtcblx0cmV0dXJuIChzZWxmKSA9PiB7XG5cdFx0bGV0IG9iaiA9IHdtLmdldChzZWxmKTtcblx0XHRpZiAob2JqKSB7XG5cdFx0XHRyZXR1cm4gb2JqO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRvYmogPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXHRcdFx0d20uc2V0KHNlbGYsIG9iaik7XG5cdFx0XHRyZXR1cm4gb2JqO1xuXHRcdH1cblx0fTtcbn1cbiIsIi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB0YXJnZXRcbiAqIEByZXR1cm5zIHtudW1iZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBUb0ludGVnZXIodGFyZ2V0KSB7XG4gICAgbGV0IG51bWJlciA9IHR5cGVvZiB0YXJnZXQgIT09IFwibnVtYmVyXCIgPyBOdW1iZXIodGFyZ2V0KSA6IHRhcmdldDtcbiAgICBpZiAoTnVtYmVyLmlzTmFOKG51bWJlcikpIHtcbiAgICAgICAgbnVtYmVyID0gMDtcbiAgICB9XG4gICAgcmV0dXJuIE1hdGgudHJ1bmMobnVtYmVyKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge251bWJlcn0geFxuICogQHBhcmFtIHtudW1iZXJ9IHlcbiAqIEByZXR1cm5zIHstMSB8IDAgfCAxfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVmYXVsdENvbXBhcmVGdW5jdGlvbih4LCB5KSB7XG4gICAgY29uc3QgW2lzTmFOX3gsIGlzTmFOX3ldID0gW051bWJlci5pc05hTih4KSwgTnVtYmVyLmlzTmFOKHkpXTtcblxuICAgIGlmIChpc05hTl94ICYmIGlzTmFOX3kpIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgaWYgKGlzTmFOX3gpIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgfVxuXG4gICAgaWYgKGlzTmFOX3kpIHtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIGlmICh4IDwgeSkge1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgaWYgKHggPiB5KSB7XG4gICAgICAgIHJldHVybiAxO1xuICAgIH1cblxuICAgIGlmICh4ID09PSAwICYmIHkgPT09IDApIHtcbiAgICAgICAgY29uc3QgW2lzUGx1c1plcm9feCwgaXNQbHVzWmVyb195XSA9IFtPYmplY3QuaXMoeCwgMCksIE9iamVjdC5pcyh5LCAwKV07XG5cbiAgICAgICAgaWYgKCFpc1BsdXNaZXJvX3ggJiYgaXNQbHVzWmVyb195KSB7XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNQbHVzWmVyb194ICYmICFpc1BsdXNaZXJvX3kpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIDA7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmNoYW5nZURwaUJsb2IgPSBjaGFuZ2VEcGlCbG9iO1xuZXhwb3J0cy5jaGFuZ2VEcGlEYXRhVXJsID0gY2hhbmdlRHBpRGF0YVVybDtcblxuZnVuY3Rpb24gX3RvQ29uc3VtYWJsZUFycmF5KGFycikgeyBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7IGZvciAodmFyIGkgPSAwLCBhcnIyID0gQXJyYXkoYXJyLmxlbmd0aCk7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHsgYXJyMltpXSA9IGFycltpXTsgfSByZXR1cm4gYXJyMjsgfSBlbHNlIHsgcmV0dXJuIEFycmF5LmZyb20oYXJyKTsgfSB9XG5cbmZ1bmN0aW9uIGNyZWF0ZVBuZ0RhdGFUYWJsZSgpIHtcbiAgLyogVGFibGUgb2YgQ1JDcyBvZiBhbGwgOC1iaXQgbWVzc2FnZXMuICovXG4gIHZhciBjcmNUYWJsZSA9IG5ldyBJbnQzMkFycmF5KDI1Nik7XG4gIGZvciAodmFyIG4gPSAwOyBuIDwgMjU2OyBuKyspIHtcbiAgICB2YXIgYyA9IG47XG4gICAgZm9yICh2YXIgayA9IDA7IGsgPCA4OyBrKyspIHtcbiAgICAgIGMgPSBjICYgMSA/IDB4ZWRiODgzMjAgXiBjID4+PiAxIDogYyA+Pj4gMTtcbiAgICB9XG4gICAgY3JjVGFibGVbbl0gPSBjO1xuICB9XG4gIHJldHVybiBjcmNUYWJsZTtcbn1cblxuZnVuY3Rpb24gY2FsY0NyYyhidWYpIHtcbiAgdmFyIGMgPSAtMTtcbiAgaWYgKCFwbmdEYXRhVGFibGUpIHBuZ0RhdGFUYWJsZSA9IGNyZWF0ZVBuZ0RhdGFUYWJsZSgpO1xuICBmb3IgKHZhciBuID0gMDsgbiA8IGJ1Zi5sZW5ndGg7IG4rKykge1xuICAgIGMgPSBwbmdEYXRhVGFibGVbKGMgXiBidWZbbl0pICYgMHhGRl0gXiBjID4+PiA4O1xuICB9XG4gIHJldHVybiBjIF4gLTE7XG59XG5cbnZhciBwbmdEYXRhVGFibGUgPSB2b2lkIDA7XG5cbnZhciBQTkcgPSAnaW1hZ2UvcG5nJztcbnZhciBKUEVHID0gJ2ltYWdlL2pwZWcnO1xuXG4vLyB0aG9zZSBhcmUgMyBwb3NzaWJsZSBzaWduYXR1cmUgb2YgdGhlIHBoeXNCbG9jayBpbiBiYXNlNjQuXG4vLyB0aGUgcEhZcyBzaWduYXR1cmUgYmxvY2sgaXMgcHJlY2VlZCBieSB0aGUgNCBieXRlcyBvZiBsZW5naHQuIFRoZSBsZW5ndGggb2Zcbi8vIHRoZSBibG9jayBpcyBhbHdheXMgOSBieXRlcy4gU28gYSBwaHlzIGJsb2NrIGhhcyBhbHdheXMgdGhpcyBzaWduYXR1cmU6XG4vLyAwIDAgMCA5IHAgSCBZIHMuXG4vLyBIb3dldmVyIHRoZSBkYXRhNjQgZW5jb2RpbmcgYWxpZ25zIHdlIHdpbGwgYWx3YXlzIGZpbmQgb25lIG9mIHRob3NlIDMgc3RyaW5ncy5cbi8vIHRoaXMgYWxsb3cgdXMgdG8gZmluZCB0aGlzIHBhcnRpY3VsYXIgb2NjdXJlbmNlIG9mIHRoZSBwSFlzIGJsb2NrIHdpdGhvdXRcbi8vIGNvbnZlcnRpbmcgZnJvbSBiNjQgYmFjayB0byBzdHJpbmdcbnZhciBiNjRQaHlzU2lnbmF0dXJlMSA9ICdBQWx3U0Zseic7XG52YXIgYjY0UGh5c1NpZ25hdHVyZTIgPSAnQUFBSmNFaFonO1xudmFyIGI2NFBoeXNTaWduYXR1cmUzID0gJ0FBQUFDWEJJJztcblxudmFyIF9QID0gJ3AnLmNoYXJDb2RlQXQoMCk7XG52YXIgX0ggPSAnSCcuY2hhckNvZGVBdCgwKTtcbnZhciBfWSA9ICdZJy5jaGFyQ29kZUF0KDApO1xudmFyIF9TID0gJ3MnLmNoYXJDb2RlQXQoMCk7XG5cbmZ1bmN0aW9uIGNoYW5nZURwaUJsb2IoYmxvYiwgZHBpKSB7XG4gIC8vIDMzIGJ5dGVzIGFyZSBvayBmb3IgcG5ncyBhbmQganBlZ3NcbiAgLy8gdG8gY29udGFpbiB0aGUgaW5mb3JtYXRpb24uXG4gIHZhciBoZWFkZXJDaHVuayA9IGJsb2Iuc2xpY2UoMCwgMzMpO1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHZhciBmaWxlUmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICBmaWxlUmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBkYXRhQXJyYXkgPSBuZXcgVWludDhBcnJheShmaWxlUmVhZGVyLnJlc3VsdCk7XG4gICAgICB2YXIgdGFpbCA9IGJsb2Iuc2xpY2UoMzMpO1xuICAgICAgdmFyIGNoYW5nZWRBcnJheSA9IGNoYW5nZURwaU9uQXJyYXkoZGF0YUFycmF5LCBkcGksIGJsb2IudHlwZSk7XG4gICAgICByZXNvbHZlKG5ldyBCbG9iKFtjaGFuZ2VkQXJyYXksIHRhaWxdLCB7IHR5cGU6IGJsb2IudHlwZSB9KSk7XG4gICAgfTtcbiAgICBmaWxlUmVhZGVyLnJlYWRBc0FycmF5QnVmZmVyKGhlYWRlckNodW5rKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGNoYW5nZURwaURhdGFVcmwoYmFzZTY0SW1hZ2UsIGRwaSkge1xuICB2YXIgZGF0YVNwbGl0dGVkID0gYmFzZTY0SW1hZ2Uuc3BsaXQoJywnKTtcbiAgdmFyIGZvcm1hdCA9IGRhdGFTcGxpdHRlZFswXTtcbiAgdmFyIGJvZHkgPSBkYXRhU3BsaXR0ZWRbMV07XG4gIHZhciB0eXBlID0gdm9pZCAwO1xuICB2YXIgaGVhZGVyTGVuZ3RoID0gdm9pZCAwO1xuICB2YXIgb3ZlcndyaXRlcEhZcyA9IGZhbHNlO1xuICBpZiAoZm9ybWF0LmluZGV4T2YoUE5HKSAhPT0gLTEpIHtcbiAgICB0eXBlID0gUE5HO1xuICAgIHZhciBiNjRJbmRleCA9IGRldGVjdFBoeXNDaHVua0Zyb21EYXRhVXJsKGJvZHkpO1xuICAgIC8vIDI4IGJ5dGVzIGluIGRhdGFVcmwgYXJlIDIxYnl0ZXMsIGxlbmd0aCBvZiBwaHlzIGNodW5rIHdpdGggZXZlcnl0aGluZyBpbnNpZGUuXG4gICAgaWYgKGI2NEluZGV4ID49IDApIHtcbiAgICAgIGhlYWRlckxlbmd0aCA9IE1hdGguY2VpbCgoYjY0SW5kZXggKyAyOCkgLyAzKSAqIDQ7XG4gICAgICBvdmVyd3JpdGVwSFlzID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaGVhZGVyTGVuZ3RoID0gMzMgLyAzICogNDtcbiAgICB9XG4gIH1cbiAgaWYgKGZvcm1hdC5pbmRleE9mKEpQRUcpICE9PSAtMSkge1xuICAgIHR5cGUgPSBKUEVHO1xuICAgIGhlYWRlckxlbmd0aCA9IDE4IC8gMyAqIDQ7XG4gIH1cbiAgLy8gMzMgYnl0ZXMgYXJlIG9rIGZvciBwbmdzIGFuZCBqcGVnc1xuICAvLyB0byBjb250YWluIHRoZSBpbmZvcm1hdGlvbi5cbiAgdmFyIHN0cmluZ0hlYWRlciA9IGJvZHkuc3Vic3RyaW5nKDAsIGhlYWRlckxlbmd0aCk7XG4gIHZhciByZXN0T2ZEYXRhID0gYm9keS5zdWJzdHJpbmcoaGVhZGVyTGVuZ3RoKTtcbiAgdmFyIGhlYWRlckJ5dGVzID0gYXRvYihzdHJpbmdIZWFkZXIpO1xuICB2YXIgZGF0YUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoaGVhZGVyQnl0ZXMubGVuZ3RoKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICBkYXRhQXJyYXlbaV0gPSBoZWFkZXJCeXRlcy5jaGFyQ29kZUF0KGkpO1xuICB9XG4gIHZhciBmaW5hbEFycmF5ID0gY2hhbmdlRHBpT25BcnJheShkYXRhQXJyYXksIGRwaSwgdHlwZSwgb3ZlcndyaXRlcEhZcyk7XG4gIHZhciBiYXNlNjRIZWFkZXIgPSBidG9hKFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoU3RyaW5nLCBfdG9Db25zdW1hYmxlQXJyYXkoZmluYWxBcnJheSkpKTtcbiAgcmV0dXJuIFtmb3JtYXQsICcsJywgYmFzZTY0SGVhZGVyLCByZXN0T2ZEYXRhXS5qb2luKCcnKTtcbn1cblxuZnVuY3Rpb24gZGV0ZWN0UGh5c0NodW5rRnJvbURhdGFVcmwoZGF0YSkge1xuICB2YXIgYjY0aW5kZXggPSBkYXRhLmluZGV4T2YoYjY0UGh5c1NpZ25hdHVyZTEpO1xuICBpZiAoYjY0aW5kZXggPT09IC0xKSB7XG4gICAgYjY0aW5kZXggPSBkYXRhLmluZGV4T2YoYjY0UGh5c1NpZ25hdHVyZTIpO1xuICB9XG4gIGlmIChiNjRpbmRleCA9PT0gLTEpIHtcbiAgICBiNjRpbmRleCA9IGRhdGEuaW5kZXhPZihiNjRQaHlzU2lnbmF0dXJlMyk7XG4gIH1cbiAgLy8gaWYgYjY0aW5kZXggPT09IC0xIGNodW5rIGlzIG5vdCBmb3VuZFxuICByZXR1cm4gYjY0aW5kZXg7XG59XG5cbmZ1bmN0aW9uIHNlYXJjaFN0YXJ0T2ZQaHlzKGRhdGEpIHtcbiAgdmFyIGxlbmd0aCA9IGRhdGEubGVuZ3RoIC0gMTtcbiAgLy8gd2UgY2hlY2sgZnJvbSB0aGUgZW5kIHNpbmNlIHdlIGN1dCB0aGUgc3RyaW5nIGluIHByb3hpbWl0eSBvZiB0aGUgaGVhZGVyXG4gIC8vIHRoZSBoZWFkZXIgaXMgd2l0aGluIDIxIGJ5dGVzIGZyb20gdGhlIGVuZC5cbiAgZm9yICh2YXIgaSA9IGxlbmd0aDsgaSA+PSA0OyBpLS0pIHtcbiAgICBpZiAoZGF0YVtpIC0gNF0gPT09IDkgJiYgZGF0YVtpIC0gM10gPT09IF9QICYmIGRhdGFbaSAtIDJdID09PSBfSCAmJiBkYXRhW2kgLSAxXSA9PT0gX1kgJiYgZGF0YVtpXSA9PT0gX1MpIHtcbiAgICAgIHJldHVybiBpIC0gMztcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gY2hhbmdlRHBpT25BcnJheShkYXRhQXJyYXksIGRwaSwgZm9ybWF0LCBvdmVyd3JpdGVwSFlzKSB7XG4gIGlmIChmb3JtYXQgPT09IEpQRUcpIHtcbiAgICBkYXRhQXJyYXlbMTNdID0gMTsgLy8gMSBwaXhlbCBwZXIgaW5jaCBvciAyIHBpeGVsIHBlciBjbVxuICAgIGRhdGFBcnJheVsxNF0gPSBkcGkgPj4gODsgLy8gZHBpWCBoaWdoIGJ5dGVcbiAgICBkYXRhQXJyYXlbMTVdID0gZHBpICYgMHhmZjsgLy8gZHBpWCBsb3cgYnl0ZVxuICAgIGRhdGFBcnJheVsxNl0gPSBkcGkgPj4gODsgLy8gZHBpWSBoaWdoIGJ5dGVcbiAgICBkYXRhQXJyYXlbMTddID0gZHBpICYgMHhmZjsgLy8gZHBpWSBsb3cgYnl0ZVxuICAgIHJldHVybiBkYXRhQXJyYXk7XG4gIH1cbiAgaWYgKGZvcm1hdCA9PT0gUE5HKSB7XG4gICAgdmFyIHBoeXNDaHVuayA9IG5ldyBVaW50OEFycmF5KDEzKTtcbiAgICAvLyBjaHVuayBoZWFkZXIgcEhZc1xuICAgIC8vIDkgYnl0ZXMgb2YgZGF0YVxuICAgIC8vIDQgYnl0ZXMgb2YgY3JjXG4gICAgLy8gdGhpcyBtdWx0aXBsaWNhdGlvbiBpcyBiZWNhdXNlIHRoZSBzdGFuZGFyZCBpcyBkcGkgcGVyIG1ldGVyLlxuICAgIGRwaSAqPSAzOS4zNzAxO1xuICAgIHBoeXNDaHVua1swXSA9IF9QO1xuICAgIHBoeXNDaHVua1sxXSA9IF9IO1xuICAgIHBoeXNDaHVua1syXSA9IF9ZO1xuICAgIHBoeXNDaHVua1szXSA9IF9TO1xuICAgIHBoeXNDaHVua1s0XSA9IGRwaSA+Pj4gMjQ7IC8vIGRwaVggaGlnaGVzdCBieXRlXG4gICAgcGh5c0NodW5rWzVdID0gZHBpID4+PiAxNjsgLy8gZHBpWCB2ZXJ5aGlnaCBieXRlXG4gICAgcGh5c0NodW5rWzZdID0gZHBpID4+PiA4OyAvLyBkcGlYIGhpZ2ggYnl0ZVxuICAgIHBoeXNDaHVua1s3XSA9IGRwaSAmIDB4ZmY7IC8vIGRwaVggbG93IGJ5dGVcbiAgICBwaHlzQ2h1bmtbOF0gPSBwaHlzQ2h1bmtbNF07IC8vIGRwaVkgaGlnaGVzdCBieXRlXG4gICAgcGh5c0NodW5rWzldID0gcGh5c0NodW5rWzVdOyAvLyBkcGlZIHZlcnloaWdoIGJ5dGVcbiAgICBwaHlzQ2h1bmtbMTBdID0gcGh5c0NodW5rWzZdOyAvLyBkcGlZIGhpZ2ggYnl0ZVxuICAgIHBoeXNDaHVua1sxMV0gPSBwaHlzQ2h1bmtbN107IC8vIGRwaVkgbG93IGJ5dGVcbiAgICBwaHlzQ2h1bmtbMTJdID0gMTsgLy8gZG90IHBlciBtZXRlci4uLi5cblxuICAgIHZhciBjcmMgPSBjYWxjQ3JjKHBoeXNDaHVuayk7XG5cbiAgICB2YXIgY3JjQ2h1bmsgPSBuZXcgVWludDhBcnJheSg0KTtcbiAgICBjcmNDaHVua1swXSA9IGNyYyA+Pj4gMjQ7XG4gICAgY3JjQ2h1bmtbMV0gPSBjcmMgPj4+IDE2O1xuICAgIGNyY0NodW5rWzJdID0gY3JjID4+PiA4O1xuICAgIGNyY0NodW5rWzNdID0gY3JjICYgMHhmZjtcblxuICAgIGlmIChvdmVyd3JpdGVwSFlzKSB7XG4gICAgICB2YXIgc3RhcnRpbmdJbmRleCA9IHNlYXJjaFN0YXJ0T2ZQaHlzKGRhdGFBcnJheSk7XG4gICAgICBkYXRhQXJyYXkuc2V0KHBoeXNDaHVuaywgc3RhcnRpbmdJbmRleCk7XG4gICAgICBkYXRhQXJyYXkuc2V0KGNyY0NodW5rLCBzdGFydGluZ0luZGV4ICsgMTMpO1xuICAgICAgcmV0dXJuIGRhdGFBcnJheTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gaSBuZWVkIHRvIGdpdmUgYmFjayBhbiBhcnJheSBvZiBkYXRhIHRoYXQgaXMgZGl2aXNpYmxlIGJ5IDMgc28gdGhhdFxuICAgICAgLy8gZGF0YXVybCBlbmNvZGluZyBnaXZlcyBtZSBpbnRlZ2VycywgZm9yIGx1Y2sgdGhpcyBjaHVuayBpcyAxNyArIDQgPSAyMVxuICAgICAgLy8gaWYgaXQgd2FzIHdlIGNvdWxkIGFkZCBhIHRleHQgY2h1bmsgY29udGFuaW5nIHNvbWUgaW5mbywgdW50aWxsIGRlc2lyZWRcbiAgICAgIC8vIGxlbmd0aCBpcyBtZXQuXG5cbiAgICAgIC8vIGNodW5rIHN0cnVjdHVyIDQgYnl0ZXMgZm9yIGxlbmd0aCBpcyA5XG4gICAgICB2YXIgY2h1bmtMZW5ndGggPSBuZXcgVWludDhBcnJheSg0KTtcbiAgICAgIGNodW5rTGVuZ3RoWzBdID0gMDtcbiAgICAgIGNodW5rTGVuZ3RoWzFdID0gMDtcbiAgICAgIGNodW5rTGVuZ3RoWzJdID0gMDtcbiAgICAgIGNodW5rTGVuZ3RoWzNdID0gOTtcblxuICAgICAgdmFyIGZpbmFsSGVhZGVyID0gbmV3IFVpbnQ4QXJyYXkoNTQpO1xuICAgICAgZmluYWxIZWFkZXIuc2V0KGRhdGFBcnJheSwgMCk7XG4gICAgICBmaW5hbEhlYWRlci5zZXQoY2h1bmtMZW5ndGgsIDMzKTtcbiAgICAgIGZpbmFsSGVhZGVyLnNldChwaHlzQ2h1bmssIDM3KTtcbiAgICAgIGZpbmFsSGVhZGVyLnNldChjcmNDaHVuaywgNTApO1xuICAgICAgcmV0dXJuIGZpbmFsSGVhZGVyO1xuICAgIH1cbiAgfVxufSIsIihmdW5jdGlvbihhLGIpe2lmKFwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZClkZWZpbmUoW10sYik7ZWxzZSBpZihcInVuZGVmaW5lZFwiIT10eXBlb2YgZXhwb3J0cyliKCk7ZWxzZXtiKCksYS5GaWxlU2F2ZXI9e2V4cG9ydHM6e319LmV4cG9ydHN9fSkodGhpcyxmdW5jdGlvbigpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIGIoYSxiKXtyZXR1cm5cInVuZGVmaW5lZFwiPT10eXBlb2YgYj9iPXthdXRvQm9tOiExfTpcIm9iamVjdFwiIT10eXBlb2YgYiYmKGNvbnNvbGUud2FybihcIkRlcHJlY2F0ZWQ6IEV4cGVjdGVkIHRoaXJkIGFyZ3VtZW50IHRvIGJlIGEgb2JqZWN0XCIpLGI9e2F1dG9Cb206IWJ9KSxiLmF1dG9Cb20mJi9eXFxzKig/OnRleHRcXC9cXFMqfGFwcGxpY2F0aW9uXFwveG1sfFxcUypcXC9cXFMqXFwreG1sKVxccyo7LipjaGFyc2V0XFxzKj1cXHMqdXRmLTgvaS50ZXN0KGEudHlwZSk/bmV3IEJsb2IoW1wiXFx1RkVGRlwiLGFdLHt0eXBlOmEudHlwZX0pOmF9ZnVuY3Rpb24gYyhhLGIsYyl7dmFyIGQ9bmV3IFhNTEh0dHBSZXF1ZXN0O2Qub3BlbihcIkdFVFwiLGEpLGQucmVzcG9uc2VUeXBlPVwiYmxvYlwiLGQub25sb2FkPWZ1bmN0aW9uKCl7ZyhkLnJlc3BvbnNlLGIsYyl9LGQub25lcnJvcj1mdW5jdGlvbigpe2NvbnNvbGUuZXJyb3IoXCJjb3VsZCBub3QgZG93bmxvYWQgZmlsZVwiKX0sZC5zZW5kKCl9ZnVuY3Rpb24gZChhKXt2YXIgYj1uZXcgWE1MSHR0cFJlcXVlc3Q7Yi5vcGVuKFwiSEVBRFwiLGEsITEpO3RyeXtiLnNlbmQoKX1jYXRjaChhKXt9cmV0dXJuIDIwMDw9Yi5zdGF0dXMmJjI5OT49Yi5zdGF0dXN9ZnVuY3Rpb24gZShhKXt0cnl7YS5kaXNwYXRjaEV2ZW50KG5ldyBNb3VzZUV2ZW50KFwiY2xpY2tcIikpfWNhdGNoKGMpe3ZhciBiPWRvY3VtZW50LmNyZWF0ZUV2ZW50KFwiTW91c2VFdmVudHNcIik7Yi5pbml0TW91c2VFdmVudChcImNsaWNrXCIsITAsITAsd2luZG93LDAsMCwwLDgwLDIwLCExLCExLCExLCExLDAsbnVsbCksYS5kaXNwYXRjaEV2ZW50KGIpfX12YXIgZj1cIm9iamVjdFwiPT10eXBlb2Ygd2luZG93JiZ3aW5kb3cud2luZG93PT09d2luZG93P3dpbmRvdzpcIm9iamVjdFwiPT10eXBlb2Ygc2VsZiYmc2VsZi5zZWxmPT09c2VsZj9zZWxmOlwib2JqZWN0XCI9PXR5cGVvZiBnbG9iYWwmJmdsb2JhbC5nbG9iYWw9PT1nbG9iYWw/Z2xvYmFsOnZvaWQgMCxhPWYubmF2aWdhdG9yJiYvTWFjaW50b3NoLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpJiYvQXBwbGVXZWJLaXQvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkmJiEvU2FmYXJpLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpLGc9Zi5zYXZlQXN8fChcIm9iamVjdFwiIT10eXBlb2Ygd2luZG93fHx3aW5kb3chPT1mP2Z1bmN0aW9uKCl7fTpcImRvd25sb2FkXCJpbiBIVE1MQW5jaG9yRWxlbWVudC5wcm90b3R5cGUmJiFhP2Z1bmN0aW9uKGIsZyxoKXt2YXIgaT1mLlVSTHx8Zi53ZWJraXRVUkwsaj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtnPWd8fGIubmFtZXx8XCJkb3dubG9hZFwiLGouZG93bmxvYWQ9ZyxqLnJlbD1cIm5vb3BlbmVyXCIsXCJzdHJpbmdcIj09dHlwZW9mIGI/KGouaHJlZj1iLGoub3JpZ2luPT09bG9jYXRpb24ub3JpZ2luP2Uoaik6ZChqLmhyZWYpP2MoYixnLGgpOmUoaixqLnRhcmdldD1cIl9ibGFua1wiKSk6KGouaHJlZj1pLmNyZWF0ZU9iamVjdFVSTChiKSxzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7aS5yZXZva2VPYmplY3RVUkwoai5ocmVmKX0sNEU0KSxzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7ZShqKX0sMCkpfTpcIm1zU2F2ZU9yT3BlbkJsb2JcImluIG5hdmlnYXRvcj9mdW5jdGlvbihmLGcsaCl7aWYoZz1nfHxmLm5hbWV8fFwiZG93bmxvYWRcIixcInN0cmluZ1wiIT10eXBlb2YgZiluYXZpZ2F0b3IubXNTYXZlT3JPcGVuQmxvYihiKGYsaCksZyk7ZWxzZSBpZihkKGYpKWMoZixnLGgpO2Vsc2V7dmFyIGk9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7aS5ocmVmPWYsaS50YXJnZXQ9XCJfYmxhbmtcIixzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7ZShpKX0pfX06ZnVuY3Rpb24oYixkLGUsZyl7aWYoZz1nfHxvcGVuKFwiXCIsXCJfYmxhbmtcIiksZyYmKGcuZG9jdW1lbnQudGl0bGU9Zy5kb2N1bWVudC5ib2R5LmlubmVyVGV4dD1cImRvd25sb2FkaW5nLi4uXCIpLFwic3RyaW5nXCI9PXR5cGVvZiBiKXJldHVybiBjKGIsZCxlKTt2YXIgaD1cImFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbVwiPT09Yi50eXBlLGk9L2NvbnN0cnVjdG9yL2kudGVzdChmLkhUTUxFbGVtZW50KXx8Zi5zYWZhcmksaj0vQ3JpT1NcXC9bXFxkXSsvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7aWYoKGp8fGgmJml8fGEpJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgRmlsZVJlYWRlcil7dmFyIGs9bmV3IEZpbGVSZWFkZXI7ay5vbmxvYWRlbmQ9ZnVuY3Rpb24oKXt2YXIgYT1rLnJlc3VsdDthPWo/YTphLnJlcGxhY2UoL15kYXRhOlteO10qOy8sXCJkYXRhOmF0dGFjaG1lbnQvZmlsZTtcIiksZz9nLmxvY2F0aW9uLmhyZWY9YTpsb2NhdGlvbj1hLGc9bnVsbH0say5yZWFkQXNEYXRhVVJMKGIpfWVsc2V7dmFyIGw9Zi5VUkx8fGYud2Via2l0VVJMLG09bC5jcmVhdGVPYmplY3RVUkwoYik7Zz9nLmxvY2F0aW9uPW06bG9jYXRpb24uaHJlZj1tLGc9bnVsbCxzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7bC5yZXZva2VPYmplY3RVUkwobSl9LDRFNCl9fSk7Zi5zYXZlQXM9Zy5zYXZlQXM9ZyxcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlJiYobW9kdWxlLmV4cG9ydHM9Zyl9KTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9RmlsZVNhdmVyLm1pbi5qcy5tYXAiLCJpbXBvcnQgaGFzaENsZWFyIGZyb20gJy4vX2hhc2hDbGVhci5qcyc7XG5pbXBvcnQgaGFzaERlbGV0ZSBmcm9tICcuL19oYXNoRGVsZXRlLmpzJztcbmltcG9ydCBoYXNoR2V0IGZyb20gJy4vX2hhc2hHZXQuanMnO1xuaW1wb3J0IGhhc2hIYXMgZnJvbSAnLi9faGFzaEhhcy5qcyc7XG5pbXBvcnQgaGFzaFNldCBmcm9tICcuL19oYXNoU2V0LmpzJztcblxuLyoqXG4gKiBDcmVhdGVzIGEgaGFzaCBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIEhhc2goZW50cmllcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGVudHJpZXMgPT0gbnVsbCA/IDAgOiBlbnRyaWVzLmxlbmd0aDtcblxuICB0aGlzLmNsZWFyKCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGVudHJ5ID0gZW50cmllc1tpbmRleF07XG4gICAgdGhpcy5zZXQoZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgfVxufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgSGFzaGAuXG5IYXNoLnByb3RvdHlwZS5jbGVhciA9IGhhc2hDbGVhcjtcbkhhc2gucHJvdG90eXBlWydkZWxldGUnXSA9IGhhc2hEZWxldGU7XG5IYXNoLnByb3RvdHlwZS5nZXQgPSBoYXNoR2V0O1xuSGFzaC5wcm90b3R5cGUuaGFzID0gaGFzaEhhcztcbkhhc2gucHJvdG90eXBlLnNldCA9IGhhc2hTZXQ7XG5cbmV4cG9ydCBkZWZhdWx0IEhhc2g7XG4iLCJpbXBvcnQgbGlzdENhY2hlQ2xlYXIgZnJvbSAnLi9fbGlzdENhY2hlQ2xlYXIuanMnO1xuaW1wb3J0IGxpc3RDYWNoZURlbGV0ZSBmcm9tICcuL19saXN0Q2FjaGVEZWxldGUuanMnO1xuaW1wb3J0IGxpc3RDYWNoZUdldCBmcm9tICcuL19saXN0Q2FjaGVHZXQuanMnO1xuaW1wb3J0IGxpc3RDYWNoZUhhcyBmcm9tICcuL19saXN0Q2FjaGVIYXMuanMnO1xuaW1wb3J0IGxpc3RDYWNoZVNldCBmcm9tICcuL19saXN0Q2FjaGVTZXQuanMnO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gbGlzdCBjYWNoZSBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIExpc3RDYWNoZShlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBMaXN0Q2FjaGVgLlxuTGlzdENhY2hlLnByb3RvdHlwZS5jbGVhciA9IGxpc3RDYWNoZUNsZWFyO1xuTGlzdENhY2hlLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBsaXN0Q2FjaGVEZWxldGU7XG5MaXN0Q2FjaGUucHJvdG90eXBlLmdldCA9IGxpc3RDYWNoZUdldDtcbkxpc3RDYWNoZS5wcm90b3R5cGUuaGFzID0gbGlzdENhY2hlSGFzO1xuTGlzdENhY2hlLnByb3RvdHlwZS5zZXQgPSBsaXN0Q2FjaGVTZXQ7XG5cbmV4cG9ydCBkZWZhdWx0IExpc3RDYWNoZTtcbiIsImltcG9ydCBnZXROYXRpdmUgZnJvbSAnLi9fZ2V0TmF0aXZlLmpzJztcbmltcG9ydCByb290IGZyb20gJy4vX3Jvb3QuanMnO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgTWFwID0gZ2V0TmF0aXZlKHJvb3QsICdNYXAnKTtcblxuZXhwb3J0IGRlZmF1bHQgTWFwO1xuIiwiaW1wb3J0IG1hcENhY2hlQ2xlYXIgZnJvbSAnLi9fbWFwQ2FjaGVDbGVhci5qcyc7XG5pbXBvcnQgbWFwQ2FjaGVEZWxldGUgZnJvbSAnLi9fbWFwQ2FjaGVEZWxldGUuanMnO1xuaW1wb3J0IG1hcENhY2hlR2V0IGZyb20gJy4vX21hcENhY2hlR2V0LmpzJztcbmltcG9ydCBtYXBDYWNoZUhhcyBmcm9tICcuL19tYXBDYWNoZUhhcy5qcyc7XG5pbXBvcnQgbWFwQ2FjaGVTZXQgZnJvbSAnLi9fbWFwQ2FjaGVTZXQuanMnO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBtYXAgY2FjaGUgb2JqZWN0IHRvIHN0b3JlIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gTWFwQ2FjaGUoZW50cmllcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGVudHJpZXMgPT0gbnVsbCA/IDAgOiBlbnRyaWVzLmxlbmd0aDtcblxuICB0aGlzLmNsZWFyKCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGVudHJ5ID0gZW50cmllc1tpbmRleF07XG4gICAgdGhpcy5zZXQoZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgfVxufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgTWFwQ2FjaGVgLlxuTWFwQ2FjaGUucHJvdG90eXBlLmNsZWFyID0gbWFwQ2FjaGVDbGVhcjtcbk1hcENhY2hlLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBtYXBDYWNoZURlbGV0ZTtcbk1hcENhY2hlLnByb3RvdHlwZS5nZXQgPSBtYXBDYWNoZUdldDtcbk1hcENhY2hlLnByb3RvdHlwZS5oYXMgPSBtYXBDYWNoZUhhcztcbk1hcENhY2hlLnByb3RvdHlwZS5zZXQgPSBtYXBDYWNoZVNldDtcblxuZXhwb3J0IGRlZmF1bHQgTWFwQ2FjaGU7XG4iLCJpbXBvcnQgcm9vdCBmcm9tICcuL19yb290LmpzJztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgU3ltYm9sID0gcm9vdC5TeW1ib2w7XG5cbmV4cG9ydCBkZWZhdWx0IFN5bWJvbDtcbiIsImltcG9ydCBlcSBmcm9tICcuL2VxLmpzJztcblxuLyoqXG4gKiBHZXRzIHRoZSBpbmRleCBhdCB3aGljaCB0aGUgYGtleWAgaXMgZm91bmQgaW4gYGFycmF5YCBvZiBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHsqfSBrZXkgVGhlIGtleSB0byBzZWFyY2ggZm9yLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG1hdGNoZWQgdmFsdWUsIGVsc2UgYC0xYC5cbiAqL1xuZnVuY3Rpb24gYXNzb2NJbmRleE9mKGFycmF5LCBrZXkpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcbiAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgaWYgKGVxKGFycmF5W2xlbmd0aF1bMF0sIGtleSkpIHtcbiAgICAgIHJldHVybiBsZW5ndGg7XG4gICAgfVxuICB9XG4gIHJldHVybiAtMTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXNzb2NJbmRleE9mO1xuIiwiaW1wb3J0IFN5bWJvbCBmcm9tICcuL19TeW1ib2wuanMnO1xuaW1wb3J0IGdldFJhd1RhZyBmcm9tICcuL19nZXRSYXdUYWcuanMnO1xuaW1wb3J0IG9iamVjdFRvU3RyaW5nIGZyb20gJy4vX29iamVjdFRvU3RyaW5nLmpzJztcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIG51bGxUYWcgPSAnW29iamVjdCBOdWxsXScsXG4gICAgdW5kZWZpbmVkVGFnID0gJ1tvYmplY3QgVW5kZWZpbmVkXSc7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHN5bVRvU3RyaW5nVGFnID0gU3ltYm9sID8gU3ltYm9sLnRvU3RyaW5nVGFnIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBnZXRUYWdgIHdpdGhvdXQgZmFsbGJhY2tzIGZvciBidWdneSBlbnZpcm9ubWVudHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUdldFRhZyh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkVGFnIDogbnVsbFRhZztcbiAgfVxuICByZXR1cm4gKHN5bVRvU3RyaW5nVGFnICYmIHN5bVRvU3RyaW5nVGFnIGluIE9iamVjdCh2YWx1ZSkpXG4gICAgPyBnZXRSYXdUYWcodmFsdWUpXG4gICAgOiBvYmplY3RUb1N0cmluZyh2YWx1ZSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGJhc2VHZXRUYWc7XG4iLCJpbXBvcnQgYmFzZUdldFRhZyBmcm9tICcuL19iYXNlR2V0VGFnLmpzJztcbmltcG9ydCBpc09iamVjdExpa2UgZnJvbSAnLi9pc09iamVjdExpa2UuanMnO1xuXG52YXIgYXJyYXlCdWZmZXJUYWcgPSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzQXJyYXlCdWZmZXJgIHdpdGhvdXQgTm9kZS5qcyBvcHRpbWl6YXRpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGFycmF5IGJ1ZmZlciwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNBcnJheUJ1ZmZlcih2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBiYXNlR2V0VGFnKHZhbHVlKSA9PSBhcnJheUJ1ZmZlclRhZztcbn1cblxuZXhwb3J0IGRlZmF1bHQgYmFzZUlzQXJyYXlCdWZmZXI7XG4iLCJpbXBvcnQgaXNGdW5jdGlvbiBmcm9tICcuL2lzRnVuY3Rpb24uanMnO1xuaW1wb3J0IGlzTWFza2VkIGZyb20gJy4vX2lzTWFza2VkLmpzJztcbmltcG9ydCBpc09iamVjdCBmcm9tICcuL2lzT2JqZWN0LmpzJztcbmltcG9ydCB0b1NvdXJjZSBmcm9tICcuL190b1NvdXJjZS5qcyc7XG5cbi8qKlxuICogVXNlZCB0byBtYXRjaCBgUmVnRXhwYFxuICogW3N5bnRheCBjaGFyYWN0ZXJzXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1wYXR0ZXJucykuXG4gKi9cbnZhciByZVJlZ0V4cENoYXIgPSAvW1xcXFxeJC4qKz8oKVtcXF17fXxdL2c7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBob3N0IGNvbnN0cnVjdG9ycyAoU2FmYXJpKS4gKi9cbnZhciByZUlzSG9zdEN0b3IgPSAvXlxcW29iamVjdCAuKz9Db25zdHJ1Y3RvclxcXSQvO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgZnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlLFxuICAgIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZ1bmNUb1N0cmluZyA9IGZ1bmNQcm90by50b1N0cmluZztcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGlmIGEgbWV0aG9kIGlzIG5hdGl2ZS4gKi9cbnZhciByZUlzTmF0aXZlID0gUmVnRXhwKCdeJyArXG4gIGZ1bmNUb1N0cmluZy5jYWxsKGhhc093blByb3BlcnR5KS5yZXBsYWNlKHJlUmVnRXhwQ2hhciwgJ1xcXFwkJicpXG4gIC5yZXBsYWNlKC9oYXNPd25Qcm9wZXJ0eXwoZnVuY3Rpb24pLio/KD89XFxcXFxcKCl8IGZvciAuKz8oPz1cXFxcXFxdKS9nLCAnJDEuKj8nKSArICckJ1xuKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc05hdGl2ZWAgd2l0aG91dCBiYWQgc2hpbSBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBuYXRpdmUgZnVuY3Rpb24sXG4gKiAgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNOYXRpdmUodmFsdWUpIHtcbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkgfHwgaXNNYXNrZWQodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBwYXR0ZXJuID0gaXNGdW5jdGlvbih2YWx1ZSkgPyByZUlzTmF0aXZlIDogcmVJc0hvc3RDdG9yO1xuICByZXR1cm4gcGF0dGVybi50ZXN0KHRvU291cmNlKHZhbHVlKSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGJhc2VJc05hdGl2ZTtcbiIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udW5hcnlgIHdpdGhvdXQgc3VwcG9ydCBmb3Igc3RvcmluZyBtZXRhZGF0YS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY2FwIGFyZ3VtZW50cyBmb3IuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBjYXBwZWQgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VVbmFyeShmdW5jKSB7XG4gIHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiBmdW5jKHZhbHVlKTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYmFzZVVuYXJ5O1xuIiwiaW1wb3J0IHJvb3QgZnJvbSAnLi9fcm9vdC5qcyc7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBvdmVycmVhY2hpbmcgY29yZS1qcyBzaGltcy4gKi9cbnZhciBjb3JlSnNEYXRhID0gcm9vdFsnX19jb3JlLWpzX3NoYXJlZF9fJ107XG5cbmV4cG9ydCBkZWZhdWx0IGNvcmVKc0RhdGE7XG4iLCIvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGdsb2JhbGAgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVHbG9iYWwgPSB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbCAmJiBnbG9iYWwuT2JqZWN0ID09PSBPYmplY3QgJiYgZ2xvYmFsO1xuXG5leHBvcnQgZGVmYXVsdCBmcmVlR2xvYmFsO1xuIiwiaW1wb3J0IGlzS2V5YWJsZSBmcm9tICcuL19pc0tleWFibGUuanMnO1xuXG4vKipcbiAqIEdldHMgdGhlIGRhdGEgZm9yIGBtYXBgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gbWFwIFRoZSBtYXAgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSByZWZlcmVuY2Uga2V5LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIG1hcCBkYXRhLlxuICovXG5mdW5jdGlvbiBnZXRNYXBEYXRhKG1hcCwga2V5KSB7XG4gIHZhciBkYXRhID0gbWFwLl9fZGF0YV9fO1xuICByZXR1cm4gaXNLZXlhYmxlKGtleSlcbiAgICA/IGRhdGFbdHlwZW9mIGtleSA9PSAnc3RyaW5nJyA/ICdzdHJpbmcnIDogJ2hhc2gnXVxuICAgIDogZGF0YS5tYXA7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldE1hcERhdGE7XG4iLCJpbXBvcnQgYmFzZUlzTmF0aXZlIGZyb20gJy4vX2Jhc2VJc05hdGl2ZS5qcyc7XG5pbXBvcnQgZ2V0VmFsdWUgZnJvbSAnLi9fZ2V0VmFsdWUuanMnO1xuXG4vKipcbiAqIEdldHMgdGhlIG5hdGl2ZSBmdW5jdGlvbiBhdCBga2V5YCBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBtZXRob2QgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGZ1bmN0aW9uIGlmIGl0J3MgbmF0aXZlLCBlbHNlIGB1bmRlZmluZWRgLlxuICovXG5mdW5jdGlvbiBnZXROYXRpdmUob2JqZWN0LCBrZXkpIHtcbiAgdmFyIHZhbHVlID0gZ2V0VmFsdWUob2JqZWN0LCBrZXkpO1xuICByZXR1cm4gYmFzZUlzTmF0aXZlKHZhbHVlKSA/IHZhbHVlIDogdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZGVmYXVsdCBnZXROYXRpdmU7XG4iLCJpbXBvcnQgU3ltYm9sIGZyb20gJy4vX1N5bWJvbC5qcyc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBuYXRpdmVPYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1Ub1N0cmluZ1RhZyA9IFN5bWJvbCA/IFN5bWJvbC50b1N0cmluZ1RhZyA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VHZXRUYWdgIHdoaWNoIGlnbm9yZXMgYFN5bWJvbC50b1N0cmluZ1RhZ2AgdmFsdWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHJhdyBgdG9TdHJpbmdUYWdgLlxuICovXG5mdW5jdGlvbiBnZXRSYXdUYWcodmFsdWUpIHtcbiAgdmFyIGlzT3duID0gaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgc3ltVG9TdHJpbmdUYWcpLFxuICAgICAgdGFnID0gdmFsdWVbc3ltVG9TdHJpbmdUYWddO1xuXG4gIHRyeSB7XG4gICAgdmFsdWVbc3ltVG9TdHJpbmdUYWddID0gdW5kZWZpbmVkO1xuICAgIHZhciB1bm1hc2tlZCA9IHRydWU7XG4gIH0gY2F0Y2ggKGUpIHt9XG5cbiAgdmFyIHJlc3VsdCA9IG5hdGl2ZU9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICBpZiAodW5tYXNrZWQpIHtcbiAgICBpZiAoaXNPd24pIHtcbiAgICAgIHZhbHVlW3N5bVRvU3RyaW5nVGFnXSA9IHRhZztcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0UmF3VGFnO1xuIiwiLyoqXG4gKiBHZXRzIHRoZSB2YWx1ZSBhdCBga2V5YCBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3RdIFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBwcm9wZXJ0eSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gZ2V0VmFsdWUob2JqZWN0LCBrZXkpIHtcbiAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldFZhbHVlO1xuIiwiaW1wb3J0IG5hdGl2ZUNyZWF0ZSBmcm9tICcuL19uYXRpdmVDcmVhdGUuanMnO1xuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIGhhc2guXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgSGFzaFxuICovXG5mdW5jdGlvbiBoYXNoQ2xlYXIoKSB7XG4gIHRoaXMuX19kYXRhX18gPSBuYXRpdmVDcmVhdGUgPyBuYXRpdmVDcmVhdGUobnVsbCkgOiB7fTtcbiAgdGhpcy5zaXplID0gMDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaGFzaENsZWFyO1xuIiwiLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgaGFzaC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtPYmplY3R9IGhhc2ggVGhlIGhhc2ggdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGhhc2hEZWxldGUoa2V5KSB7XG4gIHZhciByZXN1bHQgPSB0aGlzLmhhcyhrZXkpICYmIGRlbGV0ZSB0aGlzLl9fZGF0YV9fW2tleV07XG4gIHRoaXMuc2l6ZSAtPSByZXN1bHQgPyAxIDogMDtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaGFzaERlbGV0ZTtcbiIsImltcG9ydCBuYXRpdmVDcmVhdGUgZnJvbSAnLi9fbmF0aXZlQ3JlYXRlLmpzJztcblxuLyoqIFVzZWQgdG8gc3RhbmQtaW4gZm9yIGB1bmRlZmluZWRgIGhhc2ggdmFsdWVzLiAqL1xudmFyIEhBU0hfVU5ERUZJTkVEID0gJ19fbG9kYXNoX2hhc2hfdW5kZWZpbmVkX18nO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIEdldHMgdGhlIGhhc2ggdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gaGFzaEdldChrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICBpZiAobmF0aXZlQ3JlYXRlKSB7XG4gICAgdmFyIHJlc3VsdCA9IGRhdGFba2V5XTtcbiAgICByZXR1cm4gcmVzdWx0ID09PSBIQVNIX1VOREVGSU5FRCA/IHVuZGVmaW5lZCA6IHJlc3VsdDtcbiAgfVxuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChkYXRhLCBrZXkpID8gZGF0YVtrZXldIDogdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZGVmYXVsdCBoYXNoR2V0O1xuIiwiaW1wb3J0IG5hdGl2ZUNyZWF0ZSBmcm9tICcuL19uYXRpdmVDcmVhdGUuanMnO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIENoZWNrcyBpZiBhIGhhc2ggdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGhhc2hIYXMoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgcmV0dXJuIG5hdGl2ZUNyZWF0ZSA/IChkYXRhW2tleV0gIT09IHVuZGVmaW5lZCkgOiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGRhdGEsIGtleSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGhhc2hIYXM7XG4iLCJpbXBvcnQgbmF0aXZlQ3JlYXRlIGZyb20gJy4vX25hdGl2ZUNyZWF0ZS5qcyc7XG5cbi8qKiBVc2VkIHRvIHN0YW5kLWluIGZvciBgdW5kZWZpbmVkYCBoYXNoIHZhbHVlcy4gKi9cbnZhciBIQVNIX1VOREVGSU5FRCA9ICdfX2xvZGFzaF9oYXNoX3VuZGVmaW5lZF9fJztcblxuLyoqXG4gKiBTZXRzIHRoZSBoYXNoIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgaGFzaCBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gaGFzaFNldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgdGhpcy5zaXplICs9IHRoaXMuaGFzKGtleSkgPyAwIDogMTtcbiAgZGF0YVtrZXldID0gKG5hdGl2ZUNyZWF0ZSAmJiB2YWx1ZSA9PT0gdW5kZWZpbmVkKSA/IEhBU0hfVU5ERUZJTkVEIDogdmFsdWU7XG4gIHJldHVybiB0aGlzO1xufVxuXG5leHBvcnQgZGVmYXVsdCBoYXNoU2V0O1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBzdWl0YWJsZSBmb3IgdXNlIGFzIHVuaXF1ZSBvYmplY3Qga2V5LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIHN1aXRhYmxlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzS2V5YWJsZSh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuICh0eXBlID09ICdzdHJpbmcnIHx8IHR5cGUgPT0gJ251bWJlcicgfHwgdHlwZSA9PSAnc3ltYm9sJyB8fCB0eXBlID09ICdib29sZWFuJylcbiAgICA/ICh2YWx1ZSAhPT0gJ19fcHJvdG9fXycpXG4gICAgOiAodmFsdWUgPT09IG51bGwpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpc0tleWFibGU7XG4iLCJpbXBvcnQgY29yZUpzRGF0YSBmcm9tICcuL19jb3JlSnNEYXRhLmpzJztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG1ldGhvZHMgbWFzcXVlcmFkaW5nIGFzIG5hdGl2ZS4gKi9cbnZhciBtYXNrU3JjS2V5ID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgdWlkID0gL1teLl0rJC8uZXhlYyhjb3JlSnNEYXRhICYmIGNvcmVKc0RhdGEua2V5cyAmJiBjb3JlSnNEYXRhLmtleXMuSUVfUFJPVE8gfHwgJycpO1xuICByZXR1cm4gdWlkID8gKCdTeW1ib2woc3JjKV8xLicgKyB1aWQpIDogJyc7XG59KCkpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgZnVuY2AgaGFzIGl0cyBzb3VyY2UgbWFza2VkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgZnVuY2AgaXMgbWFza2VkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzTWFza2VkKGZ1bmMpIHtcbiAgcmV0dXJuICEhbWFza1NyY0tleSAmJiAobWFza1NyY0tleSBpbiBmdW5jKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaXNNYXNrZWQ7XG4iLCIvKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIGxpc3QgY2FjaGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZUNsZWFyKCkge1xuICB0aGlzLl9fZGF0YV9fID0gW107XG4gIHRoaXMuc2l6ZSA9IDA7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGxpc3RDYWNoZUNsZWFyO1xuIiwiaW1wb3J0IGFzc29jSW5kZXhPZiBmcm9tICcuL19hc3NvY0luZGV4T2YuanMnO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgYXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3BsaWNlID0gYXJyYXlQcm90by5zcGxpY2U7XG5cbi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIGxpc3QgY2FjaGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZURlbGV0ZShrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgaW5kZXggPSBhc3NvY0luZGV4T2YoZGF0YSwga2V5KTtcblxuICBpZiAoaW5kZXggPCAwKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBsYXN0SW5kZXggPSBkYXRhLmxlbmd0aCAtIDE7XG4gIGlmIChpbmRleCA9PSBsYXN0SW5kZXgpIHtcbiAgICBkYXRhLnBvcCgpO1xuICB9IGVsc2Uge1xuICAgIHNwbGljZS5jYWxsKGRhdGEsIGluZGV4LCAxKTtcbiAgfVxuICAtLXRoaXMuc2l6ZTtcbiAgcmV0dXJuIHRydWU7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGxpc3RDYWNoZURlbGV0ZTtcbiIsImltcG9ydCBhc3NvY0luZGV4T2YgZnJvbSAnLi9fYXNzb2NJbmRleE9mLmpzJztcblxuLyoqXG4gKiBHZXRzIHRoZSBsaXN0IGNhY2hlIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlR2V0KGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIHJldHVybiBpbmRleCA8IDAgPyB1bmRlZmluZWQgOiBkYXRhW2luZGV4XVsxXTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbGlzdENhY2hlR2V0O1xuIiwiaW1wb3J0IGFzc29jSW5kZXhPZiBmcm9tICcuL19hc3NvY0luZGV4T2YuanMnO1xuXG4vKipcbiAqIENoZWNrcyBpZiBhIGxpc3QgY2FjaGUgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlSGFzKGtleSkge1xuICByZXR1cm4gYXNzb2NJbmRleE9mKHRoaXMuX19kYXRhX18sIGtleSkgPiAtMTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbGlzdENhY2hlSGFzO1xuIiwiaW1wb3J0IGFzc29jSW5kZXhPZiBmcm9tICcuL19hc3NvY0luZGV4T2YuanMnO1xuXG4vKipcbiAqIFNldHMgdGhlIGxpc3QgY2FjaGUgYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGxpc3QgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZVNldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIGluZGV4ID0gYXNzb2NJbmRleE9mKGRhdGEsIGtleSk7XG5cbiAgaWYgKGluZGV4IDwgMCkge1xuICAgICsrdGhpcy5zaXplO1xuICAgIGRhdGEucHVzaChba2V5LCB2YWx1ZV0pO1xuICB9IGVsc2Uge1xuICAgIGRhdGFbaW5kZXhdWzFdID0gdmFsdWU7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGxpc3RDYWNoZVNldDtcbiIsImltcG9ydCBIYXNoIGZyb20gJy4vX0hhc2guanMnO1xuaW1wb3J0IExpc3RDYWNoZSBmcm9tICcuL19MaXN0Q2FjaGUuanMnO1xuaW1wb3J0IE1hcCBmcm9tICcuL19NYXAuanMnO1xuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIG1hcC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUNsZWFyKCkge1xuICB0aGlzLnNpemUgPSAwO1xuICB0aGlzLl9fZGF0YV9fID0ge1xuICAgICdoYXNoJzogbmV3IEhhc2gsXG4gICAgJ21hcCc6IG5ldyAoTWFwIHx8IExpc3RDYWNoZSksXG4gICAgJ3N0cmluZyc6IG5ldyBIYXNoXG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IG1hcENhY2hlQ2xlYXI7XG4iLCJpbXBvcnQgZ2V0TWFwRGF0YSBmcm9tICcuL19nZXRNYXBEYXRhLmpzJztcblxuLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgbWFwLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlRGVsZXRlKGtleSkge1xuICB2YXIgcmVzdWx0ID0gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpWydkZWxldGUnXShrZXkpO1xuICB0aGlzLnNpemUgLT0gcmVzdWx0ID8gMSA6IDA7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IG1hcENhY2hlRGVsZXRlO1xuIiwiaW1wb3J0IGdldE1hcERhdGEgZnJvbSAnLi9fZ2V0TWFwRGF0YS5qcyc7XG5cbi8qKlxuICogR2V0cyB0aGUgbWFwIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUdldChrZXkpIHtcbiAgcmV0dXJuIGdldE1hcERhdGEodGhpcywga2V5KS5nZXQoa2V5KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbWFwQ2FjaGVHZXQ7XG4iLCJpbXBvcnQgZ2V0TWFwRGF0YSBmcm9tICcuL19nZXRNYXBEYXRhLmpzJztcblxuLyoqXG4gKiBDaGVja3MgaWYgYSBtYXAgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUhhcyhrZXkpIHtcbiAgcmV0dXJuIGdldE1hcERhdGEodGhpcywga2V5KS5oYXMoa2V5KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbWFwQ2FjaGVIYXM7XG4iLCJpbXBvcnQgZ2V0TWFwRGF0YSBmcm9tICcuL19nZXRNYXBEYXRhLmpzJztcblxuLyoqXG4gKiBTZXRzIHRoZSBtYXAgYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbWFwIGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZVNldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpLFxuICAgICAgc2l6ZSA9IGRhdGEuc2l6ZTtcblxuICBkYXRhLnNldChrZXksIHZhbHVlKTtcbiAgdGhpcy5zaXplICs9IGRhdGEuc2l6ZSA9PSBzaXplID8gMCA6IDE7XG4gIHJldHVybiB0aGlzO1xufVxuXG5leHBvcnQgZGVmYXVsdCBtYXBDYWNoZVNldDtcbiIsImltcG9ydCBnZXROYXRpdmUgZnJvbSAnLi9fZ2V0TmF0aXZlLmpzJztcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIG5hdGl2ZUNyZWF0ZSA9IGdldE5hdGl2ZShPYmplY3QsICdjcmVhdGUnKTtcblxuZXhwb3J0IGRlZmF1bHQgbmF0aXZlQ3JlYXRlO1xuIiwiaW1wb3J0IGZyZWVHbG9iYWwgZnJvbSAnLi9fZnJlZUdsb2JhbC5qcyc7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZXhwb3J0c2AuICovXG52YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzICYmICFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYC4gKi9cbnZhciBmcmVlTW9kdWxlID0gZnJlZUV4cG9ydHMgJiYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSAmJiBtb2R1bGU7XG5cbi8qKiBEZXRlY3QgdGhlIHBvcHVsYXIgQ29tbW9uSlMgZXh0ZW5zaW9uIGBtb2R1bGUuZXhwb3J0c2AuICovXG52YXIgbW9kdWxlRXhwb3J0cyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5leHBvcnRzID09PSBmcmVlRXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBwcm9jZXNzYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZVByb2Nlc3MgPSBtb2R1bGVFeHBvcnRzICYmIGZyZWVHbG9iYWwucHJvY2VzcztcblxuLyoqIFVzZWQgdG8gYWNjZXNzIGZhc3RlciBOb2RlLmpzIGhlbHBlcnMuICovXG52YXIgbm9kZVV0aWwgPSAoZnVuY3Rpb24oKSB7XG4gIHRyeSB7XG4gICAgLy8gVXNlIGB1dGlsLnR5cGVzYCBmb3IgTm9kZS5qcyAxMCsuXG4gICAgdmFyIHR5cGVzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLnJlcXVpcmUgJiYgZnJlZU1vZHVsZS5yZXF1aXJlKCd1dGlsJykudHlwZXM7XG5cbiAgICBpZiAodHlwZXMpIHtcbiAgICAgIHJldHVybiB0eXBlcztcbiAgICB9XG5cbiAgICAvLyBMZWdhY3kgYHByb2Nlc3MuYmluZGluZygndXRpbCcpYCBmb3IgTm9kZS5qcyA8IDEwLlxuICAgIHJldHVybiBmcmVlUHJvY2VzcyAmJiBmcmVlUHJvY2Vzcy5iaW5kaW5nICYmIGZyZWVQcm9jZXNzLmJpbmRpbmcoJ3V0aWwnKTtcbiAgfSBjYXRjaCAoZSkge31cbn0oKSk7XG5cbmV4cG9ydCBkZWZhdWx0IG5vZGVVdGlsO1xuIiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG5hdGl2ZU9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZyB1c2luZyBgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gbmF0aXZlT2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IG9iamVjdFRvU3RyaW5nO1xuIiwiaW1wb3J0IGZyZWVHbG9iYWwgZnJvbSAnLi9fZnJlZUdsb2JhbC5qcyc7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgc2VsZmAuICovXG52YXIgZnJlZVNlbGYgPSB0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmICYmIHNlbGYuT2JqZWN0ID09PSBPYmplY3QgJiYgc2VsZjtcblxuLyoqIFVzZWQgYXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QuICovXG52YXIgcm9vdCA9IGZyZWVHbG9iYWwgfHwgZnJlZVNlbGYgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblxuZXhwb3J0IGRlZmF1bHQgcm9vdDtcbiIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBmdW5jUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGRlY29tcGlsZWQgc291cmNlIG9mIGZ1bmN0aW9ucy4gKi9cbnZhciBmdW5jVG9TdHJpbmcgPSBmdW5jUHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ29udmVydHMgYGZ1bmNgIHRvIGl0cyBzb3VyY2UgY29kZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHNvdXJjZSBjb2RlLlxuICovXG5mdW5jdGlvbiB0b1NvdXJjZShmdW5jKSB7XG4gIGlmIChmdW5jICE9IG51bGwpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGZ1bmNUb1N0cmluZy5jYWxsKGZ1bmMpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiAoZnVuYyArICcnKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICB9XG4gIHJldHVybiAnJztcbn1cblxuZXhwb3J0IGRlZmF1bHQgdG9Tb3VyY2U7XG4iLCIvKipcbiAqIFBlcmZvcm1zIGFcbiAqIFtgU2FtZVZhbHVlWmVyb2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXNhbWV2YWx1ZXplcm8pXG4gKiBjb21wYXJpc29uIGJldHdlZW4gdHdvIHZhbHVlcyB0byBkZXRlcm1pbmUgaWYgdGhleSBhcmUgZXF1aXZhbGVudC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7Kn0gb3RoZXIgVGhlIG90aGVyIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHZhbHVlcyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IDEgfTtcbiAqIHZhciBvdGhlciA9IHsgJ2EnOiAxIH07XG4gKlxuICogXy5lcShvYmplY3QsIG9iamVjdCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5lcShvYmplY3QsIG90aGVyKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5lcSgnYScsICdhJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5lcSgnYScsIE9iamVjdCgnYScpKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5lcShOYU4sIE5hTik7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGVxKHZhbHVlLCBvdGhlcikge1xuICByZXR1cm4gdmFsdWUgPT09IG90aGVyIHx8ICh2YWx1ZSAhPT0gdmFsdWUgJiYgb3RoZXIgIT09IG90aGVyKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZXE7XG4iLCJpbXBvcnQgYmFzZUlzQXJyYXlCdWZmZXIgZnJvbSAnLi9fYmFzZUlzQXJyYXlCdWZmZXIuanMnO1xuaW1wb3J0IGJhc2VVbmFyeSBmcm9tICcuL19iYXNlVW5hcnkuanMnO1xuaW1wb3J0IG5vZGVVdGlsIGZyb20gJy4vX25vZGVVdGlsLmpzJztcblxuLyogTm9kZS5qcyBoZWxwZXIgcmVmZXJlbmNlcy4gKi9cbnZhciBub2RlSXNBcnJheUJ1ZmZlciA9IG5vZGVVdGlsICYmIG5vZGVVdGlsLmlzQXJyYXlCdWZmZXI7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhbiBgQXJyYXlCdWZmZXJgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMy4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBhcnJheSBidWZmZXIsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5QnVmZmVyKG5ldyBBcnJheUJ1ZmZlcigyKSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5QnVmZmVyKG5ldyBBcnJheSgyKSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNBcnJheUJ1ZmZlciA9IG5vZGVJc0FycmF5QnVmZmVyID8gYmFzZVVuYXJ5KG5vZGVJc0FycmF5QnVmZmVyKSA6IGJhc2VJc0FycmF5QnVmZmVyO1xuXG5leHBvcnQgZGVmYXVsdCBpc0FycmF5QnVmZmVyO1xuIiwiaW1wb3J0IGJhc2VHZXRUYWcgZnJvbSAnLi9fYmFzZUdldFRhZy5qcyc7XG5pbXBvcnQgaXNPYmplY3QgZnJvbSAnLi9pc09iamVjdC5qcyc7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhc3luY1RhZyA9ICdbb2JqZWN0IEFzeW5jRnVuY3Rpb25dJyxcbiAgICBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJyxcbiAgICBnZW5UYWcgPSAnW29iamVjdCBHZW5lcmF0b3JGdW5jdGlvbl0nLFxuICAgIHByb3h5VGFnID0gJ1tvYmplY3QgUHJveHldJztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYEZ1bmN0aW9uYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBmdW5jdGlvbiwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oXyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0Z1bmN0aW9uKC9hYmMvKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy8gVGhlIHVzZSBvZiBgT2JqZWN0I3RvU3RyaW5nYCBhdm9pZHMgaXNzdWVzIHdpdGggdGhlIGB0eXBlb2ZgIG9wZXJhdG9yXG4gIC8vIGluIFNhZmFyaSA5IHdoaWNoIHJldHVybnMgJ29iamVjdCcgZm9yIHR5cGVkIGFycmF5cyBhbmQgb3RoZXIgY29uc3RydWN0b3JzLlxuICB2YXIgdGFnID0gYmFzZUdldFRhZyh2YWx1ZSk7XG4gIHJldHVybiB0YWcgPT0gZnVuY1RhZyB8fCB0YWcgPT0gZ2VuVGFnIHx8IHRhZyA9PSBhc3luY1RhZyB8fCB0YWcgPT0gcHJveHlUYWc7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGlzRnVuY3Rpb247XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZVxuICogW2xhbmd1YWdlIHR5cGVdKGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1lY21hc2NyaXB0LWxhbmd1YWdlLXR5cGVzKVxuICogb2YgYE9iamVjdGAuIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChfLm5vb3ApO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaXNPYmplY3Q7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLiBBIHZhbHVlIGlzIG9iamVjdC1saWtlIGlmIGl0J3Mgbm90IGBudWxsYFxuICogYW5kIGhhcyBhIGB0eXBlb2ZgIHJlc3VsdCBvZiBcIm9iamVjdFwiLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxuZXhwb3J0IGRlZmF1bHQgaXNPYmplY3RMaWtlO1xuIiwiaW1wb3J0IE1hcENhY2hlIGZyb20gJy4vX01hcENhY2hlLmpzJztcblxuLyoqIEVycm9yIG1lc3NhZ2UgY29uc3RhbnRzLiAqL1xudmFyIEZVTkNfRVJST1JfVEVYVCA9ICdFeHBlY3RlZCBhIGZ1bmN0aW9uJztcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBtZW1vaXplcyB0aGUgcmVzdWx0IG9mIGBmdW5jYC4gSWYgYHJlc29sdmVyYCBpc1xuICogcHJvdmlkZWQsIGl0IGRldGVybWluZXMgdGhlIGNhY2hlIGtleSBmb3Igc3RvcmluZyB0aGUgcmVzdWx0IGJhc2VkIG9uIHRoZVxuICogYXJndW1lbnRzIHByb3ZpZGVkIHRvIHRoZSBtZW1vaXplZCBmdW5jdGlvbi4gQnkgZGVmYXVsdCwgdGhlIGZpcnN0IGFyZ3VtZW50XG4gKiBwcm92aWRlZCB0byB0aGUgbWVtb2l6ZWQgZnVuY3Rpb24gaXMgdXNlZCBhcyB0aGUgbWFwIGNhY2hlIGtleS4gVGhlIGBmdW5jYFxuICogaXMgaW52b2tlZCB3aXRoIHRoZSBgdGhpc2AgYmluZGluZyBvZiB0aGUgbWVtb2l6ZWQgZnVuY3Rpb24uXG4gKlxuICogKipOb3RlOioqIFRoZSBjYWNoZSBpcyBleHBvc2VkIGFzIHRoZSBgY2FjaGVgIHByb3BlcnR5IG9uIHRoZSBtZW1vaXplZFxuICogZnVuY3Rpb24uIEl0cyBjcmVhdGlvbiBtYXkgYmUgY3VzdG9taXplZCBieSByZXBsYWNpbmcgdGhlIGBfLm1lbW9pemUuQ2FjaGVgXG4gKiBjb25zdHJ1Y3RvciB3aXRoIG9uZSB3aG9zZSBpbnN0YW5jZXMgaW1wbGVtZW50IHRoZVxuICogW2BNYXBgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1wcm9wZXJ0aWVzLW9mLXRoZS1tYXAtcHJvdG90eXBlLW9iamVjdClcbiAqIG1ldGhvZCBpbnRlcmZhY2Ugb2YgYGNsZWFyYCwgYGRlbGV0ZWAsIGBnZXRgLCBgaGFzYCwgYW5kIGBzZXRgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gaGF2ZSBpdHMgb3V0cHV0IG1lbW9pemVkLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW3Jlc29sdmVyXSBUaGUgZnVuY3Rpb24gdG8gcmVzb2x2ZSB0aGUgY2FjaGUga2V5LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgbWVtb2l6ZWQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSwgJ2InOiAyIH07XG4gKiB2YXIgb3RoZXIgPSB7ICdjJzogMywgJ2QnOiA0IH07XG4gKlxuICogdmFyIHZhbHVlcyA9IF8ubWVtb2l6ZShfLnZhbHVlcyk7XG4gKiB2YWx1ZXMob2JqZWN0KTtcbiAqIC8vID0+IFsxLCAyXVxuICpcbiAqIHZhbHVlcyhvdGhlcik7XG4gKiAvLyA9PiBbMywgNF1cbiAqXG4gKiBvYmplY3QuYSA9IDI7XG4gKiB2YWx1ZXMob2JqZWN0KTtcbiAqIC8vID0+IFsxLCAyXVxuICpcbiAqIC8vIE1vZGlmeSB0aGUgcmVzdWx0IGNhY2hlLlxuICogdmFsdWVzLmNhY2hlLnNldChvYmplY3QsIFsnYScsICdiJ10pO1xuICogdmFsdWVzKG9iamVjdCk7XG4gKiAvLyA9PiBbJ2EnLCAnYiddXG4gKlxuICogLy8gUmVwbGFjZSBgXy5tZW1vaXplLkNhY2hlYC5cbiAqIF8ubWVtb2l6ZS5DYWNoZSA9IFdlYWtNYXA7XG4gKi9cbmZ1bmN0aW9uIG1lbW9pemUoZnVuYywgcmVzb2x2ZXIpIHtcbiAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicgfHwgKHJlc29sdmVyICE9IG51bGwgJiYgdHlwZW9mIHJlc29sdmVyICE9ICdmdW5jdGlvbicpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGVU5DX0VSUk9SX1RFWFQpO1xuICB9XG4gIHZhciBtZW1vaXplZCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzLFxuICAgICAgICBrZXkgPSByZXNvbHZlciA/IHJlc29sdmVyLmFwcGx5KHRoaXMsIGFyZ3MpIDogYXJnc1swXSxcbiAgICAgICAgY2FjaGUgPSBtZW1vaXplZC5jYWNoZTtcblxuICAgIGlmIChjYWNoZS5oYXMoa2V5KSkge1xuICAgICAgcmV0dXJuIGNhY2hlLmdldChrZXkpO1xuICAgIH1cbiAgICB2YXIgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICBtZW1vaXplZC5jYWNoZSA9IGNhY2hlLnNldChrZXksIHJlc3VsdCkgfHwgY2FjaGU7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbiAgbWVtb2l6ZWQuY2FjaGUgPSBuZXcgKG1lbW9pemUuQ2FjaGUgfHwgTWFwQ2FjaGUpO1xuICByZXR1cm4gbWVtb2l6ZWQ7XG59XG5cbi8vIEV4cG9zZSBgTWFwQ2FjaGVgLlxubWVtb2l6ZS5DYWNoZSA9IE1hcENhY2hlO1xuXG5leHBvcnQgZGVmYXVsdCBtZW1vaXplO1xuIiwiaW1wb3J0IHtcblx0SEFMRl9GTE9BVCwgRkxPQVQsIFVOU0lHTkVEX0JZVEUsIEJZVEUsIFVOU0lHTkVEX1NIT1JULCBTSE9SVCwgVU5TSUdORURfSU5ULCBJTlQsXG5cdExJTkVBUiwgTkVBUkVTVCxcblx0UkVQRUFULCBDTEFNUF9UT19FREdFLCBSR0IsIFJHQkEsXG59IGZyb20gJy4vQ29uc3RhbnRzJztcblxuZXhwb3J0IGNvbnN0IHZhbGlkRGF0YVR5cGVzID0gW0hBTEZfRkxPQVQsIEZMT0FULCBVTlNJR05FRF9CWVRFLCBCWVRFLCBVTlNJR05FRF9TSE9SVCwgU0hPUlQsIFVOU0lHTkVEX0lOVCwgSU5UXTtcbmV4cG9ydCBmdW5jdGlvbiBpc1ZhbGlkRGF0YVR5cGUodHlwZTogc3RyaW5nKSB7XG5cdHJldHVybiB2YWxpZERhdGFUeXBlcy5pbmRleE9mKHR5cGUpID4gLTE7XG59XG5cbmV4cG9ydCBjb25zdCB2YWxpZEZpbHRlclR5cGVzID0gW0xJTkVBUiwgTkVBUkVTVF07XG5leHBvcnQgZnVuY3Rpb24gaXNWYWxpZEZpbHRlclR5cGUodHlwZTogc3RyaW5nKSB7XG5cdHJldHVybiB2YWxpZEZpbHRlclR5cGVzLmluZGV4T2YodHlwZSkgPiAtMTtcbn1cblxuZXhwb3J0IGNvbnN0IHZhbGlkV3JhcFR5cGVzID0gW0NMQU1QX1RPX0VER0UsIFJFUEVBVF07IC8vIE1JUlJPUkVEX1JFUEVBVFxuZXhwb3J0IGZ1bmN0aW9uIGlzVmFsaWRXcmFwVHlwZSh0eXBlOiBzdHJpbmcpIHtcblx0cmV0dXJuIHZhbGlkV3JhcFR5cGVzLmluZGV4T2YodHlwZSkgPiAtMTtcbn1cblxuZXhwb3J0IGNvbnN0IHZhbGlkVGV4dHVyZUZvcm1hdFR5cGVzID0gW1JHQiwgUkdCQV07XG5leHBvcnQgZnVuY3Rpb24gaXNWYWxpZFRleHR1cmVGb3JtYXRUeXBlKHR5cGU6IHN0cmluZykge1xuXHRyZXR1cm4gdmFsaWRUZXh0dXJlRm9ybWF0VHlwZXMuaW5kZXhPZih0eXBlKSA+IC0xO1xufVxuXG5leHBvcnQgY29uc3QgdmFsaWRUZXh0dXJlRGF0YVR5cGVzID0gW1VOU0lHTkVEX0JZVEVdO1xuZXhwb3J0IGZ1bmN0aW9uIGlzVmFsaWRUZXh0dXJlRGF0YVR5cGUodHlwZTogc3RyaW5nKSB7XG5cdHJldHVybiB2YWxpZFRleHR1cmVEYXRhVHlwZXMuaW5kZXhPZih0eXBlKSA+IC0xO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNOdW1iZXIodmFsdWU6IGFueSkge1xuXHRyZXR1cm4gIWlzTmFOKHZhbHVlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzSW50ZWdlcih2YWx1ZTogYW55KSB7XG5cdHJldHVybiBpc051bWJlcih2YWx1ZSkgJiYgKHZhbHVlICUgMSA9PT0gMCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1Bvc2l0aXZlSW50ZWdlcih2YWx1ZTogYW55KSB7XG5cdHJldHVybiBpc0ludGVnZXIodmFsdWUpICYmICB2YWx1ZSA+IDA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1N0cmluZyh2YWx1ZTogYW55KXtcblx0cmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZyc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0FycmF5KHZhbHVlOiBhbnkpIHtcblx0cmV0dXJuIEFycmF5LmlzQXJyYXkodmFsdWUpO1xufSIsImV4cG9ydCBjb25zdCBIQUxGX0ZMT0FUID0gJ0hBTEZfRkxPQVQnO1xuZXhwb3J0IGNvbnN0IEZMT0FUID0gJ0ZMT0FUJztcbmV4cG9ydCBjb25zdCBVTlNJR05FRF9CWVRFID0gJ1VOU0lHTkVEX0JZVEUnO1xuZXhwb3J0IGNvbnN0IEJZVEUgPSAnQllURSc7XG5leHBvcnQgY29uc3QgVU5TSUdORURfU0hPUlQgPSAnVU5TSUdORURfU0hPUlQnO1xuZXhwb3J0IGNvbnN0IFNIT1JUID0gJ1NIT1JUJztcbmV4cG9ydCBjb25zdCBVTlNJR05FRF9JTlQgPSAnVU5TSUdORURfSU5UJztcbmV4cG9ydCBjb25zdCBJTlQgPSAnSU5UJztcblxuZXhwb3J0IGNvbnN0IExJTkVBUiA9ICdMSU5FQVInO1xuZXhwb3J0IGNvbnN0IE5FQVJFU1QgPSAnTkVBUkVTVCc7XG5cbmV4cG9ydCBjb25zdCBSRVBFQVQgPSAnUkVQRUFUJztcbmV4cG9ydCBjb25zdCBDTEFNUF9UT19FREdFID0gJ0NMQU1QX1RPX0VER0UnO1xuLy8gZXhwb3J0IGNvbnN0IE1JUlJPUkVEX1JFUEVBVCA9ICdNSVJST1JFRF9SRVBFQVQnO1xuXG5leHBvcnQgY29uc3QgUkdCID0gJ1JHQic7XG5leHBvcnQgY29uc3QgUkdCQSA9ICdSR0JBJztcblxuZXhwb3J0IHR5cGUgRGF0YUxheWVyQXJyYXlUeXBlID0gIEZsb2F0MzJBcnJheSB8IFVpbnQ4QXJyYXkgfCBJbnQ4QXJyYXkgfCBVaW50MTZBcnJheSB8IEludDE2QXJyYXkgfCBVaW50MzJBcnJheSB8IEludDMyQXJyYXk7XG5leHBvcnQgdHlwZSBEYXRhTGF5ZXJUeXBlID0gdHlwZW9mIEhBTEZfRkxPQVQgfCB0eXBlb2YgRkxPQVQgfCB0eXBlb2YgVU5TSUdORURfQllURSB8IHR5cGVvZiBCWVRFIHwgdHlwZW9mIFVOU0lHTkVEX1NIT1JUIHwgdHlwZW9mIFNIT1JUIHwgdHlwZW9mIFVOU0lHTkVEX0lOVCB8IHR5cGVvZiBJTlQ7XG5leHBvcnQgdHlwZSBEYXRhTGF5ZXJOdW1Db21wb25lbnRzID0gMSB8IDIgfCAzIHwgNDtcbmV4cG9ydCB0eXBlIERhdGFMYXllckZpbHRlclR5cGUgPSB0eXBlb2YgTElORUFSIHwgdHlwZW9mIE5FQVJFU1Q7XG5leHBvcnQgdHlwZSBEYXRhTGF5ZXJXcmFwVHlwZSA9IHR5cGVvZiBSRVBFQVQgfCB0eXBlb2YgQ0xBTVBfVE9fRURHRTsvLyB8IHR5cGVvZiBNSVJST1JFRF9SRVBFQVQ7XG5cbmV4cG9ydCB0eXBlIFRleHR1cmVGb3JtYXRUeXBlID0gdHlwZW9mIFJHQiB8IHR5cGVvZiBSR0JBO1xuZXhwb3J0IHR5cGUgVGV4dHVyZURhdGFUeXBlID0gdHlwZW9mIFVOU0lHTkVEX0JZVEU7XG5cbmV4cG9ydCBjb25zdCBHTFNMMyA9ICczMDAgZXMnO1xuZXhwb3J0IGNvbnN0IEdMU0wxID0gJzEwMCc7XG5leHBvcnQgdHlwZSBHTFNMVmVyc2lvbiA9IHR5cGVvZiBHTFNMMSB8IHR5cGVvZiBHTFNMMztcblxuLy8gVW5pZm9ybSB0eXBlcy5cbmV4cG9ydCBjb25zdCBGTE9BVF8xRF9VTklGT1JNID0gJzFmJztcbmV4cG9ydCBjb25zdCBGTE9BVF8yRF9VTklGT1JNID0gJzJmJztcbmV4cG9ydCBjb25zdCBGTE9BVF8zRF9VTklGT1JNID0gJzNmJztcbmV4cG9ydCBjb25zdCBGTE9BVF80RF9VTklGT1JNID0gJzNmJztcbmV4cG9ydCBjb25zdCBJTlRfMURfVU5JRk9STSA9ICcxaSc7XG5leHBvcnQgY29uc3QgSU5UXzJEX1VOSUZPUk0gPSAnMmknO1xuZXhwb3J0IGNvbnN0IElOVF8zRF9VTklGT1JNID0gJzNpJztcbmV4cG9ydCBjb25zdCBJTlRfNERfVU5JRk9STSA9ICczaSc7XG5cbmV4cG9ydCB0eXBlIFVuaWZvcm1EYXRhVHlwZSA9IHR5cGVvZiBGTE9BVCB8IHR5cGVvZiBJTlQ7XG5leHBvcnQgdHlwZSBVbmlmb3JtVmFsdWVUeXBlID0gXG5cdG51bWJlciB8XG5cdFtudW1iZXJdIHxcblx0W251bWJlciwgbnVtYmVyXSB8XG5cdFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSB8XG5cdFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdO1xuZXhwb3J0IHR5cGUgVW5pZm9ybVR5cGUgPSBcblx0dHlwZW9mIEZMT0FUXzFEX1VOSUZPUk0gfFxuXHR0eXBlb2YgRkxPQVRfMkRfVU5JRk9STSB8XG5cdHR5cGVvZiBGTE9BVF8zRF9VTklGT1JNIHxcblx0dHlwZW9mIEZMT0FUXzREX1VOSUZPUk0gfFxuXHR0eXBlb2YgSU5UXzFEX1VOSUZPUk0gfFxuXHR0eXBlb2YgSU5UXzJEX1VOSUZPUk0gfFxuXHR0eXBlb2YgSU5UXzNEX1VOSUZPUk0gfFxuXHR0eXBlb2YgSU5UXzREX1VOSUZPUk07XG5leHBvcnQgdHlwZSBVbmlmb3JtID0geyBcblx0bG9jYXRpb246IHsgW2tleTogc3RyaW5nXTogV2ViR0xVbmlmb3JtTG9jYXRpb24gfSxcblx0dHlwZTogVW5pZm9ybVR5cGUsXG5cdHZhbHVlOiBVbmlmb3JtVmFsdWVUeXBlLFxufTtcblxuIiwiaW1wb3J0IHsgc2V0RmxvYXQxNiB9IGZyb20gJ0BwZXRhbW9yaWtlbi9mbG9hdDE2JztcbmltcG9ydCB7IGlzUG9zaXRpdmVJbnRlZ2VyLCBpc1ZhbGlkRGF0YVR5cGUsIGlzVmFsaWRGaWx0ZXJUeXBlLCBpc1ZhbGlkV3JhcFR5cGUsIHZhbGlkRGF0YVR5cGVzLCB2YWxpZEZpbHRlclR5cGVzLCB2YWxpZFdyYXBUeXBlcyB9IGZyb20gJy4vQ2hlY2tzJztcbmltcG9ydCB7XG5cdEhBTEZfRkxPQVQsIEZMT0FULCBVTlNJR05FRF9CWVRFLCBCWVRFLCBVTlNJR05FRF9TSE9SVCwgU0hPUlQsIFVOU0lHTkVEX0lOVCwgSU5ULFxuXHRORUFSRVNULCBMSU5FQVIsIENMQU1QX1RPX0VER0UsXG5cdERhdGFMYXllckFycmF5VHlwZSwgRGF0YUxheWVyRmlsdGVyVHlwZSwgRGF0YUxheWVyTnVtQ29tcG9uZW50cywgRGF0YUxheWVyVHlwZSwgRGF0YUxheWVyV3JhcFR5cGUsIEdMU0xWZXJzaW9uLCBHTFNMMywgR0xTTDEsXG4gfSBmcm9tICcuL0NvbnN0YW50cyc7XG5pbXBvcnQge1xuXHRnZXRFeHRlbnNpb24sXG5cdEVYVF9DT0xPUl9CVUZGRVJfRkxPQVQsXG5cdE9FU19URVhUVVJFX0ZMT0FULFxuXHRPRVNfVEVYVFVSRV9GTE9BVF9MSU5FQVIsXG5cdE9FU19URVhUVVJFX0hBTEZfRkxPQVQsXG5cdE9FU19URVhUVVJFX0hBbEZfRkxPQVRfTElORUFSLFxufSBmcm9tICcuL2V4dGVuc2lvbnMnO1xuaW1wb3J0IHsgaXNXZWJHTDIgfSBmcm9tICcuL3V0aWxzJztcblxuZXhwb3J0IHR5cGUgRGF0YUxheWVyQnVmZmVyID0ge1xuXHR0ZXh0dXJlOiBXZWJHTFRleHR1cmUsXG5cdGZyYW1lYnVmZmVyPzogV2ViR0xGcmFtZWJ1ZmZlcixcbn1cblxudHlwZSBFcnJvckNhbGxiYWNrID0gKG1lc3NhZ2U6IHN0cmluZykgPT4gdm9pZDtcblxuZXhwb3J0IGNsYXNzIERhdGFMYXllciB7XG5cdHJlYWRvbmx5IG5hbWU6IHN0cmluZztcblx0cHJpdmF0ZSByZWFkb25seSBnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0IHwgV2ViR0wyUmVuZGVyaW5nQ29udGV4dDtcblx0cHJpdmF0ZSByZWFkb25seSBlcnJvckNhbGxiYWNrOiBFcnJvckNhbGxiYWNrO1xuXG5cdC8vIEVhY2ggRGF0YUxheWVyIG1heSBjb250YWluIGEgbnVtYmVyIG9mIGJ1ZmZlcnMgdG8gc3RvcmUgZGlmZmVyZW50IGluc3RhbmNlcyBvZiB0aGUgc3RhdGUuXG5cdHByaXZhdGUgX2J1ZmZlckluZGV4ID0gMDtcblx0cmVhZG9ubHkgbnVtQnVmZmVycztcblx0cHJpdmF0ZSByZWFkb25seSBidWZmZXJzOiBEYXRhTGF5ZXJCdWZmZXJbXSA9IFtdO1xuXG5cdC8vIFRleHR1cmUgc2l6ZXMuXG5cdHByaXZhdGUgbGVuZ3RoPzogbnVtYmVyOyAvLyBUaGlzIGlzIG9ubHkgdXNlZCBmb3IgMUQgZGF0YSBsYXllcnMuXG5cdHByaXZhdGUgd2lkdGg6IG51bWJlcjtcblx0cHJpdmF0ZSBoZWlnaHQ6IG51bWJlcjtcblxuXHQvLyBEYXRhTGF5ZXIgc2V0dGluZ3MuXG5cdHJlYWRvbmx5IHR5cGU6IERhdGFMYXllclR5cGU7IC8vIElucHV0IHR5cGUgcGFzc2VkIGluIGR1cmluZyBzZXR1cC5cblx0cmVhZG9ubHkgaW50ZXJuYWxUeXBlOiBEYXRhTGF5ZXJUeXBlOyAvLyBUeXBlIHRoYXQgY29ycmVzcG9uZHMgdG8gZ2xUeXBlLCBtYXkgYmUgZGlmZmVyZW50IGZyb20gdHlwZS5cblx0cmVhZG9ubHkgd3JhcFM6IERhdGFMYXllcldyYXBUeXBlOyAvLyBJbnB1dCB3cmFwIHR5cGUgcGFzc2VkIGluIGR1cmluZyBzZXR1cC5cblx0cmVhZG9ubHkgd3JhcFQ6IERhdGFMYXllcldyYXBUeXBlOyAvLyBJbnB1dCB3cmFwIHR5cGUgcGFzc2VkIGluIGR1cmluZyBzZXR1cC5cblx0cmVhZG9ubHkgaW50ZXJuYWxXcmFwUzogRGF0YUxheWVyV3JhcFR5cGU7IC8vIFdyYXAgdHlwZSB0aGF0IGNvcnJlc3BvbmRzIHRvIGdsV3JhcFMsIG1heSBiZSBkaWZmZXJlbnQgZnJvbSB3cmFwUy5cblx0cmVhZG9ubHkgaW50ZXJuYWxXcmFwVDogRGF0YUxheWVyV3JhcFR5cGU7IC8vIFdyYXAgdHlwZSB0aGF0IGNvcnJlc3BvbmRzIHRvIGdsV3JhcFQsIG1heSBiZSBkaWZmZXJlbnQgZnJvbSB3cmFwVC5cblx0cmVhZG9ubHkgbnVtQ29tcG9uZW50czogRGF0YUxheWVyTnVtQ29tcG9uZW50czsgLy8gTnVtYmVyIG9mIFJHQkEgY2hhbm5lbHMgdG8gdXNlIGZvciB0aGlzIERhdGFMYXllci5cblx0cmVhZG9ubHkgZmlsdGVyOiBEYXRhTGF5ZXJGaWx0ZXJUeXBlOyAvLyBJbnRlcnBvbGF0aW9uIGZpbHRlciB0eXBlIG9mIGRhdGEuXG5cdHJlYWRvbmx5IGludGVybmFsRmlsdGVyOiBEYXRhTGF5ZXJGaWx0ZXJUeXBlOyAvLyBGaWx0ZXIgdHlwZSB0aGF0IGNvcnJlc3BvbmRzIHRvIGdsRmlsdGVyLCBtYXkgYmUgZGlmZmVyZW50IGZyb20gZmlsdGVyLlxuXHRyZWFkb25seSB3cml0YWJsZTogYm9vbGVhbjtcblxuXHQvLyBPcHRpbWl6YXRpb25zIHNvIHRoYXQgXCJjb3B5aW5nXCIgY2FuIGhhcHBlbiB3aXRob3V0IGRyYXcgY2FsbHMuXG5cdHByaXZhdGUgdGV4dHVyZU92ZXJyaWRlcz86IChXZWJHTFRleHR1cmUgfCB1bmRlZmluZWQpW107XG5cblx0Ly8gR0wgdmFyaWFibGVzICh0aGVzZSBtYXkgYmUgZGlmZmVyZW50IGZyb20gdGhlaXIgY29ycmVzcG9uZGluZyBub24tZ2wgcGFyYW1ldGVycykuXG5cdHJlYWRvbmx5IGdsSW50ZXJuYWxGb3JtYXQ6IG51bWJlcjtcblx0cmVhZG9ubHkgZ2xGb3JtYXQ6IG51bWJlcjtcblx0cmVhZG9ubHkgZ2xUeXBlOiBudW1iZXI7XG5cdHJlYWRvbmx5IGdsTnVtQ2hhbm5lbHM6IG51bWJlcjtcblx0cmVhZG9ubHkgZ2xXcmFwUzogbnVtYmVyO1xuXHRyZWFkb25seSBnbFdyYXBUOiBudW1iZXI7XG5cdHJlYWRvbmx5IGdsRmlsdGVyOiBudW1iZXI7XG5cblx0Y29uc3RydWN0b3IoXG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0IHwgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCxcblx0XHRcdG5hbWU6IHN0cmluZyxcblx0XHRcdGRpbWVuc2lvbnM6IG51bWJlciB8IFtudW1iZXIsIG51bWJlcl0sXG5cdFx0XHR0eXBlOiBEYXRhTGF5ZXJUeXBlLFxuXHRcdFx0bnVtQ29tcG9uZW50czogRGF0YUxheWVyTnVtQ29tcG9uZW50cyxcblx0XHRcdGdsc2xWZXJzaW9uOiBHTFNMVmVyc2lvbixcblx0XHRcdGRhdGE/OiBEYXRhTGF5ZXJBcnJheVR5cGUsXG5cdFx0XHRmaWx0ZXI/OiBEYXRhTGF5ZXJGaWx0ZXJUeXBlLFxuXHRcdFx0d3JhcFM/OiBEYXRhTGF5ZXJXcmFwVHlwZSxcblx0XHRcdHdyYXBUPzogRGF0YUxheWVyV3JhcFR5cGUsXG5cdFx0XHR3cml0YWJsZT86IGJvb2xlYW4sXG5cdFx0XHRudW1CdWZmZXJzPzogbnVtYmVyLFxuXHRcdFx0ZXJyb3JDYWxsYmFjazogRXJyb3JDYWxsYmFjayxcblx0XHR9LFxuXHQpIHtcblx0XHRjb25zdCB7IGdsLCBlcnJvckNhbGxiYWNrLCBuYW1lLCBkaW1lbnNpb25zLCB0eXBlLCBudW1Db21wb25lbnRzLCBkYXRhLCBnbHNsVmVyc2lvbiB9ID0gcGFyYW1zO1xuXG5cdFx0Ly8gU2F2ZSBwYXJhbXMuXG5cdFx0dGhpcy5uYW1lID0gbmFtZTtcblx0XHR0aGlzLmdsID0gZ2w7XG5cdFx0dGhpcy5lcnJvckNhbGxiYWNrID0gZXJyb3JDYWxsYmFjaztcblxuXHRcdC8vIG51bUNvbXBvbmVudHMgbXVzdCBiZSBiZXR3ZWVuIDEgYW5kIDQuXG5cdFx0aWYgKCFpc1Bvc2l0aXZlSW50ZWdlcihudW1Db21wb25lbnRzKSB8fCBudW1Db21wb25lbnRzID4gNCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIG51bUNvbXBvbmVudHMgJHtudW1Db21wb25lbnRzfSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLmApO1xuXHRcdH1cblx0XHR0aGlzLm51bUNvbXBvbmVudHMgPSBudW1Db21wb25lbnRzO1xuXG5cdFx0Ly8gd3JpdGFibGUgZGVmYXVsdHMgdG8gZmFsc2UuXG5cdFx0Y29uc3Qgd3JpdGFibGUgPSAhIXBhcmFtcy53cml0YWJsZTtcblx0XHR0aGlzLndyaXRhYmxlID0gd3JpdGFibGU7XG5cblx0XHQvLyBTZXQgZGltZW5zaW9ucywgbWF5IGJlIDFEIG9yIDJELlxuXHRcdGNvbnN0IHsgbGVuZ3RoLCB3aWR0aCwgaGVpZ2h0IH0gPSBEYXRhTGF5ZXIuY2FsY1NpemUoZGltZW5zaW9ucywgbmFtZSk7XG5cdFx0dGhpcy5sZW5ndGggPSBsZW5ndGg7XG5cdFx0aWYgKCFpc1Bvc2l0aXZlSW50ZWdlcih3aWR0aCkpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB3aWR0aCAke3dpZHRofSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLmApO1xuXHRcdH1cblx0XHR0aGlzLndpZHRoID0gd2lkdGg7XG5cdFx0aWYgKCFpc1Bvc2l0aXZlSW50ZWdlcihoZWlnaHQpKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgbGVuZ3RoICR7aGVpZ2h0fSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLmApO1xuXHRcdH1cblx0XHR0aGlzLmhlaWdodCA9IGhlaWdodDtcblxuXHRcdC8vIFNldCBmaWx0ZXJpbmcgLSBpZiB3ZSBhcmUgcHJvY2Vzc2luZyBhIDFEIGFycmF5LCBkZWZhdWx0IHRvIE5FQVJFU1QgZmlsdGVyaW5nLlxuXHRcdC8vIEVsc2UgZGVmYXVsdCB0byBMSU5FQVIgKGludGVycG9sYXRpb24pIGZpbHRlcmluZy5cblx0XHRjb25zdCBmaWx0ZXIgPSBwYXJhbXMuZmlsdGVyICE9PSB1bmRlZmluZWQgPyBwYXJhbXMuZmlsdGVyIDogKGxlbmd0aCA/IE5FQVJFU1QgOiBMSU5FQVIpO1xuXHRcdGlmICghaXNWYWxpZEZpbHRlclR5cGUoZmlsdGVyKSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGZpbHRlcjogJHtmaWx0ZXJ9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIsIG11c3QgYmUgJHt2YWxpZEZpbHRlclR5cGVzLmpvaW4oJywgJyl9LmApO1xuXHRcdH1cblx0XHR0aGlzLmZpbHRlciA9IGZpbHRlcjtcblxuXHRcdC8vIEdldCB3cmFwIHR5cGVzLCBkZWZhdWx0IHRvIGNsYW1wIHRvIGVkZ2UuXG5cdFx0Y29uc3Qgd3JhcFMgPSBwYXJhbXMud3JhcFMgIT09IHVuZGVmaW5lZCA/IHBhcmFtcy53cmFwUyA6IENMQU1QX1RPX0VER0U7XG5cdFx0aWYgKCFpc1ZhbGlkV3JhcFR5cGUod3JhcFMpKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgd3JhcFM6ICR7d3JhcFN9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIsIG11c3QgYmUgJHt2YWxpZFdyYXBUeXBlcy5qb2luKCcsICcpfS5gKTtcblx0XHR9XG5cdFx0dGhpcy53cmFwUyA9IHdyYXBTO1xuXHRcdGNvbnN0IHdyYXBUID0gcGFyYW1zLndyYXBUICE9PSB1bmRlZmluZWQgPyBwYXJhbXMud3JhcFQgOiBDTEFNUF9UT19FREdFO1xuXHRcdGlmICghaXNWYWxpZFdyYXBUeXBlKHdyYXBUKSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHdyYXBUOiAke3dyYXBUfSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLCBtdXN0IGJlICR7dmFsaWRXcmFwVHlwZXMuam9pbignLCAnKX0uYCk7XG5cdFx0fVxuXHRcdHRoaXMud3JhcFQgPSB3cmFwVDtcblxuXHRcdC8vIFNldCBkYXRhIHR5cGUuXG5cdFx0aWYgKCFpc1ZhbGlkRGF0YVR5cGUodHlwZSkpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB0eXBlICR7dHlwZX0gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIiwgbXVzdCBiZSBvbmUgb2YgJHt2YWxpZERhdGFUeXBlcy5qb2luKCcsICcpfS5gKTtcblx0XHR9XG5cdFx0dGhpcy50eXBlID0gdHlwZTtcblx0XHRjb25zdCBpbnRlcm5hbFR5cGUgPSBEYXRhTGF5ZXIuZ2V0SW50ZXJuYWxUeXBlKHtcblx0XHRcdGdsLFxuXHRcdFx0dHlwZSxcblx0XHRcdGdsc2xWZXJzaW9uLFxuXHRcdFx0d3JpdGFibGUsXG5cdFx0XHRmaWx0ZXIsXG5cdFx0XHRuYW1lLFxuXHRcdFx0ZXJyb3JDYWxsYmFjayxcblx0XHR9KTtcblx0XHR0aGlzLmludGVybmFsVHlwZSA9IGludGVybmFsVHlwZTtcblx0XHQvLyBTZXQgZ2wgdGV4dHVyZSBwYXJhbWV0ZXJzLlxuXHRcdGNvbnN0IHtcblx0XHRcdGdsRm9ybWF0LFxuXHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCxcblx0XHRcdGdsVHlwZSxcblx0XHRcdGdsTnVtQ2hhbm5lbHMsXG5cdFx0fSA9IERhdGFMYXllci5nZXRHTFRleHR1cmVQYXJhbWV0ZXJzKHtcblx0XHRcdGdsLFxuXHRcdFx0bmFtZSxcblx0XHRcdG51bUNvbXBvbmVudHMsXG5cdFx0XHR3cml0YWJsZSxcblx0XHRcdGludGVybmFsVHlwZSxcblx0XHRcdGdsc2xWZXJzaW9uLFxuXHRcdFx0ZXJyb3JDYWxsYmFjayxcblx0XHR9KTtcblx0XHR0aGlzLmdsSW50ZXJuYWxGb3JtYXQgPSBnbEludGVybmFsRm9ybWF0O1xuXHRcdHRoaXMuZ2xGb3JtYXQgPSBnbEZvcm1hdDtcblx0XHR0aGlzLmdsVHlwZSA9IGdsVHlwZTtcblx0XHR0aGlzLmdsTnVtQ2hhbm5lbHMgPSBnbE51bUNoYW5uZWxzO1xuXG5cdFx0Ly8gU2V0IGludGVybmFsIGZpbHRlcmluZy93cmFwIHR5cGVzLlxuXHRcdHRoaXMuaW50ZXJuYWxGaWx0ZXIgPSBEYXRhTGF5ZXIuZ2V0SW50ZXJuYWxGaWx0ZXIoeyBnbCwgZmlsdGVyLCBpbnRlcm5hbFR5cGUsIG5hbWUsIGVycm9yQ2FsbGJhY2sgfSk7XG5cdFx0dGhpcy5nbEZpbHRlciA9IGdsW3RoaXMuaW50ZXJuYWxGaWx0ZXJdO1xuXHRcdHRoaXMuaW50ZXJuYWxXcmFwUyA9IERhdGFMYXllci5nZXRJbnRlcm5hbFdyYXAoeyBnbCwgd3JhcDogd3JhcFMsIG5hbWUgfSk7XG5cdFx0dGhpcy5nbFdyYXBTID0gZ2xbdGhpcy5pbnRlcm5hbFdyYXBTXTtcblx0XHR0aGlzLmludGVybmFsV3JhcFQgPSBEYXRhTGF5ZXIuZ2V0SW50ZXJuYWxXcmFwKHsgZ2wsIHdyYXA6IHdyYXBULCBuYW1lIH0pO1xuXHRcdHRoaXMuZ2xXcmFwVCA9IGdsW3RoaXMuaW50ZXJuYWxXcmFwVF07XG5cblx0XHQvLyBOdW0gYnVmZmVycyBpcyB0aGUgbnVtYmVyIG9mIHN0YXRlcyB0byBzdG9yZSBmb3IgdGhpcyBkYXRhLlxuXHRcdGNvbnN0IG51bUJ1ZmZlcnMgPSBwYXJhbXMubnVtQnVmZmVycyAhPT0gdW5kZWZpbmVkID8gcGFyYW1zLm51bUJ1ZmZlcnMgOiAxO1xuXHRcdGlmICghaXNQb3NpdGl2ZUludGVnZXIobnVtQnVmZmVycykpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBudW1CdWZmZXJzOiAke251bUJ1ZmZlcnN9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIsIG11c3QgYmUgcG9zaXRpdmUgaW50ZWdlci5gKTtcblx0XHR9XG5cdFx0dGhpcy5udW1CdWZmZXJzID0gbnVtQnVmZmVycztcblxuXHRcdHRoaXMuaW5pdEJ1ZmZlcnMoZGF0YSk7XG5cdH1cblxuXHRwcml2YXRlIHN0YXRpYyBjYWxjU2l6ZShkaW1lbnNpb25zOiBudW1iZXIgfCBbbnVtYmVyLCBudW1iZXJdLCBuYW1lOiBzdHJpbmcpIHtcblx0XHRsZXQgbGVuZ3RoLCB3aWR0aCwgaGVpZ2h0O1xuXHRcdGlmICghaXNOYU4oZGltZW5zaW9ucyBhcyBudW1iZXIpKSB7XG5cdFx0XHRpZiAoIWlzUG9zaXRpdmVJbnRlZ2VyKGRpbWVuc2lvbnMpKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBsZW5ndGggJHtkaW1lbnNpb25zfSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLmApO1xuXHRcdFx0fVxuXHRcdFx0bGVuZ3RoID0gZGltZW5zaW9ucyBhcyBudW1iZXI7XG5cdFx0XHQvLyBDYWxjIHBvd2VyIG9mIHR3byB3aWR0aCBhbmQgaGVpZ2h0IGZvciBsZW5ndGguXG5cdFx0XHRsZXQgZXhwID0gMTtcblx0XHRcdGxldCByZW1haW5kZXIgPSBsZW5ndGg7XG5cdFx0XHR3aGlsZSAocmVtYWluZGVyID4gMikge1xuXHRcdFx0XHRleHArKztcblx0XHRcdFx0cmVtYWluZGVyIC89IDI7XG5cdFx0XHR9XG5cdFx0XHR3aWR0aCA9IE1hdGgucG93KDIsIE1hdGguZmxvb3IoZXhwIC8gMikgKyBleHAgJSAyKTtcblx0XHRcdGhlaWdodCA9IE1hdGgucG93KDIsIE1hdGguZmxvb3IoZXhwLzIpKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0d2lkdGggPSAoZGltZW5zaW9ucyBhcyBbbnVtYmVyLCBudW1iZXJdKVswXTtcblx0XHRcdGlmICghaXNQb3NpdGl2ZUludGVnZXIod2lkdGgpKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB3aWR0aCAke3dpZHRofSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLmApO1xuXHRcdFx0fVxuXHRcdFx0aGVpZ2h0ID0gKGRpbWVuc2lvbnMgYXMgW251bWJlciwgbnVtYmVyXSlbMV07XG5cdFx0XHRpZiAoIWlzUG9zaXRpdmVJbnRlZ2VyKGhlaWdodCkpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGhlaWdodCAke2hlaWdodH0gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHsgd2lkdGgsIGhlaWdodCwgbGVuZ3RoIH07XG5cdH1cblxuXHRwcml2YXRlIHN0YXRpYyBnZXRJbnRlcm5hbFdyYXAoXG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0IHwgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCxcblx0XHRcdHdyYXA6IERhdGFMYXllcldyYXBUeXBlLFxuXHRcdFx0bmFtZTogc3RyaW5nLFxuXHRcdH0sXG5cdCkge1xuXHRcdGNvbnN0IHsgZ2wsIHdyYXAsIG5hbWUgfSA9IHBhcmFtcztcblx0XHQvLyBXZWJnbDIuMCBzdXBwb3J0cyBhbGwgY29tYmluYXRpb25zIG9mIHR5cGVzIGFuZCBmaWx0ZXJpbmcuXG5cdFx0aWYgKGlzV2ViR0wyKGdsKSkge1xuXHRcdFx0cmV0dXJuIHdyYXA7XG5cdFx0fVxuXHRcdC8vIENMQU1QX1RPX0VER0UgaXMgYWx3YXlzIHN1cHBvcnRlZC5cblx0XHRpZiAod3JhcCA9PT0gQ0xBTVBfVE9fRURHRSkge1xuXHRcdFx0cmV0dXJuIHdyYXA7XG5cdFx0fVxuXHRcdGlmICghaXNXZWJHTDIoZ2wpKSB7XG5cdFx0XHQvLyBUT0RPOiB3ZSBtYXkgd2FudCB0byBoYW5kbGUgdGhpcyBpbiB0aGUgZnJhZyBzaGFkZXIuXG5cdFx0XHQvLyBSRVBFQVQgYW5kIE1JUlJPUl9SRVBFQVQgd3JhcCBub3Qgc3VwcG9ydGVkIGZvciBub24tcG93ZXIgb2YgMiB0ZXh0dXJlcyBpbiBzYWZhcmkuXG5cdFx0XHQvLyBJJ3ZlIHRlc3RlZCB0aGlzIGFuZCBpdCBzZWVtcyB0aGF0IHNvbWUgcG93ZXIgb2YgMiB0ZXh0dXJlcyB3aWxsIHdvcmsgKDUxMiB4IDUxMiksXG5cdFx0XHQvLyBidXQgbm90IG90aGVycyAoMTAyNHgxMDI0KSwgc28gbGV0J3MganVzdCBjaGFuZ2UgYWxsIFdlYkdMIDEuMCB0byBDTEFNUC5cblx0XHRcdC8vIFdpdGhvdXQgdGhpcywgd2UgY3VycmVudGx5IGdldCBhbiBlcnJvciBhdCBkcmF3QXJyYXlzKCk6XG5cdFx0XHQvLyBcIldlYkdMOiBkcmF3QXJyYXlzOiB0ZXh0dXJlIGJvdW5kIHRvIHRleHR1cmUgdW5pdCAwIGlzIG5vdCByZW5kZXJhYmxlLlxuXHRcdFx0Ly8gSXQgbWF5YmUgbm9uLXBvd2VyLW9mLTIgYW5kIGhhdmUgaW5jb21wYXRpYmxlIHRleHR1cmUgZmlsdGVyaW5nIG9yIGlzIG5vdFxuXHRcdFx0Ly8gJ3RleHR1cmUgY29tcGxldGUnLCBvciBpdCBpcyBhIGZsb2F0L2hhbGYtZmxvYXQgdHlwZSB3aXRoIGxpbmVhciBmaWx0ZXJpbmcgYW5kXG5cdFx0XHQvLyB3aXRob3V0IHRoZSByZWxldmFudCBmbG9hdC9oYWxmLWZsb2F0IGxpbmVhciBleHRlbnNpb24gZW5hYmxlZC5cIlxuXHRcdFx0Y29uc29sZS53YXJuKGBGYWxsaW5nIGJhY2sgdG8gQ0xBTVBfVE9fRURHRSB3cmFwcGluZyBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiIGZvciBXZWJHTCAxLmApO1xuXHRcdFx0cmV0dXJuIENMQU1QX1RPX0VER0U7XG5cdFx0fVxuXHRcdHJldHVybiB3cmFwO1xuXHR9XG5cblx0cHJpdmF0ZSBzdGF0aWMgZ2V0SW50ZXJuYWxGaWx0ZXIoXG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0IHwgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCxcblx0XHRcdGZpbHRlcjogRGF0YUxheWVyRmlsdGVyVHlwZSxcblx0XHRcdGludGVybmFsVHlwZTogRGF0YUxheWVyVHlwZSxcblx0XHRcdG5hbWU6IHN0cmluZyxcblx0XHRcdGVycm9yQ2FsbGJhY2s6IEVycm9yQ2FsbGJhY2ssXG5cdFx0fSxcblx0KSB7XG5cdFx0Y29uc3QgeyBnbCwgZXJyb3JDYWxsYmFjaywgaW50ZXJuYWxUeXBlLCBuYW1lIH0gPSBwYXJhbXM7XG5cdFx0bGV0IHsgZmlsdGVyIH0gPSBwYXJhbXM7XG5cdFx0aWYgKGZpbHRlciA9PT0gTkVBUkVTVCkge1xuXHRcdFx0Ly8gTkVBUkVTVCBmaWx0ZXJpbmcgaXMgYWx3YXlzIHN1cHBvcnRlZC5cblx0XHRcdHJldHVybiBmaWx0ZXI7XG5cdFx0fVxuXG5cdFx0aWYgKGludGVybmFsVHlwZSA9PT0gSEFMRl9GTE9BVCkge1xuXHRcdFx0Ly8gVE9ETzogdGVzdCBpZiBmbG9hdCBsaW5lYXIgZXh0ZW5zaW9uIGlzIGFjdHVhbGx5IHdvcmtpbmcuXG5cdFx0XHRjb25zdCBleHRlbnNpb24gPSBnZXRFeHRlbnNpb24oZ2wsIE9FU19URVhUVVJFX0hBbEZfRkxPQVRfTElORUFSLCBlcnJvckNhbGxiYWNrLCB0cnVlKVxuXHRcdFx0XHR8fCBnZXRFeHRlbnNpb24oZ2wsIE9FU19URVhUVVJFX0ZMT0FUX0xJTkVBUiwgZXJyb3JDYWxsYmFjaywgdHJ1ZSk7XG5cdFx0XHRpZiAoIWV4dGVuc2lvbikge1xuXHRcdFx0XHRjb25zb2xlLndhcm4oYEZhbGxpbmcgYmFjayB0byBORUFSRVNUIGZpbHRlciBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLmApO1xuXHRcdFx0XHQvL1RPRE86IGFkZCBhIGZhbGxiYWNrIHRoYXQgZG9lcyB0aGlzIGZpbHRlcmluZyBpbiB0aGUgZnJhZyBzaGFkZXI/LlxuXHRcdFx0XHRmaWx0ZXIgPSBORUFSRVNUO1xuXHRcdFx0fVxuXHRcdH0gaWYgKGludGVybmFsVHlwZSA9PT0gRkxPQVQpIHtcblx0XHRcdGNvbnN0IGV4dGVuc2lvbiA9IGdldEV4dGVuc2lvbihnbCwgT0VTX1RFWFRVUkVfRkxPQVRfTElORUFSLCBlcnJvckNhbGxiYWNrLCB0cnVlKTtcblx0XHRcdGlmICghZXh0ZW5zaW9uKSB7XG5cdFx0XHRcdGNvbnNvbGUud2FybihgRmFsbGluZyBiYWNrIHRvIE5FQVJFU1QgZmlsdGVyIGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIuYCk7XG5cdFx0XHRcdC8vVE9ETzogYWRkIGEgZmFsbGJhY2sgdGhhdCBkb2VzIHRoaXMgZmlsdGVyaW5nIGluIHRoZSBmcmFnIHNoYWRlcj8uXG5cdFx0XHRcdGZpbHRlciA9IE5FQVJFU1Q7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBmaWx0ZXI7XG5cdH1cblxuXHRwcml2YXRlIHN0YXRpYyBnZXRJbnRlcm5hbFR5cGUoXG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0IHwgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCxcblx0XHRcdHR5cGU6IERhdGFMYXllclR5cGUsXG5cdFx0XHRnbHNsVmVyc2lvbjogR0xTTFZlcnNpb24sXG5cdFx0XHR3cml0YWJsZTogYm9vbGVhbixcblx0XHRcdGZpbHRlcjogRGF0YUxheWVyRmlsdGVyVHlwZSxcblx0XHRcdG5hbWU6IHN0cmluZyxcblx0XHRcdGVycm9yQ2FsbGJhY2s6IEVycm9yQ2FsbGJhY2ssXG5cdFx0fSxcblx0KSB7XG5cdFx0Y29uc3QgeyBnbCwgZXJyb3JDYWxsYmFjaywgd3JpdGFibGUsIG5hbWUsIGdsc2xWZXJzaW9uIH0gPSBwYXJhbXM7XG5cdFx0Y29uc3QgeyB0eXBlIH0gPSBwYXJhbXM7XG5cdFx0bGV0IGludGVybmFsVHlwZSA9IHR5cGU7XG5cdFx0Ly8gQ2hlY2sgaWYgaW50IHR5cGVzIGFyZSBzdXBwb3J0ZWQuXG5cdFx0Y29uc3QgaW50Q2FzdCA9IERhdGFMYXllci5zaG91bGRDYXN0SW50VHlwZUFzRmxvYXQocGFyYW1zKTtcblx0XHRpZiAoaW50Q2FzdCkge1xuXHRcdFx0aWYgKGludGVybmFsVHlwZSA9PT0gVU5TSUdORURfQllURSB8fCBpbnRlcm5hbFR5cGUgPT09IEJZVEUpIHtcblx0XHRcdFx0Ly8gSW50ZWdlcnMgYmV0d2VlbiAwIGFuZCAyMDQ4IGNhbiBiZSBleGFjdGx5IHJlcHJlc2VudGVkIGJ5IGhhbGYgZmxvYXQgKGFuZCBhbHNvIGJldHdlZW4g4oiSMjA0OCBhbmQgMClcblx0XHRcdFx0aW50ZXJuYWxUeXBlID0gSEFMRl9GTE9BVDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIEludGVnZXJzIGJldHdlZW4gMCBhbmQgMTY3NzcyMTYgY2FuIGJlIGV4YWN0bHkgcmVwcmVzZW50ZWQgYnkgZmxvYXQzMiAoYWxzbyBhcHBsaWVzIGZvciBuZWdhdGl2ZSBpbnRlZ2VycyBiZXR3ZWVuIOKIkjE2Nzc3MjE2IGFuZCAwKVxuXHRcdFx0XHQvLyBUaGlzIGlzIHN1ZmZpY2llbnQgZm9yIFVOU0lHTkVEX1NIT1JUIGFuZCBTSE9SVCB0eXBlcy5cblx0XHRcdFx0Ly8gTGFyZ2UgVU5TSUdORURfSU5UIGFuZCBJTlQgY2Fubm90IGJlIHJlcHJlc2VudGVkIGJ5IEZMT0FUIHR5cGUuXG5cdFx0XHRcdGlmIChpbnRlcm5hbFR5cGUgPT09IElOVCB8fCBpbnRlcm5hbFR5cGUgPT09IFVOU0lHTkVEX0lOVCkge1xuXHRcdFx0XHRcdFxuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnNvbGUud2FybihgRmFsbGluZyBiYWNrICR7aW50ZXJuYWxUeXBlfSB0eXBlIHRvIEZMT0FUIHR5cGUgZm9yIGdsc2wxLnggc3VwcG9ydCBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLlxuTGFyZ2UgVU5TSUdORURfSU5UIG9yIElOVCB3aXRoIGFic29sdXRlIHZhbHVlID4gMTYsNzc3LDIxNiBhcmUgbm90IHN1cHBvcnRlZCwgb24gbW9iaWxlIFVOU0lHTkVEX0lOVCwgSU5ULCBVTlNJR05FRF9TSE9SVCwgYW5kIFNIT1JUIHdpdGggYWJzb2x1dGUgdmFsdWUgPiAyLDA0OCBtYXkgbm90IGJlIHN1cHBvcnRlZC5gKTtcblx0XHRcdFx0aW50ZXJuYWxUeXBlID0gRkxPQVQ7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdC8vIENoZWNrIGlmIGZsb2F0MzIgc3VwcG9ydGVkLlxuXHRcdGlmICghaXNXZWJHTDIoZ2wpKSB7XG5cdFx0XHRpZiAoaW50ZXJuYWxUeXBlID09PSBGTE9BVCkge1xuXHRcdFx0XHRjb25zdCBleHRlbnNpb24gPSBnZXRFeHRlbnNpb24oZ2wsIE9FU19URVhUVVJFX0ZMT0FULCBlcnJvckNhbGxiYWNrLCB0cnVlKTtcblx0XHRcdFx0aWYgKCFleHRlbnNpb24pIHtcblx0XHRcdFx0XHRjb25zb2xlLndhcm4oYEZMT0FUIG5vdCBzdXBwb3J0ZWQsIGZhbGxpbmcgYmFjayB0byBIQUxGX0ZMT0FUIHR5cGUgZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdFx0XHRpbnRlcm5hbFR5cGUgPSBIQUxGX0ZMT0FUO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE3NDc2NjMyL3dlYmdsLWV4dGVuc2lvbi1zdXBwb3J0LWFjcm9zcy1icm93c2Vyc1xuXHRcdFx0XHQvLyBSZW5kZXJpbmcgdG8gYSBmbG9hdGluZy1wb2ludCB0ZXh0dXJlIG1heSBub3QgYmUgc3VwcG9ydGVkLFxuXHRcdFx0XHQvLyBldmVuIGlmIHRoZSBPRVNfdGV4dHVyZV9mbG9hdCBleHRlbnNpb24gaXMgc3VwcG9ydGVkLlxuXHRcdFx0XHQvLyBUeXBpY2FsbHksIHRoaXMgZmFpbHMgb24gY3VycmVudCBtb2JpbGUgaGFyZHdhcmUuXG5cdFx0XHRcdC8vIFRvIGNoZWNrIGlmIHRoaXMgaXMgc3VwcG9ydGVkLCB5b3UgaGF2ZSB0byBjYWxsIHRoZSBXZWJHTFxuXHRcdFx0XHQvLyBjaGVja0ZyYW1lYnVmZmVyU3RhdHVzKCkgZnVuY3Rpb24uXG5cdFx0XHRcdGlmICh3cml0YWJsZSkge1xuXHRcdFx0XHRcdGNvbnN0IHZhbGlkID0gRGF0YUxheWVyLnRlc3RGcmFtZWJ1ZmZlcldyaXRlKHsgZ2wsIHR5cGU6IGludGVybmFsVHlwZSwgZ2xzbFZlcnNpb24gfSk7XG5cdFx0XHRcdFx0aWYgKCF2YWxpZCAmJiBpbnRlcm5hbFR5cGUgIT09IEhBTEZfRkxPQVQpIHtcblx0XHRcdFx0XHRcdGNvbnNvbGUud2FybihgRkxPQVQgbm90IHN1cHBvcnRlZCBmb3Igd3JpdGluZyBvcGVyYXRpb25zLCBmYWxsaW5nIGJhY2sgdG8gSEFMRl9GTE9BVCB0eXBlIGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIuYCk7XG5cdFx0XHRcdFx0XHRpbnRlcm5hbFR5cGUgPSBIQUxGX0ZMT0FUO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0Ly8gTXVzdCBzdXBwb3J0IGF0IGxlYXN0IGhhbGYgZmxvYXQgaWYgdXNpbmcgYSBmbG9hdCB0eXBlLlxuXHRcdFx0aWYgKGludGVybmFsVHlwZSA9PT0gSEFMRl9GTE9BVCkge1xuXHRcdFx0XHRnZXRFeHRlbnNpb24oZ2wsIE9FU19URVhUVVJFX0hBTEZfRkxPQVQsIGVycm9yQ2FsbGJhY2spO1xuXHRcdFx0XHQvLyBUT0RPOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81NDI0ODYzMy9jYW5ub3QtY3JlYXRlLWhhbGYtZmxvYXQtb2VzLXRleHR1cmUtZnJvbS11aW50MTZhcnJheS1vbi1pcGFkXG5cdFx0XHRcdGlmICh3cml0YWJsZSkge1xuXHRcdFx0XHRcdGNvbnN0IHZhbGlkID0gRGF0YUxheWVyLnRlc3RGcmFtZWJ1ZmZlcldyaXRlKHsgZ2wsIHR5cGU6IGludGVybmFsVHlwZSwgZ2xzbFZlcnNpb24gfSk7XG5cdFx0XHRcdFx0aWYgKCF2YWxpZCkge1xuXHRcdFx0XHRcdFx0ZXJyb3JDYWxsYmFjayhgVGhpcyBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgcmVuZGVyaW5nIHRvIEhBTEZfRkxPQVQgdGV4dHVyZXMuYCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdFxuXHRcdC8vIExvYWQgYWRkaXRpb25hbCBleHRlbnNpb25zIGlmIG5lZWRlZC5cblx0XHRpZiAod3JpdGFibGUgJiYgaXNXZWJHTDIoZ2wpICYmIChpbnRlcm5hbFR5cGUgPT09IEhBTEZfRkxPQVQgfHwgaW50ZXJuYWxUeXBlID09PSBGTE9BVCkpIHtcblx0XHRcdGdldEV4dGVuc2lvbihnbCwgRVhUX0NPTE9SX0JVRkZFUl9GTE9BVCwgZXJyb3JDYWxsYmFjayk7XG5cdFx0fVxuXHRcdHJldHVybiBpbnRlcm5hbFR5cGU7XG5cdH1cblxuXHRwcml2YXRlIHN0YXRpYyBzaG91bGRDYXN0SW50VHlwZUFzRmxvYXQoXG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0IHwgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCxcblx0XHRcdHR5cGU6IERhdGFMYXllclR5cGUsXG5cdFx0XHRmaWx0ZXI6IERhdGFMYXllckZpbHRlclR5cGUsXG5cdFx0XHRnbHNsVmVyc2lvbjogR0xTTFZlcnNpb24sXG5cdFx0fVxuXHQpIHtcblx0XHRjb25zdCB7IGdsLCB0eXBlLCBmaWx0ZXIsIGdsc2xWZXJzaW9uIH0gPSBwYXJhbXM7XG5cdFx0aWYgKGdsc2xWZXJzaW9uID09PSBHTFNMMyAmJiBpc1dlYkdMMihnbCkpIHJldHVybiBmYWxzZTtcblx0XHQvLyBVTlNJR05FRF9CWVRFIGFuZCBMSU5FQVIgZmlsdGVyaW5nIGlzIG5vdCBzdXBwb3J0ZWQsIGNhc3QgYXMgZmxvYXQuXG5cdFx0aWYgKHR5cGUgPT09IFVOU0lHTkVEX0JZVEUgJiYgZmlsdGVyID09PSBMSU5FQVIpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHQvLyBJbnQgdGV4dHVyZXMgKG90aGVyIHRoYW4gVU5TSUdORURfQllURSkgYXJlIG5vdCBzdXBwb3J0ZWQgYnkgV2ViR0wxLjAgb3IgZ2xzbDEueC5cblx0XHQvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81NTgwMzAxNy9ob3ctdG8tc2VsZWN0LXdlYmdsLWdsc2wtc2FtcGxlci10eXBlLWZyb20tdGV4dHVyZS1mb3JtYXQtcHJvcGVydGllc1xuXHRcdC8vIFVzZSBIQUxGX0ZMT0FUL0ZMT0FUIGluc3RlYWQuXG5cdFx0cmV0dXJuIHR5cGUgPT09IEJZVEUgfHwgdHlwZSA9PT0gU0hPUlQgfHwgdHlwZSA9PT0gSU5UIHx8IHR5cGUgPT09IFVOU0lHTkVEX1NIT1JUIHx8IHR5cGUgPT09IFVOU0lHTkVEX0lOVDtcblx0fVxuXG5cdHByaXZhdGUgc3RhdGljIGdldEdMVGV4dHVyZVBhcmFtZXRlcnMoXG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0IHwgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCxcblx0XHRcdG5hbWU6IHN0cmluZyxcblx0XHRcdG51bUNvbXBvbmVudHM6IERhdGFMYXllck51bUNvbXBvbmVudHMsXG5cdFx0XHRpbnRlcm5hbFR5cGU6IERhdGFMYXllclR5cGUsXG5cdFx0XHR3cml0YWJsZTogYm9vbGVhbixcblx0XHRcdGdsc2xWZXJzaW9uOiBHTFNMVmVyc2lvbixcblx0XHRcdGVycm9yQ2FsbGJhY2s6IEVycm9yQ2FsbGJhY2ssXG5cdFx0fVxuXHQpIHtcblx0XHRjb25zdCB7IGdsLCBlcnJvckNhbGxiYWNrLCBuYW1lLCBudW1Db21wb25lbnRzLCBpbnRlcm5hbFR5cGUsIHdyaXRhYmxlLCBnbHNsVmVyc2lvbiB9ID0gcGFyYW1zO1xuXHRcdC8vIGh0dHBzOi8vd3d3Lmtocm9ub3Mub3JnL3JlZ2lzdHJ5L3dlYmdsL3NwZWNzL2xhdGVzdC8yLjAvI1RFWFRVUkVfVFlQRVNfRk9STUFUU19GUk9NX0RPTV9FTEVNRU5UU19UQUJMRVxuXHRcdGxldCBnbFR5cGU6IG51bWJlciB8IHVuZGVmaW5lZCxcblx0XHRcdGdsRm9ybWF0OiBudW1iZXIgfCB1bmRlZmluZWQsXG5cdFx0XHRnbEludGVybmFsRm9ybWF0OiBudW1iZXIgfCB1bmRlZmluZWQsXG5cdFx0XHRnbE51bUNoYW5uZWxzOiBudW1iZXIgfCB1bmRlZmluZWQ7XG5cblx0XHRpZiAoaXNXZWJHTDIoZ2wpKSB7XG5cdFx0XHRnbE51bUNoYW5uZWxzID0gbnVtQ29tcG9uZW50cztcblx0XHRcdC8vIGh0dHBzOi8vd3d3Lmtocm9ub3Mub3JnL3JlZ2lzdHJ5L3dlYmdsL2V4dGVuc2lvbnMvRVhUX2NvbG9yX2J1ZmZlcl9mbG9hdC9cblx0XHRcdC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9XZWJHTFJlbmRlcmluZ0NvbnRleHQvdGV4SW1hZ2UyRFxuXHRcdFx0Ly8gVGhlIHNpemVkIGludGVybmFsIGZvcm1hdCBSR0J4eHggYXJlIG5vdCBjb2xvci1yZW5kZXJhYmxlIGZvciBzb21lIHJlYXNvbi5cblx0XHRcdC8vIElmIG51bUNvbXBvbmVudHMgPT0gMyBmb3IgYSB3cml0YWJsZSB0ZXh0dXJlLCB1c2UgUkdCQSBpbnN0ZWFkLlxuXHRcdFx0Ly8gUGFnZSA1IG9mIGh0dHBzOi8vd3d3Lmtocm9ub3Mub3JnL2ZpbGVzL3dlYmdsMjAtcmVmZXJlbmNlLWd1aWRlLnBkZlxuXHRcdFx0aWYgKG51bUNvbXBvbmVudHMgPT09IDMgJiYgd3JpdGFibGUpIHtcblx0XHRcdFx0Z2xOdW1DaGFubmVscyA9IDQ7XG5cdFx0XHR9XG5cdFx0XHRpZiAoaW50ZXJuYWxUeXBlID09PSBGTE9BVCB8fCBpbnRlcm5hbFR5cGUgPT09IEhBTEZfRkxPQVQpIHtcblx0XHRcdFx0c3dpdGNoIChnbE51bUNoYW5uZWxzKSB7XG5cdFx0XHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRcdFx0Z2xGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkVEO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdFx0Z2xGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkc7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDM6XG5cdFx0XHRcdFx0XHRnbEZvcm1hdCA9IGdsLlJHQjtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgNDpcblx0XHRcdFx0XHRcdGdsRm9ybWF0ID0gZ2wuUkdCQTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGdsTnVtQ2hhbm5lbHMgJHtnbE51bUNoYW5uZWxzfSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLmApO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKGdsc2xWZXJzaW9uID09PSBHTFNMMSAmJiBpbnRlcm5hbFR5cGUgPT09IFVOU0lHTkVEX0JZVEUpIHtcblx0XHRcdFx0c3dpdGNoIChnbE51bUNoYW5uZWxzKSB7XG5cdFx0XHRcdFx0Ly8gRm9yIHJlYWQgb25seSB0ZXh0dXJlcyBpbiBXZWJHTCAxLjAsIHVzZSBnbC5BTFBIQSBhbmQgZ2wuTFVNSU5BTkNFX0FMUEhBLlxuXHRcdFx0XHRcdC8vIE90aGVyd2lzZSB1c2UgUkdCL1JHQkEuXG5cdFx0XHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRcdFx0aWYgKCF3cml0YWJsZSkge1xuXHRcdFx0XHRcdFx0XHRnbEZvcm1hdCA9IGdsLkFMUEhBO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjYXNlIDI6XG5cdFx0XHRcdFx0XHRpZiAoIXdyaXRhYmxlKSB7XG5cdFx0XHRcdFx0XHRcdGdsRm9ybWF0ID0gZ2wuTFVNSU5BTkNFX0FMUEhBO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjYXNlIDM6XG5cdFx0XHRcdFx0XHRnbEZvcm1hdCA9IGdsLlJHQjtcblx0XHRcdFx0XHRcdGdsTnVtQ2hhbm5lbHMgPSAzO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSA0OlxuXHRcdFx0XHRcdFx0Z2xGb3JtYXQgPSBnbC5SR0JBO1xuXHRcdFx0XHRcdFx0Z2xOdW1DaGFubmVscyA9IDQ7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBnbE51bUNoYW5uZWxzICR7Z2xOdW1DaGFubmVsc30gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c3dpdGNoIChnbE51bUNoYW5uZWxzKSB7XG5cdFx0XHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRcdFx0Z2xGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkVEX0lOVEVHRVI7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDI6XG5cdFx0XHRcdFx0XHRnbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR19JTlRFR0VSO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHRcdFx0Z2xGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkdCX0lOVEVHRVI7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDQ6XG5cdFx0XHRcdFx0XHRnbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR0JBX0lOVEVHRVI7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBnbE51bUNoYW5uZWxzICR7Z2xOdW1DaGFubmVsc30gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0c3dpdGNoIChpbnRlcm5hbFR5cGUpIHtcblx0XHRcdFx0Y2FzZSBIQUxGX0ZMT0FUOlxuXHRcdFx0XHRcdGdsVHlwZSA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5IQUxGX0ZMT0FUO1xuXHRcdFx0XHRcdHN3aXRjaCAoZ2xOdW1DaGFubmVscykge1xuXHRcdFx0XHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlIxNkY7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHMTZGO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgMzpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR0IxNkY7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSA0OlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHQkExNkY7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBnbE51bUNoYW5uZWxzICR7Z2xOdW1DaGFubmVsc30gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgRkxPQVQ6XG5cdFx0XHRcdFx0Z2xUeXBlID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLkZMT0FUO1xuXHRcdFx0XHRcdHN3aXRjaCAoZ2xOdW1DaGFubmVscykge1xuXHRcdFx0XHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlIzMkY7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHMzJGO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgMzpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR0IzMkY7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSA0OlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHQkEzMkY7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBnbE51bUNoYW5uZWxzICR7Z2xOdW1DaGFubmVsc30gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgVU5TSUdORURfQllURTpcblx0XHRcdFx0XHRnbFR5cGUgPSBnbC5VTlNJR05FRF9CWVRFO1xuXHRcdFx0XHRcdGlmIChnbHNsVmVyc2lvbiA9PT0gR0xTTDEgJiYgaW50ZXJuYWxUeXBlID09PSBVTlNJR05FRF9CWVRFKSB7XG5cdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gZ2xGb3JtYXQ7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHN3aXRjaCAoZ2xOdW1DaGFubmVscykge1xuXHRcdFx0XHRcdFx0XHRjYXNlIDE6XG5cdFx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SOFVJO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRjYXNlIDI6XG5cdFx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SRzhVSTtcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkdCOFVJO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRjYXNlIDQ6XG5cdFx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR0JBOFVJO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgZ2xOdW1DaGFubmVscyAke2dsTnVtQ2hhbm5lbHN9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIuYCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIEJZVEU6XG5cdFx0XHRcdFx0Z2xUeXBlID0gZ2wuQllURTtcblx0XHRcdFx0XHRzd2l0Y2ggKGdsTnVtQ2hhbm5lbHMpIHtcblx0XHRcdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SOEk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHOEk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHQjhJO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgNDpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR0JBOEk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBnbE51bUNoYW5uZWxzICR7Z2xOdW1DaGFubmVsc30gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgU0hPUlQ6XG5cdFx0XHRcdFx0Z2xUeXBlID0gZ2wuU0hPUlQ7XG5cdFx0XHRcdFx0c3dpdGNoIChnbE51bUNoYW5uZWxzKSB7XG5cdFx0XHRcdFx0XHRjYXNlIDE6XG5cdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUjE2STtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDI6XG5cdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkcxNkk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHQjE2STtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDQ6XG5cdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkdCQTE2STtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGdsTnVtQ2hhbm5lbHMgJHtnbE51bUNoYW5uZWxzfSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLmApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBVTlNJR05FRF9TSE9SVDpcblx0XHRcdFx0XHRnbFR5cGUgPSBnbC5VTlNJR05FRF9TSE9SVDtcblx0XHRcdFx0XHRzd2l0Y2ggKGdsTnVtQ2hhbm5lbHMpIHtcblx0XHRcdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SMTZVSTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDI6XG5cdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkcxNlVJO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgMzpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR0IxNlVJO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgNDpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR0JBMTZVSTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGdsTnVtQ2hhbm5lbHMgJHtnbE51bUNoYW5uZWxzfSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLmApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBJTlQ6XG5cdFx0XHRcdFx0Z2xUeXBlID0gZ2wuSU5UO1xuXHRcdFx0XHRcdHN3aXRjaCAoZ2xOdW1DaGFubmVscykge1xuXHRcdFx0XHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlIzMkk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHMzJJO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgMzpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR0IzMkk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSA0OlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHQkEzMkk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBnbE51bUNoYW5uZWxzICR7Z2xOdW1DaGFubmVsc30gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgVU5TSUdORURfSU5UOlxuXHRcdFx0XHRcdGdsVHlwZSA9IGdsLlVOU0lHTkVEX0lOVDtcblx0XHRcdFx0XHRzd2l0Y2ggKGdsTnVtQ2hhbm5lbHMpIHtcblx0XHRcdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SMzJVSTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDI6XG5cdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkczMlVJO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgMzpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR0IzMlVJO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgNDpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR0JBMzJVSTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGdsTnVtQ2hhbm5lbHMgJHtnbE51bUNoYW5uZWxzfSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLmApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIHR5cGUgJHtpbnRlcm5hbFR5cGV9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIuYCk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHN3aXRjaCAobnVtQ29tcG9uZW50cykge1xuXHRcdFx0XHQvLyBUT0RPOiBmb3IgcmVhZCBvbmx5IHRleHR1cmVzIGluIFdlYkdMIDEuMCwgd2UgY291bGQgdXNlIGdsLkFMUEhBIGFuZCBnbC5MVU1JTkFOQ0VfQUxQSEEgaGVyZS5cblx0XHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRcdGlmICghd3JpdGFibGUpIHtcblx0XHRcdFx0XHRcdGdsRm9ybWF0ID0gZ2wuQUxQSEE7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdGNhc2UgMjpcblx0XHRcdFx0XHRpZiAoIXdyaXRhYmxlKSB7XG5cdFx0XHRcdFx0XHRnbEZvcm1hdCA9IGdsLkxVTUlOQU5DRV9BTFBIQTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHRcdGdsRm9ybWF0ID0gZ2wuUkdCO1xuXHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSBnbC5SR0I7XG5cdFx0XHRcdFx0Z2xOdW1DaGFubmVscyA9IDM7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgNDpcblx0XHRcdFx0XHRnbEZvcm1hdCA9IGdsLlJHQkE7XG5cdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IGdsLlJHQkE7XG5cdFx0XHRcdFx0Z2xOdW1DaGFubmVscyA9IDQ7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBudW1Db21wb25lbnRzICR7bnVtQ29tcG9uZW50c30gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdH1cblx0XHRcdHN3aXRjaCAoaW50ZXJuYWxUeXBlKSB7XG5cdFx0XHRcdGNhc2UgRkxPQVQ6XG5cdFx0XHRcdFx0Z2xUeXBlID0gZ2wuRkxPQVQ7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgSEFMRl9GTE9BVDpcblx0XHRcdFx0XHRnbFR5cGUgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuSEFMRl9GTE9BVCB8fCBnZXRFeHRlbnNpb24oZ2wsIE9FU19URVhUVVJFX0hBTEZfRkxPQVQsIGVycm9yQ2FsbGJhY2spLkhBTEZfRkxPQVRfT0VTIGFzIG51bWJlcjtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBVTlNJR05FRF9CWVRFOlxuXHRcdFx0XHRcdGdsVHlwZSA9IGdsLlVOU0lHTkVEX0JZVEU7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdC8vIE5vIG90aGVyIHR5cGVzIGFyZSBzdXBwb3J0ZWQgaW4gZ2xzbDEueFxuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgdHlwZSAke2ludGVybmFsVHlwZX0gaW4gV2ViR0wgMS4wIGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIuYCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gQ2hlY2sgZm9yIG1pc3NpbmcgcGFyYW1zLlxuXHRcdGlmIChnbFR5cGUgPT09IHVuZGVmaW5lZCB8fCBnbEZvcm1hdCA9PT0gdW5kZWZpbmVkIHx8IGdsSW50ZXJuYWxGb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Y29uc3QgbWlzc2luZ1BhcmFtcyA9IFtdO1xuXHRcdFx0aWYgKGdsVHlwZSA9PT0gdW5kZWZpbmVkKSBtaXNzaW5nUGFyYW1zLnB1c2goJ2dsVHlwZScpO1xuXHRcdFx0aWYgKGdsRm9ybWF0ID09PSB1bmRlZmluZWQpIG1pc3NpbmdQYXJhbXMucHVzaCgnZ2xGb3JtYXQnKTtcblx0XHRcdGlmIChnbEludGVybmFsRm9ybWF0ID09PSB1bmRlZmluZWQpIG1pc3NpbmdQYXJhbXMucHVzaCgnZ2xJbnRlcm5hbEZvcm1hdCcpO1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHR5cGU6ICR7aW50ZXJuYWxUeXBlfSBmb3IgbnVtQ29tcG9uZW50cyAke251bUNvbXBvbmVudHN9LCB1bmFibGUgdG8gaW5pdCBwYXJhbWV0ZXIke21pc3NpbmdQYXJhbXMubGVuZ3RoID4gMSA/ICdzJyA6ICcnfSAke21pc3NpbmdQYXJhbXMuam9pbignLCAnKX0gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHR9XG5cdFx0aWYgKGdsTnVtQ2hhbm5lbHMgPT09IHVuZGVmaW5lZCB8fCBudW1Db21wb25lbnRzIDwgMSB8fCBudW1Db21wb25lbnRzID4gNCB8fCBnbE51bUNoYW5uZWxzIDwgbnVtQ29tcG9uZW50cykge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIG51bUNoYW5uZWxzICR7Z2xOdW1DaGFubmVsc30gZm9yIG51bUNvbXBvbmVudHMgJHtudW1Db21wb25lbnRzfSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLmApO1xuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHRnbEZvcm1hdCxcblx0XHRcdGdsSW50ZXJuYWxGb3JtYXQsXG5cdFx0XHRnbFR5cGUsXG5cdFx0XHRnbE51bUNoYW5uZWxzLFxuXHRcdH07XG5cdH1cblxuXHRwcml2YXRlIHN0YXRpYyB0ZXN0RnJhbWVidWZmZXJXcml0ZShcblx0XHRwYXJhbXM6IHtcblx0XHRcdGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQgfCBXZWJHTDJSZW5kZXJpbmdDb250ZXh0LFxuXHRcdFx0dHlwZTogRGF0YUxheWVyVHlwZSxcblx0XHRcdGdsc2xWZXJzaW9uOiBHTFNMVmVyc2lvbixcblx0XHR9LFxuXHQpIHtcblx0XHRjb25zdCB7IGdsLCB0eXBlLCBnbHNsVmVyc2lvbiB9ID0gcGFyYW1zO1xuXHRcdGNvbnN0IHRleHR1cmUgPSBnbC5jcmVhdGVUZXh0dXJlKCk7XG5cdFx0aWYgKCF0ZXh0dXJlKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIHRleHR1cmUpO1xuXG5cdFx0Ly8gRGVmYXVsdCB0byBtb3N0IHdpZGVseSBzdXBwb3J0ZWQgc2V0dGluZ3MuXG5cdFx0Y29uc3Qgd3JhcFMgPSBnbFtDTEFNUF9UT19FREdFXTtcblx0XHRjb25zdCB3cmFwVCA9IGdsW0NMQU1QX1RPX0VER0VdO1xuXHRcdGNvbnN0IGZpbHRlciA9IGdsW05FQVJFU1RdO1xuXHRcdC8vIFVzZSBub24tcG93ZXIgb2YgdHdvIGRpbWVuc2lvbnMgdG8gY2hlY2sgZm9yIG1vcmUgdW5pdmVyc2FsIHN1cHBvcnQuXG5cdFx0Ly8gKEluIGNhc2Ugc2l6ZSBvZiBEYXRhTGF5ZXIgaXMgY2hhbmdlZCBhdCBhIGxhdGVyIHBvaW50KS5cblx0XHRjb25zdCB3aWR0aCA9IDEwMDtcblx0XHRjb25zdCBoZWlnaHQgPSAxMDA7XG5cdFx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfUywgd3JhcFMpO1xuXHRcdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1QsIHdyYXBUKTtcblx0XHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgZmlsdGVyKTtcblx0XHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgZmlsdGVyKTtcblxuXHRcdGNvbnN0IHsgZ2xJbnRlcm5hbEZvcm1hdCwgZ2xGb3JtYXQsIGdsVHlwZSB9ID0gRGF0YUxheWVyLmdldEdMVGV4dHVyZVBhcmFtZXRlcnMoe1xuXHRcdFx0Z2wsXG5cdFx0XHRuYW1lOiAndGVzdEZyYW1lYnVmZmVyV3JpdGUnLFxuXHRcdFx0bnVtQ29tcG9uZW50czogMSxcblx0XHRcdHdyaXRhYmxlOiB0cnVlLFxuXHRcdFx0aW50ZXJuYWxUeXBlOiB0eXBlLFxuXHRcdFx0Z2xzbFZlcnNpb24sXG5cdFx0XHRlcnJvckNhbGxiYWNrOiAoKSA9PiB7fSxcblx0XHR9KTtcblx0XHRnbC50ZXhJbWFnZTJEKGdsLlRFWFRVUkVfMkQsIDAsIGdsSW50ZXJuYWxGb3JtYXQsIHdpZHRoLCBoZWlnaHQsIDAsIGdsRm9ybWF0LCBnbFR5cGUsIG51bGwpO1xuXG5cdFx0Ly8gSW5pdCBhIGZyYW1lYnVmZmVyIGZvciB0aGlzIHRleHR1cmUgc28gd2UgY2FuIHdyaXRlIHRvIGl0LlxuXHRcdGNvbnN0IGZyYW1lYnVmZmVyID0gZ2wuY3JlYXRlRnJhbWVidWZmZXIoKTtcblx0XHRpZiAoIWZyYW1lYnVmZmVyKSB7XG5cdFx0XHQvLyBDbGVhciBvdXQgYWxsb2NhdGVkIG1lbW9yeS5cblx0XHRcdGdsLmRlbGV0ZVRleHR1cmUodGV4dHVyZSk7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdGdsLmJpbmRGcmFtZWJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgZnJhbWVidWZmZXIpO1xuXHRcdC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9XZWJHTFJlbmRlcmluZ0NvbnRleHQvZnJhbWVidWZmZXJUZXh0dXJlMkRcblx0XHRnbC5mcmFtZWJ1ZmZlclRleHR1cmUyRChnbC5GUkFNRUJVRkZFUiwgZ2wuQ09MT1JfQVRUQUNITUVOVDAsIGdsLlRFWFRVUkVfMkQsIHRleHR1cmUsIDApO1xuXG5cdFx0Y29uc3Qgc3RhdHVzID0gZ2wuY2hlY2tGcmFtZWJ1ZmZlclN0YXR1cyhnbC5GUkFNRUJVRkZFUik7XG5cdFx0Y29uc3QgdmFsaWRTdGF0dXMgPSBzdGF0dXMgPT09IGdsLkZSQU1FQlVGRkVSX0NPTVBMRVRFO1xuXG5cdFx0Ly8gQ2xlYXIgb3V0IGFsbG9jYXRlZCBtZW1vcnkuXG5cdFx0Z2wuZGVsZXRlVGV4dHVyZSh0ZXh0dXJlKTtcblx0XHRnbC5kZWxldGVGcmFtZWJ1ZmZlcihmcmFtZWJ1ZmZlcik7XG5cblx0XHRyZXR1cm4gdmFsaWRTdGF0dXM7XG5cdH1cblxuXHRnZXQgYnVmZmVySW5kZXgoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX2J1ZmZlckluZGV4O1xuXHR9XG5cblx0c2F2ZUN1cnJlbnRTdGF0ZVRvRGF0YUxheWVyKGxheWVyOiBEYXRhTGF5ZXIpIHtcblx0XHQvLyBBIG1ldGhvZCBmb3Igc2F2aW5nIGEgY29weSBvZiB0aGUgY3VycmVudCBzdGF0ZSB3aXRob3V0IGEgZHJhdyBjYWxsLlxuXHRcdC8vIERyYXcgY2FsbHMgYXJlIGV4cGVuc2l2ZSwgdGhpcyBvcHRpbWl6YXRpb24gaGVscHMuXG5cdFx0aWYgKHRoaXMubnVtQnVmZmVycyA8IDIpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgQ2FuJ3QgY2FsbCBEYXRhTGF5ZXIuc2F2ZUN1cnJlbnRTdGF0ZVRvRGF0YUxheWVyIG9uIERhdGFMYXllciAke3RoaXMubmFtZX0gd2l0aCBsZXNzIHRoYW4gMiBidWZmZXJzLmApO1xuXHRcdH1cblx0XHRpZiAoIXRoaXMud3JpdGFibGUpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgQ2FuJ3QgY2FsbCBEYXRhTGF5ZXIuc2F2ZUN1cnJlbnRTdGF0ZVRvRGF0YUxheWVyIG9uIHJlYWQtb25seSBEYXRhTGF5ZXIgJHt0aGlzLm5hbWV9LmApO1xuXHRcdH1cblx0XHRpZiAobGF5ZXIud3JpdGFibGUpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgQ2FuJ3QgY2FsbCBEYXRhTGF5ZXIuc2F2ZUN1cnJlbnRTdGF0ZVRvRGF0YUxheWVyIG9uIERhdGFMYXllciAke3RoaXMubmFtZX0gdXNpbmcgd3JpdGFibGUgRGF0YUxheWVyICR7bGF5ZXIubmFtZX0uYClcblx0XHR9XG5cdFx0Ly8gQ2hlY2sgdGhhdCB0ZXh0dXJlIHBhcmFtcyBhcmUgdGhlIHNhbWUuXG5cdFx0aWYgKGxheWVyLmdsV3JhcFMgIT09IHRoaXMuZ2xXcmFwUyB8fCBsYXllci5nbFdyYXBUICE9PSB0aGlzLmdsV3JhcFQgfHxcblx0XHRcdGxheWVyLndyYXBTICE9PSB0aGlzLndyYXBTIHx8IGxheWVyLndyYXBUICE9PSB0aGlzLndyYXBUIHx8XG5cdFx0XHRsYXllci53aWR0aCAhPT0gdGhpcy53aWR0aCB8fCBsYXllci5oZWlnaHQgIT09IHRoaXMuaGVpZ2h0IHx8XG5cdFx0XHRsYXllci5nbEZpbHRlciAhPT0gdGhpcy5nbEZpbHRlciB8fCBsYXllci5maWx0ZXIgIT09IHRoaXMuZmlsdGVyIHx8XG5cdFx0XHRsYXllci5nbE51bUNoYW5uZWxzICE9PSB0aGlzLmdsTnVtQ2hhbm5lbHMgfHwgbGF5ZXIubnVtQ29tcG9uZW50cyAhPT0gdGhpcy5udW1Db21wb25lbnRzIHx8XG5cdFx0XHRsYXllci5nbFR5cGUgIT09IHRoaXMuZ2xUeXBlIHx8IGxheWVyLnR5cGUgIT09IHRoaXMudHlwZSB8fFxuXHRcdFx0bGF5ZXIuZ2xGb3JtYXQgIT09IHRoaXMuZ2xGb3JtYXQgfHwgbGF5ZXIuZ2xJbnRlcm5hbEZvcm1hdCAhPT0gdGhpcy5nbEludGVybmFsRm9ybWF0KSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgSW5jb21wYXRpYmxlIHRleHR1cmUgcGFyYW1zIGJldHdlZW4gRGF0YUxheWVycyAke2xheWVyLm5hbWV9IGFuZCAke3RoaXMubmFtZX0uYCk7XG5cdFx0fVxuXG5cdFx0Ly8gSWYgd2UgaGF2ZSBub3QgYWxyZWFkeSBpbml0ZWQgb3ZlcnJpZGVzIGFycmF5LCBkbyBzbyBub3cuXG5cdFx0aWYgKCF0aGlzLnRleHR1cmVPdmVycmlkZXMpIHtcblx0XHRcdHRoaXMudGV4dHVyZU92ZXJyaWRlcyA9IFtdO1xuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm51bUJ1ZmZlcnM7IGkrKykge1xuXHRcdFx0XHR0aGlzLnRleHR1cmVPdmVycmlkZXMucHVzaCh1bmRlZmluZWQpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIENoZWNrIGlmIHdlIGFscmVhZHkgaGF2ZSBhbiBvdmVycmlkZSBpbiBwbGFjZS5cblx0XHRpZiAodGhpcy50ZXh0dXJlT3ZlcnJpZGVzW3RoaXMuX2J1ZmZlckluZGV4XSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBDYW4ndCBjYWxsIERhdGFMYXllci5zYXZlQ3VycmVudFN0YXRlVG9EYXRhTGF5ZXIgb24gRGF0YUxheWVyICR7dGhpcy5uYW1lfSwgdGhpcyBEYXRhTGF5ZXIgaGFzIG5vdCB3cml0dGVuIG5ldyBzdGF0ZSBzaW5jZSBsYXN0IGNhbGwgdG8gRGF0YUxheWVyLnNhdmVDdXJyZW50U3RhdGVUb0RhdGFMYXllci5gKTtcblx0XHR9XG5cdFx0Y29uc3QgY3VycmVudFN0YXRlID0gdGhpcy5nZXRDdXJyZW50U3RhdGVUZXh0dXJlKCk7XG5cdFx0dGhpcy50ZXh0dXJlT3ZlcnJpZGVzW3RoaXMuX2J1ZmZlckluZGV4XSA9IGN1cnJlbnRTdGF0ZTtcblx0XHQvLyBTd2FwIHRleHR1cmVzLlxuXHRcdHRoaXMuYnVmZmVyc1t0aGlzLl9idWZmZXJJbmRleF0udGV4dHVyZSA9IGxheWVyLmdldEN1cnJlbnRTdGF0ZVRleHR1cmUoKTtcblx0XHRsYXllci5fc2V0Q3VycmVudFN0YXRlVGV4dHVyZShjdXJyZW50U3RhdGUpO1xuXG5cdFx0Ly8gQmluZCBzd2FwcGVkIHRleHR1cmUgdG8gZnJhbWVidWZmZXIuXG5cdFx0Y29uc3QgeyBnbCB9ID0gdGhpcztcblx0XHRjb25zdCB7IGZyYW1lYnVmZmVyLCB0ZXh0dXJlIH0gPSB0aGlzLmJ1ZmZlcnNbdGhpcy5fYnVmZmVySW5kZXhdO1xuXHRcdGlmICghZnJhbWVidWZmZXIpIHRocm93IG5ldyBFcnJvcihgTm8gZnJhbWVidWZmZXIgZm9yIHdyaXRhYmxlIERhdGFMYXllciAke3RoaXMubmFtZX0uYCk7XG5cdFx0Z2wuYmluZEZyYW1lYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBmcmFtZWJ1ZmZlcik7XG5cdFx0Ly8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1dlYkdMUmVuZGVyaW5nQ29udGV4dC9mcmFtZWJ1ZmZlclRleHR1cmUyRFxuXHRcdGdsLmZyYW1lYnVmZmVyVGV4dHVyZTJEKGdsLkZSQU1FQlVGRkVSLCBnbC5DT0xPUl9BVFRBQ0hNRU5UMCwgZ2wuVEVYVFVSRV8yRCwgdGV4dHVyZSwgMCk7XG5cdFx0Ly8gVW5iaW5kLlxuXHRcdGdsLmJpbmRGcmFtZWJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgbnVsbCk7XG5cdH1cblxuXHRfc2V0Q3VycmVudFN0YXRlVGV4dHVyZSh0ZXh0dXJlOiBXZWJHTFRleHR1cmUpIHtcblx0XHRpZiAodGhpcy53cml0YWJsZSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBDYW4ndCBjYWxsIERhdGFMYXllci5fc2V0Q3VycmVudFN0YXRlVGV4dHVyZSBvbiB3cml0YWJsZSB0ZXh0dXJlICR7dGhpcy5uYW1lfS5gKTtcblx0XHR9XG5cdFx0dGhpcy5idWZmZXJzW3RoaXMuX2J1ZmZlckluZGV4XS50ZXh0dXJlID0gdGV4dHVyZTtcblx0fVxuXG5cdHByaXZhdGUgdmFsaWRhdGVEYXRhQXJyYXkoXG5cdFx0X2RhdGE/OiBEYXRhTGF5ZXJBcnJheVR5cGUsXG5cdCkge1xuXHRcdGlmICghX2RhdGEpe1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRjb25zdCB7IHdpZHRoLCBoZWlnaHQsIGxlbmd0aCwgbnVtQ29tcG9uZW50cywgZ2xOdW1DaGFubmVscywgdHlwZSwgaW50ZXJuYWxUeXBlLCBuYW1lIH0gPSB0aGlzO1xuXG5cdFx0Ly8gQ2hlY2sgdGhhdCBkYXRhIGlzIGNvcnJlY3QgbGVuZ3RoICh1c2VyIGVycm9yKS5cblx0XHRpZiAoKGxlbmd0aCAmJiBfZGF0YS5sZW5ndGggIT09IGxlbmd0aCAqIG51bUNvbXBvbmVudHMpIHx8ICghbGVuZ3RoICYmIF9kYXRhLmxlbmd0aCAhPT0gd2lkdGggKiBoZWlnaHQgKiBudW1Db21wb25lbnRzKSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGRhdGEgbGVuZ3RoICR7X2RhdGEubGVuZ3RofSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiIG9mIHNpemUgJHtsZW5ndGggPyBsZW5ndGggOiBgJHt3aWR0aH14JHtoZWlnaHR9YH14JHtudW1Db21wb25lbnRzfS5gKTtcblx0XHR9XG5cblx0XHQvLyBDaGVjayB0aGF0IGRhdGEgaXMgY29ycmVjdCB0eXBlICh1c2VyIGVycm9yKS5cblx0XHRsZXQgaW52YWxpZFR5cGVGb3VuZCA9IGZhbHNlO1xuXHRcdHN3aXRjaCAodHlwZSkge1xuXHRcdFx0Y2FzZSBIQUxGX0ZMT0FUOlxuXHRcdFx0XHQvLyBTaW5jZSB0aGVyZSBpcyBubyBGbG9hdDE2QXJyYXksIHdlIG11c3QgdXNlIEZsb2F0MzJBcnJheXMgdG8gaW5pdCB0ZXh0dXJlLlxuXHRcdFx0XHQvLyBDb250aW51ZSB0byBuZXh0IGNhc2UuXG5cdFx0XHRjYXNlIEZMT0FUOlxuXHRcdFx0XHRpbnZhbGlkVHlwZUZvdW5kID0gaW52YWxpZFR5cGVGb3VuZCB8fCBfZGF0YS5jb25zdHJ1Y3RvciAhPT0gRmxvYXQzMkFycmF5O1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgVU5TSUdORURfQllURTpcblx0XHRcdFx0aW52YWxpZFR5cGVGb3VuZCA9IGludmFsaWRUeXBlRm91bmQgfHwgX2RhdGEuY29uc3RydWN0b3IgIT09IFVpbnQ4QXJyYXk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBCWVRFOlxuXHRcdFx0XHRpbnZhbGlkVHlwZUZvdW5kID0gaW52YWxpZFR5cGVGb3VuZCB8fCBfZGF0YS5jb25zdHJ1Y3RvciAhPT0gSW50OEFycmF5O1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgVU5TSUdORURfU0hPUlQ6XG5cdFx0XHRcdGludmFsaWRUeXBlRm91bmQgPSBpbnZhbGlkVHlwZUZvdW5kIHx8IF9kYXRhLmNvbnN0cnVjdG9yICE9PSBVaW50MTZBcnJheTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFNIT1JUOlxuXHRcdFx0XHRpbnZhbGlkVHlwZUZvdW5kID0gaW52YWxpZFR5cGVGb3VuZCB8fCBfZGF0YS5jb25zdHJ1Y3RvciAhPT0gSW50MTZBcnJheTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFVOU0lHTkVEX0lOVDpcblx0XHRcdFx0aW52YWxpZFR5cGVGb3VuZCA9IGludmFsaWRUeXBlRm91bmQgfHwgX2RhdGEuY29uc3RydWN0b3IgIT09IFVpbnQzMkFycmF5O1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgSU5UOlxuXHRcdFx0XHRpbnZhbGlkVHlwZUZvdW5kID0gaW52YWxpZFR5cGVGb3VuZCB8fCBfZGF0YS5jb25zdHJ1Y3RvciAhPT0gSW50MzJBcnJheTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEVycm9yIGluaXRpbmcgRGF0YUxheWVyIFwiJHtuYW1lfVwiLiAgVW5zdXBwb3J0ZWQgdHlwZSBcIiR7dHlwZX1cIiBmb3IgV2ViR0xDb21wdXRlLmluaXREYXRhTGF5ZXIuYCk7XG5cdFx0fVxuXHRcdGlmIChpbnZhbGlkVHlwZUZvdW5kKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgVHlwZWRBcnJheSBvZiB0eXBlICR7KF9kYXRhLmNvbnN0cnVjdG9yIGFzIGFueSkubmFtZX0gc3VwcGxpZWQgdG8gRGF0YUxheWVyIFwiJHtuYW1lfVwiIG9mIHR5cGUgXCIke3R5cGV9XCIuYCk7XG5cdFx0fVxuXG5cdFx0bGV0IGRhdGEgPSBfZGF0YTtcblx0XHRjb25zdCBpbWFnZVNpemUgPSB3aWR0aCAqIGhlaWdodCAqIGdsTnVtQ2hhbm5lbHM7XG5cdFx0Ly8gVGhlbiBjaGVjayBpZiBhcnJheSBuZWVkcyB0byBiZSBsZW5ndGhlbmVkLlxuXHRcdC8vIFRoaXMgY291bGQgYmUgYmVjYXVzZSBnbE51bUNoYW5uZWxzICE9PSBudW1Db21wb25lbnRzLlxuXHRcdC8vIE9yIGJlY2F1c2UgbGVuZ3RoICE9PSB3aWR0aCAqIGhlaWdodC5cblx0XHRjb25zdCBpbmNvcnJlY3RTaXplID0gZGF0YS5sZW5ndGggIT09IGltYWdlU2l6ZTtcblx0XHQvLyBXZSBoYXZlIHRvIGhhbmRsZSB0aGUgY2FzZSBvZiBGbG9hdDE2IHNwZWNpYWxseSBieSBjb252ZXJ0aW5nIGRhdGEgdG8gVWludDE2QXJyYXkuXG5cdFx0Y29uc3QgaGFuZGxlRmxvYXQxNiA9IGludGVybmFsVHlwZSA9PT0gSEFMRl9GTE9BVDtcblx0XHQvLyBGb3Igd2ViZ2wxLjAgd2UgbWF5IG5lZWQgdG8gY2FzdCBhbiBpbnQgdHlwZSB0byBhIEZMT0FUIG9yIEhBTEZfRkxPQVQuXG5cdFx0Y29uc3Qgc2hvdWxkVHlwZUNhc3QgPSB0eXBlICE9PSBpbnRlcm5hbFR5cGU7XG5cblx0XHRpZiAoc2hvdWxkVHlwZUNhc3QgfHwgaW5jb3JyZWN0U2l6ZSB8fCBoYW5kbGVGbG9hdDE2KSB7XG5cdFx0XHRzd2l0Y2ggKGludGVybmFsVHlwZSkge1xuXHRcdFx0XHRjYXNlIEhBTEZfRkxPQVQ6XG5cdFx0XHRcdFx0ZGF0YSA9IG5ldyBVaW50MTZBcnJheShpbWFnZVNpemUpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIEZMT0FUOlxuXHRcdFx0XHRcdGRhdGEgPSBuZXcgRmxvYXQzMkFycmF5KGltYWdlU2l6ZSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgVU5TSUdORURfQllURTpcblx0XHRcdFx0XHRkYXRhID0gbmV3IFVpbnQ4QXJyYXkoaW1hZ2VTaXplKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBCWVRFOlxuXHRcdFx0XHRcdGRhdGEgPSBuZXcgSW50OEFycmF5KGltYWdlU2l6ZSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgVU5TSUdORURfU0hPUlQ6XG5cdFx0XHRcdFx0ZGF0YSA9IG5ldyBVaW50MTZBcnJheShpbWFnZVNpemUpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFNIT1JUOlxuXHRcdFx0XHRcdGRhdGEgPSBuZXcgSW50MTZBcnJheShpbWFnZVNpemUpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFVOU0lHTkVEX0lOVDpcblx0XHRcdFx0XHRkYXRhID0gbmV3IFVpbnQzMkFycmF5KGltYWdlU2l6ZSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgSU5UOlxuXHRcdFx0XHRcdGRhdGEgPSBuZXcgSW50MzJBcnJheShpbWFnZVNpemUpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEVycm9yIGluaXRpbmcgJHtuYW1lfS4gIFVuc3VwcG9ydGVkIGludGVybmFsVHlwZSAke2ludGVybmFsVHlwZX0gZm9yIFdlYkdMQ29tcHV0ZS5pbml0RGF0YUxheWVyLmApO1xuXHRcdFx0fVxuXHRcdFx0Ly8gRmlsbCBuZXcgZGF0YSBhcnJheSB3aXRoIG9sZCBkYXRhLlxuXHRcdFx0Y29uc3QgdmlldyA9IGhhbmRsZUZsb2F0MTYgPyBuZXcgRGF0YVZpZXcoZGF0YS5idWZmZXIpIDogbnVsbDtcblx0XHRcdGZvciAobGV0IGkgPSAwLCBfbGVuID0gX2RhdGEubGVuZ3RoIC8gbnVtQ29tcG9uZW50czsgaSA8IF9sZW47IGkrKykge1xuXHRcdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IG51bUNvbXBvbmVudHM7IGorKykge1xuXHRcdFx0XHRcdGNvbnN0IHZhbHVlID0gX2RhdGFbaSAqIG51bUNvbXBvbmVudHMgKyBqXTtcblx0XHRcdFx0XHRjb25zdCBpbmRleCA9IGkgKiBnbE51bUNoYW5uZWxzICsgajtcblx0XHRcdFx0XHRpZiAoaGFuZGxlRmxvYXQxNikge1xuXHRcdFx0XHRcdFx0c2V0RmxvYXQxNih2aWV3ISwgMiAqIGluZGV4LCB2YWx1ZSwgdHJ1ZSk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGRhdGFbaW5kZXhdID0gdmFsdWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGRhdGE7XG5cdH1cblxuXHRwcml2YXRlIGluaXRCdWZmZXJzKFxuXHRcdF9kYXRhPzogRGF0YUxheWVyQXJyYXlUeXBlLFxuXHQpIHtcblx0XHRjb25zdCB7XG5cdFx0XHRuYW1lLFxuXHRcdFx0bnVtQnVmZmVycyxcblx0XHRcdGdsLFxuXHRcdFx0d2lkdGgsXG5cdFx0XHRoZWlnaHQsXG5cdFx0XHRnbEludGVybmFsRm9ybWF0LFxuXHRcdFx0Z2xGb3JtYXQsXG5cdFx0XHRnbFR5cGUsXG5cdFx0XHRnbEZpbHRlcixcblx0XHRcdGdsV3JhcFMsXG5cdFx0XHRnbFdyYXBULFxuXHRcdFx0d3JpdGFibGUsXG5cdFx0XHRlcnJvckNhbGxiYWNrLFxuXHRcdH0gPSB0aGlzO1xuXG5cdFx0Y29uc3QgZGF0YSA9IHRoaXMudmFsaWRhdGVEYXRhQXJyYXkoX2RhdGEpO1xuXG5cdFx0Ly8gSW5pdCBhIHRleHR1cmUgZm9yIGVhY2ggYnVmZmVyLlxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbnVtQnVmZmVyczsgaSsrKSB7XG5cdFx0XHRjb25zdCB0ZXh0dXJlID0gZ2wuY3JlYXRlVGV4dHVyZSgpO1xuXHRcdFx0aWYgKCF0ZXh0dXJlKSB7XG5cdFx0XHRcdGVycm9yQ2FsbGJhY2soYENvdWxkIG5vdCBpbml0IHRleHR1cmUgZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIjogJHtnbC5nZXRFcnJvcigpfS5gKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgdGV4dHVyZSk7XG5cblx0XHRcdC8vIFRPRE86IGFyZSB0aGVyZSBvdGhlciBwYXJhbXMgdG8gbG9vayBpbnRvOlxuXHRcdFx0Ly8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1dlYkdMUmVuZGVyaW5nQ29udGV4dC90ZXhQYXJhbWV0ZXJcblx0XHRcdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1MsIGdsV3JhcFMpO1xuXHRcdFx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfVCwgZ2xXcmFwVCk7XG5cdFx0XHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgZ2xGaWx0ZXIpO1xuXHRcdFx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01BR19GSUxURVIsIGdsRmlsdGVyKTtcblxuXHRcdFx0Z2wudGV4SW1hZ2UyRChnbC5URVhUVVJFXzJELCAwLCBnbEludGVybmFsRm9ybWF0LCB3aWR0aCwgaGVpZ2h0LCAwLCBnbEZvcm1hdCwgZ2xUeXBlLCBkYXRhID8gZGF0YSA6IG51bGwpO1xuXHRcdFx0XG5cdFx0XHRjb25zdCBidWZmZXI6IERhdGFMYXllckJ1ZmZlciA9IHtcblx0XHRcdFx0dGV4dHVyZSxcblx0XHRcdH07XG5cblx0XHRcdGlmICh3cml0YWJsZSkge1xuXHRcdFx0XHQvLyBJbml0IGEgZnJhbWVidWZmZXIgZm9yIHRoaXMgdGV4dHVyZSBzbyB3ZSBjYW4gd3JpdGUgdG8gaXQuXG5cdFx0XHRcdGNvbnN0IGZyYW1lYnVmZmVyID0gZ2wuY3JlYXRlRnJhbWVidWZmZXIoKTtcblx0XHRcdFx0aWYgKCFmcmFtZWJ1ZmZlcikge1xuXHRcdFx0XHRcdGVycm9yQ2FsbGJhY2soYENvdWxkIG5vdCBpbml0IGZyYW1lYnVmZmVyIGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCI6ICR7Z2wuZ2V0RXJyb3IoKX0uYCk7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGdsLmJpbmRGcmFtZWJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgZnJhbWVidWZmZXIpO1xuXHRcdFx0XHQvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvV2ViR0xSZW5kZXJpbmdDb250ZXh0L2ZyYW1lYnVmZmVyVGV4dHVyZTJEXG5cdFx0XHRcdGdsLmZyYW1lYnVmZmVyVGV4dHVyZTJEKGdsLkZSQU1FQlVGRkVSLCBnbC5DT0xPUl9BVFRBQ0hNRU5UMCwgZ2wuVEVYVFVSRV8yRCwgdGV4dHVyZSwgMCk7XG5cblx0XHRcdFx0Y29uc3Qgc3RhdHVzID0gZ2wuY2hlY2tGcmFtZWJ1ZmZlclN0YXR1cyhnbC5GUkFNRUJVRkZFUik7XG5cdFx0XHRcdGlmKHN0YXR1cyAhPSBnbC5GUkFNRUJVRkZFUl9DT01QTEVURSl7XG5cdFx0XHRcdFx0ZXJyb3JDYWxsYmFjayhgSW52YWxpZCBzdGF0dXMgZm9yIGZyYW1lYnVmZmVyIGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCI6ICR7c3RhdHVzfS5gKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIEFkZCBmcmFtZWJ1ZmZlci5cblx0XHRcdFx0YnVmZmVyLmZyYW1lYnVmZmVyID0gZnJhbWVidWZmZXI7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdC8vIFNhdmUgdGhpcyBidWZmZXIgdG8gdGhlIGxpc3QuXG5cdFx0XHR0aGlzLmJ1ZmZlcnMucHVzaChidWZmZXIpO1xuXHRcdH1cblx0XHQvLyBVbmJpbmQuXG5cdFx0Z2wuYmluZEZyYW1lYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBudWxsKTtcblx0fVxuXG5cdGdldEN1cnJlbnRTdGF0ZVRleHR1cmUoKSB7XG5cdFx0aWYgKHRoaXMudGV4dHVyZU92ZXJyaWRlcyAmJiB0aGlzLnRleHR1cmVPdmVycmlkZXNbdGhpcy5fYnVmZmVySW5kZXhdKSByZXR1cm4gdGhpcy50ZXh0dXJlT3ZlcnJpZGVzW3RoaXMuX2J1ZmZlckluZGV4XSE7XG5cdFx0cmV0dXJuIHRoaXMuYnVmZmVyc1t0aGlzLl9idWZmZXJJbmRleF0udGV4dHVyZTtcblx0fVxuXG5cdGdldFByZXZpb3VzU3RhdGVUZXh0dXJlKGluZGV4ID0gLTEpIHtcblx0XHRpZiAodGhpcy5udW1CdWZmZXJzID09PSAxKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBjYWxsIGdldFByZXZpb3VzU3RhdGVUZXh0dXJlIG9uIERhdGFMYXllciBcIiR7dGhpcy5uYW1lfVwiIHdpdGggb25seSBvbmUgYnVmZmVyLmApO1xuXHRcdH1cblx0XHRjb25zdCBwcmV2aW91c0luZGV4ID0gdGhpcy5fYnVmZmVySW5kZXggKyBpbmRleCArIHRoaXMubnVtQnVmZmVycztcblx0XHRpZiAocHJldmlvdXNJbmRleCA8IDAgfHwgcHJldmlvdXNJbmRleCA+PSB0aGlzLm51bUJ1ZmZlcnMpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBpbmRleCAke2luZGV4fSBwYXNzZWQgdG8gZ2V0UHJldmlvdXNTdGF0ZVRleHR1cmUgb24gRGF0YUxheWVyICR7dGhpcy5uYW1lfSB3aXRoICR7dGhpcy5udW1CdWZmZXJzfSBidWZmZXJzLmApO1xuXHRcdH1cblx0XHRpZiAodGhpcy50ZXh0dXJlT3ZlcnJpZGVzICYmIHRoaXMudGV4dHVyZU92ZXJyaWRlc1twcmV2aW91c0luZGV4XSkgcmV0dXJuIHRoaXMudGV4dHVyZU92ZXJyaWRlc1twcmV2aW91c0luZGV4XSE7XG5cdFx0cmV0dXJuIHRoaXMuYnVmZmVyc1twcmV2aW91c0luZGV4XS50ZXh0dXJlO1xuXHR9XG5cblx0X3VzaW5nVGV4dHVyZU92ZXJyaWRlRm9yQ3VycmVudEJ1ZmZlcigpIHtcblx0XHRyZXR1cm4gdGhpcy50ZXh0dXJlT3ZlcnJpZGVzICYmIHRoaXMudGV4dHVyZU92ZXJyaWRlc1t0aGlzLmJ1ZmZlckluZGV4XTtcblx0fVxuXG5cdF9iaW5kT3V0cHV0QnVmZmVyRm9yV3JpdGUoXG5cdFx0aW5jcmVtZW50QnVmZmVySW5kZXg6IGJvb2xlYW4sXG5cdCkge1xuXHRcdGNvbnN0IHsgZ2wgfSA9IHRoaXM7XG5cdFx0aWYgKGluY3JlbWVudEJ1ZmZlckluZGV4KSB7XG5cdFx0XHQvLyBJbmNyZW1lbnQgYnVmZmVySW5kZXguXG5cdFx0XHR0aGlzLl9idWZmZXJJbmRleCA9ICh0aGlzLl9idWZmZXJJbmRleCArIDEpICUgdGhpcy5udW1CdWZmZXJzO1xuXHRcdH1cblx0XHR0aGlzLl9iaW5kT3V0cHV0QnVmZmVyKCk7XG5cblx0XHQvLyBXZSBhcmUgZ29pbmcgdG8gZG8gYSBkYXRhIHdyaXRlLCBpZiB3ZSBoYXZlIG92ZXJyaWRlcyBlbmFibGVkLCB3ZSBjYW4gcmVtb3ZlIHRoZW0uXG5cdFx0aWYgKHRoaXMudGV4dHVyZU92ZXJyaWRlcykge1xuXHRcdFx0dGhpcy50ZXh0dXJlT3ZlcnJpZGVzW3RoaXMuX2J1ZmZlckluZGV4XSA9IHVuZGVmaW5lZDtcblx0XHR9XG5cdH1cblxuXHRfYmluZE91dHB1dEJ1ZmZlcigpIHtcblx0XHRjb25zdCB7IGdsIH0gPSB0aGlzO1xuXHRcdGNvbnN0IHsgZnJhbWVidWZmZXIgfSA9IHRoaXMuYnVmZmVyc1t0aGlzLl9idWZmZXJJbmRleF07XG5cdFx0aWYgKCFmcmFtZWJ1ZmZlcikge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBEYXRhTGF5ZXIgXCIke3RoaXMubmFtZX1cIiBpcyBub3Qgd3JpdGFibGUuYCk7XG5cdFx0fVxuXHRcdGdsLmJpbmRGcmFtZWJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgZnJhbWVidWZmZXIpO1xuXHR9XG5cblx0c2V0RGF0YShkYXRhOiBEYXRhTGF5ZXJBcnJheVR5cGUpIHtcblx0XHQvLyBUT0RPOiBSYXRoZXIgdGhhbiBkZXN0cm95aW5nIGJ1ZmZlcnMsIHdlIGNvdWxkIHdyaXRlIHRvIGNlcnRhaW4gd2luZG93LlxuXHRcdHRoaXMuZGVzdHJveUJ1ZmZlcnMoKTtcblx0XHR0aGlzLmluaXRCdWZmZXJzKGRhdGEpO1xuXHR9XG5cblx0cmVzaXplKFxuXHRcdGRpbWVuc2lvbnM6IG51bWJlciB8IFtudW1iZXIsIG51bWJlcl0sXG5cdFx0ZGF0YT86IERhdGFMYXllckFycmF5VHlwZSxcblx0KSB7XG5cdFx0Y29uc3QgeyBsZW5ndGgsIHdpZHRoLCBoZWlnaHQgfSA9IERhdGFMYXllci5jYWxjU2l6ZShkaW1lbnNpb25zLCB0aGlzLm5hbWUpO1xuXHRcdHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xuXHRcdHRoaXMud2lkdGggPSB3aWR0aDtcblx0XHR0aGlzLmhlaWdodCA9IGhlaWdodDtcblx0XHR0aGlzLmRlc3Ryb3lCdWZmZXJzKCk7XG5cdFx0dGhpcy5pbml0QnVmZmVycyhkYXRhKTtcblx0fVxuXG5cdGNsZWFyKCkge1xuXHRcdC8vIFJlc2V0IGV2ZXJ5dGhpbmcgdG8gemVyby5cblx0XHQvLyBUT0RPOiBUaGlzIGlzIG5vdCB0aGUgbW9zdCBlZmZpY2llbnQgd2F5IHRvIGRvIHRoaXMgKHJlYWxsb2NhdGluZyBhbGwgdGV4dHVyZXMgYW5kIGZyYW1lYnVmZmVycyksIGJ1dCBvayBmb3Igbm93LlxuXHRcdHRoaXMuZGVzdHJveUJ1ZmZlcnMoKTtcblx0XHR0aGlzLmluaXRCdWZmZXJzKCk7XG5cdH1cblxuXHRnZXREaW1lbnNpb25zKCkge1xuXHRcdHJldHVybiBbXG5cdFx0XHR0aGlzLndpZHRoLFxuXHRcdFx0dGhpcy5oZWlnaHQsXG5cdFx0XSBhcyBbbnVtYmVyLCBudW1iZXJdO1xuXHR9XG5cblx0Z2V0TGVuZ3RoKCkge1xuXHRcdGlmICghdGhpcy5sZW5ndGgpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGNhbGwgZ2V0TGVuZ3RoKCkgb24gMkQgRGF0YUxheWVyIFwiJHt0aGlzLm5hbWV9XCIuYCk7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLmxlbmd0aDtcblx0fVxuXG5cdHByaXZhdGUgZGVzdHJveUJ1ZmZlcnMoKSB7XG5cdFx0Y29uc3QgeyBnbCwgYnVmZmVycyB9ID0gdGhpcztcblx0XHRidWZmZXJzLmZvckVhY2goYnVmZmVyID0+IHtcblx0XHRcdGNvbnN0IHsgZnJhbWVidWZmZXIsIHRleHR1cmUgfSA9IGJ1ZmZlcjtcblx0XHRcdGdsLmRlbGV0ZVRleHR1cmUodGV4dHVyZSk7XG5cdFx0XHRpZiAoZnJhbWVidWZmZXIpIHtcblx0XHRcdFx0Z2wuZGVsZXRlRnJhbWVidWZmZXIoZnJhbWVidWZmZXIpO1xuXHRcdFx0fVxuXHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0ZGVsZXRlIGJ1ZmZlci50ZXh0dXJlO1xuXHRcdFx0ZGVsZXRlIGJ1ZmZlci5mcmFtZWJ1ZmZlcjtcblx0XHR9KTtcblx0XHRidWZmZXJzLmxlbmd0aCA9IDA7XG5cblx0XHQvLyBUaGVzZSBhcmUgdGVjaG5pY2FsbHkgb3duZWQgYnkgYW5vdGhlciBEYXRhTGF5ZXIsXG5cdFx0Ly8gc28gd2UgYXJlIG5vdCByZXNwb25zaWJsZSBmb3IgZGVsZXRpbmcgdGhlbSBmcm9tIGdsIGNvbnRleHQuXG5cdFx0ZGVsZXRlIHRoaXMudGV4dHVyZU92ZXJyaWRlcztcblx0fVxuXG5cdGRlc3Ryb3koKSB7XG5cdFx0dGhpcy5kZXN0cm95QnVmZmVycygpO1xuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHRkZWxldGUgdGhpcy5nbDtcblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0ZGVsZXRlIHRoaXMuZXJyb3JDYWxsYmFjaztcblx0fVxufVxuIiwiaW1wb3J0IHsgaXNBcnJheSwgaXNJbnRlZ2VyLCBpc051bWJlciwgaXNTdHJpbmcgfSBmcm9tICcuL0NoZWNrcyc7XG5pbXBvcnQge1xuXHRGTE9BVCxcblx0RkxPQVRfMURfVU5JRk9STSwgRkxPQVRfMkRfVU5JRk9STSwgRkxPQVRfM0RfVU5JRk9STSwgRkxPQVRfNERfVU5JRk9STSxcblx0R0xTTDMsXG5cdEdMU0xWZXJzaW9uLFxuXHRJTlQsXG5cdElOVF8xRF9VTklGT1JNLCBJTlRfMkRfVU5JRk9STSwgSU5UXzNEX1VOSUZPUk0sIElOVF80RF9VTklGT1JNLFxuXHRVbmlmb3JtLCBVbmlmb3JtRGF0YVR5cGUsIFVuaWZvcm1UeXBlLCBVbmlmb3JtVmFsdWVUeXBlLFxufSBmcm9tICcuL0NvbnN0YW50cyc7XG5pbXBvcnQgeyBjb21waWxlU2hhZGVyIH0gZnJvbSAnLi91dGlscyc7XG5cbmNvbnN0IERFRkFVTFRfUFJPR1JBTV9OQU1FID0gJ0RFRkFVTFQnO1xuY29uc3QgREVGQVVMVF9XX1VWX1BST0dSQU1fTkFNRSA9ICdERUZBVUxUX1dfVVYnO1xuY29uc3QgREVGQVVMVF9XX05PUk1BTF9QUk9HUkFNX05BTUUgPSAnREVGQVVMVF9XX05PUk1BTCc7XG5jb25zdCBERUZBVUxUX1dfVVZfTk9STUFMX1BST0dSQU1fTkFNRSA9ICdERUZBVUxUX1dfVVZfTk9STUFMJztcbmNvbnN0IFNFR01FTlRfUFJPR1JBTV9OQU1FID0gJ1NFR01FTlQnO1xuY29uc3QgREFUQV9MQVlFUl9QT0lOVFNfUFJPR1JBTV9OQU1FID0gJ0RBVEFfTEFZRVJfUE9JTlRTJztcbmNvbnN0IERBVEFfTEFZRVJfTElORVNfUFJPR1JBTV9OQU1FID0gJ0RBVEFfTEFZRVJfTElORVMnO1xuY29uc3QgREFUQV9MQVlFUl9WRUNUT1JfRklFTERfUFJPR1JBTV9OQU1FID0gJ0RBVEFfTEFZRVJfVkVDVE9SX0ZJRUxEJztcbnR5cGUgUFJPR1JBTV9OQU1FUyA9XG5cdHR5cGVvZiBERUZBVUxUX1BST0dSQU1fTkFNRSB8XG5cdHR5cGVvZiBERUZBVUxUX1dfVVZfUFJPR1JBTV9OQU1FIHxcblx0dHlwZW9mIERFRkFVTFRfV19OT1JNQUxfUFJPR1JBTV9OQU1FIHxcblx0dHlwZW9mIERFRkFVTFRfV19VVl9OT1JNQUxfUFJPR1JBTV9OQU1FIHxcblx0dHlwZW9mIFNFR01FTlRfUFJPR1JBTV9OQU1FIHxcblx0dHlwZW9mIERBVEFfTEFZRVJfUE9JTlRTX1BST0dSQU1fTkFNRSB8XG5cdHR5cGVvZiBEQVRBX0xBWUVSX0xJTkVTX1BST0dSQU1fTkFNRSB8XG5cdHR5cGVvZiBEQVRBX0xBWUVSX1ZFQ1RPUl9GSUVMRF9QUk9HUkFNX05BTUU7XG5cbmNvbnN0IHZlcnRleFNoYWRlcnM6IHtba2V5IGluIFBST0dSQU1fTkFNRVNdOiB7XG5cdHNyY18xOiBzdHJpbmcsXG5cdHNyY18zOiBzdHJpbmcsXG5cdHNoYWRlcj86IFdlYkdMUHJvZ3JhbSxcblx0ZGVmaW5lcz86IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9LFxufX0gPSB7XG5cdFtERUZBVUxUX1BST0dSQU1fTkFNRV06IHtcblx0XHRzcmNfMTogJy4vZ2xzbF8xL0RlZmF1bHRWZXJ0ZXhTaGFkZXIuZ2xzbCcsXG5cdFx0c3JjXzM6ICcuL2dsc2xfMy9EZWZhdWx0VmVydGV4U2hhZGVyLmdsc2wnLFxuXHR9LFxuXHRbREVGQVVMVF9XX1VWX1BST0dSQU1fTkFNRV06IHtcblx0XHRzcmNfMTogJy4vZ2xzbF8xL0RlZmF1bHRWZXJ0ZXhTaGFkZXIuZ2xzbCcsXG5cdFx0c3JjXzM6ICcuL2dsc2xfMy9EZWZhdWx0VmVydGV4U2hhZGVyLmdsc2wnLFxuXHRcdGRlZmluZXM6IHtcblx0XHRcdCdVVl9BVFRSSUJVVEUnOiAnMScsXG5cdFx0fSxcblx0fSxcblx0W0RFRkFVTFRfV19OT1JNQUxfUFJPR1JBTV9OQU1FXToge1xuXHRcdHNyY18xOiAnLi9nbHNsXzEvRGVmYXVsdFZlcnRleFNoYWRlci5nbHNsJyxcblx0XHRzcmNfMzogJy4vZ2xzbF8zL0RlZmF1bHRWZXJ0ZXhTaGFkZXIuZ2xzbCcsXG5cdFx0ZGVmaW5lczoge1xuXHRcdFx0J05PUk1BTF9BVFRSSUJVVEUnOiAnMScsXG5cdFx0fSxcblx0fSxcblx0W0RFRkFVTFRfV19VVl9OT1JNQUxfUFJPR1JBTV9OQU1FXToge1xuXHRcdHNyY18xOiAnLi9nbHNsXzEvRGVmYXVsdFZlcnRleFNoYWRlci5nbHNsJyxcblx0XHRzcmNfMzogJy4vZ2xzbF8zL0RlZmF1bHRWZXJ0ZXhTaGFkZXIuZ2xzbCcsXG5cdFx0ZGVmaW5lczoge1xuXHRcdFx0J1VWX0FUVFJJQlVURSc6ICcxJyxcblx0XHRcdCdOT1JNQUxfQVRUUklCVVRFJzogJzEnLFxuXHRcdH0sXG5cdH0sXG5cdFtTRUdNRU5UX1BST0dSQU1fTkFNRV06IHtcblx0XHRzcmNfMTogJy4vZ2xzbF8xL1NlZ21lbnRWZXJ0ZXhTaGFkZXIuZ2xzbCcsXG5cdFx0c3JjXzM6ICcuL2dsc2xfMy9TZWdtZW50VmVydGV4U2hhZGVyLmdsc2wnLFxuXHR9LFxuXHRbREFUQV9MQVlFUl9QT0lOVFNfUFJPR1JBTV9OQU1FXToge1xuXHRcdHNyY18xOiAnLi9nbHNsXzEvRGF0YUxheWVyUG9pbnRzVmVydGV4U2hhZGVyLmdsc2wnLFxuXHRcdHNyY18zOiAnLi9nbHNsXzMvRGF0YUxheWVyUG9pbnRzVmVydGV4U2hhZGVyLmdsc2wnLFxuXHR9LFxuXHRbREFUQV9MQVlFUl9WRUNUT1JfRklFTERfUFJPR1JBTV9OQU1FXToge1xuXHRcdHNyY18xOiAnLi9nbHNsXzEvRGF0YUxheWVyVmVjdG9yRmllbGRWZXJ0ZXhTaGFkZXIuZ2xzbCcsXG5cdFx0c3JjXzM6ICcuL2dsc2xfMy9EYXRhTGF5ZXJWZWN0b3JGaWVsZFZlcnRleFNoYWRlci5nbHNsJyxcblx0fSxcblx0W0RBVEFfTEFZRVJfTElORVNfUFJPR1JBTV9OQU1FXToge1xuXHRcdHNyY18xOiAnLi9nbHNsXzEvRGF0YUxheWVyTGluZXNWZXJ0ZXhTaGFkZXIuZ2xzbCcsXG5cdFx0c3JjXzM6ICcuL2dsc2xfMy9EYXRhTGF5ZXJMaW5lc1ZlcnRleFNoYWRlci5nbHNsJyxcblx0fSxcbn07XG5cbmV4cG9ydCBjbGFzcyBHUFVQcm9ncmFtIHtcblx0cmVhZG9ubHkgbmFtZTogc3RyaW5nO1xuXHRwcml2YXRlIHJlYWRvbmx5IGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQgfCBXZWJHTDJSZW5kZXJpbmdDb250ZXh0O1xuXHRwcml2YXRlIHJlYWRvbmx5IGVycm9yQ2FsbGJhY2s6IChtZXNzYWdlOiBzdHJpbmcpID0+IHZvaWQ7XG5cdHByaXZhdGUgcmVhZG9ubHkgZ2xzbFZlcnNpb246IEdMU0xWZXJzaW9uO1xuXHRwcml2YXRlIHJlYWRvbmx5IHVuaWZvcm1zOiB7IFsga2V5OiBzdHJpbmddOiBVbmlmb3JtIH0gPSB7fTtcblx0cHJpdmF0ZSByZWFkb25seSBmcmFnbWVudFNoYWRlciE6IFdlYkdMU2hhZGVyO1xuXHQvLyBTdG9yZSBnbCBwcm9ncmFtcy5cblx0cHJpdmF0ZSBwcm9ncmFtczoge1trZXkgaW4gUFJPR1JBTV9OQU1FU10/OiBXZWJHTFByb2dyYW0gfSA9IHt9O1xuXG5cdGNvbnN0cnVjdG9yKFxuXHRcdHBhcmFtczoge1xuXHRcdFx0Z2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCB8IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQsXG5cdFx0XHRuYW1lOiBzdHJpbmcsXG5cdFx0XHRmcmFnbWVudFNoYWRlcjogc3RyaW5nIHwgc3RyaW5nW10gfCBXZWJHTFNoYWRlciwvLyBXZSBtYXkgd2FudCB0byBwYXNzIGluIGFuIGFycmF5IG9mIHNoYWRlciBzdHJpbmcgc291cmNlcywgaWYgc3BsaXQgYWNyb3NzIHNldmVyYWwgZmlsZXMuXG5cdFx0XHRlcnJvckNhbGxiYWNrOiAobWVzc2FnZTogc3RyaW5nKSA9PiB2b2lkLFxuXHRcdFx0Z2xzbFZlcnNpb246IEdMU0xWZXJzaW9uLFxuXHRcdFx0dW5pZm9ybXM/OiB7XG5cdFx0XHRcdG5hbWU6IHN0cmluZyxcblx0XHRcdFx0dmFsdWU6IFVuaWZvcm1WYWx1ZVR5cGUsXG5cdFx0XHRcdGRhdGFUeXBlOiBVbmlmb3JtRGF0YVR5cGUsXG5cdFx0XHR9W10sXG5cdFx0XHRkZWZpbmVzPzogey8vIFdlJ2xsIGFsbG93IHNvbWUgdmFyaWFibGVzIHRvIGJlIHBhc3NlZCBpbiBhcyAjZGVmaW5lIHRvIHRoZSBwcmVwcm9jZXNzb3IgZm9yIHRoZSBmcmFnbWVudCBzaGFkZXIuXG5cdFx0XHRcdFtrZXk6IHN0cmluZ106IHN0cmluZywgLy8gV2UnbGwgZG8gdGhlc2UgYXMgc3RyaW5ncyB0byBtYWtlIGl0IGVhc2llciB0byBjb250cm9sIGZsb2F0IHZzIGludC5cblx0XHRcdH0sXG5cdFx0fSxcblx0XHRcblx0KSB7XG5cdFx0Y29uc3QgeyBnbCwgZXJyb3JDYWxsYmFjaywgbmFtZSwgZnJhZ21lbnRTaGFkZXIsIGdsc2xWZXJzaW9uLCB1bmlmb3JtcywgZGVmaW5lcyB9ID0gcGFyYW1zO1xuXG5cdFx0Ly8gU2F2ZSBhcmd1bWVudHMuXG5cdFx0dGhpcy5nbCA9IGdsO1xuXHRcdHRoaXMuZXJyb3JDYWxsYmFjayA9IGVycm9yQ2FsbGJhY2s7XG5cdFx0dGhpcy5uYW1lID0gbmFtZTtcblx0XHR0aGlzLmdsc2xWZXJzaW9uID0gZ2xzbFZlcnNpb247XG5cblx0XHQvLyBDb21waWxlIGZyYWdtZW50IHNoYWRlci5cblx0XHRpZiAodHlwZW9mKGZyYWdtZW50U2hhZGVyKSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mKChmcmFnbWVudFNoYWRlciBhcyBzdHJpbmdbXSlbMF0pID09PSAnc3RyaW5nJykge1xuXHRcdFx0bGV0IHNvdXJjZVN0cmluZyA9IHR5cGVvZihmcmFnbWVudFNoYWRlcikgPT09ICdzdHJpbmcnID9cblx0XHRcdFx0ZnJhZ21lbnRTaGFkZXIgOlxuXHRcdFx0XHQoZnJhZ21lbnRTaGFkZXIgYXMgc3RyaW5nW10pLmpvaW4oJ1xcbicpO1xuXHRcdFx0aWYgKGRlZmluZXMpIHtcblx0XHRcdFx0c291cmNlU3RyaW5nID0gR1BVUHJvZ3JhbS5jb252ZXJ0RGVmaW5lc1RvU3RyaW5nKGRlZmluZXMpICsgc291cmNlU3RyaW5nO1xuXHRcdFx0fVxuXHRcdFx0Y29uc3Qgc2hhZGVyID0gY29tcGlsZVNoYWRlcihnbCwgZXJyb3JDYWxsYmFjaywgc291cmNlU3RyaW5nLCBnbC5GUkFHTUVOVF9TSEFERVIsIG5hbWUpO1xuXHRcdFx0aWYgKCFzaGFkZXIpIHtcblx0XHRcdFx0ZXJyb3JDYWxsYmFjayhgVW5hYmxlIHRvIGNvbXBpbGUgZnJhZ21lbnQgc2hhZGVyIGZvciBwcm9ncmFtIFwiJHtuYW1lfVwiLmApO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHR0aGlzLmZyYWdtZW50U2hhZGVyID0gc2hhZGVyO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoZGVmaW5lcykge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byBhdHRhY2ggZGVmaW5lcyB0byBwcm9ncmFtIFwiJHtuYW1lfVwiIGJlY2F1c2UgZnJhZ21lbnQgc2hhZGVyIGlzIGFscmVhZHkgY29tcGlsZWQuYCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKHVuaWZvcm1zKSB7XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHVuaWZvcm1zPy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRjb25zdCB7IG5hbWUsIHZhbHVlLCBkYXRhVHlwZSB9ID0gdW5pZm9ybXNbaV07XG5cdFx0XHRcdHRoaXMuc2V0VW5pZm9ybShuYW1lLCB2YWx1ZSwgZGF0YVR5cGUpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgc3RhdGljIGNvbnZlcnREZWZpbmVzVG9TdHJpbmcoZGVmaW5lczoge1trZXk6IHN0cmluZ106IHN0cmluZ30pIHtcblx0XHRsZXQgZGVmaW5lc1NvdXJjZSA9ICcnO1xuXHRcdGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhkZWZpbmVzKTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGNvbnN0IGtleSA9IGtleXNbaV07XG5cdFx0XHQvLyBDaGVjayB0aGF0IGRlZmluZSBpcyBwYXNzZWQgaW4gYXMgYSBzdHJpbmcuXG5cdFx0XHRpZiAoIWlzU3RyaW5nKGtleSkgfHwgIWlzU3RyaW5nKGRlZmluZXNba2V5XSkpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBHUFVQcm9ncmFtIGRlZmluZXMgbXVzdCBiZSBwYXNzZWQgaW4gYXMga2V5IHZhbHVlIHBhaXJzIHRoYXQgYXJlIGJvdGggc3RyaW5ncywgZ290IGtleSB2YWx1ZSBwYWlyIG9mIHR5cGUgJHt0eXBlb2Yga2V5fSA6ICR7dHlwZW9mIGRlZmluZXNba2V5XX0uYClcblx0XHRcdH1cblx0XHRcdGRlZmluZXNTb3VyY2UgKz0gYCNkZWZpbmUgJHtrZXl9ICR7ZGVmaW5lc1trZXldfVxcbmA7XG5cdFx0fVxuXHRcdHJldHVybiBkZWZpbmVzU291cmNlO1xuXHR9XG5cblx0cHJpdmF0ZSBpbml0UHJvZ3JhbSh2ZXJ0ZXhTaGFkZXI6IFdlYkdMU2hhZGVyLCBwcm9ncmFtTmFtZTogc3RyaW5nKSB7XG5cdFx0Y29uc3QgeyBnbCwgZnJhZ21lbnRTaGFkZXIsIGVycm9yQ2FsbGJhY2ssIHVuaWZvcm1zIH0gPSB0aGlzO1xuXHRcdC8vIENyZWF0ZSBhIHByb2dyYW0uXG5cdFx0Y29uc3QgcHJvZ3JhbSA9IGdsLmNyZWF0ZVByb2dyYW0oKTtcblx0XHRpZiAoIXByb2dyYW0pIHtcblx0XHRcdGVycm9yQ2FsbGJhY2soYFVuYWJsZSB0byBpbml0IGdsIHByb2dyYW06ICR7bmFtZX0uYCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdC8vIFRPRE86IGNoZWNrIHRoYXQgYXR0YWNoU2hhZGVyIHdvcmtlZC5cblx0XHRnbC5hdHRhY2hTaGFkZXIocHJvZ3JhbSwgZnJhZ21lbnRTaGFkZXIpO1xuXHRcdGdsLmF0dGFjaFNoYWRlcihwcm9ncmFtLCB2ZXJ0ZXhTaGFkZXIpO1xuXHRcdC8vIExpbmsgdGhlIHByb2dyYW0uXG5cdFx0Z2wubGlua1Byb2dyYW0ocHJvZ3JhbSk7XG5cdFx0Ly8gQ2hlY2sgaWYgaXQgbGlua2VkLlxuXHRcdGNvbnN0IHN1Y2Nlc3MgPSBnbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHByb2dyYW0sIGdsLkxJTktfU1RBVFVTKTtcblx0XHRpZiAoIXN1Y2Nlc3MpIHtcblx0XHRcdC8vIFNvbWV0aGluZyB3ZW50IHdyb25nIHdpdGggdGhlIGxpbmsuXG5cdFx0XHRlcnJvckNhbGxiYWNrKGBQcm9ncmFtIFwiJHtuYW1lfVwiIGZhaWxlZCB0byBsaW5rOiAke2dsLmdldFByb2dyYW1JbmZvTG9nKHByb2dyYW0pfWApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHQvLyBJZiB3ZSBoYXZlIGFueSB1bmlmb3JtcyBzZXQgZm9yIHRoaXMgR1BVUHJvZ3JhbSwgYWRkIHRob3NlIHRvIFdlYkdMUHJvZ3JhbSB3ZSBqdXN0IGluaXRlZC5cblx0XHRjb25zdCB1bmlmb3JtTmFtZXMgPSBPYmplY3Qua2V5cyh1bmlmb3Jtcyk7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB1bmlmb3JtTmFtZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGNvbnN0IHVuaWZvcm1OYW1lID0gdW5pZm9ybU5hbWVzW2ldO1xuXHRcdFx0Y29uc3QgdW5pZm9ybSA9IHVuaWZvcm1zW3VuaWZvcm1OYW1lXTtcblx0XHRcdGNvbnN0IHsgdmFsdWUsIHR5cGUgfSA9IHVuaWZvcm07XG5cdFx0XHR0aGlzLnNldFByb2dyYW1Vbmlmb3JtKHByb2dyYW0sIHByb2dyYW1OYW1lLCB1bmlmb3JtTmFtZSwgdmFsdWUsIHR5cGUpO1xuXHRcdH1cblx0XHRyZXR1cm4gcHJvZ3JhbTtcblx0fVxuXG5cdHByaXZhdGUgZ2V0UHJvZ3JhbVdpdGhOYW1lKG5hbWU6IFBST0dSQU1fTkFNRVMpIHtcblx0XHRpZiAodGhpcy5wcm9ncmFtc1tuYW1lXSkgcmV0dXJuIHRoaXMucHJvZ3JhbXNbbmFtZV07XG5cdFx0Y29uc3QgeyBlcnJvckNhbGxiYWNrIH0gPSB0aGlzO1xuXHRcdGNvbnN0IHZlcnRleFNoYWRlciA9IHZlcnRleFNoYWRlcnNbbmFtZV07XG5cdFx0aWYgKHZlcnRleFNoYWRlci5zaGFkZXIgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Y29uc3QgeyBnbCwgbmFtZSwgZ2xzbFZlcnNpb24gfSA9IHRoaXM7XG5cdFx0XHQvLyBJbml0IGEgdmVydGV4IHNoYWRlci5cblx0XHRcdGxldCB2ZXJ0ZXhTaGFkZXJTb3VyY2UgPSByZXF1aXJlKGdsc2xWZXJzaW9uID09PSBHTFNMMyA/IHZlcnRleFNoYWRlci5zcmNfMyA6IHZlcnRleFNoYWRlci5zcmNfMSk7XG5cdFx0XHRpZiAodmVydGV4U2hhZGVyLmRlZmluZXMpIHtcblx0XHRcdFx0dmVydGV4U2hhZGVyU291cmNlID0gR1BVUHJvZ3JhbS5jb252ZXJ0RGVmaW5lc1RvU3RyaW5nKHZlcnRleFNoYWRlci5kZWZpbmVzKSArIHZlcnRleFNoYWRlclNvdXJjZTtcblx0XHRcdH1cblx0XHRcdGNvbnN0IHNoYWRlciA9IGNvbXBpbGVTaGFkZXIoZ2wsIGVycm9yQ2FsbGJhY2ssIHZlcnRleFNoYWRlclNvdXJjZSwgZ2wuVkVSVEVYX1NIQURFUiwgbmFtZSk7XG5cdFx0XHRpZiAoIXNoYWRlcikge1xuXHRcdFx0XHRlcnJvckNhbGxiYWNrKGBVbmFibGUgdG8gY29tcGlsZSBkZWZhdWx0IHZlcnRleCBzaGFkZXIgZm9yIHByb2dyYW0gXCIke25hbWV9XCIuYCk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdHZlcnRleFNoYWRlci5zaGFkZXIgPSBzaGFkZXI7XG5cdFx0fVxuXHRcdGNvbnN0IHByb2dyYW0gPSB0aGlzLmluaXRQcm9ncmFtKHZlcnRleFNoYWRlci5zaGFkZXIsIERFRkFVTFRfUFJPR1JBTV9OQU1FKTtcblx0XHRpZiAocHJvZ3JhbSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRlcnJvckNhbGxiYWNrKGBVbmFibGUgdG8gaW5pdCBwcm9ncmFtIFwiJHtuYW1lfVwiLmApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHR0aGlzLnByb2dyYW1zW25hbWVdID0gcHJvZ3JhbTtcblx0XHRyZXR1cm4gcHJvZ3JhbTtcblx0fVxuXG5cdGdldCBkZWZhdWx0UHJvZ3JhbSgpIHtcblx0XHRyZXR1cm4gdGhpcy5nZXRQcm9ncmFtV2l0aE5hbWUoREVGQVVMVF9QUk9HUkFNX05BTUUpO1xuXHR9XG5cblx0Z2V0IGRlZmF1bHRQcm9ncmFtV2l0aFVWKCkge1xuXHRcdHJldHVybiB0aGlzLmdldFByb2dyYW1XaXRoTmFtZShERUZBVUxUX1dfVVZfUFJPR1JBTV9OQU1FKTtcblx0fVxuXG5cdGdldCBkZWZhdWx0UHJvZ3JhbVdpdGhOb3JtYWwoKSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0UHJvZ3JhbVdpdGhOYW1lKERFRkFVTFRfV19OT1JNQUxfUFJPR1JBTV9OQU1FKTtcblx0fVxuXG5cdGdldCBkZWZhdWx0UHJvZ3JhbVdpdGhVVk5vcm1hbCgpIHtcblx0XHRyZXR1cm4gdGhpcy5nZXRQcm9ncmFtV2l0aE5hbWUoREVGQVVMVF9XX1VWX05PUk1BTF9QUk9HUkFNX05BTUUpO1xuXHR9XG5cblx0Z2V0IHNlZ21lbnRQcm9ncmFtKCkge1xuXHRcdHJldHVybiB0aGlzLmdldFByb2dyYW1XaXRoTmFtZShTRUdNRU5UX1BST0dSQU1fTkFNRSk7XG5cdH1cblxuXHRnZXQgZGF0YUxheWVyUG9pbnRzUHJvZ3JhbSgpIHtcblx0XHRyZXR1cm4gdGhpcy5nZXRQcm9ncmFtV2l0aE5hbWUoREFUQV9MQVlFUl9QT0lOVFNfUFJPR1JBTV9OQU1FKTtcblx0fVxuXG5cdGdldCBkYXRhTGF5ZXJWZWN0b3JGaWVsZFByb2dyYW0oKSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0UHJvZ3JhbVdpdGhOYW1lKERBVEFfTEFZRVJfVkVDVE9SX0ZJRUxEX1BST0dSQU1fTkFNRSk7XG5cdH1cblxuXHRnZXQgZGF0YUxheWVyTGluZXNQcm9ncmFtKCkge1xuXHRcdHJldHVybiB0aGlzLmdldFByb2dyYW1XaXRoTmFtZShEQVRBX0xBWUVSX0xJTkVTX1BST0dSQU1fTkFNRSk7XG5cdH1cblxuXHRwcml2YXRlIHVuaWZvcm1UeXBlRm9yVmFsdWUoXG5cdFx0dmFsdWU6IG51bWJlciB8IG51bWJlcltdLFxuXHRcdGRhdGFUeXBlOiBVbmlmb3JtRGF0YVR5cGUsXG5cdCkge1xuXHRcdGlmIChkYXRhVHlwZSA9PT0gRkxPQVQpIHtcblx0XHRcdC8vIENoZWNrIHRoYXQgd2UgYXJlIGRlYWxpbmcgd2l0aCBhIG51bWJlci5cblx0XHRcdGlmIChpc0FycmF5KHZhbHVlKSkge1xuXHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8ICh2YWx1ZSBhcyBudW1iZXJbXSkubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRpZiAoIWlzTnVtYmVyKCh2YWx1ZSBhcyBudW1iZXJbXSlbaV0pKSB7XG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdW5pZm9ybSB2YWx1ZTogJHt2YWx1ZX0gZm9yIHByb2dyYW0gXCIke3RoaXMubmFtZX1cIiwgZXhwZWN0ZWQgZmxvYXQgb3IgZmxvYXRbXSBvZiBsZW5ndGggMS00LmApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKCFpc051bWJlcih2YWx1ZSkpIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdW5pZm9ybSB2YWx1ZTogJHt2YWx1ZX0gZm9yIHByb2dyYW0gXCIke3RoaXMubmFtZX1cIiwgZXhwZWN0ZWQgZmxvYXQgb3IgZmxvYXRbXSBvZiBsZW5ndGggMS00LmApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAoIWlzQXJyYXkodmFsdWUpIHx8ICh2YWx1ZSBhcyBudW1iZXJbXSkubGVuZ3RoID09PSAxKSB7XG5cdFx0XHRcdHJldHVybiBGTE9BVF8xRF9VTklGT1JNO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCh2YWx1ZSBhcyBudW1iZXJbXSkubGVuZ3RoID09PSAyKSB7XG5cdFx0XHRcdHJldHVybiBGTE9BVF8yRF9VTklGT1JNO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCh2YWx1ZSBhcyBudW1iZXJbXSkubGVuZ3RoID09PSAzKSB7XG5cdFx0XHRcdHJldHVybiBGTE9BVF8zRF9VTklGT1JNO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCh2YWx1ZSBhcyBudW1iZXJbXSkubGVuZ3RoID09PSA0KSB7XG5cdFx0XHRcdHJldHVybiBGTE9BVF80RF9VTklGT1JNO1xuXHRcdFx0fVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHVuaWZvcm0gdmFsdWU6ICR7dmFsdWV9IGZvciBwcm9ncmFtIFwiJHt0aGlzLm5hbWV9XCIsIGV4cGVjdGVkIGZsb2F0IG9yIGZsb2F0W10gb2YgbGVuZ3RoIDEtNC5gKTtcblx0XHR9IGVsc2UgaWYgKGRhdGFUeXBlID09PSBJTlQpIHtcblx0XHRcdC8vIENoZWNrIHRoYXQgd2UgYXJlIGRlYWxpbmcgd2l0aCBhbiBpbnQuXG5cdFx0XHRpZiAoaXNBcnJheSh2YWx1ZSkpIHtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCAodmFsdWUgYXMgbnVtYmVyW10pLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0aWYgKCFpc0ludGVnZXIoKHZhbHVlIGFzIG51bWJlcltdKVtpXSkpIHtcblx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB1bmlmb3JtIHZhbHVlOiAke3ZhbHVlfSBmb3IgcHJvZ3JhbSBcIiR7dGhpcy5uYW1lfVwiLCBleHBlY3RlZCBpbnQgb3IgaW50W10gb2YgbGVuZ3RoIDEtNC5gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmICghaXNJbnRlZ2VyKHZhbHVlKSkge1xuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB1bmlmb3JtIHZhbHVlOiAke3ZhbHVlfSBmb3IgcHJvZ3JhbSBcIiR7dGhpcy5uYW1lfVwiLCBleHBlY3RlZCBpbnQgb3IgaW50W10gb2YgbGVuZ3RoIDEtNC5gKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKCFpc0FycmF5KHZhbHVlKSB8fCAodmFsdWUgYXMgbnVtYmVyW10pLmxlbmd0aCA9PT0gMSkge1xuXHRcdFx0XHRyZXR1cm4gSU5UXzFEX1VOSUZPUk07XG5cdFx0XHR9XG5cdFx0XHRpZiAoKHZhbHVlIGFzIG51bWJlcltdKS5sZW5ndGggPT09IDIpIHtcblx0XHRcdFx0cmV0dXJuIElOVF8yRF9VTklGT1JNO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCh2YWx1ZSBhcyBudW1iZXJbXSkubGVuZ3RoID09PSAzKSB7XG5cdFx0XHRcdHJldHVybiBJTlRfM0RfVU5JRk9STTtcblx0XHRcdH1cblx0XHRcdGlmICgodmFsdWUgYXMgbnVtYmVyW10pLmxlbmd0aCA9PT0gNCkge1xuXHRcdFx0XHRyZXR1cm4gSU5UXzREX1VOSUZPUk07XG5cdFx0XHR9XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdW5pZm9ybSB2YWx1ZTogJHt2YWx1ZX0gZm9yIHByb2dyYW0gXCIke3RoaXMubmFtZX1cIiwgZXhwZWN0ZWQgaW50IG9yIGludFtdIG9mIGxlbmd0aCAxLTQuYCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB1bmlmb3JtIGRhdGEgdHlwZTogJHtkYXRhVHlwZX0gZm9yIHByb2dyYW0gXCIke3RoaXMubmFtZX1cIiwgZXhwZWN0ZWQgJHtGTE9BVH0gb3IgJHtJTlR9LmApO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgc2V0UHJvZ3JhbVVuaWZvcm0oXG5cdFx0cHJvZ3JhbTogV2ViR0xQcm9ncmFtLFxuXHRcdHByb2dyYW1OYW1lOiBzdHJpbmcsXG5cdFx0dW5pZm9ybU5hbWU6IHN0cmluZyxcblx0XHR2YWx1ZTogVW5pZm9ybVZhbHVlVHlwZSxcblx0XHR0eXBlOiBVbmlmb3JtVHlwZSxcblx0KSB7XG5cdFx0Y29uc3QgeyBnbCwgdW5pZm9ybXMsIGVycm9yQ2FsbGJhY2sgfSA9IHRoaXM7XG5cdFx0Ly8gU2V0IGFjdGl2ZSBwcm9ncmFtLlxuXHRcdGdsLnVzZVByb2dyYW0ocHJvZ3JhbSk7XG5cblx0XHRsZXQgbG9jYXRpb24gPSB1bmlmb3Jtc1t1bmlmb3JtTmFtZV0/LmxvY2F0aW9uW3Byb2dyYW1OYW1lXTtcblx0XHQvLyBJbml0IGEgbG9jYXRpb24gZm9yIFdlYkdMUHJvZ3JhbSBpZiBuZWVkZWQuXG5cdFx0aWYgKGxvY2F0aW9uID09PSB1bmRlZmluZWQpIHtcblx0XHRcdGNvbnN0IF9sb2NhdGlvbiA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihwcm9ncmFtLCB1bmlmb3JtTmFtZSk7XG5cdFx0XHRpZiAoIV9sb2NhdGlvbikge1xuXHRcdFx0XHRlcnJvckNhbGxiYWNrKGBDb3VsZCBub3QgaW5pdCB1bmlmb3JtIFwiJHt1bmlmb3JtTmFtZX1cIiBmb3IgcHJvZ3JhbSBcIiR7dGhpcy5uYW1lfVwiLlxuQ2hlY2sgdGhhdCB1bmlmb3JtIGlzIHByZXNlbnQgaW4gc2hhZGVyIGNvZGUsIHVudXNlZCB1bmlmb3JtcyBtYXkgYmUgcmVtb3ZlZCBieSBjb21waWxlci5cbkFsc28gY2hlY2sgdGhhdCB1bmlmb3JtIHR5cGUgaW4gc2hhZGVyIGNvZGUgbWF0Y2hlcyB0eXBlICR7dHlwZX0uXG5FcnJvciBjb2RlOiAke2dsLmdldEVycm9yKCl9LmApO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRsb2NhdGlvbiA9IF9sb2NhdGlvbjtcblx0XHRcdC8vIFNhdmUgbG9jYXRpb24gZm9yIGZ1dHVyZSB1c2UuXG5cdFx0XHRpZiAodW5pZm9ybXNbdW5pZm9ybU5hbWVdKSB7XG5cdFx0XHRcdHVuaWZvcm1zW3VuaWZvcm1OYW1lXS5sb2NhdGlvbltwcm9ncmFtTmFtZV0gPSBsb2NhdGlvbjtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBTZXQgdW5pZm9ybS5cblx0XHQvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvV2ViR0xSZW5kZXJpbmdDb250ZXh0L3VuaWZvcm1cblx0XHRzd2l0Y2ggKHR5cGUpIHtcblx0XHRcdGNhc2UgRkxPQVRfMURfVU5JRk9STTpcblx0XHRcdFx0Z2wudW5pZm9ybTFmKGxvY2F0aW9uLCB2YWx1ZSBhcyBudW1iZXIpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgRkxPQVRfMkRfVU5JRk9STTpcblx0XHRcdFx0Z2wudW5pZm9ybTJmdihsb2NhdGlvbiwgdmFsdWUgYXMgbnVtYmVyW10pO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgRkxPQVRfM0RfVU5JRk9STTpcblx0XHRcdFx0Z2wudW5pZm9ybTNmdihsb2NhdGlvbiwgdmFsdWUgYXMgbnVtYmVyW10pO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgRkxPQVRfNERfVU5JRk9STTpcblx0XHRcdFx0Z2wudW5pZm9ybTRmdihsb2NhdGlvbiwgdmFsdWUgYXMgbnVtYmVyW10pO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgSU5UXzFEX1VOSUZPUk06XG5cdFx0XHRcdGdsLnVuaWZvcm0xaShsb2NhdGlvbiwgdmFsdWUgYXMgbnVtYmVyKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIElOVF8yRF9VTklGT1JNOlxuXHRcdFx0XHRnbC51bmlmb3JtMml2KGxvY2F0aW9uLCB2YWx1ZSBhcyBudW1iZXJbXSk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBJTlRfM0RfVU5JRk9STTpcblx0XHRcdFx0Z2wudW5pZm9ybTNpdihsb2NhdGlvbiwgdmFsdWUgYXMgbnVtYmVyW10pO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgSU5UXzREX1VOSUZPUk06XG5cdFx0XHRcdGdsLnVuaWZvcm00aXYobG9jYXRpb24sIHZhbHVlIGFzIG51bWJlcltdKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gdW5pZm9ybSB0eXBlICR7dHlwZX0gZm9yIEdQVVByb2dyYW0gXCIke3RoaXMubmFtZX1cIi5gKTtcblx0XHR9XG5cdH1cblxuXHRzZXRVbmlmb3JtKFxuXHRcdHVuaWZvcm1OYW1lOiBzdHJpbmcsXG5cdFx0dmFsdWU6IFVuaWZvcm1WYWx1ZVR5cGUsXG5cdFx0ZGF0YVR5cGU/OiBVbmlmb3JtRGF0YVR5cGUsXG5cdCkge1xuXHRcdGNvbnN0IHsgcHJvZ3JhbXMsIHVuaWZvcm1zIH0gPSB0aGlzO1xuXG5cdFx0bGV0IHR5cGUgPSB1bmlmb3Jtc1t1bmlmb3JtTmFtZV0/LnR5cGU7XG5cdFx0aWYgKGRhdGFUeXBlKSB7XG5cdFx0XHRjb25zdCB0eXBlUGFyYW0gPSB0aGlzLnVuaWZvcm1UeXBlRm9yVmFsdWUodmFsdWUsIGRhdGFUeXBlKTtcblx0XHRcdGlmICh0eXBlID09PSB1bmRlZmluZWQpIHR5cGUgPSB0eXBlUGFyYW07XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0Ly8gY29uc29sZS53YXJuKGBEb24ndCBuZWVkIHRvIHBhc3MgaW4gZGF0YVR5cGUgdG8gR1BVUHJvZ3JhbS5zZXRVbmlmb3JtIGZvciBwcmV2aW91c2x5IGluaXRlZCB1bmlmb3JtIFwiJHt1bmlmb3JtTmFtZX1cImApO1xuXHRcdFx0XHQvLyBDaGVjayB0aGF0IHR5cGVzIG1hdGNoIHByZXZpb3VzbHkgc2V0IHVuaWZvcm0uXG5cdFx0XHRcdGlmICh0eXBlICE9PSB0eXBlUGFyYW0pIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuaWZvcm0gXCIke3VuaWZvcm1OYW1lfVwiIGZvciBHUFVQcm9ncmFtIFwiJHt0aGlzLm5hbWV9XCIgY2Fubm90IGNoYW5nZSBmcm9tIHR5cGUgJHt0eXBlfSB0byB0eXBlICR7dHlwZVBhcmFtfS5gKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAodHlwZSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gdHlwZSBmb3IgdW5pZm9ybSBcIiR7dW5pZm9ybU5hbWV9XCIsIHBsZWFzZSBwYXNzIGluIGRhdGFUeXBlIHRvIEdQVVByb2dyYW0uc2V0VW5pZm9ybSB3aGVuIGluaXRpbmcgYSBuZXcgdW5pZm9ybS5gKTtcblx0XHR9XG5cblx0XHRpZiAoIXVuaWZvcm1zW3VuaWZvcm1OYW1lXSkge1xuXHRcdFx0Ly8gSW5pdCB1bmlmb3JtIGlmIG5lZWRlZC5cblx0XHRcdHVuaWZvcm1zW3VuaWZvcm1OYW1lXSA9IHsgdHlwZSwgbG9jYXRpb246IHt9LCB2YWx1ZSB9O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBVcGRhdGUgdmFsdWUuXG5cdFx0XHR1bmlmb3Jtc1t1bmlmb3JtTmFtZV0udmFsdWUgPSB2YWx1ZTtcblx0XHR9XG5cblx0XHQvLyBVcGRhdGUgYW55IGFjdGl2ZSBwcm9ncmFtcy5cblx0XHRjb25zdCBrZXlzID0gT2JqZWN0LmtleXMocHJvZ3JhbXMpO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0Y29uc3QgcHJvZ3JhbU5hbWUgPSBrZXlzW2ldIGFzIFBST0dSQU1fTkFNRVM7XG5cdFx0XHR0aGlzLnNldFByb2dyYW1Vbmlmb3JtKHByb2dyYW1zW3Byb2dyYW1OYW1lXSEsIHByb2dyYW1OYW1lLCB1bmlmb3JtTmFtZSwgdmFsdWUsIHR5cGUpO1xuXHRcdH1cblx0fTtcblxuXHRzZXRWZXJ0ZXhVbmlmb3JtKFxuXHRcdHByb2dyYW06IFdlYkdMUHJvZ3JhbSxcblx0XHR1bmlmb3JtTmFtZTogc3RyaW5nLFxuXHRcdHZhbHVlOiBVbmlmb3JtVmFsdWVUeXBlLFxuXHRcdGRhdGFUeXBlOiBVbmlmb3JtRGF0YVR5cGUsXG5cdCkge1xuXHRcdGNvbnN0IHR5cGUgPSB0aGlzLnVuaWZvcm1UeXBlRm9yVmFsdWUodmFsdWUsIGRhdGFUeXBlKTtcblx0XHRpZiAocHJvZ3JhbSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ011c3QgcGFzcyBpbiB2YWxpZCBXZWJHTFByb2dyYW0gdG8gc2V0VmVydGV4VW5pZm9ybSwgZ290IHVuZGVmaW5lZC4nKTtcblx0XHR9XG5cdFx0Y29uc3QgcHJvZ3JhbU5hbWUgPSBPYmplY3Qua2V5cyh0aGlzLnByb2dyYW1zKS5maW5kKGtleSA9PiB0aGlzLnByb2dyYW1zW2tleSBhcyBQUk9HUkFNX05BTUVTXSA9PT0gcHJvZ3JhbSk7XG5cdFx0aWYgKCFwcm9ncmFtTmFtZSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCB2YWxpZCB2ZXJ0ZXggcHJvZ3JhbU5hbWUgZm9yIFdlYkdMUHJvZ3JhbSBcIiR7dGhpcy5uYW1lfVwiLmApO1xuXHRcdH1cblx0XHR0aGlzLnNldFByb2dyYW1Vbmlmb3JtKHByb2dyYW0sIHByb2dyYW1OYW1lLCB1bmlmb3JtTmFtZSwgdmFsdWUsIHR5cGUpO1xuXHR9XG5cblx0ZGVzdHJveSgpIHtcblx0XHRjb25zdCB7IGdsLCBmcmFnbWVudFNoYWRlciwgcHJvZ3JhbXMgfSA9IHRoaXM7XG5cdFx0Ly8gVW5iaW5kIGFsbCBnbCBkYXRhIGJlZm9yZSBkZWxldGluZy5cblx0XHRPYmplY3QudmFsdWVzKHByb2dyYW1zKS5mb3JFYWNoKHByb2dyYW0gPT4ge1xuXHRcdFx0Z2wuZGVsZXRlUHJvZ3JhbShwcm9ncmFtISk7XG5cdFx0fSk7XG5cdFx0T2JqZWN0LmtleXModGhpcy5wcm9ncmFtcykuZm9yRWFjaChrZXkgPT4ge1xuXHRcdFx0ZGVsZXRlIHRoaXMucHJvZ3JhbXNba2V5IGFzIFBST0dSQU1fTkFNRVNdO1xuXHRcdH0pO1xuXG5cdFx0Ly8gRnJvbSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvV2ViR0xSZW5kZXJpbmdDb250ZXh0L2RlbGV0ZVNoYWRlclxuXHRcdC8vIFRoaXMgbWV0aG9kIGhhcyBubyBlZmZlY3QgaWYgdGhlIHNoYWRlciBoYXMgYWxyZWFkeSBiZWVuIGRlbGV0ZWRcblx0XHRnbC5kZWxldGVTaGFkZXIoZnJhZ21lbnRTaGFkZXIpO1xuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHRkZWxldGUgdGhpcy5mcmFnbWVudFNoYWRlcjtcblxuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHRkZWxldGUgdGhpcy5nbDtcblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0ZGVsZXRlIHRoaXMuZXJyb3JDYWxsYmFjaztcblx0fVxufVxuIiwiaW1wb3J0IHsgc2F2ZUFzIH0gZnJvbSAnZmlsZS1zYXZlcic7XG4vLyBAdHMtaWdub3JlXG5pbXBvcnQgeyBjaGFuZ2VEcGlCbG9iIH0gZnJvbSAnY2hhbmdlZHBpJztcbmltcG9ydCB7IERhdGFMYXllciB9IGZyb20gJy4vRGF0YUxheWVyJztcbmltcG9ydCB7XG5cdERhdGFMYXllckFycmF5VHlwZSwgRGF0YUxheWVyRmlsdGVyVHlwZSwgRGF0YUxheWVyTnVtQ29tcG9uZW50cywgRGF0YUxheWVyVHlwZSwgRGF0YUxheWVyV3JhcFR5cGUsXG5cdEZMT0FULCBIQUxGX0ZMT0FULCBVTlNJR05FRF9CWVRFLCBCWVRFLCBVTlNJR05FRF9TSE9SVCwgU0hPUlQsIFVOU0lHTkVEX0lOVCwgSU5ULFxuXHRVbmlmb3JtRGF0YVR5cGUsIFVuaWZvcm1WYWx1ZVR5cGUsIEdMU0xWZXJzaW9uLCBHTFNMMSwgR0xTTDMsIENMQU1QX1RPX0VER0UsIFRleHR1cmVGb3JtYXRUeXBlLCBORUFSRVNULCBSR0JBLCBUZXh0dXJlRGF0YVR5cGUsXG59IGZyb20gJy4vQ29uc3RhbnRzJztcbmltcG9ydCB7IEdQVVByb2dyYW0gfSBmcm9tICcuL0dQVVByb2dyYW0nO1xuaW1wb3J0IHsgV2ViR0xSZW5kZXJlciwgVGV4dHVyZSwgVmVjdG9yNCB9IGZyb20gJ3RocmVlJzsvLyBKdXN0IGltcG9ydGluZyB0aGUgdHlwZXMgaGVyZS5cbmltcG9ydCAqIGFzIHV0aWxzIGZyb20gJy4vdXRpbHMvVmVjdG9yNCc7XG5pbXBvcnQgeyBpc1dlYkdMMiwgaXNQb3dlck9mMiwgaW5pdFNlcXVlbnRpYWxGbG9hdEFycmF5IH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBnZXRGbG9hdDE2IH0gZnJvbSAnQHBldGFtb3Jpa2VuL2Zsb2F0MTYnO1xuaW1wb3J0IHtcblx0aXNBcnJheSxcblx0aXNTdHJpbmcsIGlzVmFsaWRGaWx0ZXJUeXBlLCBpc1ZhbGlkVGV4dHVyZURhdGFUeXBlLCBpc1ZhbGlkVGV4dHVyZUZvcm1hdFR5cGUsIGlzVmFsaWRXcmFwVHlwZSxcblx0dmFsaWRGaWx0ZXJUeXBlcywgdmFsaWRUZXh0dXJlRGF0YVR5cGVzLCB2YWxpZFRleHR1cmVGb3JtYXRUeXBlcywgdmFsaWRXcmFwVHlwZXMgfSBmcm9tICcuL0NoZWNrcyc7XG5cbmNvbnN0IERFRkFVTFRfQ0lSQ0xFX05VTV9TRUdNRU5UUyA9IDE4Oy8vIE11c3QgYmUgZGl2aXNpYmxlIGJ5IDYgdG8gd29yayB3aXRoIHN0ZXBTZWdtZW50KCkuXG5cbnR5cGUgRXJyb3JDYWxsYmFjayA9IChtZXNzYWdlOiBzdHJpbmcpID0+IHZvaWQ7XG5cbmV4cG9ydCBjbGFzcyBXZWJHTENvbXB1dGUge1xuXHRyZWFkb25seSBnbCE6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCB8IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQ7XG5cdHJlYWRvbmx5IGdsc2xWZXJzaW9uITogR0xTTFZlcnNpb247XG5cdC8vIFRoZXNlIHdpZHRoIGFuZCBoZWlnaHQgYXJlIHRoZSBjdXJyZW50IGNhbnZhcyBhdCBmdWxsIHJlcy5cblx0cHJpdmF0ZSB3aWR0aCE6IG51bWJlcjtcblx0cHJpdmF0ZSBoZWlnaHQhOiBudW1iZXI7XG5cblx0cHJpdmF0ZSBlcnJvclN0YXRlID0gZmFsc2U7XG5cdHByaXZhdGUgcmVhZG9ubHkgZXJyb3JDYWxsYmFjazogRXJyb3JDYWxsYmFjaztcblxuXHQvLyBTYXZlIHRocmVlanMgcmVuZGVyZXIgaWYgcGFzc2VkIGluLlxuXHRwcml2YXRlIHJlbmRlcmVyPzogV2ViR0xSZW5kZXJlcjtcblx0cHJpdmF0ZSByZWFkb25seSBtYXhOdW1UZXh0dXJlcyE6IG51bWJlcjtcblx0XG5cdC8vIFByZWNvbXB1dGVkIGJ1ZmZlcnMgKGluaXRlZCBhcyBuZWVkZWQpLlxuXHRwcml2YXRlIF9xdWFkUG9zaXRpb25zQnVmZmVyPzogV2ViR0xCdWZmZXI7XG5cdHByaXZhdGUgX2JvdW5kYXJ5UG9zaXRpb25zQnVmZmVyPzogV2ViR0xCdWZmZXI7XG5cdC8vIFN0b3JlIG11bHRpcGxlIGNpcmNsZSBwb3NpdGlvbnMgYnVmZmVycyBmb3IgdmFyaW91cyBudW0gc2VnbWVudHMsIHVzZSBudW1TZWdtZW50cyBhcyBrZXkuXG5cdHByaXZhdGUgX2NpcmNsZVBvc2l0aW9uc0J1ZmZlcjogeyBba2V5OiBudW1iZXJdOiBXZWJHTEJ1ZmZlciB9ID0ge307XG5cblx0cHJpdmF0ZSBwb2ludEluZGV4QXJyYXk/OiBGbG9hdDMyQXJyYXk7XG5cdHByaXZhdGUgcG9pbnRJbmRleEJ1ZmZlcj86IFdlYkdMQnVmZmVyO1xuXHRwcml2YXRlIHZlY3RvckZpZWxkSW5kZXhBcnJheT86IEZsb2F0MzJBcnJheTtcblx0cHJpdmF0ZSB2ZWN0b3JGaWVsZEluZGV4QnVmZmVyPzogV2ViR0xCdWZmZXI7XG5cdHByaXZhdGUgaW5kZXhlZExpbmVzSW5kZXhCdWZmZXI/OiBXZWJHTEJ1ZmZlcjtcblxuXHQvLyBQcm9ncmFtcyBmb3IgY29weWluZyBkYXRhICh0aGVzZSBhcmUgbmVlZGVkIGZvciByZW5kZXJpbmcgcGFydGlhbCBzY3JlZW4gZ2VvbWV0cmllcykuXG5cdHByaXZhdGUgcmVhZG9ubHkgY29weUZsb2F0UHJvZ3JhbSE6IEdQVVByb2dyYW07XG5cdHByaXZhdGUgcmVhZG9ubHkgY29weUludFByb2dyYW0hOiBHUFVQcm9ncmFtO1xuXHRwcml2YXRlIHJlYWRvbmx5IGNvcHlVaW50UHJvZ3JhbSE6IEdQVVByb2dyYW07XG5cblx0Ly8gT3RoZXIgdXRpbCBwcm9ncmFtcy5cblx0cHJpdmF0ZSBfc2luZ2xlQ29sb3JQcm9ncmFtPzogR1BVUHJvZ3JhbTtcblx0cHJpdmF0ZSBfc2luZ2xlQ29sb3JXaXRoV3JhcENoZWNrUHJvZ3JhbT86IEdQVVByb2dyYW07XG5cblx0c3RhdGljIGluaXRXaXRoVGhyZWVSZW5kZXJlcihcblx0XHRyZW5kZXJlcjogV2ViR0xSZW5kZXJlcixcblx0XHRwYXJhbXM6IHtcblx0XHRcdGdsc2xWZXJzaW9uPzogR0xTTFZlcnNpb24sXG5cdFx0fSxcblx0XHRlcnJvckNhbGxiYWNrPzogRXJyb3JDYWxsYmFjayxcblx0KSB7XG5cdFx0cmV0dXJuIG5ldyBXZWJHTENvbXB1dGUoXG5cdFx0XHR7XG5cdFx0XHRcdGNhbnZhczogcmVuZGVyZXIuZG9tRWxlbWVudCxcblx0XHRcdFx0Y29udGV4dDogcmVuZGVyZXIuZ2V0Q29udGV4dCgpLFxuXHRcdFx0XHQuLi5wYXJhbXMsXG5cdFx0XHR9LFxuXHRcdFx0ZXJyb3JDYWxsYmFjayxcblx0XHRcdHJlbmRlcmVyLFxuXHRcdCk7XG5cdH1cblxuXHRjb25zdHJ1Y3Rvcihcblx0XHRwYXJhbXM6IHtcblx0XHRcdGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQsXG5cdFx0XHRjb250ZXh0PzogV2ViR0xSZW5kZXJpbmdDb250ZXh0IHwgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCB8IG51bGwsXG5cdFx0XHRhbnRpYWxpYXM/OiBib29sZWFuLFxuXHRcdFx0Z2xzbFZlcnNpb24/OiBHTFNMVmVyc2lvbixcblx0XHR9LFxuXHRcdC8vIE9wdGlvbmFsbHkgcGFzcyBpbiBhbiBlcnJvciBjYWxsYmFjayBpbiBjYXNlIHdlIHdhbnQgdG8gaGFuZGxlIGVycm9ycyByZWxhdGVkIHRvIHdlYmdsIHN1cHBvcnQuXG5cdFx0Ly8gZS5nLiB0aHJvdyB1cCBhIG1vZGFsIHRlbGxpbmcgdXNlciB0aGlzIHdpbGwgbm90IHdvcmsgb24gdGhlaXIgZGV2aWNlLlxuXHRcdGVycm9yQ2FsbGJhY2s6IEVycm9yQ2FsbGJhY2sgPSAobWVzc2FnZTogc3RyaW5nKSA9PiB7IHRocm93IG5ldyBFcnJvcihtZXNzYWdlKSB9LFxuXHRcdHJlbmRlcmVyPzogV2ViR0xSZW5kZXJlcixcblx0KSB7XG5cdFx0Ly8gQ2hlY2sgcGFyYW1zLlxuXHRcdGNvbnN0IHZhbGlkS2V5cyA9IFsnY2FudmFzJywgJ2NvbnRleHQnLCAnYW50aWFsaWFzJywgJ2dsc2xWZXJzaW9uJ107XG5cdFx0T2JqZWN0LmtleXMocGFyYW1zKS5mb3JFYWNoKGtleSA9PiB7XG5cdFx0XHRpZiAodmFsaWRLZXlzLmluZGV4T2Yoa2V5KSA8IDApIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGtleSAke2tleX0gcGFzc2VkIHRvIFdlYkdMQ29tcHV0ZS5jb25zdHJ1Y3Rvci4gIFZhbGlkIGtleXMgYXJlICR7dmFsaWRLZXlzLmpvaW4oJywgJyl9LmApO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdC8vIFNhdmUgY2FsbGJhY2sgaW4gY2FzZSB3ZSBydW4gaW50byBhbiBlcnJvci5cblx0XHRjb25zdCBzZWxmID0gdGhpcztcblx0XHR0aGlzLmVycm9yQ2FsbGJhY2sgPSAobWVzc2FnZTogc3RyaW5nKSA9PiB7XG5cdFx0XHRpZiAoc2VsZi5lcnJvclN0YXRlKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdHNlbGYuZXJyb3JTdGF0ZSA9IHRydWU7XG5cdFx0XHRlcnJvckNhbGxiYWNrKG1lc3NhZ2UpO1xuXHRcdH1cblxuXHRcdGNvbnN0IHsgY2FudmFzIH0gPSBwYXJhbXM7XG5cdFx0bGV0IGdsID0gcGFyYW1zLmNvbnRleHQ7XG5cblx0XHQvLyBJbml0IEdMLlxuXHRcdGlmICghZ2wpIHtcblx0XHRcdGNvbnN0IG9wdGlvbnM6IGFueSA9IHt9O1xuXHRcdFx0aWYgKHBhcmFtcy5hbnRpYWxpYXMgIT09IHVuZGVmaW5lZCkgb3B0aW9ucy5hbnRpYWxpYXMgPSBwYXJhbXMuYW50aWFsaWFzO1xuXHRcdFx0Ly8gSW5pdCBhIGdsIGNvbnRleHQgaWYgbm90IHBhc3NlZCBpbi5cblx0XHRcdGdsID0gY2FudmFzLmdldENvbnRleHQoJ3dlYmdsMicsIG9wdGlvbnMpICBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0IHwgbnVsbFxuXHRcdFx0XHR8fCBjYW52YXMuZ2V0Q29udGV4dCgnd2ViZ2wnLCBvcHRpb25zKSAgYXMgV2ViR0xSZW5kZXJpbmdDb250ZXh0IHwgbnVsbFxuXHRcdFx0XHR8fCBjYW52YXMuZ2V0Q29udGV4dCgnZXhwZXJpbWVudGFsLXdlYmdsJywgb3B0aW9ucykgIGFzIFdlYkdMUmVuZGVyaW5nQ29udGV4dCB8IG51bGw7XG5cdFx0XHRpZiAoZ2wgPT09IG51bGwpIHtcblx0XHRcdFx0dGhpcy5lcnJvckNhbGxiYWNrKCdVbmFibGUgdG8gaW5pdGlhbGl6ZSBXZWJHTCBjb250ZXh0LicpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmIChpc1dlYkdMMihnbCkpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdVc2luZyBXZWJHTCAyLjAgY29udGV4dC4nKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc29sZS5sb2coJ1VzaW5nIFdlYkdMIDEuMCBjb250ZXh0LicpO1xuXHRcdH1cblx0XHR0aGlzLmdsID0gZ2w7XG5cdFx0dGhpcy5yZW5kZXJlciA9IHJlbmRlcmVyO1xuXG5cdFx0Ly8gU2F2ZSBnbHNsIHZlcnNpb24sIGRlZmF1bHQgdG8gMS54LlxuXHRcdGNvbnN0IGdsc2xWZXJzaW9uID0gcGFyYW1zLmdsc2xWZXJzaW9uID09PSB1bmRlZmluZWQgPyBHTFNMMSA6IHBhcmFtcy5nbHNsVmVyc2lvbjtcblx0XHR0aGlzLmdsc2xWZXJzaW9uID0gZ2xzbFZlcnNpb247XG5cdFx0aWYgKCFpc1dlYkdMMihnbCkgJiYgZ2xzbFZlcnNpb24gPT09IEdMU0wzKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oJ0dMU0wzLnggaXMgaW5jb21wYXRpYmxlIHdpdGggV2ViR0wxLjAgY29udGV4dHMuJyk7XG5cdFx0fVxuXG5cdFx0Ly8gR0wgc2V0dXAuXG5cdFx0Ly8gRGlzYWJsZSBkZXB0aCB0ZXN0aW5nIGdsb2JhbGx5LlxuXHRcdGdsLmRpc2FibGUoZ2wuREVQVEhfVEVTVCk7XG5cdFx0Ly8gU2V0IHVucGFjayBhbGlnbm1lbnQgdG8gMSBzbyB3ZSBjYW4gaGF2ZSB0ZXh0dXJlcyBvZiBhcmJpdHJhcnkgZGltZW5zaW9ucy5cblx0XHQvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81MTU4MjI4Mi9lcnJvci13aGVuLWNyZWF0aW5nLXRleHR1cmVzLWluLXdlYmdsLXdpdGgtdGhlLXJnYi1mb3JtYXRcblx0XHRnbC5waXhlbFN0b3JlaShnbC5VTlBBQ0tfQUxJR05NRU5ULCAxKTtcblx0XHQvLyBUT0RPOiBsb29rIGludG8gbW9yZSBvZiB0aGVzZTogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1dlYkdMUmVuZGVyaW5nQ29udGV4dC9waXhlbFN0b3JlaVxuXHRcdC8vIC8vIFNvbWUgaW1wbGVtZW50YXRpb25zIG9mIEhUTUxDYW52YXNFbGVtZW50J3Mgb3IgT2Zmc2NyZWVuQ2FudmFzJ3MgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIHN0b3JlIGNvbG9yIHZhbHVlc1xuXHRcdC8vIC8vIGludGVybmFsbHkgaW4gcHJlbXVsdGlwbGllZCBmb3JtLiBJZiBzdWNoIGEgY2FudmFzIGlzIHVwbG9hZGVkIHRvIGEgV2ViR0wgdGV4dHVyZSB3aXRoIHRoZVxuXHRcdC8vIC8vIFVOUEFDS19QUkVNVUxUSVBMWV9BTFBIQV9XRUJHTCBwaXhlbCBzdG9yYWdlIHBhcmFtZXRlciBzZXQgdG8gZmFsc2UsIHRoZSBjb2xvciBjaGFubmVscyB3aWxsIGhhdmUgdG8gYmUgdW4tbXVsdGlwbGllZFxuXHRcdC8vIC8vIGJ5IHRoZSBhbHBoYSBjaGFubmVsLCB3aGljaCBpcyBhIGxvc3N5IG9wZXJhdGlvbi4gVGhlIFdlYkdMIGltcGxlbWVudGF0aW9uIHRoZXJlZm9yZSBjYW4gbm90IGd1YXJhbnRlZSB0aGF0IGNvbG9yc1xuXHRcdC8vIC8vIHdpdGggYWxwaGEgPCAxLjAgd2lsbCBiZSBwcmVzZXJ2ZWQgbG9zc2xlc3NseSB3aGVuIGZpcnN0IGRyYXduIHRvIGEgY2FudmFzIHZpYSBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgYW5kIHRoZW5cblx0XHQvLyAvLyB1cGxvYWRlZCB0byBhIFdlYkdMIHRleHR1cmUgd2hlbiB0aGUgVU5QQUNLX1BSRU1VTFRJUExZX0FMUEhBX1dFQkdMIHBpeGVsIHN0b3JhZ2UgcGFyYW1ldGVyIGlzIHNldCB0byBmYWxzZS5cblx0XHQvLyBnbC5waXhlbFN0b3JlaShnbC5VTlBBQ0tfUFJFTVVMVElQTFlfQUxQSEFfV0VCR0wsIHRydWUpO1xuXG5cdFx0Ly8gSW5pdCBwcm9ncmFtcyB0byBwYXNzIHZhbHVlcyBmcm9tIG9uZSB0ZXh0dXJlIHRvIGFub3RoZXIuXG5cdFx0dGhpcy5jb3B5RmxvYXRQcm9ncmFtID0gdGhpcy5pbml0UHJvZ3JhbSh7XG5cdFx0XHRuYW1lOiAnY29weUZsb2F0Jyxcblx0XHRcdGZyYWdtZW50U2hhZGVyOiBnbHNsVmVyc2lvbiA9PT0gR0xTTDMgPyByZXF1aXJlKCcuL2dsc2xfMy9Db3B5RmxvYXRGcmFnU2hhZGVyLmdsc2wnKSA6IHJlcXVpcmUoJy4vZ2xzbF8xL0NvcHlGcmFnU2hhZGVyLmdsc2wnKSxcblx0XHRcdHVuaWZvcm1zOiBbXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0bmFtZTogJ3Vfc3RhdGUnLFxuXHRcdFx0XHRcdFx0dmFsdWU6IDAsXG5cdFx0XHRcdFx0XHRkYXRhVHlwZTogSU5ULFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdF0sXG5cdFx0XHR9LFxuXHRcdCk7XG5cdFx0aWYgKGdsc2xWZXJzaW9uID09PSBHTFNMMykge1xuXHRcdFx0dGhpcy5jb3B5SW50UHJvZ3JhbSA9IHRoaXMuaW5pdFByb2dyYW0oe1xuXHRcdFx0XHRuYW1lOiAnY29weUludCcsXG5cdFx0XHRcdGZyYWdtZW50U2hhZGVyOiByZXF1aXJlKCcuL2dsc2xfMy9Db3B5SW50RnJhZ1NoYWRlci5nbHNsJyksXG5cdFx0XHRcdHVuaWZvcm1zOiBbXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdG5hbWU6ICd1X3N0YXRlJyxcblx0XHRcdFx0XHRcdFx0dmFsdWU6IDAsXG5cdFx0XHRcdFx0XHRcdGRhdGFUeXBlOiBJTlQsXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdF0sXG5cdFx0XHRcdH0sXG5cdFx0XHQpO1xuXHRcdFx0dGhpcy5jb3B5VWludFByb2dyYW0gPSB0aGlzLmluaXRQcm9ncmFtKHtcblx0XHRcdFx0bmFtZTogJ2NvcHlVaW50Jyxcblx0XHRcdFx0ZnJhZ21lbnRTaGFkZXI6IHJlcXVpcmUoJy4vZ2xzbF8zL0NvcHlVaW50RnJhZ1NoYWRlci5nbHNsJyksXG5cdFx0XHRcdHVuaWZvcm1zOiBbXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdG5hbWU6ICd1X3N0YXRlJyxcblx0XHRcdFx0XHRcdFx0dmFsdWU6IDAsXG5cdFx0XHRcdFx0XHRcdGRhdGFUeXBlOiBJTlQsXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdF0sXG5cdFx0XHRcdH0sXG5cdFx0XHQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLmNvcHlJbnRQcm9ncmFtID0gdGhpcy5jb3B5RmxvYXRQcm9ncmFtO1xuXHRcdFx0dGhpcy5jb3B5VWludFByb2dyYW0gPSB0aGlzLmNvcHlGbG9hdFByb2dyYW07XG5cdFx0fVxuXG5cdFx0Ly8gVW5iaW5kIGFjdGl2ZSBidWZmZXIuXG5cdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIG51bGwpO1xuXG5cdFx0Ly8gQ2FudmFzIHNldHVwLlxuXHRcdHRoaXMub25SZXNpemUoY2FudmFzKTtcblxuXHRcdC8vIExvZyBudW1iZXIgb2YgdGV4dHVyZXMgYXZhaWxhYmxlLlxuXHRcdHRoaXMubWF4TnVtVGV4dHVyZXMgPSB0aGlzLmdsLmdldFBhcmFtZXRlcih0aGlzLmdsLk1BWF9URVhUVVJFX0lNQUdFX1VOSVRTKTtcblx0XHRjb25zb2xlLmxvZyhgJHt0aGlzLm1heE51bVRleHR1cmVzfSB0ZXh0dXJlcyBtYXguYCk7XG5cdH1cblxuXHRwcml2YXRlIGdldCBzaW5nbGVDb2xvclByb2dyYW0oKSB7XG5cdFx0aWYgKHRoaXMuX3NpbmdsZUNvbG9yUHJvZ3JhbSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRjb25zdCBwcm9ncmFtID0gdGhpcy5pbml0UHJvZ3JhbSh7XG5cdFx0XHRcdG5hbWU6ICdzaW5nbGVDb2xvcicsXG5cdFx0XHRcdGZyYWdtZW50U2hhZGVyOiB0aGlzLmdsc2xWZXJzaW9uID09PSBHTFNMMyA/IHJlcXVpcmUoJy4vZ2xzbF8zL1NpbmdsZUNvbG9yRnJhZ1NoYWRlci5nbHNsJykgOiByZXF1aXJlKCcuL2dsc2xfMS9TaW5nbGVDb2xvckZyYWdTaGFkZXIuZ2xzbCcpLFxuXHRcdFx0fSk7XG5cdFx0XHR0aGlzLl9zaW5nbGVDb2xvclByb2dyYW0gPSBwcm9ncmFtO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5fc2luZ2xlQ29sb3JQcm9ncmFtO1xuXHR9XG5cblx0cHJpdmF0ZSBnZXQgc2luZ2xlQ29sb3JXaXRoV3JhcENoZWNrUHJvZ3JhbSgpIHtcblx0XHRpZiAodGhpcy5fc2luZ2xlQ29sb3JXaXRoV3JhcENoZWNrUHJvZ3JhbSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRjb25zdCBwcm9ncmFtID0gdGhpcy5pbml0UHJvZ3JhbSh7XG5cdFx0XHRcdG5hbWU6ICdzaW5nbGVDb2xvcldpdGhXcmFwQ2hlY2snLFxuXHRcdFx0XHRmcmFnbWVudFNoYWRlcjogdGhpcy5nbHNsVmVyc2lvbiA9PT0gR0xTTDMgPyByZXF1aXJlKCcuL2dsc2xfMy9TaW5nbGVDb2xvcldpdGhXcmFwQ2hlY2tGcmFnU2hhZGVyLmdsc2wnKSA6IHJlcXVpcmUoJy4vZ2xzbF8xL1NpbmdsZUNvbG9yV2l0aFdyYXBDaGVja0ZyYWdTaGFkZXIuZ2xzbCcpLFxuXHRcdFx0fSk7XG5cdFx0XHR0aGlzLl9zaW5nbGVDb2xvcldpdGhXcmFwQ2hlY2tQcm9ncmFtID0gcHJvZ3JhbTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuX3NpbmdsZUNvbG9yV2l0aFdyYXBDaGVja1Byb2dyYW07XG5cdH1cblxuXHRpc1dlYkdMMigpIHtcblx0XHRyZXR1cm4gaXNXZWJHTDIodGhpcy5nbCk7XG5cdH1cblxuXHRwcml2YXRlIGdldCBxdWFkUG9zaXRpb25zQnVmZmVyKCkge1xuXHRcdGlmICh0aGlzLl9xdWFkUG9zaXRpb25zQnVmZmVyID09PSB1bmRlZmluZWQpIHtcblx0XHRcdGNvbnN0IGZzUXVhZFBvc2l0aW9ucyA9IG5ldyBGbG9hdDMyQXJyYXkoWyAtMSwgLTEsIDEsIC0xLCAtMSwgMSwgMSwgMSBdKTtcblx0XHRcdHRoaXMuX3F1YWRQb3NpdGlvbnNCdWZmZXIgPSB0aGlzLmluaXRWZXJ0ZXhCdWZmZXIoZnNRdWFkUG9zaXRpb25zKSE7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLl9xdWFkUG9zaXRpb25zQnVmZmVyITtcblx0fVxuXG5cdHByaXZhdGUgZ2V0IGJvdW5kYXJ5UG9zaXRpb25zQnVmZmVyKCkge1xuXHRcdGlmICh0aGlzLl9ib3VuZGFyeVBvc2l0aW9uc0J1ZmZlciA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRjb25zdCBib3VuZGFyeVBvc2l0aW9ucyA9IG5ldyBGbG9hdDMyQXJyYXkoWyAtMSwgLTEsIDEsIC0xLCAxLCAxLCAtMSwgMSwgLTEsIC0xIF0pO1xuXHRcdFx0dGhpcy5fYm91bmRhcnlQb3NpdGlvbnNCdWZmZXIgPSB0aGlzLmluaXRWZXJ0ZXhCdWZmZXIoYm91bmRhcnlQb3NpdGlvbnMpITtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuX2JvdW5kYXJ5UG9zaXRpb25zQnVmZmVyITtcblx0fVxuXG5cdHByaXZhdGUgZ2V0Q2lyY2xlUG9zaXRpb25zQnVmZmVyKG51bVNlZ21lbnRzOiBudW1iZXIpIHtcblx0XHRpZiAodGhpcy5fY2lyY2xlUG9zaXRpb25zQnVmZmVyW251bVNlZ21lbnRzXSA9PSB1bmRlZmluZWQpIHtcblx0XHRcdGNvbnN0IHVuaXRDaXJjbGVQb2ludHMgPSBbMCwgMF07XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8PSBudW1TZWdtZW50czsgaSsrKSB7XG5cdFx0XHRcdHVuaXRDaXJjbGVQb2ludHMucHVzaChcblx0XHRcdFx0XHRNYXRoLmNvcygyICogTWF0aC5QSSAqIGkgLyBudW1TZWdtZW50cyksXG5cdFx0XHRcdFx0TWF0aC5zaW4oMiAqIE1hdGguUEkgKiBpIC8gbnVtU2VnbWVudHMpLFxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdFx0Y29uc3QgY2lyY2xlUG9zaXRpb25zID0gbmV3IEZsb2F0MzJBcnJheSh1bml0Q2lyY2xlUG9pbnRzKTtcblx0XHRcdGNvbnN0IGJ1ZmZlciA9IHRoaXMuaW5pdFZlcnRleEJ1ZmZlcihjaXJjbGVQb3NpdGlvbnMpITtcblx0XHRcdHRoaXMuX2NpcmNsZVBvc2l0aW9uc0J1ZmZlcltudW1TZWdtZW50c10gPSBidWZmZXI7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLl9jaXJjbGVQb3NpdGlvbnNCdWZmZXJbbnVtU2VnbWVudHNdO1xuXHR9XG5cblx0cHJpdmF0ZSBpbml0VmVydGV4QnVmZmVyKFxuXHRcdGRhdGE6IEZsb2F0MzJBcnJheSxcblx0KSB7XG5cdFx0Y29uc3QgeyBlcnJvckNhbGxiYWNrLCBnbCB9ID0gdGhpcztcblx0XHRjb25zdCBidWZmZXIgPSBnbC5jcmVhdGVCdWZmZXIoKTtcblx0XHRpZiAoIWJ1ZmZlcikge1xuXHRcdFx0ZXJyb3JDYWxsYmFjaygnVW5hYmxlIHRvIGFsbG9jYXRlIGdsIGJ1ZmZlci4nKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGJ1ZmZlcik7XG5cdFx0Ly8gQWRkIGJ1ZmZlciBkYXRhLlxuXHRcdGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLCBkYXRhLCBnbC5TVEFUSUNfRFJBVyk7XG5cdFx0cmV0dXJuIGJ1ZmZlcjtcblx0fVxuXG5cdGluaXRQcm9ncmFtKFxuXHRcdHBhcmFtczoge1xuXHRcdFx0bmFtZTogc3RyaW5nLFxuXHRcdFx0ZnJhZ21lbnRTaGFkZXI6IHN0cmluZyB8IFdlYkdMU2hhZGVyLFxuXHRcdFx0dW5pZm9ybXM/OiB7XG5cdFx0XHRcdG5hbWU6IHN0cmluZyxcblx0XHRcdFx0dmFsdWU6IFVuaWZvcm1WYWx1ZVR5cGUsXG5cdFx0XHRcdGRhdGFUeXBlOiBVbmlmb3JtRGF0YVR5cGUsXG5cdFx0XHR9W10sXG5cdFx0XHRkZWZpbmVzPzoge1xuXHRcdFx0XHRba2V5IDogc3RyaW5nXTogc3RyaW5nLFxuXHRcdFx0fSxcblx0XHR9LFxuXHQpIHtcblx0XHQvLyBDaGVjayBwYXJhbXMuXG5cdFx0Y29uc3QgdmFsaWRLZXlzID0gWyduYW1lJywgJ2ZyYWdtZW50U2hhZGVyJywgJ3VuaWZvcm1zJywgJ2RlZmluZXMnXTtcblx0XHRPYmplY3Qua2V5cyhwYXJhbXMpLmZvckVhY2goa2V5ID0+IHtcblx0XHRcdGlmICh2YWxpZEtleXMuaW5kZXhPZihrZXkpIDwgMCkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQga2V5ICR7a2V5fSBwYXNzZWQgdG8gV2ViR0xDb21wdXRlLmluaXRQcm9ncmFtIHdpdGggbmFtZSBcIiR7cGFyYW1zLm5hbWV9XCIuICBWYWxpZCBrZXlzIGFyZSAke3ZhbGlkS2V5cy5qb2luKCcsICcpfS5gKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRjb25zdCB7IGdsLCBlcnJvckNhbGxiYWNrLCBnbHNsVmVyc2lvbiB9ID0gdGhpcztcblx0XHRyZXR1cm4gbmV3IEdQVVByb2dyYW0oXG5cdFx0XHR7XG5cdFx0XHRcdC4uLnBhcmFtcyxcblx0XHRcdFx0Z2wsXG5cdFx0XHRcdGVycm9yQ2FsbGJhY2ssXG5cdFx0XHRcdGdsc2xWZXJzaW9uLFxuXHRcdFx0fSxcblx0XHQpO1xuXHR9O1xuXG5cdGluaXREYXRhTGF5ZXIoXG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRuYW1lOiBzdHJpbmcsXG5cdFx0XHRkaW1lbnNpb25zOiBudW1iZXIgfCBbbnVtYmVyLCBudW1iZXJdLFxuXHRcdFx0dHlwZTogRGF0YUxheWVyVHlwZSxcblx0XHRcdG51bUNvbXBvbmVudHM6IERhdGFMYXllck51bUNvbXBvbmVudHMsXG5cdFx0XHRkYXRhPzogRGF0YUxheWVyQXJyYXlUeXBlLFxuXHRcdFx0ZmlsdGVyPzogRGF0YUxheWVyRmlsdGVyVHlwZSxcblx0XHRcdHdyYXBTPzogRGF0YUxheWVyV3JhcFR5cGUsXG5cdFx0XHR3cmFwVD86IERhdGFMYXllcldyYXBUeXBlLFxuXHRcdFx0d3JpdGFibGU/OiBib29sZWFuLFxuXHRcdFx0bnVtQnVmZmVycz86IG51bWJlcixcblx0XHR9LFxuXHQpIHtcblx0XHQvLyBDaGVjayBwYXJhbXMuXG5cdFx0Y29uc3QgdmFsaWRLZXlzID0gWyduYW1lJywgJ2RpbWVuc2lvbnMnLCAndHlwZScsICdudW1Db21wb25lbnRzJywgJ2RhdGEnLCAnZmlsdGVyJywgJ3dyYXBTJywgJ3dyYXBUJywgJ3dyaXRhYmxlJywgJ251bUJ1ZmZlcnMnXTtcblx0XHRPYmplY3Qua2V5cyhwYXJhbXMpLmZvckVhY2goa2V5ID0+IHtcblx0XHRcdGlmICh2YWxpZEtleXMuaW5kZXhPZihrZXkpIDwgMCkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQga2V5ICR7a2V5fSBwYXNzZWQgdG8gV2ViR0xDb21wdXRlLmluaXREYXRhTGF5ZXIgd2l0aCBuYW1lIFwiJHtwYXJhbXMubmFtZX1cIi4gIFZhbGlkIGtleXMgYXJlICR7dmFsaWRLZXlzLmpvaW4oJywgJyl9LmApO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdGNvbnN0IHsgZ2wsIGVycm9yQ2FsbGJhY2ssIGdsc2xWZXJzaW9uIH0gPSB0aGlzO1xuXHRcdHJldHVybiBuZXcgRGF0YUxheWVyKHtcblx0XHRcdC4uLnBhcmFtcyxcblx0XHRcdGdsLFxuXHRcdFx0Z2xzbFZlcnNpb24sXG5cdFx0XHRlcnJvckNhbGxiYWNrLFxuXHRcdH0pO1xuXHR9O1xuXG5cdGluaXRUZXh0dXJlKFxuXHRcdHBhcmFtczoge1xuXHRcdFx0bmFtZTogc3RyaW5nLFxuXHRcdFx0dXJsOiBzdHJpbmcsXG5cdFx0XHRmaWx0ZXI/OiBEYXRhTGF5ZXJGaWx0ZXJUeXBlLFxuXHRcdFx0d3JhcFM/OiBEYXRhTGF5ZXJXcmFwVHlwZSxcblx0XHRcdHdyYXBUPzogRGF0YUxheWVyV3JhcFR5cGUsXG5cdFx0XHRmb3JtYXQ/OiBUZXh0dXJlRm9ybWF0VHlwZSxcblx0XHRcdHR5cGU/OiBUZXh0dXJlRGF0YVR5cGUsXG5cdFx0XHRvbkxvYWQ/OiAodGV4dHVyZTogV2ViR0xUZXh0dXJlKSA9PiB2b2lkLFxuXHRcdH0sXG5cdCkge1xuXHRcdC8vIENoZWNrIHBhcmFtcy5cblx0XHRjb25zdCB2YWxpZEtleXMgPSBbJ25hbWUnLCAndXJsJywgJ2ZpbHRlcicsICd3cmFwUycsICd3cmFwVCcsICdmb3JtYXQnLCAndHlwZScsICdvbkxvYWQnXTtcblx0XHRPYmplY3Qua2V5cyhwYXJhbXMpLmZvckVhY2goa2V5ID0+IHtcblx0XHRcdGlmICh2YWxpZEtleXMuaW5kZXhPZihrZXkpIDwgMCkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQga2V5ICR7a2V5fSBwYXNzZWQgdG8gV2ViR0xDb21wdXRlLmluaXRUZXh0dXJlIHdpdGggbmFtZSBcIiR7cGFyYW1zLm5hbWV9XCIuICBWYWxpZCBrZXlzIGFyZSAke3ZhbGlkS2V5cy5qb2luKCcsICcpfS5gKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRjb25zdCB7IHVybCwgbmFtZSB9ID0gcGFyYW1zO1xuXHRcdGlmICghaXNTdHJpbmcodXJsKSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBXZWJHTENvbXB1dGUuaW5pdFRleHR1cmUgcGFyYW1zIHRvIGhhdmUgdXJsIG9mIHR5cGUgc3RyaW5nLCBnb3QgJHt1cmx9IG9mIHR5cGUgJHt0eXBlb2YgdXJsfS5gKVxuXHRcdH1cblx0XHRpZiAoIWlzU3RyaW5nKG5hbWUpKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIFdlYkdMQ29tcHV0ZS5pbml0VGV4dHVyZSBwYXJhbXMgdG8gaGF2ZSBuYW1lIG9mIHR5cGUgc3RyaW5nLCBnb3QgJHtuYW1lfSBvZiB0eXBlICR7dHlwZW9mIG5hbWV9LmApXG5cdFx0fVxuXG5cdFx0Ly8gR2V0IGZpbHRlciB0eXBlLCBkZWZhdWx0IHRvIG5lYXJlc3QuXG5cdFx0Y29uc3QgZmlsdGVyID0gcGFyYW1zLmZpbHRlciAhPT0gdW5kZWZpbmVkID8gcGFyYW1zLmZpbHRlciA6IE5FQVJFU1Q7XG5cdFx0aWYgKCFpc1ZhbGlkRmlsdGVyVHlwZShmaWx0ZXIpKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgZmlsdGVyOiAke2ZpbHRlcn0gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIiwgbXVzdCBiZSAke3ZhbGlkRmlsdGVyVHlwZXMuam9pbignLCAnKX0uYCk7XG5cdFx0fVxuXG5cdFx0Ly8gR2V0IHdyYXAgdHlwZXMsIGRlZmF1bHQgdG8gY2xhbXAgdG8gZWRnZS5cblx0XHRjb25zdCB3cmFwUyA9IHBhcmFtcy53cmFwUyAhPT0gdW5kZWZpbmVkID8gcGFyYW1zLndyYXBTIDogQ0xBTVBfVE9fRURHRTtcblx0XHRpZiAoIWlzVmFsaWRXcmFwVHlwZSh3cmFwUykpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB3cmFwUzogJHt3cmFwU30gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIiwgbXVzdCBiZSAke3ZhbGlkV3JhcFR5cGVzLmpvaW4oJywgJyl9LmApO1xuXHRcdH1cblx0XHRjb25zdCB3cmFwVCA9IHBhcmFtcy53cmFwVCAhPT0gdW5kZWZpbmVkID8gcGFyYW1zLndyYXBUIDogQ0xBTVBfVE9fRURHRTtcblx0XHRpZiAoIWlzVmFsaWRXcmFwVHlwZSh3cmFwVCkpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB3cmFwVDogJHt3cmFwVH0gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIiwgbXVzdCBiZSAke3ZhbGlkV3JhcFR5cGVzLmpvaW4oJywgJyl9LmApO1xuXHRcdH1cblxuXHRcdC8vIEdldCBpbWFnZSBmb3JtYXQgdHlwZSwgZGVmYXVsdCB0byByZ2JhLlxuXHRcdGNvbnN0IGZvcm1hdCA9IHBhcmFtcy5mb3JtYXQgIT09IHVuZGVmaW5lZCA/IHBhcmFtcy5mb3JtYXQgOiBSR0JBO1xuXHRcdGlmICghaXNWYWxpZFRleHR1cmVGb3JtYXRUeXBlKGZvcm1hdCkpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBmb3JtYXQ6ICR7Zm9ybWF0fSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLCBtdXN0IGJlICR7dmFsaWRUZXh0dXJlRm9ybWF0VHlwZXMuam9pbignLCAnKX0uYCk7XG5cdFx0fVxuXG5cdFx0Ly8gR2V0IGltYWdlIGRhdGEgdHlwZSwgZGVmYXVsdCB0byB1bnNpZ25lZCBieXRlLlxuXHRcdGNvbnN0IHR5cGUgPSBwYXJhbXMudHlwZSAhPT0gdW5kZWZpbmVkID8gcGFyYW1zLnR5cGUgOiBVTlNJR05FRF9CWVRFO1xuXHRcdGlmICghaXNWYWxpZFRleHR1cmVEYXRhVHlwZSh0eXBlKSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHR5cGU6ICR7dHlwZX0gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIiwgbXVzdCBiZSAke3ZhbGlkVGV4dHVyZURhdGFUeXBlcy5qb2luKCcsICcpfS5gKTtcblx0XHR9XG5cblx0XHRjb25zdCB7IGdsLCBlcnJvckNhbGxiYWNrIH0gPSB0aGlzO1xuXHRcdGNvbnN0IHRleHR1cmUgPSBnbC5jcmVhdGVUZXh0dXJlKCk7XG5cdFx0aWYgKHRleHR1cmUgPT09IG51bGwpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIGluaXQgZ2xUZXh0dXJlLmApO1xuXHRcdH1cblx0XHRnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCB0ZXh0dXJlKTtcblx0XHQvLyBCZWNhdXNlIGltYWdlcyBoYXZlIHRvIGJlIGRvd25sb2FkZWQgb3ZlciB0aGUgaW50ZXJuZXRcblx0XHQvLyB0aGV5IG1pZ2h0IHRha2UgYSBtb21lbnQgdW50aWwgdGhleSBhcmUgcmVhZHkuXG5cdFx0Ly8gVW50aWwgdGhlbiBwdXQgYSBzaW5nbGUgcGl4ZWwgaW4gdGhlIHRleHR1cmUgc28gd2UgY2FuXG5cdFx0Ly8gdXNlIGl0IGltbWVkaWF0ZWx5LiBXaGVuIHRoZSBpbWFnZSBoYXMgZmluaXNoZWQgZG93bmxvYWRpbmdcblx0XHQvLyB3ZSdsbCB1cGRhdGUgdGhlIHRleHR1cmUgd2l0aCB0aGUgY29udGVudHMgb2YgdGhlIGltYWdlLlxuXHRcdGNvbnN0IGxldmVsID0gMDtcblx0XHRjb25zdCBpbnRlcm5hbEZvcm1hdCA9IGdsLlJHQkE7XG5cdFx0Y29uc3Qgd2lkdGggPSAxO1xuXHRcdGNvbnN0IGhlaWdodCA9IDE7XG5cdFx0Y29uc3QgYm9yZGVyID0gMDtcblx0XHRjb25zdCBzcmNGb3JtYXQgPSBnbFtmb3JtYXRdO1xuXHRcdGNvbnN0IHNyY1R5cGUgPSBnbFt0eXBlXTtcblx0XHRjb25zdCBwaXhlbCA9IG5ldyBVaW50OEFycmF5KFswLCAwLCAwLCAwXSk7XG5cdFx0Z2wudGV4SW1hZ2UyRChnbC5URVhUVVJFXzJELCBsZXZlbCwgaW50ZXJuYWxGb3JtYXQsXG5cdFx0XHR3aWR0aCwgaGVpZ2h0LCBib3JkZXIsIHNyY0Zvcm1hdCwgc3JjVHlwZSwgcGl4ZWwpO1xuXG5cdFx0Y29uc3QgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcblx0XHRpbWFnZS5vbmxvYWQgPSAoKSA9PiB7XG5cdFx0XHRnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCB0ZXh0dXJlKTtcblx0XHRcdGdsLnRleEltYWdlMkQoZ2wuVEVYVFVSRV8yRCwgbGV2ZWwsIGludGVybmFsRm9ybWF0LFxuXHRcdFx0XHRzcmNGb3JtYXQsIHNyY1R5cGUsIGltYWdlKTtcblxuXHRcdFx0Ly8gV2ViR0wxIGhhcyBkaWZmZXJlbnQgcmVxdWlyZW1lbnRzIGZvciBwb3dlciBvZiAyIGltYWdlc1xuXHRcdFx0Ly8gdnMgbm9uIHBvd2VyIG9mIDIgaW1hZ2VzIHNvIGNoZWNrIGlmIHRoZSBpbWFnZSBpcyBhXG5cdFx0XHQvLyBwb3dlciBvZiAyIGluIGJvdGggZGltZW5zaW9ucy5cblx0XHRcdGlmIChpc1Bvd2VyT2YyKGltYWdlLndpZHRoKSAmJiBpc1Bvd2VyT2YyKGltYWdlLmhlaWdodCkpIHtcblx0XHRcdFx0Ly8gLy8gWWVzLCBpdCdzIGEgcG93ZXIgb2YgMi4gR2VuZXJhdGUgbWlwcy5cblx0XHRcdFx0Ly8gZ2wuZ2VuZXJhdGVNaXBtYXAoZ2wuVEVYVFVSRV8yRCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBUT0RPOiBmaW5pc2ggaW1wbGVtZW50aW5nIHRoaXMuXG5cdFx0XHRcdGNvbnNvbGUud2FybihgVGV4dHVyZSAke25hbWV9IGRpbWVuc2lvbnMgWyR7aW1hZ2Uud2lkdGh9LCAke2ltYWdlLmhlaWdodH1dIGFyZSBub3QgcG93ZXIgb2YgMi5gKTtcblx0XHRcdFx0Ly8gLy8gTm8sIGl0J3Mgbm90IGEgcG93ZXIgb2YgMi4gVHVybiBvZmYgbWlwcyBhbmQgc2V0XG5cdFx0XHRcdC8vIC8vIHdyYXBwaW5nIHRvIGNsYW1wIHRvIGVkZ2Vcblx0XHRcdFx0Ly8gZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfUywgZ2wuQ0xBTVBfVE9fRURHRSk7XG5cdFx0XHRcdC8vIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1QsIGdsLkNMQU1QX1RPX0VER0UpO1xuXHRcdFx0fVxuXHRcdFx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfUywgZ2xbd3JhcFNdKTtcblx0XHRcdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1QsIGdsW3dyYXBUXSk7XG5cdFx0XHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgZ2xbZmlsdGVyXSk7XG5cdFx0XHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgZ2xbZmlsdGVyXSk7XG5cblx0XHRcdC8vIENhbGxiYWNrIHdoZW4gdGV4dHVyZSBoYXMgbG9hZGVkLlxuXHRcdFx0aWYgKHBhcmFtcy5vbkxvYWQpIHBhcmFtcy5vbkxvYWQodGV4dHVyZSk7XG5cdFx0fTtcblx0XHRpbWFnZS5vbmVycm9yID0gKGUpID0+IHtcblx0XHRcdGVycm9yQ2FsbGJhY2soYEVycm9yIGxvYWRpbmcgaW1hZ2UgJHtuYW1lfTogJHtlfWApO1xuXHRcdH1cblx0XHRpbWFnZS5zcmMgPSB1cmw7XG5cblx0XHRyZXR1cm4gdGV4dHVyZTtcblx0fVxuXG5cdG9uUmVzaXplKGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQpIHtcblx0XHRjb25zdCB3aWR0aCA9IGNhbnZhcy5jbGllbnRXaWR0aDtcblx0XHRjb25zdCBoZWlnaHQgPSBjYW52YXMuY2xpZW50SGVpZ2h0O1xuXHRcdC8vIFNldCBjb3JyZWN0IGNhbnZhcyBwaXhlbCBzaXplLlxuXHRcdC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9XZWJHTF9BUEkvQnlfZXhhbXBsZS9DYW52YXNfc2l6ZV9hbmRfV2ViR0xcblx0XHRjYW52YXMud2lkdGggPSB3aWR0aDtcblx0XHRjYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xuXHRcdC8vIFNhdmUgZGltZW5zaW9ucy5cblx0XHR0aGlzLndpZHRoID0gd2lkdGg7XG5cdFx0dGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG5cdH07XG5cblx0cHJpdmF0ZSBkcmF3U2V0dXAoXG5cdFx0cHJvZ3JhbTogV2ViR0xQcm9ncmFtLFxuXHRcdGZ1bGxzY3JlZW5SZW5kZXI6IGJvb2xlYW4sXG5cdFx0aW5wdXQ/OiAoRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlKVtdIHwgRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlLFxuXHRcdG91dHB1dD86IERhdGFMYXllcixcblx0KSB7XG5cdFx0Y29uc3QgeyBnbCB9ID0gdGhpcztcblx0XHQvLyBDaGVjayBpZiB3ZSBhcmUgaW4gYW4gZXJyb3Igc3RhdGUuXG5cdFx0aWYgKCFwcm9ncmFtKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gQ0FVVElPTjogdGhlIG9yZGVyIG9mIHRoZXNlIG5leHQgZmV3IGxpbmVzIGlzIGltcG9ydGFudC5cblxuXHRcdC8vIEdldCBhIHNoYWxsb3cgY29weSBvZiBjdXJyZW50IHRleHR1cmVzLlxuXHRcdC8vIFRoaXMgbGluZSBtdXN0IGNvbWUgYmVmb3JlIHRoaXMuc2V0T3V0cHV0KCkgYXMgaXQgZGVwZW5kcyBvbiBjdXJyZW50IGludGVybmFsIHN0YXRlLlxuXHRcdGNvbnN0IGlucHV0VGV4dHVyZXM6IFdlYkdMVGV4dHVyZVtdID0gW107XG5cdFx0aWYgKGlucHV0KSB7XG5cdFx0XHRpZiAoaW5wdXQuY29uc3RydWN0b3IgPT09IFdlYkdMVGV4dHVyZSkge1xuXHRcdFx0XHRpbnB1dFRleHR1cmVzLnB1c2goaW5wdXQgYXMgV2ViR0xUZXh0dXJlKTtcblx0XHRcdH0gZWxzZSBpZiAoaW5wdXQuY29uc3RydWN0b3IgPT09IERhdGFMYXllcikge1xuXHRcdFx0XHRpbnB1dFRleHR1cmVzLnB1c2goKGlucHV0IGFzIERhdGFMYXllcikuZ2V0Q3VycmVudFN0YXRlVGV4dHVyZSgpKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgKGlucHV0IGFzIChEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUpW10pLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0Y29uc3QgbGF5ZXIgPSAoaW5wdXQgYXMgKERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSlbXSlbaV07XG5cdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRcdGlucHV0VGV4dHVyZXMucHVzaCgobGF5ZXIgYXMgRGF0YUxheWVyKS5nZXRDdXJyZW50U3RhdGVUZXh0dXJlID8gKGxheWVyIGFzIERhdGFMYXllcikuZ2V0Q3VycmVudFN0YXRlVGV4dHVyZSgpIDogbGF5ZXIgYXMgV2ViR0xUZXh0dXJlKVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gU2V0IG91dHB1dCBmcmFtZWJ1ZmZlci5cblx0XHQvLyBUaGlzIG1heSBtb2RpZnkgV2ViR0wgaW50ZXJuYWwgc3RhdGUuXG5cdFx0dGhpcy5zZXRPdXRwdXRMYXllcihmdWxsc2NyZWVuUmVuZGVyLCBpbnB1dCwgb3V0cHV0KTtcblxuXHRcdC8vIFNldCBjdXJyZW50IHByb2dyYW0uXG5cdFx0Z2wudXNlUHJvZ3JhbShwcm9ncmFtKTtcblxuXHRcdC8vIFNldCBpbnB1dCB0ZXh0dXJlcy5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGlucHV0VGV4dHVyZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGdsLmFjdGl2ZVRleHR1cmUoZ2wuVEVYVFVSRTAgKyBpKTtcblx0XHRcdGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIGlucHV0VGV4dHVyZXNbaV0pO1xuXHRcdH1cblx0fVxuXG5cdGNvcHlQcm9ncmFtRm9yVHlwZSh0eXBlOiBEYXRhTGF5ZXJUeXBlKSB7XG5cdFx0c3dpdGNoICh0eXBlKSB7XG5cdFx0XHRjYXNlIEhBTEZfRkxPQVQ6XG5cdFx0XHRjYXNlIEZMT0FUOlxuXHRcdFx0XHRyZXR1cm4gdGhpcy5jb3B5RmxvYXRQcm9ncmFtO1xuXHRcdFx0Y2FzZSBVTlNJR05FRF9CWVRFOlxuXHRcdFx0Y2FzZSBVTlNJR05FRF9TSE9SVDpcblx0XHRcdGNhc2UgVU5TSUdORURfSU5UOlxuXHRcdFx0XHRyZXR1cm4gdGhpcy5jb3B5VWludFByb2dyYW07XG5cdFx0XHRjYXNlIEJZVEU6XG5cdFx0XHRjYXNlIFNIT1JUOlxuXHRcdFx0Y2FzZSBJTlQ6XG5cdFx0XHRcdHJldHVybiB0aGlzLmNvcHlJbnRQcm9ncmFtO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHR5cGU6ICR7dHlwZX0gcGFzc2VkIHRvIFdlYkdMQ29tcHV0ZS5jb3B5UHJvZ3JhbUZvclR5cGUuYCk7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBzZXRCbGVuZE1vZGUoc2hvdWxkQmxlbmRBbHBoYT86IGJvb2xlYW4pIHtcblx0XHRjb25zdCB7IGdsIH0gPSB0aGlzO1xuXHRcdGlmIChzaG91bGRCbGVuZEFscGhhKSB7XG5cdFx0XHRnbC5lbmFibGUoZ2wuQkxFTkQpO1xuXHRcdFx0Z2wuYmxlbmRGdW5jKGdsLlNSQ19BTFBIQSwgZ2wuT05FX01JTlVTX1NSQ19BTFBIQSk7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBhZGRMYXllclRvSW5wdXRzKFxuXHRcdGxheWVyOiBEYXRhTGF5ZXIsXG5cdFx0aW5wdXQ/OiAgKERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSlbXSB8IERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSxcblx0KSB7XG5cdFx0Ly8gQWRkIGxheWVyIHRvIGVuZCBvZiBpbnB1dCBpZiBuZWVkZWQuXG5cdFx0bGV0IF9pbnB1dExheWVycyA9IGlucHV0O1xuXHRcdGlmIChpc0FycmF5KF9pbnB1dExheWVycykpIHtcblx0XHRcdGNvbnN0IGluZGV4ID0gKF9pbnB1dExheWVycyBhcyAoRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlKVtdKS5pbmRleE9mKGxheWVyKTtcblx0XHRcdGlmIChpbmRleCA8IDApIHtcblx0XHRcdFx0KF9pbnB1dExheWVycyBhcyAoRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlKVtdKS5wdXNoKGxheWVyKTtcblx0XHRcdH0gXG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmIChfaW5wdXRMYXllcnMgIT09IGxheWVyKSB7XG5cdFx0XHRcdGNvbnN0IHByZXZpb3VzID0gX2lucHV0TGF5ZXJzO1xuXHRcdFx0XHRfaW5wdXRMYXllcnMgPSBbXTtcblx0XHRcdFx0aWYgKHByZXZpb3VzKSAoX2lucHV0TGF5ZXJzIGFzIChEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUpW10pLnB1c2gocHJldmlvdXMpO1xuXHRcdFx0XHQoX2lucHV0TGF5ZXJzIGFzIChEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUpW10pLnB1c2gobGF5ZXIpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0X2lucHV0TGF5ZXJzID0gW19pbnB1dExheWVyc107XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBfaW5wdXRMYXllcnMgYXMgKERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSlbXTtcblx0fVxuXG5cdHByaXZhdGUgcGFzc1Rocm91Z2hMYXllckRhdGFGcm9tSW5wdXRUb091dHB1dChzdGF0ZTogRGF0YUxheWVyKSB7XG5cdFx0Ly8gVE9ETzogZmlndXJlIG91dCB0aGUgZmFzdGVzdCB3YXkgdG8gY29weSBhIHRleHR1cmUuXG5cdFx0Y29uc3QgY29weVByb2dyYW0gPSB0aGlzLmNvcHlQcm9ncmFtRm9yVHlwZShzdGF0ZS5pbnRlcm5hbFR5cGUpO1xuXHRcdHRoaXMuc3RlcCh7XG5cdFx0XHRwcm9ncmFtOiBjb3B5UHJvZ3JhbSxcblx0XHRcdGlucHV0OiBzdGF0ZSxcblx0XHRcdG91dHB1dDogc3RhdGUsXG5cdFx0fSk7XG5cdH1cblxuXHRwcml2YXRlIHNldE91dHB1dExheWVyKFxuXHRcdGZ1bGxzY3JlZW5SZW5kZXI6IGJvb2xlYW4sXG5cdFx0aW5wdXQ/OiAoRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlKVtdIHwgRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlLFxuXHRcdG91dHB1dD86IERhdGFMYXllciwgLy8gVW5kZWZpbmVkIHJlbmRlcnMgdG8gc2NyZWVuLlxuXHQpIHtcblx0XHRjb25zdCB7IGdsIH0gPSB0aGlzO1xuXG5cdFx0Ly8gUmVuZGVyIHRvIHNjcmVlbi5cblx0XHRpZiAoIW91dHB1dCkge1xuXHRcdFx0Z2wuYmluZEZyYW1lYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBudWxsKTtcblx0XHRcdC8vIFJlc2l6ZSB2aWV3cG9ydC5cblx0XHRcdGNvbnN0IHsgd2lkdGgsIGhlaWdodCB9ID0gdGhpcztcblx0XHRcdGdsLnZpZXdwb3J0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIENoZWNrIGlmIG91dHB1dCBpcyBzYW1lIGFzIG9uZSBvZiBpbnB1dCBsYXllcnMuXG5cdFx0aWYgKGlucHV0ICYmICgoaW5wdXQgPT09IG91dHB1dCkgfHwgKGlzQXJyYXkoaW5wdXQpICYmIChpbnB1dCBhcyAoRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlKVtdKS5pbmRleE9mKG91dHB1dCkgPiAtMSkpKSB7XG5cdFx0XHRpZiAob3V0cHV0Lm51bUJ1ZmZlcnMgPT09IDEpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgdXNlIHNhbWUgYnVmZmVyIGZvciBpbnB1dCBhbmQgb3V0cHV0IG9mIGEgcHJvZ3JhbS4gVHJ5IGluY3JlYXNpbmcgdGhlIG51bWJlciBvZiBidWZmZXJzIGluIHlvdXIgb3V0cHV0IGxheWVyIHRvIGF0IGxlYXN0IDIgc28geW91IGNhbiByZW5kZXIgdG8gbmV4dFN0YXRlIHVzaW5nIGN1cnJlbnRTdGF0ZSBhcyBhbiBpbnB1dC4nKTtcblx0XHRcdH1cblx0XHRcdGlmIChmdWxsc2NyZWVuUmVuZGVyKSB7XG5cdFx0XHRcdC8vIFJlbmRlciBhbmQgaW5jcmVtZW50IGJ1ZmZlciBzbyB3ZSBhcmUgcmVuZGVyaW5nIHRvIGEgZGlmZmVyZW50IHRhcmdldFxuXHRcdFx0XHQvLyB0aGFuIHRoZSBpbnB1dCB0ZXh0dXJlLlxuXHRcdFx0XHRvdXRwdXQuX2JpbmRPdXRwdXRCdWZmZXJGb3JXcml0ZSh0cnVlKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIFBhc3MgaW5wdXQgdGV4dHVyZSB0aHJvdWdoIHRvIG91dHB1dC5cblx0XHRcdFx0dGhpcy5wYXNzVGhyb3VnaExheWVyRGF0YUZyb21JbnB1dFRvT3V0cHV0KG91dHB1dCk7XG5cdFx0XHRcdC8vIFJlbmRlciB0byBvdXRwdXQgd2l0aG91dCBpbmNyZW1lbnRpbmcgYnVmZmVyLlxuXHRcdFx0XHRvdXRwdXQuX2JpbmRPdXRwdXRCdWZmZXJGb3JXcml0ZShmYWxzZSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmIChmdWxsc2NyZWVuUmVuZGVyKSB7XG5cdFx0XHRcdC8vIFJlbmRlciB0byBjdXJyZW50IGJ1ZmZlci5cblx0XHRcdFx0b3V0cHV0Ll9iaW5kT3V0cHV0QnVmZmVyRm9yV3JpdGUoZmFsc2UpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gSWYgd2UgYXJlIGRvaW5nIGEgc25lYWt5IHRoaW5nIHdpdGggYSBzd2FwcGVkIHRleHR1cmUgYW5kIGFyZVxuXHRcdFx0XHQvLyBvbmx5IHJlbmRlcmluZyBwYXJ0IG9mIHRoZSBzY3JlZW4sIHdlIG1heSBuZWVkIHRvIGFkZCBhIGNvcHkgb3BlcmF0aW9uLlxuXHRcdFx0XHRpZiAob3V0cHV0Ll91c2luZ1RleHR1cmVPdmVycmlkZUZvckN1cnJlbnRCdWZmZXIoKSkge1xuXHRcdFx0XHRcdHRoaXMucGFzc1Rocm91Z2hMYXllckRhdGFGcm9tSW5wdXRUb091dHB1dChvdXRwdXQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdG91dHB1dC5fYmluZE91dHB1dEJ1ZmZlckZvcldyaXRlKGZhbHNlKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0XG5cdFx0Ly8gUmVzaXplIHZpZXdwb3J0LlxuXHRcdGNvbnN0IFsgd2lkdGgsIGhlaWdodCBdID0gb3V0cHV0LmdldERpbWVuc2lvbnMoKTtcblx0XHRnbC52aWV3cG9ydCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcblx0fTtcblxuXHRwcml2YXRlIHNldFBvc2l0aW9uQXR0cmlidXRlKHByb2dyYW06IFdlYkdMUHJvZ3JhbSwgcHJvZ3JhbU5hbWU6IHN0cmluZykge1xuXHRcdHRoaXMuc2V0VmVydGV4QXR0cmlidXRlKHByb2dyYW0sICdhX2ludGVybmFsX3Bvc2l0aW9uJywgMiwgcHJvZ3JhbU5hbWUpO1xuXHR9XG5cblx0cHJpdmF0ZSBzZXRJbmRleEF0dHJpYnV0ZShwcm9ncmFtOiBXZWJHTFByb2dyYW0sIHByb2dyYW1OYW1lOiBzdHJpbmcpIHtcblx0XHR0aGlzLnNldFZlcnRleEF0dHJpYnV0ZShwcm9ncmFtLCAnYV9pbnRlcm5hbF9pbmRleCcsIDEsIHByb2dyYW1OYW1lKTtcblx0fVxuXG5cdHByaXZhdGUgc2V0VVZBdHRyaWJ1dGUocHJvZ3JhbTogV2ViR0xQcm9ncmFtLCBwcm9ncmFtTmFtZTogc3RyaW5nKSB7XG5cdFx0dGhpcy5zZXRWZXJ0ZXhBdHRyaWJ1dGUocHJvZ3JhbSwgJ2FfaW50ZXJuYWxfdXYnLCAyLCBwcm9ncmFtTmFtZSk7XG5cdH1cblxuXHRwcml2YXRlIHNldFZlcnRleEF0dHJpYnV0ZShwcm9ncmFtOiBXZWJHTFByb2dyYW0sIG5hbWU6IHN0cmluZywgc2l6ZTogbnVtYmVyLCBwcm9ncmFtTmFtZTogc3RyaW5nKSB7XG5cdFx0Y29uc3QgeyBnbCB9ID0gdGhpcztcblx0XHQvLyBQb2ludCBhdHRyaWJ1dGUgdG8gdGhlIGN1cnJlbnRseSBib3VuZCBWQk8uXG5cdFx0Y29uc3QgbG9jYXRpb24gPSBnbC5nZXRBdHRyaWJMb2NhdGlvbihwcm9ncmFtLCBuYW1lKTtcblx0XHRpZiAobG9jYXRpb24gPCAwKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byBmaW5kIHZlcnRleCBhdHRyaWJ1dGUgXCIke25hbWV9XCIgaW4gcHJvZ3JhbSBcIiR7cHJvZ3JhbU5hbWV9XCIuYCk7XG5cdFx0fVxuXHRcdC8vIFRPRE86IG9ubHkgZmxvYXQgaXMgc3VwcG9ydGVkIGZvciB2ZXJ0ZXggYXR0cmlidXRlcy5cblx0XHRnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGxvY2F0aW9uLCBzaXplLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xuXHRcdC8vIEVuYWJsZSB0aGUgYXR0cmlidXRlLlxuXHRcdGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KGxvY2F0aW9uKTtcblx0fVxuXG5cdC8vIFN0ZXAgZm9yIGVudGlyZSBmdWxsc2NyZWVuIHF1YWQuXG5cdHN0ZXAoXG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRwcm9ncmFtOiBHUFVQcm9ncmFtLFxuXHRcdFx0aW5wdXQ/OiAgKERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSlbXSB8IERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSxcblx0XHRcdG91dHB1dD86IERhdGFMYXllciwgLy8gVW5kZWZpbmVkIHJlbmRlcnMgdG8gc2NyZWVuLlxuXHRcdFx0c2hvdWxkQmxlbmRBbHBoYT86IGJvb2xlYW4sXG5cdFx0fSxcblx0KSB7XG5cdFx0Y29uc3QgeyBnbCwgZXJyb3JTdGF0ZSwgcXVhZFBvc2l0aW9uc0J1ZmZlciB9ID0gdGhpcztcblx0XHRjb25zdCB7IHByb2dyYW0sIGlucHV0LCBvdXRwdXQgfSA9IHBhcmFtcztcblxuXHRcdC8vIElnbm9yZSBpZiB3ZSBhcmUgaW4gZXJyb3Igc3RhdGUuXG5cdFx0aWYgKGVycm9yU3RhdGUpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBnbFByb2dyYW0gPSBwcm9ncmFtLmRlZmF1bHRQcm9ncmFtITtcblxuXHRcdC8vIERvIHNldHVwIC0gdGhpcyBtdXN0IGNvbWUgZmlyc3QuXG5cdFx0dGhpcy5kcmF3U2V0dXAoZ2xQcm9ncmFtLCB0cnVlLCBpbnB1dCwgb3V0cHV0KTtcblxuXHRcdC8vIFVwZGF0ZSB1bmlmb3JtcyBhbmQgYnVmZmVycy5cblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF9zY2FsZScsIFsxLCAxXSwgRkxPQVQpO1xuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3RyYW5zbGF0aW9uJywgWzAsIDBdLCBGTE9BVCk7XG5cdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHF1YWRQb3NpdGlvbnNCdWZmZXIpO1xuXHRcdHRoaXMuc2V0UG9zaXRpb25BdHRyaWJ1dGUoZ2xQcm9ncmFtLCBwcm9ncmFtLm5hbWUpO1xuXG5cdFx0Ly8gRHJhdy5cblx0XHR0aGlzLnNldEJsZW5kTW9kZShwYXJhbXMuc2hvdWxkQmxlbmRBbHBoYSk7XG5cdFx0Z2wuZHJhd0FycmF5cyhnbC5UUklBTkdMRV9TVFJJUCwgMCwgNCk7XG5cdFx0Z2wuZGlzYWJsZShnbC5CTEVORCk7XG5cdH1cblxuXHQvLyBTdGVwIHByb2dyYW0gb25seSBmb3IgYSBzdHJpcCBvZiBweCBhbG9uZyB0aGUgYm91bmRhcnkuXG5cdHN0ZXBCb3VuZGFyeShcblx0XHRwYXJhbXM6IHtcblx0XHRcdHByb2dyYW06IEdQVVByb2dyYW0sXG5cdFx0XHRpbnB1dD86ICAoRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlKVtdIHwgRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlLFxuXHRcdFx0b3V0cHV0PzogRGF0YUxheWVyLCAvLyBVbmRlZmluZWQgcmVuZGVycyB0byBzY3JlZW4uXG5cdFx0XHRzaW5nbGVFZGdlPzogJ0xFRlQnIHwgJ1JJR0hUJyB8ICdUT1AnIHwgJ0JPVFRPTSc7XG5cdFx0XHRzaG91bGRCbGVuZEFscGhhPzogYm9vbGVhbixcblx0XHR9LFxuXHQpIHtcblx0XHRjb25zdCB7IGdsLCBlcnJvclN0YXRlLCBib3VuZGFyeVBvc2l0aW9uc0J1ZmZlcn0gPSB0aGlzO1xuXHRcdGNvbnN0IHsgcHJvZ3JhbSwgaW5wdXQsIG91dHB1dCB9ID0gcGFyYW1zO1xuXHRcdGNvbnN0IFsgd2lkdGgsIGhlaWdodCBdID0gb3V0cHV0ID8gb3V0cHV0LmdldERpbWVuc2lvbnMoKSA6IFsgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQgXTtcblxuXHRcdC8vIElnbm9yZSBpZiB3ZSBhcmUgaW4gZXJyb3Igc3RhdGUuXG5cdFx0aWYgKGVycm9yU3RhdGUpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBnbFByb2dyYW0gPSBwcm9ncmFtLmRlZmF1bHRQcm9ncmFtITtcblxuXHRcdC8vIERvIHNldHVwIC0gdGhpcyBtdXN0IGNvbWUgZmlyc3QuXG5cdFx0dGhpcy5kcmF3U2V0dXAoZ2xQcm9ncmFtLCBmYWxzZSwgaW5wdXQsIG91dHB1dCk7XG5cblx0XHQvLyBVcGRhdGUgdW5pZm9ybXMgYW5kIGJ1ZmZlcnMuXG5cdFx0Ly8gRnJhbWUgbmVlZHMgdG8gYmUgb2Zmc2V0IGFuZCBzY2FsZWQgc28gdGhhdCBhbGwgZm91ciBzaWRlcyBhcmUgaW4gdmlld3BvcnQuXG5cdFx0Y29uc3Qgb25lUHggPSBbIDEgLyB3aWR0aCwgMSAvIGhlaWdodF0gYXMgW251bWJlciwgbnVtYmVyXTtcblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF9zY2FsZScsIFsxIC0gb25lUHhbMF0sIDEgLSBvbmVQeFsxXV0sIEZMT0FUKTtcblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF90cmFuc2xhdGlvbicsIG9uZVB4LCBGTE9BVCk7XG5cdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGJvdW5kYXJ5UG9zaXRpb25zQnVmZmVyKTtcblx0XHR0aGlzLnNldFBvc2l0aW9uQXR0cmlidXRlKGdsUHJvZ3JhbSwgcHJvZ3JhbS5uYW1lKTtcblxuXHRcdC8vIERyYXcuXG5cdFx0dGhpcy5zZXRCbGVuZE1vZGUocGFyYW1zLnNob3VsZEJsZW5kQWxwaGEpO1xuXHRcdGlmIChwYXJhbXMuc2luZ2xlRWRnZSkge1xuXHRcdFx0c3dpdGNoKHBhcmFtcy5zaW5nbGVFZGdlKSB7XG5cdFx0XHRcdGNhc2UgJ0xFRlQnOlxuXHRcdFx0XHRcdGdsLmRyYXdBcnJheXMoZ2wuTElORVMsIDMsIDIpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICdSSUdIVCc6XG5cdFx0XHRcdFx0Z2wuZHJhd0FycmF5cyhnbC5MSU5FUywgMSwgMik7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgJ1RPUCc6XG5cdFx0XHRcdFx0Z2wuZHJhd0FycmF5cyhnbC5MSU5FUywgMiwgMik7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgJ0JPVFRPTSc6XG5cdFx0XHRcdFx0Z2wuZHJhd0FycmF5cyhnbC5MSU5FUywgMCwgMik7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbmtub3duIGJvdW5kYXJ5IGVkZ2UgdHlwZTogJHtwYXJhbXMuc2luZ2xlRWRnZX0uYCk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGdsLmRyYXdBcnJheXMoZ2wuTElORV9MT09QLCAwLCA0KTtcblx0XHR9XG5cdFx0Z2wuZGlzYWJsZShnbC5CTEVORCk7XG5cdH1cblxuXHQvLyBTdGVwIHByb2dyYW0gZm9yIGFsbCBidXQgYSBzdHJpcCBvZiBweCBhbG9uZyB0aGUgYm91bmRhcnkuXG5cdHN0ZXBOb25Cb3VuZGFyeShcblx0XHRwYXJhbXM6IHtcblx0XHRcdHByb2dyYW06IEdQVVByb2dyYW0sXG5cdFx0XHRpbnB1dD86ICAoRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlKVtdIHwgRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlLFxuXHRcdFx0b3V0cHV0PzogRGF0YUxheWVyLCAvLyBVbmRlZmluZWQgcmVuZGVycyB0byBzY3JlZW4uXG5cdFx0XHRzaG91bGRCbGVuZEFscGhhPzogYm9vbGVhbixcblx0XHR9LFxuXHQpIHtcblx0XHRjb25zdCB7IGdsLCBlcnJvclN0YXRlLCBxdWFkUG9zaXRpb25zQnVmZmVyIH0gPSB0aGlzO1xuXHRcdGNvbnN0IHsgcHJvZ3JhbSwgaW5wdXQsIG91dHB1dCB9ID0gcGFyYW1zO1xuXHRcdGNvbnN0IFsgd2lkdGgsIGhlaWdodCBdID0gb3V0cHV0ID8gb3V0cHV0LmdldERpbWVuc2lvbnMoKSA6IFsgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQgXTtcblxuXHRcdC8vIElnbm9yZSBpZiB3ZSBhcmUgaW4gZXJyb3Igc3RhdGUuXG5cdFx0aWYgKGVycm9yU3RhdGUpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBnbFByb2dyYW0gPSBwcm9ncmFtLmRlZmF1bHRQcm9ncmFtITtcblxuXHRcdC8vIERvIHNldHVwIC0gdGhpcyBtdXN0IGNvbWUgZmlyc3QuXG5cdFx0dGhpcy5kcmF3U2V0dXAoZ2xQcm9ncmFtLCBmYWxzZSwgaW5wdXQsIG91dHB1dCk7XG5cblx0XHQvLyBVcGRhdGUgdW5pZm9ybXMgYW5kIGJ1ZmZlcnMuXG5cdFx0Y29uc3Qgb25lUHggPSBbIDEgLyB3aWR0aCwgMSAvIGhlaWdodF0gYXMgW251bWJlciwgbnVtYmVyXTtcblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF9zY2FsZScsIFsxIC0gMiAqIG9uZVB4WzBdLCAxIC0gMiAqIG9uZVB4WzFdXSwgRkxPQVQpO1xuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3RyYW5zbGF0aW9uJywgb25lUHgsIEZMT0FUKTtcblx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgcXVhZFBvc2l0aW9uc0J1ZmZlcik7XG5cdFx0dGhpcy5zZXRQb3NpdGlvbkF0dHJpYnV0ZShnbFByb2dyYW0sIHByb2dyYW0ubmFtZSk7XG5cdFx0XG5cdFx0Ly8gRHJhdy5cblx0XHR0aGlzLnNldEJsZW5kTW9kZShwYXJhbXMuc2hvdWxkQmxlbmRBbHBoYSk7XG5cdFx0Z2wuZHJhd0FycmF5cyhnbC5UUklBTkdMRV9TVFJJUCwgMCwgNCk7XG5cdFx0Z2wuZGlzYWJsZShnbC5CTEVORCk7XG5cdH1cblxuXHQvLyBTdGVwIHByb2dyYW0gb25seSBmb3IgYSBjaXJjdWxhciBzcG90LlxuXHRzdGVwQ2lyY2xlKFxuXHRcdHBhcmFtczoge1xuXHRcdFx0cHJvZ3JhbTogR1BVUHJvZ3JhbSxcblx0XHRcdHBvc2l0aW9uOiBbbnVtYmVyLCBudW1iZXJdLCAvLyBQb3NpdGlvbiBpcyBpbiBzY3JlZW4gc3BhY2UgY29vcmRzLlxuXHRcdFx0cmFkaXVzOiBudW1iZXIsIC8vIFJhZGl1cyBpcyBpbiBzY3JlZW4gc3BhY2UgdW5pdHMuXG5cdFx0XHRpbnB1dD86ICAoRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlKVtdIHwgRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlLFxuXHRcdFx0b3V0cHV0PzogRGF0YUxheWVyLCAvLyBVbmRlZmluZWQgcmVuZGVycyB0byBzY3JlZW4uXG5cdFx0XHRudW1TZWdtZW50cz86IG51bWJlcixcblx0XHRcdHNob3VsZEJsZW5kQWxwaGE/OiBib29sZWFuLFxuXHRcdH0sXG5cdCkge1xuXHRcdGNvbnN0IHsgZ2wsIGVycm9yU3RhdGUsIHdpZHRoLCBoZWlnaHQgfSA9IHRoaXM7XG5cdFx0Y29uc3QgeyBwcm9ncmFtLCBwb3NpdGlvbiwgcmFkaXVzLCBpbnB1dCwgb3V0cHV0IH0gPSBwYXJhbXM7XG5cblx0XHQvLyBJZ25vcmUgaWYgd2UgYXJlIGluIGVycm9yIHN0YXRlLlxuXHRcdGlmIChlcnJvclN0YXRlKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgZ2xQcm9ncmFtID0gcHJvZ3JhbS5kZWZhdWx0UHJvZ3JhbSE7XG5cblx0XHQvLyBEbyBzZXR1cCAtIHRoaXMgbXVzdCBjb21lIGZpcnN0LlxuXHRcdHRoaXMuZHJhd1NldHVwKGdsUHJvZ3JhbSwgZmFsc2UsIGlucHV0LCBvdXRwdXQpO1xuXG5cdFx0Ly8gVXBkYXRlIHVuaWZvcm1zIGFuZCBidWZmZXJzLlxuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3NjYWxlJywgW3JhZGl1cyAqIDIgLyB3aWR0aCwgcmFkaXVzICogMiAvIGhlaWdodF0sIEZMT0FUKTtcblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF90cmFuc2xhdGlvbicsIFsyICogcG9zaXRpb25bMF0gLyB3aWR0aCAtIDEsIDIgKiBwb3NpdGlvblsxXSAvIGhlaWdodCAtIDFdLCBGTE9BVCk7XG5cdFx0Y29uc3QgbnVtU2VnbWVudHMgPSBwYXJhbXMubnVtU2VnbWVudHMgPyBwYXJhbXMubnVtU2VnbWVudHMgOiBERUZBVUxUX0NJUkNMRV9OVU1fU0VHTUVOVFM7XG5cdFx0aWYgKG51bVNlZ21lbnRzIDwgMykge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBudW1TZWdtZW50cyBmb3IgV2ViR0xDb21wdXRlLnN0ZXBDaXJjbGUgbXVzdCBiZSBncmVhdGVyIHRoYW4gMiwgZ290ICR7bnVtU2VnbWVudHN9LmApO1xuXHRcdH1cblx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdGhpcy5nZXRDaXJjbGVQb3NpdGlvbnNCdWZmZXIobnVtU2VnbWVudHMpKTtcblx0XHR0aGlzLnNldFBvc2l0aW9uQXR0cmlidXRlKGdsUHJvZ3JhbSwgcHJvZ3JhbS5uYW1lKTtcblx0XHRcblx0XHQvLyBEcmF3LlxuXHRcdHRoaXMuc2V0QmxlbmRNb2RlKHBhcmFtcy5zaG91bGRCbGVuZEFscGhhKTtcblx0XHRnbC5kcmF3QXJyYXlzKGdsLlRSSUFOR0xFX0ZBTiwgMCwgbnVtU2VnbWVudHMgKyAyKTtcdFxuXHRcdGdsLmRpc2FibGUoZ2wuQkxFTkQpO1xuXHR9XG5cblx0Ly8gU3RlcCBwcm9ncmFtIG9ubHkgZm9yIGEgdGhpY2tlbmVkIGxpbmUgc2VnbWVudCAocm91bmRlZCBlbmQgY2FwcyBhdmFpbGFibGUpLlxuXHRzdGVwU2VnbWVudChcblx0XHRwYXJhbXM6IHtcblx0XHRcdHByb2dyYW06IEdQVVByb2dyYW0sXG5cdFx0XHRwb3NpdGlvbjE6IFtudW1iZXIsIG51bWJlcl0sIC8vIFBvc2l0aW9uIGlzIGluIHNjcmVlbiBzcGFjZSBjb29yZHMuXG5cdFx0XHRwb3NpdGlvbjI6IFtudW1iZXIsIG51bWJlcl0sIC8vIFBvc2l0aW9uIGlzIGluIHNjcmVlbiBzcGFjZSBjb29yZHMuXG5cdFx0XHR0aGlja25lc3M6IG51bWJlciwgLy8gVGhpY2tuZXNzIGlzIGluIHB4LlxuXHRcdFx0aW5wdXQ/OiAgKERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSlbXSB8IERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSxcblx0XHRcdG91dHB1dD86IERhdGFMYXllciwgLy8gVW5kZWZpbmVkIHJlbmRlcnMgdG8gc2NyZWVuLlxuXHRcdFx0ZW5kQ2Fwcz86IGJvb2xlYW4sXG5cdFx0XHRudW1DYXBTZWdtZW50cz86IG51bWJlcixcblx0XHRcdHNob3VsZEJsZW5kQWxwaGE/OiBib29sZWFuLFxuXHRcdH0sXG5cdCkge1xuXHRcdGNvbnN0IHsgZ2wsIGVycm9yU3RhdGUgfSA9IHRoaXM7XG5cdFx0Y29uc3QgeyBwcm9ncmFtLCBwb3NpdGlvbjEsIHBvc2l0aW9uMiwgdGhpY2tuZXNzLCBpbnB1dCwgb3V0cHV0IH0gPSBwYXJhbXM7XG5cdFx0Y29uc3QgWyB3aWR0aCwgaGVpZ2h0IF0gPSBvdXRwdXQgPyBvdXRwdXQuZ2V0RGltZW5zaW9ucygpIDogWyB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCBdO1xuXG5cdFx0Ly8gSWdub3JlIGlmIHdlIGFyZSBpbiBlcnJvciBzdGF0ZS5cblx0XHRpZiAoZXJyb3JTdGF0ZSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGdsUHJvZ3JhbSA9IHByb2dyYW0uc2VnbWVudFByb2dyYW0hO1xuXG5cdFx0Ly8gRG8gc2V0dXAgLSB0aGlzIG11c3QgY29tZSBmaXJzdC5cblx0XHR0aGlzLmRyYXdTZXR1cChnbFByb2dyYW0sIGZhbHNlLCBpbnB1dCwgb3V0cHV0KTtcblxuXHRcdC8vIFVwZGF0ZSB1bmlmb3JtcyBhbmQgYnVmZmVycy5cblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF9oYWxmVGhpY2tuZXNzJywgdGhpY2tuZXNzIC8gMiwgRkxPQVQpO1xuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3NjYWxlJywgWzIgLyB3aWR0aCwgMiAvIGhlaWdodF0sIEZMT0FUKTtcblx0XHRjb25zdCBkaWZmWCA9IHBvc2l0aW9uMVswXSAtIHBvc2l0aW9uMlswXTtcblx0XHRjb25zdCBkaWZmWSA9IHBvc2l0aW9uMVsxXSAtIHBvc2l0aW9uMlsxXTtcblx0XHRjb25zdCBhbmdsZSA9IE1hdGguYXRhbjIoZGlmZlksIGRpZmZYKTtcblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF9yb3RhdGlvbicsIGFuZ2xlLCBGTE9BVCk7XG5cdFx0Y29uc3QgY2VudGVyWCA9IChwb3NpdGlvbjFbMF0gKyBwb3NpdGlvbjJbMF0pIC8gMjtcblx0XHRjb25zdCBjZW50ZXJZID0gKHBvc2l0aW9uMVsxXSArIHBvc2l0aW9uMlsxXSkgLyAyO1xuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3RyYW5zbGF0aW9uJywgWzIgKiBjZW50ZXJYIC8gdGhpcy53aWR0aCAtIDEsIDIgKiBjZW50ZXJZIC8gdGhpcy5oZWlnaHQgLSAxXSwgRkxPQVQpO1xuXHRcdGNvbnN0IGxlbmd0aCA9IE1hdGguc3FydChkaWZmWCAqIGRpZmZYICsgZGlmZlkgKiBkaWZmWSk7XG5cdFx0XG5cdFx0Y29uc3QgbnVtU2VnbWVudHMgPSBwYXJhbXMubnVtQ2FwU2VnbWVudHMgPyBwYXJhbXMubnVtQ2FwU2VnbWVudHMgKiAyIDogREVGQVVMVF9DSVJDTEVfTlVNX1NFR01FTlRTO1xuXHRcdGlmIChwYXJhbXMuZW5kQ2Fwcykge1xuXHRcdFx0aWYgKG51bVNlZ21lbnRzIDwgNiB8fCBudW1TZWdtZW50cyAlIDYgIT09IDApIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBudW1TZWdtZW50cyBmb3IgV2ViR0xDb21wdXRlLnN0ZXBTZWdtZW50IG11c3QgYmUgZGl2aXNpYmxlIGJ5IDYsIGdvdCAke251bVNlZ21lbnRzfS5gKTtcblx0XHRcdH1cblx0XHRcdC8vIEhhdmUgdG8gc3VidHJhY3QgYSBzbWFsbCBvZmZzZXQgZnJvbSBsZW5ndGguXG5cdFx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF9sZW5ndGgnLCBsZW5ndGggLSB0aGlja25lc3MgKiBNYXRoLnNpbihNYXRoLlBJIC8gbnVtU2VnbWVudHMpLCBGTE9BVCk7XG5cdFx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdGhpcy5nZXRDaXJjbGVQb3NpdGlvbnNCdWZmZXIobnVtU2VnbWVudHMpKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gSGF2ZSB0byBzdWJ0cmFjdCBhIHNtYWxsIG9mZnNldCBmcm9tIGxlbmd0aC5cblx0XHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX2xlbmd0aCcsIGxlbmd0aCAtIHRoaWNrbmVzcywgRkxPQVQpO1xuXHRcdFx0Ly8gVXNlIGEgcmVjdGFuZ2xlIGluIGNhc2Ugb2Ygbm8gY2Fwcy5cblx0XHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLnF1YWRQb3NpdGlvbnNCdWZmZXIpO1xuXHRcdH1cblxuXHRcdHRoaXMuc2V0UG9zaXRpb25BdHRyaWJ1dGUoZ2xQcm9ncmFtLCBwcm9ncmFtLm5hbWUpO1xuXHRcdFxuXHRcdC8vIERyYXcuXG5cdFx0dGhpcy5zZXRCbGVuZE1vZGUocGFyYW1zLnNob3VsZEJsZW5kQWxwaGEpO1xuXHRcdGlmIChwYXJhbXMuZW5kQ2Fwcykge1xuXHRcdFx0Z2wuZHJhd0FycmF5cyhnbC5UUklBTkdMRV9GQU4sIDAsIG51bVNlZ21lbnRzICsgMik7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGdsLmRyYXdBcnJheXMoZ2wuVFJJQU5HTEVfU1RSSVAsIDAsIDQpO1xuXHRcdH1cblx0XHRnbC5kaXNhYmxlKGdsLkJMRU5EKTtcblx0fVxuXG5cdHN0ZXBQb2x5bGluZShcblx0XHRwYXJhbXM6IHtcblx0XHRcdHByb2dyYW06IEdQVVByb2dyYW0sXG5cdFx0XHRwb3NpdGlvbnM6IFtudW1iZXIsIG51bWJlcl1bXSxcblx0XHRcdHRoaWNrbmVzczogbnVtYmVyLCAvLyBUaGlja25lc3Mgb2YgbGluZSBpcyBpbiBweC5cblx0XHRcdGlucHV0PzogKERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSlbXSB8IERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSxcblx0XHRcdG91dHB1dD86IERhdGFMYXllciwgLy8gVW5kZWZpbmVkIHJlbmRlcnMgdG8gc2NyZWVuLlxuXHRcdFx0Y2xvc2VMb29wPzogYm9vbGVhbixcblx0XHRcdGluY2x1ZGVVVnM/OiBib29sZWFuLFxuXHRcdFx0aW5jbHVkZU5vcm1hbHM/OiBib29sZWFuLFxuXHRcdFx0c2hvdWxkQmxlbmRBbHBoYT86IGJvb2xlYW4sXG5cdFx0fSxcblx0KSB7XG5cdFx0Y29uc3QgeyBwcm9ncmFtLCBpbnB1dCwgb3V0cHV0IH0gPSBwYXJhbXM7XG5cdFx0Y29uc3QgdmVydGljZXMgPSBwYXJhbXMucG9zaXRpb25zO1xuXHRcdGNvbnN0IGNsb3NlTG9vcCA9ICEhcGFyYW1zLmNsb3NlTG9vcDtcblx0XHRcblx0XHRjb25zdCB7IGdsLCB3aWR0aCwgaGVpZ2h0LCBlcnJvclN0YXRlIH0gPSB0aGlzO1xuXG5cdFx0Ly8gSWdub3JlIGlmIHdlIGFyZSBpbiBlcnJvciBzdGF0ZS5cblx0XHRpZiAoZXJyb3JTdGF0ZSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIE9mZnNldCB2ZXJ0aWNlcy5cblx0XHRjb25zdCBoYWxmVGhpY2tuZXNzID0gcGFyYW1zLnRoaWNrbmVzcyAvIDI7XG5cdFx0Y29uc3QgbnVtUG9zaXRpb25zID0gY2xvc2VMb29wID8gdmVydGljZXMubGVuZ3RoICogNCArIDIgOiAodmVydGljZXMubGVuZ3RoIC0gMSkgKiA0O1xuXHRcdGNvbnN0IHBvc2l0aW9ucyA9IG5ldyBGbG9hdDMyQXJyYXkoMiAqIG51bVBvc2l0aW9ucyk7XG5cdFx0Y29uc3QgdXZzID0gcGFyYW1zLmluY2x1ZGVVVnMgPyBuZXcgRmxvYXQzMkFycmF5KDIgKiBudW1Qb3NpdGlvbnMpIDogdW5kZWZpbmVkO1xuXHRcdGNvbnN0IG5vcm1hbHMgPSBwYXJhbXMuaW5jbHVkZU5vcm1hbHMgPyBuZXcgRmxvYXQzMkFycmF5KDIgKiBudW1Qb3NpdGlvbnMpIDogdW5kZWZpbmVkO1xuXG5cdFx0Ly8gdG1wIGFycmF5cy5cblx0XHRjb25zdCBzMSA9IFswLCAwXTtcblx0XHRjb25zdCBzMiA9IFswLCAwXTtcblx0XHRjb25zdCBuMSA9IFswLCAwXTtcblx0XHRjb25zdCBuMiA9IFswLCAwXTtcblx0XHRjb25zdCBuMyA9IFswLCAwXTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHZlcnRpY2VzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRpZiAoIWNsb3NlTG9vcCAmJiBpID09PSB2ZXJ0aWNlcy5sZW5ndGggLSAxKSBjb250aW51ZTtcblx0XHRcdC8vIFZlcnRpY2VzIG9uIHRoaXMgc2VnbWVudC5cblx0XHRcdGNvbnN0IHYxID0gdmVydGljZXNbaV07XG5cdFx0XHRjb25zdCB2MiA9IHZlcnRpY2VzWyhpICsgMSkgJSB2ZXJ0aWNlcy5sZW5ndGhdO1xuXHRcdFx0czFbMF0gPSB2MlswXSAtIHYxWzBdO1xuXHRcdFx0czFbMV0gPSB2MlsxXSAtIHYxWzFdO1xuXHRcdFx0Y29uc3QgbGVuZ3RoMSA9IE1hdGguc3FydChzMVswXSAqIHMxWzBdICsgczFbMV0gKiBzMVsxXSk7XG5cdFx0XHRuMVswXSA9IHMxWzFdIC8gbGVuZ3RoMTtcblx0XHRcdG4xWzFdID0gLSBzMVswXSAvIGxlbmd0aDE7XG5cblx0XHRcdGNvbnN0IGluZGV4ID0gaSAqIDQgKyAyO1xuXG5cdFx0XHRpZiAoIWNsb3NlTG9vcCAmJiBpID09PSAwKSB7XG5cdFx0XHRcdC8vIEFkZCBzdGFydGluZyBwb2ludHMgdG8gcG9zaXRpb25zIGFycmF5LlxuXHRcdFx0XHRwb3NpdGlvbnNbMF0gPSB2MVswXSArIG4xWzBdICogaGFsZlRoaWNrbmVzcztcblx0XHRcdFx0cG9zaXRpb25zWzFdID0gdjFbMV0gKyBuMVsxXSAqIGhhbGZUaGlja25lc3M7XG5cdFx0XHRcdHBvc2l0aW9uc1syXSA9IHYxWzBdIC0gbjFbMF0gKiBoYWxmVGhpY2tuZXNzO1xuXHRcdFx0XHRwb3NpdGlvbnNbM10gPSB2MVsxXSAtIG4xWzFdICogaGFsZlRoaWNrbmVzcztcblx0XHRcdFx0aWYgKHV2cykge1xuXHRcdFx0XHRcdHV2c1swXSA9IDA7XG5cdFx0XHRcdFx0dXZzWzFdID0gMTtcblx0XHRcdFx0XHR1dnNbMl0gPSAwO1xuXHRcdFx0XHRcdHV2c1szXSA9IDA7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKG5vcm1hbHMpIHtcblx0XHRcdFx0XHRub3JtYWxzWzBdID0gbjFbMF07XG5cdFx0XHRcdFx0bm9ybWFsc1sxXSA9IG4xWzFdO1xuXHRcdFx0XHRcdG5vcm1hbHNbMl0gPSBuMVswXTtcblx0XHRcdFx0XHRub3JtYWxzWzNdID0gbjFbMV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgdSA9IChpICsgMSkgLyAodmVydGljZXMubGVuZ3RoIC0gMSk7XG5cblx0XHRcdC8vIE9mZnNldCBmcm9tIHYyLlxuXHRcdFx0cG9zaXRpb25zWzIgKiBpbmRleF0gPSB2MlswXSArIG4xWzBdICogaGFsZlRoaWNrbmVzcztcblx0XHRcdHBvc2l0aW9uc1syICogaW5kZXggKyAxXSA9IHYyWzFdICsgbjFbMV0gKiBoYWxmVGhpY2tuZXNzO1xuXHRcdFx0cG9zaXRpb25zWzIgKiBpbmRleCArIDJdID0gdjJbMF0gLSBuMVswXSAqIGhhbGZUaGlja25lc3M7XG5cdFx0XHRwb3NpdGlvbnNbMiAqIGluZGV4ICsgM10gPSB2MlsxXSAtIG4xWzFdICogaGFsZlRoaWNrbmVzcztcblx0XHRcdGlmICh1dnMpIHtcblx0XHRcdFx0dXZzWzIgKiBpbmRleF0gPSB1O1xuXHRcdFx0XHR1dnNbMiAqIGluZGV4ICsgMV0gPSAxO1xuXHRcdFx0XHR1dnNbMiAqIGluZGV4ICsgMl0gPSB1O1xuXHRcdFx0XHR1dnNbMiAqIGluZGV4ICsgM10gPSAwO1xuXHRcdFx0fVxuXHRcdFx0aWYgKG5vcm1hbHMpIHtcblx0XHRcdFx0bm9ybWFsc1syICogaW5kZXhdID0gbjFbMF07XG5cdFx0XHRcdG5vcm1hbHNbMiAqIGluZGV4ICsgMV0gPSBuMVsxXTtcblx0XHRcdFx0bm9ybWFsc1syICogaW5kZXggKyAyXSA9IG4xWzBdO1xuXHRcdFx0XHRub3JtYWxzWzIgKiBpbmRleCArIDNdID0gbjFbMV07XG5cdFx0XHR9XG5cblx0XHRcdGlmICgoaSA8IHZlcnRpY2VzLmxlbmd0aCAtIDIpIHx8IGNsb3NlTG9vcCkge1xuXHRcdFx0XHQvLyBWZXJ0aWNlcyBvbiBuZXh0IHNlZ21lbnQuXG5cdFx0XHRcdGNvbnN0IHYzID0gdmVydGljZXNbKGkgKyAxKSAlIHZlcnRpY2VzLmxlbmd0aF07XG5cdFx0XHRcdGNvbnN0IHY0ID0gdmVydGljZXNbKGkgKyAyKSAlIHZlcnRpY2VzLmxlbmd0aF07XG5cdFx0XHRcdHMyWzBdID0gdjRbMF0gLSB2M1swXTtcblx0XHRcdFx0czJbMV0gPSB2NFsxXSAtIHYzWzFdO1xuXHRcdFx0XHRjb25zdCBsZW5ndGgyID0gTWF0aC5zcXJ0KHMyWzBdICogczJbMF0gKyBzMlsxXSAqIHMyWzFdKTtcblx0XHRcdFx0bjJbMF0gPSBzMlsxXSAvIGxlbmd0aDI7XG5cdFx0XHRcdG4yWzFdID0gLSBzMlswXSAvIGxlbmd0aDI7XG5cblx0XHRcdFx0Ly8gT2Zmc2V0IGZyb20gdjNcblx0XHRcdFx0cG9zaXRpb25zWzIgKiAoKGluZGV4ICsgMikgJSAoNCAqIHZlcnRpY2VzLmxlbmd0aCkpXSA9IHYzWzBdICsgbjJbMF0gKiBoYWxmVGhpY2tuZXNzO1xuXHRcdFx0XHRwb3NpdGlvbnNbMiAqICgoaW5kZXggKyAyKSAlICg0ICogdmVydGljZXMubGVuZ3RoKSkgKyAxXSA9IHYzWzFdICsgbjJbMV0gKiBoYWxmVGhpY2tuZXNzO1xuXHRcdFx0XHRwb3NpdGlvbnNbMiAqICgoaW5kZXggKyAyKSAlICg0ICogdmVydGljZXMubGVuZ3RoKSkgKyAyXSA9IHYzWzBdIC0gbjJbMF0gKiBoYWxmVGhpY2tuZXNzO1xuXHRcdFx0XHRwb3NpdGlvbnNbMiAqICgoaW5kZXggKyAyKSAlICg0ICogdmVydGljZXMubGVuZ3RoKSkgKyAzXSA9IHYzWzFdIC0gbjJbMV0gKiBoYWxmVGhpY2tuZXNzO1xuXHRcdFx0XHRpZiAodXZzKSB7XG5cdFx0XHRcdFx0dXZzWzIgKiAoKGluZGV4ICsgMikgJSAoNCAqIHZlcnRpY2VzLmxlbmd0aCkpXSA9IHU7XG5cdFx0XHRcdFx0dXZzWzIgKiAoKGluZGV4ICsgMikgJSAoNCAqIHZlcnRpY2VzLmxlbmd0aCkpICsgMV0gPSAxO1xuXHRcdFx0XHRcdHV2c1syICogKChpbmRleCArIDIpICUgKDQgKiB2ZXJ0aWNlcy5sZW5ndGgpKSArIDJdID0gdTtcblx0XHRcdFx0XHR1dnNbMiAqICgoaW5kZXggKyAyKSAlICg0ICogdmVydGljZXMubGVuZ3RoKSkgKyAzXSA9IDA7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKG5vcm1hbHMpIHtcblx0XHRcdFx0XHRub3JtYWxzWzIgKiAoKGluZGV4ICsgMikgJSAoNCAqIHZlcnRpY2VzLmxlbmd0aCkpXSA9IG4yWzBdO1xuXHRcdFx0XHRcdG5vcm1hbHNbMiAqICgoaW5kZXggKyAyKSAlICg0ICogdmVydGljZXMubGVuZ3RoKSkgKyAxXSA9IG4yWzFdO1xuXHRcdFx0XHRcdG5vcm1hbHNbMiAqICgoaW5kZXggKyAyKSAlICg0ICogdmVydGljZXMubGVuZ3RoKSkgKyAyXSA9IG4yWzBdO1xuXHRcdFx0XHRcdG5vcm1hbHNbMiAqICgoaW5kZXggKyAyKSAlICg0ICogdmVydGljZXMubGVuZ3RoKSkgKyAzXSA9IG4yWzFdO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gQ2hlY2sgdGhlIGFuZ2xlIGJldHdlZW4gYWRqYWNlbnQgc2VnbWVudHMuXG5cdFx0XHRcdGNvbnN0IGNyb3NzID0gbjFbMF0gKiBuMlsxXSAtIG4xWzFdICogbjJbMF07XG5cdFx0XHRcdGlmIChNYXRoLmFicyhjcm9zcykgPCAxZS02KSBjb250aW51ZTtcblx0XHRcdFx0bjNbMF0gPSBuMVswXSArIG4yWzBdO1xuXHRcdFx0XHRuM1sxXSA9IG4xWzFdICsgbjJbMV07XG5cdFx0XHRcdGNvbnN0IGxlbmd0aDMgPSBNYXRoLnNxcnQobjNbMF0gKiBuM1swXSArIG4zWzFdICogbjNbMV0pO1xuXHRcdFx0XHRuM1swXSAvPSBsZW5ndGgzO1xuXHRcdFx0XHRuM1sxXSAvPSBsZW5ndGgzO1xuXHRcdFx0XHQvLyBNYWtlIGFkanVzdG1lbnRzIHRvIHBvc2l0aW9ucy5cblx0XHRcdFx0Y29uc3QgYW5nbGUgPSBNYXRoLmFjb3MobjFbMF0gKiBuMlswXSArIG4xWzFdICogbjJbMV0pO1xuXHRcdFx0XHRjb25zdCBvZmZzZXQgPSBoYWxmVGhpY2tuZXNzIC8gTWF0aC5jb3MoYW5nbGUgLyAyKTtcblx0XHRcdFx0aWYgKGNyb3NzIDwgMCkge1xuXHRcdFx0XHRcdHBvc2l0aW9uc1syICogaW5kZXhdID0gdjJbMF0gKyBuM1swXSAqIG9mZnNldDtcblx0XHRcdFx0XHRwb3NpdGlvbnNbMiAqIGluZGV4ICsgMV0gPSB2MlsxXSArIG4zWzFdICogb2Zmc2V0O1xuXHRcdFx0XHRcdHBvc2l0aW9uc1syICogKChpbmRleCArIDIpICUgKDQgKiB2ZXJ0aWNlcy5sZW5ndGgpKV0gPSBwb3NpdGlvbnNbMiAqIGluZGV4XTtcblx0XHRcdFx0XHRwb3NpdGlvbnNbMiAqICgoaW5kZXggKyAyKSAlICg0ICogdmVydGljZXMubGVuZ3RoKSkgKyAxXSA9IHBvc2l0aW9uc1syICogaW5kZXggKyAxXTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRwb3NpdGlvbnNbMiAqIGluZGV4ICsgMl0gPSB2MlswXSAtIG4zWzBdICogb2Zmc2V0O1xuXHRcdFx0XHRcdHBvc2l0aW9uc1syICogaW5kZXggKyAzXSA9IHYyWzFdIC0gbjNbMV0gKiBvZmZzZXQ7XG5cdFx0XHRcdFx0cG9zaXRpb25zWzIgKiAoKGluZGV4ICsgMikgJSAoNCAqIHZlcnRpY2VzLmxlbmd0aCkpICsgMl0gPSBwb3NpdGlvbnNbMiAqIGluZGV4ICsgMl07XG5cdFx0XHRcdFx0cG9zaXRpb25zWzIgKiAoKGluZGV4ICsgMikgJSAoNCAqIHZlcnRpY2VzLmxlbmd0aCkpICsgM10gPSBwb3NpdGlvbnNbMiAqIGluZGV4ICsgM107XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKGNsb3NlTG9vcCkge1xuXHRcdFx0Ly8gRHVwbGljYXRlIHN0YXJ0aW5nIHBvaW50cyB0byBlbmQgb2YgcG9zaXRpb25zIGFycmF5LlxuXHRcdFx0cG9zaXRpb25zW3ZlcnRpY2VzLmxlbmd0aCAqIDhdID0gcG9zaXRpb25zWzBdO1xuXHRcdFx0cG9zaXRpb25zW3ZlcnRpY2VzLmxlbmd0aCAqIDggKyAxXSA9IHBvc2l0aW9uc1sxXTtcblx0XHRcdHBvc2l0aW9uc1t2ZXJ0aWNlcy5sZW5ndGggKiA4ICsgMl0gPSBwb3NpdGlvbnNbMl07XG5cdFx0XHRwb3NpdGlvbnNbdmVydGljZXMubGVuZ3RoICogOCArIDNdID0gcG9zaXRpb25zWzNdO1xuXHRcdFx0aWYgKHV2cykge1xuXHRcdFx0XHR1dnNbdmVydGljZXMubGVuZ3RoICogOF0gPSB1dnNbMF07XG5cdFx0XHRcdHV2c1t2ZXJ0aWNlcy5sZW5ndGggKiA4ICsgMV0gPSB1dnNbMV07XG5cdFx0XHRcdHV2c1t2ZXJ0aWNlcy5sZW5ndGggKiA4ICsgMl0gPSB1dnNbMl07XG5cdFx0XHRcdHV2c1t2ZXJ0aWNlcy5sZW5ndGggKiA4ICsgM10gPSB1dnNbM107XG5cdFx0XHR9XG5cdFx0XHRpZiAobm9ybWFscykge1xuXHRcdFx0XHRub3JtYWxzW3ZlcnRpY2VzLmxlbmd0aCAqIDhdID0gbm9ybWFsc1swXTtcblx0XHRcdFx0bm9ybWFsc1t2ZXJ0aWNlcy5sZW5ndGggKiA4ICsgMV0gPSBub3JtYWxzWzFdO1xuXHRcdFx0XHRub3JtYWxzW3ZlcnRpY2VzLmxlbmd0aCAqIDggKyAyXSA9IG5vcm1hbHNbMl07XG5cdFx0XHRcdG5vcm1hbHNbdmVydGljZXMubGVuZ3RoICogOCArIDNdID0gbm9ybWFsc1szXTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRjb25zdCBnbFByb2dyYW0gPSAodXZzID9cblx0XHRcdChub3JtYWxzID8gcHJvZ3JhbS5kZWZhdWx0UHJvZ3JhbVdpdGhVVk5vcm1hbCA6IHByb2dyYW0uZGVmYXVsdFByb2dyYW1XaXRoVVYpIDpcblx0XHRcdChub3JtYWxzID8gcHJvZ3JhbS5kZWZhdWx0UHJvZ3JhbVdpdGhOb3JtYWwgOiBwcm9ncmFtLmRlZmF1bHRQcm9ncmFtKVxuXHRcdCkhO1xuXG5cdFx0Ly8gRG8gc2V0dXAgLSB0aGlzIG11c3QgY29tZSBmaXJzdC5cblx0XHR0aGlzLmRyYXdTZXR1cChnbFByb2dyYW0sIGZhbHNlLCBpbnB1dCwgb3V0cHV0KTtcblxuXHRcdC8vIFVwZGF0ZSB1bmlmb3JtcyBhbmQgYnVmZmVycy5cblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF9zY2FsZScsIFsyIC8gd2lkdGgsIDIgLyBoZWlnaHRdLCBGTE9BVCk7XG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfdHJhbnNsYXRpb24nLCBbLTEsIC0xXSwgRkxPQVQpO1xuXHRcdC8vIEluaXQgcG9zaXRpb25zIGJ1ZmZlci5cblx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdGhpcy5pbml0VmVydGV4QnVmZmVyKHBvc2l0aW9ucykhKTtcblx0XHR0aGlzLnNldFBvc2l0aW9uQXR0cmlidXRlKGdsUHJvZ3JhbSwgcHJvZ3JhbS5uYW1lKTtcblx0XHRpZiAodXZzKSB7XG5cdFx0XHQvLyBJbml0IHV2IGJ1ZmZlci5cblx0XHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLmluaXRWZXJ0ZXhCdWZmZXIodXZzKSEpO1xuXHRcdFx0dGhpcy5zZXRVVkF0dHJpYnV0ZShnbFByb2dyYW0sIHByb2dyYW0ubmFtZSk7XG5cdFx0fVxuXHRcdGlmIChub3JtYWxzKSB7XG5cdFx0XHQvLyBJbml0IG5vcm1hbHMgYnVmZmVyLlxuXHRcdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHRoaXMuaW5pdFZlcnRleEJ1ZmZlcihub3JtYWxzKSEpO1xuXHRcdFx0dGhpcy5zZXRWZXJ0ZXhBdHRyaWJ1dGUoZ2xQcm9ncmFtLCAnYV9pbnRlcm5hbF9ub3JtYWwnLCAyLCBwcm9ncmFtLm5hbWUpO1xuXHRcdH1cblxuXHRcdC8vIERyYXcuXG5cdFx0dGhpcy5zZXRCbGVuZE1vZGUocGFyYW1zLnNob3VsZEJsZW5kQWxwaGEpO1xuXHRcdGdsLmRyYXdBcnJheXMoZ2wuVFJJQU5HTEVfU1RSSVAsIDAsIG51bVBvc2l0aW9ucyk7XG5cdFx0Z2wuZGlzYWJsZShnbC5CTEVORCk7XG5cdH1cblxuXHRzdGVwVHJpYW5nbGVTdHJpcChcblx0XHRwYXJhbXM6IHtcblx0XHRcdHByb2dyYW06IEdQVVByb2dyYW0sXG5cdFx0XHRwb3NpdGlvbnM6IEZsb2F0MzJBcnJheSxcblx0XHRcdG5vcm1hbHM/OiBGbG9hdDMyQXJyYXksXG5cdFx0XHR1dnM/OiBGbG9hdDMyQXJyYXksXG5cdFx0XHRpbnB1dD86IChEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUpW10gfCBEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUsXG5cdFx0XHRvdXRwdXQ/OiBEYXRhTGF5ZXIsIC8vIFVuZGVmaW5lZCByZW5kZXJzIHRvIHNjcmVlbi5cblx0XHRcdGNvdW50PzogbnVtYmVyLFxuXHRcdFx0c2hvdWxkQmxlbmRBbHBoYT86IGJvb2xlYW4sXG5cdFx0fSxcblx0KSB7XG5cblx0XHRjb25zdCB7IHByb2dyYW0sIGlucHV0LCBvdXRwdXQsIHBvc2l0aW9ucywgdXZzLCBub3JtYWxzIH0gPSBwYXJhbXM7XG5cdFx0Y29uc3QgeyBnbCwgd2lkdGgsIGhlaWdodCwgZXJyb3JTdGF0ZSB9ID0gdGhpcztcblxuXHRcdC8vIElnbm9yZSBpZiB3ZSBhcmUgaW4gZXJyb3Igc3RhdGUuXG5cdFx0aWYgKGVycm9yU3RhdGUpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBnbFByb2dyYW0gPSAodXZzID9cblx0XHRcdChub3JtYWxzID8gcHJvZ3JhbS5kZWZhdWx0UHJvZ3JhbVdpdGhVVk5vcm1hbCA6IHByb2dyYW0uZGVmYXVsdFByb2dyYW1XaXRoVVYpIDpcblx0XHRcdChub3JtYWxzID8gcHJvZ3JhbS5kZWZhdWx0UHJvZ3JhbVdpdGhOb3JtYWwgOiBwcm9ncmFtLmRlZmF1bHRQcm9ncmFtKVxuXHRcdCkhO1xuXG5cdFx0Ly8gRG8gc2V0dXAgLSB0aGlzIG11c3QgY29tZSBmaXJzdC5cblx0XHR0aGlzLmRyYXdTZXR1cChnbFByb2dyYW0sIGZhbHNlLCBpbnB1dCwgb3V0cHV0KTtcblxuXHRcdC8vIFVwZGF0ZSB1bmlmb3JtcyBhbmQgYnVmZmVycy5cblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF9zY2FsZScsIFsyIC8gd2lkdGgsIDIgLyBoZWlnaHRdLCBGTE9BVCk7XG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfdHJhbnNsYXRpb24nLCBbLTEsIC0xXSwgRkxPQVQpO1xuXHRcdC8vIEluaXQgcG9zaXRpb25zIGJ1ZmZlci5cblx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdGhpcy5pbml0VmVydGV4QnVmZmVyKHBvc2l0aW9ucykhKTtcblx0XHR0aGlzLnNldFBvc2l0aW9uQXR0cmlidXRlKGdsUHJvZ3JhbSwgcHJvZ3JhbS5uYW1lKTtcblx0XHRpZiAodXZzKSB7XG5cdFx0XHQvLyBJbml0IHV2IGJ1ZmZlci5cblx0XHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLmluaXRWZXJ0ZXhCdWZmZXIodXZzKSEpO1xuXHRcdFx0dGhpcy5zZXRVVkF0dHJpYnV0ZShnbFByb2dyYW0sIHByb2dyYW0ubmFtZSk7XG5cdFx0fVxuXHRcdGlmIChub3JtYWxzKSB7XG5cdFx0XHQvLyBJbml0IG5vcm1hbHMgYnVmZmVyLlxuXHRcdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHRoaXMuaW5pdFZlcnRleEJ1ZmZlcihub3JtYWxzKSEpO1xuXHRcdFx0dGhpcy5zZXRWZXJ0ZXhBdHRyaWJ1dGUoZ2xQcm9ncmFtLCAnYV9pbnRlcm5hbF9ub3JtYWwnLCAyLCBwcm9ncmFtLm5hbWUpO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNvdW50ID0gcGFyYW1zLmNvdW50ID8gcGFyYW1zLmNvdW50IDogcG9zaXRpb25zLmxlbmd0aCAvIDI7XG5cblx0XHQvLyBEcmF3LlxuXHRcdHRoaXMuc2V0QmxlbmRNb2RlKHBhcmFtcy5zaG91bGRCbGVuZEFscGhhKTtcblx0XHRnbC5kcmF3QXJyYXlzKGdsLlRSSUFOR0xFX1NUUklQLCAwLCBjb3VudCk7XG5cdFx0Z2wuZGlzYWJsZShnbC5CTEVORCk7XG5cdH1cblxuXHRzdGVwTGluZXMocGFyYW1zOiB7XG5cdFx0cHJvZ3JhbTogR1BVUHJvZ3JhbSxcblx0XHRwb3NpdGlvbnM6IEZsb2F0MzJBcnJheSxcblx0XHRpbmRpY2VzPzogVWludDE2QXJyYXkgfCBVaW50MzJBcnJheSB8IEludDE2QXJyYXkgfCBJbnQzMkFycmF5LFxuXHRcdG5vcm1hbHM/OiBGbG9hdDMyQXJyYXksXG5cdFx0dXZzPzogRmxvYXQzMkFycmF5LFxuXHRcdGlucHV0PzogKERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSlbXSB8IERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSxcblx0XHRvdXRwdXQ/OiBEYXRhTGF5ZXIsIC8vIFVuZGVmaW5lZCByZW5kZXJzIHRvIHNjcmVlbi5cblx0XHRjb3VudD86IG51bWJlcixcblx0XHRjbG9zZUxvb3A/OiBib29sZWFuLFxuXHRcdHNob3VsZEJsZW5kQWxwaGE/OiBib29sZWFuLFxuXHR9KSB7XG5cdFx0Y29uc3QgeyBnbCwgZXJyb3JTdGF0ZSwgd2lkdGgsIGhlaWdodCB9ID0gdGhpcztcblx0XHRjb25zdCB7IGluZGljZXMsIHV2cywgbm9ybWFscywgaW5wdXQsIG91dHB1dCwgcHJvZ3JhbSB9ID0gcGFyYW1zO1xuXG5cdFx0Ly8gSWdub3JlIGlmIHdlIGFyZSBpbiBlcnJvciBzdGF0ZS5cblx0XHRpZiAoZXJyb3JTdGF0ZSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHQvLyBDaGVjayB0aGF0IHBhcmFtcyBhcmUgdmFsaWQuXG5cdFx0aWYgKHBhcmFtcy5jbG9zZUxvb3AgJiYgaW5kaWNlcykge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBXZWJHTENvbXB1dGUuc3RlcExpbmVzKCkgY2FuJ3QgYmUgY2FsbGVkIHdpdGggY2xvc2VMb29wID09IHRydWUgYW5kIGluZGljZXMuYCk7XG5cdFx0fVxuXHRcdFxuXHRcdGNvbnN0IGdsUHJvZ3JhbSA9ICh1dnMgP1xuXHRcdFx0KG5vcm1hbHMgPyBwcm9ncmFtLmRlZmF1bHRQcm9ncmFtV2l0aFVWTm9ybWFsIDogcHJvZ3JhbS5kZWZhdWx0UHJvZ3JhbVdpdGhVVikgOlxuXHRcdFx0KG5vcm1hbHMgPyBwcm9ncmFtLmRlZmF1bHRQcm9ncmFtV2l0aE5vcm1hbCA6IHByb2dyYW0uZGVmYXVsdFByb2dyYW0pXG5cdFx0KSE7XG5cblx0XHQvLyBEbyBzZXR1cCAtIHRoaXMgbXVzdCBjb21lIGZpcnN0LlxuXHRcdHRoaXMuZHJhd1NldHVwKGdsUHJvZ3JhbSwgZmFsc2UsIGlucHV0LCBvdXRwdXQpO1xuXG5cdFx0Y29uc3QgY291bnQgPSBwYXJhbXMuY291bnQgPyBwYXJhbXMuY291bnQgOiAoaW5kaWNlcyA/IGluZGljZXMubGVuZ3RoIDogcGFyYW1zLnBvc2l0aW9ucy5sZW5ndGggIC8gMik7XG5cblx0XHQvLyBVcGRhdGUgdW5pZm9ybXMgYW5kIGJ1ZmZlcnMuXG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfc2NhbGUnLCBbMiAvIHdpZHRoLCAyIC8gaGVpZ2h0XSwgRkxPQVQpO1xuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3RyYW5zbGF0aW9uJywgWy0xLCAtMV0sIEZMT0FUKTtcblx0XHRpZiAoaW5kaWNlcykge1xuXHRcdFx0Ly8gUmVvcmRlciBwb3NpdGlvbnMgYXJyYXkgdG8gbWF0Y2ggaW5kaWNlcy5cblx0XHRcdGNvbnN0IHBvc2l0aW9ucyA9IG5ldyBGbG9hdDMyQXJyYXkoMiAqIGluZGljZXMubGVuZ3RoKTtcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuXHRcdFx0XHRjb25zdCBpbmRleCA9IGluZGljZXNbaV07XG5cdFx0XHRcdHBvc2l0aW9uc1syICogaV0gPSBwYXJhbXMucG9zaXRpb25zWzIgKiBpbmRleF07XG5cdFx0XHRcdHBvc2l0aW9uc1syICogaSArIDFdID0gcGFyYW1zLnBvc2l0aW9uc1syICogaW5kZXggKyAxXTtcblx0XHRcdH1cblx0XHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLmluaXRWZXJ0ZXhCdWZmZXIocG9zaXRpb25zKSEpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdGhpcy5pbml0VmVydGV4QnVmZmVyKHBhcmFtcy5wb3NpdGlvbnMpISk7XG5cdFx0fVxuXHRcdHRoaXMuc2V0UG9zaXRpb25BdHRyaWJ1dGUoZ2xQcm9ncmFtLCBwcm9ncmFtLm5hbWUpO1xuXG5cdFx0Ly8gRHJhdy5cblx0XHR0aGlzLnNldEJsZW5kTW9kZShwYXJhbXMuc2hvdWxkQmxlbmRBbHBoYSk7XG5cdFx0aWYgKHBhcmFtcy5pbmRpY2VzKSB7XG5cdFx0XHRnbC5kcmF3QXJyYXlzKGdsLkxJTkVTLCAwLCBjb3VudCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmIChwYXJhbXMuY2xvc2VMb29wKSB7XG5cdFx0XHRcdGdsLmRyYXdBcnJheXMoZ2wuTElORV9MT09QLCAwLCBjb3VudCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRnbC5kcmF3QXJyYXlzKGdsLkxJTkVfU1RSSVAsIDAsIGNvdW50KTtcblx0XHRcdH1cblx0XHR9XG5cdFx0Z2wuZGlzYWJsZShnbC5CTEVORCk7XG5cdH1cblxuXHRkcmF3TGF5ZXJBc1BvaW50cyhcblx0XHRwYXJhbXM6IHtcblx0XHRcdHBvc2l0aW9uczogRGF0YUxheWVyLCAvLyBQb3NpdGlvbnMgaW4gY2FudmFzIHB4LlxuXHRcdFx0cHJvZ3JhbT86IEdQVVByb2dyYW0sXG5cdFx0XHRpbnB1dD86IChEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUpW10gfCBEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUsXG5cdFx0XHRvdXRwdXQ/OiBEYXRhTGF5ZXIsXG5cdFx0XHRwb2ludFNpemU/OiBudW1iZXIsXG5cdFx0XHRjb3VudD86IG51bWJlcixcblx0XHRcdGNvbG9yPzogW251bWJlciwgbnVtYmVyLCBudW1iZXJdLFxuXHRcdFx0d3JhcFg/OiBib29sZWFuLFxuXHRcdFx0d3JhcFk/OiBib29sZWFuLFxuXHRcdFx0c2hvdWxkQmxlbmRBbHBoYT86IGJvb2xlYW4sXG5cdFx0fSxcblx0KSB7XG5cdFx0Y29uc3QgeyBnbCwgZXJyb3JTdGF0ZSwgcG9pbnRJbmRleEFycmF5LCB3aWR0aCwgaGVpZ2h0IH0gPSB0aGlzO1xuXHRcdGNvbnN0IHsgcG9zaXRpb25zLCBvdXRwdXQgfSA9IHBhcmFtcztcblxuXHRcdC8vIElnbm9yZSBpZiB3ZSBhcmUgaW4gZXJyb3Igc3RhdGUuXG5cdFx0aWYgKGVycm9yU3RhdGUpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBDaGVjayB0aGF0IG51bVBvaW50cyBpcyB2YWxpZC5cblx0XHRpZiAocG9zaXRpb25zLm51bUNvbXBvbmVudHMgIT09IDIgJiYgcG9zaXRpb25zLm51bUNvbXBvbmVudHMgIT09IDQpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgV2ViR0xDb21wdXRlLmRyYXdQb2ludHMoKSBtdXN0IGJlIHBhc3NlZCBhIHBvc2l0aW9uIERhdGFMYXllciB3aXRoIGVpdGhlciAyIG9yIDQgY29tcG9uZW50cywgZ290IHBvc2l0aW9uIERhdGFMYXllciBcIiR7cG9zaXRpb25zLm5hbWV9XCIgd2l0aCAke3Bvc2l0aW9ucy5udW1Db21wb25lbnRzfSBjb21wb25lbnRzLmApXG5cdFx0fVxuXHRcdGNvbnN0IGxlbmd0aCA9IHBvc2l0aW9ucy5nZXRMZW5ndGgoKTtcblx0XHRjb25zdCBjb3VudCA9IHBhcmFtcy5jb3VudCB8fCBsZW5ndGg7XG5cdFx0aWYgKGNvdW50ID4gbGVuZ3RoKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgY291bnQgJHtjb3VudH0gZm9yIHBvc2l0aW9uIERhdGFMYXllciBvZiBsZW5ndGggJHtsZW5ndGh9LmApO1xuXHRcdH1cblxuXHRcdGxldCBwcm9ncmFtID0gcGFyYW1zLnByb2dyYW07XG5cdFx0aWYgKHByb2dyYW0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cHJvZ3JhbSA9IHRoaXMuc2luZ2xlQ29sb3JQcm9ncmFtO1xuXHRcdFx0Y29uc3QgY29sb3IgPSBwYXJhbXMuY29sb3IgfHwgWzEsIDAsIDBdOyAvLyBEZWZhdWx0IG9mIHJlZC5cblx0XHRcdHByb2dyYW0uc2V0VW5pZm9ybSgndV9jb2xvcicsIGNvbG9yLCBGTE9BVCk7XG5cdFx0fVxuXHRcdGNvbnN0IGdsUHJvZ3JhbSA9IHByb2dyYW0uZGF0YUxheWVyUG9pbnRzUHJvZ3JhbSE7XG5cblx0XHQvLyBBZGQgcG9zaXRpb25zIHRvIGVuZCBvZiBpbnB1dCBpZiBuZWVkZWQuXG5cdFx0Y29uc3QgaW5wdXQgPSB0aGlzLmFkZExheWVyVG9JbnB1dHMocG9zaXRpb25zLCBwYXJhbXMuaW5wdXQpO1xuXG5cdFx0Ly8gRG8gc2V0dXAgLSB0aGlzIG11c3QgY29tZSBmaXJzdC5cblx0XHR0aGlzLmRyYXdTZXR1cChnbFByb2dyYW0sIGZhbHNlLCBpbnB1dCwgb3V0cHV0KTtcblxuXHRcdC8vIFVwZGF0ZSB1bmlmb3JtcyBhbmQgYnVmZmVycy5cblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF9wb3NpdGlvbnMnLCBpbnB1dC5pbmRleE9mKHBvc2l0aW9ucyksIElOVCk7XG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfc2NhbGUnLCBbMSAvIHdpZHRoLCAxIC8gaGVpZ2h0XSwgRkxPQVQpO1xuXHRcdC8vIFRlbGwgd2hldGhlciB3ZSBhcmUgdXNpbmcgYW4gYWJzb2x1dGUgcG9zaXRpb24gKDIgY29tcG9uZW50cyksIG9yIHBvc2l0aW9uIHdpdGggYWNjdW11bGF0aW9uIGJ1ZmZlciAoNCBjb21wb25lbnRzLCBiZXR0ZXIgZmxvYXRpbmcgcHQgYWNjdXJhY3kpLlxuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3Bvc2l0aW9uV2l0aEFjY3VtdWxhdGlvbicsIHBvc2l0aW9ucy5udW1Db21wb25lbnRzID09PSA0ID8gMSA6IDAsIElOVCk7XG5cdFx0Ly8gU2V0IGRlZmF1bHQgcG9pbnRTaXplLlxuXHRcdGNvbnN0IHBvaW50U2l6ZSA9IHBhcmFtcy5wb2ludFNpemUgfHwgMTtcblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF9wb2ludFNpemUnLCBwb2ludFNpemUsIEZMT0FUKTtcblx0XHRjb25zdCBwb3NpdGlvbkxheWVyRGltZW5zaW9ucyA9IHBvc2l0aW9ucy5nZXREaW1lbnNpb25zKCk7XG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfcG9zaXRpb25zRGltZW5zaW9ucycsIHBvc2l0aW9uTGF5ZXJEaW1lbnNpb25zLCBGTE9BVCk7XG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfd3JhcFgnLCBwYXJhbXMud3JhcFggPyAxIDogMCwgSU5UKTtcblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF93cmFwWScsIHBhcmFtcy53cmFwWSA/IDEgOiAwLCBJTlQpO1xuXHRcdGlmICh0aGlzLnBvaW50SW5kZXhCdWZmZXIgPT09IHVuZGVmaW5lZCB8fCAocG9pbnRJbmRleEFycmF5ICYmIHBvaW50SW5kZXhBcnJheS5sZW5ndGggPCBjb3VudCkpIHtcblx0XHRcdC8vIEhhdmUgdG8gdXNlIGZsb2F0MzIgYXJyYXkgYmMgaW50IGlzIG5vdCBzdXBwb3J0ZWQgYXMgYSB2ZXJ0ZXggYXR0cmlidXRlIHR5cGUuXG5cdFx0XHRjb25zdCBpbmRpY2VzID0gaW5pdFNlcXVlbnRpYWxGbG9hdEFycmF5KGxlbmd0aCk7XG5cdFx0XHR0aGlzLnBvaW50SW5kZXhBcnJheSA9IGluZGljZXM7XG5cdFx0XHR0aGlzLnBvaW50SW5kZXhCdWZmZXIgPSB0aGlzLmluaXRWZXJ0ZXhCdWZmZXIoaW5kaWNlcyk7XG5cdFx0fVxuXHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLnBvaW50SW5kZXhCdWZmZXIhKTtcblx0XHR0aGlzLnNldEluZGV4QXR0cmlidXRlKGdsUHJvZ3JhbSwgcHJvZ3JhbS5uYW1lKTtcblxuXHRcdC8vIERyYXcuXG5cdFx0dGhpcy5zZXRCbGVuZE1vZGUocGFyYW1zLnNob3VsZEJsZW5kQWxwaGEpO1xuXHRcdGdsLmRyYXdBcnJheXMoZ2wuUE9JTlRTLCAwLCBjb3VudCk7XG5cdFx0Z2wuZGlzYWJsZShnbC5CTEVORCk7XG5cdH1cblxuXHRkcmF3TGF5ZXJBc0xpbmVzKFxuXHRcdHBhcmFtczoge1xuXHRcdFx0cG9zaXRpb25zOiBEYXRhTGF5ZXIsXG5cdFx0XHRpbmRpY2VzPzogRmxvYXQzMkFycmF5IHwgVWludDE2QXJyYXkgfCBVaW50MzJBcnJheSB8IEludDE2QXJyYXkgfCBJbnQzMkFycmF5LFxuXHRcdFx0cHJvZ3JhbT86IEdQVVByb2dyYW0sXG5cdFx0XHRpbnB1dD86IChEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUpW10gfCBEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUsXG5cdFx0XHRvdXRwdXQ/OiBEYXRhTGF5ZXIsXG5cdFx0XHRjb3VudD86IG51bWJlcixcblx0XHRcdGNvbG9yPzogW251bWJlciwgbnVtYmVyLCBudW1iZXJdLFxuXHRcdFx0d3JhcFg/OiBib29sZWFuLFxuXHRcdFx0d3JhcFk/OiBib29sZWFuLFxuXHRcdFx0Y2xvc2VMb29wPzogYm9vbGVhbixcblx0XHRcdHNob3VsZEJsZW5kQWxwaGE/OiBib29sZWFuLFxuXHRcdH0sXG5cdCkge1xuXHRcdGNvbnN0IHsgZ2wsIGVycm9yU3RhdGUsIHdpZHRoLCBoZWlnaHQgfSA9IHRoaXM7XG5cdFx0Y29uc3QgeyBwb3NpdGlvbnMsIG91dHB1dCB9ID0gcGFyYW1zO1xuXG5cdFx0Ly8gSWdub3JlIGlmIHdlIGFyZSBpbiBlcnJvciBzdGF0ZS5cblx0XHRpZiAoZXJyb3JTdGF0ZSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIENoZWNrIHRoYXQgcG9zaXRpb25zIGlzIHZhbGlkLlxuXHRcdGlmIChwb3NpdGlvbnMubnVtQ29tcG9uZW50cyAhPT0gMiAmJiBwb3NpdGlvbnMubnVtQ29tcG9uZW50cyAhPT0gNCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBXZWJHTENvbXB1dGUuZHJhd0xheWVyQXNMaW5lcygpIG11c3QgYmUgcGFzc2VkIGEgcG9zaXRpb24gRGF0YUxheWVyIHdpdGggZWl0aGVyIDIgb3IgNCBjb21wb25lbnRzLCBnb3QgcG9zaXRpb24gRGF0YUxheWVyIFwiJHtwb3NpdGlvbnMubmFtZX1cIiB3aXRoICR7cG9zaXRpb25zLm51bUNvbXBvbmVudHN9IGNvbXBvbmVudHMuYClcblx0XHR9XG5cdFx0Ly8gQ2hlY2sgdGhhdCBwYXJhbXMgYXJlIHZhbGlkLlxuXHRcdGlmIChwYXJhbXMuY2xvc2VMb29wICYmIHBhcmFtcy5pbmRpY2VzKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFdlYkdMQ29tcHV0ZS5kcmF3TGF5ZXJBc0xpbmVzKCkgY2FuJ3QgYmUgY2FsbGVkIHdpdGggY2xvc2VMb29wID09IHRydWUgYW5kIGluZGljZXMuYCk7XG5cdFx0fVxuXG5cdFx0bGV0IHByb2dyYW0gPSBwYXJhbXMucHJvZ3JhbTtcblx0XHRpZiAocHJvZ3JhbSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRwcm9ncmFtID0gcGFyYW1zLndyYXBYIHx8IHBhcmFtcy53cmFwWSA/IHRoaXMuc2luZ2xlQ29sb3JXaXRoV3JhcENoZWNrUHJvZ3JhbSA6IHRoaXMuc2luZ2xlQ29sb3JQcm9ncmFtO1xuXHRcdFx0Y29uc3QgY29sb3IgPSBwYXJhbXMuY29sb3IgfHwgWzEsIDAsIDBdOyAvLyBEZWZhdWx0IHRvIHJlZC5cblx0XHRcdHByb2dyYW0uc2V0VW5pZm9ybSgndV9jb2xvcicsIGNvbG9yLCBGTE9BVCk7XG5cdFx0fVxuXHRcdGNvbnN0IGdsUHJvZ3JhbSA9IHByb2dyYW0uZGF0YUxheWVyTGluZXNQcm9ncmFtITtcblxuXHRcdC8vIEFkZCBwb3NpdGlvbkxheWVyIHRvIGVuZCBvZiBpbnB1dCBpZiBuZWVkZWQuXG5cdFx0Y29uc3QgaW5wdXQgPSB0aGlzLmFkZExheWVyVG9JbnB1dHMocG9zaXRpb25zLCBwYXJhbXMuaW5wdXQpO1xuXG5cdFx0Ly8gRG8gc2V0dXAgLSB0aGlzIG11c3QgY29tZSBmaXJzdC5cblx0XHR0aGlzLmRyYXdTZXR1cChnbFByb2dyYW0sIGZhbHNlLCBpbnB1dCwgb3V0cHV0KTtcblxuXHRcdC8vIFRPRE86IGNhY2hlIGluZGV4QXJyYXkgaWYgbm8gaW5kaWNlcyBwYXNzZWQgaW4uXG5cdFx0Y29uc3QgaW5kaWNlcyA9IHBhcmFtcy5pbmRpY2VzID8gcGFyYW1zLmluZGljZXMgOiBpbml0U2VxdWVudGlhbEZsb2F0QXJyYXkocGFyYW1zLmNvdW50IHx8IHBvc2l0aW9ucy5nZXRMZW5ndGgoKSk7XG5cdFx0Y29uc3QgY291bnQgPSBwYXJhbXMuY291bnQgPyBwYXJhbXMuY291bnQgOiBpbmRpY2VzLmxlbmd0aDtcblxuXHRcdC8vIFVwZGF0ZSB1bmlmb3JtcyBhbmQgYnVmZmVycy5cblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF9wb3NpdGlvbnMnLCBpbnB1dC5pbmRleE9mKHBvc2l0aW9ucyksIElOVCk7XG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfc2NhbGUnLCBbMSAvIHdpZHRoLCAxIC8gaGVpZ2h0XSwgRkxPQVQpO1xuXHRcdC8vIFRlbGwgd2hldGhlciB3ZSBhcmUgdXNpbmcgYW4gYWJzb2x1dGUgcG9zaXRpb24gKDIgY29tcG9uZW50cyksIG9yIHBvc2l0aW9uIHdpdGggYWNjdW11bGF0aW9uIGJ1ZmZlciAoNCBjb21wb25lbnRzLCBiZXR0ZXIgZmxvYXRpbmcgcHQgYWNjdXJhY3kpLlxuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3Bvc2l0aW9uV2l0aEFjY3VtdWxhdGlvbicsIHBvc2l0aW9ucy5udW1Db21wb25lbnRzID09PSA0ID8gMSA6IDAsIElOVCk7XG5cdFx0Y29uc3QgcG9zaXRpb25MYXllckRpbWVuc2lvbnMgPSBwb3NpdGlvbnMuZ2V0RGltZW5zaW9ucygpO1xuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3Bvc2l0aW9uc0RpbWVuc2lvbnMnLCBwb3NpdGlvbkxheWVyRGltZW5zaW9ucywgRkxPQVQpO1xuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3dyYXBYJywgcGFyYW1zLndyYXBYID8gMSA6IDAsIElOVCk7XG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfd3JhcFknLCBwYXJhbXMud3JhcFkgPyAxIDogMCwgSU5UKTtcblx0XHRpZiAodGhpcy5pbmRleGVkTGluZXNJbmRleEJ1ZmZlciA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHQvLyBIYXZlIHRvIHVzZSBmbG9hdDMyIGFycmF5IGJjIGludCBpcyBub3Qgc3VwcG9ydGVkIGFzIGEgdmVydGV4IGF0dHJpYnV0ZSB0eXBlLlxuXHRcdFx0bGV0IGZsb2F0QXJyYXk6IEZsb2F0MzJBcnJheTtcblx0XHRcdGlmIChpbmRpY2VzLmNvbnN0cnVjdG9yICE9PSBGbG9hdDMyQXJyYXkpIHtcblx0XHRcdFx0Ly8gSGF2ZSB0byB1c2UgZmxvYXQzMiBhcnJheSBiYyBpbnQgaXMgbm90IHN1cHBvcnRlZCBhcyBhIHZlcnRleCBhdHRyaWJ1dGUgdHlwZS5cblx0XHRcdFx0ZmxvYXRBcnJheSA9IG5ldyBGbG9hdDMyQXJyYXkoaW5kaWNlcy5sZW5ndGgpO1xuXHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcblx0XHRcdFx0XHRmbG9hdEFycmF5W2ldID0gaW5kaWNlc1tpXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjb25zb2xlLndhcm4oYENvbnZlcnRpbmcgaW5kaWNlcyBhcnJheSBvZiB0eXBlICR7aW5kaWNlcy5jb25zdHJ1Y3Rvcn0gdG8gRmxvYXQzMkFycmF5IGluIFdlYkdMQ29tcHV0ZS5kcmF3SW5kZXhlZExpbmVzIGZvciBXZWJHTCBjb21wYXRpYmlsaXR5LCB5b3UgbWF5IHdhbnQgdG8gdXNlIGEgRmxvYXQzMkFycmF5IHRvIHN0b3JlIHRoaXMgaW5mb3JtYXRpb24gc28gdGhlIGNvbnZlcnNpb24gaXMgbm90IHJlcXVpcmVkLmApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZmxvYXRBcnJheSA9IGluZGljZXMgYXMgRmxvYXQzMkFycmF5O1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5pbmRleGVkTGluZXNJbmRleEJ1ZmZlciA9IHRoaXMuaW5pdFZlcnRleEJ1ZmZlcihmbG9hdEFycmF5KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHRoaXMuaW5kZXhlZExpbmVzSW5kZXhCdWZmZXIhKTtcblx0XHRcdC8vIENvcHkgYnVmZmVyIGRhdGEuXG5cdFx0XHRnbC5idWZmZXJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgaW5kaWNlcywgZ2wuU1RBVElDX0RSQVcpO1xuXHRcdH1cblx0XHR0aGlzLnNldEluZGV4QXR0cmlidXRlKGdsUHJvZ3JhbSwgcHJvZ3JhbS5uYW1lKTtcblxuXHRcdC8vIERyYXcuXG5cdFx0dGhpcy5zZXRCbGVuZE1vZGUocGFyYW1zLnNob3VsZEJsZW5kQWxwaGEpO1xuXHRcdGlmIChwYXJhbXMuaW5kaWNlcykge1xuXHRcdFx0Z2wuZHJhd0FycmF5cyhnbC5MSU5FUywgMCwgY291bnQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAocGFyYW1zLmNsb3NlTG9vcCkge1xuXHRcdFx0XHRnbC5kcmF3QXJyYXlzKGdsLkxJTkVfTE9PUCwgMCwgY291bnQpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Z2wuZHJhd0FycmF5cyhnbC5MSU5FX1NUUklQLCAwLCBjb3VudCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGdsLmRpc2FibGUoZ2wuQkxFTkQpO1xuXHR9XG5cblx0ZHJhd0xheWVyQXNWZWN0b3JGaWVsZChcblx0XHRwYXJhbXM6IHtcblx0XHRcdGZpZWxkOiBEYXRhTGF5ZXIsXG5cdFx0XHRwcm9ncmFtPzogR1BVUHJvZ3JhbSxcblx0XHRcdGlucHV0PzogKERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSlbXSB8IERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSxcblx0XHRcdG91dHB1dD86IERhdGFMYXllcixcblx0XHRcdHZlY3RvclNwYWNpbmc/OiBudW1iZXIsXG5cdFx0XHR2ZWN0b3JTY2FsZT86IG51bWJlcixcblx0XHRcdGNvbG9yPzogW251bWJlciwgbnVtYmVyLCBudW1iZXJdLFxuXHRcdFx0c2hvdWxkQmxlbmRBbHBoYT86IGJvb2xlYW4sXG5cdFx0fSxcblx0KSB7XG5cdFx0Y29uc3QgeyBnbCwgZXJyb3JTdGF0ZSwgdmVjdG9yRmllbGRJbmRleEFycmF5LCB3aWR0aCwgaGVpZ2h0IH0gPSB0aGlzO1xuXHRcdGNvbnN0IHsgZmllbGQsIG91dHB1dCB9ID0gcGFyYW1zO1xuXG5cdFx0Ly8gSWdub3JlIGlmIHdlIGFyZSBpbiBlcnJvciBzdGF0ZS5cblx0XHRpZiAoZXJyb3JTdGF0ZSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIENoZWNrIHRoYXQgZmllbGQgaXMgdmFsaWQuXG5cdFx0aWYgKGZpZWxkLm51bUNvbXBvbmVudHMgIT09IDIpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgV2ViR0xDb21wdXRlLmRyYXdWZWN0b3JGaWVsZCgpIG11c3QgYmUgcGFzc2VkIGEgZmllbGRMYXllciB3aXRoIDIgY29tcG9uZW50cywgZ290IGZpZWxkTGF5ZXIgXCIke2ZpZWxkLm5hbWV9XCIgd2l0aCAke2ZpZWxkLm51bUNvbXBvbmVudHN9IGNvbXBvbmVudHMuYClcblx0XHR9XG5cdFx0Ly8gQ2hlY2sgYXNwZWN0IHJhdGlvLlxuXHRcdC8vIGNvbnN0IGRpbWVuc2lvbnMgPSB2ZWN0b3JMYXllci5nZXREaW1lbnNpb25zKCk7XG5cdFx0Ly8gaWYgKE1hdGguYWJzKGRpbWVuc2lvbnNbMF0gLyBkaW1lbnNpb25zWzFdIC0gd2lkdGggLyBoZWlnaHQpID4gMC4wMSkge1xuXHRcdC8vIFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGFzcGVjdCByYXRpbyAkeyhkaW1lbnNpb25zWzBdIC8gZGltZW5zaW9uc1sxXSkudG9GaXhlZCgzKX0gdmVjdG9yIERhdGFMYXllciB3aXRoIGRpbWVuc2lvbnMgWyR7ZGltZW5zaW9uc1swXX0sICR7ZGltZW5zaW9uc1sxXX1dLCBleHBlY3RlZCAkeyh3aWR0aCAvIGhlaWdodCkudG9GaXhlZCgzKX0uYCk7XG5cdFx0Ly8gfVxuXG5cdFx0bGV0IHByb2dyYW0gPSBwYXJhbXMucHJvZ3JhbTtcblx0XHRpZiAocHJvZ3JhbSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRwcm9ncmFtID0gdGhpcy5zaW5nbGVDb2xvclByb2dyYW07XG5cdFx0XHRjb25zdCBjb2xvciA9IHBhcmFtcy5jb2xvciB8fCBbMSwgMCwgMF07IC8vIERlZmF1bHQgdG8gcmVkLlxuXHRcdFx0cHJvZ3JhbS5zZXRVbmlmb3JtKCd1X2NvbG9yJywgY29sb3IsIEZMT0FUKTtcblx0XHR9XG5cdFx0Y29uc3QgZ2xQcm9ncmFtID0gcHJvZ3JhbS5kYXRhTGF5ZXJWZWN0b3JGaWVsZFByb2dyYW0hO1xuXG5cdFx0Ly8gQWRkIGZpZWxkIHRvIGVuZCBvZiBpbnB1dCBpZiBuZWVkZWQuXG5cdFx0Y29uc3QgaW5wdXQgPSB0aGlzLmFkZExheWVyVG9JbnB1dHMoZmllbGQsIHBhcmFtcy5pbnB1dCk7XG5cblx0XHQvLyBEbyBzZXR1cCAtIHRoaXMgbXVzdCBjb21lIGZpcnN0LlxuXHRcdHRoaXMuZHJhd1NldHVwKGdsUHJvZ3JhbSwgZmFsc2UsIGlucHV0LCBvdXRwdXQpO1xuXG5cdFx0Ly8gVXBkYXRlIHVuaWZvcm1zIGFuZCBidWZmZXJzLlxuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3ZlY3RvcnMnLCBpbnB1dC5pbmRleE9mKGZpZWxkKSwgSU5UKTtcblx0XHQvLyBTZXQgZGVmYXVsdCBzY2FsZS5cblx0XHRjb25zdCB2ZWN0b3JTY2FsZSA9IHBhcmFtcy52ZWN0b3JTY2FsZSB8fCAxO1xuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3NjYWxlJywgW3ZlY3RvclNjYWxlIC8gd2lkdGgsIHZlY3RvclNjYWxlIC8gaGVpZ2h0XSwgRkxPQVQpO1xuXHRcdGNvbnN0IHZlY3RvclNwYWNpbmcgPSBwYXJhbXMudmVjdG9yU3BhY2luZyB8fCAxMDtcblx0XHRjb25zdCBzcGFjZWREaW1lbnNpb25zID0gW01hdGguZmxvb3Iod2lkdGggLyB2ZWN0b3JTcGFjaW5nKSwgTWF0aC5mbG9vcihoZWlnaHQgLyB2ZWN0b3JTcGFjaW5nKV0gYXMgW251bWJlciwgbnVtYmVyXTtcblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF9kaW1lbnNpb25zJywgc3BhY2VkRGltZW5zaW9ucywgRkxPQVQpO1xuXHRcdGNvbnN0IGxlbmd0aCA9IDIgKiBzcGFjZWREaW1lbnNpb25zWzBdICogc3BhY2VkRGltZW5zaW9uc1sxXTtcblx0XHRpZiAodGhpcy52ZWN0b3JGaWVsZEluZGV4QnVmZmVyID09PSB1bmRlZmluZWQgfHwgKHZlY3RvckZpZWxkSW5kZXhBcnJheSAmJiB2ZWN0b3JGaWVsZEluZGV4QXJyYXkubGVuZ3RoIDwgbGVuZ3RoKSkge1xuXHRcdFx0Ly8gSGF2ZSB0byB1c2UgZmxvYXQzMiBhcnJheSBiYyBpbnQgaXMgbm90IHN1cHBvcnRlZCBhcyBhIHZlcnRleCBhdHRyaWJ1dGUgdHlwZS5cblx0XHRcdGNvbnN0IGluZGljZXMgPSBpbml0U2VxdWVudGlhbEZsb2F0QXJyYXkobGVuZ3RoKTtcblx0XHRcdHRoaXMudmVjdG9yRmllbGRJbmRleEFycmF5ID0gaW5kaWNlcztcblx0XHRcdHRoaXMudmVjdG9yRmllbGRJbmRleEJ1ZmZlciA9IHRoaXMuaW5pdFZlcnRleEJ1ZmZlcihpbmRpY2VzKTtcblx0XHR9XG5cdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHRoaXMudmVjdG9yRmllbGRJbmRleEJ1ZmZlciEpO1xuXHRcdHRoaXMuc2V0SW5kZXhBdHRyaWJ1dGUoZ2xQcm9ncmFtLCBwcm9ncmFtLm5hbWUpO1xuXG5cdFx0Ly8gRHJhdy5cblx0XHR0aGlzLnNldEJsZW5kTW9kZShwYXJhbXMuc2hvdWxkQmxlbmRBbHBoYSk7XG5cdFx0Z2wuZHJhd0FycmF5cyhnbC5MSU5FUywgMCwgbGVuZ3RoKTtcblx0XHRnbC5kaXNhYmxlKGdsLkJMRU5EKTtcblx0fVxuXHRcblx0Z2V0Q29udGV4dCgpIHtcblx0XHRyZXR1cm4gdGhpcy5nbDtcblx0fVxuXG5cdGdldFZhbHVlcyhkYXRhTGF5ZXI6IERhdGFMYXllcikge1xuXHRcdGNvbnN0IHsgZ2wsIGdsc2xWZXJzaW9uIH0gPSB0aGlzO1xuXG5cdFx0Ly8gSW4gY2FzZSBkYXRhTGF5ZXIgd2FzIG5vdCB0aGUgbGFzdCBvdXRwdXQgd3JpdHRlbiB0by5cblx0XHRkYXRhTGF5ZXIuX2JpbmRPdXRwdXRCdWZmZXIoKTtcblxuXHRcdGNvbnN0IFsgd2lkdGgsIGhlaWdodCBdID0gZGF0YUxheWVyLmdldERpbWVuc2lvbnMoKTtcblx0XHRsZXQgeyBnbE51bUNoYW5uZWxzLCBnbFR5cGUsIGdsRm9ybWF0LCBpbnRlcm5hbFR5cGUgfSA9IGRhdGFMYXllcjtcblx0XHRsZXQgdmFsdWVzO1xuXHRcdHN3aXRjaCAoaW50ZXJuYWxUeXBlKSB7XG5cdFx0XHRjYXNlIEhBTEZfRkxPQVQ6XG5cdFx0XHRcdGlmIChnbC5GTE9BVCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0Ly8gRmlyZWZveCByZXF1aXJlcyB0aGF0IFJHQkEvRkxPQVQgaXMgdXNlZCBmb3IgcmVhZFBpeGVscyBvZiBmbG9hdDE2IHR5cGVzLlxuXHRcdFx0XHRcdGdsTnVtQ2hhbm5lbHMgPSA0O1xuXHRcdFx0XHRcdGdsRm9ybWF0ID0gZ2wuUkdCQTtcblx0XHRcdFx0XHRnbFR5cGUgPSBnbC5GTE9BVDtcblx0XHRcdFx0XHR2YWx1ZXMgPSBuZXcgRmxvYXQzMkFycmF5KHdpZHRoICogaGVpZ2h0ICogZ2xOdW1DaGFubmVscyk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dmFsdWVzID0gbmV3IFVpbnQxNkFycmF5KHdpZHRoICogaGVpZ2h0ICogZ2xOdW1DaGFubmVscyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gLy8gVGhlIGZvbGxvd2luZyB3b3JrcyBpbiBDaHJvbWUuXG5cdFx0XHRcdC8vIHZhbHVlcyA9IG5ldyBVaW50MTZBcnJheSh3aWR0aCAqIGhlaWdodCAqIGdsTnVtQ2hhbm5lbHMpO1xuXHRcdFx0XHRicmVha1xuXHRcdFx0Y2FzZSBGTE9BVDpcblx0XHRcdFx0Ly8gQ2hyb21lIGFuZCBGaXJlZm94IHJlcXVpcmUgdGhhdCBSR0JBL0ZMT0FUIGlzIHVzZWQgZm9yIHJlYWRQaXhlbHMgb2YgZmxvYXQzMiB0eXBlcy5cblx0XHRcdFx0Ly8gaHR0cHM6Ly9naXRodWIuY29tL0tocm9ub3NHcm91cC9XZWJHTC9pc3N1ZXMvMjc0N1xuXHRcdFx0XHRnbE51bUNoYW5uZWxzID0gNDtcblx0XHRcdFx0Z2xGb3JtYXQgPSBnbC5SR0JBO1xuXHRcdFx0XHR2YWx1ZXMgPSBuZXcgRmxvYXQzMkFycmF5KHdpZHRoICogaGVpZ2h0ICogZ2xOdW1DaGFubmVscyk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBVTlNJR05FRF9CWVRFOlxuXHRcdFx0XHRpZiAoZ2xzbFZlcnNpb24gPT09IEdMU0wxKSB7XG5cdFx0XHRcdFx0Ly8gRmlyZWZveCByZXF1aXJlcyB0aGF0IFJHQkEvVU5TSUdORURfQllURSBpcyB1c2VkIGZvciByZWFkUGl4ZWxzIG9mIHVuc2lnbmVkIGJ5dGUgdHlwZXMuXG5cdFx0XHRcdFx0Z2xOdW1DaGFubmVscyA9IDQ7XG5cdFx0XHRcdFx0Z2xGb3JtYXQgPSBnbC5SR0JBO1xuXHRcdFx0XHRcdHZhbHVlcyA9IG5ldyBVaW50OEFycmF5KHdpZHRoICogaGVpZ2h0ICogZ2xOdW1DaGFubmVscyk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gRmlyZWZveCByZXF1aXJlcyB0aGF0IFJHQkFfSU5URUdFUi9VTlNJR05FRF9JTlQgaXMgdXNlZCBmb3IgcmVhZFBpeGVscyBvZiB1bnNpZ25lZCBpbnQgdHlwZXMuXG5cdFx0XHRcdGdsTnVtQ2hhbm5lbHMgPSA0O1xuXHRcdFx0XHRnbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR0JBX0lOVEVHRVI7XG5cdFx0XHRcdGdsVHlwZSA9IGdsLlVOU0lHTkVEX0lOVDtcblx0XHRcdFx0dmFsdWVzID0gbmV3IFVpbnQzMkFycmF5KHdpZHRoICogaGVpZ2h0ICogZ2xOdW1DaGFubmVscyk7XG5cdFx0XHRcdC8vIC8vIFRoZSBmb2xsb3dpbmcgd29ya3MgaW4gQ2hyb21lLlxuXHRcdFx0XHQvLyB2YWx1ZXMgPSBuZXcgVWludDhBcnJheSh3aWR0aCAqIGhlaWdodCAqIGdsTnVtQ2hhbm5lbHMpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgVU5TSUdORURfU0hPUlQ6XG5cdFx0XHRcdC8vIEZpcmVmb3ggcmVxdWlyZXMgdGhhdCBSR0JBX0lOVEVHRVIvVU5TSUdORURfSU5UIGlzIHVzZWQgZm9yIHJlYWRQaXhlbHMgb2YgdW5zaWduZWQgaW50IHR5cGVzLlxuXHRcdFx0XHRnbE51bUNoYW5uZWxzID0gNDtcblx0XHRcdFx0Z2xGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkdCQV9JTlRFR0VSO1xuXHRcdFx0XHRnbFR5cGUgPSBnbC5VTlNJR05FRF9JTlQ7XG5cdFx0XHRcdHZhbHVlcyA9IG5ldyBVaW50MzJBcnJheSh3aWR0aCAqIGhlaWdodCAqIGdsTnVtQ2hhbm5lbHMpO1xuXHRcdFx0XHQvLyAvLyBUaGUgZm9sbG93aW5nIHdvcmtzIGluIENocm9tZS5cblx0XHRcdFx0Ly8gdmFsdWVzID0gbmV3IFVpbnQxNkFycmF5KHdpZHRoICogaGVpZ2h0ICogZ2xOdW1DaGFubmVscyk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBVTlNJR05FRF9JTlQ6XG5cdFx0XHRcdC8vIEZpcmVmb3ggcmVxdWlyZXMgdGhhdCBSR0JBX0lOVEVHRVIvVU5TSUdORURfSU5UIGlzIHVzZWQgZm9yIHJlYWRQaXhlbHMgb2YgdW5zaWduZWQgaW50IHR5cGVzLlxuXHRcdFx0XHRnbE51bUNoYW5uZWxzID0gNDtcblx0XHRcdFx0Z2xGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkdCQV9JTlRFR0VSO1xuXHRcdFx0XHR2YWx1ZXMgPSBuZXcgVWludDMyQXJyYXkod2lkdGggKiBoZWlnaHQgKiBnbE51bUNoYW5uZWxzKTtcblx0XHRcdFx0Ly8gLy8gVGhlIGZvbGxvd2luZyB3b3JrcyBpbiBDaHJvbWUuXG5cdFx0XHRcdC8vIHZhbHVlcyA9IG5ldyBVaW50MzJBcnJheSh3aWR0aCAqIGhlaWdodCAqIGdsTnVtQ2hhbm5lbHMpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgQllURTpcblx0XHRcdFx0Ly8gRmlyZWZveCByZXF1aXJlcyB0aGF0IFJHQkFfSU5URUdFUi9JTlQgaXMgdXNlZCBmb3IgcmVhZFBpeGVscyBvZiBpbnQgdHlwZXMuXG5cdFx0XHRcdGdsTnVtQ2hhbm5lbHMgPSA0O1xuXHRcdFx0XHRnbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR0JBX0lOVEVHRVI7XG5cdFx0XHRcdGdsVHlwZSA9IGdsLklOVDtcblx0XHRcdFx0dmFsdWVzID0gbmV3IEludDMyQXJyYXkod2lkdGggKiBoZWlnaHQgKiBnbE51bUNoYW5uZWxzKTtcblx0XHRcdFx0Ly8gLy8gVGhlIGZvbGxvd2luZyB3b3JrcyBpbiBDaHJvbWUuXG5cdFx0XHRcdC8vIHZhbHVlcyA9IG5ldyBJbnQ4QXJyYXkod2lkdGggKiBoZWlnaHQgKiBnbE51bUNoYW5uZWxzKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFNIT1JUOlxuXHRcdFx0XHQvLyBGaXJlZm94IHJlcXVpcmVzIHRoYXQgUkdCQV9JTlRFR0VSL0lOVCBpcyB1c2VkIGZvciByZWFkUGl4ZWxzIG9mIGludCB0eXBlcy5cblx0XHRcdFx0Z2xOdW1DaGFubmVscyA9IDQ7XG5cdFx0XHRcdGdsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHQkFfSU5URUdFUjtcblx0XHRcdFx0Z2xUeXBlID0gZ2wuSU5UO1xuXHRcdFx0XHR2YWx1ZXMgPSBuZXcgSW50MzJBcnJheSh3aWR0aCAqIGhlaWdodCAqIGdsTnVtQ2hhbm5lbHMpO1xuXHRcdFx0XHQvLyAvLyBUaGUgZm9sbG93aW5nIHdvcmtzIGluIENocm9tZS5cblx0XHRcdFx0Ly8gdmFsdWVzID0gbmV3IEludDE2QXJyYXkod2lkdGggKiBoZWlnaHQgKiBnbE51bUNoYW5uZWxzKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIElOVDpcblx0XHRcdFx0Ly8gRmlyZWZveCByZXF1aXJlcyB0aGF0IFJHQkFfSU5URUdFUi9JTlQgaXMgdXNlZCBmb3IgcmVhZFBpeGVscyBvZiBpbnQgdHlwZXMuXG5cdFx0XHRcdGdsTnVtQ2hhbm5lbHMgPSA0O1xuXHRcdFx0XHRnbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR0JBX0lOVEVHRVI7XG5cdFx0XHRcdHZhbHVlcyA9IG5ldyBJbnQzMkFycmF5KHdpZHRoICogaGVpZ2h0ICogZ2xOdW1DaGFubmVscyk7XG5cdFx0XHRcdC8vIC8vIFRoZSBmb2xsb3dpbmcgd29ya3MgaW4gQ2hyb21lLlxuXHRcdFx0XHQvLyB2YWx1ZXMgPSBuZXcgSW50MzJBcnJheSh3aWR0aCAqIGhlaWdodCAqIGdsTnVtQ2hhbm5lbHMpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgaW50ZXJuYWxUeXBlICR7aW50ZXJuYWxUeXBlfSBmb3IgZ2V0VmFsdWVzKCkuYCk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMucmVhZHlUb1JlYWQoKSkge1xuXHRcdFx0Ly8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1dlYkdMUmVuZGVyaW5nQ29udGV4dC9yZWFkUGl4ZWxzXG5cdFx0XHRnbC5yZWFkUGl4ZWxzKDAsIDAsIHdpZHRoLCBoZWlnaHQsIGdsRm9ybWF0LCBnbFR5cGUsIHZhbHVlcyk7XG5cdFx0XHRjb25zdCB7IG51bUNvbXBvbmVudHMsIHR5cGUgfSA9IGRhdGFMYXllcjtcblx0XHRcdGNvbnN0IE9VVFBVVF9MRU5HVEggPSB3aWR0aCAqIGhlaWdodCAqIG51bUNvbXBvbmVudHM7XG5cblx0XHRcdC8vIENvbnZlcnQgdWludDE2IHRvIGZsb2F0MzIgaWYgbmVlZGVkLlxuXHRcdFx0Y29uc3QgaGFuZGxlRmxvYXQxNkNvbnZlcnNpb24gPSBpbnRlcm5hbFR5cGUgPT09IEhBTEZfRkxPQVQgJiYgdmFsdWVzLmNvbnN0cnVjdG9yID09PSBVaW50MTZBcnJheTtcblx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdGNvbnN0IHZpZXcgPSBoYW5kbGVGbG9hdDE2Q29udmVyc2lvbiA/IG5ldyBEYXRhVmlldygodmFsdWVzIGFzIFVpbnQxNkFycmF5KS5idWZmZXIpIDogdW5kZWZpbmVkO1xuXG5cdFx0XHRsZXQgb3V0cHV0OiBEYXRhTGF5ZXJBcnJheVR5cGUgPSB2YWx1ZXM7XG5cdFx0XHRcblx0XHRcdC8vIFdlIG1heSB1c2UgYSBkaWZmZXJlbnQgaW50ZXJuYWwgdHlwZSB0aGFuIHRoZSBhc3NpZ25lZCB0eXBlIG9mIHRoZSBEYXRhTGF5ZXIuXG5cdFx0XHRpZiAoaW50ZXJuYWxUeXBlICE9PSB0eXBlKSB7XG5cdFx0XHRcdHN3aXRjaCAodHlwZSkge1xuXHRcdFx0XHRcdGNhc2UgSEFMRl9GTE9BVDpcblx0XHRcdFx0XHRjYXNlIEZMT0FUOlxuXHRcdFx0XHRcdFx0b3V0cHV0ID0gbmV3IEZsb2F0MzJBcnJheShPVVRQVVRfTEVOR1RIKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgVU5TSUdORURfQllURTpcblx0XHRcdFx0XHRcdG91dHB1dCA9IG5ldyBVaW50OEFycmF5KE9VVFBVVF9MRU5HVEgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBCWVRFOlxuXHRcdFx0XHRcdFx0b3V0cHV0ID0gbmV3IEludDhBcnJheShPVVRQVVRfTEVOR1RIKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgVU5TSUdORURfU0hPUlQ6XG5cdFx0XHRcdFx0XHRvdXRwdXQgPSBuZXcgVWludDE2QXJyYXkoT1VUUFVUX0xFTkdUSCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIFNIT1JUOlxuXHRcdFx0XHRcdFx0b3V0cHV0ID0gbmV3IEludDE2QXJyYXkoT1VUUFVUX0xFTkdUSCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIFVOU0lHTkVEX0lOVDpcblx0XHRcdFx0XHRcdG91dHB1dCA9IG5ldyBVaW50MzJBcnJheShPVVRQVVRfTEVOR1RIKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgSU5UOlxuXHRcdFx0XHRcdFx0b3V0cHV0ID0gbmV3IEludDMyQXJyYXkoT1VUUFVUX0xFTkdUSCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCB0eXBlICR7dHlwZX0gZm9yIGdldFZhbHVlcygpLmApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIEluIHNvbWUgY2FzZXMgZ2xOdW1DaGFubmVscyBtYXkgYmUgPiBudW1Db21wb25lbnRzLlxuXHRcdFx0aWYgKGhhbmRsZUZsb2F0MTZDb252ZXJzaW9uIHx8IG91dHB1dCAhPT0gdmFsdWVzIHx8IG51bUNvbXBvbmVudHMgIT09IGdsTnVtQ2hhbm5lbHMpIHtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDAsIGxlbmd0aCA9IHdpZHRoICogaGVpZ2h0OyBpIDwgbGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRjb25zdCBpbmRleDEgPSBpICogZ2xOdW1DaGFubmVscztcblx0XHRcdFx0XHRjb25zdCBpbmRleDIgPSBpICogbnVtQ29tcG9uZW50cztcblx0XHRcdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IG51bUNvbXBvbmVudHM7IGorKykge1xuXHRcdFx0XHRcdFx0aWYgKGhhbmRsZUZsb2F0MTZDb252ZXJzaW9uKSB7XG5cdFx0XHRcdFx0XHRcdG91dHB1dFtpbmRleDIgKyBqXSA9IGdldEZsb2F0MTYodmlldyEsIDIgKiAoaW5kZXgxICsgaiksIHRydWUpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0b3V0cHV0W2luZGV4MiArIGpdID0gdmFsdWVzW2luZGV4MSArIGpdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAob3V0cHV0Lmxlbmd0aCAhPT0gT1VUUFVUX0xFTkdUSCkge1xuXHRcdFx0XHRvdXRwdXQgPSBvdXRwdXQuc2xpY2UoMCwgT1VUUFVUX0xFTkdUSCk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gb3V0cHV0O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byByZWFkIHZhbHVlcyBmcm9tIEJ1ZmZlciB3aXRoIHN0YXR1czogJHtnbC5jaGVja0ZyYW1lYnVmZmVyU3RhdHVzKGdsLkZSQU1FQlVGRkVSKX0uYCk7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSByZWFkeVRvUmVhZCgpIHtcblx0XHRjb25zdCB7IGdsIH0gPSB0aGlzO1xuXHRcdHJldHVybiBnbC5jaGVja0ZyYW1lYnVmZmVyU3RhdHVzKGdsLkZSQU1FQlVGRkVSKSA9PSBnbC5GUkFNRUJVRkZFUl9DT01QTEVURTtcblx0fTtcblxuXHRzYXZlUE5HKGRhdGFMYXllcjogRGF0YUxheWVyLCBmaWxlbmFtZSA9IGRhdGFMYXllci5uYW1lLCBkcGk/OiBudW1iZXIpIHtcblx0XHRjb25zdCB2YWx1ZXMgPSB0aGlzLmdldFZhbHVlcyhkYXRhTGF5ZXIpO1xuXHRcdGNvbnN0IFt3aWR0aCwgaGVpZ2h0XSA9IGRhdGFMYXllci5nZXREaW1lbnNpb25zKCk7XG5cblx0XHRjb25zdCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcblx0XHRjYW52YXMud2lkdGggPSB3aWR0aDtcbiAgICBcdGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XG5cdFx0Y29uc3QgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpITtcblx0XHRjb25zdCBpbWFnZURhdGEgPSBjb250ZXh0LmdldEltYWdlRGF0YSgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcblx0XHRjb25zdCBidWZmZXIgPSBpbWFnZURhdGEuZGF0YTtcblx0XHQvLyBUT0RPOiB0aGlzIGlzbid0IHdvcmtpbmcgZm9yIFVOU0lHTkVEX0JZVEUgdHlwZXM/XG5cdFx0Y29uc3QgaXNGbG9hdCA9IGRhdGFMYXllci50eXBlID09PSBGTE9BVCB8fCBkYXRhTGF5ZXIudHlwZSA9PT0gSEFMRl9GTE9BVDtcblx0XHQvLyBIYXZlIHRvIGZsaXAgdGhlIHkgYXhpcyBzaW5jZSBQTkdzIGFyZSB3cml0dGVuIHRvcCB0byBib3R0b20uXG5cdFx0Zm9yIChsZXQgeSA9IDA7IHkgPCBoZWlnaHQ7IHkrKykge1xuXHRcdFx0Zm9yIChsZXQgeCA9IDA7IHggPCB3aWR0aDsgeCsrKSB7XG5cdFx0XHRcdGNvbnN0IGluZGV4ID0geSAqIHdpZHRoICsgeDtcblx0XHRcdFx0Y29uc3QgaW5kZXhGbGlwcGVkID0gKGhlaWdodCAtIDEgLSB5KSAqIHdpZHRoICsgeDtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhTGF5ZXIubnVtQ29tcG9uZW50czsgaSsrKSB7XG5cdFx0XHRcdFx0YnVmZmVyWzQgKiBpbmRleEZsaXBwZWQgKyBpXSA9IHZhbHVlc1tkYXRhTGF5ZXIubnVtQ29tcG9uZW50cyAqIGluZGV4ICsgaV0gKiAoaXNGbG9hdCA/IDI1NSA6IDEpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChkYXRhTGF5ZXIubnVtQ29tcG9uZW50cyA8IDQpIHtcblx0XHRcdFx0XHRidWZmZXJbNCAqIGluZGV4RmxpcHBlZCArIDNdID0gMjU1O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdC8vIGNvbnNvbGUubG9nKHZhbHVlcywgYnVmZmVyKTtcblx0XHRjb250ZXh0LnB1dEltYWdlRGF0YShpbWFnZURhdGEsIDAsIDApO1xuXG5cdFx0Y2FudmFzIS50b0Jsb2IoKGJsb2IpID0+IHtcblx0XHRcdGlmICghYmxvYikge1xuXHRcdFx0XHRjb25zb2xlLndhcm4oJ1Byb2JsZW0gc2F2aW5nIFBORywgdW5hYmxlIHRvIGluaXQgYmxvYi4nKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGRwaSkge1xuXHRcdFx0XHRjaGFuZ2VEcGlCbG9iKGJsb2IsIGRwaSkudGhlbigoYmxvYjogQmxvYikgPT57XG5cdFx0XHRcdFx0c2F2ZUFzKGJsb2IsIGAke2ZpbGVuYW1lfS5wbmdgKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzYXZlQXMoYmxvYiwgYCR7ZmlsZW5hbWV9LnBuZ2ApO1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0fSwgJ2ltYWdlL3BuZycpO1xuXHR9XG5cbiAgICByZXNldCgpIHtcblx0XHQvLyBUT0RPOiBpbXBsZW1lbnQgdGhpcy5cblx0XHR0aHJvdyBuZXcgRXJyb3IoJ1dlYkdMQ29tcHV0ZS5yZXNldCgpIG5vdCBpbXBsZW1lbnRlZC4nKTtcblx0fTtcblxuXHRhdHRhY2hEYXRhTGF5ZXJUb1RocmVlVGV4dHVyZShkYXRhTGF5ZXI6IERhdGFMYXllciwgdGV4dHVyZTogVGV4dHVyZSkge1xuXHRcdGlmICghdGhpcy5yZW5kZXJlcikge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdXZWJHTENvbXB1dGUgd2FzIG5vdCBpbml0ZWQgd2l0aCBhIHJlbmRlcmVyLicpO1xuXHRcdH1cblx0XHQvLyBMaW5rIHdlYmdsIHRleHR1cmUgdG8gdGhyZWVqcyBvYmplY3QuXG5cdFx0Ly8gVGhpcyBpcyBub3Qgb2ZmaWNpYWxseSBzdXBwb3J0ZWQuXG5cdFx0aWYgKGRhdGFMYXllci5udW1CdWZmZXJzID4gMSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBEYXRhTGF5ZXIgXCIke2RhdGFMYXllci5uYW1lfVwiIGNvbnRhaW5zIG11bHRpcGxlIFdlYkdMIHRleHR1cmVzIChvbmUgZm9yIGVhY2ggYnVmZmVyKSB0aGF0IGFyZSBmbGlwLWZsb3BwZWQgZHVyaW5nIGNvbXB1dGUgY3ljbGVzLCBwbGVhc2UgY2hvb3NlIGEgRGF0YUxheWVyIHdpdGggb25lIGJ1ZmZlci5gKTtcblx0XHR9XG5cdFx0Y29uc3Qgb2Zmc2V0VGV4dHVyZVByb3BlcnRpZXMgPSB0aGlzLnJlbmRlcmVyLnByb3BlcnRpZXMuZ2V0KHRleHR1cmUpO1xuXHRcdG9mZnNldFRleHR1cmVQcm9wZXJ0aWVzLl9fd2ViZ2xUZXh0dXJlID0gZGF0YUxheWVyLmdldEN1cnJlbnRTdGF0ZVRleHR1cmUoKTtcblx0XHRvZmZzZXRUZXh0dXJlUHJvcGVydGllcy5fX3dlYmdsSW5pdCA9IHRydWU7XG5cdH1cblxuXHRyZXNldFRocmVlU3RhdGUoKSB7XG5cdFx0aWYgKCF0aGlzLnJlbmRlcmVyKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ1dlYkdMQ29tcHV0ZSB3YXMgbm90IGluaXRlZCB3aXRoIGEgcmVuZGVyZXIuJyk7XG5cdFx0fVxuXHRcdGNvbnN0IHsgZ2wgfSA9IHRoaXM7XG5cdFx0Ly8gUmVzZXQgdmlld3BvcnQuXG5cdFx0Y29uc3Qgdmlld3BvcnQgPSB0aGlzLnJlbmRlcmVyLmdldFZpZXdwb3J0KG5ldyB1dGlscy5WZWN0b3I0KCkgYXMgVmVjdG9yNCk7XG5cdFx0Z2wudmlld3BvcnQodmlld3BvcnQueCwgdmlld3BvcnQueSwgdmlld3BvcnQud2lkdGgsIHZpZXdwb3J0LmhlaWdodCk7XG5cdFx0Ly8gVW5iaW5kIGZyYW1lYnVmZmVyIChyZW5kZXIgdG8gc2NyZWVuKS5cblx0XHR0aGlzLnJlbmRlcmVyLnNldFJlbmRlclRhcmdldChudWxsKTtcblx0XHQvLyBSZXNldCB0ZXh0dXJlIGJpbmRpbmdzLlxuXHRcdHRoaXMucmVuZGVyZXIucmVzZXRTdGF0ZSgpO1xuXHR9XG5cdFxuXHRkZXN0cm95KCkge1xuXHRcdC8vIFRPRE86IE5lZWQgdG8gaW1wbGVtZW50IHRoaXMuXG5cdFx0ZGVsZXRlIHRoaXMucmVuZGVyZXI7XG5cdH1cbn0iLCJjb25zdCBleHRlbnNpb25zOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ID0ge307XG5cbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9PRVNfdGV4dHVyZV9mbG9hdFxuLy8gRmxvYXQgaXMgcHJvdmlkZWQgYnkgZGVmYXVsdCBpbiBXZWJHTDIgY29udGV4dHMuXG4vLyBUaGlzIGV4dGVuc2lvbiBpbXBsaWNpdGx5IGVuYWJsZXMgdGhlIFdFQkdMX2NvbG9yX2J1ZmZlcl9mbG9hdCBleHRlbnNpb24gKGlmIHN1cHBvcnRlZCksIHdoaWNoIGFsbG93cyByZW5kZXJpbmcgdG8gMzItYml0IGZsb2F0aW5nLXBvaW50IGNvbG9yIGJ1ZmZlcnMuXG5leHBvcnQgY29uc3QgT0VTX1RFWFRVUkVfRkxPQVQgPSAnT0VTX3RleHR1cmVfZmxvYXQnO1xuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL09FU190ZXh0dXJlX2hhbGZfZmxvYXRcbi8vIEhhbGYgZmxvYXQgaXMgc3VwcG9ydGVkIGJ5IG1vZGVybiBtb2JpbGUgYnJvd3NlcnMsIGZsb2F0IG5vdCB5ZXQgc3VwcG9ydGVkLlxuLy8gSGFsZiBmbG9hdCBpcyBwcm92aWRlZCBieSBkZWZhdWx0IGZvciBXZWJnbDIgY29udGV4dHMuXG4vLyBUaGlzIGV4dGVuc2lvbiBpbXBsaWNpdGx5IGVuYWJsZXMgdGhlIEVYVF9jb2xvcl9idWZmZXJfaGFsZl9mbG9hdCBleHRlbnNpb24gKGlmIHN1cHBvcnRlZCksIHdoaWNoIGFsbG93cyByZW5kZXJpbmcgdG8gMTYtYml0IGZsb2F0aW5nIHBvaW50IGZvcm1hdHMuXG5leHBvcnQgY29uc3QgT0VTX1RFWFRVUkVfSEFMRl9GTE9BVCA9ICdPRVNfdGV4dHVyZV9oYWxmX2Zsb2F0Jztcbi8vIFRPRE86IFNlZW1zIGxpa2UgbGluZWFyIGZpbHRlcmluZyBvZiBmbG9hdHMgbWF5IGJlIHN1cHBvcnRlZCBpbiBzb21lIGJyb3dzZXJzIHdpdGhvdXQgdGhlc2UgZXh0ZW5zaW9ucz9cbi8vIGh0dHBzOi8vd3d3Lmtocm9ub3Mub3JnL3JlZ2lzdHJ5L09wZW5HTC9leHRlbnNpb25zL09FUy9PRVNfdGV4dHVyZV9mbG9hdF9saW5lYXIudHh0XG5leHBvcnQgY29uc3QgT0VTX1RFWFRVUkVfRkxPQVRfTElORUFSID0gJ09FU190ZXh0dXJlX2Zsb2F0X2xpbmVhcic7XG5leHBvcnQgY29uc3QgT0VTX1RFWFRVUkVfSEFsRl9GTE9BVF9MSU5FQVIgPSAnT0VTX3RleHR1cmVfaGFsZl9mbG9hdF9saW5lYXInO1xuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1dFQkdMX2RlcHRoX3RleHR1cmVcbi8vIEFkZHMgZ2wuVU5TSUdORURfU0hPUlQsIGdsLlVOU0lHTkVEX0lOVCB0eXBlcyB0byB0ZXh0SW1hZ2UyRCBpbiBXZWJHTDEuMFxuZXhwb3J0IGNvbnN0IFdFQkdMX0RFUFRIX1RFWFRVUkUgPSAnV0VCR0xfZGVwdGhfdGV4dHVyZSc7XG4vLyBFWFRfQ09MT1JfQlVGRkVSX0ZMT0FUIGFkZHMgYWJpbGl0eSB0byByZW5kZXIgdG8gYSB2YXJpZXR5IG9mIGZsb2F0aW5nIHB0IHRleHR1cmVzLlxuLy8gVGhpcyBpcyBuZWVkZWQgZm9yIHRoZSBXZWJHTDIgY29udGV4dHMgdGhhdCBkbyBub3Qgc3VwcG9ydCBPRVNfVEVYVFVSRV9GTE9BVCAvIE9FU19URVhUVVJFX0hBTEZfRkxPQVQgZXh0ZW5zaW9ucy5cbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FWFRfY29sb3JfYnVmZmVyX2Zsb2F0XG4vLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8zNDI2MjQ5My9mcmFtZWJ1ZmZlci1pbmNvbXBsZXRlLWF0dGFjaG1lbnQtZm9yLXRleHR1cmUtd2l0aC1pbnRlcm5hbC1mb3JtYXRcbi8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzM2MTA5MzQ3L2ZyYW1lYnVmZmVyLWluY29tcGxldGUtYXR0YWNobWVudC1vbmx5LWhhcHBlbnMtb24tYW5kcm9pZC13LWZpcmVmb3hcbmV4cG9ydCBjb25zdCBFWFRfQ09MT1JfQlVGRkVSX0ZMT0FUID0gJ0VYVF9jb2xvcl9idWZmZXJfZmxvYXQnO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RXh0ZW5zaW9uKFxuXHRnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0IHwgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCxcblx0ZXh0ZW5zaW9uTmFtZTogc3RyaW5nLFxuXHRlcnJvckNhbGxiYWNrOiAobWVzc2FnZTogc3RyaW5nKSA9PiB2b2lkLFxuXHRvcHRpb25hbCA9IGZhbHNlLFxuKSB7XG5cdC8vIENoZWNrIGlmIHdlJ3ZlIGFscmVhZHkgbG9hZGVkIHRoZSBleHRlbnNpb24uXG5cdGlmIChleHRlbnNpb25zW2V4dGVuc2lvbk5hbWVdICE9PSB1bmRlZmluZWQpIHJldHVybiBleHRlbnNpb25zW2V4dGVuc2lvbk5hbWVdO1xuXG5cdGxldCBleHRlbnNpb247XG5cdHRyeSB7XG5cdFx0ZXh0ZW5zaW9uID0gZ2wuZ2V0RXh0ZW5zaW9uKGV4dGVuc2lvbk5hbWUpO1xuXHR9IGNhdGNoIChlKSB7fVxuXHRpZiAoZXh0ZW5zaW9uKSB7XG5cdFx0Ly8gQ2FjaGUgdGhpcyBleHRlbnNpb24uXG5cdFx0ZXh0ZW5zaW9uc1tleHRlbnNpb25OYW1lXSA9IGV4dGVuc2lvbjtcblx0XHRjb25zb2xlLmxvZyhgTG9hZGVkIGV4dGVuc2lvbjogJHtleHRlbnNpb25OYW1lfS5gKTtcblx0fSBlbHNlIHtcblx0XHRleHRlbnNpb25zW2V4dGVuc2lvbk5hbWVdID0gZmFsc2U7IC8vIENhY2hlIHRoZSBiYWQgZXh0ZW5zaW9uIGxvb2t1cC5cblx0XHRjb25zb2xlLndhcm4oYFVuc3VwcG9ydGVkICR7b3B0aW9uYWwgPyAnb3B0aW9uYWwgJyA6ICcnfWV4dGVuc2lvbjogJHtleHRlbnNpb25OYW1lfS5gKTtcblx0fVxuXHQvLyBJZiB0aGUgZXh0ZW5zaW9uIGlzIG5vdCBvcHRpb25hbCwgdGhyb3cgZXJyb3IuXG5cdGlmICghZXh0ZW5zaW9uICYmICFvcHRpb25hbCkge1xuXHRcdGVycm9yQ2FsbGJhY2soYFJlcXVpcmVkIGV4dGVuc2lvbiB1bnN1cHBvcnRlZCBieSB0aGlzIGRldmljZSAvIGJyb3dzZXI6ICR7ZXh0ZW5zaW9uTmFtZX0uYCk7XG5cdH1cblx0cmV0dXJuIGV4dGVuc2lvbjtcbn0iLCJpbXBvcnQgeyBXZWJHTENvbXB1dGUgfSBmcm9tICcuL1dlYkdMQ29tcHV0ZSc7XG5leHBvcnQgKiBmcm9tICcuL0NvbnN0YW50cyc7XG5cbmV4cG9ydCB7XG5cdFdlYkdMQ29tcHV0ZSxcbn07IiwiLy8gQ29waWVkIGZyb20gaHR0cDovL3dlYmdsZnVuZGFtZW50YWxzLm9yZy93ZWJnbC9sZXNzb25zL3dlYmdsLWJvaWxlcnBsYXRlLmh0bWxcbmV4cG9ydCBmdW5jdGlvbiBjb21waWxlU2hhZGVyKFxuXHRnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0IHwgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCxcblx0ZXJyb3JDYWxsYmFjazogKG1lc3NhZ2U6IHN0cmluZykgPT4gdm9pZCxcblx0c2hhZGVyU291cmNlOiBzdHJpbmcsXG5cdHNoYWRlclR5cGU6IG51bWJlcixcblx0cHJvZ3JhbU5hbWU/OiBzdHJpbmcsXG4pIHtcblx0Ly8gQ3JlYXRlIHRoZSBzaGFkZXIgb2JqZWN0XG5cdGNvbnN0IHNoYWRlciA9IGdsLmNyZWF0ZVNoYWRlcihzaGFkZXJUeXBlKTtcblx0aWYgKCFzaGFkZXIpIHtcblx0XHRlcnJvckNhbGxiYWNrKCdVbmFibGUgdG8gaW5pdCBnbCBzaGFkZXIuJyk7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHQvLyBTZXQgdGhlIHNoYWRlciBzb3VyY2UgY29kZS5cblx0Z2wuc2hhZGVyU291cmNlKHNoYWRlciwgc2hhZGVyU291cmNlKTtcblxuXHQvLyBDb21waWxlIHRoZSBzaGFkZXJcblx0Z2wuY29tcGlsZVNoYWRlcihzaGFkZXIpO1xuXG5cdC8vIENoZWNrIGlmIGl0IGNvbXBpbGVkXG5cdGNvbnN0IHN1Y2Nlc3MgPSBnbC5nZXRTaGFkZXJQYXJhbWV0ZXIoc2hhZGVyLCBnbC5DT01QSUxFX1NUQVRVUyk7XG5cdGlmICghc3VjY2Vzcykge1xuXHRcdC8vIFNvbWV0aGluZyB3ZW50IHdyb25nIGR1cmluZyBjb21waWxhdGlvbiAtIHByaW50IHRoZSBlcnJvci5cblx0XHRlcnJvckNhbGxiYWNrKGBDb3VsZCBub3QgY29tcGlsZSAke3NoYWRlclR5cGUgPT09IGdsLkZSQUdNRU5UX1NIQURFUiA/ICdmcmFnbWVudCcgOiAndmVydGV4J31cblx0XHRcdCBzaGFkZXIke3Byb2dyYW1OYW1lID8gYCBmb3IgcHJvZ3JhbSBcIiR7cHJvZ3JhbU5hbWV9XCJgIDogJyd9OiAke2dsLmdldFNoYWRlckluZm9Mb2coc2hhZGVyKX0uYCk7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblx0cmV0dXJuIHNoYWRlcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzV2ViR0wyKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQgfCBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KSB7XG5cdC8vIFRoaXMgY29kZSBpcyBwdWxsZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vbXJkb29iL3RocmVlLmpzL2Jsb2IvbWFzdGVyL3NyYy9yZW5kZXJlcnMvd2ViZ2wvV2ViR0xDYXBhYmlsaXRpZXMuanNcblx0Ly8gQHRzLWlnbm9yZVxuXHRyZXR1cm4gKHR5cGVvZiBXZWJHTDJSZW5kZXJpbmdDb250ZXh0ICE9PSAndW5kZWZpbmVkJyAmJiBnbCBpbnN0YW5jZW9mIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpIHx8ICh0eXBlb2YgV2ViR0wyQ29tcHV0ZVJlbmRlcmluZ0NvbnRleHQgIT09ICd1bmRlZmluZWQnICYmIGdsIGluc3RhbmNlb2YgV2ViR0wyQ29tcHV0ZVJlbmRlcmluZ0NvbnRleHQpO1xuXHQvLyByZXR1cm4gISEoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuSEFMRl9GTE9BVDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzUG93ZXJPZjIodmFsdWU6IG51bWJlcikge1xuXHRyZXR1cm4gKHZhbHVlICYgKHZhbHVlIC0gMSkpID09IDA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0U2VxdWVudGlhbEZsb2F0QXJyYXkobGVuZ3RoOiBudW1iZXIpIHtcblx0Y29uc3QgYXJyYXkgPSBuZXcgRmxvYXQzMkFycmF5KGxlbmd0aCk7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcblx0XHRhcnJheVtpXSA9IGk7XG5cdH1cblx0cmV0dXJuIGFycmF5O1xufSIsIi8vIFRoZXNlIGFyZSB0aGUgcGFydHMgb2YgdGhyZWVqcyBWZWN0b3I0IHRoYXQgd2UgbmVlZC5cbmV4cG9ydCBjbGFzcyBWZWN0b3I0IHtcblx0eDogbnVtYmVyO1xuXHR5OiBudW1iZXI7XG5cdHo6IG51bWJlcjtcblx0dzogbnVtYmVyO1xuXHRjb25zdHJ1Y3RvciggeCA9IDAsIHkgPSAwLCB6ID0gMCwgdyA9IDEgKSB7XG5cdFx0dGhpcy54ID0geDtcblx0XHR0aGlzLnkgPSB5O1xuXHRcdHRoaXMueiA9IHo7XG5cdFx0dGhpcy53ID0gdztcblx0fVxuXHRnZXQgd2lkdGgoKSB7XG5cdFx0cmV0dXJuIHRoaXMuejtcblx0fVxuXHRnZXQgaGVpZ2h0KCkge1xuXHRcdHJldHVybiB0aGlzLnc7XG5cdH1cblx0Y29weSh2OiBWZWN0b3I0KSB7XG5cdFx0dGhpcy54ID0gdi54O1xuXHRcdHRoaXMueSA9IHYueTtcblx0XHR0aGlzLnogPSB2Lno7XG5cdFx0dGhpcy53ID0gdi53O1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG59IiwibW9kdWxlLmV4cG9ydHMgPSBcInByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5cXG52YXJ5aW5nIHZlYzIgdl9VVjtcXG5cXG51bmlmb3JtIHNhbXBsZXIyRCB1X3N0YXRlO1xcblxcbnZvaWQgbWFpbigpIHtcXG5cXHRnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodV9zdGF0ZSwgdl9VVik7XFxufVwiIiwibW9kdWxlLmV4cG9ydHMgPSBcIi8vIEZyYWdtZW50IHNoYWRlciB0aGF0IGRyYXdzIGEgc2luZ2xlIGNvbG9yLlxcbnByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5cXG51bmlmb3JtIHZlYzMgdV9jb2xvcjtcXG5cXG52b2lkIG1haW4oKSB7XFxuXFx0Z2xfRnJhZ0NvbG9yID0gdmVjNCh1X2NvbG9yLCAxKTtcXG59XCIiLCJtb2R1bGUuZXhwb3J0cyA9IFwiLy8gRnJhZ21lbnQgc2hhZGVyIHRoYXQgZHJhd3MgYSBzaW5nbGUgY29sb3IuXFxucHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcblxcbnVuaWZvcm0gdmVjMyB1X2NvbG9yO1xcbnZhcnlpbmcgdmVjMiB2X2xpbmVXcmFwcGluZztcXG5cXG52b2lkIG1haW4oKSB7XFxuXFx0Ly8gY2hlY2sgaWYgdGhpcyBsaW5lIGhhcyB3cmFwcGVkLlxcblxcdGlmICgodl9saW5lV3JhcHBpbmcueCAhPSAwLjAgJiYgdl9saW5lV3JhcHBpbmcueCAhPSAxLjApIHx8ICh2X2xpbmVXcmFwcGluZy55ICE9IDAuMCAmJiB2X2xpbmVXcmFwcGluZy55ICE9IDEuMCkpIHtcXG5cXHRcXHQvLyBSZW5kZXIgbm90aGluZy5cXG5cXHRcXHRkaXNjYXJkO1xcblxcdFxcdHJldHVybjtcXG5cXHR9XFxuXFx0Z2xfRnJhZ0NvbG9yID0gdmVjNCh1X2NvbG9yLCAxKTtcXG59XCIiLCJtb2R1bGUuZXhwb3J0cyA9IFwiI3ZlcnNpb24gMzAwIGVzXFxucHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcbnByZWNpc2lvbiBoaWdocCBzYW1wbGVyMkQ7XFxuXFxuaW4gdmVjMiB2X1VWO1xcblxcbnVuaWZvcm0gc2FtcGxlcjJEIHVfc3RhdGU7XFxuXFxub3V0IHZlYzQgb3V0X2ZyYWdDb2xvcjtcXG5cXG52b2lkIG1haW4oKSB7XFxuXFx0b3V0X2ZyYWdDb2xvciA9IHRleHR1cmUodV9zdGF0ZSwgdl9VVik7XFxufVwiIiwibW9kdWxlLmV4cG9ydHMgPSBcIiN2ZXJzaW9uIDMwMCBlc1xcbnByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5wcmVjaXNpb24gaGlnaHAgaW50O1xcbnByZWNpc2lvbiBoaWdocCBpc2FtcGxlcjJEO1xcblxcbmluIHZlYzIgdl9VVjtcXG5cXG51bmlmb3JtIGlzYW1wbGVyMkQgdV9zdGF0ZTtcXG5cXG5vdXQgaXZlYzQgb3V0X2ZyYWdDb2xvcjtcXG5cXG52b2lkIG1haW4oKSB7XFxuXFx0b3V0X2ZyYWdDb2xvciA9IHRleHR1cmUodV9zdGF0ZSwgdl9VVik7XFxufVwiIiwibW9kdWxlLmV4cG9ydHMgPSBcIiN2ZXJzaW9uIDMwMCBlc1xcbnByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5wcmVjaXNpb24gaGlnaHAgaW50O1xcbnByZWNpc2lvbiBoaWdocCB1c2FtcGxlcjJEO1xcblxcbmluIHZlYzIgdl9VVjtcXG5cXG51bmlmb3JtIHVzYW1wbGVyMkQgdV9zdGF0ZTtcXG5cXG5vdXQgdXZlYzQgb3V0X2ZyYWdDb2xvcjtcXG5cXG52b2lkIG1haW4oKSB7XFxuXFx0b3V0X2ZyYWdDb2xvciA9IHRleHR1cmUodV9zdGF0ZSwgdl9VVik7XFxufVwiIiwibW9kdWxlLmV4cG9ydHMgPSBcIi8vIEZyYWdtZW50IHNoYWRlciB0aGF0IGRyYXdzIGEgc2luZ2xlIGNvbG9yLlxcbnByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5cXG51bmlmb3JtIHZlYzMgdV9jb2xvcjtcXG5cXG52b2lkIG1haW4oKSB7XFxuXFx0Z2xfRnJhZ0NvbG9yID0gdmVjNCh1X2NvbG9yLCAxKTtcXG59XCIiLCJtb2R1bGUuZXhwb3J0cyA9IFwiLy8gRnJhZ21lbnQgc2hhZGVyIHRoYXQgZHJhd3MgYSBzaW5nbGUgY29sb3IuXFxucHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcblxcbnVuaWZvcm0gdmVjMyB1X2NvbG9yO1xcbnZhcnlpbmcgdmVjMiB2X2xpbmVXcmFwcGluZztcXG5cXG52b2lkIG1haW4oKSB7XFxuXFx0Ly8gY2hlY2sgaWYgdGhpcyBsaW5lIGhhcyB3cmFwcGVkLlxcblxcdGlmICgodl9saW5lV3JhcHBpbmcueCAhPSAwLjAgJiYgdl9saW5lV3JhcHBpbmcueCAhPSAxLjApIHx8ICh2X2xpbmVXcmFwcGluZy55ICE9IDAuMCAmJiB2X2xpbmVXcmFwcGluZy55ICE9IDEuMCkpIHtcXG5cXHRcXHQvLyBSZW5kZXIgbm90aGluZy5cXG5cXHRcXHRkaXNjYXJkO1xcblxcdFxcdHJldHVybjtcXG5cXHR9XFxuXFx0Z2xfRnJhZ0NvbG9yID0gdmVjNCh1X2NvbG9yLCAxKTtcXG59XCIiLCJmdW5jdGlvbiB3ZWJwYWNrRW1wdHlDb250ZXh0KHJlcSkge1xuXHR2YXIgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyByZXEgKyBcIidcIik7XG5cdGUuY29kZSA9ICdNT0RVTEVfTk9UX0ZPVU5EJztcblx0dGhyb3cgZTtcbn1cbndlYnBhY2tFbXB0eUNvbnRleHQua2V5cyA9ICgpID0+IChbXSk7XG53ZWJwYWNrRW1wdHlDb250ZXh0LnJlc29sdmUgPSB3ZWJwYWNrRW1wdHlDb250ZXh0O1xud2VicGFja0VtcHR5Q29udGV4dC5pZCA9IFwiLi9zcmMgc3luYyByZWN1cnNpdmVcIjtcbm1vZHVsZS5leHBvcnRzID0gd2VicGFja0VtcHR5Q29udGV4dDsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHRsb2FkZWQ6IGZhbHNlLFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcblx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18uaG1kID0gKG1vZHVsZSkgPT4ge1xuXHRtb2R1bGUgPSBPYmplY3QuY3JlYXRlKG1vZHVsZSk7XG5cdGlmICghbW9kdWxlLmNoaWxkcmVuKSBtb2R1bGUuY2hpbGRyZW4gPSBbXTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG1vZHVsZSwgJ2V4cG9ydHMnLCB7XG5cdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRzZXQ6ICgpID0+IHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignRVMgTW9kdWxlcyBtYXkgbm90IGFzc2lnbiBtb2R1bGUuZXhwb3J0cyBvciBleHBvcnRzLiosIFVzZSBFU00gZXhwb3J0IHN5bnRheCwgaW5zdGVhZDogJyArIG1vZHVsZS5pZCk7XG5cdFx0fVxuXHR9KTtcblx0cmV0dXJuIG1vZHVsZTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2luZGV4LnRzXCIpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==