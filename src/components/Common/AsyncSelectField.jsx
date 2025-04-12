import React from 'react'
import PropTypes from 'prop-types'
import { Col, Label, Input, FormFeedback } from 'reactstrap'
import { useTranslation } from 'react-i18next'

/**
 * AsyncSelectField is a reusable language-aware dropdown component.
 * It integrates with Formik (or similar) validation,
 * supports dynamic loading/error states, and language-based or static options.
 *
 * @component
 *
 * @param {Object} props
 * @param {string} props.name - Name of the field, used for `name`, `id`, and validation lookup.
 * @param {Object} props.validation - Formik-like validation object containing values, handlers, touched, and errors.
 * @param {boolean} [props.isRequired=false] - Whether the field is required (adds a red asterisk to the label).
 * @param {string} [props.className] - Optional CSS class (e.g., Bootstrap grid classes).
 * @param {Object.<string, Array<{value: string|number, label: string}>>} [props.optionsByLang={}] - Language-based option map keyed by language code (`en`, `am`, etc.).
 * @param {Array<{value: string|number, label: string}>} [props.staticOptions=[]] - Fallback options used when language-specific options are not provided.
 * @param {boolean} [props.isLoading=false] - Whether options are being fetched. Disables input and shows loading placeholder.
 * @param {boolean} [props.isError=false] - Whether there was an error fetching options. Disables input and shows error placeholder.
 *
 * @returns {JSX.Element} The rendered select input field.
 */
const AsyncSelectField = ({
  name,
  validation,
  isRequired = false,
  className,
  optionsByLang = {},
  staticOptions = [],
  isLoading = false,
  isError = false,
}) => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language

  // Select options based on current language or fallback to static
  const options = optionsByLang ? (optionsByLang[lang] || []) : staticOptions

  return (
    <Col className={className}>
      <Label htmlFor={name}>
        {t(name)} {isRequired && <span className="text-danger">*</span>}
      </Label>

      <Input
        name={name}
        type="select"
        className="form-select"
        id={name}
        disabled={isLoading || isError}
        onChange={validation.handleChange}
        onBlur={validation.handleBlur}
        value={validation.values[name] || ""}
        invalid={
          validation.touched[name] && validation.errors[name] ? true : false
        }
      >
        {isLoading && (
          <option value="">{t("Loading")}...</option>
        )}

        {isError && (
          <option value="">{t("Failed to load options")}</option>
        )}

        {!isLoading && !isError && (
          <>
            <option value="">{t("Select")} {t(name)}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.label)}
              </option>
            ))}
          </>
        )}
      </Input>

      {validation.touched[name] && validation.errors[name] && (
        <FormFeedback>{validation.errors[name]}</FormFeedback>
      )}
    </Col>
  )
}

AsyncSelectField.propTypes = {
  name: PropTypes.string.isRequired,
  validation: PropTypes.shape({
    values: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleBlur: PropTypes.func.isRequired,
    touched: PropTypes.object,
    errors: PropTypes.object,
  }).isRequired,
  isRequired: PropTypes.bool,
  className: PropTypes.string,
  optionsByLang: PropTypes.objectOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        label: PropTypes.string.isRequired,
      })
    )
  ),
  staticOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  isLoading: PropTypes.bool,
  isError: PropTypes.bool,
}

export default AsyncSelectField
