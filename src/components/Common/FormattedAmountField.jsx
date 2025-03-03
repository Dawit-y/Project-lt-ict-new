import React from "react";
import PropTypes from "prop-types";
import { Col, Label, Input, FormFeedback } from "reactstrap";
import { useTranslation } from "react-i18next";

const FormattedAmountField = ({
  validation,
  fieldId,
  isRequired = false
}) => {
  const { t } = useTranslation()
  return (
    <>
      <Label htmlFor={fieldId}>
        {t(fieldId)} {isRequired && <span className="text-danger">*</span>}
      </Label>
      <Input
        id={fieldId}
        name={fieldId}
        type="text"
        placeholder={t(fieldId)}
        onChange={(e) => {
          const rawValue = e.target.value.replace(/,/g, ""); // Remove commas
          if (!isNaN(rawValue) && rawValue !== "") {
            validation.setFieldValue(fieldId, rawValue); // Store numeric value
          } else {
            validation.setFieldValue(fieldId, ""); // Reset if invalid
          }
        }}
        onBlur={(e) => {
          const rawValue = e.target.value.replace(/,/g, "");
          if (!isNaN(rawValue) && rawValue !== "") {
            const formattedValue = Number(rawValue).toLocaleString();
            validation.setFieldValue(fieldId, formattedValue);
          }
          validation.handleBlur(e);
        }}
        value={validation.values[fieldId]}
        invalid={validation.touched[fieldId] && validation.errors[fieldId]}
      />
      {validation.touched[fieldId] && validation.errors[fieldId] && (
        <FormFeedback type="invalid">
          {validation.errors[fieldId]}
        </FormFeedback>
      )}
    </>
  );
};

FormattedAmountField.propTypes = {
  validation: PropTypes.object,
  isRequired: PropTypes.bool,
  fieldId: PropTypes.string
}

export default FormattedAmountField;
