"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Vertex shader for fullscreen quad.
exports.default = "\nprecision highp float;\nattribute vec2 aPosition;\nuniform vec2 u_scale;\nuniform vec2 u_translation;\nvarying vec2 uv;\nvoid main() {\n\t// Calculate UV coordinates [0, 1].\n\tuv = 0.5 * (aPosition + 1.0);\n\t// Apply transformations.\n\tvec2 position = u_scale * aPosition + u_translation;\n\t// Calculate vertex position.\n\tgl_Position = vec4(position, 0, 1);\n}\n";
//# sourceMappingURL=DefaultVertexShader.js.map