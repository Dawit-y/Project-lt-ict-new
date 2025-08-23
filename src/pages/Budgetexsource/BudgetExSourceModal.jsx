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

const BudgetExSourceModal = (props) => {
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
              {t("bes_budget_request_id")}:{" "}
              <span className="text-primary">
                {transaction.bes_budget_request_id}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("bes_organ_code")}:{" "}
              <span className="text-primary">{transaction.bes_organ_code}</span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("bes_org_name")}:{" "}
              <span className="text-primary">{transaction.bes_org_name}</span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("bes_support_amount")}:{" "}
              <span className="text-primary">
                {transaction.bes_support_amount}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("bes_credit_amount")}:{" "}
              <span className="text-primary">
                {transaction.bes_credit_amount}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("bes_description")}:{" "}
              <span className="text-primary">
                {transaction.bes_description}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("bes_status")}:{" "}
              <span className="text-primary">{transaction.bes_status}</span>
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
BudgetExSourceModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};
export default BudgetExSourceModal;
