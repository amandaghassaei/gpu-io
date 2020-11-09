"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Fragment shader that draws a single color (for testing).
exports.default = "\nprecision highp float;\n\nuniform vec3 u_color;\n\nvoid main() {\n\tgl_FragColor = vec4(u_color, 1);\n}";
//# sourceMappingURL=SingleColorFragShader.js.map