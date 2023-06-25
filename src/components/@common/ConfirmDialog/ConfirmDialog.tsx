import React from "react";
import {
	Dialog,
	Button,
	ButtonProps,
	DialogActions,
	DialogContent,
	DialogTitle,
	Typography,
} from "@mui/material";
import ApiErrors from "Components/@common/ApiErrors";
import useTranslation from "next-translate/useTranslation";
import {TApiErrors} from "Api/@core/errors";


type ConfirmDialogProps = {
	content: {
		title: React.ReactElement | string,
		description: React.ReactElement | string,
		ConfirmBtnProps?: ButtonProps,
		CloseBtnProps?: ButtonProps,
	}
	open: boolean,
	onClose: () => void,
	onConfirm: () => void,
	loading?: boolean,
	errors?: TApiErrors,
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = (
	{
		content,
		open,
		onClose,
		onConfirm,
		loading,
		errors,
	}
) => {
	const {t} = useTranslation();

	return <Dialog
		open={open}
		maxWidth={"xs"}
		fullWidth
		onClose={() => {
			if (!loading) onClose();
		}}
	>
		<DialogTitle>
			{content.title}
		</DialogTitle>
		<DialogContent>
			{errors && Object.values(errors).length > 0 &&
				<Typography paragraph>
					{<ApiErrors
						errors={errors}
					/>}
				</Typography>
			}
			<Typography paragraph>
				{content.description}
			</Typography>
		</DialogContent>
		<DialogActions>
			<Button
				variant={"contained"}
				color={"error"}
				onClick={onConfirm}
				{...content?.ConfirmBtnProps}
				disabled={loading}
			>
				{content.ConfirmBtnProps?.children || t("common:confirm")}
			</Button>
			<Button
				variant={"text"}
				color={"inherit"}
				onClick={onClose}
				{...content?.CloseBtnProps}
				disabled={loading}
			>
				{content.CloseBtnProps?.children || t("common:cancel")}
			</Button>
		</DialogActions>
	</Dialog>;
};

export default ConfirmDialog;
