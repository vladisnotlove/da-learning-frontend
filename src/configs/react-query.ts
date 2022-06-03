import {QueryObserverOptions} from "react-query";

export const defaultQueryOptions: QueryObserverOptions<any> = {
	retry: false,
	refetchInterval: false,
	refetchOnWindowFocus: false,
	refetchOnReconnect: false,
	refetchOnMount: false,
	refetchIntervalInBackground: false,
	useErrorBoundary: false
};
