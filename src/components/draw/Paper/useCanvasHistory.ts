import React, {useRef} from "react";
import DataHistory from "Utils/DataHistory";

const areEquals = (im1: ImageData | undefined, im2: ImageData | undefined) => {
	if (!im1) return false;
	if (!im2) return false;
	if (im1.width !== im2.width || im1.height !== im2.height) return false;
	for (let i = 0; i < im1.data.length; i++) {
		if (im1.data[i] !== im2.data[i]) return false;
	}
	return true;
};


const useCanvasHistory = (
	canvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
	maxLength: number,
) => {
	const historyRef = useRef<DataHistory<ImageData>>(new DataHistory<ImageData>(maxLength));

	const getCanvasImageData = () => {
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");

		if (canvas && ctx) {
			const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
			return new ImageData(imageData.data.map(value => value), imageData.width, imageData.height);
		}
	};

	const clearCanvas = () => {
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");

		if (canvas && ctx) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}
	};

	const setCanvasImageData = (imageData: ImageData) => {
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");

		if (canvas && ctx) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.putImageData(imageData, 0, 0);
		}
	};

	const save = () => {
		const history = historyRef.current;
		const canvasImageData = getCanvasImageData();

		if (canvasImageData && !areEquals(canvasImageData, history.currentData)) {
			history.add(canvasImageData);
		}
	};

	const undo = () => {
		historyRef.current.undo();
		const imageData = historyRef.current.currentData;
		if (imageData) {
			setCanvasImageData(imageData);
		}
		else {
			clearCanvas();
		}
	};

	const redo = () => {
		historyRef.current.redo();
		const imageData = historyRef.current.currentData;
		if (imageData) {
			setCanvasImageData(imageData);
		}
	};

	return {
		save,
		undo,
		redo,
	};
};

export default useCanvasHistory;
