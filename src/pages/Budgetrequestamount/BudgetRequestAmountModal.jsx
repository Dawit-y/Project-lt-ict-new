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

const BudgetRequestAmountModal = (props) => {
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
            {t('bra_expenditure_code_id')}: <span className="text-primary">{transaction.bra_expenditure_code_id}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('bra_budget_request_id')}: <span className="text-primary">{transaction.bra_budget_request_id}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('bra_current_year_expense')}: <span className="text-primary">{transaction.bra_current_year_expense}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('bra_requested_amount')}: <span className="text-primary">{transaction.bra_requested_amount}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('bra_approved_amount')}: <span className="text-primary">{transaction.bra_approved_amount}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('bra_source_government_requested')}: <span className="text-primary">{transaction.bra_source_government_requested}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('bra_source_government_approved')}: <span className="text-primary">{transaction.bra_source_government_approved}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('bra_source_internal_requested')}: <span className="text-primary">{transaction.bra_source_internal_requested}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('bra_source_internal_approved')}: <span className="text-primary">{transaction.bra_source_internal_approved}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('bra_source_support_requested')}: <span className="text-primary">{transaction.bra_source_support_requested}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('bra_source_support_approved')}: <span className="text-primary">{transaction.bra_source_support_approved}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('bra_source_support_code')}: <span className="text-primary">{transaction.bra_source_support_code}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('bra_source_credit_requested')}: <span className="text-primary">{transaction.bra_source_credit_requested}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('bra_source_credit_approved')}: <span className="text-primary">{transaction.bra_source_credit_approved}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('bra_source_credit_code')}: <span className="text-primary">{transaction.bra_source_credit_code}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('bra_source_other_requested')}: <span className="text-primary">{transaction.bra_source_other_requested}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('bra_source_other_approved')}: <span className="text-primary">{transaction.bra_source_other_approved}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('bra_source_other_code')}: <span className="text-primary">{transaction.bra_source_other_code}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('bra_requested_date')}: <span className="text-primary">{transaction.bra_requested_date}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('bra_approved_date')}: <span className="text-primary">{transaction.bra_approved_date}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('bra_description')}: <span className="text-primary">{transaction.bra_description}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('bra_status')}: <span className="text-primary">{transaction.bra_status}</span>
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
BudgetRequestAmountModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};
export default BudgetRequestAmountModal;
