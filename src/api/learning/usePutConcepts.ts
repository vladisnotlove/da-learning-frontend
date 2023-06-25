import {useMutation, useQueryClient} from "react-query";
import ConceptModel from "Api/learning/models/ConceptModel";
import {handleApiCatch, TApiErrors} from "Api/@core/errors";
import {put} from "Api/@core/methods";
import urls from "Api/urls";
import queryKeys from "Api/queryKeys";
import {PartialExcept} from "src/types/CustomUtilityTypes";

type TPutConceptsResponse = ConceptModel;
export type TPutConceptsBody = PartialExcept<ConceptModel, "id">[]
type TPutConceptsError = TApiErrors<keyof Omit<ConceptModel, "id">>;

const usePutConcepts = () => {
	const queryClient = useQueryClient();

	return useMutation<TPutConceptsResponse, TPutConceptsError, TPutConceptsBody>(variables => {
		return put<TPutConceptsResponse>(urls.learningConcepts(), variables)
			.then(value => {
				queryClient.invalidateQueries(queryKeys.learningConcepts());
				return value.data;
			})
			.catch(handleApiCatch);
	});
};

export default usePutConcepts;
