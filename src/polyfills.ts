import { getSampler2DsInProgram } from './regex';

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
	let polyfillDefines: {[key: string] : string } = {};
	for (let i = 0; i < samplerUniforms.length; i++) {
		// Init uniforms with a type.
		polyfillUniforms[`${SAMPLER2D_HALF_PX_UNIFORM}${i}`] = 'vec2';
		polyfillUniforms[`${SAMPLER2D_DIMENSIONS_UNIFORM}${i}`] = 'vec2';
		// Init defines with a starting value.
		polyfillDefines[`${SAMPLER2D_WRAP_X}${i}`] = '0';
		polyfillDefines[`${SAMPLER2D_WRAP_Y}${i}`] = '0';
		polyfillDefines[`${SAMPLER2D_FILTER}${i}`] = '0';
	}

	function make_GPUIO_TEXTURE_POLYFILL(i: number, prefix: string) {
		return `
${prefix}vec4 GPUIO_TEXTURE_POLYFILL${i}(const ${prefix}sampler2D sampler, const vec2 uv) {
	${ prefix === '' ? `#if (${SAMPLER2D_FILTER}${i} == 0)` : ''}
		#if (${SAMPLER2D_WRAP_X}${i} == 0)
			#if (${SAMPLER2D_WRAP_Y}${i} == 0)
				return texture(sampler, uv);
			#else
				return GPUIO_TEXTURE_WRAP_CLAMP_REPEAT(sampler, uv, ${SAMPLER2D_HALF_PX_UNIFORM}${i});
			#endif
		#else
			#if (${SAMPLER2D_WRAP_Y}${i} == 0)
				return GPUIO_TEXTURE_WRAP_REPEAT_CLAMP(sampler, uv, ${SAMPLER2D_HALF_PX_UNIFORM}${i});
			#else
				return GPUIO_TEXTURE_WRAP_REPEAT_REPEAT(sampler, uv, ${SAMPLER2D_HALF_PX_UNIFORM}${i});
			#endif
		#endif
	${ prefix === '' ? `#else
		#if (${SAMPLER2D_WRAP_X}${i} == 0)
			#if (${SAMPLER2D_WRAP_Y}${i} == 0)
				return GPUIO_TEXTURE_BILINEAR_INTERP(sampler, uv, ${SAMPLER2D_HALF_PX_UNIFORM}${i}, ${SAMPLER2D_DIMENSIONS_UNIFORM}${i});
			#else
				return GPUIO_TEXTURE_BILINEAR_INTERP_WRAP_CLAMP_REPEAT(sampler, uv, ${SAMPLER2D_HALF_PX_UNIFORM}${i}, ${SAMPLER2D_DIMENSIONS_UNIFORM}${i});
			#endif
		#else
			#if (${SAMPLER2D_WRAP_Y}${i} == 0)
				return GPUIO_TEXTURE_BILINEAR_INTERP_WRAP_REPEAT_CLAMP(sampler, uv, ${SAMPLER2D_HALF_PX_UNIFORM}${i}, ${SAMPLER2D_DIMENSIONS_UNIFORM}${i});
			#else
				return GPUIO_TEXTURE_BILINEAR_INTERP_WRAP_REPEAT_REPEAT(sampler, uv, ${SAMPLER2D_HALF_PX_UNIFORM}${i}, ${SAMPLER2D_DIMENSIONS_UNIFORM}${i});
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
	return make_GPUIO_TEXTURE_POLYFILL(index, '');
}).join('\n') }
#if (__VERSION__ == 300)
${ ['u', 'i'].map(prefix => {
	return samplerUniforms.map((uniform, index) => {
		return make_GPUIO_TEXTURE_POLYFILL(index, prefix);
	}).join('\n');
}).join('\n') }
#endif

${shaderSource}`;
	return {
		shaderSource,
		samplerUniforms,
	}
}

let GLSL1_POLYFILLS: string;
/**
 * Polyfill all common functions/operators that GLSL1 lacks.
 * @private
 */
export function GLSL1Polyfills() {
	if (GLSL1_POLYFILLS) return GLSL1_POLYFILLS;
	type T = 'float' | 'vec2' | 'vec3' | 'vec4';
	type TI = 'int' | 'ivec2' | 'ivec3' | 'ivec4';
	type TB = 'bool' | 'bvec2' | 'bvec3' | 'bvec4';

	function floatTypeForIntType(type: TI): T {
		switch(type) {
			case 'int':
				return 'float';
			case 'ivec2':
				return 'vec2';
			case 'ivec3':
				return 'vec3';
			case 'ivec4':
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

	const abs = (type: TI) => `${type} abs(const ${type} a) { return ${type}(abs(${floatTypeForIntType(type)}(a))); }`;
	const sign = (type: TI) => `${type} sign(const ${type} a) { return ${type}(sign(${floatTypeForIntType(type)}(a))); }`;
	const round = (type: T) => `${type} round(const ${type} a) { return floor(a + 0.5); }`;
	const trunc = (type: T) => `${type} trunc(const ${type} a) { return round(a - fract(a) * sign(a)); }`;
	const roundEven = (type: T) => `${type} roundEven(const ${type} a) { return 2.0 * round(a / 2.0); }`;
	const min = (type1: TI, type2: TI) => `${type1} min(const ${type1} a, const ${type2} b) { return ${type1}(min(${floatTypeForIntType(type1)}(a), ${floatTypeForIntType(type2)}(b))); }`;
	const max = (type1: TI, type2: TI) => `${type1} max(const ${type1} a, const ${type2} b) { return ${type1}(max(${floatTypeForIntType(type1)}(a), ${floatTypeForIntType(type2)}(b))); }`;
	const clamp = (type1: TI, type2: TI) => `${type1} clamp(const ${type1} a, const ${type2} min, const ${type2} max) { return ${type1}(clamp(${floatTypeForIntType(type1)}(a), ${floatTypeForIntType(type2)}(min), ${floatTypeForIntType(type2)}(max))); }`;
	const mix = (type1: T, type2: TB) => `${type1} mix(const ${type1} a, const ${type1} b, const ${type2} c) { return mix(a, b, ${floatTypeForBoolType(type2)}(c)); }`;

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
`;
	return GLSL1_POLYFILLS;
}

let FRAGMENT_SHADER_POLYFILLS: string;
/**
 * Polyfills to be make available for both GLSL1 and GLSL3fragment shaders.
 * @private
 */
export function fragmentShaderPolyfills() {
	if (FRAGMENT_SHADER_POLYFILLS) return FRAGMENT_SHADER_POLYFILLS;
	FRAGMENT_SHADER_POLYFILLS = `
`;
	return FRAGMENT_SHADER_POLYFILLS;
}
