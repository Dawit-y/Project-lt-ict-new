import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table,
  Badge,
} from "reactstrap";

const modalStyle = {
  width: "100%",
  maxWidth: "1200px",
};

const PaymentCategoryModal = (props) => {
  const { t } = useTranslation();
  const { isOpen, toggle, transaction } = props;

  const renderBooleanBadge = (value) => {
    return value === 1 ? (
      <Badge color="success">{t("Yes")}</Badge>
    ) : (
      <Badge color="danger">{t("No")}</Badge>
    );
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
      <ModalHeader toggle={toggle}>
        <h4 className="modal-title">{t("View Details")}</h4>
      </ModalHeader>
      <ModalBody>
        <Table bordered size="sm" responsive className="table-details">
          <tbody>
            <tr>
              <th width="30%">{t("pyc_name_or")}</th>
              <td>{transaction.pyc_name_or || "-"}</td>
            </tr>
            <tr>
              <th>{t("pyc_name_am")}</th>
              <td>{transaction.pyc_name_am || "-"}</td>
            </tr>
            <tr>
              <th>{t("pyc_name_en")}</th>
              <td>{transaction.pyc_name_en || "-"}</td>
            </tr>
            <tr>
              <th>{t("pyc_description")}</th>
              <td>{transaction.pyc_description || "-"}</td>
            </tr>
            <tr>
              <th>{t("is_inactive")}</th>
              <td>
                {transaction.pyc_status !== undefined
                  ? renderBooleanBadge(transaction.pyc_status)
                  : "-"}
              </td>
            </tr>
          </tbody>
        </Table>
      </ModalBody>
      <ModalFooter className="border-top-0">
        <Button color="secondary" onClick={toggle} className="px-4">
          {t("Close")}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

PaymentCategoryModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};

export default PaymentCategoryModal;
