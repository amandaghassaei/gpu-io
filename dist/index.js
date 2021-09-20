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
    WebGLCompute.prototype.stepStrip = function (params) {
        var program = params.program, input = params.input, output = params.output, positions = params.positions, uvs = params.uvs, normals = params.normals;
        var _a = this, gl = _a.gl, width = _a.width, height = _a.height, errorState = _a.errorState;
        // Ignore if we are in error state.
        if (errorState) {
            return;
        }
        var glProgram = program.polylineProgram;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9AcGV0YW1vcmlrZW4vZmxvYXQxNi9zcmMvRmxvYXQxNkFycmF5LmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9AcGV0YW1vcmlrZW4vZmxvYXQxNi9zcmMvYnVnLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9AcGV0YW1vcmlrZW4vZmxvYXQxNi9zcmMvZGF0YVZpZXcuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL0BwZXRhbW9yaWtlbi9mbG9hdDE2L3NyYy9oZnJvdW5kLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9AcGV0YW1vcmlrZW4vZmxvYXQxNi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL0BwZXRhbW9yaWtlbi9mbG9hdDE2L3NyYy9pcy5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvQHBldGFtb3Jpa2VuL2Zsb2F0MTYvc3JjL2xpYi5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvQHBldGFtb3Jpa2VuL2Zsb2F0MTYvc3JjL3ByaXZhdGUuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL0BwZXRhbW9yaWtlbi9mbG9hdDE2L3NyYy9zcGVjLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9jaGFuZ2VkcGkvZGlzdC9pbmRleC5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvZmlsZS1zYXZlci9kaXN0L0ZpbGVTYXZlci5taW4uanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fSGFzaC5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19MaXN0Q2FjaGUuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fTWFwLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX01hcENhY2hlLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX1N5bWJvbC5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19hc3NvY0luZGV4T2YuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fYmFzZUdldFRhZy5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19iYXNlSXNBcnJheUJ1ZmZlci5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19iYXNlSXNOYXRpdmUuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fYmFzZVVuYXJ5LmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2NvcmVKc0RhdGEuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fZnJlZUdsb2JhbC5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19nZXRNYXBEYXRhLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2dldE5hdGl2ZS5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19nZXRSYXdUYWcuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fZ2V0VmFsdWUuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9faGFzaENsZWFyLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2hhc2hEZWxldGUuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9faGFzaEdldC5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19oYXNoSGFzLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2hhc2hTZXQuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9faXNLZXlhYmxlLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2lzTWFza2VkLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2xpc3RDYWNoZUNsZWFyLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2xpc3RDYWNoZURlbGV0ZS5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19saXN0Q2FjaGVHZXQuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fbGlzdENhY2hlSGFzLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2xpc3RDYWNoZVNldC5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19tYXBDYWNoZUNsZWFyLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX21hcENhY2hlRGVsZXRlLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX21hcENhY2hlR2V0LmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX21hcENhY2hlSGFzLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX21hcENhY2hlU2V0LmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX25hdGl2ZUNyZWF0ZS5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19ub2RlVXRpbC5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19vYmplY3RUb1N0cmluZy5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19yb290LmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX3RvU291cmNlLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvZXEuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9pc0FycmF5QnVmZmVyLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvaXNGdW5jdGlvbi5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL2lzT2JqZWN0LmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvaXNPYmplY3RMaWtlLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvbWVtb2l6ZS5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9zcmMvQ2hlY2tzLnRzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL3NyYy9Db25zdGFudHMudHMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vc3JjL0RhdGFMYXllci50cyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9zcmMvR1BVUHJvZ3JhbS50cyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9zcmMvV2ViR0xDb21wdXRlLnRzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL3NyYy9leHRlbnNpb25zLnRzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9zcmMvdXRpbHMudHMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vc3JjL3V0aWxzL1ZlY3RvcjQudHMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vc3JjL2dsc2xfMS9Db3B5RnJhZ1NoYWRlci5nbHNsIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL3NyYy9nbHNsXzEvRGVmYXVsdFZlcnRleFNoYWRlci5nbHNsIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL3NyYy9nbHNsXzEvSW5kZXhlZExpbmVzVmVydGV4U2hhZGVyLmdsc2wiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vc3JjL2dsc2xfMS9Qb2ludHNWZXJ0ZXhTaGFkZXIuZ2xzbCIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9zcmMvZ2xzbF8xL1BvbHlsaW5lVmVydGV4U2hhZGVyLmdsc2wiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vc3JjL2dsc2xfMS9TZWdtZW50VmVydGV4U2hhZGVyLmdsc2wiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vc3JjL2dsc2xfMS9TaW5nbGVDb2xvckZyYWdTaGFkZXIuZ2xzbCIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9zcmMvZ2xzbF8xL1NpbmdsZUNvbG9yV2l0aFdyYXBDaGVja0ZyYWdTaGFkZXIuZ2xzbCIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9zcmMvZ2xzbF8xL1ZlY3RvckZpZWxkVmVydGV4U2hhZGVyLmdsc2wiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vc3JjL2dsc2xfMy9Db3B5RmxvYXRGcmFnU2hhZGVyLmdsc2wiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vc3JjL2dsc2xfMy9Db3B5SW50RnJhZ1NoYWRlci5nbHNsIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL3NyYy9nbHNsXzMvQ29weVVpbnRGcmFnU2hhZGVyLmdsc2wiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vc3JjL2dsc2xfMy9EZWZhdWx0VmVydGV4U2hhZGVyLmdsc2wiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vc3JjL2dsc2xfMy9TZWdtZW50VmVydGV4U2hhZGVyLmdsc2wiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vc3JjL2dsc2xfMy9TaW5nbGVDb2xvckZyYWdTaGFkZXIuZ2xzbCIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9zcmMvZ2xzbF8zL1NpbmdsZUNvbG9yV2l0aFdyYXBDaGVja0ZyYWdTaGFkZXIuZ2xzbCIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvd2VicGFjay9ydW50aW1lL2hhcm1vbnkgbW9kdWxlIGRlY29yYXRvciIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvd2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNWd0M7QUFDb0I7QUFDSjtBQUNJO0FBQ1g7QUFDVTs7QUFFM0QsVUFBVSw4REFBb0I7O0FBRTlCO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFdBQVcsYUFBYTtBQUN4QixZQUFZO0FBQ1o7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0JBQWtCLFlBQVk7QUFDOUIsbUJBQW1CLHFEQUFlO0FBQ2xDOztBQUVBO0FBQ0E7O0FBRUEsV0FBVyx1QkFBdUI7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSztBQUNMOztBQUVBLFdBQVcsMkJBQTJCO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBLGFBQWEscUVBQW1DO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQSxZQUFZLHNEQUFpQjtBQUM3Qiw4Q0FBOEMscURBQWU7QUFDN0QsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0EsYUFBYSxxRUFBbUM7QUFDaEQ7QUFDQTtBQUNBOztBQUVBLFlBQVks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dEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pELEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDO2dCQUN4QixFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDO2dCQUUxQixpQkFBaUI7Z0JBQ2pCLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsYUFBYSxDQUFDO2dCQUNyRixTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxhQUFhLENBQUM7Z0JBQ3pGLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLGFBQWEsQ0FBQztnQkFDekYsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsYUFBYSxDQUFDO2dCQUN6RixJQUFJLEdBQUcsRUFBRTtvQkFDUixHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ25ELEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ3ZELEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ3ZELEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ3ZEO2dCQUNELElBQUksT0FBTyxFQUFFO29CQUNaLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDM0QsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDL0QsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDL0QsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDL0Q7Z0JBRUQsNkNBQTZDO2dCQUM3QyxJQUFNLEtBQUssR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVDLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJO29CQUFFLFNBQVM7Z0JBQ3JDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN0QixFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdEIsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDekQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLE9BQU8sQ0FBQztnQkFDakIsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLE9BQU8sQ0FBQztnQkFDakIsaUNBQWlDO2dCQUNqQyxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN2RCxJQUFNLE1BQU0sR0FBRyxhQUFhLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ25ELElBQUksS0FBSyxHQUFHLENBQUMsRUFBRTtvQkFDZCxTQUFTLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO29CQUM5QyxTQUFTLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztvQkFDbEQsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQztvQkFDNUUsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO2lCQUNwRjtxQkFBTTtvQkFDTixTQUFTLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztvQkFDbEQsU0FBUyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7b0JBQ2xELFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDcEYsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO2lCQUNwRjthQUNEO1NBQ0Q7UUFDRCxJQUFJLFNBQVMsRUFBRTtZQUNkLHVEQUF1RDtZQUN2RCxTQUFTLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsRCxTQUFTLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xELFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEQsSUFBSSxHQUFHLEVBQUU7Z0JBQ1IsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsQyxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN0QyxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN0QyxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3RDO1lBQ0QsSUFBSSxPQUFPLEVBQUU7Z0JBQ1osT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMxQyxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM5QyxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM5QyxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQzlDO1NBQ0Q7UUFFRCxJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsZUFBZ0IsQ0FBQztRQUUzQyxtQ0FBbUM7UUFDbkMsSUFBSSxDQUFDLFNBQVMsQ0FB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R0FBRyxDOzs7Ozs7Ozs7O0FDQXZtQix5REFBeUQsdUNBQXVDLDJDQUEyQyxnQ0FBZ0Msa0NBQWtDLG9DQUFvQyxzQ0FBc0MsNEJBQTRCLG9CQUFvQixnQ0FBZ0MscUVBQXFFLEdBQUcsaUJBQWlCLDhHQUE4RywwQ0FBMEMsd0RBQXdELGdHQUFnRyw0Q0FBNEMseUJBQXlCLGtDQUFrQyw2QkFBNkIsNENBQTRDLHlCQUF5QixrQ0FBa0Msc0lBQXNJLGtGQUFrRiwwRUFBMEUsR0FBRyxDOzs7Ozs7Ozs7O0FDQWh3Qyx1RkFBdUYseUJBQXlCLGlCQUFpQixvQ0FBb0MsR0FBRyxDOzs7Ozs7Ozs7O0FDQXhLLHVGQUF1Rix5QkFBeUIsOEJBQThCLGlCQUFpQiw2SkFBNkosc0NBQXNDLGFBQWEsS0FBSyxvQ0FBb0MsR0FBRyxDOzs7Ozs7VUNBM1o7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3pCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHdDQUF3Qyx5Q0FBeUM7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSxFQUFFO1dBQ0Y7V0FDQTtXQUNBLENBQUMsSTs7Ozs7V0NQRDtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsRUFBRTtXQUNGO1dBQ0EsRTs7Ozs7V0NWQSx3Rjs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSxzREFBc0Qsa0JBQWtCO1dBQ3hFO1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7Ozs7VUNOQTtVQUNBO1VBQ0E7VUFDQSIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIldlYkdMQ29tcHV0ZVwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJXZWJHTENvbXB1dGVcIl0gPSBmYWN0b3J5KCk7XG59KShzZWxmLCBmdW5jdGlvbigpIHtcbnJldHVybiAiLCJpbXBvcnQgbWVtb2l6ZSBmcm9tIFwibG9kYXNoLWVzL21lbW9pemVcIjtcbmltcG9ydCB7IGlzVHlwZWRBcnJheUluZGV4ZWRQcm9wZXJ0eVdyaXRhYmxlIH0gZnJvbSBcIi4vYnVnXCI7XG5pbXBvcnQgeyBpc0FycmF5QnVmZmVyLCBpc1N0cmluZ051bWJlcktleSB9IGZyb20gXCIuL2lzXCI7XG5pbXBvcnQgeyBjb252ZXJ0VG9OdW1iZXIsIHJvdW5kVG9GbG9hdDE2Qml0cyB9IGZyb20gXCIuL2xpYlwiO1xuaW1wb3J0IHsgY3JlYXRlUHJpdmF0ZVN0b3JhZ2UgfSBmcm9tIFwiLi9wcml2YXRlXCI7XG5pbXBvcnQgeyBUb0ludGVnZXIsIGRlZmF1bHRDb21wYXJlRnVuY3Rpb24gfSBmcm9tIFwiLi9zcGVjXCI7XG5cbmNvbnN0IF8gPSBjcmVhdGVQcml2YXRlU3RvcmFnZSgpO1xuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdGFyZ2V0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaXNGbG9hdDE2QXJyYXkodGFyZ2V0KSB7XG4gICAgcmV0dXJuIHRhcmdldCBpbnN0YW5jZW9mIEZsb2F0MTZBcnJheTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHRhcmdldFxuICogQHRocm93cyB7VHlwZUVycm9yfVxuICovXG5mdW5jdGlvbiBhc3NlcnRGbG9hdDE2QXJyYXkodGFyZ2V0KSB7XG4gICAgaWYgKCFpc0Zsb2F0MTZBcnJheSh0YXJnZXQpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJUaGlzIGlzIG5vdCBhIEZsb2F0MTZBcnJheVwiKTtcbiAgICB9XG59XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB0YXJnZXRcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBpc0RlZmF1bHRGbG9hdDE2QXJyYXlNZXRob2RzKHRhcmdldCkge1xuICAgIHJldHVybiB0eXBlb2YgdGFyZ2V0ID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmYXVsdEZsb2F0MTZBcnJheU1ldGhvZHMuaGFzKHRhcmdldCk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtGbG9hdDE2QXJyYXl9IGZsb2F0MTZiaXRzXG4gKiBAcmV0dXJuIHtudW1iZXJbXX1cbiAqL1xuZnVuY3Rpb24gY29weVRvQXJyYXkoZmxvYXQxNmJpdHMpIHtcbiAgICBjb25zdCBsZW5ndGggPSBmbG9hdDE2Yml0cy5sZW5ndGg7XG5cbiAgICBjb25zdCBhcnJheSA9IG5ldyBBcnJheShsZW5ndGgpO1xuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICBhcnJheVtpXSA9IGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0c1tpXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFycmF5O1xufVxuXG4vKiogQHR5cGUge1Byb3h5SGFuZGxlcjxGdW5jdGlvbj59ICovXG5jb25zdCBhcHBseUhhbmRsZXIgPSB7XG4gICAgYXBwbHkoZnVuYywgdGhpc0FyZywgYXJncykge1xuICAgICAgICAvLyBwZWVsIG9mZiBwcm94eVxuICAgICAgICBpZiAoaXNGbG9hdDE2QXJyYXkodGhpc0FyZykgJiYgaXNEZWZhdWx0RmxvYXQxNkFycmF5TWV0aG9kcyhmdW5jKSkge1xuICAgICAgICAgICAgcmV0dXJuIFJlZmxlY3QuYXBwbHkoZnVuYywgXyh0aGlzQXJnKS50YXJnZXQgLGFyZ3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFJlZmxlY3QuYXBwbHkoZnVuYywgdGhpc0FyZywgYXJncyk7XG4gICAgfSxcbn07XG5cbi8qKiBAdHlwZSB7UHJveHlIYW5kbGVyPEZsb2F0MTZBcnJheT59ICovXG5jb25zdCBoYW5kbGVyID0ge1xuICAgIGdldCh0YXJnZXQsIGtleSkge1xuICAgICAgICBsZXQgd3JhcHBlciA9IG51bGw7XG4gICAgICAgIGlmICghaXNUeXBlZEFycmF5SW5kZXhlZFByb3BlcnR5V3JpdGFibGUpIHtcbiAgICAgICAgICAgIHdyYXBwZXIgPSB0YXJnZXQ7XG4gICAgICAgICAgICB0YXJnZXQgPSBfKHdyYXBwZXIpLnRhcmdldDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc1N0cmluZ051bWJlcktleShrZXkpKSB7XG4gICAgICAgICAgICByZXR1cm4gUmVmbGVjdC5oYXModGFyZ2V0LCBrZXkpID8gY29udmVydFRvTnVtYmVyKFJlZmxlY3QuZ2V0KHRhcmdldCwga2V5KSkgOiB1bmRlZmluZWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCByZXQgPSB3cmFwcGVyICE9PSBudWxsICYmIFJlZmxlY3QuaGFzKHdyYXBwZXIsIGtleSkgPyBSZWZsZWN0LmdldCh3cmFwcGVyLCBrZXkpIDogUmVmbGVjdC5nZXQodGFyZ2V0LCBrZXkpO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIHJldCAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVHlwZWRBcnJheSBtZXRob2RzIGNhbid0IGJlIGNhbGxlZCBieSBQcm94eSBPYmplY3RcbiAgICAgICAgICAgIGxldCBwcm94eSA9IF8ocmV0KS5wcm94eTtcblxuICAgICAgICAgICAgaWYgKHByb3h5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBwcm94eSA9IF8ocmV0KS5wcm94eSA9IG5ldyBQcm94eShyZXQsIGFwcGx5SGFuZGxlcik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBwcm94eTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBzZXQodGFyZ2V0LCBrZXksIHZhbHVlKSB7XG4gICAgICAgIGxldCB3cmFwcGVyID0gbnVsbDtcbiAgICAgICAgaWYgKCFpc1R5cGVkQXJyYXlJbmRleGVkUHJvcGVydHlXcml0YWJsZSkge1xuICAgICAgICAgICAgd3JhcHBlciA9IHRhcmdldDtcbiAgICAgICAgICAgIHRhcmdldCA9IF8od3JhcHBlcikudGFyZ2V0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzU3RyaW5nTnVtYmVyS2V5KGtleSkpIHtcbiAgICAgICAgICAgIHJldHVybiBSZWZsZWN0LnNldCh0YXJnZXQsIGtleSwgcm91bmRUb0Zsb2F0MTZCaXRzKHZhbHVlKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBmcm96ZW4gb2JqZWN0IGNhbid0IGNoYW5nZSBwcm90b3R5cGUgcHJvcGVydHlcbiAgICAgICAgICAgIGlmICh3cmFwcGVyICE9PSBudWxsICYmICghUmVmbGVjdC5oYXModGFyZ2V0LCBrZXkpIHx8IE9iamVjdC5pc0Zyb3plbih3cmFwcGVyKSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUmVmbGVjdC5zZXQod3JhcHBlciwga2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBSZWZsZWN0LnNldCh0YXJnZXQsIGtleSwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbn07XG5cbmlmICghaXNUeXBlZEFycmF5SW5kZXhlZFByb3BlcnR5V3JpdGFibGUpIHtcbiAgICBoYW5kbGVyLmdldFByb3RvdHlwZU9mID0gKHdyYXBwZXIpID0+IHsgcmV0dXJuIFJlZmxlY3QuZ2V0UHJvdG90eXBlT2YoXyh3cmFwcGVyKS50YXJnZXQpOyB9O1xuICAgIGhhbmRsZXIuc2V0UHJvdG90eXBlT2YgPSAod3JhcHBlciwgcHJvdG90eXBlKSA9PiB7IHJldHVybiBSZWZsZWN0LnNldFByb3RvdHlwZU9mKF8od3JhcHBlcikudGFyZ2V0LCBwcm90b3R5cGUpOyB9O1xuXG4gICAgaGFuZGxlci5kZWZpbmVQcm9wZXJ0eSA9ICh3cmFwcGVyLCBrZXksIGRlc2NyaXB0b3IpID0+IHtcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gXyh3cmFwcGVyKS50YXJnZXQ7XG4gICAgICAgIHJldHVybiAhUmVmbGVjdC5oYXModGFyZ2V0LCBrZXkpIHx8IE9iamVjdC5pc0Zyb3plbih3cmFwcGVyKSA/IFJlZmxlY3QuZGVmaW5lUHJvcGVydHkod3JhcHBlciwga2V5LCBkZXNjcmlwdG9yKSA6IFJlZmxlY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIGRlc2NyaXB0b3IpO1xuICAgIH07XG4gICAgaGFuZGxlci5kZWxldGVQcm9wZXJ0eSA9ICh3cmFwcGVyLCBrZXkpID0+IHtcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gXyh3cmFwcGVyKS50YXJnZXQ7XG4gICAgICAgIHJldHVybiBSZWZsZWN0Lmhhcyh3cmFwcGVyLCBrZXkpID8gUmVmbGVjdC5kZWxldGVQcm9wZXJ0eSh3cmFwcGVyLCBrZXkpIDogUmVmbGVjdC5kZWxldGVQcm9wZXJ0eSh0YXJnZXQsIGtleSk7XG4gICAgfTtcblxuICAgIGhhbmRsZXIuaGFzID0gKHdyYXBwZXIsIGtleSkgPT4geyByZXR1cm4gUmVmbGVjdC5oYXMod3JhcHBlciwga2V5KSB8fCBSZWZsZWN0LmhhcyhfKHdyYXBwZXIpLnRhcmdldCwga2V5KTsgfTtcblxuICAgIGhhbmRsZXIuaXNFeHRlbnNpYmxlID0gKHdyYXBwZXIpID0+IHsgcmV0dXJuIFJlZmxlY3QuaXNFeHRlbnNpYmxlKHdyYXBwZXIpOyB9O1xuICAgIGhhbmRsZXIucHJldmVudEV4dGVuc2lvbnMgPSAod3JhcHBlcikgPT4geyByZXR1cm4gUmVmbGVjdC5wcmV2ZW50RXh0ZW5zaW9ucyh3cmFwcGVyKTsgfTtcblxuICAgIGhhbmRsZXIuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gKHdyYXBwZXIsIGtleSkgPT4geyByZXR1cm4gUmVmbGVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iod3JhcHBlciwga2V5KTsgfTtcbiAgICBoYW5kbGVyLm93bktleXMgPSAod3JhcHBlcikgPT4geyByZXR1cm4gUmVmbGVjdC5vd25LZXlzKHdyYXBwZXIpOyB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGbG9hdDE2QXJyYXkgZXh0ZW5kcyBVaW50MTZBcnJheSB7XG5cbiAgICBjb25zdHJ1Y3RvcihpbnB1dCwgYnl0ZU9mZnNldCwgbGVuZ3RoKSB7XG4gICAgICAgIC8vIGlucHV0IEZsb2F0MTZBcnJheVxuICAgICAgICBpZiAoaXNGbG9hdDE2QXJyYXkoaW5wdXQpKSB7XG4gICAgICAgICAgICBzdXBlcihfKGlucHV0KS50YXJnZXQpO1xuXG4gICAgICAgIC8vIDIyLjIuMS4zLCAyMi4yLjEuNCBUeXBlZEFycmF5LCBBcnJheSwgQXJyYXlMaWtlLCBJdGVyYWJsZVxuICAgICAgICB9IGVsc2UgaWYgKGlucHV0ICE9PSBudWxsICYmIHR5cGVvZiBpbnB1dCA9PT0gXCJvYmplY3RcIiAmJiAhaXNBcnJheUJ1ZmZlcihpbnB1dCkpIHtcbiAgICAgICAgICAgIC8vIGlmIGlucHV0IGlzIG5vdCBBcnJheUxpa2UgYW5kIEl0ZXJhYmxlLCBnZXQgQXJyYXlcbiAgICAgICAgICAgIGNvbnN0IGFycmF5TGlrZSA9ICFSZWZsZWN0LmhhcyhpbnB1dCwgXCJsZW5ndGhcIikgJiYgaW5wdXRbU3ltYm9sLml0ZXJhdG9yXSAhPT0gdW5kZWZpbmVkID8gWy4uLmlucHV0XSA6IGlucHV0O1xuXG4gICAgICAgICAgICBjb25zdCBsZW5ndGggPSBhcnJheUxpa2UubGVuZ3RoO1xuICAgICAgICAgICAgc3VwZXIobGVuZ3RoKTtcblxuICAgICAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgLy8gc3VwZXIgKFVpbnQxNkFycmF5KVxuICAgICAgICAgICAgICAgIHRoaXNbaV0gPSByb3VuZFRvRmxvYXQxNkJpdHMoYXJyYXlMaWtlW2ldKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAvLyAyMi4yLjEuMiwgMjIuMi4xLjUgcHJpbWl0aXZlLCBBcnJheUJ1ZmZlclxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgIHN1cGVyKCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICBzdXBlcihpbnB1dCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICBzdXBlcihpbnB1dCwgYnl0ZU9mZnNldCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgICAgICBzdXBlcihpbnB1dCwgYnl0ZU9mZnNldCwgbGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcHJveHk7XG5cbiAgICAgICAgaWYgKGlzVHlwZWRBcnJheUluZGV4ZWRQcm9wZXJ0eVdyaXRhYmxlKSB7XG4gICAgICAgICAgICBwcm94eSA9IG5ldyBQcm94eSh0aGlzLCBoYW5kbGVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHdyYXBwZXIgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICAgICAgXyh3cmFwcGVyKS50YXJnZXQgPSB0aGlzO1xuICAgICAgICAgICAgcHJveHkgPSBuZXcgUHJveHkod3JhcHBlciwgaGFuZGxlcik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBwcm94eSBwcml2YXRlIHN0b3JhZ2VcbiAgICAgICAgXyhwcm94eSkudGFyZ2V0ID0gdGhpcztcblxuICAgICAgICAvLyB0aGlzIHByaXZhdGUgc3RvcmFnZVxuICAgICAgICBfKHRoaXMpLnByb3h5ID0gcHJveHk7XG5cbiAgICAgICAgcmV0dXJuIHByb3h5O1xuICAgIH1cblxuICAgIC8vIHN0YXRpYyBtZXRob2RzXG4gICAgc3RhdGljIGZyb20oc3JjLCAuLi5vcHRzKSB7XG4gICAgICAgIGlmIChvcHRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDE2QXJyYXkoVWludDE2QXJyYXkuZnJvbShzcmMsIHJvdW5kVG9GbG9hdDE2Qml0cykuYnVmZmVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG1hcEZ1bmMgPSBvcHRzWzBdO1xuICAgICAgICBjb25zdCB0aGlzQXJnID0gb3B0c1sxXTtcblxuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MTZBcnJheShVaW50MTZBcnJheS5mcm9tKHNyYywgZnVuY3Rpb24gKHZhbCwgLi4uYXJncykge1xuICAgICAgICAgICAgcmV0dXJuIHJvdW5kVG9GbG9hdDE2Qml0cyhtYXBGdW5jLmNhbGwodGhpcywgdmFsLCAuLi5hcmdzKSk7XG4gICAgICAgIH0sIHRoaXNBcmcpLmJ1ZmZlcik7XG4gICAgfVxuXG4gICAgc3RhdGljIG9mKC4uLmFyZ3MpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDE2QXJyYXkoYXJncyk7XG4gICAgfVxuXG4gICAgLy8gaXRlcmF0ZSBtZXRob2RzXG4gICAgKiBbU3ltYm9sLml0ZXJhdG9yXSgpIHtcbiAgICAgICAgZm9yKGNvbnN0IHZhbCBvZiBzdXBlcltTeW1ib2wuaXRlcmF0b3JdKCkpIHtcbiAgICAgICAgICAgIHlpZWxkIGNvbnZlcnRUb051bWJlcih2YWwpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAga2V5cygpIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmtleXMoKTtcbiAgICB9XG5cbiAgICAqIHZhbHVlcygpIHtcbiAgICAgICAgZm9yKGNvbnN0IHZhbCBvZiBzdXBlci52YWx1ZXMoKSkge1xuICAgICAgICAgICAgeWllbGQgY29udmVydFRvTnVtYmVyKHZhbCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKiogQHR5cGUgeygpID0+IEl0ZXJhYmxlSXRlcmF0b3I8W251bWJlciwgbnVtYmVyXT59ICovXG4gICAgKiBlbnRyaWVzKCkge1xuICAgICAgICBmb3IoY29uc3QgW2ksIHZhbF0gb2Ygc3VwZXIuZW50cmllcygpKSB7XG4gICAgICAgICAgICB5aWVsZCBbaSwgY29udmVydFRvTnVtYmVyKHZhbCldO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gZnVuY3Rpb25hbCBtZXRob2RzXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIG1hcChjYWxsYmFjaywgLi4ub3B0cykge1xuICAgICAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG5cbiAgICAgICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMF07XG5cbiAgICAgICAgY29uc3QgYXJyYXkgPSBbXTtcbiAgICAgICAgZm9yKGxldCBpID0gMCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgICAgICAgICBjb25zdCB2YWwgPSBjb252ZXJ0VG9OdW1iZXIodGhpc1tpXSk7XG4gICAgICAgICAgICBhcnJheS5wdXNoKGNhbGxiYWNrLmNhbGwodGhpc0FyZywgdmFsLCBpLCBfKHRoaXMpLnByb3h5KSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MTZBcnJheShhcnJheSk7XG4gICAgfVxuXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGZpbHRlcihjYWxsYmFjaywgLi4ub3B0cykge1xuICAgICAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG5cbiAgICAgICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMF07XG5cbiAgICAgICAgY29uc3QgYXJyYXkgPSBbXTtcbiAgICAgICAgZm9yKGxldCBpID0gMCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgICAgICAgICBjb25zdCB2YWwgPSBjb252ZXJ0VG9OdW1iZXIodGhpc1tpXSk7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB2YWwsIGksIF8odGhpcykucHJveHkpKSB7XG4gICAgICAgICAgICAgICAgYXJyYXkucHVzaCh2YWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDE2QXJyYXkoYXJyYXkpO1xuICAgIH1cblxuICAgIHJlZHVjZShjYWxsYmFjaywgLi4ub3B0cykge1xuICAgICAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG5cbiAgICAgICAgbGV0IHZhbCwgc3RhcnQ7XG5cbiAgICAgICAgaWYgKG9wdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICB2YWwgPSBjb252ZXJ0VG9OdW1iZXIodGhpc1swXSk7XG4gICAgICAgICAgICBzdGFydCA9IDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YWwgPSBvcHRzWzBdO1xuICAgICAgICAgICAgc3RhcnQgPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yKGxldCBpID0gc3RhcnQsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgICAgICAgICAgdmFsID0gY2FsbGJhY2sodmFsLCBjb252ZXJ0VG9OdW1iZXIodGhpc1tpXSksIGksIF8odGhpcykucHJveHkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbDtcbiAgICB9XG5cbiAgICByZWR1Y2VSaWdodChjYWxsYmFjaywgLi4ub3B0cykge1xuICAgICAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG5cbiAgICAgICAgbGV0IHZhbCwgc3RhcnQ7XG5cbiAgICAgICAgY29uc3QgbGVuZ3RoID0gdGhpcy5sZW5ndGg7XG4gICAgICAgIGlmIChvcHRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdmFsID0gY29udmVydFRvTnVtYmVyKHRoaXNbbGVuZ3RoIC0gMV0pO1xuICAgICAgICAgICAgc3RhcnQgPSBsZW5ndGggLSAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFsID0gb3B0c1swXTtcbiAgICAgICAgICAgIHN0YXJ0ID0gbGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yKGxldCBpID0gc3RhcnQ7IGktLTspIHtcbiAgICAgICAgICAgIHZhbCA9IGNhbGxiYWNrKHZhbCwgY29udmVydFRvTnVtYmVyKHRoaXNbaV0pLCBpLCBfKHRoaXMpLnByb3h5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2YWw7XG4gICAgfVxuXG4gICAgZm9yRWFjaChjYWxsYmFjaywgLi4ub3B0cykge1xuICAgICAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG5cbiAgICAgICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMF07XG5cbiAgICAgICAgZm9yKGxldCBpID0gMCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIGNvbnZlcnRUb051bWJlcih0aGlzW2ldKSwgaSwgXyh0aGlzKS5wcm94eSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmaW5kKGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcblxuICAgICAgICBjb25zdCB0aGlzQXJnID0gb3B0c1swXTtcblxuICAgICAgICBmb3IobGV0IGkgPSAwLCBsID0gdGhpcy5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gY29udmVydFRvTnVtYmVyKHRoaXNbaV0pO1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrLmNhbGwodGhpc0FyZywgdmFsdWUsIGksIF8odGhpcykucHJveHkpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZmluZEluZGV4KGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcblxuICAgICAgICBjb25zdCB0aGlzQXJnID0gb3B0c1swXTtcblxuICAgICAgICBmb3IobGV0IGkgPSAwLCBsID0gdGhpcy5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gY29udmVydFRvTnVtYmVyKHRoaXNbaV0pO1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrLmNhbGwodGhpc0FyZywgdmFsdWUsIGksIF8odGhpcykucHJveHkpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgZXZlcnkoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICAgICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgICAgIGZvcihsZXQgaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgICAgICAgICAgaWYgKCFjYWxsYmFjay5jYWxsKHRoaXNBcmcsIGNvbnZlcnRUb051bWJlcih0aGlzW2ldKSwgaSwgXyh0aGlzKS5wcm94eSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBzb21lKGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcblxuICAgICAgICBjb25zdCB0aGlzQXJnID0gb3B0c1swXTtcblxuICAgICAgICBmb3IobGV0IGkgPSAwLCBsID0gdGhpcy5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjay5jYWxsKHRoaXNBcmcsIGNvbnZlcnRUb051bWJlcih0aGlzW2ldKSwgaSwgXyh0aGlzKS5wcm94eSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBjaGFuZ2UgZWxlbWVudCBtZXRob2RzXG4gICAgc2V0KGlucHV0LCAuLi5vcHRzKSB7XG4gICAgICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcblxuICAgICAgICBjb25zdCBvZmZzZXQgPSBvcHRzWzBdO1xuXG4gICAgICAgIGxldCBmbG9hdDE2Yml0cztcblxuICAgICAgICAvLyBpbnB1dCBGbG9hdDE2QXJyYXlcbiAgICAgICAgaWYgKGlzRmxvYXQxNkFycmF5KGlucHV0KSkge1xuICAgICAgICAgICAgZmxvYXQxNmJpdHMgPSBfKGlucHV0KS50YXJnZXQ7XG5cbiAgICAgICAgLy8gaW5wdXQgb3RoZXJzXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBhcnJheUxpa2UgPSAhUmVmbGVjdC5oYXMoaW5wdXQsIFwibGVuZ3RoXCIpICYmIGlucHV0W1N5bWJvbC5pdGVyYXRvcl0gIT09IHVuZGVmaW5lZCA/IFsuLi5pbnB1dF0gOiBpbnB1dDtcbiAgICAgICAgICAgIGNvbnN0IGxlbmd0aCA9IGFycmF5TGlrZS5sZW5ndGg7XG5cbiAgICAgICAgICAgIGZsb2F0MTZiaXRzID0gbmV3IFVpbnQxNkFycmF5KGxlbmd0aCk7XG4gICAgICAgICAgICBmb3IobGV0IGkgPSAwLCBsID0gYXJyYXlMaWtlLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgICAgICAgICAgICAgIGZsb2F0MTZiaXRzW2ldID0gcm91bmRUb0Zsb2F0MTZCaXRzKGFycmF5TGlrZVtpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzdXBlci5zZXQoZmxvYXQxNmJpdHMsIG9mZnNldCk7XG4gICAgfVxuXG4gICAgcmV2ZXJzZSgpIHtcbiAgICAgICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgICAgIHN1cGVyLnJldmVyc2UoKTtcblxuICAgICAgICByZXR1cm4gXyh0aGlzKS5wcm94eTtcbiAgICB9XG5cbiAgICBmaWxsKHZhbHVlLCAuLi5vcHRzKSB7XG4gICAgICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcblxuICAgICAgICBzdXBlci5maWxsKHJvdW5kVG9GbG9hdDE2Qml0cyh2YWx1ZSksIC4uLm9wdHMpO1xuXG4gICAgICAgIHJldHVybiBfKHRoaXMpLnByb3h5O1xuICAgIH1cblxuICAgIGNvcHlXaXRoaW4odGFyZ2V0LCBzdGFydCwgLi4ub3B0cykge1xuICAgICAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG5cbiAgICAgICAgc3VwZXIuY29weVdpdGhpbih0YXJnZXQsIHN0YXJ0LCAuLi5vcHRzKTtcblxuICAgICAgICByZXR1cm4gXyh0aGlzKS5wcm94eTtcbiAgICB9XG5cbiAgICBzb3J0KC4uLm9wdHMpIHtcbiAgICAgICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgICAgIGxldCBjb21wYXJlRnVuY3Rpb24gPSBvcHRzWzBdO1xuXG4gICAgICAgIGlmIChjb21wYXJlRnVuY3Rpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29tcGFyZUZ1bmN0aW9uID0gZGVmYXVsdENvbXBhcmVGdW5jdGlvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IF9jb252ZXJ0VG9OdW1iZXIgPSBtZW1vaXplKGNvbnZlcnRUb051bWJlcik7XG5cbiAgICAgICAgc3VwZXIuc29ydCgoeCwgeSkgPT4geyByZXR1cm4gY29tcGFyZUZ1bmN0aW9uKF9jb252ZXJ0VG9OdW1iZXIoeCksIF9jb252ZXJ0VG9OdW1iZXIoeSkpOyB9KTtcblxuICAgICAgICByZXR1cm4gXyh0aGlzKS5wcm94eTtcbiAgICB9XG5cbiAgICAvLyBjb3B5IGVsZW1lbnQgbWV0aG9kc1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBzbGljZSguLi5vcHRzKSB7XG4gICAgICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcblxuICAgICAgICBsZXQgZmxvYXQxNmJpdHM7XG5cbiAgICAgICAgLy8gVjgsIFNwaWRlck1vbmtleSwgSmF2YVNjcmlwdENvcmUsIENoYWtyYSB0aHJvdyBUeXBlRXJyb3JcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZsb2F0MTZiaXRzID0gc3VwZXIuc2xpY2UoLi4ub3B0cyk7XG4gICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBUeXBlRXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB1aW50MTYgPSBuZXcgVWludDE2QXJyYXkodGhpcy5idWZmZXIsIHRoaXMuYnl0ZU9mZnNldCwgdGhpcy5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIGZsb2F0MTZiaXRzID0gdWludDE2LnNsaWNlKC4uLm9wdHMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDE2QXJyYXkoZmxvYXQxNmJpdHMuYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvLyBAdHMtaWdub3JlXG4gICAgc3ViYXJyYXkoLi4ub3B0cykge1xuICAgICAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG5cbiAgICAgICAgbGV0IGZsb2F0MTZiaXRzO1xuXG4gICAgICAgIC8vIFY4LCBTcGlkZXJNb25rZXksIEphdmFTY3JpcHRDb3JlLCBDaGFrcmEgdGhyb3cgVHlwZUVycm9yXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmbG9hdDE2Yml0cyA9IHN1cGVyLnN1YmFycmF5KC4uLm9wdHMpO1xuICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgIGlmIChlIGluc3RhbmNlb2YgVHlwZUVycm9yKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdWludDE2ID0gbmV3IFVpbnQxNkFycmF5KHRoaXMuYnVmZmVyLCB0aGlzLmJ5dGVPZmZzZXQsIHRoaXMubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICBmbG9hdDE2Yml0cyA9IHVpbnQxNi5zdWJhcnJheSguLi5vcHRzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQxNkFycmF5KGZsb2F0MTZiaXRzLmJ1ZmZlciwgZmxvYXQxNmJpdHMuYnl0ZU9mZnNldCwgZmxvYXQxNmJpdHMubGVuZ3RoKTtcbiAgICB9XG5cbiAgICAvLyBjb250YWlucyBtZXRob2RzXG4gICAgaW5kZXhPZihlbGVtZW50LCAuLi5vcHRzKSB7XG4gICAgICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcblxuICAgICAgICBjb25zdCBsZW5ndGggPSB0aGlzLmxlbmd0aDtcblxuICAgICAgICBsZXQgZnJvbSA9IFRvSW50ZWdlcihvcHRzWzBdKTtcblxuICAgICAgICBpZiAoZnJvbSA8IDApIHtcbiAgICAgICAgICAgIGZyb20gKz0gbGVuZ3RoO1xuICAgICAgICAgICAgaWYgKGZyb20gPCAwKSB7XG4gICAgICAgICAgICAgICAgZnJvbSA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmb3IobGV0IGkgPSBmcm9tLCBsID0gbGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgICAgICAgICBpZiAoY29udmVydFRvTnVtYmVyKHRoaXNbaV0pID09PSBlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgbGFzdEluZGV4T2YoZWxlbWVudCwgLi4ub3B0cykge1xuICAgICAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG5cbiAgICAgICAgY29uc3QgbGVuZ3RoID0gdGhpcy5sZW5ndGg7XG5cbiAgICAgICAgbGV0IGZyb20gPSBUb0ludGVnZXIob3B0c1swXSk7XG5cbiAgICAgICAgZnJvbSA9IGZyb20gPT09IDAgPyBsZW5ndGggOiBmcm9tICsgMTtcblxuICAgICAgICBpZiAoZnJvbSA+PSAwKSB7XG4gICAgICAgICAgICBmcm9tID0gZnJvbSA8IGxlbmd0aCA/IGZyb20gOiBsZW5ndGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmcm9tICs9IGxlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvcihsZXQgaSA9IGZyb207IGktLTspIHtcbiAgICAgICAgICAgIGlmIChjb252ZXJ0VG9OdW1iZXIodGhpc1tpXSkgPT09IGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICBpbmNsdWRlcyhlbGVtZW50LCAuLi5vcHRzKSB7XG4gICAgICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcblxuICAgICAgICBjb25zdCBsZW5ndGggPSB0aGlzLmxlbmd0aDtcblxuICAgICAgICBsZXQgZnJvbSA9IFRvSW50ZWdlcihvcHRzWzBdKTtcblxuICAgICAgICBpZiAoZnJvbSA8IDApIHtcbiAgICAgICAgICAgIGZyb20gKz0gbGVuZ3RoO1xuICAgICAgICAgICAgaWYgKGZyb20gPCAwKSB7XG4gICAgICAgICAgICAgICAgZnJvbSA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBpc05hTiA9IE51bWJlci5pc05hTihlbGVtZW50KTtcbiAgICAgICAgZm9yKGxldCBpID0gZnJvbSwgbCA9IGxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBjb252ZXJ0VG9OdW1iZXIodGhpc1tpXSk7XG5cbiAgICAgICAgICAgIGlmIChpc05hTiAmJiBOdW1iZXIuaXNOYU4odmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gZWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIHN0cmluZyBtZXRob2RzXG4gICAgam9pbiguLi5vcHRzKSB7XG4gICAgICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcblxuICAgICAgICBjb25zdCBhcnJheSA9IGNvcHlUb0FycmF5KHRoaXMpO1xuXG4gICAgICAgIHJldHVybiBhcnJheS5qb2luKC4uLm9wdHMpO1xuICAgIH1cblxuICAgIHRvTG9jYWxlU3RyaW5nKC4uLm9wdHMpIHtcbiAgICAgICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgICAgIGNvbnN0IGFycmF5ID0gY29weVRvQXJyYXkodGhpcyk7XG5cbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICByZXR1cm4gYXJyYXkudG9Mb2NhbGVTdHJpbmcoLi4ub3B0cyk7XG4gICAgfVxuXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGdldCBbU3ltYm9sLnRvU3RyaW5nVGFnXSgpIHtcbiAgICAgICAgaWYgKGlzRmxvYXQxNkFycmF5KHRoaXMpKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJGbG9hdDE2QXJyYXlcIjtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuY29uc3QgRmxvYXQxNkFycmF5JHByb3RvdHlwZSA9IEZsb2F0MTZBcnJheS5wcm90b3R5cGU7XG5cbmNvbnN0IGRlZmF1bHRGbG9hdDE2QXJyYXlNZXRob2RzID0gbmV3IFdlYWtTZXQoKTtcbmZvcihjb25zdCBrZXkgb2YgUmVmbGVjdC5vd25LZXlzKEZsb2F0MTZBcnJheSRwcm90b3R5cGUpKSB7XG4gICAgY29uc3QgdmFsID0gRmxvYXQxNkFycmF5JHByb3RvdHlwZVtrZXldO1xuICAgIGlmICh0eXBlb2YgdmFsID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgZGVmYXVsdEZsb2F0MTZBcnJheU1ldGhvZHMuYWRkKHZhbCk7XG4gICAgfVxufVxuIiwiLyoqXG4gKiBKYXZhU2NyaXB0Q29yZSA8PSAxMiBidWdcbiAqIEBzZWUgaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTE3MTYwNlxuICovXG5leHBvcnQgY29uc3QgaXNUeXBlZEFycmF5SW5kZXhlZFByb3BlcnR5V3JpdGFibGUgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG5ldyBVaW50OEFycmF5KDEpLCAwKS53cml0YWJsZTtcbiIsImltcG9ydCB7IGlzRGF0YVZpZXcgfSBmcm9tIFwiLi9pc1wiO1xuaW1wb3J0IHsgY29udmVydFRvTnVtYmVyLCByb3VuZFRvRmxvYXQxNkJpdHMgfSBmcm9tIFwiLi9saWJcIjtcblxuLyoqXG4gKiByZXR1cm5zIGFuIHVuc2lnbmVkIDE2LWJpdCBmbG9hdCBhdCB0aGUgc3BlY2lmaWVkIGJ5dGUgb2Zmc2V0IGZyb20gdGhlIHN0YXJ0IG9mIHRoZSBEYXRhVmlldy5cbiAqIEBwYXJhbSB7RGF0YVZpZXd9IGRhdGFWaWV3XG4gKiBAcGFyYW0ge251bWJlcn0gYnl0ZU9mZnNldFxuICogQHBhcmFtIHtbYm9vbGVhbl19IG9wdHNcbiAqIEByZXR1cm5zIHtudW1iZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRGbG9hdDE2KGRhdGFWaWV3LCBieXRlT2Zmc2V0LCAuLi5vcHRzKSB7XG4gICAgaWYgKCFpc0RhdGFWaWV3KGRhdGFWaWV3KSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiRmlyc3QgYXJndW1lbnQgdG8gZ2V0RmxvYXQxNiBmdW5jdGlvbiBtdXN0IGJlIGEgRGF0YVZpZXdcIik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbnZlcnRUb051bWJlciggZGF0YVZpZXcuZ2V0VWludDE2KGJ5dGVPZmZzZXQsIC4uLm9wdHMpICk7XG59XG5cbi8qKlxuICogc3RvcmVzIGFuIHVuc2lnbmVkIDE2LWJpdCBmbG9hdCB2YWx1ZSBhdCB0aGUgc3BlY2lmaWVkIGJ5dGUgb2Zmc2V0IGZyb20gdGhlIHN0YXJ0IG9mIHRoZSBEYXRhVmlldy5cbiAqIEBwYXJhbSB7RGF0YVZpZXd9IGRhdGFWaWV3XG4gKiBAcGFyYW0ge251bWJlcn0gYnl0ZU9mZnNldFxuICogQHBhcmFtIHtudW1iZXJ9IHZhbHVlXG4gKiBAcGFyYW0ge1tib29sZWFuXX0gb3B0c1xuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0RmxvYXQxNihkYXRhVmlldywgYnl0ZU9mZnNldCwgdmFsdWUsIC4uLm9wdHMpIHtcbiAgICBpZiAoIWlzRGF0YVZpZXcoZGF0YVZpZXcpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJGaXJzdCBhcmd1bWVudCB0byBzZXRGbG9hdDE2IGZ1bmN0aW9uIG11c3QgYmUgYSBEYXRhVmlld1wiKTtcbiAgICB9XG5cbiAgICBkYXRhVmlldy5zZXRVaW50MTYoYnl0ZU9mZnNldCwgcm91bmRUb0Zsb2F0MTZCaXRzKHZhbHVlKSwgLi4ub3B0cyk7XG59XG4iLCJpbXBvcnQgeyBjb252ZXJ0VG9OdW1iZXIsIHJvdW5kVG9GbG9hdDE2Qml0cyB9IGZyb20gXCIuL2xpYlwiO1xuXG4vKipcbiAqIHJldHVybnMgdGhlIG5lYXJlc3QgaGFsZiBwcmVjaXNpb24gZmxvYXQgcmVwcmVzZW50YXRpb24gb2YgYSBudW1iZXIuXG4gKiBAcGFyYW0ge251bWJlcn0gbnVtXG4gKiBAcmV0dXJucyB7bnVtYmVyfVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBoZnJvdW5kKG51bSkge1xuICAgIG51bSA9IE51bWJlcihudW0pO1xuXG4gICAgLy8gZm9yIG9wdGltaXphdGlvblxuICAgIGlmICghTnVtYmVyLmlzRmluaXRlKG51bSkgfHwgbnVtID09PSAwKSB7XG4gICAgICAgIHJldHVybiBudW07XG4gICAgfVxuXG4gICAgY29uc3QgeDE2ID0gcm91bmRUb0Zsb2F0MTZCaXRzKG51bSk7XG4gICAgcmV0dXJuIGNvbnZlcnRUb051bWJlcih4MTYpO1xufVxuIiwiZXhwb3J0IHsgZGVmYXVsdCBhcyBoZnJvdW5kIH0gZnJvbSBcIi4vaGZyb3VuZFwiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBGbG9hdDE2QXJyYXkgfSBmcm9tIFwiLi9GbG9hdDE2QXJyYXlcIjtcbmV4cG9ydCB7IGdldEZsb2F0MTYsIHNldEZsb2F0MTYgfSBmcm9tIFwiLi9kYXRhVmlldy5qc1wiO1xuIiwiaW1wb3J0IHsgVG9JbnRlZ2VyIH0gZnJvbSBcIi4vc3BlY1wiO1xuXG5leHBvcnQgeyBkZWZhdWx0IGFzIGlzQXJyYXlCdWZmZXIgfSBmcm9tIFwibG9kYXNoLWVzL2lzQXJyYXlCdWZmZXJcIjtcblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHZpZXdcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNEYXRhVmlldyh2aWV3KSB7XG4gICAgcmV0dXJuIHZpZXcgaW5zdGFuY2VvZiBEYXRhVmlldztcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IGtleVxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1N0cmluZ051bWJlcktleShrZXkpIHtcbiAgICByZXR1cm4gdHlwZW9mIGtleSA9PT0gXCJzdHJpbmdcIiAmJiBrZXkgPT09IFRvSW50ZWdlcihrZXkpICsgXCJcIjtcbn1cbiIsIi8vIGFsZ29yaXRobTogZnRwOi8vZnRwLmZveC10b29sa2l0Lm9yZy9wdWIvZmFzdGhhbGZmbG9hdGNvbnZlcnNpb24ucGRmXG5cbmNvbnN0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbmNvbnN0IGZsb2F0VmlldyA9IG5ldyBGbG9hdDMyQXJyYXkoYnVmZmVyKTtcbmNvbnN0IHVpbnQzMlZpZXcgPSBuZXcgVWludDMyQXJyYXkoYnVmZmVyKTtcblxuXG5jb25zdCBiYXNlVGFibGUgPSBuZXcgVWludDMyQXJyYXkoNTEyKTtcbmNvbnN0IHNoaWZ0VGFibGUgPSBuZXcgVWludDMyQXJyYXkoNTEyKTtcblxuZm9yKGxldCBpID0gMDsgaSA8IDI1NjsgKytpKSB7XG4gICAgY29uc3QgZSA9IGkgLSAxMjc7XG5cbiAgICAvLyB2ZXJ5IHNtYWxsIG51bWJlciAoMCwgLTApXG4gICAgaWYgKGUgPCAtMjcpIHtcbiAgICAgICAgYmFzZVRhYmxlW2kgfCAweDAwMF0gPSAweDAwMDA7XG4gICAgICAgIGJhc2VUYWJsZVtpIHwgMHgxMDBdID0gMHg4MDAwO1xuICAgICAgICBzaGlmdFRhYmxlW2kgfCAweDAwMF0gPSAyNDtcbiAgICAgICAgc2hpZnRUYWJsZVtpIHwgMHgxMDBdID0gMjQ7XG5cbiAgICAvLyBzbWFsbCBudW1iZXIgKGRlbm9ybSlcbiAgICB9IGVsc2UgaWYgKGUgPCAtMTQpIHtcbiAgICAgICAgYmFzZVRhYmxlW2kgfCAweDAwMF0gPSAgMHgwNDAwID4+ICgtZSAtIDE0KTtcbiAgICAgICAgYmFzZVRhYmxlW2kgfCAweDEwMF0gPSAoMHgwNDAwID4+ICgtZSAtIDE0KSkgfCAweDgwMDA7XG4gICAgICAgIHNoaWZ0VGFibGVbaSB8IDB4MDAwXSA9IC1lIC0gMTtcbiAgICAgICAgc2hpZnRUYWJsZVtpIHwgMHgxMDBdID0gLWUgLSAxO1xuXG4gICAgLy8gbm9ybWFsIG51bWJlclxuICAgIH0gZWxzZSBpZiAoZSA8PSAxNSkge1xuICAgICAgICBiYXNlVGFibGVbaSB8IDB4MDAwXSA9ICAoZSArIDE1KSA8PCAxMDtcbiAgICAgICAgYmFzZVRhYmxlW2kgfCAweDEwMF0gPSAoKGUgKyAxNSkgPDwgMTApIHwgMHg4MDAwO1xuICAgICAgICBzaGlmdFRhYmxlW2kgfCAweDAwMF0gPSAxMztcbiAgICAgICAgc2hpZnRUYWJsZVtpIHwgMHgxMDBdID0gMTM7XG5cbiAgICAvLyBsYXJnZSBudW1iZXIgKEluZmluaXR5LCAtSW5maW5pdHkpXG4gICAgfSBlbHNlIGlmIChlIDwgMTI4KSB7XG4gICAgICAgIGJhc2VUYWJsZVtpIHwgMHgwMDBdID0gMHg3YzAwO1xuICAgICAgICBiYXNlVGFibGVbaSB8IDB4MTAwXSA9IDB4ZmMwMDtcbiAgICAgICAgc2hpZnRUYWJsZVtpIHwgMHgwMDBdID0gMjQ7XG4gICAgICAgIHNoaWZ0VGFibGVbaSB8IDB4MTAwXSA9IDI0O1xuXG4gICAgLy8gc3RheSAoTmFOLCBJbmZpbml0eSwgLUluZmluaXR5KVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGJhc2VUYWJsZVtpIHwgMHgwMDBdID0gMHg3YzAwO1xuICAgICAgICBiYXNlVGFibGVbaSB8IDB4MTAwXSA9IDB4ZmMwMDtcbiAgICAgICAgc2hpZnRUYWJsZVtpIHwgMHgwMDBdID0gMTM7XG4gICAgICAgIHNoaWZ0VGFibGVbaSB8IDB4MTAwXSA9IDEzO1xuICAgIH1cbn1cblxuLyoqXG4gKiByb3VuZCBhIG51bWJlciB0byBhIGhhbGYgZmxvYXQgbnVtYmVyIGJpdHMuXG4gKiBAcGFyYW0ge251bWJlcn0gbnVtIC0gZG91YmxlIGZsb2F0XG4gKiBAcmV0dXJucyB7bnVtYmVyfSBoYWxmIGZsb2F0IG51bWJlciBiaXRzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByb3VuZFRvRmxvYXQxNkJpdHMobnVtKSB7XG4gICAgZmxvYXRWaWV3WzBdID0gbnVtO1xuXG4gICAgY29uc3QgZiA9IHVpbnQzMlZpZXdbMF07XG4gICAgY29uc3QgZSA9IChmID4+IDIzKSAmIDB4MWZmO1xuICAgIHJldHVybiBiYXNlVGFibGVbZV0gKyAoKGYgJiAweDAwN2ZmZmZmKSA+PiBzaGlmdFRhYmxlW2VdKTtcbn1cblxuXG5jb25zdCBtYW50aXNzYVRhYmxlID0gbmV3IFVpbnQzMkFycmF5KDIwNDgpO1xuY29uc3QgZXhwb25lbnRUYWJsZSA9IG5ldyBVaW50MzJBcnJheSg2NCk7XG5jb25zdCBvZmZzZXRUYWJsZSA9IG5ldyBVaW50MzJBcnJheSg2NCk7XG5cbm1hbnRpc3NhVGFibGVbMF0gPSAwO1xuZm9yKGxldCBpID0gMTsgaSA8IDEwMjQ7ICsraSkge1xuICAgIGxldCBtID0gaSA8PCAxMzsgICAgLy8gemVybyBwYWQgbWFudGlzc2EgYml0c1xuICAgIGxldCBlID0gMDsgICAgICAgICAgLy8gemVybyBleHBvbmVudFxuXG4gICAgLy8gbm9ybWFsaXplZFxuICAgIHdoaWxlKChtICYgMHgwMDgwMDAwMCkgPT09IDApIHtcbiAgICAgICAgZSAtPSAweDAwODAwMDAwOyAgICAvLyBkZWNyZW1lbnQgZXhwb25lbnRcbiAgICAgICAgbSA8PD0gMTtcbiAgICB9XG5cbiAgICBtICY9IH4weDAwODAwMDAwOyAgIC8vIGNsZWFyIGxlYWRpbmcgMSBiaXRcbiAgICBlICs9IDB4Mzg4MDAwMDA7ICAgIC8vIGFkanVzdCBiaWFzXG5cbiAgICBtYW50aXNzYVRhYmxlW2ldID0gbSB8IGU7XG59XG5mb3IobGV0IGkgPSAxMDI0OyBpIDwgMjA0ODsgKytpKSB7XG4gICAgbWFudGlzc2FUYWJsZVtpXSA9IDB4MzgwMDAwMDAgKyAoKGkgLSAxMDI0KSA8PCAxMyk7XG59XG5cbmV4cG9uZW50VGFibGVbMF0gPSAwO1xuZm9yKGxldCBpID0gMTsgaSA8IDMxOyArK2kpIHtcbiAgICBleHBvbmVudFRhYmxlW2ldID0gaSA8PCAyMztcbn1cbmV4cG9uZW50VGFibGVbMzFdID0gMHg0NzgwMDAwMDtcbmV4cG9uZW50VGFibGVbMzJdID0gMHg4MDAwMDAwMDtcbmZvcihsZXQgaSA9IDMzOyBpIDwgNjM7ICsraSkge1xuICAgIGV4cG9uZW50VGFibGVbaV0gPSAweDgwMDAwMDAwICsgKChpIC0gMzIpIDw8IDIzKTtcbn1cbmV4cG9uZW50VGFibGVbNjNdID0gMHhjNzgwMDAwMDtcblxub2Zmc2V0VGFibGVbMF0gPSAwO1xuZm9yKGxldCBpID0gMTsgaSA8IDY0OyArK2kpIHtcbiAgICBpZiAoaSA9PT0gMzIpIHtcbiAgICAgICAgb2Zmc2V0VGFibGVbaV0gPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIG9mZnNldFRhYmxlW2ldID0gMTAyNDtcbiAgICB9XG59XG5cbi8qKlxuICogY29udmVydCBhIGhhbGYgZmxvYXQgbnVtYmVyIGJpdHMgdG8gYSBudW1iZXIuXG4gKiBAcGFyYW0ge251bWJlcn0gZmxvYXQxNmJpdHMgLSBoYWxmIGZsb2F0IG51bWJlciBiaXRzXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBkb3VibGUgZmxvYXRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRUb051bWJlcihmbG9hdDE2Yml0cykge1xuICAgIGNvbnN0IG0gPSBmbG9hdDE2Yml0cyA+PiAxMDtcbiAgICB1aW50MzJWaWV3WzBdID0gbWFudGlzc2FUYWJsZVtvZmZzZXRUYWJsZVttXSArIChmbG9hdDE2Yml0cyAmIDB4M2ZmKV0gKyBleHBvbmVudFRhYmxlW21dO1xuICAgIHJldHVybiBmbG9hdFZpZXdbMF07XG59XG4iLCIvKipcbiAqIEByZXR1cm5zIHsoc2VsZjpvYmplY3QpID0+IG9iamVjdH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVByaXZhdGVTdG9yYWdlKCkge1xuXHRjb25zdCB3bSA9IG5ldyBXZWFrTWFwKCk7XG5cdHJldHVybiAoc2VsZikgPT4ge1xuXHRcdGxldCBvYmogPSB3bS5nZXQoc2VsZik7XG5cdFx0aWYgKG9iaikge1xuXHRcdFx0cmV0dXJuIG9iajtcblx0XHR9IGVsc2Uge1xuXHRcdFx0b2JqID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblx0XHRcdHdtLnNldChzZWxmLCBvYmopO1xuXHRcdFx0cmV0dXJuIG9iajtcblx0XHR9XG5cdH07XG59XG4iLCIvKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdGFyZ2V0XG4gKiBAcmV0dXJucyB7bnVtYmVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gVG9JbnRlZ2VyKHRhcmdldCkge1xuICAgIGxldCBudW1iZXIgPSB0eXBlb2YgdGFyZ2V0ICE9PSBcIm51bWJlclwiID8gTnVtYmVyKHRhcmdldCkgOiB0YXJnZXQ7XG4gICAgaWYgKE51bWJlci5pc05hTihudW1iZXIpKSB7XG4gICAgICAgIG51bWJlciA9IDA7XG4gICAgfVxuICAgIHJldHVybiBNYXRoLnRydW5jKG51bWJlcik7XG59XG5cbi8qKlxuICogQHBhcmFtIHtudW1iZXJ9IHhcbiAqIEBwYXJhbSB7bnVtYmVyfSB5XG4gKiBAcmV0dXJucyB7LTEgfCAwIHwgMX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlZmF1bHRDb21wYXJlRnVuY3Rpb24oeCwgeSkge1xuICAgIGNvbnN0IFtpc05hTl94LCBpc05hTl95XSA9IFtOdW1iZXIuaXNOYU4oeCksIE51bWJlci5pc05hTih5KV07XG5cbiAgICBpZiAoaXNOYU5feCAmJiBpc05hTl95KSB7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIGlmIChpc05hTl94KSB7XG4gICAgICAgIHJldHVybiAxO1xuICAgIH1cblxuICAgIGlmIChpc05hTl95KSB7XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICBpZiAoeCA8IHkpIHtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIGlmICh4ID4geSkge1xuICAgICAgICByZXR1cm4gMTtcbiAgICB9XG5cbiAgICBpZiAoeCA9PT0gMCAmJiB5ID09PSAwKSB7XG4gICAgICAgIGNvbnN0IFtpc1BsdXNaZXJvX3gsIGlzUGx1c1plcm9feV0gPSBbT2JqZWN0LmlzKHgsIDApLCBPYmplY3QuaXMoeSwgMCldO1xuXG4gICAgICAgIGlmICghaXNQbHVzWmVyb194ICYmIGlzUGx1c1plcm9feSkge1xuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzUGx1c1plcm9feCAmJiAhaXNQbHVzWmVyb195KSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAwO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5jaGFuZ2VEcGlCbG9iID0gY2hhbmdlRHBpQmxvYjtcbmV4cG9ydHMuY2hhbmdlRHBpRGF0YVVybCA9IGNoYW5nZURwaURhdGFVcmw7XG5cbmZ1bmN0aW9uIF90b0NvbnN1bWFibGVBcnJheShhcnIpIHsgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgeyBmb3IgKHZhciBpID0gMCwgYXJyMiA9IEFycmF5KGFyci5sZW5ndGgpOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7IGFycjJbaV0gPSBhcnJbaV07IH0gcmV0dXJuIGFycjI7IH0gZWxzZSB7IHJldHVybiBBcnJheS5mcm9tKGFycik7IH0gfVxuXG5mdW5jdGlvbiBjcmVhdGVQbmdEYXRhVGFibGUoKSB7XG4gIC8qIFRhYmxlIG9mIENSQ3Mgb2YgYWxsIDgtYml0IG1lc3NhZ2VzLiAqL1xuICB2YXIgY3JjVGFibGUgPSBuZXcgSW50MzJBcnJheSgyNTYpO1xuICBmb3IgKHZhciBuID0gMDsgbiA8IDI1NjsgbisrKSB7XG4gICAgdmFyIGMgPSBuO1xuICAgIGZvciAodmFyIGsgPSAwOyBrIDwgODsgaysrKSB7XG4gICAgICBjID0gYyAmIDEgPyAweGVkYjg4MzIwIF4gYyA+Pj4gMSA6IGMgPj4+IDE7XG4gICAgfVxuICAgIGNyY1RhYmxlW25dID0gYztcbiAgfVxuICByZXR1cm4gY3JjVGFibGU7XG59XG5cbmZ1bmN0aW9uIGNhbGNDcmMoYnVmKSB7XG4gIHZhciBjID0gLTE7XG4gIGlmICghcG5nRGF0YVRhYmxlKSBwbmdEYXRhVGFibGUgPSBjcmVhdGVQbmdEYXRhVGFibGUoKTtcbiAgZm9yICh2YXIgbiA9IDA7IG4gPCBidWYubGVuZ3RoOyBuKyspIHtcbiAgICBjID0gcG5nRGF0YVRhYmxlWyhjIF4gYnVmW25dKSAmIDB4RkZdIF4gYyA+Pj4gODtcbiAgfVxuICByZXR1cm4gYyBeIC0xO1xufVxuXG52YXIgcG5nRGF0YVRhYmxlID0gdm9pZCAwO1xuXG52YXIgUE5HID0gJ2ltYWdlL3BuZyc7XG52YXIgSlBFRyA9ICdpbWFnZS9qcGVnJztcblxuLy8gdGhvc2UgYXJlIDMgcG9zc2libGUgc2lnbmF0dXJlIG9mIHRoZSBwaHlzQmxvY2sgaW4gYmFzZTY0LlxuLy8gdGhlIHBIWXMgc2lnbmF0dXJlIGJsb2NrIGlzIHByZWNlZWQgYnkgdGhlIDQgYnl0ZXMgb2YgbGVuZ2h0LiBUaGUgbGVuZ3RoIG9mXG4vLyB0aGUgYmxvY2sgaXMgYWx3YXlzIDkgYnl0ZXMuIFNvIGEgcGh5cyBibG9jayBoYXMgYWx3YXlzIHRoaXMgc2lnbmF0dXJlOlxuLy8gMCAwIDAgOSBwIEggWSBzLlxuLy8gSG93ZXZlciB0aGUgZGF0YTY0IGVuY29kaW5nIGFsaWducyB3ZSB3aWxsIGFsd2F5cyBmaW5kIG9uZSBvZiB0aG9zZSAzIHN0cmluZ3MuXG4vLyB0aGlzIGFsbG93IHVzIHRvIGZpbmQgdGhpcyBwYXJ0aWN1bGFyIG9jY3VyZW5jZSBvZiB0aGUgcEhZcyBibG9jayB3aXRob3V0XG4vLyBjb252ZXJ0aW5nIGZyb20gYjY0IGJhY2sgdG8gc3RyaW5nXG52YXIgYjY0UGh5c1NpZ25hdHVyZTEgPSAnQUFsd1NGbHonO1xudmFyIGI2NFBoeXNTaWduYXR1cmUyID0gJ0FBQUpjRWhaJztcbnZhciBiNjRQaHlzU2lnbmF0dXJlMyA9ICdBQUFBQ1hCSSc7XG5cbnZhciBfUCA9ICdwJy5jaGFyQ29kZUF0KDApO1xudmFyIF9IID0gJ0gnLmNoYXJDb2RlQXQoMCk7XG52YXIgX1kgPSAnWScuY2hhckNvZGVBdCgwKTtcbnZhciBfUyA9ICdzJy5jaGFyQ29kZUF0KDApO1xuXG5mdW5jdGlvbiBjaGFuZ2VEcGlCbG9iKGJsb2IsIGRwaSkge1xuICAvLyAzMyBieXRlcyBhcmUgb2sgZm9yIHBuZ3MgYW5kIGpwZWdzXG4gIC8vIHRvIGNvbnRhaW4gdGhlIGluZm9ybWF0aW9uLlxuICB2YXIgaGVhZGVyQ2h1bmsgPSBibG9iLnNsaWNlKDAsIDMzKTtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICB2YXIgZmlsZVJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgZmlsZVJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgZGF0YUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoZmlsZVJlYWRlci5yZXN1bHQpO1xuICAgICAgdmFyIHRhaWwgPSBibG9iLnNsaWNlKDMzKTtcbiAgICAgIHZhciBjaGFuZ2VkQXJyYXkgPSBjaGFuZ2VEcGlPbkFycmF5KGRhdGFBcnJheSwgZHBpLCBibG9iLnR5cGUpO1xuICAgICAgcmVzb2x2ZShuZXcgQmxvYihbY2hhbmdlZEFycmF5LCB0YWlsXSwgeyB0eXBlOiBibG9iLnR5cGUgfSkpO1xuICAgIH07XG4gICAgZmlsZVJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihoZWFkZXJDaHVuayk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBjaGFuZ2VEcGlEYXRhVXJsKGJhc2U2NEltYWdlLCBkcGkpIHtcbiAgdmFyIGRhdGFTcGxpdHRlZCA9IGJhc2U2NEltYWdlLnNwbGl0KCcsJyk7XG4gIHZhciBmb3JtYXQgPSBkYXRhU3BsaXR0ZWRbMF07XG4gIHZhciBib2R5ID0gZGF0YVNwbGl0dGVkWzFdO1xuICB2YXIgdHlwZSA9IHZvaWQgMDtcbiAgdmFyIGhlYWRlckxlbmd0aCA9IHZvaWQgMDtcbiAgdmFyIG92ZXJ3cml0ZXBIWXMgPSBmYWxzZTtcbiAgaWYgKGZvcm1hdC5pbmRleE9mKFBORykgIT09IC0xKSB7XG4gICAgdHlwZSA9IFBORztcbiAgICB2YXIgYjY0SW5kZXggPSBkZXRlY3RQaHlzQ2h1bmtGcm9tRGF0YVVybChib2R5KTtcbiAgICAvLyAyOCBieXRlcyBpbiBkYXRhVXJsIGFyZSAyMWJ5dGVzLCBsZW5ndGggb2YgcGh5cyBjaHVuayB3aXRoIGV2ZXJ5dGhpbmcgaW5zaWRlLlxuICAgIGlmIChiNjRJbmRleCA+PSAwKSB7XG4gICAgICBoZWFkZXJMZW5ndGggPSBNYXRoLmNlaWwoKGI2NEluZGV4ICsgMjgpIC8gMykgKiA0O1xuICAgICAgb3ZlcndyaXRlcEhZcyA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhlYWRlckxlbmd0aCA9IDMzIC8gMyAqIDQ7XG4gICAgfVxuICB9XG4gIGlmIChmb3JtYXQuaW5kZXhPZihKUEVHKSAhPT0gLTEpIHtcbiAgICB0eXBlID0gSlBFRztcbiAgICBoZWFkZXJMZW5ndGggPSAxOCAvIDMgKiA0O1xuICB9XG4gIC8vIDMzIGJ5dGVzIGFyZSBvayBmb3IgcG5ncyBhbmQganBlZ3NcbiAgLy8gdG8gY29udGFpbiB0aGUgaW5mb3JtYXRpb24uXG4gIHZhciBzdHJpbmdIZWFkZXIgPSBib2R5LnN1YnN0cmluZygwLCBoZWFkZXJMZW5ndGgpO1xuICB2YXIgcmVzdE9mRGF0YSA9IGJvZHkuc3Vic3RyaW5nKGhlYWRlckxlbmd0aCk7XG4gIHZhciBoZWFkZXJCeXRlcyA9IGF0b2Ioc3RyaW5nSGVhZGVyKTtcbiAgdmFyIGRhdGFBcnJheSA9IG5ldyBVaW50OEFycmF5KGhlYWRlckJ5dGVzLmxlbmd0aCk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YUFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgZGF0YUFycmF5W2ldID0gaGVhZGVyQnl0ZXMuY2hhckNvZGVBdChpKTtcbiAgfVxuICB2YXIgZmluYWxBcnJheSA9IGNoYW5nZURwaU9uQXJyYXkoZGF0YUFycmF5LCBkcGksIHR5cGUsIG92ZXJ3cml0ZXBIWXMpO1xuICB2YXIgYmFzZTY0SGVhZGVyID0gYnRvYShTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFN0cmluZywgX3RvQ29uc3VtYWJsZUFycmF5KGZpbmFsQXJyYXkpKSk7XG4gIHJldHVybiBbZm9ybWF0LCAnLCcsIGJhc2U2NEhlYWRlciwgcmVzdE9mRGF0YV0uam9pbignJyk7XG59XG5cbmZ1bmN0aW9uIGRldGVjdFBoeXNDaHVua0Zyb21EYXRhVXJsKGRhdGEpIHtcbiAgdmFyIGI2NGluZGV4ID0gZGF0YS5pbmRleE9mKGI2NFBoeXNTaWduYXR1cmUxKTtcbiAgaWYgKGI2NGluZGV4ID09PSAtMSkge1xuICAgIGI2NGluZGV4ID0gZGF0YS5pbmRleE9mKGI2NFBoeXNTaWduYXR1cmUyKTtcbiAgfVxuICBpZiAoYjY0aW5kZXggPT09IC0xKSB7XG4gICAgYjY0aW5kZXggPSBkYXRhLmluZGV4T2YoYjY0UGh5c1NpZ25hdHVyZTMpO1xuICB9XG4gIC8vIGlmIGI2NGluZGV4ID09PSAtMSBjaHVuayBpcyBub3QgZm91bmRcbiAgcmV0dXJuIGI2NGluZGV4O1xufVxuXG5mdW5jdGlvbiBzZWFyY2hTdGFydE9mUGh5cyhkYXRhKSB7XG4gIHZhciBsZW5ndGggPSBkYXRhLmxlbmd0aCAtIDE7XG4gIC8vIHdlIGNoZWNrIGZyb20gdGhlIGVuZCBzaW5jZSB3ZSBjdXQgdGhlIHN0cmluZyBpbiBwcm94aW1pdHkgb2YgdGhlIGhlYWRlclxuICAvLyB0aGUgaGVhZGVyIGlzIHdpdGhpbiAyMSBieXRlcyBmcm9tIHRoZSBlbmQuXG4gIGZvciAodmFyIGkgPSBsZW5ndGg7IGkgPj0gNDsgaS0tKSB7XG4gICAgaWYgKGRhdGFbaSAtIDRdID09PSA5ICYmIGRhdGFbaSAtIDNdID09PSBfUCAmJiBkYXRhW2kgLSAyXSA9PT0gX0ggJiYgZGF0YVtpIC0gMV0gPT09IF9ZICYmIGRhdGFbaV0gPT09IF9TKSB7XG4gICAgICByZXR1cm4gaSAtIDM7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGNoYW5nZURwaU9uQXJyYXkoZGF0YUFycmF5LCBkcGksIGZvcm1hdCwgb3ZlcndyaXRlcEhZcykge1xuICBpZiAoZm9ybWF0ID09PSBKUEVHKSB7XG4gICAgZGF0YUFycmF5WzEzXSA9IDE7IC8vIDEgcGl4ZWwgcGVyIGluY2ggb3IgMiBwaXhlbCBwZXIgY21cbiAgICBkYXRhQXJyYXlbMTRdID0gZHBpID4+IDg7IC8vIGRwaVggaGlnaCBieXRlXG4gICAgZGF0YUFycmF5WzE1XSA9IGRwaSAmIDB4ZmY7IC8vIGRwaVggbG93IGJ5dGVcbiAgICBkYXRhQXJyYXlbMTZdID0gZHBpID4+IDg7IC8vIGRwaVkgaGlnaCBieXRlXG4gICAgZGF0YUFycmF5WzE3XSA9IGRwaSAmIDB4ZmY7IC8vIGRwaVkgbG93IGJ5dGVcbiAgICByZXR1cm4gZGF0YUFycmF5O1xuICB9XG4gIGlmIChmb3JtYXQgPT09IFBORykge1xuICAgIHZhciBwaHlzQ2h1bmsgPSBuZXcgVWludDhBcnJheSgxMyk7XG4gICAgLy8gY2h1bmsgaGVhZGVyIHBIWXNcbiAgICAvLyA5IGJ5dGVzIG9mIGRhdGFcbiAgICAvLyA0IGJ5dGVzIG9mIGNyY1xuICAgIC8vIHRoaXMgbXVsdGlwbGljYXRpb24gaXMgYmVjYXVzZSB0aGUgc3RhbmRhcmQgaXMgZHBpIHBlciBtZXRlci5cbiAgICBkcGkgKj0gMzkuMzcwMTtcbiAgICBwaHlzQ2h1bmtbMF0gPSBfUDtcbiAgICBwaHlzQ2h1bmtbMV0gPSBfSDtcbiAgICBwaHlzQ2h1bmtbMl0gPSBfWTtcbiAgICBwaHlzQ2h1bmtbM10gPSBfUztcbiAgICBwaHlzQ2h1bmtbNF0gPSBkcGkgPj4+IDI0OyAvLyBkcGlYIGhpZ2hlc3QgYnl0ZVxuICAgIHBoeXNDaHVua1s1XSA9IGRwaSA+Pj4gMTY7IC8vIGRwaVggdmVyeWhpZ2ggYnl0ZVxuICAgIHBoeXNDaHVua1s2XSA9IGRwaSA+Pj4gODsgLy8gZHBpWCBoaWdoIGJ5dGVcbiAgICBwaHlzQ2h1bmtbN10gPSBkcGkgJiAweGZmOyAvLyBkcGlYIGxvdyBieXRlXG4gICAgcGh5c0NodW5rWzhdID0gcGh5c0NodW5rWzRdOyAvLyBkcGlZIGhpZ2hlc3QgYnl0ZVxuICAgIHBoeXNDaHVua1s5XSA9IHBoeXNDaHVua1s1XTsgLy8gZHBpWSB2ZXJ5aGlnaCBieXRlXG4gICAgcGh5c0NodW5rWzEwXSA9IHBoeXNDaHVua1s2XTsgLy8gZHBpWSBoaWdoIGJ5dGVcbiAgICBwaHlzQ2h1bmtbMTFdID0gcGh5c0NodW5rWzddOyAvLyBkcGlZIGxvdyBieXRlXG4gICAgcGh5c0NodW5rWzEyXSA9IDE7IC8vIGRvdCBwZXIgbWV0ZXIuLi4uXG5cbiAgICB2YXIgY3JjID0gY2FsY0NyYyhwaHlzQ2h1bmspO1xuXG4gICAgdmFyIGNyY0NodW5rID0gbmV3IFVpbnQ4QXJyYXkoNCk7XG4gICAgY3JjQ2h1bmtbMF0gPSBjcmMgPj4+IDI0O1xuICAgIGNyY0NodW5rWzFdID0gY3JjID4+PiAxNjtcbiAgICBjcmNDaHVua1syXSA9IGNyYyA+Pj4gODtcbiAgICBjcmNDaHVua1szXSA9IGNyYyAmIDB4ZmY7XG5cbiAgICBpZiAob3ZlcndyaXRlcEhZcykge1xuICAgICAgdmFyIHN0YXJ0aW5nSW5kZXggPSBzZWFyY2hTdGFydE9mUGh5cyhkYXRhQXJyYXkpO1xuICAgICAgZGF0YUFycmF5LnNldChwaHlzQ2h1bmssIHN0YXJ0aW5nSW5kZXgpO1xuICAgICAgZGF0YUFycmF5LnNldChjcmNDaHVuaywgc3RhcnRpbmdJbmRleCArIDEzKTtcbiAgICAgIHJldHVybiBkYXRhQXJyYXk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGkgbmVlZCB0byBnaXZlIGJhY2sgYW4gYXJyYXkgb2YgZGF0YSB0aGF0IGlzIGRpdmlzaWJsZSBieSAzIHNvIHRoYXRcbiAgICAgIC8vIGRhdGF1cmwgZW5jb2RpbmcgZ2l2ZXMgbWUgaW50ZWdlcnMsIGZvciBsdWNrIHRoaXMgY2h1bmsgaXMgMTcgKyA0ID0gMjFcbiAgICAgIC8vIGlmIGl0IHdhcyB3ZSBjb3VsZCBhZGQgYSB0ZXh0IGNodW5rIGNvbnRhbmluZyBzb21lIGluZm8sIHVudGlsbCBkZXNpcmVkXG4gICAgICAvLyBsZW5ndGggaXMgbWV0LlxuXG4gICAgICAvLyBjaHVuayBzdHJ1Y3R1ciA0IGJ5dGVzIGZvciBsZW5ndGggaXMgOVxuICAgICAgdmFyIGNodW5rTGVuZ3RoID0gbmV3IFVpbnQ4QXJyYXkoNCk7XG4gICAgICBjaHVua0xlbmd0aFswXSA9IDA7XG4gICAgICBjaHVua0xlbmd0aFsxXSA9IDA7XG4gICAgICBjaHVua0xlbmd0aFsyXSA9IDA7XG4gICAgICBjaHVua0xlbmd0aFszXSA9IDk7XG5cbiAgICAgIHZhciBmaW5hbEhlYWRlciA9IG5ldyBVaW50OEFycmF5KDU0KTtcbiAgICAgIGZpbmFsSGVhZGVyLnNldChkYXRhQXJyYXksIDApO1xuICAgICAgZmluYWxIZWFkZXIuc2V0KGNodW5rTGVuZ3RoLCAzMyk7XG4gICAgICBmaW5hbEhlYWRlci5zZXQocGh5c0NodW5rLCAzNyk7XG4gICAgICBmaW5hbEhlYWRlci5zZXQoY3JjQ2h1bmssIDUwKTtcbiAgICAgIHJldHVybiBmaW5hbEhlYWRlcjtcbiAgICB9XG4gIH1cbn0iLCIoZnVuY3Rpb24oYSxiKXtpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQpZGVmaW5lKFtdLGIpO2Vsc2UgaWYoXCJ1bmRlZmluZWRcIiE9dHlwZW9mIGV4cG9ydHMpYigpO2Vsc2V7YigpLGEuRmlsZVNhdmVyPXtleHBvcnRzOnt9fS5leHBvcnRzfX0pKHRoaXMsZnVuY3Rpb24oKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBiKGEsYil7cmV0dXJuXCJ1bmRlZmluZWRcIj09dHlwZW9mIGI/Yj17YXV0b0JvbTohMX06XCJvYmplY3RcIiE9dHlwZW9mIGImJihjb25zb2xlLndhcm4oXCJEZXByZWNhdGVkOiBFeHBlY3RlZCB0aGlyZCBhcmd1bWVudCB0byBiZSBhIG9iamVjdFwiKSxiPXthdXRvQm9tOiFifSksYi5hdXRvQm9tJiYvXlxccyooPzp0ZXh0XFwvXFxTKnxhcHBsaWNhdGlvblxcL3htbHxcXFMqXFwvXFxTKlxcK3htbClcXHMqOy4qY2hhcnNldFxccyo9XFxzKnV0Zi04L2kudGVzdChhLnR5cGUpP25ldyBCbG9iKFtcIlxcdUZFRkZcIixhXSx7dHlwZTphLnR5cGV9KTphfWZ1bmN0aW9uIGMoYSxiLGMpe3ZhciBkPW5ldyBYTUxIdHRwUmVxdWVzdDtkLm9wZW4oXCJHRVRcIixhKSxkLnJlc3BvbnNlVHlwZT1cImJsb2JcIixkLm9ubG9hZD1mdW5jdGlvbigpe2coZC5yZXNwb25zZSxiLGMpfSxkLm9uZXJyb3I9ZnVuY3Rpb24oKXtjb25zb2xlLmVycm9yKFwiY291bGQgbm90IGRvd25sb2FkIGZpbGVcIil9LGQuc2VuZCgpfWZ1bmN0aW9uIGQoYSl7dmFyIGI9bmV3IFhNTEh0dHBSZXF1ZXN0O2Iub3BlbihcIkhFQURcIixhLCExKTt0cnl7Yi5zZW5kKCl9Y2F0Y2goYSl7fXJldHVybiAyMDA8PWIuc3RhdHVzJiYyOTk+PWIuc3RhdHVzfWZ1bmN0aW9uIGUoYSl7dHJ5e2EuZGlzcGF0Y2hFdmVudChuZXcgTW91c2VFdmVudChcImNsaWNrXCIpKX1jYXRjaChjKXt2YXIgYj1kb2N1bWVudC5jcmVhdGVFdmVudChcIk1vdXNlRXZlbnRzXCIpO2IuaW5pdE1vdXNlRXZlbnQoXCJjbGlja1wiLCEwLCEwLHdpbmRvdywwLDAsMCw4MCwyMCwhMSwhMSwhMSwhMSwwLG51bGwpLGEuZGlzcGF0Y2hFdmVudChiKX19dmFyIGY9XCJvYmplY3RcIj09dHlwZW9mIHdpbmRvdyYmd2luZG93LndpbmRvdz09PXdpbmRvdz93aW5kb3c6XCJvYmplY3RcIj09dHlwZW9mIHNlbGYmJnNlbGYuc2VsZj09PXNlbGY/c2VsZjpcIm9iamVjdFwiPT10eXBlb2YgZ2xvYmFsJiZnbG9iYWwuZ2xvYmFsPT09Z2xvYmFsP2dsb2JhbDp2b2lkIDAsYT1mLm5hdmlnYXRvciYmL01hY2ludG9zaC8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSYmL0FwcGxlV2ViS2l0Ly50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpJiYhL1NhZmFyaS8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSxnPWYuc2F2ZUFzfHwoXCJvYmplY3RcIiE9dHlwZW9mIHdpbmRvd3x8d2luZG93IT09Zj9mdW5jdGlvbigpe306XCJkb3dubG9hZFwiaW4gSFRNTEFuY2hvckVsZW1lbnQucHJvdG90eXBlJiYhYT9mdW5jdGlvbihiLGcsaCl7dmFyIGk9Zi5VUkx8fGYud2Via2l0VVJMLGo9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7Zz1nfHxiLm5hbWV8fFwiZG93bmxvYWRcIixqLmRvd25sb2FkPWcsai5yZWw9XCJub29wZW5lclwiLFwic3RyaW5nXCI9PXR5cGVvZiBiPyhqLmhyZWY9YixqLm9yaWdpbj09PWxvY2F0aW9uLm9yaWdpbj9lKGopOmQoai5ocmVmKT9jKGIsZyxoKTplKGosai50YXJnZXQ9XCJfYmxhbmtcIikpOihqLmhyZWY9aS5jcmVhdGVPYmplY3RVUkwoYiksc2V0VGltZW91dChmdW5jdGlvbigpe2kucmV2b2tlT2JqZWN0VVJMKGouaHJlZil9LDRFNCksc2V0VGltZW91dChmdW5jdGlvbigpe2Uoail9LDApKX06XCJtc1NhdmVPck9wZW5CbG9iXCJpbiBuYXZpZ2F0b3I/ZnVuY3Rpb24oZixnLGgpe2lmKGc9Z3x8Zi5uYW1lfHxcImRvd25sb2FkXCIsXCJzdHJpbmdcIiE9dHlwZW9mIGYpbmF2aWdhdG9yLm1zU2F2ZU9yT3BlbkJsb2IoYihmLGgpLGcpO2Vsc2UgaWYoZChmKSljKGYsZyxoKTtlbHNle3ZhciBpPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO2kuaHJlZj1mLGkudGFyZ2V0PVwiX2JsYW5rXCIsc2V0VGltZW91dChmdW5jdGlvbigpe2UoaSl9KX19OmZ1bmN0aW9uKGIsZCxlLGcpe2lmKGc9Z3x8b3BlbihcIlwiLFwiX2JsYW5rXCIpLGcmJihnLmRvY3VtZW50LnRpdGxlPWcuZG9jdW1lbnQuYm9keS5pbm5lclRleHQ9XCJkb3dubG9hZGluZy4uLlwiKSxcInN0cmluZ1wiPT10eXBlb2YgYilyZXR1cm4gYyhiLGQsZSk7dmFyIGg9XCJhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW1cIj09PWIudHlwZSxpPS9jb25zdHJ1Y3Rvci9pLnRlc3QoZi5IVE1MRWxlbWVudCl8fGYuc2FmYXJpLGo9L0NyaU9TXFwvW1xcZF0rLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO2lmKChqfHxoJiZpfHxhKSYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIEZpbGVSZWFkZXIpe3ZhciBrPW5ldyBGaWxlUmVhZGVyO2sub25sb2FkZW5kPWZ1bmN0aW9uKCl7dmFyIGE9ay5yZXN1bHQ7YT1qP2E6YS5yZXBsYWNlKC9eZGF0YTpbXjtdKjsvLFwiZGF0YTphdHRhY2htZW50L2ZpbGU7XCIpLGc/Zy5sb2NhdGlvbi5ocmVmPWE6bG9jYXRpb249YSxnPW51bGx9LGsucmVhZEFzRGF0YVVSTChiKX1lbHNle3ZhciBsPWYuVVJMfHxmLndlYmtpdFVSTCxtPWwuY3JlYXRlT2JqZWN0VVJMKGIpO2c/Zy5sb2NhdGlvbj1tOmxvY2F0aW9uLmhyZWY9bSxnPW51bGwsc2V0VGltZW91dChmdW5jdGlvbigpe2wucmV2b2tlT2JqZWN0VVJMKG0pfSw0RTQpfX0pO2Yuc2F2ZUFzPWcuc2F2ZUFzPWcsXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZSYmKG1vZHVsZS5leHBvcnRzPWcpfSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUZpbGVTYXZlci5taW4uanMubWFwIiwiaW1wb3J0IGhhc2hDbGVhciBmcm9tICcuL19oYXNoQ2xlYXIuanMnO1xuaW1wb3J0IGhhc2hEZWxldGUgZnJvbSAnLi9faGFzaERlbGV0ZS5qcyc7XG5pbXBvcnQgaGFzaEdldCBmcm9tICcuL19oYXNoR2V0LmpzJztcbmltcG9ydCBoYXNoSGFzIGZyb20gJy4vX2hhc2hIYXMuanMnO1xuaW1wb3J0IGhhc2hTZXQgZnJvbSAnLi9faGFzaFNldC5qcyc7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGhhc2ggb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBIYXNoKGVudHJpZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBlbnRyaWVzID09IG51bGwgPyAwIDogZW50cmllcy5sZW5ndGg7XG5cbiAgdGhpcy5jbGVhcigpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBlbnRyeSA9IGVudHJpZXNbaW5kZXhdO1xuICAgIHRoaXMuc2V0KGVudHJ5WzBdLCBlbnRyeVsxXSk7XG4gIH1cbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYEhhc2hgLlxuSGFzaC5wcm90b3R5cGUuY2xlYXIgPSBoYXNoQ2xlYXI7XG5IYXNoLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBoYXNoRGVsZXRlO1xuSGFzaC5wcm90b3R5cGUuZ2V0ID0gaGFzaEdldDtcbkhhc2gucHJvdG90eXBlLmhhcyA9IGhhc2hIYXM7XG5IYXNoLnByb3RvdHlwZS5zZXQgPSBoYXNoU2V0O1xuXG5leHBvcnQgZGVmYXVsdCBIYXNoO1xuIiwiaW1wb3J0IGxpc3RDYWNoZUNsZWFyIGZyb20gJy4vX2xpc3RDYWNoZUNsZWFyLmpzJztcbmltcG9ydCBsaXN0Q2FjaGVEZWxldGUgZnJvbSAnLi9fbGlzdENhY2hlRGVsZXRlLmpzJztcbmltcG9ydCBsaXN0Q2FjaGVHZXQgZnJvbSAnLi9fbGlzdENhY2hlR2V0LmpzJztcbmltcG9ydCBsaXN0Q2FjaGVIYXMgZnJvbSAnLi9fbGlzdENhY2hlSGFzLmpzJztcbmltcG9ydCBsaXN0Q2FjaGVTZXQgZnJvbSAnLi9fbGlzdENhY2hlU2V0LmpzJztcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGxpc3QgY2FjaGUgb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBMaXN0Q2FjaGUoZW50cmllcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGVudHJpZXMgPT0gbnVsbCA/IDAgOiBlbnRyaWVzLmxlbmd0aDtcblxuICB0aGlzLmNsZWFyKCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGVudHJ5ID0gZW50cmllc1tpbmRleF07XG4gICAgdGhpcy5zZXQoZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgfVxufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgTGlzdENhY2hlYC5cbkxpc3RDYWNoZS5wcm90b3R5cGUuY2xlYXIgPSBsaXN0Q2FjaGVDbGVhcjtcbkxpc3RDYWNoZS5wcm90b3R5cGVbJ2RlbGV0ZSddID0gbGlzdENhY2hlRGVsZXRlO1xuTGlzdENhY2hlLnByb3RvdHlwZS5nZXQgPSBsaXN0Q2FjaGVHZXQ7XG5MaXN0Q2FjaGUucHJvdG90eXBlLmhhcyA9IGxpc3RDYWNoZUhhcztcbkxpc3RDYWNoZS5wcm90b3R5cGUuc2V0ID0gbGlzdENhY2hlU2V0O1xuXG5leHBvcnQgZGVmYXVsdCBMaXN0Q2FjaGU7XG4iLCJpbXBvcnQgZ2V0TmF0aXZlIGZyb20gJy4vX2dldE5hdGl2ZS5qcyc7XG5pbXBvcnQgcm9vdCBmcm9tICcuL19yb290LmpzJztcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIE1hcCA9IGdldE5hdGl2ZShyb290LCAnTWFwJyk7XG5cbmV4cG9ydCBkZWZhdWx0IE1hcDtcbiIsImltcG9ydCBtYXBDYWNoZUNsZWFyIGZyb20gJy4vX21hcENhY2hlQ2xlYXIuanMnO1xuaW1wb3J0IG1hcENhY2hlRGVsZXRlIGZyb20gJy4vX21hcENhY2hlRGVsZXRlLmpzJztcbmltcG9ydCBtYXBDYWNoZUdldCBmcm9tICcuL19tYXBDYWNoZUdldC5qcyc7XG5pbXBvcnQgbWFwQ2FjaGVIYXMgZnJvbSAnLi9fbWFwQ2FjaGVIYXMuanMnO1xuaW1wb3J0IG1hcENhY2hlU2V0IGZyb20gJy4vX21hcENhY2hlU2V0LmpzJztcblxuLyoqXG4gKiBDcmVhdGVzIGEgbWFwIGNhY2hlIG9iamVjdCB0byBzdG9yZSBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIE1hcENhY2hlKGVudHJpZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBlbnRyaWVzID09IG51bGwgPyAwIDogZW50cmllcy5sZW5ndGg7XG5cbiAgdGhpcy5jbGVhcigpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBlbnRyeSA9IGVudHJpZXNbaW5kZXhdO1xuICAgIHRoaXMuc2V0KGVudHJ5WzBdLCBlbnRyeVsxXSk7XG4gIH1cbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYE1hcENhY2hlYC5cbk1hcENhY2hlLnByb3RvdHlwZS5jbGVhciA9IG1hcENhY2hlQ2xlYXI7XG5NYXBDYWNoZS5wcm90b3R5cGVbJ2RlbGV0ZSddID0gbWFwQ2FjaGVEZWxldGU7XG5NYXBDYWNoZS5wcm90b3R5cGUuZ2V0ID0gbWFwQ2FjaGVHZXQ7XG5NYXBDYWNoZS5wcm90b3R5cGUuaGFzID0gbWFwQ2FjaGVIYXM7XG5NYXBDYWNoZS5wcm90b3R5cGUuc2V0ID0gbWFwQ2FjaGVTZXQ7XG5cbmV4cG9ydCBkZWZhdWx0IE1hcENhY2hlO1xuIiwiaW1wb3J0IHJvb3QgZnJvbSAnLi9fcm9vdC5qcyc7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIFN5bWJvbCA9IHJvb3QuU3ltYm9sO1xuXG5leHBvcnQgZGVmYXVsdCBTeW1ib2w7XG4iLCJpbXBvcnQgZXEgZnJvbSAnLi9lcS5qcyc7XG5cbi8qKlxuICogR2V0cyB0aGUgaW5kZXggYXQgd2hpY2ggdGhlIGBrZXlgIGlzIGZvdW5kIGluIGBhcnJheWAgb2Yga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7Kn0ga2V5IFRoZSBrZXkgdG8gc2VhcmNoIGZvci5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG4gKi9cbmZ1bmN0aW9uIGFzc29jSW5kZXhPZihhcnJheSwga2V5KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG4gIHdoaWxlIChsZW5ndGgtLSkge1xuICAgIGlmIChlcShhcnJheVtsZW5ndGhdWzBdLCBrZXkpKSB7XG4gICAgICByZXR1cm4gbGVuZ3RoO1xuICAgIH1cbiAgfVxuICByZXR1cm4gLTE7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFzc29jSW5kZXhPZjtcbiIsImltcG9ydCBTeW1ib2wgZnJvbSAnLi9fU3ltYm9sLmpzJztcbmltcG9ydCBnZXRSYXdUYWcgZnJvbSAnLi9fZ2V0UmF3VGFnLmpzJztcbmltcG9ydCBvYmplY3RUb1N0cmluZyBmcm9tICcuL19vYmplY3RUb1N0cmluZy5qcyc7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBudWxsVGFnID0gJ1tvYmplY3QgTnVsbF0nLFxuICAgIHVuZGVmaW5lZFRhZyA9ICdbb2JqZWN0IFVuZGVmaW5lZF0nO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1Ub1N0cmluZ1RhZyA9IFN5bWJvbCA/IFN5bWJvbC50b1N0cmluZ1RhZyA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgZ2V0VGFnYCB3aXRob3V0IGZhbGxiYWNrcyBmb3IgYnVnZ3kgZW52aXJvbm1lbnRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGB0b1N0cmluZ1RhZ2AuXG4gKi9cbmZ1bmN0aW9uIGJhc2VHZXRUYWcodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZFRhZyA6IG51bGxUYWc7XG4gIH1cbiAgcmV0dXJuIChzeW1Ub1N0cmluZ1RhZyAmJiBzeW1Ub1N0cmluZ1RhZyBpbiBPYmplY3QodmFsdWUpKVxuICAgID8gZ2V0UmF3VGFnKHZhbHVlKVxuICAgIDogb2JqZWN0VG9TdHJpbmcodmFsdWUpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBiYXNlR2V0VGFnO1xuIiwiaW1wb3J0IGJhc2VHZXRUYWcgZnJvbSAnLi9fYmFzZUdldFRhZy5qcyc7XG5pbXBvcnQgaXNPYmplY3RMaWtlIGZyb20gJy4vaXNPYmplY3RMaWtlLmpzJztcblxudmFyIGFycmF5QnVmZmVyVGFnID0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJztcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc0FycmF5QnVmZmVyYCB3aXRob3V0IE5vZGUuanMgb3B0aW1pemF0aW9ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBhcnJheSBidWZmZXIsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzQXJyYXlCdWZmZXIodmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgYmFzZUdldFRhZyh2YWx1ZSkgPT0gYXJyYXlCdWZmZXJUYWc7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGJhc2VJc0FycmF5QnVmZmVyO1xuIiwiaW1wb3J0IGlzRnVuY3Rpb24gZnJvbSAnLi9pc0Z1bmN0aW9uLmpzJztcbmltcG9ydCBpc01hc2tlZCBmcm9tICcuL19pc01hc2tlZC5qcyc7XG5pbXBvcnQgaXNPYmplY3QgZnJvbSAnLi9pc09iamVjdC5qcyc7XG5pbXBvcnQgdG9Tb3VyY2UgZnJvbSAnLi9fdG9Tb3VyY2UuanMnO1xuXG4vKipcbiAqIFVzZWQgdG8gbWF0Y2ggYFJlZ0V4cGBcbiAqIFtzeW50YXggY2hhcmFjdGVyc10oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtcGF0dGVybnMpLlxuICovXG52YXIgcmVSZWdFeHBDaGFyID0gL1tcXFxcXiQuKis/KClbXFxde318XS9nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaG9zdCBjb25zdHJ1Y3RvcnMgKFNhZmFyaSkuICovXG52YXIgcmVJc0hvc3RDdG9yID0gL15cXFtvYmplY3QgLis/Q29uc3RydWN0b3JcXF0kLztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIGZ1bmNQcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZSxcbiAgICBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGRlY29tcGlsZWQgc291cmNlIG9mIGZ1bmN0aW9ucy4gKi9cbnZhciBmdW5jVG9TdHJpbmcgPSBmdW5jUHJvdG8udG9TdHJpbmc7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBpZiBhIG1ldGhvZCBpcyBuYXRpdmUuICovXG52YXIgcmVJc05hdGl2ZSA9IFJlZ0V4cCgnXicgK1xuICBmdW5jVG9TdHJpbmcuY2FsbChoYXNPd25Qcm9wZXJ0eSkucmVwbGFjZShyZVJlZ0V4cENoYXIsICdcXFxcJCYnKVxuICAucmVwbGFjZSgvaGFzT3duUHJvcGVydHl8KGZ1bmN0aW9uKS4qPyg/PVxcXFxcXCgpfCBmb3IgLis/KD89XFxcXFxcXSkvZywgJyQxLio/JykgKyAnJCdcbik7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNOYXRpdmVgIHdpdGhvdXQgYmFkIHNoaW0gY2hlY2tzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgbmF0aXZlIGZ1bmN0aW9uLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzTmF0aXZlKHZhbHVlKSB7XG4gIGlmICghaXNPYmplY3QodmFsdWUpIHx8IGlzTWFza2VkKHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgcGF0dGVybiA9IGlzRnVuY3Rpb24odmFsdWUpID8gcmVJc05hdGl2ZSA6IHJlSXNIb3N0Q3RvcjtcbiAgcmV0dXJuIHBhdHRlcm4udGVzdCh0b1NvdXJjZSh2YWx1ZSkpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBiYXNlSXNOYXRpdmU7XG4iLCIvKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnVuYXJ5YCB3aXRob3V0IHN1cHBvcnQgZm9yIHN0b3JpbmcgbWV0YWRhdGEuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNhcCBhcmd1bWVudHMgZm9yLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgY2FwcGVkIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlVW5hcnkoZnVuYykge1xuICByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gZnVuYyh2YWx1ZSk7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGJhc2VVbmFyeTtcbiIsImltcG9ydCByb290IGZyb20gJy4vX3Jvb3QuanMnO1xuXG4vKiogVXNlZCB0byBkZXRlY3Qgb3ZlcnJlYWNoaW5nIGNvcmUtanMgc2hpbXMuICovXG52YXIgY29yZUpzRGF0YSA9IHJvb3RbJ19fY29yZS1qc19zaGFyZWRfXyddO1xuXG5leHBvcnQgZGVmYXVsdCBjb3JlSnNEYXRhO1xuIiwiLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBnbG9iYWxgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlR2xvYmFsID0gdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwgJiYgZ2xvYmFsLk9iamVjdCA9PT0gT2JqZWN0ICYmIGdsb2JhbDtcblxuZXhwb3J0IGRlZmF1bHQgZnJlZUdsb2JhbDtcbiIsImltcG9ydCBpc0tleWFibGUgZnJvbSAnLi9faXNLZXlhYmxlLmpzJztcblxuLyoqXG4gKiBHZXRzIHRoZSBkYXRhIGZvciBgbWFwYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG1hcCBUaGUgbWFwIHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUgcmVmZXJlbmNlIGtleS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBtYXAgZGF0YS5cbiAqL1xuZnVuY3Rpb24gZ2V0TWFwRGF0YShtYXAsIGtleSkge1xuICB2YXIgZGF0YSA9IG1hcC5fX2RhdGFfXztcbiAgcmV0dXJuIGlzS2V5YWJsZShrZXkpXG4gICAgPyBkYXRhW3R5cGVvZiBrZXkgPT0gJ3N0cmluZycgPyAnc3RyaW5nJyA6ICdoYXNoJ11cbiAgICA6IGRhdGEubWFwO1xufVxuXG5leHBvcnQgZGVmYXVsdCBnZXRNYXBEYXRhO1xuIiwiaW1wb3J0IGJhc2VJc05hdGl2ZSBmcm9tICcuL19iYXNlSXNOYXRpdmUuanMnO1xuaW1wb3J0IGdldFZhbHVlIGZyb20gJy4vX2dldFZhbHVlLmpzJztcblxuLyoqXG4gKiBHZXRzIHRoZSBuYXRpdmUgZnVuY3Rpb24gYXQgYGtleWAgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgbWV0aG9kIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBmdW5jdGlvbiBpZiBpdCdzIG5hdGl2ZSwgZWxzZSBgdW5kZWZpbmVkYC5cbiAqL1xuZnVuY3Rpb24gZ2V0TmF0aXZlKG9iamVjdCwga2V5KSB7XG4gIHZhciB2YWx1ZSA9IGdldFZhbHVlKG9iamVjdCwga2V5KTtcbiAgcmV0dXJuIGJhc2VJc05hdGl2ZSh2YWx1ZSkgPyB2YWx1ZSA6IHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0TmF0aXZlO1xuIiwiaW1wb3J0IFN5bWJvbCBmcm9tICcuL19TeW1ib2wuanMnO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgbmF0aXZlT2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3ltVG9TdHJpbmdUYWcgPSBTeW1ib2wgPyBTeW1ib2wudG9TdHJpbmdUYWcgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlR2V0VGFnYCB3aGljaCBpZ25vcmVzIGBTeW1ib2wudG9TdHJpbmdUYWdgIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSByYXcgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gZ2V0UmF3VGFnKHZhbHVlKSB7XG4gIHZhciBpc093biA9IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIHN5bVRvU3RyaW5nVGFnKSxcbiAgICAgIHRhZyA9IHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcblxuICB0cnkge1xuICAgIHZhbHVlW3N5bVRvU3RyaW5nVGFnXSA9IHVuZGVmaW5lZDtcbiAgICB2YXIgdW5tYXNrZWQgPSB0cnVlO1xuICB9IGNhdGNoIChlKSB7fVxuXG4gIHZhciByZXN1bHQgPSBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgaWYgKHVubWFza2VkKSB7XG4gICAgaWYgKGlzT3duKSB7XG4gICAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB0YWc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldFJhd1RhZztcbiIsIi8qKlxuICogR2V0cyB0aGUgdmFsdWUgYXQgYGtleWAgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XSBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcHJvcGVydHkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGdldFZhbHVlKG9iamVjdCwga2V5KSB7XG4gIHJldHVybiBvYmplY3QgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IG9iamVjdFtrZXldO1xufVxuXG5leHBvcnQgZGVmYXVsdCBnZXRWYWx1ZTtcbiIsImltcG9ydCBuYXRpdmVDcmVhdGUgZnJvbSAnLi9fbmF0aXZlQ3JlYXRlLmpzJztcblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBrZXktdmFsdWUgZW50cmllcyBmcm9tIHRoZSBoYXNoLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIEhhc2hcbiAqL1xuZnVuY3Rpb24gaGFzaENsZWFyKCkge1xuICB0aGlzLl9fZGF0YV9fID0gbmF0aXZlQ3JlYXRlID8gbmF0aXZlQ3JlYXRlKG51bGwpIDoge307XG4gIHRoaXMuc2l6ZSA9IDA7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGhhc2hDbGVhcjtcbiIsIi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIGhhc2guXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7T2JqZWN0fSBoYXNoIFRoZSBoYXNoIHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBoYXNoRGVsZXRlKGtleSkge1xuICB2YXIgcmVzdWx0ID0gdGhpcy5oYXMoa2V5KSAmJiBkZWxldGUgdGhpcy5fX2RhdGFfX1trZXldO1xuICB0aGlzLnNpemUgLT0gcmVzdWx0ID8gMSA6IDA7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGhhc2hEZWxldGU7XG4iLCJpbXBvcnQgbmF0aXZlQ3JlYXRlIGZyb20gJy4vX25hdGl2ZUNyZWF0ZS5qcyc7XG5cbi8qKiBVc2VkIHRvIHN0YW5kLWluIGZvciBgdW5kZWZpbmVkYCBoYXNoIHZhbHVlcy4gKi9cbnZhciBIQVNIX1VOREVGSU5FRCA9ICdfX2xvZGFzaF9oYXNoX3VuZGVmaW5lZF9fJztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBHZXRzIHRoZSBoYXNoIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGhhc2hHZXQoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgaWYgKG5hdGl2ZUNyZWF0ZSkge1xuICAgIHZhciByZXN1bHQgPSBkYXRhW2tleV07XG4gICAgcmV0dXJuIHJlc3VsdCA9PT0gSEFTSF9VTkRFRklORUQgPyB1bmRlZmluZWQgOiByZXN1bHQ7XG4gIH1cbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoZGF0YSwga2V5KSA/IGRhdGFba2V5XSA6IHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaGFzaEdldDtcbiIsImltcG9ydCBuYXRpdmVDcmVhdGUgZnJvbSAnLi9fbmF0aXZlQ3JlYXRlLmpzJztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYSBoYXNoIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBoYXNoSGFzKGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIHJldHVybiBuYXRpdmVDcmVhdGUgPyAoZGF0YVtrZXldICE9PSB1bmRlZmluZWQpIDogaGFzT3duUHJvcGVydHkuY2FsbChkYXRhLCBrZXkpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBoYXNoSGFzO1xuIiwiaW1wb3J0IG5hdGl2ZUNyZWF0ZSBmcm9tICcuL19uYXRpdmVDcmVhdGUuanMnO1xuXG4vKiogVXNlZCB0byBzdGFuZC1pbiBmb3IgYHVuZGVmaW5lZGAgaGFzaCB2YWx1ZXMuICovXG52YXIgSEFTSF9VTkRFRklORUQgPSAnX19sb2Rhc2hfaGFzaF91bmRlZmluZWRfXyc7XG5cbi8qKlxuICogU2V0cyB0aGUgaGFzaCBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGhhc2ggaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIGhhc2hTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIHRoaXMuc2l6ZSArPSB0aGlzLmhhcyhrZXkpID8gMCA6IDE7XG4gIGRhdGFba2V5XSA9IChuYXRpdmVDcmVhdGUgJiYgdmFsdWUgPT09IHVuZGVmaW5lZCkgPyBIQVNIX1VOREVGSU5FRCA6IHZhbHVlO1xuICByZXR1cm4gdGhpcztcbn1cblxuZXhwb3J0IGRlZmF1bHQgaGFzaFNldDtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgc3VpdGFibGUgZm9yIHVzZSBhcyB1bmlxdWUgb2JqZWN0IGtleS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBzdWl0YWJsZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0tleWFibGUodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiAodHlwZSA9PSAnc3RyaW5nJyB8fCB0eXBlID09ICdudW1iZXInIHx8IHR5cGUgPT0gJ3N5bWJvbCcgfHwgdHlwZSA9PSAnYm9vbGVhbicpXG4gICAgPyAodmFsdWUgIT09ICdfX3Byb3RvX18nKVxuICAgIDogKHZhbHVlID09PSBudWxsKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaXNLZXlhYmxlO1xuIiwiaW1wb3J0IGNvcmVKc0RhdGEgZnJvbSAnLi9fY29yZUpzRGF0YS5qcyc7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBtZXRob2RzIG1hc3F1ZXJhZGluZyBhcyBuYXRpdmUuICovXG52YXIgbWFza1NyY0tleSA9IChmdW5jdGlvbigpIHtcbiAgdmFyIHVpZCA9IC9bXi5dKyQvLmV4ZWMoY29yZUpzRGF0YSAmJiBjb3JlSnNEYXRhLmtleXMgJiYgY29yZUpzRGF0YS5rZXlzLklFX1BST1RPIHx8ICcnKTtcbiAgcmV0dXJuIHVpZCA/ICgnU3ltYm9sKHNyYylfMS4nICsgdWlkKSA6ICcnO1xufSgpKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYGZ1bmNgIGhhcyBpdHMgc291cmNlIG1hc2tlZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYGZ1bmNgIGlzIG1hc2tlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc01hc2tlZChmdW5jKSB7XG4gIHJldHVybiAhIW1hc2tTcmNLZXkgJiYgKG1hc2tTcmNLZXkgaW4gZnVuYyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGlzTWFza2VkO1xuIiwiLyoqXG4gKiBSZW1vdmVzIGFsbCBrZXktdmFsdWUgZW50cmllcyBmcm9tIHRoZSBsaXN0IGNhY2hlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVDbGVhcigpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IFtdO1xuICB0aGlzLnNpemUgPSAwO1xufVxuXG5leHBvcnQgZGVmYXVsdCBsaXN0Q2FjaGVDbGVhcjtcbiIsImltcG9ydCBhc3NvY0luZGV4T2YgZnJvbSAnLi9fYXNzb2NJbmRleE9mLmpzJztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIGFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHNwbGljZSA9IGFycmF5UHJvdG8uc3BsaWNlO1xuXG4vKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBsaXN0IGNhY2hlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVEZWxldGUoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIGluZGV4ID0gYXNzb2NJbmRleE9mKGRhdGEsIGtleSk7XG5cbiAgaWYgKGluZGV4IDwgMCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgbGFzdEluZGV4ID0gZGF0YS5sZW5ndGggLSAxO1xuICBpZiAoaW5kZXggPT0gbGFzdEluZGV4KSB7XG4gICAgZGF0YS5wb3AoKTtcbiAgfSBlbHNlIHtcbiAgICBzcGxpY2UuY2FsbChkYXRhLCBpbmRleCwgMSk7XG4gIH1cbiAgLS10aGlzLnNpemU7XG4gIHJldHVybiB0cnVlO1xufVxuXG5leHBvcnQgZGVmYXVsdCBsaXN0Q2FjaGVEZWxldGU7XG4iLCJpbXBvcnQgYXNzb2NJbmRleE9mIGZyb20gJy4vX2Fzc29jSW5kZXhPZi5qcyc7XG5cbi8qKlxuICogR2V0cyB0aGUgbGlzdCBjYWNoZSB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZUdldChrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgaW5kZXggPSBhc3NvY0luZGV4T2YoZGF0YSwga2V5KTtcblxuICByZXR1cm4gaW5kZXggPCAwID8gdW5kZWZpbmVkIDogZGF0YVtpbmRleF1bMV07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGxpc3RDYWNoZUdldDtcbiIsImltcG9ydCBhc3NvY0luZGV4T2YgZnJvbSAnLi9fYXNzb2NJbmRleE9mLmpzJztcblxuLyoqXG4gKiBDaGVja3MgaWYgYSBsaXN0IGNhY2hlIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZUhhcyhrZXkpIHtcbiAgcmV0dXJuIGFzc29jSW5kZXhPZih0aGlzLl9fZGF0YV9fLCBrZXkpID4gLTE7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGxpc3RDYWNoZUhhcztcbiIsImltcG9ydCBhc3NvY0luZGV4T2YgZnJvbSAnLi9fYXNzb2NJbmRleE9mLmpzJztcblxuLyoqXG4gKiBTZXRzIHRoZSBsaXN0IGNhY2hlIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBsaXN0IGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIGlmIChpbmRleCA8IDApIHtcbiAgICArK3RoaXMuc2l6ZTtcbiAgICBkYXRhLnB1c2goW2tleSwgdmFsdWVdKTtcbiAgfSBlbHNlIHtcbiAgICBkYXRhW2luZGV4XVsxXSA9IHZhbHVlO1xuICB9XG4gIHJldHVybiB0aGlzO1xufVxuXG5leHBvcnQgZGVmYXVsdCBsaXN0Q2FjaGVTZXQ7XG4iLCJpbXBvcnQgSGFzaCBmcm9tICcuL19IYXNoLmpzJztcbmltcG9ydCBMaXN0Q2FjaGUgZnJvbSAnLi9fTGlzdENhY2hlLmpzJztcbmltcG9ydCBNYXAgZnJvbSAnLi9fTWFwLmpzJztcblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBrZXktdmFsdWUgZW50cmllcyBmcm9tIHRoZSBtYXAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVDbGVhcigpIHtcbiAgdGhpcy5zaXplID0gMDtcbiAgdGhpcy5fX2RhdGFfXyA9IHtcbiAgICAnaGFzaCc6IG5ldyBIYXNoLFxuICAgICdtYXAnOiBuZXcgKE1hcCB8fCBMaXN0Q2FjaGUpLFxuICAgICdzdHJpbmcnOiBuZXcgSGFzaFxuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBtYXBDYWNoZUNsZWFyO1xuIiwiaW1wb3J0IGdldE1hcERhdGEgZnJvbSAnLi9fZ2V0TWFwRGF0YS5qcyc7XG5cbi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIG1hcC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZURlbGV0ZShrZXkpIHtcbiAgdmFyIHJlc3VsdCA9IGdldE1hcERhdGEodGhpcywga2V5KVsnZGVsZXRlJ10oa2V5KTtcbiAgdGhpcy5zaXplIC09IHJlc3VsdCA/IDEgOiAwO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBtYXBDYWNoZURlbGV0ZTtcbiIsImltcG9ydCBnZXRNYXBEYXRhIGZyb20gJy4vX2dldE1hcERhdGEuanMnO1xuXG4vKipcbiAqIEdldHMgdGhlIG1hcCB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVHZXQoa2V5KSB7XG4gIHJldHVybiBnZXRNYXBEYXRhKHRoaXMsIGtleSkuZ2V0KGtleSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IG1hcENhY2hlR2V0O1xuIiwiaW1wb3J0IGdldE1hcERhdGEgZnJvbSAnLi9fZ2V0TWFwRGF0YS5qcyc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgbWFwIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVIYXMoa2V5KSB7XG4gIHJldHVybiBnZXRNYXBEYXRhKHRoaXMsIGtleSkuaGFzKGtleSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IG1hcENhY2hlSGFzO1xuIiwiaW1wb3J0IGdldE1hcERhdGEgZnJvbSAnLi9fZ2V0TWFwRGF0YS5qcyc7XG5cbi8qKlxuICogU2V0cyB0aGUgbWFwIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG1hcCBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IGdldE1hcERhdGEodGhpcywga2V5KSxcbiAgICAgIHNpemUgPSBkYXRhLnNpemU7XG5cbiAgZGF0YS5zZXQoa2V5LCB2YWx1ZSk7XG4gIHRoaXMuc2l6ZSArPSBkYXRhLnNpemUgPT0gc2l6ZSA/IDAgOiAxO1xuICByZXR1cm4gdGhpcztcbn1cblxuZXhwb3J0IGRlZmF1bHQgbWFwQ2FjaGVTZXQ7XG4iLCJpbXBvcnQgZ2V0TmF0aXZlIGZyb20gJy4vX2dldE5hdGl2ZS5qcyc7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBuYXRpdmVDcmVhdGUgPSBnZXROYXRpdmUoT2JqZWN0LCAnY3JlYXRlJyk7XG5cbmV4cG9ydCBkZWZhdWx0IG5hdGl2ZUNyZWF0ZTtcbiIsImltcG9ydCBmcmVlR2xvYmFsIGZyb20gJy4vX2ZyZWVHbG9iYWwuanMnO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGV4cG9ydHNgLiAqL1xudmFyIGZyZWVFeHBvcnRzID0gdHlwZW9mIGV4cG9ydHMgPT0gJ29iamVjdCcgJiYgZXhwb3J0cyAmJiAhZXhwb3J0cy5ub2RlVHlwZSAmJiBleHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYG1vZHVsZWAuICovXG52YXIgZnJlZU1vZHVsZSA9IGZyZWVFeHBvcnRzICYmIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlICYmICFtb2R1bGUubm9kZVR5cGUgJiYgbW9kdWxlO1xuXG4vKiogRGV0ZWN0IHRoZSBwb3B1bGFyIENvbW1vbkpTIGV4dGVuc2lvbiBgbW9kdWxlLmV4cG9ydHNgLiAqL1xudmFyIG1vZHVsZUV4cG9ydHMgPSBmcmVlTW9kdWxlICYmIGZyZWVNb2R1bGUuZXhwb3J0cyA9PT0gZnJlZUV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgcHJvY2Vzc2AgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVQcm9jZXNzID0gbW9kdWxlRXhwb3J0cyAmJiBmcmVlR2xvYmFsLnByb2Nlc3M7XG5cbi8qKiBVc2VkIHRvIGFjY2VzcyBmYXN0ZXIgTm9kZS5qcyBoZWxwZXJzLiAqL1xudmFyIG5vZGVVdGlsID0gKGZ1bmN0aW9uKCkge1xuICB0cnkge1xuICAgIC8vIFVzZSBgdXRpbC50eXBlc2AgZm9yIE5vZGUuanMgMTArLlxuICAgIHZhciB0eXBlcyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5yZXF1aXJlICYmIGZyZWVNb2R1bGUucmVxdWlyZSgndXRpbCcpLnR5cGVzO1xuXG4gICAgaWYgKHR5cGVzKSB7XG4gICAgICByZXR1cm4gdHlwZXM7XG4gICAgfVxuXG4gICAgLy8gTGVnYWN5IGBwcm9jZXNzLmJpbmRpbmcoJ3V0aWwnKWAgZm9yIE5vZGUuanMgPCAxMC5cbiAgICByZXR1cm4gZnJlZVByb2Nlc3MgJiYgZnJlZVByb2Nlc3MuYmluZGluZyAmJiBmcmVlUHJvY2Vzcy5iaW5kaW5nKCd1dGlsJyk7XG4gIH0gY2F0Y2ggKGUpIHt9XG59KCkpO1xuXG5leHBvcnQgZGVmYXVsdCBub2RlVXRpbDtcbiIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBuYXRpdmVPYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBzdHJpbmcgdXNpbmcgYE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgY29udmVydGVkIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gb2JqZWN0VG9TdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIG5hdGl2ZU9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBvYmplY3RUb1N0cmluZztcbiIsImltcG9ydCBmcmVlR2xvYmFsIGZyb20gJy4vX2ZyZWVHbG9iYWwuanMnO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHNlbGZgLiAqL1xudmFyIGZyZWVTZWxmID0gdHlwZW9mIHNlbGYgPT0gJ29iamVjdCcgJiYgc2VsZiAmJiBzZWxmLk9iamVjdCA9PT0gT2JqZWN0ICYmIHNlbGY7XG5cbi8qKiBVc2VkIGFzIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0LiAqL1xudmFyIHJvb3QgPSBmcmVlR2xvYmFsIHx8IGZyZWVTZWxmIHx8IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cbmV4cG9ydCBkZWZhdWx0IHJvb3Q7XG4iLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgZnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byByZXNvbHZlIHRoZSBkZWNvbXBpbGVkIHNvdXJjZSBvZiBmdW5jdGlvbnMuICovXG52YXIgZnVuY1RvU3RyaW5nID0gZnVuY1Byb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIENvbnZlcnRzIGBmdW5jYCB0byBpdHMgc291cmNlIGNvZGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBzb3VyY2UgY29kZS5cbiAqL1xuZnVuY3Rpb24gdG9Tb3VyY2UoZnVuYykge1xuICBpZiAoZnVuYyAhPSBudWxsKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBmdW5jVG9TdHJpbmcuY2FsbChmdW5jKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gKGZ1bmMgKyAnJyk7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgfVxuICByZXR1cm4gJyc7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHRvU291cmNlO1xuIiwiLyoqXG4gKiBQZXJmb3JtcyBhXG4gKiBbYFNhbWVWYWx1ZVplcm9gXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1zYW1ldmFsdWV6ZXJvKVxuICogY29tcGFyaXNvbiBiZXR3ZWVuIHR3byB2YWx1ZXMgdG8gZGV0ZXJtaW5lIGlmIHRoZXkgYXJlIGVxdWl2YWxlbnQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0geyp9IG90aGVyIFRoZSBvdGhlciB2YWx1ZSB0byBjb21wYXJlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiAxIH07XG4gKiB2YXIgb3RoZXIgPSB7ICdhJzogMSB9O1xuICpcbiAqIF8uZXEob2JqZWN0LCBvYmplY3QpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uZXEob2JqZWN0LCBvdGhlcik7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uZXEoJ2EnLCAnYScpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uZXEoJ2EnLCBPYmplY3QoJ2EnKSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uZXEoTmFOLCBOYU4pO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBlcSh2YWx1ZSwgb3RoZXIpIHtcbiAgcmV0dXJuIHZhbHVlID09PSBvdGhlciB8fCAodmFsdWUgIT09IHZhbHVlICYmIG90aGVyICE9PSBvdGhlcik7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGVxO1xuIiwiaW1wb3J0IGJhc2VJc0FycmF5QnVmZmVyIGZyb20gJy4vX2Jhc2VJc0FycmF5QnVmZmVyLmpzJztcbmltcG9ydCBiYXNlVW5hcnkgZnJvbSAnLi9fYmFzZVVuYXJ5LmpzJztcbmltcG9ydCBub2RlVXRpbCBmcm9tICcuL19ub2RlVXRpbC5qcyc7XG5cbi8qIE5vZGUuanMgaGVscGVyIHJlZmVyZW5jZXMuICovXG52YXIgbm9kZUlzQXJyYXlCdWZmZXIgPSBub2RlVXRpbCAmJiBub2RlVXRpbC5pc0FycmF5QnVmZmVyO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYW4gYEFycmF5QnVmZmVyYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjMuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYXJyYXkgYnVmZmVyLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheUJ1ZmZlcihuZXcgQXJyYXlCdWZmZXIoMikpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUJ1ZmZlcihuZXcgQXJyYXkoMikpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQXJyYXlCdWZmZXIgPSBub2RlSXNBcnJheUJ1ZmZlciA/IGJhc2VVbmFyeShub2RlSXNBcnJheUJ1ZmZlcikgOiBiYXNlSXNBcnJheUJ1ZmZlcjtcblxuZXhwb3J0IGRlZmF1bHQgaXNBcnJheUJ1ZmZlcjtcbiIsImltcG9ydCBiYXNlR2V0VGFnIGZyb20gJy4vX2Jhc2VHZXRUYWcuanMnO1xuaW1wb3J0IGlzT2JqZWN0IGZyb20gJy4vaXNPYmplY3QuanMnO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXN5bmNUYWcgPSAnW29iamVjdCBBc3luY0Z1bmN0aW9uXScsXG4gICAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgZ2VuVGFnID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJyxcbiAgICBwcm94eVRhZyA9ICdbb2JqZWN0IFByb3h5XSc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBGdW5jdGlvbmAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgZnVuY3Rpb24sIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0Z1bmN0aW9uKF8pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNGdW5jdGlvbigvYWJjLyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gIGlmICghaXNPYmplY3QodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vIFRoZSB1c2Ugb2YgYE9iamVjdCN0b1N0cmluZ2AgYXZvaWRzIGlzc3VlcyB3aXRoIHRoZSBgdHlwZW9mYCBvcGVyYXRvclxuICAvLyBpbiBTYWZhcmkgOSB3aGljaCByZXR1cm5zICdvYmplY3QnIGZvciB0eXBlZCBhcnJheXMgYW5kIG90aGVyIGNvbnN0cnVjdG9ycy5cbiAgdmFyIHRhZyA9IGJhc2VHZXRUYWcodmFsdWUpO1xuICByZXR1cm4gdGFnID09IGZ1bmNUYWcgfHwgdGFnID09IGdlblRhZyB8fCB0YWcgPT0gYXN5bmNUYWcgfHwgdGFnID09IHByb3h5VGFnO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpc0Z1bmN0aW9uO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGVcbiAqIFtsYW5ndWFnZSB0eXBlXShodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtZWNtYXNjcmlwdC1sYW5ndWFnZS10eXBlcylcbiAqIG9mIGBPYmplY3RgLiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoXy5ub29wKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGlzT2JqZWN0O1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS4gQSB2YWx1ZSBpcyBvYmplY3QtbGlrZSBpZiBpdCdzIG5vdCBgbnVsbGBcbiAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgXCJvYmplY3RcIi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZSh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGlzT2JqZWN0TGlrZTtcbiIsImltcG9ydCBNYXBDYWNoZSBmcm9tICcuL19NYXBDYWNoZS5qcyc7XG5cbi8qKiBFcnJvciBtZXNzYWdlIGNvbnN0YW50cy4gKi9cbnZhciBGVU5DX0VSUk9SX1RFWFQgPSAnRXhwZWN0ZWQgYSBmdW5jdGlvbic7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgbWVtb2l6ZXMgdGhlIHJlc3VsdCBvZiBgZnVuY2AuIElmIGByZXNvbHZlcmAgaXNcbiAqIHByb3ZpZGVkLCBpdCBkZXRlcm1pbmVzIHRoZSBjYWNoZSBrZXkgZm9yIHN0b3JpbmcgdGhlIHJlc3VsdCBiYXNlZCBvbiB0aGVcbiAqIGFyZ3VtZW50cyBwcm92aWRlZCB0byB0aGUgbWVtb2l6ZWQgZnVuY3Rpb24uIEJ5IGRlZmF1bHQsIHRoZSBmaXJzdCBhcmd1bWVudFxuICogcHJvdmlkZWQgdG8gdGhlIG1lbW9pemVkIGZ1bmN0aW9uIGlzIHVzZWQgYXMgdGhlIG1hcCBjYWNoZSBrZXkuIFRoZSBgZnVuY2BcbiAqIGlzIGludm9rZWQgd2l0aCB0aGUgYHRoaXNgIGJpbmRpbmcgb2YgdGhlIG1lbW9pemVkIGZ1bmN0aW9uLlxuICpcbiAqICoqTm90ZToqKiBUaGUgY2FjaGUgaXMgZXhwb3NlZCBhcyB0aGUgYGNhY2hlYCBwcm9wZXJ0eSBvbiB0aGUgbWVtb2l6ZWRcbiAqIGZ1bmN0aW9uLiBJdHMgY3JlYXRpb24gbWF5IGJlIGN1c3RvbWl6ZWQgYnkgcmVwbGFjaW5nIHRoZSBgXy5tZW1vaXplLkNhY2hlYFxuICogY29uc3RydWN0b3Igd2l0aCBvbmUgd2hvc2UgaW5zdGFuY2VzIGltcGxlbWVudCB0aGVcbiAqIFtgTWFwYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtcHJvcGVydGllcy1vZi10aGUtbWFwLXByb3RvdHlwZS1vYmplY3QpXG4gKiBtZXRob2QgaW50ZXJmYWNlIG9mIGBjbGVhcmAsIGBkZWxldGVgLCBgZ2V0YCwgYGhhc2AsIGFuZCBgc2V0YC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGhhdmUgaXRzIG91dHB1dCBtZW1vaXplZC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtyZXNvbHZlcl0gVGhlIGZ1bmN0aW9uIHRvIHJlc29sdmUgdGhlIGNhY2hlIGtleS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IG1lbW9pemVkIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IDEsICdiJzogMiB9O1xuICogdmFyIG90aGVyID0geyAnYyc6IDMsICdkJzogNCB9O1xuICpcbiAqIHZhciB2YWx1ZXMgPSBfLm1lbW9pemUoXy52YWx1ZXMpO1xuICogdmFsdWVzKG9iamVjdCk7XG4gKiAvLyA9PiBbMSwgMl1cbiAqXG4gKiB2YWx1ZXMob3RoZXIpO1xuICogLy8gPT4gWzMsIDRdXG4gKlxuICogb2JqZWN0LmEgPSAyO1xuICogdmFsdWVzKG9iamVjdCk7XG4gKiAvLyA9PiBbMSwgMl1cbiAqXG4gKiAvLyBNb2RpZnkgdGhlIHJlc3VsdCBjYWNoZS5cbiAqIHZhbHVlcy5jYWNoZS5zZXQob2JqZWN0LCBbJ2EnLCAnYiddKTtcbiAqIHZhbHVlcyhvYmplY3QpO1xuICogLy8gPT4gWydhJywgJ2InXVxuICpcbiAqIC8vIFJlcGxhY2UgYF8ubWVtb2l6ZS5DYWNoZWAuXG4gKiBfLm1lbW9pemUuQ2FjaGUgPSBXZWFrTWFwO1xuICovXG5mdW5jdGlvbiBtZW1vaXplKGZ1bmMsIHJlc29sdmVyKSB7XG4gIGlmICh0eXBlb2YgZnVuYyAhPSAnZnVuY3Rpb24nIHx8IChyZXNvbHZlciAhPSBudWxsICYmIHR5cGVvZiByZXNvbHZlciAhPSAnZnVuY3Rpb24nKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRlVOQ19FUlJPUl9URVhUKTtcbiAgfVxuICB2YXIgbWVtb2l6ZWQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgICAga2V5ID0gcmVzb2x2ZXIgPyByZXNvbHZlci5hcHBseSh0aGlzLCBhcmdzKSA6IGFyZ3NbMF0sXG4gICAgICAgIGNhY2hlID0gbWVtb2l6ZWQuY2FjaGU7XG5cbiAgICBpZiAoY2FjaGUuaGFzKGtleSkpIHtcbiAgICAgIHJldHVybiBjYWNoZS5nZXQoa2V5KTtcbiAgICB9XG4gICAgdmFyIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhpcywgYXJncyk7XG4gICAgbWVtb2l6ZWQuY2FjaGUgPSBjYWNoZS5zZXQoa2V5LCByZXN1bHQpIHx8IGNhY2hlO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG4gIG1lbW9pemVkLmNhY2hlID0gbmV3IChtZW1vaXplLkNhY2hlIHx8IE1hcENhY2hlKTtcbiAgcmV0dXJuIG1lbW9pemVkO1xufVxuXG4vLyBFeHBvc2UgYE1hcENhY2hlYC5cbm1lbW9pemUuQ2FjaGUgPSBNYXBDYWNoZTtcblxuZXhwb3J0IGRlZmF1bHQgbWVtb2l6ZTtcbiIsImltcG9ydCB7XG5cdEhBTEZfRkxPQVQsIEZMT0FULCBVTlNJR05FRF9CWVRFLCBCWVRFLCBVTlNJR05FRF9TSE9SVCwgU0hPUlQsIFVOU0lHTkVEX0lOVCwgSU5ULFxuXHRMSU5FQVIsIE5FQVJFU1QsXG5cdFJFUEVBVCwgQ0xBTVBfVE9fRURHRSwgUkdCLCBSR0JBLFxufSBmcm9tICcuL0NvbnN0YW50cyc7XG5cbmV4cG9ydCBjb25zdCB2YWxpZERhdGFUeXBlcyA9IFtIQUxGX0ZMT0FULCBGTE9BVCwgVU5TSUdORURfQllURSwgQllURSwgVU5TSUdORURfU0hPUlQsIFNIT1JULCBVTlNJR05FRF9JTlQsIElOVF07XG5leHBvcnQgZnVuY3Rpb24gaXNWYWxpZERhdGFUeXBlKHR5cGU6IHN0cmluZykge1xuXHRyZXR1cm4gdmFsaWREYXRhVHlwZXMuaW5kZXhPZih0eXBlKSA+IC0xO1xufVxuXG5leHBvcnQgY29uc3QgdmFsaWRGaWx0ZXJUeXBlcyA9IFtMSU5FQVIsIE5FQVJFU1RdO1xuZXhwb3J0IGZ1bmN0aW9uIGlzVmFsaWRGaWx0ZXJUeXBlKHR5cGU6IHN0cmluZykge1xuXHRyZXR1cm4gdmFsaWRGaWx0ZXJUeXBlcy5pbmRleE9mKHR5cGUpID4gLTE7XG59XG5cbmV4cG9ydCBjb25zdCB2YWxpZFdyYXBUeXBlcyA9IFtDTEFNUF9UT19FREdFLCBSRVBFQVRdOyAvLyBNSVJST1JFRF9SRVBFQVRcbmV4cG9ydCBmdW5jdGlvbiBpc1ZhbGlkV3JhcFR5cGUodHlwZTogc3RyaW5nKSB7XG5cdHJldHVybiB2YWxpZFdyYXBUeXBlcy5pbmRleE9mKHR5cGUpID4gLTE7XG59XG5cbmV4cG9ydCBjb25zdCB2YWxpZFRleHR1cmVGb3JtYXRUeXBlcyA9IFtSR0IsIFJHQkFdO1xuZXhwb3J0IGZ1bmN0aW9uIGlzVmFsaWRUZXh0dXJlRm9ybWF0VHlwZSh0eXBlOiBzdHJpbmcpIHtcblx0cmV0dXJuIHZhbGlkVGV4dHVyZUZvcm1hdFR5cGVzLmluZGV4T2YodHlwZSkgPiAtMTtcbn1cblxuZXhwb3J0IGNvbnN0IHZhbGlkVGV4dHVyZURhdGFUeXBlcyA9IFtVTlNJR05FRF9CWVRFXTtcbmV4cG9ydCBmdW5jdGlvbiBpc1ZhbGlkVGV4dHVyZURhdGFUeXBlKHR5cGU6IHN0cmluZykge1xuXHRyZXR1cm4gdmFsaWRUZXh0dXJlRGF0YVR5cGVzLmluZGV4T2YodHlwZSkgPiAtMTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzTnVtYmVyKHZhbHVlOiBhbnkpIHtcblx0cmV0dXJuICFpc05hTih2YWx1ZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0ludGVnZXIodmFsdWU6IGFueSkge1xuXHRyZXR1cm4gaXNOdW1iZXIodmFsdWUpICYmICh2YWx1ZSAlIDEgPT09IDApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNQb3NpdGl2ZUludGVnZXIodmFsdWU6IGFueSkge1xuXHRyZXR1cm4gaXNJbnRlZ2VyKHZhbHVlKSAmJiAgdmFsdWUgPiAwO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNTdHJpbmcodmFsdWU6IGFueSl7XG5cdHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNBcnJheSh2YWx1ZTogYW55KSB7XG5cdHJldHVybiBBcnJheS5pc0FycmF5KHZhbHVlKTtcbn0iLCJleHBvcnQgY29uc3QgSEFMRl9GTE9BVCA9ICdIQUxGX0ZMT0FUJztcbmV4cG9ydCBjb25zdCBGTE9BVCA9ICdGTE9BVCc7XG5leHBvcnQgY29uc3QgVU5TSUdORURfQllURSA9ICdVTlNJR05FRF9CWVRFJztcbmV4cG9ydCBjb25zdCBCWVRFID0gJ0JZVEUnO1xuZXhwb3J0IGNvbnN0IFVOU0lHTkVEX1NIT1JUID0gJ1VOU0lHTkVEX1NIT1JUJztcbmV4cG9ydCBjb25zdCBTSE9SVCA9ICdTSE9SVCc7XG5leHBvcnQgY29uc3QgVU5TSUdORURfSU5UID0gJ1VOU0lHTkVEX0lOVCc7XG5leHBvcnQgY29uc3QgSU5UID0gJ0lOVCc7XG5cbmV4cG9ydCBjb25zdCBMSU5FQVIgPSAnTElORUFSJztcbmV4cG9ydCBjb25zdCBORUFSRVNUID0gJ05FQVJFU1QnO1xuXG5leHBvcnQgY29uc3QgUkVQRUFUID0gJ1JFUEVBVCc7XG5leHBvcnQgY29uc3QgQ0xBTVBfVE9fRURHRSA9ICdDTEFNUF9UT19FREdFJztcbi8vIGV4cG9ydCBjb25zdCBNSVJST1JFRF9SRVBFQVQgPSAnTUlSUk9SRURfUkVQRUFUJztcblxuZXhwb3J0IGNvbnN0IFJHQiA9ICdSR0InO1xuZXhwb3J0IGNvbnN0IFJHQkEgPSAnUkdCQSc7XG5cbmV4cG9ydCB0eXBlIERhdGFMYXllckFycmF5VHlwZSA9ICBGbG9hdDMyQXJyYXkgfCBVaW50OEFycmF5IHwgSW50OEFycmF5IHwgVWludDE2QXJyYXkgfCBJbnQxNkFycmF5IHwgVWludDMyQXJyYXkgfCBJbnQzMkFycmF5O1xuZXhwb3J0IHR5cGUgRGF0YUxheWVyVHlwZSA9IHR5cGVvZiBIQUxGX0ZMT0FUIHwgdHlwZW9mIEZMT0FUIHwgdHlwZW9mIFVOU0lHTkVEX0JZVEUgfCB0eXBlb2YgQllURSB8IHR5cGVvZiBVTlNJR05FRF9TSE9SVCB8IHR5cGVvZiBTSE9SVCB8IHR5cGVvZiBVTlNJR05FRF9JTlQgfCB0eXBlb2YgSU5UO1xuZXhwb3J0IHR5cGUgRGF0YUxheWVyTnVtQ29tcG9uZW50cyA9IDEgfCAyIHwgMyB8IDQ7XG5leHBvcnQgdHlwZSBEYXRhTGF5ZXJGaWx0ZXJUeXBlID0gdHlwZW9mIExJTkVBUiB8IHR5cGVvZiBORUFSRVNUO1xuZXhwb3J0IHR5cGUgRGF0YUxheWVyV3JhcFR5cGUgPSB0eXBlb2YgUkVQRUFUIHwgdHlwZW9mIENMQU1QX1RPX0VER0U7Ly8gfCB0eXBlb2YgTUlSUk9SRURfUkVQRUFUO1xuXG5leHBvcnQgdHlwZSBUZXh0dXJlRm9ybWF0VHlwZSA9IHR5cGVvZiBSR0IgfCB0eXBlb2YgUkdCQTtcbmV4cG9ydCB0eXBlIFRleHR1cmVEYXRhVHlwZSA9IHR5cGVvZiBVTlNJR05FRF9CWVRFO1xuXG5leHBvcnQgY29uc3QgR0xTTDMgPSAnMzAwIGVzJztcbmV4cG9ydCBjb25zdCBHTFNMMSA9ICcxMDAnO1xuZXhwb3J0IHR5cGUgR0xTTFZlcnNpb24gPSB0eXBlb2YgR0xTTDEgfCB0eXBlb2YgR0xTTDM7XG5cbi8vIFVuaWZvcm0gdHlwZXMuXG5leHBvcnQgY29uc3QgRkxPQVRfMURfVU5JRk9STSA9ICcxZic7XG5leHBvcnQgY29uc3QgRkxPQVRfMkRfVU5JRk9STSA9ICcyZic7XG5leHBvcnQgY29uc3QgRkxPQVRfM0RfVU5JRk9STSA9ICczZic7XG5leHBvcnQgY29uc3QgRkxPQVRfNERfVU5JRk9STSA9ICczZic7XG5leHBvcnQgY29uc3QgSU5UXzFEX1VOSUZPUk0gPSAnMWknO1xuZXhwb3J0IGNvbnN0IElOVF8yRF9VTklGT1JNID0gJzJpJztcbmV4cG9ydCBjb25zdCBJTlRfM0RfVU5JRk9STSA9ICczaSc7XG5leHBvcnQgY29uc3QgSU5UXzREX1VOSUZPUk0gPSAnM2knO1xuXG5leHBvcnQgdHlwZSBVbmlmb3JtRGF0YVR5cGUgPSB0eXBlb2YgRkxPQVQgfCB0eXBlb2YgSU5UO1xuZXhwb3J0IHR5cGUgVW5pZm9ybVZhbHVlVHlwZSA9IFxuXHRudW1iZXIgfFxuXHRbbnVtYmVyXSB8XG5cdFtudW1iZXIsIG51bWJlcl0gfFxuXHRbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gfFxuXHRbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXTtcbmV4cG9ydCB0eXBlIFVuaWZvcm1UeXBlID0gXG5cdHR5cGVvZiBGTE9BVF8xRF9VTklGT1JNIHxcblx0dHlwZW9mIEZMT0FUXzJEX1VOSUZPUk0gfFxuXHR0eXBlb2YgRkxPQVRfM0RfVU5JRk9STSB8XG5cdHR5cGVvZiBGTE9BVF80RF9VTklGT1JNIHxcblx0dHlwZW9mIElOVF8xRF9VTklGT1JNIHxcblx0dHlwZW9mIElOVF8yRF9VTklGT1JNIHxcblx0dHlwZW9mIElOVF8zRF9VTklGT1JNIHxcblx0dHlwZW9mIElOVF80RF9VTklGT1JNO1xuZXhwb3J0IHR5cGUgVW5pZm9ybSA9IHsgXG5cdGxvY2F0aW9uOiB7IFtrZXk6IHN0cmluZ106IFdlYkdMVW5pZm9ybUxvY2F0aW9uIH0sXG5cdHR5cGU6IFVuaWZvcm1UeXBlLFxuXHR2YWx1ZTogVW5pZm9ybVZhbHVlVHlwZSxcbn07XG5cbiIsImltcG9ydCB7IHNldEZsb2F0MTYgfSBmcm9tICdAcGV0YW1vcmlrZW4vZmxvYXQxNic7XG5pbXBvcnQgeyBpc1Bvc2l0aXZlSW50ZWdlciwgaXNWYWxpZERhdGFUeXBlLCBpc1ZhbGlkRmlsdGVyVHlwZSwgaXNWYWxpZFdyYXBUeXBlLCB2YWxpZERhdGFUeXBlcywgdmFsaWRGaWx0ZXJUeXBlcywgdmFsaWRXcmFwVHlwZXMgfSBmcm9tICcuL0NoZWNrcyc7XG5pbXBvcnQge1xuXHRIQUxGX0ZMT0FULCBGTE9BVCwgVU5TSUdORURfQllURSwgQllURSwgVU5TSUdORURfU0hPUlQsIFNIT1JULCBVTlNJR05FRF9JTlQsIElOVCxcblx0TkVBUkVTVCwgTElORUFSLCBDTEFNUF9UT19FREdFLFxuXHREYXRhTGF5ZXJBcnJheVR5cGUsIERhdGFMYXllckZpbHRlclR5cGUsIERhdGFMYXllck51bUNvbXBvbmVudHMsIERhdGFMYXllclR5cGUsIERhdGFMYXllcldyYXBUeXBlLCBHTFNMVmVyc2lvbiwgR0xTTDMsIEdMU0wxLFxuIH0gZnJvbSAnLi9Db25zdGFudHMnO1xuaW1wb3J0IHtcblx0Z2V0RXh0ZW5zaW9uLFxuXHRFWFRfQ09MT1JfQlVGRkVSX0ZMT0FULFxuXHRPRVNfVEVYVFVSRV9GTE9BVCxcblx0T0VTX1RFWFRVUkVfRkxPQVRfTElORUFSLFxuXHRPRVNfVEVYVFVSRV9IQUxGX0ZMT0FULFxuXHRPRVNfVEVYVFVSRV9IQWxGX0ZMT0FUX0xJTkVBUixcbn0gZnJvbSAnLi9leHRlbnNpb25zJztcbmltcG9ydCB7IGlzV2ViR0wyIH0gZnJvbSAnLi91dGlscyc7XG5cbmV4cG9ydCB0eXBlIERhdGFMYXllckJ1ZmZlciA9IHtcblx0dGV4dHVyZTogV2ViR0xUZXh0dXJlLFxuXHRmcmFtZWJ1ZmZlcj86IFdlYkdMRnJhbWVidWZmZXIsXG59XG5cbnR5cGUgRXJyb3JDYWxsYmFjayA9IChtZXNzYWdlOiBzdHJpbmcpID0+IHZvaWQ7XG5cbmV4cG9ydCBjbGFzcyBEYXRhTGF5ZXIge1xuXHRyZWFkb25seSBuYW1lOiBzdHJpbmc7XG5cdHByaXZhdGUgcmVhZG9ubHkgZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCB8IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQ7XG5cdHByaXZhdGUgcmVhZG9ubHkgZXJyb3JDYWxsYmFjazogRXJyb3JDYWxsYmFjaztcblxuXHQvLyBFYWNoIERhdGFMYXllciBtYXkgY29udGFpbiBhIG51bWJlciBvZiBidWZmZXJzIHRvIHN0b3JlIGRpZmZlcmVudCBpbnN0YW5jZXMgb2YgdGhlIHN0YXRlLlxuXHRwcml2YXRlIF9idWZmZXJJbmRleCA9IDA7XG5cdHJlYWRvbmx5IG51bUJ1ZmZlcnM7XG5cdHByaXZhdGUgcmVhZG9ubHkgYnVmZmVyczogRGF0YUxheWVyQnVmZmVyW10gPSBbXTtcblxuXHQvLyBUZXh0dXJlIHNpemVzLlxuXHRwcml2YXRlIGxlbmd0aD86IG51bWJlcjsgLy8gVGhpcyBpcyBvbmx5IHVzZWQgZm9yIDFEIGRhdGEgbGF5ZXJzLlxuXHRwcml2YXRlIHdpZHRoOiBudW1iZXI7XG5cdHByaXZhdGUgaGVpZ2h0OiBudW1iZXI7XG5cblx0Ly8gRGF0YUxheWVyIHNldHRpbmdzLlxuXHRyZWFkb25seSB0eXBlOiBEYXRhTGF5ZXJUeXBlOyAvLyBJbnB1dCB0eXBlIHBhc3NlZCBpbiBkdXJpbmcgc2V0dXAuXG5cdHJlYWRvbmx5IGludGVybmFsVHlwZTogRGF0YUxheWVyVHlwZTsgLy8gVHlwZSB0aGF0IGNvcnJlc3BvbmRzIHRvIGdsVHlwZSwgbWF5IGJlIGRpZmZlcmVudCBmcm9tIHR5cGUuXG5cdHJlYWRvbmx5IHdyYXBTOiBEYXRhTGF5ZXJXcmFwVHlwZTsgLy8gSW5wdXQgd3JhcCB0eXBlIHBhc3NlZCBpbiBkdXJpbmcgc2V0dXAuXG5cdHJlYWRvbmx5IHdyYXBUOiBEYXRhTGF5ZXJXcmFwVHlwZTsgLy8gSW5wdXQgd3JhcCB0eXBlIHBhc3NlZCBpbiBkdXJpbmcgc2V0dXAuXG5cdHJlYWRvbmx5IGludGVybmFsV3JhcFM6IERhdGFMYXllcldyYXBUeXBlOyAvLyBXcmFwIHR5cGUgdGhhdCBjb3JyZXNwb25kcyB0byBnbFdyYXBTLCBtYXkgYmUgZGlmZmVyZW50IGZyb20gd3JhcFMuXG5cdHJlYWRvbmx5IGludGVybmFsV3JhcFQ6IERhdGFMYXllcldyYXBUeXBlOyAvLyBXcmFwIHR5cGUgdGhhdCBjb3JyZXNwb25kcyB0byBnbFdyYXBULCBtYXkgYmUgZGlmZmVyZW50IGZyb20gd3JhcFQuXG5cdHJlYWRvbmx5IG51bUNvbXBvbmVudHM6IERhdGFMYXllck51bUNvbXBvbmVudHM7IC8vIE51bWJlciBvZiBSR0JBIGNoYW5uZWxzIHRvIHVzZSBmb3IgdGhpcyBEYXRhTGF5ZXIuXG5cdHJlYWRvbmx5IGZpbHRlcjogRGF0YUxheWVyRmlsdGVyVHlwZTsgLy8gSW50ZXJwb2xhdGlvbiBmaWx0ZXIgdHlwZSBvZiBkYXRhLlxuXHRyZWFkb25seSBpbnRlcm5hbEZpbHRlcjogRGF0YUxheWVyRmlsdGVyVHlwZTsgLy8gRmlsdGVyIHR5cGUgdGhhdCBjb3JyZXNwb25kcyB0byBnbEZpbHRlciwgbWF5IGJlIGRpZmZlcmVudCBmcm9tIGZpbHRlci5cblx0cmVhZG9ubHkgd3JpdGFibGU6IGJvb2xlYW47XG5cblx0Ly8gT3B0aW1pemF0aW9ucyBzbyB0aGF0IFwiY29weWluZ1wiIGNhbiBoYXBwZW4gd2l0aG91dCBkcmF3IGNhbGxzLlxuXHRwcml2YXRlIHRleHR1cmVPdmVycmlkZXM/OiAoV2ViR0xUZXh0dXJlIHwgdW5kZWZpbmVkKVtdO1xuXG5cdC8vIEdMIHZhcmlhYmxlcyAodGhlc2UgbWF5IGJlIGRpZmZlcmVudCBmcm9tIHRoZWlyIGNvcnJlc3BvbmRpbmcgbm9uLWdsIHBhcmFtZXRlcnMpLlxuXHRyZWFkb25seSBnbEludGVybmFsRm9ybWF0OiBudW1iZXI7XG5cdHJlYWRvbmx5IGdsRm9ybWF0OiBudW1iZXI7XG5cdHJlYWRvbmx5IGdsVHlwZTogbnVtYmVyO1xuXHRyZWFkb25seSBnbE51bUNoYW5uZWxzOiBudW1iZXI7XG5cdHJlYWRvbmx5IGdsV3JhcFM6IG51bWJlcjtcblx0cmVhZG9ubHkgZ2xXcmFwVDogbnVtYmVyO1xuXHRyZWFkb25seSBnbEZpbHRlcjogbnVtYmVyO1xuXG5cdGNvbnN0cnVjdG9yKFxuXHRcdHBhcmFtczoge1xuXHRcdFx0Z2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCB8IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQsXG5cdFx0XHRuYW1lOiBzdHJpbmcsXG5cdFx0XHRkaW1lbnNpb25zOiBudW1iZXIgfCBbbnVtYmVyLCBudW1iZXJdLFxuXHRcdFx0dHlwZTogRGF0YUxheWVyVHlwZSxcblx0XHRcdG51bUNvbXBvbmVudHM6IERhdGFMYXllck51bUNvbXBvbmVudHMsXG5cdFx0XHRnbHNsVmVyc2lvbjogR0xTTFZlcnNpb24sXG5cdFx0XHRkYXRhPzogRGF0YUxheWVyQXJyYXlUeXBlLFxuXHRcdFx0ZmlsdGVyPzogRGF0YUxheWVyRmlsdGVyVHlwZSxcblx0XHRcdHdyYXBTPzogRGF0YUxheWVyV3JhcFR5cGUsXG5cdFx0XHR3cmFwVD86IERhdGFMYXllcldyYXBUeXBlLFxuXHRcdFx0d3JpdGFibGU/OiBib29sZWFuLFxuXHRcdFx0bnVtQnVmZmVycz86IG51bWJlcixcblx0XHRcdGVycm9yQ2FsbGJhY2s6IEVycm9yQ2FsbGJhY2ssXG5cdFx0fSxcblx0KSB7XG5cdFx0Y29uc3QgeyBnbCwgZXJyb3JDYWxsYmFjaywgbmFtZSwgZGltZW5zaW9ucywgdHlwZSwgbnVtQ29tcG9uZW50cywgZGF0YSwgZ2xzbFZlcnNpb24gfSA9IHBhcmFtcztcblxuXHRcdC8vIFNhdmUgcGFyYW1zLlxuXHRcdHRoaXMubmFtZSA9IG5hbWU7XG5cdFx0dGhpcy5nbCA9IGdsO1xuXHRcdHRoaXMuZXJyb3JDYWxsYmFjayA9IGVycm9yQ2FsbGJhY2s7XG5cblx0XHQvLyBudW1Db21wb25lbnRzIG11c3QgYmUgYmV0d2VlbiAxIGFuZCA0LlxuXHRcdGlmICghaXNQb3NpdGl2ZUludGVnZXIobnVtQ29tcG9uZW50cykgfHwgbnVtQ29tcG9uZW50cyA+IDQpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBudW1Db21wb25lbnRzICR7bnVtQ29tcG9uZW50c30gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHR9XG5cdFx0dGhpcy5udW1Db21wb25lbnRzID0gbnVtQ29tcG9uZW50cztcblxuXHRcdC8vIHdyaXRhYmxlIGRlZmF1bHRzIHRvIGZhbHNlLlxuXHRcdGNvbnN0IHdyaXRhYmxlID0gISFwYXJhbXMud3JpdGFibGU7XG5cdFx0dGhpcy53cml0YWJsZSA9IHdyaXRhYmxlO1xuXG5cdFx0Ly8gU2V0IGRpbWVuc2lvbnMsIG1heSBiZSAxRCBvciAyRC5cblx0XHRjb25zdCB7IGxlbmd0aCwgd2lkdGgsIGhlaWdodCB9ID0gRGF0YUxheWVyLmNhbGNTaXplKGRpbWVuc2lvbnMsIG5hbWUpO1xuXHRcdHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xuXHRcdGlmICghaXNQb3NpdGl2ZUludGVnZXIod2lkdGgpKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgd2lkdGggJHt3aWR0aH0gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHR9XG5cdFx0dGhpcy53aWR0aCA9IHdpZHRoO1xuXHRcdGlmICghaXNQb3NpdGl2ZUludGVnZXIoaGVpZ2h0KSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGxlbmd0aCAke2hlaWdodH0gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHR9XG5cdFx0dGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG5cblx0XHQvLyBTZXQgZmlsdGVyaW5nIC0gaWYgd2UgYXJlIHByb2Nlc3NpbmcgYSAxRCBhcnJheSwgZGVmYXVsdCB0byBORUFSRVNUIGZpbHRlcmluZy5cblx0XHQvLyBFbHNlIGRlZmF1bHQgdG8gTElORUFSIChpbnRlcnBvbGF0aW9uKSBmaWx0ZXJpbmcuXG5cdFx0Y29uc3QgZmlsdGVyID0gcGFyYW1zLmZpbHRlciAhPT0gdW5kZWZpbmVkID8gcGFyYW1zLmZpbHRlciA6IChsZW5ndGggPyBORUFSRVNUIDogTElORUFSKTtcblx0XHRpZiAoIWlzVmFsaWRGaWx0ZXJUeXBlKGZpbHRlcikpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBmaWx0ZXI6ICR7ZmlsdGVyfSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLCBtdXN0IGJlICR7dmFsaWRGaWx0ZXJUeXBlcy5qb2luKCcsICcpfS5gKTtcblx0XHR9XG5cdFx0dGhpcy5maWx0ZXIgPSBmaWx0ZXI7XG5cblx0XHQvLyBHZXQgd3JhcCB0eXBlcywgZGVmYXVsdCB0byBjbGFtcCB0byBlZGdlLlxuXHRcdGNvbnN0IHdyYXBTID0gcGFyYW1zLndyYXBTICE9PSB1bmRlZmluZWQgPyBwYXJhbXMud3JhcFMgOiBDTEFNUF9UT19FREdFO1xuXHRcdGlmICghaXNWYWxpZFdyYXBUeXBlKHdyYXBTKSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHdyYXBTOiAke3dyYXBTfSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLCBtdXN0IGJlICR7dmFsaWRXcmFwVHlwZXMuam9pbignLCAnKX0uYCk7XG5cdFx0fVxuXHRcdHRoaXMud3JhcFMgPSB3cmFwUztcblx0XHRjb25zdCB3cmFwVCA9IHBhcmFtcy53cmFwVCAhPT0gdW5kZWZpbmVkID8gcGFyYW1zLndyYXBUIDogQ0xBTVBfVE9fRURHRTtcblx0XHRpZiAoIWlzVmFsaWRXcmFwVHlwZSh3cmFwVCkpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB3cmFwVDogJHt3cmFwVH0gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIiwgbXVzdCBiZSAke3ZhbGlkV3JhcFR5cGVzLmpvaW4oJywgJyl9LmApO1xuXHRcdH1cblx0XHR0aGlzLndyYXBUID0gd3JhcFQ7XG5cblx0XHQvLyBTZXQgZGF0YSB0eXBlLlxuXHRcdGlmICghaXNWYWxpZERhdGFUeXBlKHR5cGUpKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdHlwZSAke3R5cGV9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIsIG11c3QgYmUgb25lIG9mICR7dmFsaWREYXRhVHlwZXMuam9pbignLCAnKX0uYCk7XG5cdFx0fVxuXHRcdHRoaXMudHlwZSA9IHR5cGU7XG5cdFx0Y29uc3QgaW50ZXJuYWxUeXBlID0gRGF0YUxheWVyLmdldEludGVybmFsVHlwZSh7XG5cdFx0XHRnbCxcblx0XHRcdHR5cGUsXG5cdFx0XHRnbHNsVmVyc2lvbixcblx0XHRcdHdyaXRhYmxlLFxuXHRcdFx0ZmlsdGVyLFxuXHRcdFx0bmFtZSxcblx0XHRcdGVycm9yQ2FsbGJhY2ssXG5cdFx0fSk7XG5cdFx0dGhpcy5pbnRlcm5hbFR5cGUgPSBpbnRlcm5hbFR5cGU7XG5cdFx0Ly8gU2V0IGdsIHRleHR1cmUgcGFyYW1ldGVycy5cblx0XHRjb25zdCB7XG5cdFx0XHRnbEZvcm1hdCxcblx0XHRcdGdsSW50ZXJuYWxGb3JtYXQsXG5cdFx0XHRnbFR5cGUsXG5cdFx0XHRnbE51bUNoYW5uZWxzLFxuXHRcdH0gPSBEYXRhTGF5ZXIuZ2V0R0xUZXh0dXJlUGFyYW1ldGVycyh7XG5cdFx0XHRnbCxcblx0XHRcdG5hbWUsXG5cdFx0XHRudW1Db21wb25lbnRzLFxuXHRcdFx0d3JpdGFibGUsXG5cdFx0XHRpbnRlcm5hbFR5cGUsXG5cdFx0XHRnbHNsVmVyc2lvbixcblx0XHRcdGVycm9yQ2FsbGJhY2ssXG5cdFx0fSk7XG5cdFx0dGhpcy5nbEludGVybmFsRm9ybWF0ID0gZ2xJbnRlcm5hbEZvcm1hdDtcblx0XHR0aGlzLmdsRm9ybWF0ID0gZ2xGb3JtYXQ7XG5cdFx0dGhpcy5nbFR5cGUgPSBnbFR5cGU7XG5cdFx0dGhpcy5nbE51bUNoYW5uZWxzID0gZ2xOdW1DaGFubmVscztcblxuXHRcdC8vIFNldCBpbnRlcm5hbCBmaWx0ZXJpbmcvd3JhcCB0eXBlcy5cblx0XHR0aGlzLmludGVybmFsRmlsdGVyID0gRGF0YUxheWVyLmdldEludGVybmFsRmlsdGVyKHsgZ2wsIGZpbHRlciwgaW50ZXJuYWxUeXBlLCBuYW1lLCBlcnJvckNhbGxiYWNrIH0pO1xuXHRcdHRoaXMuZ2xGaWx0ZXIgPSBnbFt0aGlzLmludGVybmFsRmlsdGVyXTtcblx0XHR0aGlzLmludGVybmFsV3JhcFMgPSBEYXRhTGF5ZXIuZ2V0SW50ZXJuYWxXcmFwKHsgZ2wsIHdyYXA6IHdyYXBTLCBuYW1lIH0pO1xuXHRcdHRoaXMuZ2xXcmFwUyA9IGdsW3RoaXMuaW50ZXJuYWxXcmFwU107XG5cdFx0dGhpcy5pbnRlcm5hbFdyYXBUID0gRGF0YUxheWVyLmdldEludGVybmFsV3JhcCh7IGdsLCB3cmFwOiB3cmFwVCwgbmFtZSB9KTtcblx0XHR0aGlzLmdsV3JhcFQgPSBnbFt0aGlzLmludGVybmFsV3JhcFRdO1xuXG5cdFx0Ly8gTnVtIGJ1ZmZlcnMgaXMgdGhlIG51bWJlciBvZiBzdGF0ZXMgdG8gc3RvcmUgZm9yIHRoaXMgZGF0YS5cblx0XHRjb25zdCBudW1CdWZmZXJzID0gcGFyYW1zLm51bUJ1ZmZlcnMgIT09IHVuZGVmaW5lZCA/IHBhcmFtcy5udW1CdWZmZXJzIDogMTtcblx0XHRpZiAoIWlzUG9zaXRpdmVJbnRlZ2VyKG51bUJ1ZmZlcnMpKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgbnVtQnVmZmVyczogJHtudW1CdWZmZXJzfSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLCBtdXN0IGJlIHBvc2l0aXZlIGludGVnZXIuYCk7XG5cdFx0fVxuXHRcdHRoaXMubnVtQnVmZmVycyA9IG51bUJ1ZmZlcnM7XG5cblx0XHR0aGlzLmluaXRCdWZmZXJzKGRhdGEpO1xuXHR9XG5cblx0cHJpdmF0ZSBzdGF0aWMgY2FsY1NpemUoZGltZW5zaW9uczogbnVtYmVyIHwgW251bWJlciwgbnVtYmVyXSwgbmFtZTogc3RyaW5nKSB7XG5cdFx0bGV0IGxlbmd0aCwgd2lkdGgsIGhlaWdodDtcblx0XHRpZiAoIWlzTmFOKGRpbWVuc2lvbnMgYXMgbnVtYmVyKSkge1xuXHRcdFx0aWYgKCFpc1Bvc2l0aXZlSW50ZWdlcihkaW1lbnNpb25zKSkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgbGVuZ3RoICR7ZGltZW5zaW9uc30gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdH1cblx0XHRcdGxlbmd0aCA9IGRpbWVuc2lvbnMgYXMgbnVtYmVyO1xuXHRcdFx0Ly8gQ2FsYyBwb3dlciBvZiB0d28gd2lkdGggYW5kIGhlaWdodCBmb3IgbGVuZ3RoLlxuXHRcdFx0bGV0IGV4cCA9IDE7XG5cdFx0XHRsZXQgcmVtYWluZGVyID0gbGVuZ3RoO1xuXHRcdFx0d2hpbGUgKHJlbWFpbmRlciA+IDIpIHtcblx0XHRcdFx0ZXhwKys7XG5cdFx0XHRcdHJlbWFpbmRlciAvPSAyO1xuXHRcdFx0fVxuXHRcdFx0d2lkdGggPSBNYXRoLnBvdygyLCBNYXRoLmZsb29yKGV4cCAvIDIpICsgZXhwICUgMik7XG5cdFx0XHRoZWlnaHQgPSBNYXRoLnBvdygyLCBNYXRoLmZsb29yKGV4cC8yKSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHdpZHRoID0gKGRpbWVuc2lvbnMgYXMgW251bWJlciwgbnVtYmVyXSlbMF07XG5cdFx0XHRpZiAoIWlzUG9zaXRpdmVJbnRlZ2VyKHdpZHRoKSkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgd2lkdGggJHt3aWR0aH0gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdH1cblx0XHRcdGhlaWdodCA9IChkaW1lbnNpb25zIGFzIFtudW1iZXIsIG51bWJlcl0pWzFdO1xuXHRcdFx0aWYgKCFpc1Bvc2l0aXZlSW50ZWdlcihoZWlnaHQpKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBoZWlnaHQgJHtoZWlnaHR9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIuYCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiB7IHdpZHRoLCBoZWlnaHQsIGxlbmd0aCB9O1xuXHR9XG5cblx0cHJpdmF0ZSBzdGF0aWMgZ2V0SW50ZXJuYWxXcmFwKFxuXHRcdHBhcmFtczoge1xuXHRcdFx0Z2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCB8IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQsXG5cdFx0XHR3cmFwOiBEYXRhTGF5ZXJXcmFwVHlwZSxcblx0XHRcdG5hbWU6IHN0cmluZyxcblx0XHR9LFxuXHQpIHtcblx0XHRjb25zdCB7IGdsLCB3cmFwLCBuYW1lIH0gPSBwYXJhbXM7XG5cdFx0Ly8gV2ViZ2wyLjAgc3VwcG9ydHMgYWxsIGNvbWJpbmF0aW9ucyBvZiB0eXBlcyBhbmQgZmlsdGVyaW5nLlxuXHRcdGlmIChpc1dlYkdMMihnbCkpIHtcblx0XHRcdHJldHVybiB3cmFwO1xuXHRcdH1cblx0XHQvLyBDTEFNUF9UT19FREdFIGlzIGFsd2F5cyBzdXBwb3J0ZWQuXG5cdFx0aWYgKHdyYXAgPT09IENMQU1QX1RPX0VER0UpIHtcblx0XHRcdHJldHVybiB3cmFwO1xuXHRcdH1cblx0XHRpZiAoIWlzV2ViR0wyKGdsKSkge1xuXHRcdFx0Ly8gVE9ETzogd2UgbWF5IHdhbnQgdG8gaGFuZGxlIHRoaXMgaW4gdGhlIGZyYWcgc2hhZGVyLlxuXHRcdFx0Ly8gUkVQRUFUIGFuZCBNSVJST1JfUkVQRUFUIHdyYXAgbm90IHN1cHBvcnRlZCBmb3Igbm9uLXBvd2VyIG9mIDIgdGV4dHVyZXMgaW4gc2FmYXJpLlxuXHRcdFx0Ly8gSSd2ZSB0ZXN0ZWQgdGhpcyBhbmQgaXQgc2VlbXMgdGhhdCBzb21lIHBvd2VyIG9mIDIgdGV4dHVyZXMgd2lsbCB3b3JrICg1MTIgeCA1MTIpLFxuXHRcdFx0Ly8gYnV0IG5vdCBvdGhlcnMgKDEwMjR4MTAyNCksIHNvIGxldCdzIGp1c3QgY2hhbmdlIGFsbCBXZWJHTCAxLjAgdG8gQ0xBTVAuXG5cdFx0XHQvLyBXaXRob3V0IHRoaXMsIHdlIGN1cnJlbnRseSBnZXQgYW4gZXJyb3IgYXQgZHJhd0FycmF5cygpOlxuXHRcdFx0Ly8gXCJXZWJHTDogZHJhd0FycmF5czogdGV4dHVyZSBib3VuZCB0byB0ZXh0dXJlIHVuaXQgMCBpcyBub3QgcmVuZGVyYWJsZS5cblx0XHRcdC8vIEl0IG1heWJlIG5vbi1wb3dlci1vZi0yIGFuZCBoYXZlIGluY29tcGF0aWJsZSB0ZXh0dXJlIGZpbHRlcmluZyBvciBpcyBub3Rcblx0XHRcdC8vICd0ZXh0dXJlIGNvbXBsZXRlJywgb3IgaXQgaXMgYSBmbG9hdC9oYWxmLWZsb2F0IHR5cGUgd2l0aCBsaW5lYXIgZmlsdGVyaW5nIGFuZFxuXHRcdFx0Ly8gd2l0aG91dCB0aGUgcmVsZXZhbnQgZmxvYXQvaGFsZi1mbG9hdCBsaW5lYXIgZXh0ZW5zaW9uIGVuYWJsZWQuXCJcblx0XHRcdGNvbnNvbGUud2FybihgRmFsbGluZyBiYWNrIHRvIENMQU1QX1RPX0VER0Ugd3JhcHBpbmcgZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIiBmb3IgV2ViR0wgMS5gKTtcblx0XHRcdHJldHVybiBDTEFNUF9UT19FREdFO1xuXHRcdH1cblx0XHRyZXR1cm4gd3JhcDtcblx0fVxuXG5cdHByaXZhdGUgc3RhdGljIGdldEludGVybmFsRmlsdGVyKFxuXHRcdHBhcmFtczoge1xuXHRcdFx0Z2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCB8IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQsXG5cdFx0XHRmaWx0ZXI6IERhdGFMYXllckZpbHRlclR5cGUsXG5cdFx0XHRpbnRlcm5hbFR5cGU6IERhdGFMYXllclR5cGUsXG5cdFx0XHRuYW1lOiBzdHJpbmcsXG5cdFx0XHRlcnJvckNhbGxiYWNrOiBFcnJvckNhbGxiYWNrLFxuXHRcdH0sXG5cdCkge1xuXHRcdGNvbnN0IHsgZ2wsIGVycm9yQ2FsbGJhY2ssIGludGVybmFsVHlwZSwgbmFtZSB9ID0gcGFyYW1zO1xuXHRcdGxldCB7IGZpbHRlciB9ID0gcGFyYW1zO1xuXHRcdGlmIChmaWx0ZXIgPT09IE5FQVJFU1QpIHtcblx0XHRcdC8vIE5FQVJFU1QgZmlsdGVyaW5nIGlzIGFsd2F5cyBzdXBwb3J0ZWQuXG5cdFx0XHRyZXR1cm4gZmlsdGVyO1xuXHRcdH1cblxuXHRcdGlmIChpbnRlcm5hbFR5cGUgPT09IEhBTEZfRkxPQVQpIHtcblx0XHRcdC8vIFRPRE86IHRlc3QgaWYgZmxvYXQgbGluZWFyIGV4dGVuc2lvbiBpcyBhY3R1YWxseSB3b3JraW5nLlxuXHRcdFx0Y29uc3QgZXh0ZW5zaW9uID0gZ2V0RXh0ZW5zaW9uKGdsLCBPRVNfVEVYVFVSRV9IQWxGX0ZMT0FUX0xJTkVBUiwgZXJyb3JDYWxsYmFjaywgdHJ1ZSlcblx0XHRcdFx0fHwgZ2V0RXh0ZW5zaW9uKGdsLCBPRVNfVEVYVFVSRV9GTE9BVF9MSU5FQVIsIGVycm9yQ2FsbGJhY2ssIHRydWUpO1xuXHRcdFx0aWYgKCFleHRlbnNpb24pIHtcblx0XHRcdFx0Y29uc29sZS53YXJuKGBGYWxsaW5nIGJhY2sgdG8gTkVBUkVTVCBmaWx0ZXIgZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdFx0Ly9UT0RPOiBhZGQgYSBmYWxsYmFjayB0aGF0IGRvZXMgdGhpcyBmaWx0ZXJpbmcgaW4gdGhlIGZyYWcgc2hhZGVyPy5cblx0XHRcdFx0ZmlsdGVyID0gTkVBUkVTVDtcblx0XHRcdH1cblx0XHR9IGlmIChpbnRlcm5hbFR5cGUgPT09IEZMT0FUKSB7XG5cdFx0XHRjb25zdCBleHRlbnNpb24gPSBnZXRFeHRlbnNpb24oZ2wsIE9FU19URVhUVVJFX0ZMT0FUX0xJTkVBUiwgZXJyb3JDYWxsYmFjaywgdHJ1ZSk7XG5cdFx0XHRpZiAoIWV4dGVuc2lvbikge1xuXHRcdFx0XHRjb25zb2xlLndhcm4oYEZhbGxpbmcgYmFjayB0byBORUFSRVNUIGZpbHRlciBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLmApO1xuXHRcdFx0XHQvL1RPRE86IGFkZCBhIGZhbGxiYWNrIHRoYXQgZG9lcyB0aGlzIGZpbHRlcmluZyBpbiB0aGUgZnJhZyBzaGFkZXI/LlxuXHRcdFx0XHRmaWx0ZXIgPSBORUFSRVNUO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gZmlsdGVyO1xuXHR9XG5cblx0cHJpdmF0ZSBzdGF0aWMgZ2V0SW50ZXJuYWxUeXBlKFxuXHRcdHBhcmFtczoge1xuXHRcdFx0Z2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCB8IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQsXG5cdFx0XHR0eXBlOiBEYXRhTGF5ZXJUeXBlLFxuXHRcdFx0Z2xzbFZlcnNpb246IEdMU0xWZXJzaW9uLFxuXHRcdFx0d3JpdGFibGU6IGJvb2xlYW4sXG5cdFx0XHRmaWx0ZXI6IERhdGFMYXllckZpbHRlclR5cGUsXG5cdFx0XHRuYW1lOiBzdHJpbmcsXG5cdFx0XHRlcnJvckNhbGxiYWNrOiBFcnJvckNhbGxiYWNrLFxuXHRcdH0sXG5cdCkge1xuXHRcdGNvbnN0IHsgZ2wsIGVycm9yQ2FsbGJhY2ssIHdyaXRhYmxlLCBuYW1lLCBnbHNsVmVyc2lvbiB9ID0gcGFyYW1zO1xuXHRcdGNvbnN0IHsgdHlwZSB9ID0gcGFyYW1zO1xuXHRcdGxldCBpbnRlcm5hbFR5cGUgPSB0eXBlO1xuXHRcdC8vIENoZWNrIGlmIGludCB0eXBlcyBhcmUgc3VwcG9ydGVkLlxuXHRcdGNvbnN0IGludENhc3QgPSBEYXRhTGF5ZXIuc2hvdWxkQ2FzdEludFR5cGVBc0Zsb2F0KHBhcmFtcyk7XG5cdFx0aWYgKGludENhc3QpIHtcblx0XHRcdGlmIChpbnRlcm5hbFR5cGUgPT09IFVOU0lHTkVEX0JZVEUgfHwgaW50ZXJuYWxUeXBlID09PSBCWVRFKSB7XG5cdFx0XHRcdC8vIEludGVnZXJzIGJldHdlZW4gMCBhbmQgMjA0OCBjYW4gYmUgZXhhY3RseSByZXByZXNlbnRlZCBieSBoYWxmIGZsb2F0IChhbmQgYWxzbyBiZXR3ZWVuIOKIkjIwNDggYW5kIDApXG5cdFx0XHRcdGludGVybmFsVHlwZSA9IEhBTEZfRkxPQVQ7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBJbnRlZ2VycyBiZXR3ZWVuIDAgYW5kIDE2Nzc3MjE2IGNhbiBiZSBleGFjdGx5IHJlcHJlc2VudGVkIGJ5IGZsb2F0MzIgKGFsc28gYXBwbGllcyBmb3IgbmVnYXRpdmUgaW50ZWdlcnMgYmV0d2VlbiDiiJIxNjc3NzIxNiBhbmQgMClcblx0XHRcdFx0Ly8gVGhpcyBpcyBzdWZmaWNpZW50IGZvciBVTlNJR05FRF9TSE9SVCBhbmQgU0hPUlQgdHlwZXMuXG5cdFx0XHRcdC8vIExhcmdlIFVOU0lHTkVEX0lOVCBhbmQgSU5UIGNhbm5vdCBiZSByZXByZXNlbnRlZCBieSBGTE9BVCB0eXBlLlxuXHRcdFx0XHRpZiAoaW50ZXJuYWxUeXBlID09PSBJTlQgfHwgaW50ZXJuYWxUeXBlID09PSBVTlNJR05FRF9JTlQpIHtcblx0XHRcdFx0XHRcblx0XHRcdFx0fVxuXHRcdFx0XHRjb25zb2xlLndhcm4oYEZhbGxpbmcgYmFjayAke2ludGVybmFsVHlwZX0gdHlwZSB0byBGTE9BVCB0eXBlIGZvciBnbHNsMS54IHN1cHBvcnQgZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5cbkxhcmdlIFVOU0lHTkVEX0lOVCBvciBJTlQgd2l0aCBhYnNvbHV0ZSB2YWx1ZSA+IDE2LDc3NywyMTYgYXJlIG5vdCBzdXBwb3J0ZWQsIG9uIG1vYmlsZSBVTlNJR05FRF9JTlQsIElOVCwgVU5TSUdORURfU0hPUlQsIGFuZCBTSE9SVCB3aXRoIGFic29sdXRlIHZhbHVlID4gMiwwNDggbWF5IG5vdCBiZSBzdXBwb3J0ZWQuYCk7XG5cdFx0XHRcdGludGVybmFsVHlwZSA9IEZMT0FUO1xuXHRcdFx0fVxuXHRcdH1cblx0XHQvLyBDaGVjayBpZiBmbG9hdDMyIHN1cHBvcnRlZC5cblx0XHRpZiAoIWlzV2ViR0wyKGdsKSkge1xuXHRcdFx0aWYgKGludGVybmFsVHlwZSA9PT0gRkxPQVQpIHtcblx0XHRcdFx0Y29uc3QgZXh0ZW5zaW9uID0gZ2V0RXh0ZW5zaW9uKGdsLCBPRVNfVEVYVFVSRV9GTE9BVCwgZXJyb3JDYWxsYmFjaywgdHJ1ZSk7XG5cdFx0XHRcdGlmICghZXh0ZW5zaW9uKSB7XG5cdFx0XHRcdFx0Y29uc29sZS53YXJuKGBGTE9BVCBub3Qgc3VwcG9ydGVkLCBmYWxsaW5nIGJhY2sgdG8gSEFMRl9GTE9BVCB0eXBlIGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIuYCk7XG5cdFx0XHRcdFx0aW50ZXJuYWxUeXBlID0gSEFMRl9GTE9BVDtcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xNzQ3NjYzMi93ZWJnbC1leHRlbnNpb24tc3VwcG9ydC1hY3Jvc3MtYnJvd3NlcnNcblx0XHRcdFx0Ly8gUmVuZGVyaW5nIHRvIGEgZmxvYXRpbmctcG9pbnQgdGV4dHVyZSBtYXkgbm90IGJlIHN1cHBvcnRlZCxcblx0XHRcdFx0Ly8gZXZlbiBpZiB0aGUgT0VTX3RleHR1cmVfZmxvYXQgZXh0ZW5zaW9uIGlzIHN1cHBvcnRlZC5cblx0XHRcdFx0Ly8gVHlwaWNhbGx5LCB0aGlzIGZhaWxzIG9uIGN1cnJlbnQgbW9iaWxlIGhhcmR3YXJlLlxuXHRcdFx0XHQvLyBUbyBjaGVjayBpZiB0aGlzIGlzIHN1cHBvcnRlZCwgeW91IGhhdmUgdG8gY2FsbCB0aGUgV2ViR0xcblx0XHRcdFx0Ly8gY2hlY2tGcmFtZWJ1ZmZlclN0YXR1cygpIGZ1bmN0aW9uLlxuXHRcdFx0XHRpZiAod3JpdGFibGUpIHtcblx0XHRcdFx0XHRjb25zdCB2YWxpZCA9IERhdGFMYXllci50ZXN0RnJhbWVidWZmZXJXcml0ZSh7IGdsLCB0eXBlOiBpbnRlcm5hbFR5cGUsIGdsc2xWZXJzaW9uIH0pO1xuXHRcdFx0XHRcdGlmICghdmFsaWQgJiYgaW50ZXJuYWxUeXBlICE9PSBIQUxGX0ZMT0FUKSB7XG5cdFx0XHRcdFx0XHRjb25zb2xlLndhcm4oYEZMT0FUIG5vdCBzdXBwb3J0ZWQgZm9yIHdyaXRpbmcgb3BlcmF0aW9ucywgZmFsbGluZyBiYWNrIHRvIEhBTEZfRkxPQVQgdHlwZSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLmApO1xuXHRcdFx0XHRcdFx0aW50ZXJuYWxUeXBlID0gSEFMRl9GTE9BVDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdC8vIE11c3Qgc3VwcG9ydCBhdCBsZWFzdCBoYWxmIGZsb2F0IGlmIHVzaW5nIGEgZmxvYXQgdHlwZS5cblx0XHRcdGlmIChpbnRlcm5hbFR5cGUgPT09IEhBTEZfRkxPQVQpIHtcblx0XHRcdFx0Z2V0RXh0ZW5zaW9uKGdsLCBPRVNfVEVYVFVSRV9IQUxGX0ZMT0FULCBlcnJvckNhbGxiYWNrKTtcblx0XHRcdFx0Ly8gVE9ETzogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTQyNDg2MzMvY2Fubm90LWNyZWF0ZS1oYWxmLWZsb2F0LW9lcy10ZXh0dXJlLWZyb20tdWludDE2YXJyYXktb24taXBhZFxuXHRcdFx0XHRpZiAod3JpdGFibGUpIHtcblx0XHRcdFx0XHRjb25zdCB2YWxpZCA9IERhdGFMYXllci50ZXN0RnJhbWVidWZmZXJXcml0ZSh7IGdsLCB0eXBlOiBpbnRlcm5hbFR5cGUsIGdsc2xWZXJzaW9uIH0pO1xuXHRcdFx0XHRcdGlmICghdmFsaWQpIHtcblx0XHRcdFx0XHRcdGVycm9yQ2FsbGJhY2soYFRoaXMgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IHJlbmRlcmluZyB0byBIQUxGX0ZMT0FUIHRleHR1cmVzLmApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRcblx0XHQvLyBMb2FkIGFkZGl0aW9uYWwgZXh0ZW5zaW9ucyBpZiBuZWVkZWQuXG5cdFx0aWYgKHdyaXRhYmxlICYmIGlzV2ViR0wyKGdsKSAmJiAoaW50ZXJuYWxUeXBlID09PSBIQUxGX0ZMT0FUIHx8IGludGVybmFsVHlwZSA9PT0gRkxPQVQpKSB7XG5cdFx0XHRnZXRFeHRlbnNpb24oZ2wsIEVYVF9DT0xPUl9CVUZGRVJfRkxPQVQsIGVycm9yQ2FsbGJhY2spO1xuXHRcdH1cblx0XHRyZXR1cm4gaW50ZXJuYWxUeXBlO1xuXHR9XG5cblx0cHJpdmF0ZSBzdGF0aWMgc2hvdWxkQ2FzdEludFR5cGVBc0Zsb2F0KFxuXHRcdHBhcmFtczoge1xuXHRcdFx0Z2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCB8IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQsXG5cdFx0XHR0eXBlOiBEYXRhTGF5ZXJUeXBlLFxuXHRcdFx0ZmlsdGVyOiBEYXRhTGF5ZXJGaWx0ZXJUeXBlLFxuXHRcdFx0Z2xzbFZlcnNpb246IEdMU0xWZXJzaW9uLFxuXHRcdH1cblx0KSB7XG5cdFx0Y29uc3QgeyBnbCwgdHlwZSwgZmlsdGVyLCBnbHNsVmVyc2lvbiB9ID0gcGFyYW1zO1xuXHRcdGlmIChnbHNsVmVyc2lvbiA9PT0gR0xTTDMgJiYgaXNXZWJHTDIoZ2wpKSByZXR1cm4gZmFsc2U7XG5cdFx0Ly8gVU5TSUdORURfQllURSBhbmQgTElORUFSIGZpbHRlcmluZyBpcyBub3Qgc3VwcG9ydGVkLCBjYXN0IGFzIGZsb2F0LlxuXHRcdGlmICh0eXBlID09PSBVTlNJR05FRF9CWVRFICYmIGZpbHRlciA9PT0gTElORUFSKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0Ly8gSW50IHRleHR1cmVzIChvdGhlciB0aGFuIFVOU0lHTkVEX0JZVEUpIGFyZSBub3Qgc3VwcG9ydGVkIGJ5IFdlYkdMMS4wIG9yIGdsc2wxLnguXG5cdFx0Ly8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTU4MDMwMTcvaG93LXRvLXNlbGVjdC13ZWJnbC1nbHNsLXNhbXBsZXItdHlwZS1mcm9tLXRleHR1cmUtZm9ybWF0LXByb3BlcnRpZXNcblx0XHQvLyBVc2UgSEFMRl9GTE9BVC9GTE9BVCBpbnN0ZWFkLlxuXHRcdHJldHVybiB0eXBlID09PSBCWVRFIHx8IHR5cGUgPT09IFNIT1JUIHx8IHR5cGUgPT09IElOVCB8fCB0eXBlID09PSBVTlNJR05FRF9TSE9SVCB8fCB0eXBlID09PSBVTlNJR05FRF9JTlQ7XG5cdH1cblxuXHRwcml2YXRlIHN0YXRpYyBnZXRHTFRleHR1cmVQYXJhbWV0ZXJzKFxuXHRcdHBhcmFtczoge1xuXHRcdFx0Z2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCB8IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQsXG5cdFx0XHRuYW1lOiBzdHJpbmcsXG5cdFx0XHRudW1Db21wb25lbnRzOiBEYXRhTGF5ZXJOdW1Db21wb25lbnRzLFxuXHRcdFx0aW50ZXJuYWxUeXBlOiBEYXRhTGF5ZXJUeXBlLFxuXHRcdFx0d3JpdGFibGU6IGJvb2xlYW4sXG5cdFx0XHRnbHNsVmVyc2lvbjogR0xTTFZlcnNpb24sXG5cdFx0XHRlcnJvckNhbGxiYWNrOiBFcnJvckNhbGxiYWNrLFxuXHRcdH1cblx0KSB7XG5cdFx0Y29uc3QgeyBnbCwgZXJyb3JDYWxsYmFjaywgbmFtZSwgbnVtQ29tcG9uZW50cywgaW50ZXJuYWxUeXBlLCB3cml0YWJsZSwgZ2xzbFZlcnNpb24gfSA9IHBhcmFtcztcblx0XHQvLyBodHRwczovL3d3dy5raHJvbm9zLm9yZy9yZWdpc3RyeS93ZWJnbC9zcGVjcy9sYXRlc3QvMi4wLyNURVhUVVJFX1RZUEVTX0ZPUk1BVFNfRlJPTV9ET01fRUxFTUVOVFNfVEFCTEVcblx0XHRsZXQgZ2xUeXBlOiBudW1iZXIgfCB1bmRlZmluZWQsXG5cdFx0XHRnbEZvcm1hdDogbnVtYmVyIHwgdW5kZWZpbmVkLFxuXHRcdFx0Z2xJbnRlcm5hbEZvcm1hdDogbnVtYmVyIHwgdW5kZWZpbmVkLFxuXHRcdFx0Z2xOdW1DaGFubmVsczogbnVtYmVyIHwgdW5kZWZpbmVkO1xuXG5cdFx0aWYgKGlzV2ViR0wyKGdsKSkge1xuXHRcdFx0Z2xOdW1DaGFubmVscyA9IG51bUNvbXBvbmVudHM7XG5cdFx0XHQvLyBodHRwczovL3d3dy5raHJvbm9zLm9yZy9yZWdpc3RyeS93ZWJnbC9leHRlbnNpb25zL0VYVF9jb2xvcl9idWZmZXJfZmxvYXQvXG5cdFx0XHQvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvV2ViR0xSZW5kZXJpbmdDb250ZXh0L3RleEltYWdlMkRcblx0XHRcdC8vIFRoZSBzaXplZCBpbnRlcm5hbCBmb3JtYXQgUkdCeHh4IGFyZSBub3QgY29sb3ItcmVuZGVyYWJsZSBmb3Igc29tZSByZWFzb24uXG5cdFx0XHQvLyBJZiBudW1Db21wb25lbnRzID09IDMgZm9yIGEgd3JpdGFibGUgdGV4dHVyZSwgdXNlIFJHQkEgaW5zdGVhZC5cblx0XHRcdC8vIFBhZ2UgNSBvZiBodHRwczovL3d3dy5raHJvbm9zLm9yZy9maWxlcy93ZWJnbDIwLXJlZmVyZW5jZS1ndWlkZS5wZGZcblx0XHRcdGlmIChudW1Db21wb25lbnRzID09PSAzICYmIHdyaXRhYmxlKSB7XG5cdFx0XHRcdGdsTnVtQ2hhbm5lbHMgPSA0O1xuXHRcdFx0fVxuXHRcdFx0aWYgKGludGVybmFsVHlwZSA9PT0gRkxPQVQgfHwgaW50ZXJuYWxUeXBlID09PSBIQUxGX0ZMT0FUKSB7XG5cdFx0XHRcdHN3aXRjaCAoZ2xOdW1DaGFubmVscykge1xuXHRcdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0XHRcdGdsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJFRDtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgMjpcblx0XHRcdFx0XHRcdGdsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHRcdFx0Z2xGb3JtYXQgPSBnbC5SR0I7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDQ6XG5cdFx0XHRcdFx0XHRnbEZvcm1hdCA9IGdsLlJHQkE7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBnbE51bUNoYW5uZWxzICR7Z2xOdW1DaGFubmVsc30gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmIChnbHNsVmVyc2lvbiA9PT0gR0xTTDEgJiYgaW50ZXJuYWxUeXBlID09PSBVTlNJR05FRF9CWVRFKSB7XG5cdFx0XHRcdHN3aXRjaCAoZ2xOdW1DaGFubmVscykge1xuXHRcdFx0XHRcdC8vIEZvciByZWFkIG9ubHkgdGV4dHVyZXMgaW4gV2ViR0wgMS4wLCB1c2UgZ2wuQUxQSEEgYW5kIGdsLkxVTUlOQU5DRV9BTFBIQS5cblx0XHRcdFx0XHQvLyBPdGhlcndpc2UgdXNlIFJHQi9SR0JBLlxuXHRcdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0XHRcdGlmICghd3JpdGFibGUpIHtcblx0XHRcdFx0XHRcdFx0Z2xGb3JtYXQgPSBnbC5BTFBIQTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdFx0aWYgKCF3cml0YWJsZSkge1xuXHRcdFx0XHRcdFx0XHRnbEZvcm1hdCA9IGdsLkxVTUlOQU5DRV9BTFBIQTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHRcdFx0Z2xGb3JtYXQgPSBnbC5SR0I7XG5cdFx0XHRcdFx0XHRnbE51bUNoYW5uZWxzID0gMztcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgNDpcblx0XHRcdFx0XHRcdGdsRm9ybWF0ID0gZ2wuUkdCQTtcblx0XHRcdFx0XHRcdGdsTnVtQ2hhbm5lbHMgPSA0O1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgZ2xOdW1DaGFubmVscyAke2dsTnVtQ2hhbm5lbHN9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIuYCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHN3aXRjaCAoZ2xOdW1DaGFubmVscykge1xuXHRcdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0XHRcdGdsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJFRF9JTlRFR0VSO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdFx0Z2xGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkdfSU5URUdFUjtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgMzpcblx0XHRcdFx0XHRcdGdsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHQl9JTlRFR0VSO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSA0OlxuXHRcdFx0XHRcdFx0Z2xGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkdCQV9JTlRFR0VSO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgZ2xOdW1DaGFubmVscyAke2dsTnVtQ2hhbm5lbHN9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIuYCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHN3aXRjaCAoaW50ZXJuYWxUeXBlKSB7XG5cdFx0XHRcdGNhc2UgSEFMRl9GTE9BVDpcblx0XHRcdFx0XHRnbFR5cGUgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuSEFMRl9GTE9BVDtcblx0XHRcdFx0XHRzd2l0Y2ggKGdsTnVtQ2hhbm5lbHMpIHtcblx0XHRcdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SMTZGO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgMjpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SRzE2Rjtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDM6XG5cdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkdCMTZGO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgNDpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR0JBMTZGO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgZ2xOdW1DaGFubmVscyAke2dsTnVtQ2hhbm5lbHN9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIuYCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIEZMT0FUOlxuXHRcdFx0XHRcdGdsVHlwZSA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5GTE9BVDtcblx0XHRcdFx0XHRzd2l0Y2ggKGdsTnVtQ2hhbm5lbHMpIHtcblx0XHRcdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SMzJGO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgMjpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SRzMyRjtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDM6XG5cdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkdCMzJGO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgNDpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR0JBMzJGO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgZ2xOdW1DaGFubmVscyAke2dsTnVtQ2hhbm5lbHN9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIuYCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFVOU0lHTkVEX0JZVEU6XG5cdFx0XHRcdFx0Z2xUeXBlID0gZ2wuVU5TSUdORURfQllURTtcblx0XHRcdFx0XHRpZiAoZ2xzbFZlcnNpb24gPT09IEdMU0wxICYmIGludGVybmFsVHlwZSA9PT0gVU5TSUdORURfQllURSkge1xuXHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IGdsRm9ybWF0O1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRzd2l0Y2ggKGdsTnVtQ2hhbm5lbHMpIHtcblx0XHRcdFx0XHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUjhVSTtcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkc4VUk7XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdGNhc2UgMzpcblx0XHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHQjhVSTtcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0Y2FzZSA0OlxuXHRcdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkdCQThVSTtcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGdsTnVtQ2hhbm5lbHMgJHtnbE51bUNoYW5uZWxzfSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLmApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBCWVRFOlxuXHRcdFx0XHRcdGdsVHlwZSA9IGdsLkJZVEU7XG5cdFx0XHRcdFx0c3dpdGNoIChnbE51bUNoYW5uZWxzKSB7XG5cdFx0XHRcdFx0XHRjYXNlIDE6XG5cdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUjhJO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgMjpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SRzhJO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgMzpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR0I4STtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDQ6XG5cdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkdCQThJO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgZ2xOdW1DaGFubmVscyAke2dsTnVtQ2hhbm5lbHN9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIuYCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFNIT1JUOlxuXHRcdFx0XHRcdGdsVHlwZSA9IGdsLlNIT1JUO1xuXHRcdFx0XHRcdHN3aXRjaCAoZ2xOdW1DaGFubmVscykge1xuXHRcdFx0XHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlIxNkk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHMTZJO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgMzpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR0IxNkk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSA0OlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHQkExNkk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBnbE51bUNoYW5uZWxzICR7Z2xOdW1DaGFubmVsc30gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgVU5TSUdORURfU0hPUlQ6XG5cdFx0XHRcdFx0Z2xUeXBlID0gZ2wuVU5TSUdORURfU0hPUlQ7XG5cdFx0XHRcdFx0c3dpdGNoIChnbE51bUNoYW5uZWxzKSB7XG5cdFx0XHRcdFx0XHRjYXNlIDE6XG5cdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUjE2VUk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHMTZVSTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDM6XG5cdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkdCMTZVSTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDQ6XG5cdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkdCQTE2VUk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBnbE51bUNoYW5uZWxzICR7Z2xOdW1DaGFubmVsc30gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgSU5UOlxuXHRcdFx0XHRcdGdsVHlwZSA9IGdsLklOVDtcblx0XHRcdFx0XHRzd2l0Y2ggKGdsTnVtQ2hhbm5lbHMpIHtcblx0XHRcdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SMzJJO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgMjpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SRzMySTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDM6XG5cdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkdCMzJJO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgNDpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR0JBMzJJO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgZ2xOdW1DaGFubmVscyAke2dsTnVtQ2hhbm5lbHN9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIuYCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFVOU0lHTkVEX0lOVDpcblx0XHRcdFx0XHRnbFR5cGUgPSBnbC5VTlNJR05FRF9JTlQ7XG5cdFx0XHRcdFx0c3dpdGNoIChnbE51bUNoYW5uZWxzKSB7XG5cdFx0XHRcdFx0XHRjYXNlIDE6XG5cdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUjMyVUk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHMzJVSTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDM6XG5cdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkdCMzJVSTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDQ6XG5cdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkdCQTMyVUk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBnbE51bUNoYW5uZWxzICR7Z2xOdW1DaGFubmVsc30gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCB0eXBlICR7aW50ZXJuYWxUeXBlfSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLmApO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRzd2l0Y2ggKG51bUNvbXBvbmVudHMpIHtcblx0XHRcdFx0Ly8gVE9ETzogZm9yIHJlYWQgb25seSB0ZXh0dXJlcyBpbiBXZWJHTCAxLjAsIHdlIGNvdWxkIHVzZSBnbC5BTFBIQSBhbmQgZ2wuTFVNSU5BTkNFX0FMUEhBIGhlcmUuXG5cdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0XHRpZiAoIXdyaXRhYmxlKSB7XG5cdFx0XHRcdFx0XHRnbEZvcm1hdCA9IGdsLkFMUEhBO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRjYXNlIDI6XG5cdFx0XHRcdFx0aWYgKCF3cml0YWJsZSkge1xuXHRcdFx0XHRcdFx0Z2xGb3JtYXQgPSBnbC5MVU1JTkFOQ0VfQUxQSEE7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdGNhc2UgMzpcblx0XHRcdFx0XHRnbEZvcm1hdCA9IGdsLlJHQjtcblx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gZ2wuUkdCO1xuXHRcdFx0XHRcdGdsTnVtQ2hhbm5lbHMgPSAzO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDQ6XG5cdFx0XHRcdFx0Z2xGb3JtYXQgPSBnbC5SR0JBO1xuXHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSBnbC5SR0JBO1xuXHRcdFx0XHRcdGdsTnVtQ2hhbm5lbHMgPSA0O1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgbnVtQ29tcG9uZW50cyAke251bUNvbXBvbmVudHN9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIuYCk7XG5cdFx0XHR9XG5cdFx0XHRzd2l0Y2ggKGludGVybmFsVHlwZSkge1xuXHRcdFx0XHRjYXNlIEZMT0FUOlxuXHRcdFx0XHRcdGdsVHlwZSA9IGdsLkZMT0FUO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIEhBTEZfRkxPQVQ6XG5cdFx0XHRcdFx0Z2xUeXBlID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLkhBTEZfRkxPQVQgfHwgZ2V0RXh0ZW5zaW9uKGdsLCBPRVNfVEVYVFVSRV9IQUxGX0ZMT0FULCBlcnJvckNhbGxiYWNrKS5IQUxGX0ZMT0FUX09FUyBhcyBudW1iZXI7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgVU5TSUdORURfQllURTpcblx0XHRcdFx0XHRnbFR5cGUgPSBnbC5VTlNJR05FRF9CWVRFO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHQvLyBObyBvdGhlciB0eXBlcyBhcmUgc3VwcG9ydGVkIGluIGdsc2wxLnhcblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIHR5cGUgJHtpbnRlcm5hbFR5cGV9IGluIFdlYkdMIDEuMCBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLmApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIENoZWNrIGZvciBtaXNzaW5nIHBhcmFtcy5cblx0XHRpZiAoZ2xUeXBlID09PSB1bmRlZmluZWQgfHwgZ2xGb3JtYXQgPT09IHVuZGVmaW5lZCB8fCBnbEludGVybmFsRm9ybWF0ID09PSB1bmRlZmluZWQpIHtcblx0XHRcdGNvbnN0IG1pc3NpbmdQYXJhbXMgPSBbXTtcblx0XHRcdGlmIChnbFR5cGUgPT09IHVuZGVmaW5lZCkgbWlzc2luZ1BhcmFtcy5wdXNoKCdnbFR5cGUnKTtcblx0XHRcdGlmIChnbEZvcm1hdCA9PT0gdW5kZWZpbmVkKSBtaXNzaW5nUGFyYW1zLnB1c2goJ2dsRm9ybWF0Jyk7XG5cdFx0XHRpZiAoZ2xJbnRlcm5hbEZvcm1hdCA9PT0gdW5kZWZpbmVkKSBtaXNzaW5nUGFyYW1zLnB1c2goJ2dsSW50ZXJuYWxGb3JtYXQnKTtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB0eXBlOiAke2ludGVybmFsVHlwZX0gZm9yIG51bUNvbXBvbmVudHMgJHtudW1Db21wb25lbnRzfSwgdW5hYmxlIHRvIGluaXQgcGFyYW1ldGVyJHttaXNzaW5nUGFyYW1zLmxlbmd0aCA+IDEgPyAncycgOiAnJ30gJHttaXNzaW5nUGFyYW1zLmpvaW4oJywgJyl9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIuYCk7XG5cdFx0fVxuXHRcdGlmIChnbE51bUNoYW5uZWxzID09PSB1bmRlZmluZWQgfHwgbnVtQ29tcG9uZW50cyA8IDEgfHwgbnVtQ29tcG9uZW50cyA+IDQgfHwgZ2xOdW1DaGFubmVscyA8IG51bUNvbXBvbmVudHMpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBudW1DaGFubmVscyAke2dsTnVtQ2hhbm5lbHN9IGZvciBudW1Db21wb25lbnRzICR7bnVtQ29tcG9uZW50c30gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHR9XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0Z2xGb3JtYXQsXG5cdFx0XHRnbEludGVybmFsRm9ybWF0LFxuXHRcdFx0Z2xUeXBlLFxuXHRcdFx0Z2xOdW1DaGFubmVscyxcblx0XHR9O1xuXHR9XG5cblx0cHJpdmF0ZSBzdGF0aWMgdGVzdEZyYW1lYnVmZmVyV3JpdGUoXG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0IHwgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCxcblx0XHRcdHR5cGU6IERhdGFMYXllclR5cGUsXG5cdFx0XHRnbHNsVmVyc2lvbjogR0xTTFZlcnNpb24sXG5cdFx0fSxcblx0KSB7XG5cdFx0Y29uc3QgeyBnbCwgdHlwZSwgZ2xzbFZlcnNpb24gfSA9IHBhcmFtcztcblx0XHRjb25zdCB0ZXh0dXJlID0gZ2wuY3JlYXRlVGV4dHVyZSgpO1xuXHRcdGlmICghdGV4dHVyZSkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCB0ZXh0dXJlKTtcblxuXHRcdC8vIERlZmF1bHQgdG8gbW9zdCB3aWRlbHkgc3VwcG9ydGVkIHNldHRpbmdzLlxuXHRcdGNvbnN0IHdyYXBTID0gZ2xbQ0xBTVBfVE9fRURHRV07XG5cdFx0Y29uc3Qgd3JhcFQgPSBnbFtDTEFNUF9UT19FREdFXTtcblx0XHRjb25zdCBmaWx0ZXIgPSBnbFtORUFSRVNUXTtcblx0XHQvLyBVc2Ugbm9uLXBvd2VyIG9mIHR3byBkaW1lbnNpb25zIHRvIGNoZWNrIGZvciBtb3JlIHVuaXZlcnNhbCBzdXBwb3J0LlxuXHRcdC8vIChJbiBjYXNlIHNpemUgb2YgRGF0YUxheWVyIGlzIGNoYW5nZWQgYXQgYSBsYXRlciBwb2ludCkuXG5cdFx0Y29uc3Qgd2lkdGggPSAxMDA7XG5cdFx0Y29uc3QgaGVpZ2h0ID0gMTAwO1xuXHRcdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1MsIHdyYXBTKTtcblx0XHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9ULCB3cmFwVCk7XG5cdFx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01JTl9GSUxURVIsIGZpbHRlcik7XG5cdFx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01BR19GSUxURVIsIGZpbHRlcik7XG5cblx0XHRjb25zdCB7IGdsSW50ZXJuYWxGb3JtYXQsIGdsRm9ybWF0LCBnbFR5cGUgfSA9IERhdGFMYXllci5nZXRHTFRleHR1cmVQYXJhbWV0ZXJzKHtcblx0XHRcdGdsLFxuXHRcdFx0bmFtZTogJ3Rlc3RGcmFtZWJ1ZmZlcldyaXRlJyxcblx0XHRcdG51bUNvbXBvbmVudHM6IDEsXG5cdFx0XHR3cml0YWJsZTogdHJ1ZSxcblx0XHRcdGludGVybmFsVHlwZTogdHlwZSxcblx0XHRcdGdsc2xWZXJzaW9uLFxuXHRcdFx0ZXJyb3JDYWxsYmFjazogKCkgPT4ge30sXG5cdFx0fSk7XG5cdFx0Z2wudGV4SW1hZ2UyRChnbC5URVhUVVJFXzJELCAwLCBnbEludGVybmFsRm9ybWF0LCB3aWR0aCwgaGVpZ2h0LCAwLCBnbEZvcm1hdCwgZ2xUeXBlLCBudWxsKTtcblxuXHRcdC8vIEluaXQgYSBmcmFtZWJ1ZmZlciBmb3IgdGhpcyB0ZXh0dXJlIHNvIHdlIGNhbiB3cml0ZSB0byBpdC5cblx0XHRjb25zdCBmcmFtZWJ1ZmZlciA9IGdsLmNyZWF0ZUZyYW1lYnVmZmVyKCk7XG5cdFx0aWYgKCFmcmFtZWJ1ZmZlcikge1xuXHRcdFx0Ly8gQ2xlYXIgb3V0IGFsbG9jYXRlZCBtZW1vcnkuXG5cdFx0XHRnbC5kZWxldGVUZXh0dXJlKHRleHR1cmUpO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIGZyYW1lYnVmZmVyKTtcblx0XHQvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvV2ViR0xSZW5kZXJpbmdDb250ZXh0L2ZyYW1lYnVmZmVyVGV4dHVyZTJEXG5cdFx0Z2wuZnJhbWVidWZmZXJUZXh0dXJlMkQoZ2wuRlJBTUVCVUZGRVIsIGdsLkNPTE9SX0FUVEFDSE1FTlQwLCBnbC5URVhUVVJFXzJELCB0ZXh0dXJlLCAwKTtcblxuXHRcdGNvbnN0IHN0YXR1cyA9IGdsLmNoZWNrRnJhbWVidWZmZXJTdGF0dXMoZ2wuRlJBTUVCVUZGRVIpO1xuXHRcdGNvbnN0IHZhbGlkU3RhdHVzID0gc3RhdHVzID09PSBnbC5GUkFNRUJVRkZFUl9DT01QTEVURTtcblxuXHRcdC8vIENsZWFyIG91dCBhbGxvY2F0ZWQgbWVtb3J5LlxuXHRcdGdsLmRlbGV0ZVRleHR1cmUodGV4dHVyZSk7XG5cdFx0Z2wuZGVsZXRlRnJhbWVidWZmZXIoZnJhbWVidWZmZXIpO1xuXG5cdFx0cmV0dXJuIHZhbGlkU3RhdHVzO1xuXHR9XG5cblx0Z2V0IGJ1ZmZlckluZGV4KCkge1xuXHRcdHJldHVybiB0aGlzLl9idWZmZXJJbmRleDtcblx0fVxuXG5cdHNhdmVDdXJyZW50U3RhdGVUb0RhdGFMYXllcihsYXllcjogRGF0YUxheWVyKSB7XG5cdFx0Ly8gQSBtZXRob2QgZm9yIHNhdmluZyBhIGNvcHkgb2YgdGhlIGN1cnJlbnQgc3RhdGUgd2l0aG91dCBhIGRyYXcgY2FsbC5cblx0XHQvLyBEcmF3IGNhbGxzIGFyZSBleHBlbnNpdmUsIHRoaXMgb3B0aW1pemF0aW9uIGhlbHBzLlxuXHRcdGlmICh0aGlzLm51bUJ1ZmZlcnMgPCAyKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYENhbid0IGNhbGwgRGF0YUxheWVyLnNhdmVDdXJyZW50U3RhdGVUb0RhdGFMYXllciBvbiBEYXRhTGF5ZXIgJHt0aGlzLm5hbWV9IHdpdGggbGVzcyB0aGFuIDIgYnVmZmVycy5gKTtcblx0XHR9XG5cdFx0aWYgKCF0aGlzLndyaXRhYmxlKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYENhbid0IGNhbGwgRGF0YUxheWVyLnNhdmVDdXJyZW50U3RhdGVUb0RhdGFMYXllciBvbiByZWFkLW9ubHkgRGF0YUxheWVyICR7dGhpcy5uYW1lfS5gKTtcblx0XHR9XG5cdFx0aWYgKGxheWVyLndyaXRhYmxlKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYENhbid0IGNhbGwgRGF0YUxheWVyLnNhdmVDdXJyZW50U3RhdGVUb0RhdGFMYXllciBvbiBEYXRhTGF5ZXIgJHt0aGlzLm5hbWV9IHVzaW5nIHdyaXRhYmxlIERhdGFMYXllciAke2xheWVyLm5hbWV9LmApXG5cdFx0fVxuXHRcdC8vIENoZWNrIHRoYXQgdGV4dHVyZSBwYXJhbXMgYXJlIHRoZSBzYW1lLlxuXHRcdGlmIChsYXllci5nbFdyYXBTICE9PSB0aGlzLmdsV3JhcFMgfHwgbGF5ZXIuZ2xXcmFwVCAhPT0gdGhpcy5nbFdyYXBUIHx8XG5cdFx0XHRsYXllci53cmFwUyAhPT0gdGhpcy53cmFwUyB8fCBsYXllci53cmFwVCAhPT0gdGhpcy53cmFwVCB8fFxuXHRcdFx0bGF5ZXIud2lkdGggIT09IHRoaXMud2lkdGggfHwgbGF5ZXIuaGVpZ2h0ICE9PSB0aGlzLmhlaWdodCB8fFxuXHRcdFx0bGF5ZXIuZ2xGaWx0ZXIgIT09IHRoaXMuZ2xGaWx0ZXIgfHwgbGF5ZXIuZmlsdGVyICE9PSB0aGlzLmZpbHRlciB8fFxuXHRcdFx0bGF5ZXIuZ2xOdW1DaGFubmVscyAhPT0gdGhpcy5nbE51bUNoYW5uZWxzIHx8IGxheWVyLm51bUNvbXBvbmVudHMgIT09IHRoaXMubnVtQ29tcG9uZW50cyB8fFxuXHRcdFx0bGF5ZXIuZ2xUeXBlICE9PSB0aGlzLmdsVHlwZSB8fCBsYXllci50eXBlICE9PSB0aGlzLnR5cGUgfHxcblx0XHRcdGxheWVyLmdsRm9ybWF0ICE9PSB0aGlzLmdsRm9ybWF0IHx8IGxheWVyLmdsSW50ZXJuYWxGb3JtYXQgIT09IHRoaXMuZ2xJbnRlcm5hbEZvcm1hdCkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEluY29tcGF0aWJsZSB0ZXh0dXJlIHBhcmFtcyBiZXR3ZWVuIERhdGFMYXllcnMgJHtsYXllci5uYW1lfSBhbmQgJHt0aGlzLm5hbWV9LmApO1xuXHRcdH1cblxuXHRcdC8vIElmIHdlIGhhdmUgbm90IGFscmVhZHkgaW5pdGVkIG92ZXJyaWRlcyBhcnJheSwgZG8gc28gbm93LlxuXHRcdGlmICghdGhpcy50ZXh0dXJlT3ZlcnJpZGVzKSB7XG5cdFx0XHR0aGlzLnRleHR1cmVPdmVycmlkZXMgPSBbXTtcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5udW1CdWZmZXJzOyBpKyspIHtcblx0XHRcdFx0dGhpcy50ZXh0dXJlT3ZlcnJpZGVzLnB1c2godW5kZWZpbmVkKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBDaGVjayBpZiB3ZSBhbHJlYWR5IGhhdmUgYW4gb3ZlcnJpZGUgaW4gcGxhY2UuXG5cdFx0aWYgKHRoaXMudGV4dHVyZU92ZXJyaWRlc1t0aGlzLl9idWZmZXJJbmRleF0pIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgQ2FuJ3QgY2FsbCBEYXRhTGF5ZXIuc2F2ZUN1cnJlbnRTdGF0ZVRvRGF0YUxheWVyIG9uIERhdGFMYXllciAke3RoaXMubmFtZX0sIHRoaXMgRGF0YUxheWVyIGhhcyBub3Qgd3JpdHRlbiBuZXcgc3RhdGUgc2luY2UgbGFzdCBjYWxsIHRvIERhdGFMYXllci5zYXZlQ3VycmVudFN0YXRlVG9EYXRhTGF5ZXIuYCk7XG5cdFx0fVxuXHRcdGNvbnN0IGN1cnJlbnRTdGF0ZSA9IHRoaXMuZ2V0Q3VycmVudFN0YXRlVGV4dHVyZSgpO1xuXHRcdHRoaXMudGV4dHVyZU92ZXJyaWRlc1t0aGlzLl9idWZmZXJJbmRleF0gPSBjdXJyZW50U3RhdGU7XG5cdFx0Ly8gU3dhcCB0ZXh0dXJlcy5cblx0XHR0aGlzLmJ1ZmZlcnNbdGhpcy5fYnVmZmVySW5kZXhdLnRleHR1cmUgPSBsYXllci5nZXRDdXJyZW50U3RhdGVUZXh0dXJlKCk7XG5cdFx0bGF5ZXIuX3NldEN1cnJlbnRTdGF0ZVRleHR1cmUoY3VycmVudFN0YXRlKTtcblxuXHRcdC8vIEJpbmQgc3dhcHBlZCB0ZXh0dXJlIHRvIGZyYW1lYnVmZmVyLlxuXHRcdGNvbnN0IHsgZ2wgfSA9IHRoaXM7XG5cdFx0Y29uc3QgeyBmcmFtZWJ1ZmZlciwgdGV4dHVyZSB9ID0gdGhpcy5idWZmZXJzW3RoaXMuX2J1ZmZlckluZGV4XTtcblx0XHRpZiAoIWZyYW1lYnVmZmVyKSB0aHJvdyBuZXcgRXJyb3IoYE5vIGZyYW1lYnVmZmVyIGZvciB3cml0YWJsZSBEYXRhTGF5ZXIgJHt0aGlzLm5hbWV9LmApO1xuXHRcdGdsLmJpbmRGcmFtZWJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgZnJhbWVidWZmZXIpO1xuXHRcdC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9XZWJHTFJlbmRlcmluZ0NvbnRleHQvZnJhbWVidWZmZXJUZXh0dXJlMkRcblx0XHRnbC5mcmFtZWJ1ZmZlclRleHR1cmUyRChnbC5GUkFNRUJVRkZFUiwgZ2wuQ09MT1JfQVRUQUNITUVOVDAsIGdsLlRFWFRVUkVfMkQsIHRleHR1cmUsIDApO1xuXHRcdC8vIFVuYmluZC5cblx0XHRnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIG51bGwpO1xuXHR9XG5cblx0X3NldEN1cnJlbnRTdGF0ZVRleHR1cmUodGV4dHVyZTogV2ViR0xUZXh0dXJlKSB7XG5cdFx0aWYgKHRoaXMud3JpdGFibGUpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgQ2FuJ3QgY2FsbCBEYXRhTGF5ZXIuX3NldEN1cnJlbnRTdGF0ZVRleHR1cmUgb24gd3JpdGFibGUgdGV4dHVyZSAke3RoaXMubmFtZX0uYCk7XG5cdFx0fVxuXHRcdHRoaXMuYnVmZmVyc1t0aGlzLl9idWZmZXJJbmRleF0udGV4dHVyZSA9IHRleHR1cmU7XG5cdH1cblxuXHRwcml2YXRlIHZhbGlkYXRlRGF0YUFycmF5KFxuXHRcdF9kYXRhPzogRGF0YUxheWVyQXJyYXlUeXBlLFxuXHQpIHtcblx0XHRpZiAoIV9kYXRhKXtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0Y29uc3QgeyB3aWR0aCwgaGVpZ2h0LCBsZW5ndGgsIG51bUNvbXBvbmVudHMsIGdsTnVtQ2hhbm5lbHMsIHR5cGUsIGludGVybmFsVHlwZSwgbmFtZSB9ID0gdGhpcztcblxuXHRcdC8vIENoZWNrIHRoYXQgZGF0YSBpcyBjb3JyZWN0IGxlbmd0aCAodXNlciBlcnJvcikuXG5cdFx0aWYgKChsZW5ndGggJiYgX2RhdGEubGVuZ3RoICE9PSBsZW5ndGggKiBudW1Db21wb25lbnRzKSB8fCAoIWxlbmd0aCAmJiBfZGF0YS5sZW5ndGggIT09IHdpZHRoICogaGVpZ2h0ICogbnVtQ29tcG9uZW50cykpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBkYXRhIGxlbmd0aCAke19kYXRhLmxlbmd0aH0gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIiBvZiBzaXplICR7bGVuZ3RoID8gbGVuZ3RoIDogYCR7d2lkdGh9eCR7aGVpZ2h0fWB9eCR7bnVtQ29tcG9uZW50c30uYCk7XG5cdFx0fVxuXG5cdFx0Ly8gQ2hlY2sgdGhhdCBkYXRhIGlzIGNvcnJlY3QgdHlwZSAodXNlciBlcnJvcikuXG5cdFx0bGV0IGludmFsaWRUeXBlRm91bmQgPSBmYWxzZTtcblx0XHRzd2l0Y2ggKHR5cGUpIHtcblx0XHRcdGNhc2UgSEFMRl9GTE9BVDpcblx0XHRcdFx0Ly8gU2luY2UgdGhlcmUgaXMgbm8gRmxvYXQxNkFycmF5LCB3ZSBtdXN0IHVzZSBGbG9hdDMyQXJyYXlzIHRvIGluaXQgdGV4dHVyZS5cblx0XHRcdFx0Ly8gQ29udGludWUgdG8gbmV4dCBjYXNlLlxuXHRcdFx0Y2FzZSBGTE9BVDpcblx0XHRcdFx0aW52YWxpZFR5cGVGb3VuZCA9IGludmFsaWRUeXBlRm91bmQgfHwgX2RhdGEuY29uc3RydWN0b3IgIT09IEZsb2F0MzJBcnJheTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFVOU0lHTkVEX0JZVEU6XG5cdFx0XHRcdGludmFsaWRUeXBlRm91bmQgPSBpbnZhbGlkVHlwZUZvdW5kIHx8IF9kYXRhLmNvbnN0cnVjdG9yICE9PSBVaW50OEFycmF5O1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgQllURTpcblx0XHRcdFx0aW52YWxpZFR5cGVGb3VuZCA9IGludmFsaWRUeXBlRm91bmQgfHwgX2RhdGEuY29uc3RydWN0b3IgIT09IEludDhBcnJheTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFVOU0lHTkVEX1NIT1JUOlxuXHRcdFx0XHRpbnZhbGlkVHlwZUZvdW5kID0gaW52YWxpZFR5cGVGb3VuZCB8fCBfZGF0YS5jb25zdHJ1Y3RvciAhPT0gVWludDE2QXJyYXk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBTSE9SVDpcblx0XHRcdFx0aW52YWxpZFR5cGVGb3VuZCA9IGludmFsaWRUeXBlRm91bmQgfHwgX2RhdGEuY29uc3RydWN0b3IgIT09IEludDE2QXJyYXk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBVTlNJR05FRF9JTlQ6XG5cdFx0XHRcdGludmFsaWRUeXBlRm91bmQgPSBpbnZhbGlkVHlwZUZvdW5kIHx8IF9kYXRhLmNvbnN0cnVjdG9yICE9PSBVaW50MzJBcnJheTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIElOVDpcblx0XHRcdFx0aW52YWxpZFR5cGVGb3VuZCA9IGludmFsaWRUeXBlRm91bmQgfHwgX2RhdGEuY29uc3RydWN0b3IgIT09IEludDMyQXJyYXk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBFcnJvciBpbml0aW5nIERhdGFMYXllciBcIiR7bmFtZX1cIi4gIFVuc3VwcG9ydGVkIHR5cGUgXCIke3R5cGV9XCIgZm9yIFdlYkdMQ29tcHV0ZS5pbml0RGF0YUxheWVyLmApO1xuXHRcdH1cblx0XHRpZiAoaW52YWxpZFR5cGVGb3VuZCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIFR5cGVkQXJyYXkgb2YgdHlwZSAkeyhfZGF0YS5jb25zdHJ1Y3RvciBhcyBhbnkpLm5hbWV9IHN1cHBsaWVkIHRvIERhdGFMYXllciBcIiR7bmFtZX1cIiBvZiB0eXBlIFwiJHt0eXBlfVwiLmApO1xuXHRcdH1cblxuXHRcdGxldCBkYXRhID0gX2RhdGE7XG5cdFx0Y29uc3QgaW1hZ2VTaXplID0gd2lkdGggKiBoZWlnaHQgKiBnbE51bUNoYW5uZWxzO1xuXHRcdC8vIFRoZW4gY2hlY2sgaWYgYXJyYXkgbmVlZHMgdG8gYmUgbGVuZ3RoZW5lZC5cblx0XHQvLyBUaGlzIGNvdWxkIGJlIGJlY2F1c2UgZ2xOdW1DaGFubmVscyAhPT0gbnVtQ29tcG9uZW50cy5cblx0XHQvLyBPciBiZWNhdXNlIGxlbmd0aCAhPT0gd2lkdGggKiBoZWlnaHQuXG5cdFx0Y29uc3QgaW5jb3JyZWN0U2l6ZSA9IGRhdGEubGVuZ3RoICE9PSBpbWFnZVNpemU7XG5cdFx0Ly8gV2UgaGF2ZSB0byBoYW5kbGUgdGhlIGNhc2Ugb2YgRmxvYXQxNiBzcGVjaWFsbHkgYnkgY29udmVydGluZyBkYXRhIHRvIFVpbnQxNkFycmF5LlxuXHRcdGNvbnN0IGhhbmRsZUZsb2F0MTYgPSBpbnRlcm5hbFR5cGUgPT09IEhBTEZfRkxPQVQ7XG5cdFx0Ly8gRm9yIHdlYmdsMS4wIHdlIG1heSBuZWVkIHRvIGNhc3QgYW4gaW50IHR5cGUgdG8gYSBGTE9BVCBvciBIQUxGX0ZMT0FULlxuXHRcdGNvbnN0IHNob3VsZFR5cGVDYXN0ID0gdHlwZSAhPT0gaW50ZXJuYWxUeXBlO1xuXG5cdFx0aWYgKHNob3VsZFR5cGVDYXN0IHx8IGluY29ycmVjdFNpemUgfHwgaGFuZGxlRmxvYXQxNikge1xuXHRcdFx0c3dpdGNoIChpbnRlcm5hbFR5cGUpIHtcblx0XHRcdFx0Y2FzZSBIQUxGX0ZMT0FUOlxuXHRcdFx0XHRcdGRhdGEgPSBuZXcgVWludDE2QXJyYXkoaW1hZ2VTaXplKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBGTE9BVDpcblx0XHRcdFx0XHRkYXRhID0gbmV3IEZsb2F0MzJBcnJheShpbWFnZVNpemUpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFVOU0lHTkVEX0JZVEU6XG5cdFx0XHRcdFx0ZGF0YSA9IG5ldyBVaW50OEFycmF5KGltYWdlU2l6ZSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgQllURTpcblx0XHRcdFx0XHRkYXRhID0gbmV3IEludDhBcnJheShpbWFnZVNpemUpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFVOU0lHTkVEX1NIT1JUOlxuXHRcdFx0XHRcdGRhdGEgPSBuZXcgVWludDE2QXJyYXkoaW1hZ2VTaXplKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBTSE9SVDpcblx0XHRcdFx0XHRkYXRhID0gbmV3IEludDE2QXJyYXkoaW1hZ2VTaXplKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBVTlNJR05FRF9JTlQ6XG5cdFx0XHRcdFx0ZGF0YSA9IG5ldyBVaW50MzJBcnJheShpbWFnZVNpemUpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIElOVDpcblx0XHRcdFx0XHRkYXRhID0gbmV3IEludDMyQXJyYXkoaW1hZ2VTaXplKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBFcnJvciBpbml0aW5nICR7bmFtZX0uICBVbnN1cHBvcnRlZCBpbnRlcm5hbFR5cGUgJHtpbnRlcm5hbFR5cGV9IGZvciBXZWJHTENvbXB1dGUuaW5pdERhdGFMYXllci5gKTtcblx0XHRcdH1cblx0XHRcdC8vIEZpbGwgbmV3IGRhdGEgYXJyYXkgd2l0aCBvbGQgZGF0YS5cblx0XHRcdGNvbnN0IHZpZXcgPSBoYW5kbGVGbG9hdDE2ID8gbmV3IERhdGFWaWV3KGRhdGEuYnVmZmVyKSA6IG51bGw7XG5cdFx0XHRmb3IgKGxldCBpID0gMCwgX2xlbiA9IF9kYXRhLmxlbmd0aCAvIG51bUNvbXBvbmVudHM7IGkgPCBfbGVuOyBpKyspIHtcblx0XHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCBudW1Db21wb25lbnRzOyBqKyspIHtcblx0XHRcdFx0XHRjb25zdCB2YWx1ZSA9IF9kYXRhW2kgKiBudW1Db21wb25lbnRzICsgal07XG5cdFx0XHRcdFx0Y29uc3QgaW5kZXggPSBpICogZ2xOdW1DaGFubmVscyArIGo7XG5cdFx0XHRcdFx0aWYgKGhhbmRsZUZsb2F0MTYpIHtcblx0XHRcdFx0XHRcdHNldEZsb2F0MTYodmlldyEsIDIgKiBpbmRleCwgdmFsdWUsIHRydWUpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRkYXRhW2luZGV4XSA9IHZhbHVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBkYXRhO1xuXHR9XG5cblx0cHJpdmF0ZSBpbml0QnVmZmVycyhcblx0XHRfZGF0YT86IERhdGFMYXllckFycmF5VHlwZSxcblx0KSB7XG5cdFx0Y29uc3Qge1xuXHRcdFx0bmFtZSxcblx0XHRcdG51bUJ1ZmZlcnMsXG5cdFx0XHRnbCxcblx0XHRcdHdpZHRoLFxuXHRcdFx0aGVpZ2h0LFxuXHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCxcblx0XHRcdGdsRm9ybWF0LFxuXHRcdFx0Z2xUeXBlLFxuXHRcdFx0Z2xGaWx0ZXIsXG5cdFx0XHRnbFdyYXBTLFxuXHRcdFx0Z2xXcmFwVCxcblx0XHRcdHdyaXRhYmxlLFxuXHRcdFx0ZXJyb3JDYWxsYmFjayxcblx0XHR9ID0gdGhpcztcblxuXHRcdGNvbnN0IGRhdGEgPSB0aGlzLnZhbGlkYXRlRGF0YUFycmF5KF9kYXRhKTtcblxuXHRcdC8vIEluaXQgYSB0ZXh0dXJlIGZvciBlYWNoIGJ1ZmZlci5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IG51bUJ1ZmZlcnM7IGkrKykge1xuXHRcdFx0Y29uc3QgdGV4dHVyZSA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcblx0XHRcdGlmICghdGV4dHVyZSkge1xuXHRcdFx0XHRlcnJvckNhbGxiYWNrKGBDb3VsZCBub3QgaW5pdCB0ZXh0dXJlIGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCI6ICR7Z2wuZ2V0RXJyb3IoKX0uYCk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIHRleHR1cmUpO1xuXG5cdFx0XHQvLyBUT0RPOiBhcmUgdGhlcmUgb3RoZXIgcGFyYW1zIHRvIGxvb2sgaW50bzpcblx0XHRcdC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9XZWJHTFJlbmRlcmluZ0NvbnRleHQvdGV4UGFyYW1ldGVyXG5cdFx0XHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9TLCBnbFdyYXBTKTtcblx0XHRcdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1QsIGdsV3JhcFQpO1xuXHRcdFx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01JTl9GSUxURVIsIGdsRmlsdGVyKTtcblx0XHRcdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCBnbEZpbHRlcik7XG5cblx0XHRcdGdsLnRleEltYWdlMkQoZ2wuVEVYVFVSRV8yRCwgMCwgZ2xJbnRlcm5hbEZvcm1hdCwgd2lkdGgsIGhlaWdodCwgMCwgZ2xGb3JtYXQsIGdsVHlwZSwgZGF0YSA/IGRhdGEgOiBudWxsKTtcblx0XHRcdFxuXHRcdFx0Y29uc3QgYnVmZmVyOiBEYXRhTGF5ZXJCdWZmZXIgPSB7XG5cdFx0XHRcdHRleHR1cmUsXG5cdFx0XHR9O1xuXG5cdFx0XHRpZiAod3JpdGFibGUpIHtcblx0XHRcdFx0Ly8gSW5pdCBhIGZyYW1lYnVmZmVyIGZvciB0aGlzIHRleHR1cmUgc28gd2UgY2FuIHdyaXRlIHRvIGl0LlxuXHRcdFx0XHRjb25zdCBmcmFtZWJ1ZmZlciA9IGdsLmNyZWF0ZUZyYW1lYnVmZmVyKCk7XG5cdFx0XHRcdGlmICghZnJhbWVidWZmZXIpIHtcblx0XHRcdFx0XHRlcnJvckNhbGxiYWNrKGBDb3VsZCBub3QgaW5pdCBmcmFtZWJ1ZmZlciBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiOiAke2dsLmdldEVycm9yKCl9LmApO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHRnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIGZyYW1lYnVmZmVyKTtcblx0XHRcdFx0Ly8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1dlYkdMUmVuZGVyaW5nQ29udGV4dC9mcmFtZWJ1ZmZlclRleHR1cmUyRFxuXHRcdFx0XHRnbC5mcmFtZWJ1ZmZlclRleHR1cmUyRChnbC5GUkFNRUJVRkZFUiwgZ2wuQ09MT1JfQVRUQUNITUVOVDAsIGdsLlRFWFRVUkVfMkQsIHRleHR1cmUsIDApO1xuXG5cdFx0XHRcdGNvbnN0IHN0YXR1cyA9IGdsLmNoZWNrRnJhbWVidWZmZXJTdGF0dXMoZ2wuRlJBTUVCVUZGRVIpO1xuXHRcdFx0XHRpZihzdGF0dXMgIT0gZ2wuRlJBTUVCVUZGRVJfQ09NUExFVEUpe1xuXHRcdFx0XHRcdGVycm9yQ2FsbGJhY2soYEludmFsaWQgc3RhdHVzIGZvciBmcmFtZWJ1ZmZlciBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiOiAke3N0YXR1c30uYCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBBZGQgZnJhbWVidWZmZXIuXG5cdFx0XHRcdGJ1ZmZlci5mcmFtZWJ1ZmZlciA9IGZyYW1lYnVmZmVyO1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHQvLyBTYXZlIHRoaXMgYnVmZmVyIHRvIHRoZSBsaXN0LlxuXHRcdFx0dGhpcy5idWZmZXJzLnB1c2goYnVmZmVyKTtcblx0XHR9XG5cdFx0Ly8gVW5iaW5kLlxuXHRcdGdsLmJpbmRGcmFtZWJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgbnVsbCk7XG5cdH1cblxuXHRnZXRDdXJyZW50U3RhdGVUZXh0dXJlKCkge1xuXHRcdGlmICh0aGlzLnRleHR1cmVPdmVycmlkZXMgJiYgdGhpcy50ZXh0dXJlT3ZlcnJpZGVzW3RoaXMuX2J1ZmZlckluZGV4XSkgcmV0dXJuIHRoaXMudGV4dHVyZU92ZXJyaWRlc1t0aGlzLl9idWZmZXJJbmRleF0hO1xuXHRcdHJldHVybiB0aGlzLmJ1ZmZlcnNbdGhpcy5fYnVmZmVySW5kZXhdLnRleHR1cmU7XG5cdH1cblxuXHRnZXRQcmV2aW91c1N0YXRlVGV4dHVyZShpbmRleCA9IC0xKSB7XG5cdFx0aWYgKHRoaXMubnVtQnVmZmVycyA9PT0gMSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgY2FsbCBnZXRQcmV2aW91c1N0YXRlVGV4dHVyZSBvbiBEYXRhTGF5ZXIgXCIke3RoaXMubmFtZX1cIiB3aXRoIG9ubHkgb25lIGJ1ZmZlci5gKTtcblx0XHR9XG5cdFx0Y29uc3QgcHJldmlvdXNJbmRleCA9IHRoaXMuX2J1ZmZlckluZGV4ICsgaW5kZXggKyB0aGlzLm51bUJ1ZmZlcnM7XG5cdFx0aWYgKHByZXZpb3VzSW5kZXggPCAwIHx8IHByZXZpb3VzSW5kZXggPj0gdGhpcy5udW1CdWZmZXJzKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgaW5kZXggJHtpbmRleH0gcGFzc2VkIHRvIGdldFByZXZpb3VzU3RhdGVUZXh0dXJlIG9uIERhdGFMYXllciAke3RoaXMubmFtZX0gd2l0aCAke3RoaXMubnVtQnVmZmVyc30gYnVmZmVycy5gKTtcblx0XHR9XG5cdFx0aWYgKHRoaXMudGV4dHVyZU92ZXJyaWRlcyAmJiB0aGlzLnRleHR1cmVPdmVycmlkZXNbcHJldmlvdXNJbmRleF0pIHJldHVybiB0aGlzLnRleHR1cmVPdmVycmlkZXNbcHJldmlvdXNJbmRleF0hO1xuXHRcdHJldHVybiB0aGlzLmJ1ZmZlcnNbcHJldmlvdXNJbmRleF0udGV4dHVyZTtcblx0fVxuXG5cdF91c2luZ1RleHR1cmVPdmVycmlkZUZvckN1cnJlbnRCdWZmZXIoKSB7XG5cdFx0cmV0dXJuIHRoaXMudGV4dHVyZU92ZXJyaWRlcyAmJiB0aGlzLnRleHR1cmVPdmVycmlkZXNbdGhpcy5idWZmZXJJbmRleF07XG5cdH1cblxuXHRfYmluZE91dHB1dEJ1ZmZlckZvcldyaXRlKFxuXHRcdGluY3JlbWVudEJ1ZmZlckluZGV4OiBib29sZWFuLFxuXHQpIHtcblx0XHRjb25zdCB7IGdsIH0gPSB0aGlzO1xuXHRcdGlmIChpbmNyZW1lbnRCdWZmZXJJbmRleCkge1xuXHRcdFx0Ly8gSW5jcmVtZW50IGJ1ZmZlckluZGV4LlxuXHRcdFx0dGhpcy5fYnVmZmVySW5kZXggPSAodGhpcy5fYnVmZmVySW5kZXggKyAxKSAlIHRoaXMubnVtQnVmZmVycztcblx0XHR9XG5cdFx0dGhpcy5fYmluZE91dHB1dEJ1ZmZlcigpO1xuXG5cdFx0Ly8gV2UgYXJlIGdvaW5nIHRvIGRvIGEgZGF0YSB3cml0ZSwgaWYgd2UgaGF2ZSBvdmVycmlkZXMgZW5hYmxlZCwgd2UgY2FuIHJlbW92ZSB0aGVtLlxuXHRcdGlmICh0aGlzLnRleHR1cmVPdmVycmlkZXMpIHtcblx0XHRcdHRoaXMudGV4dHVyZU92ZXJyaWRlc1t0aGlzLl9idWZmZXJJbmRleF0gPSB1bmRlZmluZWQ7XG5cdFx0fVxuXHR9XG5cblx0X2JpbmRPdXRwdXRCdWZmZXIoKSB7XG5cdFx0Y29uc3QgeyBnbCB9ID0gdGhpcztcblx0XHRjb25zdCB7IGZyYW1lYnVmZmVyIH0gPSB0aGlzLmJ1ZmZlcnNbdGhpcy5fYnVmZmVySW5kZXhdO1xuXHRcdGlmICghZnJhbWVidWZmZXIpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgRGF0YUxheWVyIFwiJHt0aGlzLm5hbWV9XCIgaXMgbm90IHdyaXRhYmxlLmApO1xuXHRcdH1cblx0XHRnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIGZyYW1lYnVmZmVyKTtcblx0fVxuXG5cdHNldERhdGEoZGF0YTogRGF0YUxheWVyQXJyYXlUeXBlKSB7XG5cdFx0Ly8gVE9ETzogUmF0aGVyIHRoYW4gZGVzdHJveWluZyBidWZmZXJzLCB3ZSBjb3VsZCB3cml0ZSB0byBjZXJ0YWluIHdpbmRvdy5cblx0XHR0aGlzLmRlc3Ryb3lCdWZmZXJzKCk7XG5cdFx0dGhpcy5pbml0QnVmZmVycyhkYXRhKTtcblx0fVxuXG5cdHJlc2l6ZShcblx0XHRkaW1lbnNpb25zOiBudW1iZXIgfCBbbnVtYmVyLCBudW1iZXJdLFxuXHRcdGRhdGE/OiBEYXRhTGF5ZXJBcnJheVR5cGUsXG5cdCkge1xuXHRcdGNvbnN0IHsgbGVuZ3RoLCB3aWR0aCwgaGVpZ2h0IH0gPSBEYXRhTGF5ZXIuY2FsY1NpemUoZGltZW5zaW9ucywgdGhpcy5uYW1lKTtcblx0XHR0aGlzLmxlbmd0aCA9IGxlbmd0aDtcblx0XHR0aGlzLndpZHRoID0gd2lkdGg7XG5cdFx0dGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG5cdFx0dGhpcy5kZXN0cm95QnVmZmVycygpO1xuXHRcdHRoaXMuaW5pdEJ1ZmZlcnMoZGF0YSk7XG5cdH1cblxuXHRjbGVhcigpIHtcblx0XHQvLyBSZXNldCBldmVyeXRoaW5nIHRvIHplcm8uXG5cdFx0Ly8gVE9ETzogVGhpcyBpcyBub3QgdGhlIG1vc3QgZWZmaWNpZW50IHdheSB0byBkbyB0aGlzIChyZWFsbG9jYXRpbmcgYWxsIHRleHR1cmVzIGFuZCBmcmFtZWJ1ZmZlcnMpLCBidXQgb2sgZm9yIG5vdy5cblx0XHR0aGlzLmRlc3Ryb3lCdWZmZXJzKCk7XG5cdFx0dGhpcy5pbml0QnVmZmVycygpO1xuXHR9XG5cblx0Z2V0RGltZW5zaW9ucygpIHtcblx0XHRyZXR1cm4gW1xuXHRcdFx0dGhpcy53aWR0aCxcblx0XHRcdHRoaXMuaGVpZ2h0LFxuXHRcdF0gYXMgW251bWJlciwgbnVtYmVyXTtcblx0fVxuXG5cdGdldExlbmd0aCgpIHtcblx0XHRpZiAoIXRoaXMubGVuZ3RoKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBjYWxsIGdldExlbmd0aCgpIG9uIDJEIERhdGFMYXllciBcIiR7dGhpcy5uYW1lfVwiLmApO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5sZW5ndGg7XG5cdH1cblxuXHRwcml2YXRlIGRlc3Ryb3lCdWZmZXJzKCkge1xuXHRcdGNvbnN0IHsgZ2wsIGJ1ZmZlcnMgfSA9IHRoaXM7XG5cdFx0YnVmZmVycy5mb3JFYWNoKGJ1ZmZlciA9PiB7XG5cdFx0XHRjb25zdCB7IGZyYW1lYnVmZmVyLCB0ZXh0dXJlIH0gPSBidWZmZXI7XG5cdFx0XHRnbC5kZWxldGVUZXh0dXJlKHRleHR1cmUpO1xuXHRcdFx0aWYgKGZyYW1lYnVmZmVyKSB7XG5cdFx0XHRcdGdsLmRlbGV0ZUZyYW1lYnVmZmVyKGZyYW1lYnVmZmVyKTtcblx0XHRcdH1cblx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdGRlbGV0ZSBidWZmZXIudGV4dHVyZTtcblx0XHRcdGRlbGV0ZSBidWZmZXIuZnJhbWVidWZmZXI7XG5cdFx0fSk7XG5cdFx0YnVmZmVycy5sZW5ndGggPSAwO1xuXG5cdFx0Ly8gVGhlc2UgYXJlIHRlY2huaWNhbGx5IG93bmVkIGJ5IGFub3RoZXIgRGF0YUxheWVyLFxuXHRcdC8vIHNvIHdlIGFyZSBub3QgcmVzcG9uc2libGUgZm9yIGRlbGV0aW5nIHRoZW0gZnJvbSBnbCBjb250ZXh0LlxuXHRcdGRlbGV0ZSB0aGlzLnRleHR1cmVPdmVycmlkZXM7XG5cdH1cblxuXHRkZXN0cm95KCkge1xuXHRcdHRoaXMuZGVzdHJveUJ1ZmZlcnMoKTtcblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0ZGVsZXRlIHRoaXMuZ2w7XG5cdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdGRlbGV0ZSB0aGlzLmVycm9yQ2FsbGJhY2s7XG5cdH1cbn1cbiIsImltcG9ydCB7IGlzQXJyYXksIGlzSW50ZWdlciwgaXNOdW1iZXIsIGlzU3RyaW5nIH0gZnJvbSAnLi9DaGVja3MnO1xuaW1wb3J0IHtcblx0RkxPQVQsXG5cdEZMT0FUXzFEX1VOSUZPUk0sIEZMT0FUXzJEX1VOSUZPUk0sIEZMT0FUXzNEX1VOSUZPUk0sIEZMT0FUXzREX1VOSUZPUk0sXG5cdEdMU0wzLFxuXHRHTFNMVmVyc2lvbixcblx0SU5ULFxuXHRJTlRfMURfVU5JRk9STSwgSU5UXzJEX1VOSUZPUk0sIElOVF8zRF9VTklGT1JNLCBJTlRfNERfVU5JRk9STSxcblx0VW5pZm9ybSwgVW5pZm9ybURhdGFUeXBlLCBVbmlmb3JtVHlwZSwgVW5pZm9ybVZhbHVlVHlwZSxcbn0gZnJvbSAnLi9Db25zdGFudHMnO1xuaW1wb3J0IHsgY29tcGlsZVNoYWRlciB9IGZyb20gJy4vdXRpbHMnO1xuXG5jb25zdCBERUZBVUxUX1BST0dSQU1fTkFNRSA9ICdERUZBVUxUJztcbmNvbnN0IFNFR01FTlRfUFJPR1JBTV9OQU1FID0gJ1NFR01FTlQnO1xuY29uc3QgUE9JTlRTX1BST0dSQU1fTkFNRSA9ICdQT0lOVFMnO1xuY29uc3QgVkVDVE9SX0ZJRUxEX1BST0dSQU1fTkFNRSA9ICdWRUNUT1JfRklFTEQnO1xuY29uc3QgSU5ERVhFRF9MSU5FU19QUk9HUkFNX05BTUUgPSAnSU5ERVhFRF9MSU5FUyc7XG5jb25zdCBQT0xZTElORV9QUk9HUkFNX05BTUUgPSAnUE9MWUxJTkUnO1xuY29uc3QgZ2xQcm9ncmFtTmFtZXMgPSBbXG5cdERFRkFVTFRfUFJPR1JBTV9OQU1FLFxuXHRTRUdNRU5UX1BST0dSQU1fTkFNRSxcblx0UE9JTlRTX1BST0dSQU1fTkFNRSxcblx0VkVDVE9SX0ZJRUxEX1BST0dSQU1fTkFNRSxcblx0SU5ERVhFRF9MSU5FU19QUk9HUkFNX05BTUUsXG5cdFBPTFlMSU5FX1BST0dSQU1fTkFNRSxcbl07XG5cbmV4cG9ydCBjbGFzcyBHUFVQcm9ncmFtIHtcblx0cmVhZG9ubHkgbmFtZTogc3RyaW5nO1xuXHRwcml2YXRlIHJlYWRvbmx5IGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQgfCBXZWJHTDJSZW5kZXJpbmdDb250ZXh0O1xuXHRwcml2YXRlIHJlYWRvbmx5IGVycm9yQ2FsbGJhY2s6IChtZXNzYWdlOiBzdHJpbmcpID0+IHZvaWQ7XG5cdHByaXZhdGUgcmVhZG9ubHkgZ2xzbFZlcnNpb246IEdMU0xWZXJzaW9uO1xuXHRwcml2YXRlIHJlYWRvbmx5IHVuaWZvcm1zOiB7IFsga2V5OiBzdHJpbmddOiBVbmlmb3JtIH0gPSB7fTtcblx0cHJpdmF0ZSByZWFkb25seSBmcmFnbWVudFNoYWRlciE6IFdlYkdMU2hhZGVyO1xuXHQvLyBTdG9yZSBnbCBwcm9ncmFtcy5cblx0cHJpdmF0ZSBfZGVmYXVsdFByb2dyYW0/OiBXZWJHTFByb2dyYW07XG5cdHByaXZhdGUgX3NlZ21lbnRQcm9ncmFtPzogV2ViR0xQcm9ncmFtO1xuXHRwcml2YXRlIF9wb2ludHNQcm9ncmFtPzogV2ViR0xQcm9ncmFtO1xuXHRwcml2YXRlIF92ZWN0b3JGaWVsZFByb2dyYW0/OiBXZWJHTFByb2dyYW07XG5cdHByaXZhdGUgX2luZGV4ZWRMaW5lc1Byb2dyYW0/OiBXZWJHTFByb2dyYW07XG5cdHByaXZhdGUgX3BvbHlsaW5lUHJvZ3JhbT86IFdlYkdMUHJvZ3JhbTtcblx0Ly8gU3RvcmUgdmVydGV4U2hhZGVycyBhcyBjbGFzcyBwcm9wZXJ0aWVzIChmb3Igc2hhcmluZykuXG5cdHByaXZhdGUgc3RhdGljIGRlZmF1bHRWZXJ0ZXhTaGFkZXI/OiBXZWJHTFNoYWRlcjtcblx0cHJpdmF0ZSBzdGF0aWMgc2VnbWVudFZlcnRleFNoYWRlcj86IFdlYkdMU2hhZGVyO1xuXHRwcml2YXRlIHN0YXRpYyBwb2ludHNWZXJ0ZXhTaGFkZXI/OiBXZWJHTFNoYWRlcjtcblx0cHJpdmF0ZSBzdGF0aWMgdmVjdG9yRmllbGRWZXJ0ZXhTaGFkZXI/OiBXZWJHTFNoYWRlcjtcblx0cHJpdmF0ZSBzdGF0aWMgaW5kZXhlZExpbmVzVmVydGV4U2hhZGVyPzogV2ViR0xTaGFkZXI7XG5cdHByaXZhdGUgc3RhdGljIHBvbHlsaW5lVmVydGV4U2hhZGVyPzogV2ViR0xTaGFkZXI7XG5cblx0Y29uc3RydWN0b3IoXG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0IHwgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCxcblx0XHRcdG5hbWU6IHN0cmluZyxcblx0XHRcdGZyYWdtZW50U2hhZGVyOiBzdHJpbmcgfCBzdHJpbmdbXSB8IFdlYkdMU2hhZGVyLC8vIFdlIG1heSB3YW50IHRvIHBhc3MgaW4gYW4gYXJyYXkgb2Ygc2hhZGVyIHN0cmluZyBzb3VyY2VzLCBpZiBzcGxpdCBhY3Jvc3Mgc2V2ZXJhbCBmaWxlcy5cblx0XHRcdGVycm9yQ2FsbGJhY2s6IChtZXNzYWdlOiBzdHJpbmcpID0+IHZvaWQsXG5cdFx0XHRnbHNsVmVyc2lvbjogR0xTTFZlcnNpb24sXG5cdFx0XHR1bmlmb3Jtcz86IHtcblx0XHRcdFx0bmFtZTogc3RyaW5nLFxuXHRcdFx0XHR2YWx1ZTogVW5pZm9ybVZhbHVlVHlwZSxcblx0XHRcdFx0ZGF0YVR5cGU6IFVuaWZvcm1EYXRhVHlwZSxcblx0XHRcdH1bXSxcblx0XHRcdGRlZmluZXM/OiB7Ly8gV2UnbGwgYWxsb3cgc29tZSB2YXJpYWJsZXMgdG8gYmUgcGFzc2VkIGluIGFzICNkZWZpbmUgdG8gdGhlIHByZXByb2Nlc3NvciBmb3IgdGhlIGZyYWdtZW50IHNoYWRlci5cblx0XHRcdFx0W2tleTogc3RyaW5nXTogc3RyaW5nLCAvLyBXZSdsbCBkbyB0aGVzZSBhcyBzdHJpbmdzIHRvIG1ha2UgaXQgZWFzaWVyIHRvIGNvbnRyb2wgZmxvYXQgdnMgaW50LlxuXHRcdFx0fSxcblx0XHR9LFxuXHRcdFxuXHQpIHtcblx0XHRjb25zdCB7IGdsLCBlcnJvckNhbGxiYWNrLCBuYW1lLCBmcmFnbWVudFNoYWRlciwgZ2xzbFZlcnNpb24sIHVuaWZvcm1zLCBkZWZpbmVzIH0gPSBwYXJhbXM7XG5cblx0XHQvLyBTYXZlIGFyZ3VtZW50cy5cblx0XHR0aGlzLmdsID0gZ2w7XG5cdFx0dGhpcy5lcnJvckNhbGxiYWNrID0gZXJyb3JDYWxsYmFjaztcblx0XHR0aGlzLm5hbWUgPSBuYW1lO1xuXHRcdHRoaXMuZ2xzbFZlcnNpb24gPSBnbHNsVmVyc2lvbjtcblxuXHRcdC8vIENvbXBpbGUgZnJhZ21lbnQgc2hhZGVyLlxuXHRcdGlmICh0eXBlb2YoZnJhZ21lbnRTaGFkZXIpID09PSAnc3RyaW5nJyB8fCB0eXBlb2YoKGZyYWdtZW50U2hhZGVyIGFzIHN0cmluZ1tdKVswXSkgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRsZXQgc291cmNlU3RyaW5nID0gdHlwZW9mKGZyYWdtZW50U2hhZGVyKSA9PT0gJ3N0cmluZycgP1xuXHRcdFx0XHRmcmFnbWVudFNoYWRlciA6XG5cdFx0XHRcdChmcmFnbWVudFNoYWRlciBhcyBzdHJpbmdbXSkuam9pbignXFxuJyk7XG5cdFx0XHRpZiAoZGVmaW5lcykge1xuXHRcdFx0XHQvLyBGaXJzdCBjb252ZXJ0IGRlZmluZXMgdG8gYSBzdHJpbmcuXG5cdFx0XHRcdGxldCBkZWZpbmVzU291cmNlID0gJyc7XG5cdFx0XHRcdGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhkZWZpbmVzKTtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0Y29uc3Qga2V5ID0ga2V5c1tpXTtcblx0XHRcdFx0XHQvLyBDaGVjayB0aGF0IGRlZmluZSBpcyBwYXNzZWQgaW4gYXMgYSBzdHJpbmcuXG5cdFx0XHRcdFx0aWYgKCFpc1N0cmluZyhrZXkpIHx8ICFpc1N0cmluZyhkZWZpbmVzW2tleV0pKSB7XG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEdQVVByb2dyYW0gZGVmaW5lcyBtdXN0IGJlIHBhc3NlZCBpbiBhcyBrZXkgdmFsdWUgcGFpcnMgdGhhdCBhcmUgYm90aCBzdHJpbmdzLCBnb3Qga2V5IHZhbHVlIHBhaXIgb2YgdHlwZSAke3R5cGVvZiBrZXl9IDogJHt0eXBlb2YgZGVmaW5lc1trZXldfS5gKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRkZWZpbmVzU291cmNlICs9IGAjZGVmaW5lICR7a2V5fSAke2RlZmluZXNba2V5XX1cXG5gO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHNvdXJjZVN0cmluZyA9IGRlZmluZXNTb3VyY2UgKyBzb3VyY2VTdHJpbmc7XG5cdFx0XHR9XG5cdFx0XHRjb25zdCBzaGFkZXIgPSBjb21waWxlU2hhZGVyKGdsLCBlcnJvckNhbGxiYWNrLCBzb3VyY2VTdHJpbmcsIGdsLkZSQUdNRU5UX1NIQURFUiwgbmFtZSk7XG5cdFx0XHRpZiAoIXNoYWRlcikge1xuXHRcdFx0XHRlcnJvckNhbGxiYWNrKGBVbmFibGUgdG8gY29tcGlsZSBmcmFnbWVudCBzaGFkZXIgZm9yIHByb2dyYW0gXCIke25hbWV9XCIuYCk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdHRoaXMuZnJhZ21lbnRTaGFkZXIgPSBzaGFkZXI7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmIChkZWZpbmVzKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIGF0dGFjaCBkZWZpbmVzIHRvIHByb2dyYW0gXCIke25hbWV9XCIgYmVjYXVzZSBmcmFnbWVudCBzaGFkZXIgaXMgYWxyZWFkeSBjb21waWxlZC5gKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAodW5pZm9ybXMpIHtcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdW5pZm9ybXM/Lmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGNvbnN0IHsgbmFtZSwgdmFsdWUsIGRhdGFUeXBlIH0gPSB1bmlmb3Jtc1tpXTtcblx0XHRcdFx0dGhpcy5zZXRVbmlmb3JtKG5hbWUsIHZhbHVlLCBkYXRhVHlwZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBpbml0UHJvZ3JhbSh2ZXJ0ZXhTaGFkZXI6IFdlYkdMU2hhZGVyLCBwcm9ncmFtTmFtZTogc3RyaW5nKSB7XG5cdFx0Y29uc3QgeyBnbCwgZnJhZ21lbnRTaGFkZXIsIGVycm9yQ2FsbGJhY2ssIHVuaWZvcm1zIH0gPSB0aGlzO1xuXHRcdC8vIENyZWF0ZSBhIHByb2dyYW0uXG5cdFx0Y29uc3QgcHJvZ3JhbSA9IGdsLmNyZWF0ZVByb2dyYW0oKTtcblx0XHRpZiAoIXByb2dyYW0pIHtcblx0XHRcdGVycm9yQ2FsbGJhY2soYFVuYWJsZSB0byBpbml0IGdsIHByb2dyYW06ICR7bmFtZX0uYCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdC8vIFRPRE86IGNoZWNrIHRoYXQgYXR0YWNoU2hhZGVyIHdvcmtlZC5cblx0XHRnbC5hdHRhY2hTaGFkZXIocHJvZ3JhbSwgZnJhZ21lbnRTaGFkZXIpO1xuXHRcdGdsLmF0dGFjaFNoYWRlcihwcm9ncmFtLCB2ZXJ0ZXhTaGFkZXIpO1xuXHRcdC8vIExpbmsgdGhlIHByb2dyYW0uXG5cdFx0Z2wubGlua1Byb2dyYW0ocHJvZ3JhbSk7XG5cdFx0Ly8gQ2hlY2sgaWYgaXQgbGlua2VkLlxuXHRcdGNvbnN0IHN1Y2Nlc3MgPSBnbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHByb2dyYW0sIGdsLkxJTktfU1RBVFVTKTtcblx0XHRpZiAoIXN1Y2Nlc3MpIHtcblx0XHRcdC8vIFNvbWV0aGluZyB3ZW50IHdyb25nIHdpdGggdGhlIGxpbmsuXG5cdFx0XHRlcnJvckNhbGxiYWNrKGBQcm9ncmFtIFwiJHtuYW1lfVwiIGZhaWxlZCB0byBsaW5rOiAke2dsLmdldFByb2dyYW1JbmZvTG9nKHByb2dyYW0pfWApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHQvLyBJZiB3ZSBoYXZlIGFueSB1bmlmb3JtcyBzZXQgZm9yIHRoaXMgR1BVUHJvZ3JhbSwgYWRkIHRob3NlIHRvIFdlYkdMUHJvZ3JhbSB3ZSBqdXN0IGluaXRlZC5cblx0XHRjb25zdCB1bmlmb3JtTmFtZXMgPSBPYmplY3Qua2V5cyh1bmlmb3Jtcyk7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB1bmlmb3JtTmFtZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGNvbnN0IHVuaWZvcm1OYW1lID0gdW5pZm9ybU5hbWVzW2ldO1xuXHRcdFx0Y29uc3QgdW5pZm9ybSA9IHVuaWZvcm1zW3VuaWZvcm1OYW1lXTtcblx0XHRcdGNvbnN0IHsgdmFsdWUsIHR5cGUgfSA9IHVuaWZvcm07XG5cdFx0XHR0aGlzLnNldFByb2dyYW1Vbmlmb3JtKHByb2dyYW0sIHByb2dyYW1OYW1lLCB1bmlmb3JtTmFtZSwgdmFsdWUsIHR5cGUpO1xuXHRcdH1cblx0XHRyZXR1cm4gcHJvZ3JhbTtcblx0fVxuXG5cdGdldCBkZWZhdWx0UHJvZ3JhbSgpIHtcblx0XHRpZiAodGhpcy5fZGVmYXVsdFByb2dyYW0pIHJldHVybiB0aGlzLl9kZWZhdWx0UHJvZ3JhbTtcblx0XHRpZiAoR1BVUHJvZ3JhbS5kZWZhdWx0VmVydGV4U2hhZGVyID09PSB1bmRlZmluZWQpIHtcblx0XHRcdGNvbnN0IHsgZ2wsIG5hbWUsIGVycm9yQ2FsbGJhY2ssIGdsc2xWZXJzaW9uIH0gPSB0aGlzO1xuXHRcdFx0Ly8gSW5pdCBhIGRlZmF1bHQgdmVydGV4IHNoYWRlciB0aGF0IGp1c3QgcGFzc2VzIHRocm91Z2ggc2NyZWVuIGNvb3Jkcy5cblx0XHRcdGNvbnN0IHZlcnRleFNoYWRlclNvdXJjZSA9IGdsc2xWZXJzaW9uID09PSBHTFNMMyA/IHJlcXVpcmUoJy4vZ2xzbF8zL0RlZmF1bHRWZXJ0ZXhTaGFkZXIuZ2xzbCcpIDogcmVxdWlyZSgnLi9nbHNsXzEvRGVmYXVsdFZlcnRleFNoYWRlci5nbHNsJyk7XG5cdFx0XHRjb25zdCBzaGFkZXIgPSBjb21waWxlU2hhZGVyKGdsLCBlcnJvckNhbGxiYWNrLCB2ZXJ0ZXhTaGFkZXJTb3VyY2UsIGdsLlZFUlRFWF9TSEFERVIsIG5hbWUpO1xuXHRcdFx0aWYgKCFzaGFkZXIpIHtcblx0XHRcdFx0ZXJyb3JDYWxsYmFjayhgVW5hYmxlIHRvIGNvbXBpbGUgZGVmYXVsdCB2ZXJ0ZXggc2hhZGVyIGZvciBwcm9ncmFtIFwiJHtuYW1lfVwiLmApO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRHUFVQcm9ncmFtLmRlZmF1bHRWZXJ0ZXhTaGFkZXIgPSBzaGFkZXI7XG5cdFx0fVxuXHRcdGNvbnN0IHByb2dyYW0gPSB0aGlzLmluaXRQcm9ncmFtKEdQVVByb2dyYW0uZGVmYXVsdFZlcnRleFNoYWRlciwgREVGQVVMVF9QUk9HUkFNX05BTUUpO1xuXHRcdHRoaXMuX2RlZmF1bHRQcm9ncmFtID0gcHJvZ3JhbTtcblx0XHRyZXR1cm4gdGhpcy5fZGVmYXVsdFByb2dyYW07XG5cdH1cblxuXHRnZXQgc2VnbWVudFByb2dyYW0oKSB7XG5cdFx0aWYgKHRoaXMuX3NlZ21lbnRQcm9ncmFtKSByZXR1cm4gdGhpcy5fc2VnbWVudFByb2dyYW07XG5cdFx0aWYgKEdQVVByb2dyYW0uc2VnbWVudFZlcnRleFNoYWRlciA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRjb25zdCB7IGdsLCBuYW1lLCBlcnJvckNhbGxiYWNrLCBnbHNsVmVyc2lvbiB9ID0gdGhpcztcblx0XHRcdGNvbnN0IHZlcnRleFNoYWRlclNvdXJjZSA9IGdsc2xWZXJzaW9uID09PSBHTFNMMyA/IHJlcXVpcmUoJy4vZ2xzbF8zL1NlZ21lbnRWZXJ0ZXhTaGFkZXIuZ2xzbCcpIDogcmVxdWlyZSgnLi9nbHNsXzEvU2VnbWVudFZlcnRleFNoYWRlci5nbHNsJyk7XG5cdFx0XHRjb25zdCBzaGFkZXIgPSBjb21waWxlU2hhZGVyKGdsLCBlcnJvckNhbGxiYWNrLCB2ZXJ0ZXhTaGFkZXJTb3VyY2UsIGdsLlZFUlRFWF9TSEFERVIsIG5hbWUpO1xuXHRcdFx0aWYgKCFzaGFkZXIpIHtcblx0XHRcdFx0ZXJyb3JDYWxsYmFjayhgVW5hYmxlIHRvIGNvbXBpbGUgc2VnbWVudCB2ZXJ0ZXggc2hhZGVyIGZvciBwcm9ncmFtIFwiJHtuYW1lfVwiLmApO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRHUFVQcm9ncmFtLnNlZ21lbnRWZXJ0ZXhTaGFkZXIgPSBzaGFkZXI7XG5cdFx0fVxuXHRcdGNvbnN0IHByb2dyYW0gPSB0aGlzLmluaXRQcm9ncmFtKEdQVVByb2dyYW0uc2VnbWVudFZlcnRleFNoYWRlciwgU0VHTUVOVF9QUk9HUkFNX05BTUUpO1xuXHRcdHRoaXMuX3NlZ21lbnRQcm9ncmFtID0gcHJvZ3JhbTtcblx0XHRyZXR1cm4gdGhpcy5fc2VnbWVudFByb2dyYW07XG5cdH1cblxuXHRnZXQgcG9pbnRzUHJvZ3JhbSgpIHtcblx0XHRpZiAodGhpcy5fcG9pbnRzUHJvZ3JhbSkgcmV0dXJuIHRoaXMuX3BvaW50c1Byb2dyYW07XG5cdFx0aWYgKEdQVVByb2dyYW0ucG9pbnRzVmVydGV4U2hhZGVyID09PSB1bmRlZmluZWQpIHtcblx0XHRcdGNvbnN0IHsgZ2wsIG5hbWUsIGVycm9yQ2FsbGJhY2ssIGdsc2xWZXJzaW9uIH0gPSB0aGlzO1xuXHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0Y29uc3QgdmVydGV4U2hhZGVyU291cmNlID0gZ2xzbFZlcnNpb24gPT09IEdMU0wzID8gcG9pbnRzVmVydGV4U2hhZGVyU291cmNlX2dsc2wzIDogcmVxdWlyZSgnLi9nbHNsXzEvUG9pbnRzVmVydGV4U2hhZGVyLmdsc2wnKTtcblx0XHRcdGlmICh2ZXJ0ZXhTaGFkZXJTb3VyY2UgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ05lZWQgdG8gd3JpdGUgZ2xzbDMgdmVyc2lvbiBvZiBwb2ludHNWZXJ0ZXhTaGFkZXIuJyk7XG5cdFx0XHR9XG5cdFx0XHRjb25zdCBzaGFkZXIgPSBjb21waWxlU2hhZGVyKGdsLCBlcnJvckNhbGxiYWNrLCB2ZXJ0ZXhTaGFkZXJTb3VyY2UsIGdsLlZFUlRFWF9TSEFERVIsIG5hbWUpO1xuXHRcdFx0aWYgKCFzaGFkZXIpIHtcblx0XHRcdFx0ZXJyb3JDYWxsYmFjayhgVW5hYmxlIHRvIGNvbXBpbGUgcG9pbnRzIHZlcnRleCBzaGFkZXIgZm9yIHByb2dyYW0gXCIke25hbWV9XCIuYCk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdEdQVVByb2dyYW0ucG9pbnRzVmVydGV4U2hhZGVyID0gc2hhZGVyO1xuXHRcdH1cblx0XHRjb25zdCBwcm9ncmFtID0gdGhpcy5pbml0UHJvZ3JhbShHUFVQcm9ncmFtLnBvaW50c1ZlcnRleFNoYWRlciwgUE9JTlRTX1BST0dSQU1fTkFNRSk7XG5cdFx0dGhpcy5fcG9pbnRzUHJvZ3JhbSA9IHByb2dyYW07XG5cdFx0cmV0dXJuIHRoaXMuX3BvaW50c1Byb2dyYW07XG5cdH1cblxuXHRnZXQgdmVjdG9yRmllbGRQcm9ncmFtKCkge1xuXHRcdGlmICh0aGlzLl92ZWN0b3JGaWVsZFByb2dyYW0pIHJldHVybiB0aGlzLl92ZWN0b3JGaWVsZFByb2dyYW07XG5cdFx0aWYgKEdQVVByb2dyYW0udmVjdG9yRmllbGRWZXJ0ZXhTaGFkZXIgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Y29uc3QgeyBnbCwgbmFtZSwgZXJyb3JDYWxsYmFjaywgZ2xzbFZlcnNpb24gfSA9IHRoaXM7XG5cdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRjb25zdCB2ZXJ0ZXhTaGFkZXJTb3VyY2UgPSBnbHNsVmVyc2lvbiA9PT0gR0xTTDMgPyB2ZWN0b3JGaWVsZFZlcnRleFNoYWRlclNvdXJjZV9nbHNsMyA6IHJlcXVpcmUoJy4vZ2xzbF8xL1ZlY3RvckZpZWxkVmVydGV4U2hhZGVyLmdsc2wnKTtcblx0XHRcdGlmICh2ZXJ0ZXhTaGFkZXJTb3VyY2UgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ05lZWQgdG8gd3JpdGUgZ2xzbDMgdmVyc2lvbiBvZiB2ZWN0b3JGaWVsZFZlcnRleFNoYWRlci4nKTtcblx0XHRcdH1cblx0XHRcdGNvbnN0IHNoYWRlciA9IGNvbXBpbGVTaGFkZXIoZ2wsIGVycm9yQ2FsbGJhY2ssIHZlcnRleFNoYWRlclNvdXJjZSwgZ2wuVkVSVEVYX1NIQURFUiwgbmFtZSk7XG5cdFx0XHRpZiAoIXNoYWRlcikge1xuXHRcdFx0XHRlcnJvckNhbGxiYWNrKGBVbmFibGUgdG8gY29tcGlsZSB2ZWN0b3IgZmllbGQgdmVydGV4IHNoYWRlciBmb3IgcHJvZ3JhbSBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0R1BVUHJvZ3JhbS52ZWN0b3JGaWVsZFZlcnRleFNoYWRlciA9IHNoYWRlcjtcblx0XHR9XG5cdFx0Y29uc3QgcHJvZ3JhbSA9IHRoaXMuaW5pdFByb2dyYW0oR1BVUHJvZ3JhbS52ZWN0b3JGaWVsZFZlcnRleFNoYWRlciwgVkVDVE9SX0ZJRUxEX1BST0dSQU1fTkFNRSk7XG5cdFx0dGhpcy5fdmVjdG9yRmllbGRQcm9ncmFtID0gcHJvZ3JhbTtcblx0XHRyZXR1cm4gdGhpcy5fdmVjdG9yRmllbGRQcm9ncmFtO1xuXHR9XG5cblx0Z2V0IGluZGV4ZWRMaW5lc1Byb2dyYW0oKSB7XG5cdFx0aWYgKHRoaXMuX2luZGV4ZWRMaW5lc1Byb2dyYW0pIHJldHVybiB0aGlzLl9pbmRleGVkTGluZXNQcm9ncmFtO1xuXHRcdGlmIChHUFVQcm9ncmFtLmluZGV4ZWRMaW5lc1ZlcnRleFNoYWRlciA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRjb25zdCB7IGdsLCBuYW1lLCBlcnJvckNhbGxiYWNrLCBnbHNsVmVyc2lvbiB9ID0gdGhpcztcblx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdGNvbnN0IHZlcnRleFNoYWRlclNvdXJjZSA9IGdsc2xWZXJzaW9uID09PSBHTFNMMyA/IGluZGV4ZWRMaW5lc1ZlcnRleFNoYWRlclNvdXJjZV9nbHNsMyA6IHJlcXVpcmUoJy4vZ2xzbF8xL0luZGV4ZWRMaW5lc1ZlcnRleFNoYWRlci5nbHNsJyk7XG5cdFx0XHRpZiAodmVydGV4U2hhZGVyU291cmNlID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdOZWVkIHRvIHdyaXRlIGdsc2wzIHZlcnNpb24gb2YgaW5kZXhlZExpbmVzVmVydGV4U2hhZGVyLicpO1xuXHRcdFx0fVxuXHRcdFx0Y29uc3Qgc2hhZGVyID0gY29tcGlsZVNoYWRlcihnbCwgZXJyb3JDYWxsYmFjaywgdmVydGV4U2hhZGVyU291cmNlLCBnbC5WRVJURVhfU0hBREVSLCBuYW1lKTtcblx0XHRcdGlmICghc2hhZGVyKSB7XG5cdFx0XHRcdGVycm9yQ2FsbGJhY2soYFVuYWJsZSB0byBjb21waWxlIHZlY3RvciBmaWVsZCB2ZXJ0ZXggc2hhZGVyIGZvciBwcm9ncmFtIFwiJHtuYW1lfVwiLmApO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRHUFVQcm9ncmFtLmluZGV4ZWRMaW5lc1ZlcnRleFNoYWRlciA9IHNoYWRlcjtcblx0XHR9XG5cdFx0Y29uc3QgcHJvZ3JhbSA9IHRoaXMuaW5pdFByb2dyYW0oR1BVUHJvZ3JhbS5pbmRleGVkTGluZXNWZXJ0ZXhTaGFkZXIsIElOREVYRURfTElORVNfUFJPR1JBTV9OQU1FKTtcblx0XHR0aGlzLl9pbmRleGVkTGluZXNQcm9ncmFtID0gcHJvZ3JhbTtcblx0XHRyZXR1cm4gdGhpcy5faW5kZXhlZExpbmVzUHJvZ3JhbTtcblx0fVxuXG5cdGdldCBwb2x5bGluZVByb2dyYW0oKSB7XG5cdFx0aWYgKHRoaXMuX3BvbHlsaW5lUHJvZ3JhbSkgcmV0dXJuIHRoaXMuX3BvbHlsaW5lUHJvZ3JhbTtcblx0XHRpZiAoR1BVUHJvZ3JhbS5wb2x5bGluZVZlcnRleFNoYWRlciA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRjb25zdCB7IGdsLCBuYW1lLCBlcnJvckNhbGxiYWNrLCBnbHNsVmVyc2lvbiB9ID0gdGhpcztcblx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdGNvbnN0IHZlcnRleFNoYWRlclNvdXJjZSA9IGdsc2xWZXJzaW9uID09PSBHTFNMMyA/IHBvbHlsaW5lVmVydGV4U2hhZGVyU291cmNlX2dsc2wzIDogcmVxdWlyZSgnLi9nbHNsXzEvUG9seWxpbmVWZXJ0ZXhTaGFkZXIuZ2xzbCcpO1xuXHRcdFx0aWYgKHZlcnRleFNoYWRlclNvdXJjZSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignTmVlZCB0byB3cml0ZSBnbHNsMyB2ZXJzaW9uIG9mIHBvbHlsaW5lVmVydGV4U2hhZGVyLicpO1xuXHRcdFx0fVxuXHRcdFx0Y29uc3Qgc2hhZGVyID0gY29tcGlsZVNoYWRlcihnbCwgZXJyb3JDYWxsYmFjaywgdmVydGV4U2hhZGVyU291cmNlLCBnbC5WRVJURVhfU0hBREVSLCBuYW1lKTtcblx0XHRcdGlmICghc2hhZGVyKSB7XG5cdFx0XHRcdGVycm9yQ2FsbGJhY2soYFVuYWJsZSB0byBjb21waWxlIHZlY3RvciBmaWVsZCB2ZXJ0ZXggc2hhZGVyIGZvciBwcm9ncmFtIFwiJHtuYW1lfVwiLmApO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRHUFVQcm9ncmFtLnBvbHlsaW5lVmVydGV4U2hhZGVyID0gc2hhZGVyO1xuXHRcdH1cblx0XHRjb25zdCBwcm9ncmFtID0gdGhpcy5pbml0UHJvZ3JhbShHUFVQcm9ncmFtLnBvbHlsaW5lVmVydGV4U2hhZGVyLCBQT0xZTElORV9QUk9HUkFNX05BTUUpO1xuXHRcdHRoaXMuX3BvbHlsaW5lUHJvZ3JhbSA9IHByb2dyYW07XG5cdFx0cmV0dXJuIHRoaXMuX3BvbHlsaW5lUHJvZ3JhbTtcblx0fVxuXG5cdHByaXZhdGUgZ2V0IGFjdGl2ZVByb2dyYW1zKCkge1xuXHRcdGNvbnN0IHByb2dyYW1zID0gW107XG5cdFx0aWYgKHRoaXMuX2RlZmF1bHRQcm9ncmFtKSBwcm9ncmFtcy5wdXNoKHtcblx0XHRcdHByb2dyYW06IHRoaXMuX2RlZmF1bHRQcm9ncmFtLFxuXHRcdFx0cHJvZ3JhbU5hbWU6IERFRkFVTFRfUFJPR1JBTV9OQU1FLFxuXHRcdH0pO1xuXHRcdGlmICh0aGlzLl9zZWdtZW50UHJvZ3JhbSkgcHJvZ3JhbXMucHVzaCh7XG5cdFx0XHRwcm9ncmFtOiB0aGlzLl9zZWdtZW50UHJvZ3JhbSxcblx0XHRcdHByb2dyYW1OYW1lOiBTRUdNRU5UX1BST0dSQU1fTkFNRSxcblx0XHR9KTtcblx0XHRpZiAodGhpcy5fcG9pbnRzUHJvZ3JhbSkgcHJvZ3JhbXMucHVzaCh7XG5cdFx0XHRwcm9ncmFtOiB0aGlzLl9wb2ludHNQcm9ncmFtLFxuXHRcdFx0cHJvZ3JhbU5hbWU6IFBPSU5UU19QUk9HUkFNX05BTUUsXG5cdFx0fSk7XG5cdFx0aWYgKHRoaXMuX3ZlY3RvckZpZWxkUHJvZ3JhbSkgcHJvZ3JhbXMucHVzaCh7XG5cdFx0XHRwcm9ncmFtOiB0aGlzLl92ZWN0b3JGaWVsZFByb2dyYW0sXG5cdFx0XHRwcm9ncmFtTmFtZTogVkVDVE9SX0ZJRUxEX1BST0dSQU1fTkFNRSxcblx0XHR9KTtcblx0XHRpZiAodGhpcy5faW5kZXhlZExpbmVzUHJvZ3JhbSkgcHJvZ3JhbXMucHVzaCh7XG5cdFx0XHRwcm9ncmFtOiB0aGlzLl9pbmRleGVkTGluZXNQcm9ncmFtLFxuXHRcdFx0cHJvZ3JhbU5hbWU6IElOREVYRURfTElORVNfUFJPR1JBTV9OQU1FLFxuXHRcdH0pO1xuXHRcdGlmICh0aGlzLl9wb2x5bGluZVByb2dyYW0pIHByb2dyYW1zLnB1c2goe1xuXHRcdFx0cHJvZ3JhbTogdGhpcy5fcG9seWxpbmVQcm9ncmFtLFxuXHRcdFx0cHJvZ3JhbU5hbWU6IFBPTFlMSU5FX1BST0dSQU1fTkFNRSxcblx0XHR9KTtcblx0XHRyZXR1cm4gcHJvZ3JhbXM7XG5cdH1cblxuXHRwcml2YXRlIHVuaWZvcm1UeXBlRm9yVmFsdWUoXG5cdFx0dmFsdWU6IG51bWJlciB8IG51bWJlcltdLFxuXHRcdGRhdGFUeXBlOiBVbmlmb3JtRGF0YVR5cGUsXG5cdCkge1xuXHRcdGlmIChkYXRhVHlwZSA9PT0gRkxPQVQpIHtcblx0XHRcdC8vIENoZWNrIHRoYXQgd2UgYXJlIGRlYWxpbmcgd2l0aCBhIG51bWJlci5cblx0XHRcdGlmIChpc0FycmF5KHZhbHVlKSkge1xuXHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8ICh2YWx1ZSBhcyBudW1iZXJbXSkubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRpZiAoIWlzTnVtYmVyKCh2YWx1ZSBhcyBudW1iZXJbXSlbaV0pKSB7XG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdW5pZm9ybSB2YWx1ZTogJHt2YWx1ZX0gZm9yIHByb2dyYW0gXCIke3RoaXMubmFtZX1cIiwgZXhwZWN0ZWQgZmxvYXQgb3IgZmxvYXRbXSBvZiBsZW5ndGggMS00LmApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKCFpc051bWJlcih2YWx1ZSkpIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdW5pZm9ybSB2YWx1ZTogJHt2YWx1ZX0gZm9yIHByb2dyYW0gXCIke3RoaXMubmFtZX1cIiwgZXhwZWN0ZWQgZmxvYXQgb3IgZmxvYXRbXSBvZiBsZW5ndGggMS00LmApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAoIWlzQXJyYXkodmFsdWUpIHx8ICh2YWx1ZSBhcyBudW1iZXJbXSkubGVuZ3RoID09PSAxKSB7XG5cdFx0XHRcdHJldHVybiBGTE9BVF8xRF9VTklGT1JNO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCh2YWx1ZSBhcyBudW1iZXJbXSkubGVuZ3RoID09PSAyKSB7XG5cdFx0XHRcdHJldHVybiBGTE9BVF8yRF9VTklGT1JNO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCh2YWx1ZSBhcyBudW1iZXJbXSkubGVuZ3RoID09PSAzKSB7XG5cdFx0XHRcdHJldHVybiBGTE9BVF8zRF9VTklGT1JNO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCh2YWx1ZSBhcyBudW1iZXJbXSkubGVuZ3RoID09PSA0KSB7XG5cdFx0XHRcdHJldHVybiBGTE9BVF80RF9VTklGT1JNO1xuXHRcdFx0fVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHVuaWZvcm0gdmFsdWU6ICR7dmFsdWV9IGZvciBwcm9ncmFtIFwiJHt0aGlzLm5hbWV9XCIsIGV4cGVjdGVkIGZsb2F0IG9yIGZsb2F0W10gb2YgbGVuZ3RoIDEtNC5gKTtcblx0XHR9IGVsc2UgaWYgKGRhdGFUeXBlID09PSBJTlQpIHtcblx0XHRcdC8vIENoZWNrIHRoYXQgd2UgYXJlIGRlYWxpbmcgd2l0aCBhbiBpbnQuXG5cdFx0XHRpZiAoaXNBcnJheSh2YWx1ZSkpIHtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCAodmFsdWUgYXMgbnVtYmVyW10pLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0aWYgKCFpc0ludGVnZXIoKHZhbHVlIGFzIG51bWJlcltdKVtpXSkpIHtcblx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB1bmlmb3JtIHZhbHVlOiAke3ZhbHVlfSBmb3IgcHJvZ3JhbSBcIiR7dGhpcy5uYW1lfVwiLCBleHBlY3RlZCBpbnQgb3IgaW50W10gb2YgbGVuZ3RoIDEtNC5gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmICghaXNJbnRlZ2VyKHZhbHVlKSkge1xuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB1bmlmb3JtIHZhbHVlOiAke3ZhbHVlfSBmb3IgcHJvZ3JhbSBcIiR7dGhpcy5uYW1lfVwiLCBleHBlY3RlZCBpbnQgb3IgaW50W10gb2YgbGVuZ3RoIDEtNC5gKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKCFpc0FycmF5KHZhbHVlKSB8fCAodmFsdWUgYXMgbnVtYmVyW10pLmxlbmd0aCA9PT0gMSkge1xuXHRcdFx0XHRyZXR1cm4gSU5UXzFEX1VOSUZPUk07XG5cdFx0XHR9XG5cdFx0XHRpZiAoKHZhbHVlIGFzIG51bWJlcltdKS5sZW5ndGggPT09IDIpIHtcblx0XHRcdFx0cmV0dXJuIElOVF8yRF9VTklGT1JNO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCh2YWx1ZSBhcyBudW1iZXJbXSkubGVuZ3RoID09PSAzKSB7XG5cdFx0XHRcdHJldHVybiBJTlRfM0RfVU5JRk9STTtcblx0XHRcdH1cblx0XHRcdGlmICgodmFsdWUgYXMgbnVtYmVyW10pLmxlbmd0aCA9PT0gNCkge1xuXHRcdFx0XHRyZXR1cm4gSU5UXzREX1VOSUZPUk07XG5cdFx0XHR9XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdW5pZm9ybSB2YWx1ZTogJHt2YWx1ZX0gZm9yIHByb2dyYW0gXCIke3RoaXMubmFtZX1cIiwgZXhwZWN0ZWQgaW50IG9yIGludFtdIG9mIGxlbmd0aCAxLTQuYCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB1bmlmb3JtIGRhdGEgdHlwZTogJHtkYXRhVHlwZX0gZm9yIHByb2dyYW0gXCIke3RoaXMubmFtZX1cIiwgZXhwZWN0ZWQgJHtGTE9BVH0gb3IgJHtJTlR9LmApO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgc2V0UHJvZ3JhbVVuaWZvcm0oXG5cdFx0cHJvZ3JhbTogV2ViR0xQcm9ncmFtLFxuXHRcdHByb2dyYW1OYW1lOiBzdHJpbmcsXG5cdFx0dW5pZm9ybU5hbWU6IHN0cmluZyxcblx0XHR2YWx1ZTogVW5pZm9ybVZhbHVlVHlwZSxcblx0XHR0eXBlOiBVbmlmb3JtVHlwZSxcblx0KSB7XG5cdFx0Y29uc3QgeyBnbCwgdW5pZm9ybXMsIGVycm9yQ2FsbGJhY2sgfSA9IHRoaXM7XG5cdFx0Ly8gU2V0IGFjdGl2ZSBwcm9ncmFtLlxuXHRcdGdsLnVzZVByb2dyYW0ocHJvZ3JhbSk7XG5cblx0XHRsZXQgbG9jYXRpb24gPSB1bmlmb3Jtc1t1bmlmb3JtTmFtZV0/LmxvY2F0aW9uW3Byb2dyYW1OYW1lXTtcblx0XHQvLyBJbml0IGEgbG9jYXRpb24gZm9yIFdlYkdMUHJvZ3JhbSBpZiBuZWVkZWQuXG5cdFx0aWYgKGxvY2F0aW9uID09PSB1bmRlZmluZWQpIHtcblx0XHRcdGNvbnN0IF9sb2NhdGlvbiA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihwcm9ncmFtLCB1bmlmb3JtTmFtZSk7XG5cdFx0XHRpZiAoIV9sb2NhdGlvbikge1xuXHRcdFx0XHRlcnJvckNhbGxiYWNrKGBDb3VsZCBub3QgaW5pdCB1bmlmb3JtIFwiJHt1bmlmb3JtTmFtZX1cIiBmb3IgcHJvZ3JhbSBcIiR7dGhpcy5uYW1lfVwiLlxuQ2hlY2sgdGhhdCB1bmlmb3JtIGlzIHByZXNlbnQgaW4gc2hhZGVyIGNvZGUsIHVudXNlZCB1bmlmb3JtcyBtYXkgYmUgcmVtb3ZlZCBieSBjb21waWxlci5cbkFsc28gY2hlY2sgdGhhdCB1bmlmb3JtIHR5cGUgaW4gc2hhZGVyIGNvZGUgbWF0Y2hlcyB0eXBlICR7dHlwZX0uXG5FcnJvciBjb2RlOiAke2dsLmdldEVycm9yKCl9LmApO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRsb2NhdGlvbiA9IF9sb2NhdGlvbjtcblx0XHRcdC8vIFNhdmUgbG9jYXRpb24gZm9yIGZ1dHVyZSB1c2UuXG5cdFx0XHRpZiAodW5pZm9ybXNbdW5pZm9ybU5hbWVdKSB7XG5cdFx0XHRcdHVuaWZvcm1zW3VuaWZvcm1OYW1lXS5sb2NhdGlvbltwcm9ncmFtTmFtZV0gPSBsb2NhdGlvbjtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBTZXQgdW5pZm9ybS5cblx0XHQvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvV2ViR0xSZW5kZXJpbmdDb250ZXh0L3VuaWZvcm1cblx0XHRzd2l0Y2ggKHR5cGUpIHtcblx0XHRcdGNhc2UgRkxPQVRfMURfVU5JRk9STTpcblx0XHRcdFx0Z2wudW5pZm9ybTFmKGxvY2F0aW9uLCB2YWx1ZSBhcyBudW1iZXIpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgRkxPQVRfMkRfVU5JRk9STTpcblx0XHRcdFx0Z2wudW5pZm9ybTJmdihsb2NhdGlvbiwgdmFsdWUgYXMgbnVtYmVyW10pO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgRkxPQVRfM0RfVU5JRk9STTpcblx0XHRcdFx0Z2wudW5pZm9ybTNmdihsb2NhdGlvbiwgdmFsdWUgYXMgbnVtYmVyW10pO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgRkxPQVRfNERfVU5JRk9STTpcblx0XHRcdFx0Z2wudW5pZm9ybTRmdihsb2NhdGlvbiwgdmFsdWUgYXMgbnVtYmVyW10pO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgSU5UXzFEX1VOSUZPUk06XG5cdFx0XHRcdGdsLnVuaWZvcm0xaShsb2NhdGlvbiwgdmFsdWUgYXMgbnVtYmVyKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIElOVF8yRF9VTklGT1JNOlxuXHRcdFx0XHRnbC51bmlmb3JtMml2KGxvY2F0aW9uLCB2YWx1ZSBhcyBudW1iZXJbXSk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBJTlRfM0RfVU5JRk9STTpcblx0XHRcdFx0Z2wudW5pZm9ybTNpdihsb2NhdGlvbiwgdmFsdWUgYXMgbnVtYmVyW10pO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgSU5UXzREX1VOSUZPUk06XG5cdFx0XHRcdGdsLnVuaWZvcm00aXYobG9jYXRpb24sIHZhbHVlIGFzIG51bWJlcltdKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gdW5pZm9ybSB0eXBlICR7dHlwZX0gZm9yIEdQVVByb2dyYW0gXCIke3RoaXMubmFtZX1cIi5gKTtcblx0XHR9XG5cdH1cblxuXHRzZXRVbmlmb3JtKFxuXHRcdHVuaWZvcm1OYW1lOiBzdHJpbmcsXG5cdFx0dmFsdWU6IFVuaWZvcm1WYWx1ZVR5cGUsXG5cdFx0ZGF0YVR5cGU/OiBVbmlmb3JtRGF0YVR5cGUsXG5cdCkge1xuXHRcdGNvbnN0IHsgYWN0aXZlUHJvZ3JhbXMsIHVuaWZvcm1zIH0gPSB0aGlzO1xuXG5cdFx0bGV0IHR5cGUgPSB1bmlmb3Jtc1t1bmlmb3JtTmFtZV0/LnR5cGU7XG5cdFx0aWYgKGRhdGFUeXBlKSB7XG5cdFx0XHRjb25zdCB0eXBlUGFyYW0gPSB0aGlzLnVuaWZvcm1UeXBlRm9yVmFsdWUodmFsdWUsIGRhdGFUeXBlKTtcblx0XHRcdGlmICh0eXBlID09PSB1bmRlZmluZWQpIHR5cGUgPSB0eXBlUGFyYW07XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0Ly8gY29uc29sZS53YXJuKGBEb24ndCBuZWVkIHRvIHBhc3MgaW4gZGF0YVR5cGUgdG8gR1BVUHJvZ3JhbS5zZXRVbmlmb3JtIGZvciBwcmV2aW91c2x5IGluaXRlZCB1bmlmb3JtIFwiJHt1bmlmb3JtTmFtZX1cImApO1xuXHRcdFx0XHQvLyBDaGVjayB0aGF0IHR5cGVzIG1hdGNoIHByZXZpb3VzbHkgc2V0IHVuaWZvcm0uXG5cdFx0XHRcdGlmICh0eXBlICE9PSB0eXBlUGFyYW0pIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuaWZvcm0gXCIke3VuaWZvcm1OYW1lfVwiIGZvciBHUFVQcm9ncmFtIFwiJHt0aGlzLm5hbWV9XCIgY2Fubm90IGNoYW5nZSBmcm9tIHR5cGUgJHt0eXBlfSB0byB0eXBlICR7dHlwZVBhcmFtfS5gKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAodHlwZSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gdHlwZSBmb3IgdW5pZm9ybSBcIiR7dW5pZm9ybU5hbWV9XCIsIHBsZWFzZSBwYXNzIGluIGRhdGFUeXBlIHRvIEdQVVByb2dyYW0uc2V0VW5pZm9ybSB3aGVuIGluaXRpbmcgYSBuZXcgdW5pZm9ybS5gKTtcblx0XHR9XG5cblx0XHRpZiAoIXVuaWZvcm1zW3VuaWZvcm1OYW1lXSkge1xuXHRcdFx0Ly8gSW5pdCB1bmlmb3JtIGlmIG5lZWRlZC5cblx0XHRcdHVuaWZvcm1zW3VuaWZvcm1OYW1lXSA9IHsgdHlwZSwgbG9jYXRpb246IHt9LCB2YWx1ZSB9O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBVcGRhdGUgdmFsdWUuXG5cdFx0XHR1bmlmb3Jtc1t1bmlmb3JtTmFtZV0udmFsdWUgPSB2YWx1ZTtcblx0XHR9XG5cblx0XHQvLyBVcGRhdGUgYW55IGFjdGl2ZSBwcm9ncmFtcy5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGFjdGl2ZVByb2dyYW1zLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRjb25zdCB7IHByb2dyYW0sIHByb2dyYW1OYW1lIH0gPSBhY3RpdmVQcm9ncmFtc1tpXTtcblx0XHRcdHRoaXMuc2V0UHJvZ3JhbVVuaWZvcm0ocHJvZ3JhbSwgcHJvZ3JhbU5hbWUsIHVuaWZvcm1OYW1lLCB2YWx1ZSwgdHlwZSk7XG5cdFx0fVxuXHR9O1xuXG5cdHNldFZlcnRleFVuaWZvcm0oXG5cdFx0cHJvZ3JhbTogV2ViR0xQcm9ncmFtLFxuXHRcdHVuaWZvcm1OYW1lOiBzdHJpbmcsXG5cdFx0dmFsdWU6IFVuaWZvcm1WYWx1ZVR5cGUsXG5cdFx0ZGF0YVR5cGU6IFVuaWZvcm1EYXRhVHlwZSxcblx0KSB7XG5cdFx0Y29uc3QgdHlwZSA9IHRoaXMudW5pZm9ybVR5cGVGb3JWYWx1ZSh2YWx1ZSwgZGF0YVR5cGUpO1xuXHRcdGlmIChwcm9ncmFtID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignTXVzdCBwYXNzIGluIHZhbGlkIFdlYkdMUHJvZ3JhbSB0byBzZXRWZXJ0ZXhVbmlmb3JtLCBnb3QgdW5kZWZpbmVkLicpO1xuXHRcdH1cblx0XHRsZXQgcHJvZ3JhbU5hbWU6IHN0cmluZyB8IHVuZGVmaW5lZDtcblx0XHRzd2l0Y2gocHJvZ3JhbSkge1xuXHRcdFx0Y2FzZSB0aGlzLl9kZWZhdWx0UHJvZ3JhbTpcblx0XHRcdFx0cHJvZ3JhbU5hbWUgPSBERUZBVUxUX1BST0dSQU1fTkFNRTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIHRoaXMuX3NlZ21lbnRQcm9ncmFtOlxuXHRcdFx0XHRwcm9ncmFtTmFtZSA9IFNFR01FTlRfUFJPR1JBTV9OQU1FO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgdGhpcy5fcG9pbnRzUHJvZ3JhbTpcblx0XHRcdFx0cHJvZ3JhbU5hbWUgPSBQT0lOVFNfUFJPR1JBTV9OQU1FO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgdGhpcy5fdmVjdG9yRmllbGRQcm9ncmFtOlxuXHRcdFx0XHRwcm9ncmFtTmFtZSA9IFZFQ1RPUl9GSUVMRF9QUk9HUkFNX05BTUU7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSB0aGlzLl9pbmRleGVkTGluZXNQcm9ncmFtOlxuXHRcdFx0XHRwcm9ncmFtTmFtZSA9IElOREVYRURfTElORVNfUFJPR1JBTV9OQU1FO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgdGhpcy5fcG9seWxpbmVQcm9ncmFtOlxuXHRcdFx0XHRwcm9ncmFtTmFtZSA9IFBPTFlMSU5FX1BST0dSQU1fTkFNRTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIHZhbGlkIHZlcnRleCBwcm9ncmFtTmFtZSBmb3IgV2ViR0xQcm9ncmFtIFwiJHt0aGlzLm5hbWV9XCIuYCk7XG5cdFx0fVxuXHRcdHRoaXMuc2V0UHJvZ3JhbVVuaWZvcm0ocHJvZ3JhbSwgcHJvZ3JhbU5hbWUsIHVuaWZvcm1OYW1lLCB2YWx1ZSwgdHlwZSk7XG5cdH1cblxuXHRkZXN0cm95KCkge1xuXHRcdGNvbnN0IHsgZ2wsIGZyYWdtZW50U2hhZGVyLCBhY3RpdmVQcm9ncmFtcyB9ID0gdGhpcztcblx0XHQvLyBVbmJpbmQgYWxsIGdsIGRhdGEgYmVmb3JlIGRlbGV0aW5nLlxuXHRcdGFjdGl2ZVByb2dyYW1zLmZvckVhY2goKHsgcHJvZ3JhbSB9KSA9PiB7XG5cdFx0XHRnbC5kZWxldGVQcm9ncmFtKHByb2dyYW0pO1xuXHRcdH0pO1xuXHRcdC8vIEZyb20gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1dlYkdMUmVuZGVyaW5nQ29udGV4dC9kZWxldGVTaGFkZXJcblx0XHQvLyBUaGlzIG1ldGhvZCBoYXMgbm8gZWZmZWN0IGlmIHRoZSBzaGFkZXIgaGFzIGFscmVhZHkgYmVlbiBkZWxldGVkXG5cdFx0Z2wuZGVsZXRlU2hhZGVyKGZyYWdtZW50U2hhZGVyKTtcblxuXHRcdGRlbGV0ZSB0aGlzLl9kZWZhdWx0UHJvZ3JhbTtcblx0XHRkZWxldGUgdGhpcy5fc2VnbWVudFByb2dyYW07XG5cdFx0ZGVsZXRlIHRoaXMuX3BvaW50c1Byb2dyYW07XG5cdFx0ZGVsZXRlIHRoaXMuX3ZlY3RvckZpZWxkUHJvZ3JhbTtcblx0XHRkZWxldGUgdGhpcy5faW5kZXhlZExpbmVzUHJvZ3JhbTtcblx0XHRkZWxldGUgdGhpcy5fcG9seWxpbmVQcm9ncmFtO1xuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHRkZWxldGUgdGhpcy5mcmFnbWVudFNoYWRlcjtcblxuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHRkZWxldGUgdGhpcy5nbDtcblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0ZGVsZXRlIHRoaXMuZXJyb3JDYWxsYmFjaztcblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0ZGVsZXRlIHRoaXMucHJvZ3JhbTtcblx0fVxufVxuIiwiaW1wb3J0IHsgc2F2ZUFzIH0gZnJvbSAnZmlsZS1zYXZlcic7XG4vLyBAdHMtaWdub3JlXG5pbXBvcnQgeyBjaGFuZ2VEcGlCbG9iIH0gZnJvbSAnY2hhbmdlZHBpJztcbmltcG9ydCB7IERhdGFMYXllciB9IGZyb20gJy4vRGF0YUxheWVyJztcbmltcG9ydCB7XG5cdERhdGFMYXllckFycmF5VHlwZSwgRGF0YUxheWVyRmlsdGVyVHlwZSwgRGF0YUxheWVyTnVtQ29tcG9uZW50cywgRGF0YUxheWVyVHlwZSwgRGF0YUxheWVyV3JhcFR5cGUsXG5cdEZMT0FULCBIQUxGX0ZMT0FULCBVTlNJR05FRF9CWVRFLCBCWVRFLCBVTlNJR05FRF9TSE9SVCwgU0hPUlQsIFVOU0lHTkVEX0lOVCwgSU5ULFxuXHRVbmlmb3JtRGF0YVR5cGUsIFVuaWZvcm1WYWx1ZVR5cGUsIEdMU0xWZXJzaW9uLCBHTFNMMSwgR0xTTDMsIENMQU1QX1RPX0VER0UsIFRleHR1cmVGb3JtYXRUeXBlLCBORUFSRVNULCBSR0JBLCBUZXh0dXJlRGF0YVR5cGUsXG59IGZyb20gJy4vQ29uc3RhbnRzJztcbmltcG9ydCB7IEdQVVByb2dyYW0gfSBmcm9tICcuL0dQVVByb2dyYW0nO1xuaW1wb3J0IHsgV2ViR0xSZW5kZXJlciwgVGV4dHVyZSwgVmVjdG9yNCB9IGZyb20gJ3RocmVlJzsvLyBKdXN0IGltcG9ydGluZyB0aGUgdHlwZXMgaGVyZS5cbmltcG9ydCAqIGFzIHV0aWxzIGZyb20gJy4vdXRpbHMvVmVjdG9yNCc7XG5pbXBvcnQgeyBpc1dlYkdMMiwgaXNQb3dlck9mMiB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgZ2V0RmxvYXQxNiB9IGZyb20gJ0BwZXRhbW9yaWtlbi9mbG9hdDE2JztcbmltcG9ydCB7XG5cdGlzQXJyYXksXG5cdGlzU3RyaW5nLCBpc1ZhbGlkRmlsdGVyVHlwZSwgaXNWYWxpZFRleHR1cmVEYXRhVHlwZSwgaXNWYWxpZFRleHR1cmVGb3JtYXRUeXBlLCBpc1ZhbGlkV3JhcFR5cGUsXG5cdHZhbGlkRmlsdGVyVHlwZXMsIHZhbGlkVGV4dHVyZURhdGFUeXBlcywgdmFsaWRUZXh0dXJlRm9ybWF0VHlwZXMsIHZhbGlkV3JhcFR5cGVzIH0gZnJvbSAnLi9DaGVja3MnO1xuXG5jb25zdCBERUZBVUxUX0NJUkNMRV9OVU1fU0VHTUVOVFMgPSAxODsvLyBNdXN0IGJlIGRpdmlzaWJsZSBieSA2IHRvIHdvcmsgd2l0aCBzdGVwU2VnbWVudCgpLlxuXG50eXBlIEVycm9yQ2FsbGJhY2sgPSAobWVzc2FnZTogc3RyaW5nKSA9PiB2b2lkO1xuXG5leHBvcnQgY2xhc3MgV2ViR0xDb21wdXRlIHtcblx0cmVhZG9ubHkgZ2whOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQgfCBXZWJHTDJSZW5kZXJpbmdDb250ZXh0O1xuXHRyZWFkb25seSBnbHNsVmVyc2lvbiE6IEdMU0xWZXJzaW9uO1xuXHQvLyBUaGVzZSB3aWR0aCBhbmQgaGVpZ2h0IGFyZSB0aGUgY3VycmVudCBjYW52YXMgYXQgZnVsbCByZXMuXG5cdHByaXZhdGUgd2lkdGghOiBudW1iZXI7XG5cdHByaXZhdGUgaGVpZ2h0ITogbnVtYmVyO1xuXG5cdHByaXZhdGUgZXJyb3JTdGF0ZSA9IGZhbHNlO1xuXHRwcml2YXRlIHJlYWRvbmx5IGVycm9yQ2FsbGJhY2s6IEVycm9yQ2FsbGJhY2s7XG5cblx0Ly8gU2F2ZSB0aHJlZWpzIHJlbmRlcmVyIGlmIHBhc3NlZCBpbi5cblx0cHJpdmF0ZSByZW5kZXJlcj86IFdlYkdMUmVuZGVyZXI7XG5cdHByaXZhdGUgcmVhZG9ubHkgbWF4TnVtVGV4dHVyZXMhOiBudW1iZXI7XG5cdFxuXHQvLyBQcmVjb21wdXRlZCBidWZmZXJzIChpbml0ZWQgYXMgbmVlZGVkKS5cblx0cHJpdmF0ZSBfcXVhZFBvc2l0aW9uc0J1ZmZlcj86IFdlYkdMQnVmZmVyO1xuXHRwcml2YXRlIF9ib3VuZGFyeVBvc2l0aW9uc0J1ZmZlcj86IFdlYkdMQnVmZmVyO1xuXHQvLyBTdG9yZSBtdWx0aXBsZSBjaXJjbGUgcG9zaXRpb25zIGJ1ZmZlcnMgZm9yIHZhcmlvdXMgbnVtIHNlZ21lbnRzLCB1c2UgbnVtU2VnbWVudHMgYXMga2V5LlxuXHRwcml2YXRlIF9jaXJjbGVQb3NpdGlvbnNCdWZmZXI6IHsgW2tleTogbnVtYmVyXTogV2ViR0xCdWZmZXIgfSA9IHt9O1xuXG5cdHByaXZhdGUgcG9pbnRJbmRleEFycmF5PzogRmxvYXQzMkFycmF5O1xuXHRwcml2YXRlIHBvaW50SW5kZXhCdWZmZXI/OiBXZWJHTEJ1ZmZlcjtcblx0cHJpdmF0ZSB2ZWN0b3JGaWVsZEluZGV4QXJyYXk/OiBGbG9hdDMyQXJyYXk7XG5cdHByaXZhdGUgdmVjdG9yRmllbGRJbmRleEJ1ZmZlcj86IFdlYkdMQnVmZmVyO1xuXHRwcml2YXRlIGluZGV4ZWRMaW5lc0luZGV4QnVmZmVyPzogV2ViR0xCdWZmZXI7XG5cblx0Ly8gUHJvZ3JhbXMgZm9yIGNvcHlpbmcgZGF0YSAodGhlc2UgYXJlIG5lZWRlZCBmb3IgcmVuZGVyaW5nIHBhcnRpYWwgc2NyZWVuIGdlb21ldHJpZXMpLlxuXHRwcml2YXRlIHJlYWRvbmx5IGNvcHlGbG9hdFByb2dyYW0hOiBHUFVQcm9ncmFtO1xuXHRwcml2YXRlIHJlYWRvbmx5IGNvcHlJbnRQcm9ncmFtITogR1BVUHJvZ3JhbTtcblx0cHJpdmF0ZSByZWFkb25seSBjb3B5VWludFByb2dyYW0hOiBHUFVQcm9ncmFtO1xuXG5cdC8vIE90aGVyIHV0aWwgcHJvZ3JhbXMuXG5cdHByaXZhdGUgX3NpbmdsZUNvbG9yUHJvZ3JhbT86IEdQVVByb2dyYW07XG5cdHByaXZhdGUgX3NpbmdsZUNvbG9yV2l0aFdyYXBDaGVja1Byb2dyYW0/OiBHUFVQcm9ncmFtO1xuXG5cdHN0YXRpYyBpbml0V2l0aFRocmVlUmVuZGVyZXIoXG5cdFx0cmVuZGVyZXI6IFdlYkdMUmVuZGVyZXIsXG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRnbHNsVmVyc2lvbj86IEdMU0xWZXJzaW9uLFxuXHRcdH0sXG5cdFx0ZXJyb3JDYWxsYmFjaz86IEVycm9yQ2FsbGJhY2ssXG5cdCkge1xuXHRcdHJldHVybiBuZXcgV2ViR0xDb21wdXRlKFxuXHRcdFx0e1xuXHRcdFx0XHRjYW52YXM6IHJlbmRlcmVyLmRvbUVsZW1lbnQsXG5cdFx0XHRcdGNvbnRleHQ6IHJlbmRlcmVyLmdldENvbnRleHQoKSxcblx0XHRcdFx0Li4ucGFyYW1zLFxuXHRcdFx0fSxcblx0XHRcdGVycm9yQ2FsbGJhY2ssXG5cdFx0XHRyZW5kZXJlcixcblx0XHQpO1xuXHR9XG5cblx0Y29uc3RydWN0b3IoXG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LFxuXHRcdFx0Y29udGV4dD86IFdlYkdMUmVuZGVyaW5nQ29udGV4dCB8IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQgfCBudWxsLFxuXHRcdFx0YW50aWFsaWFzPzogYm9vbGVhbixcblx0XHRcdGdsc2xWZXJzaW9uPzogR0xTTFZlcnNpb24sXG5cdFx0fSxcblx0XHQvLyBPcHRpb25hbGx5IHBhc3MgaW4gYW4gZXJyb3IgY2FsbGJhY2sgaW4gY2FzZSB3ZSB3YW50IHRvIGhhbmRsZSBlcnJvcnMgcmVsYXRlZCB0byB3ZWJnbCBzdXBwb3J0LlxuXHRcdC8vIGUuZy4gdGhyb3cgdXAgYSBtb2RhbCB0ZWxsaW5nIHVzZXIgdGhpcyB3aWxsIG5vdCB3b3JrIG9uIHRoZWlyIGRldmljZS5cblx0XHRlcnJvckNhbGxiYWNrOiBFcnJvckNhbGxiYWNrID0gKG1lc3NhZ2U6IHN0cmluZykgPT4geyB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSkgfSxcblx0XHRyZW5kZXJlcj86IFdlYkdMUmVuZGVyZXIsXG5cdCkge1xuXHRcdC8vIENoZWNrIHBhcmFtcy5cblx0XHRjb25zdCB2YWxpZEtleXMgPSBbJ2NhbnZhcycsICdjb250ZXh0JywgJ2FudGlhbGlhcycsICdnbHNsVmVyc2lvbiddO1xuXHRcdE9iamVjdC5rZXlzKHBhcmFtcykuZm9yRWFjaChrZXkgPT4ge1xuXHRcdFx0aWYgKHZhbGlkS2V5cy5pbmRleE9mKGtleSkgPCAwKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBrZXkgJHtrZXl9IHBhc3NlZCB0byBXZWJHTENvbXB1dGUuY29uc3RydWN0b3IuICBWYWxpZCBrZXlzIGFyZSAke3ZhbGlkS2V5cy5qb2luKCcsICcpfS5gKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHQvLyBTYXZlIGNhbGxiYWNrIGluIGNhc2Ugd2UgcnVuIGludG8gYW4gZXJyb3IuXG5cdFx0Y29uc3Qgc2VsZiA9IHRoaXM7XG5cdFx0dGhpcy5lcnJvckNhbGxiYWNrID0gKG1lc3NhZ2U6IHN0cmluZykgPT4ge1xuXHRcdFx0aWYgKHNlbGYuZXJyb3JTdGF0ZSkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRzZWxmLmVycm9yU3RhdGUgPSB0cnVlO1xuXHRcdFx0ZXJyb3JDYWxsYmFjayhtZXNzYWdlKTtcblx0XHR9XG5cblx0XHRjb25zdCB7IGNhbnZhcyB9ID0gcGFyYW1zO1xuXHRcdGxldCBnbCA9IHBhcmFtcy5jb250ZXh0O1xuXG5cdFx0Ly8gSW5pdCBHTC5cblx0XHRpZiAoIWdsKSB7XG5cdFx0XHRjb25zdCBvcHRpb25zOiBhbnkgPSB7fTtcblx0XHRcdGlmIChwYXJhbXMuYW50aWFsaWFzICE9PSB1bmRlZmluZWQpIG9wdGlvbnMuYW50aWFsaWFzID0gcGFyYW1zLmFudGlhbGlhcztcblx0XHRcdC8vIEluaXQgYSBnbCBjb250ZXh0IGlmIG5vdCBwYXNzZWQgaW4uXG5cdFx0XHRnbCA9IGNhbnZhcy5nZXRDb250ZXh0KCd3ZWJnbDInLCBvcHRpb25zKSAgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCB8IG51bGxcblx0XHRcdFx0fHwgY2FudmFzLmdldENvbnRleHQoJ3dlYmdsJywgb3B0aW9ucykgIGFzIFdlYkdMUmVuZGVyaW5nQ29udGV4dCB8IG51bGxcblx0XHRcdFx0fHwgY2FudmFzLmdldENvbnRleHQoJ2V4cGVyaW1lbnRhbC13ZWJnbCcsIG9wdGlvbnMpICBhcyBXZWJHTFJlbmRlcmluZ0NvbnRleHQgfCBudWxsO1xuXHRcdFx0aWYgKGdsID09PSBudWxsKSB7XG5cdFx0XHRcdHRoaXMuZXJyb3JDYWxsYmFjaygnVW5hYmxlIHRvIGluaXRpYWxpemUgV2ViR0wgY29udGV4dC4nKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAoaXNXZWJHTDIoZ2wpKSB7XG5cdFx0XHRjb25zb2xlLmxvZygnVXNpbmcgV2ViR0wgMi4wIGNvbnRleHQuJyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnNvbGUubG9nKCdVc2luZyBXZWJHTCAxLjAgY29udGV4dC4nKTtcblx0XHR9XG5cdFx0dGhpcy5nbCA9IGdsO1xuXHRcdHRoaXMucmVuZGVyZXIgPSByZW5kZXJlcjtcblxuXHRcdC8vIFNhdmUgZ2xzbCB2ZXJzaW9uLCBkZWZhdWx0IHRvIDEueC5cblx0XHRjb25zdCBnbHNsVmVyc2lvbiA9IHBhcmFtcy5nbHNsVmVyc2lvbiA9PT0gdW5kZWZpbmVkID8gR0xTTDEgOiBwYXJhbXMuZ2xzbFZlcnNpb247XG5cdFx0dGhpcy5nbHNsVmVyc2lvbiA9IGdsc2xWZXJzaW9uO1xuXHRcdGlmICghaXNXZWJHTDIoZ2wpICYmIGdsc2xWZXJzaW9uID09PSBHTFNMMykge1xuXHRcdFx0Y29uc29sZS53YXJuKCdHTFNMMy54IGlzIGluY29tcGF0aWJsZSB3aXRoIFdlYkdMMS4wIGNvbnRleHRzLicpO1xuXHRcdH1cblxuXHRcdC8vIEdMIHNldHVwLlxuXHRcdC8vIERpc2FibGUgZGVwdGggdGVzdGluZyBnbG9iYWxseS5cblx0XHRnbC5kaXNhYmxlKGdsLkRFUFRIX1RFU1QpO1xuXHRcdC8vIFNldCB1bnBhY2sgYWxpZ25tZW50IHRvIDEgc28gd2UgY2FuIGhhdmUgdGV4dHVyZXMgb2YgYXJiaXRyYXJ5IGRpbWVuc2lvbnMuXG5cdFx0Ly8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTE1ODIyODIvZXJyb3Itd2hlbi1jcmVhdGluZy10ZXh0dXJlcy1pbi13ZWJnbC13aXRoLXRoZS1yZ2ItZm9ybWF0XG5cdFx0Z2wucGl4ZWxTdG9yZWkoZ2wuVU5QQUNLX0FMSUdOTUVOVCwgMSk7XG5cdFx0Ly8gVE9ETzogbG9vayBpbnRvIG1vcmUgb2YgdGhlc2U6IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9XZWJHTFJlbmRlcmluZ0NvbnRleHQvcGl4ZWxTdG9yZWlcblx0XHQvLyAvLyBTb21lIGltcGxlbWVudGF0aW9ucyBvZiBIVE1MQ2FudmFzRWxlbWVudCdzIG9yIE9mZnNjcmVlbkNhbnZhcydzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBzdG9yZSBjb2xvciB2YWx1ZXNcblx0XHQvLyAvLyBpbnRlcm5hbGx5IGluIHByZW11bHRpcGxpZWQgZm9ybS4gSWYgc3VjaCBhIGNhbnZhcyBpcyB1cGxvYWRlZCB0byBhIFdlYkdMIHRleHR1cmUgd2l0aCB0aGVcblx0XHQvLyAvLyBVTlBBQ0tfUFJFTVVMVElQTFlfQUxQSEFfV0VCR0wgcGl4ZWwgc3RvcmFnZSBwYXJhbWV0ZXIgc2V0IHRvIGZhbHNlLCB0aGUgY29sb3IgY2hhbm5lbHMgd2lsbCBoYXZlIHRvIGJlIHVuLW11bHRpcGxpZWRcblx0XHQvLyAvLyBieSB0aGUgYWxwaGEgY2hhbm5lbCwgd2hpY2ggaXMgYSBsb3NzeSBvcGVyYXRpb24uIFRoZSBXZWJHTCBpbXBsZW1lbnRhdGlvbiB0aGVyZWZvcmUgY2FuIG5vdCBndWFyYW50ZWUgdGhhdCBjb2xvcnNcblx0XHQvLyAvLyB3aXRoIGFscGhhIDwgMS4wIHdpbGwgYmUgcHJlc2VydmVkIGxvc3NsZXNzbHkgd2hlbiBmaXJzdCBkcmF3biB0byBhIGNhbnZhcyB2aWEgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIGFuZCB0aGVuXG5cdFx0Ly8gLy8gdXBsb2FkZWQgdG8gYSBXZWJHTCB0ZXh0dXJlIHdoZW4gdGhlIFVOUEFDS19QUkVNVUxUSVBMWV9BTFBIQV9XRUJHTCBwaXhlbCBzdG9yYWdlIHBhcmFtZXRlciBpcyBzZXQgdG8gZmFsc2UuXG5cdFx0Ly8gZ2wucGl4ZWxTdG9yZWkoZ2wuVU5QQUNLX1BSRU1VTFRJUExZX0FMUEhBX1dFQkdMLCB0cnVlKTtcblxuXHRcdC8vIEluaXQgcHJvZ3JhbXMgdG8gcGFzcyB2YWx1ZXMgZnJvbSBvbmUgdGV4dHVyZSB0byBhbm90aGVyLlxuXHRcdHRoaXMuY29weUZsb2F0UHJvZ3JhbSA9IHRoaXMuaW5pdFByb2dyYW0oe1xuXHRcdFx0bmFtZTogJ2NvcHlGbG9hdCcsXG5cdFx0XHRmcmFnbWVudFNoYWRlcjogZ2xzbFZlcnNpb24gPT09IEdMU0wzID8gcmVxdWlyZSgnLi9nbHNsXzMvQ29weUZsb2F0RnJhZ1NoYWRlci5nbHNsJykgOiByZXF1aXJlKCcuL2dsc2xfMS9Db3B5RnJhZ1NoYWRlci5nbHNsJyksXG5cdFx0XHR1bmlmb3JtczogW1xuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdG5hbWU6ICd1X3N0YXRlJyxcblx0XHRcdFx0XHRcdHZhbHVlOiAwLFxuXHRcdFx0XHRcdFx0ZGF0YVR5cGU6IElOVCxcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRdLFxuXHRcdFx0fSxcblx0XHQpO1xuXHRcdGlmIChnbHNsVmVyc2lvbiA9PT0gR0xTTDMpIHtcblx0XHRcdHRoaXMuY29weUludFByb2dyYW0gPSB0aGlzLmluaXRQcm9ncmFtKHtcblx0XHRcdFx0bmFtZTogJ2NvcHlJbnQnLFxuXHRcdFx0XHRmcmFnbWVudFNoYWRlcjogcmVxdWlyZSgnLi9nbHNsXzMvQ29weUludEZyYWdTaGFkZXIuZ2xzbCcpLFxuXHRcdFx0XHR1bmlmb3JtczogW1xuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRuYW1lOiAndV9zdGF0ZScsXG5cdFx0XHRcdFx0XHRcdHZhbHVlOiAwLFxuXHRcdFx0XHRcdFx0XHRkYXRhVHlwZTogSU5ULFxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRdLFxuXHRcdFx0XHR9LFxuXHRcdFx0KTtcblx0XHRcdHRoaXMuY29weVVpbnRQcm9ncmFtID0gdGhpcy5pbml0UHJvZ3JhbSh7XG5cdFx0XHRcdG5hbWU6ICdjb3B5VWludCcsXG5cdFx0XHRcdGZyYWdtZW50U2hhZGVyOiByZXF1aXJlKCcuL2dsc2xfMy9Db3B5VWludEZyYWdTaGFkZXIuZ2xzbCcpLFxuXHRcdFx0XHR1bmlmb3JtczogW1xuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRuYW1lOiAndV9zdGF0ZScsXG5cdFx0XHRcdFx0XHRcdHZhbHVlOiAwLFxuXHRcdFx0XHRcdFx0XHRkYXRhVHlwZTogSU5ULFxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRdLFxuXHRcdFx0XHR9LFxuXHRcdFx0KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5jb3B5SW50UHJvZ3JhbSA9IHRoaXMuY29weUZsb2F0UHJvZ3JhbTtcblx0XHRcdHRoaXMuY29weVVpbnRQcm9ncmFtID0gdGhpcy5jb3B5RmxvYXRQcm9ncmFtO1xuXHRcdH1cblxuXHRcdC8vIFVuYmluZCBhY3RpdmUgYnVmZmVyLlxuXHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBudWxsKTtcblxuXHRcdC8vIENhbnZhcyBzZXR1cC5cblx0XHR0aGlzLm9uUmVzaXplKGNhbnZhcyk7XG5cblx0XHQvLyBMb2cgbnVtYmVyIG9mIHRleHR1cmVzIGF2YWlsYWJsZS5cblx0XHR0aGlzLm1heE51bVRleHR1cmVzID0gdGhpcy5nbC5nZXRQYXJhbWV0ZXIodGhpcy5nbC5NQVhfVEVYVFVSRV9JTUFHRV9VTklUUyk7XG5cdFx0Y29uc29sZS5sb2coYCR7dGhpcy5tYXhOdW1UZXh0dXJlc30gdGV4dHVyZXMgbWF4LmApO1xuXHR9XG5cblx0cHJpdmF0ZSBnZXQgc2luZ2xlQ29sb3JQcm9ncmFtKCkge1xuXHRcdGlmICh0aGlzLl9zaW5nbGVDb2xvclByb2dyYW0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Y29uc3QgcHJvZ3JhbSA9IHRoaXMuaW5pdFByb2dyYW0oe1xuXHRcdFx0XHRuYW1lOiAnc2luZ2xlQ29sb3InLFxuXHRcdFx0XHRmcmFnbWVudFNoYWRlcjogdGhpcy5nbHNsVmVyc2lvbiA9PT0gR0xTTDMgPyByZXF1aXJlKCcuL2dsc2xfMy9TaW5nbGVDb2xvckZyYWdTaGFkZXIuZ2xzbCcpIDogcmVxdWlyZSgnLi9nbHNsXzEvU2luZ2xlQ29sb3JGcmFnU2hhZGVyLmdsc2wnKSxcblx0XHRcdH0pO1xuXHRcdFx0dGhpcy5fc2luZ2xlQ29sb3JQcm9ncmFtID0gcHJvZ3JhbTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuX3NpbmdsZUNvbG9yUHJvZ3JhbTtcblx0fVxuXG5cdHByaXZhdGUgZ2V0IHNpbmdsZUNvbG9yV2l0aFdyYXBDaGVja1Byb2dyYW0oKSB7XG5cdFx0aWYgKHRoaXMuX3NpbmdsZUNvbG9yV2l0aFdyYXBDaGVja1Byb2dyYW0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Y29uc3QgcHJvZ3JhbSA9IHRoaXMuaW5pdFByb2dyYW0oe1xuXHRcdFx0XHRuYW1lOiAnc2luZ2xlQ29sb3JXaXRoV3JhcENoZWNrJyxcblx0XHRcdFx0ZnJhZ21lbnRTaGFkZXI6IHRoaXMuZ2xzbFZlcnNpb24gPT09IEdMU0wzID8gcmVxdWlyZSgnLi9nbHNsXzMvU2luZ2xlQ29sb3JXaXRoV3JhcENoZWNrRnJhZ1NoYWRlci5nbHNsJykgOiByZXF1aXJlKCcuL2dsc2xfMS9TaW5nbGVDb2xvcldpdGhXcmFwQ2hlY2tGcmFnU2hhZGVyLmdsc2wnKSxcblx0XHRcdH0pO1xuXHRcdFx0dGhpcy5fc2luZ2xlQ29sb3JXaXRoV3JhcENoZWNrUHJvZ3JhbSA9IHByb2dyYW07XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLl9zaW5nbGVDb2xvcldpdGhXcmFwQ2hlY2tQcm9ncmFtO1xuXHR9XG5cblx0aXNXZWJHTDIoKSB7XG5cdFx0cmV0dXJuIGlzV2ViR0wyKHRoaXMuZ2wpO1xuXHR9XG5cblx0cHJpdmF0ZSBnZXQgcXVhZFBvc2l0aW9uc0J1ZmZlcigpIHtcblx0XHRpZiAodGhpcy5fcXVhZFBvc2l0aW9uc0J1ZmZlciA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRjb25zdCBmc1F1YWRQb3NpdGlvbnMgPSBuZXcgRmxvYXQzMkFycmF5KFsgLTEsIC0xLCAxLCAtMSwgLTEsIDEsIDEsIDEgXSk7XG5cdFx0XHR0aGlzLl9xdWFkUG9zaXRpb25zQnVmZmVyID0gdGhpcy5pbml0VmVydGV4QnVmZmVyKGZzUXVhZFBvc2l0aW9ucykhO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5fcXVhZFBvc2l0aW9uc0J1ZmZlciE7XG5cdH1cblxuXHRwcml2YXRlIGdldCBib3VuZGFyeVBvc2l0aW9uc0J1ZmZlcigpIHtcblx0XHRpZiAodGhpcy5fYm91bmRhcnlQb3NpdGlvbnNCdWZmZXIgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Y29uc3QgYm91bmRhcnlQb3NpdGlvbnMgPSBuZXcgRmxvYXQzMkFycmF5KFsgLTEsIC0xLCAxLCAtMSwgMSwgMSwgLTEsIDEsIC0xLCAtMSBdKTtcblx0XHRcdHRoaXMuX2JvdW5kYXJ5UG9zaXRpb25zQnVmZmVyID0gdGhpcy5pbml0VmVydGV4QnVmZmVyKGJvdW5kYXJ5UG9zaXRpb25zKSE7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLl9ib3VuZGFyeVBvc2l0aW9uc0J1ZmZlciE7XG5cdH1cblxuXHRwcml2YXRlIGdldENpcmNsZVBvc2l0aW9uc0J1ZmZlcihudW1TZWdtZW50czogbnVtYmVyKSB7XG5cdFx0aWYgKHRoaXMuX2NpcmNsZVBvc2l0aW9uc0J1ZmZlcltudW1TZWdtZW50c10gPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRjb25zdCB1bml0Q2lyY2xlUG9pbnRzID0gWzAsIDBdO1xuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPD0gbnVtU2VnbWVudHM7IGkrKykge1xuXHRcdFx0XHR1bml0Q2lyY2xlUG9pbnRzLnB1c2goXG5cdFx0XHRcdFx0TWF0aC5jb3MoMiAqIE1hdGguUEkgKiBpIC8gbnVtU2VnbWVudHMpLFxuXHRcdFx0XHRcdE1hdGguc2luKDIgKiBNYXRoLlBJICogaSAvIG51bVNlZ21lbnRzKSxcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHRcdGNvbnN0IGNpcmNsZVBvc2l0aW9ucyA9IG5ldyBGbG9hdDMyQXJyYXkodW5pdENpcmNsZVBvaW50cyk7XG5cdFx0XHRjb25zdCBidWZmZXIgPSB0aGlzLmluaXRWZXJ0ZXhCdWZmZXIoY2lyY2xlUG9zaXRpb25zKSE7XG5cdFx0XHR0aGlzLl9jaXJjbGVQb3NpdGlvbnNCdWZmZXJbbnVtU2VnbWVudHNdID0gYnVmZmVyO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5fY2lyY2xlUG9zaXRpb25zQnVmZmVyW251bVNlZ21lbnRzXTtcblx0fVxuXG5cdHByaXZhdGUgaW5pdFZlcnRleEJ1ZmZlcihcblx0XHRkYXRhOiBGbG9hdDMyQXJyYXksXG5cdCkge1xuXHRcdGNvbnN0IHsgZXJyb3JDYWxsYmFjaywgZ2wgfSA9IHRoaXM7XG5cdFx0Y29uc3QgYnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKCk7XG5cdFx0aWYgKCFidWZmZXIpIHtcblx0XHRcdGVycm9yQ2FsbGJhY2soJ1VuYWJsZSB0byBhbGxvY2F0ZSBnbCBidWZmZXIuJyk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBidWZmZXIpO1xuXHRcdC8vIEFkZCBidWZmZXIgZGF0YS5cblx0XHRnbC5idWZmZXJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgZGF0YSwgZ2wuU1RBVElDX0RSQVcpO1xuXHRcdHJldHVybiBidWZmZXI7XG5cdH1cblxuXHRpbml0UHJvZ3JhbShcblx0XHRwYXJhbXM6IHtcblx0XHRcdG5hbWU6IHN0cmluZyxcblx0XHRcdGZyYWdtZW50U2hhZGVyOiBzdHJpbmcgfCBXZWJHTFNoYWRlcixcblx0XHRcdHVuaWZvcm1zPzoge1xuXHRcdFx0XHRuYW1lOiBzdHJpbmcsXG5cdFx0XHRcdHZhbHVlOiBVbmlmb3JtVmFsdWVUeXBlLFxuXHRcdFx0XHRkYXRhVHlwZTogVW5pZm9ybURhdGFUeXBlLFxuXHRcdFx0fVtdLFxuXHRcdFx0ZGVmaW5lcz86IHtcblx0XHRcdFx0W2tleSA6IHN0cmluZ106IHN0cmluZyxcblx0XHRcdH0sXG5cdFx0fSxcblx0KSB7XG5cdFx0Ly8gQ2hlY2sgcGFyYW1zLlxuXHRcdGNvbnN0IHZhbGlkS2V5cyA9IFsnbmFtZScsICdmcmFnbWVudFNoYWRlcicsICd1bmlmb3JtcycsICdkZWZpbmVzJ107XG5cdFx0T2JqZWN0LmtleXMocGFyYW1zKS5mb3JFYWNoKGtleSA9PiB7XG5cdFx0XHRpZiAodmFsaWRLZXlzLmluZGV4T2Yoa2V5KSA8IDApIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGtleSAke2tleX0gcGFzc2VkIHRvIFdlYkdMQ29tcHV0ZS5pbml0UHJvZ3JhbSB3aXRoIG5hbWUgXCIke3BhcmFtcy5uYW1lfVwiLiAgVmFsaWQga2V5cyBhcmUgJHt2YWxpZEtleXMuam9pbignLCAnKX0uYCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0Y29uc3QgeyBnbCwgZXJyb3JDYWxsYmFjaywgZ2xzbFZlcnNpb24gfSA9IHRoaXM7XG5cdFx0cmV0dXJuIG5ldyBHUFVQcm9ncmFtKFxuXHRcdFx0e1xuXHRcdFx0XHQuLi5wYXJhbXMsXG5cdFx0XHRcdGdsLFxuXHRcdFx0XHRlcnJvckNhbGxiYWNrLFxuXHRcdFx0XHRnbHNsVmVyc2lvbixcblx0XHRcdH0sXG5cdFx0KTtcblx0fTtcblxuXHRpbml0RGF0YUxheWVyKFxuXHRcdHBhcmFtczoge1xuXHRcdFx0bmFtZTogc3RyaW5nLFxuXHRcdFx0ZGltZW5zaW9uczogbnVtYmVyIHwgW251bWJlciwgbnVtYmVyXSxcblx0XHRcdHR5cGU6IERhdGFMYXllclR5cGUsXG5cdFx0XHRudW1Db21wb25lbnRzOiBEYXRhTGF5ZXJOdW1Db21wb25lbnRzLFxuXHRcdFx0ZGF0YT86IERhdGFMYXllckFycmF5VHlwZSxcblx0XHRcdGZpbHRlcj86IERhdGFMYXllckZpbHRlclR5cGUsXG5cdFx0XHR3cmFwUz86IERhdGFMYXllcldyYXBUeXBlLFxuXHRcdFx0d3JhcFQ/OiBEYXRhTGF5ZXJXcmFwVHlwZSxcblx0XHRcdHdyaXRhYmxlPzogYm9vbGVhbixcblx0XHRcdG51bUJ1ZmZlcnM/OiBudW1iZXIsXG5cdFx0fSxcblx0KSB7XG5cdFx0Ly8gQ2hlY2sgcGFyYW1zLlxuXHRcdGNvbnN0IHZhbGlkS2V5cyA9IFsnbmFtZScsICdkaW1lbnNpb25zJywgJ3R5cGUnLCAnbnVtQ29tcG9uZW50cycsICdkYXRhJywgJ2ZpbHRlcicsICd3cmFwUycsICd3cmFwVCcsICd3cml0YWJsZScsICdudW1CdWZmZXJzJ107XG5cdFx0T2JqZWN0LmtleXMocGFyYW1zKS5mb3JFYWNoKGtleSA9PiB7XG5cdFx0XHRpZiAodmFsaWRLZXlzLmluZGV4T2Yoa2V5KSA8IDApIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGtleSAke2tleX0gcGFzc2VkIHRvIFdlYkdMQ29tcHV0ZS5pbml0RGF0YUxheWVyIHdpdGggbmFtZSBcIiR7cGFyYW1zLm5hbWV9XCIuICBWYWxpZCBrZXlzIGFyZSAke3ZhbGlkS2V5cy5qb2luKCcsICcpfS5gKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRjb25zdCB7IGdsLCBlcnJvckNhbGxiYWNrLCBnbHNsVmVyc2lvbiB9ID0gdGhpcztcblx0XHRyZXR1cm4gbmV3IERhdGFMYXllcih7XG5cdFx0XHQuLi5wYXJhbXMsXG5cdFx0XHRnbCxcblx0XHRcdGdsc2xWZXJzaW9uLFxuXHRcdFx0ZXJyb3JDYWxsYmFjayxcblx0XHR9KTtcblx0fTtcblxuXHRpbml0VGV4dHVyZShcblx0XHRwYXJhbXM6IHtcblx0XHRcdG5hbWU6IHN0cmluZyxcblx0XHRcdHVybDogc3RyaW5nLFxuXHRcdFx0ZmlsdGVyPzogRGF0YUxheWVyRmlsdGVyVHlwZSxcblx0XHRcdHdyYXBTPzogRGF0YUxheWVyV3JhcFR5cGUsXG5cdFx0XHR3cmFwVD86IERhdGFMYXllcldyYXBUeXBlLFxuXHRcdFx0Zm9ybWF0PzogVGV4dHVyZUZvcm1hdFR5cGUsXG5cdFx0XHR0eXBlPzogVGV4dHVyZURhdGFUeXBlLFxuXHRcdFx0b25Mb2FkPzogKHRleHR1cmU6IFdlYkdMVGV4dHVyZSkgPT4gdm9pZCxcblx0XHR9LFxuXHQpIHtcblx0XHQvLyBDaGVjayBwYXJhbXMuXG5cdFx0Y29uc3QgdmFsaWRLZXlzID0gWyduYW1lJywgJ3VybCcsICdmaWx0ZXInLCAnd3JhcFMnLCAnd3JhcFQnLCAnZm9ybWF0JywgJ3R5cGUnLCAnb25Mb2FkJ107XG5cdFx0T2JqZWN0LmtleXMocGFyYW1zKS5mb3JFYWNoKGtleSA9PiB7XG5cdFx0XHRpZiAodmFsaWRLZXlzLmluZGV4T2Yoa2V5KSA8IDApIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGtleSAke2tleX0gcGFzc2VkIHRvIFdlYkdMQ29tcHV0ZS5pbml0VGV4dHVyZSB3aXRoIG5hbWUgXCIke3BhcmFtcy5uYW1lfVwiLiAgVmFsaWQga2V5cyBhcmUgJHt2YWxpZEtleXMuam9pbignLCAnKX0uYCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0Y29uc3QgeyB1cmwsIG5hbWUgfSA9IHBhcmFtcztcblx0XHRpZiAoIWlzU3RyaW5nKHVybCkpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgV2ViR0xDb21wdXRlLmluaXRUZXh0dXJlIHBhcmFtcyB0byBoYXZlIHVybCBvZiB0eXBlIHN0cmluZywgZ290ICR7dXJsfSBvZiB0eXBlICR7dHlwZW9mIHVybH0uYClcblx0XHR9XG5cdFx0aWYgKCFpc1N0cmluZyhuYW1lKSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBXZWJHTENvbXB1dGUuaW5pdFRleHR1cmUgcGFyYW1zIHRvIGhhdmUgbmFtZSBvZiB0eXBlIHN0cmluZywgZ290ICR7bmFtZX0gb2YgdHlwZSAke3R5cGVvZiBuYW1lfS5gKVxuXHRcdH1cblxuXHRcdC8vIEdldCBmaWx0ZXIgdHlwZSwgZGVmYXVsdCB0byBuZWFyZXN0LlxuXHRcdGNvbnN0IGZpbHRlciA9IHBhcmFtcy5maWx0ZXIgIT09IHVuZGVmaW5lZCA/IHBhcmFtcy5maWx0ZXIgOiBORUFSRVNUO1xuXHRcdGlmICghaXNWYWxpZEZpbHRlclR5cGUoZmlsdGVyKSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGZpbHRlcjogJHtmaWx0ZXJ9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIsIG11c3QgYmUgJHt2YWxpZEZpbHRlclR5cGVzLmpvaW4oJywgJyl9LmApO1xuXHRcdH1cblxuXHRcdC8vIEdldCB3cmFwIHR5cGVzLCBkZWZhdWx0IHRvIGNsYW1wIHRvIGVkZ2UuXG5cdFx0Y29uc3Qgd3JhcFMgPSBwYXJhbXMud3JhcFMgIT09IHVuZGVmaW5lZCA/IHBhcmFtcy53cmFwUyA6IENMQU1QX1RPX0VER0U7XG5cdFx0aWYgKCFpc1ZhbGlkV3JhcFR5cGUod3JhcFMpKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgd3JhcFM6ICR7d3JhcFN9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIsIG11c3QgYmUgJHt2YWxpZFdyYXBUeXBlcy5qb2luKCcsICcpfS5gKTtcblx0XHR9XG5cdFx0Y29uc3Qgd3JhcFQgPSBwYXJhbXMud3JhcFQgIT09IHVuZGVmaW5lZCA/IHBhcmFtcy53cmFwVCA6IENMQU1QX1RPX0VER0U7XG5cdFx0aWYgKCFpc1ZhbGlkV3JhcFR5cGUod3JhcFQpKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgd3JhcFQ6ICR7d3JhcFR9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIsIG11c3QgYmUgJHt2YWxpZFdyYXBUeXBlcy5qb2luKCcsICcpfS5gKTtcblx0XHR9XG5cblx0XHQvLyBHZXQgaW1hZ2UgZm9ybWF0IHR5cGUsIGRlZmF1bHQgdG8gcmdiYS5cblx0XHRjb25zdCBmb3JtYXQgPSBwYXJhbXMuZm9ybWF0ICE9PSB1bmRlZmluZWQgPyBwYXJhbXMuZm9ybWF0IDogUkdCQTtcblx0XHRpZiAoIWlzVmFsaWRUZXh0dXJlRm9ybWF0VHlwZShmb3JtYXQpKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgZm9ybWF0OiAke2Zvcm1hdH0gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIiwgbXVzdCBiZSAke3ZhbGlkVGV4dHVyZUZvcm1hdFR5cGVzLmpvaW4oJywgJyl9LmApO1xuXHRcdH1cblxuXHRcdC8vIEdldCBpbWFnZSBkYXRhIHR5cGUsIGRlZmF1bHQgdG8gdW5zaWduZWQgYnl0ZS5cblx0XHRjb25zdCB0eXBlID0gcGFyYW1zLnR5cGUgIT09IHVuZGVmaW5lZCA/IHBhcmFtcy50eXBlIDogVU5TSUdORURfQllURTtcblx0XHRpZiAoIWlzVmFsaWRUZXh0dXJlRGF0YVR5cGUodHlwZSkpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB0eXBlOiAke3R5cGV9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIsIG11c3QgYmUgJHt2YWxpZFRleHR1cmVEYXRhVHlwZXMuam9pbignLCAnKX0uYCk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgeyBnbCwgZXJyb3JDYWxsYmFjayB9ID0gdGhpcztcblx0XHRjb25zdCB0ZXh0dXJlID0gZ2wuY3JlYXRlVGV4dHVyZSgpO1xuXHRcdGlmICh0ZXh0dXJlID09PSBudWxsKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byBpbml0IGdsVGV4dHVyZS5gKTtcblx0XHR9XG5cdFx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgdGV4dHVyZSk7XG5cdFx0Ly8gQmVjYXVzZSBpbWFnZXMgaGF2ZSB0byBiZSBkb3dubG9hZGVkIG92ZXIgdGhlIGludGVybmV0XG5cdFx0Ly8gdGhleSBtaWdodCB0YWtlIGEgbW9tZW50IHVudGlsIHRoZXkgYXJlIHJlYWR5LlxuXHRcdC8vIFVudGlsIHRoZW4gcHV0IGEgc2luZ2xlIHBpeGVsIGluIHRoZSB0ZXh0dXJlIHNvIHdlIGNhblxuXHRcdC8vIHVzZSBpdCBpbW1lZGlhdGVseS4gV2hlbiB0aGUgaW1hZ2UgaGFzIGZpbmlzaGVkIGRvd25sb2FkaW5nXG5cdFx0Ly8gd2UnbGwgdXBkYXRlIHRoZSB0ZXh0dXJlIHdpdGggdGhlIGNvbnRlbnRzIG9mIHRoZSBpbWFnZS5cblx0XHRjb25zdCBsZXZlbCA9IDA7XG5cdFx0Y29uc3QgaW50ZXJuYWxGb3JtYXQgPSBnbC5SR0JBO1xuXHRcdGNvbnN0IHdpZHRoID0gMTtcblx0XHRjb25zdCBoZWlnaHQgPSAxO1xuXHRcdGNvbnN0IGJvcmRlciA9IDA7XG5cdFx0Y29uc3Qgc3JjRm9ybWF0ID0gZ2xbZm9ybWF0XTtcblx0XHRjb25zdCBzcmNUeXBlID0gZ2xbdHlwZV07XG5cdFx0Y29uc3QgcGl4ZWwgPSBuZXcgVWludDhBcnJheShbMCwgMCwgMCwgMF0pO1xuXHRcdGdsLnRleEltYWdlMkQoZ2wuVEVYVFVSRV8yRCwgbGV2ZWwsIGludGVybmFsRm9ybWF0LFxuXHRcdFx0d2lkdGgsIGhlaWdodCwgYm9yZGVyLCBzcmNGb3JtYXQsIHNyY1R5cGUsIHBpeGVsKTtcblxuXHRcdGNvbnN0IGltYWdlID0gbmV3IEltYWdlKCk7XG5cdFx0aW1hZ2Uub25sb2FkID0gKCkgPT4ge1xuXHRcdFx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgdGV4dHVyZSk7XG5cdFx0XHRnbC50ZXhJbWFnZTJEKGdsLlRFWFRVUkVfMkQsIGxldmVsLCBpbnRlcm5hbEZvcm1hdCxcblx0XHRcdFx0c3JjRm9ybWF0LCBzcmNUeXBlLCBpbWFnZSk7XG5cblx0XHRcdC8vIFdlYkdMMSBoYXMgZGlmZmVyZW50IHJlcXVpcmVtZW50cyBmb3IgcG93ZXIgb2YgMiBpbWFnZXNcblx0XHRcdC8vIHZzIG5vbiBwb3dlciBvZiAyIGltYWdlcyBzbyBjaGVjayBpZiB0aGUgaW1hZ2UgaXMgYVxuXHRcdFx0Ly8gcG93ZXIgb2YgMiBpbiBib3RoIGRpbWVuc2lvbnMuXG5cdFx0XHRpZiAoaXNQb3dlck9mMihpbWFnZS53aWR0aCkgJiYgaXNQb3dlck9mMihpbWFnZS5oZWlnaHQpKSB7XG5cdFx0XHRcdC8vIC8vIFllcywgaXQncyBhIHBvd2VyIG9mIDIuIEdlbmVyYXRlIG1pcHMuXG5cdFx0XHRcdC8vIGdsLmdlbmVyYXRlTWlwbWFwKGdsLlRFWFRVUkVfMkQpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gVE9ETzogZmluaXNoIGltcGxlbWVudGluZyB0aGlzLlxuXHRcdFx0XHRjb25zb2xlLndhcm4oYFRleHR1cmUgJHtuYW1lfSBkaW1lbnNpb25zIFske2ltYWdlLndpZHRofSwgJHtpbWFnZS5oZWlnaHR9XSBhcmUgbm90IHBvd2VyIG9mIDIuYCk7XG5cdFx0XHRcdC8vIC8vIE5vLCBpdCdzIG5vdCBhIHBvd2VyIG9mIDIuIFR1cm4gb2ZmIG1pcHMgYW5kIHNldFxuXHRcdFx0XHQvLyAvLyB3cmFwcGluZyB0byBjbGFtcCB0byBlZGdlXG5cdFx0XHRcdC8vIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1MsIGdsLkNMQU1QX1RPX0VER0UpO1xuXHRcdFx0XHQvLyBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9ULCBnbC5DTEFNUF9UT19FREdFKTtcblx0XHRcdH1cblx0XHRcdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1MsIGdsW3dyYXBTXSk7XG5cdFx0XHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9ULCBnbFt3cmFwVF0pO1xuXHRcdFx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01JTl9GSUxURVIsIGdsW2ZpbHRlcl0pO1xuXHRcdFx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01BR19GSUxURVIsIGdsW2ZpbHRlcl0pO1xuXG5cdFx0XHQvLyBDYWxsYmFjayB3aGVuIHRleHR1cmUgaGFzIGxvYWRlZC5cblx0XHRcdGlmIChwYXJhbXMub25Mb2FkKSBwYXJhbXMub25Mb2FkKHRleHR1cmUpO1xuXHRcdH07XG5cdFx0aW1hZ2Uub25lcnJvciA9IChlKSA9PiB7XG5cdFx0XHRlcnJvckNhbGxiYWNrKGBFcnJvciBsb2FkaW5nIGltYWdlICR7bmFtZX06ICR7ZX1gKTtcblx0XHR9XG5cdFx0aW1hZ2Uuc3JjID0gdXJsO1xuXG5cdFx0cmV0dXJuIHRleHR1cmU7XG5cdH1cblxuXHRvblJlc2l6ZShjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50KSB7XG5cdFx0Y29uc3Qgd2lkdGggPSBjYW52YXMuY2xpZW50V2lkdGg7XG5cdFx0Y29uc3QgaGVpZ2h0ID0gY2FudmFzLmNsaWVudEhlaWdodDtcblx0XHQvLyBTZXQgY29ycmVjdCBjYW52YXMgcGl4ZWwgc2l6ZS5cblx0XHQvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvV2ViR0xfQVBJL0J5X2V4YW1wbGUvQ2FudmFzX3NpemVfYW5kX1dlYkdMXG5cdFx0Y2FudmFzLndpZHRoID0gd2lkdGg7XG5cdFx0Y2FudmFzLmhlaWdodCA9IGhlaWdodDtcblx0XHQvLyBTYXZlIGRpbWVuc2lvbnMuXG5cdFx0dGhpcy53aWR0aCA9IHdpZHRoO1xuXHRcdHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuXHR9O1xuXG5cdHByaXZhdGUgZHJhd1NldHVwKFxuXHRcdHByb2dyYW06IFdlYkdMUHJvZ3JhbSxcblx0XHRmdWxsc2NyZWVuUmVuZGVyOiBib29sZWFuLFxuXHRcdGlucHV0PzogKERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSlbXSB8IERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSxcblx0XHRvdXRwdXQ/OiBEYXRhTGF5ZXIsXG5cdCkge1xuXHRcdGNvbnN0IHsgZ2wgfSA9IHRoaXM7XG5cdFx0Ly8gQ2hlY2sgaWYgd2UgYXJlIGluIGFuIGVycm9yIHN0YXRlLlxuXHRcdGlmICghcHJvZ3JhbSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIENBVVRJT046IHRoZSBvcmRlciBvZiB0aGVzZSBuZXh0IGZldyBsaW5lcyBpcyBpbXBvcnRhbnQuXG5cblx0XHQvLyBHZXQgYSBzaGFsbG93IGNvcHkgb2YgY3VycmVudCB0ZXh0dXJlcy5cblx0XHQvLyBUaGlzIGxpbmUgbXVzdCBjb21lIGJlZm9yZSB0aGlzLnNldE91dHB1dCgpIGFzIGl0IGRlcGVuZHMgb24gY3VycmVudCBpbnRlcm5hbCBzdGF0ZS5cblx0XHRjb25zdCBpbnB1dFRleHR1cmVzOiBXZWJHTFRleHR1cmVbXSA9IFtdO1xuXHRcdGlmIChpbnB1dCkge1xuXHRcdFx0aWYgKGlucHV0LmNvbnN0cnVjdG9yID09PSBXZWJHTFRleHR1cmUpIHtcblx0XHRcdFx0aW5wdXRUZXh0dXJlcy5wdXNoKGlucHV0IGFzIFdlYkdMVGV4dHVyZSk7XG5cdFx0XHR9IGVsc2UgaWYgKGlucHV0LmNvbnN0cnVjdG9yID09PSBEYXRhTGF5ZXIpIHtcblx0XHRcdFx0aW5wdXRUZXh0dXJlcy5wdXNoKChpbnB1dCBhcyBEYXRhTGF5ZXIpLmdldEN1cnJlbnRTdGF0ZVRleHR1cmUoKSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IChpbnB1dCBhcyAoRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlKVtdKS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdGNvbnN0IGxheWVyID0gKGlucHV0IGFzIChEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUpW10pW2ldO1xuXHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHRpbnB1dFRleHR1cmVzLnB1c2goKGxheWVyIGFzIERhdGFMYXllcikuZ2V0Q3VycmVudFN0YXRlVGV4dHVyZSA/IChsYXllciBhcyBEYXRhTGF5ZXIpLmdldEN1cnJlbnRTdGF0ZVRleHR1cmUoKSA6IGxheWVyIGFzIFdlYkdMVGV4dHVyZSlcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIFNldCBvdXRwdXQgZnJhbWVidWZmZXIuXG5cdFx0Ly8gVGhpcyBtYXkgbW9kaWZ5IFdlYkdMIGludGVybmFsIHN0YXRlLlxuXHRcdHRoaXMuc2V0T3V0cHV0TGF5ZXIoZnVsbHNjcmVlblJlbmRlciwgaW5wdXQsIG91dHB1dCk7XG5cblx0XHQvLyBTZXQgY3VycmVudCBwcm9ncmFtLlxuXHRcdGdsLnVzZVByb2dyYW0ocHJvZ3JhbSk7XG5cblx0XHQvLyBTZXQgaW5wdXQgdGV4dHVyZXMuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBpbnB1dFRleHR1cmVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRnbC5hY3RpdmVUZXh0dXJlKGdsLlRFWFRVUkUwICsgaSk7XG5cdFx0XHRnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCBpbnB1dFRleHR1cmVzW2ldKTtcblx0XHR9XG5cdH1cblxuXHRjb3B5UHJvZ3JhbUZvclR5cGUodHlwZTogRGF0YUxheWVyVHlwZSkge1xuXHRcdHN3aXRjaCAodHlwZSkge1xuXHRcdFx0Y2FzZSBIQUxGX0ZMT0FUOlxuXHRcdFx0Y2FzZSBGTE9BVDpcblx0XHRcdFx0cmV0dXJuIHRoaXMuY29weUZsb2F0UHJvZ3JhbTtcblx0XHRcdGNhc2UgVU5TSUdORURfQllURTpcblx0XHRcdGNhc2UgVU5TSUdORURfU0hPUlQ6XG5cdFx0XHRjYXNlIFVOU0lHTkVEX0lOVDpcblx0XHRcdFx0cmV0dXJuIHRoaXMuY29weVVpbnRQcm9ncmFtO1xuXHRcdFx0Y2FzZSBCWVRFOlxuXHRcdFx0Y2FzZSBTSE9SVDpcblx0XHRcdGNhc2UgSU5UOlxuXHRcdFx0XHRyZXR1cm4gdGhpcy5jb3B5SW50UHJvZ3JhbTtcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB0eXBlOiAke3R5cGV9IHBhc3NlZCB0byBXZWJHTENvbXB1dGUuY29weVByb2dyYW1Gb3JUeXBlLmApO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgc2V0QmxlbmRNb2RlKHNob3VsZEJsZW5kQWxwaGE/OiBib29sZWFuKSB7XG5cdFx0Y29uc3QgeyBnbCB9ID0gdGhpcztcblx0XHRpZiAoc2hvdWxkQmxlbmRBbHBoYSkge1xuXHRcdFx0Z2wuZW5hYmxlKGdsLkJMRU5EKTtcblx0XHRcdGdsLmJsZW5kRnVuYyhnbC5TUkNfQUxQSEEsIGdsLk9ORV9NSU5VU19TUkNfQUxQSEEpO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgYWRkTGF5ZXJUb0lucHV0cyhcblx0XHRsYXllcjogRGF0YUxheWVyLFxuXHRcdGlucHV0PzogIChEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUpW10gfCBEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUsXG5cdCkge1xuXHRcdC8vIEFkZCBsYXllciB0byBlbmQgb2YgaW5wdXQgaWYgbmVlZGVkLlxuXHRcdGxldCBfaW5wdXRMYXllcnMgPSBpbnB1dDtcblx0XHRpZiAoaXNBcnJheShfaW5wdXRMYXllcnMpKSB7XG5cdFx0XHRjb25zdCBpbmRleCA9IChfaW5wdXRMYXllcnMgYXMgKERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSlbXSkuaW5kZXhPZihsYXllcik7XG5cdFx0XHRpZiAoaW5kZXggPCAwKSB7XG5cdFx0XHRcdChfaW5wdXRMYXllcnMgYXMgKERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSlbXSkucHVzaChsYXllcik7XG5cdFx0XHR9IFxuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoX2lucHV0TGF5ZXJzICE9PSBsYXllcikge1xuXHRcdFx0XHRjb25zdCBwcmV2aW91cyA9IF9pbnB1dExheWVycztcblx0XHRcdFx0X2lucHV0TGF5ZXJzID0gW107XG5cdFx0XHRcdGlmIChwcmV2aW91cykgKF9pbnB1dExheWVycyBhcyAoRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlKVtdKS5wdXNoKHByZXZpb3VzKTtcblx0XHRcdFx0KF9pbnB1dExheWVycyBhcyAoRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlKVtdKS5wdXNoKGxheWVyKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdF9pbnB1dExheWVycyA9IFtfaW5wdXRMYXllcnNdO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gX2lucHV0TGF5ZXJzIGFzIChEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUpW107XG5cdH1cblxuXHRwcml2YXRlIHBhc3NUaHJvdWdoTGF5ZXJEYXRhRnJvbUlucHV0VG9PdXRwdXQoc3RhdGU6IERhdGFMYXllcikge1xuXHRcdC8vIFRPRE86IGZpZ3VyZSBvdXQgdGhlIGZhc3Rlc3Qgd2F5IHRvIGNvcHkgYSB0ZXh0dXJlLlxuXHRcdGNvbnN0IGNvcHlQcm9ncmFtID0gdGhpcy5jb3B5UHJvZ3JhbUZvclR5cGUoc3RhdGUuaW50ZXJuYWxUeXBlKTtcblx0XHR0aGlzLnN0ZXAoe1xuXHRcdFx0cHJvZ3JhbTogY29weVByb2dyYW0sXG5cdFx0XHRpbnB1dDogc3RhdGUsXG5cdFx0XHRvdXRwdXQ6IHN0YXRlLFxuXHRcdH0pO1xuXHR9XG5cblx0cHJpdmF0ZSBzZXRPdXRwdXRMYXllcihcblx0XHRmdWxsc2NyZWVuUmVuZGVyOiBib29sZWFuLFxuXHRcdGlucHV0PzogKERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSlbXSB8IERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSxcblx0XHRvdXRwdXQ/OiBEYXRhTGF5ZXIsIC8vIFVuZGVmaW5lZCByZW5kZXJzIHRvIHNjcmVlbi5cblx0KSB7XG5cdFx0Y29uc3QgeyBnbCB9ID0gdGhpcztcblxuXHRcdC8vIFJlbmRlciB0byBzY3JlZW4uXG5cdFx0aWYgKCFvdXRwdXQpIHtcblx0XHRcdGdsLmJpbmRGcmFtZWJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgbnVsbCk7XG5cdFx0XHQvLyBSZXNpemUgdmlld3BvcnQuXG5cdFx0XHRjb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IHRoaXM7XG5cdFx0XHRnbC52aWV3cG9ydCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBDaGVjayBpZiBvdXRwdXQgaXMgc2FtZSBhcyBvbmUgb2YgaW5wdXQgbGF5ZXJzLlxuXHRcdGlmIChpbnB1dCAmJiAoKGlucHV0ID09PSBvdXRwdXQpIHx8IChpc0FycmF5KGlucHV0KSAmJiAoaW5wdXQgYXMgKERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSlbXSkuaW5kZXhPZihvdXRwdXQpID4gLTEpKSkge1xuXHRcdFx0aWYgKG91dHB1dC5udW1CdWZmZXJzID09PSAxKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignQ2Fubm90IHVzZSBzYW1lIGJ1ZmZlciBmb3IgaW5wdXQgYW5kIG91dHB1dCBvZiBhIHByb2dyYW0uIFRyeSBpbmNyZWFzaW5nIHRoZSBudW1iZXIgb2YgYnVmZmVycyBpbiB5b3VyIG91dHB1dCBsYXllciB0byBhdCBsZWFzdCAyIHNvIHlvdSBjYW4gcmVuZGVyIHRvIG5leHRTdGF0ZSB1c2luZyBjdXJyZW50U3RhdGUgYXMgYW4gaW5wdXQuJyk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoZnVsbHNjcmVlblJlbmRlcikge1xuXHRcdFx0XHQvLyBSZW5kZXIgYW5kIGluY3JlbWVudCBidWZmZXIgc28gd2UgYXJlIHJlbmRlcmluZyB0byBhIGRpZmZlcmVudCB0YXJnZXRcblx0XHRcdFx0Ly8gdGhhbiB0aGUgaW5wdXQgdGV4dHVyZS5cblx0XHRcdFx0b3V0cHV0Ll9iaW5kT3V0cHV0QnVmZmVyRm9yV3JpdGUodHJ1ZSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBQYXNzIGlucHV0IHRleHR1cmUgdGhyb3VnaCB0byBvdXRwdXQuXG5cdFx0XHRcdHRoaXMucGFzc1Rocm91Z2hMYXllckRhdGFGcm9tSW5wdXRUb091dHB1dChvdXRwdXQpO1xuXHRcdFx0XHQvLyBSZW5kZXIgdG8gb3V0cHV0IHdpdGhvdXQgaW5jcmVtZW50aW5nIGJ1ZmZlci5cblx0XHRcdFx0b3V0cHV0Ll9iaW5kT3V0cHV0QnVmZmVyRm9yV3JpdGUoZmFsc2UpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoZnVsbHNjcmVlblJlbmRlcikge1xuXHRcdFx0XHQvLyBSZW5kZXIgdG8gY3VycmVudCBidWZmZXIuXG5cdFx0XHRcdG91dHB1dC5fYmluZE91dHB1dEJ1ZmZlckZvcldyaXRlKGZhbHNlKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIElmIHdlIGFyZSBkb2luZyBhIHNuZWFreSB0aGluZyB3aXRoIGEgc3dhcHBlZCB0ZXh0dXJlIGFuZCBhcmVcblx0XHRcdFx0Ly8gb25seSByZW5kZXJpbmcgcGFydCBvZiB0aGUgc2NyZWVuLCB3ZSBtYXkgbmVlZCB0byBhZGQgYSBjb3B5IG9wZXJhdGlvbi5cblx0XHRcdFx0aWYgKG91dHB1dC5fdXNpbmdUZXh0dXJlT3ZlcnJpZGVGb3JDdXJyZW50QnVmZmVyKCkpIHtcblx0XHRcdFx0XHR0aGlzLnBhc3NUaHJvdWdoTGF5ZXJEYXRhRnJvbUlucHV0VG9PdXRwdXQob3V0cHV0KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRvdXRwdXQuX2JpbmRPdXRwdXRCdWZmZXJGb3JXcml0ZShmYWxzZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdFxuXHRcdC8vIFJlc2l6ZSB2aWV3cG9ydC5cblx0XHRjb25zdCBbIHdpZHRoLCBoZWlnaHQgXSA9IG91dHB1dC5nZXREaW1lbnNpb25zKCk7XG5cdFx0Z2wudmlld3BvcnQoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG5cdH07XG5cblx0cHJpdmF0ZSBzZXRQb3NpdGlvbkF0dHJpYnV0ZShwcm9ncmFtOiBXZWJHTFByb2dyYW0sIHByb2dyYW1OYW1lOiBzdHJpbmcpIHtcblx0XHR0aGlzLnNldFZlcnRleEF0dHJpYnV0ZShwcm9ncmFtLCAnYV9pbnRlcm5hbF9wb3NpdGlvbicsIDIsIHByb2dyYW1OYW1lKTtcblx0fVxuXG5cdHByaXZhdGUgc2V0SW5kZXhBdHRyaWJ1dGUocHJvZ3JhbTogV2ViR0xQcm9ncmFtLCBwcm9ncmFtTmFtZTogc3RyaW5nKSB7XG5cdFx0dGhpcy5zZXRWZXJ0ZXhBdHRyaWJ1dGUocHJvZ3JhbSwgJ2FfaW50ZXJuYWxfaW5kZXgnLCAxLCBwcm9ncmFtTmFtZSk7XG5cdH1cblxuXHRwcml2YXRlIHNldFVWQXR0cmlidXRlKHByb2dyYW06IFdlYkdMUHJvZ3JhbSwgcHJvZ3JhbU5hbWU6IHN0cmluZykge1xuXHRcdHRoaXMuc2V0VmVydGV4QXR0cmlidXRlKHByb2dyYW0sICdhX2ludGVybmFsX3V2JywgMiwgcHJvZ3JhbU5hbWUpO1xuXHR9XG5cblx0cHJpdmF0ZSBzZXRWZXJ0ZXhBdHRyaWJ1dGUocHJvZ3JhbTogV2ViR0xQcm9ncmFtLCBuYW1lOiBzdHJpbmcsIHNpemU6IG51bWJlciwgcHJvZ3JhbU5hbWU6IHN0cmluZykge1xuXHRcdGNvbnN0IHsgZ2wgfSA9IHRoaXM7XG5cdFx0Ly8gUG9pbnQgYXR0cmlidXRlIHRvIHRoZSBjdXJyZW50bHkgYm91bmQgVkJPLlxuXHRcdGNvbnN0IGxvY2F0aW9uID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24ocHJvZ3JhbSwgbmFtZSk7XG5cdFx0aWYgKGxvY2F0aW9uIDwgMCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gZmluZCB2ZXJ0ZXggYXR0cmlidXRlIFwiJHtuYW1lfVwiIGluIHByb2dyYW0gXCIke3Byb2dyYW1OYW1lfVwiLmApO1xuXHRcdH1cblx0XHQvLyBUT0RPOiBvbmx5IGZsb2F0IGlzIHN1cHBvcnRlZCBmb3IgdmVydGV4IGF0dHJpYnV0ZXMuXG5cdFx0Z2wudmVydGV4QXR0cmliUG9pbnRlcihsb2NhdGlvbiwgc2l6ZSwgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcblx0XHQvLyBFbmFibGUgdGhlIGF0dHJpYnV0ZS5cblx0XHRnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShsb2NhdGlvbik7XG5cdH1cblxuXHQvLyBTdGVwIGZvciBlbnRpcmUgZnVsbHNjcmVlbiBxdWFkLlxuXHRzdGVwKFxuXHRcdHBhcmFtczoge1xuXHRcdFx0cHJvZ3JhbTogR1BVUHJvZ3JhbSxcblx0XHRcdGlucHV0PzogIChEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUpW10gfCBEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUsXG5cdFx0XHRvdXRwdXQ/OiBEYXRhTGF5ZXIsIC8vIFVuZGVmaW5lZCByZW5kZXJzIHRvIHNjcmVlbi5cblx0XHRcdHNob3VsZEJsZW5kQWxwaGE/OiBib29sZWFuLFxuXHRcdH0sXG5cdCkge1xuXHRcdGNvbnN0IHsgZ2wsIGVycm9yU3RhdGUsIHF1YWRQb3NpdGlvbnNCdWZmZXIgfSA9IHRoaXM7XG5cdFx0Y29uc3QgeyBwcm9ncmFtLCBpbnB1dCwgb3V0cHV0IH0gPSBwYXJhbXM7XG5cblx0XHQvLyBJZ25vcmUgaWYgd2UgYXJlIGluIGVycm9yIHN0YXRlLlxuXHRcdGlmIChlcnJvclN0YXRlKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgZ2xQcm9ncmFtID0gcHJvZ3JhbS5kZWZhdWx0UHJvZ3JhbSE7XG5cblx0XHQvLyBEbyBzZXR1cCAtIHRoaXMgbXVzdCBjb21lIGZpcnN0LlxuXHRcdHRoaXMuZHJhd1NldHVwKHByb2dyYW0uZGVmYXVsdFByb2dyYW0hLCB0cnVlLCBpbnB1dCwgb3V0cHV0KTtcblxuXHRcdC8vIFVwZGF0ZSB1bmlmb3JtcyBhbmQgYnVmZmVycy5cblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF9zY2FsZScsIFsxLCAxXSwgRkxPQVQpO1xuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3RyYW5zbGF0aW9uJywgWzAsIDBdLCBGTE9BVCk7XG5cdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHF1YWRQb3NpdGlvbnNCdWZmZXIpO1xuXHRcdHRoaXMuc2V0UG9zaXRpb25BdHRyaWJ1dGUoZ2xQcm9ncmFtLCBwcm9ncmFtLm5hbWUpO1xuXG5cdFx0Ly8gRHJhdy5cblx0XHR0aGlzLnNldEJsZW5kTW9kZShwYXJhbXMuc2hvdWxkQmxlbmRBbHBoYSk7XG5cdFx0Z2wuZHJhd0FycmF5cyhnbC5UUklBTkdMRV9TVFJJUCwgMCwgNCk7XG5cdFx0Z2wuZGlzYWJsZShnbC5CTEVORCk7XG5cdH1cblxuXHQvLyBTdGVwIHByb2dyYW0gb25seSBmb3IgYSBzdHJpcCBvZiBweCBhbG9uZyB0aGUgYm91bmRhcnkuXG5cdHN0ZXBCb3VuZGFyeShcblx0XHRwYXJhbXM6IHtcblx0XHRcdHByb2dyYW06IEdQVVByb2dyYW0sXG5cdFx0XHRpbnB1dD86ICAoRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlKVtdIHwgRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlLFxuXHRcdFx0b3V0cHV0PzogRGF0YUxheWVyLCAvLyBVbmRlZmluZWQgcmVuZGVycyB0byBzY3JlZW4uXG5cdFx0XHRzaW5nbGVFZGdlPzogJ0xFRlQnIHwgJ1JJR0hUJyB8ICdUT1AnIHwgJ0JPVFRPTSc7XG5cdFx0XHRzaG91bGRCbGVuZEFscGhhPzogYm9vbGVhbixcblx0XHR9LFxuXHQpIHtcblx0XHRjb25zdCB7IGdsLCBlcnJvclN0YXRlLCBib3VuZGFyeVBvc2l0aW9uc0J1ZmZlcn0gPSB0aGlzO1xuXHRcdGNvbnN0IHsgcHJvZ3JhbSwgaW5wdXQsIG91dHB1dCB9ID0gcGFyYW1zO1xuXHRcdGNvbnN0IFsgd2lkdGgsIGhlaWdodCBdID0gb3V0cHV0ID8gb3V0cHV0LmdldERpbWVuc2lvbnMoKSA6IFsgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQgXTtcblxuXHRcdC8vIElnbm9yZSBpZiB3ZSBhcmUgaW4gZXJyb3Igc3RhdGUuXG5cdFx0aWYgKGVycm9yU3RhdGUpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBnbFByb2dyYW0gPSBwcm9ncmFtLmRlZmF1bHRQcm9ncmFtITtcblxuXHRcdC8vIERvIHNldHVwIC0gdGhpcyBtdXN0IGNvbWUgZmlyc3QuXG5cdFx0dGhpcy5kcmF3U2V0dXAoZ2xQcm9ncmFtLCBmYWxzZSwgaW5wdXQsIG91dHB1dCk7XG5cblx0XHQvLyBVcGRhdGUgdW5pZm9ybXMgYW5kIGJ1ZmZlcnMuXG5cdFx0Ly8gRnJhbWUgbmVlZHMgdG8gYmUgb2Zmc2V0IGFuZCBzY2FsZWQgc28gdGhhdCBhbGwgZm91ciBzaWRlcyBhcmUgaW4gdmlld3BvcnQuXG5cdFx0Y29uc3Qgb25lUHggPSBbIDEgLyB3aWR0aCwgMSAvIGhlaWdodF0gYXMgW251bWJlciwgbnVtYmVyXTtcblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF9zY2FsZScsIFsxIC0gb25lUHhbMF0sIDEgLSBvbmVQeFsxXV0sIEZMT0FUKTtcblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF90cmFuc2xhdGlvbicsIG9uZVB4LCBGTE9BVCk7XG5cdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGJvdW5kYXJ5UG9zaXRpb25zQnVmZmVyKTtcblx0XHR0aGlzLnNldFBvc2l0aW9uQXR0cmlidXRlKGdsUHJvZ3JhbSwgcHJvZ3JhbS5uYW1lKTtcblxuXHRcdC8vIERyYXcuXG5cdFx0dGhpcy5zZXRCbGVuZE1vZGUocGFyYW1zLnNob3VsZEJsZW5kQWxwaGEpO1xuXHRcdGlmIChwYXJhbXMuc2luZ2xlRWRnZSkge1xuXHRcdFx0c3dpdGNoKHBhcmFtcy5zaW5nbGVFZGdlKSB7XG5cdFx0XHRcdGNhc2UgJ0xFRlQnOlxuXHRcdFx0XHRcdGdsLmRyYXdBcnJheXMoZ2wuTElORVMsIDMsIDIpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICdSSUdIVCc6XG5cdFx0XHRcdFx0Z2wuZHJhd0FycmF5cyhnbC5MSU5FUywgMSwgMik7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgJ1RPUCc6XG5cdFx0XHRcdFx0Z2wuZHJhd0FycmF5cyhnbC5MSU5FUywgMiwgMik7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgJ0JPVFRPTSc6XG5cdFx0XHRcdFx0Z2wuZHJhd0FycmF5cyhnbC5MSU5FUywgMCwgMik7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbmtub3duIGJvdW5kYXJ5IGVkZ2UgdHlwZTogJHtwYXJhbXMuc2luZ2xlRWRnZX0uYCk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGdsLmRyYXdBcnJheXMoZ2wuTElORV9MT09QLCAwLCA0KTtcblx0XHR9XG5cdFx0Z2wuZGlzYWJsZShnbC5CTEVORCk7XG5cdH1cblxuXHQvLyBTdGVwIHByb2dyYW0gZm9yIGFsbCBidXQgYSBzdHJpcCBvZiBweCBhbG9uZyB0aGUgYm91bmRhcnkuXG5cdHN0ZXBOb25Cb3VuZGFyeShcblx0XHRwYXJhbXM6IHtcblx0XHRcdHByb2dyYW06IEdQVVByb2dyYW0sXG5cdFx0XHRpbnB1dD86ICAoRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlKVtdIHwgRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlLFxuXHRcdFx0b3V0cHV0PzogRGF0YUxheWVyLCAvLyBVbmRlZmluZWQgcmVuZGVycyB0byBzY3JlZW4uXG5cdFx0XHRzaG91bGRCbGVuZEFscGhhPzogYm9vbGVhbixcblx0XHR9LFxuXHQpIHtcblx0XHRjb25zdCB7IGdsLCBlcnJvclN0YXRlLCBxdWFkUG9zaXRpb25zQnVmZmVyIH0gPSB0aGlzO1xuXHRcdGNvbnN0IHsgcHJvZ3JhbSwgaW5wdXQsIG91dHB1dCB9ID0gcGFyYW1zO1xuXHRcdGNvbnN0IFsgd2lkdGgsIGhlaWdodCBdID0gb3V0cHV0ID8gb3V0cHV0LmdldERpbWVuc2lvbnMoKSA6IFsgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQgXTtcblxuXHRcdC8vIElnbm9yZSBpZiB3ZSBhcmUgaW4gZXJyb3Igc3RhdGUuXG5cdFx0aWYgKGVycm9yU3RhdGUpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBnbFByb2dyYW0gPSBwcm9ncmFtLmRlZmF1bHRQcm9ncmFtITtcblxuXHRcdC8vIERvIHNldHVwIC0gdGhpcyBtdXN0IGNvbWUgZmlyc3QuXG5cdFx0dGhpcy5kcmF3U2V0dXAoZ2xQcm9ncmFtLCBmYWxzZSwgaW5wdXQsIG91dHB1dCk7XG5cblx0XHQvLyBVcGRhdGUgdW5pZm9ybXMgYW5kIGJ1ZmZlcnMuXG5cdFx0Y29uc3Qgb25lUHggPSBbIDEgLyB3aWR0aCwgMSAvIGhlaWdodF0gYXMgW251bWJlciwgbnVtYmVyXTtcblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF9zY2FsZScsIFsxIC0gMiAqIG9uZVB4WzBdLCAxIC0gMiAqIG9uZVB4WzFdXSwgRkxPQVQpO1xuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3RyYW5zbGF0aW9uJywgb25lUHgsIEZMT0FUKTtcblx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgcXVhZFBvc2l0aW9uc0J1ZmZlcik7XG5cdFx0dGhpcy5zZXRQb3NpdGlvbkF0dHJpYnV0ZShnbFByb2dyYW0sIHByb2dyYW0ubmFtZSk7XG5cdFx0XG5cdFx0Ly8gRHJhdy5cblx0XHR0aGlzLnNldEJsZW5kTW9kZShwYXJhbXMuc2hvdWxkQmxlbmRBbHBoYSk7XG5cdFx0Z2wuZHJhd0FycmF5cyhnbC5UUklBTkdMRV9TVFJJUCwgMCwgNCk7XG5cdFx0Z2wuZGlzYWJsZShnbC5CTEVORCk7XG5cdH1cblxuXHQvLyBTdGVwIHByb2dyYW0gb25seSBmb3IgYSBjaXJjdWxhciBzcG90LlxuXHRzdGVwQ2lyY2xlKFxuXHRcdHBhcmFtczoge1xuXHRcdFx0cHJvZ3JhbTogR1BVUHJvZ3JhbSxcblx0XHRcdHBvc2l0aW9uOiBbbnVtYmVyLCBudW1iZXJdLCAvLyBQb3NpdGlvbiBpcyBpbiBzY3JlZW4gc3BhY2UgY29vcmRzLlxuXHRcdFx0cmFkaXVzOiBudW1iZXIsIC8vIFJhZGl1cyBpcyBpbiBzY3JlZW4gc3BhY2UgdW5pdHMuXG5cdFx0XHRpbnB1dD86ICAoRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlKVtdIHwgRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlLFxuXHRcdFx0b3V0cHV0PzogRGF0YUxheWVyLCAvLyBVbmRlZmluZWQgcmVuZGVycyB0byBzY3JlZW4uXG5cdFx0XHRudW1TZWdtZW50cz86IG51bWJlcixcblx0XHRcdHNob3VsZEJsZW5kQWxwaGE/OiBib29sZWFuLFxuXHRcdH0sXG5cdCkge1xuXHRcdGNvbnN0IHsgZ2wsIGVycm9yU3RhdGUsIHdpZHRoLCBoZWlnaHQgfSA9IHRoaXM7XG5cdFx0Y29uc3QgeyBwcm9ncmFtLCBwb3NpdGlvbiwgcmFkaXVzLCBpbnB1dCwgb3V0cHV0IH0gPSBwYXJhbXM7XG5cblx0XHQvLyBJZ25vcmUgaWYgd2UgYXJlIGluIGVycm9yIHN0YXRlLlxuXHRcdGlmIChlcnJvclN0YXRlKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgZ2xQcm9ncmFtID0gcHJvZ3JhbS5kZWZhdWx0UHJvZ3JhbSE7XG5cblx0XHQvLyBEbyBzZXR1cCAtIHRoaXMgbXVzdCBjb21lIGZpcnN0LlxuXHRcdHRoaXMuZHJhd1NldHVwKGdsUHJvZ3JhbSwgZmFsc2UsIGlucHV0LCBvdXRwdXQpO1xuXG5cdFx0Ly8gVXBkYXRlIHVuaWZvcm1zIGFuZCBidWZmZXJzLlxuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3NjYWxlJywgW3JhZGl1cyAqIDIgLyB3aWR0aCwgcmFkaXVzICogMiAvIGhlaWdodF0sIEZMT0FUKTtcblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF90cmFuc2xhdGlvbicsIFsyICogcG9zaXRpb25bMF0gLyB3aWR0aCAtIDEsIDIgKiBwb3NpdGlvblsxXSAvIGhlaWdodCAtIDFdLCBGTE9BVCk7XG5cdFx0Y29uc3QgbnVtU2VnbWVudHMgPSBwYXJhbXMubnVtU2VnbWVudHMgPyBwYXJhbXMubnVtU2VnbWVudHMgOiBERUZBVUxUX0NJUkNMRV9OVU1fU0VHTUVOVFM7XG5cdFx0aWYgKG51bVNlZ21lbnRzIDwgMykge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBudW1TZWdtZW50cyBmb3IgV2ViR0xDb21wdXRlLnN0ZXBDaXJjbGUgbXVzdCBiZSBncmVhdGVyIHRoYW4gMiwgZ290ICR7bnVtU2VnbWVudHN9LmApO1xuXHRcdH1cblx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdGhpcy5nZXRDaXJjbGVQb3NpdGlvbnNCdWZmZXIobnVtU2VnbWVudHMpKTtcblx0XHR0aGlzLnNldFBvc2l0aW9uQXR0cmlidXRlKGdsUHJvZ3JhbSwgcHJvZ3JhbS5uYW1lKTtcblx0XHRcblx0XHQvLyBEcmF3LlxuXHRcdHRoaXMuc2V0QmxlbmRNb2RlKHBhcmFtcy5zaG91bGRCbGVuZEFscGhhKTtcblx0XHRnbC5kcmF3QXJyYXlzKGdsLlRSSUFOR0xFX0ZBTiwgMCwgbnVtU2VnbWVudHMgKyAyKTtcdFxuXHRcdGdsLmRpc2FibGUoZ2wuQkxFTkQpO1xuXHR9XG5cblx0Ly8gU3RlcCBwcm9ncmFtIG9ubHkgZm9yIGEgdGhpY2tlbmVkIGxpbmUgc2VnbWVudCAocm91bmRlZCBlbmQgY2FwcyBhdmFpbGFibGUpLlxuXHRzdGVwU2VnbWVudChcblx0XHRwYXJhbXM6IHtcblx0XHRcdHByb2dyYW06IEdQVVByb2dyYW0sXG5cdFx0XHRwb3NpdGlvbjE6IFtudW1iZXIsIG51bWJlcl0sIC8vIFBvc2l0aW9uIGlzIGluIHNjcmVlbiBzcGFjZSBjb29yZHMuXG5cdFx0XHRwb3NpdGlvbjI6IFtudW1iZXIsIG51bWJlcl0sIC8vIFBvc2l0aW9uIGlzIGluIHNjcmVlbiBzcGFjZSBjb29yZHMuXG5cdFx0XHR0aGlja25lc3M6IG51bWJlciwgLy8gVGhpY2tuZXNzIGlzIGluIHB4LlxuXHRcdFx0aW5wdXQ/OiAgKERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSlbXSB8IERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSxcblx0XHRcdG91dHB1dD86IERhdGFMYXllciwgLy8gVW5kZWZpbmVkIHJlbmRlcnMgdG8gc2NyZWVuLlxuXHRcdFx0ZW5kQ2Fwcz86IGJvb2xlYW4sXG5cdFx0XHRudW1DYXBTZWdtZW50cz86IG51bWJlcixcblx0XHRcdHNob3VsZEJsZW5kQWxwaGE/OiBib29sZWFuLFxuXHRcdH0sXG5cdCkge1xuXHRcdGNvbnN0IHsgZ2wsIGVycm9yU3RhdGUgfSA9IHRoaXM7XG5cdFx0Y29uc3QgeyBwcm9ncmFtLCBwb3NpdGlvbjEsIHBvc2l0aW9uMiwgdGhpY2tuZXNzLCBpbnB1dCwgb3V0cHV0IH0gPSBwYXJhbXM7XG5cdFx0Y29uc3QgWyB3aWR0aCwgaGVpZ2h0IF0gPSBvdXRwdXQgPyBvdXRwdXQuZ2V0RGltZW5zaW9ucygpIDogWyB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCBdO1xuXG5cdFx0Ly8gSWdub3JlIGlmIHdlIGFyZSBpbiBlcnJvciBzdGF0ZS5cblx0XHRpZiAoZXJyb3JTdGF0ZSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGdsUHJvZ3JhbSA9IHByb2dyYW0uc2VnbWVudFByb2dyYW0hO1xuXG5cdFx0Ly8gRG8gc2V0dXAgLSB0aGlzIG11c3QgY29tZSBmaXJzdC5cblx0XHR0aGlzLmRyYXdTZXR1cChnbFByb2dyYW0sIGZhbHNlLCBpbnB1dCwgb3V0cHV0KTtcblxuXHRcdC8vIFVwZGF0ZSB1bmlmb3JtcyBhbmQgYnVmZmVycy5cblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF9oYWxmVGhpY2tuZXNzJywgdGhpY2tuZXNzIC8gMiwgRkxPQVQpO1xuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3NjYWxlJywgWzIgLyB3aWR0aCwgMiAvIGhlaWdodF0sIEZMT0FUKTtcblx0XHRjb25zdCBkaWZmWCA9IHBvc2l0aW9uMVswXSAtIHBvc2l0aW9uMlswXTtcblx0XHRjb25zdCBkaWZmWSA9IHBvc2l0aW9uMVsxXSAtIHBvc2l0aW9uMlsxXTtcblx0XHRjb25zdCBhbmdsZSA9IE1hdGguYXRhbjIoZGlmZlksIGRpZmZYKTtcblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF9yb3RhdGlvbicsIGFuZ2xlLCBGTE9BVCk7XG5cdFx0Y29uc3QgY2VudGVyWCA9IChwb3NpdGlvbjFbMF0gKyBwb3NpdGlvbjJbMF0pIC8gMjtcblx0XHRjb25zdCBjZW50ZXJZID0gKHBvc2l0aW9uMVsxXSArIHBvc2l0aW9uMlsxXSkgLyAyO1xuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3RyYW5zbGF0aW9uJywgWzIgKiBjZW50ZXJYIC8gdGhpcy53aWR0aCAtIDEsIDIgKiBjZW50ZXJZIC8gdGhpcy5oZWlnaHQgLSAxXSwgRkxPQVQpO1xuXHRcdGNvbnN0IGxlbmd0aCA9IE1hdGguc3FydChkaWZmWCAqIGRpZmZYICsgZGlmZlkgKiBkaWZmWSk7XG5cdFx0XG5cdFx0Y29uc3QgbnVtU2VnbWVudHMgPSBwYXJhbXMubnVtQ2FwU2VnbWVudHMgPyBwYXJhbXMubnVtQ2FwU2VnbWVudHMgKiAyIDogREVGQVVMVF9DSVJDTEVfTlVNX1NFR01FTlRTO1xuXHRcdGlmIChwYXJhbXMuZW5kQ2Fwcykge1xuXHRcdFx0aWYgKG51bVNlZ21lbnRzIDwgNiB8fCBudW1TZWdtZW50cyAlIDYgIT09IDApIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBudW1TZWdtZW50cyBmb3IgV2ViR0xDb21wdXRlLnN0ZXBTZWdtZW50IG11c3QgYmUgZGl2aXNpYmxlIGJ5IDYsIGdvdCAke251bVNlZ21lbnRzfS5gKTtcblx0XHRcdH1cblx0XHRcdC8vIEhhdmUgdG8gc3VidHJhY3QgYSBzbWFsbCBvZmZzZXQgZnJvbSBsZW5ndGguXG5cdFx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF9sZW5ndGgnLCBsZW5ndGggLSB0aGlja25lc3MgKiBNYXRoLnNpbihNYXRoLlBJIC8gbnVtU2VnbWVudHMpLCBGTE9BVCk7XG5cdFx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdGhpcy5nZXRDaXJjbGVQb3NpdGlvbnNCdWZmZXIobnVtU2VnbWVudHMpKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gSGF2ZSB0byBzdWJ0cmFjdCBhIHNtYWxsIG9mZnNldCBmcm9tIGxlbmd0aC5cblx0XHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX2xlbmd0aCcsIGxlbmd0aCAtIHRoaWNrbmVzcywgRkxPQVQpO1xuXHRcdFx0Ly8gVXNlIGEgcmVjdGFuZ2xlIGluIGNhc2Ugb2Ygbm8gY2Fwcy5cblx0XHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLnF1YWRQb3NpdGlvbnNCdWZmZXIpO1xuXHRcdH1cblxuXHRcdHRoaXMuc2V0UG9zaXRpb25BdHRyaWJ1dGUoZ2xQcm9ncmFtLCBwcm9ncmFtLm5hbWUpO1xuXHRcdFxuXHRcdC8vIERyYXcuXG5cdFx0dGhpcy5zZXRCbGVuZE1vZGUocGFyYW1zLnNob3VsZEJsZW5kQWxwaGEpO1xuXHRcdGlmIChwYXJhbXMuZW5kQ2Fwcykge1xuXHRcdFx0Z2wuZHJhd0FycmF5cyhnbC5UUklBTkdMRV9GQU4sIDAsIG51bVNlZ21lbnRzICsgMik7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGdsLmRyYXdBcnJheXMoZ2wuVFJJQU5HTEVfU1RSSVAsIDAsIDQpO1xuXHRcdH1cblx0XHRnbC5kaXNhYmxlKGdsLkJMRU5EKTtcblx0fVxuXG5cdHN0ZXBQb2x5bGluZShcblx0XHRwYXJhbXM6IHtcblx0XHRcdHByb2dyYW06IEdQVVByb2dyYW0sXG5cdFx0XHRwb3NpdGlvbnM6IFtudW1iZXIsIG51bWJlcl1bXSxcblx0XHRcdHRoaWNrbmVzczogbnVtYmVyLCAvLyBUaGlja25lc3Mgb2YgbGluZSBpcyBpbiBweC5cblx0XHRcdGlucHV0PzogKERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSlbXSB8IERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSxcblx0XHRcdG91dHB1dD86IERhdGFMYXllciwgLy8gVW5kZWZpbmVkIHJlbmRlcnMgdG8gc2NyZWVuLlxuXHRcdFx0Y2xvc2VMb29wPzogYm9vbGVhbixcblx0XHRcdC8vIGluY2x1ZGVVVnM/OiBib29sZWFuLFxuXHRcdFx0Ly8gaW5jbHVkZU5vcm1hbHM/OiBib29sZWFuLFxuXHRcdFx0c2hvdWxkQmxlbmRBbHBoYT86IGJvb2xlYW4sXG5cdFx0fSxcblx0KSB7XG5cdFx0Y29uc3QgeyBwcm9ncmFtLCBpbnB1dCwgb3V0cHV0IH0gPSBwYXJhbXM7XG5cdFx0Y29uc3QgdmVydGljZXMgPSBwYXJhbXMucG9zaXRpb25zO1xuXHRcdGNvbnN0IGNsb3NlTG9vcCA9ICEhcGFyYW1zLmNsb3NlTG9vcDtcblx0XHRjb25zdCBoYWxmVGhpY2tuZXNzID0gcGFyYW1zLnRoaWNrbmVzcyAvIDI7XG5cdFx0Y29uc3QgeyBnbCwgd2lkdGgsIGhlaWdodCwgZXJyb3JTdGF0ZSB9ID0gdGhpcztcblxuXHRcdC8vIElnbm9yZSBpZiB3ZSBhcmUgaW4gZXJyb3Igc3RhdGUuXG5cdFx0aWYgKGVycm9yU3RhdGUpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBPZmZzZXQgdmVydGljZXMuXG5cdFx0Y29uc3QgbnVtUG9zaXRpb25zID0gY2xvc2VMb29wID8gdmVydGljZXMubGVuZ3RoICogNCArIDIgOiAodmVydGljZXMubGVuZ3RoIC0gMSkgKiA0O1xuXHRcdGNvbnN0IHBvc2l0aW9ucyA9IG5ldyBGbG9hdDMyQXJyYXkoMiAqIG51bVBvc2l0aW9ucyk7XG5cdFx0Ly8gY29uc3QgdXZzID0gcGFyYW1zLmluY2x1ZGVVVnMgPyBuZXcgRmxvYXQzMkFycmF5KDIgKiBudW1Qb3NpdGlvbnMpIDogdW5kZWZpbmVkO1xuXHRcdC8vIGNvbnN0IG5vcm1hbHMgPSBwYXJhbXMuaW5jbHVkZU5vcm1hbHMgPyBuZXcgRmxvYXQzMkFycmF5KDIgKiBudW1Qb3NpdGlvbnMpIDogdW5kZWZpbmVkO1xuXHRcdGNvbnN0IHV2cyA9IG5ldyBGbG9hdDMyQXJyYXkoMiAqIG51bVBvc2l0aW9ucyk7XG5cdFx0Y29uc3Qgbm9ybWFscyA9IG5ldyBGbG9hdDMyQXJyYXkoMiAqIG51bVBvc2l0aW9ucyk7XG5cblx0XHQvLyB0bXAgYXJyYXlzLlxuXHRcdGNvbnN0IHMxID0gWzAsIDBdO1xuXHRcdGNvbnN0IHMyID0gWzAsIDBdO1xuXHRcdGNvbnN0IG4xID0gWzAsIDBdO1xuXHRcdGNvbnN0IG4yID0gWzAsIDBdO1xuXHRcdGNvbnN0IG4zID0gWzAsIDBdO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdmVydGljZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGlmICghY2xvc2VMb29wICYmIGkgPT09IHZlcnRpY2VzLmxlbmd0aCAtIDEpIGNvbnRpbnVlO1xuXHRcdFx0Ly8gVmVydGljZXMgb24gdGhpcyBzZWdtZW50LlxuXHRcdFx0Y29uc3QgdjEgPSB2ZXJ0aWNlc1tpXTtcblx0XHRcdGNvbnN0IHYyID0gdmVydGljZXNbKGkgKyAxKSAlIHZlcnRpY2VzLmxlbmd0aF07XG5cdFx0XHRzMVswXSA9IHYyWzBdIC0gdjFbMF07XG5cdFx0XHRzMVsxXSA9IHYyWzFdIC0gdjFbMV07XG5cdFx0XHRjb25zdCBsZW5ndGgxID0gTWF0aC5zcXJ0KHMxWzBdICogczFbMF0gKyBzMVsxXSAqIHMxWzFdKTtcblx0XHRcdG4xWzBdID0gczFbMV0gLyBsZW5ndGgxO1xuXHRcdFx0bjFbMV0gPSAtIHMxWzBdIC8gbGVuZ3RoMTtcblxuXHRcdFx0Y29uc3QgaW5kZXggPSBpICogNCArIDI7XG5cblx0XHRcdGlmICghY2xvc2VMb29wICYmIGkgPT09IDApIHtcblx0XHRcdFx0Ly8gQWRkIHN0YXJ0aW5nIHBvaW50cyB0byBwb3NpdGlvbnMgYXJyYXkuXG5cdFx0XHRcdHBvc2l0aW9uc1swXSA9IHYxWzBdICsgbjFbMF0gKiBoYWxmVGhpY2tuZXNzO1xuXHRcdFx0XHRwb3NpdGlvbnNbMV0gPSB2MVsxXSArIG4xWzFdICogaGFsZlRoaWNrbmVzcztcblx0XHRcdFx0cG9zaXRpb25zWzJdID0gdjFbMF0gLSBuMVswXSAqIGhhbGZUaGlja25lc3M7XG5cdFx0XHRcdHBvc2l0aW9uc1szXSA9IHYxWzFdIC0gbjFbMV0gKiBoYWxmVGhpY2tuZXNzO1xuXHRcdFx0XHRpZiAodXZzKSB7XG5cdFx0XHRcdFx0dXZzWzBdID0gMDtcblx0XHRcdFx0XHR1dnNbMV0gPSAxO1xuXHRcdFx0XHRcdHV2c1syXSA9IDA7XG5cdFx0XHRcdFx0dXZzWzNdID0gMDtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAobm9ybWFscykge1xuXHRcdFx0XHRcdG5vcm1hbHNbMF0gPSBuMVswXTtcblx0XHRcdFx0XHRub3JtYWxzWzFdID0gbjFbMV07XG5cdFx0XHRcdFx0bm9ybWFsc1syXSA9IG4xWzBdO1xuXHRcdFx0XHRcdG5vcm1hbHNbM10gPSBuMVsxXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCB1ID0gKGkgKyAxKSAvICh2ZXJ0aWNlcy5sZW5ndGggLSAxKTtcblxuXHRcdFx0Ly8gT2Zmc2V0IGZyb20gdjIuXG5cdFx0XHRwb3NpdGlvbnNbMiAqIGluZGV4XSA9IHYyWzBdICsgbjFbMF0gKiBoYWxmVGhpY2tuZXNzO1xuXHRcdFx0cG9zaXRpb25zWzIgKiBpbmRleCArIDFdID0gdjJbMV0gKyBuMVsxXSAqIGhhbGZUaGlja25lc3M7XG5cdFx0XHRwb3NpdGlvbnNbMiAqIGluZGV4ICsgMl0gPSB2MlswXSAtIG4xWzBdICogaGFsZlRoaWNrbmVzcztcblx0XHRcdHBvc2l0aW9uc1syICogaW5kZXggKyAzXSA9IHYyWzFdIC0gbjFbMV0gKiBoYWxmVGhpY2tuZXNzO1xuXHRcdFx0aWYgKHV2cykge1xuXHRcdFx0XHR1dnNbMiAqIGluZGV4XSA9IHU7XG5cdFx0XHRcdHV2c1syICogaW5kZXggKyAxXSA9IDE7XG5cdFx0XHRcdHV2c1syICogaW5kZXggKyAyXSA9IHU7XG5cdFx0XHRcdHV2c1syICogaW5kZXggKyAzXSA9IDA7XG5cdFx0XHR9XG5cdFx0XHRpZiAobm9ybWFscykge1xuXHRcdFx0XHRub3JtYWxzWzIgKiBpbmRleF0gPSBuMVswXTtcblx0XHRcdFx0bm9ybWFsc1syICogaW5kZXggKyAxXSA9IG4xWzFdO1xuXHRcdFx0XHRub3JtYWxzWzIgKiBpbmRleCArIDJdID0gbjFbMF07XG5cdFx0XHRcdG5vcm1hbHNbMiAqIGluZGV4ICsgM10gPSBuMVsxXTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKChpIDwgdmVydGljZXMubGVuZ3RoIC0gMikgfHwgY2xvc2VMb29wKSB7XG5cdFx0XHRcdC8vIFZlcnRpY2VzIG9uIG5leHQgc2VnbWVudC5cblx0XHRcdFx0Y29uc3QgdjMgPSB2ZXJ0aWNlc1soaSArIDEpICUgdmVydGljZXMubGVuZ3RoXTtcblx0XHRcdFx0Y29uc3QgdjQgPSB2ZXJ0aWNlc1soaSArIDIpICUgdmVydGljZXMubGVuZ3RoXTtcblx0XHRcdFx0czJbMF0gPSB2NFswXSAtIHYzWzBdO1xuXHRcdFx0XHRzMlsxXSA9IHY0WzFdIC0gdjNbMV07XG5cdFx0XHRcdGNvbnN0IGxlbmd0aDIgPSBNYXRoLnNxcnQoczJbMF0gKiBzMlswXSArIHMyWzFdICogczJbMV0pO1xuXHRcdFx0XHRuMlswXSA9IHMyWzFdIC8gbGVuZ3RoMjtcblx0XHRcdFx0bjJbMV0gPSAtIHMyWzBdIC8gbGVuZ3RoMjtcblxuXHRcdFx0XHQvLyBPZmZzZXQgZnJvbSB2M1xuXHRcdFx0XHRwb3NpdGlvbnNbMiAqICgoaW5kZXggKyAyKSAlICg0ICogdmVydGljZXMubGVuZ3RoKSldID0gdjNbMF0gKyBuMlswXSAqIGhhbGZUaGlja25lc3M7XG5cdFx0XHRcdHBvc2l0aW9uc1syICogKChpbmRleCArIDIpICUgKDQgKiB2ZXJ0aWNlcy5sZW5ndGgpKSArIDFdID0gdjNbMV0gKyBuMlsxXSAqIGhhbGZUaGlja25lc3M7XG5cdFx0XHRcdHBvc2l0aW9uc1syICogKChpbmRleCArIDIpICUgKDQgKiB2ZXJ0aWNlcy5sZW5ndGgpKSArIDJdID0gdjNbMF0gLSBuMlswXSAqIGhhbGZUaGlja25lc3M7XG5cdFx0XHRcdHBvc2l0aW9uc1syICogKChpbmRleCArIDIpICUgKDQgKiB2ZXJ0aWNlcy5sZW5ndGgpKSArIDNdID0gdjNbMV0gLSBuMlsxXSAqIGhhbGZUaGlja25lc3M7XG5cdFx0XHRcdGlmICh1dnMpIHtcblx0XHRcdFx0XHR1dnNbMiAqICgoaW5kZXggKyAyKSAlICg0ICogdmVydGljZXMubGVuZ3RoKSldID0gdTtcblx0XHRcdFx0XHR1dnNbMiAqICgoaW5kZXggKyAyKSAlICg0ICogdmVydGljZXMubGVuZ3RoKSkgKyAxXSA9IDE7XG5cdFx0XHRcdFx0dXZzWzIgKiAoKGluZGV4ICsgMikgJSAoNCAqIHZlcnRpY2VzLmxlbmd0aCkpICsgMl0gPSB1O1xuXHRcdFx0XHRcdHV2c1syICogKChpbmRleCArIDIpICUgKDQgKiB2ZXJ0aWNlcy5sZW5ndGgpKSArIDNdID0gMDtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAobm9ybWFscykge1xuXHRcdFx0XHRcdG5vcm1hbHNbMiAqICgoaW5kZXggKyAyKSAlICg0ICogdmVydGljZXMubGVuZ3RoKSldID0gbjJbMF07XG5cdFx0XHRcdFx0bm9ybWFsc1syICogKChpbmRleCArIDIpICUgKDQgKiB2ZXJ0aWNlcy5sZW5ndGgpKSArIDFdID0gbjJbMV07XG5cdFx0XHRcdFx0bm9ybWFsc1syICogKChpbmRleCArIDIpICUgKDQgKiB2ZXJ0aWNlcy5sZW5ndGgpKSArIDJdID0gbjJbMF07XG5cdFx0XHRcdFx0bm9ybWFsc1syICogKChpbmRleCArIDIpICUgKDQgKiB2ZXJ0aWNlcy5sZW5ndGgpKSArIDNdID0gbjJbMV07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBDaGVjayB0aGUgYW5nbGUgYmV0d2VlbiBhZGphY2VudCBzZWdtZW50cy5cblx0XHRcdFx0Y29uc3QgY3Jvc3MgPSBuMVswXSAqIG4yWzFdIC0gbjFbMV0gKiBuMlswXTtcblx0XHRcdFx0aWYgKE1hdGguYWJzKGNyb3NzKSA8IDFlLTYpIGNvbnRpbnVlO1xuXHRcdFx0XHRuM1swXSA9IG4xWzBdICsgbjJbMF07XG5cdFx0XHRcdG4zWzFdID0gbjFbMV0gKyBuMlsxXTtcblx0XHRcdFx0Y29uc3QgbGVuZ3RoMyA9IE1hdGguc3FydChuM1swXSAqIG4zWzBdICsgbjNbMV0gKiBuM1sxXSk7XG5cdFx0XHRcdG4zWzBdIC89IGxlbmd0aDM7XG5cdFx0XHRcdG4zWzFdIC89IGxlbmd0aDM7XG5cdFx0XHRcdC8vIE1ha2UgYWRqdXN0bWVudHMgdG8gcG9zaXRpb25zLlxuXHRcdFx0XHRjb25zdCBhbmdsZSA9IE1hdGguYWNvcyhuMVswXSAqIG4yWzBdICsgbjFbMV0gKiBuMlsxXSk7XG5cdFx0XHRcdGNvbnN0IG9mZnNldCA9IGhhbGZUaGlja25lc3MgLyBNYXRoLmNvcyhhbmdsZSAvIDIpO1xuXHRcdFx0XHRpZiAoY3Jvc3MgPCAwKSB7XG5cdFx0XHRcdFx0cG9zaXRpb25zWzIgKiBpbmRleF0gPSB2MlswXSArIG4zWzBdICogb2Zmc2V0O1xuXHRcdFx0XHRcdHBvc2l0aW9uc1syICogaW5kZXggKyAxXSA9IHYyWzFdICsgbjNbMV0gKiBvZmZzZXQ7XG5cdFx0XHRcdFx0cG9zaXRpb25zWzIgKiAoKGluZGV4ICsgMikgJSAoNCAqIHZlcnRpY2VzLmxlbmd0aCkpXSA9IHBvc2l0aW9uc1syICogaW5kZXhdO1xuXHRcdFx0XHRcdHBvc2l0aW9uc1syICogKChpbmRleCArIDIpICUgKDQgKiB2ZXJ0aWNlcy5sZW5ndGgpKSArIDFdID0gcG9zaXRpb25zWzIgKiBpbmRleCArIDFdO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHBvc2l0aW9uc1syICogaW5kZXggKyAyXSA9IHYyWzBdIC0gbjNbMF0gKiBvZmZzZXQ7XG5cdFx0XHRcdFx0cG9zaXRpb25zWzIgKiBpbmRleCArIDNdID0gdjJbMV0gLSBuM1sxXSAqIG9mZnNldDtcblx0XHRcdFx0XHRwb3NpdGlvbnNbMiAqICgoaW5kZXggKyAyKSAlICg0ICogdmVydGljZXMubGVuZ3RoKSkgKyAyXSA9IHBvc2l0aW9uc1syICogaW5kZXggKyAyXTtcblx0XHRcdFx0XHRwb3NpdGlvbnNbMiAqICgoaW5kZXggKyAyKSAlICg0ICogdmVydGljZXMubGVuZ3RoKSkgKyAzXSA9IHBvc2l0aW9uc1syICogaW5kZXggKyAzXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAoY2xvc2VMb29wKSB7XG5cdFx0XHQvLyBEdXBsaWNhdGUgc3RhcnRpbmcgcG9pbnRzIHRvIGVuZCBvZiBwb3NpdGlvbnMgYXJyYXkuXG5cdFx0XHRwb3NpdGlvbnNbdmVydGljZXMubGVuZ3RoICogOF0gPSBwb3NpdGlvbnNbMF07XG5cdFx0XHRwb3NpdGlvbnNbdmVydGljZXMubGVuZ3RoICogOCArIDFdID0gcG9zaXRpb25zWzFdO1xuXHRcdFx0cG9zaXRpb25zW3ZlcnRpY2VzLmxlbmd0aCAqIDggKyAyXSA9IHBvc2l0aW9uc1syXTtcblx0XHRcdHBvc2l0aW9uc1t2ZXJ0aWNlcy5sZW5ndGggKiA4ICsgM10gPSBwb3NpdGlvbnNbM107XG5cdFx0XHRpZiAodXZzKSB7XG5cdFx0XHRcdHV2c1t2ZXJ0aWNlcy5sZW5ndGggKiA4XSA9IHV2c1swXTtcblx0XHRcdFx0dXZzW3ZlcnRpY2VzLmxlbmd0aCAqIDggKyAxXSA9IHV2c1sxXTtcblx0XHRcdFx0dXZzW3ZlcnRpY2VzLmxlbmd0aCAqIDggKyAyXSA9IHV2c1syXTtcblx0XHRcdFx0dXZzW3ZlcnRpY2VzLmxlbmd0aCAqIDggKyAzXSA9IHV2c1szXTtcblx0XHRcdH1cblx0XHRcdGlmIChub3JtYWxzKSB7XG5cdFx0XHRcdG5vcm1hbHNbdmVydGljZXMubGVuZ3RoICogOF0gPSBub3JtYWxzWzBdO1xuXHRcdFx0XHRub3JtYWxzW3ZlcnRpY2VzLmxlbmd0aCAqIDggKyAxXSA9IG5vcm1hbHNbMV07XG5cdFx0XHRcdG5vcm1hbHNbdmVydGljZXMubGVuZ3RoICogOCArIDJdID0gbm9ybWFsc1syXTtcblx0XHRcdFx0bm9ybWFsc1t2ZXJ0aWNlcy5sZW5ndGggKiA4ICsgM10gPSBub3JtYWxzWzNdO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGNvbnN0IGdsUHJvZ3JhbSA9IHByb2dyYW0ucG9seWxpbmVQcm9ncmFtITtcblxuXHRcdC8vIERvIHNldHVwIC0gdGhpcyBtdXN0IGNvbWUgZmlyc3QuXG5cdFx0dGhpcy5kcmF3U2V0dXAoZ2xQcm9ncmFtLCBmYWxzZSwgaW5wdXQsIG91dHB1dCk7XG5cblx0XHQvLyBVcGRhdGUgdW5pZm9ybXMgYW5kIGJ1ZmZlcnMuXG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfc2NhbGUnLCBbMiAvIHdpZHRoLCAyIC8gaGVpZ2h0XSwgRkxPQVQpO1xuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3RyYW5zbGF0aW9uJywgWy0xLCAtMV0sIEZMT0FUKTtcblx0XHQvLyBJbml0IHBvc2l0aW9ucyBidWZmZXIuXG5cdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHRoaXMuaW5pdFZlcnRleEJ1ZmZlcihwb3NpdGlvbnMpISk7XG5cdFx0dGhpcy5zZXRQb3NpdGlvbkF0dHJpYnV0ZShnbFByb2dyYW0sIHByb2dyYW0ubmFtZSk7XG5cdFx0aWYgKHV2cykge1xuXHRcdFx0Ly8gSW5pdCB1diBidWZmZXIuXG5cdFx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdGhpcy5pbml0VmVydGV4QnVmZmVyKHV2cykhKTtcblx0XHRcdHRoaXMuc2V0VVZBdHRyaWJ1dGUoZ2xQcm9ncmFtLCBwcm9ncmFtLm5hbWUpO1xuXHRcdH1cblx0XHRpZiAobm9ybWFscykge1xuXHRcdFx0Ly8gSW5pdCBub3JtYWxzIGJ1ZmZlci5cblx0XHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLmluaXRWZXJ0ZXhCdWZmZXIobm9ybWFscykhKTtcblx0XHRcdHRoaXMuc2V0VmVydGV4QXR0cmlidXRlKGdsUHJvZ3JhbSwgJ2FfaW50ZXJuYWxfbm9ybWFsJywgMiwgcHJvZ3JhbS5uYW1lKTtcblx0XHR9XG5cblx0XHQvLyBEcmF3LlxuXHRcdHRoaXMuc2V0QmxlbmRNb2RlKHBhcmFtcy5zaG91bGRCbGVuZEFscGhhKTtcblx0XHRnbC5kcmF3QXJyYXlzKGdsLlRSSUFOR0xFX1NUUklQLCAwLCBudW1Qb3NpdGlvbnMpO1xuXHRcdGdsLmRpc2FibGUoZ2wuQkxFTkQpO1xuXHR9XG5cblx0c3RlcFN0cmlwKFxuXHRcdHBhcmFtczoge1xuXHRcdFx0cHJvZ3JhbTogR1BVUHJvZ3JhbSxcblx0XHRcdHBvc2l0aW9uczogRmxvYXQzMkFycmF5LFxuXHRcdFx0bm9ybWFsczogRmxvYXQzMkFycmF5LFxuXHRcdFx0dXZzOiBGbG9hdDMyQXJyYXksXG5cdFx0XHRpbnB1dD86IChEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUpW10gfCBEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUsXG5cdFx0XHRvdXRwdXQ/OiBEYXRhTGF5ZXIsIC8vIFVuZGVmaW5lZCByZW5kZXJzIHRvIHNjcmVlbi5cblx0XHRcdGNvdW50PzogbnVtYmVyLFxuXHRcdFx0c2hvdWxkQmxlbmRBbHBoYT86IGJvb2xlYW4sXG5cdFx0fSxcblx0KSB7XG5cblx0XHRjb25zdCB7IHByb2dyYW0sIGlucHV0LCBvdXRwdXQsIHBvc2l0aW9ucywgdXZzLCBub3JtYWxzIH0gPSBwYXJhbXM7XG5cdFx0Y29uc3QgeyBnbCwgd2lkdGgsIGhlaWdodCwgZXJyb3JTdGF0ZSB9ID0gdGhpcztcblxuXHRcdC8vIElnbm9yZSBpZiB3ZSBhcmUgaW4gZXJyb3Igc3RhdGUuXG5cdFx0aWYgKGVycm9yU3RhdGUpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBnbFByb2dyYW0gPSBwcm9ncmFtLnBvbHlsaW5lUHJvZ3JhbSE7XG5cblx0XHQvLyBEbyBzZXR1cCAtIHRoaXMgbXVzdCBjb21lIGZpcnN0LlxuXHRcdHRoaXMuZHJhd1NldHVwKGdsUHJvZ3JhbSwgZmFsc2UsIGlucHV0LCBvdXRwdXQpO1xuXG5cdFx0Ly8gVXBkYXRlIHVuaWZvcm1zIGFuZCBidWZmZXJzLlxuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3NjYWxlJywgWzIgLyB3aWR0aCwgMiAvIGhlaWdodF0sIEZMT0FUKTtcblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF90cmFuc2xhdGlvbicsIFstMSwgLTFdLCBGTE9BVCk7XG5cdFx0Ly8gSW5pdCBwb3NpdGlvbnMgYnVmZmVyLlxuXHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLmluaXRWZXJ0ZXhCdWZmZXIocG9zaXRpb25zKSEpO1xuXHRcdHRoaXMuc2V0UG9zaXRpb25BdHRyaWJ1dGUoZ2xQcm9ncmFtLCBwcm9ncmFtLm5hbWUpO1xuXHRcdGlmICh1dnMpIHtcblx0XHRcdC8vIEluaXQgdXYgYnVmZmVyLlxuXHRcdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHRoaXMuaW5pdFZlcnRleEJ1ZmZlcih1dnMpISk7XG5cdFx0XHR0aGlzLnNldFVWQXR0cmlidXRlKGdsUHJvZ3JhbSwgcHJvZ3JhbS5uYW1lKTtcblx0XHR9XG5cdFx0aWYgKG5vcm1hbHMpIHtcblx0XHRcdC8vIEluaXQgbm9ybWFscyBidWZmZXIuXG5cdFx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdGhpcy5pbml0VmVydGV4QnVmZmVyKG5vcm1hbHMpISk7XG5cdFx0XHR0aGlzLnNldFZlcnRleEF0dHJpYnV0ZShnbFByb2dyYW0sICdhX2ludGVybmFsX25vcm1hbCcsIDIsIHByb2dyYW0ubmFtZSk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgY291bnQgPSBwYXJhbXMuY291bnQgPyBwYXJhbXMuY291bnQgOiBwb3NpdGlvbnMubGVuZ3RoIC8gMjtcblxuXHRcdC8vIERyYXcuXG5cdFx0dGhpcy5zZXRCbGVuZE1vZGUocGFyYW1zLnNob3VsZEJsZW5kQWxwaGEpO1xuXHRcdGdsLmRyYXdBcnJheXMoZ2wuVFJJQU5HTEVfU1RSSVAsIDAsIGNvdW50KTtcblx0XHRnbC5kaXNhYmxlKGdsLkJMRU5EKTtcblx0fVxuXG5cdHN0ZXBQb2ludHMoXG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRwb3NpdGlvbnM6IERhdGFMYXllciwgLy8gUG9zaXRpb25zIGluIGNhbnZhcyBweC5cblx0XHRcdHByb2dyYW0/OiBHUFVQcm9ncmFtLFxuXHRcdFx0aW5wdXQ/OiAoRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlKVtdIHwgRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlLFxuXHRcdFx0b3V0cHV0PzogRGF0YUxheWVyLFxuXHRcdFx0cG9pbnRTaXplPzogbnVtYmVyLFxuXHRcdFx0Y291bnQ/OiBudW1iZXIsXG5cdFx0XHRjb2xvcj86IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSxcblx0XHRcdHdyYXBYPzogYm9vbGVhbixcblx0XHRcdHdyYXBZPzogYm9vbGVhbixcblx0XHRcdHNob3VsZEJsZW5kQWxwaGE/OiBib29sZWFuLFxuXHRcdH0sXG5cdCkge1xuXHRcdGNvbnN0IHsgZ2wsIGVycm9yU3RhdGUsIHBvaW50SW5kZXhBcnJheSwgd2lkdGgsIGhlaWdodCB9ID0gdGhpcztcblx0XHRjb25zdCB7IHBvc2l0aW9ucywgb3V0cHV0IH0gPSBwYXJhbXM7XG5cblx0XHQvLyBJZ25vcmUgaWYgd2UgYXJlIGluIGVycm9yIHN0YXRlLlxuXHRcdGlmIChlcnJvclN0YXRlKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gQ2hlY2sgdGhhdCBudW1Qb2ludHMgaXMgdmFsaWQuXG5cdFx0aWYgKHBvc2l0aW9ucy5udW1Db21wb25lbnRzICE9PSAyICYmIHBvc2l0aW9ucy5udW1Db21wb25lbnRzICE9PSA0KSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFdlYkdMQ29tcHV0ZS5kcmF3UG9pbnRzKCkgbXVzdCBiZSBwYXNzZWQgYSBwb3NpdGlvbiBEYXRhTGF5ZXIgd2l0aCBlaXRoZXIgMiBvciA0IGNvbXBvbmVudHMsIGdvdCBwb3NpdGlvbiBEYXRhTGF5ZXIgXCIke3Bvc2l0aW9ucy5uYW1lfVwiIHdpdGggJHtwb3NpdGlvbnMubnVtQ29tcG9uZW50c30gY29tcG9uZW50cy5gKVxuXHRcdH1cblx0XHRjb25zdCBsZW5ndGggPSBwb3NpdGlvbnMuZ2V0TGVuZ3RoKCk7XG5cdFx0Y29uc3QgY291bnQgPSBwYXJhbXMuY291bnQgfHwgbGVuZ3RoO1xuXHRcdGlmIChjb3VudCA+IGxlbmd0aCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGNvdW50ICR7Y291bnR9IGZvciBwb3NpdGlvbiBEYXRhTGF5ZXIgb2YgbGVuZ3RoICR7bGVuZ3RofS5gKTtcblx0XHR9XG5cblx0XHRsZXQgcHJvZ3JhbSA9IHBhcmFtcy5wcm9ncmFtO1xuXHRcdGlmIChwcm9ncmFtID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHByb2dyYW0gPSB0aGlzLnNpbmdsZUNvbG9yUHJvZ3JhbTtcblx0XHRcdGNvbnN0IGNvbG9yID0gcGFyYW1zLmNvbG9yIHx8IFsxLCAwLCAwXTsgLy8gRGVmYXVsdCBvZiByZWQuXG5cdFx0XHRwcm9ncmFtLnNldFVuaWZvcm0oJ3VfY29sb3InLCBjb2xvciwgRkxPQVQpO1xuXHRcdH1cblx0XHRjb25zdCBnbFByb2dyYW0gPSBwcm9ncmFtLnBvaW50c1Byb2dyYW0hO1xuXG5cdFx0Ly8gQWRkIHBvc2l0aW9ucyB0byBlbmQgb2YgaW5wdXQgaWYgbmVlZGVkLlxuXHRcdGNvbnN0IGlucHV0ID0gdGhpcy5hZGRMYXllclRvSW5wdXRzKHBvc2l0aW9ucywgcGFyYW1zLmlucHV0KTtcblxuXHRcdC8vIERvIHNldHVwIC0gdGhpcyBtdXN0IGNvbWUgZmlyc3QuXG5cdFx0dGhpcy5kcmF3U2V0dXAoZ2xQcm9ncmFtLCBmYWxzZSwgaW5wdXQsIG91dHB1dCk7XG5cblx0XHQvLyBVcGRhdGUgdW5pZm9ybXMgYW5kIGJ1ZmZlcnMuXG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfcG9zaXRpb25zJywgaW5wdXQuaW5kZXhPZihwb3NpdGlvbnMpLCBJTlQpO1xuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3NjYWxlJywgWzEgLyB3aWR0aCwgMSAvIGhlaWdodF0sIEZMT0FUKTtcblx0XHQvLyBUZWxsIHdoZXRoZXIgd2UgYXJlIHVzaW5nIGFuIGFic29sdXRlIHBvc2l0aW9uICgyIGNvbXBvbmVudHMpLCBvciBwb3NpdGlvbiB3aXRoIGFjY3VtdWxhdGlvbiBidWZmZXIgKDQgY29tcG9uZW50cywgYmV0dGVyIGZsb2F0aW5nIHB0IGFjY3VyYWN5KS5cblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF9wb3NpdGlvbldpdGhBY2N1bXVsYXRpb24nLCBwb3NpdGlvbnMubnVtQ29tcG9uZW50cyA9PT0gNCA/IDEgOiAwLCBJTlQpO1xuXHRcdC8vIFNldCBkZWZhdWx0IHBvaW50U2l6ZS5cblx0XHRjb25zdCBwb2ludFNpemUgPSBwYXJhbXMucG9pbnRTaXplIHx8IDE7XG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfcG9pbnRTaXplJywgcG9pbnRTaXplLCBGTE9BVCk7XG5cdFx0Y29uc3QgcG9zaXRpb25MYXllckRpbWVuc2lvbnMgPSBwb3NpdGlvbnMuZ2V0RGltZW5zaW9ucygpO1xuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3Bvc2l0aW9uc0RpbWVuc2lvbnMnLCBwb3NpdGlvbkxheWVyRGltZW5zaW9ucywgRkxPQVQpO1xuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3dyYXBYJywgcGFyYW1zLndyYXBYID8gMSA6IDAsIElOVCk7XG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfd3JhcFknLCBwYXJhbXMud3JhcFkgPyAxIDogMCwgSU5UKTtcblx0XHRpZiAodGhpcy5wb2ludEluZGV4QnVmZmVyID09PSB1bmRlZmluZWQgfHwgKHBvaW50SW5kZXhBcnJheSAmJiBwb2ludEluZGV4QXJyYXkubGVuZ3RoIDwgY291bnQpKSB7XG5cdFx0XHQvLyBIYXZlIHRvIHVzZSBmbG9hdDMyIGFycmF5IGJjIGludCBpcyBub3Qgc3VwcG9ydGVkIGFzIGEgdmVydGV4IGF0dHJpYnV0ZSB0eXBlLlxuXHRcdFx0Y29uc3QgaW5kaWNlcyA9IG5ldyBGbG9hdDMyQXJyYXkobGVuZ3RoKTtcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aW5kaWNlc1tpXSA9IGk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLnBvaW50SW5kZXhBcnJheSA9IGluZGljZXM7XG5cdFx0XHR0aGlzLnBvaW50SW5kZXhCdWZmZXIgPSB0aGlzLmluaXRWZXJ0ZXhCdWZmZXIoaW5kaWNlcyk7XG5cdFx0fVxuXHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLnBvaW50SW5kZXhCdWZmZXIhKTtcblx0XHR0aGlzLnNldEluZGV4QXR0cmlidXRlKGdsUHJvZ3JhbSwgcHJvZ3JhbS5uYW1lKTtcblxuXHRcdC8vIERyYXcuXG5cdFx0dGhpcy5zZXRCbGVuZE1vZGUocGFyYW1zLnNob3VsZEJsZW5kQWxwaGEpO1xuXHRcdGdsLmRyYXdBcnJheXMoZ2wuUE9JTlRTLCAwLCBjb3VudCk7XG5cdFx0Z2wuZGlzYWJsZShnbC5CTEVORCk7XG5cdH1cblxuXHRkcmF3VmVjdG9yRmllbGQoXG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRmaWVsZDogRGF0YUxheWVyLFxuXHRcdFx0cHJvZ3JhbT86IEdQVVByb2dyYW0sXG5cdFx0XHRpbnB1dD86IChEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUpW10gfCBEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUsXG5cdFx0XHRvdXRwdXQ/OiBEYXRhTGF5ZXIsXG5cdFx0XHR2ZWN0b3JTcGFjaW5nPzogbnVtYmVyLFxuXHRcdFx0dmVjdG9yU2NhbGU/OiBudW1iZXIsXG5cdFx0XHRjb2xvcj86IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSxcblx0XHRcdHNob3VsZEJsZW5kQWxwaGE/OiBib29sZWFuLFxuXHRcdH0sXG5cdCkge1xuXHRcdGNvbnN0IHsgZ2wsIGVycm9yU3RhdGUsIHZlY3RvckZpZWxkSW5kZXhBcnJheSwgd2lkdGgsIGhlaWdodCB9ID0gdGhpcztcblx0XHRjb25zdCB7IGZpZWxkLCBvdXRwdXQgfSA9IHBhcmFtcztcblxuXHRcdC8vIElnbm9yZSBpZiB3ZSBhcmUgaW4gZXJyb3Igc3RhdGUuXG5cdFx0aWYgKGVycm9yU3RhdGUpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBDaGVjayB0aGF0IGZpZWxkIGlzIHZhbGlkLlxuXHRcdGlmIChmaWVsZC5udW1Db21wb25lbnRzICE9PSAyKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFdlYkdMQ29tcHV0ZS5kcmF3VmVjdG9yRmllbGQoKSBtdXN0IGJlIHBhc3NlZCBhIGZpZWxkTGF5ZXIgd2l0aCAyIGNvbXBvbmVudHMsIGdvdCBmaWVsZExheWVyIFwiJHtmaWVsZC5uYW1lfVwiIHdpdGggJHtmaWVsZC5udW1Db21wb25lbnRzfSBjb21wb25lbnRzLmApXG5cdFx0fVxuXHRcdC8vIENoZWNrIGFzcGVjdCByYXRpby5cblx0XHQvLyBjb25zdCBkaW1lbnNpb25zID0gdmVjdG9yTGF5ZXIuZ2V0RGltZW5zaW9ucygpO1xuXHRcdC8vIGlmIChNYXRoLmFicyhkaW1lbnNpb25zWzBdIC8gZGltZW5zaW9uc1sxXSAtIHdpZHRoIC8gaGVpZ2h0KSA+IDAuMDEpIHtcblx0XHQvLyBcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBhc3BlY3QgcmF0aW8gJHsoZGltZW5zaW9uc1swXSAvIGRpbWVuc2lvbnNbMV0pLnRvRml4ZWQoMyl9IHZlY3RvciBEYXRhTGF5ZXIgd2l0aCBkaW1lbnNpb25zIFske2RpbWVuc2lvbnNbMF19LCAke2RpbWVuc2lvbnNbMV19XSwgZXhwZWN0ZWQgJHsod2lkdGggLyBoZWlnaHQpLnRvRml4ZWQoMyl9LmApO1xuXHRcdC8vIH1cblxuXHRcdGxldCBwcm9ncmFtID0gcGFyYW1zLnByb2dyYW07XG5cdFx0aWYgKHByb2dyYW0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cHJvZ3JhbSA9IHRoaXMuc2luZ2xlQ29sb3JQcm9ncmFtO1xuXHRcdFx0Y29uc3QgY29sb3IgPSBwYXJhbXMuY29sb3IgfHwgWzEsIDAsIDBdOyAvLyBEZWZhdWx0IHRvIHJlZC5cblx0XHRcdHByb2dyYW0uc2V0VW5pZm9ybSgndV9jb2xvcicsIGNvbG9yLCBGTE9BVCk7XG5cdFx0fVxuXHRcdGNvbnN0IGdsUHJvZ3JhbSA9IHByb2dyYW0udmVjdG9yRmllbGRQcm9ncmFtITtcblxuXHRcdC8vIEFkZCBmaWVsZCB0byBlbmQgb2YgaW5wdXQgaWYgbmVlZGVkLlxuXHRcdGNvbnN0IGlucHV0ID0gdGhpcy5hZGRMYXllclRvSW5wdXRzKGZpZWxkLCBwYXJhbXMuaW5wdXQpO1xuXG5cdFx0Ly8gRG8gc2V0dXAgLSB0aGlzIG11c3QgY29tZSBmaXJzdC5cblx0XHR0aGlzLmRyYXdTZXR1cChnbFByb2dyYW0sIGZhbHNlLCBpbnB1dCwgb3V0cHV0KTtcblxuXHRcdC8vIFVwZGF0ZSB1bmlmb3JtcyBhbmQgYnVmZmVycy5cblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF92ZWN0b3JzJywgaW5wdXQuaW5kZXhPZihmaWVsZCksIElOVCk7XG5cdFx0Ly8gU2V0IGRlZmF1bHQgc2NhbGUuXG5cdFx0Y29uc3QgdmVjdG9yU2NhbGUgPSBwYXJhbXMudmVjdG9yU2NhbGUgfHwgMTtcblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF9zY2FsZScsIFt2ZWN0b3JTY2FsZSAvIHdpZHRoLCB2ZWN0b3JTY2FsZSAvIGhlaWdodF0sIEZMT0FUKTtcblx0XHRjb25zdCB2ZWN0b3JTcGFjaW5nID0gcGFyYW1zLnZlY3RvclNwYWNpbmcgfHwgMTA7XG5cdFx0Y29uc3Qgc3BhY2VkRGltZW5zaW9ucyA9IFtNYXRoLmZsb29yKHdpZHRoIC8gdmVjdG9yU3BhY2luZyksIE1hdGguZmxvb3IoaGVpZ2h0IC8gdmVjdG9yU3BhY2luZyldIGFzIFtudW1iZXIsIG51bWJlcl07XG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfZGltZW5zaW9ucycsIHNwYWNlZERpbWVuc2lvbnMsIEZMT0FUKTtcblx0XHRjb25zdCBsZW5ndGggPSAyICogc3BhY2VkRGltZW5zaW9uc1swXSAqIHNwYWNlZERpbWVuc2lvbnNbMV07XG5cdFx0aWYgKHRoaXMudmVjdG9yRmllbGRJbmRleEJ1ZmZlciA9PT0gdW5kZWZpbmVkIHx8ICh2ZWN0b3JGaWVsZEluZGV4QXJyYXkgJiYgdmVjdG9yRmllbGRJbmRleEFycmF5Lmxlbmd0aCA8IGxlbmd0aCkpIHtcblx0XHRcdC8vIEhhdmUgdG8gdXNlIGZsb2F0MzIgYXJyYXkgYmMgaW50IGlzIG5vdCBzdXBwb3J0ZWQgYXMgYSB2ZXJ0ZXggYXR0cmlidXRlIHR5cGUuXG5cdFx0XHRjb25zdCBpbmRpY2VzID0gbmV3IEZsb2F0MzJBcnJheShsZW5ndGgpO1xuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpbmRpY2VzW2ldID0gaTtcblx0XHRcdH1cblx0XHRcdHRoaXMudmVjdG9yRmllbGRJbmRleEFycmF5ID0gaW5kaWNlcztcblx0XHRcdHRoaXMudmVjdG9yRmllbGRJbmRleEJ1ZmZlciA9IHRoaXMuaW5pdFZlcnRleEJ1ZmZlcihpbmRpY2VzKTtcblx0XHR9XG5cdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHRoaXMudmVjdG9yRmllbGRJbmRleEJ1ZmZlciEpO1xuXHRcdHRoaXMuc2V0SW5kZXhBdHRyaWJ1dGUoZ2xQcm9ncmFtLCBwcm9ncmFtLm5hbWUpO1xuXG5cdFx0Ly8gRHJhdy5cblx0XHR0aGlzLnNldEJsZW5kTW9kZShwYXJhbXMuc2hvdWxkQmxlbmRBbHBoYSk7XG5cdFx0Z2wuZHJhd0FycmF5cyhnbC5MSU5FUywgMCwgbGVuZ3RoKTtcblx0XHRnbC5kaXNhYmxlKGdsLkJMRU5EKTtcblx0fVxuXG5cdGRyYXdMaW5lcyhcblx0XHRwYXJhbXM6IHtcblx0XHRcdHBvc2l0aW9uczogRGF0YUxheWVyLFxuXHRcdFx0Ly8gVE9ETzogYWRkIG9wdGlvbiBmb3Igbm8gaW5kaWNlcy5cblx0XHRcdGluZGljZXM6IEZsb2F0MzJBcnJheSB8IFVpbnQxNkFycmF5IHwgVWludDMyQXJyYXkgfCBJbnQxNkFycmF5IHwgSW50MzJBcnJheSxcblx0XHRcdHByb2dyYW0/OiBHUFVQcm9ncmFtLFxuXHRcdFx0aW5wdXQ/OiAoRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlKVtdIHwgRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlLFxuXHRcdFx0b3V0cHV0PzogRGF0YUxheWVyLFxuXHRcdFx0Y291bnQ/OiBudW1iZXIsXG5cdFx0XHRjb2xvcj86IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSxcblx0XHRcdHdyYXBYPzogYm9vbGVhbixcblx0XHRcdHdyYXBZPzogYm9vbGVhbixcblx0XHRcdHNob3VsZEJsZW5kQWxwaGE/OiBib29sZWFuLFxuXHRcdH0sXG5cdCkge1xuXHRcdGNvbnN0IHsgZ2wsIGVycm9yU3RhdGUsIHdpZHRoLCBoZWlnaHQgfSA9IHRoaXM7XG5cdFx0Y29uc3QgeyBwb3NpdGlvbnMsIGluZGljZXMsIG91dHB1dCB9ID0gcGFyYW1zO1xuXG5cdFx0Ly8gSWdub3JlIGlmIHdlIGFyZSBpbiBlcnJvciBzdGF0ZS5cblx0XHRpZiAoZXJyb3JTdGF0ZSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIENoZWNrIHRoYXQgcG9zaXRpb25zIGlzIHZhbGlkLlxuXHRcdGlmIChwb3NpdGlvbnMubnVtQ29tcG9uZW50cyAhPT0gMiAmJiBwb3NpdGlvbnMubnVtQ29tcG9uZW50cyAhPT0gNCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBXZWJHTENvbXB1dGUuZHJhd0luZGV4ZWRMaW5lcygpIG11c3QgYmUgcGFzc2VkIGEgcG9zaXRpb24gRGF0YUxheWVyIHdpdGggZWl0aGVyIDIgb3IgNCBjb21wb25lbnRzLCBnb3QgcG9zaXRpb24gRGF0YUxheWVyIFwiJHtwb3NpdGlvbnMubmFtZX1cIiB3aXRoICR7cG9zaXRpb25zLm51bUNvbXBvbmVudHN9IGNvbXBvbmVudHMuYClcblx0XHR9XG5cblx0XHRsZXQgcHJvZ3JhbSA9IHBhcmFtcy5wcm9ncmFtO1xuXHRcdGlmIChwcm9ncmFtID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHByb2dyYW0gPSBwYXJhbXMud3JhcFggfHwgcGFyYW1zLndyYXBZID8gdGhpcy5zaW5nbGVDb2xvcldpdGhXcmFwQ2hlY2tQcm9ncmFtIDogdGhpcy5zaW5nbGVDb2xvclByb2dyYW07XG5cdFx0XHRjb25zdCBjb2xvciA9IHBhcmFtcy5jb2xvciB8fCBbMSwgMCwgMF07IC8vIERlZmF1bHQgdG8gcmVkLlxuXHRcdFx0cHJvZ3JhbS5zZXRVbmlmb3JtKCd1X2NvbG9yJywgY29sb3IsIEZMT0FUKTtcblx0XHR9XG5cdFx0Y29uc3QgZ2xQcm9ncmFtID0gcHJvZ3JhbS5pbmRleGVkTGluZXNQcm9ncmFtITtcblxuXHRcdC8vIEFkZCBwb3NpdGlvbkxheWVyIHRvIGVuZCBvZiBpbnB1dCBpZiBuZWVkZWQuXG5cdFx0Y29uc3QgaW5wdXQgPSB0aGlzLmFkZExheWVyVG9JbnB1dHMocG9zaXRpb25zLCBwYXJhbXMuaW5wdXQpO1xuXG5cdFx0Ly8gRG8gc2V0dXAgLSB0aGlzIG11c3QgY29tZSBmaXJzdC5cblx0XHR0aGlzLmRyYXdTZXR1cChnbFByb2dyYW0sIGZhbHNlLCBpbnB1dCwgb3V0cHV0KTtcblxuXHRcdGNvbnN0IGNvdW50ID0gcGFyYW1zLmNvdW50ID8gcGFyYW1zLmNvdW50IDogaW5kaWNlcy5sZW5ndGg7XG5cblx0XHQvLyBVcGRhdGUgdW5pZm9ybXMgYW5kIGJ1ZmZlcnMuXG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfcG9zaXRpb25zJywgaW5wdXQuaW5kZXhPZihwb3NpdGlvbnMpLCBJTlQpO1xuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3NjYWxlJywgWzEgLyB3aWR0aCwgMSAvIGhlaWdodF0sIEZMT0FUKTtcblx0XHQvLyBUZWxsIHdoZXRoZXIgd2UgYXJlIHVzaW5nIGFuIGFic29sdXRlIHBvc2l0aW9uICgyIGNvbXBvbmVudHMpLCBvciBwb3NpdGlvbiB3aXRoIGFjY3VtdWxhdGlvbiBidWZmZXIgKDQgY29tcG9uZW50cywgYmV0dGVyIGZsb2F0aW5nIHB0IGFjY3VyYWN5KS5cblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF9wb3NpdGlvbldpdGhBY2N1bXVsYXRpb24nLCBwb3NpdGlvbnMubnVtQ29tcG9uZW50cyA9PT0gNCA/IDEgOiAwLCBJTlQpO1xuXHRcdGNvbnN0IHBvc2l0aW9uTGF5ZXJEaW1lbnNpb25zID0gcG9zaXRpb25zLmdldERpbWVuc2lvbnMoKTtcblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF9wb3NpdGlvbnNEaW1lbnNpb25zJywgcG9zaXRpb25MYXllckRpbWVuc2lvbnMsIEZMT0FUKTtcblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF93cmFwWCcsIHBhcmFtcy53cmFwWCA/IDEgOiAwLCBJTlQpO1xuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3dyYXBZJywgcGFyYW1zLndyYXBZID8gMSA6IDAsIElOVCk7XG5cdFx0aWYgKHRoaXMuaW5kZXhlZExpbmVzSW5kZXhCdWZmZXIgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Ly8gSGF2ZSB0byB1c2UgZmxvYXQzMiBhcnJheSBiYyBpbnQgaXMgbm90IHN1cHBvcnRlZCBhcyBhIHZlcnRleCBhdHRyaWJ1dGUgdHlwZS5cblx0XHRcdGxldCBmbG9hdEFycmF5OiBGbG9hdDMyQXJyYXk7XG5cdFx0XHRpZiAoaW5kaWNlcy5jb25zdHJ1Y3RvciAhPT0gRmxvYXQzMkFycmF5KSB7XG5cdFx0XHRcdC8vIEhhdmUgdG8gdXNlIGZsb2F0MzIgYXJyYXkgYmMgaW50IGlzIG5vdCBzdXBwb3J0ZWQgYXMgYSB2ZXJ0ZXggYXR0cmlidXRlIHR5cGUuXG5cdFx0XHRcdGZsb2F0QXJyYXkgPSBuZXcgRmxvYXQzMkFycmF5KGluZGljZXMubGVuZ3RoKTtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG5cdFx0XHRcdFx0ZmxvYXRBcnJheVtpXSA9IGluZGljZXNbaV07XG5cdFx0XHRcdH1cblx0XHRcdFx0Y29uc29sZS53YXJuKGBDb252ZXJ0aW5nIGluZGljZXMgYXJyYXkgb2YgdHlwZSAke2luZGljZXMuY29uc3RydWN0b3J9IHRvIEZsb2F0MzJBcnJheSBpbiBXZWJHTENvbXB1dGUuZHJhd0luZGV4ZWRMaW5lcyBmb3IgV2ViR0wgY29tcGF0aWJpbGl0eSwgeW91IG1heSB3YW50IHRvIHVzZSBhIEZsb2F0MzJBcnJheSB0byBzdG9yZSB0aGlzIGluZm9ybWF0aW9uIHNvIHRoZSBjb252ZXJzaW9uIGlzIG5vdCByZXF1aXJlZC5gKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZsb2F0QXJyYXkgPSBpbmRpY2VzIGFzIEZsb2F0MzJBcnJheTtcblx0XHRcdH1cblx0XHRcdHRoaXMuaW5kZXhlZExpbmVzSW5kZXhCdWZmZXIgPSB0aGlzLmluaXRWZXJ0ZXhCdWZmZXIoZmxvYXRBcnJheSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLmluZGV4ZWRMaW5lc0luZGV4QnVmZmVyISk7XG5cdFx0XHQvLyBDb3B5IGJ1ZmZlciBkYXRhLlxuXHRcdFx0Z2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsIGluZGljZXMsIGdsLlNUQVRJQ19EUkFXKTtcblx0XHR9XG5cdFx0dGhpcy5zZXRJbmRleEF0dHJpYnV0ZShnbFByb2dyYW0sIHByb2dyYW0ubmFtZSk7XG5cblx0XHQvLyBEcmF3LlxuXHRcdHRoaXMuc2V0QmxlbmRNb2RlKHBhcmFtcy5zaG91bGRCbGVuZEFscGhhKTtcblx0XHRnbC5kcmF3QXJyYXlzKGdsLkxJTkVTLCAwLCBjb3VudCk7XG5cdFx0Z2wuZGlzYWJsZShnbC5CTEVORCk7XG5cdH1cblx0XG5cdGdldENvbnRleHQoKSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2w7XG5cdH1cblxuXHRnZXRWYWx1ZXMoZGF0YUxheWVyOiBEYXRhTGF5ZXIpIHtcblx0XHRjb25zdCB7IGdsLCBnbHNsVmVyc2lvbiB9ID0gdGhpcztcblxuXHRcdC8vIEluIGNhc2UgZGF0YUxheWVyIHdhcyBub3QgdGhlIGxhc3Qgb3V0cHV0IHdyaXR0ZW4gdG8uXG5cdFx0ZGF0YUxheWVyLl9iaW5kT3V0cHV0QnVmZmVyKCk7XG5cblx0XHRjb25zdCBbIHdpZHRoLCBoZWlnaHQgXSA9IGRhdGFMYXllci5nZXREaW1lbnNpb25zKCk7XG5cdFx0bGV0IHsgZ2xOdW1DaGFubmVscywgZ2xUeXBlLCBnbEZvcm1hdCwgaW50ZXJuYWxUeXBlIH0gPSBkYXRhTGF5ZXI7XG5cdFx0bGV0IHZhbHVlcztcblx0XHRzd2l0Y2ggKGludGVybmFsVHlwZSkge1xuXHRcdFx0Y2FzZSBIQUxGX0ZMT0FUOlxuXHRcdFx0XHRpZiAoZ2wuRkxPQVQgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdC8vIEZpcmVmb3ggcmVxdWlyZXMgdGhhdCBSR0JBL0ZMT0FUIGlzIHVzZWQgZm9yIHJlYWRQaXhlbHMgb2YgZmxvYXQxNiB0eXBlcy5cblx0XHRcdFx0XHRnbE51bUNoYW5uZWxzID0gNDtcblx0XHRcdFx0XHRnbEZvcm1hdCA9IGdsLlJHQkE7XG5cdFx0XHRcdFx0Z2xUeXBlID0gZ2wuRkxPQVQ7XG5cdFx0XHRcdFx0dmFsdWVzID0gbmV3IEZsb2F0MzJBcnJheSh3aWR0aCAqIGhlaWdodCAqIGdsTnVtQ2hhbm5lbHMpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHZhbHVlcyA9IG5ldyBVaW50MTZBcnJheSh3aWR0aCAqIGhlaWdodCAqIGdsTnVtQ2hhbm5lbHMpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIC8vIFRoZSBmb2xsb3dpbmcgd29ya3MgaW4gQ2hyb21lLlxuXHRcdFx0XHQvLyB2YWx1ZXMgPSBuZXcgVWludDE2QXJyYXkod2lkdGggKiBoZWlnaHQgKiBnbE51bUNoYW5uZWxzKTtcblx0XHRcdFx0YnJlYWtcblx0XHRcdGNhc2UgRkxPQVQ6XG5cdFx0XHRcdC8vIENocm9tZSBhbmQgRmlyZWZveCByZXF1aXJlIHRoYXQgUkdCQS9GTE9BVCBpcyB1c2VkIGZvciByZWFkUGl4ZWxzIG9mIGZsb2F0MzIgdHlwZXMuXG5cdFx0XHRcdC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9LaHJvbm9zR3JvdXAvV2ViR0wvaXNzdWVzLzI3NDdcblx0XHRcdFx0Z2xOdW1DaGFubmVscyA9IDQ7XG5cdFx0XHRcdGdsRm9ybWF0ID0gZ2wuUkdCQTtcblx0XHRcdFx0dmFsdWVzID0gbmV3IEZsb2F0MzJBcnJheSh3aWR0aCAqIGhlaWdodCAqIGdsTnVtQ2hhbm5lbHMpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgVU5TSUdORURfQllURTpcblx0XHRcdFx0aWYgKGdsc2xWZXJzaW9uID09PSBHTFNMMSkge1xuXHRcdFx0XHRcdC8vIEZpcmVmb3ggcmVxdWlyZXMgdGhhdCBSR0JBL1VOU0lHTkVEX0JZVEUgaXMgdXNlZCBmb3IgcmVhZFBpeGVscyBvZiB1bnNpZ25lZCBieXRlIHR5cGVzLlxuXHRcdFx0XHRcdGdsTnVtQ2hhbm5lbHMgPSA0O1xuXHRcdFx0XHRcdGdsRm9ybWF0ID0gZ2wuUkdCQTtcblx0XHRcdFx0XHR2YWx1ZXMgPSBuZXcgVWludDhBcnJheSh3aWR0aCAqIGhlaWdodCAqIGdsTnVtQ2hhbm5lbHMpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIEZpcmVmb3ggcmVxdWlyZXMgdGhhdCBSR0JBX0lOVEVHRVIvVU5TSUdORURfSU5UIGlzIHVzZWQgZm9yIHJlYWRQaXhlbHMgb2YgdW5zaWduZWQgaW50IHR5cGVzLlxuXHRcdFx0XHRnbE51bUNoYW5uZWxzID0gNDtcblx0XHRcdFx0Z2xGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkdCQV9JTlRFR0VSO1xuXHRcdFx0XHRnbFR5cGUgPSBnbC5VTlNJR05FRF9JTlQ7XG5cdFx0XHRcdHZhbHVlcyA9IG5ldyBVaW50MzJBcnJheSh3aWR0aCAqIGhlaWdodCAqIGdsTnVtQ2hhbm5lbHMpO1xuXHRcdFx0XHQvLyAvLyBUaGUgZm9sbG93aW5nIHdvcmtzIGluIENocm9tZS5cblx0XHRcdFx0Ly8gdmFsdWVzID0gbmV3IFVpbnQ4QXJyYXkod2lkdGggKiBoZWlnaHQgKiBnbE51bUNoYW5uZWxzKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFVOU0lHTkVEX1NIT1JUOlxuXHRcdFx0XHQvLyBGaXJlZm94IHJlcXVpcmVzIHRoYXQgUkdCQV9JTlRFR0VSL1VOU0lHTkVEX0lOVCBpcyB1c2VkIGZvciByZWFkUGl4ZWxzIG9mIHVuc2lnbmVkIGludCB0eXBlcy5cblx0XHRcdFx0Z2xOdW1DaGFubmVscyA9IDQ7XG5cdFx0XHRcdGdsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHQkFfSU5URUdFUjtcblx0XHRcdFx0Z2xUeXBlID0gZ2wuVU5TSUdORURfSU5UO1xuXHRcdFx0XHR2YWx1ZXMgPSBuZXcgVWludDMyQXJyYXkod2lkdGggKiBoZWlnaHQgKiBnbE51bUNoYW5uZWxzKTtcblx0XHRcdFx0Ly8gLy8gVGhlIGZvbGxvd2luZyB3b3JrcyBpbiBDaHJvbWUuXG5cdFx0XHRcdC8vIHZhbHVlcyA9IG5ldyBVaW50MTZBcnJheSh3aWR0aCAqIGhlaWdodCAqIGdsTnVtQ2hhbm5lbHMpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgVU5TSUdORURfSU5UOlxuXHRcdFx0XHQvLyBGaXJlZm94IHJlcXVpcmVzIHRoYXQgUkdCQV9JTlRFR0VSL1VOU0lHTkVEX0lOVCBpcyB1c2VkIGZvciByZWFkUGl4ZWxzIG9mIHVuc2lnbmVkIGludCB0eXBlcy5cblx0XHRcdFx0Z2xOdW1DaGFubmVscyA9IDQ7XG5cdFx0XHRcdGdsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHQkFfSU5URUdFUjtcblx0XHRcdFx0dmFsdWVzID0gbmV3IFVpbnQzMkFycmF5KHdpZHRoICogaGVpZ2h0ICogZ2xOdW1DaGFubmVscyk7XG5cdFx0XHRcdC8vIC8vIFRoZSBmb2xsb3dpbmcgd29ya3MgaW4gQ2hyb21lLlxuXHRcdFx0XHQvLyB2YWx1ZXMgPSBuZXcgVWludDMyQXJyYXkod2lkdGggKiBoZWlnaHQgKiBnbE51bUNoYW5uZWxzKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIEJZVEU6XG5cdFx0XHRcdC8vIEZpcmVmb3ggcmVxdWlyZXMgdGhhdCBSR0JBX0lOVEVHRVIvSU5UIGlzIHVzZWQgZm9yIHJlYWRQaXhlbHMgb2YgaW50IHR5cGVzLlxuXHRcdFx0XHRnbE51bUNoYW5uZWxzID0gNDtcblx0XHRcdFx0Z2xGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkdCQV9JTlRFR0VSO1xuXHRcdFx0XHRnbFR5cGUgPSBnbC5JTlQ7XG5cdFx0XHRcdHZhbHVlcyA9IG5ldyBJbnQzMkFycmF5KHdpZHRoICogaGVpZ2h0ICogZ2xOdW1DaGFubmVscyk7XG5cdFx0XHRcdC8vIC8vIFRoZSBmb2xsb3dpbmcgd29ya3MgaW4gQ2hyb21lLlxuXHRcdFx0XHQvLyB2YWx1ZXMgPSBuZXcgSW50OEFycmF5KHdpZHRoICogaGVpZ2h0ICogZ2xOdW1DaGFubmVscyk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBTSE9SVDpcblx0XHRcdFx0Ly8gRmlyZWZveCByZXF1aXJlcyB0aGF0IFJHQkFfSU5URUdFUi9JTlQgaXMgdXNlZCBmb3IgcmVhZFBpeGVscyBvZiBpbnQgdHlwZXMuXG5cdFx0XHRcdGdsTnVtQ2hhbm5lbHMgPSA0O1xuXHRcdFx0XHRnbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR0JBX0lOVEVHRVI7XG5cdFx0XHRcdGdsVHlwZSA9IGdsLklOVDtcblx0XHRcdFx0dmFsdWVzID0gbmV3IEludDMyQXJyYXkod2lkdGggKiBoZWlnaHQgKiBnbE51bUNoYW5uZWxzKTtcblx0XHRcdFx0Ly8gLy8gVGhlIGZvbGxvd2luZyB3b3JrcyBpbiBDaHJvbWUuXG5cdFx0XHRcdC8vIHZhbHVlcyA9IG5ldyBJbnQxNkFycmF5KHdpZHRoICogaGVpZ2h0ICogZ2xOdW1DaGFubmVscyk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBJTlQ6XG5cdFx0XHRcdC8vIEZpcmVmb3ggcmVxdWlyZXMgdGhhdCBSR0JBX0lOVEVHRVIvSU5UIGlzIHVzZWQgZm9yIHJlYWRQaXhlbHMgb2YgaW50IHR5cGVzLlxuXHRcdFx0XHRnbE51bUNoYW5uZWxzID0gNDtcblx0XHRcdFx0Z2xGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkdCQV9JTlRFR0VSO1xuXHRcdFx0XHR2YWx1ZXMgPSBuZXcgSW50MzJBcnJheSh3aWR0aCAqIGhlaWdodCAqIGdsTnVtQ2hhbm5lbHMpO1xuXHRcdFx0XHQvLyAvLyBUaGUgZm9sbG93aW5nIHdvcmtzIGluIENocm9tZS5cblx0XHRcdFx0Ly8gdmFsdWVzID0gbmV3IEludDMyQXJyYXkod2lkdGggKiBoZWlnaHQgKiBnbE51bUNoYW5uZWxzKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGludGVybmFsVHlwZSAke2ludGVybmFsVHlwZX0gZm9yIGdldFZhbHVlcygpLmApO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLnJlYWR5VG9SZWFkKCkpIHtcblx0XHRcdC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9XZWJHTFJlbmRlcmluZ0NvbnRleHQvcmVhZFBpeGVsc1xuXHRcdFx0Z2wucmVhZFBpeGVscygwLCAwLCB3aWR0aCwgaGVpZ2h0LCBnbEZvcm1hdCwgZ2xUeXBlLCB2YWx1ZXMpO1xuXHRcdFx0Y29uc3QgeyBudW1Db21wb25lbnRzLCB0eXBlIH0gPSBkYXRhTGF5ZXI7XG5cdFx0XHRjb25zdCBPVVRQVVRfTEVOR1RIID0gd2lkdGggKiBoZWlnaHQgKiBudW1Db21wb25lbnRzO1xuXG5cdFx0XHQvLyBDb252ZXJ0IHVpbnQxNiB0byBmbG9hdDMyIGlmIG5lZWRlZC5cblx0XHRcdGNvbnN0IGhhbmRsZUZsb2F0MTZDb252ZXJzaW9uID0gaW50ZXJuYWxUeXBlID09PSBIQUxGX0ZMT0FUICYmIHZhbHVlcy5jb25zdHJ1Y3RvciA9PT0gVWludDE2QXJyYXk7XG5cdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRjb25zdCB2aWV3ID0gaGFuZGxlRmxvYXQxNkNvbnZlcnNpb24gPyBuZXcgRGF0YVZpZXcoKHZhbHVlcyBhcyBVaW50MTZBcnJheSkuYnVmZmVyKSA6IHVuZGVmaW5lZDtcblxuXHRcdFx0bGV0IG91dHB1dDogRGF0YUxheWVyQXJyYXlUeXBlID0gdmFsdWVzO1xuXHRcdFx0XG5cdFx0XHQvLyBXZSBtYXkgdXNlIGEgZGlmZmVyZW50IGludGVybmFsIHR5cGUgdGhhbiB0aGUgYXNzaWduZWQgdHlwZSBvZiB0aGUgRGF0YUxheWVyLlxuXHRcdFx0aWYgKGludGVybmFsVHlwZSAhPT0gdHlwZSkge1xuXHRcdFx0XHRzd2l0Y2ggKHR5cGUpIHtcblx0XHRcdFx0XHRjYXNlIEhBTEZfRkxPQVQ6XG5cdFx0XHRcdFx0Y2FzZSBGTE9BVDpcblx0XHRcdFx0XHRcdG91dHB1dCA9IG5ldyBGbG9hdDMyQXJyYXkoT1VUUFVUX0xFTkdUSCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIFVOU0lHTkVEX0JZVEU6XG5cdFx0XHRcdFx0XHRvdXRwdXQgPSBuZXcgVWludDhBcnJheShPVVRQVVRfTEVOR1RIKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgQllURTpcblx0XHRcdFx0XHRcdG91dHB1dCA9IG5ldyBJbnQ4QXJyYXkoT1VUUFVUX0xFTkdUSCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIFVOU0lHTkVEX1NIT1JUOlxuXHRcdFx0XHRcdFx0b3V0cHV0ID0gbmV3IFVpbnQxNkFycmF5KE9VVFBVVF9MRU5HVEgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBTSE9SVDpcblx0XHRcdFx0XHRcdG91dHB1dCA9IG5ldyBJbnQxNkFycmF5KE9VVFBVVF9MRU5HVEgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBVTlNJR05FRF9JTlQ6XG5cdFx0XHRcdFx0XHRvdXRwdXQgPSBuZXcgVWludDMyQXJyYXkoT1VUUFVUX0xFTkdUSCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIElOVDpcblx0XHRcdFx0XHRcdG91dHB1dCA9IG5ldyBJbnQzMkFycmF5KE9VVFBVVF9MRU5HVEgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgdHlwZSAke3R5cGV9IGZvciBnZXRWYWx1ZXMoKS5gKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBJbiBzb21lIGNhc2VzIGdsTnVtQ2hhbm5lbHMgbWF5IGJlID4gbnVtQ29tcG9uZW50cy5cblx0XHRcdGlmIChoYW5kbGVGbG9hdDE2Q29udmVyc2lvbiB8fCBvdXRwdXQgIT09IHZhbHVlcyB8fCBudW1Db21wb25lbnRzICE9PSBnbE51bUNoYW5uZWxzKSB7XG5cdFx0XHRcdGZvciAobGV0IGkgPSAwLCBsZW5ndGggPSB3aWR0aCAqIGhlaWdodDsgaSA8IGxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0Y29uc3QgaW5kZXgxID0gaSAqIGdsTnVtQ2hhbm5lbHM7XG5cdFx0XHRcdFx0Y29uc3QgaW5kZXgyID0gaSAqIG51bUNvbXBvbmVudHM7XG5cdFx0XHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCBudW1Db21wb25lbnRzOyBqKyspIHtcblx0XHRcdFx0XHRcdGlmIChoYW5kbGVGbG9hdDE2Q29udmVyc2lvbikge1xuXHRcdFx0XHRcdFx0XHRvdXRwdXRbaW5kZXgyICsgal0gPSBnZXRGbG9hdDE2KHZpZXchLCAyICogKGluZGV4MSArIGopLCB0cnVlKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdG91dHB1dFtpbmRleDIgKyBqXSA9IHZhbHVlc1tpbmRleDEgKyBqXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKG91dHB1dC5sZW5ndGggIT09IE9VVFBVVF9MRU5HVEgpIHtcblx0XHRcdFx0b3V0cHV0ID0gb3V0cHV0LnNsaWNlKDAsIE9VVFBVVF9MRU5HVEgpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG91dHB1dDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gcmVhZCB2YWx1ZXMgZnJvbSBCdWZmZXIgd2l0aCBzdGF0dXM6ICR7Z2wuY2hlY2tGcmFtZWJ1ZmZlclN0YXR1cyhnbC5GUkFNRUJVRkZFUil9LmApO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgcmVhZHlUb1JlYWQoKSB7XG5cdFx0Y29uc3QgeyBnbCB9ID0gdGhpcztcblx0XHRyZXR1cm4gZ2wuY2hlY2tGcmFtZWJ1ZmZlclN0YXR1cyhnbC5GUkFNRUJVRkZFUikgPT0gZ2wuRlJBTUVCVUZGRVJfQ09NUExFVEU7XG5cdH07XG5cblx0c2F2ZVBORyhkYXRhTGF5ZXI6IERhdGFMYXllciwgZmlsZW5hbWUgPSBkYXRhTGF5ZXIubmFtZSwgZHBpPzogbnVtYmVyKSB7XG5cdFx0Y29uc3QgdmFsdWVzID0gdGhpcy5nZXRWYWx1ZXMoZGF0YUxheWVyKTtcblx0XHRjb25zdCBbd2lkdGgsIGhlaWdodF0gPSBkYXRhTGF5ZXIuZ2V0RGltZW5zaW9ucygpO1xuXG5cdFx0Y29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG5cdFx0Y2FudmFzLndpZHRoID0gd2lkdGg7XG4gICAgXHRjYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xuXHRcdGNvbnN0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKSE7XG5cdFx0Y29uc3QgaW1hZ2VEYXRhID0gY29udGV4dC5nZXRJbWFnZURhdGEoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG5cdFx0Y29uc3QgYnVmZmVyID0gaW1hZ2VEYXRhLmRhdGE7XG5cdFx0Ly8gVE9ETzogdGhpcyBpc24ndCB3b3JraW5nIGZvciBVTlNJR05FRF9CWVRFIHR5cGVzP1xuXHRcdGNvbnN0IGlzRmxvYXQgPSBkYXRhTGF5ZXIudHlwZSA9PT0gRkxPQVQgfHwgZGF0YUxheWVyLnR5cGUgPT09IEhBTEZfRkxPQVQ7XG5cdFx0Ly8gSGF2ZSB0byBmbGlwIHRoZSB5IGF4aXMgc2luY2UgUE5HcyBhcmUgd3JpdHRlbiB0b3AgdG8gYm90dG9tLlxuXHRcdGZvciAobGV0IHkgPSAwOyB5IDwgaGVpZ2h0OyB5KyspIHtcblx0XHRcdGZvciAobGV0IHggPSAwOyB4IDwgd2lkdGg7IHgrKykge1xuXHRcdFx0XHRjb25zdCBpbmRleCA9IHkgKiB3aWR0aCArIHg7XG5cdFx0XHRcdGNvbnN0IGluZGV4RmxpcHBlZCA9IChoZWlnaHQgLSAxIC0geSkgKiB3aWR0aCArIHg7XG5cdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YUxheWVyLm51bUNvbXBvbmVudHM7IGkrKykge1xuXHRcdFx0XHRcdGJ1ZmZlcls0ICogaW5kZXhGbGlwcGVkICsgaV0gPSB2YWx1ZXNbZGF0YUxheWVyLm51bUNvbXBvbmVudHMgKiBpbmRleCArIGldICogKGlzRmxvYXQgPyAyNTUgOiAxKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoZGF0YUxheWVyLm51bUNvbXBvbmVudHMgPCA0KSB7XG5cdFx0XHRcdFx0YnVmZmVyWzQgKiBpbmRleEZsaXBwZWQgKyAzXSA9IDI1NTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHQvLyBjb25zb2xlLmxvZyh2YWx1ZXMsIGJ1ZmZlcik7XG5cdFx0Y29udGV4dC5wdXRJbWFnZURhdGEoaW1hZ2VEYXRhLCAwLCAwKTtcblxuXHRcdGNhbnZhcyEudG9CbG9iKChibG9iKSA9PiB7XG5cdFx0XHRpZiAoIWJsb2IpIHtcblx0XHRcdFx0Y29uc29sZS53YXJuKCdQcm9ibGVtIHNhdmluZyBQTkcsIHVuYWJsZSB0byBpbml0IGJsb2IuJyk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGlmIChkcGkpIHtcblx0XHRcdFx0Y2hhbmdlRHBpQmxvYihibG9iLCBkcGkpLnRoZW4oKGJsb2I6IEJsb2IpID0+e1xuXHRcdFx0XHRcdHNhdmVBcyhibG9iLCBgJHtmaWxlbmFtZX0ucG5nYCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c2F2ZUFzKGJsb2IsIGAke2ZpbGVuYW1lfS5wbmdgKTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdH0sICdpbWFnZS9wbmcnKTtcblx0fVxuXG4gICAgcmVzZXQoKSB7XG5cdFx0Ly8gVE9ETzogaW1wbGVtZW50IHRoaXMuXG5cdFx0dGhyb3cgbmV3IEVycm9yKCdXZWJHTENvbXB1dGUucmVzZXQoKSBub3QgaW1wbGVtZW50ZWQuJyk7XG5cdH07XG5cblx0YXR0YWNoRGF0YUxheWVyVG9UaHJlZVRleHR1cmUoZGF0YUxheWVyOiBEYXRhTGF5ZXIsIHRleHR1cmU6IFRleHR1cmUpIHtcblx0XHRpZiAoIXRoaXMucmVuZGVyZXIpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignV2ViR0xDb21wdXRlIHdhcyBub3QgaW5pdGVkIHdpdGggYSByZW5kZXJlci4nKTtcblx0XHR9XG5cdFx0Ly8gTGluayB3ZWJnbCB0ZXh0dXJlIHRvIHRocmVlanMgb2JqZWN0LlxuXHRcdC8vIFRoaXMgaXMgbm90IG9mZmljaWFsbHkgc3VwcG9ydGVkLlxuXHRcdGlmIChkYXRhTGF5ZXIubnVtQnVmZmVycyA+IDEpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgRGF0YUxheWVyIFwiJHtkYXRhTGF5ZXIubmFtZX1cIiBjb250YWlucyBtdWx0aXBsZSBXZWJHTCB0ZXh0dXJlcyAob25lIGZvciBlYWNoIGJ1ZmZlcikgdGhhdCBhcmUgZmxpcC1mbG9wcGVkIGR1cmluZyBjb21wdXRlIGN5Y2xlcywgcGxlYXNlIGNob29zZSBhIERhdGFMYXllciB3aXRoIG9uZSBidWZmZXIuYCk7XG5cdFx0fVxuXHRcdGNvbnN0IG9mZnNldFRleHR1cmVQcm9wZXJ0aWVzID0gdGhpcy5yZW5kZXJlci5wcm9wZXJ0aWVzLmdldCh0ZXh0dXJlKTtcblx0XHRvZmZzZXRUZXh0dXJlUHJvcGVydGllcy5fX3dlYmdsVGV4dHVyZSA9IGRhdGFMYXllci5nZXRDdXJyZW50U3RhdGVUZXh0dXJlKCk7XG5cdFx0b2Zmc2V0VGV4dHVyZVByb3BlcnRpZXMuX193ZWJnbEluaXQgPSB0cnVlO1xuXHR9XG5cblx0cmVzZXRUaHJlZVN0YXRlKCkge1xuXHRcdGlmICghdGhpcy5yZW5kZXJlcikge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdXZWJHTENvbXB1dGUgd2FzIG5vdCBpbml0ZWQgd2l0aCBhIHJlbmRlcmVyLicpO1xuXHRcdH1cblx0XHRjb25zdCB7IGdsIH0gPSB0aGlzO1xuXHRcdC8vIFJlc2V0IHZpZXdwb3J0LlxuXHRcdGNvbnN0IHZpZXdwb3J0ID0gdGhpcy5yZW5kZXJlci5nZXRWaWV3cG9ydChuZXcgdXRpbHMuVmVjdG9yNCgpIGFzIFZlY3RvcjQpO1xuXHRcdGdsLnZpZXdwb3J0KHZpZXdwb3J0LngsIHZpZXdwb3J0LnksIHZpZXdwb3J0LndpZHRoLCB2aWV3cG9ydC5oZWlnaHQpO1xuXHRcdC8vIFVuYmluZCBmcmFtZWJ1ZmZlciAocmVuZGVyIHRvIHNjcmVlbikuXG5cdFx0dGhpcy5yZW5kZXJlci5zZXRSZW5kZXJUYXJnZXQobnVsbCk7XG5cdFx0Ly8gUmVzZXQgdGV4dHVyZSBiaW5kaW5ncy5cblx0XHR0aGlzLnJlbmRlcmVyLnJlc2V0U3RhdGUoKTtcblx0fVxuXHRcblx0ZGVzdHJveSgpIHtcblx0XHQvLyBUT0RPOiBOZWVkIHRvIGltcGxlbWVudCB0aGlzLlxuXHRcdGRlbGV0ZSB0aGlzLnJlbmRlcmVyO1xuXHR9XG59IiwiY29uc3QgZXh0ZW5zaW9uczogeyBba2V5OiBzdHJpbmddOiBhbnkgfSA9IHt9O1xuXG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvT0VTX3RleHR1cmVfZmxvYXRcbi8vIEZsb2F0IGlzIHByb3ZpZGVkIGJ5IGRlZmF1bHQgaW4gV2ViR0wyIGNvbnRleHRzLlxuLy8gVGhpcyBleHRlbnNpb24gaW1wbGljaXRseSBlbmFibGVzIHRoZSBXRUJHTF9jb2xvcl9idWZmZXJfZmxvYXQgZXh0ZW5zaW9uIChpZiBzdXBwb3J0ZWQpLCB3aGljaCBhbGxvd3MgcmVuZGVyaW5nIHRvIDMyLWJpdCBmbG9hdGluZy1wb2ludCBjb2xvciBidWZmZXJzLlxuZXhwb3J0IGNvbnN0IE9FU19URVhUVVJFX0ZMT0FUID0gJ09FU190ZXh0dXJlX2Zsb2F0Jztcbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9PRVNfdGV4dHVyZV9oYWxmX2Zsb2F0XG4vLyBIYWxmIGZsb2F0IGlzIHN1cHBvcnRlZCBieSBtb2Rlcm4gbW9iaWxlIGJyb3dzZXJzLCBmbG9hdCBub3QgeWV0IHN1cHBvcnRlZC5cbi8vIEhhbGYgZmxvYXQgaXMgcHJvdmlkZWQgYnkgZGVmYXVsdCBmb3IgV2ViZ2wyIGNvbnRleHRzLlxuLy8gVGhpcyBleHRlbnNpb24gaW1wbGljaXRseSBlbmFibGVzIHRoZSBFWFRfY29sb3JfYnVmZmVyX2hhbGZfZmxvYXQgZXh0ZW5zaW9uIChpZiBzdXBwb3J0ZWQpLCB3aGljaCBhbGxvd3MgcmVuZGVyaW5nIHRvIDE2LWJpdCBmbG9hdGluZyBwb2ludCBmb3JtYXRzLlxuZXhwb3J0IGNvbnN0IE9FU19URVhUVVJFX0hBTEZfRkxPQVQgPSAnT0VTX3RleHR1cmVfaGFsZl9mbG9hdCc7XG4vLyBUT0RPOiBTZWVtcyBsaWtlIGxpbmVhciBmaWx0ZXJpbmcgb2YgZmxvYXRzIG1heSBiZSBzdXBwb3J0ZWQgaW4gc29tZSBicm93c2VycyB3aXRob3V0IHRoZXNlIGV4dGVuc2lvbnM/XG4vLyBodHRwczovL3d3dy5raHJvbm9zLm9yZy9yZWdpc3RyeS9PcGVuR0wvZXh0ZW5zaW9ucy9PRVMvT0VTX3RleHR1cmVfZmxvYXRfbGluZWFyLnR4dFxuZXhwb3J0IGNvbnN0IE9FU19URVhUVVJFX0ZMT0FUX0xJTkVBUiA9ICdPRVNfdGV4dHVyZV9mbG9hdF9saW5lYXInO1xuZXhwb3J0IGNvbnN0IE9FU19URVhUVVJFX0hBbEZfRkxPQVRfTElORUFSID0gJ09FU190ZXh0dXJlX2hhbGZfZmxvYXRfbGluZWFyJztcbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9XRUJHTF9kZXB0aF90ZXh0dXJlXG4vLyBBZGRzIGdsLlVOU0lHTkVEX1NIT1JULCBnbC5VTlNJR05FRF9JTlQgdHlwZXMgdG8gdGV4dEltYWdlMkQgaW4gV2ViR0wxLjBcbmV4cG9ydCBjb25zdCBXRUJHTF9ERVBUSF9URVhUVVJFID0gJ1dFQkdMX2RlcHRoX3RleHR1cmUnO1xuLy8gRVhUX0NPTE9SX0JVRkZFUl9GTE9BVCBhZGRzIGFiaWxpdHkgdG8gcmVuZGVyIHRvIGEgdmFyaWV0eSBvZiBmbG9hdGluZyBwdCB0ZXh0dXJlcy5cbi8vIFRoaXMgaXMgbmVlZGVkIGZvciB0aGUgV2ViR0wyIGNvbnRleHRzIHRoYXQgZG8gbm90IHN1cHBvcnQgT0VTX1RFWFRVUkVfRkxPQVQgLyBPRVNfVEVYVFVSRV9IQUxGX0ZMT0FUIGV4dGVuc2lvbnMuXG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRVhUX2NvbG9yX2J1ZmZlcl9mbG9hdFxuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMzQyNjI0OTMvZnJhbWVidWZmZXItaW5jb21wbGV0ZS1hdHRhY2htZW50LWZvci10ZXh0dXJlLXdpdGgtaW50ZXJuYWwtZm9ybWF0XG4vLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8zNjEwOTM0Ny9mcmFtZWJ1ZmZlci1pbmNvbXBsZXRlLWF0dGFjaG1lbnQtb25seS1oYXBwZW5zLW9uLWFuZHJvaWQtdy1maXJlZm94XG5leHBvcnQgY29uc3QgRVhUX0NPTE9SX0JVRkZFUl9GTE9BVCA9ICdFWFRfY29sb3JfYnVmZmVyX2Zsb2F0JztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEV4dGVuc2lvbihcblx0Z2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCB8IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQsXG5cdGV4dGVuc2lvbk5hbWU6IHN0cmluZyxcblx0ZXJyb3JDYWxsYmFjazogKG1lc3NhZ2U6IHN0cmluZykgPT4gdm9pZCxcblx0b3B0aW9uYWwgPSBmYWxzZSxcbikge1xuXHQvLyBDaGVjayBpZiB3ZSd2ZSBhbHJlYWR5IGxvYWRlZCB0aGUgZXh0ZW5zaW9uLlxuXHRpZiAoZXh0ZW5zaW9uc1tleHRlbnNpb25OYW1lXSAhPT0gdW5kZWZpbmVkKSByZXR1cm4gZXh0ZW5zaW9uc1tleHRlbnNpb25OYW1lXTtcblxuXHRsZXQgZXh0ZW5zaW9uO1xuXHR0cnkge1xuXHRcdGV4dGVuc2lvbiA9IGdsLmdldEV4dGVuc2lvbihleHRlbnNpb25OYW1lKTtcblx0fSBjYXRjaCAoZSkge31cblx0aWYgKGV4dGVuc2lvbikge1xuXHRcdC8vIENhY2hlIHRoaXMgZXh0ZW5zaW9uLlxuXHRcdGV4dGVuc2lvbnNbZXh0ZW5zaW9uTmFtZV0gPSBleHRlbnNpb247XG5cdFx0Y29uc29sZS5sb2coYExvYWRlZCBleHRlbnNpb246ICR7ZXh0ZW5zaW9uTmFtZX0uYCk7XG5cdH0gZWxzZSB7XG5cdFx0ZXh0ZW5zaW9uc1tleHRlbnNpb25OYW1lXSA9IGZhbHNlOyAvLyBDYWNoZSB0aGUgYmFkIGV4dGVuc2lvbiBsb29rdXAuXG5cdFx0Y29uc29sZS53YXJuKGBVbnN1cHBvcnRlZCAke29wdGlvbmFsID8gJ29wdGlvbmFsICcgOiAnJ31leHRlbnNpb246ICR7ZXh0ZW5zaW9uTmFtZX0uYCk7XG5cdH1cblx0Ly8gSWYgdGhlIGV4dGVuc2lvbiBpcyBub3Qgb3B0aW9uYWwsIHRocm93IGVycm9yLlxuXHRpZiAoIWV4dGVuc2lvbiAmJiAhb3B0aW9uYWwpIHtcblx0XHRlcnJvckNhbGxiYWNrKGBSZXF1aXJlZCBleHRlbnNpb24gdW5zdXBwb3J0ZWQgYnkgdGhpcyBkZXZpY2UgLyBicm93c2VyOiAke2V4dGVuc2lvbk5hbWV9LmApO1xuXHR9XG5cdHJldHVybiBleHRlbnNpb247XG59IiwiaW1wb3J0IHsgV2ViR0xDb21wdXRlIH0gZnJvbSAnLi9XZWJHTENvbXB1dGUnO1xuZXhwb3J0ICogZnJvbSAnLi9Db25zdGFudHMnO1xuXG5leHBvcnQge1xuXHRXZWJHTENvbXB1dGUsXG59OyIsIi8vIENvcGllZCBmcm9tIGh0dHA6Ly93ZWJnbGZ1bmRhbWVudGFscy5vcmcvd2ViZ2wvbGVzc29ucy93ZWJnbC1ib2lsZXJwbGF0ZS5odG1sXG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZVNoYWRlcihcblx0Z2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCB8IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQsXG5cdGVycm9yQ2FsbGJhY2s6IChtZXNzYWdlOiBzdHJpbmcpID0+IHZvaWQsXG5cdHNoYWRlclNvdXJjZTogc3RyaW5nLFxuXHRzaGFkZXJUeXBlOiBudW1iZXIsXG5cdHByb2dyYW1OYW1lPzogc3RyaW5nLFxuKSB7XG5cdC8vIENyZWF0ZSB0aGUgc2hhZGVyIG9iamVjdFxuXHRjb25zdCBzaGFkZXIgPSBnbC5jcmVhdGVTaGFkZXIoc2hhZGVyVHlwZSk7XG5cdGlmICghc2hhZGVyKSB7XG5cdFx0ZXJyb3JDYWxsYmFjaygnVW5hYmxlIHRvIGluaXQgZ2wgc2hhZGVyLicpO1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0Ly8gU2V0IHRoZSBzaGFkZXIgc291cmNlIGNvZGUuXG5cdGdsLnNoYWRlclNvdXJjZShzaGFkZXIsIHNoYWRlclNvdXJjZSk7XG5cblx0Ly8gQ29tcGlsZSB0aGUgc2hhZGVyXG5cdGdsLmNvbXBpbGVTaGFkZXIoc2hhZGVyKTtcblxuXHQvLyBDaGVjayBpZiBpdCBjb21waWxlZFxuXHRjb25zdCBzdWNjZXNzID0gZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHNoYWRlciwgZ2wuQ09NUElMRV9TVEFUVVMpO1xuXHRpZiAoIXN1Y2Nlc3MpIHtcblx0XHQvLyBTb21ldGhpbmcgd2VudCB3cm9uZyBkdXJpbmcgY29tcGlsYXRpb24gLSBwcmludCB0aGUgZXJyb3IuXG5cdFx0ZXJyb3JDYWxsYmFjayhgQ291bGQgbm90IGNvbXBpbGUgJHtzaGFkZXJUeXBlID09PSBnbC5GUkFHTUVOVF9TSEFERVIgPyAnZnJhZ21lbnQnIDogJ3ZlcnRleCd9XG5cdFx0XHQgc2hhZGVyJHtwcm9ncmFtTmFtZSA/IGAgZm9yIHByb2dyYW0gXCIke3Byb2dyYW1OYW1lfVwiYCA6ICcnfTogJHtnbC5nZXRTaGFkZXJJbmZvTG9nKHNoYWRlcil9LmApO1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdHJldHVybiBzaGFkZXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1dlYkdMMihnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0IHwgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkge1xuXHQvLyBUaGlzIGNvZGUgaXMgcHVsbGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL21yZG9vYi90aHJlZS5qcy9ibG9iL21hc3Rlci9zcmMvcmVuZGVyZXJzL3dlYmdsL1dlYkdMQ2FwYWJpbGl0aWVzLmpzXG5cdC8vIEB0cy1pZ25vcmVcblx0cmV0dXJuICh0eXBlb2YgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCAhPT0gJ3VuZGVmaW5lZCcgJiYgZ2wgaW5zdGFuY2VvZiBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KSB8fCAodHlwZW9mIFdlYkdMMkNvbXB1dGVSZW5kZXJpbmdDb250ZXh0ICE9PSAndW5kZWZpbmVkJyAmJiBnbCBpbnN0YW5jZW9mIFdlYkdMMkNvbXB1dGVSZW5kZXJpbmdDb250ZXh0KTtcblx0Ly8gcmV0dXJuICEhKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLkhBTEZfRkxPQVQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1Bvd2VyT2YyKHZhbHVlOiBudW1iZXIpIHtcblx0cmV0dXJuICh2YWx1ZSAmICh2YWx1ZSAtIDEpKSA9PSAwO1xufSIsIi8vIFRoZXNlIGFyZSB0aGUgcGFydHMgb2YgdGhyZWVqcyBWZWN0b3I0IHRoYXQgd2UgbmVlZC5cbmV4cG9ydCBjbGFzcyBWZWN0b3I0IHtcblx0eDogbnVtYmVyO1xuXHR5OiBudW1iZXI7XG5cdHo6IG51bWJlcjtcblx0dzogbnVtYmVyO1xuXHRjb25zdHJ1Y3RvciggeCA9IDAsIHkgPSAwLCB6ID0gMCwgdyA9IDEgKSB7XG5cdFx0dGhpcy54ID0geDtcblx0XHR0aGlzLnkgPSB5O1xuXHRcdHRoaXMueiA9IHo7XG5cdFx0dGhpcy53ID0gdztcblx0fVxuXHRnZXQgd2lkdGgoKSB7XG5cdFx0cmV0dXJuIHRoaXMuejtcblx0fVxuXHRnZXQgaGVpZ2h0KCkge1xuXHRcdHJldHVybiB0aGlzLnc7XG5cdH1cblx0Y29weSh2OiBWZWN0b3I0KSB7XG5cdFx0dGhpcy54ID0gdi54O1xuXHRcdHRoaXMueSA9IHYueTtcblx0XHR0aGlzLnogPSB2Lno7XG5cdFx0dGhpcy53ID0gdi53O1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG59IiwibW9kdWxlLmV4cG9ydHMgPSBcInByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5cXG52YXJ5aW5nIHZlYzIgdl9VVjtcXG5cXG51bmlmb3JtIHNhbXBsZXIyRCB1X3N0YXRlO1xcblxcbnZvaWQgbWFpbigpIHtcXG5cXHRnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodV9zdGF0ZSwgdl9VVik7XFxufVwiIiwibW9kdWxlLmV4cG9ydHMgPSBcInByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5cXG5hdHRyaWJ1dGUgdmVjMiBhX2ludGVybmFsX3Bvc2l0aW9uO1xcblxcbnVuaWZvcm0gdmVjMiB1X2ludGVybmFsX3NjYWxlO1xcbnVuaWZvcm0gdmVjMiB1X2ludGVybmFsX3RyYW5zbGF0aW9uO1xcblxcbnZhcnlpbmcgdmVjMiB2X1VWX2xvY2FsO1xcbnZhcnlpbmcgdmVjMiB2X1VWO1xcblxcbnZvaWQgbWFpbigpIHtcXG5cXHQvLyBDYWxjdWxhdGUgVVYgY29vcmRpbmF0ZXMgb2YgY3VycmVudCByZW5kZXJlZCBvYmplY3QuXFxuXFx0dl9VVl9sb2NhbCA9IDAuNSAqIChhX2ludGVybmFsX3Bvc2l0aW9uICsgMS4wKTtcXG5cXG5cXHQvLyBBcHBseSB0cmFuc2Zvcm1hdGlvbnMuXFxuXFx0dmVjMiBwb3NpdGlvbiA9IHVfaW50ZXJuYWxfc2NhbGUgKiBhX2ludGVybmFsX3Bvc2l0aW9uICsgdV9pbnRlcm5hbF90cmFuc2xhdGlvbjtcXG5cXG5cXHQvLyBDYWxjdWxhdGUgYSBnbG9iYWwgdXYgZm9yIHRoZSB2aWV3cG9ydC5cXG5cXHR2X1VWID0gMC41ICogKHBvc2l0aW9uICsgMS4wKTtcXG5cXG5cXHQvLyBDYWxjdWxhdGUgdmVydGV4IHBvc2l0aW9uLlxcblxcdGdsX1Bvc2l0aW9uID0gdmVjNChwb3NpdGlvbiwgMCwgMSk7XFxufVwiIiwibW9kdWxlLmV4cG9ydHMgPSBcInByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5wcmVjaXNpb24gaGlnaHAgaW50O1xcblxcbi8qKlxcbiAqIFJldHVybnMgYWNjdXJhdGUgTU9EIHdoZW4gYXJndW1lbnRzIGFyZSBhcHByb3hpbWF0ZSBpbnRlZ2Vycy5cXG4gKi9cXG5mbG9hdCBtb2RJKGZsb2F0IGEsIGZsb2F0IGIpIHtcXG4gICAgZmxvYXQgbSA9IGEgLSBmbG9vcigoYSArIDAuNSkgLyBiKSAqIGI7XFxuICAgIHJldHVybiBmbG9vcihtICsgMC41KTtcXG59XFxuXFxuLy8gQ2Fubm90IHVzZSBpbnQgdmVydGV4IGF0dHJpYnV0ZXM6IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzI3ODc0OTgzL3dlYmdsLWhvdy10by11c2UtaW50ZWdlci1hdHRyaWJ1dGVzLWluLWdsc2xcXG5hdHRyaWJ1dGUgZmxvYXQgYV9pbnRlcm5hbF9pbmRleDsgLy8gSW5kZXggb2YgcG9pbnQuXFxuXFxudW5pZm9ybSBzYW1wbGVyMkQgdV9pbnRlcm5hbF9wb3NpdGlvbnM7IC8vIFRleHR1cmUgbG9va3VwIHdpdGggcG9zaXRpb24gZGF0YS5cXG51bmlmb3JtIHZlYzIgdV9pbnRlcm5hbF9wb3NpdGlvbnNEaW1lbnNpb25zO1xcbnVuaWZvcm0gdmVjMiB1X2ludGVybmFsX3NjYWxlO1xcbnVuaWZvcm0gYm9vbCB1X2ludGVybmFsX3Bvc2l0aW9uV2l0aEFjY3VtdWxhdGlvbjtcXG51bmlmb3JtIGJvb2wgdV9pbnRlcm5hbF93cmFwWDtcXG51bmlmb3JtIGJvb2wgdV9pbnRlcm5hbF93cmFwWTtcXG5cXG52YXJ5aW5nIHZlYzIgdl9VVjtcXG52YXJ5aW5nIHZlYzIgdl9saW5lV3JhcHBpbmc7IC8vIFVzZSB0aGlzIHRvIHRlc3QgaWYgbGluZSBpcyBvbmx5IGhhbGYgd3JhcHBlZCBhbmQgc2hvdWxkIG5vdCBiZSByZW5kZXJlZC5cXG5cXG52b2lkIG1haW4oKSB7XFxuXFx0Ly8gQ2FsY3VsYXRlIGEgdXYgYmFzZWQgb24gdGhlIHBvaW50J3MgaW5kZXggYXR0cmlidXRlLlxcblxcdHZlYzIgcGFydGljbGVVViA9IHZlYzIoXFxuXFx0XFx0bW9kSShhX2ludGVybmFsX2luZGV4LCB1X2ludGVybmFsX3Bvc2l0aW9uc0RpbWVuc2lvbnMueCksXFxuXFx0XFx0Zmxvb3IoZmxvb3IoYV9pbnRlcm5hbF9pbmRleCArIDAuNSkgLyB1X2ludGVybmFsX3Bvc2l0aW9uc0RpbWVuc2lvbnMueClcXG5cXHQpIC8gdV9pbnRlcm5hbF9wb3NpdGlvbnNEaW1lbnNpb25zO1xcblxcblxcdC8vIENhbGN1bGF0ZSBhIGdsb2JhbCB1diBmb3IgdGhlIHZpZXdwb3J0LlxcblxcdC8vIExvb2t1cCB2ZXJ0ZXggcG9zaXRpb24gYW5kIHNjYWxlIHRvIFswLCAxXSByYW5nZS5cXG5cXHQvLyBXZSBoYXZlIHBhY2tlZCBhIDJEIGRpc3BsYWNlbWVudCB3aXRoIHRoZSBwb3NpdGlvbi5cXG5cXHR2ZWM0IHBvc2l0aW9uRGF0YSA9IHRleHR1cmUyRCh1X2ludGVybmFsX3Bvc2l0aW9ucywgcGFydGljbGVVVik7XFxuXFx0Ly8gcG9zaXRpb24gPSBmaXJzdCB0d28gY29tcG9uZW50cyBwbHVzIGxhc3QgdHdvIGNvbXBvbmVudHMgKG9wdGlvbmFsIGFjY3VtdWxhdGlvbiBidWZmZXIpLlxcblxcdHZlYzIgcG9zaXRpb25BYnNvbHV0ZSA9IHBvc2l0aW9uRGF0YS5yZztcXG5cXHRpZiAodV9pbnRlcm5hbF9wb3NpdGlvbldpdGhBY2N1bXVsYXRpb24pIHBvc2l0aW9uQWJzb2x1dGUgKz0gcG9zaXRpb25EYXRhLmJhO1xcblxcdHZfVVYgPSBwb3NpdGlvbkFic29sdXRlICogdV9pbnRlcm5hbF9zY2FsZTtcXG5cXG5cXHQvLyBXcmFwIGlmIG5lZWRlZC5cXG5cXHR2X2xpbmVXcmFwcGluZyA9IHZlYzIoMC4wKTtcXG5cXHRpZiAodV9pbnRlcm5hbF93cmFwWCkge1xcblxcdFxcdGlmICh2X1VWLnggPCAwLjApIHtcXG5cXHRcXHRcXHR2X1VWLnggKz0gMS4wO1xcblxcdFxcdFxcdHZfbGluZVdyYXBwaW5nLnggPSAxLjA7XFxuXFx0XFx0fSBlbHNlIGlmICh2X1VWLnggPiAxLjApIHtcXG5cXHRcXHRcXHR2X1VWLnggLT0gMS4wO1xcblxcdFxcdFxcdHZfbGluZVdyYXBwaW5nLnggPSAxLjA7XFxuXFx0XFx0fVxcblxcdH1cXG5cXHRpZiAodV9pbnRlcm5hbF93cmFwWSkge1xcblxcdFxcdGlmICh2X1VWLnkgPCAwLjApIHtcXG5cXHRcXHRcXHR2X1VWLnkgKz0gMS4wO1xcblxcdFxcdFxcdHZfbGluZVdyYXBwaW5nLnkgPSAxLjA7XFxuXFx0XFx0fSBlbHNlIGlmICh2X1VWLnkgPiAxLjApIHtcXG5cXHRcXHRcXHR2X1VWLnkgLT0gMS4wO1xcblxcdFxcdFxcdHZfbGluZVdyYXBwaW5nLnkgPSAxLjA7XFxuXFx0XFx0fVxcblxcdH1cXG5cXG5cXHQvLyBDYWxjdWxhdGUgcG9zaXRpb24gaW4gWy0xLCAxXSByYW5nZS5cXG5cXHR2ZWMyIHBvc2l0aW9uID0gdl9VViAqIDIuMCAtIDEuMDtcXG5cXG5cXHRnbF9Qb3NpdGlvbiA9IHZlYzQocG9zaXRpb24sIDAsIDEpO1xcbn1cIiIsIm1vZHVsZS5leHBvcnRzID0gXCJwcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxucHJlY2lzaW9uIGhpZ2hwIGludDtcXG5cXG4vKipcXG4gKiBSZXR1cm5zIGFjY3VyYXRlIE1PRCB3aGVuIGFyZ3VtZW50cyBhcmUgYXBwcm94aW1hdGUgaW50ZWdlcnMuXFxuICovXFxuZmxvYXQgbW9kSShmbG9hdCBhLCBmbG9hdCBiKSB7XFxuICAgIGZsb2F0IG0gPSBhIC0gZmxvb3IoKGEgKyAwLjUpIC8gYikgKiBiO1xcbiAgICByZXR1cm4gZmxvb3IobSArIDAuNSk7XFxufVxcblxcbi8vIENhbm5vdCB1c2UgaW50IHZlcnRleCBhdHRyaWJ1dGVzOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yNzg3NDk4My93ZWJnbC1ob3ctdG8tdXNlLWludGVnZXItYXR0cmlidXRlcy1pbi1nbHNsXFxuYXR0cmlidXRlIGZsb2F0IGFfaW50ZXJuYWxfaW5kZXg7IC8vIEluZGV4IG9mIHBvaW50LlxcblxcbnVuaWZvcm0gc2FtcGxlcjJEIHVfaW50ZXJuYWxfcG9zaXRpb25zOyAvLyBUZXh0dXJlIGxvb2t1cCB3aXRoIHBvc2l0aW9uIGRhdGEuXFxudW5pZm9ybSB2ZWMyIHVfaW50ZXJuYWxfcG9zaXRpb25zRGltZW5zaW9ucztcXG51bmlmb3JtIHZlYzIgdV9pbnRlcm5hbF9zY2FsZTtcXG51bmlmb3JtIGZsb2F0IHVfaW50ZXJuYWxfcG9pbnRTaXplO1xcbnVuaWZvcm0gYm9vbCB1X2ludGVybmFsX3Bvc2l0aW9uV2l0aEFjY3VtdWxhdGlvbjtcXG51bmlmb3JtIGJvb2wgdV9pbnRlcm5hbF93cmFwWDtcXG51bmlmb3JtIGJvb2wgdV9pbnRlcm5hbF93cmFwWTtcXG5cXG52YXJ5aW5nIHZlYzIgdl9VVjtcXG5cXG52b2lkIG1haW4oKSB7XFxuXFx0Ly8gQ2FsY3VsYXRlIGEgdXYgYmFzZWQgb24gdGhlIHBvaW50J3MgaW5kZXggYXR0cmlidXRlLlxcblxcdHZlYzIgcGFydGljbGVVViA9IHZlYzIoXFxuXFx0XFx0bW9kSShhX2ludGVybmFsX2luZGV4LCB1X2ludGVybmFsX3Bvc2l0aW9uc0RpbWVuc2lvbnMueCksXFxuXFx0XFx0Zmxvb3IoZmxvb3IoYV9pbnRlcm5hbF9pbmRleCArIDAuNSkgLyB1X2ludGVybmFsX3Bvc2l0aW9uc0RpbWVuc2lvbnMueClcXG5cXHQpIC8gdV9pbnRlcm5hbF9wb3NpdGlvbnNEaW1lbnNpb25zO1xcblxcblxcdC8vIENhbGN1bGF0ZSBhIGdsb2JhbCB1diBmb3IgdGhlIHZpZXdwb3J0LlxcblxcdC8vIExvb2t1cCB2ZXJ0ZXggcG9zaXRpb24gYW5kIHNjYWxlIHRvIFswLCAxXSByYW5nZS5cXG5cXHQvLyBXZSBoYXZlIHBhY2tlZCBhIDJEIGRpc3BsYWNlbWVudCB3aXRoIHRoZSBwb3NpdGlvbi5cXG5cXHR2ZWM0IHBvc2l0aW9uRGF0YSA9IHRleHR1cmUyRCh1X2ludGVybmFsX3Bvc2l0aW9ucywgcGFydGljbGVVVik7XFxuXFx0Ly8gcG9zaXRpb24gPSBmaXJzdCB0d28gY29tcG9uZW50cyBwbHVzIGxhc3QgdHdvIGNvbXBvbmVudHMgKG9wdGlvbmFsIGFjY3VtdWxhdGlvbiBidWZmZXIpLlxcblxcdHZlYzIgcG9zaXRpb25BYnNvbHV0ZSA9IHBvc2l0aW9uRGF0YS5yZztcXG5cXHRpZiAodV9pbnRlcm5hbF9wb3NpdGlvbldpdGhBY2N1bXVsYXRpb24pIHBvc2l0aW9uQWJzb2x1dGUgKz0gcG9zaXRpb25EYXRhLmJhO1xcblxcdHZfVVYgPSBwb3NpdGlvbkFic29sdXRlICogdV9pbnRlcm5hbF9zY2FsZTtcXG5cXG5cXHQvLyBXcmFwIGlmIG5lZWRlZC5cXG5cXHRpZiAodV9pbnRlcm5hbF93cmFwWCkge1xcblxcdFxcdGlmICh2X1VWLnggPCAwLjApIHZfVVYueCArPSAxLjA7XFxuXFx0XFx0aWYgKHZfVVYueCA+IDEuMCkgdl9VVi54IC09IDEuMDtcXG5cXHR9XFxuXFx0aWYgKHVfaW50ZXJuYWxfd3JhcFkpIHtcXG5cXHRcXHRpZiAodl9VVi55IDwgMC4wKSB2X1VWLnkgKz0gMS4wO1xcblxcdFxcdGlmICh2X1VWLnkgPiAxLjApIHZfVVYueSAtPSAxLjA7XFxuXFx0fVxcblxcblxcdC8vIENhbGN1bGF0ZSBwb3NpdGlvbiBpbiBbLTEsIDFdIHJhbmdlLlxcblxcdHZlYzIgcG9zaXRpb24gPSB2X1VWICogMi4wIC0gMS4wO1xcblxcblxcdGdsX1BvaW50U2l6ZSA9IHVfaW50ZXJuYWxfcG9pbnRTaXplO1xcblxcdGdsX1Bvc2l0aW9uID0gdmVjNChwb3NpdGlvbiwgMCwgMSk7XFxufVwiIiwibW9kdWxlLmV4cG9ydHMgPSBcInByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5cXG5hdHRyaWJ1dGUgdmVjMiBhX2ludGVybmFsX3Bvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFfaW50ZXJuYWxfdXY7XFxuYXR0cmlidXRlIHZlYzIgYV9pbnRlcm5hbF9ub3JtYWw7XFxuXFxudW5pZm9ybSB2ZWMyIHVfaW50ZXJuYWxfc2NhbGU7XFxudW5pZm9ybSB2ZWMyIHVfaW50ZXJuYWxfdHJhbnNsYXRpb247XFxuXFxudmFyeWluZyB2ZWMyIHZfVVZfbG9jYWw7XFxudmFyeWluZyB2ZWMyIHZfVVY7XFxudmFyeWluZyB2ZWMyIHZfbm9ybWFsO1xcblxcbnZvaWQgbWFpbigpIHtcXG5cXHQvLyBWYXJ5aW5ncy5cXG5cXHR2X1VWX2xvY2FsID0gYV9pbnRlcm5hbF91djtcXG5cXHR2X25vcm1hbCA9IGFfaW50ZXJuYWxfbm9ybWFsO1xcblxcblxcdC8vIEFwcGx5IHRyYW5zZm9ybWF0aW9ucy5cXG5cXHR2ZWMyIHBvc2l0aW9uID0gdV9pbnRlcm5hbF9zY2FsZSAqIGFfaW50ZXJuYWxfcG9zaXRpb24gKyB1X2ludGVybmFsX3RyYW5zbGF0aW9uO1xcblxcblxcdC8vIENhbGN1bGF0ZSBhIGdsb2JhbCB1diBmb3IgdGhlIHZpZXdwb3J0LlxcblxcdHZfVVYgPSAwLjUgKiAocG9zaXRpb24gKyAxLjApO1xcblxcblxcdC8vIENhbGN1bGF0ZSB2ZXJ0ZXggcG9zaXRpb24uXFxuXFx0Z2xfUG9zaXRpb24gPSB2ZWM0KHBvc2l0aW9uLCAwLCAxKTtcXG59XCIiLCJtb2R1bGUuZXhwb3J0cyA9IFwiLy8gVmVydGV4IHNoYWRlciBmb3IgZnVsbHNjcmVlbiBxdWFkLlxcbnByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5cXG5hdHRyaWJ1dGUgdmVjMiBhX2ludGVybmFsX3Bvc2l0aW9uO1xcblxcbnVuaWZvcm0gZmxvYXQgdV9pbnRlcm5hbF9oYWxmVGhpY2tuZXNzO1xcbnVuaWZvcm0gdmVjMiB1X2ludGVybmFsX3NjYWxlO1xcbnVuaWZvcm0gZmxvYXQgdV9pbnRlcm5hbF9sZW5ndGg7XFxudW5pZm9ybSBmbG9hdCB1X2ludGVybmFsX3JvdGF0aW9uO1xcbnVuaWZvcm0gdmVjMiB1X2ludGVybmFsX3RyYW5zbGF0aW9uO1xcblxcbnZhcnlpbmcgdmVjMiB2X1VWX2xvY2FsO1xcbnZhcnlpbmcgdmVjMiB2X1VWO1xcblxcbm1hdDIgcm90YXRlMmQoZmxvYXQgX2FuZ2xlKXtcXG5cXHRyZXR1cm4gbWF0Mihjb3MoX2FuZ2xlKSwgLXNpbihfYW5nbGUpLCBzaW4oX2FuZ2xlKSwgY29zKF9hbmdsZSkpO1xcbn1cXG5cXG52b2lkIG1haW4oKSB7XFxuXFx0Ly8gQ2FsY3VsYXRlIFVWIGNvb3JkaW5hdGVzIG9mIGN1cnJlbnQgcmVuZGVyZWQgb2JqZWN0LlxcblxcdHZfVVZfbG9jYWwgPSAwLjUgKiAoYV9pbnRlcm5hbF9wb3NpdGlvbiArIDEuMCk7XFxuXFxuXFx0dmVjMiBwb3NpdGlvbiA9IGFfaW50ZXJuYWxfcG9zaXRpb247XFxuXFxuXFx0Ly8gQXBwbHkgdGhpY2tuZXNzIC8gcmFkaXVzLlxcblxcdHBvc2l0aW9uICo9IHVfaW50ZXJuYWxfaGFsZlRoaWNrbmVzcztcXG5cXG5cXHQvLyBTdHJldGNoIGNlbnRlciBvZiBzaGFwZSB0byBmb3JtIGEgcm91bmQtY2FwcGVkIGxpbmUgc2VnbWVudC5cXG5cXHRpZiAocG9zaXRpb24ueCA8IDAuMCkge1xcblxcdFxcdHBvc2l0aW9uLnggLT0gdV9pbnRlcm5hbF9sZW5ndGggLyAyLjA7XFxuXFx0XFx0dl9VVl9sb2NhbC54ID0gMC4wOyAvLyBTZXQgZW50aXJlIGNhcCBVVi54IHRvIDAuXFxuXFx0fSBlbHNlIGlmIChwb3NpdGlvbi54ID4gMC4wKSB7XFxuXFx0XFx0cG9zaXRpb24ueCArPSB1X2ludGVybmFsX2xlbmd0aCAvIDIuMDtcXG5cXHRcXHR2X1VWX2xvY2FsLnggPSAxLjA7IC8vIFNldCBlbnRpcmUgY2FwIFVWLnggdG8gMS5cXG5cXHR9XFxuXFxuXFx0Ly8gQXBwbHkgdHJhbnNmb3JtYXRpb25zLlxcblxcdHBvc2l0aW9uID0gdV9pbnRlcm5hbF9zY2FsZSAqIChyb3RhdGUyZCgtdV9pbnRlcm5hbF9yb3RhdGlvbikgKiBwb3NpdGlvbikgKyB1X2ludGVybmFsX3RyYW5zbGF0aW9uO1xcblxcblxcdC8vIENhbGN1bGF0ZSBhIGdsb2JhbCB1diBmb3IgdGhlIHZpZXdwb3J0LlxcblxcdHZfVVYgPSAwLjUgKiAocG9zaXRpb24gKyAxLjApO1xcblxcblxcdC8vIENhbGN1bGF0ZSB2ZXJ0ZXggcG9zaXRpb24uXFxuXFx0Z2xfUG9zaXRpb24gPSB2ZWM0KHBvc2l0aW9uLCAwLCAxKTtcXG59XCIiLCJtb2R1bGUuZXhwb3J0cyA9IFwiLy8gRnJhZ21lbnQgc2hhZGVyIHRoYXQgZHJhd3MgYSBzaW5nbGUgY29sb3IuXFxucHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcblxcbnVuaWZvcm0gdmVjMyB1X2NvbG9yO1xcblxcbnZvaWQgbWFpbigpIHtcXG5cXHRnbF9GcmFnQ29sb3IgPSB2ZWM0KHVfY29sb3IsIDEpO1xcbn1cIiIsIm1vZHVsZS5leHBvcnRzID0gXCIvLyBGcmFnbWVudCBzaGFkZXIgdGhhdCBkcmF3cyBhIHNpbmdsZSBjb2xvci5cXG5wcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxuXFxudW5pZm9ybSB2ZWMzIHVfY29sb3I7XFxudmFyeWluZyB2ZWMyIHZfbGluZVdyYXBwaW5nO1xcblxcbnZvaWQgbWFpbigpIHtcXG5cXHQvLyBjaGVjayBpZiB0aGlzIGxpbmUgaGFzIHdyYXBwZWQuXFxuXFx0aWYgKCh2X2xpbmVXcmFwcGluZy54ICE9IDAuMCAmJiB2X2xpbmVXcmFwcGluZy54ICE9IDEuMCkgfHwgKHZfbGluZVdyYXBwaW5nLnkgIT0gMC4wICYmIHZfbGluZVdyYXBwaW5nLnkgIT0gMS4wKSkge1xcblxcdFxcdC8vIFJlbmRlciBub3RoaW5nLlxcblxcdFxcdGRpc2NhcmQ7XFxuXFx0XFx0cmV0dXJuO1xcblxcdH1cXG5cXHRnbF9GcmFnQ29sb3IgPSB2ZWM0KHVfY29sb3IsIDEpO1xcbn1cIiIsIm1vZHVsZS5leHBvcnRzID0gXCJwcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxucHJlY2lzaW9uIGhpZ2hwIGludDtcXG5cXG4vKipcXG4gKiBSZXR1cm5zIGFjY3VyYXRlIE1PRCB3aGVuIGFyZ3VtZW50cyBhcmUgYXBwcm94aW1hdGUgaW50ZWdlcnMuXFxuICovXFxuZmxvYXQgbW9kSShmbG9hdCBhLCBmbG9hdCBiKSB7XFxuICAgIGZsb2F0IG0gPSBhIC0gZmxvb3IoKGEgKyAwLjUpIC8gYikgKiBiO1xcbiAgICByZXR1cm4gZmxvb3IobSArIDAuNSk7XFxufVxcblxcbi8vIENhbm5vdCB1c2UgaW50IHZlcnRleCBhdHRyaWJ1dGVzOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yNzg3NDk4My93ZWJnbC1ob3ctdG8tdXNlLWludGVnZXItYXR0cmlidXRlcy1pbi1nbHNsXFxuYXR0cmlidXRlIGZsb2F0IGFfaW50ZXJuYWxfaW5kZXg7IC8vIEluZGV4IG9mIHBvaW50LlxcblxcbnVuaWZvcm0gc2FtcGxlcjJEIHVfaW50ZXJuYWxfdmVjdG9yczsgLy8gVGV4dHVyZSBsb29rdXAgd2l0aCB2ZWN0b3IgZGF0YS5cXG51bmlmb3JtIHZlYzIgdV9pbnRlcm5hbF9kaW1lbnNpb25zO1xcbnVuaWZvcm0gdmVjMiB1X2ludGVybmFsX3NjYWxlO1xcblxcbnZhcnlpbmcgdmVjMiB2X1VWO1xcblxcbnZvaWQgbWFpbigpIHtcXG5cXHQvLyBEaXZpZGUgaW5kZXggYnkgMi5cXG5cXHRmbG9hdCBpbmRleCA9IGZsb29yKChhX2ludGVybmFsX2luZGV4ICsgMC41KSAvIDIuMCk7XFxuXFx0Ly8gQ2FsY3VsYXRlIGEgdXYgYmFzZWQgb24gdGhlIHZlcnRleCBpbmRleCBhdHRyaWJ1dGUuXFxuXFx0dl9VViA9IHZlYzIoXFxuXFx0XFx0bW9kSShpbmRleCwgdV9pbnRlcm5hbF9kaW1lbnNpb25zLngpLFxcblxcdFxcdGZsb29yKGZsb29yKGluZGV4ICsgMC41KSAvIHVfaW50ZXJuYWxfZGltZW5zaW9ucy54KVxcblxcdCkgLyB1X2ludGVybmFsX2RpbWVuc2lvbnM7XFxuXFxuXFx0Ly8gQWRkIHZlY3RvciBkaXNwbGFjZW1lbnQgaWYgbmVlZGVkLlxcblxcdGlmIChtb2RJKGFfaW50ZXJuYWxfaW5kZXgsIDIuMCkgPiAwLjApIHtcXG5cXHRcXHQvLyBMb29rdXAgdmVjdG9yRGF0YSBhdCBjdXJyZW50IFVWLlxcblxcdFxcdHZlYzIgdmVjdG9yRGF0YSA9IHRleHR1cmUyRCh1X2ludGVybmFsX3ZlY3RvcnMsIHZfVVYpLnh5O1xcblxcdFxcdHZfVVYgKz0gdmVjdG9yRGF0YSAqIHVfaW50ZXJuYWxfc2NhbGU7XFxuXFx0fVxcblxcblxcdC8vIENhbGN1bGF0ZSBwb3NpdGlvbiBpbiBbLTEsIDFdIHJhbmdlLlxcblxcdHZlYzIgcG9zaXRpb24gPSB2X1VWICogMi4wIC0gMS4wO1xcblxcblxcdGdsX1Bvc2l0aW9uID0gdmVjNChwb3NpdGlvbiwgMCwgMSk7XFxufVwiIiwibW9kdWxlLmV4cG9ydHMgPSBcIiN2ZXJzaW9uIDMwMCBlc1xcbnByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5wcmVjaXNpb24gaGlnaHAgc2FtcGxlcjJEO1xcblxcbmluIHZlYzIgdl9VVjtcXG5cXG51bmlmb3JtIHNhbXBsZXIyRCB1X3N0YXRlO1xcblxcbm91dCB2ZWM0IG91dF9mcmFnQ29sb3I7XFxuXFxudm9pZCBtYWluKCkge1xcblxcdG91dF9mcmFnQ29sb3IgPSB0ZXh0dXJlKHVfc3RhdGUsIHZfVVYpO1xcbn1cIiIsIm1vZHVsZS5leHBvcnRzID0gXCIjdmVyc2lvbiAzMDAgZXNcXG5wcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxucHJlY2lzaW9uIGhpZ2hwIGludDtcXG5wcmVjaXNpb24gaGlnaHAgaXNhbXBsZXIyRDtcXG5cXG5pbiB2ZWMyIHZfVVY7XFxuXFxudW5pZm9ybSBpc2FtcGxlcjJEIHVfc3RhdGU7XFxuXFxub3V0IGl2ZWM0IG91dF9mcmFnQ29sb3I7XFxuXFxudm9pZCBtYWluKCkge1xcblxcdG91dF9mcmFnQ29sb3IgPSB0ZXh0dXJlKHVfc3RhdGUsIHZfVVYpO1xcbn1cIiIsIm1vZHVsZS5leHBvcnRzID0gXCIjdmVyc2lvbiAzMDAgZXNcXG5wcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxucHJlY2lzaW9uIGhpZ2hwIGludDtcXG5wcmVjaXNpb24gaGlnaHAgdXNhbXBsZXIyRDtcXG5cXG5pbiB2ZWMyIHZfVVY7XFxuXFxudW5pZm9ybSB1c2FtcGxlcjJEIHVfc3RhdGU7XFxuXFxub3V0IHV2ZWM0IG91dF9mcmFnQ29sb3I7XFxuXFxudm9pZCBtYWluKCkge1xcblxcdG91dF9mcmFnQ29sb3IgPSB0ZXh0dXJlKHVfc3RhdGUsIHZfVVYpO1xcbn1cIiIsIm1vZHVsZS5leHBvcnRzID0gXCIjdmVyc2lvbiAzMDAgZXNcXG5wcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxuXFxuaW4gdmVjMiBhX2ludGVybmFsX3Bvc2l0aW9uO1xcblxcbnVuaWZvcm0gdmVjMiB1X2ludGVybmFsX3NjYWxlO1xcbnVuaWZvcm0gdmVjMiB1X2ludGVybmFsX3RyYW5zbGF0aW9uO1xcblxcbm91dCB2ZWMyIHZfVVZfbG9jYWw7XFxub3V0IHZlYzIgdl9VVjtcXG5vdXQgdmVjMiBvdXRfcG9zaXRpb247XFxuXFxudm9pZCBtYWluKCkge1xcblxcdC8vIENhbGN1bGF0ZSBVViBjb29yZGluYXRlcyBvZiBjdXJyZW50IHJlbmRlcmVkIG9iamVjdC5cXG5cXHR2X1VWX2xvY2FsID0gMC41ICogKGFfaW50ZXJuYWxfcG9zaXRpb24gKyAxLjApO1xcblxcblxcdC8vIEFwcGx5IHRyYW5zZm9ybWF0aW9ucy5cXG5cXHR2ZWMyIHBvc2l0aW9uID0gdV9pbnRlcm5hbF9zY2FsZSAqIGFfaW50ZXJuYWxfcG9zaXRpb24gKyB1X2ludGVybmFsX3RyYW5zbGF0aW9uO1xcblxcblxcdC8vIENhbGN1bGF0ZSBhIGdsb2JhbCB1diBmb3IgdGhlIHZpZXdwb3J0LlxcblxcdHZfVVYgPSAwLjUgKiAocG9zaXRpb24gKyAxLjApO1xcblxcblxcdC8vIENhbGN1bGF0ZSB2ZXJ0ZXggcG9zaXRpb24uXFxuXFx0b3V0X3Bvc2l0aW9uID0gcG9zaXRpb247XFxufVwiIiwibW9kdWxlLmV4cG9ydHMgPSBcIiN2ZXJzaW9uIDMwMCBlc1xcbnByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5cXG5hdHRyaWJ1dGUgdmVjMiBhX2ludGVybmFsX3Bvc2l0aW9uO1xcblxcbnVuaWZvcm0gZmxvYXQgdV9pbnRlcm5hbF9oYWxmVGhpY2tuZXNzO1xcbnVuaWZvcm0gdmVjMiB1X2ludGVybmFsX3NjYWxlO1xcbnVuaWZvcm0gZmxvYXQgdV9pbnRlcm5hbF9sZW5ndGg7XFxudW5pZm9ybSBmbG9hdCB1X2ludGVybmFsX3JvdGF0aW9uO1xcbnVuaWZvcm0gdmVjMiB1X2ludGVybmFsX3RyYW5zbGF0aW9uO1xcblxcbnZhcnlpbmcgdmVjMiB2X1VWX2xvY2FsO1xcbnZhcnlpbmcgdmVjMiB2X1VWO1xcblxcbm1hdDIgcm90YXRlMmQoZmxvYXQgX2FuZ2xlKXtcXG5cXHRyZXR1cm4gbWF0Mihjb3MoX2FuZ2xlKSwgLXNpbihfYW5nbGUpLCBzaW4oX2FuZ2xlKSwgY29zKF9hbmdsZSkpO1xcbn1cXG5cXG52b2lkIG1haW4oKSB7XFxuXFx0Ly8gQ2FsY3VsYXRlIFVWIGNvb3JkaW5hdGVzIG9mIGN1cnJlbnQgcmVuZGVyZWQgb2JqZWN0LlxcblxcdHZfVVZfbG9jYWwgPSAwLjUgKiAoYV9pbnRlcm5hbF9wb3NpdGlvbiArIDEuMCk7XFxuXFxuXFx0dmVjMiBwb3NpdGlvbiA9IGFfaW50ZXJuYWxfcG9zaXRpb247XFxuXFxuXFx0Ly8gQXBwbHkgcmFkaXVzLlxcblxcdHBvc2l0aW9uICo9IHVfaW50ZXJuYWxfcmFkaXVzO1xcblxcblxcdC8vIFN0cmV0Y2ggY2VudGVyIG9mIHNoYXBlIHRvIGZvcm0gYSByb3VuZC1jYXBwZWQgbGluZSBzZWdtZW50LlxcblxcdGlmIChwb3NpdGlvbi54IDwgMC4wKSB7XFxuXFx0XFx0cG9zaXRpb24ueCAtPSB1X2ludGVybmFsX2xlbmd0aCAvIDIuMDtcXG5cXHRcXHR2X1VWX2xvY2FsLnggPSAwLjA7IC8vIFNldCBlbnRpcmUgY2FwIFVWLnggdG8gMC5cXG5cXHR9IGVsc2UgaWYgKHBvc2l0aW9uLnggPiAwLjApIHtcXG5cXHRcXHRwb3NpdGlvbi54ICs9IHVfaW50ZXJuYWxfbGVuZ3RoIC8gMi4wO1xcblxcdFxcdHZfVVZfbG9jYWwueCA9IDEuMDsgLy8gU2V0IGVudGlyZSBjYXAgVVYueCB0byAxLlxcblxcdH1cXG5cXG5cXHQvLyBBcHBseSB0cmFuc2Zvcm1hdGlvbnMuXFxuXFx0cG9zaXRpb24gPSB1X2ludGVybmFsX3NjYWxlICogKHJvdGF0ZTJkKC11X2ludGVybmFsX3JvdGF0aW9uKSAqIHBvc2l0aW9uKSArIHVfaW50ZXJuYWxfdHJhbnNsYXRpb247XFxuXFxuXFx0Ly8gQ2FsY3VsYXRlIGEgZ2xvYmFsIHV2IGZvciB0aGUgdmlld3BvcnQuXFxuXFx0dl9VViA9IDAuNSAqIChwb3NpdGlvbiArIDEuMCk7XFxuXFxuXFx0Ly8gQ2FsY3VsYXRlIHZlcnRleCBwb3NpdGlvbi5cXG5cXHRnbF9Qb3NpdGlvbiA9IHZlYzQocG9zaXRpb24sIDAsIDEpO1xcbn1cIiIsIm1vZHVsZS5leHBvcnRzID0gXCIvLyBGcmFnbWVudCBzaGFkZXIgdGhhdCBkcmF3cyBhIHNpbmdsZSBjb2xvci5cXG5wcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxuXFxudW5pZm9ybSB2ZWMzIHVfY29sb3I7XFxuXFxudm9pZCBtYWluKCkge1xcblxcdGdsX0ZyYWdDb2xvciA9IHZlYzQodV9jb2xvciwgMSk7XFxufVwiIiwibW9kdWxlLmV4cG9ydHMgPSBcIi8vIEZyYWdtZW50IHNoYWRlciB0aGF0IGRyYXdzIGEgc2luZ2xlIGNvbG9yLlxcbnByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5cXG51bmlmb3JtIHZlYzMgdV9jb2xvcjtcXG52YXJ5aW5nIHZlYzIgdl9saW5lV3JhcHBpbmc7XFxuXFxudm9pZCBtYWluKCkge1xcblxcdC8vIGNoZWNrIGlmIHRoaXMgbGluZSBoYXMgd3JhcHBlZC5cXG5cXHRpZiAoKHZfbGluZVdyYXBwaW5nLnggIT0gMC4wICYmIHZfbGluZVdyYXBwaW5nLnggIT0gMS4wKSB8fCAodl9saW5lV3JhcHBpbmcueSAhPSAwLjAgJiYgdl9saW5lV3JhcHBpbmcueSAhPSAxLjApKSB7XFxuXFx0XFx0Ly8gUmVuZGVyIG5vdGhpbmcuXFxuXFx0XFx0ZGlzY2FyZDtcXG5cXHRcXHRyZXR1cm47XFxuXFx0fVxcblxcdGdsX0ZyYWdDb2xvciA9IHZlYzQodV9jb2xvciwgMSk7XFxufVwiIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0bG9hZGVkOiBmYWxzZSxcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG5cdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmhtZCA9IChtb2R1bGUpID0+IHtcblx0bW9kdWxlID0gT2JqZWN0LmNyZWF0ZShtb2R1bGUpO1xuXHRpZiAoIW1vZHVsZS5jaGlsZHJlbikgbW9kdWxlLmNoaWxkcmVuID0gW107XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtb2R1bGUsICdleHBvcnRzJywge1xuXHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0c2V0OiAoKSA9PiB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0VTIE1vZHVsZXMgbWF5IG5vdCBhc3NpZ24gbW9kdWxlLmV4cG9ydHMgb3IgZXhwb3J0cy4qLCBVc2UgRVNNIGV4cG9ydCBzeW50YXgsIGluc3RlYWQ6ICcgKyBtb2R1bGUuaWQpO1xuXHRcdH1cblx0fSk7XG5cdHJldHVybiBtb2R1bGU7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9pbmRleC50c1wiKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=