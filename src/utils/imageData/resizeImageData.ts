const resizeImageData = (imageData: ImageData, size: {x: number, y: number}) => {
	const data = new Array(size.x * size.y * 4);

	for (let i = 0; i < data.length; i += 4) {
		const oldI = i + (imageData.width - size.x) * Math.floor(i / (size.x * 4));

		data[i] = imageData.data[oldI];
		data[i+1] = imageData.data[oldI+1];
		data[i+2] = imageData.data[oldI+2];
		data[i+3] = imageData.data[oldI+3];
	}

	return new ImageData(new Uint8ClampedArray(data), size.x, size.y);
};

export default resizeImageData;
