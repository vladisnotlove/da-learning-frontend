class Vector {
	x: number;
	y: number;

	get length() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	add(value: Vector | number) {
		if (typeof value === "number") {
			return new Vector(
				this.x + value,
				this.y + value
			);
		}
		else {
			return new Vector(
				this.x + value.x,
				this.y + value.y
			);
		}
	}

	subtract(value: Vector | number) {
		if (typeof value === "number") {
			return new Vector(
				this.x - value,
				this.y - value
			);
		}
		else {
			return new Vector(
				this.x - value.x,
				this.y - value.y
			);
		}
	}

	round() {
		return new Vector(
			Math.round(this.x),
			Math.round(this.y)
		);
	}

	floor() {
		return new Vector(
			Math.floor(this.x),
			Math.floor(this.y)
		);
	}

	ceil() {
		return new Vector(
			Math.ceil(this.x),
			Math.ceil(this.y)
		);
	}

	multiply(value: number | Vector) {
		if (typeof value === "number") {
			return new Vector(
				this.x * value,
				this.y * value
			);
		}
		else {
			return new Vector(
				this.x * value.x,
				this.y * value.y
			);
		}
	}

	divide(value: number | Vector) {
		if (typeof value === "number") {
			return new Vector(
				this.x / value,
				this.y / value
			);
		}
		else {
			return new Vector(
				this.x / value.x,
				this.y / value.y
			);
		}
	}

	normalize() {
		if (this.length === 0) return Vector.from(this);
		return this.divide(this.length);
	}

	fitToMaxLength(length: number) {
		if (this.length > length) return this.normalize().multiply(length);
		return Vector.from(this);
	}

	isInRect(x: number, y: number, width: number, height: number) {
		if (this.x < x) return false;
		if (this.y < y) return false;
		if (this.x > x + width) return false;
		if (this.y > y + height) return false;
		return true;
	}

	// static

	static from(value: {x: number, y: number}) {
		return new Vector(value.x, value.y);
	}

	static split(from: Vector, to: Vector, step: number) {
		const delta = to.subtract(from);
		const deltaLength = delta.length;
		const deltaNormilized = delta.normalize();
		const vectors = [];
		for (let value = 0; value < deltaLength; value += step) {
			vectors.push(from.add(deltaNormilized.multiply(value)));
		}
		vectors.push(to);
		return vectors;
	}

	static midPointBetween(p1: {x: number, y: number}, p2: {x: number, y: number}) {
		return {
			x: p1.x + (p2.x - p1.x) / 2,
			y: p1.y + (p2.y - p1.y) / 2
		};
	}
}

export default Vector;


