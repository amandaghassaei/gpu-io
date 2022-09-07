import {
	CLAMP_TO_EDGE,
	GPULayerFilter,
	GPULayerWrap,
	NEAREST,
} from './constants';
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

// function wrapEnum(wrap: GPULayerWrap) {
// 	if (wrap === CLAMP_TO_EDGE) return '0';
// 	return '1'; // REPEAT.
// }

// function filterEnum(filter: GPULayerFilter) {
// 	if (filter === NEAREST) return '0';
// 	return '1'; // LINEAR.
// }

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
		const regex = new RegExp(`\\btexture\\(\\s?${name}\\b`, 'gs');
		shaderSource = shaderSource.replace(regex, `GPUIO_TEXTURE_POLYFILL${i}(${name}`);
	});
	const remainingTextureCalls = shaderSource.match(/\btexture\(/g);
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
${prefix}vec4 GPUIO_TEXTURE_POLYFILL${i}(const ${prefix}sampler2D sampler, vec2 uv) {
	#if (${SAMPLER2D_FILTER}${i} == 0)
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
	#else
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
	#endif
}\n`;
	}

	function make_GPUIO_TEXTURE_WRAP(prefix: string) {
		return `
${prefix}vec4 GPUIO_TEXTURE_WRAP_REPEAT_REPEAT(const ${prefix}sampler2D sampler, vec2 uv, const vec2 halfPx) {
	float u = GPUIO_WRAP_REPEAT_UV_COORD(uv.x);
	float v = GPUIO_WRAP_REPEAT_UV_COORD(uv.y);
	return texture(sampler, vec2(u, v));
}
${prefix}vec4 GPUIO_TEXTURE_WRAP_REPEAT_CLAMP(const ${prefix}sampler2D sampler, vec2 uv, const vec2 halfPx) {
	float u = GPUIO_WRAP_REPEAT_UV_COORD(uv.x);
	float v = GPUIO_WRAP_CLAMP_UV_COORD(uv.y, halfPx.y);
	return texture(sampler, vec2(u, v));
}
${prefix}vec4 GPUIO_TEXTURE_WRAP_CLAMP_REPEAT(const ${prefix}sampler2D sampler, vec2 uv, const vec2 halfPx) {
	float u = GPUIO_WRAP_CLAMP_UV_COORD(uv.x, halfPx.x);
	float v = GPUIO_WRAP_REPEAT_UV_COORD(uv.y);
	return texture(sampler, vec2(u, v));
}\n`;
	}

	function make_GPUIO_BILINEAR_INTERP(
		wrapType: string | null ) {
		const lookupFunction = wrapType ? `GPUIO_TEXTURE_WRAP_${wrapType}` : 'texture';
		const extraParams =  wrapType ? `, halfPx` : '';
		return`
vec4 GPUIO_TEXTURE_BILINEAR_INTERP${ wrapType ? `_WRAP_${wrapType}` : '' }(const sampler2D sampler, vec2 uv, const vec2 halfPx, const vec2 dimensions) {
	vec2 offset = halfPx;
	vec2 imagePosCenterity = fract(uv * dimensions);
	if (abs(imagePosCenterity.x - 0.5) < 0.001 || abs(imagePosCenterity.y - 0.5) < 0.001) {
		offset -= vec2(0.00001, 0.00001);
	}
	vec4 minmin = ${lookupFunction}(sampler, uv - offset${extraParams});
	vec4 maxmin = ${lookupFunction}(sampler, uv + vec2(offset.x, -offset.y)${extraParams});
	vec4 minmax = ${lookupFunction}(sampler, uv + vec2(-offset.x, offset.y)${extraParams});
	vec4 maxmax = ${lookupFunction}(sampler, uv + offset${extraParams});
	vec2 t = fract((uv - offset) * dimensions);
	vec4 yMin = mix(minmin, maxmin, t.x);
	vec4 yMax = mix(minmax, maxmax, t.x);
	return mix(yMin, yMax, t.y);
}\n`;
	}

	shaderSource = `
${ Object.keys(polyfillUniforms).map((key) => `uniform ${polyfillUniforms[key]} ${key};`).join('\n') }

float GPUIO_WRAP_REPEAT_UV_COORD(float coord) {
	return fract(coord + ceil(abs(coord)));
}
float GPUIO_WRAP_CLAMP_UV_COORD(float coord, const float halfPx) {
	return max(halfPx, min(1.0 - halfPx, coord));
}

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

