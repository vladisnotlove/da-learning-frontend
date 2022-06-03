import {useMutation, useQueryClient} from "react-query";
import urls from "Api/urls";
import queryKeys from "Api/queryKeys";
import {post} from "Api/@core/methods";
import {handleApiCatch, TApiErrors} from "Api/@core/errors";

type TLoginBody = {
	username: string,
	password: string,
}
type TLoginResult = undefined
type TLoginError = TApiErrors<keyof TLoginBody>;

const useLogin = () => {
	const queryClient = useQueryClient();

	return useMutation<TLoginResult, TLoginError, TLoginBody>(
		queryKeys.authLogin(),
		variables => {
			return post<TLoginResult>(urls.auth_login(), variables)
				.then(response => {
					queryClient.invalidateQueries(queryKeys.profile());
					return response.data;
				})
				.catch(handleApiCatch);
		}
	);
};

export default useLogin;


