import React, { memo } from "react";
import {
  Card,
  Form,
  Label,
  Input,
  FormFeedback,
  Spinner,
  CardTitle,
  CardBody,
  Col,
  Row,
  Button,
  ModalBody,
  Modal,
  ModalHeader,
  ModalFooter,
  Table,
} from "reactstrap";
import { useTranslation } from "react-i18next";
import { useUpdateBudgetRequestAmount } from "../../queries/budgetrequestamount_query";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import {
  amountValidation,
  alphanumericValidation,
} from "../../utils/Validation/validation";

const ActionForm = ({ isOpen, toggle, amount }) => {
  const { t } = useTranslation();
  const updateBudgetRequestAmount = useUpdateBudgetRequestAmount();
  const handleUpdateBudgetRequestAmount = async (data) => {
    try {
      await updateBudgetRequestAmount.mutateAsync(data);
      toast.success(t("update_success"), {
        autoClose: 2000,
      });
      validation.resetForm();
    } catch (error) {
      toast.success(t("update_failure"), {
        autoClose: 2000,
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
    },
    validationSchema: Yup.object({
      bra_approved_amount: amountValidation(0, 10000000000, false),
      bra_source_government_approved: amountValidation(0, 10000000000, false),
      bra_source_internal_approved: amountValidation(0, 10000000000, false),
      bra_source_support_approved: amountValidation(0, 10000000000, false),
      bra_source_credit_approved: amountValidation(0, 10000000000, false),
      bra_approved_date: alphanumericValidation(0, 50, false),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      console.log("values", values);
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
      handleUpdateBudgetRequestAmount(updateBudgetRequestAmount);
    },
  });
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
                    <tr>
                      <td>
                        <strong>{t(`bra_current_year_expense`)}:</strong>
                      </td>
                      <td>
                        <span className="text-primary">
                          {amount?.bra_current_year_expense}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>{t(`bra_requested_amount`)}:</strong>
                      </td>
                      <td>
                        <span className="text-primary">
                          {amount?.bra_requested_amount}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>{t(`bra_source_government_requested`)}:</strong>
                      </td>
                      <td>
                        <span className="text-primary">
                          {amount?.bra_source_government_requested}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>{t(`bra_source_internal_requested`)}:</strong>
                      </td>
                      <td>
                        <span className="text-primary">
                          {amount?.bra_source_internal_requested}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>{t(`bra_source_support_requested`)}:</strong>
                      </td>
                      <td>
                        <span className="text-primary">
                          {amount?.bra_source_support_requested}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>{t(`bra_source_credit_requested`)}:</strong>
                      </td>
                      <td>
                        <span className="text-primary">
                          {amount?.bra_source_credit_requested}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>{t(`bra_source_credit_code`)}:</strong>
                      </td>
                      <td>
                        <span className="text-primary">
                          {amount?.bra_source_credit_code}
                        </span>
                      </td>
                    </tr>
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
                      <Input
                        name="bra_approved_date"
                        type="text"
                        placeholder={t("bra_approved_date")}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.bra_approved_date || ""}
                        invalid={
                          validation.touched.bra_approved_date &&
                          validation.errors.bra_approved_date
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.bra_approved_date &&
                      validation.errors.bra_approved_date ? (
                        <FormFeedback type="invalid">
                          {validation.errors.bra_approved_date}
                        </FormFeedback>
                      ) : null}
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <div className="text-end">
                        {updateBudgetRequestAmount.isPending ? (
                          <Button
                            color="success"
                            type="submit"
                            className="save-user"
                            disabled={
                              updateBudgetRequestAmount.isPending ||
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
