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
};

const BudgetExipDetailModal = (props) => {
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
              {t("bed_budget_expenditure_id")}:{" "}
              <span className="text-primary">
                {transaction.bed_budget_expenditure_id}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("bed_budget_expenditure_code_id")}:{" "}
              <span className="text-primary">
                {transaction.bed_budget_expenditure_code_id}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("bed_amount")}:{" "}
              <span className="text-primary">{transaction.bed_amount}</span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("bed_description")}:{" "}
              <span className="text-primary">
                {transaction.bed_description}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("bed_status")}:{" "}
              <span className="text-primary">{transaction.bed_status}</span>
            </p>
          </tr>

          {transaction.is_deletable === 1 && (
            <p className="text-danger">data is deletable</p>
          )}

          {transaction.is_editable === 1 && (
            <p className="text-success">Editable</p>
          )}
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
BudgetExipDetailModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};
export default BudgetExipDetailModal;
