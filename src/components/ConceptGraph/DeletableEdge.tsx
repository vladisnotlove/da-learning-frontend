import React from "react";
import {BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath} from "reactflow";
import {styled} from "@mui/material";


export type DeletableEdgeProps = EdgeProps<{
	onDelete: () => void,
	deletable?: boolean,
}>

const DeletableEdge: React.FC<DeletableEdgeProps> = (
	{
		data = {},
		sourceX,
		sourceY,
		targetX,
		targetY,
		sourcePosition,
		targetPosition,
		style = {},
		markerEnd,
		selected,
	}
) => {
	const [edgePath, labelX, labelY] = getBezierPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
	});

	return (
		<>
			<BaseEdge path={edgePath} markerEnd={markerEnd} style={style}/>
			<EdgeLabelRenderer>
				{selected && data.deletable &&
					<div
						style={{
							position: "absolute",
							transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
							fontSize: 12,
							// everything inside EdgeLabelRenderer has no pointer events by default
							// if you have an interactive element, set pointer-events: all
							pointerEvents: "all",
						}}
						className="nodrag nopan"
					>
						<DeleteBtn className="edgebutton" onClick={data.onDelete}>
							×
						</DeleteBtn>
					</div>
				}
			</EdgeLabelRenderer>
		</>
	);
};

const DeleteBtn = styled("button")`
  display: flex;
  align-items: center;
  justify-content: center;
  
  line-height: 0;
  font-size: ${p => p.theme.spacing(1.5)};

  width: ${p => p.theme.spacing(2.5)};
  height: ${p => p.theme.spacing(2.5)};
  border-radius: 50%;
  border: 1px solid ${p => p.theme.palette.divider};
  background: ${p => p.theme.palette.background.paper};

  transition: all ${p => p.theme.transitions.duration.shortest}ms;
  cursor: pointer;
  
  &:hover {
    background: #eee;
  }
`;

export default DeletableEdge;
