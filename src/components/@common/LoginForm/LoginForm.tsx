import React from "react";

// Components
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField} from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import {useForm} from "react-hook-form";
import {TApiErrors} from "Api/@core/errors";
import ApiErrors from "Components/@common/ApiErrors";

// Stores, utils, libs


const MIN_PASSWORD_LENGTH = 8;

type TFormValues = {
	username: string,
	password: string,
}

type LoginFormProps = {
	className?: string,
	open: boolean,
	onClose: () => void,
	onSubmit: (data: TFormValues) => void,
	apiErrors?: TApiErrors,
}

const LoginForm: React.FC<LoginFormProps> = (
	{
		className,
		open,
		onClose,
		onSubmit,
		apiErrors,
	}
) => {
	const {t} = useTranslation();

	const {
		register,
		handleSubmit,
		formState,
	} = useForm<TFormValues>();

	return <Dialog
		className={className}
		open={open}
		onClose={onClose}
		PaperProps={{
			sx: {
				maxWidth: "280px",
			}
		}}
		fullWidth
	>
		<DialogTitle
			sx={{
				fontSize: "1.5rem"
			}}
		>
			{t("common:loginAsProcess")}
		</DialogTitle>
		<form
			onSubmit={handleSubmit(data => {
				onSubmit(data);
			})}
		>
			<DialogContent>
				<Stack
					flexDirection={"column"}
					gap={2}
				>
					{apiErrors &&
						<ApiErrors
							errors={apiErrors}
						/>
					}
					<TextField
						label={t("common:loginAsField")}

						{...register("username", {
							required: t("common:@messages.fieldIsRequired")
						})}
						error={!!formState.errors.username?.message}
						helperText={formState.errors.username?.message}
					/>
					<TextField
						label={t("common:password")}
						placeholder={"•".repeat(MIN_PASSWORD_LENGTH)}
						type={"password"}

						{...register("password", {
							required: t("common:@messages.fieldIsRequired"),
						})}
						error={!!formState.errors.password?.message}
						helperText={formState.errors.password?.message}
					/>
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button
					variant={"contained"}
					size={"large"}
					fullWidth
					type={"submit"}
				>
					{t("common:login")}
				</Button>
			</DialogActions>
		</form>
	</Dialog>;
};

export default LoginForm;
