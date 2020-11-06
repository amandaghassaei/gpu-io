"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Fragment shader that draws a single color (for testing).
exports.default = "\nprecision lowp float;\nuniform vec3 u_color;\nvoid main() {\n\tgl_Position = vec4(u_color, 1);\n}";
//# sourceMappingURL=SingleColorFragShader.js.map