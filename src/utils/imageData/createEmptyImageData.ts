const createEmptyImageData = (size: {x: number, y: number}) => {
	const data = new Array(size.x * size.y * 4).fill(0);
	return new ImageData(new Uint8ClampedArray(data), size.x, size.y);
};

export default createEmptyImageData;
