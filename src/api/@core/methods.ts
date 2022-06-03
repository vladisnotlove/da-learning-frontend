import {AxiosRequestConfig} from "axios";
import axiosInstance from "Api/@core/axiosInstance";


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

