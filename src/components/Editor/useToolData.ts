import {useCallback, useRef} from "react";
import {hasOwnProperty} from "Utils/typeCheck";
import {isTool, TTool} from "Constants/tools";



// solution requires only flat object

export type TToolData = {
	mode: "draw" | "erase" | "nothing",
	smoothRadius: number,
	smoothFriction: number,
	smoothCurve: number,
	brushSize: number,
};

const defaultToolData: Record<TTool, TToolData> = {
	brush: {
		mode: "draw",
		smoothRadius: 1,
		smoothCurve: 0.2,
		smoothFriction: 0.1,
		brushSize: 2
	},
	erase: {
		mode: "erase",
		smoothRadius: 1,
		smoothCurve: 0.1,
		smoothFriction: 0.1,
		brushSize: 5
	},
	hand: {
		mode: "nothing",
		smoothRadius: 1,
		smoothCurve: 0.2,
		smoothFriction: 0.1,
		brushSize: 2
	}
};

const keysToStore: Array<keyof TToolData> = ["mode", "smoothRadius", "smoothFriction", "brushSize"];

const saveToLocalStorage = <T>(tool: T, data: TToolData) => {
	keysToStore.forEach(key => {
		if (hasOwnProperty(data, key)) {
			const value = data[key];
			localStorage.setItem(`da-${tool}-${key}`, String(value));
		}
	});
};

const getFromLocalStorage = <T extends string>(tool: T) => {
	if (isTool(tool)) {
		const data = defaultToolData[tool];
		keysToStore.forEach(key => {
			const value = localStorage.getItem(`da-${tool}-${key}`);
			// @ts-ignore
			data[key] = JSON.parse(value);
		});
		return data;
	}
};

const useToolData = <T extends string>() => {
	const mapRef = useRef(new Map<string, TToolData>());

	const getToolData = useCallback((tool: T) => {
		let toolData: TToolData | undefined;

		// try get from ref
		toolData = mapRef.current.get(tool);
		if (toolData) return toolData;

		// try get from local storage
		toolData = getFromLocalStorage(tool) ;
		if (toolData) return toolData;

		// return default
		// @ts-ignore
		return defaultToolData[tool] ?? defaultToolData["brush"];
	}, []);

	const setToolData = useCallback((tool: T, data: TToolData) => {

		// save to local storage
		saveToLocalStorage(tool, data);

		// save to ref
		mapRef.current.set(tool, data);

	}, []);

	const updateToolData = useCallback((tool: T, data: Partial<TToolData>) => {
		const prevData = getToolData(tool);
		const updatedData = {
			...prevData,
			data,
		};
		setToolData(tool, updatedData);
		return updatedData;
	}, [setToolData, getToolData]);


	return {getToolData, setToolData, updateToolData};
};

export default useToolData;
