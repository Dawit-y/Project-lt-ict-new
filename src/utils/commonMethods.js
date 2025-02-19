export const formatDate = (date) => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}/${month}/${day}`;
};

/**
 * Transforms an array of objects into options for react-select.
 *
 * @param {Array} data - The array of objects to transform.
 * @param {string} value_key - The key to use as the value in the options.
 * @param {string} label_key - The key to use as the label in the options.
 * @returns {Array} - An array of objects with "value" and "label" keys.
 */
export function createSelectOptions(data, value_key, label_key) {
	if (!Array.isArray(data)) {
		throw new Error("The first argument must be an array.");
	}

	return data.map((item) => ({
		value: item[value_key],
		label: item[label_key],
	}));
}

/**
 * Transforms an array of objects into multiple sets of options for react-select.
 *
 * @param {Array} data - The array of objects to transform.
 * @param {string} valueKey - The key to use as the value in the options.
 * @param {Array<string>} labelKeys - An array of keys to generate multiple label options.
 * @returns {Object} - An object with keys from labelKeys containing option arrays.
 */
export function createMultiSelectOptions(data, valueKey, labelKeys) {
	if (!Array.isArray(data)) {
		throw new Error("The first argument must be an array.");
	}

	return labelKeys.reduce((acc, labelKey) => {
		acc[labelKey] = data.map((item) => ({
			value: item[valueKey],
			label: item[labelKey],
		}));
		return acc;
	}, {});
}

export const formatDateHyphen = (date) => {
	if (!date || !(date instanceof Date) || isNaN(date)) {
		return "";
	}

	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
};

export const convertToNumericValue = (amount) => {
	if (!amount || typeof amount !== "string") {
		console.warn("Invalid input: Amount must be a non-empty string");
		return null;
	}

	const numericAmount = Number(amount.replace(/,/g, ""));
	if (isNaN(numericAmount)) {
		console.error("Invalid number input:", amount);
		return null;
	}

	return numericAmount;
};
