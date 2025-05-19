import PropTypes from "prop-types";
import { Col, Label, Input, FormFeedback } from "reactstrap";
import { useTranslation } from "react-i18next";

const InputField = ({
  type = "text",
  fieldId,
  validation,
  label,
  placeholder,
  maxLength = 200,
  className,
  isRequired = false,
  rows = 3,
  cols
}) => {
  const { t } = useTranslation();

  const touched = validation.touched[fieldId];
  const error = validation.errors[fieldId];
  const value = validation.values[fieldId] || "";

  return (
    <Col className={className}>
      <Label htmlFor={fieldId}>
        {label ? label : t(fieldId)} {isRequired && <span className="text-danger">*</span>}
      </Label>
      <Input
        id={fieldId}
        name={fieldId}
        type={type === "textarea" ? undefined : type}
        tag={type === "textarea" ? "textarea" : undefined}
        placeholder={placeholder ?? label ?? t(fieldId)}
        onChange={validation.handleChange}
        onBlur={validation.handleBlur}
        value={value}
        invalid={touched && !!error}
        maxLength={maxLength}
        rows={type === "textarea" ? rows : undefined}
        cols={type === "textarea" ? cols : undefined}
      />
      {touched && error && (
        <FormFeedback type="invalid">{error}</FormFeedback>
      )}
    </Col>
  );
};

InputField.propTypes = {
  type: PropTypes.oneOf(["text", "textarea"]),
  fieldId: PropTypes.string.isRequired,
  validation: PropTypes.object.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  maxLength: PropTypes.number,
  className: PropTypes.string,
  isRequired: PropTypes.bool,
  rows: PropTypes.number,
  cols: PropTypes.number,
};

export default InputField;
