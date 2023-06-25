type RequirementModel = {
	id: number,
	concept: number,
	required_concept: number,
	status: "new" | "actual" | "deleted",
}

export default RequirementModel;
