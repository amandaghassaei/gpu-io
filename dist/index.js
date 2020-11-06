"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingleColorShaderSource = exports.GPGPU = void 0;
var GPGPU_1 = require("./GPGPU");
Object.defineProperty(exports, "GPGPU", { enumerable: true, get: function () { return GPGPU_1.GPGPU; } });
var SingleColorShader_1 = require("./kernels/SingleColorShader");
exports.SingleColorShaderSource = SingleColorShader_1.default;
//# sourceMappingURL=index.js.map