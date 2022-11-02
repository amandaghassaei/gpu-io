import type { GPUComposer } from './GPUComposer';
export declare class GPUIndexBuffer {
    private readonly _composer;
    /**
     * GL buffer.
     */
    readonly buffer: WebGLBuffer;
    /**
     * GL type.
     */
    readonly glType: number;
    /**
     * Index buffer count.
     */
    readonly count: number;
    /**
     * Init a GPUIndexBuffer to use with GPUComposer.drawLayerAsMesh().
     * @param composer - The current GPUComposer instance.
     * @param params - GPUIndexBuffer parameters.
     * @param params.indices - A 1D array containing indexed geometry.  For a mesh, this would be an array of triangle indices.
     * @param params.name - Name of GPUIndexBuffer, used for error logging.
     * @returns
     */
    constructor(composer: GPUComposer, params: {
        indices: number[] | Uint8Array | Uint16Array | Uint32Array;
        name?: string;
    });
    /**
     * Deallocate GPUIndexBuffer instance and associated WebGL properties.
     */
    dispose(): void;
}
