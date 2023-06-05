import {useMemo, useRef} from "react";

export type TControlObject = {
	downloadImage: (name: string) => void,
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
		return (name: string) => {
			const controlObj = controlObjectRef.current;
			if (controlObj) {
				controlObj.downloadImage(name);
			}
		};
	}, []);

	return {
		control,
		downloadImage,
	};
};

export default useDrawZone;
