import { GLCompute } from './GLCompute';
const SingleColorFragShader = require('./kernels/SingleColorFragShader.glsl');
const PointsVertexShader = require('./kernels/PointsVertexShader.glsl');
const PointsVertexShaderWithDisplacement = require('./kernels/PointsVertexShaderWithDisplacement.glsl');
const SegmentVertexShader = require('./kernels/SegmentVertexShader.glsl');
const PassThroughFragmentShader = require('./kernels/PassThroughFragmentShader.glsl');

export {
	GLCompute,
	SingleColorFragShader,
	PointsVertexShader,
	PointsVertexShaderWithDisplacement,
	SegmentVertexShader,
	PassThroughFragmentShader,
};