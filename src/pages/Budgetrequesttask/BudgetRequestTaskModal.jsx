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

const BudgetRequestTaskModal = (props) => {
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
                <td>{t("brt_task_name")}</td>
                <td className="text-primary">{transaction.brt_task_name}</td>
                <td>{t("brt_measurement")}</td>
                <td className="text-primary">{transaction.brt_measurement}</td>
              </tr>
              <tr>
                <td>{t("brt_previous_year_physical")}</td>
                <td className="text-primary">
                  {transaction.brt_previous_year_physical}
                </td>
                <td>{t("brt_previous_year_financial")}</td>
                <td className="text-primary">
                  {transaction.brt_previous_year_financial}
                </td>
              </tr>
              <tr>
                <td>{t("brt_current_year_physical")}</td>
                <td className="text-primary">
                  {transaction.brt_current_year_physical}
                </td>
                <td>{t("brt_current_year_financial")}</td>
                <td className="text-primary">
                  {transaction.brt_current_year_financial}
                </td>
              </tr>
              <tr>
                <td>{t("brt_next_year_physical")}</td>
                <td className="text-primary">
                  {transaction.brt_next_year_physical}
                </td>
                <td>{t("brt_next_year_financial")}</td>
                <td className="text-primary">
                  {transaction.brt_next_year_financial}
                </td>
              </tr>
              <tr>
                <td>{t("brt_description")}</td>
                <td className="text-primary" colSpan="3">
                  {transaction.brt_description}
                </td>
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
BudgetRequestTaskModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};
export default BudgetRequestTaskModal;
