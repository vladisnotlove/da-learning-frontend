type TEMath = typeof Math & {
	diff: (a: number, b: number) => void
}

const DAMath: TEMath = {
	...Math,
	diff: (a: number, b: number) => {
		return Math.abs(a - b);
	}
};

export default DAMath;
