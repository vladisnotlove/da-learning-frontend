import React, {useEffect, useMemo, useRef} from "react";
import {Button, IconButton, Paper, styled} from "@mui/material";
import {Add, Close} from "@mui/icons-material";
import DACanvas from "../@common/DACanvas/index";
import createEmptyImageData from "Utils/canvas/createEmptyImageData";

// constants

const cardWidth = 56;

// main

type LayersPanelProps = {
	className?: string,
	width: number,
	height: number,
	layers: Array<{
		id: number,
		imageData: ImageData,
	}>,
	activeLayerId: number,
	onLayersChange: (layers: Array<{
		id: number,
		imageData: ImageData,
	}>) => void
	onLayerSelect: (layer: {
		id: number,
		imageData: ImageData,
	}) => void,
	children?: React.ReactNode,
}

const LayersPanel: React.FC<LayersPanelProps> = (
	{
		className,
		width,
		height,
		layers,
		activeLayerId,
		onLayersChange,
		onLayerSelect,
	}
) => {
	const ctxsRef = useRef<(CanvasRenderingContext2D | null)[]>([]);
	const tempCtxRef = useRef<CanvasRenderingContext2D | null>(null);

	const ratio = width / height;
	const layerWidth = cardWidth;
	const layerHeight = cardWidth / ratio;

	const maxId = useMemo(() => {
		return layers.reduce((maxId, layer) => Math.max(maxId, layer.id), layers[0].id || 0);
	}, [layers]);

	useEffect(() => {
		const tempCtx = tempCtxRef.current;
		if (tempCtx) {
			layers.forEach((layer, index) => {
				// draw in temp canvas
				tempCtx.putImageData(layer.imageData, 0, 0);

				// draw in layer canvas
				const ctx = ctxsRef.current[index];
				if (ctx) {
					ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
					ctx.drawImage(tempCtx.canvas, 0, 0, layerWidth, layerHeight);
				}
			});
		}
	}, [layers, layerWidth, layerHeight]);

	return <Root
		className={className}
		variant={"outlined"}
	>
		{layers.map((layer, index) => (
			<LayerCard
				key={layer.id}
				active={layer.id === activeLayerId}
				onClick={() => {
					onLayerSelect(layer);
				}}
			>
				<Layer
					width={layerWidth}
					height={layerHeight}
					ref={instance => {
						if (instance) {
							ctxsRef.current[index] = instance.getContext("2d");
						}
					}}
				/>
				<RemoveLayerBtn
					onClick={(e) => {
						// need to prevent click on LayerCard
						e.stopPropagation();

						// remove item from layers
						const newLayers = layers.filter(iLayer => iLayer.id !== layer.id);
						if (newLayers.length === 0) return;
						onLayersChange(newLayers);

						// reselect if selected item was removed
						if (newLayers.find(iLayer => iLayer.id === activeLayerId)) return;
						const layerIndex = layers.findIndex(iLayer => iLayer.id === layer.id);
						onLayerSelect(newLayers[layerIndex] || newLayers[layerIndex-1]);
					}}
					size={"small"}
				>
					<Close
						fontSize={"small"}
					/>
				</RemoveLayerBtn>
			</LayerCard>
		))}
		<AddLayerBtn
			onClick={() => {
				const newLayers: typeof layers = [...layers, {
					id: maxId + 1,
					imageData: createEmptyImageData({x: width, y: height}),
				}];
				onLayersChange(newLayers);
			}}
		>
			<Add />
		</AddLayerBtn>
		<TempCanvas
			ref={instance => {
				if (instance) {
					tempCtxRef.current = instance.getContext("2d");
				}
			}}
			width={width}
			height={height}
		/>
	</Root>;
};

const Root = styled(Paper)`
  display: flex;
  flex-direction: column;
  gap: ${p => p.theme.spacing(1.25)};
  padding: ${p => p.theme.spacing(1.25)};
  border-radius: 0;
`;

const TempCanvas = styled(DACanvas)`
	display: none;
`;

const LayerCard = styled("div")<{active?: boolean}>`
  position: relative;
  width: ${cardWidth}px;
  height: ${cardWidth}px;
  border: 1px solid ${p => p.active ? p.theme.palette.primary.main : p.theme.palette.divider};
  border-radius: ${p => p.theme.spacing(1.5)};
  transition: all ${p => p.theme.transitions.duration.standard};
  cursor: pointer;
  overflow: hidden;
  
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: transparent;
    transition: all ${p => p.theme.transitions.duration.standard};
  }
  
  &:hover:before {
    background: ${p => p.theme.palette.action.hover};
  }
`;

const Layer = styled(DACanvas)`
  width: 100%;
  height: auto;
`;

const RemoveLayerBtn = styled(IconButton)`
  position: absolute;
  top: ${p => p.theme.spacing(-0.25)};
  right: ${p => p.theme.spacing(-0.25)};
`;

const AddLayerBtn = styled(Button)`
  position: relative;
  min-width: 0;
  width: ${cardWidth}px;
  height: ${cardWidth}px;
  border: 1px solid ${p => p.theme.palette.divider};
  border-radius: ${p => p.theme.spacing(1.5)};%;
  color: ${p => p.theme.palette.text.primary};
  overflow: hidden;
  
  // background
  &:before {
	content: "";
    position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
    background: ${p => p.theme.palette.background.lower1};
  };
  
  &:hover {
    background: ${p => p.theme.palette.action.hover};
  }
`;

export default LayersPanel;
