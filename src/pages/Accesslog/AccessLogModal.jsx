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

const AccessLogModal = (props) => {
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
            {t('acl_ip')}: <span className="text-primary">{transaction.acl_ip}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('acl_user_id')}: <span className="text-primary">{transaction.acl_user_id}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('acl_role_id')}: <span className="text-primary">{transaction.acl_role_id}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('acl_object_name')}: <span className="text-primary">{transaction.acl_object_name}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('acl_object_id')}: <span className="text-primary">{transaction.acl_object_id}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('acl_remark')}: <span className="text-primary">{transaction.acl_remark}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('acl_detail')}: <span className="text-primary">{transaction.acl_detail}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('acl_object_action')}: <span className="text-primary">{transaction.acl_object_action}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('acl_description')}: <span className="text-primary">{transaction.acl_description}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('acl_status')}: <span className="text-primary">{transaction.acl_status}</span>
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
AccessLogModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};
export default AccessLogModal;
