import * as Yup from 'yup';
import { useTranslation } from "react-i18next";
/**
 * Reusable alphanumeric validation schema.
 * @param {number} minLength - Minimum length of the string.
 * @param {number} maxLength - Maximum length of the string.
 * @param {boolean} isRequired - Whether the field is required.
 * @returns {Yup.StringSchema} - The Yup validation schema.
 */
export const alphanumericValidation = (minLength, maxLength, isRequired = true) => {
  const { t } = useTranslation();
  let schema = Yup.string()
    .matches(/^(?=.*[a-zA-Z])[a-zA-Z0-9 !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/, t("val_alphanumeric"))
    .min(minLength, `${t('val_min_length')}: ${minLength}`)
    .max(maxLength, `${t('val_max_length')}: ${maxLength}`)

  if (isRequired) {
    schema = schema.required(t('val_required'));
  }
  return schema;
};
export const amountValidation = (minLength, maxLength, isRequired = true) => {
  const { t } = useTranslation();
  let schema = Yup.number()
    .min(minLength, `${t('val_min_amount')}: ${minLength}`)
    .max(maxLength, `${t('val_max_amount')}: ${maxLength}`)
    .test(
      'is-decimal',
      t('val_two_decimal_places'),
      (value) => value === undefined || /^\d+(\.\d{1,2})?$/.test(value.toString())
    )
  if (isRequired) {
    schema = schema.required("This field is required");
  }
  return schema;
};
export const numberValidation = (minLength, maxLength, isRequired = true) => {
  const { t } = useTranslation();
  let schema = Yup.number()
    .integer(`${t('val_integer_only')}: ${maxLength}`)
    .min(minLength, `${t('val_min_number')}: ${minLength}`)
    .max(maxLength, `${t('val_max_number')}: ${maxLength}`)
  if (isRequired) {
    schema = schema.required("This field is required");
  }
  return schema;
};
export const dropdownValidation = (minLength, maxLength, isRequired = true) => {
  const { t } = useTranslation();
  let schema = Yup.number()
    .integer(`${t('val_integer_only')}: ${maxLength}`)
    .min(minLength, `${t('val_min_number')}: ${minLength}`)
    .max(maxLength, `${t('val_max_number')}: ${maxLength}`)
  if (isRequired) {
    schema = schema.required("This field is required");
  }
  return schema;
};