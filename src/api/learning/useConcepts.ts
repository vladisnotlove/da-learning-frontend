import {useQuery} from "react-query";
import urls from "Api/urls";
import queryKeys from "Api/queryKeys";
import {get} from "Api/@core/methods";
import {handleApiCatch, TApiErrors} from "Api/@core/errors";
import ConceptModel from "Api/learning/models/ConceptModel";

type TConceptsResult = ConceptModel[]
type TConceptError = TApiErrors;

const useConcepts = () => {
	return useQuery<TConceptsResult, TConceptError>(
		queryKeys.learningConcepts(),
		variables => {
			return get<TConceptsResult>(urls.learningConcepts(), variables)
				.then(response => response.data)
				.catch(handleApiCatch);
		}
	);
};

export default useConcepts;
