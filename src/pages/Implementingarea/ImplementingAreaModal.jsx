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

const ImplementingAreaModal = (props) => {
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
              {t("pia_project_id")}:{" "}
              <span className="text-primary">{transaction.pia_project_id}</span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("pia_region_id")}:{" "}
              <span className="text-primary">{transaction.pia_region_id}</span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("pia_zone_id_id")}:{" "}
              <span className="text-primary">{transaction.pia_zone_id_id}</span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("pia_woreda_id")}:{" "}
              <span className="text-primary">{transaction.pia_woreda_id}</span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("pia_sector_id")}:{" "}
              <span className="text-primary">{transaction.pia_sector_id}</span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("pia_budget_amount")}:{" "}
              <span className="text-primary">
                {transaction.pia_budget_amount}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("pia_site")}:{" "}
              <span className="text-primary">{transaction.pia_site}</span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("pia_geo_location")}:{" "}
              <span className="text-primary">
                {transaction.pia_geo_location}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("pia_description")}:{" "}
              <span className="text-primary">
                {transaction.pia_description}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("pia_status")}:{" "}
              <span className="text-primary">{transaction.pia_status}</span>
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
ImplementingAreaModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};
export default ImplementingAreaModal;
