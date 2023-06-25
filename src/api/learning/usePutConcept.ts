import {useMutation, useQueryClient} from "react-query";
import ConceptModel from "Api/learning/models/ConceptModel";
import {handleApiCatch, TApiErrors} from "Api/@core/errors";
import {put} from "Api/@core/methods";
import urls from "Api/urls";
import queryKeys from "Api/queryKeys";
import {PartialExcept} from "src/types/CustomUtilityTypes";

type TPutConceptResponse = ConceptModel;
export type TPutConceptBody = PartialExcept<ConceptModel, "id">
type TPutConceptError = TApiErrors<keyof Omit<TPutConceptBody, "id">>;

const usePutConcept = () => {
	const queryClient = useQueryClient();

	return useMutation<TPutConceptResponse, TPutConceptError, TPutConceptBody>(variables => {
		const {id, ...body} = variables;
		return put<TPutConceptResponse>(urls.learningConcepts(id), body)
			.then(value => {
				queryClient.invalidateQueries(queryKeys.learningConcepts());
				return value.data;
			})
			.catch(handleApiCatch);
	});
};

export default usePutConcept;
