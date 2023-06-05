import {useCallback, useEffect, useRef, useState} from "react";
import DataHistory from "Utils/DataHistory";


const useHistoryState = <T>(initialValue: T) => {
	const [state, setState] = useState(initialValue);
	const historyRef = useRef(new DataHistory(20, [initialValue]));

	const redo = useCallback(() => {
		historyRef.current.redo();
		const currentData = historyRef.current.currentData;
		if (currentData) {
			setState(currentData);
		}
	}, []);

	const undo = useCallback(() => {
		if (historyRef.current.undoLength > 0) {
			historyRef.current.undo();
			const currentData = historyRef.current.currentData;
			if (currentData) {
				setState(currentData);
			}
		}
	}, []);

	useEffect(() => {
		if (historyRef.current.currentData !== state) {
			historyRef.current.add(state);
		}
	}, [state]);

	return [state, setState, {redo, undo}] as const;
};

export {useHistoryState};
