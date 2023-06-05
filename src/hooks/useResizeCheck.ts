import {useRef} from "react";
import useInterval from "Hooks/useInterval";
import useUpdatedRef from "Hooks/useUpdatedRef";


type HTMLElementSize = {
	width: number,
	height: number,
	scrollHeight: number,
};

const getSize = (elem: HTMLElement): HTMLElementSize => {
	return {
		width: elem.clientWidth,
		height: elem.clientHeight,
		scrollHeight: elem.scrollHeight,
	};
};

const areSizesEqual = (
	a: HTMLElementSize,
	b: HTMLElementSize,
	disableComparing: {
		width?: boolean,
		height?: boolean,
		scrollHeight?: boolean,
	} = {},
	accuracy: number
) => {
	let areEqual = true;

	if (!disableComparing.width) areEqual = areEqual && Math.abs(a.width - b.width) <= accuracy;
	if (!disableComparing.height) areEqual = areEqual && Math.abs(a.height - b.height) <= accuracy;
	if (!disableComparing.scrollHeight) areEqual = areEqual && Math.abs(a.scrollHeight - b.scrollHeight) <= accuracy;

	return areEqual;
};

type ResizeCheckConfig = {
	onResize: (data: {
		elem: HTMLElement,
		size: HTMLElementSize,
		prevSize: HTMLElementSize,
	}) => void,
	ms: number,
	disabled?: boolean,
	disableTracking?: {
		width?: boolean,
		height?: boolean,
		scrollHeight?: boolean,
	},
	/***
	 * max difference between sizes
	 */
	accuracy?: number,
}

const useResizeCheck = <T extends HTMLElement>(
	{
		onResize,
		ms,
		disabled,
		disableTracking = {},
		accuracy = 0,
	}: ResizeCheckConfig
) => {
	const targetRef = useRef<T | null>(null);
	const prevSizeRef = useRef<HTMLElementSize>();

	const onResizeRef = useUpdatedRef(onResize);

	useInterval(() => {
		if (!targetRef.current || !prevSizeRef.current) return;

		const size = getSize(targetRef.current);
		if (!areSizesEqual(prevSizeRef.current, size, disableTracking, accuracy)) {
			onResizeRef.current({
				elem: targetRef.current,
				size: size,
				prevSize: prevSizeRef.current,
			});
			prevSizeRef.current = size;
		}
	}, ms, {
		disabled: disabled,
		onStart: () => {
			if (targetRef.current) {
				prevSizeRef.current = getSize(targetRef.current);
			}
		}
	});

	return {
		targetRef,
	};
};

export default useResizeCheck;
