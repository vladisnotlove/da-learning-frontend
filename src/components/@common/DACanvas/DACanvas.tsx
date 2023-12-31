import React, {useEffect, useRef} from "react";

// Components

// Stores, utils, libs
import refs from "Utils/react/refs";
import useResizeCheck from "Hooks/useResizeCheck";


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

	const {targetRef} = useResizeCheck<HTMLCanvasElement>({
		onResize: () => {
			if (onResize) onResize();
		},
		ms: 300,
		disabled: !onResize,
	});

	return <canvas
		ref={refs(ref, targetRef, canvasRef)}

		{...props}
	/>;
});
DaCanvas.displayName = "DaCanvas";

export default DaCanvas;
