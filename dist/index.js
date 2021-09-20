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
                    uvs[2 * index] = u;
                    uvs[2 * index + 1] = 1;
                    uvs[2 * index + 2] = u;
                    uvs[2 * index + 3] = 0;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9AcGV0YW1vcmlrZW4vZmxvYXQxNi9zcmMvRmxvYXQxNkFycmF5LmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9AcGV0YW1vcmlrZW4vZmxvYXQxNi9zcmMvYnVnLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9AcGV0YW1vcmlrZW4vZmxvYXQxNi9zcmMvZGF0YVZpZXcuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL0BwZXRhbW9yaWtlbi9mbG9hdDE2L3NyYy9oZnJvdW5kLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9AcGV0YW1vcmlrZW4vZmxvYXQxNi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL0BwZXRhbW9yaWtlbi9mbG9hdDE2L3NyYy9pcy5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvQHBldGFtb3Jpa2VuL2Zsb2F0MTYvc3JjL2xpYi5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvQHBldGFtb3Jpa2VuL2Zsb2F0MTYvc3JjL3ByaXZhdGUuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL0BwZXRhbW9yaWtlbi9mbG9hdDE2L3NyYy9zcGVjLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9jaGFuZ2VkcGkvZGlzdC9pbmRleC5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvZmlsZS1zYXZlci9kaXN0L0ZpbGVTYXZlci5taW4uanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fSGFzaC5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19MaXN0Q2FjaGUuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fTWFwLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX01hcENhY2hlLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX1N5bWJvbC5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19hc3NvY0luZGV4T2YuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fYmFzZUdldFRhZy5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19iYXNlSXNBcnJheUJ1ZmZlci5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19iYXNlSXNOYXRpdmUuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fYmFzZVVuYXJ5LmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2NvcmVKc0RhdGEuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fZnJlZUdsb2JhbC5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19nZXRNYXBEYXRhLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2dldE5hdGl2ZS5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19nZXRSYXdUYWcuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fZ2V0VmFsdWUuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9faGFzaENsZWFyLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2hhc2hEZWxldGUuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9faGFzaEdldC5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19oYXNoSGFzLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2hhc2hTZXQuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9faXNLZXlhYmxlLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2lzTWFza2VkLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2xpc3RDYWNoZUNsZWFyLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2xpc3RDYWNoZURlbGV0ZS5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19saXN0Q2FjaGVHZXQuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fbGlzdENhY2hlSGFzLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2xpc3RDYWNoZVNldC5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19tYXBDYWNoZUNsZWFyLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX21hcENhY2hlRGVsZXRlLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX21hcENhY2hlR2V0LmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX21hcENhY2hlSGFzLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX21hcENhY2hlU2V0LmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX25hdGl2ZUNyZWF0ZS5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19ub2RlVXRpbC5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19vYmplY3RUb1N0cmluZy5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19yb290LmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX3RvU291cmNlLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvZXEuanMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9pc0FycmF5QnVmZmVyLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvaXNGdW5jdGlvbi5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL2lzT2JqZWN0LmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvaXNPYmplY3RMaWtlLmpzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvbWVtb2l6ZS5qcyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9zcmMvQ2hlY2tzLnRzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL3NyYy9Db25zdGFudHMudHMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vc3JjL0RhdGFMYXllci50cyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9zcmMvR1BVUHJvZ3JhbS50cyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9zcmMvV2ViR0xDb21wdXRlLnRzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL3NyYy9leHRlbnNpb25zLnRzIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9zcmMvdXRpbHMudHMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vc3JjL3V0aWxzL1ZlY3RvcjQudHMiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vc3JjL2dsc2xfMS9Db3B5RnJhZ1NoYWRlci5nbHNsIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL3NyYy9nbHNsXzEvRGVmYXVsdFZlcnRleFNoYWRlci5nbHNsIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL3NyYy9nbHNsXzEvSW5kZXhlZExpbmVzVmVydGV4U2hhZGVyLmdsc2wiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vc3JjL2dsc2xfMS9Qb2ludHNWZXJ0ZXhTaGFkZXIuZ2xzbCIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9zcmMvZ2xzbF8xL1BvbHlsaW5lVmVydGV4U2hhZGVyLmdsc2wiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vc3JjL2dsc2xfMS9TZWdtZW50VmVydGV4U2hhZGVyLmdsc2wiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vc3JjL2dsc2xfMS9TaW5nbGVDb2xvckZyYWdTaGFkZXIuZ2xzbCIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9zcmMvZ2xzbF8xL1NpbmdsZUNvbG9yV2l0aFdyYXBDaGVja0ZyYWdTaGFkZXIuZ2xzbCIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9zcmMvZ2xzbF8xL1ZlY3RvckZpZWxkVmVydGV4U2hhZGVyLmdsc2wiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vc3JjL2dsc2xfMy9Db3B5RmxvYXRGcmFnU2hhZGVyLmdsc2wiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vc3JjL2dsc2xfMy9Db3B5SW50RnJhZ1NoYWRlci5nbHNsIiwid2VicGFjazovL1dlYkdMQ29tcHV0ZS8uL3NyYy9nbHNsXzMvQ29weVVpbnRGcmFnU2hhZGVyLmdsc2wiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vc3JjL2dsc2xfMy9EZWZhdWx0VmVydGV4U2hhZGVyLmdsc2wiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vc3JjL2dsc2xfMy9TZWdtZW50VmVydGV4U2hhZGVyLmdsc2wiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlLy4vc3JjL2dsc2xfMy9TaW5nbGVDb2xvckZyYWdTaGFkZXIuZ2xzbCIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvLi9zcmMvZ2xzbF8zL1NpbmdsZUNvbG9yV2l0aFdyYXBDaGVja0ZyYWdTaGFkZXIuZ2xzbCIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vV2ViR0xDb21wdXRlL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvd2VicGFjay9ydW50aW1lL2hhcm1vbnkgbW9kdWxlIGRlY29yYXRvciIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9XZWJHTENvbXB1dGUvd2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNWd0M7QUFDb0I7QUFDSjtBQUNJO0FBQ1g7QUFDVTs7QUFFM0QsVUFBVSw4REFBb0I7O0FBRTlCO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFdBQVcsYUFBYTtBQUN4QixZQUFZO0FBQ1o7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0JBQWtCLFlBQVk7QUFDOUIsbUJBQW1CLHFEQUFlO0FBQ2xDOztBQUVBO0FBQ0E7O0FBRUEsV0FBVyx1QkFBdUI7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSztBQUNMOztBQUVBLFdBQVcsMkJBQTJCO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBLGFBQWEscUVBQW1DO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQSxZQUFZLHNEQUFpQjtBQUM3Qiw4Q0FBOEMscURBQWU7QUFDN0QsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0EsYUFBYSxxRUFBbUM7QUFDaEQ7QUFDQTtBQUNBOztBQUVBLFlBQVks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dEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pELEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDO2dCQUN4QixFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDO2dCQUUxQixpQkFBaUI7Z0JBQ2pCLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsYUFBYSxDQUFDO2dCQUNyRixTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxhQUFhLENBQUM7Z0JBQ3pGLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxH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LENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZELElBQU0sTUFBTSxHQUFHLGFBQWEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDbkQsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFO29CQUNkLFNBQVMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7b0JBQzlDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO29CQUNsRCxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDO29CQUM1RSxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7aUJBQ3BGO3FCQUFNO29CQUNOLFNBQVMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO29CQUNsRCxTQUFTLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztvQkFDbEQs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Q0F2bUIseURBQXlELHVDQUF1QywyQ0FBMkMsZ0NBQWdDLGtDQUFrQyxvQ0FBb0Msc0NBQXNDLDRCQUE0QixvQkFBb0IsZ0NBQWdDLHFFQUFxRSxHQUFHLGlCQUFpQiw4R0FBOEcsMENBQTBDLHdEQUF3RCxnR0FBZ0csNENBQTRDLHlCQUF5QixrQ0FBa0MsNkJBQTZCLDRDQUE0Qyx5QkFBeUIsa0NBQWtDLHNJQUFzSSxrRkFBa0YsMEVBQTBFLEdBQUcsQzs7Ozs7Ozs7OztBQ0Fod0MsdUZBQXVGLHlCQUF5QixpQkFBaUIsb0NBQW9DLEdBQUcsQzs7Ozs7Ozs7OztBQ0F4Syx1RkFBdUYseUJBQXlCLDhCQUE4QixpQkFBaUIsNkpBQTZKLHNDQUFzQyxhQUFhLEtBQUssb0NBQW9DLEdBQUcsQzs7Ozs7O1VDQTNaO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N6QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsRUFBRTtXQUNGO1dBQ0E7V0FDQSxDQUFDLEk7Ozs7O1dDUEQ7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEVBQUU7V0FDRjtXQUNBLEU7Ozs7O1dDVkEsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7O1VDTkE7VUFDQTtVQUNBO1VBQ0EiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJXZWJHTENvbXB1dGVcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiV2ViR0xDb21wdXRlXCJdID0gZmFjdG9yeSgpO1xufSkoc2VsZiwgZnVuY3Rpb24oKSB7XG5yZXR1cm4gIiwiaW1wb3J0IG1lbW9pemUgZnJvbSBcImxvZGFzaC1lcy9tZW1vaXplXCI7XG5pbXBvcnQgeyBpc1R5cGVkQXJyYXlJbmRleGVkUHJvcGVydHlXcml0YWJsZSB9IGZyb20gXCIuL2J1Z1wiO1xuaW1wb3J0IHsgaXNBcnJheUJ1ZmZlciwgaXNTdHJpbmdOdW1iZXJLZXkgfSBmcm9tIFwiLi9pc1wiO1xuaW1wb3J0IHsgY29udmVydFRvTnVtYmVyLCByb3VuZFRvRmxvYXQxNkJpdHMgfSBmcm9tIFwiLi9saWJcIjtcbmltcG9ydCB7IGNyZWF0ZVByaXZhdGVTdG9yYWdlIH0gZnJvbSBcIi4vcHJpdmF0ZVwiO1xuaW1wb3J0IHsgVG9JbnRlZ2VyLCBkZWZhdWx0Q29tcGFyZUZ1bmN0aW9uIH0gZnJvbSBcIi4vc3BlY1wiO1xuXG5jb25zdCBfID0gY3JlYXRlUHJpdmF0ZVN0b3JhZ2UoKTtcblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHRhcmdldFxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzRmxvYXQxNkFycmF5KHRhcmdldCkge1xuICAgIHJldHVybiB0YXJnZXQgaW5zdGFuY2VvZiBGbG9hdDE2QXJyYXk7XG59XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB0YXJnZXRcbiAqIEB0aHJvd3Mge1R5cGVFcnJvcn1cbiAqL1xuZnVuY3Rpb24gYXNzZXJ0RmxvYXQxNkFycmF5KHRhcmdldCkge1xuICAgIGlmICghaXNGbG9hdDE2QXJyYXkodGFyZ2V0KSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiVGhpcyBpcyBub3QgYSBGbG9hdDE2QXJyYXlcIik7XG4gICAgfVxufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdGFyZ2V0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaXNEZWZhdWx0RmxvYXQxNkFycmF5TWV0aG9kcyh0YXJnZXQpIHtcbiAgICByZXR1cm4gdHlwZW9mIHRhcmdldCA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmF1bHRGbG9hdDE2QXJyYXlNZXRob2RzLmhhcyh0YXJnZXQpO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7RmxvYXQxNkFycmF5fSBmbG9hdDE2Yml0c1xuICogQHJldHVybiB7bnVtYmVyW119XG4gKi9cbmZ1bmN0aW9uIGNvcHlUb0FycmF5KGZsb2F0MTZiaXRzKSB7XG4gICAgY29uc3QgbGVuZ3RoID0gZmxvYXQxNmJpdHMubGVuZ3RoO1xuXG4gICAgY29uc3QgYXJyYXkgPSBuZXcgQXJyYXkobGVuZ3RoKTtcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgICAgYXJyYXlbaV0gPSBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHNbaV0pO1xuICAgIH1cblxuICAgIHJldHVybiBhcnJheTtcbn1cblxuLyoqIEB0eXBlIHtQcm94eUhhbmRsZXI8RnVuY3Rpb24+fSAqL1xuY29uc3QgYXBwbHlIYW5kbGVyID0ge1xuICAgIGFwcGx5KGZ1bmMsIHRoaXNBcmcsIGFyZ3MpIHtcbiAgICAgICAgLy8gcGVlbCBvZmYgcHJveHlcbiAgICAgICAgaWYgKGlzRmxvYXQxNkFycmF5KHRoaXNBcmcpICYmIGlzRGVmYXVsdEZsb2F0MTZBcnJheU1ldGhvZHMoZnVuYykpIHtcbiAgICAgICAgICAgIHJldHVybiBSZWZsZWN0LmFwcGx5KGZ1bmMsIF8odGhpc0FyZykudGFyZ2V0ICxhcmdzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBSZWZsZWN0LmFwcGx5KGZ1bmMsIHRoaXNBcmcsIGFyZ3MpO1xuICAgIH0sXG59O1xuXG4vKiogQHR5cGUge1Byb3h5SGFuZGxlcjxGbG9hdDE2QXJyYXk+fSAqL1xuY29uc3QgaGFuZGxlciA9IHtcbiAgICBnZXQodGFyZ2V0LCBrZXkpIHtcbiAgICAgICAgbGV0IHdyYXBwZXIgPSBudWxsO1xuICAgICAgICBpZiAoIWlzVHlwZWRBcnJheUluZGV4ZWRQcm9wZXJ0eVdyaXRhYmxlKSB7XG4gICAgICAgICAgICB3cmFwcGVyID0gdGFyZ2V0O1xuICAgICAgICAgICAgdGFyZ2V0ID0gXyh3cmFwcGVyKS50YXJnZXQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNTdHJpbmdOdW1iZXJLZXkoa2V5KSkge1xuICAgICAgICAgICAgcmV0dXJuIFJlZmxlY3QuaGFzKHRhcmdldCwga2V5KSA/IGNvbnZlcnRUb051bWJlcihSZWZsZWN0LmdldCh0YXJnZXQsIGtleSkpIDogdW5kZWZpbmVkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gd3JhcHBlciAhPT0gbnVsbCAmJiBSZWZsZWN0Lmhhcyh3cmFwcGVyLCBrZXkpID8gUmVmbGVjdC5nZXQod3JhcHBlciwga2V5KSA6IFJlZmxlY3QuZ2V0KHRhcmdldCwga2V5KTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiByZXQgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFR5cGVkQXJyYXkgbWV0aG9kcyBjYW4ndCBiZSBjYWxsZWQgYnkgUHJveHkgT2JqZWN0XG4gICAgICAgICAgICBsZXQgcHJveHkgPSBfKHJldCkucHJveHk7XG5cbiAgICAgICAgICAgIGlmIChwcm94eSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcHJveHkgPSBfKHJldCkucHJveHkgPSBuZXcgUHJveHkocmV0LCBhcHBseUhhbmRsZXIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcHJveHk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc2V0KHRhcmdldCwga2V5LCB2YWx1ZSkge1xuICAgICAgICBsZXQgd3JhcHBlciA9IG51bGw7XG4gICAgICAgIGlmICghaXNUeXBlZEFycmF5SW5kZXhlZFByb3BlcnR5V3JpdGFibGUpIHtcbiAgICAgICAgICAgIHdyYXBwZXIgPSB0YXJnZXQ7XG4gICAgICAgICAgICB0YXJnZXQgPSBfKHdyYXBwZXIpLnRhcmdldDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc1N0cmluZ051bWJlcktleShrZXkpKSB7XG4gICAgICAgICAgICByZXR1cm4gUmVmbGVjdC5zZXQodGFyZ2V0LCBrZXksIHJvdW5kVG9GbG9hdDE2Qml0cyh2YWx1ZSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gZnJvemVuIG9iamVjdCBjYW4ndCBjaGFuZ2UgcHJvdG90eXBlIHByb3BlcnR5XG4gICAgICAgICAgICBpZiAod3JhcHBlciAhPT0gbnVsbCAmJiAoIVJlZmxlY3QuaGFzKHRhcmdldCwga2V5KSB8fCBPYmplY3QuaXNGcm96ZW4od3JhcHBlcikpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFJlZmxlY3Quc2V0KHdyYXBwZXIsIGtleSwgdmFsdWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUmVmbGVjdC5zZXQodGFyZ2V0LCBrZXksIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG59O1xuXG5pZiAoIWlzVHlwZWRBcnJheUluZGV4ZWRQcm9wZXJ0eVdyaXRhYmxlKSB7XG4gICAgaGFuZGxlci5nZXRQcm90b3R5cGVPZiA9ICh3cmFwcGVyKSA9PiB7IHJldHVybiBSZWZsZWN0LmdldFByb3RvdHlwZU9mKF8od3JhcHBlcikudGFyZ2V0KTsgfTtcbiAgICBoYW5kbGVyLnNldFByb3RvdHlwZU9mID0gKHdyYXBwZXIsIHByb3RvdHlwZSkgPT4geyByZXR1cm4gUmVmbGVjdC5zZXRQcm90b3R5cGVPZihfKHdyYXBwZXIpLnRhcmdldCwgcHJvdG90eXBlKTsgfTtcblxuICAgIGhhbmRsZXIuZGVmaW5lUHJvcGVydHkgPSAod3JhcHBlciwga2V5LCBkZXNjcmlwdG9yKSA9PiB7XG4gICAgICAgIGNvbnN0IHRhcmdldCA9IF8od3JhcHBlcikudGFyZ2V0O1xuICAgICAgICByZXR1cm4gIVJlZmxlY3QuaGFzKHRhcmdldCwga2V5KSB8fCBPYmplY3QuaXNGcm96ZW4od3JhcHBlcikgPyBSZWZsZWN0LmRlZmluZVByb3BlcnR5KHdyYXBwZXIsIGtleSwgZGVzY3JpcHRvcikgOiBSZWZsZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBkZXNjcmlwdG9yKTtcbiAgICB9O1xuICAgIGhhbmRsZXIuZGVsZXRlUHJvcGVydHkgPSAod3JhcHBlciwga2V5KSA9PiB7XG4gICAgICAgIGNvbnN0IHRhcmdldCA9IF8od3JhcHBlcikudGFyZ2V0O1xuICAgICAgICByZXR1cm4gUmVmbGVjdC5oYXMod3JhcHBlciwga2V5KSA/IFJlZmxlY3QuZGVsZXRlUHJvcGVydHkod3JhcHBlciwga2V5KSA6IFJlZmxlY3QuZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBrZXkpO1xuICAgIH07XG5cbiAgICBoYW5kbGVyLmhhcyA9ICh3cmFwcGVyLCBrZXkpID0+IHsgcmV0dXJuIFJlZmxlY3QuaGFzKHdyYXBwZXIsIGtleSkgfHwgUmVmbGVjdC5oYXMoXyh3cmFwcGVyKS50YXJnZXQsIGtleSk7IH07XG5cbiAgICBoYW5kbGVyLmlzRXh0ZW5zaWJsZSA9ICh3cmFwcGVyKSA9PiB7IHJldHVybiBSZWZsZWN0LmlzRXh0ZW5zaWJsZSh3cmFwcGVyKTsgfTtcbiAgICBoYW5kbGVyLnByZXZlbnRFeHRlbnNpb25zID0gKHdyYXBwZXIpID0+IHsgcmV0dXJuIFJlZmxlY3QucHJldmVudEV4dGVuc2lvbnMod3JhcHBlcik7IH07XG5cbiAgICBoYW5kbGVyLmdldE93blByb3BlcnR5RGVzY3JpcHRvciA9ICh3cmFwcGVyLCBrZXkpID0+IHsgcmV0dXJuIFJlZmxlY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHdyYXBwZXIsIGtleSk7IH07XG4gICAgaGFuZGxlci5vd25LZXlzID0gKHdyYXBwZXIpID0+IHsgcmV0dXJuIFJlZmxlY3Qub3duS2V5cyh3cmFwcGVyKTsgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmxvYXQxNkFycmF5IGV4dGVuZHMgVWludDE2QXJyYXkge1xuXG4gICAgY29uc3RydWN0b3IoaW5wdXQsIGJ5dGVPZmZzZXQsIGxlbmd0aCkge1xuICAgICAgICAvLyBpbnB1dCBGbG9hdDE2QXJyYXlcbiAgICAgICAgaWYgKGlzRmxvYXQxNkFycmF5KGlucHV0KSkge1xuICAgICAgICAgICAgc3VwZXIoXyhpbnB1dCkudGFyZ2V0KTtcblxuICAgICAgICAvLyAyMi4yLjEuMywgMjIuMi4xLjQgVHlwZWRBcnJheSwgQXJyYXksIEFycmF5TGlrZSwgSXRlcmFibGVcbiAgICAgICAgfSBlbHNlIGlmIChpbnB1dCAhPT0gbnVsbCAmJiB0eXBlb2YgaW5wdXQgPT09IFwib2JqZWN0XCIgJiYgIWlzQXJyYXlCdWZmZXIoaW5wdXQpKSB7XG4gICAgICAgICAgICAvLyBpZiBpbnB1dCBpcyBub3QgQXJyYXlMaWtlIGFuZCBJdGVyYWJsZSwgZ2V0IEFycmF5XG4gICAgICAgICAgICBjb25zdCBhcnJheUxpa2UgPSAhUmVmbGVjdC5oYXMoaW5wdXQsIFwibGVuZ3RoXCIpICYmIGlucHV0W1N5bWJvbC5pdGVyYXRvcl0gIT09IHVuZGVmaW5lZCA/IFsuLi5pbnB1dF0gOiBpbnB1dDtcblxuICAgICAgICAgICAgY29uc3QgbGVuZ3RoID0gYXJyYXlMaWtlLmxlbmd0aDtcbiAgICAgICAgICAgIHN1cGVyKGxlbmd0aCk7XG5cbiAgICAgICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIC8vIHN1cGVyIChVaW50MTZBcnJheSlcbiAgICAgICAgICAgICAgICB0aGlzW2ldID0gcm91bmRUb0Zsb2F0MTZCaXRzKGFycmF5TGlrZVtpXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgLy8gMjIuMi4xLjIsIDIyLjIuMS41IHByaW1pdGl2ZSwgQXJyYXlCdWZmZXJcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICBzdXBlcigpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgc3VwZXIoaW5wdXQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgc3VwZXIoaW5wdXQsIGJ5dGVPZmZzZXQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgc3VwZXIoaW5wdXQsIGJ5dGVPZmZzZXQsIGxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHByb3h5O1xuXG4gICAgICAgIGlmIChpc1R5cGVkQXJyYXlJbmRleGVkUHJvcGVydHlXcml0YWJsZSkge1xuICAgICAgICAgICAgcHJveHkgPSBuZXcgUHJveHkodGhpcywgaGFuZGxlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCB3cmFwcGVyID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgICAgIF8od3JhcHBlcikudGFyZ2V0ID0gdGhpcztcbiAgICAgICAgICAgIHByb3h5ID0gbmV3IFByb3h5KHdyYXBwZXIsIGhhbmRsZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcHJveHkgcHJpdmF0ZSBzdG9yYWdlXG4gICAgICAgIF8ocHJveHkpLnRhcmdldCA9IHRoaXM7XG5cbiAgICAgICAgLy8gdGhpcyBwcml2YXRlIHN0b3JhZ2VcbiAgICAgICAgXyh0aGlzKS5wcm94eSA9IHByb3h5O1xuXG4gICAgICAgIHJldHVybiBwcm94eTtcbiAgICB9XG5cbiAgICAvLyBzdGF0aWMgbWV0aG9kc1xuICAgIHN0YXRpYyBmcm9tKHNyYywgLi4ub3B0cykge1xuICAgICAgICBpZiAob3B0cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRmxvYXQxNkFycmF5KFVpbnQxNkFycmF5LmZyb20oc3JjLCByb3VuZFRvRmxvYXQxNkJpdHMpLmJ1ZmZlcik7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBtYXBGdW5jID0gb3B0c1swXTtcbiAgICAgICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMV07XG5cbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDE2QXJyYXkoVWludDE2QXJyYXkuZnJvbShzcmMsIGZ1bmN0aW9uICh2YWwsIC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIHJldHVybiByb3VuZFRvRmxvYXQxNkJpdHMobWFwRnVuYy5jYWxsKHRoaXMsIHZhbCwgLi4uYXJncykpO1xuICAgICAgICB9LCB0aGlzQXJnKS5idWZmZXIpO1xuICAgIH1cblxuICAgIHN0YXRpYyBvZiguLi5hcmdzKSB7XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQxNkFycmF5KGFyZ3MpO1xuICAgIH1cblxuICAgIC8vIGl0ZXJhdGUgbWV0aG9kc1xuICAgICogW1N5bWJvbC5pdGVyYXRvcl0oKSB7XG4gICAgICAgIGZvcihjb25zdCB2YWwgb2Ygc3VwZXJbU3ltYm9sLml0ZXJhdG9yXSgpKSB7XG4gICAgICAgICAgICB5aWVsZCBjb252ZXJ0VG9OdW1iZXIodmFsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGtleXMoKSB7XG4gICAgICAgIHJldHVybiBzdXBlci5rZXlzKCk7XG4gICAgfVxuXG4gICAgKiB2YWx1ZXMoKSB7XG4gICAgICAgIGZvcihjb25zdCB2YWwgb2Ygc3VwZXIudmFsdWVzKCkpIHtcbiAgICAgICAgICAgIHlpZWxkIGNvbnZlcnRUb051bWJlcih2YWwpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqIEB0eXBlIHsoKSA9PiBJdGVyYWJsZUl0ZXJhdG9yPFtudW1iZXIsIG51bWJlcl0+fSAqL1xuICAgICogZW50cmllcygpIHtcbiAgICAgICAgZm9yKGNvbnN0IFtpLCB2YWxdIG9mIHN1cGVyLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgeWllbGQgW2ksIGNvbnZlcnRUb051bWJlcih2YWwpXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGZ1bmN0aW9uYWwgbWV0aG9kc1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBtYXAoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICAgICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgICAgIGNvbnN0IGFycmF5ID0gW107XG4gICAgICAgIGZvcihsZXQgaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgICAgICAgICAgY29uc3QgdmFsID0gY29udmVydFRvTnVtYmVyKHRoaXNbaV0pO1xuICAgICAgICAgICAgYXJyYXkucHVzaChjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHZhbCwgaSwgXyh0aGlzKS5wcm94eSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDE2QXJyYXkoYXJyYXkpO1xuICAgIH1cblxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBmaWx0ZXIoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICAgICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgICAgIGNvbnN0IGFycmF5ID0gW107XG4gICAgICAgIGZvcihsZXQgaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgICAgICAgICAgY29uc3QgdmFsID0gY29udmVydFRvTnVtYmVyKHRoaXNbaV0pO1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrLmNhbGwodGhpc0FyZywgdmFsLCBpLCBfKHRoaXMpLnByb3h5KSkge1xuICAgICAgICAgICAgICAgIGFycmF5LnB1c2godmFsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQxNkFycmF5KGFycmF5KTtcbiAgICB9XG5cbiAgICByZWR1Y2UoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICAgICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgICAgIGxldCB2YWwsIHN0YXJ0O1xuXG4gICAgICAgIGlmIChvcHRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdmFsID0gY29udmVydFRvTnVtYmVyKHRoaXNbMF0pO1xuICAgICAgICAgICAgc3RhcnQgPSAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFsID0gb3B0c1swXTtcbiAgICAgICAgICAgIHN0YXJ0ID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvcihsZXQgaSA9IHN0YXJ0LCBsID0gdGhpcy5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICAgICAgICAgIHZhbCA9IGNhbGxiYWNrKHZhbCwgY29udmVydFRvTnVtYmVyKHRoaXNbaV0pLCBpLCBfKHRoaXMpLnByb3h5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2YWw7XG4gICAgfVxuXG4gICAgcmVkdWNlUmlnaHQoY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICAgICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgICAgIGxldCB2YWwsIHN0YXJ0O1xuXG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMubGVuZ3RoO1xuICAgICAgICBpZiAob3B0cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHZhbCA9IGNvbnZlcnRUb051bWJlcih0aGlzW2xlbmd0aCAtIDFdKTtcbiAgICAgICAgICAgIHN0YXJ0ID0gbGVuZ3RoIC0gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhbCA9IG9wdHNbMF07XG4gICAgICAgICAgICBzdGFydCA9IGxlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvcihsZXQgaSA9IHN0YXJ0OyBpLS07KSB7XG4gICAgICAgICAgICB2YWwgPSBjYWxsYmFjayh2YWwsIGNvbnZlcnRUb051bWJlcih0aGlzW2ldKSwgaSwgXyh0aGlzKS5wcm94eSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdmFsO1xuICAgIH1cblxuICAgIGZvckVhY2goY2FsbGJhY2ssIC4uLm9wdHMpIHtcbiAgICAgICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgICAgIGNvbnN0IHRoaXNBcmcgPSBvcHRzWzBdO1xuXG4gICAgICAgIGZvcihsZXQgaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgICAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCBjb252ZXJ0VG9OdW1iZXIodGhpc1tpXSksIGksIF8odGhpcykucHJveHkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZmluZChjYWxsYmFjaywgLi4ub3B0cykge1xuICAgICAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG5cbiAgICAgICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMF07XG5cbiAgICAgICAgZm9yKGxldCBpID0gMCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGNvbnZlcnRUb051bWJlcih0aGlzW2ldKTtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHZhbHVlLCBpLCBfKHRoaXMpLnByb3h5KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbmRJbmRleChjYWxsYmFjaywgLi4ub3B0cykge1xuICAgICAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG5cbiAgICAgICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMF07XG5cbiAgICAgICAgZm9yKGxldCBpID0gMCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGNvbnZlcnRUb051bWJlcih0aGlzW2ldKTtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHZhbHVlLCBpLCBfKHRoaXMpLnByb3h5KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIGV2ZXJ5KGNhbGxiYWNrLCAuLi5vcHRzKSB7XG4gICAgICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcblxuICAgICAgICBjb25zdCB0aGlzQXJnID0gb3B0c1swXTtcblxuICAgICAgICBmb3IobGV0IGkgPSAwLCBsID0gdGhpcy5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICAgICAgICAgIGlmICghY2FsbGJhY2suY2FsbCh0aGlzQXJnLCBjb252ZXJ0VG9OdW1iZXIodGhpc1tpXSksIGksIF8odGhpcykucHJveHkpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgc29tZShjYWxsYmFjaywgLi4ub3B0cykge1xuICAgICAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG5cbiAgICAgICAgY29uc3QgdGhpc0FyZyA9IG9wdHNbMF07XG5cbiAgICAgICAgZm9yKGxldCBpID0gMCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2suY2FsbCh0aGlzQXJnLCBjb252ZXJ0VG9OdW1iZXIodGhpc1tpXSksIGksIF8odGhpcykucHJveHkpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gY2hhbmdlIGVsZW1lbnQgbWV0aG9kc1xuICAgIHNldChpbnB1dCwgLi4ub3B0cykge1xuICAgICAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG5cbiAgICAgICAgY29uc3Qgb2Zmc2V0ID0gb3B0c1swXTtcblxuICAgICAgICBsZXQgZmxvYXQxNmJpdHM7XG5cbiAgICAgICAgLy8gaW5wdXQgRmxvYXQxNkFycmF5XG4gICAgICAgIGlmIChpc0Zsb2F0MTZBcnJheShpbnB1dCkpIHtcbiAgICAgICAgICAgIGZsb2F0MTZiaXRzID0gXyhpbnB1dCkudGFyZ2V0O1xuXG4gICAgICAgIC8vIGlucHV0IG90aGVyc1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgYXJyYXlMaWtlID0gIVJlZmxlY3QuaGFzKGlucHV0LCBcImxlbmd0aFwiKSAmJiBpbnB1dFtTeW1ib2wuaXRlcmF0b3JdICE9PSB1bmRlZmluZWQgPyBbLi4uaW5wdXRdIDogaW5wdXQ7XG4gICAgICAgICAgICBjb25zdCBsZW5ndGggPSBhcnJheUxpa2UubGVuZ3RoO1xuXG4gICAgICAgICAgICBmbG9hdDE2Yml0cyA9IG5ldyBVaW50MTZBcnJheShsZW5ndGgpO1xuICAgICAgICAgICAgZm9yKGxldCBpID0gMCwgbCA9IGFycmF5TGlrZS5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICAgICAgICAgICAgICBmbG9hdDE2Yml0c1tpXSA9IHJvdW5kVG9GbG9hdDE2Qml0cyhhcnJheUxpa2VbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc3VwZXIuc2V0KGZsb2F0MTZiaXRzLCBvZmZzZXQpO1xuICAgIH1cblxuICAgIHJldmVyc2UoKSB7XG4gICAgICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcblxuICAgICAgICBzdXBlci5yZXZlcnNlKCk7XG5cbiAgICAgICAgcmV0dXJuIF8odGhpcykucHJveHk7XG4gICAgfVxuXG4gICAgZmlsbCh2YWx1ZSwgLi4ub3B0cykge1xuICAgICAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG5cbiAgICAgICAgc3VwZXIuZmlsbChyb3VuZFRvRmxvYXQxNkJpdHModmFsdWUpLCAuLi5vcHRzKTtcblxuICAgICAgICByZXR1cm4gXyh0aGlzKS5wcm94eTtcbiAgICB9XG5cbiAgICBjb3B5V2l0aGluKHRhcmdldCwgc3RhcnQsIC4uLm9wdHMpIHtcbiAgICAgICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgICAgIHN1cGVyLmNvcHlXaXRoaW4odGFyZ2V0LCBzdGFydCwgLi4ub3B0cyk7XG5cbiAgICAgICAgcmV0dXJuIF8odGhpcykucHJveHk7XG4gICAgfVxuXG4gICAgc29ydCguLi5vcHRzKSB7XG4gICAgICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcblxuICAgICAgICBsZXQgY29tcGFyZUZ1bmN0aW9uID0gb3B0c1swXTtcblxuICAgICAgICBpZiAoY29tcGFyZUZ1bmN0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbXBhcmVGdW5jdGlvbiA9IGRlZmF1bHRDb21wYXJlRnVuY3Rpb247XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBfY29udmVydFRvTnVtYmVyID0gbWVtb2l6ZShjb252ZXJ0VG9OdW1iZXIpO1xuXG4gICAgICAgIHN1cGVyLnNvcnQoKHgsIHkpID0+IHsgcmV0dXJuIGNvbXBhcmVGdW5jdGlvbihfY29udmVydFRvTnVtYmVyKHgpLCBfY29udmVydFRvTnVtYmVyKHkpKTsgfSk7XG5cbiAgICAgICAgcmV0dXJuIF8odGhpcykucHJveHk7XG4gICAgfVxuXG4gICAgLy8gY29weSBlbGVtZW50IG1ldGhvZHNcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgc2xpY2UoLi4ub3B0cykge1xuICAgICAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG5cbiAgICAgICAgbGV0IGZsb2F0MTZiaXRzO1xuXG4gICAgICAgIC8vIFY4LCBTcGlkZXJNb25rZXksIEphdmFTY3JpcHRDb3JlLCBDaGFrcmEgdGhyb3cgVHlwZUVycm9yXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmbG9hdDE2Yml0cyA9IHN1cGVyLnNsaWNlKC4uLm9wdHMpO1xuICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgIGlmIChlIGluc3RhbmNlb2YgVHlwZUVycm9yKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdWludDE2ID0gbmV3IFVpbnQxNkFycmF5KHRoaXMuYnVmZmVyLCB0aGlzLmJ5dGVPZmZzZXQsIHRoaXMubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICBmbG9hdDE2Yml0cyA9IHVpbnQxNi5zbGljZSguLi5vcHRzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQxNkFycmF5KGZsb2F0MTZiaXRzLmJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHN1YmFycmF5KC4uLm9wdHMpIHtcbiAgICAgICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgICAgIGxldCBmbG9hdDE2Yml0cztcblxuICAgICAgICAvLyBWOCwgU3BpZGVyTW9ua2V5LCBKYXZhU2NyaXB0Q29yZSwgQ2hha3JhIHRocm93IFR5cGVFcnJvclxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZmxvYXQxNmJpdHMgPSBzdXBlci5zdWJhcnJheSguLi5vcHRzKTtcbiAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICBpZiAoZSBpbnN0YW5jZW9mIFR5cGVFcnJvcikge1xuICAgICAgICAgICAgICAgIGNvbnN0IHVpbnQxNiA9IG5ldyBVaW50MTZBcnJheSh0aGlzLmJ1ZmZlciwgdGhpcy5ieXRlT2Zmc2V0LCB0aGlzLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgZmxvYXQxNmJpdHMgPSB1aW50MTYuc3ViYXJyYXkoLi4ub3B0cyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MTZBcnJheShmbG9hdDE2Yml0cy5idWZmZXIsIGZsb2F0MTZiaXRzLmJ5dGVPZmZzZXQsIGZsb2F0MTZiaXRzLmxlbmd0aCk7XG4gICAgfVxuXG4gICAgLy8gY29udGFpbnMgbWV0aG9kc1xuICAgIGluZGV4T2YoZWxlbWVudCwgLi4ub3B0cykge1xuICAgICAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG5cbiAgICAgICAgY29uc3QgbGVuZ3RoID0gdGhpcy5sZW5ndGg7XG5cbiAgICAgICAgbGV0IGZyb20gPSBUb0ludGVnZXIob3B0c1swXSk7XG5cbiAgICAgICAgaWYgKGZyb20gPCAwKSB7XG4gICAgICAgICAgICBmcm9tICs9IGxlbmd0aDtcbiAgICAgICAgICAgIGlmIChmcm9tIDwgMCkge1xuICAgICAgICAgICAgICAgIGZyb20gPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yKGxldCBpID0gZnJvbSwgbCA9IGxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgICAgICAgICAgaWYgKGNvbnZlcnRUb051bWJlcih0aGlzW2ldKSA9PT0gZWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIGxhc3RJbmRleE9mKGVsZW1lbnQsIC4uLm9wdHMpIHtcbiAgICAgICAgYXNzZXJ0RmxvYXQxNkFycmF5KHRoaXMpO1xuXG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMubGVuZ3RoO1xuXG4gICAgICAgIGxldCBmcm9tID0gVG9JbnRlZ2VyKG9wdHNbMF0pO1xuXG4gICAgICAgIGZyb20gPSBmcm9tID09PSAwID8gbGVuZ3RoIDogZnJvbSArIDE7XG5cbiAgICAgICAgaWYgKGZyb20gPj0gMCkge1xuICAgICAgICAgICAgZnJvbSA9IGZyb20gPCBsZW5ndGggPyBmcm9tIDogbGVuZ3RoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZnJvbSArPSBsZW5ndGg7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IobGV0IGkgPSBmcm9tOyBpLS07KSB7XG4gICAgICAgICAgICBpZiAoY29udmVydFRvTnVtYmVyKHRoaXNbaV0pID09PSBlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgaW5jbHVkZXMoZWxlbWVudCwgLi4ub3B0cykge1xuICAgICAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG5cbiAgICAgICAgY29uc3QgbGVuZ3RoID0gdGhpcy5sZW5ndGg7XG5cbiAgICAgICAgbGV0IGZyb20gPSBUb0ludGVnZXIob3B0c1swXSk7XG5cbiAgICAgICAgaWYgKGZyb20gPCAwKSB7XG4gICAgICAgICAgICBmcm9tICs9IGxlbmd0aDtcbiAgICAgICAgICAgIGlmIChmcm9tIDwgMCkge1xuICAgICAgICAgICAgICAgIGZyb20gPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaXNOYU4gPSBOdW1iZXIuaXNOYU4oZWxlbWVudCk7XG4gICAgICAgIGZvcihsZXQgaSA9IGZyb20sIGwgPSBsZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gY29udmVydFRvTnVtYmVyKHRoaXNbaV0pO1xuXG4gICAgICAgICAgICBpZiAoaXNOYU4gJiYgTnVtYmVyLmlzTmFOKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBzdHJpbmcgbWV0aG9kc1xuICAgIGpvaW4oLi4ub3B0cykge1xuICAgICAgICBhc3NlcnRGbG9hdDE2QXJyYXkodGhpcyk7XG5cbiAgICAgICAgY29uc3QgYXJyYXkgPSBjb3B5VG9BcnJheSh0aGlzKTtcblxuICAgICAgICByZXR1cm4gYXJyYXkuam9pbiguLi5vcHRzKTtcbiAgICB9XG5cbiAgICB0b0xvY2FsZVN0cmluZyguLi5vcHRzKSB7XG4gICAgICAgIGFzc2VydEZsb2F0MTZBcnJheSh0aGlzKTtcblxuICAgICAgICBjb25zdCBhcnJheSA9IGNvcHlUb0FycmF5KHRoaXMpO1xuXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgcmV0dXJuIGFycmF5LnRvTG9jYWxlU3RyaW5nKC4uLm9wdHMpO1xuICAgIH1cblxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBnZXQgW1N5bWJvbC50b1N0cmluZ1RhZ10oKSB7XG4gICAgICAgIGlmIChpc0Zsb2F0MTZBcnJheSh0aGlzKSkge1xuICAgICAgICAgICAgcmV0dXJuIFwiRmxvYXQxNkFycmF5XCI7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmNvbnN0IEZsb2F0MTZBcnJheSRwcm90b3R5cGUgPSBGbG9hdDE2QXJyYXkucHJvdG90eXBlO1xuXG5jb25zdCBkZWZhdWx0RmxvYXQxNkFycmF5TWV0aG9kcyA9IG5ldyBXZWFrU2V0KCk7XG5mb3IoY29uc3Qga2V5IG9mIFJlZmxlY3Qub3duS2V5cyhGbG9hdDE2QXJyYXkkcHJvdG90eXBlKSkge1xuICAgIGNvbnN0IHZhbCA9IEZsb2F0MTZBcnJheSRwcm90b3R5cGVba2V5XTtcbiAgICBpZiAodHlwZW9mIHZhbCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGRlZmF1bHRGbG9hdDE2QXJyYXlNZXRob2RzLmFkZCh2YWwpO1xuICAgIH1cbn1cbiIsIi8qKlxuICogSmF2YVNjcmlwdENvcmUgPD0gMTIgYnVnXG4gKiBAc2VlIGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD0xNzE2MDZcbiAqL1xuZXhwb3J0IGNvbnN0IGlzVHlwZWRBcnJheUluZGV4ZWRQcm9wZXJ0eVdyaXRhYmxlID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihuZXcgVWludDhBcnJheSgxKSwgMCkud3JpdGFibGU7XG4iLCJpbXBvcnQgeyBpc0RhdGFWaWV3IH0gZnJvbSBcIi4vaXNcIjtcbmltcG9ydCB7IGNvbnZlcnRUb051bWJlciwgcm91bmRUb0Zsb2F0MTZCaXRzIH0gZnJvbSBcIi4vbGliXCI7XG5cbi8qKlxuICogcmV0dXJucyBhbiB1bnNpZ25lZCAxNi1iaXQgZmxvYXQgYXQgdGhlIHNwZWNpZmllZCBieXRlIG9mZnNldCBmcm9tIHRoZSBzdGFydCBvZiB0aGUgRGF0YVZpZXcuXG4gKiBAcGFyYW0ge0RhdGFWaWV3fSBkYXRhVmlld1xuICogQHBhcmFtIHtudW1iZXJ9IGJ5dGVPZmZzZXRcbiAqIEBwYXJhbSB7W2Jvb2xlYW5dfSBvcHRzXG4gKiBAcmV0dXJucyB7bnVtYmVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RmxvYXQxNihkYXRhVmlldywgYnl0ZU9mZnNldCwgLi4ub3B0cykge1xuICAgIGlmICghaXNEYXRhVmlldyhkYXRhVmlldykpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkZpcnN0IGFyZ3VtZW50IHRvIGdldEZsb2F0MTYgZnVuY3Rpb24gbXVzdCBiZSBhIERhdGFWaWV3XCIpO1xuICAgIH1cblxuICAgIHJldHVybiBjb252ZXJ0VG9OdW1iZXIoIGRhdGFWaWV3LmdldFVpbnQxNihieXRlT2Zmc2V0LCAuLi5vcHRzKSApO1xufVxuXG4vKipcbiAqIHN0b3JlcyBhbiB1bnNpZ25lZCAxNi1iaXQgZmxvYXQgdmFsdWUgYXQgdGhlIHNwZWNpZmllZCBieXRlIG9mZnNldCBmcm9tIHRoZSBzdGFydCBvZiB0aGUgRGF0YVZpZXcuXG4gKiBAcGFyYW0ge0RhdGFWaWV3fSBkYXRhVmlld1xuICogQHBhcmFtIHtudW1iZXJ9IGJ5dGVPZmZzZXRcbiAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZVxuICogQHBhcmFtIHtbYm9vbGVhbl19IG9wdHNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldEZsb2F0MTYoZGF0YVZpZXcsIGJ5dGVPZmZzZXQsIHZhbHVlLCAuLi5vcHRzKSB7XG4gICAgaWYgKCFpc0RhdGFWaWV3KGRhdGFWaWV3KSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiRmlyc3QgYXJndW1lbnQgdG8gc2V0RmxvYXQxNiBmdW5jdGlvbiBtdXN0IGJlIGEgRGF0YVZpZXdcIik7XG4gICAgfVxuXG4gICAgZGF0YVZpZXcuc2V0VWludDE2KGJ5dGVPZmZzZXQsIHJvdW5kVG9GbG9hdDE2Qml0cyh2YWx1ZSksIC4uLm9wdHMpO1xufVxuIiwiaW1wb3J0IHsgY29udmVydFRvTnVtYmVyLCByb3VuZFRvRmxvYXQxNkJpdHMgfSBmcm9tIFwiLi9saWJcIjtcblxuLyoqXG4gKiByZXR1cm5zIHRoZSBuZWFyZXN0IGhhbGYgcHJlY2lzaW9uIGZsb2F0IHJlcHJlc2VudGF0aW9uIG9mIGEgbnVtYmVyLlxuICogQHBhcmFtIHtudW1iZXJ9IG51bVxuICogQHJldHVybnMge251bWJlcn1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaGZyb3VuZChudW0pIHtcbiAgICBudW0gPSBOdW1iZXIobnVtKTtcblxuICAgIC8vIGZvciBvcHRpbWl6YXRpb25cbiAgICBpZiAoIU51bWJlci5pc0Zpbml0ZShudW0pIHx8IG51bSA9PT0gMCkge1xuICAgICAgICByZXR1cm4gbnVtO1xuICAgIH1cblxuICAgIGNvbnN0IHgxNiA9IHJvdW5kVG9GbG9hdDE2Qml0cyhudW0pO1xuICAgIHJldHVybiBjb252ZXJ0VG9OdW1iZXIoeDE2KTtcbn1cbiIsImV4cG9ydCB7IGRlZmF1bHQgYXMgaGZyb3VuZCB9IGZyb20gXCIuL2hmcm91bmRcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgRmxvYXQxNkFycmF5IH0gZnJvbSBcIi4vRmxvYXQxNkFycmF5XCI7XG5leHBvcnQgeyBnZXRGbG9hdDE2LCBzZXRGbG9hdDE2IH0gZnJvbSBcIi4vZGF0YVZpZXcuanNcIjtcbiIsImltcG9ydCB7IFRvSW50ZWdlciB9IGZyb20gXCIuL3NwZWNcIjtcblxuZXhwb3J0IHsgZGVmYXVsdCBhcyBpc0FycmF5QnVmZmVyIH0gZnJvbSBcImxvZGFzaC1lcy9pc0FycmF5QnVmZmVyXCI7XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSB2aWV3XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzRGF0YVZpZXcodmlldykge1xuICAgIHJldHVybiB2aWV3IGluc3RhbmNlb2YgRGF0YVZpZXc7XG59XG5cbi8qKlxuICogQHBhcmFtIHt1bmtub3dufSBrZXlcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNTdHJpbmdOdW1iZXJLZXkoa2V5KSB7XG4gICAgcmV0dXJuIHR5cGVvZiBrZXkgPT09IFwic3RyaW5nXCIgJiYga2V5ID09PSBUb0ludGVnZXIoa2V5KSArIFwiXCI7XG59XG4iLCIvLyBhbGdvcml0aG06IGZ0cDovL2Z0cC5mb3gtdG9vbGtpdC5vcmcvcHViL2Zhc3RoYWxmZmxvYXRjb252ZXJzaW9uLnBkZlxuXG5jb25zdCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG5jb25zdCBmbG9hdFZpZXcgPSBuZXcgRmxvYXQzMkFycmF5KGJ1ZmZlcik7XG5jb25zdCB1aW50MzJWaWV3ID0gbmV3IFVpbnQzMkFycmF5KGJ1ZmZlcik7XG5cblxuY29uc3QgYmFzZVRhYmxlID0gbmV3IFVpbnQzMkFycmF5KDUxMik7XG5jb25zdCBzaGlmdFRhYmxlID0gbmV3IFVpbnQzMkFycmF5KDUxMik7XG5cbmZvcihsZXQgaSA9IDA7IGkgPCAyNTY7ICsraSkge1xuICAgIGNvbnN0IGUgPSBpIC0gMTI3O1xuXG4gICAgLy8gdmVyeSBzbWFsbCBudW1iZXIgKDAsIC0wKVxuICAgIGlmIChlIDwgLTI3KSB7XG4gICAgICAgIGJhc2VUYWJsZVtpIHwgMHgwMDBdID0gMHgwMDAwO1xuICAgICAgICBiYXNlVGFibGVbaSB8IDB4MTAwXSA9IDB4ODAwMDtcbiAgICAgICAgc2hpZnRUYWJsZVtpIHwgMHgwMDBdID0gMjQ7XG4gICAgICAgIHNoaWZ0VGFibGVbaSB8IDB4MTAwXSA9IDI0O1xuXG4gICAgLy8gc21hbGwgbnVtYmVyIChkZW5vcm0pXG4gICAgfSBlbHNlIGlmIChlIDwgLTE0KSB7XG4gICAgICAgIGJhc2VUYWJsZVtpIHwgMHgwMDBdID0gIDB4MDQwMCA+PiAoLWUgLSAxNCk7XG4gICAgICAgIGJhc2VUYWJsZVtpIHwgMHgxMDBdID0gKDB4MDQwMCA+PiAoLWUgLSAxNCkpIHwgMHg4MDAwO1xuICAgICAgICBzaGlmdFRhYmxlW2kgfCAweDAwMF0gPSAtZSAtIDE7XG4gICAgICAgIHNoaWZ0VGFibGVbaSB8IDB4MTAwXSA9IC1lIC0gMTtcblxuICAgIC8vIG5vcm1hbCBudW1iZXJcbiAgICB9IGVsc2UgaWYgKGUgPD0gMTUpIHtcbiAgICAgICAgYmFzZVRhYmxlW2kgfCAweDAwMF0gPSAgKGUgKyAxNSkgPDwgMTA7XG4gICAgICAgIGJhc2VUYWJsZVtpIHwgMHgxMDBdID0gKChlICsgMTUpIDw8IDEwKSB8IDB4ODAwMDtcbiAgICAgICAgc2hpZnRUYWJsZVtpIHwgMHgwMDBdID0gMTM7XG4gICAgICAgIHNoaWZ0VGFibGVbaSB8IDB4MTAwXSA9IDEzO1xuXG4gICAgLy8gbGFyZ2UgbnVtYmVyIChJbmZpbml0eSwgLUluZmluaXR5KVxuICAgIH0gZWxzZSBpZiAoZSA8IDEyOCkge1xuICAgICAgICBiYXNlVGFibGVbaSB8IDB4MDAwXSA9IDB4N2MwMDtcbiAgICAgICAgYmFzZVRhYmxlW2kgfCAweDEwMF0gPSAweGZjMDA7XG4gICAgICAgIHNoaWZ0VGFibGVbaSB8IDB4MDAwXSA9IDI0O1xuICAgICAgICBzaGlmdFRhYmxlW2kgfCAweDEwMF0gPSAyNDtcblxuICAgIC8vIHN0YXkgKE5hTiwgSW5maW5pdHksIC1JbmZpbml0eSlcbiAgICB9IGVsc2Uge1xuICAgICAgICBiYXNlVGFibGVbaSB8IDB4MDAwXSA9IDB4N2MwMDtcbiAgICAgICAgYmFzZVRhYmxlW2kgfCAweDEwMF0gPSAweGZjMDA7XG4gICAgICAgIHNoaWZ0VGFibGVbaSB8IDB4MDAwXSA9IDEzO1xuICAgICAgICBzaGlmdFRhYmxlW2kgfCAweDEwMF0gPSAxMztcbiAgICB9XG59XG5cbi8qKlxuICogcm91bmQgYSBudW1iZXIgdG8gYSBoYWxmIGZsb2F0IG51bWJlciBiaXRzLlxuICogQHBhcmFtIHtudW1iZXJ9IG51bSAtIGRvdWJsZSBmbG9hdFxuICogQHJldHVybnMge251bWJlcn0gaGFsZiBmbG9hdCBudW1iZXIgYml0c1xuICovXG5leHBvcnQgZnVuY3Rpb24gcm91bmRUb0Zsb2F0MTZCaXRzKG51bSkge1xuICAgIGZsb2F0Vmlld1swXSA9IG51bTtcblxuICAgIGNvbnN0IGYgPSB1aW50MzJWaWV3WzBdO1xuICAgIGNvbnN0IGUgPSAoZiA+PiAyMykgJiAweDFmZjtcbiAgICByZXR1cm4gYmFzZVRhYmxlW2VdICsgKChmICYgMHgwMDdmZmZmZikgPj4gc2hpZnRUYWJsZVtlXSk7XG59XG5cblxuY29uc3QgbWFudGlzc2FUYWJsZSA9IG5ldyBVaW50MzJBcnJheSgyMDQ4KTtcbmNvbnN0IGV4cG9uZW50VGFibGUgPSBuZXcgVWludDMyQXJyYXkoNjQpO1xuY29uc3Qgb2Zmc2V0VGFibGUgPSBuZXcgVWludDMyQXJyYXkoNjQpO1xuXG5tYW50aXNzYVRhYmxlWzBdID0gMDtcbmZvcihsZXQgaSA9IDE7IGkgPCAxMDI0OyArK2kpIHtcbiAgICBsZXQgbSA9IGkgPDwgMTM7ICAgIC8vIHplcm8gcGFkIG1hbnRpc3NhIGJpdHNcbiAgICBsZXQgZSA9IDA7ICAgICAgICAgIC8vIHplcm8gZXhwb25lbnRcblxuICAgIC8vIG5vcm1hbGl6ZWRcbiAgICB3aGlsZSgobSAmIDB4MDA4MDAwMDApID09PSAwKSB7XG4gICAgICAgIGUgLT0gMHgwMDgwMDAwMDsgICAgLy8gZGVjcmVtZW50IGV4cG9uZW50XG4gICAgICAgIG0gPDw9IDE7XG4gICAgfVxuXG4gICAgbSAmPSB+MHgwMDgwMDAwMDsgICAvLyBjbGVhciBsZWFkaW5nIDEgYml0XG4gICAgZSArPSAweDM4ODAwMDAwOyAgICAvLyBhZGp1c3QgYmlhc1xuXG4gICAgbWFudGlzc2FUYWJsZVtpXSA9IG0gfCBlO1xufVxuZm9yKGxldCBpID0gMTAyNDsgaSA8IDIwNDg7ICsraSkge1xuICAgIG1hbnRpc3NhVGFibGVbaV0gPSAweDM4MDAwMDAwICsgKChpIC0gMTAyNCkgPDwgMTMpO1xufVxuXG5leHBvbmVudFRhYmxlWzBdID0gMDtcbmZvcihsZXQgaSA9IDE7IGkgPCAzMTsgKytpKSB7XG4gICAgZXhwb25lbnRUYWJsZVtpXSA9IGkgPDwgMjM7XG59XG5leHBvbmVudFRhYmxlWzMxXSA9IDB4NDc4MDAwMDA7XG5leHBvbmVudFRhYmxlWzMyXSA9IDB4ODAwMDAwMDA7XG5mb3IobGV0IGkgPSAzMzsgaSA8IDYzOyArK2kpIHtcbiAgICBleHBvbmVudFRhYmxlW2ldID0gMHg4MDAwMDAwMCArICgoaSAtIDMyKSA8PCAyMyk7XG59XG5leHBvbmVudFRhYmxlWzYzXSA9IDB4Yzc4MDAwMDA7XG5cbm9mZnNldFRhYmxlWzBdID0gMDtcbmZvcihsZXQgaSA9IDE7IGkgPCA2NDsgKytpKSB7XG4gICAgaWYgKGkgPT09IDMyKSB7XG4gICAgICAgIG9mZnNldFRhYmxlW2ldID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgICBvZmZzZXRUYWJsZVtpXSA9IDEwMjQ7XG4gICAgfVxufVxuXG4vKipcbiAqIGNvbnZlcnQgYSBoYWxmIGZsb2F0IG51bWJlciBiaXRzIHRvIGEgbnVtYmVyLlxuICogQHBhcmFtIHtudW1iZXJ9IGZsb2F0MTZiaXRzIC0gaGFsZiBmbG9hdCBudW1iZXIgYml0c1xuICogQHJldHVybnMge251bWJlcn0gZG91YmxlIGZsb2F0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb252ZXJ0VG9OdW1iZXIoZmxvYXQxNmJpdHMpIHtcbiAgICBjb25zdCBtID0gZmxvYXQxNmJpdHMgPj4gMTA7XG4gICAgdWludDMyVmlld1swXSA9IG1hbnRpc3NhVGFibGVbb2Zmc2V0VGFibGVbbV0gKyAoZmxvYXQxNmJpdHMgJiAweDNmZildICsgZXhwb25lbnRUYWJsZVttXTtcbiAgICByZXR1cm4gZmxvYXRWaWV3WzBdO1xufVxuIiwiLyoqXG4gKiBAcmV0dXJucyB7KHNlbGY6b2JqZWN0KSA9PiBvYmplY3R9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVQcml2YXRlU3RvcmFnZSgpIHtcblx0Y29uc3Qgd20gPSBuZXcgV2Vha01hcCgpO1xuXHRyZXR1cm4gKHNlbGYpID0+IHtcblx0XHRsZXQgb2JqID0gd20uZ2V0KHNlbGYpO1xuXHRcdGlmIChvYmopIHtcblx0XHRcdHJldHVybiBvYmo7XG5cdFx0fSBlbHNlIHtcblx0XHRcdG9iaiA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cdFx0XHR3bS5zZXQoc2VsZiwgb2JqKTtcblx0XHRcdHJldHVybiBvYmo7XG5cdFx0fVxuXHR9O1xufVxuIiwiLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHRhcmdldFxuICogQHJldHVybnMge251bWJlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIFRvSW50ZWdlcih0YXJnZXQpIHtcbiAgICBsZXQgbnVtYmVyID0gdHlwZW9mIHRhcmdldCAhPT0gXCJudW1iZXJcIiA/IE51bWJlcih0YXJnZXQpIDogdGFyZ2V0O1xuICAgIGlmIChOdW1iZXIuaXNOYU4obnVtYmVyKSkge1xuICAgICAgICBudW1iZXIgPSAwO1xuICAgIH1cbiAgICByZXR1cm4gTWF0aC50cnVuYyhudW1iZXIpO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7bnVtYmVyfSB4XG4gKiBAcGFyYW0ge251bWJlcn0geVxuICogQHJldHVybnMgey0xIHwgMCB8IDF9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWZhdWx0Q29tcGFyZUZ1bmN0aW9uKHgsIHkpIHtcbiAgICBjb25zdCBbaXNOYU5feCwgaXNOYU5feV0gPSBbTnVtYmVyLmlzTmFOKHgpLCBOdW1iZXIuaXNOYU4oeSldO1xuXG4gICAgaWYgKGlzTmFOX3ggJiYgaXNOYU5feSkge1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBpZiAoaXNOYU5feCkge1xuICAgICAgICByZXR1cm4gMTtcbiAgICB9XG5cbiAgICBpZiAoaXNOYU5feSkge1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgaWYgKHggPCB5KSB7XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICBpZiAoeCA+IHkpIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgfVxuXG4gICAgaWYgKHggPT09IDAgJiYgeSA9PT0gMCkge1xuICAgICAgICBjb25zdCBbaXNQbHVzWmVyb194LCBpc1BsdXNaZXJvX3ldID0gW09iamVjdC5pcyh4LCAwKSwgT2JqZWN0LmlzKHksIDApXTtcblxuICAgICAgICBpZiAoIWlzUGx1c1plcm9feCAmJiBpc1BsdXNaZXJvX3kpIHtcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc1BsdXNaZXJvX3ggJiYgIWlzUGx1c1plcm9feSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gMDtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuY2hhbmdlRHBpQmxvYiA9IGNoYW5nZURwaUJsb2I7XG5leHBvcnRzLmNoYW5nZURwaURhdGFVcmwgPSBjaGFuZ2VEcGlEYXRhVXJsO1xuXG5mdW5jdGlvbiBfdG9Db25zdW1hYmxlQXJyYXkoYXJyKSB7IGlmIChBcnJheS5pc0FycmF5KGFycikpIHsgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBBcnJheShhcnIubGVuZ3RoKTsgaSA8IGFyci5sZW5ndGg7IGkrKykgeyBhcnIyW2ldID0gYXJyW2ldOyB9IHJldHVybiBhcnIyOyB9IGVsc2UgeyByZXR1cm4gQXJyYXkuZnJvbShhcnIpOyB9IH1cblxuZnVuY3Rpb24gY3JlYXRlUG5nRGF0YVRhYmxlKCkge1xuICAvKiBUYWJsZSBvZiBDUkNzIG9mIGFsbCA4LWJpdCBtZXNzYWdlcy4gKi9cbiAgdmFyIGNyY1RhYmxlID0gbmV3IEludDMyQXJyYXkoMjU2KTtcbiAgZm9yICh2YXIgbiA9IDA7IG4gPCAyNTY7IG4rKykge1xuICAgIHZhciBjID0gbjtcbiAgICBmb3IgKHZhciBrID0gMDsgayA8IDg7IGsrKykge1xuICAgICAgYyA9IGMgJiAxID8gMHhlZGI4ODMyMCBeIGMgPj4+IDEgOiBjID4+PiAxO1xuICAgIH1cbiAgICBjcmNUYWJsZVtuXSA9IGM7XG4gIH1cbiAgcmV0dXJuIGNyY1RhYmxlO1xufVxuXG5mdW5jdGlvbiBjYWxjQ3JjKGJ1Zikge1xuICB2YXIgYyA9IC0xO1xuICBpZiAoIXBuZ0RhdGFUYWJsZSkgcG5nRGF0YVRhYmxlID0gY3JlYXRlUG5nRGF0YVRhYmxlKCk7XG4gIGZvciAodmFyIG4gPSAwOyBuIDwgYnVmLmxlbmd0aDsgbisrKSB7XG4gICAgYyA9IHBuZ0RhdGFUYWJsZVsoYyBeIGJ1ZltuXSkgJiAweEZGXSBeIGMgPj4+IDg7XG4gIH1cbiAgcmV0dXJuIGMgXiAtMTtcbn1cblxudmFyIHBuZ0RhdGFUYWJsZSA9IHZvaWQgMDtcblxudmFyIFBORyA9ICdpbWFnZS9wbmcnO1xudmFyIEpQRUcgPSAnaW1hZ2UvanBlZyc7XG5cbi8vIHRob3NlIGFyZSAzIHBvc3NpYmxlIHNpZ25hdHVyZSBvZiB0aGUgcGh5c0Jsb2NrIGluIGJhc2U2NC5cbi8vIHRoZSBwSFlzIHNpZ25hdHVyZSBibG9jayBpcyBwcmVjZWVkIGJ5IHRoZSA0IGJ5dGVzIG9mIGxlbmdodC4gVGhlIGxlbmd0aCBvZlxuLy8gdGhlIGJsb2NrIGlzIGFsd2F5cyA5IGJ5dGVzLiBTbyBhIHBoeXMgYmxvY2sgaGFzIGFsd2F5cyB0aGlzIHNpZ25hdHVyZTpcbi8vIDAgMCAwIDkgcCBIIFkgcy5cbi8vIEhvd2V2ZXIgdGhlIGRhdGE2NCBlbmNvZGluZyBhbGlnbnMgd2Ugd2lsbCBhbHdheXMgZmluZCBvbmUgb2YgdGhvc2UgMyBzdHJpbmdzLlxuLy8gdGhpcyBhbGxvdyB1cyB0byBmaW5kIHRoaXMgcGFydGljdWxhciBvY2N1cmVuY2Ugb2YgdGhlIHBIWXMgYmxvY2sgd2l0aG91dFxuLy8gY29udmVydGluZyBmcm9tIGI2NCBiYWNrIHRvIHN0cmluZ1xudmFyIGI2NFBoeXNTaWduYXR1cmUxID0gJ0FBbHdTRmx6JztcbnZhciBiNjRQaHlzU2lnbmF0dXJlMiA9ICdBQUFKY0VoWic7XG52YXIgYjY0UGh5c1NpZ25hdHVyZTMgPSAnQUFBQUNYQkknO1xuXG52YXIgX1AgPSAncCcuY2hhckNvZGVBdCgwKTtcbnZhciBfSCA9ICdIJy5jaGFyQ29kZUF0KDApO1xudmFyIF9ZID0gJ1knLmNoYXJDb2RlQXQoMCk7XG52YXIgX1MgPSAncycuY2hhckNvZGVBdCgwKTtcblxuZnVuY3Rpb24gY2hhbmdlRHBpQmxvYihibG9iLCBkcGkpIHtcbiAgLy8gMzMgYnl0ZXMgYXJlIG9rIGZvciBwbmdzIGFuZCBqcGVnc1xuICAvLyB0byBjb250YWluIHRoZSBpbmZvcm1hdGlvbi5cbiAgdmFyIGhlYWRlckNodW5rID0gYmxvYi5zbGljZSgwLCAzMyk7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdmFyIGZpbGVSZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgIGZpbGVSZWFkZXIub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGRhdGFBcnJheSA9IG5ldyBVaW50OEFycmF5KGZpbGVSZWFkZXIucmVzdWx0KTtcbiAgICAgIHZhciB0YWlsID0gYmxvYi5zbGljZSgzMyk7XG4gICAgICB2YXIgY2hhbmdlZEFycmF5ID0gY2hhbmdlRHBpT25BcnJheShkYXRhQXJyYXksIGRwaSwgYmxvYi50eXBlKTtcbiAgICAgIHJlc29sdmUobmV3IEJsb2IoW2NoYW5nZWRBcnJheSwgdGFpbF0sIHsgdHlwZTogYmxvYi50eXBlIH0pKTtcbiAgICB9O1xuICAgIGZpbGVSZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoaGVhZGVyQ2h1bmspO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gY2hhbmdlRHBpRGF0YVVybChiYXNlNjRJbWFnZSwgZHBpKSB7XG4gIHZhciBkYXRhU3BsaXR0ZWQgPSBiYXNlNjRJbWFnZS5zcGxpdCgnLCcpO1xuICB2YXIgZm9ybWF0ID0gZGF0YVNwbGl0dGVkWzBdO1xuICB2YXIgYm9keSA9IGRhdGFTcGxpdHRlZFsxXTtcbiAgdmFyIHR5cGUgPSB2b2lkIDA7XG4gIHZhciBoZWFkZXJMZW5ndGggPSB2b2lkIDA7XG4gIHZhciBvdmVyd3JpdGVwSFlzID0gZmFsc2U7XG4gIGlmIChmb3JtYXQuaW5kZXhPZihQTkcpICE9PSAtMSkge1xuICAgIHR5cGUgPSBQTkc7XG4gICAgdmFyIGI2NEluZGV4ID0gZGV0ZWN0UGh5c0NodW5rRnJvbURhdGFVcmwoYm9keSk7XG4gICAgLy8gMjggYnl0ZXMgaW4gZGF0YVVybCBhcmUgMjFieXRlcywgbGVuZ3RoIG9mIHBoeXMgY2h1bmsgd2l0aCBldmVyeXRoaW5nIGluc2lkZS5cbiAgICBpZiAoYjY0SW5kZXggPj0gMCkge1xuICAgICAgaGVhZGVyTGVuZ3RoID0gTWF0aC5jZWlsKChiNjRJbmRleCArIDI4KSAvIDMpICogNDtcbiAgICAgIG92ZXJ3cml0ZXBIWXMgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBoZWFkZXJMZW5ndGggPSAzMyAvIDMgKiA0O1xuICAgIH1cbiAgfVxuICBpZiAoZm9ybWF0LmluZGV4T2YoSlBFRykgIT09IC0xKSB7XG4gICAgdHlwZSA9IEpQRUc7XG4gICAgaGVhZGVyTGVuZ3RoID0gMTggLyAzICogNDtcbiAgfVxuICAvLyAzMyBieXRlcyBhcmUgb2sgZm9yIHBuZ3MgYW5kIGpwZWdzXG4gIC8vIHRvIGNvbnRhaW4gdGhlIGluZm9ybWF0aW9uLlxuICB2YXIgc3RyaW5nSGVhZGVyID0gYm9keS5zdWJzdHJpbmcoMCwgaGVhZGVyTGVuZ3RoKTtcbiAgdmFyIHJlc3RPZkRhdGEgPSBib2R5LnN1YnN0cmluZyhoZWFkZXJMZW5ndGgpO1xuICB2YXIgaGVhZGVyQnl0ZXMgPSBhdG9iKHN0cmluZ0hlYWRlcik7XG4gIHZhciBkYXRhQXJyYXkgPSBuZXcgVWludDhBcnJheShoZWFkZXJCeXRlcy5sZW5ndGgpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGFBcnJheS5sZW5ndGg7IGkrKykge1xuICAgIGRhdGFBcnJheVtpXSA9IGhlYWRlckJ5dGVzLmNoYXJDb2RlQXQoaSk7XG4gIH1cbiAgdmFyIGZpbmFsQXJyYXkgPSBjaGFuZ2VEcGlPbkFycmF5KGRhdGFBcnJheSwgZHBpLCB0eXBlLCBvdmVyd3JpdGVwSFlzKTtcbiAgdmFyIGJhc2U2NEhlYWRlciA9IGJ0b2EoU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShTdHJpbmcsIF90b0NvbnN1bWFibGVBcnJheShmaW5hbEFycmF5KSkpO1xuICByZXR1cm4gW2Zvcm1hdCwgJywnLCBiYXNlNjRIZWFkZXIsIHJlc3RPZkRhdGFdLmpvaW4oJycpO1xufVxuXG5mdW5jdGlvbiBkZXRlY3RQaHlzQ2h1bmtGcm9tRGF0YVVybChkYXRhKSB7XG4gIHZhciBiNjRpbmRleCA9IGRhdGEuaW5kZXhPZihiNjRQaHlzU2lnbmF0dXJlMSk7XG4gIGlmIChiNjRpbmRleCA9PT0gLTEpIHtcbiAgICBiNjRpbmRleCA9IGRhdGEuaW5kZXhPZihiNjRQaHlzU2lnbmF0dXJlMik7XG4gIH1cbiAgaWYgKGI2NGluZGV4ID09PSAtMSkge1xuICAgIGI2NGluZGV4ID0gZGF0YS5pbmRleE9mKGI2NFBoeXNTaWduYXR1cmUzKTtcbiAgfVxuICAvLyBpZiBiNjRpbmRleCA9PT0gLTEgY2h1bmsgaXMgbm90IGZvdW5kXG4gIHJldHVybiBiNjRpbmRleDtcbn1cblxuZnVuY3Rpb24gc2VhcmNoU3RhcnRPZlBoeXMoZGF0YSkge1xuICB2YXIgbGVuZ3RoID0gZGF0YS5sZW5ndGggLSAxO1xuICAvLyB3ZSBjaGVjayBmcm9tIHRoZSBlbmQgc2luY2Ugd2UgY3V0IHRoZSBzdHJpbmcgaW4gcHJveGltaXR5IG9mIHRoZSBoZWFkZXJcbiAgLy8gdGhlIGhlYWRlciBpcyB3aXRoaW4gMjEgYnl0ZXMgZnJvbSB0aGUgZW5kLlxuICBmb3IgKHZhciBpID0gbGVuZ3RoOyBpID49IDQ7IGktLSkge1xuICAgIGlmIChkYXRhW2kgLSA0XSA9PT0gOSAmJiBkYXRhW2kgLSAzXSA9PT0gX1AgJiYgZGF0YVtpIC0gMl0gPT09IF9IICYmIGRhdGFbaSAtIDFdID09PSBfWSAmJiBkYXRhW2ldID09PSBfUykge1xuICAgICAgcmV0dXJuIGkgLSAzO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBjaGFuZ2VEcGlPbkFycmF5KGRhdGFBcnJheSwgZHBpLCBmb3JtYXQsIG92ZXJ3cml0ZXBIWXMpIHtcbiAgaWYgKGZvcm1hdCA9PT0gSlBFRykge1xuICAgIGRhdGFBcnJheVsxM10gPSAxOyAvLyAxIHBpeGVsIHBlciBpbmNoIG9yIDIgcGl4ZWwgcGVyIGNtXG4gICAgZGF0YUFycmF5WzE0XSA9IGRwaSA+PiA4OyAvLyBkcGlYIGhpZ2ggYnl0ZVxuICAgIGRhdGFBcnJheVsxNV0gPSBkcGkgJiAweGZmOyAvLyBkcGlYIGxvdyBieXRlXG4gICAgZGF0YUFycmF5WzE2XSA9IGRwaSA+PiA4OyAvLyBkcGlZIGhpZ2ggYnl0ZVxuICAgIGRhdGFBcnJheVsxN10gPSBkcGkgJiAweGZmOyAvLyBkcGlZIGxvdyBieXRlXG4gICAgcmV0dXJuIGRhdGFBcnJheTtcbiAgfVxuICBpZiAoZm9ybWF0ID09PSBQTkcpIHtcbiAgICB2YXIgcGh5c0NodW5rID0gbmV3IFVpbnQ4QXJyYXkoMTMpO1xuICAgIC8vIGNodW5rIGhlYWRlciBwSFlzXG4gICAgLy8gOSBieXRlcyBvZiBkYXRhXG4gICAgLy8gNCBieXRlcyBvZiBjcmNcbiAgICAvLyB0aGlzIG11bHRpcGxpY2F0aW9uIGlzIGJlY2F1c2UgdGhlIHN0YW5kYXJkIGlzIGRwaSBwZXIgbWV0ZXIuXG4gICAgZHBpICo9IDM5LjM3MDE7XG4gICAgcGh5c0NodW5rWzBdID0gX1A7XG4gICAgcGh5c0NodW5rWzFdID0gX0g7XG4gICAgcGh5c0NodW5rWzJdID0gX1k7XG4gICAgcGh5c0NodW5rWzNdID0gX1M7XG4gICAgcGh5c0NodW5rWzRdID0gZHBpID4+PiAyNDsgLy8gZHBpWCBoaWdoZXN0IGJ5dGVcbiAgICBwaHlzQ2h1bmtbNV0gPSBkcGkgPj4+IDE2OyAvLyBkcGlYIHZlcnloaWdoIGJ5dGVcbiAgICBwaHlzQ2h1bmtbNl0gPSBkcGkgPj4+IDg7IC8vIGRwaVggaGlnaCBieXRlXG4gICAgcGh5c0NodW5rWzddID0gZHBpICYgMHhmZjsgLy8gZHBpWCBsb3cgYnl0ZVxuICAgIHBoeXNDaHVua1s4XSA9IHBoeXNDaHVua1s0XTsgLy8gZHBpWSBoaWdoZXN0IGJ5dGVcbiAgICBwaHlzQ2h1bmtbOV0gPSBwaHlzQ2h1bmtbNV07IC8vIGRwaVkgdmVyeWhpZ2ggYnl0ZVxuICAgIHBoeXNDaHVua1sxMF0gPSBwaHlzQ2h1bmtbNl07IC8vIGRwaVkgaGlnaCBieXRlXG4gICAgcGh5c0NodW5rWzExXSA9IHBoeXNDaHVua1s3XTsgLy8gZHBpWSBsb3cgYnl0ZVxuICAgIHBoeXNDaHVua1sxMl0gPSAxOyAvLyBkb3QgcGVyIG1ldGVyLi4uLlxuXG4gICAgdmFyIGNyYyA9IGNhbGNDcmMocGh5c0NodW5rKTtcblxuICAgIHZhciBjcmNDaHVuayA9IG5ldyBVaW50OEFycmF5KDQpO1xuICAgIGNyY0NodW5rWzBdID0gY3JjID4+PiAyNDtcbiAgICBjcmNDaHVua1sxXSA9IGNyYyA+Pj4gMTY7XG4gICAgY3JjQ2h1bmtbMl0gPSBjcmMgPj4+IDg7XG4gICAgY3JjQ2h1bmtbM10gPSBjcmMgJiAweGZmO1xuXG4gICAgaWYgKG92ZXJ3cml0ZXBIWXMpIHtcbiAgICAgIHZhciBzdGFydGluZ0luZGV4ID0gc2VhcmNoU3RhcnRPZlBoeXMoZGF0YUFycmF5KTtcbiAgICAgIGRhdGFBcnJheS5zZXQocGh5c0NodW5rLCBzdGFydGluZ0luZGV4KTtcbiAgICAgIGRhdGFBcnJheS5zZXQoY3JjQ2h1bmssIHN0YXJ0aW5nSW5kZXggKyAxMyk7XG4gICAgICByZXR1cm4gZGF0YUFycmF5O1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBpIG5lZWQgdG8gZ2l2ZSBiYWNrIGFuIGFycmF5IG9mIGRhdGEgdGhhdCBpcyBkaXZpc2libGUgYnkgMyBzbyB0aGF0XG4gICAgICAvLyBkYXRhdXJsIGVuY29kaW5nIGdpdmVzIG1lIGludGVnZXJzLCBmb3IgbHVjayB0aGlzIGNodW5rIGlzIDE3ICsgNCA9IDIxXG4gICAgICAvLyBpZiBpdCB3YXMgd2UgY291bGQgYWRkIGEgdGV4dCBjaHVuayBjb250YW5pbmcgc29tZSBpbmZvLCB1bnRpbGwgZGVzaXJlZFxuICAgICAgLy8gbGVuZ3RoIGlzIG1ldC5cblxuICAgICAgLy8gY2h1bmsgc3RydWN0dXIgNCBieXRlcyBmb3IgbGVuZ3RoIGlzIDlcbiAgICAgIHZhciBjaHVua0xlbmd0aCA9IG5ldyBVaW50OEFycmF5KDQpO1xuICAgICAgY2h1bmtMZW5ndGhbMF0gPSAwO1xuICAgICAgY2h1bmtMZW5ndGhbMV0gPSAwO1xuICAgICAgY2h1bmtMZW5ndGhbMl0gPSAwO1xuICAgICAgY2h1bmtMZW5ndGhbM10gPSA5O1xuXG4gICAgICB2YXIgZmluYWxIZWFkZXIgPSBuZXcgVWludDhBcnJheSg1NCk7XG4gICAgICBmaW5hbEhlYWRlci5zZXQoZGF0YUFycmF5LCAwKTtcbiAgICAgIGZpbmFsSGVhZGVyLnNldChjaHVua0xlbmd0aCwgMzMpO1xuICAgICAgZmluYWxIZWFkZXIuc2V0KHBoeXNDaHVuaywgMzcpO1xuICAgICAgZmluYWxIZWFkZXIuc2V0KGNyY0NodW5rLCA1MCk7XG4gICAgICByZXR1cm4gZmluYWxIZWFkZXI7XG4gICAgfVxuICB9XG59IiwiKGZ1bmN0aW9uKGEsYil7aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kKWRlZmluZShbXSxiKTtlbHNlIGlmKFwidW5kZWZpbmVkXCIhPXR5cGVvZiBleHBvcnRzKWIoKTtlbHNle2IoKSxhLkZpbGVTYXZlcj17ZXhwb3J0czp7fX0uZXhwb3J0c319KSh0aGlzLGZ1bmN0aW9uKCl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gYihhLGIpe3JldHVyblwidW5kZWZpbmVkXCI9PXR5cGVvZiBiP2I9e2F1dG9Cb206ITF9Olwib2JqZWN0XCIhPXR5cGVvZiBiJiYoY29uc29sZS53YXJuKFwiRGVwcmVjYXRlZDogRXhwZWN0ZWQgdGhpcmQgYXJndW1lbnQgdG8gYmUgYSBvYmplY3RcIiksYj17YXV0b0JvbTohYn0pLGIuYXV0b0JvbSYmL15cXHMqKD86dGV4dFxcL1xcUyp8YXBwbGljYXRpb25cXC94bWx8XFxTKlxcL1xcUypcXCt4bWwpXFxzKjsuKmNoYXJzZXRcXHMqPVxccyp1dGYtOC9pLnRlc3QoYS50eXBlKT9uZXcgQmxvYihbXCJcXHVGRUZGXCIsYV0se3R5cGU6YS50eXBlfSk6YX1mdW5jdGlvbiBjKGEsYixjKXt2YXIgZD1uZXcgWE1MSHR0cFJlcXVlc3Q7ZC5vcGVuKFwiR0VUXCIsYSksZC5yZXNwb25zZVR5cGU9XCJibG9iXCIsZC5vbmxvYWQ9ZnVuY3Rpb24oKXtnKGQucmVzcG9uc2UsYixjKX0sZC5vbmVycm9yPWZ1bmN0aW9uKCl7Y29uc29sZS5lcnJvcihcImNvdWxkIG5vdCBkb3dubG9hZCBmaWxlXCIpfSxkLnNlbmQoKX1mdW5jdGlvbiBkKGEpe3ZhciBiPW5ldyBYTUxIdHRwUmVxdWVzdDtiLm9wZW4oXCJIRUFEXCIsYSwhMSk7dHJ5e2Iuc2VuZCgpfWNhdGNoKGEpe31yZXR1cm4gMjAwPD1iLnN0YXR1cyYmMjk5Pj1iLnN0YXR1c31mdW5jdGlvbiBlKGEpe3RyeXthLmRpc3BhdGNoRXZlbnQobmV3IE1vdXNlRXZlbnQoXCJjbGlja1wiKSl9Y2F0Y2goYyl7dmFyIGI9ZG9jdW1lbnQuY3JlYXRlRXZlbnQoXCJNb3VzZUV2ZW50c1wiKTtiLmluaXRNb3VzZUV2ZW50KFwiY2xpY2tcIiwhMCwhMCx3aW5kb3csMCwwLDAsODAsMjAsITEsITEsITEsITEsMCxudWxsKSxhLmRpc3BhdGNoRXZlbnQoYil9fXZhciBmPVwib2JqZWN0XCI9PXR5cGVvZiB3aW5kb3cmJndpbmRvdy53aW5kb3c9PT13aW5kb3c/d2luZG93Olwib2JqZWN0XCI9PXR5cGVvZiBzZWxmJiZzZWxmLnNlbGY9PT1zZWxmP3NlbGY6XCJvYmplY3RcIj09dHlwZW9mIGdsb2JhbCYmZ2xvYmFsLmdsb2JhbD09PWdsb2JhbD9nbG9iYWw6dm9pZCAwLGE9Zi5uYXZpZ2F0b3ImJi9NYWNpbnRvc2gvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkmJi9BcHBsZVdlYktpdC8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSYmIS9TYWZhcmkvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCksZz1mLnNhdmVBc3x8KFwib2JqZWN0XCIhPXR5cGVvZiB3aW5kb3d8fHdpbmRvdyE9PWY/ZnVuY3Rpb24oKXt9OlwiZG93bmxvYWRcImluIEhUTUxBbmNob3JFbGVtZW50LnByb3RvdHlwZSYmIWE/ZnVuY3Rpb24oYixnLGgpe3ZhciBpPWYuVVJMfHxmLndlYmtpdFVSTCxqPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO2c9Z3x8Yi5uYW1lfHxcImRvd25sb2FkXCIsai5kb3dubG9hZD1nLGoucmVsPVwibm9vcGVuZXJcIixcInN0cmluZ1wiPT10eXBlb2YgYj8oai5ocmVmPWIsai5vcmlnaW49PT1sb2NhdGlvbi5vcmlnaW4/ZShqKTpkKGouaHJlZik/YyhiLGcsaCk6ZShqLGoudGFyZ2V0PVwiX2JsYW5rXCIpKTooai5ocmVmPWkuY3JlYXRlT2JqZWN0VVJMKGIpLHNldFRpbWVvdXQoZnVuY3Rpb24oKXtpLnJldm9rZU9iamVjdFVSTChqLmhyZWYpfSw0RTQpLHNldFRpbWVvdXQoZnVuY3Rpb24oKXtlKGopfSwwKSl9OlwibXNTYXZlT3JPcGVuQmxvYlwiaW4gbmF2aWdhdG9yP2Z1bmN0aW9uKGYsZyxoKXtpZihnPWd8fGYubmFtZXx8XCJkb3dubG9hZFwiLFwic3RyaW5nXCIhPXR5cGVvZiBmKW5hdmlnYXRvci5tc1NhdmVPck9wZW5CbG9iKGIoZixoKSxnKTtlbHNlIGlmKGQoZikpYyhmLGcsaCk7ZWxzZXt2YXIgaT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtpLmhyZWY9ZixpLnRhcmdldD1cIl9ibGFua1wiLHNldFRpbWVvdXQoZnVuY3Rpb24oKXtlKGkpfSl9fTpmdW5jdGlvbihiLGQsZSxnKXtpZihnPWd8fG9wZW4oXCJcIixcIl9ibGFua1wiKSxnJiYoZy5kb2N1bWVudC50aXRsZT1nLmRvY3VtZW50LmJvZHkuaW5uZXJUZXh0PVwiZG93bmxvYWRpbmcuLi5cIiksXCJzdHJpbmdcIj09dHlwZW9mIGIpcmV0dXJuIGMoYixkLGUpO3ZhciBoPVwiYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtXCI9PT1iLnR5cGUsaT0vY29uc3RydWN0b3IvaS50ZXN0KGYuSFRNTEVsZW1lbnQpfHxmLnNhZmFyaSxqPS9DcmlPU1xcL1tcXGRdKy8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtpZigoanx8aCYmaXx8YSkmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBGaWxlUmVhZGVyKXt2YXIgaz1uZXcgRmlsZVJlYWRlcjtrLm9ubG9hZGVuZD1mdW5jdGlvbigpe3ZhciBhPWsucmVzdWx0O2E9aj9hOmEucmVwbGFjZSgvXmRhdGE6W147XSo7LyxcImRhdGE6YXR0YWNobWVudC9maWxlO1wiKSxnP2cubG9jYXRpb24uaHJlZj1hOmxvY2F0aW9uPWEsZz1udWxsfSxrLnJlYWRBc0RhdGFVUkwoYil9ZWxzZXt2YXIgbD1mLlVSTHx8Zi53ZWJraXRVUkwsbT1sLmNyZWF0ZU9iamVjdFVSTChiKTtnP2cubG9jYXRpb249bTpsb2NhdGlvbi5ocmVmPW0sZz1udWxsLHNldFRpbWVvdXQoZnVuY3Rpb24oKXtsLnJldm9rZU9iamVjdFVSTChtKX0sNEU0KX19KTtmLnNhdmVBcz1nLnNhdmVBcz1nLFwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGUmJihtb2R1bGUuZXhwb3J0cz1nKX0pO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1GaWxlU2F2ZXIubWluLmpzLm1hcCIsImltcG9ydCBoYXNoQ2xlYXIgZnJvbSAnLi9faGFzaENsZWFyLmpzJztcbmltcG9ydCBoYXNoRGVsZXRlIGZyb20gJy4vX2hhc2hEZWxldGUuanMnO1xuaW1wb3J0IGhhc2hHZXQgZnJvbSAnLi9faGFzaEdldC5qcyc7XG5pbXBvcnQgaGFzaEhhcyBmcm9tICcuL19oYXNoSGFzLmpzJztcbmltcG9ydCBoYXNoU2V0IGZyb20gJy4vX2hhc2hTZXQuanMnO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBoYXNoIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gSGFzaChlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBIYXNoYC5cbkhhc2gucHJvdG90eXBlLmNsZWFyID0gaGFzaENsZWFyO1xuSGFzaC5wcm90b3R5cGVbJ2RlbGV0ZSddID0gaGFzaERlbGV0ZTtcbkhhc2gucHJvdG90eXBlLmdldCA9IGhhc2hHZXQ7XG5IYXNoLnByb3RvdHlwZS5oYXMgPSBoYXNoSGFzO1xuSGFzaC5wcm90b3R5cGUuc2V0ID0gaGFzaFNldDtcblxuZXhwb3J0IGRlZmF1bHQgSGFzaDtcbiIsImltcG9ydCBsaXN0Q2FjaGVDbGVhciBmcm9tICcuL19saXN0Q2FjaGVDbGVhci5qcyc7XG5pbXBvcnQgbGlzdENhY2hlRGVsZXRlIGZyb20gJy4vX2xpc3RDYWNoZURlbGV0ZS5qcyc7XG5pbXBvcnQgbGlzdENhY2hlR2V0IGZyb20gJy4vX2xpc3RDYWNoZUdldC5qcyc7XG5pbXBvcnQgbGlzdENhY2hlSGFzIGZyb20gJy4vX2xpc3RDYWNoZUhhcy5qcyc7XG5pbXBvcnQgbGlzdENhY2hlU2V0IGZyb20gJy4vX2xpc3RDYWNoZVNldC5qcyc7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBsaXN0IGNhY2hlIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gTGlzdENhY2hlKGVudHJpZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBlbnRyaWVzID09IG51bGwgPyAwIDogZW50cmllcy5sZW5ndGg7XG5cbiAgdGhpcy5jbGVhcigpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBlbnRyeSA9IGVudHJpZXNbaW5kZXhdO1xuICAgIHRoaXMuc2V0KGVudHJ5WzBdLCBlbnRyeVsxXSk7XG4gIH1cbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYExpc3RDYWNoZWAuXG5MaXN0Q2FjaGUucHJvdG90eXBlLmNsZWFyID0gbGlzdENhY2hlQ2xlYXI7XG5MaXN0Q2FjaGUucHJvdG90eXBlWydkZWxldGUnXSA9IGxpc3RDYWNoZURlbGV0ZTtcbkxpc3RDYWNoZS5wcm90b3R5cGUuZ2V0ID0gbGlzdENhY2hlR2V0O1xuTGlzdENhY2hlLnByb3RvdHlwZS5oYXMgPSBsaXN0Q2FjaGVIYXM7XG5MaXN0Q2FjaGUucHJvdG90eXBlLnNldCA9IGxpc3RDYWNoZVNldDtcblxuZXhwb3J0IGRlZmF1bHQgTGlzdENhY2hlO1xuIiwiaW1wb3J0IGdldE5hdGl2ZSBmcm9tICcuL19nZXROYXRpdmUuanMnO1xuaW1wb3J0IHJvb3QgZnJvbSAnLi9fcm9vdC5qcyc7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBNYXAgPSBnZXROYXRpdmUocm9vdCwgJ01hcCcpO1xuXG5leHBvcnQgZGVmYXVsdCBNYXA7XG4iLCJpbXBvcnQgbWFwQ2FjaGVDbGVhciBmcm9tICcuL19tYXBDYWNoZUNsZWFyLmpzJztcbmltcG9ydCBtYXBDYWNoZURlbGV0ZSBmcm9tICcuL19tYXBDYWNoZURlbGV0ZS5qcyc7XG5pbXBvcnQgbWFwQ2FjaGVHZXQgZnJvbSAnLi9fbWFwQ2FjaGVHZXQuanMnO1xuaW1wb3J0IG1hcENhY2hlSGFzIGZyb20gJy4vX21hcENhY2hlSGFzLmpzJztcbmltcG9ydCBtYXBDYWNoZVNldCBmcm9tICcuL19tYXBDYWNoZVNldC5qcyc7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG1hcCBjYWNoZSBvYmplY3QgdG8gc3RvcmUga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBNYXBDYWNoZShlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBNYXBDYWNoZWAuXG5NYXBDYWNoZS5wcm90b3R5cGUuY2xlYXIgPSBtYXBDYWNoZUNsZWFyO1xuTWFwQ2FjaGUucHJvdG90eXBlWydkZWxldGUnXSA9IG1hcENhY2hlRGVsZXRlO1xuTWFwQ2FjaGUucHJvdG90eXBlLmdldCA9IG1hcENhY2hlR2V0O1xuTWFwQ2FjaGUucHJvdG90eXBlLmhhcyA9IG1hcENhY2hlSGFzO1xuTWFwQ2FjaGUucHJvdG90eXBlLnNldCA9IG1hcENhY2hlU2V0O1xuXG5leHBvcnQgZGVmYXVsdCBNYXBDYWNoZTtcbiIsImltcG9ydCByb290IGZyb20gJy4vX3Jvb3QuanMnO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBTeW1ib2wgPSByb290LlN5bWJvbDtcblxuZXhwb3J0IGRlZmF1bHQgU3ltYm9sO1xuIiwiaW1wb3J0IGVxIGZyb20gJy4vZXEuanMnO1xuXG4vKipcbiAqIEdldHMgdGhlIGluZGV4IGF0IHdoaWNoIHRoZSBga2V5YCBpcyBmb3VuZCBpbiBgYXJyYXlgIG9mIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0geyp9IGtleSBUaGUga2V5IHRvIHNlYXJjaCBmb3IuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSwgZWxzZSBgLTFgLlxuICovXG5mdW5jdGlvbiBhc3NvY0luZGV4T2YoYXJyYXksIGtleSkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICBpZiAoZXEoYXJyYXlbbGVuZ3RoXVswXSwga2V5KSkge1xuICAgICAgcmV0dXJuIGxlbmd0aDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIC0xO1xufVxuXG5leHBvcnQgZGVmYXVsdCBhc3NvY0luZGV4T2Y7XG4iLCJpbXBvcnQgU3ltYm9sIGZyb20gJy4vX1N5bWJvbC5qcyc7XG5pbXBvcnQgZ2V0UmF3VGFnIGZyb20gJy4vX2dldFJhd1RhZy5qcyc7XG5pbXBvcnQgb2JqZWN0VG9TdHJpbmcgZnJvbSAnLi9fb2JqZWN0VG9TdHJpbmcuanMnO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgbnVsbFRhZyA9ICdbb2JqZWN0IE51bGxdJyxcbiAgICB1bmRlZmluZWRUYWcgPSAnW29iamVjdCBVbmRlZmluZWRdJztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3ltVG9TdHJpbmdUYWcgPSBTeW1ib2wgPyBTeW1ib2wudG9TdHJpbmdUYWcgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGdldFRhZ2Agd2l0aG91dCBmYWxsYmFja3MgZm9yIGJ1Z2d5IGVudmlyb25tZW50cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBgdG9TdHJpbmdUYWdgLlxuICovXG5mdW5jdGlvbiBiYXNlR2V0VGFnKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQgPyB1bmRlZmluZWRUYWcgOiBudWxsVGFnO1xuICB9XG4gIHJldHVybiAoc3ltVG9TdHJpbmdUYWcgJiYgc3ltVG9TdHJpbmdUYWcgaW4gT2JqZWN0KHZhbHVlKSlcbiAgICA/IGdldFJhd1RhZyh2YWx1ZSlcbiAgICA6IG9iamVjdFRvU3RyaW5nKHZhbHVlKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYmFzZUdldFRhZztcbiIsImltcG9ydCBiYXNlR2V0VGFnIGZyb20gJy4vX2Jhc2VHZXRUYWcuanMnO1xuaW1wb3J0IGlzT2JqZWN0TGlrZSBmcm9tICcuL2lzT2JqZWN0TGlrZS5qcyc7XG5cbnZhciBhcnJheUJ1ZmZlclRhZyA9ICdbb2JqZWN0IEFycmF5QnVmZmVyXSc7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNBcnJheUJ1ZmZlcmAgd2l0aG91dCBOb2RlLmpzIG9wdGltaXphdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYXJyYXkgYnVmZmVyLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc0FycmF5QnVmZmVyKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGJhc2VHZXRUYWcodmFsdWUpID09IGFycmF5QnVmZmVyVGFnO1xufVxuXG5leHBvcnQgZGVmYXVsdCBiYXNlSXNBcnJheUJ1ZmZlcjtcbiIsImltcG9ydCBpc0Z1bmN0aW9uIGZyb20gJy4vaXNGdW5jdGlvbi5qcyc7XG5pbXBvcnQgaXNNYXNrZWQgZnJvbSAnLi9faXNNYXNrZWQuanMnO1xuaW1wb3J0IGlzT2JqZWN0IGZyb20gJy4vaXNPYmplY3QuanMnO1xuaW1wb3J0IHRvU291cmNlIGZyb20gJy4vX3RvU291cmNlLmpzJztcblxuLyoqXG4gKiBVc2VkIHRvIG1hdGNoIGBSZWdFeHBgXG4gKiBbc3ludGF4IGNoYXJhY3RlcnNdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXBhdHRlcm5zKS5cbiAqL1xudmFyIHJlUmVnRXhwQ2hhciA9IC9bXFxcXF4kLiorPygpW1xcXXt9fF0vZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGhvc3QgY29uc3RydWN0b3JzIChTYWZhcmkpLiAqL1xudmFyIHJlSXNIb3N0Q3RvciA9IC9eXFxbb2JqZWN0IC4rP0NvbnN0cnVjdG9yXFxdJC87XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBmdW5jUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGUsXG4gICAgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byByZXNvbHZlIHRoZSBkZWNvbXBpbGVkIHNvdXJjZSBvZiBmdW5jdGlvbnMuICovXG52YXIgZnVuY1RvU3RyaW5nID0gZnVuY1Byb3RvLnRvU3RyaW5nO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaWYgYSBtZXRob2QgaXMgbmF0aXZlLiAqL1xudmFyIHJlSXNOYXRpdmUgPSBSZWdFeHAoJ14nICtcbiAgZnVuY1RvU3RyaW5nLmNhbGwoaGFzT3duUHJvcGVydHkpLnJlcGxhY2UocmVSZWdFeHBDaGFyLCAnXFxcXCQmJylcbiAgLnJlcGxhY2UoL2hhc093blByb3BlcnR5fChmdW5jdGlvbikuKj8oPz1cXFxcXFwoKXwgZm9yIC4rPyg/PVxcXFxcXF0pL2csICckMS4qPycpICsgJyQnXG4pO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzTmF0aXZlYCB3aXRob3V0IGJhZCBzaGltIGNoZWNrcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIG5hdGl2ZSBmdW5jdGlvbixcbiAqICBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc05hdGl2ZSh2YWx1ZSkge1xuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSB8fCBpc01hc2tlZCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHBhdHRlcm4gPSBpc0Z1bmN0aW9uKHZhbHVlKSA/IHJlSXNOYXRpdmUgOiByZUlzSG9zdEN0b3I7XG4gIHJldHVybiBwYXR0ZXJuLnRlc3QodG9Tb3VyY2UodmFsdWUpKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYmFzZUlzTmF0aXZlO1xuIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy51bmFyeWAgd2l0aG91dCBzdXBwb3J0IGZvciBzdG9yaW5nIG1ldGFkYXRhLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjYXAgYXJndW1lbnRzIGZvci5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGNhcHBlZCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVVuYXJ5KGZ1bmMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIGZ1bmModmFsdWUpO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBiYXNlVW5hcnk7XG4iLCJpbXBvcnQgcm9vdCBmcm9tICcuL19yb290LmpzJztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG92ZXJyZWFjaGluZyBjb3JlLWpzIHNoaW1zLiAqL1xudmFyIGNvcmVKc0RhdGEgPSByb290WydfX2NvcmUtanNfc2hhcmVkX18nXTtcblxuZXhwb3J0IGRlZmF1bHQgY29yZUpzRGF0YTtcbiIsIi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZUdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsICYmIGdsb2JhbC5PYmplY3QgPT09IE9iamVjdCAmJiBnbG9iYWw7XG5cbmV4cG9ydCBkZWZhdWx0IGZyZWVHbG9iYWw7XG4iLCJpbXBvcnQgaXNLZXlhYmxlIGZyb20gJy4vX2lzS2V5YWJsZS5qcyc7XG5cbi8qKlxuICogR2V0cyB0aGUgZGF0YSBmb3IgYG1hcGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBtYXAgVGhlIG1hcCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIHJlZmVyZW5jZSBrZXkuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgbWFwIGRhdGEuXG4gKi9cbmZ1bmN0aW9uIGdldE1hcERhdGEobWFwLCBrZXkpIHtcbiAgdmFyIGRhdGEgPSBtYXAuX19kYXRhX187XG4gIHJldHVybiBpc0tleWFibGUoa2V5KVxuICAgID8gZGF0YVt0eXBlb2Yga2V5ID09ICdzdHJpbmcnID8gJ3N0cmluZycgOiAnaGFzaCddXG4gICAgOiBkYXRhLm1hcDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0TWFwRGF0YTtcbiIsImltcG9ydCBiYXNlSXNOYXRpdmUgZnJvbSAnLi9fYmFzZUlzTmF0aXZlLmpzJztcbmltcG9ydCBnZXRWYWx1ZSBmcm9tICcuL19nZXRWYWx1ZS5qcyc7XG5cbi8qKlxuICogR2V0cyB0aGUgbmF0aXZlIGZ1bmN0aW9uIGF0IGBrZXlgIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIG1ldGhvZCB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZnVuY3Rpb24gaWYgaXQncyBuYXRpdmUsIGVsc2UgYHVuZGVmaW5lZGAuXG4gKi9cbmZ1bmN0aW9uIGdldE5hdGl2ZShvYmplY3QsIGtleSkge1xuICB2YXIgdmFsdWUgPSBnZXRWYWx1ZShvYmplY3QsIGtleSk7XG4gIHJldHVybiBiYXNlSXNOYXRpdmUodmFsdWUpID8gdmFsdWUgOiB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldE5hdGl2ZTtcbiIsImltcG9ydCBTeW1ib2wgZnJvbSAnLi9fU3ltYm9sLmpzJztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG5hdGl2ZU9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHN5bVRvU3RyaW5nVGFnID0gU3ltYm9sID8gU3ltYm9sLnRvU3RyaW5nVGFnIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUdldFRhZ2Agd2hpY2ggaWdub3JlcyBgU3ltYm9sLnRvU3RyaW5nVGFnYCB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgcmF3IGB0b1N0cmluZ1RhZ2AuXG4gKi9cbmZ1bmN0aW9uIGdldFJhd1RhZyh2YWx1ZSkge1xuICB2YXIgaXNPd24gPSBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBzeW1Ub1N0cmluZ1RhZyksXG4gICAgICB0YWcgPSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG5cbiAgdHJ5IHtcbiAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB1bmRlZmluZWQ7XG4gICAgdmFyIHVubWFza2VkID0gdHJ1ZTtcbiAgfSBjYXRjaCAoZSkge31cblxuICB2YXIgcmVzdWx0ID0gbmF0aXZlT2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIGlmICh1bm1hc2tlZCkge1xuICAgIGlmIChpc093bikge1xuICAgICAgdmFsdWVbc3ltVG9TdHJpbmdUYWddID0gdGFnO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgdmFsdWVbc3ltVG9TdHJpbmdUYWddO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBnZXRSYXdUYWc7XG4iLCIvKipcbiAqIEdldHMgdGhlIHZhbHVlIGF0IGBrZXlgIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHByb3BlcnR5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBnZXRWYWx1ZShvYmplY3QsIGtleSkge1xuICByZXR1cm4gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBvYmplY3Rba2V5XTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0VmFsdWU7XG4iLCJpbXBvcnQgbmF0aXZlQ3JlYXRlIGZyb20gJy4vX25hdGl2ZUNyZWF0ZS5qcyc7XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgaGFzaC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKi9cbmZ1bmN0aW9uIGhhc2hDbGVhcigpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IG5hdGl2ZUNyZWF0ZSA/IG5hdGl2ZUNyZWF0ZShudWxsKSA6IHt9O1xuICB0aGlzLnNpemUgPSAwO1xufVxuXG5leHBvcnQgZGVmYXVsdCBoYXNoQ2xlYXI7XG4iLCIvKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBoYXNoLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge09iamVjdH0gaGFzaCBUaGUgaGFzaCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaGFzaERlbGV0ZShrZXkpIHtcbiAgdmFyIHJlc3VsdCA9IHRoaXMuaGFzKGtleSkgJiYgZGVsZXRlIHRoaXMuX19kYXRhX19ba2V5XTtcbiAgdGhpcy5zaXplIC09IHJlc3VsdCA/IDEgOiAwO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBoYXNoRGVsZXRlO1xuIiwiaW1wb3J0IG5hdGl2ZUNyZWF0ZSBmcm9tICcuL19uYXRpdmVDcmVhdGUuanMnO1xuXG4vKiogVXNlZCB0byBzdGFuZC1pbiBmb3IgYHVuZGVmaW5lZGAgaGFzaCB2YWx1ZXMuICovXG52YXIgSEFTSF9VTkRFRklORUQgPSAnX19sb2Rhc2hfaGFzaF91bmRlZmluZWRfXyc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogR2V0cyB0aGUgaGFzaCB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBoYXNoR2V0KGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIGlmIChuYXRpdmVDcmVhdGUpIHtcbiAgICB2YXIgcmVzdWx0ID0gZGF0YVtrZXldO1xuICAgIHJldHVybiByZXN1bHQgPT09IEhBU0hfVU5ERUZJTkVEID8gdW5kZWZpbmVkIDogcmVzdWx0O1xuICB9XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGRhdGEsIGtleSkgPyBkYXRhW2tleV0gOiB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGhhc2hHZXQ7XG4iLCJpbXBvcnQgbmF0aXZlQ3JlYXRlIGZyb20gJy4vX25hdGl2ZUNyZWF0ZS5qcyc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgaGFzaCB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaGFzaEhhcyhrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICByZXR1cm4gbmF0aXZlQ3JlYXRlID8gKGRhdGFba2V5XSAhPT0gdW5kZWZpbmVkKSA6IGhhc093blByb3BlcnR5LmNhbGwoZGF0YSwga2V5KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaGFzaEhhcztcbiIsImltcG9ydCBuYXRpdmVDcmVhdGUgZnJvbSAnLi9fbmF0aXZlQ3JlYXRlLmpzJztcblxuLyoqIFVzZWQgdG8gc3RhbmQtaW4gZm9yIGB1bmRlZmluZWRgIGhhc2ggdmFsdWVzLiAqL1xudmFyIEhBU0hfVU5ERUZJTkVEID0gJ19fbG9kYXNoX2hhc2hfdW5kZWZpbmVkX18nO1xuXG4vKipcbiAqIFNldHMgdGhlIGhhc2ggYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBoYXNoIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBoYXNoU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICB0aGlzLnNpemUgKz0gdGhpcy5oYXMoa2V5KSA/IDAgOiAxO1xuICBkYXRhW2tleV0gPSAobmF0aXZlQ3JlYXRlICYmIHZhbHVlID09PSB1bmRlZmluZWQpID8gSEFTSF9VTkRFRklORUQgOiB2YWx1ZTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGhhc2hTZXQ7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHN1aXRhYmxlIGZvciB1c2UgYXMgdW5pcXVlIG9iamVjdCBrZXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgc3VpdGFibGUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNLZXlhYmxlKHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gKHR5cGUgPT0gJ3N0cmluZycgfHwgdHlwZSA9PSAnbnVtYmVyJyB8fCB0eXBlID09ICdzeW1ib2wnIHx8IHR5cGUgPT0gJ2Jvb2xlYW4nKVxuICAgID8gKHZhbHVlICE9PSAnX19wcm90b19fJylcbiAgICA6ICh2YWx1ZSA9PT0gbnVsbCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGlzS2V5YWJsZTtcbiIsImltcG9ydCBjb3JlSnNEYXRhIGZyb20gJy4vX2NvcmVKc0RhdGEuanMnO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgbWV0aG9kcyBtYXNxdWVyYWRpbmcgYXMgbmF0aXZlLiAqL1xudmFyIG1hc2tTcmNLZXkgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciB1aWQgPSAvW14uXSskLy5leGVjKGNvcmVKc0RhdGEgJiYgY29yZUpzRGF0YS5rZXlzICYmIGNvcmVKc0RhdGEua2V5cy5JRV9QUk9UTyB8fCAnJyk7XG4gIHJldHVybiB1aWQgPyAoJ1N5bWJvbChzcmMpXzEuJyArIHVpZCkgOiAnJztcbn0oKSk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGBmdW5jYCBoYXMgaXRzIHNvdXJjZSBtYXNrZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBmdW5jYCBpcyBtYXNrZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNNYXNrZWQoZnVuYykge1xuICByZXR1cm4gISFtYXNrU3JjS2V5ICYmIChtYXNrU3JjS2V5IGluIGZ1bmMpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpc01hc2tlZDtcbiIsIi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgbGlzdCBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlQ2xlYXIoKSB7XG4gIHRoaXMuX19kYXRhX18gPSBbXTtcbiAgdGhpcy5zaXplID0gMDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbGlzdENhY2hlQ2xlYXI7XG4iLCJpbXBvcnQgYXNzb2NJbmRleE9mIGZyb20gJy4vX2Fzc29jSW5kZXhPZi5qcyc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBhcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzcGxpY2UgPSBhcnJheVByb3RvLnNwbGljZTtcblxuLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgbGlzdCBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlRGVsZXRlKGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIGlmIChpbmRleCA8IDApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIGxhc3RJbmRleCA9IGRhdGEubGVuZ3RoIC0gMTtcbiAgaWYgKGluZGV4ID09IGxhc3RJbmRleCkge1xuICAgIGRhdGEucG9wKCk7XG4gIH0gZWxzZSB7XG4gICAgc3BsaWNlLmNhbGwoZGF0YSwgaW5kZXgsIDEpO1xuICB9XG4gIC0tdGhpcy5zaXplO1xuICByZXR1cm4gdHJ1ZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbGlzdENhY2hlRGVsZXRlO1xuIiwiaW1wb3J0IGFzc29jSW5kZXhPZiBmcm9tICcuL19hc3NvY0luZGV4T2YuanMnO1xuXG4vKipcbiAqIEdldHMgdGhlIGxpc3QgY2FjaGUgdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVHZXQoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIGluZGV4ID0gYXNzb2NJbmRleE9mKGRhdGEsIGtleSk7XG5cbiAgcmV0dXJuIGluZGV4IDwgMCA/IHVuZGVmaW5lZCA6IGRhdGFbaW5kZXhdWzFdO1xufVxuXG5leHBvcnQgZGVmYXVsdCBsaXN0Q2FjaGVHZXQ7XG4iLCJpbXBvcnQgYXNzb2NJbmRleE9mIGZyb20gJy4vX2Fzc29jSW5kZXhPZi5qcyc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgbGlzdCBjYWNoZSB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVIYXMoa2V5KSB7XG4gIHJldHVybiBhc3NvY0luZGV4T2YodGhpcy5fX2RhdGFfXywga2V5KSA+IC0xO1xufVxuXG5leHBvcnQgZGVmYXVsdCBsaXN0Q2FjaGVIYXM7XG4iLCJpbXBvcnQgYXNzb2NJbmRleE9mIGZyb20gJy4vX2Fzc29jSW5kZXhPZi5qcyc7XG5cbi8qKlxuICogU2V0cyB0aGUgbGlzdCBjYWNoZSBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbGlzdCBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgaW5kZXggPSBhc3NvY0luZGV4T2YoZGF0YSwga2V5KTtcblxuICBpZiAoaW5kZXggPCAwKSB7XG4gICAgKyt0aGlzLnNpemU7XG4gICAgZGF0YS5wdXNoKFtrZXksIHZhbHVlXSk7XG4gIH0gZWxzZSB7XG4gICAgZGF0YVtpbmRleF1bMV0gPSB2YWx1ZTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn1cblxuZXhwb3J0IGRlZmF1bHQgbGlzdENhY2hlU2V0O1xuIiwiaW1wb3J0IEhhc2ggZnJvbSAnLi9fSGFzaC5qcyc7XG5pbXBvcnQgTGlzdENhY2hlIGZyb20gJy4vX0xpc3RDYWNoZS5qcyc7XG5pbXBvcnQgTWFwIGZyb20gJy4vX01hcC5qcyc7XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgbWFwLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlQ2xlYXIoKSB7XG4gIHRoaXMuc2l6ZSA9IDA7XG4gIHRoaXMuX19kYXRhX18gPSB7XG4gICAgJ2hhc2gnOiBuZXcgSGFzaCxcbiAgICAnbWFwJzogbmV3IChNYXAgfHwgTGlzdENhY2hlKSxcbiAgICAnc3RyaW5nJzogbmV3IEhhc2hcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbWFwQ2FjaGVDbGVhcjtcbiIsImltcG9ydCBnZXRNYXBEYXRhIGZyb20gJy4vX2dldE1hcERhdGEuanMnO1xuXG4vKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBtYXAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVEZWxldGUoa2V5KSB7XG4gIHZhciByZXN1bHQgPSBnZXRNYXBEYXRhKHRoaXMsIGtleSlbJ2RlbGV0ZSddKGtleSk7XG4gIHRoaXMuc2l6ZSAtPSByZXN1bHQgPyAxIDogMDtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbWFwQ2FjaGVEZWxldGU7XG4iLCJpbXBvcnQgZ2V0TWFwRGF0YSBmcm9tICcuL19nZXRNYXBEYXRhLmpzJztcblxuLyoqXG4gKiBHZXRzIHRoZSBtYXAgdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlR2V0KGtleSkge1xuICByZXR1cm4gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpLmdldChrZXkpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBtYXBDYWNoZUdldDtcbiIsImltcG9ydCBnZXRNYXBEYXRhIGZyb20gJy4vX2dldE1hcERhdGEuanMnO1xuXG4vKipcbiAqIENoZWNrcyBpZiBhIG1hcCB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlSGFzKGtleSkge1xuICByZXR1cm4gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpLmhhcyhrZXkpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBtYXBDYWNoZUhhcztcbiIsImltcG9ydCBnZXRNYXBEYXRhIGZyb20gJy4vX2dldE1hcERhdGEuanMnO1xuXG4vKipcbiAqIFNldHMgdGhlIG1hcCBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBtYXAgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSBnZXRNYXBEYXRhKHRoaXMsIGtleSksXG4gICAgICBzaXplID0gZGF0YS5zaXplO1xuXG4gIGRhdGEuc2V0KGtleSwgdmFsdWUpO1xuICB0aGlzLnNpemUgKz0gZGF0YS5zaXplID09IHNpemUgPyAwIDogMTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbmV4cG9ydCBkZWZhdWx0IG1hcENhY2hlU2V0O1xuIiwiaW1wb3J0IGdldE5hdGl2ZSBmcm9tICcuL19nZXROYXRpdmUuanMnO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgbmF0aXZlQ3JlYXRlID0gZ2V0TmF0aXZlKE9iamVjdCwgJ2NyZWF0ZScpO1xuXG5leHBvcnQgZGVmYXVsdCBuYXRpdmVDcmVhdGU7XG4iLCJpbXBvcnQgZnJlZUdsb2JhbCBmcm9tICcuL19mcmVlR2xvYmFsLmpzJztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYC4gKi9cbnZhciBmcmVlRXhwb3J0cyA9IHR5cGVvZiBleHBvcnRzID09ICdvYmplY3QnICYmIGV4cG9ydHMgJiYgIWV4cG9ydHMubm9kZVR5cGUgJiYgZXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBtb2R1bGVgLiAqL1xudmFyIGZyZWVNb2R1bGUgPSBmcmVlRXhwb3J0cyAmJiB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblxuLyoqIERldGVjdCB0aGUgcG9wdWxhciBDb21tb25KUyBleHRlbnNpb24gYG1vZHVsZS5leHBvcnRzYC4gKi9cbnZhciBtb2R1bGVFeHBvcnRzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLmV4cG9ydHMgPT09IGZyZWVFeHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHByb2Nlc3NgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlUHJvY2VzcyA9IG1vZHVsZUV4cG9ydHMgJiYgZnJlZUdsb2JhbC5wcm9jZXNzO1xuXG4vKiogVXNlZCB0byBhY2Nlc3MgZmFzdGVyIE5vZGUuanMgaGVscGVycy4gKi9cbnZhciBub2RlVXRpbCA9IChmdW5jdGlvbigpIHtcbiAgdHJ5IHtcbiAgICAvLyBVc2UgYHV0aWwudHlwZXNgIGZvciBOb2RlLmpzIDEwKy5cbiAgICB2YXIgdHlwZXMgPSBmcmVlTW9kdWxlICYmIGZyZWVNb2R1bGUucmVxdWlyZSAmJiBmcmVlTW9kdWxlLnJlcXVpcmUoJ3V0aWwnKS50eXBlcztcblxuICAgIGlmICh0eXBlcykge1xuICAgICAgcmV0dXJuIHR5cGVzO1xuICAgIH1cblxuICAgIC8vIExlZ2FjeSBgcHJvY2Vzcy5iaW5kaW5nKCd1dGlsJylgIGZvciBOb2RlLmpzIDwgMTAuXG4gICAgcmV0dXJuIGZyZWVQcm9jZXNzICYmIGZyZWVQcm9jZXNzLmJpbmRpbmcgJiYgZnJlZVByb2Nlc3MuYmluZGluZygndXRpbCcpO1xuICB9IGNhdGNoIChlKSB7fVxufSgpKTtcblxuZXhwb3J0IGRlZmF1bHQgbm9kZVV0aWw7XG4iLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgbmF0aXZlT2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nIHVzaW5nIGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgb2JqZWN0VG9TdHJpbmc7XG4iLCJpbXBvcnQgZnJlZUdsb2JhbCBmcm9tICcuL19mcmVlR2xvYmFsLmpzJztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBzZWxmYC4gKi9cbnZhciBmcmVlU2VsZiA9IHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYgJiYgc2VsZi5PYmplY3QgPT09IE9iamVjdCAmJiBzZWxmO1xuXG4vKiogVXNlZCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdC4gKi9cbnZhciByb290ID0gZnJlZUdsb2JhbCB8fCBmcmVlU2VsZiB8fCBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXG5leHBvcnQgZGVmYXVsdCByb290O1xuIiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIGZ1bmNQcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZ1bmNUb1N0cmluZyA9IGZ1bmNQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBDb252ZXJ0cyBgZnVuY2AgdG8gaXRzIHNvdXJjZSBjb2RlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjb252ZXJ0LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgc291cmNlIGNvZGUuXG4gKi9cbmZ1bmN0aW9uIHRvU291cmNlKGZ1bmMpIHtcbiAgaWYgKGZ1bmMgIT0gbnVsbCkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gZnVuY1RvU3RyaW5nLmNhbGwoZnVuYyk7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIChmdW5jICsgJycpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gIH1cbiAgcmV0dXJuICcnO1xufVxuXG5leHBvcnQgZGVmYXVsdCB0b1NvdXJjZTtcbiIsIi8qKlxuICogUGVyZm9ybXMgYVxuICogW2BTYW1lVmFsdWVaZXJvYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtc2FtZXZhbHVlemVybylcbiAqIGNvbXBhcmlzb24gYmV0d2VlbiB0d28gdmFsdWVzIHRvIGRldGVybWluZSBpZiB0aGV5IGFyZSBlcXVpdmFsZW50LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHsqfSBvdGhlciBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSB9O1xuICogdmFyIG90aGVyID0geyAnYSc6IDEgfTtcbiAqXG4gKiBfLmVxKG9iamVjdCwgb2JqZWN0KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmVxKG9iamVjdCwgb3RoZXIpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmVxKCdhJywgJ2EnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmVxKCdhJywgT2JqZWN0KCdhJykpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmVxKE5hTiwgTmFOKTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gZXEodmFsdWUsIG90aGVyKSB7XG4gIHJldHVybiB2YWx1ZSA9PT0gb3RoZXIgfHwgKHZhbHVlICE9PSB2YWx1ZSAmJiBvdGhlciAhPT0gb3RoZXIpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBlcTtcbiIsImltcG9ydCBiYXNlSXNBcnJheUJ1ZmZlciBmcm9tICcuL19iYXNlSXNBcnJheUJ1ZmZlci5qcyc7XG5pbXBvcnQgYmFzZVVuYXJ5IGZyb20gJy4vX2Jhc2VVbmFyeS5qcyc7XG5pbXBvcnQgbm9kZVV0aWwgZnJvbSAnLi9fbm9kZVV0aWwuanMnO1xuXG4vKiBOb2RlLmpzIGhlbHBlciByZWZlcmVuY2VzLiAqL1xudmFyIG5vZGVJc0FycmF5QnVmZmVyID0gbm9kZVV0aWwgJiYgbm9kZVV0aWwuaXNBcnJheUJ1ZmZlcjtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGFuIGBBcnJheUJ1ZmZlcmAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4zLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGFycmF5IGJ1ZmZlciwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXlCdWZmZXIobmV3IEFycmF5QnVmZmVyKDIpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlCdWZmZXIobmV3IEFycmF5KDIpKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0FycmF5QnVmZmVyID0gbm9kZUlzQXJyYXlCdWZmZXIgPyBiYXNlVW5hcnkobm9kZUlzQXJyYXlCdWZmZXIpIDogYmFzZUlzQXJyYXlCdWZmZXI7XG5cbmV4cG9ydCBkZWZhdWx0IGlzQXJyYXlCdWZmZXI7XG4iLCJpbXBvcnQgYmFzZUdldFRhZyBmcm9tICcuL19iYXNlR2V0VGFnLmpzJztcbmltcG9ydCBpc09iamVjdCBmcm9tICcuL2lzT2JqZWN0LmpzJztcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFzeW5jVGFnID0gJ1tvYmplY3QgQXN5bmNGdW5jdGlvbl0nLFxuICAgIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIGdlblRhZyA9ICdbb2JqZWN0IEdlbmVyYXRvckZ1bmN0aW9uXScsXG4gICAgcHJveHlUYWcgPSAnW29iamVjdCBQcm94eV0nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgRnVuY3Rpb25gIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIGZ1bmN0aW9uLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNGdW5jdGlvbihfKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oL2FiYy8pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvLyBUaGUgdXNlIG9mIGBPYmplY3QjdG9TdHJpbmdgIGF2b2lkcyBpc3N1ZXMgd2l0aCB0aGUgYHR5cGVvZmAgb3BlcmF0b3JcbiAgLy8gaW4gU2FmYXJpIDkgd2hpY2ggcmV0dXJucyAnb2JqZWN0JyBmb3IgdHlwZWQgYXJyYXlzIGFuZCBvdGhlciBjb25zdHJ1Y3RvcnMuXG4gIHZhciB0YWcgPSBiYXNlR2V0VGFnKHZhbHVlKTtcbiAgcmV0dXJuIHRhZyA9PSBmdW5jVGFnIHx8IHRhZyA9PSBnZW5UYWcgfHwgdGFnID09IGFzeW5jVGFnIHx8IHRhZyA9PSBwcm94eVRhZztcbn1cblxuZXhwb3J0IGRlZmF1bHQgaXNGdW5jdGlvbjtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlXG4gKiBbbGFuZ3VhZ2UgdHlwZV0oaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLWVjbWFzY3JpcHQtbGFuZ3VhZ2UtdHlwZXMpXG4gKiBvZiBgT2JqZWN0YC4gKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KF8ubm9vcCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpc09iamVjdDtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuIEEgdmFsdWUgaXMgb2JqZWN0LWxpa2UgaWYgaXQncyBub3QgYG51bGxgXG4gKiBhbmQgaGFzIGEgYHR5cGVvZmAgcmVzdWx0IG9mIFwib2JqZWN0XCIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdExpa2Uoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc09iamVjdExpa2UobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpc09iamVjdExpa2U7XG4iLCJpbXBvcnQgTWFwQ2FjaGUgZnJvbSAnLi9fTWFwQ2FjaGUuanMnO1xuXG4vKiogRXJyb3IgbWVzc2FnZSBjb25zdGFudHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IG1lbW9pemVzIHRoZSByZXN1bHQgb2YgYGZ1bmNgLiBJZiBgcmVzb2x2ZXJgIGlzXG4gKiBwcm92aWRlZCwgaXQgZGV0ZXJtaW5lcyB0aGUgY2FjaGUga2V5IGZvciBzdG9yaW5nIHRoZSByZXN1bHQgYmFzZWQgb24gdGhlXG4gKiBhcmd1bWVudHMgcHJvdmlkZWQgdG8gdGhlIG1lbW9pemVkIGZ1bmN0aW9uLiBCeSBkZWZhdWx0LCB0aGUgZmlyc3QgYXJndW1lbnRcbiAqIHByb3ZpZGVkIHRvIHRoZSBtZW1vaXplZCBmdW5jdGlvbiBpcyB1c2VkIGFzIHRoZSBtYXAgY2FjaGUga2V5LiBUaGUgYGZ1bmNgXG4gKiBpcyBpbnZva2VkIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIG9mIHRoZSBtZW1vaXplZCBmdW5jdGlvbi5cbiAqXG4gKiAqKk5vdGU6KiogVGhlIGNhY2hlIGlzIGV4cG9zZWQgYXMgdGhlIGBjYWNoZWAgcHJvcGVydHkgb24gdGhlIG1lbW9pemVkXG4gKiBmdW5jdGlvbi4gSXRzIGNyZWF0aW9uIG1heSBiZSBjdXN0b21pemVkIGJ5IHJlcGxhY2luZyB0aGUgYF8ubWVtb2l6ZS5DYWNoZWBcbiAqIGNvbnN0cnVjdG9yIHdpdGggb25lIHdob3NlIGluc3RhbmNlcyBpbXBsZW1lbnQgdGhlXG4gKiBbYE1hcGBdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXByb3BlcnRpZXMtb2YtdGhlLW1hcC1wcm90b3R5cGUtb2JqZWN0KVxuICogbWV0aG9kIGludGVyZmFjZSBvZiBgY2xlYXJgLCBgZGVsZXRlYCwgYGdldGAsIGBoYXNgLCBhbmQgYHNldGAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBoYXZlIGl0cyBvdXRwdXQgbWVtb2l6ZWQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbcmVzb2x2ZXJdIFRoZSBmdW5jdGlvbiB0byByZXNvbHZlIHRoZSBjYWNoZSBrZXkuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBtZW1vaXplZCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiAxLCAnYic6IDIgfTtcbiAqIHZhciBvdGhlciA9IHsgJ2MnOiAzLCAnZCc6IDQgfTtcbiAqXG4gKiB2YXIgdmFsdWVzID0gXy5tZW1vaXplKF8udmFsdWVzKTtcbiAqIHZhbHVlcyhvYmplY3QpO1xuICogLy8gPT4gWzEsIDJdXG4gKlxuICogdmFsdWVzKG90aGVyKTtcbiAqIC8vID0+IFszLCA0XVxuICpcbiAqIG9iamVjdC5hID0gMjtcbiAqIHZhbHVlcyhvYmplY3QpO1xuICogLy8gPT4gWzEsIDJdXG4gKlxuICogLy8gTW9kaWZ5IHRoZSByZXN1bHQgY2FjaGUuXG4gKiB2YWx1ZXMuY2FjaGUuc2V0KG9iamVjdCwgWydhJywgJ2InXSk7XG4gKiB2YWx1ZXMob2JqZWN0KTtcbiAqIC8vID0+IFsnYScsICdiJ11cbiAqXG4gKiAvLyBSZXBsYWNlIGBfLm1lbW9pemUuQ2FjaGVgLlxuICogXy5tZW1vaXplLkNhY2hlID0gV2Vha01hcDtcbiAqL1xuZnVuY3Rpb24gbWVtb2l6ZShmdW5jLCByZXNvbHZlcikge1xuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJyB8fCAocmVzb2x2ZXIgIT0gbnVsbCAmJiB0eXBlb2YgcmVzb2x2ZXIgIT0gJ2Z1bmN0aW9uJykpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgdmFyIG1lbW9pemVkID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMsXG4gICAgICAgIGtleSA9IHJlc29sdmVyID8gcmVzb2x2ZXIuYXBwbHkodGhpcywgYXJncykgOiBhcmdzWzBdLFxuICAgICAgICBjYWNoZSA9IG1lbW9pemVkLmNhY2hlO1xuXG4gICAgaWYgKGNhY2hlLmhhcyhrZXkpKSB7XG4gICAgICByZXR1cm4gY2FjaGUuZ2V0KGtleSk7XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIG1lbW9pemVkLmNhY2hlID0gY2FjaGUuc2V0KGtleSwgcmVzdWx0KSB8fCBjYWNoZTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICBtZW1vaXplZC5jYWNoZSA9IG5ldyAobWVtb2l6ZS5DYWNoZSB8fCBNYXBDYWNoZSk7XG4gIHJldHVybiBtZW1vaXplZDtcbn1cblxuLy8gRXhwb3NlIGBNYXBDYWNoZWAuXG5tZW1vaXplLkNhY2hlID0gTWFwQ2FjaGU7XG5cbmV4cG9ydCBkZWZhdWx0IG1lbW9pemU7XG4iLCJpbXBvcnQge1xuXHRIQUxGX0ZMT0FULCBGTE9BVCwgVU5TSUdORURfQllURSwgQllURSwgVU5TSUdORURfU0hPUlQsIFNIT1JULCBVTlNJR05FRF9JTlQsIElOVCxcblx0TElORUFSLCBORUFSRVNULFxuXHRSRVBFQVQsIENMQU1QX1RPX0VER0UsIFJHQiwgUkdCQSxcbn0gZnJvbSAnLi9Db25zdGFudHMnO1xuXG5leHBvcnQgY29uc3QgdmFsaWREYXRhVHlwZXMgPSBbSEFMRl9GTE9BVCwgRkxPQVQsIFVOU0lHTkVEX0JZVEUsIEJZVEUsIFVOU0lHTkVEX1NIT1JULCBTSE9SVCwgVU5TSUdORURfSU5ULCBJTlRdO1xuZXhwb3J0IGZ1bmN0aW9uIGlzVmFsaWREYXRhVHlwZSh0eXBlOiBzdHJpbmcpIHtcblx0cmV0dXJuIHZhbGlkRGF0YVR5cGVzLmluZGV4T2YodHlwZSkgPiAtMTtcbn1cblxuZXhwb3J0IGNvbnN0IHZhbGlkRmlsdGVyVHlwZXMgPSBbTElORUFSLCBORUFSRVNUXTtcbmV4cG9ydCBmdW5jdGlvbiBpc1ZhbGlkRmlsdGVyVHlwZSh0eXBlOiBzdHJpbmcpIHtcblx0cmV0dXJuIHZhbGlkRmlsdGVyVHlwZXMuaW5kZXhPZih0eXBlKSA+IC0xO1xufVxuXG5leHBvcnQgY29uc3QgdmFsaWRXcmFwVHlwZXMgPSBbQ0xBTVBfVE9fRURHRSwgUkVQRUFUXTsgLy8gTUlSUk9SRURfUkVQRUFUXG5leHBvcnQgZnVuY3Rpb24gaXNWYWxpZFdyYXBUeXBlKHR5cGU6IHN0cmluZykge1xuXHRyZXR1cm4gdmFsaWRXcmFwVHlwZXMuaW5kZXhPZih0eXBlKSA+IC0xO1xufVxuXG5leHBvcnQgY29uc3QgdmFsaWRUZXh0dXJlRm9ybWF0VHlwZXMgPSBbUkdCLCBSR0JBXTtcbmV4cG9ydCBmdW5jdGlvbiBpc1ZhbGlkVGV4dHVyZUZvcm1hdFR5cGUodHlwZTogc3RyaW5nKSB7XG5cdHJldHVybiB2YWxpZFRleHR1cmVGb3JtYXRUeXBlcy5pbmRleE9mKHR5cGUpID4gLTE7XG59XG5cbmV4cG9ydCBjb25zdCB2YWxpZFRleHR1cmVEYXRhVHlwZXMgPSBbVU5TSUdORURfQllURV07XG5leHBvcnQgZnVuY3Rpb24gaXNWYWxpZFRleHR1cmVEYXRhVHlwZSh0eXBlOiBzdHJpbmcpIHtcblx0cmV0dXJuIHZhbGlkVGV4dHVyZURhdGFUeXBlcy5pbmRleE9mKHR5cGUpID4gLTE7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc051bWJlcih2YWx1ZTogYW55KSB7XG5cdHJldHVybiAhaXNOYU4odmFsdWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNJbnRlZ2VyKHZhbHVlOiBhbnkpIHtcblx0cmV0dXJuIGlzTnVtYmVyKHZhbHVlKSAmJiAodmFsdWUgJSAxID09PSAwKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzUG9zaXRpdmVJbnRlZ2VyKHZhbHVlOiBhbnkpIHtcblx0cmV0dXJuIGlzSW50ZWdlcih2YWx1ZSkgJiYgIHZhbHVlID4gMDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzU3RyaW5nKHZhbHVlOiBhbnkpe1xuXHRyZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQXJyYXkodmFsdWU6IGFueSkge1xuXHRyZXR1cm4gQXJyYXkuaXNBcnJheSh2YWx1ZSk7XG59IiwiZXhwb3J0IGNvbnN0IEhBTEZfRkxPQVQgPSAnSEFMRl9GTE9BVCc7XG5leHBvcnQgY29uc3QgRkxPQVQgPSAnRkxPQVQnO1xuZXhwb3J0IGNvbnN0IFVOU0lHTkVEX0JZVEUgPSAnVU5TSUdORURfQllURSc7XG5leHBvcnQgY29uc3QgQllURSA9ICdCWVRFJztcbmV4cG9ydCBjb25zdCBVTlNJR05FRF9TSE9SVCA9ICdVTlNJR05FRF9TSE9SVCc7XG5leHBvcnQgY29uc3QgU0hPUlQgPSAnU0hPUlQnO1xuZXhwb3J0IGNvbnN0IFVOU0lHTkVEX0lOVCA9ICdVTlNJR05FRF9JTlQnO1xuZXhwb3J0IGNvbnN0IElOVCA9ICdJTlQnO1xuXG5leHBvcnQgY29uc3QgTElORUFSID0gJ0xJTkVBUic7XG5leHBvcnQgY29uc3QgTkVBUkVTVCA9ICdORUFSRVNUJztcblxuZXhwb3J0IGNvbnN0IFJFUEVBVCA9ICdSRVBFQVQnO1xuZXhwb3J0IGNvbnN0IENMQU1QX1RPX0VER0UgPSAnQ0xBTVBfVE9fRURHRSc7XG4vLyBleHBvcnQgY29uc3QgTUlSUk9SRURfUkVQRUFUID0gJ01JUlJPUkVEX1JFUEVBVCc7XG5cbmV4cG9ydCBjb25zdCBSR0IgPSAnUkdCJztcbmV4cG9ydCBjb25zdCBSR0JBID0gJ1JHQkEnO1xuXG5leHBvcnQgdHlwZSBEYXRhTGF5ZXJBcnJheVR5cGUgPSAgRmxvYXQzMkFycmF5IHwgVWludDhBcnJheSB8IEludDhBcnJheSB8IFVpbnQxNkFycmF5IHwgSW50MTZBcnJheSB8IFVpbnQzMkFycmF5IHwgSW50MzJBcnJheTtcbmV4cG9ydCB0eXBlIERhdGFMYXllclR5cGUgPSB0eXBlb2YgSEFMRl9GTE9BVCB8IHR5cGVvZiBGTE9BVCB8IHR5cGVvZiBVTlNJR05FRF9CWVRFIHwgdHlwZW9mIEJZVEUgfCB0eXBlb2YgVU5TSUdORURfU0hPUlQgfCB0eXBlb2YgU0hPUlQgfCB0eXBlb2YgVU5TSUdORURfSU5UIHwgdHlwZW9mIElOVDtcbmV4cG9ydCB0eXBlIERhdGFMYXllck51bUNvbXBvbmVudHMgPSAxIHwgMiB8IDMgfCA0O1xuZXhwb3J0IHR5cGUgRGF0YUxheWVyRmlsdGVyVHlwZSA9IHR5cGVvZiBMSU5FQVIgfCB0eXBlb2YgTkVBUkVTVDtcbmV4cG9ydCB0eXBlIERhdGFMYXllcldyYXBUeXBlID0gdHlwZW9mIFJFUEVBVCB8IHR5cGVvZiBDTEFNUF9UT19FREdFOy8vIHwgdHlwZW9mIE1JUlJPUkVEX1JFUEVBVDtcblxuZXhwb3J0IHR5cGUgVGV4dHVyZUZvcm1hdFR5cGUgPSB0eXBlb2YgUkdCIHwgdHlwZW9mIFJHQkE7XG5leHBvcnQgdHlwZSBUZXh0dXJlRGF0YVR5cGUgPSB0eXBlb2YgVU5TSUdORURfQllURTtcblxuZXhwb3J0IGNvbnN0IEdMU0wzID0gJzMwMCBlcyc7XG5leHBvcnQgY29uc3QgR0xTTDEgPSAnMTAwJztcbmV4cG9ydCB0eXBlIEdMU0xWZXJzaW9uID0gdHlwZW9mIEdMU0wxIHwgdHlwZW9mIEdMU0wzO1xuXG4vLyBVbmlmb3JtIHR5cGVzLlxuZXhwb3J0IGNvbnN0IEZMT0FUXzFEX1VOSUZPUk0gPSAnMWYnO1xuZXhwb3J0IGNvbnN0IEZMT0FUXzJEX1VOSUZPUk0gPSAnMmYnO1xuZXhwb3J0IGNvbnN0IEZMT0FUXzNEX1VOSUZPUk0gPSAnM2YnO1xuZXhwb3J0IGNvbnN0IEZMT0FUXzREX1VOSUZPUk0gPSAnM2YnO1xuZXhwb3J0IGNvbnN0IElOVF8xRF9VTklGT1JNID0gJzFpJztcbmV4cG9ydCBjb25zdCBJTlRfMkRfVU5JRk9STSA9ICcyaSc7XG5leHBvcnQgY29uc3QgSU5UXzNEX1VOSUZPUk0gPSAnM2knO1xuZXhwb3J0IGNvbnN0IElOVF80RF9VTklGT1JNID0gJzNpJztcblxuZXhwb3J0IHR5cGUgVW5pZm9ybURhdGFUeXBlID0gdHlwZW9mIEZMT0FUIHwgdHlwZW9mIElOVDtcbmV4cG9ydCB0eXBlIFVuaWZvcm1WYWx1ZVR5cGUgPSBcblx0bnVtYmVyIHxcblx0W251bWJlcl0gfFxuXHRbbnVtYmVyLCBudW1iZXJdIHxcblx0W251bWJlciwgbnVtYmVyLCBudW1iZXJdIHxcblx0W251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl07XG5leHBvcnQgdHlwZSBVbmlmb3JtVHlwZSA9IFxuXHR0eXBlb2YgRkxPQVRfMURfVU5JRk9STSB8XG5cdHR5cGVvZiBGTE9BVF8yRF9VTklGT1JNIHxcblx0dHlwZW9mIEZMT0FUXzNEX1VOSUZPUk0gfFxuXHR0eXBlb2YgRkxPQVRfNERfVU5JRk9STSB8XG5cdHR5cGVvZiBJTlRfMURfVU5JRk9STSB8XG5cdHR5cGVvZiBJTlRfMkRfVU5JRk9STSB8XG5cdHR5cGVvZiBJTlRfM0RfVU5JRk9STSB8XG5cdHR5cGVvZiBJTlRfNERfVU5JRk9STTtcbmV4cG9ydCB0eXBlIFVuaWZvcm0gPSB7IFxuXHRsb2NhdGlvbjogeyBba2V5OiBzdHJpbmddOiBXZWJHTFVuaWZvcm1Mb2NhdGlvbiB9LFxuXHR0eXBlOiBVbmlmb3JtVHlwZSxcblx0dmFsdWU6IFVuaWZvcm1WYWx1ZVR5cGUsXG59O1xuXG4iLCJpbXBvcnQgeyBzZXRGbG9hdDE2IH0gZnJvbSAnQHBldGFtb3Jpa2VuL2Zsb2F0MTYnO1xuaW1wb3J0IHsgaXNQb3NpdGl2ZUludGVnZXIsIGlzVmFsaWREYXRhVHlwZSwgaXNWYWxpZEZpbHRlclR5cGUsIGlzVmFsaWRXcmFwVHlwZSwgdmFsaWREYXRhVHlwZXMsIHZhbGlkRmlsdGVyVHlwZXMsIHZhbGlkV3JhcFR5cGVzIH0gZnJvbSAnLi9DaGVja3MnO1xuaW1wb3J0IHtcblx0SEFMRl9GTE9BVCwgRkxPQVQsIFVOU0lHTkVEX0JZVEUsIEJZVEUsIFVOU0lHTkVEX1NIT1JULCBTSE9SVCwgVU5TSUdORURfSU5ULCBJTlQsXG5cdE5FQVJFU1QsIExJTkVBUiwgQ0xBTVBfVE9fRURHRSxcblx0RGF0YUxheWVyQXJyYXlUeXBlLCBEYXRhTGF5ZXJGaWx0ZXJUeXBlLCBEYXRhTGF5ZXJOdW1Db21wb25lbnRzLCBEYXRhTGF5ZXJUeXBlLCBEYXRhTGF5ZXJXcmFwVHlwZSwgR0xTTFZlcnNpb24sIEdMU0wzLCBHTFNMMSxcbiB9IGZyb20gJy4vQ29uc3RhbnRzJztcbmltcG9ydCB7XG5cdGdldEV4dGVuc2lvbixcblx0RVhUX0NPTE9SX0JVRkZFUl9GTE9BVCxcblx0T0VTX1RFWFRVUkVfRkxPQVQsXG5cdE9FU19URVhUVVJFX0ZMT0FUX0xJTkVBUixcblx0T0VTX1RFWFRVUkVfSEFMRl9GTE9BVCxcblx0T0VTX1RFWFRVUkVfSEFsRl9GTE9BVF9MSU5FQVIsXG59IGZyb20gJy4vZXh0ZW5zaW9ucyc7XG5pbXBvcnQgeyBpc1dlYkdMMiB9IGZyb20gJy4vdXRpbHMnO1xuXG5leHBvcnQgdHlwZSBEYXRhTGF5ZXJCdWZmZXIgPSB7XG5cdHRleHR1cmU6IFdlYkdMVGV4dHVyZSxcblx0ZnJhbWVidWZmZXI/OiBXZWJHTEZyYW1lYnVmZmVyLFxufVxuXG50eXBlIEVycm9yQ2FsbGJhY2sgPSAobWVzc2FnZTogc3RyaW5nKSA9PiB2b2lkO1xuXG5leHBvcnQgY2xhc3MgRGF0YUxheWVyIHtcblx0cmVhZG9ubHkgbmFtZTogc3RyaW5nO1xuXHRwcml2YXRlIHJlYWRvbmx5IGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQgfCBXZWJHTDJSZW5kZXJpbmdDb250ZXh0O1xuXHRwcml2YXRlIHJlYWRvbmx5IGVycm9yQ2FsbGJhY2s6IEVycm9yQ2FsbGJhY2s7XG5cblx0Ly8gRWFjaCBEYXRhTGF5ZXIgbWF5IGNvbnRhaW4gYSBudW1iZXIgb2YgYnVmZmVycyB0byBzdG9yZSBkaWZmZXJlbnQgaW5zdGFuY2VzIG9mIHRoZSBzdGF0ZS5cblx0cHJpdmF0ZSBfYnVmZmVySW5kZXggPSAwO1xuXHRyZWFkb25seSBudW1CdWZmZXJzO1xuXHRwcml2YXRlIHJlYWRvbmx5IGJ1ZmZlcnM6IERhdGFMYXllckJ1ZmZlcltdID0gW107XG5cblx0Ly8gVGV4dHVyZSBzaXplcy5cblx0cHJpdmF0ZSBsZW5ndGg/OiBudW1iZXI7IC8vIFRoaXMgaXMgb25seSB1c2VkIGZvciAxRCBkYXRhIGxheWVycy5cblx0cHJpdmF0ZSB3aWR0aDogbnVtYmVyO1xuXHRwcml2YXRlIGhlaWdodDogbnVtYmVyO1xuXG5cdC8vIERhdGFMYXllciBzZXR0aW5ncy5cblx0cmVhZG9ubHkgdHlwZTogRGF0YUxheWVyVHlwZTsgLy8gSW5wdXQgdHlwZSBwYXNzZWQgaW4gZHVyaW5nIHNldHVwLlxuXHRyZWFkb25seSBpbnRlcm5hbFR5cGU6IERhdGFMYXllclR5cGU7IC8vIFR5cGUgdGhhdCBjb3JyZXNwb25kcyB0byBnbFR5cGUsIG1heSBiZSBkaWZmZXJlbnQgZnJvbSB0eXBlLlxuXHRyZWFkb25seSB3cmFwUzogRGF0YUxheWVyV3JhcFR5cGU7IC8vIElucHV0IHdyYXAgdHlwZSBwYXNzZWQgaW4gZHVyaW5nIHNldHVwLlxuXHRyZWFkb25seSB3cmFwVDogRGF0YUxheWVyV3JhcFR5cGU7IC8vIElucHV0IHdyYXAgdHlwZSBwYXNzZWQgaW4gZHVyaW5nIHNldHVwLlxuXHRyZWFkb25seSBpbnRlcm5hbFdyYXBTOiBEYXRhTGF5ZXJXcmFwVHlwZTsgLy8gV3JhcCB0eXBlIHRoYXQgY29ycmVzcG9uZHMgdG8gZ2xXcmFwUywgbWF5IGJlIGRpZmZlcmVudCBmcm9tIHdyYXBTLlxuXHRyZWFkb25seSBpbnRlcm5hbFdyYXBUOiBEYXRhTGF5ZXJXcmFwVHlwZTsgLy8gV3JhcCB0eXBlIHRoYXQgY29ycmVzcG9uZHMgdG8gZ2xXcmFwVCwgbWF5IGJlIGRpZmZlcmVudCBmcm9tIHdyYXBULlxuXHRyZWFkb25seSBudW1Db21wb25lbnRzOiBEYXRhTGF5ZXJOdW1Db21wb25lbnRzOyAvLyBOdW1iZXIgb2YgUkdCQSBjaGFubmVscyB0byB1c2UgZm9yIHRoaXMgRGF0YUxheWVyLlxuXHRyZWFkb25seSBmaWx0ZXI6IERhdGFMYXllckZpbHRlclR5cGU7IC8vIEludGVycG9sYXRpb24gZmlsdGVyIHR5cGUgb2YgZGF0YS5cblx0cmVhZG9ubHkgaW50ZXJuYWxGaWx0ZXI6IERhdGFMYXllckZpbHRlclR5cGU7IC8vIEZpbHRlciB0eXBlIHRoYXQgY29ycmVzcG9uZHMgdG8gZ2xGaWx0ZXIsIG1heSBiZSBkaWZmZXJlbnQgZnJvbSBmaWx0ZXIuXG5cdHJlYWRvbmx5IHdyaXRhYmxlOiBib29sZWFuO1xuXG5cdC8vIE9wdGltaXphdGlvbnMgc28gdGhhdCBcImNvcHlpbmdcIiBjYW4gaGFwcGVuIHdpdGhvdXQgZHJhdyBjYWxscy5cblx0cHJpdmF0ZSB0ZXh0dXJlT3ZlcnJpZGVzPzogKFdlYkdMVGV4dHVyZSB8IHVuZGVmaW5lZClbXTtcblxuXHQvLyBHTCB2YXJpYWJsZXMgKHRoZXNlIG1heSBiZSBkaWZmZXJlbnQgZnJvbSB0aGVpciBjb3JyZXNwb25kaW5nIG5vbi1nbCBwYXJhbWV0ZXJzKS5cblx0cmVhZG9ubHkgZ2xJbnRlcm5hbEZvcm1hdDogbnVtYmVyO1xuXHRyZWFkb25seSBnbEZvcm1hdDogbnVtYmVyO1xuXHRyZWFkb25seSBnbFR5cGU6IG51bWJlcjtcblx0cmVhZG9ubHkgZ2xOdW1DaGFubmVsczogbnVtYmVyO1xuXHRyZWFkb25seSBnbFdyYXBTOiBudW1iZXI7XG5cdHJlYWRvbmx5IGdsV3JhcFQ6IG51bWJlcjtcblx0cmVhZG9ubHkgZ2xGaWx0ZXI6IG51bWJlcjtcblxuXHRjb25zdHJ1Y3Rvcihcblx0XHRwYXJhbXM6IHtcblx0XHRcdGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQgfCBXZWJHTDJSZW5kZXJpbmdDb250ZXh0LFxuXHRcdFx0bmFtZTogc3RyaW5nLFxuXHRcdFx0ZGltZW5zaW9uczogbnVtYmVyIHwgW251bWJlciwgbnVtYmVyXSxcblx0XHRcdHR5cGU6IERhdGFMYXllclR5cGUsXG5cdFx0XHRudW1Db21wb25lbnRzOiBEYXRhTGF5ZXJOdW1Db21wb25lbnRzLFxuXHRcdFx0Z2xzbFZlcnNpb246IEdMU0xWZXJzaW9uLFxuXHRcdFx0ZGF0YT86IERhdGFMYXllckFycmF5VHlwZSxcblx0XHRcdGZpbHRlcj86IERhdGFMYXllckZpbHRlclR5cGUsXG5cdFx0XHR3cmFwUz86IERhdGFMYXllcldyYXBUeXBlLFxuXHRcdFx0d3JhcFQ/OiBEYXRhTGF5ZXJXcmFwVHlwZSxcblx0XHRcdHdyaXRhYmxlPzogYm9vbGVhbixcblx0XHRcdG51bUJ1ZmZlcnM/OiBudW1iZXIsXG5cdFx0XHRlcnJvckNhbGxiYWNrOiBFcnJvckNhbGxiYWNrLFxuXHRcdH0sXG5cdCkge1xuXHRcdGNvbnN0IHsgZ2wsIGVycm9yQ2FsbGJhY2ssIG5hbWUsIGRpbWVuc2lvbnMsIHR5cGUsIG51bUNvbXBvbmVudHMsIGRhdGEsIGdsc2xWZXJzaW9uIH0gPSBwYXJhbXM7XG5cblx0XHQvLyBTYXZlIHBhcmFtcy5cblx0XHR0aGlzLm5hbWUgPSBuYW1lO1xuXHRcdHRoaXMuZ2wgPSBnbDtcblx0XHR0aGlzLmVycm9yQ2FsbGJhY2sgPSBlcnJvckNhbGxiYWNrO1xuXG5cdFx0Ly8gbnVtQ29tcG9uZW50cyBtdXN0IGJlIGJldHdlZW4gMSBhbmQgNC5cblx0XHRpZiAoIWlzUG9zaXRpdmVJbnRlZ2VyKG51bUNvbXBvbmVudHMpIHx8IG51bUNvbXBvbmVudHMgPiA0KSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgbnVtQ29tcG9uZW50cyAke251bUNvbXBvbmVudHN9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIuYCk7XG5cdFx0fVxuXHRcdHRoaXMubnVtQ29tcG9uZW50cyA9IG51bUNvbXBvbmVudHM7XG5cblx0XHQvLyB3cml0YWJsZSBkZWZhdWx0cyB0byBmYWxzZS5cblx0XHRjb25zdCB3cml0YWJsZSA9ICEhcGFyYW1zLndyaXRhYmxlO1xuXHRcdHRoaXMud3JpdGFibGUgPSB3cml0YWJsZTtcblxuXHRcdC8vIFNldCBkaW1lbnNpb25zLCBtYXkgYmUgMUQgb3IgMkQuXG5cdFx0Y29uc3QgeyBsZW5ndGgsIHdpZHRoLCBoZWlnaHQgfSA9IERhdGFMYXllci5jYWxjU2l6ZShkaW1lbnNpb25zLCBuYW1lKTtcblx0XHR0aGlzLmxlbmd0aCA9IGxlbmd0aDtcblx0XHRpZiAoIWlzUG9zaXRpdmVJbnRlZ2VyKHdpZHRoKSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHdpZHRoICR7d2lkdGh9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIuYCk7XG5cdFx0fVxuXHRcdHRoaXMud2lkdGggPSB3aWR0aDtcblx0XHRpZiAoIWlzUG9zaXRpdmVJbnRlZ2VyKGhlaWdodCkpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBsZW5ndGggJHtoZWlnaHR9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIuYCk7XG5cdFx0fVxuXHRcdHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuXG5cdFx0Ly8gU2V0IGZpbHRlcmluZyAtIGlmIHdlIGFyZSBwcm9jZXNzaW5nIGEgMUQgYXJyYXksIGRlZmF1bHQgdG8gTkVBUkVTVCBmaWx0ZXJpbmcuXG5cdFx0Ly8gRWxzZSBkZWZhdWx0IHRvIExJTkVBUiAoaW50ZXJwb2xhdGlvbikgZmlsdGVyaW5nLlxuXHRcdGNvbnN0IGZpbHRlciA9IHBhcmFtcy5maWx0ZXIgIT09IHVuZGVmaW5lZCA/IHBhcmFtcy5maWx0ZXIgOiAobGVuZ3RoID8gTkVBUkVTVCA6IExJTkVBUik7XG5cdFx0aWYgKCFpc1ZhbGlkRmlsdGVyVHlwZShmaWx0ZXIpKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgZmlsdGVyOiAke2ZpbHRlcn0gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIiwgbXVzdCBiZSAke3ZhbGlkRmlsdGVyVHlwZXMuam9pbignLCAnKX0uYCk7XG5cdFx0fVxuXHRcdHRoaXMuZmlsdGVyID0gZmlsdGVyO1xuXG5cdFx0Ly8gR2V0IHdyYXAgdHlwZXMsIGRlZmF1bHQgdG8gY2xhbXAgdG8gZWRnZS5cblx0XHRjb25zdCB3cmFwUyA9IHBhcmFtcy53cmFwUyAhPT0gdW5kZWZpbmVkID8gcGFyYW1zLndyYXBTIDogQ0xBTVBfVE9fRURHRTtcblx0XHRpZiAoIWlzVmFsaWRXcmFwVHlwZSh3cmFwUykpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB3cmFwUzogJHt3cmFwU30gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIiwgbXVzdCBiZSAke3ZhbGlkV3JhcFR5cGVzLmpvaW4oJywgJyl9LmApO1xuXHRcdH1cblx0XHR0aGlzLndyYXBTID0gd3JhcFM7XG5cdFx0Y29uc3Qgd3JhcFQgPSBwYXJhbXMud3JhcFQgIT09IHVuZGVmaW5lZCA/IHBhcmFtcy53cmFwVCA6IENMQU1QX1RPX0VER0U7XG5cdFx0aWYgKCFpc1ZhbGlkV3JhcFR5cGUod3JhcFQpKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgd3JhcFQ6ICR7d3JhcFR9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIsIG11c3QgYmUgJHt2YWxpZFdyYXBUeXBlcy5qb2luKCcsICcpfS5gKTtcblx0XHR9XG5cdFx0dGhpcy53cmFwVCA9IHdyYXBUO1xuXG5cdFx0Ly8gU2V0IGRhdGEgdHlwZS5cblx0XHRpZiAoIWlzVmFsaWREYXRhVHlwZSh0eXBlKSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHR5cGUgJHt0eXBlfSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLCBtdXN0IGJlIG9uZSBvZiAke3ZhbGlkRGF0YVR5cGVzLmpvaW4oJywgJyl9LmApO1xuXHRcdH1cblx0XHR0aGlzLnR5cGUgPSB0eXBlO1xuXHRcdGNvbnN0IGludGVybmFsVHlwZSA9IERhdGFMYXllci5nZXRJbnRlcm5hbFR5cGUoe1xuXHRcdFx0Z2wsXG5cdFx0XHR0eXBlLFxuXHRcdFx0Z2xzbFZlcnNpb24sXG5cdFx0XHR3cml0YWJsZSxcblx0XHRcdGZpbHRlcixcblx0XHRcdG5hbWUsXG5cdFx0XHRlcnJvckNhbGxiYWNrLFxuXHRcdH0pO1xuXHRcdHRoaXMuaW50ZXJuYWxUeXBlID0gaW50ZXJuYWxUeXBlO1xuXHRcdC8vIFNldCBnbCB0ZXh0dXJlIHBhcmFtZXRlcnMuXG5cdFx0Y29uc3Qge1xuXHRcdFx0Z2xGb3JtYXQsXG5cdFx0XHRnbEludGVybmFsRm9ybWF0LFxuXHRcdFx0Z2xUeXBlLFxuXHRcdFx0Z2xOdW1DaGFubmVscyxcblx0XHR9ID0gRGF0YUxheWVyLmdldEdMVGV4dHVyZVBhcmFtZXRlcnMoe1xuXHRcdFx0Z2wsXG5cdFx0XHRuYW1lLFxuXHRcdFx0bnVtQ29tcG9uZW50cyxcblx0XHRcdHdyaXRhYmxlLFxuXHRcdFx0aW50ZXJuYWxUeXBlLFxuXHRcdFx0Z2xzbFZlcnNpb24sXG5cdFx0XHRlcnJvckNhbGxiYWNrLFxuXHRcdH0pO1xuXHRcdHRoaXMuZ2xJbnRlcm5hbEZvcm1hdCA9IGdsSW50ZXJuYWxGb3JtYXQ7XG5cdFx0dGhpcy5nbEZvcm1hdCA9IGdsRm9ybWF0O1xuXHRcdHRoaXMuZ2xUeXBlID0gZ2xUeXBlO1xuXHRcdHRoaXMuZ2xOdW1DaGFubmVscyA9IGdsTnVtQ2hhbm5lbHM7XG5cblx0XHQvLyBTZXQgaW50ZXJuYWwgZmlsdGVyaW5nL3dyYXAgdHlwZXMuXG5cdFx0dGhpcy5pbnRlcm5hbEZpbHRlciA9IERhdGFMYXllci5nZXRJbnRlcm5hbEZpbHRlcih7IGdsLCBmaWx0ZXIsIGludGVybmFsVHlwZSwgbmFtZSwgZXJyb3JDYWxsYmFjayB9KTtcblx0XHR0aGlzLmdsRmlsdGVyID0gZ2xbdGhpcy5pbnRlcm5hbEZpbHRlcl07XG5cdFx0dGhpcy5pbnRlcm5hbFdyYXBTID0gRGF0YUxheWVyLmdldEludGVybmFsV3JhcCh7IGdsLCB3cmFwOiB3cmFwUywgbmFtZSB9KTtcblx0XHR0aGlzLmdsV3JhcFMgPSBnbFt0aGlzLmludGVybmFsV3JhcFNdO1xuXHRcdHRoaXMuaW50ZXJuYWxXcmFwVCA9IERhdGFMYXllci5nZXRJbnRlcm5hbFdyYXAoeyBnbCwgd3JhcDogd3JhcFQsIG5hbWUgfSk7XG5cdFx0dGhpcy5nbFdyYXBUID0gZ2xbdGhpcy5pbnRlcm5hbFdyYXBUXTtcblxuXHRcdC8vIE51bSBidWZmZXJzIGlzIHRoZSBudW1iZXIgb2Ygc3RhdGVzIHRvIHN0b3JlIGZvciB0aGlzIGRhdGEuXG5cdFx0Y29uc3QgbnVtQnVmZmVycyA9IHBhcmFtcy5udW1CdWZmZXJzICE9PSB1bmRlZmluZWQgPyBwYXJhbXMubnVtQnVmZmVycyA6IDE7XG5cdFx0aWYgKCFpc1Bvc2l0aXZlSW50ZWdlcihudW1CdWZmZXJzKSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIG51bUJ1ZmZlcnM6ICR7bnVtQnVmZmVyc30gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIiwgbXVzdCBiZSBwb3NpdGl2ZSBpbnRlZ2VyLmApO1xuXHRcdH1cblx0XHR0aGlzLm51bUJ1ZmZlcnMgPSBudW1CdWZmZXJzO1xuXG5cdFx0dGhpcy5pbml0QnVmZmVycyhkYXRhKTtcblx0fVxuXG5cdHByaXZhdGUgc3RhdGljIGNhbGNTaXplKGRpbWVuc2lvbnM6IG51bWJlciB8IFtudW1iZXIsIG51bWJlcl0sIG5hbWU6IHN0cmluZykge1xuXHRcdGxldCBsZW5ndGgsIHdpZHRoLCBoZWlnaHQ7XG5cdFx0aWYgKCFpc05hTihkaW1lbnNpb25zIGFzIG51bWJlcikpIHtcblx0XHRcdGlmICghaXNQb3NpdGl2ZUludGVnZXIoZGltZW5zaW9ucykpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGxlbmd0aCAke2RpbWVuc2lvbnN9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIuYCk7XG5cdFx0XHR9XG5cdFx0XHRsZW5ndGggPSBkaW1lbnNpb25zIGFzIG51bWJlcjtcblx0XHRcdC8vIENhbGMgcG93ZXIgb2YgdHdvIHdpZHRoIGFuZCBoZWlnaHQgZm9yIGxlbmd0aC5cblx0XHRcdGxldCBleHAgPSAxO1xuXHRcdFx0bGV0IHJlbWFpbmRlciA9IGxlbmd0aDtcblx0XHRcdHdoaWxlIChyZW1haW5kZXIgPiAyKSB7XG5cdFx0XHRcdGV4cCsrO1xuXHRcdFx0XHRyZW1haW5kZXIgLz0gMjtcblx0XHRcdH1cblx0XHRcdHdpZHRoID0gTWF0aC5wb3coMiwgTWF0aC5mbG9vcihleHAgLyAyKSArIGV4cCAlIDIpO1xuXHRcdFx0aGVpZ2h0ID0gTWF0aC5wb3coMiwgTWF0aC5mbG9vcihleHAvMikpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR3aWR0aCA9IChkaW1lbnNpb25zIGFzIFtudW1iZXIsIG51bWJlcl0pWzBdO1xuXHRcdFx0aWYgKCFpc1Bvc2l0aXZlSW50ZWdlcih3aWR0aCkpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHdpZHRoICR7d2lkdGh9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIuYCk7XG5cdFx0XHR9XG5cdFx0XHRoZWlnaHQgPSAoZGltZW5zaW9ucyBhcyBbbnVtYmVyLCBudW1iZXJdKVsxXTtcblx0XHRcdGlmICghaXNQb3NpdGl2ZUludGVnZXIoaGVpZ2h0KSkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgaGVpZ2h0ICR7aGVpZ2h0fSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLmApO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4geyB3aWR0aCwgaGVpZ2h0LCBsZW5ndGggfTtcblx0fVxuXG5cdHByaXZhdGUgc3RhdGljIGdldEludGVybmFsV3JhcChcblx0XHRwYXJhbXM6IHtcblx0XHRcdGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQgfCBXZWJHTDJSZW5kZXJpbmdDb250ZXh0LFxuXHRcdFx0d3JhcDogRGF0YUxheWVyV3JhcFR5cGUsXG5cdFx0XHRuYW1lOiBzdHJpbmcsXG5cdFx0fSxcblx0KSB7XG5cdFx0Y29uc3QgeyBnbCwgd3JhcCwgbmFtZSB9ID0gcGFyYW1zO1xuXHRcdC8vIFdlYmdsMi4wIHN1cHBvcnRzIGFsbCBjb21iaW5hdGlvbnMgb2YgdHlwZXMgYW5kIGZpbHRlcmluZy5cblx0XHRpZiAoaXNXZWJHTDIoZ2wpKSB7XG5cdFx0XHRyZXR1cm4gd3JhcDtcblx0XHR9XG5cdFx0Ly8gQ0xBTVBfVE9fRURHRSBpcyBhbHdheXMgc3VwcG9ydGVkLlxuXHRcdGlmICh3cmFwID09PSBDTEFNUF9UT19FREdFKSB7XG5cdFx0XHRyZXR1cm4gd3JhcDtcblx0XHR9XG5cdFx0aWYgKCFpc1dlYkdMMihnbCkpIHtcblx0XHRcdC8vIFRPRE86IHdlIG1heSB3YW50IHRvIGhhbmRsZSB0aGlzIGluIHRoZSBmcmFnIHNoYWRlci5cblx0XHRcdC8vIFJFUEVBVCBhbmQgTUlSUk9SX1JFUEVBVCB3cmFwIG5vdCBzdXBwb3J0ZWQgZm9yIG5vbi1wb3dlciBvZiAyIHRleHR1cmVzIGluIHNhZmFyaS5cblx0XHRcdC8vIEkndmUgdGVzdGVkIHRoaXMgYW5kIGl0IHNlZW1zIHRoYXQgc29tZSBwb3dlciBvZiAyIHRleHR1cmVzIHdpbGwgd29yayAoNTEyIHggNTEyKSxcblx0XHRcdC8vIGJ1dCBub3Qgb3RoZXJzICgxMDI0eDEwMjQpLCBzbyBsZXQncyBqdXN0IGNoYW5nZSBhbGwgV2ViR0wgMS4wIHRvIENMQU1QLlxuXHRcdFx0Ly8gV2l0aG91dCB0aGlzLCB3ZSBjdXJyZW50bHkgZ2V0IGFuIGVycm9yIGF0IGRyYXdBcnJheXMoKTpcblx0XHRcdC8vIFwiV2ViR0w6IGRyYXdBcnJheXM6IHRleHR1cmUgYm91bmQgdG8gdGV4dHVyZSB1bml0IDAgaXMgbm90IHJlbmRlcmFibGUuXG5cdFx0XHQvLyBJdCBtYXliZSBub24tcG93ZXItb2YtMiBhbmQgaGF2ZSBpbmNvbXBhdGlibGUgdGV4dHVyZSBmaWx0ZXJpbmcgb3IgaXMgbm90XG5cdFx0XHQvLyAndGV4dHVyZSBjb21wbGV0ZScsIG9yIGl0IGlzIGEgZmxvYXQvaGFsZi1mbG9hdCB0eXBlIHdpdGggbGluZWFyIGZpbHRlcmluZyBhbmRcblx0XHRcdC8vIHdpdGhvdXQgdGhlIHJlbGV2YW50IGZsb2F0L2hhbGYtZmxvYXQgbGluZWFyIGV4dGVuc2lvbiBlbmFibGVkLlwiXG5cdFx0XHRjb25zb2xlLndhcm4oYEZhbGxpbmcgYmFjayB0byBDTEFNUF9UT19FREdFIHdyYXBwaW5nIGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIgZm9yIFdlYkdMIDEuYCk7XG5cdFx0XHRyZXR1cm4gQ0xBTVBfVE9fRURHRTtcblx0XHR9XG5cdFx0cmV0dXJuIHdyYXA7XG5cdH1cblxuXHRwcml2YXRlIHN0YXRpYyBnZXRJbnRlcm5hbEZpbHRlcihcblx0XHRwYXJhbXM6IHtcblx0XHRcdGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQgfCBXZWJHTDJSZW5kZXJpbmdDb250ZXh0LFxuXHRcdFx0ZmlsdGVyOiBEYXRhTGF5ZXJGaWx0ZXJUeXBlLFxuXHRcdFx0aW50ZXJuYWxUeXBlOiBEYXRhTGF5ZXJUeXBlLFxuXHRcdFx0bmFtZTogc3RyaW5nLFxuXHRcdFx0ZXJyb3JDYWxsYmFjazogRXJyb3JDYWxsYmFjayxcblx0XHR9LFxuXHQpIHtcblx0XHRjb25zdCB7IGdsLCBlcnJvckNhbGxiYWNrLCBpbnRlcm5hbFR5cGUsIG5hbWUgfSA9IHBhcmFtcztcblx0XHRsZXQgeyBmaWx0ZXIgfSA9IHBhcmFtcztcblx0XHRpZiAoZmlsdGVyID09PSBORUFSRVNUKSB7XG5cdFx0XHQvLyBORUFSRVNUIGZpbHRlcmluZyBpcyBhbHdheXMgc3VwcG9ydGVkLlxuXHRcdFx0cmV0dXJuIGZpbHRlcjtcblx0XHR9XG5cblx0XHRpZiAoaW50ZXJuYWxUeXBlID09PSBIQUxGX0ZMT0FUKSB7XG5cdFx0XHQvLyBUT0RPOiB0ZXN0IGlmIGZsb2F0IGxpbmVhciBleHRlbnNpb24gaXMgYWN0dWFsbHkgd29ya2luZy5cblx0XHRcdGNvbnN0IGV4dGVuc2lvbiA9IGdldEV4dGVuc2lvbihnbCwgT0VTX1RFWFRVUkVfSEFsRl9GTE9BVF9MSU5FQVIsIGVycm9yQ2FsbGJhY2ssIHRydWUpXG5cdFx0XHRcdHx8IGdldEV4dGVuc2lvbihnbCwgT0VTX1RFWFRVUkVfRkxPQVRfTElORUFSLCBlcnJvckNhbGxiYWNrLCB0cnVlKTtcblx0XHRcdGlmICghZXh0ZW5zaW9uKSB7XG5cdFx0XHRcdGNvbnNvbGUud2FybihgRmFsbGluZyBiYWNrIHRvIE5FQVJFU1QgZmlsdGVyIGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIuYCk7XG5cdFx0XHRcdC8vVE9ETzogYWRkIGEgZmFsbGJhY2sgdGhhdCBkb2VzIHRoaXMgZmlsdGVyaW5nIGluIHRoZSBmcmFnIHNoYWRlcj8uXG5cdFx0XHRcdGZpbHRlciA9IE5FQVJFU1Q7XG5cdFx0XHR9XG5cdFx0fSBpZiAoaW50ZXJuYWxUeXBlID09PSBGTE9BVCkge1xuXHRcdFx0Y29uc3QgZXh0ZW5zaW9uID0gZ2V0RXh0ZW5zaW9uKGdsLCBPRVNfVEVYVFVSRV9GTE9BVF9MSU5FQVIsIGVycm9yQ2FsbGJhY2ssIHRydWUpO1xuXHRcdFx0aWYgKCFleHRlbnNpb24pIHtcblx0XHRcdFx0Y29uc29sZS53YXJuKGBGYWxsaW5nIGJhY2sgdG8gTkVBUkVTVCBmaWx0ZXIgZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdFx0Ly9UT0RPOiBhZGQgYSBmYWxsYmFjayB0aGF0IGRvZXMgdGhpcyBmaWx0ZXJpbmcgaW4gdGhlIGZyYWcgc2hhZGVyPy5cblx0XHRcdFx0ZmlsdGVyID0gTkVBUkVTVDtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGZpbHRlcjtcblx0fVxuXG5cdHByaXZhdGUgc3RhdGljIGdldEludGVybmFsVHlwZShcblx0XHRwYXJhbXM6IHtcblx0XHRcdGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQgfCBXZWJHTDJSZW5kZXJpbmdDb250ZXh0LFxuXHRcdFx0dHlwZTogRGF0YUxheWVyVHlwZSxcblx0XHRcdGdsc2xWZXJzaW9uOiBHTFNMVmVyc2lvbixcblx0XHRcdHdyaXRhYmxlOiBib29sZWFuLFxuXHRcdFx0ZmlsdGVyOiBEYXRhTGF5ZXJGaWx0ZXJUeXBlLFxuXHRcdFx0bmFtZTogc3RyaW5nLFxuXHRcdFx0ZXJyb3JDYWxsYmFjazogRXJyb3JDYWxsYmFjayxcblx0XHR9LFxuXHQpIHtcblx0XHRjb25zdCB7IGdsLCBlcnJvckNhbGxiYWNrLCB3cml0YWJsZSwgbmFtZSwgZ2xzbFZlcnNpb24gfSA9IHBhcmFtcztcblx0XHRjb25zdCB7IHR5cGUgfSA9IHBhcmFtcztcblx0XHRsZXQgaW50ZXJuYWxUeXBlID0gdHlwZTtcblx0XHQvLyBDaGVjayBpZiBpbnQgdHlwZXMgYXJlIHN1cHBvcnRlZC5cblx0XHRjb25zdCBpbnRDYXN0ID0gRGF0YUxheWVyLnNob3VsZENhc3RJbnRUeXBlQXNGbG9hdChwYXJhbXMpO1xuXHRcdGlmIChpbnRDYXN0KSB7XG5cdFx0XHRpZiAoaW50ZXJuYWxUeXBlID09PSBVTlNJR05FRF9CWVRFIHx8IGludGVybmFsVHlwZSA9PT0gQllURSkge1xuXHRcdFx0XHQvLyBJbnRlZ2VycyBiZXR3ZWVuIDAgYW5kIDIwNDggY2FuIGJlIGV4YWN0bHkgcmVwcmVzZW50ZWQgYnkgaGFsZiBmbG9hdCAoYW5kIGFsc28gYmV0d2VlbiDiiJIyMDQ4IGFuZCAwKVxuXHRcdFx0XHRpbnRlcm5hbFR5cGUgPSBIQUxGX0ZMT0FUO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gSW50ZWdlcnMgYmV0d2VlbiAwIGFuZCAxNjc3NzIxNiBjYW4gYmUgZXhhY3RseSByZXByZXNlbnRlZCBieSBmbG9hdDMyIChhbHNvIGFwcGxpZXMgZm9yIG5lZ2F0aXZlIGludGVnZXJzIGJldHdlZW4g4oiSMTY3NzcyMTYgYW5kIDApXG5cdFx0XHRcdC8vIFRoaXMgaXMgc3VmZmljaWVudCBmb3IgVU5TSUdORURfU0hPUlQgYW5kIFNIT1JUIHR5cGVzLlxuXHRcdFx0XHQvLyBMYXJnZSBVTlNJR05FRF9JTlQgYW5kIElOVCBjYW5ub3QgYmUgcmVwcmVzZW50ZWQgYnkgRkxPQVQgdHlwZS5cblx0XHRcdFx0aWYgKGludGVybmFsVHlwZSA9PT0gSU5UIHx8IGludGVybmFsVHlwZSA9PT0gVU5TSUdORURfSU5UKSB7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdH1cblx0XHRcdFx0Y29uc29sZS53YXJuKGBGYWxsaW5nIGJhY2sgJHtpbnRlcm5hbFR5cGV9IHR5cGUgdG8gRkxPQVQgdHlwZSBmb3IgZ2xzbDEueCBzdXBwb3J0IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIuXG5MYXJnZSBVTlNJR05FRF9JTlQgb3IgSU5UIHdpdGggYWJzb2x1dGUgdmFsdWUgPiAxNiw3NzcsMjE2IGFyZSBub3Qgc3VwcG9ydGVkLCBvbiBtb2JpbGUgVU5TSUdORURfSU5ULCBJTlQsIFVOU0lHTkVEX1NIT1JULCBhbmQgU0hPUlQgd2l0aCBhYnNvbHV0ZSB2YWx1ZSA+IDIsMDQ4IG1heSBub3QgYmUgc3VwcG9ydGVkLmApO1xuXHRcdFx0XHRpbnRlcm5hbFR5cGUgPSBGTE9BVDtcblx0XHRcdH1cblx0XHR9XG5cdFx0Ly8gQ2hlY2sgaWYgZmxvYXQzMiBzdXBwb3J0ZWQuXG5cdFx0aWYgKCFpc1dlYkdMMihnbCkpIHtcblx0XHRcdGlmIChpbnRlcm5hbFR5cGUgPT09IEZMT0FUKSB7XG5cdFx0XHRcdGNvbnN0IGV4dGVuc2lvbiA9IGdldEV4dGVuc2lvbihnbCwgT0VTX1RFWFRVUkVfRkxPQVQsIGVycm9yQ2FsbGJhY2ssIHRydWUpO1xuXHRcdFx0XHRpZiAoIWV4dGVuc2lvbikge1xuXHRcdFx0XHRcdGNvbnNvbGUud2FybihgRkxPQVQgbm90IHN1cHBvcnRlZCwgZmFsbGluZyBiYWNrIHRvIEhBTEZfRkxPQVQgdHlwZSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLmApO1xuXHRcdFx0XHRcdGludGVybmFsVHlwZSA9IEhBTEZfRkxPQVQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTc0NzY2MzIvd2ViZ2wtZXh0ZW5zaW9uLXN1cHBvcnQtYWNyb3NzLWJyb3dzZXJzXG5cdFx0XHRcdC8vIFJlbmRlcmluZyB0byBhIGZsb2F0aW5nLXBvaW50IHRleHR1cmUgbWF5IG5vdCBiZSBzdXBwb3J0ZWQsXG5cdFx0XHRcdC8vIGV2ZW4gaWYgdGhlIE9FU190ZXh0dXJlX2Zsb2F0IGV4dGVuc2lvbiBpcyBzdXBwb3J0ZWQuXG5cdFx0XHRcdC8vIFR5cGljYWxseSwgdGhpcyBmYWlscyBvbiBjdXJyZW50IG1vYmlsZSBoYXJkd2FyZS5cblx0XHRcdFx0Ly8gVG8gY2hlY2sgaWYgdGhpcyBpcyBzdXBwb3J0ZWQsIHlvdSBoYXZlIHRvIGNhbGwgdGhlIFdlYkdMXG5cdFx0XHRcdC8vIGNoZWNrRnJhbWVidWZmZXJTdGF0dXMoKSBmdW5jdGlvbi5cblx0XHRcdFx0aWYgKHdyaXRhYmxlKSB7XG5cdFx0XHRcdFx0Y29uc3QgdmFsaWQgPSBEYXRhTGF5ZXIudGVzdEZyYW1lYnVmZmVyV3JpdGUoeyBnbCwgdHlwZTogaW50ZXJuYWxUeXBlLCBnbHNsVmVyc2lvbiB9KTtcblx0XHRcdFx0XHRpZiAoIXZhbGlkICYmIGludGVybmFsVHlwZSAhPT0gSEFMRl9GTE9BVCkge1xuXHRcdFx0XHRcdFx0Y29uc29sZS53YXJuKGBGTE9BVCBub3Qgc3VwcG9ydGVkIGZvciB3cml0aW5nIG9wZXJhdGlvbnMsIGZhbGxpbmcgYmFjayB0byBIQUxGX0ZMT0FUIHR5cGUgZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdFx0XHRcdGludGVybmFsVHlwZSA9IEhBTEZfRkxPQVQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHQvLyBNdXN0IHN1cHBvcnQgYXQgbGVhc3QgaGFsZiBmbG9hdCBpZiB1c2luZyBhIGZsb2F0IHR5cGUuXG5cdFx0XHRpZiAoaW50ZXJuYWxUeXBlID09PSBIQUxGX0ZMT0FUKSB7XG5cdFx0XHRcdGdldEV4dGVuc2lvbihnbCwgT0VTX1RFWFRVUkVfSEFMRl9GTE9BVCwgZXJyb3JDYWxsYmFjayk7XG5cdFx0XHRcdC8vIFRPRE86IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzU0MjQ4NjMzL2Nhbm5vdC1jcmVhdGUtaGFsZi1mbG9hdC1vZXMtdGV4dHVyZS1mcm9tLXVpbnQxNmFycmF5LW9uLWlwYWRcblx0XHRcdFx0aWYgKHdyaXRhYmxlKSB7XG5cdFx0XHRcdFx0Y29uc3QgdmFsaWQgPSBEYXRhTGF5ZXIudGVzdEZyYW1lYnVmZmVyV3JpdGUoeyBnbCwgdHlwZTogaW50ZXJuYWxUeXBlLCBnbHNsVmVyc2lvbiB9KTtcblx0XHRcdFx0XHRpZiAoIXZhbGlkKSB7XG5cdFx0XHRcdFx0XHRlcnJvckNhbGxiYWNrKGBUaGlzIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCByZW5kZXJpbmcgdG8gSEFMRl9GTE9BVCB0ZXh0dXJlcy5gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0XG5cdFx0Ly8gTG9hZCBhZGRpdGlvbmFsIGV4dGVuc2lvbnMgaWYgbmVlZGVkLlxuXHRcdGlmICh3cml0YWJsZSAmJiBpc1dlYkdMMihnbCkgJiYgKGludGVybmFsVHlwZSA9PT0gSEFMRl9GTE9BVCB8fCBpbnRlcm5hbFR5cGUgPT09IEZMT0FUKSkge1xuXHRcdFx0Z2V0RXh0ZW5zaW9uKGdsLCBFWFRfQ09MT1JfQlVGRkVSX0ZMT0FULCBlcnJvckNhbGxiYWNrKTtcblx0XHR9XG5cdFx0cmV0dXJuIGludGVybmFsVHlwZTtcblx0fVxuXG5cdHByaXZhdGUgc3RhdGljIHNob3VsZENhc3RJbnRUeXBlQXNGbG9hdChcblx0XHRwYXJhbXM6IHtcblx0XHRcdGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQgfCBXZWJHTDJSZW5kZXJpbmdDb250ZXh0LFxuXHRcdFx0dHlwZTogRGF0YUxheWVyVHlwZSxcblx0XHRcdGZpbHRlcjogRGF0YUxheWVyRmlsdGVyVHlwZSxcblx0XHRcdGdsc2xWZXJzaW9uOiBHTFNMVmVyc2lvbixcblx0XHR9XG5cdCkge1xuXHRcdGNvbnN0IHsgZ2wsIHR5cGUsIGZpbHRlciwgZ2xzbFZlcnNpb24gfSA9IHBhcmFtcztcblx0XHRpZiAoZ2xzbFZlcnNpb24gPT09IEdMU0wzICYmIGlzV2ViR0wyKGdsKSkgcmV0dXJuIGZhbHNlO1xuXHRcdC8vIFVOU0lHTkVEX0JZVEUgYW5kIExJTkVBUiBmaWx0ZXJpbmcgaXMgbm90IHN1cHBvcnRlZCwgY2FzdCBhcyBmbG9hdC5cblx0XHRpZiAodHlwZSA9PT0gVU5TSUdORURfQllURSAmJiBmaWx0ZXIgPT09IExJTkVBUikge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdC8vIEludCB0ZXh0dXJlcyAob3RoZXIgdGhhbiBVTlNJR05FRF9CWVRFKSBhcmUgbm90IHN1cHBvcnRlZCBieSBXZWJHTDEuMCBvciBnbHNsMS54LlxuXHRcdC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzU1ODAzMDE3L2hvdy10by1zZWxlY3Qtd2ViZ2wtZ2xzbC1zYW1wbGVyLXR5cGUtZnJvbS10ZXh0dXJlLWZvcm1hdC1wcm9wZXJ0aWVzXG5cdFx0Ly8gVXNlIEhBTEZfRkxPQVQvRkxPQVQgaW5zdGVhZC5cblx0XHRyZXR1cm4gdHlwZSA9PT0gQllURSB8fCB0eXBlID09PSBTSE9SVCB8fCB0eXBlID09PSBJTlQgfHwgdHlwZSA9PT0gVU5TSUdORURfU0hPUlQgfHwgdHlwZSA9PT0gVU5TSUdORURfSU5UO1xuXHR9XG5cblx0cHJpdmF0ZSBzdGF0aWMgZ2V0R0xUZXh0dXJlUGFyYW1ldGVycyhcblx0XHRwYXJhbXM6IHtcblx0XHRcdGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQgfCBXZWJHTDJSZW5kZXJpbmdDb250ZXh0LFxuXHRcdFx0bmFtZTogc3RyaW5nLFxuXHRcdFx0bnVtQ29tcG9uZW50czogRGF0YUxheWVyTnVtQ29tcG9uZW50cyxcblx0XHRcdGludGVybmFsVHlwZTogRGF0YUxheWVyVHlwZSxcblx0XHRcdHdyaXRhYmxlOiBib29sZWFuLFxuXHRcdFx0Z2xzbFZlcnNpb246IEdMU0xWZXJzaW9uLFxuXHRcdFx0ZXJyb3JDYWxsYmFjazogRXJyb3JDYWxsYmFjayxcblx0XHR9XG5cdCkge1xuXHRcdGNvbnN0IHsgZ2wsIGVycm9yQ2FsbGJhY2ssIG5hbWUsIG51bUNvbXBvbmVudHMsIGludGVybmFsVHlwZSwgd3JpdGFibGUsIGdsc2xWZXJzaW9uIH0gPSBwYXJhbXM7XG5cdFx0Ly8gaHR0cHM6Ly93d3cua2hyb25vcy5vcmcvcmVnaXN0cnkvd2ViZ2wvc3BlY3MvbGF0ZXN0LzIuMC8jVEVYVFVSRV9UWVBFU19GT1JNQVRTX0ZST01fRE9NX0VMRU1FTlRTX1RBQkxFXG5cdFx0bGV0IGdsVHlwZTogbnVtYmVyIHwgdW5kZWZpbmVkLFxuXHRcdFx0Z2xGb3JtYXQ6IG51bWJlciB8IHVuZGVmaW5lZCxcblx0XHRcdGdsSW50ZXJuYWxGb3JtYXQ6IG51bWJlciB8IHVuZGVmaW5lZCxcblx0XHRcdGdsTnVtQ2hhbm5lbHM6IG51bWJlciB8IHVuZGVmaW5lZDtcblxuXHRcdGlmIChpc1dlYkdMMihnbCkpIHtcblx0XHRcdGdsTnVtQ2hhbm5lbHMgPSBudW1Db21wb25lbnRzO1xuXHRcdFx0Ly8gaHR0cHM6Ly93d3cua2hyb25vcy5vcmcvcmVnaXN0cnkvd2ViZ2wvZXh0ZW5zaW9ucy9FWFRfY29sb3JfYnVmZmVyX2Zsb2F0L1xuXHRcdFx0Ly8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1dlYkdMUmVuZGVyaW5nQ29udGV4dC90ZXhJbWFnZTJEXG5cdFx0XHQvLyBUaGUgc2l6ZWQgaW50ZXJuYWwgZm9ybWF0IFJHQnh4eCBhcmUgbm90IGNvbG9yLXJlbmRlcmFibGUgZm9yIHNvbWUgcmVhc29uLlxuXHRcdFx0Ly8gSWYgbnVtQ29tcG9uZW50cyA9PSAzIGZvciBhIHdyaXRhYmxlIHRleHR1cmUsIHVzZSBSR0JBIGluc3RlYWQuXG5cdFx0XHQvLyBQYWdlIDUgb2YgaHR0cHM6Ly93d3cua2hyb25vcy5vcmcvZmlsZXMvd2ViZ2wyMC1yZWZlcmVuY2UtZ3VpZGUucGRmXG5cdFx0XHRpZiAobnVtQ29tcG9uZW50cyA9PT0gMyAmJiB3cml0YWJsZSkge1xuXHRcdFx0XHRnbE51bUNoYW5uZWxzID0gNDtcblx0XHRcdH1cblx0XHRcdGlmIChpbnRlcm5hbFR5cGUgPT09IEZMT0FUIHx8IGludGVybmFsVHlwZSA9PT0gSEFMRl9GTE9BVCkge1xuXHRcdFx0XHRzd2l0Y2ggKGdsTnVtQ2hhbm5lbHMpIHtcblx0XHRcdFx0XHRjYXNlIDE6XG5cdFx0XHRcdFx0XHRnbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SRUQ7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDI6XG5cdFx0XHRcdFx0XHRnbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SRztcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgMzpcblx0XHRcdFx0XHRcdGdsRm9ybWF0ID0gZ2wuUkdCO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSA0OlxuXHRcdFx0XHRcdFx0Z2xGb3JtYXQgPSBnbC5SR0JBO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgZ2xOdW1DaGFubmVscyAke2dsTnVtQ2hhbm5lbHN9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIuYCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAoZ2xzbFZlcnNpb24gPT09IEdMU0wxICYmIGludGVybmFsVHlwZSA9PT0gVU5TSUdORURfQllURSkge1xuXHRcdFx0XHRzd2l0Y2ggKGdsTnVtQ2hhbm5lbHMpIHtcblx0XHRcdFx0XHQvLyBGb3IgcmVhZCBvbmx5IHRleHR1cmVzIGluIFdlYkdMIDEuMCwgdXNlIGdsLkFMUEhBIGFuZCBnbC5MVU1JTkFOQ0VfQUxQSEEuXG5cdFx0XHRcdFx0Ly8gT3RoZXJ3aXNlIHVzZSBSR0IvUkdCQS5cblx0XHRcdFx0XHRjYXNlIDE6XG5cdFx0XHRcdFx0XHRpZiAoIXdyaXRhYmxlKSB7XG5cdFx0XHRcdFx0XHRcdGdsRm9ybWF0ID0gZ2wuQUxQSEE7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGNhc2UgMjpcblx0XHRcdFx0XHRcdGlmICghd3JpdGFibGUpIHtcblx0XHRcdFx0XHRcdFx0Z2xGb3JtYXQgPSBnbC5MVU1JTkFOQ0VfQUxQSEE7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGNhc2UgMzpcblx0XHRcdFx0XHRcdGdsRm9ybWF0ID0gZ2wuUkdCO1xuXHRcdFx0XHRcdFx0Z2xOdW1DaGFubmVscyA9IDM7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDQ6XG5cdFx0XHRcdFx0XHRnbEZvcm1hdCA9IGdsLlJHQkE7XG5cdFx0XHRcdFx0XHRnbE51bUNoYW5uZWxzID0gNDtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGdsTnVtQ2hhbm5lbHMgJHtnbE51bUNoYW5uZWxzfSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLmApO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzd2l0Y2ggKGdsTnVtQ2hhbm5lbHMpIHtcblx0XHRcdFx0XHRjYXNlIDE6XG5cdFx0XHRcdFx0XHRnbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SRURfSU5URUdFUjtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgMjpcblx0XHRcdFx0XHRcdGdsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHX0lOVEVHRVI7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDM6XG5cdFx0XHRcdFx0XHRnbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR0JfSU5URUdFUjtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgNDpcblx0XHRcdFx0XHRcdGdsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHQkFfSU5URUdFUjtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGdsTnVtQ2hhbm5lbHMgJHtnbE51bUNoYW5uZWxzfSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLmApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRzd2l0Y2ggKGludGVybmFsVHlwZSkge1xuXHRcdFx0XHRjYXNlIEhBTEZfRkxPQVQ6XG5cdFx0XHRcdFx0Z2xUeXBlID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLkhBTEZfRkxPQVQ7XG5cdFx0XHRcdFx0c3dpdGNoIChnbE51bUNoYW5uZWxzKSB7XG5cdFx0XHRcdFx0XHRjYXNlIDE6XG5cdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUjE2Rjtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDI6XG5cdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkcxNkY7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHQjE2Rjtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDQ6XG5cdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkdCQTE2Rjtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGdsTnVtQ2hhbm5lbHMgJHtnbE51bUNoYW5uZWxzfSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLmApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBGTE9BVDpcblx0XHRcdFx0XHRnbFR5cGUgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuRkxPQVQ7XG5cdFx0XHRcdFx0c3dpdGNoIChnbE51bUNoYW5uZWxzKSB7XG5cdFx0XHRcdFx0XHRjYXNlIDE6XG5cdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUjMyRjtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDI6XG5cdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkczMkY7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHQjMyRjtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDQ6XG5cdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkdCQTMyRjtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGdsTnVtQ2hhbm5lbHMgJHtnbE51bUNoYW5uZWxzfSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLmApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBVTlNJR05FRF9CWVRFOlxuXHRcdFx0XHRcdGdsVHlwZSA9IGdsLlVOU0lHTkVEX0JZVEU7XG5cdFx0XHRcdFx0aWYgKGdsc2xWZXJzaW9uID09PSBHTFNMMSAmJiBpbnRlcm5hbFR5cGUgPT09IFVOU0lHTkVEX0JZVEUpIHtcblx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSBnbEZvcm1hdDtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0c3dpdGNoIChnbE51bUNoYW5uZWxzKSB7XG5cdFx0XHRcdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlI4VUk7XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdGNhc2UgMjpcblx0XHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHOFVJO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRjYXNlIDM6XG5cdFx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR0I4VUk7XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdGNhc2UgNDpcblx0XHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHQkE4VUk7XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBnbE51bUNoYW5uZWxzICR7Z2xOdW1DaGFubmVsc30gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgQllURTpcblx0XHRcdFx0XHRnbFR5cGUgPSBnbC5CWVRFO1xuXHRcdFx0XHRcdHN3aXRjaCAoZ2xOdW1DaGFubmVscykge1xuXHRcdFx0XHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlI4STtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDI6XG5cdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkc4STtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDM6XG5cdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkdCOEk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSA0OlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHQkE4STtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGdsTnVtQ2hhbm5lbHMgJHtnbE51bUNoYW5uZWxzfSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLmApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBTSE9SVDpcblx0XHRcdFx0XHRnbFR5cGUgPSBnbC5TSE9SVDtcblx0XHRcdFx0XHRzd2l0Y2ggKGdsTnVtQ2hhbm5lbHMpIHtcblx0XHRcdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SMTZJO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgMjpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SRzE2STtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDM6XG5cdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkdCMTZJO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgNDpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR0JBMTZJO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgZ2xOdW1DaGFubmVscyAke2dsTnVtQ2hhbm5lbHN9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIuYCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFVOU0lHTkVEX1NIT1JUOlxuXHRcdFx0XHRcdGdsVHlwZSA9IGdsLlVOU0lHTkVEX1NIT1JUO1xuXHRcdFx0XHRcdHN3aXRjaCAoZ2xOdW1DaGFubmVscykge1xuXHRcdFx0XHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlIxNlVJO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgMjpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SRzE2VUk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHQjE2VUk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSA0OlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHQkExNlVJO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgZ2xOdW1DaGFubmVscyAke2dsTnVtQ2hhbm5lbHN9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIuYCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIElOVDpcblx0XHRcdFx0XHRnbFR5cGUgPSBnbC5JTlQ7XG5cdFx0XHRcdFx0c3dpdGNoIChnbE51bUNoYW5uZWxzKSB7XG5cdFx0XHRcdFx0XHRjYXNlIDE6XG5cdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUjMySTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDI6XG5cdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkczMkk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHQjMySTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDQ6XG5cdFx0XHRcdFx0XHRcdGdsSW50ZXJuYWxGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkdCQTMySTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGdsTnVtQ2hhbm5lbHMgJHtnbE51bUNoYW5uZWxzfSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLmApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBVTlNJR05FRF9JTlQ6XG5cdFx0XHRcdFx0Z2xUeXBlID0gZ2wuVU5TSUdORURfSU5UO1xuXHRcdFx0XHRcdHN3aXRjaCAoZ2xOdW1DaGFubmVscykge1xuXHRcdFx0XHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlIzMlVJO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgMjpcblx0XHRcdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SRzMyVUk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHQjMyVUk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSA0OlxuXHRcdFx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHQkEzMlVJO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgZ2xOdW1DaGFubmVscyAke2dsTnVtQ2hhbm5lbHN9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIuYCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgdHlwZSAke2ludGVybmFsVHlwZX0gZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0c3dpdGNoIChudW1Db21wb25lbnRzKSB7XG5cdFx0XHRcdC8vIFRPRE86IGZvciByZWFkIG9ubHkgdGV4dHVyZXMgaW4gV2ViR0wgMS4wLCB3ZSBjb3VsZCB1c2UgZ2wuQUxQSEEgYW5kIGdsLkxVTUlOQU5DRV9BTFBIQSBoZXJlLlxuXHRcdFx0XHRjYXNlIDE6XG5cdFx0XHRcdFx0aWYgKCF3cml0YWJsZSkge1xuXHRcdFx0XHRcdFx0Z2xGb3JtYXQgPSBnbC5BTFBIQTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdGlmICghd3JpdGFibGUpIHtcblx0XHRcdFx0XHRcdGdsRm9ybWF0ID0gZ2wuTFVNSU5BTkNFX0FMUEhBO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRjYXNlIDM6XG5cdFx0XHRcdFx0Z2xGb3JtYXQgPSBnbC5SR0I7XG5cdFx0XHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCA9IGdsLlJHQjtcblx0XHRcdFx0XHRnbE51bUNoYW5uZWxzID0gMztcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSA0OlxuXHRcdFx0XHRcdGdsRm9ybWF0ID0gZ2wuUkdCQTtcblx0XHRcdFx0XHRnbEludGVybmFsRm9ybWF0ID0gZ2wuUkdCQTtcblx0XHRcdFx0XHRnbE51bUNoYW5uZWxzID0gNDtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIG51bUNvbXBvbmVudHMgJHtudW1Db21wb25lbnRzfSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLmApO1xuXHRcdFx0fVxuXHRcdFx0c3dpdGNoIChpbnRlcm5hbFR5cGUpIHtcblx0XHRcdFx0Y2FzZSBGTE9BVDpcblx0XHRcdFx0XHRnbFR5cGUgPSBnbC5GTE9BVDtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBIQUxGX0ZMT0FUOlxuXHRcdFx0XHRcdGdsVHlwZSA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5IQUxGX0ZMT0FUIHx8IGdldEV4dGVuc2lvbihnbCwgT0VTX1RFWFRVUkVfSEFMRl9GTE9BVCwgZXJyb3JDYWxsYmFjaykuSEFMRl9GTE9BVF9PRVMgYXMgbnVtYmVyO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFVOU0lHTkVEX0JZVEU6XG5cdFx0XHRcdFx0Z2xUeXBlID0gZ2wuVU5TSUdORURfQllURTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Ly8gTm8gb3RoZXIgdHlwZXMgYXJlIHN1cHBvcnRlZCBpbiBnbHNsMS54XG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCB0eXBlICR7aW50ZXJuYWxUeXBlfSBpbiBXZWJHTCAxLjAgZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBDaGVjayBmb3IgbWlzc2luZyBwYXJhbXMuXG5cdFx0aWYgKGdsVHlwZSA9PT0gdW5kZWZpbmVkIHx8IGdsRm9ybWF0ID09PSB1bmRlZmluZWQgfHwgZ2xJbnRlcm5hbEZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRjb25zdCBtaXNzaW5nUGFyYW1zID0gW107XG5cdFx0XHRpZiAoZ2xUeXBlID09PSB1bmRlZmluZWQpIG1pc3NpbmdQYXJhbXMucHVzaCgnZ2xUeXBlJyk7XG5cdFx0XHRpZiAoZ2xGb3JtYXQgPT09IHVuZGVmaW5lZCkgbWlzc2luZ1BhcmFtcy5wdXNoKCdnbEZvcm1hdCcpO1xuXHRcdFx0aWYgKGdsSW50ZXJuYWxGb3JtYXQgPT09IHVuZGVmaW5lZCkgbWlzc2luZ1BhcmFtcy5wdXNoKCdnbEludGVybmFsRm9ybWF0Jyk7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdHlwZTogJHtpbnRlcm5hbFR5cGV9IGZvciBudW1Db21wb25lbnRzICR7bnVtQ29tcG9uZW50c30sIHVuYWJsZSB0byBpbml0IHBhcmFtZXRlciR7bWlzc2luZ1BhcmFtcy5sZW5ndGggPiAxID8gJ3MnIDogJyd9ICR7bWlzc2luZ1BhcmFtcy5qb2luKCcsICcpfSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLmApO1xuXHRcdH1cblx0XHRpZiAoZ2xOdW1DaGFubmVscyA9PT0gdW5kZWZpbmVkIHx8IG51bUNvbXBvbmVudHMgPCAxIHx8IG51bUNvbXBvbmVudHMgPiA0IHx8IGdsTnVtQ2hhbm5lbHMgPCBudW1Db21wb25lbnRzKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgbnVtQ2hhbm5lbHMgJHtnbE51bUNoYW5uZWxzfSBmb3IgbnVtQ29tcG9uZW50cyAke251bUNvbXBvbmVudHN9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIuYCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGdsRm9ybWF0LFxuXHRcdFx0Z2xJbnRlcm5hbEZvcm1hdCxcblx0XHRcdGdsVHlwZSxcblx0XHRcdGdsTnVtQ2hhbm5lbHMsXG5cdFx0fTtcblx0fVxuXG5cdHByaXZhdGUgc3RhdGljIHRlc3RGcmFtZWJ1ZmZlcldyaXRlKFxuXHRcdHBhcmFtczoge1xuXHRcdFx0Z2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCB8IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQsXG5cdFx0XHR0eXBlOiBEYXRhTGF5ZXJUeXBlLFxuXHRcdFx0Z2xzbFZlcnNpb246IEdMU0xWZXJzaW9uLFxuXHRcdH0sXG5cdCkge1xuXHRcdGNvbnN0IHsgZ2wsIHR5cGUsIGdsc2xWZXJzaW9uIH0gPSBwYXJhbXM7XG5cdFx0Y29uc3QgdGV4dHVyZSA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcblx0XHRpZiAoIXRleHR1cmUpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgdGV4dHVyZSk7XG5cblx0XHQvLyBEZWZhdWx0IHRvIG1vc3Qgd2lkZWx5IHN1cHBvcnRlZCBzZXR0aW5ncy5cblx0XHRjb25zdCB3cmFwUyA9IGdsW0NMQU1QX1RPX0VER0VdO1xuXHRcdGNvbnN0IHdyYXBUID0gZ2xbQ0xBTVBfVE9fRURHRV07XG5cdFx0Y29uc3QgZmlsdGVyID0gZ2xbTkVBUkVTVF07XG5cdFx0Ly8gVXNlIG5vbi1wb3dlciBvZiB0d28gZGltZW5zaW9ucyB0byBjaGVjayBmb3IgbW9yZSB1bml2ZXJzYWwgc3VwcG9ydC5cblx0XHQvLyAoSW4gY2FzZSBzaXplIG9mIERhdGFMYXllciBpcyBjaGFuZ2VkIGF0IGEgbGF0ZXIgcG9pbnQpLlxuXHRcdGNvbnN0IHdpZHRoID0gMTAwO1xuXHRcdGNvbnN0IGhlaWdodCA9IDEwMDtcblx0XHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9TLCB3cmFwUyk7XG5cdFx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfVCwgd3JhcFQpO1xuXHRcdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBmaWx0ZXIpO1xuXHRcdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCBmaWx0ZXIpO1xuXG5cdFx0Y29uc3QgeyBnbEludGVybmFsRm9ybWF0LCBnbEZvcm1hdCwgZ2xUeXBlIH0gPSBEYXRhTGF5ZXIuZ2V0R0xUZXh0dXJlUGFyYW1ldGVycyh7XG5cdFx0XHRnbCxcblx0XHRcdG5hbWU6ICd0ZXN0RnJhbWVidWZmZXJXcml0ZScsXG5cdFx0XHRudW1Db21wb25lbnRzOiAxLFxuXHRcdFx0d3JpdGFibGU6IHRydWUsXG5cdFx0XHRpbnRlcm5hbFR5cGU6IHR5cGUsXG5cdFx0XHRnbHNsVmVyc2lvbixcblx0XHRcdGVycm9yQ2FsbGJhY2s6ICgpID0+IHt9LFxuXHRcdH0pO1xuXHRcdGdsLnRleEltYWdlMkQoZ2wuVEVYVFVSRV8yRCwgMCwgZ2xJbnRlcm5hbEZvcm1hdCwgd2lkdGgsIGhlaWdodCwgMCwgZ2xGb3JtYXQsIGdsVHlwZSwgbnVsbCk7XG5cblx0XHQvLyBJbml0IGEgZnJhbWVidWZmZXIgZm9yIHRoaXMgdGV4dHVyZSBzbyB3ZSBjYW4gd3JpdGUgdG8gaXQuXG5cdFx0Y29uc3QgZnJhbWVidWZmZXIgPSBnbC5jcmVhdGVGcmFtZWJ1ZmZlcigpO1xuXHRcdGlmICghZnJhbWVidWZmZXIpIHtcblx0XHRcdC8vIENsZWFyIG91dCBhbGxvY2F0ZWQgbWVtb3J5LlxuXHRcdFx0Z2wuZGVsZXRlVGV4dHVyZSh0ZXh0dXJlKTtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0Z2wuYmluZEZyYW1lYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBmcmFtZWJ1ZmZlcik7XG5cdFx0Ly8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1dlYkdMUmVuZGVyaW5nQ29udGV4dC9mcmFtZWJ1ZmZlclRleHR1cmUyRFxuXHRcdGdsLmZyYW1lYnVmZmVyVGV4dHVyZTJEKGdsLkZSQU1FQlVGRkVSLCBnbC5DT0xPUl9BVFRBQ0hNRU5UMCwgZ2wuVEVYVFVSRV8yRCwgdGV4dHVyZSwgMCk7XG5cblx0XHRjb25zdCBzdGF0dXMgPSBnbC5jaGVja0ZyYW1lYnVmZmVyU3RhdHVzKGdsLkZSQU1FQlVGRkVSKTtcblx0XHRjb25zdCB2YWxpZFN0YXR1cyA9IHN0YXR1cyA9PT0gZ2wuRlJBTUVCVUZGRVJfQ09NUExFVEU7XG5cblx0XHQvLyBDbGVhciBvdXQgYWxsb2NhdGVkIG1lbW9yeS5cblx0XHRnbC5kZWxldGVUZXh0dXJlKHRleHR1cmUpO1xuXHRcdGdsLmRlbGV0ZUZyYW1lYnVmZmVyKGZyYW1lYnVmZmVyKTtcblxuXHRcdHJldHVybiB2YWxpZFN0YXR1cztcblx0fVxuXG5cdGdldCBidWZmZXJJbmRleCgpIHtcblx0XHRyZXR1cm4gdGhpcy5fYnVmZmVySW5kZXg7XG5cdH1cblxuXHRzYXZlQ3VycmVudFN0YXRlVG9EYXRhTGF5ZXIobGF5ZXI6IERhdGFMYXllcikge1xuXHRcdC8vIEEgbWV0aG9kIGZvciBzYXZpbmcgYSBjb3B5IG9mIHRoZSBjdXJyZW50IHN0YXRlIHdpdGhvdXQgYSBkcmF3IGNhbGwuXG5cdFx0Ly8gRHJhdyBjYWxscyBhcmUgZXhwZW5zaXZlLCB0aGlzIG9wdGltaXphdGlvbiBoZWxwcy5cblx0XHRpZiAodGhpcy5udW1CdWZmZXJzIDwgMikge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBDYW4ndCBjYWxsIERhdGFMYXllci5zYXZlQ3VycmVudFN0YXRlVG9EYXRhTGF5ZXIgb24gRGF0YUxheWVyICR7dGhpcy5uYW1lfSB3aXRoIGxlc3MgdGhhbiAyIGJ1ZmZlcnMuYCk7XG5cdFx0fVxuXHRcdGlmICghdGhpcy53cml0YWJsZSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBDYW4ndCBjYWxsIERhdGFMYXllci5zYXZlQ3VycmVudFN0YXRlVG9EYXRhTGF5ZXIgb24gcmVhZC1vbmx5IERhdGFMYXllciAke3RoaXMubmFtZX0uYCk7XG5cdFx0fVxuXHRcdGlmIChsYXllci53cml0YWJsZSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBDYW4ndCBjYWxsIERhdGFMYXllci5zYXZlQ3VycmVudFN0YXRlVG9EYXRhTGF5ZXIgb24gRGF0YUxheWVyICR7dGhpcy5uYW1lfSB1c2luZyB3cml0YWJsZSBEYXRhTGF5ZXIgJHtsYXllci5uYW1lfS5gKVxuXHRcdH1cblx0XHQvLyBDaGVjayB0aGF0IHRleHR1cmUgcGFyYW1zIGFyZSB0aGUgc2FtZS5cblx0XHRpZiAobGF5ZXIuZ2xXcmFwUyAhPT0gdGhpcy5nbFdyYXBTIHx8IGxheWVyLmdsV3JhcFQgIT09IHRoaXMuZ2xXcmFwVCB8fFxuXHRcdFx0bGF5ZXIud3JhcFMgIT09IHRoaXMud3JhcFMgfHwgbGF5ZXIud3JhcFQgIT09IHRoaXMud3JhcFQgfHxcblx0XHRcdGxheWVyLndpZHRoICE9PSB0aGlzLndpZHRoIHx8IGxheWVyLmhlaWdodCAhPT0gdGhpcy5oZWlnaHQgfHxcblx0XHRcdGxheWVyLmdsRmlsdGVyICE9PSB0aGlzLmdsRmlsdGVyIHx8IGxheWVyLmZpbHRlciAhPT0gdGhpcy5maWx0ZXIgfHxcblx0XHRcdGxheWVyLmdsTnVtQ2hhbm5lbHMgIT09IHRoaXMuZ2xOdW1DaGFubmVscyB8fCBsYXllci5udW1Db21wb25lbnRzICE9PSB0aGlzLm51bUNvbXBvbmVudHMgfHxcblx0XHRcdGxheWVyLmdsVHlwZSAhPT0gdGhpcy5nbFR5cGUgfHwgbGF5ZXIudHlwZSAhPT0gdGhpcy50eXBlIHx8XG5cdFx0XHRsYXllci5nbEZvcm1hdCAhPT0gdGhpcy5nbEZvcm1hdCB8fCBsYXllci5nbEludGVybmFsRm9ybWF0ICE9PSB0aGlzLmdsSW50ZXJuYWxGb3JtYXQpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbmNvbXBhdGlibGUgdGV4dHVyZSBwYXJhbXMgYmV0d2VlbiBEYXRhTGF5ZXJzICR7bGF5ZXIubmFtZX0gYW5kICR7dGhpcy5uYW1lfS5gKTtcblx0XHR9XG5cblx0XHQvLyBJZiB3ZSBoYXZlIG5vdCBhbHJlYWR5IGluaXRlZCBvdmVycmlkZXMgYXJyYXksIGRvIHNvIG5vdy5cblx0XHRpZiAoIXRoaXMudGV4dHVyZU92ZXJyaWRlcykge1xuXHRcdFx0dGhpcy50ZXh0dXJlT3ZlcnJpZGVzID0gW107XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubnVtQnVmZmVyczsgaSsrKSB7XG5cdFx0XHRcdHRoaXMudGV4dHVyZU92ZXJyaWRlcy5wdXNoKHVuZGVmaW5lZCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gQ2hlY2sgaWYgd2UgYWxyZWFkeSBoYXZlIGFuIG92ZXJyaWRlIGluIHBsYWNlLlxuXHRcdGlmICh0aGlzLnRleHR1cmVPdmVycmlkZXNbdGhpcy5fYnVmZmVySW5kZXhdKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYENhbid0IGNhbGwgRGF0YUxheWVyLnNhdmVDdXJyZW50U3RhdGVUb0RhdGFMYXllciBvbiBEYXRhTGF5ZXIgJHt0aGlzLm5hbWV9LCB0aGlzIERhdGFMYXllciBoYXMgbm90IHdyaXR0ZW4gbmV3IHN0YXRlIHNpbmNlIGxhc3QgY2FsbCB0byBEYXRhTGF5ZXIuc2F2ZUN1cnJlbnRTdGF0ZVRvRGF0YUxheWVyLmApO1xuXHRcdH1cblx0XHRjb25zdCBjdXJyZW50U3RhdGUgPSB0aGlzLmdldEN1cnJlbnRTdGF0ZVRleHR1cmUoKTtcblx0XHR0aGlzLnRleHR1cmVPdmVycmlkZXNbdGhpcy5fYnVmZmVySW5kZXhdID0gY3VycmVudFN0YXRlO1xuXHRcdC8vIFN3YXAgdGV4dHVyZXMuXG5cdFx0dGhpcy5idWZmZXJzW3RoaXMuX2J1ZmZlckluZGV4XS50ZXh0dXJlID0gbGF5ZXIuZ2V0Q3VycmVudFN0YXRlVGV4dHVyZSgpO1xuXHRcdGxheWVyLl9zZXRDdXJyZW50U3RhdGVUZXh0dXJlKGN1cnJlbnRTdGF0ZSk7XG5cblx0XHQvLyBCaW5kIHN3YXBwZWQgdGV4dHVyZSB0byBmcmFtZWJ1ZmZlci5cblx0XHRjb25zdCB7IGdsIH0gPSB0aGlzO1xuXHRcdGNvbnN0IHsgZnJhbWVidWZmZXIsIHRleHR1cmUgfSA9IHRoaXMuYnVmZmVyc1t0aGlzLl9idWZmZXJJbmRleF07XG5cdFx0aWYgKCFmcmFtZWJ1ZmZlcikgdGhyb3cgbmV3IEVycm9yKGBObyBmcmFtZWJ1ZmZlciBmb3Igd3JpdGFibGUgRGF0YUxheWVyICR7dGhpcy5uYW1lfS5gKTtcblx0XHRnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIGZyYW1lYnVmZmVyKTtcblx0XHQvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvV2ViR0xSZW5kZXJpbmdDb250ZXh0L2ZyYW1lYnVmZmVyVGV4dHVyZTJEXG5cdFx0Z2wuZnJhbWVidWZmZXJUZXh0dXJlMkQoZ2wuRlJBTUVCVUZGRVIsIGdsLkNPTE9SX0FUVEFDSE1FTlQwLCBnbC5URVhUVVJFXzJELCB0ZXh0dXJlLCAwKTtcblx0XHQvLyBVbmJpbmQuXG5cdFx0Z2wuYmluZEZyYW1lYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBudWxsKTtcblx0fVxuXG5cdF9zZXRDdXJyZW50U3RhdGVUZXh0dXJlKHRleHR1cmU6IFdlYkdMVGV4dHVyZSkge1xuXHRcdGlmICh0aGlzLndyaXRhYmxlKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYENhbid0IGNhbGwgRGF0YUxheWVyLl9zZXRDdXJyZW50U3RhdGVUZXh0dXJlIG9uIHdyaXRhYmxlIHRleHR1cmUgJHt0aGlzLm5hbWV9LmApO1xuXHRcdH1cblx0XHR0aGlzLmJ1ZmZlcnNbdGhpcy5fYnVmZmVySW5kZXhdLnRleHR1cmUgPSB0ZXh0dXJlO1xuXHR9XG5cblx0cHJpdmF0ZSB2YWxpZGF0ZURhdGFBcnJheShcblx0XHRfZGF0YT86IERhdGFMYXllckFycmF5VHlwZSxcblx0KSB7XG5cdFx0aWYgKCFfZGF0YSl7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGNvbnN0IHsgd2lkdGgsIGhlaWdodCwgbGVuZ3RoLCBudW1Db21wb25lbnRzLCBnbE51bUNoYW5uZWxzLCB0eXBlLCBpbnRlcm5hbFR5cGUsIG5hbWUgfSA9IHRoaXM7XG5cblx0XHQvLyBDaGVjayB0aGF0IGRhdGEgaXMgY29ycmVjdCBsZW5ndGggKHVzZXIgZXJyb3IpLlxuXHRcdGlmICgobGVuZ3RoICYmIF9kYXRhLmxlbmd0aCAhPT0gbGVuZ3RoICogbnVtQ29tcG9uZW50cykgfHwgKCFsZW5ndGggJiYgX2RhdGEubGVuZ3RoICE9PSB3aWR0aCAqIGhlaWdodCAqIG51bUNvbXBvbmVudHMpKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgZGF0YSBsZW5ndGggJHtfZGF0YS5sZW5ndGh9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIgb2Ygc2l6ZSAke2xlbmd0aCA/IGxlbmd0aCA6IGAke3dpZHRofXgke2hlaWdodH1gfXgke251bUNvbXBvbmVudHN9LmApO1xuXHRcdH1cblxuXHRcdC8vIENoZWNrIHRoYXQgZGF0YSBpcyBjb3JyZWN0IHR5cGUgKHVzZXIgZXJyb3IpLlxuXHRcdGxldCBpbnZhbGlkVHlwZUZvdW5kID0gZmFsc2U7XG5cdFx0c3dpdGNoICh0eXBlKSB7XG5cdFx0XHRjYXNlIEhBTEZfRkxPQVQ6XG5cdFx0XHRcdC8vIFNpbmNlIHRoZXJlIGlzIG5vIEZsb2F0MTZBcnJheSwgd2UgbXVzdCB1c2UgRmxvYXQzMkFycmF5cyB0byBpbml0IHRleHR1cmUuXG5cdFx0XHRcdC8vIENvbnRpbnVlIHRvIG5leHQgY2FzZS5cblx0XHRcdGNhc2UgRkxPQVQ6XG5cdFx0XHRcdGludmFsaWRUeXBlRm91bmQgPSBpbnZhbGlkVHlwZUZvdW5kIHx8IF9kYXRhLmNvbnN0cnVjdG9yICE9PSBGbG9hdDMyQXJyYXk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBVTlNJR05FRF9CWVRFOlxuXHRcdFx0XHRpbnZhbGlkVHlwZUZvdW5kID0gaW52YWxpZFR5cGVGb3VuZCB8fCBfZGF0YS5jb25zdHJ1Y3RvciAhPT0gVWludDhBcnJheTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIEJZVEU6XG5cdFx0XHRcdGludmFsaWRUeXBlRm91bmQgPSBpbnZhbGlkVHlwZUZvdW5kIHx8IF9kYXRhLmNvbnN0cnVjdG9yICE9PSBJbnQ4QXJyYXk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBVTlNJR05FRF9TSE9SVDpcblx0XHRcdFx0aW52YWxpZFR5cGVGb3VuZCA9IGludmFsaWRUeXBlRm91bmQgfHwgX2RhdGEuY29uc3RydWN0b3IgIT09IFVpbnQxNkFycmF5O1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgU0hPUlQ6XG5cdFx0XHRcdGludmFsaWRUeXBlRm91bmQgPSBpbnZhbGlkVHlwZUZvdW5kIHx8IF9kYXRhLmNvbnN0cnVjdG9yICE9PSBJbnQxNkFycmF5O1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgVU5TSUdORURfSU5UOlxuXHRcdFx0XHRpbnZhbGlkVHlwZUZvdW5kID0gaW52YWxpZFR5cGVGb3VuZCB8fCBfZGF0YS5jb25zdHJ1Y3RvciAhPT0gVWludDMyQXJyYXk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBJTlQ6XG5cdFx0XHRcdGludmFsaWRUeXBlRm91bmQgPSBpbnZhbGlkVHlwZUZvdW5kIHx8IF9kYXRhLmNvbnN0cnVjdG9yICE9PSBJbnQzMkFycmF5O1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgRXJyb3IgaW5pdGluZyBEYXRhTGF5ZXIgXCIke25hbWV9XCIuICBVbnN1cHBvcnRlZCB0eXBlIFwiJHt0eXBlfVwiIGZvciBXZWJHTENvbXB1dGUuaW5pdERhdGFMYXllci5gKTtcblx0XHR9XG5cdFx0aWYgKGludmFsaWRUeXBlRm91bmQpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBUeXBlZEFycmF5IG9mIHR5cGUgJHsoX2RhdGEuY29uc3RydWN0b3IgYXMgYW55KS5uYW1lfSBzdXBwbGllZCB0byBEYXRhTGF5ZXIgXCIke25hbWV9XCIgb2YgdHlwZSBcIiR7dHlwZX1cIi5gKTtcblx0XHR9XG5cblx0XHRsZXQgZGF0YSA9IF9kYXRhO1xuXHRcdGNvbnN0IGltYWdlU2l6ZSA9IHdpZHRoICogaGVpZ2h0ICogZ2xOdW1DaGFubmVscztcblx0XHQvLyBUaGVuIGNoZWNrIGlmIGFycmF5IG5lZWRzIHRvIGJlIGxlbmd0aGVuZWQuXG5cdFx0Ly8gVGhpcyBjb3VsZCBiZSBiZWNhdXNlIGdsTnVtQ2hhbm5lbHMgIT09IG51bUNvbXBvbmVudHMuXG5cdFx0Ly8gT3IgYmVjYXVzZSBsZW5ndGggIT09IHdpZHRoICogaGVpZ2h0LlxuXHRcdGNvbnN0IGluY29ycmVjdFNpemUgPSBkYXRhLmxlbmd0aCAhPT0gaW1hZ2VTaXplO1xuXHRcdC8vIFdlIGhhdmUgdG8gaGFuZGxlIHRoZSBjYXNlIG9mIEZsb2F0MTYgc3BlY2lhbGx5IGJ5IGNvbnZlcnRpbmcgZGF0YSB0byBVaW50MTZBcnJheS5cblx0XHRjb25zdCBoYW5kbGVGbG9hdDE2ID0gaW50ZXJuYWxUeXBlID09PSBIQUxGX0ZMT0FUO1xuXHRcdC8vIEZvciB3ZWJnbDEuMCB3ZSBtYXkgbmVlZCB0byBjYXN0IGFuIGludCB0eXBlIHRvIGEgRkxPQVQgb3IgSEFMRl9GTE9BVC5cblx0XHRjb25zdCBzaG91bGRUeXBlQ2FzdCA9IHR5cGUgIT09IGludGVybmFsVHlwZTtcblxuXHRcdGlmIChzaG91bGRUeXBlQ2FzdCB8fCBpbmNvcnJlY3RTaXplIHx8IGhhbmRsZUZsb2F0MTYpIHtcblx0XHRcdHN3aXRjaCAoaW50ZXJuYWxUeXBlKSB7XG5cdFx0XHRcdGNhc2UgSEFMRl9GTE9BVDpcblx0XHRcdFx0XHRkYXRhID0gbmV3IFVpbnQxNkFycmF5KGltYWdlU2l6ZSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgRkxPQVQ6XG5cdFx0XHRcdFx0ZGF0YSA9IG5ldyBGbG9hdDMyQXJyYXkoaW1hZ2VTaXplKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBVTlNJR05FRF9CWVRFOlxuXHRcdFx0XHRcdGRhdGEgPSBuZXcgVWludDhBcnJheShpbWFnZVNpemUpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIEJZVEU6XG5cdFx0XHRcdFx0ZGF0YSA9IG5ldyBJbnQ4QXJyYXkoaW1hZ2VTaXplKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBVTlNJR05FRF9TSE9SVDpcblx0XHRcdFx0XHRkYXRhID0gbmV3IFVpbnQxNkFycmF5KGltYWdlU2l6ZSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgU0hPUlQ6XG5cdFx0XHRcdFx0ZGF0YSA9IG5ldyBJbnQxNkFycmF5KGltYWdlU2l6ZSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgVU5TSUdORURfSU5UOlxuXHRcdFx0XHRcdGRhdGEgPSBuZXcgVWludDMyQXJyYXkoaW1hZ2VTaXplKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBJTlQ6XG5cdFx0XHRcdFx0ZGF0YSA9IG5ldyBJbnQzMkFycmF5KGltYWdlU2l6ZSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgRXJyb3IgaW5pdGluZyAke25hbWV9LiAgVW5zdXBwb3J0ZWQgaW50ZXJuYWxUeXBlICR7aW50ZXJuYWxUeXBlfSBmb3IgV2ViR0xDb21wdXRlLmluaXREYXRhTGF5ZXIuYCk7XG5cdFx0XHR9XG5cdFx0XHQvLyBGaWxsIG5ldyBkYXRhIGFycmF5IHdpdGggb2xkIGRhdGEuXG5cdFx0XHRjb25zdCB2aWV3ID0gaGFuZGxlRmxvYXQxNiA/IG5ldyBEYXRhVmlldyhkYXRhLmJ1ZmZlcikgOiBudWxsO1xuXHRcdFx0Zm9yIChsZXQgaSA9IDAsIF9sZW4gPSBfZGF0YS5sZW5ndGggLyBudW1Db21wb25lbnRzOyBpIDwgX2xlbjsgaSsrKSB7XG5cdFx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgbnVtQ29tcG9uZW50czsgaisrKSB7XG5cdFx0XHRcdFx0Y29uc3QgdmFsdWUgPSBfZGF0YVtpICogbnVtQ29tcG9uZW50cyArIGpdO1xuXHRcdFx0XHRcdGNvbnN0IGluZGV4ID0gaSAqIGdsTnVtQ2hhbm5lbHMgKyBqO1xuXHRcdFx0XHRcdGlmIChoYW5kbGVGbG9hdDE2KSB7XG5cdFx0XHRcdFx0XHRzZXRGbG9hdDE2KHZpZXchLCAyICogaW5kZXgsIHZhbHVlLCB0cnVlKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0ZGF0YVtpbmRleF0gPSB2YWx1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gZGF0YTtcblx0fVxuXG5cdHByaXZhdGUgaW5pdEJ1ZmZlcnMoXG5cdFx0X2RhdGE/OiBEYXRhTGF5ZXJBcnJheVR5cGUsXG5cdCkge1xuXHRcdGNvbnN0IHtcblx0XHRcdG5hbWUsXG5cdFx0XHRudW1CdWZmZXJzLFxuXHRcdFx0Z2wsXG5cdFx0XHR3aWR0aCxcblx0XHRcdGhlaWdodCxcblx0XHRcdGdsSW50ZXJuYWxGb3JtYXQsXG5cdFx0XHRnbEZvcm1hdCxcblx0XHRcdGdsVHlwZSxcblx0XHRcdGdsRmlsdGVyLFxuXHRcdFx0Z2xXcmFwUyxcblx0XHRcdGdsV3JhcFQsXG5cdFx0XHR3cml0YWJsZSxcblx0XHRcdGVycm9yQ2FsbGJhY2ssXG5cdFx0fSA9IHRoaXM7XG5cblx0XHRjb25zdCBkYXRhID0gdGhpcy52YWxpZGF0ZURhdGFBcnJheShfZGF0YSk7XG5cblx0XHQvLyBJbml0IGEgdGV4dHVyZSBmb3IgZWFjaCBidWZmZXIuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBudW1CdWZmZXJzOyBpKyspIHtcblx0XHRcdGNvbnN0IHRleHR1cmUgPSBnbC5jcmVhdGVUZXh0dXJlKCk7XG5cdFx0XHRpZiAoIXRleHR1cmUpIHtcblx0XHRcdFx0ZXJyb3JDYWxsYmFjayhgQ291bGQgbm90IGluaXQgdGV4dHVyZSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiOiAke2dsLmdldEVycm9yKCl9LmApO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCB0ZXh0dXJlKTtcblxuXHRcdFx0Ly8gVE9ETzogYXJlIHRoZXJlIG90aGVyIHBhcmFtcyB0byBsb29rIGludG86XG5cdFx0XHQvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvV2ViR0xSZW5kZXJpbmdDb250ZXh0L3RleFBhcmFtZXRlclxuXHRcdFx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfUywgZ2xXcmFwUyk7XG5cdFx0XHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9ULCBnbFdyYXBUKTtcblx0XHRcdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBnbEZpbHRlcik7XG5cdFx0XHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgZ2xGaWx0ZXIpO1xuXG5cdFx0XHRnbC50ZXhJbWFnZTJEKGdsLlRFWFRVUkVfMkQsIDAsIGdsSW50ZXJuYWxGb3JtYXQsIHdpZHRoLCBoZWlnaHQsIDAsIGdsRm9ybWF0LCBnbFR5cGUsIGRhdGEgPyBkYXRhIDogbnVsbCk7XG5cdFx0XHRcblx0XHRcdGNvbnN0IGJ1ZmZlcjogRGF0YUxheWVyQnVmZmVyID0ge1xuXHRcdFx0XHR0ZXh0dXJlLFxuXHRcdFx0fTtcblxuXHRcdFx0aWYgKHdyaXRhYmxlKSB7XG5cdFx0XHRcdC8vIEluaXQgYSBmcmFtZWJ1ZmZlciBmb3IgdGhpcyB0ZXh0dXJlIHNvIHdlIGNhbiB3cml0ZSB0byBpdC5cblx0XHRcdFx0Y29uc3QgZnJhbWVidWZmZXIgPSBnbC5jcmVhdGVGcmFtZWJ1ZmZlcigpO1xuXHRcdFx0XHRpZiAoIWZyYW1lYnVmZmVyKSB7XG5cdFx0XHRcdFx0ZXJyb3JDYWxsYmFjayhgQ291bGQgbm90IGluaXQgZnJhbWVidWZmZXIgZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIjogJHtnbC5nZXRFcnJvcigpfS5gKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0Z2wuYmluZEZyYW1lYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBmcmFtZWJ1ZmZlcik7XG5cdFx0XHRcdC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9XZWJHTFJlbmRlcmluZ0NvbnRleHQvZnJhbWVidWZmZXJUZXh0dXJlMkRcblx0XHRcdFx0Z2wuZnJhbWVidWZmZXJUZXh0dXJlMkQoZ2wuRlJBTUVCVUZGRVIsIGdsLkNPTE9SX0FUVEFDSE1FTlQwLCBnbC5URVhUVVJFXzJELCB0ZXh0dXJlLCAwKTtcblxuXHRcdFx0XHRjb25zdCBzdGF0dXMgPSBnbC5jaGVja0ZyYW1lYnVmZmVyU3RhdHVzKGdsLkZSQU1FQlVGRkVSKTtcblx0XHRcdFx0aWYoc3RhdHVzICE9IGdsLkZSQU1FQlVGRkVSX0NPTVBMRVRFKXtcblx0XHRcdFx0XHRlcnJvckNhbGxiYWNrKGBJbnZhbGlkIHN0YXR1cyBmb3IgZnJhbWVidWZmZXIgZm9yIERhdGFMYXllciBcIiR7bmFtZX1cIjogJHtzdGF0dXN9LmApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gQWRkIGZyYW1lYnVmZmVyLlxuXHRcdFx0XHRidWZmZXIuZnJhbWVidWZmZXIgPSBmcmFtZWJ1ZmZlcjtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0Ly8gU2F2ZSB0aGlzIGJ1ZmZlciB0byB0aGUgbGlzdC5cblx0XHRcdHRoaXMuYnVmZmVycy5wdXNoKGJ1ZmZlcik7XG5cdFx0fVxuXHRcdC8vIFVuYmluZC5cblx0XHRnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIG51bGwpO1xuXHR9XG5cblx0Z2V0Q3VycmVudFN0YXRlVGV4dHVyZSgpIHtcblx0XHRpZiAodGhpcy50ZXh0dXJlT3ZlcnJpZGVzICYmIHRoaXMudGV4dHVyZU92ZXJyaWRlc1t0aGlzLl9idWZmZXJJbmRleF0pIHJldHVybiB0aGlzLnRleHR1cmVPdmVycmlkZXNbdGhpcy5fYnVmZmVySW5kZXhdITtcblx0XHRyZXR1cm4gdGhpcy5idWZmZXJzW3RoaXMuX2J1ZmZlckluZGV4XS50ZXh0dXJlO1xuXHR9XG5cblx0Z2V0UHJldmlvdXNTdGF0ZVRleHR1cmUoaW5kZXggPSAtMSkge1xuXHRcdGlmICh0aGlzLm51bUJ1ZmZlcnMgPT09IDEpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGNhbGwgZ2V0UHJldmlvdXNTdGF0ZVRleHR1cmUgb24gRGF0YUxheWVyIFwiJHt0aGlzLm5hbWV9XCIgd2l0aCBvbmx5IG9uZSBidWZmZXIuYCk7XG5cdFx0fVxuXHRcdGNvbnN0IHByZXZpb3VzSW5kZXggPSB0aGlzLl9idWZmZXJJbmRleCArIGluZGV4ICsgdGhpcy5udW1CdWZmZXJzO1xuXHRcdGlmIChwcmV2aW91c0luZGV4IDwgMCB8fCBwcmV2aW91c0luZGV4ID49IHRoaXMubnVtQnVmZmVycykge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGluZGV4ICR7aW5kZXh9IHBhc3NlZCB0byBnZXRQcmV2aW91c1N0YXRlVGV4dHVyZSBvbiBEYXRhTGF5ZXIgJHt0aGlzLm5hbWV9IHdpdGggJHt0aGlzLm51bUJ1ZmZlcnN9IGJ1ZmZlcnMuYCk7XG5cdFx0fVxuXHRcdGlmICh0aGlzLnRleHR1cmVPdmVycmlkZXMgJiYgdGhpcy50ZXh0dXJlT3ZlcnJpZGVzW3ByZXZpb3VzSW5kZXhdKSByZXR1cm4gdGhpcy50ZXh0dXJlT3ZlcnJpZGVzW3ByZXZpb3VzSW5kZXhdITtcblx0XHRyZXR1cm4gdGhpcy5idWZmZXJzW3ByZXZpb3VzSW5kZXhdLnRleHR1cmU7XG5cdH1cblxuXHRfdXNpbmdUZXh0dXJlT3ZlcnJpZGVGb3JDdXJyZW50QnVmZmVyKCkge1xuXHRcdHJldHVybiB0aGlzLnRleHR1cmVPdmVycmlkZXMgJiYgdGhpcy50ZXh0dXJlT3ZlcnJpZGVzW3RoaXMuYnVmZmVySW5kZXhdO1xuXHR9XG5cblx0X2JpbmRPdXRwdXRCdWZmZXJGb3JXcml0ZShcblx0XHRpbmNyZW1lbnRCdWZmZXJJbmRleDogYm9vbGVhbixcblx0KSB7XG5cdFx0Y29uc3QgeyBnbCB9ID0gdGhpcztcblx0XHRpZiAoaW5jcmVtZW50QnVmZmVySW5kZXgpIHtcblx0XHRcdC8vIEluY3JlbWVudCBidWZmZXJJbmRleC5cblx0XHRcdHRoaXMuX2J1ZmZlckluZGV4ID0gKHRoaXMuX2J1ZmZlckluZGV4ICsgMSkgJSB0aGlzLm51bUJ1ZmZlcnM7XG5cdFx0fVxuXHRcdHRoaXMuX2JpbmRPdXRwdXRCdWZmZXIoKTtcblxuXHRcdC8vIFdlIGFyZSBnb2luZyB0byBkbyBhIGRhdGEgd3JpdGUsIGlmIHdlIGhhdmUgb3ZlcnJpZGVzIGVuYWJsZWQsIHdlIGNhbiByZW1vdmUgdGhlbS5cblx0XHRpZiAodGhpcy50ZXh0dXJlT3ZlcnJpZGVzKSB7XG5cdFx0XHR0aGlzLnRleHR1cmVPdmVycmlkZXNbdGhpcy5fYnVmZmVySW5kZXhdID0gdW5kZWZpbmVkO1xuXHRcdH1cblx0fVxuXG5cdF9iaW5kT3V0cHV0QnVmZmVyKCkge1xuXHRcdGNvbnN0IHsgZ2wgfSA9IHRoaXM7XG5cdFx0Y29uc3QgeyBmcmFtZWJ1ZmZlciB9ID0gdGhpcy5idWZmZXJzW3RoaXMuX2J1ZmZlckluZGV4XTtcblx0XHRpZiAoIWZyYW1lYnVmZmVyKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYERhdGFMYXllciBcIiR7dGhpcy5uYW1lfVwiIGlzIG5vdCB3cml0YWJsZS5gKTtcblx0XHR9XG5cdFx0Z2wuYmluZEZyYW1lYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBmcmFtZWJ1ZmZlcik7XG5cdH1cblxuXHRzZXREYXRhKGRhdGE6IERhdGFMYXllckFycmF5VHlwZSkge1xuXHRcdC8vIFRPRE86IFJhdGhlciB0aGFuIGRlc3Ryb3lpbmcgYnVmZmVycywgd2UgY291bGQgd3JpdGUgdG8gY2VydGFpbiB3aW5kb3cuXG5cdFx0dGhpcy5kZXN0cm95QnVmZmVycygpO1xuXHRcdHRoaXMuaW5pdEJ1ZmZlcnMoZGF0YSk7XG5cdH1cblxuXHRyZXNpemUoXG5cdFx0ZGltZW5zaW9uczogbnVtYmVyIHwgW251bWJlciwgbnVtYmVyXSxcblx0XHRkYXRhPzogRGF0YUxheWVyQXJyYXlUeXBlLFxuXHQpIHtcblx0XHRjb25zdCB7IGxlbmd0aCwgd2lkdGgsIGhlaWdodCB9ID0gRGF0YUxheWVyLmNhbGNTaXplKGRpbWVuc2lvbnMsIHRoaXMubmFtZSk7XG5cdFx0dGhpcy5sZW5ndGggPSBsZW5ndGg7XG5cdFx0dGhpcy53aWR0aCA9IHdpZHRoO1xuXHRcdHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuXHRcdHRoaXMuZGVzdHJveUJ1ZmZlcnMoKTtcblx0XHR0aGlzLmluaXRCdWZmZXJzKGRhdGEpO1xuXHR9XG5cblx0Y2xlYXIoKSB7XG5cdFx0Ly8gUmVzZXQgZXZlcnl0aGluZyB0byB6ZXJvLlxuXHRcdC8vIFRPRE86IFRoaXMgaXMgbm90IHRoZSBtb3N0IGVmZmljaWVudCB3YXkgdG8gZG8gdGhpcyAocmVhbGxvY2F0aW5nIGFsbCB0ZXh0dXJlcyBhbmQgZnJhbWVidWZmZXJzKSwgYnV0IG9rIGZvciBub3cuXG5cdFx0dGhpcy5kZXN0cm95QnVmZmVycygpO1xuXHRcdHRoaXMuaW5pdEJ1ZmZlcnMoKTtcblx0fVxuXG5cdGdldERpbWVuc2lvbnMoKSB7XG5cdFx0cmV0dXJuIFtcblx0XHRcdHRoaXMud2lkdGgsXG5cdFx0XHR0aGlzLmhlaWdodCxcblx0XHRdIGFzIFtudW1iZXIsIG51bWJlcl07XG5cdH1cblxuXHRnZXRMZW5ndGgoKSB7XG5cdFx0aWYgKCF0aGlzLmxlbmd0aCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgY2FsbCBnZXRMZW5ndGgoKSBvbiAyRCBEYXRhTGF5ZXIgXCIke3RoaXMubmFtZX1cIi5gKTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMubGVuZ3RoO1xuXHR9XG5cblx0cHJpdmF0ZSBkZXN0cm95QnVmZmVycygpIHtcblx0XHRjb25zdCB7IGdsLCBidWZmZXJzIH0gPSB0aGlzO1xuXHRcdGJ1ZmZlcnMuZm9yRWFjaChidWZmZXIgPT4ge1xuXHRcdFx0Y29uc3QgeyBmcmFtZWJ1ZmZlciwgdGV4dHVyZSB9ID0gYnVmZmVyO1xuXHRcdFx0Z2wuZGVsZXRlVGV4dHVyZSh0ZXh0dXJlKTtcblx0XHRcdGlmIChmcmFtZWJ1ZmZlcikge1xuXHRcdFx0XHRnbC5kZWxldGVGcmFtZWJ1ZmZlcihmcmFtZWJ1ZmZlcik7XG5cdFx0XHR9XG5cdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRkZWxldGUgYnVmZmVyLnRleHR1cmU7XG5cdFx0XHRkZWxldGUgYnVmZmVyLmZyYW1lYnVmZmVyO1xuXHRcdH0pO1xuXHRcdGJ1ZmZlcnMubGVuZ3RoID0gMDtcblxuXHRcdC8vIFRoZXNlIGFyZSB0ZWNobmljYWxseSBvd25lZCBieSBhbm90aGVyIERhdGFMYXllcixcblx0XHQvLyBzbyB3ZSBhcmUgbm90IHJlc3BvbnNpYmxlIGZvciBkZWxldGluZyB0aGVtIGZyb20gZ2wgY29udGV4dC5cblx0XHRkZWxldGUgdGhpcy50ZXh0dXJlT3ZlcnJpZGVzO1xuXHR9XG5cblx0ZGVzdHJveSgpIHtcblx0XHR0aGlzLmRlc3Ryb3lCdWZmZXJzKCk7XG5cdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdGRlbGV0ZSB0aGlzLmdsO1xuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHRkZWxldGUgdGhpcy5lcnJvckNhbGxiYWNrO1xuXHR9XG59XG4iLCJpbXBvcnQgeyBpc0FycmF5LCBpc0ludGVnZXIsIGlzTnVtYmVyLCBpc1N0cmluZyB9IGZyb20gJy4vQ2hlY2tzJztcbmltcG9ydCB7XG5cdEZMT0FULFxuXHRGTE9BVF8xRF9VTklGT1JNLCBGTE9BVF8yRF9VTklGT1JNLCBGTE9BVF8zRF9VTklGT1JNLCBGTE9BVF80RF9VTklGT1JNLFxuXHRHTFNMMyxcblx0R0xTTFZlcnNpb24sXG5cdElOVCxcblx0SU5UXzFEX1VOSUZPUk0sIElOVF8yRF9VTklGT1JNLCBJTlRfM0RfVU5JRk9STSwgSU5UXzREX1VOSUZPUk0sXG5cdFVuaWZvcm0sIFVuaWZvcm1EYXRhVHlwZSwgVW5pZm9ybVR5cGUsIFVuaWZvcm1WYWx1ZVR5cGUsXG59IGZyb20gJy4vQ29uc3RhbnRzJztcbmltcG9ydCB7IGNvbXBpbGVTaGFkZXIgfSBmcm9tICcuL3V0aWxzJztcblxuY29uc3QgREVGQVVMVF9QUk9HUkFNX05BTUUgPSAnREVGQVVMVCc7XG5jb25zdCBTRUdNRU5UX1BST0dSQU1fTkFNRSA9ICdTRUdNRU5UJztcbmNvbnN0IFBPSU5UU19QUk9HUkFNX05BTUUgPSAnUE9JTlRTJztcbmNvbnN0IFZFQ1RPUl9GSUVMRF9QUk9HUkFNX05BTUUgPSAnVkVDVE9SX0ZJRUxEJztcbmNvbnN0IElOREVYRURfTElORVNfUFJPR1JBTV9OQU1FID0gJ0lOREVYRURfTElORVMnO1xuY29uc3QgUE9MWUxJTkVfUFJPR1JBTV9OQU1FID0gJ1BPTFlMSU5FJztcbmNvbnN0IGdsUHJvZ3JhbU5hbWVzID0gW1xuXHRERUZBVUxUX1BST0dSQU1fTkFNRSxcblx0U0VHTUVOVF9QUk9HUkFNX05BTUUsXG5cdFBPSU5UU19QUk9HUkFNX05BTUUsXG5cdFZFQ1RPUl9GSUVMRF9QUk9HUkFNX05BTUUsXG5cdElOREVYRURfTElORVNfUFJPR1JBTV9OQU1FLFxuXHRQT0xZTElORV9QUk9HUkFNX05BTUUsXG5dO1xuXG5leHBvcnQgY2xhc3MgR1BVUHJvZ3JhbSB7XG5cdHJlYWRvbmx5IG5hbWU6IHN0cmluZztcblx0cHJpdmF0ZSByZWFkb25seSBnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0IHwgV2ViR0wyUmVuZGVyaW5nQ29udGV4dDtcblx0cHJpdmF0ZSByZWFkb25seSBlcnJvckNhbGxiYWNrOiAobWVzc2FnZTogc3RyaW5nKSA9PiB2b2lkO1xuXHRwcml2YXRlIHJlYWRvbmx5IGdsc2xWZXJzaW9uOiBHTFNMVmVyc2lvbjtcblx0cHJpdmF0ZSByZWFkb25seSB1bmlmb3JtczogeyBbIGtleTogc3RyaW5nXTogVW5pZm9ybSB9ID0ge307XG5cdHByaXZhdGUgcmVhZG9ubHkgZnJhZ21lbnRTaGFkZXIhOiBXZWJHTFNoYWRlcjtcblx0Ly8gU3RvcmUgZ2wgcHJvZ3JhbXMuXG5cdHByaXZhdGUgX2RlZmF1bHRQcm9ncmFtPzogV2ViR0xQcm9ncmFtO1xuXHRwcml2YXRlIF9zZWdtZW50UHJvZ3JhbT86IFdlYkdMUHJvZ3JhbTtcblx0cHJpdmF0ZSBfcG9pbnRzUHJvZ3JhbT86IFdlYkdMUHJvZ3JhbTtcblx0cHJpdmF0ZSBfdmVjdG9yRmllbGRQcm9ncmFtPzogV2ViR0xQcm9ncmFtO1xuXHRwcml2YXRlIF9pbmRleGVkTGluZXNQcm9ncmFtPzogV2ViR0xQcm9ncmFtO1xuXHRwcml2YXRlIF9wb2x5bGluZVByb2dyYW0/OiBXZWJHTFByb2dyYW07XG5cdC8vIFN0b3JlIHZlcnRleFNoYWRlcnMgYXMgY2xhc3MgcHJvcGVydGllcyAoZm9yIHNoYXJpbmcpLlxuXHRwcml2YXRlIHN0YXRpYyBkZWZhdWx0VmVydGV4U2hhZGVyPzogV2ViR0xTaGFkZXI7XG5cdHByaXZhdGUgc3RhdGljIHNlZ21lbnRWZXJ0ZXhTaGFkZXI/OiBXZWJHTFNoYWRlcjtcblx0cHJpdmF0ZSBzdGF0aWMgcG9pbnRzVmVydGV4U2hhZGVyPzogV2ViR0xTaGFkZXI7XG5cdHByaXZhdGUgc3RhdGljIHZlY3RvckZpZWxkVmVydGV4U2hhZGVyPzogV2ViR0xTaGFkZXI7XG5cdHByaXZhdGUgc3RhdGljIGluZGV4ZWRMaW5lc1ZlcnRleFNoYWRlcj86IFdlYkdMU2hhZGVyO1xuXHRwcml2YXRlIHN0YXRpYyBwb2x5bGluZVZlcnRleFNoYWRlcj86IFdlYkdMU2hhZGVyO1xuXG5cdGNvbnN0cnVjdG9yKFxuXHRcdHBhcmFtczoge1xuXHRcdFx0Z2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCB8IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQsXG5cdFx0XHRuYW1lOiBzdHJpbmcsXG5cdFx0XHRmcmFnbWVudFNoYWRlcjogc3RyaW5nIHwgc3RyaW5nW10gfCBXZWJHTFNoYWRlciwvLyBXZSBtYXkgd2FudCB0byBwYXNzIGluIGFuIGFycmF5IG9mIHNoYWRlciBzdHJpbmcgc291cmNlcywgaWYgc3BsaXQgYWNyb3NzIHNldmVyYWwgZmlsZXMuXG5cdFx0XHRlcnJvckNhbGxiYWNrOiAobWVzc2FnZTogc3RyaW5nKSA9PiB2b2lkLFxuXHRcdFx0Z2xzbFZlcnNpb246IEdMU0xWZXJzaW9uLFxuXHRcdFx0dW5pZm9ybXM/OiB7XG5cdFx0XHRcdG5hbWU6IHN0cmluZyxcblx0XHRcdFx0dmFsdWU6IFVuaWZvcm1WYWx1ZVR5cGUsXG5cdFx0XHRcdGRhdGFUeXBlOiBVbmlmb3JtRGF0YVR5cGUsXG5cdFx0XHR9W10sXG5cdFx0XHRkZWZpbmVzPzogey8vIFdlJ2xsIGFsbG93IHNvbWUgdmFyaWFibGVzIHRvIGJlIHBhc3NlZCBpbiBhcyAjZGVmaW5lIHRvIHRoZSBwcmVwcm9jZXNzb3IgZm9yIHRoZSBmcmFnbWVudCBzaGFkZXIuXG5cdFx0XHRcdFtrZXk6IHN0cmluZ106IHN0cmluZywgLy8gV2UnbGwgZG8gdGhlc2UgYXMgc3RyaW5ncyB0byBtYWtlIGl0IGVhc2llciB0byBjb250cm9sIGZsb2F0IHZzIGludC5cblx0XHRcdH0sXG5cdFx0fSxcblx0XHRcblx0KSB7XG5cdFx0Y29uc3QgeyBnbCwgZXJyb3JDYWxsYmFjaywgbmFtZSwgZnJhZ21lbnRTaGFkZXIsIGdsc2xWZXJzaW9uLCB1bmlmb3JtcywgZGVmaW5lcyB9ID0gcGFyYW1zO1xuXG5cdFx0Ly8gU2F2ZSBhcmd1bWVudHMuXG5cdFx0dGhpcy5nbCA9IGdsO1xuXHRcdHRoaXMuZXJyb3JDYWxsYmFjayA9IGVycm9yQ2FsbGJhY2s7XG5cdFx0dGhpcy5uYW1lID0gbmFtZTtcblx0XHR0aGlzLmdsc2xWZXJzaW9uID0gZ2xzbFZlcnNpb247XG5cblx0XHQvLyBDb21waWxlIGZyYWdtZW50IHNoYWRlci5cblx0XHRpZiAodHlwZW9mKGZyYWdtZW50U2hhZGVyKSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mKChmcmFnbWVudFNoYWRlciBhcyBzdHJpbmdbXSlbMF0pID09PSAnc3RyaW5nJykge1xuXHRcdFx0bGV0IHNvdXJjZVN0cmluZyA9IHR5cGVvZihmcmFnbWVudFNoYWRlcikgPT09ICdzdHJpbmcnID9cblx0XHRcdFx0ZnJhZ21lbnRTaGFkZXIgOlxuXHRcdFx0XHQoZnJhZ21lbnRTaGFkZXIgYXMgc3RyaW5nW10pLmpvaW4oJ1xcbicpO1xuXHRcdFx0aWYgKGRlZmluZXMpIHtcblx0XHRcdFx0Ly8gRmlyc3QgY29udmVydCBkZWZpbmVzIHRvIGEgc3RyaW5nLlxuXHRcdFx0XHRsZXQgZGVmaW5lc1NvdXJjZSA9ICcnO1xuXHRcdFx0XHRjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoZGVmaW5lcyk7XG5cdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdGNvbnN0IGtleSA9IGtleXNbaV07XG5cdFx0XHRcdFx0Ly8gQ2hlY2sgdGhhdCBkZWZpbmUgaXMgcGFzc2VkIGluIGFzIGEgc3RyaW5nLlxuXHRcdFx0XHRcdGlmICghaXNTdHJpbmcoa2V5KSB8fCAhaXNTdHJpbmcoZGVmaW5lc1trZXldKSkge1xuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBHUFVQcm9ncmFtIGRlZmluZXMgbXVzdCBiZSBwYXNzZWQgaW4gYXMga2V5IHZhbHVlIHBhaXJzIHRoYXQgYXJlIGJvdGggc3RyaW5ncywgZ290IGtleSB2YWx1ZSBwYWlyIG9mIHR5cGUgJHt0eXBlb2Yga2V5fSA6ICR7dHlwZW9mIGRlZmluZXNba2V5XX0uYClcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZGVmaW5lc1NvdXJjZSArPSBgI2RlZmluZSAke2tleX0gJHtkZWZpbmVzW2tleV19XFxuYDtcblx0XHRcdFx0fVxuXHRcdFx0XHRzb3VyY2VTdHJpbmcgPSBkZWZpbmVzU291cmNlICsgc291cmNlU3RyaW5nO1xuXHRcdFx0fVxuXHRcdFx0Y29uc3Qgc2hhZGVyID0gY29tcGlsZVNoYWRlcihnbCwgZXJyb3JDYWxsYmFjaywgc291cmNlU3RyaW5nLCBnbC5GUkFHTUVOVF9TSEFERVIsIG5hbWUpO1xuXHRcdFx0aWYgKCFzaGFkZXIpIHtcblx0XHRcdFx0ZXJyb3JDYWxsYmFjayhgVW5hYmxlIHRvIGNvbXBpbGUgZnJhZ21lbnQgc2hhZGVyIGZvciBwcm9ncmFtIFwiJHtuYW1lfVwiLmApO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHR0aGlzLmZyYWdtZW50U2hhZGVyID0gc2hhZGVyO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoZGVmaW5lcykge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byBhdHRhY2ggZGVmaW5lcyB0byBwcm9ncmFtIFwiJHtuYW1lfVwiIGJlY2F1c2UgZnJhZ21lbnQgc2hhZGVyIGlzIGFscmVhZHkgY29tcGlsZWQuYCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKHVuaWZvcm1zKSB7XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHVuaWZvcm1zPy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRjb25zdCB7IG5hbWUsIHZhbHVlLCBkYXRhVHlwZSB9ID0gdW5pZm9ybXNbaV07XG5cdFx0XHRcdHRoaXMuc2V0VW5pZm9ybShuYW1lLCB2YWx1ZSwgZGF0YVR5cGUpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgaW5pdFByb2dyYW0odmVydGV4U2hhZGVyOiBXZWJHTFNoYWRlciwgcHJvZ3JhbU5hbWU6IHN0cmluZykge1xuXHRcdGNvbnN0IHsgZ2wsIGZyYWdtZW50U2hhZGVyLCBlcnJvckNhbGxiYWNrLCB1bmlmb3JtcyB9ID0gdGhpcztcblx0XHQvLyBDcmVhdGUgYSBwcm9ncmFtLlxuXHRcdGNvbnN0IHByb2dyYW0gPSBnbC5jcmVhdGVQcm9ncmFtKCk7XG5cdFx0aWYgKCFwcm9ncmFtKSB7XG5cdFx0XHRlcnJvckNhbGxiYWNrKGBVbmFibGUgdG8gaW5pdCBnbCBwcm9ncmFtOiAke25hbWV9LmApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHQvLyBUT0RPOiBjaGVjayB0aGF0IGF0dGFjaFNoYWRlciB3b3JrZWQuXG5cdFx0Z2wuYXR0YWNoU2hhZGVyKHByb2dyYW0sIGZyYWdtZW50U2hhZGVyKTtcblx0XHRnbC5hdHRhY2hTaGFkZXIocHJvZ3JhbSwgdmVydGV4U2hhZGVyKTtcblx0XHQvLyBMaW5rIHRoZSBwcm9ncmFtLlxuXHRcdGdsLmxpbmtQcm9ncmFtKHByb2dyYW0pO1xuXHRcdC8vIENoZWNrIGlmIGl0IGxpbmtlZC5cblx0XHRjb25zdCBzdWNjZXNzID0gZ2wuZ2V0UHJvZ3JhbVBhcmFtZXRlcihwcm9ncmFtLCBnbC5MSU5LX1NUQVRVUyk7XG5cdFx0aWYgKCFzdWNjZXNzKSB7XG5cdFx0XHQvLyBTb21ldGhpbmcgd2VudCB3cm9uZyB3aXRoIHRoZSBsaW5rLlxuXHRcdFx0ZXJyb3JDYWxsYmFjayhgUHJvZ3JhbSBcIiR7bmFtZX1cIiBmYWlsZWQgdG8gbGluazogJHtnbC5nZXRQcm9ncmFtSW5mb0xvZyhwcm9ncmFtKX1gKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0Ly8gSWYgd2UgaGF2ZSBhbnkgdW5pZm9ybXMgc2V0IGZvciB0aGlzIEdQVVByb2dyYW0sIGFkZCB0aG9zZSB0byBXZWJHTFByb2dyYW0gd2UganVzdCBpbml0ZWQuXG5cdFx0Y29uc3QgdW5pZm9ybU5hbWVzID0gT2JqZWN0LmtleXModW5pZm9ybXMpO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdW5pZm9ybU5hbWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRjb25zdCB1bmlmb3JtTmFtZSA9IHVuaWZvcm1OYW1lc1tpXTtcblx0XHRcdGNvbnN0IHVuaWZvcm0gPSB1bmlmb3Jtc1t1bmlmb3JtTmFtZV07XG5cdFx0XHRjb25zdCB7IHZhbHVlLCB0eXBlIH0gPSB1bmlmb3JtO1xuXHRcdFx0dGhpcy5zZXRQcm9ncmFtVW5pZm9ybShwcm9ncmFtLCBwcm9ncmFtTmFtZSwgdW5pZm9ybU5hbWUsIHZhbHVlLCB0eXBlKTtcblx0XHR9XG5cdFx0cmV0dXJuIHByb2dyYW07XG5cdH1cblxuXHRnZXQgZGVmYXVsdFByb2dyYW0oKSB7XG5cdFx0aWYgKHRoaXMuX2RlZmF1bHRQcm9ncmFtKSByZXR1cm4gdGhpcy5fZGVmYXVsdFByb2dyYW07XG5cdFx0aWYgKEdQVVByb2dyYW0uZGVmYXVsdFZlcnRleFNoYWRlciA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRjb25zdCB7IGdsLCBuYW1lLCBlcnJvckNhbGxiYWNrLCBnbHNsVmVyc2lvbiB9ID0gdGhpcztcblx0XHRcdC8vIEluaXQgYSBkZWZhdWx0IHZlcnRleCBzaGFkZXIgdGhhdCBqdXN0IHBhc3NlcyB0aHJvdWdoIHNjcmVlbiBjb29yZHMuXG5cdFx0XHRjb25zdCB2ZXJ0ZXhTaGFkZXJTb3VyY2UgPSBnbHNsVmVyc2lvbiA9PT0gR0xTTDMgPyByZXF1aXJlKCcuL2dsc2xfMy9EZWZhdWx0VmVydGV4U2hhZGVyLmdsc2wnKSA6IHJlcXVpcmUoJy4vZ2xzbF8xL0RlZmF1bHRWZXJ0ZXhTaGFkZXIuZ2xzbCcpO1xuXHRcdFx0Y29uc3Qgc2hhZGVyID0gY29tcGlsZVNoYWRlcihnbCwgZXJyb3JDYWxsYmFjaywgdmVydGV4U2hhZGVyU291cmNlLCBnbC5WRVJURVhfU0hBREVSLCBuYW1lKTtcblx0XHRcdGlmICghc2hhZGVyKSB7XG5cdFx0XHRcdGVycm9yQ2FsbGJhY2soYFVuYWJsZSB0byBjb21waWxlIGRlZmF1bHQgdmVydGV4IHNoYWRlciBmb3IgcHJvZ3JhbSBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0R1BVUHJvZ3JhbS5kZWZhdWx0VmVydGV4U2hhZGVyID0gc2hhZGVyO1xuXHRcdH1cblx0XHRjb25zdCBwcm9ncmFtID0gdGhpcy5pbml0UHJvZ3JhbShHUFVQcm9ncmFtLmRlZmF1bHRWZXJ0ZXhTaGFkZXIsIERFRkFVTFRfUFJPR1JBTV9OQU1FKTtcblx0XHR0aGlzLl9kZWZhdWx0UHJvZ3JhbSA9IHByb2dyYW07XG5cdFx0cmV0dXJuIHRoaXMuX2RlZmF1bHRQcm9ncmFtO1xuXHR9XG5cblx0Z2V0IHNlZ21lbnRQcm9ncmFtKCkge1xuXHRcdGlmICh0aGlzLl9zZWdtZW50UHJvZ3JhbSkgcmV0dXJuIHRoaXMuX3NlZ21lbnRQcm9ncmFtO1xuXHRcdGlmIChHUFVQcm9ncmFtLnNlZ21lbnRWZXJ0ZXhTaGFkZXIgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Y29uc3QgeyBnbCwgbmFtZSwgZXJyb3JDYWxsYmFjaywgZ2xzbFZlcnNpb24gfSA9IHRoaXM7XG5cdFx0XHRjb25zdCB2ZXJ0ZXhTaGFkZXJTb3VyY2UgPSBnbHNsVmVyc2lvbiA9PT0gR0xTTDMgPyByZXF1aXJlKCcuL2dsc2xfMy9TZWdtZW50VmVydGV4U2hhZGVyLmdsc2wnKSA6IHJlcXVpcmUoJy4vZ2xzbF8xL1NlZ21lbnRWZXJ0ZXhTaGFkZXIuZ2xzbCcpO1xuXHRcdFx0Y29uc3Qgc2hhZGVyID0gY29tcGlsZVNoYWRlcihnbCwgZXJyb3JDYWxsYmFjaywgdmVydGV4U2hhZGVyU291cmNlLCBnbC5WRVJURVhfU0hBREVSLCBuYW1lKTtcblx0XHRcdGlmICghc2hhZGVyKSB7XG5cdFx0XHRcdGVycm9yQ2FsbGJhY2soYFVuYWJsZSB0byBjb21waWxlIHNlZ21lbnQgdmVydGV4IHNoYWRlciBmb3IgcHJvZ3JhbSBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0R1BVUHJvZ3JhbS5zZWdtZW50VmVydGV4U2hhZGVyID0gc2hhZGVyO1xuXHRcdH1cblx0XHRjb25zdCBwcm9ncmFtID0gdGhpcy5pbml0UHJvZ3JhbShHUFVQcm9ncmFtLnNlZ21lbnRWZXJ0ZXhTaGFkZXIsIFNFR01FTlRfUFJPR1JBTV9OQU1FKTtcblx0XHR0aGlzLl9zZWdtZW50UHJvZ3JhbSA9IHByb2dyYW07XG5cdFx0cmV0dXJuIHRoaXMuX3NlZ21lbnRQcm9ncmFtO1xuXHR9XG5cblx0Z2V0IHBvaW50c1Byb2dyYW0oKSB7XG5cdFx0aWYgKHRoaXMuX3BvaW50c1Byb2dyYW0pIHJldHVybiB0aGlzLl9wb2ludHNQcm9ncmFtO1xuXHRcdGlmIChHUFVQcm9ncmFtLnBvaW50c1ZlcnRleFNoYWRlciA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRjb25zdCB7IGdsLCBuYW1lLCBlcnJvckNhbGxiYWNrLCBnbHNsVmVyc2lvbiB9ID0gdGhpcztcblx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdGNvbnN0IHZlcnRleFNoYWRlclNvdXJjZSA9IGdsc2xWZXJzaW9uID09PSBHTFNMMyA/IHBvaW50c1ZlcnRleFNoYWRlclNvdXJjZV9nbHNsMyA6IHJlcXVpcmUoJy4vZ2xzbF8xL1BvaW50c1ZlcnRleFNoYWRlci5nbHNsJyk7XG5cdFx0XHRpZiAodmVydGV4U2hhZGVyU291cmNlID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdOZWVkIHRvIHdyaXRlIGdsc2wzIHZlcnNpb24gb2YgcG9pbnRzVmVydGV4U2hhZGVyLicpO1xuXHRcdFx0fVxuXHRcdFx0Y29uc3Qgc2hhZGVyID0gY29tcGlsZVNoYWRlcihnbCwgZXJyb3JDYWxsYmFjaywgdmVydGV4U2hhZGVyU291cmNlLCBnbC5WRVJURVhfU0hBREVSLCBuYW1lKTtcblx0XHRcdGlmICghc2hhZGVyKSB7XG5cdFx0XHRcdGVycm9yQ2FsbGJhY2soYFVuYWJsZSB0byBjb21waWxlIHBvaW50cyB2ZXJ0ZXggc2hhZGVyIGZvciBwcm9ncmFtIFwiJHtuYW1lfVwiLmApO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRHUFVQcm9ncmFtLnBvaW50c1ZlcnRleFNoYWRlciA9IHNoYWRlcjtcblx0XHR9XG5cdFx0Y29uc3QgcHJvZ3JhbSA9IHRoaXMuaW5pdFByb2dyYW0oR1BVUHJvZ3JhbS5wb2ludHNWZXJ0ZXhTaGFkZXIsIFBPSU5UU19QUk9HUkFNX05BTUUpO1xuXHRcdHRoaXMuX3BvaW50c1Byb2dyYW0gPSBwcm9ncmFtO1xuXHRcdHJldHVybiB0aGlzLl9wb2ludHNQcm9ncmFtO1xuXHR9XG5cblx0Z2V0IHZlY3RvckZpZWxkUHJvZ3JhbSgpIHtcblx0XHRpZiAodGhpcy5fdmVjdG9yRmllbGRQcm9ncmFtKSByZXR1cm4gdGhpcy5fdmVjdG9yRmllbGRQcm9ncmFtO1xuXHRcdGlmIChHUFVQcm9ncmFtLnZlY3RvckZpZWxkVmVydGV4U2hhZGVyID09PSB1bmRlZmluZWQpIHtcblx0XHRcdGNvbnN0IHsgZ2wsIG5hbWUsIGVycm9yQ2FsbGJhY2ssIGdsc2xWZXJzaW9uIH0gPSB0aGlzO1xuXHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0Y29uc3QgdmVydGV4U2hhZGVyU291cmNlID0gZ2xzbFZlcnNpb24gPT09IEdMU0wzID8gdmVjdG9yRmllbGRWZXJ0ZXhTaGFkZXJTb3VyY2VfZ2xzbDMgOiByZXF1aXJlKCcuL2dsc2xfMS9WZWN0b3JGaWVsZFZlcnRleFNoYWRlci5nbHNsJyk7XG5cdFx0XHRpZiAodmVydGV4U2hhZGVyU291cmNlID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdOZWVkIHRvIHdyaXRlIGdsc2wzIHZlcnNpb24gb2YgdmVjdG9yRmllbGRWZXJ0ZXhTaGFkZXIuJyk7XG5cdFx0XHR9XG5cdFx0XHRjb25zdCBzaGFkZXIgPSBjb21waWxlU2hhZGVyKGdsLCBlcnJvckNhbGxiYWNrLCB2ZXJ0ZXhTaGFkZXJTb3VyY2UsIGdsLlZFUlRFWF9TSEFERVIsIG5hbWUpO1xuXHRcdFx0aWYgKCFzaGFkZXIpIHtcblx0XHRcdFx0ZXJyb3JDYWxsYmFjayhgVW5hYmxlIHRvIGNvbXBpbGUgdmVjdG9yIGZpZWxkIHZlcnRleCBzaGFkZXIgZm9yIHByb2dyYW0gXCIke25hbWV9XCIuYCk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdEdQVVByb2dyYW0udmVjdG9yRmllbGRWZXJ0ZXhTaGFkZXIgPSBzaGFkZXI7XG5cdFx0fVxuXHRcdGNvbnN0IHByb2dyYW0gPSB0aGlzLmluaXRQcm9ncmFtKEdQVVByb2dyYW0udmVjdG9yRmllbGRWZXJ0ZXhTaGFkZXIsIFZFQ1RPUl9GSUVMRF9QUk9HUkFNX05BTUUpO1xuXHRcdHRoaXMuX3ZlY3RvckZpZWxkUHJvZ3JhbSA9IHByb2dyYW07XG5cdFx0cmV0dXJuIHRoaXMuX3ZlY3RvckZpZWxkUHJvZ3JhbTtcblx0fVxuXG5cdGdldCBpbmRleGVkTGluZXNQcm9ncmFtKCkge1xuXHRcdGlmICh0aGlzLl9pbmRleGVkTGluZXNQcm9ncmFtKSByZXR1cm4gdGhpcy5faW5kZXhlZExpbmVzUHJvZ3JhbTtcblx0XHRpZiAoR1BVUHJvZ3JhbS5pbmRleGVkTGluZXNWZXJ0ZXhTaGFkZXIgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Y29uc3QgeyBnbCwgbmFtZSwgZXJyb3JDYWxsYmFjaywgZ2xzbFZlcnNpb24gfSA9IHRoaXM7XG5cdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRjb25zdCB2ZXJ0ZXhTaGFkZXJTb3VyY2UgPSBnbHNsVmVyc2lvbiA9PT0gR0xTTDMgPyBpbmRleGVkTGluZXNWZXJ0ZXhTaGFkZXJTb3VyY2VfZ2xzbDMgOiByZXF1aXJlKCcuL2dsc2xfMS9JbmRleGVkTGluZXNWZXJ0ZXhTaGFkZXIuZ2xzbCcpO1xuXHRcdFx0aWYgKHZlcnRleFNoYWRlclNvdXJjZSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignTmVlZCB0byB3cml0ZSBnbHNsMyB2ZXJzaW9uIG9mIGluZGV4ZWRMaW5lc1ZlcnRleFNoYWRlci4nKTtcblx0XHRcdH1cblx0XHRcdGNvbnN0IHNoYWRlciA9IGNvbXBpbGVTaGFkZXIoZ2wsIGVycm9yQ2FsbGJhY2ssIHZlcnRleFNoYWRlclNvdXJjZSwgZ2wuVkVSVEVYX1NIQURFUiwgbmFtZSk7XG5cdFx0XHRpZiAoIXNoYWRlcikge1xuXHRcdFx0XHRlcnJvckNhbGxiYWNrKGBVbmFibGUgdG8gY29tcGlsZSB2ZWN0b3IgZmllbGQgdmVydGV4IHNoYWRlciBmb3IgcHJvZ3JhbSBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0R1BVUHJvZ3JhbS5pbmRleGVkTGluZXNWZXJ0ZXhTaGFkZXIgPSBzaGFkZXI7XG5cdFx0fVxuXHRcdGNvbnN0IHByb2dyYW0gPSB0aGlzLmluaXRQcm9ncmFtKEdQVVByb2dyYW0uaW5kZXhlZExpbmVzVmVydGV4U2hhZGVyLCBJTkRFWEVEX0xJTkVTX1BST0dSQU1fTkFNRSk7XG5cdFx0dGhpcy5faW5kZXhlZExpbmVzUHJvZ3JhbSA9IHByb2dyYW07XG5cdFx0cmV0dXJuIHRoaXMuX2luZGV4ZWRMaW5lc1Byb2dyYW07XG5cdH1cblxuXHRnZXQgcG9seWxpbmVQcm9ncmFtKCkge1xuXHRcdGlmICh0aGlzLl9wb2x5bGluZVByb2dyYW0pIHJldHVybiB0aGlzLl9wb2x5bGluZVByb2dyYW07XG5cdFx0aWYgKEdQVVByb2dyYW0ucG9seWxpbmVWZXJ0ZXhTaGFkZXIgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Y29uc3QgeyBnbCwgbmFtZSwgZXJyb3JDYWxsYmFjaywgZ2xzbFZlcnNpb24gfSA9IHRoaXM7XG5cdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRjb25zdCB2ZXJ0ZXhTaGFkZXJTb3VyY2UgPSBnbHNsVmVyc2lvbiA9PT0gR0xTTDMgPyBwb2x5bGluZVZlcnRleFNoYWRlclNvdXJjZV9nbHNsMyA6IHJlcXVpcmUoJy4vZ2xzbF8xL1BvbHlsaW5lVmVydGV4U2hhZGVyLmdsc2wnKTtcblx0XHRcdGlmICh2ZXJ0ZXhTaGFkZXJTb3VyY2UgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ05lZWQgdG8gd3JpdGUgZ2xzbDMgdmVyc2lvbiBvZiBwb2x5bGluZVZlcnRleFNoYWRlci4nKTtcblx0XHRcdH1cblx0XHRcdGNvbnN0IHNoYWRlciA9IGNvbXBpbGVTaGFkZXIoZ2wsIGVycm9yQ2FsbGJhY2ssIHZlcnRleFNoYWRlclNvdXJjZSwgZ2wuVkVSVEVYX1NIQURFUiwgbmFtZSk7XG5cdFx0XHRpZiAoIXNoYWRlcikge1xuXHRcdFx0XHRlcnJvckNhbGxiYWNrKGBVbmFibGUgdG8gY29tcGlsZSB2ZWN0b3IgZmllbGQgdmVydGV4IHNoYWRlciBmb3IgcHJvZ3JhbSBcIiR7bmFtZX1cIi5gKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0R1BVUHJvZ3JhbS5wb2x5bGluZVZlcnRleFNoYWRlciA9IHNoYWRlcjtcblx0XHR9XG5cdFx0Y29uc3QgcHJvZ3JhbSA9IHRoaXMuaW5pdFByb2dyYW0oR1BVUHJvZ3JhbS5wb2x5bGluZVZlcnRleFNoYWRlciwgUE9MWUxJTkVfUFJPR1JBTV9OQU1FKTtcblx0XHR0aGlzLl9wb2x5bGluZVByb2dyYW0gPSBwcm9ncmFtO1xuXHRcdHJldHVybiB0aGlzLl9wb2x5bGluZVByb2dyYW07XG5cdH1cblxuXHRwcml2YXRlIGdldCBhY3RpdmVQcm9ncmFtcygpIHtcblx0XHRjb25zdCBwcm9ncmFtcyA9IFtdO1xuXHRcdGlmICh0aGlzLl9kZWZhdWx0UHJvZ3JhbSkgcHJvZ3JhbXMucHVzaCh7XG5cdFx0XHRwcm9ncmFtOiB0aGlzLl9kZWZhdWx0UHJvZ3JhbSxcblx0XHRcdHByb2dyYW1OYW1lOiBERUZBVUxUX1BST0dSQU1fTkFNRSxcblx0XHR9KTtcblx0XHRpZiAodGhpcy5fc2VnbWVudFByb2dyYW0pIHByb2dyYW1zLnB1c2goe1xuXHRcdFx0cHJvZ3JhbTogdGhpcy5fc2VnbWVudFByb2dyYW0sXG5cdFx0XHRwcm9ncmFtTmFtZTogU0VHTUVOVF9QUk9HUkFNX05BTUUsXG5cdFx0fSk7XG5cdFx0aWYgKHRoaXMuX3BvaW50c1Byb2dyYW0pIHByb2dyYW1zLnB1c2goe1xuXHRcdFx0cHJvZ3JhbTogdGhpcy5fcG9pbnRzUHJvZ3JhbSxcblx0XHRcdHByb2dyYW1OYW1lOiBQT0lOVFNfUFJPR1JBTV9OQU1FLFxuXHRcdH0pO1xuXHRcdGlmICh0aGlzLl92ZWN0b3JGaWVsZFByb2dyYW0pIHByb2dyYW1zLnB1c2goe1xuXHRcdFx0cHJvZ3JhbTogdGhpcy5fdmVjdG9yRmllbGRQcm9ncmFtLFxuXHRcdFx0cHJvZ3JhbU5hbWU6IFZFQ1RPUl9GSUVMRF9QUk9HUkFNX05BTUUsXG5cdFx0fSk7XG5cdFx0aWYgKHRoaXMuX2luZGV4ZWRMaW5lc1Byb2dyYW0pIHByb2dyYW1zLnB1c2goe1xuXHRcdFx0cHJvZ3JhbTogdGhpcy5faW5kZXhlZExpbmVzUHJvZ3JhbSxcblx0XHRcdHByb2dyYW1OYW1lOiBJTkRFWEVEX0xJTkVTX1BST0dSQU1fTkFNRSxcblx0XHR9KTtcblx0XHRpZiAodGhpcy5fcG9seWxpbmVQcm9ncmFtKSBwcm9ncmFtcy5wdXNoKHtcblx0XHRcdHByb2dyYW06IHRoaXMuX3BvbHlsaW5lUHJvZ3JhbSxcblx0XHRcdHByb2dyYW1OYW1lOiBQT0xZTElORV9QUk9HUkFNX05BTUUsXG5cdFx0fSk7XG5cdFx0cmV0dXJuIHByb2dyYW1zO1xuXHR9XG5cblx0cHJpdmF0ZSB1bmlmb3JtVHlwZUZvclZhbHVlKFxuXHRcdHZhbHVlOiBudW1iZXIgfCBudW1iZXJbXSxcblx0XHRkYXRhVHlwZTogVW5pZm9ybURhdGFUeXBlLFxuXHQpIHtcblx0XHRpZiAoZGF0YVR5cGUgPT09IEZMT0FUKSB7XG5cdFx0XHQvLyBDaGVjayB0aGF0IHdlIGFyZSBkZWFsaW5nIHdpdGggYSBudW1iZXIuXG5cdFx0XHRpZiAoaXNBcnJheSh2YWx1ZSkpIHtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCAodmFsdWUgYXMgbnVtYmVyW10pLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0aWYgKCFpc051bWJlcigodmFsdWUgYXMgbnVtYmVyW10pW2ldKSkge1xuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHVuaWZvcm0gdmFsdWU6ICR7dmFsdWV9IGZvciBwcm9ncmFtIFwiJHt0aGlzLm5hbWV9XCIsIGV4cGVjdGVkIGZsb2F0IG9yIGZsb2F0W10gb2YgbGVuZ3RoIDEtNC5gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmICghaXNOdW1iZXIodmFsdWUpKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHVuaWZvcm0gdmFsdWU6ICR7dmFsdWV9IGZvciBwcm9ncmFtIFwiJHt0aGlzLm5hbWV9XCIsIGV4cGVjdGVkIGZsb2F0IG9yIGZsb2F0W10gb2YgbGVuZ3RoIDEtNC5gKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKCFpc0FycmF5KHZhbHVlKSB8fCAodmFsdWUgYXMgbnVtYmVyW10pLmxlbmd0aCA9PT0gMSkge1xuXHRcdFx0XHRyZXR1cm4gRkxPQVRfMURfVU5JRk9STTtcblx0XHRcdH1cblx0XHRcdGlmICgodmFsdWUgYXMgbnVtYmVyW10pLmxlbmd0aCA9PT0gMikge1xuXHRcdFx0XHRyZXR1cm4gRkxPQVRfMkRfVU5JRk9STTtcblx0XHRcdH1cblx0XHRcdGlmICgodmFsdWUgYXMgbnVtYmVyW10pLmxlbmd0aCA9PT0gMykge1xuXHRcdFx0XHRyZXR1cm4gRkxPQVRfM0RfVU5JRk9STTtcblx0XHRcdH1cblx0XHRcdGlmICgodmFsdWUgYXMgbnVtYmVyW10pLmxlbmd0aCA9PT0gNCkge1xuXHRcdFx0XHRyZXR1cm4gRkxPQVRfNERfVU5JRk9STTtcblx0XHRcdH1cblx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB1bmlmb3JtIHZhbHVlOiAke3ZhbHVlfSBmb3IgcHJvZ3JhbSBcIiR7dGhpcy5uYW1lfVwiLCBleHBlY3RlZCBmbG9hdCBvciBmbG9hdFtdIG9mIGxlbmd0aCAxLTQuYCk7XG5cdFx0fSBlbHNlIGlmIChkYXRhVHlwZSA9PT0gSU5UKSB7XG5cdFx0XHQvLyBDaGVjayB0aGF0IHdlIGFyZSBkZWFsaW5nIHdpdGggYW4gaW50LlxuXHRcdFx0aWYgKGlzQXJyYXkodmFsdWUpKSB7XG5cdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgKHZhbHVlIGFzIG51bWJlcltdKS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdGlmICghaXNJbnRlZ2VyKCh2YWx1ZSBhcyBudW1iZXJbXSlbaV0pKSB7XG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdW5pZm9ybSB2YWx1ZTogJHt2YWx1ZX0gZm9yIHByb2dyYW0gXCIke3RoaXMubmFtZX1cIiwgZXhwZWN0ZWQgaW50IG9yIGludFtdIG9mIGxlbmd0aCAxLTQuYCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAoIWlzSW50ZWdlcih2YWx1ZSkpIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdW5pZm9ybSB2YWx1ZTogJHt2YWx1ZX0gZm9yIHByb2dyYW0gXCIke3RoaXMubmFtZX1cIiwgZXhwZWN0ZWQgaW50IG9yIGludFtdIG9mIGxlbmd0aCAxLTQuYCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmICghaXNBcnJheSh2YWx1ZSkgfHwgKHZhbHVlIGFzIG51bWJlcltdKS5sZW5ndGggPT09IDEpIHtcblx0XHRcdFx0cmV0dXJuIElOVF8xRF9VTklGT1JNO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCh2YWx1ZSBhcyBudW1iZXJbXSkubGVuZ3RoID09PSAyKSB7XG5cdFx0XHRcdHJldHVybiBJTlRfMkRfVU5JRk9STTtcblx0XHRcdH1cblx0XHRcdGlmICgodmFsdWUgYXMgbnVtYmVyW10pLmxlbmd0aCA9PT0gMykge1xuXHRcdFx0XHRyZXR1cm4gSU5UXzNEX1VOSUZPUk07XG5cdFx0XHR9XG5cdFx0XHRpZiAoKHZhbHVlIGFzIG51bWJlcltdKS5sZW5ndGggPT09IDQpIHtcblx0XHRcdFx0cmV0dXJuIElOVF80RF9VTklGT1JNO1xuXHRcdFx0fVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHVuaWZvcm0gdmFsdWU6ICR7dmFsdWV9IGZvciBwcm9ncmFtIFwiJHt0aGlzLm5hbWV9XCIsIGV4cGVjdGVkIGludCBvciBpbnRbXSBvZiBsZW5ndGggMS00LmApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdW5pZm9ybSBkYXRhIHR5cGU6ICR7ZGF0YVR5cGV9IGZvciBwcm9ncmFtIFwiJHt0aGlzLm5hbWV9XCIsIGV4cGVjdGVkICR7RkxPQVR9IG9yICR7SU5UfS5gKTtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIHNldFByb2dyYW1Vbmlmb3JtKFxuXHRcdHByb2dyYW06IFdlYkdMUHJvZ3JhbSxcblx0XHRwcm9ncmFtTmFtZTogc3RyaW5nLFxuXHRcdHVuaWZvcm1OYW1lOiBzdHJpbmcsXG5cdFx0dmFsdWU6IFVuaWZvcm1WYWx1ZVR5cGUsXG5cdFx0dHlwZTogVW5pZm9ybVR5cGUsXG5cdCkge1xuXHRcdGNvbnN0IHsgZ2wsIHVuaWZvcm1zLCBlcnJvckNhbGxiYWNrIH0gPSB0aGlzO1xuXHRcdC8vIFNldCBhY3RpdmUgcHJvZ3JhbS5cblx0XHRnbC51c2VQcm9ncmFtKHByb2dyYW0pO1xuXG5cdFx0bGV0IGxvY2F0aW9uID0gdW5pZm9ybXNbdW5pZm9ybU5hbWVdPy5sb2NhdGlvbltwcm9ncmFtTmFtZV07XG5cdFx0Ly8gSW5pdCBhIGxvY2F0aW9uIGZvciBXZWJHTFByb2dyYW0gaWYgbmVlZGVkLlxuXHRcdGlmIChsb2NhdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRjb25zdCBfbG9jYXRpb24gPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24ocHJvZ3JhbSwgdW5pZm9ybU5hbWUpO1xuXHRcdFx0aWYgKCFfbG9jYXRpb24pIHtcblx0XHRcdFx0ZXJyb3JDYWxsYmFjayhgQ291bGQgbm90IGluaXQgdW5pZm9ybSBcIiR7dW5pZm9ybU5hbWV9XCIgZm9yIHByb2dyYW0gXCIke3RoaXMubmFtZX1cIi5cbkNoZWNrIHRoYXQgdW5pZm9ybSBpcyBwcmVzZW50IGluIHNoYWRlciBjb2RlLCB1bnVzZWQgdW5pZm9ybXMgbWF5IGJlIHJlbW92ZWQgYnkgY29tcGlsZXIuXG5BbHNvIGNoZWNrIHRoYXQgdW5pZm9ybSB0eXBlIGluIHNoYWRlciBjb2RlIG1hdGNoZXMgdHlwZSAke3R5cGV9LlxuRXJyb3IgY29kZTogJHtnbC5nZXRFcnJvcigpfS5gKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0bG9jYXRpb24gPSBfbG9jYXRpb247XG5cdFx0XHQvLyBTYXZlIGxvY2F0aW9uIGZvciBmdXR1cmUgdXNlLlxuXHRcdFx0aWYgKHVuaWZvcm1zW3VuaWZvcm1OYW1lXSkge1xuXHRcdFx0XHR1bmlmb3Jtc1t1bmlmb3JtTmFtZV0ubG9jYXRpb25bcHJvZ3JhbU5hbWVdID0gbG9jYXRpb247XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gU2V0IHVuaWZvcm0uXG5cdFx0Ly8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1dlYkdMUmVuZGVyaW5nQ29udGV4dC91bmlmb3JtXG5cdFx0c3dpdGNoICh0eXBlKSB7XG5cdFx0XHRjYXNlIEZMT0FUXzFEX1VOSUZPUk06XG5cdFx0XHRcdGdsLnVuaWZvcm0xZihsb2NhdGlvbiwgdmFsdWUgYXMgbnVtYmVyKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIEZMT0FUXzJEX1VOSUZPUk06XG5cdFx0XHRcdGdsLnVuaWZvcm0yZnYobG9jYXRpb24sIHZhbHVlIGFzIG51bWJlcltdKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIEZMT0FUXzNEX1VOSUZPUk06XG5cdFx0XHRcdGdsLnVuaWZvcm0zZnYobG9jYXRpb24sIHZhbHVlIGFzIG51bWJlcltdKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIEZMT0FUXzREX1VOSUZPUk06XG5cdFx0XHRcdGdsLnVuaWZvcm00ZnYobG9jYXRpb24sIHZhbHVlIGFzIG51bWJlcltdKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIElOVF8xRF9VTklGT1JNOlxuXHRcdFx0XHRnbC51bmlmb3JtMWkobG9jYXRpb24sIHZhbHVlIGFzIG51bWJlcik7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBJTlRfMkRfVU5JRk9STTpcblx0XHRcdFx0Z2wudW5pZm9ybTJpdihsb2NhdGlvbiwgdmFsdWUgYXMgbnVtYmVyW10pO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgSU5UXzNEX1VOSUZPUk06XG5cdFx0XHRcdGdsLnVuaWZvcm0zaXYobG9jYXRpb24sIHZhbHVlIGFzIG51bWJlcltdKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIElOVF80RF9VTklGT1JNOlxuXHRcdFx0XHRnbC51bmlmb3JtNGl2KGxvY2F0aW9uLCB2YWx1ZSBhcyBudW1iZXJbXSk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbmtub3duIHVuaWZvcm0gdHlwZSAke3R5cGV9IGZvciBHUFVQcm9ncmFtIFwiJHt0aGlzLm5hbWV9XCIuYCk7XG5cdFx0fVxuXHR9XG5cblx0c2V0VW5pZm9ybShcblx0XHR1bmlmb3JtTmFtZTogc3RyaW5nLFxuXHRcdHZhbHVlOiBVbmlmb3JtVmFsdWVUeXBlLFxuXHRcdGRhdGFUeXBlPzogVW5pZm9ybURhdGFUeXBlLFxuXHQpIHtcblx0XHRjb25zdCB7IGFjdGl2ZVByb2dyYW1zLCB1bmlmb3JtcyB9ID0gdGhpcztcblxuXHRcdGxldCB0eXBlID0gdW5pZm9ybXNbdW5pZm9ybU5hbWVdPy50eXBlO1xuXHRcdGlmIChkYXRhVHlwZSkge1xuXHRcdFx0Y29uc3QgdHlwZVBhcmFtID0gdGhpcy51bmlmb3JtVHlwZUZvclZhbHVlKHZhbHVlLCBkYXRhVHlwZSk7XG5cdFx0XHRpZiAodHlwZSA9PT0gdW5kZWZpbmVkKSB0eXBlID0gdHlwZVBhcmFtO1xuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdC8vIGNvbnNvbGUud2FybihgRG9uJ3QgbmVlZCB0byBwYXNzIGluIGRhdGFUeXBlIHRvIEdQVVByb2dyYW0uc2V0VW5pZm9ybSBmb3IgcHJldmlvdXNseSBpbml0ZWQgdW5pZm9ybSBcIiR7dW5pZm9ybU5hbWV9XCJgKTtcblx0XHRcdFx0Ly8gQ2hlY2sgdGhhdCB0eXBlcyBtYXRjaCBwcmV2aW91c2x5IHNldCB1bmlmb3JtLlxuXHRcdFx0XHRpZiAodHlwZSAhPT0gdHlwZVBhcmFtKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbmlmb3JtIFwiJHt1bmlmb3JtTmFtZX1cIiBmb3IgR1BVUHJvZ3JhbSBcIiR7dGhpcy5uYW1lfVwiIGNhbm5vdCBjaGFuZ2UgZnJvbSB0eXBlICR7dHlwZX0gdG8gdHlwZSAke3R5cGVQYXJhbX0uYCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKHR5cGUgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbmtub3duIHR5cGUgZm9yIHVuaWZvcm0gXCIke3VuaWZvcm1OYW1lfVwiLCBwbGVhc2UgcGFzcyBpbiBkYXRhVHlwZSB0byBHUFVQcm9ncmFtLnNldFVuaWZvcm0gd2hlbiBpbml0aW5nIGEgbmV3IHVuaWZvcm0uYCk7XG5cdFx0fVxuXG5cdFx0aWYgKCF1bmlmb3Jtc1t1bmlmb3JtTmFtZV0pIHtcblx0XHRcdC8vIEluaXQgdW5pZm9ybSBpZiBuZWVkZWQuXG5cdFx0XHR1bmlmb3Jtc1t1bmlmb3JtTmFtZV0gPSB7IHR5cGUsIGxvY2F0aW9uOiB7fSwgdmFsdWUgfTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gVXBkYXRlIHZhbHVlLlxuXHRcdFx0dW5pZm9ybXNbdW5pZm9ybU5hbWVdLnZhbHVlID0gdmFsdWU7XG5cdFx0fVxuXG5cdFx0Ly8gVXBkYXRlIGFueSBhY3RpdmUgcHJvZ3JhbXMuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBhY3RpdmVQcm9ncmFtcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0Y29uc3QgeyBwcm9ncmFtLCBwcm9ncmFtTmFtZSB9ID0gYWN0aXZlUHJvZ3JhbXNbaV07XG5cdFx0XHR0aGlzLnNldFByb2dyYW1Vbmlmb3JtKHByb2dyYW0sIHByb2dyYW1OYW1lLCB1bmlmb3JtTmFtZSwgdmFsdWUsIHR5cGUpO1xuXHRcdH1cblx0fTtcblxuXHRzZXRWZXJ0ZXhVbmlmb3JtKFxuXHRcdHByb2dyYW06IFdlYkdMUHJvZ3JhbSxcblx0XHR1bmlmb3JtTmFtZTogc3RyaW5nLFxuXHRcdHZhbHVlOiBVbmlmb3JtVmFsdWVUeXBlLFxuXHRcdGRhdGFUeXBlOiBVbmlmb3JtRGF0YVR5cGUsXG5cdCkge1xuXHRcdGNvbnN0IHR5cGUgPSB0aGlzLnVuaWZvcm1UeXBlRm9yVmFsdWUodmFsdWUsIGRhdGFUeXBlKTtcblx0XHRpZiAocHJvZ3JhbSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ011c3QgcGFzcyBpbiB2YWxpZCBXZWJHTFByb2dyYW0gdG8gc2V0VmVydGV4VW5pZm9ybSwgZ290IHVuZGVmaW5lZC4nKTtcblx0XHR9XG5cdFx0bGV0IHByb2dyYW1OYW1lOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cdFx0c3dpdGNoKHByb2dyYW0pIHtcblx0XHRcdGNhc2UgdGhpcy5fZGVmYXVsdFByb2dyYW06XG5cdFx0XHRcdHByb2dyYW1OYW1lID0gREVGQVVMVF9QUk9HUkFNX05BTUU7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSB0aGlzLl9zZWdtZW50UHJvZ3JhbTpcblx0XHRcdFx0cHJvZ3JhbU5hbWUgPSBTRUdNRU5UX1BST0dSQU1fTkFNRTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIHRoaXMuX3BvaW50c1Byb2dyYW06XG5cdFx0XHRcdHByb2dyYW1OYW1lID0gUE9JTlRTX1BST0dSQU1fTkFNRTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIHRoaXMuX3ZlY3RvckZpZWxkUHJvZ3JhbTpcblx0XHRcdFx0cHJvZ3JhbU5hbWUgPSBWRUNUT1JfRklFTERfUFJPR1JBTV9OQU1FO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgdGhpcy5faW5kZXhlZExpbmVzUHJvZ3JhbTpcblx0XHRcdFx0cHJvZ3JhbU5hbWUgPSBJTkRFWEVEX0xJTkVTX1BST0dSQU1fTkFNRTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIHRoaXMuX3BvbHlsaW5lUHJvZ3JhbTpcblx0XHRcdFx0cHJvZ3JhbU5hbWUgPSBQT0xZTElORV9QUk9HUkFNX05BTUU7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCB2YWxpZCB2ZXJ0ZXggcHJvZ3JhbU5hbWUgZm9yIFdlYkdMUHJvZ3JhbSBcIiR7dGhpcy5uYW1lfVwiLmApO1xuXHRcdH1cblx0XHR0aGlzLnNldFByb2dyYW1Vbmlmb3JtKHByb2dyYW0sIHByb2dyYW1OYW1lLCB1bmlmb3JtTmFtZSwgdmFsdWUsIHR5cGUpO1xuXHR9XG5cblx0ZGVzdHJveSgpIHtcblx0XHRjb25zdCB7IGdsLCBmcmFnbWVudFNoYWRlciwgYWN0aXZlUHJvZ3JhbXMgfSA9IHRoaXM7XG5cdFx0Ly8gVW5iaW5kIGFsbCBnbCBkYXRhIGJlZm9yZSBkZWxldGluZy5cblx0XHRhY3RpdmVQcm9ncmFtcy5mb3JFYWNoKCh7IHByb2dyYW0gfSkgPT4ge1xuXHRcdFx0Z2wuZGVsZXRlUHJvZ3JhbShwcm9ncmFtKTtcblx0XHR9KTtcblx0XHQvLyBGcm9tIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9XZWJHTFJlbmRlcmluZ0NvbnRleHQvZGVsZXRlU2hhZGVyXG5cdFx0Ly8gVGhpcyBtZXRob2QgaGFzIG5vIGVmZmVjdCBpZiB0aGUgc2hhZGVyIGhhcyBhbHJlYWR5IGJlZW4gZGVsZXRlZFxuXHRcdGdsLmRlbGV0ZVNoYWRlcihmcmFnbWVudFNoYWRlcik7XG5cblx0XHRkZWxldGUgdGhpcy5fZGVmYXVsdFByb2dyYW07XG5cdFx0ZGVsZXRlIHRoaXMuX3NlZ21lbnRQcm9ncmFtO1xuXHRcdGRlbGV0ZSB0aGlzLl9wb2ludHNQcm9ncmFtO1xuXHRcdGRlbGV0ZSB0aGlzLl92ZWN0b3JGaWVsZFByb2dyYW07XG5cdFx0ZGVsZXRlIHRoaXMuX2luZGV4ZWRMaW5lc1Byb2dyYW07XG5cdFx0ZGVsZXRlIHRoaXMuX3BvbHlsaW5lUHJvZ3JhbTtcblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0ZGVsZXRlIHRoaXMuZnJhZ21lbnRTaGFkZXI7XG5cblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0ZGVsZXRlIHRoaXMuZ2w7XG5cdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdGRlbGV0ZSB0aGlzLmVycm9yQ2FsbGJhY2s7XG5cdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdGRlbGV0ZSB0aGlzLnByb2dyYW07XG5cdH1cbn1cbiIsImltcG9ydCB7IHNhdmVBcyB9IGZyb20gJ2ZpbGUtc2F2ZXInO1xuLy8gQHRzLWlnbm9yZVxuaW1wb3J0IHsgY2hhbmdlRHBpQmxvYiB9IGZyb20gJ2NoYW5nZWRwaSc7XG5pbXBvcnQgeyBEYXRhTGF5ZXIgfSBmcm9tICcuL0RhdGFMYXllcic7XG5pbXBvcnQge1xuXHREYXRhTGF5ZXJBcnJheVR5cGUsIERhdGFMYXllckZpbHRlclR5cGUsIERhdGFMYXllck51bUNvbXBvbmVudHMsIERhdGFMYXllclR5cGUsIERhdGFMYXllcldyYXBUeXBlLFxuXHRGTE9BVCwgSEFMRl9GTE9BVCwgVU5TSUdORURfQllURSwgQllURSwgVU5TSUdORURfU0hPUlQsIFNIT1JULCBVTlNJR05FRF9JTlQsIElOVCxcblx0VW5pZm9ybURhdGFUeXBlLCBVbmlmb3JtVmFsdWVUeXBlLCBHTFNMVmVyc2lvbiwgR0xTTDEsIEdMU0wzLCBDTEFNUF9UT19FREdFLCBUZXh0dXJlRm9ybWF0VHlwZSwgTkVBUkVTVCwgUkdCQSwgVGV4dHVyZURhdGFUeXBlLFxufSBmcm9tICcuL0NvbnN0YW50cyc7XG5pbXBvcnQgeyBHUFVQcm9ncmFtIH0gZnJvbSAnLi9HUFVQcm9ncmFtJztcbmltcG9ydCB7IFdlYkdMUmVuZGVyZXIsIFRleHR1cmUsIFZlY3RvcjQgfSBmcm9tICd0aHJlZSc7Ly8gSnVzdCBpbXBvcnRpbmcgdGhlIHR5cGVzIGhlcmUuXG5pbXBvcnQgKiBhcyB1dGlscyBmcm9tICcuL3V0aWxzL1ZlY3RvcjQnO1xuaW1wb3J0IHsgaXNXZWJHTDIsIGlzUG93ZXJPZjIgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IGdldEZsb2F0MTYgfSBmcm9tICdAcGV0YW1vcmlrZW4vZmxvYXQxNic7XG5pbXBvcnQge1xuXHRpc0FycmF5LFxuXHRpc1N0cmluZywgaXNWYWxpZEZpbHRlclR5cGUsIGlzVmFsaWRUZXh0dXJlRGF0YVR5cGUsIGlzVmFsaWRUZXh0dXJlRm9ybWF0VHlwZSwgaXNWYWxpZFdyYXBUeXBlLFxuXHR2YWxpZEZpbHRlclR5cGVzLCB2YWxpZFRleHR1cmVEYXRhVHlwZXMsIHZhbGlkVGV4dHVyZUZvcm1hdFR5cGVzLCB2YWxpZFdyYXBUeXBlcyB9IGZyb20gJy4vQ2hlY2tzJztcblxuY29uc3QgREVGQVVMVF9DSVJDTEVfTlVNX1NFR01FTlRTID0gMTg7Ly8gTXVzdCBiZSBkaXZpc2libGUgYnkgNiB0byB3b3JrIHdpdGggc3RlcFNlZ21lbnQoKS5cblxudHlwZSBFcnJvckNhbGxiYWNrID0gKG1lc3NhZ2U6IHN0cmluZykgPT4gdm9pZDtcblxuZXhwb3J0IGNsYXNzIFdlYkdMQ29tcHV0ZSB7XG5cdHJlYWRvbmx5IGdsITogV2ViR0xSZW5kZXJpbmdDb250ZXh0IHwgV2ViR0wyUmVuZGVyaW5nQ29udGV4dDtcblx0cmVhZG9ubHkgZ2xzbFZlcnNpb24hOiBHTFNMVmVyc2lvbjtcblx0Ly8gVGhlc2Ugd2lkdGggYW5kIGhlaWdodCBhcmUgdGhlIGN1cnJlbnQgY2FudmFzIGF0IGZ1bGwgcmVzLlxuXHRwcml2YXRlIHdpZHRoITogbnVtYmVyO1xuXHRwcml2YXRlIGhlaWdodCE6IG51bWJlcjtcblxuXHRwcml2YXRlIGVycm9yU3RhdGUgPSBmYWxzZTtcblx0cHJpdmF0ZSByZWFkb25seSBlcnJvckNhbGxiYWNrOiBFcnJvckNhbGxiYWNrO1xuXG5cdC8vIFNhdmUgdGhyZWVqcyByZW5kZXJlciBpZiBwYXNzZWQgaW4uXG5cdHByaXZhdGUgcmVuZGVyZXI/OiBXZWJHTFJlbmRlcmVyO1xuXHRwcml2YXRlIHJlYWRvbmx5IG1heE51bVRleHR1cmVzITogbnVtYmVyO1xuXHRcblx0Ly8gUHJlY29tcHV0ZWQgYnVmZmVycyAoaW5pdGVkIGFzIG5lZWRlZCkuXG5cdHByaXZhdGUgX3F1YWRQb3NpdGlvbnNCdWZmZXI/OiBXZWJHTEJ1ZmZlcjtcblx0cHJpdmF0ZSBfYm91bmRhcnlQb3NpdGlvbnNCdWZmZXI/OiBXZWJHTEJ1ZmZlcjtcblx0Ly8gU3RvcmUgbXVsdGlwbGUgY2lyY2xlIHBvc2l0aW9ucyBidWZmZXJzIGZvciB2YXJpb3VzIG51bSBzZWdtZW50cywgdXNlIG51bVNlZ21lbnRzIGFzIGtleS5cblx0cHJpdmF0ZSBfY2lyY2xlUG9zaXRpb25zQnVmZmVyOiB7IFtrZXk6IG51bWJlcl06IFdlYkdMQnVmZmVyIH0gPSB7fTtcblxuXHRwcml2YXRlIHBvaW50SW5kZXhBcnJheT86IEZsb2F0MzJBcnJheTtcblx0cHJpdmF0ZSBwb2ludEluZGV4QnVmZmVyPzogV2ViR0xCdWZmZXI7XG5cdHByaXZhdGUgdmVjdG9yRmllbGRJbmRleEFycmF5PzogRmxvYXQzMkFycmF5O1xuXHRwcml2YXRlIHZlY3RvckZpZWxkSW5kZXhCdWZmZXI/OiBXZWJHTEJ1ZmZlcjtcblx0cHJpdmF0ZSBpbmRleGVkTGluZXNJbmRleEJ1ZmZlcj86IFdlYkdMQnVmZmVyO1xuXG5cdC8vIFByb2dyYW1zIGZvciBjb3B5aW5nIGRhdGEgKHRoZXNlIGFyZSBuZWVkZWQgZm9yIHJlbmRlcmluZyBwYXJ0aWFsIHNjcmVlbiBnZW9tZXRyaWVzKS5cblx0cHJpdmF0ZSByZWFkb25seSBjb3B5RmxvYXRQcm9ncmFtITogR1BVUHJvZ3JhbTtcblx0cHJpdmF0ZSByZWFkb25seSBjb3B5SW50UHJvZ3JhbSE6IEdQVVByb2dyYW07XG5cdHByaXZhdGUgcmVhZG9ubHkgY29weVVpbnRQcm9ncmFtITogR1BVUHJvZ3JhbTtcblxuXHQvLyBPdGhlciB1dGlsIHByb2dyYW1zLlxuXHRwcml2YXRlIF9zaW5nbGVDb2xvclByb2dyYW0/OiBHUFVQcm9ncmFtO1xuXHRwcml2YXRlIF9zaW5nbGVDb2xvcldpdGhXcmFwQ2hlY2tQcm9ncmFtPzogR1BVUHJvZ3JhbTtcblxuXHRzdGF0aWMgaW5pdFdpdGhUaHJlZVJlbmRlcmVyKFxuXHRcdHJlbmRlcmVyOiBXZWJHTFJlbmRlcmVyLFxuXHRcdHBhcmFtczoge1xuXHRcdFx0Z2xzbFZlcnNpb24/OiBHTFNMVmVyc2lvbixcblx0XHR9LFxuXHRcdGVycm9yQ2FsbGJhY2s/OiBFcnJvckNhbGxiYWNrLFxuXHQpIHtcblx0XHRyZXR1cm4gbmV3IFdlYkdMQ29tcHV0ZShcblx0XHRcdHtcblx0XHRcdFx0Y2FudmFzOiByZW5kZXJlci5kb21FbGVtZW50LFxuXHRcdFx0XHRjb250ZXh0OiByZW5kZXJlci5nZXRDb250ZXh0KCksXG5cdFx0XHRcdC4uLnBhcmFtcyxcblx0XHRcdH0sXG5cdFx0XHRlcnJvckNhbGxiYWNrLFxuXHRcdFx0cmVuZGVyZXIsXG5cdFx0KTtcblx0fVxuXG5cdGNvbnN0cnVjdG9yKFxuXHRcdHBhcmFtczoge1xuXHRcdFx0Y2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCxcblx0XHRcdGNvbnRleHQ/OiBXZWJHTFJlbmRlcmluZ0NvbnRleHQgfCBXZWJHTDJSZW5kZXJpbmdDb250ZXh0IHwgbnVsbCxcblx0XHRcdGFudGlhbGlhcz86IGJvb2xlYW4sXG5cdFx0XHRnbHNsVmVyc2lvbj86IEdMU0xWZXJzaW9uLFxuXHRcdH0sXG5cdFx0Ly8gT3B0aW9uYWxseSBwYXNzIGluIGFuIGVycm9yIGNhbGxiYWNrIGluIGNhc2Ugd2Ugd2FudCB0byBoYW5kbGUgZXJyb3JzIHJlbGF0ZWQgdG8gd2ViZ2wgc3VwcG9ydC5cblx0XHQvLyBlLmcuIHRocm93IHVwIGEgbW9kYWwgdGVsbGluZyB1c2VyIHRoaXMgd2lsbCBub3Qgd29yayBvbiB0aGVpciBkZXZpY2UuXG5cdFx0ZXJyb3JDYWxsYmFjazogRXJyb3JDYWxsYmFjayA9IChtZXNzYWdlOiBzdHJpbmcpID0+IHsgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpIH0sXG5cdFx0cmVuZGVyZXI/OiBXZWJHTFJlbmRlcmVyLFxuXHQpIHtcblx0XHQvLyBDaGVjayBwYXJhbXMuXG5cdFx0Y29uc3QgdmFsaWRLZXlzID0gWydjYW52YXMnLCAnY29udGV4dCcsICdhbnRpYWxpYXMnLCAnZ2xzbFZlcnNpb24nXTtcblx0XHRPYmplY3Qua2V5cyhwYXJhbXMpLmZvckVhY2goa2V5ID0+IHtcblx0XHRcdGlmICh2YWxpZEtleXMuaW5kZXhPZihrZXkpIDwgMCkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQga2V5ICR7a2V5fSBwYXNzZWQgdG8gV2ViR0xDb21wdXRlLmNvbnN0cnVjdG9yLiAgVmFsaWQga2V5cyBhcmUgJHt2YWxpZEtleXMuam9pbignLCAnKX0uYCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0Ly8gU2F2ZSBjYWxsYmFjayBpbiBjYXNlIHdlIHJ1biBpbnRvIGFuIGVycm9yLlxuXHRcdGNvbnN0IHNlbGYgPSB0aGlzO1xuXHRcdHRoaXMuZXJyb3JDYWxsYmFjayA9IChtZXNzYWdlOiBzdHJpbmcpID0+IHtcblx0XHRcdGlmIChzZWxmLmVycm9yU3RhdGUpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0c2VsZi5lcnJvclN0YXRlID0gdHJ1ZTtcblx0XHRcdGVycm9yQ2FsbGJhY2sobWVzc2FnZSk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgeyBjYW52YXMgfSA9IHBhcmFtcztcblx0XHRsZXQgZ2wgPSBwYXJhbXMuY29udGV4dDtcblxuXHRcdC8vIEluaXQgR0wuXG5cdFx0aWYgKCFnbCkge1xuXHRcdFx0Y29uc3Qgb3B0aW9uczogYW55ID0ge307XG5cdFx0XHRpZiAocGFyYW1zLmFudGlhbGlhcyAhPT0gdW5kZWZpbmVkKSBvcHRpb25zLmFudGlhbGlhcyA9IHBhcmFtcy5hbnRpYWxpYXM7XG5cdFx0XHQvLyBJbml0IGEgZ2wgY29udGV4dCBpZiBub3QgcGFzc2VkIGluLlxuXHRcdFx0Z2wgPSBjYW52YXMuZ2V0Q29udGV4dCgnd2ViZ2wyJywgb3B0aW9ucykgIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQgfCBudWxsXG5cdFx0XHRcdHx8IGNhbnZhcy5nZXRDb250ZXh0KCd3ZWJnbCcsIG9wdGlvbnMpICBhcyBXZWJHTFJlbmRlcmluZ0NvbnRleHQgfCBudWxsXG5cdFx0XHRcdHx8IGNhbnZhcy5nZXRDb250ZXh0KCdleHBlcmltZW50YWwtd2ViZ2wnLCBvcHRpb25zKSAgYXMgV2ViR0xSZW5kZXJpbmdDb250ZXh0IHwgbnVsbDtcblx0XHRcdGlmIChnbCA9PT0gbnVsbCkge1xuXHRcdFx0XHR0aGlzLmVycm9yQ2FsbGJhY2soJ1VuYWJsZSB0byBpbml0aWFsaXplIFdlYkdMIGNvbnRleHQuJyk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKGlzV2ViR0wyKGdsKSkge1xuXHRcdFx0Y29uc29sZS5sb2coJ1VzaW5nIFdlYkdMIDIuMCBjb250ZXh0LicpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zb2xlLmxvZygnVXNpbmcgV2ViR0wgMS4wIGNvbnRleHQuJyk7XG5cdFx0fVxuXHRcdHRoaXMuZ2wgPSBnbDtcblx0XHR0aGlzLnJlbmRlcmVyID0gcmVuZGVyZXI7XG5cblx0XHQvLyBTYXZlIGdsc2wgdmVyc2lvbiwgZGVmYXVsdCB0byAxLnguXG5cdFx0Y29uc3QgZ2xzbFZlcnNpb24gPSBwYXJhbXMuZ2xzbFZlcnNpb24gPT09IHVuZGVmaW5lZCA/IEdMU0wxIDogcGFyYW1zLmdsc2xWZXJzaW9uO1xuXHRcdHRoaXMuZ2xzbFZlcnNpb24gPSBnbHNsVmVyc2lvbjtcblx0XHRpZiAoIWlzV2ViR0wyKGdsKSAmJiBnbHNsVmVyc2lvbiA9PT0gR0xTTDMpIHtcblx0XHRcdGNvbnNvbGUud2FybignR0xTTDMueCBpcyBpbmNvbXBhdGlibGUgd2l0aCBXZWJHTDEuMCBjb250ZXh0cy4nKTtcblx0XHR9XG5cblx0XHQvLyBHTCBzZXR1cC5cblx0XHQvLyBEaXNhYmxlIGRlcHRoIHRlc3RpbmcgZ2xvYmFsbHkuXG5cdFx0Z2wuZGlzYWJsZShnbC5ERVBUSF9URVNUKTtcblx0XHQvLyBTZXQgdW5wYWNrIGFsaWdubWVudCB0byAxIHNvIHdlIGNhbiBoYXZlIHRleHR1cmVzIG9mIGFyYml0cmFyeSBkaW1lbnNpb25zLlxuXHRcdC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzUxNTgyMjgyL2Vycm9yLXdoZW4tY3JlYXRpbmctdGV4dHVyZXMtaW4td2ViZ2wtd2l0aC10aGUtcmdiLWZvcm1hdFxuXHRcdGdsLnBpeGVsU3RvcmVpKGdsLlVOUEFDS19BTElHTk1FTlQsIDEpO1xuXHRcdC8vIFRPRE86IGxvb2sgaW50byBtb3JlIG9mIHRoZXNlOiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvV2ViR0xSZW5kZXJpbmdDb250ZXh0L3BpeGVsU3RvcmVpXG5cdFx0Ly8gLy8gU29tZSBpbXBsZW1lbnRhdGlvbnMgb2YgSFRNTENhbnZhc0VsZW1lbnQncyBvciBPZmZzY3JlZW5DYW52YXMncyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgc3RvcmUgY29sb3IgdmFsdWVzXG5cdFx0Ly8gLy8gaW50ZXJuYWxseSBpbiBwcmVtdWx0aXBsaWVkIGZvcm0uIElmIHN1Y2ggYSBjYW52YXMgaXMgdXBsb2FkZWQgdG8gYSBXZWJHTCB0ZXh0dXJlIHdpdGggdGhlXG5cdFx0Ly8gLy8gVU5QQUNLX1BSRU1VTFRJUExZX0FMUEhBX1dFQkdMIHBpeGVsIHN0b3JhZ2UgcGFyYW1ldGVyIHNldCB0byBmYWxzZSwgdGhlIGNvbG9yIGNoYW5uZWxzIHdpbGwgaGF2ZSB0byBiZSB1bi1tdWx0aXBsaWVkXG5cdFx0Ly8gLy8gYnkgdGhlIGFscGhhIGNoYW5uZWwsIHdoaWNoIGlzIGEgbG9zc3kgb3BlcmF0aW9uLiBUaGUgV2ViR0wgaW1wbGVtZW50YXRpb24gdGhlcmVmb3JlIGNhbiBub3QgZ3VhcmFudGVlIHRoYXQgY29sb3JzXG5cdFx0Ly8gLy8gd2l0aCBhbHBoYSA8IDEuMCB3aWxsIGJlIHByZXNlcnZlZCBsb3NzbGVzc2x5IHdoZW4gZmlyc3QgZHJhd24gdG8gYSBjYW52YXMgdmlhIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBhbmQgdGhlblxuXHRcdC8vIC8vIHVwbG9hZGVkIHRvIGEgV2ViR0wgdGV4dHVyZSB3aGVuIHRoZSBVTlBBQ0tfUFJFTVVMVElQTFlfQUxQSEFfV0VCR0wgcGl4ZWwgc3RvcmFnZSBwYXJhbWV0ZXIgaXMgc2V0IHRvIGZhbHNlLlxuXHRcdC8vIGdsLnBpeGVsU3RvcmVpKGdsLlVOUEFDS19QUkVNVUxUSVBMWV9BTFBIQV9XRUJHTCwgdHJ1ZSk7XG5cblx0XHQvLyBJbml0IHByb2dyYW1zIHRvIHBhc3MgdmFsdWVzIGZyb20gb25lIHRleHR1cmUgdG8gYW5vdGhlci5cblx0XHR0aGlzLmNvcHlGbG9hdFByb2dyYW0gPSB0aGlzLmluaXRQcm9ncmFtKHtcblx0XHRcdG5hbWU6ICdjb3B5RmxvYXQnLFxuXHRcdFx0ZnJhZ21lbnRTaGFkZXI6IGdsc2xWZXJzaW9uID09PSBHTFNMMyA/IHJlcXVpcmUoJy4vZ2xzbF8zL0NvcHlGbG9hdEZyYWdTaGFkZXIuZ2xzbCcpIDogcmVxdWlyZSgnLi9nbHNsXzEvQ29weUZyYWdTaGFkZXIuZ2xzbCcpLFxuXHRcdFx0dW5pZm9ybXM6IFtcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRuYW1lOiAndV9zdGF0ZScsXG5cdFx0XHRcdFx0XHR2YWx1ZTogMCxcblx0XHRcdFx0XHRcdGRhdGFUeXBlOiBJTlQsXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XSxcblx0XHRcdH0sXG5cdFx0KTtcblx0XHRpZiAoZ2xzbFZlcnNpb24gPT09IEdMU0wzKSB7XG5cdFx0XHR0aGlzLmNvcHlJbnRQcm9ncmFtID0gdGhpcy5pbml0UHJvZ3JhbSh7XG5cdFx0XHRcdG5hbWU6ICdjb3B5SW50Jyxcblx0XHRcdFx0ZnJhZ21lbnRTaGFkZXI6IHJlcXVpcmUoJy4vZ2xzbF8zL0NvcHlJbnRGcmFnU2hhZGVyLmdsc2wnKSxcblx0XHRcdFx0dW5pZm9ybXM6IFtcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0bmFtZTogJ3Vfc3RhdGUnLFxuXHRcdFx0XHRcdFx0XHR2YWx1ZTogMCxcblx0XHRcdFx0XHRcdFx0ZGF0YVR5cGU6IElOVCxcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XSxcblx0XHRcdFx0fSxcblx0XHRcdCk7XG5cdFx0XHR0aGlzLmNvcHlVaW50UHJvZ3JhbSA9IHRoaXMuaW5pdFByb2dyYW0oe1xuXHRcdFx0XHRuYW1lOiAnY29weVVpbnQnLFxuXHRcdFx0XHRmcmFnbWVudFNoYWRlcjogcmVxdWlyZSgnLi9nbHNsXzMvQ29weVVpbnRGcmFnU2hhZGVyLmdsc2wnKSxcblx0XHRcdFx0dW5pZm9ybXM6IFtcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0bmFtZTogJ3Vfc3RhdGUnLFxuXHRcdFx0XHRcdFx0XHR2YWx1ZTogMCxcblx0XHRcdFx0XHRcdFx0ZGF0YVR5cGU6IElOVCxcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XSxcblx0XHRcdFx0fSxcblx0XHRcdCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuY29weUludFByb2dyYW0gPSB0aGlzLmNvcHlGbG9hdFByb2dyYW07XG5cdFx0XHR0aGlzLmNvcHlVaW50UHJvZ3JhbSA9IHRoaXMuY29weUZsb2F0UHJvZ3JhbTtcblx0XHR9XG5cblx0XHQvLyBVbmJpbmQgYWN0aXZlIGJ1ZmZlci5cblx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgbnVsbCk7XG5cblx0XHQvLyBDYW52YXMgc2V0dXAuXG5cdFx0dGhpcy5vblJlc2l6ZShjYW52YXMpO1xuXG5cdFx0Ly8gTG9nIG51bWJlciBvZiB0ZXh0dXJlcyBhdmFpbGFibGUuXG5cdFx0dGhpcy5tYXhOdW1UZXh0dXJlcyA9IHRoaXMuZ2wuZ2V0UGFyYW1ldGVyKHRoaXMuZ2wuTUFYX1RFWFRVUkVfSU1BR0VfVU5JVFMpO1xuXHRcdGNvbnNvbGUubG9nKGAke3RoaXMubWF4TnVtVGV4dHVyZXN9IHRleHR1cmVzIG1heC5gKTtcblx0fVxuXG5cdHByaXZhdGUgZ2V0IHNpbmdsZUNvbG9yUHJvZ3JhbSgpIHtcblx0XHRpZiAodGhpcy5fc2luZ2xlQ29sb3JQcm9ncmFtID09PSB1bmRlZmluZWQpIHtcblx0XHRcdGNvbnN0IHByb2dyYW0gPSB0aGlzLmluaXRQcm9ncmFtKHtcblx0XHRcdFx0bmFtZTogJ3NpbmdsZUNvbG9yJyxcblx0XHRcdFx0ZnJhZ21lbnRTaGFkZXI6IHRoaXMuZ2xzbFZlcnNpb24gPT09IEdMU0wzID8gcmVxdWlyZSgnLi9nbHNsXzMvU2luZ2xlQ29sb3JGcmFnU2hhZGVyLmdsc2wnKSA6IHJlcXVpcmUoJy4vZ2xzbF8xL1NpbmdsZUNvbG9yRnJhZ1NoYWRlci5nbHNsJyksXG5cdFx0XHR9KTtcblx0XHRcdHRoaXMuX3NpbmdsZUNvbG9yUHJvZ3JhbSA9IHByb2dyYW07XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLl9zaW5nbGVDb2xvclByb2dyYW07XG5cdH1cblxuXHRwcml2YXRlIGdldCBzaW5nbGVDb2xvcldpdGhXcmFwQ2hlY2tQcm9ncmFtKCkge1xuXHRcdGlmICh0aGlzLl9zaW5nbGVDb2xvcldpdGhXcmFwQ2hlY2tQcm9ncmFtID09PSB1bmRlZmluZWQpIHtcblx0XHRcdGNvbnN0IHByb2dyYW0gPSB0aGlzLmluaXRQcm9ncmFtKHtcblx0XHRcdFx0bmFtZTogJ3NpbmdsZUNvbG9yV2l0aFdyYXBDaGVjaycsXG5cdFx0XHRcdGZyYWdtZW50U2hhZGVyOiB0aGlzLmdsc2xWZXJzaW9uID09PSBHTFNMMyA/IHJlcXVpcmUoJy4vZ2xzbF8zL1NpbmdsZUNvbG9yV2l0aFdyYXBDaGVja0ZyYWdTaGFkZXIuZ2xzbCcpIDogcmVxdWlyZSgnLi9nbHNsXzEvU2luZ2xlQ29sb3JXaXRoV3JhcENoZWNrRnJhZ1NoYWRlci5nbHNsJyksXG5cdFx0XHR9KTtcblx0XHRcdHRoaXMuX3NpbmdsZUNvbG9yV2l0aFdyYXBDaGVja1Byb2dyYW0gPSBwcm9ncmFtO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5fc2luZ2xlQ29sb3JXaXRoV3JhcENoZWNrUHJvZ3JhbTtcblx0fVxuXG5cdGlzV2ViR0wyKCkge1xuXHRcdHJldHVybiBpc1dlYkdMMih0aGlzLmdsKTtcblx0fVxuXG5cdHByaXZhdGUgZ2V0IHF1YWRQb3NpdGlvbnNCdWZmZXIoKSB7XG5cdFx0aWYgKHRoaXMuX3F1YWRQb3NpdGlvbnNCdWZmZXIgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Y29uc3QgZnNRdWFkUG9zaXRpb25zID0gbmV3IEZsb2F0MzJBcnJheShbIC0xLCAtMSwgMSwgLTEsIC0xLCAxLCAxLCAxIF0pO1xuXHRcdFx0dGhpcy5fcXVhZFBvc2l0aW9uc0J1ZmZlciA9IHRoaXMuaW5pdFZlcnRleEJ1ZmZlcihmc1F1YWRQb3NpdGlvbnMpITtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuX3F1YWRQb3NpdGlvbnNCdWZmZXIhO1xuXHR9XG5cblx0cHJpdmF0ZSBnZXQgYm91bmRhcnlQb3NpdGlvbnNCdWZmZXIoKSB7XG5cdFx0aWYgKHRoaXMuX2JvdW5kYXJ5UG9zaXRpb25zQnVmZmVyID09PSB1bmRlZmluZWQpIHtcblx0XHRcdGNvbnN0IGJvdW5kYXJ5UG9zaXRpb25zID0gbmV3IEZsb2F0MzJBcnJheShbIC0xLCAtMSwgMSwgLTEsIDEsIDEsIC0xLCAxLCAtMSwgLTEgXSk7XG5cdFx0XHR0aGlzLl9ib3VuZGFyeVBvc2l0aW9uc0J1ZmZlciA9IHRoaXMuaW5pdFZlcnRleEJ1ZmZlcihib3VuZGFyeVBvc2l0aW9ucykhO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5fYm91bmRhcnlQb3NpdGlvbnNCdWZmZXIhO1xuXHR9XG5cblx0cHJpdmF0ZSBnZXRDaXJjbGVQb3NpdGlvbnNCdWZmZXIobnVtU2VnbWVudHM6IG51bWJlcikge1xuXHRcdGlmICh0aGlzLl9jaXJjbGVQb3NpdGlvbnNCdWZmZXJbbnVtU2VnbWVudHNdID09IHVuZGVmaW5lZCkge1xuXHRcdFx0Y29uc3QgdW5pdENpcmNsZVBvaW50cyA9IFswLCAwXTtcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDw9IG51bVNlZ21lbnRzOyBpKyspIHtcblx0XHRcdFx0dW5pdENpcmNsZVBvaW50cy5wdXNoKFxuXHRcdFx0XHRcdE1hdGguY29zKDIgKiBNYXRoLlBJICogaSAvIG51bVNlZ21lbnRzKSxcblx0XHRcdFx0XHRNYXRoLnNpbigyICogTWF0aC5QSSAqIGkgLyBudW1TZWdtZW50cyksXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0XHRjb25zdCBjaXJjbGVQb3NpdGlvbnMgPSBuZXcgRmxvYXQzMkFycmF5KHVuaXRDaXJjbGVQb2ludHMpO1xuXHRcdFx0Y29uc3QgYnVmZmVyID0gdGhpcy5pbml0VmVydGV4QnVmZmVyKGNpcmNsZVBvc2l0aW9ucykhO1xuXHRcdFx0dGhpcy5fY2lyY2xlUG9zaXRpb25zQnVmZmVyW251bVNlZ21lbnRzXSA9IGJ1ZmZlcjtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuX2NpcmNsZVBvc2l0aW9uc0J1ZmZlcltudW1TZWdtZW50c107XG5cdH1cblxuXHRwcml2YXRlIGluaXRWZXJ0ZXhCdWZmZXIoXG5cdFx0ZGF0YTogRmxvYXQzMkFycmF5LFxuXHQpIHtcblx0XHRjb25zdCB7IGVycm9yQ2FsbGJhY2ssIGdsIH0gPSB0aGlzO1xuXHRcdGNvbnN0IGJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xuXHRcdGlmICghYnVmZmVyKSB7XG5cdFx0XHRlcnJvckNhbGxiYWNrKCdVbmFibGUgdG8gYWxsb2NhdGUgZ2wgYnVmZmVyLicpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgYnVmZmVyKTtcblx0XHQvLyBBZGQgYnVmZmVyIGRhdGEuXG5cdFx0Z2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsIGRhdGEsIGdsLlNUQVRJQ19EUkFXKTtcblx0XHRyZXR1cm4gYnVmZmVyO1xuXHR9XG5cblx0aW5pdFByb2dyYW0oXG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRuYW1lOiBzdHJpbmcsXG5cdFx0XHRmcmFnbWVudFNoYWRlcjogc3RyaW5nIHwgV2ViR0xTaGFkZXIsXG5cdFx0XHR1bmlmb3Jtcz86IHtcblx0XHRcdFx0bmFtZTogc3RyaW5nLFxuXHRcdFx0XHR2YWx1ZTogVW5pZm9ybVZhbHVlVHlwZSxcblx0XHRcdFx0ZGF0YVR5cGU6IFVuaWZvcm1EYXRhVHlwZSxcblx0XHRcdH1bXSxcblx0XHRcdGRlZmluZXM/OiB7XG5cdFx0XHRcdFtrZXkgOiBzdHJpbmddOiBzdHJpbmcsXG5cdFx0XHR9LFxuXHRcdH0sXG5cdCkge1xuXHRcdC8vIENoZWNrIHBhcmFtcy5cblx0XHRjb25zdCB2YWxpZEtleXMgPSBbJ25hbWUnLCAnZnJhZ21lbnRTaGFkZXInLCAndW5pZm9ybXMnLCAnZGVmaW5lcyddO1xuXHRcdE9iamVjdC5rZXlzKHBhcmFtcykuZm9yRWFjaChrZXkgPT4ge1xuXHRcdFx0aWYgKHZhbGlkS2V5cy5pbmRleE9mKGtleSkgPCAwKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBrZXkgJHtrZXl9IHBhc3NlZCB0byBXZWJHTENvbXB1dGUuaW5pdFByb2dyYW0gd2l0aCBuYW1lIFwiJHtwYXJhbXMubmFtZX1cIi4gIFZhbGlkIGtleXMgYXJlICR7dmFsaWRLZXlzLmpvaW4oJywgJyl9LmApO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdGNvbnN0IHsgZ2wsIGVycm9yQ2FsbGJhY2ssIGdsc2xWZXJzaW9uIH0gPSB0aGlzO1xuXHRcdHJldHVybiBuZXcgR1BVUHJvZ3JhbShcblx0XHRcdHtcblx0XHRcdFx0Li4ucGFyYW1zLFxuXHRcdFx0XHRnbCxcblx0XHRcdFx0ZXJyb3JDYWxsYmFjayxcblx0XHRcdFx0Z2xzbFZlcnNpb24sXG5cdFx0XHR9LFxuXHRcdCk7XG5cdH07XG5cblx0aW5pdERhdGFMYXllcihcblx0XHRwYXJhbXM6IHtcblx0XHRcdG5hbWU6IHN0cmluZyxcblx0XHRcdGRpbWVuc2lvbnM6IG51bWJlciB8IFtudW1iZXIsIG51bWJlcl0sXG5cdFx0XHR0eXBlOiBEYXRhTGF5ZXJUeXBlLFxuXHRcdFx0bnVtQ29tcG9uZW50czogRGF0YUxheWVyTnVtQ29tcG9uZW50cyxcblx0XHRcdGRhdGE/OiBEYXRhTGF5ZXJBcnJheVR5cGUsXG5cdFx0XHRmaWx0ZXI/OiBEYXRhTGF5ZXJGaWx0ZXJUeXBlLFxuXHRcdFx0d3JhcFM/OiBEYXRhTGF5ZXJXcmFwVHlwZSxcblx0XHRcdHdyYXBUPzogRGF0YUxheWVyV3JhcFR5cGUsXG5cdFx0XHR3cml0YWJsZT86IGJvb2xlYW4sXG5cdFx0XHRudW1CdWZmZXJzPzogbnVtYmVyLFxuXHRcdH0sXG5cdCkge1xuXHRcdC8vIENoZWNrIHBhcmFtcy5cblx0XHRjb25zdCB2YWxpZEtleXMgPSBbJ25hbWUnLCAnZGltZW5zaW9ucycsICd0eXBlJywgJ251bUNvbXBvbmVudHMnLCAnZGF0YScsICdmaWx0ZXInLCAnd3JhcFMnLCAnd3JhcFQnLCAnd3JpdGFibGUnLCAnbnVtQnVmZmVycyddO1xuXHRcdE9iamVjdC5rZXlzKHBhcmFtcykuZm9yRWFjaChrZXkgPT4ge1xuXHRcdFx0aWYgKHZhbGlkS2V5cy5pbmRleE9mKGtleSkgPCAwKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBrZXkgJHtrZXl9IHBhc3NlZCB0byBXZWJHTENvbXB1dGUuaW5pdERhdGFMYXllciB3aXRoIG5hbWUgXCIke3BhcmFtcy5uYW1lfVwiLiAgVmFsaWQga2V5cyBhcmUgJHt2YWxpZEtleXMuam9pbignLCAnKX0uYCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0Y29uc3QgeyBnbCwgZXJyb3JDYWxsYmFjaywgZ2xzbFZlcnNpb24gfSA9IHRoaXM7XG5cdFx0cmV0dXJuIG5ldyBEYXRhTGF5ZXIoe1xuXHRcdFx0Li4ucGFyYW1zLFxuXHRcdFx0Z2wsXG5cdFx0XHRnbHNsVmVyc2lvbixcblx0XHRcdGVycm9yQ2FsbGJhY2ssXG5cdFx0fSk7XG5cdH07XG5cblx0aW5pdFRleHR1cmUoXG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRuYW1lOiBzdHJpbmcsXG5cdFx0XHR1cmw6IHN0cmluZyxcblx0XHRcdGZpbHRlcj86IERhdGFMYXllckZpbHRlclR5cGUsXG5cdFx0XHR3cmFwUz86IERhdGFMYXllcldyYXBUeXBlLFxuXHRcdFx0d3JhcFQ/OiBEYXRhTGF5ZXJXcmFwVHlwZSxcblx0XHRcdGZvcm1hdD86IFRleHR1cmVGb3JtYXRUeXBlLFxuXHRcdFx0dHlwZT86IFRleHR1cmVEYXRhVHlwZSxcblx0XHRcdG9uTG9hZD86ICh0ZXh0dXJlOiBXZWJHTFRleHR1cmUpID0+IHZvaWQsXG5cdFx0fSxcblx0KSB7XG5cdFx0Ly8gQ2hlY2sgcGFyYW1zLlxuXHRcdGNvbnN0IHZhbGlkS2V5cyA9IFsnbmFtZScsICd1cmwnLCAnZmlsdGVyJywgJ3dyYXBTJywgJ3dyYXBUJywgJ2Zvcm1hdCcsICd0eXBlJywgJ29uTG9hZCddO1xuXHRcdE9iamVjdC5rZXlzKHBhcmFtcykuZm9yRWFjaChrZXkgPT4ge1xuXHRcdFx0aWYgKHZhbGlkS2V5cy5pbmRleE9mKGtleSkgPCAwKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBrZXkgJHtrZXl9IHBhc3NlZCB0byBXZWJHTENvbXB1dGUuaW5pdFRleHR1cmUgd2l0aCBuYW1lIFwiJHtwYXJhbXMubmFtZX1cIi4gIFZhbGlkIGtleXMgYXJlICR7dmFsaWRLZXlzLmpvaW4oJywgJyl9LmApO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdGNvbnN0IHsgdXJsLCBuYW1lIH0gPSBwYXJhbXM7XG5cdFx0aWYgKCFpc1N0cmluZyh1cmwpKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIFdlYkdMQ29tcHV0ZS5pbml0VGV4dHVyZSBwYXJhbXMgdG8gaGF2ZSB1cmwgb2YgdHlwZSBzdHJpbmcsIGdvdCAke3VybH0gb2YgdHlwZSAke3R5cGVvZiB1cmx9LmApXG5cdFx0fVxuXHRcdGlmICghaXNTdHJpbmcobmFtZSkpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgV2ViR0xDb21wdXRlLmluaXRUZXh0dXJlIHBhcmFtcyB0byBoYXZlIG5hbWUgb2YgdHlwZSBzdHJpbmcsIGdvdCAke25hbWV9IG9mIHR5cGUgJHt0eXBlb2YgbmFtZX0uYClcblx0XHR9XG5cblx0XHQvLyBHZXQgZmlsdGVyIHR5cGUsIGRlZmF1bHQgdG8gbmVhcmVzdC5cblx0XHRjb25zdCBmaWx0ZXIgPSBwYXJhbXMuZmlsdGVyICE9PSB1bmRlZmluZWQgPyBwYXJhbXMuZmlsdGVyIDogTkVBUkVTVDtcblx0XHRpZiAoIWlzVmFsaWRGaWx0ZXJUeXBlKGZpbHRlcikpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBmaWx0ZXI6ICR7ZmlsdGVyfSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLCBtdXN0IGJlICR7dmFsaWRGaWx0ZXJUeXBlcy5qb2luKCcsICcpfS5gKTtcblx0XHR9XG5cblx0XHQvLyBHZXQgd3JhcCB0eXBlcywgZGVmYXVsdCB0byBjbGFtcCB0byBlZGdlLlxuXHRcdGNvbnN0IHdyYXBTID0gcGFyYW1zLndyYXBTICE9PSB1bmRlZmluZWQgPyBwYXJhbXMud3JhcFMgOiBDTEFNUF9UT19FREdFO1xuXHRcdGlmICghaXNWYWxpZFdyYXBUeXBlKHdyYXBTKSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHdyYXBTOiAke3dyYXBTfSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLCBtdXN0IGJlICR7dmFsaWRXcmFwVHlwZXMuam9pbignLCAnKX0uYCk7XG5cdFx0fVxuXHRcdGNvbnN0IHdyYXBUID0gcGFyYW1zLndyYXBUICE9PSB1bmRlZmluZWQgPyBwYXJhbXMud3JhcFQgOiBDTEFNUF9UT19FREdFO1xuXHRcdGlmICghaXNWYWxpZFdyYXBUeXBlKHdyYXBUKSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHdyYXBUOiAke3dyYXBUfSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLCBtdXN0IGJlICR7dmFsaWRXcmFwVHlwZXMuam9pbignLCAnKX0uYCk7XG5cdFx0fVxuXG5cdFx0Ly8gR2V0IGltYWdlIGZvcm1hdCB0eXBlLCBkZWZhdWx0IHRvIHJnYmEuXG5cdFx0Y29uc3QgZm9ybWF0ID0gcGFyYW1zLmZvcm1hdCAhPT0gdW5kZWZpbmVkID8gcGFyYW1zLmZvcm1hdCA6IFJHQkE7XG5cdFx0aWYgKCFpc1ZhbGlkVGV4dHVyZUZvcm1hdFR5cGUoZm9ybWF0KSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGZvcm1hdDogJHtmb3JtYXR9IGZvciBEYXRhTGF5ZXIgXCIke25hbWV9XCIsIG11c3QgYmUgJHt2YWxpZFRleHR1cmVGb3JtYXRUeXBlcy5qb2luKCcsICcpfS5gKTtcblx0XHR9XG5cblx0XHQvLyBHZXQgaW1hZ2UgZGF0YSB0eXBlLCBkZWZhdWx0IHRvIHVuc2lnbmVkIGJ5dGUuXG5cdFx0Y29uc3QgdHlwZSA9IHBhcmFtcy50eXBlICE9PSB1bmRlZmluZWQgPyBwYXJhbXMudHlwZSA6IFVOU0lHTkVEX0JZVEU7XG5cdFx0aWYgKCFpc1ZhbGlkVGV4dHVyZURhdGFUeXBlKHR5cGUpKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdHlwZTogJHt0eXBlfSBmb3IgRGF0YUxheWVyIFwiJHtuYW1lfVwiLCBtdXN0IGJlICR7dmFsaWRUZXh0dXJlRGF0YVR5cGVzLmpvaW4oJywgJyl9LmApO1xuXHRcdH1cblxuXHRcdGNvbnN0IHsgZ2wsIGVycm9yQ2FsbGJhY2sgfSA9IHRoaXM7XG5cdFx0Y29uc3QgdGV4dHVyZSA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcblx0XHRpZiAodGV4dHVyZSA9PT0gbnVsbCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gaW5pdCBnbFRleHR1cmUuYCk7XG5cdFx0fVxuXHRcdGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIHRleHR1cmUpO1xuXHRcdC8vIEJlY2F1c2UgaW1hZ2VzIGhhdmUgdG8gYmUgZG93bmxvYWRlZCBvdmVyIHRoZSBpbnRlcm5ldFxuXHRcdC8vIHRoZXkgbWlnaHQgdGFrZSBhIG1vbWVudCB1bnRpbCB0aGV5IGFyZSByZWFkeS5cblx0XHQvLyBVbnRpbCB0aGVuIHB1dCBhIHNpbmdsZSBwaXhlbCBpbiB0aGUgdGV4dHVyZSBzbyB3ZSBjYW5cblx0XHQvLyB1c2UgaXQgaW1tZWRpYXRlbHkuIFdoZW4gdGhlIGltYWdlIGhhcyBmaW5pc2hlZCBkb3dubG9hZGluZ1xuXHRcdC8vIHdlJ2xsIHVwZGF0ZSB0aGUgdGV4dHVyZSB3aXRoIHRoZSBjb250ZW50cyBvZiB0aGUgaW1hZ2UuXG5cdFx0Y29uc3QgbGV2ZWwgPSAwO1xuXHRcdGNvbnN0IGludGVybmFsRm9ybWF0ID0gZ2wuUkdCQTtcblx0XHRjb25zdCB3aWR0aCA9IDE7XG5cdFx0Y29uc3QgaGVpZ2h0ID0gMTtcblx0XHRjb25zdCBib3JkZXIgPSAwO1xuXHRcdGNvbnN0IHNyY0Zvcm1hdCA9IGdsW2Zvcm1hdF07XG5cdFx0Y29uc3Qgc3JjVHlwZSA9IGdsW3R5cGVdO1xuXHRcdGNvbnN0IHBpeGVsID0gbmV3IFVpbnQ4QXJyYXkoWzAsIDAsIDAsIDBdKTtcblx0XHRnbC50ZXhJbWFnZTJEKGdsLlRFWFRVUkVfMkQsIGxldmVsLCBpbnRlcm5hbEZvcm1hdCxcblx0XHRcdHdpZHRoLCBoZWlnaHQsIGJvcmRlciwgc3JjRm9ybWF0LCBzcmNUeXBlLCBwaXhlbCk7XG5cblx0XHRjb25zdCBpbWFnZSA9IG5ldyBJbWFnZSgpO1xuXHRcdGltYWdlLm9ubG9hZCA9ICgpID0+IHtcblx0XHRcdGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIHRleHR1cmUpO1xuXHRcdFx0Z2wudGV4SW1hZ2UyRChnbC5URVhUVVJFXzJELCBsZXZlbCwgaW50ZXJuYWxGb3JtYXQsXG5cdFx0XHRcdHNyY0Zvcm1hdCwgc3JjVHlwZSwgaW1hZ2UpO1xuXG5cdFx0XHQvLyBXZWJHTDEgaGFzIGRpZmZlcmVudCByZXF1aXJlbWVudHMgZm9yIHBvd2VyIG9mIDIgaW1hZ2VzXG5cdFx0XHQvLyB2cyBub24gcG93ZXIgb2YgMiBpbWFnZXMgc28gY2hlY2sgaWYgdGhlIGltYWdlIGlzIGFcblx0XHRcdC8vIHBvd2VyIG9mIDIgaW4gYm90aCBkaW1lbnNpb25zLlxuXHRcdFx0aWYgKGlzUG93ZXJPZjIoaW1hZ2Uud2lkdGgpICYmIGlzUG93ZXJPZjIoaW1hZ2UuaGVpZ2h0KSkge1xuXHRcdFx0XHQvLyAvLyBZZXMsIGl0J3MgYSBwb3dlciBvZiAyLiBHZW5lcmF0ZSBtaXBzLlxuXHRcdFx0XHQvLyBnbC5nZW5lcmF0ZU1pcG1hcChnbC5URVhUVVJFXzJEKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIFRPRE86IGZpbmlzaCBpbXBsZW1lbnRpbmcgdGhpcy5cblx0XHRcdFx0Y29uc29sZS53YXJuKGBUZXh0dXJlICR7bmFtZX0gZGltZW5zaW9ucyBbJHtpbWFnZS53aWR0aH0sICR7aW1hZ2UuaGVpZ2h0fV0gYXJlIG5vdCBwb3dlciBvZiAyLmApO1xuXHRcdFx0XHQvLyAvLyBObywgaXQncyBub3QgYSBwb3dlciBvZiAyLiBUdXJuIG9mZiBtaXBzIGFuZCBzZXRcblx0XHRcdFx0Ly8gLy8gd3JhcHBpbmcgdG8gY2xhbXAgdG8gZWRnZVxuXHRcdFx0XHQvLyBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9TLCBnbC5DTEFNUF9UT19FREdFKTtcblx0XHRcdFx0Ly8gZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfVCwgZ2wuQ0xBTVBfVE9fRURHRSk7XG5cdFx0XHR9XG5cdFx0XHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9TLCBnbFt3cmFwU10pO1xuXHRcdFx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfVCwgZ2xbd3JhcFRdKTtcblx0XHRcdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBnbFtmaWx0ZXJdKTtcblx0XHRcdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCBnbFtmaWx0ZXJdKTtcblxuXHRcdFx0Ly8gQ2FsbGJhY2sgd2hlbiB0ZXh0dXJlIGhhcyBsb2FkZWQuXG5cdFx0XHRpZiAocGFyYW1zLm9uTG9hZCkgcGFyYW1zLm9uTG9hZCh0ZXh0dXJlKTtcblx0XHR9O1xuXHRcdGltYWdlLm9uZXJyb3IgPSAoZSkgPT4ge1xuXHRcdFx0ZXJyb3JDYWxsYmFjayhgRXJyb3IgbG9hZGluZyBpbWFnZSAke25hbWV9OiAke2V9YCk7XG5cdFx0fVxuXHRcdGltYWdlLnNyYyA9IHVybDtcblxuXHRcdHJldHVybiB0ZXh0dXJlO1xuXHR9XG5cblx0b25SZXNpemUoY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCkge1xuXHRcdGNvbnN0IHdpZHRoID0gY2FudmFzLmNsaWVudFdpZHRoO1xuXHRcdGNvbnN0IGhlaWdodCA9IGNhbnZhcy5jbGllbnRIZWlnaHQ7XG5cdFx0Ly8gU2V0IGNvcnJlY3QgY2FudmFzIHBpeGVsIHNpemUuXG5cdFx0Ly8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1dlYkdMX0FQSS9CeV9leGFtcGxlL0NhbnZhc19zaXplX2FuZF9XZWJHTFxuXHRcdGNhbnZhcy53aWR0aCA9IHdpZHRoO1xuXHRcdGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XG5cdFx0Ly8gU2F2ZSBkaW1lbnNpb25zLlxuXHRcdHRoaXMud2lkdGggPSB3aWR0aDtcblx0XHR0aGlzLmhlaWdodCA9IGhlaWdodDtcblx0fTtcblxuXHRwcml2YXRlIGRyYXdTZXR1cChcblx0XHRwcm9ncmFtOiBXZWJHTFByb2dyYW0sXG5cdFx0ZnVsbHNjcmVlblJlbmRlcjogYm9vbGVhbixcblx0XHRpbnB1dD86IChEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUpW10gfCBEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUsXG5cdFx0b3V0cHV0PzogRGF0YUxheWVyLFxuXHQpIHtcblx0XHRjb25zdCB7IGdsIH0gPSB0aGlzO1xuXHRcdC8vIENoZWNrIGlmIHdlIGFyZSBpbiBhbiBlcnJvciBzdGF0ZS5cblx0XHRpZiAoIXByb2dyYW0pIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBDQVVUSU9OOiB0aGUgb3JkZXIgb2YgdGhlc2UgbmV4dCBmZXcgbGluZXMgaXMgaW1wb3J0YW50LlxuXG5cdFx0Ly8gR2V0IGEgc2hhbGxvdyBjb3B5IG9mIGN1cnJlbnQgdGV4dHVyZXMuXG5cdFx0Ly8gVGhpcyBsaW5lIG11c3QgY29tZSBiZWZvcmUgdGhpcy5zZXRPdXRwdXQoKSBhcyBpdCBkZXBlbmRzIG9uIGN1cnJlbnQgaW50ZXJuYWwgc3RhdGUuXG5cdFx0Y29uc3QgaW5wdXRUZXh0dXJlczogV2ViR0xUZXh0dXJlW10gPSBbXTtcblx0XHRpZiAoaW5wdXQpIHtcblx0XHRcdGlmIChpbnB1dC5jb25zdHJ1Y3RvciA9PT0gV2ViR0xUZXh0dXJlKSB7XG5cdFx0XHRcdGlucHV0VGV4dHVyZXMucHVzaChpbnB1dCBhcyBXZWJHTFRleHR1cmUpO1xuXHRcdFx0fSBlbHNlIGlmIChpbnB1dC5jb25zdHJ1Y3RvciA9PT0gRGF0YUxheWVyKSB7XG5cdFx0XHRcdGlucHV0VGV4dHVyZXMucHVzaCgoaW5wdXQgYXMgRGF0YUxheWVyKS5nZXRDdXJyZW50U3RhdGVUZXh0dXJlKCkpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCAoaW5wdXQgYXMgKERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSlbXSkubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRjb25zdCBsYXllciA9IChpbnB1dCBhcyAoRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlKVtdKVtpXTtcblx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdFx0aW5wdXRUZXh0dXJlcy5wdXNoKChsYXllciBhcyBEYXRhTGF5ZXIpLmdldEN1cnJlbnRTdGF0ZVRleHR1cmUgPyAobGF5ZXIgYXMgRGF0YUxheWVyKS5nZXRDdXJyZW50U3RhdGVUZXh0dXJlKCkgOiBsYXllciBhcyBXZWJHTFRleHR1cmUpXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBTZXQgb3V0cHV0IGZyYW1lYnVmZmVyLlxuXHRcdC8vIFRoaXMgbWF5IG1vZGlmeSBXZWJHTCBpbnRlcm5hbCBzdGF0ZS5cblx0XHR0aGlzLnNldE91dHB1dExheWVyKGZ1bGxzY3JlZW5SZW5kZXIsIGlucHV0LCBvdXRwdXQpO1xuXG5cdFx0Ly8gU2V0IGN1cnJlbnQgcHJvZ3JhbS5cblx0XHRnbC51c2VQcm9ncmFtKHByb2dyYW0pO1xuXG5cdFx0Ly8gU2V0IGlucHV0IHRleHR1cmVzLlxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgaW5wdXRUZXh0dXJlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0Z2wuYWN0aXZlVGV4dHVyZShnbC5URVhUVVJFMCArIGkpO1xuXHRcdFx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgaW5wdXRUZXh0dXJlc1tpXSk7XG5cdFx0fVxuXHR9XG5cblx0Y29weVByb2dyYW1Gb3JUeXBlKHR5cGU6IERhdGFMYXllclR5cGUpIHtcblx0XHRzd2l0Y2ggKHR5cGUpIHtcblx0XHRcdGNhc2UgSEFMRl9GTE9BVDpcblx0XHRcdGNhc2UgRkxPQVQ6XG5cdFx0XHRcdHJldHVybiB0aGlzLmNvcHlGbG9hdFByb2dyYW07XG5cdFx0XHRjYXNlIFVOU0lHTkVEX0JZVEU6XG5cdFx0XHRjYXNlIFVOU0lHTkVEX1NIT1JUOlxuXHRcdFx0Y2FzZSBVTlNJR05FRF9JTlQ6XG5cdFx0XHRcdHJldHVybiB0aGlzLmNvcHlVaW50UHJvZ3JhbTtcblx0XHRcdGNhc2UgQllURTpcblx0XHRcdGNhc2UgU0hPUlQ6XG5cdFx0XHRjYXNlIElOVDpcblx0XHRcdFx0cmV0dXJuIHRoaXMuY29weUludFByb2dyYW07XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdHlwZTogJHt0eXBlfSBwYXNzZWQgdG8gV2ViR0xDb21wdXRlLmNvcHlQcm9ncmFtRm9yVHlwZS5gKTtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIHNldEJsZW5kTW9kZShzaG91bGRCbGVuZEFscGhhPzogYm9vbGVhbikge1xuXHRcdGNvbnN0IHsgZ2wgfSA9IHRoaXM7XG5cdFx0aWYgKHNob3VsZEJsZW5kQWxwaGEpIHtcblx0XHRcdGdsLmVuYWJsZShnbC5CTEVORCk7XG5cdFx0XHRnbC5ibGVuZEZ1bmMoZ2wuU1JDX0FMUEhBLCBnbC5PTkVfTUlOVVNfU1JDX0FMUEhBKTtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIGFkZExheWVyVG9JbnB1dHMoXG5cdFx0bGF5ZXI6IERhdGFMYXllcixcblx0XHRpbnB1dD86ICAoRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlKVtdIHwgRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlLFxuXHQpIHtcblx0XHQvLyBBZGQgbGF5ZXIgdG8gZW5kIG9mIGlucHV0IGlmIG5lZWRlZC5cblx0XHRsZXQgX2lucHV0TGF5ZXJzID0gaW5wdXQ7XG5cdFx0aWYgKGlzQXJyYXkoX2lucHV0TGF5ZXJzKSkge1xuXHRcdFx0Y29uc3QgaW5kZXggPSAoX2lucHV0TGF5ZXJzIGFzIChEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUpW10pLmluZGV4T2YobGF5ZXIpO1xuXHRcdFx0aWYgKGluZGV4IDwgMCkge1xuXHRcdFx0XHQoX2lucHV0TGF5ZXJzIGFzIChEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUpW10pLnB1c2gobGF5ZXIpO1xuXHRcdFx0fSBcblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKF9pbnB1dExheWVycyAhPT0gbGF5ZXIpIHtcblx0XHRcdFx0Y29uc3QgcHJldmlvdXMgPSBfaW5wdXRMYXllcnM7XG5cdFx0XHRcdF9pbnB1dExheWVycyA9IFtdO1xuXHRcdFx0XHRpZiAocHJldmlvdXMpIChfaW5wdXRMYXllcnMgYXMgKERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSlbXSkucHVzaChwcmV2aW91cyk7XG5cdFx0XHRcdChfaW5wdXRMYXllcnMgYXMgKERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSlbXSkucHVzaChsYXllcik7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRfaW5wdXRMYXllcnMgPSBbX2lucHV0TGF5ZXJzXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIF9pbnB1dExheWVycyBhcyAoRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlKVtdO1xuXHR9XG5cblx0cHJpdmF0ZSBwYXNzVGhyb3VnaExheWVyRGF0YUZyb21JbnB1dFRvT3V0cHV0KHN0YXRlOiBEYXRhTGF5ZXIpIHtcblx0XHQvLyBUT0RPOiBmaWd1cmUgb3V0IHRoZSBmYXN0ZXN0IHdheSB0byBjb3B5IGEgdGV4dHVyZS5cblx0XHRjb25zdCBjb3B5UHJvZ3JhbSA9IHRoaXMuY29weVByb2dyYW1Gb3JUeXBlKHN0YXRlLmludGVybmFsVHlwZSk7XG5cdFx0dGhpcy5zdGVwKHtcblx0XHRcdHByb2dyYW06IGNvcHlQcm9ncmFtLFxuXHRcdFx0aW5wdXQ6IHN0YXRlLFxuXHRcdFx0b3V0cHV0OiBzdGF0ZSxcblx0XHR9KTtcblx0fVxuXG5cdHByaXZhdGUgc2V0T3V0cHV0TGF5ZXIoXG5cdFx0ZnVsbHNjcmVlblJlbmRlcjogYm9vbGVhbixcblx0XHRpbnB1dD86IChEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUpW10gfCBEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUsXG5cdFx0b3V0cHV0PzogRGF0YUxheWVyLCAvLyBVbmRlZmluZWQgcmVuZGVycyB0byBzY3JlZW4uXG5cdCkge1xuXHRcdGNvbnN0IHsgZ2wgfSA9IHRoaXM7XG5cblx0XHQvLyBSZW5kZXIgdG8gc2NyZWVuLlxuXHRcdGlmICghb3V0cHV0KSB7XG5cdFx0XHRnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIG51bGwpO1xuXHRcdFx0Ly8gUmVzaXplIHZpZXdwb3J0LlxuXHRcdFx0Y29uc3QgeyB3aWR0aCwgaGVpZ2h0IH0gPSB0aGlzO1xuXHRcdFx0Z2wudmlld3BvcnQoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gQ2hlY2sgaWYgb3V0cHV0IGlzIHNhbWUgYXMgb25lIG9mIGlucHV0IGxheWVycy5cblx0XHRpZiAoaW5wdXQgJiYgKChpbnB1dCA9PT0gb3V0cHV0KSB8fCAoaXNBcnJheShpbnB1dCkgJiYgKGlucHV0IGFzIChEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUpW10pLmluZGV4T2Yob3V0cHV0KSA+IC0xKSkpIHtcblx0XHRcdGlmIChvdXRwdXQubnVtQnVmZmVycyA9PT0gMSkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCB1c2Ugc2FtZSBidWZmZXIgZm9yIGlucHV0IGFuZCBvdXRwdXQgb2YgYSBwcm9ncmFtLiBUcnkgaW5jcmVhc2luZyB0aGUgbnVtYmVyIG9mIGJ1ZmZlcnMgaW4geW91ciBvdXRwdXQgbGF5ZXIgdG8gYXQgbGVhc3QgMiBzbyB5b3UgY2FuIHJlbmRlciB0byBuZXh0U3RhdGUgdXNpbmcgY3VycmVudFN0YXRlIGFzIGFuIGlucHV0LicpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGZ1bGxzY3JlZW5SZW5kZXIpIHtcblx0XHRcdFx0Ly8gUmVuZGVyIGFuZCBpbmNyZW1lbnQgYnVmZmVyIHNvIHdlIGFyZSByZW5kZXJpbmcgdG8gYSBkaWZmZXJlbnQgdGFyZ2V0XG5cdFx0XHRcdC8vIHRoYW4gdGhlIGlucHV0IHRleHR1cmUuXG5cdFx0XHRcdG91dHB1dC5fYmluZE91dHB1dEJ1ZmZlckZvcldyaXRlKHRydWUpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gUGFzcyBpbnB1dCB0ZXh0dXJlIHRocm91Z2ggdG8gb3V0cHV0LlxuXHRcdFx0XHR0aGlzLnBhc3NUaHJvdWdoTGF5ZXJEYXRhRnJvbUlucHV0VG9PdXRwdXQob3V0cHV0KTtcblx0XHRcdFx0Ly8gUmVuZGVyIHRvIG91dHB1dCB3aXRob3V0IGluY3JlbWVudGluZyBidWZmZXIuXG5cdFx0XHRcdG91dHB1dC5fYmluZE91dHB1dEJ1ZmZlckZvcldyaXRlKGZhbHNlKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKGZ1bGxzY3JlZW5SZW5kZXIpIHtcblx0XHRcdFx0Ly8gUmVuZGVyIHRvIGN1cnJlbnQgYnVmZmVyLlxuXHRcdFx0XHRvdXRwdXQuX2JpbmRPdXRwdXRCdWZmZXJGb3JXcml0ZShmYWxzZSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBJZiB3ZSBhcmUgZG9pbmcgYSBzbmVha3kgdGhpbmcgd2l0aCBhIHN3YXBwZWQgdGV4dHVyZSBhbmQgYXJlXG5cdFx0XHRcdC8vIG9ubHkgcmVuZGVyaW5nIHBhcnQgb2YgdGhlIHNjcmVlbiwgd2UgbWF5IG5lZWQgdG8gYWRkIGEgY29weSBvcGVyYXRpb24uXG5cdFx0XHRcdGlmIChvdXRwdXQuX3VzaW5nVGV4dHVyZU92ZXJyaWRlRm9yQ3VycmVudEJ1ZmZlcigpKSB7XG5cdFx0XHRcdFx0dGhpcy5wYXNzVGhyb3VnaExheWVyRGF0YUZyb21JbnB1dFRvT3V0cHV0KG91dHB1dCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0b3V0cHV0Ll9iaW5kT3V0cHV0QnVmZmVyRm9yV3JpdGUoZmFsc2UpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRcblx0XHQvLyBSZXNpemUgdmlld3BvcnQuXG5cdFx0Y29uc3QgWyB3aWR0aCwgaGVpZ2h0IF0gPSBvdXRwdXQuZ2V0RGltZW5zaW9ucygpO1xuXHRcdGdsLnZpZXdwb3J0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuXHR9O1xuXG5cdHByaXZhdGUgc2V0UG9zaXRpb25BdHRyaWJ1dGUocHJvZ3JhbTogV2ViR0xQcm9ncmFtLCBwcm9ncmFtTmFtZTogc3RyaW5nKSB7XG5cdFx0dGhpcy5zZXRWZXJ0ZXhBdHRyaWJ1dGUocHJvZ3JhbSwgJ2FfaW50ZXJuYWxfcG9zaXRpb24nLCAyLCBwcm9ncmFtTmFtZSk7XG5cdH1cblxuXHRwcml2YXRlIHNldEluZGV4QXR0cmlidXRlKHByb2dyYW06IFdlYkdMUHJvZ3JhbSwgcHJvZ3JhbU5hbWU6IHN0cmluZykge1xuXHRcdHRoaXMuc2V0VmVydGV4QXR0cmlidXRlKHByb2dyYW0sICdhX2ludGVybmFsX2luZGV4JywgMSwgcHJvZ3JhbU5hbWUpO1xuXHR9XG5cblx0cHJpdmF0ZSBzZXRVVkF0dHJpYnV0ZShwcm9ncmFtOiBXZWJHTFByb2dyYW0sIHByb2dyYW1OYW1lOiBzdHJpbmcpIHtcblx0XHR0aGlzLnNldFZlcnRleEF0dHJpYnV0ZShwcm9ncmFtLCAnYV9pbnRlcm5hbF91dicsIDIsIHByb2dyYW1OYW1lKTtcblx0fVxuXG5cdHByaXZhdGUgc2V0VmVydGV4QXR0cmlidXRlKHByb2dyYW06IFdlYkdMUHJvZ3JhbSwgbmFtZTogc3RyaW5nLCBzaXplOiBudW1iZXIsIHByb2dyYW1OYW1lOiBzdHJpbmcpIHtcblx0XHRjb25zdCB7IGdsIH0gPSB0aGlzO1xuXHRcdC8vIFBvaW50IGF0dHJpYnV0ZSB0byB0aGUgY3VycmVudGx5IGJvdW5kIFZCTy5cblx0XHRjb25zdCBsb2NhdGlvbiA9IGdsLmdldEF0dHJpYkxvY2F0aW9uKHByb2dyYW0sIG5hbWUpO1xuXHRcdGlmIChsb2NhdGlvbiA8IDApIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIGZpbmQgdmVydGV4IGF0dHJpYnV0ZSBcIiR7bmFtZX1cIiBpbiBwcm9ncmFtIFwiJHtwcm9ncmFtTmFtZX1cIi5gKTtcblx0XHR9XG5cdFx0Ly8gVE9ETzogb25seSBmbG9hdCBpcyBzdXBwb3J0ZWQgZm9yIHZlcnRleCBhdHRyaWJ1dGVzLlxuXHRcdGdsLnZlcnRleEF0dHJpYlBvaW50ZXIobG9jYXRpb24sIHNpemUsIGdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XG5cdFx0Ly8gRW5hYmxlIHRoZSBhdHRyaWJ1dGUuXG5cdFx0Z2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkobG9jYXRpb24pO1xuXHR9XG5cblx0Ly8gU3RlcCBmb3IgZW50aXJlIGZ1bGxzY3JlZW4gcXVhZC5cblx0c3RlcChcblx0XHRwYXJhbXM6IHtcblx0XHRcdHByb2dyYW06IEdQVVByb2dyYW0sXG5cdFx0XHRpbnB1dD86ICAoRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlKVtdIHwgRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlLFxuXHRcdFx0b3V0cHV0PzogRGF0YUxheWVyLCAvLyBVbmRlZmluZWQgcmVuZGVycyB0byBzY3JlZW4uXG5cdFx0XHRzaG91bGRCbGVuZEFscGhhPzogYm9vbGVhbixcblx0XHR9LFxuXHQpIHtcblx0XHRjb25zdCB7IGdsLCBlcnJvclN0YXRlLCBxdWFkUG9zaXRpb25zQnVmZmVyIH0gPSB0aGlzO1xuXHRcdGNvbnN0IHsgcHJvZ3JhbSwgaW5wdXQsIG91dHB1dCB9ID0gcGFyYW1zO1xuXG5cdFx0Ly8gSWdub3JlIGlmIHdlIGFyZSBpbiBlcnJvciBzdGF0ZS5cblx0XHRpZiAoZXJyb3JTdGF0ZSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGdsUHJvZ3JhbSA9IHByb2dyYW0uZGVmYXVsdFByb2dyYW0hO1xuXG5cdFx0Ly8gRG8gc2V0dXAgLSB0aGlzIG11c3QgY29tZSBmaXJzdC5cblx0XHR0aGlzLmRyYXdTZXR1cChwcm9ncmFtLmRlZmF1bHRQcm9ncmFtISwgdHJ1ZSwgaW5wdXQsIG91dHB1dCk7XG5cblx0XHQvLyBVcGRhdGUgdW5pZm9ybXMgYW5kIGJ1ZmZlcnMuXG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfc2NhbGUnLCBbMSwgMV0sIEZMT0FUKTtcblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF90cmFuc2xhdGlvbicsIFswLCAwXSwgRkxPQVQpO1xuXHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBxdWFkUG9zaXRpb25zQnVmZmVyKTtcblx0XHR0aGlzLnNldFBvc2l0aW9uQXR0cmlidXRlKGdsUHJvZ3JhbSwgcHJvZ3JhbS5uYW1lKTtcblxuXHRcdC8vIERyYXcuXG5cdFx0dGhpcy5zZXRCbGVuZE1vZGUocGFyYW1zLnNob3VsZEJsZW5kQWxwaGEpO1xuXHRcdGdsLmRyYXdBcnJheXMoZ2wuVFJJQU5HTEVfU1RSSVAsIDAsIDQpO1xuXHRcdGdsLmRpc2FibGUoZ2wuQkxFTkQpO1xuXHR9XG5cblx0Ly8gU3RlcCBwcm9ncmFtIG9ubHkgZm9yIGEgc3RyaXAgb2YgcHggYWxvbmcgdGhlIGJvdW5kYXJ5LlxuXHRzdGVwQm91bmRhcnkoXG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRwcm9ncmFtOiBHUFVQcm9ncmFtLFxuXHRcdFx0aW5wdXQ/OiAgKERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSlbXSB8IERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSxcblx0XHRcdG91dHB1dD86IERhdGFMYXllciwgLy8gVW5kZWZpbmVkIHJlbmRlcnMgdG8gc2NyZWVuLlxuXHRcdFx0c2luZ2xlRWRnZT86ICdMRUZUJyB8ICdSSUdIVCcgfCAnVE9QJyB8ICdCT1RUT00nO1xuXHRcdFx0c2hvdWxkQmxlbmRBbHBoYT86IGJvb2xlYW4sXG5cdFx0fSxcblx0KSB7XG5cdFx0Y29uc3QgeyBnbCwgZXJyb3JTdGF0ZSwgYm91bmRhcnlQb3NpdGlvbnNCdWZmZXJ9ID0gdGhpcztcblx0XHRjb25zdCB7IHByb2dyYW0sIGlucHV0LCBvdXRwdXQgfSA9IHBhcmFtcztcblx0XHRjb25zdCBbIHdpZHRoLCBoZWlnaHQgXSA9IG91dHB1dCA/IG91dHB1dC5nZXREaW1lbnNpb25zKCkgOiBbIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0IF07XG5cblx0XHQvLyBJZ25vcmUgaWYgd2UgYXJlIGluIGVycm9yIHN0YXRlLlxuXHRcdGlmIChlcnJvclN0YXRlKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgZ2xQcm9ncmFtID0gcHJvZ3JhbS5kZWZhdWx0UHJvZ3JhbSE7XG5cblx0XHQvLyBEbyBzZXR1cCAtIHRoaXMgbXVzdCBjb21lIGZpcnN0LlxuXHRcdHRoaXMuZHJhd1NldHVwKGdsUHJvZ3JhbSwgZmFsc2UsIGlucHV0LCBvdXRwdXQpO1xuXG5cdFx0Ly8gVXBkYXRlIHVuaWZvcm1zIGFuZCBidWZmZXJzLlxuXHRcdC8vIEZyYW1lIG5lZWRzIHRvIGJlIG9mZnNldCBhbmQgc2NhbGVkIHNvIHRoYXQgYWxsIGZvdXIgc2lkZXMgYXJlIGluIHZpZXdwb3J0LlxuXHRcdGNvbnN0IG9uZVB4ID0gWyAxIC8gd2lkdGgsIDEgLyBoZWlnaHRdIGFzIFtudW1iZXIsIG51bWJlcl07XG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfc2NhbGUnLCBbMSAtIG9uZVB4WzBdLCAxIC0gb25lUHhbMV1dLCBGTE9BVCk7XG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfdHJhbnNsYXRpb24nLCBvbmVQeCwgRkxPQVQpO1xuXHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBib3VuZGFyeVBvc2l0aW9uc0J1ZmZlcik7XG5cdFx0dGhpcy5zZXRQb3NpdGlvbkF0dHJpYnV0ZShnbFByb2dyYW0sIHByb2dyYW0ubmFtZSk7XG5cblx0XHQvLyBEcmF3LlxuXHRcdHRoaXMuc2V0QmxlbmRNb2RlKHBhcmFtcy5zaG91bGRCbGVuZEFscGhhKTtcblx0XHRpZiAocGFyYW1zLnNpbmdsZUVkZ2UpIHtcblx0XHRcdHN3aXRjaChwYXJhbXMuc2luZ2xlRWRnZSkge1xuXHRcdFx0XHRjYXNlICdMRUZUJzpcblx0XHRcdFx0XHRnbC5kcmF3QXJyYXlzKGdsLkxJTkVTLCAzLCAyKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAnUklHSFQnOlxuXHRcdFx0XHRcdGdsLmRyYXdBcnJheXMoZ2wuTElORVMsIDEsIDIpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICdUT1AnOlxuXHRcdFx0XHRcdGdsLmRyYXdBcnJheXMoZ2wuTElORVMsIDIsIDIpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICdCT1RUT00nOlxuXHRcdFx0XHRcdGdsLmRyYXdBcnJheXMoZ2wuTElORVMsIDAsIDIpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5rbm93biBib3VuZGFyeSBlZGdlIHR5cGU6ICR7cGFyYW1zLnNpbmdsZUVkZ2V9LmApO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRnbC5kcmF3QXJyYXlzKGdsLkxJTkVfTE9PUCwgMCwgNCk7XG5cdFx0fVxuXHRcdGdsLmRpc2FibGUoZ2wuQkxFTkQpO1xuXHR9XG5cblx0Ly8gU3RlcCBwcm9ncmFtIGZvciBhbGwgYnV0IGEgc3RyaXAgb2YgcHggYWxvbmcgdGhlIGJvdW5kYXJ5LlxuXHRzdGVwTm9uQm91bmRhcnkoXG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRwcm9ncmFtOiBHUFVQcm9ncmFtLFxuXHRcdFx0aW5wdXQ/OiAgKERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSlbXSB8IERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSxcblx0XHRcdG91dHB1dD86IERhdGFMYXllciwgLy8gVW5kZWZpbmVkIHJlbmRlcnMgdG8gc2NyZWVuLlxuXHRcdFx0c2hvdWxkQmxlbmRBbHBoYT86IGJvb2xlYW4sXG5cdFx0fSxcblx0KSB7XG5cdFx0Y29uc3QgeyBnbCwgZXJyb3JTdGF0ZSwgcXVhZFBvc2l0aW9uc0J1ZmZlciB9ID0gdGhpcztcblx0XHRjb25zdCB7IHByb2dyYW0sIGlucHV0LCBvdXRwdXQgfSA9IHBhcmFtcztcblx0XHRjb25zdCBbIHdpZHRoLCBoZWlnaHQgXSA9IG91dHB1dCA/IG91dHB1dC5nZXREaW1lbnNpb25zKCkgOiBbIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0IF07XG5cblx0XHQvLyBJZ25vcmUgaWYgd2UgYXJlIGluIGVycm9yIHN0YXRlLlxuXHRcdGlmIChlcnJvclN0YXRlKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgZ2xQcm9ncmFtID0gcHJvZ3JhbS5kZWZhdWx0UHJvZ3JhbSE7XG5cblx0XHQvLyBEbyBzZXR1cCAtIHRoaXMgbXVzdCBjb21lIGZpcnN0LlxuXHRcdHRoaXMuZHJhd1NldHVwKGdsUHJvZ3JhbSwgZmFsc2UsIGlucHV0LCBvdXRwdXQpO1xuXG5cdFx0Ly8gVXBkYXRlIHVuaWZvcm1zIGFuZCBidWZmZXJzLlxuXHRcdGNvbnN0IG9uZVB4ID0gWyAxIC8gd2lkdGgsIDEgLyBoZWlnaHRdIGFzIFtudW1iZXIsIG51bWJlcl07XG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfc2NhbGUnLCBbMSAtIDIgKiBvbmVQeFswXSwgMSAtIDIgKiBvbmVQeFsxXV0sIEZMT0FUKTtcblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF90cmFuc2xhdGlvbicsIG9uZVB4LCBGTE9BVCk7XG5cdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHF1YWRQb3NpdGlvbnNCdWZmZXIpO1xuXHRcdHRoaXMuc2V0UG9zaXRpb25BdHRyaWJ1dGUoZ2xQcm9ncmFtLCBwcm9ncmFtLm5hbWUpO1xuXHRcdFxuXHRcdC8vIERyYXcuXG5cdFx0dGhpcy5zZXRCbGVuZE1vZGUocGFyYW1zLnNob3VsZEJsZW5kQWxwaGEpO1xuXHRcdGdsLmRyYXdBcnJheXMoZ2wuVFJJQU5HTEVfU1RSSVAsIDAsIDQpO1xuXHRcdGdsLmRpc2FibGUoZ2wuQkxFTkQpO1xuXHR9XG5cblx0Ly8gU3RlcCBwcm9ncmFtIG9ubHkgZm9yIGEgY2lyY3VsYXIgc3BvdC5cblx0c3RlcENpcmNsZShcblx0XHRwYXJhbXM6IHtcblx0XHRcdHByb2dyYW06IEdQVVByb2dyYW0sXG5cdFx0XHRwb3NpdGlvbjogW251bWJlciwgbnVtYmVyXSwgLy8gUG9zaXRpb24gaXMgaW4gc2NyZWVuIHNwYWNlIGNvb3Jkcy5cblx0XHRcdHJhZGl1czogbnVtYmVyLCAvLyBSYWRpdXMgaXMgaW4gc2NyZWVuIHNwYWNlIHVuaXRzLlxuXHRcdFx0aW5wdXQ/OiAgKERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSlbXSB8IERhdGFMYXllciB8IFdlYkdMVGV4dHVyZSxcblx0XHRcdG91dHB1dD86IERhdGFMYXllciwgLy8gVW5kZWZpbmVkIHJlbmRlcnMgdG8gc2NyZWVuLlxuXHRcdFx0bnVtU2VnbWVudHM/OiBudW1iZXIsXG5cdFx0XHRzaG91bGRCbGVuZEFscGhhPzogYm9vbGVhbixcblx0XHR9LFxuXHQpIHtcblx0XHRjb25zdCB7IGdsLCBlcnJvclN0YXRlLCB3aWR0aCwgaGVpZ2h0IH0gPSB0aGlzO1xuXHRcdGNvbnN0IHsgcHJvZ3JhbSwgcG9zaXRpb24sIHJhZGl1cywgaW5wdXQsIG91dHB1dCB9ID0gcGFyYW1zO1xuXG5cdFx0Ly8gSWdub3JlIGlmIHdlIGFyZSBpbiBlcnJvciBzdGF0ZS5cblx0XHRpZiAoZXJyb3JTdGF0ZSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGdsUHJvZ3JhbSA9IHByb2dyYW0uZGVmYXVsdFByb2dyYW0hO1xuXG5cdFx0Ly8gRG8gc2V0dXAgLSB0aGlzIG11c3QgY29tZSBmaXJzdC5cblx0XHR0aGlzLmRyYXdTZXR1cChnbFByb2dyYW0sIGZhbHNlLCBpbnB1dCwgb3V0cHV0KTtcblxuXHRcdC8vIFVwZGF0ZSB1bmlmb3JtcyBhbmQgYnVmZmVycy5cblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF9zY2FsZScsIFtyYWRpdXMgKiAyIC8gd2lkdGgsIHJhZGl1cyAqIDIgLyBoZWlnaHRdLCBGTE9BVCk7XG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfdHJhbnNsYXRpb24nLCBbMiAqIHBvc2l0aW9uWzBdIC8gd2lkdGggLSAxLCAyICogcG9zaXRpb25bMV0gLyBoZWlnaHQgLSAxXSwgRkxPQVQpO1xuXHRcdGNvbnN0IG51bVNlZ21lbnRzID0gcGFyYW1zLm51bVNlZ21lbnRzID8gcGFyYW1zLm51bVNlZ21lbnRzIDogREVGQVVMVF9DSVJDTEVfTlVNX1NFR01FTlRTO1xuXHRcdGlmIChudW1TZWdtZW50cyA8IDMpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgbnVtU2VnbWVudHMgZm9yIFdlYkdMQ29tcHV0ZS5zdGVwQ2lyY2xlIG11c3QgYmUgZ3JlYXRlciB0aGFuIDIsIGdvdCAke251bVNlZ21lbnRzfS5gKTtcblx0XHR9XG5cdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHRoaXMuZ2V0Q2lyY2xlUG9zaXRpb25zQnVmZmVyKG51bVNlZ21lbnRzKSk7XG5cdFx0dGhpcy5zZXRQb3NpdGlvbkF0dHJpYnV0ZShnbFByb2dyYW0sIHByb2dyYW0ubmFtZSk7XG5cdFx0XG5cdFx0Ly8gRHJhdy5cblx0XHR0aGlzLnNldEJsZW5kTW9kZShwYXJhbXMuc2hvdWxkQmxlbmRBbHBoYSk7XG5cdFx0Z2wuZHJhd0FycmF5cyhnbC5UUklBTkdMRV9GQU4sIDAsIG51bVNlZ21lbnRzICsgMik7XHRcblx0XHRnbC5kaXNhYmxlKGdsLkJMRU5EKTtcblx0fVxuXG5cdC8vIFN0ZXAgcHJvZ3JhbSBvbmx5IGZvciBhIHRoaWNrZW5lZCBsaW5lIHNlZ21lbnQgKHJvdW5kZWQgZW5kIGNhcHMgYXZhaWxhYmxlKS5cblx0c3RlcFNlZ21lbnQoXG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRwcm9ncmFtOiBHUFVQcm9ncmFtLFxuXHRcdFx0cG9zaXRpb24xOiBbbnVtYmVyLCBudW1iZXJdLCAvLyBQb3NpdGlvbiBpcyBpbiBzY3JlZW4gc3BhY2UgY29vcmRzLlxuXHRcdFx0cG9zaXRpb24yOiBbbnVtYmVyLCBudW1iZXJdLCAvLyBQb3NpdGlvbiBpcyBpbiBzY3JlZW4gc3BhY2UgY29vcmRzLlxuXHRcdFx0dGhpY2tuZXNzOiBudW1iZXIsIC8vIFRoaWNrbmVzcyBpcyBpbiBweC5cblx0XHRcdGlucHV0PzogIChEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUpW10gfCBEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUsXG5cdFx0XHRvdXRwdXQ/OiBEYXRhTGF5ZXIsIC8vIFVuZGVmaW5lZCByZW5kZXJzIHRvIHNjcmVlbi5cblx0XHRcdGVuZENhcHM/OiBib29sZWFuLFxuXHRcdFx0bnVtQ2FwU2VnbWVudHM/OiBudW1iZXIsXG5cdFx0XHRzaG91bGRCbGVuZEFscGhhPzogYm9vbGVhbixcblx0XHR9LFxuXHQpIHtcblx0XHRjb25zdCB7IGdsLCBlcnJvclN0YXRlIH0gPSB0aGlzO1xuXHRcdGNvbnN0IHsgcHJvZ3JhbSwgcG9zaXRpb24xLCBwb3NpdGlvbjIsIHRoaWNrbmVzcywgaW5wdXQsIG91dHB1dCB9ID0gcGFyYW1zO1xuXHRcdGNvbnN0IFsgd2lkdGgsIGhlaWdodCBdID0gb3V0cHV0ID8gb3V0cHV0LmdldERpbWVuc2lvbnMoKSA6IFsgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQgXTtcblxuXHRcdC8vIElnbm9yZSBpZiB3ZSBhcmUgaW4gZXJyb3Igc3RhdGUuXG5cdFx0aWYgKGVycm9yU3RhdGUpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBnbFByb2dyYW0gPSBwcm9ncmFtLnNlZ21lbnRQcm9ncmFtITtcblxuXHRcdC8vIERvIHNldHVwIC0gdGhpcyBtdXN0IGNvbWUgZmlyc3QuXG5cdFx0dGhpcy5kcmF3U2V0dXAoZ2xQcm9ncmFtLCBmYWxzZSwgaW5wdXQsIG91dHB1dCk7XG5cblx0XHQvLyBVcGRhdGUgdW5pZm9ybXMgYW5kIGJ1ZmZlcnMuXG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfaGFsZlRoaWNrbmVzcycsIHRoaWNrbmVzcyAvIDIsIEZMT0FUKTtcblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF9zY2FsZScsIFsyIC8gd2lkdGgsIDIgLyBoZWlnaHRdLCBGTE9BVCk7XG5cdFx0Y29uc3QgZGlmZlggPSBwb3NpdGlvbjFbMF0gLSBwb3NpdGlvbjJbMF07XG5cdFx0Y29uc3QgZGlmZlkgPSBwb3NpdGlvbjFbMV0gLSBwb3NpdGlvbjJbMV07XG5cdFx0Y29uc3QgYW5nbGUgPSBNYXRoLmF0YW4yKGRpZmZZLCBkaWZmWCk7XG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfcm90YXRpb24nLCBhbmdsZSwgRkxPQVQpO1xuXHRcdGNvbnN0IGNlbnRlclggPSAocG9zaXRpb24xWzBdICsgcG9zaXRpb24yWzBdKSAvIDI7XG5cdFx0Y29uc3QgY2VudGVyWSA9IChwb3NpdGlvbjFbMV0gKyBwb3NpdGlvbjJbMV0pIC8gMjtcblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF90cmFuc2xhdGlvbicsIFsyICogY2VudGVyWCAvIHRoaXMud2lkdGggLSAxLCAyICogY2VudGVyWSAvIHRoaXMuaGVpZ2h0IC0gMV0sIEZMT0FUKTtcblx0XHRjb25zdCBsZW5ndGggPSBNYXRoLnNxcnQoZGlmZlggKiBkaWZmWCArIGRpZmZZICogZGlmZlkpO1xuXHRcdFxuXHRcdGNvbnN0IG51bVNlZ21lbnRzID0gcGFyYW1zLm51bUNhcFNlZ21lbnRzID8gcGFyYW1zLm51bUNhcFNlZ21lbnRzICogMiA6IERFRkFVTFRfQ0lSQ0xFX05VTV9TRUdNRU5UUztcblx0XHRpZiAocGFyYW1zLmVuZENhcHMpIHtcblx0XHRcdGlmIChudW1TZWdtZW50cyA8IDYgfHwgbnVtU2VnbWVudHMgJSA2ICE9PSAwKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgbnVtU2VnbWVudHMgZm9yIFdlYkdMQ29tcHV0ZS5zdGVwU2VnbWVudCBtdXN0IGJlIGRpdmlzaWJsZSBieSA2LCBnb3QgJHtudW1TZWdtZW50c30uYCk7XG5cdFx0XHR9XG5cdFx0XHQvLyBIYXZlIHRvIHN1YnRyYWN0IGEgc21hbGwgb2Zmc2V0IGZyb20gbGVuZ3RoLlxuXHRcdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfbGVuZ3RoJywgbGVuZ3RoIC0gdGhpY2tuZXNzICogTWF0aC5zaW4oTWF0aC5QSSAvIG51bVNlZ21lbnRzKSwgRkxPQVQpO1xuXHRcdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHRoaXMuZ2V0Q2lyY2xlUG9zaXRpb25zQnVmZmVyKG51bVNlZ21lbnRzKSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIEhhdmUgdG8gc3VidHJhY3QgYSBzbWFsbCBvZmZzZXQgZnJvbSBsZW5ndGguXG5cdFx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF9sZW5ndGgnLCBsZW5ndGggLSB0aGlja25lc3MsIEZMT0FUKTtcblx0XHRcdC8vIFVzZSBhIHJlY3RhbmdsZSBpbiBjYXNlIG9mIG5vIGNhcHMuXG5cdFx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdGhpcy5xdWFkUG9zaXRpb25zQnVmZmVyKTtcblx0XHR9XG5cblx0XHR0aGlzLnNldFBvc2l0aW9uQXR0cmlidXRlKGdsUHJvZ3JhbSwgcHJvZ3JhbS5uYW1lKTtcblx0XHRcblx0XHQvLyBEcmF3LlxuXHRcdHRoaXMuc2V0QmxlbmRNb2RlKHBhcmFtcy5zaG91bGRCbGVuZEFscGhhKTtcblx0XHRpZiAocGFyYW1zLmVuZENhcHMpIHtcblx0XHRcdGdsLmRyYXdBcnJheXMoZ2wuVFJJQU5HTEVfRkFOLCAwLCBudW1TZWdtZW50cyArIDIpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRnbC5kcmF3QXJyYXlzKGdsLlRSSUFOR0xFX1NUUklQLCAwLCA0KTtcblx0XHR9XG5cdFx0Z2wuZGlzYWJsZShnbC5CTEVORCk7XG5cdH1cblxuXHRzdGVwUG9seWxpbmUoXG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRwcm9ncmFtOiBHUFVQcm9ncmFtLFxuXHRcdFx0cG9zaXRpb25zOiBbbnVtYmVyLCBudW1iZXJdW10sXG5cdFx0XHR0aGlja25lc3M6IG51bWJlciwgLy8gVGhpY2tuZXNzIG9mIGxpbmUgaXMgaW4gcHguXG5cdFx0XHRpbnB1dD86IChEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUpW10gfCBEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUsXG5cdFx0XHRvdXRwdXQ/OiBEYXRhTGF5ZXIsIC8vIFVuZGVmaW5lZCByZW5kZXJzIHRvIHNjcmVlbi5cblx0XHRcdGNsb3NlTG9vcD86IGJvb2xlYW4sXG5cdFx0XHQvLyBpbmNsdWRlVVZzPzogYm9vbGVhbixcblx0XHRcdC8vIGluY2x1ZGVOb3JtYWxzPzogYm9vbGVhbixcblx0XHRcdHNob3VsZEJsZW5kQWxwaGE/OiBib29sZWFuLFxuXHRcdH0sXG5cdCkge1xuXHRcdGNvbnN0IHsgcHJvZ3JhbSwgaW5wdXQsIG91dHB1dCB9ID0gcGFyYW1zO1xuXHRcdGNvbnN0IHZlcnRpY2VzID0gcGFyYW1zLnBvc2l0aW9ucztcblx0XHRjb25zdCBjbG9zZUxvb3AgPSAhIXBhcmFtcy5jbG9zZUxvb3A7XG5cdFx0Y29uc3QgaGFsZlRoaWNrbmVzcyA9IHBhcmFtcy50aGlja25lc3MgLyAyO1xuXHRcdGNvbnN0IHsgZ2wsIHdpZHRoLCBoZWlnaHQsIGVycm9yU3RhdGUgfSA9IHRoaXM7XG5cblx0XHQvLyBJZ25vcmUgaWYgd2UgYXJlIGluIGVycm9yIHN0YXRlLlxuXHRcdGlmIChlcnJvclN0YXRlKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gT2Zmc2V0IHZlcnRpY2VzLlxuXHRcdGNvbnN0IG51bVBvc2l0aW9ucyA9IGNsb3NlTG9vcCA/IHZlcnRpY2VzLmxlbmd0aCAqIDQgKyAyIDogKHZlcnRpY2VzLmxlbmd0aCAtIDEpICogNDtcblx0XHRjb25zdCBwb3NpdGlvbnMgPSBuZXcgRmxvYXQzMkFycmF5KDIgKiBudW1Qb3NpdGlvbnMpO1xuXHRcdC8vIGNvbnN0IHV2cyA9IHBhcmFtcy5pbmNsdWRlVVZzID8gbmV3IEZsb2F0MzJBcnJheSgyICogbnVtUG9zaXRpb25zKSA6IHVuZGVmaW5lZDtcblx0XHQvLyBjb25zdCBub3JtYWxzID0gcGFyYW1zLmluY2x1ZGVOb3JtYWxzID8gbmV3IEZsb2F0MzJBcnJheSgyICogbnVtUG9zaXRpb25zKSA6IHVuZGVmaW5lZDtcblx0XHRjb25zdCB1dnMgPSBuZXcgRmxvYXQzMkFycmF5KDIgKiBudW1Qb3NpdGlvbnMpO1xuXHRcdGNvbnN0IG5vcm1hbHMgPSBuZXcgRmxvYXQzMkFycmF5KDIgKiBudW1Qb3NpdGlvbnMpO1xuXG5cdFx0Ly8gdG1wIGFycmF5cy5cblx0XHRjb25zdCBzMSA9IFswLCAwXTtcblx0XHRjb25zdCBzMiA9IFswLCAwXTtcblx0XHRjb25zdCBuMSA9IFswLCAwXTtcblx0XHRjb25zdCBuMiA9IFswLCAwXTtcblx0XHRjb25zdCBuMyA9IFswLCAwXTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHZlcnRpY2VzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRpZiAoIWNsb3NlTG9vcCAmJiBpID09PSB2ZXJ0aWNlcy5sZW5ndGggLSAxKSBjb250aW51ZTtcblx0XHRcdC8vIFZlcnRpY2VzIG9uIHRoaXMgc2VnbWVudC5cblx0XHRcdGNvbnN0IHYxID0gdmVydGljZXNbaV07XG5cdFx0XHRjb25zdCB2MiA9IHZlcnRpY2VzWyhpICsgMSkgJSB2ZXJ0aWNlcy5sZW5ndGhdO1xuXHRcdFx0czFbMF0gPSB2MlswXSAtIHYxWzBdO1xuXHRcdFx0czFbMV0gPSB2MlsxXSAtIHYxWzFdO1xuXHRcdFx0Y29uc3QgbGVuZ3RoMSA9IE1hdGguc3FydChzMVswXSAqIHMxWzBdICsgczFbMV0gKiBzMVsxXSk7XG5cdFx0XHRuMVswXSA9IHMxWzFdIC8gbGVuZ3RoMTtcblx0XHRcdG4xWzFdID0gLSBzMVswXSAvIGxlbmd0aDE7XG5cblx0XHRcdGNvbnN0IGluZGV4ID0gaSAqIDQgKyAyO1xuXG5cdFx0XHRpZiAoIWNsb3NlTG9vcCAmJiBpID09PSAwKSB7XG5cdFx0XHRcdC8vIEFkZCBzdGFydGluZyBwb2ludHMgdG8gcG9zaXRpb25zIGFycmF5LlxuXHRcdFx0XHRwb3NpdGlvbnNbMF0gPSB2MVswXSArIG4xWzBdICogaGFsZlRoaWNrbmVzcztcblx0XHRcdFx0cG9zaXRpb25zWzFdID0gdjFbMV0gKyBuMVsxXSAqIGhhbGZUaGlja25lc3M7XG5cdFx0XHRcdHBvc2l0aW9uc1syXSA9IHYxWzBdIC0gbjFbMF0gKiBoYWxmVGhpY2tuZXNzO1xuXHRcdFx0XHRwb3NpdGlvbnNbM10gPSB2MVsxXSAtIG4xWzFdICogaGFsZlRoaWNrbmVzcztcblx0XHRcdFx0aWYgKHV2cykge1xuXHRcdFx0XHRcdHV2c1swXSA9IDA7XG5cdFx0XHRcdFx0dXZzWzFdID0gMTtcblx0XHRcdFx0XHR1dnNbMl0gPSAwO1xuXHRcdFx0XHRcdHV2c1szXSA9IDA7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKG5vcm1hbHMpIHtcblx0XHRcdFx0XHRub3JtYWxzWzBdID0gbjFbMF07XG5cdFx0XHRcdFx0bm9ybWFsc1sxXSA9IG4xWzFdO1xuXHRcdFx0XHRcdG5vcm1hbHNbMl0gPSBuMVswXTtcblx0XHRcdFx0XHRub3JtYWxzWzNdID0gbjFbMV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgdSA9IChpICsgMSkgLyAodmVydGljZXMubGVuZ3RoIC0gMSk7XG5cblx0XHRcdC8vIE9mZnNldCBmcm9tIHYyLlxuXHRcdFx0cG9zaXRpb25zWzIgKiBpbmRleF0gPSB2MlswXSArIG4xWzBdICogaGFsZlRoaWNrbmVzcztcblx0XHRcdHBvc2l0aW9uc1syICogaW5kZXggKyAxXSA9IHYyWzFdICsgbjFbMV0gKiBoYWxmVGhpY2tuZXNzO1xuXHRcdFx0cG9zaXRpb25zWzIgKiBpbmRleCArIDJdID0gdjJbMF0gLSBuMVswXSAqIGhhbGZUaGlja25lc3M7XG5cdFx0XHRwb3NpdGlvbnNbMiAqIGluZGV4ICsgM10gPSB2MlsxXSAtIG4xWzFdICogaGFsZlRoaWNrbmVzcztcblx0XHRcdGlmICh1dnMpIHtcblx0XHRcdFx0dXZzWzIgKiBpbmRleF0gPSB1O1xuXHRcdFx0XHR1dnNbMiAqIGluZGV4ICsgMV0gPSAxO1xuXHRcdFx0XHR1dnNbMiAqIGluZGV4ICsgMl0gPSB1O1xuXHRcdFx0XHR1dnNbMiAqIGluZGV4ICsgM10gPSAwO1xuXHRcdFx0fVxuXHRcdFx0aWYgKG5vcm1hbHMpIHtcblx0XHRcdFx0bm9ybWFsc1syICogaW5kZXhdID0gbjFbMF07XG5cdFx0XHRcdG5vcm1hbHNbMiAqIGluZGV4ICsgMV0gPSBuMVsxXTtcblx0XHRcdFx0bm9ybWFsc1syICogaW5kZXggKyAyXSA9IG4xWzBdO1xuXHRcdFx0XHRub3JtYWxzWzIgKiBpbmRleCArIDNdID0gbjFbMV07XG5cdFx0XHR9XG5cblx0XHRcdGlmICgoaSA8IHZlcnRpY2VzLmxlbmd0aCAtIDIpIHx8IGNsb3NlTG9vcCkge1xuXHRcdFx0XHQvLyBWZXJ0aWNlcyBvbiBuZXh0IHNlZ21lbnQuXG5cdFx0XHRcdGNvbnN0IHYzID0gdmVydGljZXNbKGkgKyAxKSAlIHZlcnRpY2VzLmxlbmd0aF07XG5cdFx0XHRcdGNvbnN0IHY0ID0gdmVydGljZXNbKGkgKyAyKSAlIHZlcnRpY2VzLmxlbmd0aF07XG5cdFx0XHRcdHMyWzBdID0gdjRbMF0gLSB2M1swXTtcblx0XHRcdFx0czJbMV0gPSB2NFsxXSAtIHYzWzFdO1xuXHRcdFx0XHRjb25zdCBsZW5ndGgyID0gTWF0aC5zcXJ0KHMyWzBdICogczJbMF0gKyBzMlsxXSAqIHMyWzFdKTtcblx0XHRcdFx0bjJbMF0gPSBzMlsxXSAvIGxlbmd0aDI7XG5cdFx0XHRcdG4yWzFdID0gLSBzMlswXSAvIGxlbmd0aDI7XG5cblx0XHRcdFx0Ly8gT2Zmc2V0IGZyb20gdjNcblx0XHRcdFx0cG9zaXRpb25zWzIgKiAoKGluZGV4ICsgMikgJSAoNCAqIHZlcnRpY2VzLmxlbmd0aCkpXSA9IHYzWzBdICsgbjJbMF0gKiBoYWxmVGhpY2tuZXNzO1xuXHRcdFx0XHRwb3NpdGlvbnNbMiAqICgoaW5kZXggKyAyKSAlICg0ICogdmVydGljZXMubGVuZ3RoKSkgKyAxXSA9IHYzWzFdICsgbjJbMV0gKiBoYWxmVGhpY2tuZXNzO1xuXHRcdFx0XHRwb3NpdGlvbnNbMiAqICgoaW5kZXggKyAyKSAlICg0ICogdmVydGljZXMubGVuZ3RoKSkgKyAyXSA9IHYzWzBdIC0gbjJbMF0gKiBoYWxmVGhpY2tuZXNzO1xuXHRcdFx0XHRwb3NpdGlvbnNbMiAqICgoaW5kZXggKyAyKSAlICg0ICogdmVydGljZXMubGVuZ3RoKSkgKyAzXSA9IHYzWzFdIC0gbjJbMV0gKiBoYWxmVGhpY2tuZXNzO1xuXHRcdFx0XHRpZiAodXZzKSB7XG5cdFx0XHRcdFx0dXZzWzIgKiBpbmRleF0gPSB1O1xuXHRcdFx0XHRcdHV2c1syICogaW5kZXggKyAxXSA9IDE7XG5cdFx0XHRcdFx0dXZzWzIgKiBpbmRleCArIDJdID0gdTtcblx0XHRcdFx0XHR1dnNbMiAqIGluZGV4ICsgM10gPSAwO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChub3JtYWxzKSB7XG5cdFx0XHRcdFx0bm9ybWFsc1syICogKChpbmRleCArIDIpICUgKDQgKiB2ZXJ0aWNlcy5sZW5ndGgpKV0gPSBuMlswXTtcblx0XHRcdFx0XHRub3JtYWxzWzIgKiAoKGluZGV4ICsgMikgJSAoNCAqIHZlcnRpY2VzLmxlbmd0aCkpICsgMV0gPSBuMlsxXTtcblx0XHRcdFx0XHRub3JtYWxzWzIgKiAoKGluZGV4ICsgMikgJSAoNCAqIHZlcnRpY2VzLmxlbmd0aCkpICsgMl0gPSBuMlswXTtcblx0XHRcdFx0XHRub3JtYWxzWzIgKiAoKGluZGV4ICsgMikgJSAoNCAqIHZlcnRpY2VzLmxlbmd0aCkpICsgM10gPSBuMlsxXTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIENoZWNrIHRoZSBhbmdsZSBiZXR3ZWVuIGFkamFjZW50IHNlZ21lbnRzLlxuXHRcdFx0XHRjb25zdCBjcm9zcyA9IG4xWzBdICogbjJbMV0gLSBuMVsxXSAqIG4yWzBdO1xuXHRcdFx0XHRpZiAoTWF0aC5hYnMoY3Jvc3MpIDwgMWUtNikgY29udGludWU7XG5cdFx0XHRcdG4zWzBdID0gbjFbMF0gKyBuMlswXTtcblx0XHRcdFx0bjNbMV0gPSBuMVsxXSArIG4yWzFdO1xuXHRcdFx0XHRjb25zdCBsZW5ndGgzID0gTWF0aC5zcXJ0KG4zWzBdICogbjNbMF0gKyBuM1sxXSAqIG4zWzFdKTtcblx0XHRcdFx0bjNbMF0gLz0gbGVuZ3RoMztcblx0XHRcdFx0bjNbMV0gLz0gbGVuZ3RoMztcblx0XHRcdFx0Ly8gTWFrZSBhZGp1c3RtZW50cyB0byBwb3NpdGlvbnMuXG5cdFx0XHRcdGNvbnN0IGFuZ2xlID0gTWF0aC5hY29zKG4xWzBdICogbjJbMF0gKyBuMVsxXSAqIG4yWzFdKTtcblx0XHRcdFx0Y29uc3Qgb2Zmc2V0ID0gaGFsZlRoaWNrbmVzcyAvIE1hdGguY29zKGFuZ2xlIC8gMik7XG5cdFx0XHRcdGlmIChjcm9zcyA8IDApIHtcblx0XHRcdFx0XHRwb3NpdGlvbnNbMiAqIGluZGV4XSA9IHYyWzBdICsgbjNbMF0gKiBvZmZzZXQ7XG5cdFx0XHRcdFx0cG9zaXRpb25zWzIgKiBpbmRleCArIDFdID0gdjJbMV0gKyBuM1sxXSAqIG9mZnNldDtcblx0XHRcdFx0XHRwb3NpdGlvbnNbMiAqICgoaW5kZXggKyAyKSAlICg0ICogdmVydGljZXMubGVuZ3RoKSldID0gcG9zaXRpb25zWzIgKiBpbmRleF07XG5cdFx0XHRcdFx0cG9zaXRpb25zWzIgKiAoKGluZGV4ICsgMikgJSAoNCAqIHZlcnRpY2VzLmxlbmd0aCkpICsgMV0gPSBwb3NpdGlvbnNbMiAqIGluZGV4ICsgMV07XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cG9zaXRpb25zWzIgKiBpbmRleCArIDJdID0gdjJbMF0gLSBuM1swXSAqIG9mZnNldDtcblx0XHRcdFx0XHRwb3NpdGlvbnNbMiAqIGluZGV4ICsgM10gPSB2MlsxXSAtIG4zWzFdICogb2Zmc2V0O1xuXHRcdFx0XHRcdHBvc2l0aW9uc1syICogKChpbmRleCArIDIpICUgKDQgKiB2ZXJ0aWNlcy5sZW5ndGgpKSArIDJdID0gcG9zaXRpb25zWzIgKiBpbmRleCArIDJdO1xuXHRcdFx0XHRcdHBvc2l0aW9uc1syICogKChpbmRleCArIDIpICUgKDQgKiB2ZXJ0aWNlcy5sZW5ndGgpKSArIDNdID0gcG9zaXRpb25zWzIgKiBpbmRleCArIDNdO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmIChjbG9zZUxvb3ApIHtcblx0XHRcdC8vIER1cGxpY2F0ZSBzdGFydGluZyBwb2ludHMgdG8gZW5kIG9mIHBvc2l0aW9ucyBhcnJheS5cblx0XHRcdHBvc2l0aW9uc1t2ZXJ0aWNlcy5sZW5ndGggKiA4XSA9IHBvc2l0aW9uc1swXTtcblx0XHRcdHBvc2l0aW9uc1t2ZXJ0aWNlcy5sZW5ndGggKiA4ICsgMV0gPSBwb3NpdGlvbnNbMV07XG5cdFx0XHRwb3NpdGlvbnNbdmVydGljZXMubGVuZ3RoICogOCArIDJdID0gcG9zaXRpb25zWzJdO1xuXHRcdFx0cG9zaXRpb25zW3ZlcnRpY2VzLmxlbmd0aCAqIDggKyAzXSA9IHBvc2l0aW9uc1szXTtcblx0XHRcdGlmICh1dnMpIHtcblx0XHRcdFx0dXZzW3ZlcnRpY2VzLmxlbmd0aCAqIDhdID0gdXZzWzBdO1xuXHRcdFx0XHR1dnNbdmVydGljZXMubGVuZ3RoICogOCArIDFdID0gdXZzWzFdO1xuXHRcdFx0XHR1dnNbdmVydGljZXMubGVuZ3RoICogOCArIDJdID0gdXZzWzJdO1xuXHRcdFx0XHR1dnNbdmVydGljZXMubGVuZ3RoICogOCArIDNdID0gdXZzWzNdO1xuXHRcdFx0fVxuXHRcdFx0aWYgKG5vcm1hbHMpIHtcblx0XHRcdFx0bm9ybWFsc1t2ZXJ0aWNlcy5sZW5ndGggKiA4XSA9IG5vcm1hbHNbMF07XG5cdFx0XHRcdG5vcm1hbHNbdmVydGljZXMubGVuZ3RoICogOCArIDFdID0gbm9ybWFsc1sxXTtcblx0XHRcdFx0bm9ybWFsc1t2ZXJ0aWNlcy5sZW5ndGggKiA4ICsgMl0gPSBub3JtYWxzWzJdO1xuXHRcdFx0XHRub3JtYWxzW3ZlcnRpY2VzLmxlbmd0aCAqIDggKyAzXSA9IG5vcm1hbHNbM107XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Y29uc3QgZ2xQcm9ncmFtID0gcHJvZ3JhbS5wb2x5bGluZVByb2dyYW0hO1xuXG5cdFx0Ly8gRG8gc2V0dXAgLSB0aGlzIG11c3QgY29tZSBmaXJzdC5cblx0XHR0aGlzLmRyYXdTZXR1cChnbFByb2dyYW0sIHRydWUsIGlucHV0LCBvdXRwdXQpO1xuXG5cdFx0Ly8gVXBkYXRlIHVuaWZvcm1zIGFuZCBidWZmZXJzLlxuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3NjYWxlJywgWzIgLyB3aWR0aCwgMiAvIGhlaWdodF0sIEZMT0FUKTtcblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF90cmFuc2xhdGlvbicsIFstMSwgLTFdLCBGTE9BVCk7XG5cdFx0Ly8gSW5pdCBwb3NpdGlvbnMgYnVmZmVyLlxuXHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLmluaXRWZXJ0ZXhCdWZmZXIocG9zaXRpb25zKSEpO1xuXHRcdHRoaXMuc2V0UG9zaXRpb25BdHRyaWJ1dGUoZ2xQcm9ncmFtLCBwcm9ncmFtLm5hbWUpO1xuXHRcdGlmICh1dnMpIHtcblx0XHRcdC8vIEluaXQgdXYgYnVmZmVyLlxuXHRcdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHRoaXMuaW5pdFZlcnRleEJ1ZmZlcih1dnMpISk7XG5cdFx0XHR0aGlzLnNldFVWQXR0cmlidXRlKGdsUHJvZ3JhbSwgcHJvZ3JhbS5uYW1lKTtcblx0XHR9XG5cdFx0aWYgKG5vcm1hbHMpIHtcblx0XHRcdC8vIEluaXQgbm9ybWFscyBidWZmZXIuXG5cdFx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdGhpcy5pbml0VmVydGV4QnVmZmVyKG5vcm1hbHMpISk7XG5cdFx0XHR0aGlzLnNldFZlcnRleEF0dHJpYnV0ZShnbFByb2dyYW0sICdhX2ludGVybmFsX25vcm1hbCcsIDIsIHByb2dyYW0ubmFtZSk7XG5cdFx0fVxuXG5cdFx0Ly8gRHJhdy5cblx0XHR0aGlzLnNldEJsZW5kTW9kZShwYXJhbXMuc2hvdWxkQmxlbmRBbHBoYSk7XG5cdFx0Z2wuZHJhd0FycmF5cyhnbC5UUklBTkdMRV9TVFJJUCwgMCwgbnVtUG9zaXRpb25zKTtcblx0XHRnbC5kaXNhYmxlKGdsLkJMRU5EKTtcblx0fVxuXG5cdHN0ZXBQb2ludHMoXG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRwb3NpdGlvbnM6IERhdGFMYXllciwgLy8gUG9zaXRpb25zIGluIGNhbnZhcyBweC5cblx0XHRcdHByb2dyYW0/OiBHUFVQcm9ncmFtLFxuXHRcdFx0aW5wdXQ/OiAoRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlKVtdIHwgRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlLFxuXHRcdFx0b3V0cHV0PzogRGF0YUxheWVyLFxuXHRcdFx0cG9pbnRTaXplPzogbnVtYmVyLFxuXHRcdFx0Y291bnQ/OiBudW1iZXIsXG5cdFx0XHRjb2xvcj86IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSxcblx0XHRcdHdyYXBYPzogYm9vbGVhbixcblx0XHRcdHdyYXBZPzogYm9vbGVhbixcblx0XHRcdHNob3VsZEJsZW5kQWxwaGE/OiBib29sZWFuLFxuXHRcdH0sXG5cdCkge1xuXHRcdGNvbnN0IHsgZ2wsIGVycm9yU3RhdGUsIHBvaW50SW5kZXhBcnJheSwgd2lkdGgsIGhlaWdodCB9ID0gdGhpcztcblx0XHRjb25zdCB7IHBvc2l0aW9ucywgb3V0cHV0IH0gPSBwYXJhbXM7XG5cblx0XHQvLyBJZ25vcmUgaWYgd2UgYXJlIGluIGVycm9yIHN0YXRlLlxuXHRcdGlmIChlcnJvclN0YXRlKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gQ2hlY2sgdGhhdCBudW1Qb2ludHMgaXMgdmFsaWQuXG5cdFx0aWYgKHBvc2l0aW9ucy5udW1Db21wb25lbnRzICE9PSAyICYmIHBvc2l0aW9ucy5udW1Db21wb25lbnRzICE9PSA0KSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFdlYkdMQ29tcHV0ZS5kcmF3UG9pbnRzKCkgbXVzdCBiZSBwYXNzZWQgYSBwb3NpdGlvbiBEYXRhTGF5ZXIgd2l0aCBlaXRoZXIgMiBvciA0IGNvbXBvbmVudHMsIGdvdCBwb3NpdGlvbiBEYXRhTGF5ZXIgXCIke3Bvc2l0aW9ucy5uYW1lfVwiIHdpdGggJHtwb3NpdGlvbnMubnVtQ29tcG9uZW50c30gY29tcG9uZW50cy5gKVxuXHRcdH1cblx0XHRjb25zdCBsZW5ndGggPSBwb3NpdGlvbnMuZ2V0TGVuZ3RoKCk7XG5cdFx0Y29uc3QgY291bnQgPSBwYXJhbXMuY291bnQgfHwgbGVuZ3RoO1xuXHRcdGlmIChjb3VudCA+IGxlbmd0aCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGNvdW50ICR7Y291bnR9IGZvciBwb3NpdGlvbiBEYXRhTGF5ZXIgb2YgbGVuZ3RoICR7bGVuZ3RofS5gKTtcblx0XHR9XG5cblx0XHRsZXQgcHJvZ3JhbSA9IHBhcmFtcy5wcm9ncmFtO1xuXHRcdGlmIChwcm9ncmFtID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHByb2dyYW0gPSB0aGlzLnNpbmdsZUNvbG9yUHJvZ3JhbTtcblx0XHRcdGNvbnN0IGNvbG9yID0gcGFyYW1zLmNvbG9yIHx8IFsxLCAwLCAwXTsgLy8gRGVmYXVsdCBvZiByZWQuXG5cdFx0XHRwcm9ncmFtLnNldFVuaWZvcm0oJ3VfY29sb3InLCBjb2xvciwgRkxPQVQpO1xuXHRcdH1cblx0XHRjb25zdCBnbFByb2dyYW0gPSBwcm9ncmFtLnBvaW50c1Byb2dyYW0hO1xuXG5cdFx0Ly8gQWRkIHBvc2l0aW9ucyB0byBlbmQgb2YgaW5wdXQgaWYgbmVlZGVkLlxuXHRcdGNvbnN0IGlucHV0ID0gdGhpcy5hZGRMYXllclRvSW5wdXRzKHBvc2l0aW9ucywgcGFyYW1zLmlucHV0KTtcblxuXHRcdC8vIERvIHNldHVwIC0gdGhpcyBtdXN0IGNvbWUgZmlyc3QuXG5cdFx0dGhpcy5kcmF3U2V0dXAoZ2xQcm9ncmFtLCBmYWxzZSwgaW5wdXQsIG91dHB1dCk7XG5cblx0XHQvLyBVcGRhdGUgdW5pZm9ybXMgYW5kIGJ1ZmZlcnMuXG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfcG9zaXRpb25zJywgaW5wdXQuaW5kZXhPZihwb3NpdGlvbnMpLCBJTlQpO1xuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3NjYWxlJywgWzEgLyB3aWR0aCwgMSAvIGhlaWdodF0sIEZMT0FUKTtcblx0XHQvLyBUZWxsIHdoZXRoZXIgd2UgYXJlIHVzaW5nIGFuIGFic29sdXRlIHBvc2l0aW9uICgyIGNvbXBvbmVudHMpLCBvciBwb3NpdGlvbiB3aXRoIGFjY3VtdWxhdGlvbiBidWZmZXIgKDQgY29tcG9uZW50cywgYmV0dGVyIGZsb2F0aW5nIHB0IGFjY3VyYWN5KS5cblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF9wb3NpdGlvbldpdGhBY2N1bXVsYXRpb24nLCBwb3NpdGlvbnMubnVtQ29tcG9uZW50cyA9PT0gNCA/IDEgOiAwLCBJTlQpO1xuXHRcdC8vIFNldCBkZWZhdWx0IHBvaW50U2l6ZS5cblx0XHRjb25zdCBwb2ludFNpemUgPSBwYXJhbXMucG9pbnRTaXplIHx8IDE7XG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfcG9pbnRTaXplJywgcG9pbnRTaXplLCBGTE9BVCk7XG5cdFx0Y29uc3QgcG9zaXRpb25MYXllckRpbWVuc2lvbnMgPSBwb3NpdGlvbnMuZ2V0RGltZW5zaW9ucygpO1xuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3Bvc2l0aW9uc0RpbWVuc2lvbnMnLCBwb3NpdGlvbkxheWVyRGltZW5zaW9ucywgRkxPQVQpO1xuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3dyYXBYJywgcGFyYW1zLndyYXBYID8gMSA6IDAsIElOVCk7XG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfd3JhcFknLCBwYXJhbXMud3JhcFkgPyAxIDogMCwgSU5UKTtcblx0XHRpZiAodGhpcy5wb2ludEluZGV4QnVmZmVyID09PSB1bmRlZmluZWQgfHwgKHBvaW50SW5kZXhBcnJheSAmJiBwb2ludEluZGV4QXJyYXkubGVuZ3RoIDwgY291bnQpKSB7XG5cdFx0XHQvLyBIYXZlIHRvIHVzZSBmbG9hdDMyIGFycmF5IGJjIGludCBpcyBub3Qgc3VwcG9ydGVkIGFzIGEgdmVydGV4IGF0dHJpYnV0ZSB0eXBlLlxuXHRcdFx0Y29uc3QgaW5kaWNlcyA9IG5ldyBGbG9hdDMyQXJyYXkobGVuZ3RoKTtcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aW5kaWNlc1tpXSA9IGk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLnBvaW50SW5kZXhBcnJheSA9IGluZGljZXM7XG5cdFx0XHR0aGlzLnBvaW50SW5kZXhCdWZmZXIgPSB0aGlzLmluaXRWZXJ0ZXhCdWZmZXIoaW5kaWNlcyk7XG5cdFx0fVxuXHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLnBvaW50SW5kZXhCdWZmZXIhKTtcblx0XHR0aGlzLnNldEluZGV4QXR0cmlidXRlKGdsUHJvZ3JhbSwgcHJvZ3JhbS5uYW1lKTtcblxuXHRcdC8vIERyYXcuXG5cdFx0dGhpcy5zZXRCbGVuZE1vZGUocGFyYW1zLnNob3VsZEJsZW5kQWxwaGEpO1xuXHRcdGdsLmRyYXdBcnJheXMoZ2wuUE9JTlRTLCAwLCBjb3VudCk7XG5cdFx0Z2wuZGlzYWJsZShnbC5CTEVORCk7XG5cdH1cblxuXHRkcmF3VmVjdG9yRmllbGQoXG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRmaWVsZDogRGF0YUxheWVyLFxuXHRcdFx0cHJvZ3JhbT86IEdQVVByb2dyYW0sXG5cdFx0XHRpbnB1dD86IChEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUpW10gfCBEYXRhTGF5ZXIgfCBXZWJHTFRleHR1cmUsXG5cdFx0XHRvdXRwdXQ/OiBEYXRhTGF5ZXIsXG5cdFx0XHR2ZWN0b3JTcGFjaW5nPzogbnVtYmVyLFxuXHRcdFx0dmVjdG9yU2NhbGU/OiBudW1iZXIsXG5cdFx0XHRjb2xvcj86IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSxcblx0XHRcdHNob3VsZEJsZW5kQWxwaGE/OiBib29sZWFuLFxuXHRcdH0sXG5cdCkge1xuXHRcdGNvbnN0IHsgZ2wsIGVycm9yU3RhdGUsIHZlY3RvckZpZWxkSW5kZXhBcnJheSwgd2lkdGgsIGhlaWdodCB9ID0gdGhpcztcblx0XHRjb25zdCB7IGZpZWxkLCBvdXRwdXQgfSA9IHBhcmFtcztcblxuXHRcdC8vIElnbm9yZSBpZiB3ZSBhcmUgaW4gZXJyb3Igc3RhdGUuXG5cdFx0aWYgKGVycm9yU3RhdGUpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBDaGVjayB0aGF0IGZpZWxkIGlzIHZhbGlkLlxuXHRcdGlmIChmaWVsZC5udW1Db21wb25lbnRzICE9PSAyKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFdlYkdMQ29tcHV0ZS5kcmF3VmVjdG9yRmllbGQoKSBtdXN0IGJlIHBhc3NlZCBhIGZpZWxkTGF5ZXIgd2l0aCAyIGNvbXBvbmVudHMsIGdvdCBmaWVsZExheWVyIFwiJHtmaWVsZC5uYW1lfVwiIHdpdGggJHtmaWVsZC5udW1Db21wb25lbnRzfSBjb21wb25lbnRzLmApXG5cdFx0fVxuXHRcdC8vIENoZWNrIGFzcGVjdCByYXRpby5cblx0XHQvLyBjb25zdCBkaW1lbnNpb25zID0gdmVjdG9yTGF5ZXIuZ2V0RGltZW5zaW9ucygpO1xuXHRcdC8vIGlmIChNYXRoLmFicyhkaW1lbnNpb25zWzBdIC8gZGltZW5zaW9uc1sxXSAtIHdpZHRoIC8gaGVpZ2h0KSA+IDAuMDEpIHtcblx0XHQvLyBcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBhc3BlY3QgcmF0aW8gJHsoZGltZW5zaW9uc1swXSAvIGRpbWVuc2lvbnNbMV0pLnRvRml4ZWQoMyl9IHZlY3RvciBEYXRhTGF5ZXIgd2l0aCBkaW1lbnNpb25zIFske2RpbWVuc2lvbnNbMF19LCAke2RpbWVuc2lvbnNbMV19XSwgZXhwZWN0ZWQgJHsod2lkdGggLyBoZWlnaHQpLnRvRml4ZWQoMyl9LmApO1xuXHRcdC8vIH1cblxuXHRcdGxldCBwcm9ncmFtID0gcGFyYW1zLnByb2dyYW07XG5cdFx0aWYgKHByb2dyYW0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cHJvZ3JhbSA9IHRoaXMuc2luZ2xlQ29sb3JQcm9ncmFtO1xuXHRcdFx0Y29uc3QgY29sb3IgPSBwYXJhbXMuY29sb3IgfHwgWzEsIDAsIDBdOyAvLyBEZWZhdWx0IHRvIHJlZC5cblx0XHRcdHByb2dyYW0uc2V0VW5pZm9ybSgndV9jb2xvcicsIGNvbG9yLCBGTE9BVCk7XG5cdFx0fVxuXHRcdGNvbnN0IGdsUHJvZ3JhbSA9IHByb2dyYW0udmVjdG9yRmllbGRQcm9ncmFtITtcblxuXHRcdC8vIEFkZCBmaWVsZCB0byBlbmQgb2YgaW5wdXQgaWYgbmVlZGVkLlxuXHRcdGNvbnN0IGlucHV0ID0gdGhpcy5hZGRMYXllclRvSW5wdXRzKGZpZWxkLCBwYXJhbXMuaW5wdXQpO1xuXG5cdFx0Ly8gRG8gc2V0dXAgLSB0aGlzIG11c3QgY29tZSBmaXJzdC5cblx0XHR0aGlzLmRyYXdTZXR1cChnbFByb2dyYW0sIGZhbHNlLCBpbnB1dCwgb3V0cHV0KTtcblxuXHRcdC8vIFVwZGF0ZSB1bmlmb3JtcyBhbmQgYnVmZmVycy5cblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF92ZWN0b3JzJywgaW5wdXQuaW5kZXhPZihmaWVsZCksIElOVCk7XG5cdFx0Ly8gU2V0IGRlZmF1bHQgc2NhbGUuXG5cdFx0Y29uc3QgdmVjdG9yU2NhbGUgPSBwYXJhbXMudmVjdG9yU2NhbGUgfHwgMTtcblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF9zY2FsZScsIFt2ZWN0b3JTY2FsZSAvIHdpZHRoLCB2ZWN0b3JTY2FsZSAvIGhlaWdodF0sIEZMT0FUKTtcblx0XHRjb25zdCB2ZWN0b3JTcGFjaW5nID0gcGFyYW1zLnZlY3RvclNwYWNpbmcgfHwgMTA7XG5cdFx0Y29uc3Qgc3BhY2VkRGltZW5zaW9ucyA9IFtNYXRoLmZsb29yKHdpZHRoIC8gdmVjdG9yU3BhY2luZyksIE1hdGguZmxvb3IoaGVpZ2h0IC8gdmVjdG9yU3BhY2luZyldIGFzIFtudW1iZXIsIG51bWJlcl07XG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfZGltZW5zaW9ucycsIHNwYWNlZERpbWVuc2lvbnMsIEZMT0FUKTtcblx0XHRjb25zdCBsZW5ndGggPSAyICogc3BhY2VkRGltZW5zaW9uc1swXSAqIHNwYWNlZERpbWVuc2lvbnNbMV07XG5cdFx0aWYgKHRoaXMudmVjdG9yRmllbGRJbmRleEJ1ZmZlciA9PT0gdW5kZWZpbmVkIHx8ICh2ZWN0b3JGaWVsZEluZGV4QXJyYXkgJiYgdmVjdG9yRmllbGRJbmRleEFycmF5Lmxlbmd0aCA8IGxlbmd0aCkpIHtcblx0XHRcdC8vIEhhdmUgdG8gdXNlIGZsb2F0MzIgYXJyYXkgYmMgaW50IGlzIG5vdCBzdXBwb3J0ZWQgYXMgYSB2ZXJ0ZXggYXR0cmlidXRlIHR5cGUuXG5cdFx0XHRjb25zdCBpbmRpY2VzID0gbmV3IEZsb2F0MzJBcnJheShsZW5ndGgpO1xuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpbmRpY2VzW2ldID0gaTtcblx0XHRcdH1cblx0XHRcdHRoaXMudmVjdG9yRmllbGRJbmRleEFycmF5ID0gaW5kaWNlcztcblx0XHRcdHRoaXMudmVjdG9yRmllbGRJbmRleEJ1ZmZlciA9IHRoaXMuaW5pdFZlcnRleEJ1ZmZlcihpbmRpY2VzKTtcblx0XHR9XG5cdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHRoaXMudmVjdG9yRmllbGRJbmRleEJ1ZmZlciEpO1xuXHRcdHRoaXMuc2V0SW5kZXhBdHRyaWJ1dGUoZ2xQcm9ncmFtLCBwcm9ncmFtLm5hbWUpO1xuXG5cdFx0Ly8gRHJhdy5cblx0XHR0aGlzLnNldEJsZW5kTW9kZShwYXJhbXMuc2hvdWxkQmxlbmRBbHBoYSk7XG5cdFx0Z2wuZHJhd0FycmF5cyhnbC5MSU5FUywgMCwgbGVuZ3RoKTtcblx0XHRnbC5kaXNhYmxlKGdsLkJMRU5EKTtcblx0fVxuXG5cdGRyYXdMaW5lcyhcblx0XHRwYXJhbXM6IHtcblx0XHRcdHBvc2l0aW9uczogRGF0YUxheWVyLFxuXHRcdFx0Ly8gVE9ETzogYWRkIG9wdGlvbiBmb3Igbm8gaW5kaWNlcy5cblx0XHRcdGluZGljZXM6IEZsb2F0MzJBcnJheSB8IFVpbnQxNkFycmF5IHwgVWludDMyQXJyYXkgfCBJbnQxNkFycmF5IHwgSW50MzJBcnJheSxcblx0XHRcdHByb2dyYW0/OiBHUFVQcm9ncmFtLFxuXHRcdFx0aW5wdXQ/OiAoRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlKVtdIHwgRGF0YUxheWVyIHwgV2ViR0xUZXh0dXJlLFxuXHRcdFx0b3V0cHV0PzogRGF0YUxheWVyLFxuXHRcdFx0Y291bnQ/OiBudW1iZXIsXG5cdFx0XHRjb2xvcj86IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSxcblx0XHRcdHdyYXBYPzogYm9vbGVhbixcblx0XHRcdHdyYXBZPzogYm9vbGVhbixcblx0XHRcdHNob3VsZEJsZW5kQWxwaGE/OiBib29sZWFuLFxuXHRcdH0sXG5cdCkge1xuXHRcdGNvbnN0IHsgZ2wsIGVycm9yU3RhdGUsIHdpZHRoLCBoZWlnaHQgfSA9IHRoaXM7XG5cdFx0Y29uc3QgeyBwb3NpdGlvbnMsIGluZGljZXMsIG91dHB1dCB9ID0gcGFyYW1zO1xuXG5cdFx0Ly8gSWdub3JlIGlmIHdlIGFyZSBpbiBlcnJvciBzdGF0ZS5cblx0XHRpZiAoZXJyb3JTdGF0ZSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIENoZWNrIHRoYXQgcG9zaXRpb25zIGlzIHZhbGlkLlxuXHRcdGlmIChwb3NpdGlvbnMubnVtQ29tcG9uZW50cyAhPT0gMiAmJiBwb3NpdGlvbnMubnVtQ29tcG9uZW50cyAhPT0gNCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBXZWJHTENvbXB1dGUuZHJhd0luZGV4ZWRMaW5lcygpIG11c3QgYmUgcGFzc2VkIGEgcG9zaXRpb24gRGF0YUxheWVyIHdpdGggZWl0aGVyIDIgb3IgNCBjb21wb25lbnRzLCBnb3QgcG9zaXRpb24gRGF0YUxheWVyIFwiJHtwb3NpdGlvbnMubmFtZX1cIiB3aXRoICR7cG9zaXRpb25zLm51bUNvbXBvbmVudHN9IGNvbXBvbmVudHMuYClcblx0XHR9XG5cblx0XHRsZXQgcHJvZ3JhbSA9IHBhcmFtcy5wcm9ncmFtO1xuXHRcdGlmIChwcm9ncmFtID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHByb2dyYW0gPSBwYXJhbXMud3JhcFggfHwgcGFyYW1zLndyYXBZID8gdGhpcy5zaW5nbGVDb2xvcldpdGhXcmFwQ2hlY2tQcm9ncmFtIDogdGhpcy5zaW5nbGVDb2xvclByb2dyYW07XG5cdFx0XHRjb25zdCBjb2xvciA9IHBhcmFtcy5jb2xvciB8fCBbMSwgMCwgMF07IC8vIERlZmF1bHQgdG8gcmVkLlxuXHRcdFx0cHJvZ3JhbS5zZXRVbmlmb3JtKCd1X2NvbG9yJywgY29sb3IsIEZMT0FUKTtcblx0XHR9XG5cdFx0Y29uc3QgZ2xQcm9ncmFtID0gcHJvZ3JhbS5pbmRleGVkTGluZXNQcm9ncmFtITtcblxuXHRcdC8vIEFkZCBwb3NpdGlvbkxheWVyIHRvIGVuZCBvZiBpbnB1dCBpZiBuZWVkZWQuXG5cdFx0Y29uc3QgaW5wdXQgPSB0aGlzLmFkZExheWVyVG9JbnB1dHMocG9zaXRpb25zLCBwYXJhbXMuaW5wdXQpO1xuXG5cdFx0Ly8gRG8gc2V0dXAgLSB0aGlzIG11c3QgY29tZSBmaXJzdC5cblx0XHR0aGlzLmRyYXdTZXR1cChnbFByb2dyYW0sIGZhbHNlLCBpbnB1dCwgb3V0cHV0KTtcblxuXHRcdGNvbnN0IGNvdW50ID0gcGFyYW1zLmNvdW50ID8gcGFyYW1zLmNvdW50IDogaW5kaWNlcy5sZW5ndGg7XG5cblx0XHQvLyBVcGRhdGUgdW5pZm9ybXMgYW5kIGJ1ZmZlcnMuXG5cdFx0cHJvZ3JhbS5zZXRWZXJ0ZXhVbmlmb3JtKGdsUHJvZ3JhbSwgJ3VfaW50ZXJuYWxfcG9zaXRpb25zJywgaW5wdXQuaW5kZXhPZihwb3NpdGlvbnMpLCBJTlQpO1xuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3NjYWxlJywgWzEgLyB3aWR0aCwgMSAvIGhlaWdodF0sIEZMT0FUKTtcblx0XHQvLyBUZWxsIHdoZXRoZXIgd2UgYXJlIHVzaW5nIGFuIGFic29sdXRlIHBvc2l0aW9uICgyIGNvbXBvbmVudHMpLCBvciBwb3NpdGlvbiB3aXRoIGFjY3VtdWxhdGlvbiBidWZmZXIgKDQgY29tcG9uZW50cywgYmV0dGVyIGZsb2F0aW5nIHB0IGFjY3VyYWN5KS5cblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF9wb3NpdGlvbldpdGhBY2N1bXVsYXRpb24nLCBwb3NpdGlvbnMubnVtQ29tcG9uZW50cyA9PT0gNCA/IDEgOiAwLCBJTlQpO1xuXHRcdGNvbnN0IHBvc2l0aW9uTGF5ZXJEaW1lbnNpb25zID0gcG9zaXRpb25zLmdldERpbWVuc2lvbnMoKTtcblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF9wb3NpdGlvbnNEaW1lbnNpb25zJywgcG9zaXRpb25MYXllckRpbWVuc2lvbnMsIEZMT0FUKTtcblx0XHRwcm9ncmFtLnNldFZlcnRleFVuaWZvcm0oZ2xQcm9ncmFtLCAndV9pbnRlcm5hbF93cmFwWCcsIHBhcmFtcy53cmFwWCA/IDEgOiAwLCBJTlQpO1xuXHRcdHByb2dyYW0uc2V0VmVydGV4VW5pZm9ybShnbFByb2dyYW0sICd1X2ludGVybmFsX3dyYXBZJywgcGFyYW1zLndyYXBZID8gMSA6IDAsIElOVCk7XG5cdFx0aWYgKHRoaXMuaW5kZXhlZExpbmVzSW5kZXhCdWZmZXIgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Ly8gSGF2ZSB0byB1c2UgZmxvYXQzMiBhcnJheSBiYyBpbnQgaXMgbm90IHN1cHBvcnRlZCBhcyBhIHZlcnRleCBhdHRyaWJ1dGUgdHlwZS5cblx0XHRcdGxldCBmbG9hdEFycmF5OiBGbG9hdDMyQXJyYXk7XG5cdFx0XHRpZiAoaW5kaWNlcy5jb25zdHJ1Y3RvciAhPT0gRmxvYXQzMkFycmF5KSB7XG5cdFx0XHRcdC8vIEhhdmUgdG8gdXNlIGZsb2F0MzIgYXJyYXkgYmMgaW50IGlzIG5vdCBzdXBwb3J0ZWQgYXMgYSB2ZXJ0ZXggYXR0cmlidXRlIHR5cGUuXG5cdFx0XHRcdGZsb2F0QXJyYXkgPSBuZXcgRmxvYXQzMkFycmF5KGluZGljZXMubGVuZ3RoKTtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG5cdFx0XHRcdFx0ZmxvYXRBcnJheVtpXSA9IGluZGljZXNbaV07XG5cdFx0XHRcdH1cblx0XHRcdFx0Y29uc29sZS53YXJuKGBDb252ZXJ0aW5nIGluZGljZXMgYXJyYXkgb2YgdHlwZSAke2luZGljZXMuY29uc3RydWN0b3J9IHRvIEZsb2F0MzJBcnJheSBpbiBXZWJHTENvbXB1dGUuZHJhd0luZGV4ZWRMaW5lcyBmb3IgV2ViR0wgY29tcGF0aWJpbGl0eSwgeW91IG1heSB3YW50IHRvIHVzZSBhIEZsb2F0MzJBcnJheSB0byBzdG9yZSB0aGlzIGluZm9ybWF0aW9uIHNvIHRoZSBjb252ZXJzaW9uIGlzIG5vdCByZXF1aXJlZC5gKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZsb2F0QXJyYXkgPSBpbmRpY2VzIGFzIEZsb2F0MzJBcnJheTtcblx0XHRcdH1cblx0XHRcdHRoaXMuaW5kZXhlZExpbmVzSW5kZXhCdWZmZXIgPSB0aGlzLmluaXRWZXJ0ZXhCdWZmZXIoZmxvYXRBcnJheSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLmluZGV4ZWRMaW5lc0luZGV4QnVmZmVyISk7XG5cdFx0XHQvLyBDb3B5IGJ1ZmZlciBkYXRhLlxuXHRcdFx0Z2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsIGluZGljZXMsIGdsLlNUQVRJQ19EUkFXKTtcblx0XHR9XG5cdFx0dGhpcy5zZXRJbmRleEF0dHJpYnV0ZShnbFByb2dyYW0sIHByb2dyYW0ubmFtZSk7XG5cblx0XHQvLyBEcmF3LlxuXHRcdHRoaXMuc2V0QmxlbmRNb2RlKHBhcmFtcy5zaG91bGRCbGVuZEFscGhhKTtcblx0XHRnbC5kcmF3QXJyYXlzKGdsLkxJTkVTLCAwLCBjb3VudCk7XG5cdFx0Z2wuZGlzYWJsZShnbC5CTEVORCk7XG5cdH1cblx0XG5cdGdldENvbnRleHQoKSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2w7XG5cdH1cblxuXHRnZXRWYWx1ZXMoZGF0YUxheWVyOiBEYXRhTGF5ZXIpIHtcblx0XHRjb25zdCB7IGdsLCBnbHNsVmVyc2lvbiB9ID0gdGhpcztcblxuXHRcdC8vIEluIGNhc2UgZGF0YUxheWVyIHdhcyBub3QgdGhlIGxhc3Qgb3V0cHV0IHdyaXR0ZW4gdG8uXG5cdFx0ZGF0YUxheWVyLl9iaW5kT3V0cHV0QnVmZmVyKCk7XG5cblx0XHRjb25zdCBbIHdpZHRoLCBoZWlnaHQgXSA9IGRhdGFMYXllci5nZXREaW1lbnNpb25zKCk7XG5cdFx0bGV0IHsgZ2xOdW1DaGFubmVscywgZ2xUeXBlLCBnbEZvcm1hdCwgaW50ZXJuYWxUeXBlIH0gPSBkYXRhTGF5ZXI7XG5cdFx0bGV0IHZhbHVlcztcblx0XHRzd2l0Y2ggKGludGVybmFsVHlwZSkge1xuXHRcdFx0Y2FzZSBIQUxGX0ZMT0FUOlxuXHRcdFx0XHRpZiAoZ2wuRkxPQVQgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdC8vIEZpcmVmb3ggcmVxdWlyZXMgdGhhdCBSR0JBL0ZMT0FUIGlzIHVzZWQgZm9yIHJlYWRQaXhlbHMgb2YgZmxvYXQxNiB0eXBlcy5cblx0XHRcdFx0XHRnbE51bUNoYW5uZWxzID0gNDtcblx0XHRcdFx0XHRnbEZvcm1hdCA9IGdsLlJHQkE7XG5cdFx0XHRcdFx0Z2xUeXBlID0gZ2wuRkxPQVQ7XG5cdFx0XHRcdFx0dmFsdWVzID0gbmV3IEZsb2F0MzJBcnJheSh3aWR0aCAqIGhlaWdodCAqIGdsTnVtQ2hhbm5lbHMpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHZhbHVlcyA9IG5ldyBVaW50MTZBcnJheSh3aWR0aCAqIGhlaWdodCAqIGdsTnVtQ2hhbm5lbHMpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIC8vIFRoZSBmb2xsb3dpbmcgd29ya3MgaW4gQ2hyb21lLlxuXHRcdFx0XHQvLyB2YWx1ZXMgPSBuZXcgVWludDE2QXJyYXkod2lkdGggKiBoZWlnaHQgKiBnbE51bUNoYW5uZWxzKTtcblx0XHRcdFx0YnJlYWtcblx0XHRcdGNhc2UgRkxPQVQ6XG5cdFx0XHRcdC8vIENocm9tZSBhbmQgRmlyZWZveCByZXF1aXJlIHRoYXQgUkdCQS9GTE9BVCBpcyB1c2VkIGZvciByZWFkUGl4ZWxzIG9mIGZsb2F0MzIgdHlwZXMuXG5cdFx0XHRcdC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9LaHJvbm9zR3JvdXAvV2ViR0wvaXNzdWVzLzI3NDdcblx0XHRcdFx0Z2xOdW1DaGFubmVscyA9IDQ7XG5cdFx0XHRcdGdsRm9ybWF0ID0gZ2wuUkdCQTtcblx0XHRcdFx0dmFsdWVzID0gbmV3IEZsb2F0MzJBcnJheSh3aWR0aCAqIGhlaWdodCAqIGdsTnVtQ2hhbm5lbHMpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgVU5TSUdORURfQllURTpcblx0XHRcdFx0aWYgKGdsc2xWZXJzaW9uID09PSBHTFNMMSkge1xuXHRcdFx0XHRcdC8vIEZpcmVmb3ggcmVxdWlyZXMgdGhhdCBSR0JBL1VOU0lHTkVEX0JZVEUgaXMgdXNlZCBmb3IgcmVhZFBpeGVscyBvZiB1bnNpZ25lZCBieXRlIHR5cGVzLlxuXHRcdFx0XHRcdGdsTnVtQ2hhbm5lbHMgPSA0O1xuXHRcdFx0XHRcdGdsRm9ybWF0ID0gZ2wuUkdCQTtcblx0XHRcdFx0XHR2YWx1ZXMgPSBuZXcgVWludDhBcnJheSh3aWR0aCAqIGhlaWdodCAqIGdsTnVtQ2hhbm5lbHMpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIEZpcmVmb3ggcmVxdWlyZXMgdGhhdCBSR0JBX0lOVEVHRVIvVU5TSUdORURfSU5UIGlzIHVzZWQgZm9yIHJlYWRQaXhlbHMgb2YgdW5zaWduZWQgaW50IHR5cGVzLlxuXHRcdFx0XHRnbE51bUNoYW5uZWxzID0gNDtcblx0XHRcdFx0Z2xGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkdCQV9JTlRFR0VSO1xuXHRcdFx0XHRnbFR5cGUgPSBnbC5VTlNJR05FRF9JTlQ7XG5cdFx0XHRcdHZhbHVlcyA9IG5ldyBVaW50MzJBcnJheSh3aWR0aCAqIGhlaWdodCAqIGdsTnVtQ2hhbm5lbHMpO1xuXHRcdFx0XHQvLyAvLyBUaGUgZm9sbG93aW5nIHdvcmtzIGluIENocm9tZS5cblx0XHRcdFx0Ly8gdmFsdWVzID0gbmV3IFVpbnQ4QXJyYXkod2lkdGggKiBoZWlnaHQgKiBnbE51bUNoYW5uZWxzKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFVOU0lHTkVEX1NIT1JUOlxuXHRcdFx0XHQvLyBGaXJlZm94IHJlcXVpcmVzIHRoYXQgUkdCQV9JTlRFR0VSL1VOU0lHTkVEX0lOVCBpcyB1c2VkIGZvciByZWFkUGl4ZWxzIG9mIHVuc2lnbmVkIGludCB0eXBlcy5cblx0XHRcdFx0Z2xOdW1DaGFubmVscyA9IDQ7XG5cdFx0XHRcdGdsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHQkFfSU5URUdFUjtcblx0XHRcdFx0Z2xUeXBlID0gZ2wuVU5TSUdORURfSU5UO1xuXHRcdFx0XHR2YWx1ZXMgPSBuZXcgVWludDMyQXJyYXkod2lkdGggKiBoZWlnaHQgKiBnbE51bUNoYW5uZWxzKTtcblx0XHRcdFx0Ly8gLy8gVGhlIGZvbGxvd2luZyB3b3JrcyBpbiBDaHJvbWUuXG5cdFx0XHRcdC8vIHZhbHVlcyA9IG5ldyBVaW50MTZBcnJheSh3aWR0aCAqIGhlaWdodCAqIGdsTnVtQ2hhbm5lbHMpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgVU5TSUdORURfSU5UOlxuXHRcdFx0XHQvLyBGaXJlZm94IHJlcXVpcmVzIHRoYXQgUkdCQV9JTlRFR0VSL1VOU0lHTkVEX0lOVCBpcyB1c2VkIGZvciByZWFkUGl4ZWxzIG9mIHVuc2lnbmVkIGludCB0eXBlcy5cblx0XHRcdFx0Z2xOdW1DaGFubmVscyA9IDQ7XG5cdFx0XHRcdGdsRm9ybWF0ID0gKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLlJHQkFfSU5URUdFUjtcblx0XHRcdFx0dmFsdWVzID0gbmV3IFVpbnQzMkFycmF5KHdpZHRoICogaGVpZ2h0ICogZ2xOdW1DaGFubmVscyk7XG5cdFx0XHRcdC8vIC8vIFRoZSBmb2xsb3dpbmcgd29ya3MgaW4gQ2hyb21lLlxuXHRcdFx0XHQvLyB2YWx1ZXMgPSBuZXcgVWludDMyQXJyYXkod2lkdGggKiBoZWlnaHQgKiBnbE51bUNoYW5uZWxzKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIEJZVEU6XG5cdFx0XHRcdC8vIEZpcmVmb3ggcmVxdWlyZXMgdGhhdCBSR0JBX0lOVEVHRVIvSU5UIGlzIHVzZWQgZm9yIHJlYWRQaXhlbHMgb2YgaW50IHR5cGVzLlxuXHRcdFx0XHRnbE51bUNoYW5uZWxzID0gNDtcblx0XHRcdFx0Z2xGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkdCQV9JTlRFR0VSO1xuXHRcdFx0XHRnbFR5cGUgPSBnbC5JTlQ7XG5cdFx0XHRcdHZhbHVlcyA9IG5ldyBJbnQzMkFycmF5KHdpZHRoICogaGVpZ2h0ICogZ2xOdW1DaGFubmVscyk7XG5cdFx0XHRcdC8vIC8vIFRoZSBmb2xsb3dpbmcgd29ya3MgaW4gQ2hyb21lLlxuXHRcdFx0XHQvLyB2YWx1ZXMgPSBuZXcgSW50OEFycmF5KHdpZHRoICogaGVpZ2h0ICogZ2xOdW1DaGFubmVscyk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBTSE9SVDpcblx0XHRcdFx0Ly8gRmlyZWZveCByZXF1aXJlcyB0aGF0IFJHQkFfSU5URUdFUi9JTlQgaXMgdXNlZCBmb3IgcmVhZFBpeGVscyBvZiBpbnQgdHlwZXMuXG5cdFx0XHRcdGdsTnVtQ2hhbm5lbHMgPSA0O1xuXHRcdFx0XHRnbEZvcm1hdCA9IChnbCBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KS5SR0JBX0lOVEVHRVI7XG5cdFx0XHRcdGdsVHlwZSA9IGdsLklOVDtcblx0XHRcdFx0dmFsdWVzID0gbmV3IEludDMyQXJyYXkod2lkdGggKiBoZWlnaHQgKiBnbE51bUNoYW5uZWxzKTtcblx0XHRcdFx0Ly8gLy8gVGhlIGZvbGxvd2luZyB3b3JrcyBpbiBDaHJvbWUuXG5cdFx0XHRcdC8vIHZhbHVlcyA9IG5ldyBJbnQxNkFycmF5KHdpZHRoICogaGVpZ2h0ICogZ2xOdW1DaGFubmVscyk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBJTlQ6XG5cdFx0XHRcdC8vIEZpcmVmb3ggcmVxdWlyZXMgdGhhdCBSR0JBX0lOVEVHRVIvSU5UIGlzIHVzZWQgZm9yIHJlYWRQaXhlbHMgb2YgaW50IHR5cGVzLlxuXHRcdFx0XHRnbE51bUNoYW5uZWxzID0gNDtcblx0XHRcdFx0Z2xGb3JtYXQgPSAoZ2wgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkuUkdCQV9JTlRFR0VSO1xuXHRcdFx0XHR2YWx1ZXMgPSBuZXcgSW50MzJBcnJheSh3aWR0aCAqIGhlaWdodCAqIGdsTnVtQ2hhbm5lbHMpO1xuXHRcdFx0XHQvLyAvLyBUaGUgZm9sbG93aW5nIHdvcmtzIGluIENocm9tZS5cblx0XHRcdFx0Ly8gdmFsdWVzID0gbmV3IEludDMyQXJyYXkod2lkdGggKiBoZWlnaHQgKiBnbE51bUNoYW5uZWxzKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGludGVybmFsVHlwZSAke2ludGVybmFsVHlwZX0gZm9yIGdldFZhbHVlcygpLmApO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLnJlYWR5VG9SZWFkKCkpIHtcblx0XHRcdC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9XZWJHTFJlbmRlcmluZ0NvbnRleHQvcmVhZFBpeGVsc1xuXHRcdFx0Z2wucmVhZFBpeGVscygwLCAwLCB3aWR0aCwgaGVpZ2h0LCBnbEZvcm1hdCwgZ2xUeXBlLCB2YWx1ZXMpO1xuXHRcdFx0Y29uc3QgeyBudW1Db21wb25lbnRzLCB0eXBlIH0gPSBkYXRhTGF5ZXI7XG5cdFx0XHRjb25zdCBPVVRQVVRfTEVOR1RIID0gd2lkdGggKiBoZWlnaHQgKiBudW1Db21wb25lbnRzO1xuXG5cdFx0XHQvLyBDb252ZXJ0IHVpbnQxNiB0byBmbG9hdDMyIGlmIG5lZWRlZC5cblx0XHRcdGNvbnN0IGhhbmRsZUZsb2F0MTZDb252ZXJzaW9uID0gaW50ZXJuYWxUeXBlID09PSBIQUxGX0ZMT0FUICYmIHZhbHVlcy5jb25zdHJ1Y3RvciA9PT0gVWludDE2QXJyYXk7XG5cdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRjb25zdCB2aWV3ID0gaGFuZGxlRmxvYXQxNkNvbnZlcnNpb24gPyBuZXcgRGF0YVZpZXcoKHZhbHVlcyBhcyBVaW50MTZBcnJheSkuYnVmZmVyKSA6IHVuZGVmaW5lZDtcblxuXHRcdFx0bGV0IG91dHB1dDogRGF0YUxheWVyQXJyYXlUeXBlID0gdmFsdWVzO1xuXHRcdFx0XG5cdFx0XHQvLyBXZSBtYXkgdXNlIGEgZGlmZmVyZW50IGludGVybmFsIHR5cGUgdGhhbiB0aGUgYXNzaWduZWQgdHlwZSBvZiB0aGUgRGF0YUxheWVyLlxuXHRcdFx0aWYgKGludGVybmFsVHlwZSAhPT0gdHlwZSkge1xuXHRcdFx0XHRzd2l0Y2ggKHR5cGUpIHtcblx0XHRcdFx0XHRjYXNlIEhBTEZfRkxPQVQ6XG5cdFx0XHRcdFx0Y2FzZSBGTE9BVDpcblx0XHRcdFx0XHRcdG91dHB1dCA9IG5ldyBGbG9hdDMyQXJyYXkoT1VUUFVUX0xFTkdUSCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIFVOU0lHTkVEX0JZVEU6XG5cdFx0XHRcdFx0XHRvdXRwdXQgPSBuZXcgVWludDhBcnJheShPVVRQVVRfTEVOR1RIKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgQllURTpcblx0XHRcdFx0XHRcdG91dHB1dCA9IG5ldyBJbnQ4QXJyYXkoT1VUUFVUX0xFTkdUSCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIFVOU0lHTkVEX1NIT1JUOlxuXHRcdFx0XHRcdFx0b3V0cHV0ID0gbmV3IFVpbnQxNkFycmF5KE9VVFBVVF9MRU5HVEgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBTSE9SVDpcblx0XHRcdFx0XHRcdG91dHB1dCA9IG5ldyBJbnQxNkFycmF5KE9VVFBVVF9MRU5HVEgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBVTlNJR05FRF9JTlQ6XG5cdFx0XHRcdFx0XHRvdXRwdXQgPSBuZXcgVWludDMyQXJyYXkoT1VUUFVUX0xFTkdUSCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIElOVDpcblx0XHRcdFx0XHRcdG91dHB1dCA9IG5ldyBJbnQzMkFycmF5KE9VVFBVVF9MRU5HVEgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgdHlwZSAke3R5cGV9IGZvciBnZXRWYWx1ZXMoKS5gKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBJbiBzb21lIGNhc2VzIGdsTnVtQ2hhbm5lbHMgbWF5IGJlID4gbnVtQ29tcG9uZW50cy5cblx0XHRcdGlmIChoYW5kbGVGbG9hdDE2Q29udmVyc2lvbiB8fCBvdXRwdXQgIT09IHZhbHVlcyB8fCBudW1Db21wb25lbnRzICE9PSBnbE51bUNoYW5uZWxzKSB7XG5cdFx0XHRcdGZvciAobGV0IGkgPSAwLCBsZW5ndGggPSB3aWR0aCAqIGhlaWdodDsgaSA8IGxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0Y29uc3QgaW5kZXgxID0gaSAqIGdsTnVtQ2hhbm5lbHM7XG5cdFx0XHRcdFx0Y29uc3QgaW5kZXgyID0gaSAqIG51bUNvbXBvbmVudHM7XG5cdFx0XHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCBudW1Db21wb25lbnRzOyBqKyspIHtcblx0XHRcdFx0XHRcdGlmIChoYW5kbGVGbG9hdDE2Q29udmVyc2lvbikge1xuXHRcdFx0XHRcdFx0XHRvdXRwdXRbaW5kZXgyICsgal0gPSBnZXRGbG9hdDE2KHZpZXchLCAyICogKGluZGV4MSArIGopLCB0cnVlKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdG91dHB1dFtpbmRleDIgKyBqXSA9IHZhbHVlc1tpbmRleDEgKyBqXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKG91dHB1dC5sZW5ndGggIT09IE9VVFBVVF9MRU5HVEgpIHtcblx0XHRcdFx0b3V0cHV0ID0gb3V0cHV0LnNsaWNlKDAsIE9VVFBVVF9MRU5HVEgpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG91dHB1dDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gcmVhZCB2YWx1ZXMgZnJvbSBCdWZmZXIgd2l0aCBzdGF0dXM6ICR7Z2wuY2hlY2tGcmFtZWJ1ZmZlclN0YXR1cyhnbC5GUkFNRUJVRkZFUil9LmApO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgcmVhZHlUb1JlYWQoKSB7XG5cdFx0Y29uc3QgeyBnbCB9ID0gdGhpcztcblx0XHRyZXR1cm4gZ2wuY2hlY2tGcmFtZWJ1ZmZlclN0YXR1cyhnbC5GUkFNRUJVRkZFUikgPT0gZ2wuRlJBTUVCVUZGRVJfQ09NUExFVEU7XG5cdH07XG5cblx0c2F2ZVBORyhkYXRhTGF5ZXI6IERhdGFMYXllciwgZmlsZW5hbWUgPSBkYXRhTGF5ZXIubmFtZSwgZHBpPzogbnVtYmVyKSB7XG5cdFx0Y29uc3QgdmFsdWVzID0gdGhpcy5nZXRWYWx1ZXMoZGF0YUxheWVyKTtcblx0XHRjb25zdCBbd2lkdGgsIGhlaWdodF0gPSBkYXRhTGF5ZXIuZ2V0RGltZW5zaW9ucygpO1xuXG5cdFx0Y29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG5cdFx0Y2FudmFzLndpZHRoID0gd2lkdGg7XG4gICAgXHRjYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xuXHRcdGNvbnN0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKSE7XG5cdFx0Y29uc3QgaW1hZ2VEYXRhID0gY29udGV4dC5nZXRJbWFnZURhdGEoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG5cdFx0Y29uc3QgYnVmZmVyID0gaW1hZ2VEYXRhLmRhdGE7XG5cdFx0Ly8gVE9ETzogdGhpcyBpc24ndCB3b3JraW5nIGZvciBVTlNJR05FRF9CWVRFIHR5cGVzP1xuXHRcdGNvbnN0IGlzRmxvYXQgPSBkYXRhTGF5ZXIudHlwZSA9PT0gRkxPQVQgfHwgZGF0YUxheWVyLnR5cGUgPT09IEhBTEZfRkxPQVQ7XG5cdFx0Ly8gSGF2ZSB0byBmbGlwIHRoZSB5IGF4aXMgc2luY2UgUE5HcyBhcmUgd3JpdHRlbiB0b3AgdG8gYm90dG9tLlxuXHRcdGZvciAobGV0IHkgPSAwOyB5IDwgaGVpZ2h0OyB5KyspIHtcblx0XHRcdGZvciAobGV0IHggPSAwOyB4IDwgd2lkdGg7IHgrKykge1xuXHRcdFx0XHRjb25zdCBpbmRleCA9IHkgKiB3aWR0aCArIHg7XG5cdFx0XHRcdGNvbnN0IGluZGV4RmxpcHBlZCA9IChoZWlnaHQgLSAxIC0geSkgKiB3aWR0aCArIHg7XG5cdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YUxheWVyLm51bUNvbXBvbmVudHM7IGkrKykge1xuXHRcdFx0XHRcdGJ1ZmZlcls0ICogaW5kZXhGbGlwcGVkICsgaV0gPSB2YWx1ZXNbZGF0YUxheWVyLm51bUNvbXBvbmVudHMgKiBpbmRleCArIGldICogKGlzRmxvYXQgPyAyNTUgOiAxKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoZGF0YUxheWVyLm51bUNvbXBvbmVudHMgPCA0KSB7XG5cdFx0XHRcdFx0YnVmZmVyWzQgKiBpbmRleEZsaXBwZWQgKyAzXSA9IDI1NTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHQvLyBjb25zb2xlLmxvZyh2YWx1ZXMsIGJ1ZmZlcik7XG5cdFx0Y29udGV4dC5wdXRJbWFnZURhdGEoaW1hZ2VEYXRhLCAwLCAwKTtcblxuXHRcdGNhbnZhcyEudG9CbG9iKChibG9iKSA9PiB7XG5cdFx0XHRpZiAoIWJsb2IpIHtcblx0XHRcdFx0Y29uc29sZS53YXJuKCdQcm9ibGVtIHNhdmluZyBQTkcsIHVuYWJsZSB0byBpbml0IGJsb2IuJyk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGlmIChkcGkpIHtcblx0XHRcdFx0Y2hhbmdlRHBpQmxvYihibG9iLCBkcGkpLnRoZW4oKGJsb2I6IEJsb2IpID0+e1xuXHRcdFx0XHRcdHNhdmVBcyhibG9iLCBgJHtmaWxlbmFtZX0ucG5nYCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c2F2ZUFzKGJsb2IsIGAke2ZpbGVuYW1lfS5wbmdgKTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdH0sICdpbWFnZS9wbmcnKTtcblx0fVxuXG4gICAgcmVzZXQoKSB7XG5cdFx0Ly8gVE9ETzogaW1wbGVtZW50IHRoaXMuXG5cdFx0dGhyb3cgbmV3IEVycm9yKCdXZWJHTENvbXB1dGUucmVzZXQoKSBub3QgaW1wbGVtZW50ZWQuJyk7XG5cdH07XG5cblx0YXR0YWNoRGF0YUxheWVyVG9UaHJlZVRleHR1cmUoZGF0YUxheWVyOiBEYXRhTGF5ZXIsIHRleHR1cmU6IFRleHR1cmUpIHtcblx0XHRpZiAoIXRoaXMucmVuZGVyZXIpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignV2ViR0xDb21wdXRlIHdhcyBub3QgaW5pdGVkIHdpdGggYSByZW5kZXJlci4nKTtcblx0XHR9XG5cdFx0Ly8gTGluayB3ZWJnbCB0ZXh0dXJlIHRvIHRocmVlanMgb2JqZWN0LlxuXHRcdC8vIFRoaXMgaXMgbm90IG9mZmljaWFsbHkgc3VwcG9ydGVkLlxuXHRcdGlmIChkYXRhTGF5ZXIubnVtQnVmZmVycyA+IDEpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgRGF0YUxheWVyIFwiJHtkYXRhTGF5ZXIubmFtZX1cIiBjb250YWlucyBtdWx0aXBsZSBXZWJHTCB0ZXh0dXJlcyAob25lIGZvciBlYWNoIGJ1ZmZlcikgdGhhdCBhcmUgZmxpcC1mbG9wcGVkIGR1cmluZyBjb21wdXRlIGN5Y2xlcywgcGxlYXNlIGNob29zZSBhIERhdGFMYXllciB3aXRoIG9uZSBidWZmZXIuYCk7XG5cdFx0fVxuXHRcdGNvbnN0IG9mZnNldFRleHR1cmVQcm9wZXJ0aWVzID0gdGhpcy5yZW5kZXJlci5wcm9wZXJ0aWVzLmdldCh0ZXh0dXJlKTtcblx0XHRvZmZzZXRUZXh0dXJlUHJvcGVydGllcy5fX3dlYmdsVGV4dHVyZSA9IGRhdGFMYXllci5nZXRDdXJyZW50U3RhdGVUZXh0dXJlKCk7XG5cdFx0b2Zmc2V0VGV4dHVyZVByb3BlcnRpZXMuX193ZWJnbEluaXQgPSB0cnVlO1xuXHR9XG5cblx0cmVzZXRUaHJlZVN0YXRlKCkge1xuXHRcdGlmICghdGhpcy5yZW5kZXJlcikge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdXZWJHTENvbXB1dGUgd2FzIG5vdCBpbml0ZWQgd2l0aCBhIHJlbmRlcmVyLicpO1xuXHRcdH1cblx0XHRjb25zdCB7IGdsIH0gPSB0aGlzO1xuXHRcdC8vIFJlc2V0IHZpZXdwb3J0LlxuXHRcdGNvbnN0IHZpZXdwb3J0ID0gdGhpcy5yZW5kZXJlci5nZXRWaWV3cG9ydChuZXcgdXRpbHMuVmVjdG9yNCgpIGFzIFZlY3RvcjQpO1xuXHRcdGdsLnZpZXdwb3J0KHZpZXdwb3J0LngsIHZpZXdwb3J0LnksIHZpZXdwb3J0LndpZHRoLCB2aWV3cG9ydC5oZWlnaHQpO1xuXHRcdC8vIFVuYmluZCBmcmFtZWJ1ZmZlciAocmVuZGVyIHRvIHNjcmVlbikuXG5cdFx0dGhpcy5yZW5kZXJlci5zZXRSZW5kZXJUYXJnZXQobnVsbCk7XG5cdFx0Ly8gUmVzZXQgdGV4dHVyZSBiaW5kaW5ncy5cblx0XHR0aGlzLnJlbmRlcmVyLnJlc2V0U3RhdGUoKTtcblx0fVxuXHRcblx0ZGVzdHJveSgpIHtcblx0XHQvLyBUT0RPOiBOZWVkIHRvIGltcGxlbWVudCB0aGlzLlxuXHRcdGRlbGV0ZSB0aGlzLnJlbmRlcmVyO1xuXHR9XG59IiwiY29uc3QgZXh0ZW5zaW9uczogeyBba2V5OiBzdHJpbmddOiBhbnkgfSA9IHt9O1xuXG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvT0VTX3RleHR1cmVfZmxvYXRcbi8vIEZsb2F0IGlzIHByb3ZpZGVkIGJ5IGRlZmF1bHQgaW4gV2ViR0wyIGNvbnRleHRzLlxuLy8gVGhpcyBleHRlbnNpb24gaW1wbGljaXRseSBlbmFibGVzIHRoZSBXRUJHTF9jb2xvcl9idWZmZXJfZmxvYXQgZXh0ZW5zaW9uIChpZiBzdXBwb3J0ZWQpLCB3aGljaCBhbGxvd3MgcmVuZGVyaW5nIHRvIDMyLWJpdCBmbG9hdGluZy1wb2ludCBjb2xvciBidWZmZXJzLlxuZXhwb3J0IGNvbnN0IE9FU19URVhUVVJFX0ZMT0FUID0gJ09FU190ZXh0dXJlX2Zsb2F0Jztcbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9PRVNfdGV4dHVyZV9oYWxmX2Zsb2F0XG4vLyBIYWxmIGZsb2F0IGlzIHN1cHBvcnRlZCBieSBtb2Rlcm4gbW9iaWxlIGJyb3dzZXJzLCBmbG9hdCBub3QgeWV0IHN1cHBvcnRlZC5cbi8vIEhhbGYgZmxvYXQgaXMgcHJvdmlkZWQgYnkgZGVmYXVsdCBmb3IgV2ViZ2wyIGNvbnRleHRzLlxuLy8gVGhpcyBleHRlbnNpb24gaW1wbGljaXRseSBlbmFibGVzIHRoZSBFWFRfY29sb3JfYnVmZmVyX2hhbGZfZmxvYXQgZXh0ZW5zaW9uIChpZiBzdXBwb3J0ZWQpLCB3aGljaCBhbGxvd3MgcmVuZGVyaW5nIHRvIDE2LWJpdCBmbG9hdGluZyBwb2ludCBmb3JtYXRzLlxuZXhwb3J0IGNvbnN0IE9FU19URVhUVVJFX0hBTEZfRkxPQVQgPSAnT0VTX3RleHR1cmVfaGFsZl9mbG9hdCc7XG4vLyBUT0RPOiBTZWVtcyBsaWtlIGxpbmVhciBmaWx0ZXJpbmcgb2YgZmxvYXRzIG1heSBiZSBzdXBwb3J0ZWQgaW4gc29tZSBicm93c2VycyB3aXRob3V0IHRoZXNlIGV4dGVuc2lvbnM/XG4vLyBodHRwczovL3d3dy5raHJvbm9zLm9yZy9yZWdpc3RyeS9PcGVuR0wvZXh0ZW5zaW9ucy9PRVMvT0VTX3RleHR1cmVfZmxvYXRfbGluZWFyLnR4dFxuZXhwb3J0IGNvbnN0IE9FU19URVhUVVJFX0ZMT0FUX0xJTkVBUiA9ICdPRVNfdGV4dHVyZV9mbG9hdF9saW5lYXInO1xuZXhwb3J0IGNvbnN0IE9FU19URVhUVVJFX0hBbEZfRkxPQVRfTElORUFSID0gJ09FU190ZXh0dXJlX2hhbGZfZmxvYXRfbGluZWFyJztcbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9XRUJHTF9kZXB0aF90ZXh0dXJlXG4vLyBBZGRzIGdsLlVOU0lHTkVEX1NIT1JULCBnbC5VTlNJR05FRF9JTlQgdHlwZXMgdG8gdGV4dEltYWdlMkQgaW4gV2ViR0wxLjBcbmV4cG9ydCBjb25zdCBXRUJHTF9ERVBUSF9URVhUVVJFID0gJ1dFQkdMX2RlcHRoX3RleHR1cmUnO1xuLy8gRVhUX0NPTE9SX0JVRkZFUl9GTE9BVCBhZGRzIGFiaWxpdHkgdG8gcmVuZGVyIHRvIGEgdmFyaWV0eSBvZiBmbG9hdGluZyBwdCB0ZXh0dXJlcy5cbi8vIFRoaXMgaXMgbmVlZGVkIGZvciB0aGUgV2ViR0wyIGNvbnRleHRzIHRoYXQgZG8gbm90IHN1cHBvcnQgT0VTX1RFWFRVUkVfRkxPQVQgLyBPRVNfVEVYVFVSRV9IQUxGX0ZMT0FUIGV4dGVuc2lvbnMuXG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRVhUX2NvbG9yX2J1ZmZlcl9mbG9hdFxuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMzQyNjI0OTMvZnJhbWVidWZmZXItaW5jb21wbGV0ZS1hdHRhY2htZW50LWZvci10ZXh0dXJlLXdpdGgtaW50ZXJuYWwtZm9ybWF0XG4vLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8zNjEwOTM0Ny9mcmFtZWJ1ZmZlci1pbmNvbXBsZXRlLWF0dGFjaG1lbnQtb25seS1oYXBwZW5zLW9uLWFuZHJvaWQtdy1maXJlZm94XG5leHBvcnQgY29uc3QgRVhUX0NPTE9SX0JVRkZFUl9GTE9BVCA9ICdFWFRfY29sb3JfYnVmZmVyX2Zsb2F0JztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEV4dGVuc2lvbihcblx0Z2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCB8IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQsXG5cdGV4dGVuc2lvbk5hbWU6IHN0cmluZyxcblx0ZXJyb3JDYWxsYmFjazogKG1lc3NhZ2U6IHN0cmluZykgPT4gdm9pZCxcblx0b3B0aW9uYWwgPSBmYWxzZSxcbikge1xuXHQvLyBDaGVjayBpZiB3ZSd2ZSBhbHJlYWR5IGxvYWRlZCB0aGUgZXh0ZW5zaW9uLlxuXHRpZiAoZXh0ZW5zaW9uc1tleHRlbnNpb25OYW1lXSAhPT0gdW5kZWZpbmVkKSByZXR1cm4gZXh0ZW5zaW9uc1tleHRlbnNpb25OYW1lXTtcblxuXHRsZXQgZXh0ZW5zaW9uO1xuXHR0cnkge1xuXHRcdGV4dGVuc2lvbiA9IGdsLmdldEV4dGVuc2lvbihleHRlbnNpb25OYW1lKTtcblx0fSBjYXRjaCAoZSkge31cblx0aWYgKGV4dGVuc2lvbikge1xuXHRcdC8vIENhY2hlIHRoaXMgZXh0ZW5zaW9uLlxuXHRcdGV4dGVuc2lvbnNbZXh0ZW5zaW9uTmFtZV0gPSBleHRlbnNpb247XG5cdFx0Y29uc29sZS5sb2coYExvYWRlZCBleHRlbnNpb246ICR7ZXh0ZW5zaW9uTmFtZX0uYCk7XG5cdH0gZWxzZSB7XG5cdFx0ZXh0ZW5zaW9uc1tleHRlbnNpb25OYW1lXSA9IGZhbHNlOyAvLyBDYWNoZSB0aGUgYmFkIGV4dGVuc2lvbiBsb29rdXAuXG5cdFx0Y29uc29sZS53YXJuKGBVbnN1cHBvcnRlZCAke29wdGlvbmFsID8gJ29wdGlvbmFsICcgOiAnJ31leHRlbnNpb246ICR7ZXh0ZW5zaW9uTmFtZX0uYCk7XG5cdH1cblx0Ly8gSWYgdGhlIGV4dGVuc2lvbiBpcyBub3Qgb3B0aW9uYWwsIHRocm93IGVycm9yLlxuXHRpZiAoIWV4dGVuc2lvbiAmJiAhb3B0aW9uYWwpIHtcblx0XHRlcnJvckNhbGxiYWNrKGBSZXF1aXJlZCBleHRlbnNpb24gdW5zdXBwb3J0ZWQgYnkgdGhpcyBkZXZpY2UgLyBicm93c2VyOiAke2V4dGVuc2lvbk5hbWV9LmApO1xuXHR9XG5cdHJldHVybiBleHRlbnNpb247XG59IiwiaW1wb3J0IHsgV2ViR0xDb21wdXRlIH0gZnJvbSAnLi9XZWJHTENvbXB1dGUnO1xuZXhwb3J0ICogZnJvbSAnLi9Db25zdGFudHMnO1xuXG5leHBvcnQge1xuXHRXZWJHTENvbXB1dGUsXG59OyIsIi8vIENvcGllZCBmcm9tIGh0dHA6Ly93ZWJnbGZ1bmRhbWVudGFscy5vcmcvd2ViZ2wvbGVzc29ucy93ZWJnbC1ib2lsZXJwbGF0ZS5odG1sXG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZVNoYWRlcihcblx0Z2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCB8IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQsXG5cdGVycm9yQ2FsbGJhY2s6IChtZXNzYWdlOiBzdHJpbmcpID0+IHZvaWQsXG5cdHNoYWRlclNvdXJjZTogc3RyaW5nLFxuXHRzaGFkZXJUeXBlOiBudW1iZXIsXG5cdHByb2dyYW1OYW1lPzogc3RyaW5nLFxuKSB7XG5cdC8vIENyZWF0ZSB0aGUgc2hhZGVyIG9iamVjdFxuXHRjb25zdCBzaGFkZXIgPSBnbC5jcmVhdGVTaGFkZXIoc2hhZGVyVHlwZSk7XG5cdGlmICghc2hhZGVyKSB7XG5cdFx0ZXJyb3JDYWxsYmFjaygnVW5hYmxlIHRvIGluaXQgZ2wgc2hhZGVyLicpO1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0Ly8gU2V0IHRoZSBzaGFkZXIgc291cmNlIGNvZGUuXG5cdGdsLnNoYWRlclNvdXJjZShzaGFkZXIsIHNoYWRlclNvdXJjZSk7XG5cblx0Ly8gQ29tcGlsZSB0aGUgc2hhZGVyXG5cdGdsLmNvbXBpbGVTaGFkZXIoc2hhZGVyKTtcblxuXHQvLyBDaGVjayBpZiBpdCBjb21waWxlZFxuXHRjb25zdCBzdWNjZXNzID0gZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHNoYWRlciwgZ2wuQ09NUElMRV9TVEFUVVMpO1xuXHRpZiAoIXN1Y2Nlc3MpIHtcblx0XHQvLyBTb21ldGhpbmcgd2VudCB3cm9uZyBkdXJpbmcgY29tcGlsYXRpb24gLSBwcmludCB0aGUgZXJyb3IuXG5cdFx0ZXJyb3JDYWxsYmFjayhgQ291bGQgbm90IGNvbXBpbGUgJHtzaGFkZXJUeXBlID09PSBnbC5GUkFHTUVOVF9TSEFERVIgPyAnZnJhZ21lbnQnIDogJ3ZlcnRleCd9XG5cdFx0XHQgc2hhZGVyJHtwcm9ncmFtTmFtZSA/IGAgZm9yIHByb2dyYW0gXCIke3Byb2dyYW1OYW1lfVwiYCA6ICcnfTogJHtnbC5nZXRTaGFkZXJJbmZvTG9nKHNoYWRlcil9LmApO1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdHJldHVybiBzaGFkZXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1dlYkdMMihnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0IHwgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkge1xuXHQvLyBUaGlzIGNvZGUgaXMgcHVsbGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL21yZG9vYi90aHJlZS5qcy9ibG9iL21hc3Rlci9zcmMvcmVuZGVyZXJzL3dlYmdsL1dlYkdMQ2FwYWJpbGl0aWVzLmpzXG5cdC8vIEB0cy1pZ25vcmVcblx0cmV0dXJuICh0eXBlb2YgV2ViR0wyUmVuZGVyaW5nQ29udGV4dCAhPT0gJ3VuZGVmaW5lZCcgJiYgZ2wgaW5zdGFuY2VvZiBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KSB8fCAodHlwZW9mIFdlYkdMMkNvbXB1dGVSZW5kZXJpbmdDb250ZXh0ICE9PSAndW5kZWZpbmVkJyAmJiBnbCBpbnN0YW5jZW9mIFdlYkdMMkNvbXB1dGVSZW5kZXJpbmdDb250ZXh0KTtcblx0Ly8gcmV0dXJuICEhKGdsIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpLkhBTEZfRkxPQVQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1Bvd2VyT2YyKHZhbHVlOiBudW1iZXIpIHtcblx0cmV0dXJuICh2YWx1ZSAmICh2YWx1ZSAtIDEpKSA9PSAwO1xufSIsIi8vIFRoZXNlIGFyZSB0aGUgcGFydHMgb2YgdGhyZWVqcyBWZWN0b3I0IHRoYXQgd2UgbmVlZC5cbmV4cG9ydCBjbGFzcyBWZWN0b3I0IHtcblx0eDogbnVtYmVyO1xuXHR5OiBudW1iZXI7XG5cdHo6IG51bWJlcjtcblx0dzogbnVtYmVyO1xuXHRjb25zdHJ1Y3RvciggeCA9IDAsIHkgPSAwLCB6ID0gMCwgdyA9IDEgKSB7XG5cdFx0dGhpcy54ID0geDtcblx0XHR0aGlzLnkgPSB5O1xuXHRcdHRoaXMueiA9IHo7XG5cdFx0dGhpcy53ID0gdztcblx0fVxuXHRnZXQgd2lkdGgoKSB7XG5cdFx0cmV0dXJuIHRoaXMuejtcblx0fVxuXHRnZXQgaGVpZ2h0KCkge1xuXHRcdHJldHVybiB0aGlzLnc7XG5cdH1cblx0Y29weSh2OiBWZWN0b3I0KSB7XG5cdFx0dGhpcy54ID0gdi54O1xuXHRcdHRoaXMueSA9IHYueTtcblx0XHR0aGlzLnogPSB2Lno7XG5cdFx0dGhpcy53ID0gdi53O1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG59IiwibW9kdWxlLmV4cG9ydHMgPSBcInByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5cXG52YXJ5aW5nIHZlYzIgdl9VVjtcXG5cXG51bmlmb3JtIHNhbXBsZXIyRCB1X3N0YXRlO1xcblxcbnZvaWQgbWFpbigpIHtcXG5cXHRnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodV9zdGF0ZSwgdl9VVik7XFxufVwiIiwibW9kdWxlLmV4cG9ydHMgPSBcInByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5cXG5hdHRyaWJ1dGUgdmVjMiBhX2ludGVybmFsX3Bvc2l0aW9uO1xcblxcbnVuaWZvcm0gdmVjMiB1X2ludGVybmFsX3NjYWxlO1xcbnVuaWZvcm0gdmVjMiB1X2ludGVybmFsX3RyYW5zbGF0aW9uO1xcblxcbnZhcnlpbmcgdmVjMiB2X1VWX2xvY2FsO1xcbnZhcnlpbmcgdmVjMiB2X1VWO1xcblxcbnZvaWQgbWFpbigpIHtcXG5cXHQvLyBDYWxjdWxhdGUgVVYgY29vcmRpbmF0ZXMgb2YgY3VycmVudCByZW5kZXJlZCBvYmplY3QuXFxuXFx0dl9VVl9sb2NhbCA9IDAuNSAqIChhX2ludGVybmFsX3Bvc2l0aW9uICsgMS4wKTtcXG5cXG5cXHQvLyBBcHBseSB0cmFuc2Zvcm1hdGlvbnMuXFxuXFx0dmVjMiBwb3NpdGlvbiA9IHVfaW50ZXJuYWxfc2NhbGUgKiBhX2ludGVybmFsX3Bvc2l0aW9uICsgdV9pbnRlcm5hbF90cmFuc2xhdGlvbjtcXG5cXG5cXHQvLyBDYWxjdWxhdGUgYSBnbG9iYWwgdXYgZm9yIHRoZSB2aWV3cG9ydC5cXG5cXHR2X1VWID0gMC41ICogKHBvc2l0aW9uICsgMS4wKTtcXG5cXG5cXHQvLyBDYWxjdWxhdGUgdmVydGV4IHBvc2l0aW9uLlxcblxcdGdsX1Bvc2l0aW9uID0gdmVjNChwb3NpdGlvbiwgMCwgMSk7XFxufVwiIiwibW9kdWxlLmV4cG9ydHMgPSBcInByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5wcmVjaXNpb24gaGlnaHAgaW50O1xcblxcbi8qKlxcbiAqIFJldHVybnMgYWNjdXJhdGUgTU9EIHdoZW4gYXJndW1lbnRzIGFyZSBhcHByb3hpbWF0ZSBpbnRlZ2Vycy5cXG4gKi9cXG5mbG9hdCBtb2RJKGZsb2F0IGEsIGZsb2F0IGIpIHtcXG4gICAgZmxvYXQgbSA9IGEgLSBmbG9vcigoYSArIDAuNSkgLyBiKSAqIGI7XFxuICAgIHJldHVybiBmbG9vcihtICsgMC41KTtcXG59XFxuXFxuLy8gQ2Fubm90IHVzZSBpbnQgdmVydGV4IGF0dHJpYnV0ZXM6IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzI3ODc0OTgzL3dlYmdsLWhvdy10by11c2UtaW50ZWdlci1hdHRyaWJ1dGVzLWluLWdsc2xcXG5hdHRyaWJ1dGUgZmxvYXQgYV9pbnRlcm5hbF9pbmRleDsgLy8gSW5kZXggb2YgcG9pbnQuXFxuXFxudW5pZm9ybSBzYW1wbGVyMkQgdV9pbnRlcm5hbF9wb3NpdGlvbnM7IC8vIFRleHR1cmUgbG9va3VwIHdpdGggcG9zaXRpb24gZGF0YS5cXG51bmlmb3JtIHZlYzIgdV9pbnRlcm5hbF9wb3NpdGlvbnNEaW1lbnNpb25zO1xcbnVuaWZvcm0gdmVjMiB1X2ludGVybmFsX3NjYWxlO1xcbnVuaWZvcm0gYm9vbCB1X2ludGVybmFsX3Bvc2l0aW9uV2l0aEFjY3VtdWxhdGlvbjtcXG51bmlmb3JtIGJvb2wgdV9pbnRlcm5hbF93cmFwWDtcXG51bmlmb3JtIGJvb2wgdV9pbnRlcm5hbF93cmFwWTtcXG5cXG52YXJ5aW5nIHZlYzIgdl9VVjtcXG52YXJ5aW5nIHZlYzIgdl9saW5lV3JhcHBpbmc7IC8vIFVzZSB0aGlzIHRvIHRlc3QgaWYgbGluZSBpcyBvbmx5IGhhbGYgd3JhcHBlZCBhbmQgc2hvdWxkIG5vdCBiZSByZW5kZXJlZC5cXG5cXG52b2lkIG1haW4oKSB7XFxuXFx0Ly8gQ2FsY3VsYXRlIGEgdXYgYmFzZWQgb24gdGhlIHBvaW50J3MgaW5kZXggYXR0cmlidXRlLlxcblxcdHZlYzIgcGFydGljbGVVViA9IHZlYzIoXFxuXFx0XFx0bW9kSShhX2ludGVybmFsX2luZGV4LCB1X2ludGVybmFsX3Bvc2l0aW9uc0RpbWVuc2lvbnMueCksXFxuXFx0XFx0Zmxvb3IoZmxvb3IoYV9pbnRlcm5hbF9pbmRleCArIDAuNSkgLyB1X2ludGVybmFsX3Bvc2l0aW9uc0RpbWVuc2lvbnMueClcXG5cXHQpIC8gdV9pbnRlcm5hbF9wb3NpdGlvbnNEaW1lbnNpb25zO1xcblxcblxcdC8vIENhbGN1bGF0ZSBhIGdsb2JhbCB1diBmb3IgdGhlIHZpZXdwb3J0LlxcblxcdC8vIExvb2t1cCB2ZXJ0ZXggcG9zaXRpb24gYW5kIHNjYWxlIHRvIFswLCAxXSByYW5nZS5cXG5cXHQvLyBXZSBoYXZlIHBhY2tlZCBhIDJEIGRpc3BsYWNlbWVudCB3aXRoIHRoZSBwb3NpdGlvbi5cXG5cXHR2ZWM0IHBvc2l0aW9uRGF0YSA9IHRleHR1cmUyRCh1X2ludGVybmFsX3Bvc2l0aW9ucywgcGFydGljbGVVVik7XFxuXFx0Ly8gcG9zaXRpb24gPSBmaXJzdCB0d28gY29tcG9uZW50cyBwbHVzIGxhc3QgdHdvIGNvbXBvbmVudHMgKG9wdGlvbmFsIGFjY3VtdWxhdGlvbiBidWZmZXIpLlxcblxcdHZlYzIgcG9zaXRpb25BYnNvbHV0ZSA9IHBvc2l0aW9uRGF0YS5yZztcXG5cXHRpZiAodV9pbnRlcm5hbF9wb3NpdGlvbldpdGhBY2N1bXVsYXRpb24pIHBvc2l0aW9uQWJzb2x1dGUgKz0gcG9zaXRpb25EYXRhLmJhO1xcblxcdHZfVVYgPSBwb3NpdGlvbkFic29sdXRlICogdV9pbnRlcm5hbF9zY2FsZTtcXG5cXG5cXHQvLyBXcmFwIGlmIG5lZWRlZC5cXG5cXHR2X2xpbmVXcmFwcGluZyA9IHZlYzIoMC4wKTtcXG5cXHRpZiAodV9pbnRlcm5hbF93cmFwWCkge1xcblxcdFxcdGlmICh2X1VWLnggPCAwLjApIHtcXG5cXHRcXHRcXHR2X1VWLnggKz0gMS4wO1xcblxcdFxcdFxcdHZfbGluZVdyYXBwaW5nLnggPSAxLjA7XFxuXFx0XFx0fSBlbHNlIGlmICh2X1VWLnggPiAxLjApIHtcXG5cXHRcXHRcXHR2X1VWLnggLT0gMS4wO1xcblxcdFxcdFxcdHZfbGluZVdyYXBwaW5nLnggPSAxLjA7XFxuXFx0XFx0fVxcblxcdH1cXG5cXHRpZiAodV9pbnRlcm5hbF93cmFwWSkge1xcblxcdFxcdGlmICh2X1VWLnkgPCAwLjApIHtcXG5cXHRcXHRcXHR2X1VWLnkgKz0gMS4wO1xcblxcdFxcdFxcdHZfbGluZVdyYXBwaW5nLnkgPSAxLjA7XFxuXFx0XFx0fSBlbHNlIGlmICh2X1VWLnkgPiAxLjApIHtcXG5cXHRcXHRcXHR2X1VWLnkgLT0gMS4wO1xcblxcdFxcdFxcdHZfbGluZVdyYXBwaW5nLnkgPSAxLjA7XFxuXFx0XFx0fVxcblxcdH1cXG5cXG5cXHQvLyBDYWxjdWxhdGUgcG9zaXRpb24gaW4gWy0xLCAxXSByYW5nZS5cXG5cXHR2ZWMyIHBvc2l0aW9uID0gdl9VViAqIDIuMCAtIDEuMDtcXG5cXG5cXHRnbF9Qb3NpdGlvbiA9IHZlYzQocG9zaXRpb24sIDAsIDEpO1xcbn1cIiIsIm1vZHVsZS5leHBvcnRzID0gXCJwcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxucHJlY2lzaW9uIGhpZ2hwIGludDtcXG5cXG4vKipcXG4gKiBSZXR1cm5zIGFjY3VyYXRlIE1PRCB3aGVuIGFyZ3VtZW50cyBhcmUgYXBwcm94aW1hdGUgaW50ZWdlcnMuXFxuICovXFxuZmxvYXQgbW9kSShmbG9hdCBhLCBmbG9hdCBiKSB7XFxuICAgIGZsb2F0IG0gPSBhIC0gZmxvb3IoKGEgKyAwLjUpIC8gYikgKiBiO1xcbiAgICByZXR1cm4gZmxvb3IobSArIDAuNSk7XFxufVxcblxcbi8vIENhbm5vdCB1c2UgaW50IHZlcnRleCBhdHRyaWJ1dGVzOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yNzg3NDk4My93ZWJnbC1ob3ctdG8tdXNlLWludGVnZXItYXR0cmlidXRlcy1pbi1nbHNsXFxuYXR0cmlidXRlIGZsb2F0IGFfaW50ZXJuYWxfaW5kZXg7IC8vIEluZGV4IG9mIHBvaW50LlxcblxcbnVuaWZvcm0gc2FtcGxlcjJEIHVfaW50ZXJuYWxfcG9zaXRpb25zOyAvLyBUZXh0dXJlIGxvb2t1cCB3aXRoIHBvc2l0aW9uIGRhdGEuXFxudW5pZm9ybSB2ZWMyIHVfaW50ZXJuYWxfcG9zaXRpb25zRGltZW5zaW9ucztcXG51bmlmb3JtIHZlYzIgdV9pbnRlcm5hbF9zY2FsZTtcXG51bmlmb3JtIGZsb2F0IHVfaW50ZXJuYWxfcG9pbnRTaXplO1xcbnVuaWZvcm0gYm9vbCB1X2ludGVybmFsX3Bvc2l0aW9uV2l0aEFjY3VtdWxhdGlvbjtcXG51bmlmb3JtIGJvb2wgdV9pbnRlcm5hbF93cmFwWDtcXG51bmlmb3JtIGJvb2wgdV9pbnRlcm5hbF93cmFwWTtcXG5cXG52YXJ5aW5nIHZlYzIgdl9VVjtcXG5cXG52b2lkIG1haW4oKSB7XFxuXFx0Ly8gQ2FsY3VsYXRlIGEgdXYgYmFzZWQgb24gdGhlIHBvaW50J3MgaW5kZXggYXR0cmlidXRlLlxcblxcdHZlYzIgcGFydGljbGVVViA9IHZlYzIoXFxuXFx0XFx0bW9kSShhX2ludGVybmFsX2luZGV4LCB1X2ludGVybmFsX3Bvc2l0aW9uc0RpbWVuc2lvbnMueCksXFxuXFx0XFx0Zmxvb3IoZmxvb3IoYV9pbnRlcm5hbF9pbmRleCArIDAuNSkgLyB1X2ludGVybmFsX3Bvc2l0aW9uc0RpbWVuc2lvbnMueClcXG5cXHQpIC8gdV9pbnRlcm5hbF9wb3NpdGlvbnNEaW1lbnNpb25zO1xcblxcblxcdC8vIENhbGN1bGF0ZSBhIGdsb2JhbCB1diBmb3IgdGhlIHZpZXdwb3J0LlxcblxcdC8vIExvb2t1cCB2ZXJ0ZXggcG9zaXRpb24gYW5kIHNjYWxlIHRvIFswLCAxXSByYW5nZS5cXG5cXHQvLyBXZSBoYXZlIHBhY2tlZCBhIDJEIGRpc3BsYWNlbWVudCB3aXRoIHRoZSBwb3NpdGlvbi5cXG5cXHR2ZWM0IHBvc2l0aW9uRGF0YSA9IHRleHR1cmUyRCh1X2ludGVybmFsX3Bvc2l0aW9ucywgcGFydGljbGVVVik7XFxuXFx0Ly8gcG9zaXRpb24gPSBmaXJzdCB0d28gY29tcG9uZW50cyBwbHVzIGxhc3QgdHdvIGNvbXBvbmVudHMgKG9wdGlvbmFsIGFjY3VtdWxhdGlvbiBidWZmZXIpLlxcblxcdHZlYzIgcG9zaXRpb25BYnNvbHV0ZSA9IHBvc2l0aW9uRGF0YS5yZztcXG5cXHRpZiAodV9pbnRlcm5hbF9wb3NpdGlvbldpdGhBY2N1bXVsYXRpb24pIHBvc2l0aW9uQWJzb2x1dGUgKz0gcG9zaXRpb25EYXRhLmJhO1xcblxcdHZfVVYgPSBwb3NpdGlvbkFic29sdXRlICogdV9pbnRlcm5hbF9zY2FsZTtcXG5cXG5cXHQvLyBXcmFwIGlmIG5lZWRlZC5cXG5cXHRpZiAodV9pbnRlcm5hbF93cmFwWCkge1xcblxcdFxcdGlmICh2X1VWLnggPCAwLjApIHZfVVYueCArPSAxLjA7XFxuXFx0XFx0aWYgKHZfVVYueCA+IDEuMCkgdl9VVi54IC09IDEuMDtcXG5cXHR9XFxuXFx0aWYgKHVfaW50ZXJuYWxfd3JhcFkpIHtcXG5cXHRcXHRpZiAodl9VVi55IDwgMC4wKSB2X1VWLnkgKz0gMS4wO1xcblxcdFxcdGlmICh2X1VWLnkgPiAxLjApIHZfVVYueSAtPSAxLjA7XFxuXFx0fVxcblxcblxcdC8vIENhbGN1bGF0ZSBwb3NpdGlvbiBpbiBbLTEsIDFdIHJhbmdlLlxcblxcdHZlYzIgcG9zaXRpb24gPSB2X1VWICogMi4wIC0gMS4wO1xcblxcblxcdGdsX1BvaW50U2l6ZSA9IHVfaW50ZXJuYWxfcG9pbnRTaXplO1xcblxcdGdsX1Bvc2l0aW9uID0gdmVjNChwb3NpdGlvbiwgMCwgMSk7XFxufVwiIiwibW9kdWxlLmV4cG9ydHMgPSBcInByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5cXG5hdHRyaWJ1dGUgdmVjMiBhX2ludGVybmFsX3Bvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFfaW50ZXJuYWxfdXY7XFxuYXR0cmlidXRlIHZlYzIgYV9pbnRlcm5hbF9ub3JtYWw7XFxuXFxudW5pZm9ybSB2ZWMyIHVfaW50ZXJuYWxfc2NhbGU7XFxudW5pZm9ybSB2ZWMyIHVfaW50ZXJuYWxfdHJhbnNsYXRpb247XFxuXFxudmFyeWluZyB2ZWMyIHZfVVZfbG9jYWw7XFxudmFyeWluZyB2ZWMyIHZfVVY7XFxudmFyeWluZyB2ZWMyIHZfbm9ybWFsO1xcblxcbnZvaWQgbWFpbigpIHtcXG5cXHQvLyBWYXJ5aW5ncy5cXG5cXHR2X1VWX2xvY2FsID0gYV9pbnRlcm5hbF91djtcXG5cXHR2X25vcm1hbCA9IGFfaW50ZXJuYWxfbm9ybWFsO1xcblxcblxcdC8vIEFwcGx5IHRyYW5zZm9ybWF0aW9ucy5cXG5cXHR2ZWMyIHBvc2l0aW9uID0gdV9pbnRlcm5hbF9zY2FsZSAqIGFfaW50ZXJuYWxfcG9zaXRpb24gKyB1X2ludGVybmFsX3RyYW5zbGF0aW9uO1xcblxcblxcdC8vIENhbGN1bGF0ZSBhIGdsb2JhbCB1diBmb3IgdGhlIHZpZXdwb3J0LlxcblxcdHZfVVYgPSAwLjUgKiAocG9zaXRpb24gKyAxLjApO1xcblxcblxcdC8vIENhbGN1bGF0ZSB2ZXJ0ZXggcG9zaXRpb24uXFxuXFx0Z2xfUG9zaXRpb24gPSB2ZWM0KHBvc2l0aW9uLCAwLCAxKTtcXG59XCIiLCJtb2R1bGUuZXhwb3J0cyA9IFwiLy8gVmVydGV4IHNoYWRlciBmb3IgZnVsbHNjcmVlbiBxdWFkLlxcbnByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5cXG5hdHRyaWJ1dGUgdmVjMiBhX2ludGVybmFsX3Bvc2l0aW9uO1xcblxcbnVuaWZvcm0gZmxvYXQgdV9pbnRlcm5hbF9oYWxmVGhpY2tuZXNzO1xcbnVuaWZvcm0gdmVjMiB1X2ludGVybmFsX3NjYWxlO1xcbnVuaWZvcm0gZmxvYXQgdV9pbnRlcm5hbF9sZW5ndGg7XFxudW5pZm9ybSBmbG9hdCB1X2ludGVybmFsX3JvdGF0aW9uO1xcbnVuaWZvcm0gdmVjMiB1X2ludGVybmFsX3RyYW5zbGF0aW9uO1xcblxcbnZhcnlpbmcgdmVjMiB2X1VWX2xvY2FsO1xcbnZhcnlpbmcgdmVjMiB2X1VWO1xcblxcbm1hdDIgcm90YXRlMmQoZmxvYXQgX2FuZ2xlKXtcXG5cXHRyZXR1cm4gbWF0Mihjb3MoX2FuZ2xlKSwgLXNpbihfYW5nbGUpLCBzaW4oX2FuZ2xlKSwgY29zKF9hbmdsZSkpO1xcbn1cXG5cXG52b2lkIG1haW4oKSB7XFxuXFx0Ly8gQ2FsY3VsYXRlIFVWIGNvb3JkaW5hdGVzIG9mIGN1cnJlbnQgcmVuZGVyZWQgb2JqZWN0LlxcblxcdHZfVVZfbG9jYWwgPSAwLjUgKiAoYV9pbnRlcm5hbF9wb3NpdGlvbiArIDEuMCk7XFxuXFxuXFx0dmVjMiBwb3NpdGlvbiA9IGFfaW50ZXJuYWxfcG9zaXRpb247XFxuXFxuXFx0Ly8gQXBwbHkgdGhpY2tuZXNzIC8gcmFkaXVzLlxcblxcdHBvc2l0aW9uICo9IHVfaW50ZXJuYWxfaGFsZlRoaWNrbmVzcztcXG5cXG5cXHQvLyBTdHJldGNoIGNlbnRlciBvZiBzaGFwZSB0byBmb3JtIGEgcm91bmQtY2FwcGVkIGxpbmUgc2VnbWVudC5cXG5cXHRpZiAocG9zaXRpb24ueCA8IDAuMCkge1xcblxcdFxcdHBvc2l0aW9uLnggLT0gdV9pbnRlcm5hbF9sZW5ndGggLyAyLjA7XFxuXFx0XFx0dl9VVl9sb2NhbC54ID0gMC4wOyAvLyBTZXQgZW50aXJlIGNhcCBVVi54IHRvIDAuXFxuXFx0fSBlbHNlIGlmIChwb3NpdGlvbi54ID4gMC4wKSB7XFxuXFx0XFx0cG9zaXRpb24ueCArPSB1X2ludGVybmFsX2xlbmd0aCAvIDIuMDtcXG5cXHRcXHR2X1VWX2xvY2FsLnggPSAxLjA7IC8vIFNldCBlbnRpcmUgY2FwIFVWLnggdG8gMS5cXG5cXHR9XFxuXFxuXFx0Ly8gQXBwbHkgdHJhbnNmb3JtYXRpb25zLlxcblxcdHBvc2l0aW9uID0gdV9pbnRlcm5hbF9zY2FsZSAqIChyb3RhdGUyZCgtdV9pbnRlcm5hbF9yb3RhdGlvbikgKiBwb3NpdGlvbikgKyB1X2ludGVybmFsX3RyYW5zbGF0aW9uO1xcblxcblxcdC8vIENhbGN1bGF0ZSBhIGdsb2JhbCB1diBmb3IgdGhlIHZpZXdwb3J0LlxcblxcdHZfVVYgPSAwLjUgKiAocG9zaXRpb24gKyAxLjApO1xcblxcblxcdC8vIENhbGN1bGF0ZSB2ZXJ0ZXggcG9zaXRpb24uXFxuXFx0Z2xfUG9zaXRpb24gPSB2ZWM0KHBvc2l0aW9uLCAwLCAxKTtcXG59XCIiLCJtb2R1bGUuZXhwb3J0cyA9IFwiLy8gRnJhZ21lbnQgc2hhZGVyIHRoYXQgZHJhd3MgYSBzaW5nbGUgY29sb3IuXFxucHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcblxcbnVuaWZvcm0gdmVjMyB1X2NvbG9yO1xcblxcbnZvaWQgbWFpbigpIHtcXG5cXHRnbF9GcmFnQ29sb3IgPSB2ZWM0KHVfY29sb3IsIDEpO1xcbn1cIiIsIm1vZHVsZS5leHBvcnRzID0gXCIvLyBGcmFnbWVudCBzaGFkZXIgdGhhdCBkcmF3cyBhIHNpbmdsZSBjb2xvci5cXG5wcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxuXFxudW5pZm9ybSB2ZWMzIHVfY29sb3I7XFxudmFyeWluZyB2ZWMyIHZfbGluZVdyYXBwaW5nO1xcblxcbnZvaWQgbWFpbigpIHtcXG5cXHQvLyBjaGVjayBpZiB0aGlzIGxpbmUgaGFzIHdyYXBwZWQuXFxuXFx0aWYgKCh2X2xpbmVXcmFwcGluZy54ICE9IDAuMCAmJiB2X2xpbmVXcmFwcGluZy54ICE9IDEuMCkgfHwgKHZfbGluZVdyYXBwaW5nLnkgIT0gMC4wICYmIHZfbGluZVdyYXBwaW5nLnkgIT0gMS4wKSkge1xcblxcdFxcdC8vIFJlbmRlciBub3RoaW5nLlxcblxcdFxcdGRpc2NhcmQ7XFxuXFx0XFx0cmV0dXJuO1xcblxcdH1cXG5cXHRnbF9GcmFnQ29sb3IgPSB2ZWM0KHVfY29sb3IsIDEpO1xcbn1cIiIsIm1vZHVsZS5leHBvcnRzID0gXCJwcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxucHJlY2lzaW9uIGhpZ2hwIGludDtcXG5cXG4vKipcXG4gKiBSZXR1cm5zIGFjY3VyYXRlIE1PRCB3aGVuIGFyZ3VtZW50cyBhcmUgYXBwcm94aW1hdGUgaW50ZWdlcnMuXFxuICovXFxuZmxvYXQgbW9kSShmbG9hdCBhLCBmbG9hdCBiKSB7XFxuICAgIGZsb2F0IG0gPSBhIC0gZmxvb3IoKGEgKyAwLjUpIC8gYikgKiBiO1xcbiAgICByZXR1cm4gZmxvb3IobSArIDAuNSk7XFxufVxcblxcbi8vIENhbm5vdCB1c2UgaW50IHZlcnRleCBhdHRyaWJ1dGVzOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yNzg3NDk4My93ZWJnbC1ob3ctdG8tdXNlLWludGVnZXItYXR0cmlidXRlcy1pbi1nbHNsXFxuYXR0cmlidXRlIGZsb2F0IGFfaW50ZXJuYWxfaW5kZXg7IC8vIEluZGV4IG9mIHBvaW50LlxcblxcbnVuaWZvcm0gc2FtcGxlcjJEIHVfaW50ZXJuYWxfdmVjdG9yczsgLy8gVGV4dHVyZSBsb29rdXAgd2l0aCB2ZWN0b3IgZGF0YS5cXG51bmlmb3JtIHZlYzIgdV9pbnRlcm5hbF9kaW1lbnNpb25zO1xcbnVuaWZvcm0gdmVjMiB1X2ludGVybmFsX3NjYWxlO1xcblxcbnZhcnlpbmcgdmVjMiB2X1VWO1xcblxcbnZvaWQgbWFpbigpIHtcXG5cXHQvLyBEaXZpZGUgaW5kZXggYnkgMi5cXG5cXHRmbG9hdCBpbmRleCA9IGZsb29yKChhX2ludGVybmFsX2luZGV4ICsgMC41KSAvIDIuMCk7XFxuXFx0Ly8gQ2FsY3VsYXRlIGEgdXYgYmFzZWQgb24gdGhlIHZlcnRleCBpbmRleCBhdHRyaWJ1dGUuXFxuXFx0dl9VViA9IHZlYzIoXFxuXFx0XFx0bW9kSShpbmRleCwgdV9pbnRlcm5hbF9kaW1lbnNpb25zLngpLFxcblxcdFxcdGZsb29yKGZsb29yKGluZGV4ICsgMC41KSAvIHVfaW50ZXJuYWxfZGltZW5zaW9ucy54KVxcblxcdCkgLyB1X2ludGVybmFsX2RpbWVuc2lvbnM7XFxuXFxuXFx0Ly8gQWRkIHZlY3RvciBkaXNwbGFjZW1lbnQgaWYgbmVlZGVkLlxcblxcdGlmIChtb2RJKGFfaW50ZXJuYWxfaW5kZXgsIDIuMCkgPiAwLjApIHtcXG5cXHRcXHQvLyBMb29rdXAgdmVjdG9yRGF0YSBhdCBjdXJyZW50IFVWLlxcblxcdFxcdHZlYzIgdmVjdG9yRGF0YSA9IHRleHR1cmUyRCh1X2ludGVybmFsX3ZlY3RvcnMsIHZfVVYpLnh5O1xcblxcdFxcdHZfVVYgKz0gdmVjdG9yRGF0YSAqIHVfaW50ZXJuYWxfc2NhbGU7XFxuXFx0fVxcblxcblxcdC8vIENhbGN1bGF0ZSBwb3NpdGlvbiBpbiBbLTEsIDFdIHJhbmdlLlxcblxcdHZlYzIgcG9zaXRpb24gPSB2X1VWICogMi4wIC0gMS4wO1xcblxcblxcdGdsX1Bvc2l0aW9uID0gdmVjNChwb3NpdGlvbiwgMCwgMSk7XFxufVwiIiwibW9kdWxlLmV4cG9ydHMgPSBcIiN2ZXJzaW9uIDMwMCBlc1xcbnByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5wcmVjaXNpb24gaGlnaHAgc2FtcGxlcjJEO1xcblxcbmluIHZlYzIgdl9VVjtcXG5cXG51bmlmb3JtIHNhbXBsZXIyRCB1X3N0YXRlO1xcblxcbm91dCB2ZWM0IG91dF9mcmFnQ29sb3I7XFxuXFxudm9pZCBtYWluKCkge1xcblxcdG91dF9mcmFnQ29sb3IgPSB0ZXh0dXJlKHVfc3RhdGUsIHZfVVYpO1xcbn1cIiIsIm1vZHVsZS5leHBvcnRzID0gXCIjdmVyc2lvbiAzMDAgZXNcXG5wcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxucHJlY2lzaW9uIGhpZ2hwIGludDtcXG5wcmVjaXNpb24gaGlnaHAgaXNhbXBsZXIyRDtcXG5cXG5pbiB2ZWMyIHZfVVY7XFxuXFxudW5pZm9ybSBpc2FtcGxlcjJEIHVfc3RhdGU7XFxuXFxub3V0IGl2ZWM0IG91dF9mcmFnQ29sb3I7XFxuXFxudm9pZCBtYWluKCkge1xcblxcdG91dF9mcmFnQ29sb3IgPSB0ZXh0dXJlKHVfc3RhdGUsIHZfVVYpO1xcbn1cIiIsIm1vZHVsZS5leHBvcnRzID0gXCIjdmVyc2lvbiAzMDAgZXNcXG5wcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxucHJlY2lzaW9uIGhpZ2hwIGludDtcXG5wcmVjaXNpb24gaGlnaHAgdXNhbXBsZXIyRDtcXG5cXG5pbiB2ZWMyIHZfVVY7XFxuXFxudW5pZm9ybSB1c2FtcGxlcjJEIHVfc3RhdGU7XFxuXFxub3V0IHV2ZWM0IG91dF9mcmFnQ29sb3I7XFxuXFxudm9pZCBtYWluKCkge1xcblxcdG91dF9mcmFnQ29sb3IgPSB0ZXh0dXJlKHVfc3RhdGUsIHZfVVYpO1xcbn1cIiIsIm1vZHVsZS5leHBvcnRzID0gXCIjdmVyc2lvbiAzMDAgZXNcXG5wcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxuXFxuaW4gdmVjMiBhX2ludGVybmFsX3Bvc2l0aW9uO1xcblxcbnVuaWZvcm0gdmVjMiB1X2ludGVybmFsX3NjYWxlO1xcbnVuaWZvcm0gdmVjMiB1X2ludGVybmFsX3RyYW5zbGF0aW9uO1xcblxcbm91dCB2ZWMyIHZfVVZfbG9jYWw7XFxub3V0IHZlYzIgdl9VVjtcXG5vdXQgdmVjMiBvdXRfcG9zaXRpb247XFxuXFxudm9pZCBtYWluKCkge1xcblxcdC8vIENhbGN1bGF0ZSBVViBjb29yZGluYXRlcyBvZiBjdXJyZW50IHJlbmRlcmVkIG9iamVjdC5cXG5cXHR2X1VWX2xvY2FsID0gMC41ICogKGFfaW50ZXJuYWxfcG9zaXRpb24gKyAxLjApO1xcblxcblxcdC8vIEFwcGx5IHRyYW5zZm9ybWF0aW9ucy5cXG5cXHR2ZWMyIHBvc2l0aW9uID0gdV9pbnRlcm5hbF9zY2FsZSAqIGFfaW50ZXJuYWxfcG9zaXRpb24gKyB1X2ludGVybmFsX3RyYW5zbGF0aW9uO1xcblxcblxcdC8vIENhbGN1bGF0ZSBhIGdsb2JhbCB1diBmb3IgdGhlIHZpZXdwb3J0LlxcblxcdHZfVVYgPSAwLjUgKiAocG9zaXRpb24gKyAxLjApO1xcblxcblxcdC8vIENhbGN1bGF0ZSB2ZXJ0ZXggcG9zaXRpb24uXFxuXFx0b3V0X3Bvc2l0aW9uID0gcG9zaXRpb247XFxufVwiIiwibW9kdWxlLmV4cG9ydHMgPSBcIiN2ZXJzaW9uIDMwMCBlc1xcbnByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5cXG5hdHRyaWJ1dGUgdmVjMiBhX2ludGVybmFsX3Bvc2l0aW9uO1xcblxcbnVuaWZvcm0gZmxvYXQgdV9pbnRlcm5hbF9oYWxmVGhpY2tuZXNzO1xcbnVuaWZvcm0gdmVjMiB1X2ludGVybmFsX3NjYWxlO1xcbnVuaWZvcm0gZmxvYXQgdV9pbnRlcm5hbF9sZW5ndGg7XFxudW5pZm9ybSBmbG9hdCB1X2ludGVybmFsX3JvdGF0aW9uO1xcbnVuaWZvcm0gdmVjMiB1X2ludGVybmFsX3RyYW5zbGF0aW9uO1xcblxcbnZhcnlpbmcgdmVjMiB2X1VWX2xvY2FsO1xcbnZhcnlpbmcgdmVjMiB2X1VWO1xcblxcbm1hdDIgcm90YXRlMmQoZmxvYXQgX2FuZ2xlKXtcXG5cXHRyZXR1cm4gbWF0Mihjb3MoX2FuZ2xlKSwgLXNpbihfYW5nbGUpLCBzaW4oX2FuZ2xlKSwgY29zKF9hbmdsZSkpO1xcbn1cXG5cXG52b2lkIG1haW4oKSB7XFxuXFx0Ly8gQ2FsY3VsYXRlIFVWIGNvb3JkaW5hdGVzIG9mIGN1cnJlbnQgcmVuZGVyZWQgb2JqZWN0LlxcblxcdHZfVVZfbG9jYWwgPSAwLjUgKiAoYV9pbnRlcm5hbF9wb3NpdGlvbiArIDEuMCk7XFxuXFxuXFx0dmVjMiBwb3NpdGlvbiA9IGFfaW50ZXJuYWxfcG9zaXRpb247XFxuXFxuXFx0Ly8gQXBwbHkgcmFkaXVzLlxcblxcdHBvc2l0aW9uICo9IHVfaW50ZXJuYWxfcmFkaXVzO1xcblxcblxcdC8vIFN0cmV0Y2ggY2VudGVyIG9mIHNoYXBlIHRvIGZvcm0gYSByb3VuZC1jYXBwZWQgbGluZSBzZWdtZW50LlxcblxcdGlmIChwb3NpdGlvbi54IDwgMC4wKSB7XFxuXFx0XFx0cG9zaXRpb24ueCAtPSB1X2ludGVybmFsX2xlbmd0aCAvIDIuMDtcXG5cXHRcXHR2X1VWX2xvY2FsLnggPSAwLjA7IC8vIFNldCBlbnRpcmUgY2FwIFVWLnggdG8gMC5cXG5cXHR9IGVsc2UgaWYgKHBvc2l0aW9uLnggPiAwLjApIHtcXG5cXHRcXHRwb3NpdGlvbi54ICs9IHVfaW50ZXJuYWxfbGVuZ3RoIC8gMi4wO1xcblxcdFxcdHZfVVZfbG9jYWwueCA9IDEuMDsgLy8gU2V0IGVudGlyZSBjYXAgVVYueCB0byAxLlxcblxcdH1cXG5cXG5cXHQvLyBBcHBseSB0cmFuc2Zvcm1hdGlvbnMuXFxuXFx0cG9zaXRpb24gPSB1X2ludGVybmFsX3NjYWxlICogKHJvdGF0ZTJkKC11X2ludGVybmFsX3JvdGF0aW9uKSAqIHBvc2l0aW9uKSArIHVfaW50ZXJuYWxfdHJhbnNsYXRpb247XFxuXFxuXFx0Ly8gQ2FsY3VsYXRlIGEgZ2xvYmFsIHV2IGZvciB0aGUgdmlld3BvcnQuXFxuXFx0dl9VViA9IDAuNSAqIChwb3NpdGlvbiArIDEuMCk7XFxuXFxuXFx0Ly8gQ2FsY3VsYXRlIHZlcnRleCBwb3NpdGlvbi5cXG5cXHRnbF9Qb3NpdGlvbiA9IHZlYzQocG9zaXRpb24sIDAsIDEpO1xcbn1cIiIsIm1vZHVsZS5leHBvcnRzID0gXCIvLyBGcmFnbWVudCBzaGFkZXIgdGhhdCBkcmF3cyBhIHNpbmdsZSBjb2xvci5cXG5wcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxuXFxudW5pZm9ybSB2ZWMzIHVfY29sb3I7XFxuXFxudm9pZCBtYWluKCkge1xcblxcdGdsX0ZyYWdDb2xvciA9IHZlYzQodV9jb2xvciwgMSk7XFxufVwiIiwibW9kdWxlLmV4cG9ydHMgPSBcIi8vIEZyYWdtZW50IHNoYWRlciB0aGF0IGRyYXdzIGEgc2luZ2xlIGNvbG9yLlxcbnByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5cXG51bmlmb3JtIHZlYzMgdV9jb2xvcjtcXG52YXJ5aW5nIHZlYzIgdl9saW5lV3JhcHBpbmc7XFxuXFxudm9pZCBtYWluKCkge1xcblxcdC8vIGNoZWNrIGlmIHRoaXMgbGluZSBoYXMgd3JhcHBlZC5cXG5cXHRpZiAoKHZfbGluZVdyYXBwaW5nLnggIT0gMC4wICYmIHZfbGluZVdyYXBwaW5nLnggIT0gMS4wKSB8fCAodl9saW5lV3JhcHBpbmcueSAhPSAwLjAgJiYgdl9saW5lV3JhcHBpbmcueSAhPSAxLjApKSB7XFxuXFx0XFx0Ly8gUmVuZGVyIG5vdGhpbmcuXFxuXFx0XFx0ZGlzY2FyZDtcXG5cXHRcXHRyZXR1cm47XFxuXFx0fVxcblxcdGdsX0ZyYWdDb2xvciA9IHZlYzQodV9jb2xvciwgMSk7XFxufVwiIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0bG9hZGVkOiBmYWxzZSxcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG5cdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmhtZCA9IChtb2R1bGUpID0+IHtcblx0bW9kdWxlID0gT2JqZWN0LmNyZWF0ZShtb2R1bGUpO1xuXHRpZiAoIW1vZHVsZS5jaGlsZHJlbikgbW9kdWxlLmNoaWxkcmVuID0gW107XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtb2R1bGUsICdleHBvcnRzJywge1xuXHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0c2V0OiAoKSA9PiB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0VTIE1vZHVsZXMgbWF5IG5vdCBhc3NpZ24gbW9kdWxlLmV4cG9ydHMgb3IgZXhwb3J0cy4qLCBVc2UgRVNNIGV4cG9ydCBzeW50YXgsIGluc3RlYWQ6ICcgKyBtb2R1bGUuaWQpO1xuXHRcdH1cblx0fSk7XG5cdHJldHVybiBtb2R1bGU7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9pbmRleC50c1wiKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=