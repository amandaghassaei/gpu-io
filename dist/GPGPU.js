"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GPGPU = void 0;
var DefaultVertexShader_1 = require("./kernels/DefaultVertexShader");
var PassThroughShader_1 = require("./kernels/PassThroughShader");
var DataLayer_1 = require("./DataLayer");
var GPUProgram_1 = require("./GPUProgram");
var utils_1 = require("./utils");
var fsQuadPositions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
var boundaryPositions = new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]);
var unitCirclePoints = [0, 0];
var NUM_SEGMENTS_CIRCLE = 20;
for (var i = 0; i <= NUM_SEGMENTS_CIRCLE; i++) {
    unitCirclePoints.push(Math.cos(2 * Math.PI * i / NUM_SEGMENTS_CIRCLE), Math.sin(2 * Math.PI * i / NUM_SEGMENTS_CIRCLE));
}
var circlePositions = new Float32Array(unitCirclePoints);
// Store extension names as constants.
var OES_TEXTURE_HALF_FLOAT = 'OES_texture_half_float';
var OES_TEXTURE_HAlF_FLOAT_LINEAR = 'OES_texture_half_float_linear';
var EXT_COLOR_BUFFER_FLOAT = 'EXT_color_buffer_float';
var GPGPU = /** @class */ (function () {
    function GPGPU(gl, canvasEl, 
    // Optionally pass in an error callback in case we want to handle errors related to webgl support.
    // e.g. throw up a modal telling user this will not work on their device.
    errorCallback) {
        if (errorCallback === void 0) { errorCallback = function (message) { throw new Error(message); }; }
        this.extensions = {};
        this.errorState = false;
        this.shaders = []; // Keep track of all shaders inited so they can be properly deallocated.
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
                || canvasEl.getContext('webgl', { antialias: false });
            // || canvasEl.getContext('experimental-webgl', {antialias:false}) as RenderingContext;
            if (gl === null) {
                this.errorCallback('Unable to initialize WebGL context.');
                return;
            }
        }
        this.isWebGL2 = !!gl.HALF_FLOAT;
        if (this.isWebGL2) {
            console.log('Using WebGL 2.0 context.');
        }
        else {
            console.log('Using WebGL 1.0 context.');
        }
        this.gl = gl;
        // GL setup.
        // Load extensions.
        // TODO: load these extensions as needed.
        if (this.isWebGL2) {
            // EXT_COLOR_BUFFER_FLOAT adds ability to render to a variety of floating pt textures.
            // https://developer.mozilla.org/en-US/docs/Web/API/EXT_color_buffer_float
            // https://stackoverflow.com/questions/34262493/framebuffer-incomplete-attachment-for-texture-with-internal-format
            // https://stackoverflow.com/questions/36109347/framebuffer-incomplete-attachment-only-happens-on-android-w-firefox
            this.loadExtension(EXT_COLOR_BUFFER_FLOAT);
        }
        else {
            // https://developer.mozilla.org/en-US/docs/Web/API/OES_texture_half_float
            // Half float is supported by modern mobile browsers, float not yet supported.
            // Half float is provided by default for Webgl2 contexts.
            // This extension implicitly enables the EXT_color_buffer_half_float extension (if supported), which allows rendering to 16-bit floating point formats.
            this.loadExtension(OES_TEXTURE_HALF_FLOAT);
        }
        // Load optional extensions.
        // TODO: need this for webgl2?
        this.linearFilterEnabled = this.loadExtension(OES_TEXTURE_HAlF_FLOAT_LINEAR, true);
        // Disable depth testing globally.
        gl.disable(gl.DEPTH_TEST);
        // Set unpack alignment to 1 so we can have textures of arbitrary dimensions.
        // https://stackoverflow.com/questions/51582282/error-when-creating-textures-in-webgl-with-the-rgb-format
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
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
    GPGPU.prototype.initVertexBuffer = function (data) {
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
    GPGPU.prototype.loadExtension = function (extension, optional) {
        if (optional === void 0) { optional = false; }
        var _a = this, extensions = _a.extensions, gl = _a.gl, errorCallback = _a.errorCallback;
        var ext;
        try {
            ext = gl.getExtension(extension);
        }
        catch (e) { }
        if (ext) {
            extensions[extension] = ext;
            console.log("Loaded extension: " + extension + ".");
        }
        else {
            console.warn("Unsupported " + (optional ? 'optional ' : '') + "extension: " + extension + ".");
        }
        // If the extension is not optional, throw error.
        if (!ext && !optional) {
            errorCallback("Required extension unsupported by this device / browser: " + extension + ".");
        }
        return !!ext;
    };
    GPGPU.prototype.initProgram = function (name, fragmentShaderSource, uniforms) {
        var _a = this, gl = _a.gl, errorCallback = _a.errorCallback;
        // Load fullscreen quad vertex shader by default.
        // const vertexShader = vertexShaderSource ?
        // 	this.compileShader(vertexShaderSource, gl.VERTEX_SHADER) :
        // 	this.fsQuadVertexShader;
        var vertexShader = this.defaultVertexShader;
        return new GPUProgram_1.GPUProgram(name, gl, errorCallback, this.defaultVertexShader, fragmentShaderSource, uniforms);
    };
    ;
    GPGPU.prototype.glTextureParameters = function (numChannels, type, writable) {
        // https://www.khronos.org/registry/webgl/specs/latest/2.0/#TEXTURE_TYPES_FORMATS_FROM_DOM_ELEMENTS_TABLE
        var _a = this, gl = _a.gl, isWebGL2 = _a.isWebGL2, extensions = _a.extensions;
        var glType, glFormat, glInternalFormat, glNumChannels;
        if (isWebGL2) {
            glNumChannels = numChannels;
            // https://www.khronos.org/registry/webgl/extensions/EXT_color_buffer_float/
            // The sized internal format RGB16F is not color-renderable for some reason.
            // If numChannels == 3 for a writable texture, use RGBA instead.
            if (numChannels === 3 && writable) {
                glNumChannels = 4;
            }
            switch (glNumChannels) {
                case 1:
                    glFormat = gl.RED;
                    break;
                case 2:
                    glFormat = gl.RG;
                    break;
                case 3:
                    glFormat = gl.RGB;
                    break;
                case 4:
                    glFormat = gl.RGBA;
                    break;
            }
            switch (type) {
                case 'float16':
                    glType = gl.HALF_FLOAT;
                    switch (glNumChannels) {
                        case 1:
                            glInternalFormat = gl.R16F;
                            break;
                        case 2:
                            glInternalFormat = gl.RG16F;
                            break;
                        case 3:
                            glInternalFormat = gl.RGB16F;
                            break;
                        case 4:
                            glInternalFormat = gl.RGBA16F;
                            break;
                    }
                    break;
                case 'uint8':
                    glType = gl.UNSIGNED_BYTE;
                    switch (glNumChannels) {
                        case 1:
                            glInternalFormat = gl.R8;
                            break;
                        case 2:
                            glInternalFormat = gl.RG8;
                            break;
                        case 3:
                            glInternalFormat = gl.RGB8;
                            break;
                        case 4:
                            glInternalFormat = gl.RGBA8;
                            break;
                    }
                    break;
            }
        }
        else {
            switch (numChannels) {
                // TODO: for read only textures in WebGL 1.0, we could use gl.ALPHA and gl.LUMINANCE_ALPHA here.
                case 1:
                case 2:
                case 3:
                    glFormat = gl.RGB;
                    glInternalFormat = gl.RGB;
                    glNumChannels = 3;
                    break;
                case 4:
                    glFormat = gl.RGBA;
                    glInternalFormat = gl.RGBA;
                    glNumChannels = 4;
                    break;
            }
            switch (type) {
                case 'float16':
                    glType = extensions[OES_TEXTURE_HALF_FLOAT].HALF_FLOAT_OES;
                    break;
                case 'uint8':
                    glType = gl.UNSIGNED_BYTE;
                    break;
            }
        }
        // Check for missing params.
        if (glType === undefined || glFormat === undefined || glInternalFormat === undefined) {
            throw new Error("Invalid type: " + type + " or numChannels " + numChannels + ".");
        }
        if (glNumChannels === undefined || numChannels < 1 || numChannels > 4) {
            throw new Error("Invalid numChannels: " + numChannels + ".");
        }
        return {
            glFormat: glFormat,
            glInternalFormat: glInternalFormat,
            glType: glType,
            glNumChannels: glNumChannels,
        };
    };
    GPGPU.prototype.initDataLayer = function (name, options, writable, numBuffers) {
        if (writable === void 0) { writable = false; }
        if (numBuffers === void 0) { numBuffers = 1; }
        var _a = this, gl = _a.gl, errorCallback = _a.errorCallback;
        var data = options.data, width = options.width, height = options.height, type = options.type, numChannels = options.numChannels;
        // Check that data is correct length.
        if (data && data.length !== width * height * numChannels) {
            throw new Error("Invalid data array of size " + data.length + " for DataLayer " + name + " of dimensions " + width + " x " + height + " x " + numChannels + ".");
        }
        // TODO: Check that data is correct type.
        // if (data && type === 'float16') {
        // 	// // Since there is no Float16TypedArray, we must us Uint16TypedArray
        // 	// const float16Array = new Int16Array(data.length);
        // 	// for (let i = 0; i < data.length; i++) {
        // 	// }
        // }
        // Get texture params.
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D
        var _b = this.glTextureParameters(numChannels, type, writable), glFormat = _b.glFormat, glInternalFormat = _b.glInternalFormat, glNumChannels = _b.glNumChannels, glType = _b.glType;
        // Check that data is correct length.
        // This only happens for webgl 1.0 contexts.
        var dataResized = data;
        if (data && numChannels !== glNumChannels) {
            var imageSize = width * height;
            var newArray = void 0;
            switch (type) {
                case 'uint8':
                    newArray = new Uint8Array(width * height * glNumChannels);
                    break;
                default:
                    throw new Error("Error initing " + name + ".  Unsupported type " + type + " for GPGPU.initDataLayer.");
            }
            // Fill new data array with old data.
            for (var i = 0; i < imageSize; i++) {
                for (var j = 0; j < numChannels; j++) {
                    newArray[glNumChannels * i + j] = data[i * numChannels + j];
                }
            }
            dataResized = newArray;
        }
        var dataLayer = new DataLayer_1.DataLayer(name, gl, {
            width: width,
            height: height,
            glInternalFormat: glInternalFormat,
            glFormat: glFormat,
            glType: glType,
            data: dataResized,
        }, errorCallback, numBuffers, writable);
        return dataLayer;
    };
    ;
    GPGPU.prototype.onResize = function (canvasEl) {
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
    GPGPU.prototype.drawSetup = function (program, inputLayers) {
        var gl = this.gl;
        // Check if we are in an error state.
        if (!program.program) {
            return;
        }
        gl.useProgram(program.program);
        for (var i = 0; i < inputLayers.length; i++) {
            gl.activeTexture(gl.TEXTURE0 + i);
            gl.bindTexture(gl.TEXTURE_2D, inputLayers[i].getCurrentStateTexture());
        }
        // Point attribute to the currently bound VBO.
        var positionLocation = gl.getAttribLocation(program.program, 'aPosition');
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
        // Enable the attribute.
        gl.enableVertexAttribArray(positionLocation);
    };
    GPGPU.prototype.setOutput = function (fullscreenRender, inputLayers, outputLayer) {
        var _a = this, gl = _a.gl, passThroughProgram = _a.passThroughProgram;
        if (!outputLayer) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            return;
        }
        // Check if output is same as one of input layers.
        if (inputLayers.indexOf(outputLayer) > -1) {
            if (outputLayer.numBuffers === 1) {
                throw new Error("\n\t\t\t\tCannot use same buffer for input and output of a program.\n\t\t\t\tTry increasing the number of buffers in your output layer to at least 2 so you\n\t\t\t\tcan render to nextState using currentState as an input.");
            }
            if (fullscreenRender) {
                // Render and increment buffer so we are rendering to a different target
                // than the input texture.
                outputLayer.setAsRenderTarget(true);
                return;
            }
            // Pass input texture through to output.
            this.step(passThroughProgram, [outputLayer], outputLayer);
            // Render to output without incrementing buffer.
            outputLayer.setAsRenderTarget(false);
            return;
        }
        // Render to current buffer.
        outputLayer.setAsRenderTarget(false);
    };
    ;
    // Step for entire fullscreen quad.
    GPGPU.prototype.step = function (program, inputLayers, outputLayer) {
        if (inputLayers === void 0) { inputLayers = []; }
        var _a = this, gl = _a.gl, errorState = _a.errorState, quadPositionsBuffer = _a.quadPositionsBuffer;
        // Ignore if we are in error state.
        if (errorState) {
            return;
        }
        // Set output target.
        this.setOutput(true, inputLayers, outputLayer);
        // Update uniforms and buffers.
        program.setUniform('u_scale', [1, 1], 'FLOAT');
        program.setUniform('u_translation', [0, 0], 'FLOAT');
        gl.bindBuffer(gl.ARRAY_BUFFER, quadPositionsBuffer);
        // Draw.
        this.drawSetup(program, inputLayers);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    // Step program only for a strip of px along the boundary.
    GPGPU.prototype.stepBoundary = function (program, inputLayers, outputLayer) {
        if (inputLayers === void 0) { inputLayers = []; }
        var _a = this, gl = _a.gl, errorState = _a.errorState, boundaryPositionsBuffer = _a.boundaryPositionsBuffer, width = _a.width, height = _a.height;
        // Ignore if we are in error state.
        if (errorState) {
            return;
        }
        // Set output target.
        this.setOutput(false, inputLayers, outputLayer);
        // Update uniforms and buffers.
        // Frame needs to be offset and scaled so that all four sides are in viewport.
        var onePx = [1 / width, 1 / height];
        program.setUniform('u_scale', [1 - onePx[0], 1 - onePx[1]], 'FLOAT');
        program.setUniform('u_translation', onePx, 'FLOAT');
        gl.bindBuffer(gl.ARRAY_BUFFER, boundaryPositionsBuffer);
        // Draw.
        this.drawSetup(program, inputLayers);
        gl.drawArrays(gl.LINE_LOOP, 0, 4); // Draw to framebuffer.
    };
    // Step program for all but a strip of px along the boundary.
    GPGPU.prototype.stepNonBoundary = function (program, inputLayers, outputLayer) {
        if (inputLayers === void 0) { inputLayers = []; }
        var _a = this, gl = _a.gl, errorState = _a.errorState, quadPositionsBuffer = _a.quadPositionsBuffer, width = _a.width, height = _a.height;
        // Ignore if we are in error state.
        if (errorState) {
            return;
        }
        // Set output target.
        this.setOutput(false, inputLayers, outputLayer);
        // Update uniforms and buffers.
        var onePx = [1 / width, 1 / height];
        program.setUniform('u_scale', [1 - 2 * onePx[0], 1 - 2 * onePx[1]], 'FLOAT');
        program.setUniform('u_translation', onePx, 'FLOAT');
        gl.bindBuffer(gl.ARRAY_BUFFER, quadPositionsBuffer);
        // Draw.
        this.drawSetup(program, inputLayers);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    // Step program only for a circular spot.
    GPGPU.prototype.stepCircle = function (program, position, // position is in screen space coords.
    radius, // radius is in px.
    inputLayers, outputLayer) {
        if (inputLayers === void 0) { inputLayers = []; }
        var _a = this, gl = _a.gl, errorState = _a.errorState, circlePositionsBuffer = _a.circlePositionsBuffer, width = _a.width, height = _a.height;
        // Ignore if we are in error state.
        if (errorState) {
            return;
        }
        // Set output target.
        this.setOutput(false, inputLayers, outputLayer);
        // Update uniforms and buffers.
        program.setUniform('u_scale', [radius / width, radius / height], 'FLOAT');
        // Flip y axis.
        program.setUniform('u_translation', [2 * position[0] / width - 1, -2 * position[1] / height + 1], 'FLOAT');
        gl.bindBuffer(gl.ARRAY_BUFFER, circlePositionsBuffer);
        // Draw.
        this.drawSetup(program, inputLayers);
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
    GPGPU.prototype.reset = function () {
    };
    ;
    return GPGPU;
}());
exports.GPGPU = GPGPU;
//# sourceMappingURL=GPGPU.js.map