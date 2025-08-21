import React, { memo } from "react";
import {
  Form,
  Label,
  Input,
  FormFeedback,
  Spinner,
  Col,
  Row,
  Button,
  ModalBody,
  Modal,
  ModalHeader,
  Table,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import { useTranslation } from "react-i18next";
import { useUpdateBudgetRequestAmount } from "../../queries/budgetrequestamount_query";
import { useUpdateBudgetRequest } from "../../queries/cso_budget_request_query";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import {
  amountValidation,
  alphanumericValidation,
} from "../../utils/Validation/validation";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import { formatDate } from "../../utils/commonMethods";

const ActionForm = ({ isOpen, toggle, amount }) => {
  const { t } = useTranslation();
  const updateBudgetRequest = useUpdateBudgetRequest();
  const updateBudgetRequestAmount = useUpdateBudgetRequestAmount();
  const handleUpdateBudgetRequestAmount = async (data, budgetRequestData) => {
    try {
      await updateBudgetRequestAmount.mutateAsync(data);
      await updateBudgetRequest.mutateAsync(budgetRequestData);
      toast.success(t("update_success"), {
				autoClose: 3000,
			});
      validation.resetForm();
    } catch (error) {
      toast.success(t("update_failure"), {
				autoClose: 3000,
			});
    }
  };

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      bra_approved_amount: "",
      bra_source_government_approved: "",
      bra_source_support_requested: "",
      bra_source_internal_approved: "",
      bra_source_support_approved: "",
      bra_source_credit_approved: "",
      bra_source_other_approved: "",
      bra_approved_date: "",
      bra_status: "",
      bdr_request_status: "",
    },
    validationSchema: Yup.object({
      bra_approved_amount: amountValidation(0, 10000000000, false).required(
        t(`bra_approved_amount`),
      ),
      bra_source_government_approved: amountValidation(
        0,
        10000000000,
        false,
      ).required(t(`bra_source_government_approved`)),
      bra_source_internal_approved: amountValidation(
        0,
        10000000000,
        false,
      ).required(t(`bra_source_internal_approved`)),
      bra_source_support_approved: amountValidation(
        0,
        10000000000,
        false,
      ).required(t(`bra_source_support_approved`)),
      bra_source_credit_approved: amountValidation(
        0,
        10000000000,
        false,
      ).required(t(`bra_source_credit_approved`)),
      bra_source_other_approved: amountValidation(
        0,
        10000000000,
        false,
      ).required(t(`bra_source_other_approved`)),
      bra_approved_date: Yup.string().required(t("bra_approved_date")),
      bdr_request_status: Yup.string().required(t("bdr_request_status")),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      const updateBudgetRequestAmount = {
        bra_id: amount?.bra_id,
        bra_approved_amount: values.bra_approved_amount,
        bra_source_government_approved: values.bra_source_government_approved,
        bra_source_internal_approved: values.bra_source_internal_approved,
        bra_source_support_approved: values.bra_source_support_approved,
        bra_source_credit_approved: values.bra_source_credit_approved,
        bra_source_other_approved: values.bra_source_other_approved,
        bra_approved_date: values.bra_approved_date,
        bra_status: values.bra_status,
      };
      const updateBudgetRequest = {
        bdr_id: amount?.bra_budget_request_id,
        bdr_request_status: values.bdr_request_status,
      };
      handleUpdateBudgetRequestAmount(
        updateBudgetRequestAmount,
        updateBudgetRequest,
      );
    },
  });

  const excludedKeys = ["bra_id", "bra_status", "is_editable", "is_deletable"];
  let filteredAmount = {};
  if (amount) {
    filteredAmount = Object.entries(amount)
      .filter(([key]) => !excludedKeys.includes(key))
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        role="dialog"
        autoFocus={true}
        centered={true}
        className="modal-xl"
        tabIndex="-1"
        toggle={toggle}
      >
        <div className="modal-xl">
          <ModalHeader
            toggle={toggle}
          >{`Approve Request for ${amount?.bra_expenditure_code_id}`}</ModalHeader>
          <ModalBody>
            <Row>
              <Col xl={6}>
                <Table>
                  <tbody>
                    {filteredAmount &&
                      Object.keys(filteredAmount).map((am) => (
                        <tr>
                          <td>
                            <strong>{t(`${am}`)}:</strong>
                          </td>
                          <td>
                            <span className="text-primary">
                              {filteredAmount[am]}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </Col>

              <Col xl={6}>
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    validation.handleSubmit();
                    return false;
                  }}
                >
                  <Row>
                    <Col className="col-md-12 mb-3">
                      <Label>{t("bra_approved_amount")}</Label>
                      <Input
                        name="bra_approved_amount"
                        type="number"
                        placeholder={t("bra_approved_amount")}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.bra_approved_amount || ""}
                        invalid={
                          validation.touched.bra_approved_amount &&
                          validation.errors.bra_approved_amount
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.bra_approved_amount &&
                      validation.errors.bra_approved_amount ? (
                        <FormFeedback type="invalid">
                          {validation.errors.bra_approved_amount}
                        </FormFeedback>
                      ) : null}
                    </Col>

                    <Col className="col-md-12 mb-3">
                      <Label>{t("bra_source_government_approved")}</Label>
                      <Input
                        name="bra_source_government_approved"
                        type="number"
                        placeholder={t("bra_source_government_approved")}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={
                          validation.values.bra_source_government_approved || ""
                        }
                        invalid={
                          validation.touched.bra_source_government_approved &&
                          validation.errors.bra_source_government_approved
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.bra_source_government_approved &&
                      validation.errors.bra_source_government_approved ? (
                        <FormFeedback type="invalid">
                          {validation.errors.bra_source_government_approved}
                        </FormFeedback>
                      ) : null}
                    </Col>
                    <Col className="col-md-12 mb-3">
                      <Label>{t("bra_source_internal_approved")}</Label>
                      <Input
                        name="bra_source_internal_approved"
                        type="number"
                        placeholder={t("bra_source_internal_approved")}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={
                          validation.values.bra_source_internal_approved || ""
                        }
                        invalid={
                          validation.touched.bra_source_internal_approved &&
                          validation.errors.bra_source_internal_approved
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.bra_source_internal_approved &&
                      validation.errors.bra_source_internal_approved ? (
                        <FormFeedback type="invalid">
                          {validation.errors.bra_source_internal_approved}
                        </FormFeedback>
                      ) : null}
                    </Col>
                    <Col className="col-md-12 mb-3">
                      <Label>{t("bra_source_support_approved")}</Label>
                      <Input
                        name="bra_source_support_approved"
                        type="number"
                        placeholder={t("bra_source_support_approved")}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={
                          validation.values.bra_source_support_approved || ""
                        }
                        invalid={
                          validation.touched.bra_source_support_approved &&
                          validation.errors.bra_source_support_approved
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.bra_source_support_approved &&
                      validation.errors.bra_source_support_approved ? (
                        <FormFeedback type="invalid">
                          {validation.errors.bra_source_support_approved}
                        </FormFeedback>
                      ) : null}
                    </Col>
                    <Col className="col-md-12 mb-3">
                      <Label>{t("bra_source_other_approved")}</Label>
                      <Input
                        name="bra_source_other_approved"
                        type="number"
                        placeholder={t("bra_source_other_approved")}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={
                          validation.values.bra_source_other_approved || ""
                        }
                        invalid={
                          validation.touched.bra_source_other_approved &&
                          validation.errors.bra_source_other_approved
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.bra_source_other_approved &&
                      validation.errors.bra_source_other_approved ? (
                        <FormFeedback type="invalid">
                          {validation.errors.bra_source_other_approved}
                        </FormFeedback>
                      ) : null}
                    </Col>
                    <Col className="col-md-12 mb-3">
                      <Label>{t("bra_source_credit_approved")}</Label>
                      <Input
                        name="bra_source_credit_approved"
                        type="number"
                        placeholder={t("bra_source_credit_approved")}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={
                          validation.values.bra_source_credit_approved || ""
                        }
                        invalid={
                          validation.touched.bra_source_credit_approved &&
                          validation.errors.bra_source_credit_approved
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.bra_source_credit_approved &&
                      validation.errors.bra_source_credit_approved ? (
                        <FormFeedback type="invalid">
                          {validation.errors.bra_source_credit_approved}
                        </FormFeedback>
                      ) : null}
                    </Col>
                    <Col className="col-md-12 mb-3">
                      <Label>{t("bra_approved_date")}</Label>
                      <InputGroup>
                        <div
                          className={`d-flex w-100 ${
                            validation.touched.bra_approved_date &&
                            validation.errors.bra_approved_date
                              ? "border border-danger rounded"
                              : ""
                          }`}
                        >
                          <Flatpickr
                            id="DataPicker"
                            name="bra_approved_date"
                            className="form-control"
                            options={{
                              altInput: true,
                              altFormat: "Y/m/d",
                              dateFormat: "Y/m/d",
                              enableTime: false,
                            }}
                            value={validation.values.bra_approved_date || ""}
                            onChange={(date) => {
                              const formattedDate = formatDate(date[0]);
                              validation.setFieldValue(
                                "bra_approved_date",
                                formattedDate,
                              );
                            }}
                            onBlur={validation.handleBlur}
                          />
                          <InputGroupText>
                            <i className="fa fa-calendar" aria-hidden="true" />
                          </InputGroupText>
                        </div>
                        {validation.touched.bra_approved_date &&
                          validation.errors.bra_approved_date && (
                            <div className="text-danger small mt-1">
                              {validation.errors.bra_approved_date}
                            </div>
                          )}
                      </InputGroup>
                    </Col>

                    <Col className="col-md-12 mb-3">
                      <Label>
                        {t("bdr_request_status")}
                        <span className="text-danger">*</span>
                      </Label>
                      <Input
                        name="bdr_request_status"
                        type="select"
                        className="form-select"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.bdr_request_status || ""}
                        invalid={
                          validation.touched.bdr_request_status &&
                          validation.errors.bdr_request_status
                            ? true
                            : false
                        }
                      >
                        <option value={null}>{t("Select Status")}</option>
                        <option value={"Approved"}>{t("Approved")}</option>
                        <option value={"Rejected"}>{t("Rejected")}</option>
                      </Input>
                      {validation.touched.bdr_request_status &&
                      validation.errors.bdr_request_status ? (
                        <FormFeedback type="invalid">
                          {validation.errors.bdr_request_status}
                        </FormFeedback>
                      ) : null}
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <div className="text-end">
                        {updateBudgetRequestAmount.isPending ||
                        updateBudgetRequest.isPending ? (
                          <Button
                            color="success"
                            type="submit"
                            className="save-user"
                            disabled={
                              updateBudgetRequestAmount.isPending ||
                              updateBudgetRequest.isPending ||
                              !validation.dirty
                            }
                          >
                            <Spinner
                              size={"sm"}
                              color="light"
                              className="me-2"
                            />
                            {t("Save")}
                          </Button>
                        ) : (
                          <Button
                            color="success"
                            type="submit"
                            className="save-user"
                          >
                            {t("Save")}
                          </Button>
                        )}
                      </div>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>
          </ModalBody>
        </div>
      </Modal>
    </>
  );
};

export default memo(ActionForm);
