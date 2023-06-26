import dynamic from "next/dynamic";

export * from "./ConceptGraph";
export default dynamic(() => import("./ConceptGraph"), {ssr: false});
