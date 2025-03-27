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

const AccessLogModal = (props) => {
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
        <table className="table">
  <tr>
    <td className="col-sm-4 p-2">{t('acl_ip')}</td>
    <td className="col-sm-8 p-2">{transaction.acl_ip}</td>
  </tr>
  <tr>
    <td className="col-sm-4 p-2">{t('acl_user_id')}</td>
    <td className="col-sm-8 p-2">{transaction.acl_user_id}</td>
  </tr>
  <tr>
    <td className="col-sm-4 p-2">{t('acl_object_action')}</td>
    <td className="col-sm-8 p-2">{transaction.acl_object_action}</td>
  </tr>
  <tr>
    <td className="col-sm-4 p-2">{t('acl_object_name')}</td>
    <td className="col-sm-8 p-2">{transaction.acl_object_name}</td>
  </tr>
  <tr>
    <td className="col-sm-4 p-2">{t('acl_detail')}</td>
    <td className="col-sm-8 p-2">{transaction.acl_detail}</td>
  </tr>
  <tr>
    <td className="col-sm-4 p-2">{t('acl_object_id')}</td>
    <td className="col-sm-8 p-2">{transaction.acl_object_id}</td>
  </tr>
  <tr>
    <td className="col-sm-4 p-2">{t('acl_create_time')}</td>
    <td className="col-sm-8 p-2">{transaction.acl_create_time}</td>
  </tr>
  <tr>
    <td className="col-sm-4 p-2">{t('acl_description')}</td>
    <td className="col-sm-8 p-2 bg-info" style={{ overflowWrap: "anywhere"}}>      
        <pre>{transaction.acl_description}</pre>
    </td>
  </tr>
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
AccessLogModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};
export default AccessLogModal;
