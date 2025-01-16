import PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";
import { Spinner } from "reactstrap";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import { formatDate } from "../../utils/commonMethods";
import {
  Form,
  Input,
  FormFeedback,
  Label,
  Card,
  CardBody,
  FormGroup,
  Badge,
  InputGroup,
  InputGroupText,
} from "reactstrap";
const DatePicker = ({
  isRequired,
  validation,
  componentId,
  minDate,
  maxDate,
}) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <Label>
        {t(componentId)}
        {isRequired && <span className="text-danger">*</span>}
      </Label>
      <InputGroup>
        <div
          className={`d-flex w-100 ${
            validation.touched[componentId] && validation.errors[componentId]
              ? "border border-danger rounded"
              : ""
          }`}
        >
          <Flatpickr
            id={componentId}
            className="form-control"
            name={componentId}
            options={{
              altInput: true,
              altFormat: "Y/m/d",
              dateFormat: "Y/m/d",
              enableTime: false,
              minDate: minDate ? minDate : null,
              maxDate: maxDate ? maxDate : null,
            }}
            value={validation.values[componentId] || ""}
            onChange={(date) => {
              const formattedDate = formatDate(date[0]);
              validation.setFieldValue("" + componentId + "", formattedDate); // Set value dynamically in Formik
            }}
            onBlur={validation.handleBlur}
          />
          <InputGroupText>
            <i className="fa fa-calendar" aria-hidden="true" />
          </InputGroupText>
        </div>
        {validation.touched[componentId] && validation.errors[componentId] && (
          <div className="text-danger small mt-1">
            {validation.errors[componentId]}
          </div>
        )}
      </InputGroup>
    </React.Fragment>
  );
};
export default DatePicker;
