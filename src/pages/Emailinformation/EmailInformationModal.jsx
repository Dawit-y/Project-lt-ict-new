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

const EmailInformationModal = (props) => {
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
              {t("emi_email_template_id")}:{" "}
              <span className="text-primary">
                {transaction.emi_email_template_id}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("emi_sent_to")}:{" "}
              <span className="text-primary">{transaction.emi_sent_to}</span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("emi_sent_date")}:{" "}
              <span className="text-primary">{transaction.emi_sent_date}</span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("emi_email_content")}:{" "}
              <span className="text-primary">
                {transaction.emi_email_content}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("emi_description")}:{" "}
              <span className="text-primary">
                {transaction.emi_description}
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
EmailInformationModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};
export default EmailInformationModal;
