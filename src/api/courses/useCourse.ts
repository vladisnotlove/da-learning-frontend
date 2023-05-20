import {useQuery, UseQueryOptions} from "react-query";
import urls from "Api/urls";
import queryKeys from "Api/queryKeys";
import {get} from "Api/@core/methods";
import {handleApiCatch, TApiErrors} from "Api/@core/errors";
import CourseModel from "Api/courses/models/CourseModel";

type TCourseResult = CourseModel
type TCourseError = TApiErrors;

const useCourse = (
	id: number,
	options?: Omit<UseQueryOptions<TCourseResult, TCourseError, TCourseResult>, "queryFn" | "queryKey">
) => {
	return useQuery<TCourseResult, TCourseError>(
		queryKeys.course(id),
		variables => {
			return get<TCourseResult>(urls.courses(id), variables)
				.then(response => response.data)
				.catch(handleApiCatch);
		},
		options,
	);
};

export default useCourse;


