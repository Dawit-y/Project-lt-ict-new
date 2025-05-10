export const formatDate = (date) => {
  if (!date || !(date instanceof Date) || isNaN(date)) return "";
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

export const calculatePercentage = (value, total) => {
  if (!total || total === 0) return 0;
  return ((value - total) / total) * 100;
};

/**
 * Formats a number with commas and optional decimal places
 * @param {number} num - The number to format
 * @param {number} [decimals=2] - Number of decimal places to show
 * @returns {string} Formatted number string
 */
export const formatNumber = (num, decimals = 2) => {
  if (num === null || num === undefined) return "0.00";

  // Convert to number if it's a string
  const number = typeof num === "string" ? parseFloat(num) : num;

  // Handle NaN cases
  if (isNaN(number)) return "0.00";

  // Format the number
  return number.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

export function formatLargeNumber(num) {
  if (typeof num !== "number" && typeof num !== "string") return "0";

  // Convert string to number if needed
  const number = typeof num === "string" ? parseFloat(num) : num;

  if (isNaN(number)) return "0";

  // Format based on size
  if (number >= 1e12) return (number / 1e12).toFixed(1) + "T";
  if (number >= 1e9) return (number / 1e9).toFixed(1) + "B";
  if (number >= 1e6) return (number / 1e6).toFixed(1) + "M";
  if (number >= 1e3) return (number / 1e3).toFixed(1) + "K";

  return number.toString();
}
