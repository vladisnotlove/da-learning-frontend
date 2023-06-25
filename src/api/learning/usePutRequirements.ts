import {useMutation, useQueryClient} from "react-query";
import RequirementModel from "Api/learning/models/RequirementModel";
import {handleApiCatch, TApiErrors} from "Api/@core/errors";
import {put} from "Api/@core/methods";
import urls from "Api/urls";
import queryKeys from "Api/queryKeys";
import {PartialExcept} from "src/types/CustomUtilityTypes";

type TPutRequirementsResponse = undefined;
type TPutRequirementsBody = PartialExcept<RequirementModel, "id">[];
type TPutRequirementsError = TApiErrors<keyof RequirementModel>;

const usePutRequirements = () => {
	const queryClient = useQueryClient();

	return useMutation<TPutRequirementsResponse, TPutRequirementsError, TPutRequirementsBody>(variables => {
		return put<TPutRequirementsResponse>(urls.learningRequirements(), variables)
			.then(value => {
				queryClient.invalidateQueries(queryKeys.learningRequirements());
				return value.data;
			})
			.catch(handleApiCatch);
	});
};

export default usePutRequirements;
