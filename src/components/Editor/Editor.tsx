import React, {useState} from "react";

// Components
import {styled} from "@mui/material";
import Workspace from "Components/Workspace";
import DrawZone, {DrawZoneProps} from "Components/DrawZone";
import ToolPanel, {ToolPanelProps} from "Components/ToolPanel";
import FilePanel from "../FilePanel/index";
import LayersPanel from "../LayersPanel/index";
import BrushSettings, {TBrushSettings} from "../BrushSettings/index";
import NewImageDialog from "../NewImageDialog/index";
import ResizeDialog from "../ResizeDialog/index";

// Stores, utils, libs
import Color from "Utils/draw/Color";
import useLocalStorage from "Hooks/useLocalStorage";
import {TTool} from "Constants/tools";
import createEmptyImageData from "Utils/imageData/createEmptyImageData";
import Vector from "Utils/geometry/Vector";
import resizeImageData from "Utils/imageData/resizeImageData";
import useDrawZone from "../DrawZone/useDrawZone";
import {useHistoryState} from "Hooks/useHistoryState";
import useWindowEvent from "Hooks/useWindowEvent";

const DEFAULT_FILENAME = "Без названия";

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

	const [stamp, setStamp, {undo, redo, reset: resetStamp}] = useHistoryState({
		size: new Vector(800, 600),
		layers: [{id: 0, imageData: createEmptyImageData(new Vector(800, 600))}]
	});
	const [isResizeOpen, setIsResizeOpen] = useState(false);
	const [isNewImageOpen, setIsNewImageOpen] = useState(false);

	const [activeLayerId, setActiveLayerId] = useState(0);

	const [
		selectedTool,
		setSelectedTool
	] = useLocalStorage<TTool>("da-selectedTool", "hand");

	const [
		brushSettings,
		setBrushSettings
	] = useLocalStorage<TBrushSettings>("da-tool-" + selectedTool, ToolToBrushSettings[selectedTool]);
	const [position, setPosition] = useState({x: 0, y: 0});
	const [collapsed, setCollapsed] = useState(false);

	const [color, setColor] = useState<ToolPanelProps["color"]>(
		new Color({r: 0, g: 0, b: 0, a: 1})
	);

	const {control, downloadImage} = useDrawZone();

	const [fileName, setFileName] = useState(DEFAULT_FILENAME);
	const [savedFileName, setSavedFileName] = useState(DEFAULT_FILENAME);
	const [isEditing, setIsEditing] = useState(false);

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

	return <Root
		className={className}
	>
		<StyledFilePanel
			fileName={isEditing ? fileName : savedFileName}
			defaultFileName={DEFAULT_FILENAME}
			onEditStart={() => setIsEditing(true)}
			onChange={setFileName}
			onEditEnd={fileName => {
				setIsEditing(false);
				setFileName(fileName);
				setSavedFileName(fileName);
			}}
			onAction={(action) => {
				if (action === "download") {
					downloadImage(fileName);
				}
				if (action === "change-size") {
					setIsResizeOpen(true);
				}
				if (action === "new-file") {
					setIsNewImageOpen(true);
				}
			}}
		/>
		<StyledToolPanel
			selectedTool={selectedTool}
			onSelectTool={tool => {
				setSelectedTool(tool);
			}}
			color={color}
			onChangeColor={setColor}
		/>
		<WorkspaceWrapper>
			<StyledWorkspace
				key={`${stamp.size.x}-${stamp.size.y}`}
			>
				<DrawZone
					control={control}
					width={stamp.size.x}
					height={stamp.size.y}

					layers={stamp.layers}
					activeLayerId={activeLayerId}
					onLayersUpdate={(layers) => {
						setStamp(prev => ({
							...prev,
							layers,
						}));
					}}

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
					collapsed={collapsed}
					defaultPosition={position}
					onChange={setBrushSettings}
					onChangePosition={setPosition}
					onCollapse={() => setCollapsed(true)}
					onExpand={() => setCollapsed(false)}
				/>
			}
		</WorkspaceWrapper>
		<StyledLayersPanel
			width={stamp.size.x}
			height={stamp.size.y}
			layers={stamp.layers}
			activeLayerId={activeLayerId}
			onLayersChange={(layers) => {
				setStamp(prev => ({
					...prev,
					layers,
				}));
			}}
			onLayerSelect={layer => {
				setActiveLayerId(layer.id);
			}}
		/>
		<ResizeDialog
			key={`${stamp.size.x}-${stamp.size.y}`}
			open={isResizeOpen}
			onClose={() => {
				setIsResizeOpen(false);
			}}
			onSave={({width, height}) => {
				const size = new Vector(width, height);
				setStamp(prev => ({
					...prev,
					layers: prev.layers.map(layer => ({
						...layer,
						imageData: resizeImageData(layer.imageData, size)
					})),
					size: size,
				}));
				setIsResizeOpen(false);
			}}
			defaultValues={{
				width: stamp.size.x,
				height: stamp.size.y
			}}
		/>
		<NewImageDialog
			open={isNewImageOpen}
			onClose={({reset}) => {
				setIsNewImageOpen(false);
				reset();
			}}
			onSave={({name, width, height}, {reset}) => {
				const size = new Vector(width, height);
				resetStamp({
					layers: [{id: 0, imageData: createEmptyImageData(size)}],
					size: size,
				});
				setSavedFileName(name?.trim() || DEFAULT_FILENAME);
				setIsNewImageOpen(false);
				reset();
			}}
		/>
	</Root>;
};

const Root = styled("div")`
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: min-content 1fr;
  grid-template-areas: 
	"f f f"
	"t w l";
  position: relative;
  height: 100%;
  overflow: hidden;
`;

const WorkspaceWrapper = styled("div")`
  grid-area: w;
  position: relative;
  flex-grow: 1;
  width: 100%;
  min-height: 200px;
`;

const StyledWorkspace = styled(Workspace)`
  flex-grow: 1;
  width: 100%;
  height: 100%;
  background: ${p => p.theme.palette.background.lower1};
`;

const StyledBrushSettings = styled(BrushSettings)`
  position: absolute;
  top: ${p => p.theme.spacing(2)};
  left: ${p => p.theme.spacing(2)};
  z-index: 100;
`;

const StyledFilePanel = styled(FilePanel)`
  grid-area: f;
`;

const StyledToolPanel = styled(ToolPanel)`
  grid-area: t;
  border-top: none;
`;

const StyledLayersPanel = styled(LayersPanel)`
  grid-area: l;
  border-top: none;
`;


export default Editor;
