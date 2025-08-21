import { useMemo } from "react";
import { Button, UncontrolledTooltip } from "reactstrap";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const truncateText = (text, maxLength) => {
	if (typeof text !== "string") {
		return text;
	}
	return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

export function useBudgetRequestTaskColumns({
	data,
	toggleViewModal,
	setTransaction,
	handleBudgetRequestTaskClick,
	onClickDelete,
	showEdit = true,
	showDelete = true,
	showActions = true,
	showDetail = true,
}) {
	const { t } = useTranslation();

	const columns = useMemo(() => {
		const baseColumns = [
			{
				id: "brt_task_name",
				header: "",
				accessorKey: "brt_task_name",
				enableColumnFilter: false,
				enableSorting: true,
				cell: (cellProps) => (
					<span>
						{truncateText(cellProps.row.original.brt_task_name, 30) || "-"}
					</span>
				),
			},
			{
				id: "brt_measurement",
				header: "",
				accessorKey: "brt_measurement",
				enableColumnFilter: false,
				enableSorting: true,
				cell: (cellProps) => (
					<span>
						{truncateText(cellProps.row.original.brt_measurement, 30) || "-"}
					</span>
				),
			},
			{
				id: "performance_last_year",
				header: t("performance_last_year"),
				columns: [
					{
						id: "brt_previous_year_physical",
						header: t("physical"),
						accessorKey: "brt_previous_year_physical",
						enableColumnFilter: false,
						enableSorting: true,
						cell: (cellProps) => <span>{`${cellProps.getValue()}%`}</span>,
					},
					{
						id: "brt_previous_year_financial",
						header: t("financial"),
						accessorKey: "brt_previous_year_financial",
						enableColumnFilter: false,
						enableSorting: true,
						cell: (cellProps) => (
							<span>
								{parseFloat(cellProps.getValue() || 0).toLocaleString()}
							</span>
						),
					},
				],
			},
			{
				id: "performance_this_year",
				header: t("performance_this_year"),
				columns: [
					{
						id: "brt_current_year_physical",
						header: t("physical"),
						accessorKey: "brt_current_year_physical",
						enableColumnFilter: false,
						enableSorting: true,
						cell: (cellProps) => <span>{`${cellProps.getValue()}%`}</span>,
					},
					{
						id: "brt_current_year_financial",
						header: t("financial"),
						accessorKey: "brt_current_year_financial",
						enableColumnFilter: false,
						enableSorting: true,
						cell: (cellProps) => (
							<span>
								{parseFloat(cellProps.getValue() || 0).toLocaleString()}
							</span>
						),
					},
				],
			},
			{
				id: "plans_coming_year",
				header: t("plans_coming_year"),
				columns: [
					{
						id: "brt_next_year_physical",
						header: t("physical"),
						accessorKey: "brt_next_year_physical",
						enableColumnFilter: false,
						enableSorting: true,
						cell: (cellProps) => <span>{`${cellProps.getValue()}%`}</span>,
					},
					{
						id: "brt_next_year_financial",
						header: t("financial"),
						accessorKey: "brt_next_year_financial",
						enableColumnFilter: false,
						enableSorting: true,
						cell: (cellProps) => (
							<span>
								{parseFloat(cellProps.getValue() || 0).toLocaleString()}
							</span>
						),
					},
				],
			},
		];

		// Add view detail column conditionally
		if (showDetail) {
			baseColumns.push({
				id: "view_detail",
				header: t("view_detail"),
				enableColumnFilter: false,
				enableSorting: false,
				cell: (cellProps) => (
					<Button
						type="button"
						color="primary"
						className="btn-sm"
						onClick={() => {
							const row = cellProps.row.original;
							toggleViewModal(row);
							setTransaction(row);
						}}
					>
						{t("view_detail")}
					</Button>
				),
			});
		}

		// Add action column conditionally
		if (
			(data?.previledge?.is_role_editable == 1 ||
				data?.previledge?.is_role_deletable == 1) &&
			showActions
		) {
			baseColumns.push({
				id: "action",
				header: t("Action"),
				accessorKey: "action",
				enableColumnFilter: false,
				enableSorting: false,
				cell: (cellProps) => {
					const row = cellProps.row.original;
					return (
						<div className="d-flex gap-3">
							{row.is_editable == 1 && showEdit && (
								<Link
									to="#"
									className="text-success"
									onClick={() => handleBudgetRequestTaskClick(row)}
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
							)}
							{row.is_deletable == 1 && showDelete && (
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
							)}
						</div>
					);
				},
			});
		}

		return baseColumns.filter(
			(column) => column !== false && column !== null && column !== undefined
		);
	}, [
		data,
		toggleViewModal,
		setTransaction,
		handleBudgetRequestTaskClick,
		onClickDelete,
		t,
		showEdit,
		showActions,
		showDelete,
		showDetail,
	]);

	return columns;
}
