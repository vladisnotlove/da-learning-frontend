import {normal} from "color-blend";

type TRgba = {
	r: number,
	g: number,
	b: number,
	a: number
};


export class Color {
	rgba: TRgba;

	constructor(data: TRgba) {
		this.rgba = data;
	}

	blend(backdrop: Color) {
		return new Color(normal(backdrop.rgba, this.rgba));
	}

	toHex() {
		const rHex = rgbaElementToHex(this.rgba.r);
		const gHex = rgbaElementToHex(this.rgba.g);
		const bHex = rgbaElementToHex(this.rgba.b);
		const aHex = rgbaElementToHex(Math.round(this.rgba.a * 255));
		return `#${rHex}${gHex}${bHex}${aHex}`;
	}
}

const rgbaElementToHex = (element: number) => {
	return element.toString(16).padStart(2, "0");
};

export default Color;
