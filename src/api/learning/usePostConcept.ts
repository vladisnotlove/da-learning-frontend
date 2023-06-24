import {useMutation, useQueryClient} from "react-query";
import ConceptModel from "Api/learning/models/ConceptModel";
import {handleApiCatch, TApiErrors} from "Api/@core/errors";
import {postFormData} from "Api/@core/methods";
import urls from "Api/urls";
import queryKeys from "Api/queryKeys";

type TPostConceptResponse = ConceptModel;
type TPostConceptBody = Pick<ConceptModel, "name" | "poster" | "description">;
type TPostConceptError = TApiErrors<keyof TPostConceptBody>;

const usePostConcept = () => {
	const queryClient = useQueryClient();

	return useMutation<TPostConceptResponse, TPostConceptError, TPostConceptBody>(variables => {
		return postFormData<TPostConceptResponse>(urls.learningConcepts(), variables)
			.then(value => {
				queryClient.invalidateQueries(queryKeys.learningConcepts());
				return value.data;
			})
			.catch(handleApiCatch);
	});
};

export default usePostConcept;
