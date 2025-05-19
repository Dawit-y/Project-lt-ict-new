import PropTypes from 'prop-types'
import { Col, Label, Input, FormFeedback } from 'reactstrap'
import { useTranslation } from 'react-i18next'

/**
 * AsyncSelectField renders a select input based on a key-value map.
 * The map is expected in the format: { [value]: label, ... }
 *
 * @component
 *
 * @param {Object} props
 * @param {string} props.fieldId - Form field name.
 * @param {Object} props.validation - Formik-like validation object.
 * @param {boolean} [props.isRequired=false] - Show asterisk on the label if true.
 * @param {string} [props.className] - Optional class for layout.
 * @param {Object.<string|number, string>} props.optionMap - Map of value-label pairs.
 * @param {boolean} [props.isLoading=false] - Show loading placeholder.
 * @param {boolean} [props.isError=false] - Show error placeholder.
 *
 * @returns {JSX.Element}
 */
const AsyncSelectField = ({
  fieldId,
  validation,
  isRequired = false,
  className,
  optionMap = {},
  isLoading = false,
  isError = false,
}) => {
  const { t } = useTranslation()

  return (
    <Col className={className}>
      <Label htmlFor={fieldId}>
        {t(fieldId)} {isRequired && <span className="text-danger">*</span>}
      </Label>

      <Input
        name={fieldId}
        type="select"
        className="form-select"
        id={fieldId}
        disabled={isLoading || isError}
        onChange={validation.handleChange}
        onBlur={validation.handleBlur}
        value={validation.values[fieldId] || ""}
        invalid={
          validation.touched[fieldId] && validation.errors[fieldId] ? true : false
        }
      >
        {isLoading && <option value="">{t("Loading")}...</option>}
        {isError && <option value="">{t("Failed to load options")}</option>}

        {!isLoading && !isError && (
          <>
            <option value="">{t("Select")} {t(fieldId)}</option>
            {Object.entries(optionMap).map(([value, label]) => (
              <option key={value} value={value}>
                {t(label)}
              </option>
            ))}
          </>
        )}
      </Input>

      {validation.touched[fieldId] && validation.errors[fieldId] && (
        <FormFeedback>{validation.errors[fieldId]}</FormFeedback>
      )}
    </Col>
  )
}

AsyncSelectField.propTypes = {
  fieldId: PropTypes.string.isRequired,
  validation: PropTypes.shape({
    values: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleBlur: PropTypes.func.isRequired,
    touched: PropTypes.object,
    errors: PropTypes.object,
  }).isRequired,
  isRequired: PropTypes.bool,
  className: PropTypes.string,
  optionMap: PropTypes.objectOf(PropTypes.string).isRequired,
  isLoading: PropTypes.bool,
  isError: PropTypes.bool,
}

export default AsyncSelectField
