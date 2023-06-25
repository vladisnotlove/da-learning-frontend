import React, {useEffect} from "react";

import Head from "next/head";
import {CssBaseline, ThemeProvider} from "@mui/material";
import {AppProps} from "next/app";
import {CacheProvider, EmotionCache} from "@emotion/react";
import createEmotionCache from "Configs/createEmotionCache";
import theme from "Styles/theme";
import useTranslation from "next-translate/useTranslation";
import cookies from "Utils/cookies";
import cookieNames from "Constants/cookieNames";
import {QueryClient, QueryClientProvider} from "react-query";
import {defaultQueryOptions} from "Configs/react-query";

import "Styles/reset.sass";
import "Styles/fonts.sass";
import "Styles/global.sass";
import "Styles/components/ColorPicker.sass";
import "reactflow/dist/style.css";


const clientSideEmotionCache = createEmotionCache();
const queryClient = new QueryClient({
	defaultOptions: {
		queries: defaultQueryOptions
	}
});


export type MyAppProps = AppProps & {
	emotionCache?: EmotionCache,
}

const MyApp: React.FC<MyAppProps> = (
	props
) => {
	const {Component, emotionCache = clientSideEmotionCache, pageProps} = props;
	const {lang} = useTranslation();

	// Set lang to cookies
	useEffect(() => {
		cookies.set(cookieNames.LOCALE, lang);
	}, [lang]);

	return <CacheProvider value={emotionCache}>
		<ThemeProvider theme={theme}>
			<Head>
				<meta charSet="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<link rel="icon" type="image/x-icon" href="/favicon.png" />
			</Head>
			<QueryClientProvider client={queryClient}>
				<CssBaseline />
				<Component {...pageProps} />
			</QueryClientProvider>
		</ThemeProvider>
	</CacheProvider>;
};

export default MyApp;
