import {ForwardedRef} from "react";

type SetRef = <T>(node: T | null, ref: ForwardedRef<T>) => void;

const setRef: SetRef = (node, ref) => {

	if (ref === null) return;

	if (typeof ref === "function")
		ref(node);

	else if (Object.prototype.hasOwnProperty.call(ref, "current"))
		ref.current = node;
};


type SetRefs = <T>(node: T | null, refs: (ForwardedRef<T> | undefined)[]) => void;

const setRefs: SetRefs = (node, refs) => {
	refs.forEach((ref) => {
		if (ref) setRef(node, ref);
	});
};


/**
 * Example of using: <div ref={refs(ref1, ref2...)} />
 */
const refs = <T>(...refs: (ForwardedRef<T> | undefined)[]): ((node: T) => void) => {
	return (node: T) => {
		setRefs(node, refs);
	};
};

export default refs;
