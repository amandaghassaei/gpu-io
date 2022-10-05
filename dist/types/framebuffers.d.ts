import type { GPUComposer } from './GPUComposer';
import type { GPULayer } from './GPULayer';
/**
 * Bind framebuffer for write operation.
 * @private
 */
export declare function bindFrameBuffer(composer: GPUComposer, layer0: GPULayer, texture0: WebGLTexture, additionalTextures?: WebGLTexture[]): void;
/**
 * Delete framebuffers when no longer needed.
 * @private
 */
export declare function disposeFramebuffers(gl: WebGLRenderingContext | WebGL2RenderingContext, texture: WebGLTexture): void;
