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

const ProjectPerformanceModal = (props) => {
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
            {t('prp_project_id')}: <span className="text-primary">{transaction.prp_project_id}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('prp_project_status_id')}: <span className="text-primary">{transaction.prp_project_status_id}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('prp_record_date_ec')}: <span className="text-primary">{transaction.prp_record_date_ec}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('prp_record_date_gc')}: <span className="text-primary">{transaction.prp_record_date_gc}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('prp_total_budget_used')}: <span className="text-primary">{transaction.prp_total_budget_used}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('prp_physical_performance')}: <span className="text-primary">{transaction.prp_physical_performance}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('prp_description')}: <span className="text-primary">{transaction.prp_description}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('prp_status')}: <span className="text-primary">{transaction.prp_status}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('prp_created_date')}: <span className="text-primary">{transaction.prp_created_date}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('prp_termination_reason_id')}: <span className="text-primary">{transaction.prp_termination_reason_id}</span>
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
ProjectPerformanceModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};
export default ProjectPerformanceModal;
