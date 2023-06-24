import {useQuery} from "react-query";
import urls from "Api/urls";
import queryKeys from "Api/queryKeys";
import {get} from "Api/@core/methods";
import {handleApiCatch, TApiErrors} from "Api/@core/errors";
import RequirementModel from "Api/learning/models/RequirementModel";

export type TRequirementsResult = RequirementModel[]
export type TRequirementError = TApiErrors;

const useRequirements = () => {
	return useQuery<TRequirementsResult, TRequirementError>(
		queryKeys.learningRequirements(),
		variables => {
			return get<TRequirementsResult>(urls.learningRequirements(), variables)
				.then(response => response.data)
				.catch(handleApiCatch);
		}
	);
};

export default useRequirements;
