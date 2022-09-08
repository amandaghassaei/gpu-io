import { getSampler2DsInProgram, stripComments } from './regex';

/**
 * Wrap type to use in polyfill.
 * (0) Default behavior (no polyfill).
 * (1) REPEAT polyfill.
 * @private
 */
export const SAMPLER2D_WRAP_X = 'GPUIO_WRAP_X';
/**
 * Wrap type to use in polyfill.
 * (0) Default behavior (no polyfill).
 * (1) REPEAT polyfill.
 * @private
 */
export const SAMPLER2D_WRAP_Y = 'GPUIO_WRAP_Y';
/**
 * Flag to cast texture() result to int type (needed for GLSL1).
 * @private
 */
 export const SAMPLER2D_CAST_INT = 'GPUIO_CAST_INT';

/**
 * Filter type to use in polyfill.
 * (0) Default behavior (no polyfill).
 * (0) LINEAR polyfill.
 * @private
 */
export const SAMPLER2D_FILTER = 'GPUIO_FILTER';

/**
 * UV size of half a pixel for this texture.
 * @private
 */
export const SAMPLER2D_HALF_PX_UNIFORM = 'u_gpuio_half_px';

/**
 * Dimensions of texture
 * @private
 */
export const SAMPLER2D_DIMENSIONS_UNIFORM = 'u_gpuio_dimensions';

/**
 * Override texture function to perform polyfill filter/wrap.
 * https://www.codeproject.com/Articles/236394/Bi-Cubic-and-Bi-Linear-Interpolation-with-GLSL
 * @private
 */
export function texturePolyfill(shaderSource: string) {
	const textureCalls = shaderSource.match(/\btexture\(/g);
	if (!textureCalls || textureCalls.length === 0) return { shaderSource, samplerUniforms: [] };
	const samplerUniforms = getSampler2DsInProgram(shaderSource);
	if (samplerUniforms.length === 0) return { shaderSource, samplerUniforms };
	samplerUniforms.forEach((name, i) => {
		const regex = new RegExp(`\\btexture(2D)?\\(\\s?${name}\\b`, 'gs');
		shaderSource = shaderSource.replace(regex, `GPUIO_TEXTURE_POLYFILL${i}(${name}`);
	});
	const remainingTextureCalls = shaderSource.match(/\btexture(2D)?\(/g);
	if (remainingTextureCalls?.length) {
		console.warn('Fragment shader polyfill has missed some calls to texture().', shaderSource);
	}
	
	let polyfillUniforms: {[key: string] : string } = {};
	for (let i = 0; i < samplerUniforms.length; i++) {
		// Init uniforms with a type.
		polyfillUniforms[`${SAMPLER2D_HALF_PX_UNIFORM}${i}`] = 'vec2';
		polyfillUniforms[`${SAMPLER2D_DIMENSIONS_UNIFORM}${i}`] = 'vec2';
	}

	function make_GPUIO_TEXTURE_POLYFILL(i: number, prefix: string, castOpening = '') {
		const castEnding = castOpening === '' ? '' : ')';
		const returnPrefix = castOpening === '' ? prefix : 'i';
		return `
${returnPrefix}vec4 GPUIO_TEXTURE_POLYFILL${i}(const ${prefix}sampler2D sampler, const vec2 uv) {
	${ prefix === '' ? `#if (${SAMPLER2D_FILTER}${i} == 0)` : ''}
		#if (${SAMPLER2D_WRAP_X}${i} == 0)
			#if (${SAMPLER2D_WRAP_Y}${i} == 0)
				return ${castOpening}texture(sampler, uv)${castEnding};
			#else
				return ${castOpening}GPUIO_TEXTURE_WRAP_CLAMP_REPEAT(sampler, uv, ${SAMPLER2D_HALF_PX_UNIFORM}${i})${castEnding};
			#endif
		#else
			#if (${SAMPLER2D_WRAP_Y}${i} == 0)
				return ${castOpening}GPUIO_TEXTURE_WRAP_REPEAT_CLAMP(sampler, uv, ${SAMPLER2D_HALF_PX_UNIFORM}${i})${castEnding};
			#else
				return ${castOpening}GPUIO_TEXTURE_WRAP_REPEAT_REPEAT(sampler, uv, ${SAMPLER2D_HALF_PX_UNIFORM}${i})${castEnding};
			#endif
		#endif
	${ prefix === '' ? `#else
		#if (${SAMPLER2D_WRAP_X}${i} == 0)
			#if (${SAMPLER2D_WRAP_Y}${i} == 0)
				return ${castOpening}GPUIO_TEXTURE_BILINEAR_INTERP(sampler, uv, ${SAMPLER2D_HALF_PX_UNIFORM}${i}, ${SAMPLER2D_DIMENSIONS_UNIFORM}${i})${castEnding};
			#else
				return ${castOpening}GPUIO_TEXTURE_BILINEAR_INTERP_WRAP_CLAMP_REPEAT(sampler, uv, ${SAMPLER2D_HALF_PX_UNIFORM}${i}, ${SAMPLER2D_DIMENSIONS_UNIFORM}${i})${castEnding};
			#endif
		#else
			#if (${SAMPLER2D_WRAP_Y}${i} == 0)
				return ${castOpening}GPUIO_TEXTURE_BILINEAR_INTERP_WRAP_REPEAT_CLAMP(sampler, uv, ${SAMPLER2D_HALF_PX_UNIFORM}${i}, ${SAMPLER2D_DIMENSIONS_UNIFORM}${i})${castEnding};
			#else
				return ${castOpening}GPUIO_TEXTURE_BILINEAR_INTERP_WRAP_REPEAT_REPEAT(sampler, uv, ${SAMPLER2D_HALF_PX_UNIFORM}${i}, ${SAMPLER2D_DIMENSIONS_UNIFORM}${i})${castEnding};
			#endif
		#endif
	#endif` : '' }
}\n`;
	}

	function make_GPUIO_TEXTURE_WRAP(prefix: string) {
		return `
${prefix}vec4 GPUIO_TEXTURE_WRAP_REPEAT_REPEAT(const ${prefix}sampler2D sampler, const vec2 uv, const vec2 halfPx) {
	return texture(sampler, GPUIO_WRAP_REPEAT_UV(uv));
}
${prefix}vec4 GPUIO_TEXTURE_WRAP_REPEAT_CLAMP(const ${prefix}sampler2D sampler, vec2 uv, const vec2 halfPx) {
	uv.x = GPUIO_WRAP_REPEAT_UV_COORD(uv.x);
	// uv.y = GPUIO_WRAP_CLAMP_UV_COORD(uv.y, halfPx.y);
	return texture(sampler, uv);
}
${prefix}vec4 GPUIO_TEXTURE_WRAP_CLAMP_REPEAT(const ${prefix}sampler2D sampler, vec2 uv, const vec2 halfPx) {
	// uv.x = GPUIO_WRAP_CLAMP_UV_COORD(uv.x, halfPx.x);
	uv.y = GPUIO_WRAP_REPEAT_UV_COORD(uv.y);
	return texture(sampler, uv);
}\n`;
	}

	function make_GPUIO_BILINEAR_INTERP(wrapType: string | null) {
		const lookupFunction = wrapType ? `GPUIO_TEXTURE_WRAP_${wrapType}` : 'texture';
		const extraParams =  wrapType ? `, halfPx` : '';
		return`
vec4 GPUIO_TEXTURE_BILINEAR_INTERP${ wrapType ? `_WRAP_${wrapType}` : '' }(const sampler2D sampler, const vec2 uv, const vec2 halfPx, const vec2 dimensions) {
	vec2 pxFraction = fract(uv * dimensions);
	vec2 offset = halfPx - vec2(0.00001, 0.00001) * max(
			step(abs(pxFraction.x - 0.5), 0.001),
			step(abs(pxFraction.y - 0.5), 0.001)
		);
	vec2 baseUV = uv - offset;
	vec2 diagOffset = vec2(offset.x, -offset.y);
	vec4 minmin = ${lookupFunction}(sampler, baseUV${extraParams});
	vec4 maxmin = ${lookupFunction}(sampler, uv + diagOffset${extraParams});
	vec4 minmax = ${lookupFunction}(sampler, uv - diagOffset${extraParams});
	vec4 maxmax = ${lookupFunction}(sampler, uv + offset${extraParams});
	vec2 t = fract(baseUV * dimensions);
	vec4 yMin = mix(minmin, maxmin, t.x);
	vec4 yMax = mix(minmax, maxmax, t.x);
	return mix(yMin, yMax, t.y);
}\n`;
	}

	shaderSource = `
${ Object.keys(polyfillUniforms).map((key) => `uniform ${polyfillUniforms[key]} ${key};`).join('\n') }

float GPUIO_WRAP_REPEAT_UV_COORD(const float coord) {
	return fract(coord + ceil(abs(coord)));
}
vec2 GPUIO_WRAP_REPEAT_UV(const vec2 uv) {
	return fract(uv + ceil(abs(uv)));
}
// float GPUIO_WRAP_CLAMP_UV_COORD(const float coord, const float halfPx) {
// 	return clamp(coord, halfPx, 1.0 - halfPx);
// }

${ make_GPUIO_TEXTURE_WRAP('') }
#if (__VERSION__ == 300)
${ ['u', 'i'].map(prefix => make_GPUIO_TEXTURE_WRAP(prefix)).join('\n') }
#endif

${ [ null,
	'REPEAT_REPEAT',
	'REPEAT_CLAMP',
	'CLAMP_REPEAT',
].map(wrap => make_GPUIO_BILINEAR_INTERP(wrap)).join('\n') }

${ samplerUniforms.map((uniform, index) => {
return `#ifndef ${SAMPLER2D_CAST_INT}${index}
	${ make_GPUIO_TEXTURE_POLYFILL(index, '') }
#endif`}).join('\n') }
#if (__VERSION__ == 300)
${ ['u', 'i'].map(prefix => {
	return samplerUniforms.map((uniform, index) => {
		return make_GPUIO_TEXTURE_POLYFILL(index, prefix);
	}).join('\n');
}).join('\n') }
#else
	${ samplerUniforms.map((uniform, index) => {
return `#ifdef ${SAMPLER2D_CAST_INT}${index}
	${make_GPUIO_TEXTURE_POLYFILL(index, '', 'ivec4(') }
#endif`}).join('\n') }
#endif

${shaderSource}`;
	return {
		shaderSource,
		samplerUniforms,
	}
}

type T = 'float' | 'vec2' | 'vec3' | 'vec4';
type TI = 'int' | 'ivec2' | 'ivec3' | 'ivec4';
type TU = 'uint' | 'uvec2' | 'uvec3' | 'uvec4';
type TB = 'bool' | 'bvec2' | 'bvec3' | 'bvec4';

function floatTypeForIntType(type: TI | TU): T {
	switch(type) {
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
	throw new Error(`Unknown type ${type}.`);
}

function floatTypeForBoolType(type: TB): T {
	switch(type) {
		case 'bool':
			return 'float';
		case 'bvec2':
			return 'vec2';
		case 'bvec3':
			return 'vec3';
		case 'bvec4':
			return 'vec4';
	}
	throw new Error(`Unknown type ${type}.`);
}

let GLSL1_POLYFILLS: string;
/**
 * Polyfill common functions/operators that GLSL1 lacks.
 * @private
 */
export function GLSL1Polyfills() {
	if (GLSL1_POLYFILLS) return GLSL1_POLYFILLS;

	const abs = (type: TI) => `${type} abs(const ${type} a) { return ${type}(abs(${floatTypeForIntType(type)}(a))); }`;
	const sign = (type: TI) => `${type} sign(const ${type} a) { return ${type}(sign(${floatTypeForIntType(type)}(a))); }`;
	const trunc = (type: T) => `${type} trunc(const ${type} a) { return round(a - fract(a) * sign(a)); }`;
	const round = (type: T) => `${type} round(const ${type} a) { return floor(a + 0.5); }`;
	const roundEven = (type: T) => `${type} roundEven(const ${type} a) { return 2.0 * round(a / 2.0); }`;
	const min = (type1: TI, type2: TI) => `${type1} min(const ${type1} a, const ${type2} b) { return ${type1}(min(${floatTypeForIntType(type1)}(a), ${floatTypeForIntType(type2)}(b))); }`;
	const max = (type1: TI, type2: TI) => `${type1} max(const ${type1} a, const ${type2} b) { return ${type1}(max(${floatTypeForIntType(type1)}(a), ${floatTypeForIntType(type2)}(b))); }`;
	const clamp = (type1: TI, type2: TI) => `${type1} clamp(const ${type1} a, const ${type2} min, const ${type2} max) { return ${type1}(clamp(${floatTypeForIntType(type1)}(a), ${floatTypeForIntType(type2)}(min), ${floatTypeForIntType(type2)}(max))); }`;
	const mix = (type1: T, type2: TB) => `${type1} mix(const ${type1} a, const ${type1} b, const ${type2} c) { return mix(a, b, ${floatTypeForBoolType(type2)}(c)); }`;
	const det2 = (n: number, m: number, size: number) => `a[${n}][${m}] * a[${(n + 1) % size}][${(m + 1) % size}] - a[${(n + 1) % size}][${m}] * a[${n}][${(m + 1) % size}]`;
	// TODO: I don't think these are quite right yet.
	const det3 = (n: number, m: number, size: number) => [0, 1, 2].map(offset => `a[${n}][${(m + offset) % size}] * (${det2((n + 1) % size, (m + 1 + offset) % size, size)})`).join(' + ');
	const det4 = (n: number, m: number, size: number) => [0, 1, 2, 3].map(offset => `a[${n}][${(m + offset) % size}] * (${det3((n + 1) % size, (m + 1 + offset) % size, size)})`).join(' + ');

	// We don't need to create unsigned int polyfills, bc unsigned int is not a supported type in GLSL1.
	// All unsigned int variables will be cast as int and be caught by the signed int polyfills.
	GLSL1_POLYFILLS = `
${abs('int')}
${abs('ivec2')}
${abs('ivec3')}
${abs('ivec4')}

${sign('int')}
${sign('ivec2')}
${sign('ivec3')}
${sign('ivec4')}

${round('float')}
${round('vec2')}
${round('vec3')}
${round('vec4')}

${trunc('float')}
${trunc('vec2')}
${trunc('vec3')}
${trunc('vec4')}

${roundEven('float')}
${roundEven('vec2')}
${roundEven('vec3')}
${roundEven('vec4')}

${min('int', 'int')}
${min('ivec2', 'ivec2')}
${min('ivec3', 'ivec3')}
${min('ivec4', 'ivec4')}
${min('ivec2', 'int')}
${min('ivec3', 'int')}
${min('ivec4', 'int')}

${max('int', 'int')}
${max('ivec2', 'ivec2')}
${max('ivec3', 'ivec3')}
${max('ivec4', 'ivec4')}
${max('ivec2', 'int')}
${max('ivec3', 'int')}
${max('ivec4', 'int')}

${clamp('int', 'int')}
${clamp('ivec2', 'ivec2')}
${clamp('ivec3', 'ivec3')}
${clamp('ivec4', 'ivec4')}
${clamp('ivec2', 'int')}
${clamp('ivec3', 'int')}
${clamp('ivec4', 'int')}

${mix('float', 'bool')}
${mix('vec2', 'bvec2')}
${mix('vec3', 'bvec3')}
${mix('vec4', 'bvec4')}

mat2 outerProduct(const vec2 a, const vec2 b) {
	return mat2(
		a.x * b.x, a.x * b.y,
		a.y * b.x, a.y * b.y
	);
}
mat3 outerProduct(const vec3 a, const vec3 b) {
	return mat3(
		a.x * b.x, a.x * b.y, a.x * b.z,
		a.y * b.x, a.y * b.y, a.y * b.z,
		a.z * b.x, a.z * b.y, a.z * b.z
	);
}
mat4 outerProduct(const vec4 a, const vec4 b) {
	return mat4(
		a.x * b.x, a.x * b.y, a.x * b.z, a.x * b.w,
		a.y * b.x, a.y * b.y, a.y * b.z, a.y * b.w,
		a.z * b.x, a.z * b.y, a.z * b.z, a.z * b.w,
		a.w * b.x, a.w * b.y, a.w * b.z, a.w * b.w
	);
}
mat2 transpose(mat2 a) {
	float temp = a[0][1];
	a[0][1] = a[1][0];
	a[1][0] = temp;
	return a;
}
mat3 transpose(mat3 a) {
	float temp = a[0][2];
	a[0][2] = a[2][0];
	a[2][0] = temp;
	temp = a[0][1];
	a[0][1] = a[1][0];
	a[1][0] = temp;
	temp = a[1][2];
	a[1][2] = a[2][1];
	a[2][1] = temp;
	return a;
}
mat4 transpose(mat4 a) {
	float temp = a[0][3];
	a[0][3] = a[3][0];
	a[3][0] = temp;
	temp = a[0][2];
	a[0][2] = a[2][0];
	a[2][0] = temp;
	temp = a[2][3];
	a[2][3] = a[3][2];
	a[3][2] = temp;
	temp = a[0][1];
	a[0][1] = a[1][0];
	a[1][0] = temp;
	temp = a[1][2];
	a[1][2] = a[2][1];
	a[2][1] = temp;
	temp = a[2][3];
	a[2][3] = a[3][2];
	a[3][2] = temp;
	return a;
}

float determinant(const mat2 a) {
	return ${ det2(0, 0, 2) };
}
float determinant(const mat3 a) {
	return ${ det3(0, 0, 3) };
}
float determinant(const mat4 a) {
	return ${ det4(0, 0, 4) };
}
` + 
// Copied from https://github.com/gpujs/gpu.js/blob/master/src/backend/web-gl/fragment-shader.js
`
float cosh(const float x) {
	return (pow(${Math.E}, x) + pow(${Math.E}, -x)) / 2.0; 
}
float sinh(const float x) {
	return (pow(${Math.E}, x) - pow(${Math.E}, -x)) / 2.0;
}
float tanh(const float x) {
	float e = exp(2.0 * x);
	return (e - 1.0) / (e + 1.0);
}
float asinh(const float x) {
	return log(x + sqrt(x * x + 1.0));
}
float acosh(const float x) {
	return log(x + sqrt(x * x - 1.0));
}
float atanh(float x) {
	x = (x + 1.0) / (x - 1.0);
	return 0.5 * log(x * sign(x));
}`;
	return GLSL1_POLYFILLS;
}

let FRAGMENT_SHADER_POLYFILLS: string;
/**
 * Polyfills to be make available for both GLSL1 and GLSL3fragment shaders.
 * @private
 */
export function fragmentShaderPolyfills() {
	if (FRAGMENT_SHADER_POLYFILLS) return FRAGMENT_SHADER_POLYFILLS;

	const mod = (type1: TI | TU, type2: TI | TU) => `${type1} mod(const ${type1} x, const ${type2} y) { return x - y * (x / y); }`;
	const bitshiftLeft = (type1: TI | TU, type2: TI | TU) => `${type1} bitshiftLeft(const ${type1} a, const ${type2} b) { return a * ${type1}(pow(${floatTypeForIntType(type2)}(2.0), ${floatTypeForIntType(type2)}(b))); }`;
	const bitshiftRight = (type1: TI | TU, type2: TI | TU) => `${type1} bitshiftRight(const ${type1} a, const ${type2} b) { return ${type1}(round(${floatTypeForIntType(type1)}(a) / pow(${floatTypeForIntType(type2)}(2.0), ${floatTypeForIntType(type2)}(b)))); }`;

	// Copied from https://github.com/gpujs/gpu.js/blob/master/src/backend/web-gl/fragment-shader.js
	// Seems like these could be optimized.
	const bitwiseOr = (numBits: 8 | 16 | 32) => {
return `int bitwiseOr${numBits === 32 ? '' : numBits}(int a, int b) {
	int result = 0;
	int n = 1;
	
	for (int i = 0; i < ${numBits}; i++) {
		if ((mod(a, 2) == 1) || (mod(b, 2) == 1)) {
			result += n;
		}
		a = a / 2;
		b = b / 2;
		n = n * 2;
		if(!(a > 0 || b > 0)) {
			break;
		}
	}
	return result;
}`; };
const bitwiseXOR = (numBits: 8 | 16 | 32) => {
return `int bitwiseXOR${numBits === 32 ? '' : numBits}(int a, int b) {
	int result = 0;
	int n = 1;
	
	for (int i = 0; i < ${numBits}; i++) {
		if ((mod(a, 2) == 1) != (mod(b, 2) == 1)) {
			result += n;
		}
		a = a / 2;
		b = b / 2;
		n = n * 2;
		if(!(a > 0 || b > 0)) {
			break;
		}
	}
	return result;
}`; }
	const bitwiseAnd = (numBits: 8 | 16 | 32) => {
return `int bitwiseAnd${numBits === 32 ? '' : numBits}(int a, int b) {
	int result = 0;
	int n = 1;
	for (int i = 0; i < ${numBits}; i++) {
		if ((mod(a, 2) == 1) && (mod(b, 2) == 1)) {
			result += n;
		}
		a = a / 2;
		b = b / 2;
		n = n * 2;
		if(!(a > 0 && b > 0)) {
			break;
		}
	}
	return result;
}`; };
	const bitwiseNot = (numBits: 8 | 16 | 32) => {
return `int bitwiseNot${numBits === 32 ? '' : numBits}(int a) {
	int result = 0;
	int n = 1;

	for (int i = 0; i < ${numBits}; i++) {
		if (mod(a, 2) == 0) {
			result += n;
		}
		a = a / 2;
		n = n * 2;
	}
	return result;
}`; }

	FRAGMENT_SHADER_POLYFILLS = `
${mod('int', 'int')}
${mod('ivec2', 'ivec2')}
${mod('ivec3', 'ivec3')}
${mod('ivec4', 'ivec4')}
${mod('ivec2', 'int')}
${mod('ivec3', 'int')}
${mod('ivec4', 'int')}
#if (__VERSION__ == 300)
${mod('uint', 'uint')}
${mod('uvec2', 'uvec2')}
${mod('uvec3', 'uvec3')}
${mod('uvec4', 'uvec4')}
${mod('uvec2', 'uint')}
${mod('uvec3', 'uint')}
${mod('uvec4', 'uint')}
#endif

${bitshiftLeft('int', 'int')}
${bitshiftLeft('ivec2', 'ivec2')}
${bitshiftLeft('ivec3', 'ivec3')}
${bitshiftLeft('ivec4', 'ivec4')}
${bitshiftLeft('ivec2', 'int')}
${bitshiftLeft('ivec3', 'int')}
${bitshiftLeft('ivec4', 'int')}
#if (__VERSION__ == 300)
${bitshiftLeft('uint', 'uint')}
${bitshiftLeft('uvec2', 'uvec2')}
${bitshiftLeft('uvec3', 'uvec3')}
${bitshiftLeft('uvec4', 'uvec4')}
${bitshiftLeft('uvec2', 'uint')}
${bitshiftLeft('uvec3', 'uint')}
${bitshiftLeft('uvec4', 'uint')}
#endif

${bitshiftRight('int', 'int')}
${bitshiftRight('ivec2', 'ivec2')}
${bitshiftRight('ivec3', 'ivec3')}
${bitshiftRight('ivec4', 'ivec4')}
${bitshiftRight('ivec2', 'int')}
${bitshiftRight('ivec3', 'int')}
${bitshiftRight('ivec4', 'int')}
#if (__VERSION__ == 300)
${bitshiftRight('uint', 'uint')}
${bitshiftRight('uvec2', 'uvec2')}
${bitshiftRight('uvec3', 'uvec3')}
${bitshiftRight('uvec4', 'uvec4')}
${bitshiftRight('uvec2', 'uint')}
${bitshiftRight('uvec3', 'uint')}
${bitshiftRight('uvec4', 'uint')}
#endif

${bitwiseOr(8)}
${bitwiseOr(16)}
${bitwiseOr(32)}

${bitwiseXOR(8)}
${bitwiseXOR(16)}
${bitwiseXOR(32)}

${bitwiseAnd(8)}
${bitwiseAnd(16)}
${bitwiseAnd(32)}

${bitwiseNot(8)}
${bitwiseNot(16)}
${bitwiseNot(32)}

#if (__VERSION__ == 300)
${ [8, 16, ''].map(suffix => {
return `
uint bitwiseOr${suffix}(uint a, uint b) {
	return uint(bitwiseOr${suffix}(int(a), int(b)));
}
uint bitwiseXOR${suffix}(uint a, uint b) {
	return uint(bitwiseXOR${suffix}(int(a), int(b)));
}
uint bitwiseAnd${suffix}(uint a, uint b) {
	return uint(bitwiseAnd${suffix}(int(a), int(b)));
}
uint bitwiseNot${suffix}(uint a) {
	return uint(bitwiseNot${suffix}(int(a)));
}` }).join('\n')}

#endif
`;
	return FRAGMENT_SHADER_POLYFILLS;
}
