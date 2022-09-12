const setUniformsValueFragmentShader = `
uniform uint u_uvalue1;
uniform uvec2 u_uvalue2;
uniform uvec3 u_uvalue3;
uniform uvec4 u_uvalue4;

uniform int u_ivalue1;
uniform ivec2 u_ivalue2;
uniform ivec3 u_ivalue3;
uniform ivec4 u_ivalue4;

uniform float u_fvalue1;
uniform vec2 u_fvalue2;
uniform vec3 u_fvalue3;
uniform vec4 u_fvalue4;

uniform bool u_bvalue1;
uniform bvec2 u_bvalue2;
uniform bvec3 u_bvalue3;
uniform bvec4 u_bvalue4;

out vec4 out_FragColor;
void main() {
	out_FragColor = vec4(
		u_uvalue1 + u_uvalue2.x + u_uvalue2.y + u_uvalue3.x + u_uvalue3.y + u_uvalue3.z + u_uvalue4.x + u_uvalue4.y + u_uvalue4.z + u_uvalue4.a,
		u_ivalue1 + u_ivalue2.x + u_ivalue2.y + u_ivalue3.x + u_ivalue3.y + u_ivalue3.z + u_ivalue4.x + u_ivalue4.y + u_ivalue4.z + u_ivalue4.a,
		u_fvalue1 + u_fvalue2.x + u_fvalue2.y + u_fvalue3.x + u_fvalue3.y + u_fvalue3.z + u_fvalue4.x + u_fvalue4.y + u_fvalue4.z + u_fvalue4.a,
		(u_bvalue1 ? 1 : 0) + (u_bvalue2.x ? 1 : 0) + (u_bvalue2.y ? 1 : 0) + (u_bvalue3.x ? 1 : 0) + (u_bvalue3.y ? 1 : 0) + (u_bvalue3.z ? 1 : 0) + (u_bvalue4.x ? 1 : 0) + (u_bvalue4.y ? 1 : 0) + (u_bvalue4.z ? 1 : 0) + (u_bvalue4.a ? 1 : 0)
	);
}`;