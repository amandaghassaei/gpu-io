"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataLayer = void 0;
var extensions_1 = require("./extensions");
var utils_1 = require("./utils");
var DataLayer = /** @class */ (function () {
    function DataLayer(name, gl, options, errorCallback, writable, numBuffers) {
        this.bufferIndex = 0;
        this.buffers = [];
        // Save params.
        this.name = name;
        this.gl = gl;
        this.errorCallback = errorCallback;
        if (numBuffers < 0 || numBuffers % 1 !== 0) {
            throw new Error("Invalid numBuffers: " + numBuffers + " for DataLayer " + this.name + ", must be positive integer.");
        }
        this.numBuffers = numBuffers;
        // Save options.
        this.width = options.width;
        this.height = options.height;
        // Check that gl will support the datatype.
        this.type = this.checkType(options.type);
        this.numChannels = options.numChannels;
        this.writable = writable;
        this.filter = this.checkFilter(options.filter ? options.filter : 'LINEAR', this.type);
        this.wrapS = gl[options.wrapS ? options.wrapS : 'CLAMP_TO_EDGE'];
        this.wrapT = gl[options.wrapT ? options.wrapT : 'CLAMP_TO_EDGE'];
        var _a = this.getGLTextureParameters(), glFormat = _a.glFormat, glInternalFormat = _a.glInternalFormat, glType = _a.glType, glNumChannels = _a.glNumChannels;
        this.glInternalFormat = glInternalFormat;
        this.glFormat = glFormat;
        this.glType = glType;
        this.glNumChannels = glNumChannels;
        this.initBuffers(options.data);
    }
    DataLayer.prototype.checkFilter = function (filter, type) {
        var _a = this, gl = _a.gl, errorCallback = _a.errorCallback;
        if (type === 'float16') {
            var extension = extensions_1.getExtension(gl, extensions_1.OES_TEXTURE_FLOAT_LINEAR, errorCallback, true) ||
                extensions_1.getExtension(gl, extensions_1.OES_TEXTURE_HAlF_FLOAT_LINEAR, errorCallback, true);
            if (!extension) {
                //TODO: add a fallback that does this filtering in the frag shader?.
                filter = 'NEAREST';
            }
        }
        if (type === 'float32') {
            var extension = extensions_1.getExtension(gl, extensions_1.OES_TEXTURE_FLOAT_LINEAR, errorCallback, true);
            if (!extension) {
                //TODO: add a fallback that does this filtering in the frag shader?.
                filter = 'NEAREST';
            }
        }
        return gl[filter];
    };
    DataLayer.prototype.checkType = function (type) {
        var _a = this, gl = _a.gl, errorCallback = _a.errorCallback;
        // Check if float32 supported.
        if (!utils_1.isWebGL2(gl) && type === 'float32') {
            var extension = extensions_1.getExtension(gl, extensions_1.OES_TEXTURE_FLOAT, errorCallback, true);
            if (!extension) {
                type = 'float16';
            }
        }
        // Must support at least half float if using a float type.
        if (!utils_1.isWebGL2(gl) && type === 'float16') {
            extensions_1.getExtension(gl, extensions_1.OES_TEXTURE_HALF_FLOAT, errorCallback);
        }
        // Load additional extensions if needed.
        if (utils_1.isWebGL2(gl) && (type === 'float16' || type === 'float32')) {
            extensions_1.getExtension(gl, extensions_1.EXT_COLOR_BUFFER_FLOAT, errorCallback);
        }
        return type;
    };
    DataLayer.prototype.checkDataArray = function (data) {
        if (!data) {
            return;
        }
        // Check that data is correct length.
        var _a = this, width = _a.width, height = _a.height, numChannels = _a.numChannels, glNumChannels = _a.glNumChannels, type = _a.type, name = _a.name;
        // First check for a user error.
        if (data.length !== width * height * numChannels) {
            throw new Error("Invalid data length " + data.length + " for DataLayer " + name + " of size " + width + "x" + height + "x" + numChannels + ".");
        }
        // Then check if we are using glNumChannels !== numChannels.
        var dataResized = data;
        if (data.length !== width * height * glNumChannels) {
            var imageSize = width * height;
            var newArray = void 0;
            switch (type) {
                case 'uint8':
                    newArray = new Uint8Array(width * height * glNumChannels);
                    break;
                case 'float32':
                    newArray = new Float32Array(width * height * glNumChannels);
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
        // TODO: Check that data is correct type.
        if (type === 'float16') {
            // // Since there is no Float16TypedArray, we must us Uint16TypedArray
            // const float16Array = new Int16Array(data.length);
            // for (let i = 0; i < data.length; i++) {
            // }
        }
        return dataResized;
    };
    DataLayer.prototype.getGLTextureParameters = function () {
        var _a = this, gl = _a.gl, numChannels = _a.numChannels, type = _a.type, writable = _a.writable, errorCallback = _a.errorCallback;
        // https://www.khronos.org/registry/webgl/specs/latest/2.0/#TEXTURE_TYPES_FORMATS_FROM_DOM_ELEMENTS_TABLE
        var glType, glFormat, glInternalFormat, glNumChannels;
        if (utils_1.isWebGL2(gl)) {
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
                    glType = extensions_1.getExtension(gl, extensions_1.OES_TEXTURE_HALF_FLOAT, errorCallback).HALF_FLOAT_OES;
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
    DataLayer.prototype.initBuffers = function (_data) {
        var _a = this, numBuffers = _a.numBuffers, gl = _a.gl, width = _a.width, height = _a.height, glInternalFormat = _a.glInternalFormat, glFormat = _a.glFormat, glType = _a.glType, filter = _a.filter, wrapS = _a.wrapS, wrapT = _a.wrapT, writable = _a.writable, errorCallback = _a.errorCallback;
        var data = this.checkDataArray(_data);
        // Init a texture for each buffer.
        for (var i = 0; i < numBuffers; i++) {
            var texture = gl.createTexture();
            if (!texture) {
                errorCallback("Could not init texture for DataLayer " + this.name + ": " + gl.getError() + ".");
                return;
            }
            gl.bindTexture(gl.TEXTURE_2D, texture);
            // TODO: are there other params to look into:
            // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
            gl.texImage2D(gl.TEXTURE_2D, 0, glInternalFormat, width, height, 0, glFormat, glType, data ? data : null);
            var buffer = {
                texture: texture,
            };
            if (writable) {
                // Init a framebuffer for this texture so we can write to it.
                var framebuffer = gl.createFramebuffer();
                if (!framebuffer) {
                    errorCallback("Could not init framebuffer for DataLayer " + this.name + ": " + gl.getError() + ".");
                    return;
                }
                gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
                // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/framebufferTexture2D
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
                var status_1 = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
                if (status_1 != gl.FRAMEBUFFER_COMPLETE) {
                    errorCallback("Invalid status for framebuffer for DataLayer " + this.name + ": " + status_1 + ".");
                }
                // Add framebuffer.
                buffer.framebuffer = framebuffer;
            }
            // Save this buffer to the list.
            this.buffers.push(buffer);
        }
    };
    DataLayer.prototype.getCurrentStateTexture = function () {
        return this.buffers[this.bufferIndex].texture;
    };
    DataLayer.prototype.getLastStateTexture = function () {
        if (this.numBuffers === 1) {
            throw new Error("Calling getLastState on DataLayer " + this.name + " with 1 buffer, no last state available.");
        }
        return this.buffers[this.bufferIndex].texture;
    };
    DataLayer.prototype.setAsRenderTarget = function (incrementBufferIndex) {
        var gl = this.gl;
        if (incrementBufferIndex) {
            // Increment bufferIndex.
            this.bufferIndex = (this.bufferIndex + 1) % this.numBuffers;
        }
        var framebuffer = this.buffers[this.bufferIndex].framebuffer;
        if (!framebuffer) {
            throw new Error("DataLayer " + this.name + " is not writable.");
        }
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    };
    DataLayer.prototype.resize = function (width, height, data) {
        this.destroyBuffers();
        this.width = width;
        this.height = height;
        this.initBuffers(data);
    };
    DataLayer.prototype.destroyBuffers = function () {
        var _a = this, gl = _a.gl, buffers = _a.buffers;
        buffers.forEach(function (buffer) {
            var framebuffer = buffer.framebuffer, texture = buffer.texture;
            gl.deleteTexture(texture);
            if (framebuffer) {
                gl.deleteFramebuffer(framebuffer);
            }
            // @ts-ignore;
            delete buffer.texture;
            delete buffer.framebuffer;
        });
        buffers.length = 0;
    };
    DataLayer.prototype.destroy = function () {
        this.destroyBuffers();
        // @ts-ignore;
        delete this.gl;
    };
    return DataLayer;
}());
exports.DataLayer = DataLayer;
//# sourceMappingURL=DataLayer.js.map