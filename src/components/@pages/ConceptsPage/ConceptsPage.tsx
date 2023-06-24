import React from "react";
import PageLayout from "Components/@layout/PageLayout";
import useNavItems from "Hooks/useNavItems";


const EditorPage = () => {
	const navItems = useNavItems();

	return <PageLayout
		navItems={navItems}
	>
		concepts
	</PageLayout>;
};

export default EditorPage;
