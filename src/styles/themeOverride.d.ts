// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {Typography, TypographyOptions, TypographyStyleOptions} from "@mui/material/styles/createTypography";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {TypeBackground} from "@mui/material/styles/createPalette";

declare module "@mui/material/styles/createTypography" {
	export interface TypographyOptions {
		body0: TypographyStyleOptions,
	}

	export interface Typography {
		body0: TypographyStyleOptions,
	}
}

declare module "@mui/material/styles/createPalette" {
	export interface TypeBackground {
		lower1: string,
	}
}

