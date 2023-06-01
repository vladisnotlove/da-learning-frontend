export const isUndefined = <T>(value: T | undefined): value is undefined => value === undefined;

export const isNull = <T>(value: T | null): value is null => value === null;

export const isBoolean = <T>(value: T | boolean): value is boolean => typeof value === "boolean";

export const isNumber = <T>(value: T | number): value is number => typeof value === "number";

export const isString = <T>(value: T | string): value is string => typeof value === "string";

export const isObject = <T>(value: T | Record<string, unknown>): value is Record<string, unknown> => value === Object(value);

export const isArray = <T, TArray>(value: T | TArray[]): value is TArray[]  => Array.isArray(value);

// eslint-disable-next-line @typescript-eslint/ban-types
export const isFunction = <T>(value: T | Function): value is Function => typeof value === "function";

export const isDate = <T>(value: T | Date): value is Date => value instanceof Date;

export const isBlob = <T>(value: T | Blob): value is Blob =>
	isObject(value) &&
	typeof value.size === "number" &&
	typeof value.type === "string" &&
	typeof value.slice === "function";

export const isFile = <T>(value: T | File): value is File =>
	isBlob(value) &&
	typeof value.name === "string" &&
	typeof value.lastModified === "number";

export const hasOwnProperty = <TObj extends Record<string, unknown>, TKey extends string>(obj: TObj, key: TKey): obj is TObj & Record<TKey, unknown> => {
	return Object.prototype.hasOwnProperty.call(obj, key);
};

export const hasProperty = <TObj extends Record<string, unknown>, TKey extends string>(obj: TObj, key: TKey): obj is TObj & Record<TKey, unknown> => {
	return !!obj[key];
};

export const isPromise = <TA, TB>(value: TA | Promise<TB>): value is Promise<TB> => {
	return Boolean(isObject(value) && hasProperty(value, "then") && typeof value.then === "function");
};
