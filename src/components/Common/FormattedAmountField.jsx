import PropTypes from "prop-types";
import { Label, Input, FormFeedback, Col } from "reactstrap";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

const FormattedAmountField = ({
  validation,
  fieldId,
  label,
  isRequired = false,
  allowDecimal = false,
  className
}) => {
  const { t } = useTranslation();
  const rawValue = validation.values[fieldId];

  const [displayValue, setDisplayValue] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Sync displayValue with rawValue only when not editing
  useEffect(() => {
    if (!isEditing) {
      if (rawValue !== undefined && rawValue !== null && rawValue !== "") {
        const number = parseFloat(rawValue);
        if (!isNaN(number)) {
          setDisplayValue(
            allowDecimal
              ? number.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })
              : number.toLocaleString()
          );
        } else {
          setDisplayValue("");
        }
      } else {
        setDisplayValue("");
      }
    }
  }, [rawValue, allowDecimal, isEditing]);

  const handleChange = (e) => {
    setIsEditing(true); // User started editing

    let input = e.target.value.replace(/,/g, "");
    const regex = allowDecimal ? /^\d*\.?\d*$/ : /^\d*$/;

    if (regex.test(input)) {
      const numeric = parseFloat(input);
      let newDisplayValue = input;

      if (input !== "") {
        if (!isNaN(numeric)) {
          newDisplayValue = allowDecimal && input.includes(".")
            ? numeric.toLocaleString(undefined, {
              minimumFractionDigits: input.endsWith(".") ? 0 : 1,
              maximumFractionDigits: 2,
            }) + (input.endsWith(".") ? "." : "")
            : numeric.toLocaleString();
        }
      }

      validation.setFieldValue(fieldId, input);
      setDisplayValue(newDisplayValue);
    }
  };

  const handleBlur = (e) => {
    setIsEditing(false);

    // On blur, format the displayValue properly
    const numeric = parseFloat(rawValue);
    if (!isNaN(numeric)) {
      setDisplayValue(
        allowDecimal
          ? numeric.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })
          : numeric.toLocaleString()
      );
    } else {
      setDisplayValue("");
    }

    validation.handleBlur(e);
  };

  return (
    <Col className={className}>
      <Label htmlFor={fieldId}>
        {label ? label : t(fieldId)} {isRequired && <span className="text-danger">*</span>}
      </Label>
      <Input
        id={fieldId}
        name={fieldId}
        type="text"
        placeholder={t(fieldId)}
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        invalid={validation.touched[fieldId] && !!validation.errors[fieldId]}
      />
      {validation.touched[fieldId] && validation.errors[fieldId] && (
        <FormFeedback type="invalid">{validation.errors[fieldId]}</FormFeedback>
      )}
    </Col>
  );
};

FormattedAmountField.propTypes = {
  validation: PropTypes.object.isRequired,
  isRequired: PropTypes.bool,
  fieldId: PropTypes.string.isRequired,
  allowDecimal: PropTypes.bool,
  className: PropTypes.string,
};

export default FormattedAmountField;
