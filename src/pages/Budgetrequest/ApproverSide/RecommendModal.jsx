import { useTranslation } from 'react-i18next'
import { Spinner, Modal, ModalBody, ModalHeader, Form, Label, Input, Button, Col, FormFeedback } from 'reactstrap'
import * as Yup from "yup";
import { useFormik } from "formik";
import { useUpdateRequestFollowup } from "../../../queries/requestfollowup_query"
import { toast } from "react-toastify"
import DatePicker from "../../../components/Common/DatePicker";
import { formattedAmountValidation } from "../../../utils/Validation/validation";
import FormattedAmountField from "../../../components/Common/FormattedAmountField";
import { convertToNumericValue } from "../../../utils/commonMethods";

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
    rqf_current_status: Yup.string().required(t('rqf_recommended_date')),
    rqf_recommended_amount: Yup.number()
      .min(0, "Recommended amount must be greater or equal to 0")
      .when("rqf_current_status", {
        is: "2",
        then: (schema) => schema.required("Recommended amount is required"),
      }),
    // rqf_current_status: Yup.string()
    //   .required(t('rqf_current_status_required'))
    //   .test('not-empty', t('rqf_current_status_required'), value => value !== ""),
    // rqf_recommended_amount: Yup.string()
    //   .when('rqf_current_status', {
    //     is: "2",
    //     then: Yup.string()
    //       .test('amount-required', t('amount_required'), value => {
    //         return !!value && value.trim() !== '';
    //       })
    //       .test('amount-valid', t('amount_invalid'), value => {
    //         try {
    //           const num = convertToNumericValue(value);
    //           return num >= 0 && num <= 10000000000;
    //         } catch {
    //           return false;
    //         }
    //       }),
    //     otherwise: Yup.string().notRequired()
    //   })
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      rqf_id: request.rqf_id,
      rqf_current_status: request.rqf_current_status || "",
      rqf_recommendation: request.rqf_recommendation || "",
      rqf_recommended_date: request.rqf_recommended_date || "",
      rqf_recommended_amount: request.rqf_recommended_amount || ""
    },
    validationSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (values) => {
      handleUpdateRequestFollowup(values);
    },
  });

  // Debugging - log formik state
  console.log('Formik values:', formik.values);
  console.log('Formik errors:', formik.errors);

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
            <DatePicker
              isRequired={true}
              componentId={"rqf_recommended_date"}
              validation={formik}
            />
          </Col>
          <Col className='col-md-12 mb-3'>
            <Label>{t('rqf_current_status')}</Label>
            <Input
              name='rqf_current_status'
              type='select'
              placeholder={t('rqf_current_status')}
              onChange={(e) => {
                formik.handleChange(e);
                // Clear recommended amount when status changes from Recommend
                if (e.target.value !== "2") {
                  formik.setFieldValue('rqf_recommended_amount', 0);
                }
              }}
              onBlur={formik.handleBlur}
              value={formik.values.rqf_current_status}
              invalid={
                formik.touched.rqf_current_status && !!formik.errors.rqf_current_status
              }
            >
              <option value="">{t('select_status')}</option>
              <option value="2">{t('recommend')}</option>
              <option value="3">{t('reject')}</option>
            </Input>
            {formik.touched.rqf_current_status && formik.errors.rqf_current_status && (
              <FormFeedback type='invalid'>
                {formik.errors.rqf_current_status}
              </FormFeedback>
            )}
          </Col>
          {formik.values.rqf_current_status === "2" && (
            <Col className="col-md-12 mb-3">
              <Label>{t('rqf_recommended_amount')}</Label>
              <Input
                name='rqf_recommended_amount'
                type='number'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.rqf_recommended_amount}
                invalid={
                  formik.touched.rqf_recommended_amount && !!formik.errors.rqf_recommended_amount
                }
                min={0}
              />
              {formik.touched.rqf_recommended_amount && formik.errors.rqf_recommended_amount && (
                <FormFeedback type='invalid'>
                  {formik.errors.rqf_recommended_amount}
                </FormFeedback>
              )}
            </Col>
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