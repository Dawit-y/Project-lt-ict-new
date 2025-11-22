import React, { useMemo } from "react";
import ReportTable from "./ReportTable";
import { useTranslation } from "react-i18next";

const FinancialProjectsTable = ({ data = [], exportSearchParams }) => {
	const { t } = useTranslation();

	const columnsConfig = useMemo(
		() => [
			{
				id: "sector",
				label: t("Sector"),
				minWidth: 100,
			},
			{
				id: "prj_name",
				label: t("Project Name"),
				minWidth: 150,
				sticky: true,
			},
			{
				id: "prj_measurement_unit",
				label: t("Unit"),
				minWidth: 60,
			},
			{
				id: "prj_measured_figure",
				label: t("Measured Figure"),
				minWidth: 80,
				format: "number",
			},
			{
				id: "prj_status",
				label: t("Status"),
				minWidth: 80,
			},
			{
				id: "project_category",
				label: t("Category"),
				minWidth: 100,
			},
			{
				id: "prj_code",
				label: t("Project Code"),
				minWidth: 80,
			},
			// Location Information Group
			{
				id: "prj_location_description",
				label: t("Specific Site"),
				minWidth: 120,
				group: "location_information",
			},
			{
				id: "zone",
				label: t("Zone"),
				minWidth: 100,
				group: "location_information",
			},
			{
				id: "woreda",
				label: t("Woreda"),
				minWidth: 100,
				group: "location_information",
			},
			{
				id: "start_year",
				label: t("Start Year"),
				minWidth: 60,
				format: "number",
			},
			{
				id: "end_year",
				label: t("End Year"),
				minWidth: 60,
				format: "number",
			},
			// Physical Performance Group
			{
				id: "bdr_before_previous_year_physical",
				label: t("Before Previous Year"),
				minWidth: 80,
				format: "number",
				group: "physical_performance",
			},
			{
				id: "bdr_previous_year_physical",
				label: t("Previous Year"),
				minWidth: 80,
				format: "number",
				group: "physical_performance",
			},
			{
				id: "bdr_physical_baseline",
				label: t("Physical Baseline"),
				minWidth: 80,
				format: "number",
				group: "physical_performance",
			},
			// Physical Action Plan Group
			{
				id: "bdr_physical_planned",
				label: t("Physical Planned"),
				minWidth: 80,
				format: "number",
				group: "physical_action_plan",
			},
			{
				id: "bdr_physical_approved",
				label: t("Physical Approved"),
				minWidth: 80,
				format: "number",
				group: "physical_action_plan",
			},
			// Budget Information Group
			{
				id: "prj_total_estimate_budget",
				label: t("Total Estimated Budget"),
				minWidth: 100,
				format: "currency",
				group: "budget_information",
			},
			{
				id: "bdr_before_previous_year_financial",
				label: t("Before Previous Year"),
				minWidth: 80,
				format: "currency",
				group: "budget_information",
			},
			{
				id: "bdr_previous_year_financial",
				label: t("Previous Year"),
				minWidth: 80,
				format: "currency",
				group: "budget_information",
			},
			{
				id: "bdr_financial_baseline",
				label: t("Financial Baseline"),
				minWidth: 80,
				format: "currency",
				group: "budget_information",
			},
			// Current Budget Plan Group
			{
				id: "bdr_requested_amount",
				label: t("Requested Amount"),
				minWidth: 80,
				format: "currency",
				group: "current_budget_plan",
			},
			{
				id: "bdr_released_amount",
				label: t("Released Amount"),
				minWidth: 80,
				format: "currency",
				group: "current_budget_plan",
			},
			// Budget Sources Group
			{
				id: "bdr_source_government_approved",
				label: t("Government Approved"),
				minWidth: 80,
				format: "currency",
				group: "budget_sources",
			},
			{
				id: "bdr_source_internal_requested",
				label: t("Internal Requested"),
				minWidth: 80,
				format: "currency",
				group: "budget_sources",
			},
			{
				id: "bdr_source_other_approved",
				label: t("Other Approved"),
				minWidth: 80,
				format: "currency",
				group: "budget_sources",
			},
			{
				id: "budget_sources_total",
				label: t("Total"),
				minWidth: 80,
				format: "currency",
				group: "budget_sources",
			},
		],
		[t]
	);

	const prepareExportData = (filteredData) => {
		return filteredData.map((item) => ({
			...item,
			budget_sources_total:
				(Number(item.bdr_source_government_approved) || 0) +
				(Number(item.bdr_source_internal_requested) || 0) +
				(Number(item.bdr_source_other_approved) || 0),
		}));
	};

	return (
		<ReportTable
			data={data}
			columnsConfig={columnsConfig}
			groupBy="sector"
			headerStructure="grouped"
			prepareExportData={prepareExportData}
			searchFields={["sector", "prj_name", "prj_code"]}
			tableName="Financial Data"
			exportSearchParams={exportSearchParams}
		/>
	);
};

export default FinancialProjectsTable;
