import {useMutation, useQueryClient} from "react-query";
import RequirementModel from "Api/learning/models/RequirementModel";
import {handleApiCatch, TApiErrors} from "Api/@core/errors";
import {put} from "Api/@core/methods";
import urls from "Api/urls";
import queryKeys from "Api/queryKeys";
import {PartialExcept} from "src/types/CustomUtilityTypes";

type TPutRequirementResponse = undefined;
type TPutRequirementBody = PartialExcept<RequirementModel, "id">;
type TPutRequirementError = TApiErrors<keyof TPutRequirementBody>;

const usePutRequirement = () => {
	const queryClient = useQueryClient();

	return useMutation<TPutRequirementResponse, TPutRequirementError, TPutRequirementBody>(variables => {
		const {id, ...body} = variables;
		return put<TPutRequirementResponse>(urls.learningRequirements(id), body)
			.then(value => {
				queryClient.invalidateQueries(queryKeys.learningRequirements());
				return value.data;
			})
			.catch(handleApiCatch);
	});
};

export default usePutRequirement;
