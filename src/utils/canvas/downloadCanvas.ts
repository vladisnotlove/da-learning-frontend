const downloadCanvas = (canvas: HTMLCanvasElement, name: string) => {
	const link = document.createElement("a");
	link.download = `${name}.png`;
	link.href = canvas.toDataURL();
	link.click();
	link.remove();
};

export default downloadCanvas;
