import React, {useRef, useState} from "react";

// Components
import {IconButton, Paper, Stack, styled} from "@mui/material";
import BrushIcon from "@mui/icons-material/Brush";
import PenIcon from "@mui/icons-material/Edit";
import CursorIcon from "Components/@icons/CursorIcon";
import EraserIcon from "Components/@icons/EraserIcon";
import ColorPicker from "Components/ColorPicker";

// Stores, utils, libs
import Color from "Utils/draw/Color";


type TTool = "hand" | "brush" | "pen" | "erase";

export type ToolPanelProps = {
	className?: string,

	color: Color,
	onChangeColor: (color: Color) => void,

	selectedTool: TTool,
	onSelectTool: (instrument: TTool) => void,
}

const ToolPanel: React.FC<ToolPanelProps> = (
	{
		className,
		selectedTool,
		onSelectTool,
		color,
		onChangeColor,
	}
) => {
	const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
	const colorIconButtonRef = useRef<HTMLButtonElement | null>(null);

	return <Paper
		className={className}
		variant={"outlined"}
		sx={{
			padding: 0.75
		}}
	>
		<Stack
			direction={"column"}
			gap={0.75}
		>
			<IconButton
				ref={colorIconButtonRef}
				onClick={() => {
					setIsColorPickerOpen(true);
				}}
			>
				<ColorPreview
					style={{
						background: color.toHex()
					}}
				/>
			</IconButton>
			<ColorPicker
				anchorEl={colorIconButtonRef.current}
				open={isColorPickerOpen}
				color={color}
				onChangeColor={onChangeColor}
				onClose={() => {
					setIsColorPickerOpen(false);
				}}
			/>
			<IconButton
				color={selectedTool === "hand" ? "primary" : "default"}
				onClick={() => {
					onSelectTool("hand");
				}}
			>
				<CursorIcon />
			</IconButton>
			<IconButton
				color={selectedTool === "pen" ? "primary" : "default"}
				onClick={() => {
					onSelectTool("pen");
				}}
			>
				<PenIcon />
			</IconButton>
			<IconButton
				color={selectedTool === "brush" ? "primary" : "default"}
				onClick={() => {
					onSelectTool("brush");
				}}
			>
				<BrushIcon />
			</IconButton>
			<IconButton
				color={selectedTool === "erase" ? "primary" : "default"}
				onClick={() => {
					onSelectTool("erase");
				}}
			>
				<EraserIcon />
			</IconButton>
		</Stack>
	</Paper>;
};

const ColorPreview = styled("div")(({theme}) => ({
	width: theme.spacing(3),
	height: theme.spacing(3),
	borderRadius: "50%",
	border: "2px solid #eee"
}));


export default ToolPanel;
