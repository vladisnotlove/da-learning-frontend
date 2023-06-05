const downloadCanvas = (canvas: HTMLCanvasElement) => {
	const link = document.createElement("a");
	link.download = "filename.png";
	link.href = canvas.toDataURL();
	link.click();
	link.remove();
};

export default downloadCanvas;
