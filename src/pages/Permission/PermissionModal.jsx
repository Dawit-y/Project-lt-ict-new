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

const modalStyle = {
  width: '100%',
  height: '100%',
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
        <tr>
                    <p className="mb-2">
            {t('pem_page_id')}: <span className="text-primary">{transaction.pem_page_id}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('pem_role_id')}: <span className="text-primary">{transaction.pem_role_id}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('pem_enabled')}: <span className="text-primary">{transaction.pem_enabled}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('pem_edit')}: <span className="text-primary">{transaction.pem_edit}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('pem_insert')}: <span className="text-primary">{transaction.pem_insert}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('pem_view')}: <span className="text-primary">{transaction.pem_view}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('pem_delete')}: <span className="text-primary">{transaction.pem_delete}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('pem_show')}: <span className="text-primary">{transaction.pem_show}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('pem_search')}: <span className="text-primary">{transaction.pem_search}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('pem_description')}: <span className="text-primary">{transaction.pem_description}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('pem_status')}: <span className="text-primary">{transaction.pem_status}</span>
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
            {t('Close')}
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
