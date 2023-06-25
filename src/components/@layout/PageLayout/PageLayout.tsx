import React, {useEffect, useRef, useState} from "react";
import Logo from "Components/@common/Logo";
import Navigation from "./Navigation";
import BurgerNavigation from "Components/@layout/PageLayout/BurgerNavigation";
import ProfileWidget from "Components/@common/ProfileWidget";
import {styled, Container} from "@mui/material";

export const headerHeight_sp = 6;

export type PageLayoutProps = {
	className?: string,
	children?: React.ReactNode,
	navItems?: {
		label: string,
		href: string,
	}[],
	fullSizeContent?: boolean,
}

const PageLayout: React.FC<PageLayoutProps> = (
	{
		className,
		navItems = [],
		children,
		fullSizeContent,
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
			<BarInner>
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
			</BarInner>
		</Bar>
		{fullSizeContent ?
			<FullSizeContent>
				{children}
			</FullSizeContent> :
			<Content>
				{children}
			</Content>
		}
	</PageLayoutRoot>;
};

const PageLayoutRoot = styled("div")(() => ({
	minHeight: "100vh",
	display: "flex",
	flexDirection: "column",
	alignItems: "stretch",
}));

const Bar = styled("div")`
  background: ${p => p.theme.palette.background.header};
`;

const BarInner = styled(Container)(({theme}) => ({
	display: "flex",
	flexDirection: "row",
	alignItems: "center",
	gap: theme.spacing(2),
	height: theme.spacing(headerHeight_sp),
	color: theme.palette.primary.contrastText,
}));

const StyledLogo = styled(Logo)({
	flexShrink: 0
});

const NavigationContainer = styled("div")(() => ({
	flexGrow: 1,
	overflow: "hidden",
	height: "100%",
}));

const Content = styled(Container)(({theme}) => ({
	minHeight: 0,
	flexGrow: 1,
	paddingTop: theme.spacing(2),
	paddingBottom: theme.spacing(2),
}));

const FullSizeContent = styled("div")(({theme}) => ({
	height: `calc(100vh - ${theme.spacing(headerHeight_sp)})`,
	width: "100vw",
}));

export default PageLayout;
