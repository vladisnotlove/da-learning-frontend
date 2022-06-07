import React from "react";

import PageLayout from "Components/@layout/PageLayout";

import useNavItems from "Hooks/useNavItems";
import Editor from "Components/draw/Editor";


const EditorPage = () => {
	const navItems = useNavItems();


	return <PageLayout
		navItems={navItems}
	>
		<Editor />
	</PageLayout>;
};

export default EditorPage;
