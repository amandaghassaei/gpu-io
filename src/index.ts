import { GLCompute } from './GLCompute';
const SingleColorFragShader = require('./kernels_1.0/SingleColorFragShader.glsl');
const PointsVertexShader = require('./kernels_1.0/PointsVertexShader.glsl');
const PointsVertexShaderWithDisplacement = require('./kernels_1.0/PointsVertexShaderWithDisplacement.glsl');
const SegmentVertexShader = require('./kernels_1.0/SegmentVertexShader.glsl');
const ZeroFragmentShader = require('./kernels_1.0/ZeroFragShader.glsl');

export {
	GLCompute,
	SingleColorFragShader,
	PointsVertexShader,
	PointsVertexShaderWithDisplacement,
	SegmentVertexShader,
	ZeroFragmentShader,
};