import React from "react";

import {Box} from "@mui/material";
import PageLayout from "Components/@layout/PageLayout";
import Workspace from "Components/draw/Workspace";

import useNavItems from "Hooks/useNavItems";


const EditorPage = () => {
	const navItems = useNavItems();

	return <PageLayout
		navItems={navItems}
	>
		<Workspace
			sx={{
				width: "300px",
				height: "300px",
				background: "grey"
			}}
		>
			<Box
				sx={{
					width: "100px",
					height: "100px",
					background: "red",
				}}
			/>
		</Workspace>
	</PageLayout>;
};

export default EditorPage;
