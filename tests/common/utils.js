function calculateExpectedValue(dimX, dimY, numElements, input, type, filter, wrap, offset) {
	if (offset === 0) return input;

	const {
		NEAREST,
		CLAMP_TO_EDGE,
		HALF_FLOAT,
	} = WebGLCompute;

	const expected = input.slice();

	if (filter === NEAREST) offset = Math.round(offset);

	function wrapIndex(x, y, el) {
		if (wrap === REPEAT) {
			x = (x + dimX) % dimX;
			y = (y + dimY) % dimY;
		} else if (wrap === CLAMP_TO_EDGE) {
			if (x < 0) x = 0;
			if (y < 0) y = 0;
			if (x >= dimX) x = dimX - 1;
			if (y >= dimY) y = dimY - 1;
		}
		return (y * dimX + x) * numElements + el;
	}

	const uint16Array = new Uint16Array(1);
	const view = new DataView(uint16Array.buffer);
	function castPrecision(val) {
		if (type === HALF_FLOAT) {
			setFloat16(view, 0,  val, true);
			return getFloat16(view, 0, true);
		}
		return val;
	}

	function bilinearInterp(x, y, el) {
		// Bilinear interpolation.
		const minX = Math.floor(x);
		const minY = Math.floor(y);
		const maxX = Math.ceil(x);
		const maxY = Math.ceil(y);
		const indexMinMin = wrapIndex(minX, minY, el);
		const indexMinMax = wrapIndex(minX, maxY, el);
		const indexMaxMin = wrapIndex(maxX, minY, el);
		const indexMaxMax = wrapIndex(maxX, maxY, el);
		const valMinMin = castPrecision(input[indexMinMin]);
		const valMinMax = castPrecision(input[indexMinMax]);
		const valMaxMin = castPrecision(input[indexMaxMin]);
		const valMaxMax = castPrecision(input[indexMaxMax]);

		const t1 = x - minX;
		const t2 = y - minY;
		const valMin = t2 * valMinMax + (1 - t2) * valMinMin;
		const valMax = t2 * valMaxMax + (1 - t2) * valMaxMin;
		return castPrecision((t1 * valMax) + (1 - t1) * valMin);
	}

	for (let el = 0; el < numElements; el++) {
		for (let _y = 0; _y < dimY; _y++) {
			for (let _x = 0; _x < dimX; _x++) {
				const x = _x + offset;
				const y = _y + offset;
				expected[wrapIndex(_x, _y, el)] = bilinearInterp(x, y, el);
			}
		}
	}

	return expected;
}