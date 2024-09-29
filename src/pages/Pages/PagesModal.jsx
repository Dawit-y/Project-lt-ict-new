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

const PagesModal = (props) => {
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
            {t('pag_name')}: <span className="text-primary">{transaction.pag_name}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('pag_controller')}: <span className="text-primary">{transaction.pag_controller}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('pag_modifying_days')}: <span className="text-primary">{transaction.pag_modifying_days}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('pag_is_deletable')}: <span className="text-primary">{transaction.pag_is_deletable}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('pag_display_record_no')}: <span className="text-primary">{transaction.pag_display_record_no}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('pag_system_module')}: <span className="text-primary">{transaction.pag_system_module}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('pag_header')}: <span className="text-primary">{transaction.pag_header}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('pag_footer')}: <span className="text-primary">{transaction.pag_footer}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('pag_rule')}: <span className="text-primary">{transaction.pag_rule}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('pag_description')}: <span className="text-primary">{transaction.pag_description}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('pag_status')}: <span className="text-primary">{transaction.pag_status}</span>
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
PagesModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};
export default PagesModal;
