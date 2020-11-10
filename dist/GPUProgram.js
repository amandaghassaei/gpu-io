"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GPUProgram = void 0;
var constants_1 = require("./constants");
var utils_1 = require("./utils");
var GPUProgram = /** @class */ (function () {
    function GPUProgram(name, gl, errorCallback, vertexShader, fragmentShaderSource, uniforms) {
        var _this = this;
        this.uniforms = {};
        this.shaders = []; // Save ref to shaders so we can deallocate.
        // Save params.
        this.name = name;
        this.gl = gl;
        this.errorCallback = errorCallback;
        // Create a program.
        var program = gl.createProgram();
        if (!program) {
            errorCallback("Unable to init gl program: " + name + ".");
            return;
        }
        // Compile shader.
        var fragmentShader = utils_1.compileShader(gl, errorCallback, fragmentShaderSource, gl.FRAGMENT_SHADER);
        if (!fragmentShader) {
            errorCallback("Unable to compile fragment shader for program " + name + ".");
            return;
        }
        this.shaders.push(fragmentShader);
        // Attach the shaders.
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        // Link the program.
        gl.linkProgram(program);
        // Check if it linked.
        var success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!success) {
            // Something went wrong with the link.
            errorCallback("Program " + name + " failed to link: " + gl.getProgramInfoLog(program));
            return;
        }
        // Program has been successfully inited.
        this.program = program;
        uniforms === null || uniforms === void 0 ? void 0 : uniforms.forEach(function (uniform) {
            var name = uniform.name, value = uniform.value, dataType = uniform.dataType;
            _this.setUniform(name, value, dataType);
        });
    }
    GPUProgram.prototype.uniformTypeForValue = function (value, dataType) {
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
    GPUProgram.prototype.setUniform = function (uniformName, value, dataType) {
        var _a = this, gl = _a.gl, errorCallback = _a.errorCallback, program = _a.program, uniforms = _a.uniforms;
        if (!program) {
            errorCallback("Program not inited.");
            return;
        }
        // Set active program.
        gl.useProgram(program);
        var type = this.uniformTypeForValue(value, dataType);
        if (!uniforms[uniformName]) {
            // Init uniform if needed.
            var location_1 = gl.getUniformLocation(program, uniformName);
            if (!location_1) {
                errorCallback("Could not init uniform " + uniformName + ".\nCheck that uniform is present in shader code, unused uniforms may be removed by compiler.\nAlso check that uniform type in shader code matches type " + type + ".\nError code: " + gl.getError() + ".");
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
    GPUProgram.prototype.destroy = function () {
        var _a = this, gl = _a.gl, program = _a.program, shaders = _a.shaders;
        if (program)
            gl.deleteProgram(program);
        // Unbind all data before deleting.
        for (var i = 0; i < shaders.length; i++) {
            // From https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/deleteShader
            // This method has no effect if the shader has already been deleted
            gl.deleteShader(shaders[i]);
        }
        shaders.length = 0;
        // @ts-ignore;
        delete this.gl;
        // @ts-ignore;
        delete this.program;
    };
    return GPUProgram;
}());
exports.GPUProgram = GPUProgram;
//# sourceMappingURL=GPUProgram.js.map