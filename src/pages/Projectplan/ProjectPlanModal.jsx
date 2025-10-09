import React, { useTransition } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table,
} from "reactstrap";

const modalStyle = {
  width: "100%",
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
          <table className="table table-bordered">
            <tbody>
              <tr>
                <td>{t("pld_name")}</td>
                <td className="text-primary">{transaction.pld_name}</td>
              </tr>
              <tr>
                <td>{t("pld_budget_year_id")}</td>
                <td className="text-primary">
                  {transaction.pld_budget_year_id}
                </td>
              </tr>
              <tr>
                <td>{t("pld_start_date_gc")}</td>
                <td className="text-primary">
                  {transaction.pld_start_date_gc}
                </td>
              </tr>
              <tr>
                <td>{t("pld_end_date_gc")}</td>
                <td className="text-primary">{transaction.pld_end_date_gc}</td>
              </tr>
              <tr>
                <td>{t("pld_description")}</td>
                <td className="text-primary">{transaction.pld_description}</td>
              </tr>
            </tbody>
          </table>
        </ModalBody>
        <ModalFooter>
          <Button type="button" color="secondary" onClick={toggle}>
            {t("Close")}
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
