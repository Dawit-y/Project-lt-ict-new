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

const AddressStructureModal = (props) => {
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
            {t('add_name_or')}: <span className="text-primary">{transaction.add_name_or}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('add_name_am')}: <span className="text-primary">{transaction.add_name_am}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('add_name_en')}: <span className="text-primary">{transaction.add_name_en}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('add_type')}: <span className="text-primary">{transaction.add_type}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('add_parent_id')}: <span className="text-primary">{transaction.add_parent_id}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('add_phone')}: <span className="text-primary">{transaction.add_phone}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('add_description')}: <span className="text-primary">{transaction.add_description}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('add_status')}: <span className="text-primary">{transaction.add_status}</span>
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
AddressStructureModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};
export default AddressStructureModal;
