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
import { DetailsView } from "../../components/Common/DetailViewWrapper";

const modalStyle = {
  width: "100%",
};

const RequestFollowupModal = (props) => {
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
          <DetailsView
            details={transaction}
            keysToRemove={[
              "is_editable",
              "is_deletable",
              "is_role_editable",
              "is_role_deletable",
              "rqf_create_time",
              "rqf_update_time",
              "rqf_delete_time",
              "rqf_created_by",
              "rqf_id",
              "rqf_status",
            ]}
          />
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
RequestFollowupModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};
export default RequestFollowupModal;
