// These precision definitions are applied to all vertex and fragment shaders.
// Default to highp, but fallback to mediump if highp not available.
// These defaults can be set in GPUComposer constructor as intPrecision and floatPrecision parameters.
// https://webglfundamentals.org/webgl/lessons/webgl-precision-issues.html
#if (WEBGLCOMPUTE_INT_PRECISION == 2)
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
#if (WEBGLCOMPUTE_INT_PRECISION == 1)
	precision mediump int;
	#if (__VERSION__ == 300)
		precision mediump isampler2D;
		precision mediump usampler2D;
	#endif
#endif
#if (WEBGLCOMPUTE_INT_PRECISION == 0)
	precision lowp int;
	#if (__VERSION__ == 300)
		precision lowp isampler2D;
		precision lowp usampler2D;
	#endif
#endif
#if (WEBGLCOMPUTE_FLOAT_PRECISION == 2)
	#ifdef GL_FRAGMENT_PRECISION_HIGH
		precision highp float;
		precision highp sampler2D;
	#else
		precision mediump float;
		precision mediump sampler2D;
	#endif
#endif
#if (WEBGLCOMPUTE_FLOAT_PRECISION == 1)
	precision mediump float;
	precision mediump sampler2D;
#endif
#if (WEBGLCOMPUTE_FLOAT_PRECISION == 0)
	precision lowp float;
	precision lowp sampler2D;
#endif