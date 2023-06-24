import {useMutation, useQueryClient} from "react-query";
import RequirementModel from "Api/learning/models/RequirementModel";
import {handleApiCatch, TApiErrors} from "Api/@core/errors";
import {deleteMethod} from "Api/@core/methods";
import urls from "Api/urls";
import queryKeys from "Api/queryKeys";

type TDeleteRequirementResponse = RequirementModel;
type TDeleteRequirementBody = Pick<RequirementModel, "id">;
type TDeleteRequirementError = TApiErrors;

const useDeleteRequirement = () => {
	const queryClient = useQueryClient();

	return useMutation<TDeleteRequirementResponse, TDeleteRequirementError, TDeleteRequirementBody>(variables => {
		const {id} = variables;
		return deleteMethod<TDeleteRequirementResponse>(urls.learningRequirements(id))
			.then(value => {
				queryClient.invalidateQueries(queryKeys.learningRequirements());
				return value.data;
			})
			.catch(handleApiCatch);
	});
};

export default useDeleteRequirement;
