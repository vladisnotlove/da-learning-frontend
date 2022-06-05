import {useEffect} from "react";
import useUpdatedRef from "Hooks/useUpdatedRef";


const useWindowEvent = <K extends keyof WindowEventMap>(
	type: K,
	listener: (this: Window, event: WindowEventMap[K]) => any,
	options?: {
		disabled?: boolean,
		listenerOptions?: boolean | AddEventListenerOptions
	}
) => {
	const listenerRef = useUpdatedRef(listener);

	useEffect(() => {
		const listenerWrapper: typeof listener = event => {
			return listenerRef.current.call(window, event);
		};

		if (options?.disabled) {
			window.removeEventListener(
				type,
				listenerWrapper,
				options?.listenerOptions
			);
		}
		else {
			window.addEventListener(
				type,
				listenerWrapper,
				options?.listenerOptions
			);
		}

		return () => {
			window.addEventListener(
				type,
				listenerWrapper,
				options?.listenerOptions
			);
		};
	}, [
		type,
		options?.disabled,
		options?.listenerOptions,
	]);
};

export default useWindowEvent;
