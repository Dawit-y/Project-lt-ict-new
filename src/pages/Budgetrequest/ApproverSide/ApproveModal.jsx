import React, { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Spinner, Modal, ModalBody, ModalHeader, Form, FormGroup, Label, Input, Button } from 'reactstrap'
import * as Yup from "yup";
import { useFormik } from "formik";
import { useUpdateBudgetRequestApproval } from "../../../queries/budget_request_query";
import { toast } from "react-toastify"
import DatePicker from "../../../components/Common/DatePicker";

const ApproveModal = ({ isOpen, toggle, request, toggleParent, action }) => {
  const { t } = useTranslation()
  const { mutateAsync, isPending } = useUpdateBudgetRequestApproval();
  const handleUpdateBudgetRequest = async (data) => {
    try {
      await mutateAsync(data);
      toast.success(t("update_success"), {
        autoClose: 2000,
      });
    } catch (error) {
      toast.error(t("update_failure"), {
        autoClose: 2000,
      });
    }
    toggle();
    toggleParent()
  };
  const validationSchema = Yup.object().shape({
    bdr_released_amount: action === "approve"
      ? Yup.number()
        .required("Released amount is required")
        .min(0, "Released amount must be greater or equal to 0")
        .max(request.bdr_requested_amount, "Can not release more than requested")
      : Yup.number().optional(),

    bdr_released_date_gc: Yup.date().required("Action date is required"),
    bdr_action_remark: Yup.string().required("Action remark is required"),
  });

  const formik = useFormik({
    initialValues: {
      bdr_id: request.bdr_id || "",
      bdr_request_status: action === "recommend" ? 2 : action === "approve" ? 3 : 4,
      bdr_released_amount: action === "approve"
        ? request.bdr_released_amount || ""
        : "",

      bdr_released_date_gc: request.bdr_released_date_gc || "",
      bdr_action_remark: request.bdr_action_remark || "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      handleUpdateBudgetRequest(values);
      formik.resetForm();
      toggle();
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      centered
      className=""
      toggle={toggle}
    >
      <ModalHeader toggle={toggle}>{action === "recommend" ? t("Recommend") : action === "approve" ? t("Approve") : t("Reject")}</ModalHeader>
      <ModalBody>
        <Form onSubmit={formik.handleSubmit}>
          {action === "approve" && (
            <FormGroup>
              <Label>Released Amount</Label>
              <Input
                type="number"
                name="bdr_released_amount"
                onChange={formik.handleChange}
                value={formik.values.bdr_released_amount}
                invalid={
                  formik.touched.bdr_released_amount &&
                  formik.errors.bdr_released_amount
                }
              />
              {formik.errors.bdr_released_amount &&
                formik.touched.bdr_released_amount && (
                  <div className="text-danger">
                    {formik.errors.bdr_released_amount}
                  </div>
                )}
            </FormGroup>
          )}
          <FormGroup>
            <DatePicker
              isRequired={true}
              componentId={"bdr_released_date_gc"}
              validation={formik}
              minDate={request?.bdr_requested_date_gc}
            />
          </FormGroup>
          <FormGroup>
            <Label>{t("bdr_action_remark")}</Label>
            <Input
              type="textarea"
              name="bdr_action_remark"
              rows={4}
              onChange={formik.handleChange}
              value={formik.values.bdr_action_remark}
              invalid={
                formik.touched.bdr_action_remark &&
                  formik.errors.bdr_action_remark
                  ? true
                  : false
              }
            />
            {formik.errors.bdr_action_remark &&
              formik.touched.bdr_action_remark && (
                <div className="text-danger">
                  {formik.errors.bdr_action_remark}
                </div>
              )}
          </FormGroup>
          <div className='d-flex gap-2 align-items-center justify-content-end'>
            <Button type="button" color="secondary" onClick={toggle}>
              {t("Close")}
            </Button>
            <Button
              type="submit"
              color={action === "recommend" ? "primary" : action === "approve" ? "success" : "danger"}
              className="w-md"
              disabled={isPending}
            >
              <span className="flex align-items-center justify-content-center">
                {isPending ? <Spinner size={"sm"} /> : ""}
                <span className="ms-2">{action === "recommend" ? t("Recommend") : action === "approve" ? t("Approve") : t("Reject")}</span>
              </span>
            </Button>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  )
}

export default ApproveModal