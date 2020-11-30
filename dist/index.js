"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassThroughFragmentShader = exports.PointsVertexShaderWithDisplacement = exports.PointsVertexShader = exports.SingleColorFragShader = exports.GLCompute = void 0;
var GLCompute_1 = require("./GLCompute");
Object.defineProperty(exports, "GLCompute", { enumerable: true, get: function () { return GLCompute_1.GLCompute; } });
var SingleColorFragShader_1 = require("./kernels/SingleColorFragShader");
exports.SingleColorFragShader = SingleColorFragShader_1.default;
var PointsVertexShader_1 = require("./kernels/PointsVertexShader");
exports.PointsVertexShader = PointsVertexShader_1.default;
var PointsVertexShaderWithDisplacement_1 = require("./kernels/PointsVertexShaderWithDisplacement");
exports.PointsVertexShaderWithDisplacement = PointsVertexShaderWithDisplacement_1.default;
var PassThroughFragmentShader_1 = require("./kernels/PassThroughFragmentShader");
exports.PassThroughFragmentShader = PassThroughFragmentShader_1.default;
//# sourceMappingURL=index.js.map