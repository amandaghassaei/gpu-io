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

/***/ 847:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Float16Array": () => (/* reexport */ Float16Array),
  "getFloat16": () => (/* reexport */ getFloat16),
  "hfround": () => (/* reexport */ hfround),
  "setFloat16": () => (/* reexport */ setFloat16)
});

;// CONCATENATED MODULE: ./node_modules/@petamoriken/float16/src/lib.js
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

;// CONCATENATED MODULE: ./node_modules/@petamoriken/float16/src/hfround.js


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

    const x16 = roundToFloat16Bits(num);
    return convertToNumber(x16);
}

;// CONCATENATED MODULE: ./node_modules/lodash-es/_freeGlobal.js
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/* harmony default export */ const _freeGlobal = (freeGlobal);

;// CONCATENATED MODULE: ./node_modules/lodash-es/_root.js


/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = _freeGlobal || freeSelf || Function('return this')();

/* harmony default export */ const _root = (root);

;// CONCATENATED MODULE: ./node_modules/lodash-es/_Symbol.js


/** Built-in value references. */
var _Symbol_Symbol = _root.Symbol;

/* harmony default export */ const _Symbol = (_Symbol_Symbol);

;// CONCATENATED MODULE: ./node_modules/lodash-es/_getRawTag.js


/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var _getRawTag_hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = _getRawTag_hasOwnProperty.call(value, symToStringTag),
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

/* harmony default export */ const _getRawTag = (getRawTag);

;// CONCATENATED MODULE: ./node_modules/lodash-es/_objectToString.js
/** Used for built-in method references. */
var _objectToString_objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var _objectToString_nativeObjectToString = _objectToString_objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return _objectToString_nativeObjectToString.call(value);
}

/* harmony default export */ const _objectToString = (objectToString);

;// CONCATENATED MODULE: ./node_modules/lodash-es/_baseGetTag.js




/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var _baseGetTag_symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

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
  return (_baseGetTag_symToStringTag && _baseGetTag_symToStringTag in Object(value))
    ? _getRawTag(value)
    : _objectToString(value);
}

/* harmony default export */ const _baseGetTag = (baseGetTag);

;// CONCATENATED MODULE: ./node_modules/lodash-es/isObject.js
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

/* harmony default export */ const lodash_es_isObject = (isObject);

;// CONCATENATED MODULE: ./node_modules/lodash-es/isFunction.js



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
  if (!lodash_es_isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = _baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

/* harmony default export */ const lodash_es_isFunction = (isFunction);

;// CONCATENATED MODULE: ./node_modules/lodash-es/_coreJsData.js


/** Used to detect overreaching core-js shims. */
var coreJsData = _root["__core-js_shared__"];

/* harmony default export */ const _coreJsData = (coreJsData);

;// CONCATENATED MODULE: ./node_modules/lodash-es/_isMasked.js


/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(_coreJsData && _coreJsData.keys && _coreJsData.keys.IE_PROTO || '');
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

/* harmony default export */ const _isMasked = (isMasked);

;// CONCATENATED MODULE: ./node_modules/lodash-es/_toSource.js
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

/* harmony default export */ const _toSource = (toSource);

;// CONCATENATED MODULE: ./node_modules/lodash-es/_baseIsNative.js





/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var _baseIsNative_funcProto = Function.prototype,
    _baseIsNative_objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var _baseIsNative_funcToString = _baseIsNative_funcProto.toString;

/** Used to check objects for own properties. */
var _baseIsNative_hasOwnProperty = _baseIsNative_objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  _baseIsNative_funcToString.call(_baseIsNative_hasOwnProperty).replace(reRegExpChar, '\\$&')
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
  if (!lodash_es_isObject(value) || _isMasked(value)) {
    return false;
  }
  var pattern = lodash_es_isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(_toSource(value));
}

/* harmony default export */ const _baseIsNative = (baseIsNative);

;// CONCATENATED MODULE: ./node_modules/lodash-es/_getValue.js
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

/* harmony default export */ const _getValue = (getValue);

;// CONCATENATED MODULE: ./node_modules/lodash-es/_getNative.js



/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = _getValue(object, key);
  return _baseIsNative(value) ? value : undefined;
}

/* harmony default export */ const _getNative = (getNative);

;// CONCATENATED MODULE: ./node_modules/lodash-es/_nativeCreate.js


/* Built-in method references that are verified to be native. */
var nativeCreate = _getNative(Object, 'create');

/* harmony default export */ const _nativeCreate = (nativeCreate);

;// CONCATENATED MODULE: ./node_modules/lodash-es/_hashClear.js


/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = _nativeCreate ? _nativeCreate(null) : {};
  this.size = 0;
}

/* harmony default export */ const _hashClear = (hashClear);

;// CONCATENATED MODULE: ./node_modules/lodash-es/_hashDelete.js
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

/* harmony default export */ const _hashDelete = (hashDelete);

;// CONCATENATED MODULE: ./node_modules/lodash-es/_hashGet.js


/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var _hashGet_objectProto = Object.prototype;

/** Used to check objects for own properties. */
var _hashGet_hasOwnProperty = _hashGet_objectProto.hasOwnProperty;

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
  if (_nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return _hashGet_hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/* harmony default export */ const _hashGet = (hashGet);

;// CONCATENATED MODULE: ./node_modules/lodash-es/_hashHas.js


/** Used for built-in method references. */
var _hashHas_objectProto = Object.prototype;

/** Used to check objects for own properties. */
var _hashHas_hasOwnProperty = _hashHas_objectProto.hasOwnProperty;

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
  return _nativeCreate ? (data[key] !== undefined) : _hashHas_hasOwnProperty.call(data, key);
}

/* harmony default export */ const _hashHas = (hashHas);

;// CONCATENATED MODULE: ./node_modules/lodash-es/_hashSet.js


/** Used to stand-in for `undefined` hash values. */
var _hashSet_HASH_UNDEFINED = '__lodash_hash_undefined__';

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
  data[key] = (_nativeCreate && value === undefined) ? _hashSet_HASH_UNDEFINED : value;
  return this;
}

/* harmony default export */ const _hashSet = (hashSet);

;// CONCATENATED MODULE: ./node_modules/lodash-es/_Hash.js






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
Hash.prototype.clear = _hashClear;
Hash.prototype['delete'] = _hashDelete;
Hash.prototype.get = _hashGet;
Hash.prototype.has = _hashHas;
Hash.prototype.set = _hashSet;

/* harmony default export */ const _Hash = (Hash);

;// CONCATENATED MODULE: ./node_modules/lodash-es/_listCacheClear.js
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

/* harmony default export */ const _listCacheClear = (listCacheClear);

;// CONCATENATED MODULE: ./node_modules/lodash-es/eq.js
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

/* harmony default export */ const lodash_es_eq = (eq);

;// CONCATENATED MODULE: ./node_modules/lodash-es/_assocIndexOf.js


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
    if (lodash_es_eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/* harmony default export */ const _assocIndexOf = (assocIndexOf);

;// CONCATENATED MODULE: ./node_modules/lodash-es/_listCacheDelete.js


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
      index = _assocIndexOf(data, key);

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

/* harmony default export */ const _listCacheDelete = (listCacheDelete);

;// CONCATENATED MODULE: ./node_modules/lodash-es/_listCacheGet.js


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
      index = _assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/* harmony default export */ const _listCacheGet = (listCacheGet);

;// CONCATENATED MODULE: ./node_modules/lodash-es/_listCacheHas.js


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
  return _assocIndexOf(this.__data__, key) > -1;
}

/* harmony default export */ const _listCacheHas = (listCacheHas);

;// CONCATENATED MODULE: ./node_modules/lodash-es/_listCacheSet.js


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
      index = _assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

/* harmony default export */ const _listCacheSet = (listCacheSet);

;// CONCATENATED MODULE: ./node_modules/lodash-es/_ListCache.js






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
ListCache.prototype.clear = _listCacheClear;
ListCache.prototype['delete'] = _listCacheDelete;
ListCache.prototype.get = _listCacheGet;
ListCache.prototype.has = _listCacheHas;
ListCache.prototype.set = _listCacheSet;

/* harmony default export */ const _ListCache = (ListCache);

;// CONCATENATED MODULE: ./node_modules/lodash-es/_Map.js



/* Built-in method references that are verified to be native. */
var Map = _getNative(_root, 'Map');

/* harmony default export */ const _Map = (Map);

;// CONCATENATED MODULE: ./node_modules/lodash-es/_mapCacheClear.js




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
    'hash': new _Hash,
    'map': new (_Map || _ListCache),
    'string': new _Hash
  };
}

/* harmony default export */ const _mapCacheClear = (mapCacheClear);

;// CONCATENATED MODULE: ./node_modules/lodash-es/_isKeyable.js
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

/* harmony default export */ const _isKeyable = (isKeyable);

;// CONCATENATED MODULE: ./node_modules/lodash-es/_getMapData.js


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
  return _isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/* harmony default export */ const _getMapData = (getMapData);

;// CONCATENATED MODULE: ./node_modules/lodash-es/_mapCacheDelete.js


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
  var result = _getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

/* harmony default export */ const _mapCacheDelete = (mapCacheDelete);

;// CONCATENATED MODULE: ./node_modules/lodash-es/_mapCacheGet.js


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
  return _getMapData(this, key).get(key);
}

/* harmony default export */ const _mapCacheGet = (mapCacheGet);

;// CONCATENATED MODULE: ./node_modules/lodash-es/_mapCacheHas.js


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
  return _getMapData(this, key).has(key);
}

/* harmony default export */ const _mapCacheHas = (mapCacheHas);

;// CONCATENATED MODULE: ./node_modules/lodash-es/_mapCacheSet.js


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
  var data = _getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

/* harmony default export */ const _mapCacheSet = (mapCacheSet);

;// CONCATENATED MODULE: ./node_modules/lodash-es/_MapCache.js






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
MapCache.prototype.clear = _mapCacheClear;
MapCache.prototype['delete'] = _mapCacheDelete;
MapCache.prototype.get = _mapCacheGet;
MapCache.prototype.has = _mapCacheHas;
MapCache.prototype.set = _mapCacheSet;

/* harmony default export */ const _MapCache = (MapCache);

;// CONCATENATED MODULE: ./node_modules/lodash-es/memoize.js


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
  memoized.cache = new (memoize.Cache || _MapCache);
  return memoized;
}

// Expose `MapCache`.
memoize.Cache = _MapCache;

/* harmony default export */ const lodash_es_memoize = (memoize);

;// CONCATENATED MODULE: ./node_modules/@petamoriken/float16/src/bug.js
/**
 * JavaScriptCore <= 12 bug
 * @see https://bugs.webkit.org/show_bug.cgi?id=171606
 */
const isTypedArrayIndexedPropertyWritable = Object.getOwnPropertyDescriptor(new Uint8Array(1), 0).writable;

;// CONCATENATED MODULE: ./node_modules/@petamoriken/float16/src/spec.js
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

;// CONCATENATED MODULE: ./node_modules/@petamoriken/float16/src/is.js




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
    return typeof key === "string" && key === ToInteger(key) + "";
}

;// CONCATENATED MODULE: ./node_modules/lodash-es/isObjectLike.js
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

/* harmony default export */ const lodash_es_isObjectLike = (isObjectLike);

;// CONCATENATED MODULE: ./node_modules/lodash-es/_baseIsArrayBuffer.js



var arrayBufferTag = '[object ArrayBuffer]';

/**
 * The base implementation of `_.isArrayBuffer` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array buffer, else `false`.
 */
function baseIsArrayBuffer(value) {
  return lodash_es_isObjectLike(value) && _baseGetTag(value) == arrayBufferTag;
}

/* harmony default export */ const _baseIsArrayBuffer = (baseIsArrayBuffer);

;// CONCATENATED MODULE: ./node_modules/lodash-es/_baseUnary.js
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

/* harmony default export */ const _baseUnary = (baseUnary);

;// CONCATENATED MODULE: ./node_modules/lodash-es/_nodeUtil.js


/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && _freeGlobal.process;

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

/* harmony default export */ const _nodeUtil = (nodeUtil);

;// CONCATENATED MODULE: ./node_modules/lodash-es/isArrayBuffer.js




/* Node.js helper references. */
var nodeIsArrayBuffer = _nodeUtil && _nodeUtil.isArrayBuffer;

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
var isArrayBuffer = nodeIsArrayBuffer ? _baseUnary(nodeIsArrayBuffer) : _baseIsArrayBuffer;

/* harmony default export */ const lodash_es_isArrayBuffer = (isArrayBuffer);

;// CONCATENATED MODULE: ./node_modules/@petamoriken/float16/src/private.js
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

;// CONCATENATED MODULE: ./node_modules/@petamoriken/float16/src/Float16Array.js







const _ = createPrivateStorage();

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
        array[i] = convertToNumber(float16bits[i]);
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
        if (!isTypedArrayIndexedPropertyWritable) {
            wrapper = target;
            target = _(wrapper).target;
        }

        if (isStringNumberKey(key)) {
            return Reflect.has(target, key) ? convertToNumber(Reflect.get(target, key)) : undefined;
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
        if (!isTypedArrayIndexedPropertyWritable) {
            wrapper = target;
            target = _(wrapper).target;
        }

        if (isStringNumberKey(key)) {
            return Reflect.set(target, key, roundToFloat16Bits(value));
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

if (!isTypedArrayIndexedPropertyWritable) {
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
        } else if (input !== null && typeof input === "object" && !lodash_es_isArrayBuffer(input)) {
            // if input is not ArrayLike and Iterable, get Array
            const arrayLike = !Reflect.has(input, "length") && input[Symbol.iterator] !== undefined ? [...input] : input;

            const length = arrayLike.length;
            super(length);

            for(let i = 0; i < length; ++i) {
                // super (Uint16Array)
                this[i] = roundToFloat16Bits(arrayLike[i]);
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

        if (isTypedArrayIndexedPropertyWritable) {
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
            return new Float16Array(Uint16Array.from(src, roundToFloat16Bits).buffer);
        }

        const mapFunc = opts[0];
        const thisArg = opts[1];

        return new Float16Array(Uint16Array.from(src, function (val, ...args) {
            return roundToFloat16Bits(mapFunc.call(this, val, ...args));
        }, thisArg).buffer);
    }

    static of(...args) {
        return new Float16Array(args);
    }

    // iterate methods
    * [Symbol.iterator]() {
        for(const val of super[Symbol.iterator]()) {
            yield convertToNumber(val);
        }
    }

    keys() {
        return super.keys();
    }

    * values() {
        for(const val of super.values()) {
            yield convertToNumber(val);
        }
    }

    /** @type {() => IterableIterator<[number, number]>} */
    * entries() {
        for(const [i, val] of super.entries()) {
            yield [i, convertToNumber(val)];
        }
    }

    // functional methods
    // @ts-ignore
    map(callback, ...opts) {
        assertFloat16Array(this);

        const thisArg = opts[0];

        const array = [];
        for(let i = 0, l = this.length; i < l; ++i) {
            const val = convertToNumber(this[i]);
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
            const val = convertToNumber(this[i]);
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
            val = convertToNumber(this[0]);
            start = 1;
        } else {
            val = opts[0];
            start = 0;
        }

        for(let i = start, l = this.length; i < l; ++i) {
            val = callback(val, convertToNumber(this[i]), i, _(this).proxy);
        }

        return val;
    }

    reduceRight(callback, ...opts) {
        assertFloat16Array(this);

        let val, start;

        const length = this.length;
        if (opts.length === 0) {
            val = convertToNumber(this[length - 1]);
            start = length - 1;
        } else {
            val = opts[0];
            start = length;
        }

        for(let i = start; i--;) {
            val = callback(val, convertToNumber(this[i]), i, _(this).proxy);
        }

        return val;
    }

    forEach(callback, ...opts) {
        assertFloat16Array(this);

        const thisArg = opts[0];

        for(let i = 0, l = this.length; i < l; ++i) {
            callback.call(thisArg, convertToNumber(this[i]), i, _(this).proxy);
        }
    }

    find(callback, ...opts) {
        assertFloat16Array(this);

        const thisArg = opts[0];

        for(let i = 0, l = this.length; i < l; ++i) {
            const value = convertToNumber(this[i]);
            if (callback.call(thisArg, value, i, _(this).proxy)) {
                return value;
            }
        }
    }

    findIndex(callback, ...opts) {
        assertFloat16Array(this);

        const thisArg = opts[0];

        for(let i = 0, l = this.length; i < l; ++i) {
            const value = convertToNumber(this[i]);
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
            if (!callback.call(thisArg, convertToNumber(this[i]), i, _(this).proxy)) {
                return false;
            }
        }

        return true;
    }

    some(callback, ...opts) {
        assertFloat16Array(this);

        const thisArg = opts[0];

        for(let i = 0, l = this.length; i < l; ++i) {
            if (callback.call(thisArg, convertToNumber(this[i]), i, _(this).proxy)) {
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
                float16bits[i] = roundToFloat16Bits(arrayLike[i]);
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

        super.fill(roundToFloat16Bits(value), ...opts);

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
            compareFunction = defaultCompareFunction;
        }

        const _convertToNumber = lodash_es_memoize(convertToNumber);

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

        let from = ToInteger(opts[0]);

        if (from < 0) {
            from += length;
            if (from < 0) {
                from = 0;
            }
        }

        for(let i = from, l = length; i < l; ++i) {
            if (convertToNumber(this[i]) === element) {
                return i;
            }
        }

        return -1;
    }

    lastIndexOf(element, ...opts) {
        assertFloat16Array(this);

        const length = this.length;

        let from = ToInteger(opts[0]);

        from = from === 0 ? length : from + 1;

        if (from >= 0) {
            from = from < length ? from : length;
        } else {
            from += length;
        }

        for(let i = from; i--;) {
            if (convertToNumber(this[i]) === element) {
                return i;
            }
        }

        return -1;
    }

    includes(element, ...opts) {
        assertFloat16Array(this);

        const length = this.length;

        let from = ToInteger(opts[0]);

        if (from < 0) {
            from += length;
            if (from < 0) {
                from = 0;
            }
        }

        const isNaN = Number.isNaN(element);
        for(let i = from, l = length; i < l; ++i) {
            const value = convertToNumber(this[i]);

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

;// CONCATENATED MODULE: ./node_modules/@petamoriken/float16/src/dataView.js



/**
 * returns an unsigned 16-bit float at the specified byte offset from the start of the DataView.
 * @param {DataView} dataView
 * @param {number} byteOffset
 * @param {[boolean]} opts
 * @returns {number}
 */
function getFloat16(dataView, byteOffset, ...opts) {
    if (!isDataView(dataView)) {
        throw new TypeError("First argument to getFloat16 function must be a DataView");
    }

    return convertToNumber( dataView.getUint16(byteOffset, ...opts) );
}

/**
 * stores an unsigned 16-bit float value at the specified byte offset from the start of the DataView.
 * @param {DataView} dataView
 * @param {number} byteOffset
 * @param {number} value
 * @param {[boolean]} opts
 */
function setFloat16(dataView, byteOffset, value, ...opts) {
    if (!isDataView(dataView)) {
        throw new TypeError("First argument to setFloat16 function must be a DataView");
    }

    dataView.setUint16(byteOffset, roundToFloat16Bits(value), ...opts);
}

;// CONCATENATED MODULE: ./node_modules/@petamoriken/float16/src/index.js





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
var GPULayer_1 = __webpack_require__(355);
var constants_1 = __webpack_require__(601);
var GPUProgram_1 = __webpack_require__(664);
var utils = __webpack_require__(404);
var utils_1 = __webpack_require__(593);
var checks_1 = __webpack_require__(707);
var defaultVertexShaderSource = __webpack_require__(288);
var GPUComposer = /** @class */ (function () {
    function GPUComposer(params) {
        var _a;
        this._errorThrown = false;
        // Store multiple circle positions buffers for various num segments, use numSegments as key.
        this._circlePositionsBuffer = {};
        // Keep track of all GL extensions that have been loaded.
        /**
         * @private
         */
        this._extensions = {};
        // Programs for copying data (these are needed for rendering partial screen geometries).
        this._copyPrograms = {
            src: __webpack_require__(158),
        };
        // Other util programs.
        this._setValuePrograms = {
            src: __webpack_require__(148),
        };
        this._vectorMagnitudePrograms = {
            src: __webpack_require__(723),
        };
        /**
         * Vertex shaders are shared across all GPUProgram instances.
         * @private
         */
        this._vertexShaders = (_a = {},
            _a[constants_1.DEFAULT_PROGRAM_NAME] = {
                src: defaultVertexShaderSource,
                compiledShaders: {},
            },
            _a[constants_1.SEGMENT_PROGRAM_NAME] = {
                src: __webpack_require__(974),
                compiledShaders: {},
            },
            _a[constants_1.LAYER_POINTS_PROGRAM_NAME] = {
                src: __webpack_require__(767),
                compiledShaders: {},
            },
            _a[constants_1.LAYER_VECTOR_FIELD_PROGRAM_NAME] = {
                src: __webpack_require__(760),
                compiledShaders: {},
            },
            _a[constants_1.LAYER_LINES_PROGRAM_NAME] = {
                src: __webpack_require__(143),
                compiledShaders: {},
            },
            _a);
        this.verboseLogging = false;
        this._numTicks = 0;
        // Check params.
        var validKeys = ['canvas', 'context', 'contextID', 'contextOptions', 'glslVersion', 'verboseLogging', 'errorCallback'];
        var requiredKeys = ['canvas'];
        var keys = Object.keys(params);
        keys.forEach(function (key) {
            if (validKeys.indexOf(key) < 0) {
                throw new Error("Invalid key \"".concat(key, "\" passed to new GPUComposer(params).  Valid keys are ").concat(validKeys.join(', '), "."));
            }
        });
        // Check for required keys.
        requiredKeys.forEach(function (key) {
            if (keys.indexOf(key) < 0) {
                throw new Error("Required params key \"".concat(key, "\" was not passed to new GPUComposer(params)."));
            }
        });
        if (params.verboseLogging !== undefined)
            this.verboseLogging = params.verboseLogging;
        // Save callback in case we run into an error.
        var self = this;
        this._errorCallback = function (message) {
            if (self._errorThrown) {
                return;
            }
            self._errorThrown = true;
            params.errorCallback ? params.errorCallback(message) : (0, constants_1.DEFAULT_ERROR_CALLBACK)(message);
        };
        var canvas = params.canvas;
        this.canvas = canvas;
        var gl = params.context;
        // Init GL.
        if (!gl) {
            // Init a gl context if not passed in.
            if (params.contextID) {
                var _gl = canvas.getContext(params.contextID, params.contextOptions);
                if (!_gl) {
                    console.warn("Unable to initialize WebGL context with contextID: ".concat(params.contextID, "."));
                }
                else {
                    gl = _gl;
                }
            }
            if (!gl) {
                var _gl = canvas.getContext(constants_1.WEBGL2, params.contextOptions)
                    || canvas.getContext(constants_1.WEBGL1, params.contextOptions)
                    || canvas.getContext(constants_1.EXPERIMENTAL_WEBGL, params.contextOptions);
                if (_gl) {
                    gl = _gl;
                }
            }
            if (!gl) {
                this._errorCallback('Unable to initialize WebGL context.');
                return;
            }
        }
        if ((0, utils_1.isWebGL2)(gl)) {
            if (this.verboseLogging)
                console.log('Using WebGL 2.0 context.');
        }
        else {
            if (this.verboseLogging)
                console.log('Using WebGL 1.0 context.');
        }
        this.gl = gl;
        // Save glsl version, default to 3 if using webgl2 context.
        var glslVersion = params.glslVersion || ((0, utils_1.isWebGL2)(gl) ? constants_1.GLSL3 : constants_1.GLSL1);
        if (!(0, utils_1.isWebGL2)(gl) && glslVersion === constants_1.GLSL3) {
            console.warn('GLSL3.x is incompatible with WebGL1.0 contexts, falling back to GLSL1.');
            glslVersion = constants_1.GLSL1; // Fall back to GLSL1 in these cases.
        }
        // TODO: check that this is valid.
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
        // TODO: look into more of these: https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/pixelStorei
        // // Some implementations of HTMLCanvasElement's or OffscreenCanvas's CanvasRenderingContext2D store color values
        // // internally in premultiplied form. If such a canvas is uploaded to a WebGL texture with the
        // // UNPACK_PREMULTIPLY_ALPHA_WEBGL pixel storage parameter set to false, the color channels will have to be un-multiplied
        // // by the alpha channel, which is a lossy operation. The WebGL implementation therefore can not guarantee that colors
        // // with alpha < 1.0 will be preserved losslessly when first drawn to a canvas via CanvasRenderingContext2D and then
        // // uploaded to a WebGL texture when the UNPACK_PREMULTIPLY_ALPHA_WEBGL pixel storage parameter is set to false.
        // gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        // Unbind active buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        // Canvas setup.
        this.resize(canvas.clientWidth, canvas.clientHeight);
        // Log number of textures available.
        this._maxNumTextures = this.gl.getParameter(this.gl.MAX_TEXTURE_IMAGE_UNITS);
        if (this.verboseLogging)
            console.log("".concat(this._maxNumTextures, " textures max."));
    }
    GPUComposer.initWithThreeRenderer = function (renderer, params) {
        var composer = new GPUComposer(__assign(__assign({ floatPrecision: renderer.capabilities.precision || constants_1.PRECISION_HIGH_P, intPrecision: renderer.capabilities.precision || constants_1.PRECISION_HIGH_P }, params), { canvas: renderer.domElement, context: renderer.getContext(), glslVersion: renderer.capabilities.isWebGL2 ? constants_1.GLSL3 : constants_1.GLSL1 }));
        // Attach renderer.
        // @ts-ignore
        composer.renderer = renderer;
        return composer;
    };
    GPUComposer.prototype.isWebGL2 = function () {
        return (0, utils_1.isWebGL2)(this.gl);
    };
    GPUComposer.prototype._glslKeyForType = function (type) {
        switch (type) {
            case constants_1.HALF_FLOAT:
            case constants_1.FLOAT:
                return constants_1.FLOAT;
            case constants_1.UNSIGNED_BYTE:
            case constants_1.UNSIGNED_SHORT:
            case constants_1.UNSIGNED_INT:
                if (this.glslVersion === constants_1.GLSL1)
                    return constants_1.INT;
                return constants_1.UINT;
            case constants_1.BYTE:
            case constants_1.SHORT:
            case constants_1.INT:
                return constants_1.INT;
            default:
                throw new Error("Invalid type: ".concat(type, " passed to GPUComposer.copyProgramForType."));
        }
    };
    /**
     *
     * @private
     */
    GPUComposer.prototype._setValueProgramForType = function (type) {
        var _a;
        var _setValuePrograms = this._setValuePrograms;
        var key = this._glslKeyForType(type);
        if (_setValuePrograms[key] === undefined) {
            var program = new GPUProgram_1.GPUProgram(this, {
                name: "setValue-".concat(key),
                fragmentShader: _setValuePrograms.src,
                uniforms: [
                    {
                        name: 'u_value',
                        value: [0, 0, 0, 0],
                        type: key,
                    },
                ],
                defines: (_a = {},
                    _a["GPUIO_".concat(key)] = '1',
                    _a),
            });
            _setValuePrograms[key] = program;
        }
        return _setValuePrograms[key];
    };
    GPUComposer.prototype._copyProgramForType = function (type) {
        var _a;
        var _copyPrograms = this._copyPrograms;
        var key = this._glslKeyForType(type);
        if (_copyPrograms[key] === undefined) {
            var program = new GPUProgram_1.GPUProgram(this, {
                name: "copy-".concat(key),
                fragmentShader: _copyPrograms.src,
                uniforms: [
                    {
                        name: 'u_state',
                        value: 0,
                        type: constants_1.INT,
                    },
                ],
                defines: (_a = {},
                    _a["GPUIO_".concat(key)] = '1',
                    _a),
            });
            _copyPrograms[key] = program;
        }
        return _copyPrograms[key];
    };
    GPUComposer.prototype._getWrappedLineColorProgram = function () {
        if (this._wrappedLineColorProgram === undefined) {
            var program = new GPUProgram_1.GPUProgram(this, {
                name: 'wrappedLineColor',
                fragmentShader: __webpack_require__(598),
            });
            this._wrappedLineColorProgram = program;
        }
        return this._wrappedLineColorProgram;
    };
    GPUComposer.prototype._vectorMagnitudeProgramForType = function (type) {
        var _a;
        var _vectorMagnitudePrograms = this._vectorMagnitudePrograms;
        var key = this._glslKeyForType(type);
        if (_vectorMagnitudePrograms[key] === undefined) {
            var program = new GPUProgram_1.GPUProgram(this, {
                name: "vectorMagnitude-".concat(key),
                fragmentShader: _vectorMagnitudePrograms.src,
                defines: (_a = {},
                    _a["GPUIO_".concat(key)] = '1',
                    _a),
            });
            _vectorMagnitudePrograms[key] = program;
        }
        return _vectorMagnitudePrograms[key];
    };
    GPUComposer.prototype._getQuadPositionsBuffer = function () {
        if (this._quadPositionsBuffer === undefined) {
            var fsQuadPositions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
            this._quadPositionsBuffer = this._initVertexBuffer(fsQuadPositions);
        }
        return this._quadPositionsBuffer;
    };
    GPUComposer.prototype._getBoundaryPositionsBuffer = function () {
        if (this._boundaryPositionsBuffer === undefined) {
            var boundaryPositions = new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1, -1, -1]);
            this._boundaryPositionsBuffer = this._initVertexBuffer(boundaryPositions);
        }
        return this._boundaryPositionsBuffer;
    };
    GPUComposer.prototype._getCirclePositionsBuffer = function (numSegments) {
        var _circlePositionsBuffer = this._circlePositionsBuffer;
        if (_circlePositionsBuffer[numSegments] == undefined) {
            var unitCirclePoints = [0, 0];
            for (var i = 0; i <= numSegments; i++) { // TODO: should this be just less than?
                unitCirclePoints.push(Math.cos(2 * Math.PI * i / numSegments), Math.sin(2 * Math.PI * i / numSegments));
            }
            var circlePositions = new Float32Array(unitCirclePoints);
            var buffer = this._initVertexBuffer(circlePositions);
            _circlePositionsBuffer[numSegments] = buffer;
        }
        return _circlePositionsBuffer[numSegments];
    };
    GPUComposer.prototype._initVertexBuffer = function (data) {
        var _a = this, _errorCallback = _a._errorCallback, gl = _a.gl;
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
     * Used internally, see GPULayer.clone() for public API.
     * @private
     */
    GPUComposer.prototype._cloneGPULayer = function (gpuLayer, name) {
        var dimensions = 0;
        try {
            dimensions = gpuLayer.length;
        }
        catch (_a) {
            dimensions = [gpuLayer.width, gpuLayer.height];
        }
        // If read only, get state by reading to GPU.
        var array = gpuLayer.writable ? undefined : gpuLayer.getValues();
        var clone = new GPULayer_1.GPULayer(this, {
            name: name || "".concat(gpuLayer.name, "-clone"),
            dimensions: dimensions,
            type: gpuLayer.type,
            numComponents: gpuLayer.numComponents,
            filter: gpuLayer.filter,
            wrapS: gpuLayer.wrapS,
            wrapT: gpuLayer.wrapT,
            writable: gpuLayer.writable,
            numBuffers: gpuLayer.numBuffers,
            clearValue: gpuLayer.clearValue,
            array: array,
        });
        // TODO: check this.
        // If writable, copy current state with a draw call.
        if (gpuLayer.writable) {
            for (var i = 0; i < gpuLayer.numBuffers - 1; i++) {
                this.step({
                    program: this._copyProgramForType(gpuLayer.type),
                    input: gpuLayer.getStateAtIndex((gpuLayer.bufferIndex + i + 1) % gpuLayer.numBuffers),
                    output: clone,
                });
            }
            this.step({
                program: this._copyProgramForType(gpuLayer.type),
                input: gpuLayer.currentState,
                output: clone,
            });
        }
        // TODO: Increment clone's buffer index until it is identical to the original layer.
        return clone;
    };
    GPUComposer.prototype.initTexture = function (params) {
        // Check params.
        var validKeys = ['name', 'url', 'filter', 'wrapS', 'wrapT', 'format', 'type', 'onLoad'];
        Object.keys(params).forEach(function (key) {
            if (validKeys.indexOf(key) < 0) {
                throw new Error("Invalid key \"".concat(key, "\" passed to GPUComposer.initTexture with name \"").concat(params.name, "\".  Valid keys are ").concat(validKeys.join(', '), "."));
            }
        });
        var url = params.url, name = params.name;
        if (!(0, checks_1.isString)(url)) {
            throw new Error("Expected GPUComposer.initTexture params to have url of type string, got ".concat(url, " of type ").concat(typeof url, "."));
        }
        if (!(0, checks_1.isString)(name)) {
            throw new Error("Expected GPUComposer.initTexture params to have name of type string, got ".concat(name, " of type ").concat(typeof name, "."));
        }
        // Get filter type, default to nearest.
        var filter = params.filter !== undefined ? params.filter : constants_1.NEAREST;
        if (!(0, checks_1.isValidFilter)(filter)) {
            throw new Error("Invalid filter: ".concat(filter, " for GPULayer \"").concat(name, "\", must be ").concat(constants_1.validFilters.join(', '), "."));
        }
        // Get wrap types, default to clamp to edge.
        var wrapS = params.wrapS !== undefined ? params.wrapS : constants_1.CLAMP_TO_EDGE;
        if (!(0, checks_1.isValidWrap)(wrapS)) {
            throw new Error("Invalid wrapS: ".concat(wrapS, " for GPULayer \"").concat(name, "\", must be ").concat(constants_1.validWraps.join(', '), "."));
        }
        var wrapT = params.wrapT !== undefined ? params.wrapT : constants_1.CLAMP_TO_EDGE;
        if (!(0, checks_1.isValidWrap)(wrapT)) {
            throw new Error("Invalid wrapT: ".concat(wrapT, " for GPULayer \"").concat(name, "\", must be ").concat(constants_1.validWraps.join(', '), "."));
        }
        // Get image format type, default to rgba.
        var format = params.format !== undefined ? params.format : constants_1.RGBA;
        if (!(0, checks_1.isValidTextureFormat)(format)) {
            throw new Error("Invalid format: ".concat(format, " for GPULayer \"").concat(name, "\", must be ").concat(constants_1.validTextureFormats.join(', '), "."));
        }
        // Get image data type, default to unsigned byte.
        var type = params.type !== undefined ? params.type : constants_1.UNSIGNED_BYTE;
        if (!(0, checks_1.isValidTextureType)(type)) {
            throw new Error("Invalid type: ".concat(type, " for GPULayer \"").concat(name, "\", must be ").concat(constants_1.validTextureTypes.join(', '), "."));
        }
        var _a = this, gl = _a.gl, _errorCallback = _a._errorCallback;
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
            if ((0, utils_1.isPowerOf2)(image.width) && (0, utils_1.isPowerOf2)(image.height)) {
                // // Yes, it's a power of 2. Generate mips.
                // gl.generateMipmap(gl.TEXTURE_2D);
            }
            else {
                // TODO: finish implementing this.
                console.warn("Texture ".concat(name, " dimensions [").concat(image.width, ", ").concat(image.height, "] are not power of 2."));
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
            _errorCallback("Error loading image ".concat(name, ": ").concat(e));
        };
        image.src = url;
        return texture;
    };
    /**
     *
     * @private
     */
    GPUComposer.prototype._getVertexShader = function (name, vertexID, vertexDefines, programName) {
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
            var shader = (0, utils_1.compileShader)(gl, glslVersion, intPrecision, floatPrecision, preprocessedSrc, gl.VERTEX_SHADER, programName, _errorCallback, vertexDefines, true);
            if (!shader) {
                _errorCallback("Unable to compile \"".concat(name).concat(vertexID, "\" vertex shader for GPUProgram \"").concat(programName, "\"."));
                return;
            }
            // Save the results so this does not have to be repeated.
            compiledShaders[vertexID] = shader;
        }
        return compiledShaders[vertexID];
    };
    GPUComposer.prototype.resize = function (width, height) {
        var canvas = this.canvas;
        // Set correct canvas pixel size.
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/By_example/Canvas_size_and_WebGL
        canvas.width = width;
        canvas.height = height;
        // Save dimensions.
        this._width = width;
        this._height = height;
    };
    ;
    GPUComposer.prototype._drawSetup = function (gpuProgram, programName, vertexDefines, fullscreenRender, input, output) {
        var gl = this.gl;
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
        var program = gpuProgram._getProgramWithName(programName, vertexDefines, inputTextures);
        // Set output framebuffer.
        // This may modify WebGL internal state.
        this._setOutputLayer(fullscreenRender, input, output);
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
    GPUComposer.prototype._setBlendMode = function (shouldBlendAlpha) {
        var gl = this.gl;
        if (shouldBlendAlpha) {
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        }
    };
    GPUComposer.prototype._indexOfLayerInArray = function (layer, array) {
        return array.findIndex(function (item) { return item === layer || item.layer === layer; });
    };
    GPUComposer.prototype._addLayerToInputs = function (layer, input) {
        // Add layer to end of input if needed.
        // Do this with no mutations.
        if (input === undefined) {
            return [layer];
        }
        if ((0, checks_1.isArray)(input)) {
            // Return input with layer added if needed.
            if (this._indexOfLayerInArray(layer, input) >= 0) {
                return input;
            }
            return __spreadArray(__spreadArray([], input, true), [layer], false);
        }
        if (input === layer || input.layer === layer) {
            return [input];
        }
        return [input, layer];
    };
    GPUComposer.prototype._passThroughLayerDataFromInputToOutput = function (state) {
        // TODO: figure out the fastest way to copy a texture.
        var copyProgram = this._copyProgramForType(state._internalType);
        this.step({
            program: copyProgram,
            input: state,
            output: state,
        });
    };
    GPUComposer.prototype._setOutputLayer = function (fullscreenRender, input, output) {
        var gl = this.gl;
        // Render to screen.
        if (!output) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            // Resize viewport.
            var _a = this, _width = _a._width, _height = _a._height;
            gl.viewport(0, 0, _width, _height);
            return;
        }
        // Check if output is same as one of input layers.
        if (input && ((input === output || input.layer === output) ||
            ((0, checks_1.isArray)(input) && this._indexOfLayerInArray(output, input) >= 0))) {
            if (output.numBuffers === 1) {
                throw new Error('Cannot use same buffer for input and output of a program. Try increasing the number of buffers in your output layer to at least 2 so you can render to nextState using currentState as an input.');
            }
            if (fullscreenRender) {
                // Render and increment buffer so we are rendering to a different target
                // than the input texture.
                output._prepareForWrite(true);
            }
            else {
                // Pass input texture through to output.
                this._passThroughLayerDataFromInputToOutput(output);
                // Render to output without incrementing buffer.
                output._prepareForWrite(false);
            }
        }
        else {
            if (fullscreenRender) {
                // Render to current buffer.
                output._prepareForWrite(false);
            }
            else {
                // If we are doing a sneaky thing with a swapped texture and are
                // only rendering part of the screen, we may need to add a copy operation.
                if (output._usingTextureOverrideForCurrentBuffer()) {
                    this._passThroughLayerDataFromInputToOutput(output);
                }
                output._prepareForWrite(false);
            }
        }
        // Resize viewport.
        var width = output.width, height = output.height;
        gl.viewport(0, 0, width, height);
    };
    ;
    GPUComposer.prototype._setVertexAttribute = function (program, name, size, programName) {
        var gl = this.gl;
        // Point attribute to the currently bound VBO.
        var location = gl.getAttribLocation(program, name);
        if (location < 0) {
            throw new Error("Unable to find vertex attribute \"".concat(name, "\" in program \"").concat(programName, "\"."));
        }
        // INT types not supported for attributes.
        // Use FLOAT rather than SHORT bc FLOAT covers more INT range.
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
        gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
        // Enable the attribute.
        gl.enableVertexAttribArray(location);
    };
    GPUComposer.prototype._setPositionAttribute = function (program, programName) {
        this._setVertexAttribute(program, 'a_gpuio_position', 2, programName);
    };
    GPUComposer.prototype._setIndexAttribute = function (program, programName) {
        this._setVertexAttribute(program, 'a_gpuio_index', 1, programName);
    };
    GPUComposer.prototype._setUVAttribute = function (program, programName) {
        this._setVertexAttribute(program, 'a_gpuio_uv', 2, programName);
    };
    // Step for entire fullscreen quad.
    GPUComposer.prototype.step = function (params) {
        var gl = this.gl;
        var program = params.program, input = params.input, output = params.output;
        // Do setup - this must come first.
        var glProgram = this._drawSetup(program, constants_1.DEFAULT_PROGRAM_NAME, {}, true, input, output);
        // Update uniforms and buffers.
        program._setVertexUniform(glProgram, 'u_gpuio_scale', [1, 1], constants_1.FLOAT);
        program._setVertexUniform(glProgram, 'u_gpuio_translation', [0, 0], constants_1.FLOAT);
        gl.bindBuffer(gl.ARRAY_BUFFER, this._getQuadPositionsBuffer());
        this._setPositionAttribute(glProgram, program.name);
        // Draw.
        this._setBlendMode(params.shouldBlendAlpha);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.disable(gl.BLEND);
    };
    // Step program only for a strip of px along the boundary.
    GPUComposer.prototype.stepBoundary = function (params) {
        var gl = this.gl;
        var program = params.program, input = params.input, output = params.output;
        var width = output ? output.width : this._width;
        var height = output ? output.height : this._height;
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
        this._setBlendMode(params.shouldBlendAlpha);
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
                    throw new Error("Unknown boundary edge type: ".concat(params.singleEdge, "."));
            }
        }
        else {
            gl.drawArrays(gl.LINE_LOOP, 0, 4);
        }
        gl.disable(gl.BLEND);
    };
    // Step program for all but a strip of px along the boundary.
    GPUComposer.prototype.stepNonBoundary = function (params) {
        var gl = this.gl;
        var program = params.program, input = params.input, output = params.output;
        var width = output ? output.width : this._width;
        var height = output ? output.height : this._height;
        // Do setup - this must come first.
        var glProgram = this._drawSetup(program, constants_1.DEFAULT_PROGRAM_NAME, {}, false, input, output);
        // Update uniforms and buffers.
        var onePx = [1 / width, 1 / height];
        program._setVertexUniform(glProgram, 'u_gpuio_scale', [1 - 2 * onePx[0], 1 - 2 * onePx[1]], constants_1.FLOAT);
        program._setVertexUniform(glProgram, 'u_gpuio_translation', onePx, constants_1.FLOAT);
        gl.bindBuffer(gl.ARRAY_BUFFER, this._getQuadPositionsBuffer);
        this._setPositionAttribute(glProgram, program.name);
        // Draw.
        this._setBlendMode(params.shouldBlendAlpha);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.disable(gl.BLEND);
    };
    // Step program inside a circular spot.
    GPUComposer.prototype.stepCircle = function (params) {
        var _a = this, gl = _a.gl, _width = _a._width, _height = _a._height;
        var program = params.program, position = params.position, diameter = params.diameter, input = params.input, output = params.output;
        // Do setup - this must come first.
        var glProgram = this._drawSetup(program, constants_1.DEFAULT_PROGRAM_NAME, {}, false, input, output);
        // Update uniforms and buffers.
        program._setVertexUniform(glProgram, 'u_gpuio_scale', [diameter / _width, diameter / _height], constants_1.FLOAT);
        program._setVertexUniform(glProgram, 'u_gpuio_translation', [2 * position[0] / _width - 1, 2 * position[1] / _height - 1], constants_1.FLOAT);
        var numSegments = params.numSegments ? params.numSegments : constants_1.DEFAULT_CIRCLE_NUM_SEGMENTS;
        if (numSegments < 3) {
            throw new Error("numSegments for GPUComposer.stepCircle must be greater than 2, got ".concat(numSegments, "."));
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, this._getCirclePositionsBuffer(numSegments));
        this._setPositionAttribute(glProgram, program.name);
        // Draw.
        this._setBlendMode(params.shouldBlendAlpha);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, numSegments + 2);
        gl.disable(gl.BLEND);
    };
    // Step program only for a thickened line segment (rounded end caps available).
    GPUComposer.prototype.stepSegment = function (params) {
        var gl = this.gl;
        var program = params.program, position1 = params.position1, position2 = params.position2, thickness = params.thickness, input = params.input, output = params.output;
        var width = output ? output.width : this._width;
        var height = output ? output.height : this._height;
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
        program._setVertexUniform(glProgram, 'u_gpuio_translation', [2 * centerX / this._width - 1, 2 * centerY / this._height - 1], constants_1.FLOAT);
        var length = Math.sqrt(diffX * diffX + diffY * diffY);
        var numSegments = params.numCapSegments ? params.numCapSegments * 2 : constants_1.DEFAULT_CIRCLE_NUM_SEGMENTS;
        if (params.endCaps) {
            if (numSegments < 6 || numSegments % 6 !== 0) {
                throw new Error("numSegments for GPUComposer.stepSegment must be divisible by 6, got ".concat(numSegments, "."));
            }
            // Have to subtract a small offset from length.
            program._setVertexUniform(glProgram, 'u_gpuio_length', length - thickness * Math.sin(Math.PI / numSegments), constants_1.FLOAT);
            gl.bindBuffer(gl.ARRAY_BUFFER, this._getCirclePositionsBuffer(numSegments));
        }
        else {
            // Have to subtract a small offset from length.
            program._setVertexUniform(glProgram, 'u_gpuio_length', length - thickness, constants_1.FLOAT);
            // Use a rectangle in case of no caps.
            gl.bindBuffer(gl.ARRAY_BUFFER, this._getQuadPositionsBuffer());
        }
        this._setPositionAttribute(glProgram, program.name);
        // Draw.
        this._setBlendMode(params.shouldBlendAlpha);
        if (params.endCaps) {
            gl.drawArrays(gl.TRIANGLE_FAN, 0, numSegments + 2);
        }
        else {
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }
        gl.disable(gl.BLEND);
    };
    GPUComposer.prototype.stepPolyline = function (params) {
        var program = params.program, input = params.input, output = params.output;
        var vertices = params.positions;
        var closeLoop = !!params.closeLoop;
        var _a = this, gl = _a.gl, _width = _a._width, _height = _a._height;
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
        var vertexShaderOptions = {};
        if (uvs)
            vertexShaderOptions[constants_1.GPUIO_VS_UV_ATTRIBUTE] = '1';
        if (normals)
            vertexShaderOptions[constants_1.GPUIO_VS_NORMAL_ATTRIBUTE] = '1';
        // Do setup - this must come first.
        var glProgram = this._drawSetup(program, constants_1.DEFAULT_PROGRAM_NAME, vertexShaderOptions, false, input, output);
        // Update uniforms and buffers.
        program._setVertexUniform(glProgram, 'u_gpuio_scale', [2 / _width, 2 / _height], constants_1.FLOAT);
        program._setVertexUniform(glProgram, 'u_gpuio_translation', [-1, -1], constants_1.FLOAT);
        // Init positions buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, this._initVertexBuffer(positions));
        this._setPositionAttribute(glProgram, program.name);
        if (uvs) {
            // Init uv buffer.
            gl.bindBuffer(gl.ARRAY_BUFFER, this._initVertexBuffer(uvs));
            this._setUVAttribute(glProgram, program.name);
        }
        if (normals) {
            // Init normals buffer.
            gl.bindBuffer(gl.ARRAY_BUFFER, this._initVertexBuffer(normals));
            this._setVertexAttribute(glProgram, 'a_gpuio_normal', 2, program.name);
        }
        // Draw.
        this._setBlendMode(params.shouldBlendAlpha);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, numPositions);
        gl.disable(gl.BLEND);
    };
    GPUComposer.prototype.stepTriangleStrip = function (params) {
        var program = params.program, input = params.input, output = params.output, positions = params.positions, uvs = params.uvs, normals = params.normals;
        var _a = this, gl = _a.gl, _width = _a._width, _height = _a._height;
        var vertexShaderOptions = {};
        if (uvs)
            vertexShaderOptions[constants_1.GPUIO_VS_UV_ATTRIBUTE] = '1';
        if (normals)
            vertexShaderOptions[constants_1.GPUIO_VS_NORMAL_ATTRIBUTE] = '1';
        // Do setup - this must come first.
        var glProgram = this._drawSetup(program, constants_1.DEFAULT_PROGRAM_NAME, vertexShaderOptions, false, input, output);
        // Update uniforms and buffers.
        program._setVertexUniform(glProgram, 'u_gpuio_scale', [2 / _width, 2 / _height], constants_1.FLOAT);
        program._setVertexUniform(glProgram, 'u_gpuio_translation', [-1, -1], constants_1.FLOAT);
        // Init positions buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, this._initVertexBuffer(positions));
        this._setPositionAttribute(glProgram, program.name);
        if (uvs) {
            // Init uv buffer.
            gl.bindBuffer(gl.ARRAY_BUFFER, this._initVertexBuffer(uvs));
            this._setUVAttribute(glProgram, program.name);
        }
        if (normals) {
            // Init normals buffer.
            gl.bindBuffer(gl.ARRAY_BUFFER, this._initVertexBuffer(normals));
            this._setVertexAttribute(glProgram, 'a_gpuio_normal', 2, program.name);
        }
        var count = params.count ? params.count : positions.length / 2;
        // Draw.
        this._setBlendMode(params.shouldBlendAlpha);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, count);
        gl.disable(gl.BLEND);
    };
    GPUComposer.prototype.stepLines = function (params) {
        var _a = this, gl = _a.gl, _width = _a._width, _height = _a._height;
        var indices = params.indices, uvs = params.uvs, normals = params.normals, input = params.input, output = params.output, program = params.program;
        // Check that params are valid.
        if (params.closeLoop && indices) {
            throw new Error("GPUComposer.stepLines() can't be called with closeLoop == true and indices.");
        }
        var vertexShaderOptions = {};
        if (uvs)
            vertexShaderOptions[constants_1.GPUIO_VS_UV_ATTRIBUTE] = '1';
        if (normals)
            vertexShaderOptions[constants_1.GPUIO_VS_NORMAL_ATTRIBUTE] = '1';
        // Do setup - this must come first.
        var glProgram = this._drawSetup(program, constants_1.DEFAULT_PROGRAM_NAME, vertexShaderOptions, false, input, output);
        var count = params.count ? params.count : (indices ? indices.length : (params.positions.length / 2));
        // Update uniforms and buffers.
        program._setVertexUniform(glProgram, 'u_gpuio_scale', [2 / _width, 2 / _height], constants_1.FLOAT);
        program._setVertexUniform(glProgram, 'u_gpuio_translation', [-1, -1], constants_1.FLOAT);
        if (indices) {
            // Reorder positions array to match indices.
            var positions = new Float32Array(2 * count);
            for (var i = 0; i < count; i++) {
                var index = indices[i];
                positions[2 * i] = params.positions[2 * index];
                positions[2 * i + 1] = params.positions[2 * index + 1];
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, this._initVertexBuffer(positions));
        }
        else {
            gl.bindBuffer(gl.ARRAY_BUFFER, this._initVertexBuffer(params.positions));
        }
        this._setPositionAttribute(glProgram, program.name);
        if (uvs) {
            // Init uv buffer.
            gl.bindBuffer(gl.ARRAY_BUFFER, this._initVertexBuffer(uvs));
            this._setUVAttribute(glProgram, program.name);
        }
        if (normals) {
            // Init normals buffer.
            gl.bindBuffer(gl.ARRAY_BUFFER, this._initVertexBuffer(normals));
            this._setVertexAttribute(glProgram, 'a_gpuio_normal', 2, program.name);
        }
        // Draw.
        this._setBlendMode(params.shouldBlendAlpha);
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
    GPUComposer.prototype.drawLayerAsPoints = function (params) {
        var _a = this, gl = _a.gl, _pointIndexArray = _a._pointIndexArray, _width = _a._width, _height = _a._height, glslVersion = _a.glslVersion;
        var positions = params.positions, output = params.output;
        // Check that numPoints is valid.
        if (positions.numComponents !== 2 && positions.numComponents !== 4) {
            throw new Error("GPUComposer.drawLayerAsPoints() must be passed a position GPULayer with either 2 or 4 components, got position GPULayer \"".concat(positions.name, "\" with ").concat(positions.numComponents, " components."));
        }
        if (glslVersion === constants_1.GLSL1 && positions.width * positions.height > constants_1.MAX_FLOAT_INT) {
            console.warn("Points positions array length: ".concat(positions.width * positions.height, " is longer than what is supported by GLSL1 : ").concat(constants_1.MAX_FLOAT_INT, ", expect index overflow."));
        }
        var length = positions.length;
        var count = params.count || length;
        if (count > length) {
            throw new Error("Invalid count ".concat(count, " for position GPULayer of length ").concat(length, "."));
        }
        var program = params.program;
        if (program === undefined) {
            program = this._setValueProgramForType(constants_1.FLOAT);
            var color = params.color || [1, 0, 0]; // Default of red.
            program.setUniform('u_value', __spreadArray(__spreadArray([], color, true), [1], false), constants_1.FLOAT);
        }
        // Add positions to end of input if needed.
        var input = this._addLayerToInputs(positions, params.input);
        var vertexShaderOptions = {};
        // Tell whether we are using an absolute position (2 components),
        // or position with accumulation buffer (4 components, better floating pt accuracy).
        if (positions.numComponents === 4)
            vertexShaderOptions[constants_1.GPUIO_VS_POSITION_W_ACCUM] = '1';
        if (params.wrapX)
            vertexShaderOptions[constants_1.GPUIO_VS_WRAP_X] = '1';
        if (params.wrapY)
            vertexShaderOptions[constants_1.GPUIO_VS_WRAP_Y] = '1';
        // Do setup - this must come first.
        var glProgram = this._drawSetup(program, constants_1.LAYER_POINTS_PROGRAM_NAME, vertexShaderOptions, false, input, output);
        // Update uniforms and buffers.
        program._setVertexUniform(glProgram, 'u_gpuio_positions', this._indexOfLayerInArray(positions, input), constants_1.INT);
        program._setVertexUniform(glProgram, 'u_gpuio_scale', [1 / _width, 1 / _height], constants_1.FLOAT);
        // Set default pointSize.
        var pointSize = params.pointSize || 1;
        program._setVertexUniform(glProgram, 'u_gpuio_pointSize', pointSize, constants_1.FLOAT);
        var positionLayerDimensions = [positions.width, positions.height];
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
        this._setBlendMode(params.shouldBlendAlpha);
        gl.drawArrays(gl.POINTS, 0, count);
        gl.disable(gl.BLEND);
    };
    GPUComposer.prototype.drawLayerAsLines = function (params) {
        var _a = this, gl = _a.gl, _width = _a._width, _height = _a._height, glslVersion = _a.glslVersion;
        var positions = params.positions, output = params.output;
        // Check that positions is valid.
        if (positions.numComponents !== 2 && positions.numComponents !== 4) {
            throw new Error("GPUComposer.drawLayerAsLines() must be passed a position GPULayer with either 2 or 4 components, got position GPULayer \"".concat(positions.name, "\" with ").concat(positions.numComponents, " components."));
        }
        // Check that params are valid.
        if (params.closeLoop && params.indices) {
            throw new Error("GPUComposer.drawLayerAsLines() can't be called with closeLoop == true and indices.");
        }
        var program = params.program;
        if (program === undefined) {
            program = params.wrapX || params.wrapY ? this._getWrappedLineColorProgram() : this._setValueProgramForType(constants_1.FLOAT);
            ;
            var color = params.color || [1, 0, 0]; // Default to red.
            program.setUniform('u_value', __spreadArray(__spreadArray([], color, true), [1], false), constants_1.FLOAT);
        }
        // Add positionLayer to end of input if needed.
        var input = this._addLayerToInputs(positions, params.input);
        var vertexShaderOptions = {};
        // Tell whether we are using an absolute position (2 components),
        // or position with accumulation buffer (4 components, better floating pt accuracy).
        if (positions.numComponents === 4)
            vertexShaderOptions[constants_1.GPUIO_VS_POSITION_W_ACCUM] = '1';
        if (params.wrapX)
            vertexShaderOptions[constants_1.GPUIO_VS_WRAP_X] = '1';
        if (params.wrapY)
            vertexShaderOptions[constants_1.GPUIO_VS_WRAP_Y] = '1';
        if (params.indices)
            vertexShaderOptions[constants_1.GPUIO_VS_INDEXED_POSITIONS] = '1';
        // Do setup - this must come first.
        var glProgram = this._drawSetup(program, constants_1.LAYER_LINES_PROGRAM_NAME, vertexShaderOptions, false, input, output);
        var count = params.count ? params.count : (params.indices ? params.indices.length : positions.length);
        // Update uniforms and buffers.
        program._setVertexUniform(glProgram, 'u_gpuio_positions', this._indexOfLayerInArray(positions, input), constants_1.INT);
        program._setVertexUniform(glProgram, 'u_gpuio_scale', [1 / _width, 1 / _height], constants_1.FLOAT);
        var positionLayerDimensions = [positions.width, positions.height];
        program._setVertexUniform(glProgram, 'u_gpuio_positionsDimensions', positionLayerDimensions, constants_1.FLOAT);
        // Only pass in indices if we are using indexed pts or GLSL1, otherwise we get this for free from gl_VertexID.
        if (params.indices || glslVersion === constants_1.GLSL1) {
            // TODO: cache indexArray if no indices passed in.
            var indices = params.indices ? params.indices : (0, utils_1.initSequentialFloatArray)(count);
            if (this._indexedLinesIndexBuffer === undefined) {
                // Have to use float32 array bc int is not supported as a vertex attribute type.
                var floatArray = void 0;
                if (indices.constructor !== Float32Array) {
                    // Have to use float32 array bc int is not supported as a vertex attribute type.
                    floatArray = new Float32Array(indices.length);
                    for (var i = 0; i < count; i++) {
                        floatArray[i] = indices[i];
                    }
                    console.warn("Converting indices array of type ".concat(indices.constructor, " to Float32Array in GPUComposer.drawIndexedLines for WebGL compatibility, you may want to use a Float32Array to store this information so the conversion is not required."));
                }
                else {
                    floatArray = indices;
                }
                this._indexedLinesIndexBuffer = this._initVertexBuffer(floatArray);
            }
            else {
                gl.bindBuffer(gl.ARRAY_BUFFER, this._indexedLinesIndexBuffer);
                // Copy buffer data.
                gl.bufferData(gl.ARRAY_BUFFER, indices, gl.STATIC_DRAW);
            }
            this._setIndexAttribute(glProgram, program.name);
        }
        // Draw.
        this._setBlendMode(params.shouldBlendAlpha);
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
    GPUComposer.prototype.drawLayerAsVectorField = function (params) {
        var _a = this, gl = _a.gl, _vectorFieldIndexArray = _a._vectorFieldIndexArray, _width = _a._width, _height = _a._height, glslVersion = _a.glslVersion;
        var data = params.data, output = params.output;
        // Check that field is valid.
        if (data.numComponents !== 2) {
            throw new Error("GPUComposer.drawLayerAsVectorField() must be passed a fieldLayer with 2 components, got fieldLayer \"".concat(data.name, "\" with ").concat(data.numComponents, " components."));
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
            program.setUniform('u_value', __spreadArray(__spreadArray([], color, true), [1], false), constants_1.FLOAT);
        }
        // Add data to end of input if needed.
        var input = this._addLayerToInputs(data, params.input);
        // Do setup - this must come first.
        var glProgram = this._drawSetup(program, constants_1.LAYER_VECTOR_FIELD_PROGRAM_NAME, {}, false, input, output);
        // Update uniforms and buffers.
        program._setVertexUniform(glProgram, 'u_gpuio_vectors', this._indexOfLayerInArray(data, input), constants_1.INT);
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
        this._setBlendMode(params.shouldBlendAlpha);
        gl.drawArrays(gl.LINES, 0, length);
        gl.disable(gl.BLEND);
    };
    GPUComposer.prototype.drawLayerMagnitude = function (params) {
        var gl = this.gl;
        var data = params.data, output = params.output;
        var program = this._vectorMagnitudeProgramForType(data.type);
        var color = params.color || [1, 0, 0]; // Default to red.
        program.setUniform('u_color', color, constants_1.FLOAT);
        var scale = params.scale || 1;
        program.setUniform('u_scale', scale, constants_1.FLOAT);
        program.setUniform('u_gpuio_numDimensions', data.numComponents, constants_1.INT);
        // Add data to end of input if needed.
        var input = this._addLayerToInputs(data, params.input);
        // Do setup - this must come first.
        var glProgram = this._drawSetup(program, constants_1.DEFAULT_PROGRAM_NAME, {}, true, input, output);
        // Update uniforms and buffers.
        program._setVertexUniform(glProgram, 'u_gpuio_data', this._indexOfLayerInArray(data, input), constants_1.INT);
        program._setVertexUniform(glProgram, 'u_gpuio_scale', [1, 1], constants_1.FLOAT);
        program._setVertexUniform(glProgram, 'u_gpuio_translation', [0, 0], constants_1.FLOAT);
        gl.bindBuffer(gl.ARRAY_BUFFER, this._getQuadPositionsBuffer());
        this._setPositionAttribute(glProgram, program.name);
        // Draw.
        this._setBlendMode(params.shouldBlendAlpha);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.disable(gl.BLEND);
    };
    GPUComposer.prototype.resetThreeState = function () {
        if (!this._renderer) {
            throw new Error('GPUComposer was not inited with a renderer, use GPUComposer.initWithThreeRenderer() to initialize GPUComposer instead.');
        }
        var gl = this.gl;
        // Reset viewport.
        var viewport = this._renderer.getViewport(new utils.Vector4());
        gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height);
        // Unbind framebuffer (render to screen).
        this._renderer.setRenderTarget(null);
        // Reset texture bindings.
        this._renderer.resetState();
    };
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
    GPUComposer.prototype.tick = function () {
        var _a = this, _lastTickTime = _a._lastTickTime, _lastTickFPS = _a._lastTickFPS;
        var currentTime = performance.now();
        this._lastTickTime = currentTime;
        if (!_lastTickTime) {
            return { fps: 0, milliseconds: 0 };
        }
        var currentFPS = 1000 / (currentTime - _lastTickTime);
        if (!_lastTickFPS)
            _lastTickFPS = currentFPS;
        // Use a low pass filter to smooth out fps reading.
        var factor = 0.9;
        var fps = Number.parseFloat((factor * _lastTickFPS + (1 - factor) * currentFPS).toFixed(1));
        this._lastTickFPS = fps;
        this._numTicks += 1;
        return {
            fps: fps,
            numTicks: this._numTicks,
        };
    };
    GPUComposer.prototype.dispose = function () {
        var _a;
        var _b = this, gl = _b.gl, verboseLogging = _b.verboseLogging, _vertexShaders = _b._vertexShaders, _copyPrograms = _b._copyPrograms, _setValuePrograms = _b._setValuePrograms, _vectorMagnitudePrograms = _b._vectorMagnitudePrograms;
        if (verboseLogging)
            console.log("Deallocating GPUComposer.");
        // TODO: delete buffers.
        // Delete vertex shaders.
        Object.values(_vertexShaders).forEach(function (_a) {
            var compiledShaders = _a.compiledShaders;
            Object.keys(compiledShaders).forEach(function (key) {
                gl.deleteShader(compiledShaders[key]);
                delete compiledShaders[key];
            });
        });
        // Delete fragment shaders.
        Object.values(_copyPrograms).forEach(function (program) {
            // @ts-ignore
            if (program.dispose)
                program.dispose();
        });
        Object.keys(_copyPrograms).forEach(function (key) {
            // @ts-ignore
            delete _copyPrograms[key];
        });
        Object.values(_setValuePrograms).forEach(function (program) {
            // @ts-ignore
            if (program.dispose)
                program.dispose();
        });
        Object.keys(_setValuePrograms).forEach(function (key) {
            // @ts-ignore
            delete _setValuePrograms[key];
        });
        Object.values(_vectorMagnitudePrograms).forEach(function (program) {
            // @ts-ignore
            if (program.dispose)
                program.dispose();
        });
        Object.keys(_vectorMagnitudePrograms).forEach(function (key) {
            // @ts-ignore
            delete _vectorMagnitudePrograms[key];
        });
        (_a = this._wrappedLineColorProgram) === null || _a === void 0 ? void 0 : _a.dispose();
        delete this._wrappedLineColorProgram;
        // @ts-ignore
        delete this._renderer;
        // @ts-ignore
        delete this.gl;
        // @ts-ignore;
        delete this.canvas;
        // GL context will be garbage collected by webgl.
    };
    return GPUComposer;
}());
exports.GPUComposer = GPUComposer;


/***/ }),

/***/ 355:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GPULayer = void 0;
var float16_1 = __webpack_require__(847);
// @ts-ignore
var changedpi_1 = __webpack_require__(809);
var file_saver_1 = __webpack_require__(162);
var checks_1 = __webpack_require__(707);
var constants_1 = __webpack_require__(601);
var utils_1 = __webpack_require__(593);
var GPULayerHelpers_1 = __webpack_require__(191);
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
     * @param params.wrapS - Horizontal wrapping style for GPULayer, defaults to CLAMP_TO_EDGE.
     * @param params.wrapT - Vertical wrapping style for GPULayer, defaults to CLAMP_TO_EDGE.
     * @param params.writable - Sets GPULayer as readonly or readwrite, defaults to false.
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
        if (!(0, checks_1.isObject)(params)) {
            throw new Error("Error initing GPULayer: must pass valid params object to GPULayer(composer, params), got ".concat(JSON.stringify(params), "."));
        }
        // Check params keys.
        var validKeys = ['name', 'type', 'numComponents', 'dimensions', 'filter', 'wrapS', 'wrapT', 'writable', 'numBuffers', 'clearValue', 'array'];
        var requiredKeys = ['name', 'type', 'numComponents', 'dimensions'];
        var keys = Object.keys(params);
        keys.forEach(function (key) {
            if (validKeys.indexOf(key) < 0) {
                throw new Error("Invalid params key \"".concat(key, "\" passed to GPULayer(composer, params) with name \"").concat(params.name, "\".  Valid keys are ").concat(JSON.stringify(validKeys), "."));
            }
        });
        // Check for required keys.
        requiredKeys.forEach(function (key) {
            if (keys.indexOf(key) < 0) {
                throw new Error("Required params key \"".concat(key, "\" was not passed to GPULayer(composer, params) with name \"").concat(name, "\"."));
            }
        });
        var dimensions = params.dimensions, type = params.type, numComponents = params.numComponents;
        var gl = composer.gl;
        // Save params.
        this._composer = composer;
        this.name = name;
        // numComponents must be between 1 and 4.
        if (!(0, checks_1.isPositiveInteger)(numComponents) || numComponents > 4) {
            throw new Error("Invalid numComponents: ".concat(JSON.stringify(numComponents), " for GPULayer \"").concat(name, "\", must be number in range [1-4]."));
        }
        this.numComponents = numComponents;
        // Writable defaults to false.
        var writable = !!params.writable;
        this.writable = writable;
        // Set dimensions, may be 1D or 2D.
        var _a = (0, GPULayerHelpers_1.calcGPULayerSize)(dimensions, name, composer.verboseLogging), length = _a.length, width = _a.width, height = _a.height;
        // We already type checked length, width, and height in calcGPULayerSize.
        this._length = length;
        this._width = width;
        this._height = height;
        // Set filtering - if we are processing a 1D array, default to NEAREST filtering.
        // Else default to LINEAR (interpolation) filtering for float types and NEAREST for integer types.
        var defaultFilter = length ? constants_1.NEAREST : ((type === constants_1.FLOAT || type == constants_1.HALF_FLOAT) ? constants_1.LINEAR : constants_1.NEAREST);
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
        var wrapS = params.wrapS !== undefined ? params.wrapS : constants_1.CLAMP_TO_EDGE;
        if (!(0, checks_1.isValidWrap)(wrapS)) {
            throw new Error("Invalid wrapS: ".concat(JSON.stringify(wrapS), " for GPULayer \"").concat(name, "\", must be one of ").concat(JSON.stringify(constants_1.validWraps), "."));
        }
        this.wrapS = wrapS;
        var wrapT = params.wrapT !== undefined ? params.wrapT : constants_1.CLAMP_TO_EDGE;
        if (!(0, checks_1.isValidWrap)(wrapT)) {
            throw new Error("Invalid wrapT: ".concat(JSON.stringify(wrapT), " for GPULayer \"").concat(name, "\", must be one of ").concat(JSON.stringify(constants_1.validWraps), "."));
        }
        this.wrapT = wrapT;
        // Set data type.
        if (!(0, checks_1.isValidDataType)(type)) {
            throw new Error("Invalid type: ".concat(JSON.stringify(type), " for GPULayer \"").concat(name, "\", must be one of ").concat(JSON.stringify(constants_1.validDataTypes), "."));
        }
        this.type = type;
        var internalType = (0, GPULayerHelpers_1.getGPULayerInternalType)({
            composer: composer,
            type: type,
            writable: writable,
            name: name,
        });
        this._internalType = internalType;
        // Set gl texture parameters.
        var _b = (0, GPULayerHelpers_1.getGLTextureParameters)({
            composer: composer,
            name: name,
            numComponents: numComponents,
            writable: writable,
            internalType: internalType,
        }), glFormat = _b.glFormat, glInternalFormat = _b.glInternalFormat, glType = _b.glType, glNumChannels = _b.glNumChannels;
        this._glInternalFormat = glInternalFormat;
        this._glFormat = glFormat;
        this._glType = glType;
        this._glNumChannels = glNumChannels;
        // Set internal filtering/wrap types.
        // Make sure that we set filter BEFORE setting wrap.
        var internalFilter = (0, GPULayerHelpers_1.getGPULayerInternalFilter)({ composer: composer, filter: filter, wrapS: wrapS, wrapT: wrapT, internalType: internalType, name: name });
        this._internalFilter = internalFilter;
        this._glFilter = gl[internalFilter];
        this._internalWrapS = (0, GPULayerHelpers_1.getGPULayerInternalWrap)({ composer: composer, wrap: wrapS, internalFilter: internalFilter, internalType: internalType, name: name });
        this._glWrapS = gl[this._internalWrapS];
        this._internalWrapT = (0, GPULayerHelpers_1.getGPULayerInternalWrap)({ composer: composer, wrap: wrapT, internalFilter: internalFilter, internalType: internalType, name: name });
        this._glWrapT = gl[this._internalWrapT];
        // Num buffers is the number of states to store for this data.
        var numBuffers = params.numBuffers !== undefined ? params.numBuffers : 1;
        if (!(0, checks_1.isPositiveInteger)(numBuffers)) {
            throw new Error("Invalid numBuffers: ".concat(JSON.stringify(numBuffers), " for GPULayer \"").concat(name, "\", must be positive integer."));
        }
        this.numBuffers = numBuffers;
        // Wait until after type has been set to set clearValue.
        if (params.clearValue !== undefined) {
            this.clearValue = params.clearValue; // Setter can only be called after this.numComponents has been set.
        }
        this._initBuffers(params.array);
    }
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
     *
     * @private
     */
    GPULayer.prototype._usingTextureOverrideForCurrentBuffer = function () {
        return this._textureOverrides && this._textureOverrides[this.bufferIndex];
    };
    // saveCurrentStateToGPULayer(layer: GPULayer) {
    // 	// A method for saving a copy of the current state without a draw call.
    // 	// Draw calls are expensive, this optimization helps.
    // 	if (this.numBuffers < 2) {
    // 		throw new Error(`Can't call GPULayer.saveCurrentStateToGPULayer on GPULayer "${this.name}" with less than 2 buffers.`);
    // 	}
    // 	if (!this.writable) {
    // 		throw new Error(`Can't call GPULayer.saveCurrentStateToGPULayer on read-only GPULayer "${this.name}".`);
    // 	}
    // 	if (layer.writable) {
    // 		throw new Error(`Can't call GPULayer.saveCurrentStateToGPULayer on GPULayer "${this.name}" using writable GPULayer "${layer.name}".`)
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
    // 	if (this.writable) {
    // 		throw new Error(`Can't call GPULayer._setCurrentStateTexture on writable texture "${this.name}".`);
    // 	}
    // 	this.buffers[this.bufferIndex].texture = texture;
    // }
    /**
     * Init GLTexture/GLFramebuffer pairs for reading/writing GPULayer data.
     * @private
     */
    GPULayer.prototype._initBuffers = function (array) {
        var _a = this, name = _a.name, numBuffers = _a.numBuffers, _composer = _a._composer, _glInternalFormat = _a._glInternalFormat, _glFormat = _a._glFormat, _glType = _a._glType, _glFilter = _a._glFilter, _glWrapS = _a._glWrapS, _glWrapT = _a._glWrapT, writable = _a.writable, width = _a.width, height = _a.height;
        var gl = _composer.gl, _errorCallback = _composer._errorCallback;
        var validatedArray = array ? (0, GPULayerHelpers_1.validateGPULayerArray)(array, this) : undefined;
        // Init a texture for each buffer.
        for (var i = 0; i < numBuffers; i++) {
            var texture = gl.createTexture();
            if (!texture) {
                _errorCallback("Could not init texture for GPULayer \"".concat(name, "\": ").concat(gl.getError(), "."));
                return;
            }
            gl.bindTexture(gl.TEXTURE_2D, texture);
            // TODO: are there other params to look into:
            // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, _glWrapS);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, _glWrapT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, _glFilter);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, _glFilter);
            gl.texImage2D(gl.TEXTURE_2D, 0, _glInternalFormat, width, height, 0, _glFormat, _glType, validatedArray ? validatedArray : null);
            var buffer = {
                texture: texture,
            };
            if (writable) {
                // Init a framebuffer for this texture so we can write to it.
                var framebuffer = gl.createFramebuffer();
                if (!framebuffer) {
                    _errorCallback("Could not init framebuffer for GPULayer \"".concat(name, "\": ").concat(gl.getError(), "."));
                    return;
                }
                gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
                // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/framebufferTexture2D
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
                var status_1 = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
                if (status_1 !== gl.FRAMEBUFFER_COMPLETE) {
                    _errorCallback("Invalid status for framebuffer for GPULayer \"".concat(name, "\": ").concat(status_1, "."));
                }
                // Add framebuffer.
                buffer.framebuffer = framebuffer;
            }
            // Save this buffer to the list.
            this._buffers.push(buffer);
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
        // if (_textureOverrides && _textureOverrides[index]) return _textureOverrides[index]!;
        return {
            texture: _buffers[index].texture,
            layer: this,
        };
    };
    /**
     * Binds this GPULayer's current framebuffer as the draw target.
     */
    GPULayer.prototype._bindFramebuffer = function () {
        var gl = this._composer.gl;
        var framebuffer = this._buffers[this.bufferIndex].framebuffer;
        if (!framebuffer) {
            throw new Error("GPULayer \"".concat(this.name, "\" is not writable."));
        }
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    };
    /**
     * Increments the buffer index (if needed) and binds next framebuffer as draw target.
     * @private
     */
    GPULayer.prototype._prepareForWrite = function (incrementBufferIndex) {
        if (incrementBufferIndex) {
            this.incrementBufferIndex();
        }
        this._bindFramebuffer();
        // We are going to do a data write, if we have overrides enabled, we can remove them.
        if (this._textureOverrides) {
            this._textureOverrides[this.bufferIndex] = undefined;
        }
    };
    GPULayer.prototype.setFromArray = function (array, applyToAllBuffers) {
        if (applyToAllBuffers === void 0) { applyToAllBuffers = false; }
        var _a = this, _composer = _a._composer, _glInternalFormat = _a._glInternalFormat, _glFormat = _a._glFormat, _glType = _a._glType, numBuffers = _a.numBuffers, width = _a.width, height = _a.height, bufferIndex = _a.bufferIndex;
        var gl = _composer.gl;
        var validatedArray = (0, GPULayerHelpers_1.validateGPULayerArray)(array, this);
        // TODO: check that this is working.
        var startIndex = applyToAllBuffers ? 0 : bufferIndex;
        var endIndex = applyToAllBuffers ? numBuffers : bufferIndex + 1;
        for (var i = startIndex; i < endIndex; i++) {
            var texture = this.getStateAtIndex(i).texture;
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, _glInternalFormat, width, height, 0, _glFormat, _glType, validatedArray);
        }
        // Unbind texture.
        gl.bindTexture(gl.TEXTURE_2D, null);
    };
    GPULayer.prototype.resize = function (dimensions, array) {
        var _a = this, name = _a.name, _composer = _a._composer;
        var verboseLogging = _composer.verboseLogging;
        if (verboseLogging)
            console.log("Resizing GPULayer \"".concat(name, "\" to ").concat(JSON.stringify(dimensions), "."));
        var _b = (0, GPULayerHelpers_1.calcGPULayerSize)(dimensions, name, verboseLogging), length = _b.length, width = _b.width, height = _b.height;
        this._length = length;
        this._width = width;
        this._height = height;
        this._destroyBuffers();
        this._initBuffers(array);
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
            this._clearValue = (0, checks_1.isArray)(clearValue) ? clearValue.slice() : clearValue;
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
        var _a = this, name = _a.name, _composer = _a._composer, clearValue = _a.clearValue, numBuffers = _a.numBuffers, bufferIndex = _a.bufferIndex, type = _a.type;
        var verboseLogging = _composer.verboseLogging;
        if (verboseLogging)
            console.log("Clearing GPULayer \"".concat(name, "\"."));
        var value = [];
        if ((0, checks_1.isNumber)(clearValue)) {
            value.push(clearValue, clearValue, clearValue, clearValue);
        }
        else {
            value.push.apply(value, clearValue);
            for (var j = value.length; j < 4; j++) {
                value.push(0);
            }
        }
        var startIndex = applyToAllBuffers ? 0 : bufferIndex;
        var endIndex = applyToAllBuffers ? numBuffers : bufferIndex + 1;
        if (this.writable) {
            var program = _composer._setValueProgramForType(type);
            program.setUniform('u_value', value);
            for (var i = startIndex; i < endIndex; i++) {
                // Write clear value to buffers.
                _composer.step({
                    program: program,
                    output: this,
                });
            }
        }
        else {
            // Init a typed array containing clearValue and pass to buffers.
            var _b = this, width = _b.width, height = _b.height, _glNumChannels = _b._glNumChannels, _internalType = _b._internalType, _glInternalFormat = _b._glInternalFormat, _glFormat = _b._glFormat, _glType = _b._glType;
            var gl = _composer.gl;
            var fillLength = this._length ? this._length : width * height;
            var array = (0, GPULayerHelpers_1.initArrayForType)(_internalType, width * height * _glNumChannels);
            var float16View = _internalType === constants_1.HALF_FLOAT ? new DataView(array.buffer) : null;
            for (var j = 0; j < fillLength; j++) {
                for (var k = 0; k < _glNumChannels; k++) {
                    var index = j * _glNumChannels + k;
                    if (_internalType === constants_1.HALF_FLOAT) {
                        // Float16 needs to be handled separately.
                        (0, float16_1.setFloat16)(float16View, 2 * index, value[k], true);
                    }
                    else {
                        array[index] = value[k];
                    }
                }
            }
            for (var i = startIndex; i < endIndex; i++) {
                var texture = this.getStateAtIndex(i).texture;
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, _glInternalFormat, width, height, 0, _glFormat, _glType, array);
            }
            // Unbind texture.
            gl.bindTexture(gl.TEXTURE_2D, null);
        }
    };
    // TODO: this does not work on non-writable GPULayers, change this?
    /**
     * Returns the current values of the GPULayer as a TypedArray.
     * @returns - A TypedArray containing current state of GPULayer.
     */
    GPULayer.prototype.getValues = function () {
        var _a = this, width = _a.width, height = _a.height, _composer = _a._composer, numComponents = _a.numComponents, type = _a.type;
        var gl = _composer.gl;
        // In case GPULayer was not the last output written to.
        this._bindFramebuffer();
        var _b = this, _glNumChannels = _b._glNumChannels, _glType = _b._glType, _glFormat = _b._glFormat, _internalType = _b._internalType;
        var values;
        switch (_internalType) {
            case constants_1.HALF_FLOAT:
                if (gl.FLOAT !== undefined) {
                    // Firefox requires that RGBA/FLOAT is used for readPixels of float16 types.
                    _glNumChannels = 4;
                    _glFormat = gl.RGBA;
                    _glType = gl.FLOAT;
                    values = new Float32Array(width * height * _glNumChannels);
                }
                else {
                    values = new Uint16Array(width * height * _glNumChannels);
                }
                // // The following works in Chrome.
                // values = new Uint16Array(width * height * glNumChannels);
                break;
            case constants_1.FLOAT:
                // Chrome and Firefox require that RGBA/FLOAT is used for readPixels of float32 types.
                // https://github.com/KhronosGroup/WebGL/issues/2747
                _glNumChannels = 4;
                _glFormat = gl.RGBA;
                values = new Float32Array(width * height * _glNumChannels);
                break;
            case constants_1.UNSIGNED_BYTE:
                // We never hit glslVersion === GLSL1 anymore, see GPULayerHelpers.shouldCastIntTypeAsFloat for more info.
                // if (glslVersion === GLSL1) {
                // 	// Firefox requires that RGBA/UNSIGNED_BYTE is used for readPixels of unsigned byte types.
                // 	_glNumChannels = 4;
                // 	_glFormat = gl.RGBA;
                // 	values = new Uint8Array(width * height * _glNumChannels);
                // 	break;
                // }
                // Firefox requires that RGBA_INTEGER/UNSIGNED_INT is used for readPixels of unsigned int types.
                _glNumChannels = 4;
                _glFormat = gl.RGBA_INTEGER;
                _glType = gl.UNSIGNED_INT;
                values = new Uint32Array(width * height * _glNumChannels);
                // // The following works in Chrome.
                // values = new Uint8Array(width * height * glNumChannels);
                break;
            case constants_1.UNSIGNED_SHORT:
                // Firefox requires that RGBA_INTEGER/UNSIGNED_INT is used for readPixels of unsigned int types.
                _glNumChannels = 4;
                _glFormat = gl.RGBA_INTEGER;
                _glType = gl.UNSIGNED_INT;
                values = new Uint32Array(width * height * _glNumChannels);
                // // The following works in Chrome.
                // values = new Uint16Array(width * height * glNumChannels);
                break;
            case constants_1.UNSIGNED_INT:
                // Firefox requires that RGBA_INTEGER/UNSIGNED_INT is used for readPixels of unsigned int types.
                _glNumChannels = 4;
                _glFormat = gl.RGBA_INTEGER;
                values = new Uint32Array(width * height * _glNumChannels);
                // // The following works in Chrome.
                // values = new Uint32Array(width * height * glNumChannels);
                break;
            case constants_1.BYTE:
                // Firefox requires that RGBA_INTEGER/INT is used for readPixels of int types.
                _glNumChannels = 4;
                _glFormat = gl.RGBA_INTEGER;
                _glType = gl.INT;
                values = new Int32Array(width * height * _glNumChannels);
                // // The following works in Chrome.
                // values = new Int8Array(width * height * glNumChannels);
                break;
            case constants_1.SHORT:
                // Firefox requires that RGBA_INTEGER/INT is used for readPixels of int types.
                _glNumChannels = 4;
                _glFormat = gl.RGBA_INTEGER;
                _glType = gl.INT;
                values = new Int32Array(width * height * _glNumChannels);
                // // The following works in Chrome.
                // values = new Int16Array(width * height * glNumChannels);
                break;
            case constants_1.INT:
                // Firefox requires that RGBA_INTEGER/INT is used for readPixels of int types.
                _glNumChannels = 4;
                _glFormat = gl.RGBA_INTEGER;
                values = new Int32Array(width * height * _glNumChannels);
                // // The following works in Chrome.
                // values = new Int32Array(width * height * glNumChannels);
                break;
            default:
                throw new Error("Unsupported internalType ".concat(_internalType, " for getValues()."));
        }
        if ((0, utils_1.readyToRead)(gl)) {
            // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/readPixels
            gl.readPixels(0, 0, width, height, _glFormat, _glType, values);
            var OUTPUT_LENGTH = (this._length ? this._length : width * height) * numComponents;
            // Convert uint16 to float32 if needed.
            var handleFloat16Conversion = _internalType === constants_1.HALF_FLOAT && values.constructor === Uint16Array;
            // @ts-ignore
            var view = handleFloat16Conversion ? new DataView(values.buffer) : undefined;
            // We may use a different internal type than the assigned type of the GPULayer.
            var output = _internalType === type ? values : (0, GPULayerHelpers_1.initArrayForType)(type, OUTPUT_LENGTH, true);
            // In some cases glNumChannels may be > numComponents.
            if (view || output !== values || numComponents !== _glNumChannels) {
                for (var i = 0, length_1 = width * height; i < length_1; i++) {
                    var index1 = i * _glNumChannels;
                    var index2 = i * numComponents;
                    if (index2 >= OUTPUT_LENGTH)
                        break;
                    for (var j = 0; j < numComponents; j++) {
                        if (view) {
                            output[index2 + j] = (0, float16_1.getFloat16)(view, 2 * (index1 + j), true);
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
            throw new Error("Unable to read values from Buffer with status: ".concat(gl.checkFramebufferStatus(gl.FRAMEBUFFER), "."));
        }
    };
    // TODO: this does not work on non-writable GPULayers, change this?
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
        var _renderer = _composer._renderer;
        if (!_renderer) {
            throw new Error('GPUComposer was not inited with a renderer.');
        }
        // Link webgl texture to threejs object.
        // This is not officially supported.
        if (numBuffers > 1) {
            throw new Error("GPULayer \"".concat(name, "\" contains multiple WebGL textures (one for each buffer) that are flip-flopped during compute cycles, please choose a GPULayer with one buffer."));
        }
        var offsetTextureProperties = _renderer.properties.get(texture);
        offsetTextureProperties.__webglTexture = currentState;
        offsetTextureProperties.__webglInit = true;
    };
    /**
     * Delete this GPULayer's framebuffers and textures.
     * @private
     */
    GPULayer.prototype._destroyBuffers = function () {
        var _a = this, _composer = _a._composer, _buffers = _a._buffers;
        var gl = _composer.gl;
        _buffers.forEach(function (buffer) {
            var framebuffer = buffer.framebuffer, texture = buffer.texture;
            gl.deleteTexture(texture);
            if (framebuffer) {
                gl.deleteFramebuffer(framebuffer);
            }
            // @ts-ignore
            delete buffer.texture;
            delete buffer.framebuffer;
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
    };
    return GPULayer;
}());
exports.GPULayer = GPULayer;


/***/ }),

/***/ 191:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.validateGPULayerArray = exports.minMaxValuesForType = exports.getGPULayerInternalType = exports.testFilterWrap = exports.testWriteSupport = exports.getGLTextureParameters = exports.shouldCastIntTypeAsFloat = exports.getGPULayerInternalFilter = exports.getGPULayerInternalWrap = exports.calcGPULayerSize = exports.initArrayForType = void 0;
var float16_1 = __webpack_require__(847);
var checks_1 = __webpack_require__(707);
var constants_1 = __webpack_require__(601);
var extensions_1 = __webpack_require__(581);
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
function initArrayForType(type, length, halfFloatsAsFloats) {
    if (halfFloatsAsFloats === void 0) { halfFloatsAsFloats = false; }
    switch (type) {
        case constants_1.HALF_FLOAT:
            if (halfFloatsAsFloats)
                return new Float32Array(length);
            return new Uint16Array(length);
        case constants_1.FLOAT:
            return new Float32Array(length);
        case constants_1.UNSIGNED_BYTE:
            return new Uint8Array(length);
        case constants_1.BYTE:
            return new Int8Array(length);
        case constants_1.UNSIGNED_SHORT:
            return new Uint16Array(length);
        case constants_1.SHORT:
            return new Int16Array(length);
        case constants_1.UNSIGNED_INT:
            return new Uint32Array(length);
        case constants_1.INT:
            return new Int32Array(length);
        default:
            throw new Error("Unsupported type: \"".concat(type, "\"."));
    }
}
exports.initArrayForType = initArrayForType;
/**
 * Calc 2D size [width, height] for GPU layer given a 1D or 2D size parameter.
 * If 1D size supplied, nearest power of 2 width/height is generated.
 * Also checks that size elements are valid.
 * @private
 */
// TODO: should we relax adherence to power of 2?
function calcGPULayerSize(size, name, verboseLogging) {
    if ((0, checks_1.isNumber)(size)) {
        if (!(0, checks_1.isPositiveInteger)(size)) {
            throw new Error("Invalid length: ".concat(JSON.stringify(size), " for GPULayer \"").concat(name, "\", must be positive integer."));
        }
        var length_1 = size;
        // Calc power of two width and height for length.
        var exp = 1;
        var remainder = length_1;
        while (remainder > 2) {
            exp++;
            remainder /= 2;
        }
        var width_1 = Math.pow(2, Math.floor(exp / 2) + exp % 2);
        var height_1 = Math.pow(2, Math.floor(exp / 2));
        if (verboseLogging)
            console.log("Using [".concat(width_1, ", ").concat(height_1, "] for 1D array of length ").concat(size, " in GPULayer \"").concat(name, "\"."));
        return { width: width_1, height: height_1, length: length_1 };
    }
    var width = size[0];
    if (!(0, checks_1.isPositiveInteger)(width)) {
        throw new Error("Invalid width: ".concat(JSON.stringify(width), " for GPULayer \"").concat(name, "\", must be positive integer."));
    }
    var height = size[1];
    if (!(0, checks_1.isPositiveInteger)(height)) {
        throw new Error("Invalid height: ".concat(JSON.stringify(height), " for GPULayer \"").concat(name, "\", must be positive integer."));
    }
    return { width: width, height: height };
}
exports.calcGPULayerSize = calcGPULayerSize;
/**
 * Get the GL wrap type to use internally in GPULayer, based on browser support.
 * @private
 */
function getGPULayerInternalWrap(params) {
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
}
exports.getGPULayerInternalWrap = getGPULayerInternalWrap;
/**
 * Get the GL filter type to use internally in GPULayer, based on browser support.
 * @private
 */
function getGPULayerInternalFilter(params) {
    var filter = params.filter;
    if (filter === constants_1.NEAREST) {
        // NEAREST filtering is always supported.
        return filter;
    }
    var composer = params.composer, internalType = params.internalType, wrapS = params.wrapS, wrapT = params.wrapT, name = params.name;
    if (internalType === constants_1.HALF_FLOAT) {
        var extension = (0, extensions_1.getExtension)(composer, extensions_1.OES_TEXTURE_HAlF_FLOAT_LINEAR, true)
            || (0, extensions_1.getExtension)(composer, extensions_1.OES_TEXTURE_FLOAT_LINEAR, true);
        if (!extension || !testFilterWrap(composer, internalType, filter, wrapS) || !testFilterWrap(composer, internalType, filter, wrapT)) {
            console.warn("This browser does not support ".concat(filter, " filtering for type ").concat(internalType, " and wrap [").concat(wrapS, ", ").concat(wrapT, "].  Falling back to NEAREST filter for GPULayer \"").concat(name, "\" with ").concat(filter, " polyfill in fragment shader."));
            filter = constants_1.NEAREST; // Polyfill in fragment shader.
        }
    }
    if (internalType === constants_1.FLOAT) {
        var extension = (0, extensions_1.getExtension)(composer, extensions_1.OES_TEXTURE_FLOAT_LINEAR, true);
        if (!extension || !testFilterWrap(composer, internalType, filter, wrapS) || !testFilterWrap(composer, internalType, filter, wrapT)) {
            console.warn("This browser does not support ".concat(filter, " filtering for type ").concat(internalType, " and wrap [").concat(wrapS, ", ").concat(wrapT, "].  Falling back to NEAREST filter for GPULayer \"").concat(name, "\" with ").concat(filter, " polyfill in fragment shader."));
            filter = constants_1.NEAREST; // Polyfill in fragment shader.
        }
    }
    return filter;
}
exports.getGPULayerInternalFilter = getGPULayerInternalFilter;
/**
 * Returns whether to cast int type as floats, as needed by browser.
 * @private
 */
function shouldCastIntTypeAsFloat(composer, type) {
    var gl = composer.gl, glslVersion = composer.glslVersion;
    // All types are supported by WebGL2 + glsl3.
    if (glslVersion === constants_1.GLSL3 && (0, utils_1.isWebGL2)(gl))
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
function getGLTextureParameters(params) {
    var composer = params.composer, name = params.name, numComponents = params.numComponents, internalType = params.internalType, writable = params.writable;
    var gl = composer.gl, glslVersion = composer.glslVersion;
    // https://www.khronos.org/registry/webgl/specs/latest/2.0/#TEXTURE_TYPES_FORMATS_FROM_DOM_ELEMENTS_TABLE
    var glType, glFormat, glInternalFormat, glNumChannels;
    if ((0, utils_1.isWebGL2)(gl)) {
        glNumChannels = numComponents;
        // https://www.khronos.org/registry/webgl/extensions/EXT_color_buffer_float/
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D
        // The sized internal format RGBxxx are not color-renderable for some reason.
        // If numComponents == 3 for a writable texture, use RGBA instead.
        // Page 5 of https://www.khronos.org/files/webgl20-reference-guide.pdf
        if (numComponents === 3 && writable) {
            glNumChannels = 4;
        }
        if (internalType === constants_1.FLOAT || internalType === constants_1.HALF_FLOAT) {
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
                    throw new Error("Unsupported glNumChannels: ".concat(glNumChannels, " for GPULayer \"").concat(name, "\"."));
            }
            // The following lines of code are not hit now that we have cast UNSIGNED_BYTE types to HALF_FLOAT.
            // See comments in shouldCastIntTypeAsFloat for more information.
            // } else if (glslVersion === GLSL1 && internalType === UNSIGNED_BYTE) {
            // 	// Don't use gl.ALPHA or gl.LUMINANCE_ALPHA here bc we should expect the values in the R and RG channels.
            // 	if (writable) {
            // 		// For read only UNSIGNED_BYTE textures in GLSL 1, use RGBA.
            // 		glNumChannels = 4;
            // 	}
            // 	// For read only UNSIGNED_BYTE textures in GLSL 1, use RGB/RGBA.
            // 	switch (glNumChannels) {
            // 		case 1:
            // 		case 2:
            // 		case 3:
            // 			glFormat = gl.RGB;
            // 			glNumChannels = 3;
            // 			break;
            // 		case 4:
            // 			glFormat = gl.RGBA;
            // 			glNumChannels = 4;
            // 			break;
            // 		default:
            // 			throw new Error(`Unsupported glNumChannels: ${glNumChannels} for GPULayer "${name}".`);
            // 	}
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
                case 3:
                    glFormat = gl.RGB_INTEGER;
                    break;
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
                    case 3:
                        glInternalFormat = gl.RGB16F;
                        break;
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
                    case 3:
                        glInternalFormat = gl.RGB32F;
                        break;
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
                        case 3:
                            glInternalFormat = gl.RGB8UI;
                            break;
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
                    case 3:
                        glInternalFormat = gl.RGB8I;
                        break;
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
                    case 3:
                        glInternalFormat = gl.RGB16I;
                        break;
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
                    case 3:
                        glInternalFormat = gl.RGB16UI;
                        break;
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
                    case 3:
                        glInternalFormat = gl.RGB32I;
                        break;
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
                    case 3:
                        glInternalFormat = gl.RGB32UI;
                        break;
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
        // Don't use gl.ALPHA or gl.LUMINANCE_ALPHA here bc we should expect the values in the R and RG channels.
        glNumChannels = numComponents;
        if (writable) {
            // For writable textures in WebGL 1, use RGBA.
            glNumChannels = 4;
        }
        // For read only textures in WebGL 1, use RGB/RGBA.
        switch (glNumChannels) {
            case 1:
            case 2:
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
                throw new Error("Unsupported numComponents: ".concat(numComponents, " for GPULayer \"").concat(name, "\"."));
        }
        switch (internalType) {
            case constants_1.FLOAT:
                glType = gl.FLOAT;
                break;
            case constants_1.HALF_FLOAT:
                glType = gl.HALF_FLOAT || (0, extensions_1.getExtension)(composer, extensions_1.OES_TEXTURE_HALF_FLOAT).HALF_FLOAT_OES;
                break;
            case constants_1.UNSIGNED_BYTE:
                glType = gl.UNSIGNED_BYTE;
                break;
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
}
exports.getGLTextureParameters = getGLTextureParameters;
/**
 * Rigorous method for testing FLOAT and HALF_FLOAT write support by attaching texture to framebuffer.
 * @private
 */
function testWriteSupport(composer, internalType) {
    var gl = composer.gl, glslVersion = composer.glslVersion;
    // Memoize results for a given set of inputs.
    var key = "".concat((0, utils_1.isWebGL2)(gl), ",").concat(internalType, ",").concat(glslVersion === constants_1.GLSL3 ? '3' : '1');
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
    var _a = getGLTextureParameters({
        composer: composer,
        name: 'testWriteSupport',
        numComponents: 1,
        writable: true,
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
    var gl = composer.gl, glslVersion = composer.glslVersion, intPrecision = composer.intPrecision, floatPrecision = composer.floatPrecision, _errorCallback = composer._errorCallback;
    // Memoize results for a given set of inputs.
    var key = "".concat((0, utils_1.isWebGL2)(gl), ",").concat(internalType, ",").concat(filter, ",").concat(wrap, ",").concat(glslVersion === constants_1.GLSL3 ? '3' : '1');
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
    var _b = getGLTextureParameters({
        composer: composer,
        name: 'testFilterWrap',
        numComponents: numComponents,
        internalType: internalType,
        writable: true,
    }), glInternalFormat = _b.glInternalFormat, glFormat = _b.glFormat, glType = _b.glType, glNumChannels = _b.glNumChannels;
    // Init texture with values.
    var values = [3, 56.5, 834, -53.6, 0.003, 96.2, 23, 90.2, 32];
    var valuesTyped = initArrayForType(internalType, values.length * glNumChannels, true);
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
        wrapS: constants_1.CLAMP_TO_EDGE,
        wrapT: constants_1.CLAMP_TO_EDGE,
        filter: constants_1.NEAREST,
        writable: true,
    });
    var offset = filter === constants_1.LINEAR ? 0.5 : 1;
    // Run program to perform linear filter.
    var programName = 'testFilterWrap-program';
    var fragmentShaderSource = "\nin vec2 v_uv;\nuniform vec2 u_offset;\n#ifdef GPUIO_INT\n\tuniform isampler2D u_input;\n\tout int out_fragColor;\n#endif\n#ifdef GPUIO_UINT\n\tuniform usampler2D u_input;\n\tout uint out_fragColor;\n#endif\n#ifdef GPUIO_FLOAT\n\tuniform sampler2D u_input;\n\tout float out_fragColor;\n#endif\nvoid main() {\n\tout_fragColor = texture(u_input, v_uv + offset).x;\n}";
    if (glslVersion !== constants_1.GLSL3) {
        fragmentShaderSource = (0, utils_1.convertFragmentShaderToGLSL1)(fragmentShaderSource, programName);
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
function getGPULayerInternalType(params) {
    var composer = params.composer, writable = params.writable, name = params.name;
    var gl = composer.gl, _errorCallback = composer._errorCallback;
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
    if (!(0, utils_1.isWebGL2)(gl)) {
        if (internalType === constants_1.FLOAT) {
            // The OES_texture_float extension implicitly enables WEBGL_color_buffer_float extension (for writing).
            var extension = (0, extensions_1.getExtension)(composer, extensions_1.OES_TEXTURE_FLOAT, true);
            if (!extension) {
                console.warn("FLOAT not supported in this browser, falling back to HALF_FLOAT type for GPULayer \"".concat(name, "\"."));
                internalType = constants_1.HALF_FLOAT;
                // https://stackoverflow.com/questions/17476632/webgl-extension-support-across-browsers
                // Rendering to a floating-point texture may not be supported, even if the OES_texture_float extension
                // is supported. Typically, this fails on mobile hardware. To check if this is supported, you have to
                // call the WebGL checkFramebufferStatus() function after attempting to attach texture to framebuffer.
            }
            else if (writable) {
                var valid = testWriteSupport(composer, internalType);
                if (!valid) {
                    console.warn("FLOAT not supported for writing operations in this browser, falling back to HALF_FLOAT type for GPULayer \"".concat(name, "\"."));
                    internalType = constants_1.HALF_FLOAT;
                }
            }
        }
        // Must support at least half float if using a float type.
        if (internalType === constants_1.HALF_FLOAT) {
            // The OES_texture_half_float extension implicitly enables EXT_color_buffer_half_float extension (for writing).
            (0, extensions_1.getExtension)(composer, extensions_1.OES_TEXTURE_HALF_FLOAT);
            // TODO: https://stackoverflow.com/questions/54248633/cannot-create-half-float-oes-texture-from-uint16array-on-ipad
            if (writable) {
                var valid = testWriteSupport(composer, internalType);
                if (!valid) {
                    _errorCallback("This browser does not support rendering to HALF_FLOAT textures.");
                }
            }
        }
    }
    else if (writable) {
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
                (0, extensions_1.getExtension)(composer, extensions_1.EXT_COLOR_BUFFER_FLOAT);
            }
            // Test attaching texture to framebuffer to be sure half float writing is supported.
            var valid = testWriteSupport(composer, internalType);
            if (!valid) {
                _errorCallback("This browser does not support rendering to HALF_FLOAT textures.");
            }
        }
    }
    return internalType;
}
exports.getGPULayerInternalType = getGPULayerInternalType;
/**
 * Min and max values for types.
 * @private
 */
function minMaxValuesForType(type) {
    // Get min and max values for int types.
    var min = -Infinity;
    var max = Infinity;
    switch (type) {
        // TODO: handle float types?
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
function validateGPULayerArray(array, layer) {
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
        validatedArray = initArrayForType(internalType, arrayLength);
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
}
exports.validateGPULayerArray = validateGPULayerArray;


/***/ }),

/***/ 664:
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
exports.GPUProgram = void 0;
var checks_1 = __webpack_require__(707);
var constants_1 = __webpack_require__(601);
var utils_1 = __webpack_require__(593);
var polyfills_1 = __webpack_require__(360);
var GPUProgram = /** @class */ (function () {
    /**
     * Create a GPUProgram.
     * @param composer - The current GPUComposer instance.
     * @param params - GPUProgram parameters.
     * @param params.name - Name of GPUProgram, used for error logging.
     * @param params.fragmentShader - Fragment shader source or array of sources to be joined.
     * @param params.uniforms - Array of uniforms to initialize with GPUProgram.  More uniforms can be added later with GPUProgram.setUniform().
     * @param params.defines - Compile-time #define variables to include with fragment shader.
     */
    function GPUProgram(composer, params) {
        var _this = this;
        // Compiled fragment shaders (we hang onto different versions depending on compile-time variables).
        this._fragmentShaders = {};
        // #define variables for fragment shader program.
        this._defines = {};
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
        if (!(0, checks_1.isObject)(params)) {
            throw new Error("Error initing GPUProgram: must pass valid params object to GPUProgram(composer, params), got ".concat(JSON.stringify(params), "."));
        }
        // Check params keys.
        var validKeys = ['name', 'fragmentShader', 'uniforms', 'defines'];
        var requiredKeys = ['name', 'fragmentShader'];
        var keys = Object.keys(params);
        keys.forEach(function (key) {
            if (validKeys.indexOf(key) < 0) {
                throw new Error("Invalid params key \"".concat(key, "\" passed to GPUProgram(composer, params) with name \"").concat(name, "\".  Valid keys are ").concat(JSON.stringify(validKeys), "."));
            }
        });
        // Check for required keys.
        requiredKeys.forEach(function (key) {
            if (keys.indexOf(key) < 0) {
                throw new Error("Required params key \"".concat(key, "\" was not passed to GPUProgram(composer, params) with name \"").concat(name, "\"."));
            }
        });
        var fragmentShader = params.fragmentShader, uniforms = params.uniforms, defines = params.defines;
        // Save arguments.
        this._composer = composer;
        this.name = name;
        // Preprocess fragment shader source.
        var fragmentShaderSource = (0, checks_1.isString)(fragmentShader) ?
            fragmentShader :
            fragmentShader.join('\n');
        var _a = (0, utils_1.preprocessFragmentShader)(fragmentShaderSource, composer.glslVersion, name), shaderSource = _a.shaderSource, samplerUniforms = _a.samplerUniforms;
        this._fragmentShaderSource = shaderSource;
        samplerUniforms.forEach(function (name, i) {
            _this._samplerUniformsIndices.push({
                name: name,
                inputIndex: 0,
                shaderIndex: i,
            });
        });
        // Save defines.
        if (defines) {
            this._defines = __assign({}, defines);
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
     * Get fragment shader for GPUProgram, compile new onw if needed.
     * Used internally.
     * @private
     */
    GPUProgram.prototype._getFragmentShader = function (fragmentId, internalDefines) {
        var _fragmentShaders = this._fragmentShaders;
        if (_fragmentShaders[fragmentId]) {
            // No need to recompile.
            return _fragmentShaders[fragmentId];
        }
        var _a = this, _composer = _a._composer, name = _a.name, _fragmentShaderSource = _a._fragmentShaderSource, _defines = _a._defines;
        var gl = _composer.gl, _errorCallback = _composer._errorCallback, verboseLogging = _composer.verboseLogging, glslVersion = _composer.glslVersion, floatPrecision = _composer.floatPrecision, intPrecision = _composer.intPrecision;
        // Update internalDefines.
        var keys = Object.keys(internalDefines);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            _defines[key] = internalDefines[key];
        }
        if (verboseLogging)
            console.log("Compiling fragment shader for GPUProgram \"".concat(name, "\" with defines: ").concat(JSON.stringify(_defines)));
        var shader = (0, utils_1.compileShader)(gl, glslVersion, intPrecision, floatPrecision, _fragmentShaderSource, gl.FRAGMENT_SHADER, name, _errorCallback, _defines, Object.keys(_fragmentShaders).length === 0);
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
    GPUProgram.prototype._getProgramWithName = function (name, vertexDefines, input) {
        var _a = this, _samplerUniformsIndices = _a._samplerUniformsIndices, _composer = _a._composer;
        var fragmentID = '';
        var fragmentDefines = {};
        for (var i = 0, length_1 = _samplerUniformsIndices.length; i < length_1; i++) {
            var inputIndex = _samplerUniformsIndices[i].inputIndex;
            var layer = input[inputIndex].layer;
            var filter = layer.filter, wrapS = layer.wrapS, wrapT = layer.wrapT, type = layer.type, _internalFilter = layer._internalFilter, _internalWrapS = layer._internalWrapS, _internalWrapT = layer._internalWrapT;
            var wrapXVal = wrapS === _internalWrapS ? 0 : (wrapS === constants_1.REPEAT ? 1 : 0);
            var wrapYVal = wrapT === _internalWrapT ? 0 : (wrapT === constants_1.REPEAT ? 1 : 0);
            var filterVal = filter === _internalFilter ? 0 : (filter === constants_1.LINEAR ? 1 : 0);
            fragmentID += "_IN".concat(i, "_").concat(wrapXVal, "_").concat(wrapYVal, "_").concat(filterVal);
            fragmentDefines["".concat(polyfills_1.SAMPLER2D_WRAP_X).concat(i)] = "".concat(wrapXVal);
            fragmentDefines["".concat(polyfills_1.SAMPLER2D_WRAP_Y).concat(i)] = "".concat(wrapYVal);
            fragmentDefines["".concat(polyfills_1.SAMPLER2D_FILTER).concat(i)] = "".concat(filterVal);
            if (_composer.glslVersion === constants_1.GLSL1 && (0, utils_1.isIntType)(type)) {
                fragmentDefines["".concat(polyfills_1.SAMPLER2D_CAST_INT).concat(i)] = '1';
            }
        }
        var vertexID = Object.keys(vertexDefines).map(function (key) { return "_".concat(key, "_").concat(vertexDefines[key]); }).join();
        var key = "".concat(name).concat(vertexID).concat(fragmentID);
        // Check if we've already compiled program.
        if (this._programs[key])
            return this._programs[key];
        // Otherwise, we need to compile a new program on the fly.
        var _b = this, _uniforms = _b._uniforms, _programs = _b._programs, _programsKeyLookup = _b._programsKeyLookup;
        var gl = _composer.gl, _errorCallback = _composer._errorCallback;
        var vertexShader = _composer._getVertexShader(name, vertexID, vertexDefines, this.name);
        if (vertexShader === undefined) {
            _errorCallback("Unable to init vertex shader \"".concat(name).concat(vertexID, "\" for GPUProgram \"").concat(this.name, "\"."));
            return;
        }
        var fragmentShader = this._getFragmentShader(fragmentID, fragmentDefines);
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
        for (var i = 0; i < uniformNames.length; i++) {
            var uniformName = uniformNames[i];
            var uniform = _uniforms[uniformName];
            var value = uniform.value, type = uniform.type;
            this._setProgramUniform(program, key, uniformName, value, type);
        }
        _programs[key] = program;
        _programsKeyLookup.set(program, key);
        return program;
    };
    /**
     * Set uniform for GLProgram.
     * @private
     */
    GPUProgram.prototype._setProgramUniform = function (program, programName, uniformName, value, type) {
        var _a;
        var _b = this, _composer = _b._composer, _uniforms = _b._uniforms;
        var gl = _composer.gl, _errorCallback = _composer._errorCallback, glslVersion = _composer.glslVersion;
        // We have already set gl.useProgram(program) outside this function.
        var isGLSL3 = glslVersion === constants_1.GLSL3;
        var location = (_a = _uniforms[uniformName]) === null || _a === void 0 ? void 0 : _a.location[programName];
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
                _uniforms[uniformName].location[programName] = location;
            }
            // Since this is the first time we are initing the uniform, check that type is correct.
            // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getUniform
            var uniform = gl.getUniform(program, location);
            var badType = false;
            if (type === constants_1.BOOL_1D_UNIFORM || type === constants_1.BOOL_2D_UNIFORM || type === constants_1.BOOL_3D_UNIFORM || type === constants_1.BOOL_4D_UNIFORM) {
                if (!(0, checks_1.isBoolean)(uniform) && uniform.constructor !== Array) {
                    badType = true;
                }
            }
            else if (type === constants_1.FLOAT_1D_UNIFORM || type === constants_1.FLOAT_2D_UNIFORM || type === constants_1.FLOAT_3D_UNIFORM || type === constants_1.FLOAT_4D_UNIFORM) {
                if (!(0, checks_1.isNumber)(uniform) && uniform.constructor !== Float32Array) {
                    badType = true;
                }
            }
            else if (type === constants_1.INT_1D_UNIFORM || type === constants_1.INT_2D_UNIFORM || type === constants_1.INT_3D_UNIFORM || type === constants_1.INT_4D_UNIFORM) {
                if (!(0, checks_1.isInteger)(uniform) && uniform.constructor !== Int32Array) {
                    badType = true;
                }
            }
            else if (type === constants_1.UINT_1D_UNIFORM || type === constants_1.UINT_2D_UNIFORM || type === constants_1.UINT_3D_UNIFORM || type === constants_1.UINT_4D_UNIFORM) {
                if (!isGLSL3) {
                    // GLSL1 does not have uint type, expect int instead.
                    if (!(0, checks_1.isNonNegativeInteger)(uniform) && uniform.constructor !== Int32Array) {
                        badType = true;
                    }
                }
                else if (!(0, checks_1.isNonNegativeInteger)(uniform) && uniform.constructor !== Uint32Array) {
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
     * Set fragment shader uniform for GPUProgram.
     * @param name - Uniform name as it appears in fragment shader.
     * @param value - Uniform value.
     * @param type - Uniform type (this only needs to be set once).
     */
    GPUProgram.prototype.setUniform = function (name, value, type) {
        var _a;
        var _b = this, _programs = _b._programs, _uniforms = _b._uniforms, _composer = _b._composer, _samplerUniformsIndices = _b._samplerUniformsIndices;
        var verboseLogging = _composer.verboseLogging, gl = _composer.gl;
        // Check that length of value is correct.
        if ((0, checks_1.isArray)(value)) {
            var length_2 = value.length;
            if (length_2 > 4)
                throw new Error("Invalid uniform value: [".concat(value.join(', '), "] passed to GPUProgram \"").concat(this.name, ", uniforms must be of type number[] with length <= 4, number, or boolean.\""));
        }
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
        if (!_uniforms[name]) {
            // Init uniform if needed.
            _uniforms[name] = { type: currentType, location: {}, value: value };
        }
        else {
            // Deep check if value has changed.
            if ((0, checks_1.isArray)(value)) {
                var isChanged = true;
                for (var i = 0; i < value.length; i++) {
                    if (_uniforms[name].value !== value) {
                        isChanged = true;
                        break;
                    }
                }
                if (!isChanged)
                    return; // No change.
            }
            else if (_uniforms[name].value === value) {
                return; // No change.
            }
            // Update value.
            _uniforms[name].value = value;
        }
        var samplerUniform = _samplerUniformsIndices.find(function (uniform) { return uniform.name === name; });
        if (samplerUniform && currentType === constants_1.INT_1D_UNIFORM) {
            samplerUniform.inputIndex = value;
        }
        if (verboseLogging)
            console.log("Setting uniform \"".concat(name, "\" for program \"").concat(this.name, "\" to value ").concat(JSON.stringify(value), " with type ").concat(currentType, "."));
        // Update any active programs.
        var keys = Object.keys(_programs);
        for (var i = 0; i < keys.length; i++) {
            var programName = keys[i];
            // Set active program.
            var program = _programs[programName];
            gl.useProgram(program);
            this._setProgramUniform(program, programName, name, value, currentType);
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
        // TODO: memoize this.
        var indexLookup = new Array(_samplerUniformsIndices.length).fill(-1);
        for (var i = 0, length_3 = _samplerUniformsIndices.length; i < length_3; i++) {
            var _b = _samplerUniformsIndices[i], inputIndex = _b.inputIndex, shaderIndex = _b.shaderIndex;
            if (indexLookup[inputIndex] >= 0) {
                // There is an index collision, this should not happen.
                console.warn("Found > 1 sampler2D uniforms at texture index ".concat(inputIndex, " for GPUProgram \"").concat(this.name, "\"."));
            }
            else {
                indexLookup[inputIndex] = shaderIndex;
            }
        }
        for (var i = 0, length_4 = input.length; i < length_4; i++) {
            var layer = input[i].layer;
            var width = layer.width, height = layer.height;
            var index = indexLookup[i];
            if (index < 0)
                continue;
            var filter = layer.filter, wrapS = layer.wrapS, wrapT = layer.wrapT, _internalFilter = layer._internalFilter, _internalWrapS = layer._internalWrapS, _internalWrapT = layer._internalWrapT;
            var filterMismatch = filter !== _internalFilter;
            if (filterMismatch || wrapS !== _internalWrapS || wrapT !== _internalWrapT) {
                var halfPxSize = [0.5 / width, 0.5 / height];
                var halfPxUniform = "".concat(polyfills_1.SAMPLER2D_HALF_PX_UNIFORM).concat(index);
                this._setProgramUniform(program, programName, halfPxUniform, halfPxSize, constants_1.FLOAT_2D_UNIFORM);
                if (filterMismatch) {
                    var dimensions = [width, height];
                    var dimensionsUniform = "".concat(polyfills_1.SAMPLER2D_DIMENSIONS_UNIFORM).concat(index);
                    this._setProgramUniform(program, programName, dimensionsUniform, dimensions, constants_1.FLOAT_2D_UNIFORM);
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
        this._setProgramUniform(program, programName, uniformName, value, internalType);
    };
    /**
     * Deallocate GPUProgram instance and associated WebGL properties.
     */
    GPUProgram.prototype.dispose = function () {
        var _this = this;
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
            delete _this._programs[key];
        });
        // Delete fragment shaders.
        Object.values(_fragmentShaders).forEach(function (shader) {
            gl.deleteShader(shader);
        });
        // @ts-ignore
        delete this._fragmentShaders;
        // Vertex shaders are owned by GPUComposer and shared across many GPUPrograms.
        // Delete all references.
        // @ts-ignore
        delete this._composer;
        // @ts-ignore
        delete this.name;
        // @ts-ignore
        delete this._fragmentShaderSource;
        // @ts-ignore
        delete this._defines;
        // @ts-ignore
        delete this._uniforms;
        // @ts-ignore
        delete this._programs;
        // @ts-ignore
        delete this._programsKeyLookup;
        // @ts-ignore
        delete this._samplerUniformsIndices;
    };
    return GPUProgram;
}());
exports.GPUProgram = GPUProgram;


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
exports.isBoolean = exports.isObject = exports.isArray = exports.isString = exports.isNonNegativeInteger = exports.isPositiveInteger = exports.isInteger = exports.isNumber = exports.isNumberOfType = exports.isValidClearValue = exports.isValidTextureType = exports.isValidTextureFormat = exports.isValidWrap = exports.isValidFilter = exports.isValidDataType = void 0;
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
// For image urls that are passed in and inited as textures.
// TODO: add docs
function isValidTextureFormat(type) {
    return constants_1.validTextureFormats.indexOf(type) > -1;
}
exports.isValidTextureFormat = isValidTextureFormat;
// TODO: add docs
function isValidTextureType(type) {
    return constants_1.validTextureTypes.indexOf(type) > -1;
}
exports.isValidTextureType = isValidTextureType;
/**
 * Checks if value is valid GPULayer clear value for numComponents and type.
 * @private
 */
function isValidClearValue(clearValue, numComponents, type) {
    if (isArray(clearValue)) {
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
            return isNumber(value);
        case constants_1.BYTE:
            // -(2 ** 7)
            if (value < -128)
                return false;
            // 2 ** 7 - 1
            if (value > 127)
                return false;
            return isInteger(value);
        case constants_1.SHORT:
            // -(2 ** 15)
            if (value < -32768)
                return false;
            // 2 ** 15 - 1
            if (value > 32767)
                return false;
            return isInteger(value);
        case constants_1.INT:
            // -(2 ** 31)
            if (value < -2147483648)
                return false;
            // 2 ** 31 - 1
            if (value > 2147483647)
                return false;
            return isInteger(value);
        case constants_1.UNSIGNED_BYTE:
            // 2 ** 8 - 1
            if (value > 255)
                return false;
            return isNonNegativeInteger(value);
        case constants_1.UNSIGNED_SHORT:
            // 2 ** 16 - 1
            if (value > 65535)
                return false;
            return isNonNegativeInteger(value);
        case constants_1.UNSIGNED_INT:
            // 2 ** 32 - 1
            if (value > 4294967295)
                return false;
            return isNonNegativeInteger(value);
        default:
            throw new Error("Unknown type ".concat(type));
    }
}
exports.isNumberOfType = isNumberOfType;
/**
 * Checks if value is finite number.
 * @private
 */
function isNumber(value) {
    return !Number.isNaN(value) && typeof value === 'number' && Number.isFinite(value);
}
exports.isNumber = isNumber;
/**
 * Checks if value is finite integer.
 * @private
 */
function isInteger(value) {
    return isNumber(value) && (value % 1 === 0);
}
exports.isInteger = isInteger;
/**
 * Checks if value is finite positive integer (> 0).
 * @private
 */
function isPositiveInteger(value) {
    return isInteger(value) && value > 0;
}
exports.isPositiveInteger = isPositiveInteger;
/**
 * Checks if value is finite non-negative integer (>= 0).
 * @private
 */
function isNonNegativeInteger(value) {
    return isInteger(value) && value >= 0;
}
exports.isNonNegativeInteger = isNonNegativeInteger;
/**
 * Checks if value is string.
 * @private
 */
function isString(value) {
    return typeof value === 'string';
}
exports.isString = isString;
/**
 * Checks if value is array.
 * @private
 */
function isArray(value) {
    return Array.isArray(value);
}
exports.isArray = isArray;
/**
 * Checks if value is Javascript object.
 * @private
 */
function isObject(value) {
    return typeof value === 'object' && !isArray(value) && value !== null;
}
exports.isObject = isObject;
/**
 * Checks if value is boolean.
 * @private
 */
function isBoolean(value) {
    return typeof value === 'boolean';
}
exports.isBoolean = isBoolean;


/***/ }),

/***/ 601:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// Data types.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LAYER_LINES_PROGRAM_NAME = exports.LAYER_POINTS_PROGRAM_NAME = exports.SEGMENT_PROGRAM_NAME = exports.DEFAULT_PROGRAM_NAME = exports.BOOL_4D_UNIFORM = exports.BOOL_3D_UNIFORM = exports.BOOL_2D_UNIFORM = exports.BOOL_1D_UNIFORM = exports.UINT_4D_UNIFORM = exports.UINT_3D_UNIFORM = exports.UINT_2D_UNIFORM = exports.UINT_1D_UNIFORM = exports.INT_4D_UNIFORM = exports.INT_3D_UNIFORM = exports.INT_2D_UNIFORM = exports.INT_1D_UNIFORM = exports.FLOAT_4D_UNIFORM = exports.FLOAT_3D_UNIFORM = exports.FLOAT_2D_UNIFORM = exports.FLOAT_1D_UNIFORM = exports.PRECISION_HIGH_P = exports.PRECISION_MEDIUM_P = exports.PRECISION_LOW_P = exports.EXPERIMENTAL_WEBGL = exports.WEBGL1 = exports.WEBGL2 = exports.GLSL1 = exports.GLSL3 = exports.validTextureTypes = exports.validTextureFormats = exports.RGBA = exports.RGB = exports.validWraps = exports.validFilters = exports.validDataTypes = exports.validArrayTypes = exports.REPEAT = exports.CLAMP_TO_EDGE = exports.LINEAR = exports.NEAREST = exports.UINT = exports.BOOL = exports.INT = exports.UNSIGNED_INT = exports.SHORT = exports.UNSIGNED_SHORT = exports.BYTE = exports.UNSIGNED_BYTE = exports.FLOAT = exports.HALF_FLOAT = void 0;
exports.MAX_FLOAT_INT = exports.MIN_FLOAT_INT = exports.MAX_HALF_FLOAT_INT = exports.MIN_HALF_FLOAT_INT = exports.MAX_INT = exports.MIN_INT = exports.MAX_UNSIGNED_INT = exports.MIN_UNSIGNED_INT = exports.MAX_SHORT = exports.MIN_SHORT = exports.MAX_UNSIGNED_SHORT = exports.MIN_UNSIGNED_SHORT = exports.MAX_BYTE = exports.MIN_BYTE = exports.MAX_UNSIGNED_BYTE = exports.MIN_UNSIGNED_BYTE = exports.DEFAULT_CIRCLE_NUM_SEGMENTS = exports.DEFAULT_ERROR_CALLBACK = exports.GPUIO_VS_POSITION_W_ACCUM = exports.GPUIO_VS_NORMAL_ATTRIBUTE = exports.GPUIO_VS_INDEXED_POSITIONS = exports.GPUIO_VS_WRAP_Y = exports.GPUIO_VS_WRAP_X = exports.GPUIO_VS_UV_ATTRIBUTE = exports.LAYER_VECTOR_FIELD_PROGRAM_NAME = void 0;
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
// TODO: change this?
// For image urls that are passed in and inited as textures.
/**
 * @private
 */
exports.RGB = 'RGB';
/**
 * @private
 */
exports.RGBA = 'RGBA';
/**
 * @private
 */
exports.validTextureFormats = [exports.RGB, exports.RGBA];
/**
 * @private
 */
exports.validTextureTypes = [exports.UNSIGNED_BYTE];
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
// Vertex shader compile time vars.
// Be sure to change these in the vertex shader if updated!
/**
 * @private
 */
exports.GPUIO_VS_UV_ATTRIBUTE = 'GPUIO_VS_UV_ATTRIBUTE';
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
exports.GPUIO_VS_NORMAL_ATTRIBUTE = 'GPUIO_VS_NORMAL_ATTRIBUTE';
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
exports._testing = exports.getFragmentShaderMediumpPrecision = exports.getVertexShaderMediumpPrecision = exports.isHighpSupportedInFragmentShader = exports.isHighpSupportedInVertexShader = exports.isWebGL2Supported = exports.isWebGL2 = exports.GPUProgram = exports.GPULayer = exports.GPUComposer = void 0;
var utils = __webpack_require__(593);
var GPUComposer_1 = __webpack_require__(484);
Object.defineProperty(exports, "GPUComposer", ({ enumerable: true, get: function () { return GPUComposer_1.GPUComposer; } }));
var GPULayer_1 = __webpack_require__(355);
Object.defineProperty(exports, "GPULayer", ({ enumerable: true, get: function () { return GPULayer_1.GPULayer; } }));
var GPUProgram_1 = __webpack_require__(664);
Object.defineProperty(exports, "GPUProgram", ({ enumerable: true, get: function () { return GPUProgram_1.GPUProgram; } }));
var checks = __webpack_require__(707);
var GPULayerHelpers = __webpack_require__(191);
var regex = __webpack_require__(126);
var extensions = __webpack_require__(581);
var polyfills = __webpack_require__(360);
// These exports are only used for testing.
/**
 * @private
 */
var _testing = __assign(__assign(__assign(__assign(__assign({ isFloatType: utils.isFloatType, isUnsignedIntType: utils.isUnsignedIntType, isSignedIntType: utils.isSignedIntType, isIntType: utils.isIntType, makeShaderHeader: utils.makeShaderHeader, compileShader: utils.compileShader, initGLProgram: utils.initGLProgram, readyToRead: utils.readyToRead, preprocessVertexShader: utils.preprocessVertexShader, preprocessFragmentShader: utils.preprocessFragmentShader, isPowerOf2: utils.isPowerOf2, initSequentialFloatArray: utils.initSequentialFloatArray, uniformInternalTypeForValue: utils.uniformInternalTypeForValue }, extensions), regex), checks), GPULayerHelpers), polyfills);
exports._testing = _testing;
// Named exports.
__exportStar(__webpack_require__(601), exports);
var isWebGL2 = utils.isWebGL2, isWebGL2Supported = utils.isWebGL2Supported, isHighpSupportedInVertexShader = utils.isHighpSupportedInVertexShader, isHighpSupportedInFragmentShader = utils.isHighpSupportedInFragmentShader, getVertexShaderMediumpPrecision = utils.getVertexShaderMediumpPrecision, getFragmentShaderMediumpPrecision = utils.getFragmentShaderMediumpPrecision;
exports.isWebGL2 = isWebGL2;
exports.isWebGL2Supported = isWebGL2Supported;
exports.isHighpSupportedInVertexShader = isHighpSupportedInVertexShader;
exports.isHighpSupportedInFragmentShader = isHighpSupportedInFragmentShader;
exports.getVertexShaderMediumpPrecision = getVertexShaderMediumpPrecision;
exports.getFragmentShaderMediumpPrecision = getFragmentShaderMediumpPrecision;


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
    // We don't need to create unsigned int polyfills, bc unsigned int is not a supported type in GLSL1.
    // All unsigned int variables will be cast as int and be caught by the signed int polyfills.
    GLSL1_POLYFILLS = "\n".concat(abs('int'), "\n").concat(abs('ivec2'), "\n").concat(abs('ivec3'), "\n").concat(abs('ivec4'), "\n\n").concat(sign('int'), "\n").concat(sign('ivec2'), "\n").concat(sign('ivec3'), "\n").concat(sign('ivec4'), "\n\n").concat(round('float'), "\n").concat(round('vec2'), "\n").concat(round('vec3'), "\n").concat(round('vec4'), "\n\n").concat(trunc('float'), "\n").concat(trunc('vec2'), "\n").concat(trunc('vec3'), "\n").concat(trunc('vec4'), "\n\n").concat(roundEven('float'), "\n").concat(roundEven('vec2'), "\n").concat(roundEven('vec3'), "\n").concat(roundEven('vec4'), "\n\n").concat(min('int', 'int'), "\n").concat(min('ivec2', 'ivec2'), "\n").concat(min('ivec3', 'ivec3'), "\n").concat(min('ivec4', 'ivec4'), "\n").concat(min('ivec2', 'int'), "\n").concat(min('ivec3', 'int'), "\n").concat(min('ivec4', 'int'), "\n\n").concat(max('int', 'int'), "\n").concat(max('ivec2', 'ivec2'), "\n").concat(max('ivec3', 'ivec3'), "\n").concat(max('ivec4', 'ivec4'), "\n").concat(max('ivec2', 'int'), "\n").concat(max('ivec3', 'int'), "\n").concat(max('ivec4', 'int'), "\n\n").concat(clamp('int', 'int'), "\n").concat(clamp('ivec2', 'ivec2'), "\n").concat(clamp('ivec3', 'ivec3'), "\n").concat(clamp('ivec4', 'ivec4'), "\n").concat(clamp('ivec2', 'int'), "\n").concat(clamp('ivec3', 'int'), "\n").concat(clamp('ivec4', 'int'), "\n\n").concat(mix('float', 'bool'), "\n").concat(mix('vec2', 'bvec2'), "\n").concat(mix('vec3', 'bvec3'), "\n").concat(mix('vec4', 'bvec4'), "\n\n");
    return GLSL1_POLYFILLS;
}
exports.GLSL1Polyfills = GLSL1Polyfills;
var FRAGMENT_SHADER_POLYFILLS;
/**
 * Polyfills to be make available for both GLSL1 and GLSL3fragment shaders.
 * @private
 */
function fragmentShaderPolyfills() {
    if (FRAGMENT_SHADER_POLYFILLS)
        return FRAGMENT_SHADER_POLYFILLS;
    var mod = function (type1, type2) { return "".concat(type1, " mod(const ").concat(type1, " x, const ").concat(type2, " y) { return x - y * (x / y); }"); };
    // Operators.
    var bitshiftLeft = function (type1, type2) { return "".concat(type1, " bitshiftLeft(const ").concat(type1, " a, const ").concat(type2, " b) { return a * ").concat(type1, "(pow(").concat(floatTypeForIntType(type2), "(2.0), ").concat(floatTypeForIntType(type2), "(b))); }"); };
    var bitshiftRight = function (type1, type2) { return "".concat(type1, " bitshiftRight(const ").concat(type1, " a, const ").concat(type2, " b) { return ").concat(type1, "(round(").concat(floatTypeForIntType(type1), "(a) / pow(").concat(floatTypeForIntType(type2), "(2.0), ").concat(floatTypeForIntType(type2), "(b)))); }"); };
    FRAGMENT_SHADER_POLYFILLS = "\n".concat(mod('int', 'int'), "\n").concat(mod('ivec2', 'ivec2'), "\n").concat(mod('ivec3', 'ivec3'), "\n").concat(mod('ivec4', 'ivec4'), "\n").concat(mod('ivec2', 'int'), "\n").concat(mod('ivec3', 'int'), "\n").concat(mod('ivec4', 'int'), "\n#if (__VERSION__ == 300)\n").concat(mod('uint', 'uint'), "\n").concat(mod('uvec2', 'uvec2'), "\n").concat(mod('uvec3', 'uvec3'), "\n").concat(mod('uvec4', 'uvec4'), "\n").concat(mod('uvec2', 'uint'), "\n").concat(mod('uvec3', 'uint'), "\n").concat(mod('uvec4', 'uint'), "\n#endif\n\n").concat(bitshiftLeft('int', 'int'), "\n").concat(bitshiftLeft('ivec2', 'ivec2'), "\n").concat(bitshiftLeft('ivec3', 'ivec3'), "\n").concat(bitshiftLeft('ivec4', 'ivec4'), "\n").concat(bitshiftLeft('ivec2', 'int'), "\n").concat(bitshiftLeft('ivec3', 'int'), "\n").concat(bitshiftLeft('ivec4', 'int'), "\n#if (__VERSION__ == 300)\n").concat(bitshiftLeft('uint', 'uint'), "\n").concat(bitshiftLeft('uvec2', 'uvec2'), "\n").concat(bitshiftLeft('uvec3', 'uvec3'), "\n").concat(bitshiftLeft('uvec4', 'uvec4'), "\n").concat(bitshiftLeft('uvec2', 'uint'), "\n").concat(bitshiftLeft('uvec3', 'uint'), "\n").concat(bitshiftLeft('uvec4', 'uint'), "\n#endif\n\n").concat(bitshiftRight('int', 'int'), "\n").concat(bitshiftRight('ivec2', 'ivec2'), "\n").concat(bitshiftRight('ivec3', 'ivec3'), "\n").concat(bitshiftRight('ivec4', 'ivec4'), "\n").concat(bitshiftRight('ivec2', 'int'), "\n").concat(bitshiftRight('ivec3', 'int'), "\n").concat(bitshiftRight('ivec4', 'int'), "\n#if (__VERSION__ == 300)\n").concat(bitshiftRight('uint', 'uint'), "\n").concat(bitshiftRight('uvec2', 'uvec2'), "\n").concat(bitshiftRight('uvec3', 'uvec3'), "\n").concat(bitshiftRight('uvec4', 'uvec4'), "\n").concat(bitshiftRight('uvec2', 'uint'), "\n").concat(bitshiftRight('uvec3', 'uint'), "\n").concat(bitshiftRight('uvec4', 'uint'), "\n#endif\n") +
        // Copied from https://github.com/gpujs/gpu.js/blob/master/src/backend/web-gl/fragment-shader.js
        // Seems like these could be optimized.
        "\n#define GPUIO_BIT_COUNT 32\nint bitwiseOr(int a, int b) {\n  int result = 0;\n  int n = 1;\n  \n  for (int i = 0; i < GPUIO_BIT_COUNT; i++) {\n    if ((mod(a, 2) == 1) || (mod(b, 2) == 1)) {\n      result += n;\n    }\n    a = a / 2;\n    b = b / 2;\n    n = n * 2;\n    if(!(a > 0 || b > 0)) {\n      break;\n    }\n  }\n  return result;\n}\nint bitwiseXOR(int a, int b) {\n  int result = 0;\n  int n = 1;\n  \n  for (int i = 0; i < GPUIO_BIT_COUNT; i++) {\n    if ((mod(a, 2) == 1) != (mod(b, 2) == 1)) {\n      result += n;\n    }\n    a = a / 2;\n    b = b / 2;\n    n = n * 2;\n    if(!(a > 0 || b > 0)) {\n      break;\n    }\n  }\n  return result;\n}\nint bitwiseAnd(int a, int b) {\n  int result = 0;\n  int n = 1;\n  for (int i = 0; i < GPUIO_BIT_COUNT; i++) {\n    if ((mod(a, 2) == 1) && (mod(b, 2) == 1)) {\n      result += n;\n    }\n    a = a / 2;\n    b = b / 2;\n    n = n * 2;\n    if(!(a > 0 && b > 0)) {\n      break;\n    }\n  }\n  return result;\n}\nint bitwiseNot(int a) {\n  int result = 0;\n  int n = 1;\n  \n  for (int i = 0; i < GPUIO_BIT_COUNT; i++) {\n    if (mod(a, 2) == 0) {\n      result += n;\n    }\n    a = a / 2;\n    n = n * 2;\n  }\n  return result;\n}\n\n#if (__VERSION__ == 300)\nuint bitwiseOr(uint a, uint b) {\n\treturn uint(bitwiseOr(int(a), int(b)));\n}\nuint bitwiseXOR(uint a, uint b) {\n\treturn uint(bitwiseXOR(int(a), int(b)));\n}\nuint bitwiseAnd(uint a, uint b) {\n\treturn uint(bitwiseAnd(int(a), int(b)));\n}\nuint bitwiseNot(uint a) {\n\treturn uint(bitwiseNot(int(a)));\n}\n#endif\n\n";
    return FRAGMENT_SHADER_POLYFILLS;
}
exports.fragmentShaderPolyfills = fragmentShaderPolyfills;


/***/ }),

/***/ 126:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getSampler2DsInProgram = exports.stripComments = exports.stripPrecision = exports.stripVersion = exports.highpToMediump = exports.glsl1Uint = exports.glsl1Sampler2D = exports.glsl1Texture = exports.checkFragmentShaderForFragColor = exports.glsl1FragmentOut = exports.getFragmentOutType = exports.glsl1FragmentIn = exports.glsl1VertexOut = exports.castVaryingToFloat = exports.glsl1VertexIn = exports.typecastVariable = void 0;
var constants_1 = __webpack_require__(601);
/**
 * Helper functions for converting GLSL3 to GLSL1 and checking for valid shader code.
 * Note: there is no positive lookbehind support in some browsers, use capturing parens instead.
 * https://stackoverflow.com/questions/3569104/positive-look-behind-in-javascript-regular-expression/3569116#3569116
 */
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
/**
 * Typecast variable assignment.
 * This is used in cases when e.g. varyings have to be converted to float in GLSL1.
 * @private
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
exports.typecastVariable = typecastVariable;
/**
 * Convert vertex shader "in" to "attribute".
 * @private
 */
function glsl1VertexIn(shaderSource) {
    return shaderSource.replace(/\bin\b/g, 'attribute');
}
exports.glsl1VertexIn = glsl1VertexIn;
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
 * Contains out_fragColor.
 * @private
 */
function containsOutFragColor(shaderSource) {
    return !!shaderSource.match(/\bout_fragColor\b/);
}
/**
 * Contains gl_FragColor.
 * @private
 */
function containsGLFragColor(shaderSource) {
    return !!shaderSource.match(/\bgl_FragColor\b/);
}
/**
 * Get type (int, float, vec3, etc) of fragment out.
 * Only exported for testing.
 * @private
 */
function getFragmentOutType(shaderSource, name) {
    // Do this without lookbehind to support older browsers.
    // const type = shaderSource.match(/(?<=\bout\s+((lowp|mediump|highp)\s+)?)(float|int|((i|u)?vec(2|3|4)))(?=\s+out_fragColor;)/);
    var type = shaderSource.match(/\bout\s+((lowp|mediump|highp)\s+)?((float|int|((i|u)?vec(2|3|4))))\s+out_fragColor;/);
    if (!type || !type[3]) {
        throw new Error("No type found in out_fragColor declaration for GPUProgram \"".concat(name, "\"."));
    }
    return type[3];
}
exports.getFragmentOutType = getFragmentOutType;
/**
 * Convert out_fragColor to gl_FragColor.
 * @private
 */
function glsl1FragmentOut(shaderSource, name) {
    if (containsOutFragColor(shaderSource)) {
        var type = getFragmentOutType(shaderSource, name);
        // Remove out_fragColor declaration.
        shaderSource = shaderSource.replace(/\bout\s+((lowp|mediump|highp)\s+)?\w+\s+out_fragColor\s*;/g, '');
        var assignmentFound = false;
        while (true) {
            // Replace each instance of out_fragColor = with gl_FragColor = and cast to vec4.
            // Do this without lookbehind to support older browsers.
            // const output = shaderSource.match(/(?<=\bout_fragColor\s*=\s*)\S.*(?=;)/s); // /s makes this work for multiline.
            var output = shaderSource.match(/\bout_fragColor\s*=\s*(\S.*);/s); // /s makes this work for multiline.
            if (output && output[1]) {
                assignmentFound = true;
                var filler = '';
                switch (type) {
                    case 'float':
                    case 'int':
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
                shaderSource = shaderSource.replace(/\bout_fragColor\s*=\s*.+;/s, "gl_FragColor = vec4(".concat(output[1]).concat(filler, ");"));
            }
            else {
                if (!assignmentFound)
                    throw new Error("No assignment found for out_fragColor in GPUProgram \"".concat(name, "\"."));
                break;
            }
        }
    }
    return shaderSource;
}
exports.glsl1FragmentOut = glsl1FragmentOut;
/**
 * Check that out_fragColor or gl_FragColor is present in fragment shader source.
 * @private
 */
function checkFragmentShaderForFragColor(shaderSource, glslVersion, name) {
    var gl_FragColor = containsGLFragColor(shaderSource);
    var out_fragColor = containsOutFragColor(shaderSource);
    if (glslVersion === constants_1.GLSL3) {
        // Check that fragment shader source DOES NOT contain gl_FragColor
        if (gl_FragColor) {
            throw new Error("Found \"gl_FragColor\" declaration in fragment shader for GPUProgram \"".concat(name, "\": either init GPUComposer with glslVersion = GLSL1 or use GLSL3 syntax in your fragment shader."));
        }
        // Check that fragment shader source DOES contain out_fragColor.
        if (!out_fragColor) {
            throw new Error("Found no \"out_fragColor\" (GLSL3) or \"gl_FragColor\" (GLSL1) declarations or  in fragment shader for GPUProgram \"".concat(name, "\"."));
        }
    }
    else {
        // Check that fragment shader source DOES contain either gl_FragColor or out_fragColor.
        if (!gl_FragColor && !out_fragColor) {
            throw new Error("Found no \"out_fragColor\" (GLSL3) or \"gl_FragColor\" (GLSL1) declarations or  in fragment shader for GPUProgram \"".concat(name, "\"."));
        }
    }
    return true;
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
    shaderSource = shaderSource.replace(/\s?\/\/.*\n/g, ''); // Remove single-line comments.
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
    var regex = '\\buniform\\s+(((highp)|(mediump)|(lowp))\\s+)?(i|u)?sampler2D\\s+(\\w+)\\s?;';
    var samplers = shaderSource.match(new RegExp(regex, 'g'));
    if (!samplers || samplers.length === 0)
        return [];
    // We need to be a bit careful as same sampler could be declared multiple times if compile-time args are used.
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
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.uniformInternalTypeForValue = exports.preprocessFragmentShader = exports.preprocessVertexShader = exports.convertFragmentShaderToGLSL1 = exports.initSequentialFloatArray = exports.isPowerOf2 = exports.getFragmentShaderMediumpPrecision = exports.getVertexShaderMediumpPrecision = exports.isHighpSupportedInFragmentShader = exports.isHighpSupportedInVertexShader = exports.readyToRead = exports.isWebGL2Supported = exports.isWebGL2 = exports.initGLProgram = exports.compileShader = exports.makeShaderHeader = exports.isIntType = exports.isSignedIntType = exports.isUnsignedIntType = exports.isFloatType = void 0;
var checks_1 = __webpack_require__(707);
var constants_1 = __webpack_require__(601);
var polyfills_1 = __webpack_require__(360);
var regex_1 = __webpack_require__(126);
var precisionSource = __webpack_require__(937);
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
 * Enum for precision values.
 * See src/glsl/common/precision.glsl for more info.
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
/**
 * Create a string to pass defines into shader.
 * @private
 */
function convertDefinesToString(defines) {
    var definesSource = '';
    var keys = Object.keys(defines);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        // Check that define is passed in as a string.
        if (!(0, checks_1.isString)(key) || !(0, checks_1.isString)(defines[key])) {
            throw new Error("GPUProgram defines must be passed in as key value pairs that are both strings, got key value pair of type [".concat(typeof key, " : ").concat(typeof defines[key], "] for key ").concat(key, "."));
        }
        definesSource += "#define ".concat(key, " ").concat(defines[key], "\n");
    }
    return definesSource;
}
/**
 * Create header string for fragment and vertex shaders.
 * Export this for testing purposes.
 * @private
 */
function makeShaderHeader(glslVersion, intPrecision, floatPrecision, defines) {
    var versionSource = glslVersion === constants_1.GLSL3 ? "#version ".concat(constants_1.GLSL3, "\n") : '';
    var definesSource = defines ? convertDefinesToString(defines) : '';
    var precisionDefinesSource = convertDefinesToString({
        GPUIO_INT_PRECISION: "".concat(intForPrecision(intPrecision)),
        GPUIO_FLOAT_PRECISION: "".concat(intForPrecision(floatPrecision)),
    });
    return "".concat(versionSource).concat(definesSource).concat(precisionDefinesSource).concat(precisionSource);
}
exports.makeShaderHeader = makeShaderHeader;
/**
 * Compile vertex or fragment shaders.
 * Fragment shaders may be compiled on the fly, so keep this efficient.
 * Copied from http://webglfundamentals.org/webgl/lessons/webgl-boilerplate.html
 * @private
 */
function compileShader(gl, glslVersion, intPrecision, floatPrecision, shaderSource, shaderType, programName, errorCallback, defines, checkCompileStatus) {
    if (checkCompileStatus === void 0) { checkCompileStatus = false; }
    // Create the shader object
    var shader = gl.createShader(shaderType);
    if (!shader) {
        errorCallback('Unable to init gl shader.');
        return null;
    }
    // Set the shader source code.
    var shaderHeader = makeShaderHeader(glslVersion, intPrecision, floatPrecision, defines);
    var fullShaderSource = "".concat(shaderHeader).concat(shaderSource);
    gl.shaderSource(shader, fullShaderSource);
    // Compile the shader
    gl.compileShader(shader);
    if (checkCompileStatus) {
        // TODO: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices#dont_check_shader_compile_status_unless_linking_fails
        // Check if it compiled.
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
    // TODO: there are probably more to add here.
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
    // Convert out_fragColor to gl_FragColor.
    shaderSource = (0, regex_1.glsl1FragmentOut)(shaderSource, name);
    return shaderSource;
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
    // Add texture() polyfills if needed.
    var samplerUniforms;
    (_a = (0, polyfills_1.texturePolyfill)(shaderSource), shaderSource = _a.shaderSource, samplerUniforms = _a.samplerUniforms);
    if (glslVersion !== constants_1.GLSL3) {
        shaderSource = convertFragmentShaderToGLSL1(shaderSource, name);
        // add glsl1 specific polyfills.
        shaderSource = (0, polyfills_1.GLSL1Polyfills)() + shaderSource;
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
        if ((0, checks_1.isArray)(value)) {
            for (var i = 0; i < value.length; i++) {
                if (!(0, checks_1.isNumber)(value[i])) {
                    throw new Error("Invalid value ".concat(JSON.stringify(value), " for uniform \"").concat(uniformName, "\" in program \"").concat(programName, "\", expected float or float[] of length 1-4."));
                }
            }
        }
        else {
            if (!(0, checks_1.isNumber)(value)) {
                throw new Error("Invalid value ".concat(JSON.stringify(value), " for uniform \"").concat(uniformName, "\" in program \"").concat(programName, "\", expected float or float[] of length 1-4."));
            }
        }
        if (!(0, checks_1.isArray)(value) || value.length === 1) {
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
        if ((0, checks_1.isArray)(value)) {
            for (var i = 0; i < value.length; i++) {
                if (!(0, checks_1.isInteger)(value[i])) {
                    throw new Error("Invalid value ".concat(JSON.stringify(value), " for uniform \"").concat(uniformName, "\" in program \"").concat(programName, "\", expected int or int[] of length 1-4."));
                }
            }
        }
        else {
            if (!(0, checks_1.isInteger)(value)) {
                throw new Error("Invalid value ".concat(JSON.stringify(value), " for uniform \"").concat(uniformName, "\" in program \"").concat(programName, "\", expected int or int[] of length 1-4."));
            }
        }
        if (!(0, checks_1.isArray)(value) || value.length === 1) {
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
        if ((0, checks_1.isArray)(value)) {
            for (var i = 0; i < value.length; i++) {
                if (!(0, checks_1.isNonNegativeInteger)(value[i])) {
                    throw new Error("Invalid value ".concat(JSON.stringify(value), " for uniform \"").concat(uniformName, "\" in program \"").concat(programName, "\", expected uint or uint[] of length 1-4."));
                }
            }
        }
        else {
            if (!(0, checks_1.isNonNegativeInteger)(value)) {
                throw new Error("Invalid value ".concat(JSON.stringify(value), " for uniform \"").concat(uniformName, "\" in program \"").concat(programName, "\", expected uint or uint[] of length 1-4."));
            }
        }
        if (!(0, checks_1.isArray)(value) || value.length === 1) {
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
        if ((0, checks_1.isArray)(value)) {
            for (var i = 0; i < value.length; i++) {
                if (!(0, checks_1.isBoolean)(value[i])) {
                    throw new Error("Invalid value ".concat(JSON.stringify(value), " for uniform \"").concat(uniformName, "\" in program \"").concat(programName, "\", expected bool or bool[] of length 1-4."));
                }
            }
        }
        else {
            if (!(0, checks_1.isBoolean)(value)) {
                throw new Error("Invalid value ".concat(JSON.stringify(value), " for uniform \"").concat(uniformName, "\" in program \"").concat(programName, "\", expected bool or bool[] of length 1-4."));
            }
        }
        if (!(0, checks_1.isArray)(value) || value.length === 1) {
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


/***/ }),

/***/ 937:
/***/ ((module) => {

module.exports = "#if (GPUIO_INT_PRECISION == 2)\n#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp int;\n#if (__VERSION__ == 300)\nprecision highp isampler2D;precision highp usampler2D;\n#endif\n#else\nprecision mediump int;\n#if (__VERSION__ == 300)\nprecision mediump isampler2D;precision mediump usampler2D;\n#endif\n#endif\n#endif\n#if (GPUIO_INT_PRECISION == 1)\nprecision mediump int;\n#if (__VERSION__ == 300)\nprecision mediump isampler2D;precision mediump usampler2D;\n#endif\n#endif\n#if (GPUIO_INT_PRECISION == 0)\nprecision lowp int;\n#if (__VERSION__ == 300)\nprecision lowp isampler2D;precision lowp usampler2D;\n#endif\n#endif\n#if (GPUIO_FLOAT_PRECISION == 2)\n#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;precision highp sampler2D;\n#else\nprecision mediump float;precision mediump sampler2D;\n#endif\n#endif\n#if (GPUIO_FLOAT_PRECISION == 1)\nprecision mediump float;precision mediump sampler2D;\n#endif\n#if (GPUIO_FLOAT_PRECISION == 0)\nprecision lowp float;precision lowp sampler2D;\n#endif\n"

/***/ }),

/***/ 158:
/***/ ((module) => {

module.exports = "in vec2 v_uv;\n#ifdef GPUIO_FLOAT\nuniform sampler2D u_state;\n#endif\n#ifdef GPUIO_INT\nuniform isampler2D u_state;\n#endif\n#ifdef GPUIO_UINT\nuniform usampler2D u_state;\n#endif\n#ifdef GPUIO_FLOAT\nout vec4 out_fragColor;\n#endif\n#ifdef GPUIO_INT\nout ivec4 out_fragColor;\n#endif\n#ifdef GPUIO_UINT\nout uvec4 out_fragColor;\n#endif\nvoid main(){out_fragColor=texture(u_state,v_uv);}"

/***/ }),

/***/ 148:
/***/ ((module) => {

module.exports = "#ifdef GPUIO_FLOAT\nuniform vec4 u_value;\n#endif\n#ifdef GPUIO_INT\nuniform ivec4 u_value;\n#endif\n#ifdef GPUIO_UINT\nuniform uvec4 u_value;\n#endif\n#ifdef GPUIO_FLOAT\nout vec4 out_fragColor;\n#endif\n#ifdef GPUIO_INT\nout ivec4 out_fragColor;\n#endif\n#ifdef GPUIO_UINT\nout uvec4 out_fragColor;\n#endif\nvoid main(){out_fragColor=u_value;}"

/***/ }),

/***/ 723:
/***/ ((module) => {

module.exports = "in vec2 v_uv;uniform vec3 u_color;uniform float u_scale;\n#ifdef GPUIO_FLOAT\nuniform sampler2D u_gpuio_data;\n#endif\n#ifdef GPUIO_INT\nuniform isampler2D u_gpuio_data;\n#endif\n#ifdef GPUIO_UINT\nuniform usampler2D u_gpuio_data;\n#endif\nout vec4 out_fragColor;void main(){uvec4 value=texture(u_gpuio_data,v_uv);float mag=length(value);out_fragColor=vec4(mag*u_scale*u_color,1);}"

/***/ }),

/***/ 598:
/***/ ((module) => {

module.exports = "in vec2 v_lineWrapping;uniform vec4 u_value;out vec4 out_fragColor;void main(){if((v_lineWrapping.x!=0.&&v_lineWrapping.x!=1.)||(v_lineWrapping.y!=0.&&v_lineWrapping.y!=1.)){discard;return;}out_fragColor=vec4(u_value);}"

/***/ }),

/***/ 288:
/***/ ((module) => {

module.exports = "in vec2 a_gpuio_position;\n#ifdef GPUIO_VS_UV_ATTRIBUTE\nin vec2 a_gpuio_uv;\n#endif\n#ifdef GPUIO_VS_NORMAL_ATTRIBUTE\nin vec2 a_gpuio_normal;\n#endif\nuniform vec2 u_gpuio_scale;uniform vec2 u_gpuio_translation;out vec2 v_uv;out vec2 v_uv_local;\n#ifdef GPUIO_VS_NORMAL_ATTRIBUTE\nout vec2 v_normal;\n#endif\nvoid main(){\n#ifdef GPUIO_VS_UV_ATTRIBUTE\nv_uv_local=a_gpuio_uv;\n#else\nv_uv_local=0.5*(a_gpuio_position+1.);\n#endif\n#ifdef GPUIO_VS_NORMAL_ATTRIBUTE\nv_normal=a_gpuio_normal;\n#endif\nvec2 position=u_gpuio_scale*a_gpuio_position+u_gpuio_translation;v_uv=0.5*(position+1.);gl_Position=vec4(position,0,1);}"

/***/ }),

/***/ 143:
/***/ ((module) => {

module.exports = "float modI(float a,float b){float m=a-floor((a+0.5)/b)*b;return floor(m+0.5);}vec2 uvFromIndex(const float index,const vec2 dimensions){return vec2(modI(index,dimensions.x),floor(floor(index+0.5)/dimensions.x))/dimensions;}vec2 uvFromIndex(const int index,const vec2 dimensions){int width=int(dimensions.x);int y=index/width;return vec2(index-y*width,y)/dimensions;}\n#if (__VERSION__ != 300 || GPUIO_VS_INDEXED_POSITIONS == 1)\nin float a_gpuio_index;\n#endif\nuniform sampler2D u_gpuio_positions;uniform vec2 u_gpuio_positionsDimensions;uniform vec2 u_gpuio_scale;out vec2 v_uv;out vec2 v_lineWrapping;out int v_index;void main(){\n#if (__VERSION__ == 300 || GPUIO_VS_INDEXED_POSITIONS == 1)\nvec2 positionUV=uvFromIndex(gl_VertexID,u_gpuio_positionsDimensions);v_index=gl_VertexID;\n#else\nvec2 positionUV=uvFromIndex(a_gpuio_index,u_gpuio_positionsDimensions);v_index=int(a_gpuio_index);\n#endif\n#ifdef GPUIO_VS_POSITION_W_ACCUM\nvec4 positionData=texture(u_gpuio_positions,positionUV);v_uv=(positionData.rg+positionData.ba)*u_gpuio_scale;\n#else\nv_uv=texture(u_gpuio_positions,positionUV).rg*u_gpuio_scale;\n#endif\nv_lineWrapping=vec2(0.);\n#ifdef GPUIO_VS_WRAP_X\nif(v_uv.x<0.){v_uv.x+=1.;v_lineWrapping.x=1.;}else if(v_uv.x>1.){v_uv.x-=1.;v_lineWrapping.x=1.;}\n#endif\n#ifdef GPUIO_VS_WRAP_Y\nif(v_uv.y<0.){v_uv.y+=1.;v_lineWrapping.y=1.;}else if(v_uv.y>1.){v_uv.y-=1.;v_lineWrapping.y=1.;}\n#endif\nvec2 position=v_uv*2.-1.;gl_Position=vec4(position,0,1);}"

/***/ }),

/***/ 767:
/***/ ((module) => {

module.exports = "float modI(float a,float b){float m=a-floor((a+0.5)/b)*b;return floor(m+0.5);}vec2 uvFromIndex(const float index,const vec2 dimensions){return vec2(modI(index,dimensions.x),floor(floor(index+0.5)/dimensions.x))/dimensions;}vec2 uvFromIndex(const int index,const vec2 dimensions){int width=int(dimensions.x);int y=index/width;return vec2(index-y*width,y)/dimensions;}\n#if (__VERSION__ != 300)\nin float a_gpuio_index;\n#endif\nuniform sampler2D u_gpuio_positions;uniform vec2 u_gpuio_positionsDimensions;uniform vec2 u_gpuio_scale;uniform float u_gpuio_pointSize;out vec2 v_uv;flat out int v_index;void main(){\n#if (__VERSION__ == 300)\nvec2 positionUV=uvFromIndex(gl_VertexID,u_gpuio_positionsDimensions);v_index=gl_VertexID;\n#else\nvec2 positionUV=uvFromIndex(a_gpuio_index,u_gpuio_positionsDimensions);v_index=int(a_gpuio_index);\n#endif\n#ifdef GPUIO_VS_POSITION_W_ACCUM\nvec4 positionData=texture(u_gpuio_positions,positionUV);v_uv=(positionData.rg+positionData.ba)*u_gpuio_scale;\n#else\nv_uv=texture(u_gpuio_positions,positionUV).rg*u_gpuio_scale;\n#endif\n#ifdef GPUIO_VS_WRAP_X\nv_uv.x=fract(v_uv.x+ceil(abs(v_uv.x)));\n#endif\n#ifdef GPUIO_VS_WRAP_Y\nv_uv.y=fract(v_uv.y+ceil(abs(v_uv.y)));\n#endif\nvec2 position=v_uv*2.-1.;gl_PointSize=u_gpuio_pointSize;gl_Position=vec4(position,0,1);}"

/***/ }),

/***/ 760:
/***/ ((module) => {

module.exports = "float modI(float a,float b){float m=a-floor((a+0.5)/b)*b;return floor(m+0.5);}vec2 uvFromIndex(const float index,const vec2 dimensions){return vec2(modI(index,dimensions.x),floor(floor(index+0.5)/dimensions.x))/dimensions;}vec2 uvFromIndex(const int index,const vec2 dimensions){int width=int(dimensions.x);int y=index/width;return vec2(index-y*width,y)/dimensions;}\n#if (__VERSION__ != 300)\nin float a_gpuio_index;\n#endif\nuniform sampler2D u_gpuio_vectors;uniform vec2 u_gpuio_dimensions;uniform vec2 u_gpuio_scale;out vec2 v_uv;out int v_index;void main(){\n#if (__VERSION__ == 300)\nconst int index=gl_VertexID/2;v_index=gl_VertexID;\n#else\nconst float index=floor((a_gpuio_index+0.5)/2.);v_index=int(a_gpuio_index);\n#endif\nv_uv=uvFromIndex(index,u_gpuio_dimensions);\n#if (__VERSION__ == 300)\nv_uv+=float(gl_VertexID-2*index)*texture(u_gpuio_vectors,v_uv).xy*u_gpuio_scale;\n#else\nv_uv+=(a_gpuio_index-2*index)*texture(u_gpuio_vectors,v_uv).xy*u_gpuio_scale;\n#endif\nvec2 position=v_uv*2.-1.;gl_Position=vec4(position,0,1);}"

/***/ }),

/***/ 974:
/***/ ((module) => {

module.exports = "in vec2 a_gpuio_position;uniform float u_gpuio_halfThickness;uniform vec2 u_gpuio_scale;uniform float u_gpuio_length;uniform float u_gpuio_rotation;uniform vec2 u_gpuio_translation;out vec2 v_uv_local;out vec2 v_uv;mat2 rotate2d(float _angle){return mat2(cos(_angle),-sin(_angle),sin(_angle),cos(_angle));}void main(){v_uv_local=0.5*(a_gpuio_position+1.);vec2 position=a_gpuio_position;position*=u_gpuio_halfThickness;float signX=sign(position.x);position.x+=signX*u_gpuio_length/2.;v_uv_local.x=(signX+1.)/2.;position=u_gpuio_scale*(rotate2d(-u_gpuio_rotation)*position)+u_gpuio_translation;v_uv=0.5*(position+1.);gl_Position=vec4(position,0,1);}"

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
/******/ 	var __webpack_exports__ = __webpack_require__(607);
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=gpu-io.js.map