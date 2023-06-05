import React, {useRef} from "react";
import {IconButton, Paper, styled, Typography} from "@mui/material";
import {Close} from "@mui/icons-material";
import Draggable from "react-draggable";

type WindowProps = {
	className?: string,
	children?: React.ReactNode,
	title?: React.ReactNode,
	action?: React.ReactNode,
	defaultPosition?: {x: number, y: number},
	onClose?: () => void,
	onChangePosition?: (position: {x: number, y: number}) => void,
	disableClose?: boolean,
	disableGap?: boolean,
}

const Window: React.FC<WindowProps> = (
	{
		className,
		children,
		title,
		action,
		defaultPosition,
		onClose,
		onChangePosition,
		disableClose,
		disableGap,
	}
) => {
	const windowRef = useRef<HTMLDivElement | null>(null);
	const windowBodyRef = useRef<HTMLDivElement | null>(null);
	const windowHeaderRef = useRef<HTMLElement | null>(null);

	return <Draggable
		defaultPosition={defaultPosition}
		onStart={e => {
			const target = e.target;

			if (
				target !== windowRef.current &&
				target !== windowBodyRef.current &&
				target !== windowHeaderRef.current
			) return false;
		}}
		onStop={(_e, data) => {
			if (onChangePosition) onChangePosition({x: data.x, y: data.y});
		}}
	>
		<Root
			className={className}
			ref={windowRef}
			variant={"outlined"}
			disableGap={disableGap}
		>
			<WindowHeader
				ref={windowHeaderRef}
				variant={"body1"}
			>
				{title}
				<WindowAction>
					{action}
					{!disableClose && (
						<IconButton onClick={onClose}>
							<Close fontSize={"small"}/>
						</IconButton>
					)}
				</WindowAction>
			</WindowHeader>
			<div ref={windowBodyRef}>
				{children}
			</div>
		</Root>
	</Draggable>;
};

const Root = styled(Paper)<{disableGap?: boolean}>`
  position: relative;
  padding: ${props => props.theme.spacing(2)};
  display: flex;
  flex-direction: column;
  gap: ${props => props.disableGap ? 0 : props.theme.spacing(3)};
`;

const WindowHeader = styled(Typography)`
  display: flex;
  justify-content: space-between;
  gap: ${p => p.theme.spacing(1)};
`;

const WindowAction = styled("div")`
  display: flex;
  gap: ${p => p.theme.spacing(0.5)};
  margin: ${p => p.theme.spacing(-1)};
`;

export default Window;
