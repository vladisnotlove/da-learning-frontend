import React, {useState, useEffect} from "react";
import {Close} from "@mui/icons-material";
import {CircularProgress, styled} from "@mui/material";
import fileToBase64 from "Utils/fileToBase64";


type MediaPreviewItemProps = {
	className?: string,
	file: File,
	onDelete?: () => void,
	disableDeleteButton?: boolean,
}

const MediaPreviewItem: React.FC<MediaPreviewItemProps> = (
	{
		className,
		file,
		onDelete,
		disableDeleteButton
	}
) => {
	const [base64, setBase64] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		fileToBase64(file).then((computedBase64) => {
			if (computedBase64) {
				setBase64(computedBase64);
				setIsLoading(true);
			}
		});
	}, [file]);

	return <Root className={className}>
		<Image
			src={base64}
			title={file.name}
			alt={file.name}
			onLoad={() => {
				setIsLoading(false);
			}}
		/>
		{isLoading &&
			<Loading/>
		}
		{!isLoading &&
			<Overlay>
				{!disableDeleteButton &&
					<CloseBtn
						type={"button"}
						onClick={onDelete}
					>
						<Close fontSize={"inherit"}/>
					</CloseBtn>
				}
			</Overlay>
		}
	</Root>;
};

const Root = styled("div")`
  position: relative;
  width: 80px;
  height: 80px;
  background: ${p => p.theme.palette.background.lower1};
  border-radius: 8px;
  overflow: hidden;
`;

const Image = styled("img")`
  position: relative;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 10;
`;

const Overlay = styled("div")`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.1);
  z-index: 20;
`;

const Loading = styled(
	(props: React.HTMLAttributes<HTMLDivElement>) => {
		return <div {...props}>
			<CircularProgress size={16}/>
		</div>;
	}
)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  line-height: 0;
  z-index: 30;
`;

const CloseBtn = styled("button")`
  position: absolute;
  top: ${p => p.theme.spacing(0.5)};
  right: ${p => p.theme.spacing(0.5)};

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: ${p => p.theme.spacing(2)};
  line-height: 0;
  width: ${p => p.theme.spacing(2.5)};
  height: ${p => p.theme.spacing(2.5)};

  color: #000;
  background: #fff;
  border: 1px solid ${p => p.theme.palette.divider};
  border-radius: 50%;
  transition: all ${p => p.theme.transitions.duration.shortest}ms;
  cursor: pointer;
  z-index: 40;

  &:hover {
    background: #eee;
  }
`;

export default MediaPreviewItem;
