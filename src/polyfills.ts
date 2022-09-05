import {
	GLSL3,
	GLSLVersion,
} from './constants';

/**
 * @private
 */
const PX_SIZE_UNIFORM = 'io_pxSize';

/**
 * Override texture function to perform repeat wrap.
 * @private
 */
export function texturePolyfill(params:
	{
		wrapRepeat: boolean,
		filterLinear: boolean,
		filterLinearBoundary: boolean,
		glslVersion: GLSLVersion,
	},
) {
	return `
${ params.wrapRepeat &&
`vec2 GPUIO_WRAP_UV(vec2 uv) {
	if (uv.x < 0.0) uv.x += ceil(abs(uv.x));
	else if (uv.x > 1.0) uv.x -= floor(uv.x);
	if (uv.y < 0.0) uv.y += ceil(abs(uv.y));
	else if (uv.y > 1.0) uv.y -= floor(uv.y);
	return uv;
}`}
${ (params.filterLinear || params.filterLinearBoundary) && 
`vec4 GPUIO_BILINEAR_INTERP(sampler2D sampler, vec2 uv) {
	return texture(sampler, uv);
}`}
${ params.glslVersion === GLSL3 &&
`uvec4 GPUIO_texture(usampler2D sampler, vec2 uv) {
${ params.wrapRepeat &&
`	uv = GPUIO_WRAP_UV(vec2(uv));`}
	return texture(sampler, uv);
}`}
${ params.glslVersion === GLSL3 &&
`ivec4 GPUIO_texture(isampler2D sampler, vec2 uv) {
${ params.wrapRepeat &&
`	uv = GPUIO_WRAP_UV(vec2(uv));`}
	return texture(sampler, uv);
}`}
vec4 GPUIO_texture(sampler2D sampler, vec2 uv) {
${ params.wrapRepeat &&
`	uv = GPUIO_WRAP_UV(vec2(uv));`}
${ params.filterLinear &&
`	return GPUIO_BILINEAR_INTERP(sampler, uv);`}
${ params.filterLinearBoundary &&
`	vec2 half_pxSize = ${PX_SIZE_UNIFORM} / 2.0;
	if (uv.x < half_pxSize.x || 1.0 - uv.x < half_pxSize.x || uv.y < half_pxSize.y || 1.0 - uv.y < half_pxSize.y) {
		return GPUIO_BILINEAR_INTERP(sampler, uv);
	}`}
${ !params.filterLinear &&
`	return texture(sampler, uv);`}
}\n`;
}

