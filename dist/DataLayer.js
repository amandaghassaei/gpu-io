"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataLayer = void 0;
var DataLayer = /** @class */ (function () {
    function DataLayer(gl, options, errorCallback, numBuffers, writable) {
        this.bufferIndex = 0;
        this.buffers = [];
        // check input parameters.
        if (numBuffers < 0 || numBuffers % 1 !== 0) {
            throw new Error("Invalid numBuffers: " + numBuffers + ", must be positive integer.");
        }
        this.numBuffers = numBuffers;
        // Save options.
        this.width = options.width;
        this.height = options.height;
        this.glInternalFormat = options.glInternalFormat;
        this.glFormat = options.glFormat;
        this.glType = options.glType;
        this.writable = writable;
        // Save ref to gl for later.
        this.gl = gl;
        this.errorCallback = errorCallback;
        this.initBuffers(options.data);
    }
    DataLayer.prototype.initBuffers = function (data) {
        var _a = this, numBuffers = _a.numBuffers, gl = _a.gl, width = _a.width, height = _a.height, glInternalFormat = _a.glInternalFormat, glFormat = _a.glFormat, glType = _a.glType, writable = _a.writable, errorCallback = _a.errorCallback;
        // Init a texture for each buffer.
        for (var i = 0; i < numBuffers; i++) {
            var texture = gl.createTexture();
            if (!texture) {
                errorCallback("Could not init texture: " + gl.getError() + ".");
                return;
            }
            gl.bindTexture(gl.TEXTURE_2D, texture);
            // TODO: dig into this.
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            var filter = gl.NEAREST; //this.linearFilterEnabled ? gl.LINEAR : gl.NEAREST;
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
                    errorCallback("Could not init framebuffer: " + gl.getError() + ".");
                    return;
                }
                gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
                // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/framebufferTexture2D
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
                var status_1 = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
                if (status_1 != gl.FRAMEBUFFER_COMPLETE) {
                    errorCallback("Invalid status for framebuffer: " + status_1 + ".");
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
            throw new Error('Calling getLastState on DataLayer with 1 buffer, no last state available.');
        }
        return this.buffers[this.bufferIndex].texture;
    };
    DataLayer.prototype.setAsRenderTarget = function () {
        var gl = this.gl;
        // Increment bufferIndex.
        this.bufferIndex = (++this.bufferIndex) % this.numBuffers;
        var framebuffer = this.buffers[this.bufferIndex].framebuffer;
        if (!framebuffer) {
            throw new Error('This DataLayer is not writable.');
        }
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    };
    DataLayer.prototype.resize = function (width, height, data) {
        this.destroyBuffers();
        this.width = width;
        this.height = height;
        this.initBuffers();
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