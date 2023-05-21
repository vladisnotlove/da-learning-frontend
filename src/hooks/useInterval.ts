import useUpdatedRef from "Hooks/useUpdatedRef";
import { useEffect, useRef } from "react";

const useInterval = (
	callback: () => void,
	ms: number,
	options: {
		disabled?: boolean,
		onStart?: () => void,
	} = {}
) => {
	const {
		disabled,
		onStart
	} = options;

	const idRef = useRef<number | null>(null);
	const callbackRef = useUpdatedRef(callback);
	const onStartRef = useUpdatedRef(onStart);

	useEffect(() => {
		return () => {
			if (idRef.current) window.clearInterval(idRef.current);
		};
	}, []);

	useEffect(() => {
		if (idRef.current) {
			window.clearInterval(idRef.current);
			idRef.current = null;
		}
		if (!disabled) {
			if (onStartRef.current) onStartRef.current();
			idRef.current = window.setInterval(() => {
				callbackRef.current();
			}, ms);
		}
	}, [
		ms,
		disabled
	]);
};

export default useInterval;