import React, {useEffect, useRef, useState} from "react";

// Components
import {Box, BoxProps, styled} from "@mui/material";

// Stores, utils, libs
import Vector from "Utils/geometry/Vector";
import useWindowEvent from "Hooks/useWindowEvent";
import useAnimationFrame from "Hooks/useAnimationFrame";



const WHEEL_BUTTON = 1;
const MIN_VISIBLE_PIXELS = 3;

type WorkspaceProps = {
	className?: string,
	children?: React.ReactNode,
	sx?: BoxProps["sx"],
	scaleStep?: number,
	minScale?: number,
	maxScale?: number,
}

const Workspace: React.FC<WorkspaceProps> = (
	{
		className,
		children,
		sx,
		scaleStep = 0.1,
		minScale = 0.25,
		maxScale = 200,
	}
) => {
	const [ready, setReady] = useState(false);

	const isHoverRef = useRef(false);
	const isMovingRef = useRef(false);
	const positionRef = useRef<Vector | null>(null);
	const scaleRef = useRef<number>(1);
	const originSizeRef = useRef<Vector | null>(null);

	const changePositionRef = (newPosition: Vector, newScale?: number) => {
		const content = contentRef.current;
		const space = spaceRef.current;
		const originSize = originSizeRef.current;
		const scale = scaleRef.current;

		if (content && space && originSize) {
			const contentSize = originSize.multiply(newScale || scale);
			const spaceRect = space.getBoundingClientRect();
			const spaceSize = new Vector(spaceRect.width, spaceRect.height);

			const top = newPosition.y;
			const bottom = top + contentSize.y;
			const left = newPosition.x;
			const right = left + contentSize.x;

			const fixedNewPosition = Vector.from(newPosition);
			const MIN_VP = MIN_VISIBLE_PIXELS;

			if (top > spaceSize.y - MIN_VP) {
				fixedNewPosition.y = spaceSize.y - MIN_VP;
			}
			if (bottom < MIN_VP) {
				fixedNewPosition.y = MIN_VP - contentSize.y;
			}
			if (left > spaceSize.x - MIN_VP) {
				fixedNewPosition.x = spaceSize.x - MIN_VP;
			}
			if (right < MIN_VP) {
				fixedNewPosition.x = MIN_VP - contentSize.x;
			}
			return positionRef.current = fixedNewPosition;
		}
		return positionRef.current = newPosition;
	};

	const spaceRef = useRef<HTMLDivElement | null>(null);
	const contentRef = useRef<HTMLDivElement | null>(null);

	// initial
	useEffect(() => {
		const position = positionRef.current;
		const originSize = originSizeRef.current;
		const scale = scaleRef.current;

		if (!position && !originSize) {
			const content = contentRef.current;
			const space = spaceRef.current;

			if (content && space) {
				const spaceSize = new Vector(space.clientWidth, space.clientHeight);
				const contentSize = new Vector(content.clientWidth, content.clientHeight).multiply(scale);

				// set position to center
				changePositionRef(new Vector(
					spaceSize.x * 0.5 - contentSize.x * 0.5,
					spaceSize.y * 0.5 - contentSize.y * 0.5
				));

				// save origin size
				originSizeRef.current = new Vector(content.clientWidth, content.clientHeight);

				setReady(true);
			}
		}
	}, []);

	useWindowEvent("mouseup", event => {
		if (event.button === WHEEL_BUTTON) {
			isMovingRef.current = false;
		}
	});

	const prevMousePositionRef = useRef<Vector | null>(null);

	useWindowEvent("mousemove", event => {
		const isMoving = isMovingRef.current;

		if (isMoving) {
			const mousePosition = new Vector(event.pageX, event.pageY);
			const prevMousePosition = prevMousePositionRef.current || Vector.from(mousePosition);
			const deltaMouse = mousePosition.subtract(prevMousePosition);

			changePositionRef(new Vector(
				(positionRef.current?.x || 0) + deltaMouse.x,
				(positionRef.current?.y || 0) + deltaMouse.y
			));

			prevMousePositionRef.current = mousePosition;
		}
		else {
			prevMousePositionRef.current = null;
		}
	});

	useWindowEvent("wheel", event => {
		const isHover = isHoverRef.current;
		if (isHover) {
			event.preventDefault();
			return false;
		}
	}, {
		listenerOptions: {passive: false}
	});

	useWindowEvent("mousedown", event => {
		const isHover = isHoverRef.current;
		if (isHover) {
			event.preventDefault();
			return false;
		}
	}, {
		listenerOptions: {passive: false}
	});

	useAnimationFrame(() => {
		const content = contentRef.current;
		const position = positionRef.current;
		const scale = scaleRef.current;
		const originSize = originSizeRef.current;

		if (content) {
			if (position) {
				content.style.transform = `translate(${position.x}px, ${position.y}px)`;
			}
			if (scale && originSize) {
				content.style.width = `${originSize.x * scale}px`;
				content.style.height = `${originSize.y * scale}px`;
			}
		}
	});

	return <Space
		ref={spaceRef}
		className={className}

		// is hover
		onMouseMove={() => {
			isHoverRef.current = true;
		}}
		onMouseEnter={() => {
			isHoverRef.current = true;
		}}
		onMouseLeave={() => {
			isHoverRef.current = false;
		}}

		// move
		onMouseDown={event => {
			if (event.button === WHEEL_BUTTON) {
				isMovingRef.current = true;
			}
		}}

		// zoom
		onWheel={event => {
			if (event.ctrlKey) {
				event.preventDefault();

				const content = contentRef.current;
				const space = spaceRef.current;
				const position = positionRef.current;
				const scale = scaleRef.current;

				if (content && space && position) {
					// set new scale
					const newScale = scale + scale * Math.sign(event.deltaY) * -1 * scaleStep;
					if (newScale > maxScale || newScale < minScale) return;
					scaleRef.current = newScale;

					// get mouse position relative space
					const spaceRect = space.getBoundingClientRect();
					const mousePosition = new Vector(event.pageX, event.pageY).subtract(new Vector(spaceRect.x, spaceRect.y));

					// set new position
					const deltaPosition = position.subtract(mousePosition);
					const scaledDeltaPosition = deltaPosition.multiply(1 / scale).multiply(newScale);
					const newPosition = position.add(scaledDeltaPosition.subtract(deltaPosition));
					changePositionRef(newPosition, newScale);
				}
			}
		}}
		sx={sx}
	>
		<Content
			ref={contentRef}
			ready={ready}
			style={{
				transformOrigin: "top left"
			}}
		>
			{children}
		</Content>
	</Space>;
};

const Space = styled(Box)(() => ({
	position: "relative",
	overflow: "hidden",
}));

const Content = styled("div")<{ready?: boolean}>(({ready}) => ({
	position: "absolute",
	top: 0,
	left: 0,
	...(!ready && {
		opacity: 0,
		pointerEvents: "none",
	})
}));


export default Workspace;
