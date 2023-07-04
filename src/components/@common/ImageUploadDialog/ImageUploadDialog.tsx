import React, {useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, styled, Typography} from "@mui/material";
import ApiErrors from "Components/@common/ApiErrors";
import ImagePreview from "Components/@common/ImagePreview/ImagePreview";
import DropZone from "Components/@common/DropZone/DropZone";
import useUploadImage from "Api/media/useUploadImage";
import useTranslation from "next-translate/useTranslation";


type ImageUploadDialogProps = {
	className?: string,
	children?: React.ReactNode,
	open: boolean,
	onUploadSuccess: (imageUrl: string) => void,
	onClose: () => void,
}

const ImageUploadDialog: React.FC<ImageUploadDialogProps> = (
	{
		className,
		open,
		onUploadSuccess,
		onClose,
	}
) => {
	const {t} = useTranslation();
	const {
		mutate: upload,
		isLoading: loading,
		error: errors
	} = useUploadImage();

	const [file, setFile] = useState<File | null>(null);

	return <Dialog
		className={className}
		open={open}
		maxWidth={"xs"}
		fullWidth
		onClose={() => {
			if (!loading) onClose();
		}}
	>
		<DialogTitle>
			{t("common:uploadImage")}
		</DialogTitle>
		<DialogContent>
			{errors && Object.values(errors).length > 0 &&
				<Typography paragraph>
					{<ApiErrors
						errors={errors}
					/>}
				</Typography>
			}
			<Typography paragraph>
				{file &&
					<StyledImagePreview
						file={file}
						onDelete={() => {
							setFile(null);
						}}
					/>
				}
				{!file &&
					<StyledDropZone
						onChange={(_e, data) => {
							if (data.files[0]) {
								setFile(data.files[0]);
							}
						}}
						accept={["image/jpeg", "image/png"]}
					/>
				}
			</Typography>
		</DialogContent>
		<DialogActions>
			<Button
				onClick={onClose}
				variant={"text"}
				color={"inherit"}
				disabled={loading}
			>
				{t("common:cancel")}
			</Button>
			<Button
				onClick={() => {
					if (file) {
						upload({
							image: file
						}, {
							onSuccess: (data) => {
								onUploadSuccess(data.image);
							}
						});
					}
				}}
				variant={"contained"}
				disabled={loading || !file}
			>
				{t("common:save")}
			</Button>
		</DialogActions>
	</Dialog>;
};

const StyledImagePreview = styled(ImagePreview)`
  width: 160px;
  height: 160px;
`;

const StyledDropZone = styled(DropZone)`
  width: 100%;
  height: 160px;
`;

export default ImageUploadDialog;
