import React, { useTransition } from "react"
import PropTypes from "prop-types"
import { useTranslation } from "react-i18next";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table,
} from "reactstrap"
import { DetailsView } from "../../components/Common/DetailViewWrapper";

const modalStyle = {
  width: '100%',
};

const BudgetRequestModal = (props) => {
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
            keysToRemove={
              [
                "bdr_id",
                "bdr_project_id",
                "bdr_released_date_ec",
                "bdr_requested_date_ec",
                "bdr_create_time",
                "bdr_update_time",
                "bdr_delete_time",
                "bdr_action_remark",
                "bdr_status",
                "bdr_created_by",
                "is_editable",
                "is_deletable"
              ]
            }
          />
        </ModalBody>
        <ModalFooter>
          <Button type="button" color="secondary" onClick={toggle}>
            {t('Close')}
          </Button>
        </ModalFooter>
      </div>
    </Modal>
  );
};
BudgetRequestModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};
export default BudgetRequestModal;
