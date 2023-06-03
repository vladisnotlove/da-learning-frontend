function putImageData(
	context: CanvasRenderingContext2D,
	imageData: ImageData,
	position: {x: number, y: number},
	options: {
		scale?: number,
		pivot?: "center" | "top-left",
		origin?: "center" | "top-left",
	} = {}
) {
	let pivotPosition = {...position};

	if (options.pivot !== undefined) {
		if (options.pivot === "center") {
			pivotPosition = {
				x: position.x - imageData.width * 0.5,
				y: position.y - imageData.height * 0.5,
			}
		}
		else if (options.pivot === "top-left") {
			pivotPosition = {...position};
		}
	}

	let originPosition = {x: 0, y: 0};

	if (options.origin !== undefined) {
		if (options.origin === "center") {
			originPosition = {
				x: context.canvas.width * 0.5,
				y: context.canvas.height * 0.5,
			}
		}
	}

	if (options.scale && options.scale !== 1) {
		context.putImageData(imageData, imageData.width, imageData.height);
		context.scale(options.scale, options.scale);
	}
	else {
		context.putImageData(
			imageData,
			originPosition.x + pivotPosition.x,
			originPosition.y + pivotPosition.y,
		);
	}
}

export default putImageData;
