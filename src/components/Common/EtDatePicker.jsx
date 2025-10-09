import { useEffect, useState } from "react";
import { EtCalendar } from "react-ethiopian-calendar";
import "react-ethiopian-calendar/dist/index.css";
import { Label } from "reactstrap";
import { useTranslation } from "react-i18next";

// Converts JS Date or dayjs → "yyyy/mm/dd"
function formatDate(date) {
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

  const formatted = `${year}/${month}/${day}`;
  return formatted;
}

// Converts "yyyy/mm/dd" → JS Date
function parseDateString(dateStr) {
  if (!dateStr) return null;
  const clean = dateStr.replace(/\//g, "-");
  const parsed = new Date(clean);
  if (isNaN(parsed)) {
    console.log("Parsed date is invalid:", parsed);
    return null;
  }
  return parsed;
}

function EtDatePicker({
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
  const [selectedDate, setSelectedDate] = useState(parseDateString(rawValue));

  useEffect(() => {
    const parsed = parseDateString(rawValue);
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

  return (
    <>
      <Label>
        {label ? label : t(componentId)}{" "}
        {isRequired && <span className="text-danger">*</span>}
      </Label>
      <div className={hasError ? "is-invalid" : ""}>
        <EtCalendar
          key={selectedDate ? selectedDate.toISOString() : "null"}
          onChange={handleDateChange}
          onBlur={validation.handleBlur}
          value={selectedDate}
          calendarType={true}
          lang="am"
          minDate={minDate}
          maxDate={maxDate}
          disabled={disabled}
          inputStyle={hasError ? { border: "1px solid #f46a6a" } : {}}
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

export default EtDatePicker;
