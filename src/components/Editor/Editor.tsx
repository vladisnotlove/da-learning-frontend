import React, {useState} from "react";

// Components
import {styled} from "@mui/material";
import Workspace from "Components/Workspace";
import DrawZone, {DrawZoneProps} from "Components/DrawZone";
import ToolPanel, {ToolPanelProps} from "Components/ToolPanel";
import BrushSettings, {TBrushSettings} from "../BrushSettings/index";

// Stores, utils, libs
import Color from "Utils/draw/Color";
import useLocalStorage from "Hooks/useLocalStorage";

const ToolToDrawZoneProps: Record<ToolPanelProps["selectedTool"], Pick<DrawZoneProps, "mode" | "smoothFriction" | "smoothCurve">> = {
	pen: {
		mode: "draw",
		smoothFriction: 0.05,
		smoothCurve: 0.1
	},
	brush: {
		mode: "draw",
		smoothFriction: 0.1,
		smoothCurve: 0.2
	},
	erase: {
		mode: "erase",
		smoothFriction: 0,
		smoothCurve: 0.1
	},
	hand: {
		mode: "nothing",
		smoothFriction: 0,
		smoothCurve: 0.1
	},
};
const ToolToBrushSettings: Record<ToolPanelProps["selectedTool"], TBrushSettings> = {
	pen: {smooth: 1, size: 2},
	brush: {smooth: 5, size: 16},
	erase: {smooth: 1, size: 16},
	hand: {smooth: 1, size: 1},
};

type EditorProps = {
	className?: string,
	children?: React.ReactNode,
	PaperProps?: Partial<DrawZoneProps>
}

const Editor: React.FC<EditorProps> = (
	{
		className,
		PaperProps,
	}
) => {
	const [
		selectedTool,
		setSelectedTool
	] = useLocalStorage<ToolPanelProps["selectedTool"]>("da-selectedTool", "hand");

	const [
		brushSettings,
		setBrushSettings
	] = useLocalStorage<TBrushSettings>("da-tool-" + selectedTool, ToolToBrushSettings[selectedTool]);

	const [color, setColor] = useState<ToolPanelProps["color"]>(new Color({r: 0, g: 0, b: 0, a: 1}));

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
			<StyledBrushSettings
				key={selectedTool}
				settings={brushSettings}
				onChange={setBrushSettings}
			/>
		}
		<StyledWorkspace>
			<DrawZone
				width={800}
				height={600}

				mode={ToolToDrawZoneProps[selectedTool].mode}
				color={color}
				brush={{
					shape: "circle",
					radius: (brushSettings.size || 2) * 0.5,
				}}
				smoothRadius={brushSettings.smooth || 1}
				smoothFriction={ToolToDrawZoneProps[selectedTool].smoothFriction}
				smoothCurve={ToolToDrawZoneProps[selectedTool].smoothCurve}

				{...PaperProps}
			/>
		</StyledWorkspace>
	</Root>;
};

const Root = styled("div")`
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
`;

const StyledToolPanel = styled(ToolPanel)(({theme}) => ({
	position: "absolute",
	top: theme.spacing(1.5),
	left: theme.spacing(1.5),
	zIndex: 100,
}));

const StyledBrushSettings = styled(BrushSettings)(({theme}) => ({
	position: "absolute",
	top: theme.spacing(1.5),
	right: theme.spacing(1.5),
	zIndex: 100,
}));

const StyledWorkspace = styled(Workspace)(({theme}) => ({
	width: "100%",
	minHeight: "200px",
	flexGrow: "1",
	background: theme.palette.background.lower1,
}));

export default Editor;
