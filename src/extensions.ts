const extensions: { [key: string]: any } = {};

// https://developer.mozilla.org/en-US/docs/Web/API/OES_texture_float
// Float is provided by default in WebGL2 contexts.
// This extension implicitly enables the WEBGL_color_buffer_float extension (if supported), which allows rendering to 32-bit floating-point color buffers.
export const OES_TEXTURE_FLOAT = 'OES_texture_float';
// https://developer.mozilla.org/en-US/docs/Web/API/OES_texture_half_float
// Half float is supported by modern mobile browsers, float not yet supported.
// Half float is provided by default for Webgl2 contexts.
// This extension implicitly enables the EXT_color_buffer_half_float extension (if supported), which allows rendering to 16-bit floating point formats.
export const OES_TEXTURE_HALF_FLOAT = 'OES_texture_half_float';
// TODO: Seems like linear filtering of floats is supported in many browsers without these extensions.
// https://www.khronos.org/registry/OpenGL/extensions/OES/OES_texture_float_linear.txt
export const OES_TEXTURE_FLOAT_LINEAR = 'OES_texture_float_linear';
export const OES_TEXTURE_HAlF_FLOAT_LINEAR = 'OES_texture_half_float_linear';
// EXT_COLOR_BUFFER_FLOAT adds ability to render to a variety of floating pt textures.
// This is needed for the WebGL2 contexts that do not support OES_TEXTURE_FLOAT / OES_TEXTURE_HALF_FLOAT extensions.
// https://developer.mozilla.org/en-US/docs/Web/API/EXT_color_buffer_float
// https://stackoverflow.com/questions/34262493/framebuffer-incomplete-attachment-for-texture-with-internal-format
// https://stackoverflow.com/questions/36109347/framebuffer-incomplete-attachment-only-happens-on-android-w-firefox
export const EXT_COLOR_BUFFER_FLOAT = 'EXT_color_buffer_float';

export function getExtension(
	gl: WebGLRenderingContext | WebGL2RenderingContext,
	extensionName: string,
	errorCallback: (message: string) => void,
	optional = false,
) {
	// Check if we've already loaded the extension.
	if (extensions[extensionName]) return extensions[extensionName];

	let extension;
	try {
		extension = gl.getExtension(extensionName);
	} catch (e) {}
	if (extension) {
		// Cache this extension.
		extensions[extensionName] = extension;
		console.log(`Loaded extension: ${extensionName}.`);
	} else {
		console.warn(`Unsupported ${optional ? 'optional ' : ''}extension: ${extensionName}.`);
	}
	// If the extension is not optional, throw error.
	if (!extension && !optional) {
		errorCallback(`Required extension unsupported by this device / browser: ${extensionName}.`);
	}
	return extension;
}