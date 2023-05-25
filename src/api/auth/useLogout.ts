import {useMutation, useQueryClient} from "react-query";
import urls from "Api/urls";
import queryKeys from "Api/queryKeys";
import {post} from "Api/@core/methods";
import {handleApiCatch, TApiErrors} from "Api/@core/errors";
import {useRouter} from "next/router";

type TLogoutResult = undefined;
type TLogoutError = TApiErrors;

const useLogout = () => {
	const {reload} = useRouter();
	const queryClient = useQueryClient();

	return useMutation<TLogoutResult, TLogoutError>(
		queryKeys.authLogout(),
		() => {
			return post<TLogoutResult>(urls.auth_logout())
				.then(response => {
					queryClient.invalidateQueries(queryKeys.profile());
					reload();
					return response.data;
				})
				.catch(handleApiCatch);
		}
	);
};

export default useLogout;


