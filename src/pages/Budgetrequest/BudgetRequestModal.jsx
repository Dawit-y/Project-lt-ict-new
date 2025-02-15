import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Col,
  Spinner,
  Alert
} from "reactstrap";
import { DetailsView } from "../../components/Common/DetailViewWrapper";
import PrintMultipleTables from "../../components/Common/PrintMultipleTables";
import { useFetchBudgetExSources } from "../../queries/budgetexsource_query";
import { useFetchBudgetRequestAmounts } from "../../queries/budgetrequestamount_query";
import { useFetchBudgetRequestTasks } from "../../queries/budgetrequesttask_query";

const modalStyle = {
  width: "100%",
};

const BudgetRequestModal = ({ isOpen, toggle, transaction }) => {
  const { t } = useTranslation();
  const id = transaction?.bdr_id;

  const brAmountsQuery = useFetchBudgetRequestAmounts({ budget_request_id: id }, isOpen);
  const brTasksQuery = useFetchBudgetRequestTasks({ budget_request_id: id }, isOpen);
  const brExSourcesQuery = useFetchBudgetExSources({ budget_request_id: id }, isOpen);

  const isLoading =
    brAmountsQuery.isLoading || brTasksQuery.isLoading || brExSourcesQuery.isLoading;
  const isError =
    brAmountsQuery.error || brTasksQuery.error || brExSourcesQuery.error;

  return (
    <Modal isOpen={isOpen} centered className="modal-xl" toggle={toggle} style={modalStyle}>
      <ModalHeader toggle={toggle}>{t("View Details")}</ModalHeader>
      <ModalBody>
        {isLoading ? (
          <div className="text-center">
            <Spinner color="primary" />
            <p>{t("Loading data...")}</p>
          </div>
        ) : isError ? (
          <Alert color="danger">{t("Failed to load data. Please try again.")}</Alert>
        ) : (
          <>
            <DetailsView
              details={transaction}
              keysToRemove={[
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
                "is_deletable",
              ]}
            />
          </>
        )}
      </ModalBody>
      <ModalFooter>
        <Col className="d-flex align-items-center justify-content-end gap-2">
          {!isLoading && !isError && (
            <PrintMultipleTables
              title="budget_request"
              tables={[
                {
                  tablename: "Amounts",
                  data: brAmountsQuery.data?.data || [],
                  excludeKey: ["is_editble", "is_deletable"],
                },
                {
                  tablename: "Tasks",
                  data: brTasksQuery.data?.data || [],
                  excludeKey: ["is_editble", "is_deletable"],
                },
                {
                  tablename: "External Sources",
                  data: brExSourcesQuery.data?.data || [],
                  excludeKey: ["is_editble", "is_deletable"],
                },
              ]}
            />
          )}
          <Button color="secondary" onClick={toggle}>{t("Close")}</Button>
        </Col>
      </ModalFooter>
    </Modal>
  );
};

BudgetRequestModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};

export default BudgetRequestModal;
