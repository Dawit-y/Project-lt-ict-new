import PropTypes from "prop-types";
import { Col, Label, Input, FormFeedback, Button } from "reactstrap";
import { useTranslation } from "react-i18next";
import { FaSync } from "react-icons/fa";

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
 * @param {Function} [props.refetch] - Optional refetch function for retrying failed loads.
 *
 * @returns {JSX.Element}
 */
const AsyncSelectField = ({
	fieldId,
	validation,
	isRequired = false,
	className,
	label,
	optionMap = {},
	isLoading = false,
	isError = false,
	refetch,
}) => {
	const { t } = useTranslation();

	const handleRefetch = () => {
		if (refetch && typeof refetch === "function") {
			refetch();
		}
	};

	return (
		<Col className={className}>
			<div className="d-flex justify-content-between align-items-center mb-1">
				<Label htmlFor={fieldId} className="mb-0">
					{label ? label : t(fieldId)}{" "}
					{isRequired && <span className="text-danger">*</span>}
				</Label>

				{refetch && isError && (
					<Button
						color="link"
						size="sm"
						onClick={handleRefetch}
						className="p-0"
						title={t("Retry loading options")}
						style={{ fontSize: "0.875rem" }}
					>
						<FaSync className="me-1" />
						{t("Retry")}
					</Button>
				)}
			</div>

			<Input
				name={fieldId}
				type="select"
				className="form-select"
				id={`${fieldId}-select`}
				disabled={isLoading || isError}
				onChange={validation.handleChange}
				onBlur={validation.handleBlur}
				value={validation.values[fieldId] || ""}
				invalid={
					validation.touched[fieldId] && validation.errors[fieldId]
						? true
						: false
				}
			>
				{isLoading && <option value="">{t("Loading")}...</option>}
				{isError && (
					<option value="">
						{refetch ? t("Failed to load options") : t("No options available")}
					</option>
				)}

				{!isLoading && !isError && (
					<>
						<option value="">
							{t("Select")} {label ? label : t(fieldId)}
						</option>
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
	);
};

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
	optionMap: PropTypes.objectOf(
		PropTypes.oneOfType([PropTypes.string, PropTypes.number])
	).isRequired,
	isLoading: PropTypes.bool,
	isError: PropTypes.bool,
	refetch: PropTypes.func,
};

export default AsyncSelectField;
