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
        this.errorCallback = function () {
            self.errorState = true;
            errorCallback;
        };
        // Save canvas.
        // @ts-ignore
        canvasEl.addEventListener('resize', this.updateSize);
        this.updateSize(canvasEl);
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
        // Init a default vertex shader that just passes through screen coords.
        var fsRectVertexShader = this.compileShader(FSRectVertexShader_1.default, gl.VERTEX_SHADER);
        if (!fsRectVertexShader) {
            errorCallback('Unable to initialize fullscreen rect vertex shader.');
            return;
        }
        this.fsRectVertexShader = fsRectVertexShader;
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
        var gl = this.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
        // Look up where the vertex data needs to go.
        var positionLocation = gl.getAttribLocation(program, 'position');
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
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
    GPGPU.prototype.initProgram = function (programName, fragmentShaderSource, uniforms, vertexShaderSource) {
        var _this = this;
        var _a = this, programs = _a.programs, gl = _a.gl;
        if (programs[programName]) {
            gl.useProgram(programs[programName].program);
            console.warn("Already a program with the name " + programName + ".");
            return;
        }
        var fragmentShader = this.compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
        // Load fullscreen rect vertex shader by default.
        var vertexShader = vertexShaderSource ?
            this.compileShader(vertexShaderSource, gl.VERTEX_SHADER) :
            this.fsRectVertexShader;
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
        this.gl.useProgram(program); // TODO: need this?
        if (!vertexShaderSource) {
            // Load fullscreen rect vertex shader by default.
            this.loadFSRectPositions(program);
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
    // private setUniformForProgram(programName: string, uniformName: string, value: number, type: '1f'): void;
    // private setUniformForProgram(programName: string, uniformName: string, value: [number, number], type: '2f'): void;
    // private setUniformForProgram(programName: string, uniformName: string, value: [number, number, number], type: '3f'): void;
    // private setUniformForProgram(programName: string, uniformName: string, value: number, type: '1i'): void;
    GPGPU.prototype.setProgramUniform = function (programName, uniformName, value, dataType) {
        var _a = this, gl = _a.gl, programs = _a.programs;
        var program = programs[programName];
        if (!program) {
            throw new Error("Count not set uniform, no program of name: " + programName + ".");
        }
        var uniforms = program.uniforms;
        var type = this.uniformTypeForValue(value, dataType);
        if (!uniforms[uniformName]) {
            // Init uniform if needed.
            var location_1 = gl.getUniformLocation(program.program, uniformName);
            if (!location_1) {
                this.errorCallback("Could not init uniform: " + gl.getError());
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
    GPGPU.prototype.initFramebufferForTexture = function (textureName) {
        var _a = this, gl = _a.gl, framebuffers = _a.framebuffers;
        if (framebuffers[textureName]) {
            console.warn("Already a framebuffer with the name " + textureName + ".");
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
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        if (status != gl.FRAMEBUFFER_COMPLETE) {
            this.errorCallback("Invalid status for " + textureName + " framebuffer: " + status + ".");
        }
        this.framebuffers[textureName] = framebuffer;
    };
    ;
    GPGPU.prototype.glTextureFormatForNumChannels = function (numChannels) {
        var gl = this.gl;
        switch (numChannels) {
            case 1:
                return gl.ALPHA;
            case 2:
                return gl.LUMINANCE_ALPHA;
            case 3:
                return gl.RGB;
            case 4:
                return gl.RGBA;
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
    GPGPU.prototype.initTexture = function (textureName, width, height, type, numChannels, readwrite, data) {
        var _a = this, gl = _a.gl, textures = _a.textures;
        if (textures[textureName]) {
            console.warn("Already a texture with the name " + textureName + ".");
            gl.deleteTexture(textures[textureName]);
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
        // TODO: Check that data is correct type and size.
        if (data && type === 'float16') {
            // // Since there is no Float16TypedArray, we must convert Float32
            // // to Float16 and pass in as an Int16TypedArray.
            // const float16Array = new Int16Array(data.length);
            // for (let i = 0; i < data.length; i++) {
            // }
        }
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D
        var glFormat = this.glTextureFormatForNumChannels(numChannels);
        var glType = this.glTextureTypeForType(type);
        gl.texImage2D(gl.TEXTURE_2D, 0, glFormat, width, height, 0, glFormat, glType, data ? data : null);
        textures[textureName] = texture;
        if (readwrite === 'read') {
            return;
        }
        // Init a framebuffer for this texture so we can write to it.
        this.initFramebufferForTexture(textureName);
    };
    ;
    GPGPU.prototype.updateSize = function (canvasEl) {
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
    // TODO: add option to draw to screen.
    GPGPU.prototype.step = function (programName, inputTextures, outputTexture, // Null renders to screen.
    time) {
        // Ignore if we are in error state.
        if (this.errorState) {
            return;
        }
        var _a = this, gl = _a.gl, programs = _a.programs;
        var program = programs[programName];
        if (program)
            gl.useProgram(program.program);
        else
            throw new Error("Invalid program name: " + programName + ".");
        // // Optionally set time.
        // if (time) {
        // 	this.setUniformForProgram(programName, 'u_time', time, '1f');
        // }
        if (outputTexture) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffers[outputTexture]);
        }
        else {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }
        for (var i = 0; i < inputTextures.length; i++) {
            gl.activeTexture(gl.TEXTURE0 + i);
            gl.bindTexture(gl.TEXTURE_2D, this.textures[inputTextures[i]]);
        }
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); // Draw to framebuffer.
    };
    ;
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