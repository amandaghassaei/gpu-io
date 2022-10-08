import type { GPUComposer } from './GPUComposer';
import type { GPULayer } from './GPULayer';

// Cache framebuffers to minimize invalidating FBO attachment bindings:
// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices#avoid_invalidating_fbo_attachment_bindings
const framebufferMap: WeakMap<WebGLTexture | WebGLTexture[], WebGLFramebuffer> = new WeakMap();
const allTextureFramebuffersMap: WeakMap<WebGLTexture, WebGLFramebuffer[]> = new WeakMap();

function initFrameBuffer(
	composer: GPUComposer,
	layer0: GPULayer,
	texture0: WebGLTexture,
	additionalTextures?: WebGLTexture[],
) {
	const { gl, _errorCallback, isWebGL2 } = composer;
	// Init a framebuffer for this texture so we can write to it.
	const framebuffer = gl.createFramebuffer();
	if (!framebuffer) {
		_errorCallback(`Could not init framebuffer for GPULayer "${layer0.name}": ${gl.getError()}.`);
		return;
	}
	gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
	// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/framebufferTexture2D
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture0, 0);
	if (additionalTextures) {
		// Check if length additional textures exceeds a max.
		if (!isWebGL2) {
			throw new Error('WebGL1 does not support drawing to multiple outputs.');
		}
		if (additionalTextures.length > 15) {
			throw new Error(`Can't draw to more than 16 outputs.`);
		}
		for (let i = 0, numTextures = additionalTextures.length; i < numTextures; i++) {
			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i + 1, gl.TEXTURE_2D, additionalTextures[i], 0);
		}
	}

	const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
	if(status !== gl.FRAMEBUFFER_COMPLETE){
		_errorCallback(`Invalid status for framebuffer for GPULayer "${layer0.name}": ${status}.`);
	}

	return framebuffer;
}

/**
 * Bind framebuffer for write operation.
 * @private
 */
export function bindFrameBuffer(
	composer: GPUComposer,
	layer0: GPULayer,
	texture0: WebGLTexture,
	additionalTextures?: WebGLTexture[],
) {
	const { gl } = composer;
	const key = additionalTextures ? [texture0, ...additionalTextures] : texture0;
	let framebuffer = framebufferMap.get(key);
	if (!framebuffer) {
		framebuffer = initFrameBuffer(composer, layer0, texture0, additionalTextures);
		if (!framebuffer) return;
		framebufferMap.set(key, framebuffer);
		const allFramebuffers = allTextureFramebuffersMap.get(texture0) || [];
		allFramebuffers.push(framebuffer);
		allTextureFramebuffersMap.set(texture0, allFramebuffers);
		if (additionalTextures) {
			for (let i = 0, numTextures = additionalTextures.length; i < numTextures; i++) {
				const texture = additionalTextures[i];
				const allFramebuffers = allTextureFramebuffersMap.get(texture) || [];
				allFramebuffers.push(framebuffer);
				allTextureFramebuffersMap.set(texture, allFramebuffers);
			}
		}
	}
	gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
}

/**
 * Delete framebuffers when no longer needed.
 * @private
 */
export function disposeFramebuffers(gl: WebGLRenderingContext | WebGL2RenderingContext, texture: WebGLTexture) {
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	// Delete all framebuffers associated with this texture.
	const allFramebuffers = allTextureFramebuffersMap.get(texture);
	if (allFramebuffers) {
		for (let i = 0, numFramebuffers = allFramebuffers.length; i < numFramebuffers; i++) {
			gl.deleteFramebuffer(allFramebuffers[i]);
		}
	}
	allTextureFramebuffersMap.delete(texture);
}