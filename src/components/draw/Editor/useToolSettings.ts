import {ToolPanelProps} from "../ToolPanel/index";
import useLocalStorage from "Hooks/useLocalStorage";
import {Dispatch, SetStateAction} from "react";


type TReturn = [number,  Dispatch<SetStateAction<number>>];

const useToolBrushSize = (tool: ToolPanelProps["selectedTool"]): TReturn => {
	const [penBrushSize, setPenBrushSize] = useLocalStorage("penBrushSize", 2);
	const [brushBrushSize, setBrushBrushSize] = useLocalStorage("brushBrushSize", 8);
	const [brushSize, setBrushSize] = useLocalStorage("brushSize", 1);

	if (tool === "pen") {
		return [penBrushSize, setPenBrushSize];
	}
	if (tool === "brush") {
		return [brushBrushSize, setBrushBrushSize];
	}
	return [brushSize, setBrushSize];
};

export default useToolBrushSize;
