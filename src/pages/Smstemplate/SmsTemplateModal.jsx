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

const SmsTemplateModal = (props) => {
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
              {t("smt_template_name")}:{" "}
              <span className="text-primary">
                {transaction.smt_template_name}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("smt_template_content")}:{" "}
              <span className="text-primary">
                {transaction.smt_template_content}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("smt_description")}:{" "}
              <span className="text-primary">
                {transaction.smt_description}
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
SmsTemplateModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};
export default SmsTemplateModal;
