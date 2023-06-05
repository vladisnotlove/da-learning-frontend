import React from "react";
import {Button, IconButton, Paper, styled} from "@mui/material";
import {Download} from "@mui/icons-material";
import AutosizeInput from "react-input-autosize";


type FilePanelProps = {
	className?: string,
	children?: React.ReactNode,
	fileName: string,
	defaultFileName: string,
	onEditStart: () => void,
	onChange: (fileName: string) => void,
	onEditEnd: (fileName: string) => void,
	onAction: (action: "download") => void,
}

const FilePanel: React.FC<FilePanelProps> = (
	{
		className,
		fileName,
		defaultFileName,
		onEditStart,
		onChange,
		onEditEnd,
		onAction,
	}
) => {
	return <Root
		className={className}
		variant={"outlined"}
	>
		<MainActions>
			<Button
				variant={"text"}
				style={{
					minWidth: 0,
				}}
				onClick={() => {
					onAction("download");
				}}
			>
				Файл
			</Button>
		</MainActions>
		<FileContainer>
			<File>
				<FileName
					value={fileName}
					onFocus={() => {
						onEditStart();
					}}
					onChange={e => {
						const value = e.target.value.trim();
						onChange(value);
					}}
					onBlur={e => {
						const value = e.target.value.trim();
						if (value) {
							onEditEnd(value);
						}
						else {
							onEditEnd(defaultFileName);
						}
					}}
					placeholder={defaultFileName}
					injectStyles={false}
				/>
				<FileExt>
					.png
				</FileExt>
			</File>
		</FileContainer>
		<Actions>
			<IconButton
				onClick={() => {
					onAction("download");
				}}
			>
				<Download />
			</IconButton>
		</Actions>
	</Root>;
};

const Root = styled(Paper)`
  display: grid;
  grid-template-areas: "main-actions file actions";
  grid-template-columns: 1fr 2fr minmax(1fr, auto);
  gap: ${p => p.theme.spacing(1)};
  border-radius: 0;
  padding: ${p => p.theme.spacing(0.75)};
`;

const FileContainer = styled("div")`
  grid-area: file;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const File = styled("div")`
  grid-area: file;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FileName = styled(AutosizeInput)`
  & > * {
    border: none;
    padding: 0;
    margin: 0;
    width: fit-content;
    min-width: 0;
    ${p => p.theme.typography.body1};
  }
  
  & > input {
	&:focus {
      outline: none;
	  text-decoration: underline;
	  text-decoration-color: ${p => p.theme.palette.primary.main};
    }
	
	&::placeholder {
	  color: ${p => p.theme.palette.grey.A400};
	}
  }
`;

const FileExt = styled("div")`
  ${p => p.theme.typography.body1};
  color: ${p => p.theme.palette.text.secondary}
`;

const MainActions = styled("div")`
  grid-area: main-actions;
  display: flex;
  align-items: center;
  gap: ${p => p.theme.spacing(0.5)};
`;

const Actions = styled("div")`
  grid-area: actions;
  display: flex;
  align-items: center;
  justify-content: end;
  gap: ${p => p.theme.spacing(0.25)};
`;

export default FilePanel;
