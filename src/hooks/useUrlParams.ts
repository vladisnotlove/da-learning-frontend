import {useRouter} from "next/router";
import {useCallback, useMemo} from "react";


const useUrlParams = <TParams extends Record<string, string | number | null | boolean>>() => {
	const router = useRouter();

	const urlParams = useMemo(() => {
		if (!router.isReady) return;
		return router.query as Partial<TParams>;
	}, [
		router.isReady,
		router.query,
	]);

	const push = useCallback((params: Partial<TParams>) => {
		if (!router.isReady) return;
		router.push({
			pathname: router.pathname,
			query: params,
		});
	}, [
		router.pathname,
		router.isReady,
		router.push
	]);

	return useMemo(() => {
		return {
			isReady: router.isReady,
			urlParams,
			push
		};
	}, [
		urlParams,
		push,
		router.isReady,
	]);
};

export default useUrlParams;
