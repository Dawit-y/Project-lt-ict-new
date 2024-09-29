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

const UsersModal = (props) => {
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
            {t('usr_email')}: <span className="text-primary">{transaction.usr_email}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('usr_password')}: <span className="text-primary">{transaction.usr_password}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('usr_full_name')}: <span className="text-primary">{transaction.usr_full_name}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('usr_phone_number')}: <span className="text-primary">{transaction.usr_phone_number}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('usr_role_id')}: <span className="text-primary">{transaction.usr_role_id}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('usr_region_id')}: <span className="text-primary">{transaction.usr_region_id}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('usr_zone_id')}: <span className="text-primary">{transaction.usr_zone_id}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('usr_woreda_id')}: <span className="text-primary">{transaction.usr_woreda_id}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('usr_kebele_id')}: <span className="text-primary">{transaction.usr_kebele_id}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('usr_sector_id')}: <span className="text-primary">{transaction.usr_sector_id}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('usr_department_id')}: <span className="text-primary">{transaction.usr_department_id}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('usr_is_active')}: <span className="text-primary">{transaction.usr_is_active}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('usr_picture')}: <span className="text-primary">{transaction.usr_picture}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('usr_last_logged_in')}: <span className="text-primary">{transaction.usr_last_logged_in}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('usr_ip')}: <span className="text-primary">{transaction.usr_ip}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('usr_remember_token')}: <span className="text-primary">{transaction.usr_remember_token}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('usr_notified')}: <span className="text-primary">{transaction.usr_notified}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('usr_description')}: <span className="text-primary">{transaction.usr_description}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('usr_status')}: <span className="text-primary">{transaction.usr_status}</span>
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
UsersModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};
export default UsersModal;
