const fillCanvas = (
	context: CanvasRenderingContext2D,
	color: string,
) => {
	context.fillStyle = color;
	context.fillRect(0, 0, context.canvas.width, context.canvas.height);
}

export default fillCanvas;
