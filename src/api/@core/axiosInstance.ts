import cookies from "Utils/cookies";
import cookieNames from "Constants/cookieNames";
import axios from "axios";
import settings from "settings";


// HELPERS

function getLanguageHeaders() {
	const language = cookies.get(cookieNames.LOCALE) || null;
	return {
		"Accept-Language": language
	};
}

function getCsrfHeaders() {
	const csrfToken = cookies.get(cookieNames.CSRF_TOKEN) || null;
	return {
		"X-CSRFToken": csrfToken,
	};
}

// MAIN

const axiosInstance = axios.create({
	baseURL: settings.PUBLIC_BACKEND_API_URL,
	withCredentials: true,
});

axiosInstance.interceptors.request.use(
	config => {
		config.headers = {
			...config.headers,
			...getLanguageHeaders(),
			...getCsrfHeaders(),
		};
		return config;
	}
);

export default axiosInstance;
