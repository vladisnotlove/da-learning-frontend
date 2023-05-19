import React from "react";

import {
	Stack,
	styled,
} from "@mui/material";
import Link from "next/link";

import {useRouter} from "next/router";


export type NavigationProps = {
	className?: string,
	navItems: {
		href: string,
		label: string,
	}[],
	invisible?: boolean,
}

const Navigation: React.FC<NavigationProps> = (
	{
		className,
		navItems,
		invisible,
	}
) => {
	const router = useRouter();

	return <NavigationContainer
		className={className}
		direction={"row"}
		alignItems={"center"}
		flexWrap={"nowrap"}
		sx={invisible ?
			{
				pointerEvents: "none",
				opacity: 0,
			} :
			undefined
		}
	>
		{navItems.map(navItem => (
			<Link
				key={navItem.href}
				href={navItem.href}
			>
				<NavItem
					className={router.pathname === navItem.href ? "active" : undefined}
				>
					{navItem.label}
				</NavItem>
			</Link>
		))}
	</NavigationContainer>;
};

const NavigationContainer = styled(Stack)(() => ({
	height: "100%",
}));

const NavItem = styled("div")(({theme}) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	padding: theme.spacing(0, 1.5),
	height: "100%",
	borderRadius: 0,

	color: "inherit",
	transition: `background-color ${theme.transitions.duration.short}ms`,

	"&:hover": {
		background: `rgba(255, 255, 255, ${theme.palette.action.hoverOpacity * 2})`,
		cursor: "pointer",
	},
	"&.active": {
		background: `rgba(255, 255, 255, ${theme.palette.action.selectedOpacity * 2})`,
	}
}));

export default Navigation;
