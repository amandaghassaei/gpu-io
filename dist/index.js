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
        src_1: __webpack_require__(/*! ./glsl_1/DefaultVertexShader.glsl */ "./src/glsl_1/DefaultVertexShader.glsl"),
        src_3: '',
    },
    _a[DEFAULT_W_UV_PROGRAM_NAME] = {
        src_1: __webpack_require__(/*! ./glsl_1/DefaultVertexShader.glsl */ "./src/glsl_1/DefaultVertexShader.glsl"),
        src_3: '',
        defines: {
            'UV_ATTRIBUTE': '1',
        },
    },
    _a[DEFAULT_W_NORMAL_PROGRAM_NAME] = {
        src_1: __webpack_require__(/*! ./glsl_1/DefaultVertexShader.glsl */ "./src/glsl_1/DefaultVertexShader.glsl"),
        src_3: '',
        defines: {
            'NORMAL_ATTRIBUTE': '1',
        },
    },
    _a[DEFAULT_W_UV_NORMAL_PROGRAM_NAME] = {
        src_1: __webpack_require__(/*! ./glsl_1/DefaultVertexShader.glsl */ "./src/glsl_1/DefaultVertexShader.glsl"),
        src_3: '',
        defines: {
            'UV_ATTRIBUTE': '1',
            'NORMAL_ATTRIBUTE': '1',
        },
    },
    _a[SEGMENT_PROGRAM_NAME] = {
        src_1: __webpack_require__(/*! ./glsl_1/SegmentVertexShader.glsl */ "./src/glsl_1/SegmentVertexShader.glsl"),
        src_3: '',
    },
    _a[DATA_LAYER_POINTS_PROGRAM_NAME] = {
        src_1: __webpack_require__(/*! ./glsl_1/DataLayerPointsVertexShader.glsl */ "./src/glsl_1/DataLayerPointsVertexShader.glsl"),
        src_3: '',
    },
    _a[DATA_LAYER_VECTOR_FIELD_PROGRAM_NAME] = {
        src_1: __webpack_require__(/*! ./glsl_1/DataLayerVectorFieldVertexShader.glsl */ "./src/glsl_1/DataLayerVectorFieldVertexShader.glsl"),
        src_3: '',
    },
    _a[DATA_LAYER_LINES_PROGRAM_NAME] = {
        src_1: __webpack_require__(/*! ./glsl_1/DataLayerLinesVertexShader.glsl */ "./src/glsl_1/DataLayerLinesVertexShader.glsl"),
        src_3: '',
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
            var vertexShaderSource = glslVersion === Constants_1.GLSL3 ? vertexShader.src_3 : vertexShader.src_1;
            if (vertexShaderSource === '') {
                throw new Error("No source for vertex shader " + this.name + " : " + name_2);
            }
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

/***/ "./src/glsl_1/DataLayerLinesVertexShader.glsl":
/*!****************************************************!*\
  !*** ./src/glsl_1/DataLayerLinesVertexShader.glsl ***!
  \****************************************************/
/***/ ((module) => {

module.exports = "precision highp float;\nprecision highp int;\n\n/**\n * Returns accurate MOD when arguments are approximate integers.\n */\nfloat modI(float a, float b) {\n    float m = a - floor((a + 0.5) / b) * b;\n    return floor(m + 0.5);\n}\n\n// Cannot use int vertex attributes: https://stackoverflow.com/questions/27874983/webgl-how-to-use-integer-attributes-in-glsl\nattribute float a_internal_index; // Index of point.\n\nuniform sampler2D u_internal_positions; // Texture lookup with position data.\nuniform vec2 u_internal_positionsDimensions;\nuniform vec2 u_internal_scale;\nuniform bool u_internal_positionWithAccumulation;\nuniform bool u_internal_wrapX;\nuniform bool u_internal_wrapY;\n\nvarying vec2 v_UV;\nvarying vec2 v_lineWrapping; // Use this to test if line is only half wrapped and should not be rendered.\n\nvoid main() {\n\t// Calculate a uv based on the point's index attribute.\n\tvec2 particleUV = vec2(\n\t\tmodI(a_internal_index, u_internal_positionsDimensions.x),\n\t\tfloor(floor(a_internal_index + 0.5) / u_internal_positionsDimensions.x)\n\t) / u_internal_positionsDimensions;\n\n\t// Calculate a global uv for the viewport.\n\t// Lookup vertex position and scale to [0, 1] range.\n\t// We have packed a 2D displacement with the position.\n\tvec4 positionData = texture2D(u_internal_positions, particleUV);\n\t// position = first two components plus last two components (optional accumulation buffer).\n\tvec2 positionAbsolute = positionData.rg;\n\tif (u_internal_positionWithAccumulation) positionAbsolute += positionData.ba;\n\tv_UV = positionAbsolute * u_internal_scale;\n\n\t// Wrap if needed.\n\tv_lineWrapping = vec2(0.0);\n\tif (u_internal_wrapX) {\n\t\tif (v_UV.x < 0.0) {\n\t\t\tv_UV.x += 1.0;\n\t\t\tv_lineWrapping.x = 1.0;\n\t\t} else if (v_UV.x > 1.0) {\n\t\t\tv_UV.x -= 1.0;\n\t\t\tv_lineWrapping.x = 1.0;\n\t\t}\n\t}\n\tif (u_internal_wrapY) {\n\t\tif (v_UV.y < 0.0) {\n\t\t\tv_UV.y += 1.0;\n\t\t\tv_lineWrapping.y = 1.0;\n\t\t} else if (v_UV.y > 1.0) {\n\t\t\tv_UV.y -= 1.0;\n\t\t\tv_lineWrapping.y = 1.0;\n\t\t}\n\t}\n\n\t// Calculate position in [-1, 1] range.\n\tvec2 position = v_UV * 2.0 - 1.0;\n\n\tgl_Position = vec4(position, 0, 1);\n}"

/***/ }),

/***/ "./src/glsl_1/DataLayerPointsVertexShader.glsl":
/*!*****************************************************!*\
  !*** ./src/glsl_1/DataLayerPointsVertexShader.glsl ***!
  \*****************************************************/
/***/ ((module) => {

module.exports = "precision highp float;\nprecision highp int;\n\n/**\n * Returns accurate MOD when arguments are approximate integers.\n */\nfloat modI(float a, float b) {\n    float m = a - floor((a + 0.5) / b) * b;\n    return floor(m + 0.5);\n}\n\n// Cannot use int vertex attributes: https://stackoverflow.com/questions/27874983/webgl-how-to-use-integer-attributes-in-glsl\nattribute float a_internal_index; // Index of point.\n\nuniform sampler2D u_internal_positions; // Texture lookup with position data.\nuniform vec2 u_internal_positionsDimensions;\nuniform vec2 u_internal_scale;\nuniform float u_internal_pointSize;\nuniform bool u_internal_positionWithAccumulation;\nuniform bool u_internal_wrapX;\nuniform bool u_internal_wrapY;\n\nvarying vec2 v_UV;\n\nvoid main() {\n\t// Calculate a uv based on the point's index attribute.\n\tvec2 particleUV = vec2(\n\t\tmodI(a_internal_index, u_internal_positionsDimensions.x),\n\t\tfloor(floor(a_internal_index + 0.5) / u_internal_positionsDimensions.x)\n\t) / u_internal_positionsDimensions;\n\n\t// Calculate a global uv for the viewport.\n\t// Lookup vertex position and scale to [0, 1] range.\n\t// We have packed a 2D displacement with the position.\n\tvec4 positionData = texture2D(u_internal_positions, particleUV);\n\t// position = first two components plus last two components (optional accumulation buffer).\n\tvec2 positionAbsolute = positionData.rg;\n\tif (u_internal_positionWithAccumulation) positionAbsolute += positionData.ba;\n\tv_UV = positionAbsolute * u_internal_scale;\n\n\t// Wrap if needed.\n\tif (u_internal_wrapX) {\n\t\tif (v_UV.x < 0.0) v_UV.x += 1.0;\n\t\tif (v_UV.x > 1.0) v_UV.x -= 1.0;\n\t}\n\tif (u_internal_wrapY) {\n\t\tif (v_UV.y < 0.0) v_UV.y += 1.0;\n\t\tif (v_UV.y > 1.0) v_UV.y -= 1.0;\n\t}\n\n\t// Calculate position in [-1, 1] range.\n\tvec2 position = v_UV * 2.0 - 1.0;\n\n\tgl_PointSize = u_internal_pointSize;\n\tgl_Position = vec4(position, 0, 1);\n}"

/***/ }),

/***/ "./src/glsl_1/DataLayerVectorFieldVertexShader.glsl":
/*!**********************************************************!*\
  !*** ./src/glsl_1/DataLayerVectorFieldVertexShader.glsl ***!
  \**********************************************************/
/***/ ((module) => {

module.exports = "precision highp float;\nprecision highp int;\n\n/**\n * Returns accurate MOD when arguments are approximate integers.\n */\nfloat modI(float a, float b) {\n    float m = a - floor((a + 0.5) / b) * b;\n    return floor(m + 0.5);\n}\n\n// Cannot use int vertex attributes: https://stackoverflow.com/questions/27874983/webgl-how-to-use-integer-attributes-in-glsl\nattribute float a_internal_index; // Index of point.\n\nuniform sampler2D u_internal_vectors; // Texture lookup with vector data.\nuniform vec2 u_internal_dimensions;\nuniform vec2 u_internal_scale;\n\nvarying vec2 v_UV;\n\nvoid main() {\n\t// Divide index by 2.\n\tfloat index = floor((a_internal_index + 0.5) / 2.0);\n\t// Calculate a uv based on the vertex index attribute.\n\tv_UV = vec2(\n\t\tmodI(index, u_internal_dimensions.x),\n\t\tfloor(floor(index + 0.5) / u_internal_dimensions.x)\n\t) / u_internal_dimensions;\n\n\t// Add vector displacement if needed.\n\tif (modI(a_internal_index, 2.0) > 0.0) {\n\t\t// Lookup vectorData at current UV.\n\t\tvec2 vectorData = texture2D(u_internal_vectors, v_UV).xy;\n\t\tv_UV += vectorData * u_internal_scale;\n\t}\n\n\t// Calculate position in [-1, 1] range.\n\tvec2 position = v_UV * 2.0 - 1.0;\n\n\tgl_Position = vec4(position, 0, 1);\n}"

/***/ }),

/***/ "./src/glsl_1/DefaultVertexShader.glsl":
/*!*********************************************!*\
  !*** ./src/glsl_1/DefaultVertexShader.glsl ***!
  \*********************************************/
/***/ ((module) => {

module.exports = "precision highp float;\n\nattribute vec2 a_internal_position;\n#ifdef UV_ATTRIBUTE\nattribute vec2 a_internal_uv;\n#endif\n#ifdef NORMAL_ATTRIBUTE\nattribute vec2 a_internal_normal;\n#endif\n\nuniform vec2 u_internal_scale;\nuniform vec2 u_internal_translation;\n\nvarying vec2 v_UV;\n#ifdef UV_ATTRIBUTE\nattribute vec2 v_UV_local;\n#endif\n#ifdef NORMAL_ATTRIBUTE\nattribute vec2 v_normal;\n#endif\n\nvoid main() {\n\t// Optional varyings.\n\t#ifdef UV_ATTRIBUTE\n\tv_UV_local = a_internal_uv;\n\t#endif\n\t#ifdef NORMAL_ATTRIBUTE\n\tv_normal = a_internal_normal;\n\t#endif\n\n\t// Apply transformations.\n\tvec2 position = u_internal_scale * a_internal_position + u_internal_translation;\n\n\t// Calculate a global uv for the viewport.\n\tv_UV = 0.5 * (position + 1.0);\n\n\t// Calculate vertex position.\n\tgl_Position = vec4(position, 0, 1);\n}"

/***/ }),

/***/ "./src/glsl_1/SegmentVertexShader.glsl":
/*!*********************************************!*\
  !*** ./src/glsl_1/SegmentVertexShader.glsl ***!
  \*********************************************/
/***/ ((module) => {

module.exports = "// Vertex shader for fullscreen quad.\nprecision highp float;\n\nattribute vec2 a_internal_position;\n\nuniform float u_internal_halfThickness;\nuniform vec2 u_internal_scale;\nuniform float u_internal_length;\nuniform float u_internal_rotation;\nuniform vec2 u_internal_translation;\n\nvarying vec2 v_UV_local;\nvarying vec2 v_UV;\n\nmat2 rotate2d(float _angle){\n\treturn mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));\n}\n\nvoid main() {\n\t// Calculate UV coordinates of current rendered object.\n\tv_UV_local = 0.5 * (a_internal_position + 1.0);\n\n\tvec2 position = a_internal_position;\n\n\t// Apply thickness / radius.\n\tposition *= u_internal_halfThickness;\n\n\t// Stretch center of shape to form a round-capped line segment.\n\tif (position.x < 0.0) {\n\t\tposition.x -= u_internal_length / 2.0;\n\t\tv_UV_local.x = 0.0; // Set entire cap UV.x to 0.\n\t} else if (position.x > 0.0) {\n\t\tposition.x += u_internal_length / 2.0;\n\t\tv_UV_local.x = 1.0; // Set entire cap UV.x to 1.\n\t}\n\n\t// Apply transformations.\n\tposition = u_internal_scale * (rotate2d(-u_internal_rotation) * position) + u_internal_translation;\n\n\t// Calculate a global uv for the viewport.\n\tv_UV = 0.5 * (position + 1.0);\n\n\t// Calculate vertex position.\n\tgl_Position = vec4(position, 0, 1);\n}"

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9AcGV0YW1vcmlrZW4vZmxvYXQxNi9zcmMvRmxvYXQxNkFycmF5LmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9AcGV0YW1vcmlrZW4vZmxvYXQxNi9zcmMvYnVnLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9AcGV0YW1vcmlrZW4vZmxvYXQxNi9zcmMvZGF0YVZpZXcuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL0BwZXRhbW9yaWtlbi9mbG9hdDE2L3NyYy9oZnJvdW5kLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9AcGV0YW1vcmlrZW4vZmxvYXQxNi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL0BwZXRhbW9yaWtlbi9mbG9hdDE2L3NyYy9pcy5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvQHBldGFtb3Jpa2VuL2Zsb2F0MTYvc3JjL2xpYi5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvQHBldGFtb3Jpa2VuL2Zsb2F0MTYvc3JjL3ByaXZhdGUuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL0BwZXRhbW9yaWtlbi9mbG9hdDE2L3NyYy9zcGVjLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9jaGFuZ2VkcGkvZGlzdC9pbmRleC5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvZmlsZS1zYXZlci9kaXN0L0ZpbGVTYXZlci5taW4uanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fSGFzaC5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19MaXN0Q2FjaGUuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fTWFwLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX01hcENhY2hlLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX1N5bWJvbC5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19hc3NvY0luZGV4T2YuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fYmFzZUdldFRhZy5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19iYXNlSXNBcnJheUJ1ZmZlci5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19iYXNlSXNOYXRpdmUuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fYmFzZVVuYXJ5LmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2NvcmVKc0RhdGEuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fZnJlZUdsb2JhbC5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19nZXRNYXBEYXRhLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2dldE5hdGl2ZS5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19nZXRSYXdUYWcuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fZ2V0VmFsdWUuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9faGFzaENsZWFyLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2hhc2hEZWxldGUuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9faGFzaEdldC5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19oYXNoSGFzLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2hhc2hTZXQuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9faXNLZXlhYmxlLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2lzTWFza2VkLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2xpc3RDYWNoZUNsZWFyLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2xpc3RDYWNoZURlbGV0ZS5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19saXN0Q2FjaGVHZXQuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fbGlzdENhY2hlSGFzLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2xpc3RDYWNoZVNldC5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19tYXBDYWNoZUNsZWFyLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX21hcENhY2hlRGVsZXRlLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX21hcENhY2hlR2V0LmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX21hcENhY2hlSGFzLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX21hcENhY2hlU2V0LmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX25hdGl2ZUNyZWF0ZS5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19ub2RlVXRpbC5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19vYmplY3RUb1N0cmluZy5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19yb290LmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX3RvU291cmNlLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvZXEuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9pc0FycmF5QnVmZmVyLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvaXNGdW5jdGlvbi5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL2lzT2JqZWN0LmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvaXNPYmplY3RMaWtlLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvbWVtb2l6ZS5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9zcmMvQ2hlY2tzLnRzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL3NyYy9Db25zdGFudHMudHMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vc3JjL0RhdGFMYXllci50cyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9zcmMvR1BVUHJvZ3JhbS50cyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9zcmMvV2ViR0xDb21wdXRlLnRzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL3NyYy9leHRlbnNpb25zLnRzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9zcmMvdXRpbHMudHMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vc3JjL3V0aWxzL1ZlY3RvcjQudHMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vc3JjL2dsc2xfMS9Db3B5RnJhZ1NoYWRlci5nbHNsIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL3NyYy9nbHNsXzEvRGF0YUxheWVyTGluZXNWZXJ0ZXhTaGFkZXIuZ2xzbCIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9zcmMvZ2xzbF8xL0RhdGFMYXllclBvaW50c1ZlcnRleFNoYWRlci5nbHNsIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL3NyYy9nbHNsXzEvRGF0YUxheWVyVmVjdG9yRmllbGRWZXJ0ZXhTaGFkZXIuZ2xzbCIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9zcmMvZ2xzbF8xL0RlZmF1bHRWZXJ0ZXhTaGFkZXIuZ2xzbCIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9zcmMvZ2xzbF8xL1NlZ21lbnRWZXJ0ZXhTaGFkZXIuZ2xzbCIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9zcmMvZ2xzbF8xL1NpbmdsZUNvbG9yRnJhZ1NoYWRlci5nbHNsIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL3NyYy9nbHNsXzEvU2luZ2xlQ29sb3JXaXRoV3JhcENoZWNrRnJhZ1NoYWRlci5nbHNsIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL3NyYy9nbHNsXzMvQ29weUZsb2F0RnJhZ1NoYWRlci5nbHNsIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL3NyYy9nbHNsXzMvQ29weUludEZyYWdTaGFkZXIuZ2xzbCIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9zcmMvZ2xzbF8zL0NvcHlVaW50RnJhZ1NoYWRlci5nbHNsIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL3NyYy9nbHNsXzMvU2luZ2xlQ29sb3JGcmFnU2hhZGVyLmdsc2wiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vc3JjL2dsc2xfMy9TaW5nbGVDb2xvcldpdGhXcmFwQ2hlY2tGcmFnU2hhZGVyLmdsc2wiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlL3dlYnBhY2svcnVudGltZS9nbG9iYWwiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlL3dlYnBhY2svcnVudGltZS9oYXJtb255IG1vZHVsZSBkZWNvcmF0b3IiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlL3dlYnBhY2svc3RhcnR1cCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDVndDO0FBQ29CO0FBQ0o7QUFDSTtBQUNYO0FBQ1U7O0FBRTNELFVBQVUsOERBQW9COztBQUU5QjtBQUNBLFdBQVcsUUFBUTtBQUNuQixhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxXQUFXLFFBQVE7QUFDbkIsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxXQUFXLGFBQWE7QUFDeEIsWUFBWTtBQUNaO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGtCQUFrQixZQUFZO0FBQzlCLG1CQUFtQixxREFBZTtBQUNsQzs7QUFFQTtBQUNBOztBQUVBLFdBQVcsdUJBQXVCO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7QUFDTDs7QUFFQSxXQUFXLDJCQUEyQjtBQUN0QztBQUNBO0FBQ0E7QUFDQSxhQUFhLHFFQUFtQztBQUNoRDtBQUNBO0FBQ0E7O0FBRUEsWUFBWSxzREFBaUI7QUFDN0IsOENBQThDLHFEQUFlO0FBQzdELFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBLGFBQWEscUVBQW1DO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQSxZQUFZLHNEQUFpQjtBQUM3Qiw0Q0FBNEMsd0RBQWtCO0FBQzlELFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBLEtBQUsscUVBQW1DO0FBQ3hDLDJDQUEyQyxrREFBa0Q7QUFDN0Ysc0RBQXNELDZEQUE2RDs7QUFFbkg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxxQ0FBcUMseUVBQXlFOztBQUU5Ryx5Q0FBeUMsc0NBQXNDO0FBQy9FLDhDQUE4QywyQ0FBMkM7O0FBRXpGLDBEQUEwRCx1REFBdUQ7QUFDakgsb0NBQW9DLGlDQUFpQztBQUNyRTs7QUFFZTs7QUFFZjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFNBQVMsMERBQTBELDRDQUFhO0FBQ2hGO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSwwQkFBMEIsWUFBWTtBQUN0QztBQUNBLDBCQUEwQix3REFBa0I7QUFDNUM7O0FBRUE7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxZQUFZLHFFQUFtQztBQUMvQztBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwwREFBMEQsb0RBQWtCO0FBQzVFOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxtQkFBbUIsd0RBQWtCO0FBQ3JDLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLHFEQUFlO0FBQ2pDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxrQkFBa0IscURBQWU7QUFDakM7QUFDQTs7QUFFQSxlQUFlLHlDQUF5QztBQUN4RDtBQUNBO0FBQ0Esc0JBQXNCLHFEQUFlO0FBQ3JDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSx1Q0FBdUMsT0FBTztBQUM5Qyx3QkFBd0IscURBQWU7QUFDdkM7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLHVDQUF1QyxPQUFPO0FBQzlDLHdCQUF3QixxREFBZTtBQUN2QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxrQkFBa0IscURBQWU7QUFDakM7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBLDJDQUEyQyxPQUFPO0FBQ2xELGdDQUFnQyxxREFBZTtBQUMvQzs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLGtCQUFrQixxREFBZTtBQUNqQztBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUEsMEJBQTBCLEtBQUs7QUFDL0IsZ0NBQWdDLHFEQUFlO0FBQy9DOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQSx1Q0FBdUMsT0FBTztBQUM5QyxtQ0FBbUMscURBQWU7QUFDbEQ7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBLHVDQUF1QyxPQUFPO0FBQzlDLDBCQUEwQixxREFBZTtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUEsdUNBQXVDLE9BQU87QUFDOUMsMEJBQTBCLHFEQUFlO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQSx1Q0FBdUMsT0FBTztBQUM5Qyx3Q0FBd0MscURBQWU7QUFDdkQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQSx1Q0FBdUMsT0FBTztBQUM5Qyx1Q0FBdUMscURBQWU7QUFDdEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0EsZ0RBQWdELE9BQU87QUFDdkQsaUNBQWlDLHdEQUFrQjtBQUNuRDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsbUJBQW1CLHdEQUFrQjs7QUFFckM7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLDhCQUE4Qix5REFBc0I7QUFDcEQ7O0FBRUEsaUNBQWlDLDBEQUFPLENBQUMsaURBQWU7O0FBRXhELDhCQUE4QixrRUFBa0UsRUFBRTs7QUFFbEc7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxtQkFBbUIsZ0RBQVM7O0FBRTVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxxQ0FBcUMsT0FBTztBQUM1QyxnQkFBZ0IscURBQWU7QUFDL0I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQSxtQkFBbUIsZ0RBQVM7O0FBRTVCOztBQUVBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQSx5QkFBeUIsS0FBSztBQUM5QixnQkFBZ0IscURBQWU7QUFDL0I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQSxtQkFBbUIsZ0RBQVM7O0FBRTVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHFDQUFxQyxPQUFPO0FBQzVDLDBCQUEwQixxREFBZTs7QUFFekM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUN4bEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ087Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNKMkI7QUFDMEI7O0FBRTVEO0FBQ0E7QUFDQSxXQUFXLFNBQVM7QUFDcEIsV0FBVyxPQUFPO0FBQ2xCLFdBQVcsVUFBVTtBQUNyQixhQUFhO0FBQ2I7QUFDTztBQUNQLFNBQVMsK0NBQVU7QUFDbkI7QUFDQTs7QUFFQSxXQUFXLHFEQUFlO0FBQzFCOztBQUVBO0FBQ0E7QUFDQSxXQUFXLFNBQVM7QUFDcEIsV0FBVyxPQUFPO0FBQ2xCLFdBQVcsT0FBTztBQUNsQixXQUFXLFVBQVU7QUFDckI7QUFDTztBQUNQLFNBQVMsK0NBQVU7QUFDbkI7QUFDQTs7QUFFQSxtQ0FBbUMsd0RBQWtCO0FBQ3JEOzs7Ozs7Ozs7Ozs7Ozs7OztBQy9CNEQ7O0FBRTVEO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsYUFBYTtBQUNiO0FBQ2U7QUFDZjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxnQkFBZ0Isd0RBQWtCO0FBQ2xDLFdBQVcscURBQWU7QUFDMUI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNqQitDO0FBQ1U7QUFDRjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNGcEI7O0FBRWdDOztBQUVuRTtBQUNBLFdBQVcsUUFBUTtBQUNuQixhQUFhO0FBQ2I7QUFDTztBQUNQO0FBQ0E7O0FBRUE7QUFDQSxXQUFXLFFBQVE7QUFDbkIsYUFBYTtBQUNiO0FBQ087QUFDUCw4Q0FBOEMsZ0RBQVM7QUFDdkQ7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbEJBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQSxjQUFjLFNBQVM7QUFDdkI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLGFBQWEsT0FBTztBQUNwQjtBQUNPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWMsVUFBVTtBQUN4QixvQkFBb0I7QUFDcEIsY0FBYzs7QUFFZDtBQUNBO0FBQ0Esd0JBQXdCO0FBQ3hCO0FBQ0E7O0FBRUEscUJBQXFCO0FBQ3JCLG9CQUFvQjs7QUFFcEI7QUFDQTtBQUNBLGlCQUFpQixVQUFVO0FBQzNCO0FBQ0E7O0FBRUE7QUFDQSxjQUFjLFFBQVE7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFFBQVE7QUFDdkI7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYyxRQUFRO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsYUFBYSxPQUFPO0FBQ3BCO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQ3JIQTtBQUNBLGFBQWE7QUFDYjtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDZkE7QUFDQSxXQUFXLFFBQVE7QUFDbkIsYUFBYTtBQUNiO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxXQUFXLE9BQU87QUFDbEIsV0FBVyxPQUFPO0FBQ2xCLGFBQWE7QUFDYjtBQUNPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNyRGE7O0FBRWIsOENBQTZDO0FBQzdDO0FBQ0EsQ0FBQyxFQUFDO0FBQ0YscUJBQXFCO0FBQ3JCLHdCQUF3Qjs7QUFFeEIsa0NBQWtDLDBCQUEwQiwwQ0FBMEMsZ0JBQWdCLE9BQU8sa0JBQWtCLEVBQUUsYUFBYSxFQUFFLE9BQU8sd0JBQXdCLEVBQUU7O0FBRWpNO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixTQUFTO0FBQzFCO0FBQ0EsbUJBQW1CLE9BQU87QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixnQkFBZ0I7QUFDakM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhDQUE4QyxrQkFBa0I7QUFDaEU7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLHNCQUFzQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixRQUFRO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHNCQUFzQjtBQUN0Qiw2QkFBNkI7QUFDN0IsK0JBQStCO0FBQy9CLDZCQUE2QjtBQUM3QiwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUIsOEJBQThCO0FBQzlCLDZCQUE2QjtBQUM3Qiw4QkFBOEI7QUFDOUIsZ0NBQWdDO0FBQ2hDLGdDQUFnQztBQUNoQyxpQ0FBaUM7QUFDakMsaUNBQWlDO0FBQ2pDLHNCQUFzQjs7QUFFdEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQzs7Ozs7Ozs7OztBQ2hNQSwrR0FBZSxHQUFHLElBQXFDLENBQUMsaUNBQU8sRUFBRSxvQ0FBQyxDQUFDO0FBQUE7QUFBQTtBQUFBLGtHQUFDLENBQUMsS0FBSyxFQUE2RSxDQUFDLGtCQUFrQixhQUFhLGdCQUFnQiwrQkFBK0IsV0FBVyw0RkFBNEYsV0FBVyxrRUFBa0UsNERBQTRELFlBQVksSUFBSSxrQkFBa0IseUJBQXlCLDBEQUEwRCxrQkFBa0Isc0JBQXNCLHlDQUF5QyxVQUFVLGNBQWMseUJBQXlCLG9CQUFvQixJQUFJLFNBQVMsVUFBVSxvQ0FBb0MsY0FBYyxJQUFJLHlDQUF5QyxTQUFTLDBDQUEwQywwRkFBMEYsMkhBQTJILHFCQUFNLEVBQUUscUJBQU0sVUFBVSxxQkFBTSxDQUFDLHFCQUFNLHdNQUF3TSw4REFBOEQsdURBQXVELGlOQUFpTiwwQkFBMEIsNEJBQTRCLEtBQUssS0FBSyxnREFBZ0QsbUZBQW1GLHNCQUFzQixLQUFLLGtDQUFrQyxpREFBaUQsS0FBSyxHQUFHLG1CQUFtQiw4SEFBOEgsb0lBQW9JLGlEQUFpRCxxQkFBcUIsdUJBQXVCLGVBQWUsMEJBQTBCLEdBQUcsd0JBQXdCLHlDQUF5QyxvQkFBb0IsS0FBSyxnREFBZ0QsNERBQTRELHFCQUFxQixPQUFPLEVBQUUsb0JBQW9CLEtBQTBCLHFCQUFxQjs7QUFFaHBGLHlDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0Z3QztBQUNFO0FBQ047QUFDQTtBQUNBOztBQUVwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxNQUFNO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHVCQUF1QixrREFBUztBQUNoQywyQkFBMkIsbURBQVU7QUFDckMscUJBQXFCLGdEQUFPO0FBQzVCLHFCQUFxQixnREFBTztBQUM1QixxQkFBcUIsZ0RBQU87O0FBRTVCLGlFQUFlLElBQUksRUFBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDL0I4QjtBQUNFO0FBQ047QUFDQTtBQUNBOztBQUU5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxNQUFNO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDRCQUE0Qix1REFBYztBQUMxQyxnQ0FBZ0Msd0RBQWU7QUFDL0MsMEJBQTBCLHFEQUFZO0FBQ3RDLDBCQUEwQixxREFBWTtBQUN0QywwQkFBMEIscURBQVk7O0FBRXRDLGlFQUFlLFNBQVMsRUFBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDL0JlO0FBQ1Y7O0FBRTlCO0FBQ0EsVUFBVSxzREFBUyxDQUFDLDZDQUFJOztBQUV4QixpRUFBZSxHQUFHLEVBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ042QjtBQUNFO0FBQ047QUFDQTtBQUNBOztBQUU1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxNQUFNO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDJCQUEyQixzREFBYTtBQUN4QywrQkFBK0IsdURBQWM7QUFDN0MseUJBQXlCLG9EQUFXO0FBQ3BDLHlCQUF5QixvREFBVztBQUNwQyx5QkFBeUIsb0RBQVc7O0FBRXBDLGlFQUFlLFFBQVEsRUFBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMvQk07O0FBRTlCO0FBQ0EsYUFBYSxvREFBVzs7QUFFeEIsaUVBQWUsTUFBTSxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7OztBQ0xHOztBQUV6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsTUFBTTtBQUNqQixXQUFXLEVBQUU7QUFDYixhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRLCtDQUFFO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpRUFBZSxZQUFZLEVBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNwQk07QUFDTTtBQUNVOztBQUVsRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxxQkFBcUIsK0NBQU0sR0FBRywyREFBa0I7O0FBRWhEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxFQUFFO0FBQ2IsYUFBYSxPQUFPO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sc0RBQVM7QUFDZixNQUFNLDJEQUFjO0FBQ3BCOztBQUVBLGlFQUFlLFVBQVUsRUFBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDM0JnQjtBQUNHOztBQUU3Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsRUFBRTtBQUNiLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0EsU0FBUyx5REFBWSxXQUFXLHVEQUFVO0FBQzFDOztBQUVBLGlFQUFlLGlCQUFpQixFQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2hCUTtBQUNIO0FBQ0Q7QUFDQzs7QUFFdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0M7O0FBRXBDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxFQUFFO0FBQ2IsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBLE9BQU8scURBQVEsV0FBVyxxREFBUTtBQUNsQztBQUNBO0FBQ0EsZ0JBQWdCLHVEQUFVO0FBQzFCLHNCQUFzQixxREFBUTtBQUM5Qjs7QUFFQSxpRUFBZSxZQUFZLEVBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUM5QzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxTQUFTO0FBQ3BCLGFBQWEsU0FBUztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUVBQWUsU0FBUyxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7OztBQ2JLOztBQUU5QjtBQUNBLGlCQUFpQixtRUFBMEI7O0FBRTNDLGlFQUFlLFVBQVUsRUFBQzs7Ozs7Ozs7Ozs7Ozs7OztBQ0wxQjtBQUNBLHdCQUF3QixxQkFBTSxnQkFBZ0IscUJBQU0sSUFBSSxxQkFBTSxzQkFBc0IscUJBQU07O0FBRTFGLGlFQUFlLFVBQVUsRUFBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNIYzs7QUFFeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsV0FBVyxPQUFPO0FBQ2xCLGFBQWEsRUFBRTtBQUNmO0FBQ0E7QUFDQTtBQUNBLFNBQVMsc0RBQVM7QUFDbEI7QUFDQTtBQUNBOztBQUVBLGlFQUFlLFVBQVUsRUFBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDakJvQjtBQUNSOztBQUV0QztBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixXQUFXLE9BQU87QUFDbEIsYUFBYSxFQUFFO0FBQ2Y7QUFDQTtBQUNBLGNBQWMscURBQVE7QUFDdEIsU0FBUyx5REFBWTtBQUNyQjs7QUFFQSxpRUFBZSxTQUFTLEVBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDaEJTOztBQUVsQztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EscUJBQXFCLCtDQUFNLEdBQUcsMkRBQWtCOztBQUVoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsRUFBRTtBQUNiLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUVBQWUsU0FBUyxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDN0N6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixXQUFXLE9BQU87QUFDbEIsYUFBYSxFQUFFO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUVBQWUsUUFBUSxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7OztBQ1pzQjs7QUFFOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixxREFBWSxHQUFHLHlEQUFZO0FBQzdDO0FBQ0E7O0FBRUEsaUVBQWUsU0FBUyxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDZHpCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixXQUFXLE9BQU87QUFDbEIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpRUFBZSxVQUFVLEVBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDaEJvQjs7QUFFOUM7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLGFBQWEsRUFBRTtBQUNmO0FBQ0E7QUFDQTtBQUNBLE1BQU0scURBQVk7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpRUFBZSxPQUFPLEVBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDN0J1Qjs7QUFFOUM7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0EsU0FBUyxxREFBWTtBQUNyQjs7QUFFQSxpRUFBZSxPQUFPLEVBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdEJ1Qjs7QUFFOUM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsV0FBVyxFQUFFO0FBQ2IsYUFBYSxPQUFPO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxxREFBWTtBQUMzQjtBQUNBOztBQUVBLGlFQUFlLE9BQU8sRUFBQzs7Ozs7Ozs7Ozs7Ozs7OztBQ3RCdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEVBQUU7QUFDYixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUVBQWUsU0FBUyxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7OztBQ2RpQjs7QUFFMUM7QUFDQTtBQUNBLDBCQUEwQixtREFBVSxJQUFJLHdEQUFlLElBQUksaUVBQXdCO0FBQ25GO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsU0FBUztBQUNwQixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUVBQWUsUUFBUSxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDbkJ4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlFQUFlLGNBQWMsRUFBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNaZ0I7O0FBRTlDO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBLGNBQWMseURBQVk7O0FBRTFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlFQUFlLGVBQWUsRUFBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsQ2U7O0FBRTlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixhQUFhLEVBQUU7QUFDZjtBQUNBO0FBQ0E7QUFDQSxjQUFjLHlEQUFZOztBQUUxQjtBQUNBOztBQUVBLGlFQUFlLFlBQVksRUFBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsQmtCOztBQUU5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQSxTQUFTLHlEQUFZO0FBQ3JCOztBQUVBLGlFQUFlLFlBQVksRUFBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNma0I7O0FBRTlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixXQUFXLEVBQUU7QUFDYixhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0EsY0FBYyx5REFBWTs7QUFFMUI7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlFQUFlLFlBQVksRUFBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3pCRTtBQUNVO0FBQ1o7O0FBRTVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLDZDQUFJO0FBQ3BCLGdCQUFnQiw0Q0FBRyxJQUFJLGtEQUFTO0FBQ2hDLGtCQUFrQiw2Q0FBSTtBQUN0QjtBQUNBOztBQUVBLGlFQUFlLGFBQWEsRUFBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNwQmE7O0FBRTFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBLGVBQWUsdURBQVU7QUFDekI7QUFDQTtBQUNBOztBQUVBLGlFQUFlLGNBQWMsRUFBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNqQlk7O0FBRTFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixhQUFhLEVBQUU7QUFDZjtBQUNBO0FBQ0EsU0FBUyx1REFBVTtBQUNuQjs7QUFFQSxpRUFBZSxXQUFXLEVBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDZmU7O0FBRTFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBLFNBQVMsdURBQVU7QUFDbkI7O0FBRUEsaUVBQWUsV0FBVyxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7OztBQ2ZlOztBQUUxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsV0FBVyxFQUFFO0FBQ2IsYUFBYSxPQUFPO0FBQ3BCO0FBQ0E7QUFDQSxhQUFhLHVEQUFVO0FBQ3ZCOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlFQUFlLFdBQVcsRUFBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNyQmE7O0FBRXhDO0FBQ0EsbUJBQW1CLHNEQUFTOztBQUU1QixpRUFBZSxZQUFZLEVBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0xjOztBQUUxQztBQUNBOztBQUVBO0FBQ0EsZ0NBQWdDLFFBQWE7O0FBRTdDO0FBQ0E7O0FBRUE7QUFDQSxtQ0FBbUMsMkRBQWtCOztBQUVyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNILENBQUM7O0FBRUQsaUVBQWUsUUFBUSxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDN0J4QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsRUFBRTtBQUNiLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpRUFBZSxjQUFjLEVBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDckJZOztBQUUxQztBQUNBOztBQUVBO0FBQ0EsV0FBVyxtREFBVTs7QUFFckIsaUVBQWUsSUFBSSxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDUnBCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsU0FBUztBQUNwQixhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQSxpRUFBZSxRQUFRLEVBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUN6QnhCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsRUFBRTtBQUNiLFdBQVcsRUFBRTtBQUNiLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpRUFBZSxFQUFFLEVBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNwQ3NDO0FBQ2hCO0FBQ0Y7O0FBRXRDO0FBQ0Esd0JBQXdCLGlEQUFRLElBQUksK0RBQXNCOztBQUUxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsRUFBRTtBQUNiLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDLHNEQUFTLHNCQUFzQiwwREFBaUI7O0FBRXhGLGlFQUFlLGFBQWEsRUFBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDMUJhO0FBQ0w7O0FBRXJDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEVBQUU7QUFDYixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTyxxREFBUTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSx1REFBVTtBQUN0QjtBQUNBOztBQUVBLGlFQUFlLFVBQVUsRUFBQzs7Ozs7Ozs7Ozs7Ozs7OztBQ3BDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxFQUFFO0FBQ2IsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlFQUFlLFFBQVEsRUFBQzs7Ozs7Ozs7Ozs7Ozs7OztBQzlCeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsRUFBRTtBQUNiLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUVBQWUsWUFBWSxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7OztBQzVCVTs7QUFFdEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxTQUFTO0FBQ3BCLFdBQVcsU0FBUztBQUNwQixhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQixnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUMsaURBQVE7QUFDakQ7QUFDQTs7QUFFQTtBQUNBLGdCQUFnQixpREFBUTs7QUFFeEIsaUVBQWUsT0FBTyxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUN4RXZCLCtFQUlxQjtBQUVSLHNCQUFjLEdBQUcsQ0FBQyxzQkFBVSxFQUFFLGlCQUFLLEVBQUUseUJBQWEsRUFBRSxnQkFBSSxFQUFFLDBCQUFjLEVBQUUsaUJBQUssRUFBRSx3QkFBWSxFQUFFLGVBQUcsQ0FBQyxDQUFDO0FBQ2pILFNBQWdCLGVBQWUsQ0FBQyxJQUFZO0lBQzNDLE9BQU8sc0JBQWMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDMUMsQ0FBQztBQUZELDBDQUVDO0FBRVksd0JBQWdCLEdBQUcsQ0FBQyxrQkFBTSxFQUFFLG1CQUFPLENBQUMsQ0FBQztBQUNsRCxTQUFnQixpQkFBaUIsQ0FBQyxJQUFZO0lBQzdDLE9BQU8sd0JBQWdCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzVDLENBQUM7QUFGRCw4Q0FFQztBQUVZLHNCQUFjLEdBQUcsQ0FBQyx5QkFBYSxFQUFFLGtCQUFNLENBQUMsQ0FBQyxDQUFDLGtCQUFrQjtBQUN6RSxTQUFnQixlQUFlLENBQUMsSUFBWTtJQUMzQyxPQUFPLHNCQUFjLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzFDLENBQUM7QUFGRCwwQ0FFQztBQUVZLCtCQUF1QixHQUFHLENBQUMsZUFBRyxFQUFFLGdCQUFJLENBQUMsQ0FBQztBQUNuRCxTQUFnQix3QkFBd0IsQ0FBQyxJQUFZO0lBQ3BELE9BQU8sK0JBQXVCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ25ELENBQUM7QUFGRCw0REFFQztBQUVZLDZCQUFxQixHQUFHLENBQUMseUJBQWEsQ0FBQyxDQUFDO0FBQ3JELFNBQWdCLHNCQUFzQixDQUFDLElBQVk7SUFDbEQsT0FBTyw2QkFBcUIsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDakQsQ0FBQztBQUZELHdEQUVDO0FBRUQsU0FBZ0IsUUFBUSxDQUFDLEtBQVU7SUFDbEMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN0QixDQUFDO0FBRkQsNEJBRUM7QUFFRCxTQUFnQixTQUFTLENBQUMsS0FBVTtJQUNuQyxPQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDN0MsQ0FBQztBQUZELDhCQUVDO0FBRUQsU0FBZ0IsaUJBQWlCLENBQUMsS0FBVTtJQUMzQyxPQUFPLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZDLENBQUM7QUFGRCw4Q0FFQztBQUVELFNBQWdCLFFBQVEsQ0FBQyxLQUFVO0lBQ2xDLE9BQU8sT0FBTyxLQUFLLEtBQUssUUFBUSxDQUFDO0FBQ2xDLENBQUM7QUFGRCw0QkFFQztBQUVELFNBQWdCLE9BQU8sQ0FBQyxLQUFVO0lBQ2pDLE9BQU8sS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM3QixDQUFDO0FBRkQsMEJBRUM7Ozs7Ozs7Ozs7Ozs7OztBQ2pEWSxrQkFBVSxHQUFHLFlBQVksQ0FBQztBQUMxQixhQUFLLEdBQUcsT0FBTyxDQUFDO0FBQ2hCLHFCQUFhLEdBQUcsZUFBZSxDQUFDO0FBQ2hDLFlBQUksR0FBRyxNQUFNLENBQUM7QUFDZCxzQkFBYyxHQUFHLGdCQUFnQixDQUFDO0FBQ2xDLGFBQUssR0FBRyxPQUFPLENBQUM7QUFDaEIsb0JBQVksR0FBRyxjQUFjLENBQUM7QUFDOUIsV0FBRyxHQUFHLEtBQUssQ0FBQztBQUVaLGNBQU0sR0FBRyxRQUFRLENBQUM7QUFDbEIsZUFBTyxHQUFHLFNBQVMsQ0FBQztBQUVwQixjQUFNLEdBQUcsUUFBUSxDQUFDO0FBQ2xCLHFCQUFhLEdBQUcsZUFBZSxDQUFDO0FBQzdDLG9EQUFvRDtBQUV2QyxXQUFHLEdBQUcsS0FBSyxDQUFDO0FBQ1osWUFBSSxHQUFHLE1BQU0sQ0FBQztBQVdkLGFBQUssR0FBRyxRQUFRLENBQUM7QUFDakIsYUFBSyxHQUFHLEtBQUssQ0FBQztBQUczQixpQkFBaUI7QUFDSix3QkFBZ0IsR0FBRyxJQUFJLENBQUM7QUFDeEIsd0JBQWdCLEdBQUcsSUFBSSxDQUFDO0FBQ3hCLHdCQUFnQixHQUFHLElBQUksQ0FBQztBQUN4Qix3QkFBZ0IsR0FBRyxJQUFJLENBQUM7QUFDeEIsc0JBQWMsR0FBRyxJQUFJLENBQUM7QUFDdEIsc0JBQWMsR0FBRyxJQUFJLENBQUM7QUFDdEIsc0JBQWMsR0FBRyxJQUFJLENBQUM7QUFDdEIsc0JBQWMsR0FBRyxJQUFJLENBQUM7Ozs7Ozs7Ozs7Ozs7OztBQ3hDbkMsb0hBQWtEO0FBQ2xELHNFQUFvSjtBQUNwSiwrRUFJc0I7QUFDdEIsa0ZBT3NCO0FBQ3RCLG1FQUFtQztBQVNuQztJQXVDQyxtQkFDQyxNQWNDO1FBakRGLDRGQUE0RjtRQUNwRixpQkFBWSxHQUFHLENBQUMsQ0FBQztRQUVSLFlBQU8sR0FBc0IsRUFBRSxDQUFDO1FBZ0R4QyxNQUFFLEdBQThFLE1BQU0sR0FBcEYsRUFBRSxhQUFhLEdBQStELE1BQU0sY0FBckUsRUFBRSxJQUFJLEdBQXlELE1BQU0sS0FBL0QsRUFBRSxVQUFVLEdBQTZDLE1BQU0sV0FBbkQsRUFBRSxJQUFJLEdBQXVDLE1BQU0sS0FBN0MsRUFBRSxhQUFhLEdBQXdCLE1BQU0sY0FBOUIsRUFBRSxJQUFJLEdBQWtCLE1BQU0sS0FBeEIsRUFBRSxXQUFXLEdBQUssTUFBTSxZQUFYLENBQVk7UUFFL0YsZUFBZTtRQUNmLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ2IsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7UUFFbkMseUNBQXlDO1FBQ3pDLElBQUksQ0FBQywwQkFBaUIsQ0FBQyxhQUFhLENBQUMsSUFBSSxhQUFhLEdBQUcsQ0FBQyxFQUFFO1lBQzNELE1BQU0sSUFBSSxLQUFLLENBQUMsMkJBQXlCLGFBQWEseUJBQW1CLElBQUksUUFBSSxDQUFDLENBQUM7U0FDbkY7UUFDRCxJQUFJLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQztRQUVuQyw4QkFBOEI7UUFDOUIsSUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDbkMsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFFekIsbUNBQW1DO1FBQzdCLFNBQTRCLFNBQVMsQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxFQUE5RCxNQUFNLGNBQUUsS0FBSyxhQUFFLE1BQU0sWUFBeUMsQ0FBQztRQUN2RSxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsMEJBQWlCLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDOUIsTUFBTSxJQUFJLEtBQUssQ0FBQyxtQkFBaUIsS0FBSyx5QkFBbUIsSUFBSSxRQUFJLENBQUMsQ0FBQztTQUNuRTtRQUNELElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQywwQkFBaUIsQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUMvQixNQUFNLElBQUksS0FBSyxDQUFDLG9CQUFrQixNQUFNLHlCQUFtQixJQUFJLFFBQUksQ0FBQyxDQUFDO1NBQ3JFO1FBQ0QsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFFckIsaUZBQWlGO1FBQ2pGLG9EQUFvRDtRQUNwRCxJQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLG1CQUFPLENBQUMsQ0FBQyxDQUFDLGtCQUFNLENBQUMsQ0FBQztRQUN6RixJQUFJLENBQUMsMEJBQWlCLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDL0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxxQkFBbUIsTUFBTSx5QkFBbUIsSUFBSSxvQkFBYyx5QkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQUcsQ0FBQyxDQUFDO1NBQzlHO1FBQ0QsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFFckIsNENBQTRDO1FBQzVDLElBQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyx5QkFBYSxDQUFDO1FBQ3hFLElBQUksQ0FBQyx3QkFBZSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzVCLE1BQU0sSUFBSSxLQUFLLENBQUMsb0JBQWtCLEtBQUsseUJBQW1CLElBQUksb0JBQWMsdUJBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQUcsQ0FBQyxDQUFDO1NBQzFHO1FBQ0QsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLHlCQUFhLENBQUM7UUFDeEUsSUFBSSxDQUFDLHdCQUFlLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDNUIsTUFBTSxJQUFJLEtBQUssQ0FBQyxvQkFBa0IsS0FBSyx5QkFBbUIsSUFBSSxvQkFBYyx1QkFBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBRyxDQUFDLENBQUM7U0FDMUc7UUFDRCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUVuQixpQkFBaUI7UUFDakIsSUFBSSxDQUFDLHdCQUFlLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDM0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQkFBZ0IsSUFBSSx5QkFBbUIsSUFBSSwyQkFBcUIsdUJBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQUcsQ0FBQyxDQUFDO1NBQzlHO1FBQ0QsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBTSxZQUFZLEdBQUcsU0FBUyxDQUFDLGVBQWUsQ0FBQztZQUM5QyxFQUFFO1lBQ0YsSUFBSTtZQUNKLFdBQVc7WUFDWCxRQUFRO1lBQ1IsTUFBTTtZQUNOLElBQUk7WUFDSixhQUFhO1NBQ2IsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUM7UUFDakMsNkJBQTZCO1FBQ3ZCLFNBS0YsU0FBUyxDQUFDLHNCQUFzQixDQUFDO1lBQ3BDLEVBQUU7WUFDRixJQUFJO1lBQ0osYUFBYTtZQUNiLFFBQVE7WUFDUixZQUFZO1lBQ1osV0FBVztZQUNYLGFBQWE7U0FDYixDQUFDLEVBWkQsUUFBUSxnQkFDUixnQkFBZ0Isd0JBQ2hCLE1BQU0sY0FDTixhQUFhLG1CQVNaLENBQUM7UUFDSCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQUM7UUFDekMsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7UUFFbkMscUNBQXFDO1FBQ3JDLElBQUksQ0FBQyxjQUFjLEdBQUcsU0FBUyxDQUFDLGlCQUFpQixDQUFDLEVBQUUsRUFBRSxNQUFFLE1BQU0sVUFBRSxZQUFZLGdCQUFFLElBQUksUUFBRSxhQUFhLGlCQUFFLENBQUMsQ0FBQztRQUNyRyxJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDeEMsSUFBSSxDQUFDLGFBQWEsR0FBRyxTQUFTLENBQUMsZUFBZSxDQUFDLEVBQUUsRUFBRSxNQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxRQUFFLENBQUMsQ0FBQztRQUMxRSxJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLGFBQWEsR0FBRyxTQUFTLENBQUMsZUFBZSxDQUFDLEVBQUUsRUFBRSxNQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxRQUFFLENBQUMsQ0FBQztRQUMxRSxJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFdEMsOERBQThEO1FBQzlELElBQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxVQUFVLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0UsSUFBSSxDQUFDLDBCQUFpQixDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQ25DLE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXVCLFVBQVUseUJBQW1CLElBQUksa0NBQThCLENBQUMsQ0FBQztTQUN4RztRQUNELElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBRTdCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDeEIsQ0FBQztJQUVjLGtCQUFRLEdBQXZCLFVBQXdCLFVBQXFDLEVBQUUsSUFBWTtRQUMxRSxJQUFJLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDO1FBQzFCLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBb0IsQ0FBQyxFQUFFO1lBQ2pDLElBQUksQ0FBQywwQkFBaUIsQ0FBQyxVQUFVLENBQUMsRUFBRTtnQkFDbkMsTUFBTSxJQUFJLEtBQUssQ0FBQyxvQkFBa0IsVUFBVSx5QkFBbUIsSUFBSSxRQUFJLENBQUMsQ0FBQzthQUN6RTtZQUNELE1BQU0sR0FBRyxVQUFvQixDQUFDO1lBQzlCLGlEQUFpRDtZQUNqRCxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDWixJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUM7WUFDdkIsT0FBTyxTQUFTLEdBQUcsQ0FBQyxFQUFFO2dCQUNyQixHQUFHLEVBQUUsQ0FBQztnQkFDTixTQUFTLElBQUksQ0FBQyxDQUFDO2FBQ2Y7WUFDRCxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ25ELE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3hDO2FBQU07WUFDTixLQUFLLEdBQUksVUFBK0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1QyxJQUFJLENBQUMsMEJBQWlCLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQzlCLE1BQU0sSUFBSSxLQUFLLENBQUMsbUJBQWlCLEtBQUsseUJBQW1CLElBQUksUUFBSSxDQUFDLENBQUM7YUFDbkU7WUFDRCxNQUFNLEdBQUksVUFBK0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3QyxJQUFJLENBQUMsMEJBQWlCLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQy9CLE1BQU0sSUFBSSxLQUFLLENBQUMsb0JBQWtCLE1BQU0seUJBQW1CLElBQUksUUFBSSxDQUFDLENBQUM7YUFDckU7U0FDRDtRQUNELE9BQU8sRUFBRSxLQUFLLFNBQUUsTUFBTSxVQUFFLE1BQU0sVUFBRSxDQUFDO0lBQ2xDLENBQUM7SUFFYyx5QkFBZSxHQUE5QixVQUNDLE1BSUM7UUFFTyxNQUFFLEdBQWlCLE1BQU0sR0FBdkIsRUFBRSxJQUFJLEdBQVcsTUFBTSxLQUFqQixFQUFFLElBQUksR0FBSyxNQUFNLEtBQVgsQ0FBWTtRQUNsQyw2REFBNkQ7UUFDN0QsSUFBSSxnQkFBUSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQ2pCLE9BQU8sSUFBSSxDQUFDO1NBQ1o7UUFDRCxxQ0FBcUM7UUFDckMsSUFBSSxJQUFJLEtBQUsseUJBQWEsRUFBRTtZQUMzQixPQUFPLElBQUksQ0FBQztTQUNaO1FBQ0QsSUFBSSxDQUFDLGdCQUFRLENBQUMsRUFBRSxDQUFDLEVBQUU7WUFDbEIsdURBQXVEO1lBQ3ZELHFGQUFxRjtZQUNyRixxRkFBcUY7WUFDckYsMkVBQTJFO1lBQzNFLDJEQUEyRDtZQUMzRCx5RUFBeUU7WUFDekUsNEVBQTRFO1lBQzVFLGlGQUFpRjtZQUNqRixtRUFBbUU7WUFDbkUsT0FBTyxDQUFDLElBQUksQ0FBQyw0REFBeUQsSUFBSSxvQkFBZ0IsQ0FBQyxDQUFDO1lBQzVGLE9BQU8seUJBQWEsQ0FBQztTQUNyQjtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2IsQ0FBQztJQUVjLDJCQUFpQixHQUFoQyxVQUNDLE1BTUM7UUFFTyxNQUFFLEdBQXdDLE1BQU0sR0FBOUMsRUFBRSxhQUFhLEdBQXlCLE1BQU0sY0FBL0IsRUFBRSxZQUFZLEdBQVcsTUFBTSxhQUFqQixFQUFFLElBQUksR0FBSyxNQUFNLEtBQVgsQ0FBWTtRQUNuRCxVQUFNLEdBQUssTUFBTSxPQUFYLENBQVk7UUFDeEIsSUFBSSxNQUFNLEtBQUssbUJBQU8sRUFBRTtZQUN2Qix5Q0FBeUM7WUFDekMsT0FBTyxNQUFNLENBQUM7U0FDZDtRQUVELElBQUksWUFBWSxLQUFLLHNCQUFVLEVBQUU7WUFDaEMsNERBQTREO1lBQzVELElBQU0sU0FBUyxHQUFHLHlCQUFZLENBQUMsRUFBRSxFQUFFLDBDQUE2QixFQUFFLGFBQWEsRUFBRSxJQUFJLENBQUM7bUJBQ2xGLHlCQUFZLENBQUMsRUFBRSxFQUFFLHFDQUF3QixFQUFFLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNwRSxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUNmLE9BQU8sQ0FBQyxJQUFJLENBQUMsb0RBQWlELElBQUksUUFBSSxDQUFDLENBQUM7Z0JBQ3hFLG9FQUFvRTtnQkFDcEUsTUFBTSxHQUFHLG1CQUFPLENBQUM7YUFDakI7U0FDRDtRQUFDLElBQUksWUFBWSxLQUFLLGlCQUFLLEVBQUU7WUFDN0IsSUFBTSxTQUFTLEdBQUcseUJBQVksQ0FBQyxFQUFFLEVBQUUscUNBQXdCLEVBQUUsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2xGLElBQUksQ0FBQyxTQUFTLEVBQUU7Z0JBQ2YsT0FBTyxDQUFDLElBQUksQ0FBQyxvREFBaUQsSUFBSSxRQUFJLENBQUMsQ0FBQztnQkFDeEUsb0VBQW9FO2dCQUNwRSxNQUFNLEdBQUcsbUJBQU8sQ0FBQzthQUNqQjtTQUNEO1FBQ0QsT0FBTyxNQUFNLENBQUM7SUFDZixDQUFDO0lBRWMseUJBQWUsR0FBOUIsVUFDQyxNQVFDO1FBRU8sTUFBRSxHQUFpRCxNQUFNLEdBQXZELEVBQUUsYUFBYSxHQUFrQyxNQUFNLGNBQXhDLEVBQUUsUUFBUSxHQUF3QixNQUFNLFNBQTlCLEVBQUUsSUFBSSxHQUFrQixNQUFNLEtBQXhCLEVBQUUsV0FBVyxHQUFLLE1BQU0sWUFBWCxDQUFZO1FBQzFELFFBQUksR0FBSyxNQUFNLEtBQVgsQ0FBWTtRQUN4QixJQUFJLFlBQVksR0FBRyxJQUFJLENBQUM7UUFDeEIsb0NBQW9DO1FBQ3BDLElBQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQyx3QkFBd0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMzRCxJQUFJLE9BQU8sRUFBRTtZQUNaLElBQUksWUFBWSxLQUFLLHlCQUFhLElBQUksWUFBWSxLQUFLLGdCQUFJLEVBQUU7Z0JBQzVELHNHQUFzRztnQkFDdEcsWUFBWSxHQUFHLHNCQUFVLENBQUM7YUFDMUI7aUJBQU07Z0JBQ04scUlBQXFJO2dCQUNySSx5REFBeUQ7Z0JBQ3pELGtFQUFrRTtnQkFDbEUsSUFBSSxZQUFZLEtBQUssZUFBRyxJQUFJLFlBQVksS0FBSyx3QkFBWSxFQUFFO2lCQUUxRDtnQkFDRCxPQUFPLENBQUMsSUFBSSxDQUFDLGtCQUFnQixZQUFZLGdFQUEwRCxJQUFJLGdNQUM0RSxDQUFDLENBQUM7Z0JBQ3JMLFlBQVksR0FBRyxpQkFBSyxDQUFDO2FBQ3JCO1NBQ0Q7UUFDRCw4QkFBOEI7UUFDOUIsSUFBSSxDQUFDLGdCQUFRLENBQUMsRUFBRSxDQUFDLEVBQUU7WUFDbEIsSUFBSSxZQUFZLEtBQUssaUJBQUssRUFBRTtnQkFDM0IsSUFBTSxTQUFTLEdBQUcseUJBQVksQ0FBQyxFQUFFLEVBQUUsOEJBQWlCLEVBQUUsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUMzRSxJQUFJLENBQUMsU0FBUyxFQUFFO29CQUNmLE9BQU8sQ0FBQyxJQUFJLENBQUMsMEVBQXVFLElBQUksUUFBSSxDQUFDLENBQUM7b0JBQzlGLFlBQVksR0FBRyxzQkFBVSxDQUFDO2lCQUMxQjtnQkFDRCx1RkFBdUY7Z0JBQ3ZGLDhEQUE4RDtnQkFDOUQsd0RBQXdEO2dCQUN4RCxvREFBb0Q7Z0JBQ3BELDREQUE0RDtnQkFDNUQscUNBQXFDO2dCQUNyQyxJQUFJLFFBQVEsRUFBRTtvQkFDYixJQUFNLEtBQUssR0FBRyxTQUFTLENBQUMsb0JBQW9CLENBQUMsRUFBRSxFQUFFLE1BQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxXQUFXLGVBQUUsQ0FBQyxDQUFDO29CQUN0RixJQUFJLENBQUMsS0FBSyxJQUFJLFlBQVksS0FBSyxzQkFBVSxFQUFFO3dCQUMxQyxPQUFPLENBQUMsSUFBSSxDQUFDLGlHQUE4RixJQUFJLFFBQUksQ0FBQyxDQUFDO3dCQUNySCxZQUFZLEdBQUcsc0JBQVUsQ0FBQztxQkFDMUI7aUJBQ0Q7YUFDRDtZQUNELDBEQUEwRDtZQUMxRCxJQUFJLFlBQVksS0FBSyxzQkFBVSxFQUFFO2dCQUNoQyx5QkFBWSxDQUFDLEVBQUUsRUFBRSxtQ0FBc0IsRUFBRSxhQUFhLENBQUMsQ0FBQztnQkFDeEQsbUhBQW1IO2dCQUNuSCxJQUFJLFFBQVEsRUFBRTtvQkFDYixJQUFNLEtBQUssR0FBRyxTQUFTLENBQUMsb0JBQW9CLENBQUMsRUFBRSxFQUFFLE1BQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxXQUFXLGVBQUUsQ0FBQyxDQUFDO29CQUN0RixJQUFJLENBQUMsS0FBSyxFQUFFO3dCQUNYLGFBQWEsQ0FBQyxpRUFBaUUsQ0FBQyxDQUFDO3FCQUNqRjtpQkFDRDthQUNEO1NBQ0Q7UUFFRCx3Q0FBd0M7UUFDeEMsSUFBSSxRQUFRLElBQUksZ0JBQVEsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFlBQVksS0FBSyxzQkFBVSxJQUFJLFlBQVksS0FBSyxpQkFBSyxDQUFDLEVBQUU7WUFDeEYseUJBQVksQ0FBQyxFQUFFLEVBQUUsbUNBQXNCLEVBQUUsYUFBYSxDQUFDLENBQUM7U0FDeEQ7UUFDRCxPQUFPLFlBQVksQ0FBQztJQUNyQixDQUFDO0lBRWMsa0NBQXdCLEdBQXZDLFVBQ0MsTUFLQztRQUVPLE1BQUUsR0FBZ0MsTUFBTSxHQUF0QyxFQUFFLElBQUksR0FBMEIsTUFBTSxLQUFoQyxFQUFFLE1BQU0sR0FBa0IsTUFBTSxPQUF4QixFQUFFLFdBQVcsR0FBSyxNQUFNLFlBQVgsQ0FBWTtRQUNqRCxJQUFJLFdBQVcsS0FBSyxpQkFBSyxJQUFJLGdCQUFRLENBQUMsRUFBRSxDQUFDO1lBQUUsT0FBTyxLQUFLLENBQUM7UUFDeEQsc0VBQXNFO1FBQ3RFLElBQUksSUFBSSxLQUFLLHlCQUFhLElBQUksTUFBTSxLQUFLLGtCQUFNLEVBQUU7WUFDaEQsT0FBTyxJQUFJLENBQUM7U0FDWjtRQUNELG9GQUFvRjtRQUNwRixvSEFBb0g7UUFDcEgsZ0NBQWdDO1FBQ2hDLE9BQU8sSUFBSSxLQUFLLGdCQUFJLElBQUksSUFBSSxLQUFLLGlCQUFLLElBQUksSUFBSSxLQUFLLGVBQUcsSUFBSSxJQUFJLEtBQUssMEJBQWMsSUFBSSxJQUFJLEtBQUssd0JBQVksQ0FBQztJQUM1RyxDQUFDO0lBRWMsZ0NBQXNCLEdBQXJDLFVBQ0MsTUFRQztRQUVPLE1BQUUsR0FBOEUsTUFBTSxHQUFwRixFQUFFLGFBQWEsR0FBK0QsTUFBTSxjQUFyRSxFQUFFLElBQUksR0FBeUQsTUFBTSxLQUEvRCxFQUFFLGFBQWEsR0FBMEMsTUFBTSxjQUFoRCxFQUFFLFlBQVksR0FBNEIsTUFBTSxhQUFsQyxFQUFFLFFBQVEsR0FBa0IsTUFBTSxTQUF4QixFQUFFLFdBQVcsR0FBSyxNQUFNLFlBQVgsQ0FBWTtRQUMvRix5R0FBeUc7UUFDekcsSUFBSSxNQUEwQixFQUM3QixRQUE0QixFQUM1QixnQkFBb0MsRUFDcEMsYUFBaUMsQ0FBQztRQUVuQyxJQUFJLGdCQUFRLENBQUMsRUFBRSxDQUFDLEVBQUU7WUFDakIsYUFBYSxHQUFHLGFBQWEsQ0FBQztZQUM5Qiw0RUFBNEU7WUFDNUUsb0ZBQW9GO1lBQ3BGLDZFQUE2RTtZQUM3RSxrRUFBa0U7WUFDbEUsc0VBQXNFO1lBQ3RFLElBQUksYUFBYSxLQUFLLENBQUMsSUFBSSxRQUFRLEVBQUU7Z0JBQ3BDLGFBQWEsR0FBRyxDQUFDLENBQUM7YUFDbEI7WUFDRCxJQUFJLFlBQVksS0FBSyxpQkFBSyxJQUFJLFlBQVksS0FBSyxzQkFBVSxFQUFFO2dCQUMxRCxRQUFRLGFBQWEsRUFBRTtvQkFDdEIsS0FBSyxDQUFDO3dCQUNMLFFBQVEsR0FBSSxFQUE2QixDQUFDLEdBQUcsQ0FBQzt3QkFDOUMsTUFBTTtvQkFDUCxLQUFLLENBQUM7d0JBQ0wsUUFBUSxHQUFJLEVBQTZCLENBQUMsRUFBRSxDQUFDO3dCQUM3QyxNQUFNO29CQUNQLEtBQUssQ0FBQzt3QkFDTCxRQUFRLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQzt3QkFDbEIsTUFBTTtvQkFDUCxLQUFLLENBQUM7d0JBQ0wsUUFBUSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUM7d0JBQ25CLE1BQU07b0JBQ1A7d0JBQ0MsTUFBTSxJQUFJLEtBQUssQ0FBQywrQkFBNkIsYUFBYSx5QkFBbUIsSUFBSSxRQUFJLENBQUMsQ0FBQztpQkFDeEY7YUFDRDtpQkFBTSxJQUFJLFdBQVcsS0FBSyxpQkFBSyxJQUFJLFlBQVksS0FBSyx5QkFBYSxFQUFFO2dCQUNuRSxRQUFRLGFBQWEsRUFBRTtvQkFDdEIsNEVBQTRFO29CQUM1RSwwQkFBMEI7b0JBQzFCLEtBQUssQ0FBQzt3QkFDTCxJQUFJLENBQUMsUUFBUSxFQUFFOzRCQUNkLFFBQVEsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDOzRCQUNwQixNQUFNO3lCQUNOO29CQUNGLEtBQUssQ0FBQzt3QkFDTCxJQUFJLENBQUMsUUFBUSxFQUFFOzRCQUNkLFFBQVEsR0FBRyxFQUFFLENBQUMsZUFBZSxDQUFDOzRCQUM5QixNQUFNO3lCQUNOO29CQUNGLEtBQUssQ0FBQzt3QkFDTCxRQUFRLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQzt3QkFDbEIsYUFBYSxHQUFHLENBQUMsQ0FBQzt3QkFDbEIsTUFBTTtvQkFDUCxLQUFLLENBQUM7d0JBQ0wsUUFBUSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUM7d0JBQ25CLGFBQWEsR0FBRyxDQUFDLENBQUM7d0JBQ2xCLE1BQU07b0JBQ1A7d0JBQ0MsTUFBTSxJQUFJLEtBQUssQ0FBQywrQkFBNkIsYUFBYSx5QkFBbUIsSUFBSSxRQUFJLENBQUMsQ0FBQztpQkFDeEY7YUFDRDtpQkFBTTtnQkFDTixRQUFRLGFBQWEsRUFBRTtvQkFDdEIsS0FBSyxDQUFDO3dCQUNMLFFBQVEsR0FBSSxFQUE2QixDQUFDLFdBQVcsQ0FBQzt3QkFDdEQsTUFBTTtvQkFDUCxLQUFLLENBQUM7d0JBQ0wsUUFBUSxHQUFJLEVBQTZCLENBQUMsVUFBVSxDQUFDO3dCQUNyRCxNQUFNO29CQUNQLEtBQUssQ0FBQzt3QkFDTCxRQUFRLEdBQUksRUFBNkIsQ0FBQyxXQUFXLENBQUM7d0JBQ3RELE1BQU07b0JBQ1AsS0FBSyxDQUFDO3dCQUNMLFFBQVEsR0FBSSxFQUE2QixDQUFDLFlBQVksQ0FBQzt3QkFDdkQsTUFBTTtvQkFDUDt3QkFDQyxNQUFNLElBQUksS0FBSyxDQUFDLCtCQUE2QixhQUFhLHlCQUFtQixJQUFJLFFBQUksQ0FBQyxDQUFDO2lCQUN4RjthQUNEO1lBQ0QsUUFBUSxZQUFZLEVBQUU7Z0JBQ3JCLEtBQUssc0JBQVU7b0JBQ2QsTUFBTSxHQUFJLEVBQTZCLENBQUMsVUFBVSxDQUFDO29CQUNuRCxRQUFRLGFBQWEsRUFBRTt3QkFDdEIsS0FBSyxDQUFDOzRCQUNMLGdCQUFnQixHQUFJLEVBQTZCLENBQUMsSUFBSSxDQUFDOzRCQUN2RCxNQUFNO3dCQUNQLEtBQUssQ0FBQzs0QkFDTCxnQkFBZ0IsR0FBSSxFQUE2QixDQUFDLEtBQUssQ0FBQzs0QkFDeEQsTUFBTTt3QkFDUCxLQUFLLENBQUM7NEJBQ0wsZ0JBQWdCLEdBQUksRUFBNkIsQ0FBQyxNQUFNLENBQUM7NEJBQ3pELE1BQU07d0JBQ1AsS0FBSyxDQUFDOzRCQUNMLGdCQUFnQixHQUFJLEVBQTZCLENBQUMsT0FBTyxDQUFDOzRCQUMxRCxNQUFNO3dCQUNQOzRCQUNDLE1BQU0sSUFBSSxLQUFLLENBQUMsK0JBQTZCLGFBQWEseUJBQW1CLElBQUksUUFBSSxDQUFDLENBQUM7cUJBQ3hGO29CQUNELE1BQU07Z0JBQ1AsS0FBSyxpQkFBSztvQkFDVCxNQUFNLEdBQUksRUFBNkIsQ0FBQyxLQUFLLENBQUM7b0JBQzlDLFFBQVEsYUFBYSxFQUFFO3dCQUN0QixLQUFLLENBQUM7NEJBQ0wsZ0JBQWdCLEdBQUksRUFBNkIsQ0FBQyxJQUFJLENBQUM7NEJBQ3ZELE1BQU07d0JBQ1AsS0FBSyxDQUFDOzRCQUNMLGdCQUFnQixHQUFJLEVBQTZCLENBQUMsS0FBSyxDQUFDOzRCQUN4RCxNQUFNO3dCQUNQLEtBQUssQ0FBQzs0QkFDTCxnQkFBZ0IsR0FBSSxFQUE2QixDQUFDLE1BQU0sQ0FBQzs0QkFDekQsTUFBTTt3QkFDUCxLQUFLLENBQUM7NEJBQ0wsZ0JBQWdCLEdBQUksRUFBNkIsQ0FBQyxPQUFPLENBQUM7NEJBQzFELE1BQU07d0JBQ1A7NEJBQ0MsTUFBTSxJQUFJLEtBQUssQ0FBQywrQkFBNkIsYUFBYSx5QkFBbUIsSUFBSSxRQUFJLENBQUMsQ0FBQztxQkFDeEY7b0JBQ0QsTUFBTTtnQkFDUCxLQUFLLHlCQUFhO29CQUNqQixNQUFNLEdBQUcsRUFBRSxDQUFDLGFBQWEsQ0FBQztvQkFDMUIsSUFBSSxXQUFXLEtBQUssaUJBQUssSUFBSSxZQUFZLEtBQUsseUJBQWEsRUFBRTt3QkFDNUQsZ0JBQWdCLEdBQUcsUUFBUSxDQUFDO3FCQUM1Qjt5QkFBTTt3QkFDTixRQUFRLGFBQWEsRUFBRTs0QkFDdEIsS0FBSyxDQUFDO2dDQUNMLGdCQUFnQixHQUFJLEVBQTZCLENBQUMsSUFBSSxDQUFDO2dDQUN2RCxNQUFNOzRCQUNQLEtBQUssQ0FBQztnQ0FDTCxnQkFBZ0IsR0FBSSxFQUE2QixDQUFDLEtBQUssQ0FBQztnQ0FDeEQsTUFBTTs0QkFDUCxLQUFLLENBQUM7Z0NBQ0wsZ0JBQWdCLEdBQUksRUFBNkIsQ0FBQyxNQUFNLENBQUM7Z0NBQ3pELE1BQU07NEJBQ1AsS0FBSyxDQUFDO2dDQUNMLGdCQUFnQixHQUFJLEVBQTZCLENBQUMsT0FBTyxDQUFDO2dDQUMxRCxNQUFNOzRCQUNQO2dDQUNDLE1BQU0sSUFBSSxLQUFLLENBQUMsK0JBQTZCLGFBQWEseUJBQW1CLElBQUksUUFBSSxDQUFDLENBQUM7eUJBQ3hGO3FCQUNEO29CQUNELE1BQU07Z0JBQ1AsS0FBSyxnQkFBSTtvQkFDUixNQUFNLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQztvQkFDakIsUUFBUSxhQUFhLEVBQUU7d0JBQ3RCLEtBQUssQ0FBQzs0QkFDTCxnQkFBZ0IsR0FBSSxFQUE2QixDQUFDLEdBQUcsQ0FBQzs0QkFDdEQsTUFBTTt3QkFDUCxLQUFLLENBQUM7NEJBQ0wsZ0JBQWdCLEdBQUksRUFBNkIsQ0FBQyxJQUFJLENBQUM7NEJBQ3ZELE1BQU07d0JBQ1AsS0FBSyxDQUFDOzRCQUNMLGdCQUFnQixHQUFJLEVBQTZCLENBQUMsS0FBSyxDQUFDOzRCQUN4RCxNQUFNO3dCQUNQLEtBQUssQ0FBQzs0QkFDTCxnQkFBZ0IsR0FBSSxFQUE2QixDQUFDLE1BQU0sQ0FBQzs0QkFDekQsTUFBTTt3QkFDUDs0QkFDQyxNQUFNLElBQUksS0FBSyxDQUFDLCtCQUE2QixhQUFhLHlCQUFtQixJQUFJLFFBQUksQ0FBQyxDQUFDO3FCQUN4RjtvQkFDRCxNQUFNO2dCQUNQLEtBQUssaUJBQUs7b0JBQ1QsTUFBTSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUM7b0JBQ2xCLFFBQVEsYUFBYSxFQUFFO3dCQUN0QixLQUFLLENBQUM7NEJBQ0wsZ0JBQWdCLEdBQUksRUFBNkIsQ0FBQyxJQUFJLENBQUM7NEJBQ3ZELE1BQU07d0JBQ1AsS0FBSyxDQUFDOzRCQUNMLGdCQUFnQixHQUFJLEVBQTZCLENBQUMsS0FBSyxDQUFDOzRCQUN4RCxNQUFNO3dCQUNQLEtBQUssQ0FBQzs0QkFDTCxnQkFBZ0IsR0FBSSxFQUE2QixDQUFDLE1BQU0sQ0FBQzs0QkFDekQsTUFBTTt3QkFDUCxLQUFLLENBQUM7NEJBQ0wsZ0JBQWdCLEdBQUksRUFBNkIsQ0FBQyxPQUFPLENBQUM7NEJBQzFELE1BQU07d0JBQ1A7NEJBQ0MsTUFBTSxJQUFJLEtBQUssQ0FBQywrQkFBNkIsYUFBYSx5QkFBbUIsSUFBSSxRQUFJLENBQUMsQ0FBQztxQkFDeEY7b0JBQ0QsTUFBTTtnQkFDUCxLQUFLLDBCQUFjO29CQUNsQixNQUFNLEdBQUcsRUFBRSxDQUFDLGNBQWMsQ0FBQztvQkFDM0IsUUFBUSxhQUFhLEVBQUU7d0JBQ3RCLEtBQUssQ0FBQzs0QkFDTCxnQkFBZ0IsR0FBSSxFQUE2QixDQUFDLEtBQUssQ0FBQzs0QkFDeEQsTUFBTTt3QkFDUCxLQUFLLENBQUM7NEJBQ0wsZ0JBQWdCLEdBQUksRUFBNkIsQ0FBQyxNQUFNLENBQUM7NEJBQ3pELE1BQU07d0JBQ1AsS0FBSyxDQUFDOzRCQUNMLGdCQUFnQixHQUFJLEVBQTZCLENBQUMsT0FBTyxDQUFDOzRCQUMxRCxNQUFNO3dCQUNQLEtBQUssQ0FBQzs0QkFDTCxnQkFBZ0IsR0FBSSxFQUE2QixDQUFDLFFBQVEsQ0FBQzs0QkFDM0QsTUFBTTt3QkFDUDs0QkFDQyxNQUFNLElBQUksS0FBSyxDQUFDLCtCQUE2QixhQUFhLHlCQUFtQixJQUFJLFFBQUksQ0FBQyxDQUFDO3FCQUN4RjtvQkFDRCxNQUFNO2dCQUNQLEtBQUssZUFBRztvQkFDUCxNQUFNLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQztvQkFDaEIsUUFBUSxhQUFhLEVBQUU7d0JBQ3RCLEtBQUssQ0FBQzs0QkFDTCxnQkFBZ0IsR0FBSSxFQUE2QixDQUFDLElBQUksQ0FBQzs0QkFDdkQsTUFBTTt3QkFDUCxLQUFLLENBQUM7NEJBQ0wsZ0JBQWdCLEdBQUksRUFBNkIsQ0FBQyxLQUFLLENBQUM7NEJBQ3hELE1BQU07d0JBQ1AsS0FBSyxDQUFDOzRCQUNMLGdCQUFnQixHQUFJLEVBQTZCLENBQUMsTUFBTSxDQUFDOzRCQUN6RCxNQUFNO3dCQUNQLEtBQUssQ0FBQzs0QkFDTCxnQkFBZ0IsR0FBSSxFQUE2QixDQUFDLE9BQU8sQ0FBQzs0QkFDMUQsTUFBTTt3QkFDUDs0QkFDQyxNQUFNLElBQUksS0FBSyxDQUFDLCtCQUE2QixhQUFhLHlCQUFtQixJQUFJLFFBQUksQ0FBQyxDQUFDO3FCQUN4RjtvQkFDRCxNQUFNO2dCQUNQLEtBQUssd0JBQVk7b0JBQ2hCLE1BQU0sR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDO29CQUN6QixRQUFRLGFBQWEsRUFBRTt3QkFDdEIsS0FBSyxDQUFDOzRCQUNMLGdCQUFnQixHQUFJLEVBQTZCLENBQUMsS0FBSyxDQUFDOzRCQUN4RCxNQUFNO3dCQUNQLEtBQUssQ0FBQzs0QkFDTCxnQkFBZ0IsR0FBSSxFQUE2QixDQUFDLE1BQU0sQ0FBQzs0QkFDekQsTUFBTTt3QkFDUCxLQUFLLENBQUM7NEJBQ0wsZ0JBQWdCLEdBQUksRUFBNkIsQ0FBQyxPQUFPLENBQUM7NEJBQzFELE1BQU07d0JBQ1AsS0FBSyxDQUFDOzRCQUNMLGdCQUFnQixHQUFJLEVBQTZCLENBQUMsUUFBUSxDQUFDOzRCQUMzRCxNQUFNO3dCQUNQOzRCQUNDLE1BQU0sSUFBSSxLQUFLLENBQUMsK0JBQTZCLGFBQWEseUJBQW1CLElBQUksUUFBSSxDQUFDLENBQUM7cUJBQ3hGO29CQUNELE1BQU07Z0JBQ1A7b0JBQ0MsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQkFBb0IsWUFBWSx5QkFBbUIsSUFBSSxRQUFJLENBQUMsQ0FBQzthQUM5RTtTQUNEO2FBQU07WUFDTixRQUFRLGFBQWEsRUFBRTtnQkFDdEIsZ0dBQWdHO2dCQUNoRyxLQUFLLENBQUM7b0JBQ0wsSUFBSSxDQUFDLFFBQVEsRUFBRTt3QkFDZCxRQUFRLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQzt3QkFDcEIsTUFBTTtxQkFDTjtnQkFDRixLQUFLLENBQUM7b0JBQ0wsSUFBSSxDQUFDLFFBQVEsRUFBRTt3QkFDZCxRQUFRLEdBQUcsRUFBRSxDQUFDLGVBQWUsQ0FBQzt3QkFDOUIsTUFBTTtxQkFDTjtnQkFDRixLQUFLLENBQUM7b0JBQ0wsUUFBUSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUM7b0JBQ2xCLGdCQUFnQixHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUM7b0JBQzFCLGFBQWEsR0FBRyxDQUFDLENBQUM7b0JBQ2xCLE1BQU07Z0JBQ1AsS0FBSyxDQUFDO29CQUNMLFFBQVEsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDO29CQUNuQixnQkFBZ0IsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDO29CQUMzQixhQUFhLEdBQUcsQ0FBQyxDQUFDO29CQUNsQixNQUFNO2dCQUNQO29CQUNDLE1BQU0sSUFBSSxLQUFLLENBQUMsK0JBQTZCLGFBQWEseUJBQW1CLElBQUksUUFBSSxDQUFDLENBQUM7YUFDeEY7WUFDRCxRQUFRLFlBQVksRUFBRTtnQkFDckIsS0FBSyxpQkFBSztvQkFDVCxNQUFNLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQztvQkFDbEIsTUFBTTtnQkFDUCxLQUFLLHNCQUFVO29CQUNkLE1BQU0sR0FBSSxFQUE2QixDQUFDLFVBQVUsSUFBSSx5QkFBWSxDQUFDLEVBQUUsRUFBRSxtQ0FBc0IsRUFBRSxhQUFhLENBQUMsQ0FBQyxjQUF3QixDQUFDO29CQUN2SSxNQUFNO2dCQUNQLEtBQUsseUJBQWE7b0JBQ2pCLE1BQU0sR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDO29CQUMxQixNQUFNO2dCQUNQLDBDQUEwQztnQkFDMUM7b0JBQ0MsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQkFBb0IsWUFBWSxzQ0FBZ0MsSUFBSSxRQUFJLENBQUMsQ0FBQzthQUMzRjtTQUNEO1FBRUQsNEJBQTRCO1FBQzVCLElBQUksTUFBTSxLQUFLLFNBQVMsSUFBSSxRQUFRLEtBQUssU0FBUyxJQUFJLGdCQUFnQixLQUFLLFNBQVMsRUFBRTtZQUNyRixJQUFNLGFBQWEsR0FBRyxFQUFFLENBQUM7WUFDekIsSUFBSSxNQUFNLEtBQUssU0FBUztnQkFBRSxhQUFhLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3ZELElBQUksUUFBUSxLQUFLLFNBQVM7Z0JBQUUsYUFBYSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUMzRCxJQUFJLGdCQUFnQixLQUFLLFNBQVM7Z0JBQUUsYUFBYSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBQzNFLE1BQU0sSUFBSSxLQUFLLENBQUMsbUJBQWlCLFlBQVksMkJBQXNCLGFBQWEsbUNBQTZCLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBSSxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyx5QkFBbUIsSUFBSSxRQUFJLENBQUMsQ0FBQztTQUN6TTtRQUNELElBQUksYUFBYSxLQUFLLFNBQVMsSUFBSSxhQUFhLEdBQUcsQ0FBQyxJQUFJLGFBQWEsR0FBRyxDQUFDLElBQUksYUFBYSxHQUFHLGFBQWEsRUFBRTtZQUMzRyxNQUFNLElBQUksS0FBSyxDQUFDLHlCQUF1QixhQUFhLDJCQUFzQixhQUFhLHlCQUFtQixJQUFJLFFBQUksQ0FBQyxDQUFDO1NBQ3BIO1FBRUQsT0FBTztZQUNOLFFBQVE7WUFDUixnQkFBZ0I7WUFDaEIsTUFBTTtZQUNOLGFBQWE7U0FDYixDQUFDO0lBQ0gsQ0FBQztJQUVjLDhCQUFvQixHQUFuQyxVQUNDLE1BSUM7UUFFTyxNQUFFLEdBQXdCLE1BQU0sR0FBOUIsRUFBRSxJQUFJLEdBQWtCLE1BQU0sS0FBeEIsRUFBRSxXQUFXLEdBQUssTUFBTSxZQUFYLENBQVk7UUFDekMsSUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ25DLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDYixPQUFPLEtBQUssQ0FBQztTQUNiO1FBQ0QsRUFBRSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRXZDLDZDQUE2QztRQUM3QyxJQUFNLEtBQUssR0FBRyxFQUFFLENBQUMseUJBQWEsQ0FBQyxDQUFDO1FBQ2hDLElBQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQyx5QkFBYSxDQUFDLENBQUM7UUFDaEMsSUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLG1CQUFPLENBQUMsQ0FBQztRQUMzQix1RUFBdUU7UUFDdkUsMkRBQTJEO1FBQzNELElBQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQztRQUNsQixJQUFNLE1BQU0sR0FBRyxHQUFHLENBQUM7UUFDbkIsRUFBRSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxjQUFjLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDMUQsRUFBRSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxjQUFjLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDMUQsRUFBRSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUMvRCxFQUFFLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLGtCQUFrQixFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRXpELFNBQXlDLFNBQVMsQ0FBQyxzQkFBc0IsQ0FBQztZQUMvRSxFQUFFO1lBQ0YsSUFBSSxFQUFFLHNCQUFzQjtZQUM1QixhQUFhLEVBQUUsQ0FBQztZQUNoQixRQUFRLEVBQUUsSUFBSTtZQUNkLFlBQVksRUFBRSxJQUFJO1lBQ2xCLFdBQVc7WUFDWCxhQUFhLEVBQUUsY0FBTyxDQUFDO1NBQ3ZCLENBQUMsRUFSTSxnQkFBZ0Isd0JBQUUsUUFBUSxnQkFBRSxNQUFNLFlBUXhDLENBQUM7UUFDSCxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxFQUFFLGdCQUFnQixFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFNUYsNkRBQTZEO1FBQzdELElBQU0sV0FBVyxHQUFHLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1FBQzNDLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDakIsOEJBQThCO1lBQzlCLEVBQUUsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDMUIsT0FBTyxLQUFLLENBQUM7U0FDYjtRQUNELEVBQUUsQ0FBQyxlQUFlLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUNoRCw4RkFBOEY7UUFDOUYsRUFBRSxDQUFDLG9CQUFvQixDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLGlCQUFpQixFQUFFLEVBQUUsQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRXpGLElBQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDekQsSUFBTSxXQUFXLEdBQUcsTUFBTSxLQUFLLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQztRQUV2RCw4QkFBOEI7UUFDOUIsRUFBRSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMxQixFQUFFLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFbEMsT0FBTyxXQUFXLENBQUM7SUFDcEIsQ0FBQztJQUVELHNCQUFJLGtDQUFXO2FBQWY7WUFDQyxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7UUFDMUIsQ0FBQzs7O09BQUE7SUFFRCwrQ0FBMkIsR0FBM0IsVUFBNEIsS0FBZ0I7UUFDM0MsdUVBQXVFO1FBQ3ZFLHFEQUFxRDtRQUNyRCxJQUFJLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUFFO1lBQ3hCLE1BQU0sSUFBSSxLQUFLLENBQUMsbUVBQWlFLElBQUksQ0FBQyxJQUFJLCtCQUE0QixDQUFDLENBQUM7U0FDeEg7UUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNuQixNQUFNLElBQUksS0FBSyxDQUFDLDZFQUEyRSxJQUFJLENBQUMsSUFBSSxNQUFHLENBQUMsQ0FBQztTQUN6RztRQUNELElBQUksS0FBSyxDQUFDLFFBQVEsRUFBRTtZQUNuQixNQUFNLElBQUksS0FBSyxDQUFDLG1FQUFpRSxJQUFJLENBQUMsSUFBSSxrQ0FBNkIsS0FBSyxDQUFDLElBQUksTUFBRyxDQUFDO1NBQ3JJO1FBQ0QsMENBQTBDO1FBQzFDLElBQUksS0FBSyxDQUFDLE9BQU8sS0FBSyxJQUFJLENBQUMsT0FBTyxJQUFJLEtBQUssQ0FBQyxPQUFPLEtBQUssSUFBSSxDQUFDLE9BQU87WUFDbkUsS0FBSyxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFDLEtBQUs7WUFDeEQsS0FBSyxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLE1BQU07WUFDMUQsS0FBSyxDQUFDLFFBQVEsS0FBSyxJQUFJLENBQUMsUUFBUSxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLE1BQU07WUFDaEUsS0FBSyxDQUFDLGFBQWEsS0FBSyxJQUFJLENBQUMsYUFBYSxJQUFJLEtBQUssQ0FBQyxhQUFhLEtBQUssSUFBSSxDQUFDLGFBQWE7WUFDeEYsS0FBSyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLElBQUk7WUFDeEQsS0FBSyxDQUFDLFFBQVEsS0FBSyxJQUFJLENBQUMsUUFBUSxJQUFJLEtBQUssQ0FBQyxnQkFBZ0IsS0FBSyxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7WUFDckYsTUFBTSxJQUFJLEtBQUssQ0FBQyxvREFBa0QsS0FBSyxDQUFDLElBQUksYUFBUSxJQUFJLENBQUMsSUFBSSxNQUFHLENBQUMsQ0FBQztTQUNuRztRQUVELDREQUE0RDtRQUM1RCxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFO1lBQzNCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7WUFDM0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3pDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7YUFDdEM7U0FDRDtRQUVELGlEQUFpRDtRQUNqRCxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUU7WUFDN0MsTUFBTSxJQUFJLEtBQUssQ0FBQyxtRUFBaUUsSUFBSSxDQUFDLElBQUkseUdBQXNHLENBQUMsQ0FBQztTQUNsTTtRQUNELElBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1FBQ25ELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsWUFBWSxDQUFDO1FBQ3hELGlCQUFpQjtRQUNqQixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLHNCQUFzQixFQUFFLENBQUM7UUFDekUsS0FBSyxDQUFDLHVCQUF1QixDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRTVDLHVDQUF1QztRQUMvQixNQUFFLEdBQUssSUFBSSxHQUFULENBQVU7UUFDZCxTQUEyQixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBeEQsV0FBVyxtQkFBRSxPQUFPLGFBQW9DLENBQUM7UUFDakUsSUFBSSxDQUFDLFdBQVc7WUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLDJDQUF5QyxJQUFJLENBQUMsSUFBSSxNQUFHLENBQUMsQ0FBQztRQUN6RixFQUFFLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDaEQsOEZBQThGO1FBQzlGLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxFQUFFLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN6RixVQUFVO1FBQ1YsRUFBRSxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFRCwyQ0FBdUIsR0FBdkIsVUFBd0IsT0FBcUI7UUFDNUMsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2xCLE1BQU0sSUFBSSxLQUFLLENBQUMsc0VBQW9FLElBQUksQ0FBQyxJQUFJLE1BQUcsQ0FBQyxDQUFDO1NBQ2xHO1FBQ0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztJQUNuRCxDQUFDO0lBRU8scUNBQWlCLEdBQXpCLFVBQ0MsS0FBMEI7UUFFMUIsSUFBSSxDQUFDLEtBQUssRUFBQztZQUNWLE9BQU87U0FDUDtRQUNLLFNBQW9GLElBQUksRUFBdEYsS0FBSyxhQUFFLE1BQU0sY0FBRSxNQUFNLGNBQUUsYUFBYSxxQkFBRSxhQUFhLHFCQUFFLElBQUksWUFBRSxZQUFZLG9CQUFFLElBQUksVUFBUyxDQUFDO1FBRS9GLGtEQUFrRDtRQUNsRCxJQUFJLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssTUFBTSxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxLQUFLLEdBQUcsTUFBTSxHQUFHLGFBQWEsQ0FBQyxFQUFFO1lBQ3hILE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXVCLEtBQUssQ0FBQyxNQUFNLHlCQUFtQixJQUFJLG9CQUFhLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBSSxLQUFLLFNBQUksTUFBUSxVQUFJLGFBQWEsTUFBRyxDQUFDLENBQUM7U0FDbko7UUFFRCxnREFBZ0Q7UUFDaEQsSUFBSSxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7UUFDN0IsUUFBUSxJQUFJLEVBQUU7WUFDYixLQUFLLHNCQUFVLENBQUM7WUFDZiw2RUFBNkU7WUFDN0UseUJBQXlCO1lBQzFCLEtBQUssaUJBQUs7Z0JBQ1QsZ0JBQWdCLEdBQUcsZ0JBQWdCLElBQUksS0FBSyxDQUFDLFdBQVcsS0FBSyxZQUFZLENBQUM7Z0JBQzFFLE1BQU07WUFDUCxLQUFLLHlCQUFhO2dCQUNqQixnQkFBZ0IsR0FBRyxnQkFBZ0IsSUFBSSxLQUFLLENBQUMsV0FBVyxLQUFLLFVBQVUsQ0FBQztnQkFDeEUsTUFBTTtZQUNQLEtBQUssZ0JBQUk7Z0JBQ1IsZ0JBQWdCLEdBQUcsZ0JBQWdCLElBQUksS0FBSyxDQUFDLFdBQVcsS0FBSyxTQUFTLENBQUM7Z0JBQ3ZFLE1BQU07WUFDUCxLQUFLLDBCQUFjO2dCQUNsQixnQkFBZ0IsR0FBRyxnQkFBZ0IsSUFBSSxLQUFLLENBQUMsV0FBVyxLQUFLLFdBQVcsQ0FBQztnQkFDekUsTUFBTTtZQUNQLEtBQUssaUJBQUs7Z0JBQ1QsZ0JBQWdCLEdBQUcsZ0JBQWdCLElBQUksS0FBSyxDQUFDLFdBQVcsS0FBSyxVQUFVLENBQUM7Z0JBQ3hFLE1BQU07WUFDUCxLQUFLLHdCQUFZO2dCQUNoQixnQkFBZ0IsR0FBRyxnQkFBZ0IsSUFBSSxLQUFLLENBQUMsV0FBVyxLQUFLLFdBQVcsQ0FBQztnQkFDekUsTUFBTTtZQUNQLEtBQUssZUFBRztnQkFDUCxnQkFBZ0IsR0FBRyxnQkFBZ0IsSUFBSSxLQUFLLENBQUMsV0FBVyxLQUFLLFVBQVUsQ0FBQztnQkFDeEUsTUFBTTtZQUNQO2dCQUNDLE1BQU0sSUFBSSxLQUFLLENBQUMsK0JBQTRCLElBQUksZ0NBQXlCLElBQUksdUNBQW1DLENBQUMsQ0FBQztTQUNuSDtRQUNELElBQUksZ0JBQWdCLEVBQUU7WUFDckIsTUFBTSxJQUFJLEtBQUssQ0FBQyxnQ0FBK0IsS0FBSyxDQUFDLFdBQW1CLENBQUMsSUFBSSxpQ0FBMkIsSUFBSSxxQkFBYyxJQUFJLFFBQUksQ0FBQyxDQUFDO1NBQ3BJO1FBRUQsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ2pCLElBQU0sU0FBUyxHQUFHLEtBQUssR0FBRyxNQUFNLEdBQUcsYUFBYSxDQUFDO1FBQ2pELDhDQUE4QztRQUM5Qyx5REFBeUQ7UUFDekQsd0NBQXdDO1FBQ3hDLElBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxNQUFNLEtBQUssU0FBUyxDQUFDO1FBQ2hELHFGQUFxRjtRQUNyRixJQUFNLGFBQWEsR0FBRyxZQUFZLEtBQUssc0JBQVUsQ0FBQztRQUNsRCx5RUFBeUU7UUFDekUsSUFBTSxjQUFjLEdBQUcsSUFBSSxLQUFLLFlBQVksQ0FBQztRQUU3QyxJQUFJLGNBQWMsSUFBSSxhQUFhLElBQUksYUFBYSxFQUFFO1lBQ3JELFFBQVEsWUFBWSxFQUFFO2dCQUNyQixLQUFLLHNCQUFVO29CQUNkLElBQUksR0FBRyxJQUFJLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztvQkFDbEMsTUFBTTtnQkFDUCxLQUFLLGlCQUFLO29CQUNULElBQUksR0FBRyxJQUFJLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztvQkFDbkMsTUFBTTtnQkFDUCxLQUFLLHlCQUFhO29CQUNqQixJQUFJLEdBQUcsSUFBSSxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBQ2pDLE1BQU07Z0JBQ1AsS0FBSyxnQkFBSTtvQkFDUixJQUFJLEdBQUcsSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBQ2hDLE1BQU07Z0JBQ1AsS0FBSywwQkFBYztvQkFDbEIsSUFBSSxHQUFHLElBQUksV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUNsQyxNQUFNO2dCQUNQLEtBQUssaUJBQUs7b0JBQ1QsSUFBSSxHQUFHLElBQUksVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUNqQyxNQUFNO2dCQUNQLEtBQUssd0JBQVk7b0JBQ2hCLElBQUksR0FBRyxJQUFJLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztvQkFDbEMsTUFBTTtnQkFDUCxLQUFLLGVBQUc7b0JBQ1AsSUFBSSxHQUFHLElBQUksVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUNqQyxNQUFNO2dCQUNSO29CQUNFLE1BQU0sSUFBSSxLQUFLLENBQUMsbUJBQWlCLElBQUksb0NBQStCLFlBQVkscUNBQWtDLENBQUMsQ0FBQzthQUNySDtZQUNELHFDQUFxQztZQUNyQyxJQUFNLElBQUksR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQzlELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksR0FBRyxLQUFLLENBQUMsTUFBTSxHQUFHLGFBQWEsRUFBRSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNuRSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsYUFBYSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUN2QyxJQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLGFBQWEsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDM0MsSUFBTSxLQUFLLEdBQUcsQ0FBQyxHQUFHLGFBQWEsR0FBRyxDQUFDLENBQUM7b0JBQ3BDLElBQUksYUFBYSxFQUFFO3dCQUNsQixvQkFBVSxDQUFDLElBQUssRUFBRSxDQUFDLEdBQUcsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztxQkFDMUM7eUJBQU07d0JBQ04sSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQztxQkFDcEI7aUJBQ0Q7YUFDRDtTQUNEO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0lBRU8sK0JBQVcsR0FBbkIsVUFDQyxLQUEwQjtRQUVwQixTQWNGLElBQUksRUFiUCxJQUFJLFlBQ0osVUFBVSxrQkFDVixFQUFFLFVBQ0YsS0FBSyxhQUNMLE1BQU0sY0FDTixnQkFBZ0Isd0JBQ2hCLFFBQVEsZ0JBQ1IsTUFBTSxjQUNOLFFBQVEsZ0JBQ1IsT0FBTyxlQUNQLE9BQU8sZUFDUCxRQUFRLGdCQUNSLGFBQWEsbUJBQ04sQ0FBQztRQUVULElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUUzQyxrQ0FBa0M7UUFDbEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNwQyxJQUFNLE9BQU8sR0FBRyxFQUFFLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDbkMsSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFDYixhQUFhLENBQUMsNENBQXlDLElBQUksWUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFLE1BQUcsQ0FBQyxDQUFDO2dCQUNuRixPQUFPO2FBQ1A7WUFDRCxFQUFFLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFFdkMsNkNBQTZDO1lBQzdDLHNGQUFzRjtZQUN0RixFQUFFLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUM1RCxFQUFFLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUM1RCxFQUFFLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLGtCQUFrQixFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ2pFLEVBQUUsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsa0JBQWtCLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFFakUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLENBQUMsRUFBRSxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUUxRyxJQUFNLE1BQU0sR0FBb0I7Z0JBQy9CLE9BQU87YUFDUCxDQUFDO1lBRUYsSUFBSSxRQUFRLEVBQUU7Z0JBQ2IsNkRBQTZEO2dCQUM3RCxJQUFNLFdBQVcsR0FBRyxFQUFFLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztnQkFDM0MsSUFBSSxDQUFDLFdBQVcsRUFBRTtvQkFDakIsYUFBYSxDQUFDLGdEQUE2QyxJQUFJLFlBQU0sRUFBRSxDQUFDLFFBQVEsRUFBRSxNQUFHLENBQUMsQ0FBQztvQkFDdkYsT0FBTztpQkFDUDtnQkFDRCxFQUFFLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUM7Z0JBQ2hELDhGQUE4RjtnQkFDOUYsRUFBRSxDQUFDLG9CQUFvQixDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLGlCQUFpQixFQUFFLEVBQUUsQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUV6RixJQUFNLFFBQU0sR0FBRyxFQUFFLENBQUMsc0JBQXNCLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUN6RCxJQUFHLFFBQU0sSUFBSSxFQUFFLENBQUMsb0JBQW9CLEVBQUM7b0JBQ3BDLGFBQWEsQ0FBQyxvREFBaUQsSUFBSSxZQUFNLFFBQU0sTUFBRyxDQUFDLENBQUM7aUJBQ3BGO2dCQUVELG1CQUFtQjtnQkFDbkIsTUFBTSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7YUFDakM7WUFFRCxnQ0FBZ0M7WUFDaEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDMUI7UUFDRCxVQUFVO1FBQ1YsRUFBRSxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFRCwwQ0FBc0IsR0FBdEI7UUFDQyxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQztZQUFFLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUUsQ0FBQztRQUN4SCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQztJQUNoRCxDQUFDO0lBRUQsMkNBQXVCLEdBQXZCLFVBQXdCLEtBQVU7UUFBVixpQ0FBUyxDQUFDO1FBQ2pDLElBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxDQUFDLEVBQUU7WUFDMUIsTUFBTSxJQUFJLEtBQUssQ0FBQyx3REFBcUQsSUFBSSxDQUFDLElBQUksNkJBQXlCLENBQUMsQ0FBQztTQUN6RztRQUNELElBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDbEUsSUFBSSxhQUFhLEdBQUcsQ0FBQyxJQUFJLGFBQWEsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQzFELE1BQU0sSUFBSSxLQUFLLENBQUMsbUJBQWlCLEtBQUssd0RBQW1ELElBQUksQ0FBQyxJQUFJLGNBQVMsSUFBSSxDQUFDLFVBQVUsY0FBVyxDQUFDLENBQUM7U0FDdkk7UUFDRCxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDO1lBQUUsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFFLENBQUM7UUFDaEgsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLE9BQU8sQ0FBQztJQUM1QyxDQUFDO0lBRUQseURBQXFDLEdBQXJDO1FBQ0MsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUN6RSxDQUFDO0lBRUQsNkNBQXlCLEdBQXpCLFVBQ0Msb0JBQTZCO1FBRXJCLE1BQUUsR0FBSyxJQUFJLEdBQVQsQ0FBVTtRQUNwQixJQUFJLG9CQUFvQixFQUFFO1lBQ3pCLHlCQUF5QjtZQUN6QixJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO1NBQzlEO1FBQ0QsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFFekIscUZBQXFGO1FBQ3JGLElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFO1lBQzFCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsU0FBUyxDQUFDO1NBQ3JEO0lBQ0YsQ0FBQztJQUVELHFDQUFpQixHQUFqQjtRQUNTLE1BQUUsR0FBSyxJQUFJLEdBQVQsQ0FBVTtRQUNaLGVBQVcsR0FBSyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsWUFBcEMsQ0FBcUM7UUFDeEQsSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNqQixNQUFNLElBQUksS0FBSyxDQUFDLGlCQUFjLElBQUksQ0FBQyxJQUFJLHdCQUFvQixDQUFDLENBQUM7U0FDN0Q7UUFDRCxFQUFFLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVELDJCQUFPLEdBQVAsVUFBUSxJQUF3QjtRQUMvQiwwRUFBMEU7UUFDMUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDeEIsQ0FBQztJQUVELDBCQUFNLEdBQU4sVUFDQyxVQUFxQyxFQUNyQyxJQUF5QjtRQUVuQixTQUE0QixTQUFTLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQW5FLE1BQU0sY0FBRSxLQUFLLGFBQUUsTUFBTSxZQUE4QyxDQUFDO1FBQzVFLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN0QixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3hCLENBQUM7SUFFRCx5QkFBSyxHQUFMO1FBQ0MsNEJBQTRCO1FBQzVCLG9IQUFvSDtRQUNwSCxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDdEIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3BCLENBQUM7SUFFRCxpQ0FBYSxHQUFiO1FBQ0MsT0FBTztZQUNOLElBQUksQ0FBQyxLQUFLO1lBQ1YsSUFBSSxDQUFDLE1BQU07U0FDUyxDQUFDO0lBQ3ZCLENBQUM7SUFFRCw2QkFBUyxHQUFUO1FBQ0MsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDakIsTUFBTSxJQUFJLEtBQUssQ0FBQywrQ0FBNEMsSUFBSSxDQUFDLElBQUksUUFBSSxDQUFDLENBQUM7U0FDM0U7UUFDRCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDcEIsQ0FBQztJQUVPLGtDQUFjLEdBQXRCO1FBQ08sU0FBa0IsSUFBSSxFQUFwQixFQUFFLFVBQUUsT0FBTyxhQUFTLENBQUM7UUFDN0IsT0FBTyxDQUFDLE9BQU8sQ0FBQyxnQkFBTTtZQUNiLGVBQVcsR0FBYyxNQUFNLFlBQXBCLEVBQUUsT0FBTyxHQUFLLE1BQU0sUUFBWCxDQUFZO1lBQ3hDLEVBQUUsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDMUIsSUFBSSxXQUFXLEVBQUU7Z0JBQ2hCLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsQ0FBQzthQUNsQztZQUNELGFBQWE7WUFDYixPQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUM7WUFDdEIsT0FBTyxNQUFNLENBQUMsV0FBVyxDQUFDO1FBQzNCLENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFFbkIsb0RBQW9EO1FBQ3BELCtEQUErRDtRQUMvRCxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztJQUM5QixDQUFDO0lBRUQsMkJBQU8sR0FBUDtRQUNDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN0QixhQUFhO1FBQ2IsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ2YsYUFBYTtRQUNiLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQztJQUMzQixDQUFDO0lBQ0YsZ0JBQUM7QUFBRCxDQUFDO0FBM2lDWSw4QkFBUzs7Ozs7Ozs7Ozs7Ozs7OztBQ3hCdEIsc0VBQWtFO0FBQ2xFLCtFQVFxQjtBQUNyQixtRUFBd0M7QUFFeEMsSUFBTSxvQkFBb0IsR0FBRyxTQUFTLENBQUM7QUFDdkMsSUFBTSx5QkFBeUIsR0FBRyxjQUFjLENBQUM7QUFDakQsSUFBTSw2QkFBNkIsR0FBRyxrQkFBa0IsQ0FBQztBQUN6RCxJQUFNLGdDQUFnQyxHQUFHLHFCQUFxQixDQUFDO0FBQy9ELElBQU0sb0JBQW9CLEdBQUcsU0FBUyxDQUFDO0FBQ3ZDLElBQU0sOEJBQThCLEdBQUcsbUJBQW1CLENBQUM7QUFDM0QsSUFBTSw2QkFBNkIsR0FBRyxrQkFBa0IsQ0FBQztBQUN6RCxJQUFNLG9DQUFvQyxHQUFHLHlCQUF5QixDQUFDO0FBV3ZFLElBQU0sYUFBYTtJQU1sQixHQUFDLG9CQUFvQixJQUFHO1FBQ3ZCLEtBQUssRUFBRSxtQkFBTyxDQUFDLGdGQUFtQyxDQUFDO1FBQ25ELEtBQUssRUFBRSxFQUFFO0tBQ1Q7SUFDRCxHQUFDLHlCQUF5QixJQUFHO1FBQzVCLEtBQUssRUFBRSxtQkFBTyxDQUFDLGdGQUFtQyxDQUFDO1FBQ25ELEtBQUssRUFBRSxFQUFFO1FBQ1QsT0FBTyxFQUFFO1lBQ1IsY0FBYyxFQUFFLEdBQUc7U0FDbkI7S0FDRDtJQUNELEdBQUMsNkJBQTZCLElBQUc7UUFDaEMsS0FBSyxFQUFFLG1CQUFPLENBQUMsZ0ZBQW1DLENBQUM7UUFDbkQsS0FBSyxFQUFFLEVBQUU7UUFDVCxPQUFPLEVBQUU7WUFDUixrQkFBa0IsRUFBRSxHQUFHO1NBQ3ZCO0tBQ0Q7SUFDRCxHQUFDLGdDQUFnQyxJQUFHO1FBQ25DLEtBQUssRUFBRSxtQkFBTyxDQUFDLGdGQUFtQyxDQUFDO1FBQ25ELEtBQUssRUFBRSxFQUFFO1FBQ1QsT0FBTyxFQUFFO1lBQ1IsY0FBYyxFQUFFLEdBQUc7WUFDbkIsa0JBQWtCLEVBQUUsR0FBRztTQUN2QjtLQUNEO0lBQ0QsR0FBQyxvQkFBb0IsSUFBRztRQUN2QixLQUFLLEVBQUUsbUJBQU8sQ0FBQyxnRkFBbUMsQ0FBQztRQUNuRCxLQUFLLEVBQUUsRUFBRTtLQUNUO0lBQ0QsR0FBQyw4QkFBOEIsSUFBRztRQUNqQyxLQUFLLEVBQUUsbUJBQU8sQ0FBQyxnR0FBMkMsQ0FBQztRQUMzRCxLQUFLLEVBQUUsRUFBRTtLQUNUO0lBQ0QsR0FBQyxvQ0FBb0MsSUFBRztRQUN2QyxLQUFLLEVBQUUsbUJBQU8sQ0FBQywwR0FBZ0QsQ0FBQztRQUNoRSxLQUFLLEVBQUUsRUFBRTtLQUNUO0lBQ0QsR0FBQyw2QkFBNkIsSUFBRztRQUNoQyxLQUFLLEVBQUUsbUJBQU8sQ0FBQyw4RkFBMEMsQ0FBQztRQUMxRCxLQUFLLEVBQUUsRUFBRTtLQUNUO09BQ0QsQ0FBQztBQUVGO0lBVUMsb0JBQ0MsTUFjQztRQXBCZSxhQUFRLEdBQWdDLEVBQUUsQ0FBQztRQUU1RCxxQkFBcUI7UUFDYixhQUFRLEdBQTZDLEVBQUUsQ0FBQztRQW9CdkQsTUFBRSxHQUEwRSxNQUFNLEdBQWhGLEVBQUUsYUFBYSxHQUEyRCxNQUFNLGNBQWpFLEVBQUUsSUFBSSxHQUFxRCxNQUFNLEtBQTNELEVBQUUsY0FBYyxHQUFxQyxNQUFNLGVBQTNDLEVBQUUsV0FBVyxHQUF3QixNQUFNLFlBQTlCLEVBQUUsUUFBUSxHQUFjLE1BQU0sU0FBcEIsRUFBRSxPQUFPLEdBQUssTUFBTSxRQUFYLENBQVk7UUFFM0Ysa0JBQWtCO1FBQ2xCLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ2IsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7UUFDbkMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFFL0IsMkJBQTJCO1FBQzNCLElBQUksT0FBTSxDQUFDLGNBQWMsQ0FBQyxLQUFLLFFBQVEsSUFBSSxPQUFNLENBQUUsY0FBMkIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVEsRUFBRTtZQUNoRyxJQUFJLFlBQVksR0FBRyxPQUFNLENBQUMsY0FBYyxDQUFDLEtBQUssUUFBUSxDQUFDLENBQUM7Z0JBQ3ZELGNBQWMsQ0FBQyxDQUFDO2dCQUNmLGNBQTJCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3pDLElBQUksT0FBTyxFQUFFO2dCQUNaLFlBQVksR0FBRyxVQUFVLENBQUMsc0JBQXNCLENBQUMsT0FBTyxDQUFDLEdBQUcsWUFBWSxDQUFDO2FBQ3pFO1lBQ0QsSUFBTSxNQUFNLEdBQUcscUJBQWEsQ0FBQyxFQUFFLEVBQUUsYUFBYSxFQUFFLFlBQVksRUFBRSxFQUFFLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3hGLElBQUksQ0FBQyxNQUFNLEVBQUU7Z0JBQ1osYUFBYSxDQUFDLHFEQUFrRCxJQUFJLFFBQUksQ0FBQyxDQUFDO2dCQUMxRSxPQUFPO2FBQ1A7WUFDRCxJQUFJLENBQUMsY0FBYyxHQUFHLE1BQU0sQ0FBQztTQUM3QjthQUFNO1lBQ04sSUFBSSxPQUFPLEVBQUU7Z0JBQ1osTUFBTSxJQUFJLEtBQUssQ0FBQywyQ0FBd0MsSUFBSSxvREFBZ0QsQ0FBQyxDQUFDO2FBQzlHO1NBQ0Q7UUFFRCxJQUFJLFFBQVEsRUFBRTtZQUNiLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBRyxRQUFRLGFBQVIsUUFBUSx1QkFBUixRQUFRLENBQUUsTUFBTSxHQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNwQyxTQUE0QixRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQXJDLE1BQUksWUFBRSxLQUFLLGFBQUUsUUFBUSxjQUFnQixDQUFDO2dCQUM5QyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7YUFDdkM7U0FDRDtJQUNGLENBQUM7SUFFYyxpQ0FBc0IsR0FBckMsVUFBc0MsT0FBZ0M7UUFDckUsSUFBSSxhQUFhLEdBQUcsRUFBRSxDQUFDO1FBQ3ZCLElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDckMsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLDhDQUE4QztZQUM5QyxJQUFJLENBQUMsaUJBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGlCQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7Z0JBQzlDLE1BQU0sSUFBSSxLQUFLLENBQUMsK0dBQTZHLE9BQU8sR0FBRyxXQUFNLE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFHLENBQUM7YUFDcEs7WUFDRCxhQUFhLElBQUksYUFBVyxHQUFHLFNBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFJLENBQUM7U0FDcEQ7UUFDRCxPQUFPLGFBQWEsQ0FBQztJQUN0QixDQUFDO0lBRU8sZ0NBQVcsR0FBbkIsVUFBb0IsWUFBeUIsRUFBRSxXQUFtQjtRQUMzRCxTQUFrRCxJQUFJLEVBQXBELEVBQUUsVUFBRSxjQUFjLHNCQUFFLGFBQWEscUJBQUUsUUFBUSxjQUFTLENBQUM7UUFDN0Qsb0JBQW9CO1FBQ3BCLElBQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUNuQyxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2IsYUFBYSxDQUFDLGdDQUE4QixJQUFJLE1BQUcsQ0FBQyxDQUFDO1lBQ3JELE9BQU87U0FDUDtRQUNELHdDQUF3QztRQUN4QyxFQUFFLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxjQUFjLENBQUMsQ0FBQztRQUN6QyxFQUFFLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQztRQUN2QyxvQkFBb0I7UUFDcEIsRUFBRSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN4QixzQkFBc0I7UUFDdEIsSUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDaEUsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNiLHNDQUFzQztZQUN0QyxhQUFhLENBQUMsZUFBWSxJQUFJLDJCQUFxQixFQUFFLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFHLENBQUMsQ0FBQztZQUNwRixPQUFPO1NBQ1A7UUFDRCw2RkFBNkY7UUFDN0YsSUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMzQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUM3QyxJQUFNLFdBQVcsR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEMsSUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQzlCLFNBQUssR0FBVyxPQUFPLE1BQWxCLEVBQUUsSUFBSSxHQUFLLE9BQU8sS0FBWixDQUFhO1lBQ2hDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDdkU7UUFDRCxPQUFPLE9BQU8sQ0FBQztJQUNoQixDQUFDO0lBRU8sdUNBQWtCLEdBQTFCLFVBQTJCLElBQW1CO1FBQzdDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7WUFBRSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUMsaUJBQWEsR0FBSyxJQUFJLGNBQVQsQ0FBVTtRQUMvQixJQUFNLFlBQVksR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekMsSUFBSSxZQUFZLENBQUMsTUFBTSxLQUFLLFNBQVMsRUFBRTtZQUNoQyxTQUE0QixJQUFJLEVBQTlCLEVBQUUsVUFBRSxNQUFJLFlBQUUsV0FBVyxpQkFBUyxDQUFDO1lBQ3ZDLHdCQUF3QjtZQUN4QixJQUFJLGtCQUFrQixHQUFHLFdBQVcsS0FBSyxpQkFBSyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDO1lBQ3pGLElBQUksa0JBQWtCLEtBQUssRUFBRSxFQUFFO2dCQUM5QixNQUFNLElBQUksS0FBSyxDQUFDLGlDQUErQixJQUFJLENBQUMsSUFBSSxXQUFNLE1BQU0sQ0FBQzthQUNyRTtZQUNELElBQUksWUFBWSxDQUFDLE9BQU8sRUFBRTtnQkFDekIsa0JBQWtCLEdBQUcsVUFBVSxDQUFDLHNCQUFzQixDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsR0FBRyxrQkFBa0IsQ0FBQzthQUNsRztZQUNELElBQU0sTUFBTSxHQUFHLHFCQUFhLENBQUMsRUFBRSxFQUFFLGFBQWEsRUFBRSxrQkFBa0IsRUFBRSxFQUFFLENBQUMsYUFBYSxFQUFFLE1BQUksQ0FBQyxDQUFDO1lBQzVGLElBQUksQ0FBQyxNQUFNLEVBQUU7Z0JBQ1osYUFBYSxDQUFDLDJEQUF3RCxNQUFJLFFBQUksQ0FBQyxDQUFDO2dCQUNoRixPQUFPO2FBQ1A7WUFDRCxZQUFZLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztTQUM3QjtRQUNELElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO1FBQzVFLElBQUksT0FBTyxLQUFLLFNBQVMsRUFBRTtZQUMxQixhQUFhLENBQUMsOEJBQTJCLElBQUksUUFBSSxDQUFDLENBQUM7WUFDbkQsT0FBTztTQUNQO1FBQ0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUM7UUFDOUIsT0FBTyxPQUFPLENBQUM7SUFDaEIsQ0FBQztJQUVELHNCQUFJLHNDQUFjO2FBQWxCO1lBQ0MsT0FBTyxJQUFJLENBQUMsa0JBQWtCLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUN0RCxDQUFDOzs7T0FBQTtJQUVELHNCQUFJLDRDQUFvQjthQUF4QjtZQUNDLE9BQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFDLHlCQUF5QixDQUFDLENBQUM7UUFDM0QsQ0FBQzs7O09BQUE7SUFFRCxzQkFBSSxnREFBd0I7YUFBNUI7WUFDQyxPQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1FBQy9ELENBQUM7OztPQUFBO0lBRUQsc0JBQUksa0RBQTBCO2FBQTlCO1lBQ0MsT0FBTyxJQUFJLENBQUMsa0JBQWtCLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztRQUNsRSxDQUFDOzs7T0FBQTtJQUVELHNCQUFJLHNDQUFjO2FBQWxCO1lBQ0MsT0FBTyxJQUFJLENBQUMsa0JBQWtCLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUN0RCxDQUFDOzs7T0FBQTtJQUVELHNCQUFJLDhDQUFzQjthQUExQjtZQUNDLE9BQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFDLDhCQUE4QixDQUFDLENBQUM7UUFDaEUsQ0FBQzs7O09BQUE7SUFFRCxzQkFBSSxtREFBMkI7YUFBL0I7WUFDQyxPQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO1FBQ3RFLENBQUM7OztPQUFBO0lBRUQsc0JBQUksNkNBQXFCO2FBQXpCO1lBQ0MsT0FBTyxJQUFJLENBQUMsa0JBQWtCLENBQUMsNkJBQTZCLENBQUMsQ0FBQztRQUMvRCxDQUFDOzs7T0FBQTtJQUVPLHdDQUFtQixHQUEzQixVQUNDLEtBQXdCLEVBQ3hCLFFBQXlCO1FBRXpCLElBQUksUUFBUSxLQUFLLGlCQUFLLEVBQUU7WUFDdkIsMkNBQTJDO1lBQzNDLElBQUksZ0JBQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDbkIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFJLEtBQWtCLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUNwRCxJQUFJLENBQUMsaUJBQVEsQ0FBRSxLQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7d0JBQ3RDLE1BQU0sSUFBSSxLQUFLLENBQUMsNEJBQTBCLEtBQUssdUJBQWlCLElBQUksQ0FBQyxJQUFJLGlEQUE2QyxDQUFDLENBQUM7cUJBQ3hIO2lCQUNEO2FBQ0Q7aUJBQU07Z0JBQ04sSUFBSSxDQUFDLGlCQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7b0JBQ3JCLE1BQU0sSUFBSSxLQUFLLENBQUMsNEJBQTBCLEtBQUssdUJBQWlCLElBQUksQ0FBQyxJQUFJLGlEQUE2QyxDQUFDLENBQUM7aUJBQ3hIO2FBQ0Q7WUFDRCxJQUFJLENBQUMsZ0JBQU8sQ0FBQyxLQUFLLENBQUMsSUFBSyxLQUFrQixDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7Z0JBQ3hELE9BQU8sNEJBQWdCLENBQUM7YUFDeEI7WUFDRCxJQUFLLEtBQWtCLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtnQkFDckMsT0FBTyw0QkFBZ0IsQ0FBQzthQUN4QjtZQUNELElBQUssS0FBa0IsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUNyQyxPQUFPLDRCQUFnQixDQUFDO2FBQ3hCO1lBQ0QsSUFBSyxLQUFrQixDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7Z0JBQ3JDLE9BQU8sNEJBQWdCLENBQUM7YUFDeEI7WUFDRCxNQUFNLElBQUksS0FBSyxDQUFDLDRCQUEwQixLQUFLLHVCQUFpQixJQUFJLENBQUMsSUFBSSxpREFBNkMsQ0FBQyxDQUFDO1NBQ3hIO2FBQU0sSUFBSSxRQUFRLEtBQUssZUFBRyxFQUFFO1lBQzVCLHlDQUF5QztZQUN6QyxJQUFJLGdCQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQ25CLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBSSxLQUFrQixDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDcEQsSUFBSSxDQUFDLGtCQUFTLENBQUUsS0FBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO3dCQUN2QyxNQUFNLElBQUksS0FBSyxDQUFDLDRCQUEwQixLQUFLLHVCQUFpQixJQUFJLENBQUMsSUFBSSw2Q0FBeUMsQ0FBQyxDQUFDO3FCQUNwSDtpQkFDRDthQUNEO2lCQUFNO2dCQUNOLElBQUksQ0FBQyxrQkFBUyxDQUFDLEtBQUssQ0FBQyxFQUFFO29CQUN0QixNQUFNLElBQUksS0FBSyxDQUFDLDRCQUEwQixLQUFLLHVCQUFpQixJQUFJLENBQUMsSUFBSSw2Q0FBeUMsQ0FBQyxDQUFDO2lCQUNwSDthQUNEO1lBQ0QsSUFBSSxDQUFDLGdCQUFPLENBQUMsS0FBSyxDQUFDLElBQUssS0FBa0IsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUN4RCxPQUFPLDBCQUFjLENBQUM7YUFDdEI7WUFDRCxJQUFLLEtBQWtCLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtnQkFDckMsT0FBTywwQkFBYyxDQUFDO2FBQ3RCO1lBQ0QsSUFBSyxLQUFrQixDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7Z0JBQ3JDLE9BQU8sMEJBQWMsQ0FBQzthQUN0QjtZQUNELElBQUssS0FBa0IsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUNyQyxPQUFPLDBCQUFjLENBQUM7YUFDdEI7WUFDRCxNQUFNLElBQUksS0FBSyxDQUFDLDRCQUEwQixLQUFLLHVCQUFpQixJQUFJLENBQUMsSUFBSSw2Q0FBeUMsQ0FBQyxDQUFDO1NBQ3BIO2FBQU07WUFDTixNQUFNLElBQUksS0FBSyxDQUFDLGdDQUE4QixRQUFRLHVCQUFpQixJQUFJLENBQUMsSUFBSSxxQkFBZSxpQkFBSyxZQUFPLGVBQUcsTUFBRyxDQUFDLENBQUM7U0FDbkg7SUFDRixDQUFDO0lBRU8sc0NBQWlCLEdBQXpCLFVBQ0MsT0FBcUIsRUFDckIsV0FBbUIsRUFDbkIsV0FBbUIsRUFDbkIsS0FBdUIsRUFDdkIsSUFBaUI7O1FBRVgsU0FBa0MsSUFBSSxFQUFwQyxFQUFFLFVBQUUsUUFBUSxnQkFBRSxhQUFhLG1CQUFTLENBQUM7UUFDN0Msc0JBQXNCO1FBQ3RCLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFdkIsSUFBSSxRQUFRLFNBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQywwQ0FBRSxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDNUQsOENBQThDO1FBQzlDLElBQUksUUFBUSxLQUFLLFNBQVMsRUFBRTtZQUMzQixJQUFNLFNBQVMsR0FBRyxFQUFFLENBQUMsa0JBQWtCLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQzlELElBQUksQ0FBQyxTQUFTLEVBQUU7Z0JBQ2YsYUFBYSxDQUFDLDhCQUEyQixXQUFXLHlCQUFrQixJQUFJLENBQUMsSUFBSSxpS0FFeEIsSUFBSSx1QkFDakQsRUFBRSxDQUFDLFFBQVEsRUFBRSxNQUFHLENBQUMsQ0FBQztnQkFDNUIsT0FBTzthQUNQO1lBQ0QsUUFBUSxHQUFHLFNBQVMsQ0FBQztZQUNyQixnQ0FBZ0M7WUFDaEMsSUFBSSxRQUFRLENBQUMsV0FBVyxDQUFDLEVBQUU7Z0JBQzFCLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEdBQUcsUUFBUSxDQUFDO2FBQ3ZEO1NBQ0Q7UUFFRCxlQUFlO1FBQ2YsaUZBQWlGO1FBQ2pGLFFBQVEsSUFBSSxFQUFFO1lBQ2IsS0FBSyw0QkFBZ0I7Z0JBQ3BCLEVBQUUsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLEtBQWUsQ0FBQyxDQUFDO2dCQUN4QyxNQUFNO1lBQ1AsS0FBSyw0QkFBZ0I7Z0JBQ3BCLEVBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLEtBQWlCLENBQUMsQ0FBQztnQkFDM0MsTUFBTTtZQUNQLEtBQUssNEJBQWdCO2dCQUNwQixFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxLQUFpQixDQUFDLENBQUM7Z0JBQzNDLE1BQU07WUFDUCxLQUFLLDRCQUFnQjtnQkFDcEIsRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsS0FBaUIsQ0FBQyxDQUFDO2dCQUMzQyxNQUFNO1lBQ1AsS0FBSywwQkFBYztnQkFDbEIsRUFBRSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsS0FBZSxDQUFDLENBQUM7Z0JBQ3hDLE1BQU07WUFDUCxLQUFLLDBCQUFjO2dCQUNsQixFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxLQUFpQixDQUFDLENBQUM7Z0JBQzNDLE1BQU07WUFDUCxLQUFLLDBCQUFjO2dCQUNsQixFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxLQUFpQixDQUFDLENBQUM7Z0JBQzNDLE1BQU07WUFDUCxLQUFLLDBCQUFjO2dCQUNsQixFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxLQUFpQixDQUFDLENBQUM7Z0JBQzNDLE1BQU07WUFDUDtnQkFDQyxNQUFNLElBQUksS0FBSyxDQUFDLDBCQUF3QixJQUFJLDBCQUFvQixJQUFJLENBQUMsSUFBSSxRQUFJLENBQUMsQ0FBQztTQUNoRjtJQUNGLENBQUM7SUFFRCwrQkFBVSxHQUFWLFVBQ0MsV0FBbUIsRUFDbkIsS0FBdUIsRUFDdkIsUUFBMEI7O1FBRXBCLFNBQXlCLElBQUksRUFBM0IsUUFBUSxnQkFBRSxRQUFRLGNBQVMsQ0FBQztRQUVwQyxJQUFJLElBQUksU0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDLDBDQUFFLElBQUksQ0FBQztRQUN2QyxJQUFJLFFBQVEsRUFBRTtZQUNiLElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDNUQsSUFBSSxJQUFJLEtBQUssU0FBUztnQkFBRSxJQUFJLEdBQUcsU0FBUyxDQUFDO2lCQUNwQztnQkFDSiwwSEFBMEg7Z0JBQzFILGlEQUFpRDtnQkFDakQsSUFBSSxJQUFJLEtBQUssU0FBUyxFQUFFO29CQUN2QixNQUFNLElBQUksS0FBSyxDQUFDLGVBQVksV0FBVyw0QkFBcUIsSUFBSSxDQUFDLElBQUksbUNBQTZCLElBQUksaUJBQVksU0FBUyxNQUFHLENBQUMsQ0FBQztpQkFDaEk7YUFDRDtTQUNEO1FBQ0QsSUFBSSxJQUFJLEtBQUssU0FBUyxFQUFFO1lBQ3ZCLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0NBQTZCLFdBQVcscUZBQWlGLENBQUMsQ0FBQztTQUMzSTtRQUVELElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEVBQUU7WUFDM0IsMEJBQTBCO1lBQzFCLFFBQVEsQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLElBQUksUUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEtBQUssU0FBRSxDQUFDO1NBQ3REO2FBQU07WUFDTixnQkFBZ0I7WUFDaEIsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7U0FDcEM7UUFFRCw4QkFBOEI7UUFDOUIsSUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNuQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNyQyxJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFrQixDQUFDO1lBQzdDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFFLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDdEY7SUFDRixDQUFDO0lBQUEsQ0FBQztJQUVGLHFDQUFnQixHQUFoQixVQUNDLE9BQXFCLEVBQ3JCLFdBQW1CLEVBQ25CLEtBQXVCLEVBQ3ZCLFFBQXlCO1FBSjFCLGlCQWVDO1FBVEEsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztRQUN2RCxJQUFJLE9BQU8sS0FBSyxTQUFTLEVBQUU7WUFDMUIsTUFBTSxJQUFJLEtBQUssQ0FBQyxxRUFBcUUsQ0FBQyxDQUFDO1NBQ3ZGO1FBQ0QsSUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQUcsSUFBSSxZQUFJLENBQUMsUUFBUSxDQUFDLEdBQW9CLENBQUMsS0FBSyxPQUFPLEVBQS9DLENBQStDLENBQUMsQ0FBQztRQUM1RyxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ2pCLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0VBQTZELElBQUksQ0FBQyxJQUFJLFFBQUksQ0FBQyxDQUFDO1NBQzVGO1FBQ0QsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN4RSxDQUFDO0lBRUQsNEJBQU8sR0FBUDtRQUFBLGlCQW9CQztRQW5CTSxTQUFtQyxJQUFJLEVBQXJDLEVBQUUsVUFBRSxjQUFjLHNCQUFFLFFBQVEsY0FBUyxDQUFDO1FBQzlDLHNDQUFzQztRQUN0QyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxpQkFBTztZQUN0QyxFQUFFLENBQUMsYUFBYSxDQUFDLE9BQVEsQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQUc7WUFDckMsT0FBTyxLQUFJLENBQUMsUUFBUSxDQUFDLEdBQW9CLENBQUMsQ0FBQztRQUM1QyxDQUFDLENBQUMsQ0FBQztRQUVILDJGQUEyRjtRQUMzRixtRUFBbUU7UUFDbkUsRUFBRSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNoQyxhQUFhO1FBQ2IsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDO1FBRTNCLGFBQWE7UUFDYixPQUFPLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDZixhQUFhO1FBQ2IsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDO0lBQzNCLENBQUM7SUFDRixpQkFBQztBQUFELENBQUM7QUFsWFksZ0NBQVU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDaEZ2Qiw0R0FBb0M7QUFDcEMsYUFBYTtBQUNiLGlHQUEwQztBQUMxQywrRUFBd0M7QUFDeEMsK0VBSXFCO0FBQ3JCLGtGQUEwQztBQUUxQyxpRkFBeUM7QUFDekMsbUVBQXlFO0FBQ3pFLG9IQUFrRDtBQUNsRCxzRUFHb0c7QUFFcEcsSUFBTSwyQkFBMkIsR0FBRyxFQUFFLENBQUMsc0RBQXFEO0FBSTVGO0lBcURDLHNCQUNDLE1BS0M7SUFDRCxrR0FBa0c7SUFDbEcseUVBQXlFO0lBQ3pFLGFBQWdGLEVBQ2hGLFFBQXdCO1FBRHhCLDBEQUFnQyxPQUFlLElBQU8sTUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBQyxDQUFDO1FBdkR6RSxlQUFVLEdBQUcsS0FBSyxDQUFDO1FBVTNCLDRGQUE0RjtRQUNwRiwyQkFBc0IsR0FBbUMsRUFBRSxDQUFDO1FBK0NuRSxnQkFBZ0I7UUFDaEIsSUFBTSxTQUFTLEdBQUcsQ0FBQyxRQUFRLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUNwRSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFHO1lBQzlCLElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQy9CLE1BQU0sSUFBSSxLQUFLLENBQUMsaUJBQWUsR0FBRyw2REFBd0QsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBRyxDQUFDLENBQUM7YUFDbkg7UUFDRixDQUFDLENBQUMsQ0FBQztRQUNILDhDQUE4QztRQUM5QyxJQUFNLElBQUksR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxVQUFDLE9BQWU7WUFDcEMsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUNwQixPQUFPO2FBQ1A7WUFDRCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztZQUN2QixhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDeEIsQ0FBQztRQUVPLFVBQU0sR0FBSyxNQUFNLE9BQVgsQ0FBWTtRQUMxQixJQUFJLEVBQUUsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO1FBRXhCLFdBQVc7UUFDWCxJQUFJLENBQUMsRUFBRSxFQUFFO1lBQ1IsSUFBTSxPQUFPLEdBQVEsRUFBRSxDQUFDO1lBQ3hCLElBQUksTUFBTSxDQUFDLFNBQVMsS0FBSyxTQUFTO2dCQUFFLE9BQU8sQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQztZQUN6RSxzQ0FBc0M7WUFDdEMsRUFBRSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBbUM7bUJBQ3ZFLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBa0M7bUJBQ3BFLE1BQU0sQ0FBQyxVQUFVLENBQUMsb0JBQW9CLEVBQUUsT0FBTyxDQUFrQyxDQUFDO1lBQ3RGLElBQUksRUFBRSxLQUFLLElBQUksRUFBRTtnQkFDaEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO2dCQUMxRCxPQUFPO2FBQ1A7U0FDRDtRQUNELElBQUksZ0JBQVEsQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUNqQixPQUFPLENBQUMsR0FBRyxDQUFDLDBCQUEwQixDQUFDLENBQUM7U0FDeEM7YUFBTTtZQUNOLE9BQU8sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLENBQUMsQ0FBQztTQUN4QztRQUNELElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ2IsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFFekIscUNBQXFDO1FBQ3JDLElBQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxXQUFXLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxpQkFBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDO1FBQ2xGLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1FBQy9CLElBQUksQ0FBQyxnQkFBUSxDQUFDLEVBQUUsQ0FBQyxJQUFJLFdBQVcsS0FBSyxpQkFBSyxFQUFFO1lBQzNDLE9BQU8sQ0FBQyxJQUFJLENBQUMsaURBQWlELENBQUMsQ0FBQztTQUNoRTtRQUVELFlBQVk7UUFDWixrQ0FBa0M7UUFDbEMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDMUIsNkVBQTZFO1FBQzdFLHlHQUF5RztRQUN6RyxFQUFFLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN2QyxvSEFBb0g7UUFDcEgsa0hBQWtIO1FBQ2xILGdHQUFnRztRQUNoRywySEFBMkg7UUFDM0gsd0hBQXdIO1FBQ3hILHNIQUFzSDtRQUN0SCxrSEFBa0g7UUFDbEgsMkRBQTJEO1FBRTNELDREQUE0RDtRQUM1RCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztZQUN4QyxJQUFJLEVBQUUsV0FBVztZQUNqQixjQUFjLEVBQUUsV0FBVyxLQUFLLGlCQUFLLENBQUMsQ0FBQyxDQUFDLG1CQUFPLENBQUMsZ0ZBQW1DLENBQUMsQ0FBQyxDQUFDLENBQUMsbUJBQU8sQ0FBQyxzRUFBOEIsQ0FBQztZQUM5SCxRQUFRLEVBQUU7Z0JBQ1I7b0JBQ0MsSUFBSSxFQUFFLFNBQVM7b0JBQ2YsS0FBSyxFQUFFLENBQUM7b0JBQ1IsUUFBUSxFQUFFLGVBQUc7aUJBQ2I7YUFDRDtTQUNELENBQ0QsQ0FBQztRQUNGLElBQUksV0FBVyxLQUFLLGlCQUFLLEVBQUU7WUFDMUIsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO2dCQUN0QyxJQUFJLEVBQUUsU0FBUztnQkFDZixjQUFjLEVBQUUsbUJBQU8sQ0FBQyw0RUFBaUMsQ0FBQztnQkFDMUQsUUFBUSxFQUFFO29CQUNSO3dCQUNDLElBQUksRUFBRSxTQUFTO3dCQUNmLEtBQUssRUFBRSxDQUFDO3dCQUNSLFFBQVEsRUFBRSxlQUFHO3FCQUNiO2lCQUNEO2FBQ0QsQ0FDRCxDQUFDO1lBQ0YsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO2dCQUN2QyxJQUFJLEVBQUUsVUFBVTtnQkFDaEIsY0FBYyxFQUFFLG1CQUFPLENBQUMsOEVBQWtDLENBQUM7Z0JBQzNELFFBQVEsRUFBRTtvQkFDUjt3QkFDQyxJQUFJLEVBQUUsU0FBUzt3QkFDZixLQUFLLEVBQUUsQ0FBQzt3QkFDUixRQUFRLEVBQUUsZUFBRztxQkFDYjtpQkFDRDthQUNELENBQ0QsQ0FBQztTQUNGO2FBQU07WUFDTixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztZQUM1QyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztTQUM3QztRQUVELHdCQUF3QjtRQUN4QixFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFckMsZ0JBQWdCO1FBQ2hCLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFdEIsb0NBQW9DO1FBQ3BDLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1FBQzVFLE9BQU8sQ0FBQyxHQUFHLENBQUksSUFBSSxDQUFDLGNBQWMsbUJBQWdCLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBakpNLGtDQUFxQixHQUE1QixVQUNDLFFBQXVCLEVBQ3ZCLE1BRUMsRUFDRCxhQUE2QjtRQUU3QixPQUFPLElBQUksWUFBWSxZQUVyQixNQUFNLEVBQUUsUUFBUSxDQUFDLFVBQVUsRUFDM0IsT0FBTyxFQUFFLFFBQVEsQ0FBQyxVQUFVLEVBQUUsSUFDM0IsTUFBTSxHQUVWLGFBQWEsRUFDYixRQUFRLENBQ1IsQ0FBQztJQUNILENBQUM7SUFtSUQsc0JBQVksNENBQWtCO2FBQTlCO1lBQ0MsSUFBSSxJQUFJLENBQUMsbUJBQW1CLEtBQUssU0FBUyxFQUFFO2dCQUMzQyxJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO29CQUNoQyxJQUFJLEVBQUUsYUFBYTtvQkFDbkIsY0FBYyxFQUFFLElBQUksQ0FBQyxXQUFXLEtBQUssaUJBQUssQ0FBQyxDQUFDLENBQUMsbUJBQU8sQ0FBQyxvRkFBcUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxtQkFBTyxDQUFDLG9GQUFxQyxDQUFDO2lCQUM1SSxDQUFDLENBQUM7Z0JBQ0gsSUFBSSxDQUFDLG1CQUFtQixHQUFHLE9BQU8sQ0FBQzthQUNuQztZQUNELE9BQU8sSUFBSSxDQUFDLG1CQUFtQixDQUFDO1FBQ2pDLENBQUM7OztPQUFBO0lBRUQsc0JBQVkseURBQStCO2FBQTNDO1lBQ0MsSUFBSSxJQUFJLENBQUMsZ0NBQWdDLEtBQUssU0FBUyxFQUFFO2dCQUN4RCxJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO29CQUNoQyxJQUFJLEVBQUUsMEJBQTBCO29CQUNoQyxjQUFjLEVBQUUsSUFBSSxDQUFDLFdBQVcsS0FBSyxpQkFBSyxDQUFDLENBQUMsQ0FBQyxtQkFBTyxDQUFDLDhHQUFrRCxDQUFDLENBQUMsQ0FBQyxDQUFDLG1CQUFPLENBQUMsOEdBQWtELENBQUM7aUJBQ3RLLENBQUMsQ0FBQztnQkFDSCxJQUFJLENBQUMsZ0NBQWdDLEdBQUcsT0FBTyxDQUFDO2FBQ2hEO1lBQ0QsT0FBTyxJQUFJLENBQUMsZ0NBQWdDLENBQUM7UUFDOUMsQ0FBQzs7O09BQUE7SUFFRCwrQkFBUSxHQUFSO1FBQ0MsT0FBTyxnQkFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBRUQsc0JBQVksNkNBQW1CO2FBQS9CO1lBQ0MsSUFBSSxJQUFJLENBQUMsb0JBQW9CLEtBQUssU0FBUyxFQUFFO2dCQUM1QyxJQUFNLGVBQWUsR0FBRyxJQUFJLFlBQVksQ0FBQyxDQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBRSxDQUFDLENBQUM7Z0JBQ3pFLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxDQUFFLENBQUM7YUFDcEU7WUFDRCxPQUFPLElBQUksQ0FBQyxvQkFBcUIsQ0FBQztRQUNuQyxDQUFDOzs7T0FBQTtJQUVELHNCQUFZLGlEQUF1QjthQUFuQztZQUNDLElBQUksSUFBSSxDQUFDLHdCQUF3QixLQUFLLFNBQVMsRUFBRTtnQkFDaEQsSUFBTSxpQkFBaUIsR0FBRyxJQUFJLFlBQVksQ0FBQyxDQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBRSxDQUFDLENBQUM7Z0JBQ25GLElBQUksQ0FBQyx3QkFBd0IsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsaUJBQWlCLENBQUUsQ0FBQzthQUMxRTtZQUNELE9BQU8sSUFBSSxDQUFDLHdCQUF5QixDQUFDO1FBQ3ZDLENBQUM7OztPQUFBO0lBRU8sK0NBQXdCLEdBQWhDLFVBQWlDLFdBQW1CO1FBQ25ELElBQUksSUFBSSxDQUFDLHNCQUFzQixDQUFDLFdBQVcsQ0FBQyxJQUFJLFNBQVMsRUFBRTtZQUMxRCxJQUFNLGdCQUFnQixHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxXQUFXLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3RDLGdCQUFnQixDQUFDLElBQUksQ0FDcEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsV0FBVyxDQUFDLEVBQ3ZDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUN2QyxDQUFDO2FBQ0Y7WUFDRCxJQUFNLGVBQWUsR0FBRyxJQUFJLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQzNELElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUUsQ0FBQztZQUN2RCxJQUFJLENBQUMsc0JBQXNCLENBQUMsV0FBVyxDQUFDLEdBQUcsTUFBTSxDQUFDO1NBQ2xEO1FBQ0QsT0FBTyxJQUFJLENBQUMsc0JBQXNCLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVPLHVDQUFnQixHQUF4QixVQUNDLElBQWtCO1FBRVosU0FBd0IsSUFBSSxFQUExQixhQUFhLHFCQUFFLEVBQUUsUUFBUyxDQUFDO1FBQ25DLElBQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNqQyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ1osYUFBYSxDQUFDLCtCQUErQixDQUFDLENBQUM7WUFDL0MsT0FBTztTQUNQO1FBQ0QsRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZDLG1CQUFtQjtRQUNuQixFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNyRCxPQUFPLE1BQU0sQ0FBQztJQUNmLENBQUM7SUFFRCxrQ0FBVyxHQUFYLFVBQ0MsTUFXQztRQUVELGdCQUFnQjtRQUNoQixJQUFNLFNBQVMsR0FBRyxDQUFDLE1BQU0sRUFBRSxnQkFBZ0IsRUFBRSxVQUFVLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDcEUsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBRztZQUM5QixJQUFJLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUMvQixNQUFNLElBQUksS0FBSyxDQUFDLGlCQUFlLEdBQUcsd0RBQWtELE1BQU0sQ0FBQyxJQUFJLDRCQUFzQixTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFHLENBQUMsQ0FBQzthQUM5STtRQUNGLENBQUMsQ0FBQyxDQUFDO1FBQ0csU0FBcUMsSUFBSSxFQUF2QyxFQUFFLFVBQUUsYUFBYSxxQkFBRSxXQUFXLGlCQUFTLENBQUM7UUFDaEQsT0FBTyxJQUFJLHVCQUFVLHVCQUVoQixNQUFNLEtBQ1QsRUFBRTtZQUNGLGFBQWE7WUFDYixXQUFXLGlCQUVaLENBQUM7SUFDSCxDQUFDO0lBQUEsQ0FBQztJQUVGLG9DQUFhLEdBQWIsVUFDQyxNQVdDO1FBRUQsZ0JBQWdCO1FBQ2hCLElBQU0sU0FBUyxHQUFHLENBQUMsTUFBTSxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsZUFBZSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDaEksTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBRztZQUM5QixJQUFJLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUMvQixNQUFNLElBQUksS0FBSyxDQUFDLGlCQUFlLEdBQUcsMERBQW9ELE1BQU0sQ0FBQyxJQUFJLDRCQUFzQixTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFHLENBQUMsQ0FBQzthQUNoSjtRQUNGLENBQUMsQ0FBQyxDQUFDO1FBQ0csU0FBcUMsSUFBSSxFQUF2QyxFQUFFLFVBQUUsYUFBYSxxQkFBRSxXQUFXLGlCQUFTLENBQUM7UUFDaEQsT0FBTyxJQUFJLHFCQUFTLHVCQUNoQixNQUFNLEtBQ1QsRUFBRTtZQUNGLFdBQVc7WUFDWCxhQUFhLG1CQUNaLENBQUM7SUFDSixDQUFDO0lBQUEsQ0FBQztJQUVGLGtDQUFXLEdBQVgsVUFDQyxNQVNDO1FBRUQsZ0JBQWdCO1FBQ2hCLElBQU0sU0FBUyxHQUFHLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzFGLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQUc7WUFDOUIsSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDL0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQkFBZSxHQUFHLHdEQUFrRCxNQUFNLENBQUMsSUFBSSw0QkFBc0IsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBRyxDQUFDLENBQUM7YUFDOUk7UUFDRixDQUFDLENBQUMsQ0FBQztRQUNLLE9BQUcsR0FBVyxNQUFNLElBQWpCLEVBQUUsSUFBSSxHQUFLLE1BQU0sS0FBWCxDQUFZO1FBQzdCLElBQUksQ0FBQyxpQkFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ25CLE1BQU0sSUFBSSxLQUFLLENBQUMsOEVBQTRFLEdBQUcsaUJBQVksT0FBTyxHQUFHLE1BQUcsQ0FBQztTQUN6SDtRQUNELElBQUksQ0FBQyxpQkFBUSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3BCLE1BQU0sSUFBSSxLQUFLLENBQUMsK0VBQTZFLElBQUksaUJBQVksT0FBTyxJQUFJLE1BQUcsQ0FBQztTQUM1SDtRQUVELHVDQUF1QztRQUN2QyxJQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsbUJBQU8sQ0FBQztRQUNyRSxJQUFJLENBQUMsMEJBQWlCLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDL0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxxQkFBbUIsTUFBTSx5QkFBbUIsSUFBSSxvQkFBYyx5QkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQUcsQ0FBQyxDQUFDO1NBQzlHO1FBRUQsNENBQTRDO1FBQzVDLElBQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyx5QkFBYSxDQUFDO1FBQ3hFLElBQUksQ0FBQyx3QkFBZSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzVCLE1BQU0sSUFBSSxLQUFLLENBQUMsb0JBQWtCLEtBQUsseUJBQW1CLElBQUksb0JBQWMsdUJBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQUcsQ0FBQyxDQUFDO1NBQzFHO1FBQ0QsSUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLHlCQUFhLENBQUM7UUFDeEUsSUFBSSxDQUFDLHdCQUFlLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDNUIsTUFBTSxJQUFJLEtBQUssQ0FBQyxvQkFBa0IsS0FBSyx5QkFBbUIsSUFBSSxvQkFBYyx1QkFBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBRyxDQUFDLENBQUM7U0FDMUc7UUFFRCwwQ0FBMEM7UUFDMUMsSUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLGdCQUFJLENBQUM7UUFDbEUsSUFBSSxDQUFDLGlDQUF3QixDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ3RDLE1BQU0sSUFBSSxLQUFLLENBQUMscUJBQW1CLE1BQU0seUJBQW1CLElBQUksb0JBQWMsZ0NBQXVCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFHLENBQUMsQ0FBQztTQUNySDtRQUVELGlEQUFpRDtRQUNqRCxJQUFNLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMseUJBQWEsQ0FBQztRQUNyRSxJQUFJLENBQUMsK0JBQXNCLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDbEMsTUFBTSxJQUFJLEtBQUssQ0FBQyxtQkFBaUIsSUFBSSx5QkFBbUIsSUFBSSxvQkFBYyw4QkFBcUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQUcsQ0FBQyxDQUFDO1NBQy9HO1FBRUssU0FBd0IsSUFBSSxFQUExQixFQUFFLFVBQUUsYUFBYSxtQkFBUyxDQUFDO1FBQ25DLElBQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUNuQyxJQUFJLE9BQU8sS0FBSyxJQUFJLEVBQUU7WUFDckIsTUFBTSxJQUFJLEtBQUssQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO1NBQzdDO1FBQ0QsRUFBRSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZDLHlEQUF5RDtRQUN6RCxpREFBaUQ7UUFDakQseURBQXlEO1FBQ3pELDhEQUE4RDtRQUM5RCwyREFBMkQ7UUFDM0QsSUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLElBQU0sY0FBYyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUM7UUFDL0IsSUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLElBQU0sTUFBTSxHQUFHLENBQUMsQ0FBQztRQUNqQixJQUFNLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDakIsSUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzdCLElBQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6QixJQUFNLEtBQUssR0FBRyxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0MsRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLEtBQUssRUFBRSxjQUFjLEVBQ2pELEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFbkQsSUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQztRQUMxQixLQUFLLENBQUMsTUFBTSxHQUFHO1lBQ2QsRUFBRSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ3ZDLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUUsY0FBYyxFQUNqRCxTQUFTLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBRTVCLDBEQUEwRDtZQUMxRCxzREFBc0Q7WUFDdEQsaUNBQWlDO1lBQ2pDLElBQUksa0JBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksa0JBQVUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQ3hELDRDQUE0QztnQkFDNUMsb0NBQW9DO2FBQ3BDO2lCQUFNO2dCQUNOLGtDQUFrQztnQkFDbEMsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFXLElBQUkscUJBQWdCLEtBQUssQ0FBQyxLQUFLLFVBQUssS0FBSyxDQUFDLE1BQU0sMEJBQXVCLENBQUMsQ0FBQztnQkFDakcsc0RBQXNEO2dCQUN0RCwrQkFBK0I7Z0JBQy9CLHdFQUF3RTtnQkFDeEUsd0VBQXdFO2FBQ3hFO1lBQ0QsRUFBRSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxjQUFjLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDOUQsRUFBRSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxjQUFjLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDOUQsRUFBRSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNuRSxFQUFFLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLGtCQUFrQixFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBRW5FLG9DQUFvQztZQUNwQyxJQUFJLE1BQU0sQ0FBQyxNQUFNO2dCQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDM0MsQ0FBQyxDQUFDO1FBQ0YsS0FBSyxDQUFDLE9BQU8sR0FBRyxVQUFDLENBQUM7WUFDakIsYUFBYSxDQUFDLHlCQUF1QixJQUFJLFVBQUssQ0FBRyxDQUFDLENBQUM7UUFDcEQsQ0FBQztRQUNELEtBQUssQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBRWhCLE9BQU8sT0FBTyxDQUFDO0lBQ2hCLENBQUM7SUFFRCwrQkFBUSxHQUFSLFVBQVMsTUFBeUI7UUFDakMsSUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQztRQUNqQyxJQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDO1FBQ25DLGlDQUFpQztRQUNqQyw4RkFBOEY7UUFDOUYsTUFBTSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDckIsTUFBTSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDdkIsbUJBQW1CO1FBQ25CLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ3RCLENBQUM7SUFBQSxDQUFDO0lBRU0sZ0NBQVMsR0FBakIsVUFDQyxPQUFxQixFQUNyQixnQkFBeUIsRUFDekIsS0FBK0QsRUFDL0QsTUFBa0I7UUFFVixNQUFFLEdBQUssSUFBSSxHQUFULENBQVU7UUFDcEIscUNBQXFDO1FBQ3JDLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDYixPQUFPO1NBQ1A7UUFFRCwyREFBMkQ7UUFFM0QsMENBQTBDO1FBQzFDLHVGQUF1RjtRQUN2RixJQUFNLGFBQWEsR0FBbUIsRUFBRSxDQUFDO1FBQ3pDLElBQUksS0FBSyxFQUFFO1lBQ1YsSUFBSSxLQUFLLENBQUMsV0FBVyxLQUFLLFlBQVksRUFBRTtnQkFDdkMsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFxQixDQUFDLENBQUM7YUFDMUM7aUJBQU0sSUFBSSxLQUFLLENBQUMsV0FBVyxLQUFLLHFCQUFTLEVBQUU7Z0JBQzNDLGFBQWEsQ0FBQyxJQUFJLENBQUUsS0FBbUIsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDLENBQUM7YUFDbEU7aUJBQU07Z0JBQ04sS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFJLEtBQXNDLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUN4RSxJQUFNLEtBQUssR0FBSSxLQUFzQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN6RCxhQUFhO29CQUNiLGFBQWEsQ0FBQyxJQUFJLENBQUUsS0FBbUIsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUUsS0FBbUIsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFxQixDQUFDO2lCQUN2STthQUNEO1NBQ0Q7UUFFRCwwQkFBMEI7UUFDMUIsd0NBQXdDO1FBQ3hDLElBQUksQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRXJELHVCQUF1QjtRQUN2QixFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXZCLHNCQUFzQjtRQUN0QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUM5QyxFQUFFLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDbEMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2hEO0lBQ0YsQ0FBQztJQUVELHlDQUFrQixHQUFsQixVQUFtQixJQUFtQjtRQUNyQyxRQUFRLElBQUksRUFBRTtZQUNiLEtBQUssc0JBQVUsQ0FBQztZQUNoQixLQUFLLGlCQUFLO2dCQUNULE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDO1lBQzlCLEtBQUsseUJBQWEsQ0FBQztZQUNuQixLQUFLLDBCQUFjLENBQUM7WUFDcEIsS0FBSyx3QkFBWTtnQkFDaEIsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDO1lBQzdCLEtBQUssZ0JBQUksQ0FBQztZQUNWLEtBQUssaUJBQUssQ0FBQztZQUNYLEtBQUssZUFBRztnQkFDUCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUM7WUFDNUI7Z0JBQ0MsTUFBTSxJQUFJLEtBQUssQ0FBQyxtQkFBaUIsSUFBSSxnREFBNkMsQ0FBQyxDQUFDO1NBQ3JGO0lBQ0YsQ0FBQztJQUVPLG1DQUFZLEdBQXBCLFVBQXFCLGdCQUEwQjtRQUN0QyxNQUFFLEdBQUssSUFBSSxHQUFULENBQVU7UUFDcEIsSUFBSSxnQkFBZ0IsRUFBRTtZQUNyQixFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNwQixFQUFFLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLG1CQUFtQixDQUFDLENBQUM7U0FDbkQ7SUFDRixDQUFDO0lBRU8sdUNBQWdCLEdBQXhCLFVBQ0MsS0FBZ0IsRUFDaEIsS0FBZ0U7UUFFaEUsdUNBQXVDO1FBQ3ZDLElBQUksWUFBWSxHQUFHLEtBQUssQ0FBQztRQUN6QixJQUFJLGdCQUFPLENBQUMsWUFBWSxDQUFDLEVBQUU7WUFDMUIsSUFBTSxLQUFLLEdBQUksWUFBNkMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDNUUsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFO2dCQUNiLFlBQTZDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQzNEO1NBQ0Q7YUFBTTtZQUNOLElBQUksWUFBWSxLQUFLLEtBQUssRUFBRTtnQkFDM0IsSUFBTSxRQUFRLEdBQUcsWUFBWSxDQUFDO2dCQUM5QixZQUFZLEdBQUcsRUFBRSxDQUFDO2dCQUNsQixJQUFJLFFBQVE7b0JBQUcsWUFBNkMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQzNFLFlBQTZDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQzNEO2lCQUFNO2dCQUNOLFlBQVksR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO2FBQzlCO1NBQ0Q7UUFDRCxPQUFPLFlBQTRDLENBQUM7SUFDckQsQ0FBQztJQUVPLDREQUFxQyxHQUE3QyxVQUE4QyxLQUFnQjtRQUM3RCxzREFBc0Q7UUFDdEQsSUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNoRSxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ1QsT0FBTyxFQUFFLFdBQVc7WUFDcEIsS0FBSyxFQUFFLEtBQUs7WUFDWixNQUFNLEVBQUUsS0FBSztTQUNiLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFTyxxQ0FBYyxHQUF0QixVQUNDLGdCQUF5QixFQUN6QixLQUErRCxFQUMvRCxNQUFrQjtRQUVWLE1BQUUsR0FBSyxJQUFJLEdBQVQsQ0FBVTtRQUVwQixvQkFBb0I7UUFDcEIsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNaLEVBQUUsQ0FBQyxlQUFlLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN6QyxtQkFBbUI7WUFDYixTQUFvQixJQUFJLEVBQXRCLE9BQUssYUFBRSxRQUFNLFlBQVMsQ0FBQztZQUMvQixFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsT0FBSyxFQUFFLFFBQU0sQ0FBQyxDQUFDO1lBQ2pDLE9BQU87U0FDUDtRQUVELGtEQUFrRDtRQUNsRCxJQUFJLEtBQUssSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQU8sQ0FBQyxLQUFLLENBQUMsSUFBSyxLQUFzQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDdEgsSUFBSSxNQUFNLENBQUMsVUFBVSxLQUFLLENBQUMsRUFBRTtnQkFDNUIsTUFBTSxJQUFJLEtBQUssQ0FBQyxrTUFBa00sQ0FBQyxDQUFDO2FBQ3BOO1lBQ0QsSUFBSSxnQkFBZ0IsRUFBRTtnQkFDckIsd0VBQXdFO2dCQUN4RSwwQkFBMEI7Z0JBQzFCLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUN2QztpQkFBTTtnQkFDTix3Q0FBd0M7Z0JBQ3hDLElBQUksQ0FBQyxxQ0FBcUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDbkQsZ0RBQWdEO2dCQUNoRCxNQUFNLENBQUMseUJBQXlCLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDeEM7U0FDRDthQUFNO1lBQ04sSUFBSSxnQkFBZ0IsRUFBRTtnQkFDckIsNEJBQTRCO2dCQUM1QixNQUFNLENBQUMseUJBQXlCLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDeEM7aUJBQU07Z0JBQ04sZ0VBQWdFO2dCQUNoRSwwRUFBMEU7Z0JBQzFFLElBQUksTUFBTSxDQUFDLHFDQUFxQyxFQUFFLEVBQUU7b0JBQ25ELElBQUksQ0FBQyxxQ0FBcUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztpQkFDbkQ7Z0JBQ0QsTUFBTSxDQUFDLHlCQUF5QixDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ3hDO1NBQ0Q7UUFFRCxtQkFBbUI7UUFDYixTQUFvQixNQUFNLENBQUMsYUFBYSxFQUFFLEVBQXhDLEtBQUssVUFBRSxNQUFNLFFBQTJCLENBQUM7UUFDakQsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBQUEsQ0FBQztJQUVNLDJDQUFvQixHQUE1QixVQUE2QixPQUFxQixFQUFFLFdBQW1CO1FBQ3RFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFFTyx3Q0FBaUIsR0FBekIsVUFBMEIsT0FBcUIsRUFBRSxXQUFtQjtRQUNuRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsT0FBTyxFQUFFLGtCQUFrQixFQUFFLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUN0RSxDQUFDO0lBRU8scUNBQWMsR0FBdEIsVUFBdUIsT0FBcUIsRUFBRSxXQUFtQjtRQUNoRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsT0FBTyxFQUFFLGVBQWUsRUFBRSxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUVPLHlDQUFrQixHQUExQixVQUEyQixPQUFxQixFQUFFLElBQVksRUFBRSxJQUFZLEVBQUUsV0FBbUI7UUFDeEYsTUFBRSxHQUFLLElBQUksR0FBVCxDQUFVO1FBQ3BCLDhDQUE4QztRQUM5QyxJQUFNLFFBQVEsR0FBRyxFQUFFLENBQUMsaUJBQWlCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3JELElBQUksUUFBUSxHQUFHLENBQUMsRUFBRTtZQUNqQixNQUFNLElBQUksS0FBSyxDQUFDLHVDQUFvQyxJQUFJLHdCQUFpQixXQUFXLFFBQUksQ0FBQyxDQUFDO1NBQzFGO1FBQ0QsdURBQXVEO1FBQ3ZELEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM5RCx3QkFBd0I7UUFDeEIsRUFBRSxDQUFDLHVCQUF1QixDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFRCxtQ0FBbUM7SUFDbkMsMkJBQUksR0FBSixVQUNDLE1BS0M7UUFFSyxTQUEwQyxJQUFJLEVBQTVDLEVBQUUsVUFBRSxVQUFVLGtCQUFFLG1CQUFtQix5QkFBUyxDQUFDO1FBQzdDLFdBQU8sR0FBb0IsTUFBTSxRQUExQixFQUFFLEtBQUssR0FBYSxNQUFNLE1BQW5CLEVBQUUsTUFBTSxHQUFLLE1BQU0sT0FBWCxDQUFZO1FBRTFDLG1DQUFtQztRQUNuQyxJQUFJLFVBQVUsRUFBRTtZQUNmLE9BQU87U0FDUDtRQUVELElBQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxjQUFlLENBQUM7UUFFMUMsbUNBQW1DO1FBQ25DLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFL0MsK0JBQStCO1FBQy9CLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsaUJBQUssQ0FBQyxDQUFDO1FBQ3ZFLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsd0JBQXdCLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsaUJBQUssQ0FBQyxDQUFDO1FBQzdFLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1FBQ3BELElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRW5ELFFBQVE7UUFDUixJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzNDLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLGNBQWMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdkMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDdEIsQ0FBQztJQUVELDBEQUEwRDtJQUMxRCxtQ0FBWSxHQUFaLFVBQ0MsTUFNQztRQUVLLFNBQTZDLElBQUksRUFBL0MsRUFBRSxVQUFFLFVBQVUsa0JBQUUsdUJBQXVCLDZCQUFRLENBQUM7UUFDaEQsV0FBTyxHQUFvQixNQUFNLFFBQTFCLEVBQUUsS0FBSyxHQUFhLE1BQU0sTUFBbkIsRUFBRSxNQUFNLEdBQUssTUFBTSxPQUFYLENBQVk7UUFDcEMsU0FBb0IsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFFLEVBQS9FLEtBQUssVUFBRSxNQUFNLFFBQWtFLENBQUM7UUFFeEYsbUNBQW1DO1FBQ25DLElBQUksVUFBVSxFQUFFO1lBQ2YsT0FBTztTQUNQO1FBRUQsSUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLGNBQWUsQ0FBQztRQUUxQyxtQ0FBbUM7UUFDbkMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztRQUVoRCwrQkFBK0I7UUFDL0IsOEVBQThFO1FBQzlFLElBQU0sS0FBSyxHQUFHLENBQUUsQ0FBQyxHQUFHLEtBQUssRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFxQixDQUFDO1FBQzNELE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxpQkFBSyxDQUFDLENBQUM7UUFDN0YsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSx3QkFBd0IsRUFBRSxLQUFLLEVBQUUsaUJBQUssQ0FBQyxDQUFDO1FBQzVFLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRW5ELFFBQVE7UUFDUixJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzNDLElBQUksTUFBTSxDQUFDLFVBQVUsRUFBRTtZQUN0QixRQUFPLE1BQU0sQ0FBQyxVQUFVLEVBQUU7Z0JBQ3pCLEtBQUssTUFBTTtvQkFDVixFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUM5QixNQUFNO2dCQUNQLEtBQUssT0FBTztvQkFDWCxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUM5QixNQUFNO2dCQUNQLEtBQUssS0FBSztvQkFDVCxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUM5QixNQUFNO2dCQUNQLEtBQUssUUFBUTtvQkFDWixFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUM5QixNQUFNO2dCQUNQO29CQUNDLE1BQU0sSUFBSSxLQUFLLENBQUMsaUNBQStCLE1BQU0sQ0FBQyxVQUFVLE1BQUcsQ0FBQyxDQUFDO2FBQ3RFO1NBQ0Q7YUFBTTtZQUNOLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDbEM7UUFDRCxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN0QixDQUFDO0lBRUQsNkRBQTZEO0lBQzdELHNDQUFlLEdBQWYsVUFDQyxNQUtDO1FBRUssU0FBMEMsSUFBSSxFQUE1QyxFQUFFLFVBQUUsVUFBVSxrQkFBRSxtQkFBbUIseUJBQVMsQ0FBQztRQUM3QyxXQUFPLEdBQW9CLE1BQU0sUUFBMUIsRUFBRSxLQUFLLEdBQWEsTUFBTSxNQUFuQixFQUFFLE1BQU0sR0FBSyxNQUFNLE9BQVgsQ0FBWTtRQUNwQyxTQUFvQixNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUUsRUFBL0UsS0FBSyxVQUFFLE1BQU0sUUFBa0UsQ0FBQztRQUV4RixtQ0FBbUM7UUFDbkMsSUFBSSxVQUFVLEVBQUU7WUFDZixPQUFPO1NBQ1A7UUFFRCxJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsY0FBZSxDQUFDO1FBRTFDLG1DQUFtQztRQUNuQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRWhELCtCQUErQjtRQUMvQixJQUFNLEtBQUssR0FBRyxDQUFFLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBcUIsQ0FBQztRQUMzRCxPQUFPLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxpQkFBSyxDQUFDLENBQUM7UUFDckcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSx3QkFBd0IsRUFBRSxLQUFLLEVBQUUsaUJBQUssQ0FBQyxDQUFDO1FBQzVFLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1FBQ3BELElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRW5ELFFBQVE7UUFDUixJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzNDLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLGNBQWMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdkMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDdEIsQ0FBQztJQUVELHlDQUF5QztJQUN6QyxpQ0FBVSxHQUFWLFVBQ0MsTUFRQztRQUVLLFNBQW9DLElBQUksRUFBdEMsRUFBRSxVQUFFLFVBQVUsa0JBQUUsS0FBSyxhQUFFLE1BQU0sWUFBUyxDQUFDO1FBQ3ZDLFdBQU8sR0FBc0MsTUFBTSxRQUE1QyxFQUFFLFFBQVEsR0FBNEIsTUFBTSxTQUFsQyxFQUFFLE1BQU0sR0FBb0IsTUFBTSxPQUExQixFQUFFLEtBQUssR0FBYSxNQUFNLE1BQW5CLEVBQUUsTUFBTSxHQUFLLE1BQU0sT0FBWCxDQUFZO1FBRTVELG1DQUFtQztRQUNuQyxJQUFJLFVBQVUsRUFBRTtZQUNmLE9BQU87U0FDUDtRQUVELElBQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxjQUFlLENBQUM7UUFFMUMsbUNBQW1DO1FBQ25DLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFaEQsK0JBQStCO1FBQy9CLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsa0JBQWtCLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLEtBQUssRUFBRSxNQUFNLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxFQUFFLGlCQUFLLENBQUMsQ0FBQztRQUMxRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLHdCQUF3QixFQUFFLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxHQUFHLENBQUMsQ0FBQyxFQUFFLGlCQUFLLENBQUMsQ0FBQztRQUNsSSxJQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQywyQkFBMkIsQ0FBQztRQUMxRixJQUFJLFdBQVcsR0FBRyxDQUFDLEVBQUU7WUFDcEIsTUFBTSxJQUFJLEtBQUssQ0FBQyx5RUFBdUUsV0FBVyxNQUFHLENBQUMsQ0FBQztTQUN2RztRQUNELEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsd0JBQXdCLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztRQUMzRSxJQUFJLENBQUMsb0JBQW9CLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVuRCxRQUFRO1FBQ1IsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUMzQyxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxFQUFFLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNuRCxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN0QixDQUFDO0lBRUQsK0VBQStFO0lBQy9FLGtDQUFXLEdBQVgsVUFDQyxNQVVDO1FBRUssU0FBcUIsSUFBSSxFQUF2QixFQUFFLFVBQUUsVUFBVSxnQkFBUyxDQUFDO1FBQ3hCLFdBQU8sR0FBcUQsTUFBTSxRQUEzRCxFQUFFLFNBQVMsR0FBMEMsTUFBTSxVQUFoRCxFQUFFLFNBQVMsR0FBK0IsTUFBTSxVQUFyQyxFQUFFLFNBQVMsR0FBb0IsTUFBTSxVQUExQixFQUFFLEtBQUssR0FBYSxNQUFNLE1BQW5CLEVBQUUsTUFBTSxHQUFLLE1BQU0sT0FBWCxDQUFZO1FBQ3JFLFNBQW9CLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBRSxFQUEvRSxLQUFLLFVBQUUsTUFBTSxRQUFrRSxDQUFDO1FBRXhGLG1DQUFtQztRQUNuQyxJQUFJLFVBQVUsRUFBRTtZQUNmLE9BQU87U0FDUDtRQUVELElBQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxjQUFlLENBQUM7UUFFMUMsbUNBQW1DO1FBQ25DLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFaEQsK0JBQStCO1FBQy9CLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsMEJBQTBCLEVBQUUsU0FBUyxHQUFHLENBQUMsRUFBRSxpQkFBSyxDQUFDLENBQUM7UUFDdEYsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxrQkFBa0IsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxFQUFFLGlCQUFLLENBQUMsQ0FBQztRQUN4RixJQUFNLEtBQUssR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFDLElBQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUMsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdkMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxxQkFBcUIsRUFBRSxLQUFLLEVBQUUsaUJBQUssQ0FBQyxDQUFDO1FBQ3pFLElBQU0sT0FBTyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNsRCxJQUFNLE9BQU8sR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbEQsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSx3QkFBd0IsRUFBRSxDQUFDLENBQUMsR0FBRyxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxFQUFFLGlCQUFLLENBQUMsQ0FBQztRQUNwSSxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDO1FBRXhELElBQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQywyQkFBMkIsQ0FBQztRQUNwRyxJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUU7WUFDbkIsSUFBSSxXQUFXLEdBQUcsQ0FBQyxJQUFJLFdBQVcsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUM3QyxNQUFNLElBQUksS0FBSyxDQUFDLDBFQUF3RSxXQUFXLE1BQUcsQ0FBQyxDQUFDO2FBQ3hHO1lBQ0QsK0NBQStDO1lBQy9DLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxHQUFHLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsV0FBVyxDQUFDLEVBQUUsaUJBQUssQ0FBQyxDQUFDO1lBQ3RILEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsd0JBQXdCLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztTQUMzRTthQUFNO1lBQ04sK0NBQStDO1lBQy9DLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxHQUFHLFNBQVMsRUFBRSxpQkFBSyxDQUFDLENBQUM7WUFDcEYsc0NBQXNDO1lBQ3RDLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztTQUN6RDtRQUVELElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRW5ELFFBQVE7UUFDUixJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzNDLElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRTtZQUNuQixFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxFQUFFLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUNuRDthQUFNO1lBQ04sRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsY0FBYyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUN2QztRQUNELEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3RCLENBQUM7SUFFRCxtQ0FBWSxHQUFaLFVBQ0MsTUFVQztRQUVPLFdBQU8sR0FBb0IsTUFBTSxRQUExQixFQUFFLEtBQUssR0FBYSxNQUFNLE1BQW5CLEVBQUUsTUFBTSxHQUFLLE1BQU0sT0FBWCxDQUFZO1FBQzFDLElBQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUM7UUFDbEMsSUFBTSxTQUFTLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7UUFFL0IsU0FBb0MsSUFBSSxFQUF0QyxFQUFFLFVBQUUsS0FBSyxhQUFFLE1BQU0sY0FBRSxVQUFVLGdCQUFTLENBQUM7UUFFL0MsbUNBQW1DO1FBQ25DLElBQUksVUFBVSxFQUFFO1lBQ2YsT0FBTztTQUNQO1FBRUQsbUJBQW1CO1FBQ25CLElBQU0sYUFBYSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO1FBQzNDLElBQU0sWUFBWSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3JGLElBQU0sU0FBUyxHQUFHLElBQUksWUFBWSxDQUFDLENBQUMsR0FBRyxZQUFZLENBQUMsQ0FBQztRQUNyRCxJQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLFlBQVksQ0FBQyxDQUFDLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztRQUMvRSxJQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLFlBQVksQ0FBQyxDQUFDLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztRQUV2RixjQUFjO1FBQ2QsSUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbEIsSUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbEIsSUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbEIsSUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbEIsSUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDekMsSUFBSSxDQUFDLFNBQVMsSUFBSSxDQUFDLEtBQUssUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDO2dCQUFFLFNBQVM7WUFDdEQsNEJBQTRCO1lBQzVCLElBQU0sRUFBRSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2QixJQUFNLEVBQUUsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQy9DLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekQsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUM7WUFDeEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQztZQUUxQixJQUFNLEtBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUV4QixJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQzFCLDBDQUEwQztnQkFDMUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsYUFBYSxDQUFDO2dCQUM3QyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxhQUFhLENBQUM7Z0JBQzdDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLGFBQWEsQ0FBQztnQkFDN0MsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsYUFBYSxDQUFDO2dCQUM3QyxJQUFJLEdBQUcsRUFBRTtvQkFDUixHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNYLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ1gsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDWCxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUNYO2dCQUNELElBQUksT0FBTyxFQUFFO29CQUNaLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ25CLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ25CLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ25CLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ25CO2FBQ0Q7WUFFRCxJQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFFMUMsa0JBQWtCO1lBQ2xCLFNBQVMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxhQUFhLENBQUM7WUFDckQsU0FBUyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxhQUFhLENBQUM7WUFDekQsU0FBUyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxhQUFhLENBQUM7WUFDekQsU0FBUyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxhQUFhLENBQUM7WUFDekQsSUFBSSxHQUFHLEVBQUU7Z0JBQ1IsR0FBRyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ25CLEdBQUcsQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDdkIsR0FBRyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUN2QixHQUFHLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDdkI7WUFDRCxJQUFJLE9BQU8sRUFBRTtnQkFDWixPQUFPLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDM0IsT0FBTyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMvQixPQUFPLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQy9CLE9BQU8sQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUMvQjtZQUVELElBQUksQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxTQUFTLEVBQUU7Z0JBQzNDLDRCQUE0QjtnQkFDNUIsSUFBTSxFQUFFLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDL0MsSUFBTSxFQUFFLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDL0MsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN0QixJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN6RCxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQztnQkFDeEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQztnQkFFMUIsaUJBQWlCO2dCQUNqQixTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLGFBQWEsQ0FBQztnQkFDckYsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsYUFBYSxDQUFDO2dCQUN6RixTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxhQUFhLENBQUM7Z0JBQ3pGLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLGFBQWEsQ0FBQztnQkFDekYsSUFBSSxHQUFHLEVBQUU7b0JBQ1IsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNuRCxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUN2RCxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUN2RCxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUN2RDtnQkFDRCxJQUFJLE9BQU8sRUFBRTtvQkFDWixPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzNELE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQy9ELE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQy9ELE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQy9EO2dCQUVELDZDQUE2QztnQkFDN0MsSUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM1QyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSTtvQkFBRSxTQUFTO2dCQUNyQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxPQUFPLENBQUM7Z0JBQ2pCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxPQUFPLENBQUM7Z0JBQ2pCLGlDQUFpQztnQkFDakMsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdkQsSUFBTSxNQUFNLEdBQUcsYUFBYSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNuRCxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUU7b0JBQ2QsU0FBUyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztvQkFDOUMsU0FBUyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7b0JBQ2xELFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUM7b0JBQzVFLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztpQkFDcEY7cUJBQU07b0JBQ04sU0FBUyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7b0JBQ2xELFNBQVMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO29CQUNsRCxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ3BGLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztpQkFDcEY7YUFDRDtTQUNEO1FBQ0QsSUFBSSxTQUFTLEVBQUU7WUFDZCx1REFBdUQ7WUFDdkQsU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlDLFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEQsU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsRCxTQUFTLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xELElBQUksR0FBRyxFQUFFO2dCQUNSLEdBQUcsQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdEMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdEMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxN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VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDekJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0Esd0NBQXdDLHlDQUF5QztXQUNqRjtXQUNBO1dBQ0EsRTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEVBQUU7V0FDRjtXQUNBO1dBQ0EsQ0FBQyxJOzs7OztXQ1BEO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxFQUFFO1dBQ0Y7V0FDQSxFOzs7OztXQ1ZBLHdGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7OztVQ05BO1VBQ0E7VUFDQTtVQUNBIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiV2ViR0xDb21wdXRlXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIldlYkdMQ29tcHV0ZVwiXSA9IGZhY3RvcnkoKTtcbn0pKHNlbGYsIGZ1bmN0aW9uKCkge1xucmV0dXJuICIsImltcG9ydCBtZW1vaXplIGZyb20gXCJsb2Rhc2gtZXMvbWVtb2l6ZVwiO1xuaW1wb3J0IHsgaXNUeXBlZEFycmF5SW5kZXhlZFByb3BlcnR5V3JpdGFibGUgfSBmcm9tIFwiLi9idWdcIjtcbmltcG9ydCB7IGlzQXJyYXlCdWZmZXIsIGlzU3RyaW5nTnVtYmVyS2V5IH0gZnJvbSBcIi4vaXNcIjtcbmltcG9ydCB7IGNvbnZlcnRUb051bWJlciwgcm91bmRUb0Zsb2F0MTZCaXRzIH0gZnJvbSBcIi4vbGliXCI7XG5pbXBvcnQgeyBjcmVhdGVQcml2YXRlU3RvcmFnZSB9IGZyb20gXCIuL3ByaXZhdGVcIjtcbmltcG9ydCB7IFRvSW50ZWdlciwgZGVmYXVsdENvbXBhcmVGdW5jdGlvbiB9IGZyb20gXCIuL3NwZWNcIjtcblxuY29uc3QgXyA9IGNyZWF0ZVByaXZhdGVTdG9yYWdlKCk7XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB0YXJnZXRcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBpc0Zsb2F0MTZBcnJheSh0YXJnZXQpIHtcbiAgICByZXR1cm4gdGFyZ2V0IGluc3RhbmNlb2YgRmxvYXQxNkFycmF5O1xufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdGFyZ2V0XG4gKiBAdGhyb3dzIHtUeXBlRXJyb3J9XG4gKi9cbmZ1bmN0aW9uIGFzc2VydEZsb2F0MTZBcnJheSh0YXJnZXQpIHtcbiAgICBpZiAoIWlzRmxvYXQxNkFycmF5KHRhcmdldCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlRoaXMgaXMgbm90IGEgRmxvYXQxNkFycmF5XCIpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHRhcmdldFxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzRGVmYXVsdEZsb2F0MTZBcnJheU1ldGhvZHModGFyZ2V0KSB7XG4gICAgcmV0dXJuIHR5cGVvZiB0YXJnZXQgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZhdWx0RmxvYXQxNkFycmF5TWV0aG9kcy5oYXModGFyZ2V0KTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge0Zsb2F0MTZBcnJheX0gZmxvYXQxNmJpdHNcbiAqIEByZXR1cm4ge251bWJlcltdfVxuICovXG5mdW5jdGlvbiBjb3B5VG9BcnJheShmbG9hdDE2Yml0cykge1xuICAgIGNvbnN0IGxlbmd0aCA9IGZsb2F0MTZiaXRzLmxlbmd0aDtcblxuICAgIGNvbnN0IGFycmF5ID0gbmV3IEFycmF5KGxlbmd0aCk7XG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICAgIGFycmF5W2ldID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzW2ldKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXJyYXk7XG59XG5cbi8qKiBAdHlwZSB7UHJveHlIYW5kbGVyPEZ1bmN0aW9uPn0gKi9cbmNvbnN0IGFwcGx5SGFuZGxlciA9IHtcbiAgICBhcHBseShmdW5jLCB0aGlzQXJnLCBhcmdzKSB7XG4gICAgICAgIC8vIHBlZWwgb2ZmIHByb3h5XG4gICAgICAgIGlmIChpc0Zsb2F0MTZBcnJheSh0aGlzQXJnKSAmJiBpc0RlZmF1bHRGbG9hdDE2QXJyYXlNZXRob2RzKGZ1bmMpKSB7XG4gICAgICAgICAgICByZXR1cm4gUmVmbGVjdC5hcHBseShmdW5jLCBfKHRoaXNBcmcpLnRhcmdldCAsYXJncyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUmVmbGVjdC5hcHBseShmdW5jLCB0aGlzQXJnLCBhcmdzKTtcbiAgICB9LFxufTtcblxuLyoqIEB0eXBlIHtQcm94eUhhbmRsZXI8RmxvYXQxNkFycmF5Pn0gKi9cbmNvbnN0IGhhbmRsZXIgPSB7XG4gICAgZ2V0KHRhcmdldCwga2V5KSB7XG4gICAgICAgIGxldCB3cmFwcGVyID0gbnVsbDtcbiAgICAgICAgaWYgKCFpc1R5cGVkQXJyYXlJbmRleGVkUHJvcGVydHlXcml0YWJsZSkge1xuICAgICAgICAgICAgd3JhcHBlciA9IHRhcmdldDtcbiAgICAgICAgICAgIHRhcmdldCA9IF8od3JhcHBlcikudGFyZ2V0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzU3RyaW5nTnVtYmVyS2V5KGtleSkpIHtcbiAgICAgICAgICAgIHJldHVybiBSZWZsZWN0Lmhhcyh0YXJnZXQsIGtleSkgPyBjb252ZXJ0VG9OdW1iZXIoUmVmbGVjdC5nZXQodGFyZ2V0LCBrZXkpKSA6IHVuZGVmaW5lZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IHdyYXBwZXIgIT09IG51bGwgJiYgUmVmbGVjdC5oYXMod3JhcHBlciwga2V5KSA/IFJlZmxlY3QuZ2V0KHdyYXBwZXIsIGtleSkgOiBSZWZsZWN0LmdldCh0YXJnZXQsIGtleSk7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgcmV0ICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBUeXBlZEFycmF5IG1ldGhvZHMgY2FuJ3QgYmUgY2FsbGVkIGJ5IFByb3h5IE9iamVjdFxuICAgICAgICAgICAgbGV0IHByb3h5ID0gXyhyZXQpLnByb3h5O1xuXG4gICAgICAgICAgICBpZiAocHJveHkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHByb3h5ID0gXyhyZXQpLnByb3h5ID0gbmV3IFByb3h5KHJldCwgYXBwbHlIYW5kbGVyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHByb3h5O1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHNldCh0YXJnZXQsIGtleSwgdmFsdWUpIHtcbiAgICAgICAgbGV0IHdyYXBwZXIgPSBudWxsO1xuICAgICAgICBpZiAoIWlzVHlwZWRBcnJheUluZGV4ZWRQcm9wZXJ0eVdyaXRhYmxlKSB7XG4gICAgICAgICAgICB3cmFwcGVyID0gdGFyZ2V0O1xuICAgICAgICAgICAgdGFyZ2V0ID0gXyh3cmFwcGVyKS50YXJnZXQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNTdHJpbmdOdW1iZXJLZXkoa2V5KSkge1xuICAgICAgICAgICAgcmV0dXJuIFJlZmxlY3Quc2V0KHRhcmdldCwga2V5LCByb3VuZFRvRmxvYXQxNkJpdHModmFsdWUpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGZyb3plbiBvYmplY3QgY2FuJ3QgY2hhbmdlIHByb3RvdHlwZSBwcm9wZXJ0eVxuICAgICAgICAgICAgaWYgKHdyYXBwZXIgIT09IG51bGwgJiYgKCFSZWZsZWN0Lmhhcyh0YXJnZXQsIGtleSkgfHwgT2JqZWN0LmlzRnJvemVuKHdyYXBwZXIpKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBSZWZsZWN0LnNldCh3cmFwcGVyLCBrZXksIHZhbHVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFJlZmxlY3Quc2V0KHRhcmdldCwga2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxufTtcblxuaWYgKCFpc1R5cGVkQXJyYXlJbmRleGVkUHJvcGVydHlXcml0YWJsZSkge1xuICAgIGhhbmRsZXIuZ2V0UHJvdG90eXBlT2YgPSAod3JhcHBlcikgPT4geyByZXR1cm4gUmVmbGVjdC5nZXRQcm90b3R5cGVPZihfKHdyYXBwZXIpLnRhcmdldCk7IH07XG4gICAgaGFuZGxlci5zZXRQcm90b3R5cGVPZiA9ICh3cmFwcGVyLCBwcm90b3R5cGUpID0+IHsgcmV0dXJuIFJlZmxlY3Quc2V0UHJvdG90eXBlT2YoXyh3cmFwcGVyKS50YXJnZXQsIHByb3RvdHlwZSk7IH07XG5cbiAgICBoYW5kbGVyLmRlZmluZVByb3BlcnR5ID0gKHdyYXBwZXIsIGtleSwgZGVzY3JpcHRvcikgPT4ge1xuICAgICAgICBjb25zdCB0YXJnZXQgPSBfKHdyYXBwZXIpLnRhcmdldDtcbiAgICAgICAgcmV0dXJuICFSZWZsZWN0Lmhhcyh0YXJnZXQsIGtleSkgfHwgT2JqZWN0LmlzRnJvemVuKHdyYXBwZXIpID8gUmVmbGVjdC5kZWZpbmVQcm9wZXJ0eSh3cmFwcGVyLCBrZXksIGRlc2NyaXB0b3IpIDogUmVmbGVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgZGVzY3JpcHRvcik7XG4gICAgfTtcbiAgICBoYW5kbGVyLmRlbGV0ZVByb3BlcnR5ID0gKHdyYXBwZXIsIGtleSkgPT4ge1xuICAgICAgICBjb25zdCB0YXJnZXQgPSBfKHdyYXBwZXIpLnRhcmdldDtcbiAgICAgICAgcmV0dXJuIFJlZmxlY3QuaGFzKHdyYXBwZXIsIGtleSkgPyBSZWZsZWN0LmRlbGV0ZVByb3BlcnR5KHdyYXBwZXIsIGtleSkgOiBSZWZsZWN0LmRlbGV0ZVByb3BlcnR5KHRhcmdldCwga2V5KTtcbiAgICB9O1xuXG4gICAgaGFuZGxlci5oYXMgPSAod3JhcHBlciwga2V5KSA9PiB7IHJldHVybiBSZWZsZWN0Lmhhcyh3cmFwcGVyLCBrZXkpIHx8IFJlZmxlY3QuaGFzKF8od3JhcHBlcikudGFyZ2V0LCBrZXkpOyB9O1xuXG4gICAgaGFuZGxlci5pc0V4dGVuc2libGUgPSAod3JhcHBlcikgPT4geyByZXR1cm4gUmVmbGVjdC5pc0V4dGVuc2libGUod3JhcHBlcik7IH07XG4gICAgaGFuZGxlci5wcmV2ZW50RXh0ZW5zaW9ucyA9ICh3cmFwcGVyKSA9PiB7IHJldHVybiBSZWZsZWN0LnByZXZlbnRFeHRlbnNpb25zKHdyYXBwZXIpOyB9O1xuXG4gICAgaGFuZGxlci5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSAod3JhcHBlciwga2V5KSA9PiB7IHJldHVybiBSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih3cmFwcGVyLCBrZXkpOyB9O1xuICAgIGhhbmRsZXIub3duS2V5cyA9ICh3cmFwcGVyKSA9PiB7IHJldHVybiBSZWZsZWN0Lm93bktleXMod3JhcHBlcik7IH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZsb2F0MTZBcnJheSBleHRlbmRzIFVpbnQxNkFycmF5IHtcblxuICAgIGNvbnN0cnVjdG9yKGlucHV0LCBieXRlT2Zmc2V0LCBsZW5ndGgpIHtcbiAgICAgICAgLy8gaW5wdXQgRmxvYXQxNkFycmF5XG4gICAgICAgIGlmIChpc0Zsb2F0MTZBcnJheShpbnB1dCkpIHtcbiAgICAgICAgICAgIHN1cGVyKF8oaW5wdXQpLnRhcmdldCk7XG5cbiAgICAgICAgLy8gMjIuMi4xLjMsIDIyLjIuMS40IFR5cGVkQXJyYXksIEFycmF5LCBBcnJheUxpa2UsIEl0ZXJhYmxlXG4gICAgICAgIH0gZWxzZSBpZiAoaW5wdXQgIT09IG51bGwgJiYgdHlwZW9mIGlucHV0ID09PSBcIm9iamVjdFwiICYmICFpc0FycmF5QnVmZmVyKGlucHV0KSkge1xuICAgICAgICAgICAgLy8gaWYgaW5wdXQgaXMgbm90IEFycmF5TGlrZSBhbmQgSXRlcmFibGUsIGdldCBBcnJheVxuICAgICAgICAgICAgY29uc3QgYXJyYXlMaWtlID0gIVJlZmxlY3QuaGFzKGlucHV0LCBcImxlbmd0aFwiKSAmJiBpbnB1dFtTeW1ib2wuaXRlcmF0b3JdICE9PSB1bmRlZmluZWQgPyBbLi4uaW5wdXRdIDogaW5wdXQ7XG5cbiAgICAgICAgICAgIGNvbnN0IGxlbmd0aCA9IGFycmF5TGlrZS5sZW5ndGg7XG4gICAgICAgICAgICBzdXBlcihsZW5ndGgpO1xuXG4gICAgICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICAvLyBzdXBlciAoVWludDE2QXJyYXkpXG4gICAgICAgICAgICAgICAgdGhpc1tpXSA9IHJvdW5kVG9GbG9hdDE2Qml0cyhhcnJheUxpa2VbaV0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIC8vIDIyLjIuMS4yLCAyMi4yLjEuNSBwcmltaXRpdmUsIEFycmF5QnVmZmVyXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgIHN1cGVyKGlucHV0KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgIHN1cGVyKGlucHV0LCBieXRlT2Zmc2V0KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgIHN1cGVyKGlucHV0LCBieXRlT2Zmc2V0LCBsZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBwcm94eTtcblxuICAgICAgICBpZiAoaXNUeXBlZEFycmF5SW5kZXhlZFByb3BlcnR5V3JpdGFibGUpIHtcbiAgICAgICAgICAgIHByb3h5ID0gbmV3IFByb3h5KHRoaXMsIGhhbmRsZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3Qgd3JhcHBlciA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgICAgICBfKHdyYXBwZXIpLnRhcmdldCA9IHRoaXM7XG4gICAgICAgICAgICBwcm94eSA9IG5ldyBQcm94eSh3cmFwcGVyLCBoYW5kbGVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHByb3h5IHByaXZhdGUgc3RvcmFnZVxuICAgICAgICBfKHByb3h5KS50YXJnZXQgPSB0aGlzO1xuXG4gICAgICAgIC8vIHRoaXMgcHJpdmF0ZSBzdG9yYWdlXG4gICAgICAgIF8odGhpcykucHJveHkgPSBwcm94eTtcblxuICAgICAgICByZXR1cm4gcHJveHk7XG4gICAgfVxuXG4gICAgLy8gc3RhdGljIG1ldGhvZHNcbiAgICBzdGF0aWMgZnJvbShzcmMsIC4uLm9wdHMpIHtcbiAgICAgICAgaWYgKG9wdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEZsb2F0MTZBcnJheShVaW50MTZBcnJheS5mcm9tKHNyYywgcm91bmRUb0Zsb2F0MTZCaXRzKS5idWZmZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbWFwRnVuYyA9IG9wdHNbMF07XG4gICAgICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzFdO1xuXG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQxNkFycmF5KFVpbnQxNkFycmF5LmZyb20oc3JjLCBmdW5jdGlvbiAodmFsLCAuLi5hcmdzKSB7XG4gICAgICAgICAgICByZXR1cm4gcm91bmRUb0Zsb2F0MTZCaXRzKG1hcEZ1bmMuY2FsbCh0aGlzLCB2YWwsIC4uLmFyZ3MpKTtcbiAgICAgICAgfSwgdGhpc0FyZykuYnVmZmVyKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgb2YoLi4uYXJncykge1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MTZBcnJheShhcmdzKTtcbiAgICB9XG5cbiAgICAvLyBpdGVyYXRlIG1ldGhvZHNcbiAgICAqIFtTeW1ib2wuaXRlcmF0b3JdKCkge1xuICAgICAgICBmb3IoY29uc3QgdmFsIG9mIHN1cGVyW1N5bWJvbC5pdGVyYXRvcl0oKSkge1xuICAgICAgICAgICAgeWllbGQgY29udmVydFRvTnVtYmVyKHZhbCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBrZXlzKCkge1xuICAgICAgICByZXR1cm4gc3VwZXIua2V5cygpO1xuICAgIH1cblxuICAgICogdmFsdWVzKCkge1xuICAgICAgICBmb3IoY29uc3QgdmFsIG9mIHN1cGVyLnZhbHVlcygpKSB7XG4gICAgICAgICAgICB5aWVsZCBjb252ZXJ0VG9OdW1iZXIodmFsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKiBAdHlwZSB7KCkgPT4gSXRlcmFibGVJdGVyYXRvcjxbbnVtYmVyLCBudW1iZXJdPn0gKi9cbiAgICAqIGVudHJpZXMoKSB7XG4gICAgICAgIGZvcihjb25zdCBbaSwgdmFsXSBvZiBzdXBlci5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgIHlpZWxkIFtpLCBjb252ZXJ0VG9OdW1iZXIodmFsKV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBmdW5jdGlvbmFsIG1ldGhvZHNcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgbWFwKGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcblxuICAgICAgICBjb25zdCB0aGlzQXJnID0gb3B0c1swXTtcblxuICAgICAgICBjb25zdCBhcnJheSA9IFtdO1xuICAgICAgICBmb3IobGV0IGkgPSAwLCBsID0gdGhpcy5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbCA9IGNvbnZlcnRUb051bWJlcih0aGlzW2ldKTtcbiAgICAgICAgICAgIGFycmF5LnB1c2goY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB2YWwsIGksIF8odGhpcykucHJveHkpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQxNkFycmF5KGFycmF5KTtcbiAgICB9XG5cbiAgICAvLyBAdHMtaWdub3JlXG4gICAgZmlsdGVyKGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcblxuICAgICAgICBjb25zdCB0aGlzQXJnID0gb3B0c1swXTtcblxuICAgICAgICBjb25zdCBhcnJheSA9IFtdO1xuICAgICAgICBmb3IobGV0IGkgPSAwLCBsID0gdGhpcy5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbCA9IGNvbnZlcnRUb051bWJlcih0aGlzW2ldKTtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHZhbCwgaSwgXyh0aGlzKS5wcm94eSkpIHtcbiAgICAgICAgICAgICAgICBhcnJheS5wdXNoKHZhbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MTZBcnJheShhcnJheSk7XG4gICAgfVxuXG4gICAgcmVkdWNlKGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcblxuICAgICAgICBsZXQgdmFsLCBzdGFydDtcblxuICAgICAgICBpZiAob3B0cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHZhbCA9IGNvbnZlcnRUb051bWJlcih0aGlzWzBdKTtcbiAgICAgICAgICAgIHN0YXJ0ID0gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhbCA9IG9wdHNbMF07XG4gICAgICAgICAgICBzdGFydCA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IobGV0IGkgPSBzdGFydCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgICAgICAgICB2YWwgPSBjYWxsYmFjayh2YWwsIGNvbnZlcnRUb051bWJlcih0aGlzW2ldKSwgaSwgXyh0aGlzKS5wcm94eSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdmFsO1xuICAgIH1cblxuICAgIHJlZHVjZVJpZ2h0KGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcblxuICAgICAgICBsZXQgdmFsLCBzdGFydDtcblxuICAgICAgICBjb25zdCBsZW5ndGggPSB0aGlzLmxlbmd0aDtcbiAgICAgICAgaWYgKG9wdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICB2YWwgPSBjb252ZXJ0VG9OdW1iZXIodGhpc1tsZW5ndGggLSAxXSk7XG4gICAgICAgICAgICBzdGFydCA9IGxlbmd0aCAtIDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YWwgPSBvcHRzWzBdO1xuICAgICAgICAgICAgc3RhcnQgPSBsZW5ndGg7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IobGV0IGkgPSBzdGFydDsgaS0tOykge1xuICAgICAgICAgICAgdmFsID0gY2FsbGJhY2sodmFsLCBjb252ZXJ0VG9OdW1iZXIodGhpc1tpXSksIGksIF8odGhpcykucHJveHkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbDtcbiAgICB9XG5cbiAgICBmb3JFYWNoKGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcblxuICAgICAgICBjb25zdCB0aGlzQXJnID0gb3B0c1swXTtcblxuICAgICAgICBmb3IobGV0IGkgPSAwLCBsID0gdGhpcy5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwodGhpc0FyZywgY29udmVydFRvTnVtYmVyKHRoaXNbaV0pLCBpLCBfKHRoaXMpLnByb3h5KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbmQoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICAgICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgICAgIGZvcihsZXQgaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBjb252ZXJ0VG9OdW1iZXIodGhpc1tpXSk7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB2YWx1ZSwgaSwgXyh0aGlzKS5wcm94eSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmaW5kSW5kZXgoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICAgICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgICAgIGZvcihsZXQgaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBjb252ZXJ0VG9OdW1iZXIodGhpc1tpXSk7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB2YWx1ZSwgaSwgXyh0aGlzKS5wcm94eSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICBldmVyeShjYWxsYmFjaywgLi4ub3B0cykge1xuICAgICAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG5cbiAgICAgICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMF07XG5cbiAgICAgICAgZm9yKGxldCBpID0gMCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgICAgICAgICBpZiAoIWNhbGxiYWNrLmNhbGwodGhpc0FyZywgY29udmVydFRvTnVtYmVyKHRoaXNbaV0pLCBpLCBfKHRoaXMpLnByb3h5KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHNvbWUoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICAgICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgICAgIGZvcihsZXQgaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrLmNhbGwodGhpc0FyZywgY29udmVydFRvTnVtYmVyKHRoaXNbaV0pLCBpLCBfKHRoaXMpLnByb3h5KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIGNoYW5nZSBlbGVtZW50IG1ldGhvZHNcbiAgICBzZXQoaW5wdXQsIC4uLm9wdHMpIHtcbiAgICAgICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgICAgIGNvbnN0IG9mZnNldCA9IG9wdHNbMF07XG5cbiAgICAgICAgbGV0IGZsb2F0MTZiaXRzO1xuXG4gICAgICAgIC8vIGlucHV0IEZsb2F0MTZBcnJheVxuICAgICAgICBpZiAoaXNGbG9hdDE2QXJyYXkoaW5wdXQpKSB7XG4gICAgICAgICAgICBmbG9hdDE2Yml0cyA9IF8oaW5wdXQpLnRhcmdldDtcblxuICAgICAgICAvLyBpbnB1dCBvdGhlcnNcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGFycmF5TGlrZSA9ICFSZWZsZWN0LmhhcyhpbnB1dCwgXCJsZW5ndGhcIikgJiYgaW5wdXRbU3ltYm9sLml0ZXJhdG9yXSAhPT0gdW5kZWZpbmVkID8gWy4uLmlucHV0XSA6IGlucHV0O1xuICAgICAgICAgICAgY29uc3QgbGVuZ3RoID0gYXJyYXlMaWtlLmxlbmd0aDtcblxuICAgICAgICAgICAgZmxvYXQxNmJpdHMgPSBuZXcgVWludDE2QXJyYXkobGVuZ3RoKTtcbiAgICAgICAgICAgIGZvcihsZXQgaSA9IDAsIGwgPSBhcnJheUxpa2UubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgICAgICAgICAgICAgZmxvYXQxNmJpdHNbaV0gPSByb3VuZFRvRmxvYXQxNkJpdHMoYXJyYXlMaWtlW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHN1cGVyLnNldChmbG9hdDE2Yml0cywgb2Zmc2V0KTtcbiAgICB9XG5cbiAgICByZXZlcnNlKCkge1xuICAgICAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG5cbiAgICAgICAgc3VwZXIucmV2ZXJzZSgpO1xuXG4gICAgICAgIHJldHVybiBfKHRoaXMpLnByb3h5O1xuICAgIH1cblxuICAgIGZpbGwodmFsdWUsIC4uLm9wdHMpIHtcbiAgICAgICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgICAgIHN1cGVyLmZpbGwocm91bmRUb0Zsb2F0MTZCaXRzKHZhbHVlKSwgLi4ub3B0cyk7XG5cbiAgICAgICAgcmV0dXJuIF8odGhpcykucHJveHk7XG4gICAgfVxuXG4gICAgY29weVdpdGhpbih0YXJnZXQsIHN0YXJ0LCAuLi5vcHRzKSB7XG4gICAgICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcblxuICAgICAgICBzdXBlci5jb3B5V2l0aGluKHRhcmdldCwgc3RhcnQsIC4uLm9wdHMpO1xuXG4gICAgICAgIHJldHVybiBfKHRoaXMpLnByb3h5O1xuICAgIH1cblxuICAgIHNvcnQoLi4ub3B0cykge1xuICAgICAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG5cbiAgICAgICAgbGV0IGNvbXBhcmVGdW5jdGlvbiA9IG9wdHNbMF07XG5cbiAgICAgICAgaWYgKGNvbXBhcmVGdW5jdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb21wYXJlRnVuY3Rpb24gPSBkZWZhdWx0Q29tcGFyZUZ1bmN0aW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgX2NvbnZlcnRUb051bWJlciA9IG1lbW9pemUoY29udmVydFRvTnVtYmVyKTtcblxuICAgICAgICBzdXBlci5zb3J0KCh4LCB5KSA9PiB7IHJldHVybiBjb21wYXJlRnVuY3Rpb24oX2NvbnZlcnRUb051bWJlcih4KSwgX2NvbnZlcnRUb051bWJlcih5KSk7IH0pO1xuXG4gICAgICAgIHJldHVybiBfKHRoaXMpLnByb3h5O1xuICAgIH1cblxuICAgIC8vIGNvcHkgZWxlbWVudCBtZXRob2RzXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHNsaWNlKC4uLm9wdHMpIHtcbiAgICAgICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgICAgIGxldCBmbG9hdDE2Yml0cztcblxuICAgICAgICAvLyBWOCwgU3BpZGVyTW9ua2V5LCBKYXZhU2NyaXB0Q29yZSwgQ2hha3JhIHRocm93IFR5cGVFcnJvclxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZmxvYXQxNmJpdHMgPSBzdXBlci5zbGljZSguLi5vcHRzKTtcbiAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICBpZiAoZSBpbnN0YW5jZW9mIFR5cGVFcnJvcikge1xuICAgICAgICAgICAgICAgIGNvbnN0IHVpbnQxNiA9IG5ldyBVaW50MTZBcnJheSh0aGlzLmJ1ZmZlciwgdGhpcy5ieXRlT2Zmc2V0LCB0aGlzLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgZmxvYXQxNmJpdHMgPSB1aW50MTYuc2xpY2UoLi4ub3B0cyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MTZBcnJheShmbG9hdDE2Yml0cy5idWZmZXIpO1xuICAgIH1cblxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBzdWJhcnJheSguLi5vcHRzKSB7XG4gICAgICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcblxuICAgICAgICBsZXQgZmxvYXQxNmJpdHM7XG5cbiAgICAgICAgLy8gVjgsIFNwaWRlck1vbmtleSwgSmF2YVNjcmlwdENvcmUsIENoYWtyYSB0aHJvdyBUeXBlRXJyb3JcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZsb2F0MTZiaXRzID0gc3VwZXIuc3ViYXJyYXkoLi4ub3B0cyk7XG4gICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBUeXBlRXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB1aW50MTYgPSBuZXcgVWludDE2QXJyYXkodGhpcy5idWZmZXIsIHRoaXMuYnl0ZU9mZnNldCwgdGhpcy5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIGZsb2F0MTZiaXRzID0gdWludDE2LnN1YmFycmF5KC4uLm9wdHMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDE2QXJyYXkoZmxvYXQxNmJpdHMuYnVmZmVyLCBmbG9hdDE2Yml0cy5ieXRlT2Zmc2V0LCBmbG9hdDE2Yml0cy5sZW5ndGgpO1xuICAgIH1cblxuICAgIC8vIGNvbnRhaW5zIG1ldGhvZHNcbiAgICBpbmRleE9mKGVsZW1lbnQsIC4uLm9wdHMpIHtcbiAgICAgICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMubGVuZ3RoO1xuXG4gICAgICAgIGxldCBmcm9tID0gVG9JbnRlZ2VyKG9wdHNbMF0pO1xuXG4gICAgICAgIGlmIChmcm9tIDwgMCkge1xuICAgICAgICAgICAgZnJvbSArPSBsZW5ndGg7XG4gICAgICAgICAgICBpZiAoZnJvbSA8IDApIHtcbiAgICAgICAgICAgICAgICBmcm9tID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvcihsZXQgaSA9IGZyb20sIGwgPSBsZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICAgICAgICAgIGlmIChjb252ZXJ0VG9OdW1iZXIodGhpc1tpXSkgPT09IGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICBsYXN0SW5kZXhPZihlbGVtZW50LCAuLi5vcHRzKSB7XG4gICAgICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcblxuICAgICAgICBjb25zdCBsZW5ndGggPSB0aGlzLmxlbmd0aDtcblxuICAgICAgICBsZXQgZnJvbSA9IFRvSW50ZWdlcihvcHRzWzBdKTtcblxuICAgICAgICBmcm9tID0gZnJvbSA9PT0gMCA/IGxlbmd0aCA6IGZyb20gKyAxO1xuXG4gICAgICAgIGlmIChmcm9tID49IDApIHtcbiAgICAgICAgICAgIGZyb20gPSBmcm9tIDwgbGVuZ3RoID8gZnJvbSA6IGxlbmd0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZyb20gKz0gbGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yKGxldCBpID0gZnJvbTsgaS0tOykge1xuICAgICAgICAgICAgaWYgKGNvbnZlcnRUb051bWJlcih0aGlzW2ldKSA9PT0gZWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIGluY2x1ZGVzKGVsZW1lbnQsIC4uLm9wdHMpIHtcbiAgICAgICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMubGVuZ3RoO1xuXG4gICAgICAgIGxldCBmcm9tID0gVG9JbnRlZ2VyKG9wdHNbMF0pO1xuXG4gICAgICAgIGlmIChmcm9tIDwgMCkge1xuICAgICAgICAgICAgZnJvbSArPSBsZW5ndGg7XG4gICAgICAgICAgICBpZiAoZnJvbSA8IDApIHtcbiAgICAgICAgICAgICAgICBmcm9tID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGlzTmFOID0gTnVtYmVyLmlzTmFOKGVsZW1lbnQpO1xuICAgICAgICBmb3IobGV0IGkgPSBmcm9tLCBsID0gbGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGNvbnZlcnRUb051bWJlcih0aGlzW2ldKTtcblxuICAgICAgICAgICAgaWYgKGlzTmFOICYmIE51bWJlci5pc05hTih2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHZhbHVlID09PSBlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gc3RyaW5nIG1ldGhvZHNcbiAgICBqb2luKC4uLm9wdHMpIHtcbiAgICAgICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgICAgIGNvbnN0IGFycmF5ID0gY29weVRvQXJyYXkodGhpcyk7XG5cbiAgICAgICAgcmV0dXJuIGFycmF5LmpvaW4oLi4ub3B0cyk7XG4gICAgfVxuXG4gICAgdG9Mb2NhbGVTdHJpbmcoLi4ub3B0cykge1xuICAgICAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG5cbiAgICAgICAgY29uc3QgYXJyYXkgPSBjb3B5VG9BcnJheSh0aGlzKTtcblxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIHJldHVybiBhcnJheS50b0xvY2FsZVN0cmluZyguLi5vcHRzKTtcbiAgICB9XG5cbiAgICAvLyBAdHMtaWdub3JlXG4gICAgZ2V0IFtTeW1ib2wudG9TdHJpbmdUYWddKCkge1xuICAgICAgICBpZiAoaXNGbG9hdDE2QXJyYXkodGhpcykpIHtcbiAgICAgICAgICAgIHJldHVybiBcIkZsb2F0MTZBcnJheVwiO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5jb25zdCBGbG9hdDE2QXJyYXkkcHJvdG90eXBlID0gRmxvYXQxNkFycmF5LnByb3RvdHlwZTtcblxuY29uc3QgZGVmYXVsdEZsb2F0MTZBcnJheU1ldGhvZHMgPSBuZXcgV2Vha1NldCgpO1xuZm9yKGNvbnN0IGtleSBvZiBSZWZsZWN0Lm93bktleXMoRmxvYXQxNkFycmF5JHByb3RvdHlwZSkpIHtcbiAgICBjb25zdCB2YWwgPSBGbG9hdDE2QXJyYXkkcHJvdG90eXBlW2tleV07XG4gICAgaWYgKHR5cGVvZiB2YWwgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBkZWZhdWx0RmxvYXQxNkFycmF5TWV0aG9kcy5hZGQodmFsKTtcbiAgICB9XG59XG4iLCIvKipcbiAqIEphdmFTY3JpcHRDb3JlIDw9IDEyIGJ1Z1xuICogQHNlZSBodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTcxNjA2XG4gKi9cbmV4cG9ydCBjb25zdCBpc1R5cGVkQXJyYXlJbmRleGVkUHJvcGVydHlXcml0YWJsZSA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobmV3IFVpbnQ4QXJyYXkoMSksIDApLndyaXRhYmxlO1xuIiwiaW1wb3J0IHsgaXNEYXRhVmlldyB9IGZyb20gXCIuL2lzXCI7XG5pbXBvcnQgeyBjb252ZXJ0VG9OdW1iZXIsIHJvdW5kVG9GbG9hdDE2Qml0cyB9IGZyb20gXCIuL2xpYlwiO1xuXG4vKipcbiAqIHJldHVybnMgYW4gdW5zaWduZWQgMTYtYml0IGZsb2F0IGF0IHRoZSBzcGVjaWZpZWQgYnl0ZSBvZmZzZXQgZnJvbSB0aGUgc3RhcnQgb2YgdGhlIERhdGFWaWV3LlxuICogQHBhcmFtIHtEYXRhVmlld30gZGF0YVZpZXdcbiAqIEBwYXJhbSB7bnVtYmVyfSBieXRlT2Zmc2V0XG4gKiBAcGFyYW0ge1tib29sZWFuXX0gb3B0c1xuICogQHJldHVybnMge251bWJlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEZsb2F0MTYoZGF0YVZpZXcsIGJ5dGVPZmZzZXQsIC4uLm9wdHMpIHtcbiAgICBpZiAoIWlzRGF0YVZpZXcoZGF0YVZpZXcpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJGaXJzdCBhcmd1bWVudCB0byBnZXRGbG9hdDE2IGZ1bmN0aW9uIG11c3QgYmUgYSBEYXRhVmlld1wiKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29udmVydFRvTnVtYmVyKCBkYXRhVmlldy5nZXRVaW50MTYoYnl0ZU9mZnNldCwgLi4ub3B0cykgKTtcbn1cblxuLyoqXG4gKiBzdG9yZXMgYW4gdW5zaWduZWQgMTYtYml0IGZsb2F0IHZhbHVlIGF0IHRoZSBzcGVjaWZpZWQgYnl0ZSBvZmZzZXQgZnJvbSB0aGUgc3RhcnQgb2YgdGhlIERhdGFWaWV3LlxuICogQHBhcmFtIHtEYXRhVmlld30gZGF0YVZpZXdcbiAqIEBwYXJhbSB7bnVtYmVyfSBieXRlT2Zmc2V0XG4gKiBAcGFyYW0ge251bWJlcn0gdmFsdWVcbiAqIEBwYXJhbSB7W2Jvb2xlYW5dfSBvcHRzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRGbG9hdDE2KGRhdGFWaWV3LCBieXRlT2Zmc2V0LCB2YWx1ZSwgLi4ub3B0cykge1xuICAgIGlmICghaXNEYXRhVmlldyhkYXRhVmlldykpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkZpcnN0IGFyZ3VtZW50IHRvIHNldEZsb2F0MTYgZnVuY3Rpb24gbXVzdCBiZSBhIERhdGFWaWV3XCIpO1xuICAgIH1cblxuICAgIGRhdGFWaWV3LnNldFVpbnQxNihieXRlT2Zmc2V0LCByb3VuZFRvRmxvYXQxNkJpdHModmFsdWUpLCAuLi5vcHRzKTtcbn1cbiIsImltcG9ydCB7IGNvbnZlcnRUb051bWJlciwgcm91bmRUb0Zsb2F0MTZCaXRzIH0gZnJvbSBcIi4vbGliXCI7XG5cbi8qKlxuICogcmV0dXJucyB0aGUgbmVhcmVzdCBoYWxmIHByZWNpc2lvbiBmbG9hdCByZXByZXNlbnRhdGlvbiBvZiBhIG51bWJlci5cbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1cbiAqIEByZXR1cm5zIHtudW1iZXJ9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGhmcm91bmQobnVtKSB7XG4gICAgbnVtID0gTnVtYmVyKG51bSk7XG5cbiAgICAvLyBmb3Igb3B0aW1pemF0aW9uXG4gICAgaWYgKCFOdW1iZXIuaXNGaW5pdGUobnVtKSB8fCBudW0gPT09IDApIHtcbiAgICAgICAgcmV0dXJuIG51bTtcbiAgICB9XG5cbiAgICBjb25zdCB4MTYgPSByb3VuZFRvRmxvYXQxNkJpdHMobnVtKTtcbiAgICByZXR1cm4gY29udmVydFRvTnVtYmVyKHgxNik7XG59XG4iLCJleHBvcnQgeyBkZWZhdWx0IGFzIGhmcm91bmQgfSBmcm9tIFwiLi9oZnJvdW5kXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEZsb2F0MTZBcnJheSB9IGZyb20gXCIuL0Zsb2F0MTZBcnJheVwiO1xuZXhwb3J0IHsgZ2V0RmxvYXQxNiwgc2V0RmxvYXQxNiB9IGZyb20gXCIuL2RhdGFWaWV3LmpzXCI7XG4iLCJpbXBvcnQgeyBUb0ludGVnZXIgfSBmcm9tIFwiLi9zcGVjXCI7XG5cbmV4cG9ydCB7IGRlZmF1bHQgYXMgaXNBcnJheUJ1ZmZlciB9IGZyb20gXCJsb2Rhc2gtZXMvaXNBcnJheUJ1ZmZlclwiO1xuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdmlld1xuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0RhdGFWaWV3KHZpZXcpIHtcbiAgICByZXR1cm4gdmlldyBpbnN0YW5jZW9mIERhdGFWaWV3O1xufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0ga2V5XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzU3RyaW5nTnVtYmVyS2V5KGtleSkge1xuICAgIHJldHVybiB0eXBlb2Yga2V5ID09PSBcInN0cmluZ1wiICYmIGtleSA9PT0gVG9JbnRlZ2VyKGtleSkgKyBcIlwiO1xufVxuIiwiLy8gYWxnb3JpdGhtOiBmdHA6Ly9mdHAuZm94LXRvb2xraXQub3JnL3B1Yi9mYXN0aGFsZmZsb2F0Y29udmVyc2lvbi5wZGZcblxuY29uc3QgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuY29uc3QgZmxvYXRWaWV3ID0gbmV3IEZsb2F0MzJBcnJheShidWZmZXIpO1xuY29uc3QgdWludDMyVmlldyA9IG5ldyBVaW50MzJBcnJheShidWZmZXIpO1xuXG5cbmNvbnN0IGJhc2VUYWJsZSA9IG5ldyBVaW50MzJBcnJheSg1MTIpO1xuY29uc3Qgc2hpZnRUYWJsZSA9IG5ldyBVaW50MzJBcnJheSg1MTIpO1xuXG5mb3IobGV0IGkgPSAwOyBpIDwgMjU2OyArK2kpIHtcbiAgICBjb25zdCBlID0gaSAtIDEyNztcblxuICAgIC8vIHZlcnkgc21hbGwgbnVtYmVyICgwLCAtMClcbiAgICBpZiAoZSA8IC0yNykge1xuICAgICAgICBiYXNlVGFibGVbaSB8IDB4MDAwXSA9IDB4MDAwMDtcbiAgICAgICAgYmFzZVRhYmxlW2kgfCAweDEwMF0gPSAweDgwMDA7XG4gICAgICAgIHNoaWZ0VGFibGVbaSB8IDB4MDAwXSA9IDI0O1xuICAgICAgICBzaGlmdFRhYmxlW2kgfCAweDEwMF0gPSAyNDtcblxuICAgIC8vIHNtYWxsIG51bWJlciAoZGVub3JtKVxuICAgIH0gZWxzZSBpZiAoZSA8IC0xNCkge1xuICAgICAgICBiYXNlVGFibGVbaSB8IDB4MDAwXSA9ICAweDA0MDAgPj4gKC1lIC0gMTQpO1xuICAgICAgICBiYXNlVGFibGVbaSB8IDB4MTAwXSA9ICgweDA0MDAgPj4gKC1lIC0gMTQpKSB8IDB4ODAwMDtcbiAgICAgICAgc2hpZnRUYWJsZVtpIHwgMHgwMDBdID0gLWUgLSAxO1xuICAgICAgICBzaGlmdFRhYmxlW2kgfCAweDEwMF0gPSAtZSAtIDE7XG5cbiAgICAvLyBub3JtYWwgbnVtYmVyXG4gICAgfSBlbHNlIGlmIChlIDw9IDE1KSB7XG4gICAgICAgIGJhc2VUYWJsZVtpIHwgMHgwMDBdID0gIChlICsgMTUpIDw8IDEwO1xuICAgICAgICBiYXNlVGFibGVbaSB8IDB4MTAwXSA9ICgoZSArIDE1KSA8PCAxMCkgfCAweDgwMDA7XG4gICAgICAgIHNoaWZ0VGFibGVbaSB8IDB4MDAwXSA9IDEzO1xuICAgICAgICBzaGlmdFRhYmxlW2kgfCAweDEwMF0gPSAxMztcblxuICAgIC8vIGxhcmdlIG51bWJlciAoSW5maW5pdHksIC1JbmZpbml0eSlcbiAgICB9IGVsc2UgaWYgKGUgPCAxMjgpIHtcbiAgICAgICAgYmFzZVRhYmxlW2kgfCAweDAwMF0gPSAweDdjMDA7XG4gICAgICAgIGJhc2VUYWJsZVtpIHwgMHgxMDBdID0gMHhmYzAwO1xuICAgICAgICBzaGlmdFRhYmxlW2kgfCAweDAwMF0gPSAyNDtcbiAgICAgICAgc2hpZnRUYWJsZVtpIHwgMHgxMDBdID0gMjQ7XG5cbiAgICAvLyBzdGF5IChOYU4sIEluZmluaXR5LCAtSW5maW5pdHkpXG4gICAgfSBlbHNlIHtcbiAgICAgICAgYmFzZVRhYmxlW2kgfCAweDAwMF0gPSAweDdjMDA7XG4gICAgICAgIGJhc2VUYWJsZVtpIHwgMHgxMDBdID0gMHhmYzAwO1xuICAgICAgICBzaGlmdFRhYmxlW2kgfCAweDAwMF0gPSAxMztcbiAgICAgICAgc2hpZnRUYWJsZVtpIHwgMHgxMDBdID0gMTM7XG4gICAgfVxufVxuXG4vKipcbiAqIHJvdW5kIGEgbnVtYmVyIHRvIGEgaGFsZiBmbG9hdCBudW1iZXIgYml0cy5cbiAqIEBwYXJhbSB7bnVtYmVyfSBudW0gLSBkb3VibGUgZmxvYXRcbiAqIEByZXR1cm5zIHtudW1iZXJ9IGhhbGYgZmxvYXQgbnVtYmVyIGJpdHNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJvdW5kVG9GbG9hdDE2Qml0cyhudW0pIHtcbiAgICBmbG9hdFZpZXdbMF0gPSBudW07XG5cbiAgICBjb25zdCBmID0gdWludDMyVmlld1swXTtcbiAgICBjb25zdCBlID0gKGYgPj4gMjMpICYgMHgxZmY7XG4gICAgcmV0dXJuIGJhc2VUYWJsZVtlXSArICgoZiAmIDB4MDA3ZmZmZmYpID4+IHNoaWZ0VGFibGVbZV0pO1xufVxuXG5cbmNvbnN0IG1hbnRpc3NhVGFibGUgPSBuZXcgVWludDMyQXJyYXkoMjA0OCk7XG5jb25zdCBleHBvbmVudFRhYmxlID0gbmV3IFVpbnQzMkFycmF5KDY0KTtcbmNvbnN0IG9mZnNldFRhYmxlID0gbmV3IFVpbnQzMkFycmF5KDY0KTtcblxubWFudGlzc2FUYWJsZVswXSA9IDA7XG5mb3IobGV0IGkgPSAxOyBpIDwgMTAyNDsgKytpKSB7XG4gICAgbGV0IG0gPSBpIDw8IDEzOyAgICAvLyB6ZXJvIHBhZCBtYW50aXNzYSBiaXRzXG4gICAgbGV0IGUgPSAwOyAgICAgICAgICAvLyB6ZXJvIGV4cG9uZW50XG5cbiAgICAvLyBub3JtYWxpemVkXG4gICAgd2hpbGUoKG0gJiAweDAwODAwMDAwKSA9PT0gMCkge1xuICAgICAgICBlIC09IDB4MDA4MDAwMDA7ICAgIC8vIGRlY3JlbWVudCBleHBvbmVudFxuICAgICAgICBtIDw8PSAxO1xuICAgIH1cblxuICAgIG0gJj0gfjB4MDA4MDAwMDA7ICAgLy8gY2xlYXIgbGVhZGluZyAxIGJpdFxuICAgIGUgKz0gMHgzODgwMDAwMDsgICAgLy8gYWRqdXN0IGJpYXNcblxuICAgIG1hbnRpc3NhVGFibGVbaV0gPSBtIHwgZTtcbn1cbmZvcihsZXQgaSA9IDEwMjQ7IGkgPCAyMDQ4OyArK2kpIHtcbiAgICBtYW50aXNzYVRhYmxlW2ldID0gMHgzODAwMDAwMCArICgoaSAtIDEwMjQpIDw8IDEzKTtcbn1cblxuZXhwb25lbnRUYWJsZVswXSA9IDA7XG5mb3IobGV0IGkgPSAxOyBpIDwgMzE7ICsraSkge1xuICAgIGV4cG9uZW50VGFibGVbaV0gPSBpIDw8IDIzO1xufVxuZXhwb25lbnRUYWJsZVszMV0gPSAweDQ3ODAwMDAwO1xuZXhwb25lbnRUYWJsZVszMl0gPSAweDgwMDAwMDAwO1xuZm9yKGxldCBpID0gMzM7IGkgPCA2MzsgKytpKSB7XG4gICAgZXhwb25lbnRUYWJsZVtpXSA9IDB4ODAwMDAwMDAgKyAoKGkgLSAzMikgPDwgMjMpO1xufVxuZXhwb25lbnRUYWJsZVs2M10gPSAweGM3ODAwMDAwO1xuXG5vZmZzZXRUYWJsZVswXSA9IDA7XG5mb3IobGV0IGkgPSAxOyBpIDwgNjQ7ICsraSkge1xuICAgIGlmIChpID09PSAzMikge1xuICAgICAgICBvZmZzZXRUYWJsZVtpXSA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgb2Zmc2V0VGFibGVbaV0gPSAxMDI0O1xuICAgIH1cbn1cblxuLyoqXG4gKiBjb252ZXJ0IGEgaGFsZiBmbG9hdCBudW1iZXIgYml0cyB0byBhIG51bWJlci5cbiAqIEBwYXJhbSB7bnVtYmVyfSBmbG9hdDE2Yml0cyAtIGhhbGYgZmxvYXQgbnVtYmVyIGJpdHNcbiAqIEByZXR1cm5zIHtudW1iZXJ9IGRvdWJsZSBmbG9hdFxuICovXG5leHBvcnQgZnVuY3Rpb24gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzKSB7XG4gICAgY29uc3QgbSA9IGZsb2F0MTZiaXRzID4+IDEwO1xuICAgIHVpbnQzMlZpZXdbMF0gPSBtYW50aXNzYVRhYmxlW29mZnNldFRhYmxlW21dICsgKGZsb2F0MTZiaXRzICYgMHgzZmYpXSArIGV4cG9uZW50VGFibGVbbV07XG4gICAgcmV0dXJuIGZsb2F0Vmlld1swXTtcbn1cbiIsIi8qKlxuICogQHJldHVybnMgeyhzZWxmOm9iamVjdCkgPT4gb2JqZWN0fVxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUHJpdmF0ZVN0b3JhZ2UoKSB7XG5cdGNvbnN0IHdtID0gbmV3IFdlYWtNYXAoKTtcblx0cmV0dXJuIChzZWxmKSA9PiB7XG5cdFx0bGV0IG9iaiA9IHdtLmdldChzZWxmKTtcblx0XHRpZiAob2JqKSB7XG5cdFx0XHRyZXR1cm4gb2JqO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRvYmogPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXHRcdFx0d20uc2V0KHNlbGYsIG9iaik7XG5cdFx0XHRyZXR1cm4gb2JqO1xuXHRcdH1cblx0fTtcbn1cbiIsIi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB0YXJnZXRcbiAqIEByZXR1cm5zIHtudW1iZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBUb0ludGVnZXIodGFyZ2V0KSB7XG4gICAgbGV0IG51bWJlciA9IHR5cGVvZiB0YXJnZXQgIT09IFwibnVtYmVyXCIgPyBOdW1iZXIodGFyZ2V0KSA6IHRhcmdldDtcbiAgICBpZiAoTnVtYmVyLmlzTmFOKG51bWJlcikpIHtcbiAgICAgICAgbnVtYmVyID0gMDtcbiAgICB9XG4gICAgcmV0dXJuIE1hdGgudHJ1bmMobnVtYmVyKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge251bWJlcn0geFxuICogQHBhcmFtIHtudW1iZXJ9IHlcbiAqIEByZXR1cm5zIHstMSB8IDAgfCAxfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVmYXVsdENvbXBhcmVGdW5jdGlvbih4LCB5KSB7XG4gICAgY29uc3QgW2lzTmFOX3gsIGlzTmFOX3ldID0gW051bWJlci5pc05hTih4KSwgTnVtYmVyLmlzTmFOKHkpXTtcblxuICAgIGlmIChpc05hTl94ICYmIGlzTmFOX3kpIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgaWYgKGlzTmFOX3gpIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgfVxuXG4gICAgaWYgKGlzTmFOX3kpIHtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIGlmICh4IDwgeSkge1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgaWYgKHggPiB5KSB7XG4gICAgICAgIHJldHVybiAxO1xuICAgIH1cblxuICAgIGlmICh4ID09PSAwICYmIHkgPT09IDApIHtcbiAgICAgICAgY29uc3QgW2lzUGx1c1plcm9feCwgaXNQbHVzWmVyb195XSA9IFtPYmplY3QuaXMoeCwgMCksIE9iamVjdC5pcyh5LCAwKV07XG5cbiAgICAgICAgaWYgKCFpc1BsdXNaZXJvX3ggJiYgaXNQbHVzWmVyb195KSB7XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNQbHVzWmVyb194ICYmICFpc1BsdXNaZXJvX3kpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIDA7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmNoYW5nZURwaUJsb2IgPSBjaGFuZ2VEcGlCbG9iO1xuZXhwb3J0cy5jaGFuZ2VEcGlEYXRhVXJsID0gY2hhbmdlRHBpRGF0YVVybDtcblxuZnVuY3Rpb24gX3RvQ29uc3VtYWJsZUFycmF5KGFycikgeyBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7IGZvciAodmFyIGkgPSAwLCBhcnIyID0gQXJyYXkoYXJyLmxlbmd0aCk7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHsgYXJyMltpXSA9IGFycltpXTsgfSByZXR1cm4gYXJyMjsgfSBlbHNlIHsgcmV0dXJuIEFycmF5LmZyb20oYXJyKTsgfSB9XG5cbmZ1bmN0aW9uIGNyZWF0ZVBuZ0RhdGFUYWJsZSgpIHtcbiAgLyogVGFibGUgb2YgQ1JDcyBvZiBhbGwgOC1iaXQgbWVzc2FnZXMuICovXG4gIHZhciBjcmNUYWJsZSA9IG5ldyBJbnQzMkFycmF5KDI1Nik7XG4gIGZvciAodmFyIG4gPSAwOyBuIDwgMjU2OyBuKyspIHtcbiAgICB2YXIgYyA9IG47XG4gICAgZm9yICh2YXIgayA9IDA7IGsgPCA4OyBrKyspIHtcbiAgICAgIGMgPSBjICYgMSA/IDB4ZWRiODgzMjAgXiBjID4+PiAxIDogYyA+Pj4gMTtcbiAgICB9XG4gICAgY3JjVGFibGVbbl0gPSBjO1xuICB9XG4gIHJldHVybiBjcmNUYWJsZTtcbn1cblxuZnVuY3Rpb24gY2FsY0NyYyhidWYpIHtcbiAgdmFyIGMgPSAtMTtcbiAgaWYgKCFwbmdEYXRhVGFibGUpIHBuZ0RhdGFUYWJsZSA9IGNyZWF0ZVBuZ0RhdGFUYWJsZSgpO1xuICBmb3IgKHZhciBuID0gMDsgbiA8IGJ1Zi5sZW5ndGg7IG4rKykge1xuICAgIGMgPSBwbmdEYXRhVGFibGVbKGMgXiBidWZbbl0pICYgMHhGRl0gXiBjID4+PiA4O1xuICB9XG4gIHJldHVybiBjIF4gLTE7XG59XG5cbnZhciBwbmdEYXRhVGFibGUgPSB2b2lkIDA7XG5cbnZhciBQTkcgPSAnaW1hZ2UvcG5nJztcbnZhciBKUEVHID0gJ2ltYWdlL2pwZWcnO1xuXG4vLyB0aG9zZSBhcmUgMyBwb3NzaWJsZSBzaWduYXR1cmUgb2YgdGhlIHBoeXNCbG9jayBpbiBiYXNlNjQuXG4vLyB0aGUgcEhZcyBzaWduYXR1cmUgYmxvY2sgaXMgcHJlY2VlZCBieSB0aGUgNCBieXRlcyBvZiBsZW5naHQuIFRoZSBsZW5ndGggb2Zcbi8vIHRoZSBibG9jayBpcyBhbHdheXMgOSBieXRlcy4gU28gYSBwaHlzIGJsb2NrIGhhcyBhbHdheXMgdGhpcyBzaWduYXR1cmU6XG4vLyAwIDAgMCA5IHAgSCBZIHMuXG4vLyBIb3dldmVyIHRoZSBkYXRhNjQgZW5jb2RpbmcgYWxpZ25zIHdlIHdpbGwgYWx3YXlzIGZpbmQgb25lIG9mIHRob3NlIDMgc3RyaW5ncy5cbi8vIHRoaXMgYWxsb3cgdXMgdG8gZmluZCB0aGlzIHBhcnRpY3VsYXIgb2NjdXJlbmNlIG9mIHRoZSBwSFlzIGJsb2NrIHdpdGhvdXRcbi8vIGNvbnZlcnRpbmcgZnJvbSBiNjQgYmFjayB0byBzdHJpbmdcbnZhciBiNjRQaHlzU2lnbmF0dXJlMSA9ICdBQWx3U0Zseic7XG52YXIgYjY0UGh5c1NpZ25hdHVyZTIgPSAnQUFBSmNFaFonO1xudmFyIGI2NFBoeXNTaWduYXR1cmUzID0gJ0FBQUFDWEJJJztcblxudmFyIF9QID0gJ3AnLmNoYXJDb2RlQXQoMCk7XG52YXIgX0ggPSAnSCcuY2hhckNvZGVBdCgwKTtcbnZhciBfWSA9ICdZJy5jaGFyQ29kZUF0KDApO1xudmFyIF9TID0gJ3MnLmNoYXJDb2RlQXQoMCk7XG5cbmZ1bmN0aW9uIGNoYW5nZURwaUJsb2IoYmxvYiwgZHBpKSB7XG4gIC8vIDMzIGJ5dGVzIGFyZSBvayBmb3IgcG5ncyBhbmQganBlZ3NcbiAgLy8gdG8gY29udGFpbiB0aGUgaW5mb3JtYXRpb24uXG4gIHZhciBoZWFkZXJDaHVuayA9IGJsb2Iuc2xpY2UoMCwgMzMpO1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHZhciBmaWxlUmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICBmaWxlUmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBkYXRhQXJyYXkgPSBuZXcgVWludDhBcnJheShmaWxlUmVhZGVyLnJlc3VsdCk7XG4gICAgICB2YXIgdGFpbCA9IGJsb2Iuc2xpY2UoMzMpO1xuICAgICAgdmFyIGNoYW5nZWRBcnJheSA9IGNoYW5nZURwaU9uQXJyYXkoZGF0YUFycmF5LCBkcGksIGJsb2IudHlwZSk7XG4gICAgICByZXNvbHZlKG5ldyBCbG9iKFtjaGFuZ2VkQXJyYXksIHRhaWxdLCB7IHR5cGU6IGJsb2IudHlwZSB9KSk7XG4gICAgfTtcbiAgICBmaWxlUmVhZGVyLnJlYWRBc0FycmF5QnVmZmVyKGhlYWRlckNodW5rKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGNoYW5nZURwaURhdGFVcmwoYmFzZTY0SW1hZ2UsIGRwaSkge1xuICB2YXIgZGF0YVNwbGl0dGVkID0gYmFzZTY0SW1hZ2Uuc3BsaXQoJywnKTtcbiAgdmFyIGZvcm1hdCA9IGRhdGFTcGxpdHRlZFswXTtcbiAgdmFyIGJvZHkgPSBkYXRhU3BsaXR0ZWRbMV07XG4gIHZhciB0eXBlID0gdm9pZCAwO1xuICB2YXIgaGVhZGVyTGVuZ3RoID0gdm9pZCAwO1xuICB2YXIgb3ZlcndyaXRlcEhZcyA9IGZhbHNlO1xuICBpZiAoZm9ybWF0LmluZGV4T2YoUE5HKSAhPT0gLTEpIHtcbiAgICB0eXBlID0gUE5HO1xuICAgIHZhciBiNjRJbmRleCA9IGRldGVjdFBoeXNDaHVua0Zyb21EYXRhVXJsKGJvZHkpO1xuICAgIC8vIDI4IGJ5dGVzIGluIGRhdGFVcmwgYXJlIDIxYnl0ZXMsIGxlbmd0aCBvZiBwaHlzIGNodW5rIHdpdGggZXZlcnl0aGluZyBpbnNpZGUuXG4gICAgaWYgKGI2NEluZGV4ID49IDApIHtcbiAgICAgIGhlYWRlckxlbmd0aCA9IE1hdGguY2VpbCgoYjY0SW5kZXggKyAyOCkgLyAzKSAqIDQ7XG4gICAgICBvdmVyd3JpdGVwSFlzID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaGVhZGVyTGVuZ3RoID0gMzMgLyAzICogNDtcbiAgICB9XG4gIH1cbiAgaWYgKGZvcm1hdC5pbmRleE9mKEpQRUcpICE9PSAtMSkge1xuICAgIHR5cGUgPSBKUEVHO1xuICAgIGhlYWRlckxlbmd0aCA9IDE4IC8gMyAqIDQ7XG4gIH1cbiAgLy8gMzMgYnl0ZXMgYXJlIG9rIGZvciBwbmdzIGFuZCBqcGVnc1xuICAvLyB0byBjb250YWluIHRoZSBpbmZvcm1hdGlvbi5cbiAgdmFyIHN0cmluZ0hlYWRlciA9IGJvZHkuc3Vic3RyaW5nKDAsIGhlYWRlckxlbmd0aCk7XG4gIHZhciByZXN0T2ZEYXRhID0gYm9keS5zdWJzdHJpbmcoaGVhZGVyTGVuZ3RoKTtcbiAgdmFyIGhlYWRlckJ5dGVzID0gYXRvYihzdHJpbmdIZWFkZXIpO1xuICB2YXIgZGF0YUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoaGVhZGVyQnl0ZXMubGVuZ3RoKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICBkYXRhQXJyYXlbaV0gPSBoZWFkZXJCeXRlcy5jaGFyQ29kZUF0KGkpO1xuICB9XG4gIHZhciBmaW5hbEFycmF5ID0gY2hhbmdlRHBpT25BcnJheShkYXRhQXJyYXksIGRwaSwgdHlwZSwgb3ZlcndyaXRlcEhZcyk7XG4gIHZhciBiYXNlNjRIZWFkZXIgPSBidG9hKFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoU3RyaW5nLCBfdG9Db25zdW1hYmxlQXJyYXkoZmluYWxBcnJheSkpKTtcbiAgcmV0dXJuIFtmb3JtYXQsICcsJywgYmFzZTY0SGVhZGVyLCByZXN0T2ZEYXRhXS5qb2luKCcnKTtcbn1cblxuZnVuY3Rpb24gZGV0ZWN0UGh5c0NodW5rRnJvbURhdGFVcmwoZGF0YSkge1xuICB2YXIgYjY0aW5kZXggPSBkYXRhLmluZGV4T2YoYjY0UGh5c1NpZ25hdHVyZTEpO1xuICBpZiAoYjY0aW5kZXggPT09IC0xKSB7XG4gICAgYjY0aW5kZXggPSBkYXRhLmluZGV4T2YoYjY0UGh5c1NpZ25hdHVyZTIpO1xuICB9XG4gIGlmIChiNjRpbmRleCA9PT0gLTEpIHtcbiAgICBiNjRpbmRleCA9IGRhdGEuaW5kZXhPZihiNjRQaHlzU2lnbmF0dXJlMyk7XG4gIH1cbiAgLy8gaWYgYjY0aW5kZXggPT09IC0xIGNodW5rIGlzIG5vdCBmb3VuZFxuICByZXR1cm4gYjY0aW5kZXg7XG59XG5cbmZ1bmN0aW9uIHNlYXJjaFN0YXJ0T2ZQaHlzKGRhdGEpIHtcbiAgdmFyIGxlbmd0aCA9IGRhdGEubGVuZ3RoIC0gMTtcbiAgLy8gd2UgY2hlY2sgZnJvbSB0aGUgZW5kIHNpbmNlIHdlIGN1dCB0aGUgc3RyaW5nIGluIHByb3hpbWl0eSBvZiB0aGUgaGVhZGVyXG4gIC8vIHRoZSBoZWFkZXIgaXMgd2l0aGluIDIxIGJ5dGVzIGZyb20gdGhlIGVuZC5cbiAgZm9yICh2YXIgaSA9IGxlbmd0aDsgaSA+PSA0OyBpLS0pIHtcbiAgICBpZiAoZGF0YVtpIC0gNF0gPT09IDkgJiYgZGF0YVtpIC0gM10gPT09IF9QICYmIGRhdGFbaSAtIDJdID09PSBfSCAmJiBkYXRhW2kgLSAxXSA9PT0gX1kgJiYgZGF0YVtpXSA9PT0gX1MpIHtcbiAgICAgIHJldHVybiBpIC0gMztcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gY2hhbmdlRHBpT25BcnJheShkYXRhQXJyYXksIGRwaSwgZm9ybWF0LCBvdmVyd3JpdGVwSFlzKSB7XG4gIGlmIChmb3JtYXQgPT09IEpQRUcpIHtcbiAgICBkYXRhQXJyYXlbMTNdID0gMTsgLy8gMSBwaXhlbCBwZXIgaW5jaCBvciAyIHBpeGVsIHBlciBjbVxuICAgIGRhdGFBcnJheVsxNF0gPSBkcGkgPj4gODsgLy8gZHBpWCBoaWdoIGJ5dGVcbiAgICBkYXRhQXJyYXlbMTVdID0gZHBpICYgMHhmZjsgLy8gZHBpWCBsb3cgYnl0ZVxuICAgIGRhdGFBcnJheVsxNl0gPSBkcGkgPj4gODsgLy8gZHBpWSBoaWdoIGJ5dGVcbiAgICBkYXRhQXJyYXlbMTddID0gZHBpICYgMHhmZjsgLy8gZHBpWSBsb3cgYnl0ZVxuICAgIHJldHVybiBkYXRhQXJyYXk7XG4gIH1cbiAgaWYgKGZvcm1hdCA9PT0gUE5HKSB7XG4gICAgdmFyIHBoeXNDaHVuayA9IG5ldyBVaW50OEFycmF5KDEzKTtcbiAgICAvLyBjaHVuayBoZWFkZXIgcEhZc1xuICAgIC8vIDkgYnl0ZXMgb2YgZGF0YVxuICAgIC8vIDQgYnl0ZXMgb2YgY3JjXG4gICAgLy8gdGhpcyBtdWx0aXBsaWNhdGlvbiBpcyBiZWNhdXNlIHRoZSBzdGFuZGFyZCBpcyBkcGkgcGVyIG1ldGVyLlxuICAgIGRwaSAqPSAzOS4zNzAxO1xuICAgIHBoeXNDaHVua1swXSA9IF9QO1xuICAgIHBoeXNDaHVua1sxXSA9IF9IO1xuICAgIHBoeXNDaHVua1syXSA9IF9ZO1xuICAgIHBoeXNDaHVua1szXSA9IF9TO1xuICAgIHBoeXNDaHVua1s0XSA9IGRwaSA+Pj4gMjQ7IC8vIGRwaVggaGlnaGVzdCBieXRlXG4gICAgcGh5c0NodW5rWzVdID0gZHBpID4+PiAxNjsgLy8gZHBpWCB2ZXJ5aGlnaCBieXRlXG4gICAgcGh5c0NodW5rWzZdID0gZHBpID4+PiA4OyAvLyBkcGlYIGhpZ2ggYnl0ZVxuICAgIHBoeXNDaHVua1s3XSA9IGRwaSAmIDB4ZmY7IC8vIGRwaVggbG93IGJ5dGVcbiAgICBwaHlzQ2h1bmtbOF0gPSBwaHlzQ2h1bmtbNF07IC8vIGRwaVkgaGlnaGVzdCBieXRlXG4gICAgcGh5c0NodW5rWzldID0gcGh5c0NodW5rWzVdOyAvLyBkcGlZIHZlcnloaWdoIGJ5dGVcbiAgICBwaHlzQ2h1bmtbMTBdID0gcGh5c0NodW5rWzZdOyAvLyBkcGlZIGhpZ2ggYnl0ZVxuICAgIHBoeXNDaHVua1sxMV0gPSBwaHlzQ2h1bmtbN107IC8vIGRwaVkgbG93IGJ5dGVcbiAgICBwaHlzQ2h1bmtbMTJdID0gMTsgLy8gZG90IHBlciBtZXRlci4uLi5cblxuICAgIHZhciBjcmMgPSBjYWxjQ3JjKHBoeXNDaHVuayk7XG5cbiAgICB2YXIgY3JjQ2h1bmsgPSBuZXcgVWludDhBcnJheSg0KTtcbiAgICBjcmNDaHVua1swXSA9IGNyYyA+Pj4gMjQ7XG4gICAgY3JjQ2h1bmtbMV0gPSBjcmMgPj4+IDE2O1xuICAgIGNyY0NodW5rWzJdID0gY3JjID4+PiA4O1xuICAgIGNyY0NodW5rWzNdID0gY3JjICYgMHhmZjtcblxuICAgIGlmIChvdmVyd3JpdGVwSFlzKSB7XG4gICAgICB2YXIgc3RhcnRpbmdJbmRleCA9IHNlYXJjaFN0YXJ0T2ZQaHlzKGRhdGFBcnJheSk7XG4gICAgICBkYXRhQXJyYXkuc2V0KHBoeXNDaHVuaywgc3RhcnRpbmdJbmRleCk7XG4gICAgICBkYXRhQXJyYXkuc2V0KGNyY0NodW5rLCBzdGFydGluZ0luZGV4ICsgMTMpO1xuICAgICAgcmV0dXJuIGRhdGFBcnJheTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gaSBuZWVkIHRvIGdpdmUgYmFjayBhbiBhcnJheSBvZiBkYXRhIHRoYXQgaXMgZGl2aXNpYmxlIGJ5IDMgc28gdGhhdFxuICAgICAgLy8gZGF0YXVybCBlbmNvZGluZyBnaXZlcyBtZSBpbnRlZ2VycywgZm9yIGx1Y2sgdGhpcyBjaHVuayBpcyAxNyArIDQgPSAyMVxuICAgICAgLy8gaWYgaXQgd2FzIHdlIGNvdWxkIGFkZCBhIHRleHQgY2h1bmsgY29udGFuaW5nIHNvbWUgaW5mbywgdW50aWxsIGRlc2lyZWRcbiAgICAgIC8vIGxlbmd0aCBpcyBtZXQuXG5cbiAgICAgIC8vIGNodW5rIHN0cnVjdHVyIDQgYnl0ZXMgZm9yIGxlbmd0aCBpcyA5XG4gICAgICB2YXIgY2h1bmtMZW5ndGggPSBuZXcgVWludDhBcnJheSg0KTtcbiAgICAgIGNodW5rTGVuZ3RoWzBdID0gMDtcbiAgICAgIGNodW5rTGVuZ3RoWzFdID0gMDtcbiAgICAgIGNodW5rTGVuZ3RoWzJdID0gMDtcbiAgICAgIGNodW5rTGVuZ3RoWzNdID0gOTtcblxuICAgICAgdmFyIGZpbmFsSGVhZGVyID0gbmV3IFVpbnQ4QXJyYXkoNTQpO1xuICAgICAgZmluYWxIZWFkZXIuc2V0KGRhdGFBcnJheSwgMCk7XG4gICAgICBmaW5hbEhlYWRlci5zZXQoY2h1bmtMZW5ndGgsIDMzKTtcbiAgICAgIGZpbmFsSGVhZGVyLnNldChwaHlzQ2h1bmssIDM3KTtcbiAgICAgIGZpbmFsSGVhZGVyLnNldChjcmNDaHVuaywgNTApO1xuICAgICAgcmV0dXJuIGZpbmFsSGVhZGVyO1xuICAgIH1cbiAgfVxufSIsIihmdW5jdGlvbihhLGIpe2lmKFwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZClkZWZpbmUoW10sYik7ZWxzZSBpZihcInVuZGVmaW5lZFwiIT10eXBlb2YgZXhwb3J0cyliKCk7ZWxzZXtiKCksYS5GaWxlU2F2ZXI9e2V4cG9ydHM6e319LmV4cG9ydHN9fSkodGhpcyxmdW5jdGlvbigpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIGIoYSxiKXtyZXR1cm5cInVuZGVmaW5lZFwiPT10eXBlb2YgYj9iPXthdXRvQm9tOiExfTpcIm9iamVjdFwiIT10eXBlb2YgYiYmKGNvbnNvbGUud2FybihcIkRlcHJlY2F0ZWQ6IEV4cGVjdGVkIHRoaXJkIGFyZ3VtZW50IHRvIGJlIGEgb2JqZWN0XCIpLGI9e2F1dG9Cb206IWJ9KSxiLmF1dG9Cb20mJi9eXFxzKig/OnRleHRcXC9cXFMqfGFwcGxpY2F0aW9uXFwveG1sfFxcUypcXC9cXFMqXFwreG1sKVxccyo7LipjaGFyc2V0XFxzKj1cXHMqdXRmLTgvaS50ZXN0KGEudHlwZSk/bmV3IEJsb2IoW1wiXFx1RkVGRlwiLGFdLHt0eXBlOmEudHlwZX0pOmF9ZnVuY3Rpb24gYyhhLGIsYyl7dmFyIGQ9bmV3IFhNTEh0dHBSZXF1ZXN0O2Qub3BlbihcIkdFVFwiLGEpLGQucmVzcG9uc2VUeXBlPVwiYmxvYlwiLGQub25sb2FkPWZ1bmN0aW9uKCl7ZyhkLnJlc3BvbnNlLGIsYyl9LGQub25lcnJvcj1mdW5jdGlvbigpe2NvbnNvbGUuZXJyb3IoXCJjb3VsZCBub3QgZG93bmxvYWQgZmlsZVwiKX0sZC5zZW5kKCl9ZnVuY3Rpb24gZChhKXt2YXIgYj1uZXcgWE1MSHR0cFJlcXVlc3Q7Yi5vcGVuKFwiSEVBRFwiLGEsITEpO3RyeXtiLnNlbmQoKX1jYXRjaChhKXt9cmV0dXJuIDIwMDw9Yi5zdGF0dXMmJjI5OT49Yi5zdGF0dXN9ZnVuY3Rpb24gZShhKXt0cnl7YS5kaXNwYXRjaEV2ZW50KG5ldyBNb3VzZUV2ZW50KFwiY2xpY2tcIikpfWNhdGNoKGMpe3ZhciBiPWRvY3VtZW50LmNyZWF0ZUV2ZW50KFwiTW91c2VFdmVudHNcIik7Yi5pbml0TW91c2VFdmVudChcImNsaWNrXCIsITAsITAsd2luZG93LDAsMCwwLDgwLDIwLCExLCExLCExLCExLDAsbnVsbCksYS5kaXNwYXRjaEV2ZW50KGIpfX12YXIgZj1cIm9iamVjdFwiPT10eXBlb2Ygd2luZG93JiZ3aW5kb3cud2luZG93PT09d2luZG93P3dpbmRvdzpcIm9iamVjdFwiPT10eXBlb2Ygc2VsZiYmc2VsZi5zZWxmPT09c2VsZj9zZWxmOlwib2JqZWN0XCI9PXR5cGVvZiBnbG9iYWwmJmdsb2JhbC5nbG9iYWw9PT1nbG9iYWw/Z2xvYmFsOnZvaWQgMCxhPWYubmF2aWdhdG9yJiYvTWFjaW50b3NoLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpJiYvQXBwbGVXZWJLaXQvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkmJiEvU2FmYXJpLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpLGc9Zi5zYXZlQXN8fChcIm9iamVjdFwiIT10eXBlb2Ygd2luZG93fHx3aW5kb3chPT1mP2Z1bmN0aW9uKCl7fTpcImRvd25sb2FkXCJpbiBIVE1MQW5jaG9yRWxlbWVudC5wcm90b3R5cGUmJiFhP2Z1bmN0aW9uKGIsZyxoKXt2YXIgaT1mLlVSTHx8Zi53ZWJraXRVUkwsaj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtnPWd8fGIubmFtZXx8XCJkb3dubG9hZFwiLGouZG93bmxvYWQ9ZyxqLnJlbD1cIm5vb3BlbmVyXCIsXCJzdHJpbmdcIj09dHlwZW9mIGI/KGouaHJlZj1iLGoub3JpZ2luPT09bG9jYXRpb24ub3JpZ2luP2Uoaik6ZChqLmhyZWYpP2MoYixnLGgpOmUoaixqLnRhcmdldD1cIl9ibGFua1wiKSk6KGouaHJlZj1pLmNyZWF0ZU9iamVjdFVSTChiKSxzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7aS5yZXZva2VPYmplY3RVUkwoai5ocmVmKX0sNEU0KSxzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7ZShqKX0sMCkpfTpcIm1zU2F2ZU9yT3BlbkJsb2JcImluIG5hdmlnYXRvcj9mdW5jdGlvbihmLGcsaCl7aWYoZz1nfHxmLm5hbWV8fFwiZG93bmxvYWRcIixcInN0cmluZ1wiIT10eXBlb2YgZiluYXZpZ2F0b3IubXNTYXZlT3JPcGVuQmxvYihiKGYsaCksZyk7ZWxzZSBpZihkKGYpKWMoZixnLGgpO2Vsc2V7dmFyIGk9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7aS5ocmVmPWYsaS50YXJnZXQ9XCJfYmxhbmtcIixzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7ZShpKX0pfX06ZnVuY3Rpb24oYixkLGUsZyl7aWYoZz1nfHxvcGVuKFwiXCIsXCJfYmxhbmtcIiksZyYmKGcuZG9jdW1lbnQudGl0bGU9Zy5kb2N1bWVudC5ib2R5LmlubmVyVGV4dD1cImRvd25sb2FkaW5nLi4uXCIpLFwic3RyaW5nXCI9PXR5cGVvZiBiKXJldHVybiBjKGIsZCxlKTt2YXIgaD1cImFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbVwiPT09Yi50eXBlLGk9L2NvbnN0cnVjdG9yL2kudGVzdChmLkhUTUxFbGVtZW50KXx8Zi5zYWZhcmksaj0vQ3JpT1NcXC9bXFxkXSsvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7aWYoKGp8fGgmJml8fGEpJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgRmlsZVJlYWRlcil7dmFyIGs9bmV3IEZpbGVSZWFkZXI7ay5vbmxvYWRlbmQ9ZnVuY3Rpb24oKXt2YXIgYT1rLnJlc3VsdDthPWo/YTphLnJlcGxhY2UoL15kYXRhOlteO10qOy8sXCJkYXRhOmF0dGFjaG1lbnQvZmlsZTtcIiksZz9nLmxvY2F0aW9uLmhyZWY9YTpsb2NhdGlvbj1hLGc9bnVsbH0say5yZWFkQXNEYXRhVVJMKGIpfWVsc2V7dmFyIGw9Zi5VUkx8fGYud2Via2l0VVJMLG09bC5jcmVhdGVPYmplY3RVUkwoYik7Zz9nLmxvY2F0aW9uPW06bG9jYXRpb24uaHJlZj1tLGc9bnVsbCxzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7bC5yZXZva2VPYmplY3RVUkwobSl9LDRFNCl9fSk7Zi5zYXZlQXM9Zy5zYXZlQXM9ZyxcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlJiYobW9kdWxlLmV4cG9ydHM9Zyl9KTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9RmlsZVNhdmVyLm1pbi5qcy5tYXAiLCJpbXBvcnQgaGFzaENsZWFyIGZyb20gJy4vX2hhc2hDbGVhci5qcyc7XG5pbXBvcnQgaGFzaERlbGV0ZSBmcm9tICcuL19oYXNoRGVsZXRlLmpzJztcbmltcG9ydCBoYXNoR2V0IGZyb20gJy4vX2hhc2hHZXQuanMnO1xuaW1wb3J0IGhhc2hIYXMgZnJvbSAnLi9faGFzaEhhcy5qcyc7XG5pbXBvcnQgaGFzaFNldCBmcm9tICcuL19oYXNoU2V0LmpzJztcblxuLyoqXG4gKiBDcmVhdGVzIGEgaGFzaCBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIEhhc2goZW50cmllcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGVudHJpZXMgPT0gbnVsbCA/IDAgOiBlbnRyaWVzLmxlbmd0aDtcblxuICB0aGlzLmNsZWFyKCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGVudHJ5ID0gZW50cmllc1tpbmRleF07XG4gICAgdGhpcy5zZXQoZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgfVxufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgSGFzaGAuXG5IYXNoLnByb3RvdHlwZS5jbGVhciA9IGhhc2hDbGVhcjtcbkhhc2gucHJvdG90eXBlWydkZWxldGUnXSA9IGhhc2hEZWxldGU7XG5IYXNoLnByb3RvdHlwZS5nZXQgPSBoYXNoR2V0O1xuSGFzaC5wcm90b3R5cGUuaGFzID0gaGFzaEhhcztcbkhhc2gucHJvdG90eXBlLnNldCA9IGhhc2hTZXQ7XG5cbmV4cG9ydCBkZWZhdWx0IEhhc2g7XG4iLCJpbXBvcnQgbGlzdENhY2hlQ2xlYXIgZnJvbSAnLi9fbGlzdENhY2hlQ2xlYXIuanMnO1xuaW1wb3J0IGxpc3RDYWNoZURlbGV0ZSBmcm9tICcuL19saXN0Q2FjaGVEZWxldGUuanMnO1xuaW1wb3J0IGxpc3RDYWNoZUdldCBmcm9tICcuL19saXN0Q2FjaGVHZXQuanMnO1xuaW1wb3J0IGxpc3RDYWNoZUhhcyBmcm9tICcuL19saXN0Q2FjaGVIYXMuanMnO1xuaW1wb3J0IGxpc3RDYWNoZVNldCBmcm9tICcuL19saXN0Q2FjaGVTZXQuanMnO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gbGlzdCBjYWNoZSBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIExpc3RDYWNoZShlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBMaXN0Q2FjaGVgLlxuTGlzdENhY2hlLnByb3RvdHlwZS5jbGVhciA9IGxpc3RDYWNoZUNsZWFyO1xuTGlzdENhY2hlLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBsaXN0Q2FjaGVEZWxldGU7XG5MaXN0Q2FjaGUucHJvdG90eXBlLmdldCA9IGxpc3RDYWNoZUdldDtcbkxpc3RDYWNoZS5wcm90b3R5cGUuaGFzID0gbGlzdENhY2hlSGFzO1xuTGlzdENhY2hlLnByb3RvdHlwZS5zZXQgPSBsaXN0Q2FjaGVTZXQ7XG5cbmV4cG9ydCBkZWZhdWx0IExpc3RDYWNoZTtcbiIsImltcG9ydCBnZXROYXRpdmUgZnJvbSAnLi9fZ2V0TmF0aXZlLmpzJztcbmltcG9ydCByb290IGZyb20gJy4vX3Jvb3QuanMnO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgTWFwID0gZ2V0TmF0aXZlKHJvb3QsICdNYXAnKTtcblxuZXhwb3J0IGRlZmF1bHQgTWFwO1xuIiwiaW1wb3J0IG1hcENhY2hlQ2xlYXIgZnJvbSAnLi9fbWFwQ2FjaGVDbGVhci5qcyc7XG5pbXBvcnQgbWFwQ2FjaGVEZWxldGUgZnJvbSAnLi9fbWFwQ2FjaGVEZWxldGUuanMnO1xuaW1wb3J0IG1hcENhY2hlR2V0IGZyb20gJy4vX21hcENhY2hlR2V0LmpzJztcbmltcG9ydCBtYXBDYWNoZUhhcyBmcm9tICcuL19tYXBDYWNoZUhhcy5qcyc7XG5pbXBvcnQgbWFwQ2FjaGVTZXQgZnJvbSAnLi9fbWFwQ2FjaGVTZXQuanMnO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBtYXAgY2FjaGUgb2JqZWN0IHRvIHN0b3JlIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gTWFwQ2FjaGUoZW50cmllcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGVudHJpZXMgPT0gbnVsbCA/IDAgOiBlbnRyaWVzLmxlbmd0aDtcblxuICB0aGlzLmNsZWFyKCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGVudHJ5ID0gZW50cmllc1tpbmRleF07XG4gICAgdGhpcy5zZXQoZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgfVxufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgTWFwQ2FjaGVgLlxuTWFwQ2FjaGUucHJvdG90eXBlLmNsZWFyID0gbWFwQ2FjaGVDbGVhcjtcbk1hcENhY2hlLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBtYXBDYWNoZURlbGV0ZTtcbk1hcENhY2hlLnByb3RvdHlwZS5nZXQgPSBtYXBDYWNoZUdldDtcbk1hcENhY2hlLnByb3RvdHlwZS5oYXMgPSBtYXBDYWNoZUhhcztcbk1hcENhY2hlLnByb3RvdHlwZS5zZXQgPSBtYXBDYWNoZVNldDtcblxuZXhwb3J0IGRlZmF1bHQgTWFwQ2FjaGU7XG4iLCJpbXBvcnQgcm9vdCBmcm9tICcuL19yb290LmpzJztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgU3ltYm9sID0gcm9vdC5TeW1ib2w7XG5cbmV4cG9ydCBkZWZhdWx0IFN5bWJvbDtcbiIsImltcG9ydCBlcSBmcm9tICcuL2VxLmpzJztcblxuLyoqXG4gKiBHZXRzIHRoZSBpbmRleCBhdCB3aGljaCB0aGUgYGtleWAgaXMgZm91bmQgaW4gYGFycmF5YCBvZiBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHsqfSBrZXkgVGhlIGtleSB0byBzZWFyY2ggZm9yLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG1hdGNoZWQgdmFsdWUsIGVsc2UgYC0xYC5cbiAqL1xuZnVuY3Rpb24gYXNzb2NJbmRleE9mKGFycmF5LCBrZXkpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcbiAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgaWYgKGVxKGFycmF5W2xlbmd0aF1bMF0sIGtleSkpIHtcbiAgICAgIHJldHVybiBsZW5ndGg7XG4gICAgfVxuICB9XG4gIHJldHVybiAtMTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXNzb2NJbmRleE9mO1xuIiwiaW1wb3J0IFN5bWJvbCBmcm9tICcuL19TeW1ib2wuanMnO1xuaW1wb3J0IGdldFJhd1RhZyBmcm9tICcuL19nZXRSYXdUYWcuanMnO1xuaW1wb3J0IG9iamVjdFRvU3RyaW5nIGZyb20gJy4vX29iamVjdFRvU3RyaW5nLmpzJztcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIG51bGxUYWcgPSAnW29iamVjdCBOdWxsXScsXG4gICAgdW5kZWZpbmVkVGFnID0gJ1tvYmplY3QgVW5kZWZpbmVkXSc7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHN5bVRvU3RyaW5nVGFnID0gU3ltYm9sID8gU3ltYm9sLnRvU3RyaW5nVGFnIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBnZXRUYWdgIHdpdGhvdXQgZmFsbGJhY2tzIGZvciBidWdneSBlbnZpcm9ubWVudHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUdldFRhZyh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkVGFnIDogbnVsbFRhZztcbiAgfVxuICByZXR1cm4gKHN5bVRvU3RyaW5nVGFnICYmIHN5bVRvU3RyaW5nVGFnIGluIE9iamVjdCh2YWx1ZSkpXG4gICAgPyBnZXRSYXdUYWcodmFsdWUpXG4gICAgOiBvYmplY3RUb1N0cmluZyh2YWx1ZSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGJhc2VHZXRUYWc7XG4iLCJpbXBvcnQgYmFzZUdldFRhZyBmcm9tICcuL19iYXNlR2V0VGFnLmpzJztcbmltcG9ydCBpc09iamVjdExpa2UgZnJvbSAnLi9pc09iamVjdExpa2UuanMnO1xuXG52YXIgYXJyYXlCdWZmZXJUYWcgPSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzQXJyYXlCdWZmZXJgIHdpdGhvdXQgTm9kZS5qcyBvcHRpbWl6YXRpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGFycmF5IGJ1ZmZlciwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNBcnJheUJ1ZmZlcih2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBiYXNlR2V0VGFnKHZhbHVlKSA9PSBhcnJheUJ1ZmZlclRhZztcbn1cblxuZXhwb3J0IGRlZmF1bHQgYmFzZUlzQXJyYXlCdWZmZXI7XG4iLCJpbXBvcnQgaXNGdW5jdGlvbiBmcm9tICcuL2lzRnVuY3Rpb24uanMnO1xuaW1wb3J0IGlzTWFza2VkIGZyb20gJy4vX2lzTWFza2VkLmpzJztcbmltcG9ydCBpc09iamVjdCBmcm9tICcuL2lzT2JqZWN0LmpzJztcbmltcG9ydCB0b1NvdXJjZSBmcm9tICcuL190b1NvdXJjZS5qcyc7XG5cbi8qKlxuICogVXNlZCB0byBtYXRjaCBgUmVnRXhwYFxuICogW3N5bnRheCBjaGFyYWN0ZXJzXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1wYXR0ZXJucykuXG4gKi9cbnZhciByZVJlZ0V4cENoYXIgPSAvW1xcXFxeJC4qKz8oKVtcXF17fXxdL2c7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBob3N0IGNvbnN0cnVjdG9ycyAoU2FmYXJpKS4gKi9cbnZhciByZUlzSG9zdEN0b3IgPSAvXlxcW29iamVjdCAuKz9Db25zdHJ1Y3RvclxcXSQvO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgZnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlLFxuICAgIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZ1bmNUb1N0cmluZyA9IGZ1bmNQcm90by50b1N0cmluZztcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGlmIGEgbWV0aG9kIGlzIG5hdGl2ZS4gKi9cbnZhciByZUlzTmF0aXZlID0gUmVnRXhwKCdeJyArXG4gIGZ1bmNUb1N0cmluZy5jYWxsKGhhc093blByb3BlcnR5KS5yZXBsYWNlKHJlUmVnRXhwQ2hhciwgJ1xcXFwkJicpXG4gIC5yZXBsYWNlKC9oYXNPd25Qcm9wZXJ0eXwoZnVuY3Rpb24pLio/KD89XFxcXFxcKCl8IGZvciAuKz8oPz1cXFxcXFxdKS9nLCAnJDEuKj8nKSArICckJ1xuKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc05hdGl2ZWAgd2l0aG91dCBiYWQgc2hpbSBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBuYXRpdmUgZnVuY3Rpb24sXG4gKiAgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNOYXRpdmUodmFsdWUpIHtcbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkgfHwgaXNNYXNrZWQodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBwYXR0ZXJuID0gaXNGdW5jdGlvbih2YWx1ZSkgPyByZUlzTmF0aXZlIDogcmVJc0hvc3RDdG9yO1xuICByZXR1cm4gcGF0dGVybi50ZXN0KHRvU291cmNlKHZhbHVlKSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGJhc2VJc05hdGl2ZTtcbiIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udW5hcnlgIHdpdGhvdXQgc3VwcG9ydCBmb3Igc3RvcmluZyBtZXRhZGF0YS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY2FwIGFyZ3VtZW50cyBmb3IuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBjYXBwZWQgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VVbmFyeShmdW5jKSB7XG4gIHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiBmdW5jKHZhbHVlKTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYmFzZVVuYXJ5O1xuIiwiaW1wb3J0IHJvb3QgZnJvbSAnLi9fcm9vdC5qcyc7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBvdmVycmVhY2hpbmcgY29yZS1qcyBzaGltcy4gKi9cbnZhciBjb3JlSnNEYXRhID0gcm9vdFsnX19jb3JlLWpzX3NoYXJlZF9fJ107XG5cbmV4cG9ydCBkZWZhdWx0IGNvcmVKc0RhdGE7XG4iLCIvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGdsb2JhbGAgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVHbG9iYWwgPSB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbCAmJiBnbG9iYWwuT2JqZWN0ID09PSBPYmplY3QgJiYgZ2xvYmFsO1xuXG5leHBvcnQgZGVmYXVsdCBmcmVlR2xvYmFsO1xuIiwiaW1wb3J0IGlzS2V5YWJsZSBmcm9tICcuL19pc0tleWFibGUuanMnO1xuXG4vKipcbiAqIEdldHMgdGhlIGRhdGEgZm9yIGBtYXBgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gbWFwIFRoZSBtYXAgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSByZWZlcmVuY2Uga2V5LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIG1hcCBkYXRhLlxuICovXG5mdW5jdGlvbiBnZXRNYXBEYXRhKG1hcCwga2V5KSB7XG4gIHZhciBkYXRhID0gbWFwLl9fZGF0YV9fO1xuICByZXR1cm4gaXNLZXlhYmxlKGtleSlcbiAgICA/IGRhdGFbdHlwZW9mIGtleSA9PSAnc3RyaW5nJyA/ICdzdHJpbmcnIDogJ2hhc2gnXVxuICAgIDogZGF0YS5tYXA7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldE1hcERhdGE7XG4iLCJpbXBvcnQgYmFzZUlzTmF0aXZlIGZyb20gJy4vX2Jhc2VJc05hdGl2ZS5qcyc7XG5pbXBvcnQgZ2V0VmFsdWUgZnJvbSAnLi9fZ2V0VmFsdWUuanMnO1xuXG4vKipcbiAqIEdldHMgdGhlIG5hdGl2ZSBmdW5jdGlvbiBhdCBga2V5YCBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBtZXRob2QgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGZ1bmN0aW9uIGlmIGl0J3MgbmF0aXZlLCBlbHNlIGB1bmRlZmluZWRgLlxuICovXG5mdW5jdGlvbiBnZXROYXRpdmUob2JqZWN0LCBrZXkpIHtcbiAgdmFyIHZhbHVlID0gZ2V0VmFsdWUob2JqZWN0LCBrZXkpO1xuICByZXR1cm4gYmFzZUlzTmF0aXZlKHZhbHVlKSA/IHZhbHVlIDogdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZGVmYXVsdCBnZXROYXRpdmU7XG4iLCJpbXBvcnQgU3ltYm9sIGZyb20gJy4vX1N5bWJvbC5qcyc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBuYXRpdmVPYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1Ub1N0cmluZ1RhZyA9IFN5bWJvbCA/IFN5bWJvbC50b1N0cmluZ1RhZyA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VHZXRUYWdgIHdoaWNoIGlnbm9yZXMgYFN5bWJvbC50b1N0cmluZ1RhZ2AgdmFsdWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHJhdyBgdG9TdHJpbmdUYWdgLlxuICovXG5mdW5jdGlvbiBnZXRSYXdUYWcodmFsdWUpIHtcbiAgdmFyIGlzT3duID0gaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgc3ltVG9TdHJpbmdUYWcpLFxuICAgICAgdGFnID0gdmFsdWVbc3ltVG9TdHJpbmdUYWddO1xuXG4gIHRyeSB7XG4gICAgdmFsdWVbc3ltVG9TdHJpbmdUYWddID0gdW5kZWZpbmVkO1xuICAgIHZhciB1bm1hc2tlZCA9IHRydWU7XG4gIH0gY2F0Y2ggKGUpIHt9XG5cbiAgdmFyIHJlc3VsdCA9IG5hdGl2ZU9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICBpZiAodW5tYXNrZWQpIHtcbiAgICBpZiAoaXNPd24pIHtcbiAgICAgIHZhbHVlW3N5bVRvU3RyaW5nVGFnXSA9IHRhZztcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0UmF3VGFnO1xuIiwiLyoqXG4gKiBHZXRzIHRoZSB2YWx1ZSBhdCBga2V5YCBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3RdIFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBwcm9wZXJ0eSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gZ2V0VmFsdWUob2JqZWN0LCBrZXkpIHtcbiAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldFZhbHVlO1xuIiwiaW1wb3J0IG5hdGl2ZUNyZWF0ZSBmcm9tICcuL19uYXRpdmVDcmVhdGUuanMnO1xuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIGhhc2guXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgSGFzaFxuICovXG5mdW5jdGlvbiBoYXNoQ2xlYXIoKSB7XG4gIHRoaXMuX19kYXRhX18gPSBuYXRpdmVDcmVhdGUgPyBuYXRpdmVDcmVhdGUobnVsbCkgOiB7fTtcbiAgdGhpcy5zaXplID0gMDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaGFzaENsZWFyO1xuIiwiLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgaGFzaC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtPYmplY3R9IGhhc2ggVGhlIGhhc2ggdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGhhc2hEZWxldGUoa2V5KSB7XG4gIHZhciByZXN1bHQgPSB0aGlzLmhhcyhrZXkpICYmIGRlbGV0ZSB0aGlzLl9fZGF0YV9fW2tleV07XG4gIHRoaXMuc2l6ZSAtPSByZXN1bHQgPyAxIDogMDtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaGFzaERlbGV0ZTtcbiIsImltcG9ydCBuYXRpdmVDcmVhdGUgZnJvbSAnLi9fbmF0aXZlQ3JlYXRlLmpzJztcblxuLyoqIFVzZWQgdG8gc3RhbmQtaW4gZm9yIGB1bmRlZmluZWRgIGhhc2ggdmFsdWVzLiAqL1xudmFyIEhBU0hfVU5ERUZJTkVEID0gJ19fbG9kYXNoX2hhc2hfdW5kZWZpbmVkX18nO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIEdldHMgdGhlIGhhc2ggdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gaGFzaEdldChrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICBpZiAobmF0aXZlQ3JlYXRlKSB7XG4gICAgdmFyIHJlc3VsdCA9IGRhdGFba2V5XTtcbiAgICByZXR1cm4gcmVzdWx0ID09PSBIQVNIX1VOREVGSU5FRCA/IHVuZGVmaW5lZCA6IHJlc3VsdDtcbiAgfVxuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChkYXRhLCBrZXkpID8gZGF0YVtrZXldIDogdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZGVmYXVsdCBoYXNoR2V0O1xuIiwiaW1wb3J0IG5hdGl2ZUNyZWF0ZSBmcm9tICcuL19uYXRpdmVDcmVhdGUuanMnO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIENoZWNrcyBpZiBhIGhhc2ggdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGhhc2hIYXMoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgcmV0dXJuIG5hdGl2ZUNyZWF0ZSA/IChkYXRhW2tleV0gIT09IHVuZGVmaW5lZCkgOiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGRhdGEsIGtleSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGhhc2hIYXM7XG4iLCJpbXBvcnQgbmF0aXZlQ3JlYXRlIGZyb20gJy4vX25hdGl2ZUNyZWF0ZS5qcyc7XG5cbi8qKiBVc2VkIHRvIHN0YW5kLWluIGZvciBgdW5kZWZpbmVkYCBoYXNoIHZhbHVlcy4gKi9cbnZhciBIQVNIX1VOREVGSU5FRCA9ICdfX2xvZGFzaF9oYXNoX3VuZGVmaW5lZF9fJztcblxuLyoqXG4gKiBTZXRzIHRoZSBoYXNoIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgaGFzaCBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gaGFzaFNldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgdGhpcy5zaXplICs9IHRoaXMuaGFzKGtleSkgPyAwIDogMTtcbiAgZGF0YVtrZXldID0gKG5hdGl2ZUNyZWF0ZSAmJiB2YWx1ZSA9PT0gdW5kZWZpbmVkKSA/IEhBU0hfVU5ERUZJTkVEIDogdmFsdWU7XG4gIHJldHVybiB0aGlzO1xufVxuXG5leHBvcnQgZGVmYXVsdCBoYXNoU2V0O1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBzdWl0YWJsZSBmb3IgdXNlIGFzIHVuaXF1ZSBvYmplY3Qga2V5LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIHN1aXRhYmxlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzS2V5YWJsZSh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuICh0eXBlID09ICdzdHJpbmcnIHx8IHR5cGUgPT0gJ251bWJlcicgfHwgdHlwZSA9PSAnc3ltYm9sJyB8fCB0eXBlID09ICdib29sZWFuJylcbiAgICA/ICh2YWx1ZSAhPT0gJ19fcHJvdG9fXycpXG4gICAgOiAodmFsdWUgPT09IG51bGwpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpc0tleWFibGU7XG4iLCJpbXBvcnQgY29yZUpzRGF0YSBmcm9tICcuL19jb3JlSnNEYXRhLmpzJztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG1ldGhvZHMgbWFzcXVlcmFkaW5nIGFzIG5hdGl2ZS4gKi9cbnZhciBtYXNrU3JjS2V5ID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgdWlkID0gL1teLl0rJC8uZXhlYyhjb3JlSnNEYXRhICYmIGNvcmVKc0RhdGEua2V5cyAmJiBjb3JlSnNEYXRhLmtleXMuSUVfUFJPVE8gfHwgJycpO1xuICByZXR1cm4gdWlkID8gKCdTeW1ib2woc3JjKV8xLicgKyB1aWQpIDogJyc7XG59KCkpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgZnVuY2AgaGFzIGl0cyBzb3VyY2UgbWFza2VkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgZnVuY2AgaXMgbWFza2VkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzTWFza2VkKGZ1bmMpIHtcbiAgcmV0dXJuICEhbWFza1NyY0tleSAmJiAobWFza1NyY0tleSBpbiBmdW5jKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaXNNYXNrZWQ7XG4iLCIvKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIGxpc3QgY2FjaGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZUNsZWFyKCkge1xuICB0aGlzLl9fZGF0YV9fID0gW107XG4gIHRoaXMuc2l6ZSA9IDA7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGxpc3RDYWNoZUNsZWFyO1xuIiwiaW1wb3J0IGFzc29jSW5kZXhPZiBmcm9tICcuL19hc3NvY0luZGV4T2YuanMnO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgYXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3BsaWNlID0gYXJyYXlQcm90by5zcGxpY2U7XG5cbi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIGxpc3QgY2FjaGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZURlbGV0ZShrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgaW5kZXggPSBhc3NvY0luZGV4T2YoZGF0YSwga2V5KTtcblxuICBpZiAoaW5kZXggPCAwKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBsYXN0SW5kZXggPSBkYXRhLmxlbmd0aCAtIDE7XG4gIGlmIChpbmRleCA9PSBsYXN0SW5kZXgpIHtcbiAgICBkYXRhLnBvcCgpO1xuICB9IGVsc2Uge1xuICAgIHNwbGljZS5jYWxsKGRhdGEsIGluZGV4LCAxKTtcbiAgfVxuICAtLXRoaXMuc2l6ZTtcbiAgcmV0dXJuIHRydWU7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGxpc3RDYWNoZURlbGV0ZTtcbiIsImltcG9ydCBhc3NvY0luZGV4T2YgZnJvbSAnLi9fYXNzb2NJbmRleE9mLmpzJztcblxuLyoqXG4gKiBHZXRzIHRoZSBsaXN0IGNhY2hlIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlR2V0KGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIHJldHVybiBpbmRleCA8IDAgPyB1bmRlZmluZWQgOiBkYXRhW2luZGV4XVsxXTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbGlzdENhY2hlR2V0O1xuIiwiaW1wb3J0IGFzc29jSW5kZXhPZiBmcm9tICcuL19hc3NvY0luZGV4T2YuanMnO1xuXG4vKipcbiAqIENoZWNrcyBpZiBhIGxpc3QgY2FjaGUgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlSGFzKGtleSkge1xuICByZXR1cm4gYXNzb2NJbmRleE9mKHRoaXMuX19kYXRhX18sIGtleSkgPiAtMTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbGlzdENhY2hlSGFzO1xuIiwiaW1wb3J0IGFzc29jSW5kZXhPZiBmcm9tICcuL19hc3NvY0luZGV4T2YuanMnO1xuXG4vKipcbiAqIFNldHMgdGhlIGxpc3QgY2FjaGUgYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGxpc3QgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZVNldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIGluZGV4ID0gYXNzb2NJbmRleE9mKGRhdGEsIGtleSk7XG5cbiAgaWYgKGluZGV4IDwgMCkge1xuICAgICsrdGhpcy5zaXplO1xuICAgIGRhdGEucHVzaChba2V5LCB2YWx1ZV0pO1xuICB9IGVsc2Uge1xuICAgIGRhdGFbaW5kZXhdWzFdID0gdmFsdWU7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGxpc3RDYWNoZVNldDtcbiIsImltcG9ydCBIYXNoIGZyb20gJy4vX0hhc2guanMnO1xuaW1wb3J0IExpc3RDYWNoZSBmcm9tICcuL19MaXN0Q2FjaGUuanMnO1xuaW1wb3J0IE1hcCBmcm9tICcuL19NYXAuanMnO1xuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIG1hcC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUNsZWFyKCkge1xuICB0aGlzLnNpemUgPSAwO1xuICB0aGlzLl9fZGF0YV9fID0ge1xuICAgICdoYXNoJzogbmV3IEhhc2gsXG4gICAgJ21hcCc6IG5ldyAoTWFwIHx8IExpc3RDYWNoZSksXG4gICAgJ3N0cmluZyc6IG5ldyBIYXNoXG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IG1hcENhY2hlQ2xlYXI7XG4iLCJpbXBvcnQgZ2V0TWFwRGF0YSBmcm9tICcuL19nZXRNYXBEYXRhLmpzJztcblxuLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgbWFwLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlRGVsZXRlKGtleSkge1xuICB2YXIgcmVzdWx0ID0gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpWydkZWxldGUnXShrZXkpO1xuICB0aGlzLnNpemUgLT0gcmVzdWx0ID8gMSA6IDA7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IG1hcENhY2hlRGVsZXRlO1xuIiwiaW1wb3J0IGdldE1hcERhdGEgZnJvbSAnLi9fZ2V0TWFwRGF0YS5qcyc7XG5cbi8qKlxuICogR2V0cyB0aGUgbWFwIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUdldChrZXkpIHtcbiAgcmV0dXJuIGdldE1hcERhdGEodGhpcywga2V5KS5nZXQoa2V5KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbWFwQ2FjaGVHZXQ7XG4iLCJpbXBvcnQgZ2V0TWFwRGF0YSBmcm9tICcuL19nZXRNYXBEYXRhLmpzJztcblxuLyoqXG4gKiBDaGVja3MgaWYgYSBtYXAgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUhhcyhrZXkpIHtcbiAgcmV0dXJuIGdldE1hcERhdGEodGhpcywga2V5KS5oYXMoa2V5KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbWFwQ2FjaGVIYXM7XG4iLCJpbXBvcnQgZ2V0TWFwRGF0YSBmcm9tICcuL19nZXRNYXBEYXRhLmpzJztcblxuLyoqXG4gKiBTZXRzIHRoZSBtYXAgYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbWFwIGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZVNldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpLFxuICAgICAgc2l6ZSA9IGRhdGEuc2l6ZTtcblxuICBkYXRhLnNldChrZXksIHZhbHVlKTtcbiAgdGhpcy5zaXplICs9IGRhdGEuc2l6ZSA9PSBzaXplID8gMCA6IDE7XG4gIHJldHVybiB0aGlzO1xufVxuXG5leHBvcnQgZGVmYXVsdCBtYXBDYWNoZVNldDtcbiIsImltcG9ydCBnZXROYXRpdmUgZnJvbSAnLi9fZ2V0TmF0aXZlLmpzJztcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIG5hdGl2ZUNyZWF0ZSA9IGdldE5hdGl2ZShPYmplY3QsICdjcmVhdGUnKTtcblxuZXhwb3J0IGRlZmF1bHQgbmF0aXZlQ3JlYXRlO1xuIiwiaW1wb3J0IGZyZWVHbG9iYWwgZnJvbSAnLi9fZnJlZUdsb2JhbC5qcyc7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZXhwb3J0c2AuICovXG52YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzICYmICFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYC4gKi9cbnZhciBmcmVlTW9kdWxlID0gZnJlZUV4cG9ydHMgJiYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSAmJiBtb2R1bGU7XG5cbi8qKiBEZXRlY3QgdGhlIHBvcHVsYXIgQ29tbW9uSlMgZXh0ZW5zaW9uIGBtb2R1bGUuZXhwb3J0c2AuICovXG52YXIgbW9kdWxlRXhwb3J0cyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5leHBvcnRzID09PSBmcmVlRXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBwcm9jZXNzYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZVByb2Nlc3MgPSBtb2R1bGVFeHBvcnRzICYmIGZyZWVHbG9iYWwucHJvY2VzcztcblxuLyoqIFVzZWQgdG8gYWNjZXNzIGZhc3RlciBOb2RlLmpzIGhlbHBlcnMuICovXG52YXIgbm9kZVV0aWwgPSAoZnVuY3Rpb24oKSB7XG4gIHRyeSB7XG4gICAgLy8gVXNlIGB1dGlsLnR5cGVzYCBmb3IgTm9kZS5qcyAxMCsuXG4gICAgdmFyIHR5cGVzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLnJlcXVpcmUgJiYgZnJlZU1vZHVsZS5yZXF1aXJlKCd1dGlsJykudHlwZXM7XG5cbiAgICBpZiAodHlwZXMpIHtcbiAgICAgIHJldHVybiB0eXBlcztcbiAgICB9XG5cbiAgICAvLyBMZWdhY3kgYHByb2Nlc3MuYmluZGluZygndXRpbCcpYCBmb3IgTm9kZS5qcyA8IDEwLlxuICAgIHJldHVybiBmcmVlUHJvY2VzcyAmJiBmcmVlUHJvY2Vzcy5iaW5kaW5nICYmIGZyZWVQcm9jZXNzLmJpbmRpbmcoJ3V0aWwnKTtcbiAgfSBjYXRjaCAoZSkge31cbn0oKSk7XG5cbmV4cG9ydCBkZWZhdWx0IG5vZGVVdGlsO1xuIiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG5hdGl2ZU9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZyB1c2luZyBgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gbmF0aXZlT2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IG9iamVjdFRvU3RyaW5nO1xuIiwiaW1wb3J0IGZyZWVHbG9iYWwgZnJvbSAnLi9fZnJlZUdsb2JhbC5qcyc7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgc2VsZmAuICovXG52YXIgZnJlZVNlbGYgPSB0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmICYmIHNlbGYuT2JqZWN0ID09PSBPYmplY3QgJiYgc2VsZjtcblxuLyoqIFVzZWQgYXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QuICovXG52YXIgcm9vdCA9IGZyZWVHbG9iYWwgfHwgZnJlZVNlbGYgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblxuZXhwb3J0IGRlZmF1bHQgcm9vdDtcbiIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBmdW5jUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGRlY29tcGlsZWQgc291cmNlIG9mIGZ1bmN0aW9ucy4gKi9cbnZhciBmdW5jVG9TdHJpbmcgPSBmdW5jUHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ29udmVydHMgYGZ1bmNgIHRvIGl0cyBzb3VyY2UgY29kZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHNvdXJjZSBjb2RlLlxuICovXG5mdW5jdGlvbiB0b1NvdXJjZShmdW5jKSB7XG4gIGlmIChmdW5jICE9IG51bGwpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGZ1bmNUb1N0cmluZy5jYWxsKGZ1bmMpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiAoZnVuYyArICcnKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICB9XG4gIHJldHVybiAnJztcbn1cblxuZXhwb3J0IGRlZmF1bHQgdG9Tb3VyY2U7XG4iLCIvKipcbiAqIFBlcmZvcm1zIGFcbiAqIFtgU2FtZVZhbHVlWmVyb2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXNhbWV2YWx1ZXplcm8pXG4gKiBjb21wYXJpc29uIGJldHdlZW4gdHdvIHZhbHVlcyB0byBkZXRlcm1pbmUgaWYgdGhleSBhcmUgZXF1aXZhbGVudC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7Kn0gb3RoZXIgVGhlIG90aGVyIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHZhbHVlcyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IDEgfTtcbiAqIHZhciBvdGhlciA9IHsgJ2EnOiAxIH07XG4gKlxuICogXy5lcShvYmplY3QsIG9iamVjdCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5lcShvYmplY3QsIG90aGVyKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5lcSgnYScsICdhJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5lcSgnYScsIE9iamVjdCgnYScpKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5lcShOYU4sIE5hTik7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGVxKHZhbHVlLCBvdGhlcikge1xuICByZXR1cm4gdmFsdWUgPT09IG90aGVyIHx8ICh2YWx1ZSAhPT0gdmFsdWUgJiYgb3RoZXIgIT09IG90aGVyKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZXE7XG4iLCJpbXBvcnQgYmFzZUlzQXJyYXlCdWZmZXIgZnJvbSAnLi9fYmFzZUlzQXJyYXlCdWZmZXIuanMnO1xuaW1wb3J0IGJhc2VVbmFyeSBmcm9tICcuL19iYXNlVW5hcnkuanMnO1xuaW1wb3J0IG5vZGVVdGlsIGZyb20gJy4vX25vZGVVdGlsLmpzJztcblxuLyogTm9kZS5qcyBoZWxwZXIgcmVmZXJlbmNlcy4gKi9cbnZhciBub2RlSXNBcnJheUJ1ZmZlciA9IG5vZGVVdGlsICYmIG5vZGVVdGlsLmlzQXJyYXlCdWZmZXI7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhbiBgQXJyYXlCdWZmZXJgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMy4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBhcnJheSBidWZmZXIsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5QnVmZmVyKG5ldyBBcnJheUJ1ZmZlcigyKSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5QnVmZmVyKG5ldyBBcnJheSgyKSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNBcnJheUJ1ZmZlciA9IG5vZGVJc0FycmF5QnVmZmVyID8gYmFzZVVuYXJ5KG5vZGVJc0FycmF5QnVmZmVyKSA6IGJhc2VJc0FycmF5QnVmZmVyO1xuXG5leHBvcnQgZGVmYXVsdCBpc0FycmF5QnVmZmVyO1xuIiwiaW1wb3J0IGJhc2VHZXRUYWcgZnJvbSAnLi9fYmFzZUdldFRhZy5qcyc7XG5pbXBvcnQgaXNPYmplY3QgZnJvbSAnLi9pc09iamVjdC5qcyc7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhc3luY1RhZyA9ICdbb2JqZWN0IEFzeW5jRnVuY3Rpb25dJyxcbiAgICBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJyxcbiAgICBnZW5UYWcgPSAnW29iamVjdCBHZW5lcmF0b3JGdW5jdGlvbl0nLFxuICAgIHByb3h5VGFnID0gJ1tvYmplY3QgUHJveHldJztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYEZ1bmN0aW9uYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBmdW5jdGlvbiwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oXyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0Z1bmN0aW9uKC9hYmMvKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy8gVGhlIHVzZSBvZiBgT2JqZWN0I3RvU3RyaW5nYCBhdm9pZHMgaXNzdWVzIHdpdGggdGhlIGB0eXBlb2ZgIG9wZXJhdG9yXG4gIC8vIGluIFNhZmFyaSA5IHdoaWNoIHJldHVybnMgJ29iamVjdCcgZm9yIHR5cGVkIGFycmF5cyBhbmQgb3RoZXIgY29uc3RydWN0b3JzLlxuICB2YXIgdGFnID0gYmFzZUdldFRhZyh2YWx1ZSk7XG4gIHJldHVybiB0YWcgPT0gZnVuY1RhZyB8fCB0YWcgPT0gZ2VuVGFnIHx8IHRhZyA9PSBhc3luY1RhZyB8fCB0YWcgPT0gcHJveHlUYWc7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGlzRnVuY3Rpb247XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZVxuICogW2xhbmd1YWdlIHR5cGVdKGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1lY21hc2NyaXB0LWxhbmd1YWdlLXR5cGVzKVxuICogb2YgYE9iamVjdGAuIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChfLm5vb3ApO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaXNPYmplY3Q7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLiBBIHZhbHVlIGlzIG9iamVjdC1saWtlIGlmIGl0J3Mgbm90IGBudWxsYFxuICogYW5kIGhhcyBhIGB0eXBlb2ZgIHJlc3VsdCBvZiBcIm9iamVjdFwiLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxuZXhwb3J0IGRlZmF1bHQgaXNPYmplY3RMaWtlO1xuIiwiaW1wb3J0IE1hcENhY2hlIGZyb20gJy4vX01hcENhY2hlLmpzJztcblxuLyoqIEVycm9yIG1lc3NhZ2UgY29uc3RhbnRzLiAqL1xudmFyIEZVTkNfRVJST1JfVEVYVCA9ICdFeHBlY3RlZCBhIGZ1bmN0aW9uJztcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBtZW1vaXplcyB0aGUgcmVzdWx0IG9mIGBmdW5jYC4gSWYgYHJlc29sdmVyYCBpc1xuICogcHJvdmlkZWQsIGl0IGRldGVybWluZXMgdGhlIGNhY2hlIGtleSBmb3Igc3RvcmluZyB0aGUgcmVzdWx0IGJhc2VkIG9uIHRoZVxuICogYXJndW1lbnRzIHByb3ZpZGVkIHRvIHRoZSBtZW1vaXplZCBmdW5jdGlvbi4gQnkgZGVmYXVsdCwgdGhlIGZpcnN0IGFyZ3VtZW50XG4gKiBwcm92aWRlZCB0byB0aGUgbWVtb2l6ZWQgZnVuY3Rpb24gaXMgdXNlZCBhcyB0aGUgbWFwIGNhY2hlIGtleS4gVGhlIGBmdW5jYFxuICogaXMgaW52b2tlZCB3aXRoIHRoZSBgdGhpc2AgYmluZGluZyBvZiB0aGUgbWVtb2l6ZWQgZnVuY3Rpb24uXG4gKlxuICogKipOb3RlOioqIFRoZSBjYWNoZSBpcyBleHBvc2VkIGFzIHRoZSBgY2FjaGVgIHByb3BlcnR5IG9uIHRoZSBtZW1vaXplZFxuICogZnVuY3Rpb24uIEl0cyBjcmVhdGlvbiBtYXkgYmUgY3VzdG9taXplZCBieSByZXBsYWNpbmcgdGhlIGBfLm1lbW9pemUuQ2FjaGVgXG4gKiBjb25zdHJ1Y3RvciB3aXRoIG9uZSB3aG9zZSBpbnN0YW5jZXMgaW1wbGVtZW50IHRoZVxuICogW2BNYXBgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1wcm9wZXJ0aWVzLW9mLXRoZS1tYXAtcHJvdG90eXBlLW9iamVjdClcbiAqIG1ldGhvZCBpbnRlcmZhY2Ugb2YgYGNsZWFyYCwgYGRlbGV0ZWAsIGBnZXRgLCBgaGFzYCwgYW5kIGBzZXRgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gaGF2ZSBpdHMgb3V0cHV0IG1lbW9pemVkLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW3Jlc29sdmVyXSBUaGUgZnVuY3Rpb24gdG8gcmVzb2x2ZSB0aGUgY2FjaGUga2V5LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgbWVtb2l6ZWQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSwgJ2InOiAyIH07XG4gKiB2YXIgb3RoZXIgPSB7ICdjJzogMywgJ2QnOiA0IH07XG4gKlxuICogdmFyIHZhbHVlcyA9IF8ubWVtb2l6ZShfLnZhbHVlcyk7XG4gKiB2YWx1ZXMob2JqZWN0KTtcbiAqIC8vID0+IFsxLCAyXVxuICpcbiAqIHZhbHVlcyhvdGhlcik7XG4gKiAvLyA9PiBbMywgNF1cbiAqXG4gKiBvYmplY3QuYSA9IDI7XG4gKiB2YWx1ZXMob2JqZWN0KTtcbiAqIC8vID0+IFsxLCAyXVxuICpcbiAqIC8vIE1vZGlmeSB0aGUgcmVzdWx0IGNhY2hlLlxuICogdmFsdWVzLmNhY2hlLnNldChvYmplY3QsIFsnYScsICdiJ10pO1xuICogdmFsdWVzKG9iamVjdCk7XG4gKiAvLyA9PiBbJ2EnLCAnYiddXG4gKlxuICogLy8gUmVwbGFjZSBgXy5tZW1vaXplLkNhY2hlYC5cbiAqIF8ubWVtb2l6ZS5DYWNoZSA9IFdlYWtNYXA7XG4gKi9cbmZ1bmN0aW9uIG1lbW9pemUoZnVuYywgcmVzb2x2ZXIpIHtcbiAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicgfHwgKHJlc29sdmVyICE9IG51bGwgJiYgdHlwZW9mIHJlc29sdmVyICE9ICdmdW5jdGlvbicpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGVU5DX0VSUk9SX1RFWFQpO1xuICB9XG4gIHZhciBtZW1vaXplZCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzLFxuICAgICAgICBrZXkgPSByZXNvbHZlciA/IHJlc29sdmVyLmFwcGx5KHRoaXMsIGFyZ3MpIDogYXJnc1swXSxcbiAgICAgICAgY2FjaGUgPSBtZW1vaXplZC5jYWNoZTtcblxuICAgIGlmIChjYWNoZS5oYXMoa2V5KSkge1xuICAgICAgcmV0dXJuIGNhY2hlLmdldChrZXkpO1xuICAgIH1cbiAgICB2YXIgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICBtZW1vaXplZC5jYWNoZSA9IGNhY2hlLnNldChrZXksIHJlc3VsdCkgfHwgY2FjaGU7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbiAgbWVtb2l6ZWQuY2FjaGUgPSBuZXcgKG1lbW9pemUuQ2FjaGUgfHwgTWFwQ2FjaGUpO1xuICByZXR1cm4gbWVtb2l6ZWQ7XG59XG5cbi8vIEV4cG9zZSBgTWFwQ2FjaGVgLlxubWVtb2l6ZS5DYWNoZSA9IE1hcENhY2hlO1xuXG5leHBvcnQgZGVmYXVsdCBtZW1vaXplO1xuIiwiaW1wb3J0IHtcblx0SEFMRl9GTE9BVCwgRkxPQVQsIFVOU0lHTkVEX0JZVEUsIEJZVEUsIFVOU0lHTkVEX1NIT1JULCBTSE9SVCwgVU5TSUdORURfSU5ULCBJTlQsXG5cdExJTkVBUiwgTkVBUkVTVCxcblx0UkVQRUFULCBDTEFNUF9UT19FREdFLCBSR0IsIFJHQkEsXG59IGZyb20gJy4vQ29uc3RhbnRzJztcblxuZXhwb3J0IGNvbnN0IHZhbGlkRGF0YVR5cGVzID0gW0hBTEZfRkxPQVQsIEZMT0FULCBVTlNJR05FRF9CWVRFLCBCWVRFLCBVTlNJR05FRF9TSE9SVCwgU0hPUlQsIFVOU0lHTkVEX0lOVCwgSU5UXTtcbmV4cG9ydCBmdW5jdGlvbiBpc1ZhbGlkRGF0YVR5cGUodHlwZTogc3RyaW5nKSB7XG5cdHJldHVybiB2YWxpZERhdGFUeXBlcy5pbmRleE9mKHR5cGUpID4gLTE7XG59XG5cbmV4cG9ydCBjb25zdCB2YWxpZEZpbHRlclR5cGVzID0gW0xJTkVBUiwgTkVBUkVTVF07XG5leHBvcnQgZnVuY3Rpb24gaXNWYWxpZEZpbHRlclR5cGUodHlwZTogc3RyaW5nKSB7XG5cdHJldHVybiB2YWxpZEZpbHRlclR5cGVzLmluZGV4T2YodHlwZSkgPiAtMTtcbn1cblxuZXhwb3J0IGNvbnN0IHZhbGlkV3JhcFR5cGVzID0gW0NMQU1QX1RPX0VER0UsIFJFUEVBVF07IC8vIE1JUlJPUkVEX1JFUEVBVFxuZXhwb3J0IGZ1bmN0aW9uIGlzVmFsaWRXcmFwVHlwZSh0eXBlOiBzdHJpbmcpIHtcblx0cmV0dXJuIHZhbGlkV3JhcFR5cGVzLmluZGV4T2YodHlwZSkgPiAtMTtcbn1cblxuZXhwb3J0IGNvbnN0IHZhbGlkVGV4dHVyZUZvcm1hdFR5cGVzID0gW1JHQiwgUkdCQV07XG5leHBvcnQgZnVuY3Rpb24gaXNWYWxpZFRleHR1cmVGb3JtYXRUeXBlKHR5cGU6IHN0cmluZykge1xuXHRyZXR1cm4gdmFsaWRUZXh0dXJlRm9ybWF0VHlwZXMuaW5kZXhPZih0eXBlKSA+IC0xO1xufVxuXG5leHBvcnQgY29uc3QgdmFsaWRUZXh0dXJlRGF0YVR5cGVzID0gW1VOU0lHTkVEX0JZVEVdO1xuZXhwb3J0IGZ1bmN0aW9uIGlzVmFsaWRUZXh0dXJlRGF0YVR5cGUodHlwZTogc3RyaW5nKSB7XG5cdHJldHVybiB2YWxpZFRleHR1cmVEYXRhVHlwZXMuaW5kZXhPZih0eXBlKSA+IC0xO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNOdW1iZXIodmFsdWU6IGFueSkge1xuXHRyZXR1cm4gIWlzTmFOKHZhbHVlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzSW50ZWdlcih2YWx1ZTogYW55KSB7XG5cdHJldHVybiBpc051bWJlcih2YWx1ZSkgJiYgKHZhbHVlICUgMSA9PT0gMCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1Bvc2l0aXZlSW50ZWdlcih2YWx1ZTogYW55KSB7XG5cdHJldHVybiBpc0ludGVnZXIodmFsdWUpICYmICB2YWx1ZSA+IDA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1N0cmluZyh2YWx1ZTogYW55KXtcblx0cmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZyc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0FycmF5KHZhbHVlOiBhbnkpIHtcblx0cmV0dXJuIEFycmF5LmlzQXJyYXkodmFsdWUpO1xufSIsImV4cG9ydCBjb25zdCBIQUxGX0ZMT0FUID0gJ0hBTEZfRkxPQVQnO1xuZXhwb3J0IGNvbnN0IEZMT0FUID0gJ0ZMT0FUJztcbmV4cG9ydCBjb25zdCBVTlNJR05FRF9CWVRFID0gJ1VOU0lHTkVEX0JZVEUnO1xuZXhwb3J0IGNvbnN0IEJZVEUgPSAnQllURSc7XG5leHBvcnQgY29uc3QgVU5TSUdORURfU0hPUlQgPSAnVU5TSUdORURfU0hPUlQnO1xuZXhwb3J0IGNvbnN0IFNIT1JUID0gJ1NIT1JUJztcbmV4cG9ydCBjb25zdCBVTlNJR05FRF9JTlQgPSAnVU5TSUdORURfSU5UJztcbmV4cG9ydCBjb25zdCBJTlQgPSAnSU5UJztcblxuZXhwb3J0IGNvbnN0IExJTkVBUiA9ICdMSU5FQVInO1xuZXhwb3J0IGNvbnN0IE5FQVJFU1QgPSAnTkVBUkVTVCc7XG5cbmV4cG9ydCBjb25zdCBSRVBFQVQgPSAnUkVQRUFUJztcbmV4cG9ydCBjb25zdCBDTEFNUF9UT19FREdFID0gJ0NMQU1QX1RPX0VER0UnO1xuLy8gZXhwb3J0IGNvbnN0IE1JUlJPUkVEX1JFUEVBVCA9ICdNSVJST1JFRF9SRVBFQVQnO1xuXG5leHBvcnQgY29uc3QgUkdCID0gJ1JHQic7XG5leHBvcnQgY29uc3QgUkdCQSA9ICdSR0JBJztcblxuZXhwb3J0IHR5cGUgRGF0YUxheWVyQXJyYXlUeXBlID0gIEZsb2F0MzJBcnJheSB8IFVpbnQ4QXJyYXkgfCBJbnQ4QXJyYXkgfCBVaW50MTZBcnJheSB8IEludDE2QXJyYXkgfCBVaW50MzJBcnJheSB8IEludDMyQXJyYXk7XG5leHBvcnQgdHlwZSBEYXRhTGF5ZXJUeXBlID0gdHlwZW9mIEhBTEZfRkxPQVQgfCB0eXBlb2YgRkxPQVQgfCB0eXBlb2YgVU5TSUdORURfQllURSB8IHR5cGVvZiBCWVRFIHwgdHlwZW9mIFVOU0lHTkVEX1NIT1JUIHwgdHlwZW9mIFNIT1JUIHwgdHlwZW9mIFVOU0lHTkVEX0lOVCB8IHR5cGVvZiBJTlQ7XG5leHBvcnQgdHlwZSBEYXRhTGF5ZXJOdW1Db21wb25lbnRzID0gMSB8IDIgfCAzIHwgNDtcbmV4cG9ydCB0eXBlIERhdGFMYXllckZpbHRlclR5cGUgPSB0eXBlb2YgTElORUFSIHwgdHlwZW9mIE5FQVJFU1Q7XG5leHBvcnQgdHlwZSBEYXRhTGF5ZXJXcmFwVHlwZSA9IHR5cGVvZiBSRVBFQVQgfCB0eXBlb2YgQ0xBTVBfVE9fRURHRTsvLyB8IHR5cGVvZiBNSVJST1JFRF9SRVBFQVQ7XG5cbmV4cG9ydCB0eXBlIFRleHR1cmVGb3JtYXRUeXBlID0gdHlwZW9mIFJHQiB8IHR5cGVvZiBSR0JBO1xuZXhwb3J0IHR5cGUgVGV4dHVyZURhdGFUeXBlID0gdHlwZW9mIFVOU0lHTkVEX0JZVEU7XG5cbmV4cG9ydCBjb25zdCBHTFNMMyA9ICczMDAgZXMnO1xuZXhwb3J0IGNvbnN0IEdMU0wxID0gJzEwMCc7XG5leHBvcnQgdHlwZSBHTFNMVmVyc2lvbiA9IHR5cGVvZiBHTFNMMSB8IHR5cGVvZiBHTFNMMztcblxuLy8gVW5pZm9ybSB0eXBlcy5cbmV4cG9ydCBjb25zdCBGTE9BVF8xRF9VTklGT1JNID0gJzFmJztcbmV4cG9ydCBjb25zdCBGTE9BVF8yRF9VTklGT1JNID0gJzJmJztcbmV4cG9ydCBjb25zdCBGTE9BVF8zRF9VTklGT1JNID0gJzNmJztcbmV4cG9ydCBjb25zdCBGTE9BVF80RF9VTklGT1JNID0gJzNmJztcbmV4cG9ydCBjb25zdCBJTlRfMURfVU5JRk9STSA9ICcxaSc7XG5leHBvcnQgY29uc3QgSU5UXzJEX1VOSUZPUk0gPSAnMmknO1xuZXhwb3J0IGNvbnN0IElOVF8zRF9VTklGT1JNID0gJzNpJztcbmV4cG9ydCBjb25zdCBJTlRfNERfVU5JRk9STSA9ICczaSc7XG5cbmV4cG9ydCB0eXBlIFVuaWZvcm1EYXRhVHlwZSA9IHR5cGVvZiBGTE9BVCB8IHR5cGVvZiBJTlQ7XG5leHBvcnQgdHlwZSBVbmlmb3JtVmFsdWVUeXBlID0gXG5cdG51bWJlciB8XG5cdFtudW1iZXJdIHxcblx0W251bWJlciwgbnVtYmVyXSB8XG5cdFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSB8XG5cdFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdO1xuZXhwb3J0IHR5cGUgVW5pZm9ybVR5cGUgPSBcblx0dHlwZW9mIEZMT0FUXzFEX1VOSUZPUk0gfFxuXHR0eXBlb2YgRkxPQVRfMkRfVU5JRk9STSB8XG5cdHR5cGVvZiBGTE9BVF8zRF9VTklGT1JNIHxcblx0dHlwZW9mIEZMT0FUXzREX1VOSUZPUk0gfFxuXHR0eXBlb2YgSU5UXzFEX1VOSUZPUk0gfFxuXHR0eXBlb2YgSU5UXzJEX1VOSUZPUk0gfFxuXHR0eXBlb2YgSU5UXzNEX1VOSUZPUk0gfFxuXHR0eXBlb2YgSU5UXzREX1VOSUZPUk07XG5leHBvcnQgdHlwZSBVbmlmb3JtID0geyBcblx0bG9jYXRpb246IHsgW2tleTogc3RyaW5nXTogV2ViR0xVbmlmb3JtTG9jYXRpb24gfSxcblx0dHlwZTogVW5pZm9ybVR5cGUsXG5cdHZhbHVlOiBVbmlmb3JtVmFsdWVUeXBlLFxufTtcblxuIiwiaW1wb3J0IHsgc2V0RmxvYXQxNiB9IGZyb20gJ0BwZXRhbW9yaWtlbi9mbG9hdDE2JztcbmltcG9ydCB7IGlzUG9zaXRpdmVJbnRlZ2VyLCBpc1ZhbGlkRGF0YVR5cGUsIGlzVmFsaWRGaWx0ZXJUeXBlLCBpc1ZhbGlkV3JhcFR5cGUsIHZhbGlkRGF0YVR5cGVzLCB2YWxpZEZpbHRlclR5cGVzLCB2YWxpZFdyYXBUeXBlcyB9IGZyb20gJy4vQ2hlY2tzJztcbmltcG9ydCB7XG5cdEhBTEZfRkxPQVQsIEZMT0FULCBVTlNJR05FRF9CWVRFLCBCWVRFLCBVTlNJR05FRF9TSE9SVCwgU0hPUlQsIFVOU0lHTkVEX0lOVCwgSU5ULFxuXHRORUFSRVNULCBMSU5FQVIsIENMQU1QX1RPX0VER0UsXG5cdERhdGFMYXllckFycmF5VHlwZSwgRGF0YUxheWVyRmlsdGVyVHlwZSwgRGF0YUxheWVyTnVtQ29tcG9uZW50cywgRGF0YUxheWVyVHlwZSwgRGF0YUxheWVyV3JhcFR5cGUsIEdMU0xWZXJzaW9uLCBHTFNMMywgR0xTTDEsXG4gfSBmcm9tICcuL0NvbnN0YW50cyc7XG5pbXBvcnQge1xuXHRnZXRFeHRlbnNpb24sXG5cdEVYVF9DT0xPUl9CVUZGRVJfRkxPQVQsXG5cdE9FU19URVhUVVJFX0ZMT0FULFxuXHRPRVNfVEVYVFVSRV9GTE9BVF9MSU5FQVIsXG5cdE9FU19URVhUVVJFX0hBTEZfRkxPQVQsXG5cdE9FU19URVhUVVJFX0hBbEZfRkxPQVRfTElORUFSLFxufSBmcm9tICcuL2V4dGVuc2lvbnMnO1xuaW1wb3J0IHsgaXNXZWJHTDIgfSBmcm9tICcuL3V0aWxzJztcblxuZXhwb3J0IHR5cGUgRGF0YUxheWVyQnVmZmVyID0ge1xuXHR0ZXh0dXJlOiBXZWJHTFRleHR1cmUsXG5cdGZyYW1lYnVmZmVyPzogV2ViR0xGcmFtZWJ1ZmZlcixcbn1cblxudHlwZSBFcnJvckNhbGxiYWNrID0gKG1lc3NhZ2U6IHN0cmluZykgPT4gdm9pZDtcblxuZXhwb3J0IGNsYXNzIERhdGFMYXllciB7XG5cdHJlYWRvbmx5IG5hbWU6IHN0cmluZztcblx0cHJpdmF0ZSByZWFkb25seSBnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0IHwgV2ViR0wyUmVuZGVyaW5nQ29udGV4dDtcblx0cHJpdmF0ZSByZWFkb25seSBlcnJvckNhbGxiYWNrOiBFcnJvckNhbGxiYWNrO1xuXG5cdC8vIEVhY2ggRGF0YUxheWVyIG1heSBjb250YWluIGEgbnVtYmVyIG9mIGJ1ZmZlcnMgdG8gc3RvcmUgZGlmZmVyZW50IGluc3RhbmNlcyBvZiB0aGUgc3RhdGUuXG5cdHByaXZhdGUgX2J1ZmZlckluZGV4ID0gMDtcblx0cmVhZG9ubHkgbnVtQnVmZmVycztcblx0cHJpdmF0ZSByZWFkb25seSBidWZmZXJzOiBEYXRhTGF5ZXJCdWZmZXJbXSA9IFtdO1xuXG5cdC8vIFRleHR1cmUgc2l6ZXMuXG5cdHByaXZhdGUgbGVuZ3RoPzogbnVtYmVyOyAvLyBUaGlzIGlzIG9ubHkgdXNlZCBmb3IgMUQgZGF0YSBsYXllcnMuXG5cdHByaXZhdGUgd2lkdGg6IG51bWJlcjtcblx0cHJpdmF0ZSBoZWlnaHQ6IG51bWJlcjtcblxuXHQvLyBEYXRhTGF5ZXIgc2V0dGluZ3MuXG5cdHJlYWRvbmx5IHR5cGU6IERhdGFMYXllclR5cGU7IC8vIElucHV0IHR5cGUgcGFzc2VkIGluIGR1cmluZyBzZXR1cC5cblx0cmVhZG9ubHkgaW50ZXJuYWxUeXBlOiBEYXRhTGF5ZXJUeXBlOyAvLyBUeXBlIHRoYXQgY29ycmVzcG9uZHMgdG8gZ2xUeXBlLCBtYXkgYmUgZGlmZmVyZW50IGZyb20gdHlwZS5cblx0cmVhZG9ubHkgd3JhcFM6IERhdGFMYXllcldyYXBUeXBlOyAvLyBJbnB1dCB3cmFwIHR5cGUgcGFzc2VkIGluIGR1cmluZyBzZXR1cC5cblx0cmVhZG9ubHkgd3JhcFQ6IERhdGFMYXllcldyYXBUeXBlOyAvLyBJbnB1dCB3cmFwIHR5cGUgcGFzc2VkIGluIGR1cmluZyBzZXR1cC5cblx0cmVhZG9ubHkgaW50ZXJuYWxXcmFwUzogRGF0YUxheWVyV3JhcFR5cGU7IC8vIFdyYXAgdHlwZSB0aGF0IGNvcnJlc3BvbmRzIHRvIGdsV3JhcFMsIG1heSBiZSBkaWZmZXJlbnQgZnJvbSB3cmFwUy5cblx0cmVhZG9ubHkgaW50ZXJuYWxXcmFwVDogRGF0YUxheWVyV3JhcFR5cGU7IC8vIFdyYXAgdHlwZSB0aGF0IGNvcnJlc3BvbmRzIHRvIGdsV3JhcFQsIG1heSBiZSBkaWZmZXJlbnQgZnJvbSB3cmFwVC5cblx0cmVhZG9ubHkgbnVtQ29tcG9uZW50czogRGF0YUxheWVyTnVtQ29tcG9uZW50czsgLy8gTnVtYmVyIG9mIFJHQkEgY2hhbm5lbHMgdG8gdXNlIGZvciB0aGlzIERhdGFMYXllci5cblx0cmVhZG9ubHkgZmlsdGVyOiBEYXRhTGF5ZXJGaWx0ZXJUeXBlOyAvLyBJbnRlcnBvbGF0aW9uIGZpbHRlciB0eXBlIG9mIGRhdGEuXG5cdHJlYWRvbmx5IGludGVybmFsRmlsdGVyOiBEYXRhTGF5ZXJGaWx0ZXJUeXBlOyAvLyBGaWx0ZXIgdHlwZSB0aGF0IGNvcnJlc3BvbmRzIHRvIGdsRmlsdGVyLCBtYXkgYmUgZGlmZmVyZW50IGZyb20gZmlsdGVyLlxuXHRyZWFkb25seSB3cml0YWJsZTogYm9vbGVhbjtcblxuXHQvLyBPcHRpbWl6YXRpb25zIHNvIHRoYXQgXCJjb3B5aW5nXCIgY2FuIGhhcHBlbiB3aXRob3V0IGRyYXcgY2FsbHMuXG5cdHByaXZhdGUgdGV4dHVyZU92ZXJyaWRlcz86IChXZWJHTFRleHR1cmUgfCB1bmRlZmluZWQpW107XG5cblx0Ly8gR0wgdmFyaWFibGVzICh0aGVzZSBtYXkgYmUgZGlmZmVyZW50IGZyb20gdGhlaXIgY29ycmVzcG9uZGluZyBub24tZ2wgcGFyYW1ldGVycykuXG5cdHJlYWRvbmx5IGdsSW50ZXJuYWxGb3JtYXQ6IG51bWJlcjtcblx0cmVhZG9ubHkgZ2xGb3JtYXQ6IG51bWJlcjtcblx0cmVhZG9ubHkgZ2xUeXBlOiBudW1iZXI7XG5cdHJlYWRvbmx5IGdsTnVtQ2hhbm5lbHM6IG51bWJlcjtcblx0cmVhZG9ubHkgZ2xXcmFwUzogbnVtYmVyO1xuXHRyZWFkb25seSBnbFdyYXBUOiBudW1iZXI7XG5cdHJlYWRvbmx5IGdsRmlsdGVyOiBudW1iZXI7XG5cblx0Y29uc3RydWN0b3IoXG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0IHwgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCxcblx0XHRcdG5hbWU6IHN0cmluZyxcblx0XHRcdGRpbWVuc2lvbnM6IG51bWJlciB8IFtudW1iZXIsIG51bWJlcl0sXG5cdFx0XHR0eXBlOiBEYXRhTGF5ZXJUeXBlLFxuXHRcdFx0bnVtQ29tcG9uZW50czogRGF0YUxheWVyTnVtQ29tcG9uZW50cyxcblx0XHRcdGdsc2xWZXJzaW9uOiBHTFNMVmVyc2lvbixcblx0XHRcdGRhdGE/OiBEYXRhTGF5ZXJBcnJheVR5cGUsXG5cdFx0XHRmaWx0ZXI/OiBEYXRhTGF5ZXJGaWx0ZXJUeXBlLFxuXHRcdFx0d3JhcFM/OiBEYXRhTGF5ZXJXcmFwVHlwZSxcblx0XHRcdHdyYXBUPzogRGF0YUxheWVyV3JhcFR5cGUsXG5cdFx0XHR3cml0YWJsZT86IGJvb2xlYW4sXG5cdFx0XHRudW1CdWZmZXJzPzogbnVtYmVyLFxuXHRcdFx0ZXJyb3JDYWxsYmFjazogRXJyb3JDYWxsYmFjayxcblx0XHR9LFxuXHQpIHtcblx0XHRjb25zdCB7IGdsLCBlcnJvckNhbGxiYWNrLCBuYW1lLCBkaW1lbnNpb25zLCB0eXBlLCBudW1Db21wb25lbnRzLCBkYXRhLCBnbHNsVmVyc2lvbiB9ID0gcGFyYW1zO1xuXG5cdFx0Ly8gU2F2ZSBwYXJhbXMuXG5cdFx0dGhpcy5uYW1lID0gbmFtZTtcblx0XHR0aGlzLmdsID0gZ2w7XG5cdFx0dGhpcy5lcnJvckNhbGxiYWNrID0gZXJyb3JDYWxsYmFjaztcblxuXHRcdC8vIG51bUNvbXBvbmVudHMgbXVzdCBiZSBiZXR3ZWVuIDEgYW5kIDQuXG5cdFx0aWYgKCFpc1Bvc2l0aXZlSW50ZWdlcihudW1Db21wb25lbnRzKSB8fCBudW1Db21wb25lbnRzID4gNCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIG51bUNvbXBvbmVudHMgJHtudW1Db21wb25lbnRzfSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLmApO1xuXHRcdH1cblx0XHR0aGlzLm51bUNvbXBvbmVudHMgPSBudW1Db21wb25lbnRzO1xuXG5cdFx0Ly8gd3JpdGFibGUgZGVmYXVsdHMgdG8gZmFsc2UuXG5cdFx0Y29uc3Qgd3JpdGFibGUgPSAhIXBhcmFtcy53cml0YWJsZTtcblx0XHR0aGlzLndyaXRhYmxlID0gd3JpdGFibGU7XG5cblx0XHQvLyBTZXQgZGltZW5zaW9ucywgbWF5IGJlIDFEIG9yIDJELlxuXHRcdGNvbnN0IHsgbGVuZ3RoLCB3aWR0aCwgaGVpZ2h0IH0gPSBEYXRhTGF5ZXIuY2FsY1NpemUoZGltZW5zaW9ucywgbmFtZSk7XG5cdFx0dGhpcy5sZW5ndGggPSBsZW5ndGg7XG5cdFx0aWYgKCFpc1Bvc2l0aXZlSW50ZWdlcih3aWR0aCkpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB3aWR0aCAke3dpZHRofSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLmApO1xuXHRcdH1cblx0XHR0aGlzLndpZHRoID0gd2lkdGg7XG5cdFx0aWYgKCFpc1Bvc2l0aXZlSW50ZWdlcihoZWlnaHQpKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgbGVuZ3RoICR7aGVpZ2h0fSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLmApO1xuXHRcdH1cblx0XHR0aGlzLmhlaWdodCA9IGhlaWdodDtcblxuXHRcdC8vIFNldCBmaWx0ZXJpbmcgLSBpZiB3ZSBhcmUgcHJvY2Vzc2luZyBhIDFEIGFycmF5LCBkZWZhdWx0IHRvIE5FQVJFU1QgZmlsdGVyaW5nLlxuXHRcdC8vIEVsc2UgZGVmYXVsdCB0byBMSU5FQVIgKGludGVycG9sYXRpb24pIGZpbHRlcmluZy5cblx0XHRjb25zdCBmaWx0ZXIgPSBwYXJhbXMuZmlsdGVyICE9PSB1bmRlZmluZWQgPyBwYXJhbXMuZmlsdGVyIDogKGxlbmd0aCA/IE5FQVJFU1QgOiBMSU5FQVIpO1xuXHRcdGlmICghaXNWYWxpZEZpbHRlclR5cGUoZmlsdGVyKSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGZpbHRlcjogJHtmaWx0ZXJ9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIsIG11c3QgYmUgJHt2YWxpZEZpbHRlclR5cGVzLmpvaW4oJywgJyl9LmApO1xuXHRcdH1cblx0XHR0aGlzLmZpbHRlciA9IGZpbHRlcjtcblxuXHRcdC8vIEdldCB3cmFwIHR5cGVzLCBkZWZhdWx0IHRvIGNsYW1wIHRvIGVkZ2UuXG5cdFx0Y29uc3Qgd3JhcFMgPSBwYXJhbXMud3JhcFMgIT09IHVuZGVmaW5lZCA/IHBhcmFtcy53cmFwUyA6IENMQU1QX1RPX0VER0U7XG5cdFx0aWYgKCFpc1ZhbGlkV3JhcFR5cGUod3JhcFMpKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgd3JhcFM6ICR7d3JhcFN9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIsIG11c3QgYmUgJHt2YWxpZFdyYXBUeXBlcy5qb2luKCcsICcpfS5gKTtcblx0XHR9XG5cdFx0dGhpcy53cmFwUyA9IHdyYXBTO1xuXHRcdGNvbnN0IHdyYXBUID0gcGFyYW1zLndyYXBUICE9PSB1bmRlZmluZWQgPyBwYXJhbXMud3JhcFQgOiBDTEFNUF9UT19FREdFO1xuXHRcdGlmICghaXNWYWxpZFdyYXBUeXBlKHdyYXBUKSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHdyYXBUOiAke3dyYXBUfSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLCBtdXN0IGJlICR7dmFsaWRXcmFwVHlwZXMuam9pbignLCAnKX0uYCk7XG5cdFx0fVxuXHRcdHRoaXMud3JhcFQgPSB3cmFwVDtcblxuXHRcdC8vIFNldCBkYXRhIHR5cGUuXG5cdFx0aWYgKCFpc1ZhbGlkRGF0YVR5cGUodHlwZSkpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB0eXBlICR7dHlwZX0gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIiwgbXVzdCBiZSBvbmUgb2YgJHt2YWxpZERhdGFUeXBlcy5qb2luKCcsICcpfS5gKTtcblx0XHR9XG5cdFx0dGhpcy50eXBlID0gdHlwZTtcblx0XHRjb25zdCBpbnRlcm5hbFR5cGUgPSBEYXRhTGF5ZXIuZ2V0SW50ZXJuYWxUeXBlKHtcblx0XHRcdGdsLFxuXHRcdFx0dHlwZSxcblx0XHRcdGdsc2xWZXJzaW9uLFxuXHRcdFx0d3JpdGFibGUsXG5cdFx0XHRmaWx0ZXIsXG5cdFx0XHRuYW1lLFxuXHRcdFx0ZXJyb3JDYWxsYmFjayxcblx0XHR9KTtcblx0XHR0aGlzLmludGVybmFsVHlwZSA9IGludGVybmFsVHlwZTtcblx0XHQvLyBTZXQgZ2wgdGV4dHVyZSBwYXJhbWV0ZXJzLlxuXHRcdGNvbnN0IHtcblx0XHRcdGdsRm9ybWF0LFxuXHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCxcblx0XHRcdGdsVHlwZSxcblx0XHRcdGdsTnVtQ2hhbm5lbHMsXG5cdFx0fSA9IERhdGFMYXllci5nZXRHTFRleHR1cmVQYXJhbWV0ZXJzKHtcblx0XHRcdGdsLFxuXHRcdFx0bmFtZSxcblx0XHRcdG51bUNvbXBvbmVudHMsXG5cdFx0XHR3cml0YWJsZSxcblx0XHRcdGludGVybmFsVHlwZSxcblx0XHRcdGdsc2xWZXJzaW9uLFxuXHRcdFx0ZXJyb3JDYWxsYmFjayxcblx0XHR9KTtcblx0XHR0aGlzLmdsSW50ZXJuYWxGb3JtYXQgPSBnbEludGVybmFsRm9ybWF0O1xuXHRcdHRoaXMuZ2xGb3JtYXQgPSBnbEZvcm1hdDtcblx0XHR0aGlzLmdsVHlwZSA9IGdsVHlwZTtcblx0XHR0aGlzLmdsTnVtQ2hhbm5lbHMgPSBnbE51bUNoYW5uZWxzO1xuXG5cdFx0Ly8gU2V0IGludGVybmFsIGZpbHRlcmluZy93cmFwIHR5cGVzLlxuXHRcdHRoaXMuaW50ZXJuYWxGaWx0ZXIgPSBEYXRhTGF5ZXIuZ2V0SW50ZXJuYWxGaWx0ZXIoeyBnbCwgZmlsdGVyLCBpbnRlcm5hbFR5cGUsIG5hbWUsIGVycm9yQ2FsbGJhY2sgfSk7XG5cdFx0dGhpcy5nbEZpbHRlciA9IGdsW3RoaXMuaW50ZXJuYWxGaWx0ZXJdO1xuXHRcdHRoaXMuaW50ZXJuYWxXcmFwUyA9IERhdGFMYXllci5nZXRJbnRlcm5hbFdyYXAoeyBnbCwgd3JhcDogd3JhcFMsIG5hbWUgfSk7XG5cdFx0dGhpcy5nbFdyYXBTID0gZ2xbdGhpcy5pbnRlcm5hbFdyYXBTXTtcblx0XHR0aGlzLmludGVybmFsV3JhcFQgPSBEYXRhTGF5ZXIuZ2V0SW50ZXJuYWxXcmFwKHsgZ2wsIHdyYXA6IHdyYXBULCBuYW1lIH0pO1xuXHRcdHRoaXMuZ2xXcmFwVCA9IGdsW3RoaXMuaW50ZXJuYWxXcmFwVF07XG5cblx0XHQvLyBOdW0gYnVmZmVycyBpcyB0aGUgbnVtYmVyIG9mIHN0YXRlcyB0byBzdG9yZSBmb3IgdGhpcyBkYXRhLlxuXHRcdGNvbnN0IG51bUJ1ZmZlcnMgPSBwYXJhbXMubnVtQnVmZmVycyAhPT0gdW5kZWZpbmVkID8gcGFyYW1zLm51bUJ1ZmZlcnMgOiAxO1xuXHRcdGlmICghaXNQb3NpdGl2ZUludGVnZXIobnVtQnVmZmVycykpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBudW1CdWZmZXJzOiAke251bUJ1ZmZlcnN9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIsIG11c3QgYmUgcG9zaXRpdmUgaW50ZWdlci5gKTtcblx0XHR9XG5cdFx0dGhpcy5udW1CdWZmZXJzID0gbnVtQnVmZmVycztcblxuXHRcdHRoaXMuaW5pdEJ1ZmZlcnMoZGF0YSk7XG5cdH1cblxuXHRwcml2YXRlIHN0YXRpYyBjYWxjU2l6ZShkaW1lbnNpb25zOiBudW1iZXIgfCBbbnVtYmVyLCBudW1iZXJdLCBuYW1lOiBzdHJpbmcpIHtcblx0XHRsZXQgbGVuZ3RoLCB3aWR0aCwgaGVpZ2h0O1xuXHRcdGlmICghaXNOYU4oZGltZW5zaW9ucyBhcyBudW1iZXIpKSB7XG5cdFx0XHRpZiAoIWlzUG9zaXRpdmVJbnRlZ2VyKGRpbWVuc2lvbnMpKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBsZW5ndGggJHtkaW1lbnNpb25zfSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLmApO1xuXHRcdFx0fVxuXHRcdFx0bGVuZ3RoID0gZGltZW5zaW9ucyBhcyBudW1iZXI7XG5cdFx0XHQvLyBDYWxjIHBvd2VyIG9mIHR3byB3aWR0aCBhbmQgaGVpZ2h0IGZvciBsZW5ndGguXG5cdFx0XHRsZXQgZXhwID0gMTtcblx0XHRcdGxldCByZW1haW5kZXIgPSBsZW5ndGg7XG5cdFx0XHR3aGlsZSAocmVtYWluZGVyID4gMikge1xuXHRcdFx0XHRleHArKztcblx0XHRcdFx0cmVtYWluZGVyIC89IDI7XG5cdFx0XHR9XG5cdFx0XHR3aWR0aCA9IE1hdGgucG93KDIsIE1hdGguZmxvb3IoZXhwIC8gMikgKyBleHAgJSAyKTtcblx0XHRcdGhlaWdodCA9IE1hdGgucG93KDIsIE1hdGguZmxvb3IoZXhwLzIpKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0d2lkdGggPSAoZGltZW5zaW9ucyBhcyBbbnVtYmVyLCBudW1iZXJdKVswXTtcblx0XHRcdGlmICghaXNQb3NpdGl2ZUludGVnZXIod2lkdGgpKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB3aWR0aCAke3dpZHRofSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLmApO1xuXHRcdFx0fVxuXHRcdFx0aGVpZ2h0ID0gKGRpbWVuc2lvbnMgYXMgW251bWJlciwgbnVtYmVyXSlbMV07XG5cdFx0XHRpZiAoIWlzUG9zaXRpdmVJbnRlZ2VyKGhlaWdodCkpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGhlaWdodCAke2hlaWdodH0gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHsgd2lkdGgsIGhlaWdodCwgbGVuZ3RoIH07XG5cdH1cblxuXHRwcml2YXRlIHN0YXRpYyBnZXRJbnRlcm5hbFdyYXAoXG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0IHwgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCxcblx0XHRcdHdyYXA6IERhdGFMYXllcldyYXBUeXBlLFxuXHRcdFx0bmFtZTogc3RyaW5nLFxuXHRcdH0sXG5cdCkge1xuXHRcdGNvbnN0IHsgZ2wsIHdyYXAsIG5hbWUgfSA9IHBhcmFtcztcblx0XHQvLyBXZWJnbDIuMCBzdXBwb3J0cyBhbGwgY29tYmluYXRpb25zIG9mIHR5cGVzIGFuZCBmaWx0ZXJpbmcuXG5cdFx0aWYgKGlzV2ViR0wyKGdsKSkge1xuXHRcdFx0cmV0dXJuIHdyYXA7XG5cdFx0fVxuXHRcdC8vIENMQU1QX1RPX0VER0UgaXMgYWx3YXlzIHN1cHBvcnRlZC5cblx0XHRpZiAod3JhcCA9PT0gQ0xBTVBfVE9fRURHRSkge1xuXHRcdFx0cmV0dXJuIHdyYXA7XG5cdFx0fVxuXHRcdGlmICghaXNXZWJHTDIoZ2wpKSB7XG5cdFx0XHQvLyBUT0RPOiB3ZSBtYXkgd2FudCB0byBoYW5kbGUgdGhpcyBpbiB0aGUgZnJhZyBzaGFkZXIuXG5cdFx0XHQvLyBSRVBFQVQgYW5kIE1JUlJPUl9SRVBFQVQgd3JhcCBub3Qgc3VwcG9ydGVkIGZvciBub24tcG93ZXIgb2YgMiB0ZXh0dXJlcyBpbiBzYWZhcmkuXG5cdFx0XHQvLyBJJ3ZlIHRlc3RlZCB0aGlzIGFuZCBpdCBzZWVtcyB0aGF0IHNvbWUgcG93ZXIgb2YgMiB0ZXh0dXJlcyB3aWxsIHdvcmsgKDUxMiB4IDUxMiksXG5cdFx0XHQvLyBidXQgbm90IG90aGVycyAoMTAyNHgxMDI0KSwgc28gbGV0J3MganVzdCBjaGFuZ2UgYWxsIFdlYkdMIDEuMCB0byBDTEFNUC5cblx0XHRcdC8vIFdpdGhvdXQgdGhpcywgd2UgY3VycmVudGx5IGdldCBhbiBlcnJvciBhdCBkcmF3QXJyYXlzKCk6XG5cdFx0XHQvLyBcIldlYkdMOiBkcmF3QXJyYXlzOiB0ZXh0dXJlIGJvdW5kIHRvIHRleHR1cmUgdW5pdCAwIGlzIG5vdCByZW5kZXJhYmxlLlxuXHRcdFx0Ly8gSXQgbWF5YmUgbm9uLXBvd2VyLW9mLTIgYW5kIGhhdmUgaW5jb21wYXRpYmxlIHRleHR1cmUgZmlsdGVyaW5nIG9yIGlzIG5vdFxuXHRcdFx0Ly8gJ3RleHR1cmUgY29tcGxldGUnLCBvciBpdCBpcyBhIGZsb2F0L2hhbGYtZmxvYXQgdHlwZSB3aXRoIGxpbmVhciBmaWx0ZXJpbmcgYW5kXG5cdFx0XHQvLyB3aXRob3V0IHRoZSByZWxldmFudCBmbG9hdC9oYWxmLWZsb2F0IGxpbmVhciBleHRlbnNpb24gZW5hYmxlZC5cIlxuXHRcdFx0Y29uc29sZS53YXJuKGBGYWxsaW5nIGJhY2sgdG8gQ0xBTVBfVE9fRURHRSB3cmFwcGluZyBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiIGZvciBXZWJHTCAxLmApO1xuXHRcdFx0cmV0dXJuIENMQU1QX1RPX0VER0U7XG5cdFx0fVxuXHRcdHJldHVybiB3cmFwO1xuXHR9XG5cblx0cHJpdmF0ZSBzdGF0aWMgZ2V0SW50ZXJuYWxGaWx0ZXIoXG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0IHwgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCxcblx0XHRcdGZpbHRlcjogRGF0YUxheWVyRmlsdGVyVHlwZSxcblx0XHRcdGludGVybmFsVHlwZTogRGF0YUxheWVyVHlwZSxcblx0XHRcdG5hbWU6IHN0cmluZyxcblx0XHRcdGVycm9yQ2FsbGJhY2s6IEVycm9yQ2FsbGJhY2ssXG5cdFx0fSxcblx0KSB7XG5cdFx0Y29uc3QgeyBnbCwgZXJyb3JDYWxsYmFjaywgaW50ZXJuYWxUeXBlLCBuYW1lIH0gPSBwYXJhbXM7XG5cdFx0bGV0IHsgZmlsdGVyIH0gPSBwYXJhbXM7XG5cdFx0aWYgKGZpbHRlciA9PT0gTkVBUkVTVCkge1xuXHRcdFx0Ly8gTkVBUkVTVCBmaWx0ZXJpbmcgaXMgYWx3YXlzIHN1cHBvcnRlZC5cblx0XHRcdHJldHVybiBmaWx0ZXI7XG5cdFx0fVxuXG5cdFx0aWYgKGludGVybmFsVHlwZSA9PT0gSEFMRl9GTE9BVCkge1xuXHRcdFx0Ly8gVE9ETzogdGVzdCBpZiBmbG9hdCBsaW5lYXIgZXh0ZW5zaW9uIGlzIGFjdHVhbGx5IHdvcmtpbmcuXG5cdFx0XHRjb25zdCBleHRlbnNpb24gPSBnZXRFeHRlbnNpb24oZ2wsIE9FU19URVhUVVJFX0hBbEZfRkxPQVRfTElORUFSLCBlcnJvckNhbGxiYWNrLCB0cnVlKVxuXHRcdFx0XHR8fCBnZXRFeHRlbnNpb24oZ2wsIE9FU19URVhUVVJFX0ZMT0FUX0xJTkVBUiwgZXJyb3JDYWxsYmFjaywgdHJ1ZSk7XG5cdFx0XHRpZiAoIWV4dGVuc2lvbikge1xuXHRcdFx0XHRjb25zb2xlLndhcm4oYEZhbGxpbmcgYmFjayB0byBORUFSRVNUIGZpbHRlciBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLmApO1xuXHRcdFx0XHQvL1RPRE86IGFkZCBhIGZhbGxiYWNrIHRoYXQgZG9lcyB0aGlzIGZpbHRlcmluZyBpbiB0aGUgZnJhZyBzaGFkZXI/LlxuXHRcdFx0XHRmaWx0ZXIgPSBORUFSRVNUO1xuXHRcdFx0fVxuXHRcdH0gaWYgKGludGVybmFsVHlwZSA9PT0gRkxPQVQpIHtcblx0XHRcdGNvbnN0IGV4dGVuc2lvbiA9IGdldEV4dGVuc2lvbihnbCwgT0VTX1RFWFRVUkVfRkxPQVRfTElORUFSLCBlcnJvckNhbGxiYWNrLCB0cnVlKTtcblx0XHRcdGlmICghZXh0ZW5zaW9uKSB7XG5cdFx0XHRcdGNvbnNvbGUud2FybihgRmFsbGluZyBiYWNrIHRvIE5FQVJFU1QgZmlsdGVyIGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIuYCk7XG5cdFx0XHRcdC8vVE9ETzogYWRkIGEgZmFsbGJhY2sgdGhhdCBkb2VzIHRoaXMgZmlsdGVyaW5nIGluIHRoZSBmcmFnIHNoYWRlcj8uXG5cdFx0XHRcdGZpbHRlciA9IE5FQVJFU1Q7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBmaWx0ZXI7XG5cdH1cblxuXHRwcml2YXRlIHN0YXRpYyBnZXRJbnRlcm5hbFR5cGUoXG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0IHwgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCxcblx0XHRcdHR5cGU6IERhdGFMYXllclR5cGUsXG5cdFx0XHRnbHNsVmVyc2lvbjogR0xTTFZlcnNpb24sXG5cdFx0XHR3cml0YWJsZTogYm9vbGVhbixcblx0XHRcdGZpbHRlcjogRGF0YUxheWVyRmlsdGVyVHlwZSxcblx0XHRcdG5hbWU6IHN0cmluZyxcblx0XHRcdGVycm9yQ2FsbGJhY2s6IEVycm9yQ2FsbGJhY2ssXG5cdFx0fSxcblx0KSB7XG5cdFx0Y29uc3QgeyBnbCwgZXJyb3JDYWxsYmFjaywgd3JpdGFibGUsIG5hbWUsIGdsc2xWZXJzaW9uIH0gPSBwYXJhbXM7XG5cdFx0Y29uc3QgeyB0eXBlIH0gPSBwYXJhbXM7XG5cdFx0bGV0IGludGVybmFsVHlwZSA9IHR5cGU7XG5cdFx0Ly8gQ2hlY2sgaWYgaW50IHR5cGVzIGFyZSBzdXBwb3J0ZWQuXG5cdFx0Y29uc3QgaW50Q2FzdCA9IERhdGFMYXllci5zaG91bGRDYXN0SW50VHlwZUFzRmxvYXQocGFyYW1zKTtcblx0XHRpZiAoaW50Q2FzdCkge1xuXHRcdFx0aWYgKGludGVybmFsVHlwZSA9PT0gVU5TSUdORURfQllURSB8fCBpbnRlcm5hbFR5cGUgPT09IEJZVEUpIHtcblx0XHRcdFx0Ly8gSW50ZWdlcnMgYmV0d2VlbiAwIGFuZCAyMDQ4IGNhbiBiZSBleGFjdGx5IHJlcHJlc2VudGVkIGJ5IGhhbGYgZmxvYXQgKGFuZCBhbHNvIGJldHdlZW4g4oiSMjA0OCBhbmQgMClcblx0XHRcdFx0aW50ZXJuYWxUeXBlID0gSEFMRl9GTE9BVDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIEludGVnZXJzIGJldHdlZW4gMCBhbmQgMTY3NzcyMTYgY2FuIGJlIGV4YWN0bHkgcmVwcmVzZW50ZWQgYnkgZmxvYXQzMiAoYWxzbyBhcHBsaWVzIGZvciBuZWdhdGl2ZSBpbnRlZ2VycyBiZXR3ZWVuIOKIkjE2Nzc3MjE2IGFuZCAwKVxuXHRcdFx0XHQvLyBUaGlzIGlzIHN1ZmZpY2llbnQgZm9yIFVOU0lHTkVEX1NIT1JUIGFuZCBTSE9SVCB0eXBlcy5cblx0XHRcdFx0Ly8gTGFyZ2UgVU5TSUdORURfSU5UIGFuZCBJTlQgY2Fubm90IGJlIHJlcHJlc2VudGVkIGJ5IEZMT0FUIHR5cGUuXG5cdFx0XHRcdGlmIChpbnRlcm5hbFR5cGUgPT09IElOVCB8fCBpbnRlcm5hbFR5cGUgPT09IFVOU0lHTkVEX0lOVCkge1xuXHRcdFx0XHRcdFxuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnNvbGUud2FybihgRmFsbGluZyBiYWNrICR7aW50ZXJuYWxUeXBlfSB0eXBlIHRvIEZMT0FUIHR5cGUgZm9yIGdsc2wxLnggc3VwcG9ydCBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLlxuTGFyZ2UgVU5TSUdORURfSU5UIG9yIElOVCB3aXRoIGFic29sdXRlIHZhbHVlID4gMTYsNzc3LDIxNiBhcmUgbm90IHN1cHBvcnRlZCwgb24gbW9iaWxlIFVOU0lHTkVEX0lOVCwgSU5ULCBVTlNJR05FRF9TSE9SVCwgYW5kIFNIT1JUIHdpdGggYWJzb2x1dGUgdmFsdWUgPiAyLDA0OCBtYXkgbm90IGJlIHN1cHBvcnRlZC5gKTtcblx0XHRcdFx0aW50ZXJuYWxUeXBlID0gRkxPQVQ7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdC8vIENoZWNrIGlmIGZsb2F0MzIgc3VwcG9ydGVkLlxuXHRcdGlmICghaXNXZWJHTDIoZ2wpKSB7XG5cdFx0XHRpZiAoaW50ZXJuYWxUeXBlID09PSBGTE9BVCkge1xuXHRcdFx0XHRjb25zdCBleHRlbnNpb24gPSBnZXRFeHRlbnNpb24oZ2wsIE9FU19URVhUVVJFX0ZMT0FULCBlcnJvckNhbGxiYWNrLCB0cnVlKTtcblx0XHRcdFx0aWYgKCFleHRlbnNpb24pIHtcblx0XHRcdFx0XHRjb25zb2xlLndhcm4oYEZMT0FUIG5vdCBzdXBwb3J0ZWQsIGZhbGxpbmcgYmFjayB0byBIQUxGX0ZMT0FUIHR5cGUgZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdFx0XHRpbnRlcm5hbFR5cGUgPSBIQUxGX0ZMT0FUO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE3NDc2NjMyL3dlYmdsLWV4dGVuc2lvbi1zdXBwb3J0LWFjcm9zcy1icm93c2Vyc1xuXHRcdFx0XHQvLyBSZW5kZXJpbmcgdG8gYSBmbG9hdGluZy1wb2ludCB0ZXh0dXJlIG1heSBub3QgYmUgc3VwcG9ydGVkLFxuXHRcdFx0XHQvLyBldmVuIGlmIHRoZSBPRVNfdGV4dHVyZV9mbG9hdCBleHRlbnNpb24gaXMgc3VwcG9ydGVkLlxuXHRcdFx0XHQvLyBUeXBpY2FsbHksIHRoaXMgZmFpbHMgb24gY3VycmVudCBtb2JpbGUgaGFyZHdhcmUuXG5cdFx0XHRcdC8vIFRvIGNoZWNrIGlmIHRoaXMgaXMgc3VwcG9ydGVkLCB5b3UgaGF2ZSB0byBjYWxsIHRoZSBXZWJHTFxuXHRcdFx0XHQvLyBjaGVja0ZyYW1lYnVmZmVyU3RhdHVzKCkgZnVuY3Rpb24uXG5cdFx0XHRcdGlmICh3cml0YWJsZSkge1xuXHRcdFx0XHRcdGNvbnN0IHZhbGlkID0gRGF0YUxheWVyLnRlc3RGcmFtZWJ1ZmZlcldyaXRlKHsgZ2wsIHR5cGU6IGludGVybmFsVHlwZSwgZ2xzbFZlcnNpb24gfSk7XG5cdFx0XHRcdFx0aWYgKCF2YWxpZCAmJiBpbnRlcm5hbFR5cGUgIT09IEhBTEZfRkxPQVQpIHtcblx0XHRcdFx0XHRcdGNvbnNvbGUud2FybihgRkxPQVQgbm90IHN1cHBvcnRlZCBmb3Igd3JpdGluZyBvcGVyYXRpb25zLCBmYWxsaW5nIGJhY2sgdG8gSEFMRl9GTE9BVCB0eXBlIGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIuYCk7XG5cdFx0XHRcdFx0XHRpbnRlcm5hbFR5cGUgPSBIQUxGX0ZMT0FUO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0Ly8gTXVzdCBzdXBwb3J0IGF0IGxlYXN0IGhhbGYgZmxvYXQgaWYgdXNpbmcgYSBmbG9hdCB0eXBlLlxuXHRcdFx0aWYgKGludGVybmFsVHlwZSA9PT0gSEFMRl9GTE9BVCkge1xuXHRcdFx0XHRnZXRFeHRlbnNpb24oZ2wsIE9FU19URVhUVVJFX0hBTEZfRkxPQVQsIGVycm9yQ2FsbGJhY2spO1xuXHRcdFx0XHQvLyBUT0RPOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81NDI0ODYzMy9jYW5ub3QtY3JlYXRlLWhhbGYtZmxvYXQtb2VzLXRleHR1cmUtZnJvbS11aW50MTZhcnJheS1vbi1pcGFkXG5cdFx0XHRcdGlmICh3cml0YWJsZSkge1xuXHRcdFx0XHRcdGNvbnN0IHZhbGlkID0gRGF0YUxheWVyLnRlc3RGcmFtZWJ1ZmZlcldyaXRlKHsgZ2wsIHR5cGU6IGludGVybmFsVHlwZSwgZ2xzbFZlcnNpb24gfSk7XG5cdFx0XHRcdFx0aWYgKCF2YWxpZCkge1xuXHRcdFx0XHRcdFx0ZXJyb3JDYWxsYmFjayhgVGhpcyBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgcmVuZGVyaW5nIHRvIEhBTEZfRkxPQVQgdGV4dHVyZXMuYCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdFxuXHRcdC8vIExvYWQgYWRkaXRpb25hbCBleHRlbnNpb25zIGlmIG5lZWRlZC5cblx0XHRpZiAod3JpdGFibGUgJiYgaXNXZWJHTDIoZ2wpICYmIChpbnRlcm5hbFR5cGUgPT09IEhBTEZfRkxPQVQgfHwgaW50ZXJuYWxUeXBlID09PSBGTE9BVCkpIHtcblx0XHRcdGdldEV4dGVuc2lvbihnbCwgRVhUX0NPTE9SX0JVRkZFUl9GTE9BVCwgZXJyb3JDYWxsYmFjayk7XG5cdFx0fVxuXHRcdHJldHVybiBpbnRlcm5hbFR5cGU7XG5cdH1cblxuXHRwcml2YXRlIHN0YXRpYyBzaG91bGRDYXN0SW50VHlwZUFzRmxvYXQoXG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0IHwgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCxcblx0XHRcdHR5cGU6IERhdGFMYXllclR5cGUsXG5cdFx0XHRmaWx0ZXI6IERhdGFMYXllckZpbHRlclR5cGUsXG5cdFx0XHRnbHNsVmVyc2lvbjogR0xTTFZlcnNpb24sXG5cdFx0fVxuXHQpIHtcblx0XHRjb25zdCB7IGdsLCB0eXBlLCBmaWx0ZXIsIGdsc2xWZXJzaW9uIH0gPSBwYXJhbXM7XG5cdFx0aWYgKGdsc2xWZXJzaW9uID09PSBHTFNMMyAmJiBpc1dlYkdMMihnbCkpIHJldHVybiBmYWxzZTtcblx0XHQvLyBVTlNJR05FRF9CWVRFIGFuZCBMSU5FQVIgZmlsdGVyaW5nIGlzIG5vdCBzdXBwb3J0ZWQsIGNhc3QgYXMgZmxvYXQuXG5cdFx0aWYgKHR5cGUgPT09IFVOU0lHTkVEX0JZVEUgJiYgZmlsdGVyID09PSBMSU5FQVIpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHQvLyBJbnQgdGV4dHVyZXMgKG90aGVyIHRoYW4gVU5TSUdORURfQllURSkgYXJlIG5vdCBzdXBwb3J0ZWQgYnkgV2ViR0wxLjAgb3IgZ2xzbDEueC5cblx0XHQvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81NTgwMzAxNy9ob3ctdG8tc2VsZWN0LXdlYmdsLWdsc2wtc2FtcGxlci10eXBlLWZyb20tdGV4dHVyZS1mb3JtYXQtcHJvcGVydGllc1xuXHRcdC8vIFVzZSBIQUxGX0ZMT0FUL0ZMT0FUIGluc3RlYWQuXG5cdFx0cmV0dXJuIHR5cGUgPT09IEJZVEUgfHwgdHlwZSA9PT0gU0hPUlQgfHwgdHlwZSA9PT0gSU5UIHx8IHR5cGUgPT09IFVOU0lHTkVEX1NIT1JUIHx8IHR5cGUgPT09IFVOU0lHTkVEX0lOVDtcblx0fVxuXG5cdHByaXZhdGUgc3RhdGljIGdldEdMVGV4dHVyZVBhcmFtZXRlcnMoXG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0IHwgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCxcblx0XHRcdG5hbWU6IHN0cmluZyxcblx0XHRcdG51bUNvbXBvbmVudHM6IERhdGFMYXllck51bUNvbXBvbmVudHMsXG5cdFx0XHRpbnRlcm5hbFR5cGU6IERhdGFMYXllclR5cGUsXG5cdFx0XHR3cml0YWJsZTogYm9vbGVhbixcblx0XHRcdGdsc2xWZXJzaW9uOiBHTFNMVmVyc2lvbixcblx0XHRcdGVycm9yQ2FsbGJhY2s6IEVycm9yQ2FsbGJhY2ssXG5cdFx0fVxuXHQpIHtcblx0XHRjb25zdCB7IGdsLCBlcnJvckNhbGxiYWNrLCBuYW1lLCBudW1Db21wb25lbnRzLCBpbnRlcm5hbFR5cGUsIHdyaXRhYmxlLCBnbHNsVmVyc2lvbiB9ID0gcGFyYW1zO1xuXHRcdC8vIGh0dHBzOi8vd3d3Lmtocm9ub3Mub3JnL3JlZ2lzdHJ5L3dlYmdsL3NwZWNzL2xhdGVzdC8yLjAvI1RFWFRVUkVfVFlQRVNfRk9STUFUU19GUk9NX0RPTV9FTEVNRU5UU19UQUJMRVxuXHRcdGxldCBnbFR5cGU6IG51bWJlciB8IHVuZGVmaW5lZCxcblx0XHRcdGdsRm9ybWF0OiBudW1iZXIgfCB1bmRlZmluZWQsXG5cdFx0XHRnbEludGVybmFsRm9ybWF0OiBudW1iZXIgfCB1bmRlZmluZWQsXG5cdFx0XHRnbE51bUNoYW5uZWxzOiBudW1iZXIgfCB1bmRlZmluZWQ7XG5cblx0XHRpZiAoaXNXZWJHTDIoZ2wpKSB7XG5cdFx0XHRnbE51bUNoYW5uZWxzID0gbnVtQ29tcG9uZW50cztcblx0XHRcdC8vIGh0dHBzOi8vd3d3Lmtocm9ub3Mub3JnL3JlZ2lzdHJ5L3dlYmdsL2V4dGVuc2lvbnMvRVhUX2NvbG9yX2J1ZmZlcl9mbG9hdC9cblx0XHRcdC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9XZWJHTFJlbmRlcmluZ0NvbnRleHQvdGV4SW1hZ2UyRFxuXHRcdFx0Ly8gVGhlIHNpemVkIGludGVybmFsIGZvcm1hdCBSR0J4eHggYXJlIG5vdCBjb2xvci1yZW5kZXJhYmxlIGZvciBzb21lIHJlYXNvbi5cblx0XHRcdC8vIElmIG51bUNvbXBvbmVudHMgPT0gMyBmb3IgYSB3cml0YWJsZSB0ZXh0dXJlLCB1c2UgUkdCQSBpbnN0ZWFkLlxuXHRcdFx0Ly8gUGFnZSA1IG9mIGh0dHBzOi8vd3d3Lmtocm9ub3Mub3JnL2ZpbGVzL3dlYmdsMjAtcmVmZXJlbmNlLWd1aWRlLnBkZlxuXHRcdFx0aWYgKG51bUNvbXBvbmVudHMgPT09IDMgJiYgd3JpdGFibGUpIHtcblx0XHRcdFx0Z2xOdW1DaGFubmVscyA9IDQ7XG5cdFx0XHR9XG5cdFx0XHRpZiAoaW50ZXJuYWxUeXBlID09PSBGTE9BVCB8fCBpbnRlcm5hbFR5cGUgPT09IEhBTEZfRkxPQVQpIHtcblx0XHRcdFx0c3dpdGNoIChnbE51bUNoYW5uZWxzKSB7XG5cdFx0XHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRcdFx0Z2xGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkVEO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdFx0Z2xGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkc7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDM6XG5cdFx0XHRcdFx0XHRnbEZvcm1hdCA9IGdsLlJHQjtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgNDpcblx0XHRcdFx0XHRcdGdsRm9ybWF0ID0gZ2wuUkdCQTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGdsTnVtQ2hhbm5lbHMgJHtnbE51bUNoYW5uZWxzfSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLmApO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKGdsc2xWZXJzaW9uID09PSBHTFNMMSAmJiBpbnRlcm5hbFR5cGUgPT09IFVOU0lHTkVEX0JZVEUpIHtcblx0XHRcdFx0c3dpdGNoIChnbE51bUNoYW5uZWxzKSB7XG5cdFx0XHRcdFx0Ly8gRm9yIHJlYWQgb25seSB0ZXh0dXJlcyBpbiBXZWJHTCAxLjAsIHVzZSBnbC5BTFBIQSBhbmQgZ2wuTFVNSU5BTkNFX0FMUEhBLlxuXHRcdFx0XHRcdC8vIE90aGVyd2lzZSB1c2UgUkdCL1JHQkEuXG5cdFx0XHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRcdFx0aWYgKCF3cml0YWJsZSkge1xuXHRcdFx0XHRcdFx0XHRnbEZvcm1hdCA9IGdsLkFMUEhBO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjYXNlIDI6XG5cdFx0XHRcdFx0XHRpZiAoIXdyaXRhYmxlKSB7XG5cdFx0XHRcdFx0XHRcdGdsRm9ybWF0ID0gZ2wuTFVNSU5BTkNFX0FMUEhBO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjYXNlIDM6XG5cdFx0XHRcdFx0XHRnbEZvcm1hdCA9IGdsLlJHQjtcblx0XHRcdFx0XHRcdGdsTnVtQ2hhbm5lbHMgPSAzO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSA0OlxuXHRcdFx0XHRcdFx0Z2xGb3JtYXQgPSBnbC5SR0JBO1xuXHRcdFx0XHRcdFx0Z2xOdW1DaGFubmVscyA9IDQ7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBnbE51bUNoYW5uZWxzICR7Z2xOdW1DaGFubmVsc30gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c3dpdGNoIChnbE51bUNoYW5uZWxzKSB7XG5cdFx0XHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRcdFx0Z2xGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkVEX0lOVEVHRVI7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDI6XG5cdFx0XHRcdFx0XHRnbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR19JTlRFR0VSO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHRcdFx0Z2xGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkdCX0lOVEVHRVI7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDQ6XG5cdFx0XHRcdFx0XHRnbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR0JBX0lOVEVHRVI7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBnbE51bUNoYW5uZWxzICR7Z2xOdW1DaGFubmVsc30gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0c3dpdGNoIChpbnRlcm5hbFR5cGUpIHtcblx0XHRcdFx0Y2FzZSBIQUxGX0ZMT0FUOlxuXHRcdFx0XHRcdGdsVHlwZSA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5IQUxGX0ZMT0FUO1xuXHRcdFx0XHRcdHN3aXRjaCAoZ2xOdW1DaGFubmVscykge1xuXHRcdFx0XHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlIxNkY7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHMTZGO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgMzpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR0IxNkY7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSA0OlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHQkExNkY7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBnbE51bUNoYW5uZWxzICR7Z2xOdW1DaGFubmVsc30gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgRkxPQVQ6XG5cdFx0XHRcdFx0Z2xUeXBlID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLkZMT0FUO1xuXHRcdFx0XHRcdHN3aXRjaCAoZ2xOdW1DaGFubmVscykge1xuXHRcdFx0XHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlIzMkY7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHMzJGO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgMzpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR0IzMkY7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSA0OlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHQkEzMkY7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBnbE51bUNoYW5uZWxzICR7Z2xOdW1DaGFubmVsc30gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgVU5TSUdORURfQllURTpcblx0XHRcdFx0XHRnbFR5cGUgPSBnbC5VTlNJR05FRF9CWVRFO1xuXHRcdFx0XHRcdGlmIChnbHNsVmVyc2lvbiA9PT0gR0xTTDEgJiYgaW50ZXJuYWxUeXBlID09PSBVTlNJR05FRF9CWVRFKSB7XG5cdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gZ2xGb3JtYXQ7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHN3aXRjaCAoZ2xOdW1DaGFubmVscykge1xuXHRcdFx0XHRcdFx0XHRjYXNlIDE6XG5cdFx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SOFVJO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRjYXNlIDI6XG5cdFx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SRzhVSTtcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkdCOFVJO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRjYXNlIDQ6XG5cdFx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR0JBOFVJO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgZ2xOdW1DaGFubmVscyAke2dsTnVtQ2hhbm5lbHN9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIuYCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIEJZVEU6XG5cdFx0XHRcdFx0Z2xUeXBlID0gZ2wuQllURTtcblx0XHRcdFx0XHRzd2l0Y2ggKGdsTnVtQ2hhbm5lbHMpIHtcblx0XHRcdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SOEk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHOEk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHQjhJO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgNDpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR0JBOEk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBnbE51bUNoYW5uZWxzICR7Z2xOdW1DaGFubmVsc30gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgU0hPUlQ6XG5cdFx0XHRcdFx0Z2xUeXBlID0gZ2wuU0hPUlQ7XG5cdFx0XHRcdFx0c3dpdGNoIChnbE51bUNoYW5uZWxzKSB7XG5cdFx0XHRcdFx0XHRjYXNlIDE6XG5cdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUjE2STtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDI6XG5cdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkcxNkk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHQjE2STtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDQ6XG5cdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkdCQTE2STtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGdsTnVtQ2hhbm5lbHMgJHtnbE51bUNoYW5uZWxzfSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLmApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBVTlNJR05FRF9TSE9SVDpcblx0XHRcdFx0XHRnbFR5cGUgPSBnbC5VTlNJR05FRF9TSE9SVDtcblx0XHRcdFx0XHRzd2l0Y2ggKGdsTnVtQ2hhbm5lbHMpIHtcblx0XHRcdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SMTZVSTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDI6XG5cdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkcxNlVJO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgMzpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR0IxNlVJO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgNDpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR0JBMTZVSTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGdsTnVtQ2hhbm5lbHMgJHtnbE51bUNoYW5uZWxzfSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLmApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBJTlQ6XG5cdFx0XHRcdFx0Z2xUeXBlID0gZ2wuSU5UO1xuXHRcdFx0XHRcdHN3aXRjaCAoZ2xOdW1DaGFubmVscykge1xuXHRcdFx0XHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlIzMkk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHMzJJO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgMzpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR0IzMkk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSA0OlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHQkEzMkk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBnbE51bUNoYW5uZWxzICR7Z2xOdW1DaGFubmVsc30gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgVU5TSUdORURfSU5UOlxuXHRcdFx0XHRcdGdsVHlwZSA9IGdsLlVOU0lHTkVEX0lOVDtcblx0XHRcdFx0XHRzd2l0Y2ggKGdsTnVtQ2hhbm5lbHMpIHtcblx0XHRcdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SMzJVSTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDI6XG5cdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkczMlVJO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgMzpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR0IzMlVJO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgNDpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR0JBMzJVSTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGdsTnVtQ2hhbm5lbHMgJHtnbE51bUNoYW5uZWxzfSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLmApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIHR5cGUgJHtpbnRlcm5hbFR5cGV9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIuYCk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHN3aXRjaCAobnVtQ29tcG9uZW50cykge1xuXHRcdFx0XHQvLyBUT0RPOiBmb3IgcmVhZCBvbmx5IHRleHR1cmVzIGluIFdlYkdMIDEuMCwgd2UgY291bGQgdXNlIGdsLkFMUEhBIGFuZCBnbC5MVU1JTkFOQ0VfQUxQSEEgaGVyZS5cblx0XHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRcdGlmICghd3JpdGFibGUpIHtcblx0XHRcdFx0XHRcdGdsRm9ybWF0ID0gZ2wuQUxQSEE7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdGNhc2UgMjpcblx0XHRcdFx0XHRpZiAoIXdyaXRhYmxlKSB7XG5cdFx0XHRcdFx0XHRnbEZvcm1hdCA9IGdsLkxVTUlOQU5DRV9BTFBIQTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHRcdGdsRm9ybWF0ID0gZ2wuUkdCO1xuXHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSBnbC5SR0I7XG5cdFx0XHRcdFx0Z2xOdW1DaGFubmVscyA9IDM7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgNDpcblx0XHRcdFx0XHRnbEZvcm1hdCA9IGdsLlJHQkE7XG5cdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IGdsLlJHQkE7XG5cdFx0XHRcdFx0Z2xOdW1DaGFubmVscyA9IDQ7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBudW1Db21wb25lbnRzICR7bnVtQ29tcG9uZW50c30gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdH1cblx0XHRcdHN3aXRjaCAoaW50ZXJuYWxUeXBlKSB7XG5cdFx0XHRcdGNhc2UgRkxPQVQ6XG5cdFx0XHRcdFx0Z2xUeXBlID0gZ2wuRkxPQVQ7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgSEFMRl9GTE9BVDpcblx0XHRcdFx0XHRnbFR5cGUgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuSEFMRl9GTE9BVCB8fCBnZXRFeHRlbnNpb24oZ2wsIE9FU19URVhUVVJFX0hBTEZfRkxPQVQsIGVycm9yQ2FsbGJhY2spLkhBTEZfRkxPQVRfT0VTIGFzIG51bWJlcjtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBVTlNJR05FRF9CWVRFOlxuXHRcdFx0XHRcdGdsVHlwZSA9IGdsLlVOU0lHTkVEX0JZVEU7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdC8vIE5vIG90aGVyIHR5cGVzIGFyZSBzdXBwb3J0ZWQgaW4gZ2xzbDEueFxuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgdHlwZSAke2ludGVybmFsVHlwZX0gaW4gV2ViR0wgMS4wIGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIuYCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gQ2hlY2sgZm9yIG1pc3NpbmcgcGFyYW1zLlxuXHRcdGlmIChnbFR5cGUgPT09IHVuZGVmaW5lZCB8fCBnbEZvcm1hdCA9PT0gdW5kZWZpbmVkIHx8IGdsSW50ZXJuYWxGb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Y29uc3QgbWlzc2luZ1BhcmFtcyA9IFtdO1xuXHRcdFx0aWYgKGdsVHlwZSA9PT0gdW5kZWZpbmVkKSBtaXNzaW5nUGFyYW1zLnB1c2goJ2dsVHlwZScpO1xuXHRcdFx0aWYgKGdsRm9ybWF0ID09PSB1bmRlZmluZWQpIG1pc3NpbmdQYXJhbXMucHVzaCgnZ2xGb3JtYXQnKTtcblx0XHRcdGlmIChnbEludGVybmFsRm9ybWF0ID09PSB1bmRlZmluZWQpIG1pc3NpbmdQYXJhbXMucHVzaCgnZ2xJbnRlcm5hbEZvcm1hdCcpO1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHR5cGU6ICR7aW50ZXJuYWxUeXBlfSBmb3IgbnVtQ29tcG9uZW50cyAke251bUNvbXBvbmVudHN9LCB1bmFibGUgdG8gaW5pdCBwYXJhbWV0ZXIke21pc3NpbmdQYXJhbXMubGVuZ3RoID4gMSA/ICdzJyA6ICcnfSAke21pc3NpbmdQYXJhbXMuam9pbignLCAnKX0gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHR9XG5cdFx0aWYgKGdsTnVtQ2hhbm5lbHMgPT09IHVuZGVmaW5lZCB8fCBudW1Db21wb25lbnRzIDwgMSB8fCBudW1Db21wb25lbnRzID4gNCB8fCBnbE51bUNoYW5uZWxzIDwgbnVtQ29tcG9uZW50cykge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIG51bUNoYW5uZWxzICR7Z2xOdW1DaGFubmVsc30gZm9yIG51bUNvbXBvbmVudHMgJHtudW1Db21wb25lbnRzfSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLmApO1xuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHRnbEZvcm1hdCxcblx0XHRcdGdsSW50ZXJuYWxGb3JtYXQsXG5cdFx0XHRnbFR5cGUsXG5cdFx0XHRnbE51bUNoYW5uZWxzLFxuXHRcdH07XG5cdH1cblxuXHRwcml2YXRlIHN0YXRpYyB0ZXN0RnJhbWVidWZmZXJXcml0ZShcblx0XHRwYXJhbXM6IHtcblx0XHRcdGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQgfCBXZWJHTDJSZW5kZXJpbmdDb250ZXh0LFxuXHRcdFx0dHlwZTogRGF0YUxheWVyVHlwZSxcblx0XHRcdGdsc2xWZXJzaW9uOiBHTFNMVmVyc2lvbixcblx0XHR9LFxuXHQpIHtcblx0XHRjb25zdCB7IGdsLCB0eXBlLCBnbHNsVmVyc2lvbiB9ID0gcGFyYW1zO1xuXHRcdGNvbnN0IHRleHR1cmUgPSBnbC5jcmVhdGVUZXh0dXJlKCk7XG5cdFx0aWYgKCF0ZXh0dXJlKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIHRleHR1cmUpO1xuXG5cdFx0Ly8gRGVmYXVsdCB0byBtb3N0IHdpZGVseSBzdXBwb3J0ZWQgc2V0dGluZ3MuXG5cdFx0Y29uc3Qgd3JhcFMgPSBnbFtDTEFNUF9UT19FREdFXTtcblx0XHRjb25zdCB3cmFwVCA9IGdsW0NMQU1QX1RPX0VER0VdO1xuXHRcdGNvbnN0IGZpbHRlciA9IGdsW05FQVJFU1RdO1xuXHRcdC8vIFVzZSBub24tcG93ZXIgb2YgdHdvIGRpbWVuc2lvbnMgdG8gY2hlY2sgZm9yIG1vcmUgdW5pdmVyc2FsIHN1cHBvcnQuXG5cdFx0Ly8gKEluIGNhc2Ugc2l6ZSBvZiBEYXRhTGF5ZXIgaXMgY2hhbmdlZCBhdCBhIGxhdGVyIHBvaW50KS5cblx0XHRjb25zdCB3aWR0aCA9IDEwMDtcblx0XHRjb25zdCBoZWlnaHQgPSAxMDA7XG5cdFx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfUywgd3JhcFMpO1xuXHRcdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1QsIHdyYXBUKTtcblx0XHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgZmlsdGVyKTtcblx0XHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgZmlsdGVyKTtcblxuXHRcdGNvbnN0IHsgZ2xJbnRlcm5hbEZvcm1hdCwgZ2xGb3JtYXQsIGdsVHlwZSB9ID0gRGF0YUxheWVyLmdldEdMVGV4dHVyZVBhcmFtZXRlcnMoe1xuXHRcdFx0Z2wsXG5cdFx0XHRuYW1lOiAndGVzdEZyYW1lYnVmZmVyV3JpdGUnLFxuXHRcdFx0bnVtQ29tcG9uZW50czogMSxcblx0XHRcdHdyaXRhYmxlOiB0cnVlLFxuXHRcdFx0aW50ZXJuYWxUeXBlOiB0eXBlLFxuXHRcdFx0Z2xzbFZlcnNpb24sXG5cdFx0XHRlcnJvckNhbGxiYWNrOiAoKSA9PiB7fSxcblx0XHR9KTtcblx0XHRnbC50ZXhJbWFnZTJEKGdsLlRFWFRVUkVfMkQsIDAsIGdsSW50ZXJuYWxGb3JtYXQsIHdpZHRoLCBoZWlnaHQsIDAsIGdsRm9ybWF0LCBnbFR5cGUsIG51bGwpO1xuXG5cdFx0Ly8gSW5pdCBhIGZyYW1lYnVmZmVyIGZvciB0aGlzIHRleHR1cmUgc28gd2UgY2FuIHdyaXRlIHRvIGl0LlxuXHRcdGNvbnN0IGZyYW1lYnVmZmVyID0gZ2wuY3JlYXRlRnJhbWVidWZmZXIoKTtcblx0XHRpZiAoIWZyYW1lYnVmZmVyKSB7XG5cdFx0XHQvLyBDbGVhciBvdXQgYWxsb2NhdGVkIG1lbW9yeS5cblx0XHRcdGdsLmRlbGV0ZVRleHR1cmUodGV4dHVyZSk7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdGdsLmJpbmRGcmFtZWJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgZnJhbWVidWZmZXIpO1xuXHRcdC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9XZWJHTFJlbmRlcmluZ0NvbnRleHQvZnJhbWVidWZmZXJUZXh0dXJlMkRcblx0XHRnbC5mcmFtZWJ1ZmZlclRleHR1cmUyRChnbC5GUkFNRUJVRkZFUiwgZ2wuQ09MT1JfQVRUQUNITUVOVDAsIGdsLlRFWFRVUkVfMkQsIHRleHR1cmUsIDApO1xuXG5cdFx0Y29uc3Qgc3RhdHVzID0gZ2wuY2hlY2tGcmFtZWJ1ZmZlclN0YXR1cyhnbC5GUkFNRUJVRkZFUik7XG5cdFx0Y29uc3QgdmFsaWRTdGF0dXMgPSBzdGF0dXMgPT09IGdsLkZSQU1FQlVGRkVSX0NPTVBMRVRFO1xuXG5cdFx0Ly8gQ2xlYXIgb3V0IGFsbG9jYXRlZCBtZW1vcnkuXG5cdFx0Z2wuZGVsZXRlVGV4dHVyZSh0ZXh0dXJlKTtcblx0XHRnbC5kZWxldGVGcmFtZWJ1ZmZlcihmcmFtZWJ1ZmZlcik7XG5cblx0XHRyZXR1cm4gdmFsaWRTdGF0dXM7XG5cdH1cblxuXHRnZXQgYnVmZmVySW5kZXgoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX2J1ZmZlckluZGV4O1xuXHR9XG5cblx0c2F2ZUN1cnJlbnRTdGF0ZVRvRGF0YUxheWVyKGxheWVyOiBEYXRhTGF5ZXIpIHtcblx0XHQvLyBBIG1ldGhvZCBmb3Igc2F2aW5nIGEgY29weSBvZiB0aGUgY3VycmVudCBzdGF0ZSB3aXRob3V0IGEgZHJhdyBjYWxsLlxuXHRcdC8vIERyYXcgY2FsbHMgYXJlIGV4cGVuc2l2ZSwgdGhpcyBvcHRpbWl6YXRpb24gaGVscHMuXG5cdFx0aWYgKHRoaXMubnVtQnVmZmVycyA8IDIpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgQ2FuJ3QgY2FsbCBEYXRhTGF5ZXIuc2F2ZUN1cnJlbnRTdGF0ZVRvRGF0YUxheWVyIG9uIERhdGFMYXllciAke3RoaXMubmFtZX0gd2l0aCBsZXNzIHRoYW4gMiBidWZmZXJzLmApO1xuXHRcdH1cblx0XHRpZiAoIXRoaXMud3JpdGFibGUpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgQ2FuJ3QgY2FsbCBEYXRhTGF5ZXIuc2F2ZUN1cnJlbnRTdGF0ZVRvRGF0YUxheWVyIG9uIHJlYWQtb25seSBEYXRhTGF5ZXIgJHt0aGlzLm5hbWV9LmApO1xuXHRcdH1cblx0XHRpZiAobGF5ZXIud3JpdGFibGUpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgQ2FuJ3QgY2FsbCBEYXRhTGF5ZXIuc2F2ZUN1cnJlbnRTdGF0ZVRvRGF0YUxheWVyIG9uIERhdGFMYXllciAke3RoaXMubmFtZX0gdXNpbmcgd3JpdGFibGUgRGF0YUxheWVyICR7bGF5ZXIubmFtZX0uYClcblx0XHR9XG5cdFx0Ly8gQ2hlY2sgdGhhdCB0ZXh0dXJlIHBhcmFtcyBhcmUgdGhlIHNhbWUuXG5cdFx0aWYgKGxheWVyLmdsV3JhcFMgIT09IHRoaXMuZ2xXcmFwUyB8fCBsYXllci5nbFdyYXBUICE9PSB0aGlzLmdsV3JhcFQgfHxcblx0XHRcdGxheWVyLndyYXBTICE9PSB0aGlzLndyYXBTIHx8IGxheWVyLndyYXBUICE9PSB0aGlzLndyYXBUIHx8XG5cdFx0XHRsYXllci53aWR0aCAhPT0gdGhpcy53aWR0aCB8fCBsYXllci5oZWlnaHQgIT09IHRoaXMuaGVpZ2h0IHx8XG5cdFx0XHRsYXllci5nbEZpbHRlciAhPT0gdGhpcy5nbEZpbHRlciB8fCBsYXllci5maWx0ZXIgIT09IHRoaXMuZmlsdGVyIHx8XG5cdFx0XHRsYXllci5nbE51bUNoYW5uZWxzICE9PSB0aGlzLmdsTnVtQ2hhbm5lbHMgfHwgbGF5ZXIubnVtQ29tcG9uZW50cyAhPT0gdGhpcy5udW1Db21wb25lbnRzIHx8XG5cdFx0XHRsYXllci5nbFR5cGUgIT09IHRoaXMuZ2xUeXBlIHx8IGxheWVyLnR5cGUgIT09IHRoaXMudHlwZSB8fFxuXHRcdFx0bGF5ZXIuZ2xGb3JtYXQgIT09IHRoaXMuZ2xGb3JtYXQgfHwgbGF5ZXIuZ2xJbnRlcm5hbEZvcm1hdCAhPT0gdGhpcy5nbEludGVybmFsRm9ybWF0KSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgSW5jb21wYXRpYmxlIHRleHR1cmUgcGFyYW1zIGJldHdlZW4gRGF0YUxheWVycyAke2xheWVyLm5hbWV9IGFuZCAke3RoaXMubmFtZX0uYCk7XG5cdFx0fVxuXG5cdFx0Ly8gSWYgd2UgaGF2ZSBub3QgYWxyZWFkeSBpbml0ZWQgb3ZlcnJpZGVzIGFycmF5LCBkbyBzbyBub3cuXG5cdFx0aWYgKCF0aGlzLnRleHR1cmVPdmVycmlkZXMpIHtcblx0XHRcdHRoaXMudGV4dHVyZU92ZXJyaWRlcyA9IFtdO1xuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm51bUJ1ZmZlcnM7IGkrKykge1xuXHRcdFx0XHR0aGlzLnRleHR1cmVPdmVycmlkZXMucHVzaCh1bmRlZmluZWQpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIENoZWNrIGlmIHdlIGFscmVhZHkgaGF2ZSBhbiBvdmVycmlkZSBpbiBwbGFjZS5cblx0XHRpZiAodGhpcy50ZXh0dXJlT3ZlcnJpZGVzW3RoaXMuX2J1ZmZlckluZGV4XSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBDYW4ndCBjYWxsIERhdGFMYXllci5zYXZlQ3VycmVudFN0YXRlVG9EYXRhTGF5ZXIgb24gRGF0YUxheWVyICR7dGhpcy5uYW1lfSwgdGhpcyBEYXRhTGF5ZXIgaGFzIG5vdCB3cml0dGVuIG5ldyBzdGF0ZSBzaW5jZSBsYXN0IGNhbGwgdG8gRGF0YUxheWVyLnNhdmVDdXJyZW50U3RhdGVUb0RhdGFMYXllci5gKTtcblx0XHR9XG5cdFx0Y29uc3QgY3VycmVudFN0YXRlID0gdGhpcy5nZXRDdXJyZW50U3RhdGVUZXh0dXJlKCk7XG5cdFx0dGhpcy50ZXh0dXJlT3ZlcnJpZGVzW3RoaXMuX2J1ZmZlckluZGV4XSA9IGN1cnJlbnRTdGF0ZTtcblx0XHQvLyBTd2FwIHRleHR1cmVzLlxuXHRcdHRoaXMuYnVmZmVyc1t0aGlzLl9idWZmZXJJbmRleF0udGV4dHVyZSA9IGxheWVyLmdldEN1cnJlbnRTdGF0ZVRleHR1cmUoKTtcblx0XHRsYXllci5fc2V0Q3VycmVudFN0YXRlVGV4dHVyZShjdXJyZW50U3RhdGUpO1xuXG5cdFx0Ly8gQmluZCBzd2FwcGVkIHRleHR1cmUgdG8gZnJhbWVidWZmZXIuXG5cdFx0Y29uc3QgeyBnbCB9ID0gdGhpcztcblx0XHRjb25zdCB7IGZyYW1lYnVmZmVyLCB0ZXh0dXJlIH0gPSB0aGlzLmJ1ZmZlcnNbdGhpcy5fYnVmZmVySW5kZXhdO1xuXHRcdGlmICghZnJhbWVidWZmZXIpIHRocm93IG5ldyBFcnJvcihgTm8gZnJhbWVidWZmZXIgZm9yIHdyaXRhYmxlIERhdGFMYXllciAke3RoaXMubmFtZX0uYCk7XG5cdFx0Z2wuYmluZEZyYW1lYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBmcmFtZWJ1ZmZlcik7XG5cdFx0Ly8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1dlYkdMUmVuZGVyaW5nQ29udGV4dC9mcmFtZWJ1ZmZlclRleHR1cmUyRFxuXHRcdGdsLmZyYW1lYnVmZmVyVGV4dHVyZTJEKGdsLkZSQU1FQlVGRkVSLCBnbC5DT0xPUl9BVFRBQ0hNRU5UMCwgZ2wuVEVYVFVSRV8yRCwgdGV4dHVyZSwgMCk7XG5cdFx0Ly8gVW5iaW5kLlxuXHRcdGdsLmJpbmRGcmFtZWJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgbnVsbCk7XG5cdH1cblxuXHRfc2V0Q3VycmVudFN0YXRlVGV4dHVyZSh0ZXh0dXJlOiBXZWJHTFRleHR1cmUpIHtcblx0XHRpZiAodGhpcy53cml0YWJsZSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBDYW4ndCBjYWxsIERhdGFMYXllci5fc2V0Q3VycmVudFN0YXRlVGV4dHVyZSBvbiB3cml0YWJsZSB0ZXh0dXJlICR7dGhpcy5uYW1lfS5gKTtcblx0XHR9XG5cdFx0dGhpcy5idWZmZXJzW3RoaXMuX2J1ZmZlckluZGV4XS50ZXh0dXJlID0gdGV4dHVyZTtcblx0fVxuXG5cdHByaXZhdGUgdmFsaWRhdGVEYXRhQXJyYXkoXG5cdFx0X2RhdGE/OiBEYXRhTGF5ZXJBcnJheVR5cGUsXG5cdCkge1xuXHRcdGlmICghX2RhdGEpe1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRjb25zdCB7IHdpZHRoLCBoZWlnaHQsIGxlbmd0aCwgbnVtQ29tcG9uZW50cywgZ2xOdW1DaGFubmVscywgdHlwZSwgaW50ZXJuYWxUeXBlLCBuYW1lIH0gPSB0aGlzO1xuXG5cdFx0Ly8gQ2hlY2sgdGhhdCBkYXRhIGlzIGNvcnJlY3QgbGVuZ3RoICh1c2VyIGVycm9yKS5cblx0XHRpZiAoKGxlbmd0aCAmJiBfZGF0YS5sZW5ndGggIT09IGxlbmd0aCAqIG51bUNvbXBvbmVudHMpIHx8ICghbGVuZ3RoICYmIF9kYXRhLmxlbmd0aCAhPT0gd2lkdGggKiBoZWlnaHQgKiBudW1Db21wb25lbnRzKSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGRhdGEgbGVuZ3RoICR7X2RhdGEubGVuZ3RofSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiIG9mIHNpemUgJHtsZW5ndGggPyBsZW5ndGggOiBgJHt3aWR0aH14JHtoZWlnaHR9YH14JHtudW1Db21wb25lbnRzfS5gKTtcblx0XHR9XG5cblx0XHQvLyBDaGVjayB0aGF0IGRhdGEgaXMgY29ycmVjdCB0eXBlICh1c2VyIGVycm9yKS5cblx0XHRsZXQgaW52YWxpZFR5cGVGb3VuZCA9IGZhbHNlO1xuXHRcdHN3aXRjaCAodHlwZSkge1xuXHRcdFx0Y2FzZSBIQUxGX0ZMT0FUOlxuXHRcdFx0XHQvLyBTaW5jZSB0aGVyZSBpcyBubyBGbG9hdDE2QXJyYXksIHdlIG11c3QgdXNlIEZsb2F0MzJBcnJheXMgdG8gaW5pdCB0ZXh0dXJlLlxuXHRcdFx0XHQvLyBDb250aW51ZSB0byBuZXh0IGNhc2UuXG5cdFx0XHRjYXNlIEZMT0FUOlxuXHRcdFx0XHRpbnZhbGlkVHlwZUZvdW5kID0gaW52YWxpZFR5cGVGb3VuZCB8fCBfZGF0YS5jb25zdHJ1Y3RvciAhPT0gRmxvYXQzMkFycmF5O1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgVU5TSUdORURfQllURTpcblx0XHRcdFx0aW52YWxpZFR5cGVGb3VuZCA9IGludmFsaWRUeXBlRm91bmQgfHwgX2RhdGEuY29uc3RydWN0b3IgIT09IFVpbnQ4QXJyYXk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBCWVRFOlxuXHRcdFx0XHRpbnZhbGlkVHlwZUZvdW5kID0gaW52YWxpZFR5cGVGb3VuZCB8fCBfZGF0YS5jb25zdHJ1Y3RvciAhPT0gSW50OEFycmF5O1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgVU5TSUdORURfU0hPUlQ6XG5cdFx0XHRcdGludmFsaWRUeXBlRm91bmQgPSBpbnZhbGlkVHlwZUZvdW5kIHx8IF9kYXRhLmNvbnN0cnVjdG9yICE9PSBVaW50MTZBcnJheTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFNIT1JUOlxuXHRcdFx0XHRpbnZhbGlkVHlwZUZvdW5kID0gaW52YWxpZFR5cGVGb3VuZCB8fCBfZGF0YS5jb25zdHJ1Y3RvciAhPT0gSW50MTZBcnJheTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFVOU0lHTkVEX0lOVDpcblx0XHRcdFx0aW52YWxpZFR5cGVGb3VuZCA9IGludmFsaWRUeXBlRm91bmQgfHwgX2RhdGEuY29uc3RydWN0b3IgIT09IFVpbnQzMkFycmF5O1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgSU5UOlxuXHRcdFx0XHRpbnZhbGlkVHlwZUZvdW5kID0gaW52YWxpZFR5cGVGb3VuZCB8fCBfZGF0YS5jb25zdHJ1Y3RvciAhPT0gSW50MzJBcnJheTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEVycm9yIGluaXRpbmcgRGF0YUxheWVyIFwiJHtuYW1lfVwiLiAgVW5zdXBwb3J0ZWQgdHlwZSBcIiR7dHlwZX1cIiBmb3IgV2ViR0xDb21wdXRlLmluaXREYXRhTGF5ZXIuYCk7XG5cdFx0fVxuXHRcdGlmIChpbnZhbGlkVHlwZUZvdW5kKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgVHlwZWRBcnJheSBvZiB0eXBlICR7KF9kYXRhLmNvbnN0cnVjdG9yIGFzIGFueSkubmFtZX0gc3VwcGxpZWQgdG8gRGF0YUxheWVyIFwiJHtuYW1lfVwiIG9mIHR5cGUgXCIke3R5cGV9XCIuYCk7XG5cdFx0fVxuXG5cdFx0bGV0IGRhdGEgPSBfZGF0YTtcblx0XHRjb25zdCBpbWFnZVNpemUgPSB3aWR0aCAqIGhlaWdodCAqIGdsTnVtQ2hhbm5lbHM7XG5cdFx0Ly8gVGhlbiBjaGVjayBpZiBhcnJheSBuZWVkcyB0byBiZSBsZW5ndGhlbmVkLlxuXHRcdC8vIFRoaXMgY291bGQgYmUgYmVjYXVzZSBnbE51bUNoYW5uZWxzICE9PSBudW1Db21wb25lbnRzLlxuXHRcdC8vIE9yIGJlY2F1c2UgbGVuZ3RoICE9PSB3aWR0aCAqIGhlaWdodC5cblx0XHRjb25zdCBpbmNvcnJlY3RTaXplID0gZGF0YS5sZW5ndGggIT09IGltYWdlU2l6ZTtcblx0XHQvLyBXZSBoYXZlIHRvIGhhbmRsZSB0aGUgY2FzZSBvZiBGbG9hdDE2IHNwZWNpYWxseSBieSBjb252ZXJ0aW5nIGRhdGEgdG8gVWludDE2QXJyYXkuXG5cdFx0Y29uc3QgaGFuZGxlRmxvYXQxNiA9IGludGVybmFsVHlwZSA9PT0gSEFMRl9GTE9BVDtcblx0XHQvLyBGb3Igd2ViZ2wxLjAgd2UgbWF5IG5lZWQgdG8gY2FzdCBhbiBpbnQgdHlwZSB0byBhIEZMT0FUIG9yIEhBTEZfRkxPQVQuXG5cdFx0Y29uc3Qgc2hvdWxkVHlwZUNhc3QgPSB0eXBlICE9PSBpbnRlcm5hbFR5cGU7XG5cblx0XHRpZiAoc2hvdWxkVHlwZUNhc3QgfHwgaW5jb3JyZWN0U2l6ZSB8fCBoYW5kbGVGbG9hdDE2KSB7XG5cdFx0XHRzd2l0Y2ggKGludGVybmFsVHlwZSkge1xuXHRcdFx0XHRjYXNlIEhBTEZfRkxPQVQ6XG5cdFx0XHRcdFx0ZGF0YSA9IG5ldyBVaW50MTZBcnJheShpbWFnZVNpemUpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIEZMT0FUOlxuXHRcdFx0XHRcdGRhdGEgPSBuZXcgRmxvYXQzMkFycmF5KGltYWdlU2l6ZSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgVU5TSUdORURfQllURTpcblx0XHRcdFx0XHRkYXRhID0gbmV3IFVpbnQ4QXJyYXkoaW1hZ2VTaXplKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBCWVRFOlxuXHRcdFx0XHRcdGRhdGEgPSBuZXcgSW50OEFycmF5KGltYWdlU2l6ZSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgVU5TSUdORURfU0hPUlQ6XG5cdFx0XHRcdFx0ZGF0YSA9IG5ldyBVaW50MTZBcnJheShpbWFnZVNpemUpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFNIT1JUOlxuXHRcdFx0XHRcdGRhdGEgPSBuZXcgSW50MTZBcnJheShpbWFnZVNpemUpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFVOU0lHTkVEX0lOVDpcblx0XHRcdFx0XHRkYXRhID0gbmV3IFVpbnQzMkFycmF5KGltYWdlU2l6ZSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgSU5UOlxuXHRcdFx0XHRcdGRhdGEgPSBuZXcgSW50MzJBcnJheShpbWFnZVNpemUpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEVycm9yIGluaXRpbmcgJHtuYW1lfS4gIFVuc3VwcG9ydGVkIGludGVybmFsVHlwZSAke2ludGVybmFsVHlwZX0gZm9yIFdlYkdMQ29tcHV0ZS5pbml0RGF0YUxheWVyLmApO1xuXHRcdFx0fVxuXHRcdFx0Ly8gRmlsbCBuZXcgZGF0YSBhcnJheSB3aXRoIG9sZCBkYXRhLlxuXHRcdFx0Y29uc3QgdmlldyA9IGhhbmRsZUZsb2F0MTYgPyBuZXcgRGF0YVZpZXcoZGF0YS5idWZmZXIpIDogbnVsbDtcblx0XHRcdGZvciAobGV0IGkgPSAwLCBfbGVuID0gX2RhdGEubGVuZ3RoIC8gbnVtQ29tcG9uZW50czsgaSA8IF9sZW47IGkrKykge1xuXHRcdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IG51bUNvbXBvbmVudHM7IGorKykge1xuXHRcdFx0XHRcdGNvbnN0IHZhbHVlID0gX2RhdGFbaSAqIG51bUNvbXBvbmVudHMgKyBqXTtcblx0XHRcdFx0XHRjb25zdCBpbmRleCA9IGkgKiBnbE51bUNoYW5uZWxzICsgajtcblx0XHRcdFx0XHRpZiAoaGFuZGxlRmxvYXQxNikge1xuXHRcdFx0XHRcdFx0c2V0RmxvYXQxNih2aWV3ISwgMiAqIGluZGV4LCB2YWx1ZSwgdHJ1ZSk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGRhdGFbaW5kZXhdID0gdmFsdWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGRhdGE7XG5cdH1cblxuXHRwcml2YXRlIGluaXRCdWZmZXJzKFxuXHRcdF9kYXRhPzogRGF0YUxheWVyQXJyYXlUeXBlLFxuXHQpIHtcblx0XHRjb25zdCB7XG5cdFx0XHRuYW1lLFxuXHRcdFx0bnVtQnVmZmVycyxcblx0XHRcdGdsLFxuXHRcdFx0d2lkdGgsXG5cdFx0XHRoZWlnaHQsXG5cdFx0XHRnbEludGVybmFsRm9ybWF0LFxuXHRcdFx0Z2xGb3JtYXQsXG5cdFx0XHRnbFR5cGUsXG5cdFx0XHRnbEZpbHRlcixcblx0XHRcdGdsV3JhcFMsXG5cdFx0XHRnbFdyYXBULFxuXHRcdFx0d3JpdGFibGUsXG5cdFx0XHRlcnJvckNhbGxiYWNrLFxuXHRcdH0gPSB0aGlzO1xuXG5cdFx0Y29uc3QgZGF0YSA9IHRoaXMudmFsaWRhdGVEYXRhQXJyYXkoX2RhdGEpO1xuXG5cdFx0Ly8gSW5pdCBhIHRleHR1cmUgZm9yIGVhY2ggYnVmZmVyLlxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbnVtQnVmZmVyczsgaSsrKSB7XG5cdFx0XHRjb25zdCB0ZXh0dXJlID0gZ2wuY3JlYXRlVGV4dHVyZSgpO1xuXHRcdFx0aWYgKCF0ZXh0dXJlKSB7XG5cdFx0XHRcdGVycm9yQ2FsbGJhY2soYENvdWxkIG5vdCBpbml0IHRleHR1cmUgZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIjogJHtnbC5nZXRFcnJvcigpfS5gKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgdGV4dHVyZSk7XG5cblx0XHRcdC8vIFRPRE86IGFyZSB0aGVyZSBvdGhlciBwYXJhbXMgdG8gbG9vayBpbnRvOlxuXHRcdFx0Ly8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1dlYkdMUmVuZGVyaW5nQ29udGV4dC90ZXhQYXJhbWV0ZXJcblx0XHRcdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1MsIGdsV3JhcFMpO1xuXHRcdFx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfVCwgZ2xXcmFwVCk7XG5cdFx0XHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgZ2xGaWx0ZXIpO1xuXHRcdFx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01BR19GSUxURVIsIGdsRmlsdGVyKTtcblxuXHRcdFx0Z2wudGV4SW1hZ2UyRChnbC5URVhUVVJFXzJELCAwLCBnbEludGVybmFsRm9ybWF0LCB3aWR0aCwgaGVpZ2h0LCAwLCBnbEZvcm1hdCwgZ2xUeXBlLCBkYXRhID8gZGF0YSA6IG51bGwpO1xuXHRcdFx0XG5cdFx0XHRjb25zdCBidWZmZXI6IERhdGFMYXllckJ1ZmZlciA9IHtcblx0XHRcdFx0dGV4dHVyZSxcblx0XHRcdH07XG5cblx0XHRcdGlmICh3cml0YWJsZSkge1xuXHRcdFx0XHQvLyBJbml0IGEgZnJhbWVidWZmZXIgZm9yIHRoaXMgdGV4dHVyZSBzbyB3ZSBjYW4gd3JpdGUgdG8gaXQuXG5cdFx0XHRcdGNvbnN0IGZyYW1lYnVmZmVyID0gZ2wuY3JlYXRlRnJhbWVidWZmZXIoKTtcblx0XHRcdFx0aWYgKCFmcmFtZWJ1ZmZlcikge1xuXHRcdFx0XHRcdGVycm9yQ2FsbGJhY2soYENvdWxkIG5vdCBpbml0IGZyYW1lYnVmZmVyIGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCI6ICR7Z2wuZ2V0RXJyb3IoKX0uYCk7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGdsLmJpbmRGcmFtZWJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgZnJhbWVidWZmZXIpO1xuXHRcdFx0XHQvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvV2ViR0xSZW5kZXJpbmdDb250ZXh0L2ZyYW1lYnVmZmVyVGV4dHVyZTJEXG5cdFx0XHRcdGdsLmZyYW1lYnVmZmVyVGV4dHVyZTJEKGdsLkZSQU1FQlVGRkVSLCBnbC5DT0xPUl9BVFRBQ0hNRU5UMCwgZ2wuVEVYVFVSRV8yRCwgdGV4dHVyZSwgMCk7XG5cblx0XHRcdFx0Y29uc3Qgc3RhdHVzID0gZ2wuY2hlY2tGcmFtZWJ1ZmZlclN0YXR1cyhnbC5GUkFNRUJVRkZFUik7XG5cdFx0XHRcdGlmKHN0YXR1cyAhPSBnbC5GUkFNRUJVRkZFUl9DT01QTEVURSl7XG5cdFx0XHRcdFx0ZXJyb3JDYWxsYmFjayhgSW52YWxpZCBzdGF0dXMgZm9yIGZyYW1lYnVmZmVyIGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCI6ICR7c3RhdHVzfS5gKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIEFkZCBmcmFtZWJ1ZmZlci5cblx0XHRcdFx0YnVmZmVyLmZyYW1lYnVmZmVyID0gZnJhbWVidWZmZXI7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdC8vIFNhdmUgdGhpcyBidWZmZXIgdG8gdGhlIGxpc3QuXG5cdFx0XHR0aGlzLmJ1ZmZlcnMucHVzaChidWZmZXIpO1xuXHRcdH1cblx0XHQvLyBVbmJpbmQuXG5cdFx0Z2wuYmluZEZyYW1lYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBudWxsKTtcblx0fVxuXG5cdGdldEN1cnJlbnRTdGF0ZVRleHR1cmUoKSB7XG5cdFx0aWYgKHRoaXMudGV4dHVyZU92ZXJyaWRlcyAmJiB0aGlzLnRleHR1cmVPdmVycmlkZXNbdGhpcy5fYnVmZmVySW5kZXhdKSByZXR1cm4gdGhpcy50ZXh0dXJlT3ZlcnJpZGVzW3RoaXMuX2J1ZmZlckluZGV4XSE7XG5cdFx0cmV0dXJuIHRoaXMuYnVmZmVyc1t0aGlzLl9idWZmZXJJbmRleF0udGV4dHVyZTtcblx0fVxuXG5cdGdldFByZXZpb3VzU3RhdGVUZXh0dXJlKGluZGV4ID0gLTEpIHtcblx0XHRpZiAodGhpcy5udW1CdWZmZXJzID09PSAxKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBjYWxsIGdldFByZXZpb3VzU3RhdGVUZXh0dXJlIG9uIERhdGFMYXllciBcIiR7dGhpcy5uYW1lfVwiIHdpdGggb25seSBvbmUgYnVmZmVyLmApO1xuXHRcdH1cblx0XHRjb25zdCBwcmV2aW91c0luZGV4ID0gdGhpcy5fYnVmZmVySW5kZXggKyBpbmRleCArIHRoaXMubnVtQnVmZmVycztcblx0XHRpZiAocHJldmlvdXNJbmRleCA8IDAgfHwgcHJldmlvdXNJbmRleCA+PSB0aGlzLm51bUJ1ZmZlcnMpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBpbmRleCAke2luZGV4fSBwYXNzZWQgdG8gZ2V0UHJldmlvdXNTdGF0ZVRleHR1cmUgb24gRGF0YUxheWVyICR7dGhpcy5uYW1lfSB3aXRoICR7dGhpcy5udW1CdWZmZXJzfSBidWZmZXJzLmApO1xuXHRcdH1cblx0XHRpZiAodGhpcy50ZXh0dXJlT3ZlcnJpZGVzICYmIHRoaXMudGV4dHVyZU92ZXJyaWRlc1twcmV2aW91c0luZGV4XSkgcmV0dXJuIHRoaXMudGV4dHVyZU92ZXJyaWRlc1twcmV2aW91c0luZGV4XSE7XG5cdFx0cmV0dXJuIHRoaXMuYnVmZmVyc1twcmV2aW91c0luZGV4XS50ZXh0dXJlO1xuXHR9XG5cblx0X3VzaW5nVGV4dHVyZU92ZXJyaWRlRm9yQ3VycmVudEJ1ZmZlcigpIHtcblx0XHRyZXR1cm4gdGhpcy50ZXh0dXJlT3ZlcnJpZGVzICYmIHRoaXMudGV4dHVyZU92ZXJyaWRlc1t0aGlzLmJ1ZmZlckluZGV4XTtcblx0fVxuXG5cdF9iaW5kT3V0cHV0QnVmZmVyRm9yV3JpdGUoXG5cdFx0aW5jcmVtZW50QnVmZmVySW5kZXg6IGJvb2xlYW4sXG5cdCkge1xuXHRcdGNvbnN0IHsgZ2wgfSA9IHRoaXM7XG5cdFx0aWYgKGluY3JlbWVudEJ1ZmZlckluZGV4KSB7XG5cdFx0XHQvLyBJbmNyZW1lbnQgYnVmZmVySW5kZXguXG5cdFx0XHR0aGlzLl9idWZmZXJJbmRleCA9ICh0aGlzLl9idWZmZXJJbmRleCArIDEpICUgdGhpcy5udW1CdWZmZXJzO1xuXHRcdH1cblx0XHR0aGlzLl9iaW5kT3V0cHV0QnVmZmVyKCk7XG5cblx0XHQvLyBXZSBhcmUgZ29pbmcgdG8gZG8gYSBkYXRhIHdyaXRlLCBpZiB3ZSBoYXZlIG92ZXJyaWRlcyBlbmFibGVkLCB3ZSBjYW4gcmVtb3ZlIHRoZW0uXG5cdFx0aWYgKHRoaXMudGV4dHVyZU92ZXJyaWRlcykge1xuXHRcdFx0dGhpcy50ZXh0dXJlT3ZlcnJpZGVzW3RoaXMuX2J1ZmZlckluZGV4XSA9IHVuZGVmaW5lZDtcblx0XHR9XG5cdH1cblxuXHRfYmluZE91dHB1dEJ1ZmZlcigpIHtcblx0XHRjb25zdCB7IGdsIH0gPSB0aGlzO1xuXHRcdGNvbnN0IHsgZnJhbWVidWZmZXIgfSA9IHRoaXMuYnVmZmVyc1t0aGlzLl9idWZmZXJJbmRleF07XG5cdFx0aWYgKCFmcmFtZWJ1ZmZlcikge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBEYXRhTGF5ZXIgXCIke3RoaXMubmFtZX1cIiBpcyBub3Qgd3JpdGFibGUuYCk7XG5cdFx0fVxuXHRcdGdsLmJpbmRGcmFtZWJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgZnJhbWVidWZmZXIpO1xuXHR9XG5cblx0c2V0RGF0YShkYXRhOiBEYXRhTGF5ZXJBcnJheVR5cGUpIHtcblx0XHQvLyBUT0RPOiBSYXRoZXIgdGhhbiBkZXN0cm95aW5nIGJ1ZmZlcnMsIHdlIGNvdWxkIHdyaXRlIHRvIGNlcnRhaW4gd2luZG93LlxuXHRcdHRoaXMuZGVzdHJveUJ1ZmZlcnMoKTtcblx0XHR0aGlzLmluaXRCdWZmZXJzKGRhdGEpO1xuXHR9XG5cblx0cmVzaXplKFxuXHRcdGRpbWVuc2lvbnM6IG51bWJlciB8IFtudW1iZXIsIG51bWJlcl0sXG5cdFx0ZGF0YT86IERhdGFMYXllckFycmF5VHlwZSxcblx0KSB7XG5cdFx0Y29uc3QgeyBsZW5ndGgsIHdpZHRoLCBoZWlnaHQgfSA9IERhdGFMYXllci5jYWxjU2l6ZShkaW1lbnNpb25zLCB0aGlzLm5hbWUpO1xuXHRcdHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xuXHRcdHRoaXMud2lkdGggPSB3aWR0aDtcblx0XHR0aGlzLmhlaWdodCA9IGhlaWdodDtcblx0XHR0aGlzLmRlc3Ryb3lCdWZmZXJzKCk7XG5cdFx0dGhpcy5pbml0QnVmZmVycyhkYXRhKTtcblx0fVxuXG5cdGNsZWFyKCkge1xuXHRcdC8vIFJlc2V0IGV2ZXJ5dGhpbmcgdG8gemVyby5cblx0XHQvLyBUT0RPOiBUaGlzIGlzIG5vdCB0aGUgbW9zdCBlZmZpY2llbnQgd2F5IHRvIGRvIHRoaXMgKHJlYWxsb2NhdGluZyBhbGwgdGV4dHVyZXMgYW5kIGZyYW1lYnVmZmVycyksIGJ1dCBvayBmb3Igbm93LlxuXHRcdHRoaXMuZGVzdHJveUJ1ZmZlcnMoKTtcblx0XHR0aGlzLmluaXRCdWZmZXJzKCk7XG5cdH1cblxuXHRnZXREaW1lbnNpb25zKCkge1xuXHRcdHJldHVybiBbXG5cdFx0XHR0aGlzLndpZHRoLFxuXHRcdFx0dGhpcy5oZWlnaHQsXG5cdFx0XSBhcyBbbnVtYmVyLCBudW1iZXJdO1xuXHR9XG5cblx0Z2V0TGVuZ3RoKCkge1xuXHRcdGlmICghdGhpcy5sZW5ndGgpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGNhbGwgZ2V0TGVuZ3RoKCkgb24gMkQgRGF0YUxheWVyIFwiJHt0aGlzLm5hbWV9XCIuYCk7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLmxlbmd0aDtcblx0fVxuXG5cdHByaXZhdGUgZGVzdHJveUJ1ZmZlcnMoKSB7XG5cdFx0Y29uc3QgeyBnbCwgYnVmZmVycyB9ID0gdGhpcztcblx0XHRidWZmZXJzLmZvckVhY2goYnVmZmVyID0+IHtcblx0XHRcdGNvbnN0IHsgZnJhbWVidWZmZXIsIHRleHR1cmUgfSA9IGJ1ZmZlcjtcblx0XHRcdGdsLmRlbGV0ZVRleHR1cmUodGV4dHVyZSk7XG5cdFx0XHRpZiAoZnJhbWVidWZmZXIpIHtcblx0XHRcdFx0Z2wuZGVsZXRlRnJhbWVidWZmZXIoZnJhbWVidWZmZXIpO1xuXHRcdFx0fVxuXHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0ZGVsZXRlIGJ1ZmZlci50ZXh0dXJlO1xuXHRcdFx0ZGVsZXRlIGJ1ZmZlci5mcmFtZWJ1ZmZlcjtcblx0XHR9KTtcblx0XHRidWZmZXJzLmxlbmd0aCA9IDA7XG5cblx0XHQvLyBUaGVzZSBhcmUgdGVjaG5pY2FsbHkgb3duZWQgYnkgYW5vdGhlciBEYXRhTGF5ZXIsXG5cdFx0Ly8gc28gd2UgYXJlIG5vdCByZXNwb25zaWJsZSBmb3IgZGVsZXRpbmcgdGhlbSBmcm9tIGdsIGNvbnRleHQuXG5cdFx0ZGVsZXRlIHRoaXMudGV4dHVyZU92ZXJyaWRlcztcblx0fVxuXG5cdGRlc3Ryb3koKSB7XG5cdFx0dGhpcy5kZXN0cm95QnVmZmVycygpO1xuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHRkZWxldGUgdGhpcy5nbDtcblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0ZGVsZXRlIHRoaXMuZXJyb3JDYWxsYmFjaztcblx0fVxufVxuIiwiaW1wb3J0IHsgaXNBcnJheSwgaXNJbnRlZ2VyLCBpc051bWJlciwgaXNTdHJpbmcgfSBmcm9tICcuL0NoZWNrcyc7XG5pbXBvcnQge1xuXHRGTE9BVCxcblx0RkxPQVRfMURfVU5JRk9STSwgRkxPQVRfMkRfVU5JRk9STSwgRkxPQVRfM0RfVU5JRk9STSwgRkxPQVRfNERfVU5JRk9STSxcblx0R0xTTDMsXG5cdEdMU0xWZXJzaW9uLFxuXHRJTlQsXG5cdElOVF8xRF9VTklGT1JNLCBJTlRfMkRfVU5JRk9STSwgSU5UXzNEX1VOSUZPUk0sIElOVF80RF9VTklGT1JNLFxuXHRVbmlmb3JtLCBVbmlmb3JtRGF0YVR5cGUsIFVuaWZvcm1UeXBlLCBVbmlmb3JtVmFsdWVUeXBlLFxufSBmcm9tICcuL0NvbnN0YW50cyc7XG5pbXBvcnQgeyBjb21waWxlU2hhZGVyIH0gZnJvbSAnLi91dGlscyc7XG5cbmNvbnN0IERFRkFVTFRfUFJPR1JBTV9OQU1FID0gJ0RFRkFVTFQnO1xuY29uc3QgREVGQVVMVF9XX1VWX1BST0dSQU1fTkFNRSA9ICdERUZBVUxUX1dfVVYnO1xuY29uc3QgREVGQVVMVF9XX05PUk1BTF9QUk9HUkFNX05BTUUgPSAnREVGQVVMVF9XX05PUk1BTCc7XG5jb25zdCBERUZBVUxUX1dfVVZfTk9STUFMX1BST0dSQU1fTkFNRSA9ICdERUZBVUxUX1dfVVZfTk9STUFMJztcbmNvbnN0IFNFR01FTlRfUFJPR1JBTV9OQU1FID0gJ1NFR01FTlQnO1xuY29uc3QgREFUQV9MQVlFUl9QT0lOVFNfUFJPR1JBTV9OQU1FID0gJ0RBVEFfTEFZRVJfUE9JTlRTJztcbmNvbnN0IERBVEFfTEFZRVJfTElORVNfUFJPR1JBTV9OQU1FID0gJ0RBVEFfTEFZRVJfTElORVMnO1xuY29uc3QgREFUQV9MQVlFUl9WRUNUT1JfRklFTERfUFJPR1JBTV9OQU1FID0gJ0RBVEFfTEFZRVJfVkVDVE9SX0ZJRUxEJztcbnR5cGUgUFJPR1JBTV9OQU1FUyA9XG5cdHR5cGVvZiBERUZBVUxUX1BST0dSQU1fTkFNRSB8XG5cdHR5cGVvZiBERUZBVUxUX1dfVVZfUFJPR1JBTV9OQU1FIHxcblx0dHlwZW9mIERFRkFVTFRfV19OT1JNQUxfUFJPR1JBTV9OQU1FIHxcblx0dHlwZW9mIERFRkFVTFRfV19VVl9OT1JNQUxfUFJPR1JBTV9OQU1FIHxcblx0dHlwZW9mIFNFR01FTlRfUFJPR1JBTV9OQU1FIHxcblx0dHlwZW9mIERBVEFfTEFZRVJfUE9JTlRTX1BST0dSQU1fTkFNRSB8XG5cdHR5cGVvZiBEQVRBX0xBWUVSX0xJTkVTX1BST0dSQU1fTkFNRSB8XG5cdHR5cGVvZiBEQVRBX0xBWUVSX1ZFQ1RPUl9GSUVMRF9QUk9HUkFNX05BTUU7XG5cbmNvbnN0IHZlcnRleFNoYWRlcnM6IHtba2V5IGluIFBST0dSQU1fTkFNRVNdOiB7XG5cdHNyY18xOiBzdHJpbmcsXG5cdHNyY18zOiBzdHJpbmcsXG5cdHNoYWRlcj86IFdlYkdMUHJvZ3JhbSxcblx0ZGVmaW5lcz86IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9LFxufX0gPSB7XG5cdFtERUZBVUxUX1BST0dSQU1fTkFNRV06IHtcblx0XHRzcmNfMTogcmVxdWlyZSgnLi9nbHNsXzEvRGVmYXVsdFZlcnRleFNoYWRlci5nbHNsJyksXG5cdFx0c3JjXzM6ICcnLFxuXHR9LFxuXHRbREVGQVVMVF9XX1VWX1BST0dSQU1fTkFNRV06IHtcblx0XHRzcmNfMTogcmVxdWlyZSgnLi9nbHNsXzEvRGVmYXVsdFZlcnRleFNoYWRlci5nbHNsJyksXG5cdFx0c3JjXzM6ICcnLFxuXHRcdGRlZmluZXM6IHtcblx0XHRcdCdVVl9BVFRSSUJVVEUnOiAnMScsXG5cdFx0fSxcblx0fSxcblx0W0RFRkFVTFRfV19OT1JNQUxfUFJPR1JBTV9OQU1FXToge1xuXHRcdHNyY18xOiByZXF1aXJlKCcuL2dsc2xfMS9EZWZhdWx0VmVydGV4U2hhZGVyLmdsc2wnKSxcblx0XHRzcmNfMzogJycsXG5cdFx0ZGVmaW5lczoge1xuXHRcdFx0J05PUk1BTF9BVFRSSUJVVEUnOiAnMScsXG5cdFx0fSxcblx0fSxcblx0W0RFRkFVTFRfV19VVl9OT1JNQUxfUFJPR1JBTV9OQU1FXToge1xuXHRcdHNyY18xOiByZXF1aXJlKCcuL2dsc2xfMS9EZWZhdWx0VmVydGV4U2hhZGVyLmdsc2wnKSxcblx0XHRzcmNfMzogJycsXG5cdFx0ZGVmaW5lczoge1xuXHRcdFx0J1VWX0FUVFJJQlVURSc6ICcxJyxcblx0XHRcdCdOT1JNQUxfQVRUUklCVVRFJzogJzEnLFxuXHRcdH0sXG5cdH0sXG5cdFtTRUdNRU5UX1BST0dSQU1fTkFNRV06IHtcblx0XHRzcmNfMTogcmVxdWlyZSgnLi9nbHNsXzEvU2VnbWVudFZlcnRleFNoYWRlci5nbHNsJyksXG5cdFx0c3JjXzM6ICcnLFxuXHR9LFxuXHRbREFUQV9MQVlFUl9QT0lOVFNfUFJPR1JBTV9OQU1FXToge1xuXHRcdHNyY18xOiByZXF1aXJlKCcuL2dsc2xfMS9EYXRhTGF5ZXJQb2ludHNWZXJ0ZXhTaGFkZXIuZ2xzbCcpLFxuXHRcdHNyY18zOiAnJyxcblx0fSxcblx0W0RBVEFfTEFZRVJfVkVDVE9SX0ZJRUxEX1BST0dSQU1fTkFNRV06IHtcblx0XHRzcmNfMTogcmVxdWlyZSgnLi9nbHNsXzEvRGF0YUxheWVyVmVjdG9yRmllbGRWZXJ0ZXhTaGFkZXIuZ2xzbCcpLFxuXHRcdHNyY18zOiAnJyxcblx0fSxcblx0W0RBVEFfTEFZRVJfTElORVNfUFJPR1JBTV9OQU1FXToge1xuXHRcdHNyY18xOiByZXF1aXJlKCcuL2dsc2xfMS9EYXRhTGF5ZXJMaW5lc1ZlcnRleFNoYWRlci5nbHNsJyksXG5cdFx0c3JjXzM6ICcnLFxuXHR9LFxufTtcblxuZXhwb3J0IGNsYXNzIEdQVVByb2dyYW0ge1xuXHRyZWFkb25seSBuYW1lOiBzdHJpbmc7XG5cdHByaXZhdGUgcmVhZG9ubHkgZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCB8IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQ7XG5cdHByaXZhdGUgcmVhZG9ubHkgZXJyb3JDYWxsYmFjazogKG1lc3NhZ2U6IHN0cmluZykgPT4gdm9pZDtcblx0cHJpdmF0ZSByZWFkb25seSBnbHNsVmVyc2lvbjogR0xTTFZlcnNpb247XG5cdHByaXZhdGUgcmVhZG9ubHkgdW5pZm9ybXM6IHsgWyBrZXk6IHN0cmluZ106IFVuaWZvcm0gfSA9IHt9O1xuXHRwcml2YXRlIHJlYWRvbmx5IGZyYWdtZW50U2hhZGVyITogV2ViR0xTaGFkZXI7XG5cdC8vIFN0b3JlIGdsIHByb2dyYW1zLlxuXHRwcml2YXRlIHByb2dyYW1zOiB7W2tleSBpbiBQUk9HUkFNX05BTUVTXT86IFdlYkdMUHJvZ3JhbSB9ID0ge307XG5cblx0Y29uc3RydWN0b3IoXG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0IHwgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCxcblx0XHRcdG5hbWU6IHN0cmluZyxcblx0XHRcdGZyYWdtZW50U2hhZGVyOiBzdHJpbmcgfCBzdHJpbmdbXSB8IFdlYkdMU2hhZGVyLC8vIFdlIG1heSB3YW50IHRvIHBhc3MgaW4gYW4gYXJyYXkgb2Ygc2hhZGVyIHN0cmluZyBzb3VyY2VzLCBpZiBzcGxpdCBhY3Jvc3Mgc2V2ZXJhbCBmaWxlcy5cblx0XHRcdGVycm9yQ2FsbGJhY2s6IChtZXNzYWdlOiBzdHJpbmcpID0+IHZvaWQsXG5cdFx0XHRnbHNsVmVyc2lvbjogR0xTTFZlcnNpb24sXG5cdFx0XHR1bmlmb3Jtcz86IHtcblx0XHRcdFx0bmFtZTogc3RyaW5nLFxuXHRcdFx0XHR2YWx1ZTogVW5pZm9ybVZhbHVlVHlwZSxcblx0XHRcdFx0ZGF0YVR5cGU6IFVuaWZvcm1EYXRhVHlwZSxcblx0XHRcdH1bXSxcblx0XHRcdGRlZmluZXM/OiB7Ly8gV2UnbGwgYWxsb3cgc29tZSB2YXJpYWJsZXMgdG8gYmUgcGFzc2VkIGluIGFzICNkZWZpbmUgdG8gdGhlIHByZXByb2Nlc3NvciBmb3IgdGhlIGZyYWdtZW50IHNoYWRlci5cblx0XHRcdFx0W2tleTogc3RyaW5nXTogc3RyaW5nLCAvLyBXZSdsbCBkbyB0aGVzZSBhcyBzdHJpbmdzIHRvIG1ha2UgaXQgZWFzaWVyIHRvIGNvbnRyb2wgZmxvYXQgdnMgaW50LlxuXHRcdFx0fSxcblx0XHR9LFxuXHRcdFxuXHQpIHtcblx0XHRjb25zdCB7IGdsLCBlcnJvckNhbGxiYWNrLCBuYW1lLCBmcmFnbWVudFNoYWRlciwgZ2xzbFZlcnNpb24sIHVuaWZvcm1zLCBkZWZpbmVzIH0gPSBwYXJhbXM7XG5cblx0XHQvLyBTYXZlIGFyZ3VtZW50cy5cblx0XHR0aGlzLmdsID0gZ2w7XG5cdFx0dGhpcy5lcnJvckNhbGxiYWNrID0gZXJyb3JDYWxsYmFjaztcblx0XHR0aGlzLm5hbWUgPSBuYW1lO1xuXHRcdHRoaXMuZ2xzbFZlcnNpb24gPSBnbHNsVmVyc2lvbjtcblxuXHRcdC8vIENvbXBpbGUgZnJhZ21lbnQgc2hhZGVyLlxuXHRcdGlmICh0eXBlb2YoZnJhZ21lbnRTaGFkZXIpID09PSAnc3RyaW5nJyB8fCB0eXBlb2YoKGZyYWdtZW50U2hhZGVyIGFzIHN0cmluZ1tdKVswXSkgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRsZXQgc291cmNlU3RyaW5nID0gdHlwZW9mKGZyYWdtZW50U2hhZGVyKSA9PT0gJ3N0cmluZycgP1xuXHRcdFx0XHRmcmFnbWVudFNoYWRlciA6XG5cdFx0XHRcdChmcmFnbWVudFNoYWRlciBhcyBzdHJpbmdbXSkuam9pbignXFxuJyk7XG5cdFx0XHRpZiAoZGVmaW5lcykge1xuXHRcdFx0XHRzb3VyY2VTdHJpbmcgPSBHUFVQcm9ncmFtLmNvbnZlcnREZWZpbmVzVG9TdHJpbmcoZGVmaW5lcykgKyBzb3VyY2VTdHJpbmc7XG5cdFx0XHR9XG5cdFx0XHRjb25zdCBzaGFkZXIgPSBjb21waWxlU2hhZGVyKGdsLCBlcnJvckNhbGxiYWNrLCBzb3VyY2VTdHJpbmcsIGdsLkZSQUdNRU5UX1NIQURFUiwgbmFtZSk7XG5cdFx0XHRpZiAoIXNoYWRlcikge1xuXHRcdFx0XHRlcnJvckNhbGxiYWNrKGBVbmFibGUgdG8gY29tcGlsZSBmcmFnbWVudCBzaGFkZXIgZm9yIHByb2dyYW0gXCIke25hbWV9XCIuYCk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdHRoaXMuZnJhZ21lbnRTaGFkZXIgPSBzaGFkZXI7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmIChkZWZpbmVzKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIGF0dGFjaCBkZWZpbmVzIHRvIHByb2dyYW0gXCIke25hbWV9XCIgYmVjYXVzZSBmcmFnbWVudCBzaGFkZXIgaXMgYWxyZWFkeSBjb21waWxlZC5gKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAodW5pZm9ybXMpIHtcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdW5pZm9ybXM/Lmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGNvbnN0IHsgbmFtZSwgdmFsdWUsIGRhdGFUeXBlIH0gPSB1bmlmb3Jtc1tpXTtcblx0XHRcdFx0dGhpcy5zZXRVbmlmb3JtKG5hbWUsIHZhbHVlLCBkYXRhVHlwZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBzdGF0aWMgY29udmVydERlZmluZXNUb1N0cmluZyhkZWZpbmVzOiB7W2tleTogc3RyaW5nXTogc3RyaW5nfSkge1xuXHRcdGxldCBkZWZpbmVzU291cmNlID0gJyc7XG5cdFx0Y29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGRlZmluZXMpO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0Y29uc3Qga2V5ID0ga2V5c1tpXTtcblx0XHRcdC8vIENoZWNrIHRoYXQgZGVmaW5lIGlzIHBhc3NlZCBpbiBhcyBhIHN0cmluZy5cblx0XHRcdGlmICghaXNTdHJpbmcoa2V5KSB8fCAhaXNTdHJpbmcoZGVmaW5lc1trZXldKSkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEdQVVByb2dyYW0gZGVmaW5lcyBtdXN0IGJlIHBhc3NlZCBpbiBhcyBrZXkgdmFsdWUgcGFpcnMgdGhhdCBhcmUgYm90aCBzdHJpbmdzLCBnb3Qga2V5IHZhbHVlIHBhaXIgb2YgdHlwZSAke3R5cGVvZiBrZXl9IDogJHt0eXBlb2YgZGVmaW5lc1trZXldfS5gKVxuXHRcdFx0fVxuXHRcdFx0ZGVmaW5lc1NvdXJjZSArPSBgI2RlZmluZSAke2tleX0gJHtkZWZpbmVzW2tleV19XFxuYDtcblx0XHR9XG5cdFx0cmV0dXJuIGRlZmluZXNTb3VyY2U7XG5cdH1cblxuXHRwcml2YXRlIGluaXRQcm9ncmFtKHZlcnRleFNoYWRlcjogV2ViR0xTaGFkZXIsIHByb2dyYW1OYW1lOiBzdHJpbmcpIHtcblx0XHRjb25zdCB7IGdsLCBmcmFnbWVudFNoYWRlciwgZXJyb3JDYWxsYmFjaywgdW5pZm9ybXMgfSA9IHRoaXM7XG5cdFx0Ly8gQ3JlYXRlIGEgcHJvZ3JhbS5cblx0XHRjb25zdCBwcm9ncmFtID0gZ2wuY3JlYXRlUHJvZ3JhbSgpO1xuXHRcdGlmICghcHJvZ3JhbSkge1xuXHRcdFx0ZXJyb3JDYWxsYmFjayhgVW5hYmxlIHRvIGluaXQgZ2wgcHJvZ3JhbTogJHtuYW1lfS5gKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0Ly8gVE9ETzogY2hlY2sgdGhhdCBhdHRhY2hTaGFkZXIgd29ya2VkLlxuXHRcdGdsLmF0dGFjaFNoYWRlcihwcm9ncmFtLCBmcmFnbWVudFNoYWRlcik7XG5cdFx0Z2wuYXR0YWNoU2hhZGVyKHByb2dyYW0sIHZlcnRleFNoYWRlcik7XG5cdFx0Ly8gTGluayB0aGUgcHJvZ3JhbS5cblx0XHRnbC5saW5rUHJvZ3JhbShwcm9ncmFtKTtcblx0XHQvLyBDaGVjayBpZiBpdCBsaW5rZWQuXG5cdFx0Y29uc3Qgc3VjY2VzcyA9IGdsLmdldFByb2dyYW1QYXJhbWV0ZXIocHJvZ3JhbSwgZ2wuTElOS19TVEFUVVMpO1xuXHRcdGlmICghc3VjY2Vzcykge1xuXHRcdFx0Ly8gU29tZXRoaW5nIHdlbnQgd3Jvbmcgd2l0aCB0aGUgbGluay5cblx0XHRcdGVycm9yQ2FsbGJhY2soYFByb2dyYW0gXCIke25hbWV9XCIgZmFpbGVkIHRvIGxpbms6ICR7Z2wuZ2V0UHJvZ3JhbUluZm9Mb2cocHJvZ3JhbSl9YCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdC8vIElmIHdlIGhhdmUgYW55IHVuaWZvcm1zIHNldCBmb3IgdGhpcyBHUFVQcm9ncmFtLCBhZGQgdGhvc2UgdG8gV2ViR0xQcm9ncmFtIHdlIGp1c3QgaW5pdGVkLlxuXHRcdGNvbnN0IHVuaWZvcm1OYW1lcyA9IE9iamVjdC5rZXlzKHVuaWZvcm1zKTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHVuaWZvcm1OYW1lcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0Y29uc3QgdW5pZm9ybU5hbWUgPSB1bmlmb3JtTmFtZXNbaV07XG5cdFx0XHRjb25zdCB1bmlmb3JtID0gdW5pZm9ybXNbdW5pZm9ybU5hbWVdO1xuXHRcdFx0Y29uc3QgeyB2YWx1ZSwgdHlwZSB9ID0gdW5pZm9ybTtcblx0XHRcdHRoaXMuc2V0UHJvZ3JhbVVuaWZvcm0ocHJvZ3JhbSwgcHJvZ3JhbU5hbWUsIHVuaWZvcm1OYW1lLCB2YWx1ZSwgdHlwZSk7XG5cdFx0fVxuXHRcdHJldHVybiBwcm9ncmFtO1xuXHR9XG5cblx0cHJpdmF0ZSBnZXRQcm9ncmFtV2l0aE5hbWUobmFtZTogUFJPR1JBTV9OQU1FUykge1xuXHRcdGlmICh0aGlzLnByb2dyYW1zW25hbWVdKSByZXR1cm4gdGhpcy5wcm9ncmFtc1tuYW1lXTtcblx0XHRjb25zdCB7IGVycm9yQ2FsbGJhY2sgfSA9IHRoaXM7XG5cdFx0Y29uc3QgdmVydGV4U2hhZGVyID0gdmVydGV4U2hhZGVyc1tuYW1lXTtcblx0XHRpZiAodmVydGV4U2hhZGVyLnNoYWRlciA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRjb25zdCB7IGdsLCBuYW1lLCBnbHNsVmVyc2lvbiB9ID0gdGhpcztcblx0XHRcdC8vIEluaXQgYSB2ZXJ0ZXggc2hhZGVyLlxuXHRcdFx0bGV0IHZlcnRleFNoYWRlclNvdXJjZSA9IGdsc2xWZXJzaW9uID09PSBHTFNMMyA/IHZlcnRleFNoYWRlci5zcmNfMyA6IHZlcnRleFNoYWRlci5zcmNfMTtcblx0XHRcdGlmICh2ZXJ0ZXhTaGFkZXJTb3VyY2UgPT09ICcnKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgTm8gc291cmNlIGZvciB2ZXJ0ZXggc2hhZGVyICR7dGhpcy5uYW1lfSA6ICR7bmFtZX1gKVxuXHRcdFx0fVxuXHRcdFx0aWYgKHZlcnRleFNoYWRlci5kZWZpbmVzKSB7XG5cdFx0XHRcdHZlcnRleFNoYWRlclNvdXJjZSA9IEdQVVByb2dyYW0uY29udmVydERlZmluZXNUb1N0cmluZyh2ZXJ0ZXhTaGFkZXIuZGVmaW5lcykgKyB2ZXJ0ZXhTaGFkZXJTb3VyY2U7XG5cdFx0XHR9XG5cdFx0XHRjb25zdCBzaGFkZXIgPSBjb21waWxlU2hhZGVyKGdsLCBlcnJvckNhbGxiYWNrLCB2ZXJ0ZXhTaGFkZXJTb3VyY2UsIGdsLlZFUlRFWF9TSEFERVIsIG5hbWUpO1xuXHRcdFx0aWYgKCFzaGFkZXIpIHtcblx0XHRcdFx0ZXJyb3JDYWxsYmFjayhgVW5hYmxlIHRvIGNvbXBpbGUgZGVmYXVsdCB2ZXJ0ZXggc2hhZGVyIGZvciBwcm9ncmFtIFwiJHtuYW1lfVwiLmApO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHR2ZXJ0ZXhTaGFkZXIuc2hhZGVyID0gc2hhZGVyO1xuXHRcdH1cblx0XHRjb25zdCBwcm9ncmFtID0gdGhpcy5pbml0UHJvZ3JhbSh2ZXJ0ZXhTaGFkZXIuc2hhZGVyLCBERUZBVUxUX1BST0dSQU1fTkFNRSk7XG5cdFx0aWYgKHByb2dyYW0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0ZXJyb3JDYWxsYmFjayhgVW5hYmxlIHRvIGluaXQgcHJvZ3JhbSBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0dGhpcy5wcm9ncmFtc1tuYW1lXSA9IHByb2dyYW07XG5cdFx0cmV0dXJuIHByb2dyYW07XG5cdH1cblxuXHRnZXQgZGVmYXVsdFByb2dyYW0oKSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0UHJvZ3JhbVdpdGhOYW1lKERFRkFVTFRfUFJPR1JBTV9OQU1FKTtcblx0fVxuXG5cdGdldCBkZWZhdWx0UHJvZ3JhbVdpdGhVVigpIHtcblx0XHRyZXR1cm4gdGhpcy5nZXRQcm9ncmFtV2l0aE5hbWUoREVGQVVMVF9XX1VWX1BST0dSQU1fTkFNRSk7XG5cdH1cblxuXHRnZXQgZGVmYXVsdFByb2dyYW1XaXRoTm9ybWFsKCkge1xuXHRcdHJldHVybiB0aGlzLmdldFByb2dyYW1XaXRoTmFtZShERUZBVUxUX1dfTk9STUFMX1BST0dSQU1fTkFNRSk7XG5cdH1cblxuXHRnZXQgZGVmYXVsdFByb2dyYW1XaXRoVVZOb3JtYWwoKSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0UHJvZ3JhbVdpdGhOYW1lKERFRkFVTFRfV19VVl9OT1JNQUxfUFJPR1JBTV9OQU1FKTtcblx0fVxuXG5cdGdldCBzZWdtZW50UHJvZ3JhbSgpIHtcblx0XHRyZXR1cm4gdGhpcy5nZXRQcm9ncmFtV2l0aE5hbWUoU0VHTUVOVF9QUk9HUkFNX05BTUUpO1xuXHR9XG5cblx0Z2V0IGRhdGFMYXllclBvaW50c1Byb2dyYW0oKSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0UHJvZ3JhbVdpdGhOYW1lKERBVEFfTEFZRVJfUE9JTlRTX1BST0dSQU1fTkFNRSk7XG5cdH1cblxuXHRnZXQgZGF0YUxheWVyVmVjdG9yRmllbGRQcm9ncmFtKCkge1xuXHRcdHJldHVybiB0aGlzLmdldFByb2dyYW1XaXRoTmFtZShEQVRBX0xBWUVSX1ZFQ1RPUl9GSUVMRF9QUk9HUkFNX05BTUUpO1xuXHR9XG5cblx0Z2V0IGRhdGFMYXllckxpbmVzUHJvZ3JhbSgpIHtcblx0XHRyZXR1cm4gdGhpcy5nZXRQcm9ncmFtV2l0aE5hbWUoREFUQV9MQVlFUl9MSU5FU19QUk9HUkFNX05BTUUpO1xuXHR9XG5cblx0cHJpdmF0ZSB1bmlmb3JtVHlwZUZvclZhbHVlKFxuXHRcdHZhbHVlOiBudW1iZXIgfCBudW1iZXJbXSxcblx0XHRkYXRhVHlwZTogVW5pZm9ybURhdGFUeXBlLFxuXHQpIHtcblx0XHRpZiAoZGF0YVR5cGUgPT09IEZMT0FUKSB7XG5cdFx0XHQvLyBDaGVjayB0aGF0IHdlIGFyZSBkZWFsaW5nIHdpdGggYSBudW1iZXIuXG5cdFx0XHRpZiAoaXNBcnJheSh2YWx1ZSkpIHtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCAodmFsdWUgYXMgbnVtYmVyW10pLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0aWYgKCFpc051bWJlcigodmFsdWUgYXMgbnVtYmVyW10pW2ldKSkge1xuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHVuaWZvcm0gdmFsdWU6ICR7dmFsdWV9IGZvciBwcm9ncmFtIFwiJHt0aGlzLm5hbWV9XCIsIGV4cGVjdGVkIGZsb2F0IG9yIGZsb2F0W10gb2YgbGVuZ3RoIDEtNC5gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmICghaXNOdW1iZXIodmFsdWUpKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHVuaWZvcm0gdmFsdWU6ICR7dmFsdWV9IGZvciBwcm9ncmFtIFwiJHt0aGlzLm5hbWV9XCIsIGV4cGVjdGVkIGZsb2F0IG9yIGZsb2F0W10gb2YgbGVuZ3RoIDEtNC5gKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKCFpc0FycmF5KHZhbHVlKSB8fCAodmFsdWUgYXMgbnVtYmVyW10pLmxlbmd0aCA9PT0gMSkge1xuXHRcdFx0XHRyZXR1cm4gRkxPQVRfMURfVU5JRk9STTtcblx0XHRcdH1cblx0XHRcdGlmICgodmFsdWUgYXMgbnVtYmVyW10pLmxlbmd0aCA9PT0gMikge1xuXHRcdFx0XHRyZXR1cm4gRkxPQVRfMkRfVU5JRk9STTtcblx0XHRcdH1cblx0XHRcdGlmICgodmFsdWUgYXMgbnVtYmVyW10pLmxlbmd0aCA9PT0gMykge1xuXHRcdFx0XHRyZXR1cm4gRkxPQVRfM0RfVU5JRk9STTtcblx0XHRcdH1cblx0XHRcdGlmICgodmFsdWUgYXMgbnVtYmVyW10pLmxlbmd0aCA9PT0gNCkge1xuXHRcdFx0XHRyZXR1cm4gRkxPQVRfNERfVU5JRk9STTtcblx0XHRcdH1cblx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB1bmlmb3JtIHZhbHVlOiAke3ZhbHVlfSBmb3IgcHJvZ3JhbSBcIiR7dGhpcy5uYW1lfVwiLCBleHBlY3RlZCBmbG9hdCBvciBmbG9hdFtdIG9mIGxlbmd0aCAxLTQuYCk7XG5cdFx0fSBlbHNlIGlmIChkYXRhVHlwZSA9PT0gSU5UKSB7XG5cdFx0XHQvLyBDaGVjayB0aGF0IHdlIGFyZSBkZWFsaW5nIHdpdGggYW4gaW50LlxuXHRcdFx0aWYgKGlzQXJyYXkodmFsdWUpKSB7XG5cdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgKHZhbHVlIGFzIG51bWJlcltdKS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdGlmICghaXNJbnRlZ2VyKCh2YWx1ZSBhcyBudW1iZXJbXSlbaV0pKSB7XG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdW5pZm9ybSB2YWx1ZTogJHt2YWx1ZX0gZm9yIHByb2dyYW0gXCIke3RoaXMubmFtZX1cIiwgZXhwZWN0ZWQgaW50IG9yIGludFtdIG9mIGxlbmd0aCAxLTQuYCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAoIWlzSW50ZWdlcih2YWx1ZSkpIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdW5pZm9ybSB2YWx1ZTogJHt2YWx1ZX0gZm9yIHByb2dyYW0gXCIke3RoaXMubmFtZX1cIiwgZXhwZWN0ZWQgaW50IG9yIGludFtdIG9mIGxlbmd0aCAxLTQuYCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmICghaXNBcnJheSh2YWx1ZSkgfHwgKHZhbHVlIGFzIG51bWJlcltdKS5sZW5ndGggPT09IDEpIHtcblx0XHRcdFx0cmV0dXJuIElOVF8xRF9VTklGT1JNO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCh2YWx1ZSBhcyBudW1iZXJbXSkubGVuZ3RoID09PSAyKSB7XG5cdFx0XHRcdHJldHVybiBJTlRfMkRfVU5JRk9STTtcblx0XHRcdH1cblx0XHRcdGlmICgodmFsdWUgYXMgbnVtYmVyW10pLmxlbmd0aCA9PT0gMykge1xuXHRcdFx0XHRyZXR1cm4gSU5UXzNEX1VOSUZPUk07XG5cdFx0XHR9XG5cdFx0XHRpZiAoKHZhbHVlIGFzIG51bWJlcltdKS5sZW5ndGggPT09IDQpIHtcblx0XHRcdFx0cmV0dXJuIElOVF80RF9VTklGT1JNO1xuXHRcdFx0fVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHVuaWZvcm0gdmFsdWU6ICR7dmFsdWV9IGZvciBwcm9ncmFtIFwiJHt0aGlzLm5hbWV9XCIsIGV4cGVjdGVkIGludCBvciBpbnRbXSBvZiBsZW5ndGggMS00LmApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdW5pZm9ybSBkYXRhIHR5cGU6ICR7ZGF0YVR5cGV9IGZvciBwcm9ncmFtIFwiJHt0aGlzLm5hbWV9XCIsIGV4cGVjdGVkICR7RkxPQVR9IG9yICR7SU5UfS5gKTtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIHNldFByb2dyYW1Vbmlmb3JtKFxuXHRcdHByb2dyYW06IFdlYkdMUHJvZ3JhbSxcblx0XHRwcm9ncmFtTmFtZTogc3RyaW5nLFxuXHRcdHVuaWZvcm1OYW1lOiBzdHJpbmcsXG5cdFx0dmFsdWU6IFVuaWZvcm1WYWx1ZVR5cGUsXG5cdFx0dHlwZTogVW5pZm9ybVR5cGUsXG5cdCkge1xuXHRcdGNvbnN0IHsgZ2wsIHVuaWZvcm1zLCBlcnJvckNhbGxiYWNrIH0gPSB0aGlzO1xuXHRcdC8vIFNldCBhY3RpdmUgcHJvZ3JhbS5cblx0XHRnbC51c2VQcm9ncmFtKHByb2dyYW0pO1xuXG5cdFx0bGV0IGxvY2F0aW9uID0gdW5pZm9ybXNbdW5pZm9ybU5hbWVdPy5sb2NhdGlvbltwcm9ncmFtTmFtZV07XG5cdFx0Ly8gSW5pdCBhIGxvY2F0aW9uIGZvciBXZWJHTFByb2dyYW0gaWYgbmVlZGVkLlxuXHRcdGlmIChsb2NhdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRjb25zdCBfbG9jYXRpb24gPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24ocHJvZ3JhbSwgdW5pZm9ybU5hbWUpO1xuXHRcdFx0aWYgKCFfbG9jYXRpb24pIHtcblx0XHRcdFx0ZXJyb3JDYWxsYmFjayhgQ291bGQgbm90IGluaXQgdW5pZm9ybSBcIiR7dW5pZm9ybU5hbWV9XCIgZm9yIHByb2dyYW0gXCIke3RoaXMubmFtZX1cIi5cbkNoZWNrIHRoYXQgdW5pZm9ybSBpcyBwcmVzZW50IGluIHNoYWRlciBjb2RlLCB1bnVzZWQgdW5pZm9ybXMgbWF5IGJlIHJlbW92ZWQgYnkgY29tcGlsZXIuXG5BbHNvIGNoZWNrIHRoYXQgdW5pZm9ybSB0eXBlIGluIHNoYWRlciBjb2RlIG1hdGNoZXMgdHlwZSAke3R5cGV9LlxuRXJyb3IgY29kZTogJHtnbC5nZXRFcnJvcigpfS5gKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0bG9jYXRpb24gPSBfbG9jYXRpb247XG5cdFx0XHQvLyBTYXZlIGxvY2F0aW9uIGZvciBmdXR1cmUgdXNlLlxuXHRcdFx0aWYgKHVuaWZvcm1zW3VuaWZvcm1OYW1lXSkge1xuXHRcdFx0XHR1bmlmb3Jtc1t1bmlmb3JtTmFtZV0ubG9jYXRpb25bcHJvZ3JhbU5hbWVdID0gbG9jYXRpb247XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gU2V0IHVuaWZvcm0uXG5cdFx0Ly8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1dlYkdMUmVuZGVyaW5nQ29udGV4dC91bmlmb3JtXG5cdFx0c3dpdGNoICh0eXBlKSB7XG5cdFx0XHRjYXNlIEZMT0FUXzFEX1VOSUZPUk06XG5cdFx0XHRcdGdsLnVuaWZvcm0xZihsb2NhdGlvbiwgdmFsdWUgYXMgbnVtYmVyKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIEZMT0FUXzJEX1VOSUZPUk06XG5cdFx0XHRcdGdsLnVuaWZvcm0yZnYobG9jYXRpb24sIHZhbHVlIGFzIG51bWJlcltdKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIEZMT0FUXzNEX1VOSUZPUk06XG5cdFx0XHRcdGdsLnVuaWZvcm0zZnYobG9jYXRpb24sIHZhbHVlIGFzIG51bWJlcltdKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIEZMT0FUXzREX1VOSUZPUk06XG5cdFx0XHRcdGdsLnVuaWZvcm00ZnYobG9jYXRpb24sIHZhbHVlIGFzIG51bWJlcltdKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIElOVF8xRF9VTklGT1JNOlxuXHRcdFx0XHRnbC51bmlmb3JtMWkobG9jYXRpb24sIHZhbHVlIGFzIG51bWJlcik7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBJTlRfMkRfVU5JRk9STTpcblx0XHRcdFx0Z2wudW5pZm9ybTJpdihsb2NhdGlvbiwgdmFsdWUgYXMgbnVtYmVyW10pO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgSU5UXzNEX1VOSUZPUk06XG5cdFx0XHRcdGdsLnVuaWZvcm0zaXYobG9jYXRpb24sIHZhbHVlIGFzIG51bWJlcltdKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIElOVF80RF9VTklGT1JNOlxuXHRcdFx0XHRnbC51bmlmb3JtNGl2KGxvY2F0aW9uLCB2YWx1ZSBhcyBudW1iZXJbXSk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbmtub3duIHVuaWZvcm0gdHlwZSAke3R5cGV9IGZvciBHUFVQcm9ncmFtIFwiJHt0aGlzLm5hbWV9XCIuYCk7XG5cdFx0fVxuXHR9XG5cblx0c2V0VW5pZm9ybShcblx0XHR1bmlmb3JtTmFtZTogc3RyaW5nLFxuXHRcdHZhbHVlOiBVbmlmb3JtVmFsdWVUeXBlLFxuXHRcdGRhdGFUeXBlPzogVW5pZm9ybURhdGFUeXBlLFxuXHQpIHtcblx0XHRjb25zdCB7IHByb2dyYW1zLCB1bmlmb3JtcyB9ID0gdGhpcztcblxuXHRcdGxldCB0eXBlID0gdW5pZm9ybXNbdW5pZm9ybU5hbWVdPy50eXBlO1xuXHRcdGlmIChkYXRhVHlwZSkge1xuXHRcdFx0Y29uc3QgdHlwZVBhcmFtID0gdGhpcy51bmlmb3JtVHlwZUZvclZhbHVlKHZhbHVlLCBkYXRhVHlwZSk7XG5cdFx0XHRpZiAodHlwZSA9PT0gdW5kZWZpbmVkKSB0eXBlID0gdHlwZVBhcmFtO1xuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdC8vIGNvbnNvbGUud2FybihgRG9uJ3QgbmVlZCB0byBwYXNzIGluIGRhdGFUeXBlIHRvIEdQVVByb2dyYW0uc2V0VW5pZm9ybSBmb3IgcHJldmlvdXNseSBpbml0ZWQgdW5pZm9ybSBcIiR7dW5pZm9ybU5hbWV9XCJgKTtcblx0XHRcdFx0Ly8gQ2hlY2sgdGhhdCB0eXBlcyBtYXRjaCBwcmV2aW91c2x5IHNldCB1bmlmb3JtLlxuXHRcdFx0XHRpZiAodHlwZSAhPT0gdHlwZVBhcmFtKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbmlmb3JtIFwiJHt1bmlmb3JtTmFtZX1cIiBmb3IgR1BVUHJvZ3JhbSBcIiR7dGhpcy5uYW1lfVwiIGNhbm5vdCBjaGFuZ2UgZnJvbSB0eXBlICR7dHlwZX0gdG8gdHlwZSAke3R5cGVQYXJhbX0uYCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKHR5cGUgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbmtub3duIHR5cGUgZm9yIHVuaWZvcm0gXCIke3VuaWZvcm1OYW1lfVwiLCBwbGVhc2UgcGFzcyBpbiBkYXRhVHlwZSB0byBHUFVQcm9ncmFtLnNldFVuaWZvcm0gd2hlbiBpbml0aW5nIGEgbmV3IHVuaWZvcm0uYCk7XG5cdFx0fVxuXG5cdFx0aWYgKCF1bmlmb3Jtc1t1bmlmb3JtTmFtZV0pIHtcblx0XHRcdC8vIEluaXQgdW5pZm9ybSBpZiBuZWVkZWQuXG5cdFx0XHR1bmlmb3Jtc1t1bmlmb3JtTmFtZV0gPSB7IHR5cGUsIGxvY2F0aW9uOiB7fSwgdmFsdWUgfTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gVXBkYXRlIHZhbHVlLlxuXHRcdFx0dW5pZm9ybXNbdW5pZm9ybU5hbWVdLnZhbHVlID0gdmFsdWU7XG5cdFx0fVxuXG5cdFx0Ly8gVXBkYXRlIGFueSBhY3RpdmUgcHJvZ3JhbXMuXG5cdFx0Y29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHByb2dyYW1zKTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGNvbnN0IHByb2dyYW1OYW1lID0ga2V5c1tpXSBhcyBQUk9HUkFNX05BTUVTO1xuXHRcdFx0dGhpcy5zZXRQcm9ncmFtVW5pZm9ybShwcm9ncmFtc1twcm9ncmFtTmFtZV0hLCBwcm9ncmFtTmFtZSwgdW5pZm9ybU5hbWUsIHZhbHVlLCB0eXBlKTtcblx0XHR9XG5cdH07XG5cblx0c2V0VmVydGV4VW5pZm9ybShcblx0XHRwcm9ncmFtOiBXZWJHTFByb2dyYW0sXG5cdFx0dW5pZm9ybU5hbWU6IHN0cmluZyxcblx0XHR2YWx1ZTogVW5pZm9ybVZhbHVlVHlwZSxcblx0XHRkYXRhVHlwZTogVW5pZm9ybURhdGFUeXBlLFxuXHQpIHtcblx0XHRjb25zdCB0eXBlID0gdGhpcy51bmlmb3JtVHlwZUZvclZhbHVlKHZhbHVlLCBkYXRhVHlwZSk7XG5cdFx0aWYgKHByb2dyYW0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdNdXN0IHBhc3MgaW4gdmFsaWQgV2ViR0xQcm9ncmFtIHRvIHNldFZlcnRleFVuaWZvcm0sIGdvdCB1bmRlZmluZWQuJyk7XG5cdFx0fVxuXHRcdGNvbnN0IHByb2dyYW1OYW1lID0gT2JqZWN0LmtleXModGhpcy5wcm9ncmFtcykuZmluZChrZXkgPT4gdGhpcy5wcm9ncmFtc1trZXkgYXMgUFJPR1JBTV9OQU1FU10gPT09IHByb2dyYW0pO1xuXHRcdGlmICghcHJvZ3JhbU5hbWUpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgdmFsaWQgdmVydGV4IHByb2dyYW1OYW1lIGZvciBXZWJHTFByb2dyYW0gXCIke3RoaXMubmFtZX1cIi5gKTtcblx0XHR9XG5cdFx0dGhpcy5zZXRQcm9ncmFtVW5pZm9ybShwcm9ncmFtLCBwcm9ncmFtTmFtZSwgdW5pZm9ybU5hbWUsIHZhbHVlLCB0eXBlKTtcblx0fVxuXG5cdGRlc3Ryb3koKSB7XG5cdFx0Y29uc3QgeyBnbCwgZnJhZ21lbnRTaGFkZXIsIHByb2dyYW1zIH0gPSB0aGlzO1xuXHRcdC8vIFVuYmluZCBhbGwgZ2wgZGF0YSBiZWZvcmUgZGVsZXRpbmcuXG5cdFx0T2JqZWN0LnZhbHVlcyhwcm9ncmFtcykuZm9yRWFjaChwcm9ncmFtID0+IHtcblx0XHRcdGdsLmRlbGV0ZVByb2dyYW0ocHJvZ3JhbSEpO1xuXHRcdH0pO1xuXHRcdE9iamVjdC5rZXlzKHRoaXMucHJvZ3JhbXMpLmZvckVhY2goa2V5ID0+IHtcblx0XHRcdGRlbGV0ZSB0aGlzLnByb2dyYW1zW2tleSBhcyBQUk9HUkFNX05BTUVTXTtcblx0XHR9KTtcblxuXHRcdC8vIEZyb20gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1dlYkdMUmVuZGVyaW5nQ29udGV4dC9kZWxldGVTaGFkZXJcblx0XHQvLyBUaGlzIG1ldGhvZCBoYXMgbm8gZWZmZWN0IGlmIHRoZSBzaGFkZXIgaGFzIGFscmVhZHkgYmVlbiBkZWxldGVkXG5cdFx0Z2wuZGVsZXRlU2hhZGVyKGZyYWdtZW50U2hhZGVyKTtcblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0ZGVsZXRlIHRoaXMuZnJhZ21lbnRTaGFkZXI7XG5cblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0ZGVsZXRlIHRoaXMuZ2w7XG5cdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdGRlbGV0ZSB0aGlzLmVycm9yQ2FsbGJhY2s7XG5cdH1cbn1cbiIsImltcG9ydCB7IHNhdmVBcyB9IGZyb20gJ2ZpbGUtc2F2ZXInO1xuLy8gQHRzLWlnbm9yZVxuaW1wb3J0IHsgY2hhbmdlRHBpQmxvYiB9IGZyb20gJ2NoYW5nZWRwaSc7XG5pbXBvcnQgeyBEYXRhTGF5ZXIgfSBmcm9tICcuL0RhdGFMYXllcic7XG5pbXBvcnQge1xuXHREYXRhTGF5ZXJBcnJheVR5cGUsIERhdGFMYXllckZpbHRlclR5cGUsIERhdGFMYXllck51bUNvbXBvbmVudHMsIERhdGFMYXllclR5cGUsIERhdGFMYXllcldyYXBUeXBlLFxuXHRGTE9BVCwgSEFMRl9GTE9BVCwgVU5TSUdORURfQllURSwgQllURSwgVU5TSUdORURfU0hPUlQsIFNIT1JULCBVTlNJR05FRF9JTlQsIElOVCxcblx0VW5pZm9ybURhdGFUeXBlLCBVbmlmb3JtVmFsdWVUeXBlLCBHTFNMVmVyc2lvbiwgR0xTTDEsIEdMU0wzLCBDTEFNUF9UT19FREdFLCBUZXh0dXJlRm9ybWF0VHlwZSwgTkVBUkVTVCwgUkdCQSwgVGV4dHVyZURhdGFUeXBlLFxufSBmcm9tICcuL0NvbnN0YW50cyc7XG5pbXBvcnQgeyBHUFVQcm9ncmFtIH0gZnJvbSAnLi9HUFVQcm9ncmFtJztcbmltcG9ydCB7IFdlYkdMUmVuZGVyZXIsIFRleHR1cmUsIFZlY3RvcjQgfSBmcm9tICd0aHJlZSc7Ly8gSnVzdCBpbXBvcnRpbmcgdGhlIHR5cGVzIGhlcmUuXG5pbXBvcnQgKiBhcyB1dGlscyBmcm9tICcuL3V0aWxzL1ZlY3RvcjQnO1xuaW1wb3J0IHsgaXNXZWJHTDIsIGlzUG93ZXJPZjIsIGluaXRTZXF1ZW50aWFsRmxvYXRBcnJheSB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgZ2V0RmxvYXQxNiB9IGZyb20gJ0BwZXRhbW9yaWtlbi9mbG9hdDE2JztcbmltcG9ydCB7XG5cdGlzQXJyYXksXG5cdGlzU3RyaW5nLCBpc1ZhbGlkRmlsdGVyVHlwZSwgaXNWYWxpZFRleHR1cmVEYXRhVHlwZSwgaXNWYWxpZFRleHR1cmVGb3JtYXRUeXBlLCBpc1ZhbGlkV3JhcFR5cGUsXG5cdHZhbGlkRmlsdGVyVHlwZXMsIHZhbGlkVGV4dHVyZURhdGFUeXBlcywgdmFsaWRUZXh0dXJlRm9ybWF0VHlwZXMsIHZhbGlkV3JhcFR5cGVzIH0gZnJvbSAnLi9DaGVja3MnO1xuXG5jb25zdCBERUZBVUxUX0NJUkNMRV9OVU1fU0VHTUVOVFMgPSAxODsvLyBNdXN0IGJlIGRpdmlzaWJsZSBieSA2IHRvIHdvcmsgd2l0aCBzdGVwU2VnbWVudCgpLlxuXG50eXBlIEVycm9yQ2FsbGJhY2sgPSAobWVzc2FnZTogc3RyaW5nKSA9PiB2b2lkO1xuXG5leHBvcnQgY2xhc3MgV2ViR0xDb21wdXRlIHtcblx0cmVhZG9ubHkgZ2whOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQgfCBXZWJHTDJSZW5kZXJpbmdDb250ZXh0O1xuXHRyZWFkb25seSBnbHNsVmVyc2lvbiE6IEdMU0xWZXJzaW9uO1xuXHQvLyBUaGVzZSB3aWR0aCBhbmQgaGVpZ2h0IGFyZSB0aGUgY3VycmVudCBjYW52YXMgYXQgZnVsbCByZXMuXG5cdHByaXZhdGUgd2lkdGghOiBudW1iZXI7XG5cdHByaXZhdGUgaGVpZ2h0ITogbnVtYmVyO1xuXG5cdHByaXZhdGUgZXJyb3JTdGF0ZSA9IGZhbHNlO1xuXHRwcml2YXRlIHJlYWRvbmx5IGVycm9yQ2FsbGJhY2s6IEVycm9yQ2FsbGJhY2s7XG5cblx0Ly8gU2F2ZSB0aHJlZWpzIHJlbmRlcmVyIGlmIHBhc3NlZCBpbi5cblx0cHJpdmF0ZSByZW5kZXJlcj86IFdlYkdMUmVuZGVyZXI7XG5cdHByaXZhdGUgcmVhZG9ubHkgbWF4TnVtVGV4dHVyZXMhOiBudW1iZXI7XG5cdFxuXHQvLyBQcmVjb21wdXRlZCBidWZmZXJzIChpbml0ZWQgYXMgbmVlZGVkKS5cblx0cHJpdmF0ZSBfcXVhZFBvc2l0aW9uc0J1ZmZlcj86IFdlYkdMQnVmZmVyO1xuXHRwcml2YXRlIF9ib3VuZGFyeVBvc2l0aW9uc0J1ZmZlcj86IFdlYkdMQnVmZmVyO1xuXHQvLyBTdG9yZSBtdWx0aXBsZSBjaXJjbGUgcG9zaXRpb25zIGJ1ZmZlcnMgZm9yIHZhcmlvdXMgbnVtIHNlZ21lbnRzLCB1c2UgbnVtU2VnbWVudHMgYXMga2V5LlxuXHRwcml2YXRlIF9jaXJjbGVQb3NpdGlvbnNCdWZmZXI6IHsgW2tleTogbnVtYmVyXTogV2ViR0xCdWZmZXIgfSA9IHt9O1xuXG5cdHByaXZhdGUgcG9pbnRJbmRleEFycmF5PzogRmxvYXQzMkFycmF5O1xuXHRwcml2YXRlIHBvaW50SW5kZXhCdWZmZXI/OiBXZWJHTEJ1ZmZlcjtcblx0cHJpdmF0ZSB2ZWN0b3JGaWVsZEluZGV4QXJyYXk/OiBGbG9hdDMyQXJyYXk7XG5cdHByaXZhdGUgdmVjdG9yRmllbGRJbmRleEJ1ZmZlcj86IFdlYkdMQnVmZmVyO1xuXHRwcml2YXRlIGluZGV4ZWRMaW5lc0luZGV4QnVmZmVyPzogV2ViR0xCdWZmZXI7XG5cblx0Ly8gUHJvZ3JhbXMgZm9yIGNvcHlpbmcgZGF0YSAodGhlc2UgYXJlIG5lZWRlZCBmb3IgcmVuZGVyaW5nIHBhcnRpYWwgc2NyZWVuIGdlb21ldHJpZXMpLlxuXHRwcml2YXRlIHJlYWRvbmx5IGNvcHlGbG9hdFByb2dyYW0hOiBHUFVQcm9ncmFtO1xuXHRwcml2YXRlIHJlYWRvbmx5IGNvcHlJbnRQcm9ncmFtITogR1BVUHJvZ3JhbTtcblx0cHJpdmF0ZSByZWFkb25seSBjb3B5VWludFByb2dyYW0hOiBHUFVQcm9ncmFtO1xuXG5cdC8vIE90aGVyIHV0aWwgcHJvZ3JhbXMuXG5cdHByaXZhdGUgX3NpbmdsZUNvbG9yUHJvZ3JhbT86IEdQVVByb2dyYW07XG5cdHByaXZhdGUgX3NpbmdsZUNvbG9yV2l0aFdyYXBDaGVja1Byb2dyYW0/OiBHUFVQcm9ncmFtO1xuXG5cdHN0YXRpYyBpbml0V2l0aFRocmVlUmVuZGVyZXIoXG5cdFx0cmVuZGVyZXI6IFdlYkdMUmVuZGVyZXIsXG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRnbHNsVmVyc2lvbj86IEdMU0xWZXJzaW9uLFxuXHRcdH0sXG5cdFx0ZXJyb3JDYWxsYmFjaz86IEVycm9yQ2FsbGJhY2ssXG5cdCkge1xuXHRcdHJldHVybiBuZXcgV2ViR0xDb21wdXRlKFxuXHRcdFx0e1xuXHRcdFx0XHRjYW52YXM6IHJlbmRlcmVyLmRvbUVsZW1lbnQsXG5cdFx0XHRcdGNvbnRleHQ6IHJlbmRlcmVyLmdldENvbnRleHQoKSxcblx0XHRcdFx0Li4ucGFyYW1zLFxuXHRcdFx0fSxcblx0XHRcdGVycm9yQ2FsbGJhY2ssXG5cdFx0XHRyZW5kZXJlcixcblx0XHQpO1xuXHR9XG5cblx0Y29uc3RydWN0b3IoXG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LFxuXHRcdFx0Y29udGV4dD86IFdlYkdMUmVuZGVyaW5nQ29udGV4dCB8IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQgfCBudWxsLFxuXHRcdFx0YW50aWFsaWFzPzogYm9vbGVhbixcblx0XHRcdGdsc2xWZXJzaW9uPzogR0xTTFZlcnNpb24sXG5cdFx0fSxcblx0XHQvLyBPcHRpb25hbGx5IHBhc3MgaW4gYW4gZXJyb3IgY2FsbGJhY2sgaW4gY2FzZSB3ZSB3YW50IHRvIGhhbmRsZSBlcnJvcnMgcmVsYXRlZCB0byB3ZWJnbCBzdXBwb3J0LlxuXHRcdC8vIGUuZy4gdGhyb3cgdXAgYSBtb2RhbCB0ZWxsaW5nIHVzZXIgdGhpcyB3aWxsIG5vdCB3b3JrIG9uIHRoZWlyIGRldmljZS5cblx0XHRlcnJvckNhbGxiYWNrOiBFcnJvckNhbGxiYWNrID0gKG1lc3NhZ2U6IHN0cmluZykgPT4geyB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSkgfSxcblx0XHRyZW5kZXJlcj86IFdlYkdMUmVuZGVyZXIsXG5cdCkge1xuXHRcdC8vIENoZWNrIHBhcmFtcy5cblx0XHRjb25zdCB2YWxpZEtleXMgPSBbJ2NhbnZhcycsICdjb250ZXh0JywgJ2FudGlhbGlhcycsICdnbHNsVmVyc2lvbiddO1xuXHRcdE9iamVjdC5rZXlzKHBhcmFtcykuZm9yRWFjaChrZXkgPT4ge1xuXHRcdFx0aWYgKHZhbGlkS2V5cy5pbmRleE9mKGtleSkgPCAwKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBrZXkgJHtrZXl9IHBhc3NlZCB0byBXZWJHTENvbXB1dGUuY29uc3RydWN0b3IuICBWYWxpZCBrZXlzIGFyZSAke3ZhbGlkS2V5cy5qb2luKCcsICcpfS5gKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHQvLyBTYXZlIGNhbGxiYWNrIGluIGNhc2Ugd2UgcnVuIGludG8gYW4gZXJyb3IuXG5cdFx0Y29uc3Qgc2VsZiA9IHRoaXM7XG5cdFx0dGhpcy5lcnJvckNhbGxiYWNrID0gKG1lc3NhZ2U6IHN0cmluZykgPT4ge1xuXHRcdFx0aWYgKHNlbGYuZXJyb3JTdGF0ZSkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRzZWxmLmVycm9yU3RhdGUgPSB0cnVlO1xuXHRcdFx0ZXJyb3JDYWxsYmFjayhtZXNzYWdlKTtcblx0XHR9XG5cblx0XHRjb25zdCB7IGNhbnZhcyB9ID0gcGFyYW1zO1xuXHRcdGxldCBnbCA9IHBhcmFtcy5jb250ZXh0O1xuXG5cdFx0Ly8gSW5pdCBHTC5cblx0XHRpZiAoIWdsKSB7XG5cdFx0XHRjb25zdCBvcHRpb25zOiBhbnkgPSB7fTtcblx0XHRcdGlmIChwYXJhbXMuYW50aWFsaWFzICE9PSB1bmRlZmluZWQpIG9wdGlvbnMuYW50aWFsaWFzID0gcGFyYW1zLmFudGlhbGlhcztcblx0XHRcdC8vIEluaXQgYSBnbCBjb250ZXh0IGlmIG5vdCBwYXNzZWQgaW4uXG5cdFx0XHRnbCA9IGNhbnZhcy5nZXRDb250ZXh0KCd3ZWJnbDInLCBvcHRpb25zKSAgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCB8IG51bGxcblx0XHRcdFx0fHwgY2FudmFzLmdldENvbnRleHQoJ3dlYmdsJywgb3B0aW9ucykgIGFzIFdlYkdMUmVuZGVyaW5nQ29udGV4dCB8IG51bGxcblx0XHRcdFx0fHwgY2FudmFzLmdldENvbnRleHQoJ2V4cGVyaW1lbnRhbC13ZWJnbCcsIG9wdGlvbnMpICBhcyBXZWJHTFJlbmRlcmluZ0NvbnRleHQgfCBudWxsO1xuXHRcdFx0aWYgKGdsID09PSBudWxsKSB7XG5cdFx0XHRcdHRoaXMuZXJyb3JDYWxsYmFjaygnVW5hYmxlIHRvIGluaXRpYWxpemUgV2ViR0wgY29udGV4dC4nKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAoaXNXZWJHTDIoZ2wpKSB7XG5cdFx0XHRjb25zb2xlLmxvZygnVXNpbmcgV2ViR0wgMi4wIGNvbnRleHQuJyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnNvbGUubG9nKCdVc2luZyBXZWJHTCAxLjAgY29udGV4dC4nKTtcblx0XHR9XG5cdFx0dGhpcy5nbCA9IGdsO1xuXHRcdHRoaXMucmVuZGVyZXIgPSByZW5kZXJlcjtcblxuXHRcdC8vIFNhdmUgZ2xzbCB2ZXJzaW9uLCBkZWZhdWx0IHRvIDEueC5cblx0XHRjb25zdCBnbHNsVmVyc2lvbiA9IHBhcmFtcy5nbHNsVmVyc2lvbiA9PT0gdW5kZWZpbmVkID8gR0xTTDEgOiBwYXJhbXMuZ2xzbFZlcnNpb247XG5cdFx0dGhpcy5nbHNsVmVyc2lvbiA9IGdsc2xWZXJzaW9uO1xuXHRcdGlmICghaXNXZWJHTDIoZ2wpICYmIGdsc2xWZXJzaW9uID09PSBHTFNMMykge1xuXHRcdFx0Y29uc29sZS53YXJuKCdHTFNMMy54IGlzIGluY29tcGF0aWJsZSB3aXRoIFdlYkdMMS4wIGNvbnRleHRzLicpO1xuXHRcdH1cblxuXHRcdC8vIEdMIHNldHVwLlxuXHRcdC8vIERpc2FibGUgZGVwdGggdGVzdGluZyBnbG9iYWxseS5cblx0XHRnbC5kaXNhYmxlKGdsLkRFUFRIX1RFU1QpO1xuXHRcdC8vIFNldCB1bnBhY2sgYWxpZ25tZW50IHRvIDEgc28gd2UgY2FuIGhhdmUgdGV4dHVyZXMgb2YgYXJiaXRyYXJ5IGRpbWVuc2lvbnMuXG5cdFx0Ly8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTE1ODIyODIvZXJyb3Itd2hlbi1jcmVhdGluZy10ZXh0dXJlcy1pbi13ZWJnbC13aXRoLXRoZS1yZ2ItZm9ybWF0XG5cdFx0Z2wucGl4ZWxTdG9yZWkoZ2wuVU5QQUNLX0FMSUdOTUVOVCwgMSk7XG5cdFx0Ly8gVE9ETzogbG9vayBpbnRvIG1vcmUgb2YgdGhlc2U6IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9XZWJHTFJlbmRlcmluZ0NvbnRleHQvcGl4ZWxTdG9yZWlcblx0XHQvLyAvLyBTb21lIGltcGxlbWVudGF0aW9ucyBvZiBIVE1MQ2FudmFzRWxlbWVudCdzIG9yIE9mZnNjcmVlbkNhbnZhcydzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBzdG9yZSBjb2xvciB2YWx1ZXNcblx0XHQvLyAvLyBpbnRlcm5hbGx5IGluIHByZW11bHRpcGxpZWQgZm9ybS4gSWYgc3VjaCBhIGNhbnZhcyBpcyB1cGxvYWRlZCB0byBhIFdlYkdMIHRleHR1cmUgd2l0aCB0aGVcblx0XHQvLyAvLyBVTlBBQ0tfUFJFTVVMVElQTFlfQUxQSEFfV0VCR0wgcGl4ZWwgc3RvcmFnZSBwYXJhbWV0ZXIgc2V0IHRvIGZhbHNlLCB0aGUgY29sb3IgY2hhbm5lbHMgd2lsbCBoYXZlIHRvIGJlIHVuLW11bHRpcGxpZWRcblx0XHQvLyAvLyBieSB0aGUgYWxwaGEgY2hhbm5lbCwgd2hpY2ggaXMgYSBsb3NzeSBvcGVyYXRpb24uIFRoZSBXZWJHTCBpbXBsZW1lbnRhdGlvbiB0aGVyZWZvcmUgY2FuIG5vdCBndWFyYW50ZWUgdGhhdCBjb2xvcnNcblx0XHQvLyAvLyB3aXRoIGFscGhhIDwgMS4wIHdpbGwgYmUgcHJlc2VydmVkIGxvc3NsZXNzbHkgd2hlbiBmaXJzdCBkcmF3biB0byBhIGNhbnZhcyB2aWEgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIGFuZCB0aGVuXG5cdFx0Ly8gLy8gdXBsb2FkZWQgdG8gYSBXZWJHTCB0ZXh0dXJlIHdoZW4gdGhlIFVOUEFDS19QUkVNVUxUSVBMWV9BTFBIQV9XRUJHTCBwaXhlbCBzdG9yYWdlIHBhcmFtZXRlciBpcyBzZXQgdG8gZmFsc2UuXG5cdFx0Ly8gZ2wucGl4ZWxTdG9yZWkoZ2wuVU5QQUNLX1BSRU1VTFRJUExZX0FMUEhBX1dFQkdMLCB0cnVlKTtcblxuXHRcdC8vIEluaXQgcHJvZ3JhbXMgdG8gcGFzcyB2YWx1ZXMgZnJvbSBvbmUgdGV4dHVyZSB0byBhbm90aGVyLlxuXHRcdHRoaXMuY29weUZsb2F0UHJvZ3JhbSA9IHRoaXMuaW5pdFByb2dyYW0oe1xuXHRcdFx0bmFtZTogJ2NvcHlGbG9hdCcsXG5cdFx0XHRmcmFnbWVudFNoYWRlcjogZ2xzbFZlcnNpb24gPT09IEdMU0wzID8gcmVxdWlyZSgnLi9nbHNsXzMvQ29weUZsb2F0RnJhZ1NoYWRlci5nbHNsJykgOiByZXF1aXJlKCcuL2dsc2xfMS9Db3B5RnJhZ1NoYWRlci5nbHNsJyksXG5cdFx0XHR1bmlmb3JtczogW1xuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdG5hbWU6ICd1X3N0YXRlJyxcblx0XHRcdFx0XHRcdHZhbHVlOiAwLFxuXHRcdFx0XHRcdFx0ZGF0YVR5cGU6IElOVCxcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRdLFxuXHRcdFx0fSxcblx0XHQpO1xuXHRcdGlmIChnbHNsVmVyc2lvbiA9PT0gR0xTTDMpIHtcblx0XHRcdHRoaXMuY29weUludFByb2dyYW0gPSB0aGlzLmluaXRQcm9ncmFtKHtcblx0XHRcdFx0bmFtZTogJ2NvcHlJbnQnLFxuXHRcdFx0XHRmcmFnbWVudFNoYWRlcjogcmVxdWlyZSgnLi9nbHNsXzMvQ29weUludEZyYWdTaGFkZXIuZ2xzbCcpLFxuXHRcdFx0XHR1bmlmb3JtczogW1xuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRuYW1lOiAndV9zdGF0ZScsXG5cdFx0XHRcdFx0XHRcdHZhbHVlOiAwLFxuXHRcdFx0XHRcdFx0XHRkYXRhVHlwZTogSU5ULFxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRdLFxuXHRcdFx0XHR9LFxuXHRcdFx0KTtcblx0XHRcdHRoaXMuY29weVVpbnRQcm9ncmFtID0gdGhpcy5pbml0UHJvZ3JhbSh7XG5cdFx0XHRcdG5hbWU6ICdjb3B5VWludCcsXG5cdFx0XHRcdGZyYWdtZW50U2hhZGVyOiByZXF1aXJlKCcuL2dsc2xfMy9Db3B5VWludEZyYWdTaGFkZXIuZ2xzbCcpLFxuXHRcdFx0XHR1bmlmb3JtczogW1xuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRuYW1lOiAndV9zdGF0ZScsXG5cdFx0XHRcdFx0XHRcdHZhbHVlOiAwLFxuXHRcdFx0XHRcdFx0XHRkYXRhVHlwZTogSU5ULFxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRdLFxuXHRcdFx0XHR9LFxuXHRcdFx0KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5jb3B5SW50UHJvZ3JhbSA9IHRoaXMuY29weUZsb2F0UHJvZ3JhbTtcblx0XHRcdHRoaXMuY29weVVpbnRQcm9ncmFtID0gdGhpcy5jb3B5RmxvYXRQcm9ncmFtO1xuXHRcdH1cblxuXHRcdC8vIFVuYmluZCBhY3RpdmUgYnVmZmVyLlxuXHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBudWxsKTtcblxuXHRcdC8vIENhbnZhcyBzZXR1cC5cblx0XHR0aGlzLm9uUmVzaXplKGNhbnZhcyk7XG5cblx0XHQvLyBMb2cgbnVtYmVyIG9mIHRleHR1cmVzIGF2YWlsYWJsZS5cblx0XHR0aGlzLm1heE51bVRleHR1cmVzID0gdGhpcy5nbC5nZXRQYXJhbWV0ZXIodGhpcy5nbC5NQVhfVEVYVFVSRV9JTUFHRV9VTklUUyk7XG5cdFx0Y29uc29sZS5sb2coYCR7dGhpcy5tYXhOdW1UZXh0dXJlc30gdGV4dHVyZXMgbWF4LmApO1xuXHR9XG5cblx0cHJpdmF0ZSBnZXQgc2luZ2xlQ29sb3JQcm9ncmFtKCkge1xuXHRcdGlmICh0aGlzLl9zaW5nbGVDb2xvclByb2dyYW0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Y29uc3QgcHJvZ3JhbSA9IHRoaXMuaW5pdFByb2dyYW0oe1xuXHRcdFx0XHRuYW1lOiAnc2luZ2xlQ29sb3InLFxuXHRcdFx0XHRmcmFnbWVudFNoYWRlcjogdGhpcy5nbHNsVmVyc2lvbiA9PT0gR0xTTDMgPyByZXF1aXJlKCcuL2dsc2xfMy9TaW5nbGVDb2xvckZyYWdTaGFkZXIuZ2xzbCcpIDogcmVxdWlyZSgnLi9nbHNsXzEvU2luZ2xlQ29sb3JGcmFnU2hhZGVyLmdsc2wnKSxcblx0XHRcdH0pO1xuXHRcdFx0dGhpcy5fc2luZ2xlQ29sb3JQcm9ncmFtID0gcHJvZ3JhbTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuX3NpbmdsZUNvbG9yUHJvZ3JhbTtcblx0fVxuXG5cdHByaXZhdGUgZ2V0IHNpbmdsZUNvbG9yV2l0aFdyYXBDaGVja1Byb2dyYW0oKSB7XG5cdFx0aWYgKHRoaXMuX3NpbmdsZUNvbG9yV2l0aFdyYXBDaGVja1Byb2dyYW0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Y29uc3QgcHJvZ3JhbSA9IHRoaXMuaW5pdFByb2dyYW0oe1xuXHRcdFx0XHRuYW1lOiAnc2luZ2xlQ29sb3JXaXRoV3JhcENoZWNrJyxcblx0XHRcdFx0ZnJhZ21lbnRTaGFkZXI6IHRoaXMuZ2xzbFZlcnNpb24gPT09IEdMU0wzID8gcmVxdWlyZSgnLi9nbHNsXzMvU2luZ2xlQ29sb3JXaXRoV3JhcENoZWNrRnJhZ1NoYWRlci5nbHNsJykgOiByZXF1aXJlKCcuL2dsc2xfMS9TaW5nbGVDb2xvcldpdGhXcmFwQ2hlY2tGcmFnU2hhZGVyLmdsc2wnKSxcblx0XHRcdH0pO1xuXHRcdFx0dGhpcy5fc2luZ2xlQ29sb3JXaXRoV3JhcENoZWNrUHJvZ3JhbSA9IHByb2dyYW07XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLl9zaW5nbGVDb2xvcldpdGhXcmFwQ2hlY2tQcm9ncmFtO1xuXHR9XG5cblx0aXNXZWJHTDIoKSB7XG5cdFx0cmV0dXJuIGlzV2ViR0wyKHRoaXMuZ2wpO1xuXHR9XG5cblx0cHJpdmF0ZSBnZXQgcXVhZFBvc2l0aW9uc0J1ZmZlcigpIHtcblx0XHRpZiAodGhpcy5fcXVhZFBvc2l0aW9uc0J1ZmZlciA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRjb25zdCBmc1F1YWRQb3NpdGlvbnMgPSBuZXcgRmxvYXQzMkFycmF5KFsgLTEsIC0xLCAxLCAtMSwgLTEsIDEsIDEsIDEgXSk7XG5cdFx0XHR0aGlzLl9xdWFkUG9zaXRpb25zQnVmZmVyID0gdGhpcy5pbml0VmVydGV4QnVmZmVyKGZzUXVhZFBvc2l0aW9ucykhO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5fcXVhZFBvc2l0aW9uc0J1ZmZlciE7XG5cdH1cblxuXHRwcml2YXRlIGdldCBib3VuZGFyeVBvc2l0aW9uc0J1ZmZlcigpIHtcblx0XHRpZiAodGhpcy5fYm91bmRhcnlQb3NpdGlvbnNCdWZmZXIgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Y29uc3QgYm91bmRhcnlQb3NpdGlvbnMgPSBuZXcgRmxvYXQzMkFycmF5KFsgLTEsIC0xLCAxLCAtMSwgMSwgMSwgLTEsIDEsIC0xLCAtMSBdKTtcblx0XHRcdHRoaXMuX2JvdW5kYXJ5UG9zaXRpb25zQnVmZmVyID0gdGhpcy5pbml0VmVydGV4QnVmZmVyKGJvdW5kYXJ5UG9zaXRpb25zKSE7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLl9ib3VuZGFyeVBvc2l0aW9uc0J1ZmZlciE7XG5cdH1cblxuXHRwcml2YXRlIGdldENpcmNsZVBvc2l0aW9uc0J1ZmZlcihudW1TZWdtZW50czogbnVtYmVyKSB7XG5cdFx0aWYgKHRoaXMuX2NpcmNsZVBvc2l0aW9uc0J1ZmZlcltudW1TZWdtZW50c10gPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRjb25zdCB1bml0Q2lyY2xlUG9pbnRzID0gWzAsIDBdO1xuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPD0gbnVtU2VnbWVudHM7IGkrKykge1xuXHRcdFx0XHR1bml0Q2lyY2xlUG9pbnRzLnB1c2goXG5cdFx0XHRcdFx0TWF0aC5jb3MoMiAqIE1hdGguUEkgKiBpIC8gbnVtU2VnbWVudHMpLFxuXHRcdFx0XHRcdE1hdGguc2luKDIgKiBNYXRoLlBJICogaSAvIG51bVNlZ21lbnRzKSxcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHRcdGNvbnN0IGNpcmNsZVBvc2l0aW9ucyA9IG5ldyBGbG9hdDMyQXJyYXkodW5pdENpcmNsZVBvaW50cyk7XG5cdFx0XHRjb25zdCBidWZmZXIgPSB0aGlzLmluaXRWZXJ0ZXhCdWZmZXIoY2lyY2xlUG9zaXRpb25zKSE7XG5cdFx0XHR0aGlzLl9jaXJjbGVQb3NpdGlvbnNCdWZmZXJbbnVtU2VnbWVudHNdID0gYnVmZmVyO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5fY2lyY2xlUG9zaXRpb25zQnVmZmVyW251bVNlZ21lbnRzXTtcblx0fVxuXG5cdHByaXZhdGUgaW5pdFZlcnRleEJ1ZmZlcihcblx0XHRkYXRhOiBGbG9hdDMyQXJyYXksXG5cdCkge1xuXHRcdGNvbnN0IHsgZXJyb3JDYWxsYmFjaywgZ2wgfSA9IHRoaXM7XG5cdFx0Y29uc3QgYnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKCk7XG5cdFx0aWYgKCFidWZmZXIpIHtcblx0XHRcdGVycm9yQ2FsbGJhY2soJ1VuYWJsZSB0byBhbGxvY2F0ZSBnbCBidWZmZXIuJyk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBidWZmZXIpO1xuXHRcdC8vIEFkZCBidWZmZXIgZGF0YS5cblx0XHRnbC5idWZmZXJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgZGF0YSwgZ2wuU1RBVElDX0RSQVcpO1xuXHRcdHJldHVybiBidWZmZXI7XG5cdH1cblxuXHRpbml0UHJvZ3JhbShcblx0XHRwYXJhbXM6IHtcblx0XHRcdG5hbWU6IHN0cmluZyxcblx0XHRcdGZyYWdtZW50U2hhZGVyOiBzdHJpbmcgfCBXZWJHTFNoYWRlcixcblx0XHRcdHVuaWZvcm1zPzoge1xuXHRcdFx0XHRuYW1lOiBzdHJpbmcsXG5cdFx0XHRcdHZhbHVlOiBVbmlmb3JtVmFsdWVUeXBlLFxuXHRcdFx0XHRkYXRhVHlwZTogVW5pZm9ybURhdGFUeXBlLFxuXHRcdFx0fVtdLFxuXHRcdFx0ZGVmaW5lcz86IHtcblx0XHRcdFx0W2tleSA6IHN0cmluZ106IHN0cmluZyxcblx0XHRcdH0sXG5cdFx0fSxcblx0KSB7XG5cdFx0Ly8gQ2hlY2sgcGFyYW1zLlxuXHRcdGNvbnN0IHZhbGlkS2V5cyA9IFsnbmFtZScsICdmcmFnbWVudFNoYWRlcicsICd1bmlmb3JtcycsICdkZWZpbmVzJ107XG5cdFx0T2JqZWN0LmtleXMocGFyYW1zKS5mb3JFYWNoKGtleSA9PiB7XG5cdFx0XHRpZiAodmFsaWRLZXlzLmluZGV4T2Yoa2V5KSA8IDApIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGtleSAke2tleX0gcGFzc2VkIHRvIFdlYkdMQ29tcHV0ZS5pbml0UHJvZ3JhbSB3aXRoIG5hbWUgXCIke3BhcmFtcy5uYW1lfVwiLiAgVmFsaWQga2V5cyBhcmUgJHt2YWxpZEtleXMuam9pbignLCAnKX0uYCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0Y29uc3QgeyBnbCwgZXJyb3JDYWxsYmFjaywgZ2xzbFZlcnNpb24gfSA9IHRoaXM7XG5cdFx0cmV0dXJuIG5ldyBHUFVQcm9ncmFtKFxuXHRcdFx0e1xuXHRcdFx0XHQuLi5wYXJhbXMsXG5cdFx0XHRcdGdsLFxuXHRcdFx0XHRlcnJvckNhbGxiYWNrLFxuXHRcdFx0XHRnbHNsVmVyc2lvbixcblx0XHRcdH0sXG5cdFx0KTtcblx0fTtcblxuXHRpbml0RGF0YUxheWVyKFxuXHRcdHBhcmFtczoge1xuXHRcdFx0bmFtZTogc3RyaW5nLFxuXHRcdFx0ZGltZW5zaW9uczogbnVtYmVyIHwgW251bWJlciwgbnVtYmVyXSxcblx0XHRcdHR5cGU6IERhdGFMYXllclR5cGUsXG5cdFx0XHRudW1Db21wb25lbnRzOiBEYXRhTGF5ZXJOdW1Db21wb25lbnRzLFxuXHRcdFx0ZGF0YT86IERhdGFMYXllckFycmF5VHlwZSxcblx0XHRcdGZpbHRlcj86IERhdGFMYXllckZpbHRlclR5cGUsXG5cdFx0XHR3cmFwUz86IERhdGFMYXllcldyYXBUeXBlLFxuXHRcdFx0d3JhcFQ/OiBEYXRhTGF5ZXJXcmFwVHlwZSxcblx0XHRcdHdyaXRhYmxlPzogYm9vbGVhbixcblx0XHRcdG51bUJ1ZmZlcnM/OiBudW1iZXIsXG5cdFx0fSxcblx0KSB7XG5cdFx0Ly8gQ2hlY2sgcGFyYW1zLlxuXHRcdGNvbnN0IHZhbGlkS2V5cyA9IFsnbmFtZScsICdkaW1lbnNpb25zJywgJ3R5cGUnLCAnbnVtQ29tcG9uZW50cycsICdkYXRhJywgJ2ZpbHRlcicsICd3cmFwUycsICd3cmFwVCcsICd3cml0YWJsZScsICdudW1CdWZmZXJzJ107XG5cdFx0T2JqZWN0LmtleXMocGFyYW1zKS5mb3JFYWNoKGtleSA9PiB7XG5cdFx0XHRpZiAodmFsaWRLZXlzLmluZGV4T2Yoa2V5KSA8IDApIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGtleSAke2tleX0gcGFzc2VkIHRvIFdlYkdMQ29tcHV0ZS5pbml0RGF0YUxheWVyIHdpdGggbmFtZSBcIiR7cGFyYW1zLm5hbWV9XCIuICBWYWxpZCBrZXlzIGFyZSAke3ZhbGlkS2V5cy5qb2luKCcsICcpfS5gKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRjb25zdCB7IGdsLCBlcnJvckNhbGxiYWNrLCBnbHNsVmVyc2lvbiB9ID0gdGhpcztcblx0XHRyZXR1cm4gbmV3IERhdGFMYXllcih7XG5cdFx0XHQuLi5wYXJhbXMsXG5cdFx0XHRnbCxcblx0XHRcdGdsc2xWZXJzaW9uLFxuXHRcdFx0ZXJyb3JDYWxsYmFjayxcblx0XHR9KTtcblx0fTtcblxuXHRpbml0VGV4dHVyZShcblx0XHRwYXJhbXM6IHtcblx0XHRcdG5hbWU6IHN0cmluZyxcblx0XHRcdHVybDogc3RyaW5nLFxuXHRcdFx0ZmlsdGVyPzogRGF0YUxheWVyRmlsdGVyVHlwZSxcblx0XHRcdHdyYXBTPzogRGF0YUxheWVyV3JhcFR5cGUsXG5cdFx0XHR3cmFwVD86IERhdGFMYXllcldyYXBUeXBlLFxuXHRcdFx0Zm9ybWF0PzogVGV4dHVyZUZvcm1hdFR5cGUsXG5cdFx0XHR0eXBlPzogVGV4dHVyZURhdGFUeXBlLFxuXHRcdFx0b25Mb2FkPzogKHRleHR1cmU6IFdlYkdMVGV4dHVyZSkgPT4gdm9pZCxcblx0XHR9LFxuXHQpIHtcblx0XHQvLyBDaGVjayBwYXJhbXMuXG5cdFx0Y29uc3QgdmFsaWRLZXlzID0gWyduYW1lJywgJ3VybCcsICdmaWx0ZXInLCAnd3JhcFMnLCAnd3JhcFQnLCAnZm9ybWF0JywgJ3R5cGUnLCAnb25Mb2FkJ107XG5cdFx0T2JqZWN0LmtleXMocGFyYW1zKS5mb3JFYWNoKGtleSA9PiB7XG5cdFx0XHRpZiAodmFsaWRLZXlzLmluZGV4T2Yoa2V5KSA8IDApIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGtleSAke2tleX0gcGFzc2VkIHRvIFdlYkdMQ29tcHV0ZS5pbml0VGV4dHVyZSB3aXRoIG5hbWUgXCIke3BhcmFtcy5uYW1lfVwiLiAgVmFsaWQga2V5cyBhcmUgJHt2YWxpZEtleXMuam9pbignLCAnKX0uYCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0Y29uc3QgeyB1cmwsIG5hbWUgfSA9IHBhcmFtcztcblx0XHRpZiAoIWlzU3RyaW5nKHVybCkpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgV2ViR0xDb21wdXRlLmluaXRUZXh0dXJlIHBhcmFtcyB0byBoYXZlIHVybCBvZiB0eXBlIHN0cmluZywgZ290ICR7dXJsfSBvZiB0eXBlICR7dHlwZW9mIHVybH0uYClcblx0XHR9XG5cdFx0aWYgKCFpc1N0cmluZyhuYW1lKSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBXZWJHTENvbXB1dGUuaW5pdFRleHR1cmUgcGFyYW1zIHRvIGhhdmUgbmFtZSBvZiB0eXBlIHN0cmluZywgZ290ICR7bmFtZX0gb2YgdHlwZSAke3R5cGVvZiBuYW1lfS5gKVxuXHRcdH1cblxuXHRcdC8vIEdldCBmaWx0ZXIgdHlwZSwgZGVmYXVsdCB0byBuZWFyZXN0LlxuXHRcdGNvbnN0IGZpbHRlciA9IHBhcmFtcy5maWx0ZXIgIT09IHVuZGVmaW5lZCA/IHBhcmFtcy5maWx0ZXIgOiBORUFSRVNUO1xuXHRcdGlmICghaXNWYWxpZEZpbHRlclR5cGUoZmlsdGVyKSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGZpbHRlcjogJHtmaWx0ZXJ9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIsIG11c3QgYmUgJHt2YWxpZEZpbHRlclR5cGVzLmpvaW4oJywgJyl9LmApO1xuXHRcdH1cblxuXHRcdC8vIEdldCB3cmFwIHR5cGVzLCBkZWZhdWx0IHRvIGNsYW1wIHRvIGVkZ2UuXG5cdFx0Y29uc3Qgd3JhcFMgPSBwYXJhbXMud3JhcFMgIT09IHVuZGVmaW5lZCA/IHBhcmFtcy53cmFwUyA6IENMQU1QX1RPX0VER0U7XG5cdFx0aWYgKCFpc1ZhbGlkV3JhcFR5cGUod3JhcFMpKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgd3JhcFM6ICR7d3JhcFN9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIsIG11c3QgYmUgJHt2YWxpZFdyYXBUeXBlcy5qb2luKCcsICcpfS5gKTtcblx0XHR9XG5cdFx0Y29uc3Qgd3JhcFQgPSBwYXJhbXMud3JhcFQgIT09IHVuZGVmaW5lZCA/IHBhcmFtcy53cmFwVCA6IENMQU1QX1RPX0VER0U7XG5cdFx0aWYgKCFpc1ZhbGlkV3JhcFR5cGUod3JhcFQpKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgd3JhcFQ6ICR7d3JhcFR9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIsIG11c3QgYmUgJHt2YWxpZFdyYXBUeXBlcy5qb2luKCcsICcpfS5gKTtcblx0XHR9XG5cblx0XHQvLyBHZXQgaW1hZ2UgZm9ybWF0IHR5cGUsIGRlZmF1bHQgdG8gcmdiYS5cblx0XHRjb25zdCBmb3JtYXQgPSBwYXJhbXMuZm9ybWF0ICE9PSB1bmRlZmluZWQgPyBwYXJhbXMuZm9ybWF0IDogUkdCQTtcblx0XHRpZiAoIWlzVmFsaWRUZXh0dXJlRm9ybWF0VHlwZShmb3JtYXQpKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgZm9ybWF0OiAke2Zvcm1hdH0gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIiwgbXVzdCBiZSAke3ZhbGlkVGV4dHVyZUZvcm1hdFR5cGVzLmpvaW4oJywgJyl9LmApO1xuXHRcdH1cblxuXHRcdC8vIEdldCBpbWFnZSBkYXRhIHR5cGUsIGRlZmF1bHQgdG8gdW5zaWduZWQgYnl0ZS5cblx0XHRjb25zdCB0eXBlID0gcGFyYW1zLnR5cGUgIT09IHVuZGVmaW5lZCA/IHBhcmFtcy50eXBlIDogVU5TSUdORURfQllURTtcblx0XHRpZiAoIWlzVmFsaWRUZXh0dXJlRGF0YVR5cGUodHlwZSkpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB0eXBlOiAke3R5cGV9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIsIG11c3QgYmUgJHt2YWxpZFRleHR1cmVEYXRhVHlwZXMuam9pbignLCAnKX0uYCk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgeyBnbCwgZXJyb3JDYWxsYmFjayB9ID0gdGhpcztcblx0XHRjb25zdCB0ZXh0dXJlID0gZ2wuY3JlYXRlVGV4dHVyZSgpO1xuXHRcdGlmICh0ZXh0dXJlID09PSBudWxsKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byBpbml0IGdsVGV4dHVyZS5gKTtcblx0XHR9XG5cdFx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgdGV4dHVyZSk7XG5cdFx0Ly8gQmVjYXVzZSBpbWFnZXMgaGF2ZSB0byBiZSBkb3dubG9hZGVkIG92ZXIgdGhlIGludGVybmV0XG5cdFx0Ly8gdGhleSBtaWdodCB0YWtlIGEgbW9tZW50IHVudGlsIHRoZXkgYXJlIHJlYWR5LlxuXHRcdC8vIFVudGlsIHRoZW4gcHV0IGEgc2luZ2xlIHBpeGVsIGluIHRoZSB0ZXh0dXJlIHNvIHdlIGNhblxuXHRcdC8vIHVzZSBpdCBpbW1lZGlhdGVseS4gV2hlbiB0aGUgaW1hZ2UgaGFzIGZpbmlzaGVkIGRvd25sb2FkaW5nXG5cdFx0Ly8gd2UnbGwgdXBkYXRlIHRoZSB0ZXh0dXJlIHdpdGggdGhlIGNvbnRlbnRzIG9mIHRoZSBpbWFnZS5cblx0XHRjb25zdCBsZXZlbCA9IDA7XG5cdFx0Y29uc3QgaW50ZXJuYWxGb3JtYXQgPSBnbC5SR0JBO1xuXHRcdGNvbnN0IHdpZHRoID0gMTtcblx0XHRjb25zdCBoZWlnaHQgPSAxO1xuXHRcdGNvbnN0IGJvcmRlciA9IDA7XG5cdFx0Y29uc3Qgc3JjRm9ybWF0ID0gZ2xbZm9ybWF0XTtcblx0XHRjb25zdCBzcmNUeXBlID0gZ2xbdHlwZV07XG5cdFx0Y29uc3QgcGl4ZWwgPSBuZXcgVWludDhBcnJheShbMCwgMCwgMCwgMF0pO1xuXHRcdGdsLnRleEltYWdlMkQoZ2wuVEVYVFVSRV8yRCwgbGV2ZWwsIGludGVybmFsRm9ybWF0LFxuXHRcdFx0d2lkdGgsIGhlaWdodCwgYm9yZGVyLCBzcmNGb3JtYXQsIHNyY1R5cGUsIHBpeGVsKTtcblxuXHRcdGNvbnN0IGltYWdlID0gbmV3IEltYWdlKCk7XG5cdFx0aW1hZ2Uub25sb2FkID0gKCkgPT4ge1xuXHRcdFx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgdGV4dHVyZSk7XG5cdFx0XHRnbC50ZXhJbWFnZTJEKGdsLlRFWFRVUkVfMkQsIGxldmVsLCBpbnRlcm5hbEZvcm1hdCxcblx0XHRcdFx0c3JjRm9ybWF0LCBzcmNUeXBlLCBpbWFnZSk7XG5cblx0XHRcdC8vIFdlYkdMMSBoYXMgZGlmZmVyZW50IHJlcXVpcmVtZW50cyBmb3IgcG93ZXIgb2YgMiBpbWFnZXNcblx0XHRcdC8vIHZzIG5vbiBwb3dlciBvZiAyIGltYWdlcyBzbyBjaGVjayBpZiB0aGUgaW1hZ2UgaXMgYVxuXHRcdFx0Ly8gcG93ZXIgb2YgMiBpbiBib3RoIGRpbWVuc2lvbnMuXG5cdFx0XHRpZiAoaXNQb3dlck9mMihpbWFnZS53aWR0aCkgJiYgaXNQb3dlck9mMihpbWFnZS5oZWlnaHQpKSB7XG5cdFx0XHRcdC8vIC8vIFllcywgaXQncyBhIHBvd2VyIG9mIDIuIEdlbmVyYXRlIG1pcHMuXG5cdFx0XHRcdC8vIGdsLmdlbmVyYXRlTWlwbWFwKGdsLlRFWFRVUkVfMkQpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gVE9ETzogZmluaXNoIGltcGxlbWVudGluZyB0aGlzLlxuXHRcdFx0XHRjb25zb2xlLndhcm4oYFRleHR1cmUgJHtuYW1lfSBkaW1lbnNpb25zIFske2ltYWdlLndpZHRofSwgJHtpbWFnZS5oZWlnaHR9XSBhcmUgbm90IHBvd2VyIG9mIDIuYCk7XG5cdFx0XHRcdC8vIC8vIE5vLCBpdCdzIG5vdCBhIHBvd2VyIG9mIDIuIFR1cm4gb2ZmIG1pcHMgYW5kIHNldFxuXHRcdFx0XHQvLyAvLyB3cmFwcGluZyB0byBjbGFtcCB0byBlZGdlXG5cdFx0XHRcdC8vIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1MsIGdsLkNMQU1QX1RPX0VER0UpO1xuXHRcdFx0XHQvLyBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9ULCBnbC5DTEFNUF9UT19FREdFKTtcblx0XHRcdH1cblx0XHRcdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1MsIGdsW3dyYXBTXSk7XG5cdFx0XHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9ULCBnbFt3cmFwVF0pO1xuXHRcdFx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01JTl9GSUxURVIsIGdsW2ZpbHRlcl0pO1xuXHRcdFx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01BR19GSUxURVIsIGdsW2ZpbHRlcl0pO1xuXG5cdFx0XHQvLyBDYWxsYmFjayB3aGVuIHRleHR1cmUgaGFzIGxvYWRlZC5cblx0XHRcdGlmIChwYXJhbXMub25Mb2FkKSBwYXJhbXMub25Mb2FkKHRleHR1cmUpO1xuXHRcdH07XG5cdFx0aW1hZ2Uub25lcnJvciA9IChlKSA9PiB7XG5cdFx0XHRlcnJvckNhbGxiYWNrKGBFcnJvciBsb2FkaW5nIGltYWdlICR7bmFtZX06ICR7ZX1gKTtcblx0XHR9XG5cdFx0aW1hZ2Uuc3JjID0gdXJsO1xuXG5cdFx0cmV0dXJuIHRleHR1cmU7XG5cdH1cblxuXHRvblJlc2l6ZShjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50KSB7XG5cdFx0Y29uc3Qgd2lkdGggPSBjYW52YXMuY2xpZW50V2lkdGg7XG5cdFx0Y29uc3QgaGVpZ2h0ID0gY2FudmFzLmNsaWVudEhlaWdodDtcblx0XHQvLyBTZXQgY29ycmVjdCBjYW52YXMgcGl4ZWwgc2l6ZS5cblx0XHQvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvV2ViR0xfQVBJL0J5X2V4YW1wbGUvQ2FudmFzX3NpemVfYW5kX1dlYkdMXG5cdFx0Y2FudmFzLndpZHRoID0gd2lkdGg7XG5cdFx0Y2FudmFzLmhlaWdodCA9IGhlaWdodDtcblx0XHQvLyBTYXZlIGRpbWVuc2lvbnMuXG5cdFx0dGhpcy53aWR0aCA9IHdpZHRoO1xuXHRcdHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuXHR9O1xuXG5cdHByaXZhdGUgZHJhd1NldHVwKFxuXHRcdHByb2dyYW06IFdlYkdMUHJvZ3JhbSxcblx0XHRmdWxsc2NyZWVuUmVuZGVyOiBib29sZWFuLFxuXHRcdGlucHV0PzogKERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSlbXSB8IERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSxcblx0XHRvdXRwdXQ/OiBEYXRhTGF5ZXIsXG5cdCkge1xuXHRcdGNvbnN0IHsgZ2wgfSA9IHRoaXM7XG5cdFx0Ly8gQ2hlY2sgaWYgd2UgYXJlIGluIGFuIGVycm9yIHN0YXRlLlxuXHRcdGlmICghcHJvZ3JhbSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIENBVVRJT046IHRoZSBvcmRlciBvZiB0aGVzZSBuZXh0IGZldyBsaW5lcyBpcyBpbXBvcnRhbnQuXG5cblx0XHQvLyBHZXQgYSBzaGFsbG93IGNvcHkgb2YgY3VycmVudCB0ZXh0dXJlcy5cblx0XHQvLyBUaGlzIGxpbmUgbXVzdCBjb21lIGJlZm9yZSB0aGlzLnNldE91dHB1dCgpIGFzIGl0IGRlcGVuZHMgb24gY3VycmVudCBpbnRlcm5hbCBzdGF0ZS5cblx0XHRjb25zdCBpbnB1dFRleHR1cmVzOiBXZWJHTFRleHR1cmVbXSA9IFtdO1xuXHRcdGlmIChpbnB1dCkge1xuXHRcdFx0aWYgKGlucHV0LmNvbnN0cnVjdG9yID09PSBXZWJHTFRleHR1cmUpIHtcblx0XHRcdFx0aW5wdXRUZXh0dXJlcy5wdXNoKGlucHV0IGFzIFdlYkdMVGV4dHVyZSk7XG5cdFx0XHR9IGVsc2UgaWYgKGlucHV0LmNvbnN0cnVjdG9yID09PSBEYXRhTGF5ZXIpIHtcblx0XHRcdFx0aW5wdXRUZXh0dXJlcy5wdXNoKChpbnB1dCBhcyBEYXRhTGF5ZXIpLmdldEN1cnJlbnRTdGF0ZVRleHR1cmUoKSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IChpbnB1dCBhcyAoRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlKVtdKS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdGNvbnN0IGxheWVyID0gKGlucHV0IGFzIChEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUpW10pW2ldO1xuXHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHRpbnB1dFRleHR1cmVzLnB1c2goKGxheWVyIGFzIERhdGFMYXllcikuZ2V0Q3VycmVudFN0YXRlVGV4dHVyZSA/IChsYXllciBhcyBEYXRhTGF5ZXIpLmdldEN1cnJlbnRTdGF0ZVRleHR1cmUoKSA6IGxheWVyIGFzIFdlYkdMVGV4dHVyZSlcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIFNldCBvdXRwdXQgZnJhbWVidWZmZXIuXG5cdFx0Ly8gVGhpcyBtYXkgbW9kaWZ5IFdlYkdMIGludGVybmFsIHN0YXRlLlxuXHRcdHRoaXMuc2V0T3V0cHV0TGF5ZXIoZnVsbHNjcmVlblJlbmRlciwgaW5wdXQsIG91dHB1dCk7XG5cblx0XHQvLyBTZXQgY3VycmVudCBwcm9ncmFtLlxuXHRcdGdsLnVzZVByb2dyYW0ocHJvZ3JhbSk7XG5cblx0XHQvLyBTZXQgaW5wdXQgdGV4dHVyZXMuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBpbnB1dFRleHR1cmVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRnbC5hY3RpdmVUZXh0dXJlKGdsLlRFWFRVUkUwICsgaSk7XG5cdFx0XHRnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCBpbnB1dFRleHR1cmVzW2ldKTtcblx0XHR9XG5cdH1cblxuXHRjb3B5UHJvZ3JhbUZvclR5cGUodHlwZTogRGF0YUxheWVyVHlwZSkge1xuXHRcdHN3aXRjaCAodHlwZSkge1xuXHRcdFx0Y2FzZSBIQUxGX0ZMT0FUOlxuXHRcdFx0Y2FzZSBGTE9BVDpcblx0XHRcdFx0cmV0dXJuIHRoaXMuY29weUZsb2F0UHJvZ3JhbTtcblx0XHRcdGNhc2UgVU5TSUdORURfQllURTpcblx0XHRcdGNhc2UgVU5TSUdORURfU0hPUlQ6XG5cdFx0XHRjYXNlIFVOU0lHTkVEX0lOVDpcblx0XHRcdFx0cmV0dXJuIHRoaXMuY29weVVpbnRQcm9ncmFtO1xuXHRcdFx0Y2FzZSBCWVRFOlxuXHRcdFx0Y2FzZSBTSE9SVDpcblx0XHRcdGNhc2UgSU5UOlxuXHRcdFx0XHRyZXR1cm4gdGhpcy5jb3B5SW50UHJvZ3JhbTtcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB0eXBlOiAke3R5cGV9IHBhc3NlZCB0byBXZWJHTENvbXB1dGUuY29weVByb2dyYW1Gb3JUeXBlLmApO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgc2V0QmxlbmRNb2RlKHNob3VsZEJsZW5kQWxwaGE/OiBib29sZWFuKSB7XG5cdFx0Y29uc3QgeyBnbCB9ID0gdGhpcztcblx0XHRpZiAoc2hvdWxkQmxlbmRBbHBoYSkge1xuXHRcdFx0Z2wuZW5hYmxlKGdsLkJMRU5EKTtcblx0XHRcdGdsLmJsZW5kRnVuYyhnbC5TUkNfQUxQSEEsIGdsLk9ORV9NSU5VU19TUkNfQUxQSEEpO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgYWRkTGF5ZXJUb0lucHV0cyhcblx0XHRsYXllcjogRGF0YUxheWVyLFxuXHRcdGlucHV0PzogIChEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUpW10gfCBEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUsXG5cdCkge1xuXHRcdC8vIEFkZCBsYXllciB0byBlbmQgb2YgaW5wdXQgaWYgbmVlZGVkLlxuXHRcdGxldCBfaW5wdXRMYXllcnMgPSBpbnB1dDtcblx0XHRpZiAoaXNBcnJheShfaW5wdXRMYXllcnMpKSB7XG5cdFx0XHRjb25zdCBpbmRleCA9IChfaW5wdXRMYXllcnMgYXMgKERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSlbXSkuaW5kZXhPZihsYXllcik7XG5cdFx0XHRpZiAoaW5kZXggPCAwKSB7XG5cdFx0XHRcdChfaW5wdXRMYXllcnMgYXMgKERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSlbXSkucHVzaChsYXllcik7XG5cdFx0XHR9IFxuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoX2lucHV0TGF5ZXJzICE9PSBsYXllcikge1xuXHRcdFx0XHRjb25zdCBwcmV2aW91cyA9IF9pbnB1dExheWVycztcblx0XHRcdFx0X2lucHV0TGF5ZXJzID0gW107XG5cdFx0XHRcdGlmIChwcmV2aW91cykgKF9pbnB1dExheWVycyBhcyAoRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlKVtdKS5wdXNoKHByZXZpb3VzKTtcblx0XHRcdFx0KF9pbnB1dExheWVycyBhcyAoRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlKVtdKS5wdXNoKGxheWVyKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdF9pbnB1dExheWVycyA9IFtfaW5wdXRMYXllcnNdO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gX2lucHV0TGF5ZXJzIGFzIChEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUpW107XG5cdH1cblxuXHRwcml2YXRlIHBhc3NUaHJvdWdoTGF5ZXJEYXRhRnJvbUlucHV0VG9PdXRwdXQoc3RhdGU6IERhdGFMYXllcikge1xuXHRcdC8vIFRPRE86IGZpZ3VyZSBvdXQgdGhlIGZhc3Rlc3Qgd2F5IHRvIGNvcHkgYSB0ZXh0dXJlLlxuXHRcdGNvbnN0IGNvcHlQcm9ncmFtID0gdGhpcy5jb3B5UHJvZ3JhbUZvclR5cGUoc3RhdGUuaW50ZXJuYWxUeXBlKTtcblx0XHR0aGlzLnN0ZXAoe1xuXHRcdFx0cHJvZ3JhbTogY29weVByb2dyYW0sXG5cdFx0XHRpbnB1dDogc3RhdGUsXG5cdFx0XHRvdXRwdXQ6IHN0YXRlLFxuXHRcdH0pO1xuXHR9XG5cblx0cHJpdmF0ZSBzZXRPdXRwdXRMYXllcihcblx0XHRmdWxsc2NyZWVuUmVuZGVyOiBib29sZWFuLFxuXHRcdGlucHV0PzogKERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSlbXSB8IERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSxcblx0XHRvdXRwdXQ/OiBEYXRhTGF5ZXIsIC8vIFVuZGVmaW5lZCByZW5kZXJzIHRvIHNjcmVlbi5cblx0KSB7XG5cdFx0Y29uc3QgeyBnbCB9ID0gdGhpcztcblxuXHRcdC8vIFJlbmRlciB0byBzY3JlZW4uXG5cdFx0aWYgKCFvdXRwdXQpIHtcblx0XHRcdGdsLmJpbmRGcmFtZWJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgbnVsbCk7XG5cdFx0XHQvLyBSZXNpemUgdmlld3BvcnQuXG5cdFx0XHRjb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IHRoaXM7XG5cdFx0XHRnbC52aWV3cG9ydCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBDaGVjayBpZiBvdXRwdXQgaXMgc2FtZSBhcyBvbmUgb2YgaW5wdXQgbGF5ZXJzLlxuXHRcdGlmIChpbnB1dCAmJiAoKGlucHV0ID09PSBvdXRwdXQpIHx8IChpc0FycmF5KGlucHV0KSAmJiAoaW5wdXQgYXMgKERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSlbXSkuaW5kZXhPZihvdXRwdXQpID4gLTEpKSkge1xuXHRcdFx0aWYgKG91dHB1dC5udW1CdWZmZXJzID09PSAxKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignQ2Fubm90IHVzZSBzYW1lIGJ1ZmZlciBmb3IgaW5wdXQgYW5kIG91dHB1dCBvZiBhIHByb2dyYW0uIFRyeSBpbmNyZWFzaW5nIHRoZSBudW1iZXIgb2YgYnVmZmVycyBpbiB5b3VyIG91dHB1dCBsYXllciB0byBhdCBsZWFzdCAyIHNvIHlvdSBjYW4gcmVuZGVyIHRvIG5leHRTdGF0ZSB1c2luZyBjdXJyZW50U3RhdGUgYXMgYW4gaW5wdXQuJyk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoZnVsbHNjcmVlblJlbmRlcikge1xuXHRcdFx0XHQvLyBSZW5kZXIgYW5kIGluY3JlbWVudCBidWZmZXIgc28gd2UgYXJlIHJlbmRlcmluZyB0byBhIGRpZmZlcmVudCB0YXJnZXRcblx0XHRcdFx0Ly8gdGhhbiB0aGUgaW5wdXQgdGV4dHVyZS5cblx0XHRcdFx0b3V0cHV0Ll9iaW5kT3V0cHV0QnVmZmVyRm9yV3JpdGUodHJ1ZSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBQYXNzIGlucHV0IHRleHR1cmUgdGhyb3VnaCB0byBvdXRwdXQuXG5cdFx0XHRcdHRoaXMucGFzc1Rocm91Z2hMYXllckRhdGFGcm9tSW5wdXRUb091dHB1dChvdXRwdXQpO1xuXHRcdFx0XHQvLyBSZW5kZXIgdG8gb3V0cHV0IHdpdGhvdXQgaW5jcmVtZW50aW5nIGJ1ZmZlci5cblx0XHRcdFx0b3V0cHV0Ll9iaW5kT3V0cHV0QnVmZmVyRm9yV3JpdGUoZmFsc2UpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoZnVsbHNjcmVlblJlbmRlcikge1xuXHRcdFx0XHQvLyBSZW5kZXIgdG8gY3VycmVudCBidWZmZXIuXG5cdFx0XHRcdG91dHB1dC5fYmluZE91dHB1dEJ1ZmZlckZvcldyaXRlKGZhbHNlKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIElmIHdlIGFyZSBkb2luZyBhIHNuZWFreSB0aGluZyB3aXRoIGEgc3dhcHBlZCB0ZXh0dXJlIGFuZCBhcmVcblx0XHRcdFx0Ly8gb25seSByZW5kZXJpbmcgcGFydCBvZiB0aGUgc2NyZWVuLCB3ZSBtYXkgbmVlZCB0byBhZGQgYSBjb3B5IG9wZXJhdGlvbi5cblx0XHRcdFx0aWYgKG91dHB1dC5fdXNpbmdUZXh0dXJlT3ZlcnJpZGVGb3JDdXJyZW50QnVmZmVyKCkpIHtcblx0XHRcdFx0XHR0aGlzLnBhc3NUaHJvdWdoTGF5ZXJEYXRhRnJvbUlucHV0VG9PdXRwdXQob3V0cHV0KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRvdXRwdXQuX2JpbmRPdXRwdXRCdWZmZXJGb3JXcml0ZShmYWxzZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdFxuXHRcdC8vIFJlc2l6ZSB2aWV3cG9ydC5cblx0XHRjb25zdCBbIHdpZHRoLCBoZWlnaHQgXSA9IG91dHB1dC5nZXREaW1lbnNpb25zKCk7XG5cdFx0Z2wudmlld3BvcnQoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG5cdH07XG5cblx0cHJpdmF0ZSBzZXRQb3NpdGlvbkF0dHJpYnV0ZShwcm9ncmFtOiBXZWJHTFByb2dyYW0sIHByb2dyYW1OYW1lOiBzdHJpbmcpIHtcblx0XHR0aGlzLnNldFZlcnRleEF0dHJpYnV0ZShwcm9ncmFtLCAnYV9pbnRlcm5hbF9wb3NpdGlvbicsIDIsIHByb2dyYW1OYW1lKTtcblx0fVxuXG5cdHByaXZhdGUgc2V0SW5kZXhBdHRyaWJ1dGUocHJvZ3JhbTogV2ViR0xQcm9ncmFtLCBwcm9ncmFtTmFtZTogc3RyaW5nKSB7XG5cdFx0dGhpcy5zZXRWZXJ0ZXhBdHRyaWJ1dGUocHJvZ3JhbSwgJ2FfaW50ZXJuYWxfaW5kZXgnLCAxLCBwcm9ncmFtTmFtZSk7XG5cdH1cblxuXHRwcml2YXRlIHNldFVWQXR0cmlidXRlKHByb2dyYW06IFdlYkdMUHJvZ3JhbSwgcHJvZ3JhbU5hbWU6IHN0cmluZykge1xuXHRcdHRoaXMuc2V0VmVydGV4QXR0cmlidXRlKHByb2dyYW0sICdhX2ludGVybmFsX3V2JywgMiwgcHJvZ3JhbU5hbWUpO1xuXHR9XG5cblx0cHJpdmF0ZSBzZXRWZXJ0ZXhBdHRyaWJ1dGUocHJvZ3JhbTogV2ViR0xQcm9ncmFtLCBuYW1lOiBzdHJpbmcsIHNpemU6IG51bWJlciwgcHJvZ3JhbU5hbWU6IHN0cmluZykge1xuXHRcdGNvbnN0IHsgZ2wgfSA9IHRoaXM7XG5cdFx0Ly8gUG9pbnQgYXR0cmlidXRlIHRvIHRoZSBjdXJyZW50bHkgYm91bmQgVkJPLlxuXHRcdGNvbnN0IGxvY2F0aW9uID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24ocHJvZ3JhbSwgbmFtZSk7XG5cdFx0aWYgKGxvY2F0aW9uIDwgMCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gZmluZCB2ZXJ0ZXggYXR0cmlidXRlIFwiJHtuYW1lfVwiIGluIHByb2dyYW0gXCIke3Byb2dyYW1OYW1lfVwiLmApO1xuXHRcdH1cblx0XHQvLyBUT0RPOiBvbmx5IGZsb2F0IGlzIHN1cHBvcnRlZCBmb3IgdmVydGV4IGF0dHJpYnV0ZXMuXG5cdFx0Z2wudmVydGV4QXR0cmliUG9pbnRlcihsb2NhdGlvbiwgc2l6ZSwgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcblx0XHQvLyBFbmFibGUgdGhlIGF0dHJpYnV0ZS5cblx0XHRnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShsb2NhdGlvbik7XG5cdH1cblxuXHQvLyBTdGVwIGZvciBlbnRpcmUgZnVsbHNjcmVlbiBxdWFkLlxuXHRzdGVwKFxuXHRcdHBhcmFtczoge1xuXHRcdFx0cHJvZ3JhbTogR1BVUHJvZ3JhbSxcblx0XHRcdGlucHV0PzogIChEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUpW10gfCBEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUsXG5cdFx0XHRvdXRwdXQ/OiBEYXRhTGF5ZXIsIC8vIFVuZGVmaW5lZCByZW5kZXJzIHRvIHNjcmVlbi5cblx0XHRcdHNob3VsZEJsZW5kQWxwaGE/OiBib29sZWFuLFxuXHRcdH0sXG5cdCkge1xuXHRcdGNvbnN0IHsgZ2wsIGVycm9yU3RhdGUsIHF1YWRQb3NpdGlvbnNCdWZmZXIgfSA9IHRoaXM7XG5cdFx0Y29uc3QgeyBwcm9ncmFtLCBpbnB1dCwgb3V0cHV0IH0gPSBwYXJhbXM7XG5cblx0XHQvLyBJZ25vcmUgaWYgd2UgYXJlIGluIGVycm9yIHN0YXRlLlxuXHRcdGlmIChlcnJvclN0YXRlKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgZ2xQcm9ncmFtID0gcHJvZ3JhbS5kZWZhdWx0UHJvZ3JhbSE7XG5cblx0XHQvLyBEbyBzZXR1cCAtIHRoaXMgbXVzdCBjb21lIGZpcnN0LlxuXHRcdHRoaXMuZHJhd1NldHVwKGdsUHJvZ3JhbSwgdHJ1ZSwgaW5wdXQsIG91dHB1dCk7XG5cblx0XHQvLyBVcGRhdGUgdW5pZm9ybXMgYW5kIGJ1ZmZlcnMuXG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfc2NhbGUnLCBbMSwgMV0sIEZMT0FUKTtcblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF90cmFuc2xhdGlvbicsIFswLCAwXSwgRkxPQVQpO1xuXHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBxdWFkUG9zaXRpb25zQnVmZmVyKTtcblx0XHR0aGlzLnNldFBvc2l0aW9uQXR0cmlidXRlKGdsUHJvZ3JhbSwgcHJvZ3JhbS5uYW1lKTtcblxuXHRcdC8vIERyYXcuXG5cdFx0dGhpcy5zZXRCbGVuZE1vZGUocGFyYW1zLnNob3VsZEJsZW5kQWxwaGEpO1xuXHRcdGdsLmRyYXdBcnJheXMoZ2wuVFJJQU5HTEVfU1RSSVAsIDAsIDQpO1xuXHRcdGdsLmRpc2FibGUoZ2wuQkxFTkQpO1xuXHR9XG5cblx0Ly8gU3RlcCBwcm9ncmFtIG9ubHkgZm9yIGEgc3RyaXAgb2YgcHggYWxvbmcgdGhlIGJvdW5kYXJ5LlxuXHRzdGVwQm91bmRhcnkoXG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRwcm9ncmFtOiBHUFVQcm9ncmFtLFxuXHRcdFx0aW5wdXQ/OiAgKERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSlbXSB8IERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSxcblx0XHRcdG91dHB1dD86IERhdGFMYXllciwgLy8gVW5kZWZpbmVkIHJlbmRlcnMgdG8gc2NyZWVuLlxuXHRcdFx0c2luZ2xlRWRnZT86ICdMRUZUJyB8ICdSSUdIVCcgfCAnVE9QJyB8ICdCT1RUT00nO1xuXHRcdFx0c2hvdWxkQmxlbmRBbHBoYT86IGJvb2xlYW4sXG5cdFx0fSxcblx0KSB7XG5cdFx0Y29uc3QgeyBnbCwgZXJyb3JTdGF0ZSwgYm91bmRhcnlQb3NpdGlvbnNCdWZmZXJ9ID0gdGhpcztcblx0XHRjb25zdCB7IHByb2dyYW0sIGlucHV0LCBvdXRwdXQgfSA9IHBhcmFtcztcblx0XHRjb25zdCBbIHdpZHRoLCBoZWlnaHQgXSA9IG91dHB1dCA/IG91dHB1dC5nZXREaW1lbnNpb25zKCkgOiBbIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0IF07XG5cblx0XHQvLyBJZ25vcmUgaWYgd2UgYXJlIGluIGVycm9yIHN0YXRlLlxuXHRcdGlmIChlcnJvclN0YXRlKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgZ2xQcm9ncmFtID0gcHJvZ3JhbS5kZWZhdWx0UHJvZ3JhbSE7XG5cblx0XHQvLyBEbyBzZXR1cCAtIHRoaXMgbXVzdCBjb21lIGZpcnN0LlxuXHRcdHRoaXMuZHJhd1NldHVwKGdsUHJvZ3JhbSwgZmFsc2UsIGlucHV0LCBvdXRwdXQpO1xuXG5cdFx0Ly8gVXBkYXRlIHVuaWZvcm1zIGFuZCBidWZmZXJzLlxuXHRcdC8vIEZyYW1lIG5lZWRzIHRvIGJlIG9mZnNldCBhbmQgc2NhbGVkIHNvIHRoYXQgYWxsIGZvdXIgc2lkZXMgYXJlIGluIHZpZXdwb3J0LlxuXHRcdGNvbnN0IG9uZVB4ID0gWyAxIC8gd2lkdGgsIDEgLyBoZWlnaHRdIGFzIFtudW1iZXIsIG51bWJlcl07XG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfc2NhbGUnLCBbMSAtIG9uZVB4WzBdLCAxIC0gb25lUHhbMV1dLCBGTE9BVCk7XG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfdHJhbnNsYXRpb24nLCBvbmVQeCwgRkxPQVQpO1xuXHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBib3VuZGFyeVBvc2l0aW9uc0J1ZmZlcik7XG5cdFx0dGhpcy5zZXRQb3NpdGlvbkF0dHJpYnV0ZShnbFByb2dyYW0sIHByb2dyYW0ubmFtZSk7XG5cblx0XHQvLyBEcmF3LlxuXHRcdHRoaXMuc2V0QmxlbmRNb2RlKHBhcmFtcy5zaG91bGRCbGVuZEFscGhhKTtcblx0XHRpZiAocGFyYW1zLnNpbmdsZUVkZ2UpIHtcblx0XHRcdHN3aXRjaChwYXJhbXMuc2luZ2xlRWRnZSkge1xuXHRcdFx0XHRjYXNlICdMRUZUJzpcblx0XHRcdFx0XHRnbC5kcmF3QXJyYXlzKGdsLkxJTkVTLCAzLCAyKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAnUklHSFQnOlxuXHRcdFx0XHRcdGdsLmRyYXdBcnJheXMoZ2wuTElORVMsIDEsIDIpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICdUT1AnOlxuXHRcdFx0XHRcdGdsLmRyYXdBcnJheXMoZ2wuTElORVMsIDIsIDIpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICdCT1RUT00nOlxuXHRcdFx0XHRcdGdsLmRyYXdBcnJheXMoZ2wuTElORVMsIDAsIDIpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5rbm93biBib3VuZGFyeSBlZGdlIHR5cGU6ICR7cGFyYW1zLnNpbmdsZUVkZ2V9LmApO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRnbC5kcmF3QXJyYXlzKGdsLkxJTkVfTE9PUCwgMCwgNCk7XG5cdFx0fVxuXHRcdGdsLmRpc2FibGUoZ2wuQkxFTkQpO1xuXHR9XG5cblx0Ly8gU3RlcCBwcm9ncmFtIGZvciBhbGwgYnV0IGEgc3RyaXAgb2YgcHggYWxvbmcgdGhlIGJvdW5kYXJ5LlxuXHRzdGVwTm9uQm91bmRhcnkoXG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRwcm9ncmFtOiBHUFVQcm9ncmFtLFxuXHRcdFx0aW5wdXQ/OiAgKERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSlbXSB8IERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSxcblx0XHRcdG91dHB1dD86IERhdGFMYXllciwgLy8gVW5kZWZpbmVkIHJlbmRlcnMgdG8gc2NyZWVuLlxuXHRcdFx0c2hvdWxkQmxlbmRBbHBoYT86IGJvb2xlYW4sXG5cdFx0fSxcblx0KSB7XG5cdFx0Y29uc3QgeyBnbCwgZXJyb3JTdGF0ZSwgcXVhZFBvc2l0aW9uc0J1ZmZlciB9ID0gdGhpcztcblx0XHRjb25zdCB7IHByb2dyYW0sIGlucHV0LCBvdXRwdXQgfSA9IHBhcmFtcztcblx0XHRjb25zdCBbIHdpZHRoLCBoZWlnaHQgXSA9IG91dHB1dCA/IG91dHB1dC5nZXREaW1lbnNpb25zKCkgOiBbIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0IF07XG5cblx0XHQvLyBJZ25vcmUgaWYgd2UgYXJlIGluIGVycm9yIHN0YXRlLlxuXHRcdGlmIChlcnJvclN0YXRlKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgZ2xQcm9ncmFtID0gcHJvZ3JhbS5kZWZhdWx0UHJvZ3JhbSE7XG5cblx0XHQvLyBEbyBzZXR1cCAtIHRoaXMgbXVzdCBjb21lIGZpcnN0LlxuXHRcdHRoaXMuZHJhd1NldHVwKGdsUHJvZ3JhbSwgZmFsc2UsIGlucHV0LCBvdXRwdXQpO1xuXG5cdFx0Ly8gVXBkYXRlIHVuaWZvcm1zIGFuZCBidWZmZXJzLlxuXHRcdGNvbnN0IG9uZVB4ID0gWyAxIC8gd2lkdGgsIDEgLyBoZWlnaHRdIGFzIFtudW1iZXIsIG51bWJlcl07XG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfc2NhbGUnLCBbMSAtIDIgKiBvbmVQeFswXSwgMSAtIDIgKiBvbmVQeFsxXV0sIEZMT0FUKTtcblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF90cmFuc2xhdGlvbicsIG9uZVB4LCBGTE9BVCk7XG5cdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHF1YWRQb3NpdGlvbnNCdWZmZXIpO1xuXHRcdHRoaXMuc2V0UG9zaXRpb25BdHRyaWJ1dGUoZ2xQcm9ncmFtLCBwcm9ncmFtLm5hbWUpO1xuXHRcdFxuXHRcdC8vIERyYXcuXG5cdFx0dGhpcy5zZXRCbGVuZE1vZGUocGFyYW1zLnNob3VsZEJsZW5kQWxwaGEpO1xuXHRcdGdsLmRyYXdBcnJheXMoZ2wuVFJJQU5HTEVfU1RSSVAsIDAsIDQpO1xuXHRcdGdsLmRpc2FibGUoZ2wuQkxFTkQpO1xuXHR9XG5cblx0Ly8gU3RlcCBwcm9ncmFtIG9ubHkgZm9yIGEgY2lyY3VsYXIgc3BvdC5cblx0c3RlcENpcmNsZShcblx0XHRwYXJhbXM6IHtcblx0XHRcdHByb2dyYW06IEdQVVByb2dyYW0sXG5cdFx0XHRwb3NpdGlvbjogW251bWJlciwgbnVtYmVyXSwgLy8gUG9zaXRpb24gaXMgaW4gc2NyZWVuIHNwYWNlIGNvb3Jkcy5cblx0XHRcdHJhZGl1czogbnVtYmVyLCAvLyBSYWRpdXMgaXMgaW4gc2NyZWVuIHNwYWNlIHVuaXRzLlxuXHRcdFx0aW5wdXQ/OiAgKERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSlbXSB8IERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSxcblx0XHRcdG91dHB1dD86IERhdGFMYXllciwgLy8gVW5kZWZpbmVkIHJlbmRlcnMgdG8gc2NyZWVuLlxuXHRcdFx0bnVtU2VnbWVudHM/OiBudW1iZXIsXG5cdFx0XHRzaG91bGRCbGVuZEFscGhhPzogYm9vbGVhbixcblx0XHR9LFxuXHQpIHtcblx0XHRjb25zdCB7IGdsLCBlcnJvclN0YXRlLCB3aWR0aCwgaGVpZ2h0IH0gPSB0aGlzO1xuXHRcdGNvbnN0IHsgcHJvZ3JhbSwgcG9zaXRpb24sIHJhZGl1cywgaW5wdXQsIG91dHB1dCB9ID0gcGFyYW1zO1xuXG5cdFx0Ly8gSWdub3JlIGlmIHdlIGFyZSBpbiBlcnJvciBzdGF0ZS5cblx0XHRpZiAoZXJyb3JTdGF0ZSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGdsUHJvZ3JhbSA9IHByb2dyYW0uZGVmYXVsdFByb2dyYW0hO1xuXG5cdFx0Ly8gRG8gc2V0dXAgLSB0aGlzIG11c3QgY29tZSBmaXJzdC5cblx0XHR0aGlzLmRyYXdTZXR1cChnbFByb2dyYW0sIGZhbHNlLCBpbnB1dCwgb3V0cHV0KTtcblxuXHRcdC8vIFVwZGF0ZSB1bmlmb3JtcyBhbmQgYnVmZmVycy5cblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF9zY2FsZScsIFtyYWRpdXMgKiAyIC8gd2lkdGgsIHJhZGl1cyAqIDIgLyBoZWlnaHRdLCBGTE9BVCk7XG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfdHJhbnNsYXRpb24nLCBbMiAqIHBvc2l0aW9uWzBdIC8gd2lkdGggLSAxLCAyICogcG9zaXRpb25bMV0gLyBoZWlnaHQgLSAxXSwgRkxPQVQpO1xuXHRcdGNvbnN0IG51bVNlZ21lbnRzID0gcGFyYW1zLm51bVNlZ21lbnRzID8gcGFyYW1zLm51bVNlZ21lbnRzIDogREVGQVVMVF9DSVJDTEVfTlVNX1NFR01FTlRTO1xuXHRcdGlmIChudW1TZWdtZW50cyA8IDMpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgbnVtU2VnbWVudHMgZm9yIFdlYkdMQ29tcHV0ZS5zdGVwQ2lyY2xlIG11c3QgYmUgZ3JlYXRlciB0aGFuIDIsIGdvdCAke251bVNlZ21lbnRzfS5gKTtcblx0XHR9XG5cdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHRoaXMuZ2V0Q2lyY2xlUG9zaXRpb25zQnVmZmVyKG51bVNlZ21lbnRzKSk7XG5cdFx0dGhpcy5zZXRQb3NpdGlvbkF0dHJpYnV0ZShnbFByb2dyYW0sIHByb2dyYW0ubmFtZSk7XG5cdFx0XG5cdFx0Ly8gRHJhdy5cblx0XHR0aGlzLnNldEJsZW5kTW9kZShwYXJhbXMuc2hvdWxkQmxlbmRBbHBoYSk7XG5cdFx0Z2wuZHJhd0FycmF5cyhnbC5UUklBTkdMRV9GQU4sIDAsIG51bVNlZ21lbnRzICsgMik7XHRcblx0XHRnbC5kaXNhYmxlKGdsLkJMRU5EKTtcblx0fVxuXG5cdC8vIFN0ZXAgcHJvZ3JhbSBvbmx5IGZvciBhIHRoaWNrZW5lZCBsaW5lIHNlZ21lbnQgKHJvdW5kZWQgZW5kIGNhcHMgYXZhaWxhYmxlKS5cblx0c3RlcFNlZ21lbnQoXG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRwcm9ncmFtOiBHUFVQcm9ncmFtLFxuXHRcdFx0cG9zaXRpb24xOiBbbnVtYmVyLCBudW1iZXJdLCAvLyBQb3NpdGlvbiBpcyBpbiBzY3JlZW4gc3BhY2UgY29vcmRzLlxuXHRcdFx0cG9zaXRpb24yOiBbbnVtYmVyLCBudW1iZXJdLCAvLyBQb3NpdGlvbiBpcyBpbiBzY3JlZW4gc3BhY2UgY29vcmRzLlxuXHRcdFx0dGhpY2tuZXNzOiBudW1iZXIsIC8vIFRoaWNrbmVzcyBpcyBpbiBweC5cblx0XHRcdGlucHV0PzogIChEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUpW10gfCBEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUsXG5cdFx0XHRvdXRwdXQ/OiBEYXRhTGF5ZXIsIC8vIFVuZGVmaW5lZCByZW5kZXJzIHRvIHNjcmVlbi5cblx0XHRcdGVuZENhcHM/OiBib29sZWFuLFxuXHRcdFx0bnVtQ2FwU2VnbWVudHM/OiBudW1iZXIsXG5cdFx0XHRzaG91bGRCbGVuZEFscGhhPzogYm9vbGVhbixcblx0XHR9LFxuXHQpIHtcblx0XHRjb25zdCB7IGdsLCBlcnJvclN0YXRlIH0gPSB0aGlzO1xuXHRcdGNvbnN0IHsgcHJvZ3JhbSwgcG9zaXRpb24xLCBwb3NpdGlvbjIsIHRoaWNrbmVzcywgaW5wdXQsIG91dHB1dCB9ID0gcGFyYW1zO1xuXHRcdGNvbnN0IFsgd2lkdGgsIGhlaWdodCBdID0gb3V0cHV0ID8gb3V0cHV0LmdldERpbWVuc2lvbnMoKSA6IFsgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQgXTtcblxuXHRcdC8vIElnbm9yZSBpZiB3ZSBhcmUgaW4gZXJyb3Igc3RhdGUuXG5cdFx0aWYgKGVycm9yU3RhdGUpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBnbFByb2dyYW0gPSBwcm9ncmFtLnNlZ21lbnRQcm9ncmFtITtcblxuXHRcdC8vIERvIHNldHVwIC0gdGhpcyBtdXN0IGNvbWUgZmlyc3QuXG5cdFx0dGhpcy5kcmF3U2V0dXAoZ2xQcm9ncmFtLCBmYWxzZSwgaW5wdXQsIG91dHB1dCk7XG5cblx0XHQvLyBVcGRhdGUgdW5pZm9ybXMgYW5kIGJ1ZmZlcnMuXG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfaGFsZlRoaWNrbmVzcycsIHRoaWNrbmVzcyAvIDIsIEZMT0FUKTtcblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF9zY2FsZScsIFsyIC8gd2lkdGgsIDIgLyBoZWlnaHRdLCBGTE9BVCk7XG5cdFx0Y29uc3QgZGlmZlggPSBwb3NpdGlvbjFbMF0gLSBwb3NpdGlvbjJbMF07XG5cdFx0Y29uc3QgZGlmZlkgPSBwb3NpdGlvbjFbMV0gLSBwb3NpdGlvbjJbMV07XG5cdFx0Y29uc3QgYW5nbGUgPSBNYXRoLmF0YW4yKGRpZmZZLCBkaWZmWCk7XG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfcm90YXRpb24nLCBhbmdsZSwgRkxPQVQpO1xuXHRcdGNvbnN0IGNlbnRlclggPSAocG9zaXRpb24xWzBdICsgcG9zaXRpb24yWzBdKSAvIDI7XG5cdFx0Y29uc3QgY2VudGVyWSA9IChwb3NpdGlvbjFbMV0gKyBwb3NpdGlvbjJbMV0pIC8gMjtcblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF90cmFuc2xhdGlvbicsIFsyICogY2VudGVyWCAvIHRoaXMud2lkdGggLSAxLCAyICogY2VudGVyWSAvIHRoaXMuaGVpZ2h0IC0gMV0sIEZMT0FUKTtcblx0XHRjb25zdCBsZW5ndGggPSBNYXRoLnNxcnQoZGlmZlggKiBkaWZmWCArIGRpZmZZICogZGlmZlkpO1xuXHRcdFxuXHRcdGNvbnN0IG51bVNlZ21lbnRzID0gcGFyYW1zLm51bUNhcFNlZ21lbnRzID8gcGFyYW1zLm51bUNhcFNlZ21lbnRzICogMiA6IERFRkFVTFRfQ0lSQ0xFX05VTV9TRUdNRU5UUztcblx0XHRpZiAocGFyYW1zLmVuZENhcHMpIHtcblx0XHRcdGlmIChudW1TZWdtZW50cyA8IDYgfHwgbnVtU2VnbWVudHMgJSA2ICE9PSAwKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgbnVtU2VnbWVudHMgZm9yIFdlYkdMQ29tcHV0ZS5zdGVwU2VnbWVudCBtdXN0IGJlIGRpdmlzaWJsZSBieSA2LCBnb3QgJHtudW1TZWdtZW50c30uYCk7XG5cdFx0XHR9XG5cdFx0XHQvLyBIYXZlIHRvIHN1YnRyYWN0IGEgc21hbGwgb2Zmc2V0IGZyb20gbGVuZ3RoLlxuXHRcdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfbGVuZ3RoJywgbGVuZ3RoIC0gdGhpY2tuZXNzICogTWF0aC5zaW4oTWF0aC5QSSAvIG51bVNlZ21lbnRzKSwgRkxPQVQpO1xuXHRcdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHRoaXMuZ2V0Q2lyY2xlUG9zaXRpb25zQnVmZmVyKG51bVNlZ21lbnRzKSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIEhhdmUgdG8gc3VidHJhY3QgYSBzbWFsbCBvZmZzZXQgZnJvbSBsZW5ndGguXG5cdFx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF9sZW5ndGgnLCBsZW5ndGggLSB0aGlja25lc3MsIEZMT0FUKTtcblx0XHRcdC8vIFVzZSBhIHJlY3RhbmdsZSBpbiBjYXNlIG9mIG5vIGNhcHMuXG5cdFx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdGhpcy5xdWFkUG9zaXRpb25zQnVmZmVyKTtcblx0XHR9XG5cblx0XHR0aGlzLnNldFBvc2l0aW9uQXR0cmlidXRlKGdsUHJvZ3JhbSwgcHJvZ3JhbS5uYW1lKTtcblx0XHRcblx0XHQvLyBEcmF3LlxuXHRcdHRoaXMuc2V0QmxlbmRNb2RlKHBhcmFtcy5zaG91bGRCbGVuZEFscGhhKTtcblx0XHRpZiAocGFyYW1zLmVuZENhcHMpIHtcblx0XHRcdGdsLmRyYXdBcnJheXMoZ2wuVFJJQU5HTEVfRkFOLCAwLCBudW1TZWdtZW50cyArIDIpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRnbC5kcmF3QXJyYXlzKGdsLlRSSUFOR0xFX1NUUklQLCAwLCA0KTtcblx0XHR9XG5cdFx0Z2wuZGlzYWJsZShnbC5CTEVORCk7XG5cdH1cblxuXHRzdGVwUG9seWxpbmUoXG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRwcm9ncmFtOiBHUFVQcm9ncmFtLFxuXHRcdFx0cG9zaXRpb25zOiBbbnVtYmVyLCBudW1iZXJdW10sXG5cdFx0XHR0aGlja25lc3M6IG51bWJlciwgLy8gVGhpY2tuZXNzIG9mIGxpbmUgaXMgaW4gcHguXG5cdFx0XHRpbnB1dD86IChEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUpW10gfCBEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUsXG5cdFx0XHRvdXRwdXQ/OiBEYXRhTGF5ZXIsIC8vIFVuZGVmaW5lZCByZW5kZXJzIHRvIHNjcmVlbi5cblx0XHRcdGNsb3NlTG9vcD86IGJvb2xlYW4sXG5cdFx0XHRpbmNsdWRlVVZzPzogYm9vbGVhbixcblx0XHRcdGluY2x1ZGVOb3JtYWxzPzogYm9vbGVhbixcblx0XHRcdHNob3VsZEJsZW5kQWxwaGE/OiBib29sZWFuLFxuXHRcdH0sXG5cdCkge1xuXHRcdGNvbnN0IHsgcHJvZ3JhbSwgaW5wdXQsIG91dHB1dCB9ID0gcGFyYW1zO1xuXHRcdGNvbnN0IHZlcnRpY2VzID0gcGFyYW1zLnBvc2l0aW9ucztcblx0XHRjb25zdCBjbG9zZUxvb3AgPSAhIXBhcmFtcy5jbG9zZUxvb3A7XG5cdFx0XG5cdFx0Y29uc3QgeyBnbCwgd2lkdGgsIGhlaWdodCwgZXJyb3JTdGF0ZSB9ID0gdGhpcztcblxuXHRcdC8vIElnbm9yZSBpZiB3ZSBhcmUgaW4gZXJyb3Igc3RhdGUuXG5cdFx0aWYgKGVycm9yU3RhdGUpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBPZmZzZXQgdmVydGljZXMuXG5cdFx0Y29uc3QgaGFsZlRoaWNrbmVzcyA9IHBhcmFtcy50aGlja25lc3MgLyAyO1xuXHRcdGNvbnN0IG51bVBvc2l0aW9ucyA9IGNsb3NlTG9vcCA/IHZlcnRpY2VzLmxlbmd0aCAqIDQgKyAyIDogKHZlcnRpY2VzLmxlbmd0aCAtIDEpICogNDtcblx0XHRjb25zdCBwb3NpdGlvbnMgPSBuZXcgRmxvYXQzMkFycmF5KDIgKiBudW1Qb3NpdGlvbnMpO1xuXHRcdGNvbnN0IHV2cyA9IHBhcmFtcy5pbmNsdWRlVVZzID8gbmV3IEZsb2F0MzJBcnJheSgyICogbnVtUG9zaXRpb25zKSA6IHVuZGVmaW5lZDtcblx0XHRjb25zdCBub3JtYWxzID0gcGFyYW1zLmluY2x1ZGVOb3JtYWxzID8gbmV3IEZsb2F0MzJBcnJheSgyICogbnVtUG9zaXRpb25zKSA6IHVuZGVmaW5lZDtcblxuXHRcdC8vIHRtcCBhcnJheXMuXG5cdFx0Y29uc3QgczEgPSBbMCwgMF07XG5cdFx0Y29uc3QgczIgPSBbMCwgMF07XG5cdFx0Y29uc3QgbjEgPSBbMCwgMF07XG5cdFx0Y29uc3QgbjIgPSBbMCwgMF07XG5cdFx0Y29uc3QgbjMgPSBbMCwgMF07XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB2ZXJ0aWNlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0aWYgKCFjbG9zZUxvb3AgJiYgaSA9PT0gdmVydGljZXMubGVuZ3RoIC0gMSkgY29udGludWU7XG5cdFx0XHQvLyBWZXJ0aWNlcyBvbiB0aGlzIHNlZ21lbnQuXG5cdFx0XHRjb25zdCB2MSA9IHZlcnRpY2VzW2ldO1xuXHRcdFx0Y29uc3QgdjIgPSB2ZXJ0aWNlc1soaSArIDEpICUgdmVydGljZXMubGVuZ3RoXTtcblx0XHRcdHMxWzBdID0gdjJbMF0gLSB2MVswXTtcblx0XHRcdHMxWzFdID0gdjJbMV0gLSB2MVsxXTtcblx0XHRcdGNvbnN0IGxlbmd0aDEgPSBNYXRoLnNxcnQoczFbMF0gKiBzMVswXSArIHMxWzFdICogczFbMV0pO1xuXHRcdFx0bjFbMF0gPSBzMVsxXSAvIGxlbmd0aDE7XG5cdFx0XHRuMVsxXSA9IC0gczFbMF0gLyBsZW5ndGgxO1xuXG5cdFx0XHRjb25zdCBpbmRleCA9IGkgKiA0ICsgMjtcblxuXHRcdFx0aWYgKCFjbG9zZUxvb3AgJiYgaSA9PT0gMCkge1xuXHRcdFx0XHQvLyBBZGQgc3RhcnRpbmcgcG9pbnRzIHRvIHBvc2l0aW9ucyBhcnJheS5cblx0XHRcdFx0cG9zaXRpb25zWzBdID0gdjFbMF0gKyBuMVswXSAqIGhhbGZUaGlja25lc3M7XG5cdFx0XHRcdHBvc2l0aW9uc1sxXSA9IHYxWzFdICsgbjFbMV0gKiBoYWxmVGhpY2tuZXNzO1xuXHRcdFx0XHRwb3NpdGlvbnNbMl0gPSB2MVswXSAtIG4xWzBdICogaGFsZlRoaWNrbmVzcztcblx0XHRcdFx0cG9zaXRpb25zWzNdID0gdjFbMV0gLSBuMVsxXSAqIGhhbGZUaGlja25lc3M7XG5cdFx0XHRcdGlmICh1dnMpIHtcblx0XHRcdFx0XHR1dnNbMF0gPSAwO1xuXHRcdFx0XHRcdHV2c1sxXSA9IDE7XG5cdFx0XHRcdFx0dXZzWzJdID0gMDtcblx0XHRcdFx0XHR1dnNbM10gPSAwO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChub3JtYWxzKSB7XG5cdFx0XHRcdFx0bm9ybWFsc1swXSA9IG4xWzBdO1xuXHRcdFx0XHRcdG5vcm1hbHNbMV0gPSBuMVsxXTtcblx0XHRcdFx0XHRub3JtYWxzWzJdID0gbjFbMF07XG5cdFx0XHRcdFx0bm9ybWFsc1szXSA9IG4xWzFdO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHUgPSAoaSArIDEpIC8gKHZlcnRpY2VzLmxlbmd0aCAtIDEpO1xuXG5cdFx0XHQvLyBPZmZzZXQgZnJvbSB2Mi5cblx0XHRcdHBvc2l0aW9uc1syICogaW5kZXhdID0gdjJbMF0gKyBuMVswXSAqIGhhbGZUaGlja25lc3M7XG5cdFx0XHRwb3NpdGlvbnNbMiAqIGluZGV4ICsgMV0gPSB2MlsxXSArIG4xWzFdICogaGFsZlRoaWNrbmVzcztcblx0XHRcdHBvc2l0aW9uc1syICogaW5kZXggKyAyXSA9IHYyWzBdIC0gbjFbMF0gKiBoYWxmVGhpY2tuZXNzO1xuXHRcdFx0cG9zaXRpb25zWzIgKiBpbmRleCArIDNdID0gdjJbMV0gLSBuMVsxXSAqIGhhbGZUaGlja25lc3M7XG5cdFx0XHRpZiAodXZzKSB7XG5cdFx0XHRcdHV2c1syICogaW5kZXhdID0gdTtcblx0XHRcdFx0dXZzWzIgKiBpbmRleCArIDFdID0gMTtcblx0XHRcdFx0dXZzWzIgKiBpbmRleCArIDJdID0gdTtcblx0XHRcdFx0dXZzWzIgKiBpbmRleCArIDNdID0gMDtcblx0XHRcdH1cblx0XHRcdGlmIChub3JtYWxzKSB7XG5cdFx0XHRcdG5vcm1hbHNbMiAqIGluZGV4XSA9IG4xWzBdO1xuXHRcdFx0XHRub3JtYWxzWzIgKiBpbmRleCArIDFdID0gbjFbMV07XG5cdFx0XHRcdG5vcm1hbHNbMiAqIGluZGV4ICsgMl0gPSBuMVswXTtcblx0XHRcdFx0bm9ybWFsc1syICogaW5kZXggKyAzXSA9IG4xWzFdO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoKGkgPCB2ZXJ0aWNlcy5sZW5ndGggLSAyKSB8fCBjbG9zZUxvb3ApIHtcblx0XHRcdFx0Ly8gVmVydGljZXMgb24gbmV4dCBzZWdtZW50LlxuXHRcdFx0XHRjb25zdCB2MyA9IHZlcnRpY2VzWyhpICsgMSkgJSB2ZXJ0aWNlcy5sZW5ndGhdO1xuXHRcdFx0XHRjb25zdCB2NCA9IHZlcnRpY2VzWyhpICsgMikgJSB2ZXJ0aWNlcy5sZW5ndGhdO1xuXHRcdFx0XHRzMlswXSA9IHY0WzBdIC0gdjNbMF07XG5cdFx0XHRcdHMyWzFdID0gdjRbMV0gLSB2M1sxXTtcblx0XHRcdFx0Y29uc3QgbGVuZ3RoMiA9IE1hdGguc3FydChzMlswXSAqIHMyWzBdICsgczJbMV0gKiBzMlsxXSk7XG5cdFx0XHRcdG4yWzBdID0gczJbMV0gLyBsZW5ndGgyO1xuXHRcdFx0XHRuMlsxXSA9IC0gczJbMF0gLyBsZW5ndGgyO1xuXG5cdFx0XHRcdC8vIE9mZnNldCBmcm9tIHYzXG5cdFx0XHRcdHBvc2l0aW9uc1syICogKChpbmRleCArIDIpICUgKDQgKiB2ZXJ0aWNlcy5sZW5ndGgpKV0gPSB2M1swXSArIG4yWzBdICogaGFsZlRoaWNrbmVzcztcblx0XHRcdFx0cG9zaXRpb25zWzIgKiAoKGluZGV4ICsgMikgJSAoNCAqIHZlcnRpY2VzLmxlbmd0aCkpICsgMV0gPSB2M1sxXSArIG4yWzFdICogaGFsZlRoaWNrbmVzcztcblx0XHRcdFx0cG9zaXRpb25zWzIgKiAoKGluZGV4ICsgMikgJSAoNCAqIHZlcnRpY2VzLmxlbmd0aCkpICsgMl0gPSB2M1swXSAtIG4yWzBdICogaGFsZlRoaWNrbmVzcztcblx0XHRcdFx0cG9zaXRpb25zWzIgKiAoKGluZGV4ICsgMikgJSAoNCAqIHZlcnRpY2VzLmxlbmd0aCkpICsgM10gPSB2M1sxXSAtIG4yWzFdICogaGFsZlRoaWNrbmVzcztcblx0XHRcdFx0aWYgKHV2cykge1xuXHRcdFx0XHRcdHV2c1syICogKChpbmRleCArIDIpICUgKDQgKiB2ZXJ0aWNlcy5sZW5ndGgpKV0gPSB1O1xuXHRcdFx0XHRcdHV2c1syICogKChpbmRleCArIDIpICUgKDQgKiB2ZXJ0aWNlcy5sZW5ndGgpKSArIDFdID0gMTtcblx0XHRcdFx0XHR1dnNbMiAqICgoaW5kZXggKyAyKSAlICg0ICogdmVydGljZXMubGVuZ3RoKSkgKyAyXSA9IHU7XG5cdFx0XHRcdFx0dXZzWzIgKiAoKGluZGV4ICsgMikgJSAoNCAqIHZlcnRpY2VzLmxlbmd0aCkpICsgM10gPSAwO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChub3JtYWxzKSB7XG5cdFx0XHRcdFx0bm9ybWFsc1syICogKChpbmRleCArIDIpICUgKDQgKiB2ZXJ0aWNlcy5sZW5ndGgpKV0gPSBuMlswXTtcblx0XHRcdFx0XHRub3JtYWxzWzIgKiAoKGluZGV4ICsgMikgJSAoNCAqIHZlcnRpY2VzLmxlbmd0aCkpICsgMV0gPSBuMlsxXTtcblx0XHRcdFx0XHRub3JtYWxzWzIgKiAoKGluZGV4ICsgMikgJSAoNCAqIHZlcnRpY2VzLmxlbmd0aCkpICsgMl0gPSBuMlswXTtcblx0XHRcdFx0XHRub3JtYWxzWzIgKiAoKGluZGV4ICsgMikgJSAoNCAqIHZlcnRpY2VzLmxlbmd0aCkpICsgM10gPSBuMlsxXTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIENoZWNrIHRoZSBhbmdsZSBiZXR3ZWVuIGFkamFjZW50IHNlZ21lbnRzLlxuXHRcdFx0XHRjb25zdCBjcm9zcyA9IG4xWzBdICogbjJbMV0gLSBuMVsxXSAqIG4yWzBdO1xuXHRcdFx0XHRpZiAoTWF0aC5hYnMoY3Jvc3MpIDwgMWUtNikgY29udGludWU7XG5cdFx0XHRcdG4zWzBdID0gbjFbMF0gKyBuMlswXTtcblx0XHRcdFx0bjNbMV0gPSBuMVsxXSArIG4yWzFdO1xuXHRcdFx0XHRjb25zdCBsZW5ndGgzID0gTWF0aC5zcXJ0KG4zWzBdICogbjNbMF0gKyBuM1sxXSAqIG4zWzFdKTtcblx0XHRcdFx0bjNbMF0gLz0gbGVuZ3RoMztcblx0XHRcdFx0bjNbMV0gLz0gbGVuZ3RoMztcblx0XHRcdFx0Ly8gTWFrZSBhZGp1c3RtZW50cyB0byBwb3NpdGlvbnMuXG5cdFx0XHRcdGNvbnN0IGFuZ2xlID0gTWF0aC5hY29zKG4xWzBdICogbjJbMF0gKyBuMVsxXSAqIG4yWzFdKTtcblx0XHRcdFx0Y29uc3Qgb2Zmc2V0ID0gaGFsZlRoaWNrbmVzcyAvIE1hdGguY29zKGFuZ2xlIC8gMik7XG5cdFx0XHRcdGlmIChjcm9zcyA8IDApIHtcblx0XHRcdFx0XHRwb3NpdGlvbnNbMiAqIGluZGV4XSA9IHYyWzBdICsgbjNbMF0gKiBvZmZzZXQ7XG5cdFx0XHRcdFx0cG9zaXRpb25zWzIgKiBpbmRleCArIDFdID0gdjJbMV0gKyBuM1sxXSAqIG9mZnNldDtcblx0XHRcdFx0XHRwb3NpdGlvbnNbMiAqICgoaW5kZXggKyAyKSAlICg0ICogdmVydGljZXMubGVuZ3RoKSldID0gcG9zaXRpb25zWzIgKiBpbmRleF07XG5cdFx0XHRcdFx0cG9zaXRpb25zWzIgKiAoKGluZGV4ICsgMikgJSAoNCAqIHZlcnRpY2VzLmxlbmd0aCkpICsgMV0gPSBwb3NpdGlvbnNbMiAqIGluZGV4ICsgMV07XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cG9zaXRpb25zWzIgKiBpbmRleCArIDJdID0gdjJbMF0gLSBuM1swXSAqIG9mZnNldDtcblx0XHRcdFx0XHRwb3NpdGlvbnNbMiAqIGluZGV4ICsgM10gPSB2MlsxXSAtIG4zWzFdICogb2Zmc2V0O1xuXHRcdFx0XHRcdHBvc2l0aW9uc1syICogKChpbmRleCArIDIpICUgKDQgKiB2ZXJ0aWNlcy5sZW5ndGgpKSArIDJdID0gcG9zaXRpb25zWzIgKiBpbmRleCArIDJdO1xuXHRcdFx0XHRcdHBvc2l0aW9uc1syICogKChpbmRleCArIDIpICUgKDQgKiB2ZXJ0aWNlcy5sZW5ndGgpKSArIDNdID0gcG9zaXRpb25zWzIgKiBpbmRleCArIDNdO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmIChjbG9zZUxvb3ApIHtcblx0XHRcdC8vIER1cGxpY2F0ZSBzdGFydGluZyBwb2ludHMgdG8gZW5kIG9mIHBvc2l0aW9ucyBhcnJheS5cblx0XHRcdHBvc2l0aW9uc1t2ZXJ0aWNlcy5sZW5ndGggKiA4XSA9IHBvc2l0aW9uc1swXTtcblx0XHRcdHBvc2l0aW9uc1t2ZXJ0aWNlcy5sZW5ndGggKiA4ICsgMV0gPSBwb3NpdGlvbnNbMV07XG5cdFx0XHRwb3NpdGlvbnNbdmVydGljZXMubGVuZ3RoICogOCArIDJdID0gcG9zaXRpb25zWzJdO1xuXHRcdFx0cG9zaXRpb25zW3ZlcnRpY2VzLmxlbmd0aCAqIDggKyAzXSA9IHBvc2l0aW9uc1szXTtcblx0XHRcdGlmICh1dnMpIHtcblx0XHRcdFx0dXZzW3ZlcnRpY2VzLmxlbmd0aCAqIDhdID0gdXZzWzBdO1xuXHRcdFx0XHR1dnNbdmVydGljZXMubGVuZ3RoICogOCArIDFdID0gdXZzWzFdO1xuXHRcdFx0XHR1dnNbdmVydGljZXMubGVuZ3RoICogOCArIDJdID0gdXZzWzJdO1xuXHRcdFx0XHR1dnNbdmVydGljZXMubGVuZ3RoICogOCArIDNdID0gdXZzWzNdO1xuXHRcdFx0fVxuXHRcdFx0aWYgKG5vcm1hbHMpIHtcblx0XHRcdFx0bm9ybWFsc1t2ZXJ0aWNlcy5sZW5ndGggKiA4XSA9IG5vcm1hbHNbMF07XG5cdFx0XHRcdG5vcm1hbHNbdmVydGljZXMubGVuZ3RoICogOCArIDFdID0gbm9ybWFsc1sxXTtcblx0XHRcdFx0bm9ybWFsc1t2ZXJ0aWNlcy5sZW5ndGggKiA4ICsgMl0gPSBub3JtYWxzWzJdO1xuXHRcdFx0XHRub3JtYWxzW3ZlcnRpY2VzLmxlbmd0aCAqIDggKyAzXSA9IG5vcm1hbHNbM107XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Y29uc3QgZ2xQcm9ncmFtID0gKHV2cyA/XG5cdFx0XHQobm9ybWFscyA/IHByb2dyYW0uZGVmYXVsdFByb2dyYW1XaXRoVVZOb3JtYWwgOiBwcm9ncmFtLmRlZmF1bHRQcm9ncmFtV2l0aFVWKSA6XG5cdFx0XHQobm9ybWFscyA/IHByb2dyYW0uZGVmYXVsdFByb2dyYW1XaXRoTm9ybWFsIDogcHJvZ3JhbS5kZWZhdWx0UHJvZ3JhbSlcblx0XHQpITtcblxuXHRcdC8vIERvIHNldHVwIC0gdGhpcyBtdXN0IGNvbWUgZmlyc3QuXG5cdFx0dGhpcy5kcmF3U2V0dXAoZ2xQcm9ncmFtLCBmYWxzZSwgaW5wdXQsIG91dHB1dCk7XG5cblx0XHQvLyBVcGRhdGUgdW5pZm9ybXMgYW5kIGJ1ZmZlcnMuXG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfc2NhbGUnLCBbMiAvIHdpZHRoLCAyIC8gaGVpZ2h0XSwgRkxPQVQpO1xuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3RyYW5zbGF0aW9uJywgWy0xLCAtMV0sIEZMT0FUKTtcblx0XHQvLyBJbml0IHBvc2l0aW9ucyBidWZmZXIuXG5cdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHRoaXMuaW5pdFZlcnRleEJ1ZmZlcihwb3NpdGlvbnMpISk7XG5cdFx0dGhpcy5zZXRQb3NpdGlvbkF0dHJpYnV0ZShnbFByb2dyYW0sIHByb2dyYW0ubmFtZSk7XG5cdFx0aWYgKHV2cykge1xuXHRcdFx0Ly8gSW5pdCB1diBidWZmZXIuXG5cdFx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdGhpcy5pbml0VmVydGV4QnVmZmVyKHV2cykhKTtcblx0XHRcdHRoaXMuc2V0VVZBdHRyaWJ1dGUoZ2xQcm9ncmFtLCBwcm9ncmFtLm5hbWUpO1xuXHRcdH1cblx0XHRpZiAobm9ybWFscykge1xuXHRcdFx0Ly8gSW5pdCBub3JtYWxzIGJ1ZmZlci5cblx0XHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLmluaXRWZXJ0ZXhCdWZmZXIobm9ybWFscykhKTtcblx0XHRcdHRoaXMuc2V0VmVydGV4QXR0cmlidXRlKGdsUHJvZ3JhbSwgJ2FfaW50ZXJuYWxfbm9ybWFsJywgMiwgcHJvZ3JhbS5uYW1lKTtcblx0XHR9XG5cblx0XHQvLyBEcmF3LlxuXHRcdHRoaXMuc2V0QmxlbmRNb2RlKHBhcmFtcy5zaG91bGRCbGVuZEFscGhhKTtcblx0XHRnbC5kcmF3QXJyYXlzKGdsLlRSSUFOR0xFX1NUUklQLCAwLCBudW1Qb3NpdGlvbnMpO1xuXHRcdGdsLmRpc2FibGUoZ2wuQkxFTkQpO1xuXHR9XG5cblx0c3RlcFRyaWFuZ2xlU3RyaXAoXG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRwcm9ncmFtOiBHUFVQcm9ncmFtLFxuXHRcdFx0cG9zaXRpb25zOiBGbG9hdDMyQXJyYXksXG5cdFx0XHRub3JtYWxzPzogRmxvYXQzMkFycmF5LFxuXHRcdFx0dXZzPzogRmxvYXQzMkFycmF5LFxuXHRcdFx0aW5wdXQ/OiAoRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlKVtdIHwgRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlLFxuXHRcdFx0b3V0cHV0PzogRGF0YUxheWVyLCAvLyBVbmRlZmluZWQgcmVuZGVycyB0byBzY3JlZW4uXG5cdFx0XHRjb3VudD86IG51bWJlcixcblx0XHRcdHNob3VsZEJsZW5kQWxwaGE/OiBib29sZWFuLFxuXHRcdH0sXG5cdCkge1xuXG5cdFx0Y29uc3QgeyBwcm9ncmFtLCBpbnB1dCwgb3V0cHV0LCBwb3NpdGlvbnMsIHV2cywgbm9ybWFscyB9ID0gcGFyYW1zO1xuXHRcdGNvbnN0IHsgZ2wsIHdpZHRoLCBoZWlnaHQsIGVycm9yU3RhdGUgfSA9IHRoaXM7XG5cblx0XHQvLyBJZ25vcmUgaWYgd2UgYXJlIGluIGVycm9yIHN0YXRlLlxuXHRcdGlmIChlcnJvclN0YXRlKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgZ2xQcm9ncmFtID0gKHV2cyA/XG5cdFx0XHQobm9ybWFscyA/IHByb2dyYW0uZGVmYXVsdFByb2dyYW1XaXRoVVZOb3JtYWwgOiBwcm9ncmFtLmRlZmF1bHRQcm9ncmFtV2l0aFVWKSA6XG5cdFx0XHQobm9ybWFscyA/IHByb2dyYW0uZGVmYXVsdFByb2dyYW1XaXRoTm9ybWFsIDogcHJvZ3JhbS5kZWZhdWx0UHJvZ3JhbSlcblx0XHQpITtcblxuXHRcdC8vIERvIHNldHVwIC0gdGhpcyBtdXN0IGNvbWUgZmlyc3QuXG5cdFx0dGhpcy5kcmF3U2V0dXAoZ2xQcm9ncmFtLCBmYWxzZSwgaW5wdXQsIG91dHB1dCk7XG5cblx0XHQvLyBVcGRhdGUgdW5pZm9ybXMgYW5kIGJ1ZmZlcnMuXG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfc2NhbGUnLCBbMiAvIHdpZHRoLCAyIC8gaGVpZ2h0XSwgRkxPQVQpO1xuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3RyYW5zbGF0aW9uJywgWy0xLCAtMV0sIEZMT0FUKTtcblx0XHQvLyBJbml0IHBvc2l0aW9ucyBidWZmZXIuXG5cdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHRoaXMuaW5pdFZlcnRleEJ1ZmZlcihwb3NpdGlvbnMpISk7XG5cdFx0dGhpcy5zZXRQb3NpdGlvbkF0dHJpYnV0ZShnbFByb2dyYW0sIHByb2dyYW0ubmFtZSk7XG5cdFx0aWYgKHV2cykge1xuXHRcdFx0Ly8gSW5pdCB1diBidWZmZXIuXG5cdFx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdGhpcy5pbml0VmVydGV4QnVmZmVyKHV2cykhKTtcblx0XHRcdHRoaXMuc2V0VVZBdHRyaWJ1dGUoZ2xQcm9ncmFtLCBwcm9ncmFtLm5hbWUpO1xuXHRcdH1cblx0XHRpZiAobm9ybWFscykge1xuXHRcdFx0Ly8gSW5pdCBub3JtYWxzIGJ1ZmZlci5cblx0XHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLmluaXRWZXJ0ZXhCdWZmZXIobm9ybWFscykhKTtcblx0XHRcdHRoaXMuc2V0VmVydGV4QXR0cmlidXRlKGdsUHJvZ3JhbSwgJ2FfaW50ZXJuYWxfbm9ybWFsJywgMiwgcHJvZ3JhbS5uYW1lKTtcblx0XHR9XG5cblx0XHRjb25zdCBjb3VudCA9IHBhcmFtcy5jb3VudCA/IHBhcmFtcy5jb3VudCA6IHBvc2l0aW9ucy5sZW5ndGggLyAyO1xuXG5cdFx0Ly8gRHJhdy5cblx0XHR0aGlzLnNldEJsZW5kTW9kZShwYXJhbXMuc2hvdWxkQmxlbmRBbHBoYSk7XG5cdFx0Z2wuZHJhd0FycmF5cyhnbC5UUklBTkdMRV9TVFJJUCwgMCwgY291bnQpO1xuXHRcdGdsLmRpc2FibGUoZ2wuQkxFTkQpO1xuXHR9XG5cblx0c3RlcExpbmVzKHBhcmFtczoge1xuXHRcdHByb2dyYW06IEdQVVByb2dyYW0sXG5cdFx0cG9zaXRpb25zOiBGbG9hdDMyQXJyYXksXG5cdFx0aW5kaWNlcz86IFVpbnQxNkFycmF5IHwgVWludDMyQXJyYXkgfCBJbnQxNkFycmF5IHwgSW50MzJBcnJheSxcblx0XHRub3JtYWxzPzogRmxvYXQzMkFycmF5LFxuXHRcdHV2cz86IEZsb2F0MzJBcnJheSxcblx0XHRpbnB1dD86IChEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUpW10gfCBEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUsXG5cdFx0b3V0cHV0PzogRGF0YUxheWVyLCAvLyBVbmRlZmluZWQgcmVuZGVycyB0byBzY3JlZW4uXG5cdFx0Y291bnQ/OiBudW1iZXIsXG5cdFx0Y2xvc2VMb29wPzogYm9vbGVhbixcblx0XHRzaG91bGRCbGVuZEFscGhhPzogYm9vbGVhbixcblx0fSkge1xuXHRcdGNvbnN0IHsgZ2wsIGVycm9yU3RhdGUsIHdpZHRoLCBoZWlnaHQgfSA9IHRoaXM7XG5cdFx0Y29uc3QgeyBpbmRpY2VzLCB1dnMsIG5vcm1hbHMsIGlucHV0LCBvdXRwdXQsIHByb2dyYW0gfSA9IHBhcmFtcztcblxuXHRcdC8vIElnbm9yZSBpZiB3ZSBhcmUgaW4gZXJyb3Igc3RhdGUuXG5cdFx0aWYgKGVycm9yU3RhdGUpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0Ly8gQ2hlY2sgdGhhdCBwYXJhbXMgYXJlIHZhbGlkLlxuXHRcdGlmIChwYXJhbXMuY2xvc2VMb29wICYmIGluZGljZXMpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgV2ViR0xDb21wdXRlLnN0ZXBMaW5lcygpIGNhbid0IGJlIGNhbGxlZCB3aXRoIGNsb3NlTG9vcCA9PSB0cnVlIGFuZCBpbmRpY2VzLmApO1xuXHRcdH1cblx0XHRcblx0XHRjb25zdCBnbFByb2dyYW0gPSAodXZzID9cblx0XHRcdChub3JtYWxzID8gcHJvZ3JhbS5kZWZhdWx0UHJvZ3JhbVdpdGhVVk5vcm1hbCA6IHByb2dyYW0uZGVmYXVsdFByb2dyYW1XaXRoVVYpIDpcblx0XHRcdChub3JtYWxzID8gcHJvZ3JhbS5kZWZhdWx0UHJvZ3JhbVdpdGhOb3JtYWwgOiBwcm9ncmFtLmRlZmF1bHRQcm9ncmFtKVxuXHRcdCkhO1xuXG5cdFx0Ly8gRG8gc2V0dXAgLSB0aGlzIG11c3QgY29tZSBmaXJzdC5cblx0XHR0aGlzLmRyYXdTZXR1cChnbFByb2dyYW0sIGZhbHNlLCBpbnB1dCwgb3V0cHV0KTtcblxuXHRcdGNvbnN0IGNvdW50ID0gcGFyYW1zLmNvdW50ID8gcGFyYW1zLmNvdW50IDogKGluZGljZXMgPyBpbmRpY2VzLmxlbmd0aCA6IHBhcmFtcy5wb3NpdGlvbnMubGVuZ3RoICAvIDIpO1xuXG5cdFx0Ly8gVXBkYXRlIHVuaWZvcm1zIGFuZCBidWZmZXJzLlxuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3NjYWxlJywgWzIgLyB3aWR0aCwgMiAvIGhlaWdodF0sIEZMT0FUKTtcblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF90cmFuc2xhdGlvbicsIFstMSwgLTFdLCBGTE9BVCk7XG5cdFx0aWYgKGluZGljZXMpIHtcblx0XHRcdC8vIFJlb3JkZXIgcG9zaXRpb25zIGFycmF5IHRvIG1hdGNoIGluZGljZXMuXG5cdFx0XHRjb25zdCBwb3NpdGlvbnMgPSBuZXcgRmxvYXQzMkFycmF5KDIgKiBpbmRpY2VzLmxlbmd0aCk7XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcblx0XHRcdFx0Y29uc3QgaW5kZXggPSBpbmRpY2VzW2ldO1xuXHRcdFx0XHRwb3NpdGlvbnNbMiAqIGldID0gcGFyYW1zLnBvc2l0aW9uc1syICogaW5kZXhdO1xuXHRcdFx0XHRwb3NpdGlvbnNbMiAqIGkgKyAxXSA9IHBhcmFtcy5wb3NpdGlvbnNbMiAqIGluZGV4ICsgMV07XG5cdFx0XHR9XG5cdFx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdGhpcy5pbml0VmVydGV4QnVmZmVyKHBvc2l0aW9ucykhKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHRoaXMuaW5pdFZlcnRleEJ1ZmZlcihwYXJhbXMucG9zaXRpb25zKSEpO1xuXHRcdH1cblx0XHR0aGlzLnNldFBvc2l0aW9uQXR0cmlidXRlKGdsUHJvZ3JhbSwgcHJvZ3JhbS5uYW1lKTtcblxuXHRcdC8vIERyYXcuXG5cdFx0dGhpcy5zZXRCbGVuZE1vZGUocGFyYW1zLnNob3VsZEJsZW5kQWxwaGEpO1xuXHRcdGlmIChwYXJhbXMuaW5kaWNlcykge1xuXHRcdFx0Z2wuZHJhd0FycmF5cyhnbC5MSU5FUywgMCwgY291bnQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAocGFyYW1zLmNsb3NlTG9vcCkge1xuXHRcdFx0XHRnbC5kcmF3QXJyYXlzKGdsLkxJTkVfTE9PUCwgMCwgY291bnQpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Z2wuZHJhd0FycmF5cyhnbC5MSU5FX1NUUklQLCAwLCBjb3VudCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGdsLmRpc2FibGUoZ2wuQkxFTkQpO1xuXHR9XG5cblx0ZHJhd0xheWVyQXNQb2ludHMoXG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRwb3NpdGlvbnM6IERhdGFMYXllciwgLy8gUG9zaXRpb25zIGluIGNhbnZhcyBweC5cblx0XHRcdHByb2dyYW0/OiBHUFVQcm9ncmFtLFxuXHRcdFx0aW5wdXQ/OiAoRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlKVtdIHwgRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlLFxuXHRcdFx0b3V0cHV0PzogRGF0YUxheWVyLFxuXHRcdFx0cG9pbnRTaXplPzogbnVtYmVyLFxuXHRcdFx0Y291bnQ/OiBudW1iZXIsXG5cdFx0XHRjb2xvcj86IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSxcblx0XHRcdHdyYXBYPzogYm9vbGVhbixcblx0XHRcdHdyYXBZPzogYm9vbGVhbixcblx0XHRcdHNob3VsZEJsZW5kQWxwaGE/OiBib29sZWFuLFxuXHRcdH0sXG5cdCkge1xuXHRcdGNvbnN0IHsgZ2wsIGVycm9yU3RhdGUsIHBvaW50SW5kZXhBcnJheSwgd2lkdGgsIGhlaWdodCB9ID0gdGhpcztcblx0XHRjb25zdCB7IHBvc2l0aW9ucywgb3V0cHV0IH0gPSBwYXJhbXM7XG5cblx0XHQvLyBJZ25vcmUgaWYgd2UgYXJlIGluIGVycm9yIHN0YXRlLlxuXHRcdGlmIChlcnJvclN0YXRlKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gQ2hlY2sgdGhhdCBudW1Qb2ludHMgaXMgdmFsaWQuXG5cdFx0aWYgKHBvc2l0aW9ucy5udW1Db21wb25lbnRzICE9PSAyICYmIHBvc2l0aW9ucy5udW1Db21wb25lbnRzICE9PSA0KSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFdlYkdMQ29tcHV0ZS5kcmF3UG9pbnRzKCkgbXVzdCBiZSBwYXNzZWQgYSBwb3NpdGlvbiBEYXRhTGF5ZXIgd2l0aCBlaXRoZXIgMiBvciA0IGNvbXBvbmVudHMsIGdvdCBwb3NpdGlvbiBEYXRhTGF5ZXIgXCIke3Bvc2l0aW9ucy5uYW1lfVwiIHdpdGggJHtwb3NpdGlvbnMubnVtQ29tcG9uZW50c30gY29tcG9uZW50cy5gKVxuXHRcdH1cblx0XHRjb25zdCBsZW5ndGggPSBwb3NpdGlvbnMuZ2V0TGVuZ3RoKCk7XG5cdFx0Y29uc3QgY291bnQgPSBwYXJhbXMuY291bnQgfHwgbGVuZ3RoO1xuXHRcdGlmIChjb3VudCA+IGxlbmd0aCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGNvdW50ICR7Y291bnR9IGZvciBwb3NpdGlvbiBEYXRhTGF5ZXIgb2YgbGVuZ3RoICR7bGVuZ3RofS5gKTtcblx0XHR9XG5cblx0XHRsZXQgcHJvZ3JhbSA9IHBhcmFtcy5wcm9ncmFtO1xuXHRcdGlmIChwcm9ncmFtID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHByb2dyYW0gPSB0aGlzLnNpbmdsZUNvbG9yUHJvZ3JhbTtcblx0XHRcdGNvbnN0IGNvbG9yID0gcGFyYW1zLmNvbG9yIHx8IFsxLCAwLCAwXTsgLy8gRGVmYXVsdCBvZiByZWQuXG5cdFx0XHRwcm9ncmFtLnNldFVuaWZvcm0oJ3VfY29sb3InLCBjb2xvciwgRkxPQVQpO1xuXHRcdH1cblx0XHRjb25zdCBnbFByb2dyYW0gPSBwcm9ncmFtLmRhdGFMYXllclBvaW50c1Byb2dyYW0hO1xuXG5cdFx0Ly8gQWRkIHBvc2l0aW9ucyB0byBlbmQgb2YgaW5wdXQgaWYgbmVlZGVkLlxuXHRcdGNvbnN0IGlucHV0ID0gdGhpcy5hZGRMYXllclRvSW5wdXRzKHBvc2l0aW9ucywgcGFyYW1zLmlucHV0KTtcblxuXHRcdC8vIERvIHNldHVwIC0gdGhpcyBtdXN0IGNvbWUgZmlyc3QuXG5cdFx0dGhpcy5kcmF3U2V0dXAoZ2xQcm9ncmFtLCBmYWxzZSwgaW5wdXQsIG91dHB1dCk7XG5cblx0XHQvLyBVcGRhdGUgdW5pZm9ybXMgYW5kIGJ1ZmZlcnMuXG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfcG9zaXRpb25zJywgaW5wdXQuaW5kZXhPZihwb3NpdGlvbnMpLCBJTlQpO1xuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3NjYWxlJywgWzEgLyB3aWR0aCwgMSAvIGhlaWdodF0sIEZMT0FUKTtcblx0XHQvLyBUZWxsIHdoZXRoZXIgd2UgYXJlIHVzaW5nIGFuIGFic29sdXRlIHBvc2l0aW9uICgyIGNvbXBvbmVudHMpLCBvciBwb3NpdGlvbiB3aXRoIGFjY3VtdWxhdGlvbiBidWZmZXIgKDQgY29tcG9uZW50cywgYmV0dGVyIGZsb2F0aW5nIHB0IGFjY3VyYWN5KS5cblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF9wb3NpdGlvbldpdGhBY2N1bXVsYXRpb24nLCBwb3NpdGlvbnMubnVtQ29tcG9uZW50cyA9PT0gNCA/IDEgOiAwLCBJTlQpO1xuXHRcdC8vIFNldCBkZWZhdWx0IHBvaW50U2l6ZS5cblx0XHRjb25zdCBwb2ludFNpemUgPSBwYXJhbXMucG9pbnRTaXplIHx8IDE7XG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfcG9pbnRTaXplJywgcG9pbnRTaXplLCBGTE9BVCk7XG5cdFx0Y29uc3QgcG9zaXRpb25MYXllckRpbWVuc2lvbnMgPSBwb3NpdGlvbnMuZ2V0RGltZW5zaW9ucygpO1xuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3Bvc2l0aW9uc0RpbWVuc2lvbnMnLCBwb3NpdGlvbkxheWVyRGltZW5zaW9ucywgRkxPQVQpO1xuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3dyYXBYJywgcGFyYW1zLndyYXBYID8gMSA6IDAsIElOVCk7XG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfd3JhcFknLCBwYXJhbXMud3JhcFkgPyAxIDogMCwgSU5UKTtcblx0XHRpZiAodGhpcy5wb2ludEluZGV4QnVmZmVyID09PSB1bmRlZmluZWQgfHwgKHBvaW50SW5kZXhBcnJheSAmJiBwb2ludEluZGV4QXJyYXkubGVuZ3RoIDwgY291bnQpKSB7XG5cdFx0XHQvLyBIYXZlIHRvIHVzZSBmbG9hdDMyIGFycmF5IGJjIGludCBpcyBub3Qgc3VwcG9ydGVkIGFzIGEgdmVydGV4IGF0dHJpYnV0ZSB0eXBlLlxuXHRcdFx0Y29uc3QgaW5kaWNlcyA9IGluaXRTZXF1ZW50aWFsRmxvYXRBcnJheShsZW5ndGgpO1xuXHRcdFx0dGhpcy5wb2ludEluZGV4QXJyYXkgPSBpbmRpY2VzO1xuXHRcdFx0dGhpcy5wb2ludEluZGV4QnVmZmVyID0gdGhpcy5pbml0VmVydGV4QnVmZmVyKGluZGljZXMpO1xuXHRcdH1cblx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdGhpcy5wb2ludEluZGV4QnVmZmVyISk7XG5cdFx0dGhpcy5zZXRJbmRleEF0dHJpYnV0ZShnbFByb2dyYW0sIHByb2dyYW0ubmFtZSk7XG5cblx0XHQvLyBEcmF3LlxuXHRcdHRoaXMuc2V0QmxlbmRNb2RlKHBhcmFtcy5zaG91bGRCbGVuZEFscGhhKTtcblx0XHRnbC5kcmF3QXJyYXlzKGdsLlBPSU5UUywgMCwgY291bnQpO1xuXHRcdGdsLmRpc2FibGUoZ2wuQkxFTkQpO1xuXHR9XG5cblx0ZHJhd0xheWVyQXNMaW5lcyhcblx0XHRwYXJhbXM6IHtcblx0XHRcdHBvc2l0aW9uczogRGF0YUxheWVyLFxuXHRcdFx0aW5kaWNlcz86IEZsb2F0MzJBcnJheSB8IFVpbnQxNkFycmF5IHwgVWludDMyQXJyYXkgfCBJbnQxNkFycmF5IHwgSW50MzJBcnJheSxcblx0XHRcdHByb2dyYW0/OiBHUFVQcm9ncmFtLFxuXHRcdFx0aW5wdXQ/OiAoRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlKVtdIHwgRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlLFxuXHRcdFx0b3V0cHV0PzogRGF0YUxheWVyLFxuXHRcdFx0Y291bnQ/OiBudW1iZXIsXG5cdFx0XHRjb2xvcj86IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSxcblx0XHRcdHdyYXBYPzogYm9vbGVhbixcblx0XHRcdHdyYXBZPzogYm9vbGVhbixcblx0XHRcdGNsb3NlTG9vcD86IGJvb2xlYW4sXG5cdFx0XHRzaG91bGRCbGVuZEFscGhhPzogYm9vbGVhbixcblx0XHR9LFxuXHQpIHtcblx0XHRjb25zdCB7IGdsLCBlcnJvclN0YXRlLCB3aWR0aCwgaGVpZ2h0IH0gPSB0aGlzO1xuXHRcdGNvbnN0IHsgcG9zaXRpb25zLCBvdXRwdXQgfSA9IHBhcmFtcztcblxuXHRcdC8vIElnbm9yZSBpZiB3ZSBhcmUgaW4gZXJyb3Igc3RhdGUuXG5cdFx0aWYgKGVycm9yU3RhdGUpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBDaGVjayB0aGF0IHBvc2l0aW9ucyBpcyB2YWxpZC5cblx0XHRpZiAocG9zaXRpb25zLm51bUNvbXBvbmVudHMgIT09IDIgJiYgcG9zaXRpb25zLm51bUNvbXBvbmVudHMgIT09IDQpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgV2ViR0xDb21wdXRlLmRyYXdMYXllckFzTGluZXMoKSBtdXN0IGJlIHBhc3NlZCBhIHBvc2l0aW9uIERhdGFMYXllciB3aXRoIGVpdGhlciAyIG9yIDQgY29tcG9uZW50cywgZ290IHBvc2l0aW9uIERhdGFMYXllciBcIiR7cG9zaXRpb25zLm5hbWV9XCIgd2l0aCAke3Bvc2l0aW9ucy5udW1Db21wb25lbnRzfSBjb21wb25lbnRzLmApXG5cdFx0fVxuXHRcdC8vIENoZWNrIHRoYXQgcGFyYW1zIGFyZSB2YWxpZC5cblx0XHRpZiAocGFyYW1zLmNsb3NlTG9vcCAmJiBwYXJhbXMuaW5kaWNlcykge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBXZWJHTENvbXB1dGUuZHJhd0xheWVyQXNMaW5lcygpIGNhbid0IGJlIGNhbGxlZCB3aXRoIGNsb3NlTG9vcCA9PSB0cnVlIGFuZCBpbmRpY2VzLmApO1xuXHRcdH1cblxuXHRcdGxldCBwcm9ncmFtID0gcGFyYW1zLnByb2dyYW07XG5cdFx0aWYgKHByb2dyYW0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cHJvZ3JhbSA9IHBhcmFtcy53cmFwWCB8fCBwYXJhbXMud3JhcFkgPyB0aGlzLnNpbmdsZUNvbG9yV2l0aFdyYXBDaGVja1Byb2dyYW0gOiB0aGlzLnNpbmdsZUNvbG9yUHJvZ3JhbTtcblx0XHRcdGNvbnN0IGNvbG9yID0gcGFyYW1zLmNvbG9yIHx8IFsxLCAwLCAwXTsgLy8gRGVmYXVsdCB0byByZWQuXG5cdFx0XHRwcm9ncmFtLnNldFVuaWZvcm0oJ3VfY29sb3InLCBjb2xvciwgRkxPQVQpO1xuXHRcdH1cblx0XHRjb25zdCBnbFByb2dyYW0gPSBwcm9ncmFtLmRhdGFMYXllckxpbmVzUHJvZ3JhbSE7XG5cblx0XHQvLyBBZGQgcG9zaXRpb25MYXllciB0byBlbmQgb2YgaW5wdXQgaWYgbmVlZGVkLlxuXHRcdGNvbnN0IGlucHV0ID0gdGhpcy5hZGRMYXllclRvSW5wdXRzKHBvc2l0aW9ucywgcGFyYW1zLmlucHV0KTtcblxuXHRcdC8vIERvIHNldHVwIC0gdGhpcyBtdXN0IGNvbWUgZmlyc3QuXG5cdFx0dGhpcy5kcmF3U2V0dXAoZ2xQcm9ncmFtLCBmYWxzZSwgaW5wdXQsIG91dHB1dCk7XG5cblx0XHQvLyBUT0RPOiBjYWNoZSBpbmRleEFycmF5IGlmIG5vIGluZGljZXMgcGFzc2VkIGluLlxuXHRcdGNvbnN0IGluZGljZXMgPSBwYXJhbXMuaW5kaWNlcyA/IHBhcmFtcy5pbmRpY2VzIDogaW5pdFNlcXVlbnRpYWxGbG9hdEFycmF5KHBhcmFtcy5jb3VudCB8fCBwb3NpdGlvbnMuZ2V0TGVuZ3RoKCkpO1xuXHRcdGNvbnN0IGNvdW50ID0gcGFyYW1zLmNvdW50ID8gcGFyYW1zLmNvdW50IDogaW5kaWNlcy5sZW5ndGg7XG5cblx0XHQvLyBVcGRhdGUgdW5pZm9ybXMgYW5kIGJ1ZmZlcnMuXG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfcG9zaXRpb25zJywgaW5wdXQuaW5kZXhPZihwb3NpdGlvbnMpLCBJTlQpO1xuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3NjYWxlJywgWzEgLyB3aWR0aCwgMSAvIGhlaWdodF0sIEZMT0FUKTtcblx0XHQvLyBUZWxsIHdoZXRoZXIgd2UgYXJlIHVzaW5nIGFuIGFic29sdXRlIHBvc2l0aW9uICgyIGNvbXBvbmVudHMpLCBvciBwb3NpdGlvbiB3aXRoIGFjY3VtdWxhdGlvbiBidWZmZXIgKDQgY29tcG9uZW50cywgYmV0dGVyIGZsb2F0aW5nIHB0IGFjY3VyYWN5KS5cblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF9wb3NpdGlvbldpdGhBY2N1bXVsYXRpb24nLCBwb3NpdGlvbnMubnVtQ29tcG9uZW50cyA9PT0gNCA/IDEgOiAwLCBJTlQpO1xuXHRcdGNvbnN0IHBvc2l0aW9uTGF5ZXJEaW1lbnNpb25zID0gcG9zaXRpb25zLmdldERpbWVuc2lvbnMoKTtcblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF9wb3NpdGlvbnNEaW1lbnNpb25zJywgcG9zaXRpb25MYXllckRpbWVuc2lvbnMsIEZMT0FUKTtcblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF93cmFwWCcsIHBhcmFtcy53cmFwWCA/IDEgOiAwLCBJTlQpO1xuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3dyYXBZJywgcGFyYW1zLndyYXBZID8gMSA6IDAsIElOVCk7XG5cdFx0aWYgKHRoaXMuaW5kZXhlZExpbmVzSW5kZXhCdWZmZXIgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Ly8gSGF2ZSB0byB1c2UgZmxvYXQzMiBhcnJheSBiYyBpbnQgaXMgbm90IHN1cHBvcnRlZCBhcyBhIHZlcnRleCBhdHRyaWJ1dGUgdHlwZS5cblx0XHRcdGxldCBmbG9hdEFycmF5OiBGbG9hdDMyQXJyYXk7XG5cdFx0XHRpZiAoaW5kaWNlcy5jb25zdHJ1Y3RvciAhPT0gRmxvYXQzMkFycmF5KSB7XG5cdFx0XHRcdC8vIEhhdmUgdG8gdXNlIGZsb2F0MzIgYXJyYXkgYmMgaW50IGlzIG5vdCBzdXBwb3J0ZWQgYXMgYSB2ZXJ0ZXggYXR0cmlidXRlIHR5cGUuXG5cdFx0XHRcdGZsb2F0QXJyYXkgPSBuZXcgRmxvYXQzMkFycmF5KGluZGljZXMubGVuZ3RoKTtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG5cdFx0XHRcdFx0ZmxvYXRBcnJheVtpXSA9IGluZGljZXNbaV07XG5cdFx0XHRcdH1cblx0XHRcdFx0Y29uc29sZS53YXJuKGBDb252ZXJ0aW5nIGluZGljZXMgYXJyYXkgb2YgdHlwZSAke2luZGljZXMuY29uc3RydWN0b3J9IHRvIEZsb2F0MzJBcnJheSBpbiBXZWJHTENvbXB1dGUuZHJhd0luZGV4ZWRMaW5lcyBmb3IgV2ViR0wgY29tcGF0aWJpbGl0eSwgeW91IG1heSB3YW50IHRvIHVzZSBhIEZsb2F0MzJBcnJheSB0byBzdG9yZSB0aGlzIGluZm9ybWF0aW9uIHNvIHRoZSBjb252ZXJzaW9uIGlzIG5vdCByZXF1aXJlZC5gKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZsb2F0QXJyYXkgPSBpbmRpY2VzIGFzIEZsb2F0MzJBcnJheTtcblx0XHRcdH1cblx0XHRcdHRoaXMuaW5kZXhlZExpbmVzSW5kZXhCdWZmZXIgPSB0aGlzLmluaXRWZXJ0ZXhCdWZmZXIoZmxvYXRBcnJheSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLmluZGV4ZWRMaW5lc0luZGV4QnVmZmVyISk7XG5cdFx0XHQvLyBDb3B5IGJ1ZmZlciBkYXRhLlxuXHRcdFx0Z2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsIGluZGljZXMsIGdsLlNUQVRJQ19EUkFXKTtcblx0XHR9XG5cdFx0dGhpcy5zZXRJbmRleEF0dHJpYnV0ZShnbFByb2dyYW0sIHByb2dyYW0ubmFtZSk7XG5cblx0XHQvLyBEcmF3LlxuXHRcdHRoaXMuc2V0QmxlbmRNb2RlKHBhcmFtcy5zaG91bGRCbGVuZEFscGhhKTtcblx0XHRpZiAocGFyYW1zLmluZGljZXMpIHtcblx0XHRcdGdsLmRyYXdBcnJheXMoZ2wuTElORVMsIDAsIGNvdW50KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKHBhcmFtcy5jbG9zZUxvb3ApIHtcblx0XHRcdFx0Z2wuZHJhd0FycmF5cyhnbC5MSU5FX0xPT1AsIDAsIGNvdW50KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGdsLmRyYXdBcnJheXMoZ2wuTElORV9TVFJJUCwgMCwgY291bnQpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRnbC5kaXNhYmxlKGdsLkJMRU5EKTtcblx0fVxuXG5cdGRyYXdMYXllckFzVmVjdG9yRmllbGQoXG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRmaWVsZDogRGF0YUxheWVyLFxuXHRcdFx0cHJvZ3JhbT86IEdQVVByb2dyYW0sXG5cdFx0XHRpbnB1dD86IChEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUpW10gfCBEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUsXG5cdFx0XHRvdXRwdXQ/OiBEYXRhTGF5ZXIsXG5cdFx0XHR2ZWN0b3JTcGFjaW5nPzogbnVtYmVyLFxuXHRcdFx0dmVjdG9yU2NhbGU/OiBudW1iZXIsXG5cdFx0XHRjb2xvcj86IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSxcblx0XHRcdHNob3VsZEJsZW5kQWxwaGE/OiBib29sZWFuLFxuXHRcdH0sXG5cdCkge1xuXHRcdGNvbnN0IHsgZ2wsIGVycm9yU3RhdGUsIHZlY3RvckZpZWxkSW5kZXhBcnJheSwgd2lkdGgsIGhlaWdodCB9ID0gdGhpcztcblx0XHRjb25zdCB7IGZpZWxkLCBvdXRwdXQgfSA9IHBhcmFtcztcblxuXHRcdC8vIElnbm9yZSBpZiB3ZSBhcmUgaW4gZXJyb3Igc3RhdGUuXG5cdFx0aWYgKGVycm9yU3RhdGUpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBDaGVjayB0aGF0IGZpZWxkIGlzIHZhbGlkLlxuXHRcdGlmIChmaWVsZC5udW1Db21wb25lbnRzICE9PSAyKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFdlYkdMQ29tcHV0ZS5kcmF3VmVjdG9yRmllbGQoKSBtdXN0IGJlIHBhc3NlZCBhIGZpZWxkTGF5ZXIgd2l0aCAyIGNvbXBvbmVudHMsIGdvdCBmaWVsZExheWVyIFwiJHtmaWVsZC5uYW1lfVwiIHdpdGggJHtmaWVsZC5udW1Db21wb25lbnRzfSBjb21wb25lbnRzLmApXG5cdFx0fVxuXHRcdC8vIENoZWNrIGFzcGVjdCByYXRpby5cblx0XHQvLyBjb25zdCBkaW1lbnNpb25zID0gdmVjdG9yTGF5ZXIuZ2V0RGltZW5zaW9ucygpO1xuXHRcdC8vIGlmIChNYXRoLmFicyhkaW1lbnNpb25zWzBdIC8gZGltZW5zaW9uc1sxXSAtIHdpZHRoIC8gaGVpZ2h0KSA+IDAuMDEpIHtcblx0XHQvLyBcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBhc3BlY3QgcmF0aW8gJHsoZGltZW5zaW9uc1swXSAvIGRpbWVuc2lvbnNbMV0pLnRvRml4ZWQoMyl9IHZlY3RvciBEYXRhTGF5ZXIgd2l0aCBkaW1lbnNpb25zIFske2RpbWVuc2lvbnNbMF19LCAke2RpbWVuc2lvbnNbMV19XSwgZXhwZWN0ZWQgJHsod2lkdGggLyBoZWlnaHQpLnRvRml4ZWQoMyl9LmApO1xuXHRcdC8vIH1cblxuXHRcdGxldCBwcm9ncmFtID0gcGFyYW1zLnByb2dyYW07XG5cdFx0aWYgKHByb2dyYW0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cHJvZ3JhbSA9IHRoaXMuc2luZ2xlQ29sb3JQcm9ncmFtO1xuXHRcdFx0Y29uc3QgY29sb3IgPSBwYXJhbXMuY29sb3IgfHwgWzEsIDAsIDBdOyAvLyBEZWZhdWx0IHRvIHJlZC5cblx0XHRcdHByb2dyYW0uc2V0VW5pZm9ybSgndV9jb2xvcicsIGNvbG9yLCBGTE9BVCk7XG5cdFx0fVxuXHRcdGNvbnN0IGdsUHJvZ3JhbSA9IHByb2dyYW0uZGF0YUxheWVyVmVjdG9yRmllbGRQcm9ncmFtITtcblxuXHRcdC8vIEFkZCBmaWVsZCB0byBlbmQgb2YgaW5wdXQgaWYgbmVlZGVkLlxuXHRcdGNvbnN0IGlucHV0ID0gdGhpcy5hZGRMYXllclRvSW5wdXRzKGZpZWxkLCBwYXJhbXMuaW5wdXQpO1xuXG5cdFx0Ly8gRG8gc2V0dXAgLSB0aGlzIG11c3QgY29tZSBmaXJzdC5cblx0XHR0aGlzLmRyYXdTZXR1cChnbFByb2dyYW0sIGZhbHNlLCBpbnB1dCwgb3V0cHV0KTtcblxuXHRcdC8vIFVwZGF0ZSB1bmlmb3JtcyBhbmQgYnVmZmVycy5cblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF92ZWN0b3JzJywgaW5wdXQuaW5kZXhPZihmaWVsZCksIElOVCk7XG5cdFx0Ly8gU2V0IGRlZmF1bHQgc2NhbGUuXG5cdFx0Y29uc3QgdmVjdG9yU2NhbGUgPSBwYXJhbXMudmVjdG9yU2NhbGUgfHwgMTtcblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF9zY2FsZScsIFt2ZWN0b3JTY2FsZSAvIHdpZHRoLCB2ZWN0b3JTY2FsZSAvIGhlaWdodF0sIEZMT0FUKTtcblx0XHRjb25zdCB2ZWN0b3JTcGFjaW5nID0gcGFyYW1zLnZlY3RvclNwYWNpbmcgfHwgMTA7XG5cdFx0Y29uc3Qgc3BhY2VkRGltZW5zaW9ucyA9IFtNYXRoLmZsb29yKHdpZHRoIC8gdmVjdG9yU3BhY2luZyksIE1hdGguZmxvb3IoaGVpZ2h0IC8gdmVjdG9yU3BhY2luZyldIGFzIFtudW1iZXIsIG51bWJlcl07XG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfZGltZW5zaW9ucycsIHNwYWNlZERpbWVuc2lvbnMsIEZMT0FUKTtcblx0XHRjb25zdCBsZW5ndGggPSAyICogc3BhY2VkRGltZW5zaW9uc1swXSAqIHNwYWNlZERpbWVuc2lvbnNbMV07XG5cdFx0aWYgKHRoaXMudmVjdG9yRmllbGRJbmRleEJ1ZmZlciA9PT0gdW5kZWZpbmVkIHx8ICh2ZWN0b3JGaWVsZEluZGV4QXJyYXkgJiYgdmVjdG9yRmllbGRJbmRleEFycmF5Lmxlbmd0aCA8IGxlbmd0aCkpIHtcblx0XHRcdC8vIEhhdmUgdG8gdXNlIGZsb2F0MzIgYXJyYXkgYmMgaW50IGlzIG5vdCBzdXBwb3J0ZWQgYXMgYSB2ZXJ0ZXggYXR0cmlidXRlIHR5cGUuXG5cdFx0XHRjb25zdCBpbmRpY2VzID0gaW5pdFNlcXVlbnRpYWxGbG9hdEFycmF5KGxlbmd0aCk7XG5cdFx0XHR0aGlzLnZlY3RvckZpZWxkSW5kZXhBcnJheSA9IGluZGljZXM7XG5cdFx0XHR0aGlzLnZlY3RvckZpZWxkSW5kZXhCdWZmZXIgPSB0aGlzLmluaXRWZXJ0ZXhCdWZmZXIoaW5kaWNlcyk7XG5cdFx0fVxuXHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLnZlY3RvckZpZWxkSW5kZXhCdWZmZXIhKTtcblx0XHR0aGlzLnNldEluZGV4QXR0cmlidXRlKGdsUHJvZ3JhbSwgcHJvZ3JhbS5uYW1lKTtcblxuXHRcdC8vIERyYXcuXG5cdFx0dGhpcy5zZXRCbGVuZE1vZGUocGFyYW1zLnNob3VsZEJsZW5kQWxwaGEpO1xuXHRcdGdsLmRyYXdBcnJheXMoZ2wuTElORVMsIDAsIGxlbmd0aCk7XG5cdFx0Z2wuZGlzYWJsZShnbC5CTEVORCk7XG5cdH1cblx0XG5cdGdldENvbnRleHQoKSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2w7XG5cdH1cblxuXHRnZXRWYWx1ZXMoZGF0YUxheWVyOiBEYXRhTGF5ZXIpIHtcblx0XHRjb25zdCB7IGdsLCBnbHNsVmVyc2lvbiB9ID0gdGhpcztcblxuXHRcdC8vIEluIGNhc2UgZGF0YUxheWVyIHdhcyBub3QgdGhlIGxhc3Qgb3V0cHV0IHdyaXR0ZW4gdG8uXG5cdFx0ZGF0YUxheWVyLl9iaW5kT3V0cHV0QnVmZmVyKCk7XG5cblx0XHRjb25zdCBbIHdpZHRoLCBoZWlnaHQgXSA9IGRhdGFMYXllci5nZXREaW1lbnNpb25zKCk7XG5cdFx0bGV0IHsgZ2xOdW1DaGFubmVscywgZ2xUeXBlLCBnbEZvcm1hdCwgaW50ZXJuYWxUeXBlIH0gPSBkYXRhTGF5ZXI7XG5cdFx0bGV0IHZhbHVlcztcblx0XHRzd2l0Y2ggKGludGVybmFsVHlwZSkge1xuXHRcdFx0Y2FzZSBIQUxGX0ZMT0FUOlxuXHRcdFx0XHRpZiAoZ2wuRkxPQVQgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdC8vIEZpcmVmb3ggcmVxdWlyZXMgdGhhdCBSR0JBL0ZMT0FUIGlzIHVzZWQgZm9yIHJlYWRQaXhlbHMgb2YgZmxvYXQxNiB0eXBlcy5cblx0XHRcdFx0XHRnbE51bUNoYW5uZWxzID0gNDtcblx0XHRcdFx0XHRnbEZvcm1hdCA9IGdsLlJHQkE7XG5cdFx0XHRcdFx0Z2xUeXBlID0gZ2wuRkxPQVQ7XG5cdFx0XHRcdFx0dmFsdWVzID0gbmV3IEZsb2F0MzJBcnJheSh3aWR0aCAqIGhlaWdodCAqIGdsTnVtQ2hhbm5lbHMpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHZhbHVlcyA9IG5ldyBVaW50MTZBcnJheSh3aWR0aCAqIGhlaWdodCAqIGdsTnVtQ2hhbm5lbHMpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIC8vIFRoZSBmb2xsb3dpbmcgd29ya3MgaW4gQ2hyb21lLlxuXHRcdFx0XHQvLyB2YWx1ZXMgPSBuZXcgVWludDE2QXJyYXkod2lkdGggKiBoZWlnaHQgKiBnbE51bUNoYW5uZWxzKTtcblx0XHRcdFx0YnJlYWtcblx0XHRcdGNhc2UgRkxPQVQ6XG5cdFx0XHRcdC8vIENocm9tZSBhbmQgRmlyZWZveCByZXF1aXJlIHRoYXQgUkdCQS9GTE9BVCBpcyB1c2VkIGZvciByZWFkUGl4ZWxzIG9mIGZsb2F0MzIgdHlwZXMuXG5cdFx0XHRcdC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9LaHJvbm9zR3JvdXAvV2ViR0wvaXNzdWVzLzI3NDdcblx0XHRcdFx0Z2xOdW1DaGFubmVscyA9IDQ7XG5cdFx0XHRcdGdsRm9ybWF0ID0gZ2wuUkdCQTtcblx0XHRcdFx0dmFsdWVzID0gbmV3IEZsb2F0MzJBcnJheSh3aWR0aCAqIGhlaWdodCAqIGdsTnVtQ2hhbm5lbHMpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgVU5TSUdORURfQllURTpcblx0XHRcdFx0aWYgKGdsc2xWZXJzaW9uID09PSBHTFNMMSkge1xuXHRcdFx0XHRcdC8vIEZpcmVmb3ggcmVxdWlyZXMgdGhhdCBSR0JBL1VOU0lHTkVEX0JZVEUgaXMgdXNlZCBmb3IgcmVhZFBpeGVscyBvZiB1bnNpZ25lZCBieXRlIHR5cGVzLlxuXHRcdFx0XHRcdGdsTnVtQ2hhbm5lbHMgPSA0O1xuXHRcdFx0XHRcdGdsRm9ybWF0ID0gZ2wuUkdCQTtcblx0XHRcdFx0XHR2YWx1ZXMgPSBuZXcgVWludDhBcnJheSh3aWR0aCAqIGhlaWdodCAqIGdsTnVtQ2hhbm5lbHMpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIEZpcmVmb3ggcmVxdWlyZXMgdGhhdCBSR0JBX0lOVEVHRVIvVU5TSUdORURfSU5UIGlzIHVzZWQgZm9yIHJlYWRQaXhlbHMgb2YgdW5zaWduZWQgaW50IHR5cGVzLlxuXHRcdFx0XHRnbE51bUNoYW5uZWxzID0gNDtcblx0XHRcdFx0Z2xGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkdCQV9JTlRFR0VSO1xuXHRcdFx0XHRnbFR5cGUgPSBnbC5VTlNJR05FRF9JTlQ7XG5cdFx0XHRcdHZhbHVlcyA9IG5ldyBVaW50MzJBcnJheSh3aWR0aCAqIGhlaWdodCAqIGdsTnVtQ2hhbm5lbHMpO1xuXHRcdFx0XHQvLyAvLyBUaGUgZm9sbG93aW5nIHdvcmtzIGluIENocm9tZS5cblx0XHRcdFx0Ly8gdmFsdWVzID0gbmV3IFVpbnQ4QXJyYXkod2lkdGggKiBoZWlnaHQgKiBnbE51bUNoYW5uZWxzKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFVOU0lHTkVEX1NIT1JUOlxuXHRcdFx0XHQvLyBGaXJlZm94IHJlcXVpcmVzIHRoYXQgUkdCQV9JTlRFR0VSL1VOU0lHTkVEX0lOVCBpcyB1c2VkIGZvciByZWFkUGl4ZWxzIG9mIHVuc2lnbmVkIGludCB0eXBlcy5cblx0XHRcdFx0Z2xOdW1DaGFubmVscyA9IDQ7XG5cdFx0XHRcdGdsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHQkFfSU5URUdFUjtcblx0XHRcdFx0Z2xUeXBlID0gZ2wuVU5TSUdORURfSU5UO1xuXHRcdFx0XHR2YWx1ZXMgPSBuZXcgVWludDMyQXJyYXkod2lkdGggKiBoZWlnaHQgKiBnbE51bUNoYW5uZWxzKTtcblx0XHRcdFx0Ly8gLy8gVGhlIGZvbGxvd2luZyB3b3JrcyBpbiBDaHJvbWUuXG5cdFx0XHRcdC8vIHZhbHVlcyA9IG5ldyBVaW50MTZBcnJheSh3aWR0aCAqIGhlaWdodCAqIGdsTnVtQ2hhbm5lbHMpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgVU5TSUdORURfSU5UOlxuXHRcdFx0XHQvLyBGaXJlZm94IHJlcXVpcmVzIHRoYXQgUkdCQV9JTlRFR0VSL1VOU0lHTkVEX0lOVCBpcyB1c2VkIGZvciByZWFkUGl4ZWxzIG9mIHVuc2lnbmVkIGludCB0eXBlcy5cblx0XHRcdFx0Z2xOdW1DaGFubmVscyA9IDQ7XG5cdFx0XHRcdGdsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHQkFfSU5URUdFUjtcblx0XHRcdFx0dmFsdWVzID0gbmV3IFVpbnQzMkFycmF5KHdpZHRoICogaGVpZ2h0ICogZ2xOdW1DaGFubmVscyk7XG5cdFx0XHRcdC8vIC8vIFRoZSBmb2xsb3dpbmcgd29ya3MgaW4gQ2hyb21lLlxuXHRcdFx0XHQvLyB2YWx1ZXMgPSBuZXcgVWludDMyQXJyYXkod2lkdGggKiBoZWlnaHQgKiBnbE51bUNoYW5uZWxzKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIEJZVEU6XG5cdFx0XHRcdC8vIEZpcmVmb3ggcmVxdWlyZXMgdGhhdCBSR0JBX0lOVEVHRVIvSU5UIGlzIHVzZWQgZm9yIHJlYWRQaXhlbHMgb2YgaW50IHR5cGVzLlxuXHRcdFx0XHRnbE51bUNoYW5uZWxzID0gNDtcblx0XHRcdFx0Z2xGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkdCQV9JTlRFR0VSO1xuXHRcdFx0XHRnbFR5cGUgPSBnbC5JTlQ7XG5cdFx0XHRcdHZhbHVlcyA9IG5ldyBJbnQzMkFycmF5KHdpZHRoICogaGVpZ2h0ICogZ2xOdW1DaGFubmVscyk7XG5cdFx0XHRcdC8vIC8vIFRoZSBmb2xsb3dpbmcgd29ya3MgaW4gQ2hyb21lLlxuXHRcdFx0XHQvLyB2YWx1ZXMgPSBuZXcgSW50OEFycmF5KHdpZHRoICogaGVpZ2h0ICogZ2xOdW1DaGFubmVscyk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBTSE9SVDpcblx0XHRcdFx0Ly8gRmlyZWZveCByZXF1aXJlcyB0aGF0IFJHQkFfSU5URUdFUi9JTlQgaXMgdXNlZCBmb3IgcmVhZFBpeGVscyBvZiBpbnQgdHlwZXMuXG5cdFx0XHRcdGdsTnVtQ2hhbm5lbHMgPSA0O1xuXHRcdFx0XHRnbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR0JBX0lOVEVHRVI7XG5cdFx0XHRcdGdsVHlwZSA9IGdsLklOVDtcblx0XHRcdFx0dmFsdWVzID0gbmV3IEludDMyQXJyYXkod2lkdGggKiBoZWlnaHQgKiBnbE51bUNoYW5uZWxzKTtcblx0XHRcdFx0Ly8gLy8gVGhlIGZvbGxvd2luZyB3b3JrcyBpbiBDaHJvbWUuXG5cdFx0XHRcdC8vIHZhbHVlcyA9IG5ldyBJbnQxNkFycmF5KHdpZHRoICogaGVpZ2h0ICogZ2xOdW1DaGFubmVscyk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBJTlQ6XG5cdFx0XHRcdC8vIEZpcmVmb3ggcmVxdWlyZXMgdGhhdCBSR0JBX0lOVEVHRVIvSU5UIGlzIHVzZWQgZm9yIHJlYWRQaXhlbHMgb2YgaW50IHR5cGVzLlxuXHRcdFx0XHRnbE51bUNoYW5uZWxzID0gNDtcblx0XHRcdFx0Z2xGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkdCQV9JTlRFR0VSO1xuXHRcdFx0XHR2YWx1ZXMgPSBuZXcgSW50MzJBcnJheSh3aWR0aCAqIGhlaWdodCAqIGdsTnVtQ2hhbm5lbHMpO1xuXHRcdFx0XHQvLyAvLyBUaGUgZm9sbG93aW5nIHdvcmtzIGluIENocm9tZS5cblx0XHRcdFx0Ly8gdmFsdWVzID0gbmV3IEludDMyQXJyYXkod2lkdGggKiBoZWlnaHQgKiBnbE51bUNoYW5uZWxzKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGludGVybmFsVHlwZSAke2ludGVybmFsVHlwZX0gZm9yIGdldFZhbHVlcygpLmApO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLnJlYWR5VG9SZWFkKCkpIHtcblx0XHRcdC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9XZWJHTFJlbmRlcmluZ0NvbnRleHQvcmVhZFBpeGVsc1xuXHRcdFx0Z2wucmVhZFBpeGVscygwLCAwLCB3aWR0aCwgaGVpZ2h0LCBnbEZvcm1hdCwgZ2xUeXBlLCB2YWx1ZXMpO1xuXHRcdFx0Y29uc3QgeyBudW1Db21wb25lbnRzLCB0eXBlIH0gPSBkYXRhTGF5ZXI7XG5cdFx0XHRjb25zdCBPVVRQVVRfTEVOR1RIID0gd2lkdGggKiBoZWlnaHQgKiBudW1Db21wb25lbnRzO1xuXG5cdFx0XHQvLyBDb252ZXJ0IHVpbnQxNiB0byBmbG9hdDMyIGlmIG5lZWRlZC5cblx0XHRcdGNvbnN0IGhhbmRsZUZsb2F0MTZDb252ZXJzaW9uID0gaW50ZXJuYWxUeXBlID09PSBIQUxGX0ZMT0FUICYmIHZhbHVlcy5jb25zdHJ1Y3RvciA9PT0gVWludDE2QXJyYXk7XG5cdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRjb25zdCB2aWV3ID0gaGFuZGxlRmxvYXQxNkNvbnZlcnNpb24gPyBuZXcgRGF0YVZpZXcoKHZhbHVlcyBhcyBVaW50MTZBcnJheSkuYnVmZmVyKSA6IHVuZGVmaW5lZDtcblxuXHRcdFx0bGV0IG91dHB1dDogRGF0YUxheWVyQXJyYXlUeXBlID0gdmFsdWVzO1xuXHRcdFx0XG5cdFx0XHQvLyBXZSBtYXkgdXNlIGEgZGlmZmVyZW50IGludGVybmFsIHR5cGUgdGhhbiB0aGUgYXNzaWduZWQgdHlwZSBvZiB0aGUgRGF0YUxheWVyLlxuXHRcdFx0aWYgKGludGVybmFsVHlwZSAhPT0gdHlwZSkge1xuXHRcdFx0XHRzd2l0Y2ggKHR5cGUpIHtcblx0XHRcdFx0XHRjYXNlIEhBTEZfRkxPQVQ6XG5cdFx0XHRcdFx0Y2FzZSBGTE9BVDpcblx0XHRcdFx0XHRcdG91dHB1dCA9IG5ldyBGbG9hdDMyQXJyYXkoT1VUUFVUX0xFTkdUSCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIFVOU0lHTkVEX0JZVEU6XG5cdFx0XHRcdFx0XHRvdXRwdXQgPSBuZXcgVWludDhBcnJheShPVVRQVVRfTEVOR1RIKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgQllURTpcblx0XHRcdFx0XHRcdG91dHB1dCA9IG5ldyBJbnQ4QXJyYXkoT1VUUFVUX0xFTkdUSCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIFVOU0lHTkVEX1NIT1JUOlxuXHRcdFx0XHRcdFx0b3V0cHV0ID0gbmV3IFVpbnQxNkFycmF5KE9VVFBVVF9MRU5HVEgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBTSE9SVDpcblx0XHRcdFx0XHRcdG91dHB1dCA9IG5ldyBJbnQxNkFycmF5KE9VVFBVVF9MRU5HVEgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBVTlNJR05FRF9JTlQ6XG5cdFx0XHRcdFx0XHRvdXRwdXQgPSBuZXcgVWludDMyQXJyYXkoT1VUUFVUX0xFTkdUSCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIElOVDpcblx0XHRcdFx0XHRcdG91dHB1dCA9IG5ldyBJbnQzMkFycmF5KE9VVFBVVF9MRU5HVEgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgdHlwZSAke3R5cGV9IGZvciBnZXRWYWx1ZXMoKS5gKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBJbiBzb21lIGNhc2VzIGdsTnVtQ2hhbm5lbHMgbWF5IGJlID4gbnVtQ29tcG9uZW50cy5cblx0XHRcdGlmIChoYW5kbGVGbG9hdDE2Q29udmVyc2lvbiB8fCBvdXRwdXQgIT09IHZhbHVlcyB8fCBudW1Db21wb25lbnRzICE9PSBnbE51bUNoYW5uZWxzKSB7XG5cdFx0XHRcdGZvciAobGV0IGkgPSAwLCBsZW5ndGggPSB3aWR0aCAqIGhlaWdodDsgaSA8IGxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0Y29uc3QgaW5kZXgxID0gaSAqIGdsTnVtQ2hhbm5lbHM7XG5cdFx0XHRcdFx0Y29uc3QgaW5kZXgyID0gaSAqIG51bUNvbXBvbmVudHM7XG5cdFx0XHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCBudW1Db21wb25lbnRzOyBqKyspIHtcblx0XHRcdFx0XHRcdGlmIChoYW5kbGVGbG9hdDE2Q29udmVyc2lvbikge1xuXHRcdFx0XHRcdFx0XHRvdXRwdXRbaW5kZXgyICsgal0gPSBnZXRGbG9hdDE2KHZpZXchLCAyICogKGluZGV4MSArIGopLCB0cnVlKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdG91dHB1dFtpbmRleDIgKyBqXSA9IHZhbHVlc1tpbmRleDEgKyBqXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKG91dHB1dC5sZW5ndGggIT09IE9VVFBVVF9MRU5HVEgpIHtcblx0XHRcdFx0b3V0cHV0ID0gb3V0cHV0LnNsaWNlKDAsIE9VVFBVVF9MRU5HVEgpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG91dHB1dDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gcmVhZCB2YWx1ZXMgZnJvbSBCdWZmZXIgd2l0aCBzdGF0dXM6ICR7Z2wuY2hlY2tGcmFtZWJ1ZmZlclN0YXR1cyhnbC5GUkFNRUJVRkZFUil9LmApO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgcmVhZHlUb1JlYWQoKSB7XG5cdFx0Y29uc3QgeyBnbCB9ID0gdGhpcztcblx0XHRyZXR1cm4gZ2wuY2hlY2tGcmFtZWJ1ZmZlclN0YXR1cyhnbC5GUkFNRUJVRkZFUikgPT0gZ2wuRlJBTUVCVUZGRVJfQ09NUExFVEU7XG5cdH07XG5cblx0c2F2ZVBORyhkYXRhTGF5ZXI6IERhdGFMYXllciwgZmlsZW5hbWUgPSBkYXRhTGF5ZXIubmFtZSwgZHBpPzogbnVtYmVyKSB7XG5cdFx0Y29uc3QgdmFsdWVzID0gdGhpcy5nZXRWYWx1ZXMoZGF0YUxheWVyKTtcblx0XHRjb25zdCBbd2lkdGgsIGhlaWdodF0gPSBkYXRhTGF5ZXIuZ2V0RGltZW5zaW9ucygpO1xuXG5cdFx0Y29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG5cdFx0Y2FudmFzLndpZHRoID0gd2lkdGg7XG4gICAgXHRjYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xuXHRcdGNvbnN0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKSE7XG5cdFx0Y29uc3QgaW1hZ2VEYXRhID0gY29udGV4dC5nZXRJbWFnZURhdGEoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG5cdFx0Y29uc3QgYnVmZmVyID0gaW1hZ2VEYXRhLmRhdGE7XG5cdFx0Ly8gVE9ETzogdGhpcyBpc24ndCB3b3JraW5nIGZvciBVTlNJR05FRF9CWVRFIHR5cGVzP1xuXHRcdGNvbnN0IGlzRmxvYXQgPSBkYXRhTGF5ZXIudHlwZSA9PT0gRkxPQVQgfHwgZGF0YUxheWVyLnR5cGUgPT09IEhBTEZfRkxPQVQ7XG5cdFx0Ly8gSGF2ZSB0byBmbGlwIHRoZSB5IGF4aXMgc2luY2UgUE5HcyBhcmUgd3JpdHRlbiB0b3AgdG8gYm90dG9tLlxuXHRcdGZvciAobGV0IHkgPSAwOyB5IDwgaGVpZ2h0OyB5KyspIHtcblx0XHRcdGZvciAobGV0IHggPSAwOyB4IDwgd2lkdGg7IHgrKykge1xuXHRcdFx0XHRjb25zdCBpbmRleCA9IHkgKiB3aWR0aCArIHg7XG5cdFx0XHRcdGNvbnN0IGluZGV4RmxpcHBlZCA9IChoZWlnaHQgLSAxIC0geSkgKiB3aWR0aCArIHg7XG5cdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YUxheWVyLm51bUNvbXBvbmVudHM7IGkrKykge1xuXHRcdFx0XHRcdGJ1ZmZlcls0ICogaW5kZXhGbGlwcGVkICsgaV0gPSB2YWx1ZXNbZGF0YUxheWVyLm51bUNvbXBvbmVudHMgKiBpbmRleCArIGldICogKGlzRmxvYXQgPyAyNTUgOiAxKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoZGF0YUxheWVyLm51bUNvbXBvbmVudHMgPCA0KSB7XG5cdFx0XHRcdFx0YnVmZmVyWzQgKiBpbmRleEZsaXBwZWQgKyAzXSA9IDI1NTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHQvLyBjb25zb2xlLmxvZyh2YWx1ZXMsIGJ1ZmZlcik7XG5cdFx0Y29udGV4dC5wdXRJbWFnZURhdGEoaW1hZ2VEYXRhLCAwLCAwKTtcblxuXHRcdGNhbnZhcyEudG9CbG9iKChibG9iKSA9PiB7XG5cdFx0XHRpZiAoIWJsb2IpIHtcblx0XHRcdFx0Y29uc29sZS53YXJuKCdQcm9ibGVtIHNhdmluZyBQTkcsIHVuYWJsZSB0byBpbml0IGJsb2IuJyk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGlmIChkcGkpIHtcblx0XHRcdFx0Y2hhbmdlRHBpQmxvYihibG9iLCBkcGkpLnRoZW4oKGJsb2I6IEJsb2IpID0+e1xuXHRcdFx0XHRcdHNhdmVBcyhibG9iLCBgJHtmaWxlbmFtZX0ucG5nYCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c2F2ZUFzKGJsb2IsIGAke2ZpbGVuYW1lfS5wbmdgKTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdH0sICdpbWFnZS9wbmcnKTtcblx0fVxuXG4gICAgcmVzZXQoKSB7XG5cdFx0Ly8gVE9ETzogaW1wbGVtZW50IHRoaXMuXG5cdFx0dGhyb3cgbmV3IEVycm9yKCdXZWJHTENvbXB1dGUucmVzZXQoKSBub3QgaW1wbGVtZW50ZWQuJyk7XG5cdH07XG5cblx0YXR0YWNoRGF0YUxheWVyVG9UaHJlZVRleHR1cmUoZGF0YUxheWVyOiBEYXRhTGF5ZXIsIHRleHR1cmU6IFRleHR1cmUpIHtcblx0XHRpZiAoIXRoaXMucmVuZGVyZXIpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignV2ViR0xDb21wdXRlIHdhcyBub3QgaW5pdGVkIHdpdGggYSByZW5kZXJlci4nKTtcblx0XHR9XG5cdFx0Ly8gTGluayB3ZWJnbCB0ZXh0dXJlIHRvIHRocmVlanMgb2JqZWN0LlxuXHRcdC8vIFRoaXMgaXMgbm90IG9mZmljaWFsbHkgc3VwcG9ydGVkLlxuXHRcdGlmIChkYXRhTGF5ZXIubnVtQnVmZmVycyA+IDEpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgRGF0YUxheWVyIFwiJHtkYXRhTGF5ZXIubmFtZX1cIiBjb250YWlucyBtdWx0aXBsZSBXZWJHTCB0ZXh0dXJlcyAob25lIGZvciBlYWNoIGJ1ZmZlcikgdGhhdCBhcmUgZmxpcC1mbG9wcGVkIGR1cmluZyBjb21wdXRlIGN5Y2xlcywgcGxlYXNlIGNob29zZSBhIERhdGFMYXllciB3aXRoIG9uZSBidWZmZXIuYCk7XG5cdFx0fVxuXHRcdGNvbnN0IG9mZnNldFRleHR1cmVQcm9wZXJ0aWVzID0gdGhpcy5yZW5kZXJlci5wcm9wZXJ0aWVzLmdldCh0ZXh0dXJlKTtcblx0XHRvZmZzZXRUZXh0dXJlUHJvcGVydGllcy5fX3dlYmdsVGV4dHVyZSA9IGRhdGFMYXllci5nZXRDdXJyZW50U3RhdGVUZXh0dXJlKCk7XG5cdFx0b2Zmc2V0VGV4dHVyZVByb3BlcnRpZXMuX193ZWJnbEluaXQgPSB0cnVlO1xuXHR9XG5cblx0cmVzZXRUaHJlZVN0YXRlKCkge1xuXHRcdGlmICghdGhpcy5yZW5kZXJlcikge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdXZWJHTENvbXB1dGUgd2FzIG5vdCBpbml0ZWQgd2l0aCBhIHJlbmRlcmVyLicpO1xuXHRcdH1cblx0XHRjb25zdCB7IGdsIH0gPSB0aGlzO1xuXHRcdC8vIFJlc2V0IHZpZXdwb3J0LlxuXHRcdGNvbnN0IHZpZXdwb3J0ID0gdGhpcy5yZW5kZXJlci5nZXRWaWV3cG9ydChuZXcgdXRpbHMuVmVjdG9yNCgpIGFzIFZlY3RvcjQpO1xuXHRcdGdsLnZpZXdwb3J0KHZpZXdwb3J0LngsIHZpZXdwb3J0LnksIHZpZXdwb3J0LndpZHRoLCB2aWV3cG9ydC5oZWlnaHQpO1xuXHRcdC8vIFVuYmluZCBmcmFtZWJ1ZmZlciAocmVuZGVyIHRvIHNjcmVlbikuXG5cdFx0dGhpcy5yZW5kZXJlci5zZXRSZW5kZXJUYXJnZXQobnVsbCk7XG5cdFx0Ly8gUmVzZXQgdGV4dHVyZSBiaW5kaW5ncy5cblx0XHR0aGlzLnJlbmRlcmVyLnJlc2V0U3RhdGUoKTtcblx0fVxuXHRcblx0ZGVzdHJveSgpIHtcblx0XHQvLyBUT0RPOiBOZWVkIHRvIGltcGxlbWVudCB0aGlzLlxuXHRcdGRlbGV0ZSB0aGlzLnJlbmRlcmVyO1xuXHR9XG59IiwiY29uc3QgZXh0ZW5zaW9uczogeyBba2V5OiBzdHJpbmddOiBhbnkgfSA9IHt9O1xuXG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvT0VTX3RleHR1cmVfZmxvYXRcbi8vIEZsb2F0IGlzIHByb3ZpZGVkIGJ5IGRlZmF1bHQgaW4gV2ViR0wyIGNvbnRleHRzLlxuLy8gVGhpcyBleHRlbnNpb24gaW1wbGljaXRseSBlbmFibGVzIHRoZSBXRUJHTF9jb2xvcl9idWZmZXJfZmxvYXQgZXh0ZW5zaW9uIChpZiBzdXBwb3J0ZWQpLCB3aGljaCBhbGxvd3MgcmVuZGVyaW5nIHRvIDMyLWJpdCBmbG9hdGluZy1wb2ludCBjb2xvciBidWZmZXJzLlxuZXhwb3J0IGNvbnN0IE9FU19URVhUVVJFX0ZMT0FUID0gJ09FU190ZXh0dXJlX2Zsb2F0Jztcbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9PRVNfdGV4dHVyZV9oYWxmX2Zsb2F0XG4vLyBIYWxmIGZsb2F0IGlzIHN1cHBvcnRlZCBieSBtb2Rlcm4gbW9iaWxlIGJyb3dzZXJzLCBmbG9hdCBub3QgeWV0IHN1cHBvcnRlZC5cbi8vIEhhbGYgZmxvYXQgaXMgcHJvdmlkZWQgYnkgZGVmYXVsdCBmb3IgV2ViZ2wyIGNvbnRleHRzLlxuLy8gVGhpcyBleHRlbnNpb24gaW1wbGljaXRseSBlbmFibGVzIHRoZSBFWFRfY29sb3JfYnVmZmVyX2hhbGZfZmxvYXQgZXh0ZW5zaW9uIChpZiBzdXBwb3J0ZWQpLCB3aGljaCBhbGxvd3MgcmVuZGVyaW5nIHRvIDE2LWJpdCBmbG9hdGluZyBwb2ludCBmb3JtYXRzLlxuZXhwb3J0IGNvbnN0IE9FU19URVhUVVJFX0hBTEZfRkxPQVQgPSAnT0VTX3RleHR1cmVfaGFsZl9mbG9hdCc7XG4vLyBUT0RPOiBTZWVtcyBsaWtlIGxpbmVhciBmaWx0ZXJpbmcgb2YgZmxvYXRzIG1heSBiZSBzdXBwb3J0ZWQgaW4gc29tZSBicm93c2VycyB3aXRob3V0IHRoZXNlIGV4dGVuc2lvbnM/XG4vLyBodHRwczovL3d3dy5raHJvbm9zLm9yZy9yZWdpc3RyeS9PcGVuR0wvZXh0ZW5zaW9ucy9PRVMvT0VTX3RleHR1cmVfZmxvYXRfbGluZWFyLnR4dFxuZXhwb3J0IGNvbnN0IE9FU19URVhUVVJFX0ZMT0FUX0xJTkVBUiA9ICdPRVNfdGV4dHVyZV9mbG9hdF9saW5lYXInO1xuZXhwb3J0IGNvbnN0IE9FU19URVhUVVJFX0hBbEZfRkxPQVRfTElORUFSID0gJ09FU190ZXh0dXJlX2hhbGZfZmxvYXRfbGluZWFyJztcbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9XRUJHTF9kZXB0aF90ZXh0dXJlXG4vLyBBZGRzIGdsLlVOU0lHTkVEX1NIT1JULCBnbC5VTlNJR05FRF9JTlQgdHlwZXMgdG8gdGV4dEltYWdlMkQgaW4gV2ViR0wxLjBcbmV4cG9ydCBjb25zdCBXRUJHTF9ERVBUSF9URVhUVVJFID0gJ1dFQkdMX2RlcHRoX3RleHR1cmUnO1xuLy8gRVhUX0NPTE9SX0JVRkZFUl9GTE9BVCBhZGRzIGFiaWxpdHkgdG8gcmVuZGVyIHRvIGEgdmFyaWV0eSBvZiBmbG9hdGluZyBwdCB0ZXh0dXJlcy5cbi8vIFRoaXMgaXMgbmVlZGVkIGZvciB0aGUgV2ViR0wyIGNvbnRleHRzIHRoYXQgZG8gbm90IHN1cHBvcnQgT0VTX1RFWFRVUkVfRkxPQVQgLyBPRVNfVEVYVFVSRV9IQUxGX0ZMT0FUIGV4dGVuc2lvbnMuXG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRVhUX2NvbG9yX2J1ZmZlcl9mbG9hdFxuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMzQyNjI0OTMvZnJhbWVidWZmZXItaW5jb21wbGV0ZS1hdHRhY2htZW50LWZvci10ZXh0dXJlLXdpdGgtaW50ZXJuYWwtZm9ybWF0XG4vLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8zNjEwOTM0Ny9mcmFtZWJ1ZmZlci1pbmNvbXBsZXRlLWF0dGFjaG1lbnQtb25seS1oYXBwZW5zLW9uLWFuZHJvaWQtdy1maXJlZm94XG5leHBvcnQgY29uc3QgRVhUX0NPTE9SX0JVRkZFUl9GTE9BVCA9ICdFWFRfY29sb3JfYnVmZmVyX2Zsb2F0JztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEV4dGVuc2lvbihcblx0Z2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCB8IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQsXG5cdGV4dGVuc2lvbk5hbWU6IHN0cmluZyxcblx0ZXJyb3JDYWxsYmFjazogKG1lc3NhZ2U6IHN0cmluZykgPT4gdm9pZCxcblx0b3B0aW9uYWwgPSBmYWxzZSxcbikge1xuXHQvLyBDaGVjayBpZiB3ZSd2ZSBhbHJlYWR5IGxvYWRlZCB0aGUgZXh0ZW5zaW9uLlxuXHRpZiAoZXh0ZW5zaW9uc1tleHRlbnNpb25OYW1lXSAhPT0gdW5kZWZpbmVkKSByZXR1cm4gZXh0ZW5zaW9uc1tleHRlbnNpb25OYW1lXTtcblxuXHRsZXQgZXh0ZW5zaW9uO1xuXHR0cnkge1xuXHRcdGV4dGVuc2lvbiA9IGdsLmdldEV4dGVuc2lvbihleHRlbnNpb25OYW1lKTtcblx0fSBjYXRjaCAoZSkge31cblx0aWYgKGV4dGVuc2lvbikge1xuXHRcdC8vIENhY2hlIHRoaXMgZXh0ZW5zaW9uLlxuXHRcdGV4dGVuc2lvbnNbZXh0ZW5zaW9uTmFtZV0gPSBleHRlbnNpb247XG5cdFx0Y29uc29sZS5sb2coYExvYWRlZCBleHRlbnNpb246ICR7ZXh0ZW5zaW9uTmFtZX0uYCk7XG5cdH0gZWxzZSB7XG5cdFx0ZXh0ZW5zaW9uc1tleHRlbnNpb25OYW1lXSA9IGZhbHNlOyAvLyBDYWNoZSB0aGUgYmFkIGV4dGVuc2lvbiBsb29rdXAuXG5cdFx0Y29uc29sZS53YXJuKGBVbnN1cHBvcnRlZCAke29wdGlvbmFsID8gJ29wdGlvbmFsICcgOiAnJ31leHRlbnNpb246ICR7ZXh0ZW5zaW9uTmFtZX0uYCk7XG5cdH1cblx0Ly8gSWYgdGhlIGV4dGVuc2lvbiBpcyBub3Qgb3B0aW9uYWwsIHRocm93IGVycm9yLlxuXHRpZiAoIWV4dGVuc2lvbiAmJiAhb3B0aW9uYWwpIHtcblx0XHRlcnJvckNhbGxiYWNrKGBSZXF1aXJlZCBleHRlbnNpb24gdW5zdXBwb3J0ZWQgYnkgdGhpcyBkZXZpY2UgLyBicm93c2VyOiAke2V4dGVuc2lvbk5hbWV9LmApO1xuXHR9XG5cdHJldHVybiBleHRlbnNpb247XG59IiwiaW1wb3J0IHsgV2ViR0xDb21wdXRlIH0gZnJvbSAnLi9XZWJHTENvbXB1dGUnO1xuZXhwb3J0ICogZnJvbSAnLi9Db25zdGFudHMnO1xuXG5leHBvcnQge1xuXHRXZWJHTENvbXB1dGUsXG59OyIsIi8vIENvcGllZCBmcm9tIGh0dHA6Ly93ZWJnbGZ1bmRhbWVudGFscy5vcmcvd2ViZ2wvbGVzc29ucy93ZWJnbC1ib2lsZXJwbGF0ZS5odG1sXG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZVNoYWRlcihcblx0Z2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCB8IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQsXG5cdGVycm9yQ2FsbGJhY2s6IChtZXNzYWdlOiBzdHJpbmcpID0+IHZvaWQsXG5cdHNoYWRlclNvdXJjZTogc3RyaW5nLFxuXHRzaGFkZXJUeXBlOiBudW1iZXIsXG5cdHByb2dyYW1OYW1lPzogc3RyaW5nLFxuKSB7XG5cdC8vIENyZWF0ZSB0aGUgc2hhZGVyIG9iamVjdFxuXHRjb25zdCBzaGFkZXIgPSBnbC5jcmVhdGVTaGFkZXIoc2hhZGVyVHlwZSk7XG5cdGlmICghc2hhZGVyKSB7XG5cdFx0ZXJyb3JDYWxsYmFjaygnVW5hYmxlIHRvIGluaXQgZ2wgc2hhZGVyLicpO1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0Ly8gU2V0IHRoZSBzaGFkZXIgc291cmNlIGNvZGUuXG5cdGdsLnNoYWRlclNvdXJjZShzaGFkZXIsIHNoYWRlclNvdXJjZSk7XG5cblx0Ly8gQ29tcGlsZSB0aGUgc2hhZGVyXG5cdGdsLmNvbXBpbGVTaGFkZXIoc2hhZGVyKTtcblxuXHQvLyBDaGVjayBpZiBpdCBjb21waWxlZFxuXHRjb25zdCBzdWNjZXNzID0gZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHNoYWRlciwgZ2wuQ09NUElMRV9TVEFUVVMpO1xuXHRpZiAoIXN1Y2Nlc3MpIHtcblx0XHQvLyBTb21ldGhpbmcgd2VudCB3cm9uZyBkdXJpbmcgY29tcGlsYXRpb24gLSBwcmludCB0aGUgZXJyb3IuXG5cdFx0ZXJyb3JDYWxsYmFjayhgQ291bGQgbm90IGNvbXBpbGUgJHtzaGFkZXJUeXBlID09PSBnbC5GUkFHTUVOVF9TSEFERVIgPyAnZnJhZ21lbnQnIDogJ3ZlcnRleCd9XG5cdFx0XHQgc2hhZGVyJHtwcm9ncmFtTmFtZSA/IGAgZm9yIHByb2dyYW0gXCIke3Byb2dyYW1OYW1lfVwiYCA6ICcnfTogJHtnbC5nZXRTaGFkZXJJbmZvTG9nKHNoYWRlcil9LmApO1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdHJldHVybiBzaGFkZXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1dlYkdMMihnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0IHwgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkge1xuXHQvLyBUaGlzIGNvZGUgaXMgcHVsbGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL21yZG9vYi90aHJlZS5qcy9ibG9iL21hc3Rlci9zcmMvcmVuZGVyZXJzL3dlYmdsL1dlYkdMQ2FwYWJpbGl0aWVzLmpzXG5cdC8vIEB0cy1pZ25vcmVcblx0cmV0dXJuICh0eXBlb2YgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCAhPT0gJ3VuZGVmaW5lZCcgJiYgZ2wgaW5zdGFuY2VvZiBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KSB8fCAodHlwZW9mIFdlYkdMMkNvbXB1dGVSZW5kZXJpbmdDb250ZXh0ICE9PSAndW5kZWZpbmVkJyAmJiBnbCBpbnN0YW5jZW9mIFdlYkdMMkNvbXB1dGVSZW5kZXJpbmdDb250ZXh0KTtcblx0Ly8gcmV0dXJuICEhKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLkhBTEZfRkxPQVQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1Bvd2VyT2YyKHZhbHVlOiBudW1iZXIpIHtcblx0cmV0dXJuICh2YWx1ZSAmICh2YWx1ZSAtIDEpKSA9PSAwO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5pdFNlcXVlbnRpYWxGbG9hdEFycmF5KGxlbmd0aDogbnVtYmVyKSB7XG5cdGNvbnN0IGFycmF5ID0gbmV3IEZsb2F0MzJBcnJheShsZW5ndGgpO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG5cdFx0YXJyYXlbaV0gPSBpO1xuXHR9XG5cdHJldHVybiBhcnJheTtcbn0iLCIvLyBUaGVzZSBhcmUgdGhlIHBhcnRzIG9mIHRocmVlanMgVmVjdG9yNCB0aGF0IHdlIG5lZWQuXG5leHBvcnQgY2xhc3MgVmVjdG9yNCB7XG5cdHg6IG51bWJlcjtcblx0eTogbnVtYmVyO1xuXHR6OiBudW1iZXI7XG5cdHc6IG51bWJlcjtcblx0Y29uc3RydWN0b3IoIHggPSAwLCB5ID0gMCwgeiA9IDAsIHcgPSAxICkge1xuXHRcdHRoaXMueCA9IHg7XG5cdFx0dGhpcy55ID0geTtcblx0XHR0aGlzLnogPSB6O1xuXHRcdHRoaXMudyA9IHc7XG5cdH1cblx0Z2V0IHdpZHRoKCkge1xuXHRcdHJldHVybiB0aGlzLno7XG5cdH1cblx0Z2V0IGhlaWdodCgpIHtcblx0XHRyZXR1cm4gdGhpcy53O1xuXHR9XG5cdGNvcHkodjogVmVjdG9yNCkge1xuXHRcdHRoaXMueCA9IHYueDtcblx0XHR0aGlzLnkgPSB2Lnk7XG5cdFx0dGhpcy56ID0gdi56O1xuXHRcdHRoaXMudyA9IHYudztcblx0XHRyZXR1cm4gdGhpcztcblx0fVxufSIsIm1vZHVsZS5leHBvcnRzID0gXCJwcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxuXFxudmFyeWluZyB2ZWMyIHZfVVY7XFxuXFxudW5pZm9ybSBzYW1wbGVyMkQgdV9zdGF0ZTtcXG5cXG52b2lkIG1haW4oKSB7XFxuXFx0Z2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKHVfc3RhdGUsIHZfVVYpO1xcbn1cIiIsIm1vZHVsZS5leHBvcnRzID0gXCJwcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxucHJlY2lzaW9uIGhpZ2hwIGludDtcXG5cXG4vKipcXG4gKiBSZXR1cm5zIGFjY3VyYXRlIE1PRCB3aGVuIGFyZ3VtZW50cyBhcmUgYXBwcm94aW1hdGUgaW50ZWdlcnMuXFxuICovXFxuZmxvYXQgbW9kSShmbG9hdCBhLCBmbG9hdCBiKSB7XFxuICAgIGZsb2F0IG0gPSBhIC0gZmxvb3IoKGEgKyAwLjUpIC8gYikgKiBiO1xcbiAgICByZXR1cm4gZmxvb3IobSArIDAuNSk7XFxufVxcblxcbi8vIENhbm5vdCB1c2UgaW50IHZlcnRleCBhdHRyaWJ1dGVzOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yNzg3NDk4My93ZWJnbC1ob3ctdG8tdXNlLWludGVnZXItYXR0cmlidXRlcy1pbi1nbHNsXFxuYXR0cmlidXRlIGZsb2F0IGFfaW50ZXJuYWxfaW5kZXg7IC8vIEluZGV4IG9mIHBvaW50LlxcblxcbnVuaWZvcm0gc2FtcGxlcjJEIHVfaW50ZXJuYWxfcG9zaXRpb25zOyAvLyBUZXh0dXJlIGxvb2t1cCB3aXRoIHBvc2l0aW9uIGRhdGEuXFxudW5pZm9ybSB2ZWMyIHVfaW50ZXJuYWxfcG9zaXRpb25zRGltZW5zaW9ucztcXG51bmlmb3JtIHZlYzIgdV9pbnRlcm5hbF9zY2FsZTtcXG51bmlmb3JtIGJvb2wgdV9pbnRlcm5hbF9wb3NpdGlvbldpdGhBY2N1bXVsYXRpb247XFxudW5pZm9ybSBib29sIHVfaW50ZXJuYWxfd3JhcFg7XFxudW5pZm9ybSBib29sIHVfaW50ZXJuYWxfd3JhcFk7XFxuXFxudmFyeWluZyB2ZWMyIHZfVVY7XFxudmFyeWluZyB2ZWMyIHZfbGluZVdyYXBwaW5nOyAvLyBVc2UgdGhpcyB0byB0ZXN0IGlmIGxpbmUgaXMgb25seSBoYWxmIHdyYXBwZWQgYW5kIHNob3VsZCBub3QgYmUgcmVuZGVyZWQuXFxuXFxudm9pZCBtYWluKCkge1xcblxcdC8vIENhbGN1bGF0ZSBhIHV2IGJhc2VkIG9uIHRoZSBwb2ludCdzIGluZGV4IGF0dHJpYnV0ZS5cXG5cXHR2ZWMyIHBhcnRpY2xlVVYgPSB2ZWMyKFxcblxcdFxcdG1vZEkoYV9pbnRlcm5hbF9pbmRleCwgdV9pbnRlcm5hbF9wb3NpdGlvbnNEaW1lbnNpb25zLngpLFxcblxcdFxcdGZsb29yKGZsb29yKGFfaW50ZXJuYWxfaW5kZXggKyAwLjUpIC8gdV9pbnRlcm5hbF9wb3NpdGlvbnNEaW1lbnNpb25zLngpXFxuXFx0KSAvIHVfaW50ZXJuYWxfcG9zaXRpb25zRGltZW5zaW9ucztcXG5cXG5cXHQvLyBDYWxjdWxhdGUgYSBnbG9iYWwgdXYgZm9yIHRoZSB2aWV3cG9ydC5cXG5cXHQvLyBMb29rdXAgdmVydGV4IHBvc2l0aW9uIGFuZCBzY2FsZSB0byBbMCwgMV0gcmFuZ2UuXFxuXFx0Ly8gV2UgaGF2ZSBwYWNrZWQgYSAyRCBkaXNwbGFjZW1lbnQgd2l0aCB0aGUgcG9zaXRpb24uXFxuXFx0dmVjNCBwb3NpdGlvbkRhdGEgPSB0ZXh0dXJlMkQodV9pbnRlcm5hbF9wb3NpdGlvbnMsIHBhcnRpY2xlVVYpO1xcblxcdC8vIHBvc2l0aW9uID0gZmlyc3QgdHdvIGNvbXBvbmVudHMgcGx1cyBsYXN0IHR3byBjb21wb25lbnRzIChvcHRpb25hbCBhY2N1bXVsYXRpb24gYnVmZmVyKS5cXG5cXHR2ZWMyIHBvc2l0aW9uQWJzb2x1dGUgPSBwb3NpdGlvbkRhdGEucmc7XFxuXFx0aWYgKHVfaW50ZXJuYWxfcG9zaXRpb25XaXRoQWNjdW11bGF0aW9uKSBwb3NpdGlvbkFic29sdXRlICs9IHBvc2l0aW9uRGF0YS5iYTtcXG5cXHR2X1VWID0gcG9zaXRpb25BYnNvbHV0ZSAqIHVfaW50ZXJuYWxfc2NhbGU7XFxuXFxuXFx0Ly8gV3JhcCBpZiBuZWVkZWQuXFxuXFx0dl9saW5lV3JhcHBpbmcgPSB2ZWMyKDAuMCk7XFxuXFx0aWYgKHVfaW50ZXJuYWxfd3JhcFgpIHtcXG5cXHRcXHRpZiAodl9VVi54IDwgMC4wKSB7XFxuXFx0XFx0XFx0dl9VVi54ICs9IDEuMDtcXG5cXHRcXHRcXHR2X2xpbmVXcmFwcGluZy54ID0gMS4wO1xcblxcdFxcdH0gZWxzZSBpZiAodl9VVi54ID4gMS4wKSB7XFxuXFx0XFx0XFx0dl9VVi54IC09IDEuMDtcXG5cXHRcXHRcXHR2X2xpbmVXcmFwcGluZy54ID0gMS4wO1xcblxcdFxcdH1cXG5cXHR9XFxuXFx0aWYgKHVfaW50ZXJuYWxfd3JhcFkpIHtcXG5cXHRcXHRpZiAodl9VVi55IDwgMC4wKSB7XFxuXFx0XFx0XFx0dl9VVi55ICs9IDEuMDtcXG5cXHRcXHRcXHR2X2xpbmVXcmFwcGluZy55ID0gMS4wO1xcblxcdFxcdH0gZWxzZSBpZiAodl9VVi55ID4gMS4wKSB7XFxuXFx0XFx0XFx0dl9VVi55IC09IDEuMDtcXG5cXHRcXHRcXHR2X2xpbmVXcmFwcGluZy55ID0gMS4wO1xcblxcdFxcdH1cXG5cXHR9XFxuXFxuXFx0Ly8gQ2FsY3VsYXRlIHBvc2l0aW9uIGluIFstMSwgMV0gcmFuZ2UuXFxuXFx0dmVjMiBwb3NpdGlvbiA9IHZfVVYgKiAyLjAgLSAxLjA7XFxuXFxuXFx0Z2xfUG9zaXRpb24gPSB2ZWM0KHBvc2l0aW9uLCAwLCAxKTtcXG59XCIiLCJtb2R1bGUuZXhwb3J0cyA9IFwicHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcbnByZWNpc2lvbiBoaWdocCBpbnQ7XFxuXFxuLyoqXFxuICogUmV0dXJucyBhY2N1cmF0ZSBNT0Qgd2hlbiBhcmd1bWVudHMgYXJlIGFwcHJveGltYXRlIGludGVnZXJzLlxcbiAqL1xcbmZsb2F0IG1vZEkoZmxvYXQgYSwgZmxvYXQgYikge1xcbiAgICBmbG9hdCBtID0gYSAtIGZsb29yKChhICsgMC41KSAvIGIpICogYjtcXG4gICAgcmV0dXJuIGZsb29yKG0gKyAwLjUpO1xcbn1cXG5cXG4vLyBDYW5ub3QgdXNlIGludCB2ZXJ0ZXggYXR0cmlidXRlczogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjc4NzQ5ODMvd2ViZ2wtaG93LXRvLXVzZS1pbnRlZ2VyLWF0dHJpYnV0ZXMtaW4tZ2xzbFxcbmF0dHJpYnV0ZSBmbG9hdCBhX2ludGVybmFsX2luZGV4OyAvLyBJbmRleCBvZiBwb2ludC5cXG5cXG51bmlmb3JtIHNhbXBsZXIyRCB1X2ludGVybmFsX3Bvc2l0aW9uczsgLy8gVGV4dHVyZSBsb29rdXAgd2l0aCBwb3NpdGlvbiBkYXRhLlxcbnVuaWZvcm0gdmVjMiB1X2ludGVybmFsX3Bvc2l0aW9uc0RpbWVuc2lvbnM7XFxudW5pZm9ybSB2ZWMyIHVfaW50ZXJuYWxfc2NhbGU7XFxudW5pZm9ybSBmbG9hdCB1X2ludGVybmFsX3BvaW50U2l6ZTtcXG51bmlmb3JtIGJvb2wgdV9pbnRlcm5hbF9wb3NpdGlvbldpdGhBY2N1bXVsYXRpb247XFxudW5pZm9ybSBib29sIHVfaW50ZXJuYWxfd3JhcFg7XFxudW5pZm9ybSBib29sIHVfaW50ZXJuYWxfd3JhcFk7XFxuXFxudmFyeWluZyB2ZWMyIHZfVVY7XFxuXFxudm9pZCBtYWluKCkge1xcblxcdC8vIENhbGN1bGF0ZSBhIHV2IGJhc2VkIG9uIHRoZSBwb2ludCdzIGluZGV4IGF0dHJpYnV0ZS5cXG5cXHR2ZWMyIHBhcnRpY2xlVVYgPSB2ZWMyKFxcblxcdFxcdG1vZEkoYV9pbnRlcm5hbF9pbmRleCwgdV9pbnRlcm5hbF9wb3NpdGlvbnNEaW1lbnNpb25zLngpLFxcblxcdFxcdGZsb29yKGZsb29yKGFfaW50ZXJuYWxfaW5kZXggKyAwLjUpIC8gdV9pbnRlcm5hbF9wb3NpdGlvbnNEaW1lbnNpb25zLngpXFxuXFx0KSAvIHVfaW50ZXJuYWxfcG9zaXRpb25zRGltZW5zaW9ucztcXG5cXG5cXHQvLyBDYWxjdWxhdGUgYSBnbG9iYWwgdXYgZm9yIHRoZSB2aWV3cG9ydC5cXG5cXHQvLyBMb29rdXAgdmVydGV4IHBvc2l0aW9uIGFuZCBzY2FsZSB0byBbMCwgMV0gcmFuZ2UuXFxuXFx0Ly8gV2UgaGF2ZSBwYWNrZWQgYSAyRCBkaXNwbGFjZW1lbnQgd2l0aCB0aGUgcG9zaXRpb24uXFxuXFx0dmVjNCBwb3NpdGlvbkRhdGEgPSB0ZXh0dXJlMkQodV9pbnRlcm5hbF9wb3NpdGlvbnMsIHBhcnRpY2xlVVYpO1xcblxcdC8vIHBvc2l0aW9uID0gZmlyc3QgdHdvIGNvbXBvbmVudHMgcGx1cyBsYXN0IHR3byBjb21wb25lbnRzIChvcHRpb25hbCBhY2N1bXVsYXRpb24gYnVmZmVyKS5cXG5cXHR2ZWMyIHBvc2l0aW9uQWJzb2x1dGUgPSBwb3NpdGlvbkRhdGEucmc7XFxuXFx0aWYgKHVfaW50ZXJuYWxfcG9zaXRpb25XaXRoQWNjdW11bGF0aW9uKSBwb3NpdGlvbkFic29sdXRlICs9IHBvc2l0aW9uRGF0YS5iYTtcXG5cXHR2X1VWID0gcG9zaXRpb25BYnNvbHV0ZSAqIHVfaW50ZXJuYWxfc2NhbGU7XFxuXFxuXFx0Ly8gV3JhcCBpZiBuZWVkZWQuXFxuXFx0aWYgKHVfaW50ZXJuYWxfd3JhcFgpIHtcXG5cXHRcXHRpZiAodl9VVi54IDwgMC4wKSB2X1VWLnggKz0gMS4wO1xcblxcdFxcdGlmICh2X1VWLnggPiAxLjApIHZfVVYueCAtPSAxLjA7XFxuXFx0fVxcblxcdGlmICh1X2ludGVybmFsX3dyYXBZKSB7XFxuXFx0XFx0aWYgKHZfVVYueSA8IDAuMCkgdl9VVi55ICs9IDEuMDtcXG5cXHRcXHRpZiAodl9VVi55ID4gMS4wKSB2X1VWLnkgLT0gMS4wO1xcblxcdH1cXG5cXG5cXHQvLyBDYWxjdWxhdGUgcG9zaXRpb24gaW4gWy0xLCAxXSByYW5nZS5cXG5cXHR2ZWMyIHBvc2l0aW9uID0gdl9VViAqIDIuMCAtIDEuMDtcXG5cXG5cXHRnbF9Qb2ludFNpemUgPSB1X2ludGVybmFsX3BvaW50U2l6ZTtcXG5cXHRnbF9Qb3NpdGlvbiA9IHZlYzQocG9zaXRpb24sIDAsIDEpO1xcbn1cIiIsIm1vZHVsZS5leHBvcnRzID0gXCJwcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxucHJlY2lzaW9uIGhpZ2hwIGludDtcXG5cXG4vKipcXG4gKiBSZXR1cm5zIGFjY3VyYXRlIE1PRCB3aGVuIGFyZ3VtZW50cyBhcmUgYXBwcm94aW1hdGUgaW50ZWdlcnMuXFxuICovXFxuZmxvYXQgbW9kSShmbG9hdCBhLCBmbG9hdCBiKSB7XFxuICAgIGZsb2F0IG0gPSBhIC0gZmxvb3IoKGEgKyAwLjUpIC8gYikgKiBiO1xcbiAgICByZXR1cm4gZmxvb3IobSArIDAuNSk7XFxufVxcblxcbi8vIENhbm5vdCB1c2UgaW50IHZlcnRleCBhdHRyaWJ1dGVzOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yNzg3NDk4My93ZWJnbC1ob3ctdG8tdXNlLWludGVnZXItYXR0cmlidXRlcy1pbi1nbHNsXFxuYXR0cmlidXRlIGZsb2F0IGFfaW50ZXJuYWxfaW5kZXg7IC8vIEluZGV4IG9mIHBvaW50LlxcblxcbnVuaWZvcm0gc2FtcGxlcjJEIHVfaW50ZXJuYWxfdmVjdG9yczsgLy8gVGV4dHVyZSBsb29rdXAgd2l0aCB2ZWN0b3IgZGF0YS5cXG51bmlmb3JtIHZlYzIgdV9pbnRlcm5hbF9kaW1lbnNpb25zO1xcbnVuaWZvcm0gdmVjMiB1X2ludGVybmFsX3NjYWxlO1xcblxcbnZhcnlpbmcgdmVjMiB2X1VWO1xcblxcbnZvaWQgbWFpbigpIHtcXG5cXHQvLyBEaXZpZGUgaW5kZXggYnkgMi5cXG5cXHRmbG9hdCBpbmRleCA9IGZsb29yKChhX2ludGVybmFsX2luZGV4ICsgMC41KSAvIDIuMCk7XFxuXFx0Ly8gQ2FsY3VsYXRlIGEgdXYgYmFzZWQgb24gdGhlIHZlcnRleCBpbmRleCBhdHRyaWJ1dGUuXFxuXFx0dl9VViA9IHZlYzIoXFxuXFx0XFx0bW9kSShpbmRleCwgdV9pbnRlcm5hbF9kaW1lbnNpb25zLngpLFxcblxcdFxcdGZsb29yKGZsb29yKGluZGV4ICsgMC41KSAvIHVfaW50ZXJuYWxfZGltZW5zaW9ucy54KVxcblxcdCkgLyB1X2ludGVybmFsX2RpbWVuc2lvbnM7XFxuXFxuXFx0Ly8gQWRkIHZlY3RvciBkaXNwbGFjZW1lbnQgaWYgbmVlZGVkLlxcblxcdGlmIChtb2RJKGFfaW50ZXJuYWxfaW5kZXgsIDIuMCkgPiAwLjApIHtcXG5cXHRcXHQvLyBMb29rdXAgdmVjdG9yRGF0YSBhdCBjdXJyZW50IFVWLlxcblxcdFxcdHZlYzIgdmVjdG9yRGF0YSA9IHRleHR1cmUyRCh1X2ludGVybmFsX3ZlY3RvcnMsIHZfVVYpLnh5O1xcblxcdFxcdHZfVVYgKz0gdmVjdG9yRGF0YSAqIHVfaW50ZXJuYWxfc2NhbGU7XFxuXFx0fVxcblxcblxcdC8vIENhbGN1bGF0ZSBwb3NpdGlvbiBpbiBbLTEsIDFdIHJhbmdlLlxcblxcdHZlYzIgcG9zaXRpb24gPSB2X1VWICogMi4wIC0gMS4wO1xcblxcblxcdGdsX1Bvc2l0aW9uID0gdmVjNChwb3NpdGlvbiwgMCwgMSk7XFxufVwiIiwibW9kdWxlLmV4cG9ydHMgPSBcInByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5cXG5hdHRyaWJ1dGUgdmVjMiBhX2ludGVybmFsX3Bvc2l0aW9uO1xcbiNpZmRlZiBVVl9BVFRSSUJVVEVcXG5hdHRyaWJ1dGUgdmVjMiBhX2ludGVybmFsX3V2O1xcbiNlbmRpZlxcbiNpZmRlZiBOT1JNQUxfQVRUUklCVVRFXFxuYXR0cmlidXRlIHZlYzIgYV9pbnRlcm5hbF9ub3JtYWw7XFxuI2VuZGlmXFxuXFxudW5pZm9ybSB2ZWMyIHVfaW50ZXJuYWxfc2NhbGU7XFxudW5pZm9ybSB2ZWMyIHVfaW50ZXJuYWxfdHJhbnNsYXRpb247XFxuXFxudmFyeWluZyB2ZWMyIHZfVVY7XFxuI2lmZGVmIFVWX0FUVFJJQlVURVxcbmF0dHJpYnV0ZSB2ZWMyIHZfVVZfbG9jYWw7XFxuI2VuZGlmXFxuI2lmZGVmIE5PUk1BTF9BVFRSSUJVVEVcXG5hdHRyaWJ1dGUgdmVjMiB2X25vcm1hbDtcXG4jZW5kaWZcXG5cXG52b2lkIG1haW4oKSB7XFxuXFx0Ly8gT3B0aW9uYWwgdmFyeWluZ3MuXFxuXFx0I2lmZGVmIFVWX0FUVFJJQlVURVxcblxcdHZfVVZfbG9jYWwgPSBhX2ludGVybmFsX3V2O1xcblxcdCNlbmRpZlxcblxcdCNpZmRlZiBOT1JNQUxfQVRUUklCVVRFXFxuXFx0dl9ub3JtYWwgPSBhX2ludGVybmFsX25vcm1hbDtcXG5cXHQjZW5kaWZcXG5cXG5cXHQvLyBBcHBseSB0cmFuc2Zvcm1hdGlvbnMuXFxuXFx0dmVjMiBwb3NpdGlvbiA9IHVfaW50ZXJuYWxfc2NhbGUgKiBhX2ludGVybmFsX3Bvc2l0aW9uICsgdV9pbnRlcm5hbF90cmFuc2xhdGlvbjtcXG5cXG5cXHQvLyBDYWxjdWxhdGUgYSBnbG9iYWwgdXYgZm9yIHRoZSB2aWV3cG9ydC5cXG5cXHR2X1VWID0gMC41ICogKHBvc2l0aW9uICsgMS4wKTtcXG5cXG5cXHQvLyBDYWxjdWxhdGUgdmVydGV4IHBvc2l0aW9uLlxcblxcdGdsX1Bvc2l0aW9uID0gdmVjNChwb3NpdGlvbiwgMCwgMSk7XFxufVwiIiwibW9kdWxlLmV4cG9ydHMgPSBcIi8vIFZlcnRleCBzaGFkZXIgZm9yIGZ1bGxzY3JlZW4gcXVhZC5cXG5wcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxuXFxuYXR0cmlidXRlIHZlYzIgYV9pbnRlcm5hbF9wb3NpdGlvbjtcXG5cXG51bmlmb3JtIGZsb2F0IHVfaW50ZXJuYWxfaGFsZlRoaWNrbmVzcztcXG51bmlmb3JtIHZlYzIgdV9pbnRlcm5hbF9zY2FsZTtcXG51bmlmb3JtIGZsb2F0IHVfaW50ZXJuYWxfbGVuZ3RoO1xcbnVuaWZvcm0gZmxvYXQgdV9pbnRlcm5hbF9yb3RhdGlvbjtcXG51bmlmb3JtIHZlYzIgdV9pbnRlcm5hbF90cmFuc2xhdGlvbjtcXG5cXG52YXJ5aW5nIHZlYzIgdl9VVl9sb2NhbDtcXG52YXJ5aW5nIHZlYzIgdl9VVjtcXG5cXG5tYXQyIHJvdGF0ZTJkKGZsb2F0IF9hbmdsZSl7XFxuXFx0cmV0dXJuIG1hdDIoY29zKF9hbmdsZSksIC1zaW4oX2FuZ2xlKSwgc2luKF9hbmdsZSksIGNvcyhfYW5nbGUpKTtcXG59XFxuXFxudm9pZCBtYWluKCkge1xcblxcdC8vIENhbGN1bGF0ZSBVViBjb29yZGluYXRlcyBvZiBjdXJyZW50IHJlbmRlcmVkIG9iamVjdC5cXG5cXHR2X1VWX2xvY2FsID0gMC41ICogKGFfaW50ZXJuYWxfcG9zaXRpb24gKyAxLjApO1xcblxcblxcdHZlYzIgcG9zaXRpb24gPSBhX2ludGVybmFsX3Bvc2l0aW9uO1xcblxcblxcdC8vIEFwcGx5IHRoaWNrbmVzcyAvIHJhZGl1cy5cXG5cXHRwb3NpdGlvbiAqPSB1X2ludGVybmFsX2hhbGZUaGlja25lc3M7XFxuXFxuXFx0Ly8gU3RyZXRjaCBjZW50ZXIgb2Ygc2hhcGUgdG8gZm9ybSBhIHJvdW5kLWNhcHBlZCBsaW5lIHNlZ21lbnQuXFxuXFx0aWYgKHBvc2l0aW9uLnggPCAwLjApIHtcXG5cXHRcXHRwb3NpdGlvbi54IC09IHVfaW50ZXJuYWxfbGVuZ3RoIC8gMi4wO1xcblxcdFxcdHZfVVZfbG9jYWwueCA9IDAuMDsgLy8gU2V0IGVudGlyZSBjYXAgVVYueCB0byAwLlxcblxcdH0gZWxzZSBpZiAocG9zaXRpb24ueCA+IDAuMCkge1xcblxcdFxcdHBvc2l0aW9uLnggKz0gdV9pbnRlcm5hbF9sZW5ndGggLyAyLjA7XFxuXFx0XFx0dl9VVl9sb2NhbC54ID0gMS4wOyAvLyBTZXQgZW50aXJlIGNhcCBVVi54IHRvIDEuXFxuXFx0fVxcblxcblxcdC8vIEFwcGx5IHRyYW5zZm9ybWF0aW9ucy5cXG5cXHRwb3NpdGlvbiA9IHVfaW50ZXJuYWxfc2NhbGUgKiAocm90YXRlMmQoLXVfaW50ZXJuYWxfcm90YXRpb24pICogcG9zaXRpb24pICsgdV9pbnRlcm5hbF90cmFuc2xhdGlvbjtcXG5cXG5cXHQvLyBDYWxjdWxhdGUgYSBnbG9iYWwgdXYgZm9yIHRoZSB2aWV3cG9ydC5cXG5cXHR2X1VWID0gMC41ICogKHBvc2l0aW9uICsgMS4wKTtcXG5cXG5cXHQvLyBDYWxjdWxhdGUgdmVydGV4IHBvc2l0aW9uLlxcblxcdGdsX1Bvc2l0aW9uID0gdmVjNChwb3NpdGlvbiwgMCwgMSk7XFxufVwiIiwibW9kdWxlLmV4cG9ydHMgPSBcIi8vIEZyYWdtZW50IHNoYWRlciB0aGF0IGRyYXdzIGEgc2luZ2xlIGNvbG9yLlxcbnByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5cXG51bmlmb3JtIHZlYzMgdV9jb2xvcjtcXG5cXG52b2lkIG1haW4oKSB7XFxuXFx0Z2xfRnJhZ0NvbG9yID0gdmVjNCh1X2NvbG9yLCAxKTtcXG59XCIiLCJtb2R1bGUuZXhwb3J0cyA9IFwiLy8gRnJhZ21lbnQgc2hhZGVyIHRoYXQgZHJhd3MgYSBzaW5nbGUgY29sb3IuXFxucHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcblxcbnVuaWZvcm0gdmVjMyB1X2NvbG9yO1xcbnZhcnlpbmcgdmVjMiB2X2xpbmVXcmFwcGluZztcXG5cXG52b2lkIG1haW4oKSB7XFxuXFx0Ly8gY2hlY2sgaWYgdGhpcyBsaW5lIGhhcyB3cmFwcGVkLlxcblxcdGlmICgodl9saW5lV3JhcHBpbmcueCAhPSAwLjAgJiYgdl9saW5lV3JhcHBpbmcueCAhPSAxLjApIHx8ICh2X2xpbmVXcmFwcGluZy55ICE9IDAuMCAmJiB2X2xpbmVXcmFwcGluZy55ICE9IDEuMCkpIHtcXG5cXHRcXHQvLyBSZW5kZXIgbm90aGluZy5cXG5cXHRcXHRkaXNjYXJkO1xcblxcdFxcdHJldHVybjtcXG5cXHR9XFxuXFx0Z2xfRnJhZ0NvbG9yID0gdmVjNCh1X2NvbG9yLCAxKTtcXG59XCIiLCJtb2R1bGUuZXhwb3J0cyA9IFwiI3ZlcnNpb24gMzAwIGVzXFxucHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcbnByZWNpc2lvbiBoaWdocCBzYW1wbGVyMkQ7XFxuXFxuaW4gdmVjMiB2X1VWO1xcblxcbnVuaWZvcm0gc2FtcGxlcjJEIHVfc3RhdGU7XFxuXFxub3V0IHZlYzQgb3V0X2ZyYWdDb2xvcjtcXG5cXG52b2lkIG1haW4oKSB7XFxuXFx0b3V0X2ZyYWdDb2xvciA9IHRleHR1cmUodV9zdGF0ZSwgdl9VVik7XFxufVwiIiwibW9kdWxlLmV4cG9ydHMgPSBcIiN2ZXJzaW9uIDMwMCBlc1xcbnByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5wcmVjaXNpb24gaGlnaHAgaW50O1xcbnByZWNpc2lvbiBoaWdocCBpc2FtcGxlcjJEO1xcblxcbmluIHZlYzIgdl9VVjtcXG5cXG51bmlmb3JtIGlzYW1wbGVyMkQgdV9zdGF0ZTtcXG5cXG5vdXQgaXZlYzQgb3V0X2ZyYWdDb2xvcjtcXG5cXG52b2lkIG1haW4oKSB7XFxuXFx0b3V0X2ZyYWdDb2xvciA9IHRleHR1cmUodV9zdGF0ZSwgdl9VVik7XFxufVwiIiwibW9kdWxlLmV4cG9ydHMgPSBcIiN2ZXJzaW9uIDMwMCBlc1xcbnByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5wcmVjaXNpb24gaGlnaHAgaW50O1xcbnByZWNpc2lvbiBoaWdocCB1c2FtcGxlcjJEO1xcblxcbmluIHZlYzIgdl9VVjtcXG5cXG51bmlmb3JtIHVzYW1wbGVyMkQgdV9zdGF0ZTtcXG5cXG5vdXQgdXZlYzQgb3V0X2ZyYWdDb2xvcjtcXG5cXG52b2lkIG1haW4oKSB7XFxuXFx0b3V0X2ZyYWdDb2xvciA9IHRleHR1cmUodV9zdGF0ZSwgdl9VVik7XFxufVwiIiwibW9kdWxlLmV4cG9ydHMgPSBcIi8vIEZyYWdtZW50IHNoYWRlciB0aGF0IGRyYXdzIGEgc2luZ2xlIGNvbG9yLlxcbnByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5cXG51bmlmb3JtIHZlYzMgdV9jb2xvcjtcXG5cXG52b2lkIG1haW4oKSB7XFxuXFx0Z2xfRnJhZ0NvbG9yID0gdmVjNCh1X2NvbG9yLCAxKTtcXG59XCIiLCJtb2R1bGUuZXhwb3J0cyA9IFwiLy8gRnJhZ21lbnQgc2hhZGVyIHRoYXQgZHJhd3MgYSBzaW5nbGUgY29sb3IuXFxucHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcblxcbnVuaWZvcm0gdmVjMyB1X2NvbG9yO1xcbnZhcnlpbmcgdmVjMiB2X2xpbmVXcmFwcGluZztcXG5cXG52b2lkIG1haW4oKSB7XFxuXFx0Ly8gY2hlY2sgaWYgdGhpcyBsaW5lIGhhcyB3cmFwcGVkLlxcblxcdGlmICgodl9saW5lV3JhcHBpbmcueCAhPSAwLjAgJiYgdl9saW5lV3JhcHBpbmcueCAhPSAxLjApIHx8ICh2X2xpbmVXcmFwcGluZy55ICE9IDAuMCAmJiB2X2xpbmVXcmFwcGluZy55ICE9IDEuMCkpIHtcXG5cXHRcXHQvLyBSZW5kZXIgbm90aGluZy5cXG5cXHRcXHRkaXNjYXJkO1xcblxcdFxcdHJldHVybjtcXG5cXHR9XFxuXFx0Z2xfRnJhZ0NvbG9yID0gdmVjNCh1X2NvbG9yLCAxKTtcXG59XCIiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHRsb2FkZWQ6IGZhbHNlLFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcblx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18uaG1kID0gKG1vZHVsZSkgPT4ge1xuXHRtb2R1bGUgPSBPYmplY3QuY3JlYXRlKG1vZHVsZSk7XG5cdGlmICghbW9kdWxlLmNoaWxkcmVuKSBtb2R1bGUuY2hpbGRyZW4gPSBbXTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG1vZHVsZSwgJ2V4cG9ydHMnLCB7XG5cdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRzZXQ6ICgpID0+IHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignRVMgTW9kdWxlcyBtYXkgbm90IGFzc2lnbiBtb2R1bGUuZXhwb3J0cyBvciBleHBvcnRzLiosIFVzZSBFU00gZXhwb3J0IHN5bnRheCwgaW5zdGVhZDogJyArIG1vZHVsZS5pZCk7XG5cdFx0fVxuXHR9KTtcblx0cmV0dXJuIG1vZHVsZTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2luZGV4LnRzXCIpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==