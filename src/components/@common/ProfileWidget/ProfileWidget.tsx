import React, {useRef} from "react";

// Components
import {Button, Divider, IconButton, ListItemIcon, Menu, MenuItem, styled} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LoginForm from "Components/@common/LoginForm";

// Stores, utils, libs
import useBoolean from "Hooks/useBoolean";
import useTranslation from "next-translate/useTranslation";
import useProfile from "Api/profile/useProfile";
import useLogout from "Api/auth/useLogout";
import getProfileName from "Modules/profile/getProfileName";
import useLogin from "Api/auth/useLogin";


type ProfileWidgetProps = {
	className?: string,
	attach?: "right" | "left-right"
}

const ProfileWidget: React.FC<ProfileWidgetProps> = (
	{
		className,
		attach,
	}
) => {
	const {t} = useTranslation();

	const {
		value: isProfileOpen,
		setTrue: openProfile,
		setFalse: closeProfile,
	} = useBoolean(false);

	const {
		value: isLoginFormOpen,
		setTrue: openLoginForm,
		setFalse: closeLoginForm,
	} = useBoolean(false);

	const buttonRef = useRef<HTMLButtonElement | null>(null);

	const profile = useProfile();
	const logout = useLogout();
	const login = useLogin();

	return <>
		{/* Authenticated */}
		{profile.isSuccess && profile.data &&
			<>
				<AttachableIconButton
					ref={buttonRef}
					className={className}
					onClick={openProfile}
					attach={attach}
					sx={(theme) => ({
						color: theme.palette.primary.contrastText,
					})}
				>
					<AccountCircleIcon />
				</AttachableIconButton>
				<Menu
					anchorEl={buttonRef.current}
					open={isProfileOpen}
					onClose={closeProfile}
					PaperProps={{
						style: {
							minWidth: "20ch",
						},
					}}
				>
					<MenuItem>
						<ListItemIcon>
							<AccountCircleIcon />
						</ListItemIcon>
						{getProfileName(profile.data)}
					</MenuItem>
					<Divider />
					<MenuItem
						onClick={() => {
							logout.mutate(undefined, {
								onSuccess: () => {
									closeProfile();
								}
							});
						}}
					>
						{t("common:logout")}
					</MenuItem>
				</Menu>
			</>
		}
		{/* Anonymous */}
		{profile.isError &&
			<>
				<AttachableButton
					className={className}
					onClick={openLoginForm}
					attach={attach}
					sx={(theme) => ({
						color: theme.palette.primary.contrastText,
					})}
				>
					{t("common:login")}
				</AttachableButton>
				<LoginForm
					open={isLoginFormOpen}
					onClose={closeLoginForm}
					onSubmit={data => {
						login.mutate(data, {
							onSuccess: () => {
								closeLoginForm();
							}
						});
					}}
					apiErrors={login.error || undefined}
				/>
			</>
		}
	</>;
};

const AttachableIconButton = styled(IconButton)<Pick<ProfileWidgetProps, "attach">>(({theme, attach}) => ({
	...(attach?.includes("left") && {
		marginLeft: theme.spacing(-1),
	}),
	...(attach?.includes("right") && {
		marginRight: theme.spacing(-1),
	})
}));

const AttachableButton = styled(Button)<Pick<ProfileWidgetProps, "attach">>(({theme, attach}) => ({
	...(attach?.includes("left") && {
		marginLeft: theme.spacing(-1),
	}),
	...(attach?.includes("right") && {
		marginRight: theme.spacing(-1),
	})
}));

export default ProfileWidget;
