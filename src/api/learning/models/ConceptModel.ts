type ConceptModel = {
	id: number,
	name: string,
	poster?: string,
	description?: string,
	x: number,
	y: number,
	status: "new" | "actual" | "deleted"
}

export default ConceptModel;
