import React from "react";
import {Button} from "@mui/material";

const Index = () => {
	return <div>
		<Button
			variant={"contained"}
			onClick={() => {
				window.alert("hello world");
			}}
		>
			Click me!
		</Button>
	</div>;
};

export default Index;
