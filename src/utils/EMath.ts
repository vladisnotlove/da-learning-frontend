type TEMath = typeof Math & {
	diff: (a: number, b: number) => void
}

const EMath: TEMath = {
	...Math,
	diff: (a: number, b: number) => {
		return Math.abs(a - b);
	}
};

export default EMath;
