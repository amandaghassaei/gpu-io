import { GLSLVersion, GLSL3 } from './constants';

/**
 * Helper functions for converting GLSL3 to GLSL1 and checking for valid shader code.
 * Note: there is no positive lookbehind support in some browsers, use capturing parens instead.
 * https://stackoverflow.com/questions/3569104/positive-look-behind-in-javascript-regular-expression/3569116#3569116
 */

type GLSLType = 'float' | 'int' | 'uint' | 'vec2' | 'vec3' | 'vec4' | 'ivec2' | 'ivec3' | 'ivec4' | 'uvec2' | 'uvec3' | 'uvec4';

/**
 * Convert vertex shader "in" to "attribute".
 * @private
 */
export function glsl1VertexIn(shaderSource: string) {
	return shaderSource.replace(/\bin\b/g, 'attribute');
}

function escapeRegExp(string: string){
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

/**
 * Typecast variable assignment.
 * This is used in cases when e.g. varyings have to be converted to float in GLSL1.
 */
function typecastVariable(shaderSource: string, variableName: string, type: string) {
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
 * Get variable name, type, and layout number for out variables.
 * Only exported for testing.
 * @private
 */
export function getFragmentOuts(shaderSource: string, programName: string) {
	const outs: { [key: string]: {
		location: number,
		type: GLSLType,
	}} = {};
	let maxLocation = 0;
	while (true) {
		// Do this without lookbehind to support older browsers.
		const match = shaderSource.match(/\b(layout\s*\(\s*location\s*=\s*([0-9]+)\s*\)\s*)?out\s+((lowp|mediump|highp)\s+)?((float|int|uint|([iu]?vec[234]))\s+)?([_$a-zA-Z0-9]+)\s*;/);
		if (!match) {
			if (Object.keys(outs).length === 0) {
				return [];
			}
			// Sort by location.
			const variableNames = Object.keys(outs);
			const numVariables = variableNames.length;
			const outsSorted: {
				name: string,
				type: GLSLType,
			}[] = new Array(maxLocation).fill(undefined);
			
			for (let i = 0; i < numVariables; i++) {
				const name = variableNames[i];
				const { location, type } = outs[name];
				if (outsSorted[location] !== undefined) {
					throw new Error(`Must be exactly one out declaration per layout location in GPUProgram "${programName}", conflicting declarations found at location ${location}.`);
				}
				outsSorted[location] =  { name, type };
			}
			if (variableNames.length !== maxLocation + 1) {
				throw new Error(`Must be exactly one out declaration per layout location in GPUProgram "${programName}", layout locations must be sequential (no missing location numbers) starting from 0.`);
			}
			for (let i = 0; i <= maxLocation; i++) {
				if (outsSorted[i] === undefined) {
					throw new Error(`Missing out declaration at location ${i} in GPUProgram "${programName}", layout locations must be sequential (no missing location numbers) starting from 0.`);
				}
			}
			return outsSorted;
		}
		// Save out parameters.
		const name = match[8];
		const location = parseInt(match[2] || '0');
		const type = match[6] as GLSLType;
		if (!type) {
			throw new Error(`No type found for out declaration "${match[0]}" for GPUProgram "${programName}".`);
		}
		if (!name) {
			throw new Error(`No variable name found for out declaration "${match[0]}" for GPUProgram "${programName}".`);
		}
		if (outs[name]) {
			if (outs[name].location !== location) {
				throw new Error(`All out declarations for variable "${name}" must have same location in GPUProgram "${programName}".`);
			}
		} else {
			if (location > maxLocation) maxLocation = location;
			outs[name] = {
				location,
				type,
			};
		}
		// Remove out definition so we can match to the next one.
		shaderSource = shaderSource.replace(match[0], '');
	}
}

/**
 * Convert out variables to gl_FragColor.
 * @private
 */
export function glsl1FragmentOut(shaderSource: string, programName: string) {
	const outs = getFragmentOuts(shaderSource, programName);
	if (outs.length === 0) {
		return [shaderSource];
	}
	// Remove layout declarations.
	shaderSource = shaderSource.replace(/\blayout\s*\(\s*location\s*=\s*([0-9]+)\s*\)\s*/g, '');
	// If we detect multiple out declarations, we need to split the shader source.

	const shaderSources: string[] = [];
	for (let i = 0, numOuts = outs.length; i < numOuts; i++) {
		const { type, name } = outs[i];

		// Remove out declaration for this variable.
		const outRegex = new RegExp(`\\bout\\s+((lowp|mediump|highp)\\s+)?(float|int|uint|([iu]?vec[234]))\\s+${name}\\s*;`, 'g');
		let outShaderSource = shaderSource.replace(outRegex, '');
		// Remove any other out declarations.
		outShaderSource = outShaderSource.replace(/\bout\b/g, '');

		let assignmentFound = false;
		// Replace each instance of "name =" with gl_FragColor = and cast to vec4.
		// Do this without lookbehind to support older browsers.
		// const output = outShaderSource.match(/(?<=\b${name}\s*=\s*)\S.*(?=;)/s); // /s makes this work for multiline.
		// ? puts this in lazy mode (match shortest strings).
		const regex = new RegExp(`\\b${name}\\s*=\\s*(\\S.*?);`, 's'); // 's' makes this work for multiline.
		while (true) {
			const output = outShaderSource.match(regex);
			if (output && output[1]) {
				assignmentFound = true;
				let filler = '';
				switch (type) {
					case 'float':
					case 'int':
					case 'uint':
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
				outShaderSource = outShaderSource.replace(regex, `gl_FragColor = vec4(${output[1]}${filler});`);
			} else {
				if (!assignmentFound) throw new Error(`No assignment found for out declaration in GPUProgram "${programName}".`);
				break;
			}
		}
		shaderSources.push(outShaderSource);
	}
	return shaderSources;
}

/**
 * Contains gl_FragColor.
 * @private
 */
 function containsGLFragColor(shaderSource: string) {
	return !!shaderSource.match(/\bgl_FragColor\b/);
}

/**
 * Check for presence of gl_FragColor in fragment shader source.
 * @private 
 */
 export function checkFragmentShaderForFragColor(shaderSource: string, glslVersion: GLSLVersion, name: string) {
	const gl_FragColor = containsGLFragColor(shaderSource);
	if (glslVersion === GLSL3) {
		// Check that fragment shader source DOES NOT contain gl_FragColor
		if (gl_FragColor) {
			throw new Error(`Found "gl_FragColor" declaration in fragment shader for GPUProgram "${name}": either init GPUComposer with glslVersion = GLSL1 or use GLSL3 syntax in your fragment shader.`);
		}
	}
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
	shaderSource = shaderSource.replace(/[\t ]*\/\/.*\n/g, ''); // Remove single-line comments.
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
	const regex = '\\buniform\\s+(((highp)|(mediump)|(lowp))\\s+)?(i|u)?sampler2D\\s+(\\w+)\\s*;';
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