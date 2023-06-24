import {useMutation, useQueryClient} from "react-query";
import ConceptModel from "Api/learning/models/ConceptModel";
import {handleApiCatch, TApiErrors} from "Api/@core/errors";
import {deleteMethod} from "Api/@core/methods";
import urls from "Api/urls";
import queryKeys from "Api/queryKeys";

type TDeleteConceptResponse = ConceptModel;
type TDeleteConceptBody = Pick<ConceptModel, "id">;
type TDeleteConceptError = TApiErrors;

const useDeleteConcept = () => {
	const queryClient = useQueryClient();

	return useMutation<TDeleteConceptResponse, TDeleteConceptError, TDeleteConceptBody>(variables => {
		const {id} = variables;
		return deleteMethod<TDeleteConceptResponse>(urls.learningConcepts(id))
			.then(value => {
				queryClient.invalidateQueries(queryKeys.learningConcepts());
				return value.data;
			})
			.catch(handleApiCatch);
	});
};

export default useDeleteConcept;
