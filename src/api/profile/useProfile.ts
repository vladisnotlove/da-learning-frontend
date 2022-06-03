import {useQuery} from "react-query";
import urls from "Api/urls";
import queryKeys from "Api/queryKeys";
import {get} from "Api/@core/methods";
import {handleApiCatch, TApiErrors} from "Api/@core/errors";
import TProfileModel from "Api/profile/models/ProfileModel";

type TProfileResult = TProfileModel
type TProfileError = TApiErrors;

const useProfile = () => {
	return useQuery<TProfileResult, TProfileError>(
		queryKeys.profile(),
		variables => {
			return get<TProfileResult>(urls.profile(), variables)
				.then(response => response.data)
				.catch(handleApiCatch);
		}
	);
};

export default useProfile;


