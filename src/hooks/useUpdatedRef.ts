import {useRef} from "react";

const useUpdatedRef = <T>(value: T) => {
	const ref = useRef(value);
	ref.current = value;
	return ref;
};

export default useUpdatedRef;
