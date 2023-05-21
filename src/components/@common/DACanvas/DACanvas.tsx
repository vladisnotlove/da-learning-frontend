import React, {useEffect, useRef} from "react";

// Components

// Stores, utils, libs
import refs from "Utils/react/refs";
import useResizeObserver from "use-resize-observer";


type DaCanvasProps = {
	autoFit?: boolean,
	onResize?: () => void,
} & React.CanvasHTMLAttributes<HTMLCanvasElement>;

const DaCanvas = React.forwardRef<HTMLCanvasElement, DaCanvasProps>((
	{
		autoFit,
		onResize,
		...props
	},
	ref,
) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		const canvas = canvasRef.current;

		if (autoFit && canvas) {
			const width = canvas.clientWidth;
			const height = canvas.clientHeight;
			canvas.width = width;
			canvas.height = height;
		}
	}, [
		autoFit,
	]);

	const {ref: refForResize} = useResizeObserver({
		onResize: onResize
	});

	return <canvas
		ref={refs(ref, refForResize, canvasRef)}

		{...props}
	/>;
});
DaCanvas.displayName = "DaCanvas";

export default DaCanvas;
