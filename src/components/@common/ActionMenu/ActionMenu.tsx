import React, {useRef} from "react";

import {IconButton, ListItemText, Menu, MenuItem, MenuItemProps, MenuProps, styled} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import useBoolean from "Hooks/useBoolean";


type TAction = {
	label: React.ReactNode,
	MenuItemProps?: MenuItemProps,
	Wrapper?: (props: any) => JSX.Element,
	onClick?: () => void,
}

type ActionMenuProps = Pick<MenuProps, "anchorOrigin" | "transformOrigin"> & {
	className?: string,
	actions?: TAction[]
	onSelect?: (action: TAction) => void,
	attach?: "top-bottom" | "top-bottom-right"// todo: add other variants
	disabled?: boolean,
}

const ActionMenu: React.FC<ActionMenuProps> = (
	{
		className,
		actions,
		onSelect,
		attach,

		// mui props
		anchorOrigin = {
			horizontal: "left",
			vertical: "bottom"
		},
		transformOrigin = {
			horizontal: "left",
			vertical: "top",
		},
		disabled,
	}
) => {
	const btnRef = useRef<HTMLButtonElement | null>(null);
	const {
		value: isMenuOpen,
		setTrue: openMenu,
		setFalse: closeMenu,
	} = useBoolean(false);

	return <>
		<MenuBtnContainer
			className={className}
			attach={attach}
		>
			<IconButton
				ref={btnRef}
				onClick={openMenu}
				disabled={disabled}
			>
				<MoreVertIcon />
			</IconButton>
		</MenuBtnContainer>
		<Menu
			anchorEl={btnRef.current}
			open={isMenuOpen}
			onClose={closeMenu}
			PaperProps={{
				sx: () => ({
					minWidth: 200,
				})
			}}

			// from props
			anchorOrigin={anchorOrigin}
			transformOrigin={transformOrigin}
		>
			{actions?.map((action, index) => {
				const menuItemJSX = <MenuItem
					key={index}
					onClick={() => {
						if (action.onClick) action.onClick();
						if (onSelect) onSelect(action);
						closeMenu();
					}}
					{...action.MenuItemProps}
				>
					<ListItemText>
						{action.label}
					</ListItemText>
				</MenuItem>;

				if (action.Wrapper) {
					const Wrapper = action.Wrapper;
					return <Wrapper key={index}>
						{menuItemJSX}
					</Wrapper>;
				}
				return menuItemJSX;
			})}
		</Menu>
	</>;
};

const MenuBtnContainer = styled("div")<{attach?: ActionMenuProps["attach"]}>(({theme, attach}) => ({
	...(attach === "top-bottom" && {
		marginTop: theme.spacing(-1),
		marginBottom: theme.spacing(-1),
	}),
	...(attach === "top-bottom-right" && {
		marginRight: theme.spacing(-1),
		marginTop: theme.spacing(-1),
		marginBottom: theme.spacing(-1),
	}),
}));

export default ActionMenu;
