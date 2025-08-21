import React, { useTransition } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { DetailsView } from "../../components/Common/DetailViewWrapper";

const modalStyle = {
  width: "100%",
  // height: '100%',
};

const PermissionModal = (props) => {
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
          <DetailsView details={transaction} />
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
PermissionModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};
export default PermissionModal;
