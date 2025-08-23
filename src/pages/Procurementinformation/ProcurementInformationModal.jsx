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

const ProcurementInformationModal = (props) => {
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
              {t("pri_total_procurement_amount")}:{" "}
              <span className="text-primary">
                {transaction.pri_total_procurement_amount}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("pri_bid_announced_date")}:{" "}
              <span className="text-primary">
                {transaction.pri_bid_announced_date}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("pri_bid_invitation_date")}:{" "}
              <span className="text-primary">
                {transaction.pri_bid_invitation_date}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("pri_bid_opening_date")}:{" "}
              <span className="text-primary">
                {transaction.pri_bid_opening_date}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("pri_bid_closing_date")}:{" "}
              <span className="text-primary">
                {transaction.pri_bid_closing_date}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("pri_bid_evaluation_date")}:{" "}
              <span className="text-primary">
                {transaction.pri_bid_evaluation_date}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("pri_bid_award_date")}:{" "}
              <span className="text-primary">
                {transaction.pri_bid_award_date}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("pri_procurement_stage_id")}:{" "}
              <span className="text-primary">
                {transaction.pri_procurement_stage_id}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("pri_procurement_method_id")}:{" "}
              <span className="text-primary">
                {transaction.pri_procurement_method_id}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("pri_description")}:{" "}
              <span className="text-primary">
                {transaction.pri_description}
              </span>
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
ProcurementInformationModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};
export default ProcurementInformationModal;
