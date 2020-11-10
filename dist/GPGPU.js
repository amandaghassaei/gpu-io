"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GPGPU = void 0;
var DefaultVertexShader_1 = require("./kernels/DefaultVertexShader");
var constants_1 = require("./constants");
var DataLayer_1 = require("./DataLayer");
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
        this.programs = {}; // All current gl programs.
        this.shaders = []; // Keep track of all shaders inited so they can be properly deallocated.
        // Save callback in case we run into an error.
        var self = this;
        this.errorCallback = function (message) {
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
                errorCallback('Unable to initialize WebGL context.');
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
        var defaultVertexShader = this.compileShader(DefaultVertexShader_1.default, gl.VERTEX_SHADER);
        if (!defaultVertexShader) {
            errorCallback('Unable to initialize fullscreen quad vertex shader.');
            return;
        }
        this.defaultVertexShader = defaultVertexShader;
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
    // Copied from http://webglfundamentals.org/webgl/lessons/webgl-boilerplate.html
    GPGPU.prototype.compileShader = function (shaderSource, shaderType) {
        var _a = this, gl = _a.gl, errorCallback = _a.errorCallback, shaders = _a.shaders;
        // Create the shader object
        var shader = gl.createShader(shaderType);
        if (!shader) {
            errorCallback('Unable to init gl shader.');
            return null;
        }
        // Set the shader source code.
        gl.shaderSource(shader, shaderSource);
        // Compile the shader
        gl.compileShader(shader);
        // Check if it compiled
        var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!success) {
            // Something went wrong during compilation - print the error.
            errorCallback("Could not compile " + (shaderType === gl.FRAGMENT_SHADER ? 'fragment' : 'vertex') + "\n\t\t\t\t shader: " + gl.getShaderInfoLog(shader));
            return null;
        }
        shaders.push(shader);
        return shader;
    };
    GPGPU.prototype.initProgram = function (programName, fragmentShaderSource, uniforms) {
        var _this = this;
        var _a = this, programs = _a.programs, gl = _a.gl, errorCallback = _a.errorCallback;
        if (programs[programName]) {
            gl.useProgram(programs[programName].program);
            console.warn("Already a program with the name " + programName + ".");
            return;
        }
        var fragmentShader = this.compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
        // Load fullscreen quad vertex shader by default.
        // const vertexShader = vertexShaderSource ?
        // 	this.compileShader(vertexShaderSource, gl.VERTEX_SHADER) :
        // 	this.fsQuadVertexShader;
        var vertexShader = this.defaultVertexShader;
        if (!fragmentShader || !vertexShader) {
            errorCallback("Unable to init shaders for program " + programName + ".");
            return;
        }
        // Create a program.
        var program = gl.createProgram();
        if (!program) {
            errorCallback('Unable to init gl program.');
            return;
        }
        // Attach the shaders.
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        // Link the program.
        gl.linkProgram(program);
        // Check if it linked.
        var success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!success) {
            // Something went wrong with the link.
            errorCallback("Program " + programName + " filed to link: " + gl.getProgramInfoLog(program));
        }
        // Add new program.
        programs[programName] = {
            program: program,
            uniforms: {},
        };
        uniforms === null || uniforms === void 0 ? void 0 : uniforms.forEach(function (uniform) {
            var name = uniform.name, value = uniform.value, dataType = uniform.dataType;
            _this.setProgramUniform(programName, name, value, dataType);
        });
    };
    ;
    GPGPU.prototype.uniformTypeForValue = function (value, dataType) {
        if (dataType === constants_1.FLOAT_TYPE) {
            if (!isNaN(value) || value.length === 1) {
                return constants_1.FLOAT_1D_UNIFORM;
            }
            if (value.length === 2) {
                return constants_1.FLOAT_2D_UNIFORM;
            }
            if (value.length === 3) {
                return constants_1.FLOAT_3D_UNIFORM;
            }
            if (value.length === 4) {
                return constants_1.FLOAT_4D_UNIFORM;
            }
            throw new Error("Invalid uniform value: " + value);
        }
        else if (dataType === constants_1.INT_TYPE) {
            if (!isNaN(value) || value.length === 1) {
                return constants_1.INT_1D_UNIFORM;
            }
            if (value.length === 2) {
                return constants_1.INT_2D_UNIFORM;
            }
            if (value.length === 3) {
                return constants_1.INT_3D_UNIFORM;
            }
            if (value.length === 4) {
                return constants_1.INT_4D_UNIFORM;
            }
            throw new Error("Invalid uniform value: " + value);
        }
        else {
            throw new Error("Invalid uniform data type: " + dataType);
        }
    };
    GPGPU.prototype.setProgramUniform = function (programName, uniformName, value, dataType) {
        var _a = this, gl = _a.gl, programs = _a.programs, errorCallback = _a.errorCallback;
        var program = programs[programName];
        if (!program) {
            throw new Error("Count not set uniform, no program of name: " + programName + ".");
        }
        // Set active program.
        gl.useProgram(program.program);
        var uniforms = program.uniforms;
        var type = this.uniformTypeForValue(value, dataType);
        if (!uniforms[uniformName]) {
            // Init uniform if needed.
            var location_1 = gl.getUniformLocation(program.program, uniformName);
            if (!location_1) {
                errorCallback("Could not init uniform " + uniformName + " for program " + programName + ".\nCheck that uniform is present in shader code, unused uniforms may be removed by compiler.\nAlso check that uniform type in shader code matches type " + type + ".\nError code: " + gl.getError() + ".");
                return;
            }
            uniforms[uniformName] = {
                location: location_1,
                type: type,
            };
        }
        var uniform = uniforms[uniformName];
        // Check that types match previously set uniform.
        if (uniform.type != type) {
            throw new Error("Uniform " + uniformName + " cannot change from type " + uniform.type + " to type " + type + ".");
        }
        var location = uniform.location;
        // Set uniform.
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/uniform
        switch (type) {
            case constants_1.FLOAT_1D_UNIFORM:
                gl.uniform1f(location, value);
                break;
            case constants_1.FLOAT_2D_UNIFORM:
                gl.uniform2fv(location, value);
                break;
            case constants_1.FLOAT_3D_UNIFORM:
                gl.uniform3fv(location, value);
                break;
            case constants_1.FLOAT_4D_UNIFORM:
                gl.uniform4fv(location, value);
                break;
            case constants_1.INT_1D_UNIFORM:
                gl.uniform1i(location, value);
                break;
            case constants_1.INT_2D_UNIFORM:
                gl.uniform2iv(location, value);
                break;
            case constants_1.INT_3D_UNIFORM:
                gl.uniform3iv(location, value);
                break;
            case constants_1.INT_4D_UNIFORM:
                gl.uniform4iv(location, value);
                break;
            default:
                throw new Error("Unknown uniform type: " + type + ".");
        }
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
    GPGPU.prototype.initDataLayer = function (options, writable, numBuffers) {
        if (writable === void 0) { writable = false; }
        if (numBuffers === void 0) { numBuffers = 1; }
        var _a = this, gl = _a.gl, errorCallback = _a.errorCallback;
        var data = options.data, width = options.width, height = options.height, type = options.type, numChannels = options.numChannels;
        // Check that data is correct length.
        if (data && data.length !== width * height * numChannels) {
            throw new Error("Invalid data array of size " + data.length + " for texture of dimensions " + width + " x " + height + " x " + numChannels + ".");
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
                    throw new Error("Unsupported type " + type + " for initTexture.");
            }
            // Fill new data array with old data.
            for (var i = 0; i < imageSize; i++) {
                for (var j = 0; j < numChannels; j++) {
                    newArray[glNumChannels * i + j] = data[i * numChannels + j];
                }
            }
            dataResized = newArray;
        }
        var dataLayer = new DataLayer_1.DataLayer(gl, {
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
    GPGPU.prototype._step = function (programName, inputLayers, outputLayer) {
        var _a = this, gl = _a.gl, programs = _a.programs;
        var program = programs[programName];
        if (!program) {
            throw new Error("Invalid program name: " + programName + ".");
        }
        gl.useProgram(program.program);
        for (var i = 0; i < inputLayers.length; i++) {
            gl.activeTexture(gl.TEXTURE0 + i);
            gl.bindTexture(gl.TEXTURE_2D, inputLayers[i].getCurrentStateTexture());
        }
        if (outputLayer) {
            outputLayer.setAsRenderTarget();
        }
        else {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }
        // Point attribute to the currently bound VBO.
        var positionLocation = gl.getAttribLocation(program.program, 'aPosition');
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
        // Enable the attribute.
        gl.enableVertexAttribArray(positionLocation);
    };
    ;
    // Step for entire fullscreen quad.
    GPGPU.prototype.step = function (programName, inputLayers, outputLayer) {
        if (inputLayers === void 0) { inputLayers = []; }
        var _a = this, gl = _a.gl, errorState = _a.errorState, quadPositionsBuffer = _a.quadPositionsBuffer;
        // Ignore if we are in error state.
        if (errorState) {
            return;
        }
        // Update uniforms and buffers.
        this.setProgramUniform(programName, 'u_scale', [1, 1], 'FLOAT');
        this.setProgramUniform(programName, 'u_translation', [0, 0], 'FLOAT');
        gl.bindBuffer(gl.ARRAY_BUFFER, quadPositionsBuffer);
        this._step(programName, inputLayers, outputLayer);
        // Draw.
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    // Step program only for a strip of px along the boundary.
    GPGPU.prototype.stepBoundary = function (programName, inputLayers, outputLayer) {
        if (inputLayers === void 0) { inputLayers = []; }
        var _a = this, gl = _a.gl, errorState = _a.errorState, boundaryPositionsBuffer = _a.boundaryPositionsBuffer, width = _a.width, height = _a.height;
        // Ignore if we are in error state.
        if (errorState) {
            return;
        }
        // Update uniforms and buffers.
        // Frame needs to be offset and scaled so that all four sides are in viewport.
        var onePx = [1 / width, 1 / height];
        this.setProgramUniform(programName, 'u_scale', [1 - onePx[0], 1 - onePx[1]], 'FLOAT');
        this.setProgramUniform(programName, 'u_translation', onePx, 'FLOAT');
        gl.bindBuffer(gl.ARRAY_BUFFER, boundaryPositionsBuffer);
        this._step(programName, inputLayers, outputLayer);
        // Draw.
        gl.drawArrays(gl.LINE_LOOP, 0, 4); // Draw to framebuffer.
    };
    // Step program for all but a strip of px along the boundary.
    GPGPU.prototype.stepNonBoundary = function (programName, inputLayers, outputLayer) {
        if (inputLayers === void 0) { inputLayers = []; }
        var _a = this, gl = _a.gl, errorState = _a.errorState, quadPositionsBuffer = _a.quadPositionsBuffer, width = _a.width, height = _a.height;
        // Ignore if we are in error state.
        if (errorState) {
            return;
        }
        // Update uniforms and buffers.
        var onePx = [1 / width, 1 / height];
        this.setProgramUniform(programName, 'u_scale', [1 - 2 * onePx[0], 1 - 2 * onePx[1]], 'FLOAT');
        this.setProgramUniform(programName, 'u_translation', onePx, 'FLOAT');
        gl.bindBuffer(gl.ARRAY_BUFFER, quadPositionsBuffer);
        this._step(programName, inputLayers, outputLayer);
        // Draw.
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    // Step program only for a circular spot.
    GPGPU.prototype.stepCircle = function (programName, position, // position is in screen space coords.
    radius, // radius is in px.
    inputLayers, outputLayer) {
        if (inputLayers === void 0) { inputLayers = []; }
        var _a = this, gl = _a.gl, errorState = _a.errorState, circlePositionsBuffer = _a.circlePositionsBuffer, width = _a.width, height = _a.height;
        // Ignore if we are in error state.
        if (errorState) {
            return;
        }
        // Update uniforms and buffers.
        this.setProgramUniform(programName, 'u_scale', [radius / width, radius / height], 'FLOAT');
        // Flip y axis.
        this.setProgramUniform(programName, 'u_translation', [2 * position[0] / width - 1, -2 * position[1] / height + 1], 'FLOAT');
        gl.bindBuffer(gl.ARRAY_BUFFER, circlePositionsBuffer);
        this._step(programName, inputLayers, outputLayer);
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
    GPGPU.prototype.reset = function () {
        // TODO: make sure we are actually deallocating resources here.
        var _a = this, gl = _a.gl, programs = _a.programs, shaders = _a.shaders, defaultVertexShader = _a.defaultVertexShader;
        // Unbind all data before deleting.
        Object.keys(programs).forEach(function (key) {
            var program = programs[key].program;
            gl.deleteProgram(program);
            delete programs[key];
        });
        for (var i = shaders.length - 1; i >= 0; i--) {
            if (shaders[i] === defaultVertexShader) {
                continue;
            }
            // From https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/deleteShader
            // This method has no effect if the shader has already been deleted
            gl.deleteShader(shaders[i]);
            shaders.splice(i, 1);
        }
    };
    ;
    return GPGPU;
}());
exports.GPGPU = GPGPU;
//# sourceMappingURL=GPGPU.js.map