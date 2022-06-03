import React from "react";
import {TApiErrors} from "Api/@core/errors";
import {Alert, styled} from "@mui/material";


type ApiErrorsProps = {
	className?: string,
	errors: TApiErrors
}

const ApiErrors: React.FC<ApiErrorsProps> = (
	{
		className,
		errors
	}
) => {

	return <div
		className={className}
	>
		{Object.values(errors).map((message, index) => (
			<StyledAlert
				key={index}
				severity={"error"}
			>
				{message}
			</StyledAlert>
		))}
	</div>;
};

const StyledAlert = styled(Alert)(({theme}) => ({
	marginBottom: theme.spacing(1),
	"&:last-child": {
		marginBottom: 0,
	}
}));

export default ApiErrors;
