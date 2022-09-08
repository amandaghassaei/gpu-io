export const VERTEX_SHADER_HELPERS_SOURCE = `
/**
 * Returns accurate MOD when arguments are approximate integers.
 */
float modI(float a, float b) {
    float m = a - floor((a + 0.5) / b) * b;
    return floor(m + 0.5);
}

/**
 * Create UV coordinates from a 1D index for data stored in a texture of size "dimensions".
 */
vec2 uvFromIndex(const float index, const vec2 dimensions) {
    return vec2(
        modI(index, dimensions.x),
		floor(floor(index + 0.5) / dimensions.x)
	) / dimensions;
}
vec2 uvFromIndex(const int index, const vec2 dimensions) {
    int width = int(dimensions.x);
    int y = index / width;
    return vec2(
        index - y * width,
		y
	) / dimensions;
}`
