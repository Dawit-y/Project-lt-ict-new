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
} from "reactstrap";

const modalStyle = {
  width: "100%",
  height: "100%",
};

const ProjectEmployeeModal = (props) => {
  const { t } = useTranslation();
  const { isOpen, toggle, transaction } = props;

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
          <tr>
            <p className="mb-2">
              {t("emp_id_no")}:{" "}
              <span className="text-primary">{transaction.emp_id_no}</span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("emp_full_name")}:{" "}
              <span className="text-primary">{transaction.emp_full_name}</span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("emp_email")}:{" "}
              <span className="text-primary">{transaction.emp_email}</span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("emp_phone_num")}:{" "}
              <span className="text-primary">{transaction.emp_phone_num}</span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("emp_role")}:{" "}
              <span className="text-primary">{transaction.emp_role}</span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("emp_project_id")}:{" "}
              <span className="text-primary">{transaction.emp_project_id}</span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("emp_start_date_ec")}:{" "}
              <span className="text-primary">
                {transaction.emp_start_date_ec}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("emp_start_date_gc")}:{" "}
              <span className="text-primary">
                {transaction.emp_start_date_gc}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("emp_end_date_ec")}:{" "}
              <span className="text-primary">
                {transaction.emp_end_date_ec}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("emp_end_date_gc")}:{" "}
              <span className="text-primary">
                {transaction.emp_end_date_gc}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("emp_address")}:{" "}
              <span className="text-primary">{transaction.emp_address}</span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("emp_description")}:{" "}
              <span className="text-primary">
                {transaction.emp_description}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("emp_current_status")}:{" "}
              <span className="text-primary">
                {transaction.emp_current_status}
              </span>
            </p>
          </tr>
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
ProjectEmployeeModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};
export default ProjectEmployeeModal;
