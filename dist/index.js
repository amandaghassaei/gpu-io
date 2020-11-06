"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingleColorFragShader = exports.GPGPU = void 0;
var GPGPU_1 = require("./GPGPU");
Object.defineProperty(exports, "GPGPU", { enumerable: true, get: function () { return GPGPU_1.GPGPU; } });
var SingleColorFragShader_1 = require("./kernels/SingleColorFragShader");
exports.SingleColorFragShader = SingleColorFragShader_1.default;
//# sourceMappingURL=index.js.map