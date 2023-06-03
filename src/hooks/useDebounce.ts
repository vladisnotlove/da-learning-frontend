import useUpdatedRef from "./useUpdatedRef";
import {useMemo} from "react";
import {debounce} from "throttle-debounce";

const useDebounce = <T extends (...args: any[]) => any>(func: T, ms: number) => {
	const funcRef = useUpdatedRef(func);

	return useMemo(() => {
		return debounce<T>(ms, ((...args) => {
			return funcRef.current(args);
		}) as T);
	}, [ms]);
};

export default useDebounce;
