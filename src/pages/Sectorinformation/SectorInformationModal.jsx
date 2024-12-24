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

const SectorInformationModal = (props) => {
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
            {t('sci_name_or')}: <span className="text-primary">{transaction.sci_name_or}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('sci_name_am')}: <span className="text-primary">{transaction.sci_name_am}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('sci_name_en')}: <span className="text-primary">{transaction.sci_name_en}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('sci_code')}: <span className="text-primary">{transaction.sci_code}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('sci_sector_category_id')}: <span className="text-primary">{transaction.sci_sector_category_id}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('sci_available_at_region')}: <span className="text-primary">{transaction.sci_available_at_region}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('sci_available_at_zone')}: <span className="text-primary">{transaction.sci_available_at_zone}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('sci_available_at_woreda')}: <span className="text-primary">{transaction.sci_available_at_woreda}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('sci_description')}: <span className="text-primary">{transaction.sci_description}</span>
          </p>
          </tr>
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
SectorInformationModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};
export default SectorInformationModal;
