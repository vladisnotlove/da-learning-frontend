import React, {useEffect, useRef, useState} from "react";

// Components
import {Box, BoxProps, styled} from "@mui/material";

// Stores, utils, libs
import Vector from "Utils/geometry/Vector";
import useWindowEvent from "Hooks/useWindowEvent";



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
	const [isHover, setIsHover] = useState(false);
	const [isMoving, setIsMoving] = useState(false);
	const [position, _setPosition] = useState<Vector | null>(null);
	const [scale, setScale] = useState<number>(1);
	const [originSize, setOriginSize] = useState<Vector | null>(null);

	const setPosition = (newPosition: Vector | null, newScale?: number) => {
		if (newPosition === null) return _setPosition(newPosition);

		const content = contentRef.current;
		const space = spaceRef.current;

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
			return _setPosition(fixedNewPosition);
		}
		return _setPosition(newPosition);
	};

	const spaceRef = useRef<HTMLDivElement | null>(null);
	const contentRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!position && !originSize) {
			const content = contentRef.current;
			const space = spaceRef.current;

			if (content && space) {
				// save sizes
				const spaceSize = new Vector(space.clientWidth, space.clientHeight);
				const contentSize = new Vector(content.clientWidth, content.clientHeight).multiply(scale);
				setPosition(new Vector(
					spaceSize.x * 0.5 - contentSize.x * 0.5,
					spaceSize.y * 0.5 - contentSize.y * 0.5
				));
				setOriginSize(new Vector(content.clientWidth, content.clientHeight));
			}
		}
	}, [position, scale, originSize]);

	useWindowEvent("mouseup", event => {
		if (event.button === WHEEL_BUTTON) {
			setIsMoving(false);
		}
	});

	useWindowEvent("mousemove", event => {
		if (isMoving) {
			const deltaMouse = new Vector(event.movementX, event.movementY);
			setPosition(new Vector(
				(position?.x || 0) + deltaMouse.x,
				(position?.y || 0) + deltaMouse.y
			));
		}
	});

	useWindowEvent("wheel", event => {
		if (isHover) {
			event.preventDefault();
			return false;
		}
	}, {
		listenerOptions: {passive: false}
	});

	useWindowEvent("mousedown", event => {
		if (isHover) {
			event.preventDefault();
			return false;
		}
	}, {
		listenerOptions: {passive: false}
	});

	return <Space
		ref={spaceRef}
		className={className}

		// is hover
		onMouseMove={() => {
			setIsHover(true);
		}}
		onMouseEnter={() => {
			setIsHover(true);
		}}
		onMouseLeave={() => {
			setIsHover(false);
		}}

		// move
		onMouseDown={event => {
			if (event.button === WHEEL_BUTTON) {
				setIsMoving(true);
			}
		}}

		// zoom
		onWheel={event => {
			if (event.ctrlKey) {
				event.preventDefault();

				const content = contentRef.current;
				const space = spaceRef.current;

				if (content && space && position) {
					// set new scale
					const newScale = scale + scale * Math.sign(event.deltaY) * -1 * scaleStep;
					if (newScale > maxScale || newScale < minScale) return;
					setScale(newScale);

					// get mouse position relative space
					const spaceRect = space.getBoundingClientRect();
					const mousePosition = new Vector(event.pageX, event.pageY).subtract(new Vector(spaceRect.x, spaceRect.y));

					// set new position
					const deltaPosition = position.subtract(mousePosition);
					const scaledDeltaPosition = deltaPosition.multiply(1 / scale).multiply(newScale);
					const newPosition = position.add(scaledDeltaPosition.subtract(deltaPosition));
					setPosition(newPosition, newScale);
				}
			}
		}}
		sx={sx}
	>
		<Content
			ref={contentRef}
			ready={Boolean(position)}
			style={{
				...(position && {
					transform: `translate(${position.x}px, ${position.y}px)`,
					transformOrigin: "top left"
				}),
				...(originSize && scale && {
					width: originSize.x * scale,
					height: originSize.y * scale
				})
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
