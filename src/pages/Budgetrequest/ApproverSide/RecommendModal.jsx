import { useTranslation } from 'react-i18next'
import { Spinner, Modal, ModalBody, ModalHeader, Form, Label, Input, Button, Col, FormFeedback, Row } from 'reactstrap'
import * as Yup from "yup";
import { useFormik } from "formik";
import { useUpdateRequestFollowup } from "../../../queries/requestfollowup_query"
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

  const validationSchema = Yup.object().shape({
    rqf_recommendation: Yup.string().required(t('rqf_recommendation')),
    rqf_recommended_date: Yup.string().required(t('rqf_recommended_date')),
    rqf_current_status: Yup.string().required(t('rqf_current_status')),
    rqf_recommended_amount: Yup.number()
      .min(0, "Recommended amount must be greater or equal to 0")
      .when("rqf_current_status", {
        is: "2", // Recommend
        then: (schema) => schema.required("Recommended amount is required"),
        otherwise: (schema) => schema.optional(),
      }),
    rqf_recommended_physical: Yup.number()
      .min(0, "Recommended physical must be greater or equal to 0")
      .when("rqf_current_status", {
        is: "2",
        then: (schema) => schema.required("Recommended physical is required"),
        otherwise: (schema) => schema.optional(),
      }),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      rqf_id: request.rqf_id,
      rqf_current_status: request.rqf_current_status || "",
      rqf_recommendation: request.rqf_recommendation || "",
      rqf_recommended_date: request.rqf_recommended_date || "",
      rqf_recommended_amount: request.rqf_recommended_amount || "",
      rqf_recommended_physical: request.rqf_recommended_physical || "",
    },
    validationSchema,
    validateOnBlur: true,
    validateOnChange: true,
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
      size='lg'
    >
      <ModalHeader toggle={toggle}>{t("Recommend")}</ModalHeader>
      <ModalBody>
        <Form onSubmit={formik.handleSubmit}>
          <Row>
            <Col className='col-md-6 mb-3'>
              <DatePicker
                isRequired={true}
                componentId={"rqf_recommended_date"}
                validation={formik}
              />
            </Col>
            <Col className='col-md-6 mb-3'>
              <Label>{t('rqf_current_status')}</Label>
              <Input
                name='rqf_current_status'
                type='select'
                placeholder={t('rqf_current_status')}
                onChange={(e) => {
                  formik.handleChange(e);
                  if (e.target.value !== "2") {
                    formik.setFieldValue('rqf_recommended_amount', 0);
                    formik.setFieldValue('rqf_recommended_physical', 0);
                  }
                }}
                onBlur={formik.handleBlur}
                value={formik.values.rqf_current_status}
                invalid={
                  formik.touched.rqf_current_status && !!formik.errors.rqf_current_status
                }
              >
                <option value="">{t('Select Status')}</option>
                <option value="2">{t('Recommend')}</option>
                <option value="3">{t('Reject')}</option>
              </Input>
              {formik.touched.rqf_current_status && formik.errors.rqf_current_status && (
                <FormFeedback type='invalid'>
                  {formik.errors.rqf_current_status}
                </FormFeedback>
              )}
            </Col>
          </Row>
          {formik.values.rqf_current_status !== "3" && (
            <Row>
              <Col className="col-md-6 mb-3">
                <Label>{t('rqf_recommended_amount')}</Label>
                <Input
                  name='rqf_recommended_amount'
                  type='number'
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.rqf_recommended_amount}
                  invalid={formik.touched.rqf_recommended_amount && !!formik.errors.rqf_recommended_amount}
                  min={0}
                />
                {formik.touched.rqf_recommended_amount && formik.errors.rqf_recommended_amount && (
                  <FormFeedback type='invalid'>
                    {formik.errors.rqf_recommended_amount}
                  </FormFeedback>
                )}
              </Col>

              <Col className="col-md-6 mb-3">
                <Label>{t('rqf_recommended_physical')}</Label>
                <Input
                  name='rqf_recommended_physical'
                  type='number'
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.rqf_recommended_physical}
                  invalid={formik.touched.rqf_recommended_physical && !!formik.errors.rqf_recommended_physical}
                  min={0}
                />
                {formik.touched.rqf_recommended_physical && formik.errors.rqf_recommended_physical && (
                  <FormFeedback type='invalid'>
                    {formik.errors.rqf_recommended_physical}
                  </FormFeedback>
                )}
              </Col>
            </Row>
          )}

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
                formik.touched.rqf_recommendation && !!formik.errors.rqf_recommendation
              }
              maxLength={1020}
            />
            {formik.touched.rqf_recommendation && formik.errors.rqf_recommendation && (
              <FormFeedback type='invalid'>
                {formik.errors.rqf_recommendation}
              </FormFeedback>
            )}
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
    </Modal >
  )
}

export default RecommendModal