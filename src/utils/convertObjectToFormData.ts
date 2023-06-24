import {isArray, isDate, isFile, isNumber, isString} from "Utils/typeCheck";

export const convertObjectToFormData = (object: Record<string, unknown>) => {
	const formData = new FormData();
	Object.keys(object).forEach(key => {
		addToFormData(formData, key, object[key]);
	});
	return formData;
};

export const addToFormData = (formData: FormData, key: string, property: unknown) => {
	if (isArray(property)) {
		property.forEach(item => {
			addToFormData(formData, key, item);
		});
	}
	else if (isDate(property)) {
		formData.append(key, property.toJSON());
	}
	else if (isFile(property)) {
		formData.append(key, property, property.name);
	}
	else if (isString(property) || isNumber(property)) {
		formData.append(key, "" + property);
	}
};

