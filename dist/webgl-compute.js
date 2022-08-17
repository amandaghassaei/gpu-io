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

/***/ 501:
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

// EXTERNAL MODULE: ./node_modules/lodash-es/_freeGlobal.js
var _freeGlobal = __webpack_require__(277);
;// CONCATENATED MODULE: ./node_modules/lodash-es/_root.js


/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = _freeGlobal/* default */.Z || freeSelf || Function('return this')();

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

// EXTERNAL MODULE: ./node_modules/lodash-es/_nodeUtil.js
var _nodeUtil = __webpack_require__(730);
;// CONCATENATED MODULE: ./node_modules/lodash-es/isArrayBuffer.js




/* Node.js helper references. */
var nodeIsArrayBuffer = _nodeUtil/* default */.Z && _nodeUtil/* default.isArrayBuffer */.Z.isArrayBuffer;

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

/***/ 277:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof __webpack_require__.g == 'object' && __webpack_require__.g && __webpack_require__.g.Object === Object && __webpack_require__.g;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (freeGlobal);


/***/ }),

/***/ 730:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _freeGlobal_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(277);
/* module decorator */ module = __webpack_require__.hmd(module);


/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && "object" == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && _freeGlobal_js__WEBPACK_IMPORTED_MODULE_0__/* .default.process */ .Z.process;

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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GPUComposer = void 0;
var file_saver_1 = __webpack_require__(162);
// @ts-ignore
var changedpi_1 = __webpack_require__(809);
var GPULayer_1 = __webpack_require__(355);
var constants_1 = __webpack_require__(601);
var GPUProgram_1 = __webpack_require__(664);
var utils = __webpack_require__(404);
var utils_1 = __webpack_require__(593);
var float16_1 = __webpack_require__(501);
var checks_1 = __webpack_require__(707);
var defaultVertexShaderSource = __webpack_require__(288);
var GPUComposer = /** @class */ (function () {
    function GPUComposer(params) {
        var _a;
        this.errorState = false;
        // Store multiple circle positions buffers for various num segments, use numSegments as key.
        this._circlePositionsBuffer = {};
        // Programs for copying data (these are needed for rendering partial screen geometries).
        this.copyPrograms = {
            src: __webpack_require__(158),
        };
        // Other util programs.
        this.setValuePrograms = {
            src: __webpack_require__(148),
        };
        this.vectorMagnitudePrograms = {
            src: __webpack_require__(723),
        };
        // Vertex shaders are shared across all GPUProgram instances.
        this._vertexShaders = (_a = {},
            _a[constants_1.DEFAULT_PROGRAM_NAME] = {
                src: defaultVertexShaderSource,
            },
            _a[constants_1.DEFAULT_W_UV_PROGRAM_NAME] = {
                src: defaultVertexShaderSource,
                defines: {
                    'WEBGLCOMPUTE_UV_ATTRIBUTE': '1',
                },
            },
            _a[constants_1.DEFAULT_W_NORMAL_PROGRAM_NAME] = {
                src: defaultVertexShaderSource,
                defines: {
                    'WEBGLCOMPUTE_NORMAL_ATTRIBUTE': '1',
                },
            },
            _a[constants_1.DEFAULT_W_UV_NORMAL_PROGRAM_NAME] = {
                src: defaultVertexShaderSource,
                defines: {
                    'WEBGLCOMPUTE_UV_ATTRIBUTE': '1',
                    'WEBGLCOMPUTE_NORMAL_ATTRIBUTE': '1',
                },
            },
            _a[constants_1.SEGMENT_PROGRAM_NAME] = {
                src: __webpack_require__(974),
            },
            _a[constants_1.DATA_LAYER_POINTS_PROGRAM_NAME] = {
                src: __webpack_require__(62),
            },
            _a[constants_1.DATA_LAYER_VECTOR_FIELD_PROGRAM_NAME] = {
                src: __webpack_require__(430),
            },
            _a[constants_1.DATA_LAYER_LINES_PROGRAM_NAME] = {
                src: __webpack_require__(629),
            },
            _a);
        this.verboseLogging = false;
        // Check params.
        var validKeys = ['canvas', 'context', 'contextID', 'contextOptions', 'glslVersion', 'verboseLogging', 'errorCallback'];
        var requiredKeys = ['canvas'];
        var keys = Object.keys(params);
        keys.forEach(function (key) {
            if (validKeys.indexOf(key) < 0) {
                throw new Error("Invalid key \"" + key + "\" passed to new GPUComposer(params).  Valid keys are " + validKeys.join(', ') + ".");
            }
        });
        // Check for required keys.
        requiredKeys.forEach(function (key) {
            if (keys.indexOf(key) < 0) {
                throw new Error("Required params key \"" + key + "\" was not passed to new GPUComposer(params).");
            }
        });
        if (params.verboseLogging !== undefined)
            this.verboseLogging = params.verboseLogging;
        // Save callback in case we run into an error.
        var self = this;
        this._errorCallback = function (message) {
            if (self.errorState) {
                return;
            }
            self.errorState = true;
            params.errorCallback ? params.errorCallback(message) : constants_1.DEFAULT_ERROR_CALLBACK(message);
        };
        var canvas = params.canvas;
        var gl = params.context;
        // Init GL.
        if (!gl) {
            // Init a gl context if not passed in.
            if (params.contextID) {
                gl = canvas.getContext(params.contextID, params.contextOptions);
                if (!gl) {
                    console.warn("Unable to initialize WebGL context with contextID: " + params.contextID + ".");
                }
            }
            if (!gl) {
                gl = canvas.getContext(constants_1.WEBGL2, params.contextOptions)
                    || canvas.getContext(constants_1.WEBGL1, params.contextOptions)
                    || canvas.getContext(constants_1.EXPERIMENTAL_WEBGL, params.contextOptions);
            }
            if (gl === null) {
                this._errorCallback('Unable to initialize WebGL context.');
                return;
            }
        }
        if (utils_1.isWebGL2(gl)) {
            if (this.verboseLogging)
                console.log('Using WebGL 2.0 context.');
        }
        else {
            if (this.verboseLogging)
                console.log('Using WebGL 1.0 context.');
        }
        this.gl = gl;
        // Save glsl version, default to 3 if using webgl2 context.
        var glslVersion = params.glslVersion === undefined ? (utils_1.isWebGL2(gl) ? constants_1.GLSL3 : constants_1.GLSL1) : params.glslVersion;
        if (!utils_1.isWebGL2(gl) && glslVersion === constants_1.GLSL3) {
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
        this.onResize(canvas);
        // Log number of textures available.
        this.maxNumTextures = this.gl.getParameter(this.gl.MAX_TEXTURE_IMAGE_UNITS);
        if (this.verboseLogging)
            console.log(this.maxNumTextures + " textures max.");
    }
    GPUComposer.initWithThreeRenderer = function (renderer, params) {
        var composer = new GPUComposer(__assign(__assign({ floatPrecision: renderer.capabilities.precision || constants_1.PRECISION_HIGH_P, intPrecision: renderer.capabilities.precision || constants_1.PRECISION_HIGH_P }, params), { canvas: renderer.domElement, context: renderer.getContext(), glslVersion: renderer.capabilities.isWebGL2 ? constants_1.GLSL3 : constants_1.GLSL1 }));
        // Attach renderer.
        composer.renderer = renderer;
        return composer;
    };
    GPUComposer.prototype.glslKeyForType = function (type) {
        if (this.glslVersion === constants_1.GLSL1)
            return constants_1.FLOAT;
        switch (type) {
            case constants_1.HALF_FLOAT:
            case constants_1.FLOAT:
                return constants_1.FLOAT;
            case constants_1.UNSIGNED_BYTE:
            case constants_1.UNSIGNED_SHORT:
            case constants_1.UNSIGNED_INT:
                return constants_1.UINT;
            case constants_1.BYTE:
            case constants_1.SHORT:
            case constants_1.INT:
                return constants_1.INT;
            default:
                throw new Error("Invalid type: " + type + " passed to GPUComposer.copyProgramForType.");
        }
    };
    GPUComposer.prototype._setValueProgramForType = function (type) {
        var _a;
        var key = this.glslKeyForType(type);
        if (this.setValuePrograms[key] === undefined) {
            var program = new GPUProgram_1.GPUProgram(this, {
                name: "setValue-" + key,
                fragmentShader: this.setValuePrograms.src,
                uniforms: [
                    {
                        name: 'u_value',
                        value: [0, 0, 0, 0],
                        type: key === constants_1.UINT ? constants_1.INT : key,
                    },
                ],
                defines: (_a = {},
                    _a["WEBGLCOMPUTE_" + key] = '1',
                    _a),
            });
            this.setValuePrograms[key] = program;
        }
        return this.setValuePrograms[key];
    };
    GPUComposer.prototype.copyProgramForType = function (type) {
        var _a;
        var key = this.glslKeyForType(type);
        if (this.copyPrograms[key] === undefined) {
            var program = new GPUProgram_1.GPUProgram(this, {
                name: "copy-" + key,
                fragmentShader: this.copyPrograms.src,
                uniforms: [
                    {
                        name: 'u_state',
                        value: 0,
                        type: constants_1.INT,
                    },
                ],
                defines: (_a = {},
                    _a["WEBGLCOMPUTE_" + key] = '1',
                    _a),
            });
            this.copyPrograms[key] = program;
        }
        return this.copyPrograms[key];
    };
    Object.defineProperty(GPUComposer.prototype, "wrappedLineColorProgram", {
        get: function () {
            if (this._wrappedLineColorProgram === undefined) {
                var program = new GPUProgram_1.GPUProgram(this, {
                    name: 'wrappedLineColor',
                    fragmentShader: __webpack_require__(598),
                });
                this._wrappedLineColorProgram = program;
            }
            return this._wrappedLineColorProgram;
        },
        enumerable: false,
        configurable: true
    });
    GPUComposer.prototype.vectorMagnitudeProgramForType = function (type) {
        var _a;
        var key = this.glslKeyForType(type);
        if (this.vectorMagnitudePrograms[key] === undefined) {
            var program = new GPUProgram_1.GPUProgram(this, {
                name: "vectorMagnitude-" + key,
                fragmentShader: this.vectorMagnitudePrograms.src,
                defines: (_a = {},
                    _a["WEBGLCOMPUTE_" + key] = '1',
                    _a),
            });
            this.vectorMagnitudePrograms[key] = program;
        }
        return this.vectorMagnitudePrograms[key];
    };
    GPUComposer.prototype.isWebGL2 = function () {
        return utils_1.isWebGL2(this.gl);
    };
    Object.defineProperty(GPUComposer.prototype, "quadPositionsBuffer", {
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
    Object.defineProperty(GPUComposer.prototype, "boundaryPositionsBuffer", {
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
    GPUComposer.prototype.getCirclePositionsBuffer = function (numSegments) {
        if (this._circlePositionsBuffer[numSegments] == undefined) {
            var unitCirclePoints = [0, 0];
            for (var i = 0; i <= numSegments; i++) { // TODO: should this be just less than?
                unitCirclePoints.push(Math.cos(2 * Math.PI * i / numSegments), Math.sin(2 * Math.PI * i / numSegments));
            }
            var circlePositions = new Float32Array(unitCirclePoints);
            var buffer = this.initVertexBuffer(circlePositions);
            this._circlePositionsBuffer[numSegments] = buffer;
        }
        return this._circlePositionsBuffer[numSegments];
    };
    GPUComposer.prototype.initVertexBuffer = function (data) {
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
    // Used internally, see GPULayer.clone() for public API.
    GPUComposer.prototype._cloneGPULayer = function (gpuLayer, name) {
        var dimensions = 0;
        try {
            dimensions = gpuLayer.length;
        }
        catch (_a) {
            dimensions = [gpuLayer.width, gpuLayer.height];
        }
        // If read only, get state by reading to GPU.
        var array = gpuLayer.writable ? undefined : this.getValues(gpuLayer);
        var clone = new GPULayer_1.GPULayer(this, {
            name: name || gpuLayer.name + "-clone",
            dimensions: dimensions,
            type: gpuLayer.type,
            numComponents: gpuLayer.numComponents,
            array: array,
            filter: gpuLayer.filter,
            wrapS: gpuLayer.wrapS,
            wrapT: gpuLayer.wrapT,
            writable: gpuLayer.writable,
            numBuffers: gpuLayer.numBuffers,
        });
        // If writable, copy current state with a draw call.
        if (gpuLayer.writable) {
            for (var i = 0; i < gpuLayer.numBuffers - 1; i++) {
                this.step({
                    program: this.copyProgramForType(gpuLayer.type),
                    input: gpuLayer.getStateAtIndex((gpuLayer.bufferIndex + i + 1) % gpuLayer.numBuffers),
                    output: clone,
                });
            }
            this.step({
                program: this.copyProgramForType(gpuLayer.type),
                input: gpuLayer.currentState,
                output: clone,
            });
        }
        return clone;
    };
    GPUComposer.prototype.initTexture = function (params) {
        // Check params.
        var validKeys = ['name', 'url', 'filter', 'wrapS', 'wrapT', 'format', 'type', 'onLoad'];
        Object.keys(params).forEach(function (key) {
            if (validKeys.indexOf(key) < 0) {
                throw new Error("Invalid key \"" + key + "\" passed to GPUComposer.initTexture with name \"" + params.name + "\".  Valid keys are " + validKeys.join(', ') + ".");
            }
        });
        var url = params.url, name = params.name;
        if (!checks_1.isString(url)) {
            throw new Error("Expected GPUComposer.initTexture params to have url of type string, got " + url + " of type " + typeof url + ".");
        }
        if (!checks_1.isString(name)) {
            throw new Error("Expected GPUComposer.initTexture params to have name of type string, got " + name + " of type " + typeof name + ".");
        }
        // Get filter type, default to nearest.
        var filter = params.filter !== undefined ? params.filter : constants_1.NEAREST;
        if (!checks_1.isValidFilter(filter)) {
            throw new Error("Invalid filter: " + filter + " for GPULayer \"" + name + "\", must be " + constants_1.validFilters.join(', ') + ".");
        }
        // Get wrap types, default to clamp to edge.
        var wrapS = params.wrapS !== undefined ? params.wrapS : constants_1.CLAMP_TO_EDGE;
        if (!checks_1.isValidWrap(wrapS)) {
            throw new Error("Invalid wrapS: " + wrapS + " for GPULayer \"" + name + "\", must be " + constants_1.validWraps.join(', ') + ".");
        }
        var wrapT = params.wrapT !== undefined ? params.wrapT : constants_1.CLAMP_TO_EDGE;
        if (!checks_1.isValidWrap(wrapT)) {
            throw new Error("Invalid wrapT: " + wrapT + " for GPULayer \"" + name + "\", must be " + constants_1.validWraps.join(', ') + ".");
        }
        // Get image format type, default to rgba.
        var format = params.format !== undefined ? params.format : constants_1.RGBA;
        if (!checks_1.isValidTextureFormat(format)) {
            throw new Error("Invalid format: " + format + " for GPULayer \"" + name + "\", must be " + constants_1.validTextureFormats.join(', ') + ".");
        }
        // Get image data type, default to unsigned byte.
        var type = params.type !== undefined ? params.type : constants_1.UNSIGNED_BYTE;
        if (!checks_1.isValidTextureType(type)) {
            throw new Error("Invalid type: " + type + " for GPULayer \"" + name + "\", must be " + constants_1.validTextureTypes.join(', ') + ".");
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
            _errorCallback("Error loading image " + name + ": " + e);
        };
        image.src = url;
        return texture;
    };
    GPUComposer.prototype.onResize = function (canvas) {
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
    GPUComposer.prototype.drawSetup = function (program, fullscreenRender, input, output) {
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
    GPUComposer.prototype.setBlendMode = function (shouldBlendAlpha) {
        var gl = this.gl;
        if (shouldBlendAlpha) {
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        }
    };
    GPUComposer.prototype.addLayerToInputs = function (layer, input) {
        // Add layer to end of input if needed.
        var _inputLayers = input;
        if (checks_1.isArray(_inputLayers)) {
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
    GPUComposer.prototype.passThroughLayerDataFromInputToOutput = function (state) {
        // TODO: figure out the fastest way to copy a texture.
        var copyProgram = this.copyProgramForType(state.internalType);
        this.step({
            program: copyProgram,
            input: state,
            output: state,
        });
    };
    GPUComposer.prototype.setOutputLayer = function (fullscreenRender, input, output) {
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
        // TODO: do a better job of checking if input is a texture of same GPULayer as output.
        if (input && ((input === output) || (checks_1.isArray(input) && input.indexOf(output) > -1))) {
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
        var width = output.width, height = output.height;
        gl.viewport(0, 0, width, height);
    };
    ;
    GPUComposer.prototype.setPositionAttribute = function (program, programName) {
        this.setVertexAttribute(program, 'a_internal_position', 2, programName);
    };
    GPUComposer.prototype.setIndexAttribute = function (program, programName) {
        this.setVertexAttribute(program, 'a_internal_index', 1, programName);
    };
    GPUComposer.prototype.setUVAttribute = function (program, programName) {
        this.setVertexAttribute(program, 'a_internal_uv', 2, programName);
    };
    GPUComposer.prototype.setVertexAttribute = function (program, name, size, programName) {
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
    GPUComposer.prototype.step = function (params) {
        var _a = this, gl = _a.gl, errorState = _a.errorState, quadPositionsBuffer = _a.quadPositionsBuffer;
        var program = params.program, input = params.input, output = params.output;
        // Ignore if we are in error state.
        if (errorState) {
            return;
        }
        var glProgram = program._defaultProgram;
        // Do setup - this must come first.
        this.drawSetup(glProgram, true, input, output);
        // Update uniforms and buffers.
        program._setVertexUniform(glProgram, 'u_internal_scale', [1, 1], constants_1.FLOAT);
        program._setVertexUniform(glProgram, 'u_internal_translation', [0, 0], constants_1.FLOAT);
        gl.bindBuffer(gl.ARRAY_BUFFER, quadPositionsBuffer);
        this.setPositionAttribute(glProgram, program.name);
        // Draw.
        this.setBlendMode(params.shouldBlendAlpha);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.disable(gl.BLEND);
    };
    // Step program only for a strip of px along the boundary.
    GPUComposer.prototype.stepBoundary = function (params) {
        var _a = this, gl = _a.gl, errorState = _a.errorState, boundaryPositionsBuffer = _a.boundaryPositionsBuffer;
        var program = params.program, input = params.input, output = params.output;
        var width = output ? output.width : this.width;
        var height = output ? output.height : this.height;
        // Ignore if we are in error state.
        if (errorState) {
            return;
        }
        var glProgram = program._defaultProgram;
        // Do setup - this must come first.
        this.drawSetup(glProgram, false, input, output);
        // Update uniforms and buffers.
        // Frame needs to be offset and scaled so that all four sides are in viewport.
        var onePx = [1 / width, 1 / height];
        program._setVertexUniform(glProgram, 'u_internal_scale', [1 - onePx[0], 1 - onePx[1]], constants_1.FLOAT);
        program._setVertexUniform(glProgram, 'u_internal_translation', onePx, constants_1.FLOAT);
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
    GPUComposer.prototype.stepNonBoundary = function (params) {
        var _a = this, gl = _a.gl, errorState = _a.errorState, quadPositionsBuffer = _a.quadPositionsBuffer;
        var program = params.program, input = params.input, output = params.output;
        var width = output ? output.width : this.width;
        var height = output ? output.height : this.height;
        // Ignore if we are in error state.
        if (errorState) {
            return;
        }
        var glProgram = program._defaultProgram;
        // Do setup - this must come first.
        this.drawSetup(glProgram, false, input, output);
        // Update uniforms and buffers.
        var onePx = [1 / width, 1 / height];
        program._setVertexUniform(glProgram, 'u_internal_scale', [1 - 2 * onePx[0], 1 - 2 * onePx[1]], constants_1.FLOAT);
        program._setVertexUniform(glProgram, 'u_internal_translation', onePx, constants_1.FLOAT);
        gl.bindBuffer(gl.ARRAY_BUFFER, quadPositionsBuffer);
        this.setPositionAttribute(glProgram, program.name);
        // Draw.
        this.setBlendMode(params.shouldBlendAlpha);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.disable(gl.BLEND);
    };
    // Step program only for a circular spot.
    GPUComposer.prototype.stepCircle = function (params) {
        var _a = this, gl = _a.gl, errorState = _a.errorState, width = _a.width, height = _a.height;
        var program = params.program, position = params.position, radius = params.radius, input = params.input, output = params.output;
        // Ignore if we are in error state.
        if (errorState) {
            return;
        }
        var glProgram = program._defaultProgram;
        // Do setup - this must come first.
        this.drawSetup(glProgram, false, input, output);
        // Update uniforms and buffers.
        program._setVertexUniform(glProgram, 'u_internal_scale', [radius * 2 / width, radius * 2 / height], constants_1.FLOAT);
        program._setVertexUniform(glProgram, 'u_internal_translation', [2 * position[0] / width - 1, 2 * position[1] / height - 1], constants_1.FLOAT);
        var numSegments = params.numSegments ? params.numSegments : constants_1.DEFAULT_CIRCLE_NUM_SEGMENTS;
        if (numSegments < 3) {
            throw new Error("numSegments for GPUComposer.stepCircle must be greater than 2, got " + numSegments + ".");
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, this.getCirclePositionsBuffer(numSegments));
        this.setPositionAttribute(glProgram, program.name);
        // Draw.
        this.setBlendMode(params.shouldBlendAlpha);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, numSegments + 2);
        gl.disable(gl.BLEND);
    };
    // Step program only for a thickened line segment (rounded end caps available).
    GPUComposer.prototype.stepSegment = function (params) {
        var _a = this, gl = _a.gl, errorState = _a.errorState;
        var program = params.program, position1 = params.position1, position2 = params.position2, thickness = params.thickness, input = params.input, output = params.output;
        var width = output ? output.width : this.width;
        var height = output ? output.height : this.height;
        // Ignore if we are in error state.
        if (errorState) {
            return;
        }
        var glProgram = program._segmentProgram;
        // Do setup - this must come first.
        this.drawSetup(glProgram, false, input, output);
        // Update uniforms and buffers.
        program._setVertexUniform(glProgram, 'u_internal_halfThickness', thickness / 2, constants_1.FLOAT);
        program._setVertexUniform(glProgram, 'u_internal_scale', [2 / width, 2 / height], constants_1.FLOAT);
        var diffX = position1[0] - position2[0];
        var diffY = position1[1] - position2[1];
        var angle = Math.atan2(diffY, diffX);
        program._setVertexUniform(glProgram, 'u_internal_rotation', angle, constants_1.FLOAT);
        var centerX = (position1[0] + position2[0]) / 2;
        var centerY = (position1[1] + position2[1]) / 2;
        program._setVertexUniform(glProgram, 'u_internal_translation', [2 * centerX / this.width - 1, 2 * centerY / this.height - 1], constants_1.FLOAT);
        var length = Math.sqrt(diffX * diffX + diffY * diffY);
        var numSegments = params.numCapSegments ? params.numCapSegments * 2 : constants_1.DEFAULT_CIRCLE_NUM_SEGMENTS;
        if (params.endCaps) {
            if (numSegments < 6 || numSegments % 6 !== 0) {
                throw new Error("numSegments for GPUComposer.stepSegment must be divisible by 6, got " + numSegments + ".");
            }
            // Have to subtract a small offset from length.
            program._setVertexUniform(glProgram, 'u_internal_length', length - thickness * Math.sin(Math.PI / numSegments), constants_1.FLOAT);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.getCirclePositionsBuffer(numSegments));
        }
        else {
            // Have to subtract a small offset from length.
            program._setVertexUniform(glProgram, 'u_internal_length', length - thickness, constants_1.FLOAT);
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
    GPUComposer.prototype.stepPolyline = function (params) {
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
            (normals ? program._defaultProgramWithUVNormal : program._defaultProgramWithUV) :
            (normals ? program._defaultProgramWithNormal : program._defaultProgram));
        // Do setup - this must come first.
        this.drawSetup(glProgram, false, input, output);
        // Update uniforms and buffers.
        program._setVertexUniform(glProgram, 'u_internal_scale', [2 / width, 2 / height], constants_1.FLOAT);
        program._setVertexUniform(glProgram, 'u_internal_translation', [-1, -1], constants_1.FLOAT);
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
    GPUComposer.prototype.stepTriangleStrip = function (params) {
        var program = params.program, input = params.input, output = params.output, positions = params.positions, uvs = params.uvs, normals = params.normals;
        var _a = this, gl = _a.gl, width = _a.width, height = _a.height, errorState = _a.errorState;
        // Ignore if we are in error state.
        if (errorState) {
            return;
        }
        var glProgram = (uvs ?
            (normals ? program._defaultProgramWithUVNormal : program._defaultProgramWithUV) :
            (normals ? program._defaultProgramWithNormal : program._defaultProgram));
        // Do setup - this must come first.
        this.drawSetup(glProgram, false, input, output);
        // Update uniforms and buffers.
        program._setVertexUniform(glProgram, 'u_internal_scale', [2 / width, 2 / height], constants_1.FLOAT);
        program._setVertexUniform(glProgram, 'u_internal_translation', [-1, -1], constants_1.FLOAT);
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
    GPUComposer.prototype.stepLines = function (params) {
        var _a = this, gl = _a.gl, errorState = _a.errorState, width = _a.width, height = _a.height;
        var indices = params.indices, uvs = params.uvs, normals = params.normals, input = params.input, output = params.output, program = params.program;
        // Ignore if we are in error state.
        if (errorState) {
            return;
        }
        // Check that params are valid.
        if (params.closeLoop && indices) {
            throw new Error("GPUComposer.stepLines() can't be called with closeLoop == true and indices.");
        }
        var glProgram = (uvs ?
            (normals ? program._defaultProgramWithUVNormal : program._defaultProgramWithUV) :
            (normals ? program._defaultProgramWithNormal : program._defaultProgram));
        // Do setup - this must come first.
        this.drawSetup(glProgram, false, input, output);
        var count = params.count ? params.count : (indices ? indices.length : (params.positions.length / 2));
        // Update uniforms and buffers.
        program._setVertexUniform(glProgram, 'u_internal_scale', [2 / width, 2 / height], constants_1.FLOAT);
        program._setVertexUniform(glProgram, 'u_internal_translation', [-1, -1], constants_1.FLOAT);
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
    GPUComposer.prototype.drawLayerAsPoints = function (params) {
        var _a = this, gl = _a.gl, errorState = _a.errorState, pointIndexArray = _a.pointIndexArray, width = _a.width, height = _a.height;
        var positions = params.positions, output = params.output;
        // Ignore if we are in error state.
        if (errorState) {
            return;
        }
        // Check that numPoints is valid.
        if (positions.numComponents !== 2 && positions.numComponents !== 4) {
            throw new Error("GPUComposer.drawPoints() must be passed a position GPULayer with either 2 or 4 components, got position GPULayer \"" + positions.name + "\" with " + positions.numComponents + " components.");
        }
        var length = positions.length;
        var count = params.count || length;
        if (count > length) {
            throw new Error("Invalid count " + count + " for position GPULayer of length " + length + ".");
        }
        var program = params.program;
        if (program === undefined) {
            program = this._setValueProgramForType(constants_1.FLOAT);
            var color = params.color || [1, 0, 0]; // Default of red.
            program.setUniform('u_value', __spreadArrays(color, [1]), constants_1.FLOAT);
        }
        var glProgram = program._GPULayerPointsProgram;
        // Add positions to end of input if needed.
        var input = this.addLayerToInputs(positions, params.input);
        // Do setup - this must come first.
        this.drawSetup(glProgram, false, input, output);
        // Update uniforms and buffers.
        program._setVertexUniform(glProgram, 'u_internal_positions', input.indexOf(positions), constants_1.INT);
        program._setVertexUniform(glProgram, 'u_internal_scale', [1 / width, 1 / height], constants_1.FLOAT);
        // Tell whether we are using an absolute position (2 components), or position with accumulation buffer (4 components, better floating pt accuracy).
        program._setVertexUniform(glProgram, 'u_internal_positionWithAccumulation', positions.numComponents === 4 ? 1 : 0, constants_1.INT);
        // Set default pointSize.
        var pointSize = params.pointSize || 1;
        program._setVertexUniform(glProgram, 'u_internal_pointSize', pointSize, constants_1.FLOAT);
        var positionLayerDimensions = [positions.width, positions.height];
        program._setVertexUniform(glProgram, 'u_internal_positionsDimensions', positionLayerDimensions, constants_1.FLOAT);
        program._setVertexUniform(glProgram, 'u_internal_wrapX', params.wrapX ? 1 : 0, constants_1.INT);
        program._setVertexUniform(glProgram, 'u_internal_wrapY', params.wrapY ? 1 : 0, constants_1.INT);
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
    GPUComposer.prototype.drawLayerAsLines = function (params) {
        var _a = this, gl = _a.gl, errorState = _a.errorState, width = _a.width, height = _a.height;
        var positions = params.positions, output = params.output;
        // Ignore if we are in error state.
        if (errorState) {
            return;
        }
        // Check that positions is valid.
        if (positions.numComponents !== 2 && positions.numComponents !== 4) {
            throw new Error("GPUComposer.drawLayerAsLines() must be passed a position GPULayer with either 2 or 4 components, got position GPULayer \"" + positions.name + "\" with " + positions.numComponents + " components.");
        }
        // Check that params are valid.
        if (params.closeLoop && params.indices) {
            throw new Error("GPUComposer.drawLayerAsLines() can't be called with closeLoop == true and indices.");
        }
        var program = params.program;
        if (program === undefined) {
            program = params.wrapX || params.wrapY ? this.wrappedLineColorProgram : this._setValueProgramForType(constants_1.FLOAT);
            ;
            var color = params.color || [1, 0, 0]; // Default to red.
            program.setUniform('u_value', __spreadArrays(color, [1]), constants_1.FLOAT);
        }
        var glProgram = program._GPULayerLinesProgram;
        // Add positionLayer to end of input if needed.
        var input = this.addLayerToInputs(positions, params.input);
        // Do setup - this must come first.
        this.drawSetup(glProgram, false, input, output);
        // TODO: cache indexArray if no indices passed in.
        var indices = params.indices ? params.indices : utils_1.initSequentialFloatArray(params.count || positions.length);
        var count = params.count ? params.count : indices.length;
        // Update uniforms and buffers.
        program._setVertexUniform(glProgram, 'u_internal_positions', input.indexOf(positions), constants_1.INT);
        program._setVertexUniform(glProgram, 'u_internal_scale', [1 / width, 1 / height], constants_1.FLOAT);
        // Tell whether we are using an absolute position (2 components), or position with accumulation buffer (4 components, better floating pt accuracy).
        program._setVertexUniform(glProgram, 'u_internal_positionWithAccumulation', positions.numComponents === 4 ? 1 : 0, constants_1.INT);
        var positionLayerDimensions = [positions.width, positions.height];
        program._setVertexUniform(glProgram, 'u_internal_positionsDimensions', positionLayerDimensions, constants_1.FLOAT);
        program._setVertexUniform(glProgram, 'u_internal_wrapX', params.wrapX ? 1 : 0, constants_1.INT);
        program._setVertexUniform(glProgram, 'u_internal_wrapY', params.wrapY ? 1 : 0, constants_1.INT);
        if (this.indexedLinesIndexBuffer === undefined) {
            // Have to use float32 array bc int is not supported as a vertex attribute type.
            var floatArray = void 0;
            if (indices.constructor !== Float32Array) {
                // Have to use float32 array bc int is not supported as a vertex attribute type.
                floatArray = new Float32Array(indices.length);
                for (var i = 0; i < count; i++) {
                    floatArray[i] = indices[i];
                }
                console.warn("Converting indices array of type " + indices.constructor + " to Float32Array in GPUComposer.drawIndexedLines for WebGL compatibility, you may want to use a Float32Array to store this information so the conversion is not required.");
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
    GPUComposer.prototype.drawLayerAsVectorField = function (params) {
        var _a = this, gl = _a.gl, errorState = _a.errorState, vectorFieldIndexArray = _a.vectorFieldIndexArray, width = _a.width, height = _a.height;
        var data = params.data, output = params.output;
        // Ignore if we are in error state.
        if (errorState) {
            return;
        }
        // Check that field is valid.
        if (data.numComponents !== 2) {
            throw new Error("GPUComposer.drawLayerAsVectorField() must be passed a fieldLayer with 2 components, got fieldLayer \"" + data.name + "\" with " + data.numComponents + " components.");
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
            program.setUniform('u_value', __spreadArrays(color, [1]), constants_1.FLOAT);
        }
        var glProgram = program._GPULayerVectorFieldProgram;
        // Add data to end of input if needed.
        var input = this.addLayerToInputs(data, params.input);
        // Do setup - this must come first.
        this.drawSetup(glProgram, false, input, output);
        // Update uniforms and buffers.
        program._setVertexUniform(glProgram, 'u_internal_vectors', input.indexOf(data), constants_1.INT);
        // Set default scale.
        var vectorScale = params.vectorScale || 1;
        program._setVertexUniform(glProgram, 'u_internal_scale', [vectorScale / width, vectorScale / height], constants_1.FLOAT);
        var vectorSpacing = params.vectorSpacing || 10;
        var spacedDimensions = [Math.floor(width / vectorSpacing), Math.floor(height / vectorSpacing)];
        program._setVertexUniform(glProgram, 'u_internal_dimensions', spacedDimensions, constants_1.FLOAT);
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
    GPUComposer.prototype.drawLayerMagnitude = function (params) {
        var _a = this, gl = _a.gl, errorState = _a.errorState, quadPositionsBuffer = _a.quadPositionsBuffer;
        var data = params.data, output = params.output;
        // Ignore if we are in error state.
        if (errorState) {
            return;
        }
        var program = this.vectorMagnitudeProgramForType(data.type);
        var color = params.color || [1, 0, 0]; // Default to red.
        program.setUniform('u_color', color, constants_1.FLOAT);
        var scale = params.scale || 1;
        program.setUniform('u_scale', scale, constants_1.FLOAT);
        program.setUniform('u_internal_numDimensions', data.numComponents, constants_1.INT);
        var glProgram = program._defaultProgram;
        // Add data to end of input if needed.
        var input = this.addLayerToInputs(data, params.input);
        // Do setup - this must come first.
        this.drawSetup(glProgram, true, input, output);
        // Update uniforms and buffers.
        program._setVertexUniform(glProgram, 'u_internal_data', input.indexOf(data), constants_1.INT);
        program._setVertexUniform(glProgram, 'u_internal_scale', [1, 1], constants_1.FLOAT);
        program._setVertexUniform(glProgram, 'u_internal_translation', [0, 0], constants_1.FLOAT);
        gl.bindBuffer(gl.ARRAY_BUFFER, quadPositionsBuffer);
        this.setPositionAttribute(glProgram, program.name);
        // Draw.
        this.setBlendMode(params.shouldBlendAlpha);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.disable(gl.BLEND);
    };
    GPUComposer.prototype.getValues = function (gpuLayer) {
        var _a = this, gl = _a.gl, glslVersion = _a.glslVersion;
        // In case GPULayer was not the last output written to.
        gpuLayer._bindOutputBuffer();
        var width = gpuLayer.width, height = gpuLayer.height;
        var glNumChannels = gpuLayer.glNumChannels, glType = gpuLayer.glType, glFormat = gpuLayer.glFormat, internalType = gpuLayer.internalType;
        var values;
        switch (internalType) {
            case constants_1.HALF_FLOAT:
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
            case constants_1.FLOAT:
                // Chrome and Firefox require that RGBA/FLOAT is used for readPixels of float32 types.
                // https://github.com/KhronosGroup/WebGL/issues/2747
                glNumChannels = 4;
                glFormat = gl.RGBA;
                values = new Float32Array(width * height * glNumChannels);
                break;
            case constants_1.UNSIGNED_BYTE:
                if (glslVersion === constants_1.GLSL1) {
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
            case constants_1.UNSIGNED_SHORT:
                // Firefox requires that RGBA_INTEGER/UNSIGNED_INT is used for readPixels of unsigned int types.
                glNumChannels = 4;
                glFormat = gl.RGBA_INTEGER;
                glType = gl.UNSIGNED_INT;
                values = new Uint32Array(width * height * glNumChannels);
                // // The following works in Chrome.
                // values = new Uint16Array(width * height * glNumChannels);
                break;
            case constants_1.UNSIGNED_INT:
                // Firefox requires that RGBA_INTEGER/UNSIGNED_INT is used for readPixels of unsigned int types.
                glNumChannels = 4;
                glFormat = gl.RGBA_INTEGER;
                values = new Uint32Array(width * height * glNumChannels);
                // // The following works in Chrome.
                // values = new Uint32Array(width * height * glNumChannels);
                break;
            case constants_1.BYTE:
                // Firefox requires that RGBA_INTEGER/INT is used for readPixels of int types.
                glNumChannels = 4;
                glFormat = gl.RGBA_INTEGER;
                glType = gl.INT;
                values = new Int32Array(width * height * glNumChannels);
                // // The following works in Chrome.
                // values = new Int8Array(width * height * glNumChannels);
                break;
            case constants_1.SHORT:
                // Firefox requires that RGBA_INTEGER/INT is used for readPixels of int types.
                glNumChannels = 4;
                glFormat = gl.RGBA_INTEGER;
                glType = gl.INT;
                values = new Int32Array(width * height * glNumChannels);
                // // The following works in Chrome.
                // values = new Int16Array(width * height * glNumChannels);
                break;
            case constants_1.INT:
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
            var numComponents = gpuLayer.numComponents, type = gpuLayer.type;
            var OUTPUT_LENGTH = (gpuLayer._length ? gpuLayer._length : width * height) * numComponents;
            // Convert uint16 to float32 if needed.
            var handleFloat16Conversion = internalType === constants_1.HALF_FLOAT && values.constructor === Uint16Array;
            // @ts-ignore
            var view = handleFloat16Conversion ? new DataView(values.buffer) : undefined;
            var output = values;
            // We may use a different internal type than the assigned type of the GPULayer.
            if (internalType !== type) {
                switch (type) {
                    case constants_1.HALF_FLOAT:
                    case constants_1.FLOAT:
                        output = new Float32Array(OUTPUT_LENGTH);
                        break;
                    case constants_1.UNSIGNED_BYTE:
                        output = new Uint8Array(OUTPUT_LENGTH);
                        break;
                    case constants_1.BYTE:
                        output = new Int8Array(OUTPUT_LENGTH);
                        break;
                    case constants_1.UNSIGNED_SHORT:
                        output = new Uint16Array(OUTPUT_LENGTH);
                        break;
                    case constants_1.SHORT:
                        output = new Int16Array(OUTPUT_LENGTH);
                        break;
                    case constants_1.UNSIGNED_INT:
                        output = new Uint32Array(OUTPUT_LENGTH);
                        break;
                    case constants_1.INT:
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
                    if (index2 >= OUTPUT_LENGTH)
                        break;
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
    GPUComposer.prototype.readyToRead = function () {
        var gl = this.gl;
        return gl.checkFramebufferStatus(gl.FRAMEBUFFER) == gl.FRAMEBUFFER_COMPLETE;
    };
    ;
    GPUComposer.prototype.savePNG = function (GPULayer, filename, dpi, callback) {
        if (filename === void 0) { filename = GPULayer.name; }
        if (callback === void 0) { callback = file_saver_1.saveAs; }
        var values = this.getValues(GPULayer);
        var width = GPULayer.width, height = GPULayer.height;
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var context = canvas.getContext('2d');
        var imageData = context.getImageData(0, 0, width, height);
        var buffer = imageData.data;
        // TODO: this isn't working for UNSIGNED_BYTE types?
        var isFloat = GPULayer.type === constants_1.FLOAT || GPULayer.type === constants_1.HALF_FLOAT;
        // Have to flip the y axis since PNGs are written top to bottom.
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                var index = y * width + x;
                var indexFlipped = (height - 1 - y) * width + x;
                for (var i = 0; i < GPULayer.numComponents; i++) {
                    buffer[4 * indexFlipped + i] = values[GPULayer.numComponents * index + i] * (isFloat ? 255 : 1);
                }
                if (GPULayer.numComponents < 4) {
                    buffer[4 * indexFlipped + 3] = 255; // Set alpha channel to 255.
                }
            }
        }
        context.putImageData(imageData, 0, 0);
        canvas.toBlob(function (blob) {
            if (!blob) {
                console.warn('Problem saving PNG, unable to init blob.');
                return;
            }
            if (dpi) {
                changedpi_1.changeDpiBlob(blob, dpi).then(function (blob) {
                    callback(blob, filename + ".png");
                });
            }
            else {
                callback(blob, filename + ".png");
            }
        }, 'image/png');
    };
    GPUComposer.prototype.attachGPULayerToThreeTexture = function (GPULayer, texture) {
        if (!this.renderer) {
            throw new Error('GPUComposer was not inited with a renderer.');
        }
        // Link webgl texture to threejs object.
        // This is not officially supported.
        if (GPULayer.numBuffers > 1) {
            throw new Error("GPULayer \"" + GPULayer.name + "\" contains multiple WebGL textures (one for each buffer) that are flip-flopped during compute cycles, please choose a GPULayer with one buffer.");
        }
        var offsetTextureProperties = this.renderer.properties.get(texture);
        offsetTextureProperties.__webglTexture = GPULayer.currentState;
        offsetTextureProperties.__webglInit = true;
    };
    GPUComposer.prototype.resetThreeState = function () {
        if (!this.renderer) {
            throw new Error('GPUComposer was not inited with a renderer.');
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
    GPUComposer.prototype.dispose = function () {
        var _a;
        var _b = this, gl = _b.gl, verboseLogging = _b.verboseLogging, _vertexShaders = _b._vertexShaders, copyPrograms = _b.copyPrograms, setValuePrograms = _b.setValuePrograms, vectorMagnitudePrograms = _b.vectorMagnitudePrograms;
        if (verboseLogging)
            console.log("Deallocating GPUComposer.");
        // TODO: delete buffers.
        // Delete vertex shaders.
        Object.values(_vertexShaders).forEach(function (vertexShader) {
            if (vertexShader.shader) {
                gl.deleteShader(vertexShader.shader);
                delete vertexShader.shader;
            }
        });
        // Delete fragment shaders.
        Object.values(copyPrograms).forEach(function (program) {
            // @ts-ignore
            if (program.dispose)
                program.dispose();
        });
        Object.keys(copyPrograms).forEach(function (key) {
            // @ts-ignore
            delete copyPrograms[key];
        });
        Object.values(setValuePrograms).forEach(function (program) {
            // @ts-ignore
            if (program.dispose)
                program.dispose();
        });
        Object.keys(setValuePrograms).forEach(function (key) {
            // @ts-ignore
            delete setValuePrograms[key];
        });
        Object.values(vectorMagnitudePrograms).forEach(function (program) {
            // @ts-ignore
            if (program.dispose)
                program.dispose();
        });
        Object.keys(vectorMagnitudePrograms).forEach(function (key) {
            // @ts-ignore
            delete vectorMagnitudePrograms[key];
        });
        (_a = this._wrappedLineColorProgram) === null || _a === void 0 ? void 0 : _a.dispose();
        delete this._wrappedLineColorProgram;
        delete this.renderer;
        // @ts-ignore
        delete this.gl;
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
var float16_1 = __webpack_require__(501);
var checks_1 = __webpack_require__(707);
var constants_1 = __webpack_require__(601);
var extensions_1 = __webpack_require__(581);
var utils_1 = __webpack_require__(593);
var GPULayer = /** @class */ (function () {
    function GPULayer(composer, params) {
        // Each GPULayer may contain a number of buffers to store different instances of the state.
        // e.g [currentState, previousState]
        this._bufferIndex = 0;
        this.buffers = [];
        // Check constructor parameters.
        var name = (params || {}).name;
        if (!composer) {
            throw new Error("Error initing GPULayer \"" + name + "\": must pass GPUComposer instance to GPULayer(composer, params).");
        }
        // Check params.
        var validKeys = ['name', 'dimensions', 'type', 'numComponents', 'array', 'filter', 'wrapS', 'wrapT', 'writable', 'numBuffers', 'clearValue'];
        var requiredKeys = ['name', 'dimensions', 'type', 'numComponents'];
        var keys = Object.keys(params);
        keys.forEach(function (key) {
            if (validKeys.indexOf(key) < 0) {
                throw new Error("Invalid params key \"" + key + "\" passed to GPULayer(composer, params) with name \"" + params.name + "\".  Valid keys are " + validKeys.join(', ') + ".");
            }
        });
        // Check for required keys.
        requiredKeys.forEach(function (key) {
            if (keys.indexOf(key) < 0) {
                throw new Error("Required params key \"" + key + "\" was not passed to GPUProgram(composer, params) with name \"" + name + "\".");
            }
        });
        var dimensions = params.dimensions, type = params.type, numComponents = params.numComponents, array = params.array;
        var gl = composer.gl, _errorCallback = composer._errorCallback, glslVersion = composer.glslVersion;
        // Save params.
        this.composer = composer;
        this.name = name;
        // numComponents must be between 1 and 4.
        if (!checks_1.isPositiveInteger(numComponents) || numComponents > 4) {
            throw new Error("Invalid numComponents: " + numComponents + " for GPULayer \"" + name + "\".");
        }
        this.numComponents = numComponents;
        // Writable defaults to false.
        var writable = !!params.writable;
        this.writable = writable;
        // Set dimensions, may be 1D or 2D.
        var _a = GPULayer.calcSize(dimensions, name, composer.verboseLogging), length = _a.length, width = _a.width, height = _a.height;
        this._length = length;
        if (!checks_1.isPositiveInteger(width)) {
            throw new Error("Invalid width: " + width + " for GPULayer \"" + name + "\".");
        }
        this._width = width;
        if (!checks_1.isPositiveInteger(height)) {
            throw new Error("Invalid length: " + height + " for GPULayer \"" + name + "\".");
        }
        this._height = height;
        // Set filtering - if we are processing a 1D array, default to NEAREST filtering.
        // Else default to LINEAR (interpolation) filtering for float types and NEAREST for integer types.
        var defaultFilter = length ? constants_1.NEAREST : ((type === constants_1.FLOAT || type == constants_1.HALF_FLOAT) ? constants_1.LINEAR : constants_1.NEAREST);
        var filter = params.filter !== undefined ? params.filter : defaultFilter;
        if (!checks_1.isValidFilter(filter)) {
            throw new Error("Invalid filter: " + filter + " for GPULayer \"" + name + "\", must be one of [" + constants_1.validFilters.join(', ') + "].");
        }
        // Don't allow LINEAR filtering on integer types, it is not supported.
        if (filter === constants_1.LINEAR && !(type === constants_1.FLOAT || type == constants_1.HALF_FLOAT)) {
            throw new Error("LINEAR filtering is not supported on integer types, please use NEAREST filtering for GPULayer \"" + name + "\" with type: " + type + ".");
        }
        this.filter = filter;
        // Get wrap types, default to clamp to edge.
        var wrapS = params.wrapS !== undefined ? params.wrapS : constants_1.CLAMP_TO_EDGE;
        if (!checks_1.isValidWrap(wrapS)) {
            throw new Error("Invalid wrapS: " + wrapS + " for GPULayer \"" + name + "\", must be one of [" + constants_1.validWraps.join(', ') + "].");
        }
        this.wrapS = wrapS;
        var wrapT = params.wrapT !== undefined ? params.wrapT : constants_1.CLAMP_TO_EDGE;
        if (!checks_1.isValidWrap(wrapT)) {
            throw new Error("Invalid wrapT: " + wrapT + " for GPULayer \"" + name + "\", must be one of [" + constants_1.validWraps.join(', ') + "].");
        }
        this.wrapT = wrapT;
        // Set data type.
        if (!checks_1.isValidDataType(type)) {
            throw new Error("Invalid type: " + type + " for GPULayer \"" + name + "\", must be one of [" + constants_1.validDataTypes.join(', ') + "].");
        }
        this.type = type;
        var internalType = GPULayer.getInternalType({
            gl: gl,
            type: type,
            glslVersion: glslVersion,
            writable: writable,
            name: name,
            errorCallback: _errorCallback,
        });
        this.internalType = internalType;
        // Set gl texture parameters.
        var _b = GPULayer.getGLTextureParameters({
            gl: gl,
            name: name,
            numComponents: numComponents,
            writable: writable,
            internalType: internalType,
            glslVersion: glslVersion,
            errorCallback: _errorCallback,
        }), glFormat = _b.glFormat, glInternalFormat = _b.glInternalFormat, glType = _b.glType, glNumChannels = _b.glNumChannels;
        this.glInternalFormat = glInternalFormat;
        this.glFormat = glFormat;
        this.glType = glType;
        this.glNumChannels = glNumChannels;
        // Set internal filtering/wrap types.
        this.internalFilter = GPULayer.getInternalFilter({ gl: gl, filter: filter, internalType: internalType, name: name, errorCallback: _errorCallback });
        this.glFilter = gl[this.internalFilter];
        this.internalWrapS = GPULayer.getInternalWrap({ gl: gl, wrap: wrapS, name: name });
        this.glWrapS = gl[this.internalWrapS];
        this.internalWrapT = GPULayer.getInternalWrap({ gl: gl, wrap: wrapT, name: name });
        this.glWrapT = gl[this.internalWrapT];
        // Num buffers is the number of states to store for this data.
        var numBuffers = params.numBuffers !== undefined ? params.numBuffers : 1;
        if (!checks_1.isPositiveInteger(numBuffers)) {
            throw new Error("Invalid numBuffers: " + numBuffers + " for GPULayer \"" + name + "\", must be positive integer.");
        }
        this.numBuffers = numBuffers;
        // clearValue defaults to zero.
        // Wait until after type has been set to set clearValue.
        var clearValue = params.clearValue !== undefined ? params.clearValue : 0;
        this.clearValue = clearValue; // Setter can only be called after this.numComponents has been set.
        this.initBuffers(array);
    }
    GPULayer.calcSize = function (size, name, verboseLogging) {
        var length, width, height;
        if (!isNaN(size)) {
            if (!checks_1.isPositiveInteger(size)) {
                throw new Error("Invalid length: " + size + " for GPULayer \"" + name + "\", must be positive integer.");
            }
            length = size;
            // Calc power of two width and height for length.
            var exp = 1;
            var remainder = length;
            while (remainder > 2) {
                exp++;
                remainder /= 2;
            }
            width = Math.pow(2, Math.floor(exp / 2) + exp % 2);
            height = Math.pow(2, Math.floor(exp / 2));
            if (verboseLogging) {
                console.log("Using [" + width + ", " + height + "] for 1D array of length " + size + " in GPULayer \"" + name + "\".");
            }
        }
        else {
            width = size[0];
            if (!checks_1.isPositiveInteger(width)) {
                throw new Error("Invalid width: " + width + " for GPULayer \"" + name + "\", must be positive integer.");
            }
            height = size[1];
            if (!checks_1.isPositiveInteger(height)) {
                throw new Error("Invalid height: " + height + " for GPULayer \"" + name + "\", must be positive integer.");
            }
        }
        return { width: width, height: height, length: length };
    };
    GPULayer.getInternalWrap = function (params) {
        var gl = params.gl, wrap = params.wrap, name = params.name;
        // Webgl2.0 supports all combinations of types and filtering.
        if (utils_1.isWebGL2(gl)) {
            return wrap;
        }
        // CLAMP_TO_EDGE is always supported.
        if (wrap === constants_1.CLAMP_TO_EDGE) {
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
            console.warn("Falling back to CLAMP_TO_EDGE wrapping for GPULayer \"" + name + "\" for WebGL 1.");
            return constants_1.CLAMP_TO_EDGE;
        }
        return wrap;
    };
    GPULayer.getInternalFilter = function (params) {
        var gl = params.gl, errorCallback = params.errorCallback, internalType = params.internalType, name = params.name;
        var filter = params.filter;
        if (filter === constants_1.NEAREST) {
            // NEAREST filtering is always supported.
            return filter;
        }
        if (internalType === constants_1.HALF_FLOAT) {
            // TODO: test if float linear extension is actually working.
            var extension = extensions_1.getExtension(gl, extensions_1.OES_TEXTURE_HAlF_FLOAT_LINEAR, errorCallback, true)
                || extensions_1.getExtension(gl, extensions_1.OES_TEXTURE_FLOAT_LINEAR, errorCallback, true);
            if (!extension) {
                console.warn("Falling back to NEAREST filter for GPULayer \"" + name + "\".");
                //TODO: add a fallback that does this filtering in the frag shader?.
                filter = constants_1.NEAREST;
            }
        }
        if (internalType === constants_1.FLOAT) {
            var extension = extensions_1.getExtension(gl, extensions_1.OES_TEXTURE_FLOAT_LINEAR, errorCallback, true);
            if (!extension) {
                console.warn("Falling back to NEAREST filter for GPULayer \"" + name + "\".");
                //TODO: add a fallback that does this filtering in the frag shader?.
                filter = constants_1.NEAREST;
            }
        }
        return filter;
    };
    GPULayer.getInternalType = function (params) {
        var gl = params.gl, errorCallback = params.errorCallback, writable = params.writable, name = params.name, glslVersion = params.glslVersion;
        var type = params.type;
        var internalType = type;
        // Check if int types are supported.
        var intCast = GPULayer.shouldCastIntTypeAsFloat(params);
        if (intCast) {
            if (internalType === constants_1.UNSIGNED_BYTE || internalType === constants_1.BYTE) {
                // Integers between 0 and 2048 can be exactly represented by half float (and also between −2048 and 0)
                internalType = constants_1.HALF_FLOAT;
            }
            else {
                // Integers between 0 and 16777216 can be exactly represented by float32 (also applies for negative integers between −16777216 and 0)
                // This is sufficient for UNSIGNED_SHORT and SHORT types.
                // Large UNSIGNED_INT and INT cannot be represented by FLOAT type.
                console.warn("Falling back " + internalType + " type to FLOAT type for glsl1.x support for GPULayer \"" + name + "\".\nLarge UNSIGNED_INT or INT with absolute value > 16,777,216 are not supported, on mobile UNSIGNED_INT, INT, UNSIGNED_SHORT, and SHORT with absolute value > 2,048 may not be supported.");
                internalType = constants_1.FLOAT;
            }
        }
        // Check if float32 supported.
        if (!utils_1.isWebGL2(gl)) {
            if (internalType === constants_1.FLOAT) {
                var extension = extensions_1.getExtension(gl, extensions_1.OES_TEXTURE_FLOAT, errorCallback, true);
                if (!extension) {
                    console.warn("FLOAT not supported, falling back to HALF_FLOAT type for GPULayer \"" + name + "\".");
                    internalType = constants_1.HALF_FLOAT;
                }
                // https://stackoverflow.com/questions/17476632/webgl-extension-support-across-browsers
                // Rendering to a floating-point texture may not be supported,
                // even if the OES_texture_float extension is supported.
                // Typically, this fails on current mobile hardware.
                // To check if this is supported, you have to call the WebGL
                // checkFramebufferStatus() function.
                if (writable) {
                    var valid = GPULayer.testFramebufferWrite({ gl: gl, type: internalType, glslVersion: glslVersion });
                    if (!valid && internalType !== constants_1.HALF_FLOAT) {
                        console.warn("FLOAT not supported for writing operations, falling back to HALF_FLOAT type for GPULayer \"" + name + "\".");
                        internalType = constants_1.HALF_FLOAT;
                    }
                }
            }
            // Must support at least half float if using a float type.
            if (internalType === constants_1.HALF_FLOAT) {
                extensions_1.getExtension(gl, extensions_1.OES_TEXTURE_HALF_FLOAT, errorCallback);
                // TODO: https://stackoverflow.com/questions/54248633/cannot-create-half-float-oes-texture-from-uint16array-on-ipad
                if (writable) {
                    var valid = GPULayer.testFramebufferWrite({ gl: gl, type: internalType, glslVersion: glslVersion });
                    if (!valid) {
                        errorCallback("This browser does not support rendering to HALF_FLOAT textures.");
                    }
                }
            }
        }
        // Load additional extensions if needed.
        if (writable && utils_1.isWebGL2(gl) && (internalType === constants_1.HALF_FLOAT || internalType === constants_1.FLOAT)) {
            extensions_1.getExtension(gl, extensions_1.EXT_COLOR_BUFFER_FLOAT, errorCallback);
        }
        return internalType;
    };
    GPULayer.shouldCastIntTypeAsFloat = function (params) {
        var gl = params.gl, type = params.type, glslVersion = params.glslVersion;
        // All types are supported by WebGL2 + glsl3.
        if (glslVersion === constants_1.GLSL3 && utils_1.isWebGL2(gl))
            return false;
        // Int textures (other than UNSIGNED_BYTE) are not supported by WebGL1.0 or glsl1.x.
        // https://stackoverflow.com/questions/55803017/how-to-select-webgl-glsl-sampler-type-from-texture-format-properties
        // Use HALF_FLOAT/FLOAT instead.
        // Some large values of INT and UNSIGNED_INT are not supported unfortunately.
        // See tests for more information.
        return type === constants_1.BYTE || type === constants_1.SHORT || type === constants_1.INT || type === constants_1.UNSIGNED_SHORT || type === constants_1.UNSIGNED_INT;
    };
    GPULayer.getGLTextureParameters = function (params) {
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
                        throw new Error("Unsupported glNumChannels: " + glNumChannels + " for GPULayer \"" + name + "\".");
                }
            }
            else if (glslVersion === constants_1.GLSL1 && internalType === constants_1.UNSIGNED_BYTE) {
                // Don't use gl.ALPHA or gl.LUMINANCE_ALPHA here bc we should expect the values in the R and RG channels.
                if (writable) {
                    // For read only UNSIGNED_BYTE textures in GLSL 1, use RGBA.
                    glNumChannels = 4;
                }
                // For read only UNSIGNED_BYTE textures in GLSL 1, use RGB/RGBA.
                switch (glNumChannels) {
                    case 1:
                    case 2:
                    case 3:
                        glFormat = gl.RGB;
                        glNumChannels = 3;
                        break;
                    case 4:
                        glFormat = gl.RGBA;
                        glNumChannels = 4;
                        break;
                    default:
                        throw new Error("Unsupported glNumChannels: " + glNumChannels + " for GPULayer \"" + name + "\".");
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
                    case 3:
                        glFormat = gl.RGB_INTEGER;
                        break;
                    case 4:
                        glFormat = gl.RGBA_INTEGER;
                        break;
                    default:
                        throw new Error("Unsupported glNumChannels: " + glNumChannels + " for GPULayer \"" + name + "\".");
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
                            throw new Error("Unsupported glNumChannels: " + glNumChannels + " for GPULayer \"" + name + "\".");
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
                            throw new Error("Unsupported glNumChannels: " + glNumChannels + " for GPULayer \"" + name + "\".");
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
                                throw new Error("Unsupported glNumChannels: " + glNumChannels + " for GPULayer \"" + name + "\".");
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
                            throw new Error("Unsupported glNumChannels: " + glNumChannels + " for GPULayer \"" + name + "\".");
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
                            throw new Error("Unsupported glNumChannels: " + glNumChannels + " for GPULayer \"" + name + "\".");
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
                            throw new Error("Unsupported glNumChannels: " + glNumChannels + " for GPULayer \"" + name + "\".");
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
                            throw new Error("Unsupported glNumChannels: " + glNumChannels + " for GPULayer \"" + name + "\".");
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
                            throw new Error("Unsupported glNumChannels: " + glNumChannels + " for GPULayer \"" + name + "\".");
                    }
                    break;
                default:
                    throw new Error("Unsupported type: " + internalType + " for GPULayer \"" + name + "\".");
            }
        }
        else {
            // Don't use gl.ALPHA or gl.LUMINANCE_ALPHA here bc we should expect the values in the R and RG channels.
            if (writable) {
                // For read only textures in WebGL 1, use RGBA.
                glNumChannels = 4;
            }
            // For read only textures in WebGL 1, use RGB/RGBA.
            switch (numComponents) {
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
                    throw new Error("Unsupported numComponents: " + numComponents + " for GPULayer \"" + name + "\".");
            }
            switch (internalType) {
                case constants_1.FLOAT:
                    glType = gl.FLOAT;
                    break;
                case constants_1.HALF_FLOAT:
                    glType = gl.HALF_FLOAT || extensions_1.getExtension(gl, extensions_1.OES_TEXTURE_HALF_FLOAT, errorCallback).HALF_FLOAT_OES;
                    break;
                case constants_1.UNSIGNED_BYTE:
                    glType = gl.UNSIGNED_BYTE;
                    break;
                // No other types are supported in glsl1.x
                default:
                    throw new Error("Unsupported type: " + internalType + " in WebGL 1.0 for GPULayer \"" + name + "\".");
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
            throw new Error("Invalid type: " + internalType + " for numComponents: " + numComponents + ", unable to init parameter" + (missingParams.length > 1 ? 's' : '') + " " + missingParams.join(', ') + " for GPULayer \"" + name + "\".");
        }
        if (glNumChannels === undefined || numComponents < 1 || numComponents > 4 || glNumChannels < numComponents) {
            throw new Error("Invalid numChannels: " + glNumChannels + " for numComponents: " + numComponents + " for GPULayer \"" + name + "\".");
        }
        return {
            glFormat: glFormat,
            glInternalFormat: glInternalFormat,
            glType: glType,
            glNumChannels: glNumChannels,
        };
    };
    GPULayer.testFramebufferWrite = function (params) {
        var gl = params.gl, type = params.type, glslVersion = params.glslVersion;
        var texture = gl.createTexture();
        if (!texture) {
            return false;
        }
        gl.bindTexture(gl.TEXTURE_2D, texture);
        // Default to most widely supported settings.
        var wrapS = gl[constants_1.CLAMP_TO_EDGE];
        var wrapT = gl[constants_1.CLAMP_TO_EDGE];
        var filter = gl[constants_1.NEAREST];
        // Use non-power of two dimensions to check for more universal support.
        // (In case size of GPULayer is changed at a later point).
        var width = 100;
        var height = 100;
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
        var _a = GPULayer.getGLTextureParameters({
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
    Object.defineProperty(GPULayer.prototype, "bufferIndex", {
        get: function () {
            return this._bufferIndex;
        },
        enumerable: false,
        configurable: true
    });
    GPULayer.prototype.saveCurrentStateToGPULayer = function (layer) {
        // A method for saving a copy of the current state without a draw call.
        // Draw calls are expensive, this optimization helps.
        if (this.numBuffers < 2) {
            throw new Error("Can't call GPULayer.saveCurrentStateToGPULayer on GPULayer \"" + this.name + "\" with less than 2 buffers.");
        }
        if (!this.writable) {
            throw new Error("Can't call GPULayer.saveCurrentStateToGPULayer on read-only GPULayer \"" + this.name + "\".");
        }
        if (layer.writable) {
            throw new Error("Can't call GPULayer.saveCurrentStateToGPULayer on GPULayer \"" + this.name + "\" using writable GPULayer \"" + layer.name + "\".");
        }
        // Check that texture params are the same.
        if (layer.glWrapS !== this.glWrapS || layer.glWrapT !== this.glWrapT ||
            layer.wrapS !== this.wrapS || layer.wrapT !== this.wrapT ||
            layer.width !== this.width || layer.height !== this.height ||
            layer.glFilter !== this.glFilter || layer.filter !== this.filter ||
            layer.glNumChannels !== this.glNumChannels || layer.numComponents !== this.numComponents ||
            layer.glType !== this.glType || layer.type !== this.type ||
            layer.glFormat !== this.glFormat || layer.glInternalFormat !== this.glInternalFormat) {
            throw new Error("Incompatible texture params between GPULayers \"" + layer.name + "\" and \"" + this.name + "\".");
        }
        // If we have not already inited overrides array, do so now.
        if (!this.textureOverrides) {
            this.textureOverrides = [];
            for (var i = 0; i < this.numBuffers; i++) {
                this.textureOverrides.push(undefined);
            }
        }
        // Check if we already have an override in place.
        if (this.textureOverrides[this.bufferIndex]) {
            throw new Error("Can't call GPULayer.saveCurrentStateToGPULayer on GPULayer \"" + this.name + "\", this GPULayer has not written new state since last call to GPULayer.saveCurrentStateToGPULayer.");
        }
        var currentState = this.currentState;
        this.textureOverrides[this.bufferIndex] = currentState;
        // Swap textures.
        this.buffers[this.bufferIndex].texture = layer.currentState;
        layer._setCurrentStateTexture(currentState);
        // Bind swapped texture to framebuffer.
        var gl = this.composer.gl;
        var _a = this.buffers[this.bufferIndex], framebuffer = _a.framebuffer, texture = _a.texture;
        if (!framebuffer)
            throw new Error("No framebuffer for writable GPULayer \"" + this.name + "\".");
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/framebufferTexture2D
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        // Unbind.
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    };
    // This is used internally.
    GPULayer.prototype._setCurrentStateTexture = function (texture) {
        if (this.writable) {
            throw new Error("Can't call GPULayer._setCurrentStateTexture on writable texture \"" + this.name + "\".");
        }
        this.buffers[this.bufferIndex].texture = texture;
    };
    GPULayer.initArrayForInternalType = function (internalType, length) {
        switch (internalType) {
            case constants_1.HALF_FLOAT:
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
                throw new Error("Unsupported internalType: " + internalType + ".");
        }
    };
    GPULayer.prototype.validateDataArray = function (array) {
        var _a = this, numComponents = _a.numComponents, glNumChannels = _a.glNumChannels, internalType = _a.internalType, width = _a.width, height = _a.height;
        var length = this._length;
        // Check that data is correct length (user error).
        if (array.length !== width * height * numComponents) { // Either the correct length for WebGLTexture size
            if (!length || (length && array.length !== length * numComponents)) { // Of the correct length for 1D array.
                throw new Error("Invalid data length: " + array.length + " for GPULayer \"" + this.name + "\" of " + (length ? "length " + length + " and " : '') + "dimensions: [" + width + ", " + height + "] and numComponents: " + numComponents + ".");
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
                shouldTypeCast = internalType !== constants_1.UNSIGNED_SHORT;
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
                throw new Error("Invalid array type: " + array.constructor.name + " for GPULayer \"" + this.name + "\", please use one of [" + constants_1.validArrayTypes.map(function (constructor) { return constructor.name; }).join(', ') + "].");
        }
        var imageSize = width * height * glNumChannels;
        // Then check if array needs to be lengthened.
        // This could be because glNumChannels !== numComponents.
        // Or because length !== width * height.
        var incorrectSize = array.length !== imageSize;
        // We have to handle the case of Float16 specially by converting data to Uint16Array.
        var handleFloat16 = internalType === constants_1.HALF_FLOAT;
        var validatedArray = array;
        if (shouldTypeCast || incorrectSize || handleFloat16) {
            validatedArray = GPULayer.initArrayForInternalType(internalType, imageSize);
            // Fill new data array with old data.
            var view = handleFloat16 ? new DataView(validatedArray.buffer) : null;
            for (var i = 0, _len = array.length / numComponents; i < _len; i++) {
                for (var j = 0; j < numComponents; j++) {
                    var value = array[i * numComponents + j];
                    var index = i * glNumChannels + j;
                    if (handleFloat16) {
                        float16_1.setFloat16(view, 2 * index, value, true);
                    }
                    else {
                        validatedArray[index] = value;
                    }
                }
            }
        }
        return validatedArray;
    };
    GPULayer.prototype.initBuffers = function (array) {
        var _a = this, name = _a.name, numBuffers = _a.numBuffers, composer = _a.composer, glInternalFormat = _a.glInternalFormat, glFormat = _a.glFormat, glType = _a.glType, glFilter = _a.glFilter, glWrapS = _a.glWrapS, glWrapT = _a.glWrapT, writable = _a.writable, width = _a.width, height = _a.height;
        var gl = composer.gl, _errorCallback = composer._errorCallback;
        var validatedArray = array ? this.validateDataArray(array) : undefined;
        // Init a texture for each buffer.
        for (var i = 0; i < numBuffers; i++) {
            var texture = gl.createTexture();
            if (!texture) {
                _errorCallback("Could not init texture for GPULayer \"" + name + "\": " + gl.getError() + ".");
                return;
            }
            gl.bindTexture(gl.TEXTURE_2D, texture);
            // TODO: are there other params to look into:
            // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, glWrapS);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, glWrapT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, glFilter);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, glFilter);
            gl.texImage2D(gl.TEXTURE_2D, 0, glInternalFormat, width, height, 0, glFormat, glType, validatedArray ? validatedArray : null);
            var buffer = {
                texture: texture,
            };
            if (writable) {
                // Init a framebuffer for this texture so we can write to it.
                var framebuffer = gl.createFramebuffer();
                if (!framebuffer) {
                    _errorCallback("Could not init framebuffer for GPULayer \"" + name + "\": " + gl.getError() + ".");
                    return;
                }
                gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
                // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/framebufferTexture2D
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
                var status_1 = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
                if (status_1 != gl.FRAMEBUFFER_COMPLETE) {
                    _errorCallback("Invalid status for framebuffer for GPULayer \"" + name + "\": " + status_1 + ".");
                }
                // Add framebuffer.
                buffer.framebuffer = framebuffer;
            }
            // Save this buffer to the list.
            this.buffers.push(buffer);
        }
        // Unbind.
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    };
    GPULayer.prototype.getStateAtIndex = function (index) {
        if (index < 0 || index >= this.numBuffers) {
            throw new Error("Invalid buffer index: " + index + " for GPULayer \"" + this.name + "\" with " + this.numBuffers + " buffer" + (this.numBuffers > 1 ? 's' : '') + ".");
        }
        if (this.textureOverrides && this.textureOverrides[index])
            return this.textureOverrides[index];
        return this.buffers[index].texture;
    };
    Object.defineProperty(GPULayer.prototype, "currentState", {
        get: function () {
            return this.getStateAtIndex(this.bufferIndex);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GPULayer.prototype, "lastState", {
        get: function () {
            if (this.numBuffers === 1) {
                throw new Error("Cannot access lastState on GPULayer \"" + this.name + "\" with only one buffer.");
            }
            return this.getStateAtIndex((this.bufferIndex - 1 + this.numBuffers) % this.numBuffers);
        },
        enumerable: false,
        configurable: true
    });
    // This is used internally.
    GPULayer.prototype._usingTextureOverrideForCurrentBuffer = function () {
        return this.textureOverrides && this.textureOverrides[this.bufferIndex];
    };
    GPULayer.prototype.incrementBufferIndex = function () {
        // Increment bufferIndex.
        this._bufferIndex = (this.bufferIndex + 1) % this.numBuffers;
    };
    // This is used internally.
    GPULayer.prototype._bindOutputBufferForWrite = function (incrementBufferIndex) {
        if (incrementBufferIndex) {
            this.incrementBufferIndex();
        }
        this._bindOutputBuffer();
        // We are going to do a data write, if we have overrides enabled, we can remove them.
        if (this.textureOverrides) {
            this.textureOverrides[this.bufferIndex] = undefined;
        }
    };
    // This is used internally.
    GPULayer.prototype._bindOutputBuffer = function () {
        var gl = this.composer.gl;
        var framebuffer = this.buffers[this.bufferIndex].framebuffer;
        if (!framebuffer) {
            throw new Error("GPULayer \"" + this.name + "\" is not writable.");
        }
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    };
    GPULayer.prototype.setFromArray = function (array, applyToAllBuffers) {
        if (applyToAllBuffers === void 0) { applyToAllBuffers = false; }
        var _a = this, composer = _a.composer, glInternalFormat = _a.glInternalFormat, glFormat = _a.glFormat, glType = _a.glType, numBuffers = _a.numBuffers, width = _a.width, height = _a.height, bufferIndex = _a.bufferIndex;
        var gl = composer.gl;
        var validatedArray = this.validateDataArray(array);
        // TODO: check that this is working.
        var startIndex = applyToAllBuffers ? 0 : bufferIndex;
        var endIndex = applyToAllBuffers ? numBuffers : bufferIndex + 1;
        for (var i = startIndex; i < endIndex; i++) {
            var texture = this.getStateAtIndex(i);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, glInternalFormat, width, height, 0, glFormat, glType, validatedArray);
        }
        // Unbind texture.
        gl.bindTexture(gl.TEXTURE_2D, null);
    };
    GPULayer.prototype.resize = function (dimensions, array) {
        var _a = this, name = _a.name, composer = _a.composer;
        var verboseLogging = composer.verboseLogging;
        if (verboseLogging)
            console.log("Resizing GPULayer \"" + name + "\" to " + JSON.stringify(dimensions) + ".");
        var _b = GPULayer.calcSize(dimensions, name, verboseLogging), length = _b.length, width = _b.width, height = _b.height;
        this._length = length;
        this._width = width;
        this._height = height;
        this.destroyBuffers();
        this.initBuffers(array);
    };
    Object.defineProperty(GPULayer.prototype, "clearValue", {
        get: function () {
            return this._clearValue;
        },
        set: function (clearValue) {
            var _a = this, numComponents = _a.numComponents, type = _a.type;
            if (!checks_1.isValidClearValue(clearValue, numComponents, type)) {
                throw new Error("Invalid clearValue: " + JSON.stringify(clearValue) + " for GPULayer \"" + this.name + "\", expected " + type + " or array of " + type + " of length " + numComponents + ".");
            }
            this._clearValue = clearValue;
        },
        enumerable: false,
        configurable: true
    });
    GPULayer.prototype.clear = function (applyToAllBuffers) {
        if (applyToAllBuffers === void 0) { applyToAllBuffers = false; }
        var _a = this, name = _a.name, composer = _a.composer, clearValue = _a.clearValue, numBuffers = _a.numBuffers, bufferIndex = _a.bufferIndex, type = _a.type;
        var verboseLogging = composer.verboseLogging;
        if (verboseLogging)
            console.log("Clearing GPULayer \"" + name + "\".");
        var value = [];
        if (checks_1.isNumber(clearValue)) {
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
            var program = composer._setValueProgramForType(type);
            program.setUniform('u_value', value);
            for (var i = startIndex; i < endIndex; i++) {
                // Write clear value to buffers.
                composer.step({
                    program: program,
                    output: this,
                });
            }
        }
        else {
            // Init a typed array containing clearValue and pass to buffers.
            var _b = this, width = _b.width, height = _b.height, glNumChannels = _b.glNumChannels, internalType = _b.internalType, glInternalFormat = _b.glInternalFormat, glFormat = _b.glFormat, glType = _b.glType;
            var gl = composer.gl;
            var fillLength = this._length ? this._length : width * height;
            var array = GPULayer.initArrayForInternalType(internalType, width * height * glNumChannels);
            var float16View = internalType === constants_1.HALF_FLOAT ? new DataView(array.buffer) : null;
            for (var j = 0; j < fillLength; j++) {
                for (var k = 0; k < glNumChannels; k++) {
                    var index = j * glNumChannels + k;
                    if (internalType === constants_1.HALF_FLOAT) {
                        // Float16s need to be handled separately.
                        float16_1.setFloat16(float16View, 2 * index, value[k], true);
                    }
                    else {
                        array[index] = value[k];
                    }
                }
            }
            for (var i = startIndex; i < endIndex; i++) {
                var texture = this.getStateAtIndex(i);
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, glInternalFormat, width, height, 0, glFormat, glType, array);
            }
            // Unbind texture.
            gl.bindTexture(gl.TEXTURE_2D, null);
        }
    };
    Object.defineProperty(GPULayer.prototype, "width", {
        get: function () {
            return this._width;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GPULayer.prototype, "height", {
        get: function () {
            return this._height;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GPULayer.prototype, "length", {
        get: function () {
            if (!this._length) {
                throw new Error("Cannot access length on 2D GPULayer \"" + this.name + "\".");
            }
            return this._length;
        },
        enumerable: false,
        configurable: true
    });
    GPULayer.prototype.destroyBuffers = function () {
        var _a = this, composer = _a.composer, buffers = _a.buffers;
        var gl = composer.gl;
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
        // These are technically owned by another GPULayer,
        // so we are not responsible for deleting them from gl context.
        delete this.textureOverrides;
    };
    GPULayer.prototype.dispose = function () {
        var _a = this, name = _a.name, composer = _a.composer;
        var verboseLogging = composer.verboseLogging;
        if (verboseLogging)
            console.log("Deallocating GPULayer \"" + name + "\".");
        this.destroyBuffers();
        // @ts-ignore
        delete this.composer;
    };
    GPULayer.prototype.clone = function (name) {
        // Make a deep copy.
        return this.composer._cloneGPULayer(this, name);
    };
    return GPULayer;
}());
exports.GPULayer = GPULayer;


/***/ }),

/***/ 664:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GPUProgram = void 0;
var checks_1 = __webpack_require__(707);
var constants_1 = __webpack_require__(601);
var utils_1 = __webpack_require__(593);
var GPUProgram = /** @class */ (function () {
    /**
     * Create a GPUProgram.
     * @param {GPUComposer} composer - The current GPUComposer instance.
     * @param {Object} params - GPUProgram parameters.
     */
    function GPUProgram(composer, params) {
        // #define variables for fragment shader program.
        this.defines = {};
        // Uniform locations, values, and types.
        this.uniforms = {};
        // Store WebGLProgram's - we need to compile several WebGLPrograms of GPUProgram.fragmentShader + various vertex shaders.
        // Each combination of vertex + fragment shader requires a separate WebGLProgram.
        // These programs are compiled on the fly as needed.
        this.programs = {};
        // Check constructor parameters.
        var name = (params || {}).name;
        if (!composer) {
            throw new Error("Error initing GPUProgram \"" + name + "\": must pass GPUComposer instance to GPUProgram(composer, params).");
        }
        var validKeys = ['name', 'fragmentShader', 'uniforms', 'defines'];
        var requiredKeys = ['name', 'fragmentShader'];
        var keys = Object.keys(params);
        keys.forEach(function (key) {
            if (validKeys.indexOf(key) < 0) {
                throw new Error("Invalid params key \"" + key + "\" passed to GPUProgram(composer, params) with name \"" + name + "\".  Valid keys are " + validKeys.join(', ') + ".");
            }
        });
        // Check for required keys.
        requiredKeys.forEach(function (key) {
            if (keys.indexOf(key) < 0) {
                throw new Error("Required params key \"" + key + "\" was not passed to GPUProgram(composer, params) with name \"" + name + "\".");
            }
        });
        var fragmentShader = params.fragmentShader, uniforms = params.uniforms, defines = params.defines;
        // Save arguments.
        this.composer = composer;
        this.name = name;
        // Compile fragment shader.
        var fragmentShaderSource = typeof (fragmentShader) === 'string' ?
            fragmentShader :
            fragmentShader.join('\n');
        this.fragmentShaderSource = utils_1.preprocessFragmentShader(fragmentShaderSource, composer.glslVersion);
        this.recompile(defines || this.defines);
        if (uniforms) {
            for (var i = 0; i < uniforms.length; i++) {
                var _a = uniforms[i], name_1 = _a.name, value = _a.value, type = _a.type;
                this.setUniform(name_1, value, type);
            }
        }
    }
    GPUProgram.prototype.recompile = function (defines) {
        var _a = this, composer = _a.composer, name = _a.name, fragmentShaderSource = _a.fragmentShaderSource;
        var gl = composer.gl, _errorCallback = composer._errorCallback, verboseLogging = composer.verboseLogging, glslVersion = composer.glslVersion, floatPrecision = composer.floatPrecision, intPrecision = composer.intPrecision;
        // Update this.defines if needed.
        // Passed in defines param may only be a partial list.
        var definesNeedUpdate = false;
        var keys = Object.keys(defines);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (this.defines[key] !== defines[key]) {
                definesNeedUpdate = true;
                this.defines[key] = defines[key];
            }
        }
        if (this.fragmentShader && !definesNeedUpdate) {
            // No need to recompile.
            return;
        }
        if (verboseLogging)
            console.log("Compiling fragment shader for GPUProgram \"" + name + "\" with defines: " + JSON.stringify(this.defines));
        var shader = utils_1.compileShader(gl, glslVersion, intPrecision, floatPrecision, fragmentShaderSource, gl.FRAGMENT_SHADER, name, _errorCallback, this.defines);
        if (!shader) {
            _errorCallback("Unable to compile fragment shader for GPUProgram \"" + name + "\".");
            return;
        }
        this.fragmentShader = shader;
    };
    GPUProgram.prototype.getProgramWithName = function (name) {
        // Check if we've already compiled program.
        if (this.programs[name])
            return this.programs[name];
        // Otherwise, we need to compile a new program on the fly.
        var _a = this, composer = _a.composer, uniforms = _a.uniforms, fragmentShader = _a.fragmentShader;
        var _errorCallback = composer._errorCallback, _vertexShaders = composer._vertexShaders, gl = composer.gl, glslVersion = composer.glslVersion, intPrecision = composer.intPrecision, floatPrecision = composer.floatPrecision;
        var vertexShader = _vertexShaders[name];
        if (vertexShader.shader === undefined) {
            var composer_1 = this.composer;
            var gl_1 = composer_1.gl;
            // Init a vertex shader.
            if (vertexShader.src === '') {
                throw new Error("No source for vertex shader " + this.name + " : " + name);
            }
            var vertexShaderSource = utils_1.preprocessVertexShader(vertexShader.src, glslVersion);
            var shader = utils_1.compileShader(gl_1, glslVersion, intPrecision, floatPrecision, vertexShaderSource, gl_1.VERTEX_SHADER, this.name, _errorCallback, vertexShader.defines);
            if (!shader) {
                _errorCallback("Unable to compile \"" + name + "\" vertex shader for GPUProgram \"" + this.name + "\".");
                return;
            }
            vertexShader.shader = shader;
        }
        var program = utils_1.initGLProgram(gl, fragmentShader, vertexShader.shader, this.name, _errorCallback);
        if (program === undefined) {
            _errorCallback("Unable to init program \"" + name + "\" for GPUProgram \"" + this.name + "\".");
            return;
        }
        // If we have any uniforms set for this GPUProgram, add those to WebGLProgram we just inited.
        var uniformNames = Object.keys(uniforms);
        for (var i = 0; i < uniformNames.length; i++) {
            var uniformName = uniformNames[i];
            var uniform = uniforms[uniformName];
            var value = uniform.value, type = uniform.type;
            this.setProgramUniform(program, name, uniformName, value, type);
        }
        this.programs[name] = program;
        return program;
    };
    Object.defineProperty(GPUProgram.prototype, "_defaultProgram", {
        // These getters are used internally.
        get: function () {
            return this.getProgramWithName(constants_1.DEFAULT_PROGRAM_NAME);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GPUProgram.prototype, "_defaultProgramWithUV", {
        get: function () {
            return this.getProgramWithName(constants_1.DEFAULT_W_UV_PROGRAM_NAME);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GPUProgram.prototype, "_defaultProgramWithNormal", {
        get: function () {
            return this.getProgramWithName(constants_1.DEFAULT_W_NORMAL_PROGRAM_NAME);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GPUProgram.prototype, "_defaultProgramWithUVNormal", {
        get: function () {
            return this.getProgramWithName(constants_1.DEFAULT_W_UV_NORMAL_PROGRAM_NAME);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GPUProgram.prototype, "_segmentProgram", {
        get: function () {
            return this.getProgramWithName(constants_1.SEGMENT_PROGRAM_NAME);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GPUProgram.prototype, "_GPULayerPointsProgram", {
        get: function () {
            return this.getProgramWithName(constants_1.DATA_LAYER_POINTS_PROGRAM_NAME);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GPUProgram.prototype, "_GPULayerVectorFieldProgram", {
        get: function () {
            return this.getProgramWithName(constants_1.DATA_LAYER_VECTOR_FIELD_PROGRAM_NAME);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GPUProgram.prototype, "_GPULayerLinesProgram", {
        get: function () {
            return this.getProgramWithName(constants_1.DATA_LAYER_LINES_PROGRAM_NAME);
        },
        enumerable: false,
        configurable: true
    });
    GPUProgram.prototype.uniformInternalTypeForValue = function (value, type) {
        if (type === constants_1.FLOAT) {
            // Check that we are dealing with a number.
            if (checks_1.isArray(value)) {
                for (var i = 0; i < value.length; i++) {
                    if (!checks_1.isNumber(value[i])) {
                        throw new Error("Invalid uniform value: " + value + " for program \"" + this.name + "\", expected float or float[] of length 1-4.");
                    }
                }
            }
            else {
                if (!checks_1.isNumber(value)) {
                    throw new Error("Invalid uniform value: " + value + " for program \"" + this.name + "\", expected float or float[] of length 1-4.");
                }
            }
            if (!checks_1.isArray(value) || value.length === 1) {
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
            throw new Error("Invalid uniform value: " + value + " for program \"" + this.name + "\", expected float or float[] of length 1-4.");
        }
        else if (type === constants_1.INT) {
            // Check that we are dealing with an int.
            if (checks_1.isArray(value)) {
                for (var i = 0; i < value.length; i++) {
                    if (!checks_1.isInteger(value[i])) {
                        throw new Error("Invalid uniform value: " + value + " for program \"" + this.name + "\", expected int or int[] of length 1-4.");
                    }
                }
            }
            else {
                if (!checks_1.isInteger(value)) {
                    throw new Error("Invalid uniform value: " + value + " for program \"" + this.name + "\", expected int or int[] of length 1-4.");
                }
            }
            if (!checks_1.isArray(value) || value.length === 1) {
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
            throw new Error("Invalid uniform value: " + value + " for program \"" + this.name + "\", expected int or int[] of length 1-4.");
        }
        else if (type === constants_1.BOOL) {
            if (checks_1.isBoolean(value)) {
                // Boolean types are passed in as ints.
                // This suggest floats work as well, but ints seem more natural:
                // https://github.com/KhronosGroup/WebGL/blob/main/sdk/tests/conformance/uniforms/gl-uniform-bool.html
                return constants_1.INT_1D_UNIFORM;
            }
            throw new Error("Invalid uniform value: " + value + " for program \"" + this.name + "\", expected boolean.");
        }
        else {
            throw new Error("Invalid uniform type: " + type + " for program \"" + this.name + "\", expected " + constants_1.FLOAT + " or " + constants_1.INT + " of " + constants_1.BOOL + ".");
        }
    };
    GPUProgram.prototype.setProgramUniform = function (program, programName, name, value, type) {
        var _a;
        var _b = this, composer = _b.composer, uniforms = _b.uniforms;
        var gl = composer.gl, _errorCallback = composer._errorCallback;
        // Set active program.
        gl.useProgram(program);
        var location = (_a = uniforms[name]) === null || _a === void 0 ? void 0 : _a.location[programName];
        // Init a location for WebGLProgram if needed.
        if (location === undefined) {
            var _location = gl.getUniformLocation(program, name);
            if (!_location) {
                _errorCallback("Could not init uniform \"" + name + "\" for program \"" + this.name + "\".\nCheck that uniform is present in shader code, unused uniforms may be removed by compiler.\nAlso check that uniform type in shader code matches type " + type + ".\nError code: " + gl.getError() + ".");
                return;
            }
            location = _location;
            // Save location for future use.
            if (uniforms[name]) {
                uniforms[name].location[programName] = location;
            }
        }
        // Set uniform.
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/uniform
        switch (type) {
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
                if (checks_1.isBoolean(value)) {
                    // We are setting boolean uniforms with uniform1i.
                    gl.uniform1i(location, value ? 1 : 0);
                }
                else {
                    gl.uniform1i(location, value);
                }
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
            default:
                throw new Error("Unknown uniform type " + type + " for GPUProgram \"" + this.name + "\".");
        }
    };
    GPUProgram.prototype.setUniform = function (name, value, type) {
        var _a;
        var _b = this, programs = _b.programs, uniforms = _b.uniforms, composer = _b.composer;
        var verboseLogging = composer.verboseLogging;
        // Check that length of value is correct.
        if (checks_1.isArray(value)) {
            var length_1 = value.length;
            if (length_1 > 4)
                throw new Error("Invalid uniform value: [" + value.join(', ') + "] passed to GPUProgram \"" + this.name + ", uniforms must be of type number[] with length <= 4, number, or boolean.\"");
        }
        var currentType = (_a = uniforms[name]) === null || _a === void 0 ? void 0 : _a.type;
        if (type) {
            var internalType = this.uniformInternalTypeForValue(value, type);
            if (currentType === undefined)
                currentType = internalType;
            else {
                // console.warn(`Don't need to pass in type to GPUProgram.setUniform for previously inited uniform "${uniformName}"`);
                // Check that types match previously set uniform.
                if (currentType !== internalType) {
                    throw new Error("Uniform \"" + name + "\" for GPUProgram \"" + this.name + "\" cannot change from type " + currentType + " to type " + internalType + ".");
                }
            }
        }
        if (currentType === undefined) {
            throw new Error("Unknown type for uniform \"" + name + "\", please pass in type to GPUProgram.setUniform(name, value, type) when initing a new uniform.");
        }
        if (!uniforms[name]) {
            // Init uniform if needed.
            uniforms[name] = { type: currentType, location: {}, value: value };
        }
        else {
            // Deep check is value has changed.
            if (checks_1.isArray(value)) {
                var isChanged = true;
                for (var i = 0; i < value.length; i++) {
                    if (uniforms[name].value !== value) {
                        isChanged = true;
                        break;
                    }
                }
                if (!isChanged)
                    return; // No change.
            }
            else if (uniforms[name].value === value) {
                return; // No change.
            }
            // Update value.
            uniforms[name].value = value;
        }
        if (verboseLogging)
            console.log("Setting uniform \"" + name + "\" for program \"" + this.name + "\" to value " + JSON.stringify(value) + " with type " + currentType + ".");
        // Update any active programs.
        var keys = Object.keys(programs);
        for (var i = 0; i < keys.length; i++) {
            var programName = keys[i];
            this.setProgramUniform(programs[programName], programName, name, value, currentType);
        }
    };
    ;
    // This is used internally.
    GPUProgram.prototype._setVertexUniform = function (program, uniformName, value, type) {
        var _this = this;
        var internalType = this.uniformInternalTypeForValue(value, type);
        if (program === undefined) {
            throw new Error('Must pass in valid WebGLProgram to setVertexUniform, got undefined.');
        }
        var programName = Object.keys(this.programs).find(function (key) { return _this.programs[key] === program; });
        if (!programName) {
            throw new Error("Could not find valid vertex programName for WebGLProgram \"" + this.name + "\".");
        }
        this.setProgramUniform(program, programName, uniformName, value, internalType);
    };
    GPUProgram.prototype.dispose = function () {
        var _this = this;
        var _a = this, composer = _a.composer, fragmentShader = _a.fragmentShader, programs = _a.programs;
        var gl = composer.gl, verboseLogging = composer.verboseLogging;
        if (verboseLogging)
            console.log("Deallocating GPUProgram \"" + this.name + "\".");
        // Unbind all gl data before deleting.
        Object.values(programs).forEach(function (program) {
            gl.deleteProgram(program);
        });
        Object.keys(this.programs).forEach(function (key) {
            delete _this.programs[key];
        });
        // Delete fragment shader.
        gl.deleteShader(fragmentShader);
        // @ts-ignore
        delete this.fragmentShader;
        // Delete all references.
        // @ts-ignore
        delete this.composer;
        // @ts-ignore
        delete this.name;
        // @ts-ignore
        delete this.fragmentShaderSource;
        // @ts-ignore
        delete this.defines;
        // @ts-ignore
        delete this.uniforms;
        // @ts-ignore
        delete this.programs;
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

/***/ 707:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isBoolean = exports.isArray = exports.isString = exports.isNonNegativeInteger = exports.isPositiveInteger = exports.isInteger = exports.isNumber = exports.isNumberOfType = exports.isValidClearValue = exports.isValidTextureType = exports.isValidTextureFormat = exports.isValidWrap = exports.isValidFilter = exports.isValidDataType = void 0;
var constants_1 = __webpack_require__(601);
function isValidDataType(type) {
    return constants_1.validDataTypes.indexOf(type) > -1;
}
exports.isValidDataType = isValidDataType;
function isValidFilter(type) {
    return constants_1.validFilters.indexOf(type) > -1;
}
exports.isValidFilter = isValidFilter;
function isValidWrap(type) {
    return constants_1.validWraps.indexOf(type) > -1;
}
exports.isValidWrap = isValidWrap;
// For image urls that are passed in and inited as textures.
function isValidTextureFormat(type) {
    return constants_1.validTextureFormats.indexOf(type) > -1;
}
exports.isValidTextureFormat = isValidTextureFormat;
function isValidTextureType(type) {
    return constants_1.validTextureTypes.indexOf(type) > -1;
}
exports.isValidTextureType = isValidTextureType;
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
function isNumberOfType(value, type) {
    switch (type) {
        case constants_1.HALF_FLOAT:
        case constants_1.FLOAT:
            return isNumber(value);
        case constants_1.BYTE:
        case constants_1.SHORT:
        case constants_1.INT:
            return isInteger(value);
        case constants_1.UNSIGNED_BYTE:
        case constants_1.UNSIGNED_SHORT:
        case constants_1.UNSIGNED_INT:
            return isNonNegativeInteger(value);
        default:
            throw new Error("Unknown type " + type);
    }
}
exports.isNumberOfType = isNumberOfType;
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
function isNonNegativeInteger(value) {
    return isInteger(value) && value >= 0;
}
exports.isNonNegativeInteger = isNonNegativeInteger;
function isString(value) {
    return typeof value === 'string';
}
exports.isString = isString;
function isArray(value) {
    return Array.isArray(value);
}
exports.isArray = isArray;
function isBoolean(value) {
    return typeof value === 'boolean';
}
exports.isBoolean = isBoolean;


/***/ }),

/***/ 601:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DEFAULT_CIRCLE_NUM_SEGMENTS = exports.DEFAULT_ERROR_CALLBACK = exports.DATA_LAYER_VECTOR_FIELD_PROGRAM_NAME = exports.DATA_LAYER_LINES_PROGRAM_NAME = exports.DATA_LAYER_POINTS_PROGRAM_NAME = exports.SEGMENT_PROGRAM_NAME = exports.DEFAULT_W_UV_NORMAL_PROGRAM_NAME = exports.DEFAULT_W_NORMAL_PROGRAM_NAME = exports.DEFAULT_W_UV_PROGRAM_NAME = exports.DEFAULT_PROGRAM_NAME = exports.INT_4D_UNIFORM = exports.INT_3D_UNIFORM = exports.INT_2D_UNIFORM = exports.INT_1D_UNIFORM = exports.FLOAT_4D_UNIFORM = exports.FLOAT_3D_UNIFORM = exports.FLOAT_2D_UNIFORM = exports.FLOAT_1D_UNIFORM = exports.PRECISION_HIGH_P = exports.PRECISION_MEDIUM_P = exports.PRECISION_LOW_P = exports.EXPERIMENTAL_WEBGL = exports.WEBGL1 = exports.WEBGL2 = exports.GLSL1 = exports.GLSL3 = exports.validTextureTypes = exports.validTextureFormats = exports.validWraps = exports.validFilters = exports.validDataTypes = exports.validArrayTypes = exports.RGBA = exports.RGB = exports.CLAMP_TO_EDGE = exports.REPEAT = exports.NEAREST = exports.LINEAR = exports.UINT = exports.BOOL = exports.INT = exports.UNSIGNED_INT = exports.SHORT = exports.UNSIGNED_SHORT = exports.BYTE = exports.UNSIGNED_BYTE = exports.FLOAT = exports.HALF_FLOAT = void 0;
exports.HALF_FLOAT = 'HALF_FLOAT';
exports.FLOAT = 'FLOAT';
exports.UNSIGNED_BYTE = 'UNSIGNED_BYTE';
exports.BYTE = 'BYTE';
exports.UNSIGNED_SHORT = 'UNSIGNED_SHORT';
exports.SHORT = 'SHORT';
exports.UNSIGNED_INT = 'UNSIGNED_INT';
exports.INT = 'INT';
exports.BOOL = 'BOOL';
exports.UINT = 'UINT';
exports.LINEAR = 'LINEAR';
exports.NEAREST = 'NEAREST';
exports.REPEAT = 'REPEAT';
exports.CLAMP_TO_EDGE = 'CLAMP_TO_EDGE';
// export const MIRRORED_REPEAT = 'MIRRORED_REPEAT';
exports.RGB = 'RGB';
exports.RGBA = 'RGBA';
exports.validArrayTypes = [Float32Array, Uint8Array, Int8Array, Uint16Array, Int16Array, Uint32Array, Int32Array, Array];
exports.validDataTypes = [exports.HALF_FLOAT, exports.FLOAT, exports.UNSIGNED_BYTE, exports.BYTE, exports.UNSIGNED_SHORT, exports.SHORT, exports.UNSIGNED_INT, exports.INT];
exports.validFilters = [exports.LINEAR, exports.NEAREST];
exports.validWraps = [exports.CLAMP_TO_EDGE, exports.REPEAT]; // MIRRORED_REPEAT
exports.validTextureFormats = [exports.RGB, exports.RGBA];
exports.validTextureTypes = [exports.UNSIGNED_BYTE];
exports.GLSL3 = '300 es';
exports.GLSL1 = '100';
exports.WEBGL2 = 'webgl2';
exports.WEBGL1 = 'webgl';
exports.EXPERIMENTAL_WEBGL = 'experimental-webgl';
exports.PRECISION_LOW_P = 'lowp';
exports.PRECISION_MEDIUM_P = 'mediump';
exports.PRECISION_HIGH_P = 'highp';
// Uniform types.
exports.FLOAT_1D_UNIFORM = '1f';
exports.FLOAT_2D_UNIFORM = '2f';
exports.FLOAT_3D_UNIFORM = '3f';
exports.FLOAT_4D_UNIFORM = '3f';
exports.INT_1D_UNIFORM = '1i';
exports.INT_2D_UNIFORM = '2i';
exports.INT_3D_UNIFORM = '3i';
exports.INT_4D_UNIFORM = '3i';
// Vertex shaders.
exports.DEFAULT_PROGRAM_NAME = 'DEFAULT';
exports.DEFAULT_W_UV_PROGRAM_NAME = 'DEFAULT_W_UV';
exports.DEFAULT_W_NORMAL_PROGRAM_NAME = 'DEFAULT_W_NORMAL';
exports.DEFAULT_W_UV_NORMAL_PROGRAM_NAME = 'DEFAULT_W_UV_NORMAL';
exports.SEGMENT_PROGRAM_NAME = 'SEGMENT';
exports.DATA_LAYER_POINTS_PROGRAM_NAME = 'DATA_LAYER_POINTS';
exports.DATA_LAYER_LINES_PROGRAM_NAME = 'DATA_LAYER_LINES';
exports.DATA_LAYER_VECTOR_FIELD_PROGRAM_NAME = 'DATA_LAYER_VECTOR_FIELD';
exports.DEFAULT_ERROR_CALLBACK = function (msg) { throw new Error(msg); };
exports.DEFAULT_CIRCLE_NUM_SEGMENTS = 18; // Must be divisible by 6 to work with stepSegment().


/***/ }),

/***/ 581:
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

/***/ 607:
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
exports._testing = exports.getFragmentShaderMediumpPrecision = exports.getVertexShaderMediumpPrecision = exports.isHighpSupportedInFragmentShader = exports.isHighpSupportedInVertexShader = exports.isWebGL2Supported = exports.isWebGL2 = exports.GPUProgram = exports.GPULayer = exports.GPUComposer = void 0;
var utils_1 = __webpack_require__(593);
Object.defineProperty(exports, "isWebGL2", ({ enumerable: true, get: function () { return utils_1.isWebGL2; } }));
Object.defineProperty(exports, "isWebGL2Supported", ({ enumerable: true, get: function () { return utils_1.isWebGL2Supported; } }));
Object.defineProperty(exports, "isHighpSupportedInVertexShader", ({ enumerable: true, get: function () { return utils_1.isHighpSupportedInVertexShader; } }));
Object.defineProperty(exports, "isHighpSupportedInFragmentShader", ({ enumerable: true, get: function () { return utils_1.isHighpSupportedInFragmentShader; } }));
Object.defineProperty(exports, "getVertexShaderMediumpPrecision", ({ enumerable: true, get: function () { return utils_1.getVertexShaderMediumpPrecision; } }));
Object.defineProperty(exports, "getFragmentShaderMediumpPrecision", ({ enumerable: true, get: function () { return utils_1.getFragmentShaderMediumpPrecision; } }));
var GPUComposer_1 = __webpack_require__(484);
Object.defineProperty(exports, "GPUComposer", ({ enumerable: true, get: function () { return GPUComposer_1.GPUComposer; } }));
var GPULayer_1 = __webpack_require__(355);
Object.defineProperty(exports, "GPULayer", ({ enumerable: true, get: function () { return GPULayer_1.GPULayer; } }));
var GPUProgram_1 = __webpack_require__(664);
Object.defineProperty(exports, "GPUProgram", ({ enumerable: true, get: function () { return GPUProgram_1.GPUProgram; } }));
// These exports are only used for testing.
var _testing = {
    makeShaderHeader: utils_1.makeShaderHeader,
    compileShader: utils_1.compileShader,
    initGLProgram: utils_1.initGLProgram,
    preprocessVertexShader: utils_1.preprocessVertexShader,
    preprocessFragmentShader: utils_1.preprocessFragmentShader,
    isPowerOf2: utils_1.isPowerOf2,
    initSequentialFloatArray: utils_1.initSequentialFloatArray,
};
exports._testing = _testing;
// Named exports.
__exportStar(__webpack_require__(601), exports);


/***/ }),

/***/ 593:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.preprocessFragmentShader = exports.preprocessVertexShader = exports.initSequentialFloatArray = exports.isPowerOf2 = exports.getFragmentShaderMediumpPrecision = exports.getVertexShaderMediumpPrecision = exports.isHighpSupportedInFragmentShader = exports.isHighpSupportedInVertexShader = exports.isWebGL2Supported = exports.isWebGL2 = exports.initGLProgram = exports.compileShader = exports.makeShaderHeader = void 0;
var checks_1 = __webpack_require__(707);
var constants_1 = __webpack_require__(601);
var precisionSource = __webpack_require__(937);
// Memoize results.
var results = {
    webgl2: undefined,
    highpVertex: undefined,
    highpFragment: undefined,
    mediumpVertexPrecision: undefined,
    mediumpFragmentPrecision: undefined,
};
function intForPrecision(precision) {
    if (precision === constants_1.PRECISION_HIGH_P)
        return 2;
    if (precision === constants_1.PRECISION_MEDIUM_P)
        return 1;
    return 0;
}
function convertDefinesToString(defines) {
    var definesSource = '';
    var keys = Object.keys(defines);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        // Check that define is passed in as a string.
        if (!checks_1.isString(key) || !checks_1.isString(defines[key])) {
            throw new Error("GPUProgram defines must be passed in as key value pairs that are both strings, got key value pair of type [" + typeof key + " : " + typeof defines[key] + "].");
        }
        definesSource += "#define " + key + " " + defines[key] + "\n";
    }
    return definesSource;
}
function makeShaderHeader(glslVersion, intPrecision, floatPrecision, defines) {
    var versionSource = glslVersion === constants_1.GLSL3 ? "#version " + constants_1.GLSL3 + "\n" : '';
    var definesSource = defines ? convertDefinesToString(defines) : '';
    var precisionDefinesSource = convertDefinesToString({
        WEBGLCOMPUTE_INT_PRECISION: "" + intForPrecision(intPrecision),
        WEBGLCOMPUTE_FLOAT_PRECISION: "" + intForPrecision(floatPrecision),
    });
    return "" + versionSource + definesSource + precisionDefinesSource + precisionSource;
}
exports.makeShaderHeader = makeShaderHeader;
// Copied from http://webglfundamentals.org/webgl/lessons/webgl-boilerplate.html
function compileShader(gl, glslVersion, intPrecision, floatPrecision, shaderSource, shaderType, programName, _errorCallback, defines) {
    shaderSource = "" + makeShaderHeader(glslVersion, intPrecision, floatPrecision, defines) + shaderSource;
    // Create the shader object
    var shader = gl.createShader(shaderType);
    if (!shader) {
        _errorCallback('Unable to init gl shader.');
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
        _errorCallback("Could not compile " + (shaderType === gl.FRAGMENT_SHADER ? 'fragment' : 'vertex') + "\n\t\t\t shader for program \"" + programName + "\": " + gl.getShaderInfoLog(shader) + ".");
        return null;
    }
    return shader;
}
exports.compileShader = compileShader;
function initGLProgram(gl, fragmentShader, vertexShader, name, _errorCallback) {
    // Create a program.
    var program = gl.createProgram();
    if (!program) {
        _errorCallback("Unable to init gl program for GPUProgram \"" + name + "\", gl.createProgram() has failed.");
        return;
    }
    // Link the program.
    gl.attachShader(program, fragmentShader);
    gl.attachShader(program, vertexShader);
    gl.linkProgram(program);
    // Check if it linked.
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) {
        // Something went wrong with the link.
        _errorCallback("GPUProgram \"" + name + "\" failed to link: " + gl.getProgramInfoLog(program));
        return;
    }
    return program;
}
exports.initGLProgram = initGLProgram;
function isWebGL2(gl) {
    // This code is pulled from https://github.com/mrdoob/three.js/blob/master/src/renderers/webgl/WebGLCapabilities.js
    // @ts-ignore
    return (typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext) || (typeof WebGL2ComputeRenderingContext !== 'undefined' && gl instanceof WebGL2ComputeRenderingContext);
}
exports.isWebGL2 = isWebGL2;
function isWebGL2Supported() {
    if (results.webgl2 === undefined) {
        var gl = document.createElement('canvas').getContext(constants_1.WEBGL2);
        // GL context and canvas will be garbage collected.
        results.webgl2 = !!gl;
        return true;
    }
    return results.webgl2;
}
exports.isWebGL2Supported = isWebGL2Supported;
function isHighpSupported(vsSource, fsSource) {
    // This is supposed to be relatively easy. You call gl.getShaderPrecisionFormat, you pass in the shader type,
    // VERTEX_SHADER or FRAGMENT_SHADER and you pass in one of LOW_FLOAT, MEDIUM_FLOAT, HIGH_FLOAT, LOW_INT, MEDIUM_INT, HIGH_INT,
    // and it returns the precision info.
    // Unfortunately Safari has a bug here which means checking this way will fail on iPhone, at least as of April 2020.
    // https://webglfundamentals.org/webgl/webgl-precision-lowp-mediump-highp.html
    var gl = document.createElement('canvas').getContext(constants_1.WEBGL1);
    if (!gl) {
        throw new Error("Unable to init webgl context.");
    }
    try {
        var vs = compileShader(gl, constants_1.GLSL1, constants_1.PRECISION_HIGH_P, constants_1.PRECISION_HIGH_P, vsSource, gl.VERTEX_SHADER, 'highpFragmentTest', constants_1.DEFAULT_ERROR_CALLBACK);
        var fs = compileShader(gl, constants_1.GLSL1, constants_1.PRECISION_HIGH_P, constants_1.PRECISION_HIGH_P, fsSource, gl.FRAGMENT_SHADER, 'highpFragmentTest', constants_1.DEFAULT_ERROR_CALLBACK);
        var program = initGLProgram(gl, fs, vs, 'highpFragmentTest', constants_1.DEFAULT_ERROR_CALLBACK);
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
function isHighpSupportedInVertexShader() {
    if (results.highpVertex === undefined) {
        var vertexSupport = isHighpSupported('void main() { highp float test = 0.524; gl_Position = vec4(test, test, 0, 1); }', 'void main() { gl_FragColor = vec4(0); }');
        results.highpVertex = vertexSupport;
    }
    return results.highpVertex;
}
exports.isHighpSupportedInVertexShader = isHighpSupportedInVertexShader;
function isHighpSupportedInFragmentShader() {
    if (results.highpFragment === undefined) {
        var fragmentSupport = isHighpSupported('void main() { gl_Position = vec4(0.5, 0.5, 0, 1); }', 'void main() { highp float test = 1.35; gl_FragColor = vec4(test); }');
        results.highpFragment = fragmentSupport;
    }
    return results.highpFragment;
}
exports.isHighpSupportedInFragmentShader = isHighpSupportedInFragmentShader;
function test1PxCalc(name, gl, fs, vs, addUniforms) {
    var program = initGLProgram(gl, fs, vs, name, constants_1.DEFAULT_ERROR_CALLBACK);
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
// From https://webglfundamentals.org/webgl/lessons/webgl-precision-issues.html
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
// From https://webglfundamentals.org/webgl/lessons/webgl-precision-issues.html
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
function isPowerOf2(value) {
    // Use bitwise operation to evaluate this.
    return value > 0 && (value & (value - 1)) == 0;
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
function preprocessShader(shaderSource) {
    // Strip out any version numbers.
    // https://github.com/Jam3/glsl-version-regex
    var origSrc = shaderSource.slice();
    shaderSource = shaderSource.replace(/^\s*\#version\s+([0-9]+(\s+[a-zA-Z]+)?)\s*/, '');
    if (shaderSource !== origSrc) {
        console.warn('WebGLCompute expects shader source that does not contain #version definitions, removing...');
    }
    // Strip out any precision declarations.
    origSrc = shaderSource.slice();
    shaderSource = shaderSource.replace(/\s*precision\s+((highp)|(mediump)|(lowp))\s+[a-zA-Z0-9]+\s*;/g, '');
    if (shaderSource !== origSrc) {
        console.warn('WebGLCompute expects shader source that does not contain precision declarations, removing...');
    }
    return shaderSource;
}
function convertShaderToGLSL1(shaderSource) {
    // TODO: there are probably more to add here.
    shaderSource = shaderSource.replace(/((\bisampler2D\b)|(\busampler2D\b))/g, 'sampler2D');
    shaderSource = shaderSource.replace(/((\bivec2\b)|(\buvec2\b))/g, 'vec2');
    shaderSource = shaderSource.replace(/((\bivec3\b)|(\buvec3\b))/g, 'vec3');
    shaderSource = shaderSource.replace(/((\bivec4\b)|(\buvec4\b))/g, 'vec4');
    // Convert texture to texture2D.
    shaderSource = shaderSource.replace(/\btexture\(/g, 'texture2D(');
    return shaderSource;
}
function convertVertexShaderToGLSL1(shaderSource) {
    shaderSource = convertShaderToGLSL1(shaderSource);
    // Convert in to attribute.
    shaderSource = shaderSource.replace(/\bin\b/, 'attribute');
    // Convert out to varying.
    shaderSource = shaderSource.replace(/\bout\b/g, 'varying');
    return shaderSource;
}
function convertFragmentShaderToGLSL1(shaderSource) {
    shaderSource = convertShaderToGLSL1(shaderSource);
    // Convert in to varying.
    shaderSource = shaderSource.replace(/\bin\b/g, 'varying');
    // Convert out to gl_FragColor.
    shaderSource = shaderSource.replace(/\bout \w+ out_fragColor;/g, '');
    shaderSource = shaderSource.replace(/\bout_fragColor\s+=/, 'gl_FragColor =');
    return shaderSource;
}
function preprocessVertexShader(shaderSource, glslVersion) {
    shaderSource = preprocessShader(shaderSource);
    // Check if highp supported in vertex shaders.
    if (!isHighpSupportedInVertexShader()) {
        console.warn('highp not supported in vertex shader, falling back to mediump.');
        // Replace all highp with mediump.
        shaderSource = shaderSource.replace(/\bhighp\b/, 'mediump');
    }
    if (glslVersion === constants_1.GLSL3) {
        return shaderSource;
    }
    return convertVertexShaderToGLSL1(shaderSource);
}
exports.preprocessVertexShader = preprocessVertexShader;
function preprocessFragmentShader(shaderSource, glslVersion) {
    shaderSource = preprocessShader(shaderSource);
    // Check if highp supported in fragment shaders.
    if (!isHighpSupportedInFragmentShader()) {
        console.warn('highp not supported in fragment shader, falling back to mediump.');
        // Replace all highp with mediump.
        shaderSource = shaderSource.replace(/\bhighp\b/, 'mediump');
    }
    if (glslVersion === constants_1.GLSL3) {
        return shaderSource;
    }
    return convertFragmentShaderToGLSL1(shaderSource);
}
exports.preprocessFragmentShader = preprocessFragmentShader;


/***/ }),

/***/ 937:
/***/ ((module) => {

module.exports = "#if (WEBGLCOMPUTE_INT_PRECISION == 2)\n#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp int;\n#else\nprecision mediump int;\n#endif\n#endif\n#if (WEBGLCOMPUTE_INT_PRECISION == 1)\nprecision mediump int;\n#endif\n#if (WEBGLCOMPUTE_INT_PRECISION == 0)\nprecision lowp int;\n#endif\n#if (WEBGLCOMPUTE_FLOAT_PRECISION == 2)\n#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\n#endif\n#if (WEBGLCOMPUTE_FLOAT_PRECISION == 1)\nprecision mediump float;\n#endif\n#if (WEBGLCOMPUTE_FLOAT_PRECISION == 0)\nprecision lowp float;\n#endif\nprecision lowp sampler2D;\n#if (__VERSION__ == 300)\nprecision lowp isampler2D;precision lowp usampler2D;\n#endif\n"

/***/ }),

/***/ 158:
/***/ ((module) => {

module.exports = "in vec2 v_UV;\n#ifdef WEBGLCOMPUTE_FLOAT\nuniform sampler2D u_state;\n#endif\n#ifdef WEBGLCOMPUTE_INT\nuniform isampler2D u_state;\n#endif\n#ifdef WEBGLCOMPUTE_UINT\nuniform usampler2D u_state;\n#endif\n#ifdef WEBGLCOMPUTE_FLOAT\nout vec4 out_fragColor;\n#endif\n#ifdef WEBGLCOMPUTE_INT\nout ivec4 out_fragColor;\n#endif\n#ifdef WEBGLCOMPUTE_UINT\nout uvec4 out_fragColor;\n#endif\nvoid main(){out_fragColor=A(u_state,v_UV);}"

/***/ }),

/***/ 148:
/***/ ((module) => {

module.exports = "#ifdef WEBGLCOMPUTE_FLOAT\nuniform vec4 u_value;\n#endif\n#ifdef WEBGLCOMPUTE_INT\nuniform ivec4 u_value;\n#endif\n#ifdef WEBGLCOMPUTE_UINT\nuniform uvec4 u_value;\n#endif\n#ifdef WEBGLCOMPUTE_FLOAT\nout vec4 out_fragColor;\n#endif\n#ifdef WEBGLCOMPUTE_INT\nout ivec4 out_fragColor;\n#endif\n#ifdef WEBGLCOMPUTE_UINT\nout uvec4 out_fragColor;\n#endif\nvoid main(){out_fragColor=u_value;}"

/***/ }),

/***/ 723:
/***/ ((module) => {

module.exports = "in vec2 v_UV;uniform vec3 u_color;uniform float u_scale;\n#ifdef WEBGLCOMPUTE_FLOAT\nuniform sampler2D u_internal_data;\n#endif\n#ifdef WEBGLCOMPUTE_INT\nuniform isampler2D u_internal_data;\n#endif\n#ifdef WEBGLCOMPUTE_UINT\nuniform usampler2D u_internal_data;\n#endif\nout vec4 out_fragColor;void main(){uvec4 A=B(u_internal_data,v_UV);float C=length(A);out_fragColor=vec4(C*u_scale*u_color,1);}"

/***/ }),

/***/ 598:
/***/ ((module) => {

module.exports = "in vec2 v_lineWrapping;uniform vec4 u_value;out vec4 out_fragColor;void main(){if((v_lineWrapping.x!=0.&&v_lineWrapping.x!=1.)||(v_lineWrapping.y!=0.&&v_lineWrapping.y!=1.)){discard;return;}out_fragColor=vec4(u_value);}"

/***/ }),

/***/ 288:
/***/ ((module) => {

module.exports = "in vec2 a_internal_position;\n#ifdef WEBGLCOMPUTE_UV_ATTRIBUTE\nin vec2 a_internal_uv;\n#endif\n#ifdef WEBGLCOMPUTE_NORMAL_ATTRIBUTE\nin vec2 a_internal_normal;\n#endif\nuniform vec2 u_internal_scale;uniform vec2 u_internal_translation;out vec2 v_UV;out vec2 v_UV_local;\n#ifdef WEBGLCOMPUTE_NORMAL_ATTRIBUTE\nout vec2 v_normal;\n#endif\nvoid main(){\n#ifdef WEBGLCOMPUTE_UV_ATTRIBUTE\nv_UV_local=a_internal_uv;\n#else\nv_UV_local=a_internal_position;\n#endif\n#ifdef WEBGLCOMPUTE_NORMAL_ATTRIBUTE\nv_normal=a_internal_normal;\n#endif\nvec2 A=u_internal_scale*a_internal_position+u_internal_translation;v_UV=0.5*(A+1.);gl_Position=vec4(A,0,1);}"

/***/ }),

/***/ 629:
/***/ ((module) => {

module.exports = "float A(float B,float C){float D=B-floor((B+0.5)/C)*C;return floor(D+0.5);}in float a_internal_index;uniform sampler2D u_internal_positions;uniform vec2 u_internal_positionsDimensions;uniform vec2 u_internal_scale;uniform bool u_internal_positionWithAccumulation;uniform bool u_internal_wrapX;uniform bool u_internal_wrapY;out vec2 v_UV;out vec2 v_lineWrapping;out float v_index;void main(){vec2 E=vec2(A(a_internal_index,u_internal_positionsDimensions.x),floor(floor(a_internal_index+0.5)/u_internal_positionsDimensions.x))/u_internal_positionsDimensions;vec4 F=texture2D(u_internal_positions,E);vec2 G=F.rg;if(u_internal_positionWithAccumulation)G+=F.ba;v_UV=G*u_internal_scale;v_lineWrapping=vec2(0.);if(u_internal_wrapX){if(v_UV.x<0.){v_UV.x+=1.;v_lineWrapping.x=1.;}else if(v_UV.x>1.){v_UV.x-=1.;v_lineWrapping.x=1.;}}if(u_internal_wrapY){if(v_UV.y<0.){v_UV.y+=1.;v_lineWrapping.y=1.;}else if(v_UV.y>1.){v_UV.y-=1.;v_lineWrapping.y=1.;}}vec2 H=v_UV*2.-1.;v_index=a_internal_index;gl_Position=vec4(H,0,1);}"

/***/ }),

/***/ 62:
/***/ ((module) => {

module.exports = "float A(float B,float C){float D=B-floor((B+0.5)/C)*C;return floor(D+0.5);}in float a_internal_index;uniform sampler2D u_internal_positions;uniform vec2 u_internal_positionsDimensions;uniform vec2 u_internal_scale;uniform float u_internal_pointSize;uniform bool u_internal_positionWithAccumulation;uniform bool u_internal_wrapX;uniform bool u_internal_wrapY;out vec2 v_UV;out float v_index;void main(){vec2 E=vec2(A(a_internal_index,u_internal_positionsDimensions.x),floor(floor(a_internal_index+0.5)/u_internal_positionsDimensions.x))/u_internal_positionsDimensions;vec4 F=texture2D(u_internal_positions,E);vec2 G=F.rg;if(u_internal_positionWithAccumulation)G+=F.ba;v_UV=G*u_internal_scale;if(u_internal_wrapX){if(v_UV.x<0.)v_UV.x+=1.;if(v_UV.x>1.)v_UV.x-=1.;}if(u_internal_wrapY){if(v_UV.y<0.)v_UV.y+=1.;if(v_UV.y>1.)v_UV.y-=1.;}vec2 H=v_UV*2.-1.;v_index=a_internal_index;gl_PointSize=u_internal_pointSize;gl_Position=vec4(H,0,1);}"

/***/ }),

/***/ 430:
/***/ ((module) => {

module.exports = "float A(float B,float C){float D=B-floor((B+0.5)/C)*C;return floor(D+0.5);}in float a_internal_index;uniform sampler2D u_internal_vectors;uniform vec2 u_internal_dimensions;uniform vec2 u_internal_scale;out vec2 v_UV;out float v_index;void main(){float E=floor((a_internal_index+0.5)/2.);v_UV=vec2(A(E,u_internal_dimensions.x),floor(floor(E+0.5)/u_internal_dimensions.x))/u_internal_dimensions;if(A(a_internal_index,2.)>0.){vec2 F=texture2D(u_internal_vectors,v_UV).xy;v_UV+=F*u_internal_scale;}vec2 G=v_UV*2.-1.;v_index=a_internal_index;gl_Position=vec4(G,0,1);}"

/***/ }),

/***/ 974:
/***/ ((module) => {

module.exports = "in vec2 a_internal_position;uniform float u_internal_halfThickness;uniform vec2 u_internal_scale;uniform float u_internal_length;uniform float u_internal_rotation;uniform vec2 u_internal_translation;out vec2 v_UV_local;out vec2 v_UV;mat2 A(float B){return mat2(cos(B),-sin(B),sin(B),cos(B));}void main(){v_UV_local=0.5*(a_internal_position+1.);vec2 C=a_internal_position;C*=u_internal_halfThickness;if(C.x<0.){C.x-=u_internal_length/2.;v_UV_local.x=0.;}else if(C.x>0.){C.x+=u_internal_length/2.;v_UV_local.x=1.;}C=u_internal_scale*(A(-u_internal_rotation)*C)+u_internal_translation;v_UV=0.5*(C+1.);gl_Position=vec4(C,0,1);}"

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
/******/ 	var __webpack_exports__ = __webpack_require__(607);
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=webgl-compute.js.map