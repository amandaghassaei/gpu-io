import { Vector4 } from './Vector4';

/**
 * The WebGL renderer displays your beautifully crafted scenes using WebGL, if your device supports it.
 * This renderer has way better performance than CanvasRenderer.
 *
 * see {@link https://github.com/mrdoob/three.js/blob/master/src/renderers/WebGLRenderer.js|src/renderers/WebGLRenderer.js}
 */
export type WebGLRenderer = {
    domElement: HTMLCanvasElement;
    /**
     * Copies the viewport into target.
     */
    getViewport(target: Vector4): Vector4;
    /**
     * Return the WebGL context.
     */
    getContext(): WebGLRenderingContext;
    /**
     * Sets the active render target.
     *
     * @param renderTarget The {@link WebGLRenderTarget renderTarget} that needs to be activated. When `null` is given, the canvas is set as the active render target instead.
     * @param activeCubeFace Specifies the active cube side (PX 0, NX 1, PY 2, NY 3, PZ 4, NZ 5) of {@link WebGLCubeRenderTarget}.
     * @param activeMipmapLevel Specifies the active mipmap level.
     */
    setRenderTarget(renderTarget: any | null, activeCubeFace?: number, activeMipmapLevel?: number): void;
    /**
     * Can be used to reset the internal WebGL state.
     */
    resetState(): void;
}
