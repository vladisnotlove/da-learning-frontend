import {useMemo, useRef} from "react";

export type TControlObject = {
	downloadImage: () => void,
}

export type TControl = {
	setControlObject: (controlObject: TControlObject) => void,
}

const useDrawZone = () => {
	const controlObjectRef = useRef<TControlObject | null>(null);

	const control = useMemo<TControl>(() => {
		return {
			setControlObject: (controlObject: TControlObject) => {
				controlObjectRef.current = controlObject;
			}
		};
	}, []);

	const downloadImage = useMemo(() => {
		return () => {
			const controlObj = controlObjectRef.current;
			if (controlObj) {
				controlObj.downloadImage();
			}
		};
	}, []);

	return {
		control,
		downloadImage,
	};
};

export default useDrawZone;
