import React from "react";

// Components
import {Paper, Slider, styled, Typography} from "@mui/material";


const MIN_RADIUS = 1;
const MAX_RADIUS = 50;

type CircleSizeInputProps = {
	className?: string,
	children?: React.ReactNode,
	size: number,
	onChangeSize: (size: number) => void,
}

const CircleSizeInput: React.FC<CircleSizeInputProps> = (
	{
		className,
		size,
		onChangeSize,
	}
) => {

	return <Root
		className={className}
		variant={"outlined"}
	>
		<StyledSlider
			min={MIN_RADIUS}
			max={MAX_RADIUS}
			value={size}
			onChange={(_event, value) => {
				onChangeSize(value as number);
			}}
			valueLabelDisplay={"off"}
			size={"small"}
		/>
		<Typography variant={"body2"}>
			{size}px
		</Typography>
	</Root>;
};

const Root = styled(Paper)(({theme}) => ({
	display: "flex",
	alignItems: "center",
	gap: theme.spacing(2),
	padding: theme.spacing(0.5, 2),
}));

const StyledSlider = styled(Slider)(({theme}) => ({
	width: theme.spacing(20),
}));

export default CircleSizeInput;
