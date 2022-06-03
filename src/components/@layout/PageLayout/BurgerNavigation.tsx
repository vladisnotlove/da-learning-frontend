import React from "react";

import {
	styled,
	IconButton,
	Drawer,
	ListItem,
	List,
	ListItemButton,
	ListItemText
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import {useRouter} from "next/router";
import useBoolean from "Hooks/useBoolean";


export type BurgerNavigationProps = {
	className?: string,
	navItems: {
		href: string,
		label: string,
	}[],
	attach?: "left" | "left-right",
}
const BurgerNavigation: React.FC<BurgerNavigationProps> = (
	{
		className,
		navItems,
		attach,
	}
) => {
	const router = useRouter();

	const {
		value: isOpen,
		setTrue: open,
		setFalse: close
	} = useBoolean(false);

	return <>
		<BurgerBtn
			className={className}
			onClick={open}
			attach={attach}
			color={"inherit"}
		>
			<MenuIcon />
		</BurgerBtn>
		<Drawer
			open={isOpen}
			onClose={close}
		>
			<StyledList>
				{navItems.map(navItem => (
					<ListItem
						component={"a"}
						key={navItem.href}
						href={navItem.href}
						onClick={() => router.push(navItem.href)}
						disablePadding
					>
						<ListItemButton
							selected={router.pathname === navItem.href}
						>
							<ListItemText primary={navItem.label} />
						</ListItemButton>
					</ListItem>
				))}
			</StyledList>
		</Drawer>
	</>;
};

const BurgerBtn = styled(IconButton)<Pick<BurgerNavigationProps, "attach">>(({theme, attach}) => ({
	...(attach?.includes("left") && {
		marginLeft: theme.spacing(-1),
	}),
	...(attach?.includes("right") && {
		marginRight: theme.spacing(-1),
	})
}));

const StyledList = styled(List)(({theme}) => ({
	maxWidth: `calc(100vw - ${theme.spacing(8)})`,
	width: theme.breakpoints.values.sm,
}));



export default BurgerNavigation;
