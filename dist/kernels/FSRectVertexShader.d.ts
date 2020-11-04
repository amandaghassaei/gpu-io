declare const _default: "\nprecision highp float;\nattribute vec2 position;\nvarying vec2 uv;\nvoid main() {\n\tuv = 0.5 * (position + 1.0);\n\tgl_Position = vec4(position, 0, 1);\n}\n";
export default _default;
