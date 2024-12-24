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

const ProjectPlanModal = (props) => {
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
            {t('pld_name')}: <span className="text-primary">{transaction.pld_name}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('pld_project_id')}: <span className="text-primary">{transaction.pld_project_id}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('pld_budget_year_id')}: <span className="text-primary">{transaction.pld_budget_year_id}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('pld_start_date_ec')}: <span className="text-primary">{transaction.pld_start_date_ec}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('pld_start_date_gc')}: <span className="text-primary">{transaction.pld_start_date_gc}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('pld_end_date_ec')}: <span className="text-primary">{transaction.pld_end_date_ec}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('pld_end_date_gc')}: <span className="text-primary">{transaction.pld_end_date_gc}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('pld_description')}: <span className="text-primary">{transaction.pld_description}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('pld_status')}: <span className="text-primary">{transaction.pld_status}</span>
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
ProjectPlanModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};
export default ProjectPlanModal;