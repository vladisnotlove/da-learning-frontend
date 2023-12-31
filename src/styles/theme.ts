import {createTheme} from "@mui/material";
import type {} from "@mui/lab/themeAugmentation";

let theme = createTheme({
	palette: {
		primary: {
			main: "#3b67c5"
		},
		text: {
			secondary: "rgba(0,0,0,0.64)",
			moreSecondary: "rgba(0,0,0,0.32)"
		},
		background: {
			lower1: "rgba(0,0,0,0.06)",
			header: "rgba(25,25,25,1)",
		},
		action: {
			hover: "rgba(7,30,101,0.04)",
			selected: "rgba(7,30,101,0.08)"
		}
	},
	typography: {
		fontFamily: "FiraSans",
		fontSize: 14,
		h1: {
			fontWeight: 500,
			fontSize: "2rem"
		},
		h3: {
			fontWeight: "normal",
			fontSize: "1.75rem"
		},
		body0: {
			fontSize: "1.125rem",
		}
	},
});

theme = createTheme({
	...theme,
	components: {
		MuiButton: {
			defaultProps: {
				disableElevation: true,
			}
		},
		MuiTableRow: {
			styleOverrides: {
				root: {
					"&:last-child td": {
						borderBottom: "none"
					}
				}
			}
		},
		MuiTableCell: {
			styleOverrides: {
				root: {
					borderBottom: `1px solid ${theme.palette.divider}`
				}
			}
		},
		MuiContainer: {
			defaultProps: {
				maxWidth: false,
			},
			styleOverrides: {
				root: {
					paddingLeft: theme.spacing(1.75),
					paddingRight: theme.spacing(1.75),
					"@media (min-width: 600px)": {
						paddingLeft: theme.spacing(1.75),
						paddingRight: theme.spacing(1.75),
					}
				},
			}
		},
		MuiAvatar: {
			styleOverrides: {
				root: {
					background: theme.palette.action.selected,
				}
			}
		},
		MuiTypography: {
			styleOverrides: {
				paragraph: {
					"&:last-child": {
						marginBottom: 0,
					},
					"&:first-child": {
						marginTop: 0,
					}
				}
			}
		}
	}
});

export default theme;
