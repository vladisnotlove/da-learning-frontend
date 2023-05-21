import React, {useState} from "react";

// Components
import {styled} from "@mui/material";
import Workspace from "Components/draw/Workspace";
import Paper, {PaperProps} from "Components/draw/Paper";
import ToolPanel, {ToolPanelProps} from "Components/draw/ToolPanel";

// Stores, utils, libs
import Color from "Utils/draw/Color";
import CircleSizeInput from "Components/draw/CircleSizeInput";
import useToolBrushSize from "./useToolSettings";
import useLocalStorage from "Hooks/useLocalStorage";

const TToolToConstProps: Record<ToolPanelProps["selectedTool"], Pick<PaperProps, "mode" | "smoothRadius" | "smoothFriction" | "smoothCurve">> = {
	pen: {
		mode: "draw",
		smoothFriction: 0.05,
		smoothRadius: 1,
		smoothCurve: 0.1,
	},
	brush: {
		mode: "draw",
		smoothFriction: 0.2,
		smoothRadius: 1,
		smoothCurve: 0.2,
	},
	erase: {
		mode: "erase",
		smoothFriction: 1,
		smoothRadius: 0,
		smoothCurve: 0.1,
	},
	hand: {
		mode: "nothing",
		smoothFriction: 1,
		smoothRadius: 0,
		smoothCurve: 0,
	}
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
	const [selectedTool, setSelectedTool] = useLocalStorage<ToolPanelProps["selectedTool"]>("selectedTool", "hand");

	const [color, setColor] = useState<ToolPanelProps["color"]>(new Color({r: 0, g: 0, b: 0, a: 1}));
	const [brushSize, setBrushSize] = useToolBrushSize(selectedTool);

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
				size={brushSize}
				onChangeSize={setBrushSize}
			/>
		}
		<StyledWorkspace>
			<Paper
				width={800}
				height={600}

				mode={TToolToConstProps[selectedTool].mode}
				color={color}
				brush={{
					shape: "circle",
					radius: brushSize * 0.5,
				}}
				smoothRadius={TToolToConstProps[selectedTool].smoothRadius}
				smoothFriction={TToolToConstProps[selectedTool].smoothFriction}
				smoothCurve={TToolToConstProps[selectedTool].smoothCurve}

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
