/**
 * @petamoriken/float16 e52b20a | MIT License - https://git.io/float16
 *
 * @license
 * lodash-es v4.17.15 | MIT License - https://lodash.com/custom-builds
 */

var float16 = (function (exports) {
    'use strict';

    // algorithm: ftp://ftp.fox-toolkit.org/pub/fasthalffloatconversion.pdf
    const buffer = new ArrayBuffer(4);
    const floatView = new Float32Array(buffer);
    const uint32View = new Uint32Array(buffer);
    const baseTable = new Uint32Array(512);
    const shiftTable = new Uint32Array(512);

    for (let i = 0; i < 256; ++i) {
      const e = i - 127; // very small number (0, -0)

      if (e < -27) {
        baseTable[i | 0x000] = 0x0000;
        baseTable[i | 0x100] = 0x8000;
        shiftTable[i | 0x000] = 24;
        shiftTable[i | 0x100] = 24; // small number (denorm)
      } else if (e < -14) {
        baseTable[i | 0x000] = 0x0400 >> -e - 14;
        baseTable[i | 0x100] = 0x0400 >> -e - 14 | 0x8000;
        shiftTable[i | 0x000] = -e - 1;
        shiftTable[i | 0x100] = -e - 1; // normal number
      } else if (e <= 15) {
        baseTable[i | 0x000] = e + 15 << 10;
        baseTable[i | 0x100] = e + 15 << 10 | 0x8000;
        shiftTable[i | 0x000] = 13;
        shiftTable[i | 0x100] = 13; // large number (Infinity, -Infinity)
      } else if (e < 128) {
        baseTable[i | 0x000] = 0x7c00;
        baseTable[i | 0x100] = 0xfc00;
        shiftTable[i | 0x000] = 24;
        shiftTable[i | 0x100] = 24; // stay (NaN, Infinity, -Infinity)
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
      const e = f >> 23 & 0x1ff;
      return baseTable[e] + ((f & 0x007fffff) >> shiftTable[e]);
    }
    const mantissaTable = new Uint32Array(2048);
    const exponentTable = new Uint32Array(64);
    const offsetTable = new Uint32Array(64);
    mantissaTable[0] = 0;

    for (let i = 1; i < 1024; ++i) {
      let m = i << 13; // zero pad mantissa bits

      let e = 0; // zero exponent
      // normalized

      while ((m & 0x00800000) === 0) {
        e -= 0x00800000; // decrement exponent

        m <<= 1;
      }

      m &= ~0x00800000; // clear leading 1 bit

      e += 0x38800000; // adjust bias

      mantissaTable[i] = m | e;
    }

    for (let i = 1024; i < 2048; ++i) {
      mantissaTable[i] = 0x38000000 + (i - 1024 << 13);
    }

    exponentTable[0] = 0;

    for (let i = 1; i < 31; ++i) {
      exponentTable[i] = i << 23;
    }

    exponentTable[31] = 0x47800000;
    exponentTable[32] = 0x80000000;

    for (let i = 33; i < 63; ++i) {
      exponentTable[i] = 0x80000000 + (i - 32 << 23);
    }

    exponentTable[63] = 0xc7800000;
    offsetTable[0] = 0;

    for (let i = 1; i < 64; ++i) {
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

    /**
     * returns the nearest half precision float representation of a number.
     * @param {number} num
     * @returns {number}
     */

    function hfround(num) {
      num = Number(num); // for optimization

      if (!Number.isFinite(num) || num === 0) {
        return num;
      }

      const x16 = roundToFloat16Bits(num);
      return convertToNumber(x16);
    }

    /** Detect free variable `global` from Node.js. */
    var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

    /** Detect free variable `self`. */

    var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
    /** Used as a reference to the global object. */

    var root = freeGlobal || freeSelf || Function('return this')();

    /** Built-in value references. */

    var Symbol$1 = root.Symbol;

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

    var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : undefined;
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

    /** Used for built-in method references. */
    var objectProto$1 = Object.prototype;
    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */

    var nativeObjectToString$1 = objectProto$1.toString;
    /**
     * Converts `value` to a string using `Object.prototype.toString`.
     *
     * @private
     * @param {*} value The value to convert.
     * @returns {string} Returns the converted string.
     */

    function objectToString(value) {
      return nativeObjectToString$1.call(value);
    }

    /** `Object#toString` result references. */

    var nullTag = '[object Null]',
        undefinedTag = '[object Undefined]';
    /** Built-in value references. */

    var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : undefined;
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

      return symToStringTag$1 && symToStringTag$1 in Object(value) ? getRawTag(value) : objectToString(value);
    }

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
      if (!isObject(value)) {
        return false;
      } // The use of `Object#toString` avoids issues with the `typeof` operator
      // in Safari 9 which returns 'object' for typed arrays and other constructors.


      var tag = baseGetTag(value);
      return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
    }

    /** Used to detect overreaching core-js shims. */

    var coreJsData = root['__core-js_shared__'];

    /** Used to detect methods masquerading as native. */

    var maskSrcKey = function () {
      var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
      return uid ? 'Symbol(src)_1.' + uid : '';
    }();
    /**
     * Checks if `func` has its source masked.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` is masked, else `false`.
     */


    function isMasked(func) {
      return !!maskSrcKey && maskSrcKey in func;
    }

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
          return func + '';
        } catch (e) {}
      }

      return '';
    }

    /**
     * Used to match `RegExp`
     * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
     */

    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
    /** Used to detect host constructors (Safari). */

    var reIsHostCtor = /^\[object .+?Constructor\]$/;
    /** Used for built-in method references. */

    var funcProto$1 = Function.prototype,
        objectProto$2 = Object.prototype;
    /** Used to resolve the decompiled source of functions. */

    var funcToString$1 = funcProto$1.toString;
    /** Used to check objects for own properties. */

    var hasOwnProperty$1 = objectProto$2.hasOwnProperty;
    /** Used to detect if a method is native. */

    var reIsNative = RegExp('^' + funcToString$1.call(hasOwnProperty$1).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
    /**
     * The base implementation of `_.isNative` without bad shim checks.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function,
     *  else `false`.
     */

    function baseIsNative(value) {
      if (!isObject(value) || isMasked(value)) {
        return false;
      }

      var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }

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

    /**
     * Gets the native function at `key` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the method to get.
     * @returns {*} Returns the function if it's native, else `undefined`.
     */

    function getNative(object, key) {
      var value = getValue(object, key);
      return baseIsNative(value) ? value : undefined;
    }

    /* Built-in method references that are verified to be native. */

    var nativeCreate = getNative(Object, 'create');

    /**
     * Removes all key-value entries from the hash.
     *
     * @private
     * @name clear
     * @memberOf Hash
     */

    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
      this.size = 0;
    }

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

    /** Used to stand-in for `undefined` hash values. */

    var HASH_UNDEFINED = '__lodash_hash_undefined__';
    /** Used for built-in method references. */

    var objectProto$3 = Object.prototype;
    /** Used to check objects for own properties. */

    var hasOwnProperty$2 = objectProto$3.hasOwnProperty;
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

      if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? undefined : result;
      }

      return hasOwnProperty$2.call(data, key) ? data[key] : undefined;
    }

    /** Used for built-in method references. */

    var objectProto$4 = Object.prototype;
    /** Used to check objects for own properties. */

    var hasOwnProperty$3 = objectProto$4.hasOwnProperty;
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
      return nativeCreate ? data[key] !== undefined : hasOwnProperty$3.call(data, key);
    }

    /** Used to stand-in for `undefined` hash values. */

    var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';
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
      data[key] = nativeCreate && value === undefined ? HASH_UNDEFINED$1 : value;
      return this;
    }

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
    } // Add methods to `Hash`.


    Hash.prototype.clear = hashClear;
    Hash.prototype['delete'] = hashDelete;
    Hash.prototype.get = hashGet;
    Hash.prototype.has = hashHas;
    Hash.prototype.set = hashSet;

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
      return value === other || value !== value && other !== other;
    }

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
        if (eq(array[length][0], key)) {
          return length;
        }
      }

      return -1;
    }

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
          index = assocIndexOf(data, key);

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
          index = assocIndexOf(data, key);
      return index < 0 ? undefined : data[index][1];
    }

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
      return assocIndexOf(this.__data__, key) > -1;
    }

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
          index = assocIndexOf(data, key);

      if (index < 0) {
        ++this.size;
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }

      return this;
    }

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
    } // Add methods to `ListCache`.


    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype['delete'] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;

    /* Built-in method references that are verified to be native. */

    var Map = getNative(root, 'Map');

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
        'hash': new Hash(),
        'map': new (Map || ListCache)(),
        'string': new Hash()
      };
    }

    /**
     * Checks if `value` is suitable for use as unique object key.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
     */
    function isKeyable(value) {
      var type = typeof value;
      return type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean' ? value !== '__proto__' : value === null;
    }

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
      return isKeyable(key) ? data[typeof key == 'string' ? 'string' : 'hash'] : data.map;
    }

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
      var result = getMapData(this, key)['delete'](key);
      this.size -= result ? 1 : 0;
      return result;
    }

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
      return getMapData(this, key).get(key);
    }

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
      return getMapData(this, key).has(key);
    }

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
      var data = getMapData(this, key),
          size = data.size;
      data.set(key, value);
      this.size += data.size == size ? 0 : 1;
      return this;
    }

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
    } // Add methods to `MapCache`.


    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype['delete'] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;

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
      if (typeof func != 'function' || resolver != null && typeof resolver != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }

      var memoized = function () {
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

      memoized.cache = new (memoize.Cache || MapCache)();
      return memoized;
    } // Expose `MapCache`.


    memoize.Cache = MapCache;

    /**
     * JavaScriptCore <= 12 bug
     * @see https://bugs.webkit.org/show_bug.cgi?id=171606
     */
    const isTypedArrayIndexedPropertyWritable = Object.getOwnPropertyDescriptor(new Uint8Array(1), 0).writable;

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

    var arrayBufferTag = '[object ArrayBuffer]';
    /**
     * The base implementation of `_.isArrayBuffer` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array buffer, else `false`.
     */

    function baseIsArrayBuffer(value) {
      return isObjectLike(value) && baseGetTag(value) == arrayBufferTag;
    }

    /**
     * The base implementation of `_.unary` without support for storing metadata.
     *
     * @private
     * @param {Function} func The function to cap arguments for.
     * @returns {Function} Returns the new capped function.
     */
    function baseUnary(func) {
      return function (value) {
        return func(value);
      };
    }

    /** Detect free variable `exports`. */

    var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;
    /** Detect free variable `module`. */

    var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;
    /** Detect the popular CommonJS extension `module.exports`. */

    var moduleExports = freeModule && freeModule.exports === freeExports;
    /** Detect free variable `process` from Node.js. */

    var freeProcess = moduleExports && freeGlobal.process;
    /** Used to access faster Node.js helpers. */

    var nodeUtil = function () {
      try {
        // Use `util.types` for Node.js 10+.
        var types = freeModule && freeModule.require && freeModule.require('util').types;

        if (types) {
          return types;
        } // Legacy `process.binding('util')` for Node.js < 10.


        return freeProcess && freeProcess.binding && freeProcess.binding('util');
      } catch (e) {}
    }();

    /* Node.js helper references. */

    var nodeIsArrayBuffer = nodeUtil && nodeUtil.isArrayBuffer;
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

    var isArrayBuffer = nodeIsArrayBuffer ? baseUnary(nodeIsArrayBuffer) : baseIsArrayBuffer;

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

    /**
     * @returns {(self:object) => object}
     */
    function createPrivateStorage() {
      const wm = new WeakMap();
      return self => {
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

      for (let i = 0; i < length; ++i) {
        array[i] = convertToNumber(float16bits[i]);
      }

      return array;
    }
    /** @type {ProxyHandler<Function>} */


    const applyHandler = {
      apply(func, thisArg, args) {
        // peel off proxy
        if (isFloat16Array(thisArg) && isDefaultFloat16ArrayMethods(func)) {
          return Reflect.apply(func, _(thisArg).target, args);
        }

        return Reflect.apply(func, thisArg, args);
      }

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
          } // TypedArray methods can't be called by Proxy Object


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
      }

    };

    if (!isTypedArrayIndexedPropertyWritable) {
      handler.getPrototypeOf = wrapper => {
        return Reflect.getPrototypeOf(_(wrapper).target);
      };

      handler.setPrototypeOf = (wrapper, prototype) => {
        return Reflect.setPrototypeOf(_(wrapper).target, prototype);
      };

      handler.defineProperty = (wrapper, key, descriptor) => {
        const target = _(wrapper).target;

        return !Reflect.has(target, key) || Object.isFrozen(wrapper) ? Reflect.defineProperty(wrapper, key, descriptor) : Reflect.defineProperty(target, key, descriptor);
      };

      handler.deleteProperty = (wrapper, key) => {
        const target = _(wrapper).target;

        return Reflect.has(wrapper, key) ? Reflect.deleteProperty(wrapper, key) : Reflect.deleteProperty(target, key);
      };

      handler.has = (wrapper, key) => {
        return Reflect.has(wrapper, key) || Reflect.has(_(wrapper).target, key);
      };

      handler.isExtensible = wrapper => {
        return Reflect.isExtensible(wrapper);
      };

      handler.preventExtensions = wrapper => {
        return Reflect.preventExtensions(wrapper);
      };

      handler.getOwnPropertyDescriptor = (wrapper, key) => {
        return Reflect.getOwnPropertyDescriptor(wrapper, key);
      };

      handler.ownKeys = wrapper => {
        return Reflect.ownKeys(wrapper);
      };
    }

    class Float16Array extends Uint16Array {
      constructor(input, byteOffset, length) {
        // input Float16Array
        if (isFloat16Array(input)) {
          super(_(input).target); // 22.2.1.3, 22.2.1.4 TypedArray, Array, ArrayLike, Iterable
        } else if (input !== null && typeof input === "object" && !isArrayBuffer(input)) {
          // if input is not ArrayLike and Iterable, get Array
          const arrayLike = !Reflect.has(input, "length") && input[Symbol.iterator] !== undefined ? [...input] : input;
          const length = arrayLike.length;
          super(length);

          for (let i = 0; i < length; ++i) {
            // super (Uint16Array)
            this[i] = roundToFloat16Bits(arrayLike[i]);
          } // 22.2.1.2, 22.2.1.5 primitive, ArrayBuffer

        } else {
          switch (arguments.length) {
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
        } // proxy private storage


        _(proxy).target = this; // this private storage

        _(this).proxy = proxy;
        return proxy;
      } // static methods


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
      } // iterate methods


      *[Symbol.iterator]() {
        for (const val of super[Symbol.iterator]()) {
          yield convertToNumber(val);
        }
      }

      keys() {
        return super.keys();
      }

      *values() {
        for (const val of super.values()) {
          yield convertToNumber(val);
        }
      }
      /** @type {() => IterableIterator<[number, number]>} */


      *entries() {
        for (const [i, val] of super.entries()) {
          yield [i, convertToNumber(val)];
        }
      } // functional methods
      // @ts-ignore


      map(callback, ...opts) {
        assertFloat16Array(this);
        const thisArg = opts[0];
        const array = [];

        for (let i = 0, l = this.length; i < l; ++i) {
          const val = convertToNumber(this[i]);
          array.push(callback.call(thisArg, val, i, _(this).proxy));
        }

        return new Float16Array(array);
      } // @ts-ignore


      filter(callback, ...opts) {
        assertFloat16Array(this);
        const thisArg = opts[0];
        const array = [];

        for (let i = 0, l = this.length; i < l; ++i) {
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

        for (let i = start, l = this.length; i < l; ++i) {
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

        for (let i = start; i--;) {
          val = callback(val, convertToNumber(this[i]), i, _(this).proxy);
        }

        return val;
      }

      forEach(callback, ...opts) {
        assertFloat16Array(this);
        const thisArg = opts[0];

        for (let i = 0, l = this.length; i < l; ++i) {
          callback.call(thisArg, convertToNumber(this[i]), i, _(this).proxy);
        }
      }

      find(callback, ...opts) {
        assertFloat16Array(this);
        const thisArg = opts[0];

        for (let i = 0, l = this.length; i < l; ++i) {
          const value = convertToNumber(this[i]);

          if (callback.call(thisArg, value, i, _(this).proxy)) {
            return value;
          }
        }
      }

      findIndex(callback, ...opts) {
        assertFloat16Array(this);
        const thisArg = opts[0];

        for (let i = 0, l = this.length; i < l; ++i) {
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

        for (let i = 0, l = this.length; i < l; ++i) {
          if (!callback.call(thisArg, convertToNumber(this[i]), i, _(this).proxy)) {
            return false;
          }
        }

        return true;
      }

      some(callback, ...opts) {
        assertFloat16Array(this);
        const thisArg = opts[0];

        for (let i = 0, l = this.length; i < l; ++i) {
          if (callback.call(thisArg, convertToNumber(this[i]), i, _(this).proxy)) {
            return true;
          }
        }

        return false;
      } // change element methods


      set(input, ...opts) {
        assertFloat16Array(this);
        const offset = opts[0];
        let float16bits; // input Float16Array

        if (isFloat16Array(input)) {
          float16bits = _(input).target; // input others
        } else {
          const arrayLike = !Reflect.has(input, "length") && input[Symbol.iterator] !== undefined ? [...input] : input;
          const length = arrayLike.length;
          float16bits = new Uint16Array(length);

          for (let i = 0, l = arrayLike.length; i < l; ++i) {
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

        const _convertToNumber = memoize(convertToNumber);

        super.sort((x, y) => {
          return compareFunction(_convertToNumber(x), _convertToNumber(y));
        });
        return _(this).proxy;
      } // copy element methods
      // @ts-ignore


      slice(...opts) {
        assertFloat16Array(this);
        let float16bits; // V8, SpiderMonkey, JavaScriptCore, Chakra throw TypeError

        try {
          float16bits = super.slice(...opts);
        } catch (e) {
          if (e instanceof TypeError) {
            const uint16 = new Uint16Array(this.buffer, this.byteOffset, this.length);
            float16bits = uint16.slice(...opts);
          } else {
            throw e;
          }
        }

        return new Float16Array(float16bits.buffer);
      } // @ts-ignore


      subarray(...opts) {
        assertFloat16Array(this);
        let float16bits; // V8, SpiderMonkey, JavaScriptCore, Chakra throw TypeError

        try {
          float16bits = super.subarray(...opts);
        } catch (e) {
          if (e instanceof TypeError) {
            const uint16 = new Uint16Array(this.buffer, this.byteOffset, this.length);
            float16bits = uint16.subarray(...opts);
          } else {
            throw e;
          }
        }

        return new Float16Array(float16bits.buffer, float16bits.byteOffset, float16bits.length);
      } // contains methods


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

        for (let i = from, l = length; i < l; ++i) {
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

        for (let i = from; i--;) {
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

        for (let i = from, l = length; i < l; ++i) {
          const value = convertToNumber(this[i]);

          if (isNaN && Number.isNaN(value)) {
            return true;
          }

          if (value === element) {
            return true;
          }
        }

        return false;
      } // string methods


      join(...opts) {
        assertFloat16Array(this);
        const array = copyToArray(this);
        return array.join(...opts);
      }

      toLocaleString(...opts) {
        assertFloat16Array(this);
        const array = copyToArray(this); // @ts-ignore

        return array.toLocaleString(...opts);
      } // @ts-ignore


      get [Symbol.toStringTag]() {
        if (isFloat16Array(this)) {
          return "Float16Array";
        }
      }

    }
    const Float16Array$prototype = Float16Array.prototype;
    const defaultFloat16ArrayMethods = new WeakSet();

    for (const key of Reflect.ownKeys(Float16Array$prototype)) {
      const val = Float16Array$prototype[key];

      if (typeof val === "function") {
        defaultFloat16ArrayMethods.add(val);
      }
    }

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

      return convertToNumber(dataView.getUint16(byteOffset, ...opts));
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

    exports.Float16Array = Float16Array;
    exports.getFloat16 = getFloat16;
    exports.hfround = hfround;
    exports.setFloat16 = setFloat16;

    return exports;

}({}));
