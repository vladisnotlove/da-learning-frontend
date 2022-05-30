import {createTheme} from "@mui/material";

let theme = createTheme({
	palette: {
		primary: {
			main: "#5567da"
		},
		text: {
			secondary: "rgba(0,0,0,0.5)"
		},
	},
	typography: {
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
