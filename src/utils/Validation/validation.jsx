import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { PAGE_ID } from "../../constants/constantFile";

/**
 * Reusable alphanumeric validation schema.
 * @param {number} minLength - Minimum length of the string.
 * @param {number} maxLength - Maximum length of the string.
 * @param {boolean} isRequired - Whether the field is required.
 * @returns {Yup.StringSchema} - The Yup validation schema.
 */
export const alphanumericValidation = (
  minLength,
  maxLength,
  isRequired = true
) => {
  const { t } = useTranslation();
  let schema = Yup.string()
    .matches(
      /^(?=.*[a-zA-Z])[a-zA-Z0-9 !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/,
      t("val_alphanumeric")
    )
    .min(minLength, `${t("val_min_length")}: ${minLength}`)
    .max(maxLength, `${t("val_max_length")}: ${maxLength}`);

  if (isRequired) {
    schema = schema.required(t("val_required"));
  }
  return schema;
};

export const onlyAmharicValidation = (
  minLength,
  maxLength,
  isRequired = true
) => {
  const { t } = useTranslation();
  let schema = Yup.string()
    .matches(
      /^[\u1200-\u137F0-9\s.,;!?@#$%^&*()_+\-=[\]{}|:'"<>\\/`~]+$/,
      t("only_amharic")
    )
    .min(minLength, `${t("val_min_length")}: ${minLength}`)
    .max(maxLength, `${t("val_max_length")}: ${maxLength}`);

  if (isRequired) {
    schema = schema.required(t("val_required"));
  }
  return schema;
};

export const phoneValidation = (isRequired = true) => {
  const { t } = useTranslation();
  let schema = Yup.string().matches(/^[79]\d{8}$/, t("val_phone_number"));
  if (isRequired) {
    schema = schema.required(t("val_required"));
  }
  return schema;
};

// export const amountValidation = (minLength, maxLength, isRequired = true) => {
//   const { t } = useTranslation();
//   let schema = Yup.number()
//     .min(minLength, `${t('val_min_amount')}: ${minLength}`)
//     .max(maxLength, `${t('val_max_amount')}: ${maxLength}`)
//     .test(
//       'is-decimal',
//       t('val_two_decimal_places'),
//       (value) => value === undefined || /^\d+(\.\d{1,2})?$/.test(value.toString())
//     )
//   if (isRequired) {
//     schema = schema.required(t("val_required"));
//   }
//   return schema;
// };

export const amountValidation = (minLength, maxLength, isRequired = true) => {
  const { t } = useTranslation();
  let schema = Yup.number()
    .typeError(t("val_required")) // Ensures non-numeric values show the required error
    .min(minLength, `${t("val_min_amount")}: ${minLength}`)
    .max(maxLength, `${t("val_max_amount")}: ${maxLength}`)
    .test(
      "is-decimal",
      t("val_two_decimal_places"),
      (value) =>
        value === 0 ||
        value === undefined ||
        value === null ||
        /^\d+(\.\d{1,2})?$/.test(value.toString())
    );

  if (isRequired) {
    schema = schema.required(t("val_required"));
  }

  return schema;
};

export const formattedAmountValidation = (
  minLength,
  maxLength,
  isRequired = true
) => {
  const { t } = useTranslation();

  const cleanValue = (value) => {
    if (typeof value !== "string") {
      // Convert numbers to strings
      if (typeof value === "number") return value.toString();
      return "";
    }
    let val = value.replace(/,/g, "");
    // Remove trailing dot if no decimals follow
    if (val.endsWith(".")) {
      val = val.slice(0, -1);
    }
    return val;
  };

  let schema = Yup.mixed()
    .test("is-numeric", t("val_invalid_number"), (value) => {
      if (value === undefined || value === "") return true;
      const val = cleanValue(value);
      return /^\d+(\.\d{1,2})?$/.test(val);
    })
    .test("min-value", `${t("val_min_amount")}: ${minLength}`, (value) => {
      if (value === undefined || value === "") return true;
      const val = cleanValue(value);
      return parseFloat(val) >= minLength;
    })
    .test("max-value", `${t("val_max_amount")}: ${maxLength}`, (value) => {
      if (value === undefined || value === "") return true;
      const val = cleanValue(value);
      return parseFloat(val) <= maxLength;
    });

  if (isRequired) {
    schema = schema.required(t("val_required"));
  }
  return schema;
};

export const numberValidation = (minLength, maxLength, isRequired = true) => {
  const { t } = useTranslation();
  let schema = Yup.number()
    .integer(`${t("val_integer_only")}: ${maxLength}`)
    .min(minLength, `${t("val_min_number")}: ${minLength}`)
    .max(maxLength, `${t("val_max_number")}: ${maxLength}`);
  if (isRequired) {
    schema = schema.required(t("val_required"));
  }
  return schema;
};

export const dropdownValidation = (minLength, maxLength, isRequired = true) => {
  const { t } = useTranslation();
  let schema = Yup.number()
    .integer(`${t("val_integer_only")}: ${maxLength}`)
    .min(minLength, `${t("val_min_number")}: ${minLength}`)
    .max(maxLength, `${t("val_max_number")}: ${maxLength}`);
  if (isRequired) {
    schema = schema.required(t("val_required"));
  }
  return schema;
};

export const websiteUrlValidation = (required = false) => {
  let schema = Yup.string().matches(
    /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
    "Invalid website URL"
  );

  if (required) {
    schema = schema.required("Website URL is required");
  }

  return schema;
};

export const emailValidation = (isRequired = true) => {
  const { t } = useTranslation();

  let schema = Yup.string()
    .email(t("val_invalid_email")) // Built-in Yup email validation
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Additional format check
      t("val_invalid_email_format")
    );

  if (isRequired) {
    schema = schema.required(t("val_required"));
  }

  return schema;
};
export const tinValidation = (minLength, maxLength, isRequired = true) => {
  const { t } = useTranslation();

  let schema = Yup.string()
    // Only letters and numbers allowed (no spaces or special chars)
    .matches(
      /^[a-zA-Z0-9]*$/, // <-- Only alphanumeric characters
      t("val_letters_numbers_only") // Error message key
    )
    .min(minLength, t("val_min_length", { length: minLength }))
    .max(maxLength, t("val_max_length", { length: maxLength }));

  if (isRequired) {
    schema = schema.required(t("val_required"));
  }

  return schema;
};
// These statuses are received from the backend. verify with the backend before making any modifications.
// const statuses = {
//   1: "Draft",
//   2: "Requested",
//   3: "Request Accepted",
//   4: "Request Rejected",
//   5: "New",
//   6: "On-Progress",
//   7: "Completed",
//   8: "Not-Known"
// };

export const checkProjectStatus = (pageId, status) => {
  switch (pageId) {
    case PAGE_ID.PROJ_PAYMENT:
      switch (status) {
        case 1: // Draft
          return "Cannot modify payment for a project in draft status.";
        case 4:
          return "Cannot modify payment for a project in rejected status.";
        case 7: // Completed
          return "Cannot modify payment for a completed project.";
        case 5: // New
        case 6: // On-Progress
          return true;
        default:
          return `Invalid project status: ${status}`;
      }

    case PAGE_ID.PROJ_DOCUMENT:
      switch (status) {
        case 7: // Completed
          return "Cannot modify documents for a completed project.";
        case 1: // Draft
        case 5: // New
        case 6: // On-Progress
          return true;
        default:
          return `Invalid project status: ${status}`;
      }

    case PAGE_ID.PROJ_HANDOVER:
      switch (status) {
        case 7: // Completed
          return "Cannot modify handover for a completed project.";
        case 1: // Draft
          return "Cannot modify handover for a project in draft status.";
        case 5: // New
        case 6: // On-Progress
          return true;
        default:
          return `Invalid project status: ${status}`;
      }

    default:
      return `Invalid page: ${pageId}`;
  }
};

export const checkPasswordStrength = (password) => {
  if (password.length < 8) return "Too short";
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar)
    return "Strong";
  if (hasUpperCase && hasLowerCase && (hasNumber || hasSpecialChar))
    return "Moderate";
  return "Weak";
};
