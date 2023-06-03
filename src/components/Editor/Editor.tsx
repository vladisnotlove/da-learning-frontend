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
import {TTool} from "Constants/tools";
import {TDrawZoneLayer} from "Components/DrawZone";
import createEmptyImageData from "Utils/canvas/createEmptyImageData";
import Vector from "Utils/geometry/Vector";

const ToolToDrawZoneProps: Record<TTool, Pick<DrawZoneProps, "mode" | "smoothCurve">> = {
	brush: {
		mode: "draw",
		smoothCurve: 0.2
	},
	erase: {
		mode: "erase",
		smoothCurve: 0.1
	},
	hand: {
		mode: "nothing",
		smoothCurve: 0.1
	},
};
const ToolToBrushSettings: Record<TTool, TBrushSettings> = {
	brush: {smooth: 1, size: 2, friction: 0.1},
	erase: {smooth: 1, size: 16, friction: 0},
	hand: {smooth: 1, size: 1, friction: 0},
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
	const [size] = useState(new Vector(800, 600));
	const [layers, setLayers] = useState<TDrawZoneLayer[]>([{id: 0, imageData: createEmptyImageData(size)}]);

	const [
		selectedTool,
		setSelectedTool
	] = useLocalStorage<TTool>("da-selectedTool", "hand");

	const [
		brushSettings,
		setBrushSettings
	] = useLocalStorage<TBrushSettings>("da-tool-" + selectedTool, ToolToBrushSettings[selectedTool]);

	const [position, setPosition] = useState({x: 0, y: 0});
	const [color, setColor] = useState<ToolPanelProps["color"]>(
		new Color({r: 0, g: 0, b: 0, a: 1})
	);

	return <Root
		className={className}
	>
		<ToolPanel
			selectedTool={selectedTool}
			onSelectTool={tool => {
				setSelectedTool(tool);
			}}
			color={color}
			onChangeColor={setColor}
		/>
		<StyledWorkspace>
			<DrawZone
				width={size.x}
				height={size.y}

				layers={layers}
				activeLayerId={0}
				onLayersUpdate={setLayers}

				mode={ToolToDrawZoneProps[selectedTool].mode}
				color={color}
				brush={{
					shape: "circle",
					radius: (brushSettings.size || 2) * 0.5,
				}}
				smoothRadius={brushSettings.smooth || 1}
				smoothFriction={brushSettings.friction}
				smoothCurve={ToolToDrawZoneProps[selectedTool].smoothCurve}

				{...PaperProps}
			/>
		</StyledWorkspace>
		{(selectedTool === "brush" || selectedTool === "erase") &&
			<StyledBrushSettings
				key={selectedTool}
				settings={brushSettings}
				defaultPosition={position}
				onChange={setBrushSettings}
				onChangePosition={setPosition}
			/>
		}
	</Root>;
};

const Root = styled("div")`
  display: flex;
  position: relative;
  height: 100%;
  overflow: hidden;
`;

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
