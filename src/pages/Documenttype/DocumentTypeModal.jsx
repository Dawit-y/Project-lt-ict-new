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

const DocumentTypeModal = (props) => {
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
      <ModalHeader toggle={toggle} className="">
        <h4 className="modal-title">{t("view_details")}</h4>
      </ModalHeader>
      <ModalBody>
        <Table bordered size="sm" responsive className="table-details">
          <tbody>
            <tr>
              <th width="30%">{t("pdt_doc_name_or")}</th>
              <td>{transaction.pdt_doc_name_or || "-"}</td>
            </tr>
            <tr>
              <th>{t("pdt_doc_name_am")}</th>
              <td>{transaction.pdt_doc_name_am || "-"}</td>
            </tr>
            <tr>
              <th>{t("pdt_doc_name_en")}</th>
              <td>{transaction.pdt_doc_name_en || "-"}</td>
            </tr>
            <tr>
              <th>{t("pdt_code")}</th>
              <td>
                <span className="text-primary font-weight-bold">
                  {transaction.pdt_code || "-"}
                </span>
              </td>
            </tr>
            <tr>
              <th>{t("pdt_description")}</th>
              <td>{transaction.pdt_description || "-"}</td>
            </tr>
            <tr>
              <th>{t("is_inactive")}</th>
              <td>{renderBooleanBadge(transaction.pdt_status)}</td>
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

DocumentTypeModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};

export default DocumentTypeModal;
