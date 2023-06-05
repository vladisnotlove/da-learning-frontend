import React from "react";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	InputAdornment,
	styled,
	TextField
} from "@mui/material";
import {Controller, useForm} from "react-hook-form";
import {Height} from "@mui/icons-material";

const parseNumberValue = (value: string) => {
	const num = parseFloat(value);
	return isNaN(num) ? "" : num;
};

type TResizeValues = {
	width: number,
	height: number,
}

type ResizeDialogProps = {
	className?: string,
	children?: React.ReactNode,
	open: boolean,
	onClose: () => void,
	onSave: (data: TResizeValues) => void,
	defaultValues?: TResizeValues,
}

const ResizeDialog: React.FC<ResizeDialogProps> = (
	{
		className,
		open,
		onSave,
		onClose,
		defaultValues,
	}
) => {
	const {control, handleSubmit, reset} = useForm<TResizeValues>({defaultValues});

	return <Dialog
		open={open}
		className={className}
	>
		<DialogTitle>
			Изменение размера холста
		</DialogTitle>
		<DialogContent>
			<Form
				id={"resizeDialog"}
				onSubmit={handleSubmit(data => {
					onSave(data);
				})}
			>
				<Controller
					name={"width"}
					control={control}
					render={({field, fieldState}) => {
						return <TextField
							type="number"
							label={"Ширина"}
							margin="dense"
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<Height style={{transform: "rotate(90deg)"}} />
									</InputAdornment>
								),
							}}

							value={field.value}
							onChange={(e) => {
								const value = parseNumberValue(e.target.value);
								field.onChange(value);
							}}
							error={!!fieldState.error}
							helperText={fieldState.error?.message}
						/>;
					}}
					rules={{
						required: "Обязательное поле",
						min: {
							value: 100,
							message: "Минимальная ширина 100px"
						},
					}}
				/>
				<Controller
					name={"height"}
					control={control}
					render={({field, fieldState}) => {
						return <TextField
							type="number"
							label={"Высота"}
							margin="dense"
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<Height />
									</InputAdornment>
								),
							}}

							value={field.value}
							onChange={(e) => {
								const value = parseNumberValue(e.target.value);
								field.onChange(value);
							}}
							error={!!fieldState.error}
							helperText={fieldState.error?.message}
						/>;
					}}
					rules={{
						required: "Обязательное поле",
						min: {
							value: 100,
							message: "Минимальная высота 100px"
						},
					}}
				/>
			</Form>
		</DialogContent>
		<DialogActions>
			<Button variant={"text"} onClick={() => {
				onClose();
				reset();
			}}>
				Отмена
			</Button>
			<Button
				variant={"contained"}
				type={"submit"}
				form={"resizeDialog"}
			>
				Сохранить
			</Button>
		</DialogActions>
	</Dialog>;
};

const Form = styled("form")`
  display: flex;
  flex-direction: column;
  gap: ${p => p.theme.spacing(1)}
`;

export default ResizeDialog;
