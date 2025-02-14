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
  Col
} from "reactstrap"
import { DetailsView } from "../../components/Common/DetailViewWrapper";
import PrintMultipleTables from "../../components/Common/PrintMultipleTables";
import { useFetchBudgetExSources } from "../../queries/budgetexsource_query";
import { useFetchBudgetRequestAmounts } from "../../queries/budgetrequestamount_query";
import { useFetchBudgetRequestTasks } from "../../queries/budgetrequesttask_query";

const modalStyle = {
  width: '100%',
};

const BudgetRequestModal = (props) => {
  const { t } = useTranslation();
  const { isOpen, toggle, transaction } = props;
  const id = transaction.bdr_id
  const brAmounts = useFetchBudgetRequestAmounts({ budget_request_id: id }, isOpen)
  const brTasks = useFetchBudgetRequestTasks({ budget_request_id: id }, isOpen)
  const brExSources = useFetchBudgetExSources({ budget_request_id: id }, isOpen)

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
          <DetailsView
            details={transaction}
            keysToRemove={
              [
                "bdr_id",
                "bdr_project_id",
                "bdr_released_date_ec",
                "bdr_requested_date_ec",
                "bdr_create_time",
                "bdr_update_time",
                "bdr_delete_time",
                "bdr_action_remark",
                "bdr_status",
                "bdr_created_by",
                "is_editable",
                "is_deletable"
              ]
            }
          />
        </ModalBody>
        <ModalFooter>
          <Col className="d-flex align-items-center justify-content-end gap-2">
            <PrintMultipleTables
              title="budget_request"
              tables={
                [
                  {
                    tablename: "Amounts",
                    data: brAmounts?.data?.data || [],
                    excludeKey: ["is_editble", "is_deletable"],
                  },
                  {
                    tablename: "Tasks",
                    data: brTasks?.data?.data || [],
                    excludeKey: ["is_editble", "is_deletable"],
                  },
                  {
                    tablename: "External Sources",
                    data: brExSources?.data?.data || [],
                    excludeKey: ["is_editble", "is_deletable"],
                  },

                ]}
            />
            <Button type="button" color="secondary" onClick={toggle}>
              {t('Close')}
            </Button>
          </Col>
        </ModalFooter>
      </div>
    </Modal>
  );
};
BudgetRequestModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};
export default BudgetRequestModal;
