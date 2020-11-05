declare const _default: "\nprecision highp float;\nattribute vec2 position;\nvarying vec2 uv;\nvoid main() {\n\t// Calculate UV coordinates [0, 1] of canvas bounds.\n\tuv = 0.5 * (position + 1.0);\n\n\tgl_Position = vec4(position, 0, 1);\n}\n";
export default _default;
