export type TRouteParams = {
	courses: {
		id?: number
	}
}

const routes = {
	index: () => "/",
	editor: () => "/editor",
	courses: ({id}: TRouteParams["courses"] = {}) => id === undefined ? "/courses" : "/courses/" + id,
};

export default routes;
