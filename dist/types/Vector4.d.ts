/**
 * These are the parts of threejs Vector4 that we need.
 * Used internally.
 * @private
 */
export declare class Vector4 {
    x: number;
    y: number;
    z: number;
    w: number;
    constructor(x?: number, y?: number, z?: number, w?: number);
    get width(): number;
    get height(): number;
    copy(v: Vector4): this;
}
