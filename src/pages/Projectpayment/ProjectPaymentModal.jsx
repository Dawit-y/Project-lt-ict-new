import React, { useTransition } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table,
  Card,
  CardBody,
  Col,
  Row,
} from "reactstrap";

const modalStyle = {
  width: "100%",
  height: "100%",
};

const ProjectPaymentModal = (props) => {
  const { t } = useTranslation();
  const { isOpen, toggle, transaction } = props;
  const formattedAmount = transaction.prp_payment_amount
    ? transaction.prp_payment_amount.toLocaleString()
    : "N/A"; // Adds commas

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
        {/* <ModalBody>
        <tr>
                    <p className="mb-2">
            {t('prp_project_id')}: <span className="text-primary">{transaction.prp_project_id}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('prp_type')}: <span className="text-primary">{transaction.prp_type}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('prp_payment_date_et')}: <span className="text-primary">{transaction.prp_payment_date_et}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('prp_payment_date_gc')}: <span className="text-primary">{transaction.prp_payment_date_gc}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('prp_payment_amount')}: <span className="text-primary">{transaction.prp_payment_amount}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('prp_payment_percentage')}: <span className="text-primary">{transaction.prp_payment_percentage}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('prp_description')}: <span className="text-primary">{transaction.prp_description}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('prp_status')}: <span className="text-primary">{transaction.prp_status}</span>
          </p>
          </tr>

          {transaction.is_deletable === 1 && (
            <p className="text-danger">data is deletable</p>
          )}
          
          {transaction.is_editable === 1 && (
            <p className="text-success">Editable</p>
          )}
        </ModalBody> */}
        <ModalBody>
          <div className="d-flex">
            <div className="flex-grow-1 overflow-hidden">
              <h5 className="text-truncate font-size-15">
                Description of the Payment
              </h5>
              <p className="text-muted">{transaction.prp_description}</p>
            </div>
          </div>

          <h5 className="font-size-15 mt-4">Project Details</h5>

          <div className="text-muted mt-4">
            <Table className="table-nowrap mb-0">
              <tbody>
                <tr>
                  <th scope="row">Payment Type :</th>
                  <td>{transaction.prp_type}</td>
                </tr>
                <tr>
                  <th scope="row">Payment Amount :</th>
                  <td>
                    {formattedAmount}
                    {" ETB"}
                  </td>
                </tr>
                <tr>
                  <th scope="row">Percentage :</th>
                  <td>
                    {transaction.prp_payment_percentage}
                    {" %"}
                  </td>
                </tr>
                <tr>
                  <th scope="row">Project Payment Status :</th>
                  <td>{transaction.prp_status}</td>
                </tr>
                <tr>
                  <th scope="row">Is Deleteable :</th>
                  <td className="text-danger">
                    {transaction.is_deletable === 1 && "Data is deletable"}
                  </td>
                </tr>
                <tr>
                  <th scope="row">Is Editable :</th>
                  <td className="text-success">
                    {transaction.is_editable === 1 && "Editable"}
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>

          <Row className="task-dates justify-content-center">
            <Col sm="4" xs="6">
              <div className="mt-4 text-center">
                <h5 className="font-size-14">
                  <i className="bx bx-calendar me-1 text-primary" /> Date In
                  Ethoiopian Calender
                </h5>
                <p className="text-muted mb-0">
                  {transaction.prp_payment_date_et}
                </p>
              </div>
            </Col>

            <Col sm="4" xs="6">
              <div className="mt-4 text-center">
                <h5 className="font-size-14">
                  <i className="bx bx-calendar-check me-1 text-primary" />
                  Date In Gregorian Calender
                </h5>
                <p className="text-muted mb-0">
                  {transaction.prp_payment_date_gc}
                </p>
              </div>
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
ProjectPaymentModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};
export default ProjectPaymentModal;
