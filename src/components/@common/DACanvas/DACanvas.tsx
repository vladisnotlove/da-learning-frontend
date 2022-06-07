import React, {useEffect, useRef} from "react";

// Components

// Stores, utils, libs
import refs from "Utils/react/refs";


type DaCanvasProps = {
	autoFit?: boolean,
} & React.CanvasHTMLAttributes<HTMLCanvasElement>;

const DaCanvas = React.forwardRef<HTMLCanvasElement, DaCanvasProps>((
	{
		autoFit,

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

	return <canvas
		ref={refs(ref, canvasRef)}

		{...props}
	/>;
});
DaCanvas.displayName = "DaCanvas";

export default DaCanvas;
