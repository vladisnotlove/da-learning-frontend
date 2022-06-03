import React from "react";
import PageLayout from "Components/@layout/PageLayout";
import useNavItems from "Hooks/useNavItems";

const IndexPage = () => {
	const navItems = useNavItems();

	return <PageLayout
		navItems={navItems}
	>
		index page
	</PageLayout>;
};

export default IndexPage;
