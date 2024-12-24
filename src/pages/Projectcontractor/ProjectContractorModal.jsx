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

const ProjectContractorModal = (props) => {
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
            {t('cni_name')}: <span className="text-primary">{transaction.cni_name}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('cni_tin_num')}: <span className="text-primary">{transaction.cni_tin_num}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('cni_contractor_type')}: <span className="text-primary">{transaction.cni_contractor_type}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('cni_vat_num')}: <span className="text-primary">{transaction.cni_vat_num}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('cni_total_contract_price')}: <span className="text-primary">{transaction.cni_total_contract_price}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('cni_contract_start_date_gc')}: <span className="text-primary">{transaction.cni_contract_start_date_gc}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('cni_contract_end_date_gc')}: <span className="text-primary">{transaction.cni_contract_end_date_gc}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('cni_contact_person')}: <span className="text-primary">{transaction.cni_contact_person}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('cni_phone_number')}: <span className="text-primary">{transaction.cni_phone_number}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('cni_address')}: <span className="text-primary">{transaction.cni_address}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('cni_email')}: <span className="text-primary">{transaction.cni_email}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('cni_website')}: <span className="text-primary">{transaction.cni_website}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('cni_procrument_method')}: <span className="text-primary">{transaction.cni_procrument_method}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('cni_bid_invitation_date')}: <span className="text-primary">{transaction.cni_bid_invitation_date}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('cni_bid_opening_date')}: <span className="text-primary">{transaction.cni_bid_opening_date}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('cni_bid_evaluation_date')}: <span className="text-primary">{transaction.cni_bid_evaluation_date}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('cni_bid_award_date')}: <span className="text-primary">{transaction.cni_bid_award_date}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('cni_bid_contract_signing_date')}: <span className="text-primary">{transaction.cni_bid_contract_signing_date}</span>
          </p>
          </tr><tr>
                    <p className="mb-2">
            {t('cni_description')}: <span className="text-primary">{transaction.cni_description}</span>
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
ProjectContractorModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};
export default ProjectContractorModal;
