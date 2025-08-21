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

const ProjectBudgetSourceModal = (props) => {
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
              {t("bsr_name")}:{" "}
              <span className="text-primary">{transaction.bsr_name}</span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("bsr_project_id")}:{" "}
              <span className="text-primary">{transaction.bsr_project_id}</span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("bsr_budget_source_id")}:{" "}
              <span className="text-primary">
                {transaction.bsr_budget_source_id}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("bsr_amount")}:{" "}
              <span className="text-primary">{transaction.bsr_amount}</span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("bsr_status")}:{" "}
              <span className="text-primary">{transaction.bsr_status}</span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("bsr_description")}:{" "}
              <span className="text-primary">
                {transaction.bsr_description}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("bsr_created_date")}:{" "}
              <span className="text-primary">
                {transaction.bsr_created_date}
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
ProjectBudgetSourceModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};
export default ProjectBudgetSourceModal;
