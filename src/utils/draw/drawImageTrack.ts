import Vector from "../geometry/Vector";

const drawImageTrack = (
	ctx: CanvasRenderingContext2D,
	image: CanvasImageSource,
	from: Vector,
	to: Vector,
	step: number,
) => {
	const delta = to.subtract(from);
	const direction = delta.normalize();
	const length = delta.length;

	for (let betweenLength = 0; betweenLength <= length; betweenLength += step) {
		const between = from.add(direction.multiply(betweenLength));
		ctx.drawImage(image, between.x, between.y);
	}
};

export default drawImageTrack;
