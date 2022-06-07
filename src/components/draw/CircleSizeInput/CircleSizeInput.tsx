import React from "react";

// Components
import {Paper, Slider, styled} from "@mui/material";

// Stores, utils, libs


const MIN_RADIUS = 0.5;
const MAX_RADIUS = 50;

type CircleSizeInputProps = {
	className?: string,
	children?: React.ReactNode,
	radius: number,
	onChangeRadius: (radius: number) => void,
}

const CircleSizeInput: React.FC<CircleSizeInputProps> = (
	{
		className,
		radius,
		onChangeRadius,
	}
) => {

	return <Root
		className={className}
		variant={"outlined"}
	>
		<StyledSlider
			min={MIN_RADIUS}
			max={MAX_RADIUS}
			value={radius}
			onChange={(_event, value) => {
				onChangeRadius(value as number);
			}}
			valueLabelDisplay={"auto"}
			size={"small"}
		/>
		<PreviewCircle
			radius={radius}
		/>
	</Root>;
};

const Root = styled(Paper)(({theme}) => ({
	display: "flex",
	alignItems: "center",
	gap: theme.spacing(2),
	padding: theme.spacing(0.5, 2),
}));

const PreviewCircle = styled("div")<{radius: number}>(({theme, radius}) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	width: theme.spacing(2),
	height: theme.spacing(2),

	"&:after": {
		content: "\"\"",
		display: "inline-block",
		width: "100%",
		height: "100%",
		transform: `scale(${Math.max(radius / MAX_RADIUS)})`,
		borderRadius: "50%",
		background: theme.palette.text.primary,
	}
}));

const StyledSlider = styled(Slider)(({theme}) => ({
	width: theme.spacing(20),
}));

export default CircleSizeInput;
