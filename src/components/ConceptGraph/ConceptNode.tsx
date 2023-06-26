import React, {memo} from "react";
import ConceptModel from "Api/learning/models/ConceptModel";
import {Handle, NodeProps, Position} from "reactflow";
import {Paper, styled} from "@mui/material";
import {TextareaAutosize} from "@mui/base";
import ImageIcon from "@mui/icons-material/Image";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import ActionMenu from "Components/@common/ActionMenu";

export type ConceptNodeProps = NodeProps<{
	concept: ConceptModel,
	onDelete: () => void,
	onNameChange: (value: string) => void,
	onPosterClick: () => void,
	editable: boolean,
	deletable: boolean,
}>

const ConceptNode: React.FC<ConceptNodeProps> = (
	{
		data,
		isConnectable,
	}
) => {
	return <Root variant={"outlined"}>
		<PosterWrapper>
			{data.concept.poster && (
				<img
					src={data.concept.poster}
					alt=""
				/>
			)}
			{data.editable &&
				<EditPoster onClick={data.onPosterClick}>
					<ImageIcon color={"inherit"}/>
				</EditPoster>
			}
		</PosterWrapper>
		<Main>
			<Header>
				<NameTextarea
					value={data.concept.name}
					onChange={(e) => {
						const value = e.target.value.replace("\n", "");
						data.onNameChange(value);
					}}
					disabled={!data.editable}
				/>
				<ActionMenu
					actions={[
						{
							label: "Удалить",
							onClick: data.onDelete
						}
					]}
					attach={"top-bottom-right"}
					disabled={!data.deletable}
				/>
			</Header>
		</Main>
		{data.editable &&
			<CustomDragHandle
				className={"custom-drag-handle"}
			>
				<DragHandleIcon fontSize={"inherit"}/>
			</CustomDragHandle>
		}
		<Handle
			type="target"
			position={Position.Left}
			isConnectable={isConnectable}
		/>
		<Handle
			type="source"
			position={Position.Right}
			isConnectable={isConnectable}
		/>
	</Root>;
};

const Root = styled(Paper)`
  display: grid;
  grid-template-columns: auto auto;
  overflow: hidden;
`;

const CustomDragHandle = styled("div")`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0 20px;
  border-radius: ${p => p.theme.shape.borderRadius}px;

  background: #fff;
  border: 1px solid ${p => p.theme.palette.divider};
  transition: all ${p => p.theme.transitions.duration.shorter}ms;

  &:hover {
    background: #eee;
  }
`;

const PosterWrapper = styled("div")`
  position: relative;
  background: ${p => p.theme.palette.background.lower1};

  width: 80px;
  min-height: 80px;

  display: flex;
  align-items: center;
  justify-content: center;

  & > img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    z-index: 1;
  }
`;

const EditPoster = styled("div")`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
  color: #fff;
  z-index: 1;
  opacity: 0;
  transition: all ${p => p.theme.transitions.duration.standard}ms;

  &:hover {
    opacity: 1;
    cursor: pointer;
  }
`;

const Main = styled("div")`
  padding: ${p => p.theme.spacing(2)};
  cursor: auto;
`;

const Header = styled("div")`
  display: flex;
  gap: ${p => p.theme.spacing(1)};
`;

const NameTextarea = styled(TextareaAutosize)`
  border: none;
  padding: 0;
  margin: 0;
  width: 180px;
  min-width: 0;
  ${p => p.theme.typography.body1};
  resize: none;
  background: transparent;

  &:focus {
    outline: 1px solid ${p => p.theme.palette.primary.main};
  }
`;

export default memo(ConceptNode);
