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

const BudgetSourceModal = (props) => {
  const { t } = useTranslation();
  const { isOpen, toggle, transaction,pageTitle } = props;
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
        <ModalHeader toggle={toggle}>{t("View Details")} : {pageTitle}</ModalHeader>
        <ModalBody>
        <tr><td><p className="mb-2">
            {t('pbs_name_or')}: </p></td><td><span className="text-primary">{transaction.pbs_name_or}</span></td>
          </tr><tr><td><p className="mb-2">
            {t('pbs_name_am')}: </p></td><td><span className="text-primary">{transaction.pbs_name_am}</span></td>        
          </tr><tr><td><p className="mb-2">
            {t('pbs_name_en')}: </p></td><td><span className="text-primary">{transaction.pbs_name_en}</span></td>         
          </tr><tr><td><p className="mb-2">
            {t('pbs_code')}: </p></td><td><span className="text-primary">{transaction.pbs_code}</span></td>        
          </tr><tr><td><p className="mb-2">
            {t('pbs_description')}: </p></td><td><span className="text-primary">{transaction.pbs_description}</span></td>        
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
BudgetSourceModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};
export default BudgetSourceModal;
