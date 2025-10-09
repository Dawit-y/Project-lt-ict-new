import { useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Button, UncontrolledTooltip } from "reactstrap";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFetchExpenditureCodes } from "../queries/expenditurecode_query";
import { createKeyValueMap } from "../utils/commonMethods";

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

export function useBudgetRequestColumns({
  data,
  toggleViewModal,
  setTransaction,
  handleBudgetRequestAmountClick,
  onClickDelete,
  showApprove = false,
  onClickApprove,
}) {
  const { t } = useTranslation();
  const columnHelper = createColumnHelper();

  const {
    data: exCodesData,
    isLoading: exCodesLoading,
    isError: exCodesError,
  } = useFetchExpenditureCodes();

  const expendCodeMap = useMemo(() => {
    return createKeyValueMap(exCodesData?.data || [], "pec_id", "pec_code");
  }, [exCodesData]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("bra_expenditure_code_id", {
        id: "bra_expenditure_code_id",
        header: () => t("expenditure_code"),
        enableColumnFilter: false,
        enableSorting: true,
        cell: ({ getValue }) => <span>{expendCodeMap[getValue()] || "-"}</span>,
      }),
      columnHelper.accessor("bra_current_year_expense", {
        id: "bra_current_year_expense",
        header: () => t("current_year_expense"),
        enableColumnFilter: false,
        enableSorting: true,
        cell: (info) => (
          <span>{parseFloat(info.getValue() || 0).toLocaleString()}</span>
        ),
      }),
      columnHelper.accessor("bra_requested_amount", {
        id: "bra_requested_amount",
        header: () => t("requested_amount"),
        enableColumnFilter: false,
        enableSorting: true,
        cell: (info) => (
          <span>{parseFloat(info.getValue() || 0).toLocaleString()}</span>
        ),
      }),
      columnHelper.group({
        id: "source_of_finance",
        header: () => t("source_of_finance"),
        columns: [
          columnHelper.accessor("bra_source_government_requested", {
            id: "bra_source_government_requested",
            header: () => t("government"),
            enableColumnFilter: false,
            cell: (info) => (
              <span>{parseFloat(info.getValue() || 0).toLocaleString()}</span>
            ),
          }),
          columnHelper.accessor("bra_source_internal_requested", {
            id: "bra_source_internal_requested",
            header: () => t("internal"),
            enableColumnFilter: false,
            cell: (info) => (
              <span>{parseFloat(info.getValue() || 0).toLocaleString()}</span>
            ),
          }),
          columnHelper.group({
            id: "external_assistance",
            header: () => t("external_assistance"),
            columns: [
              columnHelper.accessor("bra_source_support_requested", {
                id: "bra_source_support_requested",
                header: () => t("support_requested"),
                enableColumnFilter: false,
                cell: (info) => (
                  <span>
                    {parseFloat(info.getValue() || 0).toLocaleString()}
                  </span>
                ),
              }),
              columnHelper.accessor("bra_source_support_code", {
                id: "bra_source_support_code",
                header: () => t("support_code"),
                enableColumnFilter: false,
                cell: (info) => (
                  <span>
                    {truncateText(
                      info.row.original.bra_source_support_code,
                      30,
                    ) || "-"}
                  </span>
                ),
              }),
            ],
          }),
          columnHelper.group({
            id: "foreign_debt",
            header: () => t("foreign_debt"),
            columns: [
              columnHelper.accessor("bra_source_credit_requested", {
                id: "bra_source_credit_requested",
                header: () => t("credit_requested"),
                enableColumnFilter: false,
                cell: (info) => (
                  <span>
                    {parseFloat(info.getValue() || 0).toLocaleString()}
                  </span>
                ),
              }),
              columnHelper.accessor("bra_source_credit_code", {
                id: "bra_source_credit_code",
                header: () => t("credit_code"),
                enableColumnFilter: false,
                cell: (info) => (
                  <span>
                    {truncateText(
                      info.row.original.bra_source_credit_code,
                      30,
                    ) || "-"}
                  </span>
                ),
              }),
            ],
          }),
        ],
      }),
      columnHelper.display({
        id: "view_detail",
        header: () => t("view_detail"),
        enableColumnFilter: false,
        enableSorting: false,
        cell: (info) => (
          <Button
            type="button"
            color="primary"
            className="btn-sm"
            onClick={() => {
              const row = info.row.original;
              toggleViewModal(row);
              setTransaction(row);
            }}
          >
            {t("view_detail")}
          </Button>
        ),
      }),
      ...(data?.previledge?.is_role_editable == 1 ||
      data?.previledge?.is_role_deletable == 1
        ? [
            columnHelper.display({
              id: "action",
              header: () => t("Action"),
              enableColumnFilter: false,
              enableSorting: false,
              cell: (info) => {
                const row = info.row.original;
                return (
                  <div className="d-flex gap-3">
                    {row.is_deletable == 1 && (
                      <>
                        <Link
                          to="#"
                          className="text-success"
                          onClick={() => handleBudgetRequestAmountClick(row)}
                        >
                          <i
                            className="mdi mdi-pencil font-size-18"
                            id={`edittooltip-${row.id}`}
                          />
                          <UncontrolledTooltip
                            placement="top"
                            target={`edittooltip-${row.id}`}
                          >
                            {t("Edit")}
                          </UncontrolledTooltip>
                        </Link>
                        <Link
                          to="#"
                          className="text-danger"
                          onClick={() => onClickDelete(row)}
                        >
                          <i
                            className="mdi mdi-delete font-size-18"
                            id={`deletetooltip-${row.id}`}
                          />
                          <UncontrolledTooltip
                            placement="top"
                            target={`deletetooltip-${row.id}`}
                          >
                            {t("Delete")}
                          </UncontrolledTooltip>
                        </Link>
                      </>
                    )}

                    {showApprove && (
                      <Button
                        color="success"
                        size="sm"
                        onClick={() => onClickApprove?.(row)}
                      >
                        {t("Approve")}
                      </Button>
                    )}
                  </div>
                );
              },
            }),
          ]
        : []),
    ],
    [
      data,
      expendCodeMap,
      toggleViewModal,
      setTransaction,
      handleBudgetRequestAmountClick,
      onClickDelete,
      showApprove,
      onClickApprove,
      t,
    ],
  );

  return columns;
}

export function useBudgetRequestColumnsApproval({
  data,
  showApprove = false,
  onClickApprove,
}) {
  const { t } = useTranslation();
  const columnHelper = createColumnHelper();

  const {
    data: exCodesData,
    isLoading: exCodesLoading,
    isError: exCodesError,
  } = useFetchExpenditureCodes();

  const expendCodeMap = useMemo(() => {
    return createKeyValueMap(exCodesData?.data || [], "pec_id", "pec_code");
  }, [exCodesData]);

  const columns = useMemo(
    () => [
      // Expenditure code
      columnHelper.accessor("bra_expenditure_code_id", {
        id: "bra_expenditure_code_id",
        header: () => t("expenditure_code"),
        enableColumnFilter: false,
        enableSorting: true,
        cell: ({ getValue }) => <span>{expendCodeMap[getValue()] || "-"}</span>,
      }),

      // Current year expense
      columnHelper.accessor("bra_current_year_expense", {
        id: "bra_current_year_expense",
        header: () => t("current_year_expense"),
        enableColumnFilter: false,
        enableSorting: true,
        cell: (info) => (
          <span>{parseFloat(info.getValue() || 0).toLocaleString()}</span>
        ),
      }),

      // Requested amount
      columnHelper.accessor("bra_requested_amount", {
        id: "bra_requested_amount",
        header: () => t("requested_amount"),
        enableColumnFilter: false,
        enableSorting: true,
        cell: (info) => (
          <span>{parseFloat(info.getValue() || 0).toLocaleString()}</span>
        ),
      }),

      // Source of finance group
      columnHelper.group({
        id: "source_of_finance",
        header: () => t("source_of_finance"),
        columns: [
          // Government
          columnHelper.group({
            id: "government",
            header: () => t("government"),
            columns: [
              columnHelper.accessor("bra_source_government_requested", {
                id: "bra_source_government_requested",
                header: () => t("requested"),
                enableColumnFilter: false,
                cell: (info) => (
                  <span>
                    {parseFloat(info.getValue() || 0).toLocaleString()}
                  </span>
                ),
              }),
              columnHelper.accessor("bra_source_government_approved", {
                id: "bra_source_government_approved",
                header: () => t("approved"),
                enableColumnFilter: false,
                cell: (info) => (
                  <span>
                    {parseFloat(info.getValue() || 0).toLocaleString()}
                  </span>
                ),
              }),
            ],
          }),

          // Internal
          columnHelper.group({
            id: "internal",
            header: () => t("internal"),
            columns: [
              columnHelper.accessor("bra_source_internal_requested", {
                id: "bra_source_internal_requested",
                header: () => t("requested"),
                enableColumnFilter: false,
                cell: (info) => (
                  <span>
                    {parseFloat(info.getValue() || 0).toLocaleString()}
                  </span>
                ),
              }),
              columnHelper.accessor("bra_source_internal_approved", {
                id: "bra_source_internal_approved",
                header: () => t("approved"),
                enableColumnFilter: false,
                cell: (info) => (
                  <span>
                    {parseFloat(info.getValue() || 0).toLocaleString()}
                  </span>
                ),
              }),
            ],
          }),

          // External Assistance (support)
          columnHelper.group({
            id: "external_assistance",
            header: () => t("external_assistance"),
            columns: [
              columnHelper.accessor("bra_source_support_requested", {
                id: "bra_source_support_requested",
                header: () => t("requested"),
                enableColumnFilter: false,
                cell: (info) => (
                  <span>
                    {parseFloat(info.getValue() || 0).toLocaleString()}
                  </span>
                ),
              }),
              columnHelper.accessor("bra_source_support_approved", {
                id: "bra_source_support_approved",
                header: () => t("approved"),
                enableColumnFilter: false,
                cell: (info) => (
                  <span>
                    {parseFloat(info.getValue() || 0).toLocaleString()}
                  </span>
                ),
              }),
              columnHelper.accessor("bra_source_support_code", {
                id: "bra_source_support_code",
                header: () => t("support_code"),
                enableColumnFilter: false,
                cell: (info) => (
                  <span>
                    {truncateText(
                      info.row.original.bra_source_support_code,
                      30,
                    ) || "-"}
                  </span>
                ),
              }),
            ],
          }),

          // Foreign Debt (credit)
          columnHelper.group({
            id: "foreign_debt",
            header: () => t("foreign_debt"),
            columns: [
              columnHelper.accessor("bra_source_credit_requested", {
                id: "bra_source_credit_requested",
                header: () => t("requested"),
                enableColumnFilter: false,
                cell: (info) => (
                  <span>
                    {parseFloat(info.getValue() || 0).toLocaleString()}
                  </span>
                ),
              }),
              columnHelper.accessor("bra_source_credit_approved", {
                id: "bra_source_credit_approved",
                header: () => t("approved"),
                enableColumnFilter: false,
                cell: (info) => (
                  <span>
                    {parseFloat(info.getValue() || 0).toLocaleString()}
                  </span>
                ),
              }),
              columnHelper.accessor("bra_source_credit_code", {
                id: "bra_source_credit_code",
                header: () => t("credit_code"),
                enableColumnFilter: false,
                cell: (info) => (
                  <span>
                    {truncateText(
                      info.row.original.bra_source_credit_code,
                      30,
                    ) || "-"}
                  </span>
                ),
              }),
            ],
          }),
        ],
      }),

      // Action column (Approve button)
      ...(data?.previledge?.is_role_editable == 1 ||
      data?.previledge?.is_role_deletable == 1
        ? [
            columnHelper.display({
              id: "action",
              header: () => t("Action"),
              enableColumnFilter: false,
              enableSorting: false,
              cell: (info) => {
                const row = info.row.original;
                return (
                  <div className="d-flex gap-3">
                    {showApprove && (
                      <Button
                        color="success"
                        size="sm"
                        onClick={() => onClickApprove?.(row)}
                      >
                        {t("Approve")}
                      </Button>
                    )}
                  </div>
                );
              },
            }),
          ]
        : []),
    ],
    [data, showApprove, t, expendCodeMap],
  );

  return columns;
}
