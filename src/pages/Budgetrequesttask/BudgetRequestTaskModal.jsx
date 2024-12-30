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

const BudgetRequestTaskModal = (props) => {
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
            {t('brt_task_name')}: <span className="text-primary">{transaction.brt_task_name}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('brt_measurement')}: <span className="text-primary">{transaction.brt_measurement}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('brt_budget_request_id')}: <span className="text-primary">{transaction.brt_budget_request_id}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('brt_previous_year_physical')}: <span className="text-primary">{transaction.brt_previous_year_physical}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('brt_previous_year_financial')}: <span className="text-primary">{transaction.brt_previous_year_financial}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('brt_current_year_physical')}: <span className="text-primary">{transaction.brt_current_year_physical}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('brt_current_year_financial')}: <span className="text-primary">{transaction.brt_current_year_financial}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('brt_next_year_physical')}: <span className="text-primary">{transaction.brt_next_year_physical}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('brt_next_year_financial')}: <span className="text-primary">{transaction.brt_next_year_financial}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('brt_description')}: <span className="text-primary">{transaction.brt_description}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('brt_status')}: <span className="text-primary">{transaction.brt_status}</span>
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
BudgetRequestTaskModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};
export default BudgetRequestTaskModal;
