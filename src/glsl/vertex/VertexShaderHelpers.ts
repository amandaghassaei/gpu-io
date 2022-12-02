export const VERTEX_SHADER_HELPERS_SOURCE = `
/**
 * Create UV coordinates from a 1D index for data stored in a texture of size "dimensions".
 */
vec2 uvFromIndex(const float index, const vec2 dimensions) {
	float y = floor((index + 0.5) / dimensions.x);
	float x = floor(index - y * dimensions.x + 0.5);
	return vec2(x + 0.5, y + 0.5) / dimensions;
}
vec2 uvFromIndex(const int index, const vec2 dimensions) {
	int width = int(dimensions.x);
	int y = index / width;
	int x = index - y * width;
	return vec2(float(x) + 0.5, float(y) + 0.5) / dimensions;
}
vec2 uvFromIndex(const float index, const ivec2 dimensions) {
	float width = float(dimensions.x);
	float y = floor((index + 0.5) / width);
	float x = floor(index - y * width + 0.5);
	return vec2(x + 0.5, y + 0.5) / vec2(dimensions);
}
vec2 uvFromIndex(const int index, const ivec2 dimensions) {
	int y = index / dimensions.x;
	int x = index - y * dimensions.x;
	return vec2(float(x) + 0.5, float(y) + 0.5) / vec2(dimensions);
}`
