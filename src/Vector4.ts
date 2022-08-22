/**
 * These are the parts of threejs Vector4 that we need.
 * Used internally.
 * @private
 */
export class Vector4 {
	x: number;
	y: number;
	z: number;
	w: number;
	constructor( x = 0, y = 0, z = 0, w = 1 ) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
	}
	get width() {
		return this.z;
	}
	get height() {
		return this.w;
	}
	copy(v: Vector4) {
		this.x = v.x;
		this.y = v.y;
		this.z = v.z;
		this.w = v.w;
		return this;
	}
}