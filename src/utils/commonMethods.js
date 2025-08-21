import { convertToEthiopian } from "react-ethiopian-calendar";

export const formatDate = (date) => {
  if (!date || !(date instanceof Date) || isNaN(date)) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
};

// Converts "yyyy/mm/dd" → JS Date
export function parseDateString(dateStr) {
  if (!dateStr) return null;
  if (typeof dateStr === "object" && dateStr instanceof Date) {
    return dateStr;
  }
  const clean = dateStr.replace(/\//g, "-");
  const parsed = new Date(clean);
  if (isNaN(parsed)) {
    console.log("Parsed date is invalid:", parsed);
    return null;
  }
  return parsed;
}

// Converts "yyyy/mm/dd" GC → dd/mm/yyyy" EC
// export const toEthiopian = (date) => {
// 	if (!date) return "";
// 	const parsedDate = parseDateString(date);
// 	const ethiopian = convertToEthiopian(parsedDate);
// 	return `${ethiopian.day}/${ethiopian.month}/${ethiopian.year}`;
// };

export const toEthiopian = (date) => {
  if (!date) return "";
  if (typeof date !== "string") return "";

  const clean = date.replace(/\//g, "-");
  const ethiopian = convertToEthiopian(clean);
  return `${ethiopian.day}/${ethiopian.month}/${ethiopian.year}`;
};

export const addMonths = (date, months) => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + months);
  return newDate;
};

export const addYears = (date, years) => {
  const newDate = new Date(date);
  newDate.setFullYear(newDate.getFullYear() + years);
  return newDate;
};

/**
 * Transforms an array of objects into options for react-select.
 *
 * @param {Array} data - The array of objects to transform.
 * @param {string} value_key - The key to use as the value in the options.
 * @param {string} label_key - The key to use as the label in the options.
 * @param {Function} [filterFn] - Optional function to filter items before transforming.
 * @returns {Array} - An array of objects with "value" and "label" keys.
 */
export function createSelectOptions(data, value_key, label_key, filterFn) {
  if (!Array.isArray(data)) {
    throw new Error("The first argument must be an array.");
  }

  const filteredData =
    typeof filterFn === "function" ? data.filter(filterFn) : data;

  return filteredData.map((item) => ({
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
 * @param {Function} [filterFn] - Optional function to filter items before transforming.
 * @returns {Object} - An object with keys from labelKeys containing option arrays.
 */
export function createMultiSelectOptions(data, valueKey, labelKeys, filterFn) {
  if (!Array.isArray(data)) {
    throw new Error("The first argument must be an array.");
  }

  const filteredData =
    typeof filterFn === "function" ? data.filter(filterFn) : data;

  return labelKeys.reduce((acc, labelKey) => {
    acc[labelKey] = filteredData.map((item) => ({
      value: item[valueKey],
      label: item[labelKey],
    }));
    return acc;
  }, {});
}

/**
 * Transforms an array of objects into a key-value map.
 *
 * @param {Array} data - The array of objects to transform.
 * @param {string} keyProp - The property to use as the key in the map.
 * @param {string} valueProp - The property to use as the value in the map.
 * @param {Function} [filterFn] - Optional function to filter items before mapping.
 * @returns {Object} - A key-value map.
 */
export function createKeyValueMap(
  data,
  keyProp,
  valueProp,
  filterFn = () => true,
) {
  if (!Array.isArray(data)) {
    throw new Error("The first argument must be an array.");
  }

  return data.reduce((acc, item) => {
    if (filterFn(item)) {
      acc[item[keyProp]] = item[valueProp];
    }
    return acc;
  }, {});
}

/**
 * Creates a key-value map from an array of objects, supporting multilingual value selection.
 *
 * @param {Array} data - The array of objects to transform.
 * @param {string} keyProp - The property to use as the map's key.
 * @param {Object} valuePropsByLang - An object mapping languages to value property keys (e.g. { en: 'name_en', am: 'name_am' }).
 * @param {string} lang - The current language code to select the appropriate label.
 * @param {Function} [filterFn] - Optional function to filter items before mapping.
 * @returns {Object} - A key-value map with localized labels.
 */
export function createMultiLangKeyValueMap(
  data,
  keyProp,
  valuePropsByLang,
  lang,
  filterFn = () => true,
) {
  if (!Array.isArray(data)) {
    throw new Error("The first argument must be an array.");
  }

  const valueKey = valuePropsByLang[lang] || Object.values(valuePropsByLang)[0]; // fallback to first lang key

  return data.reduce((acc, item) => {
    if (filterFn(item)) {
      acc[item[keyProp]] = item[valueKey];
    }
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

// export const convertToNumericValue = (amount) => {
//   if (!amount || typeof amount !== "string") {
//     console.warn("Invalid input: Amount must be a non-empty string");
//     return null;
//   }

//   const numericAmount = Number(amount.replace(/,/g, ""));
//   if (isNaN(numericAmount)) {
//     console.error("Invalid number input:", amount);
//     return null;
//   }

//   return numericAmount;
// };

export const convertToNumericValue = (value) => {
  if (value === null || value === undefined || value === "") return 0;
  // Remove any formatting (commas, currency symbols, etc.)
  const numericString = String(value).replace(/[^0-9.-]/g, "");
  return parseFloat(numericString) || 0;
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
