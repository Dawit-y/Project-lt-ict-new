
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

  return data.map(item => ({
    value: item[value_key],
    label: item[label_key]
  }));
}