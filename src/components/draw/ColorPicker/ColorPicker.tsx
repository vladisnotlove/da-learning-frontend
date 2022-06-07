import React, {useState} from "react";

// Components
import {Popover, PopoverProps} from "@mui/material";
import {SketchPicker, SketchPickerProps} from "react-color";

// Stores, utils, libs
import Color from "Utils/draw/Color";
import {PresetColor} from "react-color/lib/components/sketch/Sketch";


const MAX_PRESET_COLORS = 24;

type ColorPickerProps = {
	className?: string,
	color: Color,
	onChangeColor: (color: Color) => void,
	
} & Pick<PopoverProps, "anchorEl" | "open" | "onClose">

const ColorPicker: React.FC<ColorPickerProps> = (
	{
		className,
		anchorEl,
		open,
		color,
		onChangeColor,
		onClose,
	}
) => {
	const [presetColors, setPresetColors] = useState<SketchPickerProps["presetColors"]>([]);

	return <Popover
		classes={{
			root: className
		}}
		anchorEl={anchorEl}
		open={open}
		onClose={(event, reason) => {
			if (onClose) onClose(event, reason);
			setPresetColors((prev = []) => {
				const colorHex = color.toHex();
				if (presetColors?.find(presetColor => colorHex === presetColor)) {
					return prev;
				}
				if (prev.length + 1 > MAX_PRESET_COLORS) prev.pop();
				return [color.toHex() as PresetColor].concat(prev);
			});
		}}
		anchorOrigin={{
			vertical: "bottom",
			horizontal: "left",
		}}
	>
		<SketchPicker
			color={color.rgba}
			onChange={color => {
				onChangeColor(new Color({
					a: 255,
					...color.rgb,
				}));
			}}
			presetColors={presetColors}
		/>
	</Popover>;
};

export default ColorPicker;
