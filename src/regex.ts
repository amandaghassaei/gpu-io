import { GLSLVersion, GLSL3 } from './constants';

/**
 * Helper functions for converting GLSL3 to GLSL1 and checking for valid shader code.
 */

export function glsl1VertexIn(shaderSource: string) {
	// Convert vertex shader in to attribute.
	return shaderSource.replace(/\bin\b/, 'attribute');
}

export function glsl1VertexOut(shaderSource: string) {
	// Convert vertex shader out to varying.
	return shaderSource.replace(/\bout\b/g, 'varying');
}

export function glsl1FragmentIn(shaderSource: string) {
	// Convert fragment shader in to varying.
	return shaderSource.replace(/\bin\b/g, 'varying');
}

export function glsl1FragmentOut(shaderSource: string) {
	// Convert out_fragColor to gl_FragColor.
	shaderSource = shaderSource.replace(/\bout\s+((lowp|mediump|highp)\s+)?\w+\s+out_fragColor;/g, '');
	const output = shaderSource.match(/(?<=out_fragColor\s*=\s*).+(?=;)/s); // /s makes this work for multiline.
	if (output) {
		shaderSource = shaderSource.replace(/\bout_fragColor\s*=\s*.+;/s, `gl_FragColor = vec4(${output[0]});`);
	}
	return shaderSource;
}

/**
 * Check that out_fragColor or gl_FragColor is present in fragment shader source.
 * @private 
 */
 export function checkFragmentShaderForFragColor(shaderSource: string, glslVersion: GLSLVersion, name: string) {
	const gl_FragColor = shaderSource.match(/\bgl_FragColor\s?=/);
	const out_fragColor = shaderSource.match(/\bout_fragColor\s?=/);
	if (glslVersion === GLSL3) {
		// Check that fragment shader source DOES NOT contain gl_FragColor
		if (gl_FragColor) {
			throw new Error(`Found "gl_FragColor" declaration in fragment shader for GPUProgram "${name}": either init GPUComposer with glslVersion = GLSL1 or use GLSL3 syntax in your fragment shader.`);
		}
		// Check that fragment shader source DOES contain out_fragColor.
		if (!out_fragColor) {
			throw new Error(`Found no "out_fragColor" (GLSL3) or "gl_FragColor" (GLSL1) declarations or  in fragment shader for GPUProgram "${name}".`);
		}
	} else {
		// Check that fragment shader source DOES contain either gl_FragColor or out_fragColor.
		if (!gl_FragColor && !out_fragColor) {
			throw new Error(`Found no "out_fragColor" (GLSL3) or "gl_FragColor" (GLSL1) declarations or  in fragment shader for GPUProgram "${name}".`);
		}
	}
	return true;
}

export function glsl1Texture(shaderSource: string) {
	// Convert texture to texture2D.
	// TODO: add polyfills.
	return shaderSource.replace(/\btexture\(/g, 'texture2D(');
}

export function glsl1Sampler2D(shaderSource: string) {
	// No isampler2D or usampler2D.
	return shaderSource.replace(/((\bisampler2D\b)|(\busampler2D\b))/g, 'sampler2D');
}

export function glsl1Uint(shaderSource: string) {
	// Unsigned int types are not supported, use int types instead.
	shaderSource = shaderSource.replace(/\buint\b/g, 'int');
	shaderSource = shaderSource.replace(/\buvec2\b/g, 'ivec2');
	shaderSource = shaderSource.replace(/\buvec3\b/g, 'ivec3');
	shaderSource = shaderSource.replace(/\buvec4\b/g, 'ivec4');
	shaderSource = shaderSource.replace(/\buint\(/g, 'int(');
	shaderSource = shaderSource.replace(/\buvec2\(/g, 'ivec2(');
	shaderSource = shaderSource.replace(/\buvec3\(/g, 'ivec3(');
	shaderSource = shaderSource.replace(/\buvec4\(/g, 'ivec4(');
	return shaderSource;
}

export function highpToMediump(shaderSource: string) {
	// Replace all highp with mediump.
	return shaderSource.replace(/\bhighp\b/, 'mediump');
}

export function stripVersion(shaderSource: string) {
	// Strip out any version numbers.
	// https://github.com/Jam3/glsl-version-regex
	const origLength = shaderSource.length;
	shaderSource = shaderSource.replace(/^\s*\#version\s+([0-9]+(\s+(es)+)?)\s*/, '');
	if (shaderSource.length !== origLength) {
		console.warn('GPUIO expects shader source that does not contain #version declarations, removing....');
	}
	return shaderSource;
}

export function stripPrecision(shaderSource: string) {
	// Strip out any precision declarations.
	const origLength = shaderSource.length;
	shaderSource = shaderSource.replace(/\s*precision\s+((highp)|(mediump)|(lowp))\s+[a-zA-Z0-9]+\s*;/g, '');
	if (shaderSource.length !== origLength) {
		console.warn('GPUIO expects shader source that does not contain precision declarations, removing....');
	}
	return shaderSource;
}

export function stripComments(shaderSource: string) {
	// TODO: implement this.
	return shaderSource;
}