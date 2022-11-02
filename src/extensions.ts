import type { GPUComposer } from './GPUComposer';

// https://developer.mozilla.org/en-US/docs/Web/API/OES_texture_float
// Float is provided by default in WebGL2 contexts.
// This extension implicitly enables the WEBGL_color_buffer_float extension (if supported), which allows rendering to 32-bit floating-point color buffers.
export const OES_TEXTURE_FLOAT = 'OES_texture_float';
// https://developer.mozilla.org/en-US/docs/Web/API/OES_texture_half_float
// Half float is supported by modern mobile browsers, float not yet supported.
// Half float is provided by default for Webgl2 contexts.
// This extension implicitly enables the EXT_color_buffer_half_float extension (if supported), which allows rendering to 16-bit floating point formats.
export const OES_TEXTURE_HALF_FLOAT = 'OES_texture_half_float';
// https://www.khronos.org/registry/OpenGL/extensions/OES/OES_texture_float_linear.txt
export const OES_TEXTURE_FLOAT_LINEAR = 'OES_texture_float_linear';
export const OES_TEXTURE_HAlF_FLOAT_LINEAR = 'OES_texture_half_float_linear';
// https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_depth_texture
// Adds gl.UNSIGNED_SHORT, gl.UNSIGNED_INT types to textImage2D in WebGL1.0
export const WEBGL_DEPTH_TEXTURE = 'WEBGL_depth_texture';
// EXT_COLOR_BUFFER_FLOAT adds ability to render to a variety of floating pt textures.
// This is needed for the WebGL2 contexts that do not support OES_TEXTURE_FLOAT / OES_TEXTURE_HALF_FLOAT extensions.
// https://developer.mozilla.org/en-US/docs/Web/API/EXT_color_buffer_float
// https://stackoverflow.com/questions/34262493/framebuffer-incomplete-attachment-for-texture-with-internal-format
// https://stackoverflow.com/questions/36109347/framebuffer-incomplete-attachment-only-happens-on-android-w-firefox
export const EXT_COLOR_BUFFER_FLOAT = 'EXT_color_buffer_float';
// On WebGL 2, EXT_COLOR_BUFFER_HALF_FLOAT is an alternative to using the EXT_color_buffer_float extension on platforms
// that support 16-bit floating point render targets but not 32-bit floating point render targets.
export const EXT_COLOR_BUFFER_HALF_FLOAT = 'EXT_color_buffer_half_float';
// Vertex array extension is used by threejs.
export const OES_VERTEX_ARRAY_OBJECT = 'OES_vertex_array_object';
// Extension to use int32 for indexed geometry for WebGL1.
// According to WebGLStats nearly all devices support this extension.
// Fallback to gl.UNSIGNED_SHORT if not available.
export const OES_ELEMENT_INDEX_UINT = 'OES_element_index_uint';
// Derivatives extensions.
export const OES_STANDARD_DERIVATIVES = 'OES_standard_derivatives';

export function getExtension(
	composer: GPUComposer,
	extensionName: string,
	optional = false,
) {
	// Check if we've already loaded the extension.
	if (composer._extensions[extensionName] !== undefined) return composer._extensions[extensionName];

	const { gl, _errorCallback, _extensions, verboseLogging } = composer;
	let extension;
	try {
		extension = gl.getExtension(extensionName);
	} catch (e) {}
	if (extension) {
		// Cache this extension.
		_extensions[extensionName] = extension;
		if (composer.verboseLogging) console.log(`Loaded extension: ${extensionName}.`);
	} else {
		_extensions[extensionName] = false; // Cache the bad extension lookup.
		if (composer.verboseLogging) console.log(`Unsupported ${optional ? 'optional ' : ''}extension: ${extensionName}.`);
	}
	// If the extension is not optional, throw error.
	if (!extension && !optional) {
		_errorCallback(`Required extension unsupported by this device / browser: ${extensionName}.`);
	}
	return extension;
}