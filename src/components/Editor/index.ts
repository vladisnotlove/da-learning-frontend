import dynamic from "next/dynamic";

export default dynamic(import("./Editor"), {ssr: false});
export * from "./Editor";
