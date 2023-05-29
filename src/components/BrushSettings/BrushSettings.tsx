import React from "react";
import {Slider, styled, Typography} from "@mui/material";
import Window from "../@common/Window/index";

const MIN_SIZE = 1;
const MAX_SIZE = 50;
const MIN_SMOOTH = 1;
const MAX_SMOOTH = 30;


export type TBrushSettings = {
	size: number,
	smooth: number,
}

export type BrushSettingsProps = {
	className?: string,
	children?: React.ReactNode,
	settings: TBrushSettings,
	defaultPosition?: {x: number, y: number},
	onChange: (settings: TBrushSettings) => void,
	onChangePosition?: (position: {x: number, y: number}) => void,
}

const BrushSettings: React.FC<BrushSettingsProps> = (
	{
		className,
		settings ,
		defaultPosition,
		onChange,
		onChangePosition,
	}
) => {
	const {size, smooth} = settings;

	return <Window
		className={className}
		title={"Настройки кисти"}
		defaultPosition={defaultPosition}
		onChangePosition={onChangePosition}
		disableClose
	>
		<Props>
			{/* size */}
			<Prop>
				<Typography variant={"body2"}>
					Размер
				</Typography>
				<PropBody>
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
					<Preview variant={"body2"} fontFamily={"monospace"}>
						{size}px
					</Preview>
				</PropBody>
			</Prop>
			{/* smooth */}
			<Prop>
				<Typography variant={"body2"}>
					Сглаживание
				</Typography>
				<PropBody>
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
					<Preview variant={"body2"} fontFamily={"monospace"}>
						{smooth}
					</Preview>
				</PropBody>
			</Prop>
		</Props>
	</Window>;
};

const Props = styled("div")`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing(1)};
`;

const Prop = styled("div")`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing(0.25)};
`;

const PropBody = styled("div")`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing(1)};
`;

const Preview = styled(Typography)`
  width: 4ch;
`;

const StyledSlider = styled(Slider)`
  grid-area: s;
  width: ${({theme}) => theme.spacing(18)};
`;

export default BrushSettings;
