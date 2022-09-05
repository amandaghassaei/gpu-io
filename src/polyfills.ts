import {
	FLOAT,
	INT,
	UniformType,
} from './constants';
import { getSampler2DsInProgram } from './regex';
import { isArray } from './checks';

/**
 * Wrap/filter type to use in polyfill.
 * (0) No polyfills.
 * (1) Filtering is NEAREST and wrap needs polyfill.
 * (2) Wrap is supported, but filtering needs polyfill.
 * (3) Wrap and filtering need polyfill.
 * (4) Filtering is LINEAR and supported, but wrap needs polyfill and filter needs polyfill at boundary.
 */

const SAMPLER2D_WRAP_REPEAT_UNIFORM = 'u_gpuio_wrap_repeat';
/**
 * Wrap type to use in polyfill.
 * (0) CLAMP_TO_EDGE filtering.
 * (1) REPEAT filtering.
 */
const SAMPLER2D_WRAP_UNIFORM = 'u_gpuio_wrap';

/**
 * Filter type to use in polyfill.
 * For now we are not using this, but will be needed if more filters added later.
 * NEAREST is always supported, so we don't need to polyfill.
 * (0) LINEAR filtering.
 * @private
 */
const SAMPLER2D_FILTER_UNIFORM = 'u_gpuio_filter';

/**
 * UV size of half a pixel for this texture.
 * @private
 */
const SAMPLER2D_HALF_PX_UNIFORM = 'u_gpuio_half_px';

/**
 * Dimensions of texture
 * @private
 */
 const SAMPLER2D_DIMENSIONS_UNIFORM = 'u_gpuio_dimensions';

/**
 * Override texture function to perform repeat wrap.
 * Value of u_gpuio_wrap_repeat:
 * (0) No polyfills.
 * (1) GPUIO_TEXTURE_WRAP -> filtering is NEAREST and wrap needs polyfill.
 * (2) GPUIO_TEXTURE_FILTER -> wrap is supported, but filtering needs polyfill.
 * (3) GPUIO_TEXTURE_WRAP_FILTER -> wrap and filtering need polyfill.
 * (4) GPUIO_TEXTURE_WRAP_FILTER_BOUNDARY -> filtering is LINEAR and supported, but wrap needs polyfill and filter needs polyfill at boundary.
 * https://www.codeproject.com/Articles/236394/Bi-Cubic-and-Bi-Linear-Interpolation-with-GLSL
 * @private
 */
export function texturePolyfill(shaderSource: string) {
	const textureCalls = shaderSource.match(/\btexture\(/g);
	if (!textureCalls || textureCalls.length === 0) return shaderSource;
	const samplerUniformNames = getSampler2DsInProgram(shaderSource);
	if (samplerUniformNames.length === 0) return shaderSource;
	samplerUniformNames.forEach((samplerName, i) => {
		const regex = new RegExp(`\\btexture\\(\\s?${samplerName}\\b`, 'gs');
		shaderSource = shaderSource.replace(regex, `GPUIO_TEXTURE_POLYFILL(${samplerName}, ${i}`);
	});
	const remainingTextureCalls = shaderSource.match(/\btexture\(/g);
	if (remainingTextureCalls?.length) {
		console.warn('Fragment shader polyfill has missed some calls to texture().', shaderSource);
	}
	
	// Switch is not actually allowed in GLSL1, so use large if statement.
	let switchStatementFloat = '';
	let switchStatementInt = '';
	let samplerParamsUniforms: {[key: string] : { value: number | [number, number], type: UniformType } } = {};
	for (let i = 0; i < samplerUniformNames.length; i++) {
		samplerParamsUniforms[`${SAMPLER2D_WRAP_REPEAT_UNIFORM}${i}`] = { value: 0, type: INT };
		samplerParamsUniforms[`${SAMPLER2D_WRAP_UNIFORM}${i}`] = { value: [0, 0], type: INT };
		samplerParamsUniforms[`${SAMPLER2D_HALF_PX_UNIFORM}${i}`] = { value: [0, 0], type: FLOAT };
		samplerParamsUniforms[`${SAMPLER2D_DIMENSIONS_UNIFORM}${i}`] = { value: [0, 0], type: FLOAT };
		// samplerUniforms[`${SAMPLER2D_FILTER_UNIFORM}${i}`] = 0;
		switchStatementFloat += `
	${ i > 0 ? 'else ' : ''}if (index == ${i}) {
		if (${SAMPLER2D_WRAP_REPEAT_UNIFORM}${i} == 0) {
			return texture(sampler, uv);
		} else if (${SAMPLER2D_WRAP_REPEAT_UNIFORM}${i} == 1) {
			return GPUIO_TEXTURE_WRAP(sampler, uv, ${SAMPLER2D_WRAP_UNIFORM}${i}, ${SAMPLER2D_HALF_PX_UNIFORM}${i});
		} else if (${SAMPLER2D_WRAP_REPEAT_UNIFORM}${i} == 2) {
			return GPUIO_TEXTURE_FILTER(sampler, uv, ${SAMPLER2D_HALF_PX_UNIFORM}${i}, ${SAMPLER2D_DIMENSIONS_UNIFORM}${i});
		} else if (${SAMPLER2D_WRAP_REPEAT_UNIFORM}${i} == 3) {
			return GPUIO_TEXTURE_WRAP_FILTER(sampler, uv, ${SAMPLER2D_WRAP_UNIFORM}${i}, ${SAMPLER2D_HALF_PX_UNIFORM}${i}, ${SAMPLER2D_DIMENSIONS_UNIFORM}${i});
		} else if (${SAMPLER2D_WRAP_REPEAT_UNIFORM}${i} == 4) {
			return GPUIO_TEXTURE_WRAP_FILTER_BOUNDARY(sampler, uv, ${SAMPLER2D_WRAP_UNIFORM}${i}, ${SAMPLER2D_HALF_PX_UNIFORM}${i}, ${SAMPLER2D_DIMENSIONS_UNIFORM}${i});
		}
	}\n`;
		switchStatementInt += `
	${ i > 0 ? 'else ' : ''}if (index == ${i}) {
		if (${SAMPLER2D_WRAP_REPEAT_UNIFORM}${i} == 0) {
			return texture(sampler, uv);
		} else if (${SAMPLER2D_WRAP_REPEAT_UNIFORM}${i} == 1) {
			return GPUIO_TEXTURE_WRAP(sampler, uv, ${SAMPLER2D_WRAP_UNIFORM}${i}, ${SAMPLER2D_HALF_PX_UNIFORM}${i});
		}
	}\n`;
	}

	return `
${ Object.keys(samplerParamsUniforms).map((key) => {
	const type = isArray(samplerParamsUniforms[key].value) ?
		(samplerParamsUniforms[key].type === FLOAT ? 'vec2' : 'ivec2' ) :
		(samplerParamsUniforms[key].type === FLOAT ? 'float' : 'int' );
	return `uniform ${ type } ${key};`;
}).join('\n') }

float GPUIO_WRAP_UV_COORD(float coord, int wrapType, float halfPx) {
	if (wrapType == 0) {
		if (coord < halfPx) coord = halfPx;
		else if (coord > 1.0 - halfPx) coord = 1.0 - halfPx;
	} else {
		if (coord < 0.0) coord += ceil(abs(coord));
		else if (coord >= 1.0) coord -= floor(coord);
	}
	return coord;
}

vec4 GPUIO_TEXTURE_WRAP(sampler2D sampler, vec2 uv, ivec2 wrapType, vec2 halfPx) {
	float u = GPUIO_WRAP_UV_COORD(uv.x, wrapType.x, halfPx.x);
	float v = GPUIO_WRAP_UV_COORD(uv.y, wrapType.y, halfPx.y);
	return texture(sampler, vec2(u, v));
}
#if (__VERSION__ == 300)
uvec4 GPUIO_TEXTURE_WRAP(usampler2D sampler, vec2 uv, ivec2 wrapType, vec2 halfPx) {
	float u = GPUIO_WRAP_UV_COORD(uv.x, wrapType.x, halfPx.x);
	float v = GPUIO_WRAP_UV_COORD(uv.y, wrapType.y, halfPx.y);
	return texture(sampler, vec2(u, v));
}
ivec4 GPUIO_TEXTURE_WRAP(isampler2D sampler, vec2 uv, ivec2 wrapType, vec2 halfPx) {
	float u = GPUIO_WRAP_UV_COORD(uv.x, wrapType.x, halfPx.x);
	float v = GPUIO_WRAP_UV_COORD(uv.y, wrapType.y, halfPx.y);
	return texture(sampler, vec2(u, v));
}
#endif

vec4 GPUIO_BILINEAR_INTERP(sampler2D sampler, vec2 uv, vec2 halfPx, vec2 dimensions) {
	vec2 baseUV = uv - halfPx;
	vec4 minmin = texture(sampler, baseUV);
	vec4 maxmin = texture(sampler, uv + vec2(halfPx.x, -halfPx.y));
	vec4 minmax = texture(sampler, uv + vec2(-halfPx.x, halfPx.y));
	vec4 maxmax = texture(sampler, uv + halfPx);
	vec2 t = fract(baseUV * dimensions);
	vec4 yMin = mix(minmin, maxmin, t.x);
	vec4 yMax = mix(minmax, maxmax, t.x);
	return mix(yMin, yMax, t.y);
}

vec4 GPUIO_BILINEAR_INTERP_WRAP(sampler2D sampler, vec2 uv, ivec2 wrapType, vec2 halfPx, vec2 dimensions) {
	vec2 baseUV = uv - halfPx;
	vec4 minmin = GPUIO_TEXTURE_WRAP(sampler, baseUV, wrapType, halfPx);
	vec4 maxmin = GPUIO_TEXTURE_WRAP(sampler, uv + vec2(halfPx.x, -halfPx.y), wrapType, halfPx);
	vec4 minmax = GPUIO_TEXTURE_WRAP(sampler, uv + vec2(-halfPx.x, halfPx.y), wrapType, halfPx);
	vec4 maxmax = GPUIO_TEXTURE_WRAP(sampler, uv + halfPx, wrapType, halfPx);
	vec2 t = fract(baseUV * dimensions);
	vec4 yMin = mix(minmin, maxmin, t.x);
	vec4 yMax = mix(minmax, maxmax, t.x);
	return mix(yMin, yMax, t.y);
}

vec4 GPUIO_TEXTURE_FILTER(sampler2D sampler, vec2 uv, vec2 halfPx, vec2 dimensions) {
	return GPUIO_BILINEAR_INTERP(sampler, uv, halfPx, dimensions);
}

vec4 GPUIO_TEXTURE_WRAP_FILTER(sampler2D sampler, vec2 uv, ivec2 wrapType, vec2 halfPx, vec2 dimensions) {
	return GPUIO_BILINEAR_INTERP_WRAP(sampler, uv, wrapType, halfPx, dimensions);
}

vec4 GPUIO_TEXTURE_WRAP_FILTER_BOUNDARY(sampler2D sampler, vec2 uv, ivec2 wrapType, vec2 halfPx, vec2 dimensions) {
	if (uv.x < halfPx.x || 1.0 - uv.x < halfPx.x || uv.y < halfPx.y || 1.0 - uv.y < halfPx.y) {
		return GPUIO_BILINEAR_INTERP_WRAP(sampler, uv, wrapType, halfPx, dimensions);
	}
	return texture(sampler, uv);
}

vec4 GPUIO_TEXTURE_POLYFILL(sampler2D sampler, int index, vec2 uv) {
${switchStatementFloat}
	return texture(sampler, uv);
}
#if (__VERSION__ == 300)
ivec4 GPUIO_TEXTURE_POLYFILL(isampler2D sampler, int index, vec2 uv) {
${switchStatementInt}
	return texture(sampler, uv);
}
uvec4 GPUIO_TEXTURE_POLYFILL(usampler2D sampler, int index, vec2 uv) {
${switchStatementInt}
	return texture(sampler, uv);
}
#endif

${shaderSource}`;
}

