import React from "react";
import InputFile from "Components/@common/InputFile";
import {styled} from "@mui/material";
import {InputFileProps} from "Components/@common/InputFile/InputFile";

type DropZoneProps = Pick<InputFileProps, "onChange" | "accept" | "multiple"> & {
	className?: string,
	children?: React.ReactNode,
}

const DropZone: React.FC<DropZoneProps> = (
	{
		className,
		onChange,
		accept,
		multiple,
	}
) => {
	return <Root
		className={className}
	>
		<Hint>
			<span>Выбрать файл</span>
			<span>или</span>
			<span>перетащить сюда</span>
		</Hint>
		<StyledInputFile
			onChange={onChange}
			accept={accept}
			multiple={multiple}
		/>
	</Root>;
};


const Root = styled("div")`
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed ${p => p.theme.palette.text.moreSecondary};
  border-radius: 8px;
  padding: ${p => p.theme.spacing(1)};
  z-index: 10;
`;

const Hint = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  ${p => p.theme.typography.body2};
  color: ${p => p.theme.palette.text.moreSecondary};
`;

const StyledInputFile = styled(InputFile)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: 20;
`;

export default DropZone;
