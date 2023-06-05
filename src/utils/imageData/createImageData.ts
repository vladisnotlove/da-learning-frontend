type TCreateImageDataOptions = {
	color?: [number, number, number, number],
	shape?: "circle" | "rect"
}

const createImageData = (size: {x: number, y: number}, options: TCreateImageDataOptions = {}) => {
	const color = options.color || [0,0,0,0];
	const shape = options.shape || "rect";
	const data = new Array(size.x * size.y * 4);

	if (shape === "circle") {
		const radius = Math.min(size.x, size.y) * 0.5;
		const centerX = size.x * 0.5;
		const centerY = size.y * 0.5

		for (let x = 0; x < size.x; x++) {
			for (let y = 0; y < size.y; y++) {
				const adjustedX = x - centerX;  // convert x from [0, 100] to [-50, 50]
				const adjustedY = y - centerY;  // convert y from [0, 100] to [-50, 50]

				const distance = Math.sqrt(adjustedX*adjustedX + adjustedY*adjustedY);
				const index = (x + (y * size.x)) * 4;

				// if outside circle
				if (distance > radius) {
					data[index] = 0;
					data[index+1] = 0;
					data[index+2] = 0;
					data[index+3] = 0;
					continue;
				}

				data[index] = color[0];
				data[index+1] = color[1];
				data[index+2] = color[2];
				data[index+3] = color[3];
			}
		}
	}

	if (shape === "rect") {
		for (let i = 0; i < data.length; i += 4) {
			data[i] = color[0];
			data[i+1] = color[1];
			data[i+2] = color[2];
			data[i+3] = color[3];
		}
	}

	return new ImageData(new Uint8ClampedArray(data), size.x, size.y);
}

export default createImageData;
