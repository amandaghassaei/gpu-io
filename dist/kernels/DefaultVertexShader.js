"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Vertex shader for fullscreen quad.
exports.default = "\nprecision mediump float;\nattribute vec2 aPosition;\nvarying vec2 uv;\nvoid main() {\n\t// Calculate UV coordinates [0, 1] of canvas bounds.\n\tuv = 0.5 * (aPosition + 1.0);\n\t// Calculate vertex position.\n\tgl_Position = vec4(aPosition, 0, 1);\n}\n";
//# sourceMappingURL=DefaultVertexShader.js.map