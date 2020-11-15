"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GLCompute = void 0;
var DefaultVertexShader_1 = require("./kernels/DefaultVertexShader");
var PassThroughShader_1 = require("./kernels/PassThroughShader");
var DataLayer_1 = require("./DataLayer");
var GPUProgram_1 = require("./GPUProgram");
var utils_1 = require("./utils");
var DataArray_Feedback_1 = require("./DataArray-Feedback");
var fsQuadPositions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
var boundaryPositions = new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]);
var unitCirclePoints = [0, 0];
var NUM_SEGMENTS_CIRCLE = 20;
for (var i = 0; i <= NUM_SEGMENTS_CIRCLE; i++) {
    unitCirclePoints.push(Math.cos(2 * Math.PI * i / NUM_SEGMENTS_CIRCLE), Math.sin(2 * Math.PI * i / NUM_SEGMENTS_CIRCLE));
}
var circlePositions = new Float32Array(unitCirclePoints);
var GLCompute = /** @class */ (function () {
    function GLCompute(gl, canvasEl, 
    // Optionally pass in an error callback in case we want to handle errors related to webgl support.
    // e.g. throw up a modal telling user this will not work on their device.
    errorCallback) {
        if (errorCallback === void 0) { errorCallback = function (message) { throw new Error(message); }; }
        this.errorState = false;
        // Save callback in case we run into an error.
        var self = this;
        this.errorCallback = function (message) {
            if (self.errorState) {
                return;
            }
            self.errorState = true;
            if (errorCallback)
                errorCallback(message);
        };
        // Init GL.
        if (!gl) {
            // Init a gl context if not passed in.
            gl = canvasEl.getContext('webgl2', { antialias: false })
                || canvasEl.getContext('webgl', { antialias: false })
                || canvasEl.getContext('experimental-webgl', { antialias: false });
            if (gl === null) {
                this.errorCallback('Unable to initialize WebGL context.');
                return;
            }
        }
        if (utils_1.isWebGL2(gl)) {
            console.log('Using WebGL 2.0 context.');
        }
        else {
            console.log('Using WebGL 1.0 context.');
        }
        this.gl = gl;
        // GL setup.
        // Disable depth testing globally.
        gl.disable(gl.DEPTH_TEST);
        // Set unpack alignment to 1 so we can have textures of arbitrary dimensions.
        // https://stackoverflow.com/questions/51582282/error-when-creating-textures-in-webgl-with-the-rgb-format
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
        // TODO: look into more of these: https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/pixelStorei
        // // Some implementations of HTMLCanvasElement's or OffscreenCanvas's CanvasRenderingContext2D store color values
        // // internally in premultiplied form. If such a canvas is uploaded to a WebGL texture with the
        // // UNPACK_PREMULTIPLY_ALPHA_WEBGL pixel storage parameter set to false, the color channels will have to be un-multiplied
        // // by the alpha channel, which is a lossy operation. The WebGL implementation therefore can not guarantee that colors
        // // with alpha < 1.0 will be preserved losslessly when first drawn to a canvas via CanvasRenderingContext2D and then
        // // uploaded to a WebGL texture when the UNPACK_PREMULTIPLY_ALPHA_WEBGL pixel storage parameter is set to false.
        // gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        // Init a default vertex shader that just passes through screen coords.
        var defaultVertexShader = utils_1.compileShader(gl, this.errorCallback, DefaultVertexShader_1.default, gl.VERTEX_SHADER);
        if (!defaultVertexShader) {
            this.errorCallback('Unable to initialize fullscreen quad vertex shader.');
            return;
        }
        this.defaultVertexShader = defaultVertexShader;
        // Init a program to pass values from one texture to another.
        this.passThroughProgram = this.initProgram('passThrough', PassThroughShader_1.default, [
            {
                name: 'u_state',
                value: 0,
                dataType: 'INT',
            }
        ]);
        // Create vertex buffers.
        this.quadPositionsBuffer = this.initVertexBuffer(fsQuadPositions);
        this.boundaryPositionsBuffer = this.initVertexBuffer(boundaryPositions);
        this.circlePositionsBuffer = this.initVertexBuffer(circlePositions);
        // Unbind active buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        // Canvas setup.
        this.onResize(canvasEl);
        // Log number of textures available.
        var maxTexturesInFragmentShader = this.gl.getParameter(this.gl.MAX_TEXTURE_IMAGE_UNITS);
        console.log(maxTexturesInFragmentShader + " textures max.");
    }
    GLCompute.prototype.initVertexBuffer = function (data) {
        var _a = this, errorCallback = _a.errorCallback, gl = _a.gl;
        var buffer = gl.createBuffer();
        if (!buffer) {
            errorCallback('Unable to allocate gl buffer.');
            return;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        // Add vertex data for drawing full screen quad via triangle strip.
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        return buffer;
    };
    GLCompute.prototype.initProgram = function (name, fragmentShaderSource, uniforms, vertexShaderSource) {
        var _a = this, gl = _a.gl, errorCallback = _a.errorCallback;
        return new GPUProgram_1.GPUProgram(name, gl, errorCallback, vertexShaderSource ? vertexShaderSource : this.defaultVertexShader, fragmentShaderSource, uniforms);
    };
    ;
    GLCompute.prototype.initDataLayer = function (name, options, writable, numBuffers) {
        if (writable === void 0) { writable = false; }
        if (numBuffers === void 0) { numBuffers = 1; }
        var _a = this, gl = _a.gl, errorCallback = _a.errorCallback;
        return new DataLayer_1.DataLayer(name, gl, options, errorCallback, writable, numBuffers);
    };
    ;
    GLCompute.prototype.initDataArray = function (name, options, writable, numBuffers) {
        if (writable === void 0) { writable = false; }
        if (numBuffers === void 0) { numBuffers = 1; }
        var _a = this, gl = _a.gl, errorCallback = _a.errorCallback;
        return new DataArray_Feedback_1.DataArray(name, gl, options, errorCallback, writable, numBuffers);
    };
    ;
    GLCompute.prototype.onResize = function (canvasEl) {
        var gl = this.gl;
        var width = canvasEl.clientWidth;
        var height = canvasEl.clientHeight;
        gl.viewport(0, 0, width, height);
        // Set correct canvas pixel size.
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/By_example/Canvas_size_and_WebGL
        canvasEl.width = width;
        canvasEl.height = height;
        // Save dimensions.
        this.width = width;
        this.height = height;
    };
    ;
    GLCompute.prototype.setDrawInputsAndOutputs = function (program, fullscreenRender, inputLayers, outputLayer) {
        var gl = this.gl;
        // Check if we are in an error state.
        if (!program.program) {
            return;
        }
        // CAUTION: the order of these next few lines is important.
        // Get a shallow copy of current textures.
        // This line must come before this.setOutput() as it depends on current internal state.
        var inputTextures = inputLayers.map(function (layer) { return layer.getCurrentStateTexture(); });
        // Set output framebuffer.
        // This may modify WebGL internal state.
        this.setOutputLayer(fullscreenRender, inputLayers, outputLayer);
        // Set current program.
        gl.useProgram(program.program);
        // Set input textures.
        for (var i = 0; i < inputTextures.length; i++) {
            gl.activeTexture(gl.TEXTURE0 + i);
            gl.bindTexture(gl.TEXTURE_2D, inputTextures[i]);
        }
    };
    GLCompute.prototype.setOutputLayer = function (fullscreenRender, inputLayers, outputLayer) {
        var _a = this, gl = _a.gl, passThroughProgram = _a.passThroughProgram;
        if (!outputLayer) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            return;
        }
        // Check if output is same as one of input layers.
        if (inputLayers.indexOf(outputLayer) > -1) {
            if (outputLayer.numBuffers === 1) {
                throw new Error("\nCannot use same buffer for input and output of a program.\nTry increasing the number of buffers in your output layer to at least 2 so you\ncan render to nextState using currentState as an input.");
            }
            if (fullscreenRender) {
                // Render and increment buffer so we are rendering to a different target
                // than the input texture.
                outputLayer.bindOutputBuffer(true);
                return;
            }
            // Pass input texture through to output.
            this.step(passThroughProgram, [outputLayer], outputLayer);
            // Render to output without incrementing buffer.
            outputLayer.bindOutputBuffer(false);
            return;
        }
        // Render to current buffer.
        outputLayer.bindOutputBuffer(false);
    };
    ;
    GLCompute.prototype.setPositionAttribute = function (program) {
        var gl = this.gl;
        // Point attribute to the currently bound VBO.
        var positionLocation = gl.getAttribLocation(program.program, 'aPosition');
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
        // Enable the attribute.
        gl.enableVertexAttribArray(positionLocation);
    };
    // Step for entire fullscreen quad.
    GLCompute.prototype.step = function (program, inputLayers, outputLayer) {
        if (inputLayers === void 0) { inputLayers = []; }
        var _a = this, gl = _a.gl, errorState = _a.errorState, quadPositionsBuffer = _a.quadPositionsBuffer;
        // Ignore if we are in error state.
        if (errorState) {
            return;
        }
        // Do setup - this must come first.
        this.setDrawInputsAndOutputs(program, true, inputLayers, outputLayer);
        // Update uniforms and buffers.
        program.setUniform('u_scale', [1, 1], 'FLOAT');
        program.setUniform('u_translation', [0, 0], 'FLOAT');
        gl.bindBuffer(gl.ARRAY_BUFFER, quadPositionsBuffer);
        this.setPositionAttribute(program);
        // Draw.
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    // Step program only for a strip of px along the boundary.
    GLCompute.prototype.stepBoundary = function (program, inputLayers, outputLayer) {
        if (inputLayers === void 0) { inputLayers = []; }
        var _a = this, gl = _a.gl, errorState = _a.errorState, boundaryPositionsBuffer = _a.boundaryPositionsBuffer, width = _a.width, height = _a.height;
        // Ignore if we are in error state.
        if (errorState) {
            return;
        }
        // Do setup - this must come first.
        this.setDrawInputsAndOutputs(program, false, inputLayers, outputLayer);
        // Update uniforms and buffers.
        // Frame needs to be offset and scaled so that all four sides are in viewport.
        var onePx = [1 / width, 1 / height];
        program.setUniform('u_scale', [1 - onePx[0], 1 - onePx[1]], 'FLOAT');
        program.setUniform('u_translation', onePx, 'FLOAT');
        gl.bindBuffer(gl.ARRAY_BUFFER, boundaryPositionsBuffer);
        this.setPositionAttribute(program);
        // Draw.
        gl.drawArrays(gl.LINE_LOOP, 0, 4); // Draw to framebuffer.
    };
    // Step program for all but a strip of px along the boundary.
    GLCompute.prototype.stepNonBoundary = function (program, inputLayers, outputLayer) {
        if (inputLayers === void 0) { inputLayers = []; }
        var _a = this, gl = _a.gl, errorState = _a.errorState, quadPositionsBuffer = _a.quadPositionsBuffer, width = _a.width, height = _a.height;
        // Ignore if we are in error state.
        if (errorState) {
            return;
        }
        // Do setup - this must come first.
        this.setDrawInputsAndOutputs(program, false, inputLayers, outputLayer);
        // Update uniforms and buffers.
        var onePx = [1 / width, 1 / height];
        program.setUniform('u_scale', [1 - 2 * onePx[0], 1 - 2 * onePx[1]], 'FLOAT');
        program.setUniform('u_translation', onePx, 'FLOAT');
        gl.bindBuffer(gl.ARRAY_BUFFER, quadPositionsBuffer);
        this.setPositionAttribute(program);
        // Draw.
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    // Step program only for a circular spot.
    GLCompute.prototype.stepCircle = function (program, position, // position is in screen space coords.
    radius, // radius is in px.
    inputLayers, outputLayer) {
        if (inputLayers === void 0) { inputLayers = []; }
        var _a = this, gl = _a.gl, errorState = _a.errorState, circlePositionsBuffer = _a.circlePositionsBuffer, width = _a.width, height = _a.height;
        // Ignore if we are in error state.
        if (errorState) {
            return;
        }
        // Do setup - this must come first.
        this.setDrawInputsAndOutputs(program, false, inputLayers, outputLayer);
        // Update uniforms and buffers.
        program.setUniform('u_scale', [radius / width, radius / height], 'FLOAT');
        program.setUniform('u_translation', [2 * position[0] / width - 1, 2 * position[1] / height - 1], 'FLOAT');
        gl.bindBuffer(gl.ARRAY_BUFFER, circlePositionsBuffer);
        this.setPositionAttribute(program);
        // Draw.
        gl.drawArrays(gl.TRIANGLE_FAN, 0, NUM_SEGMENTS_CIRCLE + 2); // Draw to framebuffer.
    };
    // readyToRead() {
    // 	const { gl } = this;
    //     return gl.checkFramebufferStatus(gl.FRAMEBUFFER) == gl.FRAMEBUFFER_COMPLETE;
    // };
    // readPixels(xMin: number, yMin: number, width: number, height: number, array: TextureDataType) {
    // 	const { gl } = this;
    // 	gl.readPixels(xMin, yMin, width, height, gl.RGBA, gl.UNSIGNED_BYTE, array);
    // };
    GLCompute.prototype.reset = function () {
    };
    ;
    GLCompute.prototype.destroy = function () {
        // TODO: Need to implement this.
    };
    return GLCompute;
}());
exports.GLCompute = GLCompute;
//# sourceMappingURL=GLCompute.js.map