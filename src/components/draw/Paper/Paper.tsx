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
import useAnimationLoop from "Hooks/useAnimationFrame";
import Queue from "Utils/Queue";

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
	smoothCurve: number,
	smoothFriction: number,
}

const Paper: React.FC<PaperProps> = (
	{
		className,
		width,
		height,

		mode,
		color,
		brush,
		smoothRadius, // 1...60
		smoothCurve, // 0...0.5
		smoothFriction, // 0...1
	}
) => {
	const [scale, setScale] = useState(1);
	const isHoldRef = useRef(false);

	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);

	const brushCanvasRef = useRef<HTMLCanvasElement | null>(null);
	const brushCanvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);

	const colorHex = useMemo(() => color.toHex(), [color]);
	const cursorPositionRef = useRef<Vector | null>(null);
	const prevPointsRef = useRef<Queue<Vector>>(new Queue());
	const prevControlPointRef = useRef<Vector | null>(null);
	const lazy = useMemo(() => new LazyBrush({
		enabled: true,
		radius: smoothRadius,
		initialPoint: {
			x: 0,
			y: 0
		}
	}), [smoothRadius]);

	const {save, undo, redo} = useCanvasHistory(canvasRef, 25);

	// helpers

	const drawBrush = () => {

		// update lazy
		const cursorPosition = cursorPositionRef.current;

		if (cursorPosition) {
			lazy.update(cursorPosition, {
				friction: smoothFriction,
			});
		}

		// draw brush
		const brushPosition = lazy.getBrushCoordinates();
		const brushCanvasCtx = brushCanvasCtxRef.current;

		if (brush && brushPosition && brushCanvasCtx) {
			// clear canvas
			brushCanvasCtx.clearRect(0, 0, brushCanvasCtx.canvas.width, brushCanvasCtx.canvas.height);

			// draw brush
			brushCanvasCtx.fillStyle = colorHex;
			if (brush.shape === "circle") {
				brushCanvasCtx.beginPath();
				brushCanvasCtx.arc(brushPosition.x, brushPosition.y, brush.radius, 0, Math.PI * 2, true);
				brushCanvasCtx.fill();
			}
		}
	};

	const applyBrush = () => {
		const canvasCtx = canvasCtxRef.current;
		const brushCanvas = brushCanvasRef.current;
		const prevPoints = prevPointsRef.current;
		const isHold = isHoldRef.current;

		if (isHold && canvasCtx && brushCanvas) {
			if (brush?.shape === "circle") {
				canvasCtx.lineJoin = "round";
				canvasCtx.lineCap = "round";
				canvasCtx.strokeStyle = colorHex;
				canvasCtx.lineWidth = brush.radius * 2;

				const point = lazy.getBrushCoordinates();
				prevPoints.enqueue(Vector.from(point));

				if (prevPoints.size > 2) {
					const p1 = prevPoints.dequeue() as Vector;
					const p2 = prevPoints.peek() as Vector;
					const p3 = prevPoints.peek(1) as Vector;

					const tangent = p3.subtract(p1).multiply(smoothCurve);
					const prevControlPoint = prevControlPointRef.current || p1;
					const controlPoint = p2.add(tangent.multiply(-1));
					const nextControlPoint = p2.add(tangent);

					canvasCtx.beginPath();
					canvasCtx.moveTo(p1.x, p1.y);
					canvasCtx.bezierCurveTo(prevControlPoint.x, prevControlPoint.y, controlPoint.x, controlPoint.y, p2.x, p2.y);
					canvasCtx.stroke();

					prevControlPointRef.current = nextControlPoint;
				}
			}
		}
	};

	// animation loop

	useAnimationLoop(() => {
		drawBrush();
		applyBrush();
	});

	// event listeners

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

	useWindowEvent("mousedown",event => {
		if (mode === "draw" || mode === "erase") {
			if (event.button !== RIGHT_BUTTON) return;
			isHoldRef.current = true;
		}
	});

	useWindowEvent("mousemove", event => {
		const canvas = canvasRef.current;

		if (mode === "draw" || mode === "erase") {

			// update brush position
			if (canvas) {
				const canvasPosition = Vector.from(canvas.getBoundingClientRect());
				cursorPositionRef.current = new Vector(event.pageX, event.pageY)
					.subtract(canvasPosition)
					.divide(scale);
			}
		}
	});

	useWindowEvent("mouseup", event => {
		if (mode === "draw" || mode === "erase") {
			if (event.button !== RIGHT_BUTTON) return;
			if (isHoldRef.current) {
				save();
			}
			isHoldRef.current = false;
			prevPointsRef.current = new Queue();
			prevControlPointRef.current = null;
		}
	});

	return <>
		<Root
			className={className}
			style={{
				...(mode !== "nothing" && {
					//cursor: "none",
				})
			}}
		>
			<MainCanvas
				ref={node => {
					canvasRef.current = node;
					canvasCtxRef.current = node?.getContext("2d") || null;
				}}
				width={width}
				height={height}
				onResize={() => {
					if (canvasRef.current) {
						const canvasRect = canvasRef.current.getBoundingClientRect();
						const canvasSize = new Vector(canvasRect.width, canvasRect.height);
						const scale = canvasSize.divide(new Vector(width, height)).x;
						setScale(scale);
					}
				}}
			/>
			<BrushCanvas
				ref={node => {
					brushCanvasRef.current = node;
					brushCanvasCtxRef.current = node?.getContext("2d") || null;
				}}
				width={width}
				height={height}
			/>
		</Root>
	</>;
};

const Root = styled("div")({
	position: "relative",
	backgroundImage: "url(/assets/images/grid.svg)",
	backgroundRepeat: "repeat",
	fontSize: "0",
	overflow: "hidden",
});

const MainCanvas = styled(DACanvas)(() => ({
	position: "relative",
	width: "100%",
	height: "100%",
	//imageRendering: "pixelated",
	zIndex: 10,
}));

const BrushCanvas = styled(DACanvas)(() => ({
	position: "absolute",
	top: 0,
	left: 0,
	width: "100%",
	height: "100%",
	//imageRendering: "pixelated",
	zIndex: 20,
}));

export default Paper;
