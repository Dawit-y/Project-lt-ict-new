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
  const { isOpen, toggle, transaction, budgetYearMap,budgetMonthMap,projectStatusMap } = props;
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
      <table>
  <tbody>
    <tr>
      <td>{t('prp_budget_year_id')}</td>
      <td className="text-primary">{budgetYearMap[transaction.prp_budget_year_id] || ""}</td>
    </tr>
    <tr>
      <td>{t('prp_budget_month_id')}</td>
      <td className="text-primary">{budgetMonthMap[transaction.prp_budget_month_id] || ""}</td>
    </tr>
    <tr>
      <td>{t('prp_project_status_id')}</td>
      <td className="text-primary">{projectStatusMap[transaction.prp_project_status_id] || ""}</td>
    </tr>
    <tr>
      <td>{t('prp_record_date_gc')}</td>
      <td className="text-primary">{transaction.prp_record_date_gc}</td>
    </tr>
    <tr>
      <td>{t('prp_total_budget_used')}</td>
      <td className="text-primary">{transaction.prp_total_budget_used ? new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(transaction.prp_total_budget_used)
    : "0.00"}</td>
    </tr>
    <tr>
      <td>{t('prp_physical_performance')}</td>
      <td className="text-primary">{transaction.prp_physical_performance}</td>
    </tr>
    <tr>
      <td>{t('prp_description')}</td>
      <td className="text-primary">{transaction.prp_description}</td>
    </tr>
  </tbody>
</table>

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
