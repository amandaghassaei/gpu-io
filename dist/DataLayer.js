"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataLayer = void 0;
var DataLayer = /** @class */ (function () {
    function DataLayer(gl, options, errorCallback, numBuffers, writable) {
        this.bufferIndex = 0;
        this.buffers = [];
        if (numBuffers < 0 || numBuffers % 1 !== numBuffers) {
            throw new Error('Invalid numBuffers, must be positive integer.');
        }
        this.numBuffers = numBuffers;
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
            gl.texImage2D(gl.TEXTURE_2D, 0, options.glInternalFormat, options.width, options.height, 0, options.glFormat, options.glType, options.data ? options.data : null);
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
    }
    DataLayer.prototype.getCurrentStateTexture = function () {
        return this.buffers[this.bufferIndex].texture;
    };
    DataLayer.prototype.getLastStateTexture = function () {
        if (this.numBuffers === 1) {
            throw new Error('Calling getLastState on DataLayer with 1 buffer, no last state available.');
        }
        return this.buffers[this.bufferIndex].texture;
    };
    DataLayer.prototype.renderTo = function (gl) {
        // Increment bufferIndex.
        this.bufferIndex = (++this.bufferIndex) % this.numBuffers;
        var framebuffer = this.buffers[this.bufferIndex].framebuffer;
        if (!framebuffer) {
            throw new Error('This DataLayer is not writable.');
        }
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    };
    DataLayer.prototype.destroy = function () {
        // Object.keys(framebuffers).forEach(key => {
        // 	const framebuffer = framebuffers[key];
        // 	gl.deleteFramebuffer(framebuffer);
        // 	delete framebuffers[key];
        // });
        // Object.keys(textures).forEach(key => {
        // 	const texture = textures[key];
        // 	gl.deleteTexture(texture);
        // 	delete textures[key];
        // });
    };
    return DataLayer;
}());
exports.DataLayer = DataLayer;
//# sourceMappingURL=DataLayer.js.map