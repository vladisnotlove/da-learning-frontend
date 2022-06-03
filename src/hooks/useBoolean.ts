import {useState} from "react";

const useBoolean = (defaultValue: boolean) => {
	const [ value, setValue ] = useState(defaultValue);

	return {
		value,
		setTrue: () => setValue(true),
		setFalse: () => setValue(false),
	};
};

export default useBoolean;
