import React, {useMemo, useRef, useState} from "react";
import ConceptModel from "Api/learning/models/ConceptModel";
import RequirementModel from "Api/learning/models/RequirementModel";
import {CircularProgress, Paper, PaperProps, styled} from "@mui/material";
import {
	Background,
	BackgroundVariant,
	Edge,
	EdgeTypes,
	MarkerType,
	Node,
	Position,
	ReactFlow,
	useViewport
} from "reactflow";
import {NodeTypes} from "@reactflow/core/dist/esm/types";
import ConceptNode, {ConceptNodeProps} from "./ConceptNode";
import DeletableEdge, {DeletableEdgeProps} from "./DeletableEdge";
import ConfirmDialog from "Components/@common/ConfirmDialog";
import {LoadingButton} from "@mui/lab";

// helpers

const updateConceptName = (concepts: ConceptModel[], index: number, name: string) => {
	const newConcepts = [...concepts];
	if (newConcepts[index]) {
		newConcepts[index] = {
			...newConcepts[index],
			name
		};
	}
	return newConcepts;
};

// main

export type ConceptGraphInnerProps = {
	className?: string,
	children?: React.ReactNode,

	loading?: boolean,
	creatingConcept?: boolean,

	concepts: ConceptModel[],
	requirements: RequirementModel[],

	onConceptsChange?: (concepts: ConceptModel[]) => void,
	onConceptCreate?: (concept: Omit<ConceptModel, "id">) => void,
	onRequirementsChange?: (requirements: RequirementModel[]) => void,
	onRequirementCreate?: (requirement: Omit<RequirementModel, "id">) => void,

	disable?: {
		conceptsChange?: boolean,
		conceptCreate?: boolean,
		requirementsChange?: boolean,
		requirementCreate?: boolean,
	}
}

const ConceptGraphInner: React.FC<ConceptGraphInnerProps> = (
	{
		className,

		loading,
		creatingConcept,

		concepts,
		requirements,

		onConceptsChange,
		onConceptCreate,
		onRequirementsChange,
		onRequirementCreate,

		disable = {},
	}
) => {
	const rootRef = useRef<HTMLDivElement | null>(null);
	const viewport = useViewport();

	const [deletionOpened, setDeletionOpened] = useState(false);
	const [activeConcept, setActiveConcept] = useState<ConceptModel | null>(null);

	const [selectedEdge, setSelectedEdge] = useState<string | null>(null);

	const edgeTypes = useMemo<EdgeTypes>(() => ({deletableEdge: DeletableEdge}), []);
	const nodeTypes = useMemo<NodeTypes>(() => ({conceptNode: ConceptNode}), []);

	const nodes = useMemo<Node<ConceptNodeProps["data"]>[]>(() => {
		return concepts.map((concept, index) => ({
			id: "" + concept.id,
			type: "conceptNode",
			data: {
				concept,
				onDelete: () => {
					setDeletionOpened(true);
					setActiveConcept(concept);
				},
				onNameChange: (value) => {
					const newConcepts = updateConceptName(concepts, index, value);
					if (onConceptsChange) onConceptsChange(newConcepts);
				},
				onPosterClick: () => {
					console.log("poster " + concept.id);
				},
				editable: !disable.conceptsChange,
				deletable: !disable.conceptsChange,
			},
			position: {x: concept.x, y: concept.y},
			sourcePosition: Position.Bottom,
			dragHandle: ".custom-drag-handle",
		}));
	}, [concepts]);

	const edges = useMemo<Edge<DeletableEdgeProps["data"]>[]>(() => {
		return requirements.map(requirement => ({
			id: "" + requirement.id,
			type: "deletableEdge",
			source: "" + requirement.required_concept,
			target: "" + requirement.concept,
			data: {
				onDelete: () => {
					if (onRequirementsChange) onRequirementsChange(
						requirements.map(item => {
							if (item.id === requirement.id) return {
								...item,
								status: "deleted",
							};
							return item;
						})
					);
				},
				deletable: !disable.requirementsChange,
			},
			markerEnd: {
				type: MarkerType.Arrow,
			},
			selected: selectedEdge === ("" + requirement.id),
		}));
	}, [requirements, selectedEdge]);

	return <>
		<Root
			ref={rootRef}
			className={className}
		>
			{loading &&
				<Loading/>
			}
			{!loading && !disable.conceptCreate &&
				<AddBtn
					variant={"contained"}
					onClick={() => {
						const root = rootRef.current;
						if (root) {
							const viewportSize = {
								x: root.clientWidth,
								y: root.clientHeight,
							};

							if (onConceptCreate) onConceptCreate({
								name: "Новая концепция",
								x: -viewport.x / viewport.zoom + viewportSize.x / viewport.zoom * 0.5,
								y: -viewport.y / viewport.zoom + viewportSize.y / viewport.zoom * 0.5,
								status: "new",
							});
						}
					}}
					loading={creatingConcept}
					disabled={creatingConcept}
				>
					+ Добавить концепцию
				</AddBtn>
			}
			<ReactFlow
				snapToGrid={true}
				snapGrid={[10,10]}

				nodeTypes={nodeTypes}
				edgeTypes={edgeTypes}

				defaultEdgeOptions={{
					animated: true,
				}}

				nodes={nodes}
				edges={edges}

				nodesDraggable={!disable.conceptsChange}
				nodesConnectable={!disable.requirementCreate}
				edgesFocusable={!disable.requirementsChange}

				onNodesChange={changes => {
					let changed = false;
					const newConcepts = [...concepts];

					changes.forEach(change => {
						if (change.type === "position" && change.position) {
							const index = newConcepts.findIndex(concept => "" + concept.id === change.id);
							if (index !== -1) {
								newConcepts[index] = {
									...newConcepts[index],
									...change.position,
								};
								changed = true;
							}
						}
					});

					if (changed) {
						if (onConceptsChange) onConceptsChange(newConcepts);
					}
				}}
				onEdgesChange={(changes) => {
					let newSelectedEdge = selectedEdge;

					changes.forEach(change => {
						if (change.type === "select") {
							if (change.selected === true) newSelectedEdge = change.id;
							if (change.selected === false && newSelectedEdge === change.id) newSelectedEdge = null;
						}
					});

					setSelectedEdge(newSelectedEdge);
				}}
				onConnect={(connection) => {
					if (connection.target && connection.source) {
						if (onRequirementCreate) onRequirementCreate({
							concept: parseFloat(connection.target),
							required_concept: parseFloat(connection.source),
							status: "new",
						});
					}
				}}
			>
				<Background
					variant={BackgroundVariant.Dots}
					gap={12}
					size={1}
				/>
			</ReactFlow>
		</Root>
		<ConfirmDialog
			content={{
				title: "Удаление концепции",
				description: "Вы уверены, что хотите удалить концепцию?",
				ConfirmBtnProps: {
					children: "Удалить"
				}
			}}
			open={deletionOpened}
			onClose={() => {
				setDeletionOpened(false);
				setActiveConcept(null);
			}}
			onConfirm={() => {
				if (onConceptsChange && activeConcept) onConceptsChange(
					concepts.map(item => {
						if (item.id === activeConcept.id) return {
							...item,
							status: "deleted",
						};
						return item;
					})
				);
				if (onRequirementsChange && activeConcept) onRequirementsChange(
					requirements.map(item => {
						if (item.concept === activeConcept.id || item.required_concept === activeConcept.id) return {
							...item,
							status: "deleted",
						};
						return item;
					})
				);
				setDeletionOpened(false);
				setActiveConcept(null);
			}}
		/>
	</>;
};

const Root = styled("div")`
  position: relative;
  width: 100%;
  height: 100%;
`;

const Loading = styled(
	(props: PaperProps) => {
		return <Paper {...props} variant={"outlined"}>
			<CircularProgress size={32} />
		</Paper>;
	}
)`
  position: absolute;
  bottom: ${p => p.theme.spacing(1.5)};
  left: ${p => p.theme.spacing(1.5)};
  padding: ${p => p.theme.spacing(1.5)};
  line-height: 0;
  z-index: 10;
`;

const AddBtn = styled(LoadingButton)`
  position: absolute;
  top: ${p => p.theme.spacing(1.5)};
  right: ${p => p.theme.spacing(1.5)};
  z-index: 10;
  background: #fff;
  color: ${p => p.theme.palette.text.primary};
  border: 1px solid ${p => p.theme.palette.divider};
  
  &:hover {
    background: #eee;
  }
`;

export default ConceptGraphInner;
