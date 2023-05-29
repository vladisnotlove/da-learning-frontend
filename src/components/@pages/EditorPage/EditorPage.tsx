import React from "react";

import PageLayout from "Components/@layout/PageLayout";

import useNavItems from "Hooks/useNavItems";
import Editor from "Components/Editor";


const EditorPage = () => {
	const navItems = useNavItems();

	return <PageLayout
		navItems={navItems}
		fullSizeContent
	>
		<Editor />
	</PageLayout>;
};

export default EditorPage;
