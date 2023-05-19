import React from "react";
import {Box, styled} from "@mui/material";
import Link from "next/link";
import routes from "Constants/routes";

// Components

// Stores, utils, libs

type LogoProps = {
	className?: string,
	children?: React.ReactNode,
}

const Logo: React.FC<LogoProps> = (
	{
		className,
	}
) => {
	return <Link
		href={routes.index()}
	>
		<StyledText
			className={className}
		>
			da-learning
		</StyledText>
	</Link>;
};

const StyledText = styled(Box)(() => ({
	fontSize: "1.125rem",
	cursor: "pointer",
}));

export default Logo;
