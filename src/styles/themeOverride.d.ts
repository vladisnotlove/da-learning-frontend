// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {Typography, TypographyOptions, TypographyStyleOptions} from "@mui/material/styles/createTypography";

declare module "@mui/material/styles/createTypography" {
	export interface TypographyOptions {
		body0: TypographyStyleOptions,
	}

	export interface Typography {
		body0: TypographyStyleOptions,
	}
}
