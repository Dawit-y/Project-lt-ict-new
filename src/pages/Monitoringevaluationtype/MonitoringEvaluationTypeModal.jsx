import React from "react"
import PropTypes from "prop-types"
import { useTranslation } from "react-i18next";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table,
  Badge
} from "reactstrap"

const modalStyle = {
  width: '100%',
  maxWidth: '1200px',
};

const MonitoringEvaluationTypeModal = (props) => {
  const { t } = useTranslation();
  const { isOpen, toggle, transaction } = props;

  const renderBooleanBadge = (value) => {
    return value === 1 ? (
      <Badge color="success">{t('Yes')}</Badge>
    ) : (
      <Badge color="danger">{t('No')}</Badge>
    );
  };

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
      <ModalHeader toggle={toggle} className="">
        <h4 className="modal-title">{t("Monitoring & Evaluation Type Details")}</h4>
      </ModalHeader>
      <ModalBody>
        <Table bordered size="sm" responsive className="table-details">
          <tbody>
            <tr>
              <th width="30%">{t('Name (OR)')}</th>
              <td>{transaction.met_name_or || '-'}</td>
            </tr>
            <tr>
              <th>{t('Name (AM)')}</th>
              <td>{transaction.met_name_am || '-'}</td>
            </tr>
            <tr>
              <th>{t('Name (EN)')}</th>
              <td>{transaction.met_name_en || '-'}</td>
            </tr>
            <tr>
              <th>{t('Code')}</th>
              <td>
                <span className="text-primary font-weight-bold">
                  {transaction.met_code || '-'}
                </span>
              </td>
            </tr>
            <tr>
              <th>{t('Description')}</th>
              <td>{transaction.met_description || '-'}</td>
            </tr>
            <tr>
              <th>{t('Government Active')}</th>
              <td>{renderBooleanBadge(transaction.met_gov_active)}</td>
            </tr>
            <tr>
              <th>{t('CSO Active')}</th>
              <td>{renderBooleanBadge(transaction.met_cso_active)}</td>
            </tr>
            <tr>
              <th>{t('Monitoring Active')}</th>
              <td>{renderBooleanBadge(transaction.met_monitoring_active)}</td>
            </tr>
            <tr>
              <th>{t('Evaluation Active')}</th>
              <td>{renderBooleanBadge(transaction.met_evaluation_active)}</td>
            </tr>
          </tbody>
        </Table>
      </ModalBody>
      <ModalFooter className="border-top-0">
        <Button color="secondary" onClick={toggle} className="px-4">
          {t('Close')}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

MonitoringEvaluationTypeModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};

export default MonitoringEvaluationTypeModal;