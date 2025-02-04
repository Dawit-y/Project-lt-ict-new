import React, { useMemo } from "react";
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
import { parseISO, format } from "date-fns";

const modalStyle = {
  width: "100%",
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return format(parseISO(dateString), "PP");
};

const RolesModal = (props) => {
  const { t } = useTranslation();
  const { isOpen, toggle, transaction } = props;

  const updatedTransaction = {
    ...transaction,
    rol_create_time: formatDate(transaction?.rol_create_time),
    rol_update_time: formatDate(transaction?.rol_update_time),
  };

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
            details={updatedTransaction}
            keysToRemove={[
              "rol_id",
              "rol_delete_time",
              "rol_created_by",
              "rol_status",
              "is_editable",
              "is_deletable",
              "total_count",
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
RolesModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};
export default RolesModal;