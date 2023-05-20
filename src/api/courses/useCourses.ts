import {useQuery} from "react-query";
import urls from "Api/urls";
import queryKeys from "Api/queryKeys";
import {get} from "Api/@core/methods";
import {handleApiCatch, TApiErrors} from "Api/@core/errors";
import CourseModel from "Api/courses/models/CourseModel";

type TCourseResult = CourseModel[]
type TCourseError = TApiErrors;

const useCourses = () => {
	return useQuery<TCourseResult, TCourseError>(
		queryKeys.courses(),
		variables => {
			return get<TCourseResult>(urls.courses(), variables)
				.then(response => response.data)
				.catch(handleApiCatch);
		}
	);
};

export default useCourses;


