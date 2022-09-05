import { GLSLVersion } from './constants';
/**
 * Override texture function to perform repeat wrap.
 * @private
 */
export declare function texturePolyfill(params: {
    wrapRepeat: boolean;
    filterLinear: boolean;
    filterLinearBoundary: boolean;
    glslVersion: GLSLVersion;
}): string;
