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
        this.initializationData = _data;
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
    DataLayer.prototype.clone = function () {
        // Make a deep copy.
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
    Object.defineProperty(WebGLCompute.prototype, "vectorMagnitudeProgram", {
        get: function () {
            if (this._vectorMagnitudeProgram === undefined) {
                var program = this.initProgram({
                    name: 'vectorMagnitude',
                    fragmentShader: this.glslVersion === Constants_1.GLSL3 ? __webpack_require__(/*! ./glsl_3/VectorMagnitudeFragShader.glsl */ "./src/glsl_3/VectorMagnitudeFragShader.glsl") : __webpack_require__(/*! ./glsl_1/VectorMagnitudeFragShader.glsl */ "./src/glsl_1/VectorMagnitudeFragShader.glsl"),
                });
                this._vectorMagnitudeProgram = program;
            }
            return this._vectorMagnitudeProgram;
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
    WebGLCompute.prototype.cloneDataLayer = function (dataLayer) {
        var dimensions = 0;
        try {
            dimensions = dataLayer.getLength();
        }
        catch (_a) {
            dimensions = dataLayer.getDimensions();
        }
        // If read only, get initialization data if it exists.
        var data = dataLayer.writable ? undefined : dataLayer.initializationData;
        var clone = this.initDataLayer({
            name: dataLayer.name + "-copy",
            dimensions: dimensions,
            type: dataLayer.type,
            numComponents: dataLayer.numComponents,
            data: data,
            filter: dataLayer.filter,
            wrapS: dataLayer.wrapS,
            wrapT: dataLayer.wrapT,
            writable: dataLayer.writable,
            numBuffers: dataLayer.numBuffers,
        });
        // If writable, copy current state.
        if (dataLayer.writable) {
            for (var i = 0; i < dataLayer.numBuffers; i++) {
                this.step({
                    program: this.copyProgramForType(dataLayer.type),
                    input: dataLayer.getPreviousStateTexture(-dataLayer.numBuffers + i + 1),
                    output: clone,
                });
            }
        }
        return clone;
    };
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
        var count = params.count ? params.count : (indices ? indices.length : (params.positions.length / 2));
        // Update uniforms and buffers.
        program.setVertexUniform(glProgram, 'u_internal_scale', [2 / width, 2 / height], Constants_1.FLOAT);
        program.setVertexUniform(glProgram, 'u_internal_translation', [-1, -1], Constants_1.FLOAT);
        if (indices) {
            // Reorder positions array to match indices.
            var positions = new Float32Array(2 * count);
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
        var data = params.data, output = params.output;
        // Ignore if we are in error state.
        if (errorState) {
            return;
        }
        // Check that field is valid.
        if (data.numComponents !== 2) {
            throw new Error("WebGLCompute.drawLayerAsVectorField() must be passed a fieldLayer with 2 components, got fieldLayer \"" + data.name + "\" with " + data.numComponents + " components.");
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
        // Add data to end of input if needed.
        var input = this.addLayerToInputs(data, params.input);
        // Do setup - this must come first.
        this.drawSetup(glProgram, false, input, output);
        // Update uniforms and buffers.
        program.setVertexUniform(glProgram, 'u_internal_vectors', input.indexOf(data), Constants_1.INT);
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
    WebGLCompute.prototype.drawLayerMagnitude = function (params) {
        var _a = this, gl = _a.gl, errorState = _a.errorState, quadPositionsBuffer = _a.quadPositionsBuffer;
        var data = params.data, output = params.output;
        // Ignore if we are in error state.
        if (errorState) {
            return;
        }
        var program = this.vectorMagnitudeProgram;
        var color = params.color || [1, 0, 0]; // Default to red.
        program.setUniform('u_color', color, Constants_1.FLOAT);
        var scale = params.scale || 1;
        program.setUniform('u_scale', scale, Constants_1.FLOAT);
        program.setUniform('u_internal_numDimensions', data.numComponents, Constants_1.INT);
        var glProgram = program.defaultProgram;
        // Add data to end of input if needed.
        var input = this.addLayerToInputs(data, params.input);
        // Do setup - this must come first.
        this.drawSetup(glProgram, true, input, output);
        // Update uniforms and buffers.
        program.setVertexUniform(glProgram, 'u_internal_data', input.indexOf(data), Constants_1.INT);
        program.setVertexUniform(glProgram, 'u_internal_scale', [1, 1], Constants_1.FLOAT);
        program.setVertexUniform(glProgram, 'u_internal_translation', [0, 0], Constants_1.FLOAT);
        gl.bindBuffer(gl.ARRAY_BUFFER, quadPositionsBuffer);
        this.setPositionAttribute(glProgram, program.name);
        // Draw.
        this.setBlendMode(params.shouldBlendAlpha);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
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

module.exports = "precision highp float;\n\nattribute vec2 a_internal_position;\n#ifdef UV_ATTRIBUTE\nattribute vec2 a_internal_uv;\n#endif\n#ifdef NORMAL_ATTRIBUTE\nattribute vec2 a_internal_normal;\n#endif\n\nuniform vec2 u_internal_scale;\nuniform vec2 u_internal_translation;\n\nvarying vec2 v_UV;\n#ifdef UV_ATTRIBUTE\nvarying vec2 v_UV_local;\n#endif\n#ifdef NORMAL_ATTRIBUTE\nvarying vec2 v_normal;\n#endif\n\nvoid main() {\n\t// Optional varyings.\n\t#ifdef UV_ATTRIBUTE\n\tv_UV_local = a_internal_uv;\n\t#endif\n\t#ifdef NORMAL_ATTRIBUTE\n\tv_normal = a_internal_normal;\n\t#endif\n\n\t// Apply transformations.\n\tvec2 position = u_internal_scale * a_internal_position + u_internal_translation;\n\n\t// Calculate a global uv for the viewport.\n\tv_UV = 0.5 * (position + 1.0);\n\n\t// Calculate vertex position.\n\tgl_Position = vec4(position, 0, 1);\n}"

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

/***/ "./src/glsl_1/VectorMagnitudeFragShader.glsl":
/*!***************************************************!*\
  !*** ./src/glsl_1/VectorMagnitudeFragShader.glsl ***!
  \***************************************************/
/***/ ((module) => {

module.exports = "// Fragment shader that draws the magnitude of a DataLayer.\nprecision highp float;\n\nvarying vec2 v_UV;\n\nuniform vec3 u_color;\nuniform float u_scale;\nuniform int u_internal_numDimensions;\nuniform sampler2D u_internal_data;\n\nvoid main() {\n\tvec4 value = texture2D(u_internal_data, v_UV);\n\tif (u_internal_numDimensions < 4) value.a = 0.0;\n\tif (u_internal_numDimensions < 3) value.b = 0.0;\n\tif (u_internal_numDimensions < 2) value.g = 0.0;\n\tfloat mag = length(value);\n\tgl_FragColor = vec4(mag * u_scale * u_color, 1);\n}"

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

/***/ "./src/glsl_3/VectorMagnitudeFragShader.glsl":
/*!***************************************************!*\
  !*** ./src/glsl_3/VectorMagnitudeFragShader.glsl ***!
  \***************************************************/
/***/ ((module) => {

module.exports = "// Fragment shader that draws the magnitude of a DataLayer.\nprecision highp float;\n\nvarying vec2 v_UV;\n\nuniform vec3 u_color;\nuniform float u_scale;\nuniform sampler2D u_internal_data;\n\nvoid main() {\n\tvec4 value = texture2D(u_internal_data, v_UV);\n\tfloat mag = length(value);\n\tgl_FragColor = vec4(mag * u_scale * u_color, 1);\n}"

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9AcGV0YW1vcmlrZW4vZmxvYXQxNi9zcmMvRmxvYXQxNkFycmF5LmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9AcGV0YW1vcmlrZW4vZmxvYXQxNi9zcmMvYnVnLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9AcGV0YW1vcmlrZW4vZmxvYXQxNi9zcmMvZGF0YVZpZXcuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL0BwZXRhbW9yaWtlbi9mbG9hdDE2L3NyYy9oZnJvdW5kLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9AcGV0YW1vcmlrZW4vZmxvYXQxNi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL0BwZXRhbW9yaWtlbi9mbG9hdDE2L3NyYy9pcy5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvQHBldGFtb3Jpa2VuL2Zsb2F0MTYvc3JjL2xpYi5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvQHBldGFtb3Jpa2VuL2Zsb2F0MTYvc3JjL3ByaXZhdGUuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL0BwZXRhbW9yaWtlbi9mbG9hdDE2L3NyYy9zcGVjLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9jaGFuZ2VkcGkvZGlzdC9pbmRleC5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvZmlsZS1zYXZlci9kaXN0L0ZpbGVTYXZlci5taW4uanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fSGFzaC5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19MaXN0Q2FjaGUuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fTWFwLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX01hcENhY2hlLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX1N5bWJvbC5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19hc3NvY0luZGV4T2YuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fYmFzZUdldFRhZy5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19iYXNlSXNBcnJheUJ1ZmZlci5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19iYXNlSXNOYXRpdmUuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fYmFzZVVuYXJ5LmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2NvcmVKc0RhdGEuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fZnJlZUdsb2JhbC5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19nZXRNYXBEYXRhLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2dldE5hdGl2ZS5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19nZXRSYXdUYWcuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fZ2V0VmFsdWUuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9faGFzaENsZWFyLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2hhc2hEZWxldGUuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9faGFzaEdldC5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19oYXNoSGFzLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2hhc2hTZXQuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9faXNLZXlhYmxlLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2lzTWFza2VkLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2xpc3RDYWNoZUNsZWFyLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2xpc3RDYWNoZURlbGV0ZS5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19saXN0Q2FjaGVHZXQuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fbGlzdENhY2hlSGFzLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2xpc3RDYWNoZVNldC5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19tYXBDYWNoZUNsZWFyLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX21hcENhY2hlRGVsZXRlLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX21hcENhY2hlR2V0LmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX21hcENhY2hlSGFzLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX21hcENhY2hlU2V0LmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX25hdGl2ZUNyZWF0ZS5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19ub2RlVXRpbC5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19vYmplY3RUb1N0cmluZy5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19yb290LmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX3RvU291cmNlLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvZXEuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9pc0FycmF5QnVmZmVyLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvaXNGdW5jdGlvbi5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL2lzT2JqZWN0LmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvaXNPYmplY3RMaWtlLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvbWVtb2l6ZS5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9zcmMvQ2hlY2tzLnRzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL3NyYy9Db25zdGFudHMudHMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vc3JjL0RhdGFMYXllci50cyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9zcmMvR1BVUHJvZ3JhbS50cyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9zcmMvV2ViR0xDb21wdXRlLnRzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL3NyYy9leHRlbnNpb25zLnRzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9zcmMvdXRpbHMudHMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vc3JjL3V0aWxzL1ZlY3RvcjQudHMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vc3JjL2dsc2xfMS9Db3B5RnJhZ1NoYWRlci5nbHNsIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL3NyYy9nbHNsXzEvRGF0YUxheWVyTGluZXNWZXJ0ZXhTaGFkZXIuZ2xzbCIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9zcmMvZ2xzbF8xL0RhdGFMYXllclBvaW50c1ZlcnRleFNoYWRlci5nbHNsIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL3NyYy9nbHNsXzEvRGF0YUxheWVyVmVjdG9yRmllbGRWZXJ0ZXhTaGFkZXIuZ2xzbCIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9zcmMvZ2xzbF8xL0RlZmF1bHRWZXJ0ZXhTaGFkZXIuZ2xzbCIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9zcmMvZ2xzbF8xL1NlZ21lbnRWZXJ0ZXhTaGFkZXIuZ2xzbCIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9zcmMvZ2xzbF8xL1NpbmdsZUNvbG9yRnJhZ1NoYWRlci5nbHNsIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL3NyYy9nbHNsXzEvU2luZ2xlQ29sb3JXaXRoV3JhcENoZWNrRnJhZ1NoYWRlci5nbHNsIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL3NyYy9nbHNsXzEvVmVjdG9yTWFnbml0dWRlRnJhZ1NoYWRlci5nbHNsIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL3NyYy9nbHNsXzMvQ29weUZsb2F0RnJhZ1NoYWRlci5nbHNsIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL3NyYy9nbHNsXzMvQ29weUludEZyYWdTaGFkZXIuZ2xzbCIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9zcmMvZ2xzbF8zL0NvcHlVaW50RnJhZ1NoYWRlci5nbHNsIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL3NyYy9nbHNsXzMvU2luZ2xlQ29sb3JGcmFnU2hhZGVyLmdsc2wiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vc3JjL2dsc2xfMy9TaW5nbGVDb2xvcldpdGhXcmFwQ2hlY2tGcmFnU2hhZGVyLmdsc2wiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vc3JjL2dsc2xfMy9WZWN0b3JNYWduaXR1ZGVGcmFnU2hhZGVyLmdsc2wiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlL3dlYnBhY2svcnVudGltZS9nbG9iYWwiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlL3dlYnBhY2svcnVudGltZS9oYXJtb255IG1vZHVsZSBkZWNvcmF0b3IiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlL3dlYnBhY2svc3RhcnR1cCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDVndDO0FBQ29CO0FBQ0o7QUFDSTtBQUNYO0FBQ1U7O0FBRTNELFVBQVUsOERBQW9COztBQUU5QjtBQUNBLFdBQVcsUUFBUTtBQUNuQixhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxXQUFXLFFBQVE7QUFDbkIsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxXQUFXLGFBQWE7QUFDeEIsWUFBWTtBQUNaO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGtCQUFrQixZQUFZO0FBQzlCLG1CQUFtQixxREFBZTtBQUNsQzs7QUFFQTtBQUNBOztBQUVBLFdBQVcsdUJBQXVCO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7QUFDTDs7QUFFQSxXQUFXLDJCQUEyQjtBQUN0QztBQUNBO0FBQ0E7QUFDQSxhQUFhLHFFQUFtQztBQUNoRDtBQUNBO0FBQ0E7O0FBRUEsWUFBWSxzREFBaUI7QUFDN0IsOENBQThDLHFEQUFlO0FBQzdELFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBLGFBQWEscUVBQW1DO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQSxZQUFZLHNEQUFpQjtBQUM3Qiw0Q0FBNEMsd0RBQWtCO0FBQzlE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b0JBQ2xELFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUM7b0JBQzVFLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztpQkFDcEY7cUJBQU07b0JBQ04sU0FBUyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7b0JBQ2xELFNBQVMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO29CQUNsRCxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ3BGLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztpQkFDcEY7YUFDRDtTQUNEO1FBQ0QsSUFBSSxTQUFTLEVBQUU7WUFDZCx1REFBdUQ7WUFDdkQsU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlDLFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEQsU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsRCxTQUFTLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xELElBQUksR0FBRyxFQUFFO2dCQUNSLEdBQUcsQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdEMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdEMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUN0QztZQUNELElBQUksT0FBTyxFQUFFO2dCQUNaLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDMUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxD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QUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N6QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsRUFBRTtXQUNGO1dBQ0E7V0FDQSxDQUFDLEk7Ozs7O1dDUEQ7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEVBQUU7V0FDRjtXQUNBLEU7Ozs7O1dDVkEsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7O1VDTkE7VUFDQTtVQUNBO1VBQ0EiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJXZWJHTENvbXB1dGVcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiV2ViR0xDb21wdXRlXCJdID0gZmFjdG9yeSgpO1xufSkoc2VsZiwgZnVuY3Rpb24oKSB7XG5yZXR1cm4gIiwiaW1wb3J0IG1lbW9pemUgZnJvbSBcImxvZGFzaC1lcy9tZW1vaXplXCI7XG5pbXBvcnQgeyBpc1R5cGVkQXJyYXlJbmRleGVkUHJvcGVydHlXcml0YWJsZSB9IGZyb20gXCIuL2J1Z1wiO1xuaW1wb3J0IHsgaXNBcnJheUJ1ZmZlciwgaXNTdHJpbmdOdW1iZXJLZXkgfSBmcm9tIFwiLi9pc1wiO1xuaW1wb3J0IHsgY29udmVydFRvTnVtYmVyLCByb3VuZFRvRmxvYXQxNkJpdHMgfSBmcm9tIFwiLi9saWJcIjtcbmltcG9ydCB7IGNyZWF0ZVByaXZhdGVTdG9yYWdlIH0gZnJvbSBcIi4vcHJpdmF0ZVwiO1xuaW1wb3J0IHsgVG9JbnRlZ2VyLCBkZWZhdWx0Q29tcGFyZUZ1bmN0aW9uIH0gZnJvbSBcIi4vc3BlY1wiO1xuXG5jb25zdCBfID0gY3JlYXRlUHJpdmF0ZVN0b3JhZ2UoKTtcblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHRhcmdldFxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzRmxvYXQxNkFycmF5KHRhcmdldCkge1xuICAgIHJldHVybiB0YXJnZXQgaW5zdGFuY2VvZiBGbG9hdDE2QXJyYXk7XG59XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB0YXJnZXRcbiAqIEB0aHJvd3Mge1R5cGVFcnJvcn1cbiAqL1xuZnVuY3Rpb24gYXNzZXJ0RmxvYXQxNkFycmF5KHRhcmdldCkge1xuICAgIGlmICghaXNGbG9hdDE2QXJyYXkodGFyZ2V0KSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiVGhpcyBpcyBub3QgYSBGbG9hdDE2QXJyYXlcIik7XG4gICAgfVxufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdGFyZ2V0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaXNEZWZhdWx0RmxvYXQxNkFycmF5TWV0aG9kcyh0YXJnZXQpIHtcbiAgICByZXR1cm4gdHlwZW9mIHRhcmdldCA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmF1bHRGbG9hdDE2QXJyYXlNZXRob2RzLmhhcyh0YXJnZXQpO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7RmxvYXQxNkFycmF5fSBmbG9hdDE2Yml0c1xuICogQHJldHVybiB7bnVtYmVyW119XG4gKi9cbmZ1bmN0aW9uIGNvcHlUb0FycmF5KGZsb2F0MTZiaXRzKSB7XG4gICAgY29uc3QgbGVuZ3RoID0gZmxvYXQxNmJpdHMubGVuZ3RoO1xuXG4gICAgY29uc3QgYXJyYXkgPSBuZXcgQXJyYXkobGVuZ3RoKTtcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgICAgYXJyYXlbaV0gPSBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNbaV0pO1xuICAgIH1cblxuICAgIHJldHVybiBhcnJheTtcbn1cblxuLyoqIEB0eXBlIHtQcm94eUhhbmRsZXI8RnVuY3Rpb24+fSAqL1xuY29uc3QgYXBwbHlIYW5kbGVyID0ge1xuICAgIGFwcGx5KGZ1bmMsIHRoaXNBcmcsIGFyZ3MpIHtcbiAgICAgICAgLy8gcGVlbCBvZmYgcHJveHlcbiAgICAgICAgaWYgKGlzRmxvYXQxNkFycmF5KHRoaXNBcmcpICYmIGlzRGVmYXVsdEZsb2F0MTZBcnJheU1ldGhvZHMoZnVuYykpIHtcbiAgICAgICAgICAgIHJldHVybiBSZWZsZWN0LmFwcGx5KGZ1bmMsIF8odGhpc0FyZykudGFyZ2V0ICxhcmdzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBSZWZsZWN0LmFwcGx5KGZ1bmMsIHRoaXNBcmcsIGFyZ3MpO1xuICAgIH0sXG59O1xuXG4vKiogQHR5cGUge1Byb3h5SGFuZGxlcjxGbG9hdDE2QXJyYXk+fSAqL1xuY29uc3QgaGFuZGxlciA9IHtcbiAgICBnZXQodGFyZ2V0LCBrZXkpIHtcbiAgICAgICAgbGV0IHdyYXBwZXIgPSBudWxsO1xuICAgICAgICBpZiAoIWlzVHlwZWRBcnJheUluZGV4ZWRQcm9wZXJ0eVdyaXRhYmxlKSB7XG4gICAgICAgICAgICB3cmFwcGVyID0gdGFyZ2V0O1xuICAgICAgICAgICAgdGFyZ2V0ID0gXyh3cmFwcGVyKS50YXJnZXQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNTdHJpbmdOdW1iZXJLZXkoa2V5KSkge1xuICAgICAgICAgICAgcmV0dXJuIFJlZmxlY3QuaGFzKHRhcmdldCwga2V5KSA/IGNvbnZlcnRUb051bWJlcihSZWZsZWN0LmdldCh0YXJnZXQsIGtleSkpIDogdW5kZWZpbmVkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gd3JhcHBlciAhPT0gbnVsbCAmJiBSZWZsZWN0Lmhhcyh3cmFwcGVyLCBrZXkpID8gUmVmbGVjdC5nZXQod3JhcHBlciwga2V5KSA6IFJlZmxlY3QuZ2V0KHRhcmdldCwga2V5KTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiByZXQgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFR5cGVkQXJyYXkgbWV0aG9kcyBjYW4ndCBiZSBjYWxsZWQgYnkgUHJveHkgT2JqZWN0XG4gICAgICAgICAgICBsZXQgcHJveHkgPSBfKHJldCkucHJveHk7XG5cbiAgICAgICAgICAgIGlmIChwcm94eSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcHJveHkgPSBfKHJldCkucHJveHkgPSBuZXcgUHJveHkocmV0LCBhcHBseUhhbmRsZXIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcHJveHk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc2V0KHRhcmdldCwga2V5LCB2YWx1ZSkge1xuICAgICAgICBsZXQgd3JhcHBlciA9IG51bGw7XG4gICAgICAgIGlmICghaXNUeXBlZEFycmF5SW5kZXhlZFByb3BlcnR5V3JpdGFibGUpIHtcbiAgICAgICAgICAgIHdyYXBwZXIgPSB0YXJnZXQ7XG4gICAgICAgICAgICB0YXJnZXQgPSBfKHdyYXBwZXIpLnRhcmdldDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc1N0cmluZ051bWJlcktleShrZXkpKSB7XG4gICAgICAgICAgICByZXR1cm4gUmVmbGVjdC5zZXQodGFyZ2V0LCBrZXksIHJvdW5kVG9GbG9hdDE2Qml0cyh2YWx1ZSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gZnJvemVuIG9iamVjdCBjYW4ndCBjaGFuZ2UgcHJvdG90eXBlIHByb3BlcnR5XG4gICAgICAgICAgICBpZiAod3JhcHBlciAhPT0gbnVsbCAmJiAoIVJlZmxlY3QuaGFzKHRhcmdldCwga2V5KSB8fCBPYmplY3QuaXNGcm96ZW4od3JhcHBlcikpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFJlZmxlY3Quc2V0KHdyYXBwZXIsIGtleSwgdmFsdWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUmVmbGVjdC5zZXQodGFyZ2V0LCBrZXksIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG59O1xuXG5pZiAoIWlzVHlwZWRBcnJheUluZGV4ZWRQcm9wZXJ0eVdyaXRhYmxlKSB7XG4gICAgaGFuZGxlci5nZXRQcm90b3R5cGVPZiA9ICh3cmFwcGVyKSA9PiB7IHJldHVybiBSZWZsZWN0LmdldFByb3RvdHlwZU9mKF8od3JhcHBlcikudGFyZ2V0KTsgfTtcbiAgICBoYW5kbGVyLnNldFByb3RvdHlwZU9mID0gKHdyYXBwZXIsIHByb3RvdHlwZSkgPT4geyByZXR1cm4gUmVmbGVjdC5zZXRQcm90b3R5cGVPZihfKHdyYXBwZXIpLnRhcmdldCwgcHJvdG90eXBlKTsgfTtcblxuICAgIGhhbmRsZXIuZGVmaW5lUHJvcGVydHkgPSAod3JhcHBlciwga2V5LCBkZXNjcmlwdG9yKSA9PiB7XG4gICAgICAgIGNvbnN0IHRhcmdldCA9IF8od3JhcHBlcikudGFyZ2V0O1xuICAgICAgICByZXR1cm4gIVJlZmxlY3QuaGFzKHRhcmdldCwga2V5KSB8fCBPYmplY3QuaXNGcm96ZW4od3JhcHBlcikgPyBSZWZsZWN0LmRlZmluZVByb3BlcnR5KHdyYXBwZXIsIGtleSwgZGVzY3JpcHRvcikgOiBSZWZsZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBkZXNjcmlwdG9yKTtcbiAgICB9O1xuICAgIGhhbmRsZXIuZGVsZXRlUHJvcGVydHkgPSAod3JhcHBlciwga2V5KSA9PiB7XG4gICAgICAgIGNvbnN0IHRhcmdldCA9IF8od3JhcHBlcikudGFyZ2V0O1xuICAgICAgICByZXR1cm4gUmVmbGVjdC5oYXMod3JhcHBlciwga2V5KSA/IFJlZmxlY3QuZGVsZXRlUHJvcGVydHkod3JhcHBlciwga2V5KSA6IFJlZmxlY3QuZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBrZXkpO1xuICAgIH07XG5cbiAgICBoYW5kbGVyLmhhcyA9ICh3cmFwcGVyLCBrZXkpID0+IHsgcmV0dXJuIFJlZmxlY3QuaGFzKHdyYXBwZXIsIGtleSkgfHwgUmVmbGVjdC5oYXMoXyh3cmFwcGVyKS50YXJnZXQsIGtleSk7IH07XG5cbiAgICBoYW5kbGVyLmlzRXh0ZW5zaWJsZSA9ICh3cmFwcGVyKSA9PiB7IHJldHVybiBSZWZsZWN0LmlzRXh0ZW5zaWJsZSh3cmFwcGVyKTsgfTtcbiAgICBoYW5kbGVyLnByZXZlbnRFeHRlbnNpb25zID0gKHdyYXBwZXIpID0+IHsgcmV0dXJuIFJlZmxlY3QucHJldmVudEV4dGVuc2lvbnMod3JhcHBlcik7IH07XG5cbiAgICBoYW5kbGVyLmdldE93blByb3BlcnR5RGVzY3JpcHRvciA9ICh3cmFwcGVyLCBrZXkpID0+IHsgcmV0dXJuIFJlZmxlY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHdyYXBwZXIsIGtleSk7IH07XG4gICAgaGFuZGxlci5vd25LZXlzID0gKHdyYXBwZXIpID0+IHsgcmV0dXJuIFJlZmxlY3Qub3duS2V5cyh3cmFwcGVyKTsgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmxvYXQxNkFycmF5IGV4dGVuZHMgVWludDE2QXJyYXkge1xuXG4gICAgY29uc3RydWN0b3IoaW5wdXQsIGJ5dGVPZmZzZXQsIGxlbmd0aCkge1xuICAgICAgICAvLyBpbnB1dCBGbG9hdDE2QXJyYXlcbiAgICAgICAgaWYgKGlzRmxvYXQxNkFycmF5KGlucHV0KSkge1xuICAgICAgICAgICAgc3VwZXIoXyhpbnB1dCkudGFyZ2V0KTtcblxuICAgICAgICAvLyAyMi4yLjEuMywgMjIuMi4xLjQgVHlwZWRBcnJheSwgQXJyYXksIEFycmF5TGlrZSwgSXRlcmFibGVcbiAgICAgICAgfSBlbHNlIGlmIChpbnB1dCAhPT0gbnVsbCAmJiB0eXBlb2YgaW5wdXQgPT09IFwib2JqZWN0XCIgJiYgIWlzQXJyYXlCdWZmZXIoaW5wdXQpKSB7XG4gICAgICAgICAgICAvLyBpZiBpbnB1dCBpcyBub3QgQXJyYXlMaWtlIGFuZCBJdGVyYWJsZSwgZ2V0IEFycmF5XG4gICAgICAgICAgICBjb25zdCBhcnJheUxpa2UgPSAhUmVmbGVjdC5oYXMoaW5wdXQsIFwibGVuZ3RoXCIpICYmIGlucHV0W1N5bWJvbC5pdGVyYXRvcl0gIT09IHVuZGVmaW5lZCA/IFsuLi5pbnB1dF0gOiBpbnB1dDtcblxuICAgICAgICAgICAgY29uc3QgbGVuZ3RoID0gYXJyYXlMaWtlLmxlbmd0aDtcbiAgICAgICAgICAgIHN1cGVyKGxlbmd0aCk7XG5cbiAgICAgICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIC8vIHN1cGVyIChVaW50MTZBcnJheSlcbiAgICAgICAgICAgICAgICB0aGlzW2ldID0gcm91bmRUb0Zsb2F0MTZCaXRzKGFycmF5TGlrZVtpXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgLy8gMjIuMi4xLjIsIDIyLjIuMS41IHByaW1pdGl2ZSwgQXJyYXlCdWZmZXJcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICBzdXBlcigpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgc3VwZXIoaW5wdXQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgc3VwZXIoaW5wdXQsIGJ5dGVPZmZzZXQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgc3VwZXIoaW5wdXQsIGJ5dGVPZmZzZXQsIGxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHByb3h5O1xuXG4gICAgICAgIGlmIChpc1R5cGVkQXJyYXlJbmRleGVkUHJvcGVydHlXcml0YWJsZSkge1xuICAgICAgICAgICAgcHJveHkgPSBuZXcgUHJveHkodGhpcywgaGFuZGxlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCB3cmFwcGVyID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgICAgIF8od3JhcHBlcikudGFyZ2V0ID0gdGhpcztcbiAgICAgICAgICAgIHByb3h5ID0gbmV3IFByb3h5KHdyYXBwZXIsIGhhbmRsZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcHJveHkgcHJpdmF0ZSBzdG9yYWdlXG4gICAgICAgIF8ocHJveHkpLnRhcmdldCA9IHRoaXM7XG5cbiAgICAgICAgLy8gdGhpcyBwcml2YXRlIHN0b3JhZ2VcbiAgICAgICAgXyh0aGlzKS5wcm94eSA9IHByb3h5O1xuXG4gICAgICAgIHJldHVybiBwcm94eTtcbiAgICB9XG5cbiAgICAvLyBzdGF0aWMgbWV0aG9kc1xuICAgIHN0YXRpYyBmcm9tKHNyYywgLi4ub3B0cykge1xuICAgICAgICBpZiAob3B0cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRmxvYXQxNkFycmF5KFVpbnQxNkFycmF5LmZyb20oc3JjLCByb3VuZFRvRmxvYXQxNkJpdHMpLmJ1ZmZlcik7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBtYXBGdW5jID0gb3B0c1swXTtcbiAgICAgICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMV07XG5cbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDE2QXJyYXkoVWludDE2QXJyYXkuZnJvbShzcmMsIGZ1bmN0aW9uICh2YWwsIC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIHJldHVybiByb3VuZFRvRmxvYXQxNkJpdHMobWFwRnVuYy5jYWxsKHRoaXMsIHZhbCwgLi4uYXJncykpO1xuICAgICAgICB9LCB0aGlzQXJnKS5idWZmZXIpO1xuICAgIH1cblxuICAgIHN0YXRpYyBvZiguLi5hcmdzKSB7XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQxNkFycmF5KGFyZ3MpO1xuICAgIH1cblxuICAgIC8vIGl0ZXJhdGUgbWV0aG9kc1xuICAgICogW1N5bWJvbC5pdGVyYXRvcl0oKSB7XG4gICAgICAgIGZvcihjb25zdCB2YWwgb2Ygc3VwZXJbU3ltYm9sLml0ZXJhdG9yXSgpKSB7XG4gICAgICAgICAgICB5aWVsZCBjb252ZXJ0VG9OdW1iZXIodmFsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGtleXMoKSB7XG4gICAgICAgIHJldHVybiBzdXBlci5rZXlzKCk7XG4gICAgfVxuXG4gICAgKiB2YWx1ZXMoKSB7XG4gICAgICAgIGZvcihjb25zdCB2YWwgb2Ygc3VwZXIudmFsdWVzKCkpIHtcbiAgICAgICAgICAgIHlpZWxkIGNvbnZlcnRUb051bWJlcih2YWwpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqIEB0eXBlIHsoKSA9PiBJdGVyYWJsZUl0ZXJhdG9yPFtudW1iZXIsIG51bWJlcl0+fSAqL1xuICAgICogZW50cmllcygpIHtcbiAgICAgICAgZm9yKGNvbnN0IFtpLCB2YWxdIG9mIHN1cGVyLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgeWllbGQgW2ksIGNvbnZlcnRUb051bWJlcih2YWwpXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGZ1bmN0aW9uYWwgbWV0aG9kc1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBtYXAoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICAgICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgICAgIGNvbnN0IGFycmF5ID0gW107XG4gICAgICAgIGZvcihsZXQgaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgICAgICAgICAgY29uc3QgdmFsID0gY29udmVydFRvTnVtYmVyKHRoaXNbaV0pO1xuICAgICAgICAgICAgYXJyYXkucHVzaChjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHZhbCwgaSwgXyh0aGlzKS5wcm94eSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDE2QXJyYXkoYXJyYXkpO1xuICAgIH1cblxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBmaWx0ZXIoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICAgICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgICAgIGNvbnN0IGFycmF5ID0gW107XG4gICAgICAgIGZvcihsZXQgaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgICAgICAgICAgY29uc3QgdmFsID0gY29udmVydFRvTnVtYmVyKHRoaXNbaV0pO1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrLmNhbGwodGhpc0FyZywgdmFsLCBpLCBfKHRoaXMpLnByb3h5KSkge1xuICAgICAgICAgICAgICAgIGFycmF5LnB1c2godmFsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQxNkFycmF5KGFycmF5KTtcbiAgICB9XG5cbiAgICByZWR1Y2UoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICAgICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgICAgIGxldCB2YWwsIHN0YXJ0O1xuXG4gICAgICAgIGlmIChvcHRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdmFsID0gY29udmVydFRvTnVtYmVyKHRoaXNbMF0pO1xuICAgICAgICAgICAgc3RhcnQgPSAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFsID0gb3B0c1swXTtcbiAgICAgICAgICAgIHN0YXJ0ID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvcihsZXQgaSA9IHN0YXJ0LCBsID0gdGhpcy5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICAgICAgICAgIHZhbCA9IGNhbGxiYWNrKHZhbCwgY29udmVydFRvTnVtYmVyKHRoaXNbaV0pLCBpLCBfKHRoaXMpLnByb3h5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2YWw7XG4gICAgfVxuXG4gICAgcmVkdWNlUmlnaHQoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICAgICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgICAgIGxldCB2YWwsIHN0YXJ0O1xuXG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMubGVuZ3RoO1xuICAgICAgICBpZiAob3B0cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHZhbCA9IGNvbnZlcnRUb051bWJlcih0aGlzW2xlbmd0aCAtIDFdKTtcbiAgICAgICAgICAgIHN0YXJ0ID0gbGVuZ3RoIC0gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhbCA9IG9wdHNbMF07XG4gICAgICAgICAgICBzdGFydCA9IGxlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvcihsZXQgaSA9IHN0YXJ0OyBpLS07KSB7XG4gICAgICAgICAgICB2YWwgPSBjYWxsYmFjayh2YWwsIGNvbnZlcnRUb051bWJlcih0aGlzW2ldKSwgaSwgXyh0aGlzKS5wcm94eSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdmFsO1xuICAgIH1cblxuICAgIGZvckVhY2goY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICAgICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgICAgIGZvcihsZXQgaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgICAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCBjb252ZXJ0VG9OdW1iZXIodGhpc1tpXSksIGksIF8odGhpcykucHJveHkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZmluZChjYWxsYmFjaywgLi4ub3B0cykge1xuICAgICAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG5cbiAgICAgICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMF07XG5cbiAgICAgICAgZm9yKGxldCBpID0gMCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGNvbnZlcnRUb051bWJlcih0aGlzW2ldKTtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHZhbHVlLCBpLCBfKHRoaXMpLnByb3h5KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbmRJbmRleChjYWxsYmFjaywgLi4ub3B0cykge1xuICAgICAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG5cbiAgICAgICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMF07XG5cbiAgICAgICAgZm9yKGxldCBpID0gMCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGNvbnZlcnRUb051bWJlcih0aGlzW2ldKTtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHZhbHVlLCBpLCBfKHRoaXMpLnByb3h5KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIGV2ZXJ5KGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcblxuICAgICAgICBjb25zdCB0aGlzQXJnID0gb3B0c1swXTtcblxuICAgICAgICBmb3IobGV0IGkgPSAwLCBsID0gdGhpcy5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICAgICAgICAgIGlmICghY2FsbGJhY2suY2FsbCh0aGlzQXJnLCBjb252ZXJ0VG9OdW1iZXIodGhpc1tpXSksIGksIF8odGhpcykucHJveHkpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgc29tZShjYWxsYmFjaywgLi4ub3B0cykge1xuICAgICAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG5cbiAgICAgICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMF07XG5cbiAgICAgICAgZm9yKGxldCBpID0gMCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2suY2FsbCh0aGlzQXJnLCBjb252ZXJ0VG9OdW1iZXIodGhpc1tpXSksIGksIF8odGhpcykucHJveHkpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gY2hhbmdlIGVsZW1lbnQgbWV0aG9kc1xuICAgIHNldChpbnB1dCwgLi4ub3B0cykge1xuICAgICAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG5cbiAgICAgICAgY29uc3Qgb2Zmc2V0ID0gb3B0c1swXTtcblxuICAgICAgICBsZXQgZmxvYXQxNmJpdHM7XG5cbiAgICAgICAgLy8gaW5wdXQgRmxvYXQxNkFycmF5XG4gICAgICAgIGlmIChpc0Zsb2F0MTZBcnJheShpbnB1dCkpIHtcbiAgICAgICAgICAgIGZsb2F0MTZiaXRzID0gXyhpbnB1dCkudGFyZ2V0O1xuXG4gICAgICAgIC8vIGlucHV0IG90aGVyc1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgYXJyYXlMaWtlID0gIVJlZmxlY3QuaGFzKGlucHV0LCBcImxlbmd0aFwiKSAmJiBpbnB1dFtTeW1ib2wuaXRlcmF0b3JdICE9PSB1bmRlZmluZWQgPyBbLi4uaW5wdXRdIDogaW5wdXQ7XG4gICAgICAgICAgICBjb25zdCBsZW5ndGggPSBhcnJheUxpa2UubGVuZ3RoO1xuXG4gICAgICAgICAgICBmbG9hdDE2Yml0cyA9IG5ldyBVaW50MTZBcnJheShsZW5ndGgpO1xuICAgICAgICAgICAgZm9yKGxldCBpID0gMCwgbCA9IGFycmF5TGlrZS5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICAgICAgICAgICAgICBmbG9hdDE2Yml0c1tpXSA9IHJvdW5kVG9GbG9hdDE2Qml0cyhhcnJheUxpa2VbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc3VwZXIuc2V0KGZsb2F0MTZiaXRzLCBvZmZzZXQpO1xuICAgIH1cblxuICAgIHJldmVyc2UoKSB7XG4gICAgICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcblxuICAgICAgICBzdXBlci5yZXZlcnNlKCk7XG5cbiAgICAgICAgcmV0dXJuIF8odGhpcykucHJveHk7XG4gICAgfVxuXG4gICAgZmlsbCh2YWx1ZSwgLi4ub3B0cykge1xuICAgICAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG5cbiAgICAgICAgc3VwZXIuZmlsbChyb3VuZFRvRmxvYXQxNkJpdHModmFsdWUpLCAuLi5vcHRzKTtcblxuICAgICAgICByZXR1cm4gXyh0aGlzKS5wcm94eTtcbiAgICB9XG5cbiAgICBjb3B5V2l0aGluKHRhcmdldCwgc3RhcnQsIC4uLm9wdHMpIHtcbiAgICAgICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgICAgIHN1cGVyLmNvcHlXaXRoaW4odGFyZ2V0LCBzdGFydCwgLi4ub3B0cyk7XG5cbiAgICAgICAgcmV0dXJuIF8odGhpcykucHJveHk7XG4gICAgfVxuXG4gICAgc29ydCguLi5vcHRzKSB7XG4gICAgICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcblxuICAgICAgICBsZXQgY29tcGFyZUZ1bmN0aW9uID0gb3B0c1swXTtcblxuICAgICAgICBpZiAoY29tcGFyZUZ1bmN0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbXBhcmVGdW5jdGlvbiA9IGRlZmF1bHRDb21wYXJlRnVuY3Rpb247XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBfY29udmVydFRvTnVtYmVyID0gbWVtb2l6ZShjb252ZXJ0VG9OdW1iZXIpO1xuXG4gICAgICAgIHN1cGVyLnNvcnQoKHgsIHkpID0+IHsgcmV0dXJuIGNvbXBhcmVGdW5jdGlvbihfY29udmVydFRvTnVtYmVyKHgpLCBfY29udmVydFRvTnVtYmVyKHkpKTsgfSk7XG5cbiAgICAgICAgcmV0dXJuIF8odGhpcykucHJveHk7XG4gICAgfVxuXG4gICAgLy8gY29weSBlbGVtZW50IG1ldGhvZHNcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgc2xpY2UoLi4ub3B0cykge1xuICAgICAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG5cbiAgICAgICAgbGV0IGZsb2F0MTZiaXRzO1xuXG4gICAgICAgIC8vIFY4LCBTcGlkZXJNb25rZXksIEphdmFTY3JpcHRDb3JlLCBDaGFrcmEgdGhyb3cgVHlwZUVycm9yXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmbG9hdDE2Yml0cyA9IHN1cGVyLnNsaWNlKC4uLm9wdHMpO1xuICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgIGlmIChlIGluc3RhbmNlb2YgVHlwZUVycm9yKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdWludDE2ID0gbmV3IFVpbnQxNkFycmF5KHRoaXMuYnVmZmVyLCB0aGlzLmJ5dGVPZmZzZXQsIHRoaXMubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICBmbG9hdDE2Yml0cyA9IHVpbnQxNi5zbGljZSguLi5vcHRzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQxNkFycmF5KGZsb2F0MTZiaXRzLmJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHN1YmFycmF5KC4uLm9wdHMpIHtcbiAgICAgICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgICAgIGxldCBmbG9hdDE2Yml0cztcblxuICAgICAgICAvLyBWOCwgU3BpZGVyTW9ua2V5LCBKYXZhU2NyaXB0Q29yZSwgQ2hha3JhIHRocm93IFR5cGVFcnJvclxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZmxvYXQxNmJpdHMgPSBzdXBlci5zdWJhcnJheSguLi5vcHRzKTtcbiAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICBpZiAoZSBpbnN0YW5jZW9mIFR5cGVFcnJvcikge1xuICAgICAgICAgICAgICAgIGNvbnN0IHVpbnQxNiA9IG5ldyBVaW50MTZBcnJheSh0aGlzLmJ1ZmZlciwgdGhpcy5ieXRlT2Zmc2V0LCB0aGlzLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgZmxvYXQxNmJpdHMgPSB1aW50MTYuc3ViYXJyYXkoLi4ub3B0cyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MTZBcnJheShmbG9hdDE2Yml0cy5idWZmZXIsIGZsb2F0MTZiaXRzLmJ5dGVPZmZzZXQsIGZsb2F0MTZiaXRzLmxlbmd0aCk7XG4gICAgfVxuXG4gICAgLy8gY29udGFpbnMgbWV0aG9kc1xuICAgIGluZGV4T2YoZWxlbWVudCwgLi4ub3B0cykge1xuICAgICAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG5cbiAgICAgICAgY29uc3QgbGVuZ3RoID0gdGhpcy5sZW5ndGg7XG5cbiAgICAgICAgbGV0IGZyb20gPSBUb0ludGVnZXIob3B0c1swXSk7XG5cbiAgICAgICAgaWYgKGZyb20gPCAwKSB7XG4gICAgICAgICAgICBmcm9tICs9IGxlbmd0aDtcbiAgICAgICAgICAgIGlmIChmcm9tIDwgMCkge1xuICAgICAgICAgICAgICAgIGZyb20gPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yKGxldCBpID0gZnJvbSwgbCA9IGxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgICAgICAgICAgaWYgKGNvbnZlcnRUb051bWJlcih0aGlzW2ldKSA9PT0gZWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIGxhc3RJbmRleE9mKGVsZW1lbnQsIC4uLm9wdHMpIHtcbiAgICAgICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMubGVuZ3RoO1xuXG4gICAgICAgIGxldCBmcm9tID0gVG9JbnRlZ2VyKG9wdHNbMF0pO1xuXG4gICAgICAgIGZyb20gPSBmcm9tID09PSAwID8gbGVuZ3RoIDogZnJvbSArIDE7XG5cbiAgICAgICAgaWYgKGZyb20gPj0gMCkge1xuICAgICAgICAgICAgZnJvbSA9IGZyb20gPCBsZW5ndGggPyBmcm9tIDogbGVuZ3RoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZnJvbSArPSBsZW5ndGg7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IobGV0IGkgPSBmcm9tOyBpLS07KSB7XG4gICAgICAgICAgICBpZiAoY29udmVydFRvTnVtYmVyKHRoaXNbaV0pID09PSBlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgaW5jbHVkZXMoZWxlbWVudCwgLi4ub3B0cykge1xuICAgICAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG5cbiAgICAgICAgY29uc3QgbGVuZ3RoID0gdGhpcy5sZW5ndGg7XG5cbiAgICAgICAgbGV0IGZyb20gPSBUb0ludGVnZXIob3B0c1swXSk7XG5cbiAgICAgICAgaWYgKGZyb20gPCAwKSB7XG4gICAgICAgICAgICBmcm9tICs9IGxlbmd0aDtcbiAgICAgICAgICAgIGlmIChmcm9tIDwgMCkge1xuICAgICAgICAgICAgICAgIGZyb20gPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaXNOYU4gPSBOdW1iZXIuaXNOYU4oZWxlbWVudCk7XG4gICAgICAgIGZvcihsZXQgaSA9IGZyb20sIGwgPSBsZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gY29udmVydFRvTnVtYmVyKHRoaXNbaV0pO1xuXG4gICAgICAgICAgICBpZiAoaXNOYU4gJiYgTnVtYmVyLmlzTmFOKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBzdHJpbmcgbWV0aG9kc1xuICAgIGpvaW4oLi4ub3B0cykge1xuICAgICAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG5cbiAgICAgICAgY29uc3QgYXJyYXkgPSBjb3B5VG9BcnJheSh0aGlzKTtcblxuICAgICAgICByZXR1cm4gYXJyYXkuam9pbiguLi5vcHRzKTtcbiAgICB9XG5cbiAgICB0b0xvY2FsZVN0cmluZyguLi5vcHRzKSB7XG4gICAgICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcblxuICAgICAgICBjb25zdCBhcnJheSA9IGNvcHlUb0FycmF5KHRoaXMpO1xuXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgcmV0dXJuIGFycmF5LnRvTG9jYWxlU3RyaW5nKC4uLm9wdHMpO1xuICAgIH1cblxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBnZXQgW1N5bWJvbC50b1N0cmluZ1RhZ10oKSB7XG4gICAgICAgIGlmIChpc0Zsb2F0MTZBcnJheSh0aGlzKSkge1xuICAgICAgICAgICAgcmV0dXJuIFwiRmxvYXQxNkFycmF5XCI7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmNvbnN0IEZsb2F0MTZBcnJheSRwcm90b3R5cGUgPSBGbG9hdDE2QXJyYXkucHJvdG90eXBlO1xuXG5jb25zdCBkZWZhdWx0RmxvYXQxNkFycmF5TWV0aG9kcyA9IG5ldyBXZWFrU2V0KCk7XG5mb3IoY29uc3Qga2V5IG9mIFJlZmxlY3Qub3duS2V5cyhGbG9hdDE2QXJyYXkkcHJvdG90eXBlKSkge1xuICAgIGNvbnN0IHZhbCA9IEZsb2F0MTZBcnJheSRwcm90b3R5cGVba2V5XTtcbiAgICBpZiAodHlwZW9mIHZhbCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGRlZmF1bHRGbG9hdDE2QXJyYXlNZXRob2RzLmFkZCh2YWwpO1xuICAgIH1cbn1cbiIsIi8qKlxuICogSmF2YVNjcmlwdENvcmUgPD0gMTIgYnVnXG4gKiBAc2VlIGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD0xNzE2MDZcbiAqL1xuZXhwb3J0IGNvbnN0IGlzVHlwZWRBcnJheUluZGV4ZWRQcm9wZXJ0eVdyaXRhYmxlID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihuZXcgVWludDhBcnJheSgxKSwgMCkud3JpdGFibGU7XG4iLCJpbXBvcnQgeyBpc0RhdGFWaWV3IH0gZnJvbSBcIi4vaXNcIjtcbmltcG9ydCB7IGNvbnZlcnRUb051bWJlciwgcm91bmRUb0Zsb2F0MTZCaXRzIH0gZnJvbSBcIi4vbGliXCI7XG5cbi8qKlxuICogcmV0dXJucyBhbiB1bnNpZ25lZCAxNi1iaXQgZmxvYXQgYXQgdGhlIHNwZWNpZmllZCBieXRlIG9mZnNldCBmcm9tIHRoZSBzdGFydCBvZiB0aGUgRGF0YVZpZXcuXG4gKiBAcGFyYW0ge0RhdGFWaWV3fSBkYXRhVmlld1xuICogQHBhcmFtIHtudW1iZXJ9IGJ5dGVPZmZzZXRcbiAqIEBwYXJhbSB7W2Jvb2xlYW5dfSBvcHRzXG4gKiBAcmV0dXJucyB7bnVtYmVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RmxvYXQxNihkYXRhVmlldywgYnl0ZU9mZnNldCwgLi4ub3B0cykge1xuICAgIGlmICghaXNEYXRhVmlldyhkYXRhVmlldykpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkZpcnN0IGFyZ3VtZW50IHRvIGdldEZsb2F0MTYgZnVuY3Rpb24gbXVzdCBiZSBhIERhdGFWaWV3XCIpO1xuICAgIH1cblxuICAgIHJldHVybiBjb252ZXJ0VG9OdW1iZXIoIGRhdGFWaWV3LmdldFVpbnQxNihieXRlT2Zmc2V0LCAuLi5vcHRzKSApO1xufVxuXG4vKipcbiAqIHN0b3JlcyBhbiB1bnNpZ25lZCAxNi1iaXQgZmxvYXQgdmFsdWUgYXQgdGhlIHNwZWNpZmllZCBieXRlIG9mZnNldCBmcm9tIHRoZSBzdGFydCBvZiB0aGUgRGF0YVZpZXcuXG4gKiBAcGFyYW0ge0RhdGFWaWV3fSBkYXRhVmlld1xuICogQHBhcmFtIHtudW1iZXJ9IGJ5dGVPZmZzZXRcbiAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZVxuICogQHBhcmFtIHtbYm9vbGVhbl19IG9wdHNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldEZsb2F0MTYoZGF0YVZpZXcsIGJ5dGVPZmZzZXQsIHZhbHVlLCAuLi5vcHRzKSB7XG4gICAgaWYgKCFpc0RhdGFWaWV3KGRhdGFWaWV3KSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiRmlyc3QgYXJndW1lbnQgdG8gc2V0RmxvYXQxNiBmdW5jdGlvbiBtdXN0IGJlIGEgRGF0YVZpZXdcIik7XG4gICAgfVxuXG4gICAgZGF0YVZpZXcuc2V0VWludDE2KGJ5dGVPZmZzZXQsIHJvdW5kVG9GbG9hdDE2Qml0cyh2YWx1ZSksIC4uLm9wdHMpO1xufVxuIiwiaW1wb3J0IHsgY29udmVydFRvTnVtYmVyLCByb3VuZFRvRmxvYXQxNkJpdHMgfSBmcm9tIFwiLi9saWJcIjtcblxuLyoqXG4gKiByZXR1cm5zIHRoZSBuZWFyZXN0IGhhbGYgcHJlY2lzaW9uIGZsb2F0IHJlcHJlc2VudGF0aW9uIG9mIGEgbnVtYmVyLlxuICogQHBhcmFtIHtudW1iZXJ9IG51bVxuICogQHJldHVybnMge251bWJlcn1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaGZyb3VuZChudW0pIHtcbiAgICBudW0gPSBOdW1iZXIobnVtKTtcblxuICAgIC8vIGZvciBvcHRpbWl6YXRpb25cbiAgICBpZiAoIU51bWJlci5pc0Zpbml0ZShudW0pIHx8IG51bSA9PT0gMCkge1xuICAgICAgICByZXR1cm4gbnVtO1xuICAgIH1cblxuICAgIGNvbnN0IHgxNiA9IHJvdW5kVG9GbG9hdDE2Qml0cyhudW0pO1xuICAgIHJldHVybiBjb252ZXJ0VG9OdW1iZXIoeDE2KTtcbn1cbiIsImV4cG9ydCB7IGRlZmF1bHQgYXMgaGZyb3VuZCB9IGZyb20gXCIuL2hmcm91bmRcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgRmxvYXQxNkFycmF5IH0gZnJvbSBcIi4vRmxvYXQxNkFycmF5XCI7XG5leHBvcnQgeyBnZXRGbG9hdDE2LCBzZXRGbG9hdDE2IH0gZnJvbSBcIi4vZGF0YVZpZXcuanNcIjtcbiIsImltcG9ydCB7IFRvSW50ZWdlciB9IGZyb20gXCIuL3NwZWNcIjtcblxuZXhwb3J0IHsgZGVmYXVsdCBhcyBpc0FycmF5QnVmZmVyIH0gZnJvbSBcImxvZGFzaC1lcy9pc0FycmF5QnVmZmVyXCI7XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB2aWV3XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzRGF0YVZpZXcodmlldykge1xuICAgIHJldHVybiB2aWV3IGluc3RhbmNlb2YgRGF0YVZpZXc7XG59XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSBrZXlcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNTdHJpbmdOdW1iZXJLZXkoa2V5KSB7XG4gICAgcmV0dXJuIHR5cGVvZiBrZXkgPT09IFwic3RyaW5nXCIgJiYga2V5ID09PSBUb0ludGVnZXIoa2V5KSArIFwiXCI7XG59XG4iLCIvLyBhbGdvcml0aG06IGZ0cDovL2Z0cC5mb3gtdG9vbGtpdC5vcmcvcHViL2Zhc3RoYWxmZmxvYXRjb252ZXJzaW9uLnBkZlxuXG5jb25zdCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG5jb25zdCBmbG9hdFZpZXcgPSBuZXcgRmxvYXQzMkFycmF5KGJ1ZmZlcik7XG5jb25zdCB1aW50MzJWaWV3ID0gbmV3IFVpbnQzMkFycmF5KGJ1ZmZlcik7XG5cblxuY29uc3QgYmFzZVRhYmxlID0gbmV3IFVpbnQzMkFycmF5KDUxMik7XG5jb25zdCBzaGlmdFRhYmxlID0gbmV3IFVpbnQzMkFycmF5KDUxMik7XG5cbmZvcihsZXQgaSA9IDA7IGkgPCAyNTY7ICsraSkge1xuICAgIGNvbnN0IGUgPSBpIC0gMTI3O1xuXG4gICAgLy8gdmVyeSBzbWFsbCBudW1iZXIgKDAsIC0wKVxuICAgIGlmIChlIDwgLTI3KSB7XG4gICAgICAgIGJhc2VUYWJsZVtpIHwgMHgwMDBdID0gMHgwMDAwO1xuICAgICAgICBiYXNlVGFibGVbaSB8IDB4MTAwXSA9IDB4ODAwMDtcbiAgICAgICAgc2hpZnRUYWJsZVtpIHwgMHgwMDBdID0gMjQ7XG4gICAgICAgIHNoaWZ0VGFibGVbaSB8IDB4MTAwXSA9IDI0O1xuXG4gICAgLy8gc21hbGwgbnVtYmVyIChkZW5vcm0pXG4gICAgfSBlbHNlIGlmIChlIDwgLTE0KSB7XG4gICAgICAgIGJhc2VUYWJsZVtpIHwgMHgwMDBdID0gIDB4MDQwMCA+PiAoLWUgLSAxNCk7XG4gICAgICAgIGJhc2VUYWJsZVtpIHwgMHgxMDBdID0gKDB4MDQwMCA+PiAoLWUgLSAxNCkpIHwgMHg4MDAwO1xuICAgICAgICBzaGlmdFRhYmxlW2kgfCAweDAwMF0gPSAtZSAtIDE7XG4gICAgICAgIHNoaWZ0VGFibGVbaSB8IDB4MTAwXSA9IC1lIC0gMTtcblxuICAgIC8vIG5vcm1hbCBudW1iZXJcbiAgICB9IGVsc2UgaWYgKGUgPD0gMTUpIHtcbiAgICAgICAgYmFzZVRhYmxlW2kgfCAweDAwMF0gPSAgKGUgKyAxNSkgPDwgMTA7XG4gICAgICAgIGJhc2VUYWJsZVtpIHwgMHgxMDBdID0gKChlICsgMTUpIDw8IDEwKSB8IDB4ODAwMDtcbiAgICAgICAgc2hpZnRUYWJsZVtpIHwgMHgwMDBdID0gMTM7XG4gICAgICAgIHNoaWZ0VGFibGVbaSB8IDB4MTAwXSA9IDEzO1xuXG4gICAgLy8gbGFyZ2UgbnVtYmVyIChJbmZpbml0eSwgLUluZmluaXR5KVxuICAgIH0gZWxzZSBpZiAoZSA8IDEyOCkge1xuICAgICAgICBiYXNlVGFibGVbaSB8IDB4MDAwXSA9IDB4N2MwMDtcbiAgICAgICAgYmFzZVRhYmxlW2kgfCAweDEwMF0gPSAweGZjMDA7XG4gICAgICAgIHNoaWZ0VGFibGVbaSB8IDB4MDAwXSA9IDI0O1xuICAgICAgICBzaGlmdFRhYmxlW2kgfCAweDEwMF0gPSAyNDtcblxuICAgIC8vIHN0YXkgKE5hTiwgSW5maW5pdHksIC1JbmZpbml0eSlcbiAgICB9IGVsc2Uge1xuICAgICAgICBiYXNlVGFibGVbaSB8IDB4MDAwXSA9IDB4N2MwMDtcbiAgICAgICAgYmFzZVRhYmxlW2kgfCAweDEwMF0gPSAweGZjMDA7XG4gICAgICAgIHNoaWZ0VGFibGVbaSB8IDB4MDAwXSA9IDEzO1xuICAgICAgICBzaGlmdFRhYmxlW2kgfCAweDEwMF0gPSAxMztcbiAgICB9XG59XG5cbi8qKlxuICogcm91bmQgYSBudW1iZXIgdG8gYSBoYWxmIGZsb2F0IG51bWJlciBiaXRzLlxuICogQHBhcmFtIHtudW1iZXJ9IG51bSAtIGRvdWJsZSBmbG9hdFxuICogQHJldHVybnMge251bWJlcn0gaGFsZiBmbG9hdCBudW1iZXIgYml0c1xuICovXG5leHBvcnQgZnVuY3Rpb24gcm91bmRUb0Zsb2F0MTZCaXRzKG51bSkge1xuICAgIGZsb2F0Vmlld1swXSA9IG51bTtcblxuICAgIGNvbnN0IGYgPSB1aW50MzJWaWV3WzBdO1xuICAgIGNvbnN0IGUgPSAoZiA+PiAyMykgJiAweDFmZjtcbiAgICByZXR1cm4gYmFzZVRhYmxlW2VdICsgKChmICYgMHgwMDdmZmZmZikgPj4gc2hpZnRUYWJsZVtlXSk7XG59XG5cblxuY29uc3QgbWFudGlzc2FUYWJsZSA9IG5ldyBVaW50MzJBcnJheSgyMDQ4KTtcbmNvbnN0IGV4cG9uZW50VGFibGUgPSBuZXcgVWludDMyQXJyYXkoNjQpO1xuY29uc3Qgb2Zmc2V0VGFibGUgPSBuZXcgVWludDMyQXJyYXkoNjQpO1xuXG5tYW50aXNzYVRhYmxlWzBdID0gMDtcbmZvcihsZXQgaSA9IDE7IGkgPCAxMDI0OyArK2kpIHtcbiAgICBsZXQgbSA9IGkgPDwgMTM7ICAgIC8vIHplcm8gcGFkIG1hbnRpc3NhIGJpdHNcbiAgICBsZXQgZSA9IDA7ICAgICAgICAgIC8vIHplcm8gZXhwb25lbnRcblxuICAgIC8vIG5vcm1hbGl6ZWRcbiAgICB3aGlsZSgobSAmIDB4MDA4MDAwMDApID09PSAwKSB7XG4gICAgICAgIGUgLT0gMHgwMDgwMDAwMDsgICAgLy8gZGVjcmVtZW50IGV4cG9uZW50XG4gICAgICAgIG0gPDw9IDE7XG4gICAgfVxuXG4gICAgbSAmPSB+MHgwMDgwMDAwMDsgICAvLyBjbGVhciBsZWFkaW5nIDEgYml0XG4gICAgZSArPSAweDM4ODAwMDAwOyAgICAvLyBhZGp1c3QgYmlhc1xuXG4gICAgbWFudGlzc2FUYWJsZVtpXSA9IG0gfCBlO1xufVxuZm9yKGxldCBpID0gMTAyNDsgaSA8IDIwNDg7ICsraSkge1xuICAgIG1hbnRpc3NhVGFibGVbaV0gPSAweDM4MDAwMDAwICsgKChpIC0gMTAyNCkgPDwgMTMpO1xufVxuXG5leHBvbmVudFRhYmxlWzBdID0gMDtcbmZvcihsZXQgaSA9IDE7IGkgPCAzMTsgKytpKSB7XG4gICAgZXhwb25lbnRUYWJsZVtpXSA9IGkgPDwgMjM7XG59XG5leHBvbmVudFRhYmxlWzMxXSA9IDB4NDc4MDAwMDA7XG5leHBvbmVudFRhYmxlWzMyXSA9IDB4ODAwMDAwMDA7XG5mb3IobGV0IGkgPSAzMzsgaSA8IDYzOyArK2kpIHtcbiAgICBleHBvbmVudFRhYmxlW2ldID0gMHg4MDAwMDAwMCArICgoaSAtIDMyKSA8PCAyMyk7XG59XG5leHBvbmVudFRhYmxlWzYzXSA9IDB4Yzc4MDAwMDA7XG5cbm9mZnNldFRhYmxlWzBdID0gMDtcbmZvcihsZXQgaSA9IDE7IGkgPCA2NDsgKytpKSB7XG4gICAgaWYgKGkgPT09IDMyKSB7XG4gICAgICAgIG9mZnNldFRhYmxlW2ldID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgICBvZmZzZXRUYWJsZVtpXSA9IDEwMjQ7XG4gICAgfVxufVxuXG4vKipcbiAqIGNvbnZlcnQgYSBoYWxmIGZsb2F0IG51bWJlciBiaXRzIHRvIGEgbnVtYmVyLlxuICogQHBhcmFtIHtudW1iZXJ9IGZsb2F0MTZiaXRzIC0gaGFsZiBmbG9hdCBudW1iZXIgYml0c1xuICogQHJldHVybnMge251bWJlcn0gZG91YmxlIGZsb2F0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHMpIHtcbiAgICBjb25zdCBtID0gZmxvYXQxNmJpdHMgPj4gMTA7XG4gICAgdWludDMyVmlld1swXSA9IG1hbnRpc3NhVGFibGVbb2Zmc2V0VGFibGVbbV0gKyAoZmxvYXQxNmJpdHMgJiAweDNmZildICsgZXhwb25lbnRUYWJsZVttXTtcbiAgICByZXR1cm4gZmxvYXRWaWV3WzBdO1xufVxuIiwiLyoqXG4gKiBAcmV0dXJucyB7KHNlbGY6b2JqZWN0KSA9PiBvYmplY3R9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVQcml2YXRlU3RvcmFnZSgpIHtcblx0Y29uc3Qgd20gPSBuZXcgV2Vha01hcCgpO1xuXHRyZXR1cm4gKHNlbGYpID0+IHtcblx0XHRsZXQgb2JqID0gd20uZ2V0KHNlbGYpO1xuXHRcdGlmIChvYmopIHtcblx0XHRcdHJldHVybiBvYmo7XG5cdFx0fSBlbHNlIHtcblx0XHRcdG9iaiA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cdFx0XHR3bS5zZXQoc2VsZiwgb2JqKTtcblx0XHRcdHJldHVybiBvYmo7XG5cdFx0fVxuXHR9O1xufVxuIiwiLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHRhcmdldFxuICogQHJldHVybnMge251bWJlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIFRvSW50ZWdlcih0YXJnZXQpIHtcbiAgICBsZXQgbnVtYmVyID0gdHlwZW9mIHRhcmdldCAhPT0gXCJudW1iZXJcIiA/IE51bWJlcih0YXJnZXQpIDogdGFyZ2V0O1xuICAgIGlmIChOdW1iZXIuaXNOYU4obnVtYmVyKSkge1xuICAgICAgICBudW1iZXIgPSAwO1xuICAgIH1cbiAgICByZXR1cm4gTWF0aC50cnVuYyhudW1iZXIpO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7bnVtYmVyfSB4XG4gKiBAcGFyYW0ge251bWJlcn0geVxuICogQHJldHVybnMgey0xIHwgMCB8IDF9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWZhdWx0Q29tcGFyZUZ1bmN0aW9uKHgsIHkpIHtcbiAgICBjb25zdCBbaXNOYU5feCwgaXNOYU5feV0gPSBbTnVtYmVyLmlzTmFOKHgpLCBOdW1iZXIuaXNOYU4oeSldO1xuXG4gICAgaWYgKGlzTmFOX3ggJiYgaXNOYU5feSkge1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBpZiAoaXNOYU5feCkge1xuICAgICAgICByZXR1cm4gMTtcbiAgICB9XG5cbiAgICBpZiAoaXNOYU5feSkge1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgaWYgKHggPCB5KSB7XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICBpZiAoeCA+IHkpIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgfVxuXG4gICAgaWYgKHggPT09IDAgJiYgeSA9PT0gMCkge1xuICAgICAgICBjb25zdCBbaXNQbHVzWmVyb194LCBpc1BsdXNaZXJvX3ldID0gW09iamVjdC5pcyh4LCAwKSwgT2JqZWN0LmlzKHksIDApXTtcblxuICAgICAgICBpZiAoIWlzUGx1c1plcm9feCAmJiBpc1BsdXNaZXJvX3kpIHtcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc1BsdXNaZXJvX3ggJiYgIWlzUGx1c1plcm9feSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gMDtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuY2hhbmdlRHBpQmxvYiA9IGNoYW5nZURwaUJsb2I7XG5leHBvcnRzLmNoYW5nZURwaURhdGFVcmwgPSBjaGFuZ2VEcGlEYXRhVXJsO1xuXG5mdW5jdGlvbiBfdG9Db25zdW1hYmxlQXJyYXkoYXJyKSB7IGlmIChBcnJheS5pc0FycmF5KGFycikpIHsgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBBcnJheShhcnIubGVuZ3RoKTsgaSA8IGFyci5sZW5ndGg7IGkrKykgeyBhcnIyW2ldID0gYXJyW2ldOyB9IHJldHVybiBhcnIyOyB9IGVsc2UgeyByZXR1cm4gQXJyYXkuZnJvbShhcnIpOyB9IH1cblxuZnVuY3Rpb24gY3JlYXRlUG5nRGF0YVRhYmxlKCkge1xuICAvKiBUYWJsZSBvZiBDUkNzIG9mIGFsbCA4LWJpdCBtZXNzYWdlcy4gKi9cbiAgdmFyIGNyY1RhYmxlID0gbmV3IEludDMyQXJyYXkoMjU2KTtcbiAgZm9yICh2YXIgbiA9IDA7IG4gPCAyNTY7IG4rKykge1xuICAgIHZhciBjID0gbjtcbiAgICBmb3IgKHZhciBrID0gMDsgayA8IDg7IGsrKykge1xuICAgICAgYyA9IGMgJiAxID8gMHhlZGI4ODMyMCBeIGMgPj4+IDEgOiBjID4+PiAxO1xuICAgIH1cbiAgICBjcmNUYWJsZVtuXSA9IGM7XG4gIH1cbiAgcmV0dXJuIGNyY1RhYmxlO1xufVxuXG5mdW5jdGlvbiBjYWxjQ3JjKGJ1Zikge1xuICB2YXIgYyA9IC0xO1xuICBpZiAoIXBuZ0RhdGFUYWJsZSkgcG5nRGF0YVRhYmxlID0gY3JlYXRlUG5nRGF0YVRhYmxlKCk7XG4gIGZvciAodmFyIG4gPSAwOyBuIDwgYnVmLmxlbmd0aDsgbisrKSB7XG4gICAgYyA9IHBuZ0RhdGFUYWJsZVsoYyBeIGJ1ZltuXSkgJiAweEZGXSBeIGMgPj4+IDg7XG4gIH1cbiAgcmV0dXJuIGMgXiAtMTtcbn1cblxudmFyIHBuZ0RhdGFUYWJsZSA9IHZvaWQgMDtcblxudmFyIFBORyA9ICdpbWFnZS9wbmcnO1xudmFyIEpQRUcgPSAnaW1hZ2UvanBlZyc7XG5cbi8vIHRob3NlIGFyZSAzIHBvc3NpYmxlIHNpZ25hdHVyZSBvZiB0aGUgcGh5c0Jsb2NrIGluIGJhc2U2NC5cbi8vIHRoZSBwSFlzIHNpZ25hdHVyZSBibG9jayBpcyBwcmVjZWVkIGJ5IHRoZSA0IGJ5dGVzIG9mIGxlbmdodC4gVGhlIGxlbmd0aCBvZlxuLy8gdGhlIGJsb2NrIGlzIGFsd2F5cyA5IGJ5dGVzLiBTbyBhIHBoeXMgYmxvY2sgaGFzIGFsd2F5cyB0aGlzIHNpZ25hdHVyZTpcbi8vIDAgMCAwIDkgcCBIIFkgcy5cbi8vIEhvd2V2ZXIgdGhlIGRhdGE2NCBlbmNvZGluZyBhbGlnbnMgd2Ugd2lsbCBhbHdheXMgZmluZCBvbmUgb2YgdGhvc2UgMyBzdHJpbmdzLlxuLy8gdGhpcyBhbGxvdyB1cyB0byBmaW5kIHRoaXMgcGFydGljdWxhciBvY2N1cmVuY2Ugb2YgdGhlIHBIWXMgYmxvY2sgd2l0aG91dFxuLy8gY29udmVydGluZyBmcm9tIGI2NCBiYWNrIHRvIHN0cmluZ1xudmFyIGI2NFBoeXNTaWduYXR1cmUxID0gJ0FBbHdTRmx6JztcbnZhciBiNjRQaHlzU2lnbmF0dXJlMiA9ICdBQUFKY0VoWic7XG52YXIgYjY0UGh5c1NpZ25hdHVyZTMgPSAnQUFBQUNYQkknO1xuXG52YXIgX1AgPSAncCcuY2hhckNvZGVBdCgwKTtcbnZhciBfSCA9ICdIJy5jaGFyQ29kZUF0KDApO1xudmFyIF9ZID0gJ1knLmNoYXJDb2RlQXQoMCk7XG52YXIgX1MgPSAncycuY2hhckNvZGVBdCgwKTtcblxuZnVuY3Rpb24gY2hhbmdlRHBpQmxvYihibG9iLCBkcGkpIHtcbiAgLy8gMzMgYnl0ZXMgYXJlIG9rIGZvciBwbmdzIGFuZCBqcGVnc1xuICAvLyB0byBjb250YWluIHRoZSBpbmZvcm1hdGlvbi5cbiAgdmFyIGhlYWRlckNodW5rID0gYmxvYi5zbGljZSgwLCAzMyk7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdmFyIGZpbGVSZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgIGZpbGVSZWFkZXIub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGRhdGFBcnJheSA9IG5ldyBVaW50OEFycmF5KGZpbGVSZWFkZXIucmVzdWx0KTtcbiAgICAgIHZhciB0YWlsID0gYmxvYi5zbGljZSgzMyk7XG4gICAgICB2YXIgY2hhbmdlZEFycmF5ID0gY2hhbmdlRHBpT25BcnJheShkYXRhQXJyYXksIGRwaSwgYmxvYi50eXBlKTtcbiAgICAgIHJlc29sdmUobmV3IEJsb2IoW2NoYW5nZWRBcnJheSwgdGFpbF0sIHsgdHlwZTogYmxvYi50eXBlIH0pKTtcbiAgICB9O1xuICAgIGZpbGVSZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoaGVhZGVyQ2h1bmspO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gY2hhbmdlRHBpRGF0YVVybChiYXNlNjRJbWFnZSwgZHBpKSB7XG4gIHZhciBkYXRhU3BsaXR0ZWQgPSBiYXNlNjRJbWFnZS5zcGxpdCgnLCcpO1xuICB2YXIgZm9ybWF0ID0gZGF0YVNwbGl0dGVkWzBdO1xuICB2YXIgYm9keSA9IGRhdGFTcGxpdHRlZFsxXTtcbiAgdmFyIHR5cGUgPSB2b2lkIDA7XG4gIHZhciBoZWFkZXJMZW5ndGggPSB2b2lkIDA7XG4gIHZhciBvdmVyd3JpdGVwSFlzID0gZmFsc2U7XG4gIGlmIChmb3JtYXQuaW5kZXhPZihQTkcpICE9PSAtMSkge1xuICAgIHR5cGUgPSBQTkc7XG4gICAgdmFyIGI2NEluZGV4ID0gZGV0ZWN0UGh5c0NodW5rRnJvbURhdGFVcmwoYm9keSk7XG4gICAgLy8gMjggYnl0ZXMgaW4gZGF0YVVybCBhcmUgMjFieXRlcywgbGVuZ3RoIG9mIHBoeXMgY2h1bmsgd2l0aCBldmVyeXRoaW5nIGluc2lkZS5cbiAgICBpZiAoYjY0SW5kZXggPj0gMCkge1xuICAgICAgaGVhZGVyTGVuZ3RoID0gTWF0aC5jZWlsKChiNjRJbmRleCArIDI4KSAvIDMpICogNDtcbiAgICAgIG92ZXJ3cml0ZXBIWXMgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBoZWFkZXJMZW5ndGggPSAzMyAvIDMgKiA0O1xuICAgIH1cbiAgfVxuICBpZiAoZm9ybWF0LmluZGV4T2YoSlBFRykgIT09IC0xKSB7XG4gICAgdHlwZSA9IEpQRUc7XG4gICAgaGVhZGVyTGVuZ3RoID0gMTggLyAzICogNDtcbiAgfVxuICAvLyAzMyBieXRlcyBhcmUgb2sgZm9yIHBuZ3MgYW5kIGpwZWdzXG4gIC8vIHRvIGNvbnRhaW4gdGhlIGluZm9ybWF0aW9uLlxuICB2YXIgc3RyaW5nSGVhZGVyID0gYm9keS5zdWJzdHJpbmcoMCwgaGVhZGVyTGVuZ3RoKTtcbiAgdmFyIHJlc3RPZkRhdGEgPSBib2R5LnN1YnN0cmluZyhoZWFkZXJMZW5ndGgpO1xuICB2YXIgaGVhZGVyQnl0ZXMgPSBhdG9iKHN0cmluZ0hlYWRlcik7XG4gIHZhciBkYXRhQXJyYXkgPSBuZXcgVWludDhBcnJheShoZWFkZXJCeXRlcy5sZW5ndGgpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGFBcnJheS5sZW5ndGg7IGkrKykge1xuICAgIGRhdGFBcnJheVtpXSA9IGhlYWRlckJ5dGVzLmNoYXJDb2RlQXQoaSk7XG4gIH1cbiAgdmFyIGZpbmFsQXJyYXkgPSBjaGFuZ2VEcGlPbkFycmF5KGRhdGFBcnJheSwgZHBpLCB0eXBlLCBvdmVyd3JpdGVwSFlzKTtcbiAgdmFyIGJhc2U2NEhlYWRlciA9IGJ0b2EoU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShTdHJpbmcsIF90b0NvbnN1bWFibGVBcnJheShmaW5hbEFycmF5KSkpO1xuICByZXR1cm4gW2Zvcm1hdCwgJywnLCBiYXNlNjRIZWFkZXIsIHJlc3RPZkRhdGFdLmpvaW4oJycpO1xufVxuXG5mdW5jdGlvbiBkZXRlY3RQaHlzQ2h1bmtGcm9tRGF0YVVybChkYXRhKSB7XG4gIHZhciBiNjRpbmRleCA9IGRhdGEuaW5kZXhPZihiNjRQaHlzU2lnbmF0dXJlMSk7XG4gIGlmIChiNjRpbmRleCA9PT0gLTEpIHtcbiAgICBiNjRpbmRleCA9IGRhdGEuaW5kZXhPZihiNjRQaHlzU2lnbmF0dXJlMik7XG4gIH1cbiAgaWYgKGI2NGluZGV4ID09PSAtMSkge1xuICAgIGI2NGluZGV4ID0gZGF0YS5pbmRleE9mKGI2NFBoeXNTaWduYXR1cmUzKTtcbiAgfVxuICAvLyBpZiBiNjRpbmRleCA9PT0gLTEgY2h1bmsgaXMgbm90IGZvdW5kXG4gIHJldHVybiBiNjRpbmRleDtcbn1cblxuZnVuY3Rpb24gc2VhcmNoU3RhcnRPZlBoeXMoZGF0YSkge1xuICB2YXIgbGVuZ3RoID0gZGF0YS5sZW5ndGggLSAxO1xuICAvLyB3ZSBjaGVjayBmcm9tIHRoZSBlbmQgc2luY2Ugd2UgY3V0IHRoZSBzdHJpbmcgaW4gcHJveGltaXR5IG9mIHRoZSBoZWFkZXJcbiAgLy8gdGhlIGhlYWRlciBpcyB3aXRoaW4gMjEgYnl0ZXMgZnJvbSB0aGUgZW5kLlxuICBmb3IgKHZhciBpID0gbGVuZ3RoOyBpID49IDQ7IGktLSkge1xuICAgIGlmIChkYXRhW2kgLSA0XSA9PT0gOSAmJiBkYXRhW2kgLSAzXSA9PT0gX1AgJiYgZGF0YVtpIC0gMl0gPT09IF9IICYmIGRhdGFbaSAtIDFdID09PSBfWSAmJiBkYXRhW2ldID09PSBfUykge1xuICAgICAgcmV0dXJuIGkgLSAzO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBjaGFuZ2VEcGlPbkFycmF5KGRhdGFBcnJheSwgZHBpLCBmb3JtYXQsIG92ZXJ3cml0ZXBIWXMpIHtcbiAgaWYgKGZvcm1hdCA9PT0gSlBFRykge1xuICAgIGRhdGFBcnJheVsxM10gPSAxOyAvLyAxIHBpeGVsIHBlciBpbmNoIG9yIDIgcGl4ZWwgcGVyIGNtXG4gICAgZGF0YUFycmF5WzE0XSA9IGRwaSA+PiA4OyAvLyBkcGlYIGhpZ2ggYnl0ZVxuICAgIGRhdGFBcnJheVsxNV0gPSBkcGkgJiAweGZmOyAvLyBkcGlYIGxvdyBieXRlXG4gICAgZGF0YUFycmF5WzE2XSA9IGRwaSA+PiA4OyAvLyBkcGlZIGhpZ2ggYnl0ZVxuICAgIGRhdGFBcnJheVsxN10gPSBkcGkgJiAweGZmOyAvLyBkcGlZIGxvdyBieXRlXG4gICAgcmV0dXJuIGRhdGFBcnJheTtcbiAgfVxuICBpZiAoZm9ybWF0ID09PSBQTkcpIHtcbiAgICB2YXIgcGh5c0NodW5rID0gbmV3IFVpbnQ4QXJyYXkoMTMpO1xuICAgIC8vIGNodW5rIGhlYWRlciBwSFlzXG4gICAgLy8gOSBieXRlcyBvZiBkYXRhXG4gICAgLy8gNCBieXRlcyBvZiBjcmNcbiAgICAvLyB0aGlzIG11bHRpcGxpY2F0aW9uIGlzIGJlY2F1c2UgdGhlIHN0YW5kYXJkIGlzIGRwaSBwZXIgbWV0ZXIuXG4gICAgZHBpICo9IDM5LjM3MDE7XG4gICAgcGh5c0NodW5rWzBdID0gX1A7XG4gICAgcGh5c0NodW5rWzFdID0gX0g7XG4gICAgcGh5c0NodW5rWzJdID0gX1k7XG4gICAgcGh5c0NodW5rWzNdID0gX1M7XG4gICAgcGh5c0NodW5rWzRdID0gZHBpID4+PiAyNDsgLy8gZHBpWCBoaWdoZXN0IGJ5dGVcbiAgICBwaHlzQ2h1bmtbNV0gPSBkcGkgPj4+IDE2OyAvLyBkcGlYIHZlcnloaWdoIGJ5dGVcbiAgICBwaHlzQ2h1bmtbNl0gPSBkcGkgPj4+IDg7IC8vIGRwaVggaGlnaCBieXRlXG4gICAgcGh5c0NodW5rWzddID0gZHBpICYgMHhmZjsgLy8gZHBpWCBsb3cgYnl0ZVxuICAgIHBoeXNDaHVua1s4XSA9IHBoeXNDaHVua1s0XTsgLy8gZHBpWSBoaWdoZXN0IGJ5dGVcbiAgICBwaHlzQ2h1bmtbOV0gPSBwaHlzQ2h1bmtbNV07IC8vIGRwaVkgdmVyeWhpZ2ggYnl0ZVxuICAgIHBoeXNDaHVua1sxMF0gPSBwaHlzQ2h1bmtbNl07IC8vIGRwaVkgaGlnaCBieXRlXG4gICAgcGh5c0NodW5rWzExXSA9IHBoeXNDaHVua1s3XTsgLy8gZHBpWSBsb3cgYnl0ZVxuICAgIHBoeXNDaHVua1sxMl0gPSAxOyAvLyBkb3QgcGVyIG1ldGVyLi4uLlxuXG4gICAgdmFyIGNyYyA9IGNhbGNDcmMocGh5c0NodW5rKTtcblxuICAgIHZhciBjcmNDaHVuayA9IG5ldyBVaW50OEFycmF5KDQpO1xuICAgIGNyY0NodW5rWzBdID0gY3JjID4+PiAyNDtcbiAgICBjcmNDaHVua1sxXSA9IGNyYyA+Pj4gMTY7XG4gICAgY3JjQ2h1bmtbMl0gPSBjcmMgPj4+IDg7XG4gICAgY3JjQ2h1bmtbM10gPSBjcmMgJiAweGZmO1xuXG4gICAgaWYgKG92ZXJ3cml0ZXBIWXMpIHtcbiAgICAgIHZhciBzdGFydGluZ0luZGV4ID0gc2VhcmNoU3RhcnRPZlBoeXMoZGF0YUFycmF5KTtcbiAgICAgIGRhdGFBcnJheS5zZXQocGh5c0NodW5rLCBzdGFydGluZ0luZGV4KTtcbiAgICAgIGRhdGFBcnJheS5zZXQoY3JjQ2h1bmssIHN0YXJ0aW5nSW5kZXggKyAxMyk7XG4gICAgICByZXR1cm4gZGF0YUFycmF5O1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBpIG5lZWQgdG8gZ2l2ZSBiYWNrIGFuIGFycmF5IG9mIGRhdGEgdGhhdCBpcyBkaXZpc2libGUgYnkgMyBzbyB0aGF0XG4gICAgICAvLyBkYXRhdXJsIGVuY29kaW5nIGdpdmVzIG1lIGludGVnZXJzLCBmb3IgbHVjayB0aGlzIGNodW5rIGlzIDE3ICsgNCA9IDIxXG4gICAgICAvLyBpZiBpdCB3YXMgd2UgY291bGQgYWRkIGEgdGV4dCBjaHVuayBjb250YW5pbmcgc29tZSBpbmZvLCB1bnRpbGwgZGVzaXJlZFxuICAgICAgLy8gbGVuZ3RoIGlzIG1ldC5cblxuICAgICAgLy8gY2h1bmsgc3RydWN0dXIgNCBieXRlcyBmb3IgbGVuZ3RoIGlzIDlcbiAgICAgIHZhciBjaHVua0xlbmd0aCA9IG5ldyBVaW50OEFycmF5KDQpO1xuICAgICAgY2h1bmtMZW5ndGhbMF0gPSAwO1xuICAgICAgY2h1bmtMZW5ndGhbMV0gPSAwO1xuICAgICAgY2h1bmtMZW5ndGhbMl0gPSAwO1xuICAgICAgY2h1bmtMZW5ndGhbM10gPSA5O1xuXG4gICAgICB2YXIgZmluYWxIZWFkZXIgPSBuZXcgVWludDhBcnJheSg1NCk7XG4gICAgICBmaW5hbEhlYWRlci5zZXQoZGF0YUFycmF5LCAwKTtcbiAgICAgIGZpbmFsSGVhZGVyLnNldChjaHVua0xlbmd0aCwgMzMpO1xuICAgICAgZmluYWxIZWFkZXIuc2V0KHBoeXNDaHVuaywgMzcpO1xuICAgICAgZmluYWxIZWFkZXIuc2V0KGNyY0NodW5rLCA1MCk7XG4gICAgICByZXR1cm4gZmluYWxIZWFkZXI7XG4gICAgfVxuICB9XG59IiwiKGZ1bmN0aW9uKGEsYil7aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kKWRlZmluZShbXSxiKTtlbHNlIGlmKFwidW5kZWZpbmVkXCIhPXR5cGVvZiBleHBvcnRzKWIoKTtlbHNle2IoKSxhLkZpbGVTYXZlcj17ZXhwb3J0czp7fX0uZXhwb3J0c319KSh0aGlzLGZ1bmN0aW9uKCl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gYihhLGIpe3JldHVyblwidW5kZWZpbmVkXCI9PXR5cGVvZiBiP2I9e2F1dG9Cb206ITF9Olwib2JqZWN0XCIhPXR5cGVvZiBiJiYoY29uc29sZS53YXJuKFwiRGVwcmVjYXRlZDogRXhwZWN0ZWQgdGhpcmQgYXJndW1lbnQgdG8gYmUgYSBvYmplY3RcIiksYj17YXV0b0JvbTohYn0pLGIuYXV0b0JvbSYmL15cXHMqKD86dGV4dFxcL1xcUyp8YXBwbGljYXRpb25cXC94bWx8XFxTKlxcL1xcUypcXCt4bWwpXFxzKjsuKmNoYXJzZXRcXHMqPVxccyp1dGYtOC9pLnRlc3QoYS50eXBlKT9uZXcgQmxvYihbXCJcXHVGRUZGXCIsYV0se3R5cGU6YS50eXBlfSk6YX1mdW5jdGlvbiBjKGEsYixjKXt2YXIgZD1uZXcgWE1MSHR0cFJlcXVlc3Q7ZC5vcGVuKFwiR0VUXCIsYSksZC5yZXNwb25zZVR5cGU9XCJibG9iXCIsZC5vbmxvYWQ9ZnVuY3Rpb24oKXtnKGQucmVzcG9uc2UsYixjKX0sZC5vbmVycm9yPWZ1bmN0aW9uKCl7Y29uc29sZS5lcnJvcihcImNvdWxkIG5vdCBkb3dubG9hZCBmaWxlXCIpfSxkLnNlbmQoKX1mdW5jdGlvbiBkKGEpe3ZhciBiPW5ldyBYTUxIdHRwUmVxdWVzdDtiLm9wZW4oXCJIRUFEXCIsYSwhMSk7dHJ5e2Iuc2VuZCgpfWNhdGNoKGEpe31yZXR1cm4gMjAwPD1iLnN0YXR1cyYmMjk5Pj1iLnN0YXR1c31mdW5jdGlvbiBlKGEpe3RyeXthLmRpc3BhdGNoRXZlbnQobmV3IE1vdXNlRXZlbnQoXCJjbGlja1wiKSl9Y2F0Y2goYyl7dmFyIGI9ZG9jdW1lbnQuY3JlYXRlRXZlbnQoXCJNb3VzZUV2ZW50c1wiKTtiLmluaXRNb3VzZUV2ZW50KFwiY2xpY2tcIiwhMCwhMCx3aW5kb3csMCwwLDAsODAsMjAsITEsITEsITEsITEsMCxudWxsKSxhLmRpc3BhdGNoRXZlbnQoYil9fXZhciBmPVwib2JqZWN0XCI9PXR5cGVvZiB3aW5kb3cmJndpbmRvdy53aW5kb3c9PT13aW5kb3c/d2luZG93Olwib2JqZWN0XCI9PXR5cGVvZiBzZWxmJiZzZWxmLnNlbGY9PT1zZWxmP3NlbGY6XCJvYmplY3RcIj09dHlwZW9mIGdsb2JhbCYmZ2xvYmFsLmdsb2JhbD09PWdsb2JhbD9nbG9iYWw6dm9pZCAwLGE9Zi5uYXZpZ2F0b3ImJi9NYWNpbnRvc2gvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkmJi9BcHBsZVdlYktpdC8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSYmIS9TYWZhcmkvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCksZz1mLnNhdmVBc3x8KFwib2JqZWN0XCIhPXR5cGVvZiB3aW5kb3d8fHdpbmRvdyE9PWY/ZnVuY3Rpb24oKXt9OlwiZG93bmxvYWRcImluIEhUTUxBbmNob3JFbGVtZW50LnByb3RvdHlwZSYmIWE/ZnVuY3Rpb24oYixnLGgpe3ZhciBpPWYuVVJMfHxmLndlYmtpdFVSTCxqPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO2c9Z3x8Yi5uYW1lfHxcImRvd25sb2FkXCIsai5kb3dubG9hZD1nLGoucmVsPVwibm9vcGVuZXJcIixcInN0cmluZ1wiPT10eXBlb2YgYj8oai5ocmVmPWIsai5vcmlnaW49PT1sb2NhdGlvbi5vcmlnaW4/ZShqKTpkKGouaHJlZik/YyhiLGcsaCk6ZShqLGoudGFyZ2V0PVwiX2JsYW5rXCIpKTooai5ocmVmPWkuY3JlYXRlT2JqZWN0VVJMKGIpLHNldFRpbWVvdXQoZnVuY3Rpb24oKXtpLnJldm9rZU9iamVjdFVSTChqLmhyZWYpfSw0RTQpLHNldFRpbWVvdXQoZnVuY3Rpb24oKXtlKGopfSwwKSl9OlwibXNTYXZlT3JPcGVuQmxvYlwiaW4gbmF2aWdhdG9yP2Z1bmN0aW9uKGYsZyxoKXtpZihnPWd8fGYubmFtZXx8XCJkb3dubG9hZFwiLFwic3RyaW5nXCIhPXR5cGVvZiBmKW5hdmlnYXRvci5tc1NhdmVPck9wZW5CbG9iKGIoZixoKSxnKTtlbHNlIGlmKGQoZikpYyhmLGcsaCk7ZWxzZXt2YXIgaT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtpLmhyZWY9ZixpLnRhcmdldD1cIl9ibGFua1wiLHNldFRpbWVvdXQoZnVuY3Rpb24oKXtlKGkpfSl9fTpmdW5jdGlvbihiLGQsZSxnKXtpZihnPWd8fG9wZW4oXCJcIixcIl9ibGFua1wiKSxnJiYoZy5kb2N1bWVudC50aXRsZT1nLmRvY3VtZW50LmJvZHkuaW5uZXJUZXh0PVwiZG93bmxvYWRpbmcuLi5cIiksXCJzdHJpbmdcIj09dHlwZW9mIGIpcmV0dXJuIGMoYixkLGUpO3ZhciBoPVwiYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtXCI9PT1iLnR5cGUsaT0vY29uc3RydWN0b3IvaS50ZXN0KGYuSFRNTEVsZW1lbnQpfHxmLnNhZmFyaSxqPS9DcmlPU1xcL1tcXGRdKy8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtpZigoanx8aCYmaXx8YSkmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBGaWxlUmVhZGVyKXt2YXIgaz1uZXcgRmlsZVJlYWRlcjtrLm9ubG9hZGVuZD1mdW5jdGlvbigpe3ZhciBhPWsucmVzdWx0O2E9aj9hOmEucmVwbGFjZSgvXmRhdGE6W147XSo7LyxcImRhdGE6YXR0YWNobWVudC9maWxlO1wiKSxnP2cubG9jYXRpb24uaHJlZj1hOmxvY2F0aW9uPWEsZz1udWxsfSxrLnJlYWRBc0RhdGFVUkwoYil9ZWxzZXt2YXIgbD1mLlVSTHx8Zi53ZWJraXRVUkwsbT1sLmNyZWF0ZU9iamVjdFVSTChiKTtnP2cubG9jYXRpb249bTpsb2NhdGlvbi5ocmVmPW0sZz1udWxsLHNldFRpbWVvdXQoZnVuY3Rpb24oKXtsLnJldm9rZU9iamVjdFVSTChtKX0sNEU0KX19KTtmLnNhdmVBcz1nLnNhdmVBcz1nLFwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGUmJihtb2R1bGUuZXhwb3J0cz1nKX0pO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1GaWxlU2F2ZXIubWluLmpzLm1hcCIsImltcG9ydCBoYXNoQ2xlYXIgZnJvbSAnLi9faGFzaENsZWFyLmpzJztcbmltcG9ydCBoYXNoRGVsZXRlIGZyb20gJy4vX2hhc2hEZWxldGUuanMnO1xuaW1wb3J0IGhhc2hHZXQgZnJvbSAnLi9faGFzaEdldC5qcyc7XG5pbXBvcnQgaGFzaEhhcyBmcm9tICcuL19oYXNoSGFzLmpzJztcbmltcG9ydCBoYXNoU2V0IGZyb20gJy4vX2hhc2hTZXQuanMnO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBoYXNoIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gSGFzaChlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBIYXNoYC5cbkhhc2gucHJvdG90eXBlLmNsZWFyID0gaGFzaENsZWFyO1xuSGFzaC5wcm90b3R5cGVbJ2RlbGV0ZSddID0gaGFzaERlbGV0ZTtcbkhhc2gucHJvdG90eXBlLmdldCA9IGhhc2hHZXQ7XG5IYXNoLnByb3RvdHlwZS5oYXMgPSBoYXNoSGFzO1xuSGFzaC5wcm90b3R5cGUuc2V0ID0gaGFzaFNldDtcblxuZXhwb3J0IGRlZmF1bHQgSGFzaDtcbiIsImltcG9ydCBsaXN0Q2FjaGVDbGVhciBmcm9tICcuL19saXN0Q2FjaGVDbGVhci5qcyc7XG5pbXBvcnQgbGlzdENhY2hlRGVsZXRlIGZyb20gJy4vX2xpc3RDYWNoZURlbGV0ZS5qcyc7XG5pbXBvcnQgbGlzdENhY2hlR2V0IGZyb20gJy4vX2xpc3RDYWNoZUdldC5qcyc7XG5pbXBvcnQgbGlzdENhY2hlSGFzIGZyb20gJy4vX2xpc3RDYWNoZUhhcy5qcyc7XG5pbXBvcnQgbGlzdENhY2hlU2V0IGZyb20gJy4vX2xpc3RDYWNoZVNldC5qcyc7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBsaXN0IGNhY2hlIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gTGlzdENhY2hlKGVudHJpZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBlbnRyaWVzID09IG51bGwgPyAwIDogZW50cmllcy5sZW5ndGg7XG5cbiAgdGhpcy5jbGVhcigpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBlbnRyeSA9IGVudHJpZXNbaW5kZXhdO1xuICAgIHRoaXMuc2V0KGVudHJ5WzBdLCBlbnRyeVsxXSk7XG4gIH1cbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYExpc3RDYWNoZWAuXG5MaXN0Q2FjaGUucHJvdG90eXBlLmNsZWFyID0gbGlzdENhY2hlQ2xlYXI7XG5MaXN0Q2FjaGUucHJvdG90eXBlWydkZWxldGUnXSA9IGxpc3RDYWNoZURlbGV0ZTtcbkxpc3RDYWNoZS5wcm90b3R5cGUuZ2V0ID0gbGlzdENhY2hlR2V0O1xuTGlzdENhY2hlLnByb3RvdHlwZS5oYXMgPSBsaXN0Q2FjaGVIYXM7XG5MaXN0Q2FjaGUucHJvdG90eXBlLnNldCA9IGxpc3RDYWNoZVNldDtcblxuZXhwb3J0IGRlZmF1bHQgTGlzdENhY2hlO1xuIiwiaW1wb3J0IGdldE5hdGl2ZSBmcm9tICcuL19nZXROYXRpdmUuanMnO1xuaW1wb3J0IHJvb3QgZnJvbSAnLi9fcm9vdC5qcyc7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBNYXAgPSBnZXROYXRpdmUocm9vdCwgJ01hcCcpO1xuXG5leHBvcnQgZGVmYXVsdCBNYXA7XG4iLCJpbXBvcnQgbWFwQ2FjaGVDbGVhciBmcm9tICcuL19tYXBDYWNoZUNsZWFyLmpzJztcbmltcG9ydCBtYXBDYWNoZURlbGV0ZSBmcm9tICcuL19tYXBDYWNoZURlbGV0ZS5qcyc7XG5pbXBvcnQgbWFwQ2FjaGVHZXQgZnJvbSAnLi9fbWFwQ2FjaGVHZXQuanMnO1xuaW1wb3J0IG1hcENhY2hlSGFzIGZyb20gJy4vX21hcENhY2hlSGFzLmpzJztcbmltcG9ydCBtYXBDYWNoZVNldCBmcm9tICcuL19tYXBDYWNoZVNldC5qcyc7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG1hcCBjYWNoZSBvYmplY3QgdG8gc3RvcmUga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBNYXBDYWNoZShlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBNYXBDYWNoZWAuXG5NYXBDYWNoZS5wcm90b3R5cGUuY2xlYXIgPSBtYXBDYWNoZUNsZWFyO1xuTWFwQ2FjaGUucHJvdG90eXBlWydkZWxldGUnXSA9IG1hcENhY2hlRGVsZXRlO1xuTWFwQ2FjaGUucHJvdG90eXBlLmdldCA9IG1hcENhY2hlR2V0O1xuTWFwQ2FjaGUucHJvdG90eXBlLmhhcyA9IG1hcENhY2hlSGFzO1xuTWFwQ2FjaGUucHJvdG90eXBlLnNldCA9IG1hcENhY2hlU2V0O1xuXG5leHBvcnQgZGVmYXVsdCBNYXBDYWNoZTtcbiIsImltcG9ydCByb290IGZyb20gJy4vX3Jvb3QuanMnO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBTeW1ib2wgPSByb290LlN5bWJvbDtcblxuZXhwb3J0IGRlZmF1bHQgU3ltYm9sO1xuIiwiaW1wb3J0IGVxIGZyb20gJy4vZXEuanMnO1xuXG4vKipcbiAqIEdldHMgdGhlIGluZGV4IGF0IHdoaWNoIHRoZSBga2V5YCBpcyBmb3VuZCBpbiBgYXJyYXlgIG9mIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0geyp9IGtleSBUaGUga2V5IHRvIHNlYXJjaCBmb3IuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSwgZWxzZSBgLTFgLlxuICovXG5mdW5jdGlvbiBhc3NvY0luZGV4T2YoYXJyYXksIGtleSkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICBpZiAoZXEoYXJyYXlbbGVuZ3RoXVswXSwga2V5KSkge1xuICAgICAgcmV0dXJuIGxlbmd0aDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIC0xO1xufVxuXG5leHBvcnQgZGVmYXVsdCBhc3NvY0luZGV4T2Y7XG4iLCJpbXBvcnQgU3ltYm9sIGZyb20gJy4vX1N5bWJvbC5qcyc7XG5pbXBvcnQgZ2V0UmF3VGFnIGZyb20gJy4vX2dldFJhd1RhZy5qcyc7XG5pbXBvcnQgb2JqZWN0VG9TdHJpbmcgZnJvbSAnLi9fb2JqZWN0VG9TdHJpbmcuanMnO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgbnVsbFRhZyA9ICdbb2JqZWN0IE51bGxdJyxcbiAgICB1bmRlZmluZWRUYWcgPSAnW29iamVjdCBVbmRlZmluZWRdJztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3ltVG9TdHJpbmdUYWcgPSBTeW1ib2wgPyBTeW1ib2wudG9TdHJpbmdUYWcgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGdldFRhZ2Agd2l0aG91dCBmYWxsYmFja3MgZm9yIGJ1Z2d5IGVudmlyb25tZW50cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBgdG9TdHJpbmdUYWdgLlxuICovXG5mdW5jdGlvbiBiYXNlR2V0VGFnKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQgPyB1bmRlZmluZWRUYWcgOiBudWxsVGFnO1xuICB9XG4gIHJldHVybiAoc3ltVG9TdHJpbmdUYWcgJiYgc3ltVG9TdHJpbmdUYWcgaW4gT2JqZWN0KHZhbHVlKSlcbiAgICA/IGdldFJhd1RhZyh2YWx1ZSlcbiAgICA6IG9iamVjdFRvU3RyaW5nKHZhbHVlKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYmFzZUdldFRhZztcbiIsImltcG9ydCBiYXNlR2V0VGFnIGZyb20gJy4vX2Jhc2VHZXRUYWcuanMnO1xuaW1wb3J0IGlzT2JqZWN0TGlrZSBmcm9tICcuL2lzT2JqZWN0TGlrZS5qcyc7XG5cbnZhciBhcnJheUJ1ZmZlclRhZyA9ICdbb2JqZWN0IEFycmF5QnVmZmVyXSc7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNBcnJheUJ1ZmZlcmAgd2l0aG91dCBOb2RlLmpzIG9wdGltaXphdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYXJyYXkgYnVmZmVyLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc0FycmF5QnVmZmVyKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGJhc2VHZXRUYWcodmFsdWUpID09IGFycmF5QnVmZmVyVGFnO1xufVxuXG5leHBvcnQgZGVmYXVsdCBiYXNlSXNBcnJheUJ1ZmZlcjtcbiIsImltcG9ydCBpc0Z1bmN0aW9uIGZyb20gJy4vaXNGdW5jdGlvbi5qcyc7XG5pbXBvcnQgaXNNYXNrZWQgZnJvbSAnLi9faXNNYXNrZWQuanMnO1xuaW1wb3J0IGlzT2JqZWN0IGZyb20gJy4vaXNPYmplY3QuanMnO1xuaW1wb3J0IHRvU291cmNlIGZyb20gJy4vX3RvU291cmNlLmpzJztcblxuLyoqXG4gKiBVc2VkIHRvIG1hdGNoIGBSZWdFeHBgXG4gKiBbc3ludGF4IGNoYXJhY3RlcnNdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXBhdHRlcm5zKS5cbiAqL1xudmFyIHJlUmVnRXhwQ2hhciA9IC9bXFxcXF4kLiorPygpW1xcXXt9fF0vZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGhvc3QgY29uc3RydWN0b3JzIChTYWZhcmkpLiAqL1xudmFyIHJlSXNIb3N0Q3RvciA9IC9eXFxbb2JqZWN0IC4rP0NvbnN0cnVjdG9yXFxdJC87XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBmdW5jUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGUsXG4gICAgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byByZXNvbHZlIHRoZSBkZWNvbXBpbGVkIHNvdXJjZSBvZiBmdW5jdGlvbnMuICovXG52YXIgZnVuY1RvU3RyaW5nID0gZnVuY1Byb3RvLnRvU3RyaW5nO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaWYgYSBtZXRob2QgaXMgbmF0aXZlLiAqL1xudmFyIHJlSXNOYXRpdmUgPSBSZWdFeHAoJ14nICtcbiAgZnVuY1RvU3RyaW5nLmNhbGwoaGFzT3duUHJvcGVydHkpLnJlcGxhY2UocmVSZWdFeHBDaGFyLCAnXFxcXCQmJylcbiAgLnJlcGxhY2UoL2hhc093blByb3BlcnR5fChmdW5jdGlvbikuKj8oPz1cXFxcXFwoKXwgZm9yIC4rPyg/PVxcXFxcXF0pL2csICckMS4qPycpICsgJyQnXG4pO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzTmF0aXZlYCB3aXRob3V0IGJhZCBzaGltIGNoZWNrcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIG5hdGl2ZSBmdW5jdGlvbixcbiAqICBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc05hdGl2ZSh2YWx1ZSkge1xuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSB8fCBpc01hc2tlZCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHBhdHRlcm4gPSBpc0Z1bmN0aW9uKHZhbHVlKSA/IHJlSXNOYXRpdmUgOiByZUlzSG9zdEN0b3I7XG4gIHJldHVybiBwYXR0ZXJuLnRlc3QodG9Tb3VyY2UodmFsdWUpKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYmFzZUlzTmF0aXZlO1xuIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy51bmFyeWAgd2l0aG91dCBzdXBwb3J0IGZvciBzdG9yaW5nIG1ldGFkYXRhLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjYXAgYXJndW1lbnRzIGZvci5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGNhcHBlZCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVVuYXJ5KGZ1bmMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIGZ1bmModmFsdWUpO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBiYXNlVW5hcnk7XG4iLCJpbXBvcnQgcm9vdCBmcm9tICcuL19yb290LmpzJztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG92ZXJyZWFjaGluZyBjb3JlLWpzIHNoaW1zLiAqL1xudmFyIGNvcmVKc0RhdGEgPSByb290WydfX2NvcmUtanNfc2hhcmVkX18nXTtcblxuZXhwb3J0IGRlZmF1bHQgY29yZUpzRGF0YTtcbiIsIi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZUdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsICYmIGdsb2JhbC5PYmplY3QgPT09IE9iamVjdCAmJiBnbG9iYWw7XG5cbmV4cG9ydCBkZWZhdWx0IGZyZWVHbG9iYWw7XG4iLCJpbXBvcnQgaXNLZXlhYmxlIGZyb20gJy4vX2lzS2V5YWJsZS5qcyc7XG5cbi8qKlxuICogR2V0cyB0aGUgZGF0YSBmb3IgYG1hcGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBtYXAgVGhlIG1hcCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIHJlZmVyZW5jZSBrZXkuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgbWFwIGRhdGEuXG4gKi9cbmZ1bmN0aW9uIGdldE1hcERhdGEobWFwLCBrZXkpIHtcbiAgdmFyIGRhdGEgPSBtYXAuX19kYXRhX187XG4gIHJldHVybiBpc0tleWFibGUoa2V5KVxuICAgID8gZGF0YVt0eXBlb2Yga2V5ID09ICdzdHJpbmcnID8gJ3N0cmluZycgOiAnaGFzaCddXG4gICAgOiBkYXRhLm1hcDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0TWFwRGF0YTtcbiIsImltcG9ydCBiYXNlSXNOYXRpdmUgZnJvbSAnLi9fYmFzZUlzTmF0aXZlLmpzJztcbmltcG9ydCBnZXRWYWx1ZSBmcm9tICcuL19nZXRWYWx1ZS5qcyc7XG5cbi8qKlxuICogR2V0cyB0aGUgbmF0aXZlIGZ1bmN0aW9uIGF0IGBrZXlgIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIG1ldGhvZCB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZnVuY3Rpb24gaWYgaXQncyBuYXRpdmUsIGVsc2UgYHVuZGVmaW5lZGAuXG4gKi9cbmZ1bmN0aW9uIGdldE5hdGl2ZShvYmplY3QsIGtleSkge1xuICB2YXIgdmFsdWUgPSBnZXRWYWx1ZShvYmplY3QsIGtleSk7XG4gIHJldHVybiBiYXNlSXNOYXRpdmUodmFsdWUpID8gdmFsdWUgOiB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldE5hdGl2ZTtcbiIsImltcG9ydCBTeW1ib2wgZnJvbSAnLi9fU3ltYm9sLmpzJztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG5hdGl2ZU9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHN5bVRvU3RyaW5nVGFnID0gU3ltYm9sID8gU3ltYm9sLnRvU3RyaW5nVGFnIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUdldFRhZ2Agd2hpY2ggaWdub3JlcyBgU3ltYm9sLnRvU3RyaW5nVGFnYCB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgcmF3IGB0b1N0cmluZ1RhZ2AuXG4gKi9cbmZ1bmN0aW9uIGdldFJhd1RhZyh2YWx1ZSkge1xuICB2YXIgaXNPd24gPSBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBzeW1Ub1N0cmluZ1RhZyksXG4gICAgICB0YWcgPSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG5cbiAgdHJ5IHtcbiAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB1bmRlZmluZWQ7XG4gICAgdmFyIHVubWFza2VkID0gdHJ1ZTtcbiAgfSBjYXRjaCAoZSkge31cblxuICB2YXIgcmVzdWx0ID0gbmF0aXZlT2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIGlmICh1bm1hc2tlZCkge1xuICAgIGlmIChpc093bikge1xuICAgICAgdmFsdWVbc3ltVG9TdHJpbmdUYWddID0gdGFnO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgdmFsdWVbc3ltVG9TdHJpbmdUYWddO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBnZXRSYXdUYWc7XG4iLCIvKipcbiAqIEdldHMgdGhlIHZhbHVlIGF0IGBrZXlgIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHByb3BlcnR5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBnZXRWYWx1ZShvYmplY3QsIGtleSkge1xuICByZXR1cm4gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBvYmplY3Rba2V5XTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0VmFsdWU7XG4iLCJpbXBvcnQgbmF0aXZlQ3JlYXRlIGZyb20gJy4vX25hdGl2ZUNyZWF0ZS5qcyc7XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgaGFzaC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKi9cbmZ1bmN0aW9uIGhhc2hDbGVhcigpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IG5hdGl2ZUNyZWF0ZSA/IG5hdGl2ZUNyZWF0ZShudWxsKSA6IHt9O1xuICB0aGlzLnNpemUgPSAwO1xufVxuXG5leHBvcnQgZGVmYXVsdCBoYXNoQ2xlYXI7XG4iLCIvKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBoYXNoLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge09iamVjdH0gaGFzaCBUaGUgaGFzaCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaGFzaERlbGV0ZShrZXkpIHtcbiAgdmFyIHJlc3VsdCA9IHRoaXMuaGFzKGtleSkgJiYgZGVsZXRlIHRoaXMuX19kYXRhX19ba2V5XTtcbiAgdGhpcy5zaXplIC09IHJlc3VsdCA/IDEgOiAwO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBoYXNoRGVsZXRlO1xuIiwiaW1wb3J0IG5hdGl2ZUNyZWF0ZSBmcm9tICcuL19uYXRpdmVDcmVhdGUuanMnO1xuXG4vKiogVXNlZCB0byBzdGFuZC1pbiBmb3IgYHVuZGVmaW5lZGAgaGFzaCB2YWx1ZXMuICovXG52YXIgSEFTSF9VTkRFRklORUQgPSAnX19sb2Rhc2hfaGFzaF91bmRlZmluZWRfXyc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogR2V0cyB0aGUgaGFzaCB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBoYXNoR2V0KGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIGlmIChuYXRpdmVDcmVhdGUpIHtcbiAgICB2YXIgcmVzdWx0ID0gZGF0YVtrZXldO1xuICAgIHJldHVybiByZXN1bHQgPT09IEhBU0hfVU5ERUZJTkVEID8gdW5kZWZpbmVkIDogcmVzdWx0O1xuICB9XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGRhdGEsIGtleSkgPyBkYXRhW2tleV0gOiB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGhhc2hHZXQ7XG4iLCJpbXBvcnQgbmF0aXZlQ3JlYXRlIGZyb20gJy4vX25hdGl2ZUNyZWF0ZS5qcyc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgaGFzaCB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaGFzaEhhcyhrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICByZXR1cm4gbmF0aXZlQ3JlYXRlID8gKGRhdGFba2V5XSAhPT0gdW5kZWZpbmVkKSA6IGhhc093blByb3BlcnR5LmNhbGwoZGF0YSwga2V5KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaGFzaEhhcztcbiIsImltcG9ydCBuYXRpdmVDcmVhdGUgZnJvbSAnLi9fbmF0aXZlQ3JlYXRlLmpzJztcblxuLyoqIFVzZWQgdG8gc3RhbmQtaW4gZm9yIGB1bmRlZmluZWRgIGhhc2ggdmFsdWVzLiAqL1xudmFyIEhBU0hfVU5ERUZJTkVEID0gJ19fbG9kYXNoX2hhc2hfdW5kZWZpbmVkX18nO1xuXG4vKipcbiAqIFNldHMgdGhlIGhhc2ggYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBoYXNoIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBoYXNoU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICB0aGlzLnNpemUgKz0gdGhpcy5oYXMoa2V5KSA/IDAgOiAxO1xuICBkYXRhW2tleV0gPSAobmF0aXZlQ3JlYXRlICYmIHZhbHVlID09PSB1bmRlZmluZWQpID8gSEFTSF9VTkRFRklORUQgOiB2YWx1ZTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGhhc2hTZXQ7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHN1aXRhYmxlIGZvciB1c2UgYXMgdW5pcXVlIG9iamVjdCBrZXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgc3VpdGFibGUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNLZXlhYmxlKHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gKHR5cGUgPT0gJ3N0cmluZycgfHwgdHlwZSA9PSAnbnVtYmVyJyB8fCB0eXBlID09ICdzeW1ib2wnIHx8IHR5cGUgPT0gJ2Jvb2xlYW4nKVxuICAgID8gKHZhbHVlICE9PSAnX19wcm90b19fJylcbiAgICA6ICh2YWx1ZSA9PT0gbnVsbCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGlzS2V5YWJsZTtcbiIsImltcG9ydCBjb3JlSnNEYXRhIGZyb20gJy4vX2NvcmVKc0RhdGEuanMnO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgbWV0aG9kcyBtYXNxdWVyYWRpbmcgYXMgbmF0aXZlLiAqL1xudmFyIG1hc2tTcmNLZXkgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciB1aWQgPSAvW14uXSskLy5leGVjKGNvcmVKc0RhdGEgJiYgY29yZUpzRGF0YS5rZXlzICYmIGNvcmVKc0RhdGEua2V5cy5JRV9QUk9UTyB8fCAnJyk7XG4gIHJldHVybiB1aWQgPyAoJ1N5bWJvbChzcmMpXzEuJyArIHVpZCkgOiAnJztcbn0oKSk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGBmdW5jYCBoYXMgaXRzIHNvdXJjZSBtYXNrZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBmdW5jYCBpcyBtYXNrZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNNYXNrZWQoZnVuYykge1xuICByZXR1cm4gISFtYXNrU3JjS2V5ICYmIChtYXNrU3JjS2V5IGluIGZ1bmMpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpc01hc2tlZDtcbiIsIi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgbGlzdCBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlQ2xlYXIoKSB7XG4gIHRoaXMuX19kYXRhX18gPSBbXTtcbiAgdGhpcy5zaXplID0gMDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbGlzdENhY2hlQ2xlYXI7XG4iLCJpbXBvcnQgYXNzb2NJbmRleE9mIGZyb20gJy4vX2Fzc29jSW5kZXhPZi5qcyc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBhcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzcGxpY2UgPSBhcnJheVByb3RvLnNwbGljZTtcblxuLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgbGlzdCBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlRGVsZXRlKGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIGlmIChpbmRleCA8IDApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIGxhc3RJbmRleCA9IGRhdGEubGVuZ3RoIC0gMTtcbiAgaWYgKGluZGV4ID09IGxhc3RJbmRleCkge1xuICAgIGRhdGEucG9wKCk7XG4gIH0gZWxzZSB7XG4gICAgc3BsaWNlLmNhbGwoZGF0YSwgaW5kZXgsIDEpO1xuICB9XG4gIC0tdGhpcy5zaXplO1xuICByZXR1cm4gdHJ1ZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbGlzdENhY2hlRGVsZXRlO1xuIiwiaW1wb3J0IGFzc29jSW5kZXhPZiBmcm9tICcuL19hc3NvY0luZGV4T2YuanMnO1xuXG4vKipcbiAqIEdldHMgdGhlIGxpc3QgY2FjaGUgdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVHZXQoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIGluZGV4ID0gYXNzb2NJbmRleE9mKGRhdGEsIGtleSk7XG5cbiAgcmV0dXJuIGluZGV4IDwgMCA/IHVuZGVmaW5lZCA6IGRhdGFbaW5kZXhdWzFdO1xufVxuXG5leHBvcnQgZGVmYXVsdCBsaXN0Q2FjaGVHZXQ7XG4iLCJpbXBvcnQgYXNzb2NJbmRleE9mIGZyb20gJy4vX2Fzc29jSW5kZXhPZi5qcyc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgbGlzdCBjYWNoZSB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVIYXMoa2V5KSB7XG4gIHJldHVybiBhc3NvY0luZGV4T2YodGhpcy5fX2RhdGFfXywga2V5KSA+IC0xO1xufVxuXG5leHBvcnQgZGVmYXVsdCBsaXN0Q2FjaGVIYXM7XG4iLCJpbXBvcnQgYXNzb2NJbmRleE9mIGZyb20gJy4vX2Fzc29jSW5kZXhPZi5qcyc7XG5cbi8qKlxuICogU2V0cyB0aGUgbGlzdCBjYWNoZSBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbGlzdCBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgaW5kZXggPSBhc3NvY0luZGV4T2YoZGF0YSwga2V5KTtcblxuICBpZiAoaW5kZXggPCAwKSB7XG4gICAgKyt0aGlzLnNpemU7XG4gICAgZGF0YS5wdXNoKFtrZXksIHZhbHVlXSk7XG4gIH0gZWxzZSB7XG4gICAgZGF0YVtpbmRleF1bMV0gPSB2YWx1ZTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn1cblxuZXhwb3J0IGRlZmF1bHQgbGlzdENhY2hlU2V0O1xuIiwiaW1wb3J0IEhhc2ggZnJvbSAnLi9fSGFzaC5qcyc7XG5pbXBvcnQgTGlzdENhY2hlIGZyb20gJy4vX0xpc3RDYWNoZS5qcyc7XG5pbXBvcnQgTWFwIGZyb20gJy4vX01hcC5qcyc7XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgbWFwLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlQ2xlYXIoKSB7XG4gIHRoaXMuc2l6ZSA9IDA7XG4gIHRoaXMuX19kYXRhX18gPSB7XG4gICAgJ2hhc2gnOiBuZXcgSGFzaCxcbiAgICAnbWFwJzogbmV3IChNYXAgfHwgTGlzdENhY2hlKSxcbiAgICAnc3RyaW5nJzogbmV3IEhhc2hcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbWFwQ2FjaGVDbGVhcjtcbiIsImltcG9ydCBnZXRNYXBEYXRhIGZyb20gJy4vX2dldE1hcERhdGEuanMnO1xuXG4vKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBtYXAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVEZWxldGUoa2V5KSB7XG4gIHZhciByZXN1bHQgPSBnZXRNYXBEYXRhKHRoaXMsIGtleSlbJ2RlbGV0ZSddKGtleSk7XG4gIHRoaXMuc2l6ZSAtPSByZXN1bHQgPyAxIDogMDtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbWFwQ2FjaGVEZWxldGU7XG4iLCJpbXBvcnQgZ2V0TWFwRGF0YSBmcm9tICcuL19nZXRNYXBEYXRhLmpzJztcblxuLyoqXG4gKiBHZXRzIHRoZSBtYXAgdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlR2V0KGtleSkge1xuICByZXR1cm4gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpLmdldChrZXkpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBtYXBDYWNoZUdldDtcbiIsImltcG9ydCBnZXRNYXBEYXRhIGZyb20gJy4vX2dldE1hcERhdGEuanMnO1xuXG4vKipcbiAqIENoZWNrcyBpZiBhIG1hcCB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlSGFzKGtleSkge1xuICByZXR1cm4gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpLmhhcyhrZXkpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBtYXBDYWNoZUhhcztcbiIsImltcG9ydCBnZXRNYXBEYXRhIGZyb20gJy4vX2dldE1hcERhdGEuanMnO1xuXG4vKipcbiAqIFNldHMgdGhlIG1hcCBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBtYXAgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSBnZXRNYXBEYXRhKHRoaXMsIGtleSksXG4gICAgICBzaXplID0gZGF0YS5zaXplO1xuXG4gIGRhdGEuc2V0KGtleSwgdmFsdWUpO1xuICB0aGlzLnNpemUgKz0gZGF0YS5zaXplID09IHNpemUgPyAwIDogMTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbmV4cG9ydCBkZWZhdWx0IG1hcENhY2hlU2V0O1xuIiwiaW1wb3J0IGdldE5hdGl2ZSBmcm9tICcuL19nZXROYXRpdmUuanMnO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgbmF0aXZlQ3JlYXRlID0gZ2V0TmF0aXZlKE9iamVjdCwgJ2NyZWF0ZScpO1xuXG5leHBvcnQgZGVmYXVsdCBuYXRpdmVDcmVhdGU7XG4iLCJpbXBvcnQgZnJlZUdsb2JhbCBmcm9tICcuL19mcmVlR2xvYmFsLmpzJztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYC4gKi9cbnZhciBmcmVlRXhwb3J0cyA9IHR5cGVvZiBleHBvcnRzID09ICdvYmplY3QnICYmIGV4cG9ydHMgJiYgIWV4cG9ydHMubm9kZVR5cGUgJiYgZXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBtb2R1bGVgLiAqL1xudmFyIGZyZWVNb2R1bGUgPSBmcmVlRXhwb3J0cyAmJiB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblxuLyoqIERldGVjdCB0aGUgcG9wdWxhciBDb21tb25KUyBleHRlbnNpb24gYG1vZHVsZS5leHBvcnRzYC4gKi9cbnZhciBtb2R1bGVFeHBvcnRzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLmV4cG9ydHMgPT09IGZyZWVFeHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHByb2Nlc3NgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlUHJvY2VzcyA9IG1vZHVsZUV4cG9ydHMgJiYgZnJlZUdsb2JhbC5wcm9jZXNzO1xuXG4vKiogVXNlZCB0byBhY2Nlc3MgZmFzdGVyIE5vZGUuanMgaGVscGVycy4gKi9cbnZhciBub2RlVXRpbCA9IChmdW5jdGlvbigpIHtcbiAgdHJ5IHtcbiAgICAvLyBVc2UgYHV0aWwudHlwZXNgIGZvciBOb2RlLmpzIDEwKy5cbiAgICB2YXIgdHlwZXMgPSBmcmVlTW9kdWxlICYmIGZyZWVNb2R1bGUucmVxdWlyZSAmJiBmcmVlTW9kdWxlLnJlcXVpcmUoJ3V0aWwnKS50eXBlcztcblxuICAgIGlmICh0eXBlcykge1xuICAgICAgcmV0dXJuIHR5cGVzO1xuICAgIH1cblxuICAgIC8vIExlZ2FjeSBgcHJvY2Vzcy5iaW5kaW5nKCd1dGlsJylgIGZvciBOb2RlLmpzIDwgMTAuXG4gICAgcmV0dXJuIGZyZWVQcm9jZXNzICYmIGZyZWVQcm9jZXNzLmJpbmRpbmcgJiYgZnJlZVByb2Nlc3MuYmluZGluZygndXRpbCcpO1xuICB9IGNhdGNoIChlKSB7fVxufSgpKTtcblxuZXhwb3J0IGRlZmF1bHQgbm9kZVV0aWw7XG4iLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgbmF0aXZlT2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nIHVzaW5nIGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgb2JqZWN0VG9TdHJpbmc7XG4iLCJpbXBvcnQgZnJlZUdsb2JhbCBmcm9tICcuL19mcmVlR2xvYmFsLmpzJztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBzZWxmYC4gKi9cbnZhciBmcmVlU2VsZiA9IHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYgJiYgc2VsZi5PYmplY3QgPT09IE9iamVjdCAmJiBzZWxmO1xuXG4vKiogVXNlZCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdC4gKi9cbnZhciByb290ID0gZnJlZUdsb2JhbCB8fCBmcmVlU2VsZiB8fCBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXG5leHBvcnQgZGVmYXVsdCByb290O1xuIiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIGZ1bmNQcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZ1bmNUb1N0cmluZyA9IGZ1bmNQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBDb252ZXJ0cyBgZnVuY2AgdG8gaXRzIHNvdXJjZSBjb2RlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjb252ZXJ0LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgc291cmNlIGNvZGUuXG4gKi9cbmZ1bmN0aW9uIHRvU291cmNlKGZ1bmMpIHtcbiAgaWYgKGZ1bmMgIT0gbnVsbCkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gZnVuY1RvU3RyaW5nLmNhbGwoZnVuYyk7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIChmdW5jICsgJycpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gIH1cbiAgcmV0dXJuICcnO1xufVxuXG5leHBvcnQgZGVmYXVsdCB0b1NvdXJjZTtcbiIsIi8qKlxuICogUGVyZm9ybXMgYVxuICogW2BTYW1lVmFsdWVaZXJvYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtc2FtZXZhbHVlemVybylcbiAqIGNvbXBhcmlzb24gYmV0d2VlbiB0d28gdmFsdWVzIHRvIGRldGVybWluZSBpZiB0aGV5IGFyZSBlcXVpdmFsZW50LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHsqfSBvdGhlciBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSB9O1xuICogdmFyIG90aGVyID0geyAnYSc6IDEgfTtcbiAqXG4gKiBfLmVxKG9iamVjdCwgb2JqZWN0KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmVxKG9iamVjdCwgb3RoZXIpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmVxKCdhJywgJ2EnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmVxKCdhJywgT2JqZWN0KCdhJykpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmVxKE5hTiwgTmFOKTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gZXEodmFsdWUsIG90aGVyKSB7XG4gIHJldHVybiB2YWx1ZSA9PT0gb3RoZXIgfHwgKHZhbHVlICE9PSB2YWx1ZSAmJiBvdGhlciAhPT0gb3RoZXIpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBlcTtcbiIsImltcG9ydCBiYXNlSXNBcnJheUJ1ZmZlciBmcm9tICcuL19iYXNlSXNBcnJheUJ1ZmZlci5qcyc7XG5pbXBvcnQgYmFzZVVuYXJ5IGZyb20gJy4vX2Jhc2VVbmFyeS5qcyc7XG5pbXBvcnQgbm9kZVV0aWwgZnJvbSAnLi9fbm9kZVV0aWwuanMnO1xuXG4vKiBOb2RlLmpzIGhlbHBlciByZWZlcmVuY2VzLiAqL1xudmFyIG5vZGVJc0FycmF5QnVmZmVyID0gbm9kZVV0aWwgJiYgbm9kZVV0aWwuaXNBcnJheUJ1ZmZlcjtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGFuIGBBcnJheUJ1ZmZlcmAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4zLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGFycmF5IGJ1ZmZlciwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXlCdWZmZXIobmV3IEFycmF5QnVmZmVyKDIpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlCdWZmZXIobmV3IEFycmF5KDIpKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0FycmF5QnVmZmVyID0gbm9kZUlzQXJyYXlCdWZmZXIgPyBiYXNlVW5hcnkobm9kZUlzQXJyYXlCdWZmZXIpIDogYmFzZUlzQXJyYXlCdWZmZXI7XG5cbmV4cG9ydCBkZWZhdWx0IGlzQXJyYXlCdWZmZXI7XG4iLCJpbXBvcnQgYmFzZUdldFRhZyBmcm9tICcuL19iYXNlR2V0VGFnLmpzJztcbmltcG9ydCBpc09iamVjdCBmcm9tICcuL2lzT2JqZWN0LmpzJztcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFzeW5jVGFnID0gJ1tvYmplY3QgQXN5bmNGdW5jdGlvbl0nLFxuICAgIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIGdlblRhZyA9ICdbb2JqZWN0IEdlbmVyYXRvckZ1bmN0aW9uXScsXG4gICAgcHJveHlUYWcgPSAnW29iamVjdCBQcm94eV0nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgRnVuY3Rpb25gIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIGZ1bmN0aW9uLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNGdW5jdGlvbihfKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oL2FiYy8pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvLyBUaGUgdXNlIG9mIGBPYmplY3QjdG9TdHJpbmdgIGF2b2lkcyBpc3N1ZXMgd2l0aCB0aGUgYHR5cGVvZmAgb3BlcmF0b3JcbiAgLy8gaW4gU2FmYXJpIDkgd2hpY2ggcmV0dXJucyAnb2JqZWN0JyBmb3IgdHlwZWQgYXJyYXlzIGFuZCBvdGhlciBjb25zdHJ1Y3RvcnMuXG4gIHZhciB0YWcgPSBiYXNlR2V0VGFnKHZhbHVlKTtcbiAgcmV0dXJuIHRhZyA9PSBmdW5jVGFnIHx8IHRhZyA9PSBnZW5UYWcgfHwgdGFnID09IGFzeW5jVGFnIHx8IHRhZyA9PSBwcm94eVRhZztcbn1cblxuZXhwb3J0IGRlZmF1bHQgaXNGdW5jdGlvbjtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlXG4gKiBbbGFuZ3VhZ2UgdHlwZV0oaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLWVjbWFzY3JpcHQtbGFuZ3VhZ2UtdHlwZXMpXG4gKiBvZiBgT2JqZWN0YC4gKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KF8ubm9vcCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpc09iamVjdDtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuIEEgdmFsdWUgaXMgb2JqZWN0LWxpa2UgaWYgaXQncyBub3QgYG51bGxgXG4gKiBhbmQgaGFzIGEgYHR5cGVvZmAgcmVzdWx0IG9mIFwib2JqZWN0XCIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdExpa2Uoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc09iamVjdExpa2UobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpc09iamVjdExpa2U7XG4iLCJpbXBvcnQgTWFwQ2FjaGUgZnJvbSAnLi9fTWFwQ2FjaGUuanMnO1xuXG4vKiogRXJyb3IgbWVzc2FnZSBjb25zdGFudHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IG1lbW9pemVzIHRoZSByZXN1bHQgb2YgYGZ1bmNgLiBJZiBgcmVzb2x2ZXJgIGlzXG4gKiBwcm92aWRlZCwgaXQgZGV0ZXJtaW5lcyB0aGUgY2FjaGUga2V5IGZvciBzdG9yaW5nIHRoZSByZXN1bHQgYmFzZWQgb24gdGhlXG4gKiBhcmd1bWVudHMgcHJvdmlkZWQgdG8gdGhlIG1lbW9pemVkIGZ1bmN0aW9uLiBCeSBkZWZhdWx0LCB0aGUgZmlyc3QgYXJndW1lbnRcbiAqIHByb3ZpZGVkIHRvIHRoZSBtZW1vaXplZCBmdW5jdGlvbiBpcyB1c2VkIGFzIHRoZSBtYXAgY2FjaGUga2V5LiBUaGUgYGZ1bmNgXG4gKiBpcyBpbnZva2VkIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIG9mIHRoZSBtZW1vaXplZCBmdW5jdGlvbi5cbiAqXG4gKiAqKk5vdGU6KiogVGhlIGNhY2hlIGlzIGV4cG9zZWQgYXMgdGhlIGBjYWNoZWAgcHJvcGVydHkgb24gdGhlIG1lbW9pemVkXG4gKiBmdW5jdGlvbi4gSXRzIGNyZWF0aW9uIG1heSBiZSBjdXN0b21pemVkIGJ5IHJlcGxhY2luZyB0aGUgYF8ubWVtb2l6ZS5DYWNoZWBcbiAqIGNvbnN0cnVjdG9yIHdpdGggb25lIHdob3NlIGluc3RhbmNlcyBpbXBsZW1lbnQgdGhlXG4gKiBbYE1hcGBdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXByb3BlcnRpZXMtb2YtdGhlLW1hcC1wcm90b3R5cGUtb2JqZWN0KVxuICogbWV0aG9kIGludGVyZmFjZSBvZiBgY2xlYXJgLCBgZGVsZXRlYCwgYGdldGAsIGBoYXNgLCBhbmQgYHNldGAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBoYXZlIGl0cyBvdXRwdXQgbWVtb2l6ZWQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbcmVzb2x2ZXJdIFRoZSBmdW5jdGlvbiB0byByZXNvbHZlIHRoZSBjYWNoZSBrZXkuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBtZW1vaXplZCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiAxLCAnYic6IDIgfTtcbiAqIHZhciBvdGhlciA9IHsgJ2MnOiAzLCAnZCc6IDQgfTtcbiAqXG4gKiB2YXIgdmFsdWVzID0gXy5tZW1vaXplKF8udmFsdWVzKTtcbiAqIHZhbHVlcyhvYmplY3QpO1xuICogLy8gPT4gWzEsIDJdXG4gKlxuICogdmFsdWVzKG90aGVyKTtcbiAqIC8vID0+IFszLCA0XVxuICpcbiAqIG9iamVjdC5hID0gMjtcbiAqIHZhbHVlcyhvYmplY3QpO1xuICogLy8gPT4gWzEsIDJdXG4gKlxuICogLy8gTW9kaWZ5IHRoZSByZXN1bHQgY2FjaGUuXG4gKiB2YWx1ZXMuY2FjaGUuc2V0KG9iamVjdCwgWydhJywgJ2InXSk7XG4gKiB2YWx1ZXMob2JqZWN0KTtcbiAqIC8vID0+IFsnYScsICdiJ11cbiAqXG4gKiAvLyBSZXBsYWNlIGBfLm1lbW9pemUuQ2FjaGVgLlxuICogXy5tZW1vaXplLkNhY2hlID0gV2Vha01hcDtcbiAqL1xuZnVuY3Rpb24gbWVtb2l6ZShmdW5jLCByZXNvbHZlcikge1xuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJyB8fCAocmVzb2x2ZXIgIT0gbnVsbCAmJiB0eXBlb2YgcmVzb2x2ZXIgIT0gJ2Z1bmN0aW9uJykpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgdmFyIG1lbW9pemVkID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMsXG4gICAgICAgIGtleSA9IHJlc29sdmVyID8gcmVzb2x2ZXIuYXBwbHkodGhpcywgYXJncykgOiBhcmdzWzBdLFxuICAgICAgICBjYWNoZSA9IG1lbW9pemVkLmNhY2hlO1xuXG4gICAgaWYgKGNhY2hlLmhhcyhrZXkpKSB7XG4gICAgICByZXR1cm4gY2FjaGUuZ2V0KGtleSk7XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIG1lbW9pemVkLmNhY2hlID0gY2FjaGUuc2V0KGtleSwgcmVzdWx0KSB8fCBjYWNoZTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICBtZW1vaXplZC5jYWNoZSA9IG5ldyAobWVtb2l6ZS5DYWNoZSB8fCBNYXBDYWNoZSk7XG4gIHJldHVybiBtZW1vaXplZDtcbn1cblxuLy8gRXhwb3NlIGBNYXBDYWNoZWAuXG5tZW1vaXplLkNhY2hlID0gTWFwQ2FjaGU7XG5cbmV4cG9ydCBkZWZhdWx0IG1lbW9pemU7XG4iLCJpbXBvcnQge1xuXHRIQUxGX0ZMT0FULCBGTE9BVCwgVU5TSUdORURfQllURSwgQllURSwgVU5TSUdORURfU0hPUlQsIFNIT1JULCBVTlNJR05FRF9JTlQsIElOVCxcblx0TElORUFSLCBORUFSRVNULFxuXHRSRVBFQVQsIENMQU1QX1RPX0VER0UsIFJHQiwgUkdCQSxcbn0gZnJvbSAnLi9Db25zdGFudHMnO1xuXG5leHBvcnQgY29uc3QgdmFsaWREYXRhVHlwZXMgPSBbSEFMRl9GTE9BVCwgRkxPQVQsIFVOU0lHTkVEX0JZVEUsIEJZVEUsIFVOU0lHTkVEX1NIT1JULCBTSE9SVCwgVU5TSUdORURfSU5ULCBJTlRdO1xuZXhwb3J0IGZ1bmN0aW9uIGlzVmFsaWREYXRhVHlwZSh0eXBlOiBzdHJpbmcpIHtcblx0cmV0dXJuIHZhbGlkRGF0YVR5cGVzLmluZGV4T2YodHlwZSkgPiAtMTtcbn1cblxuZXhwb3J0IGNvbnN0IHZhbGlkRmlsdGVyVHlwZXMgPSBbTElORUFSLCBORUFSRVNUXTtcbmV4cG9ydCBmdW5jdGlvbiBpc1ZhbGlkRmlsdGVyVHlwZSh0eXBlOiBzdHJpbmcpIHtcblx0cmV0dXJuIHZhbGlkRmlsdGVyVHlwZXMuaW5kZXhPZih0eXBlKSA+IC0xO1xufVxuXG5leHBvcnQgY29uc3QgdmFsaWRXcmFwVHlwZXMgPSBbQ0xBTVBfVE9fRURHRSwgUkVQRUFUXTsgLy8gTUlSUk9SRURfUkVQRUFUXG5leHBvcnQgZnVuY3Rpb24gaXNWYWxpZFdyYXBUeXBlKHR5cGU6IHN0cmluZykge1xuXHRyZXR1cm4gdmFsaWRXcmFwVHlwZXMuaW5kZXhPZih0eXBlKSA+IC0xO1xufVxuXG5leHBvcnQgY29uc3QgdmFsaWRUZXh0dXJlRm9ybWF0VHlwZXMgPSBbUkdCLCBSR0JBXTtcbmV4cG9ydCBmdW5jdGlvbiBpc1ZhbGlkVGV4dHVyZUZvcm1hdFR5cGUodHlwZTogc3RyaW5nKSB7XG5cdHJldHVybiB2YWxpZFRleHR1cmVGb3JtYXRUeXBlcy5pbmRleE9mKHR5cGUpID4gLTE7XG59XG5cbmV4cG9ydCBjb25zdCB2YWxpZFRleHR1cmVEYXRhVHlwZXMgPSBbVU5TSUdORURfQllURV07XG5leHBvcnQgZnVuY3Rpb24gaXNWYWxpZFRleHR1cmVEYXRhVHlwZSh0eXBlOiBzdHJpbmcpIHtcblx0cmV0dXJuIHZhbGlkVGV4dHVyZURhdGFUeXBlcy5pbmRleE9mKHR5cGUpID4gLTE7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc051bWJlcih2YWx1ZTogYW55KSB7XG5cdHJldHVybiAhaXNOYU4odmFsdWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNJbnRlZ2VyKHZhbHVlOiBhbnkpIHtcblx0cmV0dXJuIGlzTnVtYmVyKHZhbHVlKSAmJiAodmFsdWUgJSAxID09PSAwKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzUG9zaXRpdmVJbnRlZ2VyKHZhbHVlOiBhbnkpIHtcblx0cmV0dXJuIGlzSW50ZWdlcih2YWx1ZSkgJiYgIHZhbHVlID4gMDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzU3RyaW5nKHZhbHVlOiBhbnkpe1xuXHRyZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQXJyYXkodmFsdWU6IGFueSkge1xuXHRyZXR1cm4gQXJyYXkuaXNBcnJheSh2YWx1ZSk7XG59IiwiZXhwb3J0IGNvbnN0IEhBTEZfRkxPQVQgPSAnSEFMRl9GTE9BVCc7XG5leHBvcnQgY29uc3QgRkxPQVQgPSAnRkxPQVQnO1xuZXhwb3J0IGNvbnN0IFVOU0lHTkVEX0JZVEUgPSAnVU5TSUdORURfQllURSc7XG5leHBvcnQgY29uc3QgQllURSA9ICdCWVRFJztcbmV4cG9ydCBjb25zdCBVTlNJR05FRF9TSE9SVCA9ICdVTlNJR05FRF9TSE9SVCc7XG5leHBvcnQgY29uc3QgU0hPUlQgPSAnU0hPUlQnO1xuZXhwb3J0IGNvbnN0IFVOU0lHTkVEX0lOVCA9ICdVTlNJR05FRF9JTlQnO1xuZXhwb3J0IGNvbnN0IElOVCA9ICdJTlQnO1xuXG5leHBvcnQgY29uc3QgTElORUFSID0gJ0xJTkVBUic7XG5leHBvcnQgY29uc3QgTkVBUkVTVCA9ICdORUFSRVNUJztcblxuZXhwb3J0IGNvbnN0IFJFUEVBVCA9ICdSRVBFQVQnO1xuZXhwb3J0IGNvbnN0IENMQU1QX1RPX0VER0UgPSAnQ0xBTVBfVE9fRURHRSc7XG4vLyBleHBvcnQgY29uc3QgTUlSUk9SRURfUkVQRUFUID0gJ01JUlJPUkVEX1JFUEVBVCc7XG5cbmV4cG9ydCBjb25zdCBSR0IgPSAnUkdCJztcbmV4cG9ydCBjb25zdCBSR0JBID0gJ1JHQkEnO1xuXG5leHBvcnQgdHlwZSBEYXRhTGF5ZXJBcnJheVR5cGUgPSAgRmxvYXQzMkFycmF5IHwgVWludDhBcnJheSB8IEludDhBcnJheSB8IFVpbnQxNkFycmF5IHwgSW50MTZBcnJheSB8IFVpbnQzMkFycmF5IHwgSW50MzJBcnJheTtcbmV4cG9ydCB0eXBlIERhdGFMYXllclR5cGUgPSB0eXBlb2YgSEFMRl9GTE9BVCB8IHR5cGVvZiBGTE9BVCB8IHR5cGVvZiBVTlNJR05FRF9CWVRFIHwgdHlwZW9mIEJZVEUgfCB0eXBlb2YgVU5TSUdORURfU0hPUlQgfCB0eXBlb2YgU0hPUlQgfCB0eXBlb2YgVU5TSUdORURfSU5UIHwgdHlwZW9mIElOVDtcbmV4cG9ydCB0eXBlIERhdGFMYXllck51bUNvbXBvbmVudHMgPSAxIHwgMiB8IDMgfCA0O1xuZXhwb3J0IHR5cGUgRGF0YUxheWVyRmlsdGVyVHlwZSA9IHR5cGVvZiBMSU5FQVIgfCB0eXBlb2YgTkVBUkVTVDtcbmV4cG9ydCB0eXBlIERhdGFMYXllcldyYXBUeXBlID0gdHlwZW9mIFJFUEVBVCB8IHR5cGVvZiBDTEFNUF9UT19FREdFOy8vIHwgdHlwZW9mIE1JUlJPUkVEX1JFUEVBVDtcblxuZXhwb3J0IHR5cGUgVGV4dHVyZUZvcm1hdFR5cGUgPSB0eXBlb2YgUkdCIHwgdHlwZW9mIFJHQkE7XG5leHBvcnQgdHlwZSBUZXh0dXJlRGF0YVR5cGUgPSB0eXBlb2YgVU5TSUdORURfQllURTtcblxuZXhwb3J0IGNvbnN0IEdMU0wzID0gJzMwMCBlcyc7XG5leHBvcnQgY29uc3QgR0xTTDEgPSAnMTAwJztcbmV4cG9ydCB0eXBlIEdMU0xWZXJzaW9uID0gdHlwZW9mIEdMU0wxIHwgdHlwZW9mIEdMU0wzO1xuXG4vLyBVbmlmb3JtIHR5cGVzLlxuZXhwb3J0IGNvbnN0IEZMT0FUXzFEX1VOSUZPUk0gPSAnMWYnO1xuZXhwb3J0IGNvbnN0IEZMT0FUXzJEX1VOSUZPUk0gPSAnMmYnO1xuZXhwb3J0IGNvbnN0IEZMT0FUXzNEX1VOSUZPUk0gPSAnM2YnO1xuZXhwb3J0IGNvbnN0IEZMT0FUXzREX1VOSUZPUk0gPSAnM2YnO1xuZXhwb3J0IGNvbnN0IElOVF8xRF9VTklGT1JNID0gJzFpJztcbmV4cG9ydCBjb25zdCBJTlRfMkRfVU5JRk9STSA9ICcyaSc7XG5leHBvcnQgY29uc3QgSU5UXzNEX1VOSUZPUk0gPSAnM2knO1xuZXhwb3J0IGNvbnN0IElOVF80RF9VTklGT1JNID0gJzNpJztcblxuZXhwb3J0IHR5cGUgVW5pZm9ybURhdGFUeXBlID0gdHlwZW9mIEZMT0FUIHwgdHlwZW9mIElOVDtcbmV4cG9ydCB0eXBlIFVuaWZvcm1WYWx1ZVR5cGUgPSBcblx0bnVtYmVyIHxcblx0W251bWJlcl0gfFxuXHRbbnVtYmVyLCBudW1iZXJdIHxcblx0W251bWJlciwgbnVtYmVyLCBudW1iZXJdIHxcblx0W251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl07XG5leHBvcnQgdHlwZSBVbmlmb3JtVHlwZSA9IFxuXHR0eXBlb2YgRkxPQVRfMURfVU5JRk9STSB8XG5cdHR5cGVvZiBGTE9BVF8yRF9VTklGT1JNIHxcblx0dHlwZW9mIEZMT0FUXzNEX1VOSUZPUk0gfFxuXHR0eXBlb2YgRkxPQVRfNERfVU5JRk9STSB8XG5cdHR5cGVvZiBJTlRfMURfVU5JRk9STSB8XG5cdHR5cGVvZiBJTlRfMkRfVU5JRk9STSB8XG5cdHR5cGVvZiBJTlRfM0RfVU5JRk9STSB8XG5cdHR5cGVvZiBJTlRfNERfVU5JRk9STTtcbmV4cG9ydCB0eXBlIFVuaWZvcm0gPSB7IFxuXHRsb2NhdGlvbjogeyBba2V5OiBzdHJpbmddOiBXZWJHTFVuaWZvcm1Mb2NhdGlvbiB9LFxuXHR0eXBlOiBVbmlmb3JtVHlwZSxcblx0dmFsdWU6IFVuaWZvcm1WYWx1ZVR5cGUsXG59O1xuXG4iLCJpbXBvcnQgeyBzZXRGbG9hdDE2IH0gZnJvbSAnQHBldGFtb3Jpa2VuL2Zsb2F0MTYnO1xuaW1wb3J0IHsgaXNQb3NpdGl2ZUludGVnZXIsIGlzVmFsaWREYXRhVHlwZSwgaXNWYWxpZEZpbHRlclR5cGUsIGlzVmFsaWRXcmFwVHlwZSwgdmFsaWREYXRhVHlwZXMsIHZhbGlkRmlsdGVyVHlwZXMsIHZhbGlkV3JhcFR5cGVzIH0gZnJvbSAnLi9DaGVja3MnO1xuaW1wb3J0IHtcblx0SEFMRl9GTE9BVCwgRkxPQVQsIFVOU0lHTkVEX0JZVEUsIEJZVEUsIFVOU0lHTkVEX1NIT1JULCBTSE9SVCwgVU5TSUdORURfSU5ULCBJTlQsXG5cdE5FQVJFU1QsIExJTkVBUiwgQ0xBTVBfVE9fRURHRSxcblx0RGF0YUxheWVyQXJyYXlUeXBlLCBEYXRhTGF5ZXJGaWx0ZXJUeXBlLCBEYXRhTGF5ZXJOdW1Db21wb25lbnRzLCBEYXRhTGF5ZXJUeXBlLCBEYXRhTGF5ZXJXcmFwVHlwZSwgR0xTTFZlcnNpb24sIEdMU0wzLCBHTFNMMSxcbiB9IGZyb20gJy4vQ29uc3RhbnRzJztcbmltcG9ydCB7XG5cdGdldEV4dGVuc2lvbixcblx0RVhUX0NPTE9SX0JVRkZFUl9GTE9BVCxcblx0T0VTX1RFWFRVUkVfRkxPQVQsXG5cdE9FU19URVhUVVJFX0ZMT0FUX0xJTkVBUixcblx0T0VTX1RFWFRVUkVfSEFMRl9GTE9BVCxcblx0T0VTX1RFWFRVUkVfSEFsRl9GTE9BVF9MSU5FQVIsXG59IGZyb20gJy4vZXh0ZW5zaW9ucyc7XG5pbXBvcnQgeyBpc1dlYkdMMiB9IGZyb20gJy4vdXRpbHMnO1xuXG5leHBvcnQgdHlwZSBEYXRhTGF5ZXJCdWZmZXIgPSB7XG5cdHRleHR1cmU6IFdlYkdMVGV4dHVyZSxcblx0ZnJhbWVidWZmZXI/OiBXZWJHTEZyYW1lYnVmZmVyLFxufVxuXG50eXBlIEVycm9yQ2FsbGJhY2sgPSAobWVzc2FnZTogc3RyaW5nKSA9PiB2b2lkO1xuXG5leHBvcnQgY2xhc3MgRGF0YUxheWVyIHtcblx0cmVhZG9ubHkgbmFtZTogc3RyaW5nO1xuXHRwcml2YXRlIHJlYWRvbmx5IGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQgfCBXZWJHTDJSZW5kZXJpbmdDb250ZXh0O1xuXHRwcml2YXRlIHJlYWRvbmx5IGVycm9yQ2FsbGJhY2s6IEVycm9yQ2FsbGJhY2s7XG5cblx0Ly8gRWFjaCBEYXRhTGF5ZXIgbWF5IGNvbnRhaW4gYSBudW1iZXIgb2YgYnVmZmVycyB0byBzdG9yZSBkaWZmZXJlbnQgaW5zdGFuY2VzIG9mIHRoZSBzdGF0ZS5cblx0cHJpdmF0ZSBfYnVmZmVySW5kZXggPSAwO1xuXHRyZWFkb25seSBudW1CdWZmZXJzO1xuXHRwcml2YXRlIHJlYWRvbmx5IGJ1ZmZlcnM6IERhdGFMYXllckJ1ZmZlcltdID0gW107XG5cblx0Ly8gVGV4dHVyZSBzaXplcy5cblx0cHJpdmF0ZSBsZW5ndGg/OiBudW1iZXI7IC8vIFRoaXMgaXMgb25seSB1c2VkIGZvciAxRCBkYXRhIGxheWVycy5cblx0cHJpdmF0ZSB3aWR0aDogbnVtYmVyO1xuXHRwcml2YXRlIGhlaWdodDogbnVtYmVyO1xuXG5cdC8vIERhdGFMYXllciBzZXR0aW5ncy5cblx0aW5pdGlhbGl6YXRpb25EYXRhPzogRGF0YUxheWVyQXJyYXlUeXBlOyAvLyBJbml0aWFsIGRhdGEgcGFzc2VkIGluLlxuXHRyZWFkb25seSB0eXBlOiBEYXRhTGF5ZXJUeXBlOyAvLyBJbnB1dCB0eXBlIHBhc3NlZCBpbiBkdXJpbmcgc2V0dXAuXG5cdHJlYWRvbmx5IGludGVybmFsVHlwZTogRGF0YUxheWVyVHlwZTsgLy8gVHlwZSB0aGF0IGNvcnJlc3BvbmRzIHRvIGdsVHlwZSwgbWF5IGJlIGRpZmZlcmVudCBmcm9tIHR5cGUuXG5cdHJlYWRvbmx5IHdyYXBTOiBEYXRhTGF5ZXJXcmFwVHlwZTsgLy8gSW5wdXQgd3JhcCB0eXBlIHBhc3NlZCBpbiBkdXJpbmcgc2V0dXAuXG5cdHJlYWRvbmx5IHdyYXBUOiBEYXRhTGF5ZXJXcmFwVHlwZTsgLy8gSW5wdXQgd3JhcCB0eXBlIHBhc3NlZCBpbiBkdXJpbmcgc2V0dXAuXG5cdHJlYWRvbmx5IGludGVybmFsV3JhcFM6IERhdGFMYXllcldyYXBUeXBlOyAvLyBXcmFwIHR5cGUgdGhhdCBjb3JyZXNwb25kcyB0byBnbFdyYXBTLCBtYXkgYmUgZGlmZmVyZW50IGZyb20gd3JhcFMuXG5cdHJlYWRvbmx5IGludGVybmFsV3JhcFQ6IERhdGFMYXllcldyYXBUeXBlOyAvLyBXcmFwIHR5cGUgdGhhdCBjb3JyZXNwb25kcyB0byBnbFdyYXBULCBtYXkgYmUgZGlmZmVyZW50IGZyb20gd3JhcFQuXG5cdHJlYWRvbmx5IG51bUNvbXBvbmVudHM6IERhdGFMYXllck51bUNvbXBvbmVudHM7IC8vIE51bWJlciBvZiBSR0JBIGNoYW5uZWxzIHRvIHVzZSBmb3IgdGhpcyBEYXRhTGF5ZXIuXG5cdHJlYWRvbmx5IGZpbHRlcjogRGF0YUxheWVyRmlsdGVyVHlwZTsgLy8gSW50ZXJwb2xhdGlvbiBmaWx0ZXIgdHlwZSBvZiBkYXRhLlxuXHRyZWFkb25seSBpbnRlcm5hbEZpbHRlcjogRGF0YUxheWVyRmlsdGVyVHlwZTsgLy8gRmlsdGVyIHR5cGUgdGhhdCBjb3JyZXNwb25kcyB0byBnbEZpbHRlciwgbWF5IGJlIGRpZmZlcmVudCBmcm9tIGZpbHRlci5cblx0cmVhZG9ubHkgd3JpdGFibGU6IGJvb2xlYW47XG5cblx0Ly8gT3B0aW1pemF0aW9ucyBzbyB0aGF0IFwiY29weWluZ1wiIGNhbiBoYXBwZW4gd2l0aG91dCBkcmF3IGNhbGxzLlxuXHRwcml2YXRlIHRleHR1cmVPdmVycmlkZXM/OiAoV2ViR0xUZXh0dXJlIHwgdW5kZWZpbmVkKVtdO1xuXG5cdC8vIEdMIHZhcmlhYmxlcyAodGhlc2UgbWF5IGJlIGRpZmZlcmVudCBmcm9tIHRoZWlyIGNvcnJlc3BvbmRpbmcgbm9uLWdsIHBhcmFtZXRlcnMpLlxuXHRyZWFkb25seSBnbEludGVybmFsRm9ybWF0OiBudW1iZXI7XG5cdHJlYWRvbmx5IGdsRm9ybWF0OiBudW1iZXI7XG5cdHJlYWRvbmx5IGdsVHlwZTogbnVtYmVyO1xuXHRyZWFkb25seSBnbE51bUNoYW5uZWxzOiBudW1iZXI7XG5cdHJlYWRvbmx5IGdsV3JhcFM6IG51bWJlcjtcblx0cmVhZG9ubHkgZ2xXcmFwVDogbnVtYmVyO1xuXHRyZWFkb25seSBnbEZpbHRlcjogbnVtYmVyO1xuXG5cdGNvbnN0cnVjdG9yKFxuXHRcdHBhcmFtczoge1xuXHRcdFx0Z2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCB8IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQsXG5cdFx0XHRuYW1lOiBzdHJpbmcsXG5cdFx0XHRkaW1lbnNpb25zOiBudW1iZXIgfCBbbnVtYmVyLCBudW1iZXJdLFxuXHRcdFx0dHlwZTogRGF0YUxheWVyVHlwZSxcblx0XHRcdG51bUNvbXBvbmVudHM6IERhdGFMYXllck51bUNvbXBvbmVudHMsXG5cdFx0XHRnbHNsVmVyc2lvbjogR0xTTFZlcnNpb24sXG5cdFx0XHRkYXRhPzogRGF0YUxheWVyQXJyYXlUeXBlLFxuXHRcdFx0ZmlsdGVyPzogRGF0YUxheWVyRmlsdGVyVHlwZSxcblx0XHRcdHdyYXBTPzogRGF0YUxheWVyV3JhcFR5cGUsXG5cdFx0XHR3cmFwVD86IERhdGFMYXllcldyYXBUeXBlLFxuXHRcdFx0d3JpdGFibGU/OiBib29sZWFuLFxuXHRcdFx0bnVtQnVmZmVycz86IG51bWJlcixcblx0XHRcdGVycm9yQ2FsbGJhY2s6IEVycm9yQ2FsbGJhY2ssXG5cdFx0fSxcblx0KSB7XG5cdFx0Y29uc3QgeyBnbCwgZXJyb3JDYWxsYmFjaywgbmFtZSwgZGltZW5zaW9ucywgdHlwZSwgbnVtQ29tcG9uZW50cywgZGF0YSwgZ2xzbFZlcnNpb24gfSA9IHBhcmFtcztcblxuXHRcdC8vIFNhdmUgcGFyYW1zLlxuXHRcdHRoaXMubmFtZSA9IG5hbWU7XG5cdFx0dGhpcy5nbCA9IGdsO1xuXHRcdHRoaXMuZXJyb3JDYWxsYmFjayA9IGVycm9yQ2FsbGJhY2s7XG5cblx0XHQvLyBudW1Db21wb25lbnRzIG11c3QgYmUgYmV0d2VlbiAxIGFuZCA0LlxuXHRcdGlmICghaXNQb3NpdGl2ZUludGVnZXIobnVtQ29tcG9uZW50cykgfHwgbnVtQ29tcG9uZW50cyA+IDQpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBudW1Db21wb25lbnRzICR7bnVtQ29tcG9uZW50c30gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHR9XG5cdFx0dGhpcy5udW1Db21wb25lbnRzID0gbnVtQ29tcG9uZW50cztcblxuXHRcdC8vIHdyaXRhYmxlIGRlZmF1bHRzIHRvIGZhbHNlLlxuXHRcdGNvbnN0IHdyaXRhYmxlID0gISFwYXJhbXMud3JpdGFibGU7XG5cdFx0dGhpcy53cml0YWJsZSA9IHdyaXRhYmxlO1xuXG5cdFx0Ly8gU2V0IGRpbWVuc2lvbnMsIG1heSBiZSAxRCBvciAyRC5cblx0XHRjb25zdCB7IGxlbmd0aCwgd2lkdGgsIGhlaWdodCB9ID0gRGF0YUxheWVyLmNhbGNTaXplKGRpbWVuc2lvbnMsIG5hbWUpO1xuXHRcdHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xuXHRcdGlmICghaXNQb3NpdGl2ZUludGVnZXIod2lkdGgpKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgd2lkdGggJHt3aWR0aH0gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHR9XG5cdFx0dGhpcy53aWR0aCA9IHdpZHRoO1xuXHRcdGlmICghaXNQb3NpdGl2ZUludGVnZXIoaGVpZ2h0KSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGxlbmd0aCAke2hlaWdodH0gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHR9XG5cdFx0dGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG5cblx0XHQvLyBTZXQgZmlsdGVyaW5nIC0gaWYgd2UgYXJlIHByb2Nlc3NpbmcgYSAxRCBhcnJheSwgZGVmYXVsdCB0byBORUFSRVNUIGZpbHRlcmluZy5cblx0XHQvLyBFbHNlIGRlZmF1bHQgdG8gTElORUFSIChpbnRlcnBvbGF0aW9uKSBmaWx0ZXJpbmcuXG5cdFx0Y29uc3QgZmlsdGVyID0gcGFyYW1zLmZpbHRlciAhPT0gdW5kZWZpbmVkID8gcGFyYW1zLmZpbHRlciA6IChsZW5ndGggPyBORUFSRVNUIDogTElORUFSKTtcblx0XHRpZiAoIWlzVmFsaWRGaWx0ZXJUeXBlKGZpbHRlcikpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBmaWx0ZXI6ICR7ZmlsdGVyfSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLCBtdXN0IGJlICR7dmFsaWRGaWx0ZXJUeXBlcy5qb2luKCcsICcpfS5gKTtcblx0XHR9XG5cdFx0dGhpcy5maWx0ZXIgPSBmaWx0ZXI7XG5cblx0XHQvLyBHZXQgd3JhcCB0eXBlcywgZGVmYXVsdCB0byBjbGFtcCB0byBlZGdlLlxuXHRcdGNvbnN0IHdyYXBTID0gcGFyYW1zLndyYXBTICE9PSB1bmRlZmluZWQgPyBwYXJhbXMud3JhcFMgOiBDTEFNUF9UT19FREdFO1xuXHRcdGlmICghaXNWYWxpZFdyYXBUeXBlKHdyYXBTKSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHdyYXBTOiAke3dyYXBTfSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLCBtdXN0IGJlICR7dmFsaWRXcmFwVHlwZXMuam9pbignLCAnKX0uYCk7XG5cdFx0fVxuXHRcdHRoaXMud3JhcFMgPSB3cmFwUztcblx0XHRjb25zdCB3cmFwVCA9IHBhcmFtcy53cmFwVCAhPT0gdW5kZWZpbmVkID8gcGFyYW1zLndyYXBUIDogQ0xBTVBfVE9fRURHRTtcblx0XHRpZiAoIWlzVmFsaWRXcmFwVHlwZSh3cmFwVCkpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB3cmFwVDogJHt3cmFwVH0gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIiwgbXVzdCBiZSAke3ZhbGlkV3JhcFR5cGVzLmpvaW4oJywgJyl9LmApO1xuXHRcdH1cblx0XHR0aGlzLndyYXBUID0gd3JhcFQ7XG5cblx0XHQvLyBTZXQgZGF0YSB0eXBlLlxuXHRcdGlmICghaXNWYWxpZERhdGFUeXBlKHR5cGUpKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdHlwZSAke3R5cGV9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIsIG11c3QgYmUgb25lIG9mICR7dmFsaWREYXRhVHlwZXMuam9pbignLCAnKX0uYCk7XG5cdFx0fVxuXHRcdHRoaXMudHlwZSA9IHR5cGU7XG5cdFx0Y29uc3QgaW50ZXJuYWxUeXBlID0gRGF0YUxheWVyLmdldEludGVybmFsVHlwZSh7XG5cdFx0XHRnbCxcblx0XHRcdHR5cGUsXG5cdFx0XHRnbHNsVmVyc2lvbixcblx0XHRcdHdyaXRhYmxlLFxuXHRcdFx0ZmlsdGVyLFxuXHRcdFx0bmFtZSxcblx0XHRcdGVycm9yQ2FsbGJhY2ssXG5cdFx0fSk7XG5cdFx0dGhpcy5pbnRlcm5hbFR5cGUgPSBpbnRlcm5hbFR5cGU7XG5cdFx0Ly8gU2V0IGdsIHRleHR1cmUgcGFyYW1ldGVycy5cblx0XHRjb25zdCB7XG5cdFx0XHRnbEZvcm1hdCxcblx0XHRcdGdsSW50ZXJuYWxGb3JtYXQsXG5cdFx0XHRnbFR5cGUsXG5cdFx0XHRnbE51bUNoYW5uZWxzLFxuXHRcdH0gPSBEYXRhTGF5ZXIuZ2V0R0xUZXh0dXJlUGFyYW1ldGVycyh7XG5cdFx0XHRnbCxcblx0XHRcdG5hbWUsXG5cdFx0XHRudW1Db21wb25lbnRzLFxuXHRcdFx0d3JpdGFibGUsXG5cdFx0XHRpbnRlcm5hbFR5cGUsXG5cdFx0XHRnbHNsVmVyc2lvbixcblx0XHRcdGVycm9yQ2FsbGJhY2ssXG5cdFx0fSk7XG5cdFx0dGhpcy5nbEludGVybmFsRm9ybWF0ID0gZ2xJbnRlcm5hbEZvcm1hdDtcblx0XHR0aGlzLmdsRm9ybWF0ID0gZ2xGb3JtYXQ7XG5cdFx0dGhpcy5nbFR5cGUgPSBnbFR5cGU7XG5cdFx0dGhpcy5nbE51bUNoYW5uZWxzID0gZ2xOdW1DaGFubmVscztcblxuXHRcdC8vIFNldCBpbnRlcm5hbCBmaWx0ZXJpbmcvd3JhcCB0eXBlcy5cblx0XHR0aGlzLmludGVybmFsRmlsdGVyID0gRGF0YUxheWVyLmdldEludGVybmFsRmlsdGVyKHsgZ2wsIGZpbHRlciwgaW50ZXJuYWxUeXBlLCBuYW1lLCBlcnJvckNhbGxiYWNrIH0pO1xuXHRcdHRoaXMuZ2xGaWx0ZXIgPSBnbFt0aGlzLmludGVybmFsRmlsdGVyXTtcblx0XHR0aGlzLmludGVybmFsV3JhcFMgPSBEYXRhTGF5ZXIuZ2V0SW50ZXJuYWxXcmFwKHsgZ2wsIHdyYXA6IHdyYXBTLCBuYW1lIH0pO1xuXHRcdHRoaXMuZ2xXcmFwUyA9IGdsW3RoaXMuaW50ZXJuYWxXcmFwU107XG5cdFx0dGhpcy5pbnRlcm5hbFdyYXBUID0gRGF0YUxheWVyLmdldEludGVybmFsV3JhcCh7IGdsLCB3cmFwOiB3cmFwVCwgbmFtZSB9KTtcblx0XHR0aGlzLmdsV3JhcFQgPSBnbFt0aGlzLmludGVybmFsV3JhcFRdO1xuXG5cdFx0Ly8gTnVtIGJ1ZmZlcnMgaXMgdGhlIG51bWJlciBvZiBzdGF0ZXMgdG8gc3RvcmUgZm9yIHRoaXMgZGF0YS5cblx0XHRjb25zdCBudW1CdWZmZXJzID0gcGFyYW1zLm51bUJ1ZmZlcnMgIT09IHVuZGVmaW5lZCA/IHBhcmFtcy5udW1CdWZmZXJzIDogMTtcblx0XHRpZiAoIWlzUG9zaXRpdmVJbnRlZ2VyKG51bUJ1ZmZlcnMpKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgbnVtQnVmZmVyczogJHtudW1CdWZmZXJzfSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLCBtdXN0IGJlIHBvc2l0aXZlIGludGVnZXIuYCk7XG5cdFx0fVxuXHRcdHRoaXMubnVtQnVmZmVycyA9IG51bUJ1ZmZlcnM7XG5cblx0XHR0aGlzLmluaXRCdWZmZXJzKGRhdGEpO1xuXHR9XG5cblx0cHJpdmF0ZSBzdGF0aWMgY2FsY1NpemUoZGltZW5zaW9uczogbnVtYmVyIHwgW251bWJlciwgbnVtYmVyXSwgbmFtZTogc3RyaW5nKSB7XG5cdFx0bGV0IGxlbmd0aCwgd2lkdGgsIGhlaWdodDtcblx0XHRpZiAoIWlzTmFOKGRpbWVuc2lvbnMgYXMgbnVtYmVyKSkge1xuXHRcdFx0aWYgKCFpc1Bvc2l0aXZlSW50ZWdlcihkaW1lbnNpb25zKSkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgbGVuZ3RoICR7ZGltZW5zaW9uc30gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdH1cblx0XHRcdGxlbmd0aCA9IGRpbWVuc2lvbnMgYXMgbnVtYmVyO1xuXHRcdFx0Ly8gQ2FsYyBwb3dlciBvZiB0d28gd2lkdGggYW5kIGhlaWdodCBmb3IgbGVuZ3RoLlxuXHRcdFx0bGV0IGV4cCA9IDE7XG5cdFx0XHRsZXQgcmVtYWluZGVyID0gbGVuZ3RoO1xuXHRcdFx0d2hpbGUgKHJlbWFpbmRlciA+IDIpIHtcblx0XHRcdFx0ZXhwKys7XG5cdFx0XHRcdHJlbWFpbmRlciAvPSAyO1xuXHRcdFx0fVxuXHRcdFx0d2lkdGggPSBNYXRoLnBvdygyLCBNYXRoLmZsb29yKGV4cCAvIDIpICsgZXhwICUgMik7XG5cdFx0XHRoZWlnaHQgPSBNYXRoLnBvdygyLCBNYXRoLmZsb29yKGV4cC8yKSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHdpZHRoID0gKGRpbWVuc2lvbnMgYXMgW251bWJlciwgbnVtYmVyXSlbMF07XG5cdFx0XHRpZiAoIWlzUG9zaXRpdmVJbnRlZ2VyKHdpZHRoKSkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgd2lkdGggJHt3aWR0aH0gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdH1cblx0XHRcdGhlaWdodCA9IChkaW1lbnNpb25zIGFzIFtudW1iZXIsIG51bWJlcl0pWzFdO1xuXHRcdFx0aWYgKCFpc1Bvc2l0aXZlSW50ZWdlcihoZWlnaHQpKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBoZWlnaHQgJHtoZWlnaHR9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIuYCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiB7IHdpZHRoLCBoZWlnaHQsIGxlbmd0aCB9O1xuXHR9XG5cblx0cHJpdmF0ZSBzdGF0aWMgZ2V0SW50ZXJuYWxXcmFwKFxuXHRcdHBhcmFtczoge1xuXHRcdFx0Z2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCB8IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQsXG5cdFx0XHR3cmFwOiBEYXRhTGF5ZXJXcmFwVHlwZSxcblx0XHRcdG5hbWU6IHN0cmluZyxcblx0XHR9LFxuXHQpIHtcblx0XHRjb25zdCB7IGdsLCB3cmFwLCBuYW1lIH0gPSBwYXJhbXM7XG5cdFx0Ly8gV2ViZ2wyLjAgc3VwcG9ydHMgYWxsIGNvbWJpbmF0aW9ucyBvZiB0eXBlcyBhbmQgZmlsdGVyaW5nLlxuXHRcdGlmIChpc1dlYkdMMihnbCkpIHtcblx0XHRcdHJldHVybiB3cmFwO1xuXHRcdH1cblx0XHQvLyBDTEFNUF9UT19FREdFIGlzIGFsd2F5cyBzdXBwb3J0ZWQuXG5cdFx0aWYgKHdyYXAgPT09IENMQU1QX1RPX0VER0UpIHtcblx0XHRcdHJldHVybiB3cmFwO1xuXHRcdH1cblx0XHRpZiAoIWlzV2ViR0wyKGdsKSkge1xuXHRcdFx0Ly8gVE9ETzogd2UgbWF5IHdhbnQgdG8gaGFuZGxlIHRoaXMgaW4gdGhlIGZyYWcgc2hhZGVyLlxuXHRcdFx0Ly8gUkVQRUFUIGFuZCBNSVJST1JfUkVQRUFUIHdyYXAgbm90IHN1cHBvcnRlZCBmb3Igbm9uLXBvd2VyIG9mIDIgdGV4dHVyZXMgaW4gc2FmYXJpLlxuXHRcdFx0Ly8gSSd2ZSB0ZXN0ZWQgdGhpcyBhbmQgaXQgc2VlbXMgdGhhdCBzb21lIHBvd2VyIG9mIDIgdGV4dHVyZXMgd2lsbCB3b3JrICg1MTIgeCA1MTIpLFxuXHRcdFx0Ly8gYnV0IG5vdCBvdGhlcnMgKDEwMjR4MTAyNCksIHNvIGxldCdzIGp1c3QgY2hhbmdlIGFsbCBXZWJHTCAxLjAgdG8gQ0xBTVAuXG5cdFx0XHQvLyBXaXRob3V0IHRoaXMsIHdlIGN1cnJlbnRseSBnZXQgYW4gZXJyb3IgYXQgZHJhd0FycmF5cygpOlxuXHRcdFx0Ly8gXCJXZWJHTDogZHJhd0FycmF5czogdGV4dHVyZSBib3VuZCB0byB0ZXh0dXJlIHVuaXQgMCBpcyBub3QgcmVuZGVyYWJsZS5cblx0XHRcdC8vIEl0IG1heWJlIG5vbi1wb3dlci1vZi0yIGFuZCBoYXZlIGluY29tcGF0aWJsZSB0ZXh0dXJlIGZpbHRlcmluZyBvciBpcyBub3Rcblx0XHRcdC8vICd0ZXh0dXJlIGNvbXBsZXRlJywgb3IgaXQgaXMgYSBmbG9hdC9oYWxmLWZsb2F0IHR5cGUgd2l0aCBsaW5lYXIgZmlsdGVyaW5nIGFuZFxuXHRcdFx0Ly8gd2l0aG91dCB0aGUgcmVsZXZhbnQgZmxvYXQvaGFsZi1mbG9hdCBsaW5lYXIgZXh0ZW5zaW9uIGVuYWJsZWQuXCJcblx0XHRcdGNvbnNvbGUud2FybihgRmFsbGluZyBiYWNrIHRvIENMQU1QX1RPX0VER0Ugd3JhcHBpbmcgZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIiBmb3IgV2ViR0wgMS5gKTtcblx0XHRcdHJldHVybiBDTEFNUF9UT19FREdFO1xuXHRcdH1cblx0XHRyZXR1cm4gd3JhcDtcblx0fVxuXG5cdHByaXZhdGUgc3RhdGljIGdldEludGVybmFsRmlsdGVyKFxuXHRcdHBhcmFtczoge1xuXHRcdFx0Z2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCB8IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQsXG5cdFx0XHRmaWx0ZXI6IERhdGFMYXllckZpbHRlclR5cGUsXG5cdFx0XHRpbnRlcm5hbFR5cGU6IERhdGFMYXllclR5cGUsXG5cdFx0XHRuYW1lOiBzdHJpbmcsXG5cdFx0XHRlcnJvckNhbGxiYWNrOiBFcnJvckNhbGxiYWNrLFxuXHRcdH0sXG5cdCkge1xuXHRcdGNvbnN0IHsgZ2wsIGVycm9yQ2FsbGJhY2ssIGludGVybmFsVHlwZSwgbmFtZSB9ID0gcGFyYW1zO1xuXHRcdGxldCB7IGZpbHRlciB9ID0gcGFyYW1zO1xuXHRcdGlmIChmaWx0ZXIgPT09IE5FQVJFU1QpIHtcblx0XHRcdC8vIE5FQVJFU1QgZmlsdGVyaW5nIGlzIGFsd2F5cyBzdXBwb3J0ZWQuXG5cdFx0XHRyZXR1cm4gZmlsdGVyO1xuXHRcdH1cblxuXHRcdGlmIChpbnRlcm5hbFR5cGUgPT09IEhBTEZfRkxPQVQpIHtcblx0XHRcdC8vIFRPRE86IHRlc3QgaWYgZmxvYXQgbGluZWFyIGV4dGVuc2lvbiBpcyBhY3R1YWxseSB3b3JraW5nLlxuXHRcdFx0Y29uc3QgZXh0ZW5zaW9uID0gZ2V0RXh0ZW5zaW9uKGdsLCBPRVNfVEVYVFVSRV9IQWxGX0ZMT0FUX0xJTkVBUiwgZXJyb3JDYWxsYmFjaywgdHJ1ZSlcblx0XHRcdFx0fHwgZ2V0RXh0ZW5zaW9uKGdsLCBPRVNfVEVYVFVSRV9GTE9BVF9MSU5FQVIsIGVycm9yQ2FsbGJhY2ssIHRydWUpO1xuXHRcdFx0aWYgKCFleHRlbnNpb24pIHtcblx0XHRcdFx0Y29uc29sZS53YXJuKGBGYWxsaW5nIGJhY2sgdG8gTkVBUkVTVCBmaWx0ZXIgZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdFx0Ly9UT0RPOiBhZGQgYSBmYWxsYmFjayB0aGF0IGRvZXMgdGhpcyBmaWx0ZXJpbmcgaW4gdGhlIGZyYWcgc2hhZGVyPy5cblx0XHRcdFx0ZmlsdGVyID0gTkVBUkVTVDtcblx0XHRcdH1cblx0XHR9IGlmIChpbnRlcm5hbFR5cGUgPT09IEZMT0FUKSB7XG5cdFx0XHRjb25zdCBleHRlbnNpb24gPSBnZXRFeHRlbnNpb24oZ2wsIE9FU19URVhUVVJFX0ZMT0FUX0xJTkVBUiwgZXJyb3JDYWxsYmFjaywgdHJ1ZSk7XG5cdFx0XHRpZiAoIWV4dGVuc2lvbikge1xuXHRcdFx0XHRjb25zb2xlLndhcm4oYEZhbGxpbmcgYmFjayB0byBORUFSRVNUIGZpbHRlciBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLmApO1xuXHRcdFx0XHQvL1RPRE86IGFkZCBhIGZhbGxiYWNrIHRoYXQgZG9lcyB0aGlzIGZpbHRlcmluZyBpbiB0aGUgZnJhZyBzaGFkZXI/LlxuXHRcdFx0XHRmaWx0ZXIgPSBORUFSRVNUO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gZmlsdGVyO1xuXHR9XG5cblx0cHJpdmF0ZSBzdGF0aWMgZ2V0SW50ZXJuYWxUeXBlKFxuXHRcdHBhcmFtczoge1xuXHRcdFx0Z2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCB8IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQsXG5cdFx0XHR0eXBlOiBEYXRhTGF5ZXJUeXBlLFxuXHRcdFx0Z2xzbFZlcnNpb246IEdMU0xWZXJzaW9uLFxuXHRcdFx0d3JpdGFibGU6IGJvb2xlYW4sXG5cdFx0XHRmaWx0ZXI6IERhdGFMYXllckZpbHRlclR5cGUsXG5cdFx0XHRuYW1lOiBzdHJpbmcsXG5cdFx0XHRlcnJvckNhbGxiYWNrOiBFcnJvckNhbGxiYWNrLFxuXHRcdH0sXG5cdCkge1xuXHRcdGNvbnN0IHsgZ2wsIGVycm9yQ2FsbGJhY2ssIHdyaXRhYmxlLCBuYW1lLCBnbHNsVmVyc2lvbiB9ID0gcGFyYW1zO1xuXHRcdGNvbnN0IHsgdHlwZSB9ID0gcGFyYW1zO1xuXHRcdGxldCBpbnRlcm5hbFR5cGUgPSB0eXBlO1xuXHRcdC8vIENoZWNrIGlmIGludCB0eXBlcyBhcmUgc3VwcG9ydGVkLlxuXHRcdGNvbnN0IGludENhc3QgPSBEYXRhTGF5ZXIuc2hvdWxkQ2FzdEludFR5cGVBc0Zsb2F0KHBhcmFtcyk7XG5cdFx0aWYgKGludENhc3QpIHtcblx0XHRcdGlmIChpbnRlcm5hbFR5cGUgPT09IFVOU0lHTkVEX0JZVEUgfHwgaW50ZXJuYWxUeXBlID09PSBCWVRFKSB7XG5cdFx0XHRcdC8vIEludGVnZXJzIGJldHdlZW4gMCBhbmQgMjA0OCBjYW4gYmUgZXhhY3RseSByZXByZXNlbnRlZCBieSBoYWxmIGZsb2F0IChhbmQgYWxzbyBiZXR3ZWVuIOKIkjIwNDggYW5kIDApXG5cdFx0XHRcdGludGVybmFsVHlwZSA9IEhBTEZfRkxPQVQ7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBJbnRlZ2VycyBiZXR3ZWVuIDAgYW5kIDE2Nzc3MjE2IGNhbiBiZSBleGFjdGx5IHJlcHJlc2VudGVkIGJ5IGZsb2F0MzIgKGFsc28gYXBwbGllcyBmb3IgbmVnYXRpdmUgaW50ZWdlcnMgYmV0d2VlbiDiiJIxNjc3NzIxNiBhbmQgMClcblx0XHRcdFx0Ly8gVGhpcyBpcyBzdWZmaWNpZW50IGZvciBVTlNJR05FRF9TSE9SVCBhbmQgU0hPUlQgdHlwZXMuXG5cdFx0XHRcdC8vIExhcmdlIFVOU0lHTkVEX0lOVCBhbmQgSU5UIGNhbm5vdCBiZSByZXByZXNlbnRlZCBieSBGTE9BVCB0eXBlLlxuXHRcdFx0XHRpZiAoaW50ZXJuYWxUeXBlID09PSBJTlQgfHwgaW50ZXJuYWxUeXBlID09PSBVTlNJR05FRF9JTlQpIHtcblx0XHRcdFx0XHRcblx0XHRcdFx0fVxuXHRcdFx0XHRjb25zb2xlLndhcm4oYEZhbGxpbmcgYmFjayAke2ludGVybmFsVHlwZX0gdHlwZSB0byBGTE9BVCB0eXBlIGZvciBnbHNsMS54IHN1cHBvcnQgZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5cbkxhcmdlIFVOU0lHTkVEX0lOVCBvciBJTlQgd2l0aCBhYnNvbHV0ZSB2YWx1ZSA+IDE2LDc3NywyMTYgYXJlIG5vdCBzdXBwb3J0ZWQsIG9uIG1vYmlsZSBVTlNJR05FRF9JTlQsIElOVCwgVU5TSUdORURfU0hPUlQsIGFuZCBTSE9SVCB3aXRoIGFic29sdXRlIHZhbHVlID4gMiwwNDggbWF5IG5vdCBiZSBzdXBwb3J0ZWQuYCk7XG5cdFx0XHRcdGludGVybmFsVHlwZSA9IEZMT0FUO1xuXHRcdFx0fVxuXHRcdH1cblx0XHQvLyBDaGVjayBpZiBmbG9hdDMyIHN1cHBvcnRlZC5cblx0XHRpZiAoIWlzV2ViR0wyKGdsKSkge1xuXHRcdFx0aWYgKGludGVybmFsVHlwZSA9PT0gRkxPQVQpIHtcblx0XHRcdFx0Y29uc3QgZXh0ZW5zaW9uID0gZ2V0RXh0ZW5zaW9uKGdsLCBPRVNfVEVYVFVSRV9GTE9BVCwgZXJyb3JDYWxsYmFjaywgdHJ1ZSk7XG5cdFx0XHRcdGlmICghZXh0ZW5zaW9uKSB7XG5cdFx0XHRcdFx0Y29uc29sZS53YXJuKGBGTE9BVCBub3Qgc3VwcG9ydGVkLCBmYWxsaW5nIGJhY2sgdG8gSEFMRl9GTE9BVCB0eXBlIGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIuYCk7XG5cdFx0XHRcdFx0aW50ZXJuYWxUeXBlID0gSEFMRl9GTE9BVDtcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xNzQ3NjYzMi93ZWJnbC1leHRlbnNpb24tc3VwcG9ydC1hY3Jvc3MtYnJvd3NlcnNcblx0XHRcdFx0Ly8gUmVuZGVyaW5nIHRvIGEgZmxvYXRpbmctcG9pbnQgdGV4dHVyZSBtYXkgbm90IGJlIHN1cHBvcnRlZCxcblx0XHRcdFx0Ly8gZXZlbiBpZiB0aGUgT0VTX3RleHR1cmVfZmxvYXQgZXh0ZW5zaW9uIGlzIHN1cHBvcnRlZC5cblx0XHRcdFx0Ly8gVHlwaWNhbGx5LCB0aGlzIGZhaWxzIG9uIGN1cnJlbnQgbW9iaWxlIGhhcmR3YXJlLlxuXHRcdFx0XHQvLyBUbyBjaGVjayBpZiB0aGlzIGlzIHN1cHBvcnRlZCwgeW91IGhhdmUgdG8gY2FsbCB0aGUgV2ViR0xcblx0XHRcdFx0Ly8gY2hlY2tGcmFtZWJ1ZmZlclN0YXR1cygpIGZ1bmN0aW9uLlxuXHRcdFx0XHRpZiAod3JpdGFibGUpIHtcblx0XHRcdFx0XHRjb25zdCB2YWxpZCA9IERhdGFMYXllci50ZXN0RnJhbWVidWZmZXJXcml0ZSh7IGdsLCB0eXBlOiBpbnRlcm5hbFR5cGUsIGdsc2xWZXJzaW9uIH0pO1xuXHRcdFx0XHRcdGlmICghdmFsaWQgJiYgaW50ZXJuYWxUeXBlICE9PSBIQUxGX0ZMT0FUKSB7XG5cdFx0XHRcdFx0XHRjb25zb2xlLndhcm4oYEZMT0FUIG5vdCBzdXBwb3J0ZWQgZm9yIHdyaXRpbmcgb3BlcmF0aW9ucywgZmFsbGluZyBiYWNrIHRvIEhBTEZfRkxPQVQgdHlwZSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLmApO1xuXHRcdFx0XHRcdFx0aW50ZXJuYWxUeXBlID0gSEFMRl9GTE9BVDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdC8vIE11c3Qgc3VwcG9ydCBhdCBsZWFzdCBoYWxmIGZsb2F0IGlmIHVzaW5nIGEgZmxvYXQgdHlwZS5cblx0XHRcdGlmIChpbnRlcm5hbFR5cGUgPT09IEhBTEZfRkxPQVQpIHtcblx0XHRcdFx0Z2V0RXh0ZW5zaW9uKGdsLCBPRVNfVEVYVFVSRV9IQUxGX0ZMT0FULCBlcnJvckNhbGxiYWNrKTtcblx0XHRcdFx0Ly8gVE9ETzogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTQyNDg2MzMvY2Fubm90LWNyZWF0ZS1oYWxmLWZsb2F0LW9lcy10ZXh0dXJlLWZyb20tdWludDE2YXJyYXktb24taXBhZFxuXHRcdFx0XHRpZiAod3JpdGFibGUpIHtcblx0XHRcdFx0XHRjb25zdCB2YWxpZCA9IERhdGFMYXllci50ZXN0RnJhbWVidWZmZXJXcml0ZSh7IGdsLCB0eXBlOiBpbnRlcm5hbFR5cGUsIGdsc2xWZXJzaW9uIH0pO1xuXHRcdFx0XHRcdGlmICghdmFsaWQpIHtcblx0XHRcdFx0XHRcdGVycm9yQ2FsbGJhY2soYFRoaXMgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IHJlbmRlcmluZyB0byBIQUxGX0ZMT0FUIHRleHR1cmVzLmApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRcblx0XHQvLyBMb2FkIGFkZGl0aW9uYWwgZXh0ZW5zaW9ucyBpZiBuZWVkZWQuXG5cdFx0aWYgKHdyaXRhYmxlICYmIGlzV2ViR0wyKGdsKSAmJiAoaW50ZXJuYWxUeXBlID09PSBIQUxGX0ZMT0FUIHx8IGludGVybmFsVHlwZSA9PT0gRkxPQVQpKSB7XG5cdFx0XHRnZXRFeHRlbnNpb24oZ2wsIEVYVF9DT0xPUl9CVUZGRVJfRkxPQVQsIGVycm9yQ2FsbGJhY2spO1xuXHRcdH1cblx0XHRyZXR1cm4gaW50ZXJuYWxUeXBlO1xuXHR9XG5cblx0cHJpdmF0ZSBzdGF0aWMgc2hvdWxkQ2FzdEludFR5cGVBc0Zsb2F0KFxuXHRcdHBhcmFtczoge1xuXHRcdFx0Z2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCB8IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQsXG5cdFx0XHR0eXBlOiBEYXRhTGF5ZXJUeXBlLFxuXHRcdFx0ZmlsdGVyOiBEYXRhTGF5ZXJGaWx0ZXJUeXBlLFxuXHRcdFx0Z2xzbFZlcnNpb246IEdMU0xWZXJzaW9uLFxuXHRcdH1cblx0KSB7XG5cdFx0Y29uc3QgeyBnbCwgdHlwZSwgZmlsdGVyLCBnbHNsVmVyc2lvbiB9ID0gcGFyYW1zO1xuXHRcdGlmIChnbHNsVmVyc2lvbiA9PT0gR0xTTDMgJiYgaXNXZWJHTDIoZ2wpKSByZXR1cm4gZmFsc2U7XG5cdFx0Ly8gVU5TSUdORURfQllURSBhbmQgTElORUFSIGZpbHRlcmluZyBpcyBub3Qgc3VwcG9ydGVkLCBjYXN0IGFzIGZsb2F0LlxuXHRcdGlmICh0eXBlID09PSBVTlNJR05FRF9CWVRFICYmIGZpbHRlciA9PT0gTElORUFSKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0Ly8gSW50IHRleHR1cmVzIChvdGhlciB0aGFuIFVOU0lHTkVEX0JZVEUpIGFyZSBub3Qgc3VwcG9ydGVkIGJ5IFdlYkdMMS4wIG9yIGdsc2wxLnguXG5cdFx0Ly8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTU4MDMwMTcvaG93LXRvLXNlbGVjdC13ZWJnbC1nbHNsLXNhbXBsZXItdHlwZS1mcm9tLXRleHR1cmUtZm9ybWF0LXByb3BlcnRpZXNcblx0XHQvLyBVc2UgSEFMRl9GTE9BVC9GTE9BVCBpbnN0ZWFkLlxuXHRcdHJldHVybiB0eXBlID09PSBCWVRFIHx8IHR5cGUgPT09IFNIT1JUIHx8IHR5cGUgPT09IElOVCB8fCB0eXBlID09PSBVTlNJR05FRF9TSE9SVCB8fCB0eXBlID09PSBVTlNJR05FRF9JTlQ7XG5cdH1cblxuXHRwcml2YXRlIHN0YXRpYyBnZXRHTFRleHR1cmVQYXJhbWV0ZXJzKFxuXHRcdHBhcmFtczoge1xuXHRcdFx0Z2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCB8IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQsXG5cdFx0XHRuYW1lOiBzdHJpbmcsXG5cdFx0XHRudW1Db21wb25lbnRzOiBEYXRhTGF5ZXJOdW1Db21wb25lbnRzLFxuXHRcdFx0aW50ZXJuYWxUeXBlOiBEYXRhTGF5ZXJUeXBlLFxuXHRcdFx0d3JpdGFibGU6IGJvb2xlYW4sXG5cdFx0XHRnbHNsVmVyc2lvbjogR0xTTFZlcnNpb24sXG5cdFx0XHRlcnJvckNhbGxiYWNrOiBFcnJvckNhbGxiYWNrLFxuXHRcdH1cblx0KSB7XG5cdFx0Y29uc3QgeyBnbCwgZXJyb3JDYWxsYmFjaywgbmFtZSwgbnVtQ29tcG9uZW50cywgaW50ZXJuYWxUeXBlLCB3cml0YWJsZSwgZ2xzbFZlcnNpb24gfSA9IHBhcmFtcztcblx0XHQvLyBodHRwczovL3d3dy5raHJvbm9zLm9yZy9yZWdpc3RyeS93ZWJnbC9zcGVjcy9sYXRlc3QvMi4wLyNURVhUVVJFX1RZUEVTX0ZPUk1BVFNfRlJPTV9ET01fRUxFTUVOVFNfVEFCTEVcblx0XHRsZXQgZ2xUeXBlOiBudW1iZXIgfCB1bmRlZmluZWQsXG5cdFx0XHRnbEZvcm1hdDogbnVtYmVyIHwgdW5kZWZpbmVkLFxuXHRcdFx0Z2xJbnRlcm5hbEZvcm1hdDogbnVtYmVyIHwgdW5kZWZpbmVkLFxuXHRcdFx0Z2xOdW1DaGFubmVsczogbnVtYmVyIHwgdW5kZWZpbmVkO1xuXG5cdFx0aWYgKGlzV2ViR0wyKGdsKSkge1xuXHRcdFx0Z2xOdW1DaGFubmVscyA9IG51bUNvbXBvbmVudHM7XG5cdFx0XHQvLyBodHRwczovL3d3dy5raHJvbm9zLm9yZy9yZWdpc3RyeS93ZWJnbC9leHRlbnNpb25zL0VYVF9jb2xvcl9idWZmZXJfZmxvYXQvXG5cdFx0XHQvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvV2ViR0xSZW5kZXJpbmdDb250ZXh0L3RleEltYWdlMkRcblx0XHRcdC8vIFRoZSBzaXplZCBpbnRlcm5hbCBmb3JtYXQgUkdCeHh4IGFyZSBub3QgY29sb3ItcmVuZGVyYWJsZSBmb3Igc29tZSByZWFzb24uXG5cdFx0XHQvLyBJZiBudW1Db21wb25lbnRzID09IDMgZm9yIGEgd3JpdGFibGUgdGV4dHVyZSwgdXNlIFJHQkEgaW5zdGVhZC5cblx0XHRcdC8vIFBhZ2UgNSBvZiBodHRwczovL3d3dy5raHJvbm9zLm9yZy9maWxlcy93ZWJnbDIwLXJlZmVyZW5jZS1ndWlkZS5wZGZcblx0XHRcdGlmIChudW1Db21wb25lbnRzID09PSAzICYmIHdyaXRhYmxlKSB7XG5cdFx0XHRcdGdsTnVtQ2hhbm5lbHMgPSA0O1xuXHRcdFx0fVxuXHRcdFx0aWYgKGludGVybmFsVHlwZSA9PT0gRkxPQVQgfHwgaW50ZXJuYWxUeXBlID09PSBIQUxGX0ZMT0FUKSB7XG5cdFx0XHRcdHN3aXRjaCAoZ2xOdW1DaGFubmVscykge1xuXHRcdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0XHRcdGdsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJFRDtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgMjpcblx0XHRcdFx0XHRcdGdsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHRcdFx0Z2xGb3JtYXQgPSBnbC5SR0I7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDQ6XG5cdFx0XHRcdFx0XHRnbEZvcm1hdCA9IGdsLlJHQkE7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBnbE51bUNoYW5uZWxzICR7Z2xOdW1DaGFubmVsc30gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmIChnbHNsVmVyc2lvbiA9PT0gR0xTTDEgJiYgaW50ZXJuYWxUeXBlID09PSBVTlNJR05FRF9CWVRFKSB7XG5cdFx0XHRcdHN3aXRjaCAoZ2xOdW1DaGFubmVscykge1xuXHRcdFx0XHRcdC8vIEZvciByZWFkIG9ubHkgdGV4dHVyZXMgaW4gV2ViR0wgMS4wLCB1c2UgZ2wuQUxQSEEgYW5kIGdsLkxVTUlOQU5DRV9BTFBIQS5cblx0XHRcdFx0XHQvLyBPdGhlcndpc2UgdXNlIFJHQi9SR0JBLlxuXHRcdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0XHRcdGlmICghd3JpdGFibGUpIHtcblx0XHRcdFx0XHRcdFx0Z2xGb3JtYXQgPSBnbC5BTFBIQTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdFx0aWYgKCF3cml0YWJsZSkge1xuXHRcdFx0XHRcdFx0XHRnbEZvcm1hdCA9IGdsLkxVTUlOQU5DRV9BTFBIQTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHRcdFx0Z2xGb3JtYXQgPSBnbC5SR0I7XG5cdFx0XHRcdFx0XHRnbE51bUNoYW5uZWxzID0gMztcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgNDpcblx0XHRcdFx0XHRcdGdsRm9ybWF0ID0gZ2wuUkdCQTtcblx0XHRcdFx0XHRcdGdsTnVtQ2hhbm5lbHMgPSA0O1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgZ2xOdW1DaGFubmVscyAke2dsTnVtQ2hhbm5lbHN9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIuYCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHN3aXRjaCAoZ2xOdW1DaGFubmVscykge1xuXHRcdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0XHRcdGdsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJFRF9JTlRFR0VSO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdFx0Z2xGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkdfSU5URUdFUjtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgMzpcblx0XHRcdFx0XHRcdGdsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHQl9JTlRFR0VSO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSA0OlxuXHRcdFx0XHRcdFx0Z2xGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkdCQV9JTlRFR0VSO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgZ2xOdW1DaGFubmVscyAke2dsTnVtQ2hhbm5lbHN9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIuYCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHN3aXRjaCAoaW50ZXJuYWxUeXBlKSB7XG5cdFx0XHRcdGNhc2UgSEFMRl9GTE9BVDpcblx0XHRcdFx0XHRnbFR5cGUgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuSEFMRl9GTE9BVDtcblx0XHRcdFx0XHRzd2l0Y2ggKGdsTnVtQ2hhbm5lbHMpIHtcblx0XHRcdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SMTZGO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgMjpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SRzE2Rjtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDM6XG5cdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkdCMTZGO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgNDpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR0JBMTZGO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgZ2xOdW1DaGFubmVscyAke2dsTnVtQ2hhbm5lbHN9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIuYCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIEZMT0FUOlxuXHRcdFx0XHRcdGdsVHlwZSA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5GTE9BVDtcblx0XHRcdFx0XHRzd2l0Y2ggKGdsTnVtQ2hhbm5lbHMpIHtcblx0XHRcdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SMzJGO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgMjpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SRzMyRjtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDM6XG5cdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkdCMzJGO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgNDpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR0JBMzJGO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgZ2xOdW1DaGFubmVscyAke2dsTnVtQ2hhbm5lbHN9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIuYCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFVOU0lHTkVEX0JZVEU6XG5cdFx0XHRcdFx0Z2xUeXBlID0gZ2wuVU5TSUdORURfQllURTtcblx0XHRcdFx0XHRpZiAoZ2xzbFZlcnNpb24gPT09IEdMU0wxICYmIGludGVybmFsVHlwZSA9PT0gVU5TSUdORURfQllURSkge1xuXHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IGdsRm9ybWF0O1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRzd2l0Y2ggKGdsTnVtQ2hhbm5lbHMpIHtcblx0XHRcdFx0XHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUjhVSTtcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkc4VUk7XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdGNhc2UgMzpcblx0XHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHQjhVSTtcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0Y2FzZSA0OlxuXHRcdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkdCQThVSTtcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGdsTnVtQ2hhbm5lbHMgJHtnbE51bUNoYW5uZWxzfSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLmApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBCWVRFOlxuXHRcdFx0XHRcdGdsVHlwZSA9IGdsLkJZVEU7XG5cdFx0XHRcdFx0c3dpdGNoIChnbE51bUNoYW5uZWxzKSB7XG5cdFx0XHRcdFx0XHRjYXNlIDE6XG5cdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUjhJO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgMjpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SRzhJO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgMzpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR0I4STtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDQ6XG5cdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkdCQThJO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgZ2xOdW1DaGFubmVscyAke2dsTnVtQ2hhbm5lbHN9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIuYCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFNIT1JUOlxuXHRcdFx0XHRcdGdsVHlwZSA9IGdsLlNIT1JUO1xuXHRcdFx0XHRcdHN3aXRjaCAoZ2xOdW1DaGFubmVscykge1xuXHRcdFx0XHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlIxNkk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHMTZJO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgMzpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR0IxNkk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSA0OlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHQkExNkk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBnbE51bUNoYW5uZWxzICR7Z2xOdW1DaGFubmVsc30gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgVU5TSUdORURfU0hPUlQ6XG5cdFx0XHRcdFx0Z2xUeXBlID0gZ2wuVU5TSUdORURfU0hPUlQ7XG5cdFx0XHRcdFx0c3dpdGNoIChnbE51bUNoYW5uZWxzKSB7XG5cdFx0XHRcdFx0XHRjYXNlIDE6XG5cdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUjE2VUk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHMTZVSTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDM6XG5cdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkdCMTZVSTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDQ6XG5cdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkdCQTE2VUk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBnbE51bUNoYW5uZWxzICR7Z2xOdW1DaGFubmVsc30gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgSU5UOlxuXHRcdFx0XHRcdGdsVHlwZSA9IGdsLklOVDtcblx0XHRcdFx0XHRzd2l0Y2ggKGdsTnVtQ2hhbm5lbHMpIHtcblx0XHRcdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SMzJJO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgMjpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SRzMySTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDM6XG5cdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkdCMzJJO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgNDpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR0JBMzJJO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgZ2xOdW1DaGFubmVscyAke2dsTnVtQ2hhbm5lbHN9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIuYCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFVOU0lHTkVEX0lOVDpcblx0XHRcdFx0XHRnbFR5cGUgPSBnbC5VTlNJR05FRF9JTlQ7XG5cdFx0XHRcdFx0c3dpdGNoIChnbE51bUNoYW5uZWxzKSB7XG5cdFx0XHRcdFx0XHRjYXNlIDE6XG5cdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUjMyVUk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHMzJVSTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDM6XG5cdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkdCMzJVSTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDQ6XG5cdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkdCQTMyVUk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBnbE51bUNoYW5uZWxzICR7Z2xOdW1DaGFubmVsc30gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCB0eXBlICR7aW50ZXJuYWxUeXBlfSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLmApO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRzd2l0Y2ggKG51bUNvbXBvbmVudHMpIHtcblx0XHRcdFx0Ly8gVE9ETzogZm9yIHJlYWQgb25seSB0ZXh0dXJlcyBpbiBXZWJHTCAxLjAsIHdlIGNvdWxkIHVzZSBnbC5BTFBIQSBhbmQgZ2wuTFVNSU5BTkNFX0FMUEhBIGhlcmUuXG5cdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0XHRpZiAoIXdyaXRhYmxlKSB7XG5cdFx0XHRcdFx0XHRnbEZvcm1hdCA9IGdsLkFMUEhBO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRjYXNlIDI6XG5cdFx0XHRcdFx0aWYgKCF3cml0YWJsZSkge1xuXHRcdFx0XHRcdFx0Z2xGb3JtYXQgPSBnbC5MVU1JTkFOQ0VfQUxQSEE7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdGNhc2UgMzpcblx0XHRcdFx0XHRnbEZvcm1hdCA9IGdsLlJHQjtcblx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gZ2wuUkdCO1xuXHRcdFx0XHRcdGdsTnVtQ2hhbm5lbHMgPSAzO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDQ6XG5cdFx0XHRcdFx0Z2xGb3JtYXQgPSBnbC5SR0JBO1xuXHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSBnbC5SR0JBO1xuXHRcdFx0XHRcdGdsTnVtQ2hhbm5lbHMgPSA0O1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgbnVtQ29tcG9uZW50cyAke251bUNvbXBvbmVudHN9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIuYCk7XG5cdFx0XHR9XG5cdFx0XHRzd2l0Y2ggKGludGVybmFsVHlwZSkge1xuXHRcdFx0XHRjYXNlIEZMT0FUOlxuXHRcdFx0XHRcdGdsVHlwZSA9IGdsLkZMT0FUO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIEhBTEZfRkxPQVQ6XG5cdFx0XHRcdFx0Z2xUeXBlID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLkhBTEZfRkxPQVQgfHwgZ2V0RXh0ZW5zaW9uKGdsLCBPRVNfVEVYVFVSRV9IQUxGX0ZMT0FULCBlcnJvckNhbGxiYWNrKS5IQUxGX0ZMT0FUX09FUyBhcyBudW1iZXI7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgVU5TSUdORURfQllURTpcblx0XHRcdFx0XHRnbFR5cGUgPSBnbC5VTlNJR05FRF9CWVRFO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHQvLyBObyBvdGhlciB0eXBlcyBhcmUgc3VwcG9ydGVkIGluIGdsc2wxLnhcblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIHR5cGUgJHtpbnRlcm5hbFR5cGV9IGluIFdlYkdMIDEuMCBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLmApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIENoZWNrIGZvciBtaXNzaW5nIHBhcmFtcy5cblx0XHRpZiAoZ2xUeXBlID09PSB1bmRlZmluZWQgfHwgZ2xGb3JtYXQgPT09IHVuZGVmaW5lZCB8fCBnbEludGVybmFsRm9ybWF0ID09PSB1bmRlZmluZWQpIHtcblx0XHRcdGNvbnN0IG1pc3NpbmdQYXJhbXMgPSBbXTtcblx0XHRcdGlmIChnbFR5cGUgPT09IHVuZGVmaW5lZCkgbWlzc2luZ1BhcmFtcy5wdXNoKCdnbFR5cGUnKTtcblx0XHRcdGlmIChnbEZvcm1hdCA9PT0gdW5kZWZpbmVkKSBtaXNzaW5nUGFyYW1zLnB1c2goJ2dsRm9ybWF0Jyk7XG5cdFx0XHRpZiAoZ2xJbnRlcm5hbEZvcm1hdCA9PT0gdW5kZWZpbmVkKSBtaXNzaW5nUGFyYW1zLnB1c2goJ2dsSW50ZXJuYWxGb3JtYXQnKTtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB0eXBlOiAke2ludGVybmFsVHlwZX0gZm9yIG51bUNvbXBvbmVudHMgJHtudW1Db21wb25lbnRzfSwgdW5hYmxlIHRvIGluaXQgcGFyYW1ldGVyJHttaXNzaW5nUGFyYW1zLmxlbmd0aCA+IDEgPyAncycgOiAnJ30gJHttaXNzaW5nUGFyYW1zLmpvaW4oJywgJyl9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIuYCk7XG5cdFx0fVxuXHRcdGlmIChnbE51bUNoYW5uZWxzID09PSB1bmRlZmluZWQgfHwgbnVtQ29tcG9uZW50cyA8IDEgfHwgbnVtQ29tcG9uZW50cyA+IDQgfHwgZ2xOdW1DaGFubmVscyA8IG51bUNvbXBvbmVudHMpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBudW1DaGFubmVscyAke2dsTnVtQ2hhbm5lbHN9IGZvciBudW1Db21wb25lbnRzICR7bnVtQ29tcG9uZW50c30gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHR9XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0Z2xGb3JtYXQsXG5cdFx0XHRnbEludGVybmFsRm9ybWF0LFxuXHRcdFx0Z2xUeXBlLFxuXHRcdFx0Z2xOdW1DaGFubmVscyxcblx0XHR9O1xuXHR9XG5cblx0cHJpdmF0ZSBzdGF0aWMgdGVzdEZyYW1lYnVmZmVyV3JpdGUoXG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0IHwgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCxcblx0XHRcdHR5cGU6IERhdGFMYXllclR5cGUsXG5cdFx0XHRnbHNsVmVyc2lvbjogR0xTTFZlcnNpb24sXG5cdFx0fSxcblx0KSB7XG5cdFx0Y29uc3QgeyBnbCwgdHlwZSwgZ2xzbFZlcnNpb24gfSA9IHBhcmFtcztcblx0XHRjb25zdCB0ZXh0dXJlID0gZ2wuY3JlYXRlVGV4dHVyZSgpO1xuXHRcdGlmICghdGV4dHVyZSkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCB0ZXh0dXJlKTtcblxuXHRcdC8vIERlZmF1bHQgdG8gbW9zdCB3aWRlbHkgc3VwcG9ydGVkIHNldHRpbmdzLlxuXHRcdGNvbnN0IHdyYXBTID0gZ2xbQ0xBTVBfVE9fRURHRV07XG5cdFx0Y29uc3Qgd3JhcFQgPSBnbFtDTEFNUF9UT19FREdFXTtcblx0XHRjb25zdCBmaWx0ZXIgPSBnbFtORUFSRVNUXTtcblx0XHQvLyBVc2Ugbm9uLXBvd2VyIG9mIHR3byBkaW1lbnNpb25zIHRvIGNoZWNrIGZvciBtb3JlIHVuaXZlcnNhbCBzdXBwb3J0LlxuXHRcdC8vIChJbiBjYXNlIHNpemUgb2YgRGF0YUxheWVyIGlzIGNoYW5nZWQgYXQgYSBsYXRlciBwb2ludCkuXG5cdFx0Y29uc3Qgd2lkdGggPSAxMDA7XG5cdFx0Y29uc3QgaGVpZ2h0ID0gMTAwO1xuXHRcdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1MsIHdyYXBTKTtcblx0XHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9ULCB3cmFwVCk7XG5cdFx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01JTl9GSUxURVIsIGZpbHRlcik7XG5cdFx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01BR19GSUxURVIsIGZpbHRlcik7XG5cblx0XHRjb25zdCB7IGdsSW50ZXJuYWxGb3JtYXQsIGdsRm9ybWF0LCBnbFR5cGUgfSA9IERhdGFMYXllci5nZXRHTFRleHR1cmVQYXJhbWV0ZXJzKHtcblx0XHRcdGdsLFxuXHRcdFx0bmFtZTogJ3Rlc3RGcmFtZWJ1ZmZlcldyaXRlJyxcblx0XHRcdG51bUNvbXBvbmVudHM6IDEsXG5cdFx0XHR3cml0YWJsZTogdHJ1ZSxcblx0XHRcdGludGVybmFsVHlwZTogdHlwZSxcblx0XHRcdGdsc2xWZXJzaW9uLFxuXHRcdFx0ZXJyb3JDYWxsYmFjazogKCkgPT4ge30sXG5cdFx0fSk7XG5cdFx0Z2wudGV4SW1hZ2UyRChnbC5URVhUVVJFXzJELCAwLCBnbEludGVybmFsRm9ybWF0LCB3aWR0aCwgaGVpZ2h0LCAwLCBnbEZvcm1hdCwgZ2xUeXBlLCBudWxsKTtcblxuXHRcdC8vIEluaXQgYSBmcmFtZWJ1ZmZlciBmb3IgdGhpcyB0ZXh0dXJlIHNvIHdlIGNhbiB3cml0ZSB0byBpdC5cblx0XHRjb25zdCBmcmFtZWJ1ZmZlciA9IGdsLmNyZWF0ZUZyYW1lYnVmZmVyKCk7XG5cdFx0aWYgKCFmcmFtZWJ1ZmZlcikge1xuXHRcdFx0Ly8gQ2xlYXIgb3V0IGFsbG9jYXRlZCBtZW1vcnkuXG5cdFx0XHRnbC5kZWxldGVUZXh0dXJlKHRleHR1cmUpO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIGZyYW1lYnVmZmVyKTtcblx0XHQvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvV2ViR0xSZW5kZXJpbmdDb250ZXh0L2ZyYW1lYnVmZmVyVGV4dHVyZTJEXG5cdFx0Z2wuZnJhbWVidWZmZXJUZXh0dXJlMkQoZ2wuRlJBTUVCVUZGRVIsIGdsLkNPTE9SX0FUVEFDSE1FTlQwLCBnbC5URVhUVVJFXzJELCB0ZXh0dXJlLCAwKTtcblxuXHRcdGNvbnN0IHN0YXR1cyA9IGdsLmNoZWNrRnJhbWVidWZmZXJTdGF0dXMoZ2wuRlJBTUVCVUZGRVIpO1xuXHRcdGNvbnN0IHZhbGlkU3RhdHVzID0gc3RhdHVzID09PSBnbC5GUkFNRUJVRkZFUl9DT01QTEVURTtcblxuXHRcdC8vIENsZWFyIG91dCBhbGxvY2F0ZWQgbWVtb3J5LlxuXHRcdGdsLmRlbGV0ZVRleHR1cmUodGV4dHVyZSk7XG5cdFx0Z2wuZGVsZXRlRnJhbWVidWZmZXIoZnJhbWVidWZmZXIpO1xuXG5cdFx0cmV0dXJuIHZhbGlkU3RhdHVzO1xuXHR9XG5cblx0Z2V0IGJ1ZmZlckluZGV4KCkge1xuXHRcdHJldHVybiB0aGlzLl9idWZmZXJJbmRleDtcblx0fVxuXG5cdHNhdmVDdXJyZW50U3RhdGVUb0RhdGFMYXllcihsYXllcjogRGF0YUxheWVyKSB7XG5cdFx0Ly8gQSBtZXRob2QgZm9yIHNhdmluZyBhIGNvcHkgb2YgdGhlIGN1cnJlbnQgc3RhdGUgd2l0aG91dCBhIGRyYXcgY2FsbC5cblx0XHQvLyBEcmF3IGNhbGxzIGFyZSBleHBlbnNpdmUsIHRoaXMgb3B0aW1pemF0aW9uIGhlbHBzLlxuXHRcdGlmICh0aGlzLm51bUJ1ZmZlcnMgPCAyKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYENhbid0IGNhbGwgRGF0YUxheWVyLnNhdmVDdXJyZW50U3RhdGVUb0RhdGFMYXllciBvbiBEYXRhTGF5ZXIgJHt0aGlzLm5hbWV9IHdpdGggbGVzcyB0aGFuIDIgYnVmZmVycy5gKTtcblx0XHR9XG5cdFx0aWYgKCF0aGlzLndyaXRhYmxlKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYENhbid0IGNhbGwgRGF0YUxheWVyLnNhdmVDdXJyZW50U3RhdGVUb0RhdGFMYXllciBvbiByZWFkLW9ubHkgRGF0YUxheWVyICR7dGhpcy5uYW1lfS5gKTtcblx0XHR9XG5cdFx0aWYgKGxheWVyLndyaXRhYmxlKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYENhbid0IGNhbGwgRGF0YUxheWVyLnNhdmVDdXJyZW50U3RhdGVUb0RhdGFMYXllciBvbiBEYXRhTGF5ZXIgJHt0aGlzLm5hbWV9IHVzaW5nIHdyaXRhYmxlIERhdGFMYXllciAke2xheWVyLm5hbWV9LmApXG5cdFx0fVxuXHRcdC8vIENoZWNrIHRoYXQgdGV4dHVyZSBwYXJhbXMgYXJlIHRoZSBzYW1lLlxuXHRcdGlmIChsYXllci5nbFdyYXBTICE9PSB0aGlzLmdsV3JhcFMgfHwgbGF5ZXIuZ2xXcmFwVCAhPT0gdGhpcy5nbFdyYXBUIHx8XG5cdFx0XHRsYXllci53cmFwUyAhPT0gdGhpcy53cmFwUyB8fCBsYXllci53cmFwVCAhPT0gdGhpcy53cmFwVCB8fFxuXHRcdFx0bGF5ZXIud2lkdGggIT09IHRoaXMud2lkdGggfHwgbGF5ZXIuaGVpZ2h0ICE9PSB0aGlzLmhlaWdodCB8fFxuXHRcdFx0bGF5ZXIuZ2xGaWx0ZXIgIT09IHRoaXMuZ2xGaWx0ZXIgfHwgbGF5ZXIuZmlsdGVyICE9PSB0aGlzLmZpbHRlciB8fFxuXHRcdFx0bGF5ZXIuZ2xOdW1DaGFubmVscyAhPT0gdGhpcy5nbE51bUNoYW5uZWxzIHx8IGxheWVyLm51bUNvbXBvbmVudHMgIT09IHRoaXMubnVtQ29tcG9uZW50cyB8fFxuXHRcdFx0bGF5ZXIuZ2xUeXBlICE9PSB0aGlzLmdsVHlwZSB8fCBsYXllci50eXBlICE9PSB0aGlzLnR5cGUgfHxcblx0XHRcdGxheWVyLmdsRm9ybWF0ICE9PSB0aGlzLmdsRm9ybWF0IHx8IGxheWVyLmdsSW50ZXJuYWxGb3JtYXQgIT09IHRoaXMuZ2xJbnRlcm5hbEZvcm1hdCkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEluY29tcGF0aWJsZSB0ZXh0dXJlIHBhcmFtcyBiZXR3ZWVuIERhdGFMYXllcnMgJHtsYXllci5uYW1lfSBhbmQgJHt0aGlzLm5hbWV9LmApO1xuXHRcdH1cblxuXHRcdC8vIElmIHdlIGhhdmUgbm90IGFscmVhZHkgaW5pdGVkIG92ZXJyaWRlcyBhcnJheSwgZG8gc28gbm93LlxuXHRcdGlmICghdGhpcy50ZXh0dXJlT3ZlcnJpZGVzKSB7XG5cdFx0XHR0aGlzLnRleHR1cmVPdmVycmlkZXMgPSBbXTtcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5udW1CdWZmZXJzOyBpKyspIHtcblx0XHRcdFx0dGhpcy50ZXh0dXJlT3ZlcnJpZGVzLnB1c2godW5kZWZpbmVkKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBDaGVjayBpZiB3ZSBhbHJlYWR5IGhhdmUgYW4gb3ZlcnJpZGUgaW4gcGxhY2UuXG5cdFx0aWYgKHRoaXMudGV4dHVyZU92ZXJyaWRlc1t0aGlzLl9idWZmZXJJbmRleF0pIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgQ2FuJ3QgY2FsbCBEYXRhTGF5ZXIuc2F2ZUN1cnJlbnRTdGF0ZVRvRGF0YUxheWVyIG9uIERhdGFMYXllciAke3RoaXMubmFtZX0sIHRoaXMgRGF0YUxheWVyIGhhcyBub3Qgd3JpdHRlbiBuZXcgc3RhdGUgc2luY2UgbGFzdCBjYWxsIHRvIERhdGFMYXllci5zYXZlQ3VycmVudFN0YXRlVG9EYXRhTGF5ZXIuYCk7XG5cdFx0fVxuXHRcdGNvbnN0IGN1cnJlbnRTdGF0ZSA9IHRoaXMuZ2V0Q3VycmVudFN0YXRlVGV4dHVyZSgpO1xuXHRcdHRoaXMudGV4dHVyZU92ZXJyaWRlc1t0aGlzLl9idWZmZXJJbmRleF0gPSBjdXJyZW50U3RhdGU7XG5cdFx0Ly8gU3dhcCB0ZXh0dXJlcy5cblx0XHR0aGlzLmJ1ZmZlcnNbdGhpcy5fYnVmZmVySW5kZXhdLnRleHR1cmUgPSBsYXllci5nZXRDdXJyZW50U3RhdGVUZXh0dXJlKCk7XG5cdFx0bGF5ZXIuX3NldEN1cnJlbnRTdGF0ZVRleHR1cmUoY3VycmVudFN0YXRlKTtcblxuXHRcdC8vIEJpbmQgc3dhcHBlZCB0ZXh0dXJlIHRvIGZyYW1lYnVmZmVyLlxuXHRcdGNvbnN0IHsgZ2wgfSA9IHRoaXM7XG5cdFx0Y29uc3QgeyBmcmFtZWJ1ZmZlciwgdGV4dHVyZSB9ID0gdGhpcy5idWZmZXJzW3RoaXMuX2J1ZmZlckluZGV4XTtcblx0XHRpZiAoIWZyYW1lYnVmZmVyKSB0aHJvdyBuZXcgRXJyb3IoYE5vIGZyYW1lYnVmZmVyIGZvciB3cml0YWJsZSBEYXRhTGF5ZXIgJHt0aGlzLm5hbWV9LmApO1xuXHRcdGdsLmJpbmRGcmFtZWJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgZnJhbWVidWZmZXIpO1xuXHRcdC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9XZWJHTFJlbmRlcmluZ0NvbnRleHQvZnJhbWVidWZmZXJUZXh0dXJlMkRcblx0XHRnbC5mcmFtZWJ1ZmZlclRleHR1cmUyRChnbC5GUkFNRUJVRkZFUiwgZ2wuQ09MT1JfQVRUQUNITUVOVDAsIGdsLlRFWFRVUkVfMkQsIHRleHR1cmUsIDApO1xuXHRcdC8vIFVuYmluZC5cblx0XHRnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIG51bGwpO1xuXHR9XG5cblx0X3NldEN1cnJlbnRTdGF0ZVRleHR1cmUodGV4dHVyZTogV2ViR0xUZXh0dXJlKSB7XG5cdFx0aWYgKHRoaXMud3JpdGFibGUpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgQ2FuJ3QgY2FsbCBEYXRhTGF5ZXIuX3NldEN1cnJlbnRTdGF0ZVRleHR1cmUgb24gd3JpdGFibGUgdGV4dHVyZSAke3RoaXMubmFtZX0uYCk7XG5cdFx0fVxuXHRcdHRoaXMuYnVmZmVyc1t0aGlzLl9idWZmZXJJbmRleF0udGV4dHVyZSA9IHRleHR1cmU7XG5cdH1cblxuXHRwcml2YXRlIHZhbGlkYXRlRGF0YUFycmF5KFxuXHRcdF9kYXRhPzogRGF0YUxheWVyQXJyYXlUeXBlLFxuXHQpIHtcblx0XHRpZiAoIV9kYXRhKXtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0Y29uc3QgeyB3aWR0aCwgaGVpZ2h0LCBsZW5ndGgsIG51bUNvbXBvbmVudHMsIGdsTnVtQ2hhbm5lbHMsIHR5cGUsIGludGVybmFsVHlwZSwgbmFtZSB9ID0gdGhpcztcblxuXHRcdC8vIENoZWNrIHRoYXQgZGF0YSBpcyBjb3JyZWN0IGxlbmd0aCAodXNlciBlcnJvcikuXG5cdFx0aWYgKChsZW5ndGggJiYgX2RhdGEubGVuZ3RoICE9PSBsZW5ndGggKiBudW1Db21wb25lbnRzKSB8fCAoIWxlbmd0aCAmJiBfZGF0YS5sZW5ndGggIT09IHdpZHRoICogaGVpZ2h0ICogbnVtQ29tcG9uZW50cykpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBkYXRhIGxlbmd0aCAke19kYXRhLmxlbmd0aH0gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIiBvZiBzaXplICR7bGVuZ3RoID8gbGVuZ3RoIDogYCR7d2lkdGh9eCR7aGVpZ2h0fWB9eCR7bnVtQ29tcG9uZW50c30uYCk7XG5cdFx0fVxuXG5cdFx0Ly8gQ2hlY2sgdGhhdCBkYXRhIGlzIGNvcnJlY3QgdHlwZSAodXNlciBlcnJvcikuXG5cdFx0bGV0IGludmFsaWRUeXBlRm91bmQgPSBmYWxzZTtcblx0XHRzd2l0Y2ggKHR5cGUpIHtcblx0XHRcdGNhc2UgSEFMRl9GTE9BVDpcblx0XHRcdFx0Ly8gU2luY2UgdGhlcmUgaXMgbm8gRmxvYXQxNkFycmF5LCB3ZSBtdXN0IHVzZSBGbG9hdDMyQXJyYXlzIHRvIGluaXQgdGV4dHVyZS5cblx0XHRcdFx0Ly8gQ29udGludWUgdG8gbmV4dCBjYXNlLlxuXHRcdFx0Y2FzZSBGTE9BVDpcblx0XHRcdFx0aW52YWxpZFR5cGVGb3VuZCA9IGludmFsaWRUeXBlRm91bmQgfHwgX2RhdGEuY29uc3RydWN0b3IgIT09IEZsb2F0MzJBcnJheTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFVOU0lHTkVEX0JZVEU6XG5cdFx0XHRcdGludmFsaWRUeXBlRm91bmQgPSBpbnZhbGlkVHlwZUZvdW5kIHx8IF9kYXRhLmNvbnN0cnVjdG9yICE9PSBVaW50OEFycmF5O1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgQllURTpcblx0XHRcdFx0aW52YWxpZFR5cGVGb3VuZCA9IGludmFsaWRUeXBlRm91bmQgfHwgX2RhdGEuY29uc3RydWN0b3IgIT09IEludDhBcnJheTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFVOU0lHTkVEX1NIT1JUOlxuXHRcdFx0XHRpbnZhbGlkVHlwZUZvdW5kID0gaW52YWxpZFR5cGVGb3VuZCB8fCBfZGF0YS5jb25zdHJ1Y3RvciAhPT0gVWludDE2QXJyYXk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBTSE9SVDpcblx0XHRcdFx0aW52YWxpZFR5cGVGb3VuZCA9IGludmFsaWRUeXBlRm91bmQgfHwgX2RhdGEuY29uc3RydWN0b3IgIT09IEludDE2QXJyYXk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBVTlNJR05FRF9JTlQ6XG5cdFx0XHRcdGludmFsaWRUeXBlRm91bmQgPSBpbnZhbGlkVHlwZUZvdW5kIHx8IF9kYXRhLmNvbnN0cnVjdG9yICE9PSBVaW50MzJBcnJheTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIElOVDpcblx0XHRcdFx0aW52YWxpZFR5cGVGb3VuZCA9IGludmFsaWRUeXBlRm91bmQgfHwgX2RhdGEuY29uc3RydWN0b3IgIT09IEludDMyQXJyYXk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBFcnJvciBpbml0aW5nIERhdGFMYXllciBcIiR7bmFtZX1cIi4gIFVuc3VwcG9ydGVkIHR5cGUgXCIke3R5cGV9XCIgZm9yIFdlYkdMQ29tcHV0ZS5pbml0RGF0YUxheWVyLmApO1xuXHRcdH1cblx0XHRpZiAoaW52YWxpZFR5cGVGb3VuZCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIFR5cGVkQXJyYXkgb2YgdHlwZSAkeyhfZGF0YS5jb25zdHJ1Y3RvciBhcyBhbnkpLm5hbWV9IHN1cHBsaWVkIHRvIERhdGFMYXllciBcIiR7bmFtZX1cIiBvZiB0eXBlIFwiJHt0eXBlfVwiLmApO1xuXHRcdH1cblxuXHRcdGxldCBkYXRhID0gX2RhdGE7XG5cdFx0Y29uc3QgaW1hZ2VTaXplID0gd2lkdGggKiBoZWlnaHQgKiBnbE51bUNoYW5uZWxzO1xuXHRcdC8vIFRoZW4gY2hlY2sgaWYgYXJyYXkgbmVlZHMgdG8gYmUgbGVuZ3RoZW5lZC5cblx0XHQvLyBUaGlzIGNvdWxkIGJlIGJlY2F1c2UgZ2xOdW1DaGFubmVscyAhPT0gbnVtQ29tcG9uZW50cy5cblx0XHQvLyBPciBiZWNhdXNlIGxlbmd0aCAhPT0gd2lkdGggKiBoZWlnaHQuXG5cdFx0Y29uc3QgaW5jb3JyZWN0U2l6ZSA9IGRhdGEubGVuZ3RoICE9PSBpbWFnZVNpemU7XG5cdFx0Ly8gV2UgaGF2ZSB0byBoYW5kbGUgdGhlIGNhc2Ugb2YgRmxvYXQxNiBzcGVjaWFsbHkgYnkgY29udmVydGluZyBkYXRhIHRvIFVpbnQxNkFycmF5LlxuXHRcdGNvbnN0IGhhbmRsZUZsb2F0MTYgPSBpbnRlcm5hbFR5cGUgPT09IEhBTEZfRkxPQVQ7XG5cdFx0Ly8gRm9yIHdlYmdsMS4wIHdlIG1heSBuZWVkIHRvIGNhc3QgYW4gaW50IHR5cGUgdG8gYSBGTE9BVCBvciBIQUxGX0ZMT0FULlxuXHRcdGNvbnN0IHNob3VsZFR5cGVDYXN0ID0gdHlwZSAhPT0gaW50ZXJuYWxUeXBlO1xuXG5cdFx0aWYgKHNob3VsZFR5cGVDYXN0IHx8IGluY29ycmVjdFNpemUgfHwgaGFuZGxlRmxvYXQxNikge1xuXHRcdFx0c3dpdGNoIChpbnRlcm5hbFR5cGUpIHtcblx0XHRcdFx0Y2FzZSBIQUxGX0ZMT0FUOlxuXHRcdFx0XHRcdGRhdGEgPSBuZXcgVWludDE2QXJyYXkoaW1hZ2VTaXplKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBGTE9BVDpcblx0XHRcdFx0XHRkYXRhID0gbmV3IEZsb2F0MzJBcnJheShpbWFnZVNpemUpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFVOU0lHTkVEX0JZVEU6XG5cdFx0XHRcdFx0ZGF0YSA9IG5ldyBVaW50OEFycmF5KGltYWdlU2l6ZSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgQllURTpcblx0XHRcdFx0XHRkYXRhID0gbmV3IEludDhBcnJheShpbWFnZVNpemUpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFVOU0lHTkVEX1NIT1JUOlxuXHRcdFx0XHRcdGRhdGEgPSBuZXcgVWludDE2QXJyYXkoaW1hZ2VTaXplKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBTSE9SVDpcblx0XHRcdFx0XHRkYXRhID0gbmV3IEludDE2QXJyYXkoaW1hZ2VTaXplKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBVTlNJR05FRF9JTlQ6XG5cdFx0XHRcdFx0ZGF0YSA9IG5ldyBVaW50MzJBcnJheShpbWFnZVNpemUpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIElOVDpcblx0XHRcdFx0XHRkYXRhID0gbmV3IEludDMyQXJyYXkoaW1hZ2VTaXplKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBFcnJvciBpbml0aW5nICR7bmFtZX0uICBVbnN1cHBvcnRlZCBpbnRlcm5hbFR5cGUgJHtpbnRlcm5hbFR5cGV9IGZvciBXZWJHTENvbXB1dGUuaW5pdERhdGFMYXllci5gKTtcblx0XHRcdH1cblx0XHRcdC8vIEZpbGwgbmV3IGRhdGEgYXJyYXkgd2l0aCBvbGQgZGF0YS5cblx0XHRcdGNvbnN0IHZpZXcgPSBoYW5kbGVGbG9hdDE2ID8gbmV3IERhdGFWaWV3KGRhdGEuYnVmZmVyKSA6IG51bGw7XG5cdFx0XHRmb3IgKGxldCBpID0gMCwgX2xlbiA9IF9kYXRhLmxlbmd0aCAvIG51bUNvbXBvbmVudHM7IGkgPCBfbGVuOyBpKyspIHtcblx0XHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCBudW1Db21wb25lbnRzOyBqKyspIHtcblx0XHRcdFx0XHRjb25zdCB2YWx1ZSA9IF9kYXRhW2kgKiBudW1Db21wb25lbnRzICsgal07XG5cdFx0XHRcdFx0Y29uc3QgaW5kZXggPSBpICogZ2xOdW1DaGFubmVscyArIGo7XG5cdFx0XHRcdFx0aWYgKGhhbmRsZUZsb2F0MTYpIHtcblx0XHRcdFx0XHRcdHNldEZsb2F0MTYodmlldyEsIDIgKiBpbmRleCwgdmFsdWUsIHRydWUpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRkYXRhW2luZGV4XSA9IHZhbHVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBkYXRhO1xuXHR9XG5cblx0cHJpdmF0ZSBpbml0QnVmZmVycyhcblx0XHRfZGF0YT86IERhdGFMYXllckFycmF5VHlwZSxcblx0KSB7XG5cdFx0Y29uc3Qge1xuXHRcdFx0bmFtZSxcblx0XHRcdG51bUJ1ZmZlcnMsXG5cdFx0XHRnbCxcblx0XHRcdHdpZHRoLFxuXHRcdFx0aGVpZ2h0LFxuXHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCxcblx0XHRcdGdsRm9ybWF0LFxuXHRcdFx0Z2xUeXBlLFxuXHRcdFx0Z2xGaWx0ZXIsXG5cdFx0XHRnbFdyYXBTLFxuXHRcdFx0Z2xXcmFwVCxcblx0XHRcdHdyaXRhYmxlLFxuXHRcdFx0ZXJyb3JDYWxsYmFjayxcblx0XHR9ID0gdGhpcztcblxuXHRcdHRoaXMuaW5pdGlhbGl6YXRpb25EYXRhID0gX2RhdGE7XG5cblx0XHRjb25zdCBkYXRhID0gdGhpcy52YWxpZGF0ZURhdGFBcnJheShfZGF0YSk7XG5cblx0XHQvLyBJbml0IGEgdGV4dHVyZSBmb3IgZWFjaCBidWZmZXIuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBudW1CdWZmZXJzOyBpKyspIHtcblx0XHRcdGNvbnN0IHRleHR1cmUgPSBnbC5jcmVhdGVUZXh0dXJlKCk7XG5cdFx0XHRpZiAoIXRleHR1cmUpIHtcblx0XHRcdFx0ZXJyb3JDYWxsYmFjayhgQ291bGQgbm90IGluaXQgdGV4dHVyZSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiOiAke2dsLmdldEVycm9yKCl9LmApO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCB0ZXh0dXJlKTtcblxuXHRcdFx0Ly8gVE9ETzogYXJlIHRoZXJlIG90aGVyIHBhcmFtcyB0byBsb29rIGludG86XG5cdFx0XHQvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvV2ViR0xSZW5kZXJpbmdDb250ZXh0L3RleFBhcmFtZXRlclxuXHRcdFx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfUywgZ2xXcmFwUyk7XG5cdFx0XHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9ULCBnbFdyYXBUKTtcblx0XHRcdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBnbEZpbHRlcik7XG5cdFx0XHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgZ2xGaWx0ZXIpO1xuXG5cdFx0XHRnbC50ZXhJbWFnZTJEKGdsLlRFWFRVUkVfMkQsIDAsIGdsSW50ZXJuYWxGb3JtYXQsIHdpZHRoLCBoZWlnaHQsIDAsIGdsRm9ybWF0LCBnbFR5cGUsIGRhdGEgPyBkYXRhIDogbnVsbCk7XG5cdFx0XHRcblx0XHRcdGNvbnN0IGJ1ZmZlcjogRGF0YUxheWVyQnVmZmVyID0ge1xuXHRcdFx0XHR0ZXh0dXJlLFxuXHRcdFx0fTtcblxuXHRcdFx0aWYgKHdyaXRhYmxlKSB7XG5cdFx0XHRcdC8vIEluaXQgYSBmcmFtZWJ1ZmZlciBmb3IgdGhpcyB0ZXh0dXJlIHNvIHdlIGNhbiB3cml0ZSB0byBpdC5cblx0XHRcdFx0Y29uc3QgZnJhbWVidWZmZXIgPSBnbC5jcmVhdGVGcmFtZWJ1ZmZlcigpO1xuXHRcdFx0XHRpZiAoIWZyYW1lYnVmZmVyKSB7XG5cdFx0XHRcdFx0ZXJyb3JDYWxsYmFjayhgQ291bGQgbm90IGluaXQgZnJhbWVidWZmZXIgZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIjogJHtnbC5nZXRFcnJvcigpfS5gKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0Z2wuYmluZEZyYW1lYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBmcmFtZWJ1ZmZlcik7XG5cdFx0XHRcdC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9XZWJHTFJlbmRlcmluZ0NvbnRleHQvZnJhbWVidWZmZXJUZXh0dXJlMkRcblx0XHRcdFx0Z2wuZnJhbWVidWZmZXJUZXh0dXJlMkQoZ2wuRlJBTUVCVUZGRVIsIGdsLkNPTE9SX0FUVEFDSE1FTlQwLCBnbC5URVhUVVJFXzJELCB0ZXh0dXJlLCAwKTtcblxuXHRcdFx0XHRjb25zdCBzdGF0dXMgPSBnbC5jaGVja0ZyYW1lYnVmZmVyU3RhdHVzKGdsLkZSQU1FQlVGRkVSKTtcblx0XHRcdFx0aWYoc3RhdHVzICE9IGdsLkZSQU1FQlVGRkVSX0NPTVBMRVRFKXtcblx0XHRcdFx0XHRlcnJvckNhbGxiYWNrKGBJbnZhbGlkIHN0YXR1cyBmb3IgZnJhbWVidWZmZXIgZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIjogJHtzdGF0dXN9LmApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gQWRkIGZyYW1lYnVmZmVyLlxuXHRcdFx0XHRidWZmZXIuZnJhbWVidWZmZXIgPSBmcmFtZWJ1ZmZlcjtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0Ly8gU2F2ZSB0aGlzIGJ1ZmZlciB0byB0aGUgbGlzdC5cblx0XHRcdHRoaXMuYnVmZmVycy5wdXNoKGJ1ZmZlcik7XG5cdFx0fVxuXHRcdC8vIFVuYmluZC5cblx0XHRnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIG51bGwpO1xuXHR9XG5cblx0Z2V0Q3VycmVudFN0YXRlVGV4dHVyZSgpIHtcblx0XHRpZiAodGhpcy50ZXh0dXJlT3ZlcnJpZGVzICYmIHRoaXMudGV4dHVyZU92ZXJyaWRlc1t0aGlzLl9idWZmZXJJbmRleF0pIHJldHVybiB0aGlzLnRleHR1cmVPdmVycmlkZXNbdGhpcy5fYnVmZmVySW5kZXhdITtcblx0XHRyZXR1cm4gdGhpcy5idWZmZXJzW3RoaXMuX2J1ZmZlckluZGV4XS50ZXh0dXJlO1xuXHR9XG5cblx0Z2V0UHJldmlvdXNTdGF0ZVRleHR1cmUoaW5kZXggPSAtMSkge1xuXHRcdGlmICh0aGlzLm51bUJ1ZmZlcnMgPT09IDEpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGNhbGwgZ2V0UHJldmlvdXNTdGF0ZVRleHR1cmUgb24gRGF0YUxheWVyIFwiJHt0aGlzLm5hbWV9XCIgd2l0aCBvbmx5IG9uZSBidWZmZXIuYCk7XG5cdFx0fVxuXHRcdGNvbnN0IHByZXZpb3VzSW5kZXggPSB0aGlzLl9idWZmZXJJbmRleCArIGluZGV4ICsgdGhpcy5udW1CdWZmZXJzO1xuXHRcdGlmIChwcmV2aW91c0luZGV4IDwgMCB8fCBwcmV2aW91c0luZGV4ID49IHRoaXMubnVtQnVmZmVycykge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGluZGV4ICR7aW5kZXh9IHBhc3NlZCB0byBnZXRQcmV2aW91c1N0YXRlVGV4dHVyZSBvbiBEYXRhTGF5ZXIgJHt0aGlzLm5hbWV9IHdpdGggJHt0aGlzLm51bUJ1ZmZlcnN9IGJ1ZmZlcnMuYCk7XG5cdFx0fVxuXHRcdGlmICh0aGlzLnRleHR1cmVPdmVycmlkZXMgJiYgdGhpcy50ZXh0dXJlT3ZlcnJpZGVzW3ByZXZpb3VzSW5kZXhdKSByZXR1cm4gdGhpcy50ZXh0dXJlT3ZlcnJpZGVzW3ByZXZpb3VzSW5kZXhdITtcblx0XHRyZXR1cm4gdGhpcy5idWZmZXJzW3ByZXZpb3VzSW5kZXhdLnRleHR1cmU7XG5cdH1cblxuXHRfdXNpbmdUZXh0dXJlT3ZlcnJpZGVGb3JDdXJyZW50QnVmZmVyKCkge1xuXHRcdHJldHVybiB0aGlzLnRleHR1cmVPdmVycmlkZXMgJiYgdGhpcy50ZXh0dXJlT3ZlcnJpZGVzW3RoaXMuYnVmZmVySW5kZXhdO1xuXHR9XG5cblx0X2JpbmRPdXRwdXRCdWZmZXJGb3JXcml0ZShcblx0XHRpbmNyZW1lbnRCdWZmZXJJbmRleDogYm9vbGVhbixcblx0KSB7XG5cdFx0Y29uc3QgeyBnbCB9ID0gdGhpcztcblx0XHRpZiAoaW5jcmVtZW50QnVmZmVySW5kZXgpIHtcblx0XHRcdC8vIEluY3JlbWVudCBidWZmZXJJbmRleC5cblx0XHRcdHRoaXMuX2J1ZmZlckluZGV4ID0gKHRoaXMuX2J1ZmZlckluZGV4ICsgMSkgJSB0aGlzLm51bUJ1ZmZlcnM7XG5cdFx0fVxuXHRcdHRoaXMuX2JpbmRPdXRwdXRCdWZmZXIoKTtcblxuXHRcdC8vIFdlIGFyZSBnb2luZyB0byBkbyBhIGRhdGEgd3JpdGUsIGlmIHdlIGhhdmUgb3ZlcnJpZGVzIGVuYWJsZWQsIHdlIGNhbiByZW1vdmUgdGhlbS5cblx0XHRpZiAodGhpcy50ZXh0dXJlT3ZlcnJpZGVzKSB7XG5cdFx0XHR0aGlzLnRleHR1cmVPdmVycmlkZXNbdGhpcy5fYnVmZmVySW5kZXhdID0gdW5kZWZpbmVkO1xuXHRcdH1cblx0fVxuXG5cdF9iaW5kT3V0cHV0QnVmZmVyKCkge1xuXHRcdGNvbnN0IHsgZ2wgfSA9IHRoaXM7XG5cdFx0Y29uc3QgeyBmcmFtZWJ1ZmZlciB9ID0gdGhpcy5idWZmZXJzW3RoaXMuX2J1ZmZlckluZGV4XTtcblx0XHRpZiAoIWZyYW1lYnVmZmVyKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYERhdGFMYXllciBcIiR7dGhpcy5uYW1lfVwiIGlzIG5vdCB3cml0YWJsZS5gKTtcblx0XHR9XG5cdFx0Z2wuYmluZEZyYW1lYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBmcmFtZWJ1ZmZlcik7XG5cdH1cblxuXHRzZXREYXRhKGRhdGE6IERhdGFMYXllckFycmF5VHlwZSkge1xuXHRcdC8vIFRPRE86IFJhdGhlciB0aGFuIGRlc3Ryb3lpbmcgYnVmZmVycywgd2UgY291bGQgd3JpdGUgdG8gY2VydGFpbiB3aW5kb3cuXG5cdFx0dGhpcy5kZXN0cm95QnVmZmVycygpO1xuXHRcdHRoaXMuaW5pdEJ1ZmZlcnMoZGF0YSk7XG5cdH1cblxuXHRyZXNpemUoXG5cdFx0ZGltZW5zaW9uczogbnVtYmVyIHwgW251bWJlciwgbnVtYmVyXSxcblx0XHRkYXRhPzogRGF0YUxheWVyQXJyYXlUeXBlLFxuXHQpIHtcblx0XHRjb25zdCB7IGxlbmd0aCwgd2lkdGgsIGhlaWdodCB9ID0gRGF0YUxheWVyLmNhbGNTaXplKGRpbWVuc2lvbnMsIHRoaXMubmFtZSk7XG5cdFx0dGhpcy5sZW5ndGggPSBsZW5ndGg7XG5cdFx0dGhpcy53aWR0aCA9IHdpZHRoO1xuXHRcdHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuXHRcdHRoaXMuZGVzdHJveUJ1ZmZlcnMoKTtcblx0XHR0aGlzLmluaXRCdWZmZXJzKGRhdGEpO1xuXHR9XG5cblx0Y2xlYXIoKSB7XG5cdFx0Ly8gUmVzZXQgZXZlcnl0aGluZyB0byB6ZXJvLlxuXHRcdC8vIFRPRE86IFRoaXMgaXMgbm90IHRoZSBtb3N0IGVmZmljaWVudCB3YXkgdG8gZG8gdGhpcyAocmVhbGxvY2F0aW5nIGFsbCB0ZXh0dXJlcyBhbmQgZnJhbWVidWZmZXJzKSwgYnV0IG9rIGZvciBub3cuXG5cdFx0dGhpcy5kZXN0cm95QnVmZmVycygpO1xuXHRcdHRoaXMuaW5pdEJ1ZmZlcnMoKTtcblx0fVxuXG5cdGdldERpbWVuc2lvbnMoKSB7XG5cdFx0cmV0dXJuIFtcblx0XHRcdHRoaXMud2lkdGgsXG5cdFx0XHR0aGlzLmhlaWdodCxcblx0XHRdIGFzIFtudW1iZXIsIG51bWJlcl07XG5cdH1cblxuXHRnZXRMZW5ndGgoKSB7XG5cdFx0aWYgKCF0aGlzLmxlbmd0aCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgY2FsbCBnZXRMZW5ndGgoKSBvbiAyRCBEYXRhTGF5ZXIgXCIke3RoaXMubmFtZX1cIi5gKTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMubGVuZ3RoO1xuXHR9XG5cblx0cHJpdmF0ZSBkZXN0cm95QnVmZmVycygpIHtcblx0XHRjb25zdCB7IGdsLCBidWZmZXJzIH0gPSB0aGlzO1xuXHRcdGJ1ZmZlcnMuZm9yRWFjaChidWZmZXIgPT4ge1xuXHRcdFx0Y29uc3QgeyBmcmFtZWJ1ZmZlciwgdGV4dHVyZSB9ID0gYnVmZmVyO1xuXHRcdFx0Z2wuZGVsZXRlVGV4dHVyZSh0ZXh0dXJlKTtcblx0XHRcdGlmIChmcmFtZWJ1ZmZlcikge1xuXHRcdFx0XHRnbC5kZWxldGVGcmFtZWJ1ZmZlcihmcmFtZWJ1ZmZlcik7XG5cdFx0XHR9XG5cdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRkZWxldGUgYnVmZmVyLnRleHR1cmU7XG5cdFx0XHRkZWxldGUgYnVmZmVyLmZyYW1lYnVmZmVyO1xuXHRcdH0pO1xuXHRcdGJ1ZmZlcnMubGVuZ3RoID0gMDtcblxuXHRcdC8vIFRoZXNlIGFyZSB0ZWNobmljYWxseSBvd25lZCBieSBhbm90aGVyIERhdGFMYXllcixcblx0XHQvLyBzbyB3ZSBhcmUgbm90IHJlc3BvbnNpYmxlIGZvciBkZWxldGluZyB0aGVtIGZyb20gZ2wgY29udGV4dC5cblx0XHRkZWxldGUgdGhpcy50ZXh0dXJlT3ZlcnJpZGVzO1xuXHR9XG5cblx0ZGVzdHJveSgpIHtcblx0XHR0aGlzLmRlc3Ryb3lCdWZmZXJzKCk7XG5cdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdGRlbGV0ZSB0aGlzLmdsO1xuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHRkZWxldGUgdGhpcy5lcnJvckNhbGxiYWNrO1xuXHR9XG5cblx0Y2xvbmUoKSB7XG5cdFx0Ly8gTWFrZSBhIGRlZXAgY29weS5cblx0XHRcblx0fVxufVxuIiwiaW1wb3J0IHsgaXNBcnJheSwgaXNJbnRlZ2VyLCBpc051bWJlciwgaXNTdHJpbmcgfSBmcm9tICcuL0NoZWNrcyc7XG5pbXBvcnQge1xuXHRGTE9BVCxcblx0RkxPQVRfMURfVU5JRk9STSwgRkxPQVRfMkRfVU5JRk9STSwgRkxPQVRfM0RfVU5JRk9STSwgRkxPQVRfNERfVU5JRk9STSxcblx0R0xTTDMsXG5cdEdMU0xWZXJzaW9uLFxuXHRJTlQsXG5cdElOVF8xRF9VTklGT1JNLCBJTlRfMkRfVU5JRk9STSwgSU5UXzNEX1VOSUZPUk0sIElOVF80RF9VTklGT1JNLFxuXHRVbmlmb3JtLCBVbmlmb3JtRGF0YVR5cGUsIFVuaWZvcm1UeXBlLCBVbmlmb3JtVmFsdWVUeXBlLFxufSBmcm9tICcuL0NvbnN0YW50cyc7XG5pbXBvcnQgeyBjb21waWxlU2hhZGVyIH0gZnJvbSAnLi91dGlscyc7XG5cbmNvbnN0IERFRkFVTFRfUFJPR1JBTV9OQU1FID0gJ0RFRkFVTFQnO1xuY29uc3QgREVGQVVMVF9XX1VWX1BST0dSQU1fTkFNRSA9ICdERUZBVUxUX1dfVVYnO1xuY29uc3QgREVGQVVMVF9XX05PUk1BTF9QUk9HUkFNX05BTUUgPSAnREVGQVVMVF9XX05PUk1BTCc7XG5jb25zdCBERUZBVUxUX1dfVVZfTk9STUFMX1BST0dSQU1fTkFNRSA9ICdERUZBVUxUX1dfVVZfTk9STUFMJztcbmNvbnN0IFNFR01FTlRfUFJPR1JBTV9OQU1FID0gJ1NFR01FTlQnO1xuY29uc3QgREFUQV9MQVlFUl9QT0lOVFNfUFJPR1JBTV9OQU1FID0gJ0RBVEFfTEFZRVJfUE9JTlRTJztcbmNvbnN0IERBVEFfTEFZRVJfTElORVNfUFJPR1JBTV9OQU1FID0gJ0RBVEFfTEFZRVJfTElORVMnO1xuY29uc3QgREFUQV9MQVlFUl9WRUNUT1JfRklFTERfUFJPR1JBTV9OQU1FID0gJ0RBVEFfTEFZRVJfVkVDVE9SX0ZJRUxEJztcbnR5cGUgUFJPR1JBTV9OQU1FUyA9XG5cdHR5cGVvZiBERUZBVUxUX1BST0dSQU1fTkFNRSB8XG5cdHR5cGVvZiBERUZBVUxUX1dfVVZfUFJPR1JBTV9OQU1FIHxcblx0dHlwZW9mIERFRkFVTFRfV19OT1JNQUxfUFJPR1JBTV9OQU1FIHxcblx0dHlwZW9mIERFRkFVTFRfV19VVl9OT1JNQUxfUFJPR1JBTV9OQU1FIHxcblx0dHlwZW9mIFNFR01FTlRfUFJPR1JBTV9OQU1FIHxcblx0dHlwZW9mIERBVEFfTEFZRVJfUE9JTlRTX1BST0dSQU1fTkFNRSB8XG5cdHR5cGVvZiBEQVRBX0xBWUVSX0xJTkVTX1BST0dSQU1fTkFNRSB8XG5cdHR5cGVvZiBEQVRBX0xBWUVSX1ZFQ1RPUl9GSUVMRF9QUk9HUkFNX05BTUU7XG5cbmNvbnN0IHZlcnRleFNoYWRlcnM6IHtba2V5IGluIFBST0dSQU1fTkFNRVNdOiB7XG5cdHNyY18xOiBzdHJpbmcsXG5cdHNyY18zOiBzdHJpbmcsXG5cdHNoYWRlcj86IFdlYkdMUHJvZ3JhbSxcblx0ZGVmaW5lcz86IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9LFxufX0gPSB7XG5cdFtERUZBVUxUX1BST0dSQU1fTkFNRV06IHtcblx0XHRzcmNfMTogcmVxdWlyZSgnLi9nbHNsXzEvRGVmYXVsdFZlcnRleFNoYWRlci5nbHNsJyksXG5cdFx0c3JjXzM6ICcnLFxuXHR9LFxuXHRbREVGQVVMVF9XX1VWX1BST0dSQU1fTkFNRV06IHtcblx0XHRzcmNfMTogcmVxdWlyZSgnLi9nbHNsXzEvRGVmYXVsdFZlcnRleFNoYWRlci5nbHNsJyksXG5cdFx0c3JjXzM6ICcnLFxuXHRcdGRlZmluZXM6IHtcblx0XHRcdCdVVl9BVFRSSUJVVEUnOiAnMScsXG5cdFx0fSxcblx0fSxcblx0W0RFRkFVTFRfV19OT1JNQUxfUFJPR1JBTV9OQU1FXToge1xuXHRcdHNyY18xOiByZXF1aXJlKCcuL2dsc2xfMS9EZWZhdWx0VmVydGV4U2hhZGVyLmdsc2wnKSxcblx0XHRzcmNfMzogJycsXG5cdFx0ZGVmaW5lczoge1xuXHRcdFx0J05PUk1BTF9BVFRSSUJVVEUnOiAnMScsXG5cdFx0fSxcblx0fSxcblx0W0RFRkFVTFRfV19VVl9OT1JNQUxfUFJPR1JBTV9OQU1FXToge1xuXHRcdHNyY18xOiByZXF1aXJlKCcuL2dsc2xfMS9EZWZhdWx0VmVydGV4U2hhZGVyLmdsc2wnKSxcblx0XHRzcmNfMzogJycsXG5cdFx0ZGVmaW5lczoge1xuXHRcdFx0J1VWX0FUVFJJQlVURSc6ICcxJyxcblx0XHRcdCdOT1JNQUxfQVRUUklCVVRFJzogJzEnLFxuXHRcdH0sXG5cdH0sXG5cdFtTRUdNRU5UX1BST0dSQU1fTkFNRV06IHtcblx0XHRzcmNfMTogcmVxdWlyZSgnLi9nbHNsXzEvU2VnbWVudFZlcnRleFNoYWRlci5nbHNsJyksXG5cdFx0c3JjXzM6ICcnLFxuXHR9LFxuXHRbREFUQV9MQVlFUl9QT0lOVFNfUFJPR1JBTV9OQU1FXToge1xuXHRcdHNyY18xOiByZXF1aXJlKCcuL2dsc2xfMS9EYXRhTGF5ZXJQb2ludHNWZXJ0ZXhTaGFkZXIuZ2xzbCcpLFxuXHRcdHNyY18zOiAnJyxcblx0fSxcblx0W0RBVEFfTEFZRVJfVkVDVE9SX0ZJRUxEX1BST0dSQU1fTkFNRV06IHtcblx0XHRzcmNfMTogcmVxdWlyZSgnLi9nbHNsXzEvRGF0YUxheWVyVmVjdG9yRmllbGRWZXJ0ZXhTaGFkZXIuZ2xzbCcpLFxuXHRcdHNyY18zOiAnJyxcblx0fSxcblx0W0RBVEFfTEFZRVJfTElORVNfUFJPR1JBTV9OQU1FXToge1xuXHRcdHNyY18xOiByZXF1aXJlKCcuL2dsc2xfMS9EYXRhTGF5ZXJMaW5lc1ZlcnRleFNoYWRlci5nbHNsJyksXG5cdFx0c3JjXzM6ICcnLFxuXHR9LFxufTtcblxuZXhwb3J0IGNsYXNzIEdQVVByb2dyYW0ge1xuXHRyZWFkb25seSBuYW1lOiBzdHJpbmc7XG5cdHByaXZhdGUgcmVhZG9ubHkgZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCB8IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQ7XG5cdHByaXZhdGUgcmVhZG9ubHkgZXJyb3JDYWxsYmFjazogKG1lc3NhZ2U6IHN0cmluZykgPT4gdm9pZDtcblx0cHJpdmF0ZSByZWFkb25seSBnbHNsVmVyc2lvbjogR0xTTFZlcnNpb247XG5cdHByaXZhdGUgcmVhZG9ubHkgdW5pZm9ybXM6IHsgWyBrZXk6IHN0cmluZ106IFVuaWZvcm0gfSA9IHt9O1xuXHRwcml2YXRlIHJlYWRvbmx5IGZyYWdtZW50U2hhZGVyITogV2ViR0xTaGFkZXI7XG5cdC8vIFN0b3JlIGdsIHByb2dyYW1zLlxuXHRwcml2YXRlIHByb2dyYW1zOiB7W2tleSBpbiBQUk9HUkFNX05BTUVTXT86IFdlYkdMUHJvZ3JhbSB9ID0ge307XG5cblx0Y29uc3RydWN0b3IoXG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0IHwgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCxcblx0XHRcdG5hbWU6IHN0cmluZyxcblx0XHRcdGZyYWdtZW50U2hhZGVyOiBzdHJpbmcgfCBzdHJpbmdbXSB8IFdlYkdMU2hhZGVyLC8vIFdlIG1heSB3YW50IHRvIHBhc3MgaW4gYW4gYXJyYXkgb2Ygc2hhZGVyIHN0cmluZyBzb3VyY2VzLCBpZiBzcGxpdCBhY3Jvc3Mgc2V2ZXJhbCBmaWxlcy5cblx0XHRcdGVycm9yQ2FsbGJhY2s6IChtZXNzYWdlOiBzdHJpbmcpID0+IHZvaWQsXG5cdFx0XHRnbHNsVmVyc2lvbjogR0xTTFZlcnNpb24sXG5cdFx0XHR1bmlmb3Jtcz86IHtcblx0XHRcdFx0bmFtZTogc3RyaW5nLFxuXHRcdFx0XHR2YWx1ZTogVW5pZm9ybVZhbHVlVHlwZSxcblx0XHRcdFx0ZGF0YVR5cGU6IFVuaWZvcm1EYXRhVHlwZSxcblx0XHRcdH1bXSxcblx0XHRcdGRlZmluZXM/OiB7Ly8gV2UnbGwgYWxsb3cgc29tZSB2YXJpYWJsZXMgdG8gYmUgcGFzc2VkIGluIGFzICNkZWZpbmUgdG8gdGhlIHByZXByb2Nlc3NvciBmb3IgdGhlIGZyYWdtZW50IHNoYWRlci5cblx0XHRcdFx0W2tleTogc3RyaW5nXTogc3RyaW5nLCAvLyBXZSdsbCBkbyB0aGVzZSBhcyBzdHJpbmdzIHRvIG1ha2UgaXQgZWFzaWVyIHRvIGNvbnRyb2wgZmxvYXQgdnMgaW50LlxuXHRcdFx0fSxcblx0XHR9LFxuXHRcdFxuXHQpIHtcblx0XHRjb25zdCB7IGdsLCBlcnJvckNhbGxiYWNrLCBuYW1lLCBmcmFnbWVudFNoYWRlciwgZ2xzbFZlcnNpb24sIHVuaWZvcm1zLCBkZWZpbmVzIH0gPSBwYXJhbXM7XG5cblx0XHQvLyBTYXZlIGFyZ3VtZW50cy5cblx0XHR0aGlzLmdsID0gZ2w7XG5cdFx0dGhpcy5lcnJvckNhbGxiYWNrID0gZXJyb3JDYWxsYmFjaztcblx0XHR0aGlzLm5hbWUgPSBuYW1lO1xuXHRcdHRoaXMuZ2xzbFZlcnNpb24gPSBnbHNsVmVyc2lvbjtcblxuXHRcdC8vIENvbXBpbGUgZnJhZ21lbnQgc2hhZGVyLlxuXHRcdGlmICh0eXBlb2YoZnJhZ21lbnRTaGFkZXIpID09PSAnc3RyaW5nJyB8fCB0eXBlb2YoKGZyYWdtZW50U2hhZGVyIGFzIHN0cmluZ1tdKVswXSkgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRsZXQgc291cmNlU3RyaW5nID0gdHlwZW9mKGZyYWdtZW50U2hhZGVyKSA9PT0gJ3N0cmluZycgP1xuXHRcdFx0XHRmcmFnbWVudFNoYWRlciA6XG5cdFx0XHRcdChmcmFnbWVudFNoYWRlciBhcyBzdHJpbmdbXSkuam9pbignXFxuJyk7XG5cdFx0XHRpZiAoZGVmaW5lcykge1xuXHRcdFx0XHRzb3VyY2VTdHJpbmcgPSBHUFVQcm9ncmFtLmNvbnZlcnREZWZpbmVzVG9TdHJpbmcoZGVmaW5lcykgKyBzb3VyY2VTdHJpbmc7XG5cdFx0XHR9XG5cdFx0XHRjb25zdCBzaGFkZXIgPSBjb21waWxlU2hhZGVyKGdsLCBlcnJvckNhbGxiYWNrLCBzb3VyY2VTdHJpbmcsIGdsLkZSQUdNRU5UX1NIQURFUiwgbmFtZSk7XG5cdFx0XHRpZiAoIXNoYWRlcikge1xuXHRcdFx0XHRlcnJvckNhbGxiYWNrKGBVbmFibGUgdG8gY29tcGlsZSBmcmFnbWVudCBzaGFkZXIgZm9yIHByb2dyYW0gXCIke25hbWV9XCIuYCk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdHRoaXMuZnJhZ21lbnRTaGFkZXIgPSBzaGFkZXI7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmIChkZWZpbmVzKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIGF0dGFjaCBkZWZpbmVzIHRvIHByb2dyYW0gXCIke25hbWV9XCIgYmVjYXVzZSBmcmFnbWVudCBzaGFkZXIgaXMgYWxyZWFkeSBjb21waWxlZC5gKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAodW5pZm9ybXMpIHtcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdW5pZm9ybXM/Lmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGNvbnN0IHsgbmFtZSwgdmFsdWUsIGRhdGFUeXBlIH0gPSB1bmlmb3Jtc1tpXTtcblx0XHRcdFx0dGhpcy5zZXRVbmlmb3JtKG5hbWUsIHZhbHVlLCBkYXRhVHlwZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBzdGF0aWMgY29udmVydERlZmluZXNUb1N0cmluZyhkZWZpbmVzOiB7W2tleTogc3RyaW5nXTogc3RyaW5nfSkge1xuXHRcdGxldCBkZWZpbmVzU291cmNlID0gJyc7XG5cdFx0Y29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGRlZmluZXMpO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0Y29uc3Qga2V5ID0ga2V5c1tpXTtcblx0XHRcdC8vIENoZWNrIHRoYXQgZGVmaW5lIGlzIHBhc3NlZCBpbiBhcyBhIHN0cmluZy5cblx0XHRcdGlmICghaXNTdHJpbmcoa2V5KSB8fCAhaXNTdHJpbmcoZGVmaW5lc1trZXldKSkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEdQVVByb2dyYW0gZGVmaW5lcyBtdXN0IGJlIHBhc3NlZCBpbiBhcyBrZXkgdmFsdWUgcGFpcnMgdGhhdCBhcmUgYm90aCBzdHJpbmdzLCBnb3Qga2V5IHZhbHVlIHBhaXIgb2YgdHlwZSAke3R5cGVvZiBrZXl9IDogJHt0eXBlb2YgZGVmaW5lc1trZXldfS5gKVxuXHRcdFx0fVxuXHRcdFx0ZGVmaW5lc1NvdXJjZSArPSBgI2RlZmluZSAke2tleX0gJHtkZWZpbmVzW2tleV19XFxuYDtcblx0XHR9XG5cdFx0cmV0dXJuIGRlZmluZXNTb3VyY2U7XG5cdH1cblxuXHRwcml2YXRlIGluaXRQcm9ncmFtKHZlcnRleFNoYWRlcjogV2ViR0xTaGFkZXIsIHByb2dyYW1OYW1lOiBzdHJpbmcpIHtcblx0XHRjb25zdCB7IGdsLCBmcmFnbWVudFNoYWRlciwgZXJyb3JDYWxsYmFjaywgdW5pZm9ybXMgfSA9IHRoaXM7XG5cdFx0Ly8gQ3JlYXRlIGEgcHJvZ3JhbS5cblx0XHRjb25zdCBwcm9ncmFtID0gZ2wuY3JlYXRlUHJvZ3JhbSgpO1xuXHRcdGlmICghcHJvZ3JhbSkge1xuXHRcdFx0ZXJyb3JDYWxsYmFjayhgVW5hYmxlIHRvIGluaXQgZ2wgcHJvZ3JhbTogJHtuYW1lfS5gKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0Ly8gVE9ETzogY2hlY2sgdGhhdCBhdHRhY2hTaGFkZXIgd29ya2VkLlxuXHRcdGdsLmF0dGFjaFNoYWRlcihwcm9ncmFtLCBmcmFnbWVudFNoYWRlcik7XG5cdFx0Z2wuYXR0YWNoU2hhZGVyKHByb2dyYW0sIHZlcnRleFNoYWRlcik7XG5cdFx0Ly8gTGluayB0aGUgcHJvZ3JhbS5cblx0XHRnbC5saW5rUHJvZ3JhbShwcm9ncmFtKTtcblx0XHQvLyBDaGVjayBpZiBpdCBsaW5rZWQuXG5cdFx0Y29uc3Qgc3VjY2VzcyA9IGdsLmdldFByb2dyYW1QYXJhbWV0ZXIocHJvZ3JhbSwgZ2wuTElOS19TVEFUVVMpO1xuXHRcdGlmICghc3VjY2Vzcykge1xuXHRcdFx0Ly8gU29tZXRoaW5nIHdlbnQgd3Jvbmcgd2l0aCB0aGUgbGluay5cblx0XHRcdGVycm9yQ2FsbGJhY2soYFByb2dyYW0gXCIke25hbWV9XCIgZmFpbGVkIHRvIGxpbms6ICR7Z2wuZ2V0UHJvZ3JhbUluZm9Mb2cocHJvZ3JhbSl9YCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdC8vIElmIHdlIGhhdmUgYW55IHVuaWZvcm1zIHNldCBmb3IgdGhpcyBHUFVQcm9ncmFtLCBhZGQgdGhvc2UgdG8gV2ViR0xQcm9ncmFtIHdlIGp1c3QgaW5pdGVkLlxuXHRcdGNvbnN0IHVuaWZvcm1OYW1lcyA9IE9iamVjdC5rZXlzKHVuaWZvcm1zKTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHVuaWZvcm1OYW1lcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0Y29uc3QgdW5pZm9ybU5hbWUgPSB1bmlmb3JtTmFtZXNbaV07XG5cdFx0XHRjb25zdCB1bmlmb3JtID0gdW5pZm9ybXNbdW5pZm9ybU5hbWVdO1xuXHRcdFx0Y29uc3QgeyB2YWx1ZSwgdHlwZSB9ID0gdW5pZm9ybTtcblx0XHRcdHRoaXMuc2V0UHJvZ3JhbVVuaWZvcm0ocHJvZ3JhbSwgcHJvZ3JhbU5hbWUsIHVuaWZvcm1OYW1lLCB2YWx1ZSwgdHlwZSk7XG5cdFx0fVxuXHRcdHJldHVybiBwcm9ncmFtO1xuXHR9XG5cblx0cHJpdmF0ZSBnZXRQcm9ncmFtV2l0aE5hbWUobmFtZTogUFJPR1JBTV9OQU1FUykge1xuXHRcdGlmICh0aGlzLnByb2dyYW1zW25hbWVdKSByZXR1cm4gdGhpcy5wcm9ncmFtc1tuYW1lXTtcblx0XHRjb25zdCB7IGVycm9yQ2FsbGJhY2sgfSA9IHRoaXM7XG5cdFx0Y29uc3QgdmVydGV4U2hhZGVyID0gdmVydGV4U2hhZGVyc1tuYW1lXTtcblx0XHRpZiAodmVydGV4U2hhZGVyLnNoYWRlciA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRjb25zdCB7IGdsLCBuYW1lLCBnbHNsVmVyc2lvbiB9ID0gdGhpcztcblx0XHRcdC8vIEluaXQgYSB2ZXJ0ZXggc2hhZGVyLlxuXHRcdFx0bGV0IHZlcnRleFNoYWRlclNvdXJjZSA9IGdsc2xWZXJzaW9uID09PSBHTFNMMyA/IHZlcnRleFNoYWRlci5zcmNfMyA6IHZlcnRleFNoYWRlci5zcmNfMTtcblx0XHRcdGlmICh2ZXJ0ZXhTaGFkZXJTb3VyY2UgPT09ICcnKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgTm8gc291cmNlIGZvciB2ZXJ0ZXggc2hhZGVyICR7dGhpcy5uYW1lfSA6ICR7bmFtZX1gKVxuXHRcdFx0fVxuXHRcdFx0aWYgKHZlcnRleFNoYWRlci5kZWZpbmVzKSB7XG5cdFx0XHRcdHZlcnRleFNoYWRlclNvdXJjZSA9IEdQVVByb2dyYW0uY29udmVydERlZmluZXNUb1N0cmluZyh2ZXJ0ZXhTaGFkZXIuZGVmaW5lcykgKyB2ZXJ0ZXhTaGFkZXJTb3VyY2U7XG5cdFx0XHR9XG5cdFx0XHRjb25zdCBzaGFkZXIgPSBjb21waWxlU2hhZGVyKGdsLCBlcnJvckNhbGxiYWNrLCB2ZXJ0ZXhTaGFkZXJTb3VyY2UsIGdsLlZFUlRFWF9TSEFERVIsIG5hbWUpO1xuXHRcdFx0aWYgKCFzaGFkZXIpIHtcblx0XHRcdFx0ZXJyb3JDYWxsYmFjayhgVW5hYmxlIHRvIGNvbXBpbGUgZGVmYXVsdCB2ZXJ0ZXggc2hhZGVyIGZvciBwcm9ncmFtIFwiJHtuYW1lfVwiLmApO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHR2ZXJ0ZXhTaGFkZXIuc2hhZGVyID0gc2hhZGVyO1xuXHRcdH1cblx0XHRjb25zdCBwcm9ncmFtID0gdGhpcy5pbml0UHJvZ3JhbSh2ZXJ0ZXhTaGFkZXIuc2hhZGVyLCBERUZBVUxUX1BST0dSQU1fTkFNRSk7XG5cdFx0aWYgKHByb2dyYW0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0ZXJyb3JDYWxsYmFjayhgVW5hYmxlIHRvIGluaXQgcHJvZ3JhbSBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0dGhpcy5wcm9ncmFtc1tuYW1lXSA9IHByb2dyYW07XG5cdFx0cmV0dXJuIHByb2dyYW07XG5cdH1cblxuXHRnZXQgZGVmYXVsdFByb2dyYW0oKSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0UHJvZ3JhbVdpdGhOYW1lKERFRkFVTFRfUFJPR1JBTV9OQU1FKTtcblx0fVxuXG5cdGdldCBkZWZhdWx0UHJvZ3JhbVdpdGhVVigpIHtcblx0XHRyZXR1cm4gdGhpcy5nZXRQcm9ncmFtV2l0aE5hbWUoREVGQVVMVF9XX1VWX1BST0dSQU1fTkFNRSk7XG5cdH1cblxuXHRnZXQgZGVmYXVsdFByb2dyYW1XaXRoTm9ybWFsKCkge1xuXHRcdHJldHVybiB0aGlzLmdldFByb2dyYW1XaXRoTmFtZShERUZBVUxUX1dfTk9STUFMX1BST0dSQU1fTkFNRSk7XG5cdH1cblxuXHRnZXQgZGVmYXVsdFByb2dyYW1XaXRoVVZOb3JtYWwoKSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0UHJvZ3JhbVdpdGhOYW1lKERFRkFVTFRfV19VVl9OT1JNQUxfUFJPR1JBTV9OQU1FKTtcblx0fVxuXG5cdGdldCBzZWdtZW50UHJvZ3JhbSgpIHtcblx0XHRyZXR1cm4gdGhpcy5nZXRQcm9ncmFtV2l0aE5hbWUoU0VHTUVOVF9QUk9HUkFNX05BTUUpO1xuXHR9XG5cblx0Z2V0IGRhdGFMYXllclBvaW50c1Byb2dyYW0oKSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0UHJvZ3JhbVdpdGhOYW1lKERBVEFfTEFZRVJfUE9JTlRTX1BST0dSQU1fTkFNRSk7XG5cdH1cblxuXHRnZXQgZGF0YUxheWVyVmVjdG9yRmllbGRQcm9ncmFtKCkge1xuXHRcdHJldHVybiB0aGlzLmdldFByb2dyYW1XaXRoTmFtZShEQVRBX0xBWUVSX1ZFQ1RPUl9GSUVMRF9QUk9HUkFNX05BTUUpO1xuXHR9XG5cblx0Z2V0IGRhdGFMYXllckxpbmVzUHJvZ3JhbSgpIHtcblx0XHRyZXR1cm4gdGhpcy5nZXRQcm9ncmFtV2l0aE5hbWUoREFUQV9MQVlFUl9MSU5FU19QUk9HUkFNX05BTUUpO1xuXHR9XG5cblx0cHJpdmF0ZSB1bmlmb3JtVHlwZUZvclZhbHVlKFxuXHRcdHZhbHVlOiBudW1iZXIgfCBudW1iZXJbXSxcblx0XHRkYXRhVHlwZTogVW5pZm9ybURhdGFUeXBlLFxuXHQpIHtcblx0XHRpZiAoZGF0YVR5cGUgPT09IEZMT0FUKSB7XG5cdFx0XHQvLyBDaGVjayB0aGF0IHdlIGFyZSBkZWFsaW5nIHdpdGggYSBudW1iZXIuXG5cdFx0XHRpZiAoaXNBcnJheSh2YWx1ZSkpIHtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCAodmFsdWUgYXMgbnVtYmVyW10pLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0aWYgKCFpc051bWJlcigodmFsdWUgYXMgbnVtYmVyW10pW2ldKSkge1xuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHVuaWZvcm0gdmFsdWU6ICR7dmFsdWV9IGZvciBwcm9ncmFtIFwiJHt0aGlzLm5hbWV9XCIsIGV4cGVjdGVkIGZsb2F0IG9yIGZsb2F0W10gb2YgbGVuZ3RoIDEtNC5gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmICghaXNOdW1iZXIodmFsdWUpKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHVuaWZvcm0gdmFsdWU6ICR7dmFsdWV9IGZvciBwcm9ncmFtIFwiJHt0aGlzLm5hbWV9XCIsIGV4cGVjdGVkIGZsb2F0IG9yIGZsb2F0W10gb2YgbGVuZ3RoIDEtNC5gKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKCFpc0FycmF5KHZhbHVlKSB8fCAodmFsdWUgYXMgbnVtYmVyW10pLmxlbmd0aCA9PT0gMSkge1xuXHRcdFx0XHRyZXR1cm4gRkxPQVRfMURfVU5JRk9STTtcblx0XHRcdH1cblx0XHRcdGlmICgodmFsdWUgYXMgbnVtYmVyW10pLmxlbmd0aCA9PT0gMikge1xuXHRcdFx0XHRyZXR1cm4gRkxPQVRfMkRfVU5JRk9STTtcblx0XHRcdH1cblx0XHRcdGlmICgodmFsdWUgYXMgbnVtYmVyW10pLmxlbmd0aCA9PT0gMykge1xuXHRcdFx0XHRyZXR1cm4gRkxPQVRfM0RfVU5JRk9STTtcblx0XHRcdH1cblx0XHRcdGlmICgodmFsdWUgYXMgbnVtYmVyW10pLmxlbmd0aCA9PT0gNCkge1xuXHRcdFx0XHRyZXR1cm4gRkxPQVRfNERfVU5JRk9STTtcblx0XHRcdH1cblx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB1bmlmb3JtIHZhbHVlOiAke3ZhbHVlfSBmb3IgcHJvZ3JhbSBcIiR7dGhpcy5uYW1lfVwiLCBleHBlY3RlZCBmbG9hdCBvciBmbG9hdFtdIG9mIGxlbmd0aCAxLTQuYCk7XG5cdFx0fSBlbHNlIGlmIChkYXRhVHlwZSA9PT0gSU5UKSB7XG5cdFx0XHQvLyBDaGVjayB0aGF0IHdlIGFyZSBkZWFsaW5nIHdpdGggYW4gaW50LlxuXHRcdFx0aWYgKGlzQXJyYXkodmFsdWUpKSB7XG5cdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgKHZhbHVlIGFzIG51bWJlcltdKS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdGlmICghaXNJbnRlZ2VyKCh2YWx1ZSBhcyBudW1iZXJbXSlbaV0pKSB7XG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdW5pZm9ybSB2YWx1ZTogJHt2YWx1ZX0gZm9yIHByb2dyYW0gXCIke3RoaXMubmFtZX1cIiwgZXhwZWN0ZWQgaW50IG9yIGludFtdIG9mIGxlbmd0aCAxLTQuYCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAoIWlzSW50ZWdlcih2YWx1ZSkpIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdW5pZm9ybSB2YWx1ZTogJHt2YWx1ZX0gZm9yIHByb2dyYW0gXCIke3RoaXMubmFtZX1cIiwgZXhwZWN0ZWQgaW50IG9yIGludFtdIG9mIGxlbmd0aCAxLTQuYCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmICghaXNBcnJheSh2YWx1ZSkgfHwgKHZhbHVlIGFzIG51bWJlcltdKS5sZW5ndGggPT09IDEpIHtcblx0XHRcdFx0cmV0dXJuIElOVF8xRF9VTklGT1JNO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCh2YWx1ZSBhcyBudW1iZXJbXSkubGVuZ3RoID09PSAyKSB7XG5cdFx0XHRcdHJldHVybiBJTlRfMkRfVU5JRk9STTtcblx0XHRcdH1cblx0XHRcdGlmICgodmFsdWUgYXMgbnVtYmVyW10pLmxlbmd0aCA9PT0gMykge1xuXHRcdFx0XHRyZXR1cm4gSU5UXzNEX1VOSUZPUk07XG5cdFx0XHR9XG5cdFx0XHRpZiAoKHZhbHVlIGFzIG51bWJlcltdKS5sZW5ndGggPT09IDQpIHtcblx0XHRcdFx0cmV0dXJuIElOVF80RF9VTklGT1JNO1xuXHRcdFx0fVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHVuaWZvcm0gdmFsdWU6ICR7dmFsdWV9IGZvciBwcm9ncmFtIFwiJHt0aGlzLm5hbWV9XCIsIGV4cGVjdGVkIGludCBvciBpbnRbXSBvZiBsZW5ndGggMS00LmApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdW5pZm9ybSBkYXRhIHR5cGU6ICR7ZGF0YVR5cGV9IGZvciBwcm9ncmFtIFwiJHt0aGlzLm5hbWV9XCIsIGV4cGVjdGVkICR7RkxPQVR9IG9yICR7SU5UfS5gKTtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIHNldFByb2dyYW1Vbmlmb3JtKFxuXHRcdHByb2dyYW06IFdlYkdMUHJvZ3JhbSxcblx0XHRwcm9ncmFtTmFtZTogc3RyaW5nLFxuXHRcdHVuaWZvcm1OYW1lOiBzdHJpbmcsXG5cdFx0dmFsdWU6IFVuaWZvcm1WYWx1ZVR5cGUsXG5cdFx0dHlwZTogVW5pZm9ybVR5cGUsXG5cdCkge1xuXHRcdGNvbnN0IHsgZ2wsIHVuaWZvcm1zLCBlcnJvckNhbGxiYWNrIH0gPSB0aGlzO1xuXHRcdC8vIFNldCBhY3RpdmUgcHJvZ3JhbS5cblx0XHRnbC51c2VQcm9ncmFtKHByb2dyYW0pO1xuXG5cdFx0bGV0IGxvY2F0aW9uID0gdW5pZm9ybXNbdW5pZm9ybU5hbWVdPy5sb2NhdGlvbltwcm9ncmFtTmFtZV07XG5cdFx0Ly8gSW5pdCBhIGxvY2F0aW9uIGZvciBXZWJHTFByb2dyYW0gaWYgbmVlZGVkLlxuXHRcdGlmIChsb2NhdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRjb25zdCBfbG9jYXRpb24gPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24ocHJvZ3JhbSwgdW5pZm9ybU5hbWUpO1xuXHRcdFx0aWYgKCFfbG9jYXRpb24pIHtcblx0XHRcdFx0ZXJyb3JDYWxsYmFjayhgQ291bGQgbm90IGluaXQgdW5pZm9ybSBcIiR7dW5pZm9ybU5hbWV9XCIgZm9yIHByb2dyYW0gXCIke3RoaXMubmFtZX1cIi5cbkNoZWNrIHRoYXQgdW5pZm9ybSBpcyBwcmVzZW50IGluIHNoYWRlciBjb2RlLCB1bnVzZWQgdW5pZm9ybXMgbWF5IGJlIHJlbW92ZWQgYnkgY29tcGlsZXIuXG5BbHNvIGNoZWNrIHRoYXQgdW5pZm9ybSB0eXBlIGluIHNoYWRlciBjb2RlIG1hdGNoZXMgdHlwZSAke3R5cGV9LlxuRXJyb3IgY29kZTogJHtnbC5nZXRFcnJvcigpfS5gKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0bG9jYXRpb24gPSBfbG9jYXRpb247XG5cdFx0XHQvLyBTYXZlIGxvY2F0aW9uIGZvciBmdXR1cmUgdXNlLlxuXHRcdFx0aWYgKHVuaWZvcm1zW3VuaWZvcm1OYW1lXSkge1xuXHRcdFx0XHR1bmlmb3Jtc1t1bmlmb3JtTmFtZV0ubG9jYXRpb25bcHJvZ3JhbU5hbWVdID0gbG9jYXRpb247XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gU2V0IHVuaWZvcm0uXG5cdFx0Ly8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1dlYkdMUmVuZGVyaW5nQ29udGV4dC91bmlmb3JtXG5cdFx0c3dpdGNoICh0eXBlKSB7XG5cdFx0XHRjYXNlIEZMT0FUXzFEX1VOSUZPUk06XG5cdFx0XHRcdGdsLnVuaWZvcm0xZihsb2NhdGlvbiwgdmFsdWUgYXMgbnVtYmVyKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIEZMT0FUXzJEX1VOSUZPUk06XG5cdFx0XHRcdGdsLnVuaWZvcm0yZnYobG9jYXRpb24sIHZhbHVlIGFzIG51bWJlcltdKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIEZMT0FUXzNEX1VOSUZPUk06XG5cdFx0XHRcdGdsLnVuaWZvcm0zZnYobG9jYXRpb24sIHZhbHVlIGFzIG51bWJlcltdKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIEZMT0FUXzREX1VOSUZPUk06XG5cdFx0XHRcdGdsLnVuaWZvcm00ZnYobG9jYXRpb24sIHZhbHVlIGFzIG51bWJlcltdKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIElOVF8xRF9VTklGT1JNOlxuXHRcdFx0XHRnbC51bmlmb3JtMWkobG9jYXRpb24sIHZhbHVlIGFzIG51bWJlcik7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBJTlRfMkRfVU5JRk9STTpcblx0XHRcdFx0Z2wudW5pZm9ybTJpdihsb2NhdGlvbiwgdmFsdWUgYXMgbnVtYmVyW10pO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgSU5UXzNEX1VOSUZPUk06XG5cdFx0XHRcdGdsLnVuaWZvcm0zaXYobG9jYXRpb24sIHZhbHVlIGFzIG51bWJlcltdKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIElOVF80RF9VTklGT1JNOlxuXHRcdFx0XHRnbC51bmlmb3JtNGl2KGxvY2F0aW9uLCB2YWx1ZSBhcyBudW1iZXJbXSk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbmtub3duIHVuaWZvcm0gdHlwZSAke3R5cGV9IGZvciBHUFVQcm9ncmFtIFwiJHt0aGlzLm5hbWV9XCIuYCk7XG5cdFx0fVxuXHR9XG5cblx0c2V0VW5pZm9ybShcblx0XHR1bmlmb3JtTmFtZTogc3RyaW5nLFxuXHRcdHZhbHVlOiBVbmlmb3JtVmFsdWVUeXBlLFxuXHRcdGRhdGFUeXBlPzogVW5pZm9ybURhdGFUeXBlLFxuXHQpIHtcblx0XHRjb25zdCB7IHByb2dyYW1zLCB1bmlmb3JtcyB9ID0gdGhpcztcblxuXHRcdGxldCB0eXBlID0gdW5pZm9ybXNbdW5pZm9ybU5hbWVdPy50eXBlO1xuXHRcdGlmIChkYXRhVHlwZSkge1xuXHRcdFx0Y29uc3QgdHlwZVBhcmFtID0gdGhpcy51bmlmb3JtVHlwZUZvclZhbHVlKHZhbHVlLCBkYXRhVHlwZSk7XG5cdFx0XHRpZiAodHlwZSA9PT0gdW5kZWZpbmVkKSB0eXBlID0gdHlwZVBhcmFtO1xuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdC8vIGNvbnNvbGUud2FybihgRG9uJ3QgbmVlZCB0byBwYXNzIGluIGRhdGFUeXBlIHRvIEdQVVByb2dyYW0uc2V0VW5pZm9ybSBmb3IgcHJldmlvdXNseSBpbml0ZWQgdW5pZm9ybSBcIiR7dW5pZm9ybU5hbWV9XCJgKTtcblx0XHRcdFx0Ly8gQ2hlY2sgdGhhdCB0eXBlcyBtYXRjaCBwcmV2aW91c2x5IHNldCB1bmlmb3JtLlxuXHRcdFx0XHRpZiAodHlwZSAhPT0gdHlwZVBhcmFtKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbmlmb3JtIFwiJHt1bmlmb3JtTmFtZX1cIiBmb3IgR1BVUHJvZ3JhbSBcIiR7dGhpcy5uYW1lfVwiIGNhbm5vdCBjaGFuZ2UgZnJvbSB0eXBlICR7dHlwZX0gdG8gdHlwZSAke3R5cGVQYXJhbX0uYCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKHR5cGUgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbmtub3duIHR5cGUgZm9yIHVuaWZvcm0gXCIke3VuaWZvcm1OYW1lfVwiLCBwbGVhc2UgcGFzcyBpbiBkYXRhVHlwZSB0byBHUFVQcm9ncmFtLnNldFVuaWZvcm0gd2hlbiBpbml0aW5nIGEgbmV3IHVuaWZvcm0uYCk7XG5cdFx0fVxuXG5cdFx0aWYgKCF1bmlmb3Jtc1t1bmlmb3JtTmFtZV0pIHtcblx0XHRcdC8vIEluaXQgdW5pZm9ybSBpZiBuZWVkZWQuXG5cdFx0XHR1bmlmb3Jtc1t1bmlmb3JtTmFtZV0gPSB7IHR5cGUsIGxvY2F0aW9uOiB7fSwgdmFsdWUgfTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gVXBkYXRlIHZhbHVlLlxuXHRcdFx0dW5pZm9ybXNbdW5pZm9ybU5hbWVdLnZhbHVlID0gdmFsdWU7XG5cdFx0fVxuXG5cdFx0Ly8gVXBkYXRlIGFueSBhY3RpdmUgcHJvZ3JhbXMuXG5cdFx0Y29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHByb2dyYW1zKTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGNvbnN0IHByb2dyYW1OYW1lID0ga2V5c1tpXSBhcyBQUk9HUkFNX05BTUVTO1xuXHRcdFx0dGhpcy5zZXRQcm9ncmFtVW5pZm9ybShwcm9ncmFtc1twcm9ncmFtTmFtZV0hLCBwcm9ncmFtTmFtZSwgdW5pZm9ybU5hbWUsIHZhbHVlLCB0eXBlKTtcblx0XHR9XG5cdH07XG5cblx0c2V0VmVydGV4VW5pZm9ybShcblx0XHRwcm9ncmFtOiBXZWJHTFByb2dyYW0sXG5cdFx0dW5pZm9ybU5hbWU6IHN0cmluZyxcblx0XHR2YWx1ZTogVW5pZm9ybVZhbHVlVHlwZSxcblx0XHRkYXRhVHlwZTogVW5pZm9ybURhdGFUeXBlLFxuXHQpIHtcblx0XHRjb25zdCB0eXBlID0gdGhpcy51bmlmb3JtVHlwZUZvclZhbHVlKHZhbHVlLCBkYXRhVHlwZSk7XG5cdFx0aWYgKHByb2dyYW0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdNdXN0IHBhc3MgaW4gdmFsaWQgV2ViR0xQcm9ncmFtIHRvIHNldFZlcnRleFVuaWZvcm0sIGdvdCB1bmRlZmluZWQuJyk7XG5cdFx0fVxuXHRcdGNvbnN0IHByb2dyYW1OYW1lID0gT2JqZWN0LmtleXModGhpcy5wcm9ncmFtcykuZmluZChrZXkgPT4gdGhpcy5wcm9ncmFtc1trZXkgYXMgUFJPR1JBTV9OQU1FU10gPT09IHByb2dyYW0pO1xuXHRcdGlmICghcHJvZ3JhbU5hbWUpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgdmFsaWQgdmVydGV4IHByb2dyYW1OYW1lIGZvciBXZWJHTFByb2dyYW0gXCIke3RoaXMubmFtZX1cIi5gKTtcblx0XHR9XG5cdFx0dGhpcy5zZXRQcm9ncmFtVW5pZm9ybShwcm9ncmFtLCBwcm9ncmFtTmFtZSwgdW5pZm9ybU5hbWUsIHZhbHVlLCB0eXBlKTtcblx0fVxuXG5cdGRlc3Ryb3koKSB7XG5cdFx0Y29uc3QgeyBnbCwgZnJhZ21lbnRTaGFkZXIsIHByb2dyYW1zIH0gPSB0aGlzO1xuXHRcdC8vIFVuYmluZCBhbGwgZ2wgZGF0YSBiZWZvcmUgZGVsZXRpbmcuXG5cdFx0T2JqZWN0LnZhbHVlcyhwcm9ncmFtcykuZm9yRWFjaChwcm9ncmFtID0+IHtcblx0XHRcdGdsLmRlbGV0ZVByb2dyYW0ocHJvZ3JhbSEpO1xuXHRcdH0pO1xuXHRcdE9iamVjdC5rZXlzKHRoaXMucHJvZ3JhbXMpLmZvckVhY2goa2V5ID0+IHtcblx0XHRcdGRlbGV0ZSB0aGlzLnByb2dyYW1zW2tleSBhcyBQUk9HUkFNX05BTUVTXTtcblx0XHR9KTtcblxuXHRcdC8vIEZyb20gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1dlYkdMUmVuZGVyaW5nQ29udGV4dC9kZWxldGVTaGFkZXJcblx0XHQvLyBUaGlzIG1ldGhvZCBoYXMgbm8gZWZmZWN0IGlmIHRoZSBzaGFkZXIgaGFzIGFscmVhZHkgYmVlbiBkZWxldGVkXG5cdFx0Z2wuZGVsZXRlU2hhZGVyKGZyYWdtZW50U2hhZGVyKTtcblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0ZGVsZXRlIHRoaXMuZnJhZ21lbnRTaGFkZXI7XG5cblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0ZGVsZXRlIHRoaXMuZ2w7XG5cdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdGRlbGV0ZSB0aGlzLmVycm9yQ2FsbGJhY2s7XG5cdH1cbn1cbiIsImltcG9ydCB7IHNhdmVBcyB9IGZyb20gJ2ZpbGUtc2F2ZXInO1xuLy8gQHRzLWlnbm9yZVxuaW1wb3J0IHsgY2hhbmdlRHBpQmxvYiB9IGZyb20gJ2NoYW5nZWRwaSc7XG5pbXBvcnQgeyBEYXRhTGF5ZXIgfSBmcm9tICcuL0RhdGFMYXllcic7XG5pbXBvcnQge1xuXHREYXRhTGF5ZXJBcnJheVR5cGUsIERhdGFMYXllckZpbHRlclR5cGUsIERhdGFMYXllck51bUNvbXBvbmVudHMsIERhdGFMYXllclR5cGUsIERhdGFMYXllcldyYXBUeXBlLFxuXHRGTE9BVCwgSEFMRl9GTE9BVCwgVU5TSUdORURfQllURSwgQllURSwgVU5TSUdORURfU0hPUlQsIFNIT1JULCBVTlNJR05FRF9JTlQsIElOVCxcblx0VW5pZm9ybURhdGFUeXBlLCBVbmlmb3JtVmFsdWVUeXBlLCBHTFNMVmVyc2lvbiwgR0xTTDEsIEdMU0wzLCBDTEFNUF9UT19FREdFLCBUZXh0dXJlRm9ybWF0VHlwZSwgTkVBUkVTVCwgUkdCQSwgVGV4dHVyZURhdGFUeXBlLFxufSBmcm9tICcuL0NvbnN0YW50cyc7XG5pbXBvcnQgeyBHUFVQcm9ncmFtIH0gZnJvbSAnLi9HUFVQcm9ncmFtJztcbmltcG9ydCB7IFdlYkdMUmVuZGVyZXIsIFRleHR1cmUsIFZlY3RvcjQgfSBmcm9tICd0aHJlZSc7Ly8gSnVzdCBpbXBvcnRpbmcgdGhlIHR5cGVzIGhlcmUuXG5pbXBvcnQgKiBhcyB1dGlscyBmcm9tICcuL3V0aWxzL1ZlY3RvcjQnO1xuaW1wb3J0IHsgaXNXZWJHTDIsIGlzUG93ZXJPZjIsIGluaXRTZXF1ZW50aWFsRmxvYXRBcnJheSB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgZ2V0RmxvYXQxNiB9IGZyb20gJ0BwZXRhbW9yaWtlbi9mbG9hdDE2JztcbmltcG9ydCB7XG5cdGlzQXJyYXksXG5cdGlzU3RyaW5nLCBpc1ZhbGlkRmlsdGVyVHlwZSwgaXNWYWxpZFRleHR1cmVEYXRhVHlwZSwgaXNWYWxpZFRleHR1cmVGb3JtYXRUeXBlLCBpc1ZhbGlkV3JhcFR5cGUsXG5cdHZhbGlkRmlsdGVyVHlwZXMsIHZhbGlkVGV4dHVyZURhdGFUeXBlcywgdmFsaWRUZXh0dXJlRm9ybWF0VHlwZXMsIHZhbGlkV3JhcFR5cGVzIH0gZnJvbSAnLi9DaGVja3MnO1xuXG5jb25zdCBERUZBVUxUX0NJUkNMRV9OVU1fU0VHTUVOVFMgPSAxODsvLyBNdXN0IGJlIGRpdmlzaWJsZSBieSA2IHRvIHdvcmsgd2l0aCBzdGVwU2VnbWVudCgpLlxuXG50eXBlIEVycm9yQ2FsbGJhY2sgPSAobWVzc2FnZTogc3RyaW5nKSA9PiB2b2lkO1xuXG5leHBvcnQgY2xhc3MgV2ViR0xDb21wdXRlIHtcblx0cmVhZG9ubHkgZ2whOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQgfCBXZWJHTDJSZW5kZXJpbmdDb250ZXh0O1xuXHRyZWFkb25seSBnbHNsVmVyc2lvbiE6IEdMU0xWZXJzaW9uO1xuXHQvLyBUaGVzZSB3aWR0aCBhbmQgaGVpZ2h0IGFyZSB0aGUgY3VycmVudCBjYW52YXMgYXQgZnVsbCByZXMuXG5cdHByaXZhdGUgd2lkdGghOiBudW1iZXI7XG5cdHByaXZhdGUgaGVpZ2h0ITogbnVtYmVyO1xuXG5cdHByaXZhdGUgZXJyb3JTdGF0ZSA9IGZhbHNlO1xuXHRwcml2YXRlIHJlYWRvbmx5IGVycm9yQ2FsbGJhY2s6IEVycm9yQ2FsbGJhY2s7XG5cblx0Ly8gU2F2ZSB0aHJlZWpzIHJlbmRlcmVyIGlmIHBhc3NlZCBpbi5cblx0cHJpdmF0ZSByZW5kZXJlcj86IFdlYkdMUmVuZGVyZXI7XG5cdHByaXZhdGUgcmVhZG9ubHkgbWF4TnVtVGV4dHVyZXMhOiBudW1iZXI7XG5cdFxuXHQvLyBQcmVjb21wdXRlZCBidWZmZXJzIChpbml0ZWQgYXMgbmVlZGVkKS5cblx0cHJpdmF0ZSBfcXVhZFBvc2l0aW9uc0J1ZmZlcj86IFdlYkdMQnVmZmVyO1xuXHRwcml2YXRlIF9ib3VuZGFyeVBvc2l0aW9uc0J1ZmZlcj86IFdlYkdMQnVmZmVyO1xuXHQvLyBTdG9yZSBtdWx0aXBsZSBjaXJjbGUgcG9zaXRpb25zIGJ1ZmZlcnMgZm9yIHZhcmlvdXMgbnVtIHNlZ21lbnRzLCB1c2UgbnVtU2VnbWVudHMgYXMga2V5LlxuXHRwcml2YXRlIF9jaXJjbGVQb3NpdGlvbnNCdWZmZXI6IHsgW2tleTogbnVtYmVyXTogV2ViR0xCdWZmZXIgfSA9IHt9O1xuXG5cdHByaXZhdGUgcG9pbnRJbmRleEFycmF5PzogRmxvYXQzMkFycmF5O1xuXHRwcml2YXRlIHBvaW50SW5kZXhCdWZmZXI/OiBXZWJHTEJ1ZmZlcjtcblx0cHJpdmF0ZSB2ZWN0b3JGaWVsZEluZGV4QXJyYXk/OiBGbG9hdDMyQXJyYXk7XG5cdHByaXZhdGUgdmVjdG9yRmllbGRJbmRleEJ1ZmZlcj86IFdlYkdMQnVmZmVyO1xuXHRwcml2YXRlIGluZGV4ZWRMaW5lc0luZGV4QnVmZmVyPzogV2ViR0xCdWZmZXI7XG5cblx0Ly8gUHJvZ3JhbXMgZm9yIGNvcHlpbmcgZGF0YSAodGhlc2UgYXJlIG5lZWRlZCBmb3IgcmVuZGVyaW5nIHBhcnRpYWwgc2NyZWVuIGdlb21ldHJpZXMpLlxuXHRwcml2YXRlIHJlYWRvbmx5IGNvcHlGbG9hdFByb2dyYW0hOiBHUFVQcm9ncmFtO1xuXHRwcml2YXRlIHJlYWRvbmx5IGNvcHlJbnRQcm9ncmFtITogR1BVUHJvZ3JhbTtcblx0cHJpdmF0ZSByZWFkb25seSBjb3B5VWludFByb2dyYW0hOiBHUFVQcm9ncmFtO1xuXG5cdC8vIE90aGVyIHV0aWwgcHJvZ3JhbXMuXG5cdHByaXZhdGUgX3NpbmdsZUNvbG9yUHJvZ3JhbT86IEdQVVByb2dyYW07XG5cdHByaXZhdGUgX3NpbmdsZUNvbG9yV2l0aFdyYXBDaGVja1Byb2dyYW0/OiBHUFVQcm9ncmFtO1xuXHRwcml2YXRlIF92ZWN0b3JNYWduaXR1ZGVQcm9ncmFtPzogR1BVUHJvZ3JhbTtcblxuXHRzdGF0aWMgaW5pdFdpdGhUaHJlZVJlbmRlcmVyKFxuXHRcdHJlbmRlcmVyOiBXZWJHTFJlbmRlcmVyLFxuXHRcdHBhcmFtczoge1xuXHRcdFx0Z2xzbFZlcnNpb24/OiBHTFNMVmVyc2lvbixcblx0XHR9LFxuXHRcdGVycm9yQ2FsbGJhY2s/OiBFcnJvckNhbGxiYWNrLFxuXHQpIHtcblx0XHRyZXR1cm4gbmV3IFdlYkdMQ29tcHV0ZShcblx0XHRcdHtcblx0XHRcdFx0Y2FudmFzOiByZW5kZXJlci5kb21FbGVtZW50LFxuXHRcdFx0XHRjb250ZXh0OiByZW5kZXJlci5nZXRDb250ZXh0KCksXG5cdFx0XHRcdC4uLnBhcmFtcyxcblx0XHRcdH0sXG5cdFx0XHRlcnJvckNhbGxiYWNrLFxuXHRcdFx0cmVuZGVyZXIsXG5cdFx0KTtcblx0fVxuXG5cdGNvbnN0cnVjdG9yKFxuXHRcdHBhcmFtczoge1xuXHRcdFx0Y2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCxcblx0XHRcdGNvbnRleHQ/OiBXZWJHTFJlbmRlcmluZ0NvbnRleHQgfCBXZWJHTDJSZW5kZXJpbmdDb250ZXh0IHwgbnVsbCxcblx0XHRcdGFudGlhbGlhcz86IGJvb2xlYW4sXG5cdFx0XHRnbHNsVmVyc2lvbj86IEdMU0xWZXJzaW9uLFxuXHRcdH0sXG5cdFx0Ly8gT3B0aW9uYWxseSBwYXNzIGluIGFuIGVycm9yIGNhbGxiYWNrIGluIGNhc2Ugd2Ugd2FudCB0byBoYW5kbGUgZXJyb3JzIHJlbGF0ZWQgdG8gd2ViZ2wgc3VwcG9ydC5cblx0XHQvLyBlLmcuIHRocm93IHVwIGEgbW9kYWwgdGVsbGluZyB1c2VyIHRoaXMgd2lsbCBub3Qgd29yayBvbiB0aGVpciBkZXZpY2UuXG5cdFx0ZXJyb3JDYWxsYmFjazogRXJyb3JDYWxsYmFjayA9IChtZXNzYWdlOiBzdHJpbmcpID0+IHsgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpIH0sXG5cdFx0cmVuZGVyZXI/OiBXZWJHTFJlbmRlcmVyLFxuXHQpIHtcblx0XHQvLyBDaGVjayBwYXJhbXMuXG5cdFx0Y29uc3QgdmFsaWRLZXlzID0gWydjYW52YXMnLCAnY29udGV4dCcsICdhbnRpYWxpYXMnLCAnZ2xzbFZlcnNpb24nXTtcblx0XHRPYmplY3Qua2V5cyhwYXJhbXMpLmZvckVhY2goa2V5ID0+IHtcblx0XHRcdGlmICh2YWxpZEtleXMuaW5kZXhPZihrZXkpIDwgMCkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQga2V5ICR7a2V5fSBwYXNzZWQgdG8gV2ViR0xDb21wdXRlLmNvbnN0cnVjdG9yLiAgVmFsaWQga2V5cyBhcmUgJHt2YWxpZEtleXMuam9pbignLCAnKX0uYCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0Ly8gU2F2ZSBjYWxsYmFjayBpbiBjYXNlIHdlIHJ1biBpbnRvIGFuIGVycm9yLlxuXHRcdGNvbnN0IHNlbGYgPSB0aGlzO1xuXHRcdHRoaXMuZXJyb3JDYWxsYmFjayA9IChtZXNzYWdlOiBzdHJpbmcpID0+IHtcblx0XHRcdGlmIChzZWxmLmVycm9yU3RhdGUpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0c2VsZi5lcnJvclN0YXRlID0gdHJ1ZTtcblx0XHRcdGVycm9yQ2FsbGJhY2sobWVzc2FnZSk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgeyBjYW52YXMgfSA9IHBhcmFtcztcblx0XHRsZXQgZ2wgPSBwYXJhbXMuY29udGV4dDtcblxuXHRcdC8vIEluaXQgR0wuXG5cdFx0aWYgKCFnbCkge1xuXHRcdFx0Y29uc3Qgb3B0aW9uczogYW55ID0ge307XG5cdFx0XHRpZiAocGFyYW1zLmFudGlhbGlhcyAhPT0gdW5kZWZpbmVkKSBvcHRpb25zLmFudGlhbGlhcyA9IHBhcmFtcy5hbnRpYWxpYXM7XG5cdFx0XHQvLyBJbml0IGEgZ2wgY29udGV4dCBpZiBub3QgcGFzc2VkIGluLlxuXHRcdFx0Z2wgPSBjYW52YXMuZ2V0Q29udGV4dCgnd2ViZ2wyJywgb3B0aW9ucykgIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQgfCBudWxsXG5cdFx0XHRcdHx8IGNhbnZhcy5nZXRDb250ZXh0KCd3ZWJnbCcsIG9wdGlvbnMpICBhcyBXZWJHTFJlbmRlcmluZ0NvbnRleHQgfCBudWxsXG5cdFx0XHRcdHx8IGNhbnZhcy5nZXRDb250ZXh0KCdleHBlcmltZW50YWwtd2ViZ2wnLCBvcHRpb25zKSAgYXMgV2ViR0xSZW5kZXJpbmdDb250ZXh0IHwgbnVsbDtcblx0XHRcdGlmIChnbCA9PT0gbnVsbCkge1xuXHRcdFx0XHR0aGlzLmVycm9yQ2FsbGJhY2soJ1VuYWJsZSB0byBpbml0aWFsaXplIFdlYkdMIGNvbnRleHQuJyk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKGlzV2ViR0wyKGdsKSkge1xuXHRcdFx0Y29uc29sZS5sb2coJ1VzaW5nIFdlYkdMIDIuMCBjb250ZXh0LicpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zb2xlLmxvZygnVXNpbmcgV2ViR0wgMS4wIGNvbnRleHQuJyk7XG5cdFx0fVxuXHRcdHRoaXMuZ2wgPSBnbDtcblx0XHR0aGlzLnJlbmRlcmVyID0gcmVuZGVyZXI7XG5cblx0XHQvLyBTYXZlIGdsc2wgdmVyc2lvbiwgZGVmYXVsdCB0byAxLnguXG5cdFx0Y29uc3QgZ2xzbFZlcnNpb24gPSBwYXJhbXMuZ2xzbFZlcnNpb24gPT09IHVuZGVmaW5lZCA/IEdMU0wxIDogcGFyYW1zLmdsc2xWZXJzaW9uO1xuXHRcdHRoaXMuZ2xzbFZlcnNpb24gPSBnbHNsVmVyc2lvbjtcblx0XHRpZiAoIWlzV2ViR0wyKGdsKSAmJiBnbHNsVmVyc2lvbiA9PT0gR0xTTDMpIHtcblx0XHRcdGNvbnNvbGUud2FybignR0xTTDMueCBpcyBpbmNvbXBhdGlibGUgd2l0aCBXZWJHTDEuMCBjb250ZXh0cy4nKTtcblx0XHR9XG5cblx0XHQvLyBHTCBzZXR1cC5cblx0XHQvLyBEaXNhYmxlIGRlcHRoIHRlc3RpbmcgZ2xvYmFsbHkuXG5cdFx0Z2wuZGlzYWJsZShnbC5ERVBUSF9URVNUKTtcblx0XHQvLyBTZXQgdW5wYWNrIGFsaWdubWVudCB0byAxIHNvIHdlIGNhbiBoYXZlIHRleHR1cmVzIG9mIGFyYml0cmFyeSBkaW1lbnNpb25zLlxuXHRcdC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzUxNTgyMjgyL2Vycm9yLXdoZW4tY3JlYXRpbmctdGV4dHVyZXMtaW4td2ViZ2wtd2l0aC10aGUtcmdiLWZvcm1hdFxuXHRcdGdsLnBpeGVsU3RvcmVpKGdsLlVOUEFDS19BTElHTk1FTlQsIDEpO1xuXHRcdC8vIFRPRE86IGxvb2sgaW50byBtb3JlIG9mIHRoZXNlOiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvV2ViR0xSZW5kZXJpbmdDb250ZXh0L3BpeGVsU3RvcmVpXG5cdFx0Ly8gLy8gU29tZSBpbXBsZW1lbnRhdGlvbnMgb2YgSFRNTENhbnZhc0VsZW1lbnQncyBvciBPZmZzY3JlZW5DYW52YXMncyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgc3RvcmUgY29sb3IgdmFsdWVzXG5cdFx0Ly8gLy8gaW50ZXJuYWxseSBpbiBwcmVtdWx0aXBsaWVkIGZvcm0uIElmIHN1Y2ggYSBjYW52YXMgaXMgdXBsb2FkZWQgdG8gYSBXZWJHTCB0ZXh0dXJlIHdpdGggdGhlXG5cdFx0Ly8gLy8gVU5QQUNLX1BSRU1VTFRJUExZX0FMUEhBX1dFQkdMIHBpeGVsIHN0b3JhZ2UgcGFyYW1ldGVyIHNldCB0byBmYWxzZSwgdGhlIGNvbG9yIGNoYW5uZWxzIHdpbGwgaGF2ZSB0byBiZSB1bi1tdWx0aXBsaWVkXG5cdFx0Ly8gLy8gYnkgdGhlIGFscGhhIGNoYW5uZWwsIHdoaWNoIGlzIGEgbG9zc3kgb3BlcmF0aW9uLiBUaGUgV2ViR0wgaW1wbGVtZW50YXRpb24gdGhlcmVmb3JlIGNhbiBub3QgZ3VhcmFudGVlIHRoYXQgY29sb3JzXG5cdFx0Ly8gLy8gd2l0aCBhbHBoYSA8IDEuMCB3aWxsIGJlIHByZXNlcnZlZCBsb3NzbGVzc2x5IHdoZW4gZmlyc3QgZHJhd24gdG8gYSBjYW52YXMgdmlhIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBhbmQgdGhlblxuXHRcdC8vIC8vIHVwbG9hZGVkIHRvIGEgV2ViR0wgdGV4dHVyZSB3aGVuIHRoZSBVTlBBQ0tfUFJFTVVMVElQTFlfQUxQSEFfV0VCR0wgcGl4ZWwgc3RvcmFnZSBwYXJhbWV0ZXIgaXMgc2V0IHRvIGZhbHNlLlxuXHRcdC8vIGdsLnBpeGVsU3RvcmVpKGdsLlVOUEFDS19QUkVNVUxUSVBMWV9BTFBIQV9XRUJHTCwgdHJ1ZSk7XG5cblx0XHQvLyBJbml0IHByb2dyYW1zIHRvIHBhc3MgdmFsdWVzIGZyb20gb25lIHRleHR1cmUgdG8gYW5vdGhlci5cblx0XHR0aGlzLmNvcHlGbG9hdFByb2dyYW0gPSB0aGlzLmluaXRQcm9ncmFtKHtcblx0XHRcdG5hbWU6ICdjb3B5RmxvYXQnLFxuXHRcdFx0ZnJhZ21lbnRTaGFkZXI6IGdsc2xWZXJzaW9uID09PSBHTFNMMyA/IHJlcXVpcmUoJy4vZ2xzbF8zL0NvcHlGbG9hdEZyYWdTaGFkZXIuZ2xzbCcpIDogcmVxdWlyZSgnLi9nbHNsXzEvQ29weUZyYWdTaGFkZXIuZ2xzbCcpLFxuXHRcdFx0dW5pZm9ybXM6IFtcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRuYW1lOiAndV9zdGF0ZScsXG5cdFx0XHRcdFx0XHR2YWx1ZTogMCxcblx0XHRcdFx0XHRcdGRhdGFUeXBlOiBJTlQsXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XSxcblx0XHRcdH0sXG5cdFx0KTtcblx0XHRpZiAoZ2xzbFZlcnNpb24gPT09IEdMU0wzKSB7XG5cdFx0XHR0aGlzLmNvcHlJbnRQcm9ncmFtID0gdGhpcy5pbml0UHJvZ3JhbSh7XG5cdFx0XHRcdG5hbWU6ICdjb3B5SW50Jyxcblx0XHRcdFx0ZnJhZ21lbnRTaGFkZXI6IHJlcXVpcmUoJy4vZ2xzbF8zL0NvcHlJbnRGcmFnU2hhZGVyLmdsc2wnKSxcblx0XHRcdFx0dW5pZm9ybXM6IFtcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0bmFtZTogJ3Vfc3RhdGUnLFxuXHRcdFx0XHRcdFx0XHR2YWx1ZTogMCxcblx0XHRcdFx0XHRcdFx0ZGF0YVR5cGU6IElOVCxcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XSxcblx0XHRcdFx0fSxcblx0XHRcdCk7XG5cdFx0XHR0aGlzLmNvcHlVaW50UHJvZ3JhbSA9IHRoaXMuaW5pdFByb2dyYW0oe1xuXHRcdFx0XHRuYW1lOiAnY29weVVpbnQnLFxuXHRcdFx0XHRmcmFnbWVudFNoYWRlcjogcmVxdWlyZSgnLi9nbHNsXzMvQ29weVVpbnRGcmFnU2hhZGVyLmdsc2wnKSxcblx0XHRcdFx0dW5pZm9ybXM6IFtcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0bmFtZTogJ3Vfc3RhdGUnLFxuXHRcdFx0XHRcdFx0XHR2YWx1ZTogMCxcblx0XHRcdFx0XHRcdFx0ZGF0YVR5cGU6IElOVCxcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XSxcblx0XHRcdFx0fSxcblx0XHRcdCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuY29weUludFByb2dyYW0gPSB0aGlzLmNvcHlGbG9hdFByb2dyYW07XG5cdFx0XHR0aGlzLmNvcHlVaW50UHJvZ3JhbSA9IHRoaXMuY29weUZsb2F0UHJvZ3JhbTtcblx0XHR9XG5cblx0XHQvLyBVbmJpbmQgYWN0aXZlIGJ1ZmZlci5cblx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgbnVsbCk7XG5cblx0XHQvLyBDYW52YXMgc2V0dXAuXG5cdFx0dGhpcy5vblJlc2l6ZShjYW52YXMpO1xuXG5cdFx0Ly8gTG9nIG51bWJlciBvZiB0ZXh0dXJlcyBhdmFpbGFibGUuXG5cdFx0dGhpcy5tYXhOdW1UZXh0dXJlcyA9IHRoaXMuZ2wuZ2V0UGFyYW1ldGVyKHRoaXMuZ2wuTUFYX1RFWFRVUkVfSU1BR0VfVU5JVFMpO1xuXHRcdGNvbnNvbGUubG9nKGAke3RoaXMubWF4TnVtVGV4dHVyZXN9IHRleHR1cmVzIG1heC5gKTtcblx0fVxuXG5cdHByaXZhdGUgZ2V0IHNpbmdsZUNvbG9yUHJvZ3JhbSgpIHtcblx0XHRpZiAodGhpcy5fc2luZ2xlQ29sb3JQcm9ncmFtID09PSB1bmRlZmluZWQpIHtcblx0XHRcdGNvbnN0IHByb2dyYW0gPSB0aGlzLmluaXRQcm9ncmFtKHtcblx0XHRcdFx0bmFtZTogJ3NpbmdsZUNvbG9yJyxcblx0XHRcdFx0ZnJhZ21lbnRTaGFkZXI6IHRoaXMuZ2xzbFZlcnNpb24gPT09IEdMU0wzID8gcmVxdWlyZSgnLi9nbHNsXzMvU2luZ2xlQ29sb3JGcmFnU2hhZGVyLmdsc2wnKSA6IHJlcXVpcmUoJy4vZ2xzbF8xL1NpbmdsZUNvbG9yRnJhZ1NoYWRlci5nbHNsJyksXG5cdFx0XHR9KTtcblx0XHRcdHRoaXMuX3NpbmdsZUNvbG9yUHJvZ3JhbSA9IHByb2dyYW07XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLl9zaW5nbGVDb2xvclByb2dyYW07XG5cdH1cblxuXHRwcml2YXRlIGdldCBzaW5nbGVDb2xvcldpdGhXcmFwQ2hlY2tQcm9ncmFtKCkge1xuXHRcdGlmICh0aGlzLl9zaW5nbGVDb2xvcldpdGhXcmFwQ2hlY2tQcm9ncmFtID09PSB1bmRlZmluZWQpIHtcblx0XHRcdGNvbnN0IHByb2dyYW0gPSB0aGlzLmluaXRQcm9ncmFtKHtcblx0XHRcdFx0bmFtZTogJ3NpbmdsZUNvbG9yV2l0aFdyYXBDaGVjaycsXG5cdFx0XHRcdGZyYWdtZW50U2hhZGVyOiB0aGlzLmdsc2xWZXJzaW9uID09PSBHTFNMMyA/IHJlcXVpcmUoJy4vZ2xzbF8zL1NpbmdsZUNvbG9yV2l0aFdyYXBDaGVja0ZyYWdTaGFkZXIuZ2xzbCcpIDogcmVxdWlyZSgnLi9nbHNsXzEvU2luZ2xlQ29sb3JXaXRoV3JhcENoZWNrRnJhZ1NoYWRlci5nbHNsJyksXG5cdFx0XHR9KTtcblx0XHRcdHRoaXMuX3NpbmdsZUNvbG9yV2l0aFdyYXBDaGVja1Byb2dyYW0gPSBwcm9ncmFtO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5fc2luZ2xlQ29sb3JXaXRoV3JhcENoZWNrUHJvZ3JhbTtcblx0fVxuXG5cdHByaXZhdGUgZ2V0IHZlY3Rvck1hZ25pdHVkZVByb2dyYW0oKSB7XG5cdFx0aWYgKHRoaXMuX3ZlY3Rvck1hZ25pdHVkZVByb2dyYW0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Y29uc3QgcHJvZ3JhbSA9IHRoaXMuaW5pdFByb2dyYW0oe1xuXHRcdFx0XHRuYW1lOiAndmVjdG9yTWFnbml0dWRlJyxcblx0XHRcdFx0ZnJhZ21lbnRTaGFkZXI6IHRoaXMuZ2xzbFZlcnNpb24gPT09IEdMU0wzID8gcmVxdWlyZSgnLi9nbHNsXzMvVmVjdG9yTWFnbml0dWRlRnJhZ1NoYWRlci5nbHNsJykgOiByZXF1aXJlKCcuL2dsc2xfMS9WZWN0b3JNYWduaXR1ZGVGcmFnU2hhZGVyLmdsc2wnKSxcblx0XHRcdH0pO1xuXHRcdFx0dGhpcy5fdmVjdG9yTWFnbml0dWRlUHJvZ3JhbSA9IHByb2dyYW07XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLl92ZWN0b3JNYWduaXR1ZGVQcm9ncmFtO1xuXHR9XG5cblx0aXNXZWJHTDIoKSB7XG5cdFx0cmV0dXJuIGlzV2ViR0wyKHRoaXMuZ2wpO1xuXHR9XG5cblx0cHJpdmF0ZSBnZXQgcXVhZFBvc2l0aW9uc0J1ZmZlcigpIHtcblx0XHRpZiAodGhpcy5fcXVhZFBvc2l0aW9uc0J1ZmZlciA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRjb25zdCBmc1F1YWRQb3NpdGlvbnMgPSBuZXcgRmxvYXQzMkFycmF5KFsgLTEsIC0xLCAxLCAtMSwgLTEsIDEsIDEsIDEgXSk7XG5cdFx0XHR0aGlzLl9xdWFkUG9zaXRpb25zQnVmZmVyID0gdGhpcy5pbml0VmVydGV4QnVmZmVyKGZzUXVhZFBvc2l0aW9ucykhO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5fcXVhZFBvc2l0aW9uc0J1ZmZlciE7XG5cdH1cblxuXHRwcml2YXRlIGdldCBib3VuZGFyeVBvc2l0aW9uc0J1ZmZlcigpIHtcblx0XHRpZiAodGhpcy5fYm91bmRhcnlQb3NpdGlvbnNCdWZmZXIgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Y29uc3QgYm91bmRhcnlQb3NpdGlvbnMgPSBuZXcgRmxvYXQzMkFycmF5KFsgLTEsIC0xLCAxLCAtMSwgMSwgMSwgLTEsIDEsIC0xLCAtMSBdKTtcblx0XHRcdHRoaXMuX2JvdW5kYXJ5UG9zaXRpb25zQnVmZmVyID0gdGhpcy5pbml0VmVydGV4QnVmZmVyKGJvdW5kYXJ5UG9zaXRpb25zKSE7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLl9ib3VuZGFyeVBvc2l0aW9uc0J1ZmZlciE7XG5cdH1cblxuXHRwcml2YXRlIGdldENpcmNsZVBvc2l0aW9uc0J1ZmZlcihudW1TZWdtZW50czogbnVtYmVyKSB7XG5cdFx0aWYgKHRoaXMuX2NpcmNsZVBvc2l0aW9uc0J1ZmZlcltudW1TZWdtZW50c10gPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRjb25zdCB1bml0Q2lyY2xlUG9pbnRzID0gWzAsIDBdO1xuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPD0gbnVtU2VnbWVudHM7IGkrKykge1xuXHRcdFx0XHR1bml0Q2lyY2xlUG9pbnRzLnB1c2goXG5cdFx0XHRcdFx0TWF0aC5jb3MoMiAqIE1hdGguUEkgKiBpIC8gbnVtU2VnbWVudHMpLFxuXHRcdFx0XHRcdE1hdGguc2luKDIgKiBNYXRoLlBJICogaSAvIG51bVNlZ21lbnRzKSxcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHRcdGNvbnN0IGNpcmNsZVBvc2l0aW9ucyA9IG5ldyBGbG9hdDMyQXJyYXkodW5pdENpcmNsZVBvaW50cyk7XG5cdFx0XHRjb25zdCBidWZmZXIgPSB0aGlzLmluaXRWZXJ0ZXhCdWZmZXIoY2lyY2xlUG9zaXRpb25zKSE7XG5cdFx0XHR0aGlzLl9jaXJjbGVQb3NpdGlvbnNCdWZmZXJbbnVtU2VnbWVudHNdID0gYnVmZmVyO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5fY2lyY2xlUG9zaXRpb25zQnVmZmVyW251bVNlZ21lbnRzXTtcblx0fVxuXG5cdHByaXZhdGUgaW5pdFZlcnRleEJ1ZmZlcihcblx0XHRkYXRhOiBGbG9hdDMyQXJyYXksXG5cdCkge1xuXHRcdGNvbnN0IHsgZXJyb3JDYWxsYmFjaywgZ2wgfSA9IHRoaXM7XG5cdFx0Y29uc3QgYnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKCk7XG5cdFx0aWYgKCFidWZmZXIpIHtcblx0XHRcdGVycm9yQ2FsbGJhY2soJ1VuYWJsZSB0byBhbGxvY2F0ZSBnbCBidWZmZXIuJyk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBidWZmZXIpO1xuXHRcdC8vIEFkZCBidWZmZXIgZGF0YS5cblx0XHRnbC5idWZmZXJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgZGF0YSwgZ2wuU1RBVElDX0RSQVcpO1xuXHRcdHJldHVybiBidWZmZXI7XG5cdH1cblxuXHRpbml0UHJvZ3JhbShcblx0XHRwYXJhbXM6IHtcblx0XHRcdG5hbWU6IHN0cmluZyxcblx0XHRcdGZyYWdtZW50U2hhZGVyOiBzdHJpbmcgfCBXZWJHTFNoYWRlcixcblx0XHRcdHVuaWZvcm1zPzoge1xuXHRcdFx0XHRuYW1lOiBzdHJpbmcsXG5cdFx0XHRcdHZhbHVlOiBVbmlmb3JtVmFsdWVUeXBlLFxuXHRcdFx0XHRkYXRhVHlwZTogVW5pZm9ybURhdGFUeXBlLFxuXHRcdFx0fVtdLFxuXHRcdFx0ZGVmaW5lcz86IHtcblx0XHRcdFx0W2tleSA6IHN0cmluZ106IHN0cmluZyxcblx0XHRcdH0sXG5cdFx0fSxcblx0KSB7XG5cdFx0Ly8gQ2hlY2sgcGFyYW1zLlxuXHRcdGNvbnN0IHZhbGlkS2V5cyA9IFsnbmFtZScsICdmcmFnbWVudFNoYWRlcicsICd1bmlmb3JtcycsICdkZWZpbmVzJ107XG5cdFx0T2JqZWN0LmtleXMocGFyYW1zKS5mb3JFYWNoKGtleSA9PiB7XG5cdFx0XHRpZiAodmFsaWRLZXlzLmluZGV4T2Yoa2V5KSA8IDApIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGtleSAke2tleX0gcGFzc2VkIHRvIFdlYkdMQ29tcHV0ZS5pbml0UHJvZ3JhbSB3aXRoIG5hbWUgXCIke3BhcmFtcy5uYW1lfVwiLiAgVmFsaWQga2V5cyBhcmUgJHt2YWxpZEtleXMuam9pbignLCAnKX0uYCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0Y29uc3QgeyBnbCwgZXJyb3JDYWxsYmFjaywgZ2xzbFZlcnNpb24gfSA9IHRoaXM7XG5cdFx0cmV0dXJuIG5ldyBHUFVQcm9ncmFtKFxuXHRcdFx0e1xuXHRcdFx0XHQuLi5wYXJhbXMsXG5cdFx0XHRcdGdsLFxuXHRcdFx0XHRlcnJvckNhbGxiYWNrLFxuXHRcdFx0XHRnbHNsVmVyc2lvbixcblx0XHRcdH0sXG5cdFx0KTtcblx0fTtcblxuXHRpbml0RGF0YUxheWVyKFxuXHRcdHBhcmFtczoge1xuXHRcdFx0bmFtZTogc3RyaW5nLFxuXHRcdFx0ZGltZW5zaW9uczogbnVtYmVyIHwgW251bWJlciwgbnVtYmVyXSxcblx0XHRcdHR5cGU6IERhdGFMYXllclR5cGUsXG5cdFx0XHRudW1Db21wb25lbnRzOiBEYXRhTGF5ZXJOdW1Db21wb25lbnRzLFxuXHRcdFx0ZGF0YT86IERhdGFMYXllckFycmF5VHlwZSxcblx0XHRcdGZpbHRlcj86IERhdGFMYXllckZpbHRlclR5cGUsXG5cdFx0XHR3cmFwUz86IERhdGFMYXllcldyYXBUeXBlLFxuXHRcdFx0d3JhcFQ/OiBEYXRhTGF5ZXJXcmFwVHlwZSxcblx0XHRcdHdyaXRhYmxlPzogYm9vbGVhbixcblx0XHRcdG51bUJ1ZmZlcnM/OiBudW1iZXIsXG5cdFx0fSxcblx0KSB7XG5cdFx0Ly8gQ2hlY2sgcGFyYW1zLlxuXHRcdGNvbnN0IHZhbGlkS2V5cyA9IFsnbmFtZScsICdkaW1lbnNpb25zJywgJ3R5cGUnLCAnbnVtQ29tcG9uZW50cycsICdkYXRhJywgJ2ZpbHRlcicsICd3cmFwUycsICd3cmFwVCcsICd3cml0YWJsZScsICdudW1CdWZmZXJzJ107XG5cdFx0T2JqZWN0LmtleXMocGFyYW1zKS5mb3JFYWNoKGtleSA9PiB7XG5cdFx0XHRpZiAodmFsaWRLZXlzLmluZGV4T2Yoa2V5KSA8IDApIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGtleSAke2tleX0gcGFzc2VkIHRvIFdlYkdMQ29tcHV0ZS5pbml0RGF0YUxheWVyIHdpdGggbmFtZSBcIiR7cGFyYW1zLm5hbWV9XCIuICBWYWxpZCBrZXlzIGFyZSAke3ZhbGlkS2V5cy5qb2luKCcsICcpfS5gKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRjb25zdCB7IGdsLCBlcnJvckNhbGxiYWNrLCBnbHNsVmVyc2lvbiB9ID0gdGhpcztcblx0XHRyZXR1cm4gbmV3IERhdGFMYXllcih7XG5cdFx0XHQuLi5wYXJhbXMsXG5cdFx0XHRnbCxcblx0XHRcdGdsc2xWZXJzaW9uLFxuXHRcdFx0ZXJyb3JDYWxsYmFjayxcblx0XHR9KTtcblx0fTtcblxuXHRjbG9uZURhdGFMYXllcihkYXRhTGF5ZXI6IERhdGFMYXllcikge1xuXHRcdGxldCBkaW1lbnNpb25zOiBudW1iZXIgfCBbbnVtYmVyLCBudW1iZXJdID0gMDtcblx0XHR0cnkge1xuXHRcdFx0ZGltZW5zaW9ucyA9IGRhdGFMYXllci5nZXRMZW5ndGgoKTtcblx0XHR9IGNhdGNoIHtcblx0XHRcdGRpbWVuc2lvbnMgPSBkYXRhTGF5ZXIuZ2V0RGltZW5zaW9ucygpO1xuXHRcdH1cblxuXHRcdC8vIElmIHJlYWQgb25seSwgZ2V0IGluaXRpYWxpemF0aW9uIGRhdGEgaWYgaXQgZXhpc3RzLlxuXHRcdGNvbnN0IGRhdGEgPSBkYXRhTGF5ZXIud3JpdGFibGUgPyB1bmRlZmluZWQgOiBkYXRhTGF5ZXIuaW5pdGlhbGl6YXRpb25EYXRhO1xuXG5cdFx0Y29uc3QgY2xvbmUgPSB0aGlzLmluaXREYXRhTGF5ZXIoe1xuXHRcdFx0bmFtZTogYCR7ZGF0YUxheWVyLm5hbWV9LWNvcHlgLFxuXHRcdFx0ZGltZW5zaW9uczogZGltZW5zaW9ucyxcblx0XHRcdHR5cGU6IGRhdGFMYXllci50eXBlLFxuXHRcdFx0bnVtQ29tcG9uZW50czogZGF0YUxheWVyLm51bUNvbXBvbmVudHMsXG5cdFx0XHRkYXRhLFxuXHRcdFx0ZmlsdGVyOiBkYXRhTGF5ZXIuZmlsdGVyLFxuXHRcdFx0d3JhcFM6IGRhdGFMYXllci53cmFwUyxcblx0XHRcdHdyYXBUOiBkYXRhTGF5ZXIud3JhcFQsXG5cdFx0XHR3cml0YWJsZTogZGF0YUxheWVyLndyaXRhYmxlLFxuXHRcdFx0bnVtQnVmZmVyczogZGF0YUxheWVyLm51bUJ1ZmZlcnMsXG5cdFx0fSk7XG5cblx0XHQvLyBJZiB3cml0YWJsZSwgY29weSBjdXJyZW50IHN0YXRlLlxuXHRcdGlmIChkYXRhTGF5ZXIud3JpdGFibGUpIHtcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YUxheWVyLm51bUJ1ZmZlcnM7IGkrKykge1xuXHRcdFx0XHR0aGlzLnN0ZXAoe1xuXHRcdFx0XHRcdHByb2dyYW06IHRoaXMuY29weVByb2dyYW1Gb3JUeXBlKGRhdGFMYXllci50eXBlKSxcblx0XHRcdFx0XHRpbnB1dDogZGF0YUxheWVyLmdldFByZXZpb3VzU3RhdGVUZXh0dXJlKC1kYXRhTGF5ZXIubnVtQnVmZmVycyArIGkgKyAxKSxcblx0XHRcdFx0XHRvdXRwdXQ6IGNsb25lLFxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGNsb25lO1xuXHR9XG5cblx0aW5pdFRleHR1cmUoXG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRuYW1lOiBzdHJpbmcsXG5cdFx0XHR1cmw6IHN0cmluZyxcblx0XHRcdGZpbHRlcj86IERhdGFMYXllckZpbHRlclR5cGUsXG5cdFx0XHR3cmFwUz86IERhdGFMYXllcldyYXBUeXBlLFxuXHRcdFx0d3JhcFQ/OiBEYXRhTGF5ZXJXcmFwVHlwZSxcblx0XHRcdGZvcm1hdD86IFRleHR1cmVGb3JtYXRUeXBlLFxuXHRcdFx0dHlwZT86IFRleHR1cmVEYXRhVHlwZSxcblx0XHRcdG9uTG9hZD86ICh0ZXh0dXJlOiBXZWJHTFRleHR1cmUpID0+IHZvaWQsXG5cdFx0fSxcblx0KSB7XG5cdFx0Ly8gQ2hlY2sgcGFyYW1zLlxuXHRcdGNvbnN0IHZhbGlkS2V5cyA9IFsnbmFtZScsICd1cmwnLCAnZmlsdGVyJywgJ3dyYXBTJywgJ3dyYXBUJywgJ2Zvcm1hdCcsICd0eXBlJywgJ29uTG9hZCddO1xuXHRcdE9iamVjdC5rZXlzKHBhcmFtcykuZm9yRWFjaChrZXkgPT4ge1xuXHRcdFx0aWYgKHZhbGlkS2V5cy5pbmRleE9mKGtleSkgPCAwKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBrZXkgJHtrZXl9IHBhc3NlZCB0byBXZWJHTENvbXB1dGUuaW5pdFRleHR1cmUgd2l0aCBuYW1lIFwiJHtwYXJhbXMubmFtZX1cIi4gIFZhbGlkIGtleXMgYXJlICR7dmFsaWRLZXlzLmpvaW4oJywgJyl9LmApO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdGNvbnN0IHsgdXJsLCBuYW1lIH0gPSBwYXJhbXM7XG5cdFx0aWYgKCFpc1N0cmluZyh1cmwpKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIFdlYkdMQ29tcHV0ZS5pbml0VGV4dHVyZSBwYXJhbXMgdG8gaGF2ZSB1cmwgb2YgdHlwZSBzdHJpbmcsIGdvdCAke3VybH0gb2YgdHlwZSAke3R5cGVvZiB1cmx9LmApXG5cdFx0fVxuXHRcdGlmICghaXNTdHJpbmcobmFtZSkpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgV2ViR0xDb21wdXRlLmluaXRUZXh0dXJlIHBhcmFtcyB0byBoYXZlIG5hbWUgb2YgdHlwZSBzdHJpbmcsIGdvdCAke25hbWV9IG9mIHR5cGUgJHt0eXBlb2YgbmFtZX0uYClcblx0XHR9XG5cblx0XHQvLyBHZXQgZmlsdGVyIHR5cGUsIGRlZmF1bHQgdG8gbmVhcmVzdC5cblx0XHRjb25zdCBmaWx0ZXIgPSBwYXJhbXMuZmlsdGVyICE9PSB1bmRlZmluZWQgPyBwYXJhbXMuZmlsdGVyIDogTkVBUkVTVDtcblx0XHRpZiAoIWlzVmFsaWRGaWx0ZXJUeXBlKGZpbHRlcikpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBmaWx0ZXI6ICR7ZmlsdGVyfSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLCBtdXN0IGJlICR7dmFsaWRGaWx0ZXJUeXBlcy5qb2luKCcsICcpfS5gKTtcblx0XHR9XG5cblx0XHQvLyBHZXQgd3JhcCB0eXBlcywgZGVmYXVsdCB0byBjbGFtcCB0byBlZGdlLlxuXHRcdGNvbnN0IHdyYXBTID0gcGFyYW1zLndyYXBTICE9PSB1bmRlZmluZWQgPyBwYXJhbXMud3JhcFMgOiBDTEFNUF9UT19FREdFO1xuXHRcdGlmICghaXNWYWxpZFdyYXBUeXBlKHdyYXBTKSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHdyYXBTOiAke3dyYXBTfSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLCBtdXN0IGJlICR7dmFsaWRXcmFwVHlwZXMuam9pbignLCAnKX0uYCk7XG5cdFx0fVxuXHRcdGNvbnN0IHdyYXBUID0gcGFyYW1zLndyYXBUICE9PSB1bmRlZmluZWQgPyBwYXJhbXMud3JhcFQgOiBDTEFNUF9UT19FREdFO1xuXHRcdGlmICghaXNWYWxpZFdyYXBUeXBlKHdyYXBUKSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHdyYXBUOiAke3dyYXBUfSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLCBtdXN0IGJlICR7dmFsaWRXcmFwVHlwZXMuam9pbignLCAnKX0uYCk7XG5cdFx0fVxuXG5cdFx0Ly8gR2V0IGltYWdlIGZvcm1hdCB0eXBlLCBkZWZhdWx0IHRvIHJnYmEuXG5cdFx0Y29uc3QgZm9ybWF0ID0gcGFyYW1zLmZvcm1hdCAhPT0gdW5kZWZpbmVkID8gcGFyYW1zLmZvcm1hdCA6IFJHQkE7XG5cdFx0aWYgKCFpc1ZhbGlkVGV4dHVyZUZvcm1hdFR5cGUoZm9ybWF0KSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGZvcm1hdDogJHtmb3JtYXR9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIsIG11c3QgYmUgJHt2YWxpZFRleHR1cmVGb3JtYXRUeXBlcy5qb2luKCcsICcpfS5gKTtcblx0XHR9XG5cblx0XHQvLyBHZXQgaW1hZ2UgZGF0YSB0eXBlLCBkZWZhdWx0IHRvIHVuc2lnbmVkIGJ5dGUuXG5cdFx0Y29uc3QgdHlwZSA9IHBhcmFtcy50eXBlICE9PSB1bmRlZmluZWQgPyBwYXJhbXMudHlwZSA6IFVOU0lHTkVEX0JZVEU7XG5cdFx0aWYgKCFpc1ZhbGlkVGV4dHVyZURhdGFUeXBlKHR5cGUpKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdHlwZTogJHt0eXBlfSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLCBtdXN0IGJlICR7dmFsaWRUZXh0dXJlRGF0YVR5cGVzLmpvaW4oJywgJyl9LmApO1xuXHRcdH1cblxuXHRcdGNvbnN0IHsgZ2wsIGVycm9yQ2FsbGJhY2sgfSA9IHRoaXM7XG5cdFx0Y29uc3QgdGV4dHVyZSA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcblx0XHRpZiAodGV4dHVyZSA9PT0gbnVsbCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gaW5pdCBnbFRleHR1cmUuYCk7XG5cdFx0fVxuXHRcdGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIHRleHR1cmUpO1xuXHRcdC8vIEJlY2F1c2UgaW1hZ2VzIGhhdmUgdG8gYmUgZG93bmxvYWRlZCBvdmVyIHRoZSBpbnRlcm5ldFxuXHRcdC8vIHRoZXkgbWlnaHQgdGFrZSBhIG1vbWVudCB1bnRpbCB0aGV5IGFyZSByZWFkeS5cblx0XHQvLyBVbnRpbCB0aGVuIHB1dCBhIHNpbmdsZSBwaXhlbCBpbiB0aGUgdGV4dHVyZSBzbyB3ZSBjYW5cblx0XHQvLyB1c2UgaXQgaW1tZWRpYXRlbHkuIFdoZW4gdGhlIGltYWdlIGhhcyBmaW5pc2hlZCBkb3dubG9hZGluZ1xuXHRcdC8vIHdlJ2xsIHVwZGF0ZSB0aGUgdGV4dHVyZSB3aXRoIHRoZSBjb250ZW50cyBvZiB0aGUgaW1hZ2UuXG5cdFx0Y29uc3QgbGV2ZWwgPSAwO1xuXHRcdGNvbnN0IGludGVybmFsRm9ybWF0ID0gZ2wuUkdCQTtcblx0XHRjb25zdCB3aWR0aCA9IDE7XG5cdFx0Y29uc3QgaGVpZ2h0ID0gMTtcblx0XHRjb25zdCBib3JkZXIgPSAwO1xuXHRcdGNvbnN0IHNyY0Zvcm1hdCA9IGdsW2Zvcm1hdF07XG5cdFx0Y29uc3Qgc3JjVHlwZSA9IGdsW3R5cGVdO1xuXHRcdGNvbnN0IHBpeGVsID0gbmV3IFVpbnQ4QXJyYXkoWzAsIDAsIDAsIDBdKTtcblx0XHRnbC50ZXhJbWFnZTJEKGdsLlRFWFRVUkVfMkQsIGxldmVsLCBpbnRlcm5hbEZvcm1hdCxcblx0XHRcdHdpZHRoLCBoZWlnaHQsIGJvcmRlciwgc3JjRm9ybWF0LCBzcmNUeXBlLCBwaXhlbCk7XG5cblx0XHRjb25zdCBpbWFnZSA9IG5ldyBJbWFnZSgpO1xuXHRcdGltYWdlLm9ubG9hZCA9ICgpID0+IHtcblx0XHRcdGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIHRleHR1cmUpO1xuXHRcdFx0Z2wudGV4SW1hZ2UyRChnbC5URVhUVVJFXzJELCBsZXZlbCwgaW50ZXJuYWxGb3JtYXQsXG5cdFx0XHRcdHNyY0Zvcm1hdCwgc3JjVHlwZSwgaW1hZ2UpO1xuXG5cdFx0XHQvLyBXZWJHTDEgaGFzIGRpZmZlcmVudCByZXF1aXJlbWVudHMgZm9yIHBvd2VyIG9mIDIgaW1hZ2VzXG5cdFx0XHQvLyB2cyBub24gcG93ZXIgb2YgMiBpbWFnZXMgc28gY2hlY2sgaWYgdGhlIGltYWdlIGlzIGFcblx0XHRcdC8vIHBvd2VyIG9mIDIgaW4gYm90aCBkaW1lbnNpb25zLlxuXHRcdFx0aWYgKGlzUG93ZXJPZjIoaW1hZ2Uud2lkdGgpICYmIGlzUG93ZXJPZjIoaW1hZ2UuaGVpZ2h0KSkge1xuXHRcdFx0XHQvLyAvLyBZZXMsIGl0J3MgYSBwb3dlciBvZiAyLiBHZW5lcmF0ZSBtaXBzLlxuXHRcdFx0XHQvLyBnbC5nZW5lcmF0ZU1pcG1hcChnbC5URVhUVVJFXzJEKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIFRPRE86IGZpbmlzaCBpbXBsZW1lbnRpbmcgdGhpcy5cblx0XHRcdFx0Y29uc29sZS53YXJuKGBUZXh0dXJlICR7bmFtZX0gZGltZW5zaW9ucyBbJHtpbWFnZS53aWR0aH0sICR7aW1hZ2UuaGVpZ2h0fV0gYXJlIG5vdCBwb3dlciBvZiAyLmApO1xuXHRcdFx0XHQvLyAvLyBObywgaXQncyBub3QgYSBwb3dlciBvZiAyLiBUdXJuIG9mZiBtaXBzIGFuZCBzZXRcblx0XHRcdFx0Ly8gLy8gd3JhcHBpbmcgdG8gY2xhbXAgdG8gZWRnZVxuXHRcdFx0XHQvLyBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9TLCBnbC5DTEFNUF9UT19FREdFKTtcblx0XHRcdFx0Ly8gZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfVCwgZ2wuQ0xBTVBfVE9fRURHRSk7XG5cdFx0XHR9XG5cdFx0XHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9TLCBnbFt3cmFwU10pO1xuXHRcdFx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfVCwgZ2xbd3JhcFRdKTtcblx0XHRcdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBnbFtmaWx0ZXJdKTtcblx0XHRcdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCBnbFtmaWx0ZXJdKTtcblxuXHRcdFx0Ly8gQ2FsbGJhY2sgd2hlbiB0ZXh0dXJlIGhhcyBsb2FkZWQuXG5cdFx0XHRpZiAocGFyYW1zLm9uTG9hZCkgcGFyYW1zLm9uTG9hZCh0ZXh0dXJlKTtcblx0XHR9O1xuXHRcdGltYWdlLm9uZXJyb3IgPSAoZSkgPT4ge1xuXHRcdFx0ZXJyb3JDYWxsYmFjayhgRXJyb3IgbG9hZGluZyBpbWFnZSAke25hbWV9OiAke2V9YCk7XG5cdFx0fVxuXHRcdGltYWdlLnNyYyA9IHVybDtcblxuXHRcdHJldHVybiB0ZXh0dXJlO1xuXHR9XG5cblx0b25SZXNpemUoY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCkge1xuXHRcdGNvbnN0IHdpZHRoID0gY2FudmFzLmNsaWVudFdpZHRoO1xuXHRcdGNvbnN0IGhlaWdodCA9IGNhbnZhcy5jbGllbnRIZWlnaHQ7XG5cdFx0Ly8gU2V0IGNvcnJlY3QgY2FudmFzIHBpeGVsIHNpemUuXG5cdFx0Ly8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1dlYkdMX0FQSS9CeV9leGFtcGxlL0NhbnZhc19zaXplX2FuZF9XZWJHTFxuXHRcdGNhbnZhcy53aWR0aCA9IHdpZHRoO1xuXHRcdGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XG5cdFx0Ly8gU2F2ZSBkaW1lbnNpb25zLlxuXHRcdHRoaXMud2lkdGggPSB3aWR0aDtcblx0XHR0aGlzLmhlaWdodCA9IGhlaWdodDtcblx0fTtcblxuXHRwcml2YXRlIGRyYXdTZXR1cChcblx0XHRwcm9ncmFtOiBXZWJHTFByb2dyYW0sXG5cdFx0ZnVsbHNjcmVlblJlbmRlcjogYm9vbGVhbixcblx0XHRpbnB1dD86IChEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUpW10gfCBEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUsXG5cdFx0b3V0cHV0PzogRGF0YUxheWVyLFxuXHQpIHtcblx0XHRjb25zdCB7IGdsIH0gPSB0aGlzO1xuXHRcdC8vIENoZWNrIGlmIHdlIGFyZSBpbiBhbiBlcnJvciBzdGF0ZS5cblx0XHRpZiAoIXByb2dyYW0pIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBDQVVUSU9OOiB0aGUgb3JkZXIgb2YgdGhlc2UgbmV4dCBmZXcgbGluZXMgaXMgaW1wb3J0YW50LlxuXG5cdFx0Ly8gR2V0IGEgc2hhbGxvdyBjb3B5IG9mIGN1cnJlbnQgdGV4dHVyZXMuXG5cdFx0Ly8gVGhpcyBsaW5lIG11c3QgY29tZSBiZWZvcmUgdGhpcy5zZXRPdXRwdXQoKSBhcyBpdCBkZXBlbmRzIG9uIGN1cnJlbnQgaW50ZXJuYWwgc3RhdGUuXG5cdFx0Y29uc3QgaW5wdXRUZXh0dXJlczogV2ViR0xUZXh0dXJlW10gPSBbXTtcblx0XHRpZiAoaW5wdXQpIHtcblx0XHRcdGlmIChpbnB1dC5jb25zdHJ1Y3RvciA9PT0gV2ViR0xUZXh0dXJlKSB7XG5cdFx0XHRcdGlucHV0VGV4dHVyZXMucHVzaChpbnB1dCBhcyBXZWJHTFRleHR1cmUpO1xuXHRcdFx0fSBlbHNlIGlmIChpbnB1dC5jb25zdHJ1Y3RvciA9PT0gRGF0YUxheWVyKSB7XG5cdFx0XHRcdGlucHV0VGV4dHVyZXMucHVzaCgoaW5wdXQgYXMgRGF0YUxheWVyKS5nZXRDdXJyZW50U3RhdGVUZXh0dXJlKCkpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCAoaW5wdXQgYXMgKERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSlbXSkubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRjb25zdCBsYXllciA9IChpbnB1dCBhcyAoRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlKVtdKVtpXTtcblx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdFx0aW5wdXRUZXh0dXJlcy5wdXNoKChsYXllciBhcyBEYXRhTGF5ZXIpLmdldEN1cnJlbnRTdGF0ZVRleHR1cmUgPyAobGF5ZXIgYXMgRGF0YUxheWVyKS5nZXRDdXJyZW50U3RhdGVUZXh0dXJlKCkgOiBsYXllciBhcyBXZWJHTFRleHR1cmUpXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBTZXQgb3V0cHV0IGZyYW1lYnVmZmVyLlxuXHRcdC8vIFRoaXMgbWF5IG1vZGlmeSBXZWJHTCBpbnRlcm5hbCBzdGF0ZS5cblx0XHR0aGlzLnNldE91dHB1dExheWVyKGZ1bGxzY3JlZW5SZW5kZXIsIGlucHV0LCBvdXRwdXQpO1xuXG5cdFx0Ly8gU2V0IGN1cnJlbnQgcHJvZ3JhbS5cblx0XHRnbC51c2VQcm9ncmFtKHByb2dyYW0pO1xuXG5cdFx0Ly8gU2V0IGlucHV0IHRleHR1cmVzLlxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgaW5wdXRUZXh0dXJlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0Z2wuYWN0aXZlVGV4dHVyZShnbC5URVhUVVJFMCArIGkpO1xuXHRcdFx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgaW5wdXRUZXh0dXJlc1tpXSk7XG5cdFx0fVxuXHR9XG5cblx0Y29weVByb2dyYW1Gb3JUeXBlKHR5cGU6IERhdGFMYXllclR5cGUpIHtcblx0XHRzd2l0Y2ggKHR5cGUpIHtcblx0XHRcdGNhc2UgSEFMRl9GTE9BVDpcblx0XHRcdGNhc2UgRkxPQVQ6XG5cdFx0XHRcdHJldHVybiB0aGlzLmNvcHlGbG9hdFByb2dyYW07XG5cdFx0XHRjYXNlIFVOU0lHTkVEX0JZVEU6XG5cdFx0XHRjYXNlIFVOU0lHTkVEX1NIT1JUOlxuXHRcdFx0Y2FzZSBVTlNJR05FRF9JTlQ6XG5cdFx0XHRcdHJldHVybiB0aGlzLmNvcHlVaW50UHJvZ3JhbTtcblx0XHRcdGNhc2UgQllURTpcblx0XHRcdGNhc2UgU0hPUlQ6XG5cdFx0XHRjYXNlIElOVDpcblx0XHRcdFx0cmV0dXJuIHRoaXMuY29weUludFByb2dyYW07XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdHlwZTogJHt0eXBlfSBwYXNzZWQgdG8gV2ViR0xDb21wdXRlLmNvcHlQcm9ncmFtRm9yVHlwZS5gKTtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIHNldEJsZW5kTW9kZShzaG91bGRCbGVuZEFscGhhPzogYm9vbGVhbikge1xuXHRcdGNvbnN0IHsgZ2wgfSA9IHRoaXM7XG5cdFx0aWYgKHNob3VsZEJsZW5kQWxwaGEpIHtcblx0XHRcdGdsLmVuYWJsZShnbC5CTEVORCk7XG5cdFx0XHRnbC5ibGVuZEZ1bmMoZ2wuU1JDX0FMUEhBLCBnbC5PTkVfTUlOVVNfU1JDX0FMUEhBKTtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIGFkZExheWVyVG9JbnB1dHMoXG5cdFx0bGF5ZXI6IERhdGFMYXllcixcblx0XHRpbnB1dD86ICAoRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlKVtdIHwgRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlLFxuXHQpIHtcblx0XHQvLyBBZGQgbGF5ZXIgdG8gZW5kIG9mIGlucHV0IGlmIG5lZWRlZC5cblx0XHRsZXQgX2lucHV0TGF5ZXJzID0gaW5wdXQ7XG5cdFx0aWYgKGlzQXJyYXkoX2lucHV0TGF5ZXJzKSkge1xuXHRcdFx0Y29uc3QgaW5kZXggPSAoX2lucHV0TGF5ZXJzIGFzIChEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUpW10pLmluZGV4T2YobGF5ZXIpO1xuXHRcdFx0aWYgKGluZGV4IDwgMCkge1xuXHRcdFx0XHQoX2lucHV0TGF5ZXJzIGFzIChEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUpW10pLnB1c2gobGF5ZXIpO1xuXHRcdFx0fSBcblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKF9pbnB1dExheWVycyAhPT0gbGF5ZXIpIHtcblx0XHRcdFx0Y29uc3QgcHJldmlvdXMgPSBfaW5wdXRMYXllcnM7XG5cdFx0XHRcdF9pbnB1dExheWVycyA9IFtdO1xuXHRcdFx0XHRpZiAocHJldmlvdXMpIChfaW5wdXRMYXllcnMgYXMgKERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSlbXSkucHVzaChwcmV2aW91cyk7XG5cdFx0XHRcdChfaW5wdXRMYXllcnMgYXMgKERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSlbXSkucHVzaChsYXllcik7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRfaW5wdXRMYXllcnMgPSBbX2lucHV0TGF5ZXJzXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIF9pbnB1dExheWVycyBhcyAoRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlKVtdO1xuXHR9XG5cblx0cHJpdmF0ZSBwYXNzVGhyb3VnaExheWVyRGF0YUZyb21JbnB1dFRvT3V0cHV0KHN0YXRlOiBEYXRhTGF5ZXIpIHtcblx0XHQvLyBUT0RPOiBmaWd1cmUgb3V0IHRoZSBmYXN0ZXN0IHdheSB0byBjb3B5IGEgdGV4dHVyZS5cblx0XHRjb25zdCBjb3B5UHJvZ3JhbSA9IHRoaXMuY29weVByb2dyYW1Gb3JUeXBlKHN0YXRlLmludGVybmFsVHlwZSk7XG5cdFx0dGhpcy5zdGVwKHtcblx0XHRcdHByb2dyYW06IGNvcHlQcm9ncmFtLFxuXHRcdFx0aW5wdXQ6IHN0YXRlLFxuXHRcdFx0b3V0cHV0OiBzdGF0ZSxcblx0XHR9KTtcblx0fVxuXG5cdHByaXZhdGUgc2V0T3V0cHV0TGF5ZXIoXG5cdFx0ZnVsbHNjcmVlblJlbmRlcjogYm9vbGVhbixcblx0XHRpbnB1dD86IChEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUpW10gfCBEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUsXG5cdFx0b3V0cHV0PzogRGF0YUxheWVyLCAvLyBVbmRlZmluZWQgcmVuZGVycyB0byBzY3JlZW4uXG5cdCkge1xuXHRcdGNvbnN0IHsgZ2wgfSA9IHRoaXM7XG5cblx0XHQvLyBSZW5kZXIgdG8gc2NyZWVuLlxuXHRcdGlmICghb3V0cHV0KSB7XG5cdFx0XHRnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIG51bGwpO1xuXHRcdFx0Ly8gUmVzaXplIHZpZXdwb3J0LlxuXHRcdFx0Y29uc3QgeyB3aWR0aCwgaGVpZ2h0IH0gPSB0aGlzO1xuXHRcdFx0Z2wudmlld3BvcnQoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gQ2hlY2sgaWYgb3V0cHV0IGlzIHNhbWUgYXMgb25lIG9mIGlucHV0IGxheWVycy5cblx0XHRpZiAoaW5wdXQgJiYgKChpbnB1dCA9PT0gb3V0cHV0KSB8fCAoaXNBcnJheShpbnB1dCkgJiYgKGlucHV0IGFzIChEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUpW10pLmluZGV4T2Yob3V0cHV0KSA+IC0xKSkpIHtcblx0XHRcdGlmIChvdXRwdXQubnVtQnVmZmVycyA9PT0gMSkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCB1c2Ugc2FtZSBidWZmZXIgZm9yIGlucHV0IGFuZCBvdXRwdXQgb2YgYSBwcm9ncmFtLiBUcnkgaW5jcmVhc2luZyB0aGUgbnVtYmVyIG9mIGJ1ZmZlcnMgaW4geW91ciBvdXRwdXQgbGF5ZXIgdG8gYXQgbGVhc3QgMiBzbyB5b3UgY2FuIHJlbmRlciB0byBuZXh0U3RhdGUgdXNpbmcgY3VycmVudFN0YXRlIGFzIGFuIGlucHV0LicpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGZ1bGxzY3JlZW5SZW5kZXIpIHtcblx0XHRcdFx0Ly8gUmVuZGVyIGFuZCBpbmNyZW1lbnQgYnVmZmVyIHNvIHdlIGFyZSByZW5kZXJpbmcgdG8gYSBkaWZmZXJlbnQgdGFyZ2V0XG5cdFx0XHRcdC8vIHRoYW4gdGhlIGlucHV0IHRleHR1cmUuXG5cdFx0XHRcdG91dHB1dC5fYmluZE91dHB1dEJ1ZmZlckZvcldyaXRlKHRydWUpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gUGFzcyBpbnB1dCB0ZXh0dXJlIHRocm91Z2ggdG8gb3V0cHV0LlxuXHRcdFx0XHR0aGlzLnBhc3NUaHJvdWdoTGF5ZXJEYXRhRnJvbUlucHV0VG9PdXRwdXQob3V0cHV0KTtcblx0XHRcdFx0Ly8gUmVuZGVyIHRvIG91dHB1dCB3aXRob3V0IGluY3JlbWVudGluZyBidWZmZXIuXG5cdFx0XHRcdG91dHB1dC5fYmluZE91dHB1dEJ1ZmZlckZvcldyaXRlKGZhbHNlKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKGZ1bGxzY3JlZW5SZW5kZXIpIHtcblx0XHRcdFx0Ly8gUmVuZGVyIHRvIGN1cnJlbnQgYnVmZmVyLlxuXHRcdFx0XHRvdXRwdXQuX2JpbmRPdXRwdXRCdWZmZXJGb3JXcml0ZShmYWxzZSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBJZiB3ZSBhcmUgZG9pbmcgYSBzbmVha3kgdGhpbmcgd2l0aCBhIHN3YXBwZWQgdGV4dHVyZSBhbmQgYXJlXG5cdFx0XHRcdC8vIG9ubHkgcmVuZGVyaW5nIHBhcnQgb2YgdGhlIHNjcmVlbiwgd2UgbWF5IG5lZWQgdG8gYWRkIGEgY29weSBvcGVyYXRpb24uXG5cdFx0XHRcdGlmIChvdXRwdXQuX3VzaW5nVGV4dHVyZU92ZXJyaWRlRm9yQ3VycmVudEJ1ZmZlcigpKSB7XG5cdFx0XHRcdFx0dGhpcy5wYXNzVGhyb3VnaExheWVyRGF0YUZyb21JbnB1dFRvT3V0cHV0KG91dHB1dCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0b3V0cHV0Ll9iaW5kT3V0cHV0QnVmZmVyRm9yV3JpdGUoZmFsc2UpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRcblx0XHQvLyBSZXNpemUgdmlld3BvcnQuXG5cdFx0Y29uc3QgWyB3aWR0aCwgaGVpZ2h0IF0gPSBvdXRwdXQuZ2V0RGltZW5zaW9ucygpO1xuXHRcdGdsLnZpZXdwb3J0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuXHR9O1xuXG5cdHByaXZhdGUgc2V0UG9zaXRpb25BdHRyaWJ1dGUocHJvZ3JhbTogV2ViR0xQcm9ncmFtLCBwcm9ncmFtTmFtZTogc3RyaW5nKSB7XG5cdFx0dGhpcy5zZXRWZXJ0ZXhBdHRyaWJ1dGUocHJvZ3JhbSwgJ2FfaW50ZXJuYWxfcG9zaXRpb24nLCAyLCBwcm9ncmFtTmFtZSk7XG5cdH1cblxuXHRwcml2YXRlIHNldEluZGV4QXR0cmlidXRlKHByb2dyYW06IFdlYkdMUHJvZ3JhbSwgcHJvZ3JhbU5hbWU6IHN0cmluZykge1xuXHRcdHRoaXMuc2V0VmVydGV4QXR0cmlidXRlKHByb2dyYW0sICdhX2ludGVybmFsX2luZGV4JywgMSwgcHJvZ3JhbU5hbWUpO1xuXHR9XG5cblx0cHJpdmF0ZSBzZXRVVkF0dHJpYnV0ZShwcm9ncmFtOiBXZWJHTFByb2dyYW0sIHByb2dyYW1OYW1lOiBzdHJpbmcpIHtcblx0XHR0aGlzLnNldFZlcnRleEF0dHJpYnV0ZShwcm9ncmFtLCAnYV9pbnRlcm5hbF91dicsIDIsIHByb2dyYW1OYW1lKTtcblx0fVxuXG5cdHByaXZhdGUgc2V0VmVydGV4QXR0cmlidXRlKHByb2dyYW06IFdlYkdMUHJvZ3JhbSwgbmFtZTogc3RyaW5nLCBzaXplOiBudW1iZXIsIHByb2dyYW1OYW1lOiBzdHJpbmcpIHtcblx0XHRjb25zdCB7IGdsIH0gPSB0aGlzO1xuXHRcdC8vIFBvaW50IGF0dHJpYnV0ZSB0byB0aGUgY3VycmVudGx5IGJvdW5kIFZCTy5cblx0XHRjb25zdCBsb2NhdGlvbiA9IGdsLmdldEF0dHJpYkxvY2F0aW9uKHByb2dyYW0sIG5hbWUpO1xuXHRcdGlmIChsb2NhdGlvbiA8IDApIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIGZpbmQgdmVydGV4IGF0dHJpYnV0ZSBcIiR7bmFtZX1cIiBpbiBwcm9ncmFtIFwiJHtwcm9ncmFtTmFtZX1cIi5gKTtcblx0XHR9XG5cdFx0Ly8gVE9ETzogb25seSBmbG9hdCBpcyBzdXBwb3J0ZWQgZm9yIHZlcnRleCBhdHRyaWJ1dGVzLlxuXHRcdGdsLnZlcnRleEF0dHJpYlBvaW50ZXIobG9jYXRpb24sIHNpemUsIGdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XG5cdFx0Ly8gRW5hYmxlIHRoZSBhdHRyaWJ1dGUuXG5cdFx0Z2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkobG9jYXRpb24pO1xuXHR9XG5cblx0Ly8gU3RlcCBmb3IgZW50aXJlIGZ1bGxzY3JlZW4gcXVhZC5cblx0c3RlcChcblx0XHRwYXJhbXM6IHtcblx0XHRcdHByb2dyYW06IEdQVVByb2dyYW0sXG5cdFx0XHRpbnB1dD86ICAoRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlKVtdIHwgRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlLFxuXHRcdFx0b3V0cHV0PzogRGF0YUxheWVyLCAvLyBVbmRlZmluZWQgcmVuZGVycyB0byBzY3JlZW4uXG5cdFx0XHRzaG91bGRCbGVuZEFscGhhPzogYm9vbGVhbixcblx0XHR9LFxuXHQpIHtcblx0XHRjb25zdCB7IGdsLCBlcnJvclN0YXRlLCBxdWFkUG9zaXRpb25zQnVmZmVyIH0gPSB0aGlzO1xuXHRcdGNvbnN0IHsgcHJvZ3JhbSwgaW5wdXQsIG91dHB1dCB9ID0gcGFyYW1zO1xuXG5cdFx0Ly8gSWdub3JlIGlmIHdlIGFyZSBpbiBlcnJvciBzdGF0ZS5cblx0XHRpZiAoZXJyb3JTdGF0ZSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGdsUHJvZ3JhbSA9IHByb2dyYW0uZGVmYXVsdFByb2dyYW0hO1xuXG5cdFx0Ly8gRG8gc2V0dXAgLSB0aGlzIG11c3QgY29tZSBmaXJzdC5cblx0XHR0aGlzLmRyYXdTZXR1cChnbFByb2dyYW0sIHRydWUsIGlucHV0LCBvdXRwdXQpO1xuXG5cdFx0Ly8gVXBkYXRlIHVuaWZvcm1zIGFuZCBidWZmZXJzLlxuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3NjYWxlJywgWzEsIDFdLCBGTE9BVCk7XG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfdHJhbnNsYXRpb24nLCBbMCwgMF0sIEZMT0FUKTtcblx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgcXVhZFBvc2l0aW9uc0J1ZmZlcik7XG5cdFx0dGhpcy5zZXRQb3NpdGlvbkF0dHJpYnV0ZShnbFByb2dyYW0sIHByb2dyYW0ubmFtZSk7XG5cblx0XHQvLyBEcmF3LlxuXHRcdHRoaXMuc2V0QmxlbmRNb2RlKHBhcmFtcy5zaG91bGRCbGVuZEFscGhhKTtcblx0XHRnbC5kcmF3QXJyYXlzKGdsLlRSSUFOR0xFX1NUUklQLCAwLCA0KTtcblx0XHRnbC5kaXNhYmxlKGdsLkJMRU5EKTtcblx0fVxuXG5cdC8vIFN0ZXAgcHJvZ3JhbSBvbmx5IGZvciBhIHN0cmlwIG9mIHB4IGFsb25nIHRoZSBib3VuZGFyeS5cblx0c3RlcEJvdW5kYXJ5KFxuXHRcdHBhcmFtczoge1xuXHRcdFx0cHJvZ3JhbTogR1BVUHJvZ3JhbSxcblx0XHRcdGlucHV0PzogIChEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUpW10gfCBEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUsXG5cdFx0XHRvdXRwdXQ/OiBEYXRhTGF5ZXIsIC8vIFVuZGVmaW5lZCByZW5kZXJzIHRvIHNjcmVlbi5cblx0XHRcdHNpbmdsZUVkZ2U/OiAnTEVGVCcgfCAnUklHSFQnIHwgJ1RPUCcgfCAnQk9UVE9NJztcblx0XHRcdHNob3VsZEJsZW5kQWxwaGE/OiBib29sZWFuLFxuXHRcdH0sXG5cdCkge1xuXHRcdGNvbnN0IHsgZ2wsIGVycm9yU3RhdGUsIGJvdW5kYXJ5UG9zaXRpb25zQnVmZmVyfSA9IHRoaXM7XG5cdFx0Y29uc3QgeyBwcm9ncmFtLCBpbnB1dCwgb3V0cHV0IH0gPSBwYXJhbXM7XG5cdFx0Y29uc3QgWyB3aWR0aCwgaGVpZ2h0IF0gPSBvdXRwdXQgPyBvdXRwdXQuZ2V0RGltZW5zaW9ucygpIDogWyB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCBdO1xuXG5cdFx0Ly8gSWdub3JlIGlmIHdlIGFyZSBpbiBlcnJvciBzdGF0ZS5cblx0XHRpZiAoZXJyb3JTdGF0ZSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGdsUHJvZ3JhbSA9IHByb2dyYW0uZGVmYXVsdFByb2dyYW0hO1xuXG5cdFx0Ly8gRG8gc2V0dXAgLSB0aGlzIG11c3QgY29tZSBmaXJzdC5cblx0XHR0aGlzLmRyYXdTZXR1cChnbFByb2dyYW0sIGZhbHNlLCBpbnB1dCwgb3V0cHV0KTtcblxuXHRcdC8vIFVwZGF0ZSB1bmlmb3JtcyBhbmQgYnVmZmVycy5cblx0XHQvLyBGcmFtZSBuZWVkcyB0byBiZSBvZmZzZXQgYW5kIHNjYWxlZCBzbyB0aGF0IGFsbCBmb3VyIHNpZGVzIGFyZSBpbiB2aWV3cG9ydC5cblx0XHRjb25zdCBvbmVQeCA9IFsgMSAvIHdpZHRoLCAxIC8gaGVpZ2h0XSBhcyBbbnVtYmVyLCBudW1iZXJdO1xuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3NjYWxlJywgWzEgLSBvbmVQeFswXSwgMSAtIG9uZVB4WzFdXSwgRkxPQVQpO1xuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3RyYW5zbGF0aW9uJywgb25lUHgsIEZMT0FUKTtcblx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgYm91bmRhcnlQb3NpdGlvbnNCdWZmZXIpO1xuXHRcdHRoaXMuc2V0UG9zaXRpb25BdHRyaWJ1dGUoZ2xQcm9ncmFtLCBwcm9ncmFtLm5hbWUpO1xuXG5cdFx0Ly8gRHJhdy5cblx0XHR0aGlzLnNldEJsZW5kTW9kZShwYXJhbXMuc2hvdWxkQmxlbmRBbHBoYSk7XG5cdFx0aWYgKHBhcmFtcy5zaW5nbGVFZGdlKSB7XG5cdFx0XHRzd2l0Y2gocGFyYW1zLnNpbmdsZUVkZ2UpIHtcblx0XHRcdFx0Y2FzZSAnTEVGVCc6XG5cdFx0XHRcdFx0Z2wuZHJhd0FycmF5cyhnbC5MSU5FUywgMywgMik7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgJ1JJR0hUJzpcblx0XHRcdFx0XHRnbC5kcmF3QXJyYXlzKGdsLkxJTkVTLCAxLCAyKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAnVE9QJzpcblx0XHRcdFx0XHRnbC5kcmF3QXJyYXlzKGdsLkxJTkVTLCAyLCAyKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAnQk9UVE9NJzpcblx0XHRcdFx0XHRnbC5kcmF3QXJyYXlzKGdsLkxJTkVTLCAwLCAyKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gYm91bmRhcnkgZWRnZSB0eXBlOiAke3BhcmFtcy5zaW5nbGVFZGdlfS5gKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0Z2wuZHJhd0FycmF5cyhnbC5MSU5FX0xPT1AsIDAsIDQpO1xuXHRcdH1cblx0XHRnbC5kaXNhYmxlKGdsLkJMRU5EKTtcblx0fVxuXG5cdC8vIFN0ZXAgcHJvZ3JhbSBmb3IgYWxsIGJ1dCBhIHN0cmlwIG9mIHB4IGFsb25nIHRoZSBib3VuZGFyeS5cblx0c3RlcE5vbkJvdW5kYXJ5KFxuXHRcdHBhcmFtczoge1xuXHRcdFx0cHJvZ3JhbTogR1BVUHJvZ3JhbSxcblx0XHRcdGlucHV0PzogIChEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUpW10gfCBEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUsXG5cdFx0XHRvdXRwdXQ/OiBEYXRhTGF5ZXIsIC8vIFVuZGVmaW5lZCByZW5kZXJzIHRvIHNjcmVlbi5cblx0XHRcdHNob3VsZEJsZW5kQWxwaGE/OiBib29sZWFuLFxuXHRcdH0sXG5cdCkge1xuXHRcdGNvbnN0IHsgZ2wsIGVycm9yU3RhdGUsIHF1YWRQb3NpdGlvbnNCdWZmZXIgfSA9IHRoaXM7XG5cdFx0Y29uc3QgeyBwcm9ncmFtLCBpbnB1dCwgb3V0cHV0IH0gPSBwYXJhbXM7XG5cdFx0Y29uc3QgWyB3aWR0aCwgaGVpZ2h0IF0gPSBvdXRwdXQgPyBvdXRwdXQuZ2V0RGltZW5zaW9ucygpIDogWyB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCBdO1xuXG5cdFx0Ly8gSWdub3JlIGlmIHdlIGFyZSBpbiBlcnJvciBzdGF0ZS5cblx0XHRpZiAoZXJyb3JTdGF0ZSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGdsUHJvZ3JhbSA9IHByb2dyYW0uZGVmYXVsdFByb2dyYW0hO1xuXG5cdFx0Ly8gRG8gc2V0dXAgLSB0aGlzIG11c3QgY29tZSBmaXJzdC5cblx0XHR0aGlzLmRyYXdTZXR1cChnbFByb2dyYW0sIGZhbHNlLCBpbnB1dCwgb3V0cHV0KTtcblxuXHRcdC8vIFVwZGF0ZSB1bmlmb3JtcyBhbmQgYnVmZmVycy5cblx0XHRjb25zdCBvbmVQeCA9IFsgMSAvIHdpZHRoLCAxIC8gaGVpZ2h0XSBhcyBbbnVtYmVyLCBudW1iZXJdO1xuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3NjYWxlJywgWzEgLSAyICogb25lUHhbMF0sIDEgLSAyICogb25lUHhbMV1dLCBGTE9BVCk7XG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfdHJhbnNsYXRpb24nLCBvbmVQeCwgRkxPQVQpO1xuXHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBxdWFkUG9zaXRpb25zQnVmZmVyKTtcblx0XHR0aGlzLnNldFBvc2l0aW9uQXR0cmlidXRlKGdsUHJvZ3JhbSwgcHJvZ3JhbS5uYW1lKTtcblx0XHRcblx0XHQvLyBEcmF3LlxuXHRcdHRoaXMuc2V0QmxlbmRNb2RlKHBhcmFtcy5zaG91bGRCbGVuZEFscGhhKTtcblx0XHRnbC5kcmF3QXJyYXlzKGdsLlRSSUFOR0xFX1NUUklQLCAwLCA0KTtcblx0XHRnbC5kaXNhYmxlKGdsLkJMRU5EKTtcblx0fVxuXG5cdC8vIFN0ZXAgcHJvZ3JhbSBvbmx5IGZvciBhIGNpcmN1bGFyIHNwb3QuXG5cdHN0ZXBDaXJjbGUoXG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRwcm9ncmFtOiBHUFVQcm9ncmFtLFxuXHRcdFx0cG9zaXRpb246IFtudW1iZXIsIG51bWJlcl0sIC8vIFBvc2l0aW9uIGlzIGluIHNjcmVlbiBzcGFjZSBjb29yZHMuXG5cdFx0XHRyYWRpdXM6IG51bWJlciwgLy8gUmFkaXVzIGlzIGluIHNjcmVlbiBzcGFjZSB1bml0cy5cblx0XHRcdGlucHV0PzogIChEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUpW10gfCBEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUsXG5cdFx0XHRvdXRwdXQ/OiBEYXRhTGF5ZXIsIC8vIFVuZGVmaW5lZCByZW5kZXJzIHRvIHNjcmVlbi5cblx0XHRcdG51bVNlZ21lbnRzPzogbnVtYmVyLFxuXHRcdFx0c2hvdWxkQmxlbmRBbHBoYT86IGJvb2xlYW4sXG5cdFx0fSxcblx0KSB7XG5cdFx0Y29uc3QgeyBnbCwgZXJyb3JTdGF0ZSwgd2lkdGgsIGhlaWdodCB9ID0gdGhpcztcblx0XHRjb25zdCB7IHByb2dyYW0sIHBvc2l0aW9uLCByYWRpdXMsIGlucHV0LCBvdXRwdXQgfSA9IHBhcmFtcztcblxuXHRcdC8vIElnbm9yZSBpZiB3ZSBhcmUgaW4gZXJyb3Igc3RhdGUuXG5cdFx0aWYgKGVycm9yU3RhdGUpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBnbFByb2dyYW0gPSBwcm9ncmFtLmRlZmF1bHRQcm9ncmFtITtcblxuXHRcdC8vIERvIHNldHVwIC0gdGhpcyBtdXN0IGNvbWUgZmlyc3QuXG5cdFx0dGhpcy5kcmF3U2V0dXAoZ2xQcm9ncmFtLCBmYWxzZSwgaW5wdXQsIG91dHB1dCk7XG5cblx0XHQvLyBVcGRhdGUgdW5pZm9ybXMgYW5kIGJ1ZmZlcnMuXG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfc2NhbGUnLCBbcmFkaXVzICogMiAvIHdpZHRoLCByYWRpdXMgKiAyIC8gaGVpZ2h0XSwgRkxPQVQpO1xuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3RyYW5zbGF0aW9uJywgWzIgKiBwb3NpdGlvblswXSAvIHdpZHRoIC0gMSwgMiAqIHBvc2l0aW9uWzFdIC8gaGVpZ2h0IC0gMV0sIEZMT0FUKTtcblx0XHRjb25zdCBudW1TZWdtZW50cyA9IHBhcmFtcy5udW1TZWdtZW50cyA/IHBhcmFtcy5udW1TZWdtZW50cyA6IERFRkFVTFRfQ0lSQ0xFX05VTV9TRUdNRU5UUztcblx0XHRpZiAobnVtU2VnbWVudHMgPCAzKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYG51bVNlZ21lbnRzIGZvciBXZWJHTENvbXB1dGUuc3RlcENpcmNsZSBtdXN0IGJlIGdyZWF0ZXIgdGhhbiAyLCBnb3QgJHtudW1TZWdtZW50c30uYCk7XG5cdFx0fVxuXHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLmdldENpcmNsZVBvc2l0aW9uc0J1ZmZlcihudW1TZWdtZW50cykpO1xuXHRcdHRoaXMuc2V0UG9zaXRpb25BdHRyaWJ1dGUoZ2xQcm9ncmFtLCBwcm9ncmFtLm5hbWUpO1xuXHRcdFxuXHRcdC8vIERyYXcuXG5cdFx0dGhpcy5zZXRCbGVuZE1vZGUocGFyYW1zLnNob3VsZEJsZW5kQWxwaGEpO1xuXHRcdGdsLmRyYXdBcnJheXMoZ2wuVFJJQU5HTEVfRkFOLCAwLCBudW1TZWdtZW50cyArIDIpO1x0XG5cdFx0Z2wuZGlzYWJsZShnbC5CTEVORCk7XG5cdH1cblxuXHQvLyBTdGVwIHByb2dyYW0gb25seSBmb3IgYSB0aGlja2VuZWQgbGluZSBzZWdtZW50IChyb3VuZGVkIGVuZCBjYXBzIGF2YWlsYWJsZSkuXG5cdHN0ZXBTZWdtZW50KFxuXHRcdHBhcmFtczoge1xuXHRcdFx0cHJvZ3JhbTogR1BVUHJvZ3JhbSxcblx0XHRcdHBvc2l0aW9uMTogW251bWJlciwgbnVtYmVyXSwgLy8gUG9zaXRpb24gaXMgaW4gc2NyZWVuIHNwYWNlIGNvb3Jkcy5cblx0XHRcdHBvc2l0aW9uMjogW251bWJlciwgbnVtYmVyXSwgLy8gUG9zaXRpb24gaXMgaW4gc2NyZWVuIHNwYWNlIGNvb3Jkcy5cblx0XHRcdHRoaWNrbmVzczogbnVtYmVyLCAvLyBUaGlja25lc3MgaXMgaW4gcHguXG5cdFx0XHRpbnB1dD86ICAoRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlKVtdIHwgRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlLFxuXHRcdFx0b3V0cHV0PzogRGF0YUxheWVyLCAvLyBVbmRlZmluZWQgcmVuZGVycyB0byBzY3JlZW4uXG5cdFx0XHRlbmRDYXBzPzogYm9vbGVhbixcblx0XHRcdG51bUNhcFNlZ21lbnRzPzogbnVtYmVyLFxuXHRcdFx0c2hvdWxkQmxlbmRBbHBoYT86IGJvb2xlYW4sXG5cdFx0fSxcblx0KSB7XG5cdFx0Y29uc3QgeyBnbCwgZXJyb3JTdGF0ZSB9ID0gdGhpcztcblx0XHRjb25zdCB7IHByb2dyYW0sIHBvc2l0aW9uMSwgcG9zaXRpb24yLCB0aGlja25lc3MsIGlucHV0LCBvdXRwdXQgfSA9IHBhcmFtcztcblx0XHRjb25zdCBbIHdpZHRoLCBoZWlnaHQgXSA9IG91dHB1dCA/IG91dHB1dC5nZXREaW1lbnNpb25zKCkgOiBbIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0IF07XG5cblx0XHQvLyBJZ25vcmUgaWYgd2UgYXJlIGluIGVycm9yIHN0YXRlLlxuXHRcdGlmIChlcnJvclN0YXRlKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgZ2xQcm9ncmFtID0gcHJvZ3JhbS5zZWdtZW50UHJvZ3JhbSE7XG5cblx0XHQvLyBEbyBzZXR1cCAtIHRoaXMgbXVzdCBjb21lIGZpcnN0LlxuXHRcdHRoaXMuZHJhd1NldHVwKGdsUHJvZ3JhbSwgZmFsc2UsIGlucHV0LCBvdXRwdXQpO1xuXG5cdFx0Ly8gVXBkYXRlIHVuaWZvcm1zIGFuZCBidWZmZXJzLlxuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX2hhbGZUaGlja25lc3MnLCB0aGlja25lc3MgLyAyLCBGTE9BVCk7XG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfc2NhbGUnLCBbMiAvIHdpZHRoLCAyIC8gaGVpZ2h0XSwgRkxPQVQpO1xuXHRcdGNvbnN0IGRpZmZYID0gcG9zaXRpb24xWzBdIC0gcG9zaXRpb24yWzBdO1xuXHRcdGNvbnN0IGRpZmZZID0gcG9zaXRpb24xWzFdIC0gcG9zaXRpb24yWzFdO1xuXHRcdGNvbnN0IGFuZ2xlID0gTWF0aC5hdGFuMihkaWZmWSwgZGlmZlgpO1xuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3JvdGF0aW9uJywgYW5nbGUsIEZMT0FUKTtcblx0XHRjb25zdCBjZW50ZXJYID0gKHBvc2l0aW9uMVswXSArIHBvc2l0aW9uMlswXSkgLyAyO1xuXHRcdGNvbnN0IGNlbnRlclkgPSAocG9zaXRpb24xWzFdICsgcG9zaXRpb24yWzFdKSAvIDI7XG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfdHJhbnNsYXRpb24nLCBbMiAqIGNlbnRlclggLyB0aGlzLndpZHRoIC0gMSwgMiAqIGNlbnRlclkgLyB0aGlzLmhlaWdodCAtIDFdLCBGTE9BVCk7XG5cdFx0Y29uc3QgbGVuZ3RoID0gTWF0aC5zcXJ0KGRpZmZYICogZGlmZlggKyBkaWZmWSAqIGRpZmZZKTtcblx0XHRcblx0XHRjb25zdCBudW1TZWdtZW50cyA9IHBhcmFtcy5udW1DYXBTZWdtZW50cyA/IHBhcmFtcy5udW1DYXBTZWdtZW50cyAqIDIgOiBERUZBVUxUX0NJUkNMRV9OVU1fU0VHTUVOVFM7XG5cdFx0aWYgKHBhcmFtcy5lbmRDYXBzKSB7XG5cdFx0XHRpZiAobnVtU2VnbWVudHMgPCA2IHx8IG51bVNlZ21lbnRzICUgNiAhPT0gMCkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYG51bVNlZ21lbnRzIGZvciBXZWJHTENvbXB1dGUuc3RlcFNlZ21lbnQgbXVzdCBiZSBkaXZpc2libGUgYnkgNiwgZ290ICR7bnVtU2VnbWVudHN9LmApO1xuXHRcdFx0fVxuXHRcdFx0Ly8gSGF2ZSB0byBzdWJ0cmFjdCBhIHNtYWxsIG9mZnNldCBmcm9tIGxlbmd0aC5cblx0XHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX2xlbmd0aCcsIGxlbmd0aCAtIHRoaWNrbmVzcyAqIE1hdGguc2luKE1hdGguUEkgLyBudW1TZWdtZW50cyksIEZMT0FUKTtcblx0XHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLmdldENpcmNsZVBvc2l0aW9uc0J1ZmZlcihudW1TZWdtZW50cykpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBIYXZlIHRvIHN1YnRyYWN0IGEgc21hbGwgb2Zmc2V0IGZyb20gbGVuZ3RoLlxuXHRcdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfbGVuZ3RoJywgbGVuZ3RoIC0gdGhpY2tuZXNzLCBGTE9BVCk7XG5cdFx0XHQvLyBVc2UgYSByZWN0YW5nbGUgaW4gY2FzZSBvZiBubyBjYXBzLlxuXHRcdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHRoaXMucXVhZFBvc2l0aW9uc0J1ZmZlcik7XG5cdFx0fVxuXG5cdFx0dGhpcy5zZXRQb3NpdGlvbkF0dHJpYnV0ZShnbFByb2dyYW0sIHByb2dyYW0ubmFtZSk7XG5cdFx0XG5cdFx0Ly8gRHJhdy5cblx0XHR0aGlzLnNldEJsZW5kTW9kZShwYXJhbXMuc2hvdWxkQmxlbmRBbHBoYSk7XG5cdFx0aWYgKHBhcmFtcy5lbmRDYXBzKSB7XG5cdFx0XHRnbC5kcmF3QXJyYXlzKGdsLlRSSUFOR0xFX0ZBTiwgMCwgbnVtU2VnbWVudHMgKyAyKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Z2wuZHJhd0FycmF5cyhnbC5UUklBTkdMRV9TVFJJUCwgMCwgNCk7XG5cdFx0fVxuXHRcdGdsLmRpc2FibGUoZ2wuQkxFTkQpO1xuXHR9XG5cblx0c3RlcFBvbHlsaW5lKFxuXHRcdHBhcmFtczoge1xuXHRcdFx0cHJvZ3JhbTogR1BVUHJvZ3JhbSxcblx0XHRcdHBvc2l0aW9uczogW251bWJlciwgbnVtYmVyXVtdLFxuXHRcdFx0dGhpY2tuZXNzOiBudW1iZXIsIC8vIFRoaWNrbmVzcyBvZiBsaW5lIGlzIGluIHB4LlxuXHRcdFx0aW5wdXQ/OiAoRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlKVtdIHwgRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlLFxuXHRcdFx0b3V0cHV0PzogRGF0YUxheWVyLCAvLyBVbmRlZmluZWQgcmVuZGVycyB0byBzY3JlZW4uXG5cdFx0XHRjbG9zZUxvb3A/OiBib29sZWFuLFxuXHRcdFx0aW5jbHVkZVVWcz86IGJvb2xlYW4sXG5cdFx0XHRpbmNsdWRlTm9ybWFscz86IGJvb2xlYW4sXG5cdFx0XHRzaG91bGRCbGVuZEFscGhhPzogYm9vbGVhbixcblx0XHR9LFxuXHQpIHtcblx0XHRjb25zdCB7IHByb2dyYW0sIGlucHV0LCBvdXRwdXQgfSA9IHBhcmFtcztcblx0XHRjb25zdCB2ZXJ0aWNlcyA9IHBhcmFtcy5wb3NpdGlvbnM7XG5cdFx0Y29uc3QgY2xvc2VMb29wID0gISFwYXJhbXMuY2xvc2VMb29wO1xuXHRcdFxuXHRcdGNvbnN0IHsgZ2wsIHdpZHRoLCBoZWlnaHQsIGVycm9yU3RhdGUgfSA9IHRoaXM7XG5cblx0XHQvLyBJZ25vcmUgaWYgd2UgYXJlIGluIGVycm9yIHN0YXRlLlxuXHRcdGlmIChlcnJvclN0YXRlKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gT2Zmc2V0IHZlcnRpY2VzLlxuXHRcdGNvbnN0IGhhbGZUaGlja25lc3MgPSBwYXJhbXMudGhpY2tuZXNzIC8gMjtcblx0XHRjb25zdCBudW1Qb3NpdGlvbnMgPSBjbG9zZUxvb3AgPyB2ZXJ0aWNlcy5sZW5ndGggKiA0ICsgMiA6ICh2ZXJ0aWNlcy5sZW5ndGggLSAxKSAqIDQ7XG5cdFx0Y29uc3QgcG9zaXRpb25zID0gbmV3IEZsb2F0MzJBcnJheSgyICogbnVtUG9zaXRpb25zKTtcblx0XHRjb25zdCB1dnMgPSBwYXJhbXMuaW5jbHVkZVVWcyA/IG5ldyBGbG9hdDMyQXJyYXkoMiAqIG51bVBvc2l0aW9ucykgOiB1bmRlZmluZWQ7XG5cdFx0Y29uc3Qgbm9ybWFscyA9IHBhcmFtcy5pbmNsdWRlTm9ybWFscyA/IG5ldyBGbG9hdDMyQXJyYXkoMiAqIG51bVBvc2l0aW9ucykgOiB1bmRlZmluZWQ7XG5cblx0XHQvLyB0bXAgYXJyYXlzLlxuXHRcdGNvbnN0IHMxID0gWzAsIDBdO1xuXHRcdGNvbnN0IHMyID0gWzAsIDBdO1xuXHRcdGNvbnN0IG4xID0gWzAsIDBdO1xuXHRcdGNvbnN0IG4yID0gWzAsIDBdO1xuXHRcdGNvbnN0IG4zID0gWzAsIDBdO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdmVydGljZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGlmICghY2xvc2VMb29wICYmIGkgPT09IHZlcnRpY2VzLmxlbmd0aCAtIDEpIGNvbnRpbnVlO1xuXHRcdFx0Ly8gVmVydGljZXMgb24gdGhpcyBzZWdtZW50LlxuXHRcdFx0Y29uc3QgdjEgPSB2ZXJ0aWNlc1tpXTtcblx0XHRcdGNvbnN0IHYyID0gdmVydGljZXNbKGkgKyAxKSAlIHZlcnRpY2VzLmxlbmd0aF07XG5cdFx0XHRzMVswXSA9IHYyWzBdIC0gdjFbMF07XG5cdFx0XHRzMVsxXSA9IHYyWzFdIC0gdjFbMV07XG5cdFx0XHRjb25zdCBsZW5ndGgxID0gTWF0aC5zcXJ0KHMxWzBdICogczFbMF0gKyBzMVsxXSAqIHMxWzFdKTtcblx0XHRcdG4xWzBdID0gczFbMV0gLyBsZW5ndGgxO1xuXHRcdFx0bjFbMV0gPSAtIHMxWzBdIC8gbGVuZ3RoMTtcblxuXHRcdFx0Y29uc3QgaW5kZXggPSBpICogNCArIDI7XG5cblx0XHRcdGlmICghY2xvc2VMb29wICYmIGkgPT09IDApIHtcblx0XHRcdFx0Ly8gQWRkIHN0YXJ0aW5nIHBvaW50cyB0byBwb3NpdGlvbnMgYXJyYXkuXG5cdFx0XHRcdHBvc2l0aW9uc1swXSA9IHYxWzBdICsgbjFbMF0gKiBoYWxmVGhpY2tuZXNzO1xuXHRcdFx0XHRwb3NpdGlvbnNbMV0gPSB2MVsxXSArIG4xWzFdICogaGFsZlRoaWNrbmVzcztcblx0XHRcdFx0cG9zaXRpb25zWzJdID0gdjFbMF0gLSBuMVswXSAqIGhhbGZUaGlja25lc3M7XG5cdFx0XHRcdHBvc2l0aW9uc1szXSA9IHYxWzFdIC0gbjFbMV0gKiBoYWxmVGhpY2tuZXNzO1xuXHRcdFx0XHRpZiAodXZzKSB7XG5cdFx0XHRcdFx0dXZzWzBdID0gMDtcblx0XHRcdFx0XHR1dnNbMV0gPSAxO1xuXHRcdFx0XHRcdHV2c1syXSA9IDA7XG5cdFx0XHRcdFx0dXZzWzNdID0gMDtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAobm9ybWFscykge1xuXHRcdFx0XHRcdG5vcm1hbHNbMF0gPSBuMVswXTtcblx0XHRcdFx0XHRub3JtYWxzWzFdID0gbjFbMV07XG5cdFx0XHRcdFx0bm9ybWFsc1syXSA9IG4xWzBdO1xuXHRcdFx0XHRcdG5vcm1hbHNbM10gPSBuMVsxXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCB1ID0gKGkgKyAxKSAvICh2ZXJ0aWNlcy5sZW5ndGggLSAxKTtcblxuXHRcdFx0Ly8gT2Zmc2V0IGZyb20gdjIuXG5cdFx0XHRwb3NpdGlvbnNbMiAqIGluZGV4XSA9IHYyWzBdICsgbjFbMF0gKiBoYWxmVGhpY2tuZXNzO1xuXHRcdFx0cG9zaXRpb25zWzIgKiBpbmRleCArIDFdID0gdjJbMV0gKyBuMVsxXSAqIGhhbGZUaGlja25lc3M7XG5cdFx0XHRwb3NpdGlvbnNbMiAqIGluZGV4ICsgMl0gPSB2MlswXSAtIG4xWzBdICogaGFsZlRoaWNrbmVzcztcblx0XHRcdHBvc2l0aW9uc1syICogaW5kZXggKyAzXSA9IHYyWzFdIC0gbjFbMV0gKiBoYWxmVGhpY2tuZXNzO1xuXHRcdFx0aWYgKHV2cykge1xuXHRcdFx0XHR1dnNbMiAqIGluZGV4XSA9IHU7XG5cdFx0XHRcdHV2c1syICogaW5kZXggKyAxXSA9IDE7XG5cdFx0XHRcdHV2c1syICogaW5kZXggKyAyXSA9IHU7XG5cdFx0XHRcdHV2c1syICogaW5kZXggKyAzXSA9IDA7XG5cdFx0XHR9XG5cdFx0XHRpZiAobm9ybWFscykge1xuXHRcdFx0XHRub3JtYWxzWzIgKiBpbmRleF0gPSBuMVswXTtcblx0XHRcdFx0bm9ybWFsc1syICogaW5kZXggKyAxXSA9IG4xWzFdO1xuXHRcdFx0XHRub3JtYWxzWzIgKiBpbmRleCArIDJdID0gbjFbMF07XG5cdFx0XHRcdG5vcm1hbHNbMiAqIGluZGV4ICsgM10gPSBuMVsxXTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKChpIDwgdmVydGljZXMubGVuZ3RoIC0gMikgfHwgY2xvc2VMb29wKSB7XG5cdFx0XHRcdC8vIFZlcnRpY2VzIG9uIG5leHQgc2VnbWVudC5cblx0XHRcdFx0Y29uc3QgdjMgPSB2ZXJ0aWNlc1soaSArIDEpICUgdmVydGljZXMubGVuZ3RoXTtcblx0XHRcdFx0Y29uc3QgdjQgPSB2ZXJ0aWNlc1soaSArIDIpICUgdmVydGljZXMubGVuZ3RoXTtcblx0XHRcdFx0czJbMF0gPSB2NFswXSAtIHYzWzBdO1xuXHRcdFx0XHRzMlsxXSA9IHY0WzFdIC0gdjNbMV07XG5cdFx0XHRcdGNvbnN0IGxlbmd0aDIgPSBNYXRoLnNxcnQoczJbMF0gKiBzMlswXSArIHMyWzFdICogczJbMV0pO1xuXHRcdFx0XHRuMlswXSA9IHMyWzFdIC8gbGVuZ3RoMjtcblx0XHRcdFx0bjJbMV0gPSAtIHMyWzBdIC8gbGVuZ3RoMjtcblxuXHRcdFx0XHQvLyBPZmZzZXQgZnJvbSB2M1xuXHRcdFx0XHRwb3NpdGlvbnNbMiAqICgoaW5kZXggKyAyKSAlICg0ICogdmVydGljZXMubGVuZ3RoKSldID0gdjNbMF0gKyBuMlswXSAqIGhhbGZUaGlja25lc3M7XG5cdFx0XHRcdHBvc2l0aW9uc1syICogKChpbmRleCArIDIpICUgKDQgKiB2ZXJ0aWNlcy5sZW5ndGgpKSArIDFdID0gdjNbMV0gKyBuMlsxXSAqIGhhbGZUaGlja25lc3M7XG5cdFx0XHRcdHBvc2l0aW9uc1syICogKChpbmRleCArIDIpICUgKDQgKiB2ZXJ0aWNlcy5sZW5ndGgpKSArIDJdID0gdjNbMF0gLSBuMlswXSAqIGhhbGZUaGlja25lc3M7XG5cdFx0XHRcdHBvc2l0aW9uc1syICogKChpbmRleCArIDIpICUgKDQgKiB2ZXJ0aWNlcy5sZW5ndGgpKSArIDNdID0gdjNbMV0gLSBuMlsxXSAqIGhhbGZUaGlja25lc3M7XG5cdFx0XHRcdGlmICh1dnMpIHtcblx0XHRcdFx0XHR1dnNbMiAqICgoaW5kZXggKyAyKSAlICg0ICogdmVydGljZXMubGVuZ3RoKSldID0gdTtcblx0XHRcdFx0XHR1dnNbMiAqICgoaW5kZXggKyAyKSAlICg0ICogdmVydGljZXMubGVuZ3RoKSkgKyAxXSA9IDE7XG5cdFx0XHRcdFx0dXZzWzIgKiAoKGluZGV4ICsgMikgJSAoNCAqIHZlcnRpY2VzLmxlbmd0aCkpICsgMl0gPSB1O1xuXHRcdFx0XHRcdHV2c1syICogKChpbmRleCArIDIpICUgKDQgKiB2ZXJ0aWNlcy5sZW5ndGgpKSArIDNdID0gMDtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAobm9ybWFscykge1xuXHRcdFx0XHRcdG5vcm1hbHNbMiAqICgoaW5kZXggKyAyKSAlICg0ICogdmVydGljZXMubGVuZ3RoKSldID0gbjJbMF07XG5cdFx0XHRcdFx0bm9ybWFsc1syICogKChpbmRleCArIDIpICUgKDQgKiB2ZXJ0aWNlcy5sZW5ndGgpKSArIDFdID0gbjJbMV07XG5cdFx0XHRcdFx0bm9ybWFsc1syICogKChpbmRleCArIDIpICUgKDQgKiB2ZXJ0aWNlcy5sZW5ndGgpKSArIDJdID0gbjJbMF07XG5cdFx0XHRcdFx0bm9ybWFsc1syICogKChpbmRleCArIDIpICUgKDQgKiB2ZXJ0aWNlcy5sZW5ndGgpKSArIDNdID0gbjJbMV07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBDaGVjayB0aGUgYW5nbGUgYmV0d2VlbiBhZGphY2VudCBzZWdtZW50cy5cblx0XHRcdFx0Y29uc3QgY3Jvc3MgPSBuMVswXSAqIG4yWzFdIC0gbjFbMV0gKiBuMlswXTtcblx0XHRcdFx0aWYgKE1hdGguYWJzKGNyb3NzKSA8IDFlLTYpIGNvbnRpbnVlO1xuXHRcdFx0XHRuM1swXSA9IG4xWzBdICsgbjJbMF07XG5cdFx0XHRcdG4zWzFdID0gbjFbMV0gKyBuMlsxXTtcblx0XHRcdFx0Y29uc3QgbGVuZ3RoMyA9IE1hdGguc3FydChuM1swXSAqIG4zWzBdICsgbjNbMV0gKiBuM1sxXSk7XG5cdFx0XHRcdG4zWzBdIC89IGxlbmd0aDM7XG5cdFx0XHRcdG4zWzFdIC89IGxlbmd0aDM7XG5cdFx0XHRcdC8vIE1ha2UgYWRqdXN0bWVudHMgdG8gcG9zaXRpb25zLlxuXHRcdFx0XHRjb25zdCBhbmdsZSA9IE1hdGguYWNvcyhuMVswXSAqIG4yWzBdICsgbjFbMV0gKiBuMlsxXSk7XG5cdFx0XHRcdGNvbnN0IG9mZnNldCA9IGhhbGZUaGlja25lc3MgLyBNYXRoLmNvcyhhbmdsZSAvIDIpO1xuXHRcdFx0XHRpZiAoY3Jvc3MgPCAwKSB7XG5cdFx0XHRcdFx0cG9zaXRpb25zWzIgKiBpbmRleF0gPSB2MlswXSArIG4zWzBdICogb2Zmc2V0O1xuXHRcdFx0XHRcdHBvc2l0aW9uc1syICogaW5kZXggKyAxXSA9IHYyWzFdICsgbjNbMV0gKiBvZmZzZXQ7XG5cdFx0XHRcdFx0cG9zaXRpb25zWzIgKiAoKGluZGV4ICsgMikgJSAoNCAqIHZlcnRpY2VzLmxlbmd0aCkpXSA9IHBvc2l0aW9uc1syICogaW5kZXhdO1xuXHRcdFx0XHRcdHBvc2l0aW9uc1syICogKChpbmRleCArIDIpICUgKDQgKiB2ZXJ0aWNlcy5sZW5ndGgpKSArIDFdID0gcG9zaXRpb25zWzIgKiBpbmRleCArIDFdO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHBvc2l0aW9uc1syICogaW5kZXggKyAyXSA9IHYyWzBdIC0gbjNbMF0gKiBvZmZzZXQ7XG5cdFx0XHRcdFx0cG9zaXRpb25zWzIgKiBpbmRleCArIDNdID0gdjJbMV0gLSBuM1sxXSAqIG9mZnNldDtcblx0XHRcdFx0XHRwb3NpdGlvbnNbMiAqICgoaW5kZXggKyAyKSAlICg0ICogdmVydGljZXMubGVuZ3RoKSkgKyAyXSA9IHBvc2l0aW9uc1syICogaW5kZXggKyAyXTtcblx0XHRcdFx0XHRwb3NpdGlvbnNbMiAqICgoaW5kZXggKyAyKSAlICg0ICogdmVydGljZXMubGVuZ3RoKSkgKyAzXSA9IHBvc2l0aW9uc1syICogaW5kZXggKyAzXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAoY2xvc2VMb29wKSB7XG5cdFx0XHQvLyBEdXBsaWNhdGUgc3RhcnRpbmcgcG9pbnRzIHRvIGVuZCBvZiBwb3NpdGlvbnMgYXJyYXkuXG5cdFx0XHRwb3NpdGlvbnNbdmVydGljZXMubGVuZ3RoICogOF0gPSBwb3NpdGlvbnNbMF07XG5cdFx0XHRwb3NpdGlvbnNbdmVydGljZXMubGVuZ3RoICogOCArIDFdID0gcG9zaXRpb25zWzFdO1xuXHRcdFx0cG9zaXRpb25zW3ZlcnRpY2VzLmxlbmd0aCAqIDggKyAyXSA9IHBvc2l0aW9uc1syXTtcblx0XHRcdHBvc2l0aW9uc1t2ZXJ0aWNlcy5sZW5ndGggKiA4ICsgM10gPSBwb3NpdGlvbnNbM107XG5cdFx0XHRpZiAodXZzKSB7XG5cdFx0XHRcdHV2c1t2ZXJ0aWNlcy5sZW5ndGggKiA4XSA9IHV2c1swXTtcblx0XHRcdFx0dXZzW3ZlcnRpY2VzLmxlbmd0aCAqIDggKyAxXSA9IHV2c1sxXTtcblx0XHRcdFx0dXZzW3ZlcnRpY2VzLmxlbmd0aCAqIDggKyAyXSA9IHV2c1syXTtcblx0XHRcdFx0dXZzW3ZlcnRpY2VzLmxlbmd0aCAqIDggKyAzXSA9IHV2c1szXTtcblx0XHRcdH1cblx0XHRcdGlmIChub3JtYWxzKSB7XG5cdFx0XHRcdG5vcm1hbHNbdmVydGljZXMubGVuZ3RoICogOF0gPSBub3JtYWxzWzBdO1xuXHRcdFx0XHRub3JtYWxzW3ZlcnRpY2VzLmxlbmd0aCAqIDggKyAxXSA9IG5vcm1hbHNbMV07XG5cdFx0XHRcdG5vcm1hbHNbdmVydGljZXMubGVuZ3RoICogOCArIDJdID0gbm9ybWFsc1syXTtcblx0XHRcdFx0bm9ybWFsc1t2ZXJ0aWNlcy5sZW5ndGggKiA4ICsgM10gPSBub3JtYWxzWzNdO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGNvbnN0IGdsUHJvZ3JhbSA9ICh1dnMgP1xuXHRcdFx0KG5vcm1hbHMgPyBwcm9ncmFtLmRlZmF1bHRQcm9ncmFtV2l0aFVWTm9ybWFsIDogcHJvZ3JhbS5kZWZhdWx0UHJvZ3JhbVdpdGhVVikgOlxuXHRcdFx0KG5vcm1hbHMgPyBwcm9ncmFtLmRlZmF1bHRQcm9ncmFtV2l0aE5vcm1hbCA6IHByb2dyYW0uZGVmYXVsdFByb2dyYW0pXG5cdFx0KSE7XG5cblx0XHQvLyBEbyBzZXR1cCAtIHRoaXMgbXVzdCBjb21lIGZpcnN0LlxuXHRcdHRoaXMuZHJhd1NldHVwKGdsUHJvZ3JhbSwgZmFsc2UsIGlucHV0LCBvdXRwdXQpO1xuXG5cdFx0Ly8gVXBkYXRlIHVuaWZvcm1zIGFuZCBidWZmZXJzLlxuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3NjYWxlJywgWzIgLyB3aWR0aCwgMiAvIGhlaWdodF0sIEZMT0FUKTtcblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF90cmFuc2xhdGlvbicsIFstMSwgLTFdLCBGTE9BVCk7XG5cdFx0Ly8gSW5pdCBwb3NpdGlvbnMgYnVmZmVyLlxuXHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLmluaXRWZXJ0ZXhCdWZmZXIocG9zaXRpb25zKSEpO1xuXHRcdHRoaXMuc2V0UG9zaXRpb25BdHRyaWJ1dGUoZ2xQcm9ncmFtLCBwcm9ncmFtLm5hbWUpO1xuXHRcdGlmICh1dnMpIHtcblx0XHRcdC8vIEluaXQgdXYgYnVmZmVyLlxuXHRcdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHRoaXMuaW5pdFZlcnRleEJ1ZmZlcih1dnMpISk7XG5cdFx0XHR0aGlzLnNldFVWQXR0cmlidXRlKGdsUHJvZ3JhbSwgcHJvZ3JhbS5uYW1lKTtcblx0XHR9XG5cdFx0aWYgKG5vcm1hbHMpIHtcblx0XHRcdC8vIEluaXQgbm9ybWFscyBidWZmZXIuXG5cdFx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdGhpcy5pbml0VmVydGV4QnVmZmVyKG5vcm1hbHMpISk7XG5cdFx0XHR0aGlzLnNldFZlcnRleEF0dHJpYnV0ZShnbFByb2dyYW0sICdhX2ludGVybmFsX25vcm1hbCcsIDIsIHByb2dyYW0ubmFtZSk7XG5cdFx0fVxuXG5cdFx0Ly8gRHJhdy5cblx0XHR0aGlzLnNldEJsZW5kTW9kZShwYXJhbXMuc2hvdWxkQmxlbmRBbHBoYSk7XG5cdFx0Z2wuZHJhd0FycmF5cyhnbC5UUklBTkdMRV9TVFJJUCwgMCwgbnVtUG9zaXRpb25zKTtcblx0XHRnbC5kaXNhYmxlKGdsLkJMRU5EKTtcblx0fVxuXG5cdHN0ZXBUcmlhbmdsZVN0cmlwKFxuXHRcdHBhcmFtczoge1xuXHRcdFx0cHJvZ3JhbTogR1BVUHJvZ3JhbSxcblx0XHRcdHBvc2l0aW9uczogRmxvYXQzMkFycmF5LFxuXHRcdFx0bm9ybWFscz86IEZsb2F0MzJBcnJheSxcblx0XHRcdHV2cz86IEZsb2F0MzJBcnJheSxcblx0XHRcdGlucHV0PzogKERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSlbXSB8IERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSxcblx0XHRcdG91dHB1dD86IERhdGFMYXllciwgLy8gVW5kZWZpbmVkIHJlbmRlcnMgdG8gc2NyZWVuLlxuXHRcdFx0Y291bnQ/OiBudW1iZXIsXG5cdFx0XHRzaG91bGRCbGVuZEFscGhhPzogYm9vbGVhbixcblx0XHR9LFxuXHQpIHtcblxuXHRcdGNvbnN0IHsgcHJvZ3JhbSwgaW5wdXQsIG91dHB1dCwgcG9zaXRpb25zLCB1dnMsIG5vcm1hbHMgfSA9IHBhcmFtcztcblx0XHRjb25zdCB7IGdsLCB3aWR0aCwgaGVpZ2h0LCBlcnJvclN0YXRlIH0gPSB0aGlzO1xuXG5cdFx0Ly8gSWdub3JlIGlmIHdlIGFyZSBpbiBlcnJvciBzdGF0ZS5cblx0XHRpZiAoZXJyb3JTdGF0ZSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGdsUHJvZ3JhbSA9ICh1dnMgP1xuXHRcdFx0KG5vcm1hbHMgPyBwcm9ncmFtLmRlZmF1bHRQcm9ncmFtV2l0aFVWTm9ybWFsIDogcHJvZ3JhbS5kZWZhdWx0UHJvZ3JhbVdpdGhVVikgOlxuXHRcdFx0KG5vcm1hbHMgPyBwcm9ncmFtLmRlZmF1bHRQcm9ncmFtV2l0aE5vcm1hbCA6IHByb2dyYW0uZGVmYXVsdFByb2dyYW0pXG5cdFx0KSE7XG5cblx0XHQvLyBEbyBzZXR1cCAtIHRoaXMgbXVzdCBjb21lIGZpcnN0LlxuXHRcdHRoaXMuZHJhd1NldHVwKGdsUHJvZ3JhbSwgZmFsc2UsIGlucHV0LCBvdXRwdXQpO1xuXG5cdFx0Ly8gVXBkYXRlIHVuaWZvcm1zIGFuZCBidWZmZXJzLlxuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3NjYWxlJywgWzIgLyB3aWR0aCwgMiAvIGhlaWdodF0sIEZMT0FUKTtcblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF90cmFuc2xhdGlvbicsIFstMSwgLTFdLCBGTE9BVCk7XG5cdFx0Ly8gSW5pdCBwb3NpdGlvbnMgYnVmZmVyLlxuXHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLmluaXRWZXJ0ZXhCdWZmZXIocG9zaXRpb25zKSEpO1xuXHRcdHRoaXMuc2V0UG9zaXRpb25BdHRyaWJ1dGUoZ2xQcm9ncmFtLCBwcm9ncmFtLm5hbWUpO1xuXHRcdGlmICh1dnMpIHtcblx0XHRcdC8vIEluaXQgdXYgYnVmZmVyLlxuXHRcdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHRoaXMuaW5pdFZlcnRleEJ1ZmZlcih1dnMpISk7XG5cdFx0XHR0aGlzLnNldFVWQXR0cmlidXRlKGdsUHJvZ3JhbSwgcHJvZ3JhbS5uYW1lKTtcblx0XHR9XG5cdFx0aWYgKG5vcm1hbHMpIHtcblx0XHRcdC8vIEluaXQgbm9ybWFscyBidWZmZXIuXG5cdFx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdGhpcy5pbml0VmVydGV4QnVmZmVyKG5vcm1hbHMpISk7XG5cdFx0XHR0aGlzLnNldFZlcnRleEF0dHJpYnV0ZShnbFByb2dyYW0sICdhX2ludGVybmFsX25vcm1hbCcsIDIsIHByb2dyYW0ubmFtZSk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgY291bnQgPSBwYXJhbXMuY291bnQgPyBwYXJhbXMuY291bnQgOiBwb3NpdGlvbnMubGVuZ3RoIC8gMjtcblxuXHRcdC8vIERyYXcuXG5cdFx0dGhpcy5zZXRCbGVuZE1vZGUocGFyYW1zLnNob3VsZEJsZW5kQWxwaGEpO1xuXHRcdGdsLmRyYXdBcnJheXMoZ2wuVFJJQU5HTEVfU1RSSVAsIDAsIGNvdW50KTtcblx0XHRnbC5kaXNhYmxlKGdsLkJMRU5EKTtcblx0fVxuXG5cdHN0ZXBMaW5lcyhwYXJhbXM6IHtcblx0XHRwcm9ncmFtOiBHUFVQcm9ncmFtLFxuXHRcdHBvc2l0aW9uczogRmxvYXQzMkFycmF5LFxuXHRcdGluZGljZXM/OiBVaW50MTZBcnJheSB8IFVpbnQzMkFycmF5IHwgSW50MTZBcnJheSB8IEludDMyQXJyYXksXG5cdFx0bm9ybWFscz86IEZsb2F0MzJBcnJheSxcblx0XHR1dnM/OiBGbG9hdDMyQXJyYXksXG5cdFx0aW5wdXQ/OiAoRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlKVtdIHwgRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlLFxuXHRcdG91dHB1dD86IERhdGFMYXllciwgLy8gVW5kZWZpbmVkIHJlbmRlcnMgdG8gc2NyZWVuLlxuXHRcdGNvdW50PzogbnVtYmVyLFxuXHRcdGNsb3NlTG9vcD86IGJvb2xlYW4sXG5cdFx0c2hvdWxkQmxlbmRBbHBoYT86IGJvb2xlYW4sXG5cdH0pIHtcblx0XHRjb25zdCB7IGdsLCBlcnJvclN0YXRlLCB3aWR0aCwgaGVpZ2h0IH0gPSB0aGlzO1xuXHRcdGNvbnN0IHsgaW5kaWNlcywgdXZzLCBub3JtYWxzLCBpbnB1dCwgb3V0cHV0LCBwcm9ncmFtIH0gPSBwYXJhbXM7XG5cblx0XHQvLyBJZ25vcmUgaWYgd2UgYXJlIGluIGVycm9yIHN0YXRlLlxuXHRcdGlmIChlcnJvclN0YXRlKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdC8vIENoZWNrIHRoYXQgcGFyYW1zIGFyZSB2YWxpZC5cblx0XHRpZiAocGFyYW1zLmNsb3NlTG9vcCAmJiBpbmRpY2VzKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFdlYkdMQ29tcHV0ZS5zdGVwTGluZXMoKSBjYW4ndCBiZSBjYWxsZWQgd2l0aCBjbG9zZUxvb3AgPT0gdHJ1ZSBhbmQgaW5kaWNlcy5gKTtcblx0XHR9XG5cdFx0XG5cdFx0Y29uc3QgZ2xQcm9ncmFtID0gKHV2cyA/XG5cdFx0XHQobm9ybWFscyA/IHByb2dyYW0uZGVmYXVsdFByb2dyYW1XaXRoVVZOb3JtYWwgOiBwcm9ncmFtLmRlZmF1bHRQcm9ncmFtV2l0aFVWKSA6XG5cdFx0XHQobm9ybWFscyA/IHByb2dyYW0uZGVmYXVsdFByb2dyYW1XaXRoTm9ybWFsIDogcHJvZ3JhbS5kZWZhdWx0UHJvZ3JhbSlcblx0XHQpITtcblxuXHRcdC8vIERvIHNldHVwIC0gdGhpcyBtdXN0IGNvbWUgZmlyc3QuXG5cdFx0dGhpcy5kcmF3U2V0dXAoZ2xQcm9ncmFtLCBmYWxzZSwgaW5wdXQsIG91dHB1dCk7XG5cblx0XHRjb25zdCBjb3VudCA9IHBhcmFtcy5jb3VudCA/IHBhcmFtcy5jb3VudCA6IChpbmRpY2VzID8gaW5kaWNlcy5sZW5ndGggOiAocGFyYW1zLnBvc2l0aW9ucy5sZW5ndGggLyAyKSk7XG5cblx0XHQvLyBVcGRhdGUgdW5pZm9ybXMgYW5kIGJ1ZmZlcnMuXG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfc2NhbGUnLCBbMiAvIHdpZHRoLCAyIC8gaGVpZ2h0XSwgRkxPQVQpO1xuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3RyYW5zbGF0aW9uJywgWy0xLCAtMV0sIEZMT0FUKTtcblx0XHRpZiAoaW5kaWNlcykge1xuXHRcdFx0Ly8gUmVvcmRlciBwb3NpdGlvbnMgYXJyYXkgdG8gbWF0Y2ggaW5kaWNlcy5cblx0XHRcdGNvbnN0IHBvc2l0aW9ucyA9IG5ldyBGbG9hdDMyQXJyYXkoMiAqIGNvdW50KTtcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuXHRcdFx0XHRjb25zdCBpbmRleCA9IGluZGljZXNbaV07XG5cdFx0XHRcdHBvc2l0aW9uc1syICogaV0gPSBwYXJhbXMucG9zaXRpb25zWzIgKiBpbmRleF07XG5cdFx0XHRcdHBvc2l0aW9uc1syICogaSArIDFdID0gcGFyYW1zLnBvc2l0aW9uc1syICogaW5kZXggKyAxXTtcblx0XHRcdH1cblx0XHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLmluaXRWZXJ0ZXhCdWZmZXIocG9zaXRpb25zKSEpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdGhpcy5pbml0VmVydGV4QnVmZmVyKHBhcmFtcy5wb3NpdGlvbnMpISk7XG5cdFx0fVxuXHRcdHRoaXMuc2V0UG9zaXRpb25BdHRyaWJ1dGUoZ2xQcm9ncmFtLCBwcm9ncmFtLm5hbWUpO1xuXHRcdGlmICh1dnMpIHtcblx0XHRcdC8vIEluaXQgdXYgYnVmZmVyLlxuXHRcdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHRoaXMuaW5pdFZlcnRleEJ1ZmZlcih1dnMpISk7XG5cdFx0XHR0aGlzLnNldFVWQXR0cmlidXRlKGdsUHJvZ3JhbSwgcHJvZ3JhbS5uYW1lKTtcblx0XHR9XG5cdFx0aWYgKG5vcm1hbHMpIHtcblx0XHRcdC8vIEluaXQgbm9ybWFscyBidWZmZXIuXG5cdFx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdGhpcy5pbml0VmVydGV4QnVmZmVyKG5vcm1hbHMpISk7XG5cdFx0XHR0aGlzLnNldFZlcnRleEF0dHJpYnV0ZShnbFByb2dyYW0sICdhX2ludGVybmFsX25vcm1hbCcsIDIsIHByb2dyYW0ubmFtZSk7XG5cdFx0fVxuXG5cdFx0Ly8gRHJhdy5cblx0XHR0aGlzLnNldEJsZW5kTW9kZShwYXJhbXMuc2hvdWxkQmxlbmRBbHBoYSk7XG5cdFx0aWYgKHBhcmFtcy5pbmRpY2VzKSB7XG5cdFx0XHRnbC5kcmF3QXJyYXlzKGdsLkxJTkVTLCAwLCBjb3VudCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmIChwYXJhbXMuY2xvc2VMb29wKSB7XG5cdFx0XHRcdGdsLmRyYXdBcnJheXMoZ2wuTElORV9MT09QLCAwLCBjb3VudCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRnbC5kcmF3QXJyYXlzKGdsLkxJTkVfU1RSSVAsIDAsIGNvdW50KTtcblx0XHRcdH1cblx0XHR9XG5cdFx0Z2wuZGlzYWJsZShnbC5CTEVORCk7XG5cdH1cblxuXHRkcmF3TGF5ZXJBc1BvaW50cyhcblx0XHRwYXJhbXM6IHtcblx0XHRcdHBvc2l0aW9uczogRGF0YUxheWVyLCAvLyBQb3NpdGlvbnMgaW4gY2FudmFzIHB4LlxuXHRcdFx0cHJvZ3JhbT86IEdQVVByb2dyYW0sXG5cdFx0XHRpbnB1dD86IChEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUpW10gfCBEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUsXG5cdFx0XHRvdXRwdXQ/OiBEYXRhTGF5ZXIsXG5cdFx0XHRwb2ludFNpemU/OiBudW1iZXIsXG5cdFx0XHRjb3VudD86IG51bWJlcixcblx0XHRcdGNvbG9yPzogW251bWJlciwgbnVtYmVyLCBudW1iZXJdLFxuXHRcdFx0d3JhcFg/OiBib29sZWFuLFxuXHRcdFx0d3JhcFk/OiBib29sZWFuLFxuXHRcdFx0c2hvdWxkQmxlbmRBbHBoYT86IGJvb2xlYW4sXG5cdFx0fSxcblx0KSB7XG5cdFx0Y29uc3QgeyBnbCwgZXJyb3JTdGF0ZSwgcG9pbnRJbmRleEFycmF5LCB3aWR0aCwgaGVpZ2h0IH0gPSB0aGlzO1xuXHRcdGNvbnN0IHsgcG9zaXRpb25zLCBvdXRwdXQgfSA9IHBhcmFtcztcblxuXHRcdC8vIElnbm9yZSBpZiB3ZSBhcmUgaW4gZXJyb3Igc3RhdGUuXG5cdFx0aWYgKGVycm9yU3RhdGUpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBDaGVjayB0aGF0IG51bVBvaW50cyBpcyB2YWxpZC5cblx0XHRpZiAocG9zaXRpb25zLm51bUNvbXBvbmVudHMgIT09IDIgJiYgcG9zaXRpb25zLm51bUNvbXBvbmVudHMgIT09IDQpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgV2ViR0xDb21wdXRlLmRyYXdQb2ludHMoKSBtdXN0IGJlIHBhc3NlZCBhIHBvc2l0aW9uIERhdGFMYXllciB3aXRoIGVpdGhlciAyIG9yIDQgY29tcG9uZW50cywgZ290IHBvc2l0aW9uIERhdGFMYXllciBcIiR7cG9zaXRpb25zLm5hbWV9XCIgd2l0aCAke3Bvc2l0aW9ucy5udW1Db21wb25lbnRzfSBjb21wb25lbnRzLmApXG5cdFx0fVxuXHRcdGNvbnN0IGxlbmd0aCA9IHBvc2l0aW9ucy5nZXRMZW5ndGgoKTtcblx0XHRjb25zdCBjb3VudCA9IHBhcmFtcy5jb3VudCB8fCBsZW5ndGg7XG5cdFx0aWYgKGNvdW50ID4gbGVuZ3RoKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgY291bnQgJHtjb3VudH0gZm9yIHBvc2l0aW9uIERhdGFMYXllciBvZiBsZW5ndGggJHtsZW5ndGh9LmApO1xuXHRcdH1cblxuXHRcdGxldCBwcm9ncmFtID0gcGFyYW1zLnByb2dyYW07XG5cdFx0aWYgKHByb2dyYW0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cHJvZ3JhbSA9IHRoaXMuc2luZ2xlQ29sb3JQcm9ncmFtO1xuXHRcdFx0Y29uc3QgY29sb3IgPSBwYXJhbXMuY29sb3IgfHwgWzEsIDAsIDBdOyAvLyBEZWZhdWx0IG9mIHJlZC5cblx0XHRcdHByb2dyYW0uc2V0VW5pZm9ybSgndV9jb2xvcicsIGNvbG9yLCBGTE9BVCk7XG5cdFx0fVxuXHRcdGNvbnN0IGdsUHJvZ3JhbSA9IHByb2dyYW0uZGF0YUxheWVyUG9pbnRzUHJvZ3JhbSE7XG5cblx0XHQvLyBBZGQgcG9zaXRpb25zIHRvIGVuZCBvZiBpbnB1dCBpZiBuZWVkZWQuXG5cdFx0Y29uc3QgaW5wdXQgPSB0aGlzLmFkZExheWVyVG9JbnB1dHMocG9zaXRpb25zLCBwYXJhbXMuaW5wdXQpO1xuXG5cdFx0Ly8gRG8gc2V0dXAgLSB0aGlzIG11c3QgY29tZSBmaXJzdC5cblx0XHR0aGlzLmRyYXdTZXR1cChnbFByb2dyYW0sIGZhbHNlLCBpbnB1dCwgb3V0cHV0KTtcblxuXHRcdC8vIFVwZGF0ZSB1bmlmb3JtcyBhbmQgYnVmZmVycy5cblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF9wb3NpdGlvbnMnLCBpbnB1dC5pbmRleE9mKHBvc2l0aW9ucyksIElOVCk7XG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfc2NhbGUnLCBbMSAvIHdpZHRoLCAxIC8gaGVpZ2h0XSwgRkxPQVQpO1xuXHRcdC8vIFRlbGwgd2hldGhlciB3ZSBhcmUgdXNpbmcgYW4gYWJzb2x1dGUgcG9zaXRpb24gKDIgY29tcG9uZW50cyksIG9yIHBvc2l0aW9uIHdpdGggYWNjdW11bGF0aW9uIGJ1ZmZlciAoNCBjb21wb25lbnRzLCBiZXR0ZXIgZmxvYXRpbmcgcHQgYWNjdXJhY3kpLlxuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3Bvc2l0aW9uV2l0aEFjY3VtdWxhdGlvbicsIHBvc2l0aW9ucy5udW1Db21wb25lbnRzID09PSA0ID8gMSA6IDAsIElOVCk7XG5cdFx0Ly8gU2V0IGRlZmF1bHQgcG9pbnRTaXplLlxuXHRcdGNvbnN0IHBvaW50U2l6ZSA9IHBhcmFtcy5wb2ludFNpemUgfHwgMTtcblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF9wb2ludFNpemUnLCBwb2ludFNpemUsIEZMT0FUKTtcblx0XHRjb25zdCBwb3NpdGlvbkxheWVyRGltZW5zaW9ucyA9IHBvc2l0aW9ucy5nZXREaW1lbnNpb25zKCk7XG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfcG9zaXRpb25zRGltZW5zaW9ucycsIHBvc2l0aW9uTGF5ZXJEaW1lbnNpb25zLCBGTE9BVCk7XG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfd3JhcFgnLCBwYXJhbXMud3JhcFggPyAxIDogMCwgSU5UKTtcblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF93cmFwWScsIHBhcmFtcy53cmFwWSA/IDEgOiAwLCBJTlQpO1xuXHRcdGlmICh0aGlzLnBvaW50SW5kZXhCdWZmZXIgPT09IHVuZGVmaW5lZCB8fCAocG9pbnRJbmRleEFycmF5ICYmIHBvaW50SW5kZXhBcnJheS5sZW5ndGggPCBjb3VudCkpIHtcblx0XHRcdC8vIEhhdmUgdG8gdXNlIGZsb2F0MzIgYXJyYXkgYmMgaW50IGlzIG5vdCBzdXBwb3J0ZWQgYXMgYSB2ZXJ0ZXggYXR0cmlidXRlIHR5cGUuXG5cdFx0XHRjb25zdCBpbmRpY2VzID0gaW5pdFNlcXVlbnRpYWxGbG9hdEFycmF5KGxlbmd0aCk7XG5cdFx0XHR0aGlzLnBvaW50SW5kZXhBcnJheSA9IGluZGljZXM7XG5cdFx0XHR0aGlzLnBvaW50SW5kZXhCdWZmZXIgPSB0aGlzLmluaXRWZXJ0ZXhCdWZmZXIoaW5kaWNlcyk7XG5cdFx0fVxuXHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLnBvaW50SW5kZXhCdWZmZXIhKTtcblx0XHR0aGlzLnNldEluZGV4QXR0cmlidXRlKGdsUHJvZ3JhbSwgcHJvZ3JhbS5uYW1lKTtcblxuXHRcdC8vIERyYXcuXG5cdFx0dGhpcy5zZXRCbGVuZE1vZGUocGFyYW1zLnNob3VsZEJsZW5kQWxwaGEpO1xuXHRcdGdsLmRyYXdBcnJheXMoZ2wuUE9JTlRTLCAwLCBjb3VudCk7XG5cdFx0Z2wuZGlzYWJsZShnbC5CTEVORCk7XG5cdH1cblxuXHRkcmF3TGF5ZXJBc0xpbmVzKFxuXHRcdHBhcmFtczoge1xuXHRcdFx0cG9zaXRpb25zOiBEYXRhTGF5ZXIsXG5cdFx0XHRpbmRpY2VzPzogRmxvYXQzMkFycmF5IHwgVWludDE2QXJyYXkgfCBVaW50MzJBcnJheSB8IEludDE2QXJyYXkgfCBJbnQzMkFycmF5LFxuXHRcdFx0cHJvZ3JhbT86IEdQVVByb2dyYW0sXG5cdFx0XHRpbnB1dD86IChEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUpW10gfCBEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUsXG5cdFx0XHRvdXRwdXQ/OiBEYXRhTGF5ZXIsXG5cdFx0XHRjb3VudD86IG51bWJlcixcblx0XHRcdGNvbG9yPzogW251bWJlciwgbnVtYmVyLCBudW1iZXJdLFxuXHRcdFx0d3JhcFg/OiBib29sZWFuLFxuXHRcdFx0d3JhcFk/OiBib29sZWFuLFxuXHRcdFx0Y2xvc2VMb29wPzogYm9vbGVhbixcblx0XHRcdHNob3VsZEJsZW5kQWxwaGE/OiBib29sZWFuLFxuXHRcdH0sXG5cdCkge1xuXHRcdGNvbnN0IHsgZ2wsIGVycm9yU3RhdGUsIHdpZHRoLCBoZWlnaHQgfSA9IHRoaXM7XG5cdFx0Y29uc3QgeyBwb3NpdGlvbnMsIG91dHB1dCB9ID0gcGFyYW1zO1xuXG5cdFx0Ly8gSWdub3JlIGlmIHdlIGFyZSBpbiBlcnJvciBzdGF0ZS5cblx0XHRpZiAoZXJyb3JTdGF0ZSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIENoZWNrIHRoYXQgcG9zaXRpb25zIGlzIHZhbGlkLlxuXHRcdGlmIChwb3NpdGlvbnMubnVtQ29tcG9uZW50cyAhPT0gMiAmJiBwb3NpdGlvbnMubnVtQ29tcG9uZW50cyAhPT0gNCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBXZWJHTENvbXB1dGUuZHJhd0xheWVyQXNMaW5lcygpIG11c3QgYmUgcGFzc2VkIGEgcG9zaXRpb24gRGF0YUxheWVyIHdpdGggZWl0aGVyIDIgb3IgNCBjb21wb25lbnRzLCBnb3QgcG9zaXRpb24gRGF0YUxheWVyIFwiJHtwb3NpdGlvbnMubmFtZX1cIiB3aXRoICR7cG9zaXRpb25zLm51bUNvbXBvbmVudHN9IGNvbXBvbmVudHMuYClcblx0XHR9XG5cdFx0Ly8gQ2hlY2sgdGhhdCBwYXJhbXMgYXJlIHZhbGlkLlxuXHRcdGlmIChwYXJhbXMuY2xvc2VMb29wICYmIHBhcmFtcy5pbmRpY2VzKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFdlYkdMQ29tcHV0ZS5kcmF3TGF5ZXJBc0xpbmVzKCkgY2FuJ3QgYmUgY2FsbGVkIHdpdGggY2xvc2VMb29wID09IHRydWUgYW5kIGluZGljZXMuYCk7XG5cdFx0fVxuXG5cdFx0bGV0IHByb2dyYW0gPSBwYXJhbXMucHJvZ3JhbTtcblx0XHRpZiAocHJvZ3JhbSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRwcm9ncmFtID0gcGFyYW1zLndyYXBYIHx8IHBhcmFtcy53cmFwWSA/IHRoaXMuc2luZ2xlQ29sb3JXaXRoV3JhcENoZWNrUHJvZ3JhbSA6IHRoaXMuc2luZ2xlQ29sb3JQcm9ncmFtO1xuXHRcdFx0Y29uc3QgY29sb3IgPSBwYXJhbXMuY29sb3IgfHwgWzEsIDAsIDBdOyAvLyBEZWZhdWx0IHRvIHJlZC5cblx0XHRcdHByb2dyYW0uc2V0VW5pZm9ybSgndV9jb2xvcicsIGNvbG9yLCBGTE9BVCk7XG5cdFx0fVxuXHRcdGNvbnN0IGdsUHJvZ3JhbSA9IHByb2dyYW0uZGF0YUxheWVyTGluZXNQcm9ncmFtITtcblxuXHRcdC8vIEFkZCBwb3NpdGlvbkxheWVyIHRvIGVuZCBvZiBpbnB1dCBpZiBuZWVkZWQuXG5cdFx0Y29uc3QgaW5wdXQgPSB0aGlzLmFkZExheWVyVG9JbnB1dHMocG9zaXRpb25zLCBwYXJhbXMuaW5wdXQpO1xuXG5cdFx0Ly8gRG8gc2V0dXAgLSB0aGlzIG11c3QgY29tZSBmaXJzdC5cblx0XHR0aGlzLmRyYXdTZXR1cChnbFByb2dyYW0sIGZhbHNlLCBpbnB1dCwgb3V0cHV0KTtcblxuXHRcdC8vIFRPRE86IGNhY2hlIGluZGV4QXJyYXkgaWYgbm8gaW5kaWNlcyBwYXNzZWQgaW4uXG5cdFx0Y29uc3QgaW5kaWNlcyA9IHBhcmFtcy5pbmRpY2VzID8gcGFyYW1zLmluZGljZXMgOiBpbml0U2VxdWVudGlhbEZsb2F0QXJyYXkocGFyYW1zLmNvdW50IHx8IHBvc2l0aW9ucy5nZXRMZW5ndGgoKSk7XG5cdFx0Y29uc3QgY291bnQgPSBwYXJhbXMuY291bnQgPyBwYXJhbXMuY291bnQgOiBpbmRpY2VzLmxlbmd0aDtcblxuXHRcdC8vIFVwZGF0ZSB1bmlmb3JtcyBhbmQgYnVmZmVycy5cblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF9wb3NpdGlvbnMnLCBpbnB1dC5pbmRleE9mKHBvc2l0aW9ucyksIElOVCk7XG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfc2NhbGUnLCBbMSAvIHdpZHRoLCAxIC8gaGVpZ2h0XSwgRkxPQVQpO1xuXHRcdC8vIFRlbGwgd2hldGhlciB3ZSBhcmUgdXNpbmcgYW4gYWJzb2x1dGUgcG9zaXRpb24gKDIgY29tcG9uZW50cyksIG9yIHBvc2l0aW9uIHdpdGggYWNjdW11bGF0aW9uIGJ1ZmZlciAoNCBjb21wb25lbnRzLCBiZXR0ZXIgZmxvYXRpbmcgcHQgYWNjdXJhY3kpLlxuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3Bvc2l0aW9uV2l0aEFjY3VtdWxhdGlvbicsIHBvc2l0aW9ucy5udW1Db21wb25lbnRzID09PSA0ID8gMSA6IDAsIElOVCk7XG5cdFx0Y29uc3QgcG9zaXRpb25MYXllckRpbWVuc2lvbnMgPSBwb3NpdGlvbnMuZ2V0RGltZW5zaW9ucygpO1xuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3Bvc2l0aW9uc0RpbWVuc2lvbnMnLCBwb3NpdGlvbkxheWVyRGltZW5zaW9ucywgRkxPQVQpO1xuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3dyYXBYJywgcGFyYW1zLndyYXBYID8gMSA6IDAsIElOVCk7XG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfd3JhcFknLCBwYXJhbXMud3JhcFkgPyAxIDogMCwgSU5UKTtcblx0XHRpZiAodGhpcy5pbmRleGVkTGluZXNJbmRleEJ1ZmZlciA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHQvLyBIYXZlIHRvIHVzZSBmbG9hdDMyIGFycmF5IGJjIGludCBpcyBub3Qgc3VwcG9ydGVkIGFzIGEgdmVydGV4IGF0dHJpYnV0ZSB0eXBlLlxuXHRcdFx0bGV0IGZsb2F0QXJyYXk6IEZsb2F0MzJBcnJheTtcblx0XHRcdGlmIChpbmRpY2VzLmNvbnN0cnVjdG9yICE9PSBGbG9hdDMyQXJyYXkpIHtcblx0XHRcdFx0Ly8gSGF2ZSB0byB1c2UgZmxvYXQzMiBhcnJheSBiYyBpbnQgaXMgbm90IHN1cHBvcnRlZCBhcyBhIHZlcnRleCBhdHRyaWJ1dGUgdHlwZS5cblx0XHRcdFx0ZmxvYXRBcnJheSA9IG5ldyBGbG9hdDMyQXJyYXkoaW5kaWNlcy5sZW5ndGgpO1xuXHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcblx0XHRcdFx0XHRmbG9hdEFycmF5W2ldID0gaW5kaWNlc1tpXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjb25zb2xlLndhcm4oYENvbnZlcnRpbmcgaW5kaWNlcyBhcnJheSBvZiB0eXBlICR7aW5kaWNlcy5jb25zdHJ1Y3Rvcn0gdG8gRmxvYXQzMkFycmF5IGluIFdlYkdMQ29tcHV0ZS5kcmF3SW5kZXhlZExpbmVzIGZvciBXZWJHTCBjb21wYXRpYmlsaXR5LCB5b3UgbWF5IHdhbnQgdG8gdXNlIGEgRmxvYXQzMkFycmF5IHRvIHN0b3JlIHRoaXMgaW5mb3JtYXRpb24gc28gdGhlIGNvbnZlcnNpb24gaXMgbm90IHJlcXVpcmVkLmApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZmxvYXRBcnJheSA9IGluZGljZXMgYXMgRmxvYXQzMkFycmF5O1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5pbmRleGVkTGluZXNJbmRleEJ1ZmZlciA9IHRoaXMuaW5pdFZlcnRleEJ1ZmZlcihmbG9hdEFycmF5KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHRoaXMuaW5kZXhlZExpbmVzSW5kZXhCdWZmZXIhKTtcblx0XHRcdC8vIENvcHkgYnVmZmVyIGRhdGEuXG5cdFx0XHRnbC5idWZmZXJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgaW5kaWNlcywgZ2wuU1RBVElDX0RSQVcpO1xuXHRcdH1cblx0XHR0aGlzLnNldEluZGV4QXR0cmlidXRlKGdsUHJvZ3JhbSwgcHJvZ3JhbS5uYW1lKTtcblxuXHRcdC8vIERyYXcuXG5cdFx0dGhpcy5zZXRCbGVuZE1vZGUocGFyYW1zLnNob3VsZEJsZW5kQWxwaGEpO1xuXHRcdGlmIChwYXJhbXMuaW5kaWNlcykge1xuXHRcdFx0Z2wuZHJhd0FycmF5cyhnbC5MSU5FUywgMCwgY291bnQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAocGFyYW1zLmNsb3NlTG9vcCkge1xuXHRcdFx0XHRnbC5kcmF3QXJyYXlzKGdsLkxJTkVfTE9PUCwgMCwgY291bnQpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Z2wuZHJhd0FycmF5cyhnbC5MSU5FX1NUUklQLCAwLCBjb3VudCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGdsLmRpc2FibGUoZ2wuQkxFTkQpO1xuXHR9XG5cblx0ZHJhd0xheWVyQXNWZWN0b3JGaWVsZChcblx0XHRwYXJhbXM6IHtcblx0XHRcdGRhdGE6IERhdGFMYXllcixcblx0XHRcdHByb2dyYW0/OiBHUFVQcm9ncmFtLFxuXHRcdFx0aW5wdXQ/OiAoRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlKVtdIHwgRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlLFxuXHRcdFx0b3V0cHV0PzogRGF0YUxheWVyLFxuXHRcdFx0dmVjdG9yU3BhY2luZz86IG51bWJlcixcblx0XHRcdHZlY3RvclNjYWxlPzogbnVtYmVyLFxuXHRcdFx0Y29sb3I/OiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0sXG5cdFx0XHRzaG91bGRCbGVuZEFscGhhPzogYm9vbGVhbixcblx0XHR9LFxuXHQpIHtcblx0XHRjb25zdCB7IGdsLCBlcnJvclN0YXRlLCB2ZWN0b3JGaWVsZEluZGV4QXJyYXksIHdpZHRoLCBoZWlnaHQgfSA9IHRoaXM7XG5cdFx0Y29uc3QgeyBkYXRhLCBvdXRwdXQgfSA9IHBhcmFtcztcblxuXHRcdC8vIElnbm9yZSBpZiB3ZSBhcmUgaW4gZXJyb3Igc3RhdGUuXG5cdFx0aWYgKGVycm9yU3RhdGUpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBDaGVjayB0aGF0IGZpZWxkIGlzIHZhbGlkLlxuXHRcdGlmIChkYXRhLm51bUNvbXBvbmVudHMgIT09IDIpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgV2ViR0xDb21wdXRlLmRyYXdMYXllckFzVmVjdG9yRmllbGQoKSBtdXN0IGJlIHBhc3NlZCBhIGZpZWxkTGF5ZXIgd2l0aCAyIGNvbXBvbmVudHMsIGdvdCBmaWVsZExheWVyIFwiJHtkYXRhLm5hbWV9XCIgd2l0aCAke2RhdGEubnVtQ29tcG9uZW50c30gY29tcG9uZW50cy5gKVxuXHRcdH1cblx0XHQvLyBDaGVjayBhc3BlY3QgcmF0aW8uXG5cdFx0Ly8gY29uc3QgZGltZW5zaW9ucyA9IHZlY3RvckxheWVyLmdldERpbWVuc2lvbnMoKTtcblx0XHQvLyBpZiAoTWF0aC5hYnMoZGltZW5zaW9uc1swXSAvIGRpbWVuc2lvbnNbMV0gLSB3aWR0aCAvIGhlaWdodCkgPiAwLjAxKSB7XG5cdFx0Ly8gXHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgYXNwZWN0IHJhdGlvICR7KGRpbWVuc2lvbnNbMF0gLyBkaW1lbnNpb25zWzFdKS50b0ZpeGVkKDMpfSB2ZWN0b3IgRGF0YUxheWVyIHdpdGggZGltZW5zaW9ucyBbJHtkaW1lbnNpb25zWzBdfSwgJHtkaW1lbnNpb25zWzFdfV0sIGV4cGVjdGVkICR7KHdpZHRoIC8gaGVpZ2h0KS50b0ZpeGVkKDMpfS5gKTtcblx0XHQvLyB9XG5cblx0XHRsZXQgcHJvZ3JhbSA9IHBhcmFtcy5wcm9ncmFtO1xuXHRcdGlmIChwcm9ncmFtID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHByb2dyYW0gPSB0aGlzLnNpbmdsZUNvbG9yUHJvZ3JhbTtcblx0XHRcdGNvbnN0IGNvbG9yID0gcGFyYW1zLmNvbG9yIHx8IFsxLCAwLCAwXTsgLy8gRGVmYXVsdCB0byByZWQuXG5cdFx0XHRwcm9ncmFtLnNldFVuaWZvcm0oJ3VfY29sb3InLCBjb2xvciwgRkxPQVQpO1xuXHRcdH1cblx0XHRjb25zdCBnbFByb2dyYW0gPSBwcm9ncmFtLmRhdGFMYXllclZlY3RvckZpZWxkUHJvZ3JhbSE7XG5cblx0XHQvLyBBZGQgZGF0YSB0byBlbmQgb2YgaW5wdXQgaWYgbmVlZGVkLlxuXHRcdGNvbnN0IGlucHV0ID0gdGhpcy5hZGRMYXllclRvSW5wdXRzKGRhdGEsIHBhcmFtcy5pbnB1dCk7XG5cblx0XHQvLyBEbyBzZXR1cCAtIHRoaXMgbXVzdCBjb21lIGZpcnN0LlxuXHRcdHRoaXMuZHJhd1NldHVwKGdsUHJvZ3JhbSwgZmFsc2UsIGlucHV0LCBvdXRwdXQpO1xuXG5cdFx0Ly8gVXBkYXRlIHVuaWZvcm1zIGFuZCBidWZmZXJzLlxuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3ZlY3RvcnMnLCBpbnB1dC5pbmRleE9mKGRhdGEpLCBJTlQpO1xuXHRcdC8vIFNldCBkZWZhdWx0IHNjYWxlLlxuXHRcdGNvbnN0IHZlY3RvclNjYWxlID0gcGFyYW1zLnZlY3RvclNjYWxlIHx8IDE7XG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfc2NhbGUnLCBbdmVjdG9yU2NhbGUgLyB3aWR0aCwgdmVjdG9yU2NhbGUgLyBoZWlnaHRdLCBGTE9BVCk7XG5cdFx0Y29uc3QgdmVjdG9yU3BhY2luZyA9IHBhcmFtcy52ZWN0b3JTcGFjaW5nIHx8IDEwO1xuXHRcdGNvbnN0IHNwYWNlZERpbWVuc2lvbnMgPSBbTWF0aC5mbG9vcih3aWR0aCAvIHZlY3RvclNwYWNpbmcpLCBNYXRoLmZsb29yKGhlaWdodCAvIHZlY3RvclNwYWNpbmcpXSBhcyBbbnVtYmVyLCBudW1iZXJdO1xuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX2RpbWVuc2lvbnMnLCBzcGFjZWREaW1lbnNpb25zLCBGTE9BVCk7XG5cdFx0Y29uc3QgbGVuZ3RoID0gMiAqIHNwYWNlZERpbWVuc2lvbnNbMF0gKiBzcGFjZWREaW1lbnNpb25zWzFdO1xuXHRcdGlmICh0aGlzLnZlY3RvckZpZWxkSW5kZXhCdWZmZXIgPT09IHVuZGVmaW5lZCB8fCAodmVjdG9yRmllbGRJbmRleEFycmF5ICYmIHZlY3RvckZpZWxkSW5kZXhBcnJheS5sZW5ndGggPCBsZW5ndGgpKSB7XG5cdFx0XHQvLyBIYXZlIHRvIHVzZSBmbG9hdDMyIGFycmF5IGJjIGludCBpcyBub3Qgc3VwcG9ydGVkIGFzIGEgdmVydGV4IGF0dHJpYnV0ZSB0eXBlLlxuXHRcdFx0Y29uc3QgaW5kaWNlcyA9IGluaXRTZXF1ZW50aWFsRmxvYXRBcnJheShsZW5ndGgpO1xuXHRcdFx0dGhpcy52ZWN0b3JGaWVsZEluZGV4QXJyYXkgPSBpbmRpY2VzO1xuXHRcdFx0dGhpcy52ZWN0b3JGaWVsZEluZGV4QnVmZmVyID0gdGhpcy5pbml0VmVydGV4QnVmZmVyKGluZGljZXMpO1xuXHRcdH1cblx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdGhpcy52ZWN0b3JGaWVsZEluZGV4QnVmZmVyISk7XG5cdFx0dGhpcy5zZXRJbmRleEF0dHJpYnV0ZShnbFByb2dyYW0sIHByb2dyYW0ubmFtZSk7XG5cblx0XHQvLyBEcmF3LlxuXHRcdHRoaXMuc2V0QmxlbmRNb2RlKHBhcmFtcy5zaG91bGRCbGVuZEFscGhhKTtcblx0XHRnbC5kcmF3QXJyYXlzKGdsLkxJTkVTLCAwLCBsZW5ndGgpO1xuXHRcdGdsLmRpc2FibGUoZ2wuQkxFTkQpO1xuXHR9XG5cblx0ZHJhd0xheWVyTWFnbml0dWRlKFxuXHRcdHBhcmFtczoge1xuXHRcdFx0ZGF0YTogRGF0YUxheWVyLFxuXHRcdFx0aW5wdXQ/OiAoRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlKVtdIHwgRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlLFxuXHRcdFx0b3V0cHV0PzogRGF0YUxheWVyLFxuXHRcdFx0c2NhbGU/OiBudW1iZXIsXG5cdFx0XHRjb2xvcj86IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSxcblx0XHRcdHNob3VsZEJsZW5kQWxwaGE/OiBib29sZWFuLFxuXHRcdH0sXG5cdCkge1xuXHRcdGNvbnN0IHsgZ2wsIGVycm9yU3RhdGUsIHF1YWRQb3NpdGlvbnNCdWZmZXIgfSA9IHRoaXM7XG5cdFx0Y29uc3QgeyBkYXRhLCBvdXRwdXQgfSA9IHBhcmFtcztcblxuXHRcdC8vIElnbm9yZSBpZiB3ZSBhcmUgaW4gZXJyb3Igc3RhdGUuXG5cdFx0aWYgKGVycm9yU3RhdGUpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBwcm9ncmFtID0gdGhpcy52ZWN0b3JNYWduaXR1ZGVQcm9ncmFtO1xuXHRcdGNvbnN0IGNvbG9yID0gcGFyYW1zLmNvbG9yIHx8IFsxLCAwLCAwXTsgLy8gRGVmYXVsdCB0byByZWQuXG5cdFx0cHJvZ3JhbS5zZXRVbmlmb3JtKCd1X2NvbG9yJywgY29sb3IsIEZMT0FUKTtcblx0XHRjb25zdCBzY2FsZSA9IHBhcmFtcy5zY2FsZSB8fCAxO1xuXHRcdHByb2dyYW0uc2V0VW5pZm9ybSgndV9zY2FsZScsIHNjYWxlLCBGTE9BVCk7XG5cdFx0cHJvZ3JhbS5zZXRVbmlmb3JtKCd1X2ludGVybmFsX251bURpbWVuc2lvbnMnLCBkYXRhLm51bUNvbXBvbmVudHMsIElOVCk7XG5cblx0XHRjb25zdCBnbFByb2dyYW0gPSBwcm9ncmFtLmRlZmF1bHRQcm9ncmFtITtcblxuXHRcdC8vIEFkZCBkYXRhIHRvIGVuZCBvZiBpbnB1dCBpZiBuZWVkZWQuXG5cdFx0Y29uc3QgaW5wdXQgPSB0aGlzLmFkZExheWVyVG9JbnB1dHMoZGF0YSwgcGFyYW1zLmlucHV0KTtcblx0XHQvLyBEbyBzZXR1cCAtIHRoaXMgbXVzdCBjb21lIGZpcnN0LlxuXHRcdHRoaXMuZHJhd1NldHVwKGdsUHJvZ3JhbSwgdHJ1ZSwgaW5wdXQsIG91dHB1dCk7XG5cblx0XHQvLyBVcGRhdGUgdW5pZm9ybXMgYW5kIGJ1ZmZlcnMuXG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfZGF0YScsIGlucHV0LmluZGV4T2YoZGF0YSksIElOVCk7XG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfc2NhbGUnLCBbMSwgMV0sIEZMT0FUKTtcblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF90cmFuc2xhdGlvbicsIFswLCAwXSwgRkxPQVQpO1xuXHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBxdWFkUG9zaXRpb25zQnVmZmVyKTtcblx0XHR0aGlzLnNldFBvc2l0aW9uQXR0cmlidXRlKGdsUHJvZ3JhbSwgcHJvZ3JhbS5uYW1lKTtcblxuXHRcdC8vIERyYXcuXG5cdFx0dGhpcy5zZXRCbGVuZE1vZGUocGFyYW1zLnNob3VsZEJsZW5kQWxwaGEpO1xuXHRcdGdsLmRyYXdBcnJheXMoZ2wuVFJJQU5HTEVfU1RSSVAsIDAsIDQpO1xuXHRcdGdsLmRpc2FibGUoZ2wuQkxFTkQpO1xuXHR9XG5cdFxuXHRnZXRDb250ZXh0KCkge1xuXHRcdHJldHVybiB0aGlzLmdsO1xuXHR9XG5cblx0Z2V0VmFsdWVzKGRhdGFMYXllcjogRGF0YUxheWVyKSB7XG5cdFx0Y29uc3QgeyBnbCwgZ2xzbFZlcnNpb24gfSA9IHRoaXM7XG5cblx0XHQvLyBJbiBjYXNlIGRhdGFMYXllciB3YXMgbm90IHRoZSBsYXN0IG91dHB1dCB3cml0dGVuIHRvLlxuXHRcdGRhdGFMYXllci5fYmluZE91dHB1dEJ1ZmZlcigpO1xuXG5cdFx0Y29uc3QgWyB3aWR0aCwgaGVpZ2h0IF0gPSBkYXRhTGF5ZXIuZ2V0RGltZW5zaW9ucygpO1xuXHRcdGxldCB7IGdsTnVtQ2hhbm5lbHMsIGdsVHlwZSwgZ2xGb3JtYXQsIGludGVybmFsVHlwZSB9ID0gZGF0YUxheWVyO1xuXHRcdGxldCB2YWx1ZXM7XG5cdFx0c3dpdGNoIChpbnRlcm5hbFR5cGUpIHtcblx0XHRcdGNhc2UgSEFMRl9GTE9BVDpcblx0XHRcdFx0aWYgKGdsLkZMT0FUICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHQvLyBGaXJlZm94IHJlcXVpcmVzIHRoYXQgUkdCQS9GTE9BVCBpcyB1c2VkIGZvciByZWFkUGl4ZWxzIG9mIGZsb2F0MTYgdHlwZXMuXG5cdFx0XHRcdFx0Z2xOdW1DaGFubmVscyA9IDQ7XG5cdFx0XHRcdFx0Z2xGb3JtYXQgPSBnbC5SR0JBO1xuXHRcdFx0XHRcdGdsVHlwZSA9IGdsLkZMT0FUO1xuXHRcdFx0XHRcdHZhbHVlcyA9IG5ldyBGbG9hdDMyQXJyYXkod2lkdGggKiBoZWlnaHQgKiBnbE51bUNoYW5uZWxzKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR2YWx1ZXMgPSBuZXcgVWludDE2QXJyYXkod2lkdGggKiBoZWlnaHQgKiBnbE51bUNoYW5uZWxzKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyAvLyBUaGUgZm9sbG93aW5nIHdvcmtzIGluIENocm9tZS5cblx0XHRcdFx0Ly8gdmFsdWVzID0gbmV3IFVpbnQxNkFycmF5KHdpZHRoICogaGVpZ2h0ICogZ2xOdW1DaGFubmVscyk7XG5cdFx0XHRcdGJyZWFrXG5cdFx0XHRjYXNlIEZMT0FUOlxuXHRcdFx0XHQvLyBDaHJvbWUgYW5kIEZpcmVmb3ggcmVxdWlyZSB0aGF0IFJHQkEvRkxPQVQgaXMgdXNlZCBmb3IgcmVhZFBpeGVscyBvZiBmbG9hdDMyIHR5cGVzLlxuXHRcdFx0XHQvLyBodHRwczovL2dpdGh1Yi5jb20vS2hyb25vc0dyb3VwL1dlYkdML2lzc3Vlcy8yNzQ3XG5cdFx0XHRcdGdsTnVtQ2hhbm5lbHMgPSA0O1xuXHRcdFx0XHRnbEZvcm1hdCA9IGdsLlJHQkE7XG5cdFx0XHRcdHZhbHVlcyA9IG5ldyBGbG9hdDMyQXJyYXkod2lkdGggKiBoZWlnaHQgKiBnbE51bUNoYW5uZWxzKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFVOU0lHTkVEX0JZVEU6XG5cdFx0XHRcdGlmIChnbHNsVmVyc2lvbiA9PT0gR0xTTDEpIHtcblx0XHRcdFx0XHQvLyBGaXJlZm94IHJlcXVpcmVzIHRoYXQgUkdCQS9VTlNJR05FRF9CWVRFIGlzIHVzZWQgZm9yIHJlYWRQaXhlbHMgb2YgdW5zaWduZWQgYnl0ZSB0eXBlcy5cblx0XHRcdFx0XHRnbE51bUNoYW5uZWxzID0gNDtcblx0XHRcdFx0XHRnbEZvcm1hdCA9IGdsLlJHQkE7XG5cdFx0XHRcdFx0dmFsdWVzID0gbmV3IFVpbnQ4QXJyYXkod2lkdGggKiBoZWlnaHQgKiBnbE51bUNoYW5uZWxzKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyBGaXJlZm94IHJlcXVpcmVzIHRoYXQgUkdCQV9JTlRFR0VSL1VOU0lHTkVEX0lOVCBpcyB1c2VkIGZvciByZWFkUGl4ZWxzIG9mIHVuc2lnbmVkIGludCB0eXBlcy5cblx0XHRcdFx0Z2xOdW1DaGFubmVscyA9IDQ7XG5cdFx0XHRcdGdsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHQkFfSU5URUdFUjtcblx0XHRcdFx0Z2xUeXBlID0gZ2wuVU5TSUdORURfSU5UO1xuXHRcdFx0XHR2YWx1ZXMgPSBuZXcgVWludDMyQXJyYXkod2lkdGggKiBoZWlnaHQgKiBnbE51bUNoYW5uZWxzKTtcblx0XHRcdFx0Ly8gLy8gVGhlIGZvbGxvd2luZyB3b3JrcyBpbiBDaHJvbWUuXG5cdFx0XHRcdC8vIHZhbHVlcyA9IG5ldyBVaW50OEFycmF5KHdpZHRoICogaGVpZ2h0ICogZ2xOdW1DaGFubmVscyk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBVTlNJR05FRF9TSE9SVDpcblx0XHRcdFx0Ly8gRmlyZWZveCByZXF1aXJlcyB0aGF0IFJHQkFfSU5URUdFUi9VTlNJR05FRF9JTlQgaXMgdXNlZCBmb3IgcmVhZFBpeGVscyBvZiB1bnNpZ25lZCBpbnQgdHlwZXMuXG5cdFx0XHRcdGdsTnVtQ2hhbm5lbHMgPSA0O1xuXHRcdFx0XHRnbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR0JBX0lOVEVHRVI7XG5cdFx0XHRcdGdsVHlwZSA9IGdsLlVOU0lHTkVEX0lOVDtcblx0XHRcdFx0dmFsdWVzID0gbmV3IFVpbnQzMkFycmF5KHdpZHRoICogaGVpZ2h0ICogZ2xOdW1DaGFubmVscyk7XG5cdFx0XHRcdC8vIC8vIFRoZSBmb2xsb3dpbmcgd29ya3MgaW4gQ2hyb21lLlxuXHRcdFx0XHQvLyB2YWx1ZXMgPSBuZXcgVWludDE2QXJyYXkod2lkdGggKiBoZWlnaHQgKiBnbE51bUNoYW5uZWxzKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFVOU0lHTkVEX0lOVDpcblx0XHRcdFx0Ly8gRmlyZWZveCByZXF1aXJlcyB0aGF0IFJHQkFfSU5URUdFUi9VTlNJR05FRF9JTlQgaXMgdXNlZCBmb3IgcmVhZFBpeGVscyBvZiB1bnNpZ25lZCBpbnQgdHlwZXMuXG5cdFx0XHRcdGdsTnVtQ2hhbm5lbHMgPSA0O1xuXHRcdFx0XHRnbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR0JBX0lOVEVHRVI7XG5cdFx0XHRcdHZhbHVlcyA9IG5ldyBVaW50MzJBcnJheSh3aWR0aCAqIGhlaWdodCAqIGdsTnVtQ2hhbm5lbHMpO1xuXHRcdFx0XHQvLyAvLyBUaGUgZm9sbG93aW5nIHdvcmtzIGluIENocm9tZS5cblx0XHRcdFx0Ly8gdmFsdWVzID0gbmV3IFVpbnQzMkFycmF5KHdpZHRoICogaGVpZ2h0ICogZ2xOdW1DaGFubmVscyk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBCWVRFOlxuXHRcdFx0XHQvLyBGaXJlZm94IHJlcXVpcmVzIHRoYXQgUkdCQV9JTlRFR0VSL0lOVCBpcyB1c2VkIGZvciByZWFkUGl4ZWxzIG9mIGludCB0eXBlcy5cblx0XHRcdFx0Z2xOdW1DaGFubmVscyA9IDQ7XG5cdFx0XHRcdGdsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHQkFfSU5URUdFUjtcblx0XHRcdFx0Z2xUeXBlID0gZ2wuSU5UO1xuXHRcdFx0XHR2YWx1ZXMgPSBuZXcgSW50MzJBcnJheSh3aWR0aCAqIGhlaWdodCAqIGdsTnVtQ2hhbm5lbHMpO1xuXHRcdFx0XHQvLyAvLyBUaGUgZm9sbG93aW5nIHdvcmtzIGluIENocm9tZS5cblx0XHRcdFx0Ly8gdmFsdWVzID0gbmV3IEludDhBcnJheSh3aWR0aCAqIGhlaWdodCAqIGdsTnVtQ2hhbm5lbHMpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgU0hPUlQ6XG5cdFx0XHRcdC8vIEZpcmVmb3ggcmVxdWlyZXMgdGhhdCBSR0JBX0lOVEVHRVIvSU5UIGlzIHVzZWQgZm9yIHJlYWRQaXhlbHMgb2YgaW50IHR5cGVzLlxuXHRcdFx0XHRnbE51bUNoYW5uZWxzID0gNDtcblx0XHRcdFx0Z2xGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkdCQV9JTlRFR0VSO1xuXHRcdFx0XHRnbFR5cGUgPSBnbC5JTlQ7XG5cdFx0XHRcdHZhbHVlcyA9IG5ldyBJbnQzMkFycmF5KHdpZHRoICogaGVpZ2h0ICogZ2xOdW1DaGFubmVscyk7XG5cdFx0XHRcdC8vIC8vIFRoZSBmb2xsb3dpbmcgd29ya3MgaW4gQ2hyb21lLlxuXHRcdFx0XHQvLyB2YWx1ZXMgPSBuZXcgSW50MTZBcnJheSh3aWR0aCAqIGhlaWdodCAqIGdsTnVtQ2hhbm5lbHMpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgSU5UOlxuXHRcdFx0XHQvLyBGaXJlZm94IHJlcXVpcmVzIHRoYXQgUkdCQV9JTlRFR0VSL0lOVCBpcyB1c2VkIGZvciByZWFkUGl4ZWxzIG9mIGludCB0eXBlcy5cblx0XHRcdFx0Z2xOdW1DaGFubmVscyA9IDQ7XG5cdFx0XHRcdGdsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHQkFfSU5URUdFUjtcblx0XHRcdFx0dmFsdWVzID0gbmV3IEludDMyQXJyYXkod2lkdGggKiBoZWlnaHQgKiBnbE51bUNoYW5uZWxzKTtcblx0XHRcdFx0Ly8gLy8gVGhlIGZvbGxvd2luZyB3b3JrcyBpbiBDaHJvbWUuXG5cdFx0XHRcdC8vIHZhbHVlcyA9IG5ldyBJbnQzMkFycmF5KHdpZHRoICogaGVpZ2h0ICogZ2xOdW1DaGFubmVscyk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBpbnRlcm5hbFR5cGUgJHtpbnRlcm5hbFR5cGV9IGZvciBnZXRWYWx1ZXMoKS5gKTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5yZWFkeVRvUmVhZCgpKSB7XG5cdFx0XHQvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvV2ViR0xSZW5kZXJpbmdDb250ZXh0L3JlYWRQaXhlbHNcblx0XHRcdGdsLnJlYWRQaXhlbHMoMCwgMCwgd2lkdGgsIGhlaWdodCwgZ2xGb3JtYXQsIGdsVHlwZSwgdmFsdWVzKTtcblx0XHRcdGNvbnN0IHsgbnVtQ29tcG9uZW50cywgdHlwZSB9ID0gZGF0YUxheWVyO1xuXHRcdFx0Y29uc3QgT1VUUFVUX0xFTkdUSCA9IHdpZHRoICogaGVpZ2h0ICogbnVtQ29tcG9uZW50cztcblxuXHRcdFx0Ly8gQ29udmVydCB1aW50MTYgdG8gZmxvYXQzMiBpZiBuZWVkZWQuXG5cdFx0XHRjb25zdCBoYW5kbGVGbG9hdDE2Q29udmVyc2lvbiA9IGludGVybmFsVHlwZSA9PT0gSEFMRl9GTE9BVCAmJiB2YWx1ZXMuY29uc3RydWN0b3IgPT09IFVpbnQxNkFycmF5O1xuXHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0Y29uc3QgdmlldyA9IGhhbmRsZUZsb2F0MTZDb252ZXJzaW9uID8gbmV3IERhdGFWaWV3KCh2YWx1ZXMgYXMgVWludDE2QXJyYXkpLmJ1ZmZlcikgOiB1bmRlZmluZWQ7XG5cblx0XHRcdGxldCBvdXRwdXQ6IERhdGFMYXllckFycmF5VHlwZSA9IHZhbHVlcztcblx0XHRcdFxuXHRcdFx0Ly8gV2UgbWF5IHVzZSBhIGRpZmZlcmVudCBpbnRlcm5hbCB0eXBlIHRoYW4gdGhlIGFzc2lnbmVkIHR5cGUgb2YgdGhlIERhdGFMYXllci5cblx0XHRcdGlmIChpbnRlcm5hbFR5cGUgIT09IHR5cGUpIHtcblx0XHRcdFx0c3dpdGNoICh0eXBlKSB7XG5cdFx0XHRcdFx0Y2FzZSBIQUxGX0ZMT0FUOlxuXHRcdFx0XHRcdGNhc2UgRkxPQVQ6XG5cdFx0XHRcdFx0XHRvdXRwdXQgPSBuZXcgRmxvYXQzMkFycmF5KE9VVFBVVF9MRU5HVEgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBVTlNJR05FRF9CWVRFOlxuXHRcdFx0XHRcdFx0b3V0cHV0ID0gbmV3IFVpbnQ4QXJyYXkoT1VUUFVUX0xFTkdUSCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIEJZVEU6XG5cdFx0XHRcdFx0XHRvdXRwdXQgPSBuZXcgSW50OEFycmF5KE9VVFBVVF9MRU5HVEgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBVTlNJR05FRF9TSE9SVDpcblx0XHRcdFx0XHRcdG91dHB1dCA9IG5ldyBVaW50MTZBcnJheShPVVRQVVRfTEVOR1RIKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgU0hPUlQ6XG5cdFx0XHRcdFx0XHRvdXRwdXQgPSBuZXcgSW50MTZBcnJheShPVVRQVVRfTEVOR1RIKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgVU5TSUdORURfSU5UOlxuXHRcdFx0XHRcdFx0b3V0cHV0ID0gbmV3IFVpbnQzMkFycmF5KE9VVFBVVF9MRU5HVEgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBJTlQ6XG5cdFx0XHRcdFx0XHRvdXRwdXQgPSBuZXcgSW50MzJBcnJheShPVVRQVVRfTEVOR1RIKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIHR5cGUgJHt0eXBlfSBmb3IgZ2V0VmFsdWVzKCkuYCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gSW4gc29tZSBjYXNlcyBnbE51bUNoYW5uZWxzIG1heSBiZSA+IG51bUNvbXBvbmVudHMuXG5cdFx0XHRpZiAoaGFuZGxlRmxvYXQxNkNvbnZlcnNpb24gfHwgb3V0cHV0ICE9PSB2YWx1ZXMgfHwgbnVtQ29tcG9uZW50cyAhPT0gZ2xOdW1DaGFubmVscykge1xuXHRcdFx0XHRmb3IgKGxldCBpID0gMCwgbGVuZ3RoID0gd2lkdGggKiBoZWlnaHQ7IGkgPCBsZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdGNvbnN0IGluZGV4MSA9IGkgKiBnbE51bUNoYW5uZWxzO1xuXHRcdFx0XHRcdGNvbnN0IGluZGV4MiA9IGkgKiBudW1Db21wb25lbnRzO1xuXHRcdFx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgbnVtQ29tcG9uZW50czsgaisrKSB7XG5cdFx0XHRcdFx0XHRpZiAoaGFuZGxlRmxvYXQxNkNvbnZlcnNpb24pIHtcblx0XHRcdFx0XHRcdFx0b3V0cHV0W2luZGV4MiArIGpdID0gZ2V0RmxvYXQxNih2aWV3ISwgMiAqIChpbmRleDEgKyBqKSwgdHJ1ZSk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRvdXRwdXRbaW5kZXgyICsgal0gPSB2YWx1ZXNbaW5kZXgxICsgal07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmIChvdXRwdXQubGVuZ3RoICE9PSBPVVRQVVRfTEVOR1RIKSB7XG5cdFx0XHRcdG91dHB1dCA9IG91dHB1dC5zbGljZSgwLCBPVVRQVVRfTEVOR1RIKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBvdXRwdXQ7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIHJlYWQgdmFsdWVzIGZyb20gQnVmZmVyIHdpdGggc3RhdHVzOiAke2dsLmNoZWNrRnJhbWVidWZmZXJTdGF0dXMoZ2wuRlJBTUVCVUZGRVIpfS5gKTtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIHJlYWR5VG9SZWFkKCkge1xuXHRcdGNvbnN0IHsgZ2wgfSA9IHRoaXM7XG5cdFx0cmV0dXJuIGdsLmNoZWNrRnJhbWVidWZmZXJTdGF0dXMoZ2wuRlJBTUVCVUZGRVIpID09IGdsLkZSQU1FQlVGRkVSX0NPTVBMRVRFO1xuXHR9O1xuXG5cdHNhdmVQTkcoZGF0YUxheWVyOiBEYXRhTGF5ZXIsIGZpbGVuYW1lID0gZGF0YUxheWVyLm5hbWUsIGRwaT86IG51bWJlcikge1xuXHRcdGNvbnN0IHZhbHVlcyA9IHRoaXMuZ2V0VmFsdWVzKGRhdGFMYXllcik7XG5cdFx0Y29uc3QgW3dpZHRoLCBoZWlnaHRdID0gZGF0YUxheWVyLmdldERpbWVuc2lvbnMoKTtcblxuXHRcdGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuXHRcdGNhbnZhcy53aWR0aCA9IHdpZHRoO1xuICAgIFx0Y2FudmFzLmhlaWdodCA9IGhlaWdodDtcblx0XHRjb25zdCBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJykhO1xuXHRcdGNvbnN0IGltYWdlRGF0YSA9IGNvbnRleHQuZ2V0SW1hZ2VEYXRhKDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuXHRcdGNvbnN0IGJ1ZmZlciA9IGltYWdlRGF0YS5kYXRhO1xuXHRcdC8vIFRPRE86IHRoaXMgaXNuJ3Qgd29ya2luZyBmb3IgVU5TSUdORURfQllURSB0eXBlcz9cblx0XHRjb25zdCBpc0Zsb2F0ID0gZGF0YUxheWVyLnR5cGUgPT09IEZMT0FUIHx8IGRhdGFMYXllci50eXBlID09PSBIQUxGX0ZMT0FUO1xuXHRcdC8vIEhhdmUgdG8gZmxpcCB0aGUgeSBheGlzIHNpbmNlIFBOR3MgYXJlIHdyaXR0ZW4gdG9wIHRvIGJvdHRvbS5cblx0XHRmb3IgKGxldCB5ID0gMDsgeSA8IGhlaWdodDsgeSsrKSB7XG5cdFx0XHRmb3IgKGxldCB4ID0gMDsgeCA8IHdpZHRoOyB4KyspIHtcblx0XHRcdFx0Y29uc3QgaW5kZXggPSB5ICogd2lkdGggKyB4O1xuXHRcdFx0XHRjb25zdCBpbmRleEZsaXBwZWQgPSAoaGVpZ2h0IC0gMSAtIHkpICogd2lkdGggKyB4O1xuXHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFMYXllci5udW1Db21wb25lbnRzOyBpKyspIHtcblx0XHRcdFx0XHRidWZmZXJbNCAqIGluZGV4RmxpcHBlZCArIGldID0gdmFsdWVzW2RhdGFMYXllci5udW1Db21wb25lbnRzICogaW5kZXggKyBpXSAqIChpc0Zsb2F0ID8gMjU1IDogMSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGRhdGFMYXllci5udW1Db21wb25lbnRzIDwgNCkge1xuXHRcdFx0XHRcdGJ1ZmZlcls0ICogaW5kZXhGbGlwcGVkICsgM10gPSAyNTU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0Ly8gY29uc29sZS5sb2codmFsdWVzLCBidWZmZXIpO1xuXHRcdGNvbnRleHQucHV0SW1hZ2VEYXRhKGltYWdlRGF0YSwgMCwgMCk7XG5cblx0XHRjYW52YXMhLnRvQmxvYigoYmxvYikgPT4ge1xuXHRcdFx0aWYgKCFibG9iKSB7XG5cdFx0XHRcdGNvbnNvbGUud2FybignUHJvYmxlbSBzYXZpbmcgUE5HLCB1bmFibGUgdG8gaW5pdCBibG9iLicpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRpZiAoZHBpKSB7XG5cdFx0XHRcdGNoYW5nZURwaUJsb2IoYmxvYiwgZHBpKS50aGVuKChibG9iOiBCbG9iKSA9Pntcblx0XHRcdFx0XHRzYXZlQXMoYmxvYiwgYCR7ZmlsZW5hbWV9LnBuZ2ApO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHNhdmVBcyhibG9iLCBgJHtmaWxlbmFtZX0ucG5nYCk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHR9LCAnaW1hZ2UvcG5nJyk7XG5cdH1cblxuICAgIHJlc2V0KCkge1xuXHRcdC8vIFRPRE86IGltcGxlbWVudCB0aGlzLlxuXHRcdHRocm93IG5ldyBFcnJvcignV2ViR0xDb21wdXRlLnJlc2V0KCkgbm90IGltcGxlbWVudGVkLicpO1xuXHR9O1xuXG5cdGF0dGFjaERhdGFMYXllclRvVGhyZWVUZXh0dXJlKGRhdGFMYXllcjogRGF0YUxheWVyLCB0ZXh0dXJlOiBUZXh0dXJlKSB7XG5cdFx0aWYgKCF0aGlzLnJlbmRlcmVyKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ1dlYkdMQ29tcHV0ZSB3YXMgbm90IGluaXRlZCB3aXRoIGEgcmVuZGVyZXIuJyk7XG5cdFx0fVxuXHRcdC8vIExpbmsgd2ViZ2wgdGV4dHVyZSB0byB0aHJlZWpzIG9iamVjdC5cblx0XHQvLyBUaGlzIGlzIG5vdCBvZmZpY2lhbGx5IHN1cHBvcnRlZC5cblx0XHRpZiAoZGF0YUxheWVyLm51bUJ1ZmZlcnMgPiAxKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYERhdGFMYXllciBcIiR7ZGF0YUxheWVyLm5hbWV9XCIgY29udGFpbnMgbXVsdGlwbGUgV2ViR0wgdGV4dHVyZXMgKG9uZSBmb3IgZWFjaCBidWZmZXIpIHRoYXQgYXJlIGZsaXAtZmxvcHBlZCBkdXJpbmcgY29tcHV0ZSBjeWNsZXMsIHBsZWFzZSBjaG9vc2UgYSBEYXRhTGF5ZXIgd2l0aCBvbmUgYnVmZmVyLmApO1xuXHRcdH1cblx0XHRjb25zdCBvZmZzZXRUZXh0dXJlUHJvcGVydGllcyA9IHRoaXMucmVuZGVyZXIucHJvcGVydGllcy5nZXQodGV4dHVyZSk7XG5cdFx0b2Zmc2V0VGV4dHVyZVByb3BlcnRpZXMuX193ZWJnbFRleHR1cmUgPSBkYXRhTGF5ZXIuZ2V0Q3VycmVudFN0YXRlVGV4dHVyZSgpO1xuXHRcdG9mZnNldFRleHR1cmVQcm9wZXJ0aWVzLl9fd2ViZ2xJbml0ID0gdHJ1ZTtcblx0fVxuXG5cdHJlc2V0VGhyZWVTdGF0ZSgpIHtcblx0XHRpZiAoIXRoaXMucmVuZGVyZXIpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignV2ViR0xDb21wdXRlIHdhcyBub3QgaW5pdGVkIHdpdGggYSByZW5kZXJlci4nKTtcblx0XHR9XG5cdFx0Y29uc3QgeyBnbCB9ID0gdGhpcztcblx0XHQvLyBSZXNldCB2aWV3cG9ydC5cblx0XHRjb25zdCB2aWV3cG9ydCA9IHRoaXMucmVuZGVyZXIuZ2V0Vmlld3BvcnQobmV3IHV0aWxzLlZlY3RvcjQoKSBhcyBWZWN0b3I0KTtcblx0XHRnbC52aWV3cG9ydCh2aWV3cG9ydC54LCB2aWV3cG9ydC55LCB2aWV3cG9ydC53aWR0aCwgdmlld3BvcnQuaGVpZ2h0KTtcblx0XHQvLyBVbmJpbmQgZnJhbWVidWZmZXIgKHJlbmRlciB0byBzY3JlZW4pLlxuXHRcdHRoaXMucmVuZGVyZXIuc2V0UmVuZGVyVGFyZ2V0KG51bGwpO1xuXHRcdC8vIFJlc2V0IHRleHR1cmUgYmluZGluZ3MuXG5cdFx0dGhpcy5yZW5kZXJlci5yZXNldFN0YXRlKCk7XG5cdH1cblx0XG5cdGRlc3Ryb3koKSB7XG5cdFx0Ly8gVE9ETzogTmVlZCB0byBpbXBsZW1lbnQgdGhpcy5cblx0XHRkZWxldGUgdGhpcy5yZW5kZXJlcjtcblx0fVxufSIsImNvbnN0IGV4dGVuc2lvbnM6IHsgW2tleTogc3RyaW5nXTogYW55IH0gPSB7fTtcblxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL09FU190ZXh0dXJlX2Zsb2F0XG4vLyBGbG9hdCBpcyBwcm92aWRlZCBieSBkZWZhdWx0IGluIFdlYkdMMiBjb250ZXh0cy5cbi8vIFRoaXMgZXh0ZW5zaW9uIGltcGxpY2l0bHkgZW5hYmxlcyB0aGUgV0VCR0xfY29sb3JfYnVmZmVyX2Zsb2F0IGV4dGVuc2lvbiAoaWYgc3VwcG9ydGVkKSwgd2hpY2ggYWxsb3dzIHJlbmRlcmluZyB0byAzMi1iaXQgZmxvYXRpbmctcG9pbnQgY29sb3IgYnVmZmVycy5cbmV4cG9ydCBjb25zdCBPRVNfVEVYVFVSRV9GTE9BVCA9ICdPRVNfdGV4dHVyZV9mbG9hdCc7XG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvT0VTX3RleHR1cmVfaGFsZl9mbG9hdFxuLy8gSGFsZiBmbG9hdCBpcyBzdXBwb3J0ZWQgYnkgbW9kZXJuIG1vYmlsZSBicm93c2VycywgZmxvYXQgbm90IHlldCBzdXBwb3J0ZWQuXG4vLyBIYWxmIGZsb2F0IGlzIHByb3ZpZGVkIGJ5IGRlZmF1bHQgZm9yIFdlYmdsMiBjb250ZXh0cy5cbi8vIFRoaXMgZXh0ZW5zaW9uIGltcGxpY2l0bHkgZW5hYmxlcyB0aGUgRVhUX2NvbG9yX2J1ZmZlcl9oYWxmX2Zsb2F0IGV4dGVuc2lvbiAoaWYgc3VwcG9ydGVkKSwgd2hpY2ggYWxsb3dzIHJlbmRlcmluZyB0byAxNi1iaXQgZmxvYXRpbmcgcG9pbnQgZm9ybWF0cy5cbmV4cG9ydCBjb25zdCBPRVNfVEVYVFVSRV9IQUxGX0ZMT0FUID0gJ09FU190ZXh0dXJlX2hhbGZfZmxvYXQnO1xuLy8gVE9ETzogU2VlbXMgbGlrZSBsaW5lYXIgZmlsdGVyaW5nIG9mIGZsb2F0cyBtYXkgYmUgc3VwcG9ydGVkIGluIHNvbWUgYnJvd3NlcnMgd2l0aG91dCB0aGVzZSBleHRlbnNpb25zP1xuLy8gaHR0cHM6Ly93d3cua2hyb25vcy5vcmcvcmVnaXN0cnkvT3BlbkdML2V4dGVuc2lvbnMvT0VTL09FU190ZXh0dXJlX2Zsb2F0X2xpbmVhci50eHRcbmV4cG9ydCBjb25zdCBPRVNfVEVYVFVSRV9GTE9BVF9MSU5FQVIgPSAnT0VTX3RleHR1cmVfZmxvYXRfbGluZWFyJztcbmV4cG9ydCBjb25zdCBPRVNfVEVYVFVSRV9IQWxGX0ZMT0FUX0xJTkVBUiA9ICdPRVNfdGV4dHVyZV9oYWxmX2Zsb2F0X2xpbmVhcic7XG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvV0VCR0xfZGVwdGhfdGV4dHVyZVxuLy8gQWRkcyBnbC5VTlNJR05FRF9TSE9SVCwgZ2wuVU5TSUdORURfSU5UIHR5cGVzIHRvIHRleHRJbWFnZTJEIGluIFdlYkdMMS4wXG5leHBvcnQgY29uc3QgV0VCR0xfREVQVEhfVEVYVFVSRSA9ICdXRUJHTF9kZXB0aF90ZXh0dXJlJztcbi8vIEVYVF9DT0xPUl9CVUZGRVJfRkxPQVQgYWRkcyBhYmlsaXR5IHRvIHJlbmRlciB0byBhIHZhcmlldHkgb2YgZmxvYXRpbmcgcHQgdGV4dHVyZXMuXG4vLyBUaGlzIGlzIG5lZWRlZCBmb3IgdGhlIFdlYkdMMiBjb250ZXh0cyB0aGF0IGRvIG5vdCBzdXBwb3J0IE9FU19URVhUVVJFX0ZMT0FUIC8gT0VTX1RFWFRVUkVfSEFMRl9GTE9BVCBleHRlbnNpb25zLlxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VYVF9jb2xvcl9idWZmZXJfZmxvYXRcbi8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzM0MjYyNDkzL2ZyYW1lYnVmZmVyLWluY29tcGxldGUtYXR0YWNobWVudC1mb3ItdGV4dHVyZS13aXRoLWludGVybmFsLWZvcm1hdFxuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMzYxMDkzNDcvZnJhbWVidWZmZXItaW5jb21wbGV0ZS1hdHRhY2htZW50LW9ubHktaGFwcGVucy1vbi1hbmRyb2lkLXctZmlyZWZveFxuZXhwb3J0IGNvbnN0IEVYVF9DT0xPUl9CVUZGRVJfRkxPQVQgPSAnRVhUX2NvbG9yX2J1ZmZlcl9mbG9hdCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRFeHRlbnNpb24oXG5cdGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQgfCBXZWJHTDJSZW5kZXJpbmdDb250ZXh0LFxuXHRleHRlbnNpb25OYW1lOiBzdHJpbmcsXG5cdGVycm9yQ2FsbGJhY2s6IChtZXNzYWdlOiBzdHJpbmcpID0+IHZvaWQsXG5cdG9wdGlvbmFsID0gZmFsc2UsXG4pIHtcblx0Ly8gQ2hlY2sgaWYgd2UndmUgYWxyZWFkeSBsb2FkZWQgdGhlIGV4dGVuc2lvbi5cblx0aWYgKGV4dGVuc2lvbnNbZXh0ZW5zaW9uTmFtZV0gIT09IHVuZGVmaW5lZCkgcmV0dXJuIGV4dGVuc2lvbnNbZXh0ZW5zaW9uTmFtZV07XG5cblx0bGV0IGV4dGVuc2lvbjtcblx0dHJ5IHtcblx0XHRleHRlbnNpb24gPSBnbC5nZXRFeHRlbnNpb24oZXh0ZW5zaW9uTmFtZSk7XG5cdH0gY2F0Y2ggKGUpIHt9XG5cdGlmIChleHRlbnNpb24pIHtcblx0XHQvLyBDYWNoZSB0aGlzIGV4dGVuc2lvbi5cblx0XHRleHRlbnNpb25zW2V4dGVuc2lvbk5hbWVdID0gZXh0ZW5zaW9uO1xuXHRcdGNvbnNvbGUubG9nKGBMb2FkZWQgZXh0ZW5zaW9uOiAke2V4dGVuc2lvbk5hbWV9LmApO1xuXHR9IGVsc2Uge1xuXHRcdGV4dGVuc2lvbnNbZXh0ZW5zaW9uTmFtZV0gPSBmYWxzZTsgLy8gQ2FjaGUgdGhlIGJhZCBleHRlbnNpb24gbG9va3VwLlxuXHRcdGNvbnNvbGUud2FybihgVW5zdXBwb3J0ZWQgJHtvcHRpb25hbCA/ICdvcHRpb25hbCAnIDogJyd9ZXh0ZW5zaW9uOiAke2V4dGVuc2lvbk5hbWV9LmApO1xuXHR9XG5cdC8vIElmIHRoZSBleHRlbnNpb24gaXMgbm90IG9wdGlvbmFsLCB0aHJvdyBlcnJvci5cblx0aWYgKCFleHRlbnNpb24gJiYgIW9wdGlvbmFsKSB7XG5cdFx0ZXJyb3JDYWxsYmFjayhgUmVxdWlyZWQgZXh0ZW5zaW9uIHVuc3VwcG9ydGVkIGJ5IHRoaXMgZGV2aWNlIC8gYnJvd3NlcjogJHtleHRlbnNpb25OYW1lfS5gKTtcblx0fVxuXHRyZXR1cm4gZXh0ZW5zaW9uO1xufSIsImltcG9ydCB7IFdlYkdMQ29tcHV0ZSB9IGZyb20gJy4vV2ViR0xDb21wdXRlJztcbmV4cG9ydCAqIGZyb20gJy4vQ29uc3RhbnRzJztcblxuZXhwb3J0IHtcblx0V2ViR0xDb21wdXRlLFxufTsiLCIvLyBDb3BpZWQgZnJvbSBodHRwOi8vd2ViZ2xmdW5kYW1lbnRhbHMub3JnL3dlYmdsL2xlc3NvbnMvd2ViZ2wtYm9pbGVycGxhdGUuaHRtbFxuZXhwb3J0IGZ1bmN0aW9uIGNvbXBpbGVTaGFkZXIoXG5cdGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQgfCBXZWJHTDJSZW5kZXJpbmdDb250ZXh0LFxuXHRlcnJvckNhbGxiYWNrOiAobWVzc2FnZTogc3RyaW5nKSA9PiB2b2lkLFxuXHRzaGFkZXJTb3VyY2U6IHN0cmluZyxcblx0c2hhZGVyVHlwZTogbnVtYmVyLFxuXHRwcm9ncmFtTmFtZT86IHN0cmluZyxcbikge1xuXHQvLyBDcmVhdGUgdGhlIHNoYWRlciBvYmplY3Rcblx0Y29uc3Qgc2hhZGVyID0gZ2wuY3JlYXRlU2hhZGVyKHNoYWRlclR5cGUpO1xuXHRpZiAoIXNoYWRlcikge1xuXHRcdGVycm9yQ2FsbGJhY2soJ1VuYWJsZSB0byBpbml0IGdsIHNoYWRlci4nKTtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdC8vIFNldCB0aGUgc2hhZGVyIHNvdXJjZSBjb2RlLlxuXHRnbC5zaGFkZXJTb3VyY2Uoc2hhZGVyLCBzaGFkZXJTb3VyY2UpO1xuXG5cdC8vIENvbXBpbGUgdGhlIHNoYWRlclxuXHRnbC5jb21waWxlU2hhZGVyKHNoYWRlcik7XG5cblx0Ly8gQ2hlY2sgaWYgaXQgY29tcGlsZWRcblx0Y29uc3Qgc3VjY2VzcyA9IGdsLmdldFNoYWRlclBhcmFtZXRlcihzaGFkZXIsIGdsLkNPTVBJTEVfU1RBVFVTKTtcblx0aWYgKCFzdWNjZXNzKSB7XG5cdFx0Ly8gU29tZXRoaW5nIHdlbnQgd3JvbmcgZHVyaW5nIGNvbXBpbGF0aW9uIC0gcHJpbnQgdGhlIGVycm9yLlxuXHRcdGVycm9yQ2FsbGJhY2soYENvdWxkIG5vdCBjb21waWxlICR7c2hhZGVyVHlwZSA9PT0gZ2wuRlJBR01FTlRfU0hBREVSID8gJ2ZyYWdtZW50JyA6ICd2ZXJ0ZXgnfVxuXHRcdFx0IHNoYWRlciR7cHJvZ3JhbU5hbWUgPyBgIGZvciBwcm9ncmFtIFwiJHtwcm9ncmFtTmFtZX1cImAgOiAnJ306ICR7Z2wuZ2V0U2hhZGVySW5mb0xvZyhzaGFkZXIpfS5gKTtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXHRyZXR1cm4gc2hhZGVyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNXZWJHTDIoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCB8IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpIHtcblx0Ly8gVGhpcyBjb2RlIGlzIHB1bGxlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9tcmRvb2IvdGhyZWUuanMvYmxvYi9tYXN0ZXIvc3JjL3JlbmRlcmVycy93ZWJnbC9XZWJHTENhcGFiaWxpdGllcy5qc1xuXHQvLyBAdHMtaWdub3JlXG5cdHJldHVybiAodHlwZW9mIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQgIT09ICd1bmRlZmluZWQnICYmIGdsIGluc3RhbmNlb2YgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkgfHwgKHR5cGVvZiBXZWJHTDJDb21wdXRlUmVuZGVyaW5nQ29udGV4dCAhPT0gJ3VuZGVmaW5lZCcgJiYgZ2wgaW5zdGFuY2VvZiBXZWJHTDJDb21wdXRlUmVuZGVyaW5nQ29udGV4dCk7XG5cdC8vIHJldHVybiAhIShnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5IQUxGX0ZMT0FUO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNQb3dlck9mMih2YWx1ZTogbnVtYmVyKSB7XG5cdHJldHVybiAodmFsdWUgJiAodmFsdWUgLSAxKSkgPT0gMDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluaXRTZXF1ZW50aWFsRmxvYXRBcnJheShsZW5ndGg6IG51bWJlcikge1xuXHRjb25zdCBhcnJheSA9IG5ldyBGbG9hdDMyQXJyYXkobGVuZ3RoKTtcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuXHRcdGFycmF5W2ldID0gaTtcblx0fVxuXHRyZXR1cm4gYXJyYXk7XG59IiwiLy8gVGhlc2UgYXJlIHRoZSBwYXJ0cyBvZiB0aHJlZWpzIFZlY3RvcjQgdGhhdCB3ZSBuZWVkLlxuZXhwb3J0IGNsYXNzIFZlY3RvcjQge1xuXHR4OiBudW1iZXI7XG5cdHk6IG51bWJlcjtcblx0ejogbnVtYmVyO1xuXHR3OiBudW1iZXI7XG5cdGNvbnN0cnVjdG9yKCB4ID0gMCwgeSA9IDAsIHogPSAwLCB3ID0gMSApIHtcblx0XHR0aGlzLnggPSB4O1xuXHRcdHRoaXMueSA9IHk7XG5cdFx0dGhpcy56ID0gejtcblx0XHR0aGlzLncgPSB3O1xuXHR9XG5cdGdldCB3aWR0aCgpIHtcblx0XHRyZXR1cm4gdGhpcy56O1xuXHR9XG5cdGdldCBoZWlnaHQoKSB7XG5cdFx0cmV0dXJuIHRoaXMudztcblx0fVxuXHRjb3B5KHY6IFZlY3RvcjQpIHtcblx0XHR0aGlzLnggPSB2Lng7XG5cdFx0dGhpcy55ID0gdi55O1xuXHRcdHRoaXMueiA9IHYuejtcblx0XHR0aGlzLncgPSB2Lnc7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cbn0iLCJtb2R1bGUuZXhwb3J0cyA9IFwicHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcblxcbnZhcnlpbmcgdmVjMiB2X1VWO1xcblxcbnVuaWZvcm0gc2FtcGxlcjJEIHVfc3RhdGU7XFxuXFxudm9pZCBtYWluKCkge1xcblxcdGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRCh1X3N0YXRlLCB2X1VWKTtcXG59XCIiLCJtb2R1bGUuZXhwb3J0cyA9IFwicHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcbnByZWNpc2lvbiBoaWdocCBpbnQ7XFxuXFxuLyoqXFxuICogUmV0dXJucyBhY2N1cmF0ZSBNT0Qgd2hlbiBhcmd1bWVudHMgYXJlIGFwcHJveGltYXRlIGludGVnZXJzLlxcbiAqL1xcbmZsb2F0IG1vZEkoZmxvYXQgYSwgZmxvYXQgYikge1xcbiAgICBmbG9hdCBtID0gYSAtIGZsb29yKChhICsgMC41KSAvIGIpICogYjtcXG4gICAgcmV0dXJuIGZsb29yKG0gKyAwLjUpO1xcbn1cXG5cXG4vLyBDYW5ub3QgdXNlIGludCB2ZXJ0ZXggYXR0cmlidXRlczogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjc4NzQ5ODMvd2ViZ2wtaG93LXRvLXVzZS1pbnRlZ2VyLWF0dHJpYnV0ZXMtaW4tZ2xzbFxcbmF0dHJpYnV0ZSBmbG9hdCBhX2ludGVybmFsX2luZGV4OyAvLyBJbmRleCBvZiBwb2ludC5cXG5cXG51bmlmb3JtIHNhbXBsZXIyRCB1X2ludGVybmFsX3Bvc2l0aW9uczsgLy8gVGV4dHVyZSBsb29rdXAgd2l0aCBwb3NpdGlvbiBkYXRhLlxcbnVuaWZvcm0gdmVjMiB1X2ludGVybmFsX3Bvc2l0aW9uc0RpbWVuc2lvbnM7XFxudW5pZm9ybSB2ZWMyIHVfaW50ZXJuYWxfc2NhbGU7XFxudW5pZm9ybSBib29sIHVfaW50ZXJuYWxfcG9zaXRpb25XaXRoQWNjdW11bGF0aW9uO1xcbnVuaWZvcm0gYm9vbCB1X2ludGVybmFsX3dyYXBYO1xcbnVuaWZvcm0gYm9vbCB1X2ludGVybmFsX3dyYXBZO1xcblxcbnZhcnlpbmcgdmVjMiB2X1VWO1xcbnZhcnlpbmcgdmVjMiB2X2xpbmVXcmFwcGluZzsgLy8gVXNlIHRoaXMgdG8gdGVzdCBpZiBsaW5lIGlzIG9ubHkgaGFsZiB3cmFwcGVkIGFuZCBzaG91bGQgbm90IGJlIHJlbmRlcmVkLlxcblxcbnZvaWQgbWFpbigpIHtcXG5cXHQvLyBDYWxjdWxhdGUgYSB1diBiYXNlZCBvbiB0aGUgcG9pbnQncyBpbmRleCBhdHRyaWJ1dGUuXFxuXFx0dmVjMiBwYXJ0aWNsZVVWID0gdmVjMihcXG5cXHRcXHRtb2RJKGFfaW50ZXJuYWxfaW5kZXgsIHVfaW50ZXJuYWxfcG9zaXRpb25zRGltZW5zaW9ucy54KSxcXG5cXHRcXHRmbG9vcihmbG9vcihhX2ludGVybmFsX2luZGV4ICsgMC41KSAvIHVfaW50ZXJuYWxfcG9zaXRpb25zRGltZW5zaW9ucy54KVxcblxcdCkgLyB1X2ludGVybmFsX3Bvc2l0aW9uc0RpbWVuc2lvbnM7XFxuXFxuXFx0Ly8gQ2FsY3VsYXRlIGEgZ2xvYmFsIHV2IGZvciB0aGUgdmlld3BvcnQuXFxuXFx0Ly8gTG9va3VwIHZlcnRleCBwb3NpdGlvbiBhbmQgc2NhbGUgdG8gWzAsIDFdIHJhbmdlLlxcblxcdC8vIFdlIGhhdmUgcGFja2VkIGEgMkQgZGlzcGxhY2VtZW50IHdpdGggdGhlIHBvc2l0aW9uLlxcblxcdHZlYzQgcG9zaXRpb25EYXRhID0gdGV4dHVyZTJEKHVfaW50ZXJuYWxfcG9zaXRpb25zLCBwYXJ0aWNsZVVWKTtcXG5cXHQvLyBwb3NpdGlvbiA9IGZpcnN0IHR3byBjb21wb25lbnRzIHBsdXMgbGFzdCB0d28gY29tcG9uZW50cyAob3B0aW9uYWwgYWNjdW11bGF0aW9uIGJ1ZmZlcikuXFxuXFx0dmVjMiBwb3NpdGlvbkFic29sdXRlID0gcG9zaXRpb25EYXRhLnJnO1xcblxcdGlmICh1X2ludGVybmFsX3Bvc2l0aW9uV2l0aEFjY3VtdWxhdGlvbikgcG9zaXRpb25BYnNvbHV0ZSArPSBwb3NpdGlvbkRhdGEuYmE7XFxuXFx0dl9VViA9IHBvc2l0aW9uQWJzb2x1dGUgKiB1X2ludGVybmFsX3NjYWxlO1xcblxcblxcdC8vIFdyYXAgaWYgbmVlZGVkLlxcblxcdHZfbGluZVdyYXBwaW5nID0gdmVjMigwLjApO1xcblxcdGlmICh1X2ludGVybmFsX3dyYXBYKSB7XFxuXFx0XFx0aWYgKHZfVVYueCA8IDAuMCkge1xcblxcdFxcdFxcdHZfVVYueCArPSAxLjA7XFxuXFx0XFx0XFx0dl9saW5lV3JhcHBpbmcueCA9IDEuMDtcXG5cXHRcXHR9IGVsc2UgaWYgKHZfVVYueCA+IDEuMCkge1xcblxcdFxcdFxcdHZfVVYueCAtPSAxLjA7XFxuXFx0XFx0XFx0dl9saW5lV3JhcHBpbmcueCA9IDEuMDtcXG5cXHRcXHR9XFxuXFx0fVxcblxcdGlmICh1X2ludGVybmFsX3dyYXBZKSB7XFxuXFx0XFx0aWYgKHZfVVYueSA8IDAuMCkge1xcblxcdFxcdFxcdHZfVVYueSArPSAxLjA7XFxuXFx0XFx0XFx0dl9saW5lV3JhcHBpbmcueSA9IDEuMDtcXG5cXHRcXHR9IGVsc2UgaWYgKHZfVVYueSA+IDEuMCkge1xcblxcdFxcdFxcdHZfVVYueSAtPSAxLjA7XFxuXFx0XFx0XFx0dl9saW5lV3JhcHBpbmcueSA9IDEuMDtcXG5cXHRcXHR9XFxuXFx0fVxcblxcblxcdC8vIENhbGN1bGF0ZSBwb3NpdGlvbiBpbiBbLTEsIDFdIHJhbmdlLlxcblxcdHZlYzIgcG9zaXRpb24gPSB2X1VWICogMi4wIC0gMS4wO1xcblxcblxcdGdsX1Bvc2l0aW9uID0gdmVjNChwb3NpdGlvbiwgMCwgMSk7XFxufVwiIiwibW9kdWxlLmV4cG9ydHMgPSBcInByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5wcmVjaXNpb24gaGlnaHAgaW50O1xcblxcbi8qKlxcbiAqIFJldHVybnMgYWNjdXJhdGUgTU9EIHdoZW4gYXJndW1lbnRzIGFyZSBhcHByb3hpbWF0ZSBpbnRlZ2Vycy5cXG4gKi9cXG5mbG9hdCBtb2RJKGZsb2F0IGEsIGZsb2F0IGIpIHtcXG4gICAgZmxvYXQgbSA9IGEgLSBmbG9vcigoYSArIDAuNSkgLyBiKSAqIGI7XFxuICAgIHJldHVybiBmbG9vcihtICsgMC41KTtcXG59XFxuXFxuLy8gQ2Fubm90IHVzZSBpbnQgdmVydGV4IGF0dHJpYnV0ZXM6IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzI3ODc0OTgzL3dlYmdsLWhvdy10by11c2UtaW50ZWdlci1hdHRyaWJ1dGVzLWluLWdsc2xcXG5hdHRyaWJ1dGUgZmxvYXQgYV9pbnRlcm5hbF9pbmRleDsgLy8gSW5kZXggb2YgcG9pbnQuXFxuXFxudW5pZm9ybSBzYW1wbGVyMkQgdV9pbnRlcm5hbF9wb3NpdGlvbnM7IC8vIFRleHR1cmUgbG9va3VwIHdpdGggcG9zaXRpb24gZGF0YS5cXG51bmlmb3JtIHZlYzIgdV9pbnRlcm5hbF9wb3NpdGlvbnNEaW1lbnNpb25zO1xcbnVuaWZvcm0gdmVjMiB1X2ludGVybmFsX3NjYWxlO1xcbnVuaWZvcm0gZmxvYXQgdV9pbnRlcm5hbF9wb2ludFNpemU7XFxudW5pZm9ybSBib29sIHVfaW50ZXJuYWxfcG9zaXRpb25XaXRoQWNjdW11bGF0aW9uO1xcbnVuaWZvcm0gYm9vbCB1X2ludGVybmFsX3dyYXBYO1xcbnVuaWZvcm0gYm9vbCB1X2ludGVybmFsX3dyYXBZO1xcblxcbnZhcnlpbmcgdmVjMiB2X1VWO1xcblxcbnZvaWQgbWFpbigpIHtcXG5cXHQvLyBDYWxjdWxhdGUgYSB1diBiYXNlZCBvbiB0aGUgcG9pbnQncyBpbmRleCBhdHRyaWJ1dGUuXFxuXFx0dmVjMiBwYXJ0aWNsZVVWID0gdmVjMihcXG5cXHRcXHRtb2RJKGFfaW50ZXJuYWxfaW5kZXgsIHVfaW50ZXJuYWxfcG9zaXRpb25zRGltZW5zaW9ucy54KSxcXG5cXHRcXHRmbG9vcihmbG9vcihhX2ludGVybmFsX2luZGV4ICsgMC41KSAvIHVfaW50ZXJuYWxfcG9zaXRpb25zRGltZW5zaW9ucy54KVxcblxcdCkgLyB1X2ludGVybmFsX3Bvc2l0aW9uc0RpbWVuc2lvbnM7XFxuXFxuXFx0Ly8gQ2FsY3VsYXRlIGEgZ2xvYmFsIHV2IGZvciB0aGUgdmlld3BvcnQuXFxuXFx0Ly8gTG9va3VwIHZlcnRleCBwb3NpdGlvbiBhbmQgc2NhbGUgdG8gWzAsIDFdIHJhbmdlLlxcblxcdC8vIFdlIGhhdmUgcGFja2VkIGEgMkQgZGlzcGxhY2VtZW50IHdpdGggdGhlIHBvc2l0aW9uLlxcblxcdHZlYzQgcG9zaXRpb25EYXRhID0gdGV4dHVyZTJEKHVfaW50ZXJuYWxfcG9zaXRpb25zLCBwYXJ0aWNsZVVWKTtcXG5cXHQvLyBwb3NpdGlvbiA9IGZpcnN0IHR3byBjb21wb25lbnRzIHBsdXMgbGFzdCB0d28gY29tcG9uZW50cyAob3B0aW9uYWwgYWNjdW11bGF0aW9uIGJ1ZmZlcikuXFxuXFx0dmVjMiBwb3NpdGlvbkFic29sdXRlID0gcG9zaXRpb25EYXRhLnJnO1xcblxcdGlmICh1X2ludGVybmFsX3Bvc2l0aW9uV2l0aEFjY3VtdWxhdGlvbikgcG9zaXRpb25BYnNvbHV0ZSArPSBwb3NpdGlvbkRhdGEuYmE7XFxuXFx0dl9VViA9IHBvc2l0aW9uQWJzb2x1dGUgKiB1X2ludGVybmFsX3NjYWxlO1xcblxcblxcdC8vIFdyYXAgaWYgbmVlZGVkLlxcblxcdGlmICh1X2ludGVybmFsX3dyYXBYKSB7XFxuXFx0XFx0aWYgKHZfVVYueCA8IDAuMCkgdl9VVi54ICs9IDEuMDtcXG5cXHRcXHRpZiAodl9VVi54ID4gMS4wKSB2X1VWLnggLT0gMS4wO1xcblxcdH1cXG5cXHRpZiAodV9pbnRlcm5hbF93cmFwWSkge1xcblxcdFxcdGlmICh2X1VWLnkgPCAwLjApIHZfVVYueSArPSAxLjA7XFxuXFx0XFx0aWYgKHZfVVYueSA+IDEuMCkgdl9VVi55IC09IDEuMDtcXG5cXHR9XFxuXFxuXFx0Ly8gQ2FsY3VsYXRlIHBvc2l0aW9uIGluIFstMSwgMV0gcmFuZ2UuXFxuXFx0dmVjMiBwb3NpdGlvbiA9IHZfVVYgKiAyLjAgLSAxLjA7XFxuXFxuXFx0Z2xfUG9pbnRTaXplID0gdV9pbnRlcm5hbF9wb2ludFNpemU7XFxuXFx0Z2xfUG9zaXRpb24gPSB2ZWM0KHBvc2l0aW9uLCAwLCAxKTtcXG59XCIiLCJtb2R1bGUuZXhwb3J0cyA9IFwicHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcbnByZWNpc2lvbiBoaWdocCBpbnQ7XFxuXFxuLyoqXFxuICogUmV0dXJucyBhY2N1cmF0ZSBNT0Qgd2hlbiBhcmd1bWVudHMgYXJlIGFwcHJveGltYXRlIGludGVnZXJzLlxcbiAqL1xcbmZsb2F0IG1vZEkoZmxvYXQgYSwgZmxvYXQgYikge1xcbiAgICBmbG9hdCBtID0gYSAtIGZsb29yKChhICsgMC41KSAvIGIpICogYjtcXG4gICAgcmV0dXJuIGZsb29yKG0gKyAwLjUpO1xcbn1cXG5cXG4vLyBDYW5ub3QgdXNlIGludCB2ZXJ0ZXggYXR0cmlidXRlczogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjc4NzQ5ODMvd2ViZ2wtaG93LXRvLXVzZS1pbnRlZ2VyLWF0dHJpYnV0ZXMtaW4tZ2xzbFxcbmF0dHJpYnV0ZSBmbG9hdCBhX2ludGVybmFsX2luZGV4OyAvLyBJbmRleCBvZiBwb2ludC5cXG5cXG51bmlmb3JtIHNhbXBsZXIyRCB1X2ludGVybmFsX3ZlY3RvcnM7IC8vIFRleHR1cmUgbG9va3VwIHdpdGggdmVjdG9yIGRhdGEuXFxudW5pZm9ybSB2ZWMyIHVfaW50ZXJuYWxfZGltZW5zaW9ucztcXG51bmlmb3JtIHZlYzIgdV9pbnRlcm5hbF9zY2FsZTtcXG5cXG52YXJ5aW5nIHZlYzIgdl9VVjtcXG5cXG52b2lkIG1haW4oKSB7XFxuXFx0Ly8gRGl2aWRlIGluZGV4IGJ5IDIuXFxuXFx0ZmxvYXQgaW5kZXggPSBmbG9vcigoYV9pbnRlcm5hbF9pbmRleCArIDAuNSkgLyAyLjApO1xcblxcdC8vIENhbGN1bGF0ZSBhIHV2IGJhc2VkIG9uIHRoZSB2ZXJ0ZXggaW5kZXggYXR0cmlidXRlLlxcblxcdHZfVVYgPSB2ZWMyKFxcblxcdFxcdG1vZEkoaW5kZXgsIHVfaW50ZXJuYWxfZGltZW5zaW9ucy54KSxcXG5cXHRcXHRmbG9vcihmbG9vcihpbmRleCArIDAuNSkgLyB1X2ludGVybmFsX2RpbWVuc2lvbnMueClcXG5cXHQpIC8gdV9pbnRlcm5hbF9kaW1lbnNpb25zO1xcblxcblxcdC8vIEFkZCB2ZWN0b3IgZGlzcGxhY2VtZW50IGlmIG5lZWRlZC5cXG5cXHRpZiAobW9kSShhX2ludGVybmFsX2luZGV4LCAyLjApID4gMC4wKSB7XFxuXFx0XFx0Ly8gTG9va3VwIHZlY3RvckRhdGEgYXQgY3VycmVudCBVVi5cXG5cXHRcXHR2ZWMyIHZlY3RvckRhdGEgPSB0ZXh0dXJlMkQodV9pbnRlcm5hbF92ZWN0b3JzLCB2X1VWKS54eTtcXG5cXHRcXHR2X1VWICs9IHZlY3RvckRhdGEgKiB1X2ludGVybmFsX3NjYWxlO1xcblxcdH1cXG5cXG5cXHQvLyBDYWxjdWxhdGUgcG9zaXRpb24gaW4gWy0xLCAxXSByYW5nZS5cXG5cXHR2ZWMyIHBvc2l0aW9uID0gdl9VViAqIDIuMCAtIDEuMDtcXG5cXG5cXHRnbF9Qb3NpdGlvbiA9IHZlYzQocG9zaXRpb24sIDAsIDEpO1xcbn1cIiIsIm1vZHVsZS5leHBvcnRzID0gXCJwcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxuXFxuYXR0cmlidXRlIHZlYzIgYV9pbnRlcm5hbF9wb3NpdGlvbjtcXG4jaWZkZWYgVVZfQVRUUklCVVRFXFxuYXR0cmlidXRlIHZlYzIgYV9pbnRlcm5hbF91djtcXG4jZW5kaWZcXG4jaWZkZWYgTk9STUFMX0FUVFJJQlVURVxcbmF0dHJpYnV0ZSB2ZWMyIGFfaW50ZXJuYWxfbm9ybWFsO1xcbiNlbmRpZlxcblxcbnVuaWZvcm0gdmVjMiB1X2ludGVybmFsX3NjYWxlO1xcbnVuaWZvcm0gdmVjMiB1X2ludGVybmFsX3RyYW5zbGF0aW9uO1xcblxcbnZhcnlpbmcgdmVjMiB2X1VWO1xcbiNpZmRlZiBVVl9BVFRSSUJVVEVcXG52YXJ5aW5nIHZlYzIgdl9VVl9sb2NhbDtcXG4jZW5kaWZcXG4jaWZkZWYgTk9STUFMX0FUVFJJQlVURVxcbnZhcnlpbmcgdmVjMiB2X25vcm1hbDtcXG4jZW5kaWZcXG5cXG52b2lkIG1haW4oKSB7XFxuXFx0Ly8gT3B0aW9uYWwgdmFyeWluZ3MuXFxuXFx0I2lmZGVmIFVWX0FUVFJJQlVURVxcblxcdHZfVVZfbG9jYWwgPSBhX2ludGVybmFsX3V2O1xcblxcdCNlbmRpZlxcblxcdCNpZmRlZiBOT1JNQUxfQVRUUklCVVRFXFxuXFx0dl9ub3JtYWwgPSBhX2ludGVybmFsX25vcm1hbDtcXG5cXHQjZW5kaWZcXG5cXG5cXHQvLyBBcHBseSB0cmFuc2Zvcm1hdGlvbnMuXFxuXFx0dmVjMiBwb3NpdGlvbiA9IHVfaW50ZXJuYWxfc2NhbGUgKiBhX2ludGVybmFsX3Bvc2l0aW9uICsgdV9pbnRlcm5hbF90cmFuc2xhdGlvbjtcXG5cXG5cXHQvLyBDYWxjdWxhdGUgYSBnbG9iYWwgdXYgZm9yIHRoZSB2aWV3cG9ydC5cXG5cXHR2X1VWID0gMC41ICogKHBvc2l0aW9uICsgMS4wKTtcXG5cXG5cXHQvLyBDYWxjdWxhdGUgdmVydGV4IHBvc2l0aW9uLlxcblxcdGdsX1Bvc2l0aW9uID0gdmVjNChwb3NpdGlvbiwgMCwgMSk7XFxufVwiIiwibW9kdWxlLmV4cG9ydHMgPSBcIi8vIFZlcnRleCBzaGFkZXIgZm9yIGZ1bGxzY3JlZW4gcXVhZC5cXG5wcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxuXFxuYXR0cmlidXRlIHZlYzIgYV9pbnRlcm5hbF9wb3NpdGlvbjtcXG5cXG51bmlmb3JtIGZsb2F0IHVfaW50ZXJuYWxfaGFsZlRoaWNrbmVzcztcXG51bmlmb3JtIHZlYzIgdV9pbnRlcm5hbF9zY2FsZTtcXG51bmlmb3JtIGZsb2F0IHVfaW50ZXJuYWxfbGVuZ3RoO1xcbnVuaWZvcm0gZmxvYXQgdV9pbnRlcm5hbF9yb3RhdGlvbjtcXG51bmlmb3JtIHZlYzIgdV9pbnRlcm5hbF90cmFuc2xhdGlvbjtcXG5cXG52YXJ5aW5nIHZlYzIgdl9VVl9sb2NhbDtcXG52YXJ5aW5nIHZlYzIgdl9VVjtcXG5cXG5tYXQyIHJvdGF0ZTJkKGZsb2F0IF9hbmdsZSl7XFxuXFx0cmV0dXJuIG1hdDIoY29zKF9hbmdsZSksIC1zaW4oX2FuZ2xlKSwgc2luKF9hbmdsZSksIGNvcyhfYW5nbGUpKTtcXG59XFxuXFxudm9pZCBtYWluKCkge1xcblxcdC8vIENhbGN1bGF0ZSBVViBjb29yZGluYXRlcyBvZiBjdXJyZW50IHJlbmRlcmVkIG9iamVjdC5cXG5cXHR2X1VWX2xvY2FsID0gMC41ICogKGFfaW50ZXJuYWxfcG9zaXRpb24gKyAxLjApO1xcblxcblxcdHZlYzIgcG9zaXRpb24gPSBhX2ludGVybmFsX3Bvc2l0aW9uO1xcblxcblxcdC8vIEFwcGx5IHRoaWNrbmVzcyAvIHJhZGl1cy5cXG5cXHRwb3NpdGlvbiAqPSB1X2ludGVybmFsX2hhbGZUaGlja25lc3M7XFxuXFxuXFx0Ly8gU3RyZXRjaCBjZW50ZXIgb2Ygc2hhcGUgdG8gZm9ybSBhIHJvdW5kLWNhcHBlZCBsaW5lIHNlZ21lbnQuXFxuXFx0aWYgKHBvc2l0aW9uLnggPCAwLjApIHtcXG5cXHRcXHRwb3NpdGlvbi54IC09IHVfaW50ZXJuYWxfbGVuZ3RoIC8gMi4wO1xcblxcdFxcdHZfVVZfbG9jYWwueCA9IDAuMDsgLy8gU2V0IGVudGlyZSBjYXAgVVYueCB0byAwLlxcblxcdH0gZWxzZSBpZiAocG9zaXRpb24ueCA+IDAuMCkge1xcblxcdFxcdHBvc2l0aW9uLnggKz0gdV9pbnRlcm5hbF9sZW5ndGggLyAyLjA7XFxuXFx0XFx0dl9VVl9sb2NhbC54ID0gMS4wOyAvLyBTZXQgZW50aXJlIGNhcCBVVi54IHRvIDEuXFxuXFx0fVxcblxcblxcdC8vIEFwcGx5IHRyYW5zZm9ybWF0aW9ucy5cXG5cXHRwb3NpdGlvbiA9IHVfaW50ZXJuYWxfc2NhbGUgKiAocm90YXRlMmQoLXVfaW50ZXJuYWxfcm90YXRpb24pICogcG9zaXRpb24pICsgdV9pbnRlcm5hbF90cmFuc2xhdGlvbjtcXG5cXG5cXHQvLyBDYWxjdWxhdGUgYSBnbG9iYWwgdXYgZm9yIHRoZSB2aWV3cG9ydC5cXG5cXHR2X1VWID0gMC41ICogKHBvc2l0aW9uICsgMS4wKTtcXG5cXG5cXHQvLyBDYWxjdWxhdGUgdmVydGV4IHBvc2l0aW9uLlxcblxcdGdsX1Bvc2l0aW9uID0gdmVjNChwb3NpdGlvbiwgMCwgMSk7XFxufVwiIiwibW9kdWxlLmV4cG9ydHMgPSBcIi8vIEZyYWdtZW50IHNoYWRlciB0aGF0IGRyYXdzIGEgc2luZ2xlIGNvbG9yLlxcbnByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5cXG51bmlmb3JtIHZlYzMgdV9jb2xvcjtcXG5cXG52b2lkIG1haW4oKSB7XFxuXFx0Z2xfRnJhZ0NvbG9yID0gdmVjNCh1X2NvbG9yLCAxKTtcXG59XCIiLCJtb2R1bGUuZXhwb3J0cyA9IFwiLy8gRnJhZ21lbnQgc2hhZGVyIHRoYXQgZHJhd3MgYSBzaW5nbGUgY29sb3IuXFxucHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcblxcbnVuaWZvcm0gdmVjMyB1X2NvbG9yO1xcbnZhcnlpbmcgdmVjMiB2X2xpbmVXcmFwcGluZztcXG5cXG52b2lkIG1haW4oKSB7XFxuXFx0Ly8gY2hlY2sgaWYgdGhpcyBsaW5lIGhhcyB3cmFwcGVkLlxcblxcdGlmICgodl9saW5lV3JhcHBpbmcueCAhPSAwLjAgJiYgdl9saW5lV3JhcHBpbmcueCAhPSAxLjApIHx8ICh2X2xpbmVXcmFwcGluZy55ICE9IDAuMCAmJiB2X2xpbmVXcmFwcGluZy55ICE9IDEuMCkpIHtcXG5cXHRcXHQvLyBSZW5kZXIgbm90aGluZy5cXG5cXHRcXHRkaXNjYXJkO1xcblxcdFxcdHJldHVybjtcXG5cXHR9XFxuXFx0Z2xfRnJhZ0NvbG9yID0gdmVjNCh1X2NvbG9yLCAxKTtcXG59XCIiLCJtb2R1bGUuZXhwb3J0cyA9IFwiLy8gRnJhZ21lbnQgc2hhZGVyIHRoYXQgZHJhd3MgdGhlIG1hZ25pdHVkZSBvZiBhIERhdGFMYXllci5cXG5wcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxuXFxudmFyeWluZyB2ZWMyIHZfVVY7XFxuXFxudW5pZm9ybSB2ZWMzIHVfY29sb3I7XFxudW5pZm9ybSBmbG9hdCB1X3NjYWxlO1xcbnVuaWZvcm0gaW50IHVfaW50ZXJuYWxfbnVtRGltZW5zaW9ucztcXG51bmlmb3JtIHNhbXBsZXIyRCB1X2ludGVybmFsX2RhdGE7XFxuXFxudm9pZCBtYWluKCkge1xcblxcdHZlYzQgdmFsdWUgPSB0ZXh0dXJlMkQodV9pbnRlcm5hbF9kYXRhLCB2X1VWKTtcXG5cXHRpZiAodV9pbnRlcm5hbF9udW1EaW1lbnNpb25zIDwgNCkgdmFsdWUuYSA9IDAuMDtcXG5cXHRpZiAodV9pbnRlcm5hbF9udW1EaW1lbnNpb25zIDwgMykgdmFsdWUuYiA9IDAuMDtcXG5cXHRpZiAodV9pbnRlcm5hbF9udW1EaW1lbnNpb25zIDwgMikgdmFsdWUuZyA9IDAuMDtcXG5cXHRmbG9hdCBtYWcgPSBsZW5ndGgodmFsdWUpO1xcblxcdGdsX0ZyYWdDb2xvciA9IHZlYzQobWFnICogdV9zY2FsZSAqIHVfY29sb3IsIDEpO1xcbn1cIiIsIm1vZHVsZS5leHBvcnRzID0gXCIjdmVyc2lvbiAzMDAgZXNcXG5wcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxucHJlY2lzaW9uIGhpZ2hwIHNhbXBsZXIyRDtcXG5cXG5pbiB2ZWMyIHZfVVY7XFxuXFxudW5pZm9ybSBzYW1wbGVyMkQgdV9zdGF0ZTtcXG5cXG5vdXQgdmVjNCBvdXRfZnJhZ0NvbG9yO1xcblxcbnZvaWQgbWFpbigpIHtcXG5cXHRvdXRfZnJhZ0NvbG9yID0gdGV4dHVyZSh1X3N0YXRlLCB2X1VWKTtcXG59XCIiLCJtb2R1bGUuZXhwb3J0cyA9IFwiI3ZlcnNpb24gMzAwIGVzXFxucHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcbnByZWNpc2lvbiBoaWdocCBpbnQ7XFxucHJlY2lzaW9uIGhpZ2hwIGlzYW1wbGVyMkQ7XFxuXFxuaW4gdmVjMiB2X1VWO1xcblxcbnVuaWZvcm0gaXNhbXBsZXIyRCB1X3N0YXRlO1xcblxcbm91dCBpdmVjNCBvdXRfZnJhZ0NvbG9yO1xcblxcbnZvaWQgbWFpbigpIHtcXG5cXHRvdXRfZnJhZ0NvbG9yID0gdGV4dHVyZSh1X3N0YXRlLCB2X1VWKTtcXG59XCIiLCJtb2R1bGUuZXhwb3J0cyA9IFwiI3ZlcnNpb24gMzAwIGVzXFxucHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcbnByZWNpc2lvbiBoaWdocCBpbnQ7XFxucHJlY2lzaW9uIGhpZ2hwIHVzYW1wbGVyMkQ7XFxuXFxuaW4gdmVjMiB2X1VWO1xcblxcbnVuaWZvcm0gdXNhbXBsZXIyRCB1X3N0YXRlO1xcblxcbm91dCB1dmVjNCBvdXRfZnJhZ0NvbG9yO1xcblxcbnZvaWQgbWFpbigpIHtcXG5cXHRvdXRfZnJhZ0NvbG9yID0gdGV4dHVyZSh1X3N0YXRlLCB2X1VWKTtcXG59XCIiLCJtb2R1bGUuZXhwb3J0cyA9IFwiLy8gRnJhZ21lbnQgc2hhZGVyIHRoYXQgZHJhd3MgYSBzaW5nbGUgY29sb3IuXFxucHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcblxcbnVuaWZvcm0gdmVjMyB1X2NvbG9yO1xcblxcbnZvaWQgbWFpbigpIHtcXG5cXHRnbF9GcmFnQ29sb3IgPSB2ZWM0KHVfY29sb3IsIDEpO1xcbn1cIiIsIm1vZHVsZS5leHBvcnRzID0gXCIvLyBGcmFnbWVudCBzaGFkZXIgdGhhdCBkcmF3cyBhIHNpbmdsZSBjb2xvci5cXG5wcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxuXFxudW5pZm9ybSB2ZWMzIHVfY29sb3I7XFxudmFyeWluZyB2ZWMyIHZfbGluZVdyYXBwaW5nO1xcblxcbnZvaWQgbWFpbigpIHtcXG5cXHQvLyBjaGVjayBpZiB0aGlzIGxpbmUgaGFzIHdyYXBwZWQuXFxuXFx0aWYgKCh2X2xpbmVXcmFwcGluZy54ICE9IDAuMCAmJiB2X2xpbmVXcmFwcGluZy54ICE9IDEuMCkgfHwgKHZfbGluZVdyYXBwaW5nLnkgIT0gMC4wICYmIHZfbGluZVdyYXBwaW5nLnkgIT0gMS4wKSkge1xcblxcdFxcdC8vIFJlbmRlciBub3RoaW5nLlxcblxcdFxcdGRpc2NhcmQ7XFxuXFx0XFx0cmV0dXJuO1xcblxcdH1cXG5cXHRnbF9GcmFnQ29sb3IgPSB2ZWM0KHVfY29sb3IsIDEpO1xcbn1cIiIsIm1vZHVsZS5leHBvcnRzID0gXCIvLyBGcmFnbWVudCBzaGFkZXIgdGhhdCBkcmF3cyB0aGUgbWFnbml0dWRlIG9mIGEgRGF0YUxheWVyLlxcbnByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5cXG52YXJ5aW5nIHZlYzIgdl9VVjtcXG5cXG51bmlmb3JtIHZlYzMgdV9jb2xvcjtcXG51bmlmb3JtIGZsb2F0IHVfc2NhbGU7XFxudW5pZm9ybSBzYW1wbGVyMkQgdV9pbnRlcm5hbF9kYXRhO1xcblxcbnZvaWQgbWFpbigpIHtcXG5cXHR2ZWM0IHZhbHVlID0gdGV4dHVyZTJEKHVfaW50ZXJuYWxfZGF0YSwgdl9VVik7XFxuXFx0ZmxvYXQgbWFnID0gbGVuZ3RoKHZhbHVlKTtcXG5cXHRnbF9GcmFnQ29sb3IgPSB2ZWM0KG1hZyAqIHVfc2NhbGUgKiB1X2NvbG9yLCAxKTtcXG59XCIiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHRsb2FkZWQ6IGZhbHNlLFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcblx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18uaG1kID0gKG1vZHVsZSkgPT4ge1xuXHRtb2R1bGUgPSBPYmplY3QuY3JlYXRlKG1vZHVsZSk7XG5cdGlmICghbW9kdWxlLmNoaWxkcmVuKSBtb2R1bGUuY2hpbGRyZW4gPSBbXTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG1vZHVsZSwgJ2V4cG9ydHMnLCB7XG5cdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRzZXQ6ICgpID0+IHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignRVMgTW9kdWxlcyBtYXkgbm90IGFzc2lnbiBtb2R1bGUuZXhwb3J0cyBvciBleHBvcnRzLiosIFVzZSBFU00gZXhwb3J0IHN5bnRheCwgaW5zdGVhZDogJyArIG1vZHVsZS5pZCk7XG5cdFx0fVxuXHR9KTtcblx0cmV0dXJuIG1vZHVsZTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2luZGV4LnRzXCIpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==