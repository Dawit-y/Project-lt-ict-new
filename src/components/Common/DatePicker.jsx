import { useEffect, useState } from "react";
import { EtCalendar } from "react-ethiopian-calendar";
import "react-ethiopian-calendar/dist/index.css";
import { Label } from "reactstrap";
import { useTranslation } from "react-i18next";
import { parseDateString } from "../../utils/commonMethods";

// Converts JS Date or dayjs → "yyyy/mm/dd"
export function formatDate(date) {
	if (!date) {
		console.log("formatDate received null/undefined date");
		return "";
	}

	let year, month, day;

	if (date.$isDayjsObject) {
		// Handle dayjs object
		year = date.$y;
		month = String(date.$M + 1).padStart(2, "0");
		day = String(date.$D).padStart(2, "0");
	} else if (date instanceof Date && !isNaN(date)) {
		// Handle JS Date object
		year = date.getFullYear();
		month = String(date.getMonth() + 1).padStart(2, "0");
		day = String(date.getDate()).padStart(2, "0");
	} else {
		console.log("formatDate received invalid date:", date);
		return "";
	}

	const formatted = `${year}-${month}-${day}`;
	return formatted;
}

// TEMPORARY: Handle Excel serial date conversion (to be removed after DB cleanup)
const parseExcelSerialDate = (serialDate) => {
	if (typeof serialDate !== "number") return null;

	try {
		// Excel dates are number of days since January 1, 1900
		const excelEpoch = new Date(1900, 0, 1);
		// Subtract 2 because Excel incorrectly considers 1900 as a leap year
		const jsDate = new Date(
			excelEpoch.getTime() + (serialDate - 2) * 24 * 60 * 60 * 1000
		);
		return jsDate;
	} catch (error) {
		console.warn("Failed to parse Excel serial date:", serialDate, error);
		return null;
	}
};

// Enhanced date parser that handles both string dates and Excel serial numbers
const enhancedParseDate = (rawValue) => {
	if (rawValue === null || rawValue === undefined || rawValue === "") {
		return null;
	}

	// TEMPORARY: Handle Excel serial dates (to be removed after DB cleanup)
	if (typeof rawValue === "number") {
		return parseExcelSerialDate(rawValue);
	}

	// Original string date parsing
	return parseDateString(rawValue);
};

function DatePicker({
	isRequired,
	validation,
	componentId,
	minDate,
	maxDate,
	label,
	disabled,
}) {
	const { t } = useTranslation();
	const rawValue = validation?.values?.[componentId] || "";
	const [selectedDate, setSelectedDate] = useState(enhancedParseDate(rawValue));

	useEffect(() => {
		const parsed = enhancedParseDate(rawValue);
		setSelectedDate(parsed);
	}, [rawValue]);

	const hasError =
		validation?.touched?.[componentId] && validation?.errors?.[componentId];

	const handleDateChange = (date) => {
		if (!date) return;
		const formatted = formatDate(date);
		validation?.setFieldValue(componentId, formatted, true);
		setSelectedDate(date);
	};

	// Enhanced min/max date parsing
	const parsedMinDate = enhancedParseDate(minDate);
	const parsedMaxDate = enhancedParseDate(maxDate);

	return (
		<>
			<Label>
				{label ? t(label) : t(componentId)}{" "}
				{isRequired && <span className="text-danger">*</span>}
			</Label>
			<div className={hasError ? "is-invalid" : ""}>
				<EtCalendar
					key={selectedDate ? selectedDate.toISOString() : "null"}
					onChange={handleDateChange}
					onBlur={validation.handleBlur}
					value={selectedDate}
					calendarType={true}
					fullWidth={true}
					minDate={parsedMinDate}
					maxDate={parsedMaxDate}
					disabled={disabled}
					inputStyle={
						hasError
							? {
									borderWidth: "1px",
									borderStyle: "solid",
									borderColor: "#f46a6a",
								}
							: {}
					}
				/>
			</div>
			{hasError && (
				<div className="text-danger small mt-1">
					{validation.errors[componentId]}
				</div>
			)}
		</>
	);
}

export default DatePicker;
