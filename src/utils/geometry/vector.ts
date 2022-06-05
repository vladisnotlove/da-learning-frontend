class Vector {
	x: number;
	y: number;
	
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	static from(value: {x: number, y: number}) {
		return new Vector(value.x, value.y);
	}

	add(value: Vector) {
		return new Vector(
			this.x + value.x,
			this.y + value.y
		);
	}

	subtract(value: Vector) {
		return new Vector(
			this.x - value.x,
			this.y - value.y
		);
	}

	multiply(value: number) {
		return new Vector(
			this.x * value,
			this.y * value
		);
	}

	divide(value: number) {
		return new Vector(
			this.x / value,
			this.y / value
		);
	}

	get length() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	normalize() {
		return this.divide(this.length);
	}

	fitToMaxLength(length: number) {
		if (this.length > length) return this.normalize().multiply(length);
		return Vector.from(this);
	}
}

export default Vector;


