"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Vertex shader for fullscreen rect.
exports.default = "\nprecision highp float;\nattribute vec2 position;\nvarying vec2 uv;\nvoid main() {\n\tuv = 0.5 * (position + 1.0);\n\tgl_Position = vec4(position, 0, 1);\n}\n";
//# sourceMappingURL=FSRectVertexShader.js.map