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

const ProjectMonitoringEvaluationModal = (props) => {
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
            {t('mne_transaction_type_id')}: <span className="text-primary">{transaction.mne_transaction_type_id}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('mne_visit_type')}: <span className="text-primary">{transaction.mne_visit_type}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('mne_project_id')}: <span className="text-primary">{transaction.mne_project_id}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('mne_type_id')}: <span className="text-primary">{transaction.mne_type_id}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('mne_physical')}: <span className="text-primary">{transaction.mne_physical}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('mne_financial')}: <span className="text-primary">{transaction.mne_financial}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('mne_physical_region')}: <span className="text-primary">{transaction.mne_physical_region}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('mne_financial_region')}: <span className="text-primary">{transaction.mne_financial_region}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('mne_team_members')}: <span className="text-primary">{transaction.mne_team_members}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('mne_feedback')}: <span className="text-primary">{transaction.mne_feedback}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('mne_weakness')}: <span className="text-primary">{transaction.mne_weakness}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('mne_challenges')}: <span className="text-primary">{transaction.mne_challenges}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('mne_recommendations')}: <span className="text-primary">{transaction.mne_recommendations}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('mne_purpose')}: <span className="text-primary">{transaction.mne_purpose}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('mne_record_date')}: <span className="text-primary">{transaction.mne_record_date}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('mne_start_date')}: <span className="text-primary">{transaction.mne_start_date}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('mne_end_date')}: <span className="text-primary">{transaction.mne_end_date}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('mne_description')}: <span className="text-primary">{transaction.mne_description}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('mne_status')}: <span className="text-primary">{transaction.mne_status}</span>
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
ProjectMonitoringEvaluationModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};
export default ProjectMonitoringEvaluationModal;
