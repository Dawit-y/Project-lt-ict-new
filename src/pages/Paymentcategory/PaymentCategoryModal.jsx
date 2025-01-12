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
const PaymentCategoryModal = (props) => {
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
            {t('pyc_name_or')}: <span className="text-primary">{transaction.pyc_name_or}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('pyc_name_am')}: <span className="text-primary">{transaction.pyc_name_am}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('pyc_name_en')}: <span className="text-primary">{transaction.pyc_name_en}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('pyc_description')}: <span className="text-primary">{transaction.pyc_description}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('pyc_status')}: <span className="text-primary">{transaction.pyc_status}</span>
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
PaymentCategoryModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};
export default PaymentCategoryModal;