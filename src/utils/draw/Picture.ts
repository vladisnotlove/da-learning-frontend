
type Pixel = {
	r: number,
	g: number,
	b: number,
	a: number,
}

class Picture {
	width: number;
	height: number;
	pixels: Pixel[][];

	constructor(
		data: {
			width: number,
			height: number,
			pixels: Pixel[][]
		}
	) {
		// validate data
		if (data.pixels.length !== data.height) {
			throw Error("Picture create error: pixels length must be equal height");
		}
		data.pixels.forEach((pixelsRow, index) => {
			if (pixelsRow.length !== data.width) {
				throw Error(`Picture create error: pixels[${index}] length is not equal width`);
			}
		});

		// init
		this.pixels = data.pixels;
		this.width = data.width;
		this.height = data.height;
	}

	toImageData() {
		const arr: number[] = [];
		this.pixels.forEach(row => {
			row.forEach(pixel => {
				arr.push(pixel.r);
				arr.push(pixel.g);
				arr.push(pixel.b);
				arr.push(pixel.a * 255);
			});
		});
		return new ImageData(new Uint8ClampedArray(arr), this.width, this.height);
	}
}

export default Picture;
