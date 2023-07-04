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
import useTranslation from "next-translate/useTranslation";

const parseNumberValue = (value: string) => {
	const num = parseFloat(value);
	return isNaN(num) ? "" : num;
};

type TNewImageValues = {
	name?: string,
	width: number,
	height: number,
}

type TFormMethods = {
	reset: (values?: TNewImageValues) => void
}

type NewImageDialogProps = {
	className?: string,
	children?: React.ReactNode,
	open: boolean,
	onClose: (formMethods: TFormMethods) => void,
	onSave: (data: TNewImageValues, formMethods: TFormMethods) => void,
	defaultValues?: TNewImageValues,
}

const NewImageDialog: React.FC<NewImageDialogProps> = (
	{
		className,
		open,
		onSave,
		onClose,
		defaultValues = {
			width: 1280,
			height: 720,
		},
	}
) => {
	const {t} = useTranslation();

	const {control, handleSubmit, reset} = useForm<TNewImageValues>({
		defaultValues: {
			name: t("editor:noName"),
			...defaultValues,
		}
	});

	return <Dialog
		open={open}
		className={className}
	>
		<DialogTitle>
			{t("common:newFile")}
		</DialogTitle>
		<DialogContent>
			<Form
				id={"resizeDialog"}
				onSubmit={handleSubmit(data => {
					onSave(data, {reset});
				})}
			>
				<Controller
					name={"name"}
					control={control}
					render={({field, fieldState}) => {
						return <TextField
							label={t("common:name")}
							margin="dense"

							value={field.value}
							onChange={field.onChange}
							error={!!fieldState.error}
							helperText={fieldState.error?.message}
						/>;
					}}
				/>
				<Controller
					name={"width"}
					control={control}
					render={({field, fieldState}) => {
						return <TextField
							type="number"
							label={t("editor:width")}
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
								// @ts-ignore
								field.onChange(value);
							}}
							error={!!fieldState.error}
							helperText={fieldState.error?.message}
						/>;
					}}
					rules={{
						required: t("common:@messages.fieldIsRequired"),
						min: {
							value: 100,
							message: t("editor:@messages.minWidth", {count: 100}),
						},
					}}
				/>
				<Controller
					name={"height"}
					control={control}
					render={({field, fieldState}) => {
						return <TextField
							type="number"
							label={t("editor:height")}
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
								// @ts-ignore
								field.onChange(value);
							}}
							error={!!fieldState.error}
							helperText={fieldState.error?.message}
						/>;
					}}
					rules={{
						required: t("common:@messages.fieldIsRequired"),
						min: {
							value: 100,
							message: t("editor:@messages.minHeight", {count: 100}),
						},
					}}
				/>
			</Form>
		</DialogContent>
		<DialogActions>
			<Button variant={"text"} onClick={() => {
				onClose({reset});
			}}>
				{t("common:cancel")}
			</Button>
			<Button
				variant={"contained"}
				type={"submit"}
				form={"resizeDialog"}
			>
				{t("common:create")}
			</Button>
		</DialogActions>
	</Dialog>;
};

const Form = styled("form")`
  display: flex;
  flex-direction: column;
  gap: ${p => p.theme.spacing(1)}
`;

export default NewImageDialog;
