"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataArray = void 0;
var utils_1 = require("./utils");
// TODO: handle wegbl1
// https://developer.mozilla.org/en-US/docs/Web/API/OES_vertex_array_object
var DataArray = /** @class */ (function () {
    function DataArray(name, gl, options, errorCallback, writable, numBuffers) {
        this.bufferIndex = 0;
        this.buffers = [];
        // Save params.
        this.name = name;
        this.gl = gl;
        this.errorCallback = errorCallback;
        if (numBuffers < 0 || numBuffers % 1 !== 0) {
            throw new Error("Invalid numBuffers: " + numBuffers + " for DataArray " + this.name + ", must be positive integer.");
        }
        this.numBuffers = numBuffers;
        // Save options.
        this.length = options.length;
        // Check that gl will support the datatype.
        this.type = this.checkType(options.type);
        this.numComponents = options.numComponents;
        this.writable = writable;
        this.glType = this.glTypeForType(this.type);
        this.initBuffers(options.data);
    }
    DataArray.prototype.checkType = function (type) {
        return type;
    };
    DataArray.prototype.glTypeForType = function (type) {
        var _a = this, gl = _a.gl, name = _a.name;
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
        if (type === 'float16') {
            if (utils_1.isWebGL2(gl)) {
                return gl.HALF_FLOAT;
            }
            throw new Error("Invalid type " + type + " for DataArray " + name + ".  Half float not supported in WebGL 1.0.");
        }
        if (type === 'float32') {
            return gl.FLOAT;
        }
        if (type === 'uint8') {
            return gl.UNSIGNED_BYTE;
        }
        if (type === 'int8') {
            return gl.BYTE;
        }
        if (type === 'uint16') {
            return gl.UNSIGNED_SHORT;
        }
        if (type === 'int16') {
            return gl.SHORT;
        }
        throw new Error("Invalid type " + type + " for DataArray " + name + ".");
    };
    DataArray.prototype.checkDataArray = function (data) {
        if (!data) {
            return;
        }
        // Check that data is correct length.
        var _a = this, length = _a.length, type = _a.type, numComponents = _a.numComponents, name = _a.name;
        // First check for a user error.
        if (data.length !== length * numComponents) {
            throw new Error("Invalid data length " + data.length + " for DataLayer " + name + " of length " + length + "x" + numComponents + ".");
        }
        // TODO: Check that data is correct type.
        // if (type === 'float16') {
        // 	// // Since there is no Float16TypedArray, we must us Uint16TypedArray
        // 	// const float16Array = new Int16Array(data.length);
        // 	// for (let i = 0; i < data.length; i++) {
        // 	// }
        // }
        return data;
    };
    DataArray.prototype.initBuffers = function (_data) {
        var _a = this, numBuffers = _a.numBuffers, gl = _a.gl, glType = _a.glType, numComponents = _a.numComponents, errorCallback = _a.errorCallback;
        var data = this.checkDataArray(_data);
        // Init a vertexArray for each buffer.
        for (var i = 0; i < numBuffers; i++) {
            // Init a vertexArray.
            var vertexArray = gl.createVertexArray();
            if (!vertexArray) {
                errorCallback("Could not init vertexArray for DataArray " + this.name + ": " + gl.getError() + ".");
                return;
            }
            gl.bindVertexArray(vertexArray);
            // Init a gl buffer.
            var glBuffer = gl.createBuffer();
            if (!glBuffer) {
                errorCallback("Could not init buffer for DataArray " + this.name + ": " + gl.getError() + ".");
                return;
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, glBuffer);
            // Copy data to buffer if needed.
            // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData
            if (data)
                gl.bufferData(gl.ARRAY_BUFFER, data, gl.STREAM_DRAW);
            var buffer = {
                vertexArray: vertexArray,
                buffer: glBuffer,
            };
            // Save this buffer to the list.
            this.buffers.push(buffer);
        }
        // Unbind.
        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    };
    DataArray.prototype.getCurrentStateArray = function () {
        return this.buffers[this.bufferIndex].vertexArray;
    };
    DataArray.prototype.bindInputArray = function (location) {
        var _a = this, gl = _a.gl, numComponents = _a.numComponents, glType = _a.glType;
        var _b = this.buffers[this.bufferIndex], vertexArray = _b.vertexArray, buffer = _b.buffer;
        gl.bindVertexArray(vertexArray);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        // Then init a vertex attribute pointer.
        gl.vertexAttribPointer(location, numComponents, glType, false, 0, 0);
        gl.enableVertexAttribArray(location);
    };
    DataArray.prototype.bindOutputBuffer = function (index) {
        var gl = this.gl;
        // Increment bufferIndex.
        this.bufferIndex = (this.bufferIndex + 1) % this.numBuffers;
        var buffer = this.buffers[this.bufferIndex].buffer;
        if (!buffer) {
            throw new Error("DataArray " + this.name + " is not writable.");
        }
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, index, buffer);
    };
    // resize(length: number, data?: DataArrayArrayType) {
    // 	this.destroyBuffers();
    // 	this.length = length;
    // 	this.initBuffers(data);
    // }
    DataArray.prototype.destroyBuffers = function () {
        var _a = this, gl = _a.gl, buffers = _a.buffers;
        buffers.forEach(function (_buffer) {
            var buffer = _buffer.buffer, vertexArray = _buffer.vertexArray;
            gl.deleteVertexArray(vertexArray);
            if (buffer) {
                gl.deleteBuffer(buffer);
            }
            // @ts-ignore
            delete _buffer.texture;
            // @ts-ignore
            delete _buffer.buffer;
        });
        buffers.length = 0;
    };
    DataArray.prototype.destroy = function () {
        this.destroyBuffers();
        // @ts-ignore
        delete this.gl;
        // @ts-ignore
        delete this.errorCallback;
    };
    return DataArray;
}());
exports.DataArray = DataArray;
//# sourceMappingURL=DataArray.js.map