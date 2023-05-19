import React, {useState} from "react";

// Components
import {styled} from "@mui/material";
import Workspace from "Components/draw/Workspace";
import Paper, {PaperProps} from "Components/draw/Paper";
import ToolPanel, {ToolPanelProps} from "Components/draw/ToolPanel";

// Stores, utils, libs
import Color from "Utils/draw/Color";
import CircleSizeInput from "Components/draw/CircleSizeInput";



const TToolToSmoothRadius: Record<ToolPanelProps["selectedTool"], PaperProps["smoothRadius"]> = {
	pen: 0,
	brush: 6,
	erase: 0,
	hand: 0
};

const TToolToMode: Record<ToolPanelProps["selectedTool"], PaperProps["mode"]> = {
	pen: "draw",
	brush: "draw",
	erase: "erase",
	hand: "nothing"
};

type EditorProps = {
	className?: string,
	children?: React.ReactNode,
	PaperProps?: Partial<PaperProps>
}

const Editor: React.FC<EditorProps> = (
	{
		className,
		PaperProps,
	}
) => {
	const [selectedTool, setSelectedTool] = useState<ToolPanelProps["selectedTool"]>("hand");

	const [color, setColor] = useState<ToolPanelProps["color"]>(new Color({r: 0, g: 0, b: 0, a: 1}));
	const [radius, setRadius] = useState<number>(2);

	return <Root
		className={className}
	>
		<StyledToolPanel
			selectedTool={selectedTool}
			onSelectTool={setSelectedTool}
			color={color}
			onChangeColor={setColor}
		/>
		{(selectedTool === "brush" || selectedTool === "erase" || selectedTool === "pen") &&
			<StyledCircleSizeInput
				radius={radius}
				onChangeRadius={setRadius}
			/>
		}
		<StyledWorkspace>
			<Paper
				width={800}
				height={600}

				mode={TToolToMode[selectedTool]}
				color={color}
				brush={{
					shape: "circle",
					radius: radius,
				}}
				smoothRadius={TToolToSmoothRadius[selectedTool]}

				{...PaperProps}
			/>
		</StyledWorkspace>
	</Root>;
};

const Root = styled("div")(() => ({
	display: "flex",
	flexDirection: "column",
	position: "relative",
	height: "100%",
}));

const StyledToolPanel = styled(ToolPanel)(({theme}) => ({
	position: "absolute",
	top: theme.spacing(1.5),
	left: theme.spacing(1.5),
	zIndex: 100,
}));

const StyledCircleSizeInput = styled(CircleSizeInput)(({theme}) => ({
	position: "absolute",
	top: theme.spacing(1.5),
	left: "50%",
	transform: "translateX(-50%)",
	zIndex: 100,
}));

const StyledWorkspace = styled(Workspace)(({theme}) => ({
	width: "100%",
	minHeight: "200px",
	flexGrow: "1",
	background: theme.palette.background.lower1,
}));

export default Editor;
