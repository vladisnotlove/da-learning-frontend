import {useMutation, useQueryClient} from "react-query";
import ConceptModel from "Api/learning/models/ConceptModel";
import {handleApiCatch, TApiErrors} from "Api/@core/errors";
import {putFormData} from "Api/@core/methods";
import urls from "Api/urls";
import queryKeys from "Api/queryKeys";

type TPutConceptResponse = ConceptModel;
type TPutConceptBody = Partial<Pick<ConceptModel, "name" | "poster" | "description">> & Pick<ConceptModel, "id">;
type TPutConceptError = TApiErrors<keyof Omit<TPutConceptBody, "id">>;

const usePutConcept = () => {
	const queryClient = useQueryClient();

	return useMutation<TPutConceptResponse, TPutConceptError, TPutConceptBody>(variables => {
		const {id, ...body} = variables;
		return putFormData<TPutConceptResponse>(urls.learningConcepts(id), body)
			.then(value => {
				queryClient.invalidateQueries(queryKeys.learningConcepts());
				return value.data;
			})
			.catch(handleApiCatch);
	});
};

export default usePutConcept;
