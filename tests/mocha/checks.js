{
	const {
		HALF_FLOAT,
		FLOAT,
		UNSIGNED_BYTE,
		BYTE,
		UNSIGNED_SHORT,
		SHORT,
		UNSIGNED_INT,
		INT,
		LINEAR,
		NEAREST,
		CLAMP_TO_EDGE,
		REPEAT,
		RGB,
		RGBA,
		_testing,
	} = WebGLCompute;
	const {
		isValidDataType,
		isValidFilter,
		isValidWrap,
		isValidTextureFormat,
		isValidTextureType,
		isValidClearValue,
		isNumberOfType,
		isNumber,
		isInteger,
		isPositiveInteger,
		isNonNegativeInteger,
		isString,
		isArray,
		isObject,
		isBoolean,
	} = _testing;

	const typeChecks = [
		0, -1, 5.7, 92, true,
		false, 'test', '14', [4], [3, 5.6, 0],
		{ thing: 5 }, null, undefined, Infinity, -Infinity,
		NaN,
	];
	const numberChecks = [
		2.4, 5, 0, -4.6, -56,
		255, 127, 1000, 1000000, -1469.5,
		-487829346, Infinity, -Infinity, NaN,
	];
	describe('checks', () => {
		describe('isValidDataType', () => {
			it('should detect valid texture data types', () => {
				const validTypes = [HALF_FLOAT, FLOAT, UNSIGNED_BYTE, BYTE, UNSIGNED_SHORT, SHORT, UNSIGNED_INT, INT];
				validTypes.forEach(type => {
					assert.equal(isValidDataType(type), true, `failed on ${type}`);
				});
				assert.equal(isValidDataType('thing'), false);
			});
		});
		describe('isValidFilter', () => {
			it('should detect valid texture data types', () => {
				const validFilters = [LINEAR, NEAREST];
				validFilters.forEach(filter => {
					assert.equal(isValidFilter(filter), true, `failed on ${filter}`);
				});
				assert.equal(isValidFilter('thing'), false);
			});
		});
		describe('isValidWrap', () => {
			it('should detect valid texture data types', () => {
				const validWraps = [CLAMP_TO_EDGE, REPEAT];
				validWraps.forEach(wrap => {
					assert.equal(isValidWrap(wrap), true, `failed on ${wrap}`);
				});
				assert.equal(isValidWrap('MIRRORED_REPEAT'), false);
			});
		});
		describe('isValidTextureFormat', () => {
			it('should detect valid texture data types', () => {
				const validTextureFormats = [RGB, RGBA];
				validTextureFormats.forEach(textureFormat => {
					assert.equal(isValidTextureFormat(textureFormat), true, `failed on ${textureFormat}`);
				});
				assert.equal(isValidTextureFormat('R'), false);
				assert.equal(isValidTextureFormat('RG'), false);
			});
		});
		describe('isValidTextureType', () => {
			it('should detect valid texture data types', () => {
				const validTextureTypes = [UNSIGNED_BYTE];
				validTextureTypes.forEach(textureType => {
					assert.equal(isValidTextureType(textureType), true, `failed on ${textureType}`);
				});
				assert.equal(isValidTextureType(FLOAT), false);
			});
		});
		describe('isValidClearValue', () => {
			it('should detect valid clear values for GPULayer', () => {
				assert.equal(isValidClearValue(3.5, 4, FLOAT), true);
				assert.equal(isValidClearValue(3.5, 4, INT), false);
				assert.equal(isValidClearValue(0, 4, UNSIGNED_BYTE), true);
				assert.equal(isValidClearValue([0, 0], 4, UNSIGNED_BYTE), false);
				assert.equal(isValidClearValue([0, 0], 2, UNSIGNED_BYTE), true);
				assert.equal(isValidClearValue([0, 0, 0, 0], 4, UNSIGNED_BYTE), true);
				assert.equal(isValidClearValue([4.5, 0, 3, 5], 4, UNSIGNED_BYTE), false);
				assert.equal(isValidClearValue([4.5, 0, 3, 5], 4, HALF_FLOAT), true);
				// This function calls isNumberOfType, do more extensive testing there.
			});
		});
		describe('isNumberOfType', () => {
			it('should detect valid half floats', () => {
				const expected = [
					true, true, true, true, true,
					true, true, true, true, true,
					true, false, false, false,
				];
				assert.equal(expected.length, numberChecks.length);
				numberChecks.forEach((number, index) => {
					assert.equal(isNumberOfType(number, HALF_FLOAT), expected[index], `failed on ${number}`);
				});
			});
			it('should detect valid floats', () => {
				const expected = [
					true, true, true, true, true,
					true, true, true, true, true,
					true, false, false, false,
				];
				assert.equal(expected.length, numberChecks.length);
				numberChecks.forEach((number, index) => {
					assert.equal(isNumberOfType(number, FLOAT), expected[index], `failed on ${number}`);
				});
			});
			it('should detect valid unsigned bytes', () => {
				const expected = [
					false, true, true, false, false,
					true, true, false, false, false,
					false, false, false, false,
				];
				assert.equal(expected.length, numberChecks.length);
				numberChecks.forEach((number, index) => {
					assert.equal(isNumberOfType(number, UNSIGNED_BYTE), expected[index], `failed on ${number}`);
				});
				assert.equal(isNumberOfType(255, UNSIGNED_BYTE), true, `failed on ${255}`);
				assert.equal(isNumberOfType(256, UNSIGNED_BYTE), false, `failed on ${256}`);
				assert.equal(isNumberOfType(-1, UNSIGNED_BYTE), false, `failed on ${-1}`);
			});
			it('should detect valid bytes', () => {
				const expected = [
					false, true, true, false, true,
					false, true, false, false, false,
					false, false, false, false,
				];
				assert.equal(expected.length, numberChecks.length);
				numberChecks.forEach((number, index) => {
					assert.equal(isNumberOfType(number, BYTE), expected[index], `failed on ${number}`);
				});
				assert.equal(isNumberOfType(255, BYTE), false, `failed on ${255}`);
				assert.equal(isNumberOfType(127, BYTE), true, `failed on ${127}`);
				assert.equal(isNumberOfType(128, BYTE), false, `failed on ${128}`);
				assert.equal(isNumberOfType(-128, BYTE), true, `failed on ${-128}`);
				assert.equal(isNumberOfType(-129, BYTE), false, `failed on ${-129}`);
			});
			it('should detect valid unsigned shorts', () => {
				const expected = [
					false, true, true, false, false,
					true, true, true, false, false,
					false, false, false, false,
				];
				assert.equal(expected.length, numberChecks.length);
				numberChecks.forEach((number, index) => {
					assert.equal(isNumberOfType(number, UNSIGNED_SHORT), expected[index], `failed on ${number}`);
				});
				assert.equal(isNumberOfType(65535, UNSIGNED_SHORT), true, `failed on ${65535}`);
				assert.equal(isNumberOfType(65536, UNSIGNED_SHORT), false, `failed on ${65536}`);
				assert.equal(isNumberOfType(-1, UNSIGNED_SHORT), false, `failed on ${-1}`);
			});
			it('should detect valid shorts', () => {
				const expected = [
					false, true, true, false, true,
					true, true, true, false, false,
					false, false, false, false,
				];
				assert.equal(expected.length, numberChecks.length);
				numberChecks.forEach((number, index) => {
					assert.equal(isNumberOfType(number, SHORT), expected[index], `failed on ${number}`);
				});
				assert.equal(isNumberOfType(65535, SHORT), false, `failed on ${65535}`);
				assert.equal(isNumberOfType(-32768, SHORT), true, `failed on ${-32768}`);
				assert.equal(isNumberOfType(-32769, SHORT), false, `failed on ${-32769}`);
				assert.equal(isNumberOfType(32767, SHORT), true, `failed on ${32767}`);
				assert.equal(isNumberOfType(32768, SHORT), false, `failed on ${32768}`);
			});
			it('should detect valid unsigned ints', () => {
				const expected = [
					false, true, true, false, false,
					true, true, true, true, false,
					false, false, false, false,
				];
				assert.equal(expected.length, numberChecks.length);
				numberChecks.forEach((number, index) => {
					assert.equal(isNumberOfType(number, UNSIGNED_INT), expected[index], `failed on ${number}`);
				});
				assert.equal(isNumberOfType(4294967295, UNSIGNED_INT), true, `failed on ${4294967295}`);
				assert.equal(isNumberOfType(4294967296, UNSIGNED_INT), false, `failed on ${4294967296}`);
				assert.equal(isNumberOfType(-1, UNSIGNED_INT), false, `failed on ${-1}`);
			});
			it('should detect valid ints', () => {
				const expected = [
					false, true, true, false, true,
					true, true, true, true, false,
					true, false, false, false,
				];
				assert.equal(expected.length, numberChecks.length);
				numberChecks.forEach((number, index) => {
					assert.equal(isNumberOfType(number, INT), expected[index], `failed on ${number}`);
				});
				assert.equal(isNumberOfType(4294967295, INT), false, `failed on ${4294967295}`);
				assert.equal(isNumberOfType(-2147483648, INT), true, `failed on ${-2147483648}`);
				assert.equal(isNumberOfType(-2147483649, INT), false, `failed on ${-2147483649}`);
				assert.equal(isNumberOfType(2147483647, INT), true, `failed on ${2147483647}`);
				assert.equal(isNumberOfType(2147483648, INT), false, `failed on ${2147483648}`);
			});
		});
		describe('isNumber', () => {
			it('should detect valid numbers', () => {
				const expected = [true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false];
				assert.equal(expected.length, typeChecks.length);
				typeChecks.forEach((item, index) => {
					assert.equal(isNumber(item), expected[index], `failed on ${item}`);
				});
			});
		});
		describe('isInteger', () => {
			it('should detect valid integers', () => {
				const expected = [true, true, false, true, false, false, false, false, false, false, false, false, false, false, false, false];
				assert.equal(expected.length, typeChecks.length);
				typeChecks.forEach((item, index) => {
					assert.equal(isInteger(item), expected[index], `failed on ${item}`);
				});
			});
		});
		describe('isPositiveInteger', () => {
			it('should detect valid positive integers', () => {
				const expected = [false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false];
				assert.equal(expected.length, typeChecks.length);
				typeChecks.forEach((item, index) => {
					assert.equal(isPositiveInteger(item), expected[index], `failed on ${item}`);
				});
			});
		});
		describe('isNonNegativeInteger', () => {
			it('should detect valid non-negative integers', () => {
				const expected = [true, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false];
				assert.equal(expected.length, typeChecks.length);
				typeChecks.forEach((item, index) => {
					assert.equal(isNonNegativeInteger(item), expected[index], `failed on ${item}`);
				});
			});
		});
		describe('isString', () => {
			it('should detect valid strings', () => {
				const expected = [false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false];
				assert.equal(expected.length, typeChecks.length);
				typeChecks.forEach((item, index) => {
					assert.equal(isString(item), expected[index], `failed on ${item}`);
				});
			});
		});
		describe('isArray', () => {
			it('should detect valid arrays', () => {
				const expected = [false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false];
				assert.equal(expected.length, typeChecks.length);
				typeChecks.forEach((item, index) => {
					assert.equal(isArray(item), expected[index], `failed on ${item}`);
				});
			});
		});
		describe('isObject', () => {
			it('should detect valid arrays', () => {
				const expected = [false, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false];
				assert.equal(expected.length, typeChecks.length);
				typeChecks.forEach((item, index) => {
					assert.equal(isObject(item), expected[index], `failed on ${item}`);
				});
			});
		});
		describe('isBoolean', () => {
			it('should detect valid arrays', () => {
				const expected = [false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false];
				assert.equal(expected.length, typeChecks.length);
				typeChecks.forEach((item, index) => {
					assert.equal(isBoolean(item), expected[index], `failed on ${item}`);
				});
			});
		});
	});
}