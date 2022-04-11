import { inDevMode, isWebGL2Supported } from './utils';
import { WebGLCompute } from './WebGLCompute';

if (inDevMode()) {
	console.log('Running in development mode.');
}

export * from './Constants';
export {
	WebGLCompute,
	isWebGL2Supported,
};