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

const DateSettingModal = (props) => {
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
              {t("dts_parameter_name")}:{" "}
              <span className="text-primary">
                {transaction.dts_parameter_name}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("dts_parameter_code")}:{" "}
              <span className="text-primary">
                {transaction.dts_parameter_code}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("dts_start_date")}:{" "}
              <span className="text-primary">{transaction.dts_start_date}</span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("dts_end_date")}:{" "}
              <span className="text-primary">{transaction.dts_end_date}</span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("dts_description")}:{" "}
              <span className="text-primary">
                {transaction.dts_description}
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
DateSettingModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};
export default DateSettingModal;
