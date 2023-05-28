import React from "react";
import {Paper, Slider, styled, Typography} from "@mui/material";

const MIN_SIZE = 1;
const MAX_SIZE = 50;
const MIN_SMOOTH = 1;
const MAX_SMOOTH = 30;


export type TBrushSettings = {
	size?: number,
	smooth?: number,
}

export type BrushSettingsProps = {
	className?: string,
	children?: React.ReactNode,
	settings?: TBrushSettings,
	onChange: (settings: TBrushSettings) => void,
}

const BrushSettings: React.FC<BrushSettingsProps> = (
	{
		className,
		settings = {},
		onChange,
	}
) => {
	const {size, smooth} = settings;

	return <Root
		className={className}
	>
		{/* size */}
		<Typography variant={"body2"}>
			Размер
		</Typography>
		<StyledSlider
			min={MIN_SIZE}
			max={MAX_SIZE}
			value={size}
			onChange={(_event, value) => {
				onChange({
					...settings,
					size: value as number
				});
			}}
			valueLabelDisplay={"off"}
			size={"small"}
		/>
		<Typography variant={"body2"} fontFamily={"monospace"}>
			{size}px
		</Typography>

		{/* smooth */}
		<Typography variant={"body2"}>
			Сглаживание
		</Typography>
		<StyledSlider
			min={MIN_SMOOTH}
			max={MAX_SMOOTH}
			value={smooth}
			onChange={(_event, value) => {
				onChange({
					...settings,
					smooth: value as number
				});
			}}
			valueLabelDisplay={"off"}
			size={"small"}
		/>
		<Typography variant={"body2"}>
			{smooth}
		</Typography>
	</Root>;
};

const Root = styled(Paper)(({theme}) => {
	return {
		padding: theme.spacing(0.75, 2),
		display: "grid",
		alignItems: "center",
		gridTemplateColumns: "auto auto auto",
		columnGap: theme.spacing(2),
		rowGap: theme.spacing(1),
	};
});

const StyledSlider = styled(Slider)(({theme}) => ({
	width: theme.spacing(20),
}));

export default BrushSettings;
