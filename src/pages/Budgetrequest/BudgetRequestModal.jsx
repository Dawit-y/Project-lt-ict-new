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

const BudgetRequestModal = (props) => {
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
            {t('bdr_budget_year_id')}: <span className="text-primary">{transaction.bdr_budget_year_id}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('bdr_requested_amount')}: <span className="text-primary">{transaction.bdr_requested_amount}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('bdr_released_amount')}: <span className="text-primary">{transaction.bdr_released_amount}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('bdr_requested_date_gc')}: <span className="text-primary">{transaction.bdr_requested_date_gc}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('bdr_released_date_gc')}: <span className="text-primary">{transaction.bdr_released_date_gc}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('bdr_description')}: <span className="text-primary">{transaction.bdr_description}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('bdr_status')}: <span className="text-primary">{transaction.bdr_request_status}</span>
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
BudgetRequestModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};
export default BudgetRequestModal;
