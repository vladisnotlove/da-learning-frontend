import React, {useState} from "react";
import PageLayout from "Components/@layout/PageLayout";
import ConceptGraph from "Components/ConceptGraph";
import useNavItems from "Hooks/useNavItems";
import useConcepts from "Api/learning/useConcepts";
import useRequirements from "Api/learning/useRequirements";
import ConceptModel from "Api/learning/models/ConceptModel";
import RequirementModel from "Api/learning/models/RequirementModel";
import {Button, styled} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import usePostConcept from "Api/learning/usePostConcept";
import usePutConcepts from "Api/learning/usePutConcepts";
import usePostRequirement from "Api/learning/usePostRequirement";
import usePutRequirements from "Api/learning/usePutRequirements";

// helpers

const prepareConceptsToSave = (concepts: ConceptModel[]) => {
	return concepts.map<ConceptModel>(concept => ({
		...concept,
		...(concept.status === "new" && {
			status: "actual",
		})
	}));
};

const prepareRequirementsToSave = (requirements: RequirementModel[]) => {
	return requirements.map<RequirementModel>(requirement => ({
		...requirement,
		...(requirement.status === "new" && {
			status: "actual",
		})
	}));
};

// main

const EditorPage = () => {
	const navItems = useNavItems();

	const [editing, setEditing] = useState(false);

	const conceptsQr = useConcepts();
	const requirementsQr = useRequirements();

	const postConceptMt = usePostConcept();
	const putConceptsMt = usePutConcepts();

	const postRequirementMt = usePostRequirement();
	const putRequirementsMt = usePutRequirements();

	const loading = conceptsQr.isLoading || requirementsQr.isLoading;
	const saving = putConceptsMt.isLoading || putRequirementsMt.isLoading;

	const [
		concepts,
		setConcepts
	] = useState<ConceptModel[]>([]);

	const [
		requirements,
		setRequirements
	] = useState<RequirementModel[]>([]);

	return <PageLayout
		navItems={navItems}
		fullSizeContent
	>
		<Content>
			<EditPanel>
				{!editing &&
					<LoadingButton
						variant={"contained"}
						onClick={() => {
							setEditing(true);
							setConcepts([...(conceptsQr.data || [])]);
							setRequirements([...(requirementsQr.data || [])]);
						}}
						loading={loading}
						disabled={loading}
					>
						Редактировать
					</LoadingButton>
				}
				{editing &&
					<>
						<LoadingButton
							variant={"contained"}
							onClick={() => {
								putConceptsMt.mutate(prepareConceptsToSave(concepts), {
									onSuccess: () => {
										putRequirementsMt.mutate(prepareRequirementsToSave(requirements), {
											onSuccess: () => {
												setEditing(false);
											}
										});
									}
								});
							}}
							loading={saving}
							disabled={saving}
						>
							Сохранить
						</LoadingButton>
						<Button
							variant={"outlined"}
							onClick={() => {
								setEditing(false);
							}}
							disabled={saving}
						>
							Отменить
						</Button>
					</>
				}
			</EditPanel>
			<ConceptGraph
				loading={loading || saving}
				creatingConcept={postConceptMt.isLoading}

				concepts={editing ? concepts : conceptsQr.data || []}
				requirements={editing ? requirements : requirementsQr.data || []}

				onConceptsChange={setConcepts}
				onConceptCreate={body => {
					postConceptMt.mutate(body, {
						onSuccess: concept => {
							setConcepts([...concepts, concept]);
						}
					});
				}}

				onRequirementsChange={setRequirements}
				onRequirementCreate={body => {
					postRequirementMt.mutate(body, {
						onSuccess: requirement => {
							setRequirements([...requirements, requirement]);
						}
					});
				}}

				disable={{
					conceptsChange: !editing,
					conceptCreate: !editing,
					requirementsChange: !editing,
					requirementCreate: !editing,
				}}
			/>
		</Content>

	</PageLayout>;
};

const Content = styled("div")`
  position: relative;
  width: 100%;
  height: 100%;
`;

const EditPanel = styled("div")`
  display: flex;
  gap: ${p => p.theme.spacing(1)};
  
  position: absolute;
  top: ${p => p.theme.spacing(1.5)};
  left: ${p => p.theme.spacing(1.5)};
  z-index: 10;
`;

export default EditorPage;
