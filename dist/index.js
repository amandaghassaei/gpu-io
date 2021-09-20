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

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GPUProgram = void 0;
var Checks_1 = __webpack_require__(/*! ./Checks */ "./src/Checks.ts");
var Constants_1 = __webpack_require__(/*! ./Constants */ "./src/Constants.ts");
var utils_1 = __webpack_require__(/*! ./utils */ "./src/utils.ts");
var DEFAULT_PROGRAM_NAME = 'DEFAULT';
var SEGMENT_PROGRAM_NAME = 'SEGMENT';
var POINTS_PROGRAM_NAME = 'POINTS';
var VECTOR_FIELD_PROGRAM_NAME = 'VECTOR_FIELD';
var INDEXED_LINES_PROGRAM_NAME = 'INDEXED_LINES';
var POLYLINE_PROGRAM_NAME = 'POLYLINE';
var glProgramNames = [
    DEFAULT_PROGRAM_NAME,
    SEGMENT_PROGRAM_NAME,
    POINTS_PROGRAM_NAME,
    VECTOR_FIELD_PROGRAM_NAME,
    INDEXED_LINES_PROGRAM_NAME,
    POLYLINE_PROGRAM_NAME,
];
var GPUProgram = /** @class */ (function () {
    function GPUProgram(params) {
        this.uniforms = {};
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
                // First convert defines to a string.
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
                sourceString = definesSource + sourceString;
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
    Object.defineProperty(GPUProgram.prototype, "defaultProgram", {
        get: function () {
            if (this._defaultProgram)
                return this._defaultProgram;
            if (GPUProgram.defaultVertexShader === undefined) {
                var _a = this, gl = _a.gl, name_2 = _a.name, errorCallback = _a.errorCallback, glslVersion = _a.glslVersion;
                // Init a default vertex shader that just passes through screen coords.
                var vertexShaderSource = glslVersion === Constants_1.GLSL3 ? __webpack_require__(/*! ./glsl_3/DefaultVertexShader.glsl */ "./src/glsl_3/DefaultVertexShader.glsl") : __webpack_require__(/*! ./glsl_1/DefaultVertexShader.glsl */ "./src/glsl_1/DefaultVertexShader.glsl");
                var shader = utils_1.compileShader(gl, errorCallback, vertexShaderSource, gl.VERTEX_SHADER, name_2);
                if (!shader) {
                    errorCallback("Unable to compile default vertex shader for program \"" + name_2 + "\".");
                    return;
                }
                GPUProgram.defaultVertexShader = shader;
            }
            var program = this.initProgram(GPUProgram.defaultVertexShader, DEFAULT_PROGRAM_NAME);
            this._defaultProgram = program;
            return this._defaultProgram;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GPUProgram.prototype, "segmentProgram", {
        get: function () {
            if (this._segmentProgram)
                return this._segmentProgram;
            if (GPUProgram.segmentVertexShader === undefined) {
                var _a = this, gl = _a.gl, name_3 = _a.name, errorCallback = _a.errorCallback, glslVersion = _a.glslVersion;
                var vertexShaderSource = glslVersion === Constants_1.GLSL3 ? __webpack_require__(/*! ./glsl_3/SegmentVertexShader.glsl */ "./src/glsl_3/SegmentVertexShader.glsl") : __webpack_require__(/*! ./glsl_1/SegmentVertexShader.glsl */ "./src/glsl_1/SegmentVertexShader.glsl");
                var shader = utils_1.compileShader(gl, errorCallback, vertexShaderSource, gl.VERTEX_SHADER, name_3);
                if (!shader) {
                    errorCallback("Unable to compile segment vertex shader for program \"" + name_3 + "\".");
                    return;
                }
                GPUProgram.segmentVertexShader = shader;
            }
            var program = this.initProgram(GPUProgram.segmentVertexShader, SEGMENT_PROGRAM_NAME);
            this._segmentProgram = program;
            return this._segmentProgram;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GPUProgram.prototype, "pointsProgram", {
        get: function () {
            if (this._pointsProgram)
                return this._pointsProgram;
            if (GPUProgram.pointsVertexShader === undefined) {
                var _a = this, gl = _a.gl, name_4 = _a.name, errorCallback = _a.errorCallback, glslVersion = _a.glslVersion;
                // @ts-ignore
                var vertexShaderSource = glslVersion === Constants_1.GLSL3 ? pointsVertexShaderSource_glsl3 : __webpack_require__(/*! ./glsl_1/PointsVertexShader.glsl */ "./src/glsl_1/PointsVertexShader.glsl");
                if (vertexShaderSource === undefined) {
                    throw new Error('Need to write glsl3 version of pointsVertexShader.');
                }
                var shader = utils_1.compileShader(gl, errorCallback, vertexShaderSource, gl.VERTEX_SHADER, name_4);
                if (!shader) {
                    errorCallback("Unable to compile points vertex shader for program \"" + name_4 + "\".");
                    return;
                }
                GPUProgram.pointsVertexShader = shader;
            }
            var program = this.initProgram(GPUProgram.pointsVertexShader, POINTS_PROGRAM_NAME);
            this._pointsProgram = program;
            return this._pointsProgram;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GPUProgram.prototype, "vectorFieldProgram", {
        get: function () {
            if (this._vectorFieldProgram)
                return this._vectorFieldProgram;
            if (GPUProgram.vectorFieldVertexShader === undefined) {
                var _a = this, gl = _a.gl, name_5 = _a.name, errorCallback = _a.errorCallback, glslVersion = _a.glslVersion;
                // @ts-ignore
                var vertexShaderSource = glslVersion === Constants_1.GLSL3 ? vectorFieldVertexShaderSource_glsl3 : __webpack_require__(/*! ./glsl_1/VectorFieldVertexShader.glsl */ "./src/glsl_1/VectorFieldVertexShader.glsl");
                if (vertexShaderSource === undefined) {
                    throw new Error('Need to write glsl3 version of vectorFieldVertexShader.');
                }
                var shader = utils_1.compileShader(gl, errorCallback, vertexShaderSource, gl.VERTEX_SHADER, name_5);
                if (!shader) {
                    errorCallback("Unable to compile vector field vertex shader for program \"" + name_5 + "\".");
                    return;
                }
                GPUProgram.vectorFieldVertexShader = shader;
            }
            var program = this.initProgram(GPUProgram.vectorFieldVertexShader, VECTOR_FIELD_PROGRAM_NAME);
            this._vectorFieldProgram = program;
            return this._vectorFieldProgram;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GPUProgram.prototype, "indexedLinesProgram", {
        get: function () {
            if (this._indexedLinesProgram)
                return this._indexedLinesProgram;
            if (GPUProgram.indexedLinesVertexShader === undefined) {
                var _a = this, gl = _a.gl, name_6 = _a.name, errorCallback = _a.errorCallback, glslVersion = _a.glslVersion;
                // @ts-ignore
                var vertexShaderSource = glslVersion === Constants_1.GLSL3 ? indexedLinesVertexShaderSource_glsl3 : __webpack_require__(/*! ./glsl_1/IndexedLinesVertexShader.glsl */ "./src/glsl_1/IndexedLinesVertexShader.glsl");
                if (vertexShaderSource === undefined) {
                    throw new Error('Need to write glsl3 version of indexedLinesVertexShader.');
                }
                var shader = utils_1.compileShader(gl, errorCallback, vertexShaderSource, gl.VERTEX_SHADER, name_6);
                if (!shader) {
                    errorCallback("Unable to compile vector field vertex shader for program \"" + name_6 + "\".");
                    return;
                }
                GPUProgram.indexedLinesVertexShader = shader;
            }
            var program = this.initProgram(GPUProgram.indexedLinesVertexShader, INDEXED_LINES_PROGRAM_NAME);
            this._indexedLinesProgram = program;
            return this._indexedLinesProgram;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GPUProgram.prototype, "polylineProgram", {
        get: function () {
            if (this._polylineProgram)
                return this._polylineProgram;
            if (GPUProgram.polylineVertexShader === undefined) {
                var _a = this, gl = _a.gl, name_7 = _a.name, errorCallback = _a.errorCallback, glslVersion = _a.glslVersion;
                // @ts-ignore
                var vertexShaderSource = glslVersion === Constants_1.GLSL3 ? polylineVertexShaderSource_glsl3 : __webpack_require__(/*! ./glsl_1/PolylineVertexShader.glsl */ "./src/glsl_1/PolylineVertexShader.glsl");
                if (vertexShaderSource === undefined) {
                    throw new Error('Need to write glsl3 version of polylineVertexShader.');
                }
                var shader = utils_1.compileShader(gl, errorCallback, vertexShaderSource, gl.VERTEX_SHADER, name_7);
                if (!shader) {
                    errorCallback("Unable to compile vector field vertex shader for program \"" + name_7 + "\".");
                    return;
                }
                GPUProgram.polylineVertexShader = shader;
            }
            var program = this.initProgram(GPUProgram.polylineVertexShader, POLYLINE_PROGRAM_NAME);
            this._polylineProgram = program;
            return this._polylineProgram;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GPUProgram.prototype, "activePrograms", {
        get: function () {
            var programs = [];
            if (this._defaultProgram)
                programs.push({
                    program: this._defaultProgram,
                    programName: DEFAULT_PROGRAM_NAME,
                });
            if (this._segmentProgram)
                programs.push({
                    program: this._segmentProgram,
                    programName: SEGMENT_PROGRAM_NAME,
                });
            if (this._pointsProgram)
                programs.push({
                    program: this._pointsProgram,
                    programName: POINTS_PROGRAM_NAME,
                });
            if (this._vectorFieldProgram)
                programs.push({
                    program: this._vectorFieldProgram,
                    programName: VECTOR_FIELD_PROGRAM_NAME,
                });
            if (this._indexedLinesProgram)
                programs.push({
                    program: this._indexedLinesProgram,
                    programName: INDEXED_LINES_PROGRAM_NAME,
                });
            if (this._polylineProgram)
                programs.push({
                    program: this._polylineProgram,
                    programName: POLYLINE_PROGRAM_NAME,
                });
            return programs;
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
        var _b = this, activePrograms = _b.activePrograms, uniforms = _b.uniforms;
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
        for (var i = 0; i < activePrograms.length; i++) {
            var _c = activePrograms[i], program = _c.program, programName = _c.programName;
            this.setProgramUniform(program, programName, uniformName, value, type);
        }
    };
    ;
    GPUProgram.prototype.setVertexUniform = function (program, uniformName, value, dataType) {
        var type = this.uniformTypeForValue(value, dataType);
        if (program === undefined) {
            throw new Error('Must pass in valid WebGLProgram to setVertexUniform, got undefined.');
        }
        var programName;
        switch (program) {
            case this._defaultProgram:
                programName = DEFAULT_PROGRAM_NAME;
                break;
            case this._segmentProgram:
                programName = SEGMENT_PROGRAM_NAME;
                break;
            case this._pointsProgram:
                programName = POINTS_PROGRAM_NAME;
                break;
            case this._vectorFieldProgram:
                programName = VECTOR_FIELD_PROGRAM_NAME;
                break;
            case this._indexedLinesProgram:
                programName = INDEXED_LINES_PROGRAM_NAME;
                break;
            case this._polylineProgram:
                programName = POLYLINE_PROGRAM_NAME;
                break;
            default:
                throw new Error("Could not find valid vertex programName for WebGLProgram \"" + this.name + "\".");
        }
        this.setProgramUniform(program, programName, uniformName, value, type);
    };
    GPUProgram.prototype.destroy = function () {
        var _a = this, gl = _a.gl, fragmentShader = _a.fragmentShader, activePrograms = _a.activePrograms;
        // Unbind all gl data before deleting.
        activePrograms.forEach(function (_a) {
            var program = _a.program;
            gl.deleteProgram(program);
        });
        // From https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/deleteShader
        // This method has no effect if the shader has already been deleted
        gl.deleteShader(fragmentShader);
        delete this._defaultProgram;
        delete this._segmentProgram;
        delete this._pointsProgram;
        delete this._vectorFieldProgram;
        delete this._indexedLinesProgram;
        delete this._polylineProgram;
        // @ts-ignore
        delete this.fragmentShader;
        // @ts-ignore
        delete this.gl;
        // @ts-ignore
        delete this.errorCallback;
        // @ts-ignore
        delete this.program;
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
        this.drawSetup(program.defaultProgram, true, input, output);
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
        var halfThickness = params.thickness / 2;
        var _a = this, gl = _a.gl, width = _a.width, height = _a.height, errorState = _a.errorState;
        // Ignore if we are in error state.
        if (errorState) {
            return;
        }
        // Offset vertices.
        var numPositions = closeLoop ? vertices.length * 4 + 2 : (vertices.length - 1) * 4;
        var positions = new Float32Array(2 * numPositions);
        // const uvs = params.includeUVs ? new Float32Array(2 * numPositions) : undefined;
        // const normals = params.includeNormals ? new Float32Array(2 * numPositions) : undefined;
        var uvs = new Float32Array(2 * numPositions);
        var normals = new Float32Array(2 * numPositions);
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
        var glProgram = program.polylineProgram;
        // Do setup - this must come first.
        this.drawSetup(glProgram, true, input, output);
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
    WebGLCompute.prototype.stepPoints = function (params) {
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
        var glProgram = program.pointsProgram;
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
            var indices = new Float32Array(length);
            for (var i = 0; i < length; i++) {
                indices[i] = i;
            }
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
    WebGLCompute.prototype.drawVectorField = function (params) {
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
        var glProgram = program.vectorFieldProgram;
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
            var indices = new Float32Array(length);
            for (var i = 0; i < length; i++) {
                indices[i] = i;
            }
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
    WebGLCompute.prototype.drawLines = function (params) {
        var _a = this, gl = _a.gl, errorState = _a.errorState, width = _a.width, height = _a.height;
        var positions = params.positions, indices = params.indices, output = params.output;
        // Ignore if we are in error state.
        if (errorState) {
            return;
        }
        // Check that positions is valid.
        if (positions.numComponents !== 2 && positions.numComponents !== 4) {
            throw new Error("WebGLCompute.drawIndexedLines() must be passed a position DataLayer with either 2 or 4 components, got position DataLayer \"" + positions.name + "\" with " + positions.numComponents + " components.");
        }
        var program = params.program;
        if (program === undefined) {
            program = params.wrapX || params.wrapY ? this.singleColorWithWrapCheckProgram : this.singleColorProgram;
            var color = params.color || [1, 0, 0]; // Default to red.
            program.setUniform('u_color', color, Constants_1.FLOAT);
        }
        var glProgram = program.indexedLinesProgram;
        // Add positionLayer to end of input if needed.
        var input = this.addLayerToInputs(positions, params.input);
        // Do setup - this must come first.
        this.drawSetup(glProgram, false, input, output);
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
        gl.drawArrays(gl.LINES, 0, count);
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
exports.isPowerOf2 = exports.isWebGL2 = exports.compileShader = void 0;
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

/***/ "./src/glsl_1/DefaultVertexShader.glsl":
/*!*********************************************!*\
  !*** ./src/glsl_1/DefaultVertexShader.glsl ***!
  \*********************************************/
/***/ ((module) => {

module.exports = "precision highp float;\n\nattribute vec2 a_internal_position;\n\nuniform vec2 u_internal_scale;\nuniform vec2 u_internal_translation;\n\nvarying vec2 v_UV_local;\nvarying vec2 v_UV;\n\nvoid main() {\n\t// Calculate UV coordinates of current rendered object.\n\tv_UV_local = 0.5 * (a_internal_position + 1.0);\n\n\t// Apply transformations.\n\tvec2 position = u_internal_scale * a_internal_position + u_internal_translation;\n\n\t// Calculate a global uv for the viewport.\n\tv_UV = 0.5 * (position + 1.0);\n\n\t// Calculate vertex position.\n\tgl_Position = vec4(position, 0, 1);\n}"

/***/ }),

/***/ "./src/glsl_1/IndexedLinesVertexShader.glsl":
/*!**************************************************!*\
  !*** ./src/glsl_1/IndexedLinesVertexShader.glsl ***!
  \**************************************************/
/***/ ((module) => {

module.exports = "precision highp float;\nprecision highp int;\n\n/**\n * Returns accurate MOD when arguments are approximate integers.\n */\nfloat modI(float a, float b) {\n    float m = a - floor((a + 0.5) / b) * b;\n    return floor(m + 0.5);\n}\n\n// Cannot use int vertex attributes: https://stackoverflow.com/questions/27874983/webgl-how-to-use-integer-attributes-in-glsl\nattribute float a_internal_index; // Index of point.\n\nuniform sampler2D u_internal_positions; // Texture lookup with position data.\nuniform vec2 u_internal_positionsDimensions;\nuniform vec2 u_internal_scale;\nuniform bool u_internal_positionWithAccumulation;\nuniform bool u_internal_wrapX;\nuniform bool u_internal_wrapY;\n\nvarying vec2 v_UV;\nvarying vec2 v_lineWrapping; // Use this to test if line is only half wrapped and should not be rendered.\n\nvoid main() {\n\t// Calculate a uv based on the point's index attribute.\n\tvec2 particleUV = vec2(\n\t\tmodI(a_internal_index, u_internal_positionsDimensions.x),\n\t\tfloor(floor(a_internal_index + 0.5) / u_internal_positionsDimensions.x)\n\t) / u_internal_positionsDimensions;\n\n\t// Calculate a global uv for the viewport.\n\t// Lookup vertex position and scale to [0, 1] range.\n\t// We have packed a 2D displacement with the position.\n\tvec4 positionData = texture2D(u_internal_positions, particleUV);\n\t// position = first two components plus last two components (optional accumulation buffer).\n\tvec2 positionAbsolute = positionData.rg;\n\tif (u_internal_positionWithAccumulation) positionAbsolute += positionData.ba;\n\tv_UV = positionAbsolute * u_internal_scale;\n\n\t// Wrap if needed.\n\tv_lineWrapping = vec2(0.0);\n\tif (u_internal_wrapX) {\n\t\tif (v_UV.x < 0.0) {\n\t\t\tv_UV.x += 1.0;\n\t\t\tv_lineWrapping.x = 1.0;\n\t\t} else if (v_UV.x > 1.0) {\n\t\t\tv_UV.x -= 1.0;\n\t\t\tv_lineWrapping.x = 1.0;\n\t\t}\n\t}\n\tif (u_internal_wrapY) {\n\t\tif (v_UV.y < 0.0) {\n\t\t\tv_UV.y += 1.0;\n\t\t\tv_lineWrapping.y = 1.0;\n\t\t} else if (v_UV.y > 1.0) {\n\t\t\tv_UV.y -= 1.0;\n\t\t\tv_lineWrapping.y = 1.0;\n\t\t}\n\t}\n\n\t// Calculate position in [-1, 1] range.\n\tvec2 position = v_UV * 2.0 - 1.0;\n\n\tgl_Position = vec4(position, 0, 1);\n}"

/***/ }),

/***/ "./src/glsl_1/PointsVertexShader.glsl":
/*!********************************************!*\
  !*** ./src/glsl_1/PointsVertexShader.glsl ***!
  \********************************************/
/***/ ((module) => {

module.exports = "precision highp float;\nprecision highp int;\n\n/**\n * Returns accurate MOD when arguments are approximate integers.\n */\nfloat modI(float a, float b) {\n    float m = a - floor((a + 0.5) / b) * b;\n    return floor(m + 0.5);\n}\n\n// Cannot use int vertex attributes: https://stackoverflow.com/questions/27874983/webgl-how-to-use-integer-attributes-in-glsl\nattribute float a_internal_index; // Index of point.\n\nuniform sampler2D u_internal_positions; // Texture lookup with position data.\nuniform vec2 u_internal_positionsDimensions;\nuniform vec2 u_internal_scale;\nuniform float u_internal_pointSize;\nuniform bool u_internal_positionWithAccumulation;\nuniform bool u_internal_wrapX;\nuniform bool u_internal_wrapY;\n\nvarying vec2 v_UV;\n\nvoid main() {\n\t// Calculate a uv based on the point's index attribute.\n\tvec2 particleUV = vec2(\n\t\tmodI(a_internal_index, u_internal_positionsDimensions.x),\n\t\tfloor(floor(a_internal_index + 0.5) / u_internal_positionsDimensions.x)\n\t) / u_internal_positionsDimensions;\n\n\t// Calculate a global uv for the viewport.\n\t// Lookup vertex position and scale to [0, 1] range.\n\t// We have packed a 2D displacement with the position.\n\tvec4 positionData = texture2D(u_internal_positions, particleUV);\n\t// position = first two components plus last two components (optional accumulation buffer).\n\tvec2 positionAbsolute = positionData.rg;\n\tif (u_internal_positionWithAccumulation) positionAbsolute += positionData.ba;\n\tv_UV = positionAbsolute * u_internal_scale;\n\n\t// Wrap if needed.\n\tif (u_internal_wrapX) {\n\t\tif (v_UV.x < 0.0) v_UV.x += 1.0;\n\t\tif (v_UV.x > 1.0) v_UV.x -= 1.0;\n\t}\n\tif (u_internal_wrapY) {\n\t\tif (v_UV.y < 0.0) v_UV.y += 1.0;\n\t\tif (v_UV.y > 1.0) v_UV.y -= 1.0;\n\t}\n\n\t// Calculate position in [-1, 1] range.\n\tvec2 position = v_UV * 2.0 - 1.0;\n\n\tgl_PointSize = u_internal_pointSize;\n\tgl_Position = vec4(position, 0, 1);\n}"

/***/ }),

/***/ "./src/glsl_1/PolylineVertexShader.glsl":
/*!**********************************************!*\
  !*** ./src/glsl_1/PolylineVertexShader.glsl ***!
  \**********************************************/
/***/ ((module) => {

module.exports = "precision highp float;\n\nattribute vec2 a_internal_position;\nattribute vec2 a_internal_uv;\nattribute vec2 a_internal_normal;\n\nuniform vec2 u_internal_scale;\nuniform vec2 u_internal_translation;\n\nvarying vec2 v_UV_local;\nvarying vec2 v_UV;\nvarying vec2 v_normal;\n\nvoid main() {\n\t// Varyings.\n\tv_UV_local = a_internal_uv;\n\tv_normal = a_internal_normal;\n\n\t// Apply transformations.\n\tvec2 position = u_internal_scale * a_internal_position + u_internal_translation;\n\n\t// Calculate a global uv for the viewport.\n\tv_UV = 0.5 * (position + 1.0);\n\n\t// Calculate vertex position.\n\tgl_Position = vec4(position, 0, 1);\n}"

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

/***/ "./src/glsl_1/VectorFieldVertexShader.glsl":
/*!*************************************************!*\
  !*** ./src/glsl_1/VectorFieldVertexShader.glsl ***!
  \*************************************************/
/***/ ((module) => {

module.exports = "precision highp float;\nprecision highp int;\n\n/**\n * Returns accurate MOD when arguments are approximate integers.\n */\nfloat modI(float a, float b) {\n    float m = a - floor((a + 0.5) / b) * b;\n    return floor(m + 0.5);\n}\n\n// Cannot use int vertex attributes: https://stackoverflow.com/questions/27874983/webgl-how-to-use-integer-attributes-in-glsl\nattribute float a_internal_index; // Index of point.\n\nuniform sampler2D u_internal_vectors; // Texture lookup with vector data.\nuniform vec2 u_internal_dimensions;\nuniform vec2 u_internal_scale;\n\nvarying vec2 v_UV;\n\nvoid main() {\n\t// Divide index by 2.\n\tfloat index = floor((a_internal_index + 0.5) / 2.0);\n\t// Calculate a uv based on the vertex index attribute.\n\tv_UV = vec2(\n\t\tmodI(index, u_internal_dimensions.x),\n\t\tfloor(floor(index + 0.5) / u_internal_dimensions.x)\n\t) / u_internal_dimensions;\n\n\t// Add vector displacement if needed.\n\tif (modI(a_internal_index, 2.0) > 0.0) {\n\t\t// Lookup vectorData at current UV.\n\t\tvec2 vectorData = texture2D(u_internal_vectors, v_UV).xy;\n\t\tv_UV += vectorData * u_internal_scale;\n\t}\n\n\t// Calculate position in [-1, 1] range.\n\tvec2 position = v_UV * 2.0 - 1.0;\n\n\tgl_Position = vec4(position, 0, 1);\n}"

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

/***/ "./src/glsl_3/DefaultVertexShader.glsl":
/*!*********************************************!*\
  !*** ./src/glsl_3/DefaultVertexShader.glsl ***!
  \*********************************************/
/***/ ((module) => {

module.exports = "#version 300 es\nprecision highp float;\n\nin vec2 a_internal_position;\n\nuniform vec2 u_internal_scale;\nuniform vec2 u_internal_translation;\n\nout vec2 v_UV_local;\nout vec2 v_UV;\nout vec2 out_position;\n\nvoid main() {\n\t// Calculate UV coordinates of current rendered object.\n\tv_UV_local = 0.5 * (a_internal_position + 1.0);\n\n\t// Apply transformations.\n\tvec2 position = u_internal_scale * a_internal_position + u_internal_translation;\n\n\t// Calculate a global uv for the viewport.\n\tv_UV = 0.5 * (position + 1.0);\n\n\t// Calculate vertex position.\n\tout_position = position;\n}"

/***/ }),

/***/ "./src/glsl_3/SegmentVertexShader.glsl":
/*!*********************************************!*\
  !*** ./src/glsl_3/SegmentVertexShader.glsl ***!
  \*********************************************/
/***/ ((module) => {

module.exports = "#version 300 es\nprecision highp float;\n\nattribute vec2 a_internal_position;\n\nuniform float u_internal_halfThickness;\nuniform vec2 u_internal_scale;\nuniform float u_internal_length;\nuniform float u_internal_rotation;\nuniform vec2 u_internal_translation;\n\nvarying vec2 v_UV_local;\nvarying vec2 v_UV;\n\nmat2 rotate2d(float _angle){\n\treturn mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));\n}\n\nvoid main() {\n\t// Calculate UV coordinates of current rendered object.\n\tv_UV_local = 0.5 * (a_internal_position + 1.0);\n\n\tvec2 position = a_internal_position;\n\n\t// Apply radius.\n\tposition *= u_internal_radius;\n\n\t// Stretch center of shape to form a round-capped line segment.\n\tif (position.x < 0.0) {\n\t\tposition.x -= u_internal_length / 2.0;\n\t\tv_UV_local.x = 0.0; // Set entire cap UV.x to 0.\n\t} else if (position.x > 0.0) {\n\t\tposition.x += u_internal_length / 2.0;\n\t\tv_UV_local.x = 1.0; // Set entire cap UV.x to 1.\n\t}\n\n\t// Apply transformations.\n\tposition = u_internal_scale * (rotate2d(-u_internal_rotation) * position) + u_internal_translation;\n\n\t// Calculate a global uv for the viewport.\n\tv_UV = 0.5 * (position + 1.0);\n\n\t// Calculate vertex position.\n\tgl_Position = vec4(position, 0, 1);\n}"

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9AcGV0YW1vcmlrZW4vZmxvYXQxNi9zcmMvRmxvYXQxNkFycmF5LmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9AcGV0YW1vcmlrZW4vZmxvYXQxNi9zcmMvYnVnLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9AcGV0YW1vcmlrZW4vZmxvYXQxNi9zcmMvZGF0YVZpZXcuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL0BwZXRhbW9yaWtlbi9mbG9hdDE2L3NyYy9oZnJvdW5kLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9AcGV0YW1vcmlrZW4vZmxvYXQxNi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL0BwZXRhbW9yaWtlbi9mbG9hdDE2L3NyYy9pcy5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvQHBldGFtb3Jpa2VuL2Zsb2F0MTYvc3JjL2xpYi5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvQHBldGFtb3Jpa2VuL2Zsb2F0MTYvc3JjL3ByaXZhdGUuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL0BwZXRhbW9yaWtlbi9mbG9hdDE2L3NyYy9zcGVjLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9jaGFuZ2VkcGkvZGlzdC9pbmRleC5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvZmlsZS1zYXZlci9kaXN0L0ZpbGVTYXZlci5taW4uanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fSGFzaC5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19MaXN0Q2FjaGUuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fTWFwLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX01hcENhY2hlLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX1N5bWJvbC5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19hc3NvY0luZGV4T2YuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fYmFzZUdldFRhZy5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19iYXNlSXNBcnJheUJ1ZmZlci5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19iYXNlSXNOYXRpdmUuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fYmFzZVVuYXJ5LmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2NvcmVKc0RhdGEuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fZnJlZUdsb2JhbC5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19nZXRNYXBEYXRhLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2dldE5hdGl2ZS5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19nZXRSYXdUYWcuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fZ2V0VmFsdWUuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9faGFzaENsZWFyLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2hhc2hEZWxldGUuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9faGFzaEdldC5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19oYXNoSGFzLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2hhc2hTZXQuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9faXNLZXlhYmxlLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2lzTWFza2VkLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2xpc3RDYWNoZUNsZWFyLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2xpc3RDYWNoZURlbGV0ZS5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19saXN0Q2FjaGVHZXQuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fbGlzdENhY2hlSGFzLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2xpc3RDYWNoZVNldC5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19tYXBDYWNoZUNsZWFyLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX21hcENhY2hlRGVsZXRlLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX21hcENhY2hlR2V0LmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX21hcENhY2hlSGFzLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX21hcENhY2hlU2V0LmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX25hdGl2ZUNyZWF0ZS5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19ub2RlVXRpbC5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19vYmplY3RUb1N0cmluZy5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19yb290LmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX3RvU291cmNlLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvZXEuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9pc0FycmF5QnVmZmVyLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvaXNGdW5jdGlvbi5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL2lzT2JqZWN0LmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvaXNPYmplY3RMaWtlLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvbWVtb2l6ZS5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9zcmMvQ2hlY2tzLnRzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL3NyYy9Db25zdGFudHMudHMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vc3JjL0RhdGFMYXllci50cyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9zcmMvR1BVUHJvZ3JhbS50cyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9zcmMvV2ViR0xDb21wdXRlLnRzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL3NyYy9leHRlbnNpb25zLnRzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9zcmMvdXRpbHMudHMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vc3JjL3V0aWxzL1ZlY3RvcjQudHMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vc3JjL2dsc2xfMS9Db3B5RnJhZ1NoYWRlci5nbHNsIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL3NyYy9nbHNsXzEvRGVmYXVsdFZlcnRleFNoYWRlci5nbHNsIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL3NyYy9nbHNsXzEvSW5kZXhlZExpbmVzVmVydGV4U2hhZGVyLmdsc2wiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vc3JjL2dsc2xfMS9Qb2ludHNWZXJ0ZXhTaGFkZXIuZ2xzbCIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9zcmMvZ2xzbF8xL1BvbHlsaW5lVmVydGV4U2hhZGVyLmdsc2wiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vc3JjL2dsc2xfMS9TZWdtZW50VmVydGV4U2hhZGVyLmdsc2wiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vc3JjL2dsc2xfMS9TaW5nbGVDb2xvckZyYWdTaGFkZXIuZ2xzbCIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9zcmMvZ2xzbF8xL1NpbmdsZUNvbG9yV2l0aFdyYXBDaGVja0ZyYWdTaGFkZXIuZ2xzbCIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9zcmMvZ2xzbF8xL1ZlY3RvckZpZWxkVmVydGV4U2hhZGVyLmdsc2wiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vc3JjL2dsc2xfMy9Db3B5RmxvYXRGcmFnU2hhZGVyLmdsc2wiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vc3JjL2dsc2xfMy9Db3B5SW50RnJhZ1NoYWRlci5nbHNsIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL3NyYy9nbHNsXzMvQ29weVVpbnRGcmFnU2hhZGVyLmdsc2wiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vc3JjL2dsc2xfMy9EZWZhdWx0VmVydGV4U2hhZGVyLmdsc2wiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vc3JjL2dsc2xfMy9TZWdtZW50VmVydGV4U2hhZGVyLmdsc2wiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vc3JjL2dsc2xfMy9TaW5nbGVDb2xvckZyYWdTaGFkZXIuZ2xzbCIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9zcmMvZ2xzbF8zL1NpbmdsZUNvbG9yV2l0aFdyYXBDaGVja0ZyYWdTaGFkZXIuZ2xzbCIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvd2VicGFjay9ydW50aW1lL2hhcm1vbnkgbW9kdWxlIGRlY29yYXRvciIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvd2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNWd0M7QUFDb0I7QUFDSjtBQUNJO0FBQ1g7QUFDVTs7QUFFM0QsVUFBVSw4REFBb0I7O0FBRTlCO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFdBQVcsYUFBYTtBQUN4QixZQUFZO0FBQ1o7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0JBQWtCLFlBQVk7QUFDOUIsbUJBQW1CLHFEQUFlO0FBQ2xDOztBQUVBO0FBQ0E7O0FBRUEsV0FBVyx1QkFBdUI7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSztBQUNMOztBQUVBLFdBQVcsMkJBQTJCO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBLGFBQWEscUVBQW1DO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQSxZQUFZLHNEQUFpQjtBQUM3Qiw4Q0FBOEMscURBQWU7QUFDN0QsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0EsYUFBYSxxRUFBbUM7QUFDaEQ7QUFDQTtBQUNBOztBQUVBLFlBQVks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dEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pELEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDO2dCQUN4QixFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDO2dCQUUxQixpQkFBaUI7Z0JBQ2pCLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsYUFBYSxDQUFDO2dCQUNyRixTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxhQUFhLENBQUM7Z0JBQ3pGLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLGFBQWEsQ0FBQztnQkFDekYsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsYUFBYSxDQUFDO2dCQUN6RixJQUFJLEdBQUcsRUFBRTtvQkFDUixHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ25ELEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ3ZELEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ3ZELEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ3ZEO2dCQUNELElBQUksT0FBTyxFQUFFO29CQUNaLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDM0QsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDL0QsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDL0QsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDL0Q7Z0JBRUQsNkNBQTZDO2dCQUM3QyxJQUFNLEtBQUssR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVDLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJO29CQUFFLFNBQVM7Z0JBQ3JDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN0QixFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdEIsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDekQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLE9BQU8sQ0FBQztnQkFDakIsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLE9BQU8sQ0FBQztnQkFDakIsaUNBQWlDO2dCQUNqQyxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN2RCxJQUFNLE1BQU0sR0FBRyxhQUFhLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ25ELElBQUksS0FBSyxHQUFHLENBQUMsRUFBRTtvQkFDZCxTQUFTLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO29CQUM5QyxTQUFTLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztvQkFDbEQsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQztvQkFDNUUsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO2lCQUNwRjtxQkFBTTtvQkFDTixTQUFTLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztvQkFDbEQsU0FBUyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7b0JBQ2xELFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDcEYsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO2lCQUNwRjthQUNEO1NBQ0Q7UUFDRCxJQUFJLFNBQVMsRUFBRTtZQUNkLHVEQUF1RDtZQUN2RCxTQUFTLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsRCxTQUFTLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xELFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEQsSUFBSSxHQUFHLEVBQUU7Z0JBQ1IsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsQyxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN0QyxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN0QyxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3RDO1lBQ0QsSUFBSSxPQUFPLEVBQUU7Z0JBQ1osT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMxQyxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM5QyxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM5QyxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQzlDO1NBQ0Q7UUFFRCxJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsZUFBZ0IsQ0FBQztRQUUzQyxtQ0FBbUM7UUFDbkMsSUFBSSxDQUFDLFNBQVMsQ0FB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QUFFO1dBQ0Y7V0FDQSxFOzs7OztXQ1ZBLHdGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7OztVQ05BO1VBQ0E7VUFDQTtVQUNBIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiV2ViR0xDb21wdXRlXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIldlYkdMQ29tcHV0ZVwiXSA9IGZhY3RvcnkoKTtcbn0pKHNlbGYsIGZ1bmN0aW9uKCkge1xucmV0dXJuICIsImltcG9ydCBtZW1vaXplIGZyb20gXCJsb2Rhc2gtZXMvbWVtb2l6ZVwiO1xuaW1wb3J0IHsgaXNUeXBlZEFycmF5SW5kZXhlZFByb3BlcnR5V3JpdGFibGUgfSBmcm9tIFwiLi9idWdcIjtcbmltcG9ydCB7IGlzQXJyYXlCdWZmZXIsIGlzU3RyaW5nTnVtYmVyS2V5IH0gZnJvbSBcIi4vaXNcIjtcbmltcG9ydCB7IGNvbnZlcnRUb051bWJlciwgcm91bmRUb0Zsb2F0MTZCaXRzIH0gZnJvbSBcIi4vbGliXCI7XG5pbXBvcnQgeyBjcmVhdGVQcml2YXRlU3RvcmFnZSB9IGZyb20gXCIuL3ByaXZhdGVcIjtcbmltcG9ydCB7IFRvSW50ZWdlciwgZGVmYXVsdENvbXBhcmVGdW5jdGlvbiB9IGZyb20gXCIuL3NwZWNcIjtcblxuY29uc3QgXyA9IGNyZWF0ZVByaXZhdGVTdG9yYWdlKCk7XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB0YXJnZXRcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBpc0Zsb2F0MTZBcnJheSh0YXJnZXQpIHtcbiAgICByZXR1cm4gdGFyZ2V0IGluc3RhbmNlb2YgRmxvYXQxNkFycmF5O1xufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdGFyZ2V0XG4gKiBAdGhyb3dzIHtUeXBlRXJyb3J9XG4gKi9cbmZ1bmN0aW9uIGFzc2VydEZsb2F0MTZBcnJheSh0YXJnZXQpIHtcbiAgICBpZiAoIWlzRmxvYXQxNkFycmF5KHRhcmdldCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlRoaXMgaXMgbm90IGEgRmxvYXQxNkFycmF5XCIpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHRhcmdldFxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzRGVmYXVsdEZsb2F0MTZBcnJheU1ldGhvZHModGFyZ2V0KSB7XG4gICAgcmV0dXJuIHR5cGVvZiB0YXJnZXQgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZhdWx0RmxvYXQxNkFycmF5TWV0aG9kcy5oYXModGFyZ2V0KTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge0Zsb2F0MTZBcnJheX0gZmxvYXQxNmJpdHNcbiAqIEByZXR1cm4ge251bWJlcltdfVxuICovXG5mdW5jdGlvbiBjb3B5VG9BcnJheShmbG9hdDE2Yml0cykge1xuICAgIGNvbnN0IGxlbmd0aCA9IGZsb2F0MTZiaXRzLmxlbmd0aDtcblxuICAgIGNvbnN0IGFycmF5ID0gbmV3IEFycmF5KGxlbmd0aCk7XG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICAgIGFycmF5W2ldID0gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzW2ldKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXJyYXk7XG59XG5cbi8qKiBAdHlwZSB7UHJveHlIYW5kbGVyPEZ1bmN0aW9uPn0gKi9cbmNvbnN0IGFwcGx5SGFuZGxlciA9IHtcbiAgICBhcHBseShmdW5jLCB0aGlzQXJnLCBhcmdzKSB7XG4gICAgICAgIC8vIHBlZWwgb2ZmIHByb3h5XG4gICAgICAgIGlmIChpc0Zsb2F0MTZBcnJheSh0aGlzQXJnKSAmJiBpc0RlZmF1bHRGbG9hdDE2QXJyYXlNZXRob2RzKGZ1bmMpKSB7XG4gICAgICAgICAgICByZXR1cm4gUmVmbGVjdC5hcHBseShmdW5jLCBfKHRoaXNBcmcpLnRhcmdldCAsYXJncyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUmVmbGVjdC5hcHBseShmdW5jLCB0aGlzQXJnLCBhcmdzKTtcbiAgICB9LFxufTtcblxuLyoqIEB0eXBlIHtQcm94eUhhbmRsZXI8RmxvYXQxNkFycmF5Pn0gKi9cbmNvbnN0IGhhbmRsZXIgPSB7XG4gICAgZ2V0KHRhcmdldCwga2V5KSB7XG4gICAgICAgIGxldCB3cmFwcGVyID0gbnVsbDtcbiAgICAgICAgaWYgKCFpc1R5cGVkQXJyYXlJbmRleGVkUHJvcGVydHlXcml0YWJsZSkge1xuICAgICAgICAgICAgd3JhcHBlciA9IHRhcmdldDtcbiAgICAgICAgICAgIHRhcmdldCA9IF8od3JhcHBlcikudGFyZ2V0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzU3RyaW5nTnVtYmVyS2V5KGtleSkpIHtcbiAgICAgICAgICAgIHJldHVybiBSZWZsZWN0Lmhhcyh0YXJnZXQsIGtleSkgPyBjb252ZXJ0VG9OdW1iZXIoUmVmbGVjdC5nZXQodGFyZ2V0LCBrZXkpKSA6IHVuZGVmaW5lZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IHdyYXBwZXIgIT09IG51bGwgJiYgUmVmbGVjdC5oYXMod3JhcHBlciwga2V5KSA/IFJlZmxlY3QuZ2V0KHdyYXBwZXIsIGtleSkgOiBSZWZsZWN0LmdldCh0YXJnZXQsIGtleSk7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgcmV0ICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBUeXBlZEFycmF5IG1ldGhvZHMgY2FuJ3QgYmUgY2FsbGVkIGJ5IFByb3h5IE9iamVjdFxuICAgICAgICAgICAgbGV0IHByb3h5ID0gXyhyZXQpLnByb3h5O1xuXG4gICAgICAgICAgICBpZiAocHJveHkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHByb3h5ID0gXyhyZXQpLnByb3h5ID0gbmV3IFByb3h5KHJldCwgYXBwbHlIYW5kbGVyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHByb3h5O1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHNldCh0YXJnZXQsIGtleSwgdmFsdWUpIHtcbiAgICAgICAgbGV0IHdyYXBwZXIgPSBudWxsO1xuICAgICAgICBpZiAoIWlzVHlwZWRBcnJheUluZGV4ZWRQcm9wZXJ0eVdyaXRhYmxlKSB7XG4gICAgICAgICAgICB3cmFwcGVyID0gdGFyZ2V0O1xuICAgICAgICAgICAgdGFyZ2V0ID0gXyh3cmFwcGVyKS50YXJnZXQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNTdHJpbmdOdW1iZXJLZXkoa2V5KSkge1xuICAgICAgICAgICAgcmV0dXJuIFJlZmxlY3Quc2V0KHRhcmdldCwga2V5LCByb3VuZFRvRmxvYXQxNkJpdHModmFsdWUpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGZyb3plbiBvYmplY3QgY2FuJ3QgY2hhbmdlIHByb3RvdHlwZSBwcm9wZXJ0eVxuICAgICAgICAgICAgaWYgKHdyYXBwZXIgIT09IG51bGwgJiYgKCFSZWZsZWN0Lmhhcyh0YXJnZXQsIGtleSkgfHwgT2JqZWN0LmlzRnJvemVuKHdyYXBwZXIpKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBSZWZsZWN0LnNldCh3cmFwcGVyLCBrZXksIHZhbHVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFJlZmxlY3Quc2V0KHRhcmdldCwga2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxufTtcblxuaWYgKCFpc1R5cGVkQXJyYXlJbmRleGVkUHJvcGVydHlXcml0YWJsZSkge1xuICAgIGhhbmRsZXIuZ2V0UHJvdG90eXBlT2YgPSAod3JhcHBlcikgPT4geyByZXR1cm4gUmVmbGVjdC5nZXRQcm90b3R5cGVPZihfKHdyYXBwZXIpLnRhcmdldCk7IH07XG4gICAgaGFuZGxlci5zZXRQcm90b3R5cGVPZiA9ICh3cmFwcGVyLCBwcm90b3R5cGUpID0+IHsgcmV0dXJuIFJlZmxlY3Quc2V0UHJvdG90eXBlT2YoXyh3cmFwcGVyKS50YXJnZXQsIHByb3RvdHlwZSk7IH07XG5cbiAgICBoYW5kbGVyLmRlZmluZVByb3BlcnR5ID0gKHdyYXBwZXIsIGtleSwgZGVzY3JpcHRvcikgPT4ge1xuICAgICAgICBjb25zdCB0YXJnZXQgPSBfKHdyYXBwZXIpLnRhcmdldDtcbiAgICAgICAgcmV0dXJuICFSZWZsZWN0Lmhhcyh0YXJnZXQsIGtleSkgfHwgT2JqZWN0LmlzRnJvemVuKHdyYXBwZXIpID8gUmVmbGVjdC5kZWZpbmVQcm9wZXJ0eSh3cmFwcGVyLCBrZXksIGRlc2NyaXB0b3IpIDogUmVmbGVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgZGVzY3JpcHRvcik7XG4gICAgfTtcbiAgICBoYW5kbGVyLmRlbGV0ZVByb3BlcnR5ID0gKHdyYXBwZXIsIGtleSkgPT4ge1xuICAgICAgICBjb25zdCB0YXJnZXQgPSBfKHdyYXBwZXIpLnRhcmdldDtcbiAgICAgICAgcmV0dXJuIFJlZmxlY3QuaGFzKHdyYXBwZXIsIGtleSkgPyBSZWZsZWN0LmRlbGV0ZVByb3BlcnR5KHdyYXBwZXIsIGtleSkgOiBSZWZsZWN0LmRlbGV0ZVByb3BlcnR5KHRhcmdldCwga2V5KTtcbiAgICB9O1xuXG4gICAgaGFuZGxlci5oYXMgPSAod3JhcHBlciwga2V5KSA9PiB7IHJldHVybiBSZWZsZWN0Lmhhcyh3cmFwcGVyLCBrZXkpIHx8IFJlZmxlY3QuaGFzKF8od3JhcHBlcikudGFyZ2V0LCBrZXkpOyB9O1xuXG4gICAgaGFuZGxlci5pc0V4dGVuc2libGUgPSAod3JhcHBlcikgPT4geyByZXR1cm4gUmVmbGVjdC5pc0V4dGVuc2libGUod3JhcHBlcik7IH07XG4gICAgaGFuZGxlci5wcmV2ZW50RXh0ZW5zaW9ucyA9ICh3cmFwcGVyKSA9PiB7IHJldHVybiBSZWZsZWN0LnByZXZlbnRFeHRlbnNpb25zKHdyYXBwZXIpOyB9O1xuXG4gICAgaGFuZGxlci5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSAod3JhcHBlciwga2V5KSA9PiB7IHJldHVybiBSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih3cmFwcGVyLCBrZXkpOyB9O1xuICAgIGhhbmRsZXIub3duS2V5cyA9ICh3cmFwcGVyKSA9PiB7IHJldHVybiBSZWZsZWN0Lm93bktleXMod3JhcHBlcik7IH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZsb2F0MTZBcnJheSBleHRlbmRzIFVpbnQxNkFycmF5IHtcblxuICAgIGNvbnN0cnVjdG9yKGlucHV0LCBieXRlT2Zmc2V0LCBsZW5ndGgpIHtcbiAgICAgICAgLy8gaW5wdXQgRmxvYXQxNkFycmF5XG4gICAgICAgIGlmIChpc0Zsb2F0MTZBcnJheShpbnB1dCkpIHtcbiAgICAgICAgICAgIHN1cGVyKF8oaW5wdXQpLnRhcmdldCk7XG5cbiAgICAgICAgLy8gMjIuMi4xLjMsIDIyLjIuMS40IFR5cGVkQXJyYXksIEFycmF5LCBBcnJheUxpa2UsIEl0ZXJhYmxlXG4gICAgICAgIH0gZWxzZSBpZiAoaW5wdXQgIT09IG51bGwgJiYgdHlwZW9mIGlucHV0ID09PSBcIm9iamVjdFwiICYmICFpc0FycmF5QnVmZmVyKGlucHV0KSkge1xuICAgICAgICAgICAgLy8gaWYgaW5wdXQgaXMgbm90IEFycmF5TGlrZSBhbmQgSXRlcmFibGUsIGdldCBBcnJheVxuICAgICAgICAgICAgY29uc3QgYXJyYXlMaWtlID0gIVJlZmxlY3QuaGFzKGlucHV0LCBcImxlbmd0aFwiKSAmJiBpbnB1dFtTeW1ib2wuaXRlcmF0b3JdICE9PSB1bmRlZmluZWQgPyBbLi4uaW5wdXRdIDogaW5wdXQ7XG5cbiAgICAgICAgICAgIGNvbnN0IGxlbmd0aCA9IGFycmF5TGlrZS5sZW5ndGg7XG4gICAgICAgICAgICBzdXBlcihsZW5ndGgpO1xuXG4gICAgICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICAvLyBzdXBlciAoVWludDE2QXJyYXkpXG4gICAgICAgICAgICAgICAgdGhpc1tpXSA9IHJvdW5kVG9GbG9hdDE2Qml0cyhhcnJheUxpa2VbaV0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIC8vIDIyLjIuMS4yLCAyMi4yLjEuNSBwcmltaXRpdmUsIEFycmF5QnVmZmVyXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgIHN1cGVyKGlucHV0KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgIHN1cGVyKGlucHV0LCBieXRlT2Zmc2V0KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgIHN1cGVyKGlucHV0LCBieXRlT2Zmc2V0LCBsZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBwcm94eTtcblxuICAgICAgICBpZiAoaXNUeXBlZEFycmF5SW5kZXhlZFByb3BlcnR5V3JpdGFibGUpIHtcbiAgICAgICAgICAgIHByb3h5ID0gbmV3IFByb3h5KHRoaXMsIGhhbmRsZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3Qgd3JhcHBlciA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgICAgICBfKHdyYXBwZXIpLnRhcmdldCA9IHRoaXM7XG4gICAgICAgICAgICBwcm94eSA9IG5ldyBQcm94eSh3cmFwcGVyLCBoYW5kbGVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHByb3h5IHByaXZhdGUgc3RvcmFnZVxuICAgICAgICBfKHByb3h5KS50YXJnZXQgPSB0aGlzO1xuXG4gICAgICAgIC8vIHRoaXMgcHJpdmF0ZSBzdG9yYWdlXG4gICAgICAgIF8odGhpcykucHJveHkgPSBwcm94eTtcblxuICAgICAgICByZXR1cm4gcHJveHk7XG4gICAgfVxuXG4gICAgLy8gc3RhdGljIG1ldGhvZHNcbiAgICBzdGF0aWMgZnJvbShzcmMsIC4uLm9wdHMpIHtcbiAgICAgICAgaWYgKG9wdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEZsb2F0MTZBcnJheShVaW50MTZBcnJheS5mcm9tKHNyYywgcm91bmRUb0Zsb2F0MTZCaXRzKS5idWZmZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbWFwRnVuYyA9IG9wdHNbMF07XG4gICAgICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzFdO1xuXG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQxNkFycmF5KFVpbnQxNkFycmF5LmZyb20oc3JjLCBmdW5jdGlvbiAodmFsLCAuLi5hcmdzKSB7XG4gICAgICAgICAgICByZXR1cm4gcm91bmRUb0Zsb2F0MTZCaXRzKG1hcEZ1bmMuY2FsbCh0aGlzLCB2YWwsIC4uLmFyZ3MpKTtcbiAgICAgICAgfSwgdGhpc0FyZykuYnVmZmVyKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgb2YoLi4uYXJncykge1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MTZBcnJheShhcmdzKTtcbiAgICB9XG5cbiAgICAvLyBpdGVyYXRlIG1ldGhvZHNcbiAgICAqIFtTeW1ib2wuaXRlcmF0b3JdKCkge1xuICAgICAgICBmb3IoY29uc3QgdmFsIG9mIHN1cGVyW1N5bWJvbC5pdGVyYXRvcl0oKSkge1xuICAgICAgICAgICAgeWllbGQgY29udmVydFRvTnVtYmVyKHZhbCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBrZXlzKCkge1xuICAgICAgICByZXR1cm4gc3VwZXIua2V5cygpO1xuICAgIH1cblxuICAgICogdmFsdWVzKCkge1xuICAgICAgICBmb3IoY29uc3QgdmFsIG9mIHN1cGVyLnZhbHVlcygpKSB7XG4gICAgICAgICAgICB5aWVsZCBjb252ZXJ0VG9OdW1iZXIodmFsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKiBAdHlwZSB7KCkgPT4gSXRlcmFibGVJdGVyYXRvcjxbbnVtYmVyLCBudW1iZXJdPn0gKi9cbiAgICAqIGVudHJpZXMoKSB7XG4gICAgICAgIGZvcihjb25zdCBbaSwgdmFsXSBvZiBzdXBlci5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgIHlpZWxkIFtpLCBjb252ZXJ0VG9OdW1iZXIodmFsKV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBmdW5jdGlvbmFsIG1ldGhvZHNcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgbWFwKGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcblxuICAgICAgICBjb25zdCB0aGlzQXJnID0gb3B0c1swXTtcblxuICAgICAgICBjb25zdCBhcnJheSA9IFtdO1xuICAgICAgICBmb3IobGV0IGkgPSAwLCBsID0gdGhpcy5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbCA9IGNvbnZlcnRUb051bWJlcih0aGlzW2ldKTtcbiAgICAgICAgICAgIGFycmF5LnB1c2goY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB2YWwsIGksIF8odGhpcykucHJveHkpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQxNkFycmF5KGFycmF5KTtcbiAgICB9XG5cbiAgICAvLyBAdHMtaWdub3JlXG4gICAgZmlsdGVyKGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcblxuICAgICAgICBjb25zdCB0aGlzQXJnID0gb3B0c1swXTtcblxuICAgICAgICBjb25zdCBhcnJheSA9IFtdO1xuICAgICAgICBmb3IobGV0IGkgPSAwLCBsID0gdGhpcy5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbCA9IGNvbnZlcnRUb051bWJlcih0aGlzW2ldKTtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHZhbCwgaSwgXyh0aGlzKS5wcm94eSkpIHtcbiAgICAgICAgICAgICAgICBhcnJheS5wdXNoKHZhbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MTZBcnJheShhcnJheSk7XG4gICAgfVxuXG4gICAgcmVkdWNlKGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcblxuICAgICAgICBsZXQgdmFsLCBzdGFydDtcblxuICAgICAgICBpZiAob3B0cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHZhbCA9IGNvbnZlcnRUb051bWJlcih0aGlzWzBdKTtcbiAgICAgICAgICAgIHN0YXJ0ID0gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhbCA9IG9wdHNbMF07XG4gICAgICAgICAgICBzdGFydCA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IobGV0IGkgPSBzdGFydCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgICAgICAgICB2YWwgPSBjYWxsYmFjayh2YWwsIGNvbnZlcnRUb051bWJlcih0aGlzW2ldKSwgaSwgXyh0aGlzKS5wcm94eSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdmFsO1xuICAgIH1cblxuICAgIHJlZHVjZVJpZ2h0KGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcblxuICAgICAgICBsZXQgdmFsLCBzdGFydDtcblxuICAgICAgICBjb25zdCBsZW5ndGggPSB0aGlzLmxlbmd0aDtcbiAgICAgICAgaWYgKG9wdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICB2YWwgPSBjb252ZXJ0VG9OdW1iZXIodGhpc1tsZW5ndGggLSAxXSk7XG4gICAgICAgICAgICBzdGFydCA9IGxlbmd0aCAtIDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YWwgPSBvcHRzWzBdO1xuICAgICAgICAgICAgc3RhcnQgPSBsZW5ndGg7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IobGV0IGkgPSBzdGFydDsgaS0tOykge1xuICAgICAgICAgICAgdmFsID0gY2FsbGJhY2sodmFsLCBjb252ZXJ0VG9OdW1iZXIodGhpc1tpXSksIGksIF8odGhpcykucHJveHkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbDtcbiAgICB9XG5cbiAgICBmb3JFYWNoKGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcblxuICAgICAgICBjb25zdCB0aGlzQXJnID0gb3B0c1swXTtcblxuICAgICAgICBmb3IobGV0IGkgPSAwLCBsID0gdGhpcy5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwodGhpc0FyZywgY29udmVydFRvTnVtYmVyKHRoaXNbaV0pLCBpLCBfKHRoaXMpLnByb3h5KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbmQoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICAgICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgICAgIGZvcihsZXQgaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBjb252ZXJ0VG9OdW1iZXIodGhpc1tpXSk7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB2YWx1ZSwgaSwgXyh0aGlzKS5wcm94eSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmaW5kSW5kZXgoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICAgICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgICAgIGZvcihsZXQgaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBjb252ZXJ0VG9OdW1iZXIodGhpc1tpXSk7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB2YWx1ZSwgaSwgXyh0aGlzKS5wcm94eSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICBldmVyeShjYWxsYmFjaywgLi4ub3B0cykge1xuICAgICAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG5cbiAgICAgICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMF07XG5cbiAgICAgICAgZm9yKGxldCBpID0gMCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgICAgICAgICBpZiAoIWNhbGxiYWNrLmNhbGwodGhpc0FyZywgY29udmVydFRvTnVtYmVyKHRoaXNbaV0pLCBpLCBfKHRoaXMpLnByb3h5KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHNvbWUoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICAgICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgICAgIGZvcihsZXQgaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrLmNhbGwodGhpc0FyZywgY29udmVydFRvTnVtYmVyKHRoaXNbaV0pLCBpLCBfKHRoaXMpLnByb3h5KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIGNoYW5nZSBlbGVtZW50IG1ldGhvZHNcbiAgICBzZXQoaW5wdXQsIC4uLm9wdHMpIHtcbiAgICAgICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgICAgIGNvbnN0IG9mZnNldCA9IG9wdHNbMF07XG5cbiAgICAgICAgbGV0IGZsb2F0MTZiaXRzO1xuXG4gICAgICAgIC8vIGlucHV0IEZsb2F0MTZBcnJheVxuICAgICAgICBpZiAoaXNGbG9hdDE2QXJyYXkoaW5wdXQpKSB7XG4gICAgICAgICAgICBmbG9hdDE2Yml0cyA9IF8oaW5wdXQpLnRhcmdldDtcblxuICAgICAgICAvLyBpbnB1dCBvdGhlcnNcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGFycmF5TGlrZSA9ICFSZWZsZWN0LmhhcyhpbnB1dCwgXCJsZW5ndGhcIikgJiYgaW5wdXRbU3ltYm9sLml0ZXJhdG9yXSAhPT0gdW5kZWZpbmVkID8gWy4uLmlucHV0XSA6IGlucHV0O1xuICAgICAgICAgICAgY29uc3QgbGVuZ3RoID0gYXJyYXlMaWtlLmxlbmd0aDtcblxuICAgICAgICAgICAgZmxvYXQxNmJpdHMgPSBuZXcgVWludDE2QXJyYXkobGVuZ3RoKTtcbiAgICAgICAgICAgIGZvcihsZXQgaSA9IDAsIGwgPSBhcnJheUxpa2UubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgICAgICAgICAgICAgZmxvYXQxNmJpdHNbaV0gPSByb3VuZFRvRmxvYXQxNkJpdHMoYXJyYXlMaWtlW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHN1cGVyLnNldChmbG9hdDE2Yml0cywgb2Zmc2V0KTtcbiAgICB9XG5cbiAgICByZXZlcnNlKCkge1xuICAgICAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG5cbiAgICAgICAgc3VwZXIucmV2ZXJzZSgpO1xuXG4gICAgICAgIHJldHVybiBfKHRoaXMpLnByb3h5O1xuICAgIH1cblxuICAgIGZpbGwodmFsdWUsIC4uLm9wdHMpIHtcbiAgICAgICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgICAgIHN1cGVyLmZpbGwocm91bmRUb0Zsb2F0MTZCaXRzKHZhbHVlKSwgLi4ub3B0cyk7XG5cbiAgICAgICAgcmV0dXJuIF8odGhpcykucHJveHk7XG4gICAgfVxuXG4gICAgY29weVdpdGhpbih0YXJnZXQsIHN0YXJ0LCAuLi5vcHRzKSB7XG4gICAgICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcblxuICAgICAgICBzdXBlci5jb3B5V2l0aGluKHRhcmdldCwgc3RhcnQsIC4uLm9wdHMpO1xuXG4gICAgICAgIHJldHVybiBfKHRoaXMpLnByb3h5O1xuICAgIH1cblxuICAgIHNvcnQoLi4ub3B0cykge1xuICAgICAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG5cbiAgICAgICAgbGV0IGNvbXBhcmVGdW5jdGlvbiA9IG9wdHNbMF07XG5cbiAgICAgICAgaWYgKGNvbXBhcmVGdW5jdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb21wYXJlRnVuY3Rpb24gPSBkZWZhdWx0Q29tcGFyZUZ1bmN0aW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgX2NvbnZlcnRUb051bWJlciA9IG1lbW9pemUoY29udmVydFRvTnVtYmVyKTtcblxuICAgICAgICBzdXBlci5zb3J0KCh4LCB5KSA9PiB7IHJldHVybiBjb21wYXJlRnVuY3Rpb24oX2NvbnZlcnRUb051bWJlcih4KSwgX2NvbnZlcnRUb051bWJlcih5KSk7IH0pO1xuXG4gICAgICAgIHJldHVybiBfKHRoaXMpLnByb3h5O1xuICAgIH1cblxuICAgIC8vIGNvcHkgZWxlbWVudCBtZXRob2RzXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHNsaWNlKC4uLm9wdHMpIHtcbiAgICAgICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgICAgIGxldCBmbG9hdDE2Yml0cztcblxuICAgICAgICAvLyBWOCwgU3BpZGVyTW9ua2V5LCBKYXZhU2NyaXB0Q29yZSwgQ2hha3JhIHRocm93IFR5cGVFcnJvclxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZmxvYXQxNmJpdHMgPSBzdXBlci5zbGljZSguLi5vcHRzKTtcbiAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICBpZiAoZSBpbnN0YW5jZW9mIFR5cGVFcnJvcikge1xuICAgICAgICAgICAgICAgIGNvbnN0IHVpbnQxNiA9IG5ldyBVaW50MTZBcnJheSh0aGlzLmJ1ZmZlciwgdGhpcy5ieXRlT2Zmc2V0LCB0aGlzLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgZmxvYXQxNmJpdHMgPSB1aW50MTYuc2xpY2UoLi4ub3B0cyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MTZBcnJheShmbG9hdDE2Yml0cy5idWZmZXIpO1xuICAgIH1cblxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBzdWJhcnJheSguLi5vcHRzKSB7XG4gICAgICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcblxuICAgICAgICBsZXQgZmxvYXQxNmJpdHM7XG5cbiAgICAgICAgLy8gVjgsIFNwaWRlck1vbmtleSwgSmF2YVNjcmlwdENvcmUsIENoYWtyYSB0aHJvdyBUeXBlRXJyb3JcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZsb2F0MTZiaXRzID0gc3VwZXIuc3ViYXJyYXkoLi4ub3B0cyk7XG4gICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBUeXBlRXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB1aW50MTYgPSBuZXcgVWludDE2QXJyYXkodGhpcy5idWZmZXIsIHRoaXMuYnl0ZU9mZnNldCwgdGhpcy5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIGZsb2F0MTZiaXRzID0gdWludDE2LnN1YmFycmF5KC4uLm9wdHMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDE2QXJyYXkoZmxvYXQxNmJpdHMuYnVmZmVyLCBmbG9hdDE2Yml0cy5ieXRlT2Zmc2V0LCBmbG9hdDE2Yml0cy5sZW5ndGgpO1xuICAgIH1cblxuICAgIC8vIGNvbnRhaW5zIG1ldGhvZHNcbiAgICBpbmRleE9mKGVsZW1lbnQsIC4uLm9wdHMpIHtcbiAgICAgICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMubGVuZ3RoO1xuXG4gICAgICAgIGxldCBmcm9tID0gVG9JbnRlZ2VyKG9wdHNbMF0pO1xuXG4gICAgICAgIGlmIChmcm9tIDwgMCkge1xuICAgICAgICAgICAgZnJvbSArPSBsZW5ndGg7XG4gICAgICAgICAgICBpZiAoZnJvbSA8IDApIHtcbiAgICAgICAgICAgICAgICBmcm9tID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvcihsZXQgaSA9IGZyb20sIGwgPSBsZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICAgICAgICAgIGlmIChjb252ZXJ0VG9OdW1iZXIodGhpc1tpXSkgPT09IGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICBsYXN0SW5kZXhPZihlbGVtZW50LCAuLi5vcHRzKSB7XG4gICAgICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcblxuICAgICAgICBjb25zdCBsZW5ndGggPSB0aGlzLmxlbmd0aDtcblxuICAgICAgICBsZXQgZnJvbSA9IFRvSW50ZWdlcihvcHRzWzBdKTtcblxuICAgICAgICBmcm9tID0gZnJvbSA9PT0gMCA/IGxlbmd0aCA6IGZyb20gKyAxO1xuXG4gICAgICAgIGlmIChmcm9tID49IDApIHtcbiAgICAgICAgICAgIGZyb20gPSBmcm9tIDwgbGVuZ3RoID8gZnJvbSA6IGxlbmd0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZyb20gKz0gbGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yKGxldCBpID0gZnJvbTsgaS0tOykge1xuICAgICAgICAgICAgaWYgKGNvbnZlcnRUb051bWJlcih0aGlzW2ldKSA9PT0gZWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIGluY2x1ZGVzKGVsZW1lbnQsIC4uLm9wdHMpIHtcbiAgICAgICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMubGVuZ3RoO1xuXG4gICAgICAgIGxldCBmcm9tID0gVG9JbnRlZ2VyKG9wdHNbMF0pO1xuXG4gICAgICAgIGlmIChmcm9tIDwgMCkge1xuICAgICAgICAgICAgZnJvbSArPSBsZW5ndGg7XG4gICAgICAgICAgICBpZiAoZnJvbSA8IDApIHtcbiAgICAgICAgICAgICAgICBmcm9tID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGlzTmFOID0gTnVtYmVyLmlzTmFOKGVsZW1lbnQpO1xuICAgICAgICBmb3IobGV0IGkgPSBmcm9tLCBsID0gbGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGNvbnZlcnRUb051bWJlcih0aGlzW2ldKTtcblxuICAgICAgICAgICAgaWYgKGlzTmFOICYmIE51bWJlci5pc05hTih2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHZhbHVlID09PSBlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gc3RyaW5nIG1ldGhvZHNcbiAgICBqb2luKC4uLm9wdHMpIHtcbiAgICAgICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgICAgIGNvbnN0IGFycmF5ID0gY29weVRvQXJyYXkodGhpcyk7XG5cbiAgICAgICAgcmV0dXJuIGFycmF5LmpvaW4oLi4ub3B0cyk7XG4gICAgfVxuXG4gICAgdG9Mb2NhbGVTdHJpbmcoLi4ub3B0cykge1xuICAgICAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG5cbiAgICAgICAgY29uc3QgYXJyYXkgPSBjb3B5VG9BcnJheSh0aGlzKTtcblxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIHJldHVybiBhcnJheS50b0xvY2FsZVN0cmluZyguLi5vcHRzKTtcbiAgICB9XG5cbiAgICAvLyBAdHMtaWdub3JlXG4gICAgZ2V0IFtTeW1ib2wudG9TdHJpbmdUYWddKCkge1xuICAgICAgICBpZiAoaXNGbG9hdDE2QXJyYXkodGhpcykpIHtcbiAgICAgICAgICAgIHJldHVybiBcIkZsb2F0MTZBcnJheVwiO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5jb25zdCBGbG9hdDE2QXJyYXkkcHJvdG90eXBlID0gRmxvYXQxNkFycmF5LnByb3RvdHlwZTtcblxuY29uc3QgZGVmYXVsdEZsb2F0MTZBcnJheU1ldGhvZHMgPSBuZXcgV2Vha1NldCgpO1xuZm9yKGNvbnN0IGtleSBvZiBSZWZsZWN0Lm93bktleXMoRmxvYXQxNkFycmF5JHByb3RvdHlwZSkpIHtcbiAgICBjb25zdCB2YWwgPSBGbG9hdDE2QXJyYXkkcHJvdG90eXBlW2tleV07XG4gICAgaWYgKHR5cGVvZiB2YWwgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBkZWZhdWx0RmxvYXQxNkFycmF5TWV0aG9kcy5hZGQodmFsKTtcbiAgICB9XG59XG4iLCIvKipcbiAqIEphdmFTY3JpcHRDb3JlIDw9IDEyIGJ1Z1xuICogQHNlZSBodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTcxNjA2XG4gKi9cbmV4cG9ydCBjb25zdCBpc1R5cGVkQXJyYXlJbmRleGVkUHJvcGVydHlXcml0YWJsZSA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobmV3IFVpbnQ4QXJyYXkoMSksIDApLndyaXRhYmxlO1xuIiwiaW1wb3J0IHsgaXNEYXRhVmlldyB9IGZyb20gXCIuL2lzXCI7XG5pbXBvcnQgeyBjb252ZXJ0VG9OdW1iZXIsIHJvdW5kVG9GbG9hdDE2Qml0cyB9IGZyb20gXCIuL2xpYlwiO1xuXG4vKipcbiAqIHJldHVybnMgYW4gdW5zaWduZWQgMTYtYml0IGZsb2F0IGF0IHRoZSBzcGVjaWZpZWQgYnl0ZSBvZmZzZXQgZnJvbSB0aGUgc3RhcnQgb2YgdGhlIERhdGFWaWV3LlxuICogQHBhcmFtIHtEYXRhVmlld30gZGF0YVZpZXdcbiAqIEBwYXJhbSB7bnVtYmVyfSBieXRlT2Zmc2V0XG4gKiBAcGFyYW0ge1tib29sZWFuXX0gb3B0c1xuICogQHJldHVybnMge251bWJlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEZsb2F0MTYoZGF0YVZpZXcsIGJ5dGVPZmZzZXQsIC4uLm9wdHMpIHtcbiAgICBpZiAoIWlzRGF0YVZpZXcoZGF0YVZpZXcpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJGaXJzdCBhcmd1bWVudCB0byBnZXRGbG9hdDE2IGZ1bmN0aW9uIG11c3QgYmUgYSBEYXRhVmlld1wiKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29udmVydFRvTnVtYmVyKCBkYXRhVmlldy5nZXRVaW50MTYoYnl0ZU9mZnNldCwgLi4ub3B0cykgKTtcbn1cblxuLyoqXG4gKiBzdG9yZXMgYW4gdW5zaWduZWQgMTYtYml0IGZsb2F0IHZhbHVlIGF0IHRoZSBzcGVjaWZpZWQgYnl0ZSBvZmZzZXQgZnJvbSB0aGUgc3RhcnQgb2YgdGhlIERhdGFWaWV3LlxuICogQHBhcmFtIHtEYXRhVmlld30gZGF0YVZpZXdcbiAqIEBwYXJhbSB7bnVtYmVyfSBieXRlT2Zmc2V0XG4gKiBAcGFyYW0ge251bWJlcn0gdmFsdWVcbiAqIEBwYXJhbSB7W2Jvb2xlYW5dfSBvcHRzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRGbG9hdDE2KGRhdGFWaWV3LCBieXRlT2Zmc2V0LCB2YWx1ZSwgLi4ub3B0cykge1xuICAgIGlmICghaXNEYXRhVmlldyhkYXRhVmlldykpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkZpcnN0IGFyZ3VtZW50IHRvIHNldEZsb2F0MTYgZnVuY3Rpb24gbXVzdCBiZSBhIERhdGFWaWV3XCIpO1xuICAgIH1cblxuICAgIGRhdGFWaWV3LnNldFVpbnQxNihieXRlT2Zmc2V0LCByb3VuZFRvRmxvYXQxNkJpdHModmFsdWUpLCAuLi5vcHRzKTtcbn1cbiIsImltcG9ydCB7IGNvbnZlcnRUb051bWJlciwgcm91bmRUb0Zsb2F0MTZCaXRzIH0gZnJvbSBcIi4vbGliXCI7XG5cbi8qKlxuICogcmV0dXJucyB0aGUgbmVhcmVzdCBoYWxmIHByZWNpc2lvbiBmbG9hdCByZXByZXNlbnRhdGlvbiBvZiBhIG51bWJlci5cbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1cbiAqIEByZXR1cm5zIHtudW1iZXJ9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGhmcm91bmQobnVtKSB7XG4gICAgbnVtID0gTnVtYmVyKG51bSk7XG5cbiAgICAvLyBmb3Igb3B0aW1pemF0aW9uXG4gICAgaWYgKCFOdW1iZXIuaXNGaW5pdGUobnVtKSB8fCBudW0gPT09IDApIHtcbiAgICAgICAgcmV0dXJuIG51bTtcbiAgICB9XG5cbiAgICBjb25zdCB4MTYgPSByb3VuZFRvRmxvYXQxNkJpdHMobnVtKTtcbiAgICByZXR1cm4gY29udmVydFRvTnVtYmVyKHgxNik7XG59XG4iLCJleHBvcnQgeyBkZWZhdWx0IGFzIGhmcm91bmQgfSBmcm9tIFwiLi9oZnJvdW5kXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEZsb2F0MTZBcnJheSB9IGZyb20gXCIuL0Zsb2F0MTZBcnJheVwiO1xuZXhwb3J0IHsgZ2V0RmxvYXQxNiwgc2V0RmxvYXQxNiB9IGZyb20gXCIuL2RhdGFWaWV3LmpzXCI7XG4iLCJpbXBvcnQgeyBUb0ludGVnZXIgfSBmcm9tIFwiLi9zcGVjXCI7XG5cbmV4cG9ydCB7IGRlZmF1bHQgYXMgaXNBcnJheUJ1ZmZlciB9IGZyb20gXCJsb2Rhc2gtZXMvaXNBcnJheUJ1ZmZlclwiO1xuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdmlld1xuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0RhdGFWaWV3KHZpZXcpIHtcbiAgICByZXR1cm4gdmlldyBpbnN0YW5jZW9mIERhdGFWaWV3O1xufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0ga2V5XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzU3RyaW5nTnVtYmVyS2V5KGtleSkge1xuICAgIHJldHVybiB0eXBlb2Yga2V5ID09PSBcInN0cmluZ1wiICYmIGtleSA9PT0gVG9JbnRlZ2VyKGtleSkgKyBcIlwiO1xufVxuIiwiLy8gYWxnb3JpdGhtOiBmdHA6Ly9mdHAuZm94LXRvb2xraXQub3JnL3B1Yi9mYXN0aGFsZmZsb2F0Y29udmVyc2lvbi5wZGZcblxuY29uc3QgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuY29uc3QgZmxvYXRWaWV3ID0gbmV3IEZsb2F0MzJBcnJheShidWZmZXIpO1xuY29uc3QgdWludDMyVmlldyA9IG5ldyBVaW50MzJBcnJheShidWZmZXIpO1xuXG5cbmNvbnN0IGJhc2VUYWJsZSA9IG5ldyBVaW50MzJBcnJheSg1MTIpO1xuY29uc3Qgc2hpZnRUYWJsZSA9IG5ldyBVaW50MzJBcnJheSg1MTIpO1xuXG5mb3IobGV0IGkgPSAwOyBpIDwgMjU2OyArK2kpIHtcbiAgICBjb25zdCBlID0gaSAtIDEyNztcblxuICAgIC8vIHZlcnkgc21hbGwgbnVtYmVyICgwLCAtMClcbiAgICBpZiAoZSA8IC0yNykge1xuICAgICAgICBiYXNlVGFibGVbaSB8IDB4MDAwXSA9IDB4MDAwMDtcbiAgICAgICAgYmFzZVRhYmxlW2kgfCAweDEwMF0gPSAweDgwMDA7XG4gICAgICAgIHNoaWZ0VGFibGVbaSB8IDB4MDAwXSA9IDI0O1xuICAgICAgICBzaGlmdFRhYmxlW2kgfCAweDEwMF0gPSAyNDtcblxuICAgIC8vIHNtYWxsIG51bWJlciAoZGVub3JtKVxuICAgIH0gZWxzZSBpZiAoZSA8IC0xNCkge1xuICAgICAgICBiYXNlVGFibGVbaSB8IDB4MDAwXSA9ICAweDA0MDAgPj4gKC1lIC0gMTQpO1xuICAgICAgICBiYXNlVGFibGVbaSB8IDB4MTAwXSA9ICgweDA0MDAgPj4gKC1lIC0gMTQpKSB8IDB4ODAwMDtcbiAgICAgICAgc2hpZnRUYWJsZVtpIHwgMHgwMDBdID0gLWUgLSAxO1xuICAgICAgICBzaGlmdFRhYmxlW2kgfCAweDEwMF0gPSAtZSAtIDE7XG5cbiAgICAvLyBub3JtYWwgbnVtYmVyXG4gICAgfSBlbHNlIGlmIChlIDw9IDE1KSB7XG4gICAgICAgIGJhc2VUYWJsZVtpIHwgMHgwMDBdID0gIChlICsgMTUpIDw8IDEwO1xuICAgICAgICBiYXNlVGFibGVbaSB8IDB4MTAwXSA9ICgoZSArIDE1KSA8PCAxMCkgfCAweDgwMDA7XG4gICAgICAgIHNoaWZ0VGFibGVbaSB8IDB4MDAwXSA9IDEzO1xuICAgICAgICBzaGlmdFRhYmxlW2kgfCAweDEwMF0gPSAxMztcblxuICAgIC8vIGxhcmdlIG51bWJlciAoSW5maW5pdHksIC1JbmZpbml0eSlcbiAgICB9IGVsc2UgaWYgKGUgPCAxMjgpIHtcbiAgICAgICAgYmFzZVRhYmxlW2kgfCAweDAwMF0gPSAweDdjMDA7XG4gICAgICAgIGJhc2VUYWJsZVtpIHwgMHgxMDBdID0gMHhmYzAwO1xuICAgICAgICBzaGlmdFRhYmxlW2kgfCAweDAwMF0gPSAyNDtcbiAgICAgICAgc2hpZnRUYWJsZVtpIHwgMHgxMDBdID0gMjQ7XG5cbiAgICAvLyBzdGF5IChOYU4sIEluZmluaXR5LCAtSW5maW5pdHkpXG4gICAgfSBlbHNlIHtcbiAgICAgICAgYmFzZVRhYmxlW2kgfCAweDAwMF0gPSAweDdjMDA7XG4gICAgICAgIGJhc2VUYWJsZVtpIHwgMHgxMDBdID0gMHhmYzAwO1xuICAgICAgICBzaGlmdFRhYmxlW2kgfCAweDAwMF0gPSAxMztcbiAgICAgICAgc2hpZnRUYWJsZVtpIHwgMHgxMDBdID0gMTM7XG4gICAgfVxufVxuXG4vKipcbiAqIHJvdW5kIGEgbnVtYmVyIHRvIGEgaGFsZiBmbG9hdCBudW1iZXIgYml0cy5cbiAqIEBwYXJhbSB7bnVtYmVyfSBudW0gLSBkb3VibGUgZmxvYXRcbiAqIEByZXR1cm5zIHtudW1iZXJ9IGhhbGYgZmxvYXQgbnVtYmVyIGJpdHNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJvdW5kVG9GbG9hdDE2Qml0cyhudW0pIHtcbiAgICBmbG9hdFZpZXdbMF0gPSBudW07XG5cbiAgICBjb25zdCBmID0gdWludDMyVmlld1swXTtcbiAgICBjb25zdCBlID0gKGYgPj4gMjMpICYgMHgxZmY7XG4gICAgcmV0dXJuIGJhc2VUYWJsZVtlXSArICgoZiAmIDB4MDA3ZmZmZmYpID4+IHNoaWZ0VGFibGVbZV0pO1xufVxuXG5cbmNvbnN0IG1hbnRpc3NhVGFibGUgPSBuZXcgVWludDMyQXJyYXkoMjA0OCk7XG5jb25zdCBleHBvbmVudFRhYmxlID0gbmV3IFVpbnQzMkFycmF5KDY0KTtcbmNvbnN0IG9mZnNldFRhYmxlID0gbmV3IFVpbnQzMkFycmF5KDY0KTtcblxubWFudGlzc2FUYWJsZVswXSA9IDA7XG5mb3IobGV0IGkgPSAxOyBpIDwgMTAyNDsgKytpKSB7XG4gICAgbGV0IG0gPSBpIDw8IDEzOyAgICAvLyB6ZXJvIHBhZCBtYW50aXNzYSBiaXRzXG4gICAgbGV0IGUgPSAwOyAgICAgICAgICAvLyB6ZXJvIGV4cG9uZW50XG5cbiAgICAvLyBub3JtYWxpemVkXG4gICAgd2hpbGUoKG0gJiAweDAwODAwMDAwKSA9PT0gMCkge1xuICAgICAgICBlIC09IDB4MDA4MDAwMDA7ICAgIC8vIGRlY3JlbWVudCBleHBvbmVudFxuICAgICAgICBtIDw8PSAxO1xuICAgIH1cblxuICAgIG0gJj0gfjB4MDA4MDAwMDA7ICAgLy8gY2xlYXIgbGVhZGluZyAxIGJpdFxuICAgIGUgKz0gMHgzODgwMDAwMDsgICAgLy8gYWRqdXN0IGJpYXNcblxuICAgIG1hbnRpc3NhVGFibGVbaV0gPSBtIHwgZTtcbn1cbmZvcihsZXQgaSA9IDEwMjQ7IGkgPCAyMDQ4OyArK2kpIHtcbiAgICBtYW50aXNzYVRhYmxlW2ldID0gMHgzODAwMDAwMCArICgoaSAtIDEwMjQpIDw8IDEzKTtcbn1cblxuZXhwb25lbnRUYWJsZVswXSA9IDA7XG5mb3IobGV0IGkgPSAxOyBpIDwgMzE7ICsraSkge1xuICAgIGV4cG9uZW50VGFibGVbaV0gPSBpIDw8IDIzO1xufVxuZXhwb25lbnRUYWJsZVszMV0gPSAweDQ3ODAwMDAwO1xuZXhwb25lbnRUYWJsZVszMl0gPSAweDgwMDAwMDAwO1xuZm9yKGxldCBpID0gMzM7IGkgPCA2MzsgKytpKSB7XG4gICAgZXhwb25lbnRUYWJsZVtpXSA9IDB4ODAwMDAwMDAgKyAoKGkgLSAzMikgPDwgMjMpO1xufVxuZXhwb25lbnRUYWJsZVs2M10gPSAweGM3ODAwMDAwO1xuXG5vZmZzZXRUYWJsZVswXSA9IDA7XG5mb3IobGV0IGkgPSAxOyBpIDwgNjQ7ICsraSkge1xuICAgIGlmIChpID09PSAzMikge1xuICAgICAgICBvZmZzZXRUYWJsZVtpXSA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgb2Zmc2V0VGFibGVbaV0gPSAxMDI0O1xuICAgIH1cbn1cblxuLyoqXG4gKiBjb252ZXJ0IGEgaGFsZiBmbG9hdCBudW1iZXIgYml0cyB0byBhIG51bWJlci5cbiAqIEBwYXJhbSB7bnVtYmVyfSBmbG9hdDE2Yml0cyAtIGhhbGYgZmxvYXQgbnVtYmVyIGJpdHNcbiAqIEByZXR1cm5zIHtudW1iZXJ9IGRvdWJsZSBmbG9hdFxuICovXG5leHBvcnQgZnVuY3Rpb24gY29udmVydFRvTnVtYmVyKGZsb2F0MTZiaXRzKSB7XG4gICAgY29uc3QgbSA9IGZsb2F0MTZiaXRzID4+IDEwO1xuICAgIHVpbnQzMlZpZXdbMF0gPSBtYW50aXNzYVRhYmxlW29mZnNldFRhYmxlW21dICsgKGZsb2F0MTZiaXRzICYgMHgzZmYpXSArIGV4cG9uZW50VGFibGVbbV07XG4gICAgcmV0dXJuIGZsb2F0Vmlld1swXTtcbn1cbiIsIi8qKlxuICogQHJldHVybnMgeyhzZWxmOm9iamVjdCkgPT4gb2JqZWN0fVxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUHJpdmF0ZVN0b3JhZ2UoKSB7XG5cdGNvbnN0IHdtID0gbmV3IFdlYWtNYXAoKTtcblx0cmV0dXJuIChzZWxmKSA9PiB7XG5cdFx0bGV0IG9iaiA9IHdtLmdldChzZWxmKTtcblx0XHRpZiAob2JqKSB7XG5cdFx0XHRyZXR1cm4gb2JqO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRvYmogPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXHRcdFx0d20uc2V0KHNlbGYsIG9iaik7XG5cdFx0XHRyZXR1cm4gb2JqO1xuXHRcdH1cblx0fTtcbn1cbiIsIi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB0YXJnZXRcbiAqIEByZXR1cm5zIHtudW1iZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBUb0ludGVnZXIodGFyZ2V0KSB7XG4gICAgbGV0IG51bWJlciA9IHR5cGVvZiB0YXJnZXQgIT09IFwibnVtYmVyXCIgPyBOdW1iZXIodGFyZ2V0KSA6IHRhcmdldDtcbiAgICBpZiAoTnVtYmVyLmlzTmFOKG51bWJlcikpIHtcbiAgICAgICAgbnVtYmVyID0gMDtcbiAgICB9XG4gICAgcmV0dXJuIE1hdGgudHJ1bmMobnVtYmVyKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge251bWJlcn0geFxuICogQHBhcmFtIHtudW1iZXJ9IHlcbiAqIEByZXR1cm5zIHstMSB8IDAgfCAxfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVmYXVsdENvbXBhcmVGdW5jdGlvbih4LCB5KSB7XG4gICAgY29uc3QgW2lzTmFOX3gsIGlzTmFOX3ldID0gW051bWJlci5pc05hTih4KSwgTnVtYmVyLmlzTmFOKHkpXTtcblxuICAgIGlmIChpc05hTl94ICYmIGlzTmFOX3kpIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgaWYgKGlzTmFOX3gpIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgfVxuXG4gICAgaWYgKGlzTmFOX3kpIHtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIGlmICh4IDwgeSkge1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgaWYgKHggPiB5KSB7XG4gICAgICAgIHJldHVybiAxO1xuICAgIH1cblxuICAgIGlmICh4ID09PSAwICYmIHkgPT09IDApIHtcbiAgICAgICAgY29uc3QgW2lzUGx1c1plcm9feCwgaXNQbHVzWmVyb195XSA9IFtPYmplY3QuaXMoeCwgMCksIE9iamVjdC5pcyh5LCAwKV07XG5cbiAgICAgICAgaWYgKCFpc1BsdXNaZXJvX3ggJiYgaXNQbHVzWmVyb195KSB7XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNQbHVzWmVyb194ICYmICFpc1BsdXNaZXJvX3kpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIDA7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmNoYW5nZURwaUJsb2IgPSBjaGFuZ2VEcGlCbG9iO1xuZXhwb3J0cy5jaGFuZ2VEcGlEYXRhVXJsID0gY2hhbmdlRHBpRGF0YVVybDtcblxuZnVuY3Rpb24gX3RvQ29uc3VtYWJsZUFycmF5KGFycikgeyBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7IGZvciAodmFyIGkgPSAwLCBhcnIyID0gQXJyYXkoYXJyLmxlbmd0aCk7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHsgYXJyMltpXSA9IGFycltpXTsgfSByZXR1cm4gYXJyMjsgfSBlbHNlIHsgcmV0dXJuIEFycmF5LmZyb20oYXJyKTsgfSB9XG5cbmZ1bmN0aW9uIGNyZWF0ZVBuZ0RhdGFUYWJsZSgpIHtcbiAgLyogVGFibGUgb2YgQ1JDcyBvZiBhbGwgOC1iaXQgbWVzc2FnZXMuICovXG4gIHZhciBjcmNUYWJsZSA9IG5ldyBJbnQzMkFycmF5KDI1Nik7XG4gIGZvciAodmFyIG4gPSAwOyBuIDwgMjU2OyBuKyspIHtcbiAgICB2YXIgYyA9IG47XG4gICAgZm9yICh2YXIgayA9IDA7IGsgPCA4OyBrKyspIHtcbiAgICAgIGMgPSBjICYgMSA/IDB4ZWRiODgzMjAgXiBjID4+PiAxIDogYyA+Pj4gMTtcbiAgICB9XG4gICAgY3JjVGFibGVbbl0gPSBjO1xuICB9XG4gIHJldHVybiBjcmNUYWJsZTtcbn1cblxuZnVuY3Rpb24gY2FsY0NyYyhidWYpIHtcbiAgdmFyIGMgPSAtMTtcbiAgaWYgKCFwbmdEYXRhVGFibGUpIHBuZ0RhdGFUYWJsZSA9IGNyZWF0ZVBuZ0RhdGFUYWJsZSgpO1xuICBmb3IgKHZhciBuID0gMDsgbiA8IGJ1Zi5sZW5ndGg7IG4rKykge1xuICAgIGMgPSBwbmdEYXRhVGFibGVbKGMgXiBidWZbbl0pICYgMHhGRl0gXiBjID4+PiA4O1xuICB9XG4gIHJldHVybiBjIF4gLTE7XG59XG5cbnZhciBwbmdEYXRhVGFibGUgPSB2b2lkIDA7XG5cbnZhciBQTkcgPSAnaW1hZ2UvcG5nJztcbnZhciBKUEVHID0gJ2ltYWdlL2pwZWcnO1xuXG4vLyB0aG9zZSBhcmUgMyBwb3NzaWJsZSBzaWduYXR1cmUgb2YgdGhlIHBoeXNCbG9jayBpbiBiYXNlNjQuXG4vLyB0aGUgcEhZcyBzaWduYXR1cmUgYmxvY2sgaXMgcHJlY2VlZCBieSB0aGUgNCBieXRlcyBvZiBsZW5naHQuIFRoZSBsZW5ndGggb2Zcbi8vIHRoZSBibG9jayBpcyBhbHdheXMgOSBieXRlcy4gU28gYSBwaHlzIGJsb2NrIGhhcyBhbHdheXMgdGhpcyBzaWduYXR1cmU6XG4vLyAwIDAgMCA5IHAgSCBZIHMuXG4vLyBIb3dldmVyIHRoZSBkYXRhNjQgZW5jb2RpbmcgYWxpZ25zIHdlIHdpbGwgYWx3YXlzIGZpbmQgb25lIG9mIHRob3NlIDMgc3RyaW5ncy5cbi8vIHRoaXMgYWxsb3cgdXMgdG8gZmluZCB0aGlzIHBhcnRpY3VsYXIgb2NjdXJlbmNlIG9mIHRoZSBwSFlzIGJsb2NrIHdpdGhvdXRcbi8vIGNvbnZlcnRpbmcgZnJvbSBiNjQgYmFjayB0byBzdHJpbmdcbnZhciBiNjRQaHlzU2lnbmF0dXJlMSA9ICdBQWx3U0Zseic7XG52YXIgYjY0UGh5c1NpZ25hdHVyZTIgPSAnQUFBSmNFaFonO1xudmFyIGI2NFBoeXNTaWduYXR1cmUzID0gJ0FBQUFDWEJJJztcblxudmFyIF9QID0gJ3AnLmNoYXJDb2RlQXQoMCk7XG52YXIgX0ggPSAnSCcuY2hhckNvZGVBdCgwKTtcbnZhciBfWSA9ICdZJy5jaGFyQ29kZUF0KDApO1xudmFyIF9TID0gJ3MnLmNoYXJDb2RlQXQoMCk7XG5cbmZ1bmN0aW9uIGNoYW5nZURwaUJsb2IoYmxvYiwgZHBpKSB7XG4gIC8vIDMzIGJ5dGVzIGFyZSBvayBmb3IgcG5ncyBhbmQganBlZ3NcbiAgLy8gdG8gY29udGFpbiB0aGUgaW5mb3JtYXRpb24uXG4gIHZhciBoZWFkZXJDaHVuayA9IGJsb2Iuc2xpY2UoMCwgMzMpO1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHZhciBmaWxlUmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICBmaWxlUmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBkYXRhQXJyYXkgPSBuZXcgVWludDhBcnJheShmaWxlUmVhZGVyLnJlc3VsdCk7XG4gICAgICB2YXIgdGFpbCA9IGJsb2Iuc2xpY2UoMzMpO1xuICAgICAgdmFyIGNoYW5nZWRBcnJheSA9IGNoYW5nZURwaU9uQXJyYXkoZGF0YUFycmF5LCBkcGksIGJsb2IudHlwZSk7XG4gICAgICByZXNvbHZlKG5ldyBCbG9iKFtjaGFuZ2VkQXJyYXksIHRhaWxdLCB7IHR5cGU6IGJsb2IudHlwZSB9KSk7XG4gICAgfTtcbiAgICBmaWxlUmVhZGVyLnJlYWRBc0FycmF5QnVmZmVyKGhlYWRlckNodW5rKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGNoYW5nZURwaURhdGFVcmwoYmFzZTY0SW1hZ2UsIGRwaSkge1xuICB2YXIgZGF0YVNwbGl0dGVkID0gYmFzZTY0SW1hZ2Uuc3BsaXQoJywnKTtcbiAgdmFyIGZvcm1hdCA9IGRhdGFTcGxpdHRlZFswXTtcbiAgdmFyIGJvZHkgPSBkYXRhU3BsaXR0ZWRbMV07XG4gIHZhciB0eXBlID0gdm9pZCAwO1xuICB2YXIgaGVhZGVyTGVuZ3RoID0gdm9pZCAwO1xuICB2YXIgb3ZlcndyaXRlcEhZcyA9IGZhbHNlO1xuICBpZiAoZm9ybWF0LmluZGV4T2YoUE5HKSAhPT0gLTEpIHtcbiAgICB0eXBlID0gUE5HO1xuICAgIHZhciBiNjRJbmRleCA9IGRldGVjdFBoeXNDaHVua0Zyb21EYXRhVXJsKGJvZHkpO1xuICAgIC8vIDI4IGJ5dGVzIGluIGRhdGFVcmwgYXJlIDIxYnl0ZXMsIGxlbmd0aCBvZiBwaHlzIGNodW5rIHdpdGggZXZlcnl0aGluZyBpbnNpZGUuXG4gICAgaWYgKGI2NEluZGV4ID49IDApIHtcbiAgICAgIGhlYWRlckxlbmd0aCA9IE1hdGguY2VpbCgoYjY0SW5kZXggKyAyOCkgLyAzKSAqIDQ7XG4gICAgICBvdmVyd3JpdGVwSFlzID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaGVhZGVyTGVuZ3RoID0gMzMgLyAzICogNDtcbiAgICB9XG4gIH1cbiAgaWYgKGZvcm1hdC5pbmRleE9mKEpQRUcpICE9PSAtMSkge1xuICAgIHR5cGUgPSBKUEVHO1xuICAgIGhlYWRlckxlbmd0aCA9IDE4IC8gMyAqIDQ7XG4gIH1cbiAgLy8gMzMgYnl0ZXMgYXJlIG9rIGZvciBwbmdzIGFuZCBqcGVnc1xuICAvLyB0byBjb250YWluIHRoZSBpbmZvcm1hdGlvbi5cbiAgdmFyIHN0cmluZ0hlYWRlciA9IGJvZHkuc3Vic3RyaW5nKDAsIGhlYWRlckxlbmd0aCk7XG4gIHZhciByZXN0T2ZEYXRhID0gYm9keS5zdWJzdHJpbmcoaGVhZGVyTGVuZ3RoKTtcbiAgdmFyIGhlYWRlckJ5dGVzID0gYXRvYihzdHJpbmdIZWFkZXIpO1xuICB2YXIgZGF0YUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoaGVhZGVyQnl0ZXMubGVuZ3RoKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICBkYXRhQXJyYXlbaV0gPSBoZWFkZXJCeXRlcy5jaGFyQ29kZUF0KGkpO1xuICB9XG4gIHZhciBmaW5hbEFycmF5ID0gY2hhbmdlRHBpT25BcnJheShkYXRhQXJyYXksIGRwaSwgdHlwZSwgb3ZlcndyaXRlcEhZcyk7XG4gIHZhciBiYXNlNjRIZWFkZXIgPSBidG9hKFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoU3RyaW5nLCBfdG9Db25zdW1hYmxlQXJyYXkoZmluYWxBcnJheSkpKTtcbiAgcmV0dXJuIFtmb3JtYXQsICcsJywgYmFzZTY0SGVhZGVyLCByZXN0T2ZEYXRhXS5qb2luKCcnKTtcbn1cblxuZnVuY3Rpb24gZGV0ZWN0UGh5c0NodW5rRnJvbURhdGFVcmwoZGF0YSkge1xuICB2YXIgYjY0aW5kZXggPSBkYXRhLmluZGV4T2YoYjY0UGh5c1NpZ25hdHVyZTEpO1xuICBpZiAoYjY0aW5kZXggPT09IC0xKSB7XG4gICAgYjY0aW5kZXggPSBkYXRhLmluZGV4T2YoYjY0UGh5c1NpZ25hdHVyZTIpO1xuICB9XG4gIGlmIChiNjRpbmRleCA9PT0gLTEpIHtcbiAgICBiNjRpbmRleCA9IGRhdGEuaW5kZXhPZihiNjRQaHlzU2lnbmF0dXJlMyk7XG4gIH1cbiAgLy8gaWYgYjY0aW5kZXggPT09IC0xIGNodW5rIGlzIG5vdCBmb3VuZFxuICByZXR1cm4gYjY0aW5kZXg7XG59XG5cbmZ1bmN0aW9uIHNlYXJjaFN0YXJ0T2ZQaHlzKGRhdGEpIHtcbiAgdmFyIGxlbmd0aCA9IGRhdGEubGVuZ3RoIC0gMTtcbiAgLy8gd2UgY2hlY2sgZnJvbSB0aGUgZW5kIHNpbmNlIHdlIGN1dCB0aGUgc3RyaW5nIGluIHByb3hpbWl0eSBvZiB0aGUgaGVhZGVyXG4gIC8vIHRoZSBoZWFkZXIgaXMgd2l0aGluIDIxIGJ5dGVzIGZyb20gdGhlIGVuZC5cbiAgZm9yICh2YXIgaSA9IGxlbmd0aDsgaSA+PSA0OyBpLS0pIHtcbiAgICBpZiAoZGF0YVtpIC0gNF0gPT09IDkgJiYgZGF0YVtpIC0gM10gPT09IF9QICYmIGRhdGFbaSAtIDJdID09PSBfSCAmJiBkYXRhW2kgLSAxXSA9PT0gX1kgJiYgZGF0YVtpXSA9PT0gX1MpIHtcbiAgICAgIHJldHVybiBpIC0gMztcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gY2hhbmdlRHBpT25BcnJheShkYXRhQXJyYXksIGRwaSwgZm9ybWF0LCBvdmVyd3JpdGVwSFlzKSB7XG4gIGlmIChmb3JtYXQgPT09IEpQRUcpIHtcbiAgICBkYXRhQXJyYXlbMTNdID0gMTsgLy8gMSBwaXhlbCBwZXIgaW5jaCBvciAyIHBpeGVsIHBlciBjbVxuICAgIGRhdGFBcnJheVsxNF0gPSBkcGkgPj4gODsgLy8gZHBpWCBoaWdoIGJ5dGVcbiAgICBkYXRhQXJyYXlbMTVdID0gZHBpICYgMHhmZjsgLy8gZHBpWCBsb3cgYnl0ZVxuICAgIGRhdGFBcnJheVsxNl0gPSBkcGkgPj4gODsgLy8gZHBpWSBoaWdoIGJ5dGVcbiAgICBkYXRhQXJyYXlbMTddID0gZHBpICYgMHhmZjsgLy8gZHBpWSBsb3cgYnl0ZVxuICAgIHJldHVybiBkYXRhQXJyYXk7XG4gIH1cbiAgaWYgKGZvcm1hdCA9PT0gUE5HKSB7XG4gICAgdmFyIHBoeXNDaHVuayA9IG5ldyBVaW50OEFycmF5KDEzKTtcbiAgICAvLyBjaHVuayBoZWFkZXIgcEhZc1xuICAgIC8vIDkgYnl0ZXMgb2YgZGF0YVxuICAgIC8vIDQgYnl0ZXMgb2YgY3JjXG4gICAgLy8gdGhpcyBtdWx0aXBsaWNhdGlvbiBpcyBiZWNhdXNlIHRoZSBzdGFuZGFyZCBpcyBkcGkgcGVyIG1ldGVyLlxuICAgIGRwaSAqPSAzOS4zNzAxO1xuICAgIHBoeXNDaHVua1swXSA9IF9QO1xuICAgIHBoeXNDaHVua1sxXSA9IF9IO1xuICAgIHBoeXNDaHVua1syXSA9IF9ZO1xuICAgIHBoeXNDaHVua1szXSA9IF9TO1xuICAgIHBoeXNDaHVua1s0XSA9IGRwaSA+Pj4gMjQ7IC8vIGRwaVggaGlnaGVzdCBieXRlXG4gICAgcGh5c0NodW5rWzVdID0gZHBpID4+PiAxNjsgLy8gZHBpWCB2ZXJ5aGlnaCBieXRlXG4gICAgcGh5c0NodW5rWzZdID0gZHBpID4+PiA4OyAvLyBkcGlYIGhpZ2ggYnl0ZVxuICAgIHBoeXNDaHVua1s3XSA9IGRwaSAmIDB4ZmY7IC8vIGRwaVggbG93IGJ5dGVcbiAgICBwaHlzQ2h1bmtbOF0gPSBwaHlzQ2h1bmtbNF07IC8vIGRwaVkgaGlnaGVzdCBieXRlXG4gICAgcGh5c0NodW5rWzldID0gcGh5c0NodW5rWzVdOyAvLyBkcGlZIHZlcnloaWdoIGJ5dGVcbiAgICBwaHlzQ2h1bmtbMTBdID0gcGh5c0NodW5rWzZdOyAvLyBkcGlZIGhpZ2ggYnl0ZVxuICAgIHBoeXNDaHVua1sxMV0gPSBwaHlzQ2h1bmtbN107IC8vIGRwaVkgbG93IGJ5dGVcbiAgICBwaHlzQ2h1bmtbMTJdID0gMTsgLy8gZG90IHBlciBtZXRlci4uLi5cblxuICAgIHZhciBjcmMgPSBjYWxjQ3JjKHBoeXNDaHVuayk7XG5cbiAgICB2YXIgY3JjQ2h1bmsgPSBuZXcgVWludDhBcnJheSg0KTtcbiAgICBjcmNDaHVua1swXSA9IGNyYyA+Pj4gMjQ7XG4gICAgY3JjQ2h1bmtbMV0gPSBjcmMgPj4+IDE2O1xuICAgIGNyY0NodW5rWzJdID0gY3JjID4+PiA4O1xuICAgIGNyY0NodW5rWzNdID0gY3JjICYgMHhmZjtcblxuICAgIGlmIChvdmVyd3JpdGVwSFlzKSB7XG4gICAgICB2YXIgc3RhcnRpbmdJbmRleCA9IHNlYXJjaFN0YXJ0T2ZQaHlzKGRhdGFBcnJheSk7XG4gICAgICBkYXRhQXJyYXkuc2V0KHBoeXNDaHVuaywgc3RhcnRpbmdJbmRleCk7XG4gICAgICBkYXRhQXJyYXkuc2V0KGNyY0NodW5rLCBzdGFydGluZ0luZGV4ICsgMTMpO1xuICAgICAgcmV0dXJuIGRhdGFBcnJheTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gaSBuZWVkIHRvIGdpdmUgYmFjayBhbiBhcnJheSBvZiBkYXRhIHRoYXQgaXMgZGl2aXNpYmxlIGJ5IDMgc28gdGhhdFxuICAgICAgLy8gZGF0YXVybCBlbmNvZGluZyBnaXZlcyBtZSBpbnRlZ2VycywgZm9yIGx1Y2sgdGhpcyBjaHVuayBpcyAxNyArIDQgPSAyMVxuICAgICAgLy8gaWYgaXQgd2FzIHdlIGNvdWxkIGFkZCBhIHRleHQgY2h1bmsgY29udGFuaW5nIHNvbWUgaW5mbywgdW50aWxsIGRlc2lyZWRcbiAgICAgIC8vIGxlbmd0aCBpcyBtZXQuXG5cbiAgICAgIC8vIGNodW5rIHN0cnVjdHVyIDQgYnl0ZXMgZm9yIGxlbmd0aCBpcyA5XG4gICAgICB2YXIgY2h1bmtMZW5ndGggPSBuZXcgVWludDhBcnJheSg0KTtcbiAgICAgIGNodW5rTGVuZ3RoWzBdID0gMDtcbiAgICAgIGNodW5rTGVuZ3RoWzFdID0gMDtcbiAgICAgIGNodW5rTGVuZ3RoWzJdID0gMDtcbiAgICAgIGNodW5rTGVuZ3RoWzNdID0gOTtcblxuICAgICAgdmFyIGZpbmFsSGVhZGVyID0gbmV3IFVpbnQ4QXJyYXkoNTQpO1xuICAgICAgZmluYWxIZWFkZXIuc2V0KGRhdGFBcnJheSwgMCk7XG4gICAgICBmaW5hbEhlYWRlci5zZXQoY2h1bmtMZW5ndGgsIDMzKTtcbiAgICAgIGZpbmFsSGVhZGVyLnNldChwaHlzQ2h1bmssIDM3KTtcbiAgICAgIGZpbmFsSGVhZGVyLnNldChjcmNDaHVuaywgNTApO1xuICAgICAgcmV0dXJuIGZpbmFsSGVhZGVyO1xuICAgIH1cbiAgfVxufSIsIihmdW5jdGlvbihhLGIpe2lmKFwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZClkZWZpbmUoW10sYik7ZWxzZSBpZihcInVuZGVmaW5lZFwiIT10eXBlb2YgZXhwb3J0cyliKCk7ZWxzZXtiKCksYS5GaWxlU2F2ZXI9e2V4cG9ydHM6e319LmV4cG9ydHN9fSkodGhpcyxmdW5jdGlvbigpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIGIoYSxiKXtyZXR1cm5cInVuZGVmaW5lZFwiPT10eXBlb2YgYj9iPXthdXRvQm9tOiExfTpcIm9iamVjdFwiIT10eXBlb2YgYiYmKGNvbnNvbGUud2FybihcIkRlcHJlY2F0ZWQ6IEV4cGVjdGVkIHRoaXJkIGFyZ3VtZW50IHRvIGJlIGEgb2JqZWN0XCIpLGI9e2F1dG9Cb206IWJ9KSxiLmF1dG9Cb20mJi9eXFxzKig/OnRleHRcXC9cXFMqfGFwcGxpY2F0aW9uXFwveG1sfFxcUypcXC9cXFMqXFwreG1sKVxccyo7LipjaGFyc2V0XFxzKj1cXHMqdXRmLTgvaS50ZXN0KGEudHlwZSk/bmV3IEJsb2IoW1wiXFx1RkVGRlwiLGFdLHt0eXBlOmEudHlwZX0pOmF9ZnVuY3Rpb24gYyhhLGIsYyl7dmFyIGQ9bmV3IFhNTEh0dHBSZXF1ZXN0O2Qub3BlbihcIkdFVFwiLGEpLGQucmVzcG9uc2VUeXBlPVwiYmxvYlwiLGQub25sb2FkPWZ1bmN0aW9uKCl7ZyhkLnJlc3BvbnNlLGIsYyl9LGQub25lcnJvcj1mdW5jdGlvbigpe2NvbnNvbGUuZXJyb3IoXCJjb3VsZCBub3QgZG93bmxvYWQgZmlsZVwiKX0sZC5zZW5kKCl9ZnVuY3Rpb24gZChhKXt2YXIgYj1uZXcgWE1MSHR0cFJlcXVlc3Q7Yi5vcGVuKFwiSEVBRFwiLGEsITEpO3RyeXtiLnNlbmQoKX1jYXRjaChhKXt9cmV0dXJuIDIwMDw9Yi5zdGF0dXMmJjI5OT49Yi5zdGF0dXN9ZnVuY3Rpb24gZShhKXt0cnl7YS5kaXNwYXRjaEV2ZW50KG5ldyBNb3VzZUV2ZW50KFwiY2xpY2tcIikpfWNhdGNoKGMpe3ZhciBiPWRvY3VtZW50LmNyZWF0ZUV2ZW50KFwiTW91c2VFdmVudHNcIik7Yi5pbml0TW91c2VFdmVudChcImNsaWNrXCIsITAsITAsd2luZG93LDAsMCwwLDgwLDIwLCExLCExLCExLCExLDAsbnVsbCksYS5kaXNwYXRjaEV2ZW50KGIpfX12YXIgZj1cIm9iamVjdFwiPT10eXBlb2Ygd2luZG93JiZ3aW5kb3cud2luZG93PT09d2luZG93P3dpbmRvdzpcIm9iamVjdFwiPT10eXBlb2Ygc2VsZiYmc2VsZi5zZWxmPT09c2VsZj9zZWxmOlwib2JqZWN0XCI9PXR5cGVvZiBnbG9iYWwmJmdsb2JhbC5nbG9iYWw9PT1nbG9iYWw/Z2xvYmFsOnZvaWQgMCxhPWYubmF2aWdhdG9yJiYvTWFjaW50b3NoLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpJiYvQXBwbGVXZWJLaXQvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkmJiEvU2FmYXJpLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpLGc9Zi5zYXZlQXN8fChcIm9iamVjdFwiIT10eXBlb2Ygd2luZG93fHx3aW5kb3chPT1mP2Z1bmN0aW9uKCl7fTpcImRvd25sb2FkXCJpbiBIVE1MQW5jaG9yRWxlbWVudC5wcm90b3R5cGUmJiFhP2Z1bmN0aW9uKGIsZyxoKXt2YXIgaT1mLlVSTHx8Zi53ZWJraXRVUkwsaj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtnPWd8fGIubmFtZXx8XCJkb3dubG9hZFwiLGouZG93bmxvYWQ9ZyxqLnJlbD1cIm5vb3BlbmVyXCIsXCJzdHJpbmdcIj09dHlwZW9mIGI/KGouaHJlZj1iLGoub3JpZ2luPT09bG9jYXRpb24ub3JpZ2luP2Uoaik6ZChqLmhyZWYpP2MoYixnLGgpOmUoaixqLnRhcmdldD1cIl9ibGFua1wiKSk6KGouaHJlZj1pLmNyZWF0ZU9iamVjdFVSTChiKSxzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7aS5yZXZva2VPYmplY3RVUkwoai5ocmVmKX0sNEU0KSxzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7ZShqKX0sMCkpfTpcIm1zU2F2ZU9yT3BlbkJsb2JcImluIG5hdmlnYXRvcj9mdW5jdGlvbihmLGcsaCl7aWYoZz1nfHxmLm5hbWV8fFwiZG93bmxvYWRcIixcInN0cmluZ1wiIT10eXBlb2YgZiluYXZpZ2F0b3IubXNTYXZlT3JPcGVuQmxvYihiKGYsaCksZyk7ZWxzZSBpZihkKGYpKWMoZixnLGgpO2Vsc2V7dmFyIGk9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7aS5ocmVmPWYsaS50YXJnZXQ9XCJfYmxhbmtcIixzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7ZShpKX0pfX06ZnVuY3Rpb24oYixkLGUsZyl7aWYoZz1nfHxvcGVuKFwiXCIsXCJfYmxhbmtcIiksZyYmKGcuZG9jdW1lbnQudGl0bGU9Zy5kb2N1bWVudC5ib2R5LmlubmVyVGV4dD1cImRvd25sb2FkaW5nLi4uXCIpLFwic3RyaW5nXCI9PXR5cGVvZiBiKXJldHVybiBjKGIsZCxlKTt2YXIgaD1cImFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbVwiPT09Yi50eXBlLGk9L2NvbnN0cnVjdG9yL2kudGVzdChmLkhUTUxFbGVtZW50KXx8Zi5zYWZhcmksaj0vQ3JpT1NcXC9bXFxkXSsvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7aWYoKGp8fGgmJml8fGEpJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgRmlsZVJlYWRlcil7dmFyIGs9bmV3IEZpbGVSZWFkZXI7ay5vbmxvYWRlbmQ9ZnVuY3Rpb24oKXt2YXIgYT1rLnJlc3VsdDthPWo/YTphLnJlcGxhY2UoL15kYXRhOlteO10qOy8sXCJkYXRhOmF0dGFjaG1lbnQvZmlsZTtcIiksZz9nLmxvY2F0aW9uLmhyZWY9YTpsb2NhdGlvbj1hLGc9bnVsbH0say5yZWFkQXNEYXRhVVJMKGIpfWVsc2V7dmFyIGw9Zi5VUkx8fGYud2Via2l0VVJMLG09bC5jcmVhdGVPYmplY3RVUkwoYik7Zz9nLmxvY2F0aW9uPW06bG9jYXRpb24uaHJlZj1tLGc9bnVsbCxzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7bC5yZXZva2VPYmplY3RVUkwobSl9LDRFNCl9fSk7Zi5zYXZlQXM9Zy5zYXZlQXM9ZyxcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlJiYobW9kdWxlLmV4cG9ydHM9Zyl9KTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9RmlsZVNhdmVyLm1pbi5qcy5tYXAiLCJpbXBvcnQgaGFzaENsZWFyIGZyb20gJy4vX2hhc2hDbGVhci5qcyc7XG5pbXBvcnQgaGFzaERlbGV0ZSBmcm9tICcuL19oYXNoRGVsZXRlLmpzJztcbmltcG9ydCBoYXNoR2V0IGZyb20gJy4vX2hhc2hHZXQuanMnO1xuaW1wb3J0IGhhc2hIYXMgZnJvbSAnLi9faGFzaEhhcy5qcyc7XG5pbXBvcnQgaGFzaFNldCBmcm9tICcuL19oYXNoU2V0LmpzJztcblxuLyoqXG4gKiBDcmVhdGVzIGEgaGFzaCBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIEhhc2goZW50cmllcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGVudHJpZXMgPT0gbnVsbCA/IDAgOiBlbnRyaWVzLmxlbmd0aDtcblxuICB0aGlzLmNsZWFyKCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGVudHJ5ID0gZW50cmllc1tpbmRleF07XG4gICAgdGhpcy5zZXQoZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgfVxufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgSGFzaGAuXG5IYXNoLnByb3RvdHlwZS5jbGVhciA9IGhhc2hDbGVhcjtcbkhhc2gucHJvdG90eXBlWydkZWxldGUnXSA9IGhhc2hEZWxldGU7XG5IYXNoLnByb3RvdHlwZS5nZXQgPSBoYXNoR2V0O1xuSGFzaC5wcm90b3R5cGUuaGFzID0gaGFzaEhhcztcbkhhc2gucHJvdG90eXBlLnNldCA9IGhhc2hTZXQ7XG5cbmV4cG9ydCBkZWZhdWx0IEhhc2g7XG4iLCJpbXBvcnQgbGlzdENhY2hlQ2xlYXIgZnJvbSAnLi9fbGlzdENhY2hlQ2xlYXIuanMnO1xuaW1wb3J0IGxpc3RDYWNoZURlbGV0ZSBmcm9tICcuL19saXN0Q2FjaGVEZWxldGUuanMnO1xuaW1wb3J0IGxpc3RDYWNoZUdldCBmcm9tICcuL19saXN0Q2FjaGVHZXQuanMnO1xuaW1wb3J0IGxpc3RDYWNoZUhhcyBmcm9tICcuL19saXN0Q2FjaGVIYXMuanMnO1xuaW1wb3J0IGxpc3RDYWNoZVNldCBmcm9tICcuL19saXN0Q2FjaGVTZXQuanMnO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gbGlzdCBjYWNoZSBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIExpc3RDYWNoZShlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBMaXN0Q2FjaGVgLlxuTGlzdENhY2hlLnByb3RvdHlwZS5jbGVhciA9IGxpc3RDYWNoZUNsZWFyO1xuTGlzdENhY2hlLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBsaXN0Q2FjaGVEZWxldGU7XG5MaXN0Q2FjaGUucHJvdG90eXBlLmdldCA9IGxpc3RDYWNoZUdldDtcbkxpc3RDYWNoZS5wcm90b3R5cGUuaGFzID0gbGlzdENhY2hlSGFzO1xuTGlzdENhY2hlLnByb3RvdHlwZS5zZXQgPSBsaXN0Q2FjaGVTZXQ7XG5cbmV4cG9ydCBkZWZhdWx0IExpc3RDYWNoZTtcbiIsImltcG9ydCBnZXROYXRpdmUgZnJvbSAnLi9fZ2V0TmF0aXZlLmpzJztcbmltcG9ydCByb290IGZyb20gJy4vX3Jvb3QuanMnO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgTWFwID0gZ2V0TmF0aXZlKHJvb3QsICdNYXAnKTtcblxuZXhwb3J0IGRlZmF1bHQgTWFwO1xuIiwiaW1wb3J0IG1hcENhY2hlQ2xlYXIgZnJvbSAnLi9fbWFwQ2FjaGVDbGVhci5qcyc7XG5pbXBvcnQgbWFwQ2FjaGVEZWxldGUgZnJvbSAnLi9fbWFwQ2FjaGVEZWxldGUuanMnO1xuaW1wb3J0IG1hcENhY2hlR2V0IGZyb20gJy4vX21hcENhY2hlR2V0LmpzJztcbmltcG9ydCBtYXBDYWNoZUhhcyBmcm9tICcuL19tYXBDYWNoZUhhcy5qcyc7XG5pbXBvcnQgbWFwQ2FjaGVTZXQgZnJvbSAnLi9fbWFwQ2FjaGVTZXQuanMnO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBtYXAgY2FjaGUgb2JqZWN0IHRvIHN0b3JlIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gTWFwQ2FjaGUoZW50cmllcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGVudHJpZXMgPT0gbnVsbCA/IDAgOiBlbnRyaWVzLmxlbmd0aDtcblxuICB0aGlzLmNsZWFyKCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGVudHJ5ID0gZW50cmllc1tpbmRleF07XG4gICAgdGhpcy5zZXQoZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgfVxufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgTWFwQ2FjaGVgLlxuTWFwQ2FjaGUucHJvdG90eXBlLmNsZWFyID0gbWFwQ2FjaGVDbGVhcjtcbk1hcENhY2hlLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBtYXBDYWNoZURlbGV0ZTtcbk1hcENhY2hlLnByb3RvdHlwZS5nZXQgPSBtYXBDYWNoZUdldDtcbk1hcENhY2hlLnByb3RvdHlwZS5oYXMgPSBtYXBDYWNoZUhhcztcbk1hcENhY2hlLnByb3RvdHlwZS5zZXQgPSBtYXBDYWNoZVNldDtcblxuZXhwb3J0IGRlZmF1bHQgTWFwQ2FjaGU7XG4iLCJpbXBvcnQgcm9vdCBmcm9tICcuL19yb290LmpzJztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgU3ltYm9sID0gcm9vdC5TeW1ib2w7XG5cbmV4cG9ydCBkZWZhdWx0IFN5bWJvbDtcbiIsImltcG9ydCBlcSBmcm9tICcuL2VxLmpzJztcblxuLyoqXG4gKiBHZXRzIHRoZSBpbmRleCBhdCB3aGljaCB0aGUgYGtleWAgaXMgZm91bmQgaW4gYGFycmF5YCBvZiBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHsqfSBrZXkgVGhlIGtleSB0byBzZWFyY2ggZm9yLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG1hdGNoZWQgdmFsdWUsIGVsc2UgYC0xYC5cbiAqL1xuZnVuY3Rpb24gYXNzb2NJbmRleE9mKGFycmF5LCBrZXkpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcbiAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgaWYgKGVxKGFycmF5W2xlbmd0aF1bMF0sIGtleSkpIHtcbiAgICAgIHJldHVybiBsZW5ndGg7XG4gICAgfVxuICB9XG4gIHJldHVybiAtMTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXNzb2NJbmRleE9mO1xuIiwiaW1wb3J0IFN5bWJvbCBmcm9tICcuL19TeW1ib2wuanMnO1xuaW1wb3J0IGdldFJhd1RhZyBmcm9tICcuL19nZXRSYXdUYWcuanMnO1xuaW1wb3J0IG9iamVjdFRvU3RyaW5nIGZyb20gJy4vX29iamVjdFRvU3RyaW5nLmpzJztcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIG51bGxUYWcgPSAnW29iamVjdCBOdWxsXScsXG4gICAgdW5kZWZpbmVkVGFnID0gJ1tvYmplY3QgVW5kZWZpbmVkXSc7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHN5bVRvU3RyaW5nVGFnID0gU3ltYm9sID8gU3ltYm9sLnRvU3RyaW5nVGFnIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBnZXRUYWdgIHdpdGhvdXQgZmFsbGJhY2tzIGZvciBidWdneSBlbnZpcm9ubWVudHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUdldFRhZyh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkVGFnIDogbnVsbFRhZztcbiAgfVxuICByZXR1cm4gKHN5bVRvU3RyaW5nVGFnICYmIHN5bVRvU3RyaW5nVGFnIGluIE9iamVjdCh2YWx1ZSkpXG4gICAgPyBnZXRSYXdUYWcodmFsdWUpXG4gICAgOiBvYmplY3RUb1N0cmluZyh2YWx1ZSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGJhc2VHZXRUYWc7XG4iLCJpbXBvcnQgYmFzZUdldFRhZyBmcm9tICcuL19iYXNlR2V0VGFnLmpzJztcbmltcG9ydCBpc09iamVjdExpa2UgZnJvbSAnLi9pc09iamVjdExpa2UuanMnO1xuXG52YXIgYXJyYXlCdWZmZXJUYWcgPSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzQXJyYXlCdWZmZXJgIHdpdGhvdXQgTm9kZS5qcyBvcHRpbWl6YXRpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGFycmF5IGJ1ZmZlciwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNBcnJheUJ1ZmZlcih2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBiYXNlR2V0VGFnKHZhbHVlKSA9PSBhcnJheUJ1ZmZlclRhZztcbn1cblxuZXhwb3J0IGRlZmF1bHQgYmFzZUlzQXJyYXlCdWZmZXI7XG4iLCJpbXBvcnQgaXNGdW5jdGlvbiBmcm9tICcuL2lzRnVuY3Rpb24uanMnO1xuaW1wb3J0IGlzTWFza2VkIGZyb20gJy4vX2lzTWFza2VkLmpzJztcbmltcG9ydCBpc09iamVjdCBmcm9tICcuL2lzT2JqZWN0LmpzJztcbmltcG9ydCB0b1NvdXJjZSBmcm9tICcuL190b1NvdXJjZS5qcyc7XG5cbi8qKlxuICogVXNlZCB0byBtYXRjaCBgUmVnRXhwYFxuICogW3N5bnRheCBjaGFyYWN0ZXJzXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1wYXR0ZXJucykuXG4gKi9cbnZhciByZVJlZ0V4cENoYXIgPSAvW1xcXFxeJC4qKz8oKVtcXF17fXxdL2c7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBob3N0IGNvbnN0cnVjdG9ycyAoU2FmYXJpKS4gKi9cbnZhciByZUlzSG9zdEN0b3IgPSAvXlxcW29iamVjdCAuKz9Db25zdHJ1Y3RvclxcXSQvO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgZnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlLFxuICAgIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZ1bmNUb1N0cmluZyA9IGZ1bmNQcm90by50b1N0cmluZztcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGlmIGEgbWV0aG9kIGlzIG5hdGl2ZS4gKi9cbnZhciByZUlzTmF0aXZlID0gUmVnRXhwKCdeJyArXG4gIGZ1bmNUb1N0cmluZy5jYWxsKGhhc093blByb3BlcnR5KS5yZXBsYWNlKHJlUmVnRXhwQ2hhciwgJ1xcXFwkJicpXG4gIC5yZXBsYWNlKC9oYXNPd25Qcm9wZXJ0eXwoZnVuY3Rpb24pLio/KD89XFxcXFxcKCl8IGZvciAuKz8oPz1cXFxcXFxdKS9nLCAnJDEuKj8nKSArICckJ1xuKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc05hdGl2ZWAgd2l0aG91dCBiYWQgc2hpbSBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBuYXRpdmUgZnVuY3Rpb24sXG4gKiAgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNOYXRpdmUodmFsdWUpIHtcbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkgfHwgaXNNYXNrZWQodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBwYXR0ZXJuID0gaXNGdW5jdGlvbih2YWx1ZSkgPyByZUlzTmF0aXZlIDogcmVJc0hvc3RDdG9yO1xuICByZXR1cm4gcGF0dGVybi50ZXN0KHRvU291cmNlKHZhbHVlKSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGJhc2VJc05hdGl2ZTtcbiIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udW5hcnlgIHdpdGhvdXQgc3VwcG9ydCBmb3Igc3RvcmluZyBtZXRhZGF0YS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY2FwIGFyZ3VtZW50cyBmb3IuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBjYXBwZWQgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VVbmFyeShmdW5jKSB7XG4gIHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiBmdW5jKHZhbHVlKTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYmFzZVVuYXJ5O1xuIiwiaW1wb3J0IHJvb3QgZnJvbSAnLi9fcm9vdC5qcyc7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBvdmVycmVhY2hpbmcgY29yZS1qcyBzaGltcy4gKi9cbnZhciBjb3JlSnNEYXRhID0gcm9vdFsnX19jb3JlLWpzX3NoYXJlZF9fJ107XG5cbmV4cG9ydCBkZWZhdWx0IGNvcmVKc0RhdGE7XG4iLCIvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGdsb2JhbGAgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVHbG9iYWwgPSB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbCAmJiBnbG9iYWwuT2JqZWN0ID09PSBPYmplY3QgJiYgZ2xvYmFsO1xuXG5leHBvcnQgZGVmYXVsdCBmcmVlR2xvYmFsO1xuIiwiaW1wb3J0IGlzS2V5YWJsZSBmcm9tICcuL19pc0tleWFibGUuanMnO1xuXG4vKipcbiAqIEdldHMgdGhlIGRhdGEgZm9yIGBtYXBgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gbWFwIFRoZSBtYXAgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSByZWZlcmVuY2Uga2V5LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIG1hcCBkYXRhLlxuICovXG5mdW5jdGlvbiBnZXRNYXBEYXRhKG1hcCwga2V5KSB7XG4gIHZhciBkYXRhID0gbWFwLl9fZGF0YV9fO1xuICByZXR1cm4gaXNLZXlhYmxlKGtleSlcbiAgICA/IGRhdGFbdHlwZW9mIGtleSA9PSAnc3RyaW5nJyA/ICdzdHJpbmcnIDogJ2hhc2gnXVxuICAgIDogZGF0YS5tYXA7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldE1hcERhdGE7XG4iLCJpbXBvcnQgYmFzZUlzTmF0aXZlIGZyb20gJy4vX2Jhc2VJc05hdGl2ZS5qcyc7XG5pbXBvcnQgZ2V0VmFsdWUgZnJvbSAnLi9fZ2V0VmFsdWUuanMnO1xuXG4vKipcbiAqIEdldHMgdGhlIG5hdGl2ZSBmdW5jdGlvbiBhdCBga2V5YCBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBtZXRob2QgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGZ1bmN0aW9uIGlmIGl0J3MgbmF0aXZlLCBlbHNlIGB1bmRlZmluZWRgLlxuICovXG5mdW5jdGlvbiBnZXROYXRpdmUob2JqZWN0LCBrZXkpIHtcbiAgdmFyIHZhbHVlID0gZ2V0VmFsdWUob2JqZWN0LCBrZXkpO1xuICByZXR1cm4gYmFzZUlzTmF0aXZlKHZhbHVlKSA/IHZhbHVlIDogdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZGVmYXVsdCBnZXROYXRpdmU7XG4iLCJpbXBvcnQgU3ltYm9sIGZyb20gJy4vX1N5bWJvbC5qcyc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBuYXRpdmVPYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1Ub1N0cmluZ1RhZyA9IFN5bWJvbCA/IFN5bWJvbC50b1N0cmluZ1RhZyA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VHZXRUYWdgIHdoaWNoIGlnbm9yZXMgYFN5bWJvbC50b1N0cmluZ1RhZ2AgdmFsdWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHJhdyBgdG9TdHJpbmdUYWdgLlxuICovXG5mdW5jdGlvbiBnZXRSYXdUYWcodmFsdWUpIHtcbiAgdmFyIGlzT3duID0gaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgc3ltVG9TdHJpbmdUYWcpLFxuICAgICAgdGFnID0gdmFsdWVbc3ltVG9TdHJpbmdUYWddO1xuXG4gIHRyeSB7XG4gICAgdmFsdWVbc3ltVG9TdHJpbmdUYWddID0gdW5kZWZpbmVkO1xuICAgIHZhciB1bm1hc2tlZCA9IHRydWU7XG4gIH0gY2F0Y2ggKGUpIHt9XG5cbiAgdmFyIHJlc3VsdCA9IG5hdGl2ZU9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICBpZiAodW5tYXNrZWQpIHtcbiAgICBpZiAoaXNPd24pIHtcbiAgICAgIHZhbHVlW3N5bVRvU3RyaW5nVGFnXSA9IHRhZztcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0UmF3VGFnO1xuIiwiLyoqXG4gKiBHZXRzIHRoZSB2YWx1ZSBhdCBga2V5YCBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3RdIFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBwcm9wZXJ0eSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gZ2V0VmFsdWUob2JqZWN0LCBrZXkpIHtcbiAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldFZhbHVlO1xuIiwiaW1wb3J0IG5hdGl2ZUNyZWF0ZSBmcm9tICcuL19uYXRpdmVDcmVhdGUuanMnO1xuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIGhhc2guXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgSGFzaFxuICovXG5mdW5jdGlvbiBoYXNoQ2xlYXIoKSB7XG4gIHRoaXMuX19kYXRhX18gPSBuYXRpdmVDcmVhdGUgPyBuYXRpdmVDcmVhdGUobnVsbCkgOiB7fTtcbiAgdGhpcy5zaXplID0gMDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaGFzaENsZWFyO1xuIiwiLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgaGFzaC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtPYmplY3R9IGhhc2ggVGhlIGhhc2ggdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGhhc2hEZWxldGUoa2V5KSB7XG4gIHZhciByZXN1bHQgPSB0aGlzLmhhcyhrZXkpICYmIGRlbGV0ZSB0aGlzLl9fZGF0YV9fW2tleV07XG4gIHRoaXMuc2l6ZSAtPSByZXN1bHQgPyAxIDogMDtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaGFzaERlbGV0ZTtcbiIsImltcG9ydCBuYXRpdmVDcmVhdGUgZnJvbSAnLi9fbmF0aXZlQ3JlYXRlLmpzJztcblxuLyoqIFVzZWQgdG8gc3RhbmQtaW4gZm9yIGB1bmRlZmluZWRgIGhhc2ggdmFsdWVzLiAqL1xudmFyIEhBU0hfVU5ERUZJTkVEID0gJ19fbG9kYXNoX2hhc2hfdW5kZWZpbmVkX18nO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIEdldHMgdGhlIGhhc2ggdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gaGFzaEdldChrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICBpZiAobmF0aXZlQ3JlYXRlKSB7XG4gICAgdmFyIHJlc3VsdCA9IGRhdGFba2V5XTtcbiAgICByZXR1cm4gcmVzdWx0ID09PSBIQVNIX1VOREVGSU5FRCA/IHVuZGVmaW5lZCA6IHJlc3VsdDtcbiAgfVxuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChkYXRhLCBrZXkpID8gZGF0YVtrZXldIDogdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZGVmYXVsdCBoYXNoR2V0O1xuIiwiaW1wb3J0IG5hdGl2ZUNyZWF0ZSBmcm9tICcuL19uYXRpdmVDcmVhdGUuanMnO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIENoZWNrcyBpZiBhIGhhc2ggdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGhhc2hIYXMoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgcmV0dXJuIG5hdGl2ZUNyZWF0ZSA/IChkYXRhW2tleV0gIT09IHVuZGVmaW5lZCkgOiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGRhdGEsIGtleSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGhhc2hIYXM7XG4iLCJpbXBvcnQgbmF0aXZlQ3JlYXRlIGZyb20gJy4vX25hdGl2ZUNyZWF0ZS5qcyc7XG5cbi8qKiBVc2VkIHRvIHN0YW5kLWluIGZvciBgdW5kZWZpbmVkYCBoYXNoIHZhbHVlcy4gKi9cbnZhciBIQVNIX1VOREVGSU5FRCA9ICdfX2xvZGFzaF9oYXNoX3VuZGVmaW5lZF9fJztcblxuLyoqXG4gKiBTZXRzIHRoZSBoYXNoIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgaGFzaCBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gaGFzaFNldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgdGhpcy5zaXplICs9IHRoaXMuaGFzKGtleSkgPyAwIDogMTtcbiAgZGF0YVtrZXldID0gKG5hdGl2ZUNyZWF0ZSAmJiB2YWx1ZSA9PT0gdW5kZWZpbmVkKSA/IEhBU0hfVU5ERUZJTkVEIDogdmFsdWU7XG4gIHJldHVybiB0aGlzO1xufVxuXG5leHBvcnQgZGVmYXVsdCBoYXNoU2V0O1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBzdWl0YWJsZSBmb3IgdXNlIGFzIHVuaXF1ZSBvYmplY3Qga2V5LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIHN1aXRhYmxlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzS2V5YWJsZSh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuICh0eXBlID09ICdzdHJpbmcnIHx8IHR5cGUgPT0gJ251bWJlcicgfHwgdHlwZSA9PSAnc3ltYm9sJyB8fCB0eXBlID09ICdib29sZWFuJylcbiAgICA/ICh2YWx1ZSAhPT0gJ19fcHJvdG9fXycpXG4gICAgOiAodmFsdWUgPT09IG51bGwpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpc0tleWFibGU7XG4iLCJpbXBvcnQgY29yZUpzRGF0YSBmcm9tICcuL19jb3JlSnNEYXRhLmpzJztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG1ldGhvZHMgbWFzcXVlcmFkaW5nIGFzIG5hdGl2ZS4gKi9cbnZhciBtYXNrU3JjS2V5ID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgdWlkID0gL1teLl0rJC8uZXhlYyhjb3JlSnNEYXRhICYmIGNvcmVKc0RhdGEua2V5cyAmJiBjb3JlSnNEYXRhLmtleXMuSUVfUFJPVE8gfHwgJycpO1xuICByZXR1cm4gdWlkID8gKCdTeW1ib2woc3JjKV8xLicgKyB1aWQpIDogJyc7XG59KCkpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgZnVuY2AgaGFzIGl0cyBzb3VyY2UgbWFza2VkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgZnVuY2AgaXMgbWFza2VkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzTWFza2VkKGZ1bmMpIHtcbiAgcmV0dXJuICEhbWFza1NyY0tleSAmJiAobWFza1NyY0tleSBpbiBmdW5jKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaXNNYXNrZWQ7XG4iLCIvKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIGxpc3QgY2FjaGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZUNsZWFyKCkge1xuICB0aGlzLl9fZGF0YV9fID0gW107XG4gIHRoaXMuc2l6ZSA9IDA7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGxpc3RDYWNoZUNsZWFyO1xuIiwiaW1wb3J0IGFzc29jSW5kZXhPZiBmcm9tICcuL19hc3NvY0luZGV4T2YuanMnO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgYXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3BsaWNlID0gYXJyYXlQcm90by5zcGxpY2U7XG5cbi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIGxpc3QgY2FjaGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZURlbGV0ZShrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgaW5kZXggPSBhc3NvY0luZGV4T2YoZGF0YSwga2V5KTtcblxuICBpZiAoaW5kZXggPCAwKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBsYXN0SW5kZXggPSBkYXRhLmxlbmd0aCAtIDE7XG4gIGlmIChpbmRleCA9PSBsYXN0SW5kZXgpIHtcbiAgICBkYXRhLnBvcCgpO1xuICB9IGVsc2Uge1xuICAgIHNwbGljZS5jYWxsKGRhdGEsIGluZGV4LCAxKTtcbiAgfVxuICAtLXRoaXMuc2l6ZTtcbiAgcmV0dXJuIHRydWU7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGxpc3RDYWNoZURlbGV0ZTtcbiIsImltcG9ydCBhc3NvY0luZGV4T2YgZnJvbSAnLi9fYXNzb2NJbmRleE9mLmpzJztcblxuLyoqXG4gKiBHZXRzIHRoZSBsaXN0IGNhY2hlIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlR2V0KGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIHJldHVybiBpbmRleCA8IDAgPyB1bmRlZmluZWQgOiBkYXRhW2luZGV4XVsxXTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbGlzdENhY2hlR2V0O1xuIiwiaW1wb3J0IGFzc29jSW5kZXhPZiBmcm9tICcuL19hc3NvY0luZGV4T2YuanMnO1xuXG4vKipcbiAqIENoZWNrcyBpZiBhIGxpc3QgY2FjaGUgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlSGFzKGtleSkge1xuICByZXR1cm4gYXNzb2NJbmRleE9mKHRoaXMuX19kYXRhX18sIGtleSkgPiAtMTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbGlzdENhY2hlSGFzO1xuIiwiaW1wb3J0IGFzc29jSW5kZXhPZiBmcm9tICcuL19hc3NvY0luZGV4T2YuanMnO1xuXG4vKipcbiAqIFNldHMgdGhlIGxpc3QgY2FjaGUgYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGxpc3QgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZVNldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIGluZGV4ID0gYXNzb2NJbmRleE9mKGRhdGEsIGtleSk7XG5cbiAgaWYgKGluZGV4IDwgMCkge1xuICAgICsrdGhpcy5zaXplO1xuICAgIGRhdGEucHVzaChba2V5LCB2YWx1ZV0pO1xuICB9IGVsc2Uge1xuICAgIGRhdGFbaW5kZXhdWzFdID0gdmFsdWU7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGxpc3RDYWNoZVNldDtcbiIsImltcG9ydCBIYXNoIGZyb20gJy4vX0hhc2guanMnO1xuaW1wb3J0IExpc3RDYWNoZSBmcm9tICcuL19MaXN0Q2FjaGUuanMnO1xuaW1wb3J0IE1hcCBmcm9tICcuL19NYXAuanMnO1xuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIG1hcC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUNsZWFyKCkge1xuICB0aGlzLnNpemUgPSAwO1xuICB0aGlzLl9fZGF0YV9fID0ge1xuICAgICdoYXNoJzogbmV3IEhhc2gsXG4gICAgJ21hcCc6IG5ldyAoTWFwIHx8IExpc3RDYWNoZSksXG4gICAgJ3N0cmluZyc6IG5ldyBIYXNoXG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IG1hcENhY2hlQ2xlYXI7XG4iLCJpbXBvcnQgZ2V0TWFwRGF0YSBmcm9tICcuL19nZXRNYXBEYXRhLmpzJztcblxuLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgbWFwLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlRGVsZXRlKGtleSkge1xuICB2YXIgcmVzdWx0ID0gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpWydkZWxldGUnXShrZXkpO1xuICB0aGlzLnNpemUgLT0gcmVzdWx0ID8gMSA6IDA7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IG1hcENhY2hlRGVsZXRlO1xuIiwiaW1wb3J0IGdldE1hcERhdGEgZnJvbSAnLi9fZ2V0TWFwRGF0YS5qcyc7XG5cbi8qKlxuICogR2V0cyB0aGUgbWFwIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUdldChrZXkpIHtcbiAgcmV0dXJuIGdldE1hcERhdGEodGhpcywga2V5KS5nZXQoa2V5KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbWFwQ2FjaGVHZXQ7XG4iLCJpbXBvcnQgZ2V0TWFwRGF0YSBmcm9tICcuL19nZXRNYXBEYXRhLmpzJztcblxuLyoqXG4gKiBDaGVja3MgaWYgYSBtYXAgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUhhcyhrZXkpIHtcbiAgcmV0dXJuIGdldE1hcERhdGEodGhpcywga2V5KS5oYXMoa2V5KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbWFwQ2FjaGVIYXM7XG4iLCJpbXBvcnQgZ2V0TWFwRGF0YSBmcm9tICcuL19nZXRNYXBEYXRhLmpzJztcblxuLyoqXG4gKiBTZXRzIHRoZSBtYXAgYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbWFwIGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZVNldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpLFxuICAgICAgc2l6ZSA9IGRhdGEuc2l6ZTtcblxuICBkYXRhLnNldChrZXksIHZhbHVlKTtcbiAgdGhpcy5zaXplICs9IGRhdGEuc2l6ZSA9PSBzaXplID8gMCA6IDE7XG4gIHJldHVybiB0aGlzO1xufVxuXG5leHBvcnQgZGVmYXVsdCBtYXBDYWNoZVNldDtcbiIsImltcG9ydCBnZXROYXRpdmUgZnJvbSAnLi9fZ2V0TmF0aXZlLmpzJztcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIG5hdGl2ZUNyZWF0ZSA9IGdldE5hdGl2ZShPYmplY3QsICdjcmVhdGUnKTtcblxuZXhwb3J0IGRlZmF1bHQgbmF0aXZlQ3JlYXRlO1xuIiwiaW1wb3J0IGZyZWVHbG9iYWwgZnJvbSAnLi9fZnJlZUdsb2JhbC5qcyc7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZXhwb3J0c2AuICovXG52YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzICYmICFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYC4gKi9cbnZhciBmcmVlTW9kdWxlID0gZnJlZUV4cG9ydHMgJiYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSAmJiBtb2R1bGU7XG5cbi8qKiBEZXRlY3QgdGhlIHBvcHVsYXIgQ29tbW9uSlMgZXh0ZW5zaW9uIGBtb2R1bGUuZXhwb3J0c2AuICovXG52YXIgbW9kdWxlRXhwb3J0cyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5leHBvcnRzID09PSBmcmVlRXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBwcm9jZXNzYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZVByb2Nlc3MgPSBtb2R1bGVFeHBvcnRzICYmIGZyZWVHbG9iYWwucHJvY2VzcztcblxuLyoqIFVzZWQgdG8gYWNjZXNzIGZhc3RlciBOb2RlLmpzIGhlbHBlcnMuICovXG52YXIgbm9kZVV0aWwgPSAoZnVuY3Rpb24oKSB7XG4gIHRyeSB7XG4gICAgLy8gVXNlIGB1dGlsLnR5cGVzYCBmb3IgTm9kZS5qcyAxMCsuXG4gICAgdmFyIHR5cGVzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLnJlcXVpcmUgJiYgZnJlZU1vZHVsZS5yZXF1aXJlKCd1dGlsJykudHlwZXM7XG5cbiAgICBpZiAodHlwZXMpIHtcbiAgICAgIHJldHVybiB0eXBlcztcbiAgICB9XG5cbiAgICAvLyBMZWdhY3kgYHByb2Nlc3MuYmluZGluZygndXRpbCcpYCBmb3IgTm9kZS5qcyA8IDEwLlxuICAgIHJldHVybiBmcmVlUHJvY2VzcyAmJiBmcmVlUHJvY2Vzcy5iaW5kaW5nICYmIGZyZWVQcm9jZXNzLmJpbmRpbmcoJ3V0aWwnKTtcbiAgfSBjYXRjaCAoZSkge31cbn0oKSk7XG5cbmV4cG9ydCBkZWZhdWx0IG5vZGVVdGlsO1xuIiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG5hdGl2ZU9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZyB1c2luZyBgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gbmF0aXZlT2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IG9iamVjdFRvU3RyaW5nO1xuIiwiaW1wb3J0IGZyZWVHbG9iYWwgZnJvbSAnLi9fZnJlZUdsb2JhbC5qcyc7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgc2VsZmAuICovXG52YXIgZnJlZVNlbGYgPSB0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmICYmIHNlbGYuT2JqZWN0ID09PSBPYmplY3QgJiYgc2VsZjtcblxuLyoqIFVzZWQgYXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QuICovXG52YXIgcm9vdCA9IGZyZWVHbG9iYWwgfHwgZnJlZVNlbGYgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblxuZXhwb3J0IGRlZmF1bHQgcm9vdDtcbiIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBmdW5jUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGRlY29tcGlsZWQgc291cmNlIG9mIGZ1bmN0aW9ucy4gKi9cbnZhciBmdW5jVG9TdHJpbmcgPSBmdW5jUHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ29udmVydHMgYGZ1bmNgIHRvIGl0cyBzb3VyY2UgY29kZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHNvdXJjZSBjb2RlLlxuICovXG5mdW5jdGlvbiB0b1NvdXJjZShmdW5jKSB7XG4gIGlmIChmdW5jICE9IG51bGwpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGZ1bmNUb1N0cmluZy5jYWxsKGZ1bmMpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiAoZnVuYyArICcnKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICB9XG4gIHJldHVybiAnJztcbn1cblxuZXhwb3J0IGRlZmF1bHQgdG9Tb3VyY2U7XG4iLCIvKipcbiAqIFBlcmZvcm1zIGFcbiAqIFtgU2FtZVZhbHVlWmVyb2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXNhbWV2YWx1ZXplcm8pXG4gKiBjb21wYXJpc29uIGJldHdlZW4gdHdvIHZhbHVlcyB0byBkZXRlcm1pbmUgaWYgdGhleSBhcmUgZXF1aXZhbGVudC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7Kn0gb3RoZXIgVGhlIG90aGVyIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHZhbHVlcyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IDEgfTtcbiAqIHZhciBvdGhlciA9IHsgJ2EnOiAxIH07XG4gKlxuICogXy5lcShvYmplY3QsIG9iamVjdCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5lcShvYmplY3QsIG90aGVyKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5lcSgnYScsICdhJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5lcSgnYScsIE9iamVjdCgnYScpKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5lcShOYU4sIE5hTik7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGVxKHZhbHVlLCBvdGhlcikge1xuICByZXR1cm4gdmFsdWUgPT09IG90aGVyIHx8ICh2YWx1ZSAhPT0gdmFsdWUgJiYgb3RoZXIgIT09IG90aGVyKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZXE7XG4iLCJpbXBvcnQgYmFzZUlzQXJyYXlCdWZmZXIgZnJvbSAnLi9fYmFzZUlzQXJyYXlCdWZmZXIuanMnO1xuaW1wb3J0IGJhc2VVbmFyeSBmcm9tICcuL19iYXNlVW5hcnkuanMnO1xuaW1wb3J0IG5vZGVVdGlsIGZyb20gJy4vX25vZGVVdGlsLmpzJztcblxuLyogTm9kZS5qcyBoZWxwZXIgcmVmZXJlbmNlcy4gKi9cbnZhciBub2RlSXNBcnJheUJ1ZmZlciA9IG5vZGVVdGlsICYmIG5vZGVVdGlsLmlzQXJyYXlCdWZmZXI7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhbiBgQXJyYXlCdWZmZXJgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMy4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBhcnJheSBidWZmZXIsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5QnVmZmVyKG5ldyBBcnJheUJ1ZmZlcigyKSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5QnVmZmVyKG5ldyBBcnJheSgyKSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNBcnJheUJ1ZmZlciA9IG5vZGVJc0FycmF5QnVmZmVyID8gYmFzZVVuYXJ5KG5vZGVJc0FycmF5QnVmZmVyKSA6IGJhc2VJc0FycmF5QnVmZmVyO1xuXG5leHBvcnQgZGVmYXVsdCBpc0FycmF5QnVmZmVyO1xuIiwiaW1wb3J0IGJhc2VHZXRUYWcgZnJvbSAnLi9fYmFzZUdldFRhZy5qcyc7XG5pbXBvcnQgaXNPYmplY3QgZnJvbSAnLi9pc09iamVjdC5qcyc7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhc3luY1RhZyA9ICdbb2JqZWN0IEFzeW5jRnVuY3Rpb25dJyxcbiAgICBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJyxcbiAgICBnZW5UYWcgPSAnW29iamVjdCBHZW5lcmF0b3JGdW5jdGlvbl0nLFxuICAgIHByb3h5VGFnID0gJ1tvYmplY3QgUHJveHldJztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYEZ1bmN0aW9uYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBmdW5jdGlvbiwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oXyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0Z1bmN0aW9uKC9hYmMvKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy8gVGhlIHVzZSBvZiBgT2JqZWN0I3RvU3RyaW5nYCBhdm9pZHMgaXNzdWVzIHdpdGggdGhlIGB0eXBlb2ZgIG9wZXJhdG9yXG4gIC8vIGluIFNhZmFyaSA5IHdoaWNoIHJldHVybnMgJ29iamVjdCcgZm9yIHR5cGVkIGFycmF5cyBhbmQgb3RoZXIgY29uc3RydWN0b3JzLlxuICB2YXIgdGFnID0gYmFzZUdldFRhZyh2YWx1ZSk7XG4gIHJldHVybiB0YWcgPT0gZnVuY1RhZyB8fCB0YWcgPT0gZ2VuVGFnIHx8IHRhZyA9PSBhc3luY1RhZyB8fCB0YWcgPT0gcHJveHlUYWc7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGlzRnVuY3Rpb247XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZVxuICogW2xhbmd1YWdlIHR5cGVdKGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1lY21hc2NyaXB0LWxhbmd1YWdlLXR5cGVzKVxuICogb2YgYE9iamVjdGAuIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChfLm5vb3ApO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaXNPYmplY3Q7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLiBBIHZhbHVlIGlzIG9iamVjdC1saWtlIGlmIGl0J3Mgbm90IGBudWxsYFxuICogYW5kIGhhcyBhIGB0eXBlb2ZgIHJlc3VsdCBvZiBcIm9iamVjdFwiLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxuZXhwb3J0IGRlZmF1bHQgaXNPYmplY3RMaWtlO1xuIiwiaW1wb3J0IE1hcENhY2hlIGZyb20gJy4vX01hcENhY2hlLmpzJztcblxuLyoqIEVycm9yIG1lc3NhZ2UgY29uc3RhbnRzLiAqL1xudmFyIEZVTkNfRVJST1JfVEVYVCA9ICdFeHBlY3RlZCBhIGZ1bmN0aW9uJztcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBtZW1vaXplcyB0aGUgcmVzdWx0IG9mIGBmdW5jYC4gSWYgYHJlc29sdmVyYCBpc1xuICogcHJvdmlkZWQsIGl0IGRldGVybWluZXMgdGhlIGNhY2hlIGtleSBmb3Igc3RvcmluZyB0aGUgcmVzdWx0IGJhc2VkIG9uIHRoZVxuICogYXJndW1lbnRzIHByb3ZpZGVkIHRvIHRoZSBtZW1vaXplZCBmdW5jdGlvbi4gQnkgZGVmYXVsdCwgdGhlIGZpcnN0IGFyZ3VtZW50XG4gKiBwcm92aWRlZCB0byB0aGUgbWVtb2l6ZWQgZnVuY3Rpb24gaXMgdXNlZCBhcyB0aGUgbWFwIGNhY2hlIGtleS4gVGhlIGBmdW5jYFxuICogaXMgaW52b2tlZCB3aXRoIHRoZSBgdGhpc2AgYmluZGluZyBvZiB0aGUgbWVtb2l6ZWQgZnVuY3Rpb24uXG4gKlxuICogKipOb3RlOioqIFRoZSBjYWNoZSBpcyBleHBvc2VkIGFzIHRoZSBgY2FjaGVgIHByb3BlcnR5IG9uIHRoZSBtZW1vaXplZFxuICogZnVuY3Rpb24uIEl0cyBjcmVhdGlvbiBtYXkgYmUgY3VzdG9taXplZCBieSByZXBsYWNpbmcgdGhlIGBfLm1lbW9pemUuQ2FjaGVgXG4gKiBjb25zdHJ1Y3RvciB3aXRoIG9uZSB3aG9zZSBpbnN0YW5jZXMgaW1wbGVtZW50IHRoZVxuICogW2BNYXBgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1wcm9wZXJ0aWVzLW9mLXRoZS1tYXAtcHJvdG90eXBlLW9iamVjdClcbiAqIG1ldGhvZCBpbnRlcmZhY2Ugb2YgYGNsZWFyYCwgYGRlbGV0ZWAsIGBnZXRgLCBgaGFzYCwgYW5kIGBzZXRgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gaGF2ZSBpdHMgb3V0cHV0IG1lbW9pemVkLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW3Jlc29sdmVyXSBUaGUgZnVuY3Rpb24gdG8gcmVzb2x2ZSB0aGUgY2FjaGUga2V5LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgbWVtb2l6ZWQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSwgJ2InOiAyIH07XG4gKiB2YXIgb3RoZXIgPSB7ICdjJzogMywgJ2QnOiA0IH07XG4gKlxuICogdmFyIHZhbHVlcyA9IF8ubWVtb2l6ZShfLnZhbHVlcyk7XG4gKiB2YWx1ZXMob2JqZWN0KTtcbiAqIC8vID0+IFsxLCAyXVxuICpcbiAqIHZhbHVlcyhvdGhlcik7XG4gKiAvLyA9PiBbMywgNF1cbiAqXG4gKiBvYmplY3QuYSA9IDI7XG4gKiB2YWx1ZXMob2JqZWN0KTtcbiAqIC8vID0+IFsxLCAyXVxuICpcbiAqIC8vIE1vZGlmeSB0aGUgcmVzdWx0IGNhY2hlLlxuICogdmFsdWVzLmNhY2hlLnNldChvYmplY3QsIFsnYScsICdiJ10pO1xuICogdmFsdWVzKG9iamVjdCk7XG4gKiAvLyA9PiBbJ2EnLCAnYiddXG4gKlxuICogLy8gUmVwbGFjZSBgXy5tZW1vaXplLkNhY2hlYC5cbiAqIF8ubWVtb2l6ZS5DYWNoZSA9IFdlYWtNYXA7XG4gKi9cbmZ1bmN0aW9uIG1lbW9pemUoZnVuYywgcmVzb2x2ZXIpIHtcbiAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicgfHwgKHJlc29sdmVyICE9IG51bGwgJiYgdHlwZW9mIHJlc29sdmVyICE9ICdmdW5jdGlvbicpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGVU5DX0VSUk9SX1RFWFQpO1xuICB9XG4gIHZhciBtZW1vaXplZCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzLFxuICAgICAgICBrZXkgPSByZXNvbHZlciA/IHJlc29sdmVyLmFwcGx5KHRoaXMsIGFyZ3MpIDogYXJnc1swXSxcbiAgICAgICAgY2FjaGUgPSBtZW1vaXplZC5jYWNoZTtcblxuICAgIGlmIChjYWNoZS5oYXMoa2V5KSkge1xuICAgICAgcmV0dXJuIGNhY2hlLmdldChrZXkpO1xuICAgIH1cbiAgICB2YXIgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICBtZW1vaXplZC5jYWNoZSA9IGNhY2hlLnNldChrZXksIHJlc3VsdCkgfHwgY2FjaGU7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbiAgbWVtb2l6ZWQuY2FjaGUgPSBuZXcgKG1lbW9pemUuQ2FjaGUgfHwgTWFwQ2FjaGUpO1xuICByZXR1cm4gbWVtb2l6ZWQ7XG59XG5cbi8vIEV4cG9zZSBgTWFwQ2FjaGVgLlxubWVtb2l6ZS5DYWNoZSA9IE1hcENhY2hlO1xuXG5leHBvcnQgZGVmYXVsdCBtZW1vaXplO1xuIiwiaW1wb3J0IHtcblx0SEFMRl9GTE9BVCwgRkxPQVQsIFVOU0lHTkVEX0JZVEUsIEJZVEUsIFVOU0lHTkVEX1NIT1JULCBTSE9SVCwgVU5TSUdORURfSU5ULCBJTlQsXG5cdExJTkVBUiwgTkVBUkVTVCxcblx0UkVQRUFULCBDTEFNUF9UT19FREdFLCBSR0IsIFJHQkEsXG59IGZyb20gJy4vQ29uc3RhbnRzJztcblxuZXhwb3J0IGNvbnN0IHZhbGlkRGF0YVR5cGVzID0gW0hBTEZfRkxPQVQsIEZMT0FULCBVTlNJR05FRF9CWVRFLCBCWVRFLCBVTlNJR05FRF9TSE9SVCwgU0hPUlQsIFVOU0lHTkVEX0lOVCwgSU5UXTtcbmV4cG9ydCBmdW5jdGlvbiBpc1ZhbGlkRGF0YVR5cGUodHlwZTogc3RyaW5nKSB7XG5cdHJldHVybiB2YWxpZERhdGFUeXBlcy5pbmRleE9mKHR5cGUpID4gLTE7XG59XG5cbmV4cG9ydCBjb25zdCB2YWxpZEZpbHRlclR5cGVzID0gW0xJTkVBUiwgTkVBUkVTVF07XG5leHBvcnQgZnVuY3Rpb24gaXNWYWxpZEZpbHRlclR5cGUodHlwZTogc3RyaW5nKSB7XG5cdHJldHVybiB2YWxpZEZpbHRlclR5cGVzLmluZGV4T2YodHlwZSkgPiAtMTtcbn1cblxuZXhwb3J0IGNvbnN0IHZhbGlkV3JhcFR5cGVzID0gW0NMQU1QX1RPX0VER0UsIFJFUEVBVF07IC8vIE1JUlJPUkVEX1JFUEVBVFxuZXhwb3J0IGZ1bmN0aW9uIGlzVmFsaWRXcmFwVHlwZSh0eXBlOiBzdHJpbmcpIHtcblx0cmV0dXJuIHZhbGlkV3JhcFR5cGVzLmluZGV4T2YodHlwZSkgPiAtMTtcbn1cblxuZXhwb3J0IGNvbnN0IHZhbGlkVGV4dHVyZUZvcm1hdFR5cGVzID0gW1JHQiwgUkdCQV07XG5leHBvcnQgZnVuY3Rpb24gaXNWYWxpZFRleHR1cmVGb3JtYXRUeXBlKHR5cGU6IHN0cmluZykge1xuXHRyZXR1cm4gdmFsaWRUZXh0dXJlRm9ybWF0VHlwZXMuaW5kZXhPZih0eXBlKSA+IC0xO1xufVxuXG5leHBvcnQgY29uc3QgdmFsaWRUZXh0dXJlRGF0YVR5cGVzID0gW1VOU0lHTkVEX0JZVEVdO1xuZXhwb3J0IGZ1bmN0aW9uIGlzVmFsaWRUZXh0dXJlRGF0YVR5cGUodHlwZTogc3RyaW5nKSB7XG5cdHJldHVybiB2YWxpZFRleHR1cmVEYXRhVHlwZXMuaW5kZXhPZih0eXBlKSA+IC0xO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNOdW1iZXIodmFsdWU6IGFueSkge1xuXHRyZXR1cm4gIWlzTmFOKHZhbHVlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzSW50ZWdlcih2YWx1ZTogYW55KSB7XG5cdHJldHVybiBpc051bWJlcih2YWx1ZSkgJiYgKHZhbHVlICUgMSA9PT0gMCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1Bvc2l0aXZlSW50ZWdlcih2YWx1ZTogYW55KSB7XG5cdHJldHVybiBpc0ludGVnZXIodmFsdWUpICYmICB2YWx1ZSA+IDA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1N0cmluZyh2YWx1ZTogYW55KXtcblx0cmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZyc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0FycmF5KHZhbHVlOiBhbnkpIHtcblx0cmV0dXJuIEFycmF5LmlzQXJyYXkodmFsdWUpO1xufSIsImV4cG9ydCBjb25zdCBIQUxGX0ZMT0FUID0gJ0hBTEZfRkxPQVQnO1xuZXhwb3J0IGNvbnN0IEZMT0FUID0gJ0ZMT0FUJztcbmV4cG9ydCBjb25zdCBVTlNJR05FRF9CWVRFID0gJ1VOU0lHTkVEX0JZVEUnO1xuZXhwb3J0IGNvbnN0IEJZVEUgPSAnQllURSc7XG5leHBvcnQgY29uc3QgVU5TSUdORURfU0hPUlQgPSAnVU5TSUdORURfU0hPUlQnO1xuZXhwb3J0IGNvbnN0IFNIT1JUID0gJ1NIT1JUJztcbmV4cG9ydCBjb25zdCBVTlNJR05FRF9JTlQgPSAnVU5TSUdORURfSU5UJztcbmV4cG9ydCBjb25zdCBJTlQgPSAnSU5UJztcblxuZXhwb3J0IGNvbnN0IExJTkVBUiA9ICdMSU5FQVInO1xuZXhwb3J0IGNvbnN0IE5FQVJFU1QgPSAnTkVBUkVTVCc7XG5cbmV4cG9ydCBjb25zdCBSRVBFQVQgPSAnUkVQRUFUJztcbmV4cG9ydCBjb25zdCBDTEFNUF9UT19FREdFID0gJ0NMQU1QX1RPX0VER0UnO1xuLy8gZXhwb3J0IGNvbnN0IE1JUlJPUkVEX1JFUEVBVCA9ICdNSVJST1JFRF9SRVBFQVQnO1xuXG5leHBvcnQgY29uc3QgUkdCID0gJ1JHQic7XG5leHBvcnQgY29uc3QgUkdCQSA9ICdSR0JBJztcblxuZXhwb3J0IHR5cGUgRGF0YUxheWVyQXJyYXlUeXBlID0gIEZsb2F0MzJBcnJheSB8IFVpbnQ4QXJyYXkgfCBJbnQ4QXJyYXkgfCBVaW50MTZBcnJheSB8IEludDE2QXJyYXkgfCBVaW50MzJBcnJheSB8IEludDMyQXJyYXk7XG5leHBvcnQgdHlwZSBEYXRhTGF5ZXJUeXBlID0gdHlwZW9mIEhBTEZfRkxPQVQgfCB0eXBlb2YgRkxPQVQgfCB0eXBlb2YgVU5TSUdORURfQllURSB8IHR5cGVvZiBCWVRFIHwgdHlwZW9mIFVOU0lHTkVEX1NIT1JUIHwgdHlwZW9mIFNIT1JUIHwgdHlwZW9mIFVOU0lHTkVEX0lOVCB8IHR5cGVvZiBJTlQ7XG5leHBvcnQgdHlwZSBEYXRhTGF5ZXJOdW1Db21wb25lbnRzID0gMSB8IDIgfCAzIHwgNDtcbmV4cG9ydCB0eXBlIERhdGFMYXllckZpbHRlclR5cGUgPSB0eXBlb2YgTElORUFSIHwgdHlwZW9mIE5FQVJFU1Q7XG5leHBvcnQgdHlwZSBEYXRhTGF5ZXJXcmFwVHlwZSA9IHR5cGVvZiBSRVBFQVQgfCB0eXBlb2YgQ0xBTVBfVE9fRURHRTsvLyB8IHR5cGVvZiBNSVJST1JFRF9SRVBFQVQ7XG5cbmV4cG9ydCB0eXBlIFRleHR1cmVGb3JtYXRUeXBlID0gdHlwZW9mIFJHQiB8IHR5cGVvZiBSR0JBO1xuZXhwb3J0IHR5cGUgVGV4dHVyZURhdGFUeXBlID0gdHlwZW9mIFVOU0lHTkVEX0JZVEU7XG5cbmV4cG9ydCBjb25zdCBHTFNMMyA9ICczMDAgZXMnO1xuZXhwb3J0IGNvbnN0IEdMU0wxID0gJzEwMCc7XG5leHBvcnQgdHlwZSBHTFNMVmVyc2lvbiA9IHR5cGVvZiBHTFNMMSB8IHR5cGVvZiBHTFNMMztcblxuLy8gVW5pZm9ybSB0eXBlcy5cbmV4cG9ydCBjb25zdCBGTE9BVF8xRF9VTklGT1JNID0gJzFmJztcbmV4cG9ydCBjb25zdCBGTE9BVF8yRF9VTklGT1JNID0gJzJmJztcbmV4cG9ydCBjb25zdCBGTE9BVF8zRF9VTklGT1JNID0gJzNmJztcbmV4cG9ydCBjb25zdCBGTE9BVF80RF9VTklGT1JNID0gJzNmJztcbmV4cG9ydCBjb25zdCBJTlRfMURfVU5JRk9STSA9ICcxaSc7XG5leHBvcnQgY29uc3QgSU5UXzJEX1VOSUZPUk0gPSAnMmknO1xuZXhwb3J0IGNvbnN0IElOVF8zRF9VTklGT1JNID0gJzNpJztcbmV4cG9ydCBjb25zdCBJTlRfNERfVU5JRk9STSA9ICczaSc7XG5cbmV4cG9ydCB0eXBlIFVuaWZvcm1EYXRhVHlwZSA9IHR5cGVvZiBGTE9BVCB8IHR5cGVvZiBJTlQ7XG5leHBvcnQgdHlwZSBVbmlmb3JtVmFsdWVUeXBlID0gXG5cdG51bWJlciB8XG5cdFtudW1iZXJdIHxcblx0W251bWJlciwgbnVtYmVyXSB8XG5cdFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSB8XG5cdFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdO1xuZXhwb3J0IHR5cGUgVW5pZm9ybVR5cGUgPSBcblx0dHlwZW9mIEZMT0FUXzFEX1VOSUZPUk0gfFxuXHR0eXBlb2YgRkxPQVRfMkRfVU5JRk9STSB8XG5cdHR5cGVvZiBGTE9BVF8zRF9VTklGT1JNIHxcblx0dHlwZW9mIEZMT0FUXzREX1VOSUZPUk0gfFxuXHR0eXBlb2YgSU5UXzFEX1VOSUZPUk0gfFxuXHR0eXBlb2YgSU5UXzJEX1VOSUZPUk0gfFxuXHR0eXBlb2YgSU5UXzNEX1VOSUZPUk0gfFxuXHR0eXBlb2YgSU5UXzREX1VOSUZPUk07XG5leHBvcnQgdHlwZSBVbmlmb3JtID0geyBcblx0bG9jYXRpb246IHsgW2tleTogc3RyaW5nXTogV2ViR0xVbmlmb3JtTG9jYXRpb24gfSxcblx0dHlwZTogVW5pZm9ybVR5cGUsXG5cdHZhbHVlOiBVbmlmb3JtVmFsdWVUeXBlLFxufTtcblxuIiwiaW1wb3J0IHsgc2V0RmxvYXQxNiB9IGZyb20gJ0BwZXRhbW9yaWtlbi9mbG9hdDE2JztcbmltcG9ydCB7IGlzUG9zaXRpdmVJbnRlZ2VyLCBpc1ZhbGlkRGF0YVR5cGUsIGlzVmFsaWRGaWx0ZXJUeXBlLCBpc1ZhbGlkV3JhcFR5cGUsIHZhbGlkRGF0YVR5cGVzLCB2YWxpZEZpbHRlclR5cGVzLCB2YWxpZFdyYXBUeXBlcyB9IGZyb20gJy4vQ2hlY2tzJztcbmltcG9ydCB7XG5cdEhBTEZfRkxPQVQsIEZMT0FULCBVTlNJR05FRF9CWVRFLCBCWVRFLCBVTlNJR05FRF9TSE9SVCwgU0hPUlQsIFVOU0lHTkVEX0lOVCwgSU5ULFxuXHRORUFSRVNULCBMSU5FQVIsIENMQU1QX1RPX0VER0UsXG5cdERhdGFMYXllckFycmF5VHlwZSwgRGF0YUxheWVyRmlsdGVyVHlwZSwgRGF0YUxheWVyTnVtQ29tcG9uZW50cywgRGF0YUxheWVyVHlwZSwgRGF0YUxheWVyV3JhcFR5cGUsIEdMU0xWZXJzaW9uLCBHTFNMMywgR0xTTDEsXG4gfSBmcm9tICcuL0NvbnN0YW50cyc7XG5pbXBvcnQge1xuXHRnZXRFeHRlbnNpb24sXG5cdEVYVF9DT0xPUl9CVUZGRVJfRkxPQVQsXG5cdE9FU19URVhUVVJFX0ZMT0FULFxuXHRPRVNfVEVYVFVSRV9GTE9BVF9MSU5FQVIsXG5cdE9FU19URVhUVVJFX0hBTEZfRkxPQVQsXG5cdE9FU19URVhUVVJFX0hBbEZfRkxPQVRfTElORUFSLFxufSBmcm9tICcuL2V4dGVuc2lvbnMnO1xuaW1wb3J0IHsgaXNXZWJHTDIgfSBmcm9tICcuL3V0aWxzJztcblxuZXhwb3J0IHR5cGUgRGF0YUxheWVyQnVmZmVyID0ge1xuXHR0ZXh0dXJlOiBXZWJHTFRleHR1cmUsXG5cdGZyYW1lYnVmZmVyPzogV2ViR0xGcmFtZWJ1ZmZlcixcbn1cblxudHlwZSBFcnJvckNhbGxiYWNrID0gKG1lc3NhZ2U6IHN0cmluZykgPT4gdm9pZDtcblxuZXhwb3J0IGNsYXNzIERhdGFMYXllciB7XG5cdHJlYWRvbmx5IG5hbWU6IHN0cmluZztcblx0cHJpdmF0ZSByZWFkb25seSBnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0IHwgV2ViR0wyUmVuZGVyaW5nQ29udGV4dDtcblx0cHJpdmF0ZSByZWFkb25seSBlcnJvckNhbGxiYWNrOiBFcnJvckNhbGxiYWNrO1xuXG5cdC8vIEVhY2ggRGF0YUxheWVyIG1heSBjb250YWluIGEgbnVtYmVyIG9mIGJ1ZmZlcnMgdG8gc3RvcmUgZGlmZmVyZW50IGluc3RhbmNlcyBvZiB0aGUgc3RhdGUuXG5cdHByaXZhdGUgX2J1ZmZlckluZGV4ID0gMDtcblx0cmVhZG9ubHkgbnVtQnVmZmVycztcblx0cHJpdmF0ZSByZWFkb25seSBidWZmZXJzOiBEYXRhTGF5ZXJCdWZmZXJbXSA9IFtdO1xuXG5cdC8vIFRleHR1cmUgc2l6ZXMuXG5cdHByaXZhdGUgbGVuZ3RoPzogbnVtYmVyOyAvLyBUaGlzIGlzIG9ubHkgdXNlZCBmb3IgMUQgZGF0YSBsYXllcnMuXG5cdHByaXZhdGUgd2lkdGg6IG51bWJlcjtcblx0cHJpdmF0ZSBoZWlnaHQ6IG51bWJlcjtcblxuXHQvLyBEYXRhTGF5ZXIgc2V0dGluZ3MuXG5cdHJlYWRvbmx5IHR5cGU6IERhdGFMYXllclR5cGU7IC8vIElucHV0IHR5cGUgcGFzc2VkIGluIGR1cmluZyBzZXR1cC5cblx0cmVhZG9ubHkgaW50ZXJuYWxUeXBlOiBEYXRhTGF5ZXJUeXBlOyAvLyBUeXBlIHRoYXQgY29ycmVzcG9uZHMgdG8gZ2xUeXBlLCBtYXkgYmUgZGlmZmVyZW50IGZyb20gdHlwZS5cblx0cmVhZG9ubHkgd3JhcFM6IERhdGFMYXllcldyYXBUeXBlOyAvLyBJbnB1dCB3cmFwIHR5cGUgcGFzc2VkIGluIGR1cmluZyBzZXR1cC5cblx0cmVhZG9ubHkgd3JhcFQ6IERhdGFMYXllcldyYXBUeXBlOyAvLyBJbnB1dCB3cmFwIHR5cGUgcGFzc2VkIGluIGR1cmluZyBzZXR1cC5cblx0cmVhZG9ubHkgaW50ZXJuYWxXcmFwUzogRGF0YUxheWVyV3JhcFR5cGU7IC8vIFdyYXAgdHlwZSB0aGF0IGNvcnJlc3BvbmRzIHRvIGdsV3JhcFMsIG1heSBiZSBkaWZmZXJlbnQgZnJvbSB3cmFwUy5cblx0cmVhZG9ubHkgaW50ZXJuYWxXcmFwVDogRGF0YUxheWVyV3JhcFR5cGU7IC8vIFdyYXAgdHlwZSB0aGF0IGNvcnJlc3BvbmRzIHRvIGdsV3JhcFQsIG1heSBiZSBkaWZmZXJlbnQgZnJvbSB3cmFwVC5cblx0cmVhZG9ubHkgbnVtQ29tcG9uZW50czogRGF0YUxheWVyTnVtQ29tcG9uZW50czsgLy8gTnVtYmVyIG9mIFJHQkEgY2hhbm5lbHMgdG8gdXNlIGZvciB0aGlzIERhdGFMYXllci5cblx0cmVhZG9ubHkgZmlsdGVyOiBEYXRhTGF5ZXJGaWx0ZXJUeXBlOyAvLyBJbnRlcnBvbGF0aW9uIGZpbHRlciB0eXBlIG9mIGRhdGEuXG5cdHJlYWRvbmx5IGludGVybmFsRmlsdGVyOiBEYXRhTGF5ZXJGaWx0ZXJUeXBlOyAvLyBGaWx0ZXIgdHlwZSB0aGF0IGNvcnJlc3BvbmRzIHRvIGdsRmlsdGVyLCBtYXkgYmUgZGlmZmVyZW50IGZyb20gZmlsdGVyLlxuXHRyZWFkb25seSB3cml0YWJsZTogYm9vbGVhbjtcblxuXHQvLyBPcHRpbWl6YXRpb25zIHNvIHRoYXQgXCJjb3B5aW5nXCIgY2FuIGhhcHBlbiB3aXRob3V0IGRyYXcgY2FsbHMuXG5cdHByaXZhdGUgdGV4dHVyZU92ZXJyaWRlcz86IChXZWJHTFRleHR1cmUgfCB1bmRlZmluZWQpW107XG5cblx0Ly8gR0wgdmFyaWFibGVzICh0aGVzZSBtYXkgYmUgZGlmZmVyZW50IGZyb20gdGhlaXIgY29ycmVzcG9uZGluZyBub24tZ2wgcGFyYW1ldGVycykuXG5cdHJlYWRvbmx5IGdsSW50ZXJuYWxGb3JtYXQ6IG51bWJlcjtcblx0cmVhZG9ubHkgZ2xGb3JtYXQ6IG51bWJlcjtcblx0cmVhZG9ubHkgZ2xUeXBlOiBudW1iZXI7XG5cdHJlYWRvbmx5IGdsTnVtQ2hhbm5lbHM6IG51bWJlcjtcblx0cmVhZG9ubHkgZ2xXcmFwUzogbnVtYmVyO1xuXHRyZWFkb25seSBnbFdyYXBUOiBudW1iZXI7XG5cdHJlYWRvbmx5IGdsRmlsdGVyOiBudW1iZXI7XG5cblx0Y29uc3RydWN0b3IoXG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0IHwgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCxcblx0XHRcdG5hbWU6IHN0cmluZyxcblx0XHRcdGRpbWVuc2lvbnM6IG51bWJlciB8IFtudW1iZXIsIG51bWJlcl0sXG5cdFx0XHR0eXBlOiBEYXRhTGF5ZXJUeXBlLFxuXHRcdFx0bnVtQ29tcG9uZW50czogRGF0YUxheWVyTnVtQ29tcG9uZW50cyxcblx0XHRcdGdsc2xWZXJzaW9uOiBHTFNMVmVyc2lvbixcblx0XHRcdGRhdGE/OiBEYXRhTGF5ZXJBcnJheVR5cGUsXG5cdFx0XHRmaWx0ZXI/OiBEYXRhTGF5ZXJGaWx0ZXJUeXBlLFxuXHRcdFx0d3JhcFM/OiBEYXRhTGF5ZXJXcmFwVHlwZSxcblx0XHRcdHdyYXBUPzogRGF0YUxheWVyV3JhcFR5cGUsXG5cdFx0XHR3cml0YWJsZT86IGJvb2xlYW4sXG5cdFx0XHRudW1CdWZmZXJzPzogbnVtYmVyLFxuXHRcdFx0ZXJyb3JDYWxsYmFjazogRXJyb3JDYWxsYmFjayxcblx0XHR9LFxuXHQpIHtcblx0XHRjb25zdCB7IGdsLCBlcnJvckNhbGxiYWNrLCBuYW1lLCBkaW1lbnNpb25zLCB0eXBlLCBudW1Db21wb25lbnRzLCBkYXRhLCBnbHNsVmVyc2lvbiB9ID0gcGFyYW1zO1xuXG5cdFx0Ly8gU2F2ZSBwYXJhbXMuXG5cdFx0dGhpcy5uYW1lID0gbmFtZTtcblx0XHR0aGlzLmdsID0gZ2w7XG5cdFx0dGhpcy5lcnJvckNhbGxiYWNrID0gZXJyb3JDYWxsYmFjaztcblxuXHRcdC8vIG51bUNvbXBvbmVudHMgbXVzdCBiZSBiZXR3ZWVuIDEgYW5kIDQuXG5cdFx0aWYgKCFpc1Bvc2l0aXZlSW50ZWdlcihudW1Db21wb25lbnRzKSB8fCBudW1Db21wb25lbnRzID4gNCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIG51bUNvbXBvbmVudHMgJHtudW1Db21wb25lbnRzfSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLmApO1xuXHRcdH1cblx0XHR0aGlzLm51bUNvbXBvbmVudHMgPSBudW1Db21wb25lbnRzO1xuXG5cdFx0Ly8gd3JpdGFibGUgZGVmYXVsdHMgdG8gZmFsc2UuXG5cdFx0Y29uc3Qgd3JpdGFibGUgPSAhIXBhcmFtcy53cml0YWJsZTtcblx0XHR0aGlzLndyaXRhYmxlID0gd3JpdGFibGU7XG5cblx0XHQvLyBTZXQgZGltZW5zaW9ucywgbWF5IGJlIDFEIG9yIDJELlxuXHRcdGNvbnN0IHsgbGVuZ3RoLCB3aWR0aCwgaGVpZ2h0IH0gPSBEYXRhTGF5ZXIuY2FsY1NpemUoZGltZW5zaW9ucywgbmFtZSk7XG5cdFx0dGhpcy5sZW5ndGggPSBsZW5ndGg7XG5cdFx0aWYgKCFpc1Bvc2l0aXZlSW50ZWdlcih3aWR0aCkpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB3aWR0aCAke3dpZHRofSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLmApO1xuXHRcdH1cblx0XHR0aGlzLndpZHRoID0gd2lkdGg7XG5cdFx0aWYgKCFpc1Bvc2l0aXZlSW50ZWdlcihoZWlnaHQpKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgbGVuZ3RoICR7aGVpZ2h0fSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLmApO1xuXHRcdH1cblx0XHR0aGlzLmhlaWdodCA9IGhlaWdodDtcblxuXHRcdC8vIFNldCBmaWx0ZXJpbmcgLSBpZiB3ZSBhcmUgcHJvY2Vzc2luZyBhIDFEIGFycmF5LCBkZWZhdWx0IHRvIE5FQVJFU1QgZmlsdGVyaW5nLlxuXHRcdC8vIEVsc2UgZGVmYXVsdCB0byBMSU5FQVIgKGludGVycG9sYXRpb24pIGZpbHRlcmluZy5cblx0XHRjb25zdCBmaWx0ZXIgPSBwYXJhbXMuZmlsdGVyICE9PSB1bmRlZmluZWQgPyBwYXJhbXMuZmlsdGVyIDogKGxlbmd0aCA/IE5FQVJFU1QgOiBMSU5FQVIpO1xuXHRcdGlmICghaXNWYWxpZEZpbHRlclR5cGUoZmlsdGVyKSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGZpbHRlcjogJHtmaWx0ZXJ9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIsIG11c3QgYmUgJHt2YWxpZEZpbHRlclR5cGVzLmpvaW4oJywgJyl9LmApO1xuXHRcdH1cblx0XHR0aGlzLmZpbHRlciA9IGZpbHRlcjtcblxuXHRcdC8vIEdldCB3cmFwIHR5cGVzLCBkZWZhdWx0IHRvIGNsYW1wIHRvIGVkZ2UuXG5cdFx0Y29uc3Qgd3JhcFMgPSBwYXJhbXMud3JhcFMgIT09IHVuZGVmaW5lZCA/IHBhcmFtcy53cmFwUyA6IENMQU1QX1RPX0VER0U7XG5cdFx0aWYgKCFpc1ZhbGlkV3JhcFR5cGUod3JhcFMpKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgd3JhcFM6ICR7d3JhcFN9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIsIG11c3QgYmUgJHt2YWxpZFdyYXBUeXBlcy5qb2luKCcsICcpfS5gKTtcblx0XHR9XG5cdFx0dGhpcy53cmFwUyA9IHdyYXBTO1xuXHRcdGNvbnN0IHdyYXBUID0gcGFyYW1zLndyYXBUICE9PSB1bmRlZmluZWQgPyBwYXJhbXMud3JhcFQgOiBDTEFNUF9UT19FREdFO1xuXHRcdGlmICghaXNWYWxpZFdyYXBUeXBlKHdyYXBUKSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHdyYXBUOiAke3dyYXBUfSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLCBtdXN0IGJlICR7dmFsaWRXcmFwVHlwZXMuam9pbignLCAnKX0uYCk7XG5cdFx0fVxuXHRcdHRoaXMud3JhcFQgPSB3cmFwVDtcblxuXHRcdC8vIFNldCBkYXRhIHR5cGUuXG5cdFx0aWYgKCFpc1ZhbGlkRGF0YVR5cGUodHlwZSkpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB0eXBlICR7dHlwZX0gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIiwgbXVzdCBiZSBvbmUgb2YgJHt2YWxpZERhdGFUeXBlcy5qb2luKCcsICcpfS5gKTtcblx0XHR9XG5cdFx0dGhpcy50eXBlID0gdHlwZTtcblx0XHRjb25zdCBpbnRlcm5hbFR5cGUgPSBEYXRhTGF5ZXIuZ2V0SW50ZXJuYWxUeXBlKHtcblx0XHRcdGdsLFxuXHRcdFx0dHlwZSxcblx0XHRcdGdsc2xWZXJzaW9uLFxuXHRcdFx0d3JpdGFibGUsXG5cdFx0XHRmaWx0ZXIsXG5cdFx0XHRuYW1lLFxuXHRcdFx0ZXJyb3JDYWxsYmFjayxcblx0XHR9KTtcblx0XHR0aGlzLmludGVybmFsVHlwZSA9IGludGVybmFsVHlwZTtcblx0XHQvLyBTZXQgZ2wgdGV4dHVyZSBwYXJhbWV0ZXJzLlxuXHRcdGNvbnN0IHtcblx0XHRcdGdsRm9ybWF0LFxuXHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCxcblx0XHRcdGdsVHlwZSxcblx0XHRcdGdsTnVtQ2hhbm5lbHMsXG5cdFx0fSA9IERhdGFMYXllci5nZXRHTFRleHR1cmVQYXJhbWV0ZXJzKHtcblx0XHRcdGdsLFxuXHRcdFx0bmFtZSxcblx0XHRcdG51bUNvbXBvbmVudHMsXG5cdFx0XHR3cml0YWJsZSxcblx0XHRcdGludGVybmFsVHlwZSxcblx0XHRcdGdsc2xWZXJzaW9uLFxuXHRcdFx0ZXJyb3JDYWxsYmFjayxcblx0XHR9KTtcblx0XHR0aGlzLmdsSW50ZXJuYWxGb3JtYXQgPSBnbEludGVybmFsRm9ybWF0O1xuXHRcdHRoaXMuZ2xGb3JtYXQgPSBnbEZvcm1hdDtcblx0XHR0aGlzLmdsVHlwZSA9IGdsVHlwZTtcblx0XHR0aGlzLmdsTnVtQ2hhbm5lbHMgPSBnbE51bUNoYW5uZWxzO1xuXG5cdFx0Ly8gU2V0IGludGVybmFsIGZpbHRlcmluZy93cmFwIHR5cGVzLlxuXHRcdHRoaXMuaW50ZXJuYWxGaWx0ZXIgPSBEYXRhTGF5ZXIuZ2V0SW50ZXJuYWxGaWx0ZXIoeyBnbCwgZmlsdGVyLCBpbnRlcm5hbFR5cGUsIG5hbWUsIGVycm9yQ2FsbGJhY2sgfSk7XG5cdFx0dGhpcy5nbEZpbHRlciA9IGdsW3RoaXMuaW50ZXJuYWxGaWx0ZXJdO1xuXHRcdHRoaXMuaW50ZXJuYWxXcmFwUyA9IERhdGFMYXllci5nZXRJbnRlcm5hbFdyYXAoeyBnbCwgd3JhcDogd3JhcFMsIG5hbWUgfSk7XG5cdFx0dGhpcy5nbFdyYXBTID0gZ2xbdGhpcy5pbnRlcm5hbFdyYXBTXTtcblx0XHR0aGlzLmludGVybmFsV3JhcFQgPSBEYXRhTGF5ZXIuZ2V0SW50ZXJuYWxXcmFwKHsgZ2wsIHdyYXA6IHdyYXBULCBuYW1lIH0pO1xuXHRcdHRoaXMuZ2xXcmFwVCA9IGdsW3RoaXMuaW50ZXJuYWxXcmFwVF07XG5cblx0XHQvLyBOdW0gYnVmZmVycyBpcyB0aGUgbnVtYmVyIG9mIHN0YXRlcyB0byBzdG9yZSBmb3IgdGhpcyBkYXRhLlxuXHRcdGNvbnN0IG51bUJ1ZmZlcnMgPSBwYXJhbXMubnVtQnVmZmVycyAhPT0gdW5kZWZpbmVkID8gcGFyYW1zLm51bUJ1ZmZlcnMgOiAxO1xuXHRcdGlmICghaXNQb3NpdGl2ZUludGVnZXIobnVtQnVmZmVycykpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBudW1CdWZmZXJzOiAke251bUJ1ZmZlcnN9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIsIG11c3QgYmUgcG9zaXRpdmUgaW50ZWdlci5gKTtcblx0XHR9XG5cdFx0dGhpcy5udW1CdWZmZXJzID0gbnVtQnVmZmVycztcblxuXHRcdHRoaXMuaW5pdEJ1ZmZlcnMoZGF0YSk7XG5cdH1cblxuXHRwcml2YXRlIHN0YXRpYyBjYWxjU2l6ZShkaW1lbnNpb25zOiBudW1iZXIgfCBbbnVtYmVyLCBudW1iZXJdLCBuYW1lOiBzdHJpbmcpIHtcblx0XHRsZXQgbGVuZ3RoLCB3aWR0aCwgaGVpZ2h0O1xuXHRcdGlmICghaXNOYU4oZGltZW5zaW9ucyBhcyBudW1iZXIpKSB7XG5cdFx0XHRpZiAoIWlzUG9zaXRpdmVJbnRlZ2VyKGRpbWVuc2lvbnMpKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBsZW5ndGggJHtkaW1lbnNpb25zfSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLmApO1xuXHRcdFx0fVxuXHRcdFx0bGVuZ3RoID0gZGltZW5zaW9ucyBhcyBudW1iZXI7XG5cdFx0XHQvLyBDYWxjIHBvd2VyIG9mIHR3byB3aWR0aCBhbmQgaGVpZ2h0IGZvciBsZW5ndGguXG5cdFx0XHRsZXQgZXhwID0gMTtcblx0XHRcdGxldCByZW1haW5kZXIgPSBsZW5ndGg7XG5cdFx0XHR3aGlsZSAocmVtYWluZGVyID4gMikge1xuXHRcdFx0XHRleHArKztcblx0XHRcdFx0cmVtYWluZGVyIC89IDI7XG5cdFx0XHR9XG5cdFx0XHR3aWR0aCA9IE1hdGgucG93KDIsIE1hdGguZmxvb3IoZXhwIC8gMikgKyBleHAgJSAyKTtcblx0XHRcdGhlaWdodCA9IE1hdGgucG93KDIsIE1hdGguZmxvb3IoZXhwLzIpKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0d2lkdGggPSAoZGltZW5zaW9ucyBhcyBbbnVtYmVyLCBudW1iZXJdKVswXTtcblx0XHRcdGlmICghaXNQb3NpdGl2ZUludGVnZXIod2lkdGgpKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB3aWR0aCAke3dpZHRofSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLmApO1xuXHRcdFx0fVxuXHRcdFx0aGVpZ2h0ID0gKGRpbWVuc2lvbnMgYXMgW251bWJlciwgbnVtYmVyXSlbMV07XG5cdFx0XHRpZiAoIWlzUG9zaXRpdmVJbnRlZ2VyKGhlaWdodCkpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGhlaWdodCAke2hlaWdodH0gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHsgd2lkdGgsIGhlaWdodCwgbGVuZ3RoIH07XG5cdH1cblxuXHRwcml2YXRlIHN0YXRpYyBnZXRJbnRlcm5hbFdyYXAoXG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0IHwgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCxcblx0XHRcdHdyYXA6IERhdGFMYXllcldyYXBUeXBlLFxuXHRcdFx0bmFtZTogc3RyaW5nLFxuXHRcdH0sXG5cdCkge1xuXHRcdGNvbnN0IHsgZ2wsIHdyYXAsIG5hbWUgfSA9IHBhcmFtcztcblx0XHQvLyBXZWJnbDIuMCBzdXBwb3J0cyBhbGwgY29tYmluYXRpb25zIG9mIHR5cGVzIGFuZCBmaWx0ZXJpbmcuXG5cdFx0aWYgKGlzV2ViR0wyKGdsKSkge1xuXHRcdFx0cmV0dXJuIHdyYXA7XG5cdFx0fVxuXHRcdC8vIENMQU1QX1RPX0VER0UgaXMgYWx3YXlzIHN1cHBvcnRlZC5cblx0XHRpZiAod3JhcCA9PT0gQ0xBTVBfVE9fRURHRSkge1xuXHRcdFx0cmV0dXJuIHdyYXA7XG5cdFx0fVxuXHRcdGlmICghaXNXZWJHTDIoZ2wpKSB7XG5cdFx0XHQvLyBUT0RPOiB3ZSBtYXkgd2FudCB0byBoYW5kbGUgdGhpcyBpbiB0aGUgZnJhZyBzaGFkZXIuXG5cdFx0XHQvLyBSRVBFQVQgYW5kIE1JUlJPUl9SRVBFQVQgd3JhcCBub3Qgc3VwcG9ydGVkIGZvciBub24tcG93ZXIgb2YgMiB0ZXh0dXJlcyBpbiBzYWZhcmkuXG5cdFx0XHQvLyBJJ3ZlIHRlc3RlZCB0aGlzIGFuZCBpdCBzZWVtcyB0aGF0IHNvbWUgcG93ZXIgb2YgMiB0ZXh0dXJlcyB3aWxsIHdvcmsgKDUxMiB4IDUxMiksXG5cdFx0XHQvLyBidXQgbm90IG90aGVycyAoMTAyNHgxMDI0KSwgc28gbGV0J3MganVzdCBjaGFuZ2UgYWxsIFdlYkdMIDEuMCB0byBDTEFNUC5cblx0XHRcdC8vIFdpdGhvdXQgdGhpcywgd2UgY3VycmVudGx5IGdldCBhbiBlcnJvciBhdCBkcmF3QXJyYXlzKCk6XG5cdFx0XHQvLyBcIldlYkdMOiBkcmF3QXJyYXlzOiB0ZXh0dXJlIGJvdW5kIHRvIHRleHR1cmUgdW5pdCAwIGlzIG5vdCByZW5kZXJhYmxlLlxuXHRcdFx0Ly8gSXQgbWF5YmUgbm9uLXBvd2VyLW9mLTIgYW5kIGhhdmUgaW5jb21wYXRpYmxlIHRleHR1cmUgZmlsdGVyaW5nIG9yIGlzIG5vdFxuXHRcdFx0Ly8gJ3RleHR1cmUgY29tcGxldGUnLCBvciBpdCBpcyBhIGZsb2F0L2hhbGYtZmxvYXQgdHlwZSB3aXRoIGxpbmVhciBmaWx0ZXJpbmcgYW5kXG5cdFx0XHQvLyB3aXRob3V0IHRoZSByZWxldmFudCBmbG9hdC9oYWxmLWZsb2F0IGxpbmVhciBleHRlbnNpb24gZW5hYmxlZC5cIlxuXHRcdFx0Y29uc29sZS53YXJuKGBGYWxsaW5nIGJhY2sgdG8gQ0xBTVBfVE9fRURHRSB3cmFwcGluZyBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiIGZvciBXZWJHTCAxLmApO1xuXHRcdFx0cmV0dXJuIENMQU1QX1RPX0VER0U7XG5cdFx0fVxuXHRcdHJldHVybiB3cmFwO1xuXHR9XG5cblx0cHJpdmF0ZSBzdGF0aWMgZ2V0SW50ZXJuYWxGaWx0ZXIoXG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0IHwgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCxcblx0XHRcdGZpbHRlcjogRGF0YUxheWVyRmlsdGVyVHlwZSxcblx0XHRcdGludGVybmFsVHlwZTogRGF0YUxheWVyVHlwZSxcblx0XHRcdG5hbWU6IHN0cmluZyxcblx0XHRcdGVycm9yQ2FsbGJhY2s6IEVycm9yQ2FsbGJhY2ssXG5cdFx0fSxcblx0KSB7XG5cdFx0Y29uc3QgeyBnbCwgZXJyb3JDYWxsYmFjaywgaW50ZXJuYWxUeXBlLCBuYW1lIH0gPSBwYXJhbXM7XG5cdFx0bGV0IHsgZmlsdGVyIH0gPSBwYXJhbXM7XG5cdFx0aWYgKGZpbHRlciA9PT0gTkVBUkVTVCkge1xuXHRcdFx0Ly8gTkVBUkVTVCBmaWx0ZXJpbmcgaXMgYWx3YXlzIHN1cHBvcnRlZC5cblx0XHRcdHJldHVybiBmaWx0ZXI7XG5cdFx0fVxuXG5cdFx0aWYgKGludGVybmFsVHlwZSA9PT0gSEFMRl9GTE9BVCkge1xuXHRcdFx0Ly8gVE9ETzogdGVzdCBpZiBmbG9hdCBsaW5lYXIgZXh0ZW5zaW9uIGlzIGFjdHVhbGx5IHdvcmtpbmcuXG5cdFx0XHRjb25zdCBleHRlbnNpb24gPSBnZXRFeHRlbnNpb24oZ2wsIE9FU19URVhUVVJFX0hBbEZfRkxPQVRfTElORUFSLCBlcnJvckNhbGxiYWNrLCB0cnVlKVxuXHRcdFx0XHR8fCBnZXRFeHRlbnNpb24oZ2wsIE9FU19URVhUVVJFX0ZMT0FUX0xJTkVBUiwgZXJyb3JDYWxsYmFjaywgdHJ1ZSk7XG5cdFx0XHRpZiAoIWV4dGVuc2lvbikge1xuXHRcdFx0XHRjb25zb2xlLndhcm4oYEZhbGxpbmcgYmFjayB0byBORUFSRVNUIGZpbHRlciBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLmApO1xuXHRcdFx0XHQvL1RPRE86IGFkZCBhIGZhbGxiYWNrIHRoYXQgZG9lcyB0aGlzIGZpbHRlcmluZyBpbiB0aGUgZnJhZyBzaGFkZXI/LlxuXHRcdFx0XHRmaWx0ZXIgPSBORUFSRVNUO1xuXHRcdFx0fVxuXHRcdH0gaWYgKGludGVybmFsVHlwZSA9PT0gRkxPQVQpIHtcblx0XHRcdGNvbnN0IGV4dGVuc2lvbiA9IGdldEV4dGVuc2lvbihnbCwgT0VTX1RFWFRVUkVfRkxPQVRfTElORUFSLCBlcnJvckNhbGxiYWNrLCB0cnVlKTtcblx0XHRcdGlmICghZXh0ZW5zaW9uKSB7XG5cdFx0XHRcdGNvbnNvbGUud2FybihgRmFsbGluZyBiYWNrIHRvIE5FQVJFU1QgZmlsdGVyIGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIuYCk7XG5cdFx0XHRcdC8vVE9ETzogYWRkIGEgZmFsbGJhY2sgdGhhdCBkb2VzIHRoaXMgZmlsdGVyaW5nIGluIHRoZSBmcmFnIHNoYWRlcj8uXG5cdFx0XHRcdGZpbHRlciA9IE5FQVJFU1Q7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBmaWx0ZXI7XG5cdH1cblxuXHRwcml2YXRlIHN0YXRpYyBnZXRJbnRlcm5hbFR5cGUoXG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0IHwgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCxcblx0XHRcdHR5cGU6IERhdGFMYXllclR5cGUsXG5cdFx0XHRnbHNsVmVyc2lvbjogR0xTTFZlcnNpb24sXG5cdFx0XHR3cml0YWJsZTogYm9vbGVhbixcblx0XHRcdGZpbHRlcjogRGF0YUxheWVyRmlsdGVyVHlwZSxcblx0XHRcdG5hbWU6IHN0cmluZyxcblx0XHRcdGVycm9yQ2FsbGJhY2s6IEVycm9yQ2FsbGJhY2ssXG5cdFx0fSxcblx0KSB7XG5cdFx0Y29uc3QgeyBnbCwgZXJyb3JDYWxsYmFjaywgd3JpdGFibGUsIG5hbWUsIGdsc2xWZXJzaW9uIH0gPSBwYXJhbXM7XG5cdFx0Y29uc3QgeyB0eXBlIH0gPSBwYXJhbXM7XG5cdFx0bGV0IGludGVybmFsVHlwZSA9IHR5cGU7XG5cdFx0Ly8gQ2hlY2sgaWYgaW50IHR5cGVzIGFyZSBzdXBwb3J0ZWQuXG5cdFx0Y29uc3QgaW50Q2FzdCA9IERhdGFMYXllci5zaG91bGRDYXN0SW50VHlwZUFzRmxvYXQocGFyYW1zKTtcblx0XHRpZiAoaW50Q2FzdCkge1xuXHRcdFx0aWYgKGludGVybmFsVHlwZSA9PT0gVU5TSUdORURfQllURSB8fCBpbnRlcm5hbFR5cGUgPT09IEJZVEUpIHtcblx0XHRcdFx0Ly8gSW50ZWdlcnMgYmV0d2VlbiAwIGFuZCAyMDQ4IGNhbiBiZSBleGFjdGx5IHJlcHJlc2VudGVkIGJ5IGhhbGYgZmxvYXQgKGFuZCBhbHNvIGJldHdlZW4g4oiSMjA0OCBhbmQgMClcblx0XHRcdFx0aW50ZXJuYWxUeXBlID0gSEFMRl9GTE9BVDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIEludGVnZXJzIGJldHdlZW4gMCBhbmQgMTY3NzcyMTYgY2FuIGJlIGV4YWN0bHkgcmVwcmVzZW50ZWQgYnkgZmxvYXQzMiAoYWxzbyBhcHBsaWVzIGZvciBuZWdhdGl2ZSBpbnRlZ2VycyBiZXR3ZWVuIOKIkjE2Nzc3MjE2IGFuZCAwKVxuXHRcdFx0XHQvLyBUaGlzIGlzIHN1ZmZpY2llbnQgZm9yIFVOU0lHTkVEX1NIT1JUIGFuZCBTSE9SVCB0eXBlcy5cblx0XHRcdFx0Ly8gTGFyZ2UgVU5TSUdORURfSU5UIGFuZCBJTlQgY2Fubm90IGJlIHJlcHJlc2VudGVkIGJ5IEZMT0FUIHR5cGUuXG5cdFx0XHRcdGlmIChpbnRlcm5hbFR5cGUgPT09IElOVCB8fCBpbnRlcm5hbFR5cGUgPT09IFVOU0lHTkVEX0lOVCkge1xuXHRcdFx0XHRcdFxuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnNvbGUud2FybihgRmFsbGluZyBiYWNrICR7aW50ZXJuYWxUeXBlfSB0eXBlIHRvIEZMT0FUIHR5cGUgZm9yIGdsc2wxLnggc3VwcG9ydCBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLlxuTGFyZ2UgVU5TSUdORURfSU5UIG9yIElOVCB3aXRoIGFic29sdXRlIHZhbHVlID4gMTYsNzc3LDIxNiBhcmUgbm90IHN1cHBvcnRlZCwgb24gbW9iaWxlIFVOU0lHTkVEX0lOVCwgSU5ULCBVTlNJR05FRF9TSE9SVCwgYW5kIFNIT1JUIHdpdGggYWJzb2x1dGUgdmFsdWUgPiAyLDA0OCBtYXkgbm90IGJlIHN1cHBvcnRlZC5gKTtcblx0XHRcdFx0aW50ZXJuYWxUeXBlID0gRkxPQVQ7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdC8vIENoZWNrIGlmIGZsb2F0MzIgc3VwcG9ydGVkLlxuXHRcdGlmICghaXNXZWJHTDIoZ2wpKSB7XG5cdFx0XHRpZiAoaW50ZXJuYWxUeXBlID09PSBGTE9BVCkge1xuXHRcdFx0XHRjb25zdCBleHRlbnNpb24gPSBnZXRFeHRlbnNpb24oZ2wsIE9FU19URVhUVVJFX0ZMT0FULCBlcnJvckNhbGxiYWNrLCB0cnVlKTtcblx0XHRcdFx0aWYgKCFleHRlbnNpb24pIHtcblx0XHRcdFx0XHRjb25zb2xlLndhcm4oYEZMT0FUIG5vdCBzdXBwb3J0ZWQsIGZhbGxpbmcgYmFjayB0byBIQUxGX0ZMT0FUIHR5cGUgZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdFx0XHRpbnRlcm5hbFR5cGUgPSBIQUxGX0ZMT0FUO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE3NDc2NjMyL3dlYmdsLWV4dGVuc2lvbi1zdXBwb3J0LWFjcm9zcy1icm93c2Vyc1xuXHRcdFx0XHQvLyBSZW5kZXJpbmcgdG8gYSBmbG9hdGluZy1wb2ludCB0ZXh0dXJlIG1heSBub3QgYmUgc3VwcG9ydGVkLFxuXHRcdFx0XHQvLyBldmVuIGlmIHRoZSBPRVNfdGV4dHVyZV9mbG9hdCBleHRlbnNpb24gaXMgc3VwcG9ydGVkLlxuXHRcdFx0XHQvLyBUeXBpY2FsbHksIHRoaXMgZmFpbHMgb24gY3VycmVudCBtb2JpbGUgaGFyZHdhcmUuXG5cdFx0XHRcdC8vIFRvIGNoZWNrIGlmIHRoaXMgaXMgc3VwcG9ydGVkLCB5b3UgaGF2ZSB0byBjYWxsIHRoZSBXZWJHTFxuXHRcdFx0XHQvLyBjaGVja0ZyYW1lYnVmZmVyU3RhdHVzKCkgZnVuY3Rpb24uXG5cdFx0XHRcdGlmICh3cml0YWJsZSkge1xuXHRcdFx0XHRcdGNvbnN0IHZhbGlkID0gRGF0YUxheWVyLnRlc3RGcmFtZWJ1ZmZlcldyaXRlKHsgZ2wsIHR5cGU6IGludGVybmFsVHlwZSwgZ2xzbFZlcnNpb24gfSk7XG5cdFx0XHRcdFx0aWYgKCF2YWxpZCAmJiBpbnRlcm5hbFR5cGUgIT09IEhBTEZfRkxPQVQpIHtcblx0XHRcdFx0XHRcdGNvbnNvbGUud2FybihgRkxPQVQgbm90IHN1cHBvcnRlZCBmb3Igd3JpdGluZyBvcGVyYXRpb25zLCBmYWxsaW5nIGJhY2sgdG8gSEFMRl9GTE9BVCB0eXBlIGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIuYCk7XG5cdFx0XHRcdFx0XHRpbnRlcm5hbFR5cGUgPSBIQUxGX0ZMT0FUO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0Ly8gTXVzdCBzdXBwb3J0IGF0IGxlYXN0IGhhbGYgZmxvYXQgaWYgdXNpbmcgYSBmbG9hdCB0eXBlLlxuXHRcdFx0aWYgKGludGVybmFsVHlwZSA9PT0gSEFMRl9GTE9BVCkge1xuXHRcdFx0XHRnZXRFeHRlbnNpb24oZ2wsIE9FU19URVhUVVJFX0hBTEZfRkxPQVQsIGVycm9yQ2FsbGJhY2spO1xuXHRcdFx0XHQvLyBUT0RPOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81NDI0ODYzMy9jYW5ub3QtY3JlYXRlLWhhbGYtZmxvYXQtb2VzLXRleHR1cmUtZnJvbS11aW50MTZhcnJheS1vbi1pcGFkXG5cdFx0XHRcdGlmICh3cml0YWJsZSkge1xuXHRcdFx0XHRcdGNvbnN0IHZhbGlkID0gRGF0YUxheWVyLnRlc3RGcmFtZWJ1ZmZlcldyaXRlKHsgZ2wsIHR5cGU6IGludGVybmFsVHlwZSwgZ2xzbFZlcnNpb24gfSk7XG5cdFx0XHRcdFx0aWYgKCF2YWxpZCkge1xuXHRcdFx0XHRcdFx0ZXJyb3JDYWxsYmFjayhgVGhpcyBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgcmVuZGVyaW5nIHRvIEhBTEZfRkxPQVQgdGV4dHVyZXMuYCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdFxuXHRcdC8vIExvYWQgYWRkaXRpb25hbCBleHRlbnNpb25zIGlmIG5lZWRlZC5cblx0XHRpZiAod3JpdGFibGUgJiYgaXNXZWJHTDIoZ2wpICYmIChpbnRlcm5hbFR5cGUgPT09IEhBTEZfRkxPQVQgfHwgaW50ZXJuYWxUeXBlID09PSBGTE9BVCkpIHtcblx0XHRcdGdldEV4dGVuc2lvbihnbCwgRVhUX0NPTE9SX0JVRkZFUl9GTE9BVCwgZXJyb3JDYWxsYmFjayk7XG5cdFx0fVxuXHRcdHJldHVybiBpbnRlcm5hbFR5cGU7XG5cdH1cblxuXHRwcml2YXRlIHN0YXRpYyBzaG91bGRDYXN0SW50VHlwZUFzRmxvYXQoXG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0IHwgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCxcblx0XHRcdHR5cGU6IERhdGFMYXllclR5cGUsXG5cdFx0XHRmaWx0ZXI6IERhdGFMYXllckZpbHRlclR5cGUsXG5cdFx0XHRnbHNsVmVyc2lvbjogR0xTTFZlcnNpb24sXG5cdFx0fVxuXHQpIHtcblx0XHRjb25zdCB7IGdsLCB0eXBlLCBmaWx0ZXIsIGdsc2xWZXJzaW9uIH0gPSBwYXJhbXM7XG5cdFx0aWYgKGdsc2xWZXJzaW9uID09PSBHTFNMMyAmJiBpc1dlYkdMMihnbCkpIHJldHVybiBmYWxzZTtcblx0XHQvLyBVTlNJR05FRF9CWVRFIGFuZCBMSU5FQVIgZmlsdGVyaW5nIGlzIG5vdCBzdXBwb3J0ZWQsIGNhc3QgYXMgZmxvYXQuXG5cdFx0aWYgKHR5cGUgPT09IFVOU0lHTkVEX0JZVEUgJiYgZmlsdGVyID09PSBMSU5FQVIpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHQvLyBJbnQgdGV4dHVyZXMgKG90aGVyIHRoYW4gVU5TSUdORURfQllURSkgYXJlIG5vdCBzdXBwb3J0ZWQgYnkgV2ViR0wxLjAgb3IgZ2xzbDEueC5cblx0XHQvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81NTgwMzAxNy9ob3ctdG8tc2VsZWN0LXdlYmdsLWdsc2wtc2FtcGxlci10eXBlLWZyb20tdGV4dHVyZS1mb3JtYXQtcHJvcGVydGllc1xuXHRcdC8vIFVzZSBIQUxGX0ZMT0FUL0ZMT0FUIGluc3RlYWQuXG5cdFx0cmV0dXJuIHR5cGUgPT09IEJZVEUgfHwgdHlwZSA9PT0gU0hPUlQgfHwgdHlwZSA9PT0gSU5UIHx8IHR5cGUgPT09IFVOU0lHTkVEX1NIT1JUIHx8IHR5cGUgPT09IFVOU0lHTkVEX0lOVDtcblx0fVxuXG5cdHByaXZhdGUgc3RhdGljIGdldEdMVGV4dHVyZVBhcmFtZXRlcnMoXG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0IHwgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCxcblx0XHRcdG5hbWU6IHN0cmluZyxcblx0XHRcdG51bUNvbXBvbmVudHM6IERhdGFMYXllck51bUNvbXBvbmVudHMsXG5cdFx0XHRpbnRlcm5hbFR5cGU6IERhdGFMYXllclR5cGUsXG5cdFx0XHR3cml0YWJsZTogYm9vbGVhbixcblx0XHRcdGdsc2xWZXJzaW9uOiBHTFNMVmVyc2lvbixcblx0XHRcdGVycm9yQ2FsbGJhY2s6IEVycm9yQ2FsbGJhY2ssXG5cdFx0fVxuXHQpIHtcblx0XHRjb25zdCB7IGdsLCBlcnJvckNhbGxiYWNrLCBuYW1lLCBudW1Db21wb25lbnRzLCBpbnRlcm5hbFR5cGUsIHdyaXRhYmxlLCBnbHNsVmVyc2lvbiB9ID0gcGFyYW1zO1xuXHRcdC8vIGh0dHBzOi8vd3d3Lmtocm9ub3Mub3JnL3JlZ2lzdHJ5L3dlYmdsL3NwZWNzL2xhdGVzdC8yLjAvI1RFWFRVUkVfVFlQRVNfRk9STUFUU19GUk9NX0RPTV9FTEVNRU5UU19UQUJMRVxuXHRcdGxldCBnbFR5cGU6IG51bWJlciB8IHVuZGVmaW5lZCxcblx0XHRcdGdsRm9ybWF0OiBudW1iZXIgfCB1bmRlZmluZWQsXG5cdFx0XHRnbEludGVybmFsRm9ybWF0OiBudW1iZXIgfCB1bmRlZmluZWQsXG5cdFx0XHRnbE51bUNoYW5uZWxzOiBudW1iZXIgfCB1bmRlZmluZWQ7XG5cblx0XHRpZiAoaXNXZWJHTDIoZ2wpKSB7XG5cdFx0XHRnbE51bUNoYW5uZWxzID0gbnVtQ29tcG9uZW50cztcblx0XHRcdC8vIGh0dHBzOi8vd3d3Lmtocm9ub3Mub3JnL3JlZ2lzdHJ5L3dlYmdsL2V4dGVuc2lvbnMvRVhUX2NvbG9yX2J1ZmZlcl9mbG9hdC9cblx0XHRcdC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9XZWJHTFJlbmRlcmluZ0NvbnRleHQvdGV4SW1hZ2UyRFxuXHRcdFx0Ly8gVGhlIHNpemVkIGludGVybmFsIGZvcm1hdCBSR0J4eHggYXJlIG5vdCBjb2xvci1yZW5kZXJhYmxlIGZvciBzb21lIHJlYXNvbi5cblx0XHRcdC8vIElmIG51bUNvbXBvbmVudHMgPT0gMyBmb3IgYSB3cml0YWJsZSB0ZXh0dXJlLCB1c2UgUkdCQSBpbnN0ZWFkLlxuXHRcdFx0Ly8gUGFnZSA1IG9mIGh0dHBzOi8vd3d3Lmtocm9ub3Mub3JnL2ZpbGVzL3dlYmdsMjAtcmVmZXJlbmNlLWd1aWRlLnBkZlxuXHRcdFx0aWYgKG51bUNvbXBvbmVudHMgPT09IDMgJiYgd3JpdGFibGUpIHtcblx0XHRcdFx0Z2xOdW1DaGFubmVscyA9IDQ7XG5cdFx0XHR9XG5cdFx0XHRpZiAoaW50ZXJuYWxUeXBlID09PSBGTE9BVCB8fCBpbnRlcm5hbFR5cGUgPT09IEhBTEZfRkxPQVQpIHtcblx0XHRcdFx0c3dpdGNoIChnbE51bUNoYW5uZWxzKSB7XG5cdFx0XHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRcdFx0Z2xGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkVEO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdFx0Z2xGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkc7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDM6XG5cdFx0XHRcdFx0XHRnbEZvcm1hdCA9IGdsLlJHQjtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgNDpcblx0XHRcdFx0XHRcdGdsRm9ybWF0ID0gZ2wuUkdCQTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGdsTnVtQ2hhbm5lbHMgJHtnbE51bUNoYW5uZWxzfSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLmApO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKGdsc2xWZXJzaW9uID09PSBHTFNMMSAmJiBpbnRlcm5hbFR5cGUgPT09IFVOU0lHTkVEX0JZVEUpIHtcblx0XHRcdFx0c3dpdGNoIChnbE51bUNoYW5uZWxzKSB7XG5cdFx0XHRcdFx0Ly8gRm9yIHJlYWQgb25seSB0ZXh0dXJlcyBpbiBXZWJHTCAxLjAsIHVzZSBnbC5BTFBIQSBhbmQgZ2wuTFVNSU5BTkNFX0FMUEhBLlxuXHRcdFx0XHRcdC8vIE90aGVyd2lzZSB1c2UgUkdCL1JHQkEuXG5cdFx0XHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRcdFx0aWYgKCF3cml0YWJsZSkge1xuXHRcdFx0XHRcdFx0XHRnbEZvcm1hdCA9IGdsLkFMUEhBO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjYXNlIDI6XG5cdFx0XHRcdFx0XHRpZiAoIXdyaXRhYmxlKSB7XG5cdFx0XHRcdFx0XHRcdGdsRm9ybWF0ID0gZ2wuTFVNSU5BTkNFX0FMUEhBO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjYXNlIDM6XG5cdFx0XHRcdFx0XHRnbEZvcm1hdCA9IGdsLlJHQjtcblx0XHRcdFx0XHRcdGdsTnVtQ2hhbm5lbHMgPSAzO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSA0OlxuXHRcdFx0XHRcdFx0Z2xGb3JtYXQgPSBnbC5SR0JBO1xuXHRcdFx0XHRcdFx0Z2xOdW1DaGFubmVscyA9IDQ7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBnbE51bUNoYW5uZWxzICR7Z2xOdW1DaGFubmVsc30gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c3dpdGNoIChnbE51bUNoYW5uZWxzKSB7XG5cdFx0XHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRcdFx0Z2xGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkVEX0lOVEVHRVI7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDI6XG5cdFx0XHRcdFx0XHRnbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR19JTlRFR0VSO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHRcdFx0Z2xGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkdCX0lOVEVHRVI7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDQ6XG5cdFx0XHRcdFx0XHRnbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR0JBX0lOVEVHRVI7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBnbE51bUNoYW5uZWxzICR7Z2xOdW1DaGFubmVsc30gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0c3dpdGNoIChpbnRlcm5hbFR5cGUpIHtcblx0XHRcdFx0Y2FzZSBIQUxGX0ZMT0FUOlxuXHRcdFx0XHRcdGdsVHlwZSA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5IQUxGX0ZMT0FUO1xuXHRcdFx0XHRcdHN3aXRjaCAoZ2xOdW1DaGFubmVscykge1xuXHRcdFx0XHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlIxNkY7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHMTZGO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgMzpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR0IxNkY7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSA0OlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHQkExNkY7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBnbE51bUNoYW5uZWxzICR7Z2xOdW1DaGFubmVsc30gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgRkxPQVQ6XG5cdFx0XHRcdFx0Z2xUeXBlID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLkZMT0FUO1xuXHRcdFx0XHRcdHN3aXRjaCAoZ2xOdW1DaGFubmVscykge1xuXHRcdFx0XHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlIzMkY7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHMzJGO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgMzpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR0IzMkY7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSA0OlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHQkEzMkY7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBnbE51bUNoYW5uZWxzICR7Z2xOdW1DaGFubmVsc30gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgVU5TSUdORURfQllURTpcblx0XHRcdFx0XHRnbFR5cGUgPSBnbC5VTlNJR05FRF9CWVRFO1xuXHRcdFx0XHRcdGlmIChnbHNsVmVyc2lvbiA9PT0gR0xTTDEgJiYgaW50ZXJuYWxUeXBlID09PSBVTlNJR05FRF9CWVRFKSB7XG5cdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gZ2xGb3JtYXQ7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHN3aXRjaCAoZ2xOdW1DaGFubmVscykge1xuXHRcdFx0XHRcdFx0XHRjYXNlIDE6XG5cdFx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SOFVJO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRjYXNlIDI6XG5cdFx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SRzhVSTtcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkdCOFVJO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRjYXNlIDQ6XG5cdFx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR0JBOFVJO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgZ2xOdW1DaGFubmVscyAke2dsTnVtQ2hhbm5lbHN9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIuYCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIEJZVEU6XG5cdFx0XHRcdFx0Z2xUeXBlID0gZ2wuQllURTtcblx0XHRcdFx0XHRzd2l0Y2ggKGdsTnVtQ2hhbm5lbHMpIHtcblx0XHRcdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SOEk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHOEk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHQjhJO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgNDpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR0JBOEk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBnbE51bUNoYW5uZWxzICR7Z2xOdW1DaGFubmVsc30gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgU0hPUlQ6XG5cdFx0XHRcdFx0Z2xUeXBlID0gZ2wuU0hPUlQ7XG5cdFx0XHRcdFx0c3dpdGNoIChnbE51bUNoYW5uZWxzKSB7XG5cdFx0XHRcdFx0XHRjYXNlIDE6XG5cdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUjE2STtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDI6XG5cdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkcxNkk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHQjE2STtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDQ6XG5cdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkdCQTE2STtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGdsTnVtQ2hhbm5lbHMgJHtnbE51bUNoYW5uZWxzfSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLmApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBVTlNJR05FRF9TSE9SVDpcblx0XHRcdFx0XHRnbFR5cGUgPSBnbC5VTlNJR05FRF9TSE9SVDtcblx0XHRcdFx0XHRzd2l0Y2ggKGdsTnVtQ2hhbm5lbHMpIHtcblx0XHRcdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SMTZVSTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDI6XG5cdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkcxNlVJO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgMzpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR0IxNlVJO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgNDpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR0JBMTZVSTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGdsTnVtQ2hhbm5lbHMgJHtnbE51bUNoYW5uZWxzfSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLmApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBJTlQ6XG5cdFx0XHRcdFx0Z2xUeXBlID0gZ2wuSU5UO1xuXHRcdFx0XHRcdHN3aXRjaCAoZ2xOdW1DaGFubmVscykge1xuXHRcdFx0XHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlIzMkk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHMzJJO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgMzpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR0IzMkk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSA0OlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHQkEzMkk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBnbE51bUNoYW5uZWxzICR7Z2xOdW1DaGFubmVsc30gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgVU5TSUdORURfSU5UOlxuXHRcdFx0XHRcdGdsVHlwZSA9IGdsLlVOU0lHTkVEX0lOVDtcblx0XHRcdFx0XHRzd2l0Y2ggKGdsTnVtQ2hhbm5lbHMpIHtcblx0XHRcdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SMzJVSTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDI6XG5cdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkczMlVJO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgMzpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR0IzMlVJO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgNDpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR0JBMzJVSTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGdsTnVtQ2hhbm5lbHMgJHtnbE51bUNoYW5uZWxzfSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLmApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIHR5cGUgJHtpbnRlcm5hbFR5cGV9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIuYCk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHN3aXRjaCAobnVtQ29tcG9uZW50cykge1xuXHRcdFx0XHQvLyBUT0RPOiBmb3IgcmVhZCBvbmx5IHRleHR1cmVzIGluIFdlYkdMIDEuMCwgd2UgY291bGQgdXNlIGdsLkFMUEhBIGFuZCBnbC5MVU1JTkFOQ0VfQUxQSEEgaGVyZS5cblx0XHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRcdGlmICghd3JpdGFibGUpIHtcblx0XHRcdFx0XHRcdGdsRm9ybWF0ID0gZ2wuQUxQSEE7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdGNhc2UgMjpcblx0XHRcdFx0XHRpZiAoIXdyaXRhYmxlKSB7XG5cdFx0XHRcdFx0XHRnbEZvcm1hdCA9IGdsLkxVTUlOQU5DRV9BTFBIQTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHRcdGdsRm9ybWF0ID0gZ2wuUkdCO1xuXHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSBnbC5SR0I7XG5cdFx0XHRcdFx0Z2xOdW1DaGFubmVscyA9IDM7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgNDpcblx0XHRcdFx0XHRnbEZvcm1hdCA9IGdsLlJHQkE7XG5cdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IGdsLlJHQkE7XG5cdFx0XHRcdFx0Z2xOdW1DaGFubmVscyA9IDQ7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBudW1Db21wb25lbnRzICR7bnVtQ29tcG9uZW50c30gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdH1cblx0XHRcdHN3aXRjaCAoaW50ZXJuYWxUeXBlKSB7XG5cdFx0XHRcdGNhc2UgRkxPQVQ6XG5cdFx0XHRcdFx0Z2xUeXBlID0gZ2wuRkxPQVQ7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgSEFMRl9GTE9BVDpcblx0XHRcdFx0XHRnbFR5cGUgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuSEFMRl9GTE9BVCB8fCBnZXRFeHRlbnNpb24oZ2wsIE9FU19URVhUVVJFX0hBTEZfRkxPQVQsIGVycm9yQ2FsbGJhY2spLkhBTEZfRkxPQVRfT0VTIGFzIG51bWJlcjtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBVTlNJR05FRF9CWVRFOlxuXHRcdFx0XHRcdGdsVHlwZSA9IGdsLlVOU0lHTkVEX0JZVEU7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdC8vIE5vIG90aGVyIHR5cGVzIGFyZSBzdXBwb3J0ZWQgaW4gZ2xzbDEueFxuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgdHlwZSAke2ludGVybmFsVHlwZX0gaW4gV2ViR0wgMS4wIGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIuYCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gQ2hlY2sgZm9yIG1pc3NpbmcgcGFyYW1zLlxuXHRcdGlmIChnbFR5cGUgPT09IHVuZGVmaW5lZCB8fCBnbEZvcm1hdCA9PT0gdW5kZWZpbmVkIHx8IGdsSW50ZXJuYWxGb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Y29uc3QgbWlzc2luZ1BhcmFtcyA9IFtdO1xuXHRcdFx0aWYgKGdsVHlwZSA9PT0gdW5kZWZpbmVkKSBtaXNzaW5nUGFyYW1zLnB1c2goJ2dsVHlwZScpO1xuXHRcdFx0aWYgKGdsRm9ybWF0ID09PSB1bmRlZmluZWQpIG1pc3NpbmdQYXJhbXMucHVzaCgnZ2xGb3JtYXQnKTtcblx0XHRcdGlmIChnbEludGVybmFsRm9ybWF0ID09PSB1bmRlZmluZWQpIG1pc3NpbmdQYXJhbXMucHVzaCgnZ2xJbnRlcm5hbEZvcm1hdCcpO1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHR5cGU6ICR7aW50ZXJuYWxUeXBlfSBmb3IgbnVtQ29tcG9uZW50cyAke251bUNvbXBvbmVudHN9LCB1bmFibGUgdG8gaW5pdCBwYXJhbWV0ZXIke21pc3NpbmdQYXJhbXMubGVuZ3RoID4gMSA/ICdzJyA6ICcnfSAke21pc3NpbmdQYXJhbXMuam9pbignLCAnKX0gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHR9XG5cdFx0aWYgKGdsTnVtQ2hhbm5lbHMgPT09IHVuZGVmaW5lZCB8fCBudW1Db21wb25lbnRzIDwgMSB8fCBudW1Db21wb25lbnRzID4gNCB8fCBnbE51bUNoYW5uZWxzIDwgbnVtQ29tcG9uZW50cykge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIG51bUNoYW5uZWxzICR7Z2xOdW1DaGFubmVsc30gZm9yIG51bUNvbXBvbmVudHMgJHtudW1Db21wb25lbnRzfSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLmApO1xuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHRnbEZvcm1hdCxcblx0XHRcdGdsSW50ZXJuYWxGb3JtYXQsXG5cdFx0XHRnbFR5cGUsXG5cdFx0XHRnbE51bUNoYW5uZWxzLFxuXHRcdH07XG5cdH1cblxuXHRwcml2YXRlIHN0YXRpYyB0ZXN0RnJhbWVidWZmZXJXcml0ZShcblx0XHRwYXJhbXM6IHtcblx0XHRcdGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQgfCBXZWJHTDJSZW5kZXJpbmdDb250ZXh0LFxuXHRcdFx0dHlwZTogRGF0YUxheWVyVHlwZSxcblx0XHRcdGdsc2xWZXJzaW9uOiBHTFNMVmVyc2lvbixcblx0XHR9LFxuXHQpIHtcblx0XHRjb25zdCB7IGdsLCB0eXBlLCBnbHNsVmVyc2lvbiB9ID0gcGFyYW1zO1xuXHRcdGNvbnN0IHRleHR1cmUgPSBnbC5jcmVhdGVUZXh0dXJlKCk7XG5cdFx0aWYgKCF0ZXh0dXJlKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIHRleHR1cmUpO1xuXG5cdFx0Ly8gRGVmYXVsdCB0byBtb3N0IHdpZGVseSBzdXBwb3J0ZWQgc2V0dGluZ3MuXG5cdFx0Y29uc3Qgd3JhcFMgPSBnbFtDTEFNUF9UT19FREdFXTtcblx0XHRjb25zdCB3cmFwVCA9IGdsW0NMQU1QX1RPX0VER0VdO1xuXHRcdGNvbnN0IGZpbHRlciA9IGdsW05FQVJFU1RdO1xuXHRcdC8vIFVzZSBub24tcG93ZXIgb2YgdHdvIGRpbWVuc2lvbnMgdG8gY2hlY2sgZm9yIG1vcmUgdW5pdmVyc2FsIHN1cHBvcnQuXG5cdFx0Ly8gKEluIGNhc2Ugc2l6ZSBvZiBEYXRhTGF5ZXIgaXMgY2hhbmdlZCBhdCBhIGxhdGVyIHBvaW50KS5cblx0XHRjb25zdCB3aWR0aCA9IDEwMDtcblx0XHRjb25zdCBoZWlnaHQgPSAxMDA7XG5cdFx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfUywgd3JhcFMpO1xuXHRcdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1QsIHdyYXBUKTtcblx0XHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgZmlsdGVyKTtcblx0XHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgZmlsdGVyKTtcblxuXHRcdGNvbnN0IHsgZ2xJbnRlcm5hbEZvcm1hdCwgZ2xGb3JtYXQsIGdsVHlwZSB9ID0gRGF0YUxheWVyLmdldEdMVGV4dHVyZVBhcmFtZXRlcnMoe1xuXHRcdFx0Z2wsXG5cdFx0XHRuYW1lOiAndGVzdEZyYW1lYnVmZmVyV3JpdGUnLFxuXHRcdFx0bnVtQ29tcG9uZW50czogMSxcblx0XHRcdHdyaXRhYmxlOiB0cnVlLFxuXHRcdFx0aW50ZXJuYWxUeXBlOiB0eXBlLFxuXHRcdFx0Z2xzbFZlcnNpb24sXG5cdFx0XHRlcnJvckNhbGxiYWNrOiAoKSA9PiB7fSxcblx0XHR9KTtcblx0XHRnbC50ZXhJbWFnZTJEKGdsLlRFWFRVUkVfMkQsIDAsIGdsSW50ZXJuYWxGb3JtYXQsIHdpZHRoLCBoZWlnaHQsIDAsIGdsRm9ybWF0LCBnbFR5cGUsIG51bGwpO1xuXG5cdFx0Ly8gSW5pdCBhIGZyYW1lYnVmZmVyIGZvciB0aGlzIHRleHR1cmUgc28gd2UgY2FuIHdyaXRlIHRvIGl0LlxuXHRcdGNvbnN0IGZyYW1lYnVmZmVyID0gZ2wuY3JlYXRlRnJhbWVidWZmZXIoKTtcblx0XHRpZiAoIWZyYW1lYnVmZmVyKSB7XG5cdFx0XHQvLyBDbGVhciBvdXQgYWxsb2NhdGVkIG1lbW9yeS5cblx0XHRcdGdsLmRlbGV0ZVRleHR1cmUodGV4dHVyZSk7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdGdsLmJpbmRGcmFtZWJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgZnJhbWVidWZmZXIpO1xuXHRcdC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9XZWJHTFJlbmRlcmluZ0NvbnRleHQvZnJhbWVidWZmZXJUZXh0dXJlMkRcblx0XHRnbC5mcmFtZWJ1ZmZlclRleHR1cmUyRChnbC5GUkFNRUJVRkZFUiwgZ2wuQ09MT1JfQVRUQUNITUVOVDAsIGdsLlRFWFRVUkVfMkQsIHRleHR1cmUsIDApO1xuXG5cdFx0Y29uc3Qgc3RhdHVzID0gZ2wuY2hlY2tGcmFtZWJ1ZmZlclN0YXR1cyhnbC5GUkFNRUJVRkZFUik7XG5cdFx0Y29uc3QgdmFsaWRTdGF0dXMgPSBzdGF0dXMgPT09IGdsLkZSQU1FQlVGRkVSX0NPTVBMRVRFO1xuXG5cdFx0Ly8gQ2xlYXIgb3V0IGFsbG9jYXRlZCBtZW1vcnkuXG5cdFx0Z2wuZGVsZXRlVGV4dHVyZSh0ZXh0dXJlKTtcblx0XHRnbC5kZWxldGVGcmFtZWJ1ZmZlcihmcmFtZWJ1ZmZlcik7XG5cblx0XHRyZXR1cm4gdmFsaWRTdGF0dXM7XG5cdH1cblxuXHRnZXQgYnVmZmVySW5kZXgoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX2J1ZmZlckluZGV4O1xuXHR9XG5cblx0c2F2ZUN1cnJlbnRTdGF0ZVRvRGF0YUxheWVyKGxheWVyOiBEYXRhTGF5ZXIpIHtcblx0XHQvLyBBIG1ldGhvZCBmb3Igc2F2aW5nIGEgY29weSBvZiB0aGUgY3VycmVudCBzdGF0ZSB3aXRob3V0IGEgZHJhdyBjYWxsLlxuXHRcdC8vIERyYXcgY2FsbHMgYXJlIGV4cGVuc2l2ZSwgdGhpcyBvcHRpbWl6YXRpb24gaGVscHMuXG5cdFx0aWYgKHRoaXMubnVtQnVmZmVycyA8IDIpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgQ2FuJ3QgY2FsbCBEYXRhTGF5ZXIuc2F2ZUN1cnJlbnRTdGF0ZVRvRGF0YUxheWVyIG9uIERhdGFMYXllciAke3RoaXMubmFtZX0gd2l0aCBsZXNzIHRoYW4gMiBidWZmZXJzLmApO1xuXHRcdH1cblx0XHRpZiAoIXRoaXMud3JpdGFibGUpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgQ2FuJ3QgY2FsbCBEYXRhTGF5ZXIuc2F2ZUN1cnJlbnRTdGF0ZVRvRGF0YUxheWVyIG9uIHJlYWQtb25seSBEYXRhTGF5ZXIgJHt0aGlzLm5hbWV9LmApO1xuXHRcdH1cblx0XHRpZiAobGF5ZXIud3JpdGFibGUpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgQ2FuJ3QgY2FsbCBEYXRhTGF5ZXIuc2F2ZUN1cnJlbnRTdGF0ZVRvRGF0YUxheWVyIG9uIERhdGFMYXllciAke3RoaXMubmFtZX0gdXNpbmcgd3JpdGFibGUgRGF0YUxheWVyICR7bGF5ZXIubmFtZX0uYClcblx0XHR9XG5cdFx0Ly8gQ2hlY2sgdGhhdCB0ZXh0dXJlIHBhcmFtcyBhcmUgdGhlIHNhbWUuXG5cdFx0aWYgKGxheWVyLmdsV3JhcFMgIT09IHRoaXMuZ2xXcmFwUyB8fCBsYXllci5nbFdyYXBUICE9PSB0aGlzLmdsV3JhcFQgfHxcblx0XHRcdGxheWVyLndyYXBTICE9PSB0aGlzLndyYXBTIHx8IGxheWVyLndyYXBUICE9PSB0aGlzLndyYXBUIHx8XG5cdFx0XHRsYXllci53aWR0aCAhPT0gdGhpcy53aWR0aCB8fCBsYXllci5oZWlnaHQgIT09IHRoaXMuaGVpZ2h0IHx8XG5cdFx0XHRsYXllci5nbEZpbHRlciAhPT0gdGhpcy5nbEZpbHRlciB8fCBsYXllci5maWx0ZXIgIT09IHRoaXMuZmlsdGVyIHx8XG5cdFx0XHRsYXllci5nbE51bUNoYW5uZWxzICE9PSB0aGlzLmdsTnVtQ2hhbm5lbHMgfHwgbGF5ZXIubnVtQ29tcG9uZW50cyAhPT0gdGhpcy5udW1Db21wb25lbnRzIHx8XG5cdFx0XHRsYXllci5nbFR5cGUgIT09IHRoaXMuZ2xUeXBlIHx8IGxheWVyLnR5cGUgIT09IHRoaXMudHlwZSB8fFxuXHRcdFx0bGF5ZXIuZ2xGb3JtYXQgIT09IHRoaXMuZ2xGb3JtYXQgfHwgbGF5ZXIuZ2xJbnRlcm5hbEZvcm1hdCAhPT0gdGhpcy5nbEludGVybmFsRm9ybWF0KSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgSW5jb21wYXRpYmxlIHRleHR1cmUgcGFyYW1zIGJldHdlZW4gRGF0YUxheWVycyAke2xheWVyLm5hbWV9IGFuZCAke3RoaXMubmFtZX0uYCk7XG5cdFx0fVxuXG5cdFx0Ly8gSWYgd2UgaGF2ZSBub3QgYWxyZWFkeSBpbml0ZWQgb3ZlcnJpZGVzIGFycmF5LCBkbyBzbyBub3cuXG5cdFx0aWYgKCF0aGlzLnRleHR1cmVPdmVycmlkZXMpIHtcblx0XHRcdHRoaXMudGV4dHVyZU92ZXJyaWRlcyA9IFtdO1xuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm51bUJ1ZmZlcnM7IGkrKykge1xuXHRcdFx0XHR0aGlzLnRleHR1cmVPdmVycmlkZXMucHVzaCh1bmRlZmluZWQpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIENoZWNrIGlmIHdlIGFscmVhZHkgaGF2ZSBhbiBvdmVycmlkZSBpbiBwbGFjZS5cblx0XHRpZiAodGhpcy50ZXh0dXJlT3ZlcnJpZGVzW3RoaXMuX2J1ZmZlckluZGV4XSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBDYW4ndCBjYWxsIERhdGFMYXllci5zYXZlQ3VycmVudFN0YXRlVG9EYXRhTGF5ZXIgb24gRGF0YUxheWVyICR7dGhpcy5uYW1lfSwgdGhpcyBEYXRhTGF5ZXIgaGFzIG5vdCB3cml0dGVuIG5ldyBzdGF0ZSBzaW5jZSBsYXN0IGNhbGwgdG8gRGF0YUxheWVyLnNhdmVDdXJyZW50U3RhdGVUb0RhdGFMYXllci5gKTtcblx0XHR9XG5cdFx0Y29uc3QgY3VycmVudFN0YXRlID0gdGhpcy5nZXRDdXJyZW50U3RhdGVUZXh0dXJlKCk7XG5cdFx0dGhpcy50ZXh0dXJlT3ZlcnJpZGVzW3RoaXMuX2J1ZmZlckluZGV4XSA9IGN1cnJlbnRTdGF0ZTtcblx0XHQvLyBTd2FwIHRleHR1cmVzLlxuXHRcdHRoaXMuYnVmZmVyc1t0aGlzLl9idWZmZXJJbmRleF0udGV4dHVyZSA9IGxheWVyLmdldEN1cnJlbnRTdGF0ZVRleHR1cmUoKTtcblx0XHRsYXllci5fc2V0Q3VycmVudFN0YXRlVGV4dHVyZShjdXJyZW50U3RhdGUpO1xuXG5cdFx0Ly8gQmluZCBzd2FwcGVkIHRleHR1cmUgdG8gZnJhbWVidWZmZXIuXG5cdFx0Y29uc3QgeyBnbCB9ID0gdGhpcztcblx0XHRjb25zdCB7IGZyYW1lYnVmZmVyLCB0ZXh0dXJlIH0gPSB0aGlzLmJ1ZmZlcnNbdGhpcy5fYnVmZmVySW5kZXhdO1xuXHRcdGlmICghZnJhbWVidWZmZXIpIHRocm93IG5ldyBFcnJvcihgTm8gZnJhbWVidWZmZXIgZm9yIHdyaXRhYmxlIERhdGFMYXllciAke3RoaXMubmFtZX0uYCk7XG5cdFx0Z2wuYmluZEZyYW1lYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBmcmFtZWJ1ZmZlcik7XG5cdFx0Ly8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1dlYkdMUmVuZGVyaW5nQ29udGV4dC9mcmFtZWJ1ZmZlclRleHR1cmUyRFxuXHRcdGdsLmZyYW1lYnVmZmVyVGV4dHVyZTJEKGdsLkZSQU1FQlVGRkVSLCBnbC5DT0xPUl9BVFRBQ0hNRU5UMCwgZ2wuVEVYVFVSRV8yRCwgdGV4dHVyZSwgMCk7XG5cdFx0Ly8gVW5iaW5kLlxuXHRcdGdsLmJpbmRGcmFtZWJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgbnVsbCk7XG5cdH1cblxuXHRfc2V0Q3VycmVudFN0YXRlVGV4dHVyZSh0ZXh0dXJlOiBXZWJHTFRleHR1cmUpIHtcblx0XHRpZiAodGhpcy53cml0YWJsZSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBDYW4ndCBjYWxsIERhdGFMYXllci5fc2V0Q3VycmVudFN0YXRlVGV4dHVyZSBvbiB3cml0YWJsZSB0ZXh0dXJlICR7dGhpcy5uYW1lfS5gKTtcblx0XHR9XG5cdFx0dGhpcy5idWZmZXJzW3RoaXMuX2J1ZmZlckluZGV4XS50ZXh0dXJlID0gdGV4dHVyZTtcblx0fVxuXG5cdHByaXZhdGUgdmFsaWRhdGVEYXRhQXJyYXkoXG5cdFx0X2RhdGE/OiBEYXRhTGF5ZXJBcnJheVR5cGUsXG5cdCkge1xuXHRcdGlmICghX2RhdGEpe1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRjb25zdCB7IHdpZHRoLCBoZWlnaHQsIGxlbmd0aCwgbnVtQ29tcG9uZW50cywgZ2xOdW1DaGFubmVscywgdHlwZSwgaW50ZXJuYWxUeXBlLCBuYW1lIH0gPSB0aGlzO1xuXG5cdFx0Ly8gQ2hlY2sgdGhhdCBkYXRhIGlzIGNvcnJlY3QgbGVuZ3RoICh1c2VyIGVycm9yKS5cblx0XHRpZiAoKGxlbmd0aCAmJiBfZGF0YS5sZW5ndGggIT09IGxlbmd0aCAqIG51bUNvbXBvbmVudHMpIHx8ICghbGVuZ3RoICYmIF9kYXRhLmxlbmd0aCAhPT0gd2lkdGggKiBoZWlnaHQgKiBudW1Db21wb25lbnRzKSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGRhdGEgbGVuZ3RoICR7X2RhdGEubGVuZ3RofSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiIG9mIHNpemUgJHtsZW5ndGggPyBsZW5ndGggOiBgJHt3aWR0aH14JHtoZWlnaHR9YH14JHtudW1Db21wb25lbnRzfS5gKTtcblx0XHR9XG5cblx0XHQvLyBDaGVjayB0aGF0IGRhdGEgaXMgY29ycmVjdCB0eXBlICh1c2VyIGVycm9yKS5cblx0XHRsZXQgaW52YWxpZFR5cGVGb3VuZCA9IGZhbHNlO1xuXHRcdHN3aXRjaCAodHlwZSkge1xuXHRcdFx0Y2FzZSBIQUxGX0ZMT0FUOlxuXHRcdFx0XHQvLyBTaW5jZSB0aGVyZSBpcyBubyBGbG9hdDE2QXJyYXksIHdlIG11c3QgdXNlIEZsb2F0MzJBcnJheXMgdG8gaW5pdCB0ZXh0dXJlLlxuXHRcdFx0XHQvLyBDb250aW51ZSB0byBuZXh0IGNhc2UuXG5cdFx0XHRjYXNlIEZMT0FUOlxuXHRcdFx0XHRpbnZhbGlkVHlwZUZvdW5kID0gaW52YWxpZFR5cGVGb3VuZCB8fCBfZGF0YS5jb25zdHJ1Y3RvciAhPT0gRmxvYXQzMkFycmF5O1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgVU5TSUdORURfQllURTpcblx0XHRcdFx0aW52YWxpZFR5cGVGb3VuZCA9IGludmFsaWRUeXBlRm91bmQgfHwgX2RhdGEuY29uc3RydWN0b3IgIT09IFVpbnQ4QXJyYXk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBCWVRFOlxuXHRcdFx0XHRpbnZhbGlkVHlwZUZvdW5kID0gaW52YWxpZFR5cGVGb3VuZCB8fCBfZGF0YS5jb25zdHJ1Y3RvciAhPT0gSW50OEFycmF5O1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgVU5TSUdORURfU0hPUlQ6XG5cdFx0XHRcdGludmFsaWRUeXBlRm91bmQgPSBpbnZhbGlkVHlwZUZvdW5kIHx8IF9kYXRhLmNvbnN0cnVjdG9yICE9PSBVaW50MTZBcnJheTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFNIT1JUOlxuXHRcdFx0XHRpbnZhbGlkVHlwZUZvdW5kID0gaW52YWxpZFR5cGVGb3VuZCB8fCBfZGF0YS5jb25zdHJ1Y3RvciAhPT0gSW50MTZBcnJheTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFVOU0lHTkVEX0lOVDpcblx0XHRcdFx0aW52YWxpZFR5cGVGb3VuZCA9IGludmFsaWRUeXBlRm91bmQgfHwgX2RhdGEuY29uc3RydWN0b3IgIT09IFVpbnQzMkFycmF5O1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgSU5UOlxuXHRcdFx0XHRpbnZhbGlkVHlwZUZvdW5kID0gaW52YWxpZFR5cGVGb3VuZCB8fCBfZGF0YS5jb25zdHJ1Y3RvciAhPT0gSW50MzJBcnJheTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEVycm9yIGluaXRpbmcgRGF0YUxheWVyIFwiJHtuYW1lfVwiLiAgVW5zdXBwb3J0ZWQgdHlwZSBcIiR7dHlwZX1cIiBmb3IgV2ViR0xDb21wdXRlLmluaXREYXRhTGF5ZXIuYCk7XG5cdFx0fVxuXHRcdGlmIChpbnZhbGlkVHlwZUZvdW5kKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgVHlwZWRBcnJheSBvZiB0eXBlICR7KF9kYXRhLmNvbnN0cnVjdG9yIGFzIGFueSkubmFtZX0gc3VwcGxpZWQgdG8gRGF0YUxheWVyIFwiJHtuYW1lfVwiIG9mIHR5cGUgXCIke3R5cGV9XCIuYCk7XG5cdFx0fVxuXG5cdFx0bGV0IGRhdGEgPSBfZGF0YTtcblx0XHRjb25zdCBpbWFnZVNpemUgPSB3aWR0aCAqIGhlaWdodCAqIGdsTnVtQ2hhbm5lbHM7XG5cdFx0Ly8gVGhlbiBjaGVjayBpZiBhcnJheSBuZWVkcyB0byBiZSBsZW5ndGhlbmVkLlxuXHRcdC8vIFRoaXMgY291bGQgYmUgYmVjYXVzZSBnbE51bUNoYW5uZWxzICE9PSBudW1Db21wb25lbnRzLlxuXHRcdC8vIE9yIGJlY2F1c2UgbGVuZ3RoICE9PSB3aWR0aCAqIGhlaWdodC5cblx0XHRjb25zdCBpbmNvcnJlY3RTaXplID0gZGF0YS5sZW5ndGggIT09IGltYWdlU2l6ZTtcblx0XHQvLyBXZSBoYXZlIHRvIGhhbmRsZSB0aGUgY2FzZSBvZiBGbG9hdDE2IHNwZWNpYWxseSBieSBjb252ZXJ0aW5nIGRhdGEgdG8gVWludDE2QXJyYXkuXG5cdFx0Y29uc3QgaGFuZGxlRmxvYXQxNiA9IGludGVybmFsVHlwZSA9PT0gSEFMRl9GTE9BVDtcblx0XHQvLyBGb3Igd2ViZ2wxLjAgd2UgbWF5IG5lZWQgdG8gY2FzdCBhbiBpbnQgdHlwZSB0byBhIEZMT0FUIG9yIEhBTEZfRkxPQVQuXG5cdFx0Y29uc3Qgc2hvdWxkVHlwZUNhc3QgPSB0eXBlICE9PSBpbnRlcm5hbFR5cGU7XG5cblx0XHRpZiAoc2hvdWxkVHlwZUNhc3QgfHwgaW5jb3JyZWN0U2l6ZSB8fCBoYW5kbGVGbG9hdDE2KSB7XG5cdFx0XHRzd2l0Y2ggKGludGVybmFsVHlwZSkge1xuXHRcdFx0XHRjYXNlIEhBTEZfRkxPQVQ6XG5cdFx0XHRcdFx0ZGF0YSA9IG5ldyBVaW50MTZBcnJheShpbWFnZVNpemUpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIEZMT0FUOlxuXHRcdFx0XHRcdGRhdGEgPSBuZXcgRmxvYXQzMkFycmF5KGltYWdlU2l6ZSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgVU5TSUdORURfQllURTpcblx0XHRcdFx0XHRkYXRhID0gbmV3IFVpbnQ4QXJyYXkoaW1hZ2VTaXplKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBCWVRFOlxuXHRcdFx0XHRcdGRhdGEgPSBuZXcgSW50OEFycmF5KGltYWdlU2l6ZSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgVU5TSUdORURfU0hPUlQ6XG5cdFx0XHRcdFx0ZGF0YSA9IG5ldyBVaW50MTZBcnJheShpbWFnZVNpemUpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFNIT1JUOlxuXHRcdFx0XHRcdGRhdGEgPSBuZXcgSW50MTZBcnJheShpbWFnZVNpemUpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFVOU0lHTkVEX0lOVDpcblx0XHRcdFx0XHRkYXRhID0gbmV3IFVpbnQzMkFycmF5KGltYWdlU2l6ZSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgSU5UOlxuXHRcdFx0XHRcdGRhdGEgPSBuZXcgSW50MzJBcnJheShpbWFnZVNpemUpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEVycm9yIGluaXRpbmcgJHtuYW1lfS4gIFVuc3VwcG9ydGVkIGludGVybmFsVHlwZSAke2ludGVybmFsVHlwZX0gZm9yIFdlYkdMQ29tcHV0ZS5pbml0RGF0YUxheWVyLmApO1xuXHRcdFx0fVxuXHRcdFx0Ly8gRmlsbCBuZXcgZGF0YSBhcnJheSB3aXRoIG9sZCBkYXRhLlxuXHRcdFx0Y29uc3QgdmlldyA9IGhhbmRsZUZsb2F0MTYgPyBuZXcgRGF0YVZpZXcoZGF0YS5idWZmZXIpIDogbnVsbDtcblx0XHRcdGZvciAobGV0IGkgPSAwLCBfbGVuID0gX2RhdGEubGVuZ3RoIC8gbnVtQ29tcG9uZW50czsgaSA8IF9sZW47IGkrKykge1xuXHRcdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IG51bUNvbXBvbmVudHM7IGorKykge1xuXHRcdFx0XHRcdGNvbnN0IHZhbHVlID0gX2RhdGFbaSAqIG51bUNvbXBvbmVudHMgKyBqXTtcblx0XHRcdFx0XHRjb25zdCBpbmRleCA9IGkgKiBnbE51bUNoYW5uZWxzICsgajtcblx0XHRcdFx0XHRpZiAoaGFuZGxlRmxvYXQxNikge1xuXHRcdFx0XHRcdFx0c2V0RmxvYXQxNih2aWV3ISwgMiAqIGluZGV4LCB2YWx1ZSwgdHJ1ZSk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGRhdGFbaW5kZXhdID0gdmFsdWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGRhdGE7XG5cdH1cblxuXHRwcml2YXRlIGluaXRCdWZmZXJzKFxuXHRcdF9kYXRhPzogRGF0YUxheWVyQXJyYXlUeXBlLFxuXHQpIHtcblx0XHRjb25zdCB7XG5cdFx0XHRuYW1lLFxuXHRcdFx0bnVtQnVmZmVycyxcblx0XHRcdGdsLFxuXHRcdFx0d2lkdGgsXG5cdFx0XHRoZWlnaHQsXG5cdFx0XHRnbEludGVybmFsRm9ybWF0LFxuXHRcdFx0Z2xGb3JtYXQsXG5cdFx0XHRnbFR5cGUsXG5cdFx0XHRnbEZpbHRlcixcblx0XHRcdGdsV3JhcFMsXG5cdFx0XHRnbFdyYXBULFxuXHRcdFx0d3JpdGFibGUsXG5cdFx0XHRlcnJvckNhbGxiYWNrLFxuXHRcdH0gPSB0aGlzO1xuXG5cdFx0Y29uc3QgZGF0YSA9IHRoaXMudmFsaWRhdGVEYXRhQXJyYXkoX2RhdGEpO1xuXG5cdFx0Ly8gSW5pdCBhIHRleHR1cmUgZm9yIGVhY2ggYnVmZmVyLlxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbnVtQnVmZmVyczsgaSsrKSB7XG5cdFx0XHRjb25zdCB0ZXh0dXJlID0gZ2wuY3JlYXRlVGV4dHVyZSgpO1xuXHRcdFx0aWYgKCF0ZXh0dXJlKSB7XG5cdFx0XHRcdGVycm9yQ2FsbGJhY2soYENvdWxkIG5vdCBpbml0IHRleHR1cmUgZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIjogJHtnbC5nZXRFcnJvcigpfS5gKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgdGV4dHVyZSk7XG5cblx0XHRcdC8vIFRPRE86IGFyZSB0aGVyZSBvdGhlciBwYXJhbXMgdG8gbG9vayBpbnRvOlxuXHRcdFx0Ly8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1dlYkdMUmVuZGVyaW5nQ29udGV4dC90ZXhQYXJhbWV0ZXJcblx0XHRcdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1MsIGdsV3JhcFMpO1xuXHRcdFx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfVCwgZ2xXcmFwVCk7XG5cdFx0XHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgZ2xGaWx0ZXIpO1xuXHRcdFx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01BR19GSUxURVIsIGdsRmlsdGVyKTtcblxuXHRcdFx0Z2wudGV4SW1hZ2UyRChnbC5URVhUVVJFXzJELCAwLCBnbEludGVybmFsRm9ybWF0LCB3aWR0aCwgaGVpZ2h0LCAwLCBnbEZvcm1hdCwgZ2xUeXBlLCBkYXRhID8gZGF0YSA6IG51bGwpO1xuXHRcdFx0XG5cdFx0XHRjb25zdCBidWZmZXI6IERhdGFMYXllckJ1ZmZlciA9IHtcblx0XHRcdFx0dGV4dHVyZSxcblx0XHRcdH07XG5cblx0XHRcdGlmICh3cml0YWJsZSkge1xuXHRcdFx0XHQvLyBJbml0IGEgZnJhbWVidWZmZXIgZm9yIHRoaXMgdGV4dHVyZSBzbyB3ZSBjYW4gd3JpdGUgdG8gaXQuXG5cdFx0XHRcdGNvbnN0IGZyYW1lYnVmZmVyID0gZ2wuY3JlYXRlRnJhbWVidWZmZXIoKTtcblx0XHRcdFx0aWYgKCFmcmFtZWJ1ZmZlcikge1xuXHRcdFx0XHRcdGVycm9yQ2FsbGJhY2soYENvdWxkIG5vdCBpbml0IGZyYW1lYnVmZmVyIGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCI6ICR7Z2wuZ2V0RXJyb3IoKX0uYCk7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGdsLmJpbmRGcmFtZWJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgZnJhbWVidWZmZXIpO1xuXHRcdFx0XHQvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvV2ViR0xSZW5kZXJpbmdDb250ZXh0L2ZyYW1lYnVmZmVyVGV4dHVyZTJEXG5cdFx0XHRcdGdsLmZyYW1lYnVmZmVyVGV4dHVyZTJEKGdsLkZSQU1FQlVGRkVSLCBnbC5DT0xPUl9BVFRBQ0hNRU5UMCwgZ2wuVEVYVFVSRV8yRCwgdGV4dHVyZSwgMCk7XG5cblx0XHRcdFx0Y29uc3Qgc3RhdHVzID0gZ2wuY2hlY2tGcmFtZWJ1ZmZlclN0YXR1cyhnbC5GUkFNRUJVRkZFUik7XG5cdFx0XHRcdGlmKHN0YXR1cyAhPSBnbC5GUkFNRUJVRkZFUl9DT01QTEVURSl7XG5cdFx0XHRcdFx0ZXJyb3JDYWxsYmFjayhgSW52YWxpZCBzdGF0dXMgZm9yIGZyYW1lYnVmZmVyIGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCI6ICR7c3RhdHVzfS5gKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIEFkZCBmcmFtZWJ1ZmZlci5cblx0XHRcdFx0YnVmZmVyLmZyYW1lYnVmZmVyID0gZnJhbWVidWZmZXI7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdC8vIFNhdmUgdGhpcyBidWZmZXIgdG8gdGhlIGxpc3QuXG5cdFx0XHR0aGlzLmJ1ZmZlcnMucHVzaChidWZmZXIpO1xuXHRcdH1cblx0XHQvLyBVbmJpbmQuXG5cdFx0Z2wuYmluZEZyYW1lYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBudWxsKTtcblx0fVxuXG5cdGdldEN1cnJlbnRTdGF0ZVRleHR1cmUoKSB7XG5cdFx0aWYgKHRoaXMudGV4dHVyZU92ZXJyaWRlcyAmJiB0aGlzLnRleHR1cmVPdmVycmlkZXNbdGhpcy5fYnVmZmVySW5kZXhdKSByZXR1cm4gdGhpcy50ZXh0dXJlT3ZlcnJpZGVzW3RoaXMuX2J1ZmZlckluZGV4XSE7XG5cdFx0cmV0dXJuIHRoaXMuYnVmZmVyc1t0aGlzLl9idWZmZXJJbmRleF0udGV4dHVyZTtcblx0fVxuXG5cdGdldFByZXZpb3VzU3RhdGVUZXh0dXJlKGluZGV4ID0gLTEpIHtcblx0XHRpZiAodGhpcy5udW1CdWZmZXJzID09PSAxKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBjYWxsIGdldFByZXZpb3VzU3RhdGVUZXh0dXJlIG9uIERhdGFMYXllciBcIiR7dGhpcy5uYW1lfVwiIHdpdGggb25seSBvbmUgYnVmZmVyLmApO1xuXHRcdH1cblx0XHRjb25zdCBwcmV2aW91c0luZGV4ID0gdGhpcy5fYnVmZmVySW5kZXggKyBpbmRleCArIHRoaXMubnVtQnVmZmVycztcblx0XHRpZiAocHJldmlvdXNJbmRleCA8IDAgfHwgcHJldmlvdXNJbmRleCA+PSB0aGlzLm51bUJ1ZmZlcnMpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBpbmRleCAke2luZGV4fSBwYXNzZWQgdG8gZ2V0UHJldmlvdXNTdGF0ZVRleHR1cmUgb24gRGF0YUxheWVyICR7dGhpcy5uYW1lfSB3aXRoICR7dGhpcy5udW1CdWZmZXJzfSBidWZmZXJzLmApO1xuXHRcdH1cblx0XHRpZiAodGhpcy50ZXh0dXJlT3ZlcnJpZGVzICYmIHRoaXMudGV4dHVyZU92ZXJyaWRlc1twcmV2aW91c0luZGV4XSkgcmV0dXJuIHRoaXMudGV4dHVyZU92ZXJyaWRlc1twcmV2aW91c0luZGV4XSE7XG5cdFx0cmV0dXJuIHRoaXMuYnVmZmVyc1twcmV2aW91c0luZGV4XS50ZXh0dXJlO1xuXHR9XG5cblx0X3VzaW5nVGV4dHVyZU92ZXJyaWRlRm9yQ3VycmVudEJ1ZmZlcigpIHtcblx0XHRyZXR1cm4gdGhpcy50ZXh0dXJlT3ZlcnJpZGVzICYmIHRoaXMudGV4dHVyZU92ZXJyaWRlc1t0aGlzLmJ1ZmZlckluZGV4XTtcblx0fVxuXG5cdF9iaW5kT3V0cHV0QnVmZmVyRm9yV3JpdGUoXG5cdFx0aW5jcmVtZW50QnVmZmVySW5kZXg6IGJvb2xlYW4sXG5cdCkge1xuXHRcdGNvbnN0IHsgZ2wgfSA9IHRoaXM7XG5cdFx0aWYgKGluY3JlbWVudEJ1ZmZlckluZGV4KSB7XG5cdFx0XHQvLyBJbmNyZW1lbnQgYnVmZmVySW5kZXguXG5cdFx0XHR0aGlzLl9idWZmZXJJbmRleCA9ICh0aGlzLl9idWZmZXJJbmRleCArIDEpICUgdGhpcy5udW1CdWZmZXJzO1xuXHRcdH1cblx0XHR0aGlzLl9iaW5kT3V0cHV0QnVmZmVyKCk7XG5cblx0XHQvLyBXZSBhcmUgZ29pbmcgdG8gZG8gYSBkYXRhIHdyaXRlLCBpZiB3ZSBoYXZlIG92ZXJyaWRlcyBlbmFibGVkLCB3ZSBjYW4gcmVtb3ZlIHRoZW0uXG5cdFx0aWYgKHRoaXMudGV4dHVyZU92ZXJyaWRlcykge1xuXHRcdFx0dGhpcy50ZXh0dXJlT3ZlcnJpZGVzW3RoaXMuX2J1ZmZlckluZGV4XSA9IHVuZGVmaW5lZDtcblx0XHR9XG5cdH1cblxuXHRfYmluZE91dHB1dEJ1ZmZlcigpIHtcblx0XHRjb25zdCB7IGdsIH0gPSB0aGlzO1xuXHRcdGNvbnN0IHsgZnJhbWVidWZmZXIgfSA9IHRoaXMuYnVmZmVyc1t0aGlzLl9idWZmZXJJbmRleF07XG5cdFx0aWYgKCFmcmFtZWJ1ZmZlcikge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBEYXRhTGF5ZXIgXCIke3RoaXMubmFtZX1cIiBpcyBub3Qgd3JpdGFibGUuYCk7XG5cdFx0fVxuXHRcdGdsLmJpbmRGcmFtZWJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgZnJhbWVidWZmZXIpO1xuXHR9XG5cblx0c2V0RGF0YShkYXRhOiBEYXRhTGF5ZXJBcnJheVR5cGUpIHtcblx0XHQvLyBUT0RPOiBSYXRoZXIgdGhhbiBkZXN0cm95aW5nIGJ1ZmZlcnMsIHdlIGNvdWxkIHdyaXRlIHRvIGNlcnRhaW4gd2luZG93LlxuXHRcdHRoaXMuZGVzdHJveUJ1ZmZlcnMoKTtcblx0XHR0aGlzLmluaXRCdWZmZXJzKGRhdGEpO1xuXHR9XG5cblx0cmVzaXplKFxuXHRcdGRpbWVuc2lvbnM6IG51bWJlciB8IFtudW1iZXIsIG51bWJlcl0sXG5cdFx0ZGF0YT86IERhdGFMYXllckFycmF5VHlwZSxcblx0KSB7XG5cdFx0Y29uc3QgeyBsZW5ndGgsIHdpZHRoLCBoZWlnaHQgfSA9IERhdGFMYXllci5jYWxjU2l6ZShkaW1lbnNpb25zLCB0aGlzLm5hbWUpO1xuXHRcdHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xuXHRcdHRoaXMud2lkdGggPSB3aWR0aDtcblx0XHR0aGlzLmhlaWdodCA9IGhlaWdodDtcblx0XHR0aGlzLmRlc3Ryb3lCdWZmZXJzKCk7XG5cdFx0dGhpcy5pbml0QnVmZmVycyhkYXRhKTtcblx0fVxuXG5cdGNsZWFyKCkge1xuXHRcdC8vIFJlc2V0IGV2ZXJ5dGhpbmcgdG8gemVyby5cblx0XHQvLyBUT0RPOiBUaGlzIGlzIG5vdCB0aGUgbW9zdCBlZmZpY2llbnQgd2F5IHRvIGRvIHRoaXMgKHJlYWxsb2NhdGluZyBhbGwgdGV4dHVyZXMgYW5kIGZyYW1lYnVmZmVycyksIGJ1dCBvayBmb3Igbm93LlxuXHRcdHRoaXMuZGVzdHJveUJ1ZmZlcnMoKTtcblx0XHR0aGlzLmluaXRCdWZmZXJzKCk7XG5cdH1cblxuXHRnZXREaW1lbnNpb25zKCkge1xuXHRcdHJldHVybiBbXG5cdFx0XHR0aGlzLndpZHRoLFxuXHRcdFx0dGhpcy5oZWlnaHQsXG5cdFx0XSBhcyBbbnVtYmVyLCBudW1iZXJdO1xuXHR9XG5cblx0Z2V0TGVuZ3RoKCkge1xuXHRcdGlmICghdGhpcy5sZW5ndGgpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGNhbGwgZ2V0TGVuZ3RoKCkgb24gMkQgRGF0YUxheWVyIFwiJHt0aGlzLm5hbWV9XCIuYCk7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLmxlbmd0aDtcblx0fVxuXG5cdHByaXZhdGUgZGVzdHJveUJ1ZmZlcnMoKSB7XG5cdFx0Y29uc3QgeyBnbCwgYnVmZmVycyB9ID0gdGhpcztcblx0XHRidWZmZXJzLmZvckVhY2goYnVmZmVyID0+IHtcblx0XHRcdGNvbnN0IHsgZnJhbWVidWZmZXIsIHRleHR1cmUgfSA9IGJ1ZmZlcjtcblx0XHRcdGdsLmRlbGV0ZVRleHR1cmUodGV4dHVyZSk7XG5cdFx0XHRpZiAoZnJhbWVidWZmZXIpIHtcblx0XHRcdFx0Z2wuZGVsZXRlRnJhbWVidWZmZXIoZnJhbWVidWZmZXIpO1xuXHRcdFx0fVxuXHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0ZGVsZXRlIGJ1ZmZlci50ZXh0dXJlO1xuXHRcdFx0ZGVsZXRlIGJ1ZmZlci5mcmFtZWJ1ZmZlcjtcblx0XHR9KTtcblx0XHRidWZmZXJzLmxlbmd0aCA9IDA7XG5cblx0XHQvLyBUaGVzZSBhcmUgdGVjaG5pY2FsbHkgb3duZWQgYnkgYW5vdGhlciBEYXRhTGF5ZXIsXG5cdFx0Ly8gc28gd2UgYXJlIG5vdCByZXNwb25zaWJsZSBmb3IgZGVsZXRpbmcgdGhlbSBmcm9tIGdsIGNvbnRleHQuXG5cdFx0ZGVsZXRlIHRoaXMudGV4dHVyZU92ZXJyaWRlcztcblx0fVxuXG5cdGRlc3Ryb3koKSB7XG5cdFx0dGhpcy5kZXN0cm95QnVmZmVycygpO1xuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHRkZWxldGUgdGhpcy5nbDtcblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0ZGVsZXRlIHRoaXMuZXJyb3JDYWxsYmFjaztcblx0fVxufVxuIiwiaW1wb3J0IHsgaXNBcnJheSwgaXNJbnRlZ2VyLCBpc051bWJlciwgaXNTdHJpbmcgfSBmcm9tICcuL0NoZWNrcyc7XG5pbXBvcnQge1xuXHRGTE9BVCxcblx0RkxPQVRfMURfVU5JRk9STSwgRkxPQVRfMkRfVU5JRk9STSwgRkxPQVRfM0RfVU5JRk9STSwgRkxPQVRfNERfVU5JRk9STSxcblx0R0xTTDMsXG5cdEdMU0xWZXJzaW9uLFxuXHRJTlQsXG5cdElOVF8xRF9VTklGT1JNLCBJTlRfMkRfVU5JRk9STSwgSU5UXzNEX1VOSUZPUk0sIElOVF80RF9VTklGT1JNLFxuXHRVbmlmb3JtLCBVbmlmb3JtRGF0YVR5cGUsIFVuaWZvcm1UeXBlLCBVbmlmb3JtVmFsdWVUeXBlLFxufSBmcm9tICcuL0NvbnN0YW50cyc7XG5pbXBvcnQgeyBjb21waWxlU2hhZGVyIH0gZnJvbSAnLi91dGlscyc7XG5cbmNvbnN0IERFRkFVTFRfUFJPR1JBTV9OQU1FID0gJ0RFRkFVTFQnO1xuY29uc3QgU0VHTUVOVF9QUk9HUkFNX05BTUUgPSAnU0VHTUVOVCc7XG5jb25zdCBQT0lOVFNfUFJPR1JBTV9OQU1FID0gJ1BPSU5UUyc7XG5jb25zdCBWRUNUT1JfRklFTERfUFJPR1JBTV9OQU1FID0gJ1ZFQ1RPUl9GSUVMRCc7XG5jb25zdCBJTkRFWEVEX0xJTkVTX1BST0dSQU1fTkFNRSA9ICdJTkRFWEVEX0xJTkVTJztcbmNvbnN0IFBPTFlMSU5FX1BST0dSQU1fTkFNRSA9ICdQT0xZTElORSc7XG5jb25zdCBnbFByb2dyYW1OYW1lcyA9IFtcblx0REVGQVVMVF9QUk9HUkFNX05BTUUsXG5cdFNFR01FTlRfUFJPR1JBTV9OQU1FLFxuXHRQT0lOVFNfUFJPR1JBTV9OQU1FLFxuXHRWRUNUT1JfRklFTERfUFJPR1JBTV9OQU1FLFxuXHRJTkRFWEVEX0xJTkVTX1BST0dSQU1fTkFNRSxcblx0UE9MWUxJTkVfUFJPR1JBTV9OQU1FLFxuXTtcblxuZXhwb3J0IGNsYXNzIEdQVVByb2dyYW0ge1xuXHRyZWFkb25seSBuYW1lOiBzdHJpbmc7XG5cdHByaXZhdGUgcmVhZG9ubHkgZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCB8IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQ7XG5cdHByaXZhdGUgcmVhZG9ubHkgZXJyb3JDYWxsYmFjazogKG1lc3NhZ2U6IHN0cmluZykgPT4gdm9pZDtcblx0cHJpdmF0ZSByZWFkb25seSBnbHNsVmVyc2lvbjogR0xTTFZlcnNpb247XG5cdHByaXZhdGUgcmVhZG9ubHkgdW5pZm9ybXM6IHsgWyBrZXk6IHN0cmluZ106IFVuaWZvcm0gfSA9IHt9O1xuXHRwcml2YXRlIHJlYWRvbmx5IGZyYWdtZW50U2hhZGVyITogV2ViR0xTaGFkZXI7XG5cdC8vIFN0b3JlIGdsIHByb2dyYW1zLlxuXHRwcml2YXRlIF9kZWZhdWx0UHJvZ3JhbT86IFdlYkdMUHJvZ3JhbTtcblx0cHJpdmF0ZSBfc2VnbWVudFByb2dyYW0/OiBXZWJHTFByb2dyYW07XG5cdHByaXZhdGUgX3BvaW50c1Byb2dyYW0/OiBXZWJHTFByb2dyYW07XG5cdHByaXZhdGUgX3ZlY3RvckZpZWxkUHJvZ3JhbT86IFdlYkdMUHJvZ3JhbTtcblx0cHJpdmF0ZSBfaW5kZXhlZExpbmVzUHJvZ3JhbT86IFdlYkdMUHJvZ3JhbTtcblx0cHJpdmF0ZSBfcG9seWxpbmVQcm9ncmFtPzogV2ViR0xQcm9ncmFtO1xuXHQvLyBTdG9yZSB2ZXJ0ZXhTaGFkZXJzIGFzIGNsYXNzIHByb3BlcnRpZXMgKGZvciBzaGFyaW5nKS5cblx0cHJpdmF0ZSBzdGF0aWMgZGVmYXVsdFZlcnRleFNoYWRlcj86IFdlYkdMU2hhZGVyO1xuXHRwcml2YXRlIHN0YXRpYyBzZWdtZW50VmVydGV4U2hhZGVyPzogV2ViR0xTaGFkZXI7XG5cdHByaXZhdGUgc3RhdGljIHBvaW50c1ZlcnRleFNoYWRlcj86IFdlYkdMU2hhZGVyO1xuXHRwcml2YXRlIHN0YXRpYyB2ZWN0b3JGaWVsZFZlcnRleFNoYWRlcj86IFdlYkdMU2hhZGVyO1xuXHRwcml2YXRlIHN0YXRpYyBpbmRleGVkTGluZXNWZXJ0ZXhTaGFkZXI/OiBXZWJHTFNoYWRlcjtcblx0cHJpdmF0ZSBzdGF0aWMgcG9seWxpbmVWZXJ0ZXhTaGFkZXI/OiBXZWJHTFNoYWRlcjtcblxuXHRjb25zdHJ1Y3Rvcihcblx0XHRwYXJhbXM6IHtcblx0XHRcdGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQgfCBXZWJHTDJSZW5kZXJpbmdDb250ZXh0LFxuXHRcdFx0bmFtZTogc3RyaW5nLFxuXHRcdFx0ZnJhZ21lbnRTaGFkZXI6IHN0cmluZyB8IHN0cmluZ1tdIHwgV2ViR0xTaGFkZXIsLy8gV2UgbWF5IHdhbnQgdG8gcGFzcyBpbiBhbiBhcnJheSBvZiBzaGFkZXIgc3RyaW5nIHNvdXJjZXMsIGlmIHNwbGl0IGFjcm9zcyBzZXZlcmFsIGZpbGVzLlxuXHRcdFx0ZXJyb3JDYWxsYmFjazogKG1lc3NhZ2U6IHN0cmluZykgPT4gdm9pZCxcblx0XHRcdGdsc2xWZXJzaW9uOiBHTFNMVmVyc2lvbixcblx0XHRcdHVuaWZvcm1zPzoge1xuXHRcdFx0XHRuYW1lOiBzdHJpbmcsXG5cdFx0XHRcdHZhbHVlOiBVbmlmb3JtVmFsdWVUeXBlLFxuXHRcdFx0XHRkYXRhVHlwZTogVW5pZm9ybURhdGFUeXBlLFxuXHRcdFx0fVtdLFxuXHRcdFx0ZGVmaW5lcz86IHsvLyBXZSdsbCBhbGxvdyBzb21lIHZhcmlhYmxlcyB0byBiZSBwYXNzZWQgaW4gYXMgI2RlZmluZSB0byB0aGUgcHJlcHJvY2Vzc29yIGZvciB0aGUgZnJhZ21lbnQgc2hhZGVyLlxuXHRcdFx0XHRba2V5OiBzdHJpbmddOiBzdHJpbmcsIC8vIFdlJ2xsIGRvIHRoZXNlIGFzIHN0cmluZ3MgdG8gbWFrZSBpdCBlYXNpZXIgdG8gY29udHJvbCBmbG9hdCB2cyBpbnQuXG5cdFx0XHR9LFxuXHRcdH0sXG5cdFx0XG5cdCkge1xuXHRcdGNvbnN0IHsgZ2wsIGVycm9yQ2FsbGJhY2ssIG5hbWUsIGZyYWdtZW50U2hhZGVyLCBnbHNsVmVyc2lvbiwgdW5pZm9ybXMsIGRlZmluZXMgfSA9IHBhcmFtcztcblxuXHRcdC8vIFNhdmUgYXJndW1lbnRzLlxuXHRcdHRoaXMuZ2wgPSBnbDtcblx0XHR0aGlzLmVycm9yQ2FsbGJhY2sgPSBlcnJvckNhbGxiYWNrO1xuXHRcdHRoaXMubmFtZSA9IG5hbWU7XG5cdFx0dGhpcy5nbHNsVmVyc2lvbiA9IGdsc2xWZXJzaW9uO1xuXG5cdFx0Ly8gQ29tcGlsZSBmcmFnbWVudCBzaGFkZXIuXG5cdFx0aWYgKHR5cGVvZihmcmFnbWVudFNoYWRlcikgPT09ICdzdHJpbmcnIHx8IHR5cGVvZigoZnJhZ21lbnRTaGFkZXIgYXMgc3RyaW5nW10pWzBdKSA9PT0gJ3N0cmluZycpIHtcblx0XHRcdGxldCBzb3VyY2VTdHJpbmcgPSB0eXBlb2YoZnJhZ21lbnRTaGFkZXIpID09PSAnc3RyaW5nJyA/XG5cdFx0XHRcdGZyYWdtZW50U2hhZGVyIDpcblx0XHRcdFx0KGZyYWdtZW50U2hhZGVyIGFzIHN0cmluZ1tdKS5qb2luKCdcXG4nKTtcblx0XHRcdGlmIChkZWZpbmVzKSB7XG5cdFx0XHRcdC8vIEZpcnN0IGNvbnZlcnQgZGVmaW5lcyB0byBhIHN0cmluZy5cblx0XHRcdFx0bGV0IGRlZmluZXNTb3VyY2UgPSAnJztcblx0XHRcdFx0Y29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGRlZmluZXMpO1xuXHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRjb25zdCBrZXkgPSBrZXlzW2ldO1xuXHRcdFx0XHRcdC8vIENoZWNrIHRoYXQgZGVmaW5lIGlzIHBhc3NlZCBpbiBhcyBhIHN0cmluZy5cblx0XHRcdFx0XHRpZiAoIWlzU3RyaW5nKGtleSkgfHwgIWlzU3RyaW5nKGRlZmluZXNba2V5XSkpIHtcblx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgR1BVUHJvZ3JhbSBkZWZpbmVzIG11c3QgYmUgcGFzc2VkIGluIGFzIGtleSB2YWx1ZSBwYWlycyB0aGF0IGFyZSBib3RoIHN0cmluZ3MsIGdvdCBrZXkgdmFsdWUgcGFpciBvZiB0eXBlICR7dHlwZW9mIGtleX0gOiAke3R5cGVvZiBkZWZpbmVzW2tleV19LmApXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGRlZmluZXNTb3VyY2UgKz0gYCNkZWZpbmUgJHtrZXl9ICR7ZGVmaW5lc1trZXldfVxcbmA7XG5cdFx0XHRcdH1cblx0XHRcdFx0c291cmNlU3RyaW5nID0gZGVmaW5lc1NvdXJjZSArIHNvdXJjZVN0cmluZztcblx0XHRcdH1cblx0XHRcdGNvbnN0IHNoYWRlciA9IGNvbXBpbGVTaGFkZXIoZ2wsIGVycm9yQ2FsbGJhY2ssIHNvdXJjZVN0cmluZywgZ2wuRlJBR01FTlRfU0hBREVSLCBuYW1lKTtcblx0XHRcdGlmICghc2hhZGVyKSB7XG5cdFx0XHRcdGVycm9yQ2FsbGJhY2soYFVuYWJsZSB0byBjb21waWxlIGZyYWdtZW50IHNoYWRlciBmb3IgcHJvZ3JhbSBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5mcmFnbWVudFNoYWRlciA9IHNoYWRlcjtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKGRlZmluZXMpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gYXR0YWNoIGRlZmluZXMgdG8gcHJvZ3JhbSBcIiR7bmFtZX1cIiBiZWNhdXNlIGZyYWdtZW50IHNoYWRlciBpcyBhbHJlYWR5IGNvbXBpbGVkLmApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICh1bmlmb3Jtcykge1xuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB1bmlmb3Jtcz8ubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0Y29uc3QgeyBuYW1lLCB2YWx1ZSwgZGF0YVR5cGUgfSA9IHVuaWZvcm1zW2ldO1xuXHRcdFx0XHR0aGlzLnNldFVuaWZvcm0obmFtZSwgdmFsdWUsIGRhdGFUeXBlKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIGluaXRQcm9ncmFtKHZlcnRleFNoYWRlcjogV2ViR0xTaGFkZXIsIHByb2dyYW1OYW1lOiBzdHJpbmcpIHtcblx0XHRjb25zdCB7IGdsLCBmcmFnbWVudFNoYWRlciwgZXJyb3JDYWxsYmFjaywgdW5pZm9ybXMgfSA9IHRoaXM7XG5cdFx0Ly8gQ3JlYXRlIGEgcHJvZ3JhbS5cblx0XHRjb25zdCBwcm9ncmFtID0gZ2wuY3JlYXRlUHJvZ3JhbSgpO1xuXHRcdGlmICghcHJvZ3JhbSkge1xuXHRcdFx0ZXJyb3JDYWxsYmFjayhgVW5hYmxlIHRvIGluaXQgZ2wgcHJvZ3JhbTogJHtuYW1lfS5gKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0Ly8gVE9ETzogY2hlY2sgdGhhdCBhdHRhY2hTaGFkZXIgd29ya2VkLlxuXHRcdGdsLmF0dGFjaFNoYWRlcihwcm9ncmFtLCBmcmFnbWVudFNoYWRlcik7XG5cdFx0Z2wuYXR0YWNoU2hhZGVyKHByb2dyYW0sIHZlcnRleFNoYWRlcik7XG5cdFx0Ly8gTGluayB0aGUgcHJvZ3JhbS5cblx0XHRnbC5saW5rUHJvZ3JhbShwcm9ncmFtKTtcblx0XHQvLyBDaGVjayBpZiBpdCBsaW5rZWQuXG5cdFx0Y29uc3Qgc3VjY2VzcyA9IGdsLmdldFByb2dyYW1QYXJhbWV0ZXIocHJvZ3JhbSwgZ2wuTElOS19TVEFUVVMpO1xuXHRcdGlmICghc3VjY2Vzcykge1xuXHRcdFx0Ly8gU29tZXRoaW5nIHdlbnQgd3Jvbmcgd2l0aCB0aGUgbGluay5cblx0XHRcdGVycm9yQ2FsbGJhY2soYFByb2dyYW0gXCIke25hbWV9XCIgZmFpbGVkIHRvIGxpbms6ICR7Z2wuZ2V0UHJvZ3JhbUluZm9Mb2cocHJvZ3JhbSl9YCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdC8vIElmIHdlIGhhdmUgYW55IHVuaWZvcm1zIHNldCBmb3IgdGhpcyBHUFVQcm9ncmFtLCBhZGQgdGhvc2UgdG8gV2ViR0xQcm9ncmFtIHdlIGp1c3QgaW5pdGVkLlxuXHRcdGNvbnN0IHVuaWZvcm1OYW1lcyA9IE9iamVjdC5rZXlzKHVuaWZvcm1zKTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHVuaWZvcm1OYW1lcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0Y29uc3QgdW5pZm9ybU5hbWUgPSB1bmlmb3JtTmFtZXNbaV07XG5cdFx0XHRjb25zdCB1bmlmb3JtID0gdW5pZm9ybXNbdW5pZm9ybU5hbWVdO1xuXHRcdFx0Y29uc3QgeyB2YWx1ZSwgdHlwZSB9ID0gdW5pZm9ybTtcblx0XHRcdHRoaXMuc2V0UHJvZ3JhbVVuaWZvcm0ocHJvZ3JhbSwgcHJvZ3JhbU5hbWUsIHVuaWZvcm1OYW1lLCB2YWx1ZSwgdHlwZSk7XG5cdFx0fVxuXHRcdHJldHVybiBwcm9ncmFtO1xuXHR9XG5cblx0Z2V0IGRlZmF1bHRQcm9ncmFtKCkge1xuXHRcdGlmICh0aGlzLl9kZWZhdWx0UHJvZ3JhbSkgcmV0dXJuIHRoaXMuX2RlZmF1bHRQcm9ncmFtO1xuXHRcdGlmIChHUFVQcm9ncmFtLmRlZmF1bHRWZXJ0ZXhTaGFkZXIgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Y29uc3QgeyBnbCwgbmFtZSwgZXJyb3JDYWxsYmFjaywgZ2xzbFZlcnNpb24gfSA9IHRoaXM7XG5cdFx0XHQvLyBJbml0IGEgZGVmYXVsdCB2ZXJ0ZXggc2hhZGVyIHRoYXQganVzdCBwYXNzZXMgdGhyb3VnaCBzY3JlZW4gY29vcmRzLlxuXHRcdFx0Y29uc3QgdmVydGV4U2hhZGVyU291cmNlID0gZ2xzbFZlcnNpb24gPT09IEdMU0wzID8gcmVxdWlyZSgnLi9nbHNsXzMvRGVmYXVsdFZlcnRleFNoYWRlci5nbHNsJykgOiByZXF1aXJlKCcuL2dsc2xfMS9EZWZhdWx0VmVydGV4U2hhZGVyLmdsc2wnKTtcblx0XHRcdGNvbnN0IHNoYWRlciA9IGNvbXBpbGVTaGFkZXIoZ2wsIGVycm9yQ2FsbGJhY2ssIHZlcnRleFNoYWRlclNvdXJjZSwgZ2wuVkVSVEVYX1NIQURFUiwgbmFtZSk7XG5cdFx0XHRpZiAoIXNoYWRlcikge1xuXHRcdFx0XHRlcnJvckNhbGxiYWNrKGBVbmFibGUgdG8gY29tcGlsZSBkZWZhdWx0IHZlcnRleCBzaGFkZXIgZm9yIHByb2dyYW0gXCIke25hbWV9XCIuYCk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdEdQVVByb2dyYW0uZGVmYXVsdFZlcnRleFNoYWRlciA9IHNoYWRlcjtcblx0XHR9XG5cdFx0Y29uc3QgcHJvZ3JhbSA9IHRoaXMuaW5pdFByb2dyYW0oR1BVUHJvZ3JhbS5kZWZhdWx0VmVydGV4U2hhZGVyLCBERUZBVUxUX1BST0dSQU1fTkFNRSk7XG5cdFx0dGhpcy5fZGVmYXVsdFByb2dyYW0gPSBwcm9ncmFtO1xuXHRcdHJldHVybiB0aGlzLl9kZWZhdWx0UHJvZ3JhbTtcblx0fVxuXG5cdGdldCBzZWdtZW50UHJvZ3JhbSgpIHtcblx0XHRpZiAodGhpcy5fc2VnbWVudFByb2dyYW0pIHJldHVybiB0aGlzLl9zZWdtZW50UHJvZ3JhbTtcblx0XHRpZiAoR1BVUHJvZ3JhbS5zZWdtZW50VmVydGV4U2hhZGVyID09PSB1bmRlZmluZWQpIHtcblx0XHRcdGNvbnN0IHsgZ2wsIG5hbWUsIGVycm9yQ2FsbGJhY2ssIGdsc2xWZXJzaW9uIH0gPSB0aGlzO1xuXHRcdFx0Y29uc3QgdmVydGV4U2hhZGVyU291cmNlID0gZ2xzbFZlcnNpb24gPT09IEdMU0wzID8gcmVxdWlyZSgnLi9nbHNsXzMvU2VnbWVudFZlcnRleFNoYWRlci5nbHNsJykgOiByZXF1aXJlKCcuL2dsc2xfMS9TZWdtZW50VmVydGV4U2hhZGVyLmdsc2wnKTtcblx0XHRcdGNvbnN0IHNoYWRlciA9IGNvbXBpbGVTaGFkZXIoZ2wsIGVycm9yQ2FsbGJhY2ssIHZlcnRleFNoYWRlclNvdXJjZSwgZ2wuVkVSVEVYX1NIQURFUiwgbmFtZSk7XG5cdFx0XHRpZiAoIXNoYWRlcikge1xuXHRcdFx0XHRlcnJvckNhbGxiYWNrKGBVbmFibGUgdG8gY29tcGlsZSBzZWdtZW50IHZlcnRleCBzaGFkZXIgZm9yIHByb2dyYW0gXCIke25hbWV9XCIuYCk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdEdQVVByb2dyYW0uc2VnbWVudFZlcnRleFNoYWRlciA9IHNoYWRlcjtcblx0XHR9XG5cdFx0Y29uc3QgcHJvZ3JhbSA9IHRoaXMuaW5pdFByb2dyYW0oR1BVUHJvZ3JhbS5zZWdtZW50VmVydGV4U2hhZGVyLCBTRUdNRU5UX1BST0dSQU1fTkFNRSk7XG5cdFx0dGhpcy5fc2VnbWVudFByb2dyYW0gPSBwcm9ncmFtO1xuXHRcdHJldHVybiB0aGlzLl9zZWdtZW50UHJvZ3JhbTtcblx0fVxuXG5cdGdldCBwb2ludHNQcm9ncmFtKCkge1xuXHRcdGlmICh0aGlzLl9wb2ludHNQcm9ncmFtKSByZXR1cm4gdGhpcy5fcG9pbnRzUHJvZ3JhbTtcblx0XHRpZiAoR1BVUHJvZ3JhbS5wb2ludHNWZXJ0ZXhTaGFkZXIgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Y29uc3QgeyBnbCwgbmFtZSwgZXJyb3JDYWxsYmFjaywgZ2xzbFZlcnNpb24gfSA9IHRoaXM7XG5cdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRjb25zdCB2ZXJ0ZXhTaGFkZXJTb3VyY2UgPSBnbHNsVmVyc2lvbiA9PT0gR0xTTDMgPyBwb2ludHNWZXJ0ZXhTaGFkZXJTb3VyY2VfZ2xzbDMgOiByZXF1aXJlKCcuL2dsc2xfMS9Qb2ludHNWZXJ0ZXhTaGFkZXIuZ2xzbCcpO1xuXHRcdFx0aWYgKHZlcnRleFNoYWRlclNvdXJjZSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignTmVlZCB0byB3cml0ZSBnbHNsMyB2ZXJzaW9uIG9mIHBvaW50c1ZlcnRleFNoYWRlci4nKTtcblx0XHRcdH1cblx0XHRcdGNvbnN0IHNoYWRlciA9IGNvbXBpbGVTaGFkZXIoZ2wsIGVycm9yQ2FsbGJhY2ssIHZlcnRleFNoYWRlclNvdXJjZSwgZ2wuVkVSVEVYX1NIQURFUiwgbmFtZSk7XG5cdFx0XHRpZiAoIXNoYWRlcikge1xuXHRcdFx0XHRlcnJvckNhbGxiYWNrKGBVbmFibGUgdG8gY29tcGlsZSBwb2ludHMgdmVydGV4IHNoYWRlciBmb3IgcHJvZ3JhbSBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0R1BVUHJvZ3JhbS5wb2ludHNWZXJ0ZXhTaGFkZXIgPSBzaGFkZXI7XG5cdFx0fVxuXHRcdGNvbnN0IHByb2dyYW0gPSB0aGlzLmluaXRQcm9ncmFtKEdQVVByb2dyYW0ucG9pbnRzVmVydGV4U2hhZGVyLCBQT0lOVFNfUFJPR1JBTV9OQU1FKTtcblx0XHR0aGlzLl9wb2ludHNQcm9ncmFtID0gcHJvZ3JhbTtcblx0XHRyZXR1cm4gdGhpcy5fcG9pbnRzUHJvZ3JhbTtcblx0fVxuXG5cdGdldCB2ZWN0b3JGaWVsZFByb2dyYW0oKSB7XG5cdFx0aWYgKHRoaXMuX3ZlY3RvckZpZWxkUHJvZ3JhbSkgcmV0dXJuIHRoaXMuX3ZlY3RvckZpZWxkUHJvZ3JhbTtcblx0XHRpZiAoR1BVUHJvZ3JhbS52ZWN0b3JGaWVsZFZlcnRleFNoYWRlciA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRjb25zdCB7IGdsLCBuYW1lLCBlcnJvckNhbGxiYWNrLCBnbHNsVmVyc2lvbiB9ID0gdGhpcztcblx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdGNvbnN0IHZlcnRleFNoYWRlclNvdXJjZSA9IGdsc2xWZXJzaW9uID09PSBHTFNMMyA/IHZlY3RvckZpZWxkVmVydGV4U2hhZGVyU291cmNlX2dsc2wzIDogcmVxdWlyZSgnLi9nbHNsXzEvVmVjdG9yRmllbGRWZXJ0ZXhTaGFkZXIuZ2xzbCcpO1xuXHRcdFx0aWYgKHZlcnRleFNoYWRlclNvdXJjZSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignTmVlZCB0byB3cml0ZSBnbHNsMyB2ZXJzaW9uIG9mIHZlY3RvckZpZWxkVmVydGV4U2hhZGVyLicpO1xuXHRcdFx0fVxuXHRcdFx0Y29uc3Qgc2hhZGVyID0gY29tcGlsZVNoYWRlcihnbCwgZXJyb3JDYWxsYmFjaywgdmVydGV4U2hhZGVyU291cmNlLCBnbC5WRVJURVhfU0hBREVSLCBuYW1lKTtcblx0XHRcdGlmICghc2hhZGVyKSB7XG5cdFx0XHRcdGVycm9yQ2FsbGJhY2soYFVuYWJsZSB0byBjb21waWxlIHZlY3RvciBmaWVsZCB2ZXJ0ZXggc2hhZGVyIGZvciBwcm9ncmFtIFwiJHtuYW1lfVwiLmApO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRHUFVQcm9ncmFtLnZlY3RvckZpZWxkVmVydGV4U2hhZGVyID0gc2hhZGVyO1xuXHRcdH1cblx0XHRjb25zdCBwcm9ncmFtID0gdGhpcy5pbml0UHJvZ3JhbShHUFVQcm9ncmFtLnZlY3RvckZpZWxkVmVydGV4U2hhZGVyLCBWRUNUT1JfRklFTERfUFJPR1JBTV9OQU1FKTtcblx0XHR0aGlzLl92ZWN0b3JGaWVsZFByb2dyYW0gPSBwcm9ncmFtO1xuXHRcdHJldHVybiB0aGlzLl92ZWN0b3JGaWVsZFByb2dyYW07XG5cdH1cblxuXHRnZXQgaW5kZXhlZExpbmVzUHJvZ3JhbSgpIHtcblx0XHRpZiAodGhpcy5faW5kZXhlZExpbmVzUHJvZ3JhbSkgcmV0dXJuIHRoaXMuX2luZGV4ZWRMaW5lc1Byb2dyYW07XG5cdFx0aWYgKEdQVVByb2dyYW0uaW5kZXhlZExpbmVzVmVydGV4U2hhZGVyID09PSB1bmRlZmluZWQpIHtcblx0XHRcdGNvbnN0IHsgZ2wsIG5hbWUsIGVycm9yQ2FsbGJhY2ssIGdsc2xWZXJzaW9uIH0gPSB0aGlzO1xuXHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0Y29uc3QgdmVydGV4U2hhZGVyU291cmNlID0gZ2xzbFZlcnNpb24gPT09IEdMU0wzID8gaW5kZXhlZExpbmVzVmVydGV4U2hhZGVyU291cmNlX2dsc2wzIDogcmVxdWlyZSgnLi9nbHNsXzEvSW5kZXhlZExpbmVzVmVydGV4U2hhZGVyLmdsc2wnKTtcblx0XHRcdGlmICh2ZXJ0ZXhTaGFkZXJTb3VyY2UgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ05lZWQgdG8gd3JpdGUgZ2xzbDMgdmVyc2lvbiBvZiBpbmRleGVkTGluZXNWZXJ0ZXhTaGFkZXIuJyk7XG5cdFx0XHR9XG5cdFx0XHRjb25zdCBzaGFkZXIgPSBjb21waWxlU2hhZGVyKGdsLCBlcnJvckNhbGxiYWNrLCB2ZXJ0ZXhTaGFkZXJTb3VyY2UsIGdsLlZFUlRFWF9TSEFERVIsIG5hbWUpO1xuXHRcdFx0aWYgKCFzaGFkZXIpIHtcblx0XHRcdFx0ZXJyb3JDYWxsYmFjayhgVW5hYmxlIHRvIGNvbXBpbGUgdmVjdG9yIGZpZWxkIHZlcnRleCBzaGFkZXIgZm9yIHByb2dyYW0gXCIke25hbWV9XCIuYCk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdEdQVVByb2dyYW0uaW5kZXhlZExpbmVzVmVydGV4U2hhZGVyID0gc2hhZGVyO1xuXHRcdH1cblx0XHRjb25zdCBwcm9ncmFtID0gdGhpcy5pbml0UHJvZ3JhbShHUFVQcm9ncmFtLmluZGV4ZWRMaW5lc1ZlcnRleFNoYWRlciwgSU5ERVhFRF9MSU5FU19QUk9HUkFNX05BTUUpO1xuXHRcdHRoaXMuX2luZGV4ZWRMaW5lc1Byb2dyYW0gPSBwcm9ncmFtO1xuXHRcdHJldHVybiB0aGlzLl9pbmRleGVkTGluZXNQcm9ncmFtO1xuXHR9XG5cblx0Z2V0IHBvbHlsaW5lUHJvZ3JhbSgpIHtcblx0XHRpZiAodGhpcy5fcG9seWxpbmVQcm9ncmFtKSByZXR1cm4gdGhpcy5fcG9seWxpbmVQcm9ncmFtO1xuXHRcdGlmIChHUFVQcm9ncmFtLnBvbHlsaW5lVmVydGV4U2hhZGVyID09PSB1bmRlZmluZWQpIHtcblx0XHRcdGNvbnN0IHsgZ2wsIG5hbWUsIGVycm9yQ2FsbGJhY2ssIGdsc2xWZXJzaW9uIH0gPSB0aGlzO1xuXHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0Y29uc3QgdmVydGV4U2hhZGVyU291cmNlID0gZ2xzbFZlcnNpb24gPT09IEdMU0wzID8gcG9seWxpbmVWZXJ0ZXhTaGFkZXJTb3VyY2VfZ2xzbDMgOiByZXF1aXJlKCcuL2dsc2xfMS9Qb2x5bGluZVZlcnRleFNoYWRlci5nbHNsJyk7XG5cdFx0XHRpZiAodmVydGV4U2hhZGVyU291cmNlID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdOZWVkIHRvIHdyaXRlIGdsc2wzIHZlcnNpb24gb2YgcG9seWxpbmVWZXJ0ZXhTaGFkZXIuJyk7XG5cdFx0XHR9XG5cdFx0XHRjb25zdCBzaGFkZXIgPSBjb21waWxlU2hhZGVyKGdsLCBlcnJvckNhbGxiYWNrLCB2ZXJ0ZXhTaGFkZXJTb3VyY2UsIGdsLlZFUlRFWF9TSEFERVIsIG5hbWUpO1xuXHRcdFx0aWYgKCFzaGFkZXIpIHtcblx0XHRcdFx0ZXJyb3JDYWxsYmFjayhgVW5hYmxlIHRvIGNvbXBpbGUgdmVjdG9yIGZpZWxkIHZlcnRleCBzaGFkZXIgZm9yIHByb2dyYW0gXCIke25hbWV9XCIuYCk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdEdQVVByb2dyYW0ucG9seWxpbmVWZXJ0ZXhTaGFkZXIgPSBzaGFkZXI7XG5cdFx0fVxuXHRcdGNvbnN0IHByb2dyYW0gPSB0aGlzLmluaXRQcm9ncmFtKEdQVVByb2dyYW0ucG9seWxpbmVWZXJ0ZXhTaGFkZXIsIFBPTFlMSU5FX1BST0dSQU1fTkFNRSk7XG5cdFx0dGhpcy5fcG9seWxpbmVQcm9ncmFtID0gcHJvZ3JhbTtcblx0XHRyZXR1cm4gdGhpcy5fcG9seWxpbmVQcm9ncmFtO1xuXHR9XG5cblx0cHJpdmF0ZSBnZXQgYWN0aXZlUHJvZ3JhbXMoKSB7XG5cdFx0Y29uc3QgcHJvZ3JhbXMgPSBbXTtcblx0XHRpZiAodGhpcy5fZGVmYXVsdFByb2dyYW0pIHByb2dyYW1zLnB1c2goe1xuXHRcdFx0cHJvZ3JhbTogdGhpcy5fZGVmYXVsdFByb2dyYW0sXG5cdFx0XHRwcm9ncmFtTmFtZTogREVGQVVMVF9QUk9HUkFNX05BTUUsXG5cdFx0fSk7XG5cdFx0aWYgKHRoaXMuX3NlZ21lbnRQcm9ncmFtKSBwcm9ncmFtcy5wdXNoKHtcblx0XHRcdHByb2dyYW06IHRoaXMuX3NlZ21lbnRQcm9ncmFtLFxuXHRcdFx0cHJvZ3JhbU5hbWU6IFNFR01FTlRfUFJPR1JBTV9OQU1FLFxuXHRcdH0pO1xuXHRcdGlmICh0aGlzLl9wb2ludHNQcm9ncmFtKSBwcm9ncmFtcy5wdXNoKHtcblx0XHRcdHByb2dyYW06IHRoaXMuX3BvaW50c1Byb2dyYW0sXG5cdFx0XHRwcm9ncmFtTmFtZTogUE9JTlRTX1BST0dSQU1fTkFNRSxcblx0XHR9KTtcblx0XHRpZiAodGhpcy5fdmVjdG9yRmllbGRQcm9ncmFtKSBwcm9ncmFtcy5wdXNoKHtcblx0XHRcdHByb2dyYW06IHRoaXMuX3ZlY3RvckZpZWxkUHJvZ3JhbSxcblx0XHRcdHByb2dyYW1OYW1lOiBWRUNUT1JfRklFTERfUFJPR1JBTV9OQU1FLFxuXHRcdH0pO1xuXHRcdGlmICh0aGlzLl9pbmRleGVkTGluZXNQcm9ncmFtKSBwcm9ncmFtcy5wdXNoKHtcblx0XHRcdHByb2dyYW06IHRoaXMuX2luZGV4ZWRMaW5lc1Byb2dyYW0sXG5cdFx0XHRwcm9ncmFtTmFtZTogSU5ERVhFRF9MSU5FU19QUk9HUkFNX05BTUUsXG5cdFx0fSk7XG5cdFx0aWYgKHRoaXMuX3BvbHlsaW5lUHJvZ3JhbSkgcHJvZ3JhbXMucHVzaCh7XG5cdFx0XHRwcm9ncmFtOiB0aGlzLl9wb2x5bGluZVByb2dyYW0sXG5cdFx0XHRwcm9ncmFtTmFtZTogUE9MWUxJTkVfUFJPR1JBTV9OQU1FLFxuXHRcdH0pO1xuXHRcdHJldHVybiBwcm9ncmFtcztcblx0fVxuXG5cdHByaXZhdGUgdW5pZm9ybVR5cGVGb3JWYWx1ZShcblx0XHR2YWx1ZTogbnVtYmVyIHwgbnVtYmVyW10sXG5cdFx0ZGF0YVR5cGU6IFVuaWZvcm1EYXRhVHlwZSxcblx0KSB7XG5cdFx0aWYgKGRhdGFUeXBlID09PSBGTE9BVCkge1xuXHRcdFx0Ly8gQ2hlY2sgdGhhdCB3ZSBhcmUgZGVhbGluZyB3aXRoIGEgbnVtYmVyLlxuXHRcdFx0aWYgKGlzQXJyYXkodmFsdWUpKSB7XG5cdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgKHZhbHVlIGFzIG51bWJlcltdKS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdGlmICghaXNOdW1iZXIoKHZhbHVlIGFzIG51bWJlcltdKVtpXSkpIHtcblx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB1bmlmb3JtIHZhbHVlOiAke3ZhbHVlfSBmb3IgcHJvZ3JhbSBcIiR7dGhpcy5uYW1lfVwiLCBleHBlY3RlZCBmbG9hdCBvciBmbG9hdFtdIG9mIGxlbmd0aCAxLTQuYCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAoIWlzTnVtYmVyKHZhbHVlKSkge1xuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB1bmlmb3JtIHZhbHVlOiAke3ZhbHVlfSBmb3IgcHJvZ3JhbSBcIiR7dGhpcy5uYW1lfVwiLCBleHBlY3RlZCBmbG9hdCBvciBmbG9hdFtdIG9mIGxlbmd0aCAxLTQuYCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmICghaXNBcnJheSh2YWx1ZSkgfHwgKHZhbHVlIGFzIG51bWJlcltdKS5sZW5ndGggPT09IDEpIHtcblx0XHRcdFx0cmV0dXJuIEZMT0FUXzFEX1VOSUZPUk07XG5cdFx0XHR9XG5cdFx0XHRpZiAoKHZhbHVlIGFzIG51bWJlcltdKS5sZW5ndGggPT09IDIpIHtcblx0XHRcdFx0cmV0dXJuIEZMT0FUXzJEX1VOSUZPUk07XG5cdFx0XHR9XG5cdFx0XHRpZiAoKHZhbHVlIGFzIG51bWJlcltdKS5sZW5ndGggPT09IDMpIHtcblx0XHRcdFx0cmV0dXJuIEZMT0FUXzNEX1VOSUZPUk07XG5cdFx0XHR9XG5cdFx0XHRpZiAoKHZhbHVlIGFzIG51bWJlcltdKS5sZW5ndGggPT09IDQpIHtcblx0XHRcdFx0cmV0dXJuIEZMT0FUXzREX1VOSUZPUk07XG5cdFx0XHR9XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdW5pZm9ybSB2YWx1ZTogJHt2YWx1ZX0gZm9yIHByb2dyYW0gXCIke3RoaXMubmFtZX1cIiwgZXhwZWN0ZWQgZmxvYXQgb3IgZmxvYXRbXSBvZiBsZW5ndGggMS00LmApO1xuXHRcdH0gZWxzZSBpZiAoZGF0YVR5cGUgPT09IElOVCkge1xuXHRcdFx0Ly8gQ2hlY2sgdGhhdCB3ZSBhcmUgZGVhbGluZyB3aXRoIGFuIGludC5cblx0XHRcdGlmIChpc0FycmF5KHZhbHVlKSkge1xuXHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8ICh2YWx1ZSBhcyBudW1iZXJbXSkubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRpZiAoIWlzSW50ZWdlcigodmFsdWUgYXMgbnVtYmVyW10pW2ldKSkge1xuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHVuaWZvcm0gdmFsdWU6ICR7dmFsdWV9IGZvciBwcm9ncmFtIFwiJHt0aGlzLm5hbWV9XCIsIGV4cGVjdGVkIGludCBvciBpbnRbXSBvZiBsZW5ndGggMS00LmApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKCFpc0ludGVnZXIodmFsdWUpKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHVuaWZvcm0gdmFsdWU6ICR7dmFsdWV9IGZvciBwcm9ncmFtIFwiJHt0aGlzLm5hbWV9XCIsIGV4cGVjdGVkIGludCBvciBpbnRbXSBvZiBsZW5ndGggMS00LmApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAoIWlzQXJyYXkodmFsdWUpIHx8ICh2YWx1ZSBhcyBudW1iZXJbXSkubGVuZ3RoID09PSAxKSB7XG5cdFx0XHRcdHJldHVybiBJTlRfMURfVU5JRk9STTtcblx0XHRcdH1cblx0XHRcdGlmICgodmFsdWUgYXMgbnVtYmVyW10pLmxlbmd0aCA9PT0gMikge1xuXHRcdFx0XHRyZXR1cm4gSU5UXzJEX1VOSUZPUk07XG5cdFx0XHR9XG5cdFx0XHRpZiAoKHZhbHVlIGFzIG51bWJlcltdKS5sZW5ndGggPT09IDMpIHtcblx0XHRcdFx0cmV0dXJuIElOVF8zRF9VTklGT1JNO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCh2YWx1ZSBhcyBudW1iZXJbXSkubGVuZ3RoID09PSA0KSB7XG5cdFx0XHRcdHJldHVybiBJTlRfNERfVU5JRk9STTtcblx0XHRcdH1cblx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB1bmlmb3JtIHZhbHVlOiAke3ZhbHVlfSBmb3IgcHJvZ3JhbSBcIiR7dGhpcy5uYW1lfVwiLCBleHBlY3RlZCBpbnQgb3IgaW50W10gb2YgbGVuZ3RoIDEtNC5gKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHVuaWZvcm0gZGF0YSB0eXBlOiAke2RhdGFUeXBlfSBmb3IgcHJvZ3JhbSBcIiR7dGhpcy5uYW1lfVwiLCBleHBlY3RlZCAke0ZMT0FUfSBvciAke0lOVH0uYCk7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBzZXRQcm9ncmFtVW5pZm9ybShcblx0XHRwcm9ncmFtOiBXZWJHTFByb2dyYW0sXG5cdFx0cHJvZ3JhbU5hbWU6IHN0cmluZyxcblx0XHR1bmlmb3JtTmFtZTogc3RyaW5nLFxuXHRcdHZhbHVlOiBVbmlmb3JtVmFsdWVUeXBlLFxuXHRcdHR5cGU6IFVuaWZvcm1UeXBlLFxuXHQpIHtcblx0XHRjb25zdCB7IGdsLCB1bmlmb3JtcywgZXJyb3JDYWxsYmFjayB9ID0gdGhpcztcblx0XHQvLyBTZXQgYWN0aXZlIHByb2dyYW0uXG5cdFx0Z2wudXNlUHJvZ3JhbShwcm9ncmFtKTtcblxuXHRcdGxldCBsb2NhdGlvbiA9IHVuaWZvcm1zW3VuaWZvcm1OYW1lXT8ubG9jYXRpb25bcHJvZ3JhbU5hbWVdO1xuXHRcdC8vIEluaXQgYSBsb2NhdGlvbiBmb3IgV2ViR0xQcm9ncmFtIGlmIG5lZWRlZC5cblx0XHRpZiAobG9jYXRpb24gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Y29uc3QgX2xvY2F0aW9uID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW0sIHVuaWZvcm1OYW1lKTtcblx0XHRcdGlmICghX2xvY2F0aW9uKSB7XG5cdFx0XHRcdGVycm9yQ2FsbGJhY2soYENvdWxkIG5vdCBpbml0IHVuaWZvcm0gXCIke3VuaWZvcm1OYW1lfVwiIGZvciBwcm9ncmFtIFwiJHt0aGlzLm5hbWV9XCIuXG5DaGVjayB0aGF0IHVuaWZvcm0gaXMgcHJlc2VudCBpbiBzaGFkZXIgY29kZSwgdW51c2VkIHVuaWZvcm1zIG1heSBiZSByZW1vdmVkIGJ5IGNvbXBpbGVyLlxuQWxzbyBjaGVjayB0aGF0IHVuaWZvcm0gdHlwZSBpbiBzaGFkZXIgY29kZSBtYXRjaGVzIHR5cGUgJHt0eXBlfS5cbkVycm9yIGNvZGU6ICR7Z2wuZ2V0RXJyb3IoKX0uYCk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGxvY2F0aW9uID0gX2xvY2F0aW9uO1xuXHRcdFx0Ly8gU2F2ZSBsb2NhdGlvbiBmb3IgZnV0dXJlIHVzZS5cblx0XHRcdGlmICh1bmlmb3Jtc1t1bmlmb3JtTmFtZV0pIHtcblx0XHRcdFx0dW5pZm9ybXNbdW5pZm9ybU5hbWVdLmxvY2F0aW9uW3Byb2dyYW1OYW1lXSA9IGxvY2F0aW9uO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIFNldCB1bmlmb3JtLlxuXHRcdC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9XZWJHTFJlbmRlcmluZ0NvbnRleHQvdW5pZm9ybVxuXHRcdHN3aXRjaCAodHlwZSkge1xuXHRcdFx0Y2FzZSBGTE9BVF8xRF9VTklGT1JNOlxuXHRcdFx0XHRnbC51bmlmb3JtMWYobG9jYXRpb24sIHZhbHVlIGFzIG51bWJlcik7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBGTE9BVF8yRF9VTklGT1JNOlxuXHRcdFx0XHRnbC51bmlmb3JtMmZ2KGxvY2F0aW9uLCB2YWx1ZSBhcyBudW1iZXJbXSk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBGTE9BVF8zRF9VTklGT1JNOlxuXHRcdFx0XHRnbC51bmlmb3JtM2Z2KGxvY2F0aW9uLCB2YWx1ZSBhcyBudW1iZXJbXSk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBGTE9BVF80RF9VTklGT1JNOlxuXHRcdFx0XHRnbC51bmlmb3JtNGZ2KGxvY2F0aW9uLCB2YWx1ZSBhcyBudW1iZXJbXSk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBJTlRfMURfVU5JRk9STTpcblx0XHRcdFx0Z2wudW5pZm9ybTFpKGxvY2F0aW9uLCB2YWx1ZSBhcyBudW1iZXIpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgSU5UXzJEX1VOSUZPUk06XG5cdFx0XHRcdGdsLnVuaWZvcm0yaXYobG9jYXRpb24sIHZhbHVlIGFzIG51bWJlcltdKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIElOVF8zRF9VTklGT1JNOlxuXHRcdFx0XHRnbC51bmlmb3JtM2l2KGxvY2F0aW9uLCB2YWx1ZSBhcyBudW1iZXJbXSk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBJTlRfNERfVU5JRk9STTpcblx0XHRcdFx0Z2wudW5pZm9ybTRpdihsb2NhdGlvbiwgdmFsdWUgYXMgbnVtYmVyW10pO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5rbm93biB1bmlmb3JtIHR5cGUgJHt0eXBlfSBmb3IgR1BVUHJvZ3JhbSBcIiR7dGhpcy5uYW1lfVwiLmApO1xuXHRcdH1cblx0fVxuXG5cdHNldFVuaWZvcm0oXG5cdFx0dW5pZm9ybU5hbWU6IHN0cmluZyxcblx0XHR2YWx1ZTogVW5pZm9ybVZhbHVlVHlwZSxcblx0XHRkYXRhVHlwZT86IFVuaWZvcm1EYXRhVHlwZSxcblx0KSB7XG5cdFx0Y29uc3QgeyBhY3RpdmVQcm9ncmFtcywgdW5pZm9ybXMgfSA9IHRoaXM7XG5cblx0XHRsZXQgdHlwZSA9IHVuaWZvcm1zW3VuaWZvcm1OYW1lXT8udHlwZTtcblx0XHRpZiAoZGF0YVR5cGUpIHtcblx0XHRcdGNvbnN0IHR5cGVQYXJhbSA9IHRoaXMudW5pZm9ybVR5cGVGb3JWYWx1ZSh2YWx1ZSwgZGF0YVR5cGUpO1xuXHRcdFx0aWYgKHR5cGUgPT09IHVuZGVmaW5lZCkgdHlwZSA9IHR5cGVQYXJhbTtcblx0XHRcdGVsc2Uge1xuXHRcdFx0XHQvLyBjb25zb2xlLndhcm4oYERvbid0IG5lZWQgdG8gcGFzcyBpbiBkYXRhVHlwZSB0byBHUFVQcm9ncmFtLnNldFVuaWZvcm0gZm9yIHByZXZpb3VzbHkgaW5pdGVkIHVuaWZvcm0gXCIke3VuaWZvcm1OYW1lfVwiYCk7XG5cdFx0XHRcdC8vIENoZWNrIHRoYXQgdHlwZXMgbWF0Y2ggcHJldmlvdXNseSBzZXQgdW5pZm9ybS5cblx0XHRcdFx0aWYgKHR5cGUgIT09IHR5cGVQYXJhbSkge1xuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5pZm9ybSBcIiR7dW5pZm9ybU5hbWV9XCIgZm9yIEdQVVByb2dyYW0gXCIke3RoaXMubmFtZX1cIiBjYW5ub3QgY2hhbmdlIGZyb20gdHlwZSAke3R5cGV9IHRvIHR5cGUgJHt0eXBlUGFyYW19LmApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmICh0eXBlID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5rbm93biB0eXBlIGZvciB1bmlmb3JtIFwiJHt1bmlmb3JtTmFtZX1cIiwgcGxlYXNlIHBhc3MgaW4gZGF0YVR5cGUgdG8gR1BVUHJvZ3JhbS5zZXRVbmlmb3JtIHdoZW4gaW5pdGluZyBhIG5ldyB1bmlmb3JtLmApO1xuXHRcdH1cblxuXHRcdGlmICghdW5pZm9ybXNbdW5pZm9ybU5hbWVdKSB7XG5cdFx0XHQvLyBJbml0IHVuaWZvcm0gaWYgbmVlZGVkLlxuXHRcdFx0dW5pZm9ybXNbdW5pZm9ybU5hbWVdID0geyB0eXBlLCBsb2NhdGlvbjoge30sIHZhbHVlIH07XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIFVwZGF0ZSB2YWx1ZS5cblx0XHRcdHVuaWZvcm1zW3VuaWZvcm1OYW1lXS52YWx1ZSA9IHZhbHVlO1xuXHRcdH1cblxuXHRcdC8vIFVwZGF0ZSBhbnkgYWN0aXZlIHByb2dyYW1zLlxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYWN0aXZlUHJvZ3JhbXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGNvbnN0IHsgcHJvZ3JhbSwgcHJvZ3JhbU5hbWUgfSA9IGFjdGl2ZVByb2dyYW1zW2ldO1xuXHRcdFx0dGhpcy5zZXRQcm9ncmFtVW5pZm9ybShwcm9ncmFtLCBwcm9ncmFtTmFtZSwgdW5pZm9ybU5hbWUsIHZhbHVlLCB0eXBlKTtcblx0XHR9XG5cdH07XG5cblx0c2V0VmVydGV4VW5pZm9ybShcblx0XHRwcm9ncmFtOiBXZWJHTFByb2dyYW0sXG5cdFx0dW5pZm9ybU5hbWU6IHN0cmluZyxcblx0XHR2YWx1ZTogVW5pZm9ybVZhbHVlVHlwZSxcblx0XHRkYXRhVHlwZTogVW5pZm9ybURhdGFUeXBlLFxuXHQpIHtcblx0XHRjb25zdCB0eXBlID0gdGhpcy51bmlmb3JtVHlwZUZvclZhbHVlKHZhbHVlLCBkYXRhVHlwZSk7XG5cdFx0aWYgKHByb2dyYW0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdNdXN0IHBhc3MgaW4gdmFsaWQgV2ViR0xQcm9ncmFtIHRvIHNldFZlcnRleFVuaWZvcm0sIGdvdCB1bmRlZmluZWQuJyk7XG5cdFx0fVxuXHRcdGxldCBwcm9ncmFtTmFtZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXHRcdHN3aXRjaChwcm9ncmFtKSB7XG5cdFx0XHRjYXNlIHRoaXMuX2RlZmF1bHRQcm9ncmFtOlxuXHRcdFx0XHRwcm9ncmFtTmFtZSA9IERFRkFVTFRfUFJPR1JBTV9OQU1FO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgdGhpcy5fc2VnbWVudFByb2dyYW06XG5cdFx0XHRcdHByb2dyYW1OYW1lID0gU0VHTUVOVF9QUk9HUkFNX05BTUU7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSB0aGlzLl9wb2ludHNQcm9ncmFtOlxuXHRcdFx0XHRwcm9ncmFtTmFtZSA9IFBPSU5UU19QUk9HUkFNX05BTUU7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSB0aGlzLl92ZWN0b3JGaWVsZFByb2dyYW06XG5cdFx0XHRcdHByb2dyYW1OYW1lID0gVkVDVE9SX0ZJRUxEX1BST0dSQU1fTkFNRTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIHRoaXMuX2luZGV4ZWRMaW5lc1Byb2dyYW06XG5cdFx0XHRcdHByb2dyYW1OYW1lID0gSU5ERVhFRF9MSU5FU19QUk9HUkFNX05BTUU7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSB0aGlzLl9wb2x5bGluZVByb2dyYW06XG5cdFx0XHRcdHByb2dyYW1OYW1lID0gUE9MWUxJTkVfUFJPR1JBTV9OQU1FO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgdmFsaWQgdmVydGV4IHByb2dyYW1OYW1lIGZvciBXZWJHTFByb2dyYW0gXCIke3RoaXMubmFtZX1cIi5gKTtcblx0XHR9XG5cdFx0dGhpcy5zZXRQcm9ncmFtVW5pZm9ybShwcm9ncmFtLCBwcm9ncmFtTmFtZSwgdW5pZm9ybU5hbWUsIHZhbHVlLCB0eXBlKTtcblx0fVxuXG5cdGRlc3Ryb3koKSB7XG5cdFx0Y29uc3QgeyBnbCwgZnJhZ21lbnRTaGFkZXIsIGFjdGl2ZVByb2dyYW1zIH0gPSB0aGlzO1xuXHRcdC8vIFVuYmluZCBhbGwgZ2wgZGF0YSBiZWZvcmUgZGVsZXRpbmcuXG5cdFx0YWN0aXZlUHJvZ3JhbXMuZm9yRWFjaCgoeyBwcm9ncmFtIH0pID0+IHtcblx0XHRcdGdsLmRlbGV0ZVByb2dyYW0ocHJvZ3JhbSk7XG5cdFx0fSk7XG5cdFx0Ly8gRnJvbSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvV2ViR0xSZW5kZXJpbmdDb250ZXh0L2RlbGV0ZVNoYWRlclxuXHRcdC8vIFRoaXMgbWV0aG9kIGhhcyBubyBlZmZlY3QgaWYgdGhlIHNoYWRlciBoYXMgYWxyZWFkeSBiZWVuIGRlbGV0ZWRcblx0XHRnbC5kZWxldGVTaGFkZXIoZnJhZ21lbnRTaGFkZXIpO1xuXG5cdFx0ZGVsZXRlIHRoaXMuX2RlZmF1bHRQcm9ncmFtO1xuXHRcdGRlbGV0ZSB0aGlzLl9zZWdtZW50UHJvZ3JhbTtcblx0XHRkZWxldGUgdGhpcy5fcG9pbnRzUHJvZ3JhbTtcblx0XHRkZWxldGUgdGhpcy5fdmVjdG9yRmllbGRQcm9ncmFtO1xuXHRcdGRlbGV0ZSB0aGlzLl9pbmRleGVkTGluZXNQcm9ncmFtO1xuXHRcdGRlbGV0ZSB0aGlzLl9wb2x5bGluZVByb2dyYW07XG5cdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdGRlbGV0ZSB0aGlzLmZyYWdtZW50U2hhZGVyO1xuXG5cdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdGRlbGV0ZSB0aGlzLmdsO1xuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHRkZWxldGUgdGhpcy5lcnJvckNhbGxiYWNrO1xuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHRkZWxldGUgdGhpcy5wcm9ncmFtO1xuXHR9XG59XG4iLCJpbXBvcnQgeyBzYXZlQXMgfSBmcm9tICdmaWxlLXNhdmVyJztcbi8vIEB0cy1pZ25vcmVcbmltcG9ydCB7IGNoYW5nZURwaUJsb2IgfSBmcm9tICdjaGFuZ2VkcGknO1xuaW1wb3J0IHsgRGF0YUxheWVyIH0gZnJvbSAnLi9EYXRhTGF5ZXInO1xuaW1wb3J0IHtcblx0RGF0YUxheWVyQXJyYXlUeXBlLCBEYXRhTGF5ZXJGaWx0ZXJUeXBlLCBEYXRhTGF5ZXJOdW1Db21wb25lbnRzLCBEYXRhTGF5ZXJUeXBlLCBEYXRhTGF5ZXJXcmFwVHlwZSxcblx0RkxPQVQsIEhBTEZfRkxPQVQsIFVOU0lHTkVEX0JZVEUsIEJZVEUsIFVOU0lHTkVEX1NIT1JULCBTSE9SVCwgVU5TSUdORURfSU5ULCBJTlQsXG5cdFVuaWZvcm1EYXRhVHlwZSwgVW5pZm9ybVZhbHVlVHlwZSwgR0xTTFZlcnNpb24sIEdMU0wxLCBHTFNMMywgQ0xBTVBfVE9fRURHRSwgVGV4dHVyZUZvcm1hdFR5cGUsIE5FQVJFU1QsIFJHQkEsIFRleHR1cmVEYXRhVHlwZSxcbn0gZnJvbSAnLi9Db25zdGFudHMnO1xuaW1wb3J0IHsgR1BVUHJvZ3JhbSB9IGZyb20gJy4vR1BVUHJvZ3JhbSc7XG5pbXBvcnQgeyBXZWJHTFJlbmRlcmVyLCBUZXh0dXJlLCBWZWN0b3I0IH0gZnJvbSAndGhyZWUnOy8vIEp1c3QgaW1wb3J0aW5nIHRoZSB0eXBlcyBoZXJlLlxuaW1wb3J0ICogYXMgdXRpbHMgZnJvbSAnLi91dGlscy9WZWN0b3I0JztcbmltcG9ydCB7IGlzV2ViR0wyLCBpc1Bvd2VyT2YyIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBnZXRGbG9hdDE2IH0gZnJvbSAnQHBldGFtb3Jpa2VuL2Zsb2F0MTYnO1xuaW1wb3J0IHtcblx0aXNBcnJheSxcblx0aXNTdHJpbmcsIGlzVmFsaWRGaWx0ZXJUeXBlLCBpc1ZhbGlkVGV4dHVyZURhdGFUeXBlLCBpc1ZhbGlkVGV4dHVyZUZvcm1hdFR5cGUsIGlzVmFsaWRXcmFwVHlwZSxcblx0dmFsaWRGaWx0ZXJUeXBlcywgdmFsaWRUZXh0dXJlRGF0YVR5cGVzLCB2YWxpZFRleHR1cmVGb3JtYXRUeXBlcywgdmFsaWRXcmFwVHlwZXMgfSBmcm9tICcuL0NoZWNrcyc7XG5cbmNvbnN0IERFRkFVTFRfQ0lSQ0xFX05VTV9TRUdNRU5UUyA9IDE4Oy8vIE11c3QgYmUgZGl2aXNpYmxlIGJ5IDYgdG8gd29yayB3aXRoIHN0ZXBTZWdtZW50KCkuXG5cbnR5cGUgRXJyb3JDYWxsYmFjayA9IChtZXNzYWdlOiBzdHJpbmcpID0+IHZvaWQ7XG5cbmV4cG9ydCBjbGFzcyBXZWJHTENvbXB1dGUge1xuXHRyZWFkb25seSBnbCE6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCB8IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQ7XG5cdHJlYWRvbmx5IGdsc2xWZXJzaW9uITogR0xTTFZlcnNpb247XG5cdC8vIFRoZXNlIHdpZHRoIGFuZCBoZWlnaHQgYXJlIHRoZSBjdXJyZW50IGNhbnZhcyBhdCBmdWxsIHJlcy5cblx0cHJpdmF0ZSB3aWR0aCE6IG51bWJlcjtcblx0cHJpdmF0ZSBoZWlnaHQhOiBudW1iZXI7XG5cblx0cHJpdmF0ZSBlcnJvclN0YXRlID0gZmFsc2U7XG5cdHByaXZhdGUgcmVhZG9ubHkgZXJyb3JDYWxsYmFjazogRXJyb3JDYWxsYmFjaztcblxuXHQvLyBTYXZlIHRocmVlanMgcmVuZGVyZXIgaWYgcGFzc2VkIGluLlxuXHRwcml2YXRlIHJlbmRlcmVyPzogV2ViR0xSZW5kZXJlcjtcblx0cHJpdmF0ZSByZWFkb25seSBtYXhOdW1UZXh0dXJlcyE6IG51bWJlcjtcblx0XG5cdC8vIFByZWNvbXB1dGVkIGJ1ZmZlcnMgKGluaXRlZCBhcyBuZWVkZWQpLlxuXHRwcml2YXRlIF9xdWFkUG9zaXRpb25zQnVmZmVyPzogV2ViR0xCdWZmZXI7XG5cdHByaXZhdGUgX2JvdW5kYXJ5UG9zaXRpb25zQnVmZmVyPzogV2ViR0xCdWZmZXI7XG5cdC8vIFN0b3JlIG11bHRpcGxlIGNpcmNsZSBwb3NpdGlvbnMgYnVmZmVycyBmb3IgdmFyaW91cyBudW0gc2VnbWVudHMsIHVzZSBudW1TZWdtZW50cyBhcyBrZXkuXG5cdHByaXZhdGUgX2NpcmNsZVBvc2l0aW9uc0J1ZmZlcjogeyBba2V5OiBudW1iZXJdOiBXZWJHTEJ1ZmZlciB9ID0ge307XG5cblx0cHJpdmF0ZSBwb2ludEluZGV4QXJyYXk/OiBGbG9hdDMyQXJyYXk7XG5cdHByaXZhdGUgcG9pbnRJbmRleEJ1ZmZlcj86IFdlYkdMQnVmZmVyO1xuXHRwcml2YXRlIHZlY3RvckZpZWxkSW5kZXhBcnJheT86IEZsb2F0MzJBcnJheTtcblx0cHJpdmF0ZSB2ZWN0b3JGaWVsZEluZGV4QnVmZmVyPzogV2ViR0xCdWZmZXI7XG5cdHByaXZhdGUgaW5kZXhlZExpbmVzSW5kZXhCdWZmZXI/OiBXZWJHTEJ1ZmZlcjtcblxuXHQvLyBQcm9ncmFtcyBmb3IgY29weWluZyBkYXRhICh0aGVzZSBhcmUgbmVlZGVkIGZvciByZW5kZXJpbmcgcGFydGlhbCBzY3JlZW4gZ2VvbWV0cmllcykuXG5cdHByaXZhdGUgcmVhZG9ubHkgY29weUZsb2F0UHJvZ3JhbSE6IEdQVVByb2dyYW07XG5cdHByaXZhdGUgcmVhZG9ubHkgY29weUludFByb2dyYW0hOiBHUFVQcm9ncmFtO1xuXHRwcml2YXRlIHJlYWRvbmx5IGNvcHlVaW50UHJvZ3JhbSE6IEdQVVByb2dyYW07XG5cblx0Ly8gT3RoZXIgdXRpbCBwcm9ncmFtcy5cblx0cHJpdmF0ZSBfc2luZ2xlQ29sb3JQcm9ncmFtPzogR1BVUHJvZ3JhbTtcblx0cHJpdmF0ZSBfc2luZ2xlQ29sb3JXaXRoV3JhcENoZWNrUHJvZ3JhbT86IEdQVVByb2dyYW07XG5cblx0c3RhdGljIGluaXRXaXRoVGhyZWVSZW5kZXJlcihcblx0XHRyZW5kZXJlcjogV2ViR0xSZW5kZXJlcixcblx0XHRwYXJhbXM6IHtcblx0XHRcdGdsc2xWZXJzaW9uPzogR0xTTFZlcnNpb24sXG5cdFx0fSxcblx0XHRlcnJvckNhbGxiYWNrPzogRXJyb3JDYWxsYmFjayxcblx0KSB7XG5cdFx0cmV0dXJuIG5ldyBXZWJHTENvbXB1dGUoXG5cdFx0XHR7XG5cdFx0XHRcdGNhbnZhczogcmVuZGVyZXIuZG9tRWxlbWVudCxcblx0XHRcdFx0Y29udGV4dDogcmVuZGVyZXIuZ2V0Q29udGV4dCgpLFxuXHRcdFx0XHQuLi5wYXJhbXMsXG5cdFx0XHR9LFxuXHRcdFx0ZXJyb3JDYWxsYmFjayxcblx0XHRcdHJlbmRlcmVyLFxuXHRcdCk7XG5cdH1cblxuXHRjb25zdHJ1Y3Rvcihcblx0XHRwYXJhbXM6IHtcblx0XHRcdGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQsXG5cdFx0XHRjb250ZXh0PzogV2ViR0xSZW5kZXJpbmdDb250ZXh0IHwgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCB8IG51bGwsXG5cdFx0XHRhbnRpYWxpYXM/OiBib29sZWFuLFxuXHRcdFx0Z2xzbFZlcnNpb24/OiBHTFNMVmVyc2lvbixcblx0XHR9LFxuXHRcdC8vIE9wdGlvbmFsbHkgcGFzcyBpbiBhbiBlcnJvciBjYWxsYmFjayBpbiBjYXNlIHdlIHdhbnQgdG8gaGFuZGxlIGVycm9ycyByZWxhdGVkIHRvIHdlYmdsIHN1cHBvcnQuXG5cdFx0Ly8gZS5nLiB0aHJvdyB1cCBhIG1vZGFsIHRlbGxpbmcgdXNlciB0aGlzIHdpbGwgbm90IHdvcmsgb24gdGhlaXIgZGV2aWNlLlxuXHRcdGVycm9yQ2FsbGJhY2s6IEVycm9yQ2FsbGJhY2sgPSAobWVzc2FnZTogc3RyaW5nKSA9PiB7IHRocm93IG5ldyBFcnJvcihtZXNzYWdlKSB9LFxuXHRcdHJlbmRlcmVyPzogV2ViR0xSZW5kZXJlcixcblx0KSB7XG5cdFx0Ly8gQ2hlY2sgcGFyYW1zLlxuXHRcdGNvbnN0IHZhbGlkS2V5cyA9IFsnY2FudmFzJywgJ2NvbnRleHQnLCAnYW50aWFsaWFzJywgJ2dsc2xWZXJzaW9uJ107XG5cdFx0T2JqZWN0LmtleXMocGFyYW1zKS5mb3JFYWNoKGtleSA9PiB7XG5cdFx0XHRpZiAodmFsaWRLZXlzLmluZGV4T2Yoa2V5KSA8IDApIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGtleSAke2tleX0gcGFzc2VkIHRvIFdlYkdMQ29tcHV0ZS5jb25zdHJ1Y3Rvci4gIFZhbGlkIGtleXMgYXJlICR7dmFsaWRLZXlzLmpvaW4oJywgJyl9LmApO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdC8vIFNhdmUgY2FsbGJhY2sgaW4gY2FzZSB3ZSBydW4gaW50byBhbiBlcnJvci5cblx0XHRjb25zdCBzZWxmID0gdGhpcztcblx0XHR0aGlzLmVycm9yQ2FsbGJhY2sgPSAobWVzc2FnZTogc3RyaW5nKSA9PiB7XG5cdFx0XHRpZiAoc2VsZi5lcnJvclN0YXRlKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdHNlbGYuZXJyb3JTdGF0ZSA9IHRydWU7XG5cdFx0XHRlcnJvckNhbGxiYWNrKG1lc3NhZ2UpO1xuXHRcdH1cblxuXHRcdGNvbnN0IHsgY2FudmFzIH0gPSBwYXJhbXM7XG5cdFx0bGV0IGdsID0gcGFyYW1zLmNvbnRleHQ7XG5cblx0XHQvLyBJbml0IEdMLlxuXHRcdGlmICghZ2wpIHtcblx0XHRcdGNvbnN0IG9wdGlvbnM6IGFueSA9IHt9O1xuXHRcdFx0aWYgKHBhcmFtcy5hbnRpYWxpYXMgIT09IHVuZGVmaW5lZCkgb3B0aW9ucy5hbnRpYWxpYXMgPSBwYXJhbXMuYW50aWFsaWFzO1xuXHRcdFx0Ly8gSW5pdCBhIGdsIGNvbnRleHQgaWYgbm90IHBhc3NlZCBpbi5cblx0XHRcdGdsID0gY2FudmFzLmdldENvbnRleHQoJ3dlYmdsMicsIG9wdGlvbnMpICBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0IHwgbnVsbFxuXHRcdFx0XHR8fCBjYW52YXMuZ2V0Q29udGV4dCgnd2ViZ2wnLCBvcHRpb25zKSAgYXMgV2ViR0xSZW5kZXJpbmdDb250ZXh0IHwgbnVsbFxuXHRcdFx0XHR8fCBjYW52YXMuZ2V0Q29udGV4dCgnZXhwZXJpbWVudGFsLXdlYmdsJywgb3B0aW9ucykgIGFzIFdlYkdMUmVuZGVyaW5nQ29udGV4dCB8IG51bGw7XG5cdFx0XHRpZiAoZ2wgPT09IG51bGwpIHtcblx0XHRcdFx0dGhpcy5lcnJvckNhbGxiYWNrKCdVbmFibGUgdG8gaW5pdGlhbGl6ZSBXZWJHTCBjb250ZXh0LicpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmIChpc1dlYkdMMihnbCkpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdVc2luZyBXZWJHTCAyLjAgY29udGV4dC4nKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc29sZS5sb2coJ1VzaW5nIFdlYkdMIDEuMCBjb250ZXh0LicpO1xuXHRcdH1cblx0XHR0aGlzLmdsID0gZ2w7XG5cdFx0dGhpcy5yZW5kZXJlciA9IHJlbmRlcmVyO1xuXG5cdFx0Ly8gU2F2ZSBnbHNsIHZlcnNpb24sIGRlZmF1bHQgdG8gMS54LlxuXHRcdGNvbnN0IGdsc2xWZXJzaW9uID0gcGFyYW1zLmdsc2xWZXJzaW9uID09PSB1bmRlZmluZWQgPyBHTFNMMSA6IHBhcmFtcy5nbHNsVmVyc2lvbjtcblx0XHR0aGlzLmdsc2xWZXJzaW9uID0gZ2xzbFZlcnNpb247XG5cdFx0aWYgKCFpc1dlYkdMMihnbCkgJiYgZ2xzbFZlcnNpb24gPT09IEdMU0wzKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oJ0dMU0wzLnggaXMgaW5jb21wYXRpYmxlIHdpdGggV2ViR0wxLjAgY29udGV4dHMuJyk7XG5cdFx0fVxuXG5cdFx0Ly8gR0wgc2V0dXAuXG5cdFx0Ly8gRGlzYWJsZSBkZXB0aCB0ZXN0aW5nIGdsb2JhbGx5LlxuXHRcdGdsLmRpc2FibGUoZ2wuREVQVEhfVEVTVCk7XG5cdFx0Ly8gU2V0IHVucGFjayBhbGlnbm1lbnQgdG8gMSBzbyB3ZSBjYW4gaGF2ZSB0ZXh0dXJlcyBvZiBhcmJpdHJhcnkgZGltZW5zaW9ucy5cblx0XHQvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81MTU4MjI4Mi9lcnJvci13aGVuLWNyZWF0aW5nLXRleHR1cmVzLWluLXdlYmdsLXdpdGgtdGhlLXJnYi1mb3JtYXRcblx0XHRnbC5waXhlbFN0b3JlaShnbC5VTlBBQ0tfQUxJR05NRU5ULCAxKTtcblx0XHQvLyBUT0RPOiBsb29rIGludG8gbW9yZSBvZiB0aGVzZTogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1dlYkdMUmVuZGVyaW5nQ29udGV4dC9waXhlbFN0b3JlaVxuXHRcdC8vIC8vIFNvbWUgaW1wbGVtZW50YXRpb25zIG9mIEhUTUxDYW52YXNFbGVtZW50J3Mgb3IgT2Zmc2NyZWVuQ2FudmFzJ3MgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIHN0b3JlIGNvbG9yIHZhbHVlc1xuXHRcdC8vIC8vIGludGVybmFsbHkgaW4gcHJlbXVsdGlwbGllZCBmb3JtLiBJZiBzdWNoIGEgY2FudmFzIGlzIHVwbG9hZGVkIHRvIGEgV2ViR0wgdGV4dHVyZSB3aXRoIHRoZVxuXHRcdC8vIC8vIFVOUEFDS19QUkVNVUxUSVBMWV9BTFBIQV9XRUJHTCBwaXhlbCBzdG9yYWdlIHBhcmFtZXRlciBzZXQgdG8gZmFsc2UsIHRoZSBjb2xvciBjaGFubmVscyB3aWxsIGhhdmUgdG8gYmUgdW4tbXVsdGlwbGllZFxuXHRcdC8vIC8vIGJ5IHRoZSBhbHBoYSBjaGFubmVsLCB3aGljaCBpcyBhIGxvc3N5IG9wZXJhdGlvbi4gVGhlIFdlYkdMIGltcGxlbWVudGF0aW9uIHRoZXJlZm9yZSBjYW4gbm90IGd1YXJhbnRlZSB0aGF0IGNvbG9yc1xuXHRcdC8vIC8vIHdpdGggYWxwaGEgPCAxLjAgd2lsbCBiZSBwcmVzZXJ2ZWQgbG9zc2xlc3NseSB3aGVuIGZpcnN0IGRyYXduIHRvIGEgY2FudmFzIHZpYSBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgYW5kIHRoZW5cblx0XHQvLyAvLyB1cGxvYWRlZCB0byBhIFdlYkdMIHRleHR1cmUgd2hlbiB0aGUgVU5QQUNLX1BSRU1VTFRJUExZX0FMUEhBX1dFQkdMIHBpeGVsIHN0b3JhZ2UgcGFyYW1ldGVyIGlzIHNldCB0byBmYWxzZS5cblx0XHQvLyBnbC5waXhlbFN0b3JlaShnbC5VTlBBQ0tfUFJFTVVMVElQTFlfQUxQSEFfV0VCR0wsIHRydWUpO1xuXG5cdFx0Ly8gSW5pdCBwcm9ncmFtcyB0byBwYXNzIHZhbHVlcyBmcm9tIG9uZSB0ZXh0dXJlIHRvIGFub3RoZXIuXG5cdFx0dGhpcy5jb3B5RmxvYXRQcm9ncmFtID0gdGhpcy5pbml0UHJvZ3JhbSh7XG5cdFx0XHRuYW1lOiAnY29weUZsb2F0Jyxcblx0XHRcdGZyYWdtZW50U2hhZGVyOiBnbHNsVmVyc2lvbiA9PT0gR0xTTDMgPyByZXF1aXJlKCcuL2dsc2xfMy9Db3B5RmxvYXRGcmFnU2hhZGVyLmdsc2wnKSA6IHJlcXVpcmUoJy4vZ2xzbF8xL0NvcHlGcmFnU2hhZGVyLmdsc2wnKSxcblx0XHRcdHVuaWZvcm1zOiBbXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0bmFtZTogJ3Vfc3RhdGUnLFxuXHRcdFx0XHRcdFx0dmFsdWU6IDAsXG5cdFx0XHRcdFx0XHRkYXRhVHlwZTogSU5ULFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdF0sXG5cdFx0XHR9LFxuXHRcdCk7XG5cdFx0aWYgKGdsc2xWZXJzaW9uID09PSBHTFNMMykge1xuXHRcdFx0dGhpcy5jb3B5SW50UHJvZ3JhbSA9IHRoaXMuaW5pdFByb2dyYW0oe1xuXHRcdFx0XHRuYW1lOiAnY29weUludCcsXG5cdFx0XHRcdGZyYWdtZW50U2hhZGVyOiByZXF1aXJlKCcuL2dsc2xfMy9Db3B5SW50RnJhZ1NoYWRlci5nbHNsJyksXG5cdFx0XHRcdHVuaWZvcm1zOiBbXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdG5hbWU6ICd1X3N0YXRlJyxcblx0XHRcdFx0XHRcdFx0dmFsdWU6IDAsXG5cdFx0XHRcdFx0XHRcdGRhdGFUeXBlOiBJTlQsXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdF0sXG5cdFx0XHRcdH0sXG5cdFx0XHQpO1xuXHRcdFx0dGhpcy5jb3B5VWludFByb2dyYW0gPSB0aGlzLmluaXRQcm9ncmFtKHtcblx0XHRcdFx0bmFtZTogJ2NvcHlVaW50Jyxcblx0XHRcdFx0ZnJhZ21lbnRTaGFkZXI6IHJlcXVpcmUoJy4vZ2xzbF8zL0NvcHlVaW50RnJhZ1NoYWRlci5nbHNsJyksXG5cdFx0XHRcdHVuaWZvcm1zOiBbXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdG5hbWU6ICd1X3N0YXRlJyxcblx0XHRcdFx0XHRcdFx0dmFsdWU6IDAsXG5cdFx0XHRcdFx0XHRcdGRhdGFUeXBlOiBJTlQsXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdF0sXG5cdFx0XHRcdH0sXG5cdFx0XHQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLmNvcHlJbnRQcm9ncmFtID0gdGhpcy5jb3B5RmxvYXRQcm9ncmFtO1xuXHRcdFx0dGhpcy5jb3B5VWludFByb2dyYW0gPSB0aGlzLmNvcHlGbG9hdFByb2dyYW07XG5cdFx0fVxuXG5cdFx0Ly8gVW5iaW5kIGFjdGl2ZSBidWZmZXIuXG5cdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIG51bGwpO1xuXG5cdFx0Ly8gQ2FudmFzIHNldHVwLlxuXHRcdHRoaXMub25SZXNpemUoY2FudmFzKTtcblxuXHRcdC8vIExvZyBudW1iZXIgb2YgdGV4dHVyZXMgYXZhaWxhYmxlLlxuXHRcdHRoaXMubWF4TnVtVGV4dHVyZXMgPSB0aGlzLmdsLmdldFBhcmFtZXRlcih0aGlzLmdsLk1BWF9URVhUVVJFX0lNQUdFX1VOSVRTKTtcblx0XHRjb25zb2xlLmxvZyhgJHt0aGlzLm1heE51bVRleHR1cmVzfSB0ZXh0dXJlcyBtYXguYCk7XG5cdH1cblxuXHRwcml2YXRlIGdldCBzaW5nbGVDb2xvclByb2dyYW0oKSB7XG5cdFx0aWYgKHRoaXMuX3NpbmdsZUNvbG9yUHJvZ3JhbSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRjb25zdCBwcm9ncmFtID0gdGhpcy5pbml0UHJvZ3JhbSh7XG5cdFx0XHRcdG5hbWU6ICdzaW5nbGVDb2xvcicsXG5cdFx0XHRcdGZyYWdtZW50U2hhZGVyOiB0aGlzLmdsc2xWZXJzaW9uID09PSBHTFNMMyA/IHJlcXVpcmUoJy4vZ2xzbF8zL1NpbmdsZUNvbG9yRnJhZ1NoYWRlci5nbHNsJykgOiByZXF1aXJlKCcuL2dsc2xfMS9TaW5nbGVDb2xvckZyYWdTaGFkZXIuZ2xzbCcpLFxuXHRcdFx0fSk7XG5cdFx0XHR0aGlzLl9zaW5nbGVDb2xvclByb2dyYW0gPSBwcm9ncmFtO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5fc2luZ2xlQ29sb3JQcm9ncmFtO1xuXHR9XG5cblx0cHJpdmF0ZSBnZXQgc2luZ2xlQ29sb3JXaXRoV3JhcENoZWNrUHJvZ3JhbSgpIHtcblx0XHRpZiAodGhpcy5fc2luZ2xlQ29sb3JXaXRoV3JhcENoZWNrUHJvZ3JhbSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRjb25zdCBwcm9ncmFtID0gdGhpcy5pbml0UHJvZ3JhbSh7XG5cdFx0XHRcdG5hbWU6ICdzaW5nbGVDb2xvcldpdGhXcmFwQ2hlY2snLFxuXHRcdFx0XHRmcmFnbWVudFNoYWRlcjogdGhpcy5nbHNsVmVyc2lvbiA9PT0gR0xTTDMgPyByZXF1aXJlKCcuL2dsc2xfMy9TaW5nbGVDb2xvcldpdGhXcmFwQ2hlY2tGcmFnU2hhZGVyLmdsc2wnKSA6IHJlcXVpcmUoJy4vZ2xzbF8xL1NpbmdsZUNvbG9yV2l0aFdyYXBDaGVja0ZyYWdTaGFkZXIuZ2xzbCcpLFxuXHRcdFx0fSk7XG5cdFx0XHR0aGlzLl9zaW5nbGVDb2xvcldpdGhXcmFwQ2hlY2tQcm9ncmFtID0gcHJvZ3JhbTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuX3NpbmdsZUNvbG9yV2l0aFdyYXBDaGVja1Byb2dyYW07XG5cdH1cblxuXHRpc1dlYkdMMigpIHtcblx0XHRyZXR1cm4gaXNXZWJHTDIodGhpcy5nbCk7XG5cdH1cblxuXHRwcml2YXRlIGdldCBxdWFkUG9zaXRpb25zQnVmZmVyKCkge1xuXHRcdGlmICh0aGlzLl9xdWFkUG9zaXRpb25zQnVmZmVyID09PSB1bmRlZmluZWQpIHtcblx0XHRcdGNvbnN0IGZzUXVhZFBvc2l0aW9ucyA9IG5ldyBGbG9hdDMyQXJyYXkoWyAtMSwgLTEsIDEsIC0xLCAtMSwgMSwgMSwgMSBdKTtcblx0XHRcdHRoaXMuX3F1YWRQb3NpdGlvbnNCdWZmZXIgPSB0aGlzLmluaXRWZXJ0ZXhCdWZmZXIoZnNRdWFkUG9zaXRpb25zKSE7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLl9xdWFkUG9zaXRpb25zQnVmZmVyITtcblx0fVxuXG5cdHByaXZhdGUgZ2V0IGJvdW5kYXJ5UG9zaXRpb25zQnVmZmVyKCkge1xuXHRcdGlmICh0aGlzLl9ib3VuZGFyeVBvc2l0aW9uc0J1ZmZlciA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRjb25zdCBib3VuZGFyeVBvc2l0aW9ucyA9IG5ldyBGbG9hdDMyQXJyYXkoWyAtMSwgLTEsIDEsIC0xLCAxLCAxLCAtMSwgMSwgLTEsIC0xIF0pO1xuXHRcdFx0dGhpcy5fYm91bmRhcnlQb3NpdGlvbnNCdWZmZXIgPSB0aGlzLmluaXRWZXJ0ZXhCdWZmZXIoYm91bmRhcnlQb3NpdGlvbnMpITtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuX2JvdW5kYXJ5UG9zaXRpb25zQnVmZmVyITtcblx0fVxuXG5cdHByaXZhdGUgZ2V0Q2lyY2xlUG9zaXRpb25zQnVmZmVyKG51bVNlZ21lbnRzOiBudW1iZXIpIHtcblx0XHRpZiAodGhpcy5fY2lyY2xlUG9zaXRpb25zQnVmZmVyW251bVNlZ21lbnRzXSA9PSB1bmRlZmluZWQpIHtcblx0XHRcdGNvbnN0IHVuaXRDaXJjbGVQb2ludHMgPSBbMCwgMF07XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8PSBudW1TZWdtZW50czsgaSsrKSB7XG5cdFx0XHRcdHVuaXRDaXJjbGVQb2ludHMucHVzaChcblx0XHRcdFx0XHRNYXRoLmNvcygyICogTWF0aC5QSSAqIGkgLyBudW1TZWdtZW50cyksXG5cdFx0XHRcdFx0TWF0aC5zaW4oMiAqIE1hdGguUEkgKiBpIC8gbnVtU2VnbWVudHMpLFxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdFx0Y29uc3QgY2lyY2xlUG9zaXRpb25zID0gbmV3IEZsb2F0MzJBcnJheSh1bml0Q2lyY2xlUG9pbnRzKTtcblx0XHRcdGNvbnN0IGJ1ZmZlciA9IHRoaXMuaW5pdFZlcnRleEJ1ZmZlcihjaXJjbGVQb3NpdGlvbnMpITtcblx0XHRcdHRoaXMuX2NpcmNsZVBvc2l0aW9uc0J1ZmZlcltudW1TZWdtZW50c10gPSBidWZmZXI7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLl9jaXJjbGVQb3NpdGlvbnNCdWZmZXJbbnVtU2VnbWVudHNdO1xuXHR9XG5cblx0cHJpdmF0ZSBpbml0VmVydGV4QnVmZmVyKFxuXHRcdGRhdGE6IEZsb2F0MzJBcnJheSxcblx0KSB7XG5cdFx0Y29uc3QgeyBlcnJvckNhbGxiYWNrLCBnbCB9ID0gdGhpcztcblx0XHRjb25zdCBidWZmZXIgPSBnbC5jcmVhdGVCdWZmZXIoKTtcblx0XHRpZiAoIWJ1ZmZlcikge1xuXHRcdFx0ZXJyb3JDYWxsYmFjaygnVW5hYmxlIHRvIGFsbG9jYXRlIGdsIGJ1ZmZlci4nKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGJ1ZmZlcik7XG5cdFx0Ly8gQWRkIGJ1ZmZlciBkYXRhLlxuXHRcdGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLCBkYXRhLCBnbC5TVEFUSUNfRFJBVyk7XG5cdFx0cmV0dXJuIGJ1ZmZlcjtcblx0fVxuXG5cdGluaXRQcm9ncmFtKFxuXHRcdHBhcmFtczoge1xuXHRcdFx0bmFtZTogc3RyaW5nLFxuXHRcdFx0ZnJhZ21lbnRTaGFkZXI6IHN0cmluZyB8IFdlYkdMU2hhZGVyLFxuXHRcdFx0dW5pZm9ybXM/OiB7XG5cdFx0XHRcdG5hbWU6IHN0cmluZyxcblx0XHRcdFx0dmFsdWU6IFVuaWZvcm1WYWx1ZVR5cGUsXG5cdFx0XHRcdGRhdGFUeXBlOiBVbmlmb3JtRGF0YVR5cGUsXG5cdFx0XHR9W10sXG5cdFx0XHRkZWZpbmVzPzoge1xuXHRcdFx0XHRba2V5IDogc3RyaW5nXTogc3RyaW5nLFxuXHRcdFx0fSxcblx0XHR9LFxuXHQpIHtcblx0XHQvLyBDaGVjayBwYXJhbXMuXG5cdFx0Y29uc3QgdmFsaWRLZXlzID0gWyduYW1lJywgJ2ZyYWdtZW50U2hhZGVyJywgJ3VuaWZvcm1zJywgJ2RlZmluZXMnXTtcblx0XHRPYmplY3Qua2V5cyhwYXJhbXMpLmZvckVhY2goa2V5ID0+IHtcblx0XHRcdGlmICh2YWxpZEtleXMuaW5kZXhPZihrZXkpIDwgMCkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQga2V5ICR7a2V5fSBwYXNzZWQgdG8gV2ViR0xDb21wdXRlLmluaXRQcm9ncmFtIHdpdGggbmFtZSBcIiR7cGFyYW1zLm5hbWV9XCIuICBWYWxpZCBrZXlzIGFyZSAke3ZhbGlkS2V5cy5qb2luKCcsICcpfS5gKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRjb25zdCB7IGdsLCBlcnJvckNhbGxiYWNrLCBnbHNsVmVyc2lvbiB9ID0gdGhpcztcblx0XHRyZXR1cm4gbmV3IEdQVVByb2dyYW0oXG5cdFx0XHR7XG5cdFx0XHRcdC4uLnBhcmFtcyxcblx0XHRcdFx0Z2wsXG5cdFx0XHRcdGVycm9yQ2FsbGJhY2ssXG5cdFx0XHRcdGdsc2xWZXJzaW9uLFxuXHRcdFx0fSxcblx0XHQpO1xuXHR9O1xuXG5cdGluaXREYXRhTGF5ZXIoXG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRuYW1lOiBzdHJpbmcsXG5cdFx0XHRkaW1lbnNpb25zOiBudW1iZXIgfCBbbnVtYmVyLCBudW1iZXJdLFxuXHRcdFx0dHlwZTogRGF0YUxheWVyVHlwZSxcblx0XHRcdG51bUNvbXBvbmVudHM6IERhdGFMYXllck51bUNvbXBvbmVudHMsXG5cdFx0XHRkYXRhPzogRGF0YUxheWVyQXJyYXlUeXBlLFxuXHRcdFx0ZmlsdGVyPzogRGF0YUxheWVyRmlsdGVyVHlwZSxcblx0XHRcdHdyYXBTPzogRGF0YUxheWVyV3JhcFR5cGUsXG5cdFx0XHR3cmFwVD86IERhdGFMYXllcldyYXBUeXBlLFxuXHRcdFx0d3JpdGFibGU/OiBib29sZWFuLFxuXHRcdFx0bnVtQnVmZmVycz86IG51bWJlcixcblx0XHR9LFxuXHQpIHtcblx0XHQvLyBDaGVjayBwYXJhbXMuXG5cdFx0Y29uc3QgdmFsaWRLZXlzID0gWyduYW1lJywgJ2RpbWVuc2lvbnMnLCAndHlwZScsICdudW1Db21wb25lbnRzJywgJ2RhdGEnLCAnZmlsdGVyJywgJ3dyYXBTJywgJ3dyYXBUJywgJ3dyaXRhYmxlJywgJ251bUJ1ZmZlcnMnXTtcblx0XHRPYmplY3Qua2V5cyhwYXJhbXMpLmZvckVhY2goa2V5ID0+IHtcblx0XHRcdGlmICh2YWxpZEtleXMuaW5kZXhPZihrZXkpIDwgMCkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQga2V5ICR7a2V5fSBwYXNzZWQgdG8gV2ViR0xDb21wdXRlLmluaXREYXRhTGF5ZXIgd2l0aCBuYW1lIFwiJHtwYXJhbXMubmFtZX1cIi4gIFZhbGlkIGtleXMgYXJlICR7dmFsaWRLZXlzLmpvaW4oJywgJyl9LmApO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdGNvbnN0IHsgZ2wsIGVycm9yQ2FsbGJhY2ssIGdsc2xWZXJzaW9uIH0gPSB0aGlzO1xuXHRcdHJldHVybiBuZXcgRGF0YUxheWVyKHtcblx0XHRcdC4uLnBhcmFtcyxcblx0XHRcdGdsLFxuXHRcdFx0Z2xzbFZlcnNpb24sXG5cdFx0XHRlcnJvckNhbGxiYWNrLFxuXHRcdH0pO1xuXHR9O1xuXG5cdGluaXRUZXh0dXJlKFxuXHRcdHBhcmFtczoge1xuXHRcdFx0bmFtZTogc3RyaW5nLFxuXHRcdFx0dXJsOiBzdHJpbmcsXG5cdFx0XHRmaWx0ZXI/OiBEYXRhTGF5ZXJGaWx0ZXJUeXBlLFxuXHRcdFx0d3JhcFM/OiBEYXRhTGF5ZXJXcmFwVHlwZSxcblx0XHRcdHdyYXBUPzogRGF0YUxheWVyV3JhcFR5cGUsXG5cdFx0XHRmb3JtYXQ/OiBUZXh0dXJlRm9ybWF0VHlwZSxcblx0XHRcdHR5cGU/OiBUZXh0dXJlRGF0YVR5cGUsXG5cdFx0XHRvbkxvYWQ/OiAodGV4dHVyZTogV2ViR0xUZXh0dXJlKSA9PiB2b2lkLFxuXHRcdH0sXG5cdCkge1xuXHRcdC8vIENoZWNrIHBhcmFtcy5cblx0XHRjb25zdCB2YWxpZEtleXMgPSBbJ25hbWUnLCAndXJsJywgJ2ZpbHRlcicsICd3cmFwUycsICd3cmFwVCcsICdmb3JtYXQnLCAndHlwZScsICdvbkxvYWQnXTtcblx0XHRPYmplY3Qua2V5cyhwYXJhbXMpLmZvckVhY2goa2V5ID0+IHtcblx0XHRcdGlmICh2YWxpZEtleXMuaW5kZXhPZihrZXkpIDwgMCkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQga2V5ICR7a2V5fSBwYXNzZWQgdG8gV2ViR0xDb21wdXRlLmluaXRUZXh0dXJlIHdpdGggbmFtZSBcIiR7cGFyYW1zLm5hbWV9XCIuICBWYWxpZCBrZXlzIGFyZSAke3ZhbGlkS2V5cy5qb2luKCcsICcpfS5gKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRjb25zdCB7IHVybCwgbmFtZSB9ID0gcGFyYW1zO1xuXHRcdGlmICghaXNTdHJpbmcodXJsKSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBXZWJHTENvbXB1dGUuaW5pdFRleHR1cmUgcGFyYW1zIHRvIGhhdmUgdXJsIG9mIHR5cGUgc3RyaW5nLCBnb3QgJHt1cmx9IG9mIHR5cGUgJHt0eXBlb2YgdXJsfS5gKVxuXHRcdH1cblx0XHRpZiAoIWlzU3RyaW5nKG5hbWUpKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIFdlYkdMQ29tcHV0ZS5pbml0VGV4dHVyZSBwYXJhbXMgdG8gaGF2ZSBuYW1lIG9mIHR5cGUgc3RyaW5nLCBnb3QgJHtuYW1lfSBvZiB0eXBlICR7dHlwZW9mIG5hbWV9LmApXG5cdFx0fVxuXG5cdFx0Ly8gR2V0IGZpbHRlciB0eXBlLCBkZWZhdWx0IHRvIG5lYXJlc3QuXG5cdFx0Y29uc3QgZmlsdGVyID0gcGFyYW1zLmZpbHRlciAhPT0gdW5kZWZpbmVkID8gcGFyYW1zLmZpbHRlciA6IE5FQVJFU1Q7XG5cdFx0aWYgKCFpc1ZhbGlkRmlsdGVyVHlwZShmaWx0ZXIpKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgZmlsdGVyOiAke2ZpbHRlcn0gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIiwgbXVzdCBiZSAke3ZhbGlkRmlsdGVyVHlwZXMuam9pbignLCAnKX0uYCk7XG5cdFx0fVxuXG5cdFx0Ly8gR2V0IHdyYXAgdHlwZXMsIGRlZmF1bHQgdG8gY2xhbXAgdG8gZWRnZS5cblx0XHRjb25zdCB3cmFwUyA9IHBhcmFtcy53cmFwUyAhPT0gdW5kZWZpbmVkID8gcGFyYW1zLndyYXBTIDogQ0xBTVBfVE9fRURHRTtcblx0XHRpZiAoIWlzVmFsaWRXcmFwVHlwZSh3cmFwUykpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB3cmFwUzogJHt3cmFwU30gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIiwgbXVzdCBiZSAke3ZhbGlkV3JhcFR5cGVzLmpvaW4oJywgJyl9LmApO1xuXHRcdH1cblx0XHRjb25zdCB3cmFwVCA9IHBhcmFtcy53cmFwVCAhPT0gdW5kZWZpbmVkID8gcGFyYW1zLndyYXBUIDogQ0xBTVBfVE9fRURHRTtcblx0XHRpZiAoIWlzVmFsaWRXcmFwVHlwZSh3cmFwVCkpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB3cmFwVDogJHt3cmFwVH0gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIiwgbXVzdCBiZSAke3ZhbGlkV3JhcFR5cGVzLmpvaW4oJywgJyl9LmApO1xuXHRcdH1cblxuXHRcdC8vIEdldCBpbWFnZSBmb3JtYXQgdHlwZSwgZGVmYXVsdCB0byByZ2JhLlxuXHRcdGNvbnN0IGZvcm1hdCA9IHBhcmFtcy5mb3JtYXQgIT09IHVuZGVmaW5lZCA/IHBhcmFtcy5mb3JtYXQgOiBSR0JBO1xuXHRcdGlmICghaXNWYWxpZFRleHR1cmVGb3JtYXRUeXBlKGZvcm1hdCkpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBmb3JtYXQ6ICR7Zm9ybWF0fSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLCBtdXN0IGJlICR7dmFsaWRUZXh0dXJlRm9ybWF0VHlwZXMuam9pbignLCAnKX0uYCk7XG5cdFx0fVxuXG5cdFx0Ly8gR2V0IGltYWdlIGRhdGEgdHlwZSwgZGVmYXVsdCB0byB1bnNpZ25lZCBieXRlLlxuXHRcdGNvbnN0IHR5cGUgPSBwYXJhbXMudHlwZSAhPT0gdW5kZWZpbmVkID8gcGFyYW1zLnR5cGUgOiBVTlNJR05FRF9CWVRFO1xuXHRcdGlmICghaXNWYWxpZFRleHR1cmVEYXRhVHlwZSh0eXBlKSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHR5cGU6ICR7dHlwZX0gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIiwgbXVzdCBiZSAke3ZhbGlkVGV4dHVyZURhdGFUeXBlcy5qb2luKCcsICcpfS5gKTtcblx0XHR9XG5cblx0XHRjb25zdCB7IGdsLCBlcnJvckNhbGxiYWNrIH0gPSB0aGlzO1xuXHRcdGNvbnN0IHRleHR1cmUgPSBnbC5jcmVhdGVUZXh0dXJlKCk7XG5cdFx0aWYgKHRleHR1cmUgPT09IG51bGwpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIGluaXQgZ2xUZXh0dXJlLmApO1xuXHRcdH1cblx0XHRnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCB0ZXh0dXJlKTtcblx0XHQvLyBCZWNhdXNlIGltYWdlcyBoYXZlIHRvIGJlIGRvd25sb2FkZWQgb3ZlciB0aGUgaW50ZXJuZXRcblx0XHQvLyB0aGV5IG1pZ2h0IHRha2UgYSBtb21lbnQgdW50aWwgdGhleSBhcmUgcmVhZHkuXG5cdFx0Ly8gVW50aWwgdGhlbiBwdXQgYSBzaW5nbGUgcGl4ZWwgaW4gdGhlIHRleHR1cmUgc28gd2UgY2FuXG5cdFx0Ly8gdXNlIGl0IGltbWVkaWF0ZWx5LiBXaGVuIHRoZSBpbWFnZSBoYXMgZmluaXNoZWQgZG93bmxvYWRpbmdcblx0XHQvLyB3ZSdsbCB1cGRhdGUgdGhlIHRleHR1cmUgd2l0aCB0aGUgY29udGVudHMgb2YgdGhlIGltYWdlLlxuXHRcdGNvbnN0IGxldmVsID0gMDtcblx0XHRjb25zdCBpbnRlcm5hbEZvcm1hdCA9IGdsLlJHQkE7XG5cdFx0Y29uc3Qgd2lkdGggPSAxO1xuXHRcdGNvbnN0IGhlaWdodCA9IDE7XG5cdFx0Y29uc3QgYm9yZGVyID0gMDtcblx0XHRjb25zdCBzcmNGb3JtYXQgPSBnbFtmb3JtYXRdO1xuXHRcdGNvbnN0IHNyY1R5cGUgPSBnbFt0eXBlXTtcblx0XHRjb25zdCBwaXhlbCA9IG5ldyBVaW50OEFycmF5KFswLCAwLCAwLCAwXSk7XG5cdFx0Z2wudGV4SW1hZ2UyRChnbC5URVhUVVJFXzJELCBsZXZlbCwgaW50ZXJuYWxGb3JtYXQsXG5cdFx0XHR3aWR0aCwgaGVpZ2h0LCBib3JkZXIsIHNyY0Zvcm1hdCwgc3JjVHlwZSwgcGl4ZWwpO1xuXG5cdFx0Y29uc3QgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcblx0XHRpbWFnZS5vbmxvYWQgPSAoKSA9PiB7XG5cdFx0XHRnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCB0ZXh0dXJlKTtcblx0XHRcdGdsLnRleEltYWdlMkQoZ2wuVEVYVFVSRV8yRCwgbGV2ZWwsIGludGVybmFsRm9ybWF0LFxuXHRcdFx0XHRzcmNGb3JtYXQsIHNyY1R5cGUsIGltYWdlKTtcblxuXHRcdFx0Ly8gV2ViR0wxIGhhcyBkaWZmZXJlbnQgcmVxdWlyZW1lbnRzIGZvciBwb3dlciBvZiAyIGltYWdlc1xuXHRcdFx0Ly8gdnMgbm9uIHBvd2VyIG9mIDIgaW1hZ2VzIHNvIGNoZWNrIGlmIHRoZSBpbWFnZSBpcyBhXG5cdFx0XHQvLyBwb3dlciBvZiAyIGluIGJvdGggZGltZW5zaW9ucy5cblx0XHRcdGlmIChpc1Bvd2VyT2YyKGltYWdlLndpZHRoKSAmJiBpc1Bvd2VyT2YyKGltYWdlLmhlaWdodCkpIHtcblx0XHRcdFx0Ly8gLy8gWWVzLCBpdCdzIGEgcG93ZXIgb2YgMi4gR2VuZXJhdGUgbWlwcy5cblx0XHRcdFx0Ly8gZ2wuZ2VuZXJhdGVNaXBtYXAoZ2wuVEVYVFVSRV8yRCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBUT0RPOiBmaW5pc2ggaW1wbGVtZW50aW5nIHRoaXMuXG5cdFx0XHRcdGNvbnNvbGUud2FybihgVGV4dHVyZSAke25hbWV9IGRpbWVuc2lvbnMgWyR7aW1hZ2Uud2lkdGh9LCAke2ltYWdlLmhlaWdodH1dIGFyZSBub3QgcG93ZXIgb2YgMi5gKTtcblx0XHRcdFx0Ly8gLy8gTm8sIGl0J3Mgbm90IGEgcG93ZXIgb2YgMi4gVHVybiBvZmYgbWlwcyBhbmQgc2V0XG5cdFx0XHRcdC8vIC8vIHdyYXBwaW5nIHRvIGNsYW1wIHRvIGVkZ2Vcblx0XHRcdFx0Ly8gZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfUywgZ2wuQ0xBTVBfVE9fRURHRSk7XG5cdFx0XHRcdC8vIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1QsIGdsLkNMQU1QX1RPX0VER0UpO1xuXHRcdFx0fVxuXHRcdFx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfUywgZ2xbd3JhcFNdKTtcblx0XHRcdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1QsIGdsW3dyYXBUXSk7XG5cdFx0XHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgZ2xbZmlsdGVyXSk7XG5cdFx0XHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgZ2xbZmlsdGVyXSk7XG5cblx0XHRcdC8vIENhbGxiYWNrIHdoZW4gdGV4dHVyZSBoYXMgbG9hZGVkLlxuXHRcdFx0aWYgKHBhcmFtcy5vbkxvYWQpIHBhcmFtcy5vbkxvYWQodGV4dHVyZSk7XG5cdFx0fTtcblx0XHRpbWFnZS5vbmVycm9yID0gKGUpID0+IHtcblx0XHRcdGVycm9yQ2FsbGJhY2soYEVycm9yIGxvYWRpbmcgaW1hZ2UgJHtuYW1lfTogJHtlfWApO1xuXHRcdH1cblx0XHRpbWFnZS5zcmMgPSB1cmw7XG5cblx0XHRyZXR1cm4gdGV4dHVyZTtcblx0fVxuXG5cdG9uUmVzaXplKGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQpIHtcblx0XHRjb25zdCB3aWR0aCA9IGNhbnZhcy5jbGllbnRXaWR0aDtcblx0XHRjb25zdCBoZWlnaHQgPSBjYW52YXMuY2xpZW50SGVpZ2h0O1xuXHRcdC8vIFNldCBjb3JyZWN0IGNhbnZhcyBwaXhlbCBzaXplLlxuXHRcdC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9XZWJHTF9BUEkvQnlfZXhhbXBsZS9DYW52YXNfc2l6ZV9hbmRfV2ViR0xcblx0XHRjYW52YXMud2lkdGggPSB3aWR0aDtcblx0XHRjYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xuXHRcdC8vIFNhdmUgZGltZW5zaW9ucy5cblx0XHR0aGlzLndpZHRoID0gd2lkdGg7XG5cdFx0dGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG5cdH07XG5cblx0cHJpdmF0ZSBkcmF3U2V0dXAoXG5cdFx0cHJvZ3JhbTogV2ViR0xQcm9ncmFtLFxuXHRcdGZ1bGxzY3JlZW5SZW5kZXI6IGJvb2xlYW4sXG5cdFx0aW5wdXQ/OiAoRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlKVtdIHwgRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlLFxuXHRcdG91dHB1dD86IERhdGFMYXllcixcblx0KSB7XG5cdFx0Y29uc3QgeyBnbCB9ID0gdGhpcztcblx0XHQvLyBDaGVjayBpZiB3ZSBhcmUgaW4gYW4gZXJyb3Igc3RhdGUuXG5cdFx0aWYgKCFwcm9ncmFtKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gQ0FVVElPTjogdGhlIG9yZGVyIG9mIHRoZXNlIG5leHQgZmV3IGxpbmVzIGlzIGltcG9ydGFudC5cblxuXHRcdC8vIEdldCBhIHNoYWxsb3cgY29weSBvZiBjdXJyZW50IHRleHR1cmVzLlxuXHRcdC8vIFRoaXMgbGluZSBtdXN0IGNvbWUgYmVmb3JlIHRoaXMuc2V0T3V0cHV0KCkgYXMgaXQgZGVwZW5kcyBvbiBjdXJyZW50IGludGVybmFsIHN0YXRlLlxuXHRcdGNvbnN0IGlucHV0VGV4dHVyZXM6IFdlYkdMVGV4dHVyZVtdID0gW107XG5cdFx0aWYgKGlucHV0KSB7XG5cdFx0XHRpZiAoaW5wdXQuY29uc3RydWN0b3IgPT09IFdlYkdMVGV4dHVyZSkge1xuXHRcdFx0XHRpbnB1dFRleHR1cmVzLnB1c2goaW5wdXQgYXMgV2ViR0xUZXh0dXJlKTtcblx0XHRcdH0gZWxzZSBpZiAoaW5wdXQuY29uc3RydWN0b3IgPT09IERhdGFMYXllcikge1xuXHRcdFx0XHRpbnB1dFRleHR1cmVzLnB1c2goKGlucHV0IGFzIERhdGFMYXllcikuZ2V0Q3VycmVudFN0YXRlVGV4dHVyZSgpKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgKGlucHV0IGFzIChEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUpW10pLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0Y29uc3QgbGF5ZXIgPSAoaW5wdXQgYXMgKERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSlbXSlbaV07XG5cdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRcdGlucHV0VGV4dHVyZXMucHVzaCgobGF5ZXIgYXMgRGF0YUxheWVyKS5nZXRDdXJyZW50U3RhdGVUZXh0dXJlID8gKGxheWVyIGFzIERhdGFMYXllcikuZ2V0Q3VycmVudFN0YXRlVGV4dHVyZSgpIDogbGF5ZXIgYXMgV2ViR0xUZXh0dXJlKVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gU2V0IG91dHB1dCBmcmFtZWJ1ZmZlci5cblx0XHQvLyBUaGlzIG1heSBtb2RpZnkgV2ViR0wgaW50ZXJuYWwgc3RhdGUuXG5cdFx0dGhpcy5zZXRPdXRwdXRMYXllcihmdWxsc2NyZWVuUmVuZGVyLCBpbnB1dCwgb3V0cHV0KTtcblxuXHRcdC8vIFNldCBjdXJyZW50IHByb2dyYW0uXG5cdFx0Z2wudXNlUHJvZ3JhbShwcm9ncmFtKTtcblxuXHRcdC8vIFNldCBpbnB1dCB0ZXh0dXJlcy5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGlucHV0VGV4dHVyZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGdsLmFjdGl2ZVRleHR1cmUoZ2wuVEVYVFVSRTAgKyBpKTtcblx0XHRcdGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIGlucHV0VGV4dHVyZXNbaV0pO1xuXHRcdH1cblx0fVxuXG5cdGNvcHlQcm9ncmFtRm9yVHlwZSh0eXBlOiBEYXRhTGF5ZXJUeXBlKSB7XG5cdFx0c3dpdGNoICh0eXBlKSB7XG5cdFx0XHRjYXNlIEhBTEZfRkxPQVQ6XG5cdFx0XHRjYXNlIEZMT0FUOlxuXHRcdFx0XHRyZXR1cm4gdGhpcy5jb3B5RmxvYXRQcm9ncmFtO1xuXHRcdFx0Y2FzZSBVTlNJR05FRF9CWVRFOlxuXHRcdFx0Y2FzZSBVTlNJR05FRF9TSE9SVDpcblx0XHRcdGNhc2UgVU5TSUdORURfSU5UOlxuXHRcdFx0XHRyZXR1cm4gdGhpcy5jb3B5VWludFByb2dyYW07XG5cdFx0XHRjYXNlIEJZVEU6XG5cdFx0XHRjYXNlIFNIT1JUOlxuXHRcdFx0Y2FzZSBJTlQ6XG5cdFx0XHRcdHJldHVybiB0aGlzLmNvcHlJbnRQcm9ncmFtO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHR5cGU6ICR7dHlwZX0gcGFzc2VkIHRvIFdlYkdMQ29tcHV0ZS5jb3B5UHJvZ3JhbUZvclR5cGUuYCk7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBzZXRCbGVuZE1vZGUoc2hvdWxkQmxlbmRBbHBoYT86IGJvb2xlYW4pIHtcblx0XHRjb25zdCB7IGdsIH0gPSB0aGlzO1xuXHRcdGlmIChzaG91bGRCbGVuZEFscGhhKSB7XG5cdFx0XHRnbC5lbmFibGUoZ2wuQkxFTkQpO1xuXHRcdFx0Z2wuYmxlbmRGdW5jKGdsLlNSQ19BTFBIQSwgZ2wuT05FX01JTlVTX1NSQ19BTFBIQSk7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBhZGRMYXllclRvSW5wdXRzKFxuXHRcdGxheWVyOiBEYXRhTGF5ZXIsXG5cdFx0aW5wdXQ/OiAgKERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSlbXSB8IERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSxcblx0KSB7XG5cdFx0Ly8gQWRkIGxheWVyIHRvIGVuZCBvZiBpbnB1dCBpZiBuZWVkZWQuXG5cdFx0bGV0IF9pbnB1dExheWVycyA9IGlucHV0O1xuXHRcdGlmIChpc0FycmF5KF9pbnB1dExheWVycykpIHtcblx0XHRcdGNvbnN0IGluZGV4ID0gKF9pbnB1dExheWVycyBhcyAoRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlKVtdKS5pbmRleE9mKGxheWVyKTtcblx0XHRcdGlmIChpbmRleCA8IDApIHtcblx0XHRcdFx0KF9pbnB1dExheWVycyBhcyAoRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlKVtdKS5wdXNoKGxheWVyKTtcblx0XHRcdH0gXG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmIChfaW5wdXRMYXllcnMgIT09IGxheWVyKSB7XG5cdFx0XHRcdGNvbnN0IHByZXZpb3VzID0gX2lucHV0TGF5ZXJzO1xuXHRcdFx0XHRfaW5wdXRMYXllcnMgPSBbXTtcblx0XHRcdFx0aWYgKHByZXZpb3VzKSAoX2lucHV0TGF5ZXJzIGFzIChEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUpW10pLnB1c2gocHJldmlvdXMpO1xuXHRcdFx0XHQoX2lucHV0TGF5ZXJzIGFzIChEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUpW10pLnB1c2gobGF5ZXIpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0X2lucHV0TGF5ZXJzID0gW19pbnB1dExheWVyc107XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBfaW5wdXRMYXllcnMgYXMgKERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSlbXTtcblx0fVxuXG5cdHByaXZhdGUgcGFzc1Rocm91Z2hMYXllckRhdGFGcm9tSW5wdXRUb091dHB1dChzdGF0ZTogRGF0YUxheWVyKSB7XG5cdFx0Ly8gVE9ETzogZmlndXJlIG91dCB0aGUgZmFzdGVzdCB3YXkgdG8gY29weSBhIHRleHR1cmUuXG5cdFx0Y29uc3QgY29weVByb2dyYW0gPSB0aGlzLmNvcHlQcm9ncmFtRm9yVHlwZShzdGF0ZS5pbnRlcm5hbFR5cGUpO1xuXHRcdHRoaXMuc3RlcCh7XG5cdFx0XHRwcm9ncmFtOiBjb3B5UHJvZ3JhbSxcblx0XHRcdGlucHV0OiBzdGF0ZSxcblx0XHRcdG91dHB1dDogc3RhdGUsXG5cdFx0fSk7XG5cdH1cblxuXHRwcml2YXRlIHNldE91dHB1dExheWVyKFxuXHRcdGZ1bGxzY3JlZW5SZW5kZXI6IGJvb2xlYW4sXG5cdFx0aW5wdXQ/OiAoRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlKVtdIHwgRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlLFxuXHRcdG91dHB1dD86IERhdGFMYXllciwgLy8gVW5kZWZpbmVkIHJlbmRlcnMgdG8gc2NyZWVuLlxuXHQpIHtcblx0XHRjb25zdCB7IGdsIH0gPSB0aGlzO1xuXG5cdFx0Ly8gUmVuZGVyIHRvIHNjcmVlbi5cblx0XHRpZiAoIW91dHB1dCkge1xuXHRcdFx0Z2wuYmluZEZyYW1lYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBudWxsKTtcblx0XHRcdC8vIFJlc2l6ZSB2aWV3cG9ydC5cblx0XHRcdGNvbnN0IHsgd2lkdGgsIGhlaWdodCB9ID0gdGhpcztcblx0XHRcdGdsLnZpZXdwb3J0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIENoZWNrIGlmIG91dHB1dCBpcyBzYW1lIGFzIG9uZSBvZiBpbnB1dCBsYXllcnMuXG5cdFx0aWYgKGlucHV0ICYmICgoaW5wdXQgPT09IG91dHB1dCkgfHwgKGlzQXJyYXkoaW5wdXQpICYmIChpbnB1dCBhcyAoRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlKVtdKS5pbmRleE9mKG91dHB1dCkgPiAtMSkpKSB7XG5cdFx0XHRpZiAob3V0cHV0Lm51bUJ1ZmZlcnMgPT09IDEpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgdXNlIHNhbWUgYnVmZmVyIGZvciBpbnB1dCBhbmQgb3V0cHV0IG9mIGEgcHJvZ3JhbS4gVHJ5IGluY3JlYXNpbmcgdGhlIG51bWJlciBvZiBidWZmZXJzIGluIHlvdXIgb3V0cHV0IGxheWVyIHRvIGF0IGxlYXN0IDIgc28geW91IGNhbiByZW5kZXIgdG8gbmV4dFN0YXRlIHVzaW5nIGN1cnJlbnRTdGF0ZSBhcyBhbiBpbnB1dC4nKTtcblx0XHRcdH1cblx0XHRcdGlmIChmdWxsc2NyZWVuUmVuZGVyKSB7XG5cdFx0XHRcdC8vIFJlbmRlciBhbmQgaW5jcmVtZW50IGJ1ZmZlciBzbyB3ZSBhcmUgcmVuZGVyaW5nIHRvIGEgZGlmZmVyZW50IHRhcmdldFxuXHRcdFx0XHQvLyB0aGFuIHRoZSBpbnB1dCB0ZXh0dXJlLlxuXHRcdFx0XHRvdXRwdXQuX2JpbmRPdXRwdXRCdWZmZXJGb3JXcml0ZSh0cnVlKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIFBhc3MgaW5wdXQgdGV4dHVyZSB0aHJvdWdoIHRvIG91dHB1dC5cblx0XHRcdFx0dGhpcy5wYXNzVGhyb3VnaExheWVyRGF0YUZyb21JbnB1dFRvT3V0cHV0KG91dHB1dCk7XG5cdFx0XHRcdC8vIFJlbmRlciB0byBvdXRwdXQgd2l0aG91dCBpbmNyZW1lbnRpbmcgYnVmZmVyLlxuXHRcdFx0XHRvdXRwdXQuX2JpbmRPdXRwdXRCdWZmZXJGb3JXcml0ZShmYWxzZSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmIChmdWxsc2NyZWVuUmVuZGVyKSB7XG5cdFx0XHRcdC8vIFJlbmRlciB0byBjdXJyZW50IGJ1ZmZlci5cblx0XHRcdFx0b3V0cHV0Ll9iaW5kT3V0cHV0QnVmZmVyRm9yV3JpdGUoZmFsc2UpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gSWYgd2UgYXJlIGRvaW5nIGEgc25lYWt5IHRoaW5nIHdpdGggYSBzd2FwcGVkIHRleHR1cmUgYW5kIGFyZVxuXHRcdFx0XHQvLyBvbmx5IHJlbmRlcmluZyBwYXJ0IG9mIHRoZSBzY3JlZW4sIHdlIG1heSBuZWVkIHRvIGFkZCBhIGNvcHkgb3BlcmF0aW9uLlxuXHRcdFx0XHRpZiAob3V0cHV0Ll91c2luZ1RleHR1cmVPdmVycmlkZUZvckN1cnJlbnRCdWZmZXIoKSkge1xuXHRcdFx0XHRcdHRoaXMucGFzc1Rocm91Z2hMYXllckRhdGFGcm9tSW5wdXRUb091dHB1dChvdXRwdXQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdG91dHB1dC5fYmluZE91dHB1dEJ1ZmZlckZvcldyaXRlKGZhbHNlKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0XG5cdFx0Ly8gUmVzaXplIHZpZXdwb3J0LlxuXHRcdGNvbnN0IFsgd2lkdGgsIGhlaWdodCBdID0gb3V0cHV0LmdldERpbWVuc2lvbnMoKTtcblx0XHRnbC52aWV3cG9ydCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcblx0fTtcblxuXHRwcml2YXRlIHNldFBvc2l0aW9uQXR0cmlidXRlKHByb2dyYW06IFdlYkdMUHJvZ3JhbSwgcHJvZ3JhbU5hbWU6IHN0cmluZykge1xuXHRcdHRoaXMuc2V0VmVydGV4QXR0cmlidXRlKHByb2dyYW0sICdhX2ludGVybmFsX3Bvc2l0aW9uJywgMiwgcHJvZ3JhbU5hbWUpO1xuXHR9XG5cblx0cHJpdmF0ZSBzZXRJbmRleEF0dHJpYnV0ZShwcm9ncmFtOiBXZWJHTFByb2dyYW0sIHByb2dyYW1OYW1lOiBzdHJpbmcpIHtcblx0XHR0aGlzLnNldFZlcnRleEF0dHJpYnV0ZShwcm9ncmFtLCAnYV9pbnRlcm5hbF9pbmRleCcsIDEsIHByb2dyYW1OYW1lKTtcblx0fVxuXG5cdHByaXZhdGUgc2V0VVZBdHRyaWJ1dGUocHJvZ3JhbTogV2ViR0xQcm9ncmFtLCBwcm9ncmFtTmFtZTogc3RyaW5nKSB7XG5cdFx0dGhpcy5zZXRWZXJ0ZXhBdHRyaWJ1dGUocHJvZ3JhbSwgJ2FfaW50ZXJuYWxfdXYnLCAyLCBwcm9ncmFtTmFtZSk7XG5cdH1cblxuXHRwcml2YXRlIHNldFZlcnRleEF0dHJpYnV0ZShwcm9ncmFtOiBXZWJHTFByb2dyYW0sIG5hbWU6IHN0cmluZywgc2l6ZTogbnVtYmVyLCBwcm9ncmFtTmFtZTogc3RyaW5nKSB7XG5cdFx0Y29uc3QgeyBnbCB9ID0gdGhpcztcblx0XHQvLyBQb2ludCBhdHRyaWJ1dGUgdG8gdGhlIGN1cnJlbnRseSBib3VuZCBWQk8uXG5cdFx0Y29uc3QgbG9jYXRpb24gPSBnbC5nZXRBdHRyaWJMb2NhdGlvbihwcm9ncmFtLCBuYW1lKTtcblx0XHRpZiAobG9jYXRpb24gPCAwKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byBmaW5kIHZlcnRleCBhdHRyaWJ1dGUgXCIke25hbWV9XCIgaW4gcHJvZ3JhbSBcIiR7cHJvZ3JhbU5hbWV9XCIuYCk7XG5cdFx0fVxuXHRcdC8vIFRPRE86IG9ubHkgZmxvYXQgaXMgc3VwcG9ydGVkIGZvciB2ZXJ0ZXggYXR0cmlidXRlcy5cblx0XHRnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGxvY2F0aW9uLCBzaXplLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xuXHRcdC8vIEVuYWJsZSB0aGUgYXR0cmlidXRlLlxuXHRcdGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KGxvY2F0aW9uKTtcblx0fVxuXG5cdC8vIFN0ZXAgZm9yIGVudGlyZSBmdWxsc2NyZWVuIHF1YWQuXG5cdHN0ZXAoXG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRwcm9ncmFtOiBHUFVQcm9ncmFtLFxuXHRcdFx0aW5wdXQ/OiAgKERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSlbXSB8IERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSxcblx0XHRcdG91dHB1dD86IERhdGFMYXllciwgLy8gVW5kZWZpbmVkIHJlbmRlcnMgdG8gc2NyZWVuLlxuXHRcdFx0c2hvdWxkQmxlbmRBbHBoYT86IGJvb2xlYW4sXG5cdFx0fSxcblx0KSB7XG5cdFx0Y29uc3QgeyBnbCwgZXJyb3JTdGF0ZSwgcXVhZFBvc2l0aW9uc0J1ZmZlciB9ID0gdGhpcztcblx0XHRjb25zdCB7IHByb2dyYW0sIGlucHV0LCBvdXRwdXQgfSA9IHBhcmFtcztcblxuXHRcdC8vIElnbm9yZSBpZiB3ZSBhcmUgaW4gZXJyb3Igc3RhdGUuXG5cdFx0aWYgKGVycm9yU3RhdGUpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBnbFByb2dyYW0gPSBwcm9ncmFtLmRlZmF1bHRQcm9ncmFtITtcblxuXHRcdC8vIERvIHNldHVwIC0gdGhpcyBtdXN0IGNvbWUgZmlyc3QuXG5cdFx0dGhpcy5kcmF3U2V0dXAocHJvZ3JhbS5kZWZhdWx0UHJvZ3JhbSEsIHRydWUsIGlucHV0LCBvdXRwdXQpO1xuXG5cdFx0Ly8gVXBkYXRlIHVuaWZvcm1zIGFuZCBidWZmZXJzLlxuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3NjYWxlJywgWzEsIDFdLCBGTE9BVCk7XG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfdHJhbnNsYXRpb24nLCBbMCwgMF0sIEZMT0FUKTtcblx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgcXVhZFBvc2l0aW9uc0J1ZmZlcik7XG5cdFx0dGhpcy5zZXRQb3NpdGlvbkF0dHJpYnV0ZShnbFByb2dyYW0sIHByb2dyYW0ubmFtZSk7XG5cblx0XHQvLyBEcmF3LlxuXHRcdHRoaXMuc2V0QmxlbmRNb2RlKHBhcmFtcy5zaG91bGRCbGVuZEFscGhhKTtcblx0XHRnbC5kcmF3QXJyYXlzKGdsLlRSSUFOR0xFX1NUUklQLCAwLCA0KTtcblx0XHRnbC5kaXNhYmxlKGdsLkJMRU5EKTtcblx0fVxuXG5cdC8vIFN0ZXAgcHJvZ3JhbSBvbmx5IGZvciBhIHN0cmlwIG9mIHB4IGFsb25nIHRoZSBib3VuZGFyeS5cblx0c3RlcEJvdW5kYXJ5KFxuXHRcdHBhcmFtczoge1xuXHRcdFx0cHJvZ3JhbTogR1BVUHJvZ3JhbSxcblx0XHRcdGlucHV0PzogIChEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUpW10gfCBEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUsXG5cdFx0XHRvdXRwdXQ/OiBEYXRhTGF5ZXIsIC8vIFVuZGVmaW5lZCByZW5kZXJzIHRvIHNjcmVlbi5cblx0XHRcdHNpbmdsZUVkZ2U/OiAnTEVGVCcgfCAnUklHSFQnIHwgJ1RPUCcgfCAnQk9UVE9NJztcblx0XHRcdHNob3VsZEJsZW5kQWxwaGE/OiBib29sZWFuLFxuXHRcdH0sXG5cdCkge1xuXHRcdGNvbnN0IHsgZ2wsIGVycm9yU3RhdGUsIGJvdW5kYXJ5UG9zaXRpb25zQnVmZmVyfSA9IHRoaXM7XG5cdFx0Y29uc3QgeyBwcm9ncmFtLCBpbnB1dCwgb3V0cHV0IH0gPSBwYXJhbXM7XG5cdFx0Y29uc3QgWyB3aWR0aCwgaGVpZ2h0IF0gPSBvdXRwdXQgPyBvdXRwdXQuZ2V0RGltZW5zaW9ucygpIDogWyB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCBdO1xuXG5cdFx0Ly8gSWdub3JlIGlmIHdlIGFyZSBpbiBlcnJvciBzdGF0ZS5cblx0XHRpZiAoZXJyb3JTdGF0ZSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGdsUHJvZ3JhbSA9IHByb2dyYW0uZGVmYXVsdFByb2dyYW0hO1xuXG5cdFx0Ly8gRG8gc2V0dXAgLSB0aGlzIG11c3QgY29tZSBmaXJzdC5cblx0XHR0aGlzLmRyYXdTZXR1cChnbFByb2dyYW0sIGZhbHNlLCBpbnB1dCwgb3V0cHV0KTtcblxuXHRcdC8vIFVwZGF0ZSB1bmlmb3JtcyBhbmQgYnVmZmVycy5cblx0XHQvLyBGcmFtZSBuZWVkcyB0byBiZSBvZmZzZXQgYW5kIHNjYWxlZCBzbyB0aGF0IGFsbCBmb3VyIHNpZGVzIGFyZSBpbiB2aWV3cG9ydC5cblx0XHRjb25zdCBvbmVQeCA9IFsgMSAvIHdpZHRoLCAxIC8gaGVpZ2h0XSBhcyBbbnVtYmVyLCBudW1iZXJdO1xuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3NjYWxlJywgWzEgLSBvbmVQeFswXSwgMSAtIG9uZVB4WzFdXSwgRkxPQVQpO1xuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3RyYW5zbGF0aW9uJywgb25lUHgsIEZMT0FUKTtcblx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgYm91bmRhcnlQb3NpdGlvbnNCdWZmZXIpO1xuXHRcdHRoaXMuc2V0UG9zaXRpb25BdHRyaWJ1dGUoZ2xQcm9ncmFtLCBwcm9ncmFtLm5hbWUpO1xuXG5cdFx0Ly8gRHJhdy5cblx0XHR0aGlzLnNldEJsZW5kTW9kZShwYXJhbXMuc2hvdWxkQmxlbmRBbHBoYSk7XG5cdFx0aWYgKHBhcmFtcy5zaW5nbGVFZGdlKSB7XG5cdFx0XHRzd2l0Y2gocGFyYW1zLnNpbmdsZUVkZ2UpIHtcblx0XHRcdFx0Y2FzZSAnTEVGVCc6XG5cdFx0XHRcdFx0Z2wuZHJhd0FycmF5cyhnbC5MSU5FUywgMywgMik7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgJ1JJR0hUJzpcblx0XHRcdFx0XHRnbC5kcmF3QXJyYXlzKGdsLkxJTkVTLCAxLCAyKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAnVE9QJzpcblx0XHRcdFx0XHRnbC5kcmF3QXJyYXlzKGdsLkxJTkVTLCAyLCAyKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAnQk9UVE9NJzpcblx0XHRcdFx0XHRnbC5kcmF3QXJyYXlzKGdsLkxJTkVTLCAwLCAyKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gYm91bmRhcnkgZWRnZSB0eXBlOiAke3BhcmFtcy5zaW5nbGVFZGdlfS5gKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0Z2wuZHJhd0FycmF5cyhnbC5MSU5FX0xPT1AsIDAsIDQpO1xuXHRcdH1cblx0XHRnbC5kaXNhYmxlKGdsLkJMRU5EKTtcblx0fVxuXG5cdC8vIFN0ZXAgcHJvZ3JhbSBmb3IgYWxsIGJ1dCBhIHN0cmlwIG9mIHB4IGFsb25nIHRoZSBib3VuZGFyeS5cblx0c3RlcE5vbkJvdW5kYXJ5KFxuXHRcdHBhcmFtczoge1xuXHRcdFx0cHJvZ3JhbTogR1BVUHJvZ3JhbSxcblx0XHRcdGlucHV0PzogIChEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUpW10gfCBEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUsXG5cdFx0XHRvdXRwdXQ/OiBEYXRhTGF5ZXIsIC8vIFVuZGVmaW5lZCByZW5kZXJzIHRvIHNjcmVlbi5cblx0XHRcdHNob3VsZEJsZW5kQWxwaGE/OiBib29sZWFuLFxuXHRcdH0sXG5cdCkge1xuXHRcdGNvbnN0IHsgZ2wsIGVycm9yU3RhdGUsIHF1YWRQb3NpdGlvbnNCdWZmZXIgfSA9IHRoaXM7XG5cdFx0Y29uc3QgeyBwcm9ncmFtLCBpbnB1dCwgb3V0cHV0IH0gPSBwYXJhbXM7XG5cdFx0Y29uc3QgWyB3aWR0aCwgaGVpZ2h0IF0gPSBvdXRwdXQgPyBvdXRwdXQuZ2V0RGltZW5zaW9ucygpIDogWyB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCBdO1xuXG5cdFx0Ly8gSWdub3JlIGlmIHdlIGFyZSBpbiBlcnJvciBzdGF0ZS5cblx0XHRpZiAoZXJyb3JTdGF0ZSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGdsUHJvZ3JhbSA9IHByb2dyYW0uZGVmYXVsdFByb2dyYW0hO1xuXG5cdFx0Ly8gRG8gc2V0dXAgLSB0aGlzIG11c3QgY29tZSBmaXJzdC5cblx0XHR0aGlzLmRyYXdTZXR1cChnbFByb2dyYW0sIGZhbHNlLCBpbnB1dCwgb3V0cHV0KTtcblxuXHRcdC8vIFVwZGF0ZSB1bmlmb3JtcyBhbmQgYnVmZmVycy5cblx0XHRjb25zdCBvbmVQeCA9IFsgMSAvIHdpZHRoLCAxIC8gaGVpZ2h0XSBhcyBbbnVtYmVyLCBudW1iZXJdO1xuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3NjYWxlJywgWzEgLSAyICogb25lUHhbMF0sIDEgLSAyICogb25lUHhbMV1dLCBGTE9BVCk7XG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfdHJhbnNsYXRpb24nLCBvbmVQeCwgRkxPQVQpO1xuXHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBxdWFkUG9zaXRpb25zQnVmZmVyKTtcblx0XHR0aGlzLnNldFBvc2l0aW9uQXR0cmlidXRlKGdsUHJvZ3JhbSwgcHJvZ3JhbS5uYW1lKTtcblx0XHRcblx0XHQvLyBEcmF3LlxuXHRcdHRoaXMuc2V0QmxlbmRNb2RlKHBhcmFtcy5zaG91bGRCbGVuZEFscGhhKTtcblx0XHRnbC5kcmF3QXJyYXlzKGdsLlRSSUFOR0xFX1NUUklQLCAwLCA0KTtcblx0XHRnbC5kaXNhYmxlKGdsLkJMRU5EKTtcblx0fVxuXG5cdC8vIFN0ZXAgcHJvZ3JhbSBvbmx5IGZvciBhIGNpcmN1bGFyIHNwb3QuXG5cdHN0ZXBDaXJjbGUoXG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRwcm9ncmFtOiBHUFVQcm9ncmFtLFxuXHRcdFx0cG9zaXRpb246IFtudW1iZXIsIG51bWJlcl0sIC8vIFBvc2l0aW9uIGlzIGluIHNjcmVlbiBzcGFjZSBjb29yZHMuXG5cdFx0XHRyYWRpdXM6IG51bWJlciwgLy8gUmFkaXVzIGlzIGluIHNjcmVlbiBzcGFjZSB1bml0cy5cblx0XHRcdGlucHV0PzogIChEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUpW10gfCBEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUsXG5cdFx0XHRvdXRwdXQ/OiBEYXRhTGF5ZXIsIC8vIFVuZGVmaW5lZCByZW5kZXJzIHRvIHNjcmVlbi5cblx0XHRcdG51bVNlZ21lbnRzPzogbnVtYmVyLFxuXHRcdFx0c2hvdWxkQmxlbmRBbHBoYT86IGJvb2xlYW4sXG5cdFx0fSxcblx0KSB7XG5cdFx0Y29uc3QgeyBnbCwgZXJyb3JTdGF0ZSwgd2lkdGgsIGhlaWdodCB9ID0gdGhpcztcblx0XHRjb25zdCB7IHByb2dyYW0sIHBvc2l0aW9uLCByYWRpdXMsIGlucHV0LCBvdXRwdXQgfSA9IHBhcmFtcztcblxuXHRcdC8vIElnbm9yZSBpZiB3ZSBhcmUgaW4gZXJyb3Igc3RhdGUuXG5cdFx0aWYgKGVycm9yU3RhdGUpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBnbFByb2dyYW0gPSBwcm9ncmFtLmRlZmF1bHRQcm9ncmFtITtcblxuXHRcdC8vIERvIHNldHVwIC0gdGhpcyBtdXN0IGNvbWUgZmlyc3QuXG5cdFx0dGhpcy5kcmF3U2V0dXAoZ2xQcm9ncmFtLCBmYWxzZSwgaW5wdXQsIG91dHB1dCk7XG5cblx0XHQvLyBVcGRhdGUgdW5pZm9ybXMgYW5kIGJ1ZmZlcnMuXG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfc2NhbGUnLCBbcmFkaXVzICogMiAvIHdpZHRoLCByYWRpdXMgKiAyIC8gaGVpZ2h0XSwgRkxPQVQpO1xuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3RyYW5zbGF0aW9uJywgWzIgKiBwb3NpdGlvblswXSAvIHdpZHRoIC0gMSwgMiAqIHBvc2l0aW9uWzFdIC8gaGVpZ2h0IC0gMV0sIEZMT0FUKTtcblx0XHRjb25zdCBudW1TZWdtZW50cyA9IHBhcmFtcy5udW1TZWdtZW50cyA/IHBhcmFtcy5udW1TZWdtZW50cyA6IERFRkFVTFRfQ0lSQ0xFX05VTV9TRUdNRU5UUztcblx0XHRpZiAobnVtU2VnbWVudHMgPCAzKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYG51bVNlZ21lbnRzIGZvciBXZWJHTENvbXB1dGUuc3RlcENpcmNsZSBtdXN0IGJlIGdyZWF0ZXIgdGhhbiAyLCBnb3QgJHtudW1TZWdtZW50c30uYCk7XG5cdFx0fVxuXHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLmdldENpcmNsZVBvc2l0aW9uc0J1ZmZlcihudW1TZWdtZW50cykpO1xuXHRcdHRoaXMuc2V0UG9zaXRpb25BdHRyaWJ1dGUoZ2xQcm9ncmFtLCBwcm9ncmFtLm5hbWUpO1xuXHRcdFxuXHRcdC8vIERyYXcuXG5cdFx0dGhpcy5zZXRCbGVuZE1vZGUocGFyYW1zLnNob3VsZEJsZW5kQWxwaGEpO1xuXHRcdGdsLmRyYXdBcnJheXMoZ2wuVFJJQU5HTEVfRkFOLCAwLCBudW1TZWdtZW50cyArIDIpO1x0XG5cdFx0Z2wuZGlzYWJsZShnbC5CTEVORCk7XG5cdH1cblxuXHQvLyBTdGVwIHByb2dyYW0gb25seSBmb3IgYSB0aGlja2VuZWQgbGluZSBzZWdtZW50IChyb3VuZGVkIGVuZCBjYXBzIGF2YWlsYWJsZSkuXG5cdHN0ZXBTZWdtZW50KFxuXHRcdHBhcmFtczoge1xuXHRcdFx0cHJvZ3JhbTogR1BVUHJvZ3JhbSxcblx0XHRcdHBvc2l0aW9uMTogW251bWJlciwgbnVtYmVyXSwgLy8gUG9zaXRpb24gaXMgaW4gc2NyZWVuIHNwYWNlIGNvb3Jkcy5cblx0XHRcdHBvc2l0aW9uMjogW251bWJlciwgbnVtYmVyXSwgLy8gUG9zaXRpb24gaXMgaW4gc2NyZWVuIHNwYWNlIGNvb3Jkcy5cblx0XHRcdHRoaWNrbmVzczogbnVtYmVyLCAvLyBUaGlja25lc3MgaXMgaW4gcHguXG5cdFx0XHRpbnB1dD86ICAoRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlKVtdIHwgRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlLFxuXHRcdFx0b3V0cHV0PzogRGF0YUxheWVyLCAvLyBVbmRlZmluZWQgcmVuZGVycyB0byBzY3JlZW4uXG5cdFx0XHRlbmRDYXBzPzogYm9vbGVhbixcblx0XHRcdG51bUNhcFNlZ21lbnRzPzogbnVtYmVyLFxuXHRcdFx0c2hvdWxkQmxlbmRBbHBoYT86IGJvb2xlYW4sXG5cdFx0fSxcblx0KSB7XG5cdFx0Y29uc3QgeyBnbCwgZXJyb3JTdGF0ZSB9ID0gdGhpcztcblx0XHRjb25zdCB7IHByb2dyYW0sIHBvc2l0aW9uMSwgcG9zaXRpb24yLCB0aGlja25lc3MsIGlucHV0LCBvdXRwdXQgfSA9IHBhcmFtcztcblx0XHRjb25zdCBbIHdpZHRoLCBoZWlnaHQgXSA9IG91dHB1dCA/IG91dHB1dC5nZXREaW1lbnNpb25zKCkgOiBbIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0IF07XG5cblx0XHQvLyBJZ25vcmUgaWYgd2UgYXJlIGluIGVycm9yIHN0YXRlLlxuXHRcdGlmIChlcnJvclN0YXRlKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgZ2xQcm9ncmFtID0gcHJvZ3JhbS5zZWdtZW50UHJvZ3JhbSE7XG5cblx0XHQvLyBEbyBzZXR1cCAtIHRoaXMgbXVzdCBjb21lIGZpcnN0LlxuXHRcdHRoaXMuZHJhd1NldHVwKGdsUHJvZ3JhbSwgZmFsc2UsIGlucHV0LCBvdXRwdXQpO1xuXG5cdFx0Ly8gVXBkYXRlIHVuaWZvcm1zIGFuZCBidWZmZXJzLlxuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX2hhbGZUaGlja25lc3MnLCB0aGlja25lc3MgLyAyLCBGTE9BVCk7XG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfc2NhbGUnLCBbMiAvIHdpZHRoLCAyIC8gaGVpZ2h0XSwgRkxPQVQpO1xuXHRcdGNvbnN0IGRpZmZYID0gcG9zaXRpb24xWzBdIC0gcG9zaXRpb24yWzBdO1xuXHRcdGNvbnN0IGRpZmZZID0gcG9zaXRpb24xWzFdIC0gcG9zaXRpb24yWzFdO1xuXHRcdGNvbnN0IGFuZ2xlID0gTWF0aC5hdGFuMihkaWZmWSwgZGlmZlgpO1xuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3JvdGF0aW9uJywgYW5nbGUsIEZMT0FUKTtcblx0XHRjb25zdCBjZW50ZXJYID0gKHBvc2l0aW9uMVswXSArIHBvc2l0aW9uMlswXSkgLyAyO1xuXHRcdGNvbnN0IGNlbnRlclkgPSAocG9zaXRpb24xWzFdICsgcG9zaXRpb24yWzFdKSAvIDI7XG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfdHJhbnNsYXRpb24nLCBbMiAqIGNlbnRlclggLyB0aGlzLndpZHRoIC0gMSwgMiAqIGNlbnRlclkgLyB0aGlzLmhlaWdodCAtIDFdLCBGTE9BVCk7XG5cdFx0Y29uc3QgbGVuZ3RoID0gTWF0aC5zcXJ0KGRpZmZYICogZGlmZlggKyBkaWZmWSAqIGRpZmZZKTtcblx0XHRcblx0XHRjb25zdCBudW1TZWdtZW50cyA9IHBhcmFtcy5udW1DYXBTZWdtZW50cyA/IHBhcmFtcy5udW1DYXBTZWdtZW50cyAqIDIgOiBERUZBVUxUX0NJUkNMRV9OVU1fU0VHTUVOVFM7XG5cdFx0aWYgKHBhcmFtcy5lbmRDYXBzKSB7XG5cdFx0XHRpZiAobnVtU2VnbWVudHMgPCA2IHx8IG51bVNlZ21lbnRzICUgNiAhPT0gMCkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYG51bVNlZ21lbnRzIGZvciBXZWJHTENvbXB1dGUuc3RlcFNlZ21lbnQgbXVzdCBiZSBkaXZpc2libGUgYnkgNiwgZ290ICR7bnVtU2VnbWVudHN9LmApO1xuXHRcdFx0fVxuXHRcdFx0Ly8gSGF2ZSB0byBzdWJ0cmFjdCBhIHNtYWxsIG9mZnNldCBmcm9tIGxlbmd0aC5cblx0XHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX2xlbmd0aCcsIGxlbmd0aCAtIHRoaWNrbmVzcyAqIE1hdGguc2luKE1hdGguUEkgLyBudW1TZWdtZW50cyksIEZMT0FUKTtcblx0XHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLmdldENpcmNsZVBvc2l0aW9uc0J1ZmZlcihudW1TZWdtZW50cykpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBIYXZlIHRvIHN1YnRyYWN0IGEgc21hbGwgb2Zmc2V0IGZyb20gbGVuZ3RoLlxuXHRcdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfbGVuZ3RoJywgbGVuZ3RoIC0gdGhpY2tuZXNzLCBGTE9BVCk7XG5cdFx0XHQvLyBVc2UgYSByZWN0YW5nbGUgaW4gY2FzZSBvZiBubyBjYXBzLlxuXHRcdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHRoaXMucXVhZFBvc2l0aW9uc0J1ZmZlcik7XG5cdFx0fVxuXG5cdFx0dGhpcy5zZXRQb3NpdGlvbkF0dHJpYnV0ZShnbFByb2dyYW0sIHByb2dyYW0ubmFtZSk7XG5cdFx0XG5cdFx0Ly8gRHJhdy5cblx0XHR0aGlzLnNldEJsZW5kTW9kZShwYXJhbXMuc2hvdWxkQmxlbmRBbHBoYSk7XG5cdFx0aWYgKHBhcmFtcy5lbmRDYXBzKSB7XG5cdFx0XHRnbC5kcmF3QXJyYXlzKGdsLlRSSUFOR0xFX0ZBTiwgMCwgbnVtU2VnbWVudHMgKyAyKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Z2wuZHJhd0FycmF5cyhnbC5UUklBTkdMRV9TVFJJUCwgMCwgNCk7XG5cdFx0fVxuXHRcdGdsLmRpc2FibGUoZ2wuQkxFTkQpO1xuXHR9XG5cblx0c3RlcFBvbHlsaW5lKFxuXHRcdHBhcmFtczoge1xuXHRcdFx0cHJvZ3JhbTogR1BVUHJvZ3JhbSxcblx0XHRcdHBvc2l0aW9uczogW251bWJlciwgbnVtYmVyXVtdLFxuXHRcdFx0dGhpY2tuZXNzOiBudW1iZXIsIC8vIFRoaWNrbmVzcyBvZiBsaW5lIGlzIGluIHB4LlxuXHRcdFx0aW5wdXQ/OiAoRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlKVtdIHwgRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlLFxuXHRcdFx0b3V0cHV0PzogRGF0YUxheWVyLCAvLyBVbmRlZmluZWQgcmVuZGVycyB0byBzY3JlZW4uXG5cdFx0XHRjbG9zZUxvb3A/OiBib29sZWFuLFxuXHRcdFx0Ly8gaW5jbHVkZVVWcz86IGJvb2xlYW4sXG5cdFx0XHQvLyBpbmNsdWRlTm9ybWFscz86IGJvb2xlYW4sXG5cdFx0XHRzaG91bGRCbGVuZEFscGhhPzogYm9vbGVhbixcblx0XHR9LFxuXHQpIHtcblx0XHRjb25zdCB7IHByb2dyYW0sIGlucHV0LCBvdXRwdXQgfSA9IHBhcmFtcztcblx0XHRjb25zdCB2ZXJ0aWNlcyA9IHBhcmFtcy5wb3NpdGlvbnM7XG5cdFx0Y29uc3QgY2xvc2VMb29wID0gISFwYXJhbXMuY2xvc2VMb29wO1xuXHRcdGNvbnN0IGhhbGZUaGlja25lc3MgPSBwYXJhbXMudGhpY2tuZXNzIC8gMjtcblx0XHRjb25zdCB7IGdsLCB3aWR0aCwgaGVpZ2h0LCBlcnJvclN0YXRlIH0gPSB0aGlzO1xuXG5cdFx0Ly8gSWdub3JlIGlmIHdlIGFyZSBpbiBlcnJvciBzdGF0ZS5cblx0XHRpZiAoZXJyb3JTdGF0ZSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIE9mZnNldCB2ZXJ0aWNlcy5cblx0XHRjb25zdCBudW1Qb3NpdGlvbnMgPSBjbG9zZUxvb3AgPyB2ZXJ0aWNlcy5sZW5ndGggKiA0ICsgMiA6ICh2ZXJ0aWNlcy5sZW5ndGggLSAxKSAqIDQ7XG5cdFx0Y29uc3QgcG9zaXRpb25zID0gbmV3IEZsb2F0MzJBcnJheSgyICogbnVtUG9zaXRpb25zKTtcblx0XHQvLyBjb25zdCB1dnMgPSBwYXJhbXMuaW5jbHVkZVVWcyA/IG5ldyBGbG9hdDMyQXJyYXkoMiAqIG51bVBvc2l0aW9ucykgOiB1bmRlZmluZWQ7XG5cdFx0Ly8gY29uc3Qgbm9ybWFscyA9IHBhcmFtcy5pbmNsdWRlTm9ybWFscyA/IG5ldyBGbG9hdDMyQXJyYXkoMiAqIG51bVBvc2l0aW9ucykgOiB1bmRlZmluZWQ7XG5cdFx0Y29uc3QgdXZzID0gbmV3IEZsb2F0MzJBcnJheSgyICogbnVtUG9zaXRpb25zKTtcblx0XHRjb25zdCBub3JtYWxzID0gbmV3IEZsb2F0MzJBcnJheSgyICogbnVtUG9zaXRpb25zKTtcblxuXHRcdC8vIHRtcCBhcnJheXMuXG5cdFx0Y29uc3QgczEgPSBbMCwgMF07XG5cdFx0Y29uc3QgczIgPSBbMCwgMF07XG5cdFx0Y29uc3QgbjEgPSBbMCwgMF07XG5cdFx0Y29uc3QgbjIgPSBbMCwgMF07XG5cdFx0Y29uc3QgbjMgPSBbMCwgMF07XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB2ZXJ0aWNlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0aWYgKCFjbG9zZUxvb3AgJiYgaSA9PT0gdmVydGljZXMubGVuZ3RoIC0gMSkgY29udGludWU7XG5cdFx0XHQvLyBWZXJ0aWNlcyBvbiB0aGlzIHNlZ21lbnQuXG5cdFx0XHRjb25zdCB2MSA9IHZlcnRpY2VzW2ldO1xuXHRcdFx0Y29uc3QgdjIgPSB2ZXJ0aWNlc1soaSArIDEpICUgdmVydGljZXMubGVuZ3RoXTtcblx0XHRcdHMxWzBdID0gdjJbMF0gLSB2MVswXTtcblx0XHRcdHMxWzFdID0gdjJbMV0gLSB2MVsxXTtcblx0XHRcdGNvbnN0IGxlbmd0aDEgPSBNYXRoLnNxcnQoczFbMF0gKiBzMVswXSArIHMxWzFdICogczFbMV0pO1xuXHRcdFx0bjFbMF0gPSBzMVsxXSAvIGxlbmd0aDE7XG5cdFx0XHRuMVsxXSA9IC0gczFbMF0gLyBsZW5ndGgxO1xuXG5cdFx0XHRjb25zdCBpbmRleCA9IGkgKiA0ICsgMjtcblxuXHRcdFx0aWYgKCFjbG9zZUxvb3AgJiYgaSA9PT0gMCkge1xuXHRcdFx0XHQvLyBBZGQgc3RhcnRpbmcgcG9pbnRzIHRvIHBvc2l0aW9ucyBhcnJheS5cblx0XHRcdFx0cG9zaXRpb25zWzBdID0gdjFbMF0gKyBuMVswXSAqIGhhbGZUaGlja25lc3M7XG5cdFx0XHRcdHBvc2l0aW9uc1sxXSA9IHYxWzFdICsgbjFbMV0gKiBoYWxmVGhpY2tuZXNzO1xuXHRcdFx0XHRwb3NpdGlvbnNbMl0gPSB2MVswXSAtIG4xWzBdICogaGFsZlRoaWNrbmVzcztcblx0XHRcdFx0cG9zaXRpb25zWzNdID0gdjFbMV0gLSBuMVsxXSAqIGhhbGZUaGlja25lc3M7XG5cdFx0XHRcdGlmICh1dnMpIHtcblx0XHRcdFx0XHR1dnNbMF0gPSAwO1xuXHRcdFx0XHRcdHV2c1sxXSA9IDE7XG5cdFx0XHRcdFx0dXZzWzJdID0gMDtcblx0XHRcdFx0XHR1dnNbM10gPSAwO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChub3JtYWxzKSB7XG5cdFx0XHRcdFx0bm9ybWFsc1swXSA9IG4xWzBdO1xuXHRcdFx0XHRcdG5vcm1hbHNbMV0gPSBuMVsxXTtcblx0XHRcdFx0XHRub3JtYWxzWzJdID0gbjFbMF07XG5cdFx0XHRcdFx0bm9ybWFsc1szXSA9IG4xWzFdO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHUgPSAoaSArIDEpIC8gKHZlcnRpY2VzLmxlbmd0aCAtIDEpO1xuXG5cdFx0XHQvLyBPZmZzZXQgZnJvbSB2Mi5cblx0XHRcdHBvc2l0aW9uc1syICogaW5kZXhdID0gdjJbMF0gKyBuMVswXSAqIGhhbGZUaGlja25lc3M7XG5cdFx0XHRwb3NpdGlvbnNbMiAqIGluZGV4ICsgMV0gPSB2MlsxXSArIG4xWzFdICogaGFsZlRoaWNrbmVzcztcblx0XHRcdHBvc2l0aW9uc1syICogaW5kZXggKyAyXSA9IHYyWzBdIC0gbjFbMF0gKiBoYWxmVGhpY2tuZXNzO1xuXHRcdFx0cG9zaXRpb25zWzIgKiBpbmRleCArIDNdID0gdjJbMV0gLSBuMVsxXSAqIGhhbGZUaGlja25lc3M7XG5cdFx0XHRpZiAodXZzKSB7XG5cdFx0XHRcdHV2c1syICogaW5kZXhdID0gdTtcblx0XHRcdFx0dXZzWzIgKiBpbmRleCArIDFdID0gMTtcblx0XHRcdFx0dXZzWzIgKiBpbmRleCArIDJdID0gdTtcblx0XHRcdFx0dXZzWzIgKiBpbmRleCArIDNdID0gMDtcblx0XHRcdH1cblx0XHRcdGlmIChub3JtYWxzKSB7XG5cdFx0XHRcdG5vcm1hbHNbMiAqIGluZGV4XSA9IG4xWzBdO1xuXHRcdFx0XHRub3JtYWxzWzIgKiBpbmRleCArIDFdID0gbjFbMV07XG5cdFx0XHRcdG5vcm1hbHNbMiAqIGluZGV4ICsgMl0gPSBuMVswXTtcblx0XHRcdFx0bm9ybWFsc1syICogaW5kZXggKyAzXSA9IG4xWzFdO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoKGkgPCB2ZXJ0aWNlcy5sZW5ndGggLSAyKSB8fCBjbG9zZUxvb3ApIHtcblx0XHRcdFx0Ly8gVmVydGljZXMgb24gbmV4dCBzZWdtZW50LlxuXHRcdFx0XHRjb25zdCB2MyA9IHZlcnRpY2VzWyhpICsgMSkgJSB2ZXJ0aWNlcy5sZW5ndGhdO1xuXHRcdFx0XHRjb25zdCB2NCA9IHZlcnRpY2VzWyhpICsgMikgJSB2ZXJ0aWNlcy5sZW5ndGhdO1xuXHRcdFx0XHRzMlswXSA9IHY0WzBdIC0gdjNbMF07XG5cdFx0XHRcdHMyWzFdID0gdjRbMV0gLSB2M1sxXTtcblx0XHRcdFx0Y29uc3QgbGVuZ3RoMiA9IE1hdGguc3FydChzMlswXSAqIHMyWzBdICsgczJbMV0gKiBzMlsxXSk7XG5cdFx0XHRcdG4yWzBdID0gczJbMV0gLyBsZW5ndGgyO1xuXHRcdFx0XHRuMlsxXSA9IC0gczJbMF0gLyBsZW5ndGgyO1xuXG5cdFx0XHRcdC8vIE9mZnNldCBmcm9tIHYzXG5cdFx0XHRcdHBvc2l0aW9uc1syICogKChpbmRleCArIDIpICUgKDQgKiB2ZXJ0aWNlcy5sZW5ndGgpKV0gPSB2M1swXSArIG4yWzBdICogaGFsZlRoaWNrbmVzcztcblx0XHRcdFx0cG9zaXRpb25zWzIgKiAoKGluZGV4ICsgMikgJSAoNCAqIHZlcnRpY2VzLmxlbmd0aCkpICsgMV0gPSB2M1sxXSArIG4yWzFdICogaGFsZlRoaWNrbmVzcztcblx0XHRcdFx0cG9zaXRpb25zWzIgKiAoKGluZGV4ICsgMikgJSAoNCAqIHZlcnRpY2VzLmxlbmd0aCkpICsgMl0gPSB2M1swXSAtIG4yWzBdICogaGFsZlRoaWNrbmVzcztcblx0XHRcdFx0cG9zaXRpb25zWzIgKiAoKGluZGV4ICsgMikgJSAoNCAqIHZlcnRpY2VzLmxlbmd0aCkpICsgM10gPSB2M1sxXSAtIG4yWzFdICogaGFsZlRoaWNrbmVzcztcblx0XHRcdFx0aWYgKHV2cykge1xuXHRcdFx0XHRcdHV2c1syICogKChpbmRleCArIDIpICUgKDQgKiB2ZXJ0aWNlcy5sZW5ndGgpKV0gPSB1O1xuXHRcdFx0XHRcdHV2c1syICogKChpbmRleCArIDIpICUgKDQgKiB2ZXJ0aWNlcy5sZW5ndGgpKSArIDFdID0gMTtcblx0XHRcdFx0XHR1dnNbMiAqICgoaW5kZXggKyAyKSAlICg0ICogdmVydGljZXMubGVuZ3RoKSkgKyAyXSA9IHU7XG5cdFx0XHRcdFx0dXZzWzIgKiAoKGluZGV4ICsgMikgJSAoNCAqIHZlcnRpY2VzLmxlbmd0aCkpICsgM10gPSAwO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChub3JtYWxzKSB7XG5cdFx0XHRcdFx0bm9ybWFsc1syICogKChpbmRleCArIDIpICUgKDQgKiB2ZXJ0aWNlcy5sZW5ndGgpKV0gPSBuMlswXTtcblx0XHRcdFx0XHRub3JtYWxzWzIgKiAoKGluZGV4ICsgMikgJSAoNCAqIHZlcnRpY2VzLmxlbmd0aCkpICsgMV0gPSBuMlsxXTtcblx0XHRcdFx0XHRub3JtYWxzWzIgKiAoKGluZGV4ICsgMikgJSAoNCAqIHZlcnRpY2VzLmxlbmd0aCkpICsgMl0gPSBuMlswXTtcblx0XHRcdFx0XHRub3JtYWxzWzIgKiAoKGluZGV4ICsgMikgJSAoNCAqIHZlcnRpY2VzLmxlbmd0aCkpICsgM10gPSBuMlsxXTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIENoZWNrIHRoZSBhbmdsZSBiZXR3ZWVuIGFkamFjZW50IHNlZ21lbnRzLlxuXHRcdFx0XHRjb25zdCBjcm9zcyA9IG4xWzBdICogbjJbMV0gLSBuMVsxXSAqIG4yWzBdO1xuXHRcdFx0XHRpZiAoTWF0aC5hYnMoY3Jvc3MpIDwgMWUtNikgY29udGludWU7XG5cdFx0XHRcdG4zWzBdID0gbjFbMF0gKyBuMlswXTtcblx0XHRcdFx0bjNbMV0gPSBuMVsxXSArIG4yWzFdO1xuXHRcdFx0XHRjb25zdCBsZW5ndGgzID0gTWF0aC5zcXJ0KG4zWzBdICogbjNbMF0gKyBuM1sxXSAqIG4zWzFdKTtcblx0XHRcdFx0bjNbMF0gLz0gbGVuZ3RoMztcblx0XHRcdFx0bjNbMV0gLz0gbGVuZ3RoMztcblx0XHRcdFx0Ly8gTWFrZSBhZGp1c3RtZW50cyB0byBwb3NpdGlvbnMuXG5cdFx0XHRcdGNvbnN0IGFuZ2xlID0gTWF0aC5hY29zKG4xWzBdICogbjJbMF0gKyBuMVsxXSAqIG4yWzFdKTtcblx0XHRcdFx0Y29uc3Qgb2Zmc2V0ID0gaGFsZlRoaWNrbmVzcyAvIE1hdGguY29zKGFuZ2xlIC8gMik7XG5cdFx0XHRcdGlmIChjcm9zcyA8IDApIHtcblx0XHRcdFx0XHRwb3NpdGlvbnNbMiAqIGluZGV4XSA9IHYyWzBdICsgbjNbMF0gKiBvZmZzZXQ7XG5cdFx0XHRcdFx0cG9zaXRpb25zWzIgKiBpbmRleCArIDFdID0gdjJbMV0gKyBuM1sxXSAqIG9mZnNldDtcblx0XHRcdFx0XHRwb3NpdGlvbnNbMiAqICgoaW5kZXggKyAyKSAlICg0ICogdmVydGljZXMubGVuZ3RoKSldID0gcG9zaXRpb25zWzIgKiBpbmRleF07XG5cdFx0XHRcdFx0cG9zaXRpb25zWzIgKiAoKGluZGV4ICsgMikgJSAoNCAqIHZlcnRpY2VzLmxlbmd0aCkpICsgMV0gPSBwb3NpdGlvbnNbMiAqIGluZGV4ICsgMV07XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cG9zaXRpb25zWzIgKiBpbmRleCArIDJdID0gdjJbMF0gLSBuM1swXSAqIG9mZnNldDtcblx0XHRcdFx0XHRwb3NpdGlvbnNbMiAqIGluZGV4ICsgM10gPSB2MlsxXSAtIG4zWzFdICogb2Zmc2V0O1xuXHRcdFx0XHRcdHBvc2l0aW9uc1syICogKChpbmRleCArIDIpICUgKDQgKiB2ZXJ0aWNlcy5sZW5ndGgpKSArIDJdID0gcG9zaXRpb25zWzIgKiBpbmRleCArIDJdO1xuXHRcdFx0XHRcdHBvc2l0aW9uc1syICogKChpbmRleCArIDIpICUgKDQgKiB2ZXJ0aWNlcy5sZW5ndGgpKSArIDNdID0gcG9zaXRpb25zWzIgKiBpbmRleCArIDNdO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmIChjbG9zZUxvb3ApIHtcblx0XHRcdC8vIER1cGxpY2F0ZSBzdGFydGluZyBwb2ludHMgdG8gZW5kIG9mIHBvc2l0aW9ucyBhcnJheS5cblx0XHRcdHBvc2l0aW9uc1t2ZXJ0aWNlcy5sZW5ndGggKiA4XSA9IHBvc2l0aW9uc1swXTtcblx0XHRcdHBvc2l0aW9uc1t2ZXJ0aWNlcy5sZW5ndGggKiA4ICsgMV0gPSBwb3NpdGlvbnNbMV07XG5cdFx0XHRwb3NpdGlvbnNbdmVydGljZXMubGVuZ3RoICogOCArIDJdID0gcG9zaXRpb25zWzJdO1xuXHRcdFx0cG9zaXRpb25zW3ZlcnRpY2VzLmxlbmd0aCAqIDggKyAzXSA9IHBvc2l0aW9uc1szXTtcblx0XHRcdGlmICh1dnMpIHtcblx0XHRcdFx0dXZzW3ZlcnRpY2VzLmxlbmd0aCAqIDhdID0gdXZzWzBdO1xuXHRcdFx0XHR1dnNbdmVydGljZXMubGVuZ3RoICogOCArIDFdID0gdXZzWzFdO1xuXHRcdFx0XHR1dnNbdmVydGljZXMubGVuZ3RoICogOCArIDJdID0gdXZzWzJdO1xuXHRcdFx0XHR1dnNbdmVydGljZXMubGVuZ3RoICogOCArIDNdID0gdXZzWzNdO1xuXHRcdFx0fVxuXHRcdFx0aWYgKG5vcm1hbHMpIHtcblx0XHRcdFx0bm9ybWFsc1t2ZXJ0aWNlcy5sZW5ndGggKiA4XSA9IG5vcm1hbHNbMF07XG5cdFx0XHRcdG5vcm1hbHNbdmVydGljZXMubGVuZ3RoICogOCArIDFdID0gbm9ybWFsc1sxXTtcblx0XHRcdFx0bm9ybWFsc1t2ZXJ0aWNlcy5sZW5ndGggKiA4ICsgMl0gPSBub3JtYWxzWzJdO1xuXHRcdFx0XHRub3JtYWxzW3ZlcnRpY2VzLmxlbmd0aCAqIDggKyAzXSA9IG5vcm1hbHNbM107XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Y29uc3QgZ2xQcm9ncmFtID0gcHJvZ3JhbS5wb2x5bGluZVByb2dyYW0hO1xuXG5cdFx0Ly8gRG8gc2V0dXAgLSB0aGlzIG11c3QgY29tZSBmaXJzdC5cblx0XHR0aGlzLmRyYXdTZXR1cChnbFByb2dyYW0sIHRydWUsIGlucHV0LCBvdXRwdXQpO1xuXG5cdFx0Ly8gVXBkYXRlIHVuaWZvcm1zIGFuZCBidWZmZXJzLlxuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3NjYWxlJywgWzIgLyB3aWR0aCwgMiAvIGhlaWdodF0sIEZMT0FUKTtcblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF90cmFuc2xhdGlvbicsIFstMSwgLTFdLCBGTE9BVCk7XG5cdFx0Ly8gSW5pdCBwb3NpdGlvbnMgYnVmZmVyLlxuXHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLmluaXRWZXJ0ZXhCdWZmZXIocG9zaXRpb25zKSEpO1xuXHRcdHRoaXMuc2V0UG9zaXRpb25BdHRyaWJ1dGUoZ2xQcm9ncmFtLCBwcm9ncmFtLm5hbWUpO1xuXHRcdGlmICh1dnMpIHtcblx0XHRcdC8vIEluaXQgdXYgYnVmZmVyLlxuXHRcdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHRoaXMuaW5pdFZlcnRleEJ1ZmZlcih1dnMpISk7XG5cdFx0XHR0aGlzLnNldFVWQXR0cmlidXRlKGdsUHJvZ3JhbSwgcHJvZ3JhbS5uYW1lKTtcblx0XHR9XG5cdFx0aWYgKG5vcm1hbHMpIHtcblx0XHRcdC8vIEluaXQgbm9ybWFscyBidWZmZXIuXG5cdFx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdGhpcy5pbml0VmVydGV4QnVmZmVyKG5vcm1hbHMpISk7XG5cdFx0XHR0aGlzLnNldFZlcnRleEF0dHJpYnV0ZShnbFByb2dyYW0sICdhX2ludGVybmFsX25vcm1hbCcsIDIsIHByb2dyYW0ubmFtZSk7XG5cdFx0fVxuXG5cdFx0Ly8gRHJhdy5cblx0XHR0aGlzLnNldEJsZW5kTW9kZShwYXJhbXMuc2hvdWxkQmxlbmRBbHBoYSk7XG5cdFx0Z2wuZHJhd0FycmF5cyhnbC5UUklBTkdMRV9TVFJJUCwgMCwgbnVtUG9zaXRpb25zKTtcblx0XHRnbC5kaXNhYmxlKGdsLkJMRU5EKTtcblx0fVxuXG5cdHN0ZXBQb2ludHMoXG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRwb3NpdGlvbnM6IERhdGFMYXllciwgLy8gUG9zaXRpb25zIGluIGNhbnZhcyBweC5cblx0XHRcdHByb2dyYW0/OiBHUFVQcm9ncmFtLFxuXHRcdFx0aW5wdXQ/OiAoRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlKVtdIHwgRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlLFxuXHRcdFx0b3V0cHV0PzogRGF0YUxheWVyLFxuXHRcdFx0cG9pbnRTaXplPzogbnVtYmVyLFxuXHRcdFx0Y291bnQ/OiBudW1iZXIsXG5cdFx0XHRjb2xvcj86IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSxcblx0XHRcdHdyYXBYPzogYm9vbGVhbixcblx0XHRcdHdyYXBZPzogYm9vbGVhbixcblx0XHRcdHNob3VsZEJsZW5kQWxwaGE/OiBib29sZWFuLFxuXHRcdH0sXG5cdCkge1xuXHRcdGNvbnN0IHsgZ2wsIGVycm9yU3RhdGUsIHBvaW50SW5kZXhBcnJheSwgd2lkdGgsIGhlaWdodCB9ID0gdGhpcztcblx0XHRjb25zdCB7IHBvc2l0aW9ucywgb3V0cHV0IH0gPSBwYXJhbXM7XG5cblx0XHQvLyBJZ25vcmUgaWYgd2UgYXJlIGluIGVycm9yIHN0YXRlLlxuXHRcdGlmIChlcnJvclN0YXRlKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gQ2hlY2sgdGhhdCBudW1Qb2ludHMgaXMgdmFsaWQuXG5cdFx0aWYgKHBvc2l0aW9ucy5udW1Db21wb25lbnRzICE9PSAyICYmIHBvc2l0aW9ucy5udW1Db21wb25lbnRzICE9PSA0KSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFdlYkdMQ29tcHV0ZS5kcmF3UG9pbnRzKCkgbXVzdCBiZSBwYXNzZWQgYSBwb3NpdGlvbiBEYXRhTGF5ZXIgd2l0aCBlaXRoZXIgMiBvciA0IGNvbXBvbmVudHMsIGdvdCBwb3NpdGlvbiBEYXRhTGF5ZXIgXCIke3Bvc2l0aW9ucy5uYW1lfVwiIHdpdGggJHtwb3NpdGlvbnMubnVtQ29tcG9uZW50c30gY29tcG9uZW50cy5gKVxuXHRcdH1cblx0XHRjb25zdCBsZW5ndGggPSBwb3NpdGlvbnMuZ2V0TGVuZ3RoKCk7XG5cdFx0Y29uc3QgY291bnQgPSBwYXJhbXMuY291bnQgfHwgbGVuZ3RoO1xuXHRcdGlmIChjb3VudCA+IGxlbmd0aCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGNvdW50ICR7Y291bnR9IGZvciBwb3NpdGlvbiBEYXRhTGF5ZXIgb2YgbGVuZ3RoICR7bGVuZ3RofS5gKTtcblx0XHR9XG5cblx0XHRsZXQgcHJvZ3JhbSA9IHBhcmFtcy5wcm9ncmFtO1xuXHRcdGlmIChwcm9ncmFtID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHByb2dyYW0gPSB0aGlzLnNpbmdsZUNvbG9yUHJvZ3JhbTtcblx0XHRcdGNvbnN0IGNvbG9yID0gcGFyYW1zLmNvbG9yIHx8IFsxLCAwLCAwXTsgLy8gRGVmYXVsdCBvZiByZWQuXG5cdFx0XHRwcm9ncmFtLnNldFVuaWZvcm0oJ3VfY29sb3InLCBjb2xvciwgRkxPQVQpO1xuXHRcdH1cblx0XHRjb25zdCBnbFByb2dyYW0gPSBwcm9ncmFtLnBvaW50c1Byb2dyYW0hO1xuXG5cdFx0Ly8gQWRkIHBvc2l0aW9ucyB0byBlbmQgb2YgaW5wdXQgaWYgbmVlZGVkLlxuXHRcdGNvbnN0IGlucHV0ID0gdGhpcy5hZGRMYXllclRvSW5wdXRzKHBvc2l0aW9ucywgcGFyYW1zLmlucHV0KTtcblxuXHRcdC8vIERvIHNldHVwIC0gdGhpcyBtdXN0IGNvbWUgZmlyc3QuXG5cdFx0dGhpcy5kcmF3U2V0dXAoZ2xQcm9ncmFtLCBmYWxzZSwgaW5wdXQsIG91dHB1dCk7XG5cblx0XHQvLyBVcGRhdGUgdW5pZm9ybXMgYW5kIGJ1ZmZlcnMuXG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfcG9zaXRpb25zJywgaW5wdXQuaW5kZXhPZihwb3NpdGlvbnMpLCBJTlQpO1xuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3NjYWxlJywgWzEgLyB3aWR0aCwgMSAvIGhlaWdodF0sIEZMT0FUKTtcblx0XHQvLyBUZWxsIHdoZXRoZXIgd2UgYXJlIHVzaW5nIGFuIGFic29sdXRlIHBvc2l0aW9uICgyIGNvbXBvbmVudHMpLCBvciBwb3NpdGlvbiB3aXRoIGFjY3VtdWxhdGlvbiBidWZmZXIgKDQgY29tcG9uZW50cywgYmV0dGVyIGZsb2F0aW5nIHB0IGFjY3VyYWN5KS5cblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF9wb3NpdGlvbldpdGhBY2N1bXVsYXRpb24nLCBwb3NpdGlvbnMubnVtQ29tcG9uZW50cyA9PT0gNCA/IDEgOiAwLCBJTlQpO1xuXHRcdC8vIFNldCBkZWZhdWx0IHBvaW50U2l6ZS5cblx0XHRjb25zdCBwb2ludFNpemUgPSBwYXJhbXMucG9pbnRTaXplIHx8IDE7XG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfcG9pbnRTaXplJywgcG9pbnRTaXplLCBGTE9BVCk7XG5cdFx0Y29uc3QgcG9zaXRpb25MYXllckRpbWVuc2lvbnMgPSBwb3NpdGlvbnMuZ2V0RGltZW5zaW9ucygpO1xuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3Bvc2l0aW9uc0RpbWVuc2lvbnMnLCBwb3NpdGlvbkxheWVyRGltZW5zaW9ucywgRkxPQVQpO1xuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3dyYXBYJywgcGFyYW1zLndyYXBYID8gMSA6IDAsIElOVCk7XG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfd3JhcFknLCBwYXJhbXMud3JhcFkgPyAxIDogMCwgSU5UKTtcblx0XHRpZiAodGhpcy5wb2ludEluZGV4QnVmZmVyID09PSB1bmRlZmluZWQgfHwgKHBvaW50SW5kZXhBcnJheSAmJiBwb2ludEluZGV4QXJyYXkubGVuZ3RoIDwgY291bnQpKSB7XG5cdFx0XHQvLyBIYXZlIHRvIHVzZSBmbG9hdDMyIGFycmF5IGJjIGludCBpcyBub3Qgc3VwcG9ydGVkIGFzIGEgdmVydGV4IGF0dHJpYnV0ZSB0eXBlLlxuXHRcdFx0Y29uc3QgaW5kaWNlcyA9IG5ldyBGbG9hdDMyQXJyYXkobGVuZ3RoKTtcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aW5kaWNlc1tpXSA9IGk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLnBvaW50SW5kZXhBcnJheSA9IGluZGljZXM7XG5cdFx0XHR0aGlzLnBvaW50SW5kZXhCdWZmZXIgPSB0aGlzLmluaXRWZXJ0ZXhCdWZmZXIoaW5kaWNlcyk7XG5cdFx0fVxuXHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLnBvaW50SW5kZXhCdWZmZXIhKTtcblx0XHR0aGlzLnNldEluZGV4QXR0cmlidXRlKGdsUHJvZ3JhbSwgcHJvZ3JhbS5uYW1lKTtcblxuXHRcdC8vIERyYXcuXG5cdFx0dGhpcy5zZXRCbGVuZE1vZGUocGFyYW1zLnNob3VsZEJsZW5kQWxwaGEpO1xuXHRcdGdsLmRyYXdBcnJheXMoZ2wuUE9JTlRTLCAwLCBjb3VudCk7XG5cdFx0Z2wuZGlzYWJsZShnbC5CTEVORCk7XG5cdH1cblxuXHRkcmF3VmVjdG9yRmllbGQoXG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRmaWVsZDogRGF0YUxheWVyLFxuXHRcdFx0cHJvZ3JhbT86IEdQVVByb2dyYW0sXG5cdFx0XHRpbnB1dD86IChEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUpW10gfCBEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUsXG5cdFx0XHRvdXRwdXQ/OiBEYXRhTGF5ZXIsXG5cdFx0XHR2ZWN0b3JTcGFjaW5nPzogbnVtYmVyLFxuXHRcdFx0dmVjdG9yU2NhbGU/OiBudW1iZXIsXG5cdFx0XHRjb2xvcj86IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSxcblx0XHRcdHNob3VsZEJsZW5kQWxwaGE/OiBib29sZWFuLFxuXHRcdH0sXG5cdCkge1xuXHRcdGNvbnN0IHsgZ2wsIGVycm9yU3RhdGUsIHZlY3RvckZpZWxkSW5kZXhBcnJheSwgd2lkdGgsIGhlaWdodCB9ID0gdGhpcztcblx0XHRjb25zdCB7IGZpZWxkLCBvdXRwdXQgfSA9IHBhcmFtcztcblxuXHRcdC8vIElnbm9yZSBpZiB3ZSBhcmUgaW4gZXJyb3Igc3RhdGUuXG5cdFx0aWYgKGVycm9yU3RhdGUpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBDaGVjayB0aGF0IGZpZWxkIGlzIHZhbGlkLlxuXHRcdGlmIChmaWVsZC5udW1Db21wb25lbnRzICE9PSAyKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFdlYkdMQ29tcHV0ZS5kcmF3VmVjdG9yRmllbGQoKSBtdXN0IGJlIHBhc3NlZCBhIGZpZWxkTGF5ZXIgd2l0aCAyIGNvbXBvbmVudHMsIGdvdCBmaWVsZExheWVyIFwiJHtmaWVsZC5uYW1lfVwiIHdpdGggJHtmaWVsZC5udW1Db21wb25lbnRzfSBjb21wb25lbnRzLmApXG5cdFx0fVxuXHRcdC8vIENoZWNrIGFzcGVjdCByYXRpby5cblx0XHQvLyBjb25zdCBkaW1lbnNpb25zID0gdmVjdG9yTGF5ZXIuZ2V0RGltZW5zaW9ucygpO1xuXHRcdC8vIGlmIChNYXRoLmFicyhkaW1lbnNpb25zWzBdIC8gZGltZW5zaW9uc1sxXSAtIHdpZHRoIC8gaGVpZ2h0KSA+IDAuMDEpIHtcblx0XHQvLyBcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBhc3BlY3QgcmF0aW8gJHsoZGltZW5zaW9uc1swXSAvIGRpbWVuc2lvbnNbMV0pLnRvRml4ZWQoMyl9IHZlY3RvciBEYXRhTGF5ZXIgd2l0aCBkaW1lbnNpb25zIFske2RpbWVuc2lvbnNbMF19LCAke2RpbWVuc2lvbnNbMV19XSwgZXhwZWN0ZWQgJHsod2lkdGggLyBoZWlnaHQpLnRvRml4ZWQoMyl9LmApO1xuXHRcdC8vIH1cblxuXHRcdGxldCBwcm9ncmFtID0gcGFyYW1zLnByb2dyYW07XG5cdFx0aWYgKHByb2dyYW0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cHJvZ3JhbSA9IHRoaXMuc2luZ2xlQ29sb3JQcm9ncmFtO1xuXHRcdFx0Y29uc3QgY29sb3IgPSBwYXJhbXMuY29sb3IgfHwgWzEsIDAsIDBdOyAvLyBEZWZhdWx0IHRvIHJlZC5cblx0XHRcdHByb2dyYW0uc2V0VW5pZm9ybSgndV9jb2xvcicsIGNvbG9yLCBGTE9BVCk7XG5cdFx0fVxuXHRcdGNvbnN0IGdsUHJvZ3JhbSA9IHByb2dyYW0udmVjdG9yRmllbGRQcm9ncmFtITtcblxuXHRcdC8vIEFkZCBmaWVsZCB0byBlbmQgb2YgaW5wdXQgaWYgbmVlZGVkLlxuXHRcdGNvbnN0IGlucHV0ID0gdGhpcy5hZGRMYXllclRvSW5wdXRzKGZpZWxkLCBwYXJhbXMuaW5wdXQpO1xuXG5cdFx0Ly8gRG8gc2V0dXAgLSB0aGlzIG11c3QgY29tZSBmaXJzdC5cblx0XHR0aGlzLmRyYXdTZXR1cChnbFByb2dyYW0sIGZhbHNlLCBpbnB1dCwgb3V0cHV0KTtcblxuXHRcdC8vIFVwZGF0ZSB1bmlmb3JtcyBhbmQgYnVmZmVycy5cblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF92ZWN0b3JzJywgaW5wdXQuaW5kZXhPZihmaWVsZCksIElOVCk7XG5cdFx0Ly8gU2V0IGRlZmF1bHQgc2NhbGUuXG5cdFx0Y29uc3QgdmVjdG9yU2NhbGUgPSBwYXJhbXMudmVjdG9yU2NhbGUgfHwgMTtcblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF9zY2FsZScsIFt2ZWN0b3JTY2FsZSAvIHdpZHRoLCB2ZWN0b3JTY2FsZSAvIGhlaWdodF0sIEZMT0FUKTtcblx0XHRjb25zdCB2ZWN0b3JTcGFjaW5nID0gcGFyYW1zLnZlY3RvclNwYWNpbmcgfHwgMTA7XG5cdFx0Y29uc3Qgc3BhY2VkRGltZW5zaW9ucyA9IFtNYXRoLmZsb29yKHdpZHRoIC8gdmVjdG9yU3BhY2luZyksIE1hdGguZmxvb3IoaGVpZ2h0IC8gdmVjdG9yU3BhY2luZyldIGFzIFtudW1iZXIsIG51bWJlcl07XG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfZGltZW5zaW9ucycsIHNwYWNlZERpbWVuc2lvbnMsIEZMT0FUKTtcblx0XHRjb25zdCBsZW5ndGggPSAyICogc3BhY2VkRGltZW5zaW9uc1swXSAqIHNwYWNlZERpbWVuc2lvbnNbMV07XG5cdFx0aWYgKHRoaXMudmVjdG9yRmllbGRJbmRleEJ1ZmZlciA9PT0gdW5kZWZpbmVkIHx8ICh2ZWN0b3JGaWVsZEluZGV4QXJyYXkgJiYgdmVjdG9yRmllbGRJbmRleEFycmF5Lmxlbmd0aCA8IGxlbmd0aCkpIHtcblx0XHRcdC8vIEhhdmUgdG8gdXNlIGZsb2F0MzIgYXJyYXkgYmMgaW50IGlzIG5vdCBzdXBwb3J0ZWQgYXMgYSB2ZXJ0ZXggYXR0cmlidXRlIHR5cGUuXG5cdFx0XHRjb25zdCBpbmRpY2VzID0gbmV3IEZsb2F0MzJBcnJheShsZW5ndGgpO1xuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpbmRpY2VzW2ldID0gaTtcblx0XHRcdH1cblx0XHRcdHRoaXMudmVjdG9yRmllbGRJbmRleEFycmF5ID0gaW5kaWNlcztcblx0XHRcdHRoaXMudmVjdG9yRmllbGRJbmRleEJ1ZmZlciA9IHRoaXMuaW5pdFZlcnRleEJ1ZmZlcihpbmRpY2VzKTtcblx0XHR9XG5cdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHRoaXMudmVjdG9yRmllbGRJbmRleEJ1ZmZlciEpO1xuXHRcdHRoaXMuc2V0SW5kZXhBdHRyaWJ1dGUoZ2xQcm9ncmFtLCBwcm9ncmFtLm5hbWUpO1xuXG5cdFx0Ly8gRHJhdy5cblx0XHR0aGlzLnNldEJsZW5kTW9kZShwYXJhbXMuc2hvdWxkQmxlbmRBbHBoYSk7XG5cdFx0Z2wuZHJhd0FycmF5cyhnbC5MSU5FUywgMCwgbGVuZ3RoKTtcblx0XHRnbC5kaXNhYmxlKGdsLkJMRU5EKTtcblx0fVxuXG5cdGRyYXdMaW5lcyhcblx0XHRwYXJhbXM6IHtcblx0XHRcdHBvc2l0aW9uczogRGF0YUxheWVyLFxuXHRcdFx0Ly8gVE9ETzogYWRkIG9wdGlvbiBmb3Igbm8gaW5kaWNlcy5cblx0XHRcdGluZGljZXM6IEZsb2F0MzJBcnJheSB8IFVpbnQxNkFycmF5IHwgVWludDMyQXJyYXkgfCBJbnQxNkFycmF5IHwgSW50MzJBcnJheSxcblx0XHRcdHByb2dyYW0/OiBHUFVQcm9ncmFtLFxuXHRcdFx0aW5wdXQ/OiAoRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlKVtdIHwgRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlLFxuXHRcdFx0b3V0cHV0PzogRGF0YUxheWVyLFxuXHRcdFx0Y291bnQ/OiBudW1iZXIsXG5cdFx0XHRjb2xvcj86IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSxcblx0XHRcdHdyYXBYPzogYm9vbGVhbixcblx0XHRcdHdyYXBZPzogYm9vbGVhbixcblx0XHRcdHNob3VsZEJsZW5kQWxwaGE/OiBib29sZWFuLFxuXHRcdH0sXG5cdCkge1xuXHRcdGNvbnN0IHsgZ2wsIGVycm9yU3RhdGUsIHdpZHRoLCBoZWlnaHQgfSA9IHRoaXM7XG5cdFx0Y29uc3QgeyBwb3NpdGlvbnMsIGluZGljZXMsIG91dHB1dCB9ID0gcGFyYW1zO1xuXG5cdFx0Ly8gSWdub3JlIGlmIHdlIGFyZSBpbiBlcnJvciBzdGF0ZS5cblx0XHRpZiAoZXJyb3JTdGF0ZSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIENoZWNrIHRoYXQgcG9zaXRpb25zIGlzIHZhbGlkLlxuXHRcdGlmIChwb3NpdGlvbnMubnVtQ29tcG9uZW50cyAhPT0gMiAmJiBwb3NpdGlvbnMubnVtQ29tcG9uZW50cyAhPT0gNCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBXZWJHTENvbXB1dGUuZHJhd0luZGV4ZWRMaW5lcygpIG11c3QgYmUgcGFzc2VkIGEgcG9zaXRpb24gRGF0YUxheWVyIHdpdGggZWl0aGVyIDIgb3IgNCBjb21wb25lbnRzLCBnb3QgcG9zaXRpb24gRGF0YUxheWVyIFwiJHtwb3NpdGlvbnMubmFtZX1cIiB3aXRoICR7cG9zaXRpb25zLm51bUNvbXBvbmVudHN9IGNvbXBvbmVudHMuYClcblx0XHR9XG5cblx0XHRsZXQgcHJvZ3JhbSA9IHBhcmFtcy5wcm9ncmFtO1xuXHRcdGlmIChwcm9ncmFtID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHByb2dyYW0gPSBwYXJhbXMud3JhcFggfHwgcGFyYW1zLndyYXBZID8gdGhpcy5zaW5nbGVDb2xvcldpdGhXcmFwQ2hlY2tQcm9ncmFtIDogdGhpcy5zaW5nbGVDb2xvclByb2dyYW07XG5cdFx0XHRjb25zdCBjb2xvciA9IHBhcmFtcy5jb2xvciB8fCBbMSwgMCwgMF07IC8vIERlZmF1bHQgdG8gcmVkLlxuXHRcdFx0cHJvZ3JhbS5zZXRVbmlmb3JtKCd1X2NvbG9yJywgY29sb3IsIEZMT0FUKTtcblx0XHR9XG5cdFx0Y29uc3QgZ2xQcm9ncmFtID0gcHJvZ3JhbS5pbmRleGVkTGluZXNQcm9ncmFtITtcblxuXHRcdC8vIEFkZCBwb3NpdGlvbkxheWVyIHRvIGVuZCBvZiBpbnB1dCBpZiBuZWVkZWQuXG5cdFx0Y29uc3QgaW5wdXQgPSB0aGlzLmFkZExheWVyVG9JbnB1dHMocG9zaXRpb25zLCBwYXJhbXMuaW5wdXQpO1xuXG5cdFx0Ly8gRG8gc2V0dXAgLSB0aGlzIG11c3QgY29tZSBmaXJzdC5cblx0XHR0aGlzLmRyYXdTZXR1cChnbFByb2dyYW0sIGZhbHNlLCBpbnB1dCwgb3V0cHV0KTtcblxuXHRcdGNvbnN0IGNvdW50ID0gcGFyYW1zLmNvdW50ID8gcGFyYW1zLmNvdW50IDogaW5kaWNlcy5sZW5ndGg7XG5cblx0XHQvLyBVcGRhdGUgdW5pZm9ybXMgYW5kIGJ1ZmZlcnMuXG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfcG9zaXRpb25zJywgaW5wdXQuaW5kZXhPZihwb3NpdGlvbnMpLCBJTlQpO1xuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3NjYWxlJywgWzEgLyB3aWR0aCwgMSAvIGhlaWdodF0sIEZMT0FUKTtcblx0XHQvLyBUZWxsIHdoZXRoZXIgd2UgYXJlIHVzaW5nIGFuIGFic29sdXRlIHBvc2l0aW9uICgyIGNvbXBvbmVudHMpLCBvciBwb3NpdGlvbiB3aXRoIGFjY3VtdWxhdGlvbiBidWZmZXIgKDQgY29tcG9uZW50cywgYmV0dGVyIGZsb2F0aW5nIHB0IGFjY3VyYWN5KS5cblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF9wb3NpdGlvbldpdGhBY2N1bXVsYXRpb24nLCBwb3NpdGlvbnMubnVtQ29tcG9uZW50cyA9PT0gNCA/IDEgOiAwLCBJTlQpO1xuXHRcdGNvbnN0IHBvc2l0aW9uTGF5ZXJEaW1lbnNpb25zID0gcG9zaXRpb25zLmdldERpbWVuc2lvbnMoKTtcblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF9wb3NpdGlvbnNEaW1lbnNpb25zJywgcG9zaXRpb25MYXllckRpbWVuc2lvbnMsIEZMT0FUKTtcblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF93cmFwWCcsIHBhcmFtcy53cmFwWCA/IDEgOiAwLCBJTlQpO1xuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3dyYXBZJywgcGFyYW1zLndyYXBZID8gMSA6IDAsIElOVCk7XG5cdFx0aWYgKHRoaXMuaW5kZXhlZExpbmVzSW5kZXhCdWZmZXIgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Ly8gSGF2ZSB0byB1c2UgZmxvYXQzMiBhcnJheSBiYyBpbnQgaXMgbm90IHN1cHBvcnRlZCBhcyBhIHZlcnRleCBhdHRyaWJ1dGUgdHlwZS5cblx0XHRcdGxldCBmbG9hdEFycmF5OiBGbG9hdDMyQXJyYXk7XG5cdFx0XHRpZiAoaW5kaWNlcy5jb25zdHJ1Y3RvciAhPT0gRmxvYXQzMkFycmF5KSB7XG5cdFx0XHRcdC8vIEhhdmUgdG8gdXNlIGZsb2F0MzIgYXJyYXkgYmMgaW50IGlzIG5vdCBzdXBwb3J0ZWQgYXMgYSB2ZXJ0ZXggYXR0cmlidXRlIHR5cGUuXG5cdFx0XHRcdGZsb2F0QXJyYXkgPSBuZXcgRmxvYXQzMkFycmF5KGluZGljZXMubGVuZ3RoKTtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG5cdFx0XHRcdFx0ZmxvYXRBcnJheVtpXSA9IGluZGljZXNbaV07XG5cdFx0XHRcdH1cblx0XHRcdFx0Y29uc29sZS53YXJuKGBDb252ZXJ0aW5nIGluZGljZXMgYXJyYXkgb2YgdHlwZSAke2luZGljZXMuY29uc3RydWN0b3J9IHRvIEZsb2F0MzJBcnJheSBpbiBXZWJHTENvbXB1dGUuZHJhd0luZGV4ZWRMaW5lcyBmb3IgV2ViR0wgY29tcGF0aWJpbGl0eSwgeW91IG1heSB3YW50IHRvIHVzZSBhIEZsb2F0MzJBcnJheSB0byBzdG9yZSB0aGlzIGluZm9ybWF0aW9uIHNvIHRoZSBjb252ZXJzaW9uIGlzIG5vdCByZXF1aXJlZC5gKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZsb2F0QXJyYXkgPSBpbmRpY2VzIGFzIEZsb2F0MzJBcnJheTtcblx0XHRcdH1cblx0XHRcdHRoaXMuaW5kZXhlZExpbmVzSW5kZXhCdWZmZXIgPSB0aGlzLmluaXRWZXJ0ZXhCdWZmZXIoZmxvYXRBcnJheSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLmluZGV4ZWRMaW5lc0luZGV4QnVmZmVyISk7XG5cdFx0XHQvLyBDb3B5IGJ1ZmZlciBkYXRhLlxuXHRcdFx0Z2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsIGluZGljZXMsIGdsLlNUQVRJQ19EUkFXKTtcblx0XHR9XG5cdFx0dGhpcy5zZXRJbmRleEF0dHJpYnV0ZShnbFByb2dyYW0sIHByb2dyYW0ubmFtZSk7XG5cblx0XHQvLyBEcmF3LlxuXHRcdHRoaXMuc2V0QmxlbmRNb2RlKHBhcmFtcy5zaG91bGRCbGVuZEFscGhhKTtcblx0XHRnbC5kcmF3QXJyYXlzKGdsLkxJTkVTLCAwLCBjb3VudCk7XG5cdFx0Z2wuZGlzYWJsZShnbC5CTEVORCk7XG5cdH1cblx0XG5cdGdldENvbnRleHQoKSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2w7XG5cdH1cblxuXHRnZXRWYWx1ZXMoZGF0YUxheWVyOiBEYXRhTGF5ZXIpIHtcblx0XHRjb25zdCB7IGdsLCBnbHNsVmVyc2lvbiB9ID0gdGhpcztcblxuXHRcdC8vIEluIGNhc2UgZGF0YUxheWVyIHdhcyBub3QgdGhlIGxhc3Qgb3V0cHV0IHdyaXR0ZW4gdG8uXG5cdFx0ZGF0YUxheWVyLl9iaW5kT3V0cHV0QnVmZmVyKCk7XG5cblx0XHRjb25zdCBbIHdpZHRoLCBoZWlnaHQgXSA9IGRhdGFMYXllci5nZXREaW1lbnNpb25zKCk7XG5cdFx0bGV0IHsgZ2xOdW1DaGFubmVscywgZ2xUeXBlLCBnbEZvcm1hdCwgaW50ZXJuYWxUeXBlIH0gPSBkYXRhTGF5ZXI7XG5cdFx0bGV0IHZhbHVlcztcblx0XHRzd2l0Y2ggKGludGVybmFsVHlwZSkge1xuXHRcdFx0Y2FzZSBIQUxGX0ZMT0FUOlxuXHRcdFx0XHRpZiAoZ2wuRkxPQVQgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdC8vIEZpcmVmb3ggcmVxdWlyZXMgdGhhdCBSR0JBL0ZMT0FUIGlzIHVzZWQgZm9yIHJlYWRQaXhlbHMgb2YgZmxvYXQxNiB0eXBlcy5cblx0XHRcdFx0XHRnbE51bUNoYW5uZWxzID0gNDtcblx0XHRcdFx0XHRnbEZvcm1hdCA9IGdsLlJHQkE7XG5cdFx0XHRcdFx0Z2xUeXBlID0gZ2wuRkxPQVQ7XG5cdFx0XHRcdFx0dmFsdWVzID0gbmV3IEZsb2F0MzJBcnJheSh3aWR0aCAqIGhlaWdodCAqIGdsTnVtQ2hhbm5lbHMpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHZhbHVlcyA9IG5ldyBVaW50MTZBcnJheSh3aWR0aCAqIGhlaWdodCAqIGdsTnVtQ2hhbm5lbHMpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIC8vIFRoZSBmb2xsb3dpbmcgd29ya3MgaW4gQ2hyb21lLlxuXHRcdFx0XHQvLyB2YWx1ZXMgPSBuZXcgVWludDE2QXJyYXkod2lkdGggKiBoZWlnaHQgKiBnbE51bUNoYW5uZWxzKTtcblx0XHRcdFx0YnJlYWtcblx0XHRcdGNhc2UgRkxPQVQ6XG5cdFx0XHRcdC8vIENocm9tZSBhbmQgRmlyZWZveCByZXF1aXJlIHRoYXQgUkdCQS9GTE9BVCBpcyB1c2VkIGZvciByZWFkUGl4ZWxzIG9mIGZsb2F0MzIgdHlwZXMuXG5cdFx0XHRcdC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9LaHJvbm9zR3JvdXAvV2ViR0wvaXNzdWVzLzI3NDdcblx0XHRcdFx0Z2xOdW1DaGFubmVscyA9IDQ7XG5cdFx0XHRcdGdsRm9ybWF0ID0gZ2wuUkdCQTtcblx0XHRcdFx0dmFsdWVzID0gbmV3IEZsb2F0MzJBcnJheSh3aWR0aCAqIGhlaWdodCAqIGdsTnVtQ2hhbm5lbHMpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgVU5TSUdORURfQllURTpcblx0XHRcdFx0aWYgKGdsc2xWZXJzaW9uID09PSBHTFNMMSkge1xuXHRcdFx0XHRcdC8vIEZpcmVmb3ggcmVxdWlyZXMgdGhhdCBSR0JBL1VOU0lHTkVEX0JZVEUgaXMgdXNlZCBmb3IgcmVhZFBpeGVscyBvZiB1bnNpZ25lZCBieXRlIHR5cGVzLlxuXHRcdFx0XHRcdGdsTnVtQ2hhbm5lbHMgPSA0O1xuXHRcdFx0XHRcdGdsRm9ybWF0ID0gZ2wuUkdCQTtcblx0XHRcdFx0XHR2YWx1ZXMgPSBuZXcgVWludDhBcnJheSh3aWR0aCAqIGhlaWdodCAqIGdsTnVtQ2hhbm5lbHMpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIEZpcmVmb3ggcmVxdWlyZXMgdGhhdCBSR0JBX0lOVEVHRVIvVU5TSUdORURfSU5UIGlzIHVzZWQgZm9yIHJlYWRQaXhlbHMgb2YgdW5zaWduZWQgaW50IHR5cGVzLlxuXHRcdFx0XHRnbE51bUNoYW5uZWxzID0gNDtcblx0XHRcdFx0Z2xGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkdCQV9JTlRFR0VSO1xuXHRcdFx0XHRnbFR5cGUgPSBnbC5VTlNJR05FRF9JTlQ7XG5cdFx0XHRcdHZhbHVlcyA9IG5ldyBVaW50MzJBcnJheSh3aWR0aCAqIGhlaWdodCAqIGdsTnVtQ2hhbm5lbHMpO1xuXHRcdFx0XHQvLyAvLyBUaGUgZm9sbG93aW5nIHdvcmtzIGluIENocm9tZS5cblx0XHRcdFx0Ly8gdmFsdWVzID0gbmV3IFVpbnQ4QXJyYXkod2lkdGggKiBoZWlnaHQgKiBnbE51bUNoYW5uZWxzKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFVOU0lHTkVEX1NIT1JUOlxuXHRcdFx0XHQvLyBGaXJlZm94IHJlcXVpcmVzIHRoYXQgUkdCQV9JTlRFR0VSL1VOU0lHTkVEX0lOVCBpcyB1c2VkIGZvciByZWFkUGl4ZWxzIG9mIHVuc2lnbmVkIGludCB0eXBlcy5cblx0XHRcdFx0Z2xOdW1DaGFubmVscyA9IDQ7XG5cdFx0XHRcdGdsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHQkFfSU5URUdFUjtcblx0XHRcdFx0Z2xUeXBlID0gZ2wuVU5TSUdORURfSU5UO1xuXHRcdFx0XHR2YWx1ZXMgPSBuZXcgVWludDMyQXJyYXkod2lkdGggKiBoZWlnaHQgKiBnbE51bUNoYW5uZWxzKTtcblx0XHRcdFx0Ly8gLy8gVGhlIGZvbGxvd2luZyB3b3JrcyBpbiBDaHJvbWUuXG5cdFx0XHRcdC8vIHZhbHVlcyA9IG5ldyBVaW50MTZBcnJheSh3aWR0aCAqIGhlaWdodCAqIGdsTnVtQ2hhbm5lbHMpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgVU5TSUdORURfSU5UOlxuXHRcdFx0XHQvLyBGaXJlZm94IHJlcXVpcmVzIHRoYXQgUkdCQV9JTlRFR0VSL1VOU0lHTkVEX0lOVCBpcyB1c2VkIGZvciByZWFkUGl4ZWxzIG9mIHVuc2lnbmVkIGludCB0eXBlcy5cblx0XHRcdFx0Z2xOdW1DaGFubmVscyA9IDQ7XG5cdFx0XHRcdGdsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHQkFfSU5URUdFUjtcblx0XHRcdFx0dmFsdWVzID0gbmV3IFVpbnQzMkFycmF5KHdpZHRoICogaGVpZ2h0ICogZ2xOdW1DaGFubmVscyk7XG5cdFx0XHRcdC8vIC8vIFRoZSBmb2xsb3dpbmcgd29ya3MgaW4gQ2hyb21lLlxuXHRcdFx0XHQvLyB2YWx1ZXMgPSBuZXcgVWludDMyQXJyYXkod2lkdGggKiBoZWlnaHQgKiBnbE51bUNoYW5uZWxzKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIEJZVEU6XG5cdFx0XHRcdC8vIEZpcmVmb3ggcmVxdWlyZXMgdGhhdCBSR0JBX0lOVEVHRVIvSU5UIGlzIHVzZWQgZm9yIHJlYWRQaXhlbHMgb2YgaW50IHR5cGVzLlxuXHRcdFx0XHRnbE51bUNoYW5uZWxzID0gNDtcblx0XHRcdFx0Z2xGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkdCQV9JTlRFR0VSO1xuXHRcdFx0XHRnbFR5cGUgPSBnbC5JTlQ7XG5cdFx0XHRcdHZhbHVlcyA9IG5ldyBJbnQzMkFycmF5KHdpZHRoICogaGVpZ2h0ICogZ2xOdW1DaGFubmVscyk7XG5cdFx0XHRcdC8vIC8vIFRoZSBmb2xsb3dpbmcgd29ya3MgaW4gQ2hyb21lLlxuXHRcdFx0XHQvLyB2YWx1ZXMgPSBuZXcgSW50OEFycmF5KHdpZHRoICogaGVpZ2h0ICogZ2xOdW1DaGFubmVscyk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBTSE9SVDpcblx0XHRcdFx0Ly8gRmlyZWZveCByZXF1aXJlcyB0aGF0IFJHQkFfSU5URUdFUi9JTlQgaXMgdXNlZCBmb3IgcmVhZFBpeGVscyBvZiBpbnQgdHlwZXMuXG5cdFx0XHRcdGdsTnVtQ2hhbm5lbHMgPSA0O1xuXHRcdFx0XHRnbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR0JBX0lOVEVHRVI7XG5cdFx0XHRcdGdsVHlwZSA9IGdsLklOVDtcblx0XHRcdFx0dmFsdWVzID0gbmV3IEludDMyQXJyYXkod2lkdGggKiBoZWlnaHQgKiBnbE51bUNoYW5uZWxzKTtcblx0XHRcdFx0Ly8gLy8gVGhlIGZvbGxvd2luZyB3b3JrcyBpbiBDaHJvbWUuXG5cdFx0XHRcdC8vIHZhbHVlcyA9IG5ldyBJbnQxNkFycmF5KHdpZHRoICogaGVpZ2h0ICogZ2xOdW1DaGFubmVscyk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBJTlQ6XG5cdFx0XHRcdC8vIEZpcmVmb3ggcmVxdWlyZXMgdGhhdCBSR0JBX0lOVEVHRVIvSU5UIGlzIHVzZWQgZm9yIHJlYWRQaXhlbHMgb2YgaW50IHR5cGVzLlxuXHRcdFx0XHRnbE51bUNoYW5uZWxzID0gNDtcblx0XHRcdFx0Z2xGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkdCQV9JTlRFR0VSO1xuXHRcdFx0XHR2YWx1ZXMgPSBuZXcgSW50MzJBcnJheSh3aWR0aCAqIGhlaWdodCAqIGdsTnVtQ2hhbm5lbHMpO1xuXHRcdFx0XHQvLyAvLyBUaGUgZm9sbG93aW5nIHdvcmtzIGluIENocm9tZS5cblx0XHRcdFx0Ly8gdmFsdWVzID0gbmV3IEludDMyQXJyYXkod2lkdGggKiBoZWlnaHQgKiBnbE51bUNoYW5uZWxzKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGludGVybmFsVHlwZSAke2ludGVybmFsVHlwZX0gZm9yIGdldFZhbHVlcygpLmApO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLnJlYWR5VG9SZWFkKCkpIHtcblx0XHRcdC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9XZWJHTFJlbmRlcmluZ0NvbnRleHQvcmVhZFBpeGVsc1xuXHRcdFx0Z2wucmVhZFBpeGVscygwLCAwLCB3aWR0aCwgaGVpZ2h0LCBnbEZvcm1hdCwgZ2xUeXBlLCB2YWx1ZXMpO1xuXHRcdFx0Y29uc3QgeyBudW1Db21wb25lbnRzLCB0eXBlIH0gPSBkYXRhTGF5ZXI7XG5cdFx0XHRjb25zdCBPVVRQVVRfTEVOR1RIID0gd2lkdGggKiBoZWlnaHQgKiBudW1Db21wb25lbnRzO1xuXG5cdFx0XHQvLyBDb252ZXJ0IHVpbnQxNiB0byBmbG9hdDMyIGlmIG5lZWRlZC5cblx0XHRcdGNvbnN0IGhhbmRsZUZsb2F0MTZDb252ZXJzaW9uID0gaW50ZXJuYWxUeXBlID09PSBIQUxGX0ZMT0FUICYmIHZhbHVlcy5jb25zdHJ1Y3RvciA9PT0gVWludDE2QXJyYXk7XG5cdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRjb25zdCB2aWV3ID0gaGFuZGxlRmxvYXQxNkNvbnZlcnNpb24gPyBuZXcgRGF0YVZpZXcoKHZhbHVlcyBhcyBVaW50MTZBcnJheSkuYnVmZmVyKSA6IHVuZGVmaW5lZDtcblxuXHRcdFx0bGV0IG91dHB1dDogRGF0YUxheWVyQXJyYXlUeXBlID0gdmFsdWVzO1xuXHRcdFx0XG5cdFx0XHQvLyBXZSBtYXkgdXNlIGEgZGlmZmVyZW50IGludGVybmFsIHR5cGUgdGhhbiB0aGUgYXNzaWduZWQgdHlwZSBvZiB0aGUgRGF0YUxheWVyLlxuXHRcdFx0aWYgKGludGVybmFsVHlwZSAhPT0gdHlwZSkge1xuXHRcdFx0XHRzd2l0Y2ggKHR5cGUpIHtcblx0XHRcdFx0XHRjYXNlIEhBTEZfRkxPQVQ6XG5cdFx0XHRcdFx0Y2FzZSBGTE9BVDpcblx0XHRcdFx0XHRcdG91dHB1dCA9IG5ldyBGbG9hdDMyQXJyYXkoT1VUUFVUX0xFTkdUSCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIFVOU0lHTkVEX0JZVEU6XG5cdFx0XHRcdFx0XHRvdXRwdXQgPSBuZXcgVWludDhBcnJheShPVVRQVVRfTEVOR1RIKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgQllURTpcblx0XHRcdFx0XHRcdG91dHB1dCA9IG5ldyBJbnQ4QXJyYXkoT1VUUFVUX0xFTkdUSCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIFVOU0lHTkVEX1NIT1JUOlxuXHRcdFx0XHRcdFx0b3V0cHV0ID0gbmV3IFVpbnQxNkFycmF5KE9VVFBVVF9MRU5HVEgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBTSE9SVDpcblx0XHRcdFx0XHRcdG91dHB1dCA9IG5ldyBJbnQxNkFycmF5KE9VVFBVVF9MRU5HVEgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBVTlNJR05FRF9JTlQ6XG5cdFx0XHRcdFx0XHRvdXRwdXQgPSBuZXcgVWludDMyQXJyYXkoT1VUUFVUX0xFTkdUSCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIElOVDpcblx0XHRcdFx0XHRcdG91dHB1dCA9IG5ldyBJbnQzMkFycmF5KE9VVFBVVF9MRU5HVEgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgdHlwZSAke3R5cGV9IGZvciBnZXRWYWx1ZXMoKS5gKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBJbiBzb21lIGNhc2VzIGdsTnVtQ2hhbm5lbHMgbWF5IGJlID4gbnVtQ29tcG9uZW50cy5cblx0XHRcdGlmIChoYW5kbGVGbG9hdDE2Q29udmVyc2lvbiB8fCBvdXRwdXQgIT09IHZhbHVlcyB8fCBudW1Db21wb25lbnRzICE9PSBnbE51bUNoYW5uZWxzKSB7XG5cdFx0XHRcdGZvciAobGV0IGkgPSAwLCBsZW5ndGggPSB3aWR0aCAqIGhlaWdodDsgaSA8IGxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0Y29uc3QgaW5kZXgxID0gaSAqIGdsTnVtQ2hhbm5lbHM7XG5cdFx0XHRcdFx0Y29uc3QgaW5kZXgyID0gaSAqIG51bUNvbXBvbmVudHM7XG5cdFx0XHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCBudW1Db21wb25lbnRzOyBqKyspIHtcblx0XHRcdFx0XHRcdGlmIChoYW5kbGVGbG9hdDE2Q29udmVyc2lvbikge1xuXHRcdFx0XHRcdFx0XHRvdXRwdXRbaW5kZXgyICsgal0gPSBnZXRGbG9hdDE2KHZpZXchLCAyICogKGluZGV4MSArIGopLCB0cnVlKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdG91dHB1dFtpbmRleDIgKyBqXSA9IHZhbHVlc1tpbmRleDEgKyBqXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKG91dHB1dC5sZW5ndGggIT09IE9VVFBVVF9MRU5HVEgpIHtcblx0XHRcdFx0b3V0cHV0ID0gb3V0cHV0LnNsaWNlKDAsIE9VVFBVVF9MRU5HVEgpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG91dHB1dDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gcmVhZCB2YWx1ZXMgZnJvbSBCdWZmZXIgd2l0aCBzdGF0dXM6ICR7Z2wuY2hlY2tGcmFtZWJ1ZmZlclN0YXR1cyhnbC5GUkFNRUJVRkZFUil9LmApO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgcmVhZHlUb1JlYWQoKSB7XG5cdFx0Y29uc3QgeyBnbCB9ID0gdGhpcztcblx0XHRyZXR1cm4gZ2wuY2hlY2tGcmFtZWJ1ZmZlclN0YXR1cyhnbC5GUkFNRUJVRkZFUikgPT0gZ2wuRlJBTUVCVUZGRVJfQ09NUExFVEU7XG5cdH07XG5cblx0c2F2ZVBORyhkYXRhTGF5ZXI6IERhdGFMYXllciwgZmlsZW5hbWUgPSBkYXRhTGF5ZXIubmFtZSwgZHBpPzogbnVtYmVyKSB7XG5cdFx0Y29uc3QgdmFsdWVzID0gdGhpcy5nZXRWYWx1ZXMoZGF0YUxheWVyKTtcblx0XHRjb25zdCBbd2lkdGgsIGhlaWdodF0gPSBkYXRhTGF5ZXIuZ2V0RGltZW5zaW9ucygpO1xuXG5cdFx0Y29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG5cdFx0Y2FudmFzLndpZHRoID0gd2lkdGg7XG4gICAgXHRjYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xuXHRcdGNvbnN0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKSE7XG5cdFx0Y29uc3QgaW1hZ2VEYXRhID0gY29udGV4dC5nZXRJbWFnZURhdGEoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG5cdFx0Y29uc3QgYnVmZmVyID0gaW1hZ2VEYXRhLmRhdGE7XG5cdFx0Ly8gVE9ETzogdGhpcyBpc24ndCB3b3JraW5nIGZvciBVTlNJR05FRF9CWVRFIHR5cGVzP1xuXHRcdGNvbnN0IGlzRmxvYXQgPSBkYXRhTGF5ZXIudHlwZSA9PT0gRkxPQVQgfHwgZGF0YUxheWVyLnR5cGUgPT09IEhBTEZfRkxPQVQ7XG5cdFx0Ly8gSGF2ZSB0byBmbGlwIHRoZSB5IGF4aXMgc2luY2UgUE5HcyBhcmUgd3JpdHRlbiB0b3AgdG8gYm90dG9tLlxuXHRcdGZvciAobGV0IHkgPSAwOyB5IDwgaGVpZ2h0OyB5KyspIHtcblx0XHRcdGZvciAobGV0IHggPSAwOyB4IDwgd2lkdGg7IHgrKykge1xuXHRcdFx0XHRjb25zdCBpbmRleCA9IHkgKiB3aWR0aCArIHg7XG5cdFx0XHRcdGNvbnN0IGluZGV4RmxpcHBlZCA9IChoZWlnaHQgLSAxIC0geSkgKiB3aWR0aCArIHg7XG5cdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YUxheWVyLm51bUNvbXBvbmVudHM7IGkrKykge1xuXHRcdFx0XHRcdGJ1ZmZlcls0ICogaW5kZXhGbGlwcGVkICsgaV0gPSB2YWx1ZXNbZGF0YUxheWVyLm51bUNvbXBvbmVudHMgKiBpbmRleCArIGldICogKGlzRmxvYXQgPyAyNTUgOiAxKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoZGF0YUxheWVyLm51bUNvbXBvbmVudHMgPCA0KSB7XG5cdFx0XHRcdFx0YnVmZmVyWzQgKiBpbmRleEZsaXBwZWQgKyAzXSA9IDI1NTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHQvLyBjb25zb2xlLmxvZyh2YWx1ZXMsIGJ1ZmZlcik7XG5cdFx0Y29udGV4dC5wdXRJbWFnZURhdGEoaW1hZ2VEYXRhLCAwLCAwKTtcblxuXHRcdGNhbnZhcyEudG9CbG9iKChibG9iKSA9PiB7XG5cdFx0XHRpZiAoIWJsb2IpIHtcblx0XHRcdFx0Y29uc29sZS53YXJuKCdQcm9ibGVtIHNhdmluZyBQTkcsIHVuYWJsZSB0byBpbml0IGJsb2IuJyk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGlmIChkcGkpIHtcblx0XHRcdFx0Y2hhbmdlRHBpQmxvYihibG9iLCBkcGkpLnRoZW4oKGJsb2I6IEJsb2IpID0+e1xuXHRcdFx0XHRcdHNhdmVBcyhibG9iLCBgJHtmaWxlbmFtZX0ucG5nYCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c2F2ZUFzKGJsb2IsIGAke2ZpbGVuYW1lfS5wbmdgKTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdH0sICdpbWFnZS9wbmcnKTtcblx0fVxuXG4gICAgcmVzZXQoKSB7XG5cdFx0Ly8gVE9ETzogaW1wbGVtZW50IHRoaXMuXG5cdFx0dGhyb3cgbmV3IEVycm9yKCdXZWJHTENvbXB1dGUucmVzZXQoKSBub3QgaW1wbGVtZW50ZWQuJyk7XG5cdH07XG5cblx0YXR0YWNoRGF0YUxheWVyVG9UaHJlZVRleHR1cmUoZGF0YUxheWVyOiBEYXRhTGF5ZXIsIHRleHR1cmU6IFRleHR1cmUpIHtcblx0XHRpZiAoIXRoaXMucmVuZGVyZXIpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignV2ViR0xDb21wdXRlIHdhcyBub3QgaW5pdGVkIHdpdGggYSByZW5kZXJlci4nKTtcblx0XHR9XG5cdFx0Ly8gTGluayB3ZWJnbCB0ZXh0dXJlIHRvIHRocmVlanMgb2JqZWN0LlxuXHRcdC8vIFRoaXMgaXMgbm90IG9mZmljaWFsbHkgc3VwcG9ydGVkLlxuXHRcdGlmIChkYXRhTGF5ZXIubnVtQnVmZmVycyA+IDEpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgRGF0YUxheWVyIFwiJHtkYXRhTGF5ZXIubmFtZX1cIiBjb250YWlucyBtdWx0aXBsZSBXZWJHTCB0ZXh0dXJlcyAob25lIGZvciBlYWNoIGJ1ZmZlcikgdGhhdCBhcmUgZmxpcC1mbG9wcGVkIGR1cmluZyBjb21wdXRlIGN5Y2xlcywgcGxlYXNlIGNob29zZSBhIERhdGFMYXllciB3aXRoIG9uZSBidWZmZXIuYCk7XG5cdFx0fVxuXHRcdGNvbnN0IG9mZnNldFRleHR1cmVQcm9wZXJ0aWVzID0gdGhpcy5yZW5kZXJlci5wcm9wZXJ0aWVzLmdldCh0ZXh0dXJlKTtcblx0XHRvZmZzZXRUZXh0dXJlUHJvcGVydGllcy5fX3dlYmdsVGV4dHVyZSA9IGRhdGFMYXllci5nZXRDdXJyZW50U3RhdGVUZXh0dXJlKCk7XG5cdFx0b2Zmc2V0VGV4dHVyZVByb3BlcnRpZXMuX193ZWJnbEluaXQgPSB0cnVlO1xuXHR9XG5cblx0cmVzZXRUaHJlZVN0YXRlKCkge1xuXHRcdGlmICghdGhpcy5yZW5kZXJlcikge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdXZWJHTENvbXB1dGUgd2FzIG5vdCBpbml0ZWQgd2l0aCBhIHJlbmRlcmVyLicpO1xuXHRcdH1cblx0XHRjb25zdCB7IGdsIH0gPSB0aGlzO1xuXHRcdC8vIFJlc2V0IHZpZXdwb3J0LlxuXHRcdGNvbnN0IHZpZXdwb3J0ID0gdGhpcy5yZW5kZXJlci5nZXRWaWV3cG9ydChuZXcgdXRpbHMuVmVjdG9yNCgpIGFzIFZlY3RvcjQpO1xuXHRcdGdsLnZpZXdwb3J0KHZpZXdwb3J0LngsIHZpZXdwb3J0LnksIHZpZXdwb3J0LndpZHRoLCB2aWV3cG9ydC5oZWlnaHQpO1xuXHRcdC8vIFVuYmluZCBmcmFtZWJ1ZmZlciAocmVuZGVyIHRvIHNjcmVlbikuXG5cdFx0dGhpcy5yZW5kZXJlci5zZXRSZW5kZXJUYXJnZXQobnVsbCk7XG5cdFx0Ly8gUmVzZXQgdGV4dHVyZSBiaW5kaW5ncy5cblx0XHR0aGlzLnJlbmRlcmVyLnJlc2V0U3RhdGUoKTtcblx0fVxuXHRcblx0ZGVzdHJveSgpIHtcblx0XHQvLyBUT0RPOiBOZWVkIHRvIGltcGxlbWVudCB0aGlzLlxuXHRcdGRlbGV0ZSB0aGlzLnJlbmRlcmVyO1xuXHR9XG59IiwiY29uc3QgZXh0ZW5zaW9uczogeyBba2V5OiBzdHJpbmddOiBhbnkgfSA9IHt9O1xuXG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvT0VTX3RleHR1cmVfZmxvYXRcbi8vIEZsb2F0IGlzIHByb3ZpZGVkIGJ5IGRlZmF1bHQgaW4gV2ViR0wyIGNvbnRleHRzLlxuLy8gVGhpcyBleHRlbnNpb24gaW1wbGljaXRseSBlbmFibGVzIHRoZSBXRUJHTF9jb2xvcl9idWZmZXJfZmxvYXQgZXh0ZW5zaW9uIChpZiBzdXBwb3J0ZWQpLCB3aGljaCBhbGxvd3MgcmVuZGVyaW5nIHRvIDMyLWJpdCBmbG9hdGluZy1wb2ludCBjb2xvciBidWZmZXJzLlxuZXhwb3J0IGNvbnN0IE9FU19URVhUVVJFX0ZMT0FUID0gJ09FU190ZXh0dXJlX2Zsb2F0Jztcbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9PRVNfdGV4dHVyZV9oYWxmX2Zsb2F0XG4vLyBIYWxmIGZsb2F0IGlzIHN1cHBvcnRlZCBieSBtb2Rlcm4gbW9iaWxlIGJyb3dzZXJzLCBmbG9hdCBub3QgeWV0IHN1cHBvcnRlZC5cbi8vIEhhbGYgZmxvYXQgaXMgcHJvdmlkZWQgYnkgZGVmYXVsdCBmb3IgV2ViZ2wyIGNvbnRleHRzLlxuLy8gVGhpcyBleHRlbnNpb24gaW1wbGljaXRseSBlbmFibGVzIHRoZSBFWFRfY29sb3JfYnVmZmVyX2hhbGZfZmxvYXQgZXh0ZW5zaW9uIChpZiBzdXBwb3J0ZWQpLCB3aGljaCBhbGxvd3MgcmVuZGVyaW5nIHRvIDE2LWJpdCBmbG9hdGluZyBwb2ludCBmb3JtYXRzLlxuZXhwb3J0IGNvbnN0IE9FU19URVhUVVJFX0hBTEZfRkxPQVQgPSAnT0VTX3RleHR1cmVfaGFsZl9mbG9hdCc7XG4vLyBUT0RPOiBTZWVtcyBsaWtlIGxpbmVhciBmaWx0ZXJpbmcgb2YgZmxvYXRzIG1heSBiZSBzdXBwb3J0ZWQgaW4gc29tZSBicm93c2VycyB3aXRob3V0IHRoZXNlIGV4dGVuc2lvbnM/XG4vLyBodHRwczovL3d3dy5raHJvbm9zLm9yZy9yZWdpc3RyeS9PcGVuR0wvZXh0ZW5zaW9ucy9PRVMvT0VTX3RleHR1cmVfZmxvYXRfbGluZWFyLnR4dFxuZXhwb3J0IGNvbnN0IE9FU19URVhUVVJFX0ZMT0FUX0xJTkVBUiA9ICdPRVNfdGV4dHVyZV9mbG9hdF9saW5lYXInO1xuZXhwb3J0IGNvbnN0IE9FU19URVhUVVJFX0hBbEZfRkxPQVRfTElORUFSID0gJ09FU190ZXh0dXJlX2hhbGZfZmxvYXRfbGluZWFyJztcbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9XRUJHTF9kZXB0aF90ZXh0dXJlXG4vLyBBZGRzIGdsLlVOU0lHTkVEX1NIT1JULCBnbC5VTlNJR05FRF9JTlQgdHlwZXMgdG8gdGV4dEltYWdlMkQgaW4gV2ViR0wxLjBcbmV4cG9ydCBjb25zdCBXRUJHTF9ERVBUSF9URVhUVVJFID0gJ1dFQkdMX2RlcHRoX3RleHR1cmUnO1xuLy8gRVhUX0NPTE9SX0JVRkZFUl9GTE9BVCBhZGRzIGFiaWxpdHkgdG8gcmVuZGVyIHRvIGEgdmFyaWV0eSBvZiBmbG9hdGluZyBwdCB0ZXh0dXJlcy5cbi8vIFRoaXMgaXMgbmVlZGVkIGZvciB0aGUgV2ViR0wyIGNvbnRleHRzIHRoYXQgZG8gbm90IHN1cHBvcnQgT0VTX1RFWFRVUkVfRkxPQVQgLyBPRVNfVEVYVFVSRV9IQUxGX0ZMT0FUIGV4dGVuc2lvbnMuXG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRVhUX2NvbG9yX2J1ZmZlcl9mbG9hdFxuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMzQyNjI0OTMvZnJhbWVidWZmZXItaW5jb21wbGV0ZS1hdHRhY2htZW50LWZvci10ZXh0dXJlLXdpdGgtaW50ZXJuYWwtZm9ybWF0XG4vLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8zNjEwOTM0Ny9mcmFtZWJ1ZmZlci1pbmNvbXBsZXRlLWF0dGFjaG1lbnQtb25seS1oYXBwZW5zLW9uLWFuZHJvaWQtdy1maXJlZm94XG5leHBvcnQgY29uc3QgRVhUX0NPTE9SX0JVRkZFUl9GTE9BVCA9ICdFWFRfY29sb3JfYnVmZmVyX2Zsb2F0JztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEV4dGVuc2lvbihcblx0Z2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCB8IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQsXG5cdGV4dGVuc2lvbk5hbWU6IHN0cmluZyxcblx0ZXJyb3JDYWxsYmFjazogKG1lc3NhZ2U6IHN0cmluZykgPT4gdm9pZCxcblx0b3B0aW9uYWwgPSBmYWxzZSxcbikge1xuXHQvLyBDaGVjayBpZiB3ZSd2ZSBhbHJlYWR5IGxvYWRlZCB0aGUgZXh0ZW5zaW9uLlxuXHRpZiAoZXh0ZW5zaW9uc1tleHRlbnNpb25OYW1lXSAhPT0gdW5kZWZpbmVkKSByZXR1cm4gZXh0ZW5zaW9uc1tleHRlbnNpb25OYW1lXTtcblxuXHRsZXQgZXh0ZW5zaW9uO1xuXHR0cnkge1xuXHRcdGV4dGVuc2lvbiA9IGdsLmdldEV4dGVuc2lvbihleHRlbnNpb25OYW1lKTtcblx0fSBjYXRjaCAoZSkge31cblx0aWYgKGV4dGVuc2lvbikge1xuXHRcdC8vIENhY2hlIHRoaXMgZXh0ZW5zaW9uLlxuXHRcdGV4dGVuc2lvbnNbZXh0ZW5zaW9uTmFtZV0gPSBleHRlbnNpb247XG5cdFx0Y29uc29sZS5sb2coYExvYWRlZCBleHRlbnNpb246ICR7ZXh0ZW5zaW9uTmFtZX0uYCk7XG5cdH0gZWxzZSB7XG5cdFx0ZXh0ZW5zaW9uc1tleHRlbnNpb25OYW1lXSA9IGZhbHNlOyAvLyBDYWNoZSB0aGUgYmFkIGV4dGVuc2lvbiBsb29rdXAuXG5cdFx0Y29uc29sZS53YXJuKGBVbnN1cHBvcnRlZCAke29wdGlvbmFsID8gJ29wdGlvbmFsICcgOiAnJ31leHRlbnNpb246ICR7ZXh0ZW5zaW9uTmFtZX0uYCk7XG5cdH1cblx0Ly8gSWYgdGhlIGV4dGVuc2lvbiBpcyBub3Qgb3B0aW9uYWwsIHRocm93IGVycm9yLlxuXHRpZiAoIWV4dGVuc2lvbiAmJiAhb3B0aW9uYWwpIHtcblx0XHRlcnJvckNhbGxiYWNrKGBSZXF1aXJlZCBleHRlbnNpb24gdW5zdXBwb3J0ZWQgYnkgdGhpcyBkZXZpY2UgLyBicm93c2VyOiAke2V4dGVuc2lvbk5hbWV9LmApO1xuXHR9XG5cdHJldHVybiBleHRlbnNpb247XG59IiwiaW1wb3J0IHsgV2ViR0xDb21wdXRlIH0gZnJvbSAnLi9XZWJHTENvbXB1dGUnO1xuZXhwb3J0ICogZnJvbSAnLi9Db25zdGFudHMnO1xuXG5leHBvcnQge1xuXHRXZWJHTENvbXB1dGUsXG59OyIsIi8vIENvcGllZCBmcm9tIGh0dHA6Ly93ZWJnbGZ1bmRhbWVudGFscy5vcmcvd2ViZ2wvbGVzc29ucy93ZWJnbC1ib2lsZXJwbGF0ZS5odG1sXG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZVNoYWRlcihcblx0Z2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCB8IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQsXG5cdGVycm9yQ2FsbGJhY2s6IChtZXNzYWdlOiBzdHJpbmcpID0+IHZvaWQsXG5cdHNoYWRlclNvdXJjZTogc3RyaW5nLFxuXHRzaGFkZXJUeXBlOiBudW1iZXIsXG5cdHByb2dyYW1OYW1lPzogc3RyaW5nLFxuKSB7XG5cdC8vIENyZWF0ZSB0aGUgc2hhZGVyIG9iamVjdFxuXHRjb25zdCBzaGFkZXIgPSBnbC5jcmVhdGVTaGFkZXIoc2hhZGVyVHlwZSk7XG5cdGlmICghc2hhZGVyKSB7XG5cdFx0ZXJyb3JDYWxsYmFjaygnVW5hYmxlIHRvIGluaXQgZ2wgc2hhZGVyLicpO1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0Ly8gU2V0IHRoZSBzaGFkZXIgc291cmNlIGNvZGUuXG5cdGdsLnNoYWRlclNvdXJjZShzaGFkZXIsIHNoYWRlclNvdXJjZSk7XG5cblx0Ly8gQ29tcGlsZSB0aGUgc2hhZGVyXG5cdGdsLmNvbXBpbGVTaGFkZXIoc2hhZGVyKTtcblxuXHQvLyBDaGVjayBpZiBpdCBjb21waWxlZFxuXHRjb25zdCBzdWNjZXNzID0gZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHNoYWRlciwgZ2wuQ09NUElMRV9TVEFUVVMpO1xuXHRpZiAoIXN1Y2Nlc3MpIHtcblx0XHQvLyBTb21ldGhpbmcgd2VudCB3cm9uZyBkdXJpbmcgY29tcGlsYXRpb24gLSBwcmludCB0aGUgZXJyb3IuXG5cdFx0ZXJyb3JDYWxsYmFjayhgQ291bGQgbm90IGNvbXBpbGUgJHtzaGFkZXJUeXBlID09PSBnbC5GUkFHTUVOVF9TSEFERVIgPyAnZnJhZ21lbnQnIDogJ3ZlcnRleCd9XG5cdFx0XHQgc2hhZGVyJHtwcm9ncmFtTmFtZSA/IGAgZm9yIHByb2dyYW0gXCIke3Byb2dyYW1OYW1lfVwiYCA6ICcnfTogJHtnbC5nZXRTaGFkZXJJbmZvTG9nKHNoYWRlcil9LmApO1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdHJldHVybiBzaGFkZXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1dlYkdMMihnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0IHwgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkge1xuXHQvLyBUaGlzIGNvZGUgaXMgcHVsbGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL21yZG9vYi90aHJlZS5qcy9ibG9iL21hc3Rlci9zcmMvcmVuZGVyZXJzL3dlYmdsL1dlYkdMQ2FwYWJpbGl0aWVzLmpzXG5cdC8vIEB0cy1pZ25vcmVcblx0cmV0dXJuICh0eXBlb2YgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCAhPT0gJ3VuZGVmaW5lZCcgJiYgZ2wgaW5zdGFuY2VvZiBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KSB8fCAodHlwZW9mIFdlYkdMMkNvbXB1dGVSZW5kZXJpbmdDb250ZXh0ICE9PSAndW5kZWZpbmVkJyAmJiBnbCBpbnN0YW5jZW9mIFdlYkdMMkNvbXB1dGVSZW5kZXJpbmdDb250ZXh0KTtcblx0Ly8gcmV0dXJuICEhKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLkhBTEZfRkxPQVQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1Bvd2VyT2YyKHZhbHVlOiBudW1iZXIpIHtcblx0cmV0dXJuICh2YWx1ZSAmICh2YWx1ZSAtIDEpKSA9PSAwO1xufSIsIi8vIFRoZXNlIGFyZSB0aGUgcGFydHMgb2YgdGhyZWVqcyBWZWN0b3I0IHRoYXQgd2UgbmVlZC5cbmV4cG9ydCBjbGFzcyBWZWN0b3I0IHtcblx0eDogbnVtYmVyO1xuXHR5OiBudW1iZXI7XG5cdHo6IG51bWJlcjtcblx0dzogbnVtYmVyO1xuXHRjb25zdHJ1Y3RvciggeCA9IDAsIHkgPSAwLCB6ID0gMCwgdyA9IDEgKSB7XG5cdFx0dGhpcy54ID0geDtcblx0XHR0aGlzLnkgPSB5O1xuXHRcdHRoaXMueiA9IHo7XG5cdFx0dGhpcy53ID0gdztcblx0fVxuXHRnZXQgd2lkdGgoKSB7XG5cdFx0cmV0dXJuIHRoaXMuejtcblx0fVxuXHRnZXQgaGVpZ2h0KCkge1xuXHRcdHJldHVybiB0aGlzLnc7XG5cdH1cblx0Y29weSh2OiBWZWN0b3I0KSB7XG5cdFx0dGhpcy54ID0gdi54O1xuXHRcdHRoaXMueSA9IHYueTtcblx0XHR0aGlzLnogPSB2Lno7XG5cdFx0dGhpcy53ID0gdi53O1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG59IiwibW9kdWxlLmV4cG9ydHMgPSBcInByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5cXG52YXJ5aW5nIHZlYzIgdl9VVjtcXG5cXG51bmlmb3JtIHNhbXBsZXIyRCB1X3N0YXRlO1xcblxcbnZvaWQgbWFpbigpIHtcXG5cXHRnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodV9zdGF0ZSwgdl9VVik7XFxufVwiIiwibW9kdWxlLmV4cG9ydHMgPSBcInByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5cXG5hdHRyaWJ1dGUgdmVjMiBhX2ludGVybmFsX3Bvc2l0aW9uO1xcblxcbnVuaWZvcm0gdmVjMiB1X2ludGVybmFsX3NjYWxlO1xcbnVuaWZvcm0gdmVjMiB1X2ludGVybmFsX3RyYW5zbGF0aW9uO1xcblxcbnZhcnlpbmcgdmVjMiB2X1VWX2xvY2FsO1xcbnZhcnlpbmcgdmVjMiB2X1VWO1xcblxcbnZvaWQgbWFpbigpIHtcXG5cXHQvLyBDYWxjdWxhdGUgVVYgY29vcmRpbmF0ZXMgb2YgY3VycmVudCByZW5kZXJlZCBvYmplY3QuXFxuXFx0dl9VVl9sb2NhbCA9IDAuNSAqIChhX2ludGVybmFsX3Bvc2l0aW9uICsgMS4wKTtcXG5cXG5cXHQvLyBBcHBseSB0cmFuc2Zvcm1hdGlvbnMuXFxuXFx0dmVjMiBwb3NpdGlvbiA9IHVfaW50ZXJuYWxfc2NhbGUgKiBhX2ludGVybmFsX3Bvc2l0aW9uICsgdV9pbnRlcm5hbF90cmFuc2xhdGlvbjtcXG5cXG5cXHQvLyBDYWxjdWxhdGUgYSBnbG9iYWwgdXYgZm9yIHRoZSB2aWV3cG9ydC5cXG5cXHR2X1VWID0gMC41ICogKHBvc2l0aW9uICsgMS4wKTtcXG5cXG5cXHQvLyBDYWxjdWxhdGUgdmVydGV4IHBvc2l0aW9uLlxcblxcdGdsX1Bvc2l0aW9uID0gdmVjNChwb3NpdGlvbiwgMCwgMSk7XFxufVwiIiwibW9kdWxlLmV4cG9ydHMgPSBcInByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5wcmVjaXNpb24gaGlnaHAgaW50O1xcblxcbi8qKlxcbiAqIFJldHVybnMgYWNjdXJhdGUgTU9EIHdoZW4gYXJndW1lbnRzIGFyZSBhcHByb3hpbWF0ZSBpbnRlZ2Vycy5cXG4gKi9cXG5mbG9hdCBtb2RJKGZsb2F0IGEsIGZsb2F0IGIpIHtcXG4gICAgZmxvYXQgbSA9IGEgLSBmbG9vcigoYSArIDAuNSkgLyBiKSAqIGI7XFxuICAgIHJldHVybiBmbG9vcihtICsgMC41KTtcXG59XFxuXFxuLy8gQ2Fubm90IHVzZSBpbnQgdmVydGV4IGF0dHJpYnV0ZXM6IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzI3ODc0OTgzL3dlYmdsLWhvdy10by11c2UtaW50ZWdlci1hdHRyaWJ1dGVzLWluLWdsc2xcXG5hdHRyaWJ1dGUgZmxvYXQgYV9pbnRlcm5hbF9pbmRleDsgLy8gSW5kZXggb2YgcG9pbnQuXFxuXFxudW5pZm9ybSBzYW1wbGVyMkQgdV9pbnRlcm5hbF9wb3NpdGlvbnM7IC8vIFRleHR1cmUgbG9va3VwIHdpdGggcG9zaXRpb24gZGF0YS5cXG51bmlmb3JtIHZlYzIgdV9pbnRlcm5hbF9wb3NpdGlvbnNEaW1lbnNpb25zO1xcbnVuaWZvcm0gdmVjMiB1X2ludGVybmFsX3NjYWxlO1xcbnVuaWZvcm0gYm9vbCB1X2ludGVybmFsX3Bvc2l0aW9uV2l0aEFjY3VtdWxhdGlvbjtcXG51bmlmb3JtIGJvb2wgdV9pbnRlcm5hbF93cmFwWDtcXG51bmlmb3JtIGJvb2wgdV9pbnRlcm5hbF93cmFwWTtcXG5cXG52YXJ5aW5nIHZlYzIgdl9VVjtcXG52YXJ5aW5nIHZlYzIgdl9saW5lV3JhcHBpbmc7IC8vIFVzZSB0aGlzIHRvIHRlc3QgaWYgbGluZSBpcyBvbmx5IGhhbGYgd3JhcHBlZCBhbmQgc2hvdWxkIG5vdCBiZSByZW5kZXJlZC5cXG5cXG52b2lkIG1haW4oKSB7XFxuXFx0Ly8gQ2FsY3VsYXRlIGEgdXYgYmFzZWQgb24gdGhlIHBvaW50J3MgaW5kZXggYXR0cmlidXRlLlxcblxcdHZlYzIgcGFydGljbGVVViA9IHZlYzIoXFxuXFx0XFx0bW9kSShhX2ludGVybmFsX2luZGV4LCB1X2ludGVybmFsX3Bvc2l0aW9uc0RpbWVuc2lvbnMueCksXFxuXFx0XFx0Zmxvb3IoZmxvb3IoYV9pbnRlcm5hbF9pbmRleCArIDAuNSkgLyB1X2ludGVybmFsX3Bvc2l0aW9uc0RpbWVuc2lvbnMueClcXG5cXHQpIC8gdV9pbnRlcm5hbF9wb3NpdGlvbnNEaW1lbnNpb25zO1xcblxcblxcdC8vIENhbGN1bGF0ZSBhIGdsb2JhbCB1diBmb3IgdGhlIHZpZXdwb3J0LlxcblxcdC8vIExvb2t1cCB2ZXJ0ZXggcG9zaXRpb24gYW5kIHNjYWxlIHRvIFswLCAxXSByYW5nZS5cXG5cXHQvLyBXZSBoYXZlIHBhY2tlZCBhIDJEIGRpc3BsYWNlbWVudCB3aXRoIHRoZSBwb3NpdGlvbi5cXG5cXHR2ZWM0IHBvc2l0aW9uRGF0YSA9IHRleHR1cmUyRCh1X2ludGVybmFsX3Bvc2l0aW9ucywgcGFydGljbGVVVik7XFxuXFx0Ly8gcG9zaXRpb24gPSBmaXJzdCB0d28gY29tcG9uZW50cyBwbHVzIGxhc3QgdHdvIGNvbXBvbmVudHMgKG9wdGlvbmFsIGFjY3VtdWxhdGlvbiBidWZmZXIpLlxcblxcdHZlYzIgcG9zaXRpb25BYnNvbHV0ZSA9IHBvc2l0aW9uRGF0YS5yZztcXG5cXHRpZiAodV9pbnRlcm5hbF9wb3NpdGlvbldpdGhBY2N1bXVsYXRpb24pIHBvc2l0aW9uQWJzb2x1dGUgKz0gcG9zaXRpb25EYXRhLmJhO1xcblxcdHZfVVYgPSBwb3NpdGlvbkFic29sdXRlICogdV9pbnRlcm5hbF9zY2FsZTtcXG5cXG5cXHQvLyBXcmFwIGlmIG5lZWRlZC5cXG5cXHR2X2xpbmVXcmFwcGluZyA9IHZlYzIoMC4wKTtcXG5cXHRpZiAodV9pbnRlcm5hbF93cmFwWCkge1xcblxcdFxcdGlmICh2X1VWLnggPCAwLjApIHtcXG5cXHRcXHRcXHR2X1VWLnggKz0gMS4wO1xcblxcdFxcdFxcdHZfbGluZVdyYXBwaW5nLnggPSAxLjA7XFxuXFx0XFx0fSBlbHNlIGlmICh2X1VWLnggPiAxLjApIHtcXG5cXHRcXHRcXHR2X1VWLnggLT0gMS4wO1xcblxcdFxcdFxcdHZfbGluZVdyYXBwaW5nLnggPSAxLjA7XFxuXFx0XFx0fVxcblxcdH1cXG5cXHRpZiAodV9pbnRlcm5hbF93cmFwWSkge1xcblxcdFxcdGlmICh2X1VWLnkgPCAwLjApIHtcXG5cXHRcXHRcXHR2X1VWLnkgKz0gMS4wO1xcblxcdFxcdFxcdHZfbGluZVdyYXBwaW5nLnkgPSAxLjA7XFxuXFx0XFx0fSBlbHNlIGlmICh2X1VWLnkgPiAxLjApIHtcXG5cXHRcXHRcXHR2X1VWLnkgLT0gMS4wO1xcblxcdFxcdFxcdHZfbGluZVdyYXBwaW5nLnkgPSAxLjA7XFxuXFx0XFx0fVxcblxcdH1cXG5cXG5cXHQvLyBDYWxjdWxhdGUgcG9zaXRpb24gaW4gWy0xLCAxXSByYW5nZS5cXG5cXHR2ZWMyIHBvc2l0aW9uID0gdl9VViAqIDIuMCAtIDEuMDtcXG5cXG5cXHRnbF9Qb3NpdGlvbiA9IHZlYzQocG9zaXRpb24sIDAsIDEpO1xcbn1cIiIsIm1vZHVsZS5leHBvcnRzID0gXCJwcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxucHJlY2lzaW9uIGhpZ2hwIGludDtcXG5cXG4vKipcXG4gKiBSZXR1cm5zIGFjY3VyYXRlIE1PRCB3aGVuIGFyZ3VtZW50cyBhcmUgYXBwcm94aW1hdGUgaW50ZWdlcnMuXFxuICovXFxuZmxvYXQgbW9kSShmbG9hdCBhLCBmbG9hdCBiKSB7XFxuICAgIGZsb2F0IG0gPSBhIC0gZmxvb3IoKGEgKyAwLjUpIC8gYikgKiBiO1xcbiAgICByZXR1cm4gZmxvb3IobSArIDAuNSk7XFxufVxcblxcbi8vIENhbm5vdCB1c2UgaW50IHZlcnRleCBhdHRyaWJ1dGVzOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yNzg3NDk4My93ZWJnbC1ob3ctdG8tdXNlLWludGVnZXItYXR0cmlidXRlcy1pbi1nbHNsXFxuYXR0cmlidXRlIGZsb2F0IGFfaW50ZXJuYWxfaW5kZXg7IC8vIEluZGV4IG9mIHBvaW50LlxcblxcbnVuaWZvcm0gc2FtcGxlcjJEIHVfaW50ZXJuYWxfcG9zaXRpb25zOyAvLyBUZXh0dXJlIGxvb2t1cCB3aXRoIHBvc2l0aW9uIGRhdGEuXFxudW5pZm9ybSB2ZWMyIHVfaW50ZXJuYWxfcG9zaXRpb25zRGltZW5zaW9ucztcXG51bmlmb3JtIHZlYzIgdV9pbnRlcm5hbF9zY2FsZTtcXG51bmlmb3JtIGZsb2F0IHVfaW50ZXJuYWxfcG9pbnRTaXplO1xcbnVuaWZvcm0gYm9vbCB1X2ludGVybmFsX3Bvc2l0aW9uV2l0aEFjY3VtdWxhdGlvbjtcXG51bmlmb3JtIGJvb2wgdV9pbnRlcm5hbF93cmFwWDtcXG51bmlmb3JtIGJvb2wgdV9pbnRlcm5hbF93cmFwWTtcXG5cXG52YXJ5aW5nIHZlYzIgdl9VVjtcXG5cXG52b2lkIG1haW4oKSB7XFxuXFx0Ly8gQ2FsY3VsYXRlIGEgdXYgYmFzZWQgb24gdGhlIHBvaW50J3MgaW5kZXggYXR0cmlidXRlLlxcblxcdHZlYzIgcGFydGljbGVVViA9IHZlYzIoXFxuXFx0XFx0bW9kSShhX2ludGVybmFsX2luZGV4LCB1X2ludGVybmFsX3Bvc2l0aW9uc0RpbWVuc2lvbnMueCksXFxuXFx0XFx0Zmxvb3IoZmxvb3IoYV9pbnRlcm5hbF9pbmRleCArIDAuNSkgLyB1X2ludGVybmFsX3Bvc2l0aW9uc0RpbWVuc2lvbnMueClcXG5cXHQpIC8gdV9pbnRlcm5hbF9wb3NpdGlvbnNEaW1lbnNpb25zO1xcblxcblxcdC8vIENhbGN1bGF0ZSBhIGdsb2JhbCB1diBmb3IgdGhlIHZpZXdwb3J0LlxcblxcdC8vIExvb2t1cCB2ZXJ0ZXggcG9zaXRpb24gYW5kIHNjYWxlIHRvIFswLCAxXSByYW5nZS5cXG5cXHQvLyBXZSBoYXZlIHBhY2tlZCBhIDJEIGRpc3BsYWNlbWVudCB3aXRoIHRoZSBwb3NpdGlvbi5cXG5cXHR2ZWM0IHBvc2l0aW9uRGF0YSA9IHRleHR1cmUyRCh1X2ludGVybmFsX3Bvc2l0aW9ucywgcGFydGljbGVVVik7XFxuXFx0Ly8gcG9zaXRpb24gPSBmaXJzdCB0d28gY29tcG9uZW50cyBwbHVzIGxhc3QgdHdvIGNvbXBvbmVudHMgKG9wdGlvbmFsIGFjY3VtdWxhdGlvbiBidWZmZXIpLlxcblxcdHZlYzIgcG9zaXRpb25BYnNvbHV0ZSA9IHBvc2l0aW9uRGF0YS5yZztcXG5cXHRpZiAodV9pbnRlcm5hbF9wb3NpdGlvbldpdGhBY2N1bXVsYXRpb24pIHBvc2l0aW9uQWJzb2x1dGUgKz0gcG9zaXRpb25EYXRhLmJhO1xcblxcdHZfVVYgPSBwb3NpdGlvbkFic29sdXRlICogdV9pbnRlcm5hbF9zY2FsZTtcXG5cXG5cXHQvLyBXcmFwIGlmIG5lZWRlZC5cXG5cXHRpZiAodV9pbnRlcm5hbF93cmFwWCkge1xcblxcdFxcdGlmICh2X1VWLnggPCAwLjApIHZfVVYueCArPSAxLjA7XFxuXFx0XFx0aWYgKHZfVVYueCA+IDEuMCkgdl9VVi54IC09IDEuMDtcXG5cXHR9XFxuXFx0aWYgKHVfaW50ZXJuYWxfd3JhcFkpIHtcXG5cXHRcXHRpZiAodl9VVi55IDwgMC4wKSB2X1VWLnkgKz0gMS4wO1xcblxcdFxcdGlmICh2X1VWLnkgPiAxLjApIHZfVVYueSAtPSAxLjA7XFxuXFx0fVxcblxcblxcdC8vIENhbGN1bGF0ZSBwb3NpdGlvbiBpbiBbLTEsIDFdIHJhbmdlLlxcblxcdHZlYzIgcG9zaXRpb24gPSB2X1VWICogMi4wIC0gMS4wO1xcblxcblxcdGdsX1BvaW50U2l6ZSA9IHVfaW50ZXJuYWxfcG9pbnRTaXplO1xcblxcdGdsX1Bvc2l0aW9uID0gdmVjNChwb3NpdGlvbiwgMCwgMSk7XFxufVwiIiwibW9kdWxlLmV4cG9ydHMgPSBcInByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5cXG5hdHRyaWJ1dGUgdmVjMiBhX2ludGVybmFsX3Bvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFfaW50ZXJuYWxfdXY7XFxuYXR0cmlidXRlIHZlYzIgYV9pbnRlcm5hbF9ub3JtYWw7XFxuXFxudW5pZm9ybSB2ZWMyIHVfaW50ZXJuYWxfc2NhbGU7XFxudW5pZm9ybSB2ZWMyIHVfaW50ZXJuYWxfdHJhbnNsYXRpb247XFxuXFxudmFyeWluZyB2ZWMyIHZfVVZfbG9jYWw7XFxudmFyeWluZyB2ZWMyIHZfVVY7XFxudmFyeWluZyB2ZWMyIHZfbm9ybWFsO1xcblxcbnZvaWQgbWFpbigpIHtcXG5cXHQvLyBWYXJ5aW5ncy5cXG5cXHR2X1VWX2xvY2FsID0gYV9pbnRlcm5hbF91djtcXG5cXHR2X25vcm1hbCA9IGFfaW50ZXJuYWxfbm9ybWFsO1xcblxcblxcdC8vIEFwcGx5IHRyYW5zZm9ybWF0aW9ucy5cXG5cXHR2ZWMyIHBvc2l0aW9uID0gdV9pbnRlcm5hbF9zY2FsZSAqIGFfaW50ZXJuYWxfcG9zaXRpb24gKyB1X2ludGVybmFsX3RyYW5zbGF0aW9uO1xcblxcblxcdC8vIENhbGN1bGF0ZSBhIGdsb2JhbCB1diBmb3IgdGhlIHZpZXdwb3J0LlxcblxcdHZfVVYgPSAwLjUgKiAocG9zaXRpb24gKyAxLjApO1xcblxcblxcdC8vIENhbGN1bGF0ZSB2ZXJ0ZXggcG9zaXRpb24uXFxuXFx0Z2xfUG9zaXRpb24gPSB2ZWM0KHBvc2l0aW9uLCAwLCAxKTtcXG59XCIiLCJtb2R1bGUuZXhwb3J0cyA9IFwiLy8gVmVydGV4IHNoYWRlciBmb3IgZnVsbHNjcmVlbiBxdWFkLlxcbnByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5cXG5hdHRyaWJ1dGUgdmVjMiBhX2ludGVybmFsX3Bvc2l0aW9uO1xcblxcbnVuaWZvcm0gZmxvYXQgdV9pbnRlcm5hbF9oYWxmVGhpY2tuZXNzO1xcbnVuaWZvcm0gdmVjMiB1X2ludGVybmFsX3NjYWxlO1xcbnVuaWZvcm0gZmxvYXQgdV9pbnRlcm5hbF9sZW5ndGg7XFxudW5pZm9ybSBmbG9hdCB1X2ludGVybmFsX3JvdGF0aW9uO1xcbnVuaWZvcm0gdmVjMiB1X2ludGVybmFsX3RyYW5zbGF0aW9uO1xcblxcbnZhcnlpbmcgdmVjMiB2X1VWX2xvY2FsO1xcbnZhcnlpbmcgdmVjMiB2X1VWO1xcblxcbm1hdDIgcm90YXRlMmQoZmxvYXQgX2FuZ2xlKXtcXG5cXHRyZXR1cm4gbWF0Mihjb3MoX2FuZ2xlKSwgLXNpbihfYW5nbGUpLCBzaW4oX2FuZ2xlKSwgY29zKF9hbmdsZSkpO1xcbn1cXG5cXG52b2lkIG1haW4oKSB7XFxuXFx0Ly8gQ2FsY3VsYXRlIFVWIGNvb3JkaW5hdGVzIG9mIGN1cnJlbnQgcmVuZGVyZWQgb2JqZWN0LlxcblxcdHZfVVZfbG9jYWwgPSAwLjUgKiAoYV9pbnRlcm5hbF9wb3NpdGlvbiArIDEuMCk7XFxuXFxuXFx0dmVjMiBwb3NpdGlvbiA9IGFfaW50ZXJuYWxfcG9zaXRpb247XFxuXFxuXFx0Ly8gQXBwbHkgdGhpY2tuZXNzIC8gcmFkaXVzLlxcblxcdHBvc2l0aW9uICo9IHVfaW50ZXJuYWxfaGFsZlRoaWNrbmVzcztcXG5cXG5cXHQvLyBTdHJldGNoIGNlbnRlciBvZiBzaGFwZSB0byBmb3JtIGEgcm91bmQtY2FwcGVkIGxpbmUgc2VnbWVudC5cXG5cXHRpZiAocG9zaXRpb24ueCA8IDAuMCkge1xcblxcdFxcdHBvc2l0aW9uLnggLT0gdV9pbnRlcm5hbF9sZW5ndGggLyAyLjA7XFxuXFx0XFx0dl9VVl9sb2NhbC54ID0gMC4wOyAvLyBTZXQgZW50aXJlIGNhcCBVVi54IHRvIDAuXFxuXFx0fSBlbHNlIGlmIChwb3NpdGlvbi54ID4gMC4wKSB7XFxuXFx0XFx0cG9zaXRpb24ueCArPSB1X2ludGVybmFsX2xlbmd0aCAvIDIuMDtcXG5cXHRcXHR2X1VWX2xvY2FsLnggPSAxLjA7IC8vIFNldCBlbnRpcmUgY2FwIFVWLnggdG8gMS5cXG5cXHR9XFxuXFxuXFx0Ly8gQXBwbHkgdHJhbnNmb3JtYXRpb25zLlxcblxcdHBvc2l0aW9uID0gdV9pbnRlcm5hbF9zY2FsZSAqIChyb3RhdGUyZCgtdV9pbnRlcm5hbF9yb3RhdGlvbikgKiBwb3NpdGlvbikgKyB1X2ludGVybmFsX3RyYW5zbGF0aW9uO1xcblxcblxcdC8vIENhbGN1bGF0ZSBhIGdsb2JhbCB1diBmb3IgdGhlIHZpZXdwb3J0LlxcblxcdHZfVVYgPSAwLjUgKiAocG9zaXRpb24gKyAxLjApO1xcblxcblxcdC8vIENhbGN1bGF0ZSB2ZXJ0ZXggcG9zaXRpb24uXFxuXFx0Z2xfUG9zaXRpb24gPSB2ZWM0KHBvc2l0aW9uLCAwLCAxKTtcXG59XCIiLCJtb2R1bGUuZXhwb3J0cyA9IFwiLy8gRnJhZ21lbnQgc2hhZGVyIHRoYXQgZHJhd3MgYSBzaW5nbGUgY29sb3IuXFxucHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcblxcbnVuaWZvcm0gdmVjMyB1X2NvbG9yO1xcblxcbnZvaWQgbWFpbigpIHtcXG5cXHRnbF9GcmFnQ29sb3IgPSB2ZWM0KHVfY29sb3IsIDEpO1xcbn1cIiIsIm1vZHVsZS5leHBvcnRzID0gXCIvLyBGcmFnbWVudCBzaGFkZXIgdGhhdCBkcmF3cyBhIHNpbmdsZSBjb2xvci5cXG5wcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxuXFxudW5pZm9ybSB2ZWMzIHVfY29sb3I7XFxudmFyeWluZyB2ZWMyIHZfbGluZVdyYXBwaW5nO1xcblxcbnZvaWQgbWFpbigpIHtcXG5cXHQvLyBjaGVjayBpZiB0aGlzIGxpbmUgaGFzIHdyYXBwZWQuXFxuXFx0aWYgKCh2X2xpbmVXcmFwcGluZy54ICE9IDAuMCAmJiB2X2xpbmVXcmFwcGluZy54ICE9IDEuMCkgfHwgKHZfbGluZVdyYXBwaW5nLnkgIT0gMC4wICYmIHZfbGluZVdyYXBwaW5nLnkgIT0gMS4wKSkge1xcblxcdFxcdC8vIFJlbmRlciBub3RoaW5nLlxcblxcdFxcdGRpc2NhcmQ7XFxuXFx0XFx0cmV0dXJuO1xcblxcdH1cXG5cXHRnbF9GcmFnQ29sb3IgPSB2ZWM0KHVfY29sb3IsIDEpO1xcbn1cIiIsIm1vZHVsZS5leHBvcnRzID0gXCJwcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxucHJlY2lzaW9uIGhpZ2hwIGludDtcXG5cXG4vKipcXG4gKiBSZXR1cm5zIGFjY3VyYXRlIE1PRCB3aGVuIGFyZ3VtZW50cyBhcmUgYXBwcm94aW1hdGUgaW50ZWdlcnMuXFxuICovXFxuZmxvYXQgbW9kSShmbG9hdCBhLCBmbG9hdCBiKSB7XFxuICAgIGZsb2F0IG0gPSBhIC0gZmxvb3IoKGEgKyAwLjUpIC8gYikgKiBiO1xcbiAgICByZXR1cm4gZmxvb3IobSArIDAuNSk7XFxufVxcblxcbi8vIENhbm5vdCB1c2UgaW50IHZlcnRleCBhdHRyaWJ1dGVzOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yNzg3NDk4My93ZWJnbC1ob3ctdG8tdXNlLWludGVnZXItYXR0cmlidXRlcy1pbi1nbHNsXFxuYXR0cmlidXRlIGZsb2F0IGFfaW50ZXJuYWxfaW5kZXg7IC8vIEluZGV4IG9mIHBvaW50LlxcblxcbnVuaWZvcm0gc2FtcGxlcjJEIHVfaW50ZXJuYWxfdmVjdG9yczsgLy8gVGV4dHVyZSBsb29rdXAgd2l0aCB2ZWN0b3IgZGF0YS5cXG51bmlmb3JtIHZlYzIgdV9pbnRlcm5hbF9kaW1lbnNpb25zO1xcbnVuaWZvcm0gdmVjMiB1X2ludGVybmFsX3NjYWxlO1xcblxcbnZhcnlpbmcgdmVjMiB2X1VWO1xcblxcbnZvaWQgbWFpbigpIHtcXG5cXHQvLyBEaXZpZGUgaW5kZXggYnkgMi5cXG5cXHRmbG9hdCBpbmRleCA9IGZsb29yKChhX2ludGVybmFsX2luZGV4ICsgMC41KSAvIDIuMCk7XFxuXFx0Ly8gQ2FsY3VsYXRlIGEgdXYgYmFzZWQgb24gdGhlIHZlcnRleCBpbmRleCBhdHRyaWJ1dGUuXFxuXFx0dl9VViA9IHZlYzIoXFxuXFx0XFx0bW9kSShpbmRleCwgdV9pbnRlcm5hbF9kaW1lbnNpb25zLngpLFxcblxcdFxcdGZsb29yKGZsb29yKGluZGV4ICsgMC41KSAvIHVfaW50ZXJuYWxfZGltZW5zaW9ucy54KVxcblxcdCkgLyB1X2ludGVybmFsX2RpbWVuc2lvbnM7XFxuXFxuXFx0Ly8gQWRkIHZlY3RvciBkaXNwbGFjZW1lbnQgaWYgbmVlZGVkLlxcblxcdGlmIChtb2RJKGFfaW50ZXJuYWxfaW5kZXgsIDIuMCkgPiAwLjApIHtcXG5cXHRcXHQvLyBMb29rdXAgdmVjdG9yRGF0YSBhdCBjdXJyZW50IFVWLlxcblxcdFxcdHZlYzIgdmVjdG9yRGF0YSA9IHRleHR1cmUyRCh1X2ludGVybmFsX3ZlY3RvcnMsIHZfVVYpLnh5O1xcblxcdFxcdHZfVVYgKz0gdmVjdG9yRGF0YSAqIHVfaW50ZXJuYWxfc2NhbGU7XFxuXFx0fVxcblxcblxcdC8vIENhbGN1bGF0ZSBwb3NpdGlvbiBpbiBbLTEsIDFdIHJhbmdlLlxcblxcdHZlYzIgcG9zaXRpb24gPSB2X1VWICogMi4wIC0gMS4wO1xcblxcblxcdGdsX1Bvc2l0aW9uID0gdmVjNChwb3NpdGlvbiwgMCwgMSk7XFxufVwiIiwibW9kdWxlLmV4cG9ydHMgPSBcIiN2ZXJzaW9uIDMwMCBlc1xcbnByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5wcmVjaXNpb24gaGlnaHAgc2FtcGxlcjJEO1xcblxcbmluIHZlYzIgdl9VVjtcXG5cXG51bmlmb3JtIHNhbXBsZXIyRCB1X3N0YXRlO1xcblxcbm91dCB2ZWM0IG91dF9mcmFnQ29sb3I7XFxuXFxudm9pZCBtYWluKCkge1xcblxcdG91dF9mcmFnQ29sb3IgPSB0ZXh0dXJlKHVfc3RhdGUsIHZfVVYpO1xcbn1cIiIsIm1vZHVsZS5leHBvcnRzID0gXCIjdmVyc2lvbiAzMDAgZXNcXG5wcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxucHJlY2lzaW9uIGhpZ2hwIGludDtcXG5wcmVjaXNpb24gaGlnaHAgaXNhbXBsZXIyRDtcXG5cXG5pbiB2ZWMyIHZfVVY7XFxuXFxudW5pZm9ybSBpc2FtcGxlcjJEIHVfc3RhdGU7XFxuXFxub3V0IGl2ZWM0IG91dF9mcmFnQ29sb3I7XFxuXFxudm9pZCBtYWluKCkge1xcblxcdG91dF9mcmFnQ29sb3IgPSB0ZXh0dXJlKHVfc3RhdGUsIHZfVVYpO1xcbn1cIiIsIm1vZHVsZS5leHBvcnRzID0gXCIjdmVyc2lvbiAzMDAgZXNcXG5wcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxucHJlY2lzaW9uIGhpZ2hwIGludDtcXG5wcmVjaXNpb24gaGlnaHAgdXNhbXBsZXIyRDtcXG5cXG5pbiB2ZWMyIHZfVVY7XFxuXFxudW5pZm9ybSB1c2FtcGxlcjJEIHVfc3RhdGU7XFxuXFxub3V0IHV2ZWM0IG91dF9mcmFnQ29sb3I7XFxuXFxudm9pZCBtYWluKCkge1xcblxcdG91dF9mcmFnQ29sb3IgPSB0ZXh0dXJlKHVfc3RhdGUsIHZfVVYpO1xcbn1cIiIsIm1vZHVsZS5leHBvcnRzID0gXCIjdmVyc2lvbiAzMDAgZXNcXG5wcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxuXFxuaW4gdmVjMiBhX2ludGVybmFsX3Bvc2l0aW9uO1xcblxcbnVuaWZvcm0gdmVjMiB1X2ludGVybmFsX3NjYWxlO1xcbnVuaWZvcm0gdmVjMiB1X2ludGVybmFsX3RyYW5zbGF0aW9uO1xcblxcbm91dCB2ZWMyIHZfVVZfbG9jYWw7XFxub3V0IHZlYzIgdl9VVjtcXG5vdXQgdmVjMiBvdXRfcG9zaXRpb247XFxuXFxudm9pZCBtYWluKCkge1xcblxcdC8vIENhbGN1bGF0ZSBVViBjb29yZGluYXRlcyBvZiBjdXJyZW50IHJlbmRlcmVkIG9iamVjdC5cXG5cXHR2X1VWX2xvY2FsID0gMC41ICogKGFfaW50ZXJuYWxfcG9zaXRpb24gKyAxLjApO1xcblxcblxcdC8vIEFwcGx5IHRyYW5zZm9ybWF0aW9ucy5cXG5cXHR2ZWMyIHBvc2l0aW9uID0gdV9pbnRlcm5hbF9zY2FsZSAqIGFfaW50ZXJuYWxfcG9zaXRpb24gKyB1X2ludGVybmFsX3RyYW5zbGF0aW9uO1xcblxcblxcdC8vIENhbGN1bGF0ZSBhIGdsb2JhbCB1diBmb3IgdGhlIHZpZXdwb3J0LlxcblxcdHZfVVYgPSAwLjUgKiAocG9zaXRpb24gKyAxLjApO1xcblxcblxcdC8vIENhbGN1bGF0ZSB2ZXJ0ZXggcG9zaXRpb24uXFxuXFx0b3V0X3Bvc2l0aW9uID0gcG9zaXRpb247XFxufVwiIiwibW9kdWxlLmV4cG9ydHMgPSBcIiN2ZXJzaW9uIDMwMCBlc1xcbnByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5cXG5hdHRyaWJ1dGUgdmVjMiBhX2ludGVybmFsX3Bvc2l0aW9uO1xcblxcbnVuaWZvcm0gZmxvYXQgdV9pbnRlcm5hbF9oYWxmVGhpY2tuZXNzO1xcbnVuaWZvcm0gdmVjMiB1X2ludGVybmFsX3NjYWxlO1xcbnVuaWZvcm0gZmxvYXQgdV9pbnRlcm5hbF9sZW5ndGg7XFxudW5pZm9ybSBmbG9hdCB1X2ludGVybmFsX3JvdGF0aW9uO1xcbnVuaWZvcm0gdmVjMiB1X2ludGVybmFsX3RyYW5zbGF0aW9uO1xcblxcbnZhcnlpbmcgdmVjMiB2X1VWX2xvY2FsO1xcbnZhcnlpbmcgdmVjMiB2X1VWO1xcblxcbm1hdDIgcm90YXRlMmQoZmxvYXQgX2FuZ2xlKXtcXG5cXHRyZXR1cm4gbWF0Mihjb3MoX2FuZ2xlKSwgLXNpbihfYW5nbGUpLCBzaW4oX2FuZ2xlKSwgY29zKF9hbmdsZSkpO1xcbn1cXG5cXG52b2lkIG1haW4oKSB7XFxuXFx0Ly8gQ2FsY3VsYXRlIFVWIGNvb3JkaW5hdGVzIG9mIGN1cnJlbnQgcmVuZGVyZWQgb2JqZWN0LlxcblxcdHZfVVZfbG9jYWwgPSAwLjUgKiAoYV9pbnRlcm5hbF9wb3NpdGlvbiArIDEuMCk7XFxuXFxuXFx0dmVjMiBwb3NpdGlvbiA9IGFfaW50ZXJuYWxfcG9zaXRpb247XFxuXFxuXFx0Ly8gQXBwbHkgcmFkaXVzLlxcblxcdHBvc2l0aW9uICo9IHVfaW50ZXJuYWxfcmFkaXVzO1xcblxcblxcdC8vIFN0cmV0Y2ggY2VudGVyIG9mIHNoYXBlIHRvIGZvcm0gYSByb3VuZC1jYXBwZWQgbGluZSBzZWdtZW50LlxcblxcdGlmIChwb3NpdGlvbi54IDwgMC4wKSB7XFxuXFx0XFx0cG9zaXRpb24ueCAtPSB1X2ludGVybmFsX2xlbmd0aCAvIDIuMDtcXG5cXHRcXHR2X1VWX2xvY2FsLnggPSAwLjA7IC8vIFNldCBlbnRpcmUgY2FwIFVWLnggdG8gMC5cXG5cXHR9IGVsc2UgaWYgKHBvc2l0aW9uLnggPiAwLjApIHtcXG5cXHRcXHRwb3NpdGlvbi54ICs9IHVfaW50ZXJuYWxfbGVuZ3RoIC8gMi4wO1xcblxcdFxcdHZfVVZfbG9jYWwueCA9IDEuMDsgLy8gU2V0IGVudGlyZSBjYXAgVVYueCB0byAxLlxcblxcdH1cXG5cXG5cXHQvLyBBcHBseSB0cmFuc2Zvcm1hdGlvbnMuXFxuXFx0cG9zaXRpb24gPSB1X2ludGVybmFsX3NjYWxlICogKHJvdGF0ZTJkKC11X2ludGVybmFsX3JvdGF0aW9uKSAqIHBvc2l0aW9uKSArIHVfaW50ZXJuYWxfdHJhbnNsYXRpb247XFxuXFxuXFx0Ly8gQ2FsY3VsYXRlIGEgZ2xvYmFsIHV2IGZvciB0aGUgdmlld3BvcnQuXFxuXFx0dl9VViA9IDAuNSAqIChwb3NpdGlvbiArIDEuMCk7XFxuXFxuXFx0Ly8gQ2FsY3VsYXRlIHZlcnRleCBwb3NpdGlvbi5cXG5cXHRnbF9Qb3NpdGlvbiA9IHZlYzQocG9zaXRpb24sIDAsIDEpO1xcbn1cIiIsIm1vZHVsZS5leHBvcnRzID0gXCIvLyBGcmFnbWVudCBzaGFkZXIgdGhhdCBkcmF3cyBhIHNpbmdsZSBjb2xvci5cXG5wcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxuXFxudW5pZm9ybSB2ZWMzIHVfY29sb3I7XFxuXFxudm9pZCBtYWluKCkge1xcblxcdGdsX0ZyYWdDb2xvciA9IHZlYzQodV9jb2xvciwgMSk7XFxufVwiIiwibW9kdWxlLmV4cG9ydHMgPSBcIi8vIEZyYWdtZW50IHNoYWRlciB0aGF0IGRyYXdzIGEgc2luZ2xlIGNvbG9yLlxcbnByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5cXG51bmlmb3JtIHZlYzMgdV9jb2xvcjtcXG52YXJ5aW5nIHZlYzIgdl9saW5lV3JhcHBpbmc7XFxuXFxudm9pZCBtYWluKCkge1xcblxcdC8vIGNoZWNrIGlmIHRoaXMgbGluZSBoYXMgd3JhcHBlZC5cXG5cXHRpZiAoKHZfbGluZVdyYXBwaW5nLnggIT0gMC4wICYmIHZfbGluZVdyYXBwaW5nLnggIT0gMS4wKSB8fCAodl9saW5lV3JhcHBpbmcueSAhPSAwLjAgJiYgdl9saW5lV3JhcHBpbmcueSAhPSAxLjApKSB7XFxuXFx0XFx0Ly8gUmVuZGVyIG5vdGhpbmcuXFxuXFx0XFx0ZGlzY2FyZDtcXG5cXHRcXHRyZXR1cm47XFxuXFx0fVxcblxcdGdsX0ZyYWdDb2xvciA9IHZlYzQodV9jb2xvciwgMSk7XFxufVwiIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0bG9hZGVkOiBmYWxzZSxcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG5cdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmhtZCA9IChtb2R1bGUpID0+IHtcblx0bW9kdWxlID0gT2JqZWN0LmNyZWF0ZShtb2R1bGUpO1xuXHRpZiAoIW1vZHVsZS5jaGlsZHJlbikgbW9kdWxlLmNoaWxkcmVuID0gW107XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtb2R1bGUsICdleHBvcnRzJywge1xuXHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0c2V0OiAoKSA9PiB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0VTIE1vZHVsZXMgbWF5IG5vdCBhc3NpZ24gbW9kdWxlLmV4cG9ydHMgb3IgZXhwb3J0cy4qLCBVc2UgRVNNIGV4cG9ydCBzeW50YXgsIGluc3RlYWQ6ICcgKyBtb2R1bGUuaWQpO1xuXHRcdH1cblx0fSk7XG5cdHJldHVybiBtb2R1bGU7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9pbmRleC50c1wiKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=