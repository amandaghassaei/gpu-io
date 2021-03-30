declare const _default: "\nprecision highp float;\n\nvarying vec2 v_UV;\nuniform sampler2D u_state;\n\nvoid main() {\n\tgl_FragColor = texture2D(u_state, v_UV);\n}";
export default _default;
