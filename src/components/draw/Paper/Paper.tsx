import React, {useMemo, useRef, useState} from "react";

// Components
import {styled} from "@mui/material";
import DACanvas from "Components/@common/DACanvas";

// Stores, utils, libs
import Color from "Utils/draw/Color";
import Vector from "Utils/geometry/Vector";
import useWindowEvent from "Hooks/useWindowEvent";
import useCanvasHistory from "./useCanvasHistory";
import {LazyBrush} from "lazy-brush";
import imageDataUtils from "Utils/draw/imageDataUtils";


const RIGHT_BUTTON = 0;

// MAIN

export type PaperProps = {
	className?: string,

	width: number,
	height: number,

	mode: "draw" | "erase" | "nothing",
	color: Color,
	brush?: {
		shape: "circle",
		radius: number,
	} | {
		shape: "rect",
		width: number,
		height: number,
	},
	smoothRadius: number,
}

const Paper: React.FC<PaperProps> = (
	{
		className,
		width,
		height,

		mode,
		color,
		brush,
		smoothRadius,
	}
) => {
	const [isHold, setIsHold] = useState(false);

	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

	const tempCanvasRef = useRef<HTMLCanvasElement | null>(null);
	const tempCtxRef = useRef<CanvasRenderingContext2D | null>(null);

	// undo/redo

	const {
		save,
		undo,
		redo,
	} = useCanvasHistory(canvasRef, 25);

	useWindowEvent("keydown", event => {
		if (event.key?.toLowerCase() === "z" && event.ctrlKey && !event.shiftKey) {
			undo();
		}
		if (event.key?.toLowerCase() === "z" && event.ctrlKey && event.shiftKey) {
			redo();
		}
		if (event.key?.toLowerCase() === "y" && event.ctrlKey) {
			redo();
		}
	});

	// draw

	const colorHex = useMemo(() => {
		return color.toHex();
	}, [
		color
	]);

	const lazyBrushRef = useRef<LazyBrush | null>(null);
	const prevFixedBrushPositionRef = useRef<Vector | null>(null);

	const brushSize = useMemo<Vector | null>(() => {
		if (brush?.shape === "circle") {
			return new Vector(brush.radius * 2, brush.radius * 2);
		}
		if (brush?.shape === "rect") {
			return new Vector(brush.width, brush.height);
		}
		return null;
	}, [brush]);

	const brushImageData = useMemo<ImageData | null>(() => {
		const tempCanvas = tempCanvasRef.current;
		const tempCtx = tempCtxRef.current;

		if (tempCtx && tempCanvas && brushSize) {
			if (brush?.shape === "circle") {
				tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
				tempCtx.fillStyle = colorHex;
				tempCtx.beginPath();
				tempCtx.arc(brushSize.x * 0.5, brushSize.y * 0.5, 1, 0, 2 * Math.PI, true);
				tempCtx.fill();
				return tempCtx.getImageData(0, 0, brushSize.x, brushSize.y);
			}
		}

		return null;
	}, [
		brush,
		colorHex,
		brushSize
	]);

	const draw = (
		cursorPosition: Vector,
		options: {
			isStart?: boolean,
		} = {}
	) => {
		const canvas = canvasRef.current;
		const ctx = ctxRef.current;

		if (
			canvas &&
			ctx &&
			brush &&
			brushSize &&
			brushImageData
		) {

			// get scale in canvas
			const canvasRect = canvas.getBoundingClientRect();
			const canvasSize = new Vector(canvasRect.width, canvasRect.height);
			const scale = canvasSize.divide(new Vector(width, height)).x;

			// get cursor position
			const canvasPosition = new Vector(canvasRect.x, canvasRect.y);
			const brushPosition = cursorPosition
				.subtract(canvasPosition)
				.divide(scale);

			// get and update lazy brush
			if (options?.isStart || !lazyBrushRef.current) {
				lazyBrushRef.current = new LazyBrush({
					enabled: true,
					radius: smoothRadius,
					initialPoint: brushPosition
				});
			}
			const lazyBrush = lazyBrushRef.current;
			lazyBrush.update(brushPosition);

			const fixedBrushPosition = Vector.from(lazyBrush.getBrushCoordinates());
			const prevFixedBrushPosition = Vector.from(prevFixedBrushPositionRef.current || fixedBrushPosition);

			if (mode === "draw") {
				if (brush.shape === "circle") {
					if (options.isStart) {
						ctx.beginPath();
						ctx.moveTo(fixedBrushPosition.x, fixedBrushPosition.y);
					}
					ctx.strokeStyle = colorHex;
					ctx.lineWidth = brush.radius;
					ctx.lineJoin = "round";
					ctx.lineCap = "round";
					ctx.lineTo(fixedBrushPosition.x, fixedBrushPosition.y);
					ctx.stroke();
				}
			}
			if (mode === "erase") {
				if (brush.shape === "circle") {
					let brushTrack = [fixedBrushPosition];
					if (!options.isStart) {
						brushTrack = Vector.split(prevFixedBrushPosition, Vector.from(fixedBrushPosition), 1);
					}

					brushTrack.forEach(position => {
						const fixedPosition = position.subtract(brushSize.multiply(0.5)).round();
						const background = ctx.getImageData(
							fixedPosition.x,
							fixedPosition.y,
							brushSize.x,
							brushSize.y,
						);
						const erased = imageDataUtils.erase(background, brushImageData);
						ctx.putImageData(
							erased,
							fixedPosition.x,
							fixedPosition.y,
						);
					});
				}
			}

			prevFixedBrushPositionRef.current = Vector.from(fixedBrushPosition);
		}
	};

	useWindowEvent("mouseup", event => {
		if (
			mode === "draw" ||
			mode === "erase"
		) {
			if (event.button !== RIGHT_BUTTON) return;
			if (isHold) {
				save();
			}
			setIsHold(false);
		}
	});

	return <Root
		className={className}
		style={{
			...(mode === "draw" && {
				cursor: "crosshair",
			}),
			...(mode === "erase" && {
				cursor: "crosshair",
			})
		}}
	>
		<TempCanvas
			ref={node => {
				tempCanvasRef.current = node;
				tempCtxRef.current = node?.getContext("2d") || null;
			}}
			width={width}
			height={height}
		/>
		<MainCanvas
			ref={node => {
				canvasRef.current = node;
				ctxRef.current = node?.getContext("2d") || null;
			}}
			width={width}
			height={height}
			style={{
				imageRendering: "pixelated",
			}}
			onMouseDown={event => {
				if (
					mode === "draw" ||
					mode === "erase"
				) {
					if (event.button !== RIGHT_BUTTON) return;
					setIsHold(true);
					draw(new Vector(event.pageX, event.pageY), {isStart: true});
				}
			}}
			onMouseMove={event => {
				if (
					mode === "draw" ||
					mode === "erase"
				) {
					if (event.button !== RIGHT_BUTTON) return;
					if (isHold) {
						draw(new Vector(event.pageX, event.pageY));
					}
				}
			}}
		/>
	</Root>;
};

const Root = styled("div")({
	backgroundImage: "url(/assets/images/grid.svg)",
	backgroundRepeat: "repeat",
	fontSize: "0"
});


const TempCanvas = styled(DACanvas)(() => ({
	position: "absolute",
	opacity: 0,
	width: "100%",
	height: "100%",
	zIndex: 0,
}));

const MainCanvas = styled(DACanvas)(() => ({
	position: "relative",
	width: "100%",
	height: "100%",
	zIndex: 10,
}));

export default Paper;
