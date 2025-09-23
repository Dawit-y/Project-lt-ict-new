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
import { FaCheckCircle, FaCheck } from "react-icons/fa";
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
import BudgetSourceApprovalModal from "./BudgetSourceApprovalModal";

export const calculateProgressPercent = (value, total) => {
	if (value == null || total == null) return null;
	if (isNaN(parseFloat(value)) || isNaN(parseFloat(total))) return null;
	if (parseFloat(total) === 0) return null;
	return (parseFloat(value) / parseFloat(total)) * 100;
};

export const formatMoney = (value, withSymbol = true) => {
	if (value == null || isNaN(parseFloat(value))) return "-";
	const formatted = parseFloat(value).toLocaleString();
	return withSymbol ? `ETB ${formatted}` : formatted;
};

export const formatNumber = (value, unit = "") => {
	if (value == null || isNaN(parseFloat(value))) return "—";
	return `${parseFloat(value).toLocaleString()}${unit ? unit : ""}`;
};

export const getSafeValue = (value, fallback = "—") => {
	return value != null ? value : fallback;
};

export default function BudgetBreakdown({
	request: requestData,
	projectData,
	isActive,
}) {
	const { t, i18n } = useTranslation();
	const [brAmountModal, setBrAmountModal] = useState(false);
	const [approvalModal, setApprovalModal] = useState(false);
	const toggleBrAmountModal = () => setBrAmountModal(!brAmountModal);
	const toggleApprovalModal = () => setApprovalModal(!approvalModal);
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

	const measuredFigure = projectData?.prj_measured_figure;
	const measurementUnit = projectData?.prj_measurement_unit;
	const totalActualBudget = projectData?.prj_total_actual_budget;

	const physicalBaselineInPercent = calculateProgressPercent(
		requestData?.bdr_physical_baseline,
		measuredFigure
	);

	const financialBaselineInPercent = calculateProgressPercent(
		requestData?.bdr_financial_baseline,
		totalActualBudget
	);

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
				return formatMoney(val, false);
			},
			offsetX: 10,
			style: {
				fontSize: "12px",
				colors: ["#333"],
			},
		},
		xaxis: {
			categories: [
				t("baseline_upto_now"),
				t("bdr_previous_year"),
				t("bdr_before_previous_year"),
				t("total_requested"),
				t("released_amount"),
				t("recommended"),
			],
			labels: {
				formatter: function (val) {
					return formatMoney(val, false);
				},
			},
		},
		colors: ["#17a2b8", "#007bff", "#28a745", "#ffc107"],
		tooltip: {
			y: {
				formatter: function (val) {
					return formatMoney(val, false);
				},
			},
		},
	};

	const chartSeries = [
		{
			name: t("amount"),
			data: [
				requestData?.bdr_financial_baseline || 0,
				requestData?.bdr_previous_year_financial || 0,
				requestData?.bdr_before_previous_year_financial || 0,
				requestData?.bdr_requested_amount || 0,
				requestData?.bdr_released_amount || 0,
				requestData?.bdr_financial_recommended || 0,
			],
		},
	];

	// Calculate summary values with safe fallbacks
	const summaryValues = useMemo(() => {
		const amountData = amounts?.data || [];
		return {
			totalRequested: amountData.reduce(
				(sum, item) => sum + (item.bra_requested_amount || 0),
				0
			),
			currentYearExpense: amountData.reduce(
				(sum, item) => sum + (item.bra_current_year_expense || 0),
				0
			),
			governmentSource: amountData.reduce(
				(sum, item) => sum + (item.bra_source_government_requested || 0),
				0
			),
			internalSource: amountData.reduce(
				(sum, item) => sum + (item.bra_source_internal_requested || 0),
				0
			),
			supportSource: amountData.reduce(
				(sum, item) => sum + (item.bra_source_support_requested || 0),
				0
			),
			creditSource: amountData.reduce(
				(sum, item) => sum + (item.bra_source_credit_requested || 0),
				0
			),
		};
	}, [amounts]);

	return (
		<>
			<BrAmountApproverModal
				isOpen={brAmountModal}
				toggle={toggleBrAmountModal}
				budgetRequestAmount={braAmount}
			/>
			<BudgetSourceApprovalModal
				isOpen={approvalModal}
				toggle={toggleApprovalModal}
				requestData={requestData}
			/>
			<div className="d-flex flex-column gap-4">
				{/* Enhanced Summary Cards with Real Data */}
				<Row className="g-3 align-items-stretch">
					<Col md={3}>
						<Card className="text-center border-primary h-100">
							<CardBody className="py-4 d-flex flex-column justify-content-between">
								<div>
									<div className="h3 text-primary mb-1">
										{formatMoney(requestData?.bdr_requested_amount)}
									</div>
									<small className="text-muted">
										{t("total_requested_amount")}
									</small>
								</div>
								<div className="mt-2">
									<Progress
										value={calculateProgressPercent(
											requestData?.bdr_requested_amount,
											totalActualBudget
										)}
										color="primary"
										className="mb-1"
									/>
									<small className="text-muted">
										{totalActualBudget
											? `${(
													calculateProgressPercent(
														requestData?.bdr_requested_amount,
														totalActualBudget
													) || 0
												).toFixed(1)}%`
											: "—"}{" "}
										{t("of Total Actual Budget")}
									</small>
								</div>
							</CardBody>
						</Card>
					</Col>

					<Col md={3}>
						<Card className="text-center border-success h-100">
							<CardBody className="py-4 d-flex flex-column justify-content-between">
								<div>
									<div className="h3 text-success mb-1">
										{formatMoney(requestData?.bdr_released_amount)}
									</div>
									<small className="text-muted">{t("released_amount")}</small>
								</div>
								<div className="mt-2">
									<Progress
										value={calculateProgressPercent(
											requestData?.bdr_released_amount,
											requestData?.bdr_requested_amount
										)}
										color="success"
										className="mb-1"
									/>
									<small className="text-muted">
										{totalActualBudget
											? `${(
													calculateProgressPercent(
														requestData?.bdr_released_amount,
														requestData?.bdr_requested_amount
													) || 0
												).toFixed(1)}%`
											: "—"}{" "}
										{t("of Requested Amount")}
									</small>
								</div>
							</CardBody>
						</Card>
					</Col>

					<Col md={3}>
						<Card className="text-center border-info h-100">
							<CardBody className="py-4 d-flex flex-column justify-content-between">
								<div>
									<div className="h3 text-info mb-1">
										{formatNumber(
											requestData?.bdr_physical_baseline,
											measurementUnit
										)}
									</div>
									<small className="text-muted">{t("physical_baseline")}</small>
								</div>
								<div className="mt-2">
									<Progress
										value={physicalBaselineInPercent ?? 0}
										color="info"
										className="mb-1"
									/>
									<small className="text-muted">
										{physicalBaselineInPercent != null
											? `${physicalBaselineInPercent.toFixed(1)}%`
											: "—"}{" "}
										{t("of Measured Figure")}
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
										{formatMoney(requestData?.bdr_financial_baseline)}
									</div>
									<small className="text-muted">
										{t("financial_baseline")}
									</small>
								</div>
								<div className="mt-2">
									<Progress
										value={financialBaselineInPercent ?? 0}
										color="warning"
										className="mb-1"
									/>
									<small className="text-muted">
										{financialBaselineInPercent != null
											? `${financialBaselineInPercent.toFixed(1)}%`
											: "—"}{" "}
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
											<td>{getSafeValue(requestData?.request_type)}</td>
										</tr>
										<tr>
											<td className="fw-bold text-muted">{t("status")}:</td>
											<td>
												<Badge
													color={
														statusColorMap[requestData?.bdr_request_status] ||
														"secondary"
													}
												>
													<FaCheckCircle className="me-1" />
													{getSafeValue(requestData?.status_name, t("unknown"))}
												</Badge>
											</td>
										</tr>
										<tr>
											<td className="fw-bold text-muted">
												{t("request_category")}:
											</td>
											<td>
												{getSafeValue(
													bgCategoryMap[requestData?.bdr_request_category_id],
													t("not_specified")
												)}
											</td>
										</tr>
										<tr>
											<td className="fw-bold text-muted">
												{t("bdr_additional_days")}:
											</td>
											<td>
												{getSafeValue(
													bgCategoryMap[requestData?.bdr_additional_days],
													0
												)}
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
												{t("requested_date")}:
											</td>
											<td>
												{getSafeValue(
													requestData?.bdr_requested_date_gc,
													t("no_date")
												)}
											</td>
										</tr>
										<tr>
											<td className="fw-bold text-muted">
												{t("released_date")}:
											</td>
											<td>
												{getSafeValue(
													requestData?.bdr_released_date_gc,
													t("no_date")
												)}
											</td>
										</tr>
										<tr>
											<td className="fw-bold text-muted">
												{t("action_remark")}:
											</td>
											<td>
												{getSafeValue(
													requestData?.bdr_action_remark,
													t("no_remarks")
												)}
											</td>
										</tr>
									</tbody>
								</Table>
							</Col>
						</Row>
					</CardBody>
				</Card>

				{/* Budget Sources Approval Card */}
				<Card>
					<CardHeader className="bg-light">
						<div className="d-flex justify-content-between align-items-center">
							<div>
								<h5 className="mb-1">{t("budget_sources_approval")}</h5>
								<small className="text-muted">
									{t("approve_budget_sources_subtitle")}
								</small>
							</div>
							<Button color="success" size="sm" onClick={toggleApprovalModal}>
								<FaCheck className="me-1" />
								{t("approve_sources")}
							</Button>
						</div>
					</CardHeader>
					<CardBody>
						<Row>
							<Col md={6}>
								<Table borderless className="mb-0">
									<thead>
										<tr>
											<th className="fw-bold text-muted">{t("source")}</th>
											<th className="fw-bold text-muted text-end">
												{t("requested")}
											</th>
											<th className="fw-bold text-muted text-end">
												{t("approved")}
											</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td className="fw-bold text-muted">
												{t("bdr_source_government")}:
											</td>
											<td className="text-end">
												{formatMoney(
													requestData?.bdr_source_government_requested,
													true
												)}
											</td>
											<td className="text-end">
												<Badge color="success">
													{formatMoney(
														requestData?.bdr_source_government_approved,
														true
													)}
												</Badge>
											</td>
										</tr>
										<tr>
											<td className="fw-bold text-muted">
												{t("bdr_source_support")}:
											</td>
											<td className="text-end">
												{formatMoney(
													requestData?.bdr_source_support_requested,
													true
												)}
											</td>
											<td className="text-end">
												<Badge color="success">
													{formatMoney(
														requestData?.bdr_source_support_approved,
														true
													)}
												</Badge>
											</td>
										</tr>
									</tbody>
								</Table>
							</Col>
							<Col md={6}>
								<Table borderless className="mb-0">
									<thead>
										<tr>
											<th className="fw-bold text-muted">{t("source")}</th>
											<th className="fw-bold text-muted text-end">
												{t("requested")}
											</th>
											<th className="fw-bold text-muted text-end">
												{t("approved")}
											</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td className="fw-bold text-muted">
												{t("bdr_source_credit")}:
											</td>
											<td className="text-end">
												{formatMoney(
													requestData?.bdr_source_credit_requested,
													false
												)}
											</td>
											<td className="text-end">
												<Badge color="success">
													{formatMoney(
														requestData?.bdr_source_credit_approved,
														false
													)}
												</Badge>
											</td>
										</tr>
										<tr>
											<td className="fw-bold text-muted">
												{t("bdr_source_other")}:
											</td>
											<td className="text-end">
												{formatMoney(
													requestData?.bdr_source_other_requested,
													false
												)}
											</td>
											<td className="text-end">
												<Badge color="success">
													{formatMoney(
														requestData?.bdr_source_other_approved,
														false
													)}
												</Badge>
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
											label: t("baseline_upto_now"),
											value: requestData?.bdr_physical_baseline,
										},
										{
											label: t("bdr_previous_year"),
											value: requestData?.bdr_previous_year_physical,
										},
										{
											label: t("bdr_before_previous_year"),
											value: requestData?.bdr_before_previous_year_physical,
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
												<small>
													{formatNumber(item.value, measurementUnit)}
												</small>
											</div>
											<Progress
												value={
													calculateProgressPercent(
														item.value,
														measuredFigure
													) ?? 0
												}
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
											height="260"
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
									{formatMoney(summaryValues.totalRequested)}
								</div>
								<small className="text-muted">{t("total_requested")}</small>
							</CardBody>
						</Card>
					</Col>
					<Col md={2}>
						<Card className="text-center">
							<CardBody className="py-4">
								<div className="h4 text-success mb-1">
									{formatMoney(summaryValues.currentYearExpense)}
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
									{formatMoney(summaryValues.governmentSource)}
								</div>
								<small className="text-muted">{t("government_source")}</small>
							</CardBody>
						</Card>
					</Col>
					<Col md={2}>
						<Card className="text-center">
							<CardBody className="py-4">
								<div className="h4 text-info mb-1">
									{formatMoney(summaryValues.internalSource)}
								</div>
								<small className="text-muted">{t("internal_source")}</small>
							</CardBody>
						</Card>
					</Col>
					<Col md={2}>
						<Card className="text-center">
							<CardBody className="py-4">
								<div className="h4 text-secondary mb-1">
									{formatMoney(summaryValues.supportSource)}
								</div>
								<small className="text-muted">{t("support_source")}</small>
							</CardBody>
						</Card>
					</Col>
					<Col md={2}>
						<Card className="text-center">
							<CardBody className="py-4">
								<div className="h4 text-dark mb-1">
									{formatMoney(summaryValues.creditSource)}
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
