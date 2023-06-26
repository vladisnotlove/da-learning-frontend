import React from "react";
import {ReactFlowProvider} from "reactflow";
import ConceptGraphInner, {ConceptGraphInnerProps} from "Components/ConceptGraph/ConceptGraphInner";

export type ConceptGraphProps = ConceptGraphInnerProps

const ConceptGraph: React.FC<ConceptGraphProps> = (props) => {
	return <ReactFlowProvider>
		<ConceptGraphInner {...props} />
	</ReactFlowProvider>;
};

export default ConceptGraph;
