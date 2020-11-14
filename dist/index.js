"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileShader = exports.SingleColorFragShader = exports.GPGPU = void 0;
var GPGPU_1 = require("./GPGPU");
Object.defineProperty(exports, "GPGPU", { enumerable: true, get: function () { return GPGPU_1.GPGPU; } });
var SingleColorFragShader_1 = require("./kernels/SingleColorFragShader");
exports.SingleColorFragShader = SingleColorFragShader_1.default;
var utils_1 = require("./utils");
Object.defineProperty(exports, "compileShader", { enumerable: true, get: function () { return utils_1.compileShader; } });
//# sourceMappingURL=index.js.map