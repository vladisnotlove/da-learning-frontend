import axios from "axios";

export type TApiErrors<TFieldKeys extends string = "non_field_errors"> = {
	non_field_errors: string,
} & Record<TFieldKeys, string>;

export const handleApiCatch = (error: any) => {
	if (axios.isAxiosError(error)) {
		throw error.response?.data;
	}
	return error;
};
