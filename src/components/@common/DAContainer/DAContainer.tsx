import React from "react";
import {Container, ContainerProps, styled} from "@mui/material";


type DAContainerProps = {
	className?: string,
	children?: React.ReactNode,
	sx?: ContainerProps["sx"]
}

const DAContainer: React.FC<DAContainerProps> = (
	{
		className,
		children,
		sx,
	}
) => {
	return <StyledContainer
		className={className}
		sx={sx}
	>
		{children}
	</StyledContainer>;
};

const StyledContainer = styled(Container)(({theme}) => ({
	padding: theme.spacing(0, 3),
}));

export default DAContainer;
