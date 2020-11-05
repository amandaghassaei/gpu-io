"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GPGPU = void 0;
var FSRectVertexShader_1 = require("./kernels/FSRectVertexShader");
var constants_1 = require("./constants");
// Store extensions as constants.
var OES_TEXTURE_HALF_FLOAT = 'OES_texture_half_float';
var OES_TEXTURE_HAlF_FLOAT_LINEAR = 'OES_texture_half_float_linear';
var GPGPU = /** @class */ (function () {
    function GPGPU(gl, canvasEl, 
    // Optionally pass in an error callback in case we want to handle errors related to webgl support.
    // e.g. throw up a modal telling user this will not work on their device.
    errorCallback) {
        if (errorCallback === void 0) { errorCallback = function (message) { throw new Error(message); }; }
        this.errorState = false;
        this.programs = {}; // All current gl programs.
        this.textures = {}; // All current gl textures.
        this.framebuffers = {}; // All current gl framebuffers.
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
        this.gl = gl;
        // GL setup.
        // Load extensions.
        // https://developer.mozilla.org/en-US/docs/Web/API/OES_texture_half_float
        // Half float is supported by modern mobile browsers, float not yet supported.
        // Half float is provided by default for Webgl2 contexts.
        // This extension implicitly enables the EXT_color_buffer_half_float extension (if supported), which allows rendering to 16-bit floating point formats.
        if (!gl.HALF_FLOAT)
            this.loadExtension(OES_TEXTURE_HALF_FLOAT);
        // Load optional extensions.
        this.linearFilterEnabled = this.loadExtension(OES_TEXTURE_HAlF_FLOAT_LINEAR, true);
        // Disable depth testing globally.
        gl.disable(gl.DEPTH_TEST);
        // Set unpack alignment to 1 so we can have textures of arbitrary dimensions.
        // https://stackoverflow.com/questions/51582282/error-when-creating-textures-in-webgl-with-the-rgb-format
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
        // Init a default vertex shader that just passes through screen coords.
        var fsRectVertexShader = this.compileShader(FSRectVertexShader_1.default, gl.VERTEX_SHADER);
        if (!fsRectVertexShader) {
            errorCallback('Unable to initialize fullscreen rect vertex shader.');
            return;
        }
        this.fsRectVertexShader = fsRectVertexShader;
        // Create vertex buffers.
        var fsRectQuadBuffer = gl.createBuffer();
        if (!fsRectQuadBuffer) {
            errorCallback('Unable to allocate gl buffer.');
            return;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, fsRectQuadBuffer);
        // Add vertex data for drawing full screen quad via traingle strip.
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
        // Save buffer.
        this.fsRectQuadBuffer = fsRectQuadBuffer;
        var fsRectBoundaryBuffer = gl.createBuffer();
        if (!fsRectBoundaryBuffer) {
            errorCallback('Unable to allocate gl buffer.');
            return;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, fsRectBoundaryBuffer);
        // Add vertex data for drawing full screen quad via traingle strip.
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]), gl.STATIC_DRAW);
        // Save buffer.
        this.fsRectBoundaryBuffer = fsRectBoundaryBuffer;
        // Unbind buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        // Canvas setup.
        this.onResize(canvasEl);
        // Log number of textures available.
        var maxTexturesInFragmentShader = this.gl.getParameter(this.gl.MAX_TEXTURE_IMAGE_UNITS);
        console.log(maxTexturesInFragmentShader + " textures max.");
    }
    GPGPU.prototype.loadExtension = function (extension, optional) {
        if (optional === void 0) { optional = false; }
        var ext;
        try {
            ext = this.gl.getExtension(extension);
        }
        catch (e) { }
        if (!ext) {
            console.warn("Unsupported " + (optional ? 'optional ' : '') + "extension: " + extension + ".");
        }
        // If the extension is not optional, throw error.
        if (!ext && !optional) {
            this.errorCallback("Required extension unsupported by this device / browser: " + extension + ".");
        }
        return !!ext;
    };
    GPGPU.prototype.loadFSRectPositions = function (program) {
        var _a = this, gl = _a.gl, fsRectQuadBuffer = _a.fsRectQuadBuffer;
        // Add position as vertex attribute.
        // Bind buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, fsRectQuadBuffer);
        // Look up where the vertex data needs to go.
        var positionLocation = gl.getAttribLocation(program, 'position');
        // Point attribute to the currently bound VBO.
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
        // Enable the attribute.
        gl.enableVertexAttribArray(positionLocation);
        // Unbind the buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    };
    // Copied from http://webglfundamentals.org/webgl/lessons/webgl-boilerplate.html
    GPGPU.prototype.compileShader = function (shaderSource, shaderType) {
        var gl = this.gl;
        // Create the shader object
        var shader = gl.createShader(shaderType);
        if (!shader) {
            this.errorCallback('Unable to init gl shader.');
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
            this.errorCallback("Could not compile " + (shaderType === gl.FRAGMENT_SHADER ? 'fragment' : 'vertex') + "\n\t\t\t\t shader: " + gl.getShaderInfoLog(shader));
            return null;
        }
        this.shaders.push(shader);
        return shader;
    };
    GPGPU.prototype.initProgram = function (programName, fragmentShaderSource, uniforms) {
        var _this = this;
        var _a = this, programs = _a.programs, gl = _a.gl;
        if (programs[programName]) {
            gl.useProgram(programs[programName].program);
            console.warn("Already a program with the name " + programName + ".");
            return;
        }
        var fragmentShader = this.compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
        // Load fullscreen rect vertex shader by default.
        // const vertexShader = vertexShaderSource ?
        // 	this.compileShader(vertexShaderSource, gl.VERTEX_SHADER) :
        // 	this.fsRectVertexShader;
        var vertexShader = this.fsRectVertexShader;
        if (!fragmentShader || !vertexShader) {
            this.errorCallback("Unable to init shaders for program " + programName + ".");
            return;
        }
        // Create a program.
        var program = gl.createProgram();
        if (!program) {
            this.errorCallback('Unable to init gl program.');
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
            this.errorCallback("Program " + programName + " filed to link: " + gl.getProgramInfoLog(program));
        }
        // if (!vertexShaderSource) {
        // Load fullscreen rect vertex shader by default.
        this.loadFSRectPositions(program);
        // }
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
        var _a = this, gl = _a.gl, programs = _a.programs;
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
                this.errorCallback("Could not init uniform " + uniformName + " for program " + programName + ".\nCheck that uniform is present in shader code, unused uniforms may be removed by compiler.\nAlso check that uniform type in shader code matches type " + type + ".\nError code: " + gl.getError() + ".");
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
    GPGPU.prototype.initFramebufferForTexture = function (textureName, shouldOverwrite) {
        if (shouldOverwrite === void 0) { shouldOverwrite = false; }
        var _a = this, gl = _a.gl, framebuffers = _a.framebuffers;
        if (framebuffers[textureName]) {
            if (!shouldOverwrite)
                console.warn("Already a framebuffer with the name " + textureName + ", use shouldOverwrite flag in initTexture() to ignore.");
            gl.deleteFramebuffer(framebuffers[textureName]);
        }
        var texture = this.textures[textureName];
        if (!texture) {
            throw new Error("Cannot init framebuffer, texture " + textureName + " does not exist.");
        }
        var framebuffer = gl.createFramebuffer();
        if (!framebuffer) {
            this.errorCallback("Could not init " + textureName + " framebuffer: " + gl.getError() + ".");
            return;
        }
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/framebufferTexture2D
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        if (status != gl.FRAMEBUFFER_COMPLETE) {
            this.errorCallback("Invalid status for " + textureName + " framebuffer: " + status + ".");
        }
        this.framebuffers[textureName] = framebuffer;
    };
    ;
    GPGPU.prototype.glTextureFormatForNumChannels = function (numChannels) {
        // TODO: for read only textures in WebGL 1.0, we could use gl.ALPHA and gl.LUMINANCE_ALPHA here.
        var gl = this.gl;
        switch (numChannels) {
            case 1:
                return {
                    glFormat: gl.RGB,
                    glNumChannels: 3,
                };
            case 2:
                return {
                    glFormat: gl.RGB,
                    glNumChannels: 3,
                };
            case 3:
                return {
                    glFormat: gl.RGB,
                    glNumChannels: 3,
                };
            case 4:
                return {
                    glFormat: gl.RGBA,
                    glNumChannels: 4,
                };
        }
    };
    GPGPU.prototype.glTextureTypeForType = function (type) {
        var gl = this.gl;
        switch (type) {
            case 'float16':
                if (gl.HALF_FLOAT)
                    return gl.HALF_FLOAT;
                return gl.HALF_FLOAT_OES;
            case 'uint8':
                return gl.UNSIGNED_BYTE;
        }
    };
    GPGPU.prototype.initTexture = function (textureName, width, height, type, numChannels, writable, data, shouldOverwrite) {
        if (writable === void 0) { writable = false; }
        if (shouldOverwrite === void 0) { shouldOverwrite = false; }
        var _a = this, gl = _a.gl, textures = _a.textures, framebuffers = _a.framebuffers;
        if (textures[textureName]) {
            if (!shouldOverwrite)
                console.warn("Already a texture with the name " + textureName + ", use shouldOverwrite flag to ignore.");
            gl.deleteTexture(textures[textureName]);
        }
        // Check that data is correct length.
        if (data && data.length !== width * height * numChannels) {
            throw new Error("Invalid data array of size " + data.length + " for texture of dimensions " + width + " x " + height + " x " + numChannels + ".");
        }
        var texture = gl.createTexture();
        if (!texture) {
            this.errorCallback("Could not init " + textureName + " texture: " + gl.getError() + ".");
            return;
        }
        gl.bindTexture(gl.TEXTURE_2D, texture);
        // TODO: dig into this.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        var filter = this.linearFilterEnabled ? gl.LINEAR : gl.NEAREST;
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
        // TODO: Check that data is correct type.
        // if (data && type === 'float16') {
        // 	// // Since there is no Float16TypedArray, we must convert Float32
        // 	// // to Float16 and pass in as an Int16TypedArray.
        // 	// const float16Array = new Int16Array(data.length);
        // 	// for (let i = 0; i < data.length; i++) {
        // 	// }
        // }
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D
        var _b = this.glTextureFormatForNumChannels(numChannels), glFormat = _b.glFormat, glNumChannels = _b.glNumChannels;
        var glType = this.glTextureTypeForType(type);
        // Check that data is correct length.
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
            data = newArray;
        }
        gl.texImage2D(gl.TEXTURE_2D, 0, glFormat, width, height, 0, glFormat, glType, data ? data : null);
        textures[textureName] = texture;
        if (!writable) {
            // Delete unused framebuffer if needed.
            if (shouldOverwrite && framebuffers[textureName]) {
                gl.deleteFramebuffer(framebuffers[textureName]);
                delete framebuffers[textureName];
            }
            return;
        }
        // Init a framebuffer for this texture so we can write to it.
        this.initFramebufferForTexture(textureName, shouldOverwrite);
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
    };
    ;
    GPGPU.prototype._step = function (programName, inputTextures, outputTexture) {
        var _a = this, gl = _a.gl, programs = _a.programs, framebuffers = _a.framebuffers;
        var program = programs[programName];
        if (!program) {
            throw new Error("Invalid program name: " + programName + ".");
        }
        gl.useProgram(program.program);
        var framebuffer = outputTexture ? framebuffers[outputTexture] : null;
        if (framebuffer === undefined) {
            throw new Error("Invalid output texture: " + outputTexture + ".");
        }
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        for (var i = 0; i < inputTextures.length; i++) {
            gl.activeTexture(gl.TEXTURE0 + i);
            gl.bindTexture(gl.TEXTURE_2D, this.textures[inputTextures[i]]);
        }
    };
    ;
    // Step for entire fullscreen rect.
    GPGPU.prototype.step = function (programName, inputTextures, outputTexture) {
        var _a = this, gl = _a.gl, errorState = _a.errorState, fsRectQuadBuffer = _a.fsRectQuadBuffer;
        // Ignore if we are in error state.
        if (errorState) {
            return;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, fsRectQuadBuffer);
        this._step(programName, inputTextures, outputTexture);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); // Draw to framebuffer.
    };
    // Step program only for a strip of px along the boundary.
    GPGPU.prototype.stepBoundary = function (programName, inputTextures, outputTexture) {
        var _a = this, gl = _a.gl, errorState = _a.errorState, fsRectBoundaryBuffer = _a.fsRectBoundaryBuffer;
        // Ignore if we are in error state.
        if (errorState) {
            return;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, fsRectBoundaryBuffer);
        this._step(programName, inputTextures, outputTexture);
        gl.drawArrays(gl.LINE_LOOP, 0, 4); // Draw to framebuffer.
    };
    // // Step program for all but a strip of px along the boundary.
    // stepNonBoundary(
    // 	programName: string,
    // 	inputTextures: string[],
    // 	outputTexture?: string, // Undefined renders to screen.
    // ) {
    // 	const { gl, errorState } = this;
    // 	// Ignore if we are in error state.
    // 	if (errorState) {
    // 		return;
    // 	}
    // 	this._step(programName, inputTextures, outputTexture);
    // 	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);// Draw to framebuffer.
    // }
    // // Step program only for a circular spot.
    // stepSpot(
    // 	programName: string,
    // 	inputTextures: string[],
    // 	outputTexture?: string, // Undefined renders to screen.
    // 	position: [number, number],
    // 	radius: number,
    // ) {
    // 	const { gl, errorState } = this;
    // 	// Ignore if we are in error state.
    // 	if (errorState) {
    // 		return;
    // 	}
    // 	this._step(programName, inputTextures, outputTexture);
    // 	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);// Draw to framebuffer.
    // }
    GPGPU.prototype.swapTextures = function (texture1Name, texture2Name) {
        var temp = this.textures[texture1Name];
        this.textures[texture1Name] = this.textures[texture2Name];
        this.textures[texture2Name] = temp;
        temp = this.framebuffers[texture1Name];
        this.framebuffers[texture1Name] = this.framebuffers[texture2Name];
        this.framebuffers[texture2Name] = temp;
    };
    ;
    // swap3Textures(
    // 	texture1Name: string,
    // 	texture2Name: string,
    // 	texture3Name: string,
    // ) {
    //     let temp = this.textures[texture3Name];
    //     this.textures[texture3Name] = this.textures[texture2Name];
    //     this.textures[texture2Name] = this.textures[texture1Name];
    //     this.textures[texture1Name] = temp;
    //     temp = this.framebuffers[texture3Name];
    //     this.framebuffers[texture3Name] = this.framebuffers[texture2Name];
    //     this.framebuffers[texture2Name] = this.framebuffers[texture1Name];
    //     this.framebuffers[texture1Name] = temp;
    // };
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
        var _a = this, gl = _a.gl, programs = _a.programs, framebuffers = _a.framebuffers, textures = _a.textures;
        // Unbind all data before deleting.
        Object.keys(programs).forEach(function (key) {
            var program = programs[key].program;
            gl.deleteProgram(program);
            delete programs[key];
        });
        Object.keys(framebuffers).forEach(function (key) {
            var framebuffer = framebuffers[key];
            gl.deleteFramebuffer(framebuffer);
            delete framebuffers[key];
        });
        Object.keys(textures).forEach(function (key) {
            var texture = textures[key];
            gl.deleteTexture(texture);
            delete textures[key];
        });
        for (var i = this.shaders.length - 1; i >= 0; i--) {
            if (this.shaders[i] === this.fsRectVertexShader) {
                continue;
            }
            // From https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/deleteShader
            // This method has no effect if the shader has already been deleted
            gl.deleteShader(this.shaders[i]);
            this.shaders.splice(i, 1);
        }
    };
    ;
    return GPGPU;
}());
exports.GPGPU = GPGPU;
//# sourceMappingURL=GPGPU.js.map