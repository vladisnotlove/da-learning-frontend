import {useMutation, useQueryClient} from "react-query";
import RequirementModel from "Api/learning/models/RequirementModel";
import {handleApiCatch, TApiErrors} from "Api/@core/errors";
import {post} from "Api/@core/methods";
import urls from "Api/urls";
import queryKeys from "Api/queryKeys";

type TPostRequirementResponse = RequirementModel;
type TPostRequirementBody = Pick<RequirementModel, "concept" | "required_concept">;
type TPostRequirementError = TApiErrors<keyof TPostRequirementBody>;

const usePostRequirement = () => {
	const queryClient = useQueryClient();

	return useMutation<TPostRequirementResponse, TPostRequirementError, TPostRequirementBody>(variables => {
		return post<TPostRequirementResponse>(urls.learningRequirements(), variables)
			.then(value => {
				queryClient.invalidateQueries(queryKeys.learningRequirements());
				return value.data;
			})
			.catch(handleApiCatch);
	});
};

export default usePostRequirement;
