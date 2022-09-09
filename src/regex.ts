import { GLSLVersion, GLSL3 } from './constants';

/**
 * Helper functions for converting GLSL3 to GLSL1 and checking for valid shader code.
 * Note: there is no positive lookbehind support in some browsers, use capturing parens instead.
 * https://stackoverflow.com/questions/3569104/positive-look-behind-in-javascript-regular-expression/3569116#3569116
 */

function escapeRegExp(string: string){
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

/**
 * Typecast variable assignment.
 * This is used in cases when e.g. varyings have to be converted to float in GLSL1.
 * @private
 */
export function typecastVariable(shaderSource: string, variableName: string, type: string) {
	// "s" makes this work for multiline values.
	// Do this without lookbehind to support older browsers.
	// const regexMatch = new RegExp(`(?<=\\b${escapeRegExp(variableName)}\\s*=\\s*)\\S[^;]*(?=;)`, 'sg');
	const regexMatch = new RegExp(`\\b${escapeRegExp(variableName)}\\s*=\\s*\\S[^;]*;`, 'sg');
	const assignmentExpressions = shaderSource.match(regexMatch);
	if (assignmentExpressions) {
		// Loop through all places where variable is assigned and typecast.
		for (let i = 0; i < assignmentExpressions.length; i++) {
			const regexValueMatch = new RegExp(`\\b${escapeRegExp(variableName)}\\s*=\\s*(\\S[^;]*);`, 's');
			const value = assignmentExpressions[i].match(regexValueMatch);
			if (value && value[1]) {
				const regexReplace = new RegExp(`\\b${escapeRegExp(variableName)}\\s*=\\s*${escapeRegExp(value[1])}\\s*;`, 's');
				shaderSource = shaderSource.replace(regexReplace, `${variableName} = ${type}(${value[1]});`);
			} else {
				console.warn(`Could not find value in expression: "${assignmentExpressions[i]}"`);
			}
		}
	} else {
		console.warn(`No assignment found for shader variable ${variableName}.`);
	}
	return shaderSource;
}

/**
 * Convert vertex shader "in" to "attribute".
 * @private
 */
export function glsl1VertexIn(shaderSource: string) {
	return shaderSource.replace(/\bin\b/g, 'attribute');
}

/**
 * Convert int varyings to float types.
 * Also update any variable assignments so that they are cast to float.
 * @private
 */
function _castVaryingToFloat(shaderSource: string, regexString: string, type: string) {
	// Do this without lookbehind to support older browsers.
	// const regexMatch = new RegExp(`(?<=${regexString}\\s+)\\S[^;]*(?=;)`, 'g');
	const regexMatch = new RegExp(`${regexString}\\s+\\S[^;]*;`, 'g');
	const castToFloatExpressions = shaderSource.match(regexMatch);
	if (castToFloatExpressions) {
		// Replace all with new type.
		const regexReplace = new RegExp(`${regexString}\\b`, 'g');
		shaderSource = shaderSource.replace(regexReplace, `varying ${type}`);
		// Loop through each expression, grab variable name, and cast all assignments.
		for (let i = 0; i < castToFloatExpressions.length; i++) {
			const regexVariableMatch = new RegExp(`${regexString}\\s+(\\S[^;]*);`);
			const variable = castToFloatExpressions[i].match(regexVariableMatch);
			if (variable && variable[2]) {
				shaderSource = typecastVariable(shaderSource, variable[2], type);
			} else {
				console.warn(`Could not find variable name in expression: "${castToFloatExpressions[i]}"`);
			}
		}
	}
	return shaderSource;
}

/**
 * Convert int varyings to float types.
 * Only exported for testing.
 * @private
 */
export function castVaryingToFloat(shaderSource: string) {
	// Need to init all expressions with the same number of capturing groups
	// so that this will work in _castVaryingToFloat.
	shaderSource = _castVaryingToFloat(shaderSource, '\\bvarying\\s+(u)?int', 'float');
	shaderSource = _castVaryingToFloat(shaderSource, '\\bvarying\\s+(i|u)vec2', 'vec2');
	shaderSource = _castVaryingToFloat(shaderSource, '\\bvarying\\s+(i|u)vec3', 'vec3');
	shaderSource = _castVaryingToFloat(shaderSource, '\\bvarying\\s+(i|u)vec4', 'vec4');
	return shaderSource;
}

/**
 * Convert vertex shader "out" to "varying".
 * Also remove "flat" if necessary.
 * Also cast as float if necessary.
 * @private
 */
export function glsl1VertexOut(shaderSource: string) {
	shaderSource = shaderSource.replace(/(\bflat\s+)?\bout\b/g, 'varying');
	shaderSource = castVaryingToFloat(shaderSource);
	return shaderSource;
}

/**
 * Convert fragment shader "in" to "varying".
 * Also remove "flat" if necessary.
 * Also cast as float if necessary.
 * @private
 */
export function glsl1FragmentIn(shaderSource: string) {
	shaderSource = shaderSource.replace(/(\bflat\s+)?\bin\b/g, 'varying');
	shaderSource = castVaryingToFloat(shaderSource);
	return shaderSource;
}

/**
 * Contains out_fragColor.
 * @private
 */
function containsOutFragColor(shaderSource: string) {
	return !!shaderSource.match(/\bout_fragColor\b/);
}

/**
 * Contains gl_FragColor.
 * @private
 */
function containsGLFragColor(shaderSource: string) {
	return !!shaderSource.match(/\bgl_FragColor\b/);
}

/**
 * Get type (int, float, vec3, etc) of fragment out.
 * Only exported for testing.
 * @private
 */
export function getFragmentOutType(shaderSource: string, name: string) {
	// Do this without lookbehind to support older browsers.
	// const type = shaderSource.match(/(?<=\bout\s+((lowp|mediump|highp)\s+)?)(float|int|((i|u)?vec(2|3|4)))(?=\s+out_fragColor;)/);
	const type = shaderSource.match(/\bout\s+((lowp|mediump|highp)\s+)?((float|int|((i|u)?vec(2|3|4))))\s+out_fragColor;/);
	if (!type || !type[3]) {
		throw new Error(`No type found in out_fragColor declaration for GPUProgram "${name}".`);
	}
	return type[3] as 'float' | 'int' | 'vec2' | 'vec3' | 'vec4' | 'ivec2' | 'ivec3' | 'ivec4' | 'uvec2' | 'uvec3' | 'uvec4';
}

/**
 * Convert out_fragColor to gl_FragColor.
 * @private
 */
export function glsl1FragmentOut(shaderSource: string, name: string) {
	if (containsOutFragColor(shaderSource)) {
		const type = getFragmentOutType(shaderSource, name);
		// Remove out_fragColor declaration.
		shaderSource = shaderSource.replace(/\bout\s+((lowp|mediump|highp)\s+)?\w+\s+out_fragColor\s*;/g, '');
		let assignmentFound = false;
		while (true) {
			// Replace each instance of out_fragColor = with gl_FragColor = and cast to vec4.
			// Do this without lookbehind to support older browsers.
			// const output = shaderSource.match(/(?<=\bout_fragColor\s*=\s*)\S.*(?=;)/s); // /s makes this work for multiline.
			const output = shaderSource.match(/\bout_fragColor\s*=\s*(\S.*);/s); // /s makes this work for multiline.
			if (output && output[1]) {
				assignmentFound = true;
				let filler = '';
				switch (type) {
					case 'float':
					case 'int':
						filler = ', 0, 0, 0';
						break;
					case 'vec2':
					case 'ivec2':
					case 'uvec2':
						filler = ', 0, 0';
						break;
					case 'vec3':
					case 'ivec3':
					case 'uvec3':
						filler = ', 0';
						break;
				}
				shaderSource = shaderSource.replace(/\bout_fragColor\s*=\s*.+;/s, `gl_FragColor = vec4(${output[1]}${filler});`);
			} else {
				if (!assignmentFound) throw new Error(`No assignment found for out_fragColor in GPUProgram "${name}".`);
				break;
			}
		}
	}
	return shaderSource;
}

/**
 * Check that out_fragColor or gl_FragColor is present in fragment shader source.
 * @private 
 */
 export function checkFragmentShaderForFragColor(shaderSource: string, glslVersion: GLSLVersion, name: string) {
	const gl_FragColor = containsGLFragColor(shaderSource);
	const out_fragColor = containsOutFragColor(shaderSource);
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

/**
 * Convert texture to texture2D.
 * @private
 */
export function glsl1Texture(shaderSource: string) {
	return shaderSource.replace(/\btexture\(/g, 'texture2D(');
}

/**
 * Convert isampler2D and usampler2D to sampler2D.
 * @private
 */
export function glsl1Sampler2D(shaderSource: string) {
	return shaderSource.replace(/\b(i|u)sampler2D\b/g, 'sampler2D');
}

/**
 * Unsigned int types are not supported, use int types instead.
 * @private
 */
export function glsl1Uint(shaderSource: string) {
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

/**
 * Replace all highp with mediump.
 * @private
 */
export function highpToMediump(shaderSource: string) {
	return shaderSource.replace(/\bhighp\b/, 'mediump');
}

/**
 * Strip out any version numbers.
 * https://github.com/Jam3/glsl-version-regex
 * @private
 */
export function stripVersion(shaderSource: string) {
	const origLength = shaderSource.length;
	shaderSource = shaderSource.replace(/^\s*\#version\s+([0-9]+(\s+(es)+)?)\s*/, '');
	if (shaderSource.length !== origLength) {
		console.warn('GPUIO expects shader source that does not contain #version declarations, removing....');
	}
	return shaderSource;
}

/**
 * Strip out any precision declarations.
 * @private
 */
export function stripPrecision(shaderSource: string) {
	const origLength = shaderSource.length;
	shaderSource = shaderSource.replace(/\s*precision\s+((highp)|(mediump)|(lowp))\s+[a-zA-Z0-9]+\s*;/g, '');
	if (shaderSource.length !== origLength) {
		console.warn('GPUIO expects shader source that does not contain precision declarations, removing....');
	}
	return shaderSource;
}

/**
 * Strip out comments from shader code.
 * @private
 */
export function stripComments(shaderSource: string) {
	shaderSource = shaderSource.replace(/\s?\/\/.*\n/g, ''); // Remove single-line comments.
	// ? puts this in lazy mode (match shortest strings).
	shaderSource = shaderSource.replace(/\/\*.*?\*\//gs, ''); /* Remove multi-line comments */
	return shaderSource;
}

/**
 * Get the number of sampler2D's in a fragment shader program.
 * @private
 */
export function getSampler2DsInProgram(shaderSource: string) {
	// Do this without lookbehind to support older browsers.
	// const samplers = shaderSource.match(/(?<=\buniform\s+(((highp)|(mediump)|(lowp))\s+)?(i|u)?sampler2D\s+)\w+(?=\s?;)/g);
	const samplersNoDuplicates: {[key: string]: boolean} = {};
	const regex = '\\buniform\\s+(((highp)|(mediump)|(lowp))\\s+)?(i|u)?sampler2D\\s+(\\w+)\\s?;';
	const samplers = shaderSource.match(new RegExp(regex, 'g'));
	if (!samplers || samplers.length === 0) return [];
	// We need to be a bit careful as same sampler could be declared multiple times if compile time conditionals are used.
	// Extract uniform name.
	const uniformMatch = new RegExp(regex);
	samplers.forEach(sampler => {
		const uniform = sampler.match(uniformMatch);
		if (!uniform || !uniform[7]) {
			console.warn(`Could not find sampler2D uniform name in string "${sampler}".`);
			return;
		}
		samplersNoDuplicates[uniform[7]] = true;
	})
	return Object.keys(samplersNoDuplicates);
}