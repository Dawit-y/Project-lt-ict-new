import { useState, useCallback, useMemo } from "react";
import {
	Row,
	Col,
	Card,
	CardBody,
	CardHeader,
	Badge,
	Button,
	Table,
	Progress,
} from "reactstrap";
import { FaCheckCircle } from "react-icons/fa";
import Chart from "react-apexcharts";
import { useFetchBudgetRequestAmounts } from "../../../../queries/budgetrequestamount_query";
import { useFetchBudgetRequestTasks } from "../../../../queries/budgetrequesttask_query";
import { useFetchRequestCategorys } from "../../../../queries/requestcategory_query";
import { useBudgetRequestColumnsApproval } from "../../../../hooks/useBdrAmountsColumn";
import TableContainer from "../../../../components/Common/TableContainer";
import { useBudgetRequestTaskColumns } from "../../../../hooks/useBdrTasksColumn";
import { useTranslation } from "react-i18next";
import BrAmountApproverModal from "./BrAmountApproverModal";
import { createMultiLangKeyValueMap } from "../../../../utils/commonMethods";
import { statusColorMap } from ".";

export const calculateProgressPercent = (value, total) => {
	if (!value || !total || parseFloat(total) === 0) return 0;
	return (parseFloat(value) / parseFloat(total)) * 100;
};

export default function BudgetBreakdown({
	request: requestData,
	projectData,
	isActive,
}) {
	const { t, i18n } = useTranslation();
	const [brAmountModal, setBrAmountModal] = useState(false);
	const toggleBrAmountModal = () => setBrAmountModal(!brAmountModal);
	const [braAmount, setBraAmount] = useState(null);

	const handleBudgetRequestAmountClick = useCallback(
		(row) => {
			setBraAmount(row);
			toggleBrAmountModal();
		},
		[toggleBrAmountModal]
	);

	const { data: amounts, isLoading: isAmountsLoading } =
		useFetchBudgetRequestAmounts(
			{ budget_request_id: requestData?.bdr_id },
			isActive && requestData?.bdr_id !== undefined
		);
	const amountColumns = useBudgetRequestColumnsApproval({
		data: amounts || [],
		showApprove: true,
		onClickApprove: handleBudgetRequestAmountClick,
	});

	const { data: tasks, isLoading: isTasksLoading } = useFetchBudgetRequestTasks(
		{ budget_request_id: requestData?.bdr_id },
		isActive && requestData?.bdr_id !== undefined
	);
	const taskColumns = useBudgetRequestTaskColumns({
		data: tasks || [],
		toggleViewModal: () => {},
		setTransaction: () => {},
		handleBudgetRequestTaskClick: () => {},
		onClickDelete: () => {},
		showEdit: false,
		showDelete: false,
		showActions: false,
		showDetail: false,
	});

	const { data: requestCategories } = useFetchRequestCategorys();
	const bgCategoryMap = useMemo(() => {
		return createMultiLangKeyValueMap(
			requestCategories?.data || [],
			"rqc_id",
			{
				en: "rqc_name_en",
				am: "rqc_name_am",
				or: "rqc_name_or",
			},
			i18n.language
		);
	}, [requestCategories, i18n.language]);

	const measuredFigure = projectData?.prj_measured_figure; // 1000 100
	const measurementUnit = projectData?.prj_measurement_unit; // km  %
	const totalActualBudget = projectData?.prj_total_actual_budget;

	const physicalBaselineInPercent =
		(parseFloat(requestData?.bdr_physical_baseline) /
			parseFloat(measuredFigure)) *
		100;

	const financialBaselineInpercent =
		requestData?.bdr_financial_baseline > 0
			? (parseFloat(requestData?.bdr_financial_baseline) /
					parseFloat(totalActualBudget)) *
				100
			: 0;

	const chartOptions = {
		chart: {
			type: "bar",
			height: 350,
		},
		plotOptions: {
			bar: {
				horizontal: true,
				dataLabels: {
					position: "top",
				},
			},
		},
		dataLabels: {
			enabled: true,
			formatter: function (val) {
				return `$${val.toLocaleString()}`;
			},
			offsetX: 10,
			style: {
				fontSize: "12px",
				colors: ["#333"],
			},
		},
		xaxis: {
			categories: [
				t("baseline"),
				t("total_requested"),
				t("released_amount"),
				t("recommended"),
			],
			labels: {
				formatter: function (val) {
					return `$${val.toLocaleString()}`;
				},
			},
		},
		colors: ["#17a2b8", "#007bff", "#28a745", "#ffc107"],
		tooltip: {
			y: {
				formatter: function (val) {
					return `$${val.toLocaleString()}`;
				},
			},
		},
	};

	const chartSeries = [
		{
			name: t("amount"),
			data: [
				requestData?.bdr_financial_baseline || 0,
				requestData?.bdr_requested_amount || 0,
				requestData?.bdr_released_amount || 0,
				requestData?.bdr_financial_recommended || 0,
			],
		},
	];

	return (
		<>
			<BrAmountApproverModal
				isOpen={brAmountModal}
				toggle={toggleBrAmountModal}
				budgetRequestAmount={braAmount}
			/>
			<div className="d-flex flex-column gap-4">
				{/* Enhanced Summary Cards with Real Data */}
				<Row className="g-3 align-items-stretch">
					<Col md={3}>
						<Card className="text-center border-primary h-100">
							<CardBody className="py-4 d-flex flex-column justify-content-between">
								<div>
									<div className="h3 text-primary mb-1">
										${requestData?.bdr_requested_amount?.toLocaleString()}
									</div>
									<small className="text-muted">
										{t("total_requested_amount")}
									</small>
								</div>
								<div className="mt-2">
									<Badge color="primary" outline>
										{t("budget_year")} {requestData?.budget_year}
									</Badge>
								</div>
							</CardBody>
						</Card>
					</Col>

					<Col md={3}>
						<Card className="text-center border-success h-100">
							<CardBody className="py-4 d-flex flex-column justify-content-center">
								<div>
									<div className="h3 text-success mb-1">
										${requestData?.bdr_released_amount?.toLocaleString() ?? 0}
									</div>
									<small className="text-muted">{t("released_amount")}</small>
								</div>
							</CardBody>
						</Card>
					</Col>

					<Col md={3}>
						<Card className="text-center border-info h-100">
							<CardBody className="py-4 d-flex flex-column justify-content-between">
								<div>
									<div className="h3 text-info mb-1">
										{`${requestData?.bdr_physical_baseline}${measurementUnit}`}
									</div>
									<small className="text-muted">{t("physical_baseline")}</small>
								</div>
								<div className="mt-2">
									<Progress
										value={physicalBaselineInPercent}
										color="info"
										className="mb-1"
									/>
									<small className="text-muted">
										{physicalBaselineInPercent}%{"of Measured Figure"}
									</small>
								</div>
							</CardBody>
						</Card>
					</Col>

					<Col md={3}>
						<Card className="text-center border-warning h-100">
							<CardBody className="py-4 d-flex flex-column justify-content-between">
								<div>
									<div className="h3 text-warning mb-1">
										${requestData?.bdr_financial_baseline?.toLocaleString()}
									</div>
									<small className="text-muted">
										{t("financial_baseline")}
									</small>
								</div>
								<div className="mt-2">
									<Progress
										value={financialBaselineInpercent}
										color="warning"
										className="mb-1"
									/>
									<small className="text-muted">
										{financialBaselineInpercent.toFixed(1)}%{" "}
										{t("of Total Actual Budget")}
									</small>
								</div>
							</CardBody>
						</Card>
					</Col>
				</Row>

				{/* Request Details Card */}
				<Card>
					<CardHeader className="bg-light">
						<div className="d-flex justify-content-between align-items-center">
							<div>
								<h5 className="mb-1">{t("budget_request_information")}</h5>
							</div>
						</div>
					</CardHeader>
					<CardBody>
						<Row>
							<Col md={6}>
								<Table borderless className="mb-0">
									<tbody>
										<tr>
											<td className="fw-bold text-muted">
												{t("request_type")}:
											</td>
											<td>{requestData?.request_type}</td>
										</tr>
										<tr>
											<td className="fw-bold text-muted">{t("status")}:</td>
											<td>
												<Badge
													color={
														statusColorMap[requestData?.bdr_request_status]
													}
												>
													<FaCheckCircle className="me-1" />
													{requestData?.status_name}
												</Badge>
											</td>
										</tr>
										<tr>
											<td className="fw-bold text-muted">
												{t("requested_date")}:
											</td>
											<td>{requestData?.bdr_requested_date_gc}</td>
										</tr>
										<tr>
											<td className="fw-bold text-muted">
												{t("released_date")}:
											</td>
											<td>
												{requestData?.bdr_released_date_gc || t("not_released")}
											</td>
										</tr>
										<tr>
											<td className="fw-bold text-muted">
												{t("request_category")}:
											</td>
											<td>
												{bgCategoryMap[requestData?.bdr_request_category_id]}
											</td>
										</tr>
									</tbody>
								</Table>
							</Col>
							<Col md={6}>
								<Table borderless className="mb-0">
									<tbody>
										<tr>
											<td className="fw-bold text-muted">
												{t("bdr_source_government_approved")}:
											</td>
											<td>{requestData?.bdr_source_government_approved}</td>
										</tr>
										<tr>
											<td className="fw-bold text-muted">
												{t("bdr_source_support_approved")}:
											</td>
											<td>{requestData?.bdr_source_support_approved}</td>
										</tr>
										<tr>
											<td className="fw-bold text-muted">
												{t("bdr_source_credit_approved")}:
											</td>
											<td>{requestData?.bdr_source_credit_approved}</td>
										</tr>
										<tr>
											<td className="fw-bold text-muted">
												{t("bdr_source_other_approved")}:
											</td>
											<td>{requestData?.bdr_source_other_approved}</td>
										</tr>
										<tr>
											<td className="fw-bold text-muted">
												{t("action_remark")}:
											</td>
											<td>
												{requestData?.bdr_action_remark || t("no_remarks")}
											</td>
										</tr>
									</tbody>
								</Table>
							</Col>
						</Row>
					</CardBody>
				</Card>

				{/* Progress Analysis */}
				<Card className="h-100">
					<CardHeader>
						<h5 className="mb-1">{t("progress_analysis")}</h5>
						<small className="text-muted">
							{t("physical_and_financial_progress_comparison")}
						</small>
					</CardHeader>
					<CardBody>
						<Row className="h-100">
							{/* Physical Progress */}
							<Col
								md={6}
								className="d-flex flex-column justify-content-between h-100"
							>
								<h6 className="text-muted mb-3">{t("physical_progress")}</h6>
								<div className="d-flex flex-column justify-content-evenly flex-grow-1">
									{[
										{
											label: t("baseline"),
											value: requestData?.bdr_physical_baseline,
										},
										{
											label: t("planned"),
											value: requestData?.bdr_physical_planned,
										},
										{
											label: t("approved"),
											value: requestData?.bdr_physical_approved,
										},
										{
											label: t("recommended"),
											value: requestData?.bdr_physical_recommended,
										},
									].map((item, idx) => (
										<div key={idx} className="mb-4">
											<div className="d-flex justify-content-between mb-1">
												<small>{item.label}</small>
												{/* Show raw value with unit */}
												<small>
													{item.value} {projectData?.prj_measurement_unit}
												</small>
											</div>
											<Progress
												value={calculateProgressPercent(
													item.value,
													projectData?.prj_measured_figure
												)}
												color={
													idx === 0
														? "info"
														: idx === 1
															? "primary"
															: idx === 2
																? "success"
																: "warning"
												}
											/>
										</div>
									))}
								</div>
							</Col>
							{/* Financial Progress */}
							<Col md={6} className="d-flex flex-column h-100">
								<h6 className="text-muted mb-3">{t("financial_progress")}</h6>
								<Card className="flex-grow-1">
									<CardBody className="p-2">
										<Chart
											options={chartOptions}
											series={chartSeries}
											type="bar"
											height="220"
										/>
									</CardBody>
								</Card>
							</Col>
						</Row>
					</CardBody>
				</Card>
				{/* Summary Cards */}
				<Row className="g-3">
					<Col md={2}>
						<Card className="text-center">
							<CardBody className="py-4">
								<div className="h4 text-primary mb-1">
									$
									{amounts?.data
										?.reduce(
											(sum, item) => sum + (item.bra_requested_amount || 0),
											0
										)
										?.toLocaleString()}
								</div>
								<small className="text-muted">{t("total_requested")}</small>
							</CardBody>
						</Card>
					</Col>
					<Col md={2}>
						<Card className="text-center">
							<CardBody className="py-4">
								<div className="h4 text-success mb-1">
									$
									{amounts?.data
										?.reduce(
											(sum, item) => sum + (item.bra_current_year_expense || 0),
											0
										)
										?.toLocaleString()}
								</div>
								<small className="text-muted">
									{t("current_year_expense")}
								</small>
							</CardBody>
						</Card>
					</Col>
					<Col md={2}>
						<Card className="text-center">
							<CardBody className="py-4">
								<div className="h4 text-warning mb-1">
									$
									{amounts?.data
										?.reduce(
											(sum, item) =>
												sum + (item.bra_source_government_requested || 0),
											0
										)
										?.toLocaleString()}
								</div>
								<small className="text-muted">{t("government_source")}</small>
							</CardBody>
						</Card>
					</Col>
					<Col md={2}>
						<Card className="text-center">
							<CardBody className="py-4">
								<div className="h4 text-info mb-1">
									$
									{amounts?.data
										?.reduce(
											(sum, item) =>
												sum + (item.bra_source_internal_requested || 0),
											0
										)
										?.toLocaleString()}
								</div>
								<small className="text-muted">{t("internal_source")}</small>
							</CardBody>
						</Card>
					</Col>
					<Col md={2}>
						<Card className="text-center">
							<CardBody className="py-4">
								<div className="h4 text-secondary mb-1">
									$
									{amounts?.data
										?.reduce(
											(sum, item) =>
												sum + (item.bra_source_support_requested || 0),
											0
										)
										?.toLocaleString()}
								</div>
								<small className="text-muted">{t("support_source")}</small>
							</CardBody>
						</Card>
					</Col>
					<Col md={2}>
						<Card className="text-center">
							<CardBody className="py-4">
								<div className="h4 text-dark mb-1">
									$
									{amounts?.data
										?.reduce(
											(sum, item) =>
												sum + (item.bra_source_credit_requested || 0),
											0
										)
										?.toLocaleString()}
								</div>
								<small className="text-muted">{t("credit_source")}</small>
							</CardBody>
						</Card>
					</Col>
				</Row>

				{/* Budget Request Amounts Table */}
				<Card>
					<CardHeader>
						<div className="d-flex justify-content-between align-items-center">
							<div>
								<h5 className="mb-1">{t("budget_request_amounts")}</h5>
								<small className="text-muted">
									{t("budget_request_amounts_subtitle")}
								</small>
							</div>
							<div className="d-flex gap-2">
								<Button color="secondary" size="sm" outline>
									<i className="bi bi-funnel me-2"></i>
									{t("filter")}
								</Button>
								<Button color="secondary" size="sm" outline>
									<i className="bi bi-download me-2"></i>
									{t("export")}
								</Button>
							</div>
						</div>
					</CardHeader>
					<CardBody>
						<TableContainer
							columns={amountColumns}
							data={amounts?.data || []}
							isLoading={isAmountsLoading}
							isAddButton={false}
							size="lg"
							isGlobalFilter={true}
							SearchPlaceholder={t("filter_placeholder")}
							tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
							theadClass="table-light"
							pagination="pagination"
							paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
						/>
					</CardBody>
				</Card>

				{/* Budget Request Tasks */}
				<Card>
					<CardHeader>
						<h5 className="mb-1">{t("budget_request_tasks")}</h5>
						<small className="text-muted">
							{t("budget_request_tasks_subtitle")}
						</small>
					</CardHeader>
					<CardBody>
						<TableContainer
							columns={taskColumns}
							data={tasks?.data || []}
							isLoading={isTasksLoading}
							isAddButton={false}
							size="lg"
							isGlobalFilter={true}
							SearchPlaceholder={t("filter_placeholder")}
							tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
							theadClass="table-light"
							pagination="pagination"
							paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
						/>
					</CardBody>
				</Card>
			</div>
		</>
	);
}
