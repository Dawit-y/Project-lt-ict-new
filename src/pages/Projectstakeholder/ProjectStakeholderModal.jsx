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

const ProjectStakeholderModal = (props) => {
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
            {t('psh_project_id')}: <span className="text-primary">{transaction.psh_project_id}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('psh_name')}: <span className="text-primary">{transaction.psh_name}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('psh_stakeholder_type')}: <span className="text-primary">{transaction.psh_stakeholder_type}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('psh_representative_name')}: <span className="text-primary">{transaction.psh_representative_name}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('psh_representative_phone')}: <span className="text-primary">{transaction.psh_representative_phone}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('psh_role')}: <span className="text-primary">{transaction.psh_role}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('psh_description')}: <span className="text-primary">{transaction.psh_description}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('psh_status')}: <span className="text-primary">{transaction.psh_status}</span>
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
ProjectStakeholderModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};
export default ProjectStakeholderModal;
