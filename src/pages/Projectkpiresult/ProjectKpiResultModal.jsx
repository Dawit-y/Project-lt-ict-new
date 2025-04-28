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

const ProjectKpiResultModal = (props) => {
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
            {t('kpr_project_id')}: <span className="text-primary">{transaction.kpr_project_id}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('kpr_project_kpi_id')}: <span className="text-primary">{transaction.kpr_project_kpi_id}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('kpr_year_id')}: <span className="text-primary">{transaction.kpr_year_id}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('kpr_planned_month_1')}: <span className="text-primary">{transaction.kpr_planned_month_1}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('kpr_actual_month_1')}: <span className="text-primary">{transaction.kpr_actual_month_1}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('kpr_planned_month_2')}: <span className="text-primary">{transaction.kpr_planned_month_2}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('kpr_actual_month_2')}: <span className="text-primary">{transaction.kpr_actual_month_2}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('kpr_planned_month_3')}: <span className="text-primary">{transaction.kpr_planned_month_3}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('kpr_actual_month_3')}: <span className="text-primary">{transaction.kpr_actual_month_3}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('kpr_planned_month_4')}: <span className="text-primary">{transaction.kpr_planned_month_4}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('kpr_actual_month_4')}: <span className="text-primary">{transaction.kpr_actual_month_4}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('kpr_planned_month_5')}: <span className="text-primary">{transaction.kpr_planned_month_5}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('kpr_actual_month_5')}: <span className="text-primary">{transaction.kpr_actual_month_5}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('kpr_planned_month_6')}: <span className="text-primary">{transaction.kpr_planned_month_6}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('kpr_actual_month_6')}: <span className="text-primary">{transaction.kpr_actual_month_6}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('kpr_planned_month_7')}: <span className="text-primary">{transaction.kpr_planned_month_7}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('kpr_actual_month_7')}: <span className="text-primary">{transaction.kpr_actual_month_7}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('kpr_planned_month_8')}: <span className="text-primary">{transaction.kpr_planned_month_8}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('kpr_actual_month_8')}: <span className="text-primary">{transaction.kpr_actual_month_8}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('kpr_planned_month_9')}: <span className="text-primary">{transaction.kpr_planned_month_9}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('kpr_actual_month_9')}: <span className="text-primary">{transaction.kpr_actual_month_9}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('kpr_planned_month_10')}: <span className="text-primary">{transaction.kpr_planned_month_10}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('kpr_actual_month_10')}: <span className="text-primary">{transaction.kpr_actual_month_10}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('kpr_planned_month_11')}: <span className="text-primary">{transaction.kpr_planned_month_11}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('kpr_actual_month_11')}: <span className="text-primary">{transaction.kpr_actual_month_11}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('kpr_planned_month_12')}: <span className="text-primary">{transaction.kpr_planned_month_12}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('kpr_actual_month_12')}: <span className="text-primary">{transaction.kpr_actual_month_12}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('kpr_description')}: <span className="text-primary">{transaction.kpr_description}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('kpr_status')}: <span className="text-primary">{transaction.kpr_status}</span>
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
ProjectKpiResultModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};
export default ProjectKpiResultModal;
