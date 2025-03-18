import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Spinner, Alert, Button, Col } from "reactstrap";
import { DetailsView } from "../../components/Common/DetailViewWrapper";
import PrintMultipleTables from "../../components/Common/PrintMultipleTables";
import { useFetchBudgetExSources } from "../../queries/budgetexsource_query";
import { useFetchBudgetRequestAmounts } from "../../queries/budgetrequestamount_query";
import { useFetchBudgetRequestTasks } from "../../queries/budgetrequesttask_query";

const BudgetRequestDetails = ({ transaction }) => {
  const { t } = useTranslation();
  const id = transaction?.bdr_id;

  const brAmountsQuery = useFetchBudgetRequestAmounts(
    { budget_request_id: id },
    !!id
  );
  const brTasksQuery = useFetchBudgetRequestTasks(
    { budget_request_id: id },
    !!id
  );
  const brExSourcesQuery = useFetchBudgetExSources(
    { budget_request_id: id },
    !!id
  );

  const isLoading =
    brAmountsQuery.isLoading ||
    brTasksQuery.isLoading ||
    brExSourcesQuery.isLoading;
  const isError =
    brAmountsQuery.error || brTasksQuery.error || brExSourcesQuery.error;

  return (
    <div className="container mt-4">
      <h2>{t("View Details")}</h2>
      {isLoading ? (
        <div className="text-center">
          <Spinner color="primary" />
          <p>{t("Loading data...")}</p>
        </div>
      ) : isError ? (
        <Alert color="danger">
          {t("Failed to load data. Please try again.")}
        </Alert>
      ) : (
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
            "color_code",
            "bdr_request_status",
          ]}
        />
      )}

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
    </div>
  );
};

BudgetRequestDetails.propTypes = {
  transaction: PropTypes.object,
};

export default BudgetRequestDetails;
