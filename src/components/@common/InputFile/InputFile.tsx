import React, {ChangeEvent} from "react";
import MIMEType from "src/types/MIMEType";

export type InputFileProps = {
	className?: string,
	inputRef?: React.Ref<HTMLInputElement>,
	name?: string,
	multiple?: boolean,
	onChange?: ((e: ChangeEvent, data: { files: File[] }) => any),
	/**
	 * checks only files' {type} field for exact match
	 */
	accept?: MIMEType[],
	hidden?: boolean,
	filterByAccepted?: boolean,
};

const InputFile : React.FC<InputFileProps> = (
	{
		className,
		inputRef,
		name,
		multiple,
		onChange,
		accept,
		filterByAccepted = true,
		...props
	}) => {
	return <input
		className={className}
		type={"file"}
		ref={inputRef}
		name={name}
		multiple={multiple}
		onChange={(event) => {
			const input = event.currentTarget;
			const files = ([].map.call(input.files, (file) => file) as File[]);
			if (onChange) onChange(event, {
				files: filterByAccepted ?
					files.filter((file) => !accept || accept.includes(file.type)) :
					files,
			});
			input.value = "";
		}}
		accept={accept?.join(",")}
		{...props}
	/>;
};

export default InputFile;
