import {useMutation, useQueryClient} from "react-query";
import ConceptModel from "Api/learning/models/ConceptModel";
import {handleApiCatch, TApiErrors} from "Api/@core/errors";
import {post} from "Api/@core/methods";
import urls from "Api/urls";
import queryKeys from "Api/queryKeys";

type TPostConceptResponse = ConceptModel;
export type TPostConceptBody = Pick<ConceptModel, "name" | "poster" | "description">;
type TPostConceptError = TApiErrors<keyof TPostConceptBody>;

const usePostConcept = () => {
	const queryClient = useQueryClient();

	return useMutation<TPostConceptResponse, TPostConceptError, TPostConceptBody>(variables => {
		return post<TPostConceptResponse>(urls.learningConcepts(), variables)
			.then(value => {
				queryClient.invalidateQueries(queryKeys.learningConcepts());
				return value.data;
			})
			.catch(handleApiCatch);
	});
};

export default usePostConcept;
