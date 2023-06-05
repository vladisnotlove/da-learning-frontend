import React, {useEffect, useMemo, useRef, useState} from "react";

// Components
import {styled} from "@mui/material";
import DACanvas from "Components/@common/DACanvas";

// Stores, utils, libs
import Color from "Utils/draw/Color";
import Vector from "Utils/geometry/Vector";
import Queue from "Utils/Queue";
import useWindowEvent from "Hooks/useWindowEvent";
import useAnimationLoop from "Hooks/useAnimationFrame";
import useDebounce from "Hooks/useDebounce";
import {LazyBrush} from "lazy-brush";
import {TControl} from "./useDrawZone";
import downloadCanvas from "Utils/canvas/downloadCanvas";

const RIGHT_BUTTON = 0;

export type TDrawZoneLayer = {
	id: number,
	imageData: ImageData,
}

// MAIN

export type DrawZoneProps = {
	className?: string,

	control?: TControl,

	width: number,
	height: number,

	layers: TDrawZoneLayer[],
	activeLayerId: TDrawZoneLayer["id"],
	onLayersUpdate: (layers: TDrawZoneLayer[]) => void,

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

const DrawZone: React.FC<DrawZoneProps> = (
	{
		className,

		control,

		width,
		height,

		layers,
		activeLayerId,
		onLayersUpdate,

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

	const secondCanvasesRef = useRef<(HTMLCanvasElement | null)[]>([]);
	const secondCanvasCtxsRef = useRef<(CanvasRenderingContext2D | null)[]>([]);

	const brushCanvasRef = useRef<HTMLCanvasElement | null>(null);
	const brushCanvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);

	const tempCanvasRef = useRef<HTMLCanvasElement | null>(null);
	const tempCanvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);

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

	const activeLayer = useMemo(() => {
		return layers.find(layer => layer.id === activeLayerId);
	}, [layers, activeLayerId]);

	const inactiveLayers = useMemo(() => {
		return layers.filter(layer => layer.id !== activeLayerId);
	}, [layers, activeLayerId]);

	// helpers

	const updateLayers = useDebounce(() => {
		const ctx = canvasCtxRef.current;

		if (ctx) {
			const newLayers = layers.map(layer => {
				if (layer.id === activeLayerId) {
					return {
						...layer,
						imageData: ctx.getImageData(0, 0, width, height),
					};
				}
				return layer;
			});
			onLayersUpdate(newLayers);
		}
	}, 200);


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
			if (brush.shape === "circle") {
				if (mode === "draw") {
					brushCanvasCtx.fillStyle = colorHex;
					brushCanvasCtx.lineWidth = 0;
					brushCanvasCtx.strokeStyle = "transparent";
				}
				if (mode === "erase") {
					brushCanvasCtx.fillStyle = "white";
					brushCanvasCtx.lineWidth = 1;
					brushCanvasCtx.strokeStyle = "black";
				}
				brushCanvasCtx.beginPath();
				brushCanvasCtx.arc(brushPosition.x, brushPosition.y, brush.radius, 0, Math.PI * 2, true);
				brushCanvasCtx.fill();
				brushCanvasCtx.stroke();
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

				if (mode === "erase") canvasCtx.globalCompositeOperation = "destination-out";

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

				canvasCtx.globalCompositeOperation = "source-over";
			}
		}
	};

	// effects

	useEffect(() => {
		// draw active layer
		const ctx = canvasCtxRef.current;
		if (activeLayer && ctx) {
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			ctx.putImageData(activeLayer.imageData, 0, 0);
		}

		// draw other layers
		inactiveLayers.forEach((layer, index) => {
			const ctx = secondCanvasCtxsRef.current[index];
			if (ctx) {
				ctx.putImageData(layer.imageData, 0, 0);
			}
		});
	}, [activeLayer, inactiveLayers]);

	useEffect(() => {
		if (control) {
			control.setControlObject({
				downloadImage: (name: string) => {
					const tempCtx = tempCanvasCtxRef.current;
					const secondCanvases = secondCanvasesRef.current;
					const canvas = canvasRef.current;

					if (tempCtx && secondCanvases && canvas) {
						// clear canvas
						tempCtx.clearRect(0, 0, tempCtx.canvas.width, tempCtx.canvas.height);

						// draw inactive layers on canvas
						secondCanvases.forEach(secondCanvas => {
							if (secondCanvas) tempCtx.drawImage(secondCanvas, 0, 0);
						});

						// draw active layer on canvas
						tempCtx.drawImage(canvas, 0, 0);

						// download canvas
						downloadCanvas(tempCtx.canvas, name);
					}
				}
			});
		}
	}, [control]);

	// animation loop

	useAnimationLoop(() => {
		if (mode !== "nothing") {
			drawBrush();
			applyBrush();
		}
	});

	// event listeners

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
				updateLayers();
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
			onMouseDown={event => {
				if (mode === "draw" || mode === "erase") {
					if (event.button !== RIGHT_BUTTON) return;
					isHoldRef.current = true;
				}
			}}
		>
			{inactiveLayers.map((layer, index) => (
				<SecondCanvas
					className={"second"}
					key={layer.id}
					ref={node => {
						secondCanvasesRef.current[index] = node;
						secondCanvasCtxsRef.current[index] = node?.getContext("2d") || null;
					}}
					width={width}
					height={height}
				/>
			))}
			<MainCanvas
				className={"main"}
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
				className={"brush"}
				ref={node => {
					brushCanvasRef.current = node;
					brushCanvasCtxRef.current = node?.getContext("2d") || null;
				}}
				width={width}
				height={height}
			/>
			<TempCanvas
				ref={node => {
					tempCanvasRef.current = node;
					tempCanvasCtxRef.current = node?.getContext("2d") || null;
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

const SecondCanvas = styled(DACanvas)(() => ({
	position: "absolute",
	top: 0,
	left: 0,
	width: "100%",
	height: "100%",
	//imageRendering: "pixelated",
	zIndex: 10,
}));

const MainCanvas = styled(DACanvas)(() => ({
	position: "relative",
	width: "100%",
	height: "100%",
	//imageRendering: "pixelated",
	zIndex: 20,
}));

const BrushCanvas = styled(DACanvas)(() => ({
	position: "absolute",
	top: 0,
	left: 0,
	width: "100%",
	height: "100%",
	//imageRendering: "pixelated",
	zIndex: 30,
}));

const TempCanvas = styled(DACanvas)`
	display: none;
`;

export default DrawZone;
