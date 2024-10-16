import React, { useTransition } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Col,
  Card,
  CardBody,
  Table,
  CardTitle,
  Label,
  Form,
  Input,
  InputGroup,
  FormFeedback,
  FormGroup,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";

const modalStyle = {
  width: "100%",
  height: "100%",
};

const BudgetRequestListModal = (props) => {
  const { t } = useTranslation();
  const { isOpen, toggle, transaction, budgetYearMap } = props;

  const formik = useFormik({
    initialValues: {
      firstname: "",
      email: "",
      password: "",
      city: "",
      state: "",
      zip: "",
      check: "",
    },
    validationSchema: Yup.object({
      firstname: Yup.string().required("This field is required"),
      email: Yup.string()
        .email()
        .matches(/^(?!.*@[^,]*,)/)
        .required("Please Enter Your Email"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .matches(RegExp("(.*[a-z].*)"), "At least lowercase letter")
        .matches(RegExp("(.*[A-Z].*)"), "At least uppercase letter")
        .matches(RegExp("(.*[0-9].*)"), "At least one number")
        .required("This field is required"),
      city: Yup.string().required("This field is required"),
      state: Yup.string().required("This field is required"),
      zip: Yup.string().required("This field is required"),
      check: Yup.string().required("This field is required"),
    }),

    onSubmit: (values) => {
      // console.log("value", values.password);
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      role="dialog"
      autoFocus={true}
      centered={true}
      className="modal-xl"
      tabIndex="-1"
      toggle={toggle}
      style={modalStyle}
    >
      <div className="modal-xl">
        <ModalHeader toggle={toggle}>{t("View Details")}</ModalHeader>
        <ModalBody>
          <Row>
            <Col xl={3}>
              <Card>
                <CardBody>
                  <h5 className="fw-semibold">Overview</h5>

                  <div className="table-responsive">
                    <table className="table">
                      <tbody>
                        <tr>
                          <th scope="col">Budget Year</th>
                          <td scope="col">
                            {budgetYearMap[transaction.bdr_budget_year_id]}
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">Requested Amount</th>
                          <td>{transaction.bdr_requested_amount}</td>
                        </tr>
                        <tr>
                          <th scope="row">Requested Date</th>
                          <td>{transaction.bdr_requested_date_gc}</td>
                        </tr>

                        <tr>
                          <th scope="row">Description</th>
                          <td>{transaction.bdr_description}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl={5}>
              <Card>
                <CardBody>
                  <CardTitle className="mb-4">Accept Request</CardTitle>

                  <Form onSubmit={formik.handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="formrow-email-Input">
                            Released Amount
                          </Label>
                          <Input
                            type="text"
                            name="email"
                            className="form-control"
                            id="formrow-email-Input"
                            placeholder="Enter Your Email ID"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.email && formik.errors.email
                                ? true
                                : false
                            }
                          />
                          {formik.errors.email && formik.touched.email ? (
                            <FormFeedback type="invalid">
                              {formik.errors.email}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="formrow-password-Input">
                            Released Date
                          </Label>
                          <FormGroup>
                            <InputGroup>
                              <Flatpickr
                                id="DataPicker"
                                className={`form-control`}
                                name="prj_end_date_plan_gc"
                                options={{
                                  altInput: true,
                                  altFormat: "Y/m/d",
                                  dateFormat: "Y/m/d",
                                  enableTime: false,
                                }}
                              />

                              <Button
                                type="button"
                                className="btn btn-outline-secondary"
                                disabled
                              >
                                <i
                                  className="fa fa-calendar"
                                  aria-hidden="true"
                                />
                              </Button>
                            </InputGroup>
                          </FormGroup>
                        </div>
                      </Col>
                    </Row>
                    <div className="mb-3">
                      <Label htmlFor="formrow-firstname-Input">
                        Description
                      </Label>
                      <Input
                        type="textarea"
                        rows={6}
                        name="firstname"
                        className="form-control"
                        id="formrow-firstname-Input"
                        placeholder="Enter Your First Name"
                        value={formik.values.firstname}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        invalid={
                          formik.touched.firstname && formik.errors.firstname
                            ? true
                            : false
                        }
                      />
                      {formik.errors.firstname && formik.touched.firstname ? (
                        <FormFeedback type="invalid">
                          {formik.errors.firstname}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div>
                      <button type="submit" className="btn btn-success w-md">
                        Accept
                      </button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
            <Col xl={4}>
              <Card>
                <CardBody>
                  <CardTitle className="mb-4">Reject Request</CardTitle>

                  <Form onSubmit={formik.handleSubmit}>
                    <div className="mb-3">
                      <Label htmlFor="formrow-firstname-Input">
                        Rejection Reason
                      </Label>
                      <Input
                        type="textarea"
                        rows={10}
                        name="firstname"
                        className="form-control"
                        id="formrow-firstname-Input"
                        placeholder="Enter Your First Name"
                        value={formik.values.firstname}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        invalid={
                          formik.touched.firstname && formik.errors.firstname
                            ? true
                            : false
                        }
                      />
                      {formik.errors.firstname && formik.touched.firstname ? (
                        <FormFeedback type="invalid">
                          {formik.errors.firstname}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div>
                      <button type="submit" className="btn btn-danger w-md">
                        Reject
                      </button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button type="button" color="secondary" onClick={toggle}>
            {t("Close")}
          </Button>
        </ModalFooter>
      </div>
    </Modal>
  );
};
BudgetRequestListModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};
export default BudgetRequestListModal;
