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

const RequestInformationModal = (props) => {
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
              {t('rqi_title')}: <span className="text-primary">{transaction.rqi_title}</span>
            </p>
          </tr><tr>
            <p className="mb-2">
              {t('rqi_object_id')}: <span className="text-primary">{transaction.rqi_object_id}</span>
            </p>
          </tr><tr>
            <p className="mb-2">
              {t('rqi_request_status_id')}: <span className="text-primary">{transaction.rqi_request_status_id}</span>
            </p>
          </tr><tr>
            <p className="mb-2">
              {t('rqi_request_category_id')}: <span className="text-primary">{transaction.rqi_request_category_id}</span>
            </p>
          </tr><tr>
            <p className="mb-2">
              {t('rqi_request_date_et')}: <span className="text-primary">{transaction.rqi_request_date_et}</span>
            </p>
          </tr><tr>
            <p className="mb-2">
              {t('rqi_request_date_gc')}: <span className="text-primary">{transaction.rqi_request_date_gc}</span>
            </p>
          </tr><tr>
            <p className="mb-2">
              {t('rqi_description')}: <span className="text-primary">{transaction.rqi_description}</span>
            </p>
          </tr><tr>
            <p className="mb-2">
              {t('rqi_status')}: <span className="text-primary">{transaction.rqi_status}</span>
            </p>
          </tr>

          {transaction.is_deletable === 1 && (
            <p className="text-danger">{t('data_is_deletable')}</p>
          )}

          {transaction.is_editable === 1 && (
            <p className="text-success">{t('editable')}</p>
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
RequestInformationModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};
export default RequestInformationModal;
