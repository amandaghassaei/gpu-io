import {
	GPUIO_FLOAT_PRECISION,
	GPUIO_INT_PRECISION,
	PRECISION_LOW_P,
	PRECISION_MEDIUM_P,
} from '../../constants';
import { intForPrecision } from '../../conversions';

// These precision definitions are applied to all vertex and fragment shaders.
// Default to highp, but fallback to mediump if highp not available.
// These defaults can be set in GPUComposer constructor as intPrecision and floatPrecision parameters.
// https://webglfundamentals.org/webgl/lessons/webgl-precision-issues.html
export const PRECISION_SOURCE = `
#if (${GPUIO_INT_PRECISION} == ${intForPrecision(PRECISION_LOW_P)})
	precision lowp int;
	#if (__VERSION__ == 300)
		precision lowp isampler2D;
		precision lowp usampler2D;
	#endif
#elif (${GPUIO_INT_PRECISION} == ${intForPrecision(PRECISION_MEDIUM_P)})
	precision mediump int;
	#if (__VERSION__ == 300)
		precision mediump isampler2D;
		precision mediump usampler2D;
	#endif
#else 
	#ifdef GL_FRAGMENT_PRECISION_HIGH
		precision highp int;
		#if (__VERSION__ == 300)
			precision highp isampler2D;
			precision highp usampler2D;
		#endif
	#else
		precision mediump int;
		#if (__VERSION__ == 300)
			precision mediump isampler2D;
			precision mediump usampler2D;
		#endif
	#endif
#endif
#if (${GPUIO_FLOAT_PRECISION} == ${intForPrecision(PRECISION_LOW_P)})
	precision lowp float;
	precision lowp sampler2D;
#elif (${GPUIO_FLOAT_PRECISION} == ${intForPrecision(PRECISION_MEDIUM_P)})
	precision mediump float;
	precision mediump sampler2D;
#else
	#ifdef GL_FRAGMENT_PRECISION_HIGH
		precision highp float;
		precision highp sampler2D;
	#else
		precision mediump float;
		precision mediump sampler2D;
	#endif
#endif
`;