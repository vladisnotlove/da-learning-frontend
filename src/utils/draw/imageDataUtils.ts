import Color from "Utils/draw/Color";

const imageDataUtils = {

	sum: (a: ImageData, b: ImageData) => {
		if (a.width !== b.width || a.height !== b.height) throw Error("sum of ImageData error: shape are different");

		const abData = new Array(a.data.length);

		for (let i = 0; i + 3 < a.data.length; i += 4) {
			const aColor = new Color({
				r: a.data[i],
				g: a.data[i+1],
				b: a.data[i+2],
				a: a.data[i+3] / 255,
			});
			const bColor = new Color({
				r: b.data[i],
				g: b.data[i+1],
				b: b.data[i+2],
				a: b.data[i+3] / 255,
			});
			const blendedColor = aColor.blend(bColor);
			abData[i] = blendedColor.rgba.r;
			abData[i+1] = blendedColor.rgba.g;
			abData[i+2] = blendedColor.rgba.b;
			abData[i+3] = Math.round(blendedColor.rgba.a * 255);
		}

		return new ImageData(
			new Uint8ClampedArray(abData),
			a.width,
			b.height,
		);
	},

	erase: (background: ImageData, eraser: ImageData) => {
		if (
			background.width !== eraser.width ||
			background.height !== eraser.height
		) throw Error("sum of ImageData error: shape are different");

		const resultData = new Array(background.data.length);

		for (let i = 0; i + 3 < background.data.length; i += 4) {
			resultData[i] = background.data[i];
			resultData[i+1] = background.data[i+1];
			resultData[i+2] = background.data[i+2];
			resultData[i+3] = background.data[i+3] - eraser.data[i+3];
		}

		return new ImageData(
			new Uint8ClampedArray(resultData),
			background.width,
			background.height,
		);
	}

};

export default imageDataUtils;
