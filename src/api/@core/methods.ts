import {AxiosRequestConfig} from "axios";
import axiosInstance from "Api/@core/axiosInstance";
import {convertObjectToFormData} from "Utils/convertObjectToFormData";


export const get = <TResponse = unknown>(
	url: string,
	axiosOptions: AxiosRequestConfig<TResponse> = {}
) => {
	return axiosInstance.get<TResponse>(url, axiosOptions);
};

export const post = <TResponse = unknown, TBody extends Record<string, any> = Record<string, any>>(
	url: string,
	body?: TBody,
	axiosOptions: AxiosRequestConfig<TResponse> = {}
) => {
	return axiosInstance.post<TResponse>(url, body, axiosOptions);
};

export const postFormData = <TResponse = unknown, TBody extends Record<string, any> = Record<string, any>>(
	url: string,
	body?: TBody,
	axiosOptions: AxiosRequestConfig<TResponse> = {}
) => {
	const formData = body ? convertObjectToFormData(body) : undefined;
	return axiosInstance.post<TResponse>(url, formData, {
		...axiosOptions,
		headers: {
			...axiosOptions.headers,
			"Content-Type": "multipart/form-data",
		}
	});
};

export const put = <TResponse = unknown, TBody extends Record<string, any> = Record<string, any>>(
	url: string,
	body?: TBody,
	axiosOptions: AxiosRequestConfig<TResponse> = {}
) => {
	return axiosInstance.put<TResponse>(url, body, axiosOptions);
};

export const putFormData = <TResponse = unknown, TBody extends Record<string, any> = Record<string, any>>(
	url: string,
	body?: TBody,
	axiosOptions: AxiosRequestConfig<TResponse> = {}
) => {
	const formData = body ? convertObjectToFormData(body) : undefined;
	return axiosInstance.put<TResponse>(url, formData, {
		...axiosOptions,
		headers: {
			...axiosOptions.headers,
			"Content-Type": "multipart/form-data",
		}
	});
};

export const deleteMethod = <TResponse = unknown>(
	url: string,
	axiosOptions: AxiosRequestConfig<TResponse> = {}
) => {
	return axiosInstance.delete<TResponse>(url, axiosOptions);
};


