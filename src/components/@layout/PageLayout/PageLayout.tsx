import React, {useEffect, useRef, useState} from "react";

// Components
import Logo from "Components/@common/Logo";
import Navigation from "./Navigation";
import DAContainer from "Components/@common/DAContainer";
import BurgerNavigation from "Components/@layout/PageLayout/BurgerNavigation";
import ProfileWidget from "Components/@common/ProfileWidget";

// Stores, utils, libs
import {styled} from "@mui/material";


export type PageLayoutProps = {
	className?: string,
	children?: React.ReactNode,
	navItems?: {
		label: string,
		href: string,
	}[]
}

const PageLayout: React.FC<PageLayoutProps> = (
	{
		className,
		navItems = [],
		children,
	}
) => {
	const [isNavigationCollapsed, setIsNavigationCollapsed] = useState(false);
	const navigationContainerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const onResize = () => {
			const navigationContainer = navigationContainerRef.current;
			if (navigationContainer) {
				const overflowed = navigationContainer.scrollWidth > navigationContainer.clientWidth;
				setIsNavigationCollapsed(overflowed);
			}
		};
		onResize();
		window.addEventListener("resize", onResize);

		return () => {
			window.removeEventListener("resize", onResize);
		};
	}, []);

	return <PageLayoutRoot
		className={className}
	>
		<Bar>
			{isNavigationCollapsed &&
				<BurgerNavigation
					navItems={navItems}
					attach={"left-right"}
				/>
			}
			<StyledLogo />
			<NavigationContainer
				ref={navigationContainerRef}
			>
				<Navigation
					navItems={navItems}
					invisible={isNavigationCollapsed}
				/>
			</NavigationContainer>
			<ProfileWidget
				attach={"left-right"}
			/>
		</Bar>
		<Content>
			{children}
		</Content>
	</PageLayoutRoot>;
};

const PageLayoutRoot = styled("div")(() => ({
	minHeight: "100vh",
	display: "flex",
	flexDirection: "column",
	alignItems: "stretch",
}));

const Bar = styled(DAContainer)(({theme}) => ({
	display: "flex",
	flexDirection: "row",
	alignItems: "center",
	gap: theme.spacing(2),
	height: theme.spacing(6),

	background: theme.palette.background.lower1,
}));

const StyledLogo = styled(Logo)({
	flexShrink: 0
});

const NavigationContainer = styled("div")(() => ({
	flexGrow: 1,
	overflow: "hidden",
	height: "100%",
}));

const Content = styled(DAContainer)(({theme}) => ({
	paddingTop: theme.spacing(2),
	paddingBottom: theme.spacing(2),
}));

export default PageLayout;
