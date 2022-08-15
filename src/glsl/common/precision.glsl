// These precision definitions are applied to all vertex and fragment shaders.
// Default to highp, but fallback to mediump if highp not available.
// These defaults can be set in GPUComposer constructor as intPrecision and floatPrecision parameters.
// https://webglfundamentals.org/webgl/lessons/webgl-precision-issues.html
#if (WEBGLCOMPUTE_INT_PRECISION == 2)
	#ifdef GL_FRAGMENT_PRECISION_HIGH
		precision highp int;
	#else
		precision mediump int;
	#endif
#endif
#if (WEBGLCOMPUTE_INT_PRECISION == 1)
	precision mediump int;
#endif
#if (WEBGLCOMPUTE_INT_PRECISION == 0)
	precision lowp int;
#endif
#if (WEBGLCOMPUTE_FLOAT_PRECISION == 2)
	#ifdef GL_FRAGMENT_PRECISION_HIGH
		precision highp float;
	#else
		precision mediump float;
	#endif
#endif
#if (WEBGLCOMPUTE_FLOAT_PRECISION == 1)
	precision mediump float;
#endif
#if (WEBGLCOMPUTE_FLOAT_PRECISION == 0)
	precision lowp float;
#endif
precision lowp sampler2D;
#if (__VERSION__ == 300)
	precision lowp isampler2D;
	precision lowp usampler2D;
#endif