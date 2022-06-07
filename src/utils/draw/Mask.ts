import Color from "Utils/draw/Color";


type MaskPixel = {
	a: number
}

class Mask {
	width: number;
	height: number;
	pixels: MaskPixel[][];

	constructor(
		data: {
			width: number,
			height: number,
			pixels: MaskPixel[][]
		}
	) {
		// validate data
		if (data.pixels.length !== data.height) {
			throw Error("Mask create error: pixels length must be equal height");
		}
		data.pixels.forEach((pixelsRow, index) => {
			if (pixelsRow.length !== data.width) {
				throw Error(`Mask create error: pixels[${index}] length is not equal width`);
			}
		});

		// init
		this.pixels = data.pixels;
		this.width = data.width;
		this.height = data.height;
	}

	toImageData(color: Color) {
		const arr: number[] = [];
		this.pixels.forEach(row => {
			row.forEach(pixel => {
				arr.push(0 | color.rgba.r);
				arr.push(0 | color.rgba.g);
				arr.push(0 | color.rgba.b);
				arr.push(pixel.a * color.rgba.a * 255);
			});
		});
		return new ImageData(new Uint8ClampedArray(arr), this.width, this.height);
	}
}

export default Mask;
