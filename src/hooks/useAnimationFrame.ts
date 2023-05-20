import useUpdatedRef from "./useUpdatedRef";
import {useEffect, useRef} from "react";

type TUseAnimationFrameCallback = (deltaMs: number) => void;

const useAnimationFrame = (callback: TUseAnimationFrameCallback) => {
	const prevMsRef = useRef<number | null>(null);
	const callbackRef = useUpdatedRef(callback);

	const frameFuncRef = useRef(() => {
		const ms = performance.now();
		const prevMs = prevMsRef.current ?? performance.now();
		const deltaMs = ms - prevMs;

		callbackRef.current(deltaMs);
		requestAnimationFrame(frameFuncRef.current);
	});

	useEffect(() => {
		frameFuncRef.current();
	}, []);
};

export default useAnimationFrame;
