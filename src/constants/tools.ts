const tools = ["hand", "brush", "erase", ] as const;


type TTool = typeof tools[number];
const isTool = (str: any): str is TTool => {
	return tools.findIndex(tool => tool === str) !== -1;
};

export default tools;
export {
	isTool
};
export type {
	TTool
};
