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
  CardTitle,
  Label,
  Input,
  InputGroup,
  FormGroup,
  Spinner,
} from "reactstrap";
import Select from "react-select";
import * as Yup from "yup";
import { useFormik } from "formik";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import { formatDate } from "../../utils/commonMethods";
import { useUpdateBudgetRequest } from "../../queries/budget_request_query";
import { toast } from "react-toastify";

const modalStyle = {
  width: "100%",
};

const ApproverBudgetRequestListModal = (props) => {
  const { t } = useTranslation();
  const { isOpen, toggle, transaction, budgetYearMap = {} } = props;
  const { mutateAsync, isPending } = useUpdateBudgetRequest();

  const statusOptions = [
    { label: "Approved", value: "Approved" },
    { label: "Rejected", value: "Rejected" },
  ];

  const getStatusOption = (value) =>
    statusOptions.find((option) => option.value === value) || null;

  const handleUpdateBudgetRequest = async (data) => {
    try {
      await mutateAsync(data);
      toast.success(`data updated successfully`, {
        autoClose: 2000,
      });
    } catch (error) {
      toast.error(`Failed to update Data`, {
        autoClose: 2000,
      });
    }
    toggle();
  };

  const validationSchema = Yup.object().shape({
    bdr_request_status: Yup.string().required("Status is required"),
    bdr_released_amount: Yup.number()
      .min(0, "Released amount must be greater or equal to 0")
      .max(
        transaction.bdr_requested_amount,
        "Can not release more than requested"
      )
      .when("bdr_request_status", {
        is: "Accepted",
        then: (schema) => schema.required("Released amount is required"),
        otherwise: (schema) => schema.optional(),
      }),
    bdr_released_date_gc: Yup.date().required("Action date is required"),
    bdr_action_remark: Yup.string().required("Action remark is required"),
  });
  const formik = useFormik({
    initialValues: {
      bdr_id: transaction.bdr_id || "",
      bdr_request_status: transaction.bdr_request_status || "",
      bdr_released_amount:
        transaction.bdr_request_status === "Approved"
          ? transaction.bdr_released_amount || ""
          : "",
      bdr_released_date_gc: transaction.bdr_released_date_gc || "",
      bdr_action_remark: transaction.bdr_action_remark || "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      handleUpdateBudgetRequest(values);
      formik.resetForm();
      toggle();
    },
  });

  const handleStatusChange = (selectedOption) => {
    formik.setFieldValue("bdr_request_status", selectedOption.value);
  };

  return (
    <Modal
      isOpen={isOpen}
      centered
      className="modal-xl"
      toggle={toggle}
      style={modalStyle}
    >
      <ModalHeader toggle={toggle}>{t("View Details")}</ModalHeader>
      <ModalBody>
        <Row>
          <Col xl={5}>
            <Card>
              <CardBody>
                <h5 className="fw-semibold">Overview</h5>
                <div className="table-responsive">
                  <table className="table">
                    <tbody>
                      <tr>
                        <th scope="col">{t("bdr_budget_year_id")}</th>
                        <td>{budgetYearMap[transaction.bdr_budget_year_id]}</td>
                      </tr>
                      <tr>
                        <th>{t("bdr_requested_amount")}</th>
                        <td>{transaction.bdr_requested_amount}</td>
                      </tr>
                      <tr>
                        <th>{t("bdr_requested_date_gc")}</th>
                        <td>{transaction.bdr_requested_date_gc}</td>
                      </tr>
                      <tr>
                        <th>{t("bdr_description")}</th>
                        <td>{transaction.bdr_description}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xl={7}>
            <Card>
              <CardBody>
                <CardTitle className="mb-4">Take Action</CardTitle>
                <form onSubmit={formik.handleSubmit}>
                  <FormGroup>
                    <Label>Status</Label>
                    <Select
                      name="bdr_request_status"
                      options={statusOptions}
                      value={getStatusOption(formik.values.bdr_request_status)}
                      onChange={handleStatusChange}
                      className="select2-selection"
                      invalid={
                        formik.touched.bdr_request_status &&
                          formik.errors.bdr_request_status
                          ? true
                          : false
                      }
                    />
                    {formik.errors.bdr_request_status &&
                      formik.touched.bdr_request_status && (
                        <div className="text-danger">
                          {formik.errors.bdr_request_status}
                        </div>
                      )}
                  </FormGroup>
                  {(formik.values.bdr_request_status === "Approved" ||
                    (transaction.bdr_request_status === "Approved" &&
                      transaction.bdr_released_amount)) && (
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
                              ? true
                              : false
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
                    <Label>Action Date</Label>
                    <InputGroup>
                      <Flatpickr
                        className={`form-control ${formik.touched.bdr_released_date_gc &&
                          formik.errors.bdr_released_date_gc
                          ? "is-invalid"
                          : ""
                          }`}
                        name="bdr_released_date_gc"
                        value={formik.values.bdr_released_date_gc}
                        onChange={(date) =>
                          formik.setFieldValue(
                            "bdr_released_date_gc",
                            formatDate(date[0])
                          )
                        }
                        options={{
                          altInput: true,
                          altFormat: "Y/m/d",
                          dateFormat: "Y/m/d",
                        }}
                      />
                    </InputGroup>
                    {formik.errors.bdr_released_date_gc &&
                      formik.touched.bdr_released_date_gc && (
                        <div className="text-danger">
                          {formik.errors.bdr_released_date_gc}
                        </div>
                      )}
                  </FormGroup>

                  <FormGroup>
                    <Label>Action Remark</Label>
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

                  {isPending ? (
                    <Button
                      type="submit"
                      color="primary"
                      className="w-md"
                      disabled
                    >
                      <span className="flex align-items-center justify-content-center">
                        <Spinner size={"sm"} />{" "}
                        <span className="ms-2">Submit</span>
                      </span>
                    </Button>
                  ) : (
                    <Button type="submit" color="primary" className="w-md">
                      Submit
                    </Button>
                  )}
                </form>
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
    </Modal>
  );
};

ApproverBudgetRequestListModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
  budgetYearMap: PropTypes.object,
};

export default ApproverBudgetRequestListModal;
