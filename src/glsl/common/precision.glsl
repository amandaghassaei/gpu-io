// These precision definitions are applied to all internal
// vertex and fragment shaders in this library.
// Default to highp, but fallbak to mediump.
// https://webglfundamentals.org/webgl/lessons/webgl-precision-issues.html
#ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
  precision highp int;
#else
  precision mediump float;
  precision mediump int;
#endif
precision lowp sampler2D;
// TODO: use an ifdef here.
precision lowp isampler2D;
precision lowp usampler2D;