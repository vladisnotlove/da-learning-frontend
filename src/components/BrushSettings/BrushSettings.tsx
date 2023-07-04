import React from "react";
import {Collapse, IconButton, Slider, styled, Typography} from "@mui/material";
import Window from "../@common/Window/index";
import {ExpandLess} from "@mui/icons-material";
import useTranslation from "next-translate/useTranslation";

const MIN_SIZE = 1;
const MAX_SIZE = 100;
const MIN_SMOOTH = 1;
const MAX_SMOOTH = 30;
const MIN_FRICTION = 0;
const MAX_FRICTION = 0.6;


export type TBrushSettings = {
	size: number,
	smooth: number,
	friction: number,
}

export type BrushSettingsProps = {
	className?: string,
	children?: React.ReactNode,
	settings: TBrushSettings,
	collapsed?: boolean,
	defaultPosition?: { x: number, y: number },
	onChange: (settings: TBrushSettings) => void,
	onChangePosition?: (position: { x: number, y: number }) => void,
	onCollapse?: () => void,
	onExpand?: () => void,
}

const BrushSettings: React.FC<BrushSettingsProps> = (
	{
		className,
		settings,
		collapsed,
		defaultPosition,
		onChange,
		onChangePosition,
		onCollapse,
		onExpand,
	}
) => {
	const {t} = useTranslation();
	const {size, smooth, friction} = settings;

	return <Window
		className={className}
		title={t("editor:brushSettings")}
		action={
			<IconButton
				onClick={() => {
					if (collapsed) {
						if (onExpand) onExpand();
					}
					else {
						if (onCollapse) onCollapse();
					}
				}}
				style={{
					transform: collapsed ? "rotate(180deg)" : undefined
				}}
			>
				<ExpandLess
					fontSize={"small"}
				/>
			</IconButton>
		}
		defaultPosition={defaultPosition}
		onChangePosition={onChangePosition}
		disableClose
		disableGap
	>
		<Collapse in={!collapsed}>
			<Props>
				{/* size */}
				<Prop>
					<Typography variant={"body2"}>
						{t("editor:size")}
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
						{t("editor:smoothRadius")}
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
				{/* Friction */}
				<Prop>
					<Typography variant={"body2"}>
						{t("editor:friction")}
					</Typography>
					<PropBody>
						<StyledSlider
							min={MIN_FRICTION}
							max={MAX_FRICTION}
							step={0.05}
							value={friction}
							onChange={(_event, value) => {
								onChange({
									...settings,
									friction: value as number
								});
							}}
							valueLabelDisplay={"off"}
							size={"small"}
						/>
						<Preview variant={"body2"} fontFamily={"monospace"}>
							{friction.toFixed(2)}
						</Preview>
					</PropBody>
				</Prop>
			</Props>
		</Collapse>
	</Window>;
};

const Props = styled("div")`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing(1)};
  padding-top: ${p => p.theme.spacing(3)};
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
