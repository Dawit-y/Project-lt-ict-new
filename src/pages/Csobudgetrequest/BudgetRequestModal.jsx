import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Col,
  Spinner,
  Alert
} from "reactstrap";
import { DetailsView } from "../../components/Common/DetailViewWrapper";
import PrintMultipleTables from "../../components/Common/PrintMultipleTables";
const modalStyle = {
  width: "100%",
};
const BudgetRequestModal = ({ isOpen, toggle, transaction }) => {
  const { t } = useTranslation();
  const id = transaction?.bdr_id;
  return (
    <Modal isOpen={isOpen} centered className="modal-xl" toggle={toggle} style={modalStyle}>
      <ModalHeader toggle={toggle}>{t("View Details")}</ModalHeader>
      <ModalBody>
          <>
            <DetailsView
              details={transaction}
              keysToRemove={[
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
                "is_deletable",
                "color_code",
                "bdr_request_status"
              ]}
            />
          </>
      </ModalBody>
      <ModalFooter>
        <Col className="d-flex align-items-center justify-content-end gap-2">
          <Button color="secondary" onClick={toggle}>{t("Close")}</Button>
        </Col>
      </ModalFooter>
    </Modal>
  );
};
BudgetRequestModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};
export default BudgetRequestModal;