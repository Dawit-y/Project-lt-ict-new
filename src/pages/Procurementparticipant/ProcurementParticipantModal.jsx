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

const ProcurementParticipantModal = (props) => {
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
    >
      <div className="modal-xl">
        <ModalHeader toggle={toggle}>{t("View Details")}</ModalHeader>
        <ModalBody>
          <tr>
            <p className="mb-2">
              {t("ppp_name_or")}:{" "}
              <span className="text-primary">{transaction.ppp_name_or}</span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("ppp_name_en")}:{" "}
              <span className="text-primary">{transaction.ppp_name_en}</span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("ppp_name_am")}:{" "}
              <span className="text-primary">{transaction.ppp_name_am}</span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("ppp_tin_number")}:{" "}
              <span className="text-primary">{transaction.ppp_tin_number}</span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("ppp_participant_phone_number")}:{" "}
              <span className="text-primary">
                {transaction.ppp_participant_phone_number}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("ppp_participant_email")}:{" "}
              <span className="text-primary">
                {transaction.ppp_participant_email}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("ppp_participant_address")}:{" "}
              <span className="text-primary">
                {transaction.ppp_participant_address}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("ppp_description")}:{" "}
              <span className="text-primary">
                {transaction.ppp_description}
              </span>
            </p>
          </tr>
          {transaction.is_deletable === 1 && (
            <p className="text-danger">{t("is_deletable")}</p>
          )}

          {transaction.is_editable === 1 && (
            <p className="text-success">{t("is_editable")}</p>
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
ProcurementParticipantModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};
export default ProcurementParticipantModal;
