import React, { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Spinner, Modal, ModalBody, ModalHeader, Form, FormGroup, Label, Input, Badge, Button, Col } from 'reactstrap'
import * as Yup from "yup";
import { useFormik } from "formik";
import { useSearchRequestFollowups, useUpdateRequestFollowup } from "../../../queries/requestfollowup_query"
import { toast } from "react-toastify"
import DatePicker from "../../../components/Common/DatePicker";


const RecommendModal = ({ isOpen, toggle, request }) => {
  const { t } = useTranslation()

  const updateRequestFollowup = useUpdateRequestFollowup()
  const handleUpdateRequestFollowup = async (data) => {
    try {
      await updateRequestFollowup.mutateAsync(data);
      toast.success(t('update_success'), {
        autoClose: 2000,
      });
      formik.resetForm();
    } catch (error) {
      toast.error(t('update_failure'), {
        autoClose: 2000,
      });
    }
    toggle();
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      rqf_id: request.rqf_id,
      rqf_current_status: request.rqf_current_status || "",
      rqf_recommendation: request.rqf_recommendation || "",
      rqf_recommended_date: request.rqf_recommended_date || "",
    },
    formikSchema: Yup.object({
      rqf_recommendation: Yup.string().required(t('rqf_recommendation')),
      rqf_recommended_date: Yup.string().required(t('rqf_recommended_date')),
      rqf_current_status: Yup.string().required(t('rqf_current_status')),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      handleUpdateRequestFollowup(values);
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      centered
      className=""
      toggle={toggle}
      size='md'
    >
      <ModalHeader toggle={toggle}>{t("Recommend")}</ModalHeader>
      <ModalBody>
        <Form onSubmit={formik.handleSubmit}>
          <Col className='col-md-12 mb-3'>
            <DatePicker isRequired={true} componentId={"rqf_recommended_date"} validation={formik} />
          </Col>
          <Col className='col-md-12 mb-3'>
            <Label>{t('rqf_current_status')}</Label>
            <Input
              name='rqf_current_status'
              type='select'
              placeholder={t('rqf_current_status')}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.rqf_current_status || ''}
              invalid={
                formik.touched.rqf_current_status &&
                  formik.errors.rqf_current_status
                  ? true
                  : false
              }
            >
              <option value={null}>Select Status</option>
              <option value={2}>Recommend</option>
              <option value={3}>Reject</option>
            </Input>
            {formik.touched.rqf_current_status &&
              formik.errors.rqf_current_status ? (
              <FormFeedback type='invalid'>
                {formik.errors.rqf_current_status}
              </FormFeedback>
            ) : null}
          </Col>
          <Col className='col-md-12 mb-3'>
            <Label>{t('rqf_recommendation')}</Label>
            <Input
              name='rqf_recommendation'
              type='textarea'
              rows={4}
              placeholder={t('rqf_recommendation')}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.rqf_recommendation || ''}
              invalid={
                formik.touched.rqf_recommendation &&
                  formik.errors.rqf_recommendation
                  ? true
                  : false
              }
              maxLength={1020}
            />
            {formik.touched.rqf_recommendation &&
              formik.errors.rqf_recommendation ? (
              <FormFeedback type='invalid'>
                {formik.errors.rqf_recommendation}
              </FormFeedback>
            ) : null}
          </Col>
          <div className='d-flex gap-2 align-items-center justify-content-end'>
            <Button type="button" color="secondary" onClick={toggle}>
              {t("Close")}
            </Button>
            <Button
              type="submit"
              color={"success"}
              className="w-md"
              disabled={updateRequestFollowup.isPending}
            >
              <span className="flex align-items-center justify-content-center">
                {updateRequestFollowup.isPending ? <Spinner size={"sm"} /> : ""}
                <span className="ms-2">{t("save")}</span>
              </span>
            </Button>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  )
}

export default RecommendModal