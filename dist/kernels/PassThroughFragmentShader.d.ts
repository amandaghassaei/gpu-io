declare const _default: "\nprecision highp float;\n\nvarying vec2 vUV;\nuniform sampler2D u_state;\n\nvoid main() {\n\tgl_FragColor = texture2D(u_state, vUV);\n}";
export default _default;
